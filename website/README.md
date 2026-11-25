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
- `site/about` — story + photo + Instagram handle.

A drawing whose collection was deleted shows up under **Loose sheets** (Library) and *Unsorted* (back-office).

## Back-office (`/admin/`)
Email + password (Firebase Auth). Sections: **Drawings** (add/edit, pick the collection, ★ toggle for the
Show right in the list, filter by collection), **Collections** (add, rename, reorder, hide), **About & Instagram**.
Editing needs the signed-in UID in `firestore.rules` **and** `storage.rules`.

## Selling — Instagram DM only
No checkout, no forms. Each drawing says whether the original is available/sold/kept and whether prints exist,
with an **Ask on Instagram ↗** button: it opens `ig.me/m/<handle>` and copies a ready first message
(“Hi! I saw “…” on nhecus.com and I'm interested in the original…”) for the visitor to paste.
The handle is set in the back-office (**About & Instagram**, stored in `site/about`); the
`VITE_INSTAGRAM_HANDLE` repository variable is only a fallback. Code: `src/lib/instagram.ts`,
`src/components/AskOnInstagram.tsx`.

## Theme
**Paper** only — see `src/theme/README.md`. Earlier variations (Night wall, Zine) and the theme picker
are frozen in `src/theme/archive/` (excluded from the build; README there explains how to revive them).
