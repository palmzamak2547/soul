# SOUL autonomous development log

## 2026-07-12 — pass 1 (lint + catalog + ops)

- Fixed ESLint; `GET /api/cards`; enriched health; collections live tokens; smoke/unit tests.
- Version `0.2.0`.

## 2026-07-12 — pass 2 (tap data + nfc + status)

- Fixed TapExperience API mapping; `nfc-sign` helpers; `/status` page. Version `0.3.0`.

## 2026-07-12 — pass 3 (member routes)

- Mounted `/member/*` shell pages. Version `0.4.0`.

## 2026-07-12 — pass 4 (member deep routes)

- `/member/cards/[cardId]` detail, transfer, memory create/edit. Version `0.5.0`.

## 2026-07-12 — portfolio-informed pass

- Surveyed Palm GitHub + local portfolio (Tipjai, Seeside, WebCUVETSMO, cuvetsmo-ai, Hanong, Athene, hubs, Codex SOUL sources).
- Added `PORTFOLIO_LEARNINGS.md`, `AGENTS.md`, `ROADMAP.md`, `SECURITY.md`, rewritten README, collab preflight.
- Admin `POST /api/admin/nfc/sign` + Cards panel Sign NFC URL.
- Fourth seed card (Reunion Echo); not-found recovery; collaborator-safe git rules.
- Version `0.6.0`.

## 2026-07-12 — UX polish 0.8.0

- Slim primary header (3 links + CTA); mobile drawer with backdrop + scroll lock
- Hero CTAs reduced to 2; Thai trust chips; secondary text links
- Member bottom tabbar 4 slots, larger labels, safe-area
- Member page headers more readable
- Admin login clarity + dual exit links
- Tap ready panel shows card name/serial + primary button style

## Next candidates (auto queue)

1. Postgres repository swap (migration exists under `supabase/migrations`).
2. Durable rate limit (Tipjai `rate_hit` pattern).
3. Playwright tap → redeem.
4. Accessibility pass on ops panels.
5. Optional custom domain under owned brands.

## 2026-07-12 � continuous 0.7.0

- Member demo APIs: me, profile, cards, memories, rewards, settings (LIVE DATA badge path).
- Envelope unwrap in useMemberResource / memberMutation.
- Durable rate-limit boundary (Tipjai-style fail-degraded) on redeem + admin login.
- /universities campus story page; nav + sitemap + robots.
- Version 0.7.0.

## 2026-07-12 � bugfix 0.7.2

Critical user-facing bugs fixed:
1. useMemberResource infinite re-fetch (fallback in deps + inline .slice())
2. Settings page crash: API shape nested vs UI flat (sessions/defaultPrivacy)
3. Rewards missing tier ? blank UI; normalizeWallet defensive
4. Tap redeem hard-coded reward-pink-sky-wallpaper ? card.primaryRewardId
5. Status health multi-base fetch fallback
