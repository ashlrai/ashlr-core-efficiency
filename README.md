# @ashlr/core-efficiency

Token-efficiency primitives for AI coding agents. Extracted from [ashlrcode](https://github.com/masonwyatt23/ashlrcode) and consumed by both the `ashlrcode` CLI and the [ashlr-plugin](https://github.com/masonwyatt23/ashlr-plugin) for Claude Code.

**One library, multiple consumers.** Evolution happens in one place.

## What's inside

| Module | Size | Purpose |
|--------|------|---------|
| [`/genome`](./src/genome) | ~2,342 LOC | Self-evolving project specs via RAG + scribe protocol. Manifest CRUD, TF-IDF/Ollama retrieval, fitness-based strategy evolution, mutation audit trail. |
| [`/compression`](./src/compression) | ~470 LOC | 3-tier context compression: `autoCompact` (LLM summarize old turns), `snipCompact` (truncate tool results > 2KB), `contextCollapse` (drop short/dup). Plus `PromptPriority` enum. |
| [`/budget`](./src/budget) | ~50 LOC | Provider-aware prompt budgeting. `getProviderContextLimit`, `systemPromptBudget(provider, 0.05, 50K cap)`. |
| [`/tokens`](./src/tokens) | ~50 LOC | Single-impl token estimation (chars/4 heuristic). |
| [`/types`](./src/types) | ~60 LOC | `Message`, `ContentBlock`, `LLMSummarizer`, `StreamEvent`, `ProviderRequest`. |

## Install

```bash
bun add @ashlr/core-efficiency
# or from the repo directly during development:
bun add file:../ashlr-core-efficiency
```

## Use

```typescript
import {
  autoCompact,
  snipCompact,
  contextCollapse,
  PromptPriority,
} from "@ashlr/core-efficiency/compression";

import {
  getProviderContextLimit,
  systemPromptBudget,
} from "@ashlr/core-efficiency/budget";

import {
  retrieveSectionsV2,
  injectGenomeContext,
  genomeExists,
} from "@ashlr/core-efficiency/genome";

import { estimateTokensFromString } from "@ashlr/core-efficiency/tokens";
import type { Message, LLMSummarizer } from "@ashlr/core-efficiency/types";
```

Or import everything from the root barrel:

```typescript
import {
  autoCompact,
  getProviderContextLimit,
  retrieveSectionsV2,
  estimateTokensFromString,
} from "@ashlr/core-efficiency";
```

## Test

```bash
bun install
bun test       # ~17 tests (budget + tokens); genome/compression tests live in ashlrcode
bun run typecheck
```

Integration tests live in the [ashlrcode repo](https://github.com/masonwyatt23/ashlrcode) — that's where all 746 tests run against a real-world consumer.

## Design notes

- **`LLMSummarizer` interface**: `autoCompact` and genome `scribe` depend on a minimal `{ stream(ProviderRequest): AsyncGenerator<StreamEvent> }` contract, not a concrete router. Consumers inject their own provider. ashlrcode's `ProviderRouter` structurally satisfies it.
- **`PromptPriority` enum**: 12 named slots (Core=0 → Undercover=95). Numeric values are stable so raw-int callers still work.
- **`estimateTokens`**: previously duplicated in three places in ashlrcode. Now one implementation, two entry points: `FromString` and `FromMessages` (walks `ContentBlock[]` including tool_use/tool_result).
- **Genome `commands.ts`**: deliberately kept in ashlrcode (CLI layer, not library code).

## License

MIT — see [LICENSE](./LICENSE).
