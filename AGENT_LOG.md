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
> **The refuting number, unchanged in six days: 40 lessons, 5 languages, 8 check scripts, a claims
> register, 145 minutes of content — and zero people have ever opened this app.**
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
> ### W-5.2 PRIORITY — reserve one run in four for work that is not item 93.
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
    - **Scope, and the trap.** Do *not* let this become another instrument. The deliverable is a
      deploy path and a URL, not a script that checks whether a deploy path exists. **Some of it is
      genuinely an owner action** (choosing a host, holding the account) — so the dev-agent half is:
      make the build deployable as a static artifact, write down exactly what the owner must click, and
      say so in the run output. Flag the owner half in every run until it moves, alongside item 18.

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
    - **Why it was a defect and not a design choice, which is the part worth keeping.** The same
      lessons are gated on every other surface: the Learn path renders 35 of 40 rows `disabled`, and
      a deep link to a locked `#/lesson/40` redirects to `#/learn` — verified live, both directions.
      `DECISIONS.md` deliberately hardened URLs so that "a URL does not unlock a lesson"; an internal
      button was more permissive than the external entry point that was hardened.

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
    - **Check before assuming it is safe:** whether anything parses this file by heading depth.
      `check-data.mjs` §26 and §32 both read it; §32 is depth-agnostic by construction (it strips the
      number and compares titles), but §26 was not written with this in mind. Verify, do not assume.

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
    - **The lesson worth carrying, and it is about instruments, not icons.** The first `public/icon.svg`
      served `200 image/svg+xml` **and rendered nothing** — a `--` inside an XML comment (it named the
      CSS property `--fill-accent`) makes the document unparseable. The HTTP check that a run would
      naturally reach for said "fine", and an icon has no console error and no layout to disturb, so
      **nothing would ever have reported it.** §38 therefore parses the SVG rather than checking the
      file exists. **Open the asset, do not just fetch it.**

102. **✅ DONE 2026-08-25, same run it was filed — found by a live DOM sweep of the built app, not
    by reading code. `<main role="tabpanel">` and `<nav role="tablist">` exposed NO `main` and NO
    `navigation` landmark, and two of three bottom tabs pointed `aria-controls` at ids that did not
    exist. Zero new locale keys.** See the run log.
    > **Why the app's usual answer did not apply:** five other tablists here are inside a landmark
    > already, so the pattern that is right everywhere else was wrong exactly once.

103. **✅ DONE 2026-08-25 (scheduled dev-agent). Shipped — but as a skip-to-NAVIGATION link, not
    the skip-to-content link this item asked for. Three of the item's premises were wrong, and the
    third one changed the disposition. Read the correction before re-deriving any of this.**
    - **PREMISE CORRECTION 1 — the header has ONE tab stop, not two.** The item says a keyboard user
      tabs "the app title, then the 5-option language `<select>`". The app title is a plain `<span>`;
      it has never been focusable. Measured live on all four screens: `header: 1` focusable, every
      time.
    - **THE TRAP THE ITEM DID NOT MENTION, and it is the reason this is a `<button>`.** `lib/deepLink.js`
      owns `location.hash`. The textbook `<a href="#nav">` fires `hashchange` → `resolveRoute` → no
      match → fallback. **Proved live before writing the fix**: an injected `<a href="#probe-nav">`
      clicked from lesson 29 moved the hash `#/lesson/29` → `#/learn` and the `<h1>` from
      "Transactions" to "Welcome to Economic Cycles", with focus left on `BODY`. Control (a click not
      touching the hash): route unchanged.

104. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. DECIDED (a): the list
    now sorts by `relativeStrength.rank`, and the 1M/3M/6M control was NOT removed — because the
    item's argument for removing it was measurably wrong. Guarded by `check-data.mjs` §42.**
    - **Residual, deliberately not done:** the item's option (c) — showing the window's own position
      *as well* — is still available and was rejected as two ranks per row on a beginner screen.
    ORIGINAL TEXT (retained — it is what was measured):
    **[Bug/Content — filed 2026-08-25 by the run that shipped item 102, measured during the same
    sweep and CONFIRMED in both the code and the rendered screen. Not fixed there: which of the two
    halves is wrong is a product judgment, not a mechanical fix.] The Sector screen sorts by raw
    return but labels every row with a *relative-strength* rank, so the rank badges render out of
    order — and the code comment claims the opposite of what the code does.**

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
    2026-08-27 (owner-directed) that corrected its headline figure. The backlog section is
    481,574 → 176,414 → see item 122 for the current number. All item numbers survive and every open
    item stayed byte-identical in both passes.**
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
    - **The second axis is the probe set.** Every sweep in this log has been read for
      `headingOrder`, because that is where the last four defects were. `smallTargets`,
      `horizontalOverflow` and `namelessControls` have been running the whole time and their zeros
      have never been the *subject* of a run — worth one deliberate read across all 19 states,
      especially at the **1.3x font scale**, which no state currently sets.

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
    - **Why both halves were needed: fixing the isolation ALONE makes the heading defect worse.**
      With the background correctly hidden, an `<h2>`-first outline stops being an ordering quirk and
      becomes the entire document. §47 fails on either half, and on a removed Tab trap — which is the
      only reason pairing `aria-hidden` with `inert` is safe here.
    - **What has never been swept in a non-landing state**, all reachable and none measured:
      the Reference sub-screens past their first tab (Glossary term-detail, Market signals, Sector
      performance, Parent guide), the first-run disclaimer modal (which is a focus trap over the
      whole app), `LessonReader` in its COMPLETED state (item 106 measured that one — it is the
      exception), and the Learn screen with a track collapsed. The Practice runner reached through
      **"Practice all questions"** rather than "Start Quiz" is the cheapest of all: it renders the
      identical branch, so it is covered by construction, but it was not measured on 2026-08-25 and
      that is stated rather than implied.

109. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. The suspicion was right
    and the defect was worse than the item guessed: mid-quiz the page had NO `<h1>` at all — its
    entire outline was one `<h3>`. Fixed by making the question the runner's `<h1>` (`headingLevel`
    prop on `<Question>`, default `"h3"` so the lesson reader is untouched), guarded by
    `check-data.mjs` §46 — and the `headingOrder` probe, which called this screen "ok" every time it
    ever ran, was fixed in the same commit. See the run log.**
    - **This is the same trap shape as item 106's, which is why it is worth a run and not a glance.**
      The interesting state is the one a convenient sweep does not reach: there, an all-complete
      `localStorage` seed hid the hook; here, not clicking a button hides the questions. Drive it
      with `javascript_tool` — find the start control by text and `.click()` it, confirm from
      `main`'s own text that the quiz is actually running **before** recording any number, then run
      `headingOrder`. The review queue must be non-empty, so seed `ecycles_review` or complete a
      lesson first; a sweep of an empty-queue Practice screen is the vacuous reading, not a clean one.

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

    <details><summary>Original item text as filed (2026-08-27), kept verbatim</summary>

    **[A11y/Tooling — filed 2026-08-27 by the run that added lesson 23's figure (item 27), as its
    stated residual rather than smuggled into the same commit.] `--line-*` tokens are checked by
    NEITHER contrast section, so a line used as a meaningful graphic is unmeasured.**
    - **Measured, not suspected.** `check-data.mjs` §28 filters `--ink-*` and `--fill-*` against
      `--surface-*`; §28b filters `--graph-*` against `--surface-*`. Both prefix filters exclude
      `--line-*`, on the stated grounds at line ~2711 that a line "is not text" — which is true and is
      not the same as "is not a graphic".
    - **It has already produced one real instance.** Lesson 23's crossing marker was drafted as
      `line.strong` and measures **1.51:1** against the two zone washes. It is a meaningful graphic
      under WCAG 1.4.11 (3:1) and it is **not** redundant, because the two washes it separates are
      **1.01:1 against each other in both schemes** — hue-only, no luminance step. It was caught by a
      live measurement in that run and moved to `ink.muted` (6.20/6.26 light, 6.10/6.06 dark). Nothing
      in the suite would have caught it, and `DECISIONS.md` advertises "zero exemptions" over a set
      that never included it.
    - **Why this is a real piece of work and not a one-line filter change.** Most `line.hairline` uses
      genuinely ARE decorative (card borders, list separators), and 1.4.11 exempts those — so widening
      the cartesian to `--line-*` would fail the build on pairs that are correct. The honest scope is
      to classify the call sites: which `line.*` uses carry meaning (axis baselines, the crossing
      marker, anything a caption refers to) versus which are decoration, then check only the first
      group — the same shape as §28b's own `GRAPH_EXEMPT` classification.
    - **Honest priority: low-medium.** One known instance and it is already fixed. The value is that
      the class is currently invisible. Downstream of O-1 like everything else.

    </details>

124. **✅ DONE 2026-08-28 (owner-directed, as one half of item 135). Built exactly as this item's
    "shape that could work" specified — a live-DOM probe rather than a widened source pattern —
    and proven firing on a REAL figure, not only on a plant.**
    > **Why it shipped with item 135 rather than on its own.** This item wants the live DOM for
    > *border colors inside a figure*; item 135 wants it for *box geometry inside a figure*. Same
    > walk, same `role="img"` boundary, same controls — building them separately would have meant
    > two probes walking the same subtrees.
    > **What it does:** for every `[role="img"]`, every descendant with a non-zero border width is
    > checked against the live values of `--line-hairline`/`--line-strong`, read from the document
    > at run time. **Anything inside a picture is datum, not decoration** — so a line token there
    > is under-contrast by construction (§28b/§51: no line token clears 3:1 on any surface in
    > either palette). Position and containment, the two things that defeat a source scanner, are
    > free in the DOM.
    > **Proven in light AND in dark, which is the trap this repo has hit before.** The token values
    > are read at run time, not hardcoded: the control fires with `#e4ddd2` in light and `#2e2922`
    > in dark. A hardcoded light value would have gone silently blind in dark — the exact failure
    > the Environment note records.
    > **Color normalisation was load-bearing, not plumbing:** a custom property holds `#e4ddd2`
    > while `getComputedStyle` always returns `rgb(228, 221, 210)`, so a string comparison would
    > have made this check permanently silent.
    > **Live result: 0 findings across all figures on 12 lessons** — this item's "zero known live
    > instances" is now measured rather than asserted.
    (Original text below.)
    **[A11y/Tooling — filed 2026-08-27 by the run that closed item 123, as its stated residual
    rather than smuggled into the same commit.] A datum line drawn as a CSS `border` is invisible to
    §51, and that is how the worse of item 123's two defects was actually drawn.**
    - **State:** §51b matches SVG paint attributes (`stroke={line.x}` / `fill={line.x}`) and holds
      all 5 current ones in a complete register. `AsymmetryChart`'s zero line was **not** one of
      those — it is `borderTop: 1px solid ...` on an absolutely-positioned `<div>` inside the plot,
      which is lexically identical to the ~50 card and separator borders that are correctly
      decorative. It was found by reading the file.
    - **Why the obvious widening does not work.** Extending the pattern to `border*` fails the build
      on every card in the app. Telling "a border that frames a box" from "a border that IS the
      plot's datum" needs layout context a source scanner does not have.
    - **The shape that could work, and it is a measurement rather than a parser:** the a11y sweep
      already renders the app. A probe could walk each `role="img"` subtree in the *live* DOM, read
      the computed border color of every descendant, and flag any that resolves to a `--line-*`
      value — position and containment are free there, and the "is it inside a plot" question that
      defeats the static scanner is answered by the DOM. That also generalizes past `line.*` to any
      under-contrast border inside a figure.
    - **Honest priority: low.** Zero known live instances — both are fixed, and §51 covers the SVG
      half permanently. This is the class, written down so the next one is not found by luck.
      Downstream of O-1 like everything else.

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

127. **[Process/Content — filed 2026-08-27 by the run that added lesson 17's figure (item 27), as
    its stated residual rather than smuggled into the same commit.] §53 checks the figure's six
    numbers against the `en` lesson body only, so a translated numeral can drift unseen.**
    - **State:** `check-data.mjs` §53(f) asserts every number in `gapEarners` appears in
      `lessonContent["17"].sections[*].body.en`, with a two-sided control. The other four languages
      get parity checks on the figure's *labels* (§53g) and nothing at all on the lesson's *numerals*.
      A `ko` body that said 4만 where the figure says \$50,000 would pass every check in the repo.
    - **Measured this run, so the item is a guard and not a defect report:** all five languages state
      all six figures today.
    - ⚠️ **The instrument is the hard part, and this run already fell into it once.** CJK uses myriad
      grouping — `4만 5천`, `4万5千`, `4.5万` — so an `en`-style thousands-separator regex returns
      **zero hits on ko/zh/ja and looks exactly like the figures being missing**. That false negative
      cost a real detour here before the raw text was read. Any check written for this item needs a
      per-language numeral normalizer **and a control per language**, or it will report a confident
      clean over three scripts it cannot read.
    - **✅ A WORKED PRECEDENT NOW EXISTS — read it before writing anything (added 2026-08-27).**
      `check-data.mjs` **§54(e)** does per-language prose anchoring for lesson 44's figure: for each
      language it checks that language's legend term against that language's own lesson 42 body, with
      a two-directional control per language. **It found two real defects on the way in** (`es` and
      `zh` labels written as plausible translations rather than the lessons' own terms), which is the
      evidence that the shape works. **It also sidesteps this item's instrument trap entirely by
      matching WORDS rather than NUMERALS** — no myriad-grouping normalizer is needed. §53's residual
      is genuinely harder because lesson 17's figures *are* numerals; the open question is whether a
      per-language numeral normalizer is worth building, or whether §53 should instead anchor on the
      *labels* the way §54 does and leave numerals to `en`. **Decide that before coding.**
    - **Honest priority: low.** It generalizes past lesson 17 — the same blind spot applies to §21's
      and §50's figure-vs-prose checks — which is an argument for doing it once, properly, rather than
      urgently. Downstream of O-1 like everything else.

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
    (Original text below, kept because the reasoning it records is what the correction acts on.)
    **[Process/Tooling — filed 2026-08-27 by the run that reviewed lessons 33/37/39, as the guard
    its own fix has no instrument for.] Each language's quotation convention is a property of the
    corpus that nothing checks, and it has already drifted twice.**
    - **The measurement that makes this an item rather than an opinion.** Classifying every quoted
      span in lesson content by *role* (lesson title vs ordinary quotation) gives a clean per-language
      convention: **`en` curly “ ” for titles 55/55 and ASCII " " for inline terms 28/28**; **`es`
      the same, 49/49 and 23/23**; **`zh` 《》 for titles and full-width “ ” for inline terms**;
      **`ja` 『』 for titles and 「」 for ordinary quotation**; **`ko` 「」 for titles**. These are
      not style preferences — in `zh` and `ja` the halfwidth/fullwidth distinction is typographic
      correctness, and the title/quotation distinction is what tells a reader whether a phrase names
      another lesson.
    - **Two drifts have now been found by hand, one per run.** 2026-08-27: `ja` lesson 30 wrote a
      lesson title in 「」 where 75 others used 『』. Same day: `zh` lessons 3 and 37 wrote inline
      terms in **ASCII U+0022** where 120 others used U+201C/U+201D. **Both were found by a review
      that happened to be looking; neither would have been caught by anything in `npm test`.**
    - **The shape that would work**, and it is close to `check-data.mjs` §55's: walk learner-visible
      strings per language, classify each quoted span as title-or-not by joining against `lessons.js`,
      and assert the per-language convention above. §55 already proves the walk; this adds the
      classification. **The title/non-title join is the load-bearing part** — a naive "no ASCII quotes
      in CJK" rule would be simpler and would miss the `ja` case entirely.
    - ⚠️ **Do not write the `ja` rule as "『』 means title".** Measured: `ja` also uses 『』 for six
      **coined labels and slogans** (『今回は違う』 in lessons 33 and 36, 『美しい/醜いデレバレッジング』
      in lesson 34). That is a coherent Japanese convention, not drift, and a checker that flags it
      would be turned off. The rule that holds is the *converse*: **a lesson title must never appear
      in 「」**.
    - **Honest priority: low-medium.** Zero live instances as of this entry, which by item 130's
      standing reasoning argues for waiting — but unlike item 130's case this one has **regrown twice
      in two runs**, which is the condition item 130 itself names as what would justify building.
      Downstream of O-1.
    - **⛔ The "zero live instances" clause above is the sentence the correction overturns.** It was
      true of `lessonContent` and false of the corpus. **A scope stated in prose is not a scope the
      measurement had** — the same shape as item 128's finding about item 91's "whole-repo scan".

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
    (Original text below, kept because the reasoning it records is what the corrections act on.)
    **[Process/Tooling — filed 2026-08-28 by the run that built `figureClaims` (items 135+124),
    as its stated residual rather than smuggled into the same commit.] Seven of the eleven chart
    primitives still have no declared claim, and for most of them that is correct.**
    - **State:** `figureClaims` covers `outcomeGrid`, `earningsGap`, `lossAsymmetry` and
      `incomeTradeoff` — the four whose captions state a relation that is checkable off the boxes.
      Uncovered: `ProportionBar`, `GrowthCurve`, `BracketStack`, `YieldCurve`, `CycleChart`, `Bar`,
      `PreferenceFlip`.
    - **Why this is not simply "finish the other seven".** A claim is only worth writing where the
      caption asserts something a box can falsify. Two look genuinely worth doing:
      **`ProportionBar`** (lesson 1) — the segments are a division of one number, so their widths
      should be in the stated 1500/900/600 ratio, and that is a real arithmetic claim about the
      render; and **`PreferenceFlip`** (lesson 23) — the whole figure is a CROSSING, and "the two
      series actually cross, exactly once, at the marked month" is checkable from the rendered
      path. §50 asserts that crossing in source arithmetic today, which is the same gap item 135
      was filed about.
    - **The others are weaker candidates and should probably stay uncovered:** `CycleChart` and
      `YieldCurve` draw stylized shapes with no stated quantity; `Bar` and `BracketStack` render
      values whose only relation is "proportional to the number beside them", which §21 already
      asserts and which no reader could check against a caption.
    - **Do not turn this into a coverage count.** That is exactly how item 27 became count-shaped
      three times. The bar is the same one item 135 set: name the sentence in the caption that the
      figure could contradict, or leave it alone.
    - **Honest priority: low.** Zero known live instances. Downstream of O-1 like everything else.
    > ⛔ **PREMISE CORRECTION 2026-08-28, from the run that built the `preferenceFlip` half. Both
    > of this item's two recommendations were wrong, in opposite directions, and the measurements
    > are below so nobody re-derives them.**
    > **`ProportionBar` should NOT be built; "a real arithmetic claim about the render" is the false
    > part.** Lesson 1's three segments render **154.5 / 92.688 / 61.797 px of 309** — exactly
    > 50/30/20 — and stayed 50/30/20 under every perturbation: a **`gap`** on the container
    > (flex-shrink is proportional to the bases), **padding** on a segment (`box-sizing:
    > border-box`), and **28 characters of unbreakable content** in one (`flex-grow: 0` with bases
    > summing to 100% leaves no free space, so `min-width: auto` never binds). **The control
    > fired** — forcing `min-width: 150px` gave **32/19/49** — so the measurement can see a break.
    > The rendered ratio is the value ratio *by construction*: the bar this item sets, failed.
    > **`PreferenceFlip` should be built, and the reason is stronger than the one filed here** —
    > it is not "zero known live instances". It is **item 137**.

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
    (Original text below, kept because the reasoning it records is what the correction acts on.)
    **[Process/Tooling — filed 2026-08-28 by the run that added lesson 28's figure (item 27), as
    the class its own defect belongs to.] Every figure check in this repo reads SOURCE, so the
    proportions a figure actually renders are unguarded — and that is where this run's real defect
    was.**
    - **The instance, measured twice.** `OutcomeGrid`'s whole argument is that its four cells are
      equal. It shipped its first version with the bottom row at **82px against the top row's 52px**,
      and its second at **65 against 52**. Both times `check-data.mjs` §57 passed and every style
      literal in the file was correct: the inequality arrived through **content** — first a label
      inside a cell, then a row heading wrapping to more lines — because CSS grid sizes a row to its
      tallest item. Found by measuring `getBoundingClientRect()` in a live browser, with a control
      proving the measurement could see a difference at all.
    - **Why §57 (e2) is not the fix for the class.** It pins *this* figure structurally (no text in a
      cell, one fixed shared height) and it is proven by injection. But it is one figure's invariant
      hand-written by the run that got caught. The other seven figures have no equivalent, and
      nothing would catch the next one — `GapColumns` asserts two gaps are equal, `AsymmetryChart`
      asserts one bar is taller than another, and both of those are **rendered** claims checked
      against **source** numbers.
    - **The shape that could work, and it already half exists:** `scripts/a11y-sweep.js` renders the
      app and walks `role="img"` subtrees. A probe could read the computed box of every element in a
      figure and assert the relations that figure's caption claims — equal cells, a taller bar, a dot
      clear of a rail (§54 (d) computes that one in source arithmetic today, which is the same gap).
      **This is item 124's probe, from the other side**: that item wants the live DOM for *border
      colors inside a figure*, this one for *box geometry inside a figure*. They are one probe and
      should be built as one.
    - **Do not build it as a generic "figures look right" check** — that is unfalsifiable. Each
      figure would declare the relation it claims, which is the same discipline §50/§53/§54 already
      use, moved from the data to the render.
    - **Honest priority: low-medium.** Zero known live instances — this run's was found and fixed,
      and no other figure is known to be wrong. But it is the only defect class in this file's
      history that shipped *through* a green check written specifically to stop it. Downstream of
      O-1 like everything else.

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
    (Original text below, kept because the reasoning it records is what the correction acts on.)
    **[Content — filed 2026-08-27 by the run that corrected item 131, as the gap that correction
    exposed rather than smuggled into the same commit.] Lessons 1 and 4 point the reader at another
    lesson in English and at nothing in any other language.**
    - **State:** item 84 gave lesson 1 a pointer to "Why 'Later' Never Feels as Real as 'Now'" and
      lesson 4 one to "Productivity Growth". Both sentences are **absent from all four translations**
      — the translated section simply ends a paragraph early. Measured, and confirmed pre-existing:
      those eight translations are byte-identical to their 2026-08-20 state.
    - **It is item 94's shape, not a bug.** Both lessons are `essentials` and abridged; the missing
      sentence is one of many. **Do not fix it in isolation** — translating one sentence into four
      languages inside an otherwise-abridged lesson makes the corpus less coherent, not more, and
      item 94 exists precisely so continuing the essentials tranche is a decision someone makes.
    - **Why it is worth its own number anyway:** these are *cross-track* pointers (money→essentials,
      essentials→economy), the only two in the corpus, and they are the mechanism §3.0.3 uses to make
      the tracks feel like one product. A non-English reader gets no such thread. **Worth naming when
      item 94 is priced, not before.**
    - **Honest priority: low**, and blocked behind an owner decision, not behind effort.

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
    (Original text below, kept because the reasoning it records is what the corrections act on.)
    **[Process/Tooling — filed 2026-08-28 by the run that closed items 131+132, as its stated
    residual rather than smuggled into the same commit.] The corpus's cross-track pointers are now
    40/40 and nothing in `npm test` can tell if that changes.**
    - **State:** 10 cross-track references (essentials→money, essentials→economy, money→essentials,
      money→economy) out of 44 quoted-title references overall. All 40 language instances resolve as
      of this commit. The measurement lives in a scratchpad script; **the repo has no guard.**
    - **Why this clears the bar items 126 and 130 set, which the "one defect is not a class" rule
      would otherwise fail it on.** This is not a hypothetical: the state was **32/40 for eight days**
      (item 84 added the two English pointers on 2026-08-20; nothing carried them into any
      translation) and no check noticed. §16b guards that references are *by title rather than by
      number*; it does not check that a translation carries the reference **at all**. That is a real,
      dated, eight-day live instance.
    - **The shape that would work, and the trap it must avoid.** For each English lesson, resolve
      quoted title heads to lesson ids; for each other language, assert that language's own title head
      for the same target appears in the same lesson. ⚠️ **Split the title on `[:：]`, not `:`** — an
      ASCII-only split makes every `zh`/`ja` head the full title and reports five correct references
      as missing, which is how this run's first measurement got 15 instead of 8. **Any check written
      here needs a per-language positive control keyed to text somebody has actually read.**
    - **Honest scope note:** the same-track references (34 of 44) are the larger set and are already
      correct; a check should cover all 44 rather than only the cross-track subset, since nothing
      makes cross-track special except that it is where the failure happened.
    - **Honest priority: low-medium.** Zero live instances *now*, but unlike items 126/130 this one
      has a closed, dated instance behind it. Downstream of O-1 like everything else.

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

148. **[A11y/UX — filed 2026-08-29 by the run that closed item 147, as its stated residual rather
    than smuggled into the same commit.] Market signals overflows the document by 18px at 320px x
    130% font, and all three candidate fixes were priced and none is obviously right.**
    - **The measurement, reproducible:** `#/reference` > Market signals, viewport 320, font 130%.
      `document scrolls horizontally: scrollWidth=323 clientWidth=305`. The overflowing nodes are
      the `Bar` chart's fifth column and its label span, both extending to 323px. **Clean at 100%
      font and at every width >= 375.** Cause: the columns are `flex: 1` with the default
      `min-width: auto`, so they cannot shrink below the label's min-content width — "tightening"
      is 66px at a 130% root and the column's flex size is 45px.
    - **Three fixes, all measured live in the DOM before any of them was written to source:**
      - **(a) `minWidth: 0` on the column.** Kills the document overflow (323 -> 305) — **and
        produces 3 pairs of OVERLAPPING labels**, because the 66px labels stay 66px inside 45px
        columns. **The probe goes green on this.** ⚠️ Do not ship it alone; that is a worse screen
        than the one it fixes, and `horizontalOverflow` cannot see the difference.
      - **(b) (a) + `width: 100%` + `overflowWrap: break-word` on the label.** No overflow, no
        overlap, all five bars visible. Cost: mid-word breaks. With `hyphens: auto` added, a
        screenshot shows "Pandemic response" rendering as **"Pande / mic / re- / spons / e"** —
        five fragments. **Rejected on looking at it**, which no geometry probe would have caught.
      - **(c) `overflow-x: auto` on the chart row.** No overflow, no overlap, labels intact and
        readable; the figure scrolls inside itself (`scrollWidth 290 > clientWidth 239`).
        Permitted by WCAG 1.4.10, which exempts content needing two-dimensional layout. Cost: the
        fifth bar is off-screen until scrolled — **and this figure's entire teaching point is the
        side-by-side comparison** (its own component comment records an earlier bug where the
        ten-fold expansion "was drawn as four bars of equal height"). A scrollable comparison chart
        is a comparison you cannot make at a glance.
    - **Why it was not decided this run:** (b) and (c) each break something the app explicitly
      values — §3.0's clarity standard and the figure's comparison respectively — so this is a
      product judgment, not a bug with a correct answer. A fourth option nobody has priced: give
      the chart fewer bars, or a shorter label set, at narrow widths.
    - **Honest priority: low-to-medium.** One screen, one configuration, and the configuration is
      the narrowest supported width combined with the largest font step. But it is a **WCAG 1.4.10
      reflow failure** at 320px, which is the width that criterion names. Downstream of O-1.

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
    63 → 67 US forms.** Original text follows.
    [Process/Tooling — filed 2026-08-29 by the run that narrowed §55's `-ise` stems, as its
    stated residual rather than smuggled into the same commit.] §55 has no `hypothesis` stem, and
    `hypothesised` is a British form this repo has actually shipped.
    - **Measured 2026-08-29:** against both the old and the new pattern set, `hypothesised` is
      **MISSED** — the `-ise` stem list has no `hypothesis`, and `emphasis(e|ed|es|ing)` is its own
      pattern that does not generalize. It is named in item 91's own removal list
      (`AGENT_LOG.archive.md:17177`, alongside `localised`/`tokeniser`/`tokenisation`/`stylised`,
      **all four of which the fixed net still catches** — controlled, so the miss is a real gap and
      not an artifact of the narrowing).
    - **This is a coverage gap, NOT a regression from the narrowing.** Neither pattern set caught it.
      Stated explicitly because the obvious suspicion about a run that made a net narrower is that
      it lost something, and the four-word control above is what rules that out.
    - **The fix is one stem, and the shape matters:** `hypothesis` cannot be added to the `-ise`
      list as a bare stem, because `(hypothesis)(e|es|ed|ing|...)` would flag the correct US noun
      **"hypotheses"** — the identical trap that keeps `analyses` deliberately unflagged. It needs
      the `emphasise` treatment: its own pattern over the unambiguous verb forms only.
    - **Honest priority: low.** Zero live instances in learner-visible strings, measured. Do not
      pick it alone — it is one stem, and worth folding into the next run that touches §55.

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
    Original text follows.
    [Process/Tooling — filed 2026-08-27 by the run that built §55, as its stated blind spot.]
    §55 cannot see comments, dev scripts, or Markdown — and that is 21 of the 36 spellings it was
    built in response to.
    - **State:** `check-data.mjs` §55 guards **string values under an `en` key** across the twelve
      content and locale modules — 1,145 learner-visible strings, 16 pattern families, three controls.
      Comments in `src/` and `scripts/`, the check scripts' own prose, and the five normative Markdown
      files are all outside it. They were swept **by hand** in this run and nothing keeps them swept.
    - **Why the scope is narrow on purpose, not by omission.** Item 91's own closing advice was
      "learner-visible strings only", and reading source text rather than values is what drags in the
      three false-positive classes §55's header enumerates: `aria-labelledby`, non-English content, and
      verbatim quotations of deleted text — the last of which is a **live, correct** British spelling
      in `check-data.mjs`, now carrying a `us-english:allow` marker.
    - **The shape that could work:** a source-text net over comments with an honored `us-english:allow`
      marker. **The marker convention already exists and nothing reads it** — 21 occurrences across
      `AGENT_LOG.md`, `AGENT_LOG.archive.md`, `DECISIONS.md` and `LAUNCH_PLAN.md`, placed by earlier
      runs in anticipation of a checker. Making them load-bearing is most of the work.
    - ~~**Do not build it until the hand-swept surface has drifted again.**~~ **✅ THE GATE IS MET,
      measured 2026-08-29, and the drift source is this agent.** A raw scan of comments in `src/` +
      `scripts/` (87 files) and the five normative Markdown files found **7 real British spellings
      in comments**, and `git blame` dated them: **6 of the 7 were written on 2026-08-27 and
      2026-08-28** — `normalised`/`normalising`/`centre`/`neighbour` in `scripts/a11y-sweep.js`,
      `neighbouring`/`labelled` in `scripts/check-data.mjs` — i.e. **after** this item's own hand
      sweep, by the five dev-agent runs `d35218d`/`98f2714`/`24e3757`/`5d3882a`/`7fe2fe5`/`e27d6ea`.
      Only `Capitalised` in `scripts/jargon-candidates.mjs:287` (2026-08-17) predates the sweep and
      is a **miss**, not drift. Plus **2 unmarked** hits in Markdown (`DECISIONS.md:672` `labour`,
      `:708` `licence`) against 4 correctly carrying `us-english:allow`.
      > **That is ~3 new instances per day, all self-inflicted, and it reframes the item.** The
      > surface does not drift because contributors are careless; it drifts because *this agent
      > writes comments faster than anyone re-sweeps them*. A hand sweep is therefore not a cheaper
      > alternative to the checker — it is a thing that decays measurably within two days.
      > ⚠️ **The 7 instances were deliberately LEFT IN PLACE.** Fixing them silently would give the
      > run that builds this checker a swept baseline and no test corpus, and would erase the
      > evidence above. Sweep them *with* the instrument, in the same commit.
      > ⚠️ **Instrument note for whoever builds it, both traps hit live.** (a) The blame loop first
      > returned **seven blank lines** — `set -- $spec` in zsh, which does not word-split, so `$2`
      > was empty and every `git blame -L ,` failed silently. A control line of known age is what
      > caught it. (b) The scanner must use the **fixed** `-ise` pattern: run with the pre-2026-08-29
      > wide stems it reported **45** comment hits against a true 25, because it flagged the correct
      > US words in §55's own new comment.
    - **Honest priority: low → LOW-MEDIUM.** Still zero *learner-visible* instances. Downstream of
      O-1. The `aria-labelledby` false positive (12 in `src/`, 5 in `scripts/`) remains the reason
      the marker must be honored before the net is turned on.

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

121. **✅ DONE 2026-08-27 (scheduled dev-agent, recovering a stalled run); EXTENDED 2026-08-28 from
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
    - **Generalized rule, worth more than this item: a proxy signal fails green, a planted control
      fails loud.** A capability that *can* be measured directly must never be inferred.
    ORIGINAL TEXT (retained — it is what was measured):
    **[Tooling/Measurement — filed 2026-08-25 by the run that shipped item 107, as its stated
    residual rather than smuggled into the same commit.] `scripts/a11y-sweep.js`’s header records
    that `document.hasFocus()` is *permanently false* in this preview pane. On 2026-08-25 it was
    TRUE for an entire session, and that disagreement is unexplained.**
    - **What to do:** re-run the native-listener control (a real `focus` listener on a real button,
      asserting event count) in a session where `hasFocus()` is true. Two outcomes, both cheap and
      both useful: events fire, so a whole probe class (focus-visible, focus order, the tab trap) is
      recoverable and the header’s note 2 needs narrowing; or they do not, and the capability must
      be detected by an actual planted event rather than by `hasFocus()`.

107. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. Shipped as the
    `unnamedRegions` probe in `scripts/a11y-sweep.js`, with a planted control in `selftest()`
    (§43(c) proved able to fail on it) and a five-variant discrimination matrix measured live.**
    - **PREMISE CORRECTION, and it changed the implementation rather than a figure.** The item
      specified the probe as "whose accessible name is empty", which reads as "reuse `accName()`".
      That would have produced a probe that **can never fire**: `accName()` falls back to
      `textContent`, and every `<section>` has contents — measured, the lesson reader’s three real
      sections carry 943 / 685 / 1228 characters each, and a planted bare section names itself
      "body text". **The planted control would have passed against the broken implementation.** A
      landmark’s name never comes from its contents (HTML-AAM), so the probe uses a separate
      `landmarkName()` — `aria-labelledby` (resolved), `aria-label`, `title`, no content fallback.
      Recorded here because the same trap waits for any future name-based probe.

106. **✅ DONE 2026-08-25 (scheduled dev-agent). Fixed by marking up the two block labels the
    lesson reader already had — `as="h2"` on `{t.hookTitle}` and `{t.checkTitle}` — and guarded by
    `check-data.mjs` §45, which was proved able to fail in three modes.**
    - **THE SAMPLING TRAP, and it is the reusable part.** The obvious way to sample all 40 — seed
      `ecycles_completed_lessons` with every id so nothing is locked — **suppresses the defect**: the
      hook renders only while a lesson is UNFINISHED, and the hook's `<h3>` *is* the skip. That sweep
      returns **40/40 clean** and would have closed this item as unreproducible. Unlock by completing
      the **predecessor** only: seed all-but-a-non-consecutive-set and sweep that set; two
      complementary passes (21 + 19) cover the catalog. Seeding `localStorage` on an already-booted
      app does nothing at all (`isUnlocked` reads React state) — lessons redirect to `#/learn` and
      the sweep reports the Learn screen as clean under the lesson's name.

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
    - **What shipped:** `AppError` (`ui.jsx`) with its own copy in five languages — deliberately not
      `LoadFailure`'s, which says the content "couldn't be downloaded" and is a lie about code that
      downloaded fine and then threw; `ScreenBoundary` around App's `<main>`, keyed on `tab` so the
      header and nav survive **and switching tabs is a real recovery** (verified live: Learn crashed,
      tapping Review rendered the queue and cleared the alert); and a **root boundary in `main.jsx`**,
      because `ScreenBoundary` is rendered *by* App and so cannot catch App's own render. The root
      one reads its language from `localStorage` via `loadLang` — verified by crashing the shell with
      `ecycles_lang=ja` and getting Japanese copy from a tree where App never rendered.

100. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `src/lib/chunkError.js` (call-site
    tagging), a function-form `ErrorBoundary` fallback, and `check-data.mjs` §39. Read the premise
    correction first — the defect was real and reproduced live, but "one line of code" was wrong.**
    - **A residual measured and deliberately NOT filed as an item.** A module that downloads and then
      throws while *evaluating* also rejects `import()`, so it gets the download wording. Narrowing it
      means asking whether the rejection is a `TypeError` (what the HTML spec rejects a failed module
      fetch with) — which would trade the known-real case, a content-hashed chunk 404ing after a
      redeploy, against a case the build and `npm test` import on every run. The reasoning is written
      into `chunkError.js` so a later run does not "fix" it back.

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
    See the run log.
    > **Left alone on purpose: two hardcoded `#d97706` literals that are NOT this token — see item
    > 75**, which established that one of them sat in a field nothing renders, so the defect was a
    > false comment rather than a hex.

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
    See the run log.
    > **Standing scope, so the next run does not "finish" it wrongly: suppression applies to the
    > acronym and capitalised-phrase rules ONLY, never to the head-noun rule.** The apposition half
    > was not built because measuring it said so, not out of timidity. The control ships in both
    > directions — a suppression rule must fail by doing nothing *and* by doing too much.

67. **🟡 TWO-THIRDS DONE 2026-08-17 (scheduled dev-agent) — the two terms that needed no new key are
    fixed and rendered-verified; only the `Dividend` half is still blocked.** See the run log.

66. **✅ DONE 2026-08-17 (scheduled dev-agent) — measured, and the instrument is permanent.**
    > **The premise held for once, and the scale held too.** Six of the last seven items had a partly
    > wrong premise. This one predicted "one confirmed instance, the rest unmeasured" and the rest
    > measured out at two more — a rare case where the filing run guessed the shape right. Worth not
    > re-deriving: **`realized gains` appears in zero lessons**, which is the cleanest possible proof
    > that this corpus was genuinely unreachable rather than merely unchecked.

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
    - **§3.2 "The first five minutes... the most important feature."** First-open routing lands a new
      install on **money lesson 1 (Budgeting)** — which has no visual at all. The first thing a new
      learner sees is the case *against* the app's stated differentiator.
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
    > **This item is EXHAUSTED as a reach-driven item. Do not pick it for a third batch without first
    > defining a bar that is not a term count** — and note the candidate list recorded here was
    > re-measured stale on 2026-08-18. A count is not a gap.

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
    - **Measured before proposing:** 93 distinct path references across the four docs; **11 do not
      resolve today**. Four are the real, current breakage item 39's scoping fixed. The other seven are
      exactly the two false-positive classes the exemption vocabulary has to cover, and they are the
      design work: `LAUNCH_PLAN.md`'s `lessons.json`/`quizzes.json`/`glossary.json` name a format the
      project **deliberately rejected** (`DECISIONS.md`: `.js`, not JSON) and must never be "fixed";
      `v5.jsx`/`v6.jsx`/`market.json` are shorthand for paths that do exist elsewhere in the tree.

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
    - **Worth generalizing, and deliberately not done in this run:** §24 checks NUL only. Other things
      make a file effectively unsearchable — invalid UTF-8, a `.gitattributes` binary marking, a
      minified single line. Whether that is worth a broader "every source file is greppable" assertion
      is a real question and an honest scoping job, not an obvious yes.

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
cp economic-cycles-v5.jsx economic-cycles-v6.jsx "$SCRATCH/head/"   # gitignored, so not in the archive
cd "$SCRATCH/head" && npm test
```

**Both extra lines are load-bearing, and each was found by the control failing rather than by reading.**
`check-data.mjs` reaches `src/lib/deepLink.js`, which imports `react`, so a copy with no `node_modules`
dies with `ERR_MODULE_NOT_FOUND` — the scripts are *not* dependency-free, whatever their imports look
like at the top. And `git archive` ships only tracked files, so the two gitignored `economic-cycles-v*.jsx`
are missing and §26's doc-path check reports **7 failures** naming them — a control that fails for its own
reasons, which is the exact trap step 3.5 warns about. With both lines, the `HEAD` copy runs the full
suite to **exit 0**. That gives a two-sided answer: **red on the working tree and green on the `HEAD`
copy means the owner's dirt caused it; red on both means you did.** Used this run to prove
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

> **Entries before 2026-08-28 live in [`AGENT_LOG.archive.md`](AGENT_LOG.archive.md)** — moved
> there in five passes (2026-08-01→08-08 and 2026-08-09→08-15 on 2026-08-16/17; 2026-08-16→08-22 on
> 2026-08-23; 2026-08-23→08-25 on 2026-08-26; 2026-08-26→08-27 on 2026-08-29), verbatim and
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
### 2026-08-29 (owner-directed: "do item 147 next") — the item said no new code would be needed; the compounding width found a chart drawing its bars 9px tall, and the fix the probe would have accepted was worse than the bug (item 147 -> new item 148)

**Picked item 147** on owner instruction, the run after it was filed. Tree clean but for the
untracked `UIUX/` and `drafts/`, neither touched; owner-tree fingerprint
`c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2` (0 tracked modified, 52
untracked) — **identical to the previous run's opening fingerprint, so the owner's tree has not
moved.** `HEAD` `c5c486c` at start and unmoved at commit.

#### Step 3.5 — the premises, and the one that broke

- **The font step exists.** `theme.js` authors scales 0.9 / 1 / 1.15 / **1.3**, and
  `Settings.jsx` labels them `${Math.round(step.value * 100)}%`, so `setFontScale(130)` addresses a
  real control rather than a hoped-for one.
- **The widths are deliverable.** `resize_window` gave 320x812 and 568x320, and `expectViewport`
  asserted each — `viewportMatches: true` on every result quoted below.
- **⛔ "No new code needed — that is the point of shipping the axis first" was WRONG**, and it was
  wrong in the most useful direction: the configuration the item singled out as "the interesting
  one" is the one that produced a finding. The item is closed on the corrected facts.

#### The three configurations

| configuration | result |
|---|---|
| **320px portrait** | **19/19 clean** — 12 no-reload via `runAll`, plus all 7 reload-seeded states driven individually |
| **568x320 landscape** | **12/12 clean**; first-run modal checked specifically (the 2026-08-04 pass named it) — dialog 320px tall, no internal scroll, "Got it" fully visible at bottom 241 of 320 |
| **320px x 130% font** | **11/12 — one finding**, `reference-markets`: `scrollWidth=323 clientWidth=305` |

All 11 sweep controls fired in every session above, so each zero is meaningful. Re-checked at
**375px afterwards: 12/12 clean**, so nothing this run shipped regressed the previous run's baseline.

#### The finding under the finding — which the probe could not see

The 18px overflow is real, but opening the screen at that setting showed something the geometry
probes had no way to report: **the Fed-balance-sheet chart's five bar tracks were rendering 9px
tall.** `Bar` takes a fixed *pixel* `height` (both call sites pass `height={90}`), and a column
spends its height on the value, the bar track and the label in that order — so at a 130% root the
grown text ate the box and the bars, the only part carrying the comparison, were what got squeezed.
**This is the same failure the component's own `minHeight: 0` comment already records** ("a
ten-fold expansion once drew as four equal bars"), reached through the font-scale axis instead of
through flex sizing.

**What shipped** is one line plus its reasoning: `Bar` converts a numeric `height` to `rem` against
the 16px baseline. **At 100% this is arithmetically the same number of pixels** — verified, the box
measures exactly **90px** at 100% at both 320px and 375px — and at 130% it grows to **117px**, taking
the bar tracks from **9px to 51px** with the proportions intact (bars 5/17/22/51/38 against
4/11/15/36/26 at 100%). A screenshot before and after is the honest evidence here: before, slivers
and a misaligned value row; after, five legible bars with the tallest correctly at 9.0.

#### The fix I did NOT ship, and why that is the point

The overflow's obvious fix is `minWidth: 0` on the column. **Measured: it removes the document
overflow (323 -> 305) and produces 3 pairs of OVERLAPPING labels** — 66px labels inside 45px
columns, text on top of text. **`horizontalOverflow` reports clean on that.** Adding
`width: 100%` + `overflowWrap: break-word` + `hyphens: auto` fixes the overlap and renders
"Pandemic response" as **"Pande / mic / re- / spons / e"** — rejected by looking at a screenshot,
not by any probe. The third option, scrolling the figure internally, keeps every label readable but
puts the fifth bar off-screen, and side-by-side comparison is this figure's whole content.
**All three are priced with live measurements in new item 148; none is obviously right, so it is a
product call and not mine to make silently.**

#### One generalization I checked instead of assuming

"Every fixed-px figure has this bug" is the plausible next sentence and it is **false, measured.**
`lossAsymmetry` (lesson 27, `height: 150`) renders bars of **38px and 75px at BOTH 100% and 130%** —
no squeeze. Reading the source says why: `lossAsymmetry` and `earningsGap` keep their labels
*outside* the fixed box, and `Bar` is the only figure that stacks value + track + label inside one
fixed-height column. **One defect is not a class**, which is the rule items 126 and 144 already
record.

#### Verification

`npm test` **exit 0**, 0 failures, the same 3 pre-existing warnings. `npm run build` **✓ 1.78s**.
Chart box measured at 90px at 100% and 117px at 130%. 375px baseline re-swept clean after the change.

#### Step 5 — adversarial self-check

- **Blindspot register:** no content, locale, quiz, glossary or market-copy string is touched — one
  component and a comment. No Dalio branding (§10.2), no advice-adjacent language (§10.1), no
  child-facing framing (§10.3), no live-looking market figure or hardcoded user-facing date (§2.3);
  the dates added are dated *source comments*, which this repo uses throughout.
  `check-blindspot.mjs` passes.
- **DECISIONS.md:** no closed decision is touched — grep finds no decision about chart heights or
  `rem`, and nothing here involves localStorage-only state, `.js`-not-JSON content, or Vite.
  The change is *continuous with* the 2026-08-04 font-scaling work that converted 103 inline
  `fontSize` values to `rem`; this extends the same principle to the one container that had been
  left in px.
- **Already-done item:** nothing in the backlog covers `Bar`'s height. `check-data.mjs` §28b cites
  Bar's `height={90}` comment — **both call sites still pass `height={90}`, so that citation is
  still accurate** and no doc drift was introduced.
- **Item 144's trap:** the new comment does not name the `us-english` marker token
  (`git diff | grep -c` -> 0); §59 passes.
- **My own verification claim:** an independent reviewer re-running the sequence — build, serve,
  `resize_window` to each width, reload, screenshot, one `Tab`, eval both files, both self-tests,
  `expectViewport(<w>)`, `setFontScale(130)` where applicable, `runAll()` — gets these numbers.
- **⚠️ What I did NOT measure, stated rather than rounded off:** the **seven reload-gated states
  were swept at 320 portrait but not at 320 x 130%.** `runAll` covers only the 12 no-reload states,
  and each reload state costs three tool calls. So the lesson and quiz screens are unmeasured at
  the compounding configuration — recorded in item 147's closing note as where the next instance
  would live.
- **What a reviewer could fairly dispute:** shipping the height fix while leaving the overflow open
  means Market signals still scrolls horizontally at 320 x 130%. I judged a legible chart with an
  18px scroll strictly better than an illegible one without it, and the alternative was to make a
  product decision (item 148) inside a run that was chartered to measure three widths.

#### Next run

**Item 148** is the direct follow-on and is the one with a real user-visible symptom, but it wants
an owner opinion between its three priced options. Otherwise: **144, 143, 140, 126, 120** (all
measured at zero live instances), and **item 117**, still the one open *product* item.
**For the owner:** the floor is over budget and only a **backlog compression pass** moves it;
**item 115 holds the rule and the options, and that decision is still yours.** **O-1 remains the
entire critical path: 44 lessons, five languages, 160 minutes of content, and zero people have ever
opened this app.** **O-3** unchanged — no translated prose was added.

### 2026-08-29 (scheduled dev-agent) — nineteen clean states at 375px, and the sweep that would have read identically at desktop width (new items 146 + 147)

**Picked a backlog refill over another zero-instance tooling residual**, which is what the previous
two entries and **W-2's standing rule** both name — and W-5.2's "one run in four is not the tranche"
rule points the same way, the tranche now being meta-tooling about this log rather than item 93. The
refill's method (2026-08-17, items 55-59) is to read `LAUNCH_PLAN.md` against the real `src/` tree and
measure every number with a control. **Reading §3.0 that way turned up work worth doing instead of
filing, so this run did it and filed the residual.** Tree clean but for the untracked `UIUX/` and
`drafts/`, neither touched; `HEAD` `01d0197` at start and unmoved at commit.
**Owner-tree fingerprint observed at start:** `c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2` (0 tracked modified, 52 untracked).

#### What the §3.0 pass rejected before it got to §3.0.7

Three clauses were measured and **not** filed, which is half the value of a refill. §3.0.5's "honest
minutes estimate" is already `check-data.mjs` §2 — `minutes` is derived, not authored, and the build
fails on drift. §3.0.3's undefined-jargon clause is item 60, already open with its own standing note.
§3.0.1/2/4/6 are content-judgment clauses no instrument can hold. **§3.0.7 — "Body text … works at
375px wide" — was the one with two probes built for it and nothing running them at that width.**

#### Step 3.5 — the premise, and the half of it that was wrong

- **The measurement that holds.** `viewportWidth` appears **zero** times in `AGENT_LOG.md` and its
  archive. **Control:** the sibling env keys and axis names DO appear — `htmlLang` 8, `sweepLangs` 18,
  `rootFontSizePx` 2 — so the grep was live and the zero is real. No sweep this matrix has ever run
  has stated the width it ran at.
- **The claim about the code holds.** `a11y-states.js` names exactly **two axes** (language, font
  scale), each with an asserting setter and an explicit lying-zero rationale. `viewportWidth` was
  *stamped* in `env()` and nothing declared, asserted or read it — and the file's own axis comment
  says `horizontalOverflow` and `smallTargets` are "the two probes most likely to fire on a mobile
  viewport", while nothing pinned the viewport.
- **⛔ The premise I started with was FALSE and the step-5 check caught it before commit.** I was
  about to ship "the app has never been swept at 375px". It has — the **2026-08-04** accessibility
  pass covered 375px, 320px portrait, 320px + 130% font, and 568x320 landscape,
  `scrollWidth === innerWidth` everywhere. **Corrected in the code comment and in item 146 rather
  than quietly dropped.** The true gap is narrower and still real: that pass was *one geometry
  equality*, not these eleven probes, and it predates this matrix (2026-08-25), the storage
  preconditions, both other axes, the 2026-08-23 warm palette and serif pairing, and more than half
  of today's 44 lessons. **"Never measured" and "not measured by this instrument, and never stated"
  are different items, and only the second one is true.**

#### The result — §3.0.7 holds, on all nineteen states

Built, served per the Environment note, `resize_window` to mobile **before** measuring geometry (the
note's standing rule), reloaded, screenshot to force layout, one `Tab` to seed the focus state
machine. **Both instruments' self-tests passed in the same session as every reading below** — 11 of
11 sweep controls fired on their planted defects, including `horizontalOverflow` and `smallTargets`.

| what | result at 375px |
|---|---|
| `runAll()` — 12 no-reload states, cold storage | **12/12 clean**, 0 findings, 0 missed, 0 precondition |
| the 7 reload-seeded states, driven individually | **7/7 `ok`**, 0 findings each |
| `smallTargets` / `horizontalOverflow` tally | **12 ok / 0 findings / 0 vacuous** each |

The 7 are `first-run-modal`, `lesson-unfinished`, `lesson-midquiz`, `practice-all-questions`,
`practice-runner`, `practice-batch-pause`, `practice-complete` — i.e. every lesson and quiz screen,
which is where a 375px overflow would actually live.

#### What shipped

One file, `scripts/a11y-states.js` (+121/-5). `expectViewport(px)` declares the width and **throws**
when the DOM disagrees; `env()` gains `layoutViewportWidth`, `viewportExpected` and `viewportMatches`
(`null`, never a silent `true`, when nothing was declared); `runAll()` gains an unconditional
`viewportClaim`; `selftest()` gains a two-sided control. **It is an assertion, not a setter, and that
is the one way it differs from the other two axes** — page script cannot resize the harness pane, so
the honest shape is that the run declares and the file refuses.

⚠️ **A second finding, and a second thing I got wrong once.** `innerWidth` is not the width the app
lays out into: measured on three screens, Practice cold is `375/375`, Reference `375/360`, lesson 1
`375/360`. **The 15px is the harness's classic scrollbar and appears only where the page scrolls** —
my first comment called it "persistent" from a single sample. Corrected. Two consequences are now in
the code: the sweep is *stricter* than a real phone on exactly the scrolling screens (so a clean
`horizontalOverflow` cannot be a false pass in that direction), and `viewportClaim` reports the
**observed range across the sweep** rather than one sample — it now reads `laid out into 360-375px
across 12 state(s)`, where the first version would have said `375px` for a sweep in which ten of
twelve states got 360.

#### Verification

`npm test` **exit 0**, 0 failures (the 3 warnings — two translation, one log-floor — are unchanged
and pre-existing). `npm run build` **✓ built in 1.70s**. `node --check` clean. Every live figure above
was re-taken after the final edit, from cleared storage, in a session whose self-tests passed.

#### Step 5 — adversarial self-check

- **Blindspot register:** no content, locale, quiz, glossary or market string is touched — one dev
  instrument. Nothing reintroduces Dalio branding (§10.2), advice-adjacent language (§10.1),
  child-facing framing (§10.3), or a live-looking market figure (§2.3). `check-blindspot.mjs` passes,
  including item 145's paragraph-initial control.
- **DECISIONS.md:** nothing about localStorage-only state, `.js`-not-JSON content, or Vite-not-Expo
  is involved. Item 12's port-cost rule: this stays a browser instrument and does **not** add a
  headless browser to `npm test`, which is the thing that rule exists to gate.
- **Already-done item:** item 112 built the language and font-scale axes and explicitly scoped
  itself to those two; this is a third axis it named the need for and did not build. Not a redo.
- **Item 144's trap:** the new comment prose does **not** name the `us-english` marker token
  (`git diff | grep -c` → 0), so nothing self-exempts; §59 passes.
- **W-5.3 / item 115:** untouched. No threshold moved, no archiving rule reworded, nothing archived.
- **My own verification claim:** an independent reviewer re-running exactly this — build, serve,
  `resize_window` mobile, reload, screenshot, one `Tab`, eval both files, `A11ySweep.selftest()`,
  `A11yStates.selftest()`, `expectViewport(375)`, `runAll()`, then the seven `begin`/`finish`
  pairs — gets the same numbers. The one thing they must not skip is the `Tab`: without it
  `focusVisibleOnTab` goes UNAVAILABLE and eleven-of-eleven becomes ten.
- **What a reviewer could fairly dispute:** the sweep still cannot be *forced* to declare a width —
  an undeclared sweep is legal and merely says so. I chose that over a hard requirement because
  making every existing call site pass a width to get a result is how an instrument stops being run
  at all; the unconditional `viewportClaim` line means an undeclared sweep can no longer be quoted
  as a mobile one, which is the actual failure mode.

#### Next run

**Open and unblocked: item 147** (the other three widths from the 2026-08-04 pass — no new code
needed, which is the point), then **144, 143, 140, 126, 120**; item 117 is the one open *product*
item and its (a)/(b) halves are owner-reversible judgment calls. Item 76's tokenizer half still
unblocks 76 and item 133's inversion residual.
**For the owner:** the floor is **286,508 b against a 250,000 b budget** measured after this commit's
own writing (281,721 b before it — items 146 and 147 cost **+4,787 b**, which is this entry paying its
own way onto the pile it is reporting), and only a **backlog compression pass** moves it — item 121's entry is right that compression
is a bailing bucket, so the level is a rate and **item 115 holds the rule and the options; that
decision is still yours.** **O-1 is still the entire critical path: 44 lessons, five languages, 160
minutes of content, and zero people have ever opened this app** — this run proved the app is clean at
phone width for nobody. **O-3** unchanged: no translated prose was added.

### 2026-08-29 (scheduled dev-agent) — the cut plan could not see that one of its two days was in two pieces, and the live file is the wrong fixture for proving it now can (item 142)

**Picked item 142** from the open-and-unblocked set the previous run named (144, 143, 142, 140, 126,
120). It is the only one of the six that fires **exactly when someone is under budget pressure and
least likely to check** — and the floor is over budget today, so the next archiving pass is not
hypothetical. The other five are all measured at zero live instances with no forcing event. Tree
clean but for the untracked `UIUX/` and `drafts/`, neither touched. `HEAD` `8a157f6` at start and
unmoved at commit.

#### Step 3.5 — the headline reproduces, both byte figures reproduce exactly, one figure does not

- **The claim about the code is true.** `check-log-size.mjs` accumulated `days` as a
  `Map<date, bytes>` by scanning lines, so it was position-blind by construction, and nothing in the
  cut plan mentioned regions.
- **Both byte totals reproduce to the byte.** Replaying the script's own accumulation over
  `git show 744dc8c:AGENT_LOG.md` gives `2026-08-26 → 77,928 b` and `2026-08-27 → 121,136 b`, exactly
  as the plan printed on the day.
- **2026-08-27 really was two regions**, at entry-heading lines 4746–5112 and 6182–7237.
- **⛔ "367 lines apart" is wrong.** The gap between the blocks is **1,070 lines** (5112 → 6182);
  **367 is the length of the first block** (4746–5112 inclusive). Corrected in item 142 and in the
  run log's archive-pointer note, which had copied the figure forward.
- **Control for the measurement:** the same region scan over the *live* file returns 2 days in 2
  regions, all contiguous — so the scan distinguishes the two shapes rather than reporting "split"
  for everything.

#### What shipped

`splitRegions()` replaces the date-keyed accumulation; `days` is now **derived** by summing regions,
line-for-line identically, so the budget arithmetic cannot move with the refactor. The cut plan gained
a **contiguity line**: contiguous proposals print `all N proposed day(s) are single regions`, and a
non-contiguous one prints a ⚠️ naming every piece's line range and both ways of getting the cut wrong
(splitting the day, or concatenating in file order and writing the archive out of date order). Also
added to control 3's live line: `N dated day(s) in M region(s) … every day is contiguous`.

#### Verification — four runs, and the third is the one that matters

| what | result |
|---|---|
| live `npm test` | **PASS**, exit 0. Every figure byte-identical to the pre-change run: file 448,525 b, run log 166,071 b, floor 282,454 b, dayBytes 163,951 b |
| `npm run build` | **✓ built in 1.90s** |
| the real historical case (script copied to scratchpad, `LOG` repointed at `744dc8c:AGENT_LOG.md`) | same plan as the day it ran — `move 2 day(s) … 2026-08-26 (77,928 b), 2026-08-27 (121,136 b)` — now followed by `⚠️ NOT CONTIGUOUS — 2026-08-27 in 2 pieces (lines 4746-5112, 6182-7347)` |
| negative: live log with `RUN_LOG_MAX` lowered to 100 KB so a plan is forced | `Contiguity: all 1 proposed day(s) are single regions` — the ⚠️ does **not** fire on a contiguous cut |

**And a sabotage test, because the live file cannot be the fixture here.** Making `splitRegions()`
position-blind again (`out.find(r => r.date === currentDay)` instead of checking only the last
region) makes **control 4 FAIL** and the build exit 1 — while **control 3's live line goes on reading
"every day is contiguous"**. That is the whole argument for control 4 existing: today's file has one
region per day, so it can only ever prove the splitter does not hallucinate a split. The positive
fixture has to be synthetic — two in-memory fixtures with the *same three entries*, interleaved vs.
contiguous, asserted at 2 regions and 1 **and at an identical byte total**, so a splitter that
mis-attributes bytes fails too.

#### Step 5 — adversarial self-check

- **Blindspot register:** no content, locale, quiz or glossary string is touched — this is one dev
  script and the log. Nothing reintroduces Dalio branding (§10.2), advice-adjacent language (§10.1),
  child-facing framing (§10.3), or a live-looking market figure (§2.3). `check-blindspot.mjs` passes,
  including the paragraph-initial control item 145 shipped this morning.
- **DECISIONS.md:** no closed decision is contradicted; nothing about localStorage, content-module
  format, or Vite is involved.
- **W-5.3 / item 115:** ⚠️ the one place this could have gone wrong. **No rule was reworded and no
  threshold changed** — `FILE_CEILING`, `FLOOR_MAX`, `RUN_LOG_HARD`, `RUN_LOG_MAX` and
  `UNATTRIBUTED_MAX` are untouched, the script still *computes* the cut plan and still does not
  perform it, and item 115's two options remain the owner's. This adds a fact to a report; it does
  not move a line.
- **Already-done item:** item 121 built this script and item 142 was filed by the run that executed
  its plan, explicitly as a residual rather than smuggled into that commit. This is the filed
  follow-up, not a redo.
- **Item 144's trap:** none of the new comment prose names the `us-english` marker token, so nothing
  is accidentally self-exempting; `§59` passes.
- **My own verification claim:** an independent reviewer re-running the four rows above gets the same
  output. Each mutation is one substitution and is written out above.
- **The judgment a reviewer could fairly dispute:** the ⚠️ fires only when a cut is actually
  *proposed*, not whenever any live day is non-contiguous. A latent split day therefore stays silent
  until it matters. I chose that deliberately — a permanent decoration for a hazard nobody is about
  to hit is how a warning stops being read — but control 3's `ok:` line now states the region count
  unconditionally, so the fact is always visible even when the warning is not.

#### Next run

**Open and unblocked: item 144, item 143, item 140, item 126, item 120.** Item 117 remains open.
Item 76's tokenizer half still unblocks items 76 and 133's inversion residual. All five of the
tooling residuals are measured at zero live instances — **a backlog refill is the more honest pick
than another one of them** (W-2's standing rule), and W-5.2's list is due a re-read of each
candidate's own item before picking.
**For the owner:** the floor is **281,721 b against a 250,000 b budget** and growing ~2,468 b/commit
— compressing item 142 more than paid for this entry, making this one of the rare net-negative
intervals (-733 b), but that is a one-off and only a **backlog compression pass** moves the level, and **item 115 holds the rule and the options — that decision is still
yours.** **O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content,
and zero people have ever opened this app.** **O-3** unchanged — no translated prose was added.

### 2026-08-29 (owner-directed: "do item 145 next") — the item said no shipped instrument was affected; two safety checks were blind to the start of every paragraph, and had been for as long as they have existed (item 145)

**Picked item 145** on owner instruction, the day after I filed it. Tree clean but for the untracked
`UIUX/` and `drafts/`, neither touched. `HEAD` `a0f3aeb` at start and unmoved at commit.

#### Step 3.5 — the premise I wrote one run ago was half right and half false, and the false half was the load-bearing one

- **Claim 1 reproduces exactly.** `/\blenders?\b/gi` over the raw `lessonContent.economy.en.js`
  returns **12**; a substring scan of the same file returns **13**; imported prose returns **13**; and
  **normalizing the literal `\n` to a real newline reconciles the raw scan to 13.** That last one is
  the control — it proves the cause is the escape and not some other difference between the two
  corpora.
- **⛔ Claim 2 — *"No shipped instrument is affected, and that was verified rather than assumed"* — is
  FALSE, and it was assumed.** Last run I checked which scripts *import* the content modules, found
  they all do, and generalized from six of them. The category "instruments that read prose" silently
  excluded **instruments that grep raw files**, which is exactly what `check-blindspot.mjs` does.

#### The live defect

`check-blindspot.mjs` reads `src/content/*.js` raw and applies **seven leading-`\b` patterns**: six
§10.1 investment-advice patterns (en + es) and the §2.3 month-year date pattern. Lesson bodies are one
physical line each, paragraph breaks written as the two-character escape `\n`, so the character before
a paragraph-initial word is the letter `n` — a word character — and the leading `\b` cannot match.

**Proven by injection, same phrase, same file, two positions, injection confirmed present each time:**

| injected string | position | result |
|---|---|---|
| `We recommend buying now.` | paragraph-initial | §10.1 **clean, build PASSES** |
| `We recommend buying now.` | mid-paragraph | §10.1 **FAILS** |
| `January 2026 was the turning point.` | paragraph-initial | §2.3 **clean, build PASSES** |
| `January 2026 was the turning point.` | mid-paragraph | §2.3 **FAILS** |

**The two checks that exist to keep advice-adjacent language and live-looking dates away from learners
were blind to the most likely position for a new sentence.** Not a hypothetical: §10.1 is a closed
blindspot-register item that every run's step-5 self-check cites, and this is the automation that was
supposed to make it mechanical.

#### What shipped

- **`matchesLine()`** — `grepFiles` now expands the literal `\n` to a real newline before matching.
  A newline is a non-word character, which is exactly the boundary the leading `\b` needs.
  **Expansion, not splitting:** splitting would renumber every hit, and the `file:line` in a failure
  message is how the owner finds the offending string. Scope is deliberately narrow and stated in the
  header — only `\n` needed it; `\"` and `\\` already leave a non-word character in front, the CJK
  patterns never had boundaries, and the unanchored patterns were never affected.
- **An executable control**, not a comment. It plants the banned phrases in the corpus's real
  `\n`-escaped storage shape and requires they be caught, **and runs the pre-fix matcher on the same
  line to confirm it still misses** — so "the expansion is load-bearing" is demonstrated rather than
  asserted. It uses **the real pattern objects** via module-level holders rather than a second copy
  (item 141's lesson). Three further branches separate the causes: patterns never captured, patterns
  broken outright, and a false positive on descriptive prose.

#### Verification

**The decisive test is that the two previously-missed injections now FAIL the build** — re-run
verbatim after the fix, injection confirmed present each time. **Regression:** the pre-fix and
post-fix scripts were diffed on the real corpus and the *only* difference is the added control line —
all seven existing `ok:` lines byte-identical, so the expansion produced **zero false positives** on
live content. **Four mutations, each restored from a scratchpad copy:** **M1** revert the expansion →
the control fires naming the item-145 defect; **M2** pattern set never captured → "ran against
nothing"; **M3** widen `/\bbe bullish\b/` to `/bullish/` → the false-positive branch fires on
`"were bullish"` (and §10.1 itself fails on real content, which is why the narrow pattern exists);
**M4** neuter the patterns → "the pattern sets themselves are broken — this is not the escape-handling
case". `npm test` **PASS across all 8 checks, 0 failures**, 2 standing translation warnings unchanged;
`npm run build` clean in 1.62s. Content files restored from scratchpad copies, never `git checkout --`;
`git diff` re-checked before committing.

#### Step 5 — adversarial self-check

- **Blindspot register:** this change *strengthens* §10.1 and §2.3 rather than touching content. No
  lesson, locale, quiz or glossary string is modified. Nothing reintroduces Dalio branding (§10.2),
  advice-adjacent language (§10.1), child-facing framing (§10.3), or a live-looking market figure —
  and the §10.1/§2.3 automation is now strictly harder to slip past than it was this morning.
- **`DECISIONS.md`:** no closed decision is contradicted; this is a bug fix inside an existing script.
- **Already-done item:** nothing in "Completed and pruned" covers this. The nearest neighbor is item
  85 (which added the §2.3 date pattern) — this fixes a hole in that pattern's *application*, not its
  content, and item 85's own stated boundary (English month names only) is untouched and still open.
- **My own verification claim:** an independent reviewer re-running only the commands above gets the
  same four-row injection table and the same one-line regression diff. The mutations are reproducible
  from their descriptions.
- **The judgment a reviewer could fairly dispute:** the control asserts a property of code that is NOT
  shipped (the pre-fix matcher). I kept it because a control that only proves "the fix works" cannot
  distinguish a working fix from a corpus that no longer needs one — and the `ok:` line says which
  case it is, in words, rather than silently passing either way.

⚠️ **The standing lesson, and it is not about escapes.** The false claim was not a guess: it said
*"verified rather than assumed"* and listed the scripts it checked. What made it wrong was the
**category** — "instruments that read prose" quietly excluded "instruments that grep files", and the
sweep inherited that boundary without ever stating it. **A negative result is only as wide as the set
it enumerated, so write down the set and not just the verdict.** This run's sweep is written into item
145 with a reason per script for that reason. This is now the fourth consecutive run to find a control
or a sweep that could not see the case it was written for.

#### Next run

**Open and unblocked: item 144, item 143, item 142, item 140, item 126, item 120.** Item 117 remains
open. Item 76's tokenizer half is still the unblocking work for items 76 and 133's inversion residual.
**A candidate this run created and did not take:** §60's header and item 145 both now assert a sweep
result over ~16 scripts; nothing re-runs that sweep, so it goes stale exactly like a figure. A check
that fails when a script gains a leading-`\b` regex over a raw content read would keep it true — but
**one defect is not a class**, and I am recording it rather than building it.
**For the owner:** the non-archivable floor is **over budget and this entry adds to it** — `npm test`
prints the live number; **item 115** holds the rule and the options, and only a backlog-compression
pass can move it. **O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of
content, and zero people have ever opened this app.** **O-3** unchanged — no translated prose was
added.

### 2026-08-29 (scheduled dev-agent) — two of item 133's three premises were false, the Korean prose was right as shipped, and the measurement it was blocked on turned out not to need the instrument it named (item 133 → §60, new item 145)

**Picked item 133** over the six items the last entry queued (144, 143, 142, 140, 126, 120), because
every one of those is self-marked "low priority, zero live instances" while 133 was the only open
item touching learner-visible content. Tree clean but for the untracked `UIUX/` and `drafts/`,
neither touched. `HEAD` `33897e9` at start and unmoved at commit.

#### Step 3.5 — the premise broke in two places and the disposition changed twice

- **`대출 기관` (with a space) occurs 0 times.** Item 133's headline measurement — "`대출자` 13,
  `차입자` 4, `대출 기관` 8" — reproduces for the first two and is a **string that does not exist**
  for the third. The corpus writes `대출기관`, unspaced, 8 times. Item 127's trap exactly: a run
  trusting the item's own spelling greps, gets zero, and concludes the alternative was never adopted.
- **The 8 uses are a different track, and that kills the item's argument rather than adjusting it.**
  `대출기관` appears **only in `essentials`**; `대출자` appears **only in `economy`**. The split is
  semantic — `essentials` talks about credit bureaus, mortgages and PMI, where the referent is an
  institution; `economy` talks about bond buyers, credit markets and "foreign lenders", where 기관
  would be wrong. So "the corpus already carries an unambiguous alternative and uses it eight times"
  is not a smaller version of the same claim; **there is no drop-in alternative available.**
- **The third claim reproduces and still does not justify an edit.** All 13 `ko` sites read in
  context: every one resolves from its own sentence — the apposition `은행, 신용협동조합, 또는
  딜러`, the verb `빌려줍니다`, `추가 대가를 요구`, and the glossary's explicit `차입자가 내는
  금리는 곧 대출자가 얻는 수익`. **`대출자` is never used for a borrower anywhere.** Item 76's
  standing rule then decides it: *"rewriting them on one run's reading is exactly the unmeasured
  multi-language drift item 69 was filed to prevent — do not treat 'I read them and they look fine'
  as measurement."* **No prose was changed.**

#### The measurement generalized, and that is where the run's value went

Nothing in the repo had ever checked **role vocabulary** in any language. Measured across 5 languages
x 3 tracks: **zero role errors.** `economy` carries lender 13x and borrower 3–4x in every language;
`essentials` lender 8x in every language. Two divergences that looked like defects and are not:
**`es` renders three of English's four "borrower"s as `deudores`** (correct synonym — a count-matching
method would have reported it missing), and **`zh` splits `essentials`' eight lenders as `贷方` 5 +
`贷款机构` 3**.

#### What shipped — `check-data.mjs` §60, 179 lines

En-anchored, in §58's shape: if a track uses a role word >= `MIN_EN` times in English, every
translation must carry that role lexically. **Presence, not counts** — a count tripwire fails on any
legitimate rewrite and gets re-tuned until it means nothing. `MIN_EN = 2` is load-bearing and
measured: English `essentials` uses "borrower" **once** and `ko` renders that one sentence with a verb
phrase, legitimately — **mutation M5 confirms a threshold of 1 fails the build on a correct
translation.** Today it makes 3 assertions (economy/lender, economy/borrower, essentials/lender);
`essentials`/borrower and the whole money track are below threshold and deliberately unasserted.

#### Two instrument traps, one of which made this run's own first number wrong

- ⚠️ **`\b` over the raw `src/content/*.js` files is blind to every paragraph-initial word.** A
  paragraph break there is the literal two-character escape `\n`, so the character before the word is
  `n` and there is no boundary: `/\blenders?\b/gi` finds **12** of 13, silently dropping *"Lenders
  keep lending freely"*. Imported prose finds 13. Caught only because a substring scan and a
  word-boundary scan of the same file disagreed. **Verified no shipped instrument is affected** —
  every prose-reading script imports the modules. **Filed as item 145**; §60's header carries the
  rule at its call site.
- ⚠️ **A confident zero from an incomplete term list, whose obvious control was insufficient.** The
  first sweep reported `zh` economy as **0 lender terms / 4 borrower terms**, which reads as a real
  content defect. The cause was my candidate list: `zh` uses **`放贷者`**, which I had not listed. The
  control I was carrying — borrower terms matched in the same file — proved only that the file was
  being read, **not that the list was complete.** The correct control for a term-presence sweep is
  the English count it must reconcile against, which is what §60 uses.

#### Verification — seven mutations, each restored from a scratchpad copy

**M1** `차입자`→`대출자` in `ko` economy (the exact collapse item 133 fears) → §60 fails, naming
ko/economy/borrower. **M2** `대출자` listed under both roles → CONTROL C fires. **M4** track lookup
repointed to a nonexistent track → CONTROL A fires on 0 chars. **M5** `MIN_EN` lowered to 1 → fails on
ko `essentials`, proving the threshold is measured rather than chosen. **M6/M7** → both CONTROL B
branches fire by name.
⚠️ **M3 is the one worth keeping: it did not test what I wrote it to test.** It made `ja`'s borrower
list identical to its lender list intending to break CONTROL B — but **CONTROL C fired first and B
never ran**, so B was still unproven after a mutation I had counted as proof. M6 and M7 were written
to break B while leaving C satisfied (a term disjoint from the lender form but absent from its own
probe; a term disjoint as a string but matching *inside* the lender probe). This is the third
consecutive run whose control was measured to be blind — see 2026-08-29's CONTROL B string-literal
finding and the `-ism`/`-ist` finding before it.

`npm test` **PASS across all 8 checks, 0 failures**, the 2 standing translation warnings unchanged.
`check-backlog.mjs` **caught a real defect in this commit**: §60's header cited "item 145" before item
145 existed, and the build failed until it was filed. `npm run build` clean. Working tree re-checked
`git diff`-clean of every mutation before committing — restored from scratchpad copies, never
`git checkout --`.

#### Step 5 — adversarial self-check

- **Blindspot register:** the diff is one dev-side script plus `AGENT_LOG.md`. **No lesson, locale,
  quiz or glossary string is touched — deliberately, and that is the run's main finding.** Nothing
  reintroduces Dalio branding (§10.2), advice-adjacent language (§10.1), child-facing framing
  (§10.3), or a live-looking market figure.
- **`DECISIONS.md`:** no closed decision is contradicted; a new numbered section in `check-data.mjs`
  is the established shape, and §60 reads content through the existing imports.
- **Already-done item:** §60 duplicates nothing. It is adjacent to §58 (cross-references survive
  translation) and §54(e) (per-language prose anchoring) and asserts a different property from both —
  those check that a *reference* or a *label* survives; §60 checks that a *role* survives.
- **My own verification claim:** an independent reviewer running only `npm test` sees §60's line at
  3 track-role assertions with control A reporting 13 lender / 4 borrower. All seven mutations are
  reproducible from the descriptions above without anything from this session.
- **The judgment a reviewer could fairly dispute, stated rather than buried:** §60 guards a property
  with **zero live violations**, which this repo's own rule ("one defect is not a class", items 126
  and 144) normally argues against. The distinguishing argument is that lender and borrower are exact
  inverses — the failure mode is teaching the opposite of the lesson, in four languages nobody on the
  project reads — and that the guard is presence-based, so it carries no register to maintain.
  Precedent: item 59 was filed on the same logic ("it guards a property that currently holds").
- **A second dispute worth naming:** §60 **cannot catch a swap**, only a collapse or a drop. A
  translation using `대출자` for the borrower and `차입자` for the lender throughout would pass. That
  is recorded in item 133's closing bullet rather than left for someone to discover.

#### Next run

**Open and unblocked: item 145** (this run's residual), **item 144**, **item 143**, **item 142**,
**item 140**, **item 126**, **item 120**. Item 117 remains open. Item 76 is annotated with what §60
did and did not answer — its tokenizer half is still the unblocking work.
**For the owner:** the non-archivable floor grows again with this entry — `npm test` prints the live
number, and **item 115** holds the rule and the options; archiving cannot move it, only a
backlog-compression pass can. **O-1 is still the entire critical path: 44 lessons, five languages,
160 minutes of content, and zero people have ever opened this app.** **O-3** unchanged — this run
added no translated prose, and deliberately declined to.

### 2026-08-29 (scheduled dev-agent) — the drift source is this agent, so the sweep and the instrument shipped together; and the control that would have missed its own sabotage (items 130 + 141)

**Picked item 130**, the natural queued pick from the last entry, with **item 141 folded in** exactly
as item 141 directed ("do not pick it alone — it is one stem, and worth folding into the next run
that touches §55"). Tree clean but for the untracked `UIUX/` and `drafts/`, neither touched. `HEAD`
`5fb991d` at start and unmoved at commit.

#### Step 3.5 — half the premise reproduced exactly, and the half that did not changed the scope

- **The source-side claim is exactly right.** A cold scan of comments across 87 files in `src/` and
  `scripts/` returns **7 real British spellings, and they are the seven item 130 names**:
  `normalised`/`centre`/`normalising`/`neighbour` in `a11y-sweep.js`, `neighbouring`/`labelled` in
  `check-data.mjs`, `Capitalised` in `jargon-candidates.mjs`. The item's reframing — *the surface
  drifts because this agent writes comments faster than anyone re-sweeps them, ~3/day* — stands.
- **The Markdown claim was measured over two files, not five.** Item 130 records "2 unmarked hits in
  Markdown … against 4 correctly carrying `us-english:allow`". Over the whole normative set it is
  **40 unmarked, 38 of them in `AGENT_LOG.md`**. That is not a bigger version of the same job:
  of the log's 27 real hits (11 more are `aria-labelledby`), **22 are MENTIONS** — and
  `AGENT_LOG.md:1465`, inside item 130 itself, quotes all seven comment spellings by name. **A run
  log that documents a spelling rule must quote the spellings it bans.** So the disposition changed
  before any code was written: `AGENT_LOG.md` is **out of scope on measurement**, its 4 real prose
  spellings are filed as **item 143**, and the section that shipped is narrower than the item asked
  for and says why in its own header.
- **The marker count also moved** — item 130 counted 21 `us-english:allow` markers across four
  files; there are **30** today, the archiving pass having moved 22 of them into
  `AGENT_LOG.archive.md`. Only **4** were ever in files a checker could act on.

#### What shipped

- **`scripts/us-english.mjs` (new)** — the pattern set, `MUST_CATCH`/`MUST_NOT_CATCH`, and a real
  comment tokenizer. §55 now imports it instead of holding its own copy. **Item 141's `hypothesis`
  stem went in here**, in the `emphasise` shape (verb forms only, because a bare `-ise` stem would
  flag the correct US plural "hypotheses" — the identical trap that keeps `analyses` unflagged), and
  both halves are controls: §55's line moved **16 → 17 pattern families, 34 → 38 specimens, 63 → 67
  US forms**, all passing. One list, one pair of controls, two call sites — which is the point:
  item 141 existed because a second copy of a list inherits its gaps forever.
- **`check-data.mjs` §59 (new)** — the same net over **1,111 comment blocks in 87 source files** and
  **1,892 lines of the five normative Markdown documents**. `us-english:allow` is load-bearing from
  today: **13 exemptions honored**, 9 in comments and **4 that earlier runs placed in `DECISIONS.md`
  and `LAUNCH_PLAN.md` in anticipation of a checker that did not exist**.
- **The sweep, in the same commit as the instrument, as item 130 required** — all 7 comment
  spellings fixed, plus `DECISIONS.md:672` `labour`→`labor` and `:708` `licence`→`license`. One
  prose fix rather than a spelling one: `a11y-sweep.js:430` said `aria-label/labelledby`, which is
  not the attribute's name; it now reads `` `aria-label` `` or `` `aria-labelledby` ``, and the
  spec-identifier exemption is a token deletion of that exact string, so the bare word `labelled`
  still fails.

#### Two instrument defects found by their own controls, both of the "clean answer that means nothing" family

- **The first extractor split a comment run at bare `//` lines**, which silently broke the ONE
  marker the repo already had in code: §32's `us-english:allow` sits 8 lines below the quotation it
  exempts, with two bare `//` lines between. The marker landed in a block containing nothing and the
  quotation was reported. Blocks now merge through blank comment lines — and the cost is written
  into the header rather than hidden: a marker's scope reaches the end of its comment run.
- ⚠️ **CONTROL B could not see its own sabotage, which is the finding worth not re-deriving.**
  The control plants a British word in a string literal and asserts it stays invisible. Deleting the
  tokenizer's entire string-handling branch **did not trip it** — because the planted string
  contained no `//`, so a tokenizer that ignores quotes still never enters a comment state there.
  The control was the right shape and the wrong specimen. Both negatives now carry a literal `//`
  (`"see // a colour here"`, `/[//] labour/`), and the mutation fires: *"CONTROL B: the extractor
  reported "colour" from a planted STRING or REGEX literal."* This is the second consecutive run
  whose §55-family control was measured to be blind, after 2026-08-29's `-ism`/`-ist` finding.

#### Verification — six mutations, each restored from a scratchpad copy and re-verified

Every check is a mutation with a known answer, not a re-read: **T1** British word in a real comment
→ §59 fails, naming the line. **T2** the same word in a string value of the same file → §59 clean,
0 failures (the boundary that keeps the net off `us-english.mjs`'s own specimen list). **T3** the
tokenizer stubbed to return whole-file source → CONTROL A fires on the collapsed block count.
**T3c/T3d** string- and regex-tracking deleted individually → CONTROL B fires by name in each.
**T4** the marker made file-scoped → CONTROL C fires: *"Block scope has leaked into file scope."*
**T5** planted line in `CLAIMS.md` → fails; the same line marked → passes. **T6** `AGENT_LOG.md`'s
live British spellings → 0 reported, the documented boundary holding.
`npm test` **PASS across all 8 checks, 0 failures**, the 2 standing translation warnings unchanged;
`npm run build` clean in 1.54s. Files touched by the mutations were restored from copies under the
session scratchpad and `git diff` re-checked clean before committing — never `git checkout --`.

#### Step 5 — adversarial self-check

- **Blindspot register:** the diff is five dev-side files plus two prose corrections in
  `DECISIONS.md`. No lesson, locale, quiz, glossary or market copy is touched; §55's own corpus
  count is unchanged at 1,154 strings. Nothing reintroduces Dalio branding (§10.2),
  advice-adjacent language (§10.1), child-facing framing (§10.3), or a live-looking market figure —
  and the one new user-visible artifact is a build failure message.
- **`DECISIONS.md`:** the two edits are spellings inside existing prose, not decisions; no closed
  decision is contradicted, and a new `.mjs` under `scripts/` is the established shape.
- **Already-done item:** neither 130 nor 141 appears in "Completed and pruned", and the §55 refactor
  removes no coverage — the control counts went up in both directions, which is the check that would
  have caught a silent loss.
- **My own verification claim:** an independent reviewer running only `npm test` sees §55's line at
  17/38/67 and §59's at 1,111 blocks / 87 files / 1,892 Markdown lines / 13 exemptions. The
  mutations above are reproducible from the descriptions without anything from this session.
- **The judgment a reviewer could fairly dispute**, stated rather than buried: `AGENT_LOG.md` is
  excluded from a house-style check while carrying 4 real British spellings. The measured reason is
  above and the remainder is item 143 rather than quietly dropped.

#### Next run

**Open and unblocked: item 144** (this run's residual), **item 143**, **item 142**, **item 140**,
**item 126**, **item 120**. Item 117 remains open.
**For the owner:** the non-archivable floor is **268,921 b against the 250,000 b budget** and this
entry adds to it — archiving cannot move that number, only a backlog-compression pass can, and
**item 115** holds the rule and the options. **O-1 is still the entire critical path: 44 lessons,
five languages, 160 minutes of content, and zero people have ever opened this app.** **O-3**
unchanged — this run added no translated prose.

### 2026-08-29 (scheduled dev-agent) — the fuse was two runs from stopping every future run, and the day it had to cut was in two pieces (W-5.3 archiving pass)

**Picked: the archiving pass**, over the queued item 130, because the previous run's own closing note
priced the log budget as "the shortest fuse in the repo" and the arithmetic had moved from a level to
a deadline. Tree clean but for the untracked `UIUX/` and `drafts/`, neither touched. `HEAD` `744dc8c`
at start and unmoved at commit.

#### Step 3.5 — the premise re-measured, and it was worse than the item said

The previous entry's figures were quoted from a run I did not witness, so they were re-derived rather
than carried:

- **The fuse is real and it is a hard failure, not a warning.** `scripts/check-log-size.mjs:103`
  computes `RUN_LOG_HARD = FILE_CEILING - FLOOR_MAX = 350,000`, and `:323` calls `fail()` — which
  `:497` turns into `process.exit(1)`. `check-log-size.mjs` is the 7th of 8 commands in
  `package.json`'s `test` script, so the failure takes `npm test` with it.
- **Measured at run start: run log 330,738 b, growth +9,885 b/commit, headroom 19,262 b = 1.9 runs.**
  Not 3, as the previous entry estimated — the intervening `§55` commit had already spent one.
  The consequence is the part worth stating plainly: at that point `npm test` fails, and since every
  run is required to pass tests before committing, **no run can commit anything, including a run
  trying to fix it.**
- **What was NOT true, and it changes the disposition rather than a figure.** W-5.3's *literal*
  trigger had still not fired — the file was **596,270 b against its 600 KB clause, 3,730 b under**.
  So the two rules disagree about whether anything is due, and only the newer one can stop a build.
  A run that waits for W-5.3's clause to fire waits past the failure.

#### The finding: `check-log-size.mjs`'s cut plan assumes something the log does not guarantee

The instrument prints `move 2 day(s) — 2026-08-26 (77,928 b), 2026-08-27 (121,136 b)`. Both figures
are correct and were reproduced independently. **But it sums bytes per date into a `Map`, so "a day"
is a total, not a region — and 2026-08-27 was two regions, 367 lines apart.**

The log changed direction mid-day. Entries through `eb3c11a` (21:18) were **appended** below in
ascending order; from `4b0f71f` (22:27) on they were **prepended** above. So the section read:
08-29, 08-28 x12, **08-27 x3 descending**, 08-26 x9 ascending, **08-27 x9 ascending**.

- A cut that took the day as one region would have **split 2026-08-27** and left three of its entries
  stranded above a gap.
- A cut that concatenated the blocks in file order would have written the archive
  **08-27, 08-26, 08-27** — corrupting the ordering invariant every future reader relies on.
- Each entry's true position was established from **`git log` commit timestamps**, not from its
  position in the file. The three prepend-era entries (23:43, 22:27, 21:18) are therefore **reversed**
  in the archive, which now reads ascending throughout.

#### Verification — five controls before the write, two proofs after

Deliberately including a negative control and a self-refuting one, since a lossless-move check is
exactly the shape that passes by doing nothing:

- **A (contiguity):** the moving blocks are jointly contiguous and are the whole tail of the section
  (lines 4746–7347). Had they not been, the splice would have been a multi-region delete.
- **B (agreement with the instrument):** per-date totals recomputed from scratch = **77,928 b** and
  **121,136 b**, matching `check-log-size.mjs` exactly. This is the control that says my parser and
  its parser see the same file.
- **C (losslessness):** 2,602 lines / **199,064 b** are a byte-exact permutation of the original
  region; 21 entries; nothing edited.
- **D (negative):** the chronological order must *differ* from raw file order — asserted, because if
  the reorder were a no-op every other control would still pass and the archive would be wrong.
- **E (monotonicity):** the 21 archived entry dates are non-decreasing.
- ⚠️ **One control failed and it was mine, not the data's.** The first losslessness proof asserted
  `kept + moved === original`, which cannot hold when the point of the pass is to reorder part of it.
  It was replaced with the honest pair: *`kept` is a byte-exact prefix of the original* (which pins
  all reordering to the moved half) **and** *`kept + moved` is a lossless permutation of it*. An
  order-sensitive equality would have failed for the one reason that is not a defect.
- **After the write, reproducible by anyone from git:** all **21 entries are byte-identical to
  `git show 744dc8c:AGENT_LOG.md`**, 0 missing, with a planted entry correctly absent (negative
  control). The live run log now contains only 2026-08-28 and 2026-08-29.
- `npm test` **PASS, 0 failures** across all 8 checks; `npm run build` clean in 1.57s. The run-log
  budget is now **132,195 b of 250,000 b warn (52.9%), 11.9 runs of headroom**, down from 1.9.

#### What this pass deliberately did NOT do

**W-5.3's rule text is untouched, and its defect is still open.** The rule's trigger (600 KB whole
file) and action clause (a review-boundary date) still disagree with each other, and its correction —
making the action clause byte-driven — is the rule change W-5.3 explicitly reserves to the owner.
**Performing the pass and rewriting the rule are different acts**; this run took only the first, on
the authority W-5.3 itself grants ("that is a legitimate whole run") and the instrument prints on
every `npm test` ("An archiving pass is due"). **Item 115 is still the owner's decision**, and the
floor is why it still matters: **265,532 b against a 250,000 b budget, and archiving cannot move it.**

#### Step 5 — adversarial self-check

- **Blindspot register:** no app content, copy, or token was touched — the diff is two Markdown log
  files. Nothing re-introduces Dalio branding (§10.2), advice-adjacent language (§10.1), child-facing
  framing (§10.3), or a live-looking market figure. The dates written here are dated records in a log.
- **`DECISIONS.md`:** no architectural decision is implicated; no code changed.
- **Already-done item:** the 2026-08-26 and 2026-08-27 passes archived *different, earlier* days
  (through 08-25). W-5.3 is a standing recurring rule, not a one-shot item, so this is a recurrence,
  not a redo.
- **My own verification claim:** an independent reviewer re-running only `npm test` sees the
  132,195 b figure, and the 21-entry byte-identity proof re-runs against `git show 744dc8c` without
  needing anything from this session. That is the check I most wanted to fail and it holds.
- **The one judgment a reviewer could fairly dispute**, stated rather than buried: whether an
  unattended run should archive at all while W-5.3's literal trigger has not fired. The previous run
  decided no. I decided yes, because the alternative on the measured arithmetic is a build failure in
  1.9 runs that blocks the owner too, and because the action is non-destructive and reversible. If the
  owner disagrees, the fix is one `git revert`.

#### Next run

**Open and unblocked: item 130** (still the natural pick, its gate met and dated), **item 141**,
**item 140**, **item 126**, **item 120**. The log budget is no longer the constraint for ~12 runs.

**For the owner — one decision, now the only one in this file with a deadline attached.** The
non-archivable floor is **265,532 b against 250,000 b and growing +2,749 b/commit**; the backlog alone
is 237,988 b of it. **Archiving can never touch this number** — only a backlog-compression pass can,
and **item 115** records both the rule and the options. This pass bought the run log ~12 runs of room;
it bought the floor none.
**O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app.** **O-3** unchanged — this run added no translated prose.

### 2026-08-29 (scheduled dev-agent) — the check that teaches economics would have failed the build on the word "capitalism", and the control written to catch that could not see the shape (§55)

**Pick.** Started on **item 130** (extend §55's US-English net past learner-visible strings), whose
own gate is *"do not build it until the hand-swept surface has drifted again"*. Re-measuring that
gate is what a run is supposed to do before building — and the scan came back with a finding about
**§55 itself** that outranked the item. Item 130's gate result is recorded in the item (it is met);
this run shipped the §55 fix instead, because a live defect in an existing check beats extending it.

#### The defect

§55's `-ise/-isation` family was written as **`(stem)\w*`** over 21 bare stems. Every one of those
stems is also a prefix of a correct **US** noun or adjective, so the net flagged **19 correct US
words**: `capitalis` → *capitalism, capitalist, capitalists*; `realis` → *realism, realist,
realistic, realistically*; `criticis` → *criticism, criticisms*; `organis` → *organism, organisms,
organist*; `specialis` → *specialist(s)*; `apologis` → *apologist*; `stylis` → *stylish, stylist,
stylistic, stylistically*.

**This app teaches economics.** The first lesson to use the word *capitalism* would have failed the
build with `-ise/-isation → -ize/-ization` and the standing instruction *"If it is a verbatim
quotation, it does not belong in shipped content — reword it."* **A check that tells its author to
corrupt correct content is worse than no check** — and §55 is currently green only because the
corpus happens not to contain the word yet (measured: **0 occurrences** of all 19 across `src/`
and `drafts/`).

**Two live false positives already existed** and are now gone: `stylistic` in
`check-data.mjs:7628` and in `LAUNCH_PLAN.md:144`. Both are outside §55's scope, which is exactly
why nothing had noticed.

#### The half that makes it a property, not a patch

**CONTROL C exists to catch precisely this** — its own comment says *"A pattern was widened into a
suffix rule"* — and it could not, because its 44-word US list contained **no `-ism`/`-ist`/`-ic`
derivation of any kind**. It held *organized, analysis, exercise, compromise, expertise, otherwise,
surprise, franchise* and nothing shaped like *criticism*. So both halves shipped together: the
suffix set is now explicit (`e|es|ed|ing|er|ers|ation|ations|ational|able`), and the 19 words are in
CONTROL C. **Fixing the net without the list would have left the next stem free to reintroduce it.**

#### Verification — four injections, each restored byte-identically from a scratchpad copy

| # | Injection | Result |
|---|---|---|
| 1 | `organise` into `glossary.GDP.en.f` | `FAIL §55: glossary.GDP.en.f uses the British spelling "organise"` |
| 2 | `capitalisation` into `glossary.CPI.en.f` | `FAIL §55: glossary.CPI.en.f … "capitalisation"` |
| 3 | stem re-widened to `\w*` | `FAIL §55 CONTROL C:` naming **all 19** |
| 4 | `ation` dropped from the suffix set | `FAIL §55 CONTROL B:` naming *capitalisation, utilisation, organisational* |

Injection 3 is the one that matters: it proves the guard **now sees the class it was blind to**.
§55 reports **34 British specimens flagged / 63 US forms silent** (was 29 / 44). `npm test` PASS
(0 failures, the 4 pre-existing warnings unchanged), `npm run build` ✓ 1.81s. Restores verified by
`shasum`, never `git checkout --`.

**Coverage was controlled in the other direction too**, since the obvious suspicion about a narrowed
net is that it lost something: `localised`, `tokeniser`, `tokenisation`, `stylised` — four forms item
91 actually removed from this repo — are **all still caught**. `hypothesised` is **missed**, by both
the old and the new pattern, and is filed as **item 141**.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. The diff touches one check script; no learner-visible
  content, no Dalio, no advice language, no kids framing, no market figure. The one date added
  (`2026-08-29`) is a dated record of when a code change landed, not a live-looking figure.
  `check-blindspot` PASS.
- **DECISIONS.md** — no conflict; nothing here touches state, module format or the build tool.
- **Already-done item** — grepped `stylis|apologist|-ism/-ist|suffix set` across both log files:
  5 hits, all unrelated ("stylistic"/"stylised" in figure-design prose). **No run has narrowed
  these stems before**, and this does not redo item 128 (which *built* §55) or item 130 (which
  *extends its scope*) — it corrects a pattern inside it.
- **Own verification claim** — reproducible from `node scripts/check-data.mjs`, `npm test`,
  `npm run build`, and the four injections above. **What I am NOT claiming:** (1) that this was ever
  a *shipped* defect — it was latent, 0 live instances, and saying otherwise would overstate it;
  (2) that the other 15 pattern families are free of the same widening — I checked them by reading
  and only the `-ise` family uses bare stems with an open `\w*`, but that is a reading, not a sweep.
- ⚠️ **One instrument failure worth carrying, because it produced a confident wrong answer.** The
  first false-positive probe printed **`count: 0`** — the shell mangled `\\b` into a literal
  backslash-b, so the regex matched nothing and the screen said the defect did not exist. It was
  caught only because the probe carried a positive control (`organised` must match) on the next
  run. **The zsh/heredoc escaping layer is an instrument, and it fails silent-green like any other.**

#### Next run

**Open and unblocked: item 130** — its gate is now **met and dated** (7 British spellings in
comments, 6 of them written by dev-agent runs on 2026-08-27/28, ~3/day, all deliberately left in
place as that build's test corpus). It is the natural successor to this run. Also open: **item 141**
(one stem, fold into the next §55 change), **item 140**, **item 126**, **item 120**.

**For the owner — the log budget, and it is now the shortest fuse in the repo.** Quoting the tool
rather than retyping it, before this entry: `MEASURED log-size: file 585255 b, run log 323432 b,
floor 261823 b (backlog 234279 b), archive 2077529 b, 3 live day(s)`. The run log is **73 KB over**
its warn budget and grows **+9,406 b/commit**, so it reaches the **350 KB hard-fail** in roughly
**three more runs** — at which point `npm test` fails and *no run can commit anything*.
**I did not archive, deliberately.** W-5.3's rule as literally written has not fired (it triggers at
600 KB whole-file; the file is 585 KB), and its byte-driven replacement — *archive whole days,
oldest first, until under target* — is the rule change W-5.3 explicitly reserves to the owner. The
instrument already prints the exact cut (`move 1 day(s) — 2026-08-26 (77,928 b) — leaving
245,504 b`). **This needs a one-line decision, not a run's judgment**, and it now has a deadline
attached rather than a level. **Item 115's floor options remain pending for a fourth day.**
**O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content, and
zero people have ever opened this app.** **O-3** unchanged — this run added no translated prose.

### 2026-08-28 (owner-directed: "do item 136 next") — the axis change that would have swapped the two lines in lesson 3's caption, and the three figures that stay uncovered on measurement rather than on judgment (item 136)

**Pick.** Owner-directed. **HEAD had moved before this run started** — `0ad034f` (item 139) and
`5d3882a` (item 116) landed from scheduled runs, plus a market-data refresh — so the log and the item
were re-read against the current tree rather than the one this session last saw.

#### Step 3.5 — what was actually left of item 136, which is not what the item's summary says

The item is written as "seven of the eleven chart primitives have no declared claim", and both of its
two named candidates have since been **resolved by other runs**: `ProportionBar` was **refuted** by
measurement (its ratio claim is true by construction under every perturbation), and `PreferenceFlip`
was **built** by item 137's run. So the live remainder is the **five** the item dismissed in one line
as *"weaker candidates [that] should probably stay uncovered"* — and that judgment was formed at
filing time by the same reasoning that got both of its other recommendations wrong. It was re-derived
from each figure's actual caption and text alternative, which is what the item's own bar asks for:
**name the sentence the figure could contradict, or leave it alone.**

⛔ **Two of the five clear that bar, and the item's stated reason for dismissing one of them is
factually wrong.** It groups `Bar` and `BracketStack` as rendering "values whose only relation is
*proportional to the number beside them*, which §21 already asserts". That describes `Bar`. It does
not describe `BracketStack`, whose caption opens: *"Below the old income line the two stacks are
**identical** — a raise cannot reach back and re-tax what was already there."* That is an **equality
between rendered boxes in two different columns** — the same shape as `outcomeGrid`'s claim, and the
same shape as the defect that shipped there twice.

⛔ **And the strongest candidate of the five was not discussed at all.** Lesson 3's `GrowthCurve`
carries four render claims in its own text — *"rising from the **same starting point**"*, *"simple
interest climbs in a **straight line**"*, *"compound interest **curves upward**"*, and the caption's
*"the gap **widens** every year"*.

**The measurement that settled it, and it is why this is not a coverage count.** Both figures' claims
are true of the source arithmetic **by construction** — which is exactly the finding that killed
`ProportionBar`. The difference is whether a *contemplated* edit breaks them, and for `GrowthCurve`
one exists with a date on it: **item 137 gave lesson 23's figure a logarithmic y-axis on 2026-08-28
and explicitly declined to do the same here**, on the judgment that this figure prints its endpoint
values as text. **That decision had no instrument.** Recomputing this figure's own values in its real
plot box under a log axis:

| | deviation from own chord | |
|---|---|---|
| "straight line" (simple) | **0** linear → **6.69** log | bends by 2.7 stroke widths |
| "curves upward" (compound) | **15.61** linear → **0.01** log | flattens to a straight line |

**A log axis does not weaken the caption — it swaps the two descriptions.** That is a live risk on a
decision made the same day, not a hypothetical.

#### What shipped

1. **`charts.jsx`** — `data-figure`/`data-figure-part` on `GrowthCurve` and `BracketStack`. Inert
   markup; nothing renders differently.
2. **`a11y-sweep.js` — two new `figureClaims` entries.**
   - **`growthCurve`** asserts all four sentences: the series start together, the lower one is
     collinear within half a stroke, the upper one departs by more than a stroke, and the drawn gap
     never narrows. **Which series is which is read off the render** (the one finishing higher is
     compound), so the claim does not depend on the order `compoundSeries` lists them in.
   - **`bracketStack`** asserts the caption's first sentence: every shared lower band renders at the
     same height in both columns, and the second column carries more bands than the first.
3. **Two planted controls plus two expectations**, each keyed to a number the real app cannot produce
   (a 9.00px stroke; a 30.00/17.00px band pair). Both plants are tuned so **exactly one** message
   fires — a control that fires four ways cannot tell you which half rotted.

#### The three that stay uncovered — now on measurement, not on judgment

- **`YieldCurve` (lesson 36).** Its four descriptions do state orderings ("the 2-year sits above the
  30-year"). But the curve is a **hardcoded SVG path string per type** (`CURVE_PATHS[type]`) — there
  is no data→render mapping to break, so a claim would assert a literal against itself. **A stronger
  reason than the item's "no stated quantity", which was wrong: the quantities are unstated but the
  orderings are not.**
- **`CycleChart` (lessons 32/33/38).** Same shape — two fixed `<path d="M0,50 Q37,50 …">` constants.
  Genuinely stylized; the item was right.
- **`Bar` (lesson 37).** Here the item's reasoning holds: heights are `|value|/max`, the caption's
  "two large rises, each followed by a smaller fall" follows from values §21 already asserts, and
  **the figure prints each value as text above its bar** — the same property item 137 used to justify
  keeping `GrowthCurve` linear. `minHeight: 2` cannot bind (the smallest bar is 10% of the track).
- **`ProportionBar` stays refuted.** Not rebuilt — that would have been the duplication trap.

#### Verification

- **`npm test`: 7 scripts, `PASS: 0 failure(s)` on each.** `npm run build` ✓. `check-blindspot`
  **PASS, 0 failures**.
- **Live sweep, per the Environment note** (build → `python3 -m http.server` → `preview_start` with a
  plain `url` → screenshot to force layout → one `Tab` → paste the file):
  - `A11ySweep.selftest()` on lesson 3 and again on lesson 7: **`figureClaims: "control fired"`,
    `failedProbes: []`, `plantsRemoved: true`, `appFindingsAfterCleanup: 0`.**
  - **The control genuinely covers both new halves**: the selftest matches its expectation array with
    `want.every(...)`, checked in the source rather than assumed, so all **six** regexes had to hit.
  - ⚠️ One intermediate run reported `failedProbes: ["focusVisibleOnTab"]` — because that reload had
    not been followed by a `Tab`. Re-seeded and re-run clean. Recorded because it is the file's own
    documented precondition doing its job, not a defect in this change.
- **The decisive test was run against the REAL figure, not only the plant.** Item 137's contemplated
  edit was applied to lesson 3's live polylines — same source values, same plot box, log y-axis — and
  `growthCurve` fired **both** halves with the predicted numbers: *"the lower series departs from its
  own chord by **7.36px** against a 2.75px stroke"* and *"the upper series departs … by only
  **0.01px** … so it draws as a straight line too."* **Restoring the original points returned the
  sweep to 0 findings**, so the control comes back down as well as up.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression: `check-blindspot` **PASS, 0 failures**. No learner-visible
  string changed in any language; the `charts.jsx` diff is data attributes and comments. No Dalio
  reference, no advice-adjacent verb, no kids framing, no date or market figure.
- **`DECISIONS.md` conflict** — none. No state, content-module or build decision is touched.
- **Already-done backlog item** — **checked specifically, because this item had one waiting**:
  `ProportionBar` was refuted on 2026-08-28 and rebuilding it would have been the trap. It was not
  built, and the refutation is restated above so the next reader does not re-derive it.
- **Item 136's own warning — "do not turn this into a coverage count"** — honored explicitly: **2 of
  5 built, 3 declined with a measured reason each**, and the two built were chosen by the test of
  whether a contemplated edit breaks the claim, not by how many boxes remained unticked.
- **The latent false positive I went looking for and found**: `data-figure` sits on the **primitive**,
  and `GrowthCurve` is generic. Only lesson 3 uses it today, so claim and caption agree — but a second
  lesson drawing two curving lines through it would inherit a claim its own caption does not make and
  fail on correct copy. Written into the probe as a reuse caveat with the fix (move `data-figure` to
  the call site, don't loosen the claim). **The same latency already applies to `lossAsymmetry` and
  `outcomeGrid`**, so this documents an existing convention rather than introducing a new risk.
- **Own verification claim** — reproducible from `npm test`, `npm run build`, `npm run check-blindspot`
  and the live sweep sequence above. **What I am NOT claiming:** (1) that `figureClaims` runs in
  `npm test` — it does not, it is a pasted browser instrument, and that is item 12's port-cost
  territory as its own header says; (2) that these two claims cover their figures' captions
  completely — the compound caption's *"by year 30 it is more than twice as wide"* is deliberately
  **not** asserted, because "twice as wide" as what is genuinely ambiguous in the sentence and a claim
  should not invent a reading.

#### Next run

**Item 136 is closed.** The `figureClaims` set is now **7 of 11 primitives**, and the remaining four
are documented as deliberately uncovered with the measurement behind each, so a future run can stop
re-deriving them. Open and unblocked: **item 130** (low). **Item 27** remains ratio-blocked under
W-5.2; **item 26**'s stream is complete but for one standing owner decision.
**For the owner, and this is the one that keeps getting worse:** both log budgets are over — quoting
the tool rather than retyping it, `MEASURED log-size: file 585178 b, run log 323355 b, floor 261823 b
(backlog 234279 b), archive 2077529 b, 3 live day(s)`, taken with this entry and item 136's closure
already in place (the commit adds nothing further to the log). The run log is **73 KB over** its warn
budget and the never-archivable floor is **11.8 KB over** its own. Archiving
clears only the first; **item 115's two options for the floor remain the owner's, and have been
pending for three days.**
**O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app.** **O-3** unchanged — this run added no translated prose.

### 2026-08-28 (scheduled dev-agent) — an invisible focus ring was green across the entire build, and the token that hid it was the right hex for the wrong reason (item 139)

**Pick.** Item 139, from the backlog — the previous run filed it as its own stated residual and named
it first among the open-and-unblocked items. It is the contrast half of the focus-indicator question
that `focusVisibleOnTab` (item 116) explicitly cannot answer: that probe asks whether the indicator
**changes**, never whether anyone can **see** it.

#### Step 3.5 — re-measuring the premise, with a control. Two of the item's claims were wrong.

**(1) The WCAG citation.** The item asks for "**2.4.11** (focus appearance)". In WCAG 2.2, 2.4.11 is
*Focus Not Obscured (Minimum)*; the appearance criterion is **2.4.13 and it is AAA**, and it governs
the ring's **area and thickness** as well as its contrast. The AA criterion that actually binds a
focus indicator's contrast is **1.4.11**. §28c asserts 1.4.11's 3:1 and says so; 2.4.13's area half
is left uncovered and named as uncovered, rather than being quietly claimed by a check that measures
color.

**(2) "The ring currently clears AA everywhere §28 already measures it" — §28 does not measure it at
all.** Read off the source rather than from the item: §28's pair set is `--ink-*` x surfaces plus
`--ink-on-fill` x fills, and §28b's is `--graph-*` x surfaces. **No section in the suite paired the
ring token against a surface.** The reason it *looked* covered is a coincidence of the palette —
`--ink-accent` and `--fill-accent` hold the **same hex** in both palettes (`#2f43c4` light,
`#a9b6ff` dark), so §28 was computing the identical number for an unrelated pair.

**The control that settles it, and the finding of this run.** Repoint `:focus-visible` at
`--line-hairline` — a token both §28 and §28b deliberately exclude, because a line is not text and
not a graph — and run the suite: **14 failures, every one of them §28c, and zero from anything
else.** Before this commit that same edit was **PASS: 0 failures**. A focus ring at **1.24:1 on
`--surface-canvas`** — invisible to every keyboard user in the app — was green across the whole
build.

#### What shipped

`scripts/check-data.mjs` **§28c** (132 lines, one section, no other file touched):

- **The ring token is DERIVED from the rule, not hardcoded.** §28c reads `:focus-visible`'s own
  `outline` declaration out of `index.css` and pulls the `var(--…)` from it, so repointing the ring
  moves the check with it. A missing rule, an `outline` set to a literal color, or a token the
  palette does not define are each their own failure with their own message — for a contrast check,
  "matched nothing" would otherwise read as a pass, which is the trap §28's own header warns about.
- **14 pairs**: the ring token x all 7 `--surface-*` tokens, in both palettes, at 3:1. It reuses
  §28's `contrast()` — the one that self-tests against three published probes first — rather than
  carrying a second luminance implementation.
- Wider than the finding, like §28b: only 2 of the 7 surfaces carry a focusable today, but all 7
  are asserted so a control may move onto a wash without reopening the question.

#### Verification

- **`npm test` → PASS: 0 failure(s), 2 warning(s)** (both pre-existing and owner-blocked: the run-log
  and non-archivable-floor size budgets). New line: `§28c focus ring: 14 --fill-accent x surface
  pairs at 1.4.11 >= 3:1 across both palettes (worst light 6.40:1 --fill-accent on --surface-sunken;
  worst dark 7.90:1 --fill-accent on --surface-accent-wash)`.
- **Four negative controls, each run against a mutated `index.css` and each restored from a
  scratchpad copy — never `git checkout --`** (the restore was verified by sha256 and an empty
  `git diff --stat`, twice): a low-contrast ring value → 7 light failures; the `:focus-visible` rule
  deleted → the missing-rule failure; the outline given a literal hex → the not-a-token failure; the
  ring repointed at an undefined token → one failure per palette.
- **Live browser sweep** (the W-1 technique: `npm run build`, `python3 -m http.server 8771` against
  `dist/`, `preview_start` with a plain `url`), which is what turns §28c's *scope* from an assumption
  into a measurement — see item 140. 4 routes x 2 themes = **8 sweeps, 106 focusable controls, 0
  unresolved backgrounds, 4 distinct under-ring colors, all of them surfaces, worst 7.10:1**. The
  per-palette control (a planted focusable inside a `var(--fill-accent)` wrapper) **fired at 1.00:1
  in both themes** and cleared on removal.
- **Two instrument traps hit and recorded in item 140**, both of the family this log keeps warning
  about. The pane **defaults to system dark**, so the first scan resolved the dark ring with
  `data-theme` unset — item 118's miss exactly. And while the pane is **hidden**, `innerWidth` is 0
  and `getBoundingClientRect()` collapses, so the zero-size filter silently dropped **35 of 53**
  controls on `#/learn`; fronting the tab fixed the viewport, and the 32 that remained zero-size
  were genuinely inside a collapsed `<ol hidden>` accordion, which is a correct exclusion. A
  timed-out async sweep also kept running and moved `location.hash` underneath the next call.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. Over the 132 added lines: Dalio/`principles of` **0**,
  advice-adjacent verbs **0**, child-facing framing **0**; **control**: `focus` returns **21** on the
  same diff, so the greps reach the added text. `npm run check-blindspot` **PASS**, including §2.3's
  live-date sweep over 26 teaching-copy modules. The one date I added is a `measured 2026-08-28`
  annotation in dev-script prose — the house convention here, and outside §2.3's scope. **No
  learner-visible string, locale or rendered UI is touched: the built bundle is byte-identical
  (`index-C3F1ZUMc.js` before and after), which is the evidence that nothing shipped to users.**
- **`DECISIONS.md` conflict** — none. No closed decision governs contrast checking; localStorage-only
  state, `.js`-not-JSON content and Vite-not-Expo are all untouched.
- **Already-done backlog item** — no, and this was the check most likely to fire, so it was *run*
  rather than reasoned. §28 and §28b were read off the source (their filters are quoted in the item
  above) and neither pairs the ring token with a surface; the `--line-hairline` control then proved
  it behaviorally, with **14 §28c failures and 0 from any other section**. §28c also does not
  re-litigate §28's `--ink-on-fill` exclusion — it inherits the same reasoning for why fills stay out.
- **Own verification claim** — an independent reviewer re-running the commands above gets the same
  numbers; the mutations are three `perl -0pi -e` one-liners and the restores are a `cp` from a
  scratchpad copy. **What I am NOT claiming:** (1) that the app's focus indicator is *good* — §28c
  answers contrast only, and 2.4.13's area/thickness half is uncovered; (2) that the ring can never
  land on a fill — that is a layout property, true today by live measurement and guarded by nothing
  (**item 140**); (3) that the live sweep covers the app — it covers 4 routes in the storage state
  they were visited in, with 64 collapsed-accordion controls skipped, like every probe here.

#### Next run

`npm run owner-tree` — record the post-commit fingerprint. **Open and unblocked:** **item 140** (the
layout half filed by this run — but read its "do not build it until it has drifted" sibling reasoning
in items 126/130 first, since it too has zero live instances); **item 127** (the per-language numeral
guard — its "decide before coding" question is still undecided); **item 136**'s remainder and **item
130**, both still honestly low. **Item 139 is closed.**
**For the owner, unchanged by this run:** both log-size warnings are live — run log **304,358 b**
against a 250,000 b warn budget, and the **non-archivable floor at 256,017 b, also over** (measured
before this entry was appended); archiving clears only the first, and **item 115's two options for
the second remain the owner's.**
**O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content, and
zero people have ever opened this app.** **O-3** unchanged — this run added no translated prose;
human review share is still 0% in all four languages.

### 2026-08-28 (scheduled dev-agent) — the harness could focus a document all along; nobody had pressed Tab (item 116)

**Pick.** Item 116, from the backlog rather than from the previous run's next-run line. Its own
"cheap first step" is a *measurement*, not a build — *"can any harness here focus a document?"* —
and W-1 makes browser verification a standing capability of scheduled runs, so it was answerable
now rather than deferrable.

#### Step 3.5 — four premises tested. Two held, one broke, and the one that broke was the item's thesis.

- **✅ `focusVisibleOnTab` is a stub.** Source-read: `run()` returned `{findings: [], scanned: 0}`.
- **✅ The sweep prints `hasFocus()` beside the measured capabilities.** Source-read, `focusEvidence`.
- **✅ The 2026-08-26 measurements reproduce exactly — at page load.** Fresh build served, fresh
  pane: `focusEvents=false`, `matches(:focus)=false`, `matches(:focus-visible)=false`,
  `activeElementCorrect=true`, `hasFocus()=false`, `visibilityState="hidden"`. **All four controls
  fired**: the synthetic-FocusEvent detector delivered (1), a click listener delivered (1), the
  selector engine answered `button:enabled` = 13, and the bundle read back as `index-C3F1ZUMc.js`,
  matching the build just run (Environment note rule 4).
- **❌ "What blocks it is the harness… a probe written today would report `UNAVAILABLE` on every
  run." FALSE, and this is the run's headline.** The word that did not belong was *permanent*.
  The document has **no focused area until a real input event reaches the pane**. One
  `computer{action:"key", text:"Tab"}` and, on the very next call: `hasFocus()` **true**, focus
  events **fire**, `:focus` **matches**, `:focus-visible` **matches**, computed
  `outline: solid 2px rgb(169,182,255)` on the skip link. `visibilityState` stays `"hidden"`
  throughout — it was never the signal to read.

⛔ **A click is not enough, and the difference is the probe's whole subject.** A seeding
`left_click` gives `:focus` **without** `:focus-visible` — correct per the spec's
pointer-vs-keyboard heuristic. `index.css`'s `:focus-visible` rule is the app's *only* focus
styling, so a click-seeded sweep finds every control ringless and reports the whole app broken.
Hence a **third** capability, `focusVisibleSelectors`, measured on its own plant. Gating one
pseudo-class on its neighbour is the item-108 proxy mistake a third time — once per pseudo-class.

⛔ **`hasFocus()` lies about KEYBOARD DELIVERY too, and it produced a wrong conclusion inside this
run before the control caught it.** With the first-run dialog open, `hasFocus()` read `true` across
**sixteen key presses of which a capturing `document` keydown listener received exactly zero** — a
synthetic dispatch to that same listener fired, proving the listener was alive and the keys were
going elsewhere. **Eight of those presses had already been read as "the focus trap holds". They
proved nothing.** Redone with delivery counted rather than assumed — seed with a real click, then
Tab — the trap **does** hold: **16 trusted keydowns, focus entered the dialog on the first Tab and
never left across 14 more Tab/shift+Tab presses.** The mechanism is `App.jsx:331`'s
`inert` + `aria-hidden` on everything behind the dialog (4 inert nodes measured), not a JS handler.
**§47's static focus-trap guard now has its rendered-tree half** — for the first time.

#### What shipped (`scripts/a11y-sweep.js` only — no `src/` change, no headless browser)

1. **`focusVisibleOnTab` implemented.** Park focus on a planted offscreen button, snapshot the
   element's computed style, focus it, snapshot again; identical signature ⇒ no visible indicator.
   Elements where `activeElement !== el` after `.focus()` are skipped rather than counted as
   findings — the Learn path renders 11 disabled locked-lesson buttons.
2. **`focusVisibleSelectors` added to `measureFocus()`/`capabilities()`** as a separately measured
   third signal, and `focusEvidence` now names the one-gesture fix when it is false.
3. **A selftest plant** (`#a11y-selftest-noring`, a `!important` override of the global rule) and
   its `expect` entry, matching the plant's **id** rather than the finding's shape — unnamedRegions'
   reason: a shape match would pass off a real regression as a fired control.
4. **Header note 2 and the HOW TO RUN block rewritten** to the corrected facts and the Tab gesture.

⚠️ **The control found a defect in the probe, which is the whole reason it is there.** The first
version's signature included `outlineOffset`, and the plant did **not** fire: the global rule sets
`outline`, `outline-offset` **and** `border-radius` together, so an element suppressing only the
outline still shows `0px → 2px` of offset — **a difference with no visual consequence, since an
offset on a `none` outline paints nothing.** The probe would have read a ringless control as ringed.
`outlineOffset` and `borderRadius` are now excluded, and **the plant is the guard**: put either
property back and the control stops firing and the selftest fails.

#### Verification

- **`npm test` exit 0**, 0 failures, same 2 documented warnings + the 2 standing log-size warnings.
  **§43 now reads `11 probe(s) declared (10 layout-gated, all with planted controls)`**, up from
  10/9. **`npm run build` clean; `check-blindspot` PASS.**
- **Live, reproducible in this order:** build → serve `dist/` on `127.0.0.1:8813` → `preview_start`
  → screenshot (forces layout) → **one `computer key Tab`** → load the sweep → `selftest()` → `run()`.
- **The refusal was verified before the pass, which is the half worth stating.** Run *without* the
  Tab, `focusVisibleOnTab` reports **`UNAVAILABLE`** and the verdict names the one-gesture fix — it
  does **not** report a clean zero. With the Tab: **11 of 11 controls fired, `plantsRemoved: true`,
  `appFindingsAfterCleanup: 0`, verdict PASS.**
- **Sweep result: `clean on 11 probe(s); 0 unavailable`** — the first fully-available sweep in this
  file's history. `focusVisibleOnTab` `status: "ok"` with **scanned 10 / 5 / 10 / 15** on
  `#/learn`, `#/practice`, `#/reference`, `#/lesson/1`. A control-verified hand run of the same
  method beforehand covered **9 screens and 124 focusable controls — 0 findings**, its own control
  (a planted `outline:none` button) firing on each pass.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. Over the 154 added lines: Dalio/`principles of` **0**,
  advice-adjacent verbs **0**, child-facing framing **0**; **control**: `focus` returns 93 on the
  same diff, so the greps reach the added text. `check-blindspot` PASS. The change touches no
  learner-visible string, no locale, no rendered UI — the built bundle name is **unchanged**
  (`index-C3F1ZUMc.js`), which is itself the evidence that nothing shipped to users.
  The dated comments I added are dev-script prose, the house convention in this file; §2.3's
  live-date check covers teaching-copy modules and passed.
- **`DECISIONS.md` conflict** — none; no decision governs the sweep. The one adjacent constraint is
  the file's own rule that a headless browser is item 12's port-cost territory. **I did not add
  one** — this is still a script a run pastes into the pane.
- **Already-done backlog item** — no. `focusVisibleOnTab` has been a stub since it was declared;
  no run has ever built it (`grep` over the log finds only stub/UNAVAILABLE references). Item 108
  built `measureFocus()`; this extends it and leaves §43(d)'s proxy prohibition intact — no
  capability is assigned from `hasFocus()` or `visibilityState`.
- **Own verification claim** — the command sequence above reproduces it. **What I am NOT claiming:**
  (1) that the app has *good* focus indicators — the probe answers "does anything change", not "is
  the change perceivable", and WCAG 2.4.11/1.4.11 contrast of the ring is uncovered (**item 139**);
  (2) that 0 findings covers the app — it covers the screens actually visited, in the storage state
  they were visited in, like every probe here; (3) that the trap is proven beyond the first-run
  dialog — that is the only modal in the app, and it is the only one measured.

#### Next run

`npm run owner-tree` — record the post-commit fingerprint. **Open and unblocked:** **item 139**
(the focus-ring contrast half, and its cheaper static shape is spelled out); **item 127** (the
per-language numeral guard — its "decide before coding" question is still undecided); **item 136**'s
remainder and **item 130**, both still honestly low with zero live instances. **Item 116 is closed.**
**For the owner, unchanged by this run:** both log-size warnings are live — run log **304,296 b**
against a 250,000 b warn budget, and the **non-archivable floor at 256,017 b, also over** (both
measured *after* this entry was written, not before it); archiving
clears only the first and **item 115's two options for the second remain the owner's.**
**O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content, and
zero people have ever opened this app.** **O-3** unchanged — this run added no translated prose;
human review share is still 0% in all four languages.

### 2026-08-28 (owner-directed: "do item 138 next") — the check that would have caught the eight days, and the two guards that looked like they already covered it (item 138)

**Pick.** Owner-directed. Item 138 was filed by the previous run as its own stated residual: the
corpus's cross-references had just gone 32/40 → 40/40 and **nothing in `npm test` could see the
difference**.

#### Step 3.5 — three premises tested. Two held, and the one I wrote myself last run was unverified.

- **✅ The eight-day claim, proved from history rather than remembered.** `git archive 7046854`
  (2026-08-20, item 84's rename): the English carried **both** new pointers and **all four
  translations carried neither target title**. **Control**: the same grep finds titles that *were*
  there that day (`Las 4 Fases del Ciclo Económico`, `경제 순환의 4단계`, `经济周期的4个阶段`,
  `経済サイクルの4つの局面`), so the blanks are absence, not a broken grep.
- **⚠️ "The same-track references (34 of 44) are already correct" — I wrote that last run without
  measuring it.** Last run computed per-language presence for the 10 cross-track references only and
  then generalized to all 44. Measured now: **176 instances, 0 missing.** The claim was true. It was
  also, until this moment, a guess wearing a number — which is the shape step 3.5 exists to catch,
  and it is worse coming from my own entry than from an old one.
- **✅ §16b cannot see it.** §16b asserts the **absence** of numeric `Lesson N` prose; it succeeds by
  finding nothing and succeeds equally when a translation contains no reference at all. §16's
  per-reference consistency checks run over the numeric form, so since item 84 they count zero and
  are vacuous by construction.

⛔ **A third guard looked like it should have caught this and did not, and the reason is worth more
than the check.** Adding an English sentence without translating it lowers that pair's ratio — which
is exactly what **§33** watches. But §33 and `translation-completeness-baseline.json` **did not exist
on 2026-08-20**: the baseline file was first added **2026-08-21** by `e455663`, one day later, and it
recorded the already-degraded ratio as the norm. **A baseline taken after a defect makes the defect the
baseline.** (Confirmed by `git log --diff-filter=A`, not inferred.)

#### Two design decisions, both changed by measurement rather than taken from the item

**(1) Item 138 specified keying on the `(in <Track>)` suffix as the reference form. Measured: only 10
of the 44 references carry it — and they are exactly the 10 cross-track ones.** The suffix names the
*other track*, so it appears precisely when the reference crosses tracks; the 34 same-track references
are bare quoted titles. Keying on it would have covered **23%** of the surface.

**(2) The bigger change: require the target to be marked as a TITLE, not merely mentioned.** Fourteen
lesson heads are ordinary common nouns — `Credit`, `Taxes`, `Insurance`, `Transactions`, `Budgeting` —
so a substring test would accept the ordinary word and call a dropped reference present. Requiring
each language's own title marks (§56's repertoire: `en`/`es` “”, `ko` 「」, `zh` 《》, `ja` 『』) is
what makes the assertion mean anything. **Verified against the four riskiest short-head references by
reading them** (lesson 10→7 `Taxes`, 32→30 `Credit`, 40→29 `Transactions`, 12→8 `Insurance`): all four
are genuine references and every translation already wraps the target in its own title marks.
**This also closes a gap §56's own header records as out of its reach** — §56 reads *repertoire* and
"cannot tell a title reference from an ordinary quotation". §58 knows which spans are references
because English says so, so it can require the target be marked as a title, which §56 has no context
to do. The two failure modes are reported separately because they have different fixes: **MISSING**
(the reference was dropped — item 138's defect) and **UNMARKED** (present as bare prose — §56's
title-drift class).

**A third hazard, found by probing rather than by it firing: `Credit` is a prefix of both `Credit
Scores` and `Credit Reports vs. Credit Scores`.** A `includes("“" + head)` test would count a
quotation of the longer title as a reference to the shorter lesson. §58 extracts spans and compares
heads for **equality**, which removes the class rather than ordering around it. (Both approaches
happen to return 44 today; the exact one is the one that stays right.)

#### What shipped

**`check-data.mjs` §58 — every cross-reference survives translation.** 200 lines, additive, no
production code touched. Derives the reference set from English title-quoted spans whose head exactly
matches a lesson title head, then asserts every other language carries that target's own title head
inside that language's title marks. **Scope is lesson prose AND `quizData`'s `explain` fields** — the
same two surfaces §16 covered in the numeric era, so the title era does not silently cover less; quiz
references are scoped per item, not pooled per lesson, for the reason §16's header already gives.
Current state: **50 English title references (44 lesson prose, 6 quiz), 200 translated instances, 0
dropped, 0 present-but-unmarked.** The 6 quiz references were independently counted off the five
`quizText.<lang>.js` modules and agree exactly with the `quizData` merged view — two instruments, same
number.

**Why a hard failure rather than a warning**, given §16's own header says translations "legitimately
condense and drop references": that was written about a **count tripwire over the numeric forms**, and
it does not describe this corpus's title references. Measured — **lesson 6's `zh` keeps its reference
at a 0.125x ratio**, dropping seven eighths of the English and the reference anyway; lesson 10 `zh`
0.164x and lesson 9 `zh` 0.173x likewise. Dropping a title reference is not something this corpus does
when it condenses. **And a warning is what the eight days already amounted to.**

#### Verification

- **`npm test`: 7 scripts, `PASS: 0 failure(s)` on each.** `npm run build` ✓. `check-blindspot`
  **PASS, 0 failures**.
- **§58 proved able to fail, four ways, each restored from a scratchpad copy — never
  `git checkout --`:**
  1. **UNMARKED** — `《税收》` → bare `税收` in `zh` lesson 10: fails naming lesson, language, target
     and the marks to use.
  2. **MISSING, replaying the actual defect** — reverting lesson 1's `es` pointer reproduces the
     2026-08-20 state exactly, and §58 fails on it. **This is the eight days, caught.**
  3. **Quiz scope** — dropping `《复利》` from quiz item 24 (`zh`): fails, and correctly classifies it
     UNMARKED rather than MISSING, because the word survives elsewhere in that explanation.
  4. **Vacuous pass** — breaking the span extractor's English marks: **CONTROL A** fires
     (`only 0 title cross-references were extracted`) instead of reporting a clean sweep.
  ⚠️ **Injection 1 did not fire on the first attempt, and the check was right.** Removing one
  `《税收》` left lesson 10's *second* one standing — §58 asserts one marked carrier per
  (lesson, target, language), which is correct, since English itself writes several references twice
  (58 occurrences over 44 distinct pairs). **The insufficient injection was mine, not a hole in the
  check** — worth recording, because a first-try green injection reads exactly like a check that
  cannot fail.
- **Controls B and C are literals, so they fire even against an empty corpus**: a marked title must be
  found, a bare mention must be rejected, and `ja`'s marks must not be accepted as `zh`'s.
- **W-1 browser verification — not applicable, and proven rather than asserted.** This run changes one
  check script and no production code; `git diff` is exactly `scripts/check-data.mjs`, and the built
  bundle is **byte-identical** (`index-C3F1ZUMc.js` before and after).

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression: `check-blindspot` **PASS, 0 failures**. No learner-visible
  string changed in any language; no Dalio reference, no advice-adjacent verb, no kids framing, no
  date or market figure. The only new prose is a check's header comment and its failure messages.
- **`DECISIONS.md` conflict** — none. No decision governs check sections; no state, content-module or
  build decision is touched.
- **Already-done backlog item** — no, and this was the check worth making explicitly rather than
  assuming. §58 could plausibly duplicate §16, §16b or §56; it duplicates none of them, and §58's
  header states which failure each of the three cannot see, with §33 added as the fourth.
- **The tension I went looking for and found**: §16's header says translations legitimately drop
  references, which reads as a direct contradiction of a hard-failing §58. Resolved on measurement
  (the 0.125x lesson above), and the resolution is written into §58's header rather than left for a
  future run to rediscover as a conflict.
- **Own verification claim** — reproducible from `npm test`, `npm run build`, `npm run check-blindspot`
  and the four injections. **What I am NOT claiming:** (1) that §58 can tell a *correct* translated
  reference from a wrong one — it checks that the target lesson's title is present and marked, not
  that the surrounding sentence says something true; (2) that it covers every surface — `glossary.js`,
  `kidsContent.js` and `moneyVisuals.js` are outside it, and a title reference has never appeared in
  them, which is why it is scoped to §16's two surfaces rather than to everything.

#### Next run

**Item 138 is closed.** Open and unblocked: **item 136**'s `preferenceFlip` remainder and **item 130**,
both low and both honestly marked as guards over properties with no live instance — which is a
different case from item 138, and the difference (a dated, eight-day live instance) is exactly what
justified building this one. **Item 27** remains ratio-blocked under W-5.2; **item 26**'s stream is
complete but for one standing owner decision.
**For the owner, and unchanged by this run:** the log-size warnings are both live — run log
**284,333 b** against a 250,000 b warn budget, and the **non-archivable floor at 250,513 b, also over**.
Archiving clears only the first; **item 115's two options for the second remain the owner's**.
**O-1 is still the entire critical path: 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app.** **O-3** unchanged — this run added no translated prose at all;
human review share is still 0% in all four languages.

### 2026-08-28 (owner-directed: "do items 131 and 132 next") — item 132 said these were the only two cross-track pointers in the corpus; there are ten, and the eight that work are the argument for fixing these two (items 131 + 132)

**Pick.** Owner-directed, and it matches item 131's own instruction — *"Do them only together with item
132, which is the thing actually worth deciding about those two lessons."* Item 131's remainder was 8
pairs (lessons 1 and 4 x es/ko/zh/ja); item 132 was the content gap inside them.

#### Step 3.5 — the premise re-measured. One claim held exactly, one was wrong by 8, and the wrong one reversed the item's disposition.

**Held, to the character.** Lesson 1 §2's closing English sentence points at
`Why 'Later' Never Feels as Real as 'Now'` and lesson 4 §0's third paragraph points at
`Productivity Growth`; **both are absent from all four translations** — read directly, not inferred.
Item 131's abridgement figures held too: lesson 1 `es` **0.499**, lesson 4 `es` **0.684** against the
item's "0.50x and 0.68x".

⛔ **Wrong, and it is the finding: item 132 says these are "the only two [cross-track pointers] in the
corpus". There are TEN.** Measured by resolving every quoted title head in every English lesson body
against `lessons.js`'s `track` field: **44 quoted-title references, 10 of them cross-track.** Item
132's parenthetical is also incomplete — it names "money→essentials, essentials→economy", and the real
set is essentials→money, essentials→economy, money→essentials and money→economy.

⚠️ **The first measurement was wrong and the control is what caught it — this is the myriad-grouping
trap of item 127 in a new costume.** My `head()` split the title on an **ASCII** colon, so every
`zh`/`ja` title head (which use full-width `：`) came back as the *whole* title, and five real,
correctly-translated references read as **missing**. The instrument reported 15 missing instances; the
truth is 8. Caught by reading the `zh`/`ja` prose directly and finding 《租房与购房》 and 『複利』 sitting
there — after which the control was rewritten to be **keyed to text read by eye** in both directions.
**A split character is a locale, not a delimiter.**

**Corrected picture, all controls firing:**

| | |
|---|---|
| cross-track pointers | **10** |
| translated in all four languages | **8** |
| missing in all four languages | **2 — lessons 1 and 4** (8 instances of 40) |

⛔ **That reverses item 132's disposition, and the reversal is the whole value of this run.** The item
argued *"It is item 94's shape, not a bug… Do not fix it in isolation — translating one sentence into
four languages inside an otherwise-abridged lesson makes the corpus less coherent, not more."* The
corpus refutes it: **lessons 5 and 9 are also `essentials`, also abridged, and their cross-track
pointers ARE translated in all four languages.** Measured ratios — lesson 9 (`es` 0.539, `zh` 0.173) is
**more** abridged than lesson 4 (0.684 / 0.227) and about level with lesson 1 (0.499 / 0.165). So
keeping the pointer in an abridged essentials lesson is this corpus's **established practice in half
the cases**, and lessons 1 and 4 were the exception. Fixing them makes the corpus *more* consistent,
which is the opposite of what the item predicted. **Control on that ratio instrument:** a
fully-translated economy lesson scores `es` 1.11 / `ko` 0.52 / `zh` 0.32 / `ja` 0.45, at the item-93
reference and nowhere near the ~0.2 the abridged ones score.

#### What shipped

1. **Item 132 — the two missing cross-track pointers, in es/ko/zh/ja (8 sentences).** Each written to
   the form lessons 5 and 9 already use in that language, with that language's own title for the
   target lesson and its own `trackMoney`/`trackEconomy` label: `es` `“…” (en Pensar sobre el dinero)`,
   `ko` `「…」 (돈에 대해 생각하기)`, `zh` `《…》（关于金钱的思考）`, `ja` `『…』（お金について考える）`.
   Quote marks follow §56's per-language repertoire (`zh` 《》, `ja` 『』, `ko` 「」) and §56 passes.
   **All 40 cross-track reference instances now resolve; the count went 32/40 → 40/40.**
2. **Item 131 — all 8 pairs read in full in all five languages, and one real defect fixed.**
   ⛔ **Lesson 1 named María in §1 and §2 while every translation had dropped her introduction from
   §0.** English opens *"Meet Maria, who just started her first job making $3,000 a month after
   taxes"*; measured, `es`/`ko`/`zh`/`ja` all had **0** mentions in §0 and first named her in §1 — a
   character referred to before she exists, **identically in all four languages**, which is exactly
   item 33's lesson: all four agreed with each other, so no consistency check could ever see it, and
   only reading found it. Her introduction is restored in all four. It also restores the `$3,000`
   that makes §2's `$600` legible as the 20% the same section describes.
   **Lesson 4 needed no such fix** — its translations drop the Elena/David example from §0 *and* §1
   consistently, and its §2 back-reference to "the two factors from the first section" resolves.
3. **A spelling split found only in the live browser, and my first fix went the wrong way.** The
   `es` lesson spelled the name **both ways** — `María` in §1, `Maria` twice in §2. I normalized to
   `Maria` on the strength of that one file's majority. **The rendered page then showed `María` twice
   more, from `moneyVisuals.js`'s figure — a surface the source read never touched.** Re-measured
   across `src/content`: every Spanish surface outside that one lesson body writes **`María`** —
   `moneyVisuals` es lines **5/0**, `quizText.es` **2/0**, `lessonContent.money.es` **1/0**. So the
   normalization was reversed: `es` lesson content is now `María` **4/0**, and the split is clean by
   language (Spanish `María` 12, English `Maria` 18). **"The majority in this file" is not a
   convention; it is a sample** — the same scope error item 128 found in item 91's "whole-repo scan".
4. **Ledger + generated figures.** 8 pairs marked reviewed (`method: "ai"`). Coverage
   **95% → 100% in all four languages, 7 stale → 0.** Item 131 is now **28 of 28 pairs done.**
   `translation-completeness --write` and `refresh-readiness --write` re-recorded the ratios and
   §10.4's character sentence; §10.4's coverage sentence was hand-edited because `check-data.mjs` §11
   owns it (W-5.6's split).

#### What this deliberately did NOT do

**The abridgement itself is untouched, and that is item 94's, which is owner-gated.**
`npm run translation-completeness` still reports **48 abridged pairs — es 12 / ko 12 / zh 12 / ja 12
across 12 lessons** — unchanged by this run, so §10.4's "48 abridged pairs" sentence remains true.
Lessons 1 and 4 are still abridged; they now merely stop pointing a non-English reader at nothing.

#### Verification

- **`npm test`: 7 scripts, `PASS: 0 failure(s)` on each.** `npm run build` ✓. `check-blindspot`
  **PASS, 0 failures** — including §10.1's advice-adjacency scan across all five languages and 38
  files, which covers every string added here.
- **Three generated-figure guards fired on the way through and were satisfied, not bypassed:** §33
  failed on 7 of 8 ratio pairs (lesson 4 `zh` moved under its 0.03 tolerance) and was cleared with
  `--write`; `refresh-readiness --check` failed on the §10.4 character sentence and was cleared with
  `--write`; §11 then failed on §10.4's *coverage* figure, which `refresh-readiness` does not own.
- **English is byte-unchanged** (`git diff` touches no `.en.` module and no English field), so the
  ledger's `englishSourceHash` did not move. The stale flags were cleared by **reading**, not by the
  source shifting under them.
- **W-1 live browser**, static build + `python3 -m http.server` + `preview_start` with a plain `url`:
  - `zh` lesson 1 — intro and pointer both present in the rendered text; `ja` lesson 4 — the new third
    paragraph `『生産性成長』（経済のしくみ）` present; `ko` lesson 1 — intro, pointer, and the title in
    「」 present; `es` lesson 1 — intro and pointer present.
  - **Two-sided control on every probe**: a pre-existing sentence in that language must also be found
    (it was, on all four) and `ZZQQNOTPRESENT` must not (it was not).
  - **Name check in the DOM, not `innerText`**: 5 nodes match `Mar[íi]a`, **0 unaccented**. `innerText`
    alone reported the figure as absent — it is SVG text; the tree walker settles it. The Environment
    note's stale-bundle trap does not apply here (the loaded bundle is `index-C3F1ZUMc.js`, the one
    just built, and every positive probe matched a string that did not exist before this run, which a
    cached bundle could not have produced).

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression, measured: `check-blindspot` **PASS, 0 failures**. The added
  prose is lesson copy about budgeting and credit scores; **0** advice-adjacent phrases in any of the
  five per-language pattern sets, no Dalio reference, no kids framing, no date or market figure.
- **`DECISIONS.md` conflict** — none, and the governing entry is directly on point: the 2026-08-11
  machine-translation decision (option (a), ship under "(Beta)") covers exactly this, and the ledger
  marks are `method: "ai"` per its reviewer-of-record note. Content stays in `.js` modules; no state
  or build decision touched.
- **Already-done backlog item** — no. Items 131 and 132 were both open; this closes them. It does not
  touch item 94's abridgement, which the "What this deliberately did NOT do" section above states with
  the unchanged 48-pair count as evidence rather than assertion.
- **Own verification claim** — reproducible from `npm test`, `npm run build`, `npm run check-blindspot`,
  `npm run review-status`, `npm run translation-completeness`, and the browser sequence. **What I am
  NOT claiming:** (1) that any of this is native-speaker review — every mark is `method: "ai"`, human
  review share is **0%** in all four languages, and this run *added* ~1,300 characters of unreviewed
  translation to that surface (**O-3**); (2) that lessons 1 and 4 are now fully translated — they are
  not, they are still abridged, and that is item 94; (3) that the cross-track instrument is now
  guarded — it is a scratchpad measurement, not a check in `npm test`. See the new item 138.

#### Next run

**New item 138** (filed below): the 40/40 cross-track state has **no instrument** — it was 32/40 for
eight days and nothing in `npm test` could see it. That is the natural follow-on and it now has a real
instance behind it, which is the bar items 126/130 set.
Otherwise open and unblocked: **item 136**'s `preferenceFlip` remainder and **item 130** (both low).
**Item 27** is still ratio-blocked under W-5.2; **item 26**'s stream is complete but for one standing
owner decision.
**For the owner:** **O-1** is unchanged and is still the entire critical path — 44 lessons, five
languages, 160 minutes, and zero people have ever opened this app. **O-3** now has a slightly larger
surface: translation-review coverage reads **100% in all four languages and 0% human**, and this run is
part of why the first number moved.
**⚠️ The log-size picture got worse this run, and one half of it is new.** Quoting the tool rather
than retyping it (item 70's rule): `MEASURED log-size: file 526525 b, run log 283674 b, floor 250513 b
(backlog 222969 b), archive 2077529 b, 4 live day(s)`. The run log at **284 KB** over its 250 KB warn
budget is the familiar one. **The floor is now ALSO over budget — 250,513 b against 250,000 — and this
run's own backlog writing is what crossed it.** That is the failure mode W-5.3's note names: archiving
cannot move the floor, only a backlog compression pass can, and **item 115's two options are still the
owner's to choose between.** The archiver would clear the run-log half in one pass (`move 1 day —
2026-08-26, 78 KB, leaving 206 KB`) and would not touch the floor at all.

### 2026-08-28 (scheduled dev-agent) — "all" was a different number for 44 different learners, and the cheapest way to say which one would have been wrong in four languages (item 117)

**Pick.** Not item 27, not the figure cluster, and not another log-compression pass — the previous
entry's own closing note says the closed-item tier is tight and "do not expect another compression
pass to find much", and W-5.2's ratio rule binds against a fifth consecutive figure/tooling run.
Taken instead from **item 117**, whose third bullet is the only *learner-facing* thing on the open
list that is neither owner-blocked (items 94, 132, 101, O-1/O-2/O-3) nor a guard over a property with
zero live instances (items 126, 130, 136, 120). Item 117(a) and (b) are explicitly the owner's
judgment calls and are untouched; the bullet picked is the one the item itself marks as needing no
decision.

**W-5.2 accounting, since the rule asks a run to say which candidate it took and why:** item 26's
remainder is blocked on item 18's analytics and on one standing owner decision (the Leitner strip);
items 70/71 are closed or explicitly gated on a failure that has not happened; item 76 is blocked on
a tokenizer nobody has scoped. Item 117 is the pick-list-adjacent item that is actually unblocked.

#### Step 3.5 — the premise re-measured, with controls. It held, and it was UNDERSTATING the item.

Item 117 says: *"the label still reads 'Practice all questions' while the session may now be 2
questions long. Appending ` (N)` costs **zero locale keys** (digits are language-independent)."*

**The first half is true and too small.** Measured by parsing `quizMeta` against `lessons.js`:
**46 questions over 44 lessons — 42 lessons own one, 2 own two.** So the pool is **1** the moment the
first lesson is completed, and takes **44 distinct values** along the path. "All" is not occasionally
a surprising number; it is a different number for nearly every learner state that exists.
Controls, because a join that silently matches nothing looks exactly like a clean answer: a lesson id
taken from `quizMeta[0]` **must** be found (true), `99999` **must not** be (false), and every lesson
owning a question **must** appear in `lessons.js`'s order (0 missing).

⛔ **The second half is arithmetically true and wrong as a design claim, and that is this run's
correction.** ` (N)` costs zero keys because it is built in JSX — and that is exactly the problem.
Two measurements say so:

- **Plural agreement, and it breaks at the FIRST state a learner reaches.** Put the count inside the
  noun phrase the way the nearest existing sibling does (`viewAllLessonsTemplate: "View all {n}
  lessons →"`) and `en` renders **"Practice all 1 questions"** at n = 1 — measured above to be the
  pool size after one completed lesson. `es` breaks identically ("las 1 preguntas"). `ko`, `zh` and
  `ja` have no plural agreement and read *better* with the number inline. **The five languages do not
  want the count in the same place**, so no single JSX append is right for all of them.
- **Spacing is language-specific too, and `Practice.jsx` cannot know it.** `zh` already writes
  `"{n} 题待复习"` with spaces and `"查看全部{n}节课"` without; `ja` writes `"復習する問題 {n} 問"`.
  Appending `" (N)"` at the call site imposes the English shape on all five.

**The house convention, measured rather than recalled:** every count that appears **in a sentence** in
this app is a per-language locale template — **14 keys** before this change. The only counts built in
JSX are bare numeric ratios (`Learn.jsx:171` `{doneCount} / {items.length}`, `Practice.jsx:334`).
A button label is a sentence. So the item's "zero keys" option is not the cheap version of the right
answer; it is a third shape that exists nowhere in this app.

#### What shipped

1. **`practiceAll` → `practiceAllTemplate` in all five locales**, each language placing the count
   where its own existing templates place it:
   `en` `"Practice all questions ({n})"` · `es` `"Practicar todas las preguntas ({n})"` ·
   `ko` `"문제 {n}개 모두 풀기"` · `zh` `"练习全部 {n} 道题"` · `ja` `"全 {n} 問を練習"`.
   The two plural-agreement languages park the count in parentheses; the three without it take the
   count inline, mirroring `viewAllLessonsTemplate` / `reviewDueTemplate` in each file. `check-data.mjs`
   §1's two-directional key-set parity forces the rename to be complete — a half-done rename fails the
   build rather than falling back to English.
2. **`Practice.jsx` renders `t.practiceAllTemplate.replace("{n}", practicePool.length)`**, with the
   reasoning above written into the comment block that already explains the pool, so the next run does
   not re-derive the four-language argument from scratch.
3. **`check-data.mjs` §1b — placeholder parity across languages**, filed because this change made the
   **15th** key of this shape and nothing checked any of them. A locale value is interpolated by a
   literal `String.replace("{n}", …)`, so a translation that drops or mistypes its token does not
   throw and does not fall back — **it renders the braces to the learner, in that language only**, on
   a screen nobody sweeping English would look at. Compares the *set* of tokens, deliberately not
   their order or count, because `lessonProgressTemplate` legitimately reorders `{done}`/`{total}`
   per language.

#### Verification

- **`npm test`: 7 scripts, `PASS: 0 failure(s)` on every one** (2 + 0 + 0 + 0 + 0 + 0 + 1 warnings;
  the warnings are the pre-existing run-log-size one and `check-payload`'s, neither touched here).
  `npm run build` ✓ built in 1.45s. `npm run check-blindspot`: `PASS: 0 failure(s)`.
- **§1b proved able to fail, three ways, each restored from a scratchpad copy — never
  `git checkout --`:** (a) dropping `{n}` from `ko.practiceAllTemplate` → fails naming the language,
  the key and the string that would reach the learner; (b) adding a stray `{n}` to `ja.quizStart`,
  where `en` has none → fails on the converse rule; (c) breaking the tokenizer's own regex so it
  matches nothing → the vacuous-pass control fires (`only 0 keys were seen to carry placeholders`)
  instead of reporting a clean sweep. `git diff` confirmed byte-clean after each restore.
- **§1b's success line is gated on its own failure count.** The first draft printed
  *"all agree across 5 languages"* three lines under its own `FAIL` — a false statement in the output
  that run entries quote. Fixed and re-proved: under injection (a) the line is now absent.
- **W-1 live browser verification.** `preview_start` with `{name}` was refused —
  *"Dev servers can't be started from unattended sessions"* — so the Environment note's documented
  technique was used instead: `npm run build`, `python3 -m http.server 8842` against `dist/`,
  `preview_start` with a plain `url` (`navOk: true`). Driven through `javascript_tool`, seeding
  `localStorage` and reloading (item 106's trap: seeding a booted app does nothing):
  - **n = 1** (one completed lesson) → **`Practice all questions (1)`**. This is the exact state the
    inline form would have rendered as *"Practice all 1 questions"*, confirmed in the rendered DOM
    rather than argued.
  - **n = 14** (12 completed lessons) → `Practice all questions (14)`, which **matches the static
    trace independently measured before any edit** (`1,3,4,5,6,8,9,10,11,12,13,14`).
  - **All five languages at n = 14**, read off the live DOM with `documentElement.lang`:
    `Practicar todas las preguntas (14)` / `문제 14개 모두 풀기` / `练习全部 14 道题` / `全 14 問を練習`.
    The button carries **no `aria-label`**, checked rather than assumed, so its accessible name is the
    text — screen-reader users get the count too.
  - **Boundary held: n = 0 still HIDES the button** (item 117(a)'s decision, which this must not
    quietly reverse into a `(0)`). Buttons present: `Skip to navigation`, `Learn`, `Review`,
    `Reference` — no practice control, no `(0)` anywhere. **Control**: the same probe read
    `#review-empty-title` as `"Nothing to review yet"`, so it was on the right screen and the absence
    is real.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression, and checked rather than asserted: `npm run check-blindspot`
  **PASS, 0 failures**, including §10.1's disclaimer on all 8 surfaces and §2.3's no-live-looking-dates
  sweep. The five changed strings are UI labels about practising questions: **0** advice-adjacent
  verbs, no Dalio reference, no kids framing, no date or market figure.
- **`DECISIONS.md` conflict** — none, and one entry is directly on point rather than merely
  compatible. The 2026-08-11 machine-translation decision records that **`locales/*.js` UI strings
  have never been in the review ledger's coverage numbers** and ship under the same "(Beta)" labeling.
  The four new non-English strings here are exactly that category, so `npm run review-status` is
  unaffected and its percentages did not move. No state, content-module or build decision is touched.
- **Already-done backlog item** — no. `practiceAll` appears **0 times** in `AGENT_LOG.md` and 0 in
  `AGENT_LOG.archive.md`, so no previous run has been near this string; item 117 filed the bullet as
  an explicit residual and marked it "do it as a one-liner if it is ever picked".
- **Own verification claim** — reproducible from `npm test`, `npm run build`,
  `npm run check-blindspot`, the three injections, and the browser sequence above. **What I am NOT
  claiming:** (1) that §1b catches a *wrong* translation — `DECISIONS.md` already states the
  locale-parity checks catch a missing language, never a wrong one, and §1b narrows that only to
  *structurally* wrong (a dropped or unknown interpolation token), not semantically wrong;
  (2) that the four new non-English strings have been read by a fluent speaker — they have not, which
  is O-3, and they are modeled on each file's own existing templates precisely to keep that risk as
  small as a four-word label allows.

#### Next run

**Item 117's remaining two bullets are the owner's**, not a run's: (a) whether an empty practice pool
should hide the button, keep it disabled, or route to Learn, and (b) whether "practice anything you
could open" replaces "practice what you have read" — a one-line predicate either way. Both are now
cheaper to decide than before, because the screen states its own size.
Open and unblocked otherwise: **items 131+132** (the last 8 review pairs, only worth doing as one
decision and mostly a re-stamp), **item 136**'s `preferenceFlip` remainder, **item 130** (low), and
**item 26**'s stream, which is complete but for one standing owner decision. **Do not pick item 27
next** — W-5.2's ratio still binds.
**The log-size warning is live again and unchanged by this run**: the run log is 261 KB against a
250 KB warn budget, and W-5.3's rule still does not fire (item 115's two options are the owner's).
**O-1 remains the entire critical path: 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app.** **O-3** is unchanged — human review share is 0% in all four
languages; this run added four short UI strings to that unreviewed surface.

### 2026-08-28 (scheduled dev-agent) — the 23 KB lever was 10.7 KB: a byte count over closed items measures what can be read, not what can be deleted (items 121/122)

**Pick.** The remedy the previous run's own warning named and unblocked: compress **"Notes for future
runs" + "Completed and pruned"**, the ~23 KB the 2026-08-27 pass mis-filed as owner-held scope under
item 19. It was the live condition at pick time — baseline `npm test` reported **both** budgets over,
floor 252,390 b and run log 252,069 b against 250,000 b each — and archiving cannot touch the floor by
construction. It is also W-5.2-compliant: not item 27, and a backlog/housekeeping pick is a standing
legitimate one (W-2).

#### Step 3.5 — the premise, re-measured with a control

**The headline figures reproduce, byte-exactly.** Notes **4,305 b** + Completed **18,865 b** =
**23,170 b**, 10.3% of the backlog. (Item 122 records 4,304 + 18,864 = 23,169 — a one-byte
per-section boundary convention, immaterial.) **Control:** the section split was reconstructed against
`statSync().size`, 504,459 = 504,459, so the slicer was not silently returning a short read.

⛔ **The characterization is where it breaks, and in the direction that made the item look free.** Item
122 calls both sections *"closed history, not backlog items, and hold no owner scope."* Neither clause
survives contact:

- **`check-backlog.mjs` builds its set of valid item numbers from every `former item N` string in this
  file** — and **items 22 and 23 are cited from five source files between them** (`lessons.js`,
  `lessonIdMigration.js`, `useAppState.js`, `check-data.mjs`, `App.jsx`) **with no other accounting
  anywhere in the log.** These sections are not inert prose; part of them is a build dependency.
  **Proven by injection, not argued:** replacing `former item 22` fails `npm test` with **4
  dangling-citation errors**, naming all four files. Restored from a scratchpad copy — never
  `git checkout --` — and back to PASS with a clean tree.
- **The third "Note" is an open owner decision**, not closed history: roughly a dozen early commits
  are orphaned off `main` (`2dc0264` is the reachable root), still exist as objects, and the owner has
  never ruled on reattaching them before they are garbage-collected.
- The rest is standing rules that only look like chronology: **v6 is contaminated with §10.2 Dalio
  branding and a §2.3 hardcoded date** and must never be merged from; lesson ids in pre-2026-08-14
  entries are stale; item 63's palette-hex trap.

**So the disposition changed rather than a figure.** The lever is real but roughly **half** of what
was filed, and the item is a compression job, not a deletion.

#### What shipped

**23,170 → 12,518 b, a 10,652 b cut**, with every load-bearing pointer preserved and all nine
`former item N` labels intact. Method is W-3's, unchanged: keep status, standing guidance and
reproducible method; drop accreted chronology, which is not lost because it is in the run log. The two
sections now open with a warning saying *why* the labels cannot be dropped, so the next compression
pass does not have to re-derive it by breaking the build.

**Three stale things surfaced only because someone opened the sections — which is the argument for
opening rather than counting:**

- ⚠️ **A pointer that would send a future run to the wrong file.** "`src/content/quizData.js` carries a
  header comment explaining the [answer-key] invariant — read it before adding or editing a question."
  The invariant **moved to `src/content/quizMeta.js`** in item 48's per-language split; `quizData.js`
  is now a node-only merged view **the app never imports** (`check-payload.mjs` forbids importing it).
  Pointer corrected in place.
- ⚠️ **Two `former item N` labels were line-wrapped** (`former item` / newline / `55`, and the same for
  57) and therefore **never registered with the matcher at all** — it requires a literal space. Both
  happen to be live numbered items too, so nothing broke; the failure mode is silent and general, and
  is now written down. Rewritten unwrapped: the section went from 9 registering numbers to 11.
- **Two stale figure sets deleted rather than corrected**, per item 58's cheapest-disposition rule:
  the 2026-08-04 phase-color hexes (the palette has moved twice; item 63 records what re-quoting one
  cost) and the 2026-08-02 per-language volume ratios (four weeks stale, and `LAUNCH_READINESS.md`
  §10.4 publishes the live ones **with their references** — W-5.6's point that a ratio without its
  reference is not a measurement).

Item 122's live text carries the correction, per W-5.5's both-places rule and step 3.5.

#### Verification

`npm test` **PASS, 0 failures** across all eight checks; `npm run build` clean (`✓ built in 1.37s`,
`index` 254.47 kB, byte-identical to the previous run's). The three warnings are the two pre-existing
translation ones and the run-log budget. **The floor warning is cleared** — 252,390 → **243,032 b**,
under the 250,000 b budget, where at pick time it was over. ⚠️ **The post-commit headroom is
deliberately not retyped here** — this entry adds to the run log while it is being written, so a figure
quoted inside it goes stale against itself; read it off the live `MEASURED log-size:` line, which is
item 121's own reasoning for why that script carries no fingerprint. `check-backlog.mjs` still resolves **all 148** `backlog item N` citations.

⛔ **The run-log budget is still over and this entry makes it worse; that is deliberate and is not
this run's item.** Archiving is the only remedy for it, W-5.3's trigger (600 KB whole-file; the file
is 494 KB) has not fired, and **its action clause has a known defect that item 115 reserves to the
owner.** One run, one commit, and the rule change is not mine to make.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression; `check-blindspot` **PASS, 0 failures**. Documentation only:
  `git diff --name-only` is exactly `AGENT_LOG.md`, no `src/`, no learner-visible copy in any
  language, no build output. Added lines carry **2** "Dalio" mentions against **3** in the removed
  lines — a net reduction, and both survivors *state the rule* (§10.2's closed status, and the warning
  never to carry v6's branding over) rather than brand anything; `check-blindspot`'s §10.2 scan
  deliberately covers README + `src/` + v5, not this file, for exactly that reason. Advice-adjacent
  verbs in added lines: **0**. **Control**: the same grep pipeline returns 16 hits for `former item`
  and 10 for `lesson` on the same input, so it reaches the text.
- **W-1 browser verification** — not applicable and not skipped: nothing rendered changed, and the
  build output is byte-identical.
- **`DECISIONS.md` conflict** — none. No decision covers this file's sections; no state, content-module
  or build change.
- **Already-done backlog item** — no. Items 115 and 122 compressed the **numbered** items and both
  left these two sections untouched; this is the remainder they left, and item 122 named it.
  **What I deliberately did not do:** change W-5.3's rule, either budget value, or the archiving
  trigger. All are byte-identical, per item 115.
- **Own verification claim** — reproducible from `npm test`, `npm run build` and
  `node scripts/check-log-size.mjs`; the injection is one `perl -pi -e` substitution. **What I am NOT
  claiming**: that the floor is fixed. At **+3,418 b/commit** this bought about 3 runs, and the
  previous run's finding stands — the growth is continuous and every remedy so far is one-off.

#### Next run

The closed-item tier is now genuinely tight and **item 122's own note applies to what is left**: open
items are the binding constraint at ~47% of the backlog, and compressing those risks dropping live
scope. **Do not expect another compression pass to find much.** Open and unblocked: **item 136**'s
remainder, **items 131+132** (the last 8 review pairs, only worth doing as one decision), **item 130**
(low), and **item 26** / **item 27** — item 27 has taken four of the last six substantive runs, so
W-5.2's ratio rule binds before another.

**For the owner, two decisions and neither is an action any run can take.** (1) **The run-log budget
is over and the rule that would clear it does not fire** — item 115's two options, unchanged. (2) At
**+3,418 b/commit** the floor is crossed roughly every 3 runs regardless of compression; this pass
bought 3 runs, the previous one bought 7.3. **O-1 remains the entire critical path: 44 lessons, five
languages, 160 minutes of content, and zero people have ever opened this app.** **O-3** is unchanged —
human review share is 0% in all four languages; this run added no translated prose.

### 2026-08-28 (scheduled dev-agent) — compression is a bailing bucket: the log's size becomes a RATE, and the "largest lever left" was an artifact of how the bytes were counted (item 121, correcting item 122)

**Pick.** Not item 27 and not the figure cluster: the last four substantive runs were all figures or
figure tooling (items 27, 135+124, 136, 137), which is W-5.2's "direction stops coming from the
backlog and starts coming from continuing the tranche" in a new costume. The pick came instead from
a live signal in this run's own baseline `npm test`: **the floor stood at 249,106 b of a 250,000 b
budget — 894 b of headroom** — and the previous run's closing line had already said "the next item
filed should still expect to trim". That is a condition, not a backlog entry, and it was about to
bind on this run's own commit.

#### Step 3.5 — the premise, re-measured with a control

**The instrument failed on its first run, and the failure looked like data.** A loop over
`git show $c:AGENT_LOG.md` returned `backlog=0 file=0` for every commit. Cause: **zsh read `$c:A` as
a history modifier** (`:A` = absolute path), so the path became `<abs>GENT_LOG.md`. `${c}` fixed it.
Sixteen zeroes are exactly what a genuinely empty section looks like — **the control is the only
reason that was caught**: a working-tree measurement taken alongside had to equal HEAD's, and
`221,562 = 221,562` is what said the second run was real.

**What the measurement then showed, over the 16 commits since item 122's compression pass:**

| | |
|---|---|
| floor growth | **+3,541 b/commit** mean (script, all intervals); **+3,705 b** over substantive runs only |
| net-negative intervals | **1 of 15** |
| what item 122's pass bought | **26,939 b ≈ 7.3 runs** |
| headroom at pick time | **894 b = 0.25 runs** |

⛔ **So the premise behind items 115, 121, 122 and W-5.3 is incomplete in the same way, and that is
the finding.** All four treat log size as a **level** with two one-off remedies (archive, compress).
The growth is **continuous**, both remedies are **one-off**, and a level cannot express the mismatch:
*"floor at 99.6% of budget"* reads as **nearly there**, while the identical state read as a rate says
**the next commit crosses it**. Two compression passes have run (items 115, 122) and the rate after
each is indistinguishable from the rate before.

#### What shipped — `scripts/check-log-size.mjs` measures the rate, not just the level

Levels, budgets and the cut plan are untouched. Added: a git-history block reporting per-commit floor
and run-log growth, the working tree's own spend on top of HEAD, and **the headroom divided by the
rate — "runs of headroom"**, which is the number a run can act on. It **warns when either budget is
under one run's writing away**, i.e. before the level verdict goes red.

⚠️ **A failed history read would report a delta of ZERO — indistinguishable from a disciplined run.**
That is item 108's *"a proxy fails green"* exactly, so every git read is controlled and the block
reports **UNAVAILABLE** naming the failed control rather than a comfortable number.

**All four controls proven by injection in throwaway git repos, not argued:**

- **Positive** — a planted floor growth of exactly **+1,000 b/commit** reports `+1,000 b/commit mean
  (min +1,000, max +1,000)`, and a deliberately constant run log reports `no growth at the sampled
  rate`. The arithmetic is proven, not just the failure paths.
- **A revision missing `## Run log`** → `UNAVAILABLE — '## Run log' or '## Prioritized backlog' is
  absent at b6a1a4c`.
- **Every sampled floor identical** → `UNAVAILABLE — the history read is not varying, and 'no growth'
  here would be an artifact`. (First attempt at this control **did not fire** — the 16-commit window
  still spanned older, varying commits. Re-run against a repo where every sampled revision matched.)
- **No git checkout at all** → `UNAVAILABLE — git log failed`.

**None of the four can print a zero.** Two legibility defects in my own output were caught and fixed
before commit: `1.0 run(s)` printed directly under a warning saying *less than ONE run* (now 2
decimals below 2 runs), and a hardcoded `+` that would have rendered a negative max as `+-748`.

#### The second finding: item 122's "largest single lever left" was a counting artifact

Item 122 recorded **"item 19 (23,478 b, HELD) … the largest single lever left"** and concluded
**"compressing a HELD item risks dropping scope … that is an owner decision, not a run's."**

**Item 19's own body is 307 b — three lines.** The 23,478 came from a per-item split that bounds the
*last* item at the end of the section rather than at the next section header, so it absorbed
everything below it: **"Notes for future runs" (4,304 b) + "Completed and pruned" (18,864 b) =
23,169 b**. Those are closed history, not backlog items, and carry no owner-held scope — two of the
three "Notes" are themselves marked `RESOLVED` (2026-08-13, 2026-08-16).

**Consequence: the largest remaining compression lever is real, is ~23 KB, and nothing gates it** —
it was filed as owner-blocked on the strength of a phantom. Measured with a control: preamble 18,337
+ numbered items 180,053 + Notes 4,304 + Completed 18,864 **sum byte-exactly** to the backlog's
221,562 b. **The same artifact bit twice in one day** — this run hit it first, and caught it only by
opening item 19 and finding three lines where 23 KB was supposed to be.

#### Verification

`npm test` **PASS, 0 failures**, and `npm run build` clean (`✓ built in 1.85s`, `index` 254.47 kB).
The two pre-existing translation warnings are unchanged. Injection rigs were built in the session
scratchpad and deleted; `AGENT_LOG.md` and the script were backed up there first, so nothing was
restored with `git checkout --`.

⛔ **This entry pushed BOTH budgets over, and the instrument predicted it before it happened — which
is the cleanest proof available that it works.** Before this commit the rate block read *floor 0.25
run(s), run log 0.95 run(s) left*, and warned that the level *"still reads green and will not once
this run commits"*. It then measured this run's actual spend at **floor +3,284 b, run log +9,035 b**
— both within a few hundred bytes of the predicted means (+3,541 / +9,170). Post-commit **both
budgets are over**, so `npm test` now carries the two *level* warnings in place of the two *rate*
warnings. **All four are warnings, not failures; the hard fail line is 350 KB and the run log is
nowhere near it.** Clearing them is the next run's work, and the lever is named below.
⚠️ **The exact post-commit bytes are deliberately not retyped here.** Writing them down inside the
entry that produces them is circular — each correction to the figure moves the figure, and one draft
of this paragraph did exactly that and went stale between two `npm test` runs. Read them off the live
`MEASURED log-size:` line, which is re-measured on every run; that is the same reasoning item 121
records for why this script carries no fingerprint.

**Stated plainly rather than buried: I could have stayed under budget by writing less here, and
chose not to.** The two findings — the rate reframing and item 122's artifact — are what the next
run needs in order to act, and trimming them to protect a number this same entry argues is the wrong
number to optimize would have been the wrong trade. **A third legibility defect was caught by this
very state**: over budget the block printed `headroom 0 b = -0.67 run(s)`, a clamped numerator beside
an unclamped ratio. It now reads `OVER by 2,390 b (0.67 run(s) of writing to come back out)`. The
under-budget path was re-checked against the +1,000 b/commit rig afterward and is unchanged.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` **PASS, 0 failures**. The change adds
  **no learner-visible copy in any language** and touches nothing under `src/`: Dalio **0**,
  advice-adjacent verbs **0**, kids/child framing **0**. The one `2026-08-28` date string added to
  the script is a source comment and reaches no bundle (`grep` finds it in **0** files under
  `dist/assets/`), so the Markets-tab hardcoded-date class is untouched. **Control**: "growth rate"
  returns hits on the same added lines, so the greps do reach the text.
- **`DECISIONS.md` conflict** — none. No decision covers log measurement; state stays
  localStorage-only, no build or content-module change, nothing about Vite.
- **Already-done backlog item** — no. This *extends* item 121 (which owns the script) rather than
  redoing it: item 121 shipped the two budgets and explicitly reported levels only. It does **not**
  implement item 115's option (b), and it performs no archiving and no compression — those remain
  the owner's rule change and a separate run's work respectively.
- **The rule I did NOT change, deliberately.** W-5.3's archiving rule, its date-based action clause,
  and both budget values are byte-identical. The finding argues the 250 KB floor budget may be
  unreachable at the current writing rate — **that is an argument for the owner, not a value for me
  to move**, and item 115's rule says so.
- **Own verification claim** — reproducible by re-running `node scripts/check-log-size.mjs`, and the
  four injections are rebuildable from the commands in this entry. **What I am NOT claiming**: that
  the rate is a per-*run* figure. It is per *commit touching `AGENT_LOG.md`*, and the two owner-tree
  bookkeeping commits contribute a real +0 that pulls the mean below the substantive-run figure
  (+3,541 vs +3,705). Both numbers are stated rather than the flattering one.

#### Next run

**The remedy this run's own warning names is now unblocked and is a legitimate whole run: compress
"Notes for future runs" + "Completed and pruned" (~23 KB), the lever item 122 mis-filed as an owner
decision.** Doing it clears both new warnings. Also open and unblocked: **item 136**'s remainder
(weak candidates that should probably stay uncovered), **items 131+132** (the last 8 review pairs,
only worth doing as one decision), **item 130** (low). **Item 27 remains available but has now taken
four consecutive runs — W-5.2's ratio rule should bind before a fifth.**

**For the owner, and it is a decision rather than an action:** at **+3,541 b/commit** the 250 KB
floor budget is crossed roughly every seven runs no matter how many compression passes are run.
Either the budget moves or the amount each run writes into the backlog does. **O-1 remains the entire
critical path** — the log now measures its own growth precisely, and zero people have opened the app.
**O-3** is unchanged: human review share is still 0% in all four languages, and this run added no
translated prose.

### 2026-08-28 (scheduled dev-agent) — the fix the previous run priced as a five-language rewrite cost zero content strings, and lesson 23's two curves are now two curves (item 137)

**Picked item 137**, the top open, unblocked candidate named by the previous run and the only *live*,
reader-facing defect in the figure family — it ships in five languages today. HEAD at `98f2714`;
`npm run owner-tree` read **UNMOVED `c2331799…`** against the expected fingerprint (0 tracked
modified, 52 untracked), so the owner's `UIUX/` and `drafts/` were untouched and nothing of theirs
is in this commit.

The previous run filed this rather than shipping it, and said it "needs a pedagogy call on the log
scale, so it may be worth the owner's eye". **That deferral was priced off two costs, and step 3.5
found both of them smaller than filed** — which is the whole reason this became a one-run item.

#### Step 3.5 — the arithmetic held exactly; both of the item's BLOCKERS did not

- **The headline numbers reproduce, independently and to the digit.** Re-derived from source with
  the component's own geometry (viewBox 300x140, pad 6/6/18/22, `preserveAspectRatio` meet), then
  measured again in the live DOM: separation at the nine sampled months
  **1.64 / 1.79 / 1.95 / 2.02 / 1.72 / 1.03 / -0.86 / -6.87 / -36.05 px** against a computed stroke
  of **2.58px**, in a 309x150 box at mobile 375. Source model and live render agree on every digit.
  **The control fired**: a planted polyline pair with a known 20-user-unit gap measured **20.60px**
  = 20 x the live `ctm.d` of 1.03, so the instrument can see a gap it is given.
- **One count in the item is off by one, in the harmless direction.** It says the strokes overlap at
  "six of the nine samples — every one before the crossing". Six is the count of *pre-crossing*
  overlaps; the total is **seven** (month 10, just past the crossing at 9.667, is -0.86px). The
  sentence as written is true and the extra one is a sample where the curves are *supposed* to be
  converging, so nothing follows from it. Recorded rather than corrected in place.
- ⛔ **BLOCKER 1 WAS FALSE: "`flipDescription` would have to be rewritten in five languages."** The
  item priced a log axis as spending the hockey stick. Measured in rendered px/month, it mutes it
  and does not spend it: the $50's last-segment slope drops from **9.68x** the mean of the earlier
  segments to **3.48x** — still by far the steepest stretch — and the curve still crosses and still
  finishes **15.6%** of the plot height clear of the $65 (was 35.0%). The text alternative's three
  clauses ("turns sharply upward", "crosses above", "finishes well above it") were checked one at a
  time against that geometry and all three hold. **Zero content strings were touched, in any
  language** — verified by grepping the diff for added `en:`/`es:`/`ko:`/`zh:`/`ja:` lines: **0**.
- ⛔ **BLOCKER 2 WAS FALSE: "§50 (f)'s drawability clause would need re-deriving on the new scale."**
  §50 (f) tests where the crossing sits **along the x-axis** (it must be between 5% and 95%). A
  y-scale cannot move an x-position. Confirmed in the live render rather than argued: the drawn
  curves still swap order exactly once, between x=261.7px and x=286.4px, with the dashed marker at
  **x=278.1px** — the same bracket and the same marker the previous run measured.
- **The component's own comment had to be corrected too, and it was the interesting part.**
  `charts.jsx` asserted the near-coincidence was "the honest shape of hyperbolic discounting, not a
  drafting failure", and that the tinted panel alone carried the decision. The curves being *close*
  is indeed the honest shape — but at 1.64px under a 2.58px stroke they did not render as two close
  lines, they rendered as **one line**, and no amount of panel tinting says which option is higher.
  That comment is why the defect survived being looked at; it is rewritten in this commit.

#### What shipped

- **`moneyVisuals.js` exports `flipYNorm`** — a log y-scale returning a 0..1 position, with an 8%
  floor margin so the lowest point does not rest on the baseline rule (it sits 7.63px above it, vs
  7.92px before, so that changed essentially nothing). The scale lives with the data because it is a
  claim about the data; `charts.jsx` holds no numbers and now takes it as a `yNorm` prop.
- **`PreferenceFlip`'s baseline and crossing marker stop being computed from `py(0)`**, which is
  undefined on a log scale. Both are drawn at the plot floor — **the same pixel as before** — and
  the line is a frame, not a zero reference, which it was never labeled as anyway.
- **`check-data.mjs` §50 (i)**, so this is a property and not a claim: at **both edges** — lesson
  23's own two scenarios, named on the axis — the y-scale must separate the curves by **≥5% of plot
  height**. `PreferenceFlip` draws a 100-unit plot with a 2.5-unit stroke, so the stroke is exactly
  **2.5% of plot height at every scale the figure is ever drawn at**, and 5% is two stroke widths;
  the live probe's one-stroke-width rule cannot fail while this passes. Nothing is asserted near the
  crossing, where the curves must converge. A second half asserts the scale never **reorders** the
  curves at any sampled month.
- **§51b caught my own edit and I repointed it**, which is worth recording because it is the
  register working: `LINE_SVG_DECORATIVE` keys the baseline by its source text `y1={py(0)}`, so the
  build went red the moment that moved. The classification still holds — more strongly, since the
  rule is now explicitly not a zero line.

#### Verification

- **`npm test` exit 0**, with the same 2 pre-existing warnings as the pre-change baseline
  (translation review coverage, translation completeness) and no new ones.
- **Both halves of §50 (i) proven by injection, then restored from a scratchpad copy** (never
  `git checkout --`): the linear scale this figure shipped with reports **1.59% against the 5%
  floor**, and a non-monotone scale that separates both edges reports the reorder at months 8 and 9.
  A check that has never failed has not been tested.
- **Live, in a real browser** (`npm run build`, `python3 -m http.server`, `preview_start` with a
  plain `url`): left edge **7.00px against a 2.58px stroke = 2.72x** (was 0.64x), right edge
  16.02px, **overlapping samples down from 7 of 9 to 2 of 9** — both of them adjacent to the
  crossing, where overlap is correct. Confirmed visually in a screenshot: two distinct curves, green
  above amber across the left three quarters, converging into the marker.
- **`a11y-sweep.js` run from the checked-in file, `selftest()` first**: all ten controls fired
  including `figureClaims`, then `run()` on lesson 23 returned **`figureClaims` clean, 0 findings**.
  The one live finding the previous run's probe reported is gone, measured by that same probe.
- **Dark mode and a non-English language, because both are traps this repo has hit**: `ja` + dark
  (`--line-hairline` = `#2e2922`) gives **identical numbers** — 7.00px, 2.72x, 2 overlapping. **Not
  a mobile artifact either**: at a 1100px viewport the box is 394px and the ratio is **2.72x**
  again, since separation and stroke scale together.
- **My own comment carried a stale figure and the audit caught it.** "finishes 16.8% clear" was
  computed against a draft `flipYNorm` written *before* the floor margin existed; against the
  function actually shipped it is **15.6%**. Corrected in the source comment and in item 137. This
  is item 58's rule firing on me — a same-day measured figure is least trustworthy when its date
  matches the change it sits above — so every number in this entry was re-run against the shipped
  function, with a control (`flipYNorm(max)` = exactly 1.000000).

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` **PASS, 0 failures**. Over the **130
  added lines** in `src/` + `scripts/`: Dalio **0**, advice-adjacent verbs **0**, kids/child framing
  **0**, and **no learner-visible copy at all** — 0 added content strings in any of the five
  languages. **Control**: "plot height" returns **4** on the same added lines, so the greps reach
  the text. The two `2026-08-28` date strings are both in source comments and **reach no bundle** —
  `grep` finds the date in **0** files under `dist/assets/`, so the Markets-tab hardcoded-date class
  is not touched.
- **`DECISIONS.md` conflict** — none. No decision there covers figure geometry or chart scales;
  state stays localStorage-only, the scale ships as a function in a **`.js` content module** (which
  is the `.js`-not-JSON decision being used rather than contradicted), and nothing about the build
  changed.
- **Already-done backlog item** — no. Item 137 was open and named exactly this work; item 136 built
  the probe that found it and explicitly left the repair unfixed ("this run bought the *instrument*
  and the *diagnosis*, not the repair").
- **Own verification claim** — reproducible: the source re-derivation, the two check-data
  injections, the live before/after with its planted-gap control, the `selftest()`-then-`run()`
  sweep, and the dark/`ja` and 1100px re-runs. **What I am NOT claiming**: that the log axis is
  costless. It mutes the upturn from 9.68x to 3.48x, and that is a judgment I made rather than one
  the owner made — the previous run flagged it as possibly theirs. I shipped it because the
  alternative is a caption that says "the $65 is simply the better deal" over a picture drawing one
  line, and because this axis carries no label, gridline or printed value to spend. **It reverses in
  one line** (`flipYNorm` in `moneyVisuals.js`), and §50 (i) is what would go red if it did.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — this run touched only tracked files, so the deviation is the owner's 52
untracked paths and nothing else). **Open and unblocked:** **item 136**'s remainder (`GrowthCurve`,
`BracketStack`, `YieldCurve`, `CycleChart`, `Bar` — all weak candidates that should probably stay
uncovered; `ProportionBar` is ruled out); **items 131+132** (the last 8 review pairs, only worth
doing as one decision); **item 130** (§55's comment blind spot, low). Item 137 closing freed **748 b**
of backlog, so the floor is off 99.9% — but not by much, and the next item filed should still expect
to trim. **O-1 remains the entire critical path**: lesson 23's figure now shows what its caption says,
and zero people have opened the app. **O-3** is unchanged — human review share is still 0% in all
four languages, and this run added no translated prose.

### 2026-08-28 (scheduled dev-agent) — the figure whose claim is true in the data and invisible in the pixels: two curves 1.64px apart under a 2.58px stroke (item 136 → new item 137)

**Picked item 136**, the top open, unblocked candidate named by the previous run, and built the half
of it that survived re-measurement. Tree clean apart from the owner's untracked `UIUX/` and
`drafts/`; `owner-tree --expect c2331799…` **UNMOVED** before any edit, HEAD still `d35218d`.

#### Step 3.5 — the item recommended two figures; the measurements reversed one and strengthened the other

The item's structural premise **held**: 11 chart primitives carry `role="img"`, 4 declare a
`data-figure`, and the 7 it lists as uncovered are exactly the 7 that are.

- ⛔ **`ProportionBar` should not be built, and the item's reason for it is the false part.** Lesson
  1's segments render **154.5 / 92.688 / 61.797 px of 309** — exactly the 50/30/20 the caption
  states. Then perturbed, because a claim that cannot fail is decorative green: **a `gap` on the
  container**, **padding on a segment**, and **28 characters of unbreakable content inside one** all
  left it at **50/30/20**. `flex-grow: 0` with bases summing to exactly 100% leaves no free space,
  so `min-width: auto` never binds and content cannot widen a segment — the rendered ratio is the
  value ratio *by construction*. This is **not** the `OutcomeGrid` class it was filed as.
  **The control fired**: forcing `min-width: 150px` on the third segment moved the reading to
  **32/19/49**, so the instrument can see a broken ratio. Correction written into item 136 itself.
- ⚠️ **And the control caught me destroying the thing I was measuring.** The first perturbation pass
  called `fig.lastChild.remove()` to undo an injected text node — but the text node was inside the
  third segment, so `lastChild` was **the segment**. All four readings in that call were taken
  against a two-segment bar and every one of them was garbage that looked like data (`62.5 / 37.5`,
  stable across three conditions, which is exactly what a real result looks like). Caught by the
  child count, not by reading the numbers. **Reloaded and redid it; `n: 3` is asserted in the
  corrected call.** This is the Environment note's "restore by reloading, never by clearing" rule
  arriving one level up: the plant I could not cleanly undo was a *node*, not a style.
- ✅ **`PreferenceFlip` should be built, and for a stronger reason than the one filed** — "zero known
  live instances" was wrong. It has one, and it is the finding below.

#### What shipped — `figureClaims` learns lesson 23, and lesson 23 fails it

`PreferenceFlip` now declares `data-figure="preferenceFlip"` with `series`/`marker` parts, and the
claim asserts the three sentences its own text alternative makes: **exactly one order change**, **the
dashed marker standing where the curves actually swap**, and **the two ENDS separated by more than
one stroke width**. Nothing is asserted near the crossing, where the curves *must* converge — a
blanket "always separated" rule would contradict the figure's own point. The ends are chosen because
they are lesson 23's two named scenarios ("Both a year away" / "The $50 is available today").

**Everything is read in client pixels** through `getScreenCTM()` and the live `SVGPointList`, never
off the `points` string. That distinction is the whole reason this is a probe and not a §50 clause: a
transform, a CSS `stroke-width` override, a viewBox edit and `vector-effect: non-scaling-stroke` all
change what is drawn without changing any source number.

**The live finding, and it is a real reader-visible defect in shipped content:**

> `preferenceFlip: at the left edge the two curves are 1.64px apart while each stroke is 2.58px
> wide, so the two strokes overlap and no reader can see which option is on top.`

Separation across the nine sampled months is **1.64 / 1.79 / 1.95 / 2.02 / 1.72 / 1.03 / -0.86 /
-6.87 / -36.05 px** against a computed **2.58px** stroke — **overlapping at six of nine samples**,
every one of them before the crossing. The caption says *"For most of the year the $65 is simply the
better deal"*; the screenshot shows one green line with an amber fringe. **§50 is not wrong** — it
asserts the *order* at the bracketing samples and the order is correct. Whether a reader can *see*
an ordering is stroke width against separation, which only the render answers. **Filed as item 137**
with the fix analysis (geometry cannot fix it — separation and stroke both scale with the viewBox;
`k` cannot either, in either direction; a log y-scale gives **7.35%** of plot height at the left edge
but spends the late hockey stick and needs `flipDescription` rewritten in five languages). **Filed
rather than shipped on purpose:** that is a pedagogy trade on a teaching figure, not a bug fix.

#### Verification

- **`npm test` 0 failures, 2 warnings** (the documented translation baselines), **`npm run build`
  clean**. §43 still reports **11 probes (10 layout-gated), all with planted controls** — this run
  added a claim, not a probe.
- **`selftest PASS (10/10 controls fired, plantsRemoved true)`**, with `figureClaims` now carrying
  **four** required regexes, one per independently-rottable half. The two new ones are keyed to what
  the app **cannot** produce — a 7px stroke, and a negative client x that only an off-screen plant
  has — **because lesson 23 fails this check for real today**, so a shape match would have reported
  the control as fired while it was actually measuring the live defect.
- **Live sweep, 12 lessons** (1, 3, 7, 17, 23, 27, 28, 32, 36, 37, 38, 44): **1 finding, 0 vacuous,
  15 figure instances scanned**. The finding is lesson 23's and the other 11 lessons are clean, so
  the probe is discriminating rather than blanket-failing. The other two halves of the new claim
  (single crossing; marker inside the swap bracket at x=278.14px between 261.66 and 286.38) **pass**.
- **Dark mode and a non-English language, because both are traps this repo has hit.** `--line-hairline`
  reading `#2e2922` (the dark value) with `lang="ja"`: **identical finding, identical numbers** —
  confirming the claim is geometry-only and language-independent, which was the point of keying it to
  `data-figure` rather than to copy.
- **Not a mobile artifact**: at a 1100px viewport the figure is 394px wide and reports **1.71px against
  2.68px** — the same ratio, since separation and stroke scale together. The defect is scale-invariant.
- **The build guard did its job on me**: the first `npm test` **failed** because the probe's comment
  cited "backlog item 137" before that item existed. Filed it, then green.
- **The floor budget caught my own backlog addition**, which is worth recording because it is the
  W-5.3 failure mode firing correctly: item 137 pushed the never-archived floor to **250,302 b**,
  302 b over budget, and archiving cannot move that number. Trimmed **448 b** of my own prose —
  no measurement dropped — to **249,854 b** (99.9% of budget). **The floor is effectively full; the
  next backlog addition of any size will warn.**

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` **PASS, 0 failures**. Over the **95 added
  lines in `src/` + `scripts/`**: Dalio **0**, advice-adjacent verbs **0**, kids/child framing **0**,
  and the diff adds **no learner-visible copy at all** — only `data-*` attributes and probe code.
  **Control**: `data-figure-part` returns **7** on the same added lines, so the greps reach the text.
  Scoped to shipping files, per the previous run's warning that a whole-diff grep matches this
  bullet's own prose.
- **`DECISIONS.md` conflict** — none. The two keyword hits in the diff are `Expo` inside
  `export function PreferenceFlip` in hunk headers. No state, storage, content-module or build
  decision is touched, and **the sweep still ships to nobody**: `grep` finds `preferenceFlip:
  function` in **0** files under `dist/assets/`, so it remains a pasted-file instrument with the same
  standing cost item 12's port-cost rule accepted.
- **Already-done backlog item** — no. Item 136 was open and named this exact work; item 135 built the
  machinery and explicitly left these seven as the residual.
- **Own verification claim** — reproducible: the perturbation table with its fired `min-width`
  control, the selftest, the 12-lesson sweep, the dark/`ja` re-run and the 1100px re-run. **What I am
  NOT claiming**: that lesson 23 is fixed. It is not — the app ships this defect today in five
  languages, and this run bought the *instrument* and the *diagnosis*, not the repair. Nor is
  `figureClaims` now green: it reports one finding, which is the honest state.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — this run touched only tracked files). **Open and unblocked:** **item 137**
(lesson 23's y-scale — the highest-value item in the figure family, and the only one a reader
experiences; it needs a pedagogy call on the log scale, so it may be worth the owner's eye);
**item 136**'s remainder (only `ProportionBar` was ruled out — `GrowthCurve`, `BracketStack`,
`YieldCurve`, `CycleChart`, `Bar` are still weak candidates and should probably stay uncovered);
**items 131+132** (the last 8 review pairs, only worth doing as one decision); **item 130** (§55's
comment blind spot). ⚠️ **The backlog floor is at 99.9% of budget** — the next run that files an item
should expect to trim, or pick the compression pass (item 115). **O-1 remains the entire critical
path** — the app now has a probe that can prove a figure lies, and still zero people have opened it.

### 2026-08-28 (owner-directed: "do item 135 next") — the capability both items called "already there" did not exist, and finding that out fixed a hole in a third probe (items 135 + 124)

**Picked item 135** on the owner's explicit pick, and built **item 124** with it — item 135's own
filing says they are one probe read from two sides, and re-reading both confirmed it. Tree clean
apart from the owner's untracked `UIUX/` and `drafts/`; `owner-tree --expect c2331799…` **UNMOVED**
before any edit.

#### Step 3.5 — the shared premise broke, and the break was the run's most useful finding

Both items rest on one sentence: *"the a11y sweep already renders the app and walks each
`role="img"` subtree."* **It does not.** `imagesWithoutAlt` selected `img, svg[role='img']`, and
`role="img"` is an ARIA role any element may carry.

- **Measured, with a two-sided control.** On lesson 28 the page holds **1** `[role="img"]` and the
  probe matched **0**. The control fired on lesson 44's `<svg role="img">` — so the selector was
  proven *working*, not broken generally, and the zero was specific to `div`.
- **Then my own correction was wrong, in the same direction.** The fix's first comment said "two of
  eight figures are divs", written from the two I had open. Parsing every `role="img"` against its
  owning component says **6 of 11 primitives** — `Bar`, `ProportionBar`, `AsymmetryChart`,
  `BracketStack`, `GapColumns`, `OutcomeGrid`. The probe was blind to the **majority** of the app's
  figures. **It counted where it was looking, which is item 134's error exactly**, one run later,
  by me. Corrected in the file with the parse that produced it.
- **Nothing shipped unnamed** — §22 guards the accessible name at the call site — but a probe whose
  claim is broader than its behavior is the lying zero that file exists to prevent, in the file
  itself. Fixed to `img, [role='img']`; `imagesWithoutAlt` now scans 1 on lesson 28 where it
  scanned 0.
- **Item 124's own premises held**: §51b's SVG-paint register is intact, and `AsymmetryChart`'s zero
  line is still `borderTop: 1px solid graph.neutral` on an absolutely-positioned div — correct
  today, and still lexically identical to the ~50 decorative card borders, which is why a source
  scan cannot tell them apart.

#### What shipped — one probe, `figureClaims`, with both halves

**Item 135's half — the render is checked against the claim.** Four figures now DECLARE the relation
their own caption states, keyed by a language-independent `data-figure` attribute:
`outcomeGrid` (the four cells are equal), `earningsGap` (the two gap segments are equal),
`lossAsymmetry` (the loss bar is taller), `incomeTradeoff` (labor's dot sits on the rail, the other
three clear it by more than a dot diameter). **Deliberately not a generic "does this figure look
right" check** — that is unfalsifiable. Same discipline as §50/§53/§54, moved from the data to the
render.

**Item 124's half — a border inside a picture is datum.** For every `[role="img"]`, every descendant
with a non-zero border width is checked against the live values of `--line-hairline`/`--line-strong`.
No per-figure declaration is needed because "inside the picture" is the whole predicate, and
position and containment — the two things that defeat a source scanner — are free in the DOM.
**Color normalisation was load-bearing:** a custom property holds `#e4ddd2` while
`getComputedStyle` always returns `rgb(228, 221, 210)`, so a string comparison would have made this
check permanently silent.

#### Verification

- **`npm test` 0 failures, 2 warnings** (the documented baselines), **`npm run build` clean**.
  §43 now reports **11 probes (10 layout-gated), all with planted controls** — it derives that
  itself, and it is what forced the new probe to carry a control.
- **`selftest PASS (10/10 controls fired, plantsRemoved true)`.** `figureClaims` required **two**
  regexes, like `headingOrder`, because its halves fail separately: the plant carries both a short
  cell (geometry) and a border painted with the **live** value of `--line-hairline` (item 124), so
  the control cannot rot after a palette edit.
- **Both halves proven on REAL figures, not only on plants.** Injecting into the live DOM on lesson
  17 turned the equal-gaps claim into
  *"the two gap segments render at 7px and 40px"*; a planted `--line-hairline` border inside lesson
  27's real `lossAsymmetry` figure produced *"a border inside the figure paints --line-hairline"*.
  The other two claims were proven against synthetic figures carrying the same hooks — see the
  Environment note for why a live React component cannot hold an injected inline style.
- **Live sweep across 12 lessons (1, 3, 7, 17, 23, 27, 28, 32, 36, 37, 38, 44): `figureClaims` 0
  findings, 15 figure instances scanned; whole sweep `clean on 10 probe(s); 1 unavailable`, 0 findings,
  0 vacuous.** Item 124's "zero known live instances" is now measured rather than asserted.
- **The claims are non-trivial, which is what stops them being decorative green.** Lesson 17's two
  gap segments render at **7.08px each while their columns are 70.8px and 170px**, both above the
  `minHeight: 4` floor, so the equality is neither trivial nor a floor artifact. Lesson 27's bars
  are **37.5 vs 75px** — the 2x the lesson states. Lesson 44's labor dot lifts **0.0px** off the
  rail against **48.4 / 72.6 / 96.8** for the other three, at a 10.3px diameter; §54 (d) computes
  that clearance from source constants, and this is the first time it has been read off the render.
- **Dark mode checked, because that is a trap this repo has hit.** The token values are read at run
  time: the item-124 control fires with `#e4ddd2` in light and `#2e2922` in dark. A hardcoded light
  value would have gone silently blind in dark.
- **The app was restored and re-measured before anything was called clean** — the live-DOM plants
  were undone by reloading, not by clearing properties (see the Environment note), and the final
  reading is 0 findings with lesson 28's cells at 96x52 on `--graph-neutral`.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` 7/7. The diff adds no learner-visible
  copy at all: it is one script, one probe, and the `data-*` hooks. Over the **196 added lines in
  `scripts/` and `src/`**: Dalio **0**, advice-adjacent verbs **0**, child-facing framing **0**, and
  no date or figure reaches a rendered string. **Control**: `data-figure` returns **23** on that
  same diff, so the greps reach the added text.
  ⚠️ **Scoping the grep to the code was not cosmetic, and the next run will hit this too.** Run over
  the WHOLE diff the Dalio pattern returns **1** — matching this very bullet, which contains the
  word while reporting zero. **A blindspot grep over a diff that includes `AGENT_LOG.md` matches the
  self-check's own prose**, so it must be scoped to the files that actually ship, or it reports a
  finding against itself every time.
- **`DECISIONS.md` conflict** — none. No state, storage, content-module or build decision is
  touched. The sweep remains a pasted file rather than part of `npm test`, which is the standing
  call (item 12's port-cost rule — a headless browser is the thing that would change it).
- **Already-done backlog item** — no. Items 135 and 124 were both open and both name this exact
  build; 124's "shape that could work" is what shipped, not a re-derivation.
- **Own verification claim** — reproducible: the selector measurement with its two-sided control,
  the component parse behind the 6-of-11 count, the selftest, the two live-figure injections, and
  the 12-lesson sweep. **What I am NOT claiming**: that figure geometry is now a solved property.
  Four figures declare a claim and seven do not — that is **item 136**, and most of those seven
  should stay uncovered, because a claim is only worth writing where a caption asserts something a
  box can falsify. Nor does any of this run on `npm test`; it is still a file a run must paste,
  which is the standing cost §43 exists to contain.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — this run touched only tracked files). **Open and unblocked:**
**item 136** (`ProportionBar`'s ratio and `PreferenceFlip`'s crossing are the two worth declaring;
the other five probably should not be); **item 27** (a ninth figure, bar unchanged and still no
named candidate); **items 131+132** (the last 8 review pairs, only worth doing as one decision);
**item 130** (§55's comment blind spot). **O-1 remains the entire critical path** — four of the
app's figures now have their claims checked against the pixels a browser actually drew, and still
zero people have opened any of them.

### 2026-08-28 (scheduled dev-agent) — the figure that shipped its own refutation: a grid arguing all four cells are equal, rendering one row half again as tall (item 27)

**Picked item 27**, the eighth lesson figure — the top open, unblocked candidate named by the previous
run, and the first content-facing pick after three runs of translation review and tooling (items 129,
131, 134). Tree clean apart from the owner's untracked `UIUX/` and `drafts/`; `owner-tree --expect
c2331799…` **UNMOVED** before any edit.

#### Step 3.5 — the premise held on the numbers, and the work was finding a candidate that survives

- **Coverage re-measured with item 27's mandated parser control** (three ids the parse must find,
  three it must not; plus a join control against three lesson ids whose track I knew independently):
  **economy 5/12, essentials 3/15, money 4/17** — item 27's stated counts, exactly. First premise in
  a while that held as written.
- **Two instrument failures on the way, both caught by controls rather than by reading.** The first
  join returned **0 lessons parsed** and reported all 12 visual ids as missing from `lessons.js` —
  impossible on its face; the record regex assumed one object per `{}` and `title` objects contain
  braces. The second: seven anchor phrases I knew were in lesson 28 all came back MISS, because
  `lessonContent.money.en.js` stores `body` as a plain string while the merged `lessonContent.js`
  keys it by language. **Both would have returned a confident, clean-looking number.**
- **The item's real bar is not a number, it is a candidate**, and three strong-looking ones were
  measured and **rejected** before lesson 28 was picked — lesson 18 (no depreciation slope for
  Jordan), lesson 21 (the independent value is deliberately withheld), lesson 25 (states no rate,
  horizon or amount, and closes by refusing a numeric answer). All three fail item 27's own rule:
  *does the prose state every quantity the shape needs, or only the ones that make it sound
  plausible?* Written into item 27 so they are not re-derived.

#### What shipped

**Lesson 28 ("Does One Lucky Win Prove You Have a System?") gets `OutcomeGrid`** — a 2x2 of outcome
(column: it lost / it won) against the decision behind it (row: a good decision / a bad or lucky
decision), with a bracket over the won column labeled *"All a win tells you"* and one marked cell for
Maria's hunch that rose 40%.

**Why it cleared the bar.** The lesson's sentence is *"outcome and process are two different things —
a good decision can still lose ... and a bad or lucky decision can still win."* Two different things
is two axes, and the claim the lesson needs is that **one column holds both rows**: a win locates you
in a column, not a cell. Prose can assert that twice; it cannot draw a column with two cells in it.
It is the first **partition** figure in the app — it carries no magnitude at all, which is what the
new `check-data.mjs` §57 is shaped around (§21/§50/§53 check arithmetic, §54 checks ranks, §57 checks
that nobody has started drawing a quantity the lesson does not have).

- `src/content/moneyVisuals.js` — the cell data plus title, both axis label pairs, bracket label,
  marker label, caption and text alternative, in all five languages. **Row labels are lifted from
  each language's own lesson-28 body**, not translated from the English, per §54 (e)'s precedent.
- `src/components/charts.jsx` — `OutcomeGrid`, HTML rather than SVG because "Una decisión mala o
  afortunada" cannot be laid out in a 150-unit SVG cell and SVG does not wrap; `Bar` is the precedent
  for a `role="img"` div. `graph.neutral` for the cell rules and the bracket — **datum geometry, not
  decoration**, so 1.4.11 applies at 3:1 and no `line-*` token clears it. That is **item 124's case
  applied deliberately**: the bracket is a CSS border, which §51's source scan cannot see.
- `scripts/check-data.mjs` — **§57**, seven assertions (see below).

#### ⛔ The finding: the figure shipped its own refutation, twice, through a green check

`OutcomeGrid`'s entire argument is that the four cells are equal — lesson 28 says all four cases occur
and says **nothing** about how often, so a weighted cell would answer a question the lesson leaves
open and read as guidance about how far to trust a result (§10.1 drawn rather than written). §57 (e)
was written specifically to hold that.

**It rendered the bottom row at 82px against the top row's 52px.** Measured with
`getBoundingClientRect()` in the live browser; §57 passed throughout. Maria's label sat inside her
cell, and CSS grid sizes a row to its tallest item — so the row containing the label grew, and the
figure drew "bad or lucky decision" as the larger case. **Nothing was declared unequal.** The column
fractions were equal and the shared `minHeight` was a single literal, which is all a source check can
see; the inequality arrived through **content**.

Fixed by moving the label to a key below the grid, so a cell holds one dot and no text. **It then
rendered 65 against 52** — the same failure a second time, now from the row *heading*: "A bad or
lucky decision" wraps to three lines where "A good decision" wraps to two. Fixed by pinning the cell
to a fixed shared height (`GRID_CELL_H`) with `alignSelf: center`, which is safe **only because** the
cell is now text-free. Final measurement: **all four cells 96x52**, in `en` and in `ja` (the longest
labels), light and dark, with a control proving the measurement could see a height difference at all.

Both fixes are now structural invariants rather than style values, and both are asserted: §57 (e)
requires one fixed shared height and **zero** `minHeight`, and §57 (e2) requires the cell JSX to
contain no `<Text>`. Filed as **item 135** — the class is that every figure check here reads source
while the claims are about the render, and it is **item 124's probe from the other side**.

#### Verification

- **`npm test` 0 failures, 2 warnings** (the two documented baselines), **`npm run build` clean**,
  `check-blindspot` 7/7, `refresh-readiness --check` green (12 generated figures still agree).
- **§57 proven by injection, seven times, each restored from a scratchpad copy and re-diffed to
  byte-identical** — never `git checkout --`: a dropped cell **(a)**, a duplicated cell **(a)**, the
  marker moved to (0,1) **(b)**, a plausible `ko` row-label retranslation `좋은 결정 → 좋은 판단`
  **(c)**, a widened won column `1fr → 1.4fr` **(e)**, a per-cell conditional height **(e)**, the
  label put back inside the cell **(e2)**, and the component renamed **(control)**. Every one fired
  with the message it should.
- **§57's first draft was itself a false positive that failed the build on correct code**: it grepped
  the dot's JSX for `r=` to detect a reintroduced SVG radius, and `r=` matches inside
  `variant="caption"`. **A substring is not a token** — the same class as item 134's title/non-title
  join. Rewritten and the reasoning left in the code.
- **The existing guards were proven to REACH the new strings rather than assumed to**: planting
  `behaviour` in `outcomeColumnLabels.en` fired §55 by name, and planting ASCII quotes in
  `outcomeColumnLabels.zh` fired §56 by name. Without this their green would have been vacuous for
  this change.
- **Live browser verification (W-1).** Fresh `dist/` over `/usr/bin/python3 -m http.server`,
  `preview_start` with a plain `url`, viewport resized to mobile **before** measuring geometry, and
  the **bundle name read back and matched to the build just run** at every step
  (`index-Bwm2tGIf` → `index-10Rssgyd` → `index-Ajml9TNn`) per the Environment note's rule 4 — which
  is what made the two geometry regressions visible instead of cached away. Verified in `en` and
  `ja`, light and dark: cells 96x52 in all four combinations, no horizontal overflow of the figure or
  the body, cell rules and bracket resolving to `--graph-neutral` (`#736b61` light / `#8a8072` dark)
  and the marked dot to `--graph-blue`, both already inside §28b's 70-pair 3:1 sweep.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` green on all 7. Over the 538 added lines:
  Dalio/`principles of` **0**, advice-adjacent verbs **0**, child-facing framing **0**. **Controls**:
  `lesson` returns 52 and `40%` returns 14 on the same diff, so the greps reach the added text. Two
  date matches, both in source comments (a check header and a JSX comment); **zero in any rendered
  string**, and §2.3's own check confirms no live-looking date in `moneyVisuals.js`.
- **`DECISIONS.md` conflict** — none. `.js`-not-JSON content, localStorage-only state and
  Vite-not-Expo are all untouched. This run is an *instance* of the machine-translation decision
  rather than a departure: it adds **8 new five-language string sets to `moneyVisuals.js`**, which
  that entry explicitly records as outside `review-status`'s coverage and shipping under "(Beta)".
  Its own amendment applies word for word — *"chart labels are the content type where an unreviewed
  translation is least visible, because a wrong label still renders as a correctly-shaped chart."*
  Mitigated as far as this run can: every row label is the lesson's own phrase in that language and
  §57 (c) fails the build if it stops being. **The caption and description are not mitigated that
  way and are AI translations**, which is **O-3**'s standing question for the owner.
- **Already-done backlog item** — no. Item 27 is open and asks for exactly this, and the item's
  guard against becoming count-shaped was honored: a candidate was found by reading prose, and three
  were rejected on the record.
- **Own verification claim** — reproducible end to end: the coverage parse with its control, the
  seven injections with landing proof and byte-identical restores, the two reach-controls for
  §55/§56, and the live measurements with the bundle read back each time. **The thing I am NOT
  claiming**: that §57 makes figure geometry a solved property. It pins *this* figure, structurally
  and by injection. The other seven figures still have their rendered claims checked against source
  numbers, which is item 135 and is written into §57's header where the next run will read it.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — this run touched only tracked files). **Open and unblocked:** **item 135**
(the rendered-geometry probe — build it together with **item 124**, which wants the same live-DOM
probe for border colors inside a figure; they are one probe read from two sides); **item 27** (a
ninth figure, bar unchanged and no named candidate); **items 131+132** (the last 8 review pairs,
only worth doing as one decision). **O-1 remains the entire critical path** — 44
lessons, 5 languages, 8 figures, 9 check scripts, and still zero people have opened this app — and
**O-3** is the owner decision this run's own step-5 caveat points back at.
