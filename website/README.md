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

## Selling — enquiries by email or DM
No checkout, no forms. Each drawing says whether the original is available/sold/kept and whether prints exist,
with an **Enquire about this piece** button (sold/kept pieces: *Ask about something similar*). It opens a
modal with a candid note: the contact **email** as copyable text (deliberately no `mailto:` link) and an
**Instagram DM** link. Both are set in the back-office (**About & contact**, stored in `site/about`);
`VITE_CONTACT_EMAIL` / `VITE_INSTAGRAM_HANDLE` build variables are only fallbacks.
Code: `src/lib/contact.ts`, `src/components/Enquire.tsx`, `src/components/CopyText.tsx`.

## Theme
**Paper** only — see `src/theme/README.md`. Earlier variations (Night wall, Zine) and the theme picker
are frozen in `src/theme/archive/` (excluded from the build; README there explains how to revive them).
