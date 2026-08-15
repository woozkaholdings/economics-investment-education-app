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
};

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
