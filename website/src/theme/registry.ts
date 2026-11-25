// ─── Theme registry ──────────────────────────────────────────────────────────
// One folder per theme in ./themes/<id>/ (index.ts = metadata, theme.css = look).
// Order here = order in the picker. The picker itself is switched on/off in App.tsx
// (SHOW_THEME_MENU). Once a favourite is chosen: make it DEFAULT_THEME and hide the picker.
// ─────────────────────────────────────────────────────────────────────────────
import paper from './themes/paper';
import night from './themes/night';
import zine from './themes/zine';
import type { ThemeDef } from './types';

export const THEMES: ThemeDef[] = [paper, night, zine];
export const DEFAULT_THEME = paper.id;
