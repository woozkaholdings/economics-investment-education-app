// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS
//
// LAUNCH_PLAN.md §9.2's minimum event set, wired to a local sink today rather
// than the plan's target provider (PostHog) — there is no analytics account
// or backend for this project yet. `track()` is the seam a real provider
// plugs into later: every call site below stays the same, only `sink()`
// changes. Same swap-the-implementation shape as the market-data adapters
// in src/lib/marketData/adapters.js — see DECISIONS.md.
//
// Nothing here is user-identifying (no name, email, or account id exists in
// this app to attach) and nothing leaves the device today.
// ═══════════════════════════════════════════════════════════════════════════

import { KEYS, readJSON, writeJSON } from "./storage.js";

// The minimum event set LAUNCH_PLAN.md §9.2 lists. Not every event fires
// yet — paywall/trial/subscription/ad events have no corresponding feature
// in the app, so their names exist here for the provider swap-in to use once
// those features ship, but no call site fires them (see AGENT_LOG.md item 18).
export const EVENTS = {
  APP_OPENED: "app_opened",
  LESSON_STARTED: "lesson_started",
  LESSON_COMPLETED: "lesson_completed",
  QUIZ_TAKEN: "quiz_taken",
  PAYWALL_VIEWED: "paywall_viewed",
  TRIAL_STARTED: "trial_started",
  SUBSCRIBED: "subscribed",
  CANCELLED: "cancelled",
  AD_WATCHED: "ad_watched",

  // Beyond §9.2's minimum. `quiz_taken` is specified there as carrying a
  // score, which only exists once a whole quiz is done — so it fires once per
  // finished quiz. The per-question signal the app used to fire under that
  // name is still worth keeping (it is what the Leitner queue's behavior
  // would be analyzed against), so it moved here rather than being dropped.
  QUIZ_ANSWERED: "quiz_answered",

  // Also beyond the minimum, and here for the reason §9.2 itself gives: "if
  // you cannot name the event that would refute a feature, you do not yet
  // understand the feature." §3.0.4 claims interactive content — a mechanism
  // the reader drives — is the differentiator a chat window cannot copy. The
  // policy simulator (components/PolicySim.jsx) is the first thing in the app
  // that is interactive in that sense, and until this event existed the claim
  // had no measurement attached to it at all. It is now CLAIMS.md A7, whose
  // denominator is `lesson_started` for the hosting lesson.
  //
  // Fires on *choosing* a lever, never on clearing one — see PolicySim for
  // why, and check-data.mjs §13c, which fails the build if that order slips.
  SIM_LEVER_CHOSEN: "sim_lever_chosen",
};

// ── §9.2 payload helpers ───────────────────────────────────────────────────
// §9.2 asks for "lesson completed (**with duration**), quiz taken (**with
// score**)". Both numbers are computed here rather than at the call sites so
// they are shaped identically wherever they are produced, and so they are
// testable without rendering a screen (scripts/check-data.mjs §13).

// A monotonic reading, in ms, for measuring elapsed time. `performance.now()`
// is immune to the wall clock jumping (NTP correction, the user changing the
// system time, DST) mid-lesson, which `Date.now()` is not — a duration is the
// one thing that must not be measured against a clock that can move.
export function monotonicNow() {
  return typeof performance?.now === "function" ? performance.now() : Date.now();
}

// Whole seconds between a `monotonicNow()` reading and now. Returns `null`
// rather than a wrong number when the start reading is missing or unusable —
// a missing duration is analysable ("we failed to time this one"), a zero is
// not, because it is indistinguishable from a real instant completion.
export function elapsedSeconds(startedAt, endedAt = monotonicNow()) {
  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt)) return null;
  const seconds = Math.round((endedAt - startedAt) / 1000);
  return seconds >= 0 ? seconds : null;
}

// The score half of `quiz_taken`. Carries the raw counts as well as the
// percentage: a percentage alone loses how many questions it was out of, and
// "3/3" and "30/40" are not the same evidence about a learner.
export function quizScore(correct, total) {
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0 || correct < 0 || correct > total) {
    return { correct: null, total: null, scorePct: null };
  }
  return { correct, total, scorePct: Math.round((correct / total) * 100) };
}

export const MAX_LOGGED_EVENTS = 200;

// A rolling local log, inspectable via
// `JSON.parse(localStorage.getItem("ecycles_analytics_log"))` without needing
// a real analytics account. `readJSON`/`writeJSON` already swallow storage
// errors (private-mode browsers), so a failed write here just drops the
// event rather than breaking the feature it's instrumenting.
function sink(event, props) {
  const log = readJSON(KEYS.analyticsLog, []);
  log.push({ event, props, at: new Date().toISOString() });
  while (log.length > MAX_LOGGED_EVENTS) log.shift();
  writeJSON(KEYS.analyticsLog, log);
}

export function track(event, props = {}) {
  sink(event, props);
}
