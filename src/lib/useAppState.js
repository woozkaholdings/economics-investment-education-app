// ═══════════════════════════════════════════════════════════════════════════
// APP STATE
//
// One hook owning every piece of persisted user state, so screens receive
// plain values and callbacks and never touch `localStorage` themselves. Before
// this consolidation the same concerns were spread across the app shell and
// two screens, which is how `completedLessons` ended up as the one feature
// that silently failed to persist.
//
// Nothing here is user-identifying and nothing leaves the device.
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useState } from "react";
import { KEYS, readArray, readJSON, readRaw, writeJSON, writeRaw } from "./storage.js";
import { todayStr, dayDiff } from "../utils/date.js";
import { DEFAULT_FONT_SCALE, DEFAULT_THEME_MODE, FONT_SCALE_STEPS, THEME_MODES } from "../theme.js";
import { TR } from "../locales/index.js";
import { loadReview, recordAnswer, saveReview } from "./review.js";
import { migrateLegacyLessonIds } from "./lessonIdMigration.js";

// ── streak ────────────────────────────────────────────────────────────────
// One increment per calendar day on which at least one lesson is completed.

function loadStreak() {
  const { count, lastDate } = readJSON(KEYS.streak, {});
  if (!lastDate) return 0;
  // A gap of more than one day means the streak is already broken; report 0
  // rather than a stale count that would reappear on the next completion.
  return dayDiff(lastDate, todayStr()) <= 1 ? count || 0 : 0;
}

function bumpStreak() {
  const today = todayStr();
  const { count = 0, lastDate = null } = readJSON(KEYS.streak, {});
  let next;
  if (lastDate === today) next = count;              // already counted today
  else if (lastDate && dayDiff(lastDate, today) === 1) next = count + 1;
  else next = 1;                                     // first day, or broken
  writeJSON(KEYS.streak, { count: next, lastDate: today });
  return next;
}

// ── completed lessons ────────────────────────────────────────────────────
// One-time migration (backlog item 22, 2026-08-14): lesson ids were
// renumbered to match track order. Runs at most once per device — the
// migration marker is set unconditionally on first read after this ships
// (even for an install with nothing completed yet), so a later read can
// never re-apply the old→new table to ids that are already current.

function loadCompletedLessons() {
  const stored = readArray(KEYS.completedLessons);
  if (readRaw(KEYS.legacyLessonIdMigrated) !== null) return stored;
  const migrated = migrateLegacyLessonIds(stored);
  writeJSON(KEYS.completedLessons, migrated);
  writeRaw(KEYS.legacyLessonIdMigrated, "1");
  return migrated;
}

// ── font scale ────────────────────────────────────────────────────────────

function loadFontScale() {
  const n = Number(readRaw(KEYS.fontScale, DEFAULT_FONT_SCALE));
  return FONT_SCALE_STEPS.some((s) => s.value === n) ? n : DEFAULT_FONT_SCALE;
}

// ── language ──────────────────────────────────────────────────────────────

function loadLang() {
  const stored = readRaw(KEYS.lang, "");
  return Object.prototype.hasOwnProperty.call(TR, stored) ? stored : "en";
}

// ── color scheme ─────────────────────────────────────────────────────────

function loadThemeMode() {
  const stored = readRaw(KEYS.themeMode, "");
  return THEME_MODES.includes(stored) ? stored : DEFAULT_THEME_MODE;
}

// ── hook ──────────────────────────────────────────────────────────────────

export function useAppState() {
  const [lang, setLangState] = useState(loadLang);
  const [completedLessons, setCompletedLessons] = useState(loadCompletedLessons);
  const [streak, setStreak] = useState(0);
  const [fontScale, setFontScaleState] = useState(loadFontScale);
  const [themeMode, setThemeModeState] = useState(loadThemeMode);
  const [review, setReview] = useState(loadReview);

  // Whether this device has opened the app before. Drives both the one-time
  // disclaimer notice and first-open routing, so a brand-new user lands in
  // lesson 1 instead of on an empty Home screen.
  const [isFirstVisit] = useState(() => readRaw(KEYS.seenDisclaimer) === null);
  const [showDisclaimer, setShowDisclaimer] = useState(isFirstVisit);

  // A one-time, non-modal pointer at the Practice tab — shown once the
  // learner has finished their first lesson (so there's actually something
  // to review) and never again once dismissed, whether by tapping it, its
  // close control, or the Practice tab itself. Unlike FirstRunNotice this
  // never blocks interaction; App.jsx only mounts it while the Learn path is
  // on screen, matching the "teach the next step without a modal" idea from
  // the 2026-08-15 Quizlet/Vocabulary design review.
  const [seenPracticeCoachMark, setSeenPracticeCoachMark] = useState(
    () => readRaw(KEYS.seenPracticeCoachMark) !== null
  );

  // Read after mount rather than during render: the streak depends on today's
  // date, and deriving it lazily would freeze it for the session.
  useEffect(() => { setStreak(loadStreak()); }, []);

  // The text-size control scales the whole app by resizing the root element.
  // Expressed as a percentage of the browser's own default so a user's browser
  // or OS zoom still composes with this preference instead of overriding it.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  // "system" removes the attribute entirely so the `prefers-color-scheme`
  // media query in index.css takes over again; the other two pin it.
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "system") delete root.dataset.theme;
    else root.dataset.theme = themeMode;
  }, [themeMode]);

  const setLang = useCallback((next) => {
    setLangState(next);
    writeRaw(KEYS.lang, next);
  }, []);

  const setThemeMode = useCallback((next) => {
    setThemeModeState(next);
    writeRaw(KEYS.themeMode, next);
  }, []);

  const setFontScale = useCallback((next) => {
    setFontScaleState(next);
    writeRaw(KEYS.fontScale, next);
  }, []);

  const dismissDisclaimer = useCallback(() => {
    writeRaw(KEYS.seenDisclaimer, "1");
    setShowDisclaimer(false);
  }, []);

  const dismissPracticeCoachMark = useCallback(() => {
    writeRaw(KEYS.seenPracticeCoachMark, "1");
    setSeenPracticeCoachMark(true);
  }, []);

  // Called from both the end-of-lesson check and the review queue, so every
  // answer anywhere feeds one schedule.
  const recordReview = useCallback((questionIndex, wasCorrect) => {
    setReview((prev) => {
      const next = recordAnswer(prev, questionIndex, wasCorrect);
      saveReview(next);
      return next;
    });
  }, []);

  const completeLesson = useCallback((id) => {
    setCompletedLessons((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeJSON(KEYS.completedLessons, next);
      setStreak(bumpStreak());
      return next;
    });
  }, []);

  return {
    lang, setLang,
    t: TR[lang],
    completedLessons, completeLesson,
    streak,
    fontScale, setFontScale,
    themeMode, setThemeMode,
    review, recordReview,
    isFirstVisit,
    showDisclaimer, dismissDisclaimer,
    showPracticeCoachMark: completedLessons.length > 0 && !seenPracticeCoachMark,
    dismissPracticeCoachMark,
  };
}

// ── continue-tomorrow prompt ──────────────────────────────────────────────
// Shown at most once per day, the first time a lesson is completed that day.
// Records the choice locally for a future reminder feature to read; it does
// not schedule a real notification (that needs the held platform decision).

export function wasContinuePromptShownToday() {
  const { lastPromptDate } = readJSON(KEYS.continuePref, {});
  // If storage is unreadable the read returns {} and this is false, so the
  // prompt shows once and simply won't be remembered — the harmless direction.
  return lastPromptDate === todayStr();
}

export function recordContinueChoice(optedIn) {
  writeJSON(KEYS.continuePref, { optedIn, lastPromptDate: todayStr() });
}
