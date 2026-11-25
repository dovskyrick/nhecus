# CLAUDE.md — nhecus

## HARD RULE: this repository is PUBLIC
Everything committed here is visible to the world, including the git history.

**Never commit:**
- Personal data: home address, ID/tax numbers (NIF), phone numbers, personal email, bank details/IBAN
- Tax/fiscal documents, invoices, buyer data from sales (names, addresses, orders)
- Secrets: API keys that are not public-by-design, service-account files, passwords
- Admin emails (the Firebase rules list admin **UIDs** only — UIDs are fine)

Public-by-design values are OK: the Firebase *web* config (`src/lib/firebase-config.ts`),
admin UIDs in the rules. Formspree ID / Instagram handle come from GitHub repo **variables**.
Fiscal/business-admin notes belong in the private `dovskyrick/taxes` repo.

## Project
Ink-pen illustration website (sibling of dovsky.com, which is oil paintings).
Same architecture as `dovskyrick/dovsky` → `dovsky-alt/` (itself ported from `dovskyrick/ticho`):
Vite + React + TypeScript + Firebase, hash routing, back-office at `/admin/`.

- `website/` — the site. Tabs: **The Show** (featured drawings) · **Library** (collections) · **About**.
- A drawing sits in exactly **one** collection, and can additionally be flagged `featured` (in the Show).
- Themes: `website/src/theme/` — tokens per theme, temporary picker bottom-right (`SHOW_THEME_MENU` in `App.tsx`).
- Deploy: GitHub Pages via `.github/workflows/deploy-pages.yml` → https://dovskyrick.github.io/nhecus/
- Human-in-the-loop setup steps: `docs/HIL-setup.md`.
