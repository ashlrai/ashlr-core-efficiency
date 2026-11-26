# Ashlr Core Efficiency agent instructions

## Article 1: Full autonomy, always forward

Follow the [Ashlr Fleet Constitution, Article 1](https://github.com/ashlrai/phantom/blob/master/AGENTS.md#article-1-full-autonomy-always-forward). Keep PR and merge actions within the signed standing scope. Use GitHub auto-merge where available with the required checks and existing protections. Honor Security GATES v3 and the fleet hold list. No force-push to default branches, admin overrides, billing changes, secret disclosure, or making private material public.

## Verify

Run `bun install --frozen-lockfile`, `bun run typecheck`, `bun test` and `bun run build` before opening a PR. Keep the supported Bun and Node runtime checks in the verification suite.
