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

// ── colour scheme ─────────────────────────────────────────────────────────

function loadThemeMode() {
  const stored = readRaw(KEYS.themeMode, "");
  return THEME_MODES.includes(stored) ? stored : DEFAULT_THEME_MODE;
}

// ── hook ──────────────────────────────────────────────────────────────────

export function useAppState() {
  const [lang, setLangState] = useState(loadLang);
  const [completedLessons, setCompletedLessons] = useState(() => readArray(KEYS.completedLessons));
  const [streak, setStreak] = useState(0);
  const [fontScale, setFontScaleState] = useState(loadFontScale);
  const [themeMode, setThemeModeState] = useState(loadThemeMode);
  const [review, setReview] = useState(loadReview);

  // Whether this device has opened the app before. Drives both the one-time
  // disclaimer notice and first-open routing, so a brand-new user lands in
  // lesson 1 instead of on an empty Home screen.
  const [isFirstVisit] = useState(() => readRaw(KEYS.seenDisclaimer) === null);
  const [showDisclaimer, setShowDisclaimer] = useState(isFirstVisit);

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
