import { describe, expect, test } from "bun:test";
import { sep } from "path";
import { genomeDir, manifestPath, sectionPath } from "../src/genome/manifest.ts";

describe("genomeDir / manifestPath", () => {
  test("genomeDir joins cwd with .ashlrcode/genome using platform separator", () => {
    const cwd = `${sep}tmp${sep}proj`;
    expect(genomeDir(cwd)).toBe(`${sep}tmp${sep}proj${sep}.ashlrcode${sep}genome`);
  });

  test("manifestPath appends manifest.json", () => {
    const cwd = `${sep}tmp${sep}proj`;
    expect(manifestPath(cwd)).toBe(
      `${sep}tmp${sep}proj${sep}.ashlrcode${sep}genome${sep}manifest.json`,
    );
  });
});

describe("sectionPath", () => {
  test("resolves a simple relative section path under the genome dir", () => {
    const cwd = `${sep}tmp${sep}proj`;
    const resolved = sectionPath(cwd, "vision/north-star.md");
    // `join` normalizes forward slashes to platform sep, so the resolved path
    // should always start with the genome dir + platform sep.
    expect(resolved.startsWith(`${genomeDir(cwd)}${sep}`)).toBe(true);
  });

  test("accepts nested relative section paths", () => {
    const cwd = `${sep}tmp${sep}proj`;
    const resolved = sectionPath(cwd, "decisions/2026/north-star.md");
    expect(resolved.startsWith(`${genomeDir(cwd)}${sep}`)).toBe(true);
  });

  test("rejects traversal attempts that escape the genome dir", () => {
    const cwd = `${sep}tmp${sep}proj`;
    expect(() => sectionPath(cwd, "../../../etc/passwd")).toThrow(
      /escapes genome directory/,
    );
  });

  test("rejects sibling directories that share a prefix with the genome dir", () => {
    // `.ashlrcode/genome-evil/foo.md` resolves inside the project but outside
    // the real genome dir. The separator-appended prefix check guards against
    // the "genome" vs "genome-evil" prefix-match bug.
    const cwd = `${sep}tmp${sep}proj`;
    expect(() => sectionPath(cwd, "../genome-evil/foo.md")).toThrow(
      /escapes genome directory/,
    );
  });

  test("regression: accepts relative path containing forward slashes on any platform", () => {
    // Prior to the path.sep fix this threw on Windows because `join` produced
    // a "\"-separated absolute path but the prefix check appended "/".
    const cwd = `${sep}tmp${sep}proj`;
    expect(() => sectionPath(cwd, "vision/north-star.md")).not.toThrow();
  });
});
