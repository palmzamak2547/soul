# Collaboration rules (multi-contributor + multi-agent)

This repo may be touched by Palm, collaborators (e.g. `kasemjeff`), and coding agents.
Follow these rules so continuous development does not overwrite each other.

## Before every write session

```bash
git fetch origin
git status -sb
# If origin/main is ahead: pull --rebase first
git pull --rebase origin main
```

Never `git push --force` to `main`.

## Commits

- Prefer small, topical commits (one concern each).
- Stage **specific paths** — never blind `git add -A` when untracked noise exists.
- Do not commit `.env*`, `.vercel-prod-secrets.local.txt`, or secrets.

## Agents (Claude / Grok / Codex)

1. Fetch + rebase before starting a multi-file change.
2. Prefer additive files (`app/...`, `lib/...`, `tests/...`) over rewriting large shared components when possible.
3. If you see unexpected commits or files you did not create — **stop and re-fetch**, do not delete them.
4. After push, re-fetch once to confirm you are not behind another agent.

## Safe parallel zones

| Zone | Notes |
|---|---|
| `app/api/*` new routes | Low conflict if new path |
| `tests/*` | Usually additive |
| `lib/soul/*` | Coordinate if touching repository interface |
| `components/*` large panels | High conflict risk — keep diffs small |

## Production domain

Primary: `https://soulplatform.vercel.app`  
Git remote: `https://github.com/palmzamak2547/soul`
