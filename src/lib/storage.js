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
};

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
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
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
