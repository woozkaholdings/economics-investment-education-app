# Decisions

A short log of the technical/product choices behind this codebase — what was decided, why, and
whether it's still open. `AGENT_LOG.md` records *what was done and when*; this file records *why*,
so a later run (or the project owner) doesn't have to re-derive the reasoning from git history.
Add a new entry when a run makes a choice future work should be able to look up instead of re-litigate.

## Open

### Expo (React Native) vs. Vite (web-only)

- **Status:** ✅ **DECIDED 2026-09-07 by the owner, interactively: the app ships on iOS, to the App
  Store, and the route is Expo / React Native.** Backlog item 12 is unheld. **The web app stays live
  and current** — it remains the only way to measure `LAUNCH_PLAN.md` §4.3's completion gate before
  an App Store review, and it is the O-2 analytics path. This entry stays under its original heading
  because the heading is the question; the answer is Expo.
  > ⛔ **What was decided is the DESTINATION and the ROUTE, not a schedule and not a migration plan.**
  > No `src/` file has been migrated on the strength of this line. The two rejected options are
  > recorded so nobody re-derives them: a **Capacitor** wrapper was rejected for Apple guideline 4.2
  > (thin web wrappers are routinely rejected) despite being much the fastest to a first build, and a
  > **native Swift** rewrite was rejected on cost — it is the only option that also discards `lib/`.
  > **Measured 2026-09-07, and this is the number that made Expo the choice:** `content/` + `locales/`
  > is **10,569 lines** of plain `.js` data — the whole curriculum, five languages — and it ports
  > **as-is**. `lib/` is **1,884** and ports with two substitutions (`localStorage` → an RN storage
  > API, hash routing → navigation). The rewrite is confined to `components/` + `screens/` +
  > `App.jsx`, **7,345 lines**, carrying 452 inline `style={{}}`, 298 DOM tags, 169 `aria-*`/`role=`
  > attributes and 51 SVG elements. **`theme.js` is the sharpest single item and is not in that
  > count's spirit:** it holds no hex at all and exports **34 `var()` references** into `index.css`'s
  > two palettes — React Native has no CSS custom properties, so the light/dark mechanism the whole
  > design system rests on has to be rebuilt, not translated.
- **What was decided (2026-08-01, superseded above):** the scaffolding run built the runnable
  prototype on **Vite + React, web-only**.
- **What the launch plan asked for:** **v1** of the plan specified **Expo (React Native)** from week 1,
  so web/iOS/Android share one codebase and the web release (weeks 1–8) is not thrown away when
  app-store builds start (weeks ~9–14). **The current plan does not ask for this** — §0's change table
  is where v1's "build on Expo from week 1" was retired, and all four Expo mentions in
  `LAUNCH_PLAN.md` now record the platform as an **open owner decision** (§8's row is "Resolve §2.1").
  *Corrected 2026-08-17: this bullet cited §2.2/§8 of the current plan, which meant a run reading it to
  decide whether a web-only change was "against the plan" was told the plan demands React Native.*
- **Why Vite anyway:** at scaffolding time the goal was "make the existing prototype buildable and
  runnable at all" with minimal risk to `economic-cycles-v5.jsx`'s content. Vite is a smaller, faster
  loop for that first step than standing up Expo tooling cold.
- **Cost of staying on Vite:** every web-only UI change since then (the four-way `App` split, the
  first-session flow, translation cleanup) raises the eventual Expo port cost, since none of it is
  React Native-aware (DOM-only styling, `localStorage` instead of an RN-compatible storage API, etc).
- **Why it was open (settled 2026-09-07):** a stack choice with real cost either way, not a small
  technical toggle. It needed the owner's call and now has it.
- ⚠️ **The standing instruction to scheduled runs is NARROWED, not lifted.** "Do not migrate to Expo
  on your own initiative" still binds: the destination being decided does not authorize a scheduled
  run to start rewriting the UI layer, which is a multi-week change that cannot be made one
  two-hour run at a time. **What changes is the other half** — "do not deepen the web-only
  investment" is now a live cost, not a theoretical one: every new inline `style={{}}` and every new
  DOM-only component is added to the 7,345-line rewrite. Prefer content, `lib/`, and content-parity
  work until a migration plan exists.
- ✅ **No external prerequisite remains, and this is measured rather than assumed.** A **paid Apple
  Developer Program membership is active and signed in to Xcode** — verified 2026-09-07 via
  `isFreeProvisioningTeam = 0, teamType = Company`, beside the free `Personal Team` every Apple ID
  carries. (That day's audit first shipped this as an *open question* on no evidence; the owner
  corrected it and the correction was then measured. See `AGENT_LOG.md` item 12 and commit `ee18288`
  — the record of having been wrong is kept deliberately.)
  ⚠️ **But membership and configured distribution signing are two different facts, and only the
  first is established.** `security find-identity` showed **one `Apple Development` identity and no
  `Apple Distribution`** — enough to build and run on a device, not enough to ship. Obtaining a
  distribution certificate and provisioning profile is a real step and is not done.
- ⛔ **One owner decision this forces, which no run may make. Blindspot §10.3 (kids content / COPPA)
  stops being hypothetical**: App Store submission requires an age rating and an answer on whether
  the app is directed to children. The app ships parent-facing today and is closed on that basis;
  submission is the moment that has to be decided rather than deferred.
- **Revisit when:** a costed migration plan exists and is scheduled. **Xcode 26.6 is present on this
  machine** (measured 2026-09-07, `xcode-select -p` → `/Applications/Xcode.app/Contents/Developer`);
  that is a fact about *this* host only, and this project is known to span machines.

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
- **Freshness is decided in both directions, not just "too old" (2026-08-17, backlog item 44).** The
  rule above was implemented as `ageDays > STALE_AFTER_DAYS`, which reads as "old enough to hide" and
  silently means "everything else is current" — so a *missing* `asOf` (age `null`) and a *future* one
  (age negative) both counted as fresh. Both were live: with no `asOf` the Sector screen rendered
  every figure under the heading "As of undefined", which is the §2.3 rule broken by the code meant to
  enforce it. `useMarketData.freshness(asOf, today)` now decides it, and an age it cannot trust is not
  freshness: no readable date is stale, and more than `FUTURE_TOLERANCE_DAYS` (1) ahead of the device's
  own date is stale. One day ahead stays fresh on purpose — the job stamps its own local day, so a
  device west of it can legitimately still be on the previous date, and cutting those users off from
  good data would be a worse error than showing it. The bound is what stops a badly-wrong device clock
  from turning a genuinely old file into a negative age that reads as new. Checked by `check-data.mjs`
  §25, which also asserts the hook still asks `freshness` rather than re-deriving the comparison.
- **Revisit when:** the proprietary RS formula is ready (swap the strategy, keep everything else); or
  a provider's terms change; or the product needs intraday data, which would reopen every point here.

### Instrumentation: minimum event set wired to a local sink, not PostHog yet

- **Status:** ⚠️ **open, but narrowed 2026-09-05 — the transport now exists; only the account does
  not.** `sink()` no longer has to be swapped: `track()` writes the local log *and* forwards to
  whatever `src/lib/analyticsConfig.js` names, which ships as `"none"`. What remains is an account
  and one pasted value. See `AGENT_LOG.md` backlog item 18 and the 2026-09-05 sub-entry below.
- **What was decided:** `src/lib/analytics.js` exports a single `track(event, props)` and an
  `EVENTS` map covering `LAUNCH_PLAN.md` §9.2's minimum set (app opened, lesson started/completed,
  quiz taken, paywall viewed, trial started, subscribed, canceled, ad watched). `track()` currently
  writes to a rolling `localStorage` log (`ecycles_analytics_log`, capped at 200 entries) rather than
  calling PostHog, which §9.2 names as the target provider.
- **Why not PostHog now:** it needs a real account and a public API key, neither of which a dev-agent
  run can create. Shipping the call sites now (`app_opened` in `App.jsx`; `lesson_started`/
  `lesson_completed`/`quiz_taken` in `LessonReader.jsx` and `Practice.jsx`) means the only thing left
  when a key exists is swapping `sink()`'s body — no call site changes, same shape as the market-data
  adapter seam. (Payload shapes were corrected 2026-08-16; see the superseded entry below. Doing that
  *before* a provider exists is the point — the day a key lands, the measurement window starts with
  the data §4.3's ≥40%-completion gate needs, rather than with a known gap in it.)
- **~~Why fire `quiz_taken` per answered question, not per quiz session:~~ SUPERSEDED 2026-08-16 —
  its premise expired.** The original reasoning was: "the app's review/check unit is a single
  question, not a multi-question test with a start/end boundary; per-question granularity (with
  `correct` and a `source` of `"lesson_check"` or `"review_queue"`) needed no new session-tracking
  state and is at least as useful for a completion-rate metric later." That was true when written
  (2026-08-05). It stopped being true on 2026-08-15/16, when `Practice.jsx` gained real sessions —
  a start, `BATCH_SIZE` pauses, a single terminal complete screen, and a session score it already
  computes and displays in its results recap. §9.2 asks for "quiz taken (**with score**)", and a
  score is a property of a finished quiz, not of one answer.
- **What replaced it (2026-08-16, backlog item 29):** `quiz_taken` now fires **once per finished
  quiz** carrying `{correct, total, scorePct}` — at the last answer of a lesson check (that screen
  has no finish button, so the last answer *is* the end) and on the review session's complete
  screen, which both "answered the last question" and "stop here" at a batch pause land on. A batch
  pause deliberately does not fire it: the session continues. **The per-question signal was
  preserved, not dropped** — it fires under a new `quiz_answered` name, so nothing that was being
  recorded before stopped being recorded. `lesson_completed` likewise gained the `durationSec` §9.2
  asks for, measured from `performance.now()` rather than the wall clock so an NTP or timezone jump
  mid-lesson cannot corrupt it. The numbers are computed by pure helpers (`elapsedSeconds`,
  `quizScore`) so `npm test` can check them without a browser, and `check-data.mjs` §13b now asserts
  the call sites actually pass them — the previous gap was that both events fired but neither
  carried its §9.2 field, which reads as "done" in a grep and isn't.
- **`quiz_answered` is beyond §9.2's minimum, deliberately.** §9.2 names a *minimum* set; keeping
  per-question granularity costs one extra event name and is what the Leitner queue's behavior
  would have to be analyzed against.
- **`sim_lever_chosen` is the second such event, added 2026-08-16, and it exists to make a claim
  falsifiable rather than to fill a gap.** The policy simulator (backlog item 34) shipped with no
  instrumentation, which left §3.0.4's "interactive content is the differentiator" bet with no
  measurement at all — the exact condition §9.2's own closing line names ("if you cannot name the
  event that would refute a feature, you do not yet understand the feature"). It is now `CLAIMS.md`
  **A7**, whose denominator is the hosting lesson's `lesson_started`. Two shape decisions: it carries
  `{lessonId, scenarioId, optionId}` and no prose (both scenarios happen to share an `optionId` of
  `hike`, so the scenario id is what disambiguates them, and the situation text is five-language
  content rather than a measurement); and **it fires on choosing a lever, never on clearing one** —
  a toggle that fires on both edges still looks instrumented while answering "how many clicks"
  instead of A7's "did this learner drive the model". `check-data.mjs` §13c asserts both.
- **Why `paywall_viewed`/`trial_started`/`subscribed`/`canceled`/`ad_watched` are unfired:** none of
  those features exist in the app yet (no paywall/billing code — confirmed by
  `LAUNCH_READINESS.md`'s own grep). The event names exist so the provider swap-in doesn't also have
  to invent names later, but firing them now would be fabricated data.
- **Revisit when:** ~~a PostHog (or other provider) account and key exist — swap `sink()`~~ —
  **superseded 2026-09-05: `sink()` no longer needs swapping.** See below.

- **Update, 2026-09-05 (owner-directed, "set up analytics for O-2"): the transport is built and
  provider-agnostic; the provider choice is deliberately NOT made here.**
  - **What was decided.** `src/lib/analyticsConfig.js` is a committed config module with
    `provider: "none"` as shipped. `track()` now calls two sinks: the existing `localStorage` log,
    **always**, and `remoteSink()`, which does nothing while the provider is `"none"`. Three provider
    shapes are supported — `plausible`, `posthog` (the plan's original target) and `custom` (any
    JSON endpoint). **No `track()` call site changed**, which is what the original entry promised.
  - **Why the provider is not chosen here.** It is an owner decision with cost and privacy
    consequences: PostHog is free at this volume and gives funnels that compute §4.3's ≥40% gate
    directly, but sets a persistent id and ships a heavy SDK; cookieless providers (Plausible,
    Umami) need no consent banner and weigh ~1-2 KB but cost money or measure less. The seam means
    that choice no longer blocks the code, so it should be made on its merits rather than by
    whoever happens to be editing this file.
  - **Config is a committed `.js` file, not an environment variable.** The deploy is `npm run build`
    then drag `dist/`; a build-time env var is silently skippable, and forgetting it produces a
    successful build with analytics quietly off — the precise failure this item exists to end.
    Nothing in the file is secret: an ingest key or site id is public by construction, and the file
    says so in a ⛔ block that names the private-key values that must never go there.
  - **A privacy guard, not tidiness: `sanitizeProps` drops anything that is not a number, a boolean,
    or an id-shaped string ≤64 chars.** Every current call site passes scalars, so it changes nothing
    today; it exists so a future call site cannot leak lesson prose or typed text to a third party by
    passing it as a prop. Objects, arrays, nulls and prose are dropped rather than truncated.
  - **No persistent id and no cookie.** PostHog needs some `distinct_id`, so it gets a random one
    generated per page load and held in memory only. **The cost is stated rather than discovered:
    "unique users" in a PostHog dashboard will read as "sessions".** Plausible is sent no id at all,
    since it counts visitors server-side.
  - ⛔ **The bug this cost, worth keeping because it is invisible when it happens:
    `navigator.sendBeacon` always sends with credentials mode `include`.** A non-simple content type
    (`application/json`) therefore triggers a *credentialed* preflight, which any endpoint answering
    `Access-Control-Allow-Origin: *` rejects — and the event vanishes with nothing thrown and nothing
    logged. Measured against a local receiver: **0 of 5 events arrived**. `sendBeacon` is now used
    only for `text/plain` (CORS-simple, no preflight — which is also why the Plausible adapter sends
    `text/plain`, as Plausible's own script does); everything else uses `fetch` with
    `credentials: "omit"` and `keepalive`. **`mode: "no-cors"` is deliberately not used**: it forbids
    the JSON content type and makes failures opaque.
  - **Verified end-to-end without any provider account**, by pointing `custom` at a local receiver
    and driving the built app in a browser: `app_opened`, `lesson_started{lessonId:29}`,
    `quiz_answered`, `quiz_taken{correct,total,scorePct}` and `lesson_completed{durationSec:102}`
    all arrived, under one session id. The two §9.2 payloads that §4.3's gate needs — duration and
    score — were observed on the wire, not inferred.
- **Update, 2026-08-21 (owner-directed): the event is `canceled`, not `cancelled`.** The house style  <!-- us-english:allow: specimen: the rule names the wrong form deliberately -->
  is US English (backlog items 91, 92), and this name was the last British spelling left in the repo.
  Renamed in all six places at once — `EVENTS.CANCELED: "canceled"` in `src/lib/analytics.js`,
  `check-data.mjs` §13's expected minimum set, `LAUNCH_PLAN.md` §9.2, `LAUNCH_READINESS.md`'s status
  row, and both enumerations in this entry — so the wire name, the assertion and every document that
  names it cannot drift apart.
  **Why this was safe to rename rather than a contract break, measured rather than assumed:** the
  event has **no call site** (`grep EVENTS.CANCELED src/` is empty, against a control that finds
  `EVENTS.APP_OPENED` in `App.jsx`), no provider is wired (item 18), and nothing has ever fired it,
  so no stored `ecycles_analytics_log` entry carries the old name. Nothing reads `EVENTS` by key
  either — only `Object.values()` — so the constant's name is internal.
  **A correction to the record while renaming it:** item 91's run left this name British and gave two
  reasons, and only one of them was true. It *is* an identifier spanning code, a checker and three
  documents, which is why it should move as one change. But that run also said two of the
  enumerations sat "inside `DECISIONS.md` dated records" — they do not. Both bullets above are
  standing prose with no date stamp, editable in place under the same rule that governed that sweep.

## Closed

### Progress is a bar, not a ring — the plan was changed to match the app

- **Status:** closed (dev-agent decision, 2026-08-17). `AGENT_LOG.md` backlog item 62's **F4**, filed
  by item 58's plan/practice reconciliation sweep and left undecided by item 61 on purpose.
- **The contradiction.** Three lines of `LAUNCH_PLAN.md` (§3.2 twice, §3.3 once) promised a **progress
  ring**. The app has only ever rendered a **bar**: `ProgressBar` in `src/components/ui.jsx`, used on
  `Learn.jsx` and `Practice.jsx`. Measured live rather than read off the code — on the Learn screen
  after completing lesson 1 the element is **309×6 px** (aspect ratio 51.5:1), `role="progressbar"`,
  `aria-valuenow=1` / `aria-valuemax=40`, with its fill child at `width: 2.5%` — exactly 1/40 — and
  **zero** `<svg>`, `<circle>` or `stroke-dasharray` anywhere inside it. Nothing ring-shaped exists.
- **What was decided: change the plan, not the app.** Nothing has asked for a ring; no §3.0 clause
  needs one; a bar communicates 1/40 as well as a ring does and is already accessible and shipped.
  Building a ring to satisfy a sentence is the tail wagging the dog — the same recommendation item 58
  made when it found this and item 61 declined to act on unilaterally.
- **Why this one was worth a decision entry at all.** `scripts/refresh-readiness.mjs` *generates* the
  figure inside §3.2's sentence, so a script was keeping **1/40** true while the **noun** beside it
  stayed wrong, and `npm test` passed. That is the sharpest form of this project's recurring failure:
  a guarded number lending credibility to unguarded prose. The noun now sits **inside** the guarded
  shape (`progress bar at 1/40`), so rewording it fails the check — confirmed by running it against
  the reworded document before updating the generator.
- **Revisit when:** someone actually wants a ring for the completion moment. That is a design request,
  and it should arrive as one — at which point `npm test` will fail on this sentence and the plan gets
  updated in the same change, which is the intended behavior.

### How a lesson's `minutes` estimate is computed — 200 wpm over everything on screen

- **Status:** closed (dev-agent decision, 2026-08-17, owner-directed pick). See `AGENT_LOG.md`
  backlog item 56 and `scripts/check-data.mjs`'s `READING_MODEL` block, which is the implementation
  and the long-form reasoning.
- **What was decided:** `minutes` is **derived, never authored**. It equals
  `max(1, round(words / 200))` where *words* is every English word the lesson's default path renders:
  title, subtitle, each section heading and body, takeaway, thinkAbout, and — new as of this
  decision — the end-of-lesson check's question, all four options, and the explanation shown after
  answering. `check-data.mjs` §2 recomputes it on every `npm test` and fails on drift.
- **Why the rate is 200 wpm.** Adult silent reading of English non-fiction centers around ~238 wpm
  in the meta-analytic literature (Brysbaert 2019, ~190 studies). 200 is deliberately below that:
  the material is unfamiliar to the reader by construction, and §0's audience spans kids to adults,
  so the median reader here is slower than the average adult. It is not as low as the 100–150 wpm
  figures used for dense study reading, because §3.0.6 mandates plain language and short sentences.
  **The rate was not changed by this decision** — 200 wpm was already in force; what changed is what
  the rate is applied to.
- **Why the check counts.** It is rendered in the same pushed view as the lesson, with no separate
  navigation, and `LessonReader.jsx` calls it the thing that "makes the reading stick." Excluding it
  was not a modeling choice, it was an oversight: with the headings and title it came to 5,807 of
  29,385 words, so **every estimate in the app was ~20% short**.
- **What is deliberately not counted:** time spent *thinking* before answering a check question
  (reading it is counted; deliberating is not — that would be a second constant with no measurement
  behind it), and time on the four inline diagrams and the policy simulator. Both make the figure
  conservative. Cutting the other way: optional glossary chips are not counted either, so the number
  is a floor on a curious reader's time rather than a promise about one.
- **Why one number for five languages:** the field is a single integer shown in every locale, and
  whitespace word-counting is meaningless for zh/ja. English is the reference.
- **What it cost:** 23 of 40 lessons moved, all upward, and the catalog total went **120 → 144
  minutes**. That is a Phase-0 gate metric moving because the metadata behind it was corrected — §4.3
  is *further* clear, not reopened. The deeper point: because the field is now pinned to the content
  by a check, §4.3's content-duration clause is effectively measured from content volume rather than
  from a number a run could edit.
- **Revisit when:** the reading rate is challenged by real completion-time data (item 18's analytics
  would be the first evidence either way), or if a lesson ever gains a non-text step long enough that
  ignoring its duration stops being conservative.

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
- **Update, 2026-08-16 (same date, later run):** point 2 was scoped and built the same day — a `why`
  field (one sentence, all 5 languages) added to all 21 existing kids blurbs, rendered in
  `ParentGuide.jsx` under a new "Why it matters" label. See `AGENT_LOG.md` item 21 and that date's run
  log entry ("Item 21's content-depth scoping, executed") for the full design reasoning and verification.
  Point 1 (child-facing UI) is unaffected and remains owner-only.

### Deep links are hash routing in one module, and a locked lesson still does not open

- **Status:** closed 2026-08-16 (dev-agent run, backlog item 31). Implements `LAUNCH_PLAN.md` §5
  ("web is top-of-funnel: lessons 1–2 playable with no signup, **each lesson a shareable URL**").
  Closes the build gap `CLAIMS.md` C2 was blocked on.
- **What was decided:** four hash routes — `#/learn`, `#/practice`, `#/reference`, `#/lesson/<id>` —
  implemented in a single module, `src/lib/deepLink.js`, with **no routing library added**. `App.jsx`
  gains exactly two call sites: `initialRoute()` for the opening destination and `useDeepLink()` to
  keep the address bar and `{tab, reading}` in step.
- **Why hash routing, and why one module:** backlog item 12 (Expo vs. Vite) is HELD, and its standing
  rule is that the dev agent must not deepen the web-only investment in a way that raises the eventual
  port cost. A router dependency plus history-API paths would raise it — and would also need
  server-side rewrites to survive a refresh on a static host, which the market-data pipeline's
  `public/` deployment shape does not have. Hash routing needs neither. The port cost this adds is
  bounded and stated: delete one file and two call sites.
- **Lesson `id`, not path index:** an index is a position in `lessonsByTrack()` and moves whenever a
  track is reordered, so an indexed link would rot into a link to a *different* lesson — silently,
  which is exactly what made the 2026-08-14 renumbering need a scripted migration. Ids are stable, and
  since no URL existed before this change, no shared link can be carrying a pre-renumbering id;
  `lessonIdMigration`'s table is deliberately **not** applied to URLs.
- **The real decision: a URL does not unlock a lesson.** Sequential unlocking is a recorded product
  bet (`CLAIMS.md` A1). A permissive resolver would void it from outside the app, with no decision
  recorded anywhere, and nothing in the repo would notice. So a link to a locked lesson resolves to the
  lesson path instead — except for a first-time visitor, who gets lesson 1 rather than a cold menu,
  because §3.2 calls the first five minutes the most important feature and someone who clicked a
  lesson link demonstrably wanted a lesson.
- **Cost accepted, and it is owner-facing:** §5's acquisition engine is screen-recorded clips, and a
  clip of lesson 20 links to a lesson a new visitor cannot open. They land in lesson 1 having been
  promised lesson 20. The honest options are (a) accept it, (b) let a link open any lesson read-only
  without marking progress, or (c) drop sequential unlocking. **This is a product call, not a routing
  one** — it is recorded here rather than settled by the module, and `CLAIMS.md` C2 carries the same
  note so it surfaces at the next audit.
- **AMENDED 2026-09-06 (dev-agent): Back now closes a pushed view, and the stated port cost above
  goes up by three lines.** The four routes are unchanged and no hash was added — the amendment is
  deliberately NOT "route the sub-nav", which is the option this entry and the module header both
  rule out. Measured on the built app at 375x812: from Reference › Glossary › a term, ONE Back press
  left all three levels and landed on the Learn tab, and a Back mid-practice-session dropped the
  session — because none of those views touches the hash, so the entry underneath was whatever tab
  the learner had been on. A routed lesson, used as the control, behaved correctly throughout.
  `useDeepLink`'s single `popstate` listener now asks whether a pushed view is open before it
  resolves a hash, and three screens declare themselves with a one-line `useDismissOnBack` call.
  **So "delete one file and two call sites" becomes "delete one file, two call sites and three
  one-line hook calls."** That is a real increase and it is recorded rather than absorbed; the trade
  is that a native shell has a hardware Back button and needs this navigation stack anyway, so the
  three call sites are closer to a description of the port than an obstacle to it.
- **Guarded by `check-data.mjs` §18:** every lesson round-trips through its id, unparseable and
  nonexistent links resolve to the path rather than a blank screen, first-open routing still holds, a
  locked lesson does not open from a URL, and `App.jsx` actually calls both halves. All proven by
  injection.
- **Revisit when:** the Expo decision (item 12) is made, or the app needs a route the grammar cannot
  express — the Reference sub-nav is deliberately unrouted for now, since every route added here is
  surface a native port has to reproduce.

### In-lesson glossary links are a curated map, not an automatic prose match

- **Status:** closed 2026-08-16 (dev-agent run, backlog item 28). Implements `LAUNCH_PLAN.md` §3.0.3
  ("a term either gets defined where it appears or links to the glossary").
- **What was decided:** the lesson→glossary links live in a hand-curated map,
  `src/content/lessonTerms.js` (`{ lessonId: { sectionIndex: [glossary keys] } }`), rendered as a chip
  row under each tagged section by `src/components/GlossaryTerms.jsx`. Tapping a chip expands that
  term's definition **in place**, inside the reader — it does not navigate to the Glossary tab.
- **Why curated and not matched:** an automatic pass over lesson prose links the wrong sense, and this
  is measured, not hypothetical. Scanning all 40 lessons' English text for the 17 glossary terms
  produced 47 lesson-term hits, and the false positives were not edge cases:
  - money lesson 12 (renting vs. buying) contains **"PMI" meaning private mortgage insurance**, which <!-- track-ok: pre-split track labels; see the 2026-08-20 Update at the end of this entry -->
    an auto-linker would define as the Purchasing Managers' Index;
  - money lesson 17 is about **"lifestyle inflation"**, not the macroeconomic kind;
  - money lessons 2/3/4/15 say "credit card", "credit score", "credit report", "credit limit" — none <!-- track-ok: pre-split track labels; see the 2026-08-20 Update at the end of this entry -->
    of which is the glossary's macro sense of **Credit**.
  Matching per-language would multiply the problem: five locales, five surface-form inflections, five
  separate false-positive profiles. Curation moves that judgment to authoring time, where it is
  reviewable in a diff, and keys are language-independent so the chip renders from `glossary.js` in
  the reader's own language without ever matching prose at runtime.
- **Why in place rather than navigating to the Glossary tab:** the friction §3.0.3 exists to remove is
  *leaving the lesson*. It also keeps the change clear of item 12's port-cost rule — no router, no deep
  link, no new dependency.
- **Trade-off accepted:** links must be added by hand when a lesson or a glossary term is added, and
  nothing forces a new lesson to be tagged. What is enforced (`check-data.mjs` §17) is that every
  existing link stays *true*: the lesson and section must exist, the key must be in `glossary.js`, a
  term is linked at most once per lesson, and the term's English name must literally appear in that
  section's English text — so a reworded or reordered section fails the build instead of silently
  leaving a chip pointing at a word that is no longer on screen.
- **Revisit when:** the glossary grows past roughly 40–50 terms, or lesson content starts changing
  faster than the map is maintained — at that point consider generating *candidates* automatically and
  keeping the human accept/reject step, rather than dropping curation entirely.
- **Update, 2026-08-20 (dev-agent run, backlog item 89).** The three false-positive bullets above
  name their lessons by the track those lessons were in *then*. The 2026-08-19 `essentials` split
  (`5633b79`) re-tracked lessons 1–15 out of `money` **without renumbering them**, so lessons 2, 3, 4,
  12 and 15 are `essentials` today and only lesson 17 is still `money`. **The evidence itself is
  unchanged and was re-checked against `lessonContent` this run:** lesson 12 does contain "PMI",
  lesson 17 is about lifestyle inflation, and "credit card"/"credit score"/"credit report"/"credit
  limit" do all appear across lessons 2/3/4/15. Only the labels went stale, so **nothing about the
  decision changes** — curation is still right for exactly the reason recorded above. The bullets are
  left as written because this entry is a dated record; each carries a `track-ok:` marker so
  `check-data.mjs` §31 reads it as history rather than as a live claim.
- **Update, 2026-09-01 (dev-agent run, backlog item 159). The map's second axis is now a section index
  OR the key `TAIL`, and "under each tagged section" above is no longer the whole render surface.**
  The decision is unchanged — curation, not matching — and this extends where a curated chip may sit.
  **What was measured:** chips rendered under sections only, and §17b's coverage sweep read `sections`
  only, so the instrument and the UI were blind together and confirmed each other. 48 glossary-term
  uses live in the `takeaway`/`thinkAbout` pair across the 44 lessons; 39 were already chipped from a
  section, and **9 were accounted for by nothing** — GDP and Debt-to-GDP Ratio on 33, Deflation and
  Credit on 34, QE on 35, Interest Rate on 38 and on 9, Emergency Fund on 8, Stock on 11. §17b
  reported "0 unexplained" throughout, because it never read the field. The sweep now covers 145 uses
  and 104 chips where it covered 136 and 95.
  **Why chips and not exemptions:** `deliberatelyUnlinked` admits exactly two reasons, `defined-here`
  and `other-sense`, and none of the nine is either — each is the glossary's own sense, used without
  definition, in the box that closes the lesson. So the honest fix was the missing render surface, not
  a wider exemption table.
  **Trade-off, added to the one above:** the closing row carries its own label
  (`lessonTermsClosingLabel`, five languages), because the shared caption says "Terms in this section"
  and the takeaway/reflection pair is not a section.

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

<!-- path-ok: economic-cycles-v5.jsx — the owner's local prototype original, GITIGNORED by the 2026-08-16 decision recorded in .gitignore ("ignored, not deleted") — it is on the owner's disk and in git history, and no clone of this repo has it, so this reference must never resolve; restoring the file to the repo would be undoing that decision, not fixing this marker -->
<!-- path-ok: lessonContent.economy.js — deleted by item 45's per-language split; this entry deliberately keeps naming it, and says so in its own text, because the decision recorded here is what the second split extends -->
<!-- path-ok: lessonContent.money.js — same; superseded on file layout, preserved as history -->
<!-- path-ok: LessonReader-*.js — a Vite build-output chunk name under dist/, which §26 excludes from the tree on purpose so this check cannot depend on whether a build was run -->
<!-- path-ok: lessonContent.{economy,money}.js — the same two deleted per-track files, written as a brace contraction in the 2026-08-14 renumbering entry below -->

- **Status:** closed 2026-08-14 (dev-agent run). Supersedes the "chunk size warning threshold raised,
  not split" entry that used to be here — that mitigation is no longer needed and was removed rather
  than left stacked on top of the real fix.
- **What was decided:** `src/content/lessonContent.js` (531 kB source, every lesson's full body text)
  is split into `lessonContent.economy.js` (12 lessons) and `lessonContent.money.js` (28 lessons).
  **Superseded on the file layout, not on the reasoning, 2026-08-17 (item 45):** those two files were
  split again on a second axis, per language, into ten `lessonContent.<track>.<lang>.js` — **that
  split now has its own entry directly below**, written 2026-08-17. The two per-track paths named in
  this entry no longer exist; kept as written because the decision recorded here — load only the track
  being read — is what the second split extends.
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
- **Revisit when:** ~~the money-track chunk grows enough to need its own further split~~ — this
  happened on 2026-08-17, three days later. See the next entry.

### Lesson content split again, per language: ten files, track × language (item 45)

- **Status:** closed 2026-08-17 (dev-agent run, `6f5c48c`). Extends the per-track entry above rather
  than replacing its reasoning. *Written 2026-08-17 as item 61/F13 — the entry above had declared for
  a day that this file owed it, which is this document's stated purpose failing out loud.*
- **What was decided:** the two per-track files became **ten**, `lessonContent.<track>.<lang>.js`.
  Fields are plain strings and the language is the file. `LessonReader` imports exactly one of the
  ten, keyed `"<track>:<lang>"` through a flat map of **literal** specifiers, because Vite can only
  code-split an import it can statically read.
- **Why, and why not the obvious fix:** `lessonContent.money.js` had reached 499.27 kB against Vite's
  500 kB warning — under it by less than a kilobyte, so the next content edit would cross. Measuring
  before choosing reframed it: of that file's 480 kB of body text, en was 97 kB, es 90, ko 102, zh 79,
  ja 112. **About 80% of the app's largest asset was text the reader's device would never display.**
  That makes it a payload problem, not a build-warning problem — halving the file would have bought
  headroom while shipping the same waste, and raising the limit had already been tried and
  deliberately reverted on 2026-08-14 as a symptom-silencer.
- **Result:** largest content chunk **499.27 kB → 116.84 kB** (`money.ja`; English readers load
  102 kB). Ten chunks, none within 380 kB of the threshold.
- **What survived:** `content/lessonContent.js` remains as a node-only merged view for the two
  consumers that need every language at once (`check-data.mjs` parity, `translation-review.mjs`
  hashes). It builds ids and section counts from the **union across languages** rather than using
  English as a spine, so a lesson present in a translation but missing from English still surfaces.
- **Verified before deleting anything:** the reassembled merged view is `JSON.stringify`-identical to
  the pre-split content across all 40 lessons, and all 40 English source hashes are unchanged — a
  moved hash would have marked all 160 lesson/language pairs stale and destroyed the translation
  ledger's state. Live browser check: opening money lesson 1 fetches only `lessonContent.money.en`; <!-- track-ok: pre-split track label; see the 2026-08-20 Update at the end of this entry -->
  switching to Korean then fetches only `money.ko`; opening economy lesson 36 fetches only
  `economy.ko`.
- **One real behavior change:** switching language while reading now triggers a fetch rather than a
  pure re-render, so `lang` joined the loader effect's dependencies.
- **Same axis applied to quiz text 2026-08-17 (item 48)**, removing a 140.88 kB shared quiz chunk that
  every reader downloaded regardless of language. Nothing forced it — it was well under the threshold;
  item 45's closing note flagged it and item 48 is that note being acted on.
- **Update, 2026-08-20 (dev-agent run, backlog item 89).** Ten files are now **fifteen**. The
  2026-08-19 `essentials` split added `lessonContent.essentials.{en,es,ko,zh,ja}.js` and five more
  literal specifiers to `LessonReader`'s map (15 entries, counted this run) — which is the design
  above working as intended: a new track costs five files and five map entries and nothing else. The
  heading's "ten files" is therefore the count as of item 45, not today's. The "Verified before
  deleting anything" bullet's browser check is pre-split history for the same reason: **lesson 1 is
  `essentials` now, so opening it fetches `lessonContent.essentials.en`, not `money.en`.** That
  sentence is left as recorded and marked `track-ok:`; what it verified — one lesson fetching exactly
  one track×language chunk — still holds, and the economy half of it (lesson 36) was never affected.

### localStorage-only progress and personalization state

- **Status:** closed as the *current* approach; known gap flagged below.
- **What was decided:** every piece of per-user state is stored client-side in `localStorage`, keyed
  by a fixed string, with no backend, no account system, and no sync across devices. The keys, all
  declared in one place (`KEYS` in `src/lib/storage.js`):
  `ecycles_seen_disclaimer`, `ecycles_completed_lessons`, `ecycles_streak`, `ecycles_font_scale`,
  `ecycles_continue_pref`, `ecycles_lang`, `ecycles_theme_mode`, `ecycles_review`,
  `ecycles_analytics_log`, `ecycles_legacy_lesson_id_migrated`, `ecycles_seen_practice_coachmark`,
  `ecycles_glossary_bookmarks`.
  > **This list is checked against `KEYS`, not maintained by hand** — `check-data.mjs` §27 fails if a
  > key exists in code and is missing here. *Corrected 2026-08-17: the sentence said "every piece of
  > per-user state added so far" and then named 5 of 12. Because it is universally quantified it was
  > false rather than merely out of date, and §4.5's "state is local-only, no selling of learner data"
  > leans on this entry for what the app actually persists.*
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
  > **Read that bullet as of its date — it is a dated verification record, not a description of the
  > current app.** Every name in it belonged to the tree at `c7651a6`, the commit that closed the gap.
  > Later the *same day*, `79d9507` ("Rebuild app from scratch") replaced the component tree wholesale
  > and took four of those names with it — `Home`, `isLessonUnlocked`, `markLessonComplete` and
  > `saveCompletedLessons`; `loadCompletedLessons` was the only one it left standing. "1/12" was the
  > true reading when the catalogue held 12 lessons — it held 40 the day this note was written.  <!-- us-english:allow: dated verification note in an indented blockquote -->
  > **Deliberately not corrected: rewriting a dated verification falsifies
  > it** — the same rule the lesson-id ranges below carry,
  > where `check-data.mjs` §29's failure message says to append a *new* dated note rather than edit
  > the old claim. What this bullet records is unchanged: `completedLessons` persists through
  > `localStorage` like every other key above, which is the decision. Only the names it verified
  > *through* are historical. *Dated 2026-08-17 (item 62's F11); F11 named two of the four dead
  > names, the other two turned up on re-measuring.*
- **The learner is now TOLD when this degradation is happening (2026-09-07).** The "degrades safely"
  clause above has been true since 2026-08-04 and was, on its own, not enough: measured on the built
  app with site data blocked, a learner completes lesson 1, is shown *"Progress: 1/44"*, a *"1 day
  streak"* and an unlocked lesson 2, and loses all of it on the next load — with the first-run
  disclaimer back. Every write knew: `writeRaw`/`writeJSON` have always returned a boolean and none
  of their 13 call sites read it. `src/lib/storage.js` now reports the condition itself (a startup
  round-trip probe, plus a flag set in the write `catch`es for a quota that fills mid-session) and
  `App.jsx` renders one warn `Note` above the panel in all five languages. **The decision is
  unchanged** — no backend, no blocked feature, read-only use still works. What changed is that
  silent data loss is no longer silent.

- **Revisit when:** the app gains real accounts (Supabase), at which point this whole section should
  be superseded by a sync strategy (local-first with server sync, vs. server-authoritative).

### Machine-translated lesson content: accept for now, track review debt instead of blocking on it

- **Status:** closed — owner decision, 2026-08-11 (interactive session).
- **Background:** `AGENT_LOG.md` item 20 / backlog P-4. A 2026-08-05 decision to not machine-translate
  lesson content (three runs independently declined, citing unreviewed-LLM-translation risk in a
  language `check-blindspot.mjs` didn't scan) was reversed in practice — thirteen consecutive
  lesson-add runs each translated its own new lesson at authoring time, and by 2026-08-09 ~168,000
  characters across es/ko/zh/ja had shipped as unreviewed machine translation, "(Beta)"-labeled, with
  no automated guard scanning the non-English text at all.
- **What was decided:** option (a) of the three the weekly review laid out — accept the current state
  and ship as-is under "(Beta)" labeling, rather than (b) commissioning native-speaker review before
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
- **Scope limit, made explicit 2026-08-16 (backlog item 35) rather than left implicit:** the ledger
  tracks **lesson content only** — `scripts/translation-review.mjs` walks `lessonContent.js`, so
  `glossary.js`, `kidsContent.js`, `markets.js`, `moneyVisuals.js`, `policyScenarios.js` and the
  `locales/*.js` UI strings have never been in
  its coverage numbers. This surfaced when item 35 added 12 money-track glossary terms in all five
  languages: those 48 non-English fields are AI-written under this decision, ship under the same
  "(Beta)" labeling, and are **not** counted by `npm run review-status`. The reported coverage figure
  is therefore "lesson content reviewed," not "app content reviewed," and should not be read as the
  latter. Deliberately **not** fixed by widening the ledger in that run: the ledger's drift detection
  hashes an English *lesson* source and its shape assumes per-lesson records, so covering other content
  types is a schema change, not a config change. Recorded so the next person to quote a coverage number
  knows what it excludes.
  **Amended 2026-08-16 (item 27's lesson-7 figure):** the list above was written from the files item 35
  happened to touch, and was incomplete — `moneyVisuals.js` and `policyScenarios.js` are excluded on
  exactly the same grounds and are now named. The lesson-7 bracket figure added 6 more five-language
  string sets there. Worth noting for whoever eventually widens the ledger: chart labels are the content
  type where an unreviewed translation is *least* visible, because a wrong label still renders as a
  correctly-shaped chart. The `check-data.mjs` locale-parity checks catch a **missing** language, never a
  wrong one.
- **Revisit when:** review coverage is meaningfully non-zero and the actual quality of the shipped
  translations is known, or before any paid/committed use of the app in a market where one of these
  four languages is the primary language.

### Two lesson tracks, money-first, instead of one sequential path

*Decided 2026-08-07 (owner-directed, in session).*

<!-- Every lesson-id range written in this entry is checked by `scripts/check-data.mjs` §29 (backlog
     item 62's F12): each is classified there as either current — it must equal a track's live range in
     `src/content/lessons.js` — or dated, in which case it must equal none of them. §29 asserts rather
     than rewrites, because the ranges below sit inside dated records: when a renumbering lands, the
     repair is a NEW dated Update plus a reclassification in §29, never an edit to what an earlier run
     recorded as true on its date. -->

- **What was decided:** the lesson catalog is two independent curricula, not one chain.
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

- **Update, 2026-09-01 (scheduled dev-agent). `ecycles_review` is no longer keyed by a question's
  array index; it is keyed by a stable `id` on `quizMeta`.** The bullet above is a dated record and
  is left verbatim — its last sentence describes the tree it was written against, not this one. What
  it recorded is exactly what made the index a hazard: the schedule survived a *lesson* renumbering
  because it never referenced a lesson, but it had no defense at all against the *question* list
  being reordered, and reordering that list is an ordinary content edit. The only thing protecting it
  was a comment in `quizMeta.js` asking authors to append. Measured, not assumed: swapping two
  questions across all six quiz files passes the whole suite (`npm test` exit **0**), while an
  out-of-range answer index in the same file fails it (exit **1**) — so the suite reads these files
  and simply had nothing to say about their order. Old and new schedulers were then run side by side
  on one learner's saved state across that swap: the index-keyed one asked `q002` (lesson 30) where
  the learner had answered `q001` (lesson 29); the id-keyed one still asked `q001`.
  **Why an id rather than a check forbidding reorders:** append-only is a real editorial cost — it
  makes deleting a bad question unsafe — and a guard would have preserved that cost in order to
  protect a key shape that was never worth having. **No new `localStorage` key:** the migration reads
  the old numeric keys, maps index *i* to the id now at *i* (correct for any state written before
  today), and is idempotent because an already-migrated object has no numeric keys. Ids never change
  and are never reused; `check-data.mjs` §8b asserts uniqueness, format, and that both screens pass
  an `id` rather than a position.

- **Update, 2026-08-18 (owner-directed, interactive). THREE tracks, `economy` now leads, and the
  §0 product definition this reverses.** The owner's direction changed: the economic machine is the
  main path, and the money track is where *judgment* is taught rather than how-to. `TRACKS` is now
  **`economy` → `money` → `essentials`**, and the old money track was split rather than reordered,
  because it was two curricula under one label:
  - **`money` is now lessons 16-28** — the judgment half ("Does It Put Money In Your Pocket, or Take
    It Out?", lifestyle inflation, sunk cost, present bias, loss aversion). This is the product.
  - **`essentials` is lessons 1-15** (new track key) — the mechanics half (budgeting, credit scores,
    401(k), insurance, taxes). Kept in full and unchanged, but optional: because unlocking is
    per-track, `essentials` now gates nothing and nothing gates it.
  - **`economy` is unchanged at 29-40** and is now what a new install opens on.
  **This reverses `LAUNCH_PLAN.md` §0's "the economy is the *vehicle*, not the product"** (owner-
  clarified 2026-08-04), which is what the 2026-08-07 split and the 2026-08-14 renumbering above were
  built to implement. §0 has been updated in the same change rather than left contradicting the code —
  that contradiction is the exact drift this project has already had three times.
- **Ids were NOT renumbered this time, and must not be.** The 2026-08-14 Update above renumbered to
  keep ids aligned with display order; that coupling is what made a seven-surface scripted remap plus
  a client-side migration necessary, and display order has now changed twice. Ids are stable
  identifiers (persisted progress, `lessonContent` keys, `quizMeta.lesson`, `LESSON_VISUALS`, the
  translation-review ledger, and every `#/lesson/N` link ever shared); display order is a product
  decision. The visible consequence — a first lesson with id 29 — is handled where it belongs, in the
  view: `LessonReader` now shows a lesson's **position within its track** ("Lesson 1 of 12") instead
  of its raw id. The global "Lesson 29 of 40" was already wrong for two independent curricula; it is
  simply more visible now. **Do not repair this by renumbering again.**
- **Update, 2026-08-25 (approved from a drafted proposal, `drafts/income-hierarchy.en.md`). Four new
  lessons open the money track; money's id set is now two disjoint blocks, not one range.** New
  lessons — "The Subject That Wasn't on the Timetable," "Four Ways Money Arrives," "Does It Stop
  When You Stop?," "The Part the Word 'Passive' Leaves Out" (the labor/investment/business/passive
  income frame) — were inserted at the FRONT of money's display order in `lessons.js`, ahead of
  lesson 16, because they are the frame the other thirteen judgment lessons hang on. Per the
  no-renumbering rule directly above, their ids were not taken from a contiguous extension of
  money's existing block (there isn't one — the ids immediately after it already belong to
  `economy`) but from the next unused ids in the global space. **Money is now 16-28 and 41-44 — two
  blocks, not one range.** `scripts/check-data.mjs` §29 was updated in the same change to validate a
  track's live ids by reconstructing the full set from every `live`-classified claim naming it,
  rather than assuming one contiguous (lo, hi) pair; the old contiguity assumption held for every
  track until this change and does not generalize past it. Content: English drafted and reviewed
  against this repo's two closed blindspots (§10.1 no prescriptive advice, §10.2 no guru/book
  branding); es/ko/zh/ja translated (method `ai`, marked in `scripts/translation-review-ledger.json`)
  rather than left as condensed summaries. Wiring touched `lessons.js`
  (id/track/icon/color/minutes/title/subtitle), all five `lessonContent.money.*.js` files,
  `quizMeta.js` and all five `quizText.*.js` files (appended, per those files' append-only order
  rule), and `lessonTerms.js` (linked "Dividend" on the three lessons that mention it, excused
  "Credit" as other-sense on the first — a credit-reporting mention, not the macro aggregate).

## The app's palette is warm, and screen titles are a system serif (2026-08-23, owner-directed)

- **Decision:** `src/index.css`'s two palettes are warm — a cream canvas (`#f8f5f0`) over white cards
  in light, a warm espresso (`#14120f`) in dark — and the two largest type scales (`display`, `title`)
  render in a **system serif stack**, while all body copy stays sans.
- **Why:** the owner's `UIUX/` reference set (Buddy, Duolingo, Quizlet, Vocabulary, Nibble) is
  uniformly warm and editorial. The 2026-08-21 redesign adopted its *structures* — `IconTile`,
  `Tile`/`TileGrid`, `Steps`, `ResumeCard` — but left the palette cool blue-on-near-black, so the app
  had the reference set's bones and none of its voice. The owner asked for the design to be applied;
  this is the half that was missing.
- **What did NOT change, deliberately:**
  - **`theme.js`'s one-accent rule.** The accent stays in the blue family (`#2f43c4` light,
    `#a9b6ff` dark) rather than moving to Vocabulary's sage-teal, because green/amber/red are
    reserved for success/caution/error in this system. A teal accent would collide with `fill.ok`,
    and the 2026-08-21 run already rejected an artboard for exactly that reason.
  - **The 40 per-lesson accents in `content/lessons.js`.** Still a field nothing renders, and that
    file's own comment warns against "fixing" them. Untouched.
- **No webfont.** The display family is `ui-serif, Georgia, "Iowan Old Style", "Times New Roman",
  serif` — a system stack, so it costs no network request, no layout shift and no license question.
  An app that must work from a dragged-and-dropped `dist/` folder should not depend on a font CDN.
- **Contrast was re-derived, not assumed.** All 110 text pairs clear WCAG AA and all 70 graph pairs
  clear 1.4.11's 3:1, with **zero exemptions** — `check-data.mjs` §28/§28b, whose figures were
  predicted offline first and then reproduced by the check to two decimals. The warm palette is
  *better* than the one it replaced on the light worst case (**4.62:1 rising to 5.61:1**); dark moves from
  5.93:1 to 5.81:1, still far above the 4.5:1 bar. §28 also machine-checks the three figures written
  into `index.css`'s CONTRAST header, and those were updated in the same change.
- **Revisit when:** the owner wants a different accent hue. That is a one-token change in three
  places (`:root`, the `@media` dark block, the explicit `[data-theme="dark"]` block, which §28
  requires to stay identical) plus the two shadow rgba()s that tint with it — but re-run
  `npm test` afterwards, because the accent participates in 16 of the 110 checked pairs.
- **Note for whoever reads a screenshot of this app:** the accent photographs as violet and is not.
  Two separate runs (2026-08-21 and 2026-08-23) have now "found" a wrong accent color by eye and
  disproved it by reading `getComputedStyle` — `#2f43c4` is `rgb(47, 67, 196)` in the live DOM.
  Measure before you fix.

## Three UIUX/ patterns adopted, and the display serif reaches raw headings too (2026-08-23, owner-directed)

- **Decision:** the last three patterns from the `UIUX/` reference set that the app had not taken are
  now in: a **circular back chip** in the lesson reader, **one continuous rail** behind the Review
  steps, and a **bevelled primary button**. Everything else in that folder was already built (see
  `AGENT_LOG.md`'s 2026-08-21 entry and item 26).
- **`shadow.bevel` is its own token and must not be collapsed into `fill.accentDeep`.** The design
  first proposed reusing `accentDeep`, which is correct in light (`#24339b` under `#2f43c4`) and
  **wrong in dark**, where the "deep" accent is *lighter* than the face (`#c3ccff` over `#a9b6ff`) —
  a bevel lit from below. `--shadow-bevel` is darker than the face in both schemes, verified by
  reading the rendered button's computed `boxShadow` and comparing relative luminance, not by eye.
- **Why a `--shadow-` prefix and not a `--fill-` one:** `check-data.mjs` §28 pairs every `--fill-*`
  with `--ink-on-fill` and demands WCAG AA. A bevel is a 3px edge nothing ever prints on, so a
  `--fill-` name would have forced an accessibility answer to a question that does not exist.
  `--shadow-*` is outside §28's prefix filters by design.
- **The back chip's accessible name moved to `aria-label`.** The visible "Back" text is gone, so the
  name has to live somewhere; `t.backLabel` now feeds `aria-label` and `title`. The target grew from
  roughly 60×20 to **40×40**. Do not "tidy" that `aria-label` away.
- **`family.display` must be applied by hand to headings that do not go through `<Text>`.** This is
  the trap the run found: the 2026-08-23 serif change wired the family into `Text`'s scale lookup,
  and **two display-scale headings render as raw `<h1>` with inline styles** — the lesson title in
  `LessonReader.jsx` and the sub-screen title in `Reference.jsx`. Both silently stayed in Inter for
  one commit; the reader's lesson title is the largest type in the app. Found by reading
  `getComputedStyle(h1).fontFamily` in the live DOM, **after a screenshot had made it look correct**.
  If a future run adds another raw display heading, set `fontFamily: family.display` on it.
- **Revisit when:** someone wants the bevel gone — it is one line in `BUTTON_VARIANTS.primary`
  plus the three `--shadow-bevel` declarations.

## Hosting: GitHub Pages, canonical (2026-09-07, owner-directed) — supersedes the token-based Netlify deploy below

- **Decision:** the site is **<https://woozkaholdings.github.io/economics-investment-education-app>**,
  published by `.github/workflows/deploy-pages.yml` on every push to `main`. **Netlify is retired.**
  `scripts/deploy.mjs` and the `npm run deploy` script are **deleted**; `.gitignore` keeps its
  `.netlify-token` line so a leftover token file can still never be committed.
- ⭐ **What changed was a PREMISE, not a preference — and the old entry below states it in its own
  words.** Its closing constraint reads: *"`origin` is unusable in this project, so git-connected
  hosting (the normal GitHub Pages / Vercel flow) is off the table. That is what favors a
  direct-upload host."* **The owner made `origin` usable on 2026-09-07** (the remote is live and
  local `main` is a fast-forward of it). The single fact that ruled out git-connected hosting is
  gone, so the choice it forced is re-decided rather than defended.
- **Why this is strictly better on the criterion the 2026-09-06 decision itself chose.** That
  decision's question was *"how often should someone remember to do this?"* and its answer was
  **"nobody should have to."** A token-based `npm run deploy` still required a human to run it —
  and, worse, required the owner to first create a credential no agent could make, which is why the
  site sat **nine commits behind `main`** on 2026-09-07. Pages publishes on push: the action a
  developer already takes *is* the deploy. **The 2026-09-06 goal is met more completely by the host
  that made its own script unnecessary.**
- **What was NOT given up.** `npm run check-deployed` is unchanged in purpose and was never
  Netlify-specific: it reads the URL from `README.md` § Deploying and compares the running site's
  hashed entry bundle byte for byte against a local build. **The instrument that certifies the
  artifact survives the host change**, which is W-7.1's whole finding.
- **A project site means a sub-path**, and that is why `base: "./"` must not be "fixed" to an
  absolute path. Verified 2026-09-07 by serving the real `dist/` under
  `/economics-investment-education-app/`: app boots, all three routes render, `icon.svg` and
  `data/market.json` resolve, `og:url`/`og:image` serve the new origin, 0 console errors, and a
  made-up asset 404s (the control that makes the 200s mean something).
- ✅ **A whole risk class disappears with the manual upload.** The old flow zipped the **local**
  `dist/`, so local junk shipped — an earlier run caught `public/.DS_Store` heading for the live
  site that way. Pages builds from a **clean checkout**, so an untracked local file cannot reach
  the artifact at all.
- ⛔ **One owner action, and it is a browser setting rather than a secret:** Settings › Pages ›
  Build and deployment › Source: **GitHub Actions**. Until it is set the workflow runs and the
  deploy step fails. The workflow authenticates with Actions' own `GITHUB_TOKEN` — nothing to
  create, nothing to store, nothing to rotate.
- **Revisit when:** the app moves to a custom domain — change `README.md` § Deploying's URL first
  and `npm test` fails until `index.html` agrees (§38, injection-tested 2026-09-07: a moved URL
  fails on both `og:url` and `og:image`).

## SUPERSEDED 2026-09-07 — The deploy is automated with a token, because a manual step is what failed (2026-09-06, owner-directed)

> ⚠️ **Kept because the entry above is an argument against it and cites its reasoning.** Everything
> below was true and correctly decided on 2026-09-06; what invalidated it is the `origin` premise in
> its last bullet, not an error in it. `npm run deploy` and `scripts/deploy.mjs` no longer exist.

- **Decision:** deploying is `npm run deploy` — a real command, not a procedure. Owner's choice on
  2026-09-06, made against three alternatives that all kept the manual drag (deploy daily, deploy
  per-commit, deploy gated by learner impact). **The cadence question was "how often should someone
  remember to do this?" and the answer chosen was "nobody should have to."**
- **What forced it.** The app went live 2026-09-05 and publishing stayed a browser drag of `dist/`
  onto Netlify. Within a day the live site was **four commits behind `main`** and still taught that
  a recession is when prices fall — a factual economics error fixed in the repo the day before.
  Nobody skipped the step on purpose. **Every instrument in this repo certifies the tree, so all of
  them stayed green while it happened**, and the one review that noticed derived the deployed commit
  from a run-log headline and named the wrong one. See `AGENT_LOG.md` 2026-09-06 and W-7.1.
- **The script's exit code is `check-deployed`'s, deliberately.** `scripts/deploy.mjs` uploads and
  then runs `scripts/check-deployed.mjs` against the live site, and exits with *that* result. "I
  uploaded it" is a claim about what a process did; the only claim worth making is about the site.
  This repo has already shipped one "deployed ✅" that was not live — that failure is not available
  here.
- **It refuses rather than publishing something no commit describes.** Uncommitted build inputs, a
  `dist/` older than any build input, or a missing `dist/` all stop it before the upload. Deploying
  is publishing, and "what is live" must name a commit.
- ⛔ **The token never enters the repo, and this is the one thing to not get clever about.** A
  Netlify personal access token can deploy, rename and **delete** the site. It is read from
  `NETLIFY_AUTH_TOKEN` or from `.netlify-token`, which is gitignored — and if that path is ever
  actually *tracked* (someone `git add -f`s it), the script **refuses to run at all** rather than
  treating it as a working setup, because a secret in history is there for good. Note the contrast
  with `src/lib/analyticsConfig.js`, which holds a **public** ingest key and ships to every visitor
  by design: these are opposite kinds of value and must not be reasoned about the same way.
- **Netlify is not load-bearing and was never chosen on the merits.** It is where the app landed on
  2026-09-05 because Netlify Drop was the fastest path from a folder to a URL. The build is static,
  routing is hash-based, and `base: "./"` works at a root or a sub-path — which is why this repo has
  no `netlify.toml`, `vercel.json` or workflow file.
  <!-- path-ok: vercel.json — named in order to say this repo does NOT have it, the same reason README.md § Deploying names it: hash routing means no host needs an SPA rewrite rule, so there is nothing for a host config file to say. If this path ever resolves, the sentence above is what needs rewriting, not this marker. --> **The host is one URL and one site id in
  `README.md` § Deploying, which both scripts read rather than hardcode.**
- **The real constraint on the host, stated so it is not rediscovered:** `origin` is unusable in this
  project, so git-connected hosting (the normal GitHub Pages / Vercel flow) is off the table. That
  is what favors a direct-upload host — Netlify or Cloudflare Pages, not a preference between them.
- **Revisit when:** the token needs rotating (revoke at
  `https://app.netlify.com/user/applications`, then re-export — no code change), or the site moves
  host. A move is § Deploying's URL and site id plus the ~10-line upload call in `deploy.mjs`; the
  guards, the packing and the verification are host-agnostic.
