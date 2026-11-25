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
- `site/about` — story + photo.

A drawing whose collection was deleted shows up under **Loose sheets** (Library) and *Unsorted* (back-office).

## Back-office (`/admin/`)
Email + password (Firebase Auth). Sections: **Drawings** (add/edit, pick the collection, ★ toggle for the
Show right in the list, filter by collection), **Collections** (add, rename, reorder, hide), **About**.
Editing needs the signed-in UID in `firestore.rules` **and** `storage.rules`.

## Selling
No checkout. Each drawing says whether the original is available/sold/kept and whether prints exist;
“Ask about it” sends a message via Formspree (if `VITE_FORMSPREE_ID` is set) and/or links an Instagram DM
(`VITE_INSTAGRAM_HANDLE`). Both are GitHub repository **variables**, never committed.

## Themes
See `src/theme/README.md`. Three themes — **Paper** (default), **Night wall**, **Zine** — with a temporary
picker bottom-right. Hide the picker: `SHOW_THEME_MENU = false` in `src/App.tsx`.
