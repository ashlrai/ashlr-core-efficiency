/**
 * @ashlr/core-efficiency — public barrel.
 *
 * Consumers should prefer subpath imports (`@ashlr/core-efficiency/genome`,
 * `/compression`, `/budget`, `/tokens`, `/types`) for tree-shaking. The root
 * barrel is convenience-only and resolves the naming collision between
 * `tokens.estimateTokens` and `genome/manifest.estimateTokens` (same impl,
 * alias the manifest one to avoid ambiguity).
 */

export * from "./types/index.ts";
export * from "./tokens/index.ts";
export * from "./budget/index.ts";
export * from "./compression/index.ts";
export {
  createEmptyManifest,
  estimateTokens as estimateTokensManifest,
  type GenerationMeta,
  type GenomeManifest,
  genomeDir,
  genomeExists,
  loadManifest,
  manifestPath,
  readSection,
  saveManifest,
  type SectionMeta,
  sectionPath,
  totalGenomeTokens,
  updateManifest,
  writeSection,
} from "./genome/manifest.ts";
export * from "./genome/embeddings.ts";
export * from "./genome/fitness.ts";
export * from "./genome/generations.ts";
export * from "./genome/init.ts";
export * from "./genome/jsonl.ts";
export * from "./genome/retriever.ts";
export * from "./genome/scribe.ts";
export * from "./genome/strategies.ts";
