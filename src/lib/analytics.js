// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS
//
// LAUNCH_PLAN.md §9.2's minimum event set. `track()` is the seam: every call
// site stays the same whatever the destination is. Same swap-the-implementation
// shape as the market-data adapters in src/lib/marketData/adapters.js.
//
// TWO SINKS, and the local one is not a fallback — it always runs:
//   1. `sink()` — the rolling `localStorage` log. Unchanged since 2026-08-05,
//      inspectable on one device, and the only sink when analytics are off.
//   2. `remoteSink()` — forwards to the provider named in analyticsConfig.js,
//      and does nothing at all while that says "none" (the default).
// The local log keeps working when the remote is off, misconfigured, blocked
// by an ad blocker, or failing. An event is never lost from the log because
// the network was.
//
// Nothing here is user-identifying: no name, email, or account exists in this
// app to attach, no cookie is set, and no persistent id is stored. PostHog
// needs *some* distinct id, so it gets a per-page-load random one held in
// memory only — which means "unique users" there reads as "sessions". That is
// a deliberate accuracy-for-privacy trade, and it is written down in
// DECISIONS.md rather than left for someone to discover in a dashboard.
//
// ⛔ `sanitizeProps` is a PRIVACY GUARD, not tidiness. It drops anything that
// is not a number, a boolean, or a short id-shaped string, so a future call
// site cannot leak lesson prose, a search query, or free text to a third party
// by passing it as a prop. check-data.mjs asserts it.
// ═══════════════════════════════════════════════════════════════════════════

import { KEYS, readJSON, writeJSON } from "./storage.js";
import { analyticsConfig, isConfigured } from "./analyticsConfig.js";

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
  CANCELED: "canceled",
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
  remoteSink(event, props);
}

// ── Remote transport (backlog item 18 / O-2) ───────────────────────────────

// Per-page-load id, in memory only. Never written to storage, never a cookie,
// gone on reload — see the header for what that costs and why.
const SESSION_ID = (() => {
  try {
    if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  } catch { /* fall through */ }
  return `s-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
})();

// Ids, counts and flags only. Anything else is dropped rather than truncated:
// a truncated sentence is still a sentence, and the point is that prose must
// not leave the device at all.
const ID_SHAPED = /^[A-Za-z0-9_.:-]{1,64}$/;

export function sanitizeProps(props) {
  const out = {};
  if (!props || typeof props !== "object") return out;
  for (const [k, v] of Object.entries(props)) {
    if (!ID_SHAPED.test(k)) continue;
    if (typeof v === "number") { if (Number.isFinite(v)) out[k] = v; continue; }
    if (typeof v === "boolean") { out[k] = v; continue; }
    if (typeof v === "string" && ID_SHAPED.test(v)) { out[k] = v; continue; }
    // null/undefined/objects/arrays/prose: dropped on purpose.
  }
  return out;
}

// PURE, so `npm test` can assert every provider's wire format without a
// browser and without an account — the same reason `quizScore` and
// `elapsedSeconds` are pure. Returns null when there is nothing to send.
export function buildEventRequest(event, props, cfg = analyticsConfig, ctx = {}) {
  if (!event || !isConfigured(cfg)) return null;
  const clean = sanitizeProps(props);
  const url = typeof ctx.url === "string" ? ctx.url : "";
  const sessionId = typeof ctx.sessionId === "string" ? ctx.sessionId : "";

  switch (cfg.provider) {
    case "plausible": {
      const host = (cfg.plausible.host || "https://plausible.io").replace(/\/+$/, "");
      return {
        url: `${host}/api/event`,
        // text/plain, not application/json, and this is load-bearing: it keeps
        // the request CORS-"simple" so no preflight is issued. Plausible parses
        // the body as JSON regardless — it is what their own script sends. With
        // application/json the preflight decides whether anything arrives, and
        // a blocked preflight fails silently, which reads exactly like "nobody
        // used the app".
        contentType: "text/plain",
        // No id of any kind: Plausible does its own visitor counting server
        // side, so sending one would add an identifier for no measurement.
        body: JSON.stringify({ name: event, url, domain: cfg.plausible.domain, props: clean }),
      };
    }
    case "posthog": {
      const host = (cfg.posthog.host || "https://us.i.posthog.com").replace(/\/+$/, "");
      return {
        url: `${host}/i/v0/e/`,
        contentType: "application/json",
        body: JSON.stringify({
          api_key: cfg.posthog.projectApiKey,
          event,
          properties: { ...clean, distinct_id: sessionId, $current_url: url },
          timestamp: new Date().toISOString(),
        }),
      };
    }
    case "custom": {
      return {
        url: cfg.custom.endpoint,
        contentType: "application/json",
        body: JSON.stringify({ event, props: clean, ts: new Date().toISOString(), sessionId }),
      };
    }
    default:
      return null;
  }
}

// `sendBeacon` first: it survives the page being closed, which matters because
// `lesson_completed` fires at exactly the moment a reader is likely to leave.
// `fetch` with keepalive is the fallback. Both failures are swallowed — an
// analytics outage must never break the feature being instrumented.
//
// ⛔ Deliberately NOT `mode: "no-cors"`. It looks like the safe choice and is
// the opposite: no-cors forbids a non-simple Content-Type, so the JSON posts
// would be stripped or rejected, and no-cors makes the response opaque so the
// failure is invisible. Every provider here supports CORS properly; a real
// error should be a real error.
function send(req) {
  try {
    // ⛔ sendBeacon ONLY for a CORS-"simple" content type, and this cost a
    // real debugging pass to learn: `sendBeacon` always sends with credentials
    // mode "include". A non-simple type (application/json) therefore triggers a
    // preflight *with credentials*, which every endpoint answering
    // `Access-Control-Allow-Origin: *` rejects — and the event is dropped with
    // nothing thrown and nothing logged. Measured against a local receiver:
    // 0 events arrived, and the browser console showed "must not be the
    // wildcard '*' when the request's credentials mode is 'include'".
    // text/plain is simple, so no preflight is issued and the beacon lands.
    // Everything else goes through `fetch` with credentials omitted, where a
    // wildcard is legal; `keepalive` gives it most of a beacon's ability to
    // survive the page closing.
    if (req.contentType === "text/plain" && typeof navigator?.sendBeacon === "function") {
      const blob = new Blob([req.body], { type: req.contentType });
      if (navigator.sendBeacon(req.url, blob)) return;
    }
    fetch(req.url, {
      method: "POST",
      headers: { "Content-Type": req.contentType },
      body: req.body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch { /* analytics must never throw into a feature */ }
}

function remoteSink(event, props) {
  if (!isConfigured()) return;
  const req = buildEventRequest(event, props, analyticsConfig, {
    url: typeof location !== "undefined" ? location.href : "",
    sessionId: SESSION_ID,
  });
  if (req?.url) send(req);
}

export function trackedProviders() {
  return isConfigured() ? analyticsConfig.provider : "none";
}
