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
     **Tiingo is now the default** (switched 2026-08-04, commit `3f5d4a1`) — Finnhub's free tier
     authenticates but returns 403 on `/stock/candle`, the only endpoint with the daily history this
     job needs, and Stooq's CSV endpoint is now behind a JavaScript bot challenge this project will
     not defeat. Twelve Data is the drop-in alternative; Finnhub and Stooq adapters remain in
     `src/lib/marketData/adapters.js` for reference (Finnhub still works for paid plans; Stooq's
     adapter throws immediately, pointing callers at Tiingo/Twelve Data instead of pretending to work).
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
- **The relative-strength measure landed 2026-08-04.** The placeholder is gone. The measure is the
  owner's own `WJ_Sector_Comparison`, supplied as a thinkScript study for daily candles: for each of
  three lookbacks (10, 30 and 60 bars) take the sector's return minus the benchmark's over the same
  window, and sum the three. Published as percentage points to one decimal, with the study's
  `Outperform_Percent_1` threshold of 0.5 applied to the raw decimal sum. Combining three horizons is
  the point — a sector only scores well by leading across short, medium and longer windows at once,
  so one sharp week cannot carry it.
  Consequences that still bind: (a) the lookbacks are **positional**, so asset and benchmark must
  cover the same trading days — the implementation returns `null` on a length mismatch rather than
  producing a silently misaligned number; (b) the measure needs 61 bars minimum, which the job
  enforces before computing; (c) `relativeStrength.provisional` stays in the payload so any future
  stand-in has to declare itself.
- **How this squares with §2.3 (the stale-data blindspot):** that defect was a *hardcoded* date that
  never changed — fake freshness. A real `asOf` that updates daily is the opposite. The binding rule
  is that the UI never presents figures as current without showing when they were taken, and shows
  "unavailable" rather than stale numbers if the job has not run recently.
- **Revisit when:** the proprietary RS formula is ready (swap the strategy, keep everything else); or
  a provider's terms change; or the product needs intraday data, which would reopen every point here.

### Instrumentation: minimum event set wired to a local sink, not PostHog yet

- **Status:** open — the seam exists, the real provider doesn't yet. See `AGENT_LOG.md` backlog
  item 18.
- **What was decided:** `src/lib/analytics.js` exports a single `track(event, props)` and an
  `EVENTS` map covering `LAUNCH_PLAN.md` §9.2's minimum set (app opened, lesson started/completed,
  quiz taken, paywall viewed, trial started, subscribed, cancelled, ad watched). `track()` currently
  writes to a rolling `localStorage` log (`ecycles_analytics_log`, capped at 200 entries) rather than
  calling PostHog, which §9.2 names as the target provider.
- **Why not PostHog now:** it needs a real account and a public API key, neither of which a dev-agent
  run can create. Shipping the call sites now (`app_opened` in `App.jsx`; `lesson_started`/
  `lesson_completed`/`quiz_taken` in `LessonReader.jsx` and `Practice.jsx`) means the only thing left
  when a key exists is swapping `sink()`'s body — no call site changes, same shape as the market-data
  adapter seam.
- **Why fire `quiz_taken` per answered question, not per quiz session:** the app's review/check unit
  is a single question, not a multi-question test with a start/end boundary; per-question granularity
  (with `correct` and a `source` of `"lesson_check"` or `"review_queue"`) needed no new session-tracking
  state and is at least as useful for a completion-rate metric later.
- **Why `paywall_viewed`/`trial_started`/`subscribed`/`cancelled`/`ad_watched` are unfired:** none of
  those features exist in the app yet (no paywall/billing code — confirmed by
  `LAUNCH_READINESS.md`'s own grep). The event names exist so the provider swap-in doesn't also have
  to invent names later, but firing them now would be fabricated data.
- **Revisit when:** a PostHog (or other provider) account and key exist — swap `sink()`, keep every
  `track()` call site as-is.

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

### Two lesson tracks, money-first, instead of one sequential path

*Decided 2026-08-07 (owner-directed, in session).*

- **What was decided:** the lesson catalogue is two independent curricula, not one chain.
  `TRACKS` in `src/content/lessons.js` defines them in display order — **`money`** ("Your Money",
  lessons 13-26: budgeting, taxes, saving, insurance, investing) followed by **`economy`**
  ("How the Economy Works", lessons 1-12: transactions through the debt cycles, QE/QT, indicators).
  Every lesson carries a `track` field; `npm test` fails if a lesson's track isn't a known key, so a
  lesson added by a future run cannot silently belong to neither. Lessons unlock sequentially
  **within** a track and not across them, so both tracks have their first lesson open from install.
- **Why:** the single chain was an artifact of build order, not teaching. Lessons 1-12 came from the
  original economics prototype; the money lessons were appended one per scheduled run chasing the
  §4.3 lesson-count gate. The result gated the entire practical curriculum behind ~24 minutes of
  macro theory — someone installing a financial-literacy app to learn budgeting had to finish the
  long-term debt cycle, deleveraging, the yield curve and QE/QT first. That directly contradicts
  `LAUNCH_PLAN.md` §0 ("how the economy works is the *vehicle*, not the product") and worked against
  the other half of the §4.3 gate, "≥40% of installers finish lesson 1," since lesson 1 was
  "Transactions: The Building Block" for an audience that came for money help.
- **Why the two tracks are cleanly separable:** every in-prose cross-reference was extracted and
  checked before splitting. The `economy` track never references a money lesson. The `money` track
  reaches back only four times (16→3, 17→10, 21→4, 23→12-now-17), each a one-sentence aside rather
  than a dependency, so neither track requires the other to make sense.
- **Lesson `id`s were deliberately NOT renumbered.** Ids are persisted in `localStorage`
  (`ecycles_completed_lessons`), keyed by `quizData.lesson`, drive the Leitner review scheduler, and
  are cited by **142 in-prose cross-references** ("Lesson 15") across five languages. `LessonReader`
  displays `lesson.id`, so every one of those references resolves today; renumbering would require
  remapping all 142 strings in the same change as a structural refactor, which is how silent content
  corruption happens. The visible cost is a cosmetic seam: the money track runs 13→26 and the
  economy track 1→12, so a new learner's first lesson is numbered 13.
- **Revisit when:** someone does the renumbering as its own dedicated change (see the backlog item in
  `AGENT_LOG.md`), ideally scripted with a verified id→id map and a per-language check, not by hand.
