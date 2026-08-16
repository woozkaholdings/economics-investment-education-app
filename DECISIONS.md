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

### Kids financial-literacy content: format stays parent-facing, structural depth un-scoped

- **Status:** closed (dev-agent decision, 2026-08-16) — not owner-held. See `AGENT_LOG.md` backlog
  item 21, which is not marked HELD (unlike item 19, its child-facing sibling).
- **What was asked:** item 21's text had carried, since 2026-08-07, an open question — "grow further
  within the current [parent-facing, 3-field] format or move to a lesson-shaped structure" — without
  resolving it. Three content-adding runs (2026-08-07, twice on 2026-08-15) each deferred the question
  again while adding more blurbs (nine → 15 → 21 total).
- **What was decided:** the question conflated two different things.
  1. **A kid-directed lesson UI** (the child navigates their own lessons/quizzes, the way
     `LessonReader.jsx` works for adults) — stays exactly where item 19 already put it: **owner-only**,
     HELD, blocked on a COPPA/store-classification call. Nothing about this decision changes that.
  2. **Richer parent-facing content structure** (more depth per topic — headings, a "why this matters"
     note, something closer to the adult lesson's shape — while still rendering only inside
     `ParentGuide.jsx`, never shown to a child) does not touch COPPA status, since the audience and
     surface don't change, only the content's richness. But it *is* a real structural change (new
     fields on `kidsContent.js`'s entries, a new render shape in `ParentGuide.jsx`), not a drop-in
     blurb addition, so it isn't something a run should back into while adding a topic — it needs its
     own scoping pass (what fields, what UI) before implementation.
- **Why decide now rather than leave it open:** the unresolved question was functioning as license to
  keep doing the one thing it was ostensibly weighing against — three runs in a row deferred the
  question and added another blurb anyway, the same count-shaped-drift pattern the PRIORITY BLOCK's
  P-1 named for item 17/24 ("counting lessons is not the same as building the product"). Splitting the
  question removes that ambiguity: the child-facing half was never actually open (item 19 already
  settled it), and the content-depth half needs a scoping decision, not a blurb, as its next move.
- **What this does NOT decide:** whether or when a future run should actually do the content-depth
  scoping in point 2 above. That remains open — this decision only says growing the blurb *count*
  isn't the default next step, and building kid-facing UI isn't a decision this item can make.
- **Revisit when:** a future run wants to scope the content-depth structural change (point 2), or the
  owner makes the child-facing call (point 1, tracked at item 19 / `DECISIONS.md`'s Expo entry's
  sibling COPPA question).

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

### `LessonReader` chunk split per track (real fix, supersedes the raised-threshold mitigation)

- **Status:** closed 2026-08-14 (dev-agent run). Supersedes the "chunk size warning threshold raised,
  not split" entry that used to be here — that mitigation is no longer needed and was removed rather
  than left stacked on top of the real fix.
- **What was decided:** `src/content/lessonContent.js` (531 kB source, every lesson's full body text)
  is split into `lessonContent.economy.js` (12 lessons) and `lessonContent.money.js` (28 lessons).
  `LessonReader.jsx` no longer statically imports the merged file — it dynamically `import()`s only
  the track (`lesson.track`) of the lesson being opened, with a brief `EmptyState` loading affordance
  (the same one `App.jsx`'s other lazy screens already use) while that resolves.
  `content/lessonContent.js` still exists, now as a two-line merged re-export
  (`{ ...economyContent, ...moneyContent }`) — `scripts/check-data.mjs` and
  `scripts/translation-review.mjs` both still import it unchanged, since they genuinely need every
  lesson regardless of track and aren't part of the client bundle, so merging costs nothing there.
- **Result:** `LessonReader-*.js` (the code, no longer any content) dropped from 557.70 kB to 5.92 kB.
  The two content chunks are fetched lazily and independently: `lessonContent.economy` 69.83 kB
  (31.94 kB gzip), `lessonContent.money` 482.39 kB (204.58 kB gzip) — both under Vite's default 500 kB
  *source* warning threshold on their own, and a money-track lesson open never fetches the economy
  chunk (or vice versa), confirmed via a live network-request check in the browser preview.
  `vite.config.js`'s `build.chunkSizeWarningLimit` override (raised to 600 by the mitigation this
  entry supersedes) was removed — back to Vite's default 500, and the build produces no warning.
- **Verified:** `npm test` (`check-data.mjs` + `check-blindspot.mjs`) passes; `node
  scripts/translation-review.mjs report` still shows 160/160 reviewed, 0 stale (confirms the split didn't
  alter any lesson's hashed English source text, only its file location); a static-build browser check
  opened both a money-track and an economy-track lesson and confirmed each fetched only its own
  content chunk and rendered its real English text.
- **Revisit when:** the money-track chunk (currently 482.39 kB, closest to the 500 kB default) grows
  enough from future lesson content to need its own further split — at that point split by something
  finer than track (e.g. alphabetically or by id range within `money`) rather than raising the
  threshold again.

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

### Machine-translated lesson content: accept for now, track review debt instead of blocking on it

- **Status:** closed — owner decision, 2026-08-11 (interactive session).
- **Background:** `AGENT_LOG.md` item 20 / backlog P-4. A 2026-08-05 decision to not machine-translate
  lesson content (three runs independently declined, citing unreviewed-LLM-translation risk in a
  language `check-blindspot.mjs` didn't scan) was reversed in practice — thirteen consecutive
  lesson-add runs each translated its own new lesson at authoring time, and by 2026-08-09 ~168,000
  characters across es/ko/zh/ja had shipped as unreviewed machine translation, "(Beta)"-labelled, with
  no automated guard scanning the non-English text at all.
- **What was decided:** option (a) of the three the weekly review laid out — accept the current state
  and ship as-is under "(Beta)" labelling, rather than (b) commissioning native-speaker review before
  trusting it, or (c) cutting the four Beta languages from Phase 0.
- **What ships alongside the decision, so "accept for now" doesn't repeat the same silent drift:**
  1. `scripts/check-blindspot.mjs`'s §10.1 advice-adjacency patterns were already extended to
     es/ko/zh/ja the same day (P-3, done first, see the run log) — the specific risk the original
     2026-08-05 decision named (advice-adjacent language slipping through unscanned) now has a
     mechanical guard in all five languages.
  2. `scripts/translation-review.mjs` + `scripts/translation-review-ledger.json` — a lightweight ledger
     tracking, per lesson per non-English language, whether a human has reviewed the shipped
     translation against the current English source, with drift detection (an English edit after a
     review invalidates it as "stale" rather than silently staying trusted). `npm run review-status`
     reports coverage on demand; `npm test` prints a one-line non-blocking summary every run (via
     `check-data.mjs`) specifically so the number stays visible instead of only surfacing at the next
     weekly review, which is what let it drift for weeks last time.
  3. The ledger starts empty — 0% reviewed in every language is the honest current state, not a bug.
     Coverage only grows when someone (owner, hired translator, or a future run with explicit
     permission) actually reviews a translation and runs `translation-review.mjs mark`.
- **Why JSON for the ledger, not `.js` like the content modules** (see "Content as `.js` modules, not
  JSON" above): that decision is scoped to content the Vite/React build imports at runtime. The ledger
  is dev-tooling state, read/written only by `translation-review.mjs` via `JSON.parse`/`stringify` —
  never imported by the app bundle — so the tradeoff that decision weighed (diffability vs. needing a
  JSON loader in the browser) doesn't apply, and JSON's exact round-trip on programmatic writes is the
  better fit here.
- **What this does NOT do (original scope):** it does not review anything itself. There is no
  automated substitute for a native speaker reading the text. As originally written, a dev-agent run
  could keep translating newly-added lessons at authoring time (the P-3 scanner covers that) but could
  not use this ledger to claim content is reviewed without an actual human review behind the `mark`
  call. **Superseded in part — see the 2026-08-13 update below.**
- **Update, 2026-08-13 (interactive session, owner instruction "no one will be reviewing, you figure
  out"):** since no dedicated human or professional translator is actually available, the owner
  authorized Claude to perform the review itself and land the `ai`/`human` `method` field that
  distinguishes the two (this had been drafted 2026-08-11 in the same session as the original P-4
  decision above, but was left uncommitted for two days — see AGENT_LOG.md's Notes section history —
  until this session finished and committed it). Claude then read all 40 lessons' es/ko/zh/ja
  translations in full against the English source (checking faithfulness, fluency, and blindspot
  safety beyond what `check-blindspot.mjs`'s literal-phrase grep catches) and marked every lesson/
  language pair `method: "ai"` in the ledger — **160/160 pairs now `method: "ai"`, 0 `human`, coverage
  100% in all four languages.** This review is real content judgment, not a mechanical check, but it
  is explicitly NOT equivalent to native-speaker or professional review — a same-family LLM checking
  another LLM's output has correlated blind spots a native reader wouldn't share. The `method` field
  exists specifically so an eventual human/professional pass (option (b), still open) can supersede
  AI-reviewed entries rather than being blocked by them looking already-done; `npm run review-status`
  and `check-data.mjs`'s summary line now both report the human share (0%) alongside total coverage
  so this distinction stays visible. The review found and fixed three real translation-fidelity
  issues along the way (an overclaim in lesson 5's es/ko/zh/ja — "rates are already at 0%" instead of
  the English's hedged "often already close to 0%" — and an invented example replacing lesson 13's
  specific four-subscription/$648-a-year case study, in es/ko/zh/ja; plus an es-only drop of "incomes"
  from lesson 21's inflation-mechanism sentence) — see AGENT_LOG.md's run log for the full account and
  verification detail. Coverage being 100% now describes AI review of the content as it stood after
  these fixes, not a claim that every subtlety a native speaker would catch has been caught.
- **Revisit when:** review coverage is meaningfully non-zero and the actual quality of the shipped
  translations is known, or before any paid/committed use of the app in a market where one of these
  four languages is the primary language.

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
- **Update, 2026-08-14 (dev-agent run, owner-directed pick, backlog item 22).** Done. Ids now match
  track display order: **money is 1-28, economy is 29-40** (was money 13-40, economy 1-12) — a new
  learner's first lesson is now genuinely numbered 1, not 13. Scripted, not hand-edited: a single
  old→new table (bijective over 1-40) drove regex-based rewrites of `lessons.js`'s `id` field,
  `quizData.js`'s `lesson` field, both `lessonContent.{economy,money}.js`'s top-level keys,
  `LessonVisual.jsx`'s `LESSON_VISUALS` map, every in-prose "Lesson N" cross-reference (52 in lesson
  body text + 2 in `quizData.js` explanations — English only, confirmed by grepping the other four
  languages for their own "lesson" phrasing, which found none; the condensed es/ko/zh/ja bodies don't
  carry these references at all), and `scripts/translation-review-ledger.json`'s keys. The English
  edits changed 24 lessons' `englishSourceHash` (only the referenced number changed, not meaning), so
  the ledger briefly showed 24/40 stale in all four languages after the remap — re-marked reviewed
  (method `ai`, same reviewer-of-record convention) once confirmed the actual es/ko/zh/ja text needed
  no change, restoring 100%/0-stale. Added a one-time client-side migration
  (`src/lib/lessonIdMigration.js`, wired into `useAppState.js`'s `completedLessons` load, guarded by a
  new `ecycles_legacy_lesson_id_migrated` marker key) so an already-installed user's persisted
  `ecycles_completed_lessons` — the earlier "142 in-prose cross-references" figure above was this
  decision's original estimate, not re-derived at the time; the actual current count (measured before
  this remap) was 55 including three system-comment mentions — survives the renumbering instead of
  silently pointing at the wrong lessons. Verified end-to-end in a real browser against genuine
  leftover localStorage state from a prior run's own verification (old ids `[1..9]` → migrated to new
  ids `[29..37]`, idempotent on reload); see `AGENT_LOG.md`'s run log for full detail. The Leitner
  review schedule (`ecycles_review`) needed no migration — it's keyed by a question's array index in
  `quizData`, never by lesson id.
