# Theme

```
theme/
├── base.css          design tokens (the Paper look) — components only use these
├── types.ts          ThemeDef (id, label, description, swatch, fontsHref)
├── registry.ts       THEMES = [paper], DEFAULT_THEME
├── useTheme.ts       sets <html data-theme="paper">, lazy-loads a theme's extra fonts
├── themes/
│   └── paper/        Paper — bone paper, white mats, serif titles, one red seal  (in use)
└── archive/          frozen experiments — not built (see archive/README.md)
```

To tweak the look, change tokens in `base.css` (colours, fonts, mat padding, shadows, `--seal`).
Paper-only scoped rules go in `themes/paper/theme.css`.
