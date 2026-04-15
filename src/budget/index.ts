/**
 * Provider-aware prompt budgeting — extracted from ashlrcode.
 *
 * Behavior preserved exactly: substring match + 100K default fallback,
 * matching ashlrcode/src/agent/context.ts behavior so tests pass against
 * either consumer.
 */

/** System prompt gets this fraction of the provider's context limit. */
export const SYSTEM_PROMPT_BUDGET_RATIO = 0.05;
/** Hard cap so 2M-context providers (xAI) don't give a runaway budget. */
export const SYSTEM_PROMPT_BUDGET_CAP = 50_000;
/** Fallback when the provider name isn't recognized. Matches ashlrcode. */
export const DEFAULT_CONTEXT_LIMIT = 100_000;

/** Known provider context limits (tokens). */
export const PROVIDER_CONTEXT_LIMITS: Record<string, number> = {
  xai: 2_000_000,
  anthropic: 200_000,
  openai: 128_000,
  ollama: 32_000, // Conservative default; most local models are 4K-128K
  groq: 128_000,
  deepseek: 128_000,
};

/**
 * Look up a provider's context token limit.
 *
 * Uses case-insensitive substring match so that compound provider names like
 * "xai-grok-4" or "anthropic-claude-sonnet" still resolve. Falls back to
 * {@link DEFAULT_CONTEXT_LIMIT} for unknown providers.
 */
export function getProviderContextLimit(providerName: string): number {
  const lower = providerName.toLowerCase();
  for (const [key, limit] of Object.entries(PROVIDER_CONTEXT_LIMITS)) {
    if (lower.includes(key)) return limit;
  }
  return DEFAULT_CONTEXT_LIMIT;
}

/**
 * Compute system-prompt token budget for a given provider.
 *
 * Default: 5% of the provider context limit, capped at 50K.
 * Replaces the inline math at `ashlrcode/src/cli.ts:274-281` and the
 * hardcoded `50_000` at `ashlrcode/src/agent/bootstrap.ts:201`.
 */
export function systemPromptBudget(
  providerName: string,
  ratio: number = SYSTEM_PROMPT_BUDGET_RATIO,
  cap: number = SYSTEM_PROMPT_BUDGET_CAP,
): number {
  const limit = getProviderContextLimit(providerName);
  return Math.min(Math.floor(limit * ratio), cap);
}
