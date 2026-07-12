# SOUL roadmap

Inspired by Hanong/Seeside phased delivery + SOUL executive deck (Codex source materials).

## North star

> A card you tap. A lifetime you unlock.  
> Memory infrastructure for universities — starting as an honest prototype.

## Phase 0 — Prototype (now · live)

- [x] Marketing landing + design system from deck
- [x] NFC tap simulation + reward redeem (in-memory)
- [x] Collections + live catalog API
- [x] Admin control center (demo ops)
- [x] Member space routes (wallet, cards, memories)
- [x] Public deploy `soulplatform.vercel.app`
- [x] Health/status, smoke tests, multi-agent collab docs

## Phase 1 — Durable demo (next)

- [ ] Postgres repository behind `SoulRepository` (migration already in `supabase/migrations`)
- [ ] Shared rate limit (KV/Redis or Supabase RPC) for redeem + admin login
- [ ] Signed NFC URLs wired end-to-end (`NFC_SIGNING_SECRET` + admin provision UI)
- [ ] Playwright: tap → unlock → redeem happy path
- [ ] Real OG/SEO polish; optional custom domain

## Phase 2 — Campus pilot readiness

- [ ] SSO / university IdP path design
- [ ] PDPA notices + retention + export/delete stubs
- [ ] Object storage for memory media (signed upload)
- [ ] Ops RBAC (owner/admin/curator) beyond break-glass password
- [ ] NTAG424 DNA SUN verification path (optional hardware)

## Phase 3 — Productization

- [ ] Real ownership + transfer transactions (not tap-as-ownership)
- [ ] Points ledger + reward fulfillment partners
- [ ] Multi-university tenancy
- [ ] Analytics without PII (aggregate thresholds)

## Explicit non-goals (prototype)

- Blockchain “authenticity” theater  
- Collecting student PII into NFC URLs  
- Claiming anti-clone on NTAG216 static tokens  
