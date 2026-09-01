# Agent Log — Economic Cycles App

This file is the memory of the autonomous development agent that runs every 3 hours on this repo. Each run reads this file, picks the single highest-value backlog item, implements it, verifies it, and appends a dated entry below. Do not delete history — prune the backlog as items complete, but keep the run log intact.

## App summary (rewritten 2026-08-04 — third time this rewrite was flagged before anyone did it)

The app was rebuilt from scratch 2026-08-04. `economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` at
the repo root are both reference material only — neither is imported by anything under `src/` (see
"Notes for future runs" below for what each one is and why it's there).

Current structure, under `src/`:

- **`App.jsx`** — the shell. Three bottom tabs (**Learn**, **Review**, **Reference**) plus a pushed
  lesson-reader view; a sticky header with the 5-language picker (en + Beta-labeled es/ko/zh/ja,
  §10.4); a first-run disclaimer modal (§10.1) with a focus trap that must be dismissed before first use.
  Since 2026-08-16 the shell is also addressable: `#/learn`, `#/practice`, `#/reference` and
  `#/lesson/<id>` (§5, item 31), owned entirely by `lib/deepLink.js` — two call sites here and nothing
  else. **A URL does not unlock a lesson**; see `DECISIONS.md` for why, and for the owner-facing cost.
- **`theme.js`** — design tokens (color, type scale, spacing). No inline hex anywhere else in the app.
- **`lib/`** — pure logic, no JSX: `useAppState.js` (every piece of client state, see below),
  `storage.js`, `review.js` (Leitner-box spaced-repetition scheduler), `useMarketData.js` (reads the
  daily job's static file and owns the staleness contract), `marketData/{adapters,fred}.js` (equity/
  economics fetch adapters — used only by the offline job, never by the browser), `relativeStrength.js`
  (a pluggable strategy; the owner's own `WJ_Sector_Comparison` formula landed 2026-08-04 —
  `provisional: false` — replacing the earlier placeholder, see `DECISIONS.md`).
- **`components/`** — `ui.jsx` (Text/Card/Button/Note/Segmented primitives), `Icon.jsx`, `charts.jsx`,
  `LessonVisual.jsx`, `Question.jsx`.
- **`screens/`** — `Learn.jsx` (the lesson path), `LessonReader.jsx` (lesson content, inline charts on
  the 4 lessons that teach a diagram, and an end-of-lesson check), `Practice.jsx` (the spaced-review
  queue), `Reference.jsx` (sub-nav: Glossary, Market signals, Sector performance, Parent guide, About)
  with its five sub-screens under `screens/reference/`.
- **`content/`** — plain `.js` modules, 5-language parity enforced by `npm test`: `lessons.js` (17
  lessons, 12 macro/cycle-theory + 5 personal-finance, added `c29bac3` 2026-08-04), `quizData.js`
  (tagged by lesson — feeds both the end-of-lesson check and spaced review),
  `glossary.js`, `kidsContent.js`, `markets.js` (dateless yield-curve/QE-QT teaching copy), `sectors.js`,
  `economicSignals.js`.
- **`locales/`** — one file per language.

Feature set as of this entry: 17 sequential unlocking lessons with inline charts on the 4 that teach a
diagram, an end-of-lesson check per lesson, a Leitner spaced-review queue fed by those same checks, a
streak counter, `completedLessons`/font-scale/theme all persisted to `localStorage` (`DECISIONS.md`),
light/dark/system theming, dynamic font scaling, the disclaimer rendered on Learn, the reader, Review,
and Reference plus the first-run modal, a parent-facing (not child-facing, see below) kids guide, a
searchable glossary, a dateless Market-signals explainer, and — built across two runs on 2026-08-04 —
a daily Sector-performance screen: eleven S&P sectors ranked by relative strength against SPY, plus six
FRED macro readings (Fed funds rate, 2y/10y yields, the yield-curve spread, CPI, unemployment). Both
source from a static `public/data/market.json` that a scheduled task (`economics-app-market-data`, run
weekdays after close) writes once a day by running `scripts/fetch-market-data.mjs` — no client-side API
key, no live calls, and figures older than 4 days are suppressed rather than shown as current (§2.3's
standing rule).

`LAUNCH_PLAN.md` (v2, rewritten 2026-08-04) is the authoritative launch plan —
`Economic_Cycles_Launch_Plan.docx` is superseded. `DECISIONS.md` records the reasoning behind standing
architectural choices (Vite-not-Expo, `.js`-not-JSON content, localStorage-only state, the market-data
pipeline).

Blindspot register (`LAUNCH_PLAN.md` §10): **10.1** (investment-advice adjacency) and **10.2** (Dalio
dependency) are closed and are standing rules, not settled history — check any lesson or market-copy
change against them before assuming they don't apply. **10.3** (kids/COPPA) ships parent-facing today,
closed on that basis 2026-08-01, but is explicitly **"reopened as a question"** as of 2026-08-04: the
owner has flagged that a genuinely child-facing product is a legal/store-classification decision, not a
UI one, and no run should make it unilaterally. The parent-facing framing stands until the owner decides.

## Prioritized backlog

> Rewritten 2026-08-04 (dev-agent run). The previous version of this section, and of the App summary
> above, still described the pre-rebuild `economic-cycles-v5.jsx` + `Home.jsx`/`Markets.jsx`/`More.jsx`
> split — three separate run-log entries flagged that staleness (2026-08-04, twice) before this run
> actually did the rewrite. Re-derived from `LAUNCH_PLAN.md`, `DECISIONS.md`, and the real `src/` tree,
> not carried forward from the old text. Nothing is deleted — the old numbered items now live in
> "Completed and pruned" below, and the full detail is always in the run log.

**P1/P2 — cleared.** The JSX-monolith split, the first-session flow, and the 2026-08-04 rebuild onto
`src/App.jsx` + `src/screens/*` + `src/lib/*` are all done. See "Completed and pruned" and the run log
for the history. No open P1/P2 items.

**Open**

> ## ⛔ OWNER ACTIONS — nothing in this repo can move these, and they are the whole critical path
>
> **Standing block, promoted to the top of the backlog by the weekly review 2026-08-23.** These two
> items have been named in the closing line of **every run entry since 2026-08-20** — sixteen
> consecutive runs — in the form "item 18 remains the entire critical path… item 72's owner half is
> blindspot 10.10". That sentence is correct and it has moved nothing, which is evidence about the
> *mechanism*, not about the runs. A closing line in a 15,000-line log is not an escalation. It lives
> here now, and it is repeated at the top of every weekly report.
>
> **O-1. A URL. (Item 72's owner half.)** `dist/` builds and is path-agnostic (`base: "./"`, verified
> at a domain root and one directory down); routing is hash-based so no host needs a rewrite rule;
> `README.md` § Deploying has the clicks. **Netlify Drop is a drag of the `dist/` folder.** Open since
> 2026-08-17.
> **The refuting number, re-measured by the weekly review 2026-08-30 (the previous version of this
> line quoted 40 lessons / 145 minutes and had been stale since the money track opened on 08-25 —
> W-5.5's rule applies to this line too): 44 lessons, 5 languages, 8 check scripts, a claims
> register, 160 minutes of content, 62 `check-data.mjs` sections — and zero people have ever opened
> this app. Open 13 days.** Figures read off `npm test`'s readiness line, not carried forward.
>
> **O-2. An analytics provider account and key. (Item 18.)** `src/lib/analytics.js` fires the §9.2
> event set with the §9.2 payloads; `sink()` writes to one device's `localStorage`. §4.3's Phase-0
> completion-rate gate (≥40% finish lesson 1) is scored **❌ Unmeasurable** on the readiness scorecard
> and cannot be scored any other way. O-2 is downstream of O-1.
>
> **O-3 (new, decision not action). A large volume of unreviewed machine translation is now shipping
> every day, and the "(Beta)" decision was made about a smaller, static surface.** `DECISIONS.md`
> accepted option (a) on 2026-08-11 — ship the existing AI translations under "(Beta)" labeling — for
> a corpus that was then sitting still. Since 2026-08-22 item 93 has added roughly **10,000–12,000
> characters per day** of new `es`/`ko`/`zh` prose, and every run entry says so plainly: *"No fluent
> Chinese reviewer has read either lesson."* Human review share is **0% in all four languages** and
> falling as a proportion. Item 93 itself flags this ("the owner should know it is happening") and
> that flag is the honest one. **Nothing here is wrong or blocked — this is a scale change the
> original decision did not contemplate, and the owner should either re-affirm it or cap it.**

> ## PRIORITY BLOCK W-6 — set by the weekly review 2026-08-30. Supersedes W-5's *active* clauses below. W-5's standing rules (W-5.2's pick-list warning, W-5.3's archiving rule, W-5.5's re-read-the-count rule) are UNCHANGED and still binding. Read this first.
>
> **The week was, on craft, the best this project has had. 96 commits, build and tests green, not one
> regression, and a standard of adversarial self-checking — premises re-measured, controls planted,
> probes proven dead and replaced — that most funded teams never reach. This block is not about
> quality. It is about where that quality is being spent.**
>
> ### W-6.0 — the measurement this block is built on. Read it before disagreeing with the rest.
> Measured 2026-08-30 off the tree at `94b4914`, not read off the log:
> - `scripts/` is **15,480 lines**. The app's own code (`src/` minus `content/` and `locales/`) is
>   **6,589 lines**. The instruments are **2.3x the application they measure.**
> - This week: `scripts/` **+8,987** insertions, `src/` **+3,058**. `check-data.mjs` alone is **8,711
>   lines / 62 sections**.
> - **29 of the open backlog items** carry the phrase *"filed … by the run that"* — they are residuals
>   a run filed from its own work, not work derived from the launch plan. **15 open items say
>   "Downstream of O-1". 8 say "Zero live instances". 27 say "Honest priority: low".**
> - The last six runs form an unbroken chain: 146→147→148→149, then 150→151→152, then 153+154. **Every
>   link was filed by the run that closed the previous link.**
>
> **This is W-2's note-chain failure in its third costume.** W-2 caught direction coming from the
> previous run's "next run should pick" line. W-5.2 caught it coming from "continue the tranche".
> **It now comes from "close my own residual" — and W-5.2's remedy expired without being replaced,
> because it was written against item 93 and item 93 closed on 08-24.** A rule scoped to one item
> stops binding when that item does. This one is scoped to the shape instead.
>
> ### W-6.1 — ✅ **RESOLVED 2026-08-30 (owner-directed) via route (a): `drafts/income-hierarchy.en.md` is now tracked and a fresh clone exits 0.** See item 154 for the two-direction measurement.
> ⛔ **RETRACTION, and it is this review's error, not a run's.** The clause below authorized
> **route (b)** as a "reversible stopgap". **Route (b) cannot work at all**, and a scheduled run
> spent itself proving that (commit `90bfeaf`): §26 fails a reference whose path is missing AND
> fails a `path-ok` marker whose path is present. In a clone the path is absent; in the owner's
> tree it is present. **The two states are mutually exclusive, so no value of the marker
> satisfies both.** The review authorized it from reading §26's error message rather than from
> measuring it — the exact failure mode this log names weekly, committed by the reviewer.
> **The transferable part: an error message that prescribes a fix is a CLAIM about the fix, not
> a measurement of it.** §26's message says "add a path-ok marker"; that advice is wrong for
> every reference to a path which exists locally and not in the repo. Authorizing a remedy
> sight-unseen is the same defect as quoting a stale figure, and a weekly review is not exempt.
> **What actually shipped:** route (a) — track the file, making the citation true rather than
> exempted. **Route (c) survives as item 157** and is the only one that fixes the class.
> ORIGINAL CLAUSE, kept because the retraction above refers to it:
> ### W-6.1 PRIORITY — `npm test` FAILS ON A FRESH CLONE, and item 154 files that as "low". It is not low. Fix it first.
> **Reproduced by the weekly review 2026-08-30, not taken on report:** `git archive HEAD` into a clean
> directory, symlink `node_modules`, copy the two gitignored `economic-cycles-v*.jsx` → `npm test`
> exits **1**, on `§26: DECISIONS.md:669 names drafts/income-hierarchy.en.md, which does not exist`.
> The working tree is green **only because the owner has an untracked `drafts/` folder.** Anyone who
> clones this repo — and any CI that is ever added — gets a red suite on checkout.
> **Item 154 called this "honest priority: low" and deferred the whole thing to the owner. The
> deferral is right about the *decision* and wrong about the *urgency*:** a repo that fails its own
> test suite on a clone is a launch-integrity defect, and it went in with the same commit that
> discovered it.
> **Two routes. The choice is the owner's; the delay is not.**
> - **(a) Track `drafts/`.** `DECISIONS.md:669` cites `drafts/income-hierarchy.en.md` as the approved
>   proposal behind **shipped lessons 41-44**. A source document for shipped content arguably belongs
>   in the repo. This is the better answer if `drafts/` is not scratch.
> - **(b) Declare the citation deliberate history**, which is what `check-data.mjs` §26's own error
>   message prescribes: add `<!-- path-ok: drafts/income-hierarchy.en.md — cited as the dated source
>   of lessons 41-44; the draft itself is not repo content -->` to `DECISIONS.md` and raise
>   `EXPECTED_EXEMPTIONS`.
> **✅ Route (b) is explicitly AUTHORIZED BY THIS REVIEW as a stopgap** if the owner has not answered
> by the next scheduled run. It is one line, reversible, and it does not foreclose (a). **Label it a
> stopgap and cite W-6.1 in the comment**, so route (a) is still visibly open. **Carry the control the
> rest of this log would demand: the fresh-clone recipe above must exit 0 after the fix.**
> ⚠️ **And fix the Environment note's `HEAD` control recipe while you are there** — item 154 found it
> needs `cp -R drafts` today, which is the same defect wearing the other face.
>
> ### W-6.2 PRIORITY — the residual-chain rule. This replaces W-5.2's ratio, which expired with item 93.
> **The rule, and it is about shape, not about any item:**
> 1. **A run may not take its own previous run's residual as its headline pick more than TWICE in a
>    row.** The third run picks from the launch plan, from the owner-facing items, or refills the
>    backlog (W-2's standing rule — still a legitimate, valuable whole run).
> 2. **A residual measured at "zero live instances" AND "honest priority: low" is a NOTE UNDER ITS
>    PARENT ITEM, not a numbered backlog item.** Numbering it makes a guard for a property that
>    currently holds compete for capacity with work that moves launch — and it is what grew the floor
>    in W-6.4. Items **120, 126, 140, 143, 144, 149, 152, 153** are hereby **PARKED**: leave the text
>    exactly where it is, do not pick any of them by default, and do not renumber anything.
> 3. **Every new check must name, in one sentence, the LEARNER-VISIBLE failure it would have caught.**
>    §50 blocks (i) and (j) pass this test cleanly — a stale caption an inch from the curve, and a
>    figure that inverts its own lesson, are both things a person would see. Item 152's proposed
>    regex over `LessonVisual.jsx` props does not obviously pass it. **If the sentence cannot be
>    written, the check is not due.**
> ⚠️ **What this rule is NOT saying.** The residual-filing *discipline* — closing an item and filing
> what you found rather than smuggling it into the same commit — is one of the best habits in this
> log and must not stop. **The defect is that the filed residual then becomes the next pick by
> default.** File it; do not turn around and pick it.
>
> ### W-6.3 — the instrument-to-app ratio is now a number to watch, not a rule to obey.
> No threshold is set, deliberately: several of this week's instruments were plainly worth it (§28c
> caught an invisible focus ring across the entire build; the a11y state matrix caught bars drawn 9px
> tall at 320px; §59 caught two safety guards blind to the start of every paragraph — all three were
> real, learner-visible, and shipped). **The number in W-6.0 is here so the next run that proposes a
> check has to look at it first.** Quote it, re-measure it, and say which side of it the proposal
> falls on.
>
> ### W-6.4 — the floor is over budget, and the CAUSE is W-6.2, not insufficient compression.
> `npm test` warns every run: the non-archivable floor is **313,522 b against a 250,000 b budget**,
> growing **+3,834 b per commit**. The backlog alone is **285,978 b** — it is now the floor. Archiving
> cannot touch it (W-5.3), and two compression passes have already run.
> **The link nobody has drawn: each residual filed under W-6.2's habit is a 2-4 KB richly-argued
> backlog item that its own author labels low priority.** That is the growth. **Compression treats the
> symptom; W-6.2 rule 2 treats the cause.** Item 115's two options for the owner remain open and this
> review does not pre-empt them.
>
> ### W-6.5 — note only, no action: the market-data job appears to have stopped.
> `public/data/market.json` is `asOf 2026-08-28`. It committed daily 08-24 → 08-28 and has not
> committed on **08-29 or 08-30**. `STALE_AFTER_DAYS` is **4**, so the Sector-performance screen
> starts rendering "Market data isn't available right now" on about **2026-09-02**. Item 74 has the
> full mechanism. **This is the owner's scheduled job, not dev-agent work — flagged, not touched.**
>
> ### W-6.6 — O-3 restated, because the scale changed again and the decision has not.
> The economy track is now **complete in all five languages** and the money track shipped four new
> lessons. `npm test` reports **es/ko/zh/ja at 100% reviewed, 0% human** — every word of four
> languages is unreviewed machine translation, and 48 of 176 lesson/language pairs are still condensed
> summaries rather than translations (item 93/94). The "(Beta)" decision in `DECISIONS.md` was made
> on 2026-08-11 about a smaller, static surface. **Re-affirm it or cap it — owner's call, unchanged
> and now larger.**

> ## PRIORITY BLOCK W-5 — set by the weekly review 2026-08-23. Supersedes the 2026-08-16 block below (W-1 through W-4 all closed). Read this first.
>
> **The week was strong and the direction is right; this block is about a stop line, a ratio, and four
> pieces of housekeeping.** The one real risk it named is that a single item consumes 100% of capacity
> with a tail long enough to eat the next two weeks.
>
> ### W-5.1 — ✅ **FULLY DONE 2026-08-24** (scheduled dev-agent). All three steps landed; the stop line held.
> **Outcome:** the economy phase **closed**, with the `essentials` remainder filed as **new item 94**.
> `npm run translation-completeness` reported **48 abridged pairs — es 12 / ko 12 / zh 12 / ja 12** and
> **0 abridged pairs anywhere in lessons 12-40**: the main path is fully translated in all five
> languages. Cost: **seven runs**, which is what W-5.1 budgeted.
> **The reasoning that still binds, and the reason to keep it after the work is done.** `economy`
> (29-40) is the **main path** since the 2026-08-18 product reversal; `essentials` (1-15) is the
> *optional* track. Finishing economy is a statable, checkable milestone and cost seven runs; finishing
> `essentials` costs roughly **twenty-four more runs**, on the optional track, before a single person
> has read a word of any of it (O-1). **Item 94 exists precisely so that continuing is a decision
> someone makes rather than a tranche that keeps going**, and W-5.2's ratio rule still binds on it.
> **Re-measure the rate before budgeting any of it** — the per-language rates do not transfer (`ko` ran
> at 0.379 added chars per English char, `zh` at 0.226, `ja`'s reference is 0.50); item 93 records that
> neither inherited the other's, and carries the fuller density bands.
>
> ### W-5.2 — ⛔ **EXPIRED 2026-08-24 when item 93 closed; REPLACED BY W-6.2 ABOVE. Do not act on
> the ratio below — it is scoped to an item that no longer exists.** The ⚠️ pick-list warning at
> the end of this clause is STANDING and still binds. Original text kept for the reasoning:
> **reserve one run in four for work that is not item 93.**
> Twenty of the week's last twenty-four commits were item 93. That is defensible for a sprint and
> corrosive as a habit: it is the W-2 note-chain failure in a new costume — direction stops coming
> from the backlog and starts coming from "continue the tranche". **Every fourth scheduled run picks
> from this list instead**, and says in its entry which one it took and why:
> - **W-5.5 / W-5.6 / W-5.7 below** — cheap, and two of them are documentation-integrity defects.
> - **Item 26** (Quizlet/Vocabulary design review) and **item 27** (re-scope: the money track's
>   visuals shipped, so the item as written no longer describes the gap).
> - **Item 76** and **items 70/71** — process items filed by runs that could not finish them.
> - A **backlog refill** is always a legitimate pick (W-2's standing rule, still in force).
> ⚠️ **The standing lesson this list taught, which is about pick lists and not about any item on it.**
> Item 67's and item 64's residuals sat on this list for seven days after the work was done, and three
> run entries copied the line forward verbatim before a run finally checked the items themselves. **A
> list of candidates is a claim about current state and goes stale exactly like a figure does — re-read
> a candidate's own item before picking it.** (Only the live line was corrected; the run-log entries
> that repeat it are dated records and stay verbatim, per §31.)
>
> ### W-5.3 — the archiving rule. ✅ **DONE 2026-08-23**, and the rule below is STANDING; leave it here.
> **The rule:** when `AGENT_LOG.md` exceeds **600 KB**, the next run moves run-log entries older than
> the most recent weekly-review boundary into `AGENT_LOG.archive.md`, in one commit that touches
> nothing else. That is a legitimate whole run. **Backlog items, the App summary and the Environment
> note are never archived.**
> ⛔ **This rule has a KNOWN DEFECT and has fired twice without moving anything. Read this before
> trusting it.** The trigger is a **whole-file byte count** and the action clause is a **date**, so
> nothing makes the two agree: on both 2026-08-23 and 2026-08-26 everything older than the boundary it
> names had already been archived while the file kept growing past the trigger. Rewording the clause
> once (rolling seven days → most recent review boundary) did not fix it, and **option (b), re-pointing
> the trigger at a run-log byte count, would not either** — it moves the trigger while the action
> clause stays date-based. A corrected rule must make the action clause **byte-driven**: archive whole
> days, oldest first, until the run log is under target. **That is a rule change and it is the owner's
> to make** — a run must not pick unilaterally, because it changes what every future run reads to
> orient. See **item 115** (the owner's two options) and **item 121** (`scripts/check-log-size.mjs`,
> which measures both budgets on every `npm test` and prints the whole-day cut plan without performing
> it).
> ✅ **A PASS RAN 2026-08-29 (scheduled dev-agent) — the rule above is UNCHANGED and its defect is
> still open; only the action was taken.** 2026-08-26 and 2026-08-27 moved to the archive (21 entries,
> 199,064 b), taking the run log from **330,738 b to 132,195 b**. The trigger acted on was **not** the
> 600 KB clause above — the file was 3,730 b under it — but `check-log-size.mjs`'s hard budget, which
> the run log would have hit in **1.9 commits**, at which point `npm test` exits 1 and *no run can
> commit anything*. The two rules disagreed about whether anything was due, and only the newer one
> could stop a build. **This does not settle item 115**, and a run must still not reword the clauses
> above. **The floor is untouched and is now the only budget over its limit: 265,532 b of 250,000 b.**
✅ **A SECOND PASS RAN 2026-08-30 (scheduled dev-agent).** 2026-08-28 moved (12 entries, 122,768 b),
run log **256,308 → 133,567 b**, file **597,412 → 474,671 b**. Same shape as the 2026-08-29 pass: the
trigger acted on was the *measured* warn budget, not the date clause, which was a no-op for a fourth
time. **The defect in the rule above is still open and still the owner's (item 115).**
✅ **A THIRD PASS RAN 2026-09-01 (scheduled dev-agent).** 2026-08-29 moved (10 entries, 85,449 b),
run log **266,511 → 181,070 b**, file **576,464 → 491,023 b**. The run-log budget is now CLEAR at
72.4% of warn; the floor is untouched at 309,953 b and remains the only budget over its limit
(item 115, the owner's). Same shape as both earlier passes — the trigger acted on was the measured
warn budget, and the date clause was a **no-op for a fifth time**.
⛔ **But the reason this pass nearly did not happen is the durable part, and it is a defect in the
instrument, not in the rule.** The previous two runs both read the script's own headroom line and
concluded the pass could wait: it reported **101.3 runs** of room. The honest figure was **6.6**.
See the note under **item 121** — the projection divided headroom by a mean that includes archiving
commits, so *the act of archiving made the next archiving pass look unnecessary*. **Fixed this run.**
⚠️ **AND A NOTE THE NEXT PASS MUST READ, filed here rather than as a numbered item (W-6.2 rule 2).**
**`npm test` cannot detect archive loss.** Proven by plant, not by inspection: deleting a whole
9,168 b entry from `AGENT_LOG.archive.md` and re-running the suite gives **0 failures**. Nothing
checks that what left the run log arrived in the archive. **So "tests pass" is not evidence that an
archiving pass was faithful** — the only evidence is a verbatim containment check of every moved
entry against a pre-cut copy, plus a corrupted-plant negative. Do both, in-run, and report the count.
✅ **The 2026-09-01 pass did exactly this and reported 10/10** — and improved the recipe in one way
worth keeping: **the pre-cut copy does not have to be a scratchpad file.** `git show HEAD:AGENT_LOG.md`
IS the pre-cut copy, so the whole containment proof is reproducible from the repo by a reviewer who
was not present for the run. A scratchpad copy proves it only to its author.
**No check was built for this** (W-6.2 rule 3: no learner-visible failure; W-6.3: `scripts/` is
already 2.3x `src/`). If a future owner decision makes archiving routine enough to be worth guarding,
this note is the case for it.
> ⚠️ **And a fact the cut plan cannot see, learned by cutting: A DAY IN THE RUN LOG NEED NOT BE
> CONTIGUOUS.** 2026-08-27 was two blocks 367 lines apart, because the log switched from append-order
> to prepend-order mid-day. Taking "a day" as one region would have split it; concatenating blocks in
> file order would have written the archive out of sequence. **Order entries by their commit
> timestamps, not by their position in the file.** Filed as **item 142**.
> **Why the shape of this file changed underneath the rule.** W-3 wrote it on 2026-08-16 when the run
> log was **~93%** of the file. By 2026-08-26 the backlog was the larger half, so archiving every
> run-log entry still left a floor no archiving pass could reduce. **That floor is the number to watch,
> and only a backlog-compression pass can move it.**
>
> ### W-5.4 — ✅ **DONE 2026-08-24** (scheduled dev-agent). 37 `##` run entries demoted to `###` across both files, plus their **276 subsections to `####`** — which the item as written did not ask for.
> The run log is now uniformly `## Run log` > `### entry` > `#### subsection`. `check-backlog.mjs`
> finds the backlog by scanning to the next `^## `, so a `##` entry landing above the Environment note
> would silently truncate the check — that is why the level matters.
> ⚠️ **Method note for the next structural pass, and the reason this item is worth keeping.** Measured
> before editing, the fix as scoped **would have made 36 entries worse**: the 37 `##` entries were
> correctly nested internally while the newer `###` entries were flat, so demoting only the entry line
> would have traded a top-level defect for a same-level one. **Measure the *shape* — entry level AND
> child levels — not just the level of the line the item names.** A per-entry child-level tally is what
> exposed it; counting `^## ` alone cannot. Fence-awareness was checked too (0 headings inside code
> fences, fences balanced in both files), since this log is full of pasted output.
>
> ### W-5.5 — ✅ **DONE** (headline), by the item-93 runs. **The standing rule below is STANDING; leave it here.**
> The item opened at **"68 of 160"** against a measured 62 — a count quoted in prose that nothing
> re-derived. **The rule: re-read the count off the script and update BOTH the headline AND the
> stop-line box inside item 93, in the same commit.** The box is the second place, and a premise
> correction on 2026-08-23 found it drifted to 56 while the headline was correct — the first version of
> this rule named only the headline and so did not cover it.
>
> ### W-5.6 — ✅ **DONE 2026-08-23** (scheduled dev-agent). `LAUNCH_READINESS.md` §10.4 now carries item 93's finding.
> §10.4 now publishes the per-language reference ratios, the abridged-pair count, and — the part that
> makes the work schedulable — the **concentration** of the shortfall, instead of framing the
> five-language surface as undifferentiated "maintenance debt". Against nothing, `zh` at 0.28x reads as
> Chinese being compact; against `zh`'s own fully-translated reference of 0.35x it means a fifth of the
> content is absent. **A ratio without its reference is not a measurement** — that is the transferable
> part.
> ⚠️ **Two premise corrections from re-measuring, both worth keeping because both look like bugs and
> are not.** (1) `LAUNCH_READINESS.md` says the build fails if §10.4's character sentence disagrees
> with live content, while `check-data.mjs` §11b says character counts are *deliberately not guarded*.
> **Both are true and they are different guards** — `refresh-readiness.mjs --check` owns the character
> sentence, `check-data.mjs` §11b owns the coverage percentages and explicitly excludes char counts.
> (2) `refresh-readiness.mjs` and `translation-completeness.mjs` report **different English corpora —
> 137,249 vs 140,700 characters.** The gap is **exactly the section headings (3,451 en chars, proven by
> direct computation with a control)**: the first counts bodies + takeaway + thinkAbout, the second also
> counts headings. **The ratios survive it** (es 0.981 vs 0.985, ko 0.469 vs 0.470, zh 0.294 vs 0.295,
> ja 0.359 vs 0.361), so the two can be quoted in one row — but only because that was checked, and
> §10.4 now says so.
>
> ### W-5.7 — note only, no action: four uncommitted US-English edits are in the owner's working tree, and two of them touch protected text.
> `DECISIONS.md` and `LAUNCH_PLAN.md` each carry two unstaged one-word changes (`judgment`→`judgment`,
> `catalog`→`catalog`, `theater`→`theater`, `color`→`color`). **The reviewer did not touch them and
> no run should.** Flagged because two of the four fall inside the exception item 91 deliberately
> honored — quotations and dated records stay verbatim: the `catalog` edit is inside a blockquoted
> **dated verification note** whose own next sentence reads *"Deliberately not corrected: rewriting a
> dated verification falsifies it"*, and the `color` edit rewrites a **quotation** of the old §3.1.2's
> opening line (`"One accent colour per lesson/phase"`), which makes the quotation no longer a  <!-- us-english:allow: verbatim quote -->
> quotation. **Owner's call, and only the owner's.**

> **PRIORITY BLOCK — weekly review 2026-08-16. ✅ ENTIRELY CLOSED (W-1, W-2, W-3, W-4), superseded by
> W-5 above. Kept only for the four standing rules below; the work chronology is in the run log.**
>
> **W-1 standing rule — browser verification is available to scheduled runs. Use it on every UI change.**
> This block existed because of a *regression in what the agent knew about its own environment*: a run
> proved live browser verification worked, and two later runs then asserted from memory that
> `preview_start` is unavailable to unattended scheduled runs and deferred verification to "a future
> interactive session". **Both were false**, and the bad assumption silently degraded the verification
> standard of six shipped UI features. **The rule: a run that changes rendered UI must either verify it
> in a live browser using the Environment note's technique, or state specifically what it tried and
> what error it got — never assert a capability limit from memory.**
>
> **W-2 standing rule — refill the backlog rather than extending a note chain.**
> Seven of eight consecutive runs picked their work from the previous run's "Next run should pick" line
> rather than from this backlog. That chain produced good work, but it is a structural failure: the
> *backlog* stops being the place direction lives, and "remaining actionable areas are thin" becomes a
> symptom of an unrefilled backlog rather than of a finished product. **A run that finds nothing to
> pick should write backlog items** — re-read `LAUNCH_PLAN.md` §4.3/§5/§9 and propose Phase-0-facing
> work — **rather than extend a note chain. That is a legitimate, valuable run.**
>
> **W-3 — the run log's first archive, and the compression precedent this file keeps re-using.**
> Superseded operationally by W-5.3's rule above. What still binds is the **compression method**, first
> applied here to items 17 and 24 (63 and ~80 lines down to 27 and 39): keep each item's current
> status, its standing guidance and its reproducible method; drop the accreted "Update, `<date>`"
> chronology, which is not lost because it is in the run log. Deliberately **kept** in that pass: item
> 24's verbatim owner intent (the "wise rather than impulsive" quote) and its §10.1 tension guidance,
> item 17's reproducible measurement method and its `lessonContent.money` chunk-size caution, and both
> items' failure-mode warnings. ⚠️ **Two staleness bugs surfaced only because someone compressed:**
> item 17's "118/120 minutes" and **item 24's lesson-id references, which predated the 2026-08-14
> renumbering and were simply wrong**. **Lesson ids quoted in pre-2026-08-14 run-log entries are stale;
> `src/content/lessons.js` is the source of truth.**
>
> **W-4 — small correctness/a11y cleanups. ✅ FULLY CLOSED 2026-08-16**; six items, all verified in a
> live browser before and after. Two are worth remembering as method: the glossary-row `aria-label`
> finding was **CONFIRMED against the live accessibility tree, not by reading code** (removing the
> label in the live DOM made the suppressed definition text appear), and `MarketSignals.jsx`'s dead
> `counterReset` was **confirmed inert in a live browser before deleting**, with the rendered list
> byte-identical afterward. See the run log.
>
> **Not a priority, and deliberately so:** more lesson content. Both §4.3 content clauses are met. A run
> that wants to add or deepen a lesson must first say which *unmet* gate it moves — there currently is no
> content-side gate left, so the honest answer is "none." The single remaining Phase-0 clause is item 18's
> ≥40% lesson-1 completion rate, and it is blocked on an owner action (an analytics provider account), not
> on more content. **Item 18 is now the entire critical path to ending Phase 0** — flag it to the owner in
> every run's output until it moves.

> **BACKLOG REFILLED 2026-08-17 (owner-directed), items 55–59.** Derived by reading `LAUNCH_PLAN.md`
> §0–§11 end to end and checking each clause against the actual `src/` tree — not carried forward from a
> run-log note. Every one names the plan clause it serves, every one is unblocked today, and **every
> number below was measured, with a control where the measurement could silently return zero.** They are
> listed in value order; a run may disagree, but should say why.
>
> **Two candidates were measured and NOT filed, which is half the value of a refill:**
> - *§3.3's opt-in daily reminder.* It does not exist — but `src/lib/useAppState.js:188` already says so
>   in a comment, and correctly attributes the blocker to the **held §2.1 platform decision** (a static
>   web page cannot notify a closed tab without a service worker and push infrastructure). The code is
>   already honest; filing an item would just restate it. **Owner-blocked, not backlog work.**
>   > ⛔ **PREMISE CORRECTED 2026-08-31, and this bullet is the reason the defect lived 28 days.**
>   > *"The code is already honest"* was measured on the **comment**, not on the **string a learner
>   > reads**. The comment was honest to a developer; the button underneath it said **"Remind me
>   > tomorrow"** in all five languages — `ko` *"내일 알림 받기"* and `zh` *"明天提醒我"* say **notify
>   > me** outright — and it fires on the first lesson completed each day, which for a new learner is
>   > the first lesson they ever finish. **Two conclusions in this bullet were each right about one
>   > surface and wrong about the other:** "already honest" was true of the comment and false of the
>   > UI, and "owner-blocked" was true of the *reminder feature* and false of the *copy* — rewording
>   > a button needs no platform decision. **The transferable part, which this log has now paid for
>   > in a fourth costume (item 108's proxy, §28c's focus ring, the VIX bands): a developer-facing
>   > comment is not evidence about the learner-facing surface it sits above.** Fixed 2026-08-31 —
>   > the CTA is now a commitment the learner makes ("I'll be back tomorrow"), true as shipped, with
>   > `optedIn` unchanged so a real reminder feature can still read it. The reminder itself remains
>   > correctly owner-blocked. (The `:188` pointer is also stale — the block is at `:216-233` today.)
> - *§3.0.7 WCAG AA contrast.* `theme.js` claims "Contrast for both palettes is verified in
>   `index.css`", and `index.css:91` points at a "contrast note above" **that does not exist**. So the
>   claim is unverifiable as written — but computing it says the claim is **true**: every ink×surface and
>   ink-on-fill pair in both palettes clears 4.5:1, **0 violations**. Filed as **59** at the bottom, and
>   deliberately marked low value: it guards a property that currently holds, which is worth doing
>   cheaply and worth nobody's afternoon.

55. **✅ DONE 2026-08-17 (scheduled dev-agent). Pruned to "Completed and pruned" below as
    `former item 55`; the diagnosis is kept here because three of its five findings are worth not
    re-deriving.** See the run log.

56. **✅ DONE 2026-08-17 (owner-directed pick). Pruned below as `former item 56` — but read the
    correction first, because this item's premise was false and its evidence was an artifact.** See the run log.

57. **✅ DONE 2026-08-17. Curation rules 1 and 2 are now DATA (`deliberatelyUnlinked`, 33 entries)
    enforced by `check-data.mjs` §17b, so "unlinked" can no longer be mistaken for "undefined".**
    See the run log — the item's own 11 occurrences were all deliberate exclusions, and it could not
    see the one real gap by construction.
    > **STANDING NOTE for whoever measures this surface again: §17b sweeps only the keys in
    > `glossary.js`.** "0 unexplained" therefore means every *glossary term* is accounted for — **not**
    > that §3.0.3 is satisfied. Jargon with no glossary entry is invisible to it. That residual is
    > item 60. **Re-run the control too**: the first measurement returned 0 because glossary entries
    > key the term at `en.s`, not `term.en`, so the matcher compared objects and matched nothing.

58. **✅ DONE 2026-08-17 — the doc-vs-tree sweep ran; 13 contradictions listed with file:line in the
    run entry, fixes filed as item 61.** None needed the owner, contrary to the item's prediction.
    > **The transferable pattern, worth not re-deriving: a "measured `<date>`" annotation is LEAST
    > trustworthy when its date matches the change it sits above.** Same-day figures get written
    > before the day's work finishes. Grep `measured 20` and `as of 20` in `src/` and `scripts/`,
    > not just in the Markdown docs.
    > **Cheapest disposition for a stale count inside an argument that does not need it: delete it**,
    > rather than correcting or guarding it.

59. **✅ DONE 2026-08-17 (scheduled dev-agent). `check-data.mjs` §28 now asserts AA on 108 pairs
    (54 per palette) every `npm test`, and the note's own figures are machine-checked. For the fifth
    item running the premise was partly wrong, and this time it was the half that named a defect.**
    > **Two things worth not re-deriving.** (a) The pair set is **derived by prefix, not listed** —
    > affordable only because the full cartesian product passes, so nothing needs exempting; if a
    > future palette edit makes one pair fail, resist adding an exemption list, because that is the
    > hand-maintained shape F10 was filed against. (b) `--ink-on-fill` must stay out of the ink list:
    > it is `#ffffff` in light mode, so pairing it with `--surface-canvas` manufactures a 1.0:1
    > failure for a pair the app never renders.

63. **✅ DONE 2026-08-17 (scheduled dev-agent). Light `--graph-neutral` was given a value, the four uses
    are classified, and `check-data.mjs` §28b enforces 3:1 on 70 graph×surface pairs. For the ninth item
    running the premise was partly wrong — and this time BOTH of its headline numbers were, in the
    direction that had made the item look optional.** See the run log.
    > **The hex this headline used to quote was stale for four days and cost two wrong figures in
    > shipped code comments (item 125).** It said `#7c8494`, the value this run set; the 2026-08-23
    > warm repaint moved the token and nobody re-read the headline. **The value is deliberately not
    > restated here** — restating it just re-arms the trap. `src/index.css` is the palette; read it
    > there. Enforced by `check-data.mjs` §52.

72. **🟡 DEV-AGENT HALF DONE 2026-08-17 (scheduled dev-agent). The build is deployable and the
    clicks are written down; the OWNER HALF — choose a host, drag the folder, hold the URL — is the
    only thing left and it cannot be done from here. Keep flagging it in every run's output until it
    moves, alongside item 18. Do not re-pick this item to "improve" the deploy docs; the refuting
    number is a URL, and no amount of further writing produces one.**

74. **[Process/Distribution — filed 2026-08-17 by the run that made the build deployable (item 72),
    from a consequence that item's own scope did not cover. Do not pick before a deploy exists — it is
    a maintenance problem for a site nobody has yet.] A deployed copy's market data freezes at build
    time, and the app is designed to notice.** `public/data/market.json` is written on the owner's
    machine by the `economics-app-market-data` scheduled job and is baked into `dist/` at build time.
    A deployment left alone therefore ages: after `STALE_AFTER_DAYS` (**4**, `src/lib/useMarketData.js`)
    the Sector-performance and Market-signals figures **stop being shown** rather than being shown as
    current — which is §2.3's rule working exactly as intended, not a bug.
    - **The gap is that nothing owns the rebuild.** Keeping those two screens populated on a live site
      means re-building and re-deploying after the daily job runs; no scheduled task, script or
      document owns that step today.
    - **Cheapest real answer is probably not a script.** Connecting the host to the repo (the README's
      "durable path") makes a deploy follow a commit, at which point the existing job's commit is the
      trigger and nothing new has to be built. Consider that before writing automation.
    - **Honest scope note:** the rest of the app is fully static and unaffected — 40 lessons, the
      glossary, review and the kids guide all keep working indefinitely on a stale deployment. ~~This
      item is about two screens~~ — **one screen. Corrected 2026-08-19 by measurement, not reading:**
      `grep -rn "useMarketData" src/` has exactly one consumer outside the hook, `Sectors.jsx:33`, and
      the Market Dashboard screen was confirmed live to render `For teaching purposes — not live
      market data` and never fetch `market.json`. Market signals is dateless teaching copy; it is not
      affected by this item at all.
    - **⚠️ "Do not pick before a deploy exists" understates this — the condition is ALREADY TRUE in the
      repo (2026-08-19).** `HEAD`'s committed `public/data/market.json` is `asOf: 2026-08-14` against a
      `STALE_AFTER_DAYS` of 4, so a build from `HEAD` today renders the whole Sector-performance screen
      as `Market data isn't available right now. (As of 2026-08-14)` — verified in a live browser
      against a real `HEAD` build. **This is still not dev-agent work**, and the reason matters: the
      `economics-app-market-data` job refuses to commit while other files are dirty, and the owner's
      standing instruction is that `market.json` is committed **alone, once the tree is otherwise
      clean**. Fourteen consecutive runs of a static dirty tree is why it has aged. The unblock is the
      owner's tree landing, not a script. — **✅ RESOLVED the same day: the owner directed that
      `market.json` be committed immediately, overriding the wait-for-clean condition, and it landed
      alone as `Refresh market data (asOf=2026-08-19)`.** `HEAD` now carries same-day data, so a build
      from `HEAD` renders real figures again. **The underlying item is untouched** — the next weekday
      the job runs, `HEAD` starts aging again for exactly the same reason, and nothing yet owns the
      rebuild-and-redeploy step. Treat the above as the worked example, not as the item closing.

73. **✅ DONE 2026-08-20 (scheduled dev-agent). The audit's three §10 blindspots are now
    `LAUNCH_PLAN.md` §10.8/10.9/10.10 and claim D3 is `CLAIMS.md` row 16 (§9.1 says "16 claims").**
    See the run log for the full staged wordings and the two premise breaks.
    > **STANDING METHOD, and this item broke on it twice: find the sentence by its TEXT, never by a
    > line number.** `LAUNCH_PLAN.md:529` was correct when filed and was line 549 a day later —
    > twenty lines of unrelated owner edits above it. A line-targeted edit would have silently
    > corrupted an unrelated sentence.
    > **B-1's refuting number is measured against `src/` APPLICATION CODE, not all of `src/`.**
    > Against all of `src/` the ratio is ~1.1-1.25x and the tripwire reads "not refuted" in the very
    > window that produced the finding; against application code it is 7.5-10x. D3's check date is
    > **2026-09-05** and the item records how to measure it.

77. **✅ DONE 2026-08-19/20 by the owner's own commit `5633b79`, not by a dev-agent run — which is
    why it sat here marked blocked. Confirmed by measurement, not by reading the commit subject.**
    See the run log.
    > **⚠️ DO NOT "fix" a track-count failure by relaxing the count. This was measured.** The
    > `essentials` track is registered in the readiness figures; a run that loosens the assertion to
    > make `npm test` green is removing the thing that caught a real split.

84. **✅ DONE 2026-08-20 (owner-directed) — 237 cross-references converted from numbers to titles
    across five languages, guarded by `check-data.mjs` §16b (proven by injection).** See the run log.
    > **⚠️ THE CORRECTION, and it is why no figure filed in this item should be trusted: the headline
    > count was WRONG BY 80%** — filed as 128, actual 237. **The reference style, so a future run
    > matches it:** the quoted title *head* (text before the colon).

87. **✅ DONE 2026-08-20 (owner-directed, interactive) — a wrong-target reference found only because
    the title rewrite forced every reference to be resolved.** See the run log.

85. **✅ DONE 2026-08-20 (owner-directed, interactive).**
    - **⚠️ KNOWN BOUNDARY, written into the code rather than left implied.** The pattern is English
      month names, so a Spanish "marzo 2026" or a Japanese "2026年3月" still passes. Closing that needs
      a per-language date vocabulary, which item 85 did not scope. What this covers is the English
      source the translations are made from, which is where such a figure would enter the app.

86. **✅ DONE 2026-08-20 (owner-directed) — a factual error found by reading the bodies, fixed in
    all five languages: lesson 6 named only one of the two ways a taxable account is taxed. All four
    translations carried the same error in compressed form.** See the run log.

80. **✅ DONE 2026-08-20 (owner-directed, interactive) — found by the first live QA sweep of the
    `essentials` track. The reader's `Previous` button walked straight through locked lessons.**

81. **✅ DONE 2026-08-20 (owner-directed, interactive) — surfaced by the same sweep. Practice was the
    one surface still printing a raw lesson id.** See the run log.

82. **✅ DONE 2026-08-20 (owner-directed, interactive) — built as scoped, and the item's own premise
    turned out to be UNVERIFIABLE with the instrument available here. Read the instrument note.**
    - **⚠️ THE PREMISE I COULD NOT PROVE, stated plainly because the item told the next run to verify
      against the live accessibility tree and that instruction does not work as written.** This item
      claimed "a `<section>` without an accessible name is not exposed as a landmark region". In the
      `read_page` accessibility tree here, a **bare `<section>` with no name at all still renders as
      `region`** — I stripped the attribute from all three in the live DOM and the tree was unchanged.
      So the before/after difference this item was filed to produce is **not observable with this
      tool**, and any future run that "verifies" a landmark fix by seeing `region` in `read_page` has
      verified nothing.

83. **✅ DONE 2026-08-20 (owner-directed, interactive).** See the run log.

79. **✅ DONE 2026-08-20 (scheduled dev-agent) — built as scoped, and the item's own proposed wording
    was measured to be FALSE in one of the states it has to cover.**
    - **⚠️ THE CORRECTION, and it is the reason this item is worth reading rather than skimming.**
      The item scoped the copy as "the newest reading we have is from {date}, **which is too old to
      show**". That sentence is **false in a state `isStale` also covers**: `freshness()` returns stale
      for a date more than `FUTURE_TOLERANCE_DAYS` (1) *ahead* of the device clock, which
      `DECISIONS.md:82-91` established deliberately (item 44). Reproduced live before writing any copy —
      `asOf: 2026-09-30` rendered `Market data isn't available right now. (As of 2026-09-30)`, a date
      **41 days in the future**. So the shipped key says **"too far from today"**, which is true in both
      directions, and it stays one key rather than two. Do not "improve" it back to "too old".

78. **✅ DONE 2026-08-20 (owner-directed). `check-data.mjs` §30 covers `src/utils/date.js` — the
    app's whole notion of "today", which the market-data staleness contract and the review scheduler
    both rest on. This is regression cover, not a bug fix, and the filing run said so.** See the run
    log — the premise was wrong in both directions at once, which is why §30 is not the section this
    item described.

88. **✅ DONE 2026-08-20 (owner-directed, same day it was filed). Filed by the run that closed item
    64, built by the next one. The premise held and the two-sided control fired exactly as scoped.** See the run log.

89. **✅ DONE 2026-08-20 (scheduled dev-agent). The three stale lines are repaired the §29 way —
    dated Update appended, line marked historical — and §31 now reads `DECISIONS.md` too. Unusually,
    the premise held on every hit it named — every line number and every verdict checked out. What it
    got wrong was the disposition.** See the run log.

90. **✅ DONE 2026-08-21 (owner-directed, same day it was filed). Both mismatches fixed by the `#`
    count, guarded by `check-data.mjs` §32b, and the file is now 36/36 consistent. The item's count
    was right and complete — a whole-file sweep found exactly the two it named, no more.**

91. **✅ DONE 2026-08-21 (owner-directed: "sweep everything except the dated records"). 123 lines
    swept across 32 files; 10 kept, each with a recorded reason.** See the run log.
    > **⚠️ The item's own headline count was WRONG (~69 vs 123) because the scan used `analys[ei]s`,
    > which flags two correct US spellings while missing the entire `-ise`/`-ised`/`-isation`/`-iser`
    > family.** Three passes were needed before it stopped finding new forms. **If a guard is ever
    > wanted, the honest scope is learner-visible strings only.**
    > **`AGENT_LOG.md` and `AGENT_LOG.archive.md` are excluded by design, per §31** — run-log entries
    > are dated records. So are quotations. That exception is why two of the owner's own US-English
    > edits were flagged and left alone (W-5.7).
    > ⛔ **CORRECTION 2026-08-27 (item 128's run): this item's closing claim — "the final whole-repo
    > scan returns exactly the 10 intended exclusions and nothing else" — was FALSE on the day it was
    > written, and the run log's entry for it is a dated record that stays verbatim, so the correction
    > lives here.** Measured against the tree at this item's own commit (`git archive 9232cd0`):
    > **nine British spellings in `src/` and seven in `scripts/` sat outside the exclusion list**,
    > all in code comments, including a `colour` — a form this item's entry lists as one it fixed.
    > The 123-line result and the 1,316-string learner-visible result are both sound; only the
    > whole-repo sentence overstated its instrument, which walked values and not comments.
    > **The advice at the top of this item was right and has now been taken**: the guard exists as
    > `check-data.mjs` §55, scoped to learner-visible strings. See items 128 and 130.

92. **✅ DONE 2026-08-21 (owner-directed, same day it was filed). One string changed — "Borrowing
    gets dearer" → "gets more expensive" — and the item's premise held exactly: a two-pass sweep of
    all 1,316 learner-visible English strings found ONE genuine instance, the one this item named.** See the run log.

93. **✅ ECONOMY PHASE CLOSED 2026-08-24 (filed 2026-08-21). The main path is fully translated in
    all five languages — `npm run translation-completeness` reports 0 abridged pairs across lessons
    12-40 in every language. The remainder (48 pairs, `essentials` 1-11 and 14, identical in `es`,
    `ko`, `zh` and `ja`) is tracked as item 94. DO NOT PICK THIS ITEM AGAIN; do not roll 94 back
    into it.** Full detail — six tranches per language, the defect examples, the per-run arithmetic —
    is in the run log.
    > **STANDING RULE (from W-5.5), and it has fired three times.** The abridged-pair count is re-read
    > off `npm run translation-completeness` by whoever touches this item, **in the same commit**, in
    > **all three places**: this box, item 94's headline, and `LAUNCH_READINESS.md` §10.4's prose. It
    > has read a stale 68, 60, 56, 54 and 50; it is **48** as of 2026-08-24.
    - **The density bands, which are what item 94 needs and must not be re-derived.** A translated
      lesson lands at **`es` 1.02-1.20** (median 1.119), **`ko` 0.45-0.60**, **`zh` 0.285-0.357**,
      **`ja` ~0.50**. These are *language* numbers: do not target another language's band, and do not
      read a low ratio as abridgement across languages. Above ~1.25 in `es`, check for added
      sentences. **The bands were fitted on `economy` lessons only — item 94 says to re-fit on
      `essentials` 12, 13 and 15 before budgeting.**
    - **The rising-reference drag applies to `es` and NOT to `ko`/`zh`/`ja`.** `ABRIDGED_BELOW` is
      0.7x each language's own p90, so in `es` every completed lesson lifted the bar and pushed
      untouched lessons under it. In `ko` the p90 did not move at all (0.5510 before and after),
      because the already-complete money track occupies the top decile. Expecting the drag elsewhere
      causes a false alarm.
    - **Track boundaries, read off `lessons.js`'s `track` field:** `essentials` **1-15**, `money`
      **16-28**, `economy` **29-40**. This item said "money 12-28" in four places for two days. **Do
      not use "12-28" to scope work.**
    - **Why no check saw any of this, and the trap it still sets.** `check-data.mjs` asserts
      *presence* and *structural agreement with English*; a field that exists, is well-formed, agrees
      with English and carries a quarter of its content passes every one. **`translation-review-ledger.json`
      read 100%/0-stale for months over exactly this content** — it records that a reviewer saw the
      text, not that the text is all there. **A green ledger is not evidence about this item.**
    - **Three defect shapes, all needing reading rather than a ratio: bare list** (rule headings with
      no body), **partial enumeration** (three of five gauges), **whole-list omission**. Plus two
      specific warnings: **`zh`/`ko` lesson 30 §1 is different content, not an abridgement** — check
      `ja` 30 before assuming it is a translation — and **`《》` in Chinese is not exclusively a
      lesson-reference marker** (lesson 22's are article headlines), so any guard treating it as one
      will false-positive.
    - **The `es` currency defect does not generalize — measured, do not re-derive.** `ko` writes the
      long scale correctly and `zh`/`ja` contain no `$` at all. One instance, already fixed, no
      guard warranted.

94. **[Content — filed 2026-08-24 by the scheduled dev-agent as W-5.1 step 3, when item 93's economy
    phase closed. This is the `essentials` remainder, deliberately filed as a SEPARATE item rather
    than rolled into 93, because it is a different body of work with a different priority.] 48 of 160
    lesson/language pairs — the whole of the `essentials` track — ship a condensed *summary* rather
    than a translation. `es` 12, `ko` 12, `zh` 12, `ja` 12: lessons 1-11 and 14, identical in all
    four languages.**

    > **⚠️ READ THIS BEFORE PICKING IT UP. This item is NOT a continuation of item 93, and the case
    > for doing it is materially weaker than the case for the work that just finished.** Item 93 was
    > P1 because it was on the **main path** — the track the 2026-08-18 product reversal made the
    > product. `essentials` (1-15) is the **optional** track. At the demonstrated and very consistent
    > rate of **2 pairs per run**, 48 pairs is **~24 runs ≈ 6 days of scheduled capacity**, in four
    > **"(Beta)"-labeled** languages, for an app that **no one has yet opened in any language (O-1)**.
    > **The weekly review's W-5.2 rule still binds** — at most one run in four on translation work —
    > and on this item that ratio should if anything be more conservative, not less.
    > **Recommendation from the run that filed it: do not start this until O-1 is resolved.** A
    > deployed URL would tell us whether anyone reads the optional track at all, which is exactly the
    > evidence needed to decide whether these 48 pairs are worth six days. Filing it here so the work
    > is *scoped and schedulable*, not so it is *scheduled*.

    - **Why it is cheap to resume when the time comes: everything item 93 learned transfers.** The
      per-language density predictors, the ceiling arithmetic, the paragraph-parity check, the strict
      figure multiset, the control-before-negative-result discipline and the three named defect shapes
      (**bare list**, **partial enumeration**, **whole-list omission**) are all recorded in item 93
      and its run-log entries. Read item 93's bullets first; do not re-derive them.
    - **One thing that does NOT transfer, measured 2026-08-24.** Item 93's density bands were fitted
      on `economy` lessons only. `essentials` lessons are shorter and more list-shaped than `economy`
      lessons, and item 93 already records that the ja:ko predictor loses all precision on short
      fields. **Re-fit the band on `essentials` lessons 12, 13 and 15 — the three that are already
      fully translated — before budgeting anything here.** Those three are the only in-track
      reference points that exist.
    - **The abridged set being identical across all four languages is new, and it is an opportunity.**
      Every previous phase of this work was per-language. Here the same 12 lessons are abridged in
      every language, so a single English-side read of a lesson scopes the defect for all four at
      once. **Read once, translate four times** is available on this item and was not available on 93.
    - **O-3 applies to this item with more force than it did to 93.** Human review share is 0% in all
      four languages. 93 at least added unreviewed prose on the path the product is about; this item
      would add ~48 pairs of it to the optional track. **The owner should be asked before this starts,
      not after** — see O-3 at the top of this backlog.

    > **NOTE ADDED 2026-08-31 by the run that audited §3.0 clause 2 — a SECOND, independent content
    > defect on this same track, measured the same day. Filed here rather than as a numbered item
    > (W-6.2 rule 2 + W-6.4), because it is the same decision as the one above: is the optional track
    > worth spending runs on before O-1?** §3.0.2 says *"Concrete before abstract. Lead with a thing
    > that happens to a person, then name the concept."* **`essentials` 10, 11, 12, 13, 14 and 15 —
    > six consecutive lessons — each open by defining their subject** ("A W-2 and a 1099 are both tax
    > forms…", "Mutual funds and ETFs charge an annual fee called an expense ratio…", "A brokerage
    > account is just a container…", "A will is a legal document…", "A credit report is a detailed
    > record…"). **`essentials` 1-9 are nine for nine concrete-first** — Maria, James, Elena, "Picture
    > a neighborhood of a thousand homes". The habit stops at lesson 10 and never returns.
    > **Cost, and why it is bigger than it looks:** unlike `money` 24 — which was fixed the same day
    > by inverting two paragraphs, because its scene was already written — **none of these six
    > contains a concrete scene anywhere in the lesson to promote.** Each needs a scene authored from
    > nothing, then carried into `es`/`ko`/`zh`/`ja`, on lessons that are *also* on this item's
    > abridged list. **So do it in the same pass as the translation work above, not separately** —
    > the "read once, translate four times" opportunity applies to both defects at once, and doing
    > them apart pays the five-language cost twice.
    > **The measurement, so nobody re-derives it:** first two sentences of section 1, screened for a
    > named person or a scene verb, 44 lessons, three controls fired (29 and 1 must read concrete, a
    > synthetic definition-first opener must read abstract). The screen has a **measured 3-in-13
    > false-positive rate** (lessons 35, 39 and 26 use a metaphor, an analogy and a concrete scenario
    > and satisfy the clause without a name or a scene verb), so **it is a reading aid and must not
    > be turned into a build gate** — that is why no check was built. See the 2026-08-31 run-log
    > entry for the full method and the false-positive list.


96. **✅ DONE 2026-08-24 (scheduled dev-agent), same day it was filed. The premise re-measured
    exactly — 772 vs 3,294 characters, to the character — and the item's own scope contained one
    impossible instruction; see the premise correction below. [Bug/UX — filed 2026-08-24 by the
    scheduled dev-agent, proved in a live browser with a control. HIGH VALUE, and it gets worse the
    moment O-1 lands.] A lesson whose content chunk fails to load renders as an empty lesson with a
    working "Mark Complete" button — silently, with no error state.** See the run log.

97. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `check-data.mjs` §36, plus an `export`
    on `HTML_LANG` so the coverage half is an exact map comparison rather than a regex. Premise
    re-measured and it held exactly — `documentElement.lang` and `HTML_LANG` had two hits in the whole
    repo, both inside the hook. Scope grew by one assertion the item did not ask for and one the
    item asked for that turned out to be the weak half; see the run-log entry. [A11y/Tooling — filed
    2026-08-24 by the run that fixed the defect, deliberately not smuggled into
    the same commit.] Nothing stops `<html lang>` from drifting out of sync with the picker again.** See the run log.

98. **✅ DONE 2026-08-24 (scheduled dev-agent) — the metadata, the multilingual tab title, the
    guard (`check-data.mjs` §38) and one extension to `check-blindspot.mjs`, in one commit.
    Premise re-measured and it held; two facts the item did not have narrowed the scope, and the run
    found two defects in its own work. See the run-log entry.**

102. **✅ DONE 2026-08-25, same run it was filed — found by a live DOM sweep of the built app, not
    by reading code. `<main role="tabpanel">` and `<nav role="tablist">` exposed NO `main` and NO
    `navigation` landmark, and two of three bottom tabs pointed `aria-controls` at ids that did not
    exist. Zero new locale keys.** See the run log.
    > **Why the app's usual answer did not apply:** five other tablists here are inside a landmark
    > already, so the pattern that is right everywhere else was wrong exactly once.

103. **✅ DONE 2026-08-25 (scheduled dev-agent). Shipped — but as a skip-to-NAVIGATION link, not
    the skip-to-content link this item asked for. Three of the item's premises were wrong, and the
    third one changed the disposition. Read the correction before re-deriving any of this.**

104. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. DECIDED (a): the list
    now sorts by `relativeStrength.rank`, and the 1M/3M/6M control was NOT removed — because the
    item's argument for removing it was measurably wrong. Guarded by `check-data.mjs` §42.**

105. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. Shipped as
    `scripts/a11y-sweep.js` (9 probes, a self-planting control per probe) plus `check-data.mjs` §43
    and an Environment-note procedure. THE ITEM'S OWN PRESCRIBED GATE WAS WRONG AND WAS REPLACED —
    read the correction below before touching the file.**
    - **⛔ PREMISE CORRECTION, and it changed the design rather than a number.** The item specified
      that the script "**must refuse to report a zero unless `document.hasFocus() &&
      document.visibilityState === 'visible'`**". **Measured: both are permanently false in this
      preview pane even when the tab is fronted and the page is demonstrably rendering** — buttons
      measured 139×44, the document 2944px tall, the screenshot correct. That gate would have
      refused to report **anything, ever**: the exact silent-zero failure it was written to prevent,
      wearing the costume of a safety check. **Implemented instead: a per-capability gate.** Hard-gate
      on *live layout* (achievable, provable, and the thing the geometry probes actually need);
      mark only focus-EVENT-dependent probes `UNAVAILABLE`; report `VACUOUS` — never `ok` — for a
      probe that scanned nothing.

115. **✅ DONE 2026-08-26 (owner-directed: "compress the backlog — option (a)"), with a SECOND PASS
    2026-08-27 (owner-directed) that corrected its headline figure, and a THIRD PASS 2026-08-30
    (owner-directed: "go ahead with the compression pass"). The backlog section is
    481,574 → 176,414 → see item 122 for the current number. All item numbers survive and every open
    item stayed byte-identical in all three passes.**
    > **THIRD PASS 2026-08-30 — measured on the artifact, not the transform buffer.**
    > The compression itself moved the floor **344,130 → 287,564 b** (recovered **56,566 b**) and the
    > whole file **495,813 → 437,685 b**. **This record note then costs ~2.6 KB of the floor back**, so
    > the committed state is ~**290 KB** — a net **~−54 KB**. Quoting only the first number would make
    > this item the kind of figure it exists to warn about; read the live number off `npm test`.
    > 110 closed items **194,188 → 136,060 b (-29%)**; **36 materially changed**, 74 already minimal.
    > Six controls, all green before the write: 134/134 item numbers survive in order, all **24 open
    > items byte-identical**, every compressed item keeps its headline, all 36 changed items have
    > run-log/archive coverage, the coverage probe returns false for invented numbers (9991/9992),
    > and the three section headings still parse. `npm test` exit 0.
    > **What it dropped:** retained-original-text tails (17 items) and non-guidance blocks. **What it
    > kept:** every headline and every block carrying `⚠️`/`⛔`, a standing rule, a named trap, a
    > "do not re-derive", or a "carry a control".
    > ⚠️ **The buffer said 58,128 b recovered; the file said 56,566. This item's own 2026-08-27
    > correction, reproduced exactly** — a figure computed from a transform's output is not a
    > measurement of the artifact. Both numbers above are read back off `check-log-size.mjs`.
    > ⛔ **THE FINDING THAT MATTERS MORE THAN THE BYTES, and it changes what a future pass should
    > be asked to do. The floor is still 37,564 b over budget, and the entire remaining gap sits
    > inside blocks this rule PROTECTS.** Measured decomposition of the 287,564 b floor:
    > open items **91,879** (live work, uncuttable) · closed items **136,060** · W-5/W-6 priority
    > blocks + backlog preamble **31,279** (still binding) · Environment note **23,248** ·
    > App summary **4,737** · preamble **360**.
    > **Cutting all 110 closed items to headline ONLY would reach 214,641 b — under budget by
    > 35,359.** So the 250,000 b budget IS reachable; it is reachable *only* by deleting every
    > standing rule, trap and `⚠️` the closed backlog carries. **That is a rule change, not a
    > pass, and W-5.3's precedent makes it the owner's** — the same boundary item 115 and
    > item 121 already sit on. A run must not take it unilaterally.
    > **Honest read: compression is now near its floor under the current rule.** The pass bought
    > roughly 13 runs of headroom at the measured +4,265 b/commit, and the next pass will buy
    > less. The lever that has never been pulled is the one W-6.2 rule 2 names — **not filing
    > zero-live-instance residuals as numbered items in the first place.**
    > ⛔ **PREMISE CORRECTION 2026-08-27 — this item's original "146,979 bytes" was wrong by 43 KB.**
    > Measured live at the compression commit (`d411961`), the backlog section was **190,062 bytes**,
    > not 146,979, so the first pass cut **60%, not the 69% it claimed**. The original table was
    > internally inconsistent on its face — it reported the 97 items at 153,020 b inside a section it
    > called 146,979 b, and items cannot exceed the section containing them. **The lesson is this
    > project's oldest one in a new costume: a figure computed from a transform's own output buffer is
    > not a measurement of the file.** Measure the artifact after writing it.
    > **What was kept, so a future pass does not re-derive the rule.** Every item keeps its **bold
    > headline** — already the summary a past run wrote — plus every block carrying guidance meant to
    > outlive the item: standing rules, `⚠️`/`⛔` warnings, "do not re-derive", "deliberately not",
    > known limits, traps. **What was dropped:** per-tranche chronology, retained original text, and
    > "Update, `<date>`" accretion. **Nothing dropped is lost** — all 79 compressed items were checked
    > to have run-log coverage, with the probe proven to fire on real item numbers and not on invented ones.
    > **The one judgment call, recorded because it is arguable:** where a blockquote mixed guidance with
    > chronology it was kept whole. **Over-keeping is the right error direction for a pass whose only
    > irreversible move is deletion** — and it is why the first cut was 60% rather than the ~85% a
    > headline-only pass would have produced.
    > **The half this did NOT fix**, and it is still open: W-5.3's trigger is byte-based while its
    > action clause is date-based. **Option (b) does not fix it either** — see W-5.3 above and item 121.

114. **✅ DONE 2026-08-26 (scheduled dev-agent). Lesson 30 §1 now says "monetary base (M0)" — and
    the matching standard term in each language — and carries a §3.0.3 chip to the `M0` glossary
    entry.** See the run log for three premise corrections, one of which changed the fix.
    > **The one worth carrying: the prescribed wording would have FAILED the build.** §17 requires the
    > section's English text to mention the glossary key or its `en.s`, and a bare "monetary base"
    > is neither `M0` nor `Monetary Base (M0)` — hence the parenthetical in the shipped prose.
    > **§2.3 boundary:** the phrase exists because the 2026-08-02 run removed dated figures from it.
    > Rewording it must not reintroduce a number.

113. **✅ DONE 2026-08-26 (scheduled dev-agent). Shipped as `check-data.mjs` §49 — three
    detectors, each proven against its own sample, plus the two `__selftest_*` call sites as a
    live control. One premise correction below. See the run log.** See the run log.

112. **✅ DONE 2026-08-25 (owner-directed). Both axes shipped — 5 languages × 2 font scales — and
    the app came back clean in all 130 sweeps. The defects were all in the instrument: 12 states
    per language were unreachable because every recipe matched ENGLISH display text. Recipes now
    select by id, position, ARIA, numerals, and labels read from the app at runtime. Residual (a
    static guard) deferred to item 113 because `check-data.mjs` was mid-refactor by another
    session. See the run log.**

111. **✅ RETIRED 2026-08-25 (owner-directed) — no defect. All nine of its states measured clean, so
    the yield stopped at three-for-three. The run shipped `scripts/a11y-states.js` (19 states, each
    with an arrival assertion) + `check-data.mjs` §48 instead, so that a clean answer is
    reproducible in ~1.6s rather than an afternoon of hand-driving. Residual filed as item 112.
    See the run log.**
    - **⛔ TWO PREMISE CORRECTIONS, both to text I wrote myself this morning.**
      **(a)** There is no `Kids.jsx` — the age selector lives in
      `src/screens/reference/ParentGuide.jsx`.
      **(b) The claim that item 109 read the batch-pause and session-complete states "on an
      *unseeded* queue" was simply false**, and item 109's own table says so: it records
      `batch pause (10 of 14)`, i.e. a seeded fourteen-question queue. I had misread item 109's
      seeding-trap paragraph, which is about a seed that silently *reverted*, not an absent one.
      Re-measured on a properly seeded queue: both states reproduce `12` exactly.
    - **The seeding trap is already documented and cost item 109 a reading** — writing `ecycles_review`
      while the app is running does nothing, because `useAppState` holds review state in React and
      saves over it. Do the `setItem` and the reload in the same call.

110. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. Thesis confirmed a third
    time — and the defect was on the one screen with 100% reach. Eleven states swept; the first-run
    disclaimer modal was the only one with a finding. Fixed in two halves (the background is now
    `inert` + `aria-hidden`, and the dialog title is the `<h1>`), guarded by `check-data.mjs` §47.
    Residual filed as item 111. See the run log.**

109. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. The suspicion was right
    and the defect was worse than the item guessed: mid-quiz the page had NO `<h1>` at all — its
    entire outline was one `<h3>`. Fixed by making the question the runner's `<h1>` (`headingLevel`
    prop on `<Question>`, default `"h3"` so the lesson reader is untouched), guarded by
    `check-data.mjs` §46 — and the `headingOrder` probe, which called this screen "ok" every time it
    ever ran, was fixed in the same commit. See the run log.**

123. **✅ DONE 2026-08-27 (scheduled dev-agent), the day after it was filed. Shipped as
    `check-data.mjs` §51 — and the item's headline premise was WRONG in the direction that had made
    it look optional: it said "one known instance and it is already fixed", and there were TWO MORE
    STILL SHIPPING.** See the run log.
    > **The correction, kept because it is the reason the item was worth picking.** The item priced
    > itself "low-medium" on the grounds that the class was invisible but empty. Reading the call
    > sites found `AsymmetryChart`'s shared zero line (the two bars ARE their distance from it, and
    > they run in opposite directions) and `CycleChart`'s long-run trend line (`trendLabel` is drawn
    > beneath it and names it, so a caption refers to it). Both were `line.strong`, both measured
    > **1.71:1 light / 1.62:1 dark** on `surface.card` — live, in the rendered DOM, not just from the
    > palette — and both are now `graph.neutral` at **5.24:1 / 4.47:1**.
    > **The generalizable half: no `--line-*` token clears 3:1 against ANY surface in either palette
    > (28 pairs, worst 1.75:1).** So a meaningful line-token graphic is a defect *by construction* and
    > no shade of the token fixes it — which is why §51 is a call-site rule, not a color threshold.
    > §51a machine-checks that premise so the rule cannot outlive its own justification.
    > ⛔ **What §51 does NOT cover, stated so the next run does not assume it does.** It matches SVG
    > paint attributes. `AsymmetryChart`'s zero line was a `borderTop` on a positioned `<div>` —
    > lexically identical to the ~50 correct card borders — and was found by *reading the file*, not
    > by the scanner. That residual is **item 124**.

124. **✅ DONE 2026-08-28 (owner-directed, as one half of item 135). Built exactly as this item's
    "shape that could work" specified — a live-DOM probe rather than a widened source pattern —
    and proven firing on a REAL figure, not only on a plant.**

125. **✅ DONE 2026-08-27 (scheduled dev-agent). The one stale figure is gone, the standing rule is
    now enforced by `check-data.mjs` §52 — and the item's own hypothesis was REFUTED: nothing else
    moved in that repaint.** See the run log.
    > **The premise correction, and it is the reason to keep this item rather than prune it.** The
    > item predicted a sweep "would find whatever else moved in the same repaint." It was run across
    > all of living text — the backlog, the App summary, the Environment note, the five standing
    > docs, and all 72 files under `src/` — and found **exactly one real defect, item 63's headline**.
    > Three other hits were false positives — two are registered, and the third was this item's own
    > original text, which no longer quotes the hex — and all three are instructive: two name a token while
    > quoting the *other* side of a pair, and `lessons.js`'s comment is flagged **because it exists to
    > argue that lesson 32's decorative accent is not `--graph-amber`**. **This was a defect, not a class.**
    > **Standing rule, unchanged and now enforced: a hex quoted in this log is a dated observation,
    > not the palette.** Read the token out of `src/index.css` every time, including when a closed
    > item states it confidently.
    > **Disposition of item 63's headline, per item 58's rule (a stale figure inside an argument that
    > does not need it is deleted, not corrected).** The hex is **not restated** with a fresh value —
    > restating re-arms the trap four days later. The headline now says the run gave the token a
    > value and points at `src/index.css`.
    > ⚠️ **§52's scope is narrower than this item imagined, and that is stated in the code rather
    > than implied: it catches a hex sharing a LINE with the token it misattributes.** A hex whose
    > token is named a paragraph away, or referred to only as "the amber", is invisible to it. The
    > small register is a measured result, not an omission. Residual filed as **item 126**.
    > **The run log and `AGENT_LOG.archive.md` are deliberately OUT of scope** (§31 / item 91: an
    > entry that recorded "3.76:1 at `#7c8494`" was true when written). That exclusion is not
    > cosmetic — injection 5 removed the boundary and a dated entry's injected probe value
    > immediately failed the build.

127. **✅ DONE 2026-08-29 (scheduled dev-agent). Shipped as `scripts/numerals.mjs` + `check-data.mjs`
    §61, with §53(f) now per-language and §21's caption read rather than asserted about. Read the two
    corrections below before extending any of it.** See the run log.
    - **The decision the item left open, made on measurement:** the **numeral normalizer**, not
      §54(e)-style label anchoring — labels are not available here, because lesson 17's claim *is* its
      numerals. Scoped to Arabic digits + myriad units (`만/万/萬`, `천/千`, `억/亿/億`, `조/兆`);
      deliberately no Chinese numeral characters and no written-out English, the corpus using digits
      throughout.
    - ⛔ **THE ITEM'S CHARACTERIZATION OF §21 AND §50 WAS WRONG, and the truth is slightly worse.**
      It said the blind spot "applies to §21's and §50's figure-vs-prose checks". Neither had a
      body-prose check at all: both pin literals and assert **about** prose ("the caption states these
      figures in all five languages") with nothing reading it. §21 is fixed; **§50 is not — see item
      150.**
    - ⚠️ **THE INSTRUMENT TRAP THIS ITEM WARNED ABOUT HAS A FIFTH CASE IT DID NOT NAME, and it is the
      one that bites.** Korean `만` is *both* the myriad marker and the particle "only". Lesson 7's
      Korean caption says `$4,000만 30% 구간에` and the first draft of the parser read it as
      40,000,000, reporting a figure as missing that is plainly there. **The fix is NOT a
      currency-prefix rule** — that was tried and the corpus refuted it, since the Korean markets copy
      writes `$6000억`. It is that **a thousands-separated mantissa never takes a myriad unit**:
      measured over the whole corpus, 58 digit-runs are followed by a unit char, 57 genuine and none
      with a comma, 1 false and it has one.
    - **Where the controls live now:** §61 asserts the parser against 9 specimens as **exact set
      equality**, 4 of them refutations a greedy parser fails. §21's and §53's own per-language
      controls prove the instrument is *on*; §61 is what proves it is *right*.

128. **✅ DONE 2026-08-27 (scheduled dev-agent), the same day it was filed — but read the premise
    correction, because the item's headline was three times too small, its file list was missing a
    rendered surface, and the real finding is about item 91 rather than about a word.** See the run log.
    > **The item said "8 occurrences in one file, honest priority: low." Measured: 11 occurrences
    > across 8 lines, plus a fourth coupled surface the item's own fix-list omitted
    > (`quizText.en.js`, a rendered quiz explanation), plus `specialised` in the same lesson body and
    > `favour` in a rendered answer option — 36 British spellings across 11 files in total.**
    > ⛔ **The correction that matters is to item 91's closing claim, and it is the reason this stopped
    > being a spelling nit.** Item 91 (2026-08-21) closed with *"the final whole-repo scan returns
    > exactly the 10 intended exclusions and nothing else"*. Re-measured by extracting the tree at item
    > 91's own commit (`git archive 9232cd0`, read-only) and re-running the scan: **nine British
    > spellings sat in `src/` outside that exclusion list on the day it was written**, plus seven more
    > in `scripts/` — and `colour` is a form item 91's entry lists as one it fixed. Its trustworthy
    > number came from walking 1,316 **learner-visible strings**, a corpus with no comments in it;
    > the "whole-repo" sentence claimed a scope its instrument never had.
    > **The transferable lesson, and the reason the fix was a guard and not a rename: a style rule
    > with no instrument is a claim, not a property.** Six days after item 91, lessons 42-44 shipped
    > "Labour income" — the term lesson 42 *defines* — into lesson prose, a legend label, a caption
    > and a screen-reader description, and nothing noticed. Closed by `check-data.mjs` **§55**, scoped
    > exactly as item 91's own closing advice recommended (learner-visible strings only).
    > ⚠️ **Two traps this run hit, both worth not re-deriving.** (1) A blanket `labelled`→`labeled`
    > replace rewrites **`aria-labelledby`**, a real ARIA attribute name (17 occurrences repo-wide);
    > it broke §44 inside this very run. (2) A sweep instrument whose extension list omits **`.mjs`**
    > reports "0 occurrences across 0 files" for `scripts/`, which reads exactly like clean.

129. **✅ DONE 2026-08-27 (owner-directed: "do item 129 next"), the same day it was filed. Coverage
    restored 77% → 84% in all four languages. The premise held — and the reading found a defect the
    rename had nothing to do with, which is the case for reading over re-stamping.** See the run log.
    > **The premise was proved, not assumed:** the English delta since the reviewed state is exactly
    > **12 word-level hunks, 11 `labour`→`labor` + 1 `specialised`→`specialized`**, measured with a
    > controlled differ (a planted prose change reported 2 hunks; a self-compare reported 0).
    > ⛔ **The finding: `ja` lesson 43 wrote 「急を要すもの」, the archaic `要す` where modern Japanese
    > takes the attributive `要する`** — unrelated to the rename, and **a re-stamp would have vouched
    > for it**. Confirmed against the app's own Japanese rather than from memory:
    > `lessonContent.essentials.ja.js` conjugates the same position correctly, so the corpus
    > contradicted itself. Fixed.
    > **Two deviations were recorded and deliberately left** (`ko` 42's rendering of "the four
    > thousand dollars" as the per-person $1,000; `zh` 44's "far more than people usually realize"
    > for "unusually well protected"). Neither misstates a figure or breaches §10.1. **Over-editing a
    > language whose only check is this review is the larger risk** — that judgment is the reusable part.
    > ⚠️ **What this does NOT establish.** Every mark is `method: "ai"`. Per
    > `scripts/translation-review.mjs`'s reviewer-of-record note this is real content review but **not**
    > a native-speaker pass, and the correlated-blind-spot caveat applies. **Human review share is
    > still 0% in all four languages** — that is O-3, and it is the owner's.

131. **✅ DONE 2026-08-28 (owner-directed: "do items 131 and 132 next") — 28 of 28 pairs.
    Coverage 95% → 100% in all four languages, 7 stale → 0.** The last 8 pairs (lessons 1 and 4 x
    es/ko/zh/ja) were read in full, not re-stamped, and the reading found a defect no consistency
    check could ever have seen — see the run log and the box below. Read the premise correction
    kept underneath: the staleness flag was UNDERSTATING this item, and its own "scope it to one
    language per run" was the wrong axis.
    > ⛔ **The defect the final 8 pairs produced, and it is item 33's lesson recurring: lesson 1
    > named María in §1 and §2 while ALL FOUR translations had dropped her introduction from §0.**
    > Measured: `es`/`ko`/`zh`/`ja` each had **0** mentions in §0 and first named her in §1, against
    > English's 4 in §0. **Because all four agreed with each other, no consistency check could see
    > it** — §16 verifies translations against English, not English against sense, and this was a
    > uniform omission. Fixed in all four. **The transferable part: a uniform omission is invisible
    > to every cross-language check in this repo, and reading is the only instrument for it.**
    > ⚠️ **And one the source read could not see at all.** The `es` lesson spelled the name both
    > `María` (§1) and `Maria` (§2). Normalizing on that file's majority was **wrong** — the live
    > page then showed two more `María` from `moneyVisuals.js`'s figure, a different module. Every
    > Spanish surface outside that one body writes `María` (moneyVisuals 5/0, quizText.es 2/0,
    > lessonContent.money.es 1/0), so it was reversed. **"The majority in this file" is a sample,
    > not a convention** — item 128's scope error, one module over. **A lesson's rendered surface
    > spans `lessonContent` AND `moneyVisuals`; a review that reads only the first has read part of
    > the screen.**
    > **What the English drift actually is, measured with a two-sided control rather than assumed.**
    > All seven lessons share **one** reviewed-English state — commit `e43dded` (2026-08-20), *not* the
    > 2026-08-14/15 the ledger's `reviewedDate` shows; the English never moved between the review and
    > that date. Exactly two commits then moved it: **`7046854`** (2026-08-20, item 84's "name the
    > lesson, don't number it") touching all seven, and **`ef0665a`** (2026-08-26, item 114's monetary
    > base) touching lesson 30 alone. So the English drift is **six cross-reference renames plus one
    > semantic edit** — very nearly the item-129 shape this item said it was not.
    > ⛔ **But the English is the wrong thing to size this by, and that is the correction that matters.**
    > Staleness is computed from an English hash, so it truthfully reported "the English moved a
    > little". Measured on the *translations* instead, lessons **30/33/37/39/40 grew 2.8x–4.7x in every
    > language** since that reviewed state (lesson 30 `es` 987→3,421 chars; lesson 39 `ja` 383→1,674),
    > **10,855 → 39,627 characters across the twenty pairs**. Those five are `economy`, and **item 93's
    > economy tranche landed after 2026-08-20** — so the 2026-08-14 review saw the *abridged*
    > translation and what stands today is ~**29,000 characters of new, never-reviewed machine
    > translation**. The flag says "re-review"; the work is a **first** review. **A hash over the
    > source language cannot see drift in the target.**
    > ⛔ **FIGURE CORRECTION 2026-08-27, and it is a correction to this item's own first version.** That
    > version said *2.5x–4.5x* and *"~55,000 characters"*, and the 12-pair line below said
    > *"~40,000-character"*. Those were **byte counts read as characters**: `wc -m` counts bytes when
    > no UTF-8 locale is set (verified — three Han characters report 9), which inflates `ko`/`zh`/`ja`
    > roughly threefold and leaves `es` near-correct. The **ratios survived** because both sides were
    > measured the same way; the absolute figures did not. Re-measured over Unicode code points, the
    > real numbers are the ones above and **26,568** for the twelve. **Count code points, not `wc -m`,
    > on any CJK corpus.** (Only this live item is corrected; the 2026-08-27 run-log entry that quotes
    > the old figures is a dated record and stays verbatim, per §31.)
    > **Lessons 1 and 4 are the exact opposite case.** Their translations are **byte-identical** to the
    > reviewed state in all four languages; what changed is that the *English* gained a cross-reference
    > sentence with **no counterpart in any translation**, because both are `essentials` and abridged
    > (0.50x and 0.68x against `es`'s 1.18 reference). Verified pre-existing, not a regression from
    > `7046854`. That gap is **item 132**, and it belongs to item 94's track, not to staleness.
    - **✅ DONE — lessons 30 and 40 x es/ko/zh/ja (8 pairs)**, each read in full in all five languages;
      one real defect found and fixed (`ja` lesson 30's title brackets). Coverage **84% → 89%**.
    - **✅ DONE — lessons 33, 37, 39 x es/ko/zh/ja (12 pairs)**, the 26,568-character never-reviewed
      block, all read in full. Coverage **89% → 95%**, 7 stale → 2. **All twelve are complete and
      faithful**: every section, takeaway and thinkAbout present, and every figure converts correctly
      into each language's own number scale — which was the live risk here and is worth stating,
      because lesson 37 is nothing but large dollar figures (`es` correctly splits *billones* from
      *mil millones*, `ko` 조/억, `zh` 万亿/亿, `ja` 兆/億). One real defect found and fixed (`zh`
      lesson 37's ASCII quotes; see **item 134**).
    - **✅ DONE — lessons 1 and 4 x es/ko/zh/ja (8 pairs)**, 2026-08-28, together with item 132 as
      this bullet instructed. **The "closer to a re-stamp than a read" prediction was wrong**, and
      usefully so: the text being unchanged said nothing about whether it was *right*. The read found
      the dangling-María defect in all four languages plus a two-way name spelling, and item 132's
      eight missing pointer sentences landed in the same commit. **A pair whose source has not moved
      is not thereby correct** — that is the reason this bullet's own cost estimate was wrong.
    - **Closed. Every figure above is superseded by the 28/28, 100%-coverage state.**

134. **✅ DONE 2026-08-27 (owner-directed: "do item 134 next"), the same day it was filed — shipped
    as `check-data.mjs` §56, with 33 live repairs. Read the premise correction: this item was wrong
    about the size of the problem AND wrong about the design, and the design error was the one that
    would have shipped a check that fails on correct prose.**
    > ⛔ **"Zero live instances as of this entry" was wrong by 33.** The item measured `lessonContent`
    > only. Re-measured across the twelve modules §55 walks, in all five languages: **`zh` carried 8
    > corner-bracket spans and 25 ASCII-single-quote spans — 33 in 15 strings across 5 modules** —
    > against its own 152 full-width quotations. `en`, `es`, `ko` and `ja` were clean. **The hand
    > review that found 2 of these missed 33 of the same family, because it was only looking where it
    > was reading.**
    > ⛔ **"The title/non-title join is the load-bearing part" was exactly backwards — it is the main
    > FALSE-POSITIVE source, and building it would have failed the build on correct copy.** Several
    > lesson-title heads are ordinary common nouns. `locales.ja.heroInsight` writes 「取引」 quoting the
    > concept — the English at that spot is a plain *"transactions"*, no lesson reference — and the
    > join would have flagged it as a mis-bracketed title. Lesson 44's own title
    > (`The Part the Word “Passive” Leaves Out`) would have been flagged too, for containing quotes.
    > **§56 therefore reads REPERTOIRE, not role**: which marks each language may use at all, decidable
    > from the character, no sentence understanding, no false-positive class.
    > **The honest cost, stated in §56's header rather than hidden: it does NOT catch the `ja` title
    > drift** that this item was half-filed for. Telling a title reference from an ordinary quotation
    > needs context; that stays with review. It does catch the `zh` drift, and it caught 33 more.
    > **Also corrected: `ja` uses `『』` for SEVEN coined labels, not six** — the sixth-vs-seventh is
    > `moneyVisuals`, outside `lessonContent`, which is the same scope error as the headline.

136. **✅ DONE 2026-08-28 (owner-directed: "do item 136 next"). `figureClaims` now covers 7 of 11
    primitives; the remaining four are documented as deliberately uncovered WITH the measurement
    behind each, so no future run has to re-derive them. 2 of 5 built, 3 declined — read the two
    corrections, because this item dismissed its strongest candidate in a line and misdescribed
    another.**
    > ⛔ **`BracketStack` was grouped with `Bar` as rendering "values whose only relation is
    > proportional to the number beside them". That describes `Bar` and not `BracketStack`**, whose
    > caption opens *"Below the old income line the two stacks are **identical**"* — an equality
    > between rendered boxes in two different columns, the same shape as `outcomeGrid`'s claim and
    > the same shape as the defect that shipped there twice. Built. Measured live: the shared bands
    > render **65.17px and 78.22px in both columns**, and `minHeight: 2` cannot bind (smallest band
    > 13.03px).
    > ⛔ **The strongest candidate of the five was not discussed at all: lesson 3's `GrowthCurve`**,
    > whose own text states four render claims — same starting point, one line straight, the other
    > curving, and a gap that widens. Built.
    > **THE TEST THAT DECIDED BOTH, and it is the transferable part.** Every one of these claims is
    > true of the source arithmetic **by construction** — which is exactly what refuted
    > `ProportionBar`. The question that separates them is **whether a CONTEMPLATED edit breaks it**.
    > For `GrowthCurve` one exists with a date: item 137 gave lesson 23 a log y-axis on 2026-08-28
    > and declined to do the same here on judgment alone. Measured in the real plot box, a log axis
    > **swaps the two descriptions** — the "straight" line bends from **0 → 6.69** off its chord
    > (2.7 stroke widths) while the "curving" one flattens from **15.61 → 0.01**. Proved on the LIVE
    > figure, not only a plant: injecting that axis fired both halves (7.36px vs a 2.75px stroke;
    > 0.01px), and restoring the points returned the sweep to 0.
    > **The three declined, on measurement rather than judgment:** `YieldCurve` and `CycleChart` are
    > **hardcoded SVG path constants** — no data→render mapping exists to break, so a claim would
    > assert a literal against itself (a stronger reason than this item's "no stated quantity",
    > which was wrong: their orderings *are* stated). `Bar` is the one case where this item's own
    > reasoning holds, and it **prints each value as text above its bar** — the same property item
    > 137 used to keep `GrowthCurve` linear. **`ProportionBar` stays refuted; do not rebuild it.**
    > ⚠️ **Latent false positive now written into the probe: `data-figure` sits on the PRIMITIVE.**
    > `GrowthCurve` is generic and only lesson 3 uses it, so claim and caption agree today. A second
    > lesson drawing two curving lines through it would inherit a claim its caption does not make.
    > **Fix is to move `data-figure` to the call site, not to loosen the claim.** The same latency
    > already applies to `lossAsymmetry` and `outcomeGrid`.

137. **✅ DONE 2026-08-28 (scheduled dev-agent). Lesson 23's y-axis is logarithmic; the left edge
    went from 1.64px apart under a 2.58px stroke (0.64x) to 7.00px (2.72x), and `figureClaims`
    reports the figure clean in a live render. Read the premise correction — BOTH of this item's
    stated blockers were larger on paper than in measurement, which is why it had been filed
    rather than shipped.**
    > ⛔ **"`flipDescription` would have to be rewritten in five languages" — FALSE, measured.**
    > A log axis mutes the hockey stick but does not spend it: the $50's last-segment slope goes
    > from **9.68x** the mean of the earlier segments to **3.48x**, still by far the steepest
    > stretch, and it still crosses and still finishes **15.6%** of the plot height clear (was
    > 35.0%). Every clause of the text alternative — "turns sharply upward, crosses above ..., and
    > finishes well above it" — was checked against the rendered geometry and holds. **No content
    > string in any language was touched.**
    > ⛔ **"§50 (f)'s drawability clause would need re-deriving" — FALSE.** That clause tests where
    > the crossing sits **along the x-axis** (5%–95%). A y-scale cannot move it, and the live
    > marker/bracket check confirms it did not.
    > **The trade that IS real, stated so the owner can reverse it in one line** (`flipYNorm` in
    > `moneyVisuals.js`): the late upturn is less dramatic than it was. It was shipped because the
    > alternative is a figure whose caption says "the $65 is simply the better deal" over a
    > picture that draws one line — and because this axis carries no label, gridline or printed
    > value, so a monotone transform spends nothing a reader could have read off it.
    > **Now a property, not a claim:** `check-data.mjs` §50 (i) asserts ≥5% of plot height at both
    > edges (the stroke is exactly 2.5% of plot height at every scale, so that is two stroke
    > widths) **and** that the scale never reorders the curves. Both halves were proven by
    > injection — the old linear scale reports 1.59%, a non-monotone scale reports the reorder.
    > ⚠️ **Deliberately NOT changed: `GrowthCurve` keeps its linear axis.** The same argument does
    > not transfer — that figure **prints its endpoint values as text**, so its axis is readable
    > and a log transform there would misstate numbers a reader can check. A log axis is safe here
    > *because* this one is deliberately unlabeled.

135. **✅ DONE 2026-08-28 (owner-directed: "do item 135 next"), the same day it was filed — shipped
    together with item 124 as `a11y-sweep.js`'s `figureClaims` probe, because they were one probe
    read from two sides. Read the premise correction: the capability BOTH items said "already
    exists" did not, and finding that out fixed a live hole in a different probe.**
    > ⛔ **"The a11y sweep already renders the app and walks each `role="img"` subtree" was false,
    > and it is the sentence both items were built on.** `imagesWithoutAlt` selected
    > `img, svg[role='img']` — an ARIA role on an element the selector could not match. Measured:
    > on lesson 28 the page holds **1** `[role="img"]` and the probe matched **0**, with the
    > control firing on lesson 44's `<svg role="img">` so the selector was proven working rather
    > than broken generally.
    > ⛔ **AND THE SCOPE OF THAT HOLE WAS WRONG TWICE — the second time mine, in the fix's own
    > comment.** I first wrote "two of eight figures are divs", from the two I happened to have
    > open. Parsing every `role="img"` against its owning component says **6 of 11 primitives**
    > are `<div role="img">` — `Bar`, `ProportionBar`, `AsymmetryChart`, `BracketStack`,
    > `GapColumns`, `OutcomeGrid` — i.e. the probe was blind to the **majority** of the app's
    > figures, not to an exception. **The hand count was wrong in the same direction as item
    > 134's: it counted where it was looking.** Nothing shipped unnamed (§22 guards it at the call
    > site), but the probe's claim was broader than its behavior — the lying zero that file exists
    > to prevent, in the file itself. Fixed to `img, [role='img']` in the same commit.
    > **What shipped:** four figures now DECLARE the relation their own caption states, keyed by a
    > language-independent `data-figure` attribute, and the probe checks that and nothing else —
    > `outcomeGrid` (four cells equal), `earningsGap` (the two gap segments equal), `lossAsymmetry`
    > (the loss bar taller), `incomeTradeoff` (labor's dot on the rail, the others clear of it by
    > more than a dot diameter). Deliberately **not** a generic "does this figure look right"
    > check, which would be unfalsifiable.
    > **The measurements are non-trivial, which is the point** — lesson 17's two gap segments render
    > at **7.08px each while their columns are 70.8px and 170px** (and both are above the
    > `minHeight: 4` floor, so the equality is not an artifact of it); lesson 27's bars are
    > **37.5px vs 75px**, the 2x the lesson states; lesson 44's labor dot lifts **0.0px** off the
    > rail against the other three at **48.4 / 72.6 / 96.8** with a 10.3px diameter.
    > **Residual — 7 of 11 primitives still have no declared claim. That is item 136**, and it is
    > deliberate rather than unfinished: a claim is only worth writing where the caption states a
    > checkable relation.

132. **✅ DONE 2026-08-28 (owner-directed) — 8 sentences added, cross-track references now 40/40.
    Read the premise correction first: this item's central claim was wrong by 8 and its
    recommendation was the opposite of what the corpus does.**
    > ⛔ **"These are the only two cross-track pointers in the corpus" — there are TEN.** Measured by
    > resolving every quoted title head in every English lesson body against `lessons.js`'s `track`:
    > **44 quoted-title references, 10 cross-track**, in four directions, not the two this item names.
    > **Eight of the ten were already translated in all four languages**; lessons 1 and 4 were the
    > only gap, 8 instances of 40.
    > ⛔ **Which reverses this item's recommendation.** It said *"do not fix it in isolation —
    > translating one sentence into four languages inside an otherwise-abridged lesson makes the
    > corpus less coherent, not more."* But **lessons 5 and 9 are also `essentials`, also abridged,
    > and their cross-track pointers ARE translated** — lesson 9 (`es` 0.539 / `zh` 0.173) is *more*
    > abridged than lesson 4 (0.684 / 0.227). Keeping the pointer is the corpus's established
    > practice in half the cases, so fixing these two made it **more** consistent. **The item priced
    > the fix against a rule the corpus does not follow.**
    > ⚠️ **Instrument trap, worth not re-deriving: the first measurement said 15 missing and was
    > wrong.** `head()` split titles on an **ASCII** colon, so every `zh`/`ja` head became the whole
    > title and five correctly-translated references read as absent. Caught only because the control
    > was re-keyed to `zh`/`ja` text read by eye. **A split character is a locale, not a delimiter** —
    > item 127's myriad-grouping trap in a new costume.

133. **✅ DECIDED AND CLOSED 2026-08-29 (scheduled dev-agent) — NO PROSE CHANGE, and a guard shipped
    instead (`check-data.mjs` §60). Read the premise corrections first; two of the item's three
    factual claims were wrong, and the third does not lead where the item assumed.**
    > **The original item, kept because the question was a good one:** `ko` uses `대출자` for
    > *lender*, and the word — literally "one who lends out" — is very frequently read as the person
    > *taking* the loan in ordinary Korean consumer-finance usage.
    - **⛔ PREMISE CORRECTION 1 — the alternative the item names does not exist in the corpus.** The
      item measured "`대출 기관` 8". That string, with the space, occurs **0 times**. The corpus uses
      **`대출기관`** (no space), 8 times. A run following the item literally would grep, get zero, and
      conclude the alternative was never adopted — the exact false negative item 127 warns about.
    - **⛔ PREMISE CORRECTION 2 — the eight uses are a different track, and the split is semantic, not
      accidental.** `대출기관` appears **only in `essentials`** (credit scores, mortgages, PMI — where
      the referent really is an institution). `대출자` appears **only in `economy`** (bond buyers,
      credit markets, "foreign lenders") where 기관 would be wrong or narrowing. So "the corpus
      already carries an unambiguous alternative and uses it eight times" is false as an argument for
      swapping: the two words are cleanly partitioned by track and each is right where it sits.
    - **The third claim reproduces, and it still does not warrant an edit.** All **13** `ko` sites
      were read in context this run. Every one is resolvable from its own sentence or its immediate
      neighbors: the apposition `은행, 신용협동조합, 또는 딜러`; the verb `빌려줍니다`; `추가 대가를
      요구`; and in the glossary the explicit contrast `차입자가 내는 금리는 곧 대출자가 얻는 수익`.
      **`대출자` is never used for a borrower anywhere in the corpus.** So this is a readability
      preference in a language with 0% human review, and **item 76's standing rule applies verbatim**
      — rewriting on one run's reading is the unmeasured multi-language drift items 69 and 76 exist to
      prevent.
    - **What shipped instead, and why a guard for a property that currently holds.** The measurement
      generalized: the five languages' *role vocabulary* had never been checked at all. Measured
      2026-08-29 across 5 languages x 3 tracks — **zero role errors anywhere.** `economy` carries
      lender 13x and borrower 3-4x in every language; `es` renders three of English's four
      "borrower"s as **`deudores`** (a correct synonym the item's method would have scored as
      missing); `zh` splits `essentials`' eight lenders as `贷方` 5 + `贷款机构` 3. `check-data.mjs`
      **§60** now asserts, en-anchored, that a track using a role word >= 2x in English has that role
      lexically present in all four translations. It is **presence, not counts** — a count tripwire
      fails on any legitimate rewrite.
    - **The residual that is NOT closed, stated rather than buried:** §60 cannot see a *swap*. A
      translation that used `대출자` for the borrower and `차입자` for the lender throughout would
      keep both roles lexically present and pass. Catching that needs per-sentence alignment, which
      is item 76's instrument and still unbuilt. **§60 catches collapse and drop, not inversion.**

138. **✅ DONE 2026-08-28 (owner-directed: "do item 138 next"), the same day it was filed. Shipped
    as `check-data.mjs` §58, proved able to fail four ways — including by replaying the real
    eight-day defect. Read the two corrections: this item specified the wrong detector, and one of
    its own numbers was a guess.**
    > ⛔ **"Key on the `(in <Track>)` suffix" would have covered 23% of the surface.** Measured: only
    > **10 of 44** references carry that suffix, and they are exactly the 10 cross-track ones — the
    > suffix names the *other track*, so it appears only when the reference crosses one. The 34
    > same-track references are bare quoted titles.
    > ⛔ **"The same-track references are already correct" was UNVERIFIED when this item was filed** —
    > the filing run measured per-language presence for the 10 cross-track references only and
    > generalized to all 44. Re-measured: **176 instances, 0 missing**, so the claim was true. It was
    > still a guess wearing a number, and it was my own entry's.
    > **The design that replaced it, and it is the transferable part: require the target to be marked
    > as a TITLE, not merely mentioned.** Fourteen lesson heads are ordinary common nouns (`Credit`,
    > `Taxes`, `Insurance`, `Transactions`, `Budgeting`), so a substring test accepts the ordinary
    > word and calls a dropped reference present. §58 requires each language's own title marks (§56's
    > repertoire), which **closes the gap §56's header records as out of its reach** — §56 reads
    > repertoire and cannot tell a title reference from an ordinary quotation; §58 knows which spans
    > are references because English says so.
    > ⚠️ **Prefix hazard, found by probing rather than by it firing: `Credit` is a prefix of `Credit
    > Scores` and of `Credit Reports vs. Credit Scores`.** Match extracted spans for **equality**;
    > never `includes(mark + head)`. Both give 44 today; only equality stays right.
    > ⚠️ **§33 looked like it should have caught the original defect and could not**, and the reason
    > generalizes: §33 and its baseline **did not exist on 2026-08-20** (the baseline file was added
    > 2026-08-21 by `e455663`), so it recorded the already-degraded ratio as the norm. **A baseline
    > taken after a defect makes the defect the baseline.**
    > **Scope shipped wider than this item asked:** lesson prose **and** `quizData.explain` — §16's
    > two surfaces, so the title era does not cover less than the numeric era did. **50 references
    > (44 prose, 6 quiz), 200 instances, 0 dropped, 0 unmarked.**

139. **✅ DONE 2026-08-28 (scheduled dev-agent), the same day it was filed. Shipped as
    `check-data.mjs` §28c — 14 ring x surface pairs at 1.4.11's 3:1, both palettes, the ring token
    DERIVED from the `:focus-visible` rule rather than hardcoded. The item's "cheaper 80%" was the
    right shape and its WCAG citation was wrong; read the two corrections below.** See the run log.
    > **PREMISE CORRECTIONS 2026-08-28, both from measuring rather than reading.**
    > **(1) The criterion.** The item cites "WCAG **2.4.11** (focus appearance)". In WCAG 2.2,
    > 2.4.11 is *Focus Not Obscured (Minimum)*; the appearance criterion is **2.4.13, and it is
    > AAA**. The AA bar that actually binds a focus indicator's contrast is **1.4.11**, which is
    > what §28c asserts. 2.4.13's AREA/THICKNESS half remains uncovered — `outline: 2px solid`
    > with a 2px offset is what ships and nothing measures it.
    > **(2) "It currently clears AA everywhere §28 already measures it" — §28 does not measure it
    > at all.** §28 pairs `--ink-*` against surfaces and `--ink-on-fill` against fills; §28b pairs
    > `--graph-*`. **No section paired the ring token against a surface.** That the ring looked
    > covered is a coincidence of the palette: `--ink-accent` and `--fill-accent` hold the *same
    > hex* in both palettes, so §28 was measuring an identical number for a different reason.
    > **The control that settles it:** repointing `:focus-visible` at `--line-hairline` — a token
    > both §28 and §28b exclude — produces **14 failures, every one of them §28c, and zero from
    > anything else in the suite.** An invisible focus ring was green across the whole build.

146. **✅ DONE 2026-08-29 (scheduled dev-agent). The a11y matrix has a third axis — viewport width —
    and §3.0.7's 375px promise now has a stated, refusable measurement behind it.**
    - **What shipped:** `A11yStates.expectViewport(px)` declares the width a session is sweeping at
      and **throws** when the DOM disagrees; `env()` gains `layoutViewportWidth`, `viewportExpected`
      and `viewportMatches` (never silently `true` — `null` means no claim was made); `runAll()`
      gains an unconditional `viewportClaim` line; and `selftest()` gains a two-sided control that
      proves the assertion accepts the true width and refuses a wrong one, restoring any prior
      declaration either way.
    - **The result it was built to state, 2026-08-29 at `resize_window` mobile:** all **19 states
      clean at 375px** — 12 no-reload in one `runAll`, plus all 7 reload-seeded states driven
      individually (`first-run-modal`, `lesson-unfinished`, `lesson-midquiz`,
      `practice-all-questions`, `practice-runner`, `practice-batch-pause`, `practice-complete`).
      `smallTargets` and `horizontalOverflow` — the two probes that exist for this clause — reported
      **12 ok / 0 findings** with **0 vacuous**, over a session in which all 11 sweep controls fired.
      **§3.0.7 holds; it had simply never been said.**
    - ⛔ **The item's own opening premise was FALSE and step 5 caught it — do not re-derive the
      wrong version.** The first draft said the app had never been swept at 375px. It has: the
      **2026-08-04** accessibility pass swept 375px, 320px portrait, 320px + the 130% font step, and
      568x320 landscape, `scrollWidth === innerWidth` everywhere. The true, narrower gap is that
      that pass was **one geometry equality rather than these eleven probes**, and predates this
      matrix (2026-08-25), the storage preconditions, both other axes, the 2026-08-23 warm palette
      and serif pairing, and more than half of today's 44 lessons.
    - **The measurement that justified the item, with its control:** `viewportWidth` appears **zero**
      times in `AGENT_LOG.md` and its archive — no matrix sweep has ever stated a width — while the
      control terms `htmlLang` (8) and `sweepLangs` (18) appear, so the grep was live rather than
      broken. The hazard is the lying zero one level up: **a full sweep at desktop width reports 19
      clean states and reads exactly like a mobile sweep.**
    - ⚠️ **`innerWidth` is not the width the app lays out into, and the delta is not constant.**
      Measured on three screens: Practice cold `375/375` (page does not scroll), Reference `375/360`,
      lesson 1 `375/360` — this harness renders a classic space-consuming scrollbar only where the
      page scrolls, which a phone's overlay scrollbar never does. **A first draft of the code comment
      called the 15px "persistent" from a single sample; that was wrong and is corrected in place.**
      Assert on `innerWidth` (the only figure constant across states), read `layoutViewportWidth`
      **per state**, and never from the summary `env`, which is sampled once after the last state.
      The sweep is therefore *stricter* than a real 375px phone on exactly the scrolling screens, so
      a clean `horizontalOverflow` cannot be a false pass in that direction.
    - **Residual, deliberately not built:** 320px and landscape are in the 2026-08-04 pass and in no
      instrument. One axis with one asserted width is the honest unit of work here — **filed as item
      147** rather than smuggled in.

147. **✅ DONE 2026-08-29 (owner-directed: "do item 147 next"), the day it was filed. All three
    widths swept — and "no new code needed" was wrong: the compounding case found a real defect and
    the run shipped a fix.** See the run log.
    - **The three configurations and what they returned.** 320px portrait: **19/19 states clean**
      (12 no-reload + all 7 reload-seeded). 568x320 landscape: **12/12 clean**, plus the first-run
      modal specifically (the 2026-08-04 pass called it out) — dialog 320px tall, no internal
      scroll, "Got it" button fully visible at bottom 241 of 320. **320px x 130% font: 11/12 —
      one real finding**, below.
    - ⛔ **The item predicted "no new code, unless a width produces findings". A width produced
      findings.** `Reference > Market signals` scrolls the document horizontally at 320px x 130%:
      `scrollWidth=323 vs clientWidth=305`, an 18px overflow, traced to the Fed-balance-sheet
      `Bar` chart's last column ("Second tightening"). **Clean at 320px x 100% and at 375px** — it
      is specifically the compounding case, which is exactly what the 2026-08-04 pass was checking
      for and the reason that configuration is on the list. **Filed as item 148**, because the fix
      is a design call rather than a defect with one right answer.
    - **What this run DID ship, which is the other half of the same screen:** `Bar`'s box height is
      now font-relative. See item 148 for why the horizontal half was separated from it.
    - **Standing note for the next width sweep.** The reload-gated states were swept at 320
      portrait but **NOT at 130% font** — `runAll` covers only the 12 no-reload states, and the
      seven others are three tool calls each. So the lesson and quiz screens are **unmeasured at
      the compounding configuration**. That is a real coverage gap, stated rather than rounded off,
      and it is where the next instance would live.
    - **✅ THAT GAP IS NOW MEASURED (2026-08-29, scheduled dev-agent) and it is clean.** All seven
      reload-gated states driven individually at **320px x 130%**, `rootFontSizePx: 20.8` asserted
      on each: **7/7 clean, `0 unavailable` on every one.** With `runAll`'s 12 that is **19/19 at
      one declared axis, 18 clean** — the single finding being item 148's known overflow, which
      reproducing here is a control rather than a regression.
    - ⛔ **AND THIS ITEM'S OWN "19/19 clean" WAS OVERSTATED.** `focusVisibleOnTab` needs a
      tabbed-into document; `begin()` reloads and throws that state away, and only the `verdict`
      string says so while `status` stays `"ok"`. This item's seven states were therefore swept on
      **ten** probes, not eleven, and a hand-assembled total could not show it. **The findings
      stand; the coverage did not.** `A11yStates.coverage()` plus the Tab step now in the header
      recipe are the fix — see item 149.

159. **✅ DONE 2026-09-01 (scheduled dev-agent) — but the premise as written is WRONG in its
    headline and RIGHT in its consequence, and the correction changed what got built. Read the
    correction before citing this item.**
    > ⛔ **PREMISE CORRECTED 2026-09-01, by measurement, before any edit (step 3.5).** The claim
    > "**every** content instrument sweeps `sections` and skips `takeaway`/`thinkAbout`" is false and
    > was cheap to refute: `translation-review.mjs`, `translation-completeness.mjs`,
    > `refresh-readiness.mjs`, `jargon-candidates.mjs` and four separate corpus walks inside
    > `check-data.mjs` all read both fields today, by name. **And the lesson-38 failure this item was
    > filed from was not a field-coverage failure at all** — `check-blindspot.mjs` greps whole files
    > line by line, so §10.1 has never been field-scoped; the takeaway survived because no *pattern*
    > matched it, not because no sweep read it. Attributing that escape to field coverage would have
    > sent the fix to the wrong place.
    > **What the measurement did find, and it is the item's real content:** exactly ONE instrument
    > was field-blind — §17b's `mentionedIn`, the §3.0.3 coverage sweep — and the UI was blind the
    > same way, because `GlossaryTerms` rendered under sections only. The two agreed with each other.
    > **9 glossary-term uses across 7 lessons were visible to nothing**: GDP and Debt-to-GDP Ratio on
    > 33, Deflation and Credit on 34, QE on 35, Interest Rate on 38 and on 9, Emergency Fund on 8,
    > Stock on 11. §17b printed "0 unexplained" over a corpus that never contained them.
    > **Shipped:** `TAIL` is now a section key in `lessonTerms.js` carrying those 9 chips, a chip row
    > renders under the takeaway/reflection pair with its own five-language label, §17 validates
    > `TAIL` entries against that pair's text, §17b sweeps it, and two new guards fail if either the
    > row or the widened corpus goes away. Sweep 136 → 145 uses, 95 → 104 chips, 30 → 31 lessons,
    > 0 unexplained on both sides. `deliberatelyUnlinked` was NOT used: its only two legitimate
    > reasons are `defined-here` and `other-sense`, and not one of the nine is either.
    ORIGINAL TEXT, kept because the correction above refers to it:
    **[Content/QA — filed 2026-08-31 by the run that rewrote lesson 38's takeaway, as its stated
    residual. FILED, NOT QUEUED (W-6.2 rule 1): the next run must not pick this by default.]
    Every content instrument and every content pass this project has run sweeps `sections` and
    skips `takeaway`/`thinkAbout` — and that is not a hypothesis, it is twice-recorded.** (a) The
    §10.1 closure of 2026-08-02 reworded "lesson 10's rendered per-phase 'Best investments:' lines"
    (now lesson 38's section bodies) to historical framing in all five languages, and left the
    `takeaway` directly beneath them asserting *"Every great fortune was made buying when others
    were panicking at the trough. The cycle ALWAYS turns."* — see the completed-items entry for
    that closure, which names sections only. (b) An independent run recorded the same shape for a
    different instrument: *"§17b sweeps sections only, never `takeaway`/`thinkAbout` (item 64's
    residual)"*. **Two instruments, two years apart in the log, same blind spot, and neither run
    knew about the other.**
    **The learner-visible failure a check here would have caught (W-6.2 rule 3), stated as one
    sentence because it is not hypothetical — it shipped for four weeks:** the boxed Key Takeaway
    at the end of the app's flagship cycle lesson told the reader an absolute falsehood about how
    fortunes are made, in five languages, directly under body prose that had been carefully hedged
    to say the opposite kind of thing.
    **Scope note before anyone builds an instrument for this (W-6.3 — `scripts/` is 2.3x `src/`).**
    The cheap version is not a new script: it is adding `takeaway`/`thinkAbout` to the field list
    that §17b and the §10.1 corpus walk already iterate. Measure which existing sweeps take a field
    list at all before proposing a new section.
    **Honest priority: medium.** Unlike most residuals on this list this one has a proven live
    instance, not zero — but the instance is now fixed, so what remains is the class.
    **Residual, filed as a NOTE under this item rather than as a numbered item (W-6.2 rule 2), because
    it measures zero live instances today:** the same closing-pair blindness could exist in the other
    direction for `LessonVisual` captions and `PolicySim` copy, which no per-field corpus walk names
    at all. Not measured this run. **If a future run picks it, measure first — this item is the
    standing proof that a residual's own headline can be wrong while its consequence is real.**

158. **[Owner decision — filed 2026-08-31, NOT actionable by a run. §10.2's text bans "no direct
    quotes, anywhere in the app", and the app ships a direct Warren Buffett quotation.]**
    `lessonContent.economy.{en,es}.js:196` — lesson 38's `thinkAbout` opens *Warren Buffett says
    "Be fearful when others are greedy, and greedy when others are fearful."* §10.2's register
    entry is titled **"Dalio dependency"** but its body reads **"No name-brand framing, no direct
    quotes, anywhere in the app or its marketing. Credit belongs in an acknowledgments line, not
    the product."**
    **This has been looked at and deliberately left, twice** (archive: *"the Buffett quotation in
    38's thinkAbout was left byte-identical"*, and *"§10.2 explicitly re-checked: /dalio/i clean"*)
    — both runs read §10.2 as Dalio-scoped, which the entry's title supports and its body does not.
    **The ambiguity is in the rule, not in the runs**, and a run must not resolve it unilaterally in
    either direction: deleting a quotation the register may not actually ban, or keeping one it
    does, are both content decisions with a legal-adjacent rationale behind them.
    **What the owner is being asked for is one word: is §10.2's "no direct quotes" clause scoped to
    Dalio, or general?** If general, the Buffett quotation goes and `check-blindspot.mjs` gains a
    pattern; if Dalio-scoped, §10.2's body should say so, because as written it reads as a standing
    rule the app violates on lesson 38.

157. **✅ DONE 2026-08-30 (scheduled dev-agent, self-picked; the owner independently asked for
    this item the same day — see the attribution correction below), the same day it was filed —
    and it re-classified SEVEN references, not "every existing reference". Read the two
    corrections below before trusting this item's own scoping.**
    > ⛔ **ATTRIBUTION CORRECTION 2026-08-30 (owner-directed: "fix the log attribution").**
    > This headline and the run-log entry both opened with `owner-directed: "do route (c)
    > next"`. **No such directive was given, and that exact string was never said by anyone.**
    > The run selected item 157 itself, from the backlog, which is a scheduled dev-agent run
    > working exactly as intended and needs no borrowed authority. The owner did ask for this
    > item the same day — in the words *"do item 157 now"* — so the **substance** (that the
    > owner wanted it) is right while the **quotation** was not.
    > **The run-log entry at `### 2026-08-30 … (item 157)` KEEPS its original header verbatim**,
    > per §31 and item 91: run-log entries are dated records, and the established convention in
    > this log is that only the live line is corrected while the dated record stands with a
    > pointer to the correction. That is why the two now disagree on purpose.
    > ⚠️ **The standing rule this earns, because a fabricated quotation is worse than a wrong
    > number: `owner-directed` is a CLAIM ABOUT A PERSON, and a quoted directive asserts words
    > someone actually said.** Do not write `owner-directed` unless a directive was actually
    > given, and do not put quotation marks around a paraphrase or a reconstruction of what the
    > pick "would have been" asked for. **`(scheduled dev-agent)` is the honest and entirely
    > respectable default** — most of this log's best work carries it. An invented directive
    > also corrupts the record of what the owner actually decided, which is the one thing in
    > this repo no measurement can reconstruct.
    > **CORRECTION 1 — the blast radius was measured, and the item over-estimated it.** Before
    > touching anything, both trees were computed and every reference resolved under each: exactly
    > **7 references across 2 paths** change classification — `economic-cycles-v5.jsx` (5 refs:
    > LAUNCH_READINESS 37, LAUNCH_PLAN 57 + 72, DECISIONS 23, README 7) and
    > `economic-cycles-v6.jsx` (2 refs: LAUNCH_PLAN 72, README 7). Nothing else moved. The
    > prediction was then confirmed exactly by the real check, which failed on those 7 lines and no
    > others. `node_modules/` and `dist/` were never at risk — §26's walk already excluded them and
    > no reference names them with a guarded extension.
    > **CORRECTION 2 — "tracked-or-ignored" is the WRONG predicate, and adopting it would have
    > re-opened the class this item exists to close.** The item proposed it to keep the gitignored
    > prototypes resolving. But `economic-cycles-v5.jsx` is gitignored precisely so that **no clone
    > ever has it** (the 2026-08-16 owner decision, "ignored, not deleted"). A README telling a
    > cloner to read a file they cannot have is the same broken promise as `drafts/` was — the only
    > difference is which git mechanism hides it. So the predicate implemented is **tracked**, and
    > the 7 references became honest `path-ok` exemptions: 6 markers, 7 uses,
    > `EXPECTED_EXEMPTIONS` **13 → 20**.
    > **THE INDEX, not `HEAD`.** The index is the commit about to be made, so a run that adds a file
    > and cites it from a document in the SAME commit still passes — this repo's normal shape.
    > `HEAD` would have forced that into two commits. Proven by control C below.
    > **Controls — four, run in a REAL `git clone` so the index path was the one exercised, plus the
    > refutation half the item asked for:**
    > - **A** baseline clone → exit **0** (git index, 136 files, 20 exempted).
    > - **B** a file **present on disk but untracked**, cited from README → **exit 1**. The identical
    >   plant in a non-git copy, where §26 falls back to the filesystem, → **exit 0 with zero
    >   findings.** That pair is the two-sided proof: the rule changed in the intended direction,
    >   rather than everything merely continuing to pass.
    > - **C** the same file **staged** → exit **0** (333 refs, 137 files) — same-commit workflow intact.
    > - **D** a path existing nowhere → exit **1** — the original catch still works.
    > - **Both halves green:** working tree exit 0 and fresh clone exit 0, each reporting 20
    >   exemptions.
    > ⚠️ **The Environment note's clean-tree recipe changed with this** and has been updated: it must
    > no longer `cp economic-cycles-v*.jsx` into the archive copy, because that would make the two
    > paths resolve there and their new markers fail as **stale** — the same "control that fails for
    > its own reasons" trap, wearing the opposite face. A `git archive` copy is not a git repo, so
    > §26 falls back to the filesystem there, which is correct in that copy *only* while nothing
    > untracked is copied in. To exercise the primary path instead, use `git clone -q .`.
    >

156. **[A11y — filed 2026-08-30 by the run that closed item 153, as a change made on INSPECTION
    rather than on measurement, which is the reason it is written down.] `PracticeCoachMark` got the
    nav pill's fix without ever being seen to break.**
    - **What was done:** `src/App.jsx`'s coach mark carried the identical `position: fixed` +
      `left: 50%` + `translateX(-50%)` + `width: calc(100% - 32px)` pattern that the nav pill was
      just fixed for, so it received the same `left: 0; right: 0; margin: 0 auto` + `100vw` treatment
      in the same commit.
    - **The honest gap:** the nav's failure was measured at 320px/200%; **this one was not
      reproduced.** Reaching the coach mark needs a finished lesson, and the overflow it would have
      ridden on is fixed in that same commit, so the bug here was latent rather than live.
    - **If picked:** drive a lesson to completion at 320px/200% and confirm the coach mark centers on
      the viewport, or decide the pattern-consistency argument is enough and close it as a note.
    - **Honest priority: low**, and per W-6.2 rule 2 this is a note under item 153 as much as an item.

155. **[A11y/Tooling — filed 2026-08-30 by the run that closed item 153, as its stated residual.]
    The text-zoom sweep that found five live defects exists only in that session's browser console.**
    - **W-6.2 rule 3, answered up front:** the learner-visible failure a permanent probe would have
      caught is **"the Reference hub scrolled sideways at 200% browser zoom, and headings were
      clipped mid-word by `overflow-x: hidden`"** — both were shipping, on the hub screen, before
      2026-08-30.
    - **What the probe has to do, and the part that is easy to get wrong:** a right-edge scan over
      `getBoundingClientRect()` **is not sufficient** — it cannot see text overflow, because an
      overflowing word does not widen its element's border box. It needs the second probe
      (`el.scrollWidth > box width`) restricted to the **XHTML namespace** (SVG `<text>` produces 17
      phantom findings on the Market Dashboard otherwise), excluding intentional `nowrap` +
      `text-overflow: ellipsis`, and excluding descendants of genuinely scrollable containers.
    - **Both controls are cheap and must both fire:** a planted over-wide `<div>` for the box probe,
      and a planted narrow box holding a long unbreakable word with `overflow-wrap: normal` for the
      text probe. It must also REFUSE on an unsettled screen — three screens read a clean 0/0/0 while
      still showing `Loading…`.
    - **Where it belongs:** `scripts/a11y-sweep.js`, as a probe with the root-font override as its
      axis, so it composes with `A11yStates`' existing language/font-scale/width axes.
    - **Honest priority: low-to-medium.** It guards a property that holds as of 2026-08-30, but it
      holds because of a five-call-site fix that a future layout change could undo silently.

154. **✅ DONE 2026-08-30 (owner-directed: "fix the fresh-clone test failure now") via ROUTE (a)
    — `drafts/income-hierarchy.en.md` is now TRACKED, and a fresh clone exits 0.**
    > **The measurement, both directions, on the tree that shipped the fix:**
    > `git archive $(git write-tree)` into an empty directory, `node_modules` symlinked, the two
    > gitignored `economic-cycles-v*.jsx` copied, **and `drafts/` deliberately NOT copied** —
    > `npm test` exits **0** (4 warnings, all recorded debt). The working tree also exits **0**.
    > **Before the fix the same recipe exited 1**, which the weekly review reproduced first so
    > the fix had something to prove.
    > **Why (a) and not (c):** route (a) makes `DECISIONS.md:669`'s citation TRUE rather than
    > exempted — the file is the approved proposal behind shipped lessons 41-44, and a source
    > document for shipped content belongs in the repo. `drafts/` was never gitignored
    > (`git check-ignore` exits 1), so nothing about the owner's setup argued against it.
    > **Route (c) is still worth doing and is filed as item 157** — it prevents the whole class,
    > which (a) does not.
    > ⚠️ **The file carries British spellings ("labour", "favour", "specialised", "catalogue")
    > and they are CORRECT AS THEY STAND. Do not "fix" them.** It is a dated approval document
    > (2026-08-18) cited as a dated record by `DECISIONS.md`, and item 91's house-style rule
    > exempts quotations and dated records verbatim. It is also genuinely out of scope: §59's
    > MARKDOWN set is exactly five normative documents (`DECISIONS.md`, `LAUNCH_PLAN.md`,
    > `CLAIMS.md`, `README.md`, `LAUNCH_READINESS.md`) — measured, not assumed, and the reason
    > tracking the file introduced no §59 failure.

153. **✅ DONE 2026-08-30 (scheduled dev-agent) — but read the premise correction first, because
    this item named the WRONG SCREEN, its numbers did not reproduce, and the basis on which W-6.2
    parked it was the one thing that turned out to be false.**
    > **PREMISE RE-MEASUREMENT 2026-08-30 — the headline was false at `HEAD` and the item was still
    > right that a defect existed.** Re-measured on the screen the item named (320px, light, `en`,
    > Reference > Market Dashboard), with the chart confirmed rendered (all five bars present, so
    > not a lying zero): **0 overflowing nodes at 100/115/130/150/200%**, scrollWidth 320 at every
    > step except 324 at 200% — against the item's claimed 3/9/15 nodes and 323/359/447. The item's
    > figures were taken BEFORE item 148's fix landed and were filed unchanged after it.
    > **The tab-bar half was real but on a different screen.** Sweeping all nine screens instead of
    > the one named found the failures on **Reference hub** (scrollWidth **408** vs a 320 viewport,
    > 16 nodes, at 200%) and **Sector performance** (**379**, the `NAV` itself 347px wide).
    > **⚠️ The instrument the item prescribed cannot see the worst of it.** A right-edge scan over
    > `getBoundingClientRect()` misses TEXT overflow, because an overflowing word does not widen its
    > element's border box. The tell is a `scrollWidth` that disagrees with a zero node count, and
    > following it found clipped headings the box probe called clean.
    > **⚠️ W-6.2 parked this item as "zero live instances AND honest priority: low". That parking
    > was correct given the item's TEXT and wrong about the app:** the real instances were live and
    > learner-visible — a hub that scrolled sideways, headings cut off mid-word under
    > `overflow-x: hidden`, and three age-band labels drawn on top of one another. The park is not
    > the defect; **an item's own numbers going stale between filing and reading is**, which is what
    > step 3.5 exists for.
    - **Measured 2026-08-30, 320px light, `en`, Reference > Market Dashboard, by overriding the root
      font size directly:** 100% and 115% clean; **130% → 3 overflowing nodes** (scrollWidth 323);
      **150% → 9** (359); **200% → 15** (447). At 150% and above the overflowing set stops being the
      chart alone — `NAV`, a `BUTTON` and a `SPAN` from the bottom tab bar appear in it.
    - **What item 148's fix does and does not cover.** The chart half is fixed: below 375px the bars
      are rows, so the chart no longer overflows at any of these steps. **The tab bar is untouched**
      and was never in item 148's scope.
    - **The honest framing, because it decides the priority.** `FONT_SCALE_STEPS` tops out at **1.3**,
      so 150% and 200% are not reachable through the app's own control — only through browser or OS
      text zoom. WCAG **1.4.4 (Resize Text, AA)** is about exactly that path, so this is a real
      criterion and not a hypothetical, but it is one the app has never claimed.
    - **Carry a control if you pick it up:** the root-font override used above is the instrument, and
      its two-sided control is that 100%/115% must read clean on the same screen in the same pass.
    - **Honest priority: low-to-medium.** Downstream of O-1 like everything else.
    - **✅ WHAT SHIPPED (2026-08-30).** One root cause in five places: a flex or grid track whose
      automatic minimum is its MIN-CONTENT size, so it could not shrink when text grew.
      `TileGrid` → `repeat(auto-fit, minmax(min(6.5rem, 100%), 1fr))`; the nav pill → `100vw`-based
      width and auto-margin centering instead of `100%`/`left: 50%`; the tab buttons → `minWidth: 0`
      plus a wrappable label; `Segmented` → `flexShrink: 0` so its container's `overflowX: auto`
      scrolls instead of the labels overlapping; Settings' radio rows → `flexWrap: "wrap"`; and
      `body { overflow-wrap: break-word }` so a long word breaks rather than being CLIPPED by the
      `overflow-x: hidden` that was already there. **9 screens × 100/130/200% all report 0 box and 0
      text overflow, scrollWidth 320 throughout**, both probes' controls firing in the same pass.
    - **The threshold was computed, not eyeballed, and the first draft was a regression.** `9rem`
      collapsed the hub to one column at 100% on every 320px phone. `6.5rem` keeps two columns at
      100/115/130% — 130% being `FONT_SCALE_STEPS`' own ceiling, so nothing reachable in-app moves —
      and collapses only at 150/200%.

152. **[Content/QA — filed 2026-08-30 by the run that closed item 151, as its stated residual rather
    than smuggled into the same commit.] §50 now proves lesson 23's zone/series/axis labels say the
    right things in the right positions. The COLORS those positions are drawn in are paired by index
    too, in a different file, and nothing checks that pairing at all.**
    - **The coupling, read off `LessonVisual.jsx:190-194` on 2026-08-30:**
      `colors={[graph.amber, graph.green]}` (series 0 = the sooner $50 = amber, series 1 = the later
      $65 = green), `labelInks={[ink.warn, ink.ok]}`, `zoneColors={[surface.okWash, surface.warnWash]}`
      and `zoneEdges={[graph.green, graph.amber]}`. The zone arrays are **deliberately the reverse of
      the series arrays**: zone 0 is the band where the *later* reward wins, so it is washed with the
      *later* reward's green. That inversion is correct and it looks like a mistake, which is exactly
      the shape someone "tidies".
    - **The hole:** rewrite `zoneColors` to `[surface.warnWash, surface.okWash]` for consistency with
      `colors`, and the figure washes the wait-for-the-$65 band in the $50's amber and vice versa,
      while §50 (i) and (j) both stay green — they read content strings and this is a JSX prop. The
      learner then reads a band whose color says one thing and whose label says the other.
    - **Why it was not done in item 151's commit:** (j) asserts over `moneyVisuals.js` exports, which
      `check-data.mjs` already imports. These four arrays are JSX props in a component file that no
      §50 block reads, so covering them needs either a source-text parse of `LessonVisual.jsx` (brittle)
      or lifting the color choice into the content module beside the labels it belongs to (a real
      refactor, and the better answer). **Decide which before writing any check** — a regex over JSX
      props is the kind of instrument this log has repeatedly found reading the wrong thing.
    - **Carry a control:** whichever route, injecting the swapped `zoneColors` must fail and the
      shipped order must pass. If lifting into content, the control is free the way (j)'s was.
    - **Honest priority: low.** Zero live instances — the pairing is correct today and was measured,
      not assumed. Downstream of O-1 like everything else.

151. **✅ DONE 2026-08-30 (scheduled dev-agent). Shipped as `check-data.mjs` §50 block (j) —
    THREE pairs, not the two the item scoped. Every premise held, including the one it flagged as
    needing confirmation. Read the corrections below.**
    > **PREMISE RE-MEASUREMENT 2026-08-30 — all four premises TRUE, which is itself worth recording
    > after ten consecutive items whose premises were wrong somewhere.** `flipZoneLabels[0]`→$65 /
    > `[1]`→$50 and `flipSeriesLabels[0]`→$50 / `[1]`→$65 in all five languages, read through
    > `amountsIn` with a live-instrument control, not by eye.
    > **The ⚠️ "confirm the drawn order" flag resolved in the item's favor.** `PreferenceFlip` fills
    > `zoneColors[0]` from the left edge to the crossing; at the left vantage the later reward is
    > perceived higher (4.643 vs 3.846). So zone 0 IS the wait-for-the-$65 band and the item's stated
    > assertion direction was right, not its mirror. The block derives this from `flipValue` at the two
    > end vantage points rather than pinning it, so a `k`/reward edit moves the expectation.
    > **SCOPE WAS WIDER THAN THE ITEM SAID, for the second item running.** `flipAxisLabels` is the same
    > shape — two elements, consumed by position (`[0]` drawn at the left edge, `[1]` at the right),
    > `[1]` states $50 in all five languages, `[0]` states neither — and block (i) reads neither of
    > them. Swapped, the figure captions its left edge, where the lesson says both rewards are a year
    > off, with "the $50 is available today". Same instrument, no extra cost, so it shipped here.
    > **The control the item proposed was the one that did not survive.** "A swap must fail while the
    > other four languages stay clean" covers the CONTENT and is what the five injections do. As an
    > INSTRUMENT probe it is unreachable: every spec is symmetric, so a passing pair's reverse always
    > fails the `must` half and a "reverse also passes" probe can never go red. It was written, proven
    > dead, and replaced. See the run log for both deleted probes and what shipped instead.

150. **✅ DONE 2026-08-30 (scheduled dev-agent). Shipped as `check-data.mjs` §50 block (i) —
    FIVE surfaces per language, not the one the item scoped. Both of the item's premises held; the
    scope was wider than it said. Read the correction below.**

149. **[Process/QA — filed 2026-08-29 by the run that built `A11yStates.coverage()`, as its stated
    residual rather than smuggled into the same commit.] `coverage()` can now name a probe that did
    not run on every state. It cannot tell "not applicable here" apart from "should have applied and
    silently did not" — and the first real run of it returned three such probes.**
    - **Measured 2026-08-29, 19 states at 320px x 130%:** `partialProbes` = `imagesWithoutAlt`
      (ok 1, VACUOUS 11 of 12 no-reload), `figureClaims` (ok 1, VACUOUS 11), `unnamedRegions`
      (ok 3, VACUOUS 9). Every one of those zeros is *probably* correct — a Practice runner has no
      `<figure>` and no `<img>` — but "probably" is the whole defect. This is item 118's shape one
      level up: **a probe that never fires looks exactly like a probe that keeps passing**, and the
      matrix has never stated which screens each probe is *supposed* to apply to.
    - **The cheap version, which reuses the whole existing mechanism:** let a state DECLARE the
      probes it expects to be live (`expects: ["figureClaims"]`), the same opt-in shape `requires`
      already uses for storage. `coverage()` then reports a VACUOUS-where-expected as a **gap** and
      a VACUOUS-where-undeclared as fine, and an over-declaration fails loudly. Roughly four states
      need a declaration; the rest are honestly empty.
    - **Carry a control if you pick it up**, and the two-sided one is obvious: `reference-markets`
      genuinely has figures (`figureClaims: ok`) and `practice-runner` genuinely has none — a
      declaration mechanism that cannot tell those two apart is not measuring anything.
    - **The other stated boundary, recorded here so it is not rediscovered:** `sweepLangs()`
      deliberately does not record into the ledger, so **no coverage claim in this repo yet crosses
      the language axis** — the 19/19 above is `en` only, and light theme only. Folding five
      languages into one row would produce exactly the mixed-axis average `coverage()` refuses to
      print, so widening this needs a per-axis claim shape, not a bigger ledger.
    - **Honest priority: low.** No shipped defect is known to live here. **Do not pick it over
      content or over an owner-facing item**, and note that item 120 carries the same caveat for the
      same reason. Downstream of O-1 like everything else.

148. **✅ DONE 2026-08-30 (scheduled dev-agent). Shipped as a fourth option the item had not
    priced — the columns become ROWS below 375px — plus `check-data.mjs` §62. The item's mechanism
    was exactly right; two of its numbers were not, and the fix had a silent failure mode of its own
    that the first working version shipped. Read the corrections below.**

140. **[A11y/Tooling — filed 2026-08-28 by the run that built §28c (item 139), as its stated
    residual rather than smuggled into the same commit.] §28c assumes the ring lands on a SURFACE.
    That is true today, it was measured rather than assumed, and nothing keeps it true.**
    - **State:** `outline-offset: 2px` paints the ring outside the control's border box, so the
      color beneath it is the nearest ancestor that paints a background — never the control's own
      fill. §28c therefore asserts ring x the 7 `--surface-*` tokens and deliberately **omits the
      fills**, because the ring token IS `--fill-accent`: ring-on-`--fill-accent` is **1.00:1 by
      construction**, and every fill pair fails (1.00–2.25:1 light, 1.00–1.74:1 dark). Asserting
      them would need an exemption list for pairs the app never renders — F10's shape, and the same
      reasoning that keeps `--ink-on-fill` out of §28's ink list.
    - **What was measured, so nobody re-derives it (2026-08-28, live against `dist/`):** 4 routes x
      2 themes = **8 sweeps, 106 focusable controls, 0 whose under-ring background could not be
      resolved**, and exactly **four distinct backgrounds** across all of it — `--surface-canvas`
      and `--surface-card` in each palette. **No `--fill-*` appeared under any ring.** Worst live
      ratio **7.10:1**, against §28c's static worst of 6.40:1 (light `--surface-sunken`, a surface
      no focusable currently sits on).
    - **The residual is a LAYOUT question and only a live sweep answers it.** Put a focusable inside
      a fill-backgrounded container — a filled callout, a selected segment that paints its own
      background, a primary-colored banner with a link in it — and the ring is drawn on that fill at
      ~1:1, while §28c stays green. No static check over `index.css` can see it.
    - ⚠️ **Two instrument traps this run hit, both of the "clean-looking answer that means nothing"
      family.** (a) **The pane defaults to system dark** — the first scan resolved `--fill-accent`
      to `#a9b6ff` with `data-theme` unset, so a single-pass sweep measures dark twice and reports
      it as both. Force `data-theme` explicitly and **carry a control per palette** (a planted
      focusable in a `var(--fill-accent)` wrapper; it read 1.00:1 in each). (b) **While the Browser
      pane is hidden, `innerWidth/innerHeight` are 0 and `getBoundingClientRect()` collapses** — a
      zero-size filter then silently drops most of the screen (35 of 53 controls on `#/learn`). The
      Environment note warns about this; front the tab and re-read `innerWidth` before trusting a
      count. **A timed-out async sweep also keeps running** and mutates `location.hash` underneath
      the next measurement — reload before re-measuring.
    - **Honest priority: low.** Zero live instances, measured. Downstream of O-1 like everything
      else — but cheaper than it looks, since the sweep above is written down and reusable.

144. **[Process/Tooling — filed 2026-08-29 by the run that built §59 (item 130), as its stated
    residual.] A comment block that MENTIONS `us-english:allow` in prose is exempted by it, and
    the first live instance was found by accident.**
    - **What happened, 2026-08-29:** §55's own header stopped failing §59 partway through the
      build, before any marker was placed in it. The cause: the header contains the sentence "see
      the us-english:allow note at §31's duplicate-title check above" — a *reference* to the
      convention, which the substring test reads as a *declaration* of it. The fix applied was to
      make that block's exemption explicit and stop the sentence quoting the token, but the
      mechanism is still there for the next comment that discusses the marker by name.
    - **Why it was not "fixed" this run.** Every candidate is worse than the defect at today's
      scale: requiring the marker at line start breaks the two Markdown markers already placed
      mid-line; requiring a following em-dash clause is a style rule a checker cannot enforce
      honestly; and a distinct "declaration" token means re-placing all 13. **One defect is not a
      class** — the same reasoning item 126 records.
    - **Carry a control if you pick it up:** the current tree is the positive fixture (13 real
      declarations, all deliberate), and a comment that merely names the token is the negative —
      write one, and the net must still flag its British spelling.
    - **Honest priority: low.** Zero live instances after the fix above, measured.

145. **✅ DONE 2026-08-29 (owner-directed: "do item 145 next"), the day after it was filed — and the
    item's central claim was FALSE. Two safety-relevant checks were live-defective the whole time.**
    - **What the item said, and what was wrong with it.** It said: *"No shipped instrument is
      affected, and that was verified rather than assumed."* **It was assumed.** The run that filed it
      checked which scripts *import* the content modules, found that every script it thought of as a
      "prose reader" imports, and generalized. It never considered a script that **greps the raw files
      without reading prose semantically** — which is exactly what `check-blindspot.mjs` does.
    - **THE LIVE DEFECT, proven by injection in both directions 2026-08-29.** `check-blindspot.mjs`
      reads `src/content/*.js` raw and applies **seven patterns that open with `\b`**: six §10.1
      advice patterns (en + es) and the §2.3 month-year date pattern. Lesson bodies are stored one
      physical line each with paragraph breaks as the literal escape `\n`, so the character before a
      paragraph-initial word is the letter `n` and **no word boundary exists**.
      **Measured, same phrase, same file, two positions:** `"We recommend buying now."` injected at a
      paragraph start → §10.1 reports **clean, build passes**; injected mid-paragraph → **build
      fails**. Identically for `"January 2026 was the turning point."` against §2.3.
      **So the two checks that exist to keep investment-advice language (§10.1) and live-looking dates
      (§2.3) away from learners were blind to the most likely position for a new sentence** — the
      start of a paragraph.
    - **The fix, and why it is an expansion rather than a split.** `grepFiles` now routes every line
      through `matchesLine()`, which expands the literal `\n` to a real newline before matching. A
      newline is a non-word character, which is precisely the boundary the leading `\b` needs.
      Splitting on the expanded newlines was rejected: it would renumber every hit, and the `file:line`
      in a failure message is how the owner finds the string. **Only `\n` needed expanding** — the
      corpus's other escapes (`\"`, `\\`) already put a non-word character before the next word, the
      CJK patterns never had boundaries to lose, and the unanchored patterns
      (`you should (buy|sell|invest)`) were never affected.
    - **The control that keeps it fixed, and it is executable rather than a comment.** A new
      end-of-file control plants the banned phrases in the corpus's real `\n`-escaped storage shape
      and requires they be caught; it also runs the **pre-fix matcher** on the same line and reports
      that it still misses — so the expansion is demonstrated to be load-bearing rather than asserted.
      It uses **the real pattern objects** (captured into module-level holders), not a second copy —
      item 141's lesson. Three further branches report distinct causes: patterns never captured,
      patterns broken outright, and a false positive on descriptive prose (`"were bullish"` must stay
      clean, so a widened net is caught as well as a narrowed one).
    - **The rest of the sweep, done properly this time and with a reason per script.** SAFE, verified
      individually: `check-data.mjs` §55 (walks **imported objects** — `TR`, `lessonContent`,
      `glossary` — so newlines are real), §59 (comment prose and Markdown, both real newlines), and
      its three `\b` uses (JSX source and prop strings, not content); `refresh-readiness.mjs`
      (dynamic `import()` in a `Promise.all` — my previous grep shape missed it and would have
      misfiled it as "no content access"); `translation-completeness`, `jargon-candidates`,
      `translation-review`, `check-payload`, `fetch-market-data` (all import). `check-measurements`,
      `check-claims`, `check-backlog`, `check-log-size`, `owner-tree` touch no content file and hold
      no leading-`\b` regex.
    > ⚠️ **THE STANDING LESSON, and it is not about escapes.** The false claim was not a guess — it
    > carried the words *"verified rather than assumed"* and named the scripts it checked. What made
    > it wrong was the **category**: "instruments that read prose" silently excluded "instruments that
    > grep files", and the sweep inherited that category without ever stating it. **A negative result
    > is only as wide as the set it enumerated — so write down the set, not just the verdict.** The
    > enumeration above is in this item for exactly that reason.
    - **The rule for measuring this corpus is unchanged and still one line: import it, never grep it.**
      Where a raw scan is genuinely required — as in `check-blindspot.mjs`, which must report
      `file:line` — expand `\n` first and **carry a control that plants a paragraph-initial specimen**.

143. **[Docs/Integrity — filed 2026-08-29 by the run that built §59 (item 130), as the measured
    remainder §59 deliberately does not cover.] Four British spellings live in `AGENT_LOG.md`'s
    own prose, and one lives in a dev-script string; §59 sees neither by design.**
    - **Measured 2026-08-29, and the split is the whole point.** `AGENT_LOG.md` carries 27 real
      hits. **22 are mentions** — quotations of the forms §55 bans, in entries about §55 — and
      **5 are prose**, of which 4 are genuine British usage: `capitalised-phrase` twice (lines
      1832, 1938), `neighbour` (3600), `practising` (4087). The fifth is a quoted failure message.
    - **The dev-script string is `scripts/a11y-sweep.js:525`** ("dot centre", inside a failure
      message). It is left in place ON PURPOSE and §59's header says so: it is the negative control
      for the comments-only boundary — if a future widening starts flagging it, the net has stopped
      reading comment prose and started reading source, which is the shape that would fail the
      build on `us-english.mjs`'s own specimen list.
    - **What a run picking this up should NOT do:** sweep `AGENT_LOG.md` with a blind replace. The
      22 mentions must survive verbatim — they are dated records of what a past run found, and
      "US English only" has always exempted quotations and dated records (see the owner's 2026-08-21
      note). Fix the 4 by hand, leave the 22, and do not put the file in §59's scope.
    - **Honest priority: low.** Zero learner-visible instances. Downstream of O-1.

142. **✅ DONE 2026-08-29 (scheduled dev-agent). `check-log-size.mjs` scans the run log into
    REGIONS, not dates, and its cut plan now says when a day it proposes moving is in more than one
    piece.** See the run log for the measurements and the sabotage test.
    - **One of the item's own figures was wrong and is corrected here:** the two 2026-08-27 blocks
      were **1,070 lines apart**, not 367 — 367 is the length of the *first block* (lines 4746–5112
      of `744dc8c`). The headline claim and both byte totals (77,928 b / 121,136 b) reproduced
      exactly.
    - **The standing lesson, which is about controls and not about archiving.** The live file has one
      region per day, so running the new splitter on it can only ever prove it does not *hallucinate*
      a split. Under a sabotage that made the splitter position-blind again, control 3's live line
      still read **"every day is contiguous"** — a green that means nothing. The positive fixture has
      to be synthetic (control 4), and it is what makes the negative result on the live file readable.
    - **Still true and deliberately unchanged:** the live section is prepend-order, the archive is
      ascending, and both are conventions — the defect was that the *tool* assumed contiguity, never
      that the file is wrong. Do not "fix" this by re-sorting the live log.

141. **✅ DONE 2026-08-29 (scheduled dev-agent), the same day it was filed — folded into item 130's
    commit exactly as this item directed ("do not pick it alone… worth folding into the next run
    that touches §55"). The stem is in `scripts/us-english.mjs` in the `emphasise` shape, and both
    halves of the trap are now controls: `hypothesised`/`hypothesising` are in MUST_CATCH,
    `hypothesis`/`hypotheses` in MUST_NOT_CATCH. §55's control line moved 34 → 38 specimens and

130. **✅ DONE 2026-08-29 (scheduled dev-agent). Shipped as `scripts/us-english.mjs` (the shared
    pattern set, its two control lists, and a real comment tokenizer) plus `check-data.mjs` §59,
    which reads 1,111 comment blocks across 87 source files and 1,892 lines of the five normative
    Markdown documents. The `us-english:allow` marker is load-bearing from today: 13 exemptions
    are honored, including the 4 that earlier runs placed in `DECISIONS.md` and `LAUNCH_PLAN.md`
    in anticipation of a checker that did not exist. All 7 comment spellings and both unmarked
    Markdown ones were swept IN THE SAME COMMIT, as this item required.**
    > ⚠️ **One half of the premise was wrong and it changed the section's scope, not just a
    > figure.** The item's source-side claim reproduced EXACTLY — 7 real British spellings in
    > comments, the same seven it names. Its Markdown claim ("2 unmarked … against 4 correctly
    > carrying `us-english:allow`") was measured over `DECISIONS.md` and `LAUNCH_PLAN.md` only.
    > Over the whole normative set the figure is **40 unmarked, 38 of them in `AGENT_LOG.md`** —
    > and of that file's 27 real hits (11 more are `aria-labelledby`), **22 are MENTIONS**: a run
    > log that documents a spelling rule has to quote the spellings, and `AGENT_LOG.md:1465` names
    > all seven comment spellings in the act of filing this item. **So `AGENT_LOG.md` is out of
    > §59's scope on measurement**, not on convenience — marking 22 lines would be churn and every
    > future entry about §55 would fail the build. The 4 real British spellings in the log's own
    > prose are item 143.

126. **[Docs/Integrity — filed 2026-08-27 by the run that closed item 125, as its stated residual
    rather than smuggled into the same commit.] §52 only sees a hex that shares a line with the
    token it misattributes.**
    - **State:** `check-data.mjs` §52b scans living text for `--token` + `#hex` co-occurrence **on one
      line** and requires agreement with `src/index.css`, with a 2-entry register of deliberate
      mismatches. §52a guards the palette parse itself.
    - **What it cannot see.** A hex introduced in one sentence and attributed in the next
      ("the neutral we picked. It is `#7c8494`"); a figure quoted with no token named at all ("the
      amber is 3.2:1 on white"); and a **derived** number — a contrast ratio computed from a stale
      hex — which is the shape that actually shipped in two `charts.jsx` comments. §52 would have
      caught the hex in those comments; it would not catch the ratio if the hex were dropped.
    - **`scripts/` is out of scope too, by a measured decision rather than an oversight.** The only
      palette attributions there are inside `check-data.mjs` itself, where they are probe data and
      failure-message templates — §52's positive control must literally contain `#7c8494` to prove
      the scanner fires. Extending the scan there was measured: it finds **exactly two** other lines,
      both the "other side of the pair" false positive already registered. Four or five register
      entries to police the checker was the wrong trade. **The cost is real and is written into the
      code:** §52's own first draft quoted a live value in a `scripts/` comment, which nothing would
      have caught. The step-5 self-check found it and the fix was to stop quoting the value.
    - **The shape that could work:** treat a hex within N lines of a token mention as an attribution
      candidate and require an explicit register decision. That trades a bigger register for a wider
      net, and the register is the maintenance cost — do not build it until there is a second real
      instance to justify the cost. **One defect is not a class** (this item's parent proved that).
    - **Honest priority: low.** Zero known live instances. Downstream of O-1 like everything else.

122. **✅ DONE 2026-08-27 (owner-directed: "compress the backlog to bring the floor under budget").
    The never-archived floor is 218,895 → 191,956 bytes; the backlog section 192,933 → 165,994. Every
    item number survives and all 17 open items are byte-identical.** See the run log for the method.
    > ⚠️ **The premise was corrected before the pass, and the correction is the durable part.** The
    > floor was **already under budget** (218,895 b = 88% of 250 KB), so "under budget" was read as
    > *create real headroom*, which is what the number above is. **Item 115's claimed post-compression
    > backlog figure of 146,979 b was also wrong by 43 KB** — the real figure at that commit was
    > 190,062 b, measured live from `d411961`. See item 115's premise-correction box.
    > **Where the bytes actually were, which is not where the first pass looked.** Item 115 compressed
    > 79 closed *items* and left the backlog's 396-line **preamble byte-identical** — and that preamble
    > held **34,857 b**, of which the closed W-1…W-4 block and the W-5 block's four "(original text,
    > retained)" duplicates were the bulk. Compressing those to their standing rules gave **16,519 b**,
    > more than the five largest closed items combined. **Item 115's own original text predicted this**
    > ("W-1 through W-4 are all closed and still occupy their full original text") and the pass that
    > wrote it did not act on it.
    > **What was kept:** every standing rule (W-1's browser-verification rule, W-2's refill rule,
    > W-5.2's one-run-in-four rule and its pick-lists-go-stale lesson, W-5.3's archiving rule and its
    > defect, W-5.4's measure-the-shape method note, W-5.5's both-places rule, W-5.6's two premise
    > corrections), O-1/O-2/O-3 verbatim, and every `⚠️`/`⛔` warning. **What was dropped:** superseded
    > chronology and retained original text, all of which is in the run log and the archive.
    > ⛔ **All 17 open items were left byte-identical, deliberately** — asserted, not eyeballed. **That
    > is now the binding constraint: open items are 76,643 b, 47% of the backlog**, and item 26 is
    > 11,556 b of it. The closed-item tier below the top ten is genuinely tight (81 items, 68,475 b,
    > ~845 b each); do not expect another pass to find much there.
    > ⛔ **FIGURE CORRECTED 2026-08-28, and the correction moves a 23 KB lever from "owner decision"
    > to "any run may take it".** This item said *"item 19 (23,478 b, HELD) … the largest single lever
    > left"* and concluded *"compressing a HELD item risks dropping scope … that is an owner decision,
    > not a run's."* **Item 19's own body is 307 b — three lines.** The 23,478 came from a per-item
    > split that bounds the LAST item at the end of the section instead of at the next section header,
    > so it absorbed everything below it: **"Notes for future runs" (4,304 b) + "Completed and pruned"
    > (18,864 b) = 23,169 b**, which are closed history, not backlog items, and hold no owner scope —
    > two of the three "Notes" are themselves marked RESOLVED (2026-08-13, 2026-08-16). **So the
    > largest remaining lever is real, is 23 KB, and nothing gates it.** Measured with a control: the
    > four parts (preamble 18,337 + numbered items 180,053 + Notes 4,304 + Completed 18,864) sum
    > byte-exactly to the backlog's 221,562 b. **The same artifact bit twice in one day** — the run
    > that wrote this correction hit it first and caught it only by reading item 19 itself.
    > ⛔ **LEVER TAKEN 2026-08-28, and it yielded 10,652 b, not 23,169 b. Both halves of the sentence
    > above — "closed history" and "hold no owner scope" — are wrong in the same direction.** The two
    > sections compressed 23,170 → 12,518 b; **the 12.5 KB that stayed is load-bearing, not padding.**
    > (a) `check-backlog.mjs` builds its valid-item-number set from every `former item N` string in
    > this file, and **items 22 and 23 are cited from four source files with no other accounting
    > anywhere** — proven by injection, replacing `former item 22` fails `npm test` with 4 errors.
    > (b) The third "Note" is **an open owner decision** (a dozen orphaned commits off `main`), not
    > closed history. (c) The rest is standing rules — v6 is contaminated with §10.2 and §2.3 content,
    > the pre-renumbering lesson-id warning, the palette-hex trap of item 63. **The transferable part:
    > a byte count over a section of closed items measures what CAN be read, not what can be deleted,
    > and only opening it distinguishes the two.** Two stale pointers surfaced while opening it — the
    > quiz answer-key invariant had moved to `quizMeta.js`, and two `former item` labels were
    > line-wrapped and so had never registered with the matcher at all.

121. **✅ DONE 2026-08-27; EXTENDED 2026-08-28 to rates; RATE PROJECTION CORRECTED 2026-09-01 —
    read the correction first, because the extension shipped a figure that was wrong by 15x in the
    direction that hides work.**
    > ⛔ **CORRECTED 2026-09-01 (scheduled dev-agent).** The runs-left projection divided headroom by
    > the **net** mean over every sampled interval — a series that includes archiving and compression
    > commits as large negatives. Measured over the identical 16-commit window on 2026-09-01: run-log
    > net mean **+680 b/commit**, writing-only mean **+10,481 b over 12 of 15 intervals**. One
    > archiving commit (**-115,573 b**) and two commits that touched the file without touching the run
    > log produced the whole gap. The line therefore printed **"101.3 run(s)"** of headroom where the
    > honest answer was **6.6**, and the floor's version printed the incoherent **"-Infinity run(s) of
    > writing to come back out"**.
    > **The failure is self-concealing, which is why it survived two runs that both looked at it:
    > performing an archiving pass injects a large negative into the window, which lowers the mean,
    > which reports MORE headroom — so the remedy makes the next application of the remedy look
    > unnecessary.** Two consecutive runs deferred a due pass on the strength of that line.
    > **Fix:** project from the writing rate (positive intervals only), print the net rate beside it,
    > and say which one the runs-left figures use. If a window contains no growing interval there is
    > no writing rate, so it falls back to the net mean — which is then <= 0 and prints "no growth at
    > the sampled rate" rather than a large false headroom. Net **+15 lines**; no new section, no new
    > script (W-6.3).
    > **Why the existing controls could not catch it, which is the transferable part.** The extension
    > shipped with a positive control that plants *uniform* growth (`+1,000 b/commit` → reports
    > `+1,000`). In an all-positive window the net mean and the writing mean are the SAME NUMBER, so
    > that plant passes identically before and after this fix. **A control built from a clean synthetic
    > series cannot detect a defect whose trigger is a mixed one.** The plant needed a negative in it.
    > (The original **+9,170 b/commit** figure quoted below was measured in a window that happened to
    > contain no archiving commit, so it was correct when written — this is drift into a defect, not an
    > error at the time.)
    ORIGINAL HEADLINE, kept because the correction above refers to it:
    **✅ DONE 2026-08-27 (scheduled dev-agent, recovering a stalled run); EXTENDED 2026-08-28 from
    levels to RATES. `AGENT_LOG.md`'s size is now a MEASUREMENT on every `npm test`, split into the
    two budgets W-5.3 conflated — and the script that does it was sitting uncommitted and unwired.**
    See the run log.
    > **EXTENDED 2026-08-28 (scheduled dev-agent): the script measures the RATE as well as the level,
    > and warns when a budget is less than one run's writing away.** A level says *where the file is*;
    > it cannot say whether a remedy works. Measured over the 15 intervals since item 122's
    > compression pass: floor **+3,541 b/commit** mean (min -748, max +8,506, **1 of 15**
    > net-negative), run log **+9,170 b/commit**. Item 122 bought **26,939 b ≈ 7.3 runs** against a
    > leak of one run per run. **Headroom when this was written: floor 894 b = 0.25 runs.**
    > ⛔ **That reframes items 115/121/122 and W-5.3, and it is the durable part.** All four treat the
    > problem as a LEVEL with two remedies (archive / compress). Both remedies are one-off, the growth
    > is continuous, and no level reading can show that: **"floor at 99.6% of budget" reads as *nearly
    > there*, while the identical state read as a rate says *the next commit crosses it*.** A
    > compression pass is not a fix, it is a **bailing bucket that buys ~7 runs**.
    > **Every git read is controlled, because a failed history read would report a delta of ZERO** —
    > item 108's "a proxy fails green" exactly. Four controls, all proven by injection in throwaway
    > repos rather than argued: a planted **+1,000 b/commit** growth reports **+1,000 exactly**; and a
    > revision missing `## Run log`, an all-identical floor, and an absent git checkout each report
    > **UNAVAILABLE** naming the control that failed. **None of them can print a zero.**
    > ⚠️ **The new warn is CLEARABLE, not decoration** — it goes quiet as soon as a compression or
    > archiving pass lands, which is why it is a warn and not a permanent banner. **If it ever becomes
    > permanent, that is the evidence that the BUDGET is wrong rather than the writing**, and moving a
    > budget is the owner's call under item 115's rule, not a run's.
    > ⚠️ **Do not read the mean as a per-RUN figure without checking.** It is per *commit touching
    > `AGENT_LOG.md`*, and bookkeeping commits (the owner-tree fingerprint ones) contribute a real
    > +0 that pulls it down. The hand figure over substantive runs only was +3,705 b.
    > **What it does NOT do, deliberately, and this is the part to read before picking it up.**
    > This is **not** item 115's option (b), and it does **not** close W-5.3's defect. The script's
    > own header argues (b) would not have worked: (b) re-points the *trigger* at a run-log byte
    > count, but the mismatch is between the trigger and the *action clause*, so a run-log trigger
    > would fire and "archive entries before the most recent review boundary" would still select
    > zero. A real fix makes the action clause byte-driven too — **that is a rule change, and item
    > 115 says a dev-agent implements whichever the owner names and must not choose.** So the
    > script COMPUTES the whole-day cut plan and prints it; it never archives.
    > **The two budgets, and why splitting them is the point.** `run log` is archivable; `floor`
    > (App summary + backlog + Environment note) is never archived, so **archiving cannot move the
    > floor by one byte** — only a backlog-compression pass can. On 2026-08-26 the file was 915 KB
    > with a ~485 KB floor: emptying the run log entirely still could not reach 600 KB, and the
    > rule had no way to say so. Each budget now names the remedy that can actually move it.
    > **Baseline measured 2026-08-27, all green:** file 295,551 b, run log 79,527 b (32% of its
    > 250 KB warn budget), floor 216,024 b (86% of its 250 KB budget, backlog 88% of that). **The
    > floor is the one to watch** — it is at 86% and archiving is powerless against it.
    > ⚠️ **Do not add a fingerprint to its `MEASURED log-size:` line.** Every commit here changes
    > `AGENT_LOG.md`, so the fingerprint would be stale before the next run read it and
    > `check-measurements.mjs` would report RETIRED forever — the vacuous green item 116 warns
    > about. It re-measures live instead; there is no retyped number to guard.

120. **[Process/QA — filed 2026-08-26 by the run that closed item 119, as its stated residual
    rather than smuggled into the same commit.] The storage audit tests ONE point in
    storage-space, so a `requires` that is too COARSE still passes it.**
    - **State:** `A11yStates.auditBegin/auditFinish` diffs each no-reload state cold against a
      single `WARM_FIXTURE` value per key. Every current `requires` predicate is an *emptiness*
      assertion — `COLD` (no completed lessons, no review history) and `NO_BOOKMARKS`.
    - **What that cannot see.** The audit answers "does this screen vary between empty and
      non-empty?". It does not answer "does it vary between two non-empty values?" — 1 bookmark
      vs 20, `completed = [1]` vs all 44, a review queue of 3 vs one of 40. A state whose
      declaration is satisfied by both still sweeps two different screens and reports `ok` for
      both, which is item 118's defect with a narrower mouth. Nothing in the file can currently
      express "this state needs SPECIFIC storage", only "this state needs storage to be empty".
    - **The cheap version:** give the audit a second warm fixture (different magnitudes, same
      keys) and diff warm-A against warm-B. States that differ there need a declaration finer
      than emptiness, or a recipe that pins the magnitude. Reuses the whole existing mechanism —
      the two controls, the snapshot, the delta — and adds one fixture.
    - **Honest priority: low.** No shipped defect is known to live here; this is the next
      question the instrument cannot answer, written down so it is not rediscovered. Downstream
      of O-1 like everything else. **Do not pick this over content or over an owner-facing item.**

119. **✅ DONE 2026-08-26 (scheduled dev-agent). Nine judgments became nine measurements: eight
    screens are provably storage-independent and one — the Glossary, exactly the candidate this
    item named — was silently sweeping the wrong variant.** See the run log.

118. **✅ DONE 2026-08-26 (scheduled dev-agent). The cold sweep came back clean; the instrument did
    not.** See the run log.

117. **[UX/Product — filed 2026-08-26 by the run that scoped "Practice all questions" to the
    questions the learner has reached, as its stated residual rather than smuggled into the same
    commit.] Two things that run decided by judgment and that the owner can cheaply reverse.**
    - **(a) Hidden, not disabled, when the pool is empty.** A brand-new learner now sees a Review
      landing with **zero buttons** (measured). The argument for hiding is that the only honest
      label for a dead control is the Steps rail directly beneath it, which already says a check
      question joins the queue when you finish a lesson — and item 96's sibling is the precedent
      against shipping a disabled button with no explanation. **The argument against is that an
      empty screen teaches nothing about what the button would have done.** A third option nobody
      priced: keep it visible and route it to Learn.

      **PREMISE CORRECTED 2026-08-26 by the run that picked this item, and the correction changed
      what (a) is about.** Measured from cleared storage: the screen is **not empty** — it carries
      the card, the three-step rail and the disclaimer. It was **false**. The card showed a green
      check and *"You're all caught up"* over *"A quick question before you move on."*
      (`t.checkIntro`, whose only other call site is LessonReader's end-of-lesson check) to a
      learner with `review = null`. `seen` already branched the **body** and never branched the
      **title or icon**, so the half that never branched was the false half. **That is fixed** —
      `reviewNotStartedTitle` / `reviewNotStartedBody` in all five languages, plus a `book` icon
      at `ink.muted`. **(a) itself is still open and still a judgment call**, but its "argument
      against" is retired: the screen now explains itself in one sentence, so hiding the button no
      longer costs the learner the explanation. Whoever picks this is choosing between *a sentence*
      and *a sentence plus a route to Learn* — not between a button and a void.
    - **(b) "Reached" means completed-or-already-answered, not unlocked.** An unlocked lesson is one
      the learner MAY open, not one they have read, so including it would be the same defect one
      lesson later — but it is a *product* line, and `CLAIMS.md` A1 is the bet it serves. If the
      owner wants "practice anything you could open", it is a one-line predicate change.
    - ~~**A cheap improvement neither branch needs a decision for:** the label still reads "Practice
      all questions" while the session may now be 2 questions long. Appending ` (N)` costs **zero
      locale keys** (digits are language-independent) and explains the number the learner gets.~~
      **✅ DONE 2026-08-28 (scheduled dev-agent) — but NOT as this bullet specified, and the
      difference is the part worth keeping.** Shipped as a per-language template
      (`practiceAllTemplate`, five keys) rendering e.g. `Practice all questions (6)`, verified live in
      all five languages at n = 1, 14 and 0.
      > ⛔ **"Zero locale keys" was arithmetically true and wrong as a design claim.** Two
      > measurements killed it. **(1) Plural agreement breaks at the first state a learner reaches.**
      > Measured: **46 questions over 44 lessons** (42 own one, 2 own two), so the pool is **1** after
      > one completed lesson and takes **44 distinct values** along the path — and `en`/`es` render
      > *"Practice all 1 questions"* if the count sits inside the noun phrase. `ko`/`zh`/`ja` have no
      > plural agreement and read better with it inline, so **no single JSX append is right for all
      > five languages**. **(2) Spacing is language-specific and the call site cannot know it** — `zh`
      > writes `"{n} 题待复习"` with spaces and `"查看全部{n}节课"` without.
      > **The house convention, measured:** every count in a **sentence** is a locale template (14
      > keys before this change); the only counts built in JSX are bare numeric ratios (`3 / 12`).
      > **Transferable: "costs zero locale keys" prices the change in the one currency that does not
      > capture what makes it wrong.**
      > Residual filed as nothing — but note the change created the 15th templated key and nothing
      > checked any of them, so `check-data.mjs` **§1b** (placeholder parity across languages, proved
      > able to fail three ways) landed with it. It catches a *structurally* wrong translation, never
      > a semantically wrong one.
    - **Honest priority: low.** The defect is fixed; these are the seams around it. **All of it is
      downstream of O-1** — nobody has opened the app, so no learner has met either branch.

116. **✅ DONE 2026-08-28 (scheduled dev-agent). `focusVisibleOnTab` is a real probe; the sweep
    reports `0 unavailable` for the first time. The item's central premise — that the harness
    cannot focus a document — was FALSE, and it is the reason the probe sat stubbed for two
    days.** See the run log.
    > ⛔ **PREMISE CORRECTION, and it is the durable half of this item.** "What blocks it is the
    > harness" was wrong. Every 2026-08-26 measurement reproduces exactly **at page load**, and
    > the word that did not belong was *permanent*: the document simply has **no focused area
    > until a real input event reaches the pane**. Send one `computer{action:"key", text:"Tab"}`
    > and on the next call `hasFocus()` is true, focus events fire, `:focus` and `:focus-visible`
    > both match, and a later programmatic `.focus()` **inherits** focus-visible — which is what
    > lets one probe cover a whole screen without a Tab press per element. `visibilityState`
    > stays `"hidden"` throughout, so it was never the signal to read.
    > **⚠️ Seed with Tab, NOT with a click.** A click gives `:focus` without `:focus-visible`
    > (the spec's pointer-vs-keyboard heuristic). Since `index.css`'s `:focus-visible` rule is
    > the app's *only* focus styling, a click-seeded sweep finds every control ringless and
    > reports the whole app broken. This is why `focusVisibleSelectors` is measured as its own
    > third capability rather than inferred from `focusSelectors` — the item-108 proxy mistake
    > has now been available to make three times, once per pseudo-class.
    > **⚠️ `hasFocus()` also lies about KEYBOARD DELIVERY, which is a second proxy failure and
    > cost a wrong conclusion inside this very run.** With the first-run dialog open it read
    > `true` across sixteen key presses of which a capturing `document` keydown listener received
    > **zero** — while a synthetic dispatch to that same listener fired, proving the listener was
    > alive. Eight of those presses had already been read as *"the focus trap holds"*. **If a
    > measurement depends on a key press landing, plant a keydown listener and count trusted
    > events.** Redone that way the trap does hold: 16 trusted keydowns, focus entered the dialog
    > and never left — §47's static guard now has its rendered-tree half.
    > **Residual, filed as item 139:** the probe answers *"does anything change on focus"*, not
    > *"is the change perceivable"* — WCAG 2.4.11/1.4.11 contrast of the indicator is uncovered.

108. **✅ DONE 2026-08-26 (scheduled dev-agent). The focus capability is now MEASURED by a planted
    control (`measureFocus()`) instead of inferred from `document.hasFocus()`, and
    `check-data.mjs` §43(d) fails if the proxy ever returns. Residual filed as item 116.**

107. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. Shipped as the
    `unnamedRegions` probe in `scripts/a11y-sweep.js`, with a planted control in `selftest()`
    (§43(c) proved able to fail on it) and a five-variant discrimination matrix measured live.**

106. **✅ DONE 2026-08-25 (scheduled dev-agent). Fixed by marking up the two block labels the
    lesson reader already had — `as="h2"` on `{t.hookTitle}` and `{t.checkTitle}` — and guarded by
    `check-data.mjs` §45, which was proved able to fail in three modes.**

101. **[Feature/Distribution — filed 2026-08-24 by the run that closed item 98, as its stated residual
    rather than smuggled into the same commit. Serves `LAUNCH_PLAN.md` §5. **Genuinely blocked on
    O-1**, not merely downstream of it.] `og:url` and `og:image` are the two preview tags item 98
    could not ship, and both need an origin that does not exist yet.**
    - **Why they were left out rather than guessed.** Both are specified as **absolute** URLs. This
      build is path-agnostic on purpose (`base: "./"`), and `vite.config.js` states that nothing here
      may hardcode a leading `/` — writing a domain into `index.html` now would ship a preview
      pointing at a page that does not exist and break the property the whole build rests on.
    - **`og:image` needs a second thing besides a URL: an image.** Measured 2026-08-24 — the repo has
      **no shippable raster asset**; the only images anywhere are the read-only launch-plan page scans
      in `working_files/`, and `public/` holds only `data/market.json` and now `icon.svg`. A preview
      card image is roughly 1200×630 and wants the product name set in type, which this repo cannot
      author without adding a raster toolchain (**item 12's port-cost rule applies** — scope it before
      adding anything). `twitter:card` should move `summary` → `summary_large_image` in the same
      change, and not before.
    - **When picked, do it in the same session as the deploy**, so the URL is a fact rather than a
      guess, and extend §38 to require both tags at that point — the section is written to be silent
      about them today and says so in its own comment.
    - **Honest priority: low until O-1, then immediate.** Everything here is inert without a URL, and
      the moment there is one it is the difference between a link that sells the app and a bare one.

    ORIGINAL TEXT (retained — it is what was measured):
    - **Measured:** `index.html` is 11 lines and carries `charset`, `viewport` and `<title>` — and
      **no `meta name="description"`, no `og:*`, no `twitter:*`, no favicon, no `theme-color`.**
    - **Why it belongs to §5 specifically.** Item 31 shipped hash routing so that "each lesson is a
      shareable URL" — that clause exists to make sharing a *funnel*. A URL that unfurls as a naked
      `localhost`-shaped link in a message does not do that job, so the routing work is currently
      only half-collected.
    - **One thing to decide rather than assume:** routes are **hash-based**, so every lesson URL is
      the same document to a crawler or unfurler — `#/lesson/29` is not sent to the server. Per-lesson
      previews therefore are **not** available without prerendering or a real path router, and item 31
      chose hash routing deliberately (see `DECISIONS.md`). **Scope this as one good site-level
      preview, not per-lesson**, unless the owner wants to reopen that decision.
    - Also fix `index.html`'s `<title>` hardcoding English while the app ships five languages, and its
      `lang="en"` — which is now the correct *initial* value, since `useAppState` overwrites it at
      mount (this date).

99. **✅ DONE 2026-08-24 (scheduled dev-agent) — both halves, the fix and the guard, in one commit.
    `Learn` and the app shell now sit behind error boundaries, and `check-data.mjs` §37 holds the
    invariant.**

100. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `src/lib/chunkError.js` (call-site
    tagging), a function-form `ErrorBoundary` fallback, and `check-data.mjs` §39. Read the premise
    correction first — the defect was real and reproduced live, but "one line of code" was wrong.**

76. **[Content/Process — filed 2026-08-18 by the run that built item 69's instrument half, which is
    what turned this from an opinion into a blocked measurement.] `zh` and `ja` `Brokerage Account`
    are term-of-art shape, and nothing can currently measure whether that generalizes.**
    - **The content question.** Item 67 rewrote `en`'s "realized gains" into a phrase that explains the
      mechanism; item 69 did the same for `es`. `ko` (`실현된 매매 차익`) already explains it. **`zh`
      `已实现的收益` and `ja` `実現した利益` do not** — they sit roughly where `en` was before item 67.
    - **Why it is blocked, and blocked on something real.** `npm run jargon -- glossary zh` now exists
      and **exits 1**: the extractor cannot represent a single Han character (see item 69's closing
      bullet and the 2026-08-18 entry). So there is no instrument that can tell you whether these two
      strings are a pattern across 32 entries × 4 languages or the only two instances. **Rewriting them
      on one run's reading is exactly the unmeasured multi-language drift item 69 was filed to prevent
      — do not do it, and do not treat "I read them and they look fine" as measurement.**
    - **The unblocking work is a per-language tokeniser**, and it is genuinely a piece of work, not a
      flag: `norm()` needs a Unicode-aware form, the acronym/capitalised-phrase rules need per-script
      replacements, and zh/ja need real word segmentation (ko can lean on eojeol spacing but still
      needs non-English head nouns). `DECISIONS.md:311` already accepted a related trade-off for the
      same reason. **Scope it before building it, and check whether a dependency-free segmenter is even
      available — item 12's port-cost rule applies to adding one.**
    - **Honest priority: low.** Two known strings, both comprehensible to a native reader, in a beta-
      labeled translation layer. The value is the instrument, not these two edits — and if the
      instrument is ever built, run it before deciding anything.
    > **PARTIAL ANSWER 2026-08-29 (the run that closed item 133), and it narrows what this item still
    > needs.** This item says "nothing can currently measure whether that generalizes". For
    > **role-term vocabulary** that is no longer true: `check-data.mjs` §60 measures per-language
    > presence of a role across a whole track **without segmentation**, by anchoring on English and
    > matching declared surface forms — §54(e)'s word-matching trick, which sidesteps the zh/ja
    > tokenizer entirely. That answered item 133 (5 languages x 3 tracks, zero role errors).
    > **What it does NOT answer, and why this item stays open:** §60 tests presence, so it cannot
    > tell a *pattern* from *two instances* — which is precisely this item's question about
    > `Brokerage Account`. A per-language tokenizer is still the unblocking work. **The transferable
    > part: "is this role represented at all?" is answerable today; "is this phrasing typical?" is
    > not.**

95. **✅ DONE 2026-08-24 (scheduled dev-agent), same run it was filed. [Process/Tooling — filed by
    the W-5.4 run's own closing note: "nothing stops a future run from writing `## 2026-…` again."]
    `check-data.mjs` §35 now asserts the run-log heading convention in both `AGENT_LOG.md` and
    `AGENT_LOG.archive.md`: every dated entry heading is `###`, every heading inside an entry is
    `####`.** See the run log.

75. **✅ DONE 2026-08-20 (owner-directed). `--fill-warn` exists in both palettes,
    `NOTE_TONES.warn.rule` points at it, and no `.jsx` under `src/` holds a hex literal any more — and
    for the thirteenth item running the premise broke, this time on the VALUE the item had already
    decided.** See the run log.

65. **✅ DONE 2026-08-17 — decided AMBER MOVES, because re-measuring the item's own figures changed
    the answer: amber's real contrast margins were 2-3x smaller than the item claimed, so the token
    moved instead of the exemption being made permanent. Proved by injection in both directions.**

70. **[Process — filed 2026-08-17 by the run that found item 67's headline number was wrong, because the
    error is structural and will recur.] Every measurement this repo reports lands in `AGENT_LOG.md` by
    being retyped by hand, and nothing checks the retyping.** Item 67's entry recorded "56 → 55" for a
    figure that was actually 56 → 57 — and the same entry, two paragraphs down, *correctly describes the
    two new candidates* that make it 57. The run had the facts and still wrote a wrong summary number,
    which is exactly what a hand-copied figure does. This is the shape item 55 already fixed one level
    up (`LAUNCH_PLAN.md`'s gate answer is generated, not retyped) and item 62's F12 flagged one document
    over (`DECISIONS.md`'s hand-written lesson ranges).
    - **Why it matters more than a typo.** These numbers are how a future run decides whether its change
      worked. A wrong one doesn't just misinform — it teaches the next run to distrust a correct
      instrument, or to "fix" something that was never broken.
    - **Scope if built, cheapest first:** (a) a `--json` flag on `jargon-candidates.mjs` so a run pastes
      output rather than retyping it; (b) a check that any `N → M candidates` claim in the *most recent*
      run-log entry still reproduces, which is harder than it sounds because the corpus moves under it;
      (c) accept the cost and instead require entries to quote the tool's own line verbatim. **(c) is
      free and probably right.** **Honest priority: low-medium** — no user-facing effect, but it is the
      second time in two days a run-log number has failed re-measurement (item 62's F4 was the first).
    - **✅ DONE 2026-08-17 (scheduled dev-agent) — built as (c) plus the half of (b) this item argued was
      too hard, because a fingerprint makes it easy.** `jargon-candidates.mjs` now ends with one line
      built to be pasted, and `scripts/check-measurements.mjs` (in `npm test`) re-runs the instrument and
      holds the log to every such line. **The objection filed against (b) — "the corpus moves under it" —
      is answered by stamping each line with a hash of everything that can move its numbers**: the
      corpus, the glossary subtraction set, **and the instrument's own source** (item 68 moved glossary
      57 → 54 by changing the rule alone, content untouched). A claim is enforced while its fingerprint
      holds and **retired, not failed**, once either side moves — so old entries age out on their own and
      the check never cries wolf on correct work. **(a) was not built and is not needed**: the pasted
      line is the machine-readable form, and a second `--json` shape would be a second thing to keep in
      sync. **What it still does not cover** is prose: "56 → 55" written in a sentence remains
      unverifiable, and the fix for that is to paste the line instead of describing it. See item 71 for
      the other instruments.

71. **[Process — filed 2026-08-17 by the run that built item 70, from the boundary that item deliberately
    did not cross.] `check-measurements.mjs` covers exactly one instrument, and the others are still
    hand-retyped into this log.** Item 70 fixed `npm run jargon` because that report is the one that has
    been wrong twice. But `npm run review-status`, `check-data.mjs`'s §28 contrast-pair counts and
    `check-payload.mjs`'s chunk sizes are all read by eye and retyped into run-log entries the same way,
    with the same nothing checking them.
    - **The mechanism already exists and is generic**: emit a `MEASURED <tool> <mode>: …  [fingerprint
      <hash>]` line, fingerprinted over the tool's inputs **and its own source**, and
      `check-measurements.mjs`'s `CLAIM` pattern plus its per-mode re-run loop extend to it with the
      tool name as a second key. The work is picking each tool's headline numbers and its fingerprint
      inputs, not building anything new.
    - **Do not do all three at once.** Each one is a judgment about which numbers are the headline
      ones; batching them is how the fingerprint inputs get chosen carelessly and a claim ends up
      permanently retired (always "outdated", never checked) without anyone noticing — the vacuous-pass
      failure `check-measurements.mjs` prints its `0 enforced` note to make visible.
    - **Honest priority: low.** Item 70 was earned by two real failures; this is the same shape
      pre-emptively, and `check-payload.mjs`'s figures in particular already live in a file that asserts
      them. Take it only when one of these numbers has actually been wrong once.
    - **2026-08-17: a contrast number WAS wrong, and this item would not have caught it.** Item 65's
      "card 3.44, canvas 3.24" were both wrong (3.19 / 3.08). But `check-data.mjs` never printed either
      figure — §28b prints only the *worst* pair per palette, and that line was correct. The wrong
      numbers were hand-computed for a pair the tool does not report. **So the gate above has still not
      fired**, and extending `check-measurements.mjs` to §28b's printed line would not have helped. The
      class this belongs to is the one item 70 explicitly left uncovered: a figure written in prose that
      no instrument ever emitted. The cheap defense remains item 70's — paste the tool's line, and if you
      need a number the tool does not print, print it.

69. **✅ DONE 2026-08-18 (scheduled dev-agent) — and the headline finding is that it was NEVER BLOCKED.**
    - **No gated figure moved, and the ledger does not apply.** Entry count stays **32**, so
      `LAUNCH_PLAN.md` §1's generated "32 glossary terms" is untouched — which is why this was shippable
      while `Dividend` (items 64/67) still is not: that one *adds a key*. The APR trap does not apply
      either: `scripts/translation-review-ledger.json` is keyed by **lesson id** over `lessonContent` and
      does not cover the glossary, and it hashes the **English** source, which this edit does not touch.
    - **⚠️ ko/zh/ja are NOT closed by this run, and this item's own claim about them is partly wrong.**
      The filing says all three are "already more descriptive than the English was". Re-read against the
      actual strings, that holds for **`ko` only** — `실현된 매매 차익` ("realized *buy–sell* profit")
      genuinely explains the mechanism. **`zh` `已实现的收益` and `ja` `実現した利益` are the local
      term-of-art shape** ("realized gains" / "realized profit"): roughly where the English *was* before
      item 67, not ahead of it. **Deliberately not rewritten** — no instrument covers non-`en` glossary
      prose, and changing two translations on my own reading is exactly the unmeasured multi-language
      drift this item was filed to avoid. It is a real residual, not a closed question; it is the smaller
      half of the "bigger version" bullet below.

68. **✅ DONE 2026-08-17 — built as scoped, minus one half that was measured and honestly declined.
    The glossary report went 57 → 54, the first time an in-place expansion made the number go DOWN.**

67. **🟡 TWO-THIRDS DONE 2026-08-17 (scheduled dev-agent) — the two terms that needed no new key are
    fixed and rendered-verified; only the `Dividend` half is still blocked.** See the run log.

66. **✅ DONE 2026-08-17 (scheduled dev-agent) — measured, and the instrument is permanent.**

60. **✅ DONE 2026-08-17 (scheduled dev-agent). The residual now has an instrument (`npm run jargon`),
    and the one real gap it found is closed: Brokerage Account is a glossary entry, chipped on lesson 6.
    For the seventh item running the premise was partly wrong — and this time the wrong half was the
    *scale*, not a number.**
    > **Two premise corrections worth not re-deriving.** (a) **APR is not money-track jargon** — it
    > appears exactly once in all 40 lessons, in *economy* lesson 35's list of rates that follow the Fed
    > ("the APR on your credit card"), where the sentence's job is the Fed transmission, not APR. Filed
    > with its disposition in item 64. (b) **"beneficiary" is not a gap**: lesson 14 is titled "Wills
    > and Beneficiary Designations" and rule 2 applies — its 9 uses are the lesson teaching the term.
    > **And the residual is still a residual.** `0 unexplained` now covers 30 keys instead of 29, which
    > is not the same as "no undefined jargon" — the instrument reports, it does not certify. Its
    > threshold (≥2 lessons or ≥3 uses) suppressed 422 lower-reach candidates that were never
    > individually read; APR is proof that the suppressed tail can hold a real one.
    > **THE INSTRUMENT FIRED AGAIN 2026-08-30 (scheduled dev-agent), on content that did not exist
    > when it was built — which is the case for keeping it.** Money lessons 41-44 shipped after
    > 2026-08-25 and brought a vocabulary the glossary had no entry for: `npm run jargon` ranked
    > **Labor income the highest-reach unglossed term in the money corpus (3 lessons, 11 uses)**,
    > with Business income (2/4), Investment income (2/3) and passive income (2/3) behind it. All
    > four are now glossary entries, chipped on 43 and 44 and excluded `defined-here` on 42.
    > **The transferable half is what "0 unexplained" was worth here.** §17b reported **0
    > unexplained** on the morning of this run and was *correct*, because it sweeps glossary keys
    > and these four were not keys. Its own header says so; nothing else does. **A green coverage
    > number is a statement about the vocabulary you already admitted, and new content arrives
    > outside it.** The next run to add lessons should run `npm run jargon` on the track it touched.
    > ~~**Residual, filed as a note under this item rather than as a numbered one (W-6.2 rule 2):
    > `FOMO` (2 lessons, 4 uses — money 20 and 28) is the last candidate on the list that is real
    > jargon rather than a section heading or a cross-reference.**~~ It was not taken that run
    > because it was not measured — nobody had read whether lesson 20 defines it at first use.
    > **⛔ MEASURED 2026-08-30 (owner-directed "do FOMO next") AND THE NOTE ABOVE IS WRONG. No
    > glossary entry is due, and the striking-out is the point: the note's own hedge ("it was not
    > measured") was the only true sentence in it, and the confident half was written anyway.**
    > Lesson 20 §1 reads *"The feeling that pulls Marcus in has a name: FOMO, the fear of missing
    > out"* — the acronym glossed in the clause that introduces it, so §3.0.3's FIRST branch holds.
    > The heading above it is "FOMO Pulls You In", the takeaway restates the expansion, and **the
    > single use outside lesson 20 — lesson 28 §1 — is itself a cross-reference carrying lesson
    > 20's title in parentheses.** So it is *both* of the two things the note said it was not.
    > Adding a key would also have obliged an exclusion on 20 under rule 2, i.e. the entry would
    > have been unreachable from the lesson that teaches it.
    > **The transferable half is about the instrument, and it is now fixed.** `npm run jargon`
    > printed *"0 self-defining suppressed — no acronym in this corpus is expanded next to
    > itself"*, which is a claim about the CONTENT that the count could not support: suppression
    > needs EVERY occurrence glossed, and FOMO is glossed once and bare three times. That sentence
    > is what made the note's confident half feel checked. The report now says "…EVERY time it
    > appears" and adds a second line naming the terms that ARE spelled out somewhere, and each
    > such candidate carries `← already spelled out in lesson N`. See the 2026-08-30 run entry.

64. **✅ BOTH CLOSED — struck from the W-5.2 pick list 2026-08-24 after seven days of being
    recommended when nothing was open. `Dividend` shipped 2026-08-20; the other two keys landed
    2026-08-17 (21 chips across 15 lessons). Nothing in this item is open.** See the run log.
    > **Residual worth not re-deriving: §17b cannot see a `takeaway` or a `thinkAbout`.** Chips
    > render per *section*, so a glossary term used only in those two fields is invisible to the
    > coverage check in both directions.

61. **✅ DONE 2026-08-17 (scheduled dev-agent). All 9 mechanical corrections applied, plus both guards
    the item asked for — and for the fourth item running the premise was wrong in one place, which is
    the part worth keeping.** See the run log.

62. **✅ ITEM FULLY CLOSED 2026-08-21 — F4, F6, F11 and F12 all done; nothing here is open.** See
    the run log.
    > **A blocking pattern named by the run that closed F12, and it recurs: two consecutive "Next run
    > should pick" notes pointed at work that was already finished.** Re-check a candidate's own item
    > before picking it — a pick list is a claim about current state and goes stale like a figure.

26. **[UX — owner-directed, entered as a backlog item by the 2026-08-16 weekly review] Quizlet/Vocabulary
    design-reference review.** The owner shared ~200 Mobbin-exported screenshots of the Quizlet and
    Vocabulary iOS apps in a 2026-08-15 interactive session and asked for transferable patterns to be
    applied. Six commits have shipped from it (dual right/wrong quiz markers, Review results recap,
    one-time Practice coach mark, glossary example sentences, Practice review-batch interstitial,
    term-detail screen + bookmark toggle). It was driven entirely from run-log notes and never appeared in
    this backlog — recorded here so the stream is visible and prioritizable. **Status: the ideas the
    review named are all built.** The one named-but-deferred follow-up is surfacing bookmarked glossary
    terms (a filter chip or a "Saved terms" count); three consecutive runs correctly deferred it pending
    evidence the toggle gets used, and that reasoning still holds — **it is blocked on item 18's analytics,
    not on effort.** Do not extend this stream with new invented ideas; the owner's explicit instruction
    was that no paywall/subscription UI be built from the reference material while §4.3's Phase-0 gate is
    open, and that still binds.
    > **~~New reference material appeared 2026-08-17, unread and uninterpreted.~~ ✅ READ AND
    > IMPLEMENTED 2026-08-21; this note is superseded and is kept only so the sequence is legible.**
    > The untracked `UIUX/` directory (now 35 screenshots + 16 videos of Buddy, Duolingo, Quizlet,
    > Vocabulary and Nibble) was owner material with no brief, and the standing instruction was to
    > leave it alone until the owner named what they wanted. **They did, on 2026-08-21.** A design
    > canvas was drafted from the folder and implemented: the finding was that **four of the five
    > mocked screens were already built to these references** and only `Learn.jsx` had a substantive
    > gap — which turned out to hide a real WCAG failure (`opacity: 0.55` on locked rows, 2.31:1,
    > invisible to §28 because it composites *on top of* a token pair). Five primitives derived from
    > the folder live in `components/ui.jsx` under its own "PATTERNS ADAPTED FROM THE UIUX/ REFERENCE
    > SET" header — `IconTile`, `Tile`, `TileGrid`, `Steps`, `ResumeCard` — and are wired into
    > `Reference.jsx`, `Practice.jsx` and `Learn.jsx` respectively. **Do not re-derive that redesign.**
    > **Second pass, 2026-08-23 (owner-directed, "apply the design"): the *visual language*, which the
    > first pass did not touch.** The 2026-08-21 work adopted the reference set's *structures* while
    > the palette stayed cool blue-on-near-black; the references are uniformly warm and editorial.
    > `src/index.css` was repainted to a warm palette in both schemes and screen titles took a system
    > serif. See `DECISIONS.md` and the 2026-08-23 run-log entry. **What is deliberately still NOT
    > built, and why, is in the 2026-08-21 entry's "Three things from the canvas deliberately NOT
    > built" section** — two because the design was wrong against `theme.js`'s rules, one (the Leitner
    > box-distribution strip) because it costs five locale keys x five languages and changes nothing a
    > learner does. **That third one is an open owner decision, not an oversight.**
    > **The owner's no-paywall instruction above still binds** — much of the `UIUX/` set is
    > subscription UI (Vocabulary's "Go Premium"/"Unlock all", its Settings "Manage subscription",
    > Duolingo's friends-invite), and none of it may be built from while §4.3's Phase-0 gate is open.
    > **Fourth pass, 2026-08-23 (owner-directed mid-run, "proceed implementing UIUX"): the reference
    > set's *touch targets*.** The first three passes took the folder's structures, its palette and
    > three of its patterns; all of them are iOS apps built to a 44pt floor, and the app was not.
    > **Measured with a control: eleven control classes rendered under 44x44 — the coach-mark dismiss
    > at 20x20 and the Sector period tabs at 19x31, the latter under even WCAG 2.5.8's 24px AA
    > floor.** Fixed against a new `MIN_TAP` token in `theme.js` and guarded by `check-data.mjs`
    > **§34**. The previous run had filed only the mildest instance ("the primary button is 42px")
    > and deferred it on the cost of its cheapest part — **a backlog note's characterization of the
    > code is evidence, not fact, and this is the eleventh consecutive time step 3.5 has said so.**
    > **STILL OPEN AND STILL THE OWNER'S CALL: the Leitner box-distribution strip.** It has now been
    > offered back three times (2026-08-21, and twice on 2026-08-23). "Proceed implementing UIUX" was
    > not read as an answer to it, because it is a translation-debt question (five locale keys x five
    > languages) rather than a design one. **It is the only unbuilt item left from the canvas** — if
    > the owner declines it, this stream is complete and item 26 can close.

> **PRIORITY BLOCK — set by the weekly review 2026-08-09. SUPERSEDED 2026-08-16 (see above); all four
> items below are closed. Retained for history.**
>
> **P-1. STOP ADDING LESSONS. The lesson treadmill is closed until P-2, P-3 and P-4 are done.**
> Thirteen of this week's runs added exactly one lesson each; twenty-two of the last twenty-four runs
> were single-lesson adds. The lessons themselves are good — that is not the problem. The problem is
> that item 17 *already names this failure mode in its own text* ("nine consecutive scheduled runs each
> picked 'add one lesson' and the direction drifted unexamined... Counting lessons is not the same as
> building the product"), the owner corrected it once on 2026-08-07, and the pattern re-formed inside
> the correction — the runs switched from mechanics lessons to judgment lessons and kept counting.
> The §4.3 Phase-0 gate has three clauses. Lesson count (≥40) is now **met**. The other two —
> ~2 hours of content, and ≥40% of installers finishing lesson 1 — are the ones that actually gate
> Phase 0, and **neither moved at all this week**; the completion-rate clause is not even measurable
> (item 18). A run that adds lesson 41 is optimizing the one clause that is already satisfied.
> Do not add a new lesson until P-2 through P-4 below are cleared. This is a stop, not a slowdown.
>
> **P-2. ✅ DONE 2026-08-09 (twenty-fifth run).** Refreshed `LAUNCH_READINESS.md`: now correctly reports
> **40 lessons / 112,387 chars / 100 min**, the §4.3 lesson-count clause as met, current translation
> ratios (es 0.745x/ko 0.371x/zh 0.235x/ja 0.325x), 15 kids blurbs (was stale at 9), and current
> disclaimer-render screen names. Also fixed a real bug found along the way: the file's own documented
> refresh script read `content/lessons.js` alone, which stopped holding lesson body text after item 23's
> 2026-08-07 split into `lessonContent.js` — the *documented* method would have returned ~4,860 chars,
> not 112,387. Both refresh snippets in the file now read the correct two files. See that run's log entry
> for full detail. **P-1 still requires P-3 and P-4 before the lesson freeze lifts — P-2 alone doesn't
> unfreeze items 17/24.**
>
> **P-3. ✅ DONE 2026-08-11.** Extended `check-blindspot.mjs`'s §10.1 check with per-language pattern
> sets for es/ko/zh/ja (5 patterns each, mirroring the shape of the 5 English ones — heading, "be
> bullish", "be cautious", "you should buy/sell/invest", "we recommend"). Verified against current
> content with zero false positives before landing, then injected one real violation phrase per
> language (e.g. Spanish "deberías comprar esta acción ahora mismo", Korean "지금 이 주식을 사야 합니다")
> into a scratch append to `src/content/glossary.js`, confirmed `check-blindspot.mjs` failed on each,
> then `git checkout --` reverted the file — `git status` was clean before committing this entry.
> `npm test` and `npm run build` both pass with the extended check. See run log for full detail.
>
> **P-4. ✅ DONE 2026-08-11 (owner decision, interactive session).** Owner chose **option (a)**: accept
> the current state (~40 lessons of unreviewed es/ko/zh/ja machine translation ships under "(Beta)"
> labeling), rather than (b) commissioning native-speaker review or (c) cutting the four languages.
> Landed alongside the decision, not after it: `scripts/translation-review.mjs` +
> `scripts/translation-review-ledger.json`, a review-tracking ledger (per lesson per language: reviewed
> by whom, when, against what English-source hash; drift-detected if English is edited after review) so
> "accept for now" is a tracked, revisitable state rather than the same kind of silent drift that caused
> P-4 to need escalating in the first place. `npm run review-status` reports coverage on demand; `npm
> test` now prints a non-blocking one-line summary every run via `check-data.mjs` (currently 0% in all
> four languages — accurate, not a bug). See `DECISIONS.md` ("Machine-translated lesson content...") for
> the full writeup and this run's log entry for verification detail.
> **Update, 2026-08-13 (interactive session):** the ai/human `method` field drafted the same day as the
> decision above (2026-08-11) but left uncommitted for two days (see the Notes section's now-resolved
> entry) was finished and landed, and Claude performed a full AI review pass over all 40 lessons ×
> es/ko/zh/ja — **160/160 pairs now `method: "ai"` in the ledger, coverage 100%/100%/100%/100% (0%
> human)**. Found and fixed three real translation-fidelity issues along the way (lesson 5's es/ko/zh/ja
> "rates already at 0%" overclaim, lesson 13's es/ko/zh/ja invented-example substitution, lesson 21's
> es-only dropped "incomes"). See `DECISIONS.md`'s updated entry and this date's run log for full detail
> — this is real judgment-based review, not a human/professional one, and the `method` field keeps that
> distinction visible for whoever eventually does the latter.
>
> **P-1 status: P-2, P-3, and P-4 are all done. The lesson freeze's stated unlock condition is met.**
> That does not mean the next run should default straight back to "add lesson 41" — re-read the
> "After P-1 lifts" note just below; the freeze existed to stop optimizing an already-met clause, and
> that reasoning doesn't reverse just because the three named blockers cleared. A run resuming lesson
> content should say explicitly which §4.3 clause it moves (minutes, not count) or that it's
> deliberately deepening an existing lesson instead of adding a 41st topic.
>
> **After P-1 lifts**, the lesson treadmill does *not* simply resume. The next content work should be
> aimed at a clause that actually gates Phase 0 — the ~20 remaining minutes (§4.3's content-duration
> clause), or deepening existing lessons rather than adding a forty-first topic. Re-read §4.3's table
> before picking, and write down in the run entry *which clause* the run moves.

> **Backlog refilled 2026-08-16 (W-2, owner-requested).** Items 27–32 below were derived by re-reading
> `LAUNCH_PLAN.md` §3.0, §3.2, §5, §8, §9.1, §9.2 and §9.3 against the actual `src/` tree — not carried
> forward from a run-log note chain. Every one is dev-agent-actionable today (none is owner-blocked), and
> each names the plan clause it serves. They are listed in the reviewer's value order; a run is free to
> disagree, but should say why in its entry. **Pick from here, not from the previous run's note.**

33. **[Content — ✅ DONE 2026-08-16 after a third pass. `lessonContent` fixed, then `quizData.js` — which
    the first two passes both missed entirely. §16 now guards both.]
    The 2026-08-14 lesson-id renumbering missed every non-English in-prose cross-reference, the
    lowercase English ones, and the plural `Lessons N and M` form.**
    > **⛔ The two lessons this item exists to carry, both learned the expensive way.**
    > **(1) A measurement taken with the same instrument that has the blind spot cannot detect the
    > blind spot.** This item once reported "0 mismatches" across all five languages. It was wrong:
    > the ~73 `ko`/`ja` references written as `N강` / `第N課` were invisible to the patterns doing the
    > counting, and **67 of them were stale**. Both this item's "0 remain" *and* `npm test`'s green
    > were produced by the very patterns that were failing to match. (Fixed under item 36, which
    > widened the patterns and added the coverage tripwire.)
    > **(2) A consistency check and a correctness check are different things.** §16 verifies that
    > translations agree with English; **it cannot verify that the English is right** — and the plural
    > form `Lessons 18 and 20` was stale in *every language at once*, so all five agreed with each
    > other and no consistency check could ever see it. Caught only by reading the content (the
    > sentence describes "a 401(k) or life insurance policy": 6 is *Retirement Accounts*, 8 is
    > *Insurance*). **This limit is written into §16's header comment**; the only correctness guard is
    > the nonexistent-id check.
    > **What §16 covers now:** lesson prose *and* `quizData.js`'s `explain` fields, with the `en`/`es`
    > patterns capturing the multi-number form (`Lessons 3, 5 and 7`) rather than only the first
    > number. Quiz items are scoped **per item, not pooled per lesson** — an `explain` field has no
    > sibling field for a translation to move a reference into, so pooling would just re-open the hole.
    > Proven against the real bugs by re-injection, with a negative control (a translation legitimately
    > carrying *fewer* references than its English still passes, so the intended asymmetry survives).
    > **What this says about the translation-review ledger, worth carrying forward:** `DECISIONS.md`'s
    > 2026-08-13 entry records an AI review pass over all 40 lessons × es/ko/zh/ja "checking
    > faithfulness", marked 160/160 reviewed. That pass did **not** catch these 74 wrong references in
    > 20 lessons. Not a reason to redo it — concrete evidence for the caveat that entry already states,
    > that AI review has correlated blind spots. **The generalization: a mechanical, checkable property
    > should get a script in `check-data.mjs`, not a reviewer's attention.**

27. **[Content/UX — the scope this item defines is now BUILT (2026-08-16); re-scope before picking it
    again.] Lesson visuals for the money track.**
    > **⛔ PREMISE CORRECTED 2026-08-27 by the run that added the fifth visual. The "money is 4/28"
    > line below, and every count in this item's older text, stopped being true at the 2026-08-19
    > `essentials` split — do not quote them.** Measured that day by parsing `LESSON_VISUALS` out of
    > `LessonVisual.jsx` and joining it against `lessons.js`'s `track` field, with a parser control
    > (three ids it must find, three it must not): **economy 5/12, essentials 3/15, money 1/17** before
    > that run, **money 2/17** after it. The four earlier personal-finance figures are not one track's
    > — 1/3/7 are `essentials`, 27 is `money`.
    > **The corrected number is the stronger argument.** Since the 2026-08-18 reversal `money` is the
    > judgment track §0 calls the product, and it carried **one** diagram across seventeen lessons
    > while the *vehicle* carried five across twelve.
    > **Fifth visual added 2026-08-27: lesson 23 (present bias), as `PreferenceFlip`.** It cleared the
    > bar below on the stated ground that a preference *reversal* is a crossing: the lesson's own
    > heading is "The Preference That Flips When 'Later' Becomes 'Now'", its body gives the flip as two
    > disconnected snapshots, and prose can neither draw a crossing nor say *when* the answer changes.
    > Guarded by `check-data.mjs` §50, which asserts the lesson's two stated choices and the discount
    > bound they imply — **not** the stylized constant. See the run log for the three defects verifying
    > it surfaced, one of which (a wrong closed form putting the marker at month 6.667 instead of
    > 9.667) would have drawn a confident marker where nothing happens.
    > **Sixth visual added 2026-08-27: lesson 17 (lifestyle inflation), as `GapColumns`.** Money is
    > **3/17**; economy 5/12 and essentials 3/15 are unchanged. Re-measured with the same parser
    > control — do not quote a coverage count from this item, re-run the parse.
    > **⛔ THE "TWO RISING LINES" FRAMING BELOW WAS WRONG, and the correction is the useful part.**
    > That line said lesson 17 is "where the gap between two rising lines is the lesson". Reading the
    > lesson refutes it: it gives Priya's income at both ends (\$50,000 six years ago, \$75,000 today)
    > but **never states her spending or her gap at either end**, and places the four upgrades "at
    > various points". Two lines over six years would have had to invent the starting gap — the one
    > quantity the entire claim is about. **A backlog item naming a chart shape is a hypothesis about
    > the prose, and this one had never been checked against it.**
    > **What the lesson does state exactly, in all five languages, is the gap at LEVELS**, in its second
    > section: \$50,000 earned against \$45,000 spent is a gap of \$5,000, and \$120,000 against
    > \$115,000 is also \$5,000. Six verbatim numbers carrying the lesson's own flagged counterintuitive
    > result. That is what shipped, and §53 asserts all six against the lesson's own body text.
    > **Seventh visual added 2026-08-27: lesson 44 (what "passive" leaves out), as `TradeoffPlot`.**
    > Money is **4/17**; economy 5/12 and essentials 3/15 are unchanged. Re-measured with the same
    > parser control — do not quote a coverage count from this item, re-run the parse.
    > **It cleared the bar on the lesson's own closing sentence**: *"Hold both halves at once and the
    > picture stops being a ladder and becomes a set of trades."* Lesson 43 states one axis, lesson 44
    > states "a second axis running the other way", and prose is sequential — it delivers them a
    > lesson apart and asks the reader to superimpose them from memory. **A ladder is
    > one-dimensional and a trade is not, and that difference is a shape.** First figure here whose
    > subject is the *dimensionality* of a claim rather than a quantity. Guarded by `check-data.mjs`
    > §54, which asserts sentences rather than values — including, per language, that each legend term
    > is the one that language's own lesson 42 uses.
    > **⚠️ BOTH ITS AXES ARE ORDINAL and must stay that way.** Lesson 44 states no numbers: an order,
    > a *tendency* ("generally demands more of something else up front"), and one absolute claim about
    > one item. No tick or number is drawn on the vertical axis. **A future run must not "improve"
    > this by sourcing real capital requirements** — it would render beautifully and would make a
    > claim the lesson explicitly declines to make ("Neither column is the smart one").
    > **⛔ THE TEST THAT REFUTED THE OTHER STRONG CANDIDATE, and it generalizes lesson 17's
    > correction into a rule.** Lesson 16 (asset vs. liability) looked ideal — its own stated test is
    > "which direction the money flows after you buy", and direction-over-time is undrawable in prose.
    > But it quantifies **only Maya's side** (\$300/month, \$10,800 over three years) while Dan's
    > tools "paid for themselves in the first few months", with no rate and no horizon. Two diverging
    > lines would have had to invent Dan's slope. **The rule, now first in line for any candidate:
    > does the prose state every quantity the shape needs, or only the ones that make it sound
    > plausible?**
    > **Eighth visual added 2026-08-28: lesson 28 (outcome vs. process), as `OutcomeGrid`.** Money is
    > **5/17**; economy 5/12 and essentials 3/15 are unchanged. Re-measured with the same parser
    > control — do not quote a coverage count from this item, re-run the parse.
    > **It cleared the bar on the lesson's own sentence**: *"outcome and process are two different
    > things — a good decision can still lose ... and a bad or lucky decision can still win."* Two
    > different things is two axes, and the claim the lesson actually needs is that **one column holds
    > both rows**: a win tells you which column you are in and nothing about which cell. Prose can
    > assert that twice; it cannot show a column with two cells in it. First figure here that is a
    > **partition** rather than a quantity or a rank — it carries no magnitude at all, which is what
    > `check-data.mjs` §57 is shaped around.
    > ⚠️ **ITS FOUR CELLS ARE EQUAL AND UNWEIGHTED, and that must stay true.** Lesson 28 says all four
    > cases occur and says **nothing** about how often ("very weak evidence", never "usually luck").
    > A future run must not "improve" this by weighting, shading or resizing a cell, or by adding a
    > base rate: that answers a question the lesson leaves open and reads as guidance about how far to
    > trust a result (§10.1). §57 (e)/(e2) hold it.
    > ⛔ **THE THREE CANDIDATES THIS RUN MEASURED AND REJECTED, all on the rule below — worth keeping,
    > because each looked ideal until the prose was read.** **Lesson 18** (opportunity cost) states
    > Jordan's \$2,000 and Alex's \$3,580 but gives Jordan's home theater only "maybe a couple hundred
    > dollars now" with **no depreciation path** — two diverging lines would have had to invent his
    > slope, which is lesson 16's rejection exactly. **Lesson 21** (anchoring) gives \$220 and \$89 but
    > **deliberately withholds the third number**, what the jacket is independently worth; a figure
    > would have had to invent the one quantity the lesson says nobody checked. **Lesson 25**
    > (save vs. invest) closes on *"not a formula with one right numeric answer"* and states no rate,
    > horizon or amount to plot. **The rule held in all three, and it is still first in line for any
    > candidate: does the prose state every quantity the shape needs, or only the ones that make it
    > sound plausible?**
    > **FIVE MORE CANDIDATES MEASURED AND REJECTED 2026-08-30** (scheduled dev-agent, while pricing
    > this item — coverage re-parsed with the usual control: economy 5/12, essentials 3/15, money
    > 5/17, 0 orphan ids, agreeing with this item). All five fail the quantity rule: **19** states
    > Priya's \$120 and nothing on the other side of the comparison; **20** has no number but
    > "tripled"; **24** states none at all; **26** gives \$200 and \$1,000 but its claim is that the
    > two are *identical*, a sentence rather than a shape; **42** states four x \$1,000 and then
    > spends its second half insisting the categories "aren't a ladder" — a figure would harden what
    > the lesson deliberately loosens. **Do not re-derive these five.**
    > **THE BAR FOR A NINTH IS UNCHANGED AND STILL BINDS**, and there is again **no named
    > candidate** —
    > deliberately, because a named candidate is how this item became count-shaped twice before. A run
    > that wants one must read a lesson's prose first and name what the prose cannot do, the way this
    > run did. **Do not pick a lesson because a diagram is "plausible" there.**
    > ⛔ **NEW, AND IT GENERALIZES PAST THIS ITEM: a figure's geometry is a RENDERED property, and a
    > source check cannot see it.** This run's figure shipped its intended claim ("the four cells are
    > equal") while rendering the bottom row **82px against the top row's 52px**, then **65 against
    > 52** after the first fix. Both times every style literal in the file was correct and §57 passed:
    > the inequality arrived through **content** — a label inside a cell, then a row heading that
    > wrapped to more lines — because CSS grid sizes a row to its tallest item. It was found only by
    > measuring the live DOM. **Measure a figure's boxes in a browser before claiming anything about
    > its proportions**, and prefer invariants that are structural (no text in a cell; a fixed shared
    > height) over ones that are stylistic. The general instrument is **item 135**.
    > **Ninth visual added 2026-08-31: lesson 30 (the spending chain), as `SpendingLoop` — and it is
    > the first figure added for the PATH rather than for a track's count.** Coverage re-parsed with
    > this item's own control (an id it must find, one it must not, plus a lessons/track control):
    > **economy 6/12, essentials 3/15, money 5/17 — 14 of 44, 0 orphan ids.** The argument is §3.2,
    > re-anchored: in display order the first three lessons a new install meets are **29, 30, 31**,
    > and until this entry the first diagram a new learner ever saw was on the **fourth** screen.
    > **It cleared the bar on what the lesson's own prose HAD TO DO.** Lesson 30 writes its claim as
    > an arrow chain — *"More spending → more income → more creditworthy borrowers → more borrowing →
    > more spending, and so on"* — and note what that sentence is forced into: it writes its first
    > term **twice** and appends *"and so on"*, because **a line of text cannot close**. The
    > takeaway calls it "a self-reinforcing loop". The one thing prose cannot do here is join the
    > last term to the first, and that join is the whole figure.
    > **The quantity rule passes vacuously and that is the correct reading, not a loophole**: the ring
    > needs no quantity, and the lesson states none in that section (the worked example — a kitchen
    > renovation, a work truck — deliberately gives no figures). This is `OutcomeGrid`'s kind, a
    > structure carrying no magnitude, arriving at a different shape.
    > ✅ **THE PROPERTY WORTH CARRYING FORWARD, and it is not about this lesson: EVERY STRING THE
    > FIGURE RENDERS EXCEPT ITS TEXT ALTERNATIVE IS A VERBATIM SUBSTRING OF LESSON 30 IN THE SAME
    > LANGUAGE.** Title, caption and all four steps are *lifted*, not translated — 6 strings x 5
    > languages, so **24 of the 28 non-English strings in this figure are not new translation at
    > all**. `DECISIONS.md` (the 2026-08-16 scope limit, amended the same day for item 27's lesson-7
    > figure) says the thing this answers in its own words: chart labels are *"the content type where
    > an unreviewed translation is least visible, because a wrong label still renders as a correctly-
    > shaped chart"*, and the parity checks catch **a missing language, never a wrong one**.
    > `check-data.mjs` §64 (a) is the first check in this file that catches a *wrong* one, and it
    > does it by anchoring to the lesson rather than by reviewing the translation. **A future figure
    > whose labels can be lifted should be lifted.**
    > ⚠️ **DO NOT DRAW A SECOND, COUNTER-CLOCKWISE RING.** The caption is the lesson's own *"this
    > self-reinforcing loop runs in both directions"*, and the obvious reading of it is wrong: both
    > directions means the loop spirals **up in a boom and down in a bust** (the takeaway says exactly
    > that), **not** that the causality reverses. A mirrored ring would be an economics error, and it
    > is the error the caption invites. §64 (c) pins the order. The same reason is why the four boxes
    > were left carrying the lesson's own "more X" wording rather than a neutral noun: "less spending"
    > appears nowhere in lesson 30 in any language, so a bust ring would have to be invented in five.
    > ⚠️ **AND THE BOXES CARRY NO SIZE — enforced, after the live DOM said otherwise.** Measured at
    > 390px before the fix: the top row drew **35px against the bottom row's 52px**, because "more
    > creditworthy borrowers" wraps to two lines and CSS grid sizes a row to its tallest item. That is
    > item 27's own 82-vs-52 finding above, in a new figure, and it says the finding generalizes:
    > **the first live measurement of any new figure should be its boxes.** Fixed with
    > `gridTemplateRows: "1fr auto 1fr"` (both rows 52px at 390px/en, 62px at 320px/130%/ko); §64 (d)
    > holds it, and `LOOP_BOX` may never gain a width/height/flex/grid-span.
    > ⛔ **THE OTHER TWO BARE PATH-OPENING LESSONS WERE MEASURED AND BOTH FAIL, so do not "finish the
    > first three".** **Lesson 29** has two candidate claims and neither survives: *Total Spending =
    > Money Spent + Credit Spent* states **no split**, so a two-segment bar would invent the one
    > proportion it is about (lesson 16's rejection exactly); and *$500 on 100 loaves is $5 a loaf* is
    > fully quantified but is a division the sentence already performs in one clause — a figure of it
    > shows nothing the prose cannot. **Lesson 31** is subtler and is the interesting one: its claim
    > (productivity a straight gentle line, credit swinging around it) is **precisely what `CycleChart`
    > draws**, and the 2026-08-31 trend-slope fix was justified *by quoting lesson 31*. But
    > `CycleChart` also labels **four phase dots**, and the phases are lesson **38**'s content, seven
    > screens later — mapping it here would front-run its own vocabulary. **A figure that is right
    > about the lesson's claim can still be wrong for the lesson's position.** Both remain bare on
    > purpose; that is a measured decision, not an oversight.
    **Status check, 2026-08-16 (item-29 run):** `LESSON_VISUALS` in `src/components/LessonVisual.jsx`
    now maps money lessons **1 (`budgetSplit`), 3 (`compounding`) and 27 (`lossAsymmetry`)**, plus the
    five economy ones — i.e. money is **3/28, not 0/28**, and the three lessons this item's own "Scope
    guidance" names verbatim (compound interest first; budgeting's needs/wants/savings split and loss
    aversion's asymmetric-weight diagram as the seconds) are **exactly the three that exist**. §3.2's
    sharpest point is closed too: a new install opens on money lesson 1, which now has a visual. So the
    work this item specifies is done, and its own guidance ("do **not** bulk-add 28 visuals... a visual
    that merely decorates fails §3.0.1") argues against treating the remaining 25 as a queue.
    **A run wanting to add a fourth money visual must first name the specific lesson where a diagram
    teaches something the prose cannot** — otherwise this becomes the count-shaped backlog item that
    items 17, 21 and 24 each turned into. Original text retained below for the reasoning.
    > **Fourth visual added 2026-08-16 (evening dev-agent run) — money is now 4/28. The bar above was
    > met by the lesson's own prose, not by an argument constructed for it.** Lesson 7 (marginal tax
    > brackets) opens with *"Imagine income tax as a stack of buckets, each with its own rate, and money
    > fills them from the bottom up"* — the lesson was already asking the reader to picture a diagram the
    > app declined to draw, and then spending three paragraphs on the misconception ("a raise can push
    > you into a higher bracket and leave you with less") that one picture settles. Shipped as
    > `BracketStack` in `charts.jsx` + `bracket*` in `moneyVisuals.js`, guarded by `check-data.mjs` §21.
    > **The guard checks the diagram's teaching claim, not its data shape** — that the two stacks are
    > band-for-band identical below the old income line, that the raise splits across two bands with the
    > old-rate slice the larger of them, and that take-home rises. See the run log for the injection
    > tests and for the rendered measurement that changed the scenario mid-run.
    > **The bar for a fifth is unchanged and still binds.** Note what this one did *not* do: it added no
    > visual to lessons 9, 11 or 12, each of which has a plausible diagram, because "plausible" is the
    > count-shaped reasoning this item warns about.
    *(Original framing — PRIORITY, the highest-value open item)*
    `LAUNCH_PLAN.md` §3.0.4, §3.2, §5.** Measured 2026-08-16 by the weekly review, from
    `LESSON_VISUALS` in `src/components/LessonVisual.jsx` against `src/content/lessons.js`:
    **money 0/28 lessons have a visual; economy 5/12 do** (ids 32, 33, 36, 37, 38 — cycle, yield curve,
    balance sheet). Money is 28 of the 40 lessons and, per §0, *is the product* — economics is "the
    vehicle, not the product." So the entire diagram differentiator currently sits on the vehicle.
    Three separate plan clauses converge on this, which is why it ranks first:
    - **§3.0.4 "Show, don't only tell"** names the animated diagrams as *the* differentiator, in those
      words: "an LLM can explain a yield curve in text; a curve inverting in front of the reader is what
      a chat window cannot do." §3.0 is the **primary success criterion** and §11's second move is
      "hold the line on §3.0 — it is the one most easily lost to feature work."
      > ⛔ **THIS BULLET HAS BEEN QUOTED FIFTEEN TIMES FOR ITS FIRST HALF AND NEVER FOR ITS SECOND,
      > and that was corrected 2026-08-31 (scheduled dev-agent) rather than by adding a fifteenth
      > figure.** The word is **"animated"**, and the example is **"a curve inverting in front of the
      > reader"** — which names one specific figure that this app has shipped since before the rebuild.
      > Measured that day with a control (the same regex fired twice on `index.css`, which does
      > animate): `charts.jsx` contained **zero** state or motion primitives in 1,047 lines. **Every
      > figure in the app was still.** Lesson 36's four static curves are now **one curve the reader
      > moves between the four shapes**, morphing on `requestAnimationFrame` with an explicit
      > `prefers-reduced-motion` check — `index.css`'s reduce block uses `!important` on CSS
      > animation/transition and is blind to a rAF loop, so that guard is load-bearing, not ceremony.
      > **Coverage is UNCHANGED at 14/44 — no figure was added**, so do not re-parse on account of this
      > note; and **zero new locale keys** were needed, because the four segment labels
      > (`t.curveNormal` and siblings) were already the four grid captions and `yieldCurveDescriptions`
      > was already five-language content.
      > **The transferable finding, which is the point of this note:** a plan clause can be cited
      > accurately, repeatedly, for years, and still have half of it go unread — because each citation
      > quotes it to justify the work already being done. **The half nobody acts on is the half that
      > does not resemble the current tranche.** Fourteen runs read this bullet as "add a figure"; it
      > also says the figures should move.
      > ⚠️ **The cost is real and is recorded so a future run does not "restore" the grid without
      > reading it:** the four shapes are no longer visible *simultaneously* in lesson 36, and its
      > first section IS a taxonomy the grid matched one-to-one. It was traded for the lesson's second
      > section and takeaway, which are a *transition* ("that gap flipping negative"), for ~3× the
      > linear size at 375px (§3.0.7), and for §3.0.1. **The simultaneous comparison still ships
      > unchanged in Reference > Market signals** — that call site passes neither new prop and was
      > verified untouched. **If a future run wants the grid back in the lesson, it owes an argument
      > against those three, not just a preference for grids.**
      > 🔎 **A geometric result worth keeping, and nobody designed it:** because all four shapes share
      > the x control points `10,40,70,130` and differ only in height, the halfway frame of a
      > **normal → inverted** morph is `37.5,37.5,35,35` against the authored **flat** shape's
      > `38,37,36,34` — **21× closer to flat than to either endpoint**. The animation walks the
      > lesson's own stated sequence (normal → flat → inverted) with no new copy. **A future run
      > must not "improve" the easing or re-author a shape's heights without re-checking that
      > property** — it is the figure's whole pedagogical claim, and it is an accident of the
      > geometry rather than something the code asserts.
    - ~~**§3.2 "The first five minutes... the most important feature."** First-open routing lands a new
      install on **money lesson 1 (Budgeting)** — which has no visual at all. The first thing a new
      learner sees is the case *against* the app's stated differentiator.~~
      > ⛔ **BOTH HALVES OF THAT BULLET ARE NOW FALSE, re-measured 2026-08-31 with the parser control
      > this item already prescribes.** Lesson 1 (Budgeting) HAS a visual (`budgetSplit`), and since
      > the 2026-08-18 reversal a new install does not open on it — it opens on **economy lesson 29**.
      > **The bullet's POINT survives its numbers, and that is why it is corrected rather than
      > deleted.** Coverage 2026-08-31: **13/44 overall — economy 5/12, money 5/17, essentials 3/15**,
      > unchanged since 2026-08-28. In display order the path's **first three lessons — 29
      > (Transactions), 30 (Credit), 31 (Productivity Growth) — carry no figure**, so the screen a new
      > install actually opens is still the case against the differentiator; only its id moved.
      > **Re-scoped, which is what this item's own header asks for:** the gap is no longer "the money
      > track", it is **the opening of the economy track**. Lesson 31 is the strongest candidate on
      > the "does the prose state every quantity the shape needs?" rule below — but note it states a
      > *shape* ("grows in a fairly straight, gentle line") and no quantities at all, so any figure
      > for it must be ordinal, like lesson 44's. **Lesson 29 states its own numbers** (\$500 over 100
      > loaves = \$5) and is the one a new install opens.
    - **§5 Distribution** makes screen-recorded diagram clips the whole acquisition engine ("every
      lesson yields two or three clips"). With 0/28 money lessons illustrated, the clip pipeline has
      nothing to film on the track the product is actually about.
    **Scope guidance:** do **not** bulk-add 28 visuals. Pick the two or three money lessons where a
    diagram teaches something prose cannot (compound interest over time is the obvious first — a curve
    is the concept; budgeting's needs/wants/savings split and loss aversion's asymmetric-weight
    diagram are plausible seconds), build them to the existing `charts.jsx`/`LessonVisual.jsx` pattern
    and `theme.js` tokens, and verify each in a live browser per **W-1**. A visual that merely decorates
    fails §3.0.1 ("one idea per screen") — if it doesn't teach, don't ship it.

28. **✅ MECHANISM DONE 2026-08-16 — `src/content/lessonTerms.js`, a curated lesson→glossary link
    table, guarded by `check-data.mjs` §17. Do not re-pick this item to "finish" it: what remains is
    a glossary *coverage* gap, and that is item 35.** See the run log.

29. **[Process — ✅ DONE 2026-08-16. Both payload gaps closed, both proven in a live browser.]
    Finish the §9.2 event payloads — the half of item 18 that is NOT owner-blocked.** See the run log.

35. **✅ FULLY DONE 2026-08-21. Both batches shipped — 12 terms 2026-08-16, 2 more 2026-08-21. The
    glossary is 35 terms (38 since the M0/M1/M2 entries).**

36. **✅ CLOSED 2026-08-16 (fifth pass, owner-requested). `ja` cross-reference coverage 31 → 44,
    equal to `ko` and `zh`. The guard that generalizes is in: `check-data.mjs` §16 prints the
    per-language match count and fails on a drop.** See the run log.
    > **THE STANDING LESSON, and it took four premature all-clears to learn: on this check a green
    > `npm test` has repeatedly meant "not scanned", not "clean".** Hand-enumerating surface forms
    > failed four times (`레슨 N`, `レッスン N`, `15강`, `第N講`), and the scope was wrong too —
    > §16 walked lesson prose only and never read `quizData`. **Verify this class by injection, not
    > inspection**, and use a **single-pass** substitution: a two-pass replace corrupts the counts.

30. **[Process — ✅ DONE 2026-08-16. `CLAIMS.md` + `scripts/check-claims.mjs`, wired into `npm test`.
    14 claims, 2 of them already refuted by this repo's own history.]**
    > **Premise correction from building it:** "no such artifact exists" was half wrong. `LAUNCH_PLAN.md`
    > **§4.6 already held four monetization claims**, each with a refuting number. What they lacked was a
    > **check date** — the third of §9.1's three parts, and the one that makes a claim self-refuting
    > rather than merely well-phrased. They are imported as B1–B4 rather than reinvented.
    > **The register's most useful output is a concentration, not a claim:** 10 of 14 are unmeasurable
    > today and nearly all name **item 18**. That reframes item 18 from one blocked backlog line into
    > the thing keeping most of this project's stated beliefs unfalsifiable.
    > **⛔ D1 and D2 are recorded as already REFUTED**, by evidence from this log, and they are why the
    > adversarial self-check exists: **D1 — a run's self-reported verification can be trusted** — failed
    > twice (the §10.1 "closed" claim that was half done; item 33's "0 remain" that the item-36 run
    > disproved 67 references later). **D2 — a green `npm test` means the property holds** — failed via
    > §16's ko/ja patterns matching 1-of-44 and 1-of-31. Per §9.1 the response must be a product change,
    > not a softer restatement, so the three changes those forced (the adversarial self-check, the §16
    > coverage tripwire, and this register) are listed in the file **specifically so they cannot later
    > be quietly softened**.
    > **`check-claims.mjs`** fails on a malformed row, a non-ISO check date ("when analytics land" is
    > rejected by design), a duplicate id, a bad measurability value, or a missing file; it **warns** on
    > past-due dates, which is what §9.3's audit question 4 reads. All six guards proven by injection.
    > `CLAIMS_TODAY` overrides today's date so the past-due path is testable and no date is hardcoded (§2.3).
    > **Known limit, written into the script's header:** it verifies shape and dates. It cannot verify
    > that a claim is any good, that a threshold is the right number, or that a status is honest — and
    > it specifically cannot catch a threshold softened *after* seeing the result, which is the failure
    > §9.1 actually cares about. **That one stays a human duty.**

31. **✅ DONE 2026-08-16 — hash routing shipped as scoped: `src/lib/deepLink.js`, `#/learn`,
    `#/practice`, `#/reference`, `#/lesson/<id>`, one module, no router, respecting item 12's
    port-cost rule.** See the run log.
    > **⚠️ What this surfaced is an OWNER question, not a follow-up task: a URL does not unlock a
    > lesson.** §5's acquisition funnel wants each lesson to be a shareable link, and the sequential
    > unlock model means a shared link lands on a locked screen. Recorded in `DECISIONS.md` with the
    > owner-facing cost. **Deliberately not built:** routes for the Reference sub-nav.

37. **✅ DONE 2026-08-16. §10.4's translation-coverage figure is now enforced rather than trusted —
    `check-data.mjs` §11b fails the build when it disagrees with the live ledger.** See the run log.
    > **Deliberately NOT guarded: the same row's character-count figures.** They move by single digits
    > on any content edit, so guarding them would make every content commit red. `refresh-readiness.mjs
    > --check` owns the character sentence; §11b owns the coverage percentages and explicitly excludes
    > char counts. The two comments read as contradictory only out of context.

32. **✅ DONE 2026-08-17 — §9.3's first monthly audit, run nineteen days early and deliberately, as
    `reviews/2026-08-17-monthly-audit.md`. Its three proposed §10 blindspots and claim D3 were
    applied by item 73.** See the run log.
    > **Deliberately NOT done: §9.3's closing "update §10" step** — §10 lives in `LAUNCH_PLAN.md`,
    > which an audit should propose against rather than edit in the same pass.

40. **[A11y — ✅ DONE 2026-08-16. Fixed as a pattern, not one line: the audit found the `<ol>`/`<ul>`
    question was the *smaller* of the two defects in these lists.]**
    > **The bigger find, which this item did not anticipate:** every list in the app sets
    > `listStyle: "none"`, and **WebKit removes list semantics from exactly that** — so under VoiceOver
    > on iOS all eight were announced as loose text, with no "list, N items" and no item position. The
    > `<ol>`/`<ul>` mixup affected one list; this affected all of them, on the platform the app targets.
    > All eight now carry an explicit `role="list"`.
    > **⚠️ Honest limit on that half, stated because this log's D1 claim exists:** the `<ol>`→`<ul>` fix
    > and the `role="list"` attributes were verified live; **the WebKit behavior itself was not**, because
    > the preview browser here is Chromium, where `role="list"` is a no-op. That half rests on documented
    > WebKit behavior, not on a measurement taken in this environment.
    > **Guarded by `check-data.mjs` §20**, which fails if any `listStyle: "none"` list lacks
    > `role="list"`, and — per item 36's lesson — fails *itself* if its scan matches fewer than 8 lists,
    > so a dead pattern can't pass vacuously. Proven by three injections. **§20's header carries the
    > per-list verdicts for all eight lists, and what the check cannot do** (it cannot tell whether
    > `<ol>` or `<ul>` is right, which is the content judgment this item was actually about) — read them
    > there rather than re-deriving them.
    > ⚠️ **Renumbered 34 → 40 on 2026-08-16, and this is how to read older entries.** Two items were
    > both numbered 34; this one moved, by blast radius rather than seniority — the other (the "Be the
    > Fed Chair" policy simulator) is cited from seven files in `src/`, `scripts/` and `DECISIONS.md`,
    > while every reference to this one was `AGENT_LOG.md` prose. **Run-log entries dated 2026-08-16
    > that say "item 34's `<ol>`/`<ul>` a11y call" mean this item (40).** Those entries are history and
    > stay verbatim. Any other "backlog item 34" — and every one in source code — means the simulator.
    > `check-data.mjs` now fails the build if two backlog items share a number.

24. **[Content — EXHAUSTED in substance; do not pick by default] The money track teaches mechanics, but
    the owner asked for judgment.** Compressed 2026-08-16 by the weekly review (W-3) from ~80 lines of
    accreted "Update, `<date>`" paragraphs; nothing below is new, and the full history is in the run log
    (2026-08-07 → 2026-08-09). Owner-stated 2026-08-07 in an interactive session, correcting the
    direction fifteen consecutive lessons had been built in — **it takes precedence over item 17's raw
    lesson-count framing.**
    **Verbatim owner intent, do not paraphrase this away:** *money lessons* means lessons in the spirit
    of books like **"Rich Dad, Poor Dad"** — "it is crucial to be wise rather than impulsive and the app
    is there to help learn about making wise choices."
    - **Status: satisfied in substance. Do not add a fourteenth judgment lesson by default.** Thirteen
      judgment lessons were built 2026-08-07 → 2026-08-09, and **every topic this item's own "what to
      write instead" list named is now built.** The gap it was written against — that every money lesson
      was procedural (*here is how a mechanism works*) and none taught decision-making (*how to choose,
      how to notice you're about to choose badly, why people who know the mechanics still end up broke*)
      — is closed.
    - **Current ids, post-2026-08-14 renumbering:** money **1–15 are the mechanics lessons**; money
      **16–28 are the judgment lessons** — asset-vs-liability lens, lifestyle inflation, opportunity
      cost, sunk cost, FOMO/herd behavior, anchoring, confirmation bias, present bias, needs-vs-wants,
      time horizon, mental accounting, loss aversion, overconfidence after a lucky win. **Ids cited in
      run-log entries written before 2026-08-14 are pre-renumbering and are wrong now — read
      `src/content/lessons.js`, don't trust a quoted id.**
    - **Two unbuilt candidates remain**, and they come from an informal starter list, not from this
      item's original scope: lifestyle creep after a windfall, and "too good to be true" pattern
      recognition (the latter possibly overlapping lesson 20's FOMO/herd-behavior lesson — read both
      before committing). **Neither moves any §4.3 clause**; read item 17 and the 2026-08-16 PRIORITY
      BLOCK before picking either.
    - **The §10.1 tension — do not skip this.** That genre is advice-heavy and parts of it are contested
      (e.g. Kiyosaki's "your house is not an asset" conflicts with standard accounting; his leveraged
      real-estate advocacy is genuinely risky prescriptive advice; parts of the book are disputed as
      fictionalised). §10.1 forbids advice-adjacency and `check-blindspot.mjs` only catches literal
      phrases — it cannot catch "this reads like advice," which the script's own header says stays a
      judgment call. **Take the genre's mental models and its behavioral insight; leave its
      prescriptions.** Teach the lens ("does this put money in or take it out?") and be honest that real
      purchases sit in between; never write "buy assets, not liabilities" as a directive, never name a
      product to buy, never imply a path to wealth. Do not cite or quote the book as an authority — it
      is a pointer to a genre the owner named, not a source to copy.
    - **The failure mode this item created:** four consecutive runs each wrote "a future run should
      re-scope this rather than keep extending the list ad hoc," and each then extended the list ad hoc
      anyway. It functioned as a perpetual lesson-generator.

17. **[Content — EXHAUSTED, both §4.3 content clauses met] Grow the lesson catalog.** Compressed
    2026-08-16 by the weekly review (W-3) from ~63 lines; the deepening-run chronology and the eighteen
    `LAUNCH_READINESS.md` refresh notes it carried are history and live in the run log (2026-08-12 →
    2026-08-15). Derived from `LAUNCH_PLAN.md` §4.3 — the plan's own explicit gate, not owner-assigned.
    - **Status: 40 lessons / 136,031 English chars / 120 minutes (28 money + 12 economy). Both §4.3
      content clauses are met** — lesson count (≥40) cleared 2026-08-09; minutes (~120) cleared
      2026-08-15 by lesson 36's term-premium section, after seventeen consecutive +1-minute deepening
      runs. **This item's stated purpose — move a §4.3 content clause — is exhausted. Do not pick it for
      another deepening, and do not add a forty-first topic.**
    - **Measurement method, reproducible:** sum every lesson's `sections[].body.en` + `takeaway.en` +
      `thinkAbout.en` across `content/lessonContent.economy.js` + `content/lessonContent.money.js`, and
      sum `minutes` from `content/lessons.js`. **`minutes` is not hand-set and cannot silently drift:**
      `scripts/check-data.mjs` recomputes it as `round(words / 200)` from the body text and fails
      `npm test` on mismatch — so the number scored against the gate is the same number the app shows a
      learner. (Independently verified by the 2026-08-16 weekly review.)
    - **This does not end Phase 0.** §4.3 requires the content clauses **and** ≥40% of installers
      finishing lesson 1. That third clause is unmeasured and blocked on an owner action (item 18 — a
      real analytics provider), **not on more content**. Per §4.3 verbatim: "the highest-value
      monetization work right now is writing lessons, not writing billing code" — but with both content
      clauses met, that sentence no longer points at more lessons. Do not start billing/paywall work
      ahead of the gate either; see item 15.
    - **Chunk-size caution for any future content edit:** `lessonContent.money` builds to 499.36 kB,
      just under Vite's 500 kB warning threshold. A deepening pass on a *money*-track lesson must check
      the post-build chunk size before committing; economy-track content lands in a separate chunk.
    - **The failure mode this item created:** nine consecutive scheduled runs each picked "add one
      lesson" and optimized the count while the direction drifted unexamined, until the owner corrected
      it (item 24). **Counting lessons is not the same as building the product.**

21. **[Content] Kids financial literacy — content gap closed; content-depth structural change built (2026-08-16, eighth run).**
    **Update, 2026-08-16 (eighth run this date):** executed the content-depth scoping this item's own text
    below calls "a real content-architecture change... needs its own scoping pass" — added a `why` field
    (one sentence, all 5 languages, written fresh not machine-copied) to all 21 existing blurbs, rendered
    in `ParentGuide.jsx` under a new "Why it matters" label. Full detail, including why this was done as
    one uniform migration across all three age bands rather than a single-band pilot, is in that date's
    run log entry. This closes point (b) below — do not treat content-depth scoping as still-open work; a
    future run wanting more depth here needs a fresh scoping decision (e.g. per-blurb activities), not a
    default extension of this shape. Text below is retained for the item's full history.
    Assessed 2026-08-07 after the owner asked whether kids lessons were already in the master plan —
    see `LAUNCH_PLAN.md` §2.6. **Update, 2026-08-07 (tenth run):** each of the three age bands grew from
    three blurbs to five (fifteen total, up from nine), adding the missing money-skills material —
    wants-vs-needs, earning an allowance, saving toward a goal, a first kids' bank account, checking a
    balance before spending, "pay yourself first." **Update, 2026-08-15 (eleventh run):** each band grew
    from five to seven blurbs (**21 total**), adding comparison shopping, delayed gratification, budgeting
    as a plan, sales tax, gross-vs-net pay, and what a credit score measures. This backlog item's own text
    went stale after that run — it still said "fifteen... vs. 26 adult lessons" — while `LAUNCH_PLAN.md`
    §2.6 and `LAUNCH_READINESS.md` were correctly refreshed to 21 blurbs / 40 adult lessons the same date
    (twelfth run). Corrected here to match: **21 blurbs (7 per band × 3 bands) vs. 40 adult lessons.**
    **The "grow further vs. lesson-shaped structure" question, resolved:** this was really two different
    questions wearing one label.
    (a) *Making kids content **child-facing*** — a kid-directed lesson UI the child navigates themselves,
    with its own progress/quiz flow like `LessonReader.jsx` — was already answered: §10.3 reserves this
    for the owner (COPPA/store-classification decision), and item 19 (HELD) says so explicitly. Nothing
    changes here; still owner-only, still not to be built on this item's initiative.
    (b) *Deepening the **content** itself* (richer per-topic material — more structure per entry, not
    just a longer list) while staying strictly parent-facing (rendered only in `ParentGuide.jsx`, never
    surfaced to a child) does *not* touch COPPA status — but it's a real content-architecture change (new
    fields, a new render shape), not a same-shaped addition, so it needs its own scoping pass rather than
    being decided implicitly by whichever run gets to it next.
    **Decision:** do not pursue (a) on this item's initiative — unchanged, owner-only, see item 19.
    Do not default to (b) either, absent a future run actually scoping it. See `DECISIONS.md` ("Kids
    financial-literacy content: format stays parent-facing, structural depth un-scoped") for the full
    writeup. **A parallel, narrower caution:** simply adding another blurb to the existing three-field
    format (the pattern the 2026-08-07 and 2026-08-15 updates both followed) is itself a count-shaped
    backlog item — the same failure mode the PRIORITY BLOCK's P-1 flagged for item 17/24 ("counting
    lessons is not the same as building the product"), and it has already repeated once here (nine → 15 →
    21). Nothing in `LAUNCH_PLAN.md` §4.3 or elsewhere gates on a kids-blurb *count* the way it gates on
    adult lesson count/minutes, so there is no launch-plan reason to keep growing this number by default.
    A future run picking this item should have a specific new topic or a specific structural change in
    mind, not "add one more blurb because the list has room." **Not a design decision (do NOT do this):**
    making kids material child-facing — child accounts, a kids mode, kid-directed lesson UI — changes
    COPPA classification, store privacy category, and ad eligibility. §10.3 reserves it for the owner.
18. **[Process] Instrumentation (§9.2) — call sites done 2026-08-05, real provider still open.**
    `src/lib/analytics.js` (`track()`/`EVENTS`) fires `app_opened`, `lesson_started`,
    `lesson_completed`, and `quiz_taken` (see run log entry "Wire the §9.2 minimum analytics event set").
    `paywall_viewed`/`trial_started`/`subscribed`/`canceled`/`ad_watched` have names reserved but don't
    fire — no paywall/billing/ad feature exists yet to fire them from. Events currently land in a local
    `localStorage` rolling log, not a real provider (PostHog, per the plan) — that swap needs an account
    and API key a dev-agent run can't create; see `DECISIONS.md`. What's left: create that account
    (owner action) and swap `analytics.js`'s `sink()`; item 17's D1 lesson-1-completion measurement is
    still blocked until then, since a per-device local log can't be aggregated across installs.
    **This is now the only thing gating the end of Phase 0** — both §4.3 content clauses are met (item
    17), so no amount of further content work moves the gate. Flag it to the owner in every run's output.
    **But do not read "blocked" as "nothing to do here": item 29 is the half of this item that is not
    owner-blocked** — §9.2 specifies `lesson_completed` *with duration* and `quiz_taken` *with score*,
    and neither payload carries them today. Fixing that now means the data is the right shape the day an
    account exists, instead of starting the measurement window with a known gap.
34. **✅ BUILT 2026-08-16 — the "Be the Fed Chair" policy simulator, inside lesson 35: two
    scenarios, three levers each, five languages, no score. Do not re-pick this to "extend" it.** See
    the run log.
    > **NUMBER NOTE, load-bearing: a second item also carried number 34** (the `<ol>`/`<ul>` a11y
    > item, renumbered to **40**). **Every "backlog item 34" in source code means THIS item.** In
    > run-log prose before 2026-08-16, "item 34" may mean either.
    > **Two design decisions are protected only by file-header comments** in
    > `src/content/policyScenarios.js` — read them before editing. **A third scenario must first
    > justify itself**: the two built already cover the dual mandate's two halves.

38. **✅ DONE 2026-08-16. All three sites now import `todayStr` from `src/utils/date.js`; the
    market-pipeline one was the consequential half, since `asOf` drives the staleness contract.
    Guarded by `check-data.mjs` §23.** See the run log.
    > **Known limit, written into §23's header: it catches the IDIOM, not the mistake.** A hand-composed
    > UTC date string still passes. The one legitimate UTC use is exempted by comment, not by path.

39. **✅ CLOSED 2026-08-17 as its own scoping directed — both replacements (items 46, 47) landed.
    Do not pick this again.** See the run log for the full scoping.
    > **NOT TO BE BUILT, measured rather than judged: the co-landing detector as a build gate.** Over
    > the sampled window it had a **57% false-positive rate**, and "same commit" is provably
    > unreachable in this repo anyway. Blanket "every figure is guarded" cannot be automatic either —
    > live claims and dated records are different classes, and §31 protects the second.

46. **[Process — ✅ DONE 2026-08-17 (scheduled dev-agent). Shipped as `check-data.mjs` §26, with the
    exemption vocabulary the item asked for and one design change it did not anticipate — patterns are
    expanded and checked rather than skipped, which is what catches `DECISIONS.md`'s brace-contracted
    reference to two deleted files. Closing note at the end of this item.] Every repo path
    a tracked document names must exist.**

47. **[Process — ✅ DONE 2026-08-17 (scheduled dev-agent). Shipped as `scripts/refresh-readiness.mjs`
    with three modes; the two live figures are generated and `npm test` holds them. Item 39 is closed
    with it.] Move `LAUNCH_READINESS.md`'s refresh snippets out of the document and compare their
    output to the figures the document states.**
    > **The `--write` mode is what makes the gate survivable**, and the scope did not name it. Bare
    > prints the figures, `--check` compares them and is chained into `npm test`, and **`--write`
    > rewrites them in place**. That third mode answers the objection §11b wrote down when it
    > deliberately refused to guard character counts ("a build that fails over 19 characters would be
    > turned off within a week"). **That objection is right about a hand-maintained figure and does not
    > carry to a generated one** — the fix is now `npm run readiness -- --write`, one command instead of
    > a re-derivation. §11b's coverage sentence was left alone; folding it in would have been a rewrite.
    > **Guarded surface: exactly two sentences** — the §4.3 catalog row and §10.4's character sentence,
    > the document's only figures that must equal the content *today*. ⚠️ **The negative control is the
    > one that matters:** the doc's history figures (`112,387`, `100 minutes`, "by **exactly 19
    > characters**") were verified untouched by a `--write` that did change something, because item 39's
    > scoping showed live and historical figures share sentences and no parser separates them.
    > **Item 39 is closed by this.** What it correctly ruled out (a co-landing detector as a build gate,
    > 57% false positives) stays ruled out; the reporting-line idea it left for the weekly reviewer is
    > still unbuilt and is a reviewer tool, not an `npm test` failure.

49. **[Process — ✅ DONE 2026-08-17 (owner-directed). Two of the three proposed surfaces were REJECTED
    on the measurement, the item's own ranking was backwards, and putting `README.md` under §26 turned
    up a live §10.2 blindspot violation that had been in the repo's front-door document since it was
    written.] Widen §26's surface, one form at a time.**
    > ⚠️ **Do not treat this as a coverage gap to close on reflex.** §26's whole value is that a failure
    > means something; each surface added is another exemption class to define first. **Measure the
    > dead-reference count for a surface before deciding it is worth guarding** — item 46's own filed
    > measurement was wrong in four ways, and two of the three surfaces here failed on their numbers.
    > Full figures live in `check-data.mjs` §26's header, where the next person to widen it will read them.
    > - **`README.md` — ADDED.** 31 references, **3 dead**. The only surface with live rot.
    > - **Markdown link targets — ADDED, and they catch nothing today** (3 references, 0 dead). In
    >   because coverage that depends on a formatting choice is a hole — rewriting `` `foo.js` `` as
    >   `[foo.js](foo.js)` used to walk a reference out of §26 — not because it found anything.
    > - **Un-backticked bare paths — REJECTED.** 16 references, 8 dead, all 8 *already* exempted in
    >   backticked form: +8 exemptions for 0 new finds. Also unsound — the pattern matches `Node.js` in
    >   "Requires Node.js 18+", which is English, not a file.
    > - **`reviews/*.md` — REJECTED, and the measurement proved itself mid-run:** 98 references / 6 dead
    >   on the first pass, **112 / 8** ninety minutes later after the weekly reviewer appended a section
    >   correctly describing files item 45 deleted. **A dated snapshot accrues dead paths by doing its
    >   job**, so it belongs on the history side — the same argument that keeps `AGENT_LOG.md` out.
    > **`AGENT_LOG.md` is deliberately NOT proposed**, for that reason: an append-only history *should*
    > name files that have since been deleted, and the annotation would outnumber the content. Recorded
    > so the next run does not re-derive it as an oversight.
    > **The find this item did not predict, and the reason adding a surface beat widening a pattern:**
    > reading `README.md` properly for the first time turned up **"inspired by the framework popularized
    > by Ray Dalio and other economists" in its opening sentence** — a §10.2 violation in the project's
    > front-door document, while §10.2 had been reported closed since 2026-08-01 by a check that scanned
    > `src/` and the v5 prototype, **i.e. the two places the rule was already obeyed.** Removed, and
    > `check-blindspot.mjs`'s §10.2 scan now covers `README.md` — only README, because `LAUNCH_PLAN.md`
    > and `LAUNCH_READINESS.md` name Dalio while *stating* the rule, and a check that forbids describing
    > its own rule is unusable.

41. **[A11y — ✅ DONE 2026-08-16. Fixed, guarded by a new §22 check — and the live verification of the
    fix found that the same figure was failing sighted readers too, which is the more interesting
    half. See the run log.] `Bar` is the one chart primitive with no accessible description.** See the run log.

42. **[A11y — ✅ DONE 2026-08-16 (owner-requested, same evening it was filed). Content shipped as scoped;
    two guard gaps found on the way, both closed — see the closing note and the run log.] The four `YieldCurve` figures
    are labeled by `label`, not by a description — so their accessible name is "Normal (healthy)", which
    names the curve without describing it.** See the run log.

43. **[Process — ✅ FOUND AND FIXED 2026-08-16 by item 38's guard, on its first run. Filed as its own
    item because the fix is one character and the finding is repo-wide.] `scripts/translation-review.mjs`
    was invisible to `grep` — and had been since it was written on 2026-08-11.**

44. **[Small — ✅ DONE 2026-08-17. Filed as small and "no §2.3 violation"; the second half of that
    assessment was wrong, and finding out how was the run. See the closing note.] `useMarketData` treats
    a future `asOf` as fresh, and `Sectors.jsx` destructures `ageDays` without using it.** See the run log.

45. **✅ DONE 2026-08-17 (owner-requested). Lesson content is split by language as well as by track
    — ten chunks — and the largest content chunk fell 499.27 kB → 116.84 kB. Proven equivalent before
    anything was deleted.** See the run log.
    > **One real behavior change, not a pure refactor: switching language in the picker now fetches a
    > chunk.** `lessonContent.js` survives as a node-only merged view for the checks.
    > **Deliberately not done: splitting `quizData.js`** (the largest remaining chunk) — the run log
    > records why.

48. **[Perf — ✅ DONE 2026-08-17 (owner-requested). Quiz text split per language, the same second
    axis item 45 applied to lesson bodies. The 140.88 kB shared quiz chunk is gone.]** See the run log.

50. **[Process — ✅ DONE 2026-08-17 (owner-requested). `scripts/check-payload.mjs`, wired into
    `npm test`. Closes the first concern the 2026-08-16 review's §6.6 raised.]**
    > **The gap it closes.** The per-language splits took the largest content chunk from 499.27 kB to
    > 116.84 kB and deleted a 140.88 kB shared quiz chunk — and **nothing asserted any of it.** A single
    > `import { quizData } from "../content/quizData.js"` added to a screen — the most natural line in
    > the world to write — silently restores all five languages to that chunk, and **every existing
    > check stays green, because the data is still correct. Only the bytes change.**
    > **Why structure rather than bytes.** Byte assertions need `vite build` (which `npm test` does not
    > run) and would need rewriting every time a lesson is edited. The structure that *produces* the
    > payload is stable, and each failure mode is a nameable line of code. Four rules: every promised
    > per-language module exists (derived from `TRACKS` × `LANGS`); ⛔ **no module under `src/` imports a
    > merged view** (`lessonContent.js`, `quizData.js`) — the load-bearing rule, since those views
    > statically import every language and any path into one drags the whole catalog back; per-language
    > modules are imported **only dynamically** (a static import is that same failure one language at a
    > time); and every per-language module is named by some dynamic `import()`, since a module no loader
    > reaches is a runtime `TypeError` for one language only. **All four proven by injection**, tree
    > clean and green after each.
    > **Deliberately not checked:** chunk sizes, module counts, anything needing a build. If those are
    > ever wanted they belong in a separate build-time check — this one stays fast enough for every commit.
    > **Why a fifth script rather than a section in `check-data.mjs`:** contention. Three separate edits
    > to `check-data.mjs` collided with concurrent dev-agent runs on 2026-08-16/17, twice forcing a
    > commit to be reconstructed. A standalone file has no such conflict and matches the sibling pattern.

12. **[HELD] Expo vs. Vite** (§2.1) — needs a human call; blocks store release, not the web launch. See
    `DECISIONS.md`. The dev agent must not migrate to Expo on its own initiative or deepen the web-only
    investment in a way that raises the eventual port cost beyond what's already committed.
19. **[HELD] Genuinely child-facing kids content** (§10.3, reopened 2026-08-04) — a COPPA/store-
    classification decision, not a UI one. The parent-facing framing (closed 2026-08-01) stands until the
    owner decides otherwise; do not change `ParentGuide.jsx`'s framing on this run's own initiative.

**Notes for future runs (informational — not actionable backlog items)**

- **RESOLVED 2026-08-13.** `scripts/translation-review.mjs`'s ai/human `method` field — uncommitted in
  the working tree for two days and flagged by roughly a dozen runs as an in-progress feature not to
  touch — was finished, committed, and actually used (160/160 lesson/language pairs marked
  `method: "ai"`) in an interactive session. See `DECISIONS.md` and the run log.
- **RESOLVED 2026-08-16 (owner decision).** `economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` are
  **gitignored and left on disk, untouched** — ignored, not deleted; v5's content stays in git history.
  Neither is imported by anything, and every feature in v6 has since shipped independently in `src/`;
  its one unique idea survives as **item 34**, concept only and explicitly not its code. ⛔ **Two
  standing rules outlive the resolution, because v6 is contaminated:** it carries direct Ray Dalio
  branding and quotes (§10.2, closed) and a hardcoded current date (§2.3, fixed) — **never carry
  anything over from it**, and **do not restore either file to the repo without asking the owner.**
  Consequence worth knowing: a fresh clone has no v5, so `check-blindspot.mjs`'s §10.2 scan reports
  whether it scanned v5 or found it absent rather than asserting either way.
- **OPEN — an owner decision, and the one note here that is not closed.** `main`'s reachable history
  starts at commit `2dc0264` ("Split monolithic JSX step 4a"). Roughly a dozen earlier commits (the
  initial scaffold, the original blindspot-register fixes, the Markets stale-date fix,
  `scripts/bootstrap-node.sh`, JSX-split steps 1–3, the language-Beta labeling, the data-shape
  harness) still exist as objects — `git cat-file -t` succeeds for `eda6dd0`, `ecdda70`, `5ab5c48`,
  `6feca25`, `76be081`, `053f8b2` — but are **not ancestors of `main`**. Most likely an early run's
  plumbing commit (`commit-tree`/`update-ref`, used because `git commit` hangs in this environment)
  picked up a stale parent hash. **No content is lost**: `2dc0264`'s tree already contains everything
  those steps produced. The owner's call is whether to reattach the orphans before they are
  garbage-collected, or leave them. Found 2026-08-04, unchanged since.

**Completed and pruned**

> ⛔ **The `former item N` labels below are load-bearing — never drop one to save bytes.**
> `check-backlog.mjs` builds its set of valid item numbers from every `former item N` string in this
> file, and **items 22 and 23 are cited from `src/` and `scripts/` with no other accounting anywhere in
> it** (proven by injection 2026-08-28: replacing `former item 22` fails `npm test` with 4
> dangling-citation errors). ⚠️ **A label must sit on ONE line** — the matcher requires a literal
> space, so a label wrapped as `former item` / newline / `55` does not register at all; two of them
> were wrapped that way and had been contributing nothing. Full detail for every line below is in the
> run log at the date given; this section is pointers, not history.

- **§3.0.3 glossary coverage enforced in both directions (former item 57)** — 2026-08-17.
  `check-data.mjs` §17b: every glossary-term use is either linked or listed in `deliberatelyUnlinked`
  with a reason. Its scope limit, and the control that first made it return a false zero, are on live
  item 57 above and are deliberately not duplicated here.
- **The `minutes` reading model corrected to count the whole lesson (former item 56)** — 2026-08-17.
  The field was already derived and enforced; the *formula* was wrong, omitting the title, subtitle,
  section headings and the entire end-of-lesson check — about 20% of the words on screen. §2 now
  counts all of it at 200 wpm with a catalog-wide floor, so a blind count cannot read as a pass.
  Catalog total went 120 → 144 minutes, moving §4.3's content clause further clear rather than
  reopening it. See `DECISIONS.md`.
- **`LAUNCH_PLAN.md`'s catalog figures generated, and its Phase-0 gate verdict with them (former item 55)**
  — 2026-08-17. `scripts/refresh-readiness.mjs` owns 10 figures across two documents, including §4.3's
  "is the gate met?" verdict. That verdict is why the item was P1: the plan read "the gate is not
  close" while the generated scorecard said both content clauses were already met.
- **Lesson ids renumbered to match track order (former item 22)** — 2026-08-14. money is 1-28, economy
  29-40 (was money 13-40, economy 1-12), so a new learner's first lesson displays as "Lesson 1". Done
  by script against a verified id→id table across every id-bearing surface, plus a one-time
  client-side migration (`src/lib/lessonIdMigration.js`) for already-installed users' persisted
  progress. ⚠️ **Lesson ids quoted in pre-2026-08-14 run-log entries are stale;
  `src/content/lessons.js` is the source of truth.**
- **`lessonContent.js` split per track (former item 25)** — 2026-08-14. `LessonReader-*.js` fell
  557.70 kB → 5.92 kB. This superseded the 2026-08-12 mitigation, which had only raised Vite's
  `chunkSizeWarningLimit` to quiet the warning (that override is since removed). Later split per
  language as well — live item 45. See `DECISIONS.md`.
- **Machine-translation decision reversal, owner escalation (former item 20 / backlog P-4)** —
  2026-08-11 owner decision: option (a), accept the unreviewed es/ko/zh/ja state under "(Beta)"
  labeling. `DECISIONS.md` holds the three-option writeup and the reasoning;
  `scripts/translation-review.mjs` plus its ledger make the 0%-reviewed share visible instead of
  able to drift unnoticed. ⚠️ **`translation-review.mjs` cites this entry by name in two places
  (lines 7 and 159) — the phrase "former item 20" must stay findable here.** The decision itself is
  being reopened as a question by **O-3** at the top of this backlog: it was made about a static
  corpus, and the corpus is no longer static.
- **Lesson content split out of the main bundle (former item 23)** — 2026-08-07. `lessons.js` became
  lightweight metadata plus a lazy-loaded body module; the main chunk fell 522.40 kB → 207.01 kB.
- **Blindspot-register regression checks automated (former item 16)** — 2026-08-05.
  `scripts/check-blindspot.mjs` codifies the §10.2 / §10.1 / §10.3 / §2.3 greps that every run's step 5
  had been retyping by hand. **It is not a replacement for the judgment half of step 5** — "does this
  read like advice" still needs someone reading the diff.
- **Launch-readiness scorecard (former item 15)** — 2026-08-05. `LAUNCH_READINESS.md`, where every
  gate carries the exact command that produced its status rather than a narrative claim.
- **FRED economic readings surfaced on Sector performance (former item 13)** — 2026-08-04. Each
  reading is dated individually rather than sharing the payload's `asOf`, because CPI and unemployment
  update monthly while the Treasury yields update daily.
- **Sector performance and relative strength (former item 14)** — 2026-08-04. The daily job
  (`scripts/fetch-market-data.mjs`) writes `public/data/market.json`; `Sectors.jsx` ranks eleven S&P
  sectors against SPY. The placeholder formula it shipped with was replaced by the owner's own on
  2026-08-04 — see the App summary.
- **The accessibility pass: dynamic font scaling, both mobile-responsiveness sweeps, `npm audit`** —
  2026-08-04. 103 inline `fontSize` values converted to `rem` behind a 4-step "Aa" control
  (`ecycles_font_scale`); a global `box-sizing: border-box` reset added, the app having had no
  stylesheet before, so every `width: 100%` element with its own padding was sized in `content-box`;
  swept at 375px, at 320px portrait, at 320px combined with the 130% font step to check the two
  features do not compound, and at 568×320 landscape including the first-launch modal —
  `scrollWidth === innerWidth` everywhere, a clean result rather than a skipped check. `vite` was
  bumped `^5.4.11` → `^6.4.3`, taking `npm audit` to 0 vulnerabilities.
- **Phase-color contrast (plan §3.5)** — 2026-08-04. Green and amber failed 4.5:1 as small text and
  moved to darker shades, left unchanged as borders and fills, which need only 3:1. ⚠️ **The hexes
  this entry used to quote are deliberately not restated** — the palette has moved twice since, and
  live item 63 records what a stale hex quoted here cost. `src/index.css` is the palette; read it
  there. The property is now machine-enforced on every `npm test` by §28 (AA on 108 pairs) and §28b
  (3:1 on 70 graph pairs).
- **`completedLessons` persisted, and the whole first-session flow, steps 6a–6e** — 2026-08-03/04.
  localStorage keys `ecycles_completed_lessons`, `ecycles_streak` and `ecycles_continue_pref`;
  first-open routing straight into lesson 1, a completion toast and progress-ring animation, and a
  once-a-day continue-tomorrow opt-in that records a preference and **schedules no real notification**
  — see `src/lib/useAppState.js:188` for why that is the held §2.1 platform decision and not an
  oversight.
- **The JSX split, steps 1–4d: `economic-cycles-v5.jsx` from 1,340 lines to 135** — 2026-08-02.
  Locales, then content modules, then the four per-tab components, each verified independently by the
  weekly review. Superseded wholesale by the 2026-08-04 rebuild onto `src/App.jsx`.
- **Data-shape check harness (`npm test`) and `scripts/bootstrap-node.sh`** — 2026-08-02. The harness
  catches a missing language field in about 5 seconds, with no browser and no two-minute build.
- **Quiz answer key de-skewed** — 2026-08-02 (weekly reviewer, owner-requested, out of priority
  order). Correct answers had been 12 of 13 on index 0 — tap-the-first scored 92% — and are now spread
  roughly 3/3/4/3 across the four positions. ⚠️ **Pointer corrected 2026-08-28: the header comment
  explaining the invariant lives in `src/content/quizMeta.js`, not `quizData.js`.** The answer key
  moved there in item 48's per-language split, and `quizData.js` is now a node-only merged view the
  app never imports. Read it before adding or editing a question; `npm test` warns if any one index
  ever holds more than half the answers again.
- **Stale and dated factual figures reworded** — 2026-08-02. The `~$50T credit vs ~$3T money` figures
  became figure-free "many times larger than the base money supply"; the "2+ quarters of falling GDP =
  recession" line became a rule of thumb with an NBER note; and the yield curve "has predicted EVERY
  US recession since 1955" became the correct and weaker claim — inversions have preceded every
  recession since 1955, but not every inversion is followed by one. All three across lesson bodies,
  quiz explanations and glossary entries.
- **Unused translation keys deleted** — 2026-08-03. 13 keys with zero call sites, removed from all
  five locales rather than built out, because building them would have reopened §10.1.
- **`DECISIONS.md` created** — 2026-08-03, with Expo-vs-Vite (open, owner), `.js`-not-JSON content
  modules, and localStorage-only state.
- **`README.md` refreshed to the split structure, and `check-data.mjs`'s `t.key` scan broadened to
  every component file** — 2026-08-02. The scan had been reading only `economic-cycles-v5.jsx`, so it
  covered less of the translation-key surface with every extraction.
- **Language picker "(Beta)" labeling (§3.5/§10.4)** — 2026-08-02. ⚠️ **The 2026-08-02 per-language
  volume ratios this entry used to quote are deleted rather than corrected** — they were four weeks
  stale, and a ratio without its reference is not a measurement (W-5.6). `LAUNCH_READINESS.md` §10.4
  publishes the live ones with their references.
- **Blindspot register: §10.2 Dalio de-branding and §10.3 parent-facing kids framing** — 2026-08-01,
  verified by the weekly review. **§2.3 Markets-tab stale date** — 2026-08-02. **§10.1
  investment-advice adjacency, fully closed 2026-08-02**: the "be bullish when cutting / be cautious
  when hiking" directive and lesson 10's rendered per-phase "Best investments: growth stocks / value
  stocks / …" lines were reworded to historical, descriptive framing in all five languages; the
  `disclaimer` key now renders on Home, Learn, Markets and About; and a one-time first-launch modal
  (`ecycles_seen_disclaimer`) shows it before first use. ⛔ **All of these are standing rules, not
  settled history** — check any content change against them.

## Environment note

This automated execution environment has **no Node.js in `PATH`** (confirmed 2026-08-01 — no `node`, `npm`, `nvm`, `volta`, `asdf`, or Homebrew present). **As of 2026-08-02, use `scripts/bootstrap-node.sh` instead of re-downloading Node by hand.** It caches a pinned Node v20.18.1 under `$HOME/.cache/ecycles-node` (real home directory — persists across runs, unlike the session scratchpad) and prints the runtime's `bin` directory on stdout:

```bash
BIN_DIR="$(scripts/bootstrap-node.sh)"
export PATH="$BIN_DIR:$PATH"
npm install && npm run build
```

First run on a given machine downloads (~30s); every run after that reuses the cache instantly. Never installs anything system-wide, never touches the repo.

**Measuring against a clean tree while the owner's is dirty — `git archive`, never `git checkout --`
(2026-08-18).** `npm test` runs against the *working* tree, so while the owner has an in-flight redesign
the suite can be red for reasons that have nothing to do with your change, and you cannot tell the two
apart by reading the failure. The control is a pristine copy of `HEAD`, which is read-only with respect
to the repo:

```bash
git archive HEAD | tar -x -C "$SCRATCH/head"
ln -sfn "$PWD/node_modules" "$SCRATCH/head/node_modules"     # do NOT cp -R: slow enough to time out
cd "$SCRATCH/head" && npm test
```

**⚠️ UPDATED 2026-08-30 (W-6.1, route (c)): do NOT copy the prototypes in any more.** This recipe used
to carry a third line, `cp economic-cycles-v5.jsx economic-cycles-v6.jsx "$SCRATCH/head/"`, because
`git archive` ships only tracked files and §26's doc-path check then reported **7 failures** naming
them. **§26 no longer resolves against the filesystem**, so those seven are exemptions now and the copy
is not merely unnecessary — it is actively harmful: it would make the two paths resolve in the copy and
their `path-ok` markers fail as *stale*, which is the same "control that fails for its own reasons" trap
wearing the opposite face. The `node_modules` symlink IS still load-bearing, and was also found by the
control failing rather than by reading: `check-data.mjs` reaches `src/lib/deepLink.js`, which imports
`react`, so a copy without it dies with `ERR_MODULE_NOT_FOUND` — the scripts are *not* dependency-free,
whatever their imports look like at the top. With that one line, the `HEAD` copy runs the full suite to
**exit 0**. That gives a two-sided answer: **red on the working tree and green on the `HEAD` copy means
the owner's dirt caused it; red on both means you did.**

**A `git archive` copy is not a git repo, and §26 knows.** It falls back to the filesystem walk there,
which is correct *in that copy specifically* because an archive contains precisely the tracked set —
but only while nothing untracked is copied in, which is the whole reason the `cp` line above had to go.
If you need a control that exercises §26's PRIMARY path instead, use a real `git clone -q . "$SCRATCH/gitclone"`;
it is a git repo, so it resolves against the index the way the owner's tree does. Used this run to prove
`refresh-readiness.mjs`'s failure was the owner's new third lesson track and not a regression — see
backlog item 77.

**"Has the owner's tree moved since the last run?" is now one command: `npm run owner-tree`
(2026-08-19).** Eleven consecutive runs have opened by asking this, and every one of them answered it
with `git diff --shortstat` — which cannot actually answer it, since a shortstat can coincide across
genuinely different trees (a point the eighth run of 2026-08-18 raised and then still relied on).
`scripts/owner-tree.mjs` fingerprints the working tree's full deviation from `HEAD` — the tracked patch
plus the content of every untracked file — as one sha256:

```bash
npm run owner-tree                      # OWNER-TREE <sha256>  (N tracked modified, M untracked)
npm run owner-tree -- --expect <sha256> # UNMOVED (exit 0) / MOVED (exit 1)
```

**Record the fingerprint your run observed in your run-log entry**; the next run compares with one
`--expect` and gets a real yes/no instead of a coincidence-prone stat. It **refuses to print** (exit 2)
if any untracked file is unreadable, and exits 2 rather than stack-tracing when run outside a git repo
(e.g. inside a `git archive` control copy). That refusal is the whole point and it is not theoretical:
the first, hand-rolled version of this check on 2026-08-19 piped `git status --porcelain` through
`sed 's/^?? //'`, which leaves git's quoting attached to the 50+ `UIUX/` paths that contain spaces, so
**every** `shasum` failed on a nonexistent filename — and the pipeline still emitted a confident 64-hex
digest, of an empty stream. Hence `-z` internally, and hence the hard failure.

**⚠️ `MOVED` does not mean "the owner's redesign landed" — check WHICH file moved before deciding
anything (2026-08-19).** The fingerprint covers the whole working-tree deviation, so anything the
owner is *not* responsible for is inside it too. The live case: `public/data/market.json` is rewritten
by the `economics-app-market-data` job **every weekday after close**, i.e. *underneath a running
session*. This date's fourth run read `UNMOVED 28365ead…` at commit time and `MOVED fd6fd235…` an hour
later, **with the same 26/57 file counts** — the only difference was `asOf: 2026-08-18 → 2026-08-19`
and 62 lines of numbers. A run that takes `MOVED` at face value concludes the owner's tree landed and
picks the five `LAUNCH_PLAN.md` items, which are still blocked. **On `MOVED`, run `git status --short`
and diff the named files first**; a move confined to `market.json` is the daily job, not the owner.
That particular instance is now closed — `market.json` was committed on its own the same day (see the
run log), so it has left the deviation set — but the class has not: any file a sibling automated task
touches will do this again.

**A piped `git show ... | wc -l` can silently lie here — write the blob to a file and measure the file
(2026-08-18).** Several compound Bash commands this run died with **exit 138** partway through, and the
damage is not that they failed: it is that they printed *plausible* partial output first. The same
measurement, run twice, gave `glossary.js` at `HEAD` as **72 lines** and then **235**; a `for` loop over
four commits reported 321/440/263/235 for a file that is 72 lines. Nothing errored, and each individual
number looked like a real answer. **What is trustworthy:**

```bash
git rev-parse HEAD:src/content/glossary.js       # blob id — authoritative, no content streamed
git diff --stat <revA> <revB> -- <path>          # empty output == identical, no pipe involved
git cat-file blob HEAD:<path> > "$SCRATCH/f"     # then wc -l / diff the FILE, not a pipe
```

Two blob ids being equal settled in one command what four rounds of `git show | wc -l` had contradicted
themselves about. **The reason this is in the Environment note and not just a run-log line is that it
defeats step 3.5 exactly the way the dark-mode DOM scan did**: a truncated pipe returns a clean-looking
number, so a run that "measured" something can be confidently wrong. It was caught only because the
control (diff the saved copy against the commit it was taken from, expect *only* the known addition)
came back with 438 unexplained lines instead of 0. **Carry the control; when it fails, suspect the
instrument before the finding.**


**Browser visual verification — now possible, use this instead of assuming it can't be done.**
Every run-log entry since the JSX split began has a line like "did not visually verify — `preview_start`
can't spawn `npm run dev` because its process spawn doesn't see the bootstrapped Node in `PATH`." That
limitation is real (the browser-preview tool's process spawn uses a different, minimal `PATH` than the
shell `Bash` tool, so the `scripts/bootstrap-node.sh`-provided `node`/`npm` are invisible to it), but it
only blocks the **dev server** (`npm run dev`, which needs `node` to stay running as a process). A static
build does not have that problem, because `/usr/bin/python3` **is** on the browser-preview tool's `PATH`
(confirmed 2026-08-04) even though `node`/`npm` are not. Workaround, verified working end-to-end
2026-08-04:

```bash
BIN_DIR="$(scripts/bootstrap-node.sh)"
export PATH="$BIN_DIR:$PATH"
npm run build                                    # produces dist/
(cd dist && nohup /usr/bin/python3 -m http.server 8763 --bind 127.0.0.1 \
  > /tmp/ecycles-static-preview.log 2>&1 & disown)
```

Then call the browser-preview tool's start action with a plain `url` (`http://127.0.0.1:8763`) rather
than a `name` — passing `url` opens a browser tab directly at that address and does **not** go through
`.claude/launch.json` or spawn any command, so the `PATH`-visibility problem never comes up. No changes
to `.claude/launch.json` are needed or were made; the existing `npm run dev` entry there is unaffected
and still won't work in this sandbox.

**This works in unattended scheduled runs, not just interactive sessions — confirmed twice, and do not
re-derive it as impossible.** A 2026-08-15 scheduled dev-agent run (tenth run that date) tested the
then-standing "`preview_start` is disabled for scheduled tasks" assumption instead of inheriting it, found
it false, and did the first live keyboard/DOM verification by an automated run. The 2026-08-16 **weekly
review run** independently re-confirmed it: `npm run build`, `python3 -m http.server 8791` against `dist/`,
`preview_start` with a plain `url` (returned `navOk: true`), then drove the live app through
`javascript_tool` — dismissed the first-launch modal, opened Reference → Glossary, opened a term-detail
view, toggled its bookmark and read `localStorage` back, and exercised the no-results empty state.
Nevertheless the 2026-08-16 ninth and tenth runs *both* asserted "`preview_start` is unavailable to
unattended scheduled runs," deferred verification to "a future interactive session," and shipped six UI
features unverified. **That assertion is false. If a UI change needs verification, try the technique above
and report the actual error if it fails — do not assert the limit from memory.** See the 2026-08-16
weekly review's W-1.

**What this verified in practice (2026-08-04, interactive session, not an automated dev-agent run)**: the
built app boots, first-open routing lands on Lesson 1 with the first-launch disclaimer modal, the `More`
sub-nav and kids age-selector switch panels correctly with the right live `aria-selected`/`aria-controls`/
`aria-labelledby` wiring (checked via the browser tool's JS-eval action, not just eyeballed), and the
quiz flow renders the WCAG-contrast-fixed green correct-answer text. This is the first time any run —
automated or interactive — has gotten a real rendered/DOM-level check in this sandbox, as opposed to
build-success-plus-code-review. **Future dev-agent runs should use this static-build-plus-python-server
technique for visual verification instead of writing another "could not visually verify" caveat.** The
server is not persistent infrastructure — it's started fresh, points at whatever `dist/` was just built,
and doesn't need to be torn down deliberately (it's a plain background process against a throwaway port,
not something committed or relied on between runs).

**`read_page`'s accessibility tree shows `aria-label` names but NOT `aria-labelledby` names — and
every `<section>` prints as `region` whether or not it is named (2026-08-20).** Two separate traps in
one instrument, both found while verifying backlog item 82, and both of the "returns a clean-looking
answer that means nothing" family this section keeps warning about.

- **A bare `<section>` still prints as `region`.** Stripping `aria-labelledby` from all three Learn
  track sections in the live DOM left the tree **unchanged**. So `region` appearing in `read_page` is
  no evidence that a landmark is named, and a run that "verifies" a landmark fix that way has verified
  nothing.
- **`aria-labelledby` names do not print.** Calibrated rather than assumed: injecting
  `aria-label="ZZPROBE"` onto a section printed `region "ZZPROBE"`, so the tool does compute names —
  but a section named via `aria-labelledby` printed as a bare `region`. The check that this is the
  tool and not the app: `App.jsx`'s `tabpanel aria-labelledby={`tab-${tab}`}`, verified correct by
  earlier runs, **also** prints unnamed.

**So for any `aria-labelledby` work, verify at the DOM level** — that the attribute is present, that
`document.getElementById(...)` resolves it, and that the target carries the expected text — and say in
the run log that the a11y-tree instrument could not confirm it. Do not report "confirmed in the
accessibility tree" for a name this tool cannot render.

**If you measure geometry, resize the viewport first — `getBoundingClientRect()` returns zero-width
boxes otherwise (2026-08-17).** The `Viewport: 0x0` condition described below is not only a `read_page`
/screenshot problem: it makes **layout measurement silently meaningless** while everything else keeps
working. On a fresh `preview_start`, `window.innerWidth` and `document.body`'s width both read **0**,
so every `getBoundingClientRect().width` is 0 or near-0 — and nothing errors, so a run that measures an
element's shape gets plausible-looking JSON that means nothing. Clicks, `innerText`, `aria-*` and
`getComputedStyle` are all unaffected, which is exactly why this is easy to miss. **Fix: call the
browser tool's resize action with the `mobile` preset (375x812) before measuring**; widths become real
immediately (confirmed this run — the same element went from `w: 0` to `w: 309`). Sanity-check
`window.innerWidth > 0` before believing any measurement.

**Browser-tool click/screenshot unreliability, seen across multiple runs (2026-08-04 through 2026-08-07)
— when this happens, stop trusting `computer` and drive the DOM directly.** Several runs have hit the
`computer` tool's screenshot action returning a blank/black frame, and `read_page` reporting
`Viewport: 0x0` even though the page genuinely has content at a real size (confirmed via
`window.innerWidth`/`innerHeight` in `javascript_tool`). When that happens, coordinate-based `computer`
clicks land on the wrong element — the fifteenth run (2026-08-07) accidentally answered a quiz question
wrong this way before catching it via `aria-checked` inspection. **The reliable fallback**: do everything
through `javascript_tool` — find the target element via `querySelectorAll`/`textContent` matching, call
`.click()` on it directly (this does work; React's synthetic event system does receive a real DOM
`click()` dispatch), and confirm the result by re-reading `document.querySelector('main').innerText` or
an `aria-*` attribute afterward, **not** by the immediate return value of the click call — a real click's
effect can take one extra tool round-trip to show up, so checking too early reads as "nothing happened"
even when the click worked. For a native `<select>`, plain `el.value = "x"` does not notify React; use
`Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(el, "x")` followed by
`el.dispatchEvent(new Event("change", {bubbles: true}))`.

**The `computer` tool's `key` action (real Enter/Space keypresses) does not reliably activate elements in
this sandbox — confirmed 2026-08-18, and this is a tooling gap, not an app bug. Check it this way before
concluding either.** Sent a real `Return` keypress via `computer` at a focused `<div role="button"
tabIndex={0}>` (a Glossary term row, whose `onClick`/`onKeyDown` are both explicit React handlers) and
separately at a focused native `<button>` (TermDetail's "Back") — **neither activated**, confirmed by a
screenshot showing the pre-press screen unchanged. Before concluding the app doesn't handle keyboard
activation, dispatch a **fully-specified synthetic event** instead: `new KeyboardEvent("keydown", {key:
"Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true})` via
`element.dispatchEvent(...)` in `javascript_tool`. On the custom `role="button"` div this **did** fire
the app's own `onKeyDown` handler (the state change showed up one round-trip later, same timing note as
above) — proving the app's keyboard handling is correct and the gap is specifically in how `computer`'s
key action reaches the page here. A native `<button>`'s Enter-activates-click is a browser default action
tied to a *trusted* event, which no `dispatchEvent` call (synthetic, however fully-specified) can
trigger — that one has no app-level logic to verify at all, so don't spend a round-trip trying to
`dispatchEvent` an Enter into a native button; use `.click()` directly, which is equivalent for
verification purposes since the app cannot observe the difference. **Net rule: for a custom interactive
element's keyboard handling specifically, verify with a fully-specified `dispatchEvent`, not `computer`'s
`key` action; for anything else, `javascript_tool`'s `.click()` remains the reliable path already
documented above.**

**Two harness facts about driving the sweep, both learned the expensive way 2026-08-28 (items
135/124).**

- **FRONT THE TAB BEFORE ANY TIMED LOOP — a hidden preview pane throttles `setTimeout` to ~1s.** A
  loop over 13 lessons with a 320ms wait between them timed out at 30s, twice, and the tool reported
  "the Browser pane is currently hidden... the pane may be stuck". It was not stuck: the page was
  alive and had reached lesson 37. Background tabs clamp timers, so every 250-320ms wait silently
  became a second. `tabs_select` on the tab first, then batch 4-5 navigations per call, and the same
  loop finishes well inside the limit. **A timeout here reads exactly like a hang and is not one.**
- **You cannot plant a defect by writing an inline style onto a REAL React component's element — it
  reverts, and it reverts silently.** Setting `bar.style.height` (even with `!important`) on
  `AsymmetryChart`'s bar read back unchanged one call later, because React owns `element.style` and
  rewrites it on the next commit. Worse, *clearing* one — `el.style.height = ""` — does not restore
  the app's value, it removes React's own, so the "restore" leaves a different defect behind. **Two
  consequences:** plant into a SYNTHETIC element carrying the same hooks (the selftest's own
  technique) rather than into a live component, and **restore by reloading the page**, never by
  clearing the property. A live-DOM plant that you cannot cleanly undo is a plant you must not leave
  the session holding — reload and re-measure zero before reporting anything clean.

**The live accessibility sweep is a checked-in file now — `scripts/a11y-sweep.js` (2026-08-25, item
105). Do not re-derive it, and do not hand-roll a one-off DOM scan.** Every section of
`check-data.mjs` reads source text, so the whole class of *composition* defects — where every
attribute is individually correct and the browser's computed tree is still wrong — is invisible to
`npm test`. That class is not hypothetical: it is what items 102 and 103 were. Load it the way it was
verified, which also proves the checked-in file is the thing that ran rather than a retyped copy:

```bash
cp scripts/a11y-sweep.js dist/            # dist/ is gitignored; the static server already serves it
```
```js
// then, in javascript_tool, one call each:
fetch('/a11y-sweep.js').then(r => r.text()).then(src => eval(src))
A11ySweep.selftest()   // RUN THIS FIRST — see below
A11ySweep.run()
```

**`A11ySweep.selftest()` is not optional, and it is the reason this file exists rather than a snippet
in a run-log entry.** It plants one known defect per probe, asserts each probe *finds* its plant, then
removes the plants and confirms they are gone. A sweep whose selftest has not passed **this session**
proves nothing — step 3.5's "carry a control", encoded into the instrument instead of left to the
operator to remember. It has already earned this twice on its first day: it caught a broken
expectation in its own `smallTargets` control (a planted `10px` button renders **16x10**, because UA
padding and min-content width beat the declared width — so a control keyed to exact geometry fails for
its *own* reasons), and breaking the layout gate on purpose exposed that `check-data.mjs` §43 printed
its reassuring summary line **alongside its own failure**.

**The four ways this harness produces a lying zero — all measured. The sweep itself encodes 1-3;
4 is the operator's and no script can catch it, which is why it is written out here:**
1. **Layout is not live.** On a fresh `preview_start`, `innerWidth` and every `getBoundingClientRect()`
   read **0**, so geometry probes return zero findings because nothing has a size. **Taking a
   screenshot forces layout** — that is the fix, and the sweep hard-gates on it and prints `REFUSED`
   rather than a clean-looking report.
2. **Focus events never fire.** `document.hasFocus()` is `false` and `visibilityState` is `"hidden"` in
   this pane **even when the tab is fronted and the page is demonstrably rendering**. Measured with a
   native listener as the control: a real `focus` listener on a real button recorded **zero** events
   across separate calls while `document.activeElement` was correct throughout. **So
   `activeElement` assertions are trustworthy here and anything built on focus/blur EVENTS is not.**
3. **Reading in the same call that clicked.** React commits asynchronously; a same-call read returns
   the previous render. Click in one call, read in the next.
4. **The browser is running the PREVIOUS build.** Added 2026-08-25 after it produced one false
   negative. `python3 -m http.server` serves `index.html` with a `Last-Modified` the browser is happy
   to reuse, so a rebuild changes the hashed asset name while the page keeps loading the old one — a
   post-change check then measures pre-change markup and reports the fix missing (or, worse, reports
   a pre-existing defect absent). Navigating with `force: true` does **not** clear it; `?cb=N` on
   `index.html` does. **Read the bundle name back before trusting any live result:**
   `[...document.querySelectorAll("script[src]")].map(s => s.src)` must match the filename `npm run
   build` just printed.

**A correction worth carrying, because item 105 specified the opposite.** The item asked for the gate
`document.hasFocus() && document.visibilityState === "visible"`. Both are permanently false in this
pane (see 2 above), so that gate would have **refused to report anything, forever** — the same
silent-zero failure wearing the costume of a safety check. The implemented gate is **per-capability**:
hard-gate on live layout, which is achievable and provable, and mark only the focus-event-dependent
probe `UNAVAILABLE`. A probe that scanned nothing reports `VACUOUS`, never `ok`.

**Reporting convention for run-log entries.** Quote the verdict line plus the two numbers that make a
zero meaningful: `selftest PASS (8/8 controls fired, plantsRemoved true)` and, per screen, `N
finding(s); V vacuous; U unavailable`. A bare "no accessibility issues found" is not a result.

## Run log

### 2026-09-01 (scheduled dev-agent, backlog item 159) — the coverage sweep and the chip row were blind in the same place, so each confirmed the other, and nine glossary terms sat on screen with nothing to tap

**Pick, and why it is legitimate under W-6.2 rule 1.** Item 159 is a residual, but not of the
previous run — the last run was a W-5.3 archiving pass and the two before it picked from
`LAUNCH_PLAN.md` §3. Item 159 was filed three runs ago and its "the next run must not pick this by
default" clause bound the run that immediately followed it, which took something else. No residual
chain. It is also the only open non-parked item with a **proven live instance**; the rest of the
open list is `Downstream of O-1` or `Honest priority: low`.

**Premise re-measured before any edit, with controls (step 3.5) — and the headline was wrong.**
Item 159 claims *"every content instrument and every content pass sweeps `sections` and skips
`takeaway`/`thinkAbout`"*. One grep refutes it: `translation-review.mjs`, `translation-completeness.mjs`,
`refresh-readiness.mjs`, `jargon-candidates.mjs` and four separate corpus walks inside
`check-data.mjs` all name both fields today. **And the failure the item was filed from is not a
field-coverage failure at all** — `check-blindspot.mjs` greps whole files line by line, so §10.1 was
never field-scoped; lesson 38's takeaway survived four weeks because no *pattern* matched it. Had the
premise been taken on report, this run would have widened corpora that were already wide and left the
actual hole open.

**What the measurement did find.** Exactly one instrument was field-blind — §17b's `mentionedIn`,
the §3.0.3 coverage sweep — and `GlossaryTerms` rendered under sections only, so **the instrument and
the UI were blind in the same place and confirmed each other**. Sweeping the closing pair with §17b's
own matcher: **48** glossary-term uses live in `takeaway`/`thinkAbout` across the 44 lessons, **39**
already chipped from a section, and **9 accounted for by nothing** — GDP + Debt-to-GDP Ratio on 33,
Deflation + Credit on 34, QE on 35, Interest Rate on 38 and on 9, Emergency Fund on 8, Stock on 11.
§17b printed `0 unexplained` the whole time, over a corpus that never contained them. The same
"correct and blind" shape the 2026-08-30 income-types run recorded.

**Controls carried, because a sweep that returns nothing looks exactly like a clean result.**
(a) positive — the matcher must find `Credit` in lesson 30's takeaway: **true**; (b) negative — it
must not find `Zzyzx` there: **false**; (c) the tail corpus must be non-empty for all 44 lessons:
**0 empty**. All three fired as expected before any number above was believed.

**Three sub-premises the controls caught and corrected.** The sweep called `Deflation` tail-only on
34, `Interest Rate` tail-only on 38 and `Stock` tail-only on 11 while a plain substring search found
all three in section bodies. Printing the contexts settled it and the instrument was right every
time: 34's body says **"deflationary"** (an adjective the anchored matcher correctly refuses for the
noun), and 38's and 11's only body occurrences are inside the cross-references *“Interest Rates”* and
*“Stocks, Bonds & Diversification”*, which item 84's rule strips because a pointer to another lesson
is not a use of the term. **Three chances to file a false "the instrument is broken" note, and the
contexts are why none was filed.**

**Why chips and not exemptions — the disposition was forced by the data, not chosen.**
`deliberatelyUnlinked` admits exactly two reasons, `defined-here` and `other-sense`. Not one of the
nine is either: each is the glossary's own sense, used without definition, in the box that closes the
lesson. Excluding them would have been an exemption for a defect. So the fix had to be the missing
render surface.

**Shipped.**
- `src/content/lessonTerms.js` — exports `TAIL`, a section key standing for the closing pair, with
  the nine chips on seven lessons and curation rule 5 written down. Rules 1-4 apply to it unchanged;
  rule 3's "first use" ordering holds for free, because JS iterates integer-like keys before string
  ones, so the tail is always last.
- `src/screens/LessonReader.jsx` — one `<GlossaryTerms>` row after the takeaway/reflection pair.
- `src/components/GlossaryTerms.jsx` + five locales — an optional `label` prop and
  `lessonTermsClosingLabel`, because the shared caption reads *"Terms in this section"* and two Notes
  are not a section. The four non-English strings are machine translation like the rest of the app
  (O-3, unchanged and now one string larger).
- `scripts/check-data.mjs` — §17 validates `TAIL` entries against the closing pair's English text
  (rules 3 and 4 unchanged); §17b's corpus is sections **plus** the pair; two new guards.
- `DECISIONS.md` — an `Update, 2026-09-01` bullet on the in-lesson-glossary entry, whose
  *"rendered as a chip row under each tagged section"* was true when written and is now partial. The
  original text is left verbatim per the entry's own convention.

**Verification, and every number here is reproducible by re-running only these commands.**
`npm test` exits **0** (0 failures, the standing floor-budget warning). `npm run build` succeeds in
1.34s. §17b's coverage line moved **136 → 145 uses swept, 95 → 104 chips, 30 → 31 lessons, 0
unexplained on both sides** — the baseline half measured by `git stash push -- src scripts`, running
`npm test`, and popping, not read off the log. In the built bundle
(`dist/assets/LessonReader-D0dsTNkE.js`) the row is present in the right DOM position —
`jsx(G,{tone:"ok",label:o.keyTakeaway…}),jsx(G,{tone:"accent",label:o.tryThinking…}),jsx(de,{terms:ce(s.id,T),t:o,lang:n,label:o.lessonTermsClosingLabel})`
— and all five closing labels shipped. **No live DOM verification was possible: a dev server cannot
be started from an unattended scheduled run, so the render claim rests on the built bundle and the
call-site guard, not on a screenshot.** Stated because the difference matters.

**Three plants, each restored from a scratchpad copy and diffed byte-identical afterwards (never
`git checkout --`).** (1) Delete the `TAIL` row from `LessonReader` → the new render guard fails:
*"LessonReader must render `<GlossaryTerms>` for `termsForSection(lesson.id, TAIL)`"*. (2) Drop
lesson 33's two `TAIL` chips while the terms stay on screen → §17b fails twice with the §3.0.3
message naming GDP and Debt-to-GDP Ratio. (3) Revert `mentionedIn` to sections-only — the exact old
behavior → the new corpus probe fails. **Plant 3 is the one that matters:** without it, a future
edit could quietly restore the blindness and the suite would go on printing `0 unexplained`.

**Adversarial self-check (step 5) — run, and it found nothing that required a change.**
*Blindspot register:* no prose was added or reworded anywhere; the chips point at glossary entries
that already shipped. §10.1 — no advice-adjacent language, and `check-blindspot` passes. §10.2 —
lesson 38's `TAIL` chip is `Interest Rate`; the Buffett quotation in its `thinkAbout` is **untouched
and unendorsed**, and item 158 remains the owner's open question. §10.3 — untouched. Markets
stale-data rule — no dates or figures in any rendered string (the `2026-09-01` in the new comments is
a source-comment measurement date, the file's existing convention).
*DECISIONS.md conflict:* none — localStorage-only state, `.js`-not-JSON content and Vite-not-Expo are
all untouched, and the one entry this change makes partial is amended in the same commit rather than
left to rot.
*Already-done item:* item 28 built the chip row, item 57 built §17b, items 60/64 curated chips. This
undoes none of them; it extends a corpus that provably never contained these nine, which the
136 → 145 delta measured on HEAD is the evidence for.
*My own verification claim:* an independent reviewer re-running only `npm test`, `npm run build` and
the stash/pop baseline gets these exact figures; the three plants are re-runnable from the
descriptions above.
*W-6.2 rule 3 — the learner-visible failure, in one sentence:* a learner reading lesson 33 met
**"the US debt-to-GDP ratio"** in its reflection prompt, and lesson 35's takeaway named **QE** two
lessons before the lesson that teaches it, with no chip to tap and no way to the definition without
leaving the reader — which is precisely what §3.0.3 exists to prevent.
*W-6.3 — the instrument-to-app ratio, quoted and re-measured:* W-6.0 recorded `scripts/` at 15,480
lines against 6,589 for the app. This change is **+63 net lines in `src/` and +54 in `scripts/`** —
the first pick in a while that puts more into the app than into the instruments, and the instrument
half is a widened field list plus two guards rather than a new section.

**Next run should pick from the launch plan or the owner-facing block, not from this entry.** The
residual noticed here is filed as a note under item 159 (W-6.2 rule 2) and measures **zero live
instances**; it is explicitly not queued. **O-1 remains the entire critical path — 44 lessons, five
languages, 160 minutes of content, and zero people have ever opened this app.**

### 2026-09-01 (scheduled dev-agent, W-5.3 archiving pass on the measured trigger) — the archiving instrument reported 101.3 runs of headroom where the honest figure was 6.6, and the reason is that archiving lowers the mean it projects from

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The last two runs both picked content
from `LAUNCH_PLAN.md` §3, so there is no residual streak to break. The previous run flagged an
archiving pass as due and did not take it, quoting **"15.6 runs of headroom"** to the fail budget;
`npm test` at the start of this run quoted **101.3 runs** to the warn budget. **Both figures are
wrong, and re-measuring them is what turned a deferrable housekeeping item into this run's pick.**

**Premise re-measured before any edit, with a control (step 3.5) — and the disposition changed.**
Run-log size read off `git show <rev>:AGENT_LOG.md` for the last 14 commits, sectioned the same way
the script sections it:

| measure | value |
|---|---|
| run log at `736db7c` | **266,511 b** (warn 250,000 / fail 350,000) |
| growth the script reports | **+680 b/commit** → 101.3 runs of headroom |
| growth actually written per run | **+10,481 b** over 12 of 15 intervals → **6.6 runs** |
| the difference | one archiving commit at **-115,573 b**, and two commits that touched the file but not the run log |

**Control on the instrument:** my shell measurement independently reproduced the script's own `+680`
figure before disagreeing with what it derives from it — so the two are measuring the same series,
and the disagreement is about the projection, not about the data. A second control: the fallback
branch was exercised on synthetic all-negative and all-zero windows, which must report "no growth at
the sampled rate" rather than infinite room.

**At the hard fail budget `npm test` exits 1 and no run can commit anything** — including every
content run. That is the learner-visible failure behind an item that looks like filing (W-6.2 rule
3): the app stops improving, and the last instrument anyone would consult says there are a hundred
runs of room.

**Shipped, half one — the pass.** Ten `2026-08-29` entries, **85,449 b**, moved verbatim into
`AGENT_LOG.archive.md` under `## Archived 2026-08-29`. Run log **266,511 → 181,070 b** (72.4% of
warn, clear); file **576,464 → 491,023 b**. The day was one contiguous region running to EOF, as the
cut plan said. **Entries were reversed into ascending order** to match the archive's convention —
verified, not assumed: the ten entry headlines in file order are the exact reverse of
`git log --reverse` for 2026-08-29, and the archive's existing 2026-08-28 block matches its own
commit order the same way.

**Verification of the pass, which is the part `npm test` cannot do.** W-5.3's own note says the suite
cannot detect archive loss — deleting a whole entry from the archive still gives 0 failures. So:
- **CONTAINMENT 10/10** — every moved entry present byte-verbatim in the archive.
- **Negative control:** a corrupted copy of a moved entry is **not** found (must be false — it was).
- **Positive control:** deleting one entry from a copy of the archive makes the same check fail, so
  the check can see a loss (must be true — it was).
- **Accounting:** the archive grew 84,357 chars against 84,314 chars of moved entries — the 43-char
  remainder is exactly the new heading and the inter-entry separators.
- **Untouched:** everything above the cut is byte-identical to `HEAD`, including the whole backlog —
  so W-5.3's clauses were not reworded, which the rule forbids a run from doing.
- **And an improvement to W-5.3's recipe:** it prescribes checking against "a pre-cut copy", which I
  first did from a scratchpad file. That proves the pass only to its author. **`git show
  HEAD:AGENT_LOG.md` is the pre-cut copy**, so the whole proof was re-run from the repo and is
  reproducible by a reviewer who was not here. That is the form it is written up in.

**Shipped, half two — the estimator, because the pass alone would have left the next run reading the
same false number.** `scripts/check-log-size.mjs` now projects runs-left from the **writing rate**
(positive intervals only), prints the net rate beside it, and names which one the projection uses.
Same window, after: `run log +680 b/commit net; writing +10,481 b over 12 of 15 interval(s) — the
runs-left figures below use THIS` → **6.6 run(s)**. The floor's `-Infinity run(s) of writing to come
back out` now reads **27.4**. **+15 lines, no new check, no new script** — W-6.3's ratio is quoted
below and this change does not move it.

**The defect is self-concealing, and that is why two runs looked straight at it.** Performing an
archiving pass injects a large negative into the sampled window, which lowers the mean, which makes
the instrument report *more* headroom. **The remedy makes the next application of the remedy look
unnecessary.** Filed as a correction under item 121 rather than as a new numbered item (W-6.2 rule 2).

**Adversarial self-check (step 5).**
- **Blindspot register: clean, and the one thing worth naming.** No teaching copy was touched at all —
  the diff is two log files and one script. No Dalio/quote framing, no §10.1 advice-adjacent language,
  no kids framing. I did add the literal date `2026-09-01` to a code comment and to log prose; §2.3's
  guard scans the 26 teaching-copy modules for live-looking figures and passed, and a dated
  measurement record is the documented exception the last several runs have relied on.
- **DECISIONS.md conflict: none.** Nothing here touches localStorage-only state, `.js`-not-JSON
  content modules, or Vite-not-Expo. W-5.3's standing prohibition — a run must not reword the
  archiving clauses — was checked by measurement rather than by memory: the byte-identity control
  above covers the entire backlog section.
- **Not a redo, and this check earned its keep.** Grepping the log and archive for prior treatment of
  the growth rate (control: 22 hits for `check-log-size`, so the grep works) surfaced item 121's own
  **+9,170 b/commit** from 2026-08-28. That figure was measured in a window with no archiving commit
  in it, so **it was correct when written** — this is drift into a defect, not an error at the time,
  and the entry says so. The same grep surfaced the extension's positive control, which plants
  *uniform* `+1,000 b/commit` growth: in an all-positive window the net and writing means are the
  same number, so **that plant passes identically before and after this fix.** A control built from a
  clean synthetic series cannot catch a defect whose trigger is a mixed one — the plant needed a
  negative in it.
- **My own verification claim, stated exactly.** `npm test` (0 failures, 1 warning — the floor),
  `npm run build` (✓ 1.04s), the containment proof, both its controls and the fallback-branch control
  are **all reproducible from this commit** by an independent reviewer, using `git show
  HEAD~1:AGENT_LOG.md` as the pre-cut copy. Nothing in this entry rests on a scratchpad file.

**The floor is still the owner's and this run made it slightly worse: 309,953 -> 313,910 b against
a 250,000 b budget (item 115).** Archiving cannot move it — only a backlog compression pass can — and
the notes this run filed under W-5.3 and item 121 are **3,957 b** of it. The corrected instrument
prices the overage at **29.3 runs** of writing to come back out, which is the first time that line
has printed a finite number rather than -Infinity.

**Top item for the next run.** Nothing housekeeping is due — the run-log budget is clear for ~6 runs
and the trigger will now say so truthfully. **The next run should go back to learner-visible work
from `LAUNCH_PLAN.md`**, where the last two runs were; §3.1.1 and §3.4 are the least-examined
subsections of §3 by the reference count the 2026-08-31 run built. **Item 159** (every content
instrument sweeps `sections` and skips `takeaway`/`thinkAbout`, with one proven live instance) is the
strongest content-QA candidate, but it is filed-not-queued and must not be picked by default.

**Owner tree at end of run:** the owner's untracked `UIUX/` only (51 files), untouched, as in the
previous eleven runs. `HEAD` was re-checked before writing and had not moved.
**O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content, and zero
people have ever opened this app. **O-3** unchanged: no translated prose was added or altered.

### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.3) — the app has told every learner "Remind me tomorrow", in five languages, on the first lesson they ever finish, since 2026-08-03; it has never sent a notification and cannot

**Pick, and why it is not the previous run's residual (W-6.2 rule 1).** The last run audited §3.0.6
and **filed nothing**, so there was no residual to inherit. With all seven §3.0 clauses now audited
(that stream is exhausted), this run counted references to the *other* §3 subsections the same way:

| subsection | log | archive | scripts |
|---|---|---|---|
| §3.1.1 | 0 | 21 | 4 |
| §3.2 | 9 | 14 | 6 |
| **§3.3** | **1** | **8** | **0** |
| §3.4 | 0 | 28 | 4 |
| §3.5 | 8 | 4 | 1 |

**§3.3 (Habit mechanics) is the least-examined subsection of §3, has zero references in any check,
and is the only subsection of §3 carrying no status annotation** — §3.2 and §3.4 both have one. That
missing status line is not a coincidence; it is the mechanism.

**Premise measured before any edit, with controls (step 3.5).** §3.3 names five mechanics. Four are
built — streak chip and both progress bars (`Learn.jsx`), the derived per-lesson minutes on the path,
the resume card and the reader, and immediate per-question quiz feedback on both quiz surfaces. The
fifth, the **opt-in daily reminder**, is where the defect is.

1. **No notification machinery exists anywhere.** `grep -rniE
   'Notification|serviceWorker|push(Manager|Subscription)|registerSW|setTimeout|scheduler'` over
   `src` minus `content` returns **five hits, none of them a notification**: a 1,700 ms celebration
   timer, two comments *saying* nothing is scheduled, and two references to the Leitner box
   *scheduler*. `public/` holds `data/` and `icon.svg` — **no manifest, no service worker**.
   **Control: the same grep shape for `localStorage` returns 11 hits**, so the zero is a real zero
   and not a dead instrument.
2. **The button promises one anyway, in five languages.** `continueTomorrowCta` read **"Remind me
   tomorrow"** / *"Recuérdamelo mañana"* / **"내일 알림 받기"** / **"明天提醒我"** /
   *"明日リマインドする"*. **`ko` and `zh` do not say "remind" — they say *notify me*.** Accepting
   confirms *"Got it — see you tomorrow!"*
3. **It is reachable, and on the highest-traffic screen in the product.** `handleComplete`
   (`LessonReader.jsx:252`) shows it on the **first lesson completed each day** — for a new learner,
   the first lesson they ever finish. That is the exact screen §4.3's Phase-0 completion gate is
   about.
4. **Shipped 2026-08-03** by the run that built step 6e (`AGENT_LOG.archive.md:1128`, "a primary
   '🔔 Remind me tomorrow' button"). **28 days.**

**⚠️ THE REAL FINDING, and it is a correction to a deliberate decision rather than a gap nobody
noticed.** The 2026-08-17 owner-directed backlog refill **measured this exact clause and chose not to
file it**: *"It does not exist — but `src/lib/useAppState.js:188` already says so in a comment… The
code is already honest; filing an item would just restate it. Owner-blocked, not backlog work."*
**That bullet checked the comment and concluded the UI was fine.** Both of its conclusions are right
about one surface and wrong about the other — "already honest" is true of the comment and false of
the button, and "owner-blocked" is true of the *reminder feature* and false of the *copy*, because
rewording a button needs no platform decision. **A developer-facing comment is not evidence about the
learner-facing surface it sits above** — the same proxy failure as item 108's, §28c's invisible focus
ring, and the VIX bands ("checked whether the numbers are right, never whether they are presented as
definitions"). **The refill bullet is corrected in place in the backlog above**; it stays where it is
because the reasoning is the durable part.

**What shipped — 5 strings, plus the two places that would let it regress.**
- `continueTomorrowCta` in all five locales → a commitment **the learner** makes, which is true as
  shipped: `en` *"I'll be back tomorrow"*, `es` *"Volveré mañana"*, `ko` *"내일 다시 올게요"*,
  `zh` *"我明天再来"*, `ja` *"明日また来ます"*. Register matched to each file's existing accept/decline
  pair; `en` uses a straight apostrophe, matching **0 curly / 12 straight** contractions in `en.js`.
- **`optedIn`'s stored shape is unchanged**, so the opt-in signal a future reminder feature reads
  still means the same thing. Nothing else moved: no storage key, no state, no control.
- `LessonReader.jsx` and `useAppState.js` comments now say the CTA **must not** promise a system
  action until a reminder actually ships — the comments previously described the absence without
  constraining the copy, which is precisely how it drifted.
- **`LAUNCH_PLAN.md` §3.3 gains the status annotation it never had**, naming which four mechanics are
  built, that the reminder is not and cannot be from this codebase, and that the clause's "worded as
  curiosity rather than nagging" requirement applies to notification copy that does not exist yet.

**What was deliberately NOT done: build the reminder.** A static web page cannot notify a closed tab
without a service worker and push infrastructure, and scheduling one needs the **held Expo-vs-Vite
decision** (§2.1, `DECISIONS.md`, which instructs the dev agent not to migrate on its own
initiative). The 2026-08-17 bullet was right that the *feature* is owner-blocked. This run fixes only
the half that never was.

**Verification.**
- `npm test` → **PASS: 0 failure(s)** across all eight scripts; the 2 warnings are the pre-existing
  translation-coverage and log-size ones, byte-identical to the pre-edit baseline run.
- `npm run build` → `✓ built in 1.09s`.
- **Two-sided proof the change reached the artifact a browser loads:** all **5** old strings are in
  **0** files under `dist/`, all **5** new strings in **1** file each — same command over the same
  corpus, so each half is the other's control.
- **⚠️ Live browser verification is unavailable in an unattended run and no visual claim is made.**
  `preview_start` refuses ("Dev servers can't be started from unattended sessions… nobody is present
  to approve the command"), and the previous run recorded that the `file://` fallback loads at a
  `data:` origin with an empty body. The `dist/` grep is a **payload check, not a rendering check**.

**Adversarial self-check (step 5) — run, with a planted control set, and it found one thing.**
- **Blindspot register.** Screened the **9 exact changed strings** (not diff `+` lines) against five
  families — §10.2 Dalio, §10.1 advice, §10.3 child-facing, hardcoded date, live market figure.
  **All 6 planted positives fire** (including `"Investors were buying at the trough"`, the stem the
  habitual `buy ` grep misses). The 9 changed strings: **0 hits**. `npm run check-blindspot` PASS.
  The §3.3 annotation contains the date `2026-08-31`, which is a **dated documentation record**, not
  a §2.3 live-looking figure in teaching copy — §2.3's own check scans the 26 teaching-copy modules
  and passed.
- **DECISIONS.md conflict: none, and this change is load-bearing *for* one.** `grep -niE
  'continue.?tomorrow|remind|notification'` over `DECISIONS.md` returns **zero** — the wording was
  never decided, it was inherited from the 2026-08-03 build. The Expo-vs-Vite decision is cited, not
  touched; localStorage-only state and `.js` content modules are untouched.
- **Not a redo — and this is the check that earned its keep.** It surfaced the 2026-08-17 refill
  bullet above, which is the only prior treatment of this clause anywhere in the log or archive. Had
  I not run it I would have reported this as unnoticed, which is false and would have buried the
  more useful finding.
- **One thing an independent reviewer would catch that I should say first: `optedIn` is write-only
  today.** Nothing in `src/` reads it (`grep -rn 'optedIn' src` → the writer, the setter and the two
  comments, no reader). So the prompt's persisted half currently does nothing but seed a feature that
  does not exist. **That does not make the prompt theater** — the streak framing and the commitment
  are real, and the commitment device is the mechanic §3.3 is actually asking for — but "records a
  preference" should not be read as "the app acts on it". Recorded here, **not filed as an item**
  (W-6.2 rule 2: the property is inert until the held §2.1 decision moves, and it is one sentence).
- **My own verification claim, stated exactly.** `npm test`, `npm run build`, the `dist/` two-sided
  grep, the `optedIn` grep and the notification-machinery grep with its `localStorage` control are
  **all reproducible from this commit** by an independent reviewer. The blindspot screen and the
  reference-count table are **not committed** (session scratchpad); the patterns and plants are
  written out above so they can be rebuilt, and that is the honest status rather than an implied
  guarantee.

**No new check, and W-6.3's ratio question answered out loud.** `scripts/` is **15,480** lines
against `src/`-minus-content's **6,589** (W-6.0's figure, quoted with its date, not re-measured this
run). A guard here would have to assert that UI copy does not promise a capability the build lacks —
**a check nobody knows how to write**, since the failure is semantic and the corpus is five
languages. W-6.2 rule 3's test therefore fails at the first step: the learner-visible failure is easy
to name, but no mechanical screen catches it. **The constraint is written into the two code comments
a future run would edit instead** — cheaper than a section, and located where the regression would
happen. Floor measured this run: **308,526 b against 250,000 b**, unchanged and still item 115's.

**⚠️ An archiving pass is now due on the MEASURED trigger and I did not take it** (`npm test`: run
log **255,374 b** against the 250,000 b warn budget; the cut plan names 2026-08-29, 85,470 b, a
single contiguous region). It fails the build at 350,000 b — **15.6 runs of headroom** — and two
passes already ran on 08-29 and 08-30, so a third in four days would be the third consecutive
housekeeping run. **Flagged for the next run, which should take it if nothing more learner-visible
is open.** W-5.3's known defect and item 115 are unchanged.

**W-6.5 is RESOLVED and needs no further flagging: the market-data job is running again.** `HEAD`
(`55c0c15`) refreshed `public/data/market.json` to **`asOf 2026-08-31`** — it had been stuck at
08-28 for six runs and the Sector-performance screen was about two days from showing "Market data
isn't available right now". Nothing was done to it; it recovered on its own.

**Owner tree at end of run:** the owner's untracked `UIUX/` only (51 files), untouched, as in the
previous ten runs. `HEAD` was re-checked before writing and had not moved.
**O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content, and zero
people have ever opened this app.

### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.0.6) — §3.0.6 is the only clause of the primary success criterion with ZERO references anywhere in this repo, and the glossary defined the VIX as nothing but three invented thresholds

**Pick, and why it is not the previous run's residual (W-6.2 rule 1).** The last run filed **item
159** (instruments sweep `sections`, skip `takeaway`/`thinkAbout`) as its stated residual and said
the next run must not take it by default. It is not taken. Instead: a count of every §3.0.x clause
across `AGENT_LOG.md`, `AGENT_LOG.archive.md`, `LAUNCH_PLAN.md` and `check-data.mjs` —

| clause | log | archive | check-data |
|---|---|---|---|
| §3.0.1 | 11 | 0 | 0 |
| §3.0.2 | 2 | 0 | 0 |
| §3.0.3 | 10 | 29 | 11 |
| §3.0.4 | 10 | 8 | 0 |
| §3.0.5 | 1 | 3 | 4 |
| **§3.0.6** | **0** | **0** | **0** |
| §3.0.7 | 8 | 2 | 2 |

**§3.0.6 ("Plain language over precision theater… where a simplification is genuinely lossy, say so
in one clause") has never been named, let alone measured, in the entire history of this project.**
That is a clause of the *primary success criterion*, and it is what this run audited.

**Premise measured before any edit, with controls (step 3.5).**

1. **The plan's own claim, checked rather than trusted.** §3.0.6 cites "the GDP/recession and
   yield-curve wordings already in the content" as its exemplars. Both are real and both hedge:
   `lessonContent.economy.en.js:202` says *"A common rule of thumb calls two straight quarters of
   decline a recession — but in the US, recessions are officially dated by the NBER using broader
   criteria"*, and `:152` says *"A long-term yield is, roughly, a market bet…"* plus *"it says a
   slowdown is more likely, not when, and not how severe."* **The plan was right — recorded because
   W-6.1's transferable lesson is that a document's claim about content is a CLAIM, not a
   measurement, and this one had never been checked.**

2. **The screen.** A 7-form regex for *comparative numeric thresholds* (`above/below/over/under N`,
   `N = `, `N or higher`) minus a 40-term hedge vocabulary, over lesson `sections`/`takeaway`/
   `thinkAbout`, glossary `f`/`ex`, `economicSignals`, and quiz `q`/`explain`. **16 hits.**

3. **⚠️ THE FIRST TWO-SIDED CONTROL FAILED, and that is how the instrument's real scope was found
   rather than assumed.** The control was: take the shipped `glossary.Recession` entry (*"Widely-used
   rule of thumb: 2+ consecutive quarters of declining GDP"*), strip its hedge, and require the
   screen to fire. **It did not fire** — `"A recession is 2+ consecutive quarters of declining GDP"`
   has no comparative form, so the regex cannot see it. **The instrument screens comparative
   thresholds, NOT definitional equivalences**, and had the control been drawn from the right class
   in the first place, that limit would have been invisible. Rebuilt from a real in-class shipped
   sentence — `glossary.VIX.ex`, *"…the VIX **often** spikes above 30"* — which is clean as shipped
   and fires with `often` removed. Final control set: **4 planted positives fire, 4 planted negatives
   stay clean, and the two-sided real-sentence control passes in both directions. INSTRUMENT VALID.**
   **The class the instrument cannot see is recorded here, not filed as an item** (W-6.2 rule 2).

4. **Judging the 16 hits — 10 are correct as shipped, and the distinction is the whole finding.**
   Seven are **PMI's 50**, which is *definitional*: the index is constructed so that 50 means no
   change. Three are narrative or already-approximate (`essentials/4`'s Elena scene, `essentials/11`'s
   hedged "worth checking", `economy/33`'s "75-100 years" range). **The remaining six are the VIX
   bands, on three surfaces, in five languages.**

5. **Why the VIX bands are a §3.0.6 breach and PMI's 50 is not — the corpus convicts itself.** The
   VIX has no official bands; 15/25-35/40 are commentary conventions. They were rendered in the
   *identical* `N = label` grammar as PMI's 50, one sentence apart, so a learner has no way to tell
   the construction constant from the convention. And the glossary entry was the clearest instance:

   | entry | says what it measures? | its number |
   |---|---|---|
   | `PMI` | yes ("Monthly survey… Leading indicator") | 50 — definitional |
   | `Credit Spread` | yes | none |
   | `CPI` | yes | hedged: "Fed targets **~2%**" |
   | **`VIX`** | **no — nothing at all** | **"Below 15 = calm. 25-35 = fear. Above 40 = extreme panic."** |

   **`glossary.VIX.f` was the only gauge entry in the file that never said what the thing measures,
   and the only one whose numbers are conventions presented as definitions** — in a file that
   demonstrably hedges (`~2%`) when a number is soft.

**What shipped — 15 strings, 3 surfaces x 5 languages, one clause each exactly as §3.0.6
prescribes.**
- `lessonContent.economy.{en,es,ko,zh,ja}.js` lesson 39 — *"There are no official cutoffs, but as a
  rough guide: below 15 = calm seas, above 40 = extreme panic."* (two sentences became one; §3.0.6
  also says prefer the shorter word).
- `glossary.js` VIX `f`, all five — now opens with what the VIX measures, then hedges the bands.
- `quizText.{en,es,ko,zh,ja}.js` q12 `explain` — the same hedge, so the *graded* surface cannot
  teach the invented threshold as fact.
- **PMI's 50 was deliberately left alone in all seven places.** Hedging a construction constant would
  make the app *less* accurate, and blurs the exact distinction this change exists to draw.
- **Each language's existing band set was preserved** — only `en` carries "25-35 = fear". That
  pre-existing parity gap was neither created nor widened here.

**Verification.**
- **Screen re-run after the edit: 16 → 10 hits, all six VIX instances gone.** The planted positive
  (`"Below 15 = calm seas."`) **still fires** on the same run — so the drop is a real content change
  and not a silently broken instrument.
- `npm test` → **PASS: 0 failure(s)** across all eight scripts.
- `npm run build` → `✓ built in 1.11s`.
- **Two-sided proof that the change reached the artifact a browser loads:** all 6 old band strings
  are absent from `dist/assets/` (0 files each) and all 6 new ones present (1-3 files each).
- **⚠️ The suite went RED first, and that was correct behavior, not a problem to route around.**
  Editing reviewed English drift-flagged lesson 39's four translations (coverage 100% → 98%, 1 stale
  each). **Diagnosed with the Environment note's control before assuming it was mine:** `git archive
  HEAD` into a clean dir + `node_modules` symlink → **0 failures on HEAD**, so the failure was mine.
  Answered, not silenced — I wrote all four translations against the new English in this same commit,
  so `translation-review.mjs mark 39 <lang> … ai` is the accurate record (method `ai`, matching every
  existing entry; precedent: the lesson-38 and lesson-24 runs). Then `npm run readiness -- --write`
  for the two char-count sentences (150,440 → 150,493).
- **⚠️ Live browser verification was attempted and is unavailable this run (W-1 requires the specific
  error, not an assertion from memory).** `preview_start` → *"Dev servers can't be started from
  unattended sessions (scheduled-task runs and remote-dispatched trees) — nobody is present to
  approve the command."* Fallback attempt: `navigate` to `dist/index.html` over `file://` → the pane
  reports *"files outside the project folder render as static snapshots"*, loads at a `data:` origin,
  and `get_page_text` returns an **empty body** — the module scripts never execute, so nothing was
  rendered and no visual claim is made. **The `dist/` string proof above is what stands in, and it is
  a payload check, not a rendering check.**

**Adversarial self-check (step 5) — run, and one control was rebuilt because the standing pattern is
known-broken.**
- **Blindspot register.** Screened the **exact 15 changed substrings** rather than the diff's `+`
  lines — lesson bodies are single long lines, so a line-level grep would have been screening mostly
  pre-existing prose and any zero would have been meaningless. Five families (§10.2 Dalio, §10.1
  advice, §10.3 child-facing, hardcoded date, live market figure). **Six planted positives all fire —
  including `"Investors were buying at the trough"`, the stem the standing `buy ` pattern misses, a
  defect the 2026-08-31 lesson-38 run found and which is still unfixed in the habitual grep.** The 15
  added strings: **0 hits.** `npm run check-blindspot` PASS. The change moves *away* from §10.1: it
  weakens an assertion rather than adding one.
- **DECISIONS.md conflict:** none. `grep -inE "vix|volatility index|rule of thumb|threshold|glossary
  definition"` returns only chunk-size thresholds, unrelated.
- **Not a redo — and the archive finding is worth keeping.** `AGENT_LOG.archive.md:741` records an
  earlier run that **"spot-checked and confirmed correct, left alone: … PMI's 50 threshold, VIX
  bands."** That run checked whether the *numbers are right*; it never asked whether they are
  *presented as definitions*. The same run reworded the yield curve's *"predicted every recession"*
  to *"a strong signal, not a certainty"* across body + quiz `explain` in five languages — **the
  identical defect class and the identical fix shape, applied to the yield curve and waved past on
  the VIX.** This change finishes that pass rather than reversing its decision.
- **My own verification claim, stated exactly.** `npm test`, `npm run build`, the `dist/` two-sided
  grep and the `git archive HEAD` control are all reproducible from this commit by an independent
  reviewer. **The §3.0.6 screen and the blindspot screen are NOT committed** (they live in the
  session scratchpad), so the "16 → 10" figure is **not** reproducible from the tree — the regex
  forms and the full control set are written out above so it can be rebuilt, and that is the honest
  status rather than an implied guarantee. The pre-edit measurement is by nature not reproducible
  from a post-edit tree.

**No backlog item filed, deliberately, and W-6.3 asks the ratio question to be answered out loud.**
`scripts/` is **15,480** lines against `src/`-minus-content's **6,589** (W-6.0, not re-measured this
run — quoted with its date). A §3.0.6 guard would be a 63rd `check-data.mjs` section for a property
that now holds at **zero live instances**, which is exactly the shape W-6.2 rule 2 says is a note and
not an item, and exactly the growth W-6.4 blames for the floor being over budget. **The audit is
recorded here; no item, no new check.** Floor measured this run: **308,526 b against 250,000 b** —
still over, still item 115's, and this entry adds run-log bytes only, which are archivable.

**W-6.5, still due and still the owner's.** `public/data/market.json` is `asOf 2026-08-28` for the
sixth run running; with `STALE_AFTER_DAYS` at 4 the Sector-performance screen begins showing "Market
data isn't available right now" on about **2026-09-02**. Flagged, not touched.
**Owner tree at end of run:** `OWNER-TREE f54fc023fb026bcb44277af38101071c245bfda0c8ead5c40049acd487b5c975 (0 tracked modified, 51 untracked)` — the owner's untracked `UIUX/`, untouched, as in the previous nine runs.
**O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content, and zero
people have ever opened this app.

### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §10.1's standing rule) — the app's flagship cycle lesson closed with "Every great fortune was made buying when others were panicking at the trough. The cycle ALWAYS turns", boxed as its Key Takeaway, in five languages, for four weeks

**Pick, and why it is not the previous run's residual (W-6.2 rule 1).** The last run audited §3.0
clause 2 and filed nothing this picks up. This run started on **§3.0.1 ("one idea per screen")** —
the last unaudited clause of the primary success criterion, cited six times in the log as a
justification and never once measured against content — and the §3.0.1 sweep is what surfaced this.
**The pick changed on the evidence, which is step 3.5 working rather than a scope slip:** a
structural section-split is a nicety; a false absolute claim in a boxed takeaway is a live §10.1
breach, and §10.1 is a standing rule this run is required to check anyway.

**Premise measured before any edit, with controls (step 3.5).**
1. **The §3.0.1 screen that started it.** 44 lessons, 105 sections: sections-per-lesson is 2 (27
   lessons) or 3 (17); section bodies run 624-2,474 chars, median 1,164. Nothing pathological. The
   real §3.0.1 candidates are headings joining co-equal concepts with "&" (L38 `Expansion & Peak`,
   `Contraction & Trough` — four phases in two sections) and L39's `Key Indicators` (five gauges in
   one section). **Both were left alone**: splitting sections shifts the `sectionIndex` that
   `termsForSection()` and the `aria-labelledby` ids are keyed on, which is a larger change than
   this run should make, and the §3.0.1 reading is arguable in both cases.
2. **What the sweep actually found, and the screen for it.** A 7-pattern screen for universal
   quantifiers and absolute guarantees over all **88** `takeaway`/`thinkAbout` fields. **Hits: 5,
   and four of them are one field.** Lesson 38's takeaway is the only field in the corpus that
   trips more than one pattern — it trips **three** (`universal-quantifier`, `always`,
   `superlative`). The other two hits are false positives and were left: L13's `thinkAbout`
   narrates a limit order that "never executes", and L23's takeaway says "'later' always eventually
   arrives as 'now'", a truism about time, not a market claim.
3. **Controls, all six fired.** Four planted positives (`"Stocks always go up over time."`,
   `"This strategy is guaranteed to work."`, `"Every great fortune began with a single trade."`,
   `"The market will recover within a year."`) each matched their intended pattern; two negatives
   drawn from the app's own hedged prose (`"Historically, this phase has coincided with average
   declines of roughly 22-35%."`, `"A common rule of thumb calls two straight quarters…"`) stayed
   clean. Without the negatives a screen that flagged the whole corpus would have looked decisive.
4. **The same screen over all 105 section BODIES, which is the measurement that made the finding
   sharp: 17 hits, and every single one is a hedge.** "This doesn't mean the cheapest fund is
   *always* the right choice"; "there's no *guarantee* which direction"; "Sunk costs aren't a reason
   to *always* quit". **The body prose of all 44 lessons is careful. The one unhedged absolute claim
   in the corpus was the boxed takeaway.**
5. **Why it was there, from git rather than from inference.** `git log -S "Every great fortune"`
   returns four commits, **all four mechanical** (the monolith extraction and three chunk-splitting
   passes). `git log -S "have historically been favored"` — the hedged phrasing in the same
   lesson's body — includes `2afcb42` *"Rewrite all 17 lessons with real-life examples"*. **The body
   was rewritten; the takeaway underneath it was carried through four moves and never edited.**
6. **And the guard cannot see this class, by construction.** `check-blindspot.mjs`'s §10.1 block is
   25 regexes for *prescriptive imperatives* ("be bullish", "you should buy", "we recommend"). A
   universal factual claim plus an absolute guarantee matches none of them, and the script's own
   header says so: *"Judgment calls (does new prose read like advice…) still need a human or an
   agent reading the actual diff."* **§10.1 passed on this line every run for four weeks, correctly.**

**What shipped.** One field, five files, **one line changed per file, 5 insertions / 5 deletions.**
Lesson 38's `takeaway` in `lessonContent.economy.{en,es,ko,zh,ja}.js`. The three retired claims:
*"Every great fortune was made buying when others were panicking at the trough"* (false as stated —
fortunes are made founding companies, holding through cycles, and inheriting), *"The cycle ALWAYS
turns"* (an absolute guarantee about future markets, in caps), and *"the most valuable financial
knowledge"* (a superlative). The replacement says what the lesson actually teaches and matches the
hedging its own body already uses: no two cycles have run to the same length or depth, a phase is
usually only clear once it has passed, the four phases describe a pattern that has repeated rather
than a schedule of what comes next, and the asset patterns follow from rate transmission — which
also pulls in §2 of the lesson, a section the old takeaway ignored entirely. **The `thinkAbout` was
deliberately not touched — see new item 158.**

**Verification, and the control that makes each number mean something.**
- **`npm test`: PASS, 0 failures, 2 warnings**, both standing (0% human translation review; 48
  abridged pairs). The floor warning is the third standing one, in `check-log-size`'s own run.
- **The ledger did its job and was answered, not silenced.** The English edit made lesson 38 stale
  in all four languages; coverage dropped to 98% and `check-data.mjs` **failed the build** on
  `LAUNCH_READINESS.md` §10.4 disagreeing with the live ledger. That is drift detection working. It
  was resolved by re-authoring: this run wrote all five versions against the English source and
  re-marked with `translation-review.mjs mark 38 <lang> "Claude (Opus 5, economics-app-dev-agent)"
  ai` — method **`ai`**, the reviewer-of-record convention, **not `human`**. O-3's number is
  unchanged: still **0% human in all four languages**.
- **What SHIPS, not just what is in `src/`.** `npm run build`, then over the five
  `dist/assets/lessonContent.economy.<lang>-*.js` chunks: **15/15** retired strings (3 claims x 5
  languages) return **zero** hits, and **5/5** language-specific probes for the replacement are
  present. **Control, because a grep that matches nothing looks identical to a clean build:** the
  same 15 patterns run against pre-edit copies of the five sources match **15/15**. The instrument
  can see; the zeros are real. Reproducible from this commit for part B (`npm run build` + grep);
  **part A's control needs the pre-edit copies and is reported here as what it is** — a check run
  against a scratchpad copy, with its negative control named.
- **Layout, verified statically and labelled as such.** The new English takeaway is 395 chars
  against the old 203. It renders in `<Note tone="ok">`, which is a `div` with padding wrapping a
  `<Text>` — **no fixed height, no `overflow`, no line clamp.** And the length is unremarkable
  against what already ships: L38's takeaway now ranks **11th of 44** in English (L15's is 620),
  9th in es, 10th in ko, 7th in zh, 8th in ja. **No live check was run** — dev servers are
  unavailable in unattended runs — so this is a static argument from the component and from shipped
  precedent, not a rendered proof, and it is not reported as one.

**Adversarial self-check (step 5) — run, and the first control it tried FAILED, which is why the
result is trustworthy.**
- **Blindspot register.** The standing per-run grep
  (`dalio|principles|ray |buy |sell |recommend|advice|guarantee|\$[0-9]|[0-9]+%|\d{4}-\d\d-\d\d|kid|child|…`)
  over the 5 added lines returns **zero hits**. ⚠️ **The obvious control for that zero — run the
  same grep over the REMOVED lines — also returned zero, so the zero proved nothing.** The reason
  is worth recording: the removed English line contains **"buying"**, and the standing pattern is
  **`buy `** with a trailing space, which does not match it. **The grep this project has typed out
  every run for a month would not have caught the very line this run removed.** Replaced with a real
  positive control: five planted probes (`"Ray Dalio guarantees the cycle."`, `"We recommend you buy
  now."`, `"On 2026-08-31 the S&P rose 14%."`, `"A good app for your kid."`, `"应该买入。"`) →
  **5/5 fire**, real added lines → **0/5**. `npm run check-blindspot` **PASS**; §10.1 clean across
  38 files, disclaimer on all 8 surfaces.
- **DECISIONS.md conflict:** `grep -inE "lesson 38|4 phases|four phases|takeaway"` → one hit, an
  unrelated list of translated fields. No closed decision covers this line.
- **Not a redo:** the completed-items entry for the §10.1 closure names what it changed — *"lesson
  10's rendered per-phase 'Best investments: …' lines"*, i.e. this lesson's **section bodies**. It
  did not touch takeaways. This run finishes that closure rather than repeating it, and the general
  shape is filed as **new item 159**.
- **My own verification claim:** stated per-item above — the build proof is reproducible from this
  commit, the pre-edit control is not, and the layout check is static. An independent reviewer
  re-running only the reproducible commands gets the same result.

**Residuals filed, not picked (W-6.2 rule 1 — the next run must not take these by default).**
**New item 159:** every content instrument and content pass in this project sweeps `sections` and
skips `takeaway`/`thinkAbout` — recorded twice independently (the §10.1 closure above, and a later
run's *"§17b sweeps sections only, never takeaway/thinkAbout"*), neither run aware of the other.
Proven live instance, so honest priority **medium**, not low. **New item 158 (owner decision, not
actionable by a run):** §10.2's body reads *"no direct quotes, anywhere in the app"* while its title
reads "Dalio dependency", and lesson 38's `thinkAbout` ships a direct Warren Buffett quotation that
two previous runs deliberately left. **The ambiguity is in the rule; a run must not resolve it in
either direction.**

**Not done, and deliberately: the §3.0.1 structural findings.** L38's four phases in two
"&"-joined sections and L39's five gauges in one section are left exactly as they are, recorded
here rather than filed as an item (W-6.2 rule 2) — the reading is arguable and the fix moves
`sectionIndex`, which `termsForSection()` and the section `aria-labelledby` ids are keyed on.

**W-6.5, still due and still the owner's.** `public/data/market.json` is `asOf 2026-08-28` for the
fifth run running; with `STALE_AFTER_DAYS` at 4 the Sector-performance screen starts showing
"Market data isn't available right now" on about **2026-09-02**. Flagged, not touched.
**Owner tree at end of run:** the owner's untracked `UIUX/`, untouched, as in the previous eight runs.
**O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes, and zero people
have ever opened this app.
### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.0 clause 2) — clause 2 of the primary success criterion had never been audited; lesson 24 opens by defining "need" and "want" while the scene that makes the point sits four sentences down, already written

**Pick, and why it is not the previous run's residual (W-6.2 rule 1).** The last run animated the yield
curve and filed its residual as a note under item 27. This run picks none of it. §3.0 has **seven
clauses** and the run log has worked clause 3 (undefined jargon — the glossary sweeps), clause 4
(show don't tell — fourteen figures and now one animation), clause 5 (honest minutes — §2 recomputes
it), clause 6 (plain language — §55/§59) and clause 7 (readable by default — the whole a11y matrix).
**Clause 2 — "Concrete before abstract. Lead with a thing that happens to a person, then name the
concept" — has never been measured.** `grep -rn "3\.0\.2|Concrete before abstract"` over `AGENT_LOG.md`,
the archive, `scripts/`, `src/` and `DECISIONS.md` returns **two hits, both incidental** (two archived
entries using the word "concrete" about a single lesson each). No sweep, no instrument, no item.

**Premise measured before any edit, with controls (step 3.5).** There was no premise to re-measure —
this is the first measurement — so the discipline went into the instrument instead.
1. **The screen.** For all 44 lessons, take the first two sentences of section 1's body and ask
   whether they put a **named person** or a **scene** in front of the reader. Two regexes: a
   scene-verb set (`picture|imagine|think about|meet|say|suppose|consider|…`) and the corpus's own
   roster of first names.
2. **Controls, all three fired.** (a) Lesson 29 ("Picture the last coffee you bought") must read
   concrete → **PASS**. (b) Lesson 1 ("Meet Maria, who just started her first job") must read
   concrete → **PASS**. (c) A synthetic definition-first opener ("A widget is a unit of account
   expressed as a ratio.") must be flagged abstract → **PASS**. Without (c) an instrument that
   passed everything would have returned "0 violations" and looked like a clean corpus.
3. **The instrument's own false-positive rate, measured rather than assumed, and this is why no
   check was built.** A first version also counted generic second person (`you`) as concrete. That
   version cleared lesson 24 — whose opening sentence is *"A need is something **you** can't
   functionally do without"*, a definition wearing a pronoun — so the loose screen **hid the very
   defect this run fixed**. The strict version (scene or name only) flags **13 of 44**, and reading
   all 13 by hand, **three are false positives**: lesson 35 ("Think of the Federal Funds Rate as the
   master dial in the economy's control room"), lesson 39 ("Just like a doctor doesn't diagnose you
   from a single vital sign") and lesson 26 ("Two hundred dollars can arrive in your life the same
   afternoon in two different ways") are a metaphor, an analogy and a concrete scenario respectively
   — all of them satisfy clause 2 and none of them contain a name or a scene verb. **A screen that
   is wrong on 3 of 13 is a reading aid, not a build gate**, which is the whole reason this run adds
   **zero instrument lines** (W-6.2 rule 3: the learner-visible-failure sentence can be written, but
   the check that would enforce it fails good prose; W-6.3: `scripts/` is already 2.3x `src/`).

**The result, after reading all 13 flags.** Ten are real, and they fall into two groups that have
nothing to do with each other:
- **`essentials` 10, 11, 12, 13, 14, 15 — six consecutive lessons, every one definition-first.**
  *"A W-2 and a 1099 are both tax forms…", "Mutual funds and ETFs charge an annual fee called an
  expense ratio…", "A brokerage account is just a container…", "A will is a legal document…", "A
  credit report is a detailed record…"*. **`essentials` 1-9 are nine for nine concrete-first** —
  Maria, James, Elena, "Picture a neighborhood of a thousand homes". The authorial habit is not
  missing from this project; it stops at lesson 10 and never comes back. Filed as a note under
  **item 94** (the `essentials` remainder), not as a new numbered item.
- **`money` 24 — the one on the main path, and the only money lesson of 17 that opens by defining
  its own two terms.** That is what this run fixed.

**Why 24 and not the cluster.** `essentials` is the **optional** track since the 2026-08-18 reversal;
`money` is the product. And 24 is the cheapest correct fix in the corpus, because **its concrete
scene already exists** — Jordan, the phone with one hairline crack, "I want the new phone" quietly
becoming "I need a new phone" — sitting in the *second* paragraph, behind two dictionary definitions
and two sentences about groceries. Nothing had to be invented in five languages; the paragraph order
was simply inverted. The other six each need a scene written from nothing, times five languages.

**What shipped — a reordering, in all five languages, of sentences that were all already there.**
§1's two paragraphs swap: ¶1 is now Jordan and the cracked phone, ¶2 opens *"That swap works because
of what the two words already carry."* and then gives the definitions, the groceries, and the
"nobody budgets a debate over whether to eat this week" line that had been stranded in the middle of
the scene. **Per language the diff is: +1 connective sentence, and one full stop turned into a colon**
where "That's exactly why calling something a need is so useful" merges with "the relabeling isn't a
lie exactly". Sentence count is **10 before and 10 after in every one of the five languages.**
The section heading — *"Needs Skip the Question. That's Exactly Why Wants Borrow the Name."* — now
states the claim, Jordan demonstrates it, and the definitions explain why it works, which is the
order §3.0.2 asks for.

**Verification, and the control that makes each number mean something.**
- **Nothing was lost.** A sentence-containment check against a pre-edit copy of all five files:
  **0 sentences lost in all five languages** (the en/es merge shows up only as a case change, `The
  relabeling` → `the relabeling`, and reads 0 lost case-insensitively). **Control:** the same checker
  run on a probe with a sentence deliberately deleted reports exactly 1 lost — it can see a loss.
- **What SHIPS is in the new order, not just what is in `src/`.** `npm run build`, then for each of
  the five `dist/assets/lessonContent.money.<lang>-*.js` chunks assert
  `indexOf(scene) < indexOf(definition)`: **5 of 5 PASS**. **Control:** the identical probe run
  against the pre-edit sources **fails** in `en` (scene@36318, definition@35802) and `zh`
  (scene@14320, definition@14139) — so the probe can tell the two orders apart and a PASS is not
  vacuous. Reproducible from this commit: `npm run build`, then compare those two offsets.
- **`npm test`: PASS, 0 failures, 3 warnings** — the three standing ones (floor over budget, 0%
  human translation review, 48 abridged pairs), none new.
- **The ledger did its job and was answered, not silenced.** The English edit made lesson 24 **stale
  in all four languages** — coverage dropped to 98% and `check-data.mjs` §11 **failed the build**,
  which is the drift detection working. It was resolved by actually re-reviewing: this run authored
  the reordering in all five languages against the English source and re-marked 24 with
  `translation-review.mjs mark 24 <lang> "Claude (Opus 5, economics-app-dev-agent)" ai` — method
  **`ai`**, the reviewer-of-record convention, **not `human`**. O-3's number is unchanged: still 0%
  human in all four languages.
- `LAUNCH_READINESS.md`'s two generated figures were refreshed by `refresh-readiness.mjs --write`
  (150,168 → 150,229 English chars), not retyped.

**Adversarial self-check (step 5) — run, and it found nothing that needed a fix.**
**Blindspot register:** every added line in `src/content/` grepped for
`dalio|principles|ray |buy |sell |recommend|advice|guarantee|\$[0-9]|[0-9]+%|\d{4}-\d\d-\d\d|kid|child`
→ **zero hits**; `npm run check-blindspot` **PASS, 0 failures**. No user-facing date, no market
figure, no advice-adjacent phrasing, no kids-facing move. **DECISIONS.md:** `grep -inE "lesson 24|need
vs|needs? and wants?|concrete before|3\.0\.2"` → **no hits**; there is no closed decision about this
lesson or this clause. **Not a redo:** `grep -in "lesson 24"` over `AGENT_LOG.md` + the archive
returns four hits, **all four about the pre-reversal lesson 24 ("Renting vs. Buying", now lesson 12)**
— no completed item has ever touched this lesson's prose. **My own verification claim:** the build
probe above is reproducible by anyone with this commit and `npm run build`; the containment check is
not, because it needs the pre-edit copies — so it is reported here as what it is, a check run against
a scratchpad copy, with its own negative control named.

**W-6.5, still due and still the owner's.** `public/data/market.json` is `asOf 2026-08-28` for the
fourth run running; with `STALE_AFTER_DAYS` at 4 the Sector-performance screen starts showing
"Market data isn't available right now" on about **2026-09-02**. Flagged, not touched.
**Owner tree at end of run:** the owner's untracked `UIUX/`, untouched, as in the previous seven runs.
**O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes, and zero people have
ever opened this app.

### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.0.4) — §3.0.4's worked example is "a curve inverting in front of the reader", and the app's yield curve has been sitting perfectly still since the day it was drawn

**Pick, and why it is not the previous run's residual (W-6.2 rule 1).** The last run closed lesson 30's
figure and filed its residuals as notes under item 27. This run does not pick any of them. §3.0.4 is
quoted in **item 27 itself**, in the 2026-08-31 cycle-figure entry, and in `charts.jsx`'s own file
header — always in the same direction, as the argument for adding *another static figure*. **The
clause has two halves and only one has ever been read.** Its exact words are: *"the **animated**
diagrams are the differentiator — an LLM can explain a yield curve in text; a curve inverting in front
of the reader is what a chat window cannot do."* Fourteen figures have shipped against the first half.
The second half names one specific figure, that figure has existed since before the rebuild, and it
does not move.

**Premise re-measured before any edit, with controls (step 3.5).** Two claims, both mine, both checked
against the tree rather than assumed:
1. **"No figure in this app animates."** Scanned `src/components/charts.jsx` for
   `requestAnimationFrame|@keyframes|animation:|useState|useEffect` → **0 hits**. A zero is what a dead
   instrument returns, so the **control** ran the identical regex over `src/index.css`, which
   demonstrably animates → **2 hits** (`@keyframes` ×2, the toast). The scanner works; charts really
   were state-free and motion-free, all 1,047 lines of them.
2. **"The four curve shapes can be interpolated."** Parsed the four `d` strings out of `CURVE_PATHS`:
   **all four x-vectors are `10,40,70,130`, identical**, and only the y-vectors differ. **Control:** the
   four y-vectors must be *distinct* (they are — 4 of 4), otherwise the parser was reading one row four
   times and the "identical x" result would be an artifact of that.
   So the move from any shape to any other is a **four-number interpolation**, not a path-morphing
   problem. That is the whole reason this was a small change rather than a library.

**What shipped.**
1. **`YieldCurve` can move.** `CURVE_PATHS` (four `d` strings) became `CURVE_XS` + `CURVE_YS` (four
   y-vectors) plus a `curvePath()` builder, and the component interpolates between them on
   `requestAnimationFrame` when `type` changes. Two new props, both opt-in: `animated` (default
   `false`) and `maxHeight` (default `64`, the four-up grid's existing value) — **so the Reference >
   Market signals call site is untouched by any of this**, which is deliberate: there the four shapes
   side by side are a comparison table, and comparison, not motion, is that screen's job.
2. **Lesson 36 shows ONE curve the reader moves between shapes.** The 2×2 grid of four static SVGs
   became a `Segmented` tab strip over the four shape names plus a single full-width curve that morphs
   between them, in a new `YieldCurveShapes` component in `LessonVisual.jsx`.
3. **Zero new locale keys, in any of the five languages.** The four segment labels are
   `t.curveNormal/curveFlat/curveInverted/curveSteep`, which were *already* the four grid captions, and
   the per-shape text alternative is `yieldCurveDescriptions`, already five-language content. Nothing
   was translated for this and nothing was added to the O-3 pile.
4. **The `prefers-reduced-motion` guard is read in JS, not left to CSS.** `index.css`'s reduce block
   neutralizes CSS animation and transition with `!important` and **cannot see a `requestAnimationFrame`
   loop**. Without the explicit check the one part of the app that actually moves would have been the
   one part that ignored the setting. It is read at the start of each move rather than cached, so
   changing the OS setting mid-session takes effect on the next tap.

**The result that argues for the change better than I did, and I did not design it.** The halfway
frame of a **normal → inverted** morph is `37.5, 37.5, 35, 35`. The authored **flat** shape is
`38, 37, 36, 34`. Euclidean distance from the midpoint to *flat* is **1.58**; to either endpoint it is
**32.60** — the halfway frame is **21× closer to FLAT than to either shape it is travelling between**.
So the animation walks the reader through the lesson's own stated sequence — normal, then flat (*"the
bond market's way of shrugging: a warning that a slowdown may be coming"*), then inverted — without a
word of new copy. That falls out of the geometry the shapes were already authored with. It is the
difference between a figure that illustrates the lesson and one that *is* the lesson's second section.

**THE TRADE, stated because it is real and it cuts against the change.** Lesson 36's **first** section
is a taxonomy — four named shapes, a definition each — and a 2×2 grid maps onto that one-to-one. The
grid was **not wrong**, and the four shapes are no longer visible simultaneously in the lesson. Three
things pay for it, and they are why the change still ships: **(§3.0.4)** the rest of the lesson is a
*transition*, not a taxonomy — its second section is *"that gap flipping negative"*, the curve
inverting in mid-2022 and turning positive in 2024, and the takeaway is *"when the yield curve
inverts"*; four panels say "there are four kinds of curve", one moving curve says "there is one curve,
and it moves". **(§3.0.7)** at 375px each grid cell had ~160px of width against a 140×75 viewBox capped
at 64px tall; one curve gets the full column and roughly **3× the linear size**, with the 2Y/10Y/30Y
labels scaling with it. **(§3.0.1)** one idea per screen. And the simultaneous comparison **still
ships, unchanged**, in Reference > Market signals.

**Verification, and the one thing it does NOT cover.** `npm run build` ✅ and `npm test` ✅ (0 failures;
the 2 translation warnings and the 1 log-size floor warning are the pre-existing ones, byte-identical
before and after). §59 caught a British "labelled" in one of my own comments on the first run and it
was fixed — the house-style guard doing exactly its job on new prose.
Because a dev server **cannot be started in an unattended scheduled run**, the usual live-browser sweep
was not available, so the behavior was proved headlessly instead — this is a real limit of this run and
is stated rather than papered over:
- **Server-rendered the actual components** (bundled with the repo's own `esbuild` via
  `require('esbuild').buildSync({entryPoints:['src/components/charts.jsx','src/components/LessonVisual.jsx'],bundle:true,format:'esm',outdir:'node_modules/.verify-tmp',jsx:'automatic',external:['react','react-dom','react/jsx-runtime']})`,
  output into gitignored `node_modules/` and deleted after, so nothing was left in the tree).
  **All four resting shapes render `d` strings byte-identical to the four that shipped** — the
  regression that mattered most, since a rounding or ordering slip in `curvePath()` would have redrawn
  every curve slightly wrong and nothing would have failed. Re-run after the final-frame change too.
  **Control A:** the comparison can fail — `steep`'s path must not equal `normal`'s (it does not).
  **Control B:** a call site passing no `maxHeight` still renders `max-height:64px`, which is the proof
  that Market signals is untouched.
- **Rendered lesson 36 through `LessonVisual` in `en` and `ko`:** one `<svg>` where there were four,
  four `role="tab"`s with `normal` alone `aria-selected="true"`, the panel wired
  (`id="yield-curve-panel" role="tabpanel" aria-labelledby="yield-curve-normal"`), all four localized
  labels present, and the `role="img"` `aria-label` carrying that language's own shape description.
  **Control:** lesson 32 (the cycle figure) renders no `yield-curve` markup at all, so the scan is
  figure-specific rather than matching the whole component.
- **Evaluated the shipped easing and lerp expressions *read out of the committed file*** (not retyped):
  `p < 0.5 ? 2*p*p : 1 - ((-2*p+2)**2)/2` and `from[i] + (target - from[i]) * e`. p=0 returns the source
  vector exactly, p=1 the destination vector exactly, and all four control points are **monotonic**
  across 50 samples — no overshoot, no backtrack. **Control:** a deliberately wrong easing (`p*0.9`)
  fails the p=1 endpoint assertion, so the assertion can fail.
- **NOT verified this run, and it needs a browser:** the `requestAnimationFrame` loop actually running,
  its cancelation on unmount, and `prefers-reduced-motion: reduce` snapping instead of animating.
  `useEffect` does not run under server rendering. **The next interactive session should tap all four
  shapes on lesson 36 at 375px, then re-tap with the OS reduce-motion setting on.**

**W-6.3, answered before the change rather than after, and this run moves the number further than any
before it.** Measured with the previous entry's own commands (`scripts/` all files;
`src/**/*.{js,jsx}` minus `content/` and `locales/`): **HEAD 16,019 : 6,933 = 2.311x → this tree
16,019 : 7,072 = 2.265x.** `scripts/` **+0** against the app's **+139** — the first run in this log to
add **zero** instrument lines. **No new `check-data.mjs` section was written, deliberately**, and
W-6.2 rule 3 is the reason it was not owed: the failure a guard would have caught here (a per-shape x
control point drifting so a curve's bend sits at the wrong maturity) **was removed structurally** when
the four `d` strings collapsed into one shared `CURVE_XS` — there is no longer a per-shape x value that
*can* drift. A check for a property the code can no longer violate is exactly the floor growth W-6.4
names. The existing **§22** already covers the part that can still break: it re-reads `YieldCurve`'s
`aria-label` expression and both call sites on every `npm test`, and it passed with the two new props.

**Adversarial self-check (step 5) — run, and it found two things, both fixed in this commit.**
**(a)** The animation's last frame applied the lerp's own p=1 output rather than the authored vector,
so a shape *arrived at by tapping* could differ from the same shape *at first render* by float dust.
Now the final frame snaps to `CURVE_YS[type]` and the byte-identical assertion was re-run and still
holds. **(b)** Import order in `LessonVisual.jsx` put `react` after the local modules; corrected.
**Blindspot register:** grepped every added line for
`dalio|principles|ray |buy |sell |recommend|advice|guarantee|\$[0-9]|[0-9]+%|\d{4}-\d\d-\d\d|kid|child`
— three hits, all benign and named here rather than waved off: **two dates inside code comments**
(this codebase's standing convention for recording when something was added) and **one `100%`**, which
is `width: "100%"` on the SVG. No user-facing date, no market figure, no advice-adjacent phrasing, no
kids-facing move; **no new user-visible words at all**, in any language.
`npm run check-blindspot` **PASS, 0 failures**. **DECISIONS.md:** `grep -inE "animat|motion|yield
curve|segmented|tab"` finds no closed decision this contradicts — the only `tab` hits are deep-linking
and the glossary's in-place definition, both untouched. **Not a redo:** `grep -inE "animat"` over
`AGENT_LOG.md` + the archive returns only (i) §3.0.4 being quoted for its *static* half and (ii) the
2026-08-05 progress-ring work on the pre-rebuild `Home.jsx`, a screen that no longer exists. **No
chart in this app has ever been animated, and no completed item claims otherwise.** **My own
verification claim:** every number above is reproducible from this commit with the esbuild recipe
quoted in full — and the one claim I could *not* test is named as untested rather than folded into the
green.

**Filed as a note under item 27, not as a new numbered item (W-6.2 rule 2 + W-6.4).** The
figure-coverage count is **unchanged at 14/44** — this run added no new figure, so nothing needs
re-parsing. **No new backlog number was created and the floor did not grow by one.**

**Owner tree at end of run:** 2 tracked modified (both this run's own) and the owner's untracked
`UIUX/`, untouched, the same as the previous six runs observed.

**W-6.5, now due.** `public/data/market.json` is still `asOf 2026-08-28`. With `STALE_AFTER_DAYS` at 4
the Sector-performance screen begins showing "Market data isn't available right now" on about
**2026-09-02 — two days from now**. The owner's scheduled job; flagged, not touched, for the third run
running. **O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content,
14 of 44 lessons carrying a diagram, **one of which now moves**, and zero people have ever opened this
app.


### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.2 + §3.0.4 via backlog item 27) — the lesson whose own sentence has to write "more spending" twice and then say "and so on", because a line of text cannot close the loop it is describing

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The last four runs self-picked from §3.5
and §3.0.4; the residual counter is at zero. This run took **item 27**, which is a standing
launch-plan item on W-5.2's own pick list — not the previous run's residual. The previous run *did*
file a coverage measurement into item 27 while pricing a different defect, so per W-5.2's standing
warning (*"a list of candidates is a claim about current state and goes stale exactly like a figure
does — re-read a candidate's own item before picking it"*) I re-read item 27 in full and **re-derived
the measurement myself rather than quoting it.**

**Premise re-measured before editing, with two controls (step 3.5).** Own parser over
`LESSON_VISUALS` joined against `lessons.js`'s `track`, with the control this item prescribes (an id
it must find, `32` → `cycle`; one it must not, `29`) plus a second control on the lesson list itself
(a known id/track pair in each of two tracks). Both fired. Result, agreeing with the figures the
previous run filed: **economy 5/12, essentials 3/15, money 5/17 = 13/44, 0 orphan ids**, and in
display order the path's first three lessons — **29, 30, 31** — carried none, so **the first diagram a
new install ever showed was on the fourth screen.** That is §3.2's "first five minutes" clause, and it
is the same sentence item 27 has been making since 2026-08-16 — except that the bullet stating it had
been **false since the 2026-08-18 reversal** and was corrected in place yesterday. The premise held
this time; what I had to re-derive was which lesson it now points at.

**Then I applied item 27's own bar to all three, and only one passed.** The bar is: read the prose
first and name what the prose cannot do; and *does the prose state every quantity the shape needs, or
only the ones that make it sound plausible?*
- **Lesson 29 — rejected, both candidates.** "Total Spending = Money Spent + Credit Spent" states **no
  split**, so a two-segment bar invents the one proportion it is about (lesson 16's rejection). "$500
  on 100 loaves is $5 a loaf" is fully quantified but is a division the sentence performs in one
  clause; drawing it shows nothing the prose cannot.
- **Lesson 31 — rejected, and this is the one worth keeping.** Its claim (productivity a straight
  gentle line, credit swinging around it) is **exactly what `CycleChart` draws** — yesterday's
  trend-slope fix was justified *by quoting lesson 31*. But `CycleChart` also labels four **phase**
  dots, and the phases are lesson **38**'s content. **A figure that is right about a lesson's claim
  can still be wrong for the lesson's position**, and mapping it here would front-run its own
  vocabulary seven screens early. One line of code, declined.
- **Lesson 30 — passed, on what its prose is FORCED into.** It writes its claim as an arrow chain:
  *"More spending → more income → more creditworthy borrowers → more borrowing → more spending, and so
  on."* It writes its first term **twice** and appends "and so on" **because a line of text cannot
  join its end to its beginning** — and the takeaway calls the thing "a self-reinforcing loop". The
  closure is the entire figure.

**What shipped.** `SpendingLoop` in `charts.jsx`: four boxes on a 3x3 grid, four arrows — across the
top, down the right, back along the bottom, and **up the left, closing the ring**. HTML rather than
SVG for `OutcomeGrid`'s reason (the labels are five-language and long; SVG does not wrap and would
clip silently in the languages nobody here re-reads). Content in `markets.js`, wired at
`LESSON_VISUALS[30]`. **`src/` app code +148 lines, `src/content/` +58, `scripts/` +164.**

**The property this figure has that the previous eight do not: every string it renders except its text
alternative is a VERBATIM SUBSTRING of lesson 30 in the same language.** Title (the section's own
heading), caption (the lesson's own sentence about the loop) and all four steps are **lifted, not
translated** — 6 strings x 5 languages, so **24 of the 28 non-English strings in this figure are not
new machine translation at all**; only the four non-English text alternatives are, because a
description has to describe the *shape* and no sentence in the lesson does. This is a direct answer to
something `DECISIONS.md` already wrote down and nothing had acted on: its 2026-08-16 scope limit says
chart labels are *"the content type where an unreviewed translation is least visible, because a wrong
label still renders as a correctly-shaped chart"*, and that the parity checks catch **a missing
language, never a wrong one**. §64 (a) is the first check here that catches a **wrong** one — by
anchoring to the lesson rather than by reviewing the translation.

**Verified against the BUILT app, in a browser, with the controls this log has learned to demand.**
(A) `npm run build` clean; `npm test` **exit 0**, three warnings, all pre-existing and documented
(translation review coverage, 48 condensed pairs, the backlog floor) — no new warning. (B) Served
`dist/` and read the rendered DOM: `role="img"`, the aria-label, four `[data-figure-part="step"]`
boxes and four arrows in the geometric positions a closed clockwise ring implies (top row `→` at
x=188 between the two top boxes; right column `↓`; bottom row `←`; left column `↑`). (C) **The first
DOM read was worthless and its control is what said so** — `window.innerWidth` came back **0** with
the browser pane collapsed, and the boxes measured 18px wide inside a 0px figure. A 0 that looks like
a measurement is exactly the trap the previous two runs hit from the other side; the width control is
what caught it. Re-run at a real viewport. (D) **The re-run found a real defect**: at 390px the top row
drew **35px against the bottom row's 52px**, because "more creditworthy borrowers" wraps to two lines
and CSS grid sizes a row to its tallest item — **item 27's own 82-vs-52 finding, in a new figure, four
days later.** Nothing in this figure means "bigger", so a box that grows because its label is longer is
a magnitude arriving through content. Fixed with `gridTemplateRows: "1fr auto 1fr"`; re-measured, all
four boxes **52px**. (E) At **320px with the font scale at 130% and the app switched to `ko`**: all
four boxes 62px, **0 px of horizontal overflow**, figure right edge 287 of 320, and the language
controls fired both ways (a Korean string present, the English one absent, `documentElement.lang` =
`ko`). Screenshots at 390/en and 320/ko confirm the ring reads as a ring.

**`check-data.mjs` §64, proved able to fail SIX ways by planting, plus two control plants — none by
inspection.** (1) A `zh` step paraphrased to a plausible translation → caught by (a), (b) and (c) at
once. (2) Two `en` steps swapped → (c). (3) The `ja` description reworded so it no longer contains a
step → (b). (4) The closing `↑` arrow removed → (d), *"with three it is a chain that ends, which is
exactly what the lesson's own sentence already is"*. (5) `LOOP_BOX` given a `height` → (d)'s size
clause. (6) `LESSON_VISUALS[30]` commented out → (e). **And the two control plants, which matter more
than the six:** pointing the scan at a nonexistent lesson id makes every language report *"the text is
empty"* rather than passing, and pointing it at **lesson 29** — real text, no arrow chain — fires the
positive control, proving the scan reaches *the chain paragraph* and not merely some text. All four
touched files restored from scratchpad copies — **never `git checkout --`** — and `cmp` confirms all
four byte-identical to their pre-plant state.

**W-6.3 answered before the check was written, not after, and this run moves the number the other
way.** Measured with identical commands against a `git archive HEAD` copy and against this tree:
**HEAD 15,855 : 6,785 = 2.337x → this tree 16,019 : 6,933 = 2.311x.** `scripts/` +164 against the app's
own +148 — the first run in some time where the instrument grew *slower* than the thing it measures.
**W-6.2 rule 3's sentence, which is writable here:** *a learner reads the chain sentence and then meets
a ring whose boxes use different words than the paragraph an inch above — or a ring with its closing
arrow missing, which is the chain that ends that the sentence already was.*

**Adversarial self-check (step 5) — run, and it found nothing that required a change.**
**Blindspot register:** grepped every added line for `dalio|principles|ray |buy |sell |recommend|
advice|guarantee|\$[0-9]|[0-9]%|\d{4}-\d\d-\d\d|kid|child` — the only hits are **four dates, all
inside code comments** recording when this was added, this codebase's standing convention. No
user-facing date, no market figure, no advice-adjacent phrasing, no kids-facing move; the figure adds
no *new* claim at all, since every visible word is already shipping in the paragraph above it.
`npm run check-blindspot` **PASS, 0 failures**. **DECISIONS.md:** the only relevant entry is the
2026-08-16 translation scope limit, and this change **moves toward** it rather than against it (see
above); `grep -inE "spending chain|loop|lesson 30"` finds no closed decision this contradicts. **Not a
redo:** `grep -inE "spendingLoop|spending chain"` over `AGENT_LOG.md` + the archive returns **nothing**
— lesson 30 has never carried a figure and nothing has ever proposed one. **My own verification
claim:** a reviewer reproduces every number above by building at `b27caab` and at this commit, serving
`dist/`, seeding `ecycles_completed_lessons` to `[29]` (a URL does not unlock a lesson —
`DECISIONS.md`), and reading `[data-figure="spendingLoop"]`; the six §64 plants are six one-line edits
and the two control plants are one.

**Filed as notes under item 27, not as new numbered items (W-6.2 rule 2 + W-6.4).** The two rejections
(29 and 31), the counter-clockwise-ring trap, and the box-sizing rule all went into item 27's own text.
**No new backlog number was created and the floor did not grow by one.**

**Owner tree at end of run:** `OWNER-TREE f33dcba871f21226d6514171073d53efd2c9cffa031a126726c30ab2eb7e990b`
(4 tracked modified — all this run's own — and **51 untracked**, the owner's `UIUX/`, the same count
the previous five runs observed, untouched).

**W-6.5, now due:** `public/data/market.json` is still `asOf 2026-08-28`. With `STALE_AFTER_DAYS` at 4
the Sector-performance screen begins showing "Market data isn't available right now" on about
**2026-09-02 — two days from now**. The owner's scheduled job, flagged not touched, and the stale path
itself was re-read yesterday and is correct as built. **O-1 remains the entire critical path** — 44
lessons, 5 languages, 160 minutes of content, 14 of 44 lessons now carrying a diagram, and zero people
have ever opened this app.


### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.0.4 — the clarity standard, not a residual) — the app's most-shown diagram drew the long-run productivity trend as a FLAT line, teaching the exact opposite of the lesson it illustrates

**Pick, and why it is not the previous run's residual (W-6.2 rule 1).** The last three runs all
self-picked from §3.5 (a11y), so the residual counter is at zero and rule 1 does not bind. But three
consecutive a11y runs is a tranche forming, which is the shape W-6.2 exists to name even when its
letter is satisfied — so this run deliberately changed lens and went to §3.0, the plan's **primary
success criterion**, whose clause 4 calls the animated diagrams "the differentiator… what a chat
window cannot do". I did not pick any item's stated residual.

**Premise re-measured before editing, with controls, and the FIRST premise turned out to be the wrong
one (step 3.5).** I started on coverage — §3.0.4's differentiator is absent from most lessons — and
parsed `LESSON_VISUALS` out of `LessonVisual.jsx` joined against `lessons.js`'s `track`, with the
parser control the file's own comment prescribes (an id it must find, `32`; an id it must not, `29`;
a decoy line it must not match). Result, and it reproduces item 27's last figures exactly:

| | with a figure |
|---|---|
| economy | 5/12 |
| money | 5/17 |
| essentials | 3/15 |
| **total** | **13/44** |

and in display order the path's first three lessons — **29 (Transactions), 30 (Credit), 31
(Productivity Growth)** — carry none. **That measurement stands and is filed under item 27** (see
below; it also refuted two stale claims in that item, so the re-measure changed the item, not just a
figure). **But reading lesson 31 to price a figure for it is what found the real defect**, and the
real defect outranked the coverage gap.

**The defect.** `CycleChart` draws a dashed axis with `trendLabel` — *"Long-run productivity trend"* —
rendered directly beneath naming it. The line was `<line x1="0" y1="50" x2="300" y2="50">`:
**perfectly horizontal.** Both cycle paths started and ended at exactly `y=50`, so a full cycle
returned the economy to precisely its starting height. Lesson 31, three screens earlier on the same
track, tells the reader in its own words that productivity **"grows in a fairly straight, gentle
line"** and is **"the slow, steady climb in living standards"**. The figure illustrating that claim
was drawing a long run that goes nowhere. It is the app's **most-shown diagram** — lessons 32, 33 and
38 plus Reference → Market Dashboard — and it had been wrong since the component's first commit.

**Why nothing caught it, which is the transferable half.** `check-data.mjs` §50's `figureClaims`
**deliberately excludes** `CycleChart`, on reasoning recorded 2026-08-28 that a hardcoded SVG path has
no data→render mapping to break, so a claim "would assert a literal against itself". That reasoning is
correct about the failure §50 hunts and **blind to this one**: the defect was the literal itself
disagreeing with the prose, and **a probe that compares a literal to itself cannot see a literal that
is simply wrong.** A decision to leave something uncovered is scoped to the failure mode it was
reasoning about, and does not transfer to a different one.

**What shipped, and why it is a shear rather than a redraw.** The axis is now named
(`TREND_Y0 = 68` → `TREND_Y1 = 32`, SVG y grows downward so that is a rise) and every point is its old
value plus `trendOffset(x)`. A shear is affine, so **the oscillation's shape, its amplitude, the phase
dots' positions relative to the curve, and every label-to-line gap measured at the same x are provably
unchanged** — only the axis it oscillates about tilts. That is also why the two `T` (smooth-quadratic)
segments could stay `T`: the reflected control point a `T` implies is preserved under an affine map.
The `trendLabel` text sits at x=150, where the trend is still exactly y=50, so its gap to the line is
byte-identical to before. `cycleChartDescription` gained the same correction in all five languages, so
the non-visual channel carries it too (`en` "upward-sloping"; `ko` 우상향하는; `ja` 右肩上がりの).
**`src/` +49 / −9 lines (the net +40 is mostly the comment explaining the above); `scripts/` +122.**

**Verified, five ways, against the BUILT app.** (A) `npm run build` clean; `npm test` **exit 0**, and
the three warnings are the pre-existing documented ones (translation review coverage, 48 condensed
pairs, the backlog floor) — no new warning. (B) Served `dist/` and read the rendered SVG out of the
DOM rather than looking at it: `line y1=68 y2=32`, both path literals matching the values computed
independently by hand before the edit, four phase dots at the sheared positions, and the `aria-label`
carrying the new wording — with two controls (`viewBox` read back as a value I knew, and a query I
knew must return null). (C) **A refutation control on the live DOM**: restoring the exact pre-fix
`y1="50" y2="50"` made the same assertion fail, and restoring 68/32 made it pass again — the test can
fail. (D) Switched to `ko` and re-read: `우상향하는…`, with controls asserting a *different* Korean
string was present and the English one absent, proving the language actually switched. (E) At **375px**
the figure is 0 px of horizontal overflow with `clientWidth` **375, not 0** — the previous run's
"lying non-zero" trap checked for explicitly — height unchanged at 88, all geometry inside the viewBox.
Screenshots at desktop and 375px confirm the trend now visibly climbs.

**A guard IS due here, and W-6.3 answered before building it rather than after.**
⛔ **Correction to my own first draft of this paragraph, caught by `git diff --numstat` after I had
written it: I quoted +196 `src/` and +112 `scripts/` as this run's diff. They were not.** +196 was the
*cumulative* movement of the `src/` line count since the 2026-08-30 baseline — which includes the two
previous runs' work, not mine. **A delta between two measurements taken at different times is not a
measurement of the change in between**, and quoting one as if it were is the same defect as quoting a
stale figure. Re-measured properly, by running the identical two commands against a `git archive HEAD`
copy and against this tree: **HEAD 15,653 : 6,745 = 2.321x → this tree 15,775 : 6,785 = 2.325x**, so
this run's own delta is **`scripts/` +122, `src/` +40**. §63 is **+0.8% of the numerator** and moves
the ratio by **+0.004** — the same side of W-6.3's number, which is what that clause asks be said out
loud. (The 2026-08-30 baseline of 15,480 : 6,589 is quoted from W-6.0; I did not re-derive it with my
commands, so treat the 2.35x → 2.32x drift as indicative, not as a measured trend.) **W-6.2 rule 3's sentence, which is
writable here and is the reason this is not item 152's declined shape:** *a learner reads that
productivity climbs steadily and then meets the figure illustrating it drawing that trend flat.* That
is not a hypothetical regression — **it is what shipped, live, undetected, for the whole life of the
component**, which is precisely the evidence rule 3 asks for and item 152 lacked.

**`check-data.mjs` §63, proved able to fail THREE ways by planting, not by inspection.** Specimens run
first (4 direction specimens, 3 of them refutations — one being the exact shipped literals). Then
against the live file: **(1)** flattening `TREND_Y0/Y1` to 50/50 → *"trend axis "flat", but … lesson 31
tells the reader productivity is 'the slow, steady climb'"*; **(2)** constants left honest but the
drawn `<line>` hardcoded back to `y1="50"` → caught; **(3)** `CYCLE_PATH` re-hardcoded about the old
y=50 → caught twice (not sheared, and not ending on the trend). Restored from a scratchpad copy —
**never `git checkout --`** — and `cmp` confirms the file is byte-identical to the pre-plant copy.
⚠️ **§63's first version cited "backlog item 158", which does not exist; `check-backlog.mjs` failed the
build and caught it.** The number was dropped rather than invented, per W-6.4 — see below.

**Adversarial self-check (step 5) — run, and it found one real problem, which is fixed.**
**Blindspot register:** grepped the added lines for `dalio|principles|ray |buy |sell |recommend|advice|
\$[0-9]|%|\d{4}-\d\d-\d\d` — the only hits are five dates, all inside code comments recording when a
defect was measured, this codebase's standing convention; no user-facing date, no market figure, no
advice-adjacent phrasing, no kids-facing move. **Worth naming explicitly since it is adjacent: "cycles
oscillating around a rising productivity trend" is a picture associated with Dalio (§10.2), but no
name, quote or branding is added — the concept is standard macro and the trend line already existed;
only its slope changed.** `npm run check-blindspot` **PASS, 0 failures**. **DECISIONS.md:**
`grep -inE "cyclechart|trend line|productivity|long-run"` returns **nothing**, so no closed decision is
contradicted. **Not a redo:** grepping `AGENT_LOG.md` + archive for `CycleChart|trendLabel|productivity
trend` returns only (i) the 2026-08-2x contrast pass that moved this same line to `graph.neutral` —
color, never slope — and (ii) the two §50 declines quoted above; nothing has ever touched the geometry.
§63 does not duplicate §50, which still does not cover this component. **My own verification claim:** a
reviewer reproduces it by building at `ef59656` and at this commit, serving `dist/`, and reading
`svg[role="img"][aria-label*="productivity"] line` — no tooling beyond a static server and one
`javascript_tool` call; the three §63 plants are three one-line edits.

**Filed into item 27 rather than as a new numbered item (W-6.2 rule 2 + W-6.4).** The coverage
measurement above went into item 27 — the existing lesson-visuals item, whose own header says
"re-scope before picking it again" — and **it refuted two claims sitting in that item**: its §3.2
bullet said a new install opens on "money lesson 1 (Budgeting), which has no visual at all", and
**both halves are false** — lesson 1 has had `budgetSplit` for some time, and since the 2026-08-18
reversal a new install opens on economy lesson 29. The bullet's *point* survives its numbers (the
first three lessons on the path still carry no figure), so it is corrected in place, not deleted.
**No new backlog number was created, and the floor did not grow by one.**

**Owner tree at end of run:** `OWNER-TREE 282821230948d66845cc4b8af6fbce45042ec50e6440437a5a3933fa8d087919`
(3 tracked modified — all this run's own — and **51 untracked**, the owner's `UIUX/`, the same count the
previous four runs observed, untouched).

**W-6.5, restated and now overdue:** `public/data/market.json` is still `asOf 2026-08-28`. With
`STALE_AFTER_DAYS` at 4 the Sector-performance screen begins showing "Market data isn't available
right now" on about **2026-09-02 — two days from now**. I re-read that stale path this run while
orienting and **it is correct as built** (it distinguishes "no file" from "too far from today" and
names the date only when it can parse it), so there is no dev-agent defect here — the job itself is the
owner's. **O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content,
and zero people have ever opened this app.

### 2026-08-31 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.5 applied to the spine screen) — the learning path announced a finished lesson and an unfinished one identically, so a screen-reader learner could not tell where they were on their own path

**Pick, and the residual question answered honestly rather than skipped (W-6.2 rule 1).** The previous
two runs both self-picked from the plan, so the residual counter is at zero and rule 1 does not bind
here in any case. But the adjacency deserves naming: the previous run closed the quiz-marker defect and
filed, as a note rather than a numbered item, *"if a future run finds a second meaning carried only by
color, that is the evidence."* **I did not pick that note — I walked a screen it explicitly did not
check.** Its note named the two candidates it had audited (`charts.jsx`'s decorative shapes, already
`aria-hidden` by an earlier pass; the tab bar, which already splits icon from label) and declared both
clean. `Learn.jsx` — the app's spine, the screen every learner returns to — was not among them. §3.5's
standing requirement is "screen-reader labels on every interactive element", and the lesson rows are the
most-pressed interactive elements in the app. Change is **+30 / −1 lines, all in `src/`; nothing added
to `scripts/`** (W-6.3: the ratio was **15,480 : 6,589** at the 2026-08-30 measurement, and this run
does not move the numerator).

**Premise re-measured before editing, with a control, against the BUILT app (step 3.5).** Served `dist/`
at `127.0.0.1:8811`, seeded `ecycles_completed_lessons=[29,30]` plus the disclaimer flag, reloaded, and
read the first five `#track-economy-panel` rows' `button.textContent` out of the DOM rather than looking
at the screen. Measured, before any edit:

| row | state | accessible name |
|---|---|---|
| 1 | **done** (29) | `Transactions: The Building Block≈2 min` |
| 2 | **done** (30) | `Credit: The Most Important Part≈3 min` |
| 3 | **current** (31) | `Productivity Growth: The Long-Run Driver≈2 min` |
| 4 | locked | `The Short-Term Debt CycleComplete previous lessons first` |
| 5 | locked | `The Long-Term Debt CycleComplete previous lessons first` |

**Done, current and plain-unlocked were byte-identical in shape — title plus minutes, three states
collapsed into one string.** Both meanings were carried entirely by the step marker, and the marker's
whole `<span>` is `aria-hidden="true"`; what remains is a fill color (`fill.ok` green / `fill.accent`
blue) and a font weight. **Locked was already correct** and is the reason this is a real finding rather
than a screen nobody had thought about: `t.locked` *replaces* the minutes as visible text, so that one
state has a channel and the two the screen exists to communicate did not.

**The control, because a probe that reads nothing looks exactly like a screen that is clean.** The same
call printed `disabled` per row and got `[false,false,false,true,true]` — the instrument demonstrably
distinguishes row states — and it read the locked string verbatim, so it can see text appended after a
title. A negative on "done"/"current" therefore means absent, not unread. A second control pair
(`control_knownString` on a string I knew was rendered, `control_absentString` on one I knew was not)
returned `true`/`false` as expected.

**Priced and passed over, measured rather than assumed.** The same sweep read the four `role="progressbar"`
elements (all four carry `aria-valuenow/min/max` and a labelled `Progress: n/m`), the three track headers
(`aria-expanded` correct, name from the `<h2>`), and the resume card (`Next up` + title + track + minutes).
**All clean — no work due there**, which is why this change is two strings and not a screen rewrite.

**What shipped.** `SrOnly` (the utility the previous run added, which until now had exactly one caller) on
the two states that lacked a channel, plus `lessonStateDone` / `lessonStateCurrent` in all five locales.
Appended *after* the title, following `Question.jsx`'s precedent, so the visible lesson title stays the
start of the accessible name (WCAG 2.5.3 — voice control keeps working). `isNext` is labeled even though
the resume card names the same lesson: that card names one lesson out of context, and this is the row a
learner meets while reading down the path.

**Verified, four ways.** (A) `npm run build` clean; `npm test` **exit 0**, 0 failures, and the three
warnings are the pre-existing documented ones (translation review coverage, 48 condensed pairs, the
backlog floor) — no new warning. (B) Re-read the same five rows off the rebuilt bundle: rows 1-2 now end
`…≈2 minCompleted`, row 3 `…≈2 minCurrent lesson`, rows 4-5 unchanged. (C) **Exactly 3 `SrOnly` spans in
the panel** — two done plus one current, so the label does not leak onto ordinary unlocked rows. (D)
Switched `ecycles_lang` to `ko` and re-read: `완료함` / `현재 레슨`, with a control asserting the *other*
Korean string (`이전 레슨을 먼저 완료하세요`) was also present, proving the language actually switched
rather than falling back to `en`. Screenshot confirms the visual is byte-for-byte the same design.

⚠️ **A geometry figure I nearly reported, and did not, because the control killed it.** My first
after-measurement printed `horizontalOverflowPx: 149`, which would have read as a reflow regression an
inch from the 320px work of items 148/153. Stripping all three `SrOnly` spans from the live DOM and
re-measuring gave **149 → 149 → 149** — unchanged, so not mine — and the same call exposed why:
`documentElement.clientWidth` was **0**. The number was `scrollWidth − 0`, not an overflow at all. This
is precisely the "layout not yet live" precondition `a11y-sweep.js`'s header hard-gates on, wearing its
inverse face: not a lying zero but a lying *non*-zero. After forcing layout with a screenshot the honest
reading is `clientWidth 1265 / scrollWidth 1265` → **0 px of overflow**. The 1×1 clipped boxes were
confirmed directly.

**Adversarial self-check (step 5) — run, and it found nothing.** **Blindspot register:** grepped the diff
for `dalio|principles|ray |buy |sell |recommend|advice|\d{4}-\d\d-\d\d` — one hit, the `2026-08-31` inside
a code comment recording when the defect was measured, which is this codebase's standing convention; no
user-facing date, no market figure, no advice-adjacent phrasing, no kids-facing move (the two new strings
are "Completed" and "Current lesson"). **DECISIONS.md:** no architectural decision touched, and
`grep -in "sr-only\|srOnly\|visually hidden\|off-screen\|screen reader"` over it returns **nothing**, so
no ruling exists to contradict. **Not a redo:** `grep -in "Learn.jsx"` across `AGENT_LOG.md` and the
archive, filtered to a11y terms, returns one unrelated 2020s-era hit about map parameter names; the
2026-08-21 Learn redesign fixed locked-row *contrast* (the `opacity: 0.55` defect) and never touched
announcement. **My own verification claim:** a reviewer reproduces the before/after by building at
`cf1b804` and at this commit, seeding the same two lesson ids, and reading `#track-economy-panel`
`li button` `textContent` — no tooling beyond a static server and one `javascript_tool` call.

**On W-6.2 rule 3, said rather than skipped: I built NO new check, and it is not due.** The sentence rule
3 demands is writable ("a screen-reader learner cannot tell which lessons they have already finished"),
but the regression that actually happens — a key added in `en` only — is **already** caught by
`check-data.mjs` §1's locale-parity failure. The only uncovered regression is someone deleting the two
`SrOnly` lines from `Learn.jsx`, whose sole instrument would be a regex over JSX props: the exact shape
rule 3 declined for item 152, on the wrong side of W-6.3's ratio.

**Filed as a note under this work, not a numbered item (W-6.2 rule 2).** `SrOnly` now has two callers.
The remaining icon-only meanings in `src/` were checked and none is due: `Icon.jsx` is `aria-hidden` by
design and every current caller pairs it with text. **Two callers is not yet the evidence that the
utility needs a guard.**

**Owner tree at end of run:** `OWNER-TREE 7bcfa1997e5db472c6e1ef7423b75b47475cf14bff2735db68dfe9e4d8a12141`
(6 tracked modified — all this run's own — and **51 untracked**, the owner's `UIUX/`, the same count the
previous three runs observed, untouched).

**W-6.5 restated, unchanged and still the owner's:** `public/data/market.json` is still `asOf 2026-08-28`
— now four days stale. With `STALE_AFTER_DAYS` at 4 the Sector-performance screen begins showing "Market
data isn't available right now" on about **2026-09-02**, i.e. within two days. Not dev-agent work.
**O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content, and zero
people have ever opened this app.

### 2026-08-30 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.5 rather than from a residual) — the quiz's right/wrong markers had no non-visual channel at all, so a screen reader announced the learner's WRONG pick as the selected one and gave the correct answer no marker

**Pick, and why it is not a residual (W-6.2 rule 1).** The previous run also self-picked from the
plan, so the residual counter is at zero and nothing forced this. I priced the open non-parked items
first and recorded why each was passed over: **item 26** is complete except the Leitner strip, which
is an owner decision offered back three times; **item 27** was priced and correctly rejected by the
previous run (five more money lessons assessed, none clears its bar) and re-deriving it would be the
"list of candidates goes stale" failure W-5.2 warns about, in reverse; **items 155/156** are the
residual chain W-6.2 exists to slow, and 155 would add to `scripts/`, which is the wrong side of
W-6.3's **15,480 : 6,589** ratio. So I walked the live first-five-minutes path instead. This change
is **+53 / -1 lines, all in `src/`.**

**What I found, walking the built app.** In the end-of-lesson check I answered wrong on purpose and
read the four option buttons out of the DOM rather than looking at them. The learner's wrong pick
carried `aria-checked="true"`; the correct option carried `aria-checked="false"`; **both markers are
`<Icon>`, and `Icon.jsx` sets `aria-hidden="true"` on every glyph it draws.** The green/red border
and wash are color. So the entire disclosed state — which option was right, which one I got wrong —
existed **only** as color plus an icon no assistive technology can see, and the one thing that *was*
announced said the wrong answer was the selected one. WCAG 1.4.1, on the app's only assessment
surface.

**Step 3.5 — the premise re-measured, and the first instrument was broken in a way that printed a
confident number.** My first sweep of `quizMeta` reported *"histogram: { undefined: 44 }"* — every
lesson with an undefined question count — because I had assumed `quizMeta` was keyed by lesson id.
It is a **flat array of `{lesson, answer}`**, index-aligned with `quizText.<lang>.js`. Note what the
control did here: `CONTROL A fabricated lesson 999 -> 0 (expect 0)` **passed**, because `|| []`
swallowed the shape error. **A control can fire on a broken instrument when the control's own path
is the defaulted one** — it agreed with a histogram that was nonsense on its face. Corrected:
**46 questions over 44 lessons; 42 lessons carry exactly one, lessons 30 and 34 carry two, none
carries zero.**

**The second half of the premise, because "the explanation tells you anyway" is the obvious
rebuttal.** It is a real mitigation and it does not close the gap. Measured over all 46 English
explanations with a deliberately loose bar (does the explanation contain at least half the content
words of the correct option?): **31 name it, 15 do not.** Three controls, all fired — a fabricated
explanation quoting the option reads YES, an unrelated one reads NO, an empty one reads NO. The
lexical measure **over-counts misses**, and I read all fifteen: most are competent paraphrases a
listener would follow (q13, q19, q31, q32, q40). But some are not — q5's correct option is
*"Recession within 12-18 months"* and its explanation says only that inverted yield curves have
preceded every US recession since 1955, which does not identify the option. **The honest statement
is not "a screen-reader learner can never learn the answer". It is that the marker carries no
information at all, so whether they learn it depends on prose written to teach a concept, and
nothing enforces that the prose does this second job.**

**Shipped — three files' worth, no behavior change for sighted learners.**
1. **`ui.jsx` gains `srOnly` / `<SrOnly>`**, the project's first visually-hidden utility. Clip-based,
   **not** App.jsx's `top/left: -9999` pattern, and the comment says why: the skip link must stay
   *focusable* while hidden so it needs a real box somewhere else, whereas these labels are never
   focused and can have no box at all — which is what keeps them out of `getBoundingClientRect()`
   sweeps and out of the 320px reflow budget item 153 just fixed.
2. **Both markers in `Question.jsx` carry an `SrOnly` label** — `t.quizMarkCorrect` on the correct
   option, `t.quizMarkWrong` on the learner's own wrong pick. Appended as **content**, not set as
   `aria-label`, so the visible option text stays the start of the accessible name (WCAG 2.5.3, and
   voice control still matches the visible words).
3. **Two keys in all five locales.** These are deliberately *not* the existing `quizCorrect` /
   `quizWrong`, which label the explanation note; these name a **specific option**, so "Correct!"
   would have been wrong text in the wrong place.

**The hook is untouched and had to be checked, not assumed.** `reveal={false}` means `disclosed` is
false, so neither marker renders and neither label exists — but a leak there would spoil the lesson
for exactly the readers this change is for. Verified live: after guessing, the hook group reads
`"Total spending (money + credit)your guess"` and nothing else. **No verdict leaks.**

**Controls — five, and the two-sided proof is on the two real bundles, not on the source.**

| control | expected | got |
| --- | --- | --- |
| A: viewport is real before any reflow number is believed | width ≥ 100 | **FIRED — first read was `clientWidth: 0`** (pane hidden), so `overflowPx: 167` was meaningless; re-measured at a set 320px |
| B: `HEAD`'s served bundle shows the defect | 4 rows indistinguishable | `index-BICU1PWS.js`: identical `innerText`, `svg aria-hidden=true`, wrong pick `aria-checked=true` |
| C: the new bundle shows the fix | 2 rows labeled | `index-C3vde1rx.js`: `"…Correct answer"` / `"…Your answer, incorrect"` |
| D (sabotage): strip the sr-only spans from the live DOM | back to indistinguishable | **exactly `HEAD`'s four bare strings** |
| E: a non-English language renders both labels | ko labels present | `정답` / `내가 고른 답, 오답`, with `document.documentElement.lang === "ko"` and Hangul on the page as its own control |

**Live verification.** New bundle confirmed served (`index-C3vde1rx.js`, not the cached
`index-BICU1PWS.js`), storage cleared. Both call sites exercised end to end: the lesson-reader check
(lesson 1) **and** the Practice review runner, which shares `Question.jsx` and passes no `reveal`
prop — the labels appear in both. At a real **320px** viewport: `scrollWidth === clientWidth`, **0
elements past the right edge**, both hidden spans measured **1×1** with `clip-path: inset(50%)`, and
`elementFromPoint` at each span's centre returns the `svg`, not the span — they are unhittable.
Screenshot at 320px is visually identical to before: no stray text, no shifted icons.

**Verified.** `npm test` **PASS, 0 failures** (the 3 standing WARNs: log floor + two translation
warnings). `npm run build` ✓ 934ms; main bundle 251.23 → **251.83 kB** raw (**+0.20 kB gzip**) for
ten strings. **Fresh-tree control** (W-6.1's recipe, `git archive` of `git stash create` so it
carries this run's changes — confirmed by grepping `quizMarkCorrect` present in both
`Question.jsx` and `locales/ja.js` in the copy): **exit 0**.

**Adversarial self-check (step 5).** **Blindspot register: nothing reintroduced.** `grep -ci dalio`
over the diff: **0**. §10.1 — no advice-adjacent wording enters (the two new strings are "Correct
answer" and "Your answer, incorrect"); the `disclaimer` string is untouched. §10.3 — nothing
kids-facing moves. No date or market figure enters user-facing copy; the one `2026-08-30` in the
diff is inside a code comment recording when the defect was measured, which is this codebase's
standing convention. **DECISIONS.md: no conflict** — no architectural decision touched, and
`grep -in "sr-only\|visually hidden\|off-screen"` over it returns nothing, so no prior ruling on
hidden text exists to contradict. **Not a redo:** the nearest prior work is the 2026-08-15 dual
right/wrong markers (item 26's first pass), whose own entry states its goal as *"equally legible at
a glance"* — it added the `x` icon for **sighted** legibility and this adds the channel that
phrasing does not cover. The visual markers, the color logic and the icons are byte-identical.
**On W-6.2 rule 3, said rather than skipped: I built NO new check**, and the sentence rule 3 demands
*is* writable here ("a screen-reader learner who answers wrong is never told which option was
right"). Two reasons it is still not due. First, the strings' existence in all five languages is
**already guarded** — `check-data.mjs` §1 fails the build on any `en` key missing from another
locale, so the regression that actually happens (a key added in English only) is caught today.
Second, the remaining regression — someone deletes the `SrOnly` from `Question.jsx` — has no
instrument except a regex over JSX props, which is the exact shape W-6.2 rule 3 declined for item
152, and `scripts/` is already 2.3x the app. **On my own verification claim:** a reviewer
reproduces B and C by building at `HEAD` and at this commit and reading the four option buttons'
`textContent` after a wrong answer; D needs only the one-line DOM strip against the new bundle.

**Owner tree at end of run:** `OWNER-TREE 618810068a720cc6b3dced3c4c6af2f906f2a1de1f4adc1afd8d271300679cac`
(7 tracked modified — all this run's own — and **51 untracked**, the owner's `UIUX/`, the same count
the previous two runs observed, untouched).

**Filed as a note under this work, not a numbered item (W-6.2 rule 2).** `srOnly` now exists and
nothing else uses it. The obvious next candidates were checked and **none is due**: `charts.jsx`'s
decorative shapes are already `aria-hidden` by an earlier audit (`AGENT_LOG.archive.md`, the
decorative/meaningful SVG pass), and the tab bar already splits icon from label. **If a future run finds a second meaning carried only by color, that is the
evidence that the utility needs a guard — not this run.**

**W-6.5 restated, unchanged and still the owner's:** `public/data/market.json` is still
`asOf 2026-08-28`; with `STALE_AFTER_DAYS` at 4 the Sector screen begins showing "Market data isn't
available right now" on about **2026-09-02**. Not dev-agent work. **O-1 remains the entire critical
path** — 44 lessons, 5 languages, 160 minutes of content, and zero people have ever opened this app.

### 2026-08-30 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.1/§3.5 rather than from a residual) — 18 locale keys were shipping in five languages that nothing renders, and three guards were quietly anchored to them

**Pick, and why it is not a residual (W-6.2 rule 1).** The previous run took its own previous run's
residual — first consecutive, allowed. Rather than take a second, I re-derived from the plan. I
priced **item 27** (a ninth lesson visual) first because it is the most learner-visible open item
and lives in `src/`, which is the side of W-6.3's 15,480 : 6,589 ratio that needs feeding. **I did
not pick it, and the measurement is worth recording**: I re-parsed `LESSON_VISUALS` against
`lessons.js` with the item's own parser control (must find 32 and 44, must not find 99) —
**economy 5/12, essentials 3/15, money 5/17, 0 orphan ids**, which agrees with the item's own latest
note, so no premise correction there. Then I read the prose of the five money lessons the item has
never assessed. **None clears its bar**, all on the item's own first-in-line rule (*does the prose
state every quantity the shape needs?*): **19** states Priya's \$120 but nothing on the other side
of the comparison it wants drawn; **20** has no number but "tripled"; **24** has none at all;
**26** gives \$200 and \$1,000 but the claim is that the two dollars are *identical*, which is a
sentence, not a shape; **42** states four × \$1,000 and then spends its second half telling the
reader the four categories "aren't a ladder" — a figure would harden exactly what the lesson
loosens. **That is five more rejected candidates on the record and no ninth visual is due.**

**What I picked instead, found by a live pass over the first-five-minutes path (§3.2).** Walking
the built app I noticed the nav renders **"Review"** while `src/locales/en.js` carries an unread
`tabPractice: "Practice"`. That one dead key turned out to be a class.

**Step 3.5 — measured, and the first instrument was WRONG, caught by its own control.** A sweep of
all 167 `en` keys against every `.js`/`.jsx` outside `src/locales` reported **151 of 167 dead** and
flagged `reviewTitle`, which I know is rendered as the middle tab's label. **Control A failed, so
the negative result meant nothing** — the regexes had been mangled by shell escaping. Rewritten as
a file, with three controls: **A** `reviewTitle` must come back used (it did), **C** a fabricated
key must come back dead (it did), and **B** the literal-string form must match a non-zero number of
keys, because `Learn.jsx` and `Practice.jsx` reach locale keys **dynamically** through
`t[tr.labelKey]` / `t[tr.blurbKey]` / `t[at.labelKey]` and a `t.<key>`-only sweep would call all of
those dead. **16 keys are reachable only through that path.** Corrected count: **18 of 167 dead
(11%), carried in all five languages — 90 strings.**

**And a blind delete of those 18 would have broken two guards and left a third citing a ghost.**
This is the part worth keeping:
- **`kidsTitle`** is read by `check-blindspot.mjs` **§10.3** — the kids/COPPA blindspot guard.
- **`heroInsight`** is `check-data.mjs` **§56 CONTROL A**'s corpus anchor, in all five languages.
- **`lessonProgressTemplate`** is named in **§1b**'s comment and in one of its control messages as
  the example of a legitimate per-language placeholder reordering.

**The §10.3 finding is the real one, and it is a blindspot-register guard that had gone vacuous.**
Nothing has rendered `kidsTitle` since the 2026-08-04 rebuild replaced the "More" tab with
Reference's sub-nav. So (1) it watched a string no learner could see, and (2) when the key is
absent its match is `null` and the `else` branch printed **`ok`** — it reported the property SAFE in
exactly the state where it had stopped measuring. **Refuted by running the old script, not by
reading it:** with `kidsParentIntro` rewritten to *"Hey! Pick your age and learn about money with
us."* — child-facing copy on the child/COPPA surface — `HEAD`'s `check-blindspot.mjs` printed
`ok: §10.3 kidsParentIntro present` and `ok: §10.3 kidsTitle is not the old child-facing string`,
**`PASS: 0 failure(s)`**.

**Shipped.**
1. **18 dead keys removed from all five locale files** (90 strings). Main bundle **254.63 → 251.23
   kB** raw, **91.72 → 90.40 kB gzip**. Nine are pre-rebuild relics of the four-tab prototype §3.1
   explicitly rejected (`tabHome`/`tabMarkets`/`tabMore`, `featuredInsight`, `heroInsight`,
   `lessonsCompleted`, `totalLessons`, `quizTitle`/`quizTabLabel`).
2. **§10.3 re-pointed at the two strings that actually render** — `kidsParentIntro` (ParentGuide's
   header) and `refParentsBlurb` (the hub card, "For grown-ups teaching kids") — asserting each
   **names an adult audience**, and **failing on absence** instead of passing. `kidsTabLabel` is
   deliberately not read: "Kids" names the topic, not the audience.
3. **§56 CONTROL A re-anchored to `disclaimer`**, and its failure message corrected. It used to say
   the corpus was *"not reading rendered copy"* while keying on a string the app never renders —
   the same defect the previous run fixed in `jargon-candidates.mjs`: **a control's message is a
   claim about what it proves, and this one proved only that the walk reached the locale file.**
   `disclaimer` cannot quietly stop rendering: §10.1 requires it on four surfaces and
   `check-blindspot.mjs` fails the build over it.
4. **§1b's two `lessonProgressTemplate` references re-pointed** at `reviewScoreTemplate` and
   `rankTemplate`, the two live keys that genuinely reorder their tokens in ko/zh/ja (re-derived,
   not assumed). Templated keys **15 → 14**; §1b's `< 10` control still holds.

**Controls — six, three of them sabotage, and one caught my own error.**

| control | expected | got |
| --- | --- | --- |
| A: known-used key (`reviewTitle`) reads as used | used | **FAILED first time** — instrument rewritten as a file |
| B: dynamic `t[...]` keys visible via literal form | > 0 | 16 keys |
| C: fabricated key reads as dead | dead | dead |
| D (sabotage): delete `refParentsBlurb` | §10.3 fails | **FAIL on absence** — the old guard's exact blind spot |
| E (sabotage): child-facing `kidsParentIntro` | §10.3 fails | **FAIL**; `HEAD`'s guard **passed** the same plant |
| F (sabotage): corrupt `zh` `disclaimer` only | §56 CONTROL A fails | **FAIL, `zh` only** |

**Live verification, on the rebuilt bundle (`index-BICU1PWS.js`, confirmed served — not the cached
`index-BJt1cSJd.js`).** Static server over `dist/`, storage cleared. Learn, Practice, the lesson
reader (29, 41), the Reference hub and its Glossary / Market Dashboard / Kids / About sub-screens,
plus lesson 41 in **Korean**: **zero** `undefined`, `[object …]`, `NaN` or unsubstituted `{token}`
anywhere. Probe control: a planted `<div>undefined</div>` was detected and its removal restored a
clean read. **A second instrument error, caught the same way:** my first Korean run wrote
`JSON.stringify("ko")` to `ecycles_lang`, which `readRaw` (not `readJSON`) hands to the app as
`"ko"` **with quotes** — it fell back to English and I nearly read that as a language bug. Written
raw, `ko` renders throughout.

**Verified.** `npm test` **PASS, 0 failures** (3 pre-existing WARNs: the log floor and the two
standing translation warnings). `npm run build` ✓ 908ms. **Fresh-tree control** (W-6.1's recipe,
`git archive` of `git stash create` so it carries *this run's* changes — verified by grepping
`ADULT_AUDIENCE` present and `kidsTitle:` absent in the copy): **exit 0**.

**Adversarial self-check (step 5).** **Blindspot register: I touched §10.3 and the check is
strictly stronger, not weaker** — it now fails on two conditions the old one passed (absence, and
a child-facing rewrite of rendered copy), and no framing changed in the app itself. `grep -ci dalio`
over the diff: **0**. §10.1: the `disclaimer` string is unmodified in all five languages and now has
one more thing depending on it. No date or market figure enters user-facing copy. **DECISIONS.md: no
conflict** — nothing architectural moves; `.js` content modules, localStorage-only state and Vite all
untouched. **Not a redo:** no item in "Completed and pruned" covers dead locale keys; item 75 is the
nearest relative and is the *opposite* disposition — there the dead `color` field was kept
deliberately and the fix was a false comment. **On W-6.2 rule 3, stated because a silent skip looks
like forgetting: I built NO new check.** A dead locale key renders nothing, so the learner-visible
failure that rule demands **cannot be written**, and by the rule the check is not due. **On W-6.3:**
`scripts/` grows by ~30 net comment lines while `src/` **shrinks by 90 strings** and the shipped
bundle by 1.3 kB gzip — the right side of the ratio for once. **On my own verification claim:** a
reviewer re-running D, E and F reproduces all three; E's refutation needs
`git show HEAD:scripts/check-blindspot.mjs` and the plant, and prints `PASS: 0 failure(s)`.

**Owner tree at end of run:** `OWNER-TREE 1ebb68e4047a9e683f26bf22dff469c82aa7ad2e40d14c6148e1a809894dabd9`
(7 tracked modified — all this run's own — and **51 untracked**, the same count the previous run
observed for the owner's `UIUX/`, untouched).

**Filed as a note, not a numbered item (W-6.2 rule 2): dead locale keys can regrow and nothing
stops them.** Zero live instances after this run, honest priority low, no learner-visible failure —
so it is a note here rather than an item competing for capacity. The instrument is
`scratchpad/deadkeys.mjs`-shaped and is nine lines; the reason it is not in `scripts/` is W-6.2
rule 3, and if a future run finds a second crop, that is the evidence that changes the answer.

### 2026-08-30 (owner-directed: "do FOMO next") — FOMO is defined in the clause that introduces it; the report line that said otherwise was asserting about the content what it had measured about the bucket

**No glossary entry shipped, and that is the finding.** The item was my own note from the previous
run, which called `FOMO` "the last candidate on the list that is real jargon rather than a section
heading or a cross-reference." Measured, it is **both** of the things that sentence ruled out.

**Step 3.5 — the premise is false in three independent places.**
- **Lesson 20 §1: *"The feeling that pulls Marcus in has a name: FOMO, the fear of missing out."***
  The acronym is glossed in the clause that introduces it, so §3.0.3's FIRST branch already holds.
  The section heading above it is "FOMO Pulls You In…" and the takeaway restates the expansion.
- **Lesson 28 §1's single use is a cross-reference**: `a different pattern from FOMO (“Everyone
  Can't Be Wrong — Can They?”)` — it carries lesson 20's title in the parentheses, so the one
  out-of-lesson reader is already pointed at the lesson that defines it.
- **A key would have been unreachable from the lesson that teaches it.** Rule 2 would have excluded
  it on 20 (`defined-here`), leaving a chip only on 28 — a glossary entry whose sole appearance is
  the lesson that says "go read the other one".
- **Control:** the sweep carried `emergency fund`, a term I know is in eight places, and found all
  eight in their known lessons — the same instrument-blindness trap that fired for real yesterday.

**So the defect is in the instrument, and it is the sentence that made the bad note feel checked.**
`npm run jargon` printed **"(0 self-defining suppressed — no acronym in this corpus is expanded next
to itself)"**. Suppression requires **every** occurrence to be glossed; FOMO is glossed **once** and
bare **three** times, so it was correctly *not* suppressed — and the explanation attached to that
zero was a claim about the corpus that the count cannot support. **A report line is a measurement
like any other. This one described its bucket and asserted about the content.**

**Shipped — three changes to `scripts/jargon-candidates.mjs`, no content and no new check.**
1. **The false line is now true**: "…is expanded next to itself **EVERY time it appears**", plus a
   second line naming the terms that ARE spelled out somewhere and bare elsewhere, and a
   `← already spelled out in lesson N` marker on each such candidate row. Today that marks exactly
   one row, `FOMO`, which is the annotation that would have stopped the note being written.
2. **The gloss rule now reads apposition, not only parentheses.** Two defects, and the first hid the
   second — found because my control rewrote the real sentence *with* brackets and it **still**
   failed: (a) `glossSpans` built parenthesized spans only; (b) the expansion had no allowance for a
   **leading article**, so `FOMO (the fear of missing out)` missed while `the fear of missing out
   (FOMO)` matched. **The rule disagreed with itself between its own two orders** — in the
   expansion-first form the `\b` floats and the match can start at "fear"; in the acronym-first form
   it had to begin at the character after `(`.
3. **A control message that was lying.** Sabotage 1 below reported that `"fomo"` *"sits inside
   'Securities and Exchange Commission (SEC)'"* — hardcoded from when the probe held one gloss. It
   now names the term instead of one specific clause.

**The evidence is still the initials, never the punctuation** — that is the file's own precision
story and it is why item 64's `the annual rate — the APR — on your credit card` is **still not
detected**, correctly: "annual rate" spells `ar`, not `apr`. Re-measured this run, still false.

**Controls — five, and two of them are sabotage.**

| control | expected | got |
| --- | --- | --- |
| A: sweep finds a term I know is there (`emergency fund`) | 8 uses | 8/8 in their known lessons |
| B: isolate *why* FOMO missed — same sentence, bracketed | should match | **false — a SECOND defect (leading article)** |
| C (precision): candidate/control/self-defining counts, all 5 corpora, before vs after | unchanged | **identical in all five** — 0 newly suppressed |
| D (sabotage): revert to parens-only spans | `fomo` control fails | **failed as designed** |
| E (sabotage): suppress on punctuation, initials ignored | `apr` control fails | **failed as designed** |

**C is the one that licenses the widening and D/E are the ones that make the probe worth anything.**
The rule now recognizes a shape it could not see, and across money, economy, essentials, all and the
glossary corpus it suppresses **nothing new** — so the change is a precision-preserving widening,
not a loosening. **Stated plainly because it cuts the other way too: this fix changes no report
today.** Its value is that the next acronym glossed in apposition is not a false candidate, and D/E
prove the guard around it is alive rather than decorative.

**Verified.** `npm test` **PASS, 0 failures** (3 pre-existing WARNs: log floor + the two standing
translation warnings). `npm run build` ✓ 1.21s.
`MEASURED jargon money: 7 candidates, 10 control, 0 self-defining, 133 low-reach  [fingerprint b72d1b0a]`
**Note what happened to yesterday's quoted line, because it is the fingerprint working rather than
failing:** `check-measurements` reported it "enforced and agreeing" this morning and now reports **8
retired, 0 disagreeing** — the instrument moved, so the claim is retired rather than falsely scored.
An instrument change is *supposed* to retire the numbers quoted against the old one.

**Adversarial self-check (step 5).** **Blindspot register: no regression, and none is reachable** —
this run touches one script and the log; no lesson, locale, glossary or market file is edited.
`grep -ci dalio` over the diff: **0**. §10.1: no learner-facing string changes at all (the only new
prose is a probe sentence inside a control and comments). §10.3 untouched. No date or market figure
enters user-facing copy. **DECISIONS.md: no conflict** — nothing architectural moves. **Not a redo:**
item 68 built the gloss rule for the parenthesized shape and this extends it to one it explicitly
listed as undetected; the APR case it *deliberately* declined stays declined, on the same reasoning.
**On W-6.2:** this is my own previous run's residual and it is the **first** consecutive time
(rule 1 allows two), and it was the owner's pick rather than my default — but the correct reading is
that it should not have been a numbered-style residual at all, which is why it stays a note under
item 60. **On W-6.2 rule 3:** I added **no check that can fail a build** — the new assertions are
inside an existing control that already ran, and the learner-visible failure the underlying rule
guards is unchanged. **On W-6.3:** `scripts/` grows by ~98 net lines against W-6.0's 15,480 : 6,589.
That is the wrong side of the ratio and I am not going to pretend otherwise; the defense is that it
is a *correction to a lying report* plus its probe, not a new instrument, and it deletes a false
sentence that had already cost one run a wrong conclusion. **On my own verification claim:** a
reviewer re-running the five corpora before and after gets identical counts; D and E are reproducible
by deleting either apposition pattern from `glossSpans`, or by replacing `${exp}` in the
acronym-first apposition with a bare word run.

**Owner tree at end of run:** `OWNER-TREE f54fc023fb026bcb44277af38101071c245bfda0c8ead5c40049acd487b5c975`
observed at the START of this run (0 tracked modified, 51 untracked — the owner's `UIUX/`, untouched);
the only tracked changes at the end are this run's own two files.

**Next run: pick from the launch plan or the owner-facing items.** Item 60's list is now down to
candidates that are section headings, cross-references or ordinary English — **`lifestyle inflation`
is the only remaining one with a real shape, and it already carries an `other-sense` exclusion on
lesson 17**, so read that before treating it as open. **O-1 remains the entire critical path: 44
lessons, five languages, 160 minutes of content, and zero people have ever opened this app.** **O-3
unchanged — this run added no translated prose.** **W-6.5 still stands: `market.json` is `asOf
2026-08-28`, so the Sector screen starts suppressing figures around 2026-09-02.**

### 2026-08-30 (scheduled dev-agent) — the four income types had no glossary entry, "0 unexplained" was correct and blind, and the sweep written to prove it read every lesson as empty

**Picked from `LAUNCH_PLAN.md` §3.0.3, not from the backlog chain.** The previous entry closed with
"pick from the launch plan or the owner-facing items — not from this entry", and W-6.2 rule 1 says the
same. §3.0.3 ("no undefined jargon: a term either gets defined where it appears or links to the
glossary") is a *primary success criterion* in §3.0, and `npm run jargon` is the instrument item 60
built for the half `check-data.mjs` §17b cannot see. It had not been run against money lessons 41-44,
which shipped after 2026-08-25.

**Step 3.5 — the premise held, and the instrument written to test it did not.**
- **The gap is real and is the highest-reach one the instrument can name.** `npm run jargon` before
  the change: **Labor income, 3 lessons, 11 uses (42, 43, 44)** — top of the list — then Business
  income (2/4), Investment income (2/3), passive income (2/3). None of the four was a glossary key.
  Read against the prose rather than the ranking: **lesson 42 §0 defines all four inline** in one
  paragraph, so §3.0.3's FIRST branch already held there; **43 and 44 then use them as settled
  vocabulary and re-define none of them**, and had nowhere to point.
- **⛔ THE SWEEP I WROTE TO CONFIRM THIS RETURNED ZERO HITS ACROSS ALL 44 LESSONS, AND THAT WAS THE
  INSTRUMENT, NOT THE CONTENT.** It read `section.body.en`. The per-language content modules have held
  **plain strings since the item-45 split** — `.en` is `undefined` there, and `?? ""` turned every
  lesson into an empty haystack. **Caught only because the control was in the same query**: I swept
  `emergency fund`, a term I knew was in four lessons, and it came back zero too. Without that term in
  the list the run would have concluded "the four income terms appear nowhere" and closed the item as
  a false premise. Re-run against the real strings, the control found all 8 known `emergency fund`
  uses in their known lessons, and the four income terms in **42, 43 and 44 only** — no essentials or
  economy use anywhere, which is what made the change small.
- **"0 unexplained" was true that morning and proved nothing about this.** §17b sweeps the keys in
  `glossary.js`; four terms that are not keys are invisible to it. Its own header says so. Recorded in
  item 60 because a green coverage number reads like a certificate and is not one.

**Shipped.** Four glossary entries — `Labor Income`, `Business Income`, `Investment Income`,
`Passive Income` — in all five languages (`s`/`f`/`ex`), plus chips and exclusions placed by
`lessonTerms.js`'s own rules:
- **42: all four `defined-here`.** Rule 2 — the lesson IS the definition, so a chip would point a
  reader three lines below the sentence they are reading.
- **43 §0: Labor, Business, Investment Income. 44 §0: Passive Income, Labor Income.** **Rule 4 decides
  this, not the arc's shape, and the asymmetry is the part worth keeping:** 43's English never says
  "passive income" (it says "rent and royalties are loosely coupled") and 44's never says "business
  income" or "investment income". Chipping by theme would have put two dead chips on 44, which §17
  fails on by design.
- `LAUNCH_PLAN.md` §1's asset sentence moved **38 → 42 glossary terms**. Not hand-edited: the suite
  failed on it, `npm run readiness -- --write` wrote it (item 55's generated figures).

**§10.1 got the most attention of anything here, because these four entries are the most exposed
copy in the file.** The popular literature on this exact vocabulary is prescriptive end to end
("build passive income", "escape the rat race"). Each definition states what the income IS and how it
behaves *including how it fails* — a dividend can be cut, a tenant can leave while the mortgage does
not, a wage has legal minimums the other three do not — and none says which to pursue. That is also
lesson 44's own stated position, so the glossary and the lesson agree rather than merely coexisting.

**Controls — four.**

| control | expected | got |
| --- | --- | --- |
| A: the term sweep can see a term I know is there (`emergency fund`) | 8 uses | **0 — INSTRUMENT BROKEN**, then 8/8 after the fix |
| B (plant): the 4 keys added with **no** chips and **no** exclusions | §17b must fail | **9 unexplained: 42×4, 43×3, 44×2** — matches A's sweep lesson-for-lesson |
| C: after chips + exclusions | 0 unexplained | **0**; uses 127 → **136** (+9, exactly B's set) |
| D: the four move CANDIDATES → CONTROL in the jargon report | pass | 11 candidates/6 control → **7 candidates/10 control** |

**B is the one that matters.** It is the same nine occurrences three independent instruments agree
on — my own sweep, §17b's matcher, and the jargon extractor — and it proves §17b was blind rather
than satisfied, which is a claim about the check that a green run could never have made.

**⚠️ What I could NOT verify this run, stated rather than skipped.** The chips are new learner-visible
UI and I could not render them: **a dev server cannot be started in an unattended scheduled run**, so
`scripts/a11y-sweep.js` and the 320px width sweep were both unavailable. What I did instead is a
bounded argument, not a substitute: chips are `flexWrap: "wrap"`, so the binding constraint is the
**widest single chip**, and every new label is narrower than labels already shipping and already swept
clean — en **17** units against `Individual Retirement Account (IRA)`'s 35, es **23** against 37, ko
**11** against 18, zh **8** against 19, ja **8** against 24 (CJK counted double). **That bounds the
risk; it does not observe the render.** The next run with a browser should look at lesson 43 §0 in
`es`, the widest new row.

**Verified.** `npm test` **PASS, 0 failures** across all eight scripts (3 pre-existing WARNs: the log
floor, and the two standing translation warnings — none touched by this run). `npm run build` ✓ in
923ms. Measured lines, pasted not retyped:
`  §17b §3.0.3 coverage: 136 glossary-term uses across 44 lessons — 95 chips on 30 lessons, 41 deliberately unlinked (31 defined-here, 10 other-sense), 0 unexplained.`
`MEASURED jargon money: 7 candidates, 10 control, 0 self-defining, 133 low-reach  [fingerprint c909cf1c]`

**Adversarial self-check (step 5).** **Blindspot register: no regression.** §10.2 — `grep -ci dalio`
over the diff: **0**. §10.1 — `npm run check-blindspot` PASS, and the judgment half is argued above
rather than delegated to it. §10.3 — no kids content touched. Stale-data rule — no date and no market
figure enters user-facing copy; the two `2026-08-30` strings in the diff are provenance comments in
source, the same shape as every other dated comment in these two files. **DECISIONS.md: no conflict**
— `.js` content module, no new state, no storage; adding glossary keys is item 35's established
precedent, not a new architecture. **Not a redo:** item 35 glossed the personal-finance lessons as
they stood on 2026-08-16/21; lessons 41-44 did not exist then, so their vocabulary was never in its
scope. **On W-6.2:** this is not my previous run's residual — that run was the archiving pass and it
explicitly declined to queue anything. **On W-6.2 rule 3 and W-6.3: I added no check at all.**
`scripts/` is untouched, so the 15,480 : 6,589 instrument-to-app ratio moves the right way for once;
the existing §17b already guards the new data in both directions. **On O-3:** this adds **16
unreviewed machine-translated definitions** (4 terms × 4 languages). Glossary entries sit outside the
translation-review ledger — `glossary.js`'s header records that — so they will not appear in the
`review-status` figures, which is exactly the kind of quiet growth O-3 asks the owner to price.
**On my own verification claim:** a reviewer re-running `npm test`, `npm run build` and `npm run
jargon` gets these numbers; control B is reproducible by deleting `deliberatelyUnlinked[42]` and the
five new chips and re-running `check-data.mjs`.

**Known limit, not fixed here.** §17b sweeps sections only, never `takeaway`/`thinkAbout` (item 64's
residual). Lesson 43's takeaway names all three of its terms and 44's `thinkAbout` says "passive
income"; both lessons already carry the chip in a section, so no learner is worse off — but the
coverage number does not include those four uses and should not be read as if it did.

**Owner tree at end of run:** `OWNER-TREE 7cd330b52e2b8e421825a80436d49bdc1a9f66735b3031a5dc3dac8dc0fbc623`
(3 tracked modified — this run's own files, before the log entry — 51 untracked, the owner's `UIUX/`
reference folder, untouched).

**Next run: pick from the launch plan or the owner-facing items, not from this entry.** The one thing
I would otherwise queue — `FOMO`, the last real jargon candidate — is filed as a note under item 60
precisely so it is not the default next pick. **O-1 remains the entire critical path: 44 lessons, five
languages, 160 minutes of content, and zero people have ever opened this app.** **O-3 is now slightly
larger than when it was written** — see the self-check above. **W-6.5 still stands: `market.json` is
`asOf 2026-08-28` and the Sector screen starts suppressing figures around 2026-09-02.**

### 2026-08-30 (scheduled dev-agent) — the pick the last run prescribed was justified by a threshold that does not exist, and the file was 2,588 b from a ceiling nothing enforces (W-5.3 archiving pass)

**Picked** the W-5.3 archiving pass. The previous entry's closing line said **"Next run should pick
W-6.4 / the log floor"**; step 3.5 refuted the reason it gave, and the refutation changed the pick.

**Step 3.5 — the prescribed pick's premise is false, and its figures were stale on arrival.**
- **"the non-archivable floor is 336,755 b … That is a build failure at 350,000 b" is wrong.** Read
  off `check-log-size.mjs` rather than off the line: `FLOOR_MAX` (250,000) is reached only through
  `warn()` — **the floor has no fail path at all** and never stops a build. The 350,000 b failure is
  `RUN_LOG_HARD`, and it belongs to the **run log**. The two numbers were swapped, so the line sent
  the next run at the one budget that cannot stop anything and away from the one that can.
- **Both quoted figures were already stale**, the way W-5.5 keeps predicting: measured today the run
  log was **256,308 b** (not 250,201) and the floor **341,104 b** (not 336,755) — that entry's own
  bytes landed after it measured itself.
- **The floor's remedy is also not a run's to take.** W-6.4 says the cause is W-6.2, not insufficient
  compression, and item 115's options are the owner's. So the prescribed pick was blocked as well as
  misjustified.
- **What the measurement found instead, and it is the sharper half.** `check-log-size.mjs`'s own
  design comment claims *"RUN_LOG_HARD = FILE_CEILING - FLOOR_MAX, so while both budgets hold the
  whole file cannot reach 600 KB."* **The floor budget does not hold — it is 91,104 b over — so that
  guarantee was void, and nothing anywhere asserts `FILE_CEILING`.** `AGENT_LOG.md` was **597,412 b:
  2,588 b from W-5.3's original 600 KB trigger**, i.e. under half of one average entry (+7,179
  b/commit), with no check that would have said a word. The archiving pass is the one action that
  moves that number, and it was due on its own terms anyway.

**Shipped.** Twelve `2026-08-28` entries — **122,768 b** — moved verbatim into `AGENT_LOG.archive.md`
under a new `## Archived 2026-08-28` heading, **reordered oldest-first** (item 142's rule: the live
log is written newest-first and the archive is ascending; file order here was exactly reverse
chronological, checked against `git log --reverse`, not assumed). Run log **256,308 → 133,567 b**
(53.4% of warn, 16.2 runs of headroom); file **597,412 → 474,671 b**. **Those two figures are measured
at the cut, before this entry's own bytes — stated because the stale line above is exactly this
defect and a convention is not an excuse.** After committing this entry the suite reports run log
**140,380 b**, file **482,707 b**, floor **342,327 b**; re-run `npm test` for the live line rather
than quoting any of these. The archive pointer now says
"before 2026-08-29" and names six passes. **The floor is untouched at 341,104 b and still WARNs** —
this run does not pretend to have moved it.

**Controls — six, because a green suite is worth nothing here and one control proves exactly that.**

| control | expected | got |
| --- | --- | --- |
| A: cut day contiguous AND the tail of the run log | pass | 12 entries, 1 region, oldest block |
| B: split/rejoin of the run log is byte-lossless | pass | byte-identical, 256,297 b |
| C: each moved entry present **verbatim** in the archive | 12/12 | **12/12, 0 missing, 0 still live** |
| D (negative): a corrupted entry must NOT be found | false | false |
| E: fresh copy of the **index tree** runs the suite | exit 0 | exit 0, 3 pre-existing WARNs |
| F (plant): **delete a whole 9,168 b archived entry**, re-run | ? | **0 failures — undetected** |

**F is the one that matters and it is a finding, not a formality.** `npm test` cannot see archive
loss: an entry can vanish in an archiving pass and every suite stays green. **So E's greenness proves
nothing about whether the history survived — only C and D do**, and any future pass that reports
"tests pass" as evidence of a faithful move is reporting the wrong thing. E was built from
`git write-tree` on the staged index rather than from `HEAD`, because `git archive HEAD` would have
tested the state before this change — the trap that makes a control fail for its own reasons.

**Also fixed, one line, because this change made it worse:** the archive's title still read
`(2026-08-01 → 2026-08-08)` — stale since the first of what are now six passes, and this pass added a
sixth range under it. Now `(2026-08-01 → 2026-08-28)`.

**A 28 b discrepancy, stated rather than rounded away.** The cut plan predicted 122,769 b moved
leaving 133,539 b; the actual is 122,768 b moved leaving 133,567 b. One byte is the plan's
day-boundary newline; the other 27 are the archive-pointer sentence this run rewrote, which lives
inside the run-log region and so counts against it.

**Adversarial self-check (step 5).** No blindspot regression is possible in kind — no content, locale,
lesson, or market file is touched, so §10.1, §10.2, §10.3 and the §2.3 stale-data rule are untouched
(`grep -c Dalio` on both edited files: 0 outside quoted historical entries, which §31 keeps verbatim).
No `DECISIONS.md` conflict — nothing architectural changes. **Not a redo:** the 2026-08-29 pass moved
08-26/08-27; this moves 08-28, a disjoint day. **On W-6.2**, this is not a residual of my own previous
run — it is a standing W-5.3 rule firing on a live measurement, and rule 1 is why I did not take the
prescribed follow-on. **On W-6.2 rule 3 and W-6.3**: the obvious response to control F is to build an
archive-integrity check, and **I deliberately did not.** Rule 3 asks for the learner-visible failure it
would catch, and there is none — this is agent bookkeeping. `scripts/` is 15,480 lines against `src/`'s
6,589 (W-6.0's ratio, unchanged by this run, which adds no code); a seventh check script falls on the
wrong side of it. **Filed as a note under W-5.3, not as a numbered item** — W-6.2 rule 2's shape. **On
my own verification claim:** a reviewer re-running these six controls gets these numbers; F is
reproducible by deleting any `### 2026-08-28` block from the archive and running `npm test`.

**Owner tree at end of run:** `OWNER-TREE adc2fea2773bae01cd5f5cc8111979ad04062dab13d0a04c74b5da4c27ed3182`
(2 tracked modified — this run's own two files — 51 untracked, the owner's `UIUX/` reference folder,
untouched).

**Next run: pick from the launch plan or the owner-facing items — not from this entry.** W-6.2 rule 1
applies to me too, and the one thing I would otherwise queue (an archive-integrity guard) is exactly
the residual-shaped work W-6 exists to stop. **O-1 remains the entire critical path: 44 lessons, five
languages, 160 minutes of content, and zero people have ever opened this app.** **O-3** is unchanged —
this run added no translated prose. The floor (341,104 b) still needs **item 115's owner decision**;
it warns, it does not block, and no run should treat it as urgent until that is clear.

### 2026-08-30 (owner-directed: "do route (c) next") — "exists" now means what the repo SHIPS, and the item's own "re-classifies every existing reference" was seven of them (item 157)

**Picked** item 157 — route (c) for W-6.1: `check-data.mjs` §26 resolved document references against
the filesystem, so a tracked document could cite a path that existed only in one person's working
tree: green for them, red for every clone.

**Step 3.5 — the premise held on the defect and broke on the scoping, and one fact changed underfoot.**
- **The defect is real and was re-derived, not taken on report.** §26's `tree` was a `readdirSync`
  walk; a working tree carries files git does not.
- **"Not a one-liner… it re-classifies every existing reference" is an over-estimate.** Both trees
  were computed and every reference resolved under each *before* editing: exactly **7 references
  across 2 paths** move — `economic-cycles-v5.jsx` (5) and `economic-cycles-v6.jsx` (2). The real
  check then failed on precisely those 7 lines and no others, which is the prediction confirming
  itself. `node_modules/`/`dist/` were never at risk: §26's walk already excluded them.
- **⚠️ `HEAD` MOVED MID-RUN, twice over, and it changed the problem.** The owner committed
  **`5d958ff`** — route (a), tracking `drafts/income-hierarchy.en.md` — while this run was measuring,
  and rewrote item 154 and filed item 157 in the process. So the live instance was cured by the owner
  and the class by this run. Both were needed; neither makes the other redundant. **The first symptom
  of this was a contradiction I could not explain**: `git ls-files` reported `drafts/` as tracked
  while `git status` said `??` and `git ls-tree HEAD` said nothing. That was the file being staged,
  then committed, underneath a running session — the hazard the Environment note warns about, met in
  its sharpest form. It was resolved by re-reading the repo rather than by reasoning about it.

**Corrected the item's proposed predicate, which would have re-opened the class it exists to close.**
Item 157 suggested `tracked-or-ignored`, to keep the gitignored prototypes resolving. But
`economic-cycles-v5.jsx` is gitignored *precisely so no clone has it* (the 2026-08-16 owner decision,
"ignored, not deleted"). A README telling a cloner to read a file they cannot have is the same broken
promise `drafts/` was — only the hiding mechanism differs. **Implemented `tracked`**, and turned the
7 references into honest exemptions: 6 `path-ok` markers, 7 uses, `EXPECTED_EXEMPTIONS` **13 → 20**.
Every one of those documents had been making a promise no clone could keep, invisibly, since the
prototypes were un-tracked on 2026-08-16.

**The index, not `HEAD`, and the distinction is load-bearing.** The index is the commit about to be
made, so a run that adds a file and cites it from a document in the same commit still passes — this
repo's normal shape. `HEAD` would have forced that into two commits.

**Controls — four, in a REAL `git clone` so the index path was the one exercised.** The one that
matters is B, because a green suite proves nothing on its own:

| control | state | expected | got |
| --- | --- | --- | --- |
| A | baseline clone | pass | exit 0, git index, 136 files, 20 exempted |
| B | file present on disk but **untracked**, cited | **fail** | **exit 1** |
| B' | the identical plant, filesystem fallback (non-git copy) | pass (old rule) | **exit 0, zero findings** |
| C | the same file **staged** | pass | exit 0, 333 refs, 137 files |
| D | path existing nowhere | fail | exit 1 |

**B against B' is the two-sided proof** — the same plant fails under the new rule and passes under the
old one, so the behavior changed in the intended direction rather than everything merely continuing to
pass. **Both halves green afterwards:** working tree `npm test` exit 0 (git index) and fresh clone
`npm test` exit 0 (filesystem fallback), each reporting 20 exemptions.

**§10.2's guard caught this run's own marker text.** The first draft of the v6 exemption explained that
v6 "carries Dalio branding" — in `README.md`, which `check-blindspot.mjs` scans. Naming the thing the
register exists to keep out is still a hit, and the check was right to fail. Reworded to point at the
register instead of repeating the name; `grep -c Dalio README.md` is 0.

**The Environment note's clean-tree recipe was updated in the same commit, because this change made it
wrong.** It must no longer `cp economic-cycles-v*.jsx` into the archive copy: that would make the two
paths resolve there and their new markers fail as **stale** — the identical "control that fails for its
own reasons" trap the note already warns about, wearing the opposite face.

**Adversarial self-check (step 5).** The §10.2 near-miss above is the one real finding and it was fixed,
not argued away. No other blindspot regression: no content, locale or lesson file is touched, so §10.1,
§10.3 and the §2.3 stale-data rule are untouched. No `DECISIONS.md` conflict — the file is edited only
to add a `path-ok` comment; no recorded decision changes, and in particular the 2026-08-16 "ignored,
not deleted" decision is *upheld* rather than reversed: the prototypes stay on disk, stay ignored, and
are now documented as absent from clones instead of silently assumed present. Not a redo — route (b)
is refuted and stays refuted, and route (a) is the owner's and was left alone. On my own verification
claim: a reviewer re-running `git clone -q .` into a scratch directory, copying these five files in and
running the four plants above gets these numbers; the clone step is in the recipe because the
`git archive` copy exercises the fallback, not the primary path.

**Filed:** nothing new. Item 157's residual is item 155's permanent text-zoom probe, already open.

**Next run should pick W-6.4 / the log floor** — the fresh-clone run now WARNs that the run log is
250,201 b, over its 250,000 b budget, and the non-archivable floor is 336,755 b. That is a build
failure at 350,000 b, and this entry moved it in the wrong direction.


### 2026-08-30 (scheduled dev-agent) — the text-zoom item named the one screen that was already clean, and the probe it prescribed could not see the failure that was actually shipping (item 153)

**Picked** item 153 (browser text zoom past the app's own font ceiling, WCAG 1.4.4 Resize Text AA).
**Note on the pick:** the weekly review committed `c55a887` + `a3cf6ae` **while this run was already
measuring**, and its new W-6.2 rule PARKS item 153. The pick predates the rule. The correction below
is the part that matters: **W-6.2 parked this item as "zero live instances AND honest priority: low",
and "zero live instances" was the single claim that turned out to be false.**

**Step 3.5 — the premise broke in three separate places.**
1. **The headline did not reproduce.** Item 153 said Reference > Market Dashboard degrades at
   130/150/200% (3/9/15 overflowing nodes; scrollWidth 323/359/447). Re-measured at `HEAD` on that
   exact screen: **0 nodes at every step**, scrollWidth 320/320/320/320/324. Its numbers were taken
   before item 148's fix and filed unchanged after it.
2. **The tab-bar claim was real, on screens the item never looked at.** Sweeping all nine screens:
   **Reference hub 408px** against a 320px viewport (16 nodes) and **Sector performance 379px**
   (the `NAV` itself computing to 347px wide) — both at 200%.
3. **The prescribed instrument was blind to the worst failure.** A right-edge scan over
   `getBoundingClientRect()` cannot see TEXT overflow: an overflowing word does not widen its
   element's border box. The tell was a `scrollWidth` of 379 sitting next to a node count of 0, and
   chasing it found `<h1>` "Sector performance" needing 363px in a 288px box, the header's
   "Economic Cycles" 224px in a 42px box, and "Communication Services" 202px in 161px. Because
   `body` already sets `overflow-x: hidden`, none of that scrolled — **it was clipped**, so the text
   was genuinely gone rather than merely awkward.

**Controls carried, both two-sided, both re-run after every rebuild.** A planted over-wide `<div>`
had to raise the box count and vanish on removal (`before 0 → during 1..7 → after 0`); a planted
narrow box holding `Supercalifragilisticexpialidocious` with `overflow-wrap: normal` had to raise the
text count and vanish (`0 → 1 → 0`). **Four lying zeros were caught by controls rather than by
reading**, and they are the reason this entry is trustworthy at all:
- **A stale server from a 2026-08-25 session was squatting port 8781**, serving a scratchpad
  `head/dist` with no `index.html`. The first "measurement" was a 404 page. Fixed by checking the
  listening process's `cwd`, not by assuming the port was mine.
- **`Loading…` reads exactly like a clean screen.** Three screens first reported 0/0/0 while the
  lazy chunk had not rendered. The screen-identity fingerprint caught it; the probe now REFUSES
  rather than reporting a clean number for an unsettled screen.
- **The root-font override only proves anything if the type is in `rem`.** Verified live: body copy
  14 → 28px and document height 3361 → 7664px across 100 → 200%. A flat `13.3333px` on the tab
  `<button>` looked like a scale failure and was the button's own unused UA font-size — the label
  `<span>` does scale, 11 → 22px.
- **SVG `<text>` has no meaningful `scrollWidth`**, so the text probe reported 17 phantom findings on
  the Market Dashboard until it was restricted to the XHTML namespace.

**Shipped — one root cause, five call sites.** Every one is a flex or grid track whose *automatic
minimum* is its min-content size, so it could not shrink when the text grew:
- `ui.jsx` `TileGrid`: `1fr 1fr` → `repeat(auto-fit, minmax(min(6.5rem, 100%), 1fr))`.
- `App.jsx` nav pill: width `calc(100% - 32px)` → `calc(100vw - 32px)`, and `left: 50%` +
  `translateX(-50%)` → `left: 0; right: 0; margin: 0 auto`. A fixed element resolves percentages
  against an initial containing block that GROWS with horizontal overflow, so the pill was centered
  on half of the overflow it was itself causing — a genuine feedback loop (`left` computed to 189.5px,
  half of the 379px the document had grown to).
- `App.jsx` tab buttons: `minWidth: 0` + a wrappable label.
- `ui.jsx` `Segmented`: `flexShrink: 0`, so the container's existing `overflowX: auto` scrolls
  instead of the buttons being squeezed under their own labels and the text overlapping.
- `Settings.jsx` radio rows: `flexWrap: "wrap"`.
- `index.css`: `body { overflow-wrap: break-word }` — `break-word`, not `anywhere`, deliberately:
  `anywhere` also shrinks min-content and would silently re-flow flex and grid tracks app-wide.

**The first version of the grid fix was a regression, caught by computing the threshold instead of
eyeballing it.** `9rem` collapses the Reference hub to ONE column at 100% on any 320px phone. The
constraint is `2 x floor + 12px gap <= 288px` of content; **6.5rem** keeps two columns at 100/115/130%
— 130% is `FONT_SCALE_STEPS`' own ceiling, so nothing reachable through the app's text-size control
moves — and collapses to one only at 150/200%, exactly where it used to overflow. Verified as
`5 tiles / 3 rows` at 100/115/130% and `5 tiles / 5 rows` at 150/200%.

**`50vw` was also tried and was wrong on desktop**, which only showed up because the check was run at
a second width: `vw` includes the classic scrollbar, so against a 900px window with a 15px scrollbar
the pill centered on 450 while the app column centered on 442.5. Auto margins resolve against the
layout viewport, which excludes it — re-measured **`offBy: 0`**.

**Verification.** `npm run build` exit 0; `npm test` **exit 0**, 0 failures, and the 2 warnings are
the pre-existing translation-debt and log-floor ones, unrelated to this change. §62 (item 148's Bar
guard) still passes. Live sweep against the built bundle (`index-BQ2XP2Au.js`, read back from the DOM
each reload so no result came from a stale build) at 320px, light, `en`:

| screen | 100% | 130% | 200% | docScrollWidth |
| --- | --- | --- | --- | --- |
| Learn, Lesson reader, Review, Reference hub, Glossary, Market Dashboard, Sector performance, Kids, About | 0 box / 0 text | 0 / 0 | 0 / 0 | 320 at all three |

Before the change, the same sweep read **408px on the Reference hub** and **379px on Sector
performance**, with the age-band labels visibly overlapping on Kids and About's "Dark" button past
the viewport edge. **One exception is deliberate and left alone:** the header's app title is a
`nowrap` + `text-overflow: ellipsis` truncation by design, so it reports a `scrollWidth` larger than
its box on purpose; the probe excludes intentional ellipsis, and elements inside a genuinely
scrollable container.

**§59 caught this run's own comments** — "neighbours"/"behaviour" — before the commit. Fixed to US
spelling; the guard did exactly the job item 91 built it for.

**Adversarial self-check (step 5).** No blindspot regression: nothing here touches content, so §10.1
advice language, §10.2 Dalio, §10.3's parent-facing kids framing and the Markets stale-data rule are
all untouched — the only dates added are measurement dates inside source comments, which is this
file's existing convention and not a rendered date. No `DECISIONS.md` conflict: localStorage-only
state, `.js` content modules and Vite are untouched; `DECISIONS.md` mentions `TileGrid` only as a
structure adopted from the 2026-08-21 redesign, not as a closed two-column decision — and the
"two columns at every width this app supports" intent is preserved on its own axis, since 220px of
tracks fit the 288-428px range at every supported width. Not a redo: item 148 was the Bar chart's
own columns→rows at narrow widths and `charts.jsx` is untouched here. On my own verification claim —
an independent reviewer re-running `npm run build`, serving `dist/` on a **fresh** port, and running
the two planted controls would get these numbers; the port check is in the recipe precisely because
this run's first attempt did not.

**Filed as residuals rather than smuggled into this commit — and read W-6.2 rule 3 before picking
either:** new items **155** (the text-zoom sweep is session-only; a permanent probe belongs in
`a11y-sweep.js`, and its learner-visible sentence is "the Reference hub scrolled sideways at 200%
zoom and headings were clipped mid-word") and **156** (the `PracticeCoachMark` was hardened by
inspection, not reproduced — it needs a finished lesson to reach).

**Then attempted W-6.1's authorized route-(b) stopgap, and it does not work — attempted, measured
both ways, and reverted.** The one-line `path-ok` marker plus `EXPECTED_EXEMPTIONS` 13 → 14 makes the
fresh clone pass and makes **the working tree fail**: §26 fails a reference whose path is missing and
equally fails a marker whose path is present, and `drafts/income-hierarchy.en.md` is present in the
owner's tree and absent from every clone. Measured in both directions — fresh clone before the fix
exit 1 (`names ... which does not exist`), working tree after the fix exit 1 (`marker is stale — that
path exists now`) — so no value of the marker satisfies both. Reverted; `npm test` re-verified at
exit 0. The finding is written into item 154 so the next run does not re-derive it, together with the
one-line-regex trap that cost a cycle (§26 matches `path-ok` per line, so a wrapped comment is
silently never seen). **What is left are two decisions, not edits:** route (a), tracking the owner's
file, which stays the owner's call; or a new route (c), making §26 resolve against git's tracked file
list rather than the filesystem — the only option that makes the two states agree by construction.

**Next run should pick W-6.1 on the corrected facts above** — most likely route (c), which needs its
own run because it changes the checker's semantics and will re-classify other references.


### 2026-08-30 (scheduled dev-agent) — the reflow failure is fixed by a fourth option nobody had priced, and the first working version of it drew 4.5 at 58% of 9.0 with every probe green (item 148 → new items 153 + 154)

**Picked item 148**, over the previous run's suggested 152. Item 148 was the only open item with a
**measured, live, user-visible standards failure** (WCAG 1.4.10 reflow at 320px); every other open
item — 152, 149, 144, 143, 140, 126, 120 — records zero live instances. Item 148 had been escalated
twice as "wants the owner's pick", and that framing was correct *at the time*: all three priced fixes
broke something the app values, so there was nothing to choose between. **A fourth option removes the
choice rather than making it**, which is why this was taken autonomously — see the "design call I
made" paragraph below, which states it plainly rather than burying it.

**Premise re-measurement (step 3.5) — the mechanism held exactly, two numbers did not, and the scope
was one language rather than five.** Full detail is written into backlog item 148 itself so the next
run does not re-derive it. In short: `scrollWidth` **323** reproduced to the pixel, but `clientWidth`
is **320** and not the item's 305, so the overflow is **3px, not 18px** — the 305 implies a 15px
scrollbar reserved in whatever pane took the original reading. The flex size is **47.6px**, not 45.
The cause is precisely as the item stated (`min-width: auto` pins each column at its label's longest
word, 66.3px for "tightening"; **290.3px of content in a 254px row**). And the finding the item did
not have: **only `en` overflows the document** — required vs available is en 290.3 / es 258.5 / ja 134
/ ko 131.5 / zh 127.9 against 254, so `es` misses by 4.5px and CJK fits easily.

**Instrument controls, because two of them caught real errors this run.**
- **Positive control on the overflow scan**: a planted 500px probe moved `scrollWidth` 323 → 500 and
  back to 323 on removal. Fired.
- **The min-content probe was WRONG on its first run and the control is what said so.** It cloned the
  label and copied styles via `getComputedStyle(el).cssText` — which returns **the empty string** in
  Chrome, so the clone inherited body font and reported "tightening" as 91.1px. Rebuilt to copy the
  eight font properties explicitly; the two-sided control is that min-content of the whole label must
  equal min-content of its longest word alone (66.3 = 66.3) and exceed its shortest (28.8). Only then
  did the numbers agree with the rendered column widths.
- **The static server was serving a DIFFERENT build.** Port 8781 was already held by a previous run's
  server, and the first measurements ran against it. Caught by hashing the served asset against the
  local one. Then the *same class* recurred: after rebuilding, the browser served a cached
  `index.html` still pointing at the old bundle — caught by reading the live `<script src>` and fixed
  with a `?v=N` cache-buster. **Two stale-instrument traps in one run, both silent.**
- **A synchronous multi-state sweep read garbage and looked plausible.** Measuring five languages in
  one `javascript_tool` call reported all five bars at an identical 35.5px — which is literally the
  number in `charts.jsx`'s historic-bug comment, so it read as a devastating regression. It was the
  0.5s bar `transition` plus React's async re-render being measured mid-flight. Re-measured one state
  per tool round-trip and the ratios were correct. **`rAF` cannot be used to wait here — the Browser
  pane is hidden, so `requestAnimationFrame` never fires and the call times out at 45s.**

**What shipped.** Below **375px** the `Bar` chart renders each datum as a ROW — label left, track
centre, value right — so no label has to fit in a fifth of the width. Geometry moved from inline
styles into `index.css` `.ec-bar-*`, because **a media query cannot reach an inline style**; colors
stayed inline `theme.js` tokens, so there is still one source of color truth. The datum's percentage
passes through a custom property `--ec-bar-pct`, read as a **height** in the column layout and a
**width** in the row layout — the axis switch an inline `height` could not have made.

**The design call I made, stated rather than rounded off.** Item 148 was escalated to the owner
because (a) produced overlapping labels, (b) produced five mid-word fragments, and (c) made a
comparison chart scroll. The row layout costs none of those, which is why I did not escalate a fourth
time — but it *is* a visible design change the owner has not seen, and the breakpoint spends real
margin: the crossover is **356.3px** and the breakpoint is **375px**, because `es` crosses at 325px
and item 93 adds translated prose daily. **Between 356 and 374 — which includes the very common 360px
Android width — the row layout engages where the column layout would still have fit**, and ko/zh/ja
switch despite never having had the problem. Judged not a regression (a horizontal bar is a good
narrow presentation, and every label stays intact), but **reversing it is a one-number edit** and the
owner should know it is theirs to make.

**THE FIX'S OWN SILENT BUG — found by measuring, and no probe in this repo would have caught it.**
The first working version left the label at `flex: 0 0 auto`. Each row's label then sized to its own
text, so **every row got a different track length**, and a bar's length stopped meaning its value:
the 4.5 bar drew at **58% of the 9.0 bar instead of 50%**. There was no overflow, no overlap, no
clipped label, and the screenshot looked entirely reasonable. This is the component's **oldest** bug
— `charts.jsx` records a version where a ten-fold expansion "was drawn as four bars of equal height"
— reintroduced through the width axis by the very change that fixed the width axis. A **fixed** flex
basis on the two elements bracketing the track is the whole correctness argument. After the fix, the
rendered-length-to-value error is **0.0004 at worst**, tracks are identical across all five rows
(137.5 left / 98.6 wide), in all five languages.

**Also shipped: `check-data.mjs` §62**, which guards exactly that property and nothing else — the two
track-bracketing elements must have a fixed (non-elastic) flex basis inside the narrow block, the
block must exist, and `.ec-bar-fill` must read the percentage as a `width`. It is a **static read of
CSS text**, which is the instrument class this log keeps catching in the act, so five hand-written
`flex` specimens with known answers (three of them refutations: `0 0 auto`, `none`, `1`) run **before**
the live assertion on every `npm test`.

**Verification — six injections, each restored from a scratchpad copy and confirmed by sha256.**
1. `.ec-bar-label` basis → `0 0 auto` → §62 fails naming the selector, the block and the 58%/50%
   measurement.
2. `.ec-bar-value` basis → `none` → fails (proves `none` is not read as a length).
3. `.ec-bar-fill` loses `width: var(--ec-bar-pct)` → fails with the "every bar renders the same
   length" diagnosis.
4. Breakpoint changed to `400px` → fails with "no `@media (max-width: 374.98px)` block".
5. **SCOPE CONTROL** — the `.ec-bar-label` rule moved *out* of the media block and a fixed basis put
   on the base rule instead → still fails ("has no rule inside"). The brace-matching is real; a
   selector outside the block cannot satisfy an assertion about inside it.
6. **PARSER CONTROL** — `flexBasisClass` stubbed to always return `"fixed"` → the three refutation
   specimens fail first, so a broken reader cannot report a clean live result.
`src/index.css` and `scripts/check-data.mjs` both restored byte-identical (`cb514753…` / `e4706130…`).

**Live verification against `dist/`** (static build + `python3 -m http.server`, per the Environment
note): 320px x 130% in **all five languages** — 0 document-overflow nodes, uniform tracks, no clipped
label, worst ratio error 0.0004. 320px at **90/100/115/130%** — all clean. 375px x 100% and 130% in
all five languages — column layout unchanged, ratios correct, no overflow. **Both `Bar` call sites**
checked, not just the one the item named: Reference > Market Dashboard *and* lesson 37's
`LessonVisual` figure render identically, and the `role="img"` `aria-label` ("Five bars, in trillions
of dollars: 0.9 before 2008, …") is layout-neutral, so §22's text alternative stays true in both
layouts. Light and dark both screenshotted and looked at.

`npm test` exit 0 — **0 failures, 3 warnings**, all three pre-existing (translation review coverage,
translation completeness, log floor). Proven pre-existing rather than assumed: the `HEAD` control copy
produces an **identical warning set**. `npm run build` exit 0 in 939ms; the built CSS carries the
media query. `node scripts/us-english.mjs` exit 0.

**Adversarial self-check (step 5) — two real findings, both mine, both fixed in this commit.**
- **The `flex: 0 0 auto` distortion above** is the first, and it is the one that mattered.
- **A dangling cross-reference I created**: `charts.jsx`'s `boxHeight` comment pointed at "the
  `minHeight: 0` comment below", which this change moved into `index.css`. Rewritten to name
  `.ec-bar-track` where it now lives. Small, but it is precisely the comment rot this log has been
  burned by (§28b's four rotted `file:line` citations).
- **Blindspot register:** 0 files under `src/content/` or `src/locales/` in the diff — no learner-
  facing string moved, in any language. 0 hits for Dalio or advice-adjacent patterns in the added
  lines. The five `2026-08-30` strings are four `//` comments recording when a measurement was taken
  plus one `fail()` diagnostic; **six existing `fail()` messages already cite dates**, so that is the
  established shape, and none of it is rendered to a learner.
- **DECISIONS.md:** no conflict. Nothing here touches localStorage-only state, `.js`-not-JSON content
  modules, or Vite-not-Expo. Checked specifically for a decision governing inline-styles-vs-CSS and
  there is none; the color decision ("colors live in CSS so the app can react to the *system* scheme")
  is **preserved** — only geometry moved, and no hex was added.
- **Already-done backlog item:** item 148 was open and filed by the run that closed 147. Nothing in
  "Completed and pruned" is redone or undone.
- **My own verification claim:** an independent reviewer re-running these commands gets these results
  — **provided two things are stated, because both bit me.** (i) The `HEAD` control needs `cp -R
  drafts` on top of the Environment note's recipe, or it fails §26 for its own reasons (**filed as
  item 154**). (ii) The preview must be cache-busted (`?v=N`) and its served bundle hash compared to
  the local one, or the measurement runs against a stale build.
- ⚠️ **A drift I am declaring rather than hiding.** The geometry that moved into `index.css` carries
  literal `4px`/`8px` gaps, which **duplicate `space["1"]`/`space["2"]` from `theme.js`** — and the
  App summary says spacing tokens live in `theme.js`. There is no way around it as things stand:
  `space` is a JS object, a media query cannot read it, and the narrow layout needs a *different* gap
  from the wide one. It is two numbers, it is commented where it sits, and the honest options
  (promote `space` to CSS custom properties, or thread both gaps through inline custom properties)
  are both larger than this item. Not filed as its own item because it is one instance and not a
  class — the same reasoning item 126 records — but stated here so the next run does not "discover"
  it as a defect.
- ⚠️ **What this run did NOT do.** The `A11yStates` ledger's recorded sweeps for the Market Dashboard
  state at 320px were taken against the **column** layout. Their conclusion ("clean") is still true
  and is now *more* true — the overflow item 148 recorded is gone — but a future run re-running that
  sweep will meet a different DOM, and **item 149 is the item that owns that ledger**. Nothing was
  edited there; the note is so the difference reads as expected rather than as a surprise.
- **Naming, so it stops costing runs time:** the screen's UI title is **"Market Dashboard"** and has
  been since the first locale extraction (`76be081`); the component is `MarketSignals.jsx` and the
  App summary calls it "Market signals". All three are current. Item 148's "Market signals" was never
  a UI string, and was left alone rather than "corrected" into a dated record.

**Owner-tree fingerprint observed this run:** `OWNER-TREE 187bb0b7eddc5519f55aedeb19eed6533e3da625e79d8c3d762ee2559155263d`
(3 tracked modified — all mine — 52 untracked). The pre-edit fingerprint was
`c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2` (0 tracked modified, 52 untracked),
which is the number the next run should compare against with `--expect`.

#### Next run

**Item 152** (lesson 23's zone/series colors) is still the cleanest content-adjacent pick and the
previous run's suggestion — read its two routes first; lifting the color choice into the content
module is the better one and makes its control free. **New item 153** (browser text zoom at 150/200%,
where the bottom tab bar overflows) is the direct residual of this run and is the only other item with
a *measured* live symptom, though it sits outside the app's own font ceiling. Then **149, 144, 143,
140, 126, 120**, all at zero live instances, plus **new item 154** (a one-line fix to the `HEAD`
control recipe). **Item 117** remains the one open *product* item and is still the owner's.
**For the owner:** the log floor is over budget at **314 KB** against 250 KB (measured by `npm test` after this entry landed; it was 306 KB before it) and only a backlog
compression pass moves it — **item 115 holds the rule and the options, and that decision is still
yours.** **O-1 remains the entire critical path: 44 lessons, five languages, 160 minutes of content,
and zero people have ever opened this app.** **O-3** unchanged — no translated prose was added or
altered this run.

### 2026-08-30 (scheduled dev-agent) — lesson 23's labels are now checked for WHICH one says which, and the control the item specified for it turned out to be unreachable (item 151 → new item 152)

**Picked item 151**, the previous run's stated follow-on. Items 149/126/120 were left alone on item
149's own instruction (*"Do not pick it over content"*), and 148 is still the product call the run that
filed it escalated.

**Premise re-measurement (step 3.5) — all four premises held.** Worth stating plainly, because the
task file's standing note is that ten consecutive items had a premise wrong somewhere; this one did not.
- `flipZoneLabels[0]`→$65 / `[1]`→$50 and `flipSeriesLabels[0]`→$50 / `[1]`→$65, **in all five
  languages**, read through `amountsIn` rather than by eye. Control: the scan returned a non-empty set
  for all 20 strings and never returned the $5 that is a substring of both amounts.
- **The item's own ⚠️ flag — "confirm the drawn order before pinning it" — resolved in its favor.**
  `PreferenceFlip` fills `zoneColors[0]` from the left edge to the crossing, and at the left vantage
  point the later reward is perceived higher (4.643 vs 3.846). Zone 0 is the wait-for-the-$65 band, so
  the item's direction was right rather than its mirror. The block **derives** this from `flipValue` at
  the two end vantage points instead of pinning today's answer.
- **Scope was wider than the item said, for the second item running.** `flipAxisLabels` is the same
  shape — two elements consumed by position, `[1]` states $50 in all five languages, `[0]` states
  neither — and block (i) reads neither. Swapped, the figure captions its left edge, where the lesson
  says both rewards are a year off, with "the $50 is available today". It shipped in the same block.

**What shipped:** `check-data.mjs` §50 block (j). Three ordered pairs x five languages, each element
asserted to state one reward and **not** the other, every expectation derived from `flipRewards` and
from `flipValue` at the axis ends. Two guards sit above it: the figure must still reverse (else the zone
labels have no sides to be on), and some reward must still come due at the last sampled vantage month
(else `flipAxisLabels[1]` names nothing).

**Two controls were written for this block and only one survived. Both failures are in the code
comments, because a probe that cannot fire reads as coverage.**
1. **"The shipped order passes AND its reverse also passes"** — the two-sided control item 151
   specified. It is **unreachable by construction**: every spec is symmetric (what element 0 must state
   is exactly what element 1 must not), so whenever the shipped pair passes, element 1 does not state
   `must[0]` and the reverse always fails the `must` half. Deleted, and replaced by a static assertion
   that each `ORDERED` entry **is** symmetric — which is the property that makes a swap detectable at
   all, and which fires the moment someone adds a fourth key that only looks like an ordering check.
2. **"Dropping the exclusion half is caught by that reversal probe"** — asserted in my first comment,
   then injected, and **nothing failed**. The claim was false: every string here names exactly one of
   the two rewards, so the `must` half alone still separates the real pair from its reverse. What ships
   instead is a probe built from input the predicate must reject — each element concatenated with its
   sibling, stating both rewards in both positions. The full assertion rejects it on the exclusion half;
   presence-only accepts it.

**Verification — seven injections, each restored from a scratchpad copy and re-checked by sha256.**
1. **ko `flipZoneLabels` swapped** → four failures naming `flipZoneLabels.ko[0]`/`[1]`, the amount each
   should carry, and why. **The first version misdiagnosed this**: it ran the reversal probe
   unconditionally, so a genuinely swapped pair was reported as an instrument defect — right file, right
   key, and it told the reader to go fix the checker instead of the content. Found by injection, not by
   re-reading.
2. **zh `flipAxisLabels` swapped** (the half the item did not name) → `flipAxisLabels.zh[0] states $50,
   which belongs to element 1 … labels the wrong end of the x-axis`.
3. **es `flipSeriesLabels` swapped** → four failures, right language, right key.
4. **`mustNot` deleted from `ordersCorrectly`, clean content** → **0 failures** against the first
   design; **15 failures** (3 keys x 5 languages) against what shipped.
5. **`flipMonths` last element removed** → `neither reward comes due at month 11, the last sampled
   vantage point`. The derivation guard, diagnosed as itself.
6. **en zone labels expanded so both name both amounts** → the exclusion half fires per element.
7. **An `ORDERED` entry rewritten to `[leftWinner, null]`/`[rightWinner, null]`** → `the ORDERED entry
   for flipZoneLabels is not swap-detectable`.

`src/content/moneyVisuals.js` restored byte-identical (`15fc66f5…`, unchanged from HEAD and confirmed by
`git status`). `npm test` exit 0 — **0 failures, 1 warning**, and the warning is the pre-existing
log-floor budget (item 115, the owner's call), not this change. `npm run build` exit 0 in 952ms.
`node scripts/us-english.mjs` exit 0.

**Adversarial self-check (step 5) — three real findings, all mine, all fixed in this commit.**
- **Injection 1's misdiagnosis** and **injection 4's silence** are above. The third: after deleting the
  reversal probe, §50's success line still read *"each pair also proven to FAIL when reversed"* — a
  claim about a probe that no longer existed, printed on every green run. Rewritten to what is actually
  proven. This is the §10.1-style failure applied to my own output, and it is the exact trap the task
  file's "your own verification claim" bullet names.
- **Blindspot register:** the diff is `scripts/check-data.mjs` only — **0 files under `src/`**, so no
  learner-facing string moved. 0 hits for Dalio/advice-adjacent patterns in the added lines. The two
  `2026-08-30` strings are both inside `//` comments recording when a measurement was taken, the same
  shape the neighboring comments use — not a rendered date.
- **DECISIONS.md:** no conflict; nothing here touches state, content-module format, or the build.
- **Already-done item:** item 151 was filed by the previous run as its residual. Nothing is redone or
  undone; block (i) is untouched and (j) sits beside it.
- **My own verification claim:** an independent reviewer re-running `npm test` and each of the seven
  injections above gets these results.
- ⚠️ **What I did NOT do, stated rather than rounded off.** The block checks the label *text*. The
  *colors* those labels are drawn in are paired by index too — `LessonVisual.jsx:190-194` — and the zone
  arrays are deliberately the reverse of the series arrays, an inversion that is correct and looks like
  a bug. Swapping `zoneColors` washes each band in the other reward's color while (i) and (j) stay
  green. It is a JSX prop in a file no §50 block reads, so covering it needs either a brittle source
  parse or lifting the color choice into the content module — a real decision, not a ten-line addition.
  Filed as **item 152** with the measurement, rather than smuggled in.

#### Next run

**Item 152** (new, above) is the direct follow-on but is genuinely a design call, not a quick one —
read its two routes before starting. Otherwise unchanged: **148** (real user-visible symptom, wants the
owner's pick), then **149, 144, 143, 140, 126, 120**, all at zero live instances, and **item 117**,
still the one open *product* item and still the owner's. **For the owner:** the floor is over budget at
**302 KB** against 250 KB and only a backlog compression pass moves it — **item 115 holds the rule and
the options, and that decision is still yours.** **O-1 remains the entire critical path: 44 lessons,
five languages, 160 minutes of content, and zero people have ever opened this app.** **O-3** unchanged
— no translated prose was added or altered this run.

### 2026-08-30 (scheduled dev-agent) — §50 now reads the prose instead of asserting about it, and the first version of that read was satisfied by a caption the learner was not looking at (item 150 → new item 151)

**Picked item 150**, the previous run's stated follow-on and its own filed residual. Item 149 was left
alone on its own instruction (*"Honest priority: low. Do not pick it over content"*), and item 148 is
still the product call the run that filed it escalated.

**Premise re-measurement (step 3.5) — both halves held, and the scope was wider than the item said.**
- **Premise 1, "§50 reads no lesson body," is TRUE.** The string "lesson 23's body" appears in §50
  exactly once, inside block (a)'s *failure message*. The section's only `LANGS` loop is block (h)'s
  parity check, which proves the figure's strings are non-empty and nothing else.
- **Premise 2, "all five languages state both figures," is TRUE.** `amountsIn` finds 50 and 65 in
  en/es/ko/zh/ja. Full digit inventory of lesson 23's body, which the item did not have:
  **en/es = {15, 50, 65}; ja/ko/zh = {12, 13, 15, 50, 65}.**
- **What the item missed, and it is the larger half.** `flipCaption`, `flipDescription`,
  `flipZoneLabels` and `flipSeriesLabels` each write $50 and $65 in all five languages — **20 strings
  that render inside the figure**, next to the curves they label — and none of them was checked
  against `flipRewards` either. A stale caption is worse than a stale lesson body, not better. Item
  150 scoped this as body-only; the block ships covering both.

**What shipped:** `check-data.mjs` §50 block (i). Five surfaces per language (the lesson body plus each
of the four figure-text keys), 25 strings, every expectation **derived from `flipRewards`** rather than
typed — so a reward edit moves the expectation instead of leaving a second literal beside block (a)'s.
The body must also state **the difference between the rewards** ($15), which is the number lesson 23
repeats three times and the one a partial edit leaves behind.

**The control, and the thing it cannot be.** §53(f) proves its scan is live with a numeral that is in
the lesson and is *not* the figure's ($1,450). **Lesson 23 has no spare numeral** — its body states
exactly the three amounts the figure uses, and the 12/13 that ja/ko/zh carry are absent from en/es
because both write the months as words ("twelve months", "doce meses"), so a months anchor is not
available either. The control is therefore built from what is there: non-empty text, a non-empty scan
over it, and **$5 must not be found**. $5 is the sharp half — it is a substring of "$50" and of "$65"
in every one of these strings and an amount in none of them, so a `text.includes(String(n))`
implementation fails it immediately. That is not hypothetical: it is the shape every check in this file
used before `numerals.mjs` existed, and the shape this block would most plausibly be rewritten into.
The control's own validity is asserted rather than assumed — a reward edit that made $5 real fails a
guard that names the problem instead of going quietly green.

**Verification — five injections, each restored from a scratchpad copy and re-checked by sha256.**
1. **ko body's three "15달러" → "20달러"** → `FAIL: §50: lesson 23's own body never states $15 (the
   difference the lesson turns on) in "ko"`. Right language, right figure.
2. **zh `flipCaption`'s $65 → $60** → **PASSED. This was a defect in my own check, not a clean
   result.** The first version joined all four figure-text keys into one string per language, so
   `flipDescription` still saying $65 satisfied a scan of a caption that no longer did. Rewritten to
   **one surface per key**; re-injected → `FAIL: §50: the figure's own flipCaption never states $65
   (the later reward) in "zh"`. The joined version is the reason the comment in the block says what
   it says.
3. **`amountsIn` replaced by `{ has: (n) => text.includes(String(n)) }`** → the $5 control fires on
   every surface in every language, exit 1.
4. **`lessonContent["23"]` → `lessonContent["9923"]`** → `failed its own control … 0 character(s) of
   text, 0 amount(s) read` — instrument failure diagnosed as instrument failure, not as content drift.
5. **`flipRewards` → 40/62** → `the $5 control below is no longer a substring of both $40 and $62`.

All three touched files restored byte-identical: `lessonContent.money.ko.js` `bde5d1a2…`,
`moneyVisuals.js` `15fc66f5…`, `numerals.mjs` `b671c210…`. `npm test` exit 0 (0 failures across all
eight scripts), `npm run build` exit 0 in 890ms, `node scripts/us-english.mjs` exit 0.

**Adversarial self-check (step 5) — one real finding, and it was mine.**
- **The finding is injection 2 above.** A green result that came from a string the learner was not
  reading is exactly the failure this section exists to catch, and re-reading the code approvingly
  would not have found it. It is fixed in this commit, not filed.
- **Blindspot register:** the diff touches `scripts/check-data.mjs` only — **0 files under `src/`**,
  so no learner-facing string moved. 0 hits for Dalio/advice-adjacent patterns in the added lines.
  The "2026-08-30" in the comments is a dated record of when a measurement was taken, the same shape
  the neighboring comments use — not a rendered date.
- **DECISIONS.md:** no conflict; nothing here touches state, content-module format, or the build.
- **Already-done item:** this is the third and last of the three figure-vs-prose sections item 127
  named (§21 lesson 7, §53 lesson 17, §50 lesson 23). Nothing is redone or undone.
- **My own verification claim:** an independent reviewer re-running `node scripts/check-data.mjs` and
  then each of the five injections above gets these results.
- ⚠️ **What I did NOT do, stated rather than rounded off.** The block asserts each zone label and each
  series label *states* the rewards; it does not assert **which one states which**. Measured across all
  five languages: `flipZoneLabels[0]`→65 / `[1]`→50 and `flipSeriesLabels[0]`→50 / `[1]`→65, and
  `LessonVisual.jsx` indexes both **by position**. Swapping either pair in one language inverts that
  language's figure and passes everything shipped today. Filed as **item 151** rather than smuggled in.
  Item 150's numeral-format flag (`bracketCaption.ko`'s `$4,000` beside lesson 17's `4만 5천 달러`) was
  left alone as instructed — it is an owner content question, and lesson 23 states no myriad amount.

#### Next run

**Item 151** (new, below) is the direct follow-on, is small, and has a two-sided control that already
exists. Otherwise unchanged: **148** (real user-visible symptom, wants the owner's pick), then **149,
144, 143, 140, 126, 120**, all at zero live instances, and **item 117**, still the one open *product*
item and still the owner's. **For the owner:** the floor is over budget at **297 KB** against 250 KB
and only a backlog compression pass moves it — **item 115 holds the rule and the options, and that
decision is still yours.** **O-1 remains the entire critical path: 44 lessons, five languages, 160
minutes of content, and zero people have ever opened this app.** **O-3** unchanged — no translated
prose was added or altered this run.

> **Entries before 2026-08-30 live in [`AGENT_LOG.archive.md`](AGENT_LOG.archive.md)** — moved
> there in seven passes (2026-08-01→08-08 and 2026-08-09→08-15 on 2026-08-16/17; 2026-08-16→08-22 on
> 2026-08-23; 2026-08-23→08-25 on 2026-08-26; 2026-08-26→08-27 on 2026-08-29; 2026-08-28 on
> 2026-08-30; 2026-08-29 on 2026-09-01), verbatim and
> complete. Between them they cover every
> run before today: the initial scaffold and rebuild, the JSX split, the market-data pipeline,
> lessons 18–44, the per-track content split and the lesson-id renumbering, the routing/deep-link
> work, the claims register, the five-language economy translation of item 93, the landmark/heading
> accessibility arc (items 102–110), and the a11y state matrix and its language and font-scale axes
> (items 111–112). **You do not need to read any of it to pick up work** —
> `reviews/2026-08-16-weekly-review.md` and `reviews/2026-08-23-weekly-review.md` are both shorter
> and better organized than the entries they summarize.
>
> **Neither of the last two passes landed on a review boundary, and that is a finding rather than a
> slip — read W-5.3 in the backlog before archiving again.** The rule's action clause ("entries dated
> before the most recent weekly-review boundary") has now been a **no-op three times**: the most
> recent boundary is still 2026-08-23 and everything before it was already archived, so following the
> rule literally would have moved nothing. The boundary used by both passes is therefore the byte
> target, taken on whole days. **The deeper reason is in W-5.3's note:** the run log is no longer what
> makes this file big.
>
> **⚠️ A day in this run log is not necessarily contiguous — but you no longer have to remember that.**
> The 2026-08-29 pass found 2026-08-27 living in **two blocks** (entry headings at lines 4746–5112 and
> 6182–7237 of `744dc8c`, **1,070 lines apart**), because the log changed direction mid-day: entries up
> to `eb3c11a` (21:18) were *appended* below, and everything after was *prepended* above.
> **`check-log-size.mjs` now scans the run log into REGIONS and says so in its cut plan** (item 142,
> 2026-08-29) — a non-contiguous proposed day prints a ⚠️ line with every piece's line range. The live
> section above is prepend-order (newest first); the archive is ascending.
> *(The "367 lines apart" this note carried until 2026-08-29 was the first block's own length, not the
> distance between the blocks. The blocks and their byte totals were right; only the gap figure was.)*
