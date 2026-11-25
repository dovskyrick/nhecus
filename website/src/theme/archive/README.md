# Archived themes (frozen)

Not used by the site. Excluded from the build and from type-checking (`tsconfig.json` → `exclude`),
so nothing here can break the site. Kept as ready-made starting points for future variations.

```
archive/
├── ThemeMenu.tsx / .css   drop-up theme picker (bottom-right)
└── themes/
    ├── night/   Night wall — charcoal wall, drawings lit on bright paper mats
    └── zine/    Zine — photocopied fanzine: halftone dots, tape, crooked sheets, Archivo Black + Space Mono
```

## Bring a theme back
1. Move its folder to `../themes/<id>/` and fix the import in `index.ts` to `'../../types'`.
2. Add it to `THEMES` in `../registry.ts` (and `DEFAULT_THEME` if it should be the default).
3. Picker too? Move `ThemeMenu.*` back to `../`, change its import to `'./useTheme'`,
   and render `<ThemeMenu />` at the end of `App.tsx`.

They were written against the token names in `../base.css`; if tokens get renamed, update them here too.
