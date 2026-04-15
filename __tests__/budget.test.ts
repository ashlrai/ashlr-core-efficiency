import { describe, expect, test } from "bun:test";
import {
  DEFAULT_CONTEXT_LIMIT,
  getProviderContextLimit,
  PROVIDER_CONTEXT_LIMITS,
  SYSTEM_PROMPT_BUDGET_CAP,
  SYSTEM_PROMPT_BUDGET_RATIO,
  systemPromptBudget,
} from "../src/budget/index.ts";

describe("PROVIDER_CONTEXT_LIMITS", () => {
  test("covers all known providers", () => {
    for (const p of ["xai", "anthropic", "openai", "ollama", "groq", "deepseek"]) {
      expect(PROVIDER_CONTEXT_LIMITS[p]).toBeGreaterThan(0);
    }
  });

  test("xai has 2M context", () => {
    expect(PROVIDER_CONTEXT_LIMITS.xai).toBe(2_000_000);
  });

  test("budget constants are reasonable", () => {
    expect(SYSTEM_PROMPT_BUDGET_RATIO).toBe(0.05);
    expect(SYSTEM_PROMPT_BUDGET_CAP).toBe(50_000);
    expect(DEFAULT_CONTEXT_LIMIT).toBe(100_000);
  });
});

describe("getProviderContextLimit", () => {
  test("case-insensitive exact match", () => {
    expect(getProviderContextLimit("Anthropic")).toBe(200_000);
    expect(getProviderContextLimit("ANTHROPIC")).toBe(200_000);
  });

  test("substring match — compound provider names resolve", () => {
    expect(getProviderContextLimit("xai-grok-4")).toBe(2_000_000);
    expect(getProviderContextLimit("anthropic-claude-sonnet")).toBe(200_000);
  });

  test("falls back to 100K for unknown providers", () => {
    expect(getProviderContextLimit("made-up-provider")).toBe(DEFAULT_CONTEXT_LIMIT);
  });

  test("empty string falls back to default", () => {
    expect(getProviderContextLimit("")).toBe(DEFAULT_CONTEXT_LIMIT);
  });
});

describe("systemPromptBudget", () => {
  test("5% of xai 2M caps at 50K", () => {
    expect(systemPromptBudget("xai")).toBe(50_000);
  });

  test("5% of Anthropic 200K is 10K", () => {
    expect(systemPromptBudget("anthropic")).toBe(10_000);
  });

  test("5% of ollama 32K is 1.6K", () => {
    expect(systemPromptBudget("ollama")).toBe(1_600);
  });

  test("unknown provider → 5% of 100K = 5K", () => {
    expect(systemPromptBudget("???")).toBe(5_000);
  });

  test("custom ratio respected", () => {
    expect(systemPromptBudget("anthropic", 0.1)).toBe(20_000);
  });

  test("custom cap respected", () => {
    expect(systemPromptBudget("xai", 0.05, 10_000)).toBe(10_000);
  });
});
