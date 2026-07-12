# SOUL Design QA

- Source visual truth: `C:/Users/palmz/Documents/Codex/2026-07-10/new-chat/work/pdfs/soul/page-01.png`
- Supporting source asset: `C:/Users/palmz/Documents/Codex/2026-07-10/new-chat/tmp/pdfs/pdf_strategy/assets/p1-001.png`
- Implementation screenshot: `C:/Users/palmz/Documents/Codex/2026-07-10/new-chat/outputs/soul-phygital-platform/qa/home-desktop-final.png`
- Full-view comparison: `C:/Users/palmz/Documents/Codex/2026-07-10/new-chat/outputs/soul-phygital-platform/qa/design-comparison-home.jpg`
- Focused hero comparison: `C:/Users/palmz/Documents/Codex/2026-07-10/new-chat/outputs/soul-phygital-platform/qa/design-comparison-hero-detail.jpg`
- Viewports: desktop 1585 × 1000 browser content area; mobile responsive override 390 × 844
- States: landing hero, tap ready, tap unlocked, reward redeemed, collection filter, personalization success, admin login, admin overview, NFC provisioning, mobile landing/tap/admin

## Full-view comparison evidence

The implementation preserves the source deck's defining system: near-white/blush canvas, oversized black Sora display type, hot-pink emphasis, mono uppercase metadata, generous editorial whitespace, rounded low-shadow panels, and the supplied rose-gold collectible image. The landing adapts the source cover into a consumer product hero without changing its brand language.

## Focused region comparison evidence

The supplied collectible image is used directly, compressed to WebP without subject substitution. The implementation keeps the card centered, sharp, and warm-toned, enlarges it for product clarity, and adds restrained NFC/edition UI that does not obscure the university crest, owner sample, or edition number. No source logo, product image, badge, or decorative asset was replaced with CSS or handmade SVG art.

## Required fidelity surfaces

- Fonts and typography: Sora display, Noto Sans Thai body, and JetBrains Mono metadata reproduce the deck hierarchy; Thai and Latin wrapping is clean at desktop and 390 px mobile.
- Spacing and layout rhythm: editorial whitespace and large section gaps match the source. Desktop grid, 900/640 px breakpoints, touch targets, cards, timeline, drawers, and fixed mobile admin navigation show no horizontal overflow.
- Colors and visual tokens: paper/blush/ink/hot-pink are faithful to the SOUL deck. Navy/cyan appear only inside the tap reveal and admin operational surfaces, consistent with the secondary phygital badge direction.
- Image quality and asset fidelity: the supplied card and badge assets remain sharp with correct crops. WebP conversion reduces transfer size without visible halos, stretching, or compression artifacts.
- Copy and content: product-specific copy comes from the supplied decks, translated/adapted for the core consumer flow. Applicant PII and unsupported commercial claims are excluded; all admin metrics are labeled fictional demo data.

## Interaction and browser verification

- Landing navigation, CTA links, responsive menu, and section layouts rendered successfully.
- Valid demo token resolved through `GET /api/cards/[token]`; invalid token returns a generic 404 state.
- Tap sequence completed from ready → link check → identity → badge → memory dashboard.
- Reward endpoint returned success and idempotent replay behavior; UI displayed `Redeemed in demo`.
- Collection filters reduced the catalog from four to two faculty cards after animation.
- Personalization drawer accepted local-only sample values and displayed the non-payment success state.
- Admin rejected an incorrect code, accepted the local demo code, set an HttpOnly session, loaded fictional metrics, changed tabs, and completed a demo provisioning action.
- Desktop and mobile layouts had `scrollWidth === clientWidth` in tested states.
- Browser console had no application errors after the final restart; only the expected browser-level reduced-motion notice was present.

## Comparison history

1. P1 — Reduced-motion hydration mismatch left server-rendered motion elements at zero opacity. Fixed by making initial and reveal states deterministic; verified visible content and no new hydration error in a fresh tab.
2. P1 — The completed unlock stage occupied a full viewport and hid the memory dashboard. Added `phase-unlocked` heights of 360 px desktop and 300 px mobile; browser-computed mobile height verified at 300 px with profile metrics visible in the first screen.
3. P2 — Turbopack inferred the wrong monorepo root and served stale CSS during QA. Set `turbopack.root` to the project directory, restarted, and verified the updated responsive rules in the loaded stylesheet.

## Findings

No actionable P0, P1, or P2 visual, responsive, interaction, or accessibility differences remain.

## Follow-up polish

- P3: Replace the supplied named card sample with a formally approved anonymized production render before a public university launch.
- P3: Re-run screenshots without the Next.js development badge when a production checkpoint is available.

final result: passed
