# Themes

```
theme/
├── base.css          default tokens (the Paper look); components only use these
├── types.ts          ThemeDef (id, label, description, swatch, fontsHref)
├── registry.ts       ← list shown in the picker (order = menu order) + DEFAULT_THEME
├── useTheme.ts       global store: sets <html data-theme>, remembers the choice, lazy-loads fonts
├── ThemeMenu.tsx     temporary drop-up picker, bottom-right (SHOW_THEME_MENU in App.tsx)
└── themes/
    ├── paper/   Paper — bone paper, white mats, serif titles, one red seal   (default)
    ├── night/   Night wall — charcoal wall, drawings lit on bright mats
    └── zine/    Zine — photocopied fanzine: halftone, tape, crooked sheets, heavy type
```

## Try a new variation
1. Copy `themes/night/` to `themes/<new-id>/`.
2. `index.ts`: change `id`, `label`, `description`, `swatch` (+ `fontsHref` for extra Google Fonts).
3. `theme.css`: selector `[data-theme="<new-id>"]`, then change tokens from `base.css`.
   Layout tweaks go in scoped rules inside that same file (see `zine/theme.css`).
4. Import it in `registry.ts` and add it to `THEMES`.

Useful tokens: `--mat` / `--mat-pad` (paper around each drawing), `--card-shadow`, `--card-tilt`,
`--img-filter` (e.g. force pure B&W), `--seal` (the one accent colour), `--ticker-display`.

## Pick one for good
Set `DEFAULT_THEME` in `registry.ts` and `SHOW_THEME_MENU = false` in `App.tsx`.
Visitors who already chose a theme keep it (localStorage `nhecus-theme`) as long as it stays in `THEMES`.
