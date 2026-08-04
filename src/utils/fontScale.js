// DYNAMIC FONT SIZE — lets a user scale all app text up or down without
// touching per-element styles. Every `fontSize` in the app is authored in
// `rem`, so scaling the root font-size (via `document.documentElement.style
// .fontSize`, a percentage of the browser's 16px default) scales everything
// proportionally. Persisted like the streak/completedLessons keys.
const FONT_SCALE_KEY = "ecycles_font_scale";

// Four steps, default in the middle. `sample` is the size (in rem) used to
// render each step's own "Aa" preview button, scaled the same way.
export const FONT_SCALE_STEPS = [
  { value: 0.875, sample: 0.75 },
  { value: 1, sample: 0.875 },
  { value: 1.15, sample: 1 },
  { value: 1.3, sample: 1.125 },
];

const DEFAULT_SCALE = 1;

export function loadFontScale() {
  try {
    const raw = localStorage.getItem(FONT_SCALE_KEY);
    const n = raw ? Number(raw) : DEFAULT_SCALE;
    return FONT_SCALE_STEPS.some((s) => s.value === n) ? n : DEFAULT_SCALE;
  } catch (e) {
    return DEFAULT_SCALE;
  }
}

export function saveFontScale(scale) {
  try { localStorage.setItem(FONT_SCALE_KEY, String(scale)); } catch (e) {}
}
