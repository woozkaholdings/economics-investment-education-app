// ═══════════════════════════════════════════════════════════════════════════
// SAFE LOCAL STORAGE
//
// Every persisted value in the app goes through here. `localStorage` throws
// rather than returning null in some privacy modes, so every access is wrapped
// and every reader takes a fallback — a storage failure degrades a feature
// (no streak) instead of blanking the screen.
//
// Keys are declared in one place so it is possible to see the app's entire
// persisted surface at a glance. See DECISIONS.md, "localStorage-only progress
// and personalization state", for why there is no backend yet.
//
// ── WHY THIS MODULE REPORTS FAILURE, AND NOT THE 13 CALL SITES ────────────
// `writeRaw`/`writeJSON` have always returned a boolean, and measured
// 2026-09-07 not one of their 13 call sites read it. That is not an oversight
// at the call sites: none of them can do anything useful with a false — a
// failed streak write is not a streak problem, it is a *storage* problem, and
// the only honest response is to tell the learner once, for the whole app.
//
// So the module that already learns about every failure is the one that
// reports it, and the call sites stay unchanged. See `subscribePersistence`.
// ═══════════════════════════════════════════════════════════════════════════

export const KEYS = {
  seenDisclaimer: "ecycles_seen_disclaimer",
  completedLessons: "ecycles_completed_lessons",
  streak: "ecycles_streak",
  fontScale: "ecycles_font_scale",
  continuePref: "ecycles_continue_pref",
  lang: "ecycles_lang",
  themeMode: "ecycles_theme_mode",
  review: "ecycles_review",
  analyticsLog: "ecycles_analytics_log",
  legacyLessonIdMigrated: "ecycles_legacy_lesson_id_migrated",
  seenPracticeCoachMark: "ecycles_seen_practice_coachmark",
  glossaryBookmarks: "ecycles_glossary_bookmarks",
};

// ── persistence health ────────────────────────────────────────────────────
//
// WHAT THIS EXISTS FOR, measured on the built app 2026-09-07. With site data
// blocked (Firefox/Safari "block all cookies", some managed devices), the app
// renders correctly and every feature appears to work: a learner completes
// lesson 1 and is shown "Progress: 1/44", a "1 day streak" and an unlocked
// lesson 2. On the next load all of it is gone and the first-run disclaimer is
// back. The app never said a word — and the wrappers below knew every time.
//
// Deliberately NOT a blank screen or a blocked app: read-only use is a
// perfectly good way to take this course, and the fallbacks already make that
// work. The learner just has to be told that nothing is being kept.

const PROBE_KEY = "ecycles_probe";   // written and removed; never persisted,
                                     // which is why it is not in KEYS above.

let broken = false;
const listeners = new Set();

// Idempotent: once true it stays true. Storage that failed once may succeed on
// the next call (a quota freed by another tab), but the learner's data is
// already incomplete at that point, so the warning must not flicker away.
function markBroken() {
  if (broken) return;
  broken = true;
  for (const fn of listeners) fn(true);
}

export function isPersistenceBroken() {
  return broken;
}

// Subscribe to the transition to broken. Fires immediately if it has already
// happened, so a late subscriber (a screen mounted after the failure) is not
// left believing storage is fine.
export function subscribePersistence(fn) {
  listeners.add(fn);
  if (broken) fn(true);
  return () => listeners.delete(fn);
}

// A real round trip, run once at startup. It has to WRITE: the failure mode
// Safari shipped for years allowed `getItem` and threw only on `setItem` with
// a zero quota, so a read-only probe reports healthy storage on exactly the
// browser this check is for.
export function probePersistence() {
  try {
    localStorage.setItem(PROBE_KEY, "1");
    const echo = localStorage.getItem(PROBE_KEY);
    localStorage.removeItem(PROBE_KEY);
    if (echo !== "1") markBroken();   // silently-dropped write, not a throw
  } catch {
    markBroken();
  }
  return !broken;
}

export function readRaw(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

export function writeRaw(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch {
    markBroken();
    return false;
  }
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  // Serialized OUTSIDE the try that reports storage health: a `JSON.stringify`
  // throw (a circular value) is a bug in the caller, not a storage failure, and
  // reporting it as one would tell the learner their browser is blocking data
  // when it is not.
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return false;
  }
  try {
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    markBroken();
    return false;
  }
}

// Reads a JSON value only if it is an array — guards the case where a stored
// value exists but has the wrong shape (hand-edited, or written by an older
// version), which would otherwise crash a `.includes`/`.map` at the call site.
export function readArray(key) {
  const v = readJSON(key, null);
  return Array.isArray(v) ? v : [];
}
