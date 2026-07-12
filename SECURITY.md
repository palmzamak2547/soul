# SECURITY.md — SOUL prototype

Patterns adapted from Tipjai (live money) and Seeside foundation docs, scaled to a **public prototype**.

## Threat model (current)

| Surface | Risk | Current control |
|---|---|---|
| Admin login | Brute force | Rate limit 5/10m · fail-closed production secrets · HttpOnly cookie · SameSite=Strict |
| Redeem / mutations | CSRF / abuse | Same-origin check · Zod body · rate limit · idempotency keys |
| Card tokens | Enumeration | Opaque demo tokens · rate limit · generic 404 |
| Logs | Secret/PII leak | Structured logger strips email/token/password fields |
| Deploy | Stale secrets | Env only on Vercel · `.env*` gitignored |

## Production requirements (from ARCHITECTURE.md)

- `ADMIN_PASSWORD` ≥ 12, `ADMIN_SESSION_SECRET` ≥ 32  
- Prefer managed identity/SSO over shared password for multi-operator  
- Shared atomic rate limit store (not instance-local Map alone)  
- Never put secrets in `NEXT_PUBLIC_*`  
- NFC signing secret separate; rotate with key version  

## Prototype boundaries (honest)

- Tap ≠ ownership  
- Static NTAG216 URL can be cloned  
- In-memory redemptions can vanish across instances  
- Seed data is fictional only  

## Reporting

Security issues for this prototype: contact repo owner (`palmzamak2547`). Do not file public issues with exploit detail for admin bypass.
