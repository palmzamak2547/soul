# SOUL autonomous development log

## 2026-07-12 — pass 1 (lint + catalog + ops)

- Fixed ESLint: unused imports, `setState` in effect (`MemberShell` remount-on-route).
- Added `GET /api/cards` public catalog with rate limit.
- Extended repository with `listPublicCatalog()`.
- Health endpoint now returns `version`, `commit`, `region`, `site`.
- Collections page surfaces live demo tokens from API.
- Footer + metadata point at `soulplatform.vercel.app`; marketing pages indexable.
- Added `tests/smoke.mjs`, `tests/repository-catalog.test.mjs`, npm scripts `test:unit` / `smoke`.
- Version bumped to `0.2.0`.

## 2026-07-12 — pass 2 (tap data + nfc + status)

- Fixed TapExperience `normalizeCard` to map real `PublicCollectibleCard` API payloads (was stuck on Kasem fallback).
- Added `lib/soul/nfc-sign.ts` (HMAC opaque URL sign/verify) for production migration path.
- Added `/status` human-readable health page.
- Version `0.3.0`.

## Next candidates (auto queue)

1. Durable store (Postgres) behind `SoulRepository` using existing Supabase migration.
2. Shared rate-limit store (KV/Redis) for multi-instance correctness.
3. Wire signed NFC helper into admin provisioning UI.
4. Mount real member App Router pages from existing components.
5. Playwright smoke for tap → redeem happy path.
6. Accessibility pass on admin/ops panels (focus traps, live regions).
