# Decisions

A short log of the technical/product choices behind this codebase — what was decided, why, and
whether it's still open. `AGENT_LOG.md` records *what was done and when*; this file records *why*,
so a later run (or the project owner) doesn't have to re-derive the reasoning from git history.
Add a new entry when a run makes a choice future work should be able to look up instead of re-litigate.

## Open

### Expo (React Native) vs. Vite (web-only)

- **Status:** open — owner decision needed. See `AGENT_LOG.md` backlog item 12 (HELD).
- **What was decided:** the 2026-08-01 scaffolding run built the runnable prototype on
  **Vite + React, web-only**.
- **What the launch plan asks for:** §2.2/§8 specify **Expo (React Native)** from week 1, so
  web/iOS/Android share one codebase and the web release (weeks 1–8) is not thrown away when
  app-store builds start (weeks ~9–14).
- **Why Vite anyway:** at scaffolding time the goal was "make the existing prototype buildable and
  runnable at all" with minimal risk to `economic-cycles-v5.jsx`'s content. Vite is a smaller, faster
  loop for that first step than standing up Expo tooling cold.
- **Cost of staying on Vite:** every web-only UI change since then (the four-way `App` split, the
  first-session flow, translation cleanup) raises the eventual Expo port cost, since none of it is
  React Native-aware (DOM-only styling, `localStorage` instead of an RN-compatible storage API, etc).
- **Why still open:** this is a stack choice with real cost either way, not a small technical toggle —
  the dev agent is instructed not to migrate to Expo on its own initiative and not to deepen the
  web-only investment beyond already-curated P2 items. Needs the project owner's call.
- **Revisit when:** before starting any large new web-only UI feature, or whenever the owner is ready
  to schedule the Expo migration.

### Market data: FRED direct, a swappable equity adapter, and a pluggable relative-strength formula

- **Status:** open (being built) — owner-directed 2026-08-04. Unholds `AGENT_LOG.md` backlog items
  13 and 14, which were HELD pending exactly this decision.
- **What was decided:**
  1. **Economics data comes from FRED directly** — rates, yield curve, CPI and similar. Owner's
     instruction: use it as-is.
  2. **Equity/sector data comes from a licensed free-tier API behind an adapter interface.**
     Finnhub is the default; Tiingo and Stooq adapters are drop-in alternatives.
  3. **Update cadence is once daily after close**, not live. A scheduled job fetches, computes, and
     writes a static `market.json`; the app reads that file.
  4. **The relative-strength calculation is a pluggable strategy.** A proprietary formula will
     replace the default later.
- **Why not Yahoo Finance or Finviz** (both were considered at the owner's suggestion): Finviz's API
  is a paid Elite feature, so free use means scraping — against their ToS, and rate-limited to one
  request per 60 seconds on pain of a ban. Yahoo has had no official API since 2017; the unofficial
  endpoints change without notice and are documented as unsuitable for commercial use. This app is
  intended to charge a subscription and ship through app stores, so a data source that can silently
  break for every paying user, or that is used in breach of terms, is not acceptable at the base of
  the feature.
- **Why a job rather than client fetches:** at one update per day there is no reason to put an API
  key in the browser or to call a provider once per user. The job holds the key; the app fetches a
  static file. Twelve calls a day sits inside every free tier permanently.
- **Why only derived values are published:** caching a provider's data and serving it to users is
  redistribution, which several free tiers prohibit even when calling the API is fine. The published
  file therefore carries computed outputs — percent change, relative-strength value, rank — never
  raw OHLCV. Raw series stay inside the job.
- **How the proprietary RS formula is protected for later:** `computeRelativeStrength` is a strategy
  with one clearly-labelled placeholder implementation. **The placeholder is not the product's
  intended calculation** and must not be presented as one — in code, in the UI, or in a run log. Two
  consequences future work must respect: (a) no caller may assume the formula's shape, its range, or
  that it is comparable across time; (b) because the real formula may need more history than the
  placeholder, the job keeps a local rolling price cache so a future formula can be applied without
  re-fetching years of data.
- **How this squares with §2.3 (the stale-data blindspot):** that defect was a *hardcoded* date that
  never changed — fake freshness. A real `asOf` that updates daily is the opposite. The binding rule
  is that the UI never presents figures as current without showing when they were taken, and shows
  "unavailable" rather than stale numbers if the job has not run recently.
- **Revisit when:** the proprietary RS formula is ready (swap the strategy, keep everything else); or
  a provider's terms change; or the product needs intraday data, which would reopen every point here.

## Closed

### Content as `.js` modules, not JSON

- **Status:** closed, in effect since the 2026-08-02 JSX-split (steps 1–3).
- **What was decided:** `lessons`, `quizData`, `glossary`, `kidsContent`, and the five per-language
  translation dictionaries (`src/locales/*.js`, `src/content/*.js`) are plain ES module exports
  (`export const lessons = [...]`), not `.json` files.
- **Why:** the content is consumed only by the Vite/React build, which imports `.js` natively with no
  extra loader — `.json` would need either an `import ... assert { type: "json" }` (inconsistent
  bundler/browser support at the time) or a fetch-at-runtime step, either of which is more moving parts
  for content that never changes at runtime. `.js` modules can also carry a header comment (see
  `src/content/quizData.js`'s answer-key-distribution invariant) that JSON cannot, and every value is
  still a plain literal that's trivially diffable in review.
- **Trade-off accepted:** content authors need to write valid JS object/array literals instead of
  strict JSON — no external tooling (e.g. a translation-management platform) can read/write these
  files directly without a small transform. Acceptable while content changes go through git review by
  the same person/agent who can write JS.
- **Revisit when:** if a non-technical content editor or third-party localization tool needs to edit
  these files directly without going through this codebase.

### localStorage-only progress and personalization state

- **Status:** closed as the *current* approach; known gap flagged below.
- **What was decided:** every piece of per-user state added so far — the disclaimer-seen flag
  (`ecycles_seen_disclaimer`), the streak counter (`ecycles_streak`), the continue-tomorrow
  opt-in (`ecycles_continue_pref`), `completedLessons` itself (`ecycles_completed_lessons`,
  added 2026-08-04), and the text-size preference (`ecycles_font_scale`, added 2026-08-04) — is
  stored client-side in `localStorage`, keyed by a fixed string, with no backend, no account
  system, and no sync across devices.
- **Why:** the launch plan's own stack (Supabase-backed accounts) doesn't land until later in the
  roadmap, and none of these features need cross-device sync to be useful — they're single-device
  "did you do something today" signals. Building them against `localStorage` now means zero backend
  dependency and each one degrades safely (wrapped in `try`/`catch`, since `localStorage` throws in
  private-browsing contexts) rather than blocking the feature.
- **Gap closed 2026-08-04:** `App`'s core `completedLessons` state now follows the same pattern —
  lazy-initialized from `localStorage` on mount (`loadCompletedLessons`, falls back to `[]` if unset,
  unparseable, or not an array) and written back on every `markLessonComplete` call
  (`saveCompletedLessons`), both wrapped in `try`/`catch` like every other key here. No component
  changes were needed: `Home`, `Learn`, and the header progress bar all just read the
  `completedLessons`/`isLessonUnlocked` props `App` already passed them, so a persisted value flows
  through unchanged. Verified in the browser (static build + local server): completed lesson 1,
  reloaded, Home still showed "1/12" and lesson 2 remained unlocked.
- **Revisit when:** the app gains real accounts (Supabase), at which point this whole section should
  be superseded by a sync strategy (local-first with server sync, vs. server-authoritative).
