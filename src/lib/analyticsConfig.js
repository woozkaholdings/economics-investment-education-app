// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS CONFIG — the one file the owner edits to turn analytics on.
//
// Backlog item 18 / O-2. `analytics.js` has fired LAUNCH_PLAN.md §9.2's event
// set into a local `localStorage` log since 2026-08-05; what was missing was
// somewhere for those events to GO. This file is that somewhere, and it is
// deliberately the only thing that has to change.
//
// ─────────────────────────────────────────────────────────────────────────
// TO TURN IT ON: set `provider` to one of "plausible" | "posthog" | "custom"
// and fill in that provider's field below. Then `npm run build` and redeploy.
// Nothing else in the app changes. To turn it off again, set "none".
// ─────────────────────────────────────────────────────────────────────────
//
// WHY THIS IS A COMMITTED .js FILE AND NOT AN ENVIRONMENT VARIABLE.
// Three reasons, in order of weight:
//   1. The deploy is `npm run build` then drag `dist/` (README § Deploying).
//      A build-time env var adds a step that is silently skippable — forget it
//      and the build succeeds with analytics quietly off, which is the exact
//      failure this whole item exists to end.
//   2. DECISIONS.md's "content and config live in `.js` modules, not JSON"
//      applies; `README.md` states the app needs "no environment variable".
//   3. **Nothing here is a secret.** Every value below ships to the browser in
//      the bundle no matter how it gets there — a site id or a public project
//      key is public by construction. See the SECRET warning below.
//
// ⛔ NEVER PUT A SECRET IN THIS FILE. It is committed to git and shipped to
// every visitor. Analytics providers issue two different kinds of token:
//   - a PUBLIC/ingest key (PostHog "Project API Key", `phc_…`; a Plausible
//     domain; an Umami website id) — safe here, it can only write events;
//   - a PRIVATE/personal API key (read access to your data, account changes)
//     — NEVER here, and never in this repo.
// If a provider's docs call the value "secret", "private", or "personal", it
// is the wrong value.
// ═══════════════════════════════════════════════════════════════════════════

export const analyticsConfig = {
  // "none" | "plausible" | "posthog" | "custom"
  provider: "none",

  // provider: "plausible" — the domain exactly as registered in Plausible
  // (no scheme, no trailing slash), e.g. "magnificent-mochi-73aecc.netlify.app".
  // `host` only needs changing for a self-hosted Plausible.
  plausible: {
    domain: "",
    host: "https://plausible.io",
  },

  // provider: "posthog" — the PUBLIC Project API Key (starts `phc_`) and the
  // region host shown in PostHog's project settings.
  posthog: {
    projectApiKey: "",
    host: "https://us.i.posthog.com",
  },

  // provider: "custom" — any endpoint that accepts a JSON POST. Use this for a
  // self-hosted receiver (Umami, a Netlify function, a logging endpoint).
  // Receives {event, props, ts, sessionId}.
  custom: {
    endpoint: "",
  },
};

// Whether a remote provider is actually usable. A provider name with its
// required field left blank is treated as OFF rather than as an error: a
// half-filled config must not start dropping events into a 404, and must not
// break the feature it is instrumenting.
export function isConfigured(cfg = analyticsConfig) {
  switch (cfg?.provider) {
    case "plausible": return Boolean(cfg.plausible?.domain);
    case "posthog": return Boolean(cfg.posthog?.projectApiKey);
    case "custom": return Boolean(cfg.custom?.endpoint);
    default: return false;
  }
}
