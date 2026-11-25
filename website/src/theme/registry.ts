// ─── Theme registry ──────────────────────────────────────────────────────────
// The site uses ONE theme: Paper (themes/paper). No picker is shown.
// Earlier experiments (Night wall, Zine, the drop-up picker) are frozen in ./archive/ —
// not imported, not type-checked, not built. See archive/README.md to revive one.
// ─────────────────────────────────────────────────────────────────────────────
import paper from './themes/paper';
import type { ThemeDef } from './types';

export const THEMES: ThemeDef[] = [paper];
export const DEFAULT_THEME = paper.id;
