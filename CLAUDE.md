# CLAUDE.md — nhecus

## HARD RULE: this repository is PUBLIC
Everything committed here is visible to the world, including the git history.

**Never commit:**
- Personal data: home address, ID/tax numbers (NIF), phone numbers, personal email, bank details/IBAN
- Tax/fiscal documents, invoices, buyer data from sales (names, addresses, orders)
- Secrets: API keys that are not public-by-design, service-account files, passwords
- Admin emails (the Firebase rules list admin **UIDs** only — UIDs are fine)

Public-by-design values are OK: the Firebase *web* config (`src/lib/firebase-config.ts`),
admin UIDs in the rules. The contact email + Instagram handle are content (back-office → Firestore `site/about`),
never hard-coded in the repo.
Fiscal/business-admin notes belong in the private `dovskyrick/taxes` repo.

## Project
Ink-pen illustration website (sibling of dovsky.com, which is oil paintings).
Same architecture as `dovskyrick/dovsky` → `dovsky-alt/` (itself ported from `dovskyrick/ticho`):
Vite + React + TypeScript + Firebase, hash routing, back-office at `/admin/`.

- `website/` — the site. Tabs: **The Show** (featured drawings) · **Library** (collections) · **About**.
- A drawing sits in exactly **one** collection, and can additionally be flagged `featured` (in the Show).
- Theme: **Paper** only (`website/src/theme/`). Night wall, Zine and the picker are frozen in `theme/archive/` (not built).
- Buying/requests: “Enquire about this piece” → modal (`components/Enquire.tsx`) with the email as copyable
  text (deliberately no mailto: links) + an Instagram DM link. No checkout, no forms.
- Deploy: GitHub Pages via `.github/workflows/deploy-pages.yml` → https://dovskyrick.github.io/nhecus/
- Human-in-the-loop setup steps: `docs/HIL-setup.md`.
