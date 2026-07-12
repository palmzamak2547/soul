# Portfolio learnings applied to SOUL

Surveyed 2026-07-12 across Palm’s GitHub + local machine (Claude-built + Codex-built).  
Purpose: steal **operating patterns**, not copy products.

## Portfolio map (relevant to SOUL)

| Project | Role | Stack DNA | Lesson for SOUL |
|---|---|---|---|
| **Tipjai** (`C:\dev\tipjai`) | Live money product | Next + Supabase + durable rate limit + PDPA delete + Sentry | Fail-closed secrets, rate limit in every mutation API, never store full sensitive IDs |
| **Seeside** (`C:\dev\seeside`) | Foundation OS | Mock boundaries → real later, PARALLEL_WORK_AGREEMENT, SECURITY.md, ROADMAP | Explicit mock/prod boundary; multi-agent zones; docs that prevent thrash |
| **WebCUVETSMO** | Student-union hub | Auth + admin CMS + PWA + docs culture | Role lockdown, admin CMS patterns, community trust |
| **cuvetsmo-ai** | Public AI surface | Academic safety, observability notes, e2e | Claims discipline; rate-limit notes; privacy defaults |
| **Hanong** | Welfare product | Hyperlocal + privacy + phased roadmap | Clear phase table; free-for-users framing; mobile-first |
| **VetMock** | Exam prep | High-stakes student UX | Input lag discipline, faculty-safe language |
| **Athene suite** | Agent tooling | CLI / design / bridge | Agent-readable AGENTS.md + tool boundaries |
| **Family hubs** | Astro sites | Brand micro-sites | Clean domain + brand mark discipline |
| **SOUL** (this) | Phygital memory | Codex prototype → Palm agents shipping | Keep prototype honesty + ship continuously |

## Patterns we encode in SOUL

1. **Prototype honesty** (Seeside): demo data labeled; no fake ownership/payments claims.
2. **Security floor** (Tipjai): same-origin mutations, Zod bodies, rate limits, no-store headers, admin fail-closed in production.
3. **Multi-contributor safety** (Seeside parallel agreement + collaborators `palmzamak2547` / `kasemjeff`): fetch/rebase before push, never force-push main, stage specific paths.
4. **Agent ops** (Athene / cuvetsmo-ai): `AGENTS.md`, `preflight`, smoke after deploy.
5. **Product story** (deck + Hanong): north-star narrative + phased roadmap, not feature dump.
6. **Deploy hygiene** (CUVETSMO family): Vercel on personal GitHub; primary domain short; health/status pages.

## What SOUL must become (from deck + portfolio)

- Beachhead: university phygital collectible (Chula-inspired prototype language only; marks need permission).
- Loop: Tap → Identity → Memory timeline → Badge/points → Redeem preview → Ops control center.
- Production migration path already sketched in `ARCHITECTURE.md` (Postgres, shared rate limit, SSO, PDPA, NTAG424).

## Do-not-copy

- Tipjai payment rails / real PII paths into SOUL prototype.
- University trademarks into public marketing without written permission.
- Live secrets into git or agent transcripts.
