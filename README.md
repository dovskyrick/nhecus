# nhecus

Ink pen illustration — **nhecus.com** (for now: https://dovskyrick.github.io/nhecus/).

Sibling of the oil-painting site dovsky.com, built on the same architecture
(Vite + React + TypeScript + Firebase, back-office at `/admin/`).

| Tab | What |
|---|---|
| **The Show** | the hand-picked wall — drawings flagged “in the show” |
| **Library** | every drawing, organised in collections (Inktober, trips, studies…). One drawing = one collection. |
| **About** | editable story + photo |

Originals, prints and requests: **Ask about it** opens a short form (sent via Formspree, same inbox as
dovsky.com) plus an Instagram DM link — no checkout.

```
.
├── .github/workflows/deploy-pages.yml   build website/ → GitHub Pages on every push
├── docs/HIL-setup.md                    things only a human can click (Firebase, Pages, domain)
└── website/                             the site + /admin/ back-office (see website/README.md)
```

**Back-office:** https://dovskyrick.github.io/nhecus/admin/ (email + password, Firebase Auth).

The code is public; the artwork is not free to reuse — all drawings © nhecus, all rights reserved.
