# AGENTS.md — coding agents on SOUL

You are one of several agents (Claude Code, Grok, Codex) that may touch this repo.
Collaborators may include humans (`palmzamak2547`, `kasemjeff`).

## Iron rules

1. **`git fetch origin` first.** If `origin/main` is ahead: `git pull --rebase origin main` before edits.
2. **Never `git push --force` to `main`.**
3. **Stage specific paths** — no blind `git add -A` when noise exists (`.env*`, screenshots kits, secrets).
4. **Do not delete unfamiliar files/branches** — investigate; another agent or human may own them.
5. **No secrets in commits** (`.env`, service role keys, admin passwords, NFC master keys).
6. **Prototype honesty** — no claims of real ownership, payments, shipping, or anti-clone NFC authenticity.
7. After shipping: `npm run smoke` against `https://soulplatform.vercel.app`.

## Preferred quality bar (from Palm portfolio)

- Lint + typecheck + unit tests green before production deploy.
- API mutations: same-origin + Zod + rate limit + no-store (Tipjai pattern).
- Prefer additive modules over rewriting large shared components when parallel agents may be active.
- Document non-obvious product/security decisions in `DEVELOPMENT_LOG.md`.

## Safe parallel zones

| Safe to fan out | Coordinate carefully |
|---|---|
| `app/api/**` new routes | `lib/soul/repository.ts` interface |
| `tests/**`, `scripts/**` | `components/*` mega-files |
| `docs` markdown | `package.json` scripts (merge carefully) |

## Product domain

- Primary URL: https://soulplatform.vercel.app  
- GitHub: https://github.com/palmzamak2547/soul  
- Local: `Documents/Codex/2026-07-10/new-chat/outputs/soul-phygital-platform`

See also: `COLLABORATION.md`, `PORTFOLIO_LEARNINGS.md`, `ARCHITECTURE.md`.
