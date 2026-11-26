# nhecus — website

Vite + React + TypeScript + Firebase. Ported from dovsky.com (`dovskyrick/dovsky` → `dovsky-alt/`),
which was itself ported from the Ticho site.

| dovsky (oils) | nhecus (ink) |
|---|---|
| Gallery — available / sold | **The Show** — drawings flagged *in the show* (`featured`) |
| Art forms — links to other media | **Library** — collections → their drawings (`#library/<collection-id>`) |
| About | **About** (same editor) |

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173   (back-office: /admin/)
```
With an empty `src/lib/firebase-config.ts` the site runs in **demo mode** on the placeholder content in
`src/data/defaults.ts` (that's the mock-up currently online).

## Data model (Firestore)
- `drawings/{id}` — title, year, medium, width/height (cm), description, **collectionId** (exactly one),
  **featured** (in the Show), **original** (`available` | `sold` | `kept`), **prints** (bool), optional price,
  `aspect` + image URLs/paths.
- `site/collections` — `{ items: Collection[] }`, ordered list (order = Library order).
- `site/about` — story + photo + contact email + Instagram handle.

A drawing whose collection was deleted shows up under **Loose sheets** (Library) and *Unsorted* (back-office).

## Back-office (`/admin/`)
Email + password (Firebase Auth). Sections: **Drawings** (add/edit, pick the collection, ★ toggle for the
Show right in the list, filter by collection), **Collections** (add, rename, reorder, hide), **About & contact**.
Editing needs the signed-in UID in `firestore.rules` **and** `storage.rules`.

## Selling — "Ask about it" (same as dovsky.com)
No checkout. Each drawing says whether the original is available/sold/kept and whether prints exist.
Pieces for sale (original available or prints) get an **Ask about it** button. It swaps the lightbox
details for a small form (Name · Email · Message, pre-filled with the title), sent via **Formspree**
to the same inbox as dovsky.com (each message carries `site: "nhecus"`), plus "or message on Instagram ↗".
The Formspree form ID is **not** in the repo: it comes from the GitHub repository variable
`VITE_FORMSPREE_ID` at build time (locally: `website/.env.local`). The Instagram handle and email are set in
the back-office (**About & contact**, `site/about`); the email is shown as copyable text on the About page.
Code: `src/components/Enquire.tsx` (form), `src/lib/contact.ts`, `src/components/CopyText.tsx`.

## Theme
**Paper** only — see `src/theme/README.md`. Earlier variations (Night wall, Zine) and the theme picker
are frozen in `src/theme/archive/` (excluded from the build; README there explains how to revive them).
