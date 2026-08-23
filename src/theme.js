// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
//
// Authored for this app, not carried over from the prototypes (LAUNCH_PLAN
// §3.1.1). Three rules this file exists to enforce:
//
//   1. TYPE IS BIG. Body copy is 1rem (16px), not 12px. An education app that
//      is tiring to read has already failed, whatever else it does.
//   2. ONE ACCENT. Blue means "interactive or current". Green/amber/red mean
//      only success/caution/error. When everything is color-coded, nothing
//      reads as important.
//   3. SPACE, NOT BORDERS. Separation comes from whitespace and one hairline,
//      not from boxing every paragraph in a colored card.
//
// COLOUR lives in `index.css` as custom properties, not as hex literals here.
// That is what lets the app follow the system light/dark setting and still be
// overridden by an explicit user choice — a JS constant cannot do either
// without re-rendering the tree. These exports are `var()` references, so a
// component reading `ink.strong` automatically gets the right value for the
// active scheme. Contrast for both palettes is *declared* in `index.css`'s
// CONTRAST header note and *enforced* by `scripts/check-data.mjs` §28, which
// asserts WCAG AA on all 55 ink×surface and text-on-fill pairs per palette
// every `npm test`. Before 2026-08-17 this line said "is verified in
// `index.css`" and nothing performed the verification (backlog item 59).
//
// Sizes are in `rem` so the in-app text-size control scales everything.
// ═══════════════════════════════════════════════════════════════════════════

export const surface = {
  canvas: "var(--surface-canvas)",
  card: "var(--surface-card)",
  sunken: "var(--surface-sunken)",
  accentWash: "var(--surface-accent-wash)",
  okWash: "var(--surface-ok-wash)",
  warnWash: "var(--surface-warn-wash)",
  badWash: "var(--surface-bad-wash)",
};

export const line = {
  hairline: "var(--line-hairline)",
  strong: "var(--line-strong)",
};

export const ink = {
  strong: "var(--ink-strong)",
  body: "var(--ink-body)",
  muted: "var(--ink-muted)",
  accent: "var(--ink-accent)",
  ok: "var(--ink-ok)",
  warn: "var(--ink-warn)",
  bad: "var(--ink-bad)",
  onFill: "var(--ink-on-fill)",
};

export const fill = {
  accent: "var(--fill-accent)",
  accentDeep: "var(--fill-accent-deep)",
  ok: "var(--fill-ok)",
  warn: "var(--fill-warn)",
  bad: "var(--fill-bad)",
  ink: "var(--fill-ink)",
};

// Graphics only — chart strokes and dots, where 3:1 is the bar. Never text.
//
// "3:1 is the bar" was a claim with nothing behind it until 2026-08-17; it is
// now `check-data.mjs` §28b, which measures every graph token against every
// surface. Two things that check knows and this comment cannot: the bar is
// WCAG 1.4.11, which only binds graphical objects "required to understand the
// content", and that graph x `--surface-card` is the only combination anything
// renders today. §28b asserts the whole cartesian anyway, and since 2026-08-17
// (backlog item 65) it does so with zero exemptions: all five tokens clear 3:1
// on all seven surfaces in both palettes, so a chart may move onto any surface
// without a contrast question being reopened.
export const graph = {
  green: "var(--graph-green)",
  amber: "var(--graph-amber)",
  red: "var(--graph-red)",
  blue: "var(--graph-blue)",
  neutral: "var(--graph-neutral)",
};

export const shadow = {
  // The primary button's bottom edge. Darker than the accent in BOTH schemes —
  // `fill.accentDeep` is not (it is lighter than the accent in dark), which is
  // why this is its own token rather than a reuse.
  bevel: "var(--shadow-bevel)",
  raised: "var(--shadow-raised)",
  overlay: "var(--shadow-overlay)",
  lifted: "var(--shadow-lifted)",
};

// ── Type ──────────────────────────────────────────────────────────────────
// `family` is set on the two largest scales only. Screen titles carry the
// editorial serif from the UIUX/ reference set; everything a learner actually
// reads at length stays in the sans stack, which is what keeps rule 1 (type is
// big, reading is not tiring) intact. A scale without `family` inherits body.
export const family = { display: "var(--font-display)" };

export const type = {
  display: { size: "1.75rem", weight: 700, height: 1.25, spacing: "-0.02em", family: family.display },
  title:   { size: "1.375rem", weight: 700, height: 1.3, spacing: "-0.01em", family: family.display },
  heading: { size: "1.125rem", weight: 650, height: 1.4 },
  body:    { size: "1rem", weight: 400, height: 1.65 },
  small:   { size: "0.875rem", weight: 400, height: 1.55 },
  caption: { size: "0.75rem", weight: 500, height: 1.4 },
};

export const font = {
  display: "1.75rem", title: "1.375rem", heading: "1.125rem",
  body: "1rem", small: "0.875rem", caption: "0.75rem",
};

// ── Space ─────────────────────────────────────────────────────────────────
export const space = { "1": 4, "2": 8, "3": 12, "4": 16, "5": 24, "6": 32, "7": 48 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 };

// ── Touch targets ─────────────────────────────────────────────────────────
// THE FLOOR EVERY INTERACTIVE CONTROL HOLDS TO, in CSS px. Anything a finger
// taps — button, chip, tab, radio, the language `select` — sets `minHeight`
// (and `minWidth` when the label is short enough to fall under it) to this.
//
// WHY 44 AND NOT A SMALLER NUMBER. It is Apple's HIG minimum, it is WCAG
// 2.5.5 (Target Size, AAA), and it is what every app in the owner's `UIUX/`
// reference set does — Duolingo, Quizlet, Vocabulary and Buddy are all iOS
// apps built to that floor, so adopting the set's *look* without its *target
// size* took half the design.
//
// WHY `minHeight` AND NEVER `height`. The app has a user-facing font scale up
// to 1.3x (see TEXT_SCALES). A fixed height clips the label at the large end;
// a floor lets the control grow with its text and only ever guarantees the
// minimum. Icon-only controls that carry no text are the one exception and
// may pin both dimensions to this value.
//
// MEASURED 2026-08-23, BEFORE THIS TOKEN EXISTED: eleven control classes
// rendered under 44 — the coach-mark dismiss at 20x20, the Sector period tabs
// at 19x31, the lesson term chips at 27 tall, `Button` itself at 42. Only
// `Learn.jsx` honored the rule, and it did so with a bare literal. Grep for
// `MIN_TAP` to audit; a raw `44` in a control's style is the smell this
// replaced.
export const MIN_TAP = 44;

export const APP_MAX_WIDTH = 460;

// ── User-selectable color scheme ─────────────────────────────────────────
// "system" follows the OS; the other two override it. See `lib/useAppState.js`
// for how the choice is applied, and `index.css` for how it resolves.
export const THEME_MODES = ["system", "light", "dark"];
export const DEFAULT_THEME_MODE = "system";

// ── Text size ─────────────────────────────────────────────────────────────
export const FONT_SCALE_STEPS = [
  { value: 0.9, sample: "0.8125rem" },
  { value: 1, sample: "0.9375rem" },
  { value: 1.15, sample: "1.0625rem" },
  { value: 1.3, sample: "1.1875rem" },
];
export const DEFAULT_FONT_SCALE = 1;
