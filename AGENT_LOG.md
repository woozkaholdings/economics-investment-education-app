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

131. **🟡 20 of 28 PAIRS DONE (8 on 2026-08-27, 12 more 2026-08-27 owner-directed: "do lessons 33,
    37, 39 next"). Only lessons 1 and 4 remain, and they are item 132's, not staleness's. Read the
    premise correction — the staleness flag was UNDERSTATING this item, and its own "scope it to one
    language per run" was the wrong axis.**
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
    - **OPEN — lessons 1 and 4 x 4 = 8 pairs**, and **this is the whole remainder.** Cheap and
      low-yield: the text is unchanged and was reviewed once already, so marking them is closer to a
      re-stamp than a read. **Do them only together with item 132**, which is the thing actually worth
      deciding about those two lessons.
    - **Honest priority: low now** — the half that was content nobody had checked is checked. What is
      left is a bookkeeping tail. Downstream of O-1 like everything else.

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

136. **[Process/Tooling — filed 2026-08-28 by the run that built `figureClaims` (items 135+124),
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

137. **[Content/Figure — filed 2026-08-28 by the run that built item 136's `preferenceFlip` claim,
    as the live defect that claim found on its first run.] Lesson 23 draws its two curves 1.64px
    apart with a 2.58px stroke, so for three quarters of the span the reader sees one line, not
    two — and "the $65 is simply the better deal" is the half of the lesson that is invisible.**
    - **Measured in client pixels** (`getScreenCTM()` + the live `SVGPointList`), lesson 23, mobile
      375px, English: vertical separation at the nine sampled months is
      **1.64 / 1.79 / 1.95 / 2.02 / 1.72 / 1.03 / -0.86 / -6.87 / -36.05 px** against a computed
      stroke width of **2.58px**. The strokes therefore **overlap at six of the nine samples** —
      every one before the crossing. Confirmed visually: the left three quarters of the figure
      render as a single green line with an amber fringe.
    - **Nothing in source can see this and §50 is not wrong.** §50 (g) asserts the ORDER at the
      samples bracketing the crossing, and the order is correct; the figure's own text alternative
      says the $65 curve "sits **slightly** above". Whether a reader can *see* an ordering is a
      question about stroke width against separation, which only the render answers. This is
      item 135's defect class with an actual instance in it.
    - **Geometry cannot fix it.** Separation and stroke both scale with the viewBox, so a taller
      chart changes neither ratio, and thinning the stroke to 1.5 user units buys 1.64px against
      1.55px. **Only the y-scale can**: a linear axis anchored at 0 with `max` = the right-hand
      spike (50) crushes the left three quarters into the bottom tenth, so the two options' real
      **21%** difference at the left edge (3.846 vs 4.643) is 1.59 of 100 plot units.
    - **`k` is not the lever either.** The crossing sits at `w = (50k - 15) / 15k` months before
      the sooner reward: raising `k` pushes both curves toward zero and worsens the separation;
      lowering it walks the crossing into the right edge, the legibility problem
      `moneyVisuals.js`'s own comment says `k = 1.0` was chosen to avoid.
    - **The option that works, with its cost stated because it is a real cost.** A **log y-scale**
      puts the left-edge separation at **7.35% of plot height (~7.6px)** and leaves the curves
      converging near the crossing, where they should — computed over the nine samples, the
      crossing stays between months 9 and 10, agreeing with the solved 9.667. **What it spends is
      the hockey stick**: the sharp late upturn of the $50 is the lesson's visual punch, and a log
      axis flattens it. That is a pedagogy trade, not a bug fix, which is why this is filed rather
      than shipped — and `flipDescription` ("turns sharply upward") would have to be rewritten in
      **five languages** to stay true, plus §50 (f)'s drawability clause re-derived on the new
      scale.
    - **Honest priority: medium, the highest in the figure family** — the first *live* instance
      `figureClaims` has found, shipping in five languages today, and the only one of that family
      a reader actually experiences. Downstream of O-1 like everything else.

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

132. **[Content — filed 2026-08-27 by the run that corrected item 131, as the gap that correction
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

133. **[Content/Translation — filed 2026-08-27 by the run that reviewed lessons 30 and 40, recorded
    rather than acted on, per item 129's "over-editing a language whose only check is this review is
    the larger risk".] `ko` uses `대출자` for *lender*, which reads at least as naturally as
    *borrower*.**
    - **Measured across the whole `ko` lesson corpus: `대출자` 13, `차입자` 4, `대출 기관` 8.** So the
      corpus already carries an unambiguous alternative (`대출 기관`) and uses it eight times, while
      `대출자` — literally "one who lends out", but in ordinary Korean financial usage frequently the
      person *taking* the loan — carries the same role thirteen times.
    - **Not changed, deliberately.** Inside lesson 30 the role is disambiguated by its own apposition
      ("은행, 신용협동조합, 또는 딜러") and by `차입자` being used for the borrower two paragraphs
      later, so nothing there misleads. This is a corpus-wide term-consistency question across 21
      instances, and rewriting it on one run's reading is the unmeasured multi-language drift items 69
      and 76 exist to prevent.
    - **The instrument this needs is item 76's** — a per-language tokenizer that can decide whether
      one term is a pattern or two instances. **Honest priority: low.** Downstream of O-1.

130. **[Process/Tooling — filed 2026-08-27 by the run that built §55, as its stated blind spot.]
    §55 cannot see comments, dev scripts, or Markdown — and that is 21 of the 36 spellings it was
    built in response to.**
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
    - **Do not build it until the hand-swept surface has drifted again.** One regrowth is what
      justified §55; a second, in comments specifically, is what would justify this. **One defect is
      not a class** (item 125 proved that, and item 126 is filed on the same reasoning).
    - **Honest priority: low.** Zero live instances as of this entry. Downstream of O-1.

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
    > is now the binding constraint: open items are 76,643 b, 47% of the backlog**, and **item 19
    > (23,478 b, HELD) plus item 26 (11,557 b) are 35 KB of it — the largest single lever left.**
    > Compressing a HELD item risks dropping scope the item still needs, so **that is an owner
    > decision, not a run's.** The closed-item tier below the top ten is now genuinely tight (81 items,
    > 68,475 b, ~845 b each); do not expect another pass to find much there.

121. **✅ DONE 2026-08-27 (scheduled dev-agent, recovering a stalled run). `AGENT_LOG.md`'s size is
    now a MEASUREMENT on every `npm test`, split into the two budgets W-5.3 conflated — and the
    script that does it was sitting uncommitted and unwired.** See the run log.
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
    - **A cheap improvement neither branch needs a decision for:** the label still reads "Practice
      all questions" while the session may now be 2 questions long. Appending ` (N)` costs **zero
      locale keys** (digits are language-independent) and explains the number the learner gets. Not
      done here because it was outside the fix and item 93/94 make five-language label churn a real
      cost; do it as a one-liner if it is ever picked.
    - **Honest priority: low.** The defect is fixed; these are the seams around it. **All of it is
      downstream of O-1** — nobody has opened the app, so no learner has met either branch.

116. **[A11y/Tooling — filed 2026-08-26 by the run that closed item 108, as its stated residual
    rather than smuggled into the same commit.] The focus-dependent probe class is still
    UNWRITTEN, and item 108 removed the last excuse for that being invisible.**
    - **State:** `focusVisibleOnTab` is a **stub** — `run()` returns `{findings: [], scanned: 0}` and
      always has. It is now correctly gated on a *measured* `focusSelectors` rather than a proxy, so
      it reports `UNAVAILABLE` honestly instead of `VACUOUS` misleadingly. **But honest silence is
      still silence**: nothing in this repo has ever checked focus-visible styling, focus order, or
      the first-run dialog's focus trap on a rendered tree.
    - **What blocks it is the harness, and that is now measured rather than assumed:** in this
      preview pane `:focus` matches nothing and focus events do not fire (2026-08-26, four isolation
      controls — see the run log). A probe written today would report `UNAVAILABLE` on every run.
    - **So the real question is not "write the probe" but "can any harness here focus a document?"**
      Cheap first step, and it is a *measurement*, not a build: find out whether any available
      browser surface reports `document.hasFocus() === true`. The sweep now prints `hasFocus()` and
      the measured capabilities side by side in `focusEvidence`, so **any future run that pastes it
      is already collecting the data** — a run that sees them disagree should say so, since that is
      the unreproduced 2026-08-25 divergence recurring.
    - **Honest priority: low-medium, and it is genuinely blocked, not deferred.** The focus trap
      (`§47`) and heading order already have *static* guards in `check-data.mjs`; this would be the
      rendered-tree half. Do not write the probe until a harness exists to run it — a probe that is
      structurally `UNAVAILABLE` is a fifth thing to maintain and a zero nobody can read.

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
  the working tree since 2026-08-11/12 and flagged by roughly a dozen scheduled runs as an unresolved
  in-progress feature not to touch — was finished, committed, and actually used (160/160 lesson/
  language pairs marked `method: "ai"`) in a 2026-08-13 interactive session; see P-4's update above and
  `DECISIONS.md`. Item 25's real chunk-split fix (see above) can now proceed without waiting on this.
- **`economic-cycles-v6.jsx` (repo root, untracked) is reference/inspiration material only — do not treat it as a build fixture or merge from it directly.** Added 2026-08-04, owner-clarified. It's a much larger, differently-designed prototype (neon dark-mode `DS` design-system object, extra tabs for Sectors/Industries/Finance, a "Be the Fed Chair" simulator, flashcards) that appeared in the working tree with no git history and no download metadata — its actual origin is unknown. It also reintroduces two things the real app deliberately removed: direct "Ray Dalio" branding/quotes (§10.2, closed) and a hardcoded current date (`nowDate: "April 2026"`, plus an odd `"April 2026 • Late Cycle / Iran War Week 5"` line) — the exact stale/dated-content problem §2.3 fixed. Its dark-mode and sector-performance ideas (the two features it was once a candidate reference for) have both since shipped independently, built without consulting it, so there's no longer a live pointer to a specific future use — but its Dalio references and dated content must still never carry over, and it should not be added to git as-is.
  **RESOLVED 2026-08-16 (owner decision).** Both prototypes are now **gitignored and left on disk, untouched** — ignored, not deleted. `economic-cycles-v5.jsx` was tracked until this date and is now untracked (`git rm --cached`; working copy byte-identical, and its content stays in git history). `economic-cycles-v6.jsx` was never tracked. Neither appears in `git status` any more, which ends the twelve days of every run writing a "not touched, and why" note about v6. **Before this, v6 was audited** (see the run log for this date): it is imported by no code, and every feature in it — its charts, `SectorTable`, `Flashcards`/spaced repetition, `MiniQuiz`, `LearningPath`, `Onboarding`, dark mode — has shipped independently in `src/`. The single exception, its "Be the Fed Chair" policy simulator, is preserved as **backlog item 34** (concept only, explicitly not its code). `HistoryTimeline` overlaps existing lesson content and was assessed as not worth keeping. **So neither file holds a unique live idea any more.** Consequence worth knowing: a fresh clone will not contain v5, so `check-blindspot.mjs`'s §10.2 scan now reports explicitly whether it scanned v5 or found it absent, rather than asserting it scanned it either way. **Do not restore either file to the repo without asking the owner.**
- **`main`'s reachable git history currently starts at commit `2dc0264` ("Split monolithic JSX step 4a").** Found 2026-08-04 while investigating unrelated work. Roughly a dozen earlier commits (initial scaffold, the original blindspot-register fixes, the Markets stale-date fix, `scripts/bootstrap-node.sh`'s addition, JSX-split steps 1–3, the language-Beta labeling, the data-shape harness) still exist as objects in the repo (`git cat-file -t <hash>` succeeds for e.g. `eda6dd0`, `ecdda70`, `5ab5c48`, `6feca25`, `76be081`, `053f8b2`) but aren't ancestors of the current `main` tip — something reset or rewrote history before this was noticed, likely an early run's plumbing-commit (`commit-tree`/`update-ref`, used because `git commit` hangs in this environment — see the memory note on this) picking up a stale parent hash instead of the true current `HEAD`. No content appears lost — the tree at `2dc0264` already contains everything those steps produced (locales, content modules, the bootstrap script) — but the historical commit-by-commit record for that early stretch is orphaned, not part of `main`. Not fixed; flagged for the owner to decide whether it's worth reattaching (the old commits are still around, not yet garbage-collected) or leaving as-is.

**Completed and pruned**

- **§3.0.3 coverage enforced in both directions, and item 57's own numbers corrected (former item
  57)** — done 2026-08-17 (dev-agent run), see run log. §17 already guarded that the links which
  *exist* are valid; new **§17b** guards the other direction, that every glossary-term use is either
  linked or listed in the new `deliberatelyUnlinked` table with a reason (`defined-here` /
  `other-sense: …`). 77 uses, 44 chips, 33 deliberate, **0 unexplained**. The item's own claim of "7
  lessons, 11 occurrences" was wrong: all 11 were exclusions `lessonTerms.js` documents by lesson id,
  and the single real gap (lesson 36 §1's "credit data") sat in a *curated* lesson the item's search
  space excluded. Verified with five injections including a deliberately broken matcher, plus live
  browser confirmation of the new chip. **Scope limit to carry forward: §17b sees only glossary keys —
  see item 60.**
- **The `minutes` reading model corrected to count the whole lesson (former item 56)** — done
  2026-08-17 (owner-directed pick), see run log and `DECISIONS.md` ("How a lesson's `minutes`
  estimate is computed"). The field was already derived and enforced; what was wrong was the
  formula, which omitted the title, subtitle, section headings and the entire end-of-lesson check
  (~20% of the words on screen). `check-data.mjs` §2 now counts all of it at 200 wpm, with a
  catalog-wide floor so a blind count cannot read as a pass, plus a new assertion of §3.0.5's
  "lesson 1 under four minutes". 23 of 40 estimates moved, all upward; the catalog total went
  **120 → 144 minutes**, so §4.3's content clause is further clear rather than reopened.
- **`LAUNCH_PLAN.md`'s catalog figures generated, and its Phase-0 gate verdict with them (former
  item 55)** — done 2026-08-17 (dev-agent run), see run log. `scripts/refresh-readiness.mjs` now owns
  **10 figures across two documents**: the two it already had in `LAUNCH_READINESS.md`, plus §1's
  asset sentence, §2.5's two track-id ranges, §3.2's progress figure, §4.0's volume/word-count/
  asset-table figures, and **§4.3's "is the gate met?" verdict**, which is derived from the catalog
  rather than from whoever last read the table. That last one is why the item was P1: the plan said
  "the gate is not close: 12 minutes is not 2 hours" while the generated scorecard said both content
  clauses were met. Three stale counts inside §4.0/§4.2's *arguments* were deleted rather than
  guarded; §4.1/§4.2's reasoning was left alone, as the item required.
- **Renumber lesson ids to match track order (former item 22)** — done 2026-08-14 (dev-agent run,
  owner-directed pick), see run log entry "Renumber lesson ids to match track order" and
  `DECISIONS.md`'s "Two lesson tracks" entry's 2026-08-14 update for full detail. Ids now match track
  display order: money is 1-28, economy is 29-40 (was money 13-40, economy 1-12) — a new learner's
  first lesson now displays as "Lesson 1," not "Lesson 13." Scripted (regex-based, verified id→id
  table), not hand-edited; covered every id-bearing surface (`lessons.js`, `quizData.js`, both
  `lessonContent.*.js` files, `LessonVisual.jsx`'s `LESSON_VISUALS` map, all in-prose "Lesson N"
  cross-references, `scripts/translation-review-ledger.json`) plus a new one-time client-side
  migration (`src/lib/lessonIdMigration.js`) for already-installed users' persisted
  `ecycles_completed_lessons`.
- **`lessonContent.js` split per track, the real fix (former item 25)** — done 2026-08-14 (dev-agent
  run), see run log and `DECISIONS.md` ("`LessonReader` chunk split per track"). Split the 531 kB
  `src/content/lessonContent.js` into `lessonContent.economy.js`/`lessonContent.money.js`;
  `LessonReader.jsx` now dynamically `import()`s only the track being read. `LessonReader-*.js` code
  chunk dropped from 557.70 kB to 5.92 kB; the two content chunks (69.83 kB / 482.39 kB) are both under
  Vite's default 500 kB warning threshold, which was restored (the 600 kB override this superseded is
  removed). This closes the actual "chunk is heavy" problem, not just the build-warning symptom the
  2026-08-12 mitigation (below) had quieted.
- **`LessonReader` 500 kB chunk-size warning (2026-08-09 backlog item 25) — mitigated 2026-08-12,
  superseded by the real fix above (2026-08-14).** `vite.config.js`'s `build.chunkSizeWarningLimit`
  raised to 600, later removed once the real split (above) made it unnecessary; see `DECISIONS.md`.
- **Machine-translation decision reversal, owner escalation (former item 20 / backlog P-4)** — resolved
  2026-08-11 (owner decision, interactive session): option (a), accept the current unreviewed
  es/ko/zh/ja translation state under "(Beta)" labeling. See `DECISIONS.md`
  ("Machine-translated lesson content...") for the full three-option writeup and the reasoning, and this
  run's log entry ("Translation review engine...") for what shipped alongside the decision —
  `scripts/translation-review.mjs` + a per-language review-status ledger with drift detection, so the
  0%-reviewed state is now tracked and visible (via `npm run review-status` and a non-blocking `npm test`
  summary line) instead of able to drift unnoticed the way it did between 2026-08-05 and 2026-08-09.
- **Main JS chunk back over the 500 kB warning threshold (former item 23)** — done 2026-08-07 (twelfth
  run, owner-directed), see run log ("Split lesson content out of the main bundle"). `content/lessons.js`
  split into lightweight metadata (kept at the same path) and a new `content/lessonContent.js` holding
  the heavy per-lesson body; `LessonReader` (which needs the body, plus `quizData.js`) is now lazy-loaded
  like `Practice`/`Reference` already were. Main chunk: 522.40 kB → 207.01 kB, no warning. See
  `scripts/check-data.mjs`'s new drift check, which keeps the two files from silently diverging.
- **Tighten the builder/critic feedback loop, first piece (former item 16)** — done 2026-08-05 (night),
  see run log ("Automate the blindspot-register regression checks"). New `scripts/check-blindspot.mjs`,
  wired into `npm test` and callable alone via `npm run check-blindspot`, codifies the grep commands
  every run's manual adversarial self-check (and `LAUNCH_READINESS.md`) had been retyping by hand:
  §10.2 Dalio references, §10.1 advice-adjacent language + disclaimer-key presence, §10.3 parent-facing
  kids framing signal, §2.3 live-looking dates in teaching copy. Not a full replacement for the
  judgment-based half of the self-check (framing calls, "does this read like advice" calls still need a
  human or an agent reading the diff) — see the run log for what's still manual.
- **Launch-readiness scorecard (former item 15)** — done 2026-08-05, see run log ("Launch-readiness
  scorecard"). New `LAUNCH_READINESS.md` at repo root tracks the plan's actual gates in one place:
  blindspot register (§10.1–10.7 + §2.1), the §4.3 Phase-0 monetization gate, and §9.2 instrumentation —
  each with the exact command that produced its status, not a narrative claim. Refresh instructions
  included so future runs (or the weekly reviewer) can update it in seconds.
- **FRED economic readings surfaced in Reference → Sector performance (former item 13)** — done
  2026-08-04, see run log ("Surface the FRED economic readings the daily job already fetches"). The
  daily job had fetched Fed funds rate, 2y/10y yields, the curve spread, CPI and unemployment since the
  sector-performance run earlier that day, but no screen displayed them — a dangling `economyNowTitle`
  translation key was the tell. Closed by adding a section to `Sectors.jsx`, each reading dated
  individually rather than sharing the payload's `asOf` (CPI/unemployment update monthly; the Treasury
  yields update daily).
- **Sector performance and relative strength (former item 14)** — done 2026-08-04, see run log
  ("Sector performance + relative strength: data pipeline and UI"). Daily job
  (`scripts/fetch-market-data.mjs`) writes `public/data/market.json`; `Sectors.jsx` ranks eleven S&P
  sectors against SPY with a placeholder relative-strength formula, plainly labeled as such. Now
  scheduled (`economics-app-market-data`, weekdays after close).
- **Mobile responsiveness check, second pass (P3 item 11 — now fully closed)** — done 2026-08-04,
  see run log. Swept 320px portrait (all four tabs plus quiz-answered, Kids age-selector, and the
  first-launch modal states), 320px combined with the max font-scale step from item 10 (130%, to
  check the two features don't compound badly), and 568×320 landscape (including the first-launch
  modal at a short viewport height, a common fixed-modal failure mode). No horizontal overflow or
  clipping found anywhere (`scrollWidth === innerWidth` at every check) — a clean result, not a
  skipped check; see the adversarial self-check in the run log for how that claim was verified.
- **`npm audit` vulnerabilities fixed (P3 item 8)** — done 2026-08-04, see run log. `vite` bumped
  `^5.4.11` → `^6.4.3` via `npm audit fix --force`, run in isolation with a full build/test/browser
  reverify before committing. `npm audit` now reports 0 vulnerabilities (previously 1 moderate,
  1 high, all dev-server-only). `@vitejs/plugin-react` and React versions untouched.
- **Mobile responsiveness check at 375px (P3 item 11, first pass)** — done 2026-08-04, see run log.
  Added a global `box-sizing: border-box` reset (`src/index.css`, imported from `src/main.jsx`) —
  the app had no global stylesheet before, so every `width: "100%"` element with its own padding
  (the first-launch modal's OK button, the Home CTA/skip buttons, quiz option buttons, chart SVGs)
  was sized in the default `content-box` model, meaning padding added to the box's width instead of
  being subtracted from it. Not visibly broken at the viewport widths spot-checked so far, but a
  real latent overflow risk this fix removes outright. Verified with a live 375×812 browser check
  (`document.documentElement.scrollWidth === window.innerWidth`, i.e. no horizontal scroll) across
  Home, Learn (tab list + Lesson 1), Markets, More/Quiz, and More/Glossary.
- **Dynamic font-size support (P3 item 10, last sub-part — the whole accessibility-pass item is
  now closed)** — done 2026-08-04, see run log. Every inline `fontSize` in the app (103 spots
  across `economic-cycles-v5.jsx` and all 5 `src/components/*.jsx` files) converted from a fixed
  px number to an equivalent `rem` string; a new 4-step "Aa" text-size control in More → About
  scales the root element's font-size (persisted to `localStorage` as `ecycles_font_scale`),
  which scales every `rem`-based size in the app proportionally.
- **`completedLessons` persistence (P2 item 6)** — done 2026-08-04, see run log. `App`'s core
  `completedLessons` state now lazy-loads from and writes to `localStorage`
  (`ecycles_completed_lessons`), following the same pattern as the streak counter and
  continue-tomorrow opt-in. `Home`, `Learn`, and the header progress bar needed no changes — they
  already just read the prop `App` passes down.
- **Phase-color contrast check (plan §3.5)** — done 2026-08-04, see run log. Measured WCAG contrast
  ratios for the app's green/amber/red/blue phase-indicator palette; green (`#059669`, ~3.8:1) and
  amber (`#d97706`, ~3.2:1) failed the 4.5:1 AA threshold for small text on white. Swapped those two
  to darker `-700` shades (`#047857`, `#b45309`) everywhere they're used as *text* color; left them
  unchanged as borders/backgrounds/graphical fills, which only need 3:1 and already clear it.
- **`DECISIONS.md` added** — done 2026-08-03, see run log. Three entries: Expo-vs-Vite (open,
  owner decision), `.js`-not-JSON content modules (closed), localStorage-only progress/personalization
  state (closed, with the `completedLessons` persistence gap cross-referenced from item 6).
- **Unused translation keys deleted** — done 2026-08-03, see run log. `indicators`, `bestInvest`,
  `avoidInvest`, `psychology`, `why`, `expansion`, `peak`, `contraction`, `trough`, `expDesc`,
  `peakDesc`, `contDesc`, `troughDesc` had zero `t.` call sites in `economic-cycles-v5.jsx` or any
  `src/components/*.jsx` file; removed from all 5 `src/locales/*.js` files rather than building the
  feature, since it would reopen the already-closed §10.1 investment-advice-adjacency question.
- **First-session flow, step 6e (continue-tomorrow prompt) — the entire 6a–6e first-session-flow item is now closed.** Done 2026-08-03, see run log. A one-tap, localStorage-only prompt (`ecycles_continue_pref`) shown at most once per day, the first time a lesson is marked complete that day; records the user's opt-in/opt-out locally for a future reminder feature, does not schedule real notifications.
- **First-session flow, step 6d (streak counter)** — done 2026-08-03, see run log. localStorage-backed daily streak (`ecycles_streak`), incremented once per calendar day a lesson is completed; shown as a 🔥 badge on Home when > 0.
- **First-session flow, step 6c (first-open routing)** — done 2026-08-03, see run log. New users with no saved progress now land in Learn/lesson 1 on first open instead of Home.
- **First-session flow, step 6b (lesson-completion celebration)** — done 2026-08-03, see run log. A toast animation on "Mark Complete" (Learn.jsx) and an animate-in effect on the Home progress ring.
- **`README.md` refreshed to match the current split structure** — done 2026-08-02, see run log. Replaced the stale "one 1,340-line file" description with the actual `src/locales/` / `src/content/` / `src/components/` layout, added a Testing section for `npm test`, and mentioned `scripts/bootstrap-node.sh`.
- **`scripts/check-data.mjs` `t.key` scan broadened to `src/components/*.jsx`** — done 2026-08-02, see run log. Was only reading `economic-cycles-v5.jsx`, silently covering less of the translation-key surface with each JSX-split extraction. Now reads the main file plus every component file; verified with an injected-then-reverted dangling-key test.
- **Stale/dated factual figures reworded** — done 2026-08-02, see run log. The `~$50T total credit vs ~$3T actual money` figures (lesson body, quiz `explain`, `Credit` glossary entry) were replaced with figure-free "many times larger than the base money supply" framing; the `2+ quarters of falling GDP = recession` line (lesson body, `GDP` and `Recession` glossary entries) is now framed as a rule of thumb with an NBER note; the yield-curve "has predicted EVERY US recession since 1955" claim (lesson subtitle+body, quiz `explain`) now acknowledges inversions have preceded every recession since 1955 but not every inversion is followed by one.
- **JSX split, step 4d (`More` tab → `src/components/More.jsx`) — the `App` split is now fully done.** Done 2026-08-02, see run log. Fourth and last of the four per-tab extractions. Unlike `Home`/`Markets`/`Learn`, `More`'s local state (`moreSection`, quiz `qIdx`/`qStarted`/`qAnswer`/`qScore`/`qDone`, `kidsAge`, `glossSearch`) moved *into* the component rather than staying lifted in `App`, since nothing outside `More` read any of it. `quizData`/`glossary`/`kidsContent` are now imported directly in `More.jsx` rather than passed as props, matching the precedent `Markets.jsx` set for `charts.jsx`. `economic-cycles-v5.jsx` down to 135 lines — now just tab-switching/header/first-launch-modal glue.
- **JSX split, step 4c (`Learn` tab → `src/components/Learn.jsx`)** — done 2026-08-02, see run log. Third of the four per-tab extractions; `economic-cycles-v5.jsx` down to 294 lines.
- **JSX split, step 4b (`Markets` tab → `src/components/Markets.jsx`, chart helpers → `src/components/charts.jsx`)** — done 2026-08-02, see run log. Second of the four per-tab extractions; `economic-cycles-v5.jsx` down to 380 lines.
- **Quiz answer key de-skewed** — done 2026-08-02 (by the weekly reviewer, at the owner's request, out of normal priority order). Correct-answer positions now spread `2,0,3,1,3,2,0,3,1,2,0,1,2` (counts by index `{0:3, 1:3, 2:4, 3:3}`, max share 31%) instead of 12 of 13 on index 0. `npm test` reports 0 warnings. **`src/content/quizData.js` now carries a header comment explaining the invariant — read it before adding or editing a question.**
- **JSX split, step 4a (`Home` tab → `src/components/Home.jsx`)** — done 2026-08-02, see run log. First of the four per-tab extractions; `economic-cycles-v5.jsx` down to 529 lines.
- **Data-shape check harness (`npm test`)** — added 2026-08-02, see run log below. Checks locale/content modules structurally in ~5s; no browser or 2-minute build needed to catch a missing language field.
- **JSX split, step 3 (`quizData`, `glossary`, `kidsContent` → `src/content/*.js`)** — done 2026-08-02, see run log. All content now lives in modules; `economic-cycles-v5.jsx` down to 591 lines.
- **Language picker "Beta" labeling (§3.5/§10.4)** — done 2026-08-02, see run log. The es/ko/zh/ja options in the language `<select>` now read e.g. "🇰🇷 한국어 (Beta)"; English is unchanged. Translation-volume ratios measured 2026-08-02 (**es 0.41x, ko 0.24x, ja 0.18x, zh 0.15x** of English lesson-body chars) are noted here for reference if a future run wants to re-measure after content is added.
- **JSX split, step 1 (`TR` → `src/locales/*.js`)** and **step 2 (`lessons` → `src/content/lessons.js`)** — done 2026-08-02, see run log. Independently verified by the second weekly review: 12 lessons intact, 0 missing language fields, exact locale key parity, `economic-cycles-v5.jsx` down from 1,340 to 692 lines.
- **Reproducible build environment** — `scripts/bootstrap-node.sh` added 2026-08-02, see run log below.
- Blindspot register §10.2 (Dalio de-branding) and §10.3 (parent-facing Kids framing) — done 2026-08-01, verified by the weekly review.
- Markets tab stale date (§2.3) — done 2026-08-02.
- **§10.1 (investment-advice adjacency) — fully closed 2026-08-02.** All three gaps the weekly review flagged are resolved: (1) the "be bullish when cutting / be cautious when hiking" directive sentence and, more significantly, a previously-unnoticed set of rendered "Best investments: growth stocks / value stocks / ..." per-phase lines in lesson 10 (all 5 languages) were reworded to historical/descriptive framing ("historically favored in this phase..."); (2) the `disclaimer` key now also renders on the Learn tab (below "Think About This") and in a new About sub-section, so it appears on Home, Learn, Markets, and About; (3) a one-time first-launch modal (localStorage-backed, key `ecycles_seen_disclaimer`) shows the disclaimer before first use, and a permanent About sub-section was added to the More tab for ongoing access. See the run-log entry below for details.

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

> **Entries before 2026-08-26 live in [`AGENT_LOG.archive.md`](AGENT_LOG.archive.md)** — moved
> there in four passes (2026-08-01→08-08 and 2026-08-09→08-15 on 2026-08-16/17; 2026-08-16→08-22 on
> 2026-08-23; 2026-08-23→08-25 on 2026-08-26), verbatim and complete. Between them they cover every
> run before today: the initial scaffold and rebuild, the JSX split, the market-data pipeline,
> lessons 18–44, the per-track content split and the lesson-id renumbering, the routing/deep-link
> work, the claims register, the five-language economy translation of item 93, the landmark/heading
> accessibility arc (items 102–110), and the a11y state matrix and its language and font-scale axes
> (items 111–112). **You do not need to read any of it to pick up work** —
> `reviews/2026-08-16-weekly-review.md` and `reviews/2026-08-23-weekly-review.md` are both shorter
> and better organized than the entries they summarize.
>
> **This pass did NOT land on a review boundary, and that is a finding rather than a slip — read
> W-5.3 in the backlog before archiving again.** The rule's action clause ("entries dated before the
> most recent weekly-review boundary") was a **no-op for the second time**: the most recent boundary
> is 2026-08-23 and everything before it was already archived, so following the rule literally would
> have moved nothing while the file sat at **915 KB**, 1.5x its own trigger. The boundary used here
> is therefore the byte target, taken on whole days. **The deeper reason is in W-5.3's note:** the
> run log is no longer what makes this file big.
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

### 2026-08-27 (owner-directed: "do item 134 next") — the join I called load-bearing was the false-positive source, and "zero live instances" was wrong by 33 (item 134)

**Picked item 134**, filed by the previous run, on the owner's explicit pick. Tree clean apart from the
owner's untracked `UIUX/` and `drafts/`; `owner-tree --expect c2331799…` **UNMOVED** before any edit.

#### Step 3.5 — the premise broke twice, and both breaks were mine from one run earlier

- **Break 1 — the scope. "Zero live instances as of this entry" was wrong by 33.** The item's numbers
  came from `lessonContent` alone. Re-measured over the twelve content and locale modules `§55`
  walks, in all five languages: **`zh` carried 8 corner-bracket spans and 25 ASCII-single-quote spans
  — 33 spans in 15 strings across 5 modules** (`lessonContent` essentials/money/economy, `quizText`,
  `kidsContent`, `markets`, `moneyVisuals`), against its own **152** full-width quotations. `en`,
  `es`, `ko`, `ja`: **0**. **The hand review that found 2 instances missed 33 of the same family,
  because it was only looking where it was reading** — which is the argument for the instrument,
  made by the instrument.
  **This is item 128's finding recurring in my own text**: item 91 claimed a "whole-repo scan" its
  instrument never had; item 134 claimed a corpus its measurement never covered. **A scope stated in
  prose is not a scope the measurement had.**
- **Break 2 — the design, and this is the one that mattered.** Item 134 specified classifying each
  quoted span as lesson-title-or-not by joining against `lessons.js`, and called that join **"the
  load-bearing part"**. It is the main **false-positive** source. Several lesson-title heads are
  ordinary common nouns: `locales.ja.heroInsight` writes **「取引」** quoting the concept — the English
  at that spot is a plain *"transactions"*, no lesson reference — and the join flags it as a
  mis-bracketed title. Lesson 44's own title, `The Part the Word “Passive” Leaves Out`, would have
  been flagged for containing quotes at all. **Two pieces of correct copy, and the check as specified
  would have failed the build on both.**
- **What replaced it.** §56 reads **repertoire, not role**: which quotation marks each language may
  use at all. Decidable from the character, no sentence understanding, no false-positive class.
- **The sets are measured, not imposed** — each is what that language's own corpus already uses
  consistently: `en`/`es` ASCII + curly (curly reserved for item 84's title references, 64/57);
  `ko` ASCII (48) + 「」 for titles (59); `zh` “ ” (152) + 《》 (64); `ja` 「」 (191) + 『』 (66).
  **`zh` was the only language contradicting itself.**

#### What shipped

**`check-data.mjs` §56**, plus the 33 repairs it demands — the guard and the sweep in one commit,
because a guard that ships red is not a guard.

- **The header states the cost rather than hiding it: §56 does NOT catch the `ja` title drift** that
  item 134 was half-filed for. Distinguishing a title reference from an ordinary quotation needs
  context; that stays with human review. It catches the `zh` drift and the 33 others.
- **`ja` 『』 is deliberately NOT constrained to titles**, with the reason inline: `ja` uses it for
  **seven** coined labels and slogans (`『今回は違う』` lessons 33/36, `『美しい/醜いデレバレッジング』`
  lesson 34). A checker that flagged those would be turned off within a week. (Seven, not the six the
  item said — the seventh is in `moneyVisuals`, the same scope error as the headline.)
- **The 33 repairs are provably glyph-only.** A differ that strips exactly the quote characters and
  compares the rest reports **0 lines differing beyond quote glyphs** across 21 changed lines, with
  both controls firing (a genuine text change is still detected; a quote-only change compares equal).
  Character counts are unchanged — every substitution is one code point for one — so
  `LAUNCH_READINESS.md`'s volume sentence correctly did not move.
- **The replacement was targeted, not file-wide, and that mattered:** `kidsContent.js` holds all five
  languages on one line and carries **19** corner brackets of which only 4 are `zh` — a blanket
  replace would have corrupted the Japanese.

#### Verification — four injections, each proving it landed, each restored from a scratchpad copy

§56 passed on first run, which proves nothing about a check its author just wrote. Each injection was
confirmed present in the file **before** running the check, and restored from a pre-injection copy in
the scratchpad (never `git checkout --`):

| injection | landed | §56 verdict |
|---|---|---|
| `zh` `“财富效应”` → ASCII (yesterday's real defect) | ✓ | FAIL, names `lessonContent.37.sections[2].body.zh` |
| `ja` `『金利』` → `“金利”` | ✓ | FAIL, names `lessonContent.30.sections[0].body.ja` |
| `zh` `“再投资”` → `「再投资」` | ✓ | FAIL, names `lessonContent.3.sections[2].body.zh` |
| `en` glossary → `「money supply」` | ✓ | FAIL, names `glossary.M2.en.f` |

After every restore, **§56 failures back to 0**.

- **§56's own three controls**, all mandatory and all firing: **A** every language's corpus reaches
  rendered copy (≥800 strings *and* that language's own `heroInsight` opening present — a per-language
  known sentence, so a collapsed walk cannot look clean); **B** a planted out-of-repertoire mark is
  flagged in all 5 languages; **C** each language's sanctioned set is silent on correct copy,
  including the two that look wrong to a neighbor — `ja` 『』 around a coined label and `zh` 《》
  around a work name that is not a lesson.
- **`npm test` 0 failures, 2 warnings** (the documented baselines); **`npm run build` clean**;
  `check-blindspot` **7/7**; `check-backlog` 111 items, 140 citations resolve.
- **Live browser verification (W-1).** Fresh `dist/` over `/usr/bin/python3 -m http.server`,
  `preview_start` with a plain `url`, **bundle read back (`index-BviiblXe.js`) and matched to the
  build just run**, `?cb=` against the stale-`index.html` trap. `zh` lesson 18 — six repaired spans —
  renders under `lang="zh-Hans"` with **0 ASCII quotes, 0 corner brackets, 16 full-width quotes**:
  `“现在的2,000美元”`, `“以后”`, `“现在”`. Two-sided — the wrong marks are gone *and* the right ones
  are present where they belong.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` **7/7**. The content diff is 21 lines of
  quote glyphs, proven above to contain no other change, so no §10.1/§10.2/§10.3 surface can have
  moved; no date, no market figure.
- **`DECISIONS.md` conflict** — none. §56 adds no dependency, reads the same `.js` content modules
  §55 does, and stores nothing.
- **Already-done backlog item** — no, but the sharper form fired hard: **this run refuted the item it
  was implementing, in two places, and both errors were written by me one run earlier.** The item's
  own numbers and its named "load-bearing part" were both wrong. Recorded in item 134 rather than
  quietly built around, because the next run reading that item would otherwise inherit the design.
- **Own verification claim** — reproducible end to end: the repertoire scan, the four injections with
  landing proof and restore, the glyph-only differ with both controls, §56's three internal controls,
  and the live render. **The one thing I am NOT claiming**: that §56 makes quotation typography a
  solved property. It makes *repertoire* a property. Role — is this quoted phrase a lesson title? —
  remains unchecked and uncheckable without context, and §56's header says so where a future run
  will read it.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — unchanged; this run touched only tracked files). **Open and unblocked:**
**item 27** (an eighth lesson figure, its bar unchanged and still no named candidate); **items 131+132
together** (the last 8 review pairs, only worth doing as one decision); **item 130** (§55's comment
blind spot — note its "wait until it drifts again" bar is exactly the reasoning §56 just satisfied for
the quotation case, so it is closer than it looks). **O-1 remains the entire critical path.**

### 2026-08-27 (owner-directed: "do lessons 33, 37, 39 next") — the 26,568 characters nobody had read, and my own headline figure was bytes wearing a character's label (item 131)

**Picked item 131's open half** on the owner's explicit pick. Working tree clean apart from the
owner's untracked `UIUX/` and `drafts/`; `owner-tree --expect c2331799…` **UNMOVED** before any edit.

#### Step 3.5 — the premise held, gained commit-level proof, and then broke on a figure that was mine

- **The claim, upgraded from inference to evidence.** Last run I *inferred* these translations were
  never reviewed, from volume growth plus item 93's timeline. This run the instrument names the
  commits: each of the 12 pairs was rewritten **exactly once**, by a **single identified item-93
  commit** dated 2026-08-22→08-24 — `b202aeb`/`71e4c37`/`440f211` (es), `85c4f2a`/`3d7d900`/`b93b97b`
  (ko), `33fc23b`/`1eeaba7`/`ab0bb83` (zh), `ecd3b54`/`712f3f7`/`9de64f9` (ja) — every one of them
  **after** the 2026-08-14/15 reviews, and none touched since.
- **Its control is the commit subjects, and it is two-sided.** Each subject names the exact lessons
  *and language* it moved ("Translate ko economy 39-40"), and the instrument reports that pair moving
  at that commit **and no other language moving there**. Independent evidence agreeing in both
  directions.
- ⛔ **THE PREMISE THAT BROKE WAS MY OWN, AND IT WAS IN THE FIGURE I PUBLISHED YESTERDAY.** Item 131
  said *"~55,000 characters"* and *"~40,000-character never-reviewed block"*, and *2.5x–4.5x*. Those
  were **byte counts labeled as characters.** `wc -m` counts **bytes** when no UTF-8 locale is set —
  verified directly: three Han characters report **9** under the session's empty `LANG`, **3** under
  `LC_ALL=en_US.UTF-8`. That inflates `ko`/`zh`/`ja` about threefold and leaves `es` near-correct.
  **The ratios survived** (both sides were measured the same way); the absolute numbers did not.
  Re-measured over Unicode code points: the five economy lessons went **10,855 → 39,627** characters
  (**2.8x–4.7x**), and lessons 33/37/39 are **26,568**, not ~40,000. Item 131 is corrected; yesterday's
  entry stays verbatim as a dated record, per §31.
  **The transferable rule: on a CJK corpus, count code points. `wc -m` is not a character count unless
  the locale says so, and it fails by inflating — the direction that makes a claim sound bigger.**

#### The review: 12 pairs, all read in full

**All twelve are complete and faithful** — every section, takeaway and thinkAbout present, no §10.1
drift, no Dalio attribution introduced into lesson 33 (the most Dalio-adjacent content in the app).

- **The live risk in this block was numbers, and they are right.** Lesson 37 is almost entirely large
  dollar figures across two number scales. Every one converts correctly: `es` splits *billones* (10¹²)
  from *mil millones* (10⁹) throughout — $1.75 billones, $600 mil millones, $9 billones — which is
  what `71e4c37`'s own subject claimed to fix and it did; `ko` 조/억 ($1.75조, $6000억, 월 $950억);
  `zh` 万亿/亿; `ja` 兆/億 (1兆7500億ドル). **Checked digit by digit rather than trusted.**
- **Domain terms land as terms of art in all four**: deleveraging → *desapalancamiento* / 디레버리징 /
  去杠杆 / デレバレッジング; wealth effect → *efecto riqueza* / 부의 효과 / 财富效应 / 資産効果 (the
  standard Japanese term, not a calque); credit spread → 신용 스프레드 / 信用利差 / クレジットスプレッド.
- **The §10.1-sensitive sentences survive translation**, including lesson 33's refusal to time the
  cycle — `es` *"nadie puede anticipar el momento"*, `ko` *"그 시점을 맞힐 수 있는 사람은 없습니다"*,
  `zh` *"没有人能算准时点"*, `ja` *"時期を当てられる人はいません"*.

#### ⛔ The defect: 120 full-width quotes and two ASCII ones

Classifying every quoted span by role across the corpus: **`zh` uses full-width “ ” for inline terms
**120 times** and ASCII `"` exactly **twice** — lesson 37's `"财富效应"` and lesson 3's `"再投资"`.
Confirmed at the code-point level with a control: the two outliers are **U+0022**, a known-good
instance in lesson 33 is **U+201C/U+201D**. ASCII quotes are halfwidth glyphs in a fullwidth context;
they are a typographic error in Chinese, not a preference.

**Both were fixed, not just the in-scope one.** The measurement was corpus-wide, so repairing only the
half that fell inside the owner's three lessons would have been arbitrary; lesson 3's English is
untouched, so nothing goes stale. `zh` is now **122/122 full-width, 0 ASCII**. The guard this has no
instrument for is filed as **item 134**.

#### A finding that refuted my own fix from the previous run

Yesterday I fixed `ja` lesson 30's `「金利」` → `『金利』` and wrote that `『』` marks a work title while
`「」` is the primary quotation mark. **Reading lesson 33 turned up `『今回は違う』` — a slogan, not a
title — and the tally says that is not an outlier:** `ja` uses `『』` for **six** non-title spans
(`今回は違う` in lessons 33 and 36, `美しい/醜いデレバレッジング` and `美しい`/`醜い` in lesson 34).
That is a coherent Japanese convention for coined labels and quoted sayings. **Left unchanged**, and
yesterday's framing narrowed accordingly: the rule that actually holds is the converse — a lesson
title must never appear in `「」` (0 instances now), not that `『』` always means a title. Item 134
carries the correction so a future checker is not written to the wrong rule.

#### Two observations recorded and deliberately NOT changed

- **`ko`/`zh`/`ja` all soften "a multi-generational high" to "several decades"** (수십 년 / 几十年 /
  数十年); `es` renders it exactly (*"un máximo de varias generaciones"*). It sits inside lesson 39's
  hypothetical THINKABOUT ("Imagine an economy where…"), so it carries no claim about the world and
  no figure moves. Three languages agreeing is a translation-register pattern, not drift.
- **`ko` `대출자` for *lender*** recurs in lessons 33 and 39 exactly as **item 133** describes. This
  run adds instances, not information; left for item 76's instrument.

#### Verification

- **Coverage 89% → 95% in all four languages, 5 stale → 2.** The 2 remaining are lessons 1 and 4 —
  item 132's, and the only thing left in item 131.
- **Ledger diff is exactly the 12 intended pairs**, verified key-by-key against a pre-run copy;
  **176 pairs before and after**.
- **`npm test` 0 failures, 2 warnings** (the two documented baselines); **`npm run build` clean**;
  `check-blindspot` **7/7 ok**.
- **`LAUNCH_READINESS.md` §10.4 moved to a value the build computed**, and failed the build until it
  did. The character-volume sentence did **not** move, correctly: U+0022 → U+201C is one code point
  for one code point.
- **Live browser verification (W-1).** Fresh `dist/` over `/usr/bin/python3 -m http.server`,
  `preview_start` with a plain `url`, **bundle name read back and matched to the build just run** per
  the Environment note's rule 4, `?cb=` to defeat the stale-`index.html` trap. `zh` lesson 37 renders
  the fixed `“财富效应”` with **0 ASCII quotes present**.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` **7/7**. Over the content diff:
  Dalio / `principles of` / advice-adjacent verbs **0**; **control**: the same pipeline returns **2**
  for `效应` on the same diff, so it reaches the changed text. Lesson 33 is the Dalio-adjacent lesson
  and was read in all five languages specifically for attribution creep — none. No date, no market
  figure touched.
- **`DECISIONS.md` conflict** — none. All marks are `method: "ai"`, which is P-4 option (a).
- **Already-done backlog item** — no, and the sharper version of this check fired: **this run
  contradicted its own predecessor's generalization** about `ja` bracket semantics, and the fix from
  that run still stands while the *reason* given for it was too broad. Narrowed in item 134 rather
  than left to be inherited.
- **Own verification claim** — reproducible: the commit-level attribution and its two-sided control,
  the code-point recount and the `wc -m` demonstration, the ledger key-diff, the 122/122 quote tally,
  the live render. **The judgment half must not be overstated.** Per `translation-review.mjs`'s
  reviewer-of-record note this is Claude reading same-family LLM output — real content review, **not**
  a native-speaker pass, and the correlated-blind-spot caveat applies in full. The honest claim: **12
  pairs were read by a careful non-native reader who found one real error and verified every numeric
  conversion**, not that they are natively verified. **Human review share remains 0% in all four
  languages** — **O-3**, and it is the owner's.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — unchanged; this run touched only tracked files). **Open and unblocked:**
**item 134** (the quotation-convention guard, now the strongest tooling candidate — it has regrown
twice in two runs, which is exactly the bar item 130 sets); **item 27** (an eighth lesson figure, its
bar unchanged); **items 131+132 together** (the last 8 pairs, only worth doing as one decision).
**O-1 remains the entire critical path.** **O-3 now has its real number**: ~29,000 characters of
machine translation entered the main path after its last review, and as of this run **all of it has
been read once, by an LLM** — which is the fact the owner's decision should rest on.

### 2026-08-27 (scheduled dev-agent) — a hash over the source language cannot see drift in the target, and the Japanese corpus contradicted itself once in seventy-six places (item 131)

**Picked item 131**, the residual the item-129 run filed: the 7 remaining stale lesson/language pairs
(lessons 1, 4, 30, 33, 37, 39, 40 x es/ko/zh/ja = 28 pairs). Working tree was clean apart from the
owner's untracked `UIUX/` and `drafts/`, which were not touched;
`npm run owner-tree -- --expect c2331799…` reported **UNMOVED** before any edit.

#### Step 3.5 — the premise re-measured, and it changed the item's disposition rather than a figure

The item's own instruction was to establish what changed in these seven *before* treating them as
item 129's shape. Doing that broke the item's framing in two directions at once.

- **The instrument, with a two-sided control.** `englishSourceHash` recomputed over `src/content` at
  each of the 80 commits touching it since 2026-08-13 (`git archive` per commit, read-only). **Control
  at HEAD: 0 of the 7 stale lessons' stored hashes match now (expect 0), and 37 of 37 non-stale ones
  do (expect all)** — the instrument reproduces the live report exactly in both directions.
- **The ledger's `reviewedDate` is not the reviewed state.** All seven lessons last matched at **one**
  commit, `e43dded` (2026-08-20) — the English had not moved since the 2026-08-14/15 reviews. Exactly
  two commits then moved it: **`7046854`** (item 84, "name the lesson, don't number it") on all seven,
  and **`ef0665a`** (item 114, monetary base) on lesson 30 alone. Word-level diff, with its own
  controls (self-compare 0 hunks; a planted `RULE 1`→`RULE ONE` reported 1): **six cross-reference
  renames plus one semantic edit.** Nearly the item-129 shape the item said it was not.
- ⛔ **And then the correction that actually matters: the English was the wrong thing to size this by.**
  Staleness is computed from an English hash, so it truthfully said "the English moved a little".
  Measured on the **translations** instead, lessons 30/33/37/39/40 grew **2.5x–4.5x in every language**
  since that same state (lesson 30 `es` 1,082→3,556 chars; lesson 39 `ja` 1,092→4,767). Those five are
  `economy`, and **item 93's economy tranche landed after 2026-08-20** — so the 2026-08-14 review saw
  the *abridged* translation and what stands today is ~**55,000 characters of never-reviewed machine
  translation**. The flag said "re-review"; the work is a **first** review, and the item's "one
  language per run" was sized against four orthographic hunks.
- **Lessons 1 and 4 are the opposite case and are not this item's.** Their translations are
  **byte-identical** to the reviewed state in all four languages; the English *gained* a
  cross-reference sentence that has no counterpart in any translation, because both are `essentials`
  and abridged (0.50x / 0.68x against `es`'s 1.18 reference). **Confirmed pre-existing**, not a
  regression from `7046854`, by dumping both trees. Filed as **item 132**.
- **A refuted worry, recorded because it looked like a real one.** The 2026-08-14 renumbering
  (`e15e63d`) landed inside the review window and the ledger is keyed by lesson id — but that commit
  **remapped the ledger in the same commit** (480 lines changed there), so the ids are sound.

#### The scope this run took, and why it is 8 pairs rather than 28

Reviewing 28 pairs would have meant vouching for ~55,000 characters at skim depth. **Reviewed and
marked: lessons 30 and 40 x es/ko/zh/ja (8 pairs)**, each read in full in all five languages — lesson
30 because it carries the only semantic edit, lesson 40 because it carries five of the six renamed
references. Lessons 33/37/39 (12 pairs) are left open in item 131 as what they actually are.

#### ⛔ The defect: 75 of 76 Japanese title references use `『』`, and one used `「」`

Measured across all 44 lessons by joining every lesson title against every language's prose and
tallying the bracket pair around each hit: **`ko` 「」x76, `zh` 《》x76, `ja` 『』x75 + 「」x1.** The
single outlier is lesson 30's reference to lesson 35, and **the corpus contradicted itself** the same
way item 129's `要す` did — 75 of its own instances name the convention.

**It is not only typography, and that is why it was worth fixing.** In Japanese `「」` is the primary
quotation mark and `『』` marks a work title. Inside `ja` lesson 30 `「」` appears **exactly twice** —
once as the title reference `「金利」` and once as an ordinary scare-quote `「お金」` ("money") — so the
same brackets were doing two different jobs one paragraph apart. Fixed to `『金利』`; re-measured
**`ja` 『』x76, 「」x0**.

#### What the reading found, and what it deliberately left

- **Item 114's `monetary base (M0)` edit propagated correctly to all four**: `es` *la base monetaria
  (M0)*, `ko` *본원통화(M0)*, `zh` *基础货币（M0）*, `ja` *マネタリーベース（M0）*. All four are the
  standard term; `ko`'s `본원통화` is the right one over `기초통화`.
- **All six renamed cross-references name the right lesson in each language's own title**, verified
  programmatically (20/20 across the five `economy` lessons) and then read in context. Lesson 40's
  five references — 生産性成長 / 長期債務サイクル / 短期債務サイクル / 取引 / 信用 and their `es`,
  `ko`, `zh` equivalents — are all correct and consistently bracketed.
- **Lessons 30 and 40 are complete in all four languages**: every section heading, body, takeaway and
  thinkAbout present, no §10.1 drift, no advice-adjacent phrasing added to lesson 40's three rules.
- **One observation recorded and NOT changed** (item 129's precedent — over-editing a language whose
  only check is this review is the larger risk): `ko` uses **`대출자` for *lender*** 13 times, where
  the corpus also carries the unambiguous `대출 기관` 8 times and `대출자` reads at least as naturally
  as *borrower*. Inside lesson 30 nothing misleads — the role is fixed by its own apposition and by
  `차입자` appearing for the borrower two paragraphs later. Filed as **item 133** for item 76's
  instrument to settle, not for a run's reading to.

#### Verification

- **Coverage 84% → 89% in all four languages, 7 stale → 5.**
- **The ledger diff is exactly the 8 intended pairs and nothing else**, verified key-by-key against a
  pre-run copy: 8 changed (30/40 x es/ko/zh/ja), **176 pairs before and after**.
- **`npm test` 0 failures, 2 warnings** (the two documented baselines), **`npm run build` clean**,
  `check-blindspot` **7/7 ok**.
- **`LAUNCH_READINESS.md` §10.4 moved to a value the build computed**, and it failed the build until it
  did — `refresh-readiness.mjs --write` reported "nothing to write" because §10.4's coverage sentence
  is `check-data.mjs` §11's, not the readiness script's (W-5.6 recorded exactly this split).
- **`§16`'s tripwire prints `en=0` for numeric cross-references. That is correct, not the blind spot
  its own header warns about** — §16b passes ("references are by title"), and `en=0` was already true
  at HEAD, checked by re-running the script against a clean `git archive HEAD` tree.
- **Live browser verification (W-1).** Fresh `dist/` over `/usr/bin/python3 -m http.server`,
  `preview_start` with a plain `url` (`navOk: true`), **bundle read back (`index-DxNVvetx.js`) and
  matched against the build just run**, per the Environment note's rule 4. With `ecycles_lang` seeded
  to `ja` and lesson 30 unlocked, the rendered lesson contains **exactly two corner-bracket spans —
  `『金利』` and `「お金」`** — which is the two-sided proof: the target changed and the adjacent
  scare-quote did not.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` **7/7 ok**. Over the content diff:
  Dalio / advice-adjacent verbs **0**. **Control**: the same grep pipeline returns **2** for `金利` on
  the same diff, so it reaches the changed text. The only rendered change in the app is one bracket
  pair; no date and no market figure is touched.
- **`DECISIONS.md` conflict** — none. Every mark is `method: "ai"`, which is P-4 option (a) working as
  designed rather than a departure from it, and the reviewer string follows the existing convention.
- **Already-done backlog item** — no. Item 131 was filed by the previous run for exactly this scope;
  the lessons are disjoint from item 129's (5, 27, 28, 42-44). **The stronger check is the opposite
  one:** this run's finding is that item 131 as written would have led a future run to *under-budget*
  the remaining 12 pairs, so the item was rewritten rather than merely ticked.
- **Own verification claim** — the reproducible half is fully reproducible: the hash walk and both its
  controls, the ledger key-diff, the 76/76 bracket tally, and the live render. **The half that is
  judgment must not be overstated.** Per `scripts/translation-review.mjs`'s reviewer-of-record note
  this is Claude reading same-family LLM output — real content review, **not** a native-speaker pass,
  and the correlated-blind-spot caveat applies in full. The honest claim is that **8 pairs were read
  by a careful non-native reader who found one real error**, not that they are natively verified.
  **Human review share remains 0% in all four languages** — that is **O-3**, and it is the owner's.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean — unchanged, as expected: this run touched only tracked files). **Open and unblocked:** **item 131's
remaining 12 pairs** (lessons 33, 37, 39 — now correctly scoped as one *lesson* per run, and correctly
described as a first review of ~40,000 never-reviewed characters); **item 132** (the two cross-track
pointers that exist only in English, low, and item 94's to price); **item 133** (`ko` `대출자`, low);
**item 27** (an eighth lesson figure, and its bar still binds). **O-1 remains the entire critical
path**, and **O-3** — now with a measured number attached to it, ~55,000 characters of machine
translation that entered the main path after its last review and that this run reviewed one fifth of —
is the owner decision this run's own caveat points back at.

### 2026-08-26 (scheduled dev-agent) — the English string a recipe can still smuggle in, caught at commit time instead of at sweep time (item 113)

**Picked item 113**, the residual the 2026-08-25 item-112 run filed and could not do: `check-data.mjs`
was mid-refactor by another session for that entire run. It is free as of `1416559`, and the working
tree was clean this run apart from the owner's untracked `UIUX/` and `drafts/`, which were not touched.

#### Step 3.5 — the premise re-measured, and it moved the fix in three places

The item's headline claim about the code was **correct**: a whole-file scan of `scripts/a11y-states.js`
found **0 hardcoded-text selectors** across the 19-state matrix. Recipes select by id, position, ARIA,
numerals, and labels read from the app at runtime, exactly as item 112 left them. What was wrong was
the *shape of the check the item specified*:

1. **One exemption was already stale.** The item says `clickIfPresent` "is only ever used for the
   first-run dialog and is being replaced by `dismissDialog`". That replacement has **already fully
   happened** — `grep` finds the definition and **zero call sites**. It is unreferenced machinery, so
   it needed no exemption and got none.
2. **The other exemption was in the wrong place, and that is the load-bearing correction.** The two
   `__selftest_*` states are **not inside `var STATES = [`** — they are built inline inside
   `selftest()`, ~280 lines further down. A check scoped as the item wrote it ("inside the `STATES`
   array and the axis helpers") would have seen **neither of the two call sites it was told to
   exempt**, and would have reported a clean file while being structurally unable to see the only
   text-matching code in it. The scan is therefore whole-file — **and the exemption becomes the
   control.** Those two are the only text-matching call sites the file is permitted to contain, so
   "exactly 2 exempt hits" is the assertion that proves the scan reaches live code.
3. **A third detector the item did not name.** It listed `click` / `clickExact` / `hasHeading` — the
   shapes item 112 actually shipped. But an `arrived.is` can compare `mainText()` / `innerText` /
   `textContent` against a literal without touching a named helper, and that is the same defect with
   no helper to grep for. §49 detects it too.

The axis helpers were checked separately and are clean by construction: `setLang` selects
`"header select"` (structural), `setFontScale` builds `[aria-label="130%"]` from an interpolated
numeral — and its own comment records that its first version matched the English word "About" and
broke the moment the language axis it exists to serve was switched on.

#### What shipped

**`scripts/check-data.mjs` §49** (109 lines, the only file this run touched). Three detectors over the
comment-stripped source; a hit fails unless it is (a) owned by a `__selftest_*` state or (b) a numeric
literal, since `clickExact: "130%"` is a legitimate language-independent selector. Failure messages
name the offending state and say what to use instead.

**Deliberately not banned:** `name`, `note` and `says` are English prose in every state and must stay
that way — they are what a human reads in a run log, and none is fed to a selector. So §49 could not
be "no English in the matrix"; it is pointed at the call sites where a string becomes a *selector*.

#### Verification — three injections and four controls, each proving its own landing

Both files were copied to the scratchpad first and restored from those copies, never with
`git checkout --`. Every patch asserts its anchor exists and re-reads the file to prove the edit
landed; **one of them did not** — control D's first attempt lost its backslashes to shell escaping, the
anchor assertion threw, and the check printed **PASS** immediately afterwards. That PASS was
meaningless and the anchor guard is the only reason it was not read as one. Re-run from a file, it
failed correctly.

| # | Injection | Result |
|---|---|---|
| 1 | `{ click: "Glossary" }` into the real `reference` state | **FAIL** — names `"Glossary"` in state `"reference"` |
| 2 | `hasHeading("Market Dashboard")` into `reference-markets`' `arrived.is` | **FAIL** — names the state |
| 3 | `mainText().indexOf("Start Quiz")` as `practice-landing`'s assertion | **FAIL** — names the state |
| A | `clickExact: "130%"` (a *legitimate* numeric selector) | **PASS** — no false positive |
| B | `sweepLangs` renamed away | **FAIL** — the language axis is gone, so the section guards nothing |
| C | one `__selftest_*` call site removed | **FAIL** — "found 1 exempt hit, expected 2" |
| D | detector 3's regex broken inside `check-data.mjs` | **FAIL** — "1 of 3 detectors did not match their own sample" |

`npm test` **0 failures, 2 warnings** (the documented translation baseline), `npm run build` clean.
Both files restored bit-for-bit — `shasum` re-checked after every injection.

**No live-browser verification, and this is not the W-1 exemption being claimed loosely:** this run
changes no rendered UI and no `src/` file at all. `scripts/` is not bundled.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. Across 109 added lines: Dalio/`principles of` **0**,
  advice-adjacent verbs **0**, dates **0**. **Control**: `selector|language|recipe` returns **19**, so
  the grep reaches the added text. Two `kids?|child` hits, both inspected and neither is §10.3
  framing: one is the string `"Kids"` quoted as an example of an **old English selector** item 112
  deleted, the other is my own grep matching "kid" inside the identifier `clickId`.
- **`DECISIONS.md` conflict** — none. No `src/` change, no dependency, config, storage or content-format
  change; §49 reads source text and asserts, exactly as §44–§48 do.
- **Already-done backlog item** — no. `git log --all -S'§49' -- scripts/check-data.mjs` → **0**.
  **Control**: `-S'sweepLangs'` → **1**, item 112's commit, so the pickaxe reaches this shape.
- **Own verification claim** — the claim easiest to fake is "the guard works", since a guard that
  matches nothing prints the same green line as a guard that matches nothing *wrong*. Three things
  make it checkable by re-running only what is above: each detector must fire on a sample carried in
  the source, so a broken regex fails loudly rather than passing (control D proves the mechanism);
  the two `__selftest_*` hits are a live control on the scan reaching the file (control C); and each
  of the three injections names the specific state it found, which a regex matching by accident
  would not.

#### Next

- **`AGENT_LOG.md` is 894 KB, well past W-5.3's 600 KB trigger** — and W-5.3 says that archive pass is
  "a legitimate whole run". It is the largest cost every run pays, since every run reads this file.
- **Item 114** (small): reword the credit lesson's "base money supply" to "monetary base" in five
  languages so the §3.0.3 glossary chip becomes legitimate.
- **Item 108** (focus capability vs. the sweep header) — `focusVisibleOnTab` is `UNAVAILABLE` on 13 of
  13 states, so it has never once run.
- **Item 26 / item 27** both still need a re-scope before picking; **W-5.2's pick list** remains.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). The state matrix can now be trusted not to quietly become monolingual
again — on an app that no one has ever opened, in any of the five languages.

### 2026-08-26 (owner-directed) — the archive pass W-5.3 asks for, and the measurement that says it is the last one that can work

**Owner request: "archive the run log entries past the 600 KB trigger."** Done — but the interesting
result is not the cut, it is why the cut could not follow the rule.

#### The rule was a no-op, for the second time

W-5.3's trigger is a whole-file byte count (600 KB) and its action clause is a date ("entries dated
before the most recent weekly-review boundary", as reworded by the 2026-08-23 pass after the original
"older than seven days" turned out to be a no-op on the day it fired). Applied today, the most recent
boundary is **2026-08-23** and everything before it was already archived, so the rule as written moves
**zero bytes** while the file sits at **915,262 bytes — 1.5x its own trigger.** Same failure, one
rewording later: **the trigger is byte-based and the action clause is date-based, and nothing makes
them agree.**

#### The measurement, taken before touching anything

| Section | Bytes | Share |
|---|---:|---:|
| Prioritized backlog | 458,014 | **50.0%** |
| Run log (39 entries) | 430,101 | 47.0% |
| Environment note | 20,865 | 2.3% |
| App summary | 5,097 | 0.6% |

**W-3 wrote the archiving rule on 2026-08-16 when the run log was ~93% of the file.** It is now the
smaller half. Archiving *every* entry — very nearly what this pass did — leaves a **~485 KB floor,
81% of the trigger consumed before a single new entry is written.** Keeping the current review period
live, which is what the rule intends, was **arithmetically impossible**: 08-25's twelve entries alone
are 140,499 bytes and would have landed the file at 633 KB. So the cut is at the byte target on
whole-day boundaries. Filed as **item 115** (owner decision: compress the backlog, or re-point the
trigger at a run-log byte count) and written into **W-5.3** as a second premise correction.

#### What moved

**38 entries — all of 08-23, 08-24 and 08-25 — verbatim into `AGENT_LOG.archive.md`** under a new
`## Archived 2026-08-23 → 2026-08-25` heading, whose preamble states plainly that this range is *not*
a review boundary and why. Only the 08-26 entry stays live. The Run log pointer in `AGENT_LOG.md` was
rewritten to name four passes instead of three and to carry the same warning.

**`AGENT_LOG.md` 915,262 → 493,243 bytes, a 46% cut**, back under the trigger. The archive grew
1,653,181 → 2,077,529.

#### Verification — and the two assertions that fired

Integrity proved the way the 08-23 pass proved it, on a corpus extracted by a fence-aware script that
takes every line belonging to a dated entry across **both** files:

- **259 dated entries before, 259 after. 24,809 entry lines before, 24,809 after.**
- **Sorted line-by-line hash identical: `af1d371bfee47ff2253628b217ba139d235d2815`** before and after.
- **The control fired first**: perturbing one word inside one entry in a scratch copy moved the hash
  to `5d7cac63…`, so "identical" is a result the instrument was shown able to *not* return.
- `npm test` **0 failures, 2 warnings** (the documented translation baseline). This matters more than
  usual here: `check-data.mjs` §35 asserts run-log heading depth across **both** files with floors of
  100 entries and 100 children, and `check-measurements.mjs` reads both files precisely so an archive
  pass cannot strand a claim — both still pass. `check-backlog.mjs` reports **92 items** (item 115 is
  the new one) and all 128 citations resolving.

**Two assertions in my own move script stopped it before it wrote anything**, which is the only reason
this entry is not reporting a smaller cut than it made: the block was **38 entries, not the 32 I had
counted by eye** off a heading listing, and the pointer-blockquote rewrite silently failed because the
old pointer's closing sentence is **line-wrapped**, so the contiguous substring I searched for did not
exist and the slice would have re-inserted the old text. Both threw `MOVE DID NOT LAND` rather than
producing a plausible-looking file.

#### Step 5 — adversarial self-check

- **Blindspot register** — not applicable by construction and checked anyway: no `src/` file, no
  content, no rendered UI touched. The moved text is unaltered — proven by the hash above, which is a
  stronger statement than a grep would be.
- **`DECISIONS.md` conflict** — none. No architectural surface involved.
- **Already-done backlog item** — this *is* a recurrence of W-5.3's own work, deliberately and at the
  owner's direction, and the entry says so. What is new is item 115, which is the finding that the
  recurrence cannot keep working.
- **Own verification claim** — the claim easiest to fake is "moved verbatim", since a truncated move
  and a clean move both produce a file that looks fine. The hash is computed over the union of both
  files, so content lost from one and not gained by the other changes it; the entry and line counts
  are reported for both; and the control proves the comparison is not vacuous.
- **`§31` respected**: not one archived entry's text was edited. The only edits to existing text are
  the Run log pointer and W-5.3's note — both live navigation/rule text, neither a dated record.

#### Next

- **Item 115** is now the top process item, and it is an **owner decision**, not a pick.
- **Item 114** (small): "base money supply" → "monetary base" in five languages.
- **Item 108**: `focusVisibleOnTab` is `UNAVAILABLE` on 13 of 13 states, so it has never run.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-26 (scheduled dev-agent) — the focus capability was a proxy, and a proxy fails green (item 108)

**Picked item 108**, filed 2026-08-25 by the item-107 run as its stated residual. Working tree was clean
apart from the owner's untracked `UIUX/` and `drafts/`, neither touched. `OWNER-TREE
c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2 (0 tracked modified, 52 untracked)` at
open; `8fb27692…` at commit, the delta being only this run's two files. HEAD `d5fac15` throughout.

#### Step 3.5 — the premise re-measured, and it added a third signal the item did not know about

Built `dist/`, served it on `:8837`, `preview_start` with a plain URL, `mobile` preset before measuring
(the `Viewport: 0x0` rule). **The item's reasoning was exact and its conclusion was incomplete.**

- **Confirmed by reading the code path:** `VACUOUS` from `focusVisibleOnTab` is reachable *only* when
  `caps.focusEvents` is true — the probe is a stub returning `scanned: 0`, so if it runs at all it is
  vacuous. The item's inference from the 08-25 sweep output holds.
- **Could NOT reproduce the 08-25 session.** `document.hasFocus()` read **false** on every attempt this
  run, including after `tabs_select` fronted the tab and after an explicit `window.focus()`.
  `visibilityState` stayed `"hidden"`. So the divergence the item wants explained did not recur, and
  **this run cannot say which way it breaks.** That is recorded as a limit, not papered over.
- **The native-listener control ran anyway, and it is three signals, not two.** With a real button and a
  real listener: native focus events **0**, `activeElement` **correct**, and — new — the focused element
  **does not match `:focus`** and `querySelectorAll(":focus-visible")` returns **0**. The header's note 2
  named only the first two. **This changed the implementation**: a probe called `focusVisibleOnTab` reads
  the *selector*, so gating it on *events* is gating it on the wrong one of two independently-failing
  signals. It now declares `needs: "focusSelectors"`.
- **Four isolation controls, because "returns 0" needs an alternative explanation ruled out:** `click`
  events deliver (1), a **synthetic** `FocusEvent` reaches the same listener (1), the selector engine
  handles pseudo-classes (`button:enabled` = **19**, `:disabled` = 0), and `:focus-visible` does not
  throw. Events are not broken, focus listeners are not broken, the selector engine is not broken. One
  mechanism explains all three observations: the document has no focused area, so per spec no focus event
  fires and nothing matches `:focus`, while `activeElement` still names the element that *would* be focused.
- **A control fired for its own reasons and was caught by expecting a zero.** The first attempt measured
  the native count and the synthetic control on the *same* button, so the synthetic dispatch incremented
  the native counter to 1 — a fabricated "events work". `measureFocus()` therefore uses **two plants**,
  and the comment says why.

#### What shipped

`scripts/a11y-sweep.js` — **`measureFocus()`**, which plants a button and a listener and reads the answer
instead of inferring it. `focusEvents` is now "a real `.focus()` actually delivered an event"; **new
`focusSelectors`** is "the focused element actually matches `:focus`". `hasFocus()` is retained as
**recorded evidence**, not as a gate, so a future session where the two disagree prints the divergence in
the sweep's own output rather than requiring another run to notice it. The detector carries its own
control — a synthetic dispatch at the second plant — because a detector answering `false` because it is
broken is indistinguishable from one answering `false` about a blind harness, and it fails in the
direction that silently disables probes forever. Header note 2 and the item-105 premise correction are
rewritten to match. `check-data.mjs` §43 gains **(d)**, which fails if either capability is ever assigned
from `hasFocus()`/`visibilityState` again, plus two needles.

**The general rule this is an instance of, and the reason the change is worth more than the probe it
fixes: a proxy signal fails green, a planted control fails loud.**

#### Verification

- `npm test` — **0 failures, 2 warnings** (the standing translation-coverage and completeness warnings).
  §43 reports 10 probes declared, 9 layout-gated, all with planted controls.
- **§43(d) proved able to fail, both modes**, each restored from a scratchpad copy (never
  `git checkout --`) with the sha256 verified identical afterwards (`c9ca89aa…` before and after):
  re-injecting `focusEvents: document.hasFocus()` fails §43(d) by name; renaming `measureFocus` fails the
  needle. The injection was confirmed present in the file before each run.
- **Live, in the built app at `#/learn`:** `A11ySweep.selftest()` → **PASS, 9/9 controls fired,
  `plantsRemoved: true`** — which independently proves `measureFocus()`'s plant does not leak, since the
  cleanup assertion scans for exactly its `data-a11y-selftest` marker. `A11ySweep.run()` → `0 finding(s);
  2 vacuous; 1 unavailable`, with `focusVisibleOnTab` now **UNAVAILABLE** and carrying
  `focusEvidence: "nativeFocusEvents=0 matches(:focus)=false activeElementCorrect=true
  syntheticControl=fired hasFocus()=false visibilityState=hidden"`.
- **The instrument caught this run's own contamination**, which is the best evidence it works: the first
  `run()` reported one finding, `smallTargets: 52x22 < 44x44: button#zz-focus-btn`, which was the ad-hoc
  plant from the step-3.5 measurement — still present because the earlier `navigate` was a **hash-only**
  change and therefore never reloaded the DOM. Removed it; the finding went to 0.
- **Discrimination test, because "always false" and "correctly false" look identical.** Ran
  `measureFocus()`'s exact core under a temporarily patched `HTMLElement.prototype.focus` that dispatches
  a real `FocusEvent` — i.e. a harness where focus works. It returned **`focusEvents: true`**, and
  returned to `false` once the patch was reverted. The new signal is not a dead one.

#### Step 5 — adversarial self-check

- **Blindspot register** — no `src/` file, no content module, no rendered UI touched; this is one browser
  script and one check script. No Dalio reference, no advice-adjacent language, no kids framing. The dates
  added are dates *of measurements inside comments*, not a hardcoded current date on a user-facing
  surface, which is what the Markets-tab fix closed.
- **`DECISIONS.md` conflict** — none; no architectural surface (not state, not content format, not build).
- **Already-done backlog item** — item 108 is open and unclaimed. This modifies the instrument items 105
  and 107 shipped without undoing either: 105's per-capability gating design is *kept* and made stricter,
  and 107's `unnamedRegions` probe still fires its control (verified above, not assumed).
- **Own verification claim** — the one a reviewer could not reproduce is the live block, because its
  values depend on the harness's focus state. Stated plainly: **on a session where `hasFocus()` is true
  the capability values may differ, and that is the point of the change.** What *is* reproducible from the
  commands above is `npm test`, both injection failures, and the discrimination test.
- **The honest gap** — the 08-25 divergence was not reproduced and its direction is still unknown. The fix
  does not depend on knowing: direct measurement is correct under either answer, and the sweep now reports
  both signals so the next occurrence documents itself.

#### Next

- **Item 115** remains the top process item and is an **owner decision**, not a pick.
- **Item 114** (small): "base money supply" → "monetary base" in five languages.
- **Item 116** (new, filed by this run): the focus-dependent probe class is still unwritten.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-26 (scheduled dev-agent) — the chip the prose could not legitimize, and the wording that would have failed the build (item 114)

**Picked item 114**, filed 2026-08-25 as the M0-glossary run's stated residual, and taken partly for
variety: items 104-113 were all tooling/a11y, and this is the first content pick in ten runs. Working
tree clean apart from the owner's untracked `UIUX/` and `drafts/`, neither touched (`0 tracked
modified, 2 untracked`, porcelain sha256 `ff722a3d…`). HEAD `089183f` at open and at commit.

#### Step 3.5 — the premise re-measured, and it broke in three places

The item's *goal* was right and its *prescription* was not. All three corrections are in the backlog
item; the one that changed the implementation:

- **§17 does not accept "monetary base".** It accepts the glossary key `"M0"` or its `en.s`
  `"Monetary Base (M0)"`, anchored with lookarounds. A five-case probe — two positive controls
  (exact `en.s`, bare key), one negative control (unrelated prose), and the item's wording — returned
  `true/true/false/false`, so the instrument discriminates and the item's wording fails. **Shipped
  prose is "monetary base (M0)"**, which the probe's fifth case confirmed matches.
- **7 prose edits, not the 15 the item implies.** The quiz `explain` and `Credit.f` carry the clause
  in English only; es/ko/zh/ja are abridged and never had it.
- **`ko` and `zh` were already using the standard term** (본원통화, 基础货币) and needed only the
  `(M0)` tag; `es` and `ja` carried non-standard renderings. The item's "buys one chip" framing
  undersold it — it also fixed two real terminology defects.
- **A fourth site the item does not name:** `markets.js`'s money-supply comment asserts in the present
  tense that the app says "the base money supply" in three places. This item falsifies that sentence.

#### What shipped

Lesson 30 §1 ("Credit vs Money") now reads **"monetary base (M0)"** / **"base monetaria (M0)"** /
**"본원통화(M0)"** / **"基础货币（M0）"** / **"マネタリーベース（M0）"**, matching each language's own
`M0` glossary entry; the English quiz `explain` and `Credit.f` follow. `lessonTerms.js` gains
`30: { …, 1: ["M0"] }` — legitimate under curation rule 2 (lesson 30's subject is *Credit*, which stays
deliberately unchipped as `defined-here`; M0 is a different term) and rule 3 (M0 is linked nowhere else
in lesson 30). The `markets.js` comment gets a **dated note appended rather than a rewrite**, because
the paragraph is the record of why that block exists and rewriting a dated rationale falsifies it — the
note is what makes it read correctly today.

**§2.3 held, and it is the reason the phrase existed at all:** the 2026-08-02 run put "base money
supply" there specifically to *replace* dated `~$50T vs ~$3T` figures. A phrase was swapped for a
phrase. `(M0)` is a name, not a figure, and §2.3's check passed across all 26 teaching-copy modules.

#### Verification

- `npm test` — **0 failures, 2 warnings** (the standing translation-coverage and completeness ones).
  §17b now reports **90 chips on 30 lessons, 0 unexplained** (was 89).
- `npm run build` — clean, `✓ built in 1.28s`.
- **§17 proved able to fail on exactly this chip.** Item 114's literal wording ("monetary base", no
  parenthetical) was injected into the shipped file, the injection confirmed present, and `npm test`
  failed with `lessonTerms[30][1]: "M0" is linked from a section whose English text never mentions it`.
  Restored from a scratchpad copy (never `git checkout --`); sha256 `a0130eda…` identical before and
  after.
- `npm run readiness -- --write` — the char-count guard caught the **+1 English character** and was
  refreshed rather than edited by hand (§4.3 and §10.4 rows).
- **Live, in the built app** (`dist/` served on `:8841`; bundle hash `index-DSu4W8bW` confirmed to
  match the build just made, per Environment note 4): at `#/lesson/30` the prose reads
  "…larger than the monetary base (M0) —", the old phrase is **absent** (control), and a
  **`Monetary Base (M0)` chip renders**. Clicking it expands the M0 definition in place
  ("cash in circulation plus the reserves…"), with a control confirming a *different* entry's
  definition is not what appeared. Switched to `ja` through the app's own picker: chip renders as
  **マネタリーベース（M0）** from `glossary.js`, prose shows the new term, **基礎マネーサプライ is
  gone** — which is the language-independent-key decision in `DECISIONS.md` working end to end.
- **One limit, stated rather than papered over:** screenshots came back blank/misplaced — Environment
  note 1's "layout is not live" limitation, not a page defect. The DOM reads above are the instrument
  that works here, and they are what the claims rest on.
- **A self-inflicted false negative, recorded because it cost a cycle:** writing `ecycles_lang` as
  `'"ja"'` (JSON) left the app in English and the first `ja` read returned all-false. The stored format
  is the raw string `ja`. Driving the app's own picker instead of writing the key is what fixed it —
  and is the more honest test anyway.

#### Step 5 — adversarial self-check

- **Blindspot register** — §10.2 (no Dalio), §10.1 (advice-adjacency across all five languages and the
  disclaimer's 8 surfaces), §10.3 (kids framing untouched) and §2.3 (no live-looking date or figure)
  all pass their checks on the modified tree. The one date added, `2026-08-26`, is inside a **source
  comment**, not user-facing copy — the distinction the Markets-tab fix drew.
- **`DECISIONS.md` conflict** — none, and this is an *instance* of a recorded decision rather than a
  brush with one: "In-lesson glossary links are a curated map, not an automatic prose match" specifies
  a hand-curated `{lessonId: {sectionIndex: [keys]}}` map with language-independent keys rendering from
  `glossary.js`. That is exactly what shipped, and the `ja` chip proved the language-independence live.
- **Already-done backlog item** — item 114 was open and unclaimed. It builds on the 2026-08-25 M0 work
  rather than redoing it, and does not undo the 2026-08-02 de-dating that put the phrase there.
- **Own verification claim** — `npm test`, `npm run build`, the injection failure and the restore hash
  are all reproducible from the commands above. The live block depends on a served `dist/` and is
  reproducible by the documented technique; the screenshots are not, and are reported as failed.

#### Next

- **Item 115** remains the top process item and is an **owner decision**, not a pick.
- **Item 116** (focus-dependent probes) is genuinely blocked on a harness that can focus a document —
  its own text says do not write the probe until one exists.
- **Item 101 / items 70/71/76** are the unclaimed non-tooling candidates.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Nothing in this run moved either, and nothing in this repo can.

### 2026-08-26 (scheduled dev-agent) — the button that walked around the unlock model, and the recipe that was resting on it

**Picked as a W-5.2 non-item-93 run.** The last entry's `Next` listed item 101 (blocked on O-1),
items 70/71/76 (low, and 71's own gate has never fired) and item 115 (an owner decision) — so this
run took W-2's standing alternative, a **product-level QA pass on the core loop**, and found a real
defect in it. Owner tree at open: `OWNER-TREE c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2 (0 tracked modified, 52 untracked)`; `HEAD` = `ef0665a`, unmoved at commit time.

#### The defect, measured before it was described

`Practice.jsx`'s **"Practice all questions"** started a session over `quizMeta` *entire*. Measured
live from cleared `localStorage` on a build whose bundle hash was confirmed to match the build just
made (Environment note 4):

- The Learn path renders **41 of 44 lessons `disabled: true`** with "Complete previous lessons
  first" — only the three track-openers are open. **That is the control**, taken in the same
  session and the same storage state as everything below.
- The Review landing nonetheless offered an enabled button that started **`1 / 46`**, stepping
  "Lesson 1", "Lesson 2", "Lesson 3" straight down a path 41 of whose rows are locked.
- Answering wrote `ecycles_review = {"0":{"box":1,"due":"2026-08-27",...}}` while
  `ecycles_completed_lessons` stayed `[]` — so material the learner has never read **comes back in
  the review queue the next day**.

**The app contradicted itself on one screen.** Eight lines below that button, its own Steps rail
reads *"Questions you have never seen stay out of review."* `review.js`'s `dueQuestions` enforces
exactly that and says why in a comment. This button was the only thing in the app doing the
opposite — and it is the same thing `DECISIONS.md`'s closed deep-link decision forbids the URL
resolver from doing: *"A permissive resolver would void [sequential unlocking] from outside the app,
with no decision recorded anywhere, and nothing in the repo would notice."* It was being voided from
**inside** the app instead. `CLAIMS.md` **A1** is the bet that surface was undercutting.

#### Step 3.5 — the premise re-measured, and it changed the fix twice

There was no backlog item to re-measure, so the discipline applied to my own reading of the code:

1. **"Restrict it to completed lessons" would have been wrong, and measurement is what showed it.**
   `LessonReader` calls `recordReview` as each check question is answered, while `completeLesson`
   fires only on the completion control — so a learner can genuinely have *seen* a question in a
   lesson they never marked done. Proven live: answering lesson 1's check left
   `review = {"14":{...}}` with `completed = []`. The predicate is therefore
   **completed-lesson OR already-in-review**, and the second clause is not redundant.
2. **The a11y state matrix was resting on this button being unconditional, and its comment said so
   in as many words.** `a11y-states.js`'s `lastButton` step carried *"Practice.jsx renders it
   unconditionally"*, and `practice-all-questions` was `[{ hash: "#/practice" }, { lastButton }]`
   with **no `clear`/`seed`** — so in `runAll()` (one page session, no reload, nothing else answers
   anything) the recipe would now find **0 buttons in `<main>`** and throw. Caught before shipping,
   not after.
3. **A prior entry's two clauses had quietly grown incompatible.** The 2026-08-04 rebuild entry
   (archive) wrote both *"Never-answered questions are deliberately excluded from the due queue"*
   and *"Nothing-due is an invitation, not a locked door: 'practice all' stays available"* in one
   bullet. Both were true of a **13-question** app. At **46 questions across three independently
   unlocking tracks** the second clause had eaten the first. This run is not undoing that work — it
   is resolving a tension the catalog grew into.

#### What shipped

- **`src/screens/Practice.jsx`** — a `practicePool` memo (completed-lesson **or** already-in-review),
  used by the button instead of `quizMeta`; the button renders only when that pool is non-empty.
- **`src/App.jsx`** — passes `completedLessons` to `Practice`, which it never received before.
- **`scripts/a11y-states.js`** — the false `lastButton` comment corrected, and
  `practice-all-questions` rewritten to **earn** its entrance:
  `[{ hash: "#/lesson/1" }, { radio: 4 }, { hash: "#/practice" }, { lastButton: true }]`. Lesson 1
  is first of its track so it is always unlocked; `radio: 4` is the check question's first option.
  This also makes the state **deterministic for the first time** — it carried no `clear`/`seed`, so
  it used to sweep whatever storage the page happened to load with.

No new locale key, no new storage key, no new dependency.

#### Verification

- `npm run build` — clean, `✓ built in 1.39s`. `npm test` — **0 failures, 2 warnings** (the standing
  translation-coverage and completeness ones), §48 still `19 state(s)`, §49 still `0 hardcoded-text
  selectors`.
- **Live, two-sided, on the served `dist/`** (`:8847`, bundle `index-4U3Hea9n.js` confirmed to match
  the build just made):
  - **Fresh user** (`localStorage.clear()`, `#/practice`): **0 buttons in `<main>`**. The 46-question
    door is gone.
  - **Control — the same scan must be able to SEE the button**, or that zero means nothing. Opened
    `#/lesson/1`, answered its check, returned to `#/practice`: the scan found
    `["Practice all questions"]`, and clicking it started **`1 / 1`** on the lesson just read.
  - **Both clauses of the predicate proven separately.** With `completed = [29]` seeded and question
    14 in review from a lesson never marked complete, the session was **`1 / 2`** — one question from
    each clause, which is the arithmetic the predicate predicts and neither clause alone produces.
- **`A11yStates.runAll()` — 13 reached, 13 clean, 0 findings, 0 MISSED**, including
  `practice-all-questions` under the new recipe **from cleared storage**.
- **`A11yStates.selftest()` — PASS**, run this session, so that `missed: 0` is a meaningful zero and
  not a blind instrument. (Its `axisAssertion` correctly *refused* while the first-run dialog was up:
  the header is inert behind the modal, so there is no language `<select>` to confirm a switch
  against. The control working, not a failure.)
- **`A11yStates.sweepLangs()` — all 5 languages × 13 states, 0 missed, 0 findings**, `htmlLang`
  stamped `en/es/ko/zh-Hans/ja`. The new recipe selects by route and position only, so it survives
  the language axis item 112 exists to cover.
- **The old recipe proven to FAIL on the new build**, rather than assumed to: from cleared storage at
  `#/practice`, `document.querySelectorAll('main button').length === 0`, which is exactly the
  condition `lastButton` throws on. Two-sided, so the recipe change is justified by measurement.
- **Restore path**: originals copied to the session scratchpad before editing; never `git checkout --`.

#### Step 5 — adversarial self-check

- **Blindspot register** — §10.2 (no Dalio), §10.1 (advice-adjacency in five languages **and** the
  disclaimer's 8 surfaces — `Practice`'s `<Disclaimer>` is untouched and still renders), §10.3 (kids
  framing untouched) and §2.3 (no live-looking date or figure) all pass on the modified tree. The one
  date added, `2026-08-26`, is in **source comments**, not user-facing copy — the distinction the
  Markets-tab fix drew.
- **`DECISIONS.md` conflict — none, and this is the opposite of a conflict.** The closed deep-link
  decision says a URL must not unlock a lesson because sequential unlocking is a recorded bet that
  "nothing in the repo would notice" being voided. This change brings a **second** surface into line
  with that decision rather than making a new one. localStorage-only state, `.js`-not-JSON content
  and Vite-not-Expo are all untouched.
- **The honest boundary, stated rather than buried:** two judgment calls here are mine — *hidden* vs.
  disabled when the pool is empty, and *reached* meaning completed-or-answered rather than unlocked.
  Both are cheaply reversible and both are filed as **item 117** so the owner can overrule either
  without re-deriving the reasoning.
- **Already-done backlog item** — no. Grepped both log files: every prior mention of "Practice all
  questions" is either an a11y *recipe* using it as a cheap entrance or the 2026-08-04 bullet
  analyzed in step 3.5 above. Nothing had scoped this button before.
- **Own verification claim** — reproducible: `npm run build`, `npm test`, then serve `dist/` and
  re-run `runAll()` / `selftest()` / `sweepLangs()` by the Environment note's documented technique.
  **One cost this run added and should not hide:** item 111's text calls the "Practice all questions"
  entrance "the cheapest of all" because it needed no setup. It now needs two setup steps. That is a
  real, small increase in the recipe's cost, paid for determinism it did not previously have.
- **One limit, stated rather than papered over:** screenshots come back blank here (Environment
  note 1 — layout is not live), so every claim above rests on DOM and `localStorage` reads, which are
  the instruments that do work in this harness.

#### Next

- **Item 117** (this run's residual) is the cheapest real pick, and part of it is an owner preference
  rather than work.
- **Item 115** remains the top process item and is an **owner decision**, not a pick.
- **Item 116** is genuinely blocked on a harness that can focus a document; its own text says do not
  write the probe until one exists.
- **Items 70/71/76 and 101** are the remaining unclaimed candidates; 101 is blocked on O-1.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Nothing in this run moved either, and nothing in this repo can.

### 2026-08-26 (scheduled dev-agent) — the Review tab congratulated a learner who had done nothing, and every previous check of that card had seeded storage first (item 117a)

**Picked from item 117**, filed by the previous run as the residual of scoping "Practice all questions".
The item asks the owner to decide between *hidden* and *disabled* for the empty Review landing. **Both
branches were wrong about what is on that screen**, and re-measuring is what showed it — so this run
fixed the defect neither branch had noticed instead of implementing either. Owner tree at open:
`OWNER-TREE c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2 (0 tracked modified, 52
untracked)` — **UNMOVED** from the fingerprint the last entry recorded. `HEAD` = `34c4abe`, unmoved at
commit time.

#### Step 3.5 — the premise re-measured, with a control, and it changed the disposition

Item 117(a)'s argument-against reads: *"an empty screen teaches nothing about what the button would
have done."* Measured live from `localStorage.clear()` on a build whose bundle hash was confirmed to
match the build just made (Environment note), `#/practice`, first-run dialog dismissed:

```
completed = "[]" , review = null , buttons in <main> = []
"Review / You're all caught up / A quick question before you move on."
  + the three-step How-review-works rail + the disclaimer
```

**The screen is not empty — it is false.** A learner who has never opened a lesson is shown a **green
check icon** and **"You're all caught up"**: a congratulation, under an icon that means *done*, for
work never done. Beneath it sits **`t.checkIntro`** — *"A quick question before you move on."* — whose
**only other call site is `LessonReader.jsx:431`**, where it introduces the end-of-lesson check. On
this screen there is no question and nothing to move on from. So item 117(a) is asking whether to
restore a button to a screen whose real defect is that its one card states two untrue things.

**The control, and it fired twice over.** A scan that reads a string cannot prove that string is
*conditional*, so the same scan was run in the `seen > 0` state in the same session — open `#/lesson/1`
(first of its track, always unlocked), answer its check, return to `#/practice`:

- The **body changed** to `reviewEmptyBody` ("Questions come back here a day or two after you answer
  them…"). So the instrument does read this card and does see it vary — the earlier reading of
  `checkIntro` was a measurement, not a blind zero.
- The **title did not change.** "You're all caught up" is byte-identical in both states.

That second half is the finding. `seen` **already discriminated the two states** — the ternary on line
424 branched the *body* on it — so the card was half-conditional, and **the half that never branched
was the false half.** The icon never branched either.

**Why this survived four weeks and a live QA pass.** Grepping both log files for prior work on this
card returns one hit: `AGENT_LOG.archive.md:1921`, a run that seeded
`{"5":{"box":1,"due":"2026-08-05",...}}` and recorded *"Review correctly showed 'all caught up'"*. That
is correct — **in the state it seeded.** Every previous live check of this card wrote a review entry
first, which is precisely the state where the copy is true. **The defect hid behind the fixture**, and
the only way to meet it is to look at cleared storage, which is what item 117(a) made this run do.

#### What shipped

- **`src/screens/Practice.jsx`** — the nothing-due card branches **title, body and icon** on `seen`,
  not just the body. `seen > 0` is unchanged in every respect (check icon, `ink.ok`, "You're all caught
  up", `reviewEmptyBody`) — *caught up* is a real achievement and still earns the check. `seen === 0`
  gets the new copy, a **`book`** icon and `ink.muted`.
- **`src/locales/{en,es,ko,zh,ja}.js`** — two new keys, `reviewNotStartedTitle` /
  `reviewNotStartedBody`. en: *"Nothing to review yet"* / *"Finish a lesson and its check question
  starts showing up here."*
- **`src/screens/Practice.jsx` file header** — found by the self-check, not by the item. Its opening
  comment still promised *"the full question set is still available"* when nothing is due. **The
  previous run made that false** and documented the change only at `practicePool`, 140 lines below;
  the header is what a reader meets first. Corrected to "everything the learner has REACHED", with the
  date and the reason.

`t.checkIntro` keeps its one legitimate call site in `LessonReader`. No new storage key, no new
dependency, no change to any behavior — this run changes what the screen *says*, not what it does.

#### Verification

- `npm run build` clean (`✓ built in 1.47s`); **`npm test` — 0 failures across all six suites**, 2
  warnings, both the standing ones (translation review coverage; 48 abridged pairs / item 93) and
  neither touched by this change. `npm run check-payload` — 0 failures.
- **Live on the served `dist/`** (`:8851`, bundle `index-76c8EQ4Z.js` confirmed against the build just
  made), **two-sided on all three states**:
  - `review = null` → **"Nothing to review yet" / "Finish a lesson and its check question starts
    showing up here."**, 0 buttons in `<main>`.
  - answered one check → **"You're all caught up" / `reviewEmptyBody`**, "Practice all questions"
    present. Unchanged from before this commit.
  - seeded past-due (`due: "2026-08-01"`) → **"1 ready to review" / "Start Quiz"** + "Practice all
    questions". The `due > 0` branch is untouched.
- **The icon swap proven at the DOM level rather than assumed**, since it is the part no text scan can
  see: never-started renders the book glyph `M4 5.5A2.5 2.5 0 0 1 6.5 3H19v14…` at
  `rgb(168, 158, 144)`; caught-up renders the check glyph `m5 12.5 4.5 4.5L19 7.5` at
  `rgb(110, 222, 159)`. Two different paths, two different colors.
- **All five languages render the new keys**, read off the live DOM after switching the picker:
  en *"Nothing to review yet"*, es *"Aún no hay nada que repasar"*, ko *"아직 복습할 내용이 없습니다"*,
  zh *"还没有可复习的内容"*, ja *"まだ復習する内容はありません"* — each with `htmlLang` stamped
  `en/es/ko/zh-Hans/ja` and 0 buttons in `<main>`.
  **One instrument artifact, recorded because it looked exactly like a finding:** `ko` first came back
  with an **empty** card array. The cause was my own splitter — I split `innerText` on a regex
  containing `복습`, which is the Korean word for "review" and appears *in the Korean title itself*, so
  the split landed at index 0. Re-read without the splitter, `ko` renders correctly. **The app was
  never wrong; the measurement was.**
- **`A11ySweep.selftest()` — PASS**, all 9 probes found their planted defect and the plants were
  removed, so this session's zeros are meaningful. **`A11yStates.selftest()` — PASS.**
  **`A11yStates.runAll()` — 13 reached, 13 clean, 0 findings, 0 MISSED**, matching the previous run's
  baseline exactly. **`A11yStates.sweepLangs()` — all 5 languages, every state reached, 0 findings.**
- **Restore path**: `Practice.jsx` and all five locales copied to the session scratchpad before
  editing; never `git checkout --`.

#### Step 5 — adversarial self-check

- **Blindspot register — no regression, and `npm test` is the evidence rather than my reading.** §10.2
  (no Dalio) ok; §10.1 both halves ok — "no advice-adjacent language (en/es/ko/zh/ja) across 38 files"
  and "disclaimer renders on all 8 surfaces", `Practice`'s `<Disclaimer>` untouched and still rendering
  in the live DOM above; §10.3 (kids framing) untouched; §2.3 ok — the two dates I added
  (`2026-08-26`) are in **source comments**, not user-facing copy, which is the distinction the
  Markets-tab fix drew, and the new locale strings contain no date, figure or number at all.
- **`DECISIONS.md` conflict — none.** Grepped it for `empty state` / `caught up` / `invitation` /
  `locked door` / `practice all`: **zero hits**, so nothing here is a recorded decision. localStorage-only
  state, `.js`-not-JSON content and Vite-not-Expo are all untouched.
- **Already-done backlog item — no**, and the one near-hit is load-bearing evidence rather than a
  duplication risk: the single prior mention (archive:1921) verified the *opposite* branch, under a
  seeded fixture. Nothing had ever scoped this card's never-started state.
- **The honest boundary.** Item 117(a) asked a hidden-vs-disabled question and **this run did not
  answer it** — it removed the reason the question looked urgent. The landing still shows zero buttons
  to a brand-new learner; it now explains why in one sentence instead of claiming they are done. That
  is a defensible resting point and it is **not** the same as deciding (a), so **117(a) stays open**,
  re-scoped on the corrected facts. 117(b) and the ` (N)` label are untouched and still open.
- **Own verification claim — reproducible** by `npm run build`, `npm test`, then serving `dist/` and
  re-running the three storage states plus `runAll()`/`selftest()`/`sweepLangs()` per the Environment
  note. **One limit, stated rather than papered over:** screenshots come back blank in this harness
  (Environment note 1), so every claim above rests on DOM, `getComputedStyle` and `localStorage` reads
  — including the icon claim, which is why it is quoted as path data and computed color rather than
  described as "looks right".

#### Next

- **Item 117** is now down to (b) the `reached` predicate, the ` (N)` count on the label, and (a)
  re-scoped — all low, all cheap, all still owner-preference rather than defect.
- **Item 115** remains the top process item and is an **owner decision**, not a pick.
- **Item 116** is genuinely blocked on a harness that can focus a document.
- **Items 70/71/76 and 101** remain the unclaimed candidates; 101 is blocked on O-1.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1.
- **A pattern worth one future run, filed as item 118:** this defect's shape is *copy that is
  conditional in one place and unconditional in another*. The instrument that found it is trivial —
  open a screen from cleared storage instead of from a fixture — and it has never been applied
  systematically. Learn, Reference and the streak counter have all only ever been checked warm.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Nothing in this run moved either, and nothing in this repo can.

### 2026-08-26 (scheduled dev-agent) — the cold-start sweep found no false copy, and found that the instrument could not tell which screen it had swept (item 118)

**Picked item 118**, the previous run's stated next item and the top unclaimed one. The item asks for
a reading task: open three or four screens from cleared storage and read the copy. That was done and
it came back **clean**. What it turned up instead is that the checked-in state matrix **could not say
which variant of a screen it had swept** — so this run fixed the instrument rather than reporting a
zero from it. Owner tree at open: `OWNER-TREE
c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2 (0 tracked modified, 52 untracked)`
— **UNMOVED** from the fingerprint the last entry recorded. `HEAD` = `09973fc`, unmoved at commit time.

#### Step 3.5 — the premise re-measured, with a control

Item 118's premise ("every screen has only ever been verified WARM") held, and its two named
candidates were both **negatives, measured rather than assumed**:

- **The streak counter at zero.** `Learn.jsx:94` gates the chip on `streak > 0`, and the cold DOM
  carries no chip at all. The item's guess — that a template would render "0 day streak" — is wrong.
- **Reference → Sector performance / Market signals.** Neither is a function of learner storage;
  both render identically cold and warm.

Read cold (`localStorage.clear()`, bundle hash confirmed against the build just made, `375x812`):
**Learn**, **Reference** landing, **Glossary**, **About**, **Sector performance**, **Market
Dashboard**, **LessonReader**. Every progress-conditional string is correctly gated. Checked the
class systematically instead of screen-by-screen by grepping the locale for achievement-flavored
keys and reading each call site's guard: `coachMarkPractice` ("Nice work!") is gated on
`completedLessons.length > 0` (`useAppState.js:211`), the continue-tomorrow prompt only fires from
`handleComplete`, and the Steps rail's `done` flag is set on step 1 only. **No second instance of
item 117a exists.**

**One near-miss worth recording, because it looked like a finding for two round-trips.** The cold
lesson reader renders the *same question twice* — once under "Before you read" and once under
"Check what you learned". That is deliberate: `hook = check[0]` is a pre-guess, and the check card
names the guess back via `hookRecallTemplate`. Reading the source before reporting is what stopped
it becoming a false finding.

**The control fired.** A cold reading that returns "nothing wrong" is indistinguishable from an
instrument that cannot see the variation, so the same screen was read warm in the same session
(complete lesson 1, return to `#/learn`). **All five branches flipped**: `Welcome to Economic
Cycles` → `Your learning path`, `Learn how the economy really works` → `Pick up where you left off`,
`START HERE` → `NEXT UP`, `Start Learning` → `Continue Learning`, `Progress: 0/44` → `1/44`, plus the
streak chip appearing. The instrument reads this class.

#### The finding: a named state did not name a screen

`drive()` never touches storage — `clear`/`seed` are honored **only** by `begin()`, the reload path
(`applySeed` has exactly one caller). So for the no-reload states, storage was whatever the page
loaded with, and nothing in the report said which. Measured, three runs of the *same recipe*:

| storage | card | status |
| --- | --- | --- |
| `review = null` | "Nothing to review yet" | `ok`, 0 findings |
| `review` seeded, none due | "You're all caught up" | `ok`, 0 findings |
| `review` seeded, past due | "1 ready to review" + Start Quiz | `ok`, 0 findings |

All three satisfy `practice-landing`'s arrival assertion (`#how-review-title` exists). **This is a
lying zero of a new kind**: not "the sweep missed the screen" but "the sweep found a screen, swept it
correctly, and the report named a different one" — and it is the same fixture mechanism that hid item
117a for four weeks.

**It was also actively contaminating the five-language sweep.** `practice-all-questions` answers a
check question (`{ radio: 4 }` → `recordReview` → writes `ecycles_review`), and `sweepLangs()` runs
the whole no-reload set **once per language in one page session**. Measured: from cleared storage
`practice-landing` reads "Nothing to review yet"; immediately after that state runs, the identical
recipe reads "You're all caught up". So the previous entry's *"sweepLangs — all 5 languages, every
state reached, 0 findings"* was comparing **en's never-started card against four languages'
caught-up card**. Both rows said `ok`.

#### What shipped

- **`scripts/a11y-states.js`** — states may declare a storage **precondition** (`requires`), asserted
  by `drive()` **before any step runs**, reporting `PRECONDITION` with findings `null` and the
  observed storage quoted. It never *sets* storage: the app reads `localStorage` at mount only, so a
  mid-session write changes the store and not the screen. `COLD` is declared on the three states
  whose rendered copy is storage-dependent — `learn`, `learn-collapsed`, `practice-landing`.
- **`practice-all-questions` is now reload-gated** (`reload: true, clear: true`), which makes the
  no-reload set side-effect-free and is what lets `COLD` hold for a whole `sweepLangs()` run. Its
  earning steps are kept exactly as the previous run wrote them; `clear` + reload makes them
  deterministic. It still sweeps clean via `begin()`/`finish()`.
- **`practice-landing`'s assertion tightened** to name the card (`#review-empty-title`, and no
  progressbar), not just the rail — the rail is present in all three variants.
- **`src/screens/Practice.jsx`** — the nothing-due card's title gets `id="review-empty-title"`. A
  test hook, deliberately **not** tied to which of the two strings renders, so the assertion is
  language-independent. Same convention as `how-review-title` and `track-<key>-title`.
- **`scripts/check-data.mjs` §48(d)** — a static guard that no **no-reload** state carries an
  `{ answer: N }` / `{ radio: N }` step, since that is the verb that writes `ecycles_review`. Without
  it, the next run can re-add a mutating step and silently restore the contamination.
- **`runAll()` / `sweepLangs()`** count `preconditionFailed` separately from `clean` and from
  `missed`, and the verdict line says which.

#### Verification

- `npm run build` clean (`✓ built in 1.31s`); **`npm test` — 0 failures across all six suites**, 2
  warnings, both standing (translation review coverage; 48 abridged pairs / item 93). `node --check`
  on the instrument. `npm run check-payload` — 0 failures.
- **`A11ySweep.selftest()` PASS** (plants found, `plantsRemoved: true`). **`A11yStates.selftest()`
  PASS**, including the new **two-sided** control: the unsatisfiable-`requires` state reports
  `PRECONDITION` with `ranStepsAnyway: false` — proving the gate runs *before* the recipe, which is
  the whole point, since a wrong-storage state's steps are what would mutate storage for the states
  after it — while the satisfiable one reports `ok`. `bothSidesDiffer: true`. A gate that always
  fires and a gate that never fires are both lying results and only one is caught by asking "did it
  fire?".
- **The gate proven on the REAL states, two-sided, not just the synthetic control:**
  - cold → **12 swept, 12 clean, 0 missed, 0 preconditionFailed**.
  - warm (`completed = [1,2]`, a seeded review entry) → **9 clean, 3 PRECONDITION** — exactly
    `learn`, `learn-collapsed`, `practice-landing`, each quoting the ambient storage it found, while
    the 9 storage-independent Reference states still passed. **Before this change that same warm run
    reported 12 clean.**
- **`sweepLangs()` from cold — all 5 languages, 12 states each, 12 clean, 0 precondition failures**,
  `htmlLang` stamped `en/es/ko/zh-Hans/ja`. Every language now reads the same card variant, which is
  what the previous report only appeared to say.
- **Reload states re-verified after the move**: `practice-all-questions` (`ok`, arrival satisfied,
  `htmlLang: en`), plus `practice-runner` and `first-run-modal` untouched and still `ok`.
- **The §48(d) guard proven able to fail**: removed `reload: true` from `practice-all-questions`,
  re-ran — **exactly 1 failure**, naming that state and no other, so the failure is the injected one
  rather than collateral. Restored from a **scratchpad copy verified by sha256**
  (`d4bee62a…`, byte-identical), never `git checkout --`.
- **Screenshots work in this harness today** — a cold `375x812` capture of Learn renders correctly
  (Welcome / START HERE / no streak chip). Worth recording because the previous entry reported blank
  frames as a standing limit; it did not reproduce this session.

#### Step 5 — adversarial self-check

- **Blindspot register — no regression.** §10.2 (no Dalio) — grepped the diff, zero hits. §10.1 — no
  user-facing copy changed at all; the only app edit is an `id` attribute. `npm test` re-proves both
  halves ("no advice-adjacent language across 38 files"; "disclaimer renders on all 8 surfaces").
  §10.3 untouched. §2.3 — the `2026-08-26` dates I added are in **source comments**, not user-facing
  copy, and the new locale-free `id` carries no date or figure; §2.3's test passes.
- **`DECISIONS.md` conflict — none.** Grepped for `precondition` / `state matrix` / `a11y` /
  `test hook`: zero hits. The localStorage-only entry is respected — this run **reads** three
  declared keys from a browser instrument and adds, renames and persists nothing.
- **Already-done backlog item — no, and the one adjacency is a completion rather than an undo.** The
  previous run rewrote `practice-all-questions` to *earn* its question instead of relying on ambient
  storage, and its comment already named the general problem ("it carries no `clear`/`seed`, so it
  used to sweep whatever storage the page happened to load with"). That fix was applied to one state
  and the class left standing — which is the same shape as item 117a itself, fixed in one place and
  unconditional in another. This run keeps those steps verbatim and generalizes them.
- **The honest boundary.** Item 118 asked "is there a second instance of 117a's false copy?" The
  answer is **no**, and that is the item's own stated success condition. It does **not** follow that
  the cold path is fully verified: this run read *copy*, and `A11ySweep` checks *structure*. Nothing
  here proves a sentence true — that remains a reading task, now with a mechanical setup and a
  guarantee about which screen was read.
- **Own verification claim — reproducible** by `npm run build`, `npm test`, serving `dist/`, copying
  both scripts in, then: cold reload → both selftests → `runAll()`; warm reload → `runAll()`;
  cold reload → `sweepLangs()`. The `PRECONDITION` counts are the load-bearing numbers and they are
  two-sided by construction.

#### Next

- **Item 118 closes on its stated terms** — the sweep found no false copy, and the fixture mechanism
  that hid the original is now guarded. **Filed as item 119:** the remaining `requires`-worthy states
  are unaudited — only three declare storage today, and the judgment that the other nine are
  storage-independent was made by reading, not by a check.
- **Item 117** is unchanged: (a) re-scoped, (b) the `reached` predicate, and the ` (N)` label — all
  low, all owner-preference rather than defect.
- **Item 115** remains the top process item and is an **owner decision**, not a pick.
- **Item 116** is still genuinely blocked on a harness that can focus a document.
- **Items 70/71/76 and 101** remain unclaimed; 101 is blocked on O-1. **Do NOT pick item 94.**

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Nothing in this run moved either, and nothing in this repo can.

### 2026-08-26 (scheduled dev-agent) — nine judgments became nine measurements, and the Glossary had been sweeping the wrong screen (item 119)

**Picked item 119**, the previous run's stated next item and the top unclaimed one. It asked for a
measurement: the other nine no-reload states were judged storage-independent by *reading* them, and
`requires` is opt-in, so a state that should declare and does not just keeps reporting `ok`. The
measurement now exists as a re-runnable audit, and it found the one gap the item predicted.
Owner tree at open: `OWNER-TREE c2331799…` — **UNMOVED**; 52 untracked, all the owner's. `HEAD` =
`009512f`, unmoved at commit time. **No file under `src/` changed this run.**

#### Step 3.5 — the premise re-measured, with a control

Both halves of the item's premise **held**, and both were checked rather than accepted:

- **12 no-reload states; 3 declare `COLD`; 9 declare nothing.** Read off the matrix, not the item.
- **The named candidate is real.** `Glossary.jsx:115` renders `` `${entry.s || term}, ${t.bookmarkedLabel}` ``
  for a bookmarked row and the bare term otherwise, plus a bookmark icon at `:130`.

**The instrument was validated against a stale-state trap before anything was measured.** The
browser opened the app in **Japanese** — a leftover `ecycles_lang` from an earlier session. That is
the same class of error as the dark-mode scan this log already records: had the audit run there, the
"cold" baseline would have been a `ja` page. Cleared and re-asserted (`htmlLang: en`) first.

#### The two premise corrections, one of which changed the fix

1. **The fixture is nine keys, not twelve.** The item's cheap version said "every declared key".
   That includes `lang` / `theme_mode` / `font_scale`, which restyle or re-translate every screen —
   every state would have differed and the result would have distinguished nothing. Those three are
   presentation preferences with their own axes (item 112) and are now named in `FIXTURE_EXCLUDES`
   so the exclusion is reviewable rather than silent.
2. **`requires: COLD` would NOT have fixed the gap.** `COLD` reads `completed` and `review`; it
   never reads the bookmark key. **Measured:** on a page with one bookmark and no lesson progress,
   `coldWouldHavePassed: true` — so the glossary would have swept the relabeled screen and reported
   clean. The fix is a separate `NO_BOOKMARKS` predicate naming one key. Declaring *more* would
   have been the opposite error, which is why `auditFinish()` reports `OVER-DECLARED` too (it found
   none).

#### The measurement

`A11yStates.auditBegin()` → reload → `auditFinish()`. **12 audited: 4 vary with learner storage, 8
provably storage-independent, 1 GAP, 0 over-declared.** The gap's own delta, quoted by the tool:

| | at char 15157 |
| --- | --- |
| cold | `aria-label="Inflation"` (len 41,189) |
| warm | `aria-label="Inflation, Saved"` (len 41,520) |

`reference-glossary-term` came back **independent** — the seeded bookmark is on `Inflation` and that
state opens term 0, so its DOM genuinely does not move. A measurement, not an oversight.

#### Both controls fired, and both are two-sided

- **Negative (does the instrument cry wolf?)** — cold-vs-cold, all 12 states **byte-identical**, in
  two separate sessions. Then **injected**: a `setInterval` stamping a changing attribute on
  `<main>`. `auditBegin` returned **`INSTRUMENT-NOT-USABLE`, 12 unstable, and refused both to reload
  and to stash a baseline.** Residue removed; the same call returns PASS on the untouched page.
  Without this control a byte diff would report noise as findings.
- **Positive (is the fixture reaching the app?)** — every one of the 3 already-declared states
  varied under the fixture. If none had, every "provably independent" row would be a lying zero.
- **The fixture assertion caught a real bug on its first run.** `auditFinish` reported
  **`FIXTURE-NOT-APPLIED`** naming `ecycles_analytics_log`: `analytics.js` appends an `app_opened`
  event on every mount, so an append-only key's post-reload value is *never* the pre-reload value.
  Byte-equality was the wrong assertion there and would have failed this audit forever for a reason
  unrelated to it; it now asserts the seeded entry is still *in* the log. Fixing the assertion
  rather than loosening it is the point.

#### What shipped (two files, both under `scripts/` — the app is untouched)

- **`scripts/a11y-states.js`** — `auditBegin()` / `auditFinish()`, `WARM_FIXTURE` (+ the named
  `FIXTURE_EXCLUDES`), `NO_BOOKMARKS`, `requires: NO_BOOKMARKS` on `reference-glossary`, and
  `storageNow()` now reports `bookmarks` (a PRECONDITION report that omits the offending key shows
  the operator three empty-looking values and no cause). Fixture shapes are checked against their
  readers — `{ count, lastDate }` for the streak, `{ optedIn, lastPromptDate }` for continuePref —
  because `storage.js` swallows a parse failure and falls back to the cold default, so a malformed
  fixture and a genuinely independent screen produce the same row.
- **`scripts/check-data.mjs` §48(e)** — every key in `storage.js`'s `KEYS` must be either set by
  `WARM_FIXTURE` or named in `FIXTURE_EXCLUDES`. It cannot check that a screen *varies* (only a
  browser can), but it closes the one silent failure that is static: a new persisted key the
  fixture never sets is a key no screen is measured against, and every screen reading it comes back
  "provably storage-independent".

#### Verification

- `npm run build` clean (`✓ built in 1.33s`); **`npm test` — 0 failures across all six suites**, 2
  warnings, both standing (translation review coverage; 48 abridged pairs / item 93).
  `npm run check-payload` 0 failures. `node --check` on both scripts.
- **The new `requires`, proven two-sided on the real states:** cold → **12 swept, 12 clean, 0
  precondition**; warm fixture → **8 clean, 4 PRECONDITION** (`learn`, `learn-collapsed`,
  `practice-landing`, and now `reference-glossary`, each quoting the bookmark value it found).
  **Before this change that warm run reported 3.**
- **The discriminating case, which is the one that matters:** bookmarks seeded, no lesson/review
  progress → **11 clean, 1 PRECONDITION (`reference-glossary` alone)**, with `coldWouldHavePassed`
  measured as `true` in the same call. Precise, not blanket.
- `A11ySweep.selftest()` PASS (plants found and removed); `A11yStates.selftest()` PASS,
  `bothSidesDiffer: true`. `sweepLangs()` from cold — **5 languages × 12 states, 12 clean each, 0
  precondition, 0 findings**, `htmlLang` stamped `en/es/ko/zh-Hans/ja`.
- **The audit re-run after the fix**: 0 gaps, 0 over-declared, `reference-glossary` now
  `correctly declared`. Reproducible end-to-end.
- **§48(e) proven able to fail**: injected `ecycles_injected_probe` into `storage.js`'s `KEYS` →
  **fired naming exactly that key**. §27 (new keys must be documented in `DECISIONS.md`) fired too —
  a pre-existing, *complementary* guard, not collateral: §27 checks documentation, §48(e) checks
  measurement coverage. Restored from a **scratchpad copy verified by sha256** (`9d57e1e8…`,
  byte-identical), never `git checkout --`.
- **The served copy was proven identical to source** (`sha256 9748037e…` on both `scripts/` and
  `dist/`) — worth doing, because `npm run build` wipes `dist/` and silently removed the
  instrument copies mid-session once.

#### Step 5 — adversarial self-check

- **Blindspot register — no regression, and the one adjacency was tested rather than assumed.** No
  file under `src/` changed, so §10.1 / §10.2 / §10.3 have no surface here; `npm test` re-proves
  both §10.1 halves and §2.3 anyway. The adjacency is **§23**: I added a `new Date()` to
  `a11y-states.js` for the streak fixture's `lastDate`. It uses the local `getFullYear/getMonth/
  getDate` idiom `src/utils/date.js` uses, never `toISOString().slice(0,10)` — and rather than
  trust that §23's pass covered the file, **I injected the banned idiom into it and confirmed §23
  fails, naming `scripts/a11y-states.js:847`.** The pass is meaningful, not vacuous. Restored by
  sha256 (`9748037e…`). The date is scaffolding and is never rendered, so §2.3 is not in play.
- **`DECISIONS.md` conflict — none.** localStorage-only is respected: this run **adds no persisted
  key** (§27 passes), and the instrument reads and seeds declared keys from a browser console only.
- **Already-done backlog item — no; this is item 118's own stated residual, completed.** Item 118
  added the `requires` mechanism and declared it on three states; this run measures the other nine
  instead of leaving them at a reading. Nothing item 118 shipped is undone — its three declarations
  all survive and are the positive control here.
- **The honest boundary.** The audit tests **one point in storage-space**: empty vs one warm value.
  It cannot see a state whose screen varies between two *non-empty* values (1 bookmark vs 20,
  `completed = [1]` vs all 44), because every predicate the file can currently express is an
  emptiness assertion. **Filed as item 120** rather than left implied. Also unproven: the positive
  control's failing side is argued, not injected — I did not construct a fixture that applies and
  still fails to move a declared screen.
- **Own verification claim — reproducible** by `npm run build`, `npm test`, serving `dist/`, copying
  both scripts in *after* the build, then: cold reload → both selftests → `runAll()` → `sweepLangs()`;
  cold reload → `auditBegin()` → reload → `auditFinish()`. The load-bearing numbers are the
  `PRECONDITION` counts (3 → 4) and the audit's `gaps` (1 → 0), and both are two-sided by
  construction.

#### Next

- **Item 119 closes on its stated terms**: nine judgments are nine measurements, the one gap it
  predicted was real and is fixed, and the fixture can no longer silently narrow (§48(e)).
- **Item 120** (filed above) is the instrument's next blind spot — **low priority, and explicitly
  not to be picked over content or an owner-facing item.** Three consecutive runs have now gone to
  the a11y instrument; W-5.2's ratio rule is about item 93 by its letter, but its reasoning —
  direction coming from "continue the tranche" rather than from the backlog — applies here, and the
  next run should take content or a W-5.2 pick.
- **Item 117** is unchanged: (a) re-scoped, (b) the `reached` predicate, the ` (N)` label — all low,
  all owner-preference rather than defect. **Item 115** remains the top process item and is an
  **owner decision**. **Item 116** is still blocked on a harness that can focus a document. Items
  70/71/76 and 101 remain unclaimed; 101 is blocked on O-1. **Do NOT pick item 94.**

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Nothing in this run moved either, and nothing in this repo can.

### 2026-08-26 (owner-directed) — the backlog compressed: option (a) of item 115, and the half of the problem it does not fix

**Owner request: "compress the backlog — option (a)."** Item 115 offered two ways to stop this file
consuming every run's read budget; the owner picked compression over re-pointing the trigger.

#### Result

| | Before | After |
|---|---:|---:|
| Backlog section | 481,573 b | **146,979 b** (−69%) |
| — the 97 items | 447,278 b | **153,020 b** |
| `AGENT_LOG.md` | 581,500 b | **~290,000 b** (−50%) |

The file had already climbed from 493 KB back to 581 KB in the hours since this morning's archive
pass — six scheduled runs landed items 108, 114, 117a, 118 and 119 — which is the re-crossing rate
item 115 predicted, observed rather than modelled.

#### The rule applied, so a future pass does not re-derive it

Every item keeps its **bold headline**, which is already the summary a past run wrote, **plus every
block that carries guidance meant to outlive the item**: standing rules, `⚠️`/`⛔` warnings, "do not
re-derive", "deliberately not", known limits, traps, scope cautions. Dropped: per-tranche chronology,
`<details>`-wrapped retained original text, and "Update, `<date>`" accretion.

- **25 items were compressed by hand** — the ones whose standing content was tangled through the
  narrative rather than sitting in its own block. Item 93 is the extreme case: 52,801 → 3,370 bytes,
  keeping the W-5.5 three-place count rule, the four per-language density bands (`es` 1.02-1.20,
  `ko` 0.45-0.60, `zh` 0.285-0.357, `ja` ~0.50), the rising-reference asymmetry, the track boundaries
  that item's own text got wrong for two days, the "a green ledger is not evidence" warning, and the
  three named defect shapes — because **item 94 explicitly points at them and says do not re-derive**.
- **54 were compressed mechanically**, headline plus guidance-bearing blocks.
- **18 open items were not touched at all** — byte-identical, verified.

#### The judgment call, recorded because it is arguable

Where a blockquote mixed guidance with chronology, it was **kept whole**. Over-keeping is the right
error direction for a pass whose only irreversible move is deletion — and it is why the cut is 69%
rather than the ~85% a headline-only pass would have produced. **Item 33 is the clearest cost:** it
still carries four restatements of one lesson, because each restatement is wrapped around a real
warning. A later pass may tighten those; this one deliberately did not.

#### Verification

- **All 97 item numbers survive** — asserted in the transform itself, which throws rather than writes
  if any disappears. `check-backlog.mjs`: **97 items, no duplicates, all 130 code citations resolve.**
  That last number is the one that matters: 48 distinct item numbers are cited from `src/` and
  `scripts/`, and losing any would have been a silent dangling pointer.
- **The preamble is byte-identical** (34,198 b) — O-1/O-2/O-3 and every W-block untouched.
- **All 18 open items are byte-identical.** No item grew.
- **Nothing dropped is unrecoverable: all 79 compressed items were checked to have run-log coverage**,
  with the probe proven to fire on real item numbers (93, 34) and **not** on invented ones (9991,
  9992).
- **An instrument error was caught by exactly that control.** The first coverage run reported 79 of 79
  items missing from the run log while its own control said item 93 *was* present — a direct
  contradiction. The cause was shell quoting eating a regex escape (`\b` → literal `\\b`), the same
  class as this morning's failed injection. Re-run from a file: **none missing.** A negative result
  that disagrees with its control is an instrument failure, not a finding.
- `npm test` **0 failures, 2 warnings** (the documented translation baseline).

#### Step 5 — adversarial self-check

- **Blindspot register** — not applicable and checked anyway: no `src/`, no content, no rendered UI.
  Nothing was added to this file; text was only removed or replaced with shorter text.
- **`DECISIONS.md` conflict** — none.
- **Already-done backlog item** — this *is* item 115, filed this morning and chosen by the owner. It
  is not a redo of W-3's item-17/24 compression; that covered two items, this covers 79.
- **Own verification claim** — the claim easiest to fake is "nothing important was lost", since a
  compression that drops a standing rule looks exactly like one that does not. Three things make it
  checkable: the transform refuses to write if an item number disappears; open items and the preamble
  are asserted byte-identical rather than eyeballed; and the run-log coverage probe carries controls
  in both directions. **What it cannot prove** is that no individual *sentence* of guidance was
  dropped from a compressed item — that is judgment, and the over-keeping bias above is the mitigation.
- **§31 respected**: not one run-log entry was touched. Backlog items are live state, not dated
  records, and W-3's 2026-08-16 compression of items 17 and 24 is the precedent.

#### Next

- **W-5.3's own defect is still open and is now cheap** — option (b), re-pointing the 600 KB trigger
  at a run-log byte count so the clause stops being a no-op on the day it fires. Twice now.
- **Item 116 / 117 / 120** are the open residuals from today's scheduled runs.
- **Item 94** stays parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-27 (scheduled dev-agent) — the log-size measurement, recovered from a stalled run, plus the control it was missing (item 121)

**Recovery run.** `git status` showed `scripts/check-log-size.mjs` untracked, written 2026-08-26 21:07
— after the last commit (`d411961`, 18:51) — and matching the previous entry's stated Next item
exactly. Nothing else of mine was uncommitted: `package.json` was untouched, so **the script was not
wired into anything**, despite its own header saying "Run via `npm test`". `UIUX/` and `drafts/` are
the owner's untracked reference material (dated 08-14→08-17) and were left alone.

#### Step 3.5 — re-measuring the premise, with controls

The premise here is the instrument itself, so the check is whether its numbers are real and whether
its controls fire.

- **Both headline numbers reproduce by a completely independent path.** `wc -c AGENT_LOG.md` →
  **295,551 b**, identical to the script's file figure; an `awk` section walk over `## Run log` →
  **79,527 b**, identical to its run-log figure. Not a re-run of the same code — a different tool.
- **Attribution probes, run in an isolated fake root** (`scratchpad/probe/` with its own
  `scripts/` + `AGENT_LOG.md`, so the real log was never modified — `git status` confirmed unchanged
  throughout). Injecting **+1000 b** at EOF moved file and run log by exactly +1000 with the floor
  fixed; injecting **+500 b** into the backlog moved floor and backlog by exactly +500 with the run
  log fixed. The two budgets attribute in both directions.
- **Controls proven to FAIL, not just to print `ok`.** Renaming `## Run log` → `## Journal` made
  control 2 fail and exit 1. Breaking all nine dated entry headings made control 3 fail.

#### The injection that did not land, recorded because the green was meaningless

The first control-2 probe reported a clean `PASS` — and that was **not** evidence the control was
broken. A `replace(..., 1)` hit the **first** occurrence of the literal `## Run log`, which is a
prose mention inside a backlog blockquote on **line 252**, not the real heading on line 2405. The
file changed; the heading did not. Re-run with an `assert` pinning line 2405, the control failed as
it should. **A probe whose landing is not proven produces a green that means nothing** — the same
class as this project's two previous quoting failures. It also incidentally confirms the splitter
correctly ignores `## `-looking text inside a blockquote.

#### What the probing found that reading would not have

**A single malformed entry heading is silent.** Breaking one of nine headings left `days.size` at 1,
so control 3's zero-days test never fired, while that entry's **7,668 b** dropped out of the day
attribution — the ratio moved **98.0% → 88.4%** and nothing said so. Fixed by budgeting the
**un-attributed remainder** instead: the run log's own heading and archive pointer are **1,599 b**
and structurally flat, so `UNATTRIBUTED_MAX = 5,000 b` catches a dropped entry (smallest real one is
~7.7 KB, clearing the threshold by 1.5x) without tripping on normal growth. Verified in both
directions: silent at baseline (1,599 b), **WARN** on one broken heading (9,264 b).

It is a **warn, not a fail, and the direction is the reason**: the budget verdicts read the section's
own byte count, which a broken heading cannot touch. Only the cut plan consumes the day map, and
under-counting a day makes it propose *more* days than needed or cry "impossible" too early. It errs
toward alarm, never toward a false all-clear.

#### Verification

- `npm test` — **exit 0, 0 failures, 2 warnings** (the documented translation baseline, unchanged).
- `npm run build` — **✓ built in 1.28s.**
- `check-backlog.mjs` — **98 items, no duplicates, all 131 code citations resolve.**
- `MEASURED log-size: file 295551 b, run log 79527 b, floor 216024 b (backlog 190062 b), archive
  2077529 b, 1 live day(s)` — 2026-08-27, measured **before** this entry and item 121 were written.
  After them: **file 304,586 b, run log 85,691 b, floor 218,895 b, 2 live day(s).** Both are quoted
  because a later run re-running the check will match neither, and that is not a defect — every
  commit here changes this file, which is exactly why the script carries no fingerprint.
  **The floor is at 88% of its budget and archiving cannot move it**; that is the number that will
  bite first, and only a backlog-compression pass can.

#### Step 5 — adversarial self-check

- **Blindspot register** — no `src/`, no content, no rendered UI; nothing user-facing changed. The
  dates in the new comments are dated records of when something was measured, not a hardcoded
  current date in a shipped surface. `check-blindspot.mjs` passes.
- **`DECISIONS.md` conflict** — none. Adding a checker to the `npm test` chain is the established
  pattern (`check-data`, `check-payload`, `check-measurements`); nothing here touches
  localStorage-only state, the `.js`-not-JSON content modules, or Vite-vs-Expo.
- **Already-done backlog item** — not a redo. Item 115 option (a) compressed the backlog; this
  measures the file and explicitly declines to change W-5.3's rule.
- **`MEASURED` line collision** — checked before wiring: `check-measurements.mjs` matches only
  `MEASURED jargon <mode>: …` with a fingerprint, so `MEASURED log-size:` cannot be picked up by it.
- **Own verification claim** — the claim easiest to fake is "the controls work", since a control that
  never fires prints exactly what a working one prints. Every control here was made to fail on
  purpose with its injection proven to land, and the one probe that silently did not land is written
  up above rather than quietly re-run. **What this does not prove:** that the thresholds are the
  right thresholds. 250 KB/250 KB is W-5.3's 600 KB partitioned, not a measured optimum; the
  un-attributed 5,000 b is derived from one observed floor and one observed entry size.

#### Next

- **W-5.3's action clause is still date-based** and still a no-op when it fires. Item 121's box
  explains why option (b) does not fix it and why a dev-agent must not pick the replacement. **The
  owner now has live numbers to decide on.**
- **The floor at 88%** is the next thing to cross a budget, and archiving is powerless against it.
- **Items 116 / 117 / 120** remain the open residuals from 2026-08-26.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-27 (owner-directed) — the backlog compressed a second time, and the first pass's headline figure was wrong by 43 KB (item 122)

**The ask:** "compress the backlog to bring the floor under budget."

#### Step 3.5 — the premise, corrected twice before anything was edited

- **The floor was already under budget.** 218,895 b against a 250,000 b warn budget — **87.6%**, not
  over it. Nothing was breaching. The ask was therefore read as *create real headroom*, since the floor
  is the number archiving cannot move, and that reading is what the result below reports.
- **⛔ Item 115's claimed post-compression figure was wrong by 43,083 bytes.** It records the backlog
  section going to **146,979 b** on 2026-08-26. Measured live from that very commit —
  `git show d411961:AGENT_LOG.md | awk '…' | wc -c` — the section was **190,062 b**. The first pass cut
  **60%, not the 69% it claimed**. Its own table was internally inconsistent on its face: it reported
  "the 97 items" at **153,020 b** inside a section it called **146,979 b**, and items cannot exceed the
  section that contains them. **The likely cause is this project's oldest failure in a new costume — a
  figure computed from the transform's own output buffer rather than measured off the written file.**
  Written into item 115 so it is not re-derived.
- *(An instrument error caught in passing: the first `git show` loop returned `0` for both commits
  because zsh parsed `$REF:AGENT_LOG.md` as a path modifier. A silent, confident zero — noticed only
  because zero is not a plausible section size. Re-run with `${REF}:…`.)*

#### Where the bytes actually were, which is not where the first pass looked

Item 115 compressed 79 closed **items** and left the backlog's **396-line preamble byte-identical**.
That preamble held **34,857 b** — 18% of the section — and almost all of it was closed:

| | before | after |
|---|---:|---:|
| Backlog **preamble** (W-blocks, O-blocks) | 34,857 b | **18,338 b** (−47%) |
| Seven largest closed **items** (30/33/40/47/49/50/115) | 29,490 b | **16,621 b** (−44%) |
| **Backlog section** | 192,933 b | **165,994 b** |
| **Floor** (never archived) | 218,895 b | **191,956 b** — 76.8% of budget |
| Whole file | 304,945 b | **278,006 b** |

The preamble alone gave **16,519 b — more than the five largest closed items combined.** The bulk of it
was the **closed W-1…W-4 block** (all four marked closed since 2026-08-16, still carrying their full
original text) and the W-5 block's four **"(original text, retained)"** duplicates. **Item 115's own
original text predicted exactly this** — *"W-1 through W-4 are all closed and still occupy their full
original text"* — and the pass that wrote that sentence did not act on it.

#### What was kept, and what was dropped

Kept: every standing rule (W-1's browser-verification rule, W-2's refill rule, W-5.2's one-run-in-four
rule **and** its pick-lists-go-stale lesson, W-5.3's archiving rule and its known defect, W-5.4's
measure-the-shape method note, W-5.5's both-places rule, W-5.6's two premise corrections), O-1/O-2/O-3,
and every `⚠️`/`⛔` warning. Dropped: superseded chronology and retained original text — all of which is
in the run log and `AGENT_LOG.archive.md`.

**Item 93 was deliberately left alone** despite being the largest remaining closed item: item 94 points
at it and says do not re-derive its content.

#### Verification — every claim here has a control that was made to fail

- **No item number lost.** 98 → 99 (only item 122 added). **All 17 open items byte-identical**, asserted
  by hashing each body against a pre-pass copy rather than eyeballed. Exactly seven items changed, and
  **no item grew**.
- **The verifier was proven able to fail, both ways, with the injections proven to land:** perturbing one
  line of open item 19 produced `FAIL: open items CHANGED: 19`; deleting item 47 produced
  `FAIL: item numbers LOST: 47`.
- **O-1/O-2/O-3 byte-identical by SHA-256** (498 b / 363 b / 889 b, hashes equal), with a control
  comparing O-1 against O-2 to show the comparison can differ. **An earlier version of this check was
  unsound and was discarded**: it compared *lengths* of 1,200-char windows, and both hit the cap, so it
  would have reported "unchanged" for any difference inside them.
- **16 standing-rule probes all present**, with a deliberately-absent control probe confirming the
  search can report absence.
- **Nothing dropped is unrecoverable:** all seven compressed items have run-log coverage, the probe
  proven to fire on real item numbers (93, 34) and **not** on invented ones (9991, 9992). Run from a
  file, not a shell `-c` string — the quoting trap that produced a false negative on 2026-08-26.
- `npm test` **exit 0, 0 failures, 2 warnings** (documented translation baseline); `npm run build` clean;
  `check-backlog.mjs` **99 items, no duplicates, all 131 citations resolve**.

#### Step 5 — adversarial self-check

- **Blindspot register** — no `src/`, no content, no rendered UI. Item 49 quotes the Dalio sentence that
  was *removed* from `README.md`; that quotation predates this pass and the count in this file is
  **unchanged at 12 before and after**, `src/` is 0, `check-blindspot.mjs` green.
- **`DECISIONS.md` conflict** — none; no decision touched.
- **Already-done backlog item** — this is item 115's option (a) run a second time, owner-directed, and
  it does not redo the first pass's bytes: that one did closed items, this one did the preamble it
  skipped plus a second tier. It also corrects that pass's headline figure.
- **§31 respected** — not one run-log entry was touched. Backlog items are live state, not dated records.
- **Own verification claim** — the two claims easiest to fake are "no open item changed" and "nothing
  important was lost". The first is now a hash comparison with a failing control. **The second is not
  fully provable and should not be reported as if it were:** run-log coverage proves each *item* is
  recoverable, not that no individual *sentence* of guidance was dropped. That is judgment, and the
  mitigation is the same over-keeping bias the first pass used — which is why this cut is 14% of the
  section and not 40%.

#### Next

- **⛔ The binding constraint is now open items: 76,643 b, 47% of the backlog.** **Item 19 (23,478 b,
  HELD) and item 26 (11,557 b) are 35 KB of that** — the largest single lever left. Both passes have
  kept open items byte-identical on purpose, because compressing a HELD item risks dropping scope it
  still needs. **That is an owner decision, not a run's.**
- The closed tier below the top ten is genuinely tight (81 items, ~845 b each). **Do not expect another
  pass to find much there.**
- **W-5.3's action clause is still date-based** and still a no-op when it fires (items 115, 121).

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-27 (scheduled dev-agent) — the money track had one diagram across seventeen lessons, and lesson 23's concept is a crossing (item 27)

**Picked item 27** (lesson visuals). It is one of the W-5.2 pick-list items, and it carries its own bar:
a run adding a visual *"must first name the specific lesson where a diagram teaches something the prose
cannot"* — otherwise it becomes the count-shaped item that 17, 21 and 24 each turned into.

#### Step 3.5 — the premise, re-measured with a control, and it was stale in the way that mattered

- **⛔ Item 27's live status line says "money is 4/28". That has been wrong since the 2026-08-19
  essentials split.** Measured today by parsing `LESSON_VISUALS` out of `LessonVisual.jsx` and joining
  it against `lessons.js`'s `track` field: **economy 5/12, essentials 3/15, money 1/17**. The four
  personal-finance figures are not one track's — 1/3/7 are `essentials` and only 27 is `money`.
  Corrected in the item below so it is not re-derived.
- **The corrected number is a stronger argument than the stale one, not a weaker one.** Since the
  2026-08-18 reversal `money` is the judgment track `LAUNCH_PLAN.md` §0 calls the product, and it
  carried **one diagram across seventeen lessons** while the vehicle carried five across twelve.
- **The instrument was made to fail before it was believed.** The parser asserts three ids it must find
  (32, 27, 1) and three it must not (23, 17, 9999) and exits non-zero on either; without that a regex
  broken by an edit returns "no visuals anywhere" and reads exactly like a real answer.
- **What the code says was checked separately from what the item says.** `moneyVisuals.js`'s header is
  *more* current than the backlog — it already records the re-tracking. What nobody had stated is the
  ratio, which is the part that decides priority.

#### Why lesson 23, stated against item 27's bar rather than around it

Lesson 23's own section heading is **"The Preference That Flips When 'Later' Becomes 'Now'"**, and its
body gives the flip as two disconnected snapshots: $50 today beats $65 in a month, but $50 in twelve
months loses to $65 in thirteen. **A preference reversal is a crossing**, and prose cannot draw one — it
can only assert the two endpoints and then claim, in a separate sentence, that the extra month is
identical in both. It also cannot say **when** the answer changes, which is the question the two
snapshots raise and the lesson never answers. That is the thing the diagram does.

Precedent followed deliberately: lesson 7's `BracketStack` was accepted because the prose was already
asking the reader to picture a stack. This is the same shape of argument, not an argument constructed
for a fifth visual.

#### What shipped

- **`PreferenceFlip`** in `charts.jsx` — two perceived-value curves that cross, a dashed marker at the
  crossing, and two tinted decision bands.
- **`flip*` in `moneyVisuals.js`** — the lesson's own $50/$65 one month apart, the discount function,
  and six label sets in five languages.
- **Lesson 23 wired into `LESSON_VISUALS`** (and into `MONEY_VISUALS`, so it carries `illustrationNote`
  — the §10.1 note — rather than the §2.3 market-data one). Money is now **2/17**.
- **`check-data.mjs` §50**, which asserts the claim rather than the shape.

**Two design decisions that were measurements, not taste.**
1. **The bands, not the lines, carry the decision.** For four fifths of the span the two curves are
   near-coincident — that is the honest shape of hyperbolic discounting, and it is itself the point
   (seen from far enough away the options are close and the bigger number simply wins). A figure whose
   message lived only in the line order would be unreadable there, so the message lives in the tinted
   region behind them, which survives any line separation.
2. **`k` is bounded by the lesson, not chosen for the picture.** Preferring $50-now over $65-in-a-month
   requires `k > 0.3`; below that the curves never cross and the lesson's opening paragraph describes
   something the chart says cannot happen. Any `k` above 0.3 reproduces **both** of the lesson's stated
   choices, so the text under-determines it and 1.0 is picked inside that range for legibility. §50
   asserts the **bound and the two preferences** — the part the lesson actually claims — not the
   constant.

#### Three defects found by verifying, two of them mine and one of them pre-existing

1. **The closed form for the crossing shipped wrong and nothing on screen would have said so.** It put
   the marker at month **6.667**; sampling the curves brackets the reversal between months 9 and 10
   (true value **9.667**). The figure would have drawn a confident dashed line, a band boundary and the
   words "the answer flips" at a point where nothing happens. Caught by checking the solved value
   against the sampled curves — an independent path to the same number — which is now §50(e).
2. **The zone key contradicted the bands.** The swatch borders were indexed by *series* order while the
   zones run left-to-right, and here those orders are opposite: the green band's key entry had an amber
   dot. Found in the first render, not in review. Fixed with an explicit `zoneEdges`.
3. **The dashed marker was `line.strong` at 1.51:1 on the washes — and it is not redundant, because the
   band boundary is 1.01:1.** The two zone washes differ in hue and essentially not at all in luminance
   (**1.01:1 in both schemes**, measured), so the boundary between them is invisible to anyone not
   separating those hues, which makes the marker the only thing locating the crossing by luminance.
   Moved to `ink.muted`: **6.20/6.26 light, 6.10/6.06 dark.**
   > **⛔ The pre-existing gap this exposed, filed as item 123.** `--line-*` tokens are checked by
   > **neither** §28 (inks/fills on surfaces) **nor** §28b (graphs on surfaces) — both prefix filters
   > exclude them, on the stated grounds that a line "is not text". So a `line.*` token used as a
   > *meaningful* graphic is unmeasured, and this one would have shipped at 1.51:1 under a suite
   > reporting "zero exemptions".

Also dropped: the end-of-curve value in the series legend. It renders a *perceived* value, so
"$65, a month later — $32.50" reads as a claim that the $65 is really $32.50.

#### Verification

- **`npm test` exit 0** — 0 failures, the 2 documented translation warnings. `npm run build` clean.
- **§50 proved able to fail, four ways, each injection proven to land before its result was read** and
  the file restored from a scratchpad copy (SHA-256 equal before and after, not `git checkout --`):
  `k = 0.25` → 6 failures including "the curves change order 0 time(s)"; **the real algebra bug
  re-injected** → "flipCrossing() returns month 6.667, but sampling puts the reversal at 9.675";
  amounts drifted to 50/70 → "lesson 23's body works through $50 and $65"; `flipDescription.zh`
  emptied → the parity failure.
- **Rendered live** against a served `dist/` (bundle name read back off the page each time — the
  trap-4 check), at 375x812, in **both schemes** and **all five languages**. No label overflows the
  viewBox, no axis-label collision, in any of the five.
  > **One predicate in that sweep is vacuous and is reported as vacuous, not as a pass.**
  > `markerOverlapsDash` can never fire: the marker text is `text-anchor="end"`, so lengthening it
  > extends it leftward and its right edge is pinned by construction. The control caught it — two of
  > three predicates fired on planted strings. The overflow predicate *is* sound and was proven able to
  > fire on **all three** text elements individually.
- **Contrast measured live with a control that was checked against known values** (black-on-white 21:1,
  same-colour 1:1). Curves on washes: **4.10–5.30 light, 9.34–9.66 dark**, all clearing 1.4.11's 3:1.
  The curve pair is 1.28:1 against each other — **better separated than the shipped precedent**
  (`GrowthCurve`'s green-vs-neutral is 1.13:1), and position plus legend disambiguate them.
- **§28b already covered the new graph-on-wash adjacencies** — it is a full cartesian, and its own
  comment anticipated this exact move ("a chart moved onto a wash is now covered by the cartesian
  below"). Checked rather than assumed, because `DECISIONS.md` states a "70 graph pairs, zero
  exemptions" claim that a new adjacency could have quietly falsified.

#### Step 5 — adversarial self-check

- **Blindspot register** — `check-blindspot.mjs` green on all four assertions. No Dalio/advice string in
  the diff (grepped); **no hex literal added** (grepped — tokens only); the only dates added are two
  **comment** lines, zero non-comment (grepped), and §2.3's guard passes on `moneyVisuals.js`
  specifically. §10.3 untouched. The figure carries `illustrationNote`, verified rendered.
- **`DECISIONS.md` conflict** — none. State is untouched, the content went into a `.js` module, no Expo,
  no inline hex. The one live claim it makes that this change could have broken (the graph-pair
  coverage) was checked above and holds.
- **Already-done backlog item** — item 27 is open and explicitly sets the bar for adding a visual; this
  does not touch 1/3/7/27's figures. Not in "Completed and pruned".
- **Own verification claim** — the two easiest things to overstate here are "renders correctly in five
  languages" and "the figure is accurate". The first is a geometric measurement with a control, and
  its one dead predicate is named above rather than counted as a pass. The second is asserted by §50
  against the lesson's own text and proven able to fail. **What is still not proven: no fluent reviewer
  has read the four non-English label sets** — six new five-language string sets land in the file
  `DECISIONS.md` excludes from the review ledger, which is O-3's concern exactly, and chart labels are
  where an unreviewed translation hides best because a wrong label still renders a correct-looking
  chart.

#### Next

- **Item 27's bar is unchanged and still binds for a sixth visual.** Lesson 17 ("Where Did the Raise
  Go?") is the strongest remaining candidate — the gap between two rising lines *is* that lesson — but
  it was not built here, because "plausible" is the reasoning this item warns about and one run should
  add one.
- **New item 123** (the `--line-*` contrast gap) is cheap and was found by measurement, not opinion.
- **Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
  (item 18, an analytics account). Nobody has opened this app.

### 2026-08-27 (scheduled dev-agent) — a line token can never clear 3:1, so two datum lines had been invisible by construction (item 123)

**Picked item 123**, filed yesterday by the run that shipped lesson 23's figure. It is a W-5.2-legal
pick (the previous run took item 27 off that list; this one is a filed backlog item, not a note-chain
extension). Owner tree at open: `OWNER-TREE 7eac41a5212d273526454699b88eccf45df9683e7273a52ecdcfc25903bcbf36 (2 tracked modified, 52 untracked)` — the 2 tracked were this run's own files; `UIUX/` and `drafts/` untouched.

#### Step 3.5 — the premise, re-measured with a control, and it was wrong in the direction that made the item look optional

- **✅ True as filed:** §28 filters `--ink-*`/`--fill-*` against `--surface-*`, §28b filters
  `--graph-*`, and both prefix filters exclude `--line-*` — verified at `check-data.mjs:2711`, which
  states the "a line is not text" reasoning in as many words.
- **⛔ FALSE as filed: "One known instance and it is already fixed."** Reading the call sites found
  **two more, both shipping at HEAD**:
  1. **`AsymmetryChart`'s shared zero line** — the two bars run in *opposite* directions from it, so
     the figure's entire claim ("the loss registers about twice as strongly") is a comparison of two
     distances measured from that line. Its own code comment already called it "a shared axis".
  2. **`CycleChart`'s long-run trend line** — `trendLabel` is drawn directly beneath it and names it.
     A caption refers to this line, which is item 123's own stated criterion for meaningful.
  Both were `line.strong`. **The item priced itself "low-medium" on the belief that the class was
  invisible but empty; it was invisible and occupied.**
- **The instrument was validated six ways before any result was read**, three against published WCAG
  values (21.00 / 4.48 / 1.00) and three against figures a *different* implementation already
  asserts: `index.css`'s "white on `--fill-accent` would have been 1.94:1", and §28's own
  machine-checked worst cases, **reproduced exactly at 5.61 light and 5.81 dark over 55 pairs each**.
  > **A fourth "control" was my own invented expectation (8.28:1 for `--ink-accent` on white) and it
  > failed.** The formula was right and the expected value was fabricated. Worth recording because a
  > made-up control fails *identically* to a broken instrument, and the only thing separating them is
  > whether the number came from somewhere independent. It was replaced with the three above.
- **The finding that decides the shape of the fix: `--line-*` maxes out at 1.75:1 against any
  surface, in either palette — 0 of 28 pairs clear 3:1.** So this is not "these two lines are too
  light"; it is that a line token can *never* carry meaning, and no shade of one could fix it.

#### What shipped

- **Both defects fixed** — `AsymmetryChart`'s zero line and `CycleChart`'s trend line move to
  `graph.neutral`, the token whose documented job is graphics at 3:1 and which §28b already holds to
  that on all 7 surfaces (`npm test` reports the new adjacencies covered: 70 pairs, 0 exempted).
  Each carries a comment with its measured before/after.
- **`check-data.mjs` §51**, in two halves that do different jobs:
  - **§51a — the premise.** All 28 `--line-*` × `--surface-*` pairs must stay *below* 3:1. This
    exists so the rule cannot outlive its justification: if a future repaint darkens the tokens, §51a
    fails and says "re-decide §51b", instead of leaving a prohibition nobody can re-derive.
  - **§51b — the rule.** Every SVG paint of a `line.*` token in `src/` must appear in
    `LINE_SVG_DECORATIVE` with a stated reason. It is a **complete enumeration, not an exemption
    list** — an unregistered use fails, so adding a line to a chart is a deliberate act. All 5
    current ones are classified (both `YieldCurve` axes, `GrowthCurve`'s baseline and gridlines,
    `PreferenceFlip`'s baseline), each with the argument for why it is decoration.
- **§28b's classification list updated in the same commit** — it claimed "all four rendered uses of
  `graph.neutral`" and this change makes six. Found by the step-5 self-check, not by the tests.

**Why `graph.neutral` and not `ink.muted`, which is the precedent lesson 23 set.** Measured, not
taste: rendered, the two data bars sit at **5.93:1 and 5.75:1**. `ink.muted` is **7.01:1** — it would
make the datum line heavier than the data it exists to measure. `graph.neutral` at **5.24:1** clears
1.4.11 and stays lighter than both bars. Lesson 23's marker is a different case and correctly went
the other way: there the marker *is* the message.

#### Verification

- **`npm test` exit 0** — 0 failures, the 2 documented translation warnings. `npm run build` clean.
- **§51 proved able to fail, four ways, each injection proven to land before its result was read**,
  and every file restored from a scratchpad copy with **SHA-256 verified equal before and after**
  (never `git checkout --`):
  1. an unregistered `stroke={line.strong}` added to a chart → §51b names the file, line and source
     text, and says which token to use instead;
  2. a register anchor drifted by one character → **both** halves fire — the use reports unregistered
     *and* the entry reports stale;
  3. light `--line-strong` darkened to `#6b6155` → §51a fails on all 7 surfaces with "this
     invalidates the PREMISE of §51b… re-decide the rule rather than deleting the check";
  4. **the scanner blinded** (regex mutated to match nothing) → the floor assertion fires: *"A zero
     here is not a clean result — it is a blind scanner."* This is the control that matters, because
     3 of the 4 injections would otherwise be indistinguishable from a passing sweep.
- **Rendered live** against a served `dist/`, bundle name read back off the page (`index-ImTvambK.js`,
  the trap-4 check), in **both schemes**, on lesson 27 and lesson 32.
  > **The verification did not merely confirm the fix — it caught a live probe both ways.** For each
  > chart the shipped line was measured, then repainted with `var(--line-strong)` in the live DOM,
  > re-measured, and restored, asserting that the probe actually moved the color and that the restore
  > returned the original. Result: **shipped 5.24:1 light / 4.47:1 dark; the old token 1.71:1 /
  > 1.62:1.** The defect was real on screen and the fix is real on screen, both proven in the DOM
  > rather than inferred from the palette.
  > ⚠️ **The browser opened in DARK by default.** Every scheme figure above was taken under an
  > explicit `data-theme`, because "measured live" under one silent scheme is the exact trap this log
  > already records once.
- **`preview_start` with a `name` is now refused for scheduled runs** — *"Dev servers can't be
  started from unattended sessions"*. Reporting the actual error per W-1 rather than a memory claim.
  **The Environment note's documented technique still works and is the one to use**: `python3 -m
  http.server` over `dist/`, then `preview_start` with a plain `url` (`navOk: true`). W-1's rule is
  unaffected; only the `name` form is gone.

#### A premise correction found by the browser and not by the code

The offline prediction said `graph.neutral` would be **3.76:1** in light; the live DOM returned
**5.24:1**. The palette was not wrong — **the prediction used `#7c8494`, taken from backlog item 63's
headline, and light `--graph-neutral` has been `#736b61` since the 2026-08-23 warm repaint.** The
stale figure had already been written into two shipped code comments before the live measurement
contradicted it; both were corrected before commit. **Filed as item 125 with the rule it earns: a hex
quoted in this log is a dated observation, not the palette — read the token out of `index.css` every
time, including from a closed item that states it confidently.** This is step 3.5's own lesson
recurring one level up: I re-measured the *item's* claims and then trusted a *different* item's
number without doing the same to it.

#### Step 5 — adversarial self-check

- **Blindspot register** — `check-blindspot.mjs` green on all 6 assertions. No Dalio or advice string
  in the diff (grepped); no date added (grepped); §10.3 untouched. The only hex literals added are
  `#000000`/`#777777`/`#ffffff` in §51's WCAG self-test — published reference values in a check
  script, the identical pattern §28 already uses, not app color. §2.3 untouched: no content module
  changed.
- **`DECISIONS.md` conflict — checked, and one claim came close.** Line 711 says all 70 graph pairs
  clear 3:1 "with **zero exemptions**". Still literally true: §28 and §28b's counts are unchanged
  (110 and 70, 0 exempted) and §51 is a third section with its own register. **Deliberately not
  edited** — it sits inside a dated 2026-08-23 decision record, and rewriting a dated record to
  mention work done four days later falsifies it (§31 / item 91). The new coverage is recorded in
  §51's header and here instead.
- **Already-done backlog item** — item 123 was open and filed yesterday; not in "Completed and
  pruned". This does not redo item 63: 63 classified `graph.neutral`'s *uses* and set the token's
  value, and this run **extends** that list rather than reopening it — which is precisely the
  claim ("all four rendered uses") that had to be updated in the same commit.
- **Own verification claim** — the two easiest things to overstate are "§51 works" and "the two lines
  were really defects". The first is four injections with a blinding control, each proven to land.
  The second is a live DOM probe that measured the old and new values on the same element in the same
  render. **What is NOT proven, and is now item 124: §51 would not have caught `AsymmetryChart`'s
  zero line.** It is a CSS `borderTop`, not an SVG stroke; a human reading the file found it, and a
  future one drawn that way would need the same. Saying "§51 closes the line-token gap" would be
  false — it closes the SVG half.

#### Next

- **Item 124** (the border-drawn datum line, via a live-DOM probe rather than a parser) and **item
  125** (sweep this log's quoted palette hex against `index.css`) are both cheap and both were found
  by measurement rather than opinion.
- **Item 27's bar still binds for a sixth visual**; lesson 17 remains the named candidate and was
  again not built, because one run should add one.
- **Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and
  **O-2** (item 18, an analytics account). Nobody has opened this app.

### 2026-08-27 (scheduled dev-agent) — the stale hex was a defect and not a class, and the check written to prove it committed the same defect in its own header (item 125)

**Picked item 125**, filed yesterday by the run that closed item 123. W-5.2-legal: a filed backlog
item, not a note-chain extension, and the last four picks (121, 122, 27, 123) contain no item 93, so
the one-in-four reserve is not in deficit. Owner tree at open: clean but for the untracked `UIUX/` and
`drafts/`, neither touched.

#### Step 3.5 — the premise, re-measured with controls, and the item's own hypothesis was refuted

- **✅ True as filed:** item 63's headline said light `--graph-neutral` is `#7c8494`; `src/index.css`
  says `#736b61`. The token moved in the 2026-08-23 warm repaint and the headline was never re-read.
- **⛔ REFUTED as filed: "a sweep … would find whatever else moved in the same repaint."** The sweep
  ran across all of living text — backlog, App summary, Environment note, five standing docs, and all
  72 files under `src/` — and found **exactly one real defect**. Three other hits were false
  positives, and the shape of them is the finding: two name a token while quoting the *other* side of
  a pair being argued about, and `lessons.js:149` is flagged **because its comment exists to argue
  that lesson 32's accent is not `--graph-amber`** (item 75 had assumed it was). **This was a defect,
  not a class**, and the item is closed saying so.
- **The instrument failed its own control first, which is why there is a control.** The first parser
  tracked light/dark mode by regex and reported light `--graph-neutral` as `#8a8072` — the *dark*
  value — because the dark block's selector is `:root:not([data-theme="light"])` and the mode-flip
  regex matched the `:not(...)`. Every downstream comparison would have been wrong while looking
  entirely normal. **Caught by a control that asserted light ≠ dark**, not by reading the output. The
  parser was replaced with §51's index-slicing approach and re-validated against four token pairs read
  straight out of `index.css`.

#### What shipped

- **Item 63's headline no longer quotes the hex at all.** Per item 58's standing rule — a stale figure
  inside an argument that does not need it is *deleted*, not corrected — it is **not** restated with a
  fresh value, because restating re-arms the trap four days later. It now says the run gave the token
  a value, carries a note on what the stale figure cost, and points at `src/index.css`. **The dated
  claim is preserved**: rewriting `#7c8494` → `#736b61` would have made a 2026-08-17 entry assert
  something that run did not do.
- **`check-data.mjs` §52**, in two halves:
  - **§52a — the parse control.** The light and dark maps must each hold ≥20 tokens **and must differ
    from each other**. The second assertion is the one that matters and it exists because the failure
    above passes a size check with flying colors.
  - **§52b — the rule.** Every `--token` + `#hex` co-occurrence on one line of *living* text must
    agree with `src/index.css`, or appear in `HEX_ATTRIBUTION_OK` with a stated reason. 2 entries,
    both anchored **by text, never by line number** (item 73's standing method).
- **The run log and `AGENT_LOG.archive.md` are deliberately out of scope**, per §31 / item 91: an
  entry recording "3.76:1 at `#7c8494`" was true when written. **That exclusion is load-bearing, not
  cosmetic** — injection 5 removed the boundary and a dated entry's injected probe value immediately
  failed the build.

#### Verification

- **`npm test` exit 0** (0 failures, the 2 documented translation warnings), **`npm run build` clean.**
- **§52 proved able to fail, five ways**, each injection asserted to have landed before its result was
  read, each file restored from a scratchpad copy with **SHA-256 verified equal** (never
  `git checkout --`):
  1. a one-digit-wrong hex in a `src/` comment (`#2f43c9` for `--ink-accent`) → §52b names file, line,
     both live values and the remedy — this is also what proves `src/` is really in scope;
  2. **the palette mis-sliced so light holds the dark values — the real bug** → §52a fails with
     "28 tokens hold the SAME value", naming the `:not([data-theme="light"])` cause;
  3. the scanner blinded (hex regex mutated to match nothing) → the **positive control** fires:
     *"It is blind — a zero result from the real corpus below would mean nothing."*;
  4. a register anchor drifted by one character → **both** halves fire, the use reporting unflagged
     and the entry reporting stale;
  5. the `## Run log` boundary heading lost → the boundary assertion fires, plus the incidental proof
     in the bullet above.
- **Both scanner directions are proven on every run, not just under injection.** The corpus yields
  very few pairs, so a count floor would be weak; instead §52b feeds a known-wrong line and a
  known-right line through the *same* `misattribution()` the corpus uses. A scanner broken to match
  nothing fails the first; one broken to flag everything fails the second.
- **No browser verification, and W-1 is not being skipped silently:** this change renders nothing.
  The diff is `AGENT_LOG.md` prose and one check-script section; `git diff --stat` touches no file
  under `src/`, and the two `src/` files used as injection targets are byte-identical to their
  pre-run SHA-256.

#### Step 5 — the self-check found a real defect, and it was this section's own

**§52's first draft wrote `light --graph-neutral has been #736b61` into its own header comment — a
live attribution in `scripts/`, which §52 does not scan.** The section written to stop stale hexes
being quoted in prose had, in its first draft, quoted one in a place nothing could check.
**Disposition, and it was measured rather than assumed:** extending the scan to `scripts/` was tried
and finds **exactly two** other lines, both the already-registered "other side of the pair" shape —
so widening would have cost four or five register entries to police the checker's own probe data and
message templates. **The value was removed instead of the net widened**, and the boundary plus its
cost is now written into §52's header and into item 126.

The rest of the check: **blindspot register** — `check-blindspot.mjs` green on all 6; grepped the
added lines for Dalio/advice/recommendation strings (0 hits) and no live-looking market figure or
hardcoded current date reaches `src/`; §10.3 untouched. The only hexes added are `#7c8494` (the stale
value under discussion, and the literal the positive control requires) and one `#ffffff` inside a
register *reason* string. **`DECISIONS.md`** — nothing contradicted; the closest call is §31's
verbatim rule, and §52 is built *around* it rather than against it (the run log is excluded, and item
63's edit deliberately removes a figure rather than rewriting one). **Already-done item** — 125 was
open and filed yesterday; §52 does not redo §28/§28b/§51, which check *contrast ratios of live
tokens* where §52 checks *prose agreement with the palette*. **Own verification claim** — the thing
easiest to overstate is "§52 works", and it is five injections each proven to land plus two
always-on controls. **What is NOT proven, and is item 126:** §52 cannot see a cross-line attribution,
an untokened figure ("the amber is 3.2:1"), or a *derived* number — a ratio computed from a stale
hex, which is the shape that actually shipped in two `charts.jsx` comments yesterday.

#### Next

- **Item 126** is the honest residual and is explicitly marked *do not build until a second real
  instance justifies the register cost* — one defect is not a class, which is this run's own finding.
- **Item 27's bar still binds for a sixth visual**; lesson 17 remains the named candidate, again not
  built, because one run should add one. **Items 124, 120, 116, 117** all remain low-priority and all
  are downstream of O-1.
- **Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and
  **O-2** (item 18, an analytics account). Nobody has opened this app.

### 2026-08-27 (scheduled dev-agent) — lesson 17's diagram was specified as two rising lines the prose cannot support, and the lesson's real figure is an identity (item 27)

**Picked item 27**, the sixth money-track visual. W-5.2-legal: item 27 is named on that block's pick
list, and the last five picks (121, 122, 27, 123, 125) contain no item 93, so the one-in-four reserve
is not in deficit. Item 94 was considered and declined on its own instruction — it is explicitly gated
on O-1. Owner tree at open: clean but for the untracked `UIUX/` and `drafts/`, neither touched. HEAD
re-checked before writing this entry and unmoved at `20f45e3`.

#### Step 3.5 — the coverage premise held; the premise about the *chart* did not

- **✅ True as filed.** Re-parsed `LESSON_VISUALS` out of `LessonVisual.jsx` and joined it against
  `lessons.js`'s `track`, with the parser control item 27 records (three ids it must find — 1, 27, 32
  — and three it must not — 17, 9, 40; both halves PASS). Coverage was **economy 5/12, essentials
  3/15, money 2/17**, and lesson 17 is `money` with no visual. The item's own status text still says
  "money is 4/28" and is still stale; the `LessonVisual.jsx` comment now tells the next run to re-run
  the parse rather than quote a count from the backlog.
- **⛔ REFUTED as filed: "lesson 17, where the gap between two rising lines is the lesson."** The
  lesson gives Priya's income at both ends (\$50,000 six years ago, \$75,000 today) and **never states
  her spending or her gap at either end**, and puts the four upgrades "at various points". Two lines
  over six years would have had to **invent the starting gap — the single quantity the whole claim is
  about**, under a caption asserting how that gap moved. The item had named a chart *shape* without
  ever checking it against the prose.
- **The re-decision, on the corrected facts.** Section 2 states the gap at **levels**, exactly, and
  the same in all five languages: \$50,000 against \$45,000 is a gap of \$5,000; \$120,000 against
  \$115,000 is **also** \$5,000. Six verbatim numbers, carrying the lesson's own flagged result — "the
  second person has a materially nicer life, and is exactly as far from every goal the gap funds."
  That clears item 27's bar on the lesson's own prose rather than on an argument built for it: the
  prose can only *assert* the two gaps are equal and ask the reader to subtract twice, while one
  shared scale shows the equality **and** the 2.4x difference in height that makes it surprising, at
  the same moment.
- **A measurement instrument failed first here too.** A regex sweep for the figures in `ko`/`zh`/`ja`
  returned **0 hits for every large number**, which reads exactly like the translations having dropped
  section 2 — item 93's "partial enumeration" defect shape. It was the instrument: CJK uses myriad
  grouping, and the regex was splitting `4만 5천` / `4万5千` into two tokens. Reading the raw text
  showed all five languages carry all six figures. **A negative result from a regex written for one
  script's numerals means nothing about the others.**

#### What shipped

- **`GapColumns` in `charts.jsx`** (~55 lines). Two columns on one shared scale.
  **The gap band sits at the BOTTOM of each column, not the top**, and that is the load-bearing design
  choice rather than a style one: two equal-length segments at different vertical offsets are the one
  comparison a stacked bar cannot support, and equality is this figure's entire claim. On a shared
  baseline they line up directly, and one rule drawn across the plot at their tops turns the claim
  into a single straight line. **The conventional ordering would have drawn the right answer in the
  one arrangement that hides it.** The rule is `graph.neutral`, for the reason `AsymmetryChart`'s
  comment sets out (a reference line the data is read against owes 3:1, and no `--line-*` token
  clears it on any surface in either palette — §28b/§51).
- **`moneyVisuals.js`** — `gapEarners` + five-language title, segment labels, rule label, axis label,
  caption and description. Column labels are **not typed**: they are `usd(e.earns)`, read off the same
  constant that sizes the column, because a hand-typed "\$120,000" beside a column sized from a
  separate number is how a figure comes to disagree with itself — the shape §21 already had to guard
  once on lesson 7.
- **`check-data.mjs` §53**, guarding the claim rather than the parse. **Why this figure needs its own
  section:** every other diagram in the app draws a *difference*, so a broken one draws the wrong
  difference and something looks off. This one draws an **identity**, and a broken identity renders as
  two bands under a rule and a caption that both still say "exactly the same" — at 4% of the plot
  height the difference between \$5,000 and \$5,400 is under a pixel. §53 also checks the *geometry*:
  `GapColumns` positions the rule against the plot box while each band is sized inside its own column
  and floored at `minHeight: 4`, and those agree only while the floor stays slack.
- **Two stale counts corrected in passing** (item 58's rule — a count inside an argument that does not
  need it): `moneyVisuals.js`'s header said "Four lessons get a diagram here" when it was five, and
  `LessonVisual.jsx`'s measured-coverage comment was a run old.

#### Verification

- **`npm test` 0 failures, 2 warnings** (the documented translation baseline, unchanged),
  **`npm run build` clean**, `check-payload.mjs` and `check-blindspot.mjs` both green.
- **§53 proved able to fail, seven ways.** Each injection asserts its anchor exists *and* re-reads the
  file to prove the edit landed, exiting non-zero otherwise; both files were restored from scratchpad
  copies with **SHA-256 verified equal**, never `git checkout --`.

  | # | Injection | Result |
  |---|---|---|
  | 1 | one gap moved \$400 (the sub-pixel failure) | **FAIL** — names both gaps, and (f) names the two figures the lesson never states |
  | 2 | both gaps shrunk, still **equal** | **FAIL** — 1.67% is below the 2.35% at which `minHeight:4` starts holding the bands up while the rule keeps dropping |
  | 3 | incomes brought to 1.8x | **FAIL** — the equality stops being counterintuitive |
  | 4 | `gapRuleLabel.zh` blanked | **FAIL** — names the key and the language |
  | 5 | a third column added | **FAIL** — the rule's height comes from `columns[0]`, so a third would be drawn under a line that does not describe it |
  | A | body scan pointed at a non-existent lesson | **CONTROL FIRES** — "reading the wrong text or no text, so a clean result below would mean nothing" |
  | B | the control's absent-probe set to a numeral that IS present | **CONTROL FIRES** — both halves of the control are live, not just the present half |
- **Live browser verification (W-1), and the `name` form is genuinely unavailable to this run.**
  `preview_start` with `{name: "economic-cycles-dev"}` returned, verbatim: *"Dev servers can't be
  started from unattended sessions (scheduled-task runs and remote-dispatched trees) — nobody is
  present to approve the command."* The Environment note's documented workaround — build, serve
  `dist/` with `/usr/bin/python3 -m http.server`, then `preview_start` with a plain `url` — **worked
  first try** (`navOk: true`). That is the third confirmation; do not re-derive it as impossible, and
  note that it is specifically the `url` form that survives.
- **The claim is measured, not eyeballed.** With the layout-live control from the Environment note
  satisfied (plot 170x309, not the documented 0-width trap), `getBoundingClientRect` gives both gap
  bands **7.08px**, bottom **3685.92** and top **3678.84** — *identical to the hundredth of a pixel* —
  and the rule's bottom edge at **3678.84**, exactly their shared top, spanning the full 309px plot.
  Column heights are 70.83 and 170.00 against the predicted 50000/120000x170 = 70.83 and 170.
- **Four axes swept, not one:** `en` light, `ko` dark at 1.3x font scale, and `es` at 1.3x — the
  longest strings in the set. In every one the two bands stay pixel-identical, nothing inside the
  figure exceeds its width, and `document.scrollWidth` never exceeds the 375px viewport.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot.mjs` green on all 7. Over the 323 added
  lines: Dalio/`principles of` **0**, advice-adjacent verbs **0**. **Control**: `gap` returns **80**,
  so the grep reaches the added text. Four date matches, all four inspected and all four `//` comments
  dating the change in the way the surrounding files already do — none reaches rendered UI, and §2.3's
  own check over the teaching-copy modules (which includes `moneyVisuals.js`) is green. The one
  §10.1 call worth stating: the caption says the gap "is what funds an emergency fund, money invested
  early, eventually the option to work less" — that is the lesson's own sentence, descriptive rather
  than normative, it names no rate or product, the lesson itself adds "that's arithmetic, not a rule
  about how much anyone ought to save", and `illustrationNote` renders beneath the figure.
- **`DECISIONS.md` conflict** — none. No storage, no dependency, no config change; the strings are a
  `.js` content module like the other five figures, and `check-payload.mjs` is green, so the
  per-language split (items 45/48/50) is not undercut.
- **Already-done backlog item** — no. `git log --all -S` returns **0** for `GapColumns`, `earningsGap`
  and `gapEarners`. **Control**: `-S'PreferenceFlip'` returns **2**, so the pickaxe reaches this shape.
- **Own verification claim** — the claim easiest to overstate is "the two bands render identically",
  because a figure that is *nearly* right looks exactly like one that is right at 7px. It is a live
  `getBoundingClientRect` reading with the Environment note's layout-live control satisfied, and it is
  reproducible by re-running the same snippet. The second easiest is "§53 works": seven injections,
  each proven to land before its result was read, with both halves of the body-scan control shown
  firing. **What is NOT proven:** `zh` and `ja` were checked for parity and for arrival, not looked at
  — `ko` is the CJK proxy and `es` the long-string proxy. And §53 checks the figures against lesson
  17's **`en`** body only; a translation could drift its numerals and §53 would stay green.

#### Next

- **Item 127** (new, small): §53 reads only the `en` body, so a translated numeral could drift
  unseen. The four other languages state the same six figures today (measured this run, once the
  myriad-grouping instrument was fixed) — a per-language numeral check is the residual, and it needs
  the CJK grouping handled, which is exactly what fooled this run's first sweep.
- **Item 27 has no named candidate for a seventh, deliberately.** The named-candidate habit is how
  this item went count-shaped twice; a run that wants one must read the prose first, as this one did.
- **Items 126, 124, 120, 117, 116** all remain low-priority and all are downstream of O-1.
- **Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and
  **O-2** (item 18, an analytics account). Nobody has opened this app.

### 2026-08-27 (scheduled dev-agent) — lesson 44 states that its own picture has a second axis, and prose cannot hold two axes at once (item 27)

**Picked item 27**, the seventh personal-finance visual and the fourth on the `money` track. W-5.2
legal: item 27 is named on that block's pick list, and the last six picks (121, 122, 27, 123, 125, 27)
contain no item 93, so the one-in-four reserve is not in deficit. The rest of the open backlog was
re-read rather than assumed, per W-5.2's staleness warning: **116** is blocked on a harness that does
not exist here, **101** is blocked on O-1, **26** is blocked on O-2's analytics, **94** is gated on
O-1 by its own instruction, **117** is an owner judgment call, and **120/124/126/127** are all
low-priority guards with zero known live instances — **120's own text says "do not pick this over
content."** Owner tree at open: clean but for the untracked `UIUX/` and `drafts/`, neither touched.
HEAD re-checked before writing this entry and unmoved at `a7fdf8c`.

#### Step 3.5 — the coverage premise held; one candidate was refuted the way lesson 17 was

- **✅ True as filed.** Re-parsed `LESSON_VISUALS` out of `LessonVisual.jsx` and joined it against
  `lessons.js`'s `track`, with the parser control item 27 records (three ids it must find — 1, 27, 32
  — and three it must not — 9, 40, 5; both halves PASS). Coverage was **economy 5/12, essentials
  3/15, money 3/17**, matching the figures the previous run left. Now **money 4/17**.
- **Item 27 left no named candidate, deliberately, so the money track's prose was read** — lessons
  16, 18-22, 24-26, 28 and 41-44 end to end.
- **⛔ ONE STRONG CANDIDATE REFUTED, and it failed for exactly the reason lesson 17's original framing
  did.** Lesson 16 (asset vs. liability) looked ideal: its own stated test is *"which direction the
  money flows after you buy"*, and direction-over-time is the thing prose cannot draw. But the lesson
  quantifies **only Maya's side** — a \$300 monthly payment, \$10,800 over three years — while Dan's
  tools "paid for themselves in the first few months and have been adding to his income ever since",
  with **no rate and no horizon**. Drawing two diverging cumulative lines would have had to invent
  Dan's slope, which is the same defect the previous run corrected on lesson 17. **The lesson-17
  correction generalizes, and it is now the first test applied to any candidate: does the prose state
  every quantity the shape needs, or only the ones that make it sound plausible?**
- **The lesson that passed states its figure explicitly.** Lesson 43 gives one axis ("That's the real
  axis"), lesson 44 gives the other ("the honest version of the spectrum has a **second axis running
  the other way**"), and lesson 44 closes with *"Hold both halves at once and the picture stops being
  a ladder and becomes a set of trades."* Prose is sequential and **physically cannot hold two axes at
  once** — it delivers them one lesson apart and asks the reader to superimpose them from memory. A
  ladder is one-dimensional and a trade is not, and that difference is a *shape*, which is the one
  thing only a picture carries. This is the first figure in the app whose subject is the
  **dimensionality** of a claim rather than a quantity.
- **All five languages carry both halves, verified by READING the text, not sweeping it** — the
  explicit precaution item 127 filed. ko *"반대 방향으로 흐르는 또 하나의 축"* / *"더 이상 사다리가
  아니라 일련의 거래"*, zh *"第二条方向相反的轴线"* / *"不再是一架梯子，而变成了一组各不相同的取舍"*,
  ja *"逆方向に走るもう一つの軸"* / *"もう梯子ではなく、一連のトレードオフ"*.

#### What shipped

- **`TradeoffPlot` in `charts.jsx`** (~70 lines). A rail with four dots: horizontal position is
  lesson 43's coupling rank, height is what each demands up front. **Labour's dot sits ON the rail**
  and the other three are lifted off it by dashed stems — that placement is the lesson's one absolute
  claim on the vertical axis (*"the only one of the four you can begin with nothing but yourself"*),
  not a styling choice. The stems are the load-bearing mark: the rail alone **is** the ladder people
  already reach for, so the figure draws the ladder and the reason it is not one in the same strokes.
- **⚠️ BOTH AXES ARE ORDINAL, and that is the constraint the whole design is built around.** Lesson 44
  states no numbers at all. It states an order (lesson 43, complete and four-way), a **tendency**
  ("*generally* demands more of something else up front"), and one absolute claim about one item. The
  figure draws exactly those three things: **no tick, gridline or number appears on the vertical
  axis**, because the lesson never ranks a business against a rental against shares and neither may
  the picture. The risk here is not a wrong number, it is a *well-meant* one — a future run sourcing
  real capital requirements would render beautifully and would make a claim lesson 44 explicitly
  declines to make. That is written into `charts.jsx`, `moneyVisuals.js` and §54's header.
- **One color for all four dots, deliberately — a §10.1 call made in the drawing rather than the
  prose.** `graph.green`/`graph.red` would editorialize a lesson whose conclusion is *"Neither column
  is the smart one"*; the caption says the same in words ("neither end of the line is the smart one to
  be at"). `graph.neutral` for rail and stems, per `AsymmetryChart`'s rule: reference geometry the
  data is read against owes 3:1, and no `--line-*` token clears it on any surface in either palette.
- **`check-data.mjs` §54**, guarding the claim rather than the parse — eight assertions, each tied to
  a sentence rather than to a value.

#### The two corrections that came out of writing the guard

- **The five-language prose anchor is real, and it caught two of my own strings.** §54(e) checks each
  language's legend term against **that language's own lesson 42**, the lesson that defines all four
  names. `es` and `zh` were first written as plausible translations of the English labels rather than
  the lessons' own terms — *"Ingresos del trabajo"* where the Spanish prose says *"ingreso laboral"*,
  *"事业收入"* where the Chinese says *"经营收入"*. Both were wrong in the language they were wrong in,
  and **only a per-language check could have found them.** Fixed, along with the four caption and
  description sentences that inherited the same terms.
- **This is deliberately the shape item 127 asked for, one section early.** Item 127 filed §53's
  `en`-only figure check as a residual. §54 does not fix §53, but it demonstrates the fix works and
  **sidesteps 127's instrument trap entirely: these are words, not numerals, so no CJK
  myriad-grouping normalizer is needed.** Item 127 is updated below to point at it as a worked
  precedent rather than an idea.
- **The ordering assertion is `en`-only and says so in its own comment.** Lesson 43 renders the rank
  in each language's own syntax and does not even use the legend's noun for every category (`en`
  says "Rent and royalties" there, not "Passive income"), so a clause match in five languages would
  report confident failures about grammar. (e) is what covers the other four.

#### Verification

- **`npm test` 0 failures, 2 warnings** (the documented translation baseline, unchanged),
  **`npm run build` clean**, `check-payload.mjs` and `check-blindspot.mjs` both green (7/7).
- **§54 proved able to fail, nine ways.** Each injection asserts its anchor is unique, re-reads the
  file to prove the edit landed, and both files were restored from scratchpad copies with **SHA-256
  verified equal** — never `git checkout --`.

  | # | Injection | Result |
  |---|---|---|
  | 1 | labour lifted off the rail (`upfront` 0 → 1) | **FAIL** — names the sentence the 0 encodes |
  | 2 | array reordered, `tradeKindLabels` left alone | **FAIL** — names it as two claims at once |
  | 3 | the tendency dips (passive 3 → 1) | **FAIL** — quotes the sentence running the other way |
  | 4 | `es` label back to a plausible translation | **FAIL** — names the index AND the language |
  | 5 | `zh` label back to a plausible translation | **FAIL** — same, in `zh` |
  | 6 | `ja` end labels truncated to one | **FAIL** — a short array renders an unlabeled dot, not a throw |
  | 7 | second dot within a dot-diameter of the rail | **FAIL** — 9.4u against a 10u dot |
  | A | lesson-42 scan pointed at a lesson that does not exist | **CONTROL FIRES**, per language |
  | B | the absent-probe set to a string that IS present | **CONTROL FIRES** — both halves live |

- **Live browser verification (W-1).** `preview_start` with a plain `url` over
  `/usr/bin/python3 -m http.server` against `dist/` — the Environment note's documented workaround —
  worked first try (`navOk: true`). **Bundle name read back** (`index-B8ToOmlv.js`) and matched what
  `npm run build` had just printed, per the note's rule 4; the earlier build was not being served.
- **The claim is measured, not eyeballed.** With the layout-live control satisfied (rail width > 0,
  not the documented 0-width trap), `getBoundingClientRect` gives labour's dot a lift of **exactly
  0.00px** — on the rail, which is the lesson's absolute claim — and the other three at **48.41 /
  72.62 / 96.82px**, strictly rising, the smallest **4.7x the 10.30px dot diameter**, so none can be
  misread as sitting on the rail. Horizontal spacing 89.27 / 89.26 / 89.27px: an ordinal axis, evenly
  stepped, as intended.
- **Three axes swept:** `en` dark, `es` **light at 1.3x font scale** (the longest strings in the set),
  and `ko` **dark at 1.3x** (the CJK proxy). In every one the lifts are byte-identical, **0 elements
  overflow the figure box**, and `document.scrollWidth` stays at the 375px viewport. The two end
  labels wrap to two lines in `es` and `ko` without colliding — which is why they are HTML and not
  SVG `<text>`, where they would have been clipped.
- **A11y confirmed live, not inferred:** the plot is a single `role="img"` with a 258-character
  `aria-label`; its four SVG numerals sit inside that container so nothing announces them separately;
  the legend's numerals carry `aria-hidden="true"` while the names do not; the `<ol>` carries
  `role="list"`; and §10.1's `illustrationNote` renders beneath the figure in `ko`.
- **§24 caught a real defect in my own code before I did** — the legend `<ol>` set `listStyle: "none"`
  with no `role="list"`, which is backlog item 34's WebKit failure. Fixed in the same run.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot.mjs` green on all 7. Over the 443 added
  lines: Dalio/`principles of` **0**, advice-adjacent verbs **0**. **Control**: `income` returns
  **36**, so the grep reaches the added text. Three date matches, all three inspected and all three
  `//` comments dating the change in the way the surrounding files already do — none reaches rendered
  UI, and §2.3's own check over the teaching-copy modules (which includes `moneyVisuals.js`) is green.
  **The §10.1 call worth stating** is that this figure *ranks* income types, which is the closest any
  diagram here has come to reading as a recommendation. Three things hold it back and all three are
  deliberate: one color for all four dots, a caption that ends "neither end of the line is the smart
  one to be at", and the lesson's own refusal quoted directly above it.
- **`DECISIONS.md` conflict** — none. **Measured, not asserted**: the diff adds **0** occurrences of
  `localStorage`, `fetch(`, `.json`, `new Date(` or `Date.now`. Strings are a `.js` content module
  like the other six figures, and `check-payload.mjs` is green, so the per-language split (items
  45/48/50) is not undercut.
- **Already-done backlog item** — no. `git log --all -S` returns **0** for `TradeoffPlot`,
  `incomeTradeoff`, `incomeKinds` and `tradeKindLabels`. **Control**: `-S'GapColumns'` returns **1**,
  so the pickaxe reaches this shape.
- **US-English house style (item 91)** — checked, and it produced a finding rather than a change.
  My own comment prose said "One colour"; corrected to "color". **"Labour income" is retained
  deliberately**: `lessonContent.money.en.js` says "Labour income" in 8 places, and §54(e) requires
  the legend to use the lesson's own term — "correcting" the label alone would make the figure use a
  word its lesson does not. The `en` content is genuinely inconsistent (`economy.en.js` has "labor"),
  which is a content-wide question and **filed as item 128** rather than smuggled into a figure
  commit. "specialised" in a §54 failure message is inside a quotation of lesson 44 and stays
  verbatim, per item 91's own exception.
- **Own verification claim** — the claim easiest to overstate is "labour's dot sits on the rail",
  because a dot 2px off looks identical at this size. It is a live `getBoundingClientRect` reading of
  **exactly 0.00px** with the layout-live control satisfied, reproducible by re-running the snippet.
  The second easiest is "§54 works": nine injections, each proven to land before its result was read,
  with both halves of the control shown firing. **What is NOT proven:** `zh` and `ja` were checked
  for parity, for term-agreement against their own lesson 42, and for arrival — but not *looked at*;
  `ko` is the CJK proxy and `es` the long-string proxy. And §54(f)/(g) read lesson 43's and 44's `en`
  bodies only — deliberately, for the reason given above, with (e) covering the other four languages.

### 2026-08-27 (scheduled dev-agent) — a style rule with no instrument is a claim, not a property: item 91's sweep had been quietly regrowing for six days (item 128)

**Picked item 128**, the US-English inconsistency filed as a residual by the previous run and marked
"honest priority: low". W-5.2 legal, and deliberately not item 27: the last three picks were all item
27, which is the "direction comes from continuing the tranche" shape W-5.2 exists to interrupt, even
though the one-in-four reserve is not in deficit (no item 93 in the last seven picks). The rest of the
open backlog was re-read rather than assumed, per W-5.2's staleness warning: **116** blocked on a
harness that does not exist here, **101** and **94** blocked on O-1, **26** blocked on O-2, **117** an
owner judgment call, **120/124/126/127** low-priority guards with zero known live instances. Owner tree
at open: clean but for the untracked `UIUX/` and `drafts/`, neither touched. HEAD re-checked before
writing this entry and unmoved at `cb837b4`. Post-commit fingerprint recorded at the end.

#### Step 3.5 — the premise was true, three times too small, and pointed at the wrong conclusion

Item 128 said: `lessonContent.money.en.js` writes "Labour income" in **8 occurrences**, `economy.en.js`
has "labor", priority low. Re-measured:

- **The count was lines, not occurrences.** 11 occurrences across 8 lines in that file. Both figures
  are reproducible; the item quoted the smaller one as if it were the larger.
- **The item's file list was incomplete, and the gap matters because it names the fix's scope.** The
  item said the fix touches "the lesson bodies, the figure's five `tradeKindLabels`, and §54's own
  control surface — all three in one commit". There is a fourth surface: **`quizText.en.js:466`**, a
  rendered quiz explanation. A commit scoped to the item's own three would have shipped half.
- **"Labour" was not the only British spelling, and the item's framing as a one-word nit is what a
  wider sweep refutes.** A 25-pattern scan of English-facing files found **36 real British spellings
  across 11 files** — `specialised` in the same lesson body as the labours, `favour` in a rendered quiz
  answer option, plus `judgement`, `neighbouring`, `theatre`, `honoured`, `honours`, `COLOUR`,
  `Colours`, `licence` and `labours` in code comments.
- **⛔ THE PREMISE CORRECTION THAT CHANGED THE DISPOSITION, and it is about item 91 rather than item
  128.** Item 91 (2026-08-21, owner-directed) swept 123 lines and closed with *"the final whole-repo
  scan returns exactly the 10 intended exclusions and nothing else"* — 6 event-name lines, 2 verbatim
  quotations, 2 dated records. **That claim was not true on the day it was written.** Measured by
  extracting the tree at item 91's own commit (`git archive 9232cd0`, read-only) and running the same
  scan against it: **nine British spellings sat in `src/` outside its exclusion list right then**
  (`theatre`, `COLOUR`x2, `Colours`, `honoured`, `honours`, `judgement`x2, `labours`) plus **seven more
  `judgement` in `scripts/`** — and `colour` is a form item 91's own entry lists as one it fixed. The
  likely mechanism is visible in item 91's entry: its trustworthy final number came from walking
  **1,316 learner-visible strings**, a corpus that contains no comments, while the "whole-repo scan"
  sentence claimed a wider scope than the instrument behind it had.
- **So the honest disposition is not "rename a word".** The class has been regrowing for six days with
  nothing watching it, and the regrowth is the point: lessons 42-44 shipped "Labour income" — the term
  lesson 42 *defines* — into lesson prose, a legend label, a caption and a screen-reader description,
  and no check noticed. **Item 91's own closing advice was "if a guard is ever wanted, the honest scope
  is learner-visible strings only."** This run does the rename AND builds that guard.
- **Instrument control, run before trusting any negative result.** A probe line carrying `organised`,
  `colour` and `licence` was appended to `src/content/sectors.js`, the scan reported all three on the
  right line, and the file was restored from a scratchpad copy with **SHA-256 verified equal**.
- **⚠️ The control also caught the instrument reading nothing.** The first scan's extension list was
  `.js/.jsx/.css/.html` — **`.mjs` was missing, so every check script was silently unscanned** and
  `scripts/` reported "0 occurrences across 0 files", which reads exactly like clean. Fixed and re-run;
  that is where the 7 `judgement` and the rest came from.

#### What shipped

- **The rename, atomically across all four coupled surfaces** — lesson bodies (42/43/44), the quiz
  explanation, the figure's `en` legend label / caption / `aria-label`, the `incomeKinds` key, and
  `check-data.mjs` §54's `EXPECTED_KEYS` and `RANK_CLAUSES[0]`. §54 asserts the legend term appears in
  lesson 42's own body and that lesson 43 still says "Labor income is the most tightly coupled", so a
  half-move fails the build — which is exactly what item 128 predicted and it held.
- **`specialised`→`specialized` and `favour`→`favor`**, plus the §54 failure message that quotes lesson
  44's "specialised skill" — once the lesson moves, the quotation moves with it or stops being one.
- **The 21 remaining British spellings in code comments**, in `src/` and `scripts/`. **One was left
  deliberately**: `check-data.mjs`'s quotation of the *deleted* §3.4 line "One accent colour per
  lesson/phase", which sits one line below a quotation of the *live* §3.1.1 that correctly reads
  "color". Item 91 drew that distinction; this run marks it in place with a `us-english:allow` note
  so the next sweep does not re-derive it.
- **`check-data.mjs` §55** — the guard, ~110 lines. Scope is string **values** reachable under an `en`
  key across the twelve content and locale modules: **1,145 learner-visible English strings**, 16
  pattern families. It deliberately does not read source text, which is what keeps `aria-labelledby`
  (17 occurrences repo-wide), non-English content, and verbatim quotations structurally unreachable
  rather than exempted by a register.
- **`LAUNCH_READINESS.md`** regenerated: the catalog and volume rows moved **150,179 → 150,168 English
  chars**, which is exactly the eleven `labour`→`labor` edits in lesson bodies and nothing else.

#### The three corrections the guard produced on its way in

1. **CONTROL C failed on my own net, first run: it flagged "analyses".** `analys(e|ed|es|ing)` catches
   the correct US plural noun as well as the British verb — they are spelled identically and cannot be
   told apart without reading the sentence. The two unambiguous forms are flagged and `es` is
   deliberately absent, stated in the code. **This is item 91's own predecessor's bug**, which
   over-counted by flagging "analysis"/"analyses"; the control caught it before it could ship again.
2. **§44 failed, and it was a real regression I had just introduced.** The blanket `labelled`→`labeled`
   replace rewrote **`aria-labelledby`** — a real ARIA attribute name — in 8 places in `check-data.mjs`
   and 3 in `a11y-states.js`, which broke §44's `<section>`-naming check into reporting 3 false bare
   sections. Restored. This is the exact false-positive class §55's value-only scope is designed around,
   and it demonstrated itself inside the same run that wrote the comment describing it.
3. **§55's scan was gated on the global `failures` counter**, so any unrelated earlier failure silently
   skipped the entire style sweep — a check that disappears precisely when the build is already unhappy.
   Now gated on a local baseline taken at section entry.

#### An honest consequence worth stating rather than burying

**Translation review coverage fell from 84% to 77% in all four languages (7 → 10 stale lessons), and
that is this run's doing.** The ledger stores a hash of the English source, so any English edit to a
reviewed lesson marks its four translations stale. Lessons 42-44's change was **orthographic only** and
the four translations do not contain the word at all — but the ledger cannot distinguish an
orthographic edit from a semantic one, and **re-marking them would assert a review that nobody
performed**. The published figure was updated to the true value instead. Clearing it takes a re-review
of 12 pairs, which is a run of its own; filed as **item 129**.

#### Verification

- **`npm test` 0 failures, 2 warnings** (the two documented baselines — translation review coverage,
  now reading 77%, and translation completeness, unchanged at 48 abridged pairs). **`npm run build`
  clean**, `check-blindspot` 7/7 green including §2.3 over all 26 teaching-copy modules.
- **§55 proved able to fail, and proved able to stay silent where it must.** Every injection asserted
  its anchor was unique, re-read the file to prove the edit landed, and both touched files were restored
  from scratchpad copies with **SHA-256 verified equal** — never `git checkout --`.

  | # | Injection | Result |
  |---|---|---|
  | 1 | "Labor income" → "Labour income" in lesson 42's body | **FAIL** — names `lessonContent.42.sections[0].body.en` |
  | 2 | "centre-aligned" into the figure's screen-reader `aria-label` | **FAIL** — names `moneyVisuals.tradeDescription.en` |
  | 3 | 5 British words planted in **Spanish** lesson content | **SILENT** — scope proof; item 91's near-miss is unreachable |
  | A | `KNOWN_PRESENT` pointed at an absent phrase | **CONTROL A FIRES** — corpus not reading lesson bodies |
  | B | the `judgement` pattern family deleted | **CONTROL B FIRES** — names the form it can no longer see |
  | C | the `-ise` stem list widened to a suffix rule | **CONTROL C FIRES** — names exercise/compromise/expertise/otherwise/surprise/franchise |

- **Live browser verification (W-1).** `preview_start` with a plain `url` over `/usr/bin/python3 -m
  http.server` against `dist/` — the Environment note's documented workaround — worked first try
  (`navOk: true`). **Bundle name read back** (`index-DW1eKeSv.js`) and matched what `npm run build` had
  just printed, per the note's rule 4.
- **The live scanner was validated in three directions before any of its results were believed**, since
  an empty `britishHits` array is indistinguishable from a broken regex: 13/13 British specimens
  flagged, **0** false positives across 18 US forms including `analysis`/`analyses`/`exercise`/
  `otherwise`, and — the load-bearing one — **a British word appended to the live DOM was found by the
  scan and disappeared when the node was removed**, proving the scan reads the rendered page.
- **Rendered, not inferred.** Lessons 42, 43 and 44 each render with **0 British spellings**; lesson 44
  shows `labor` x6 and `specialized` x1; **`labour` appears 0 times in the entire `documentElement`
  outerHTML**. The figure's three surfaces all read correctly live: legend `"1 | Labor income | 2 |
  Business income | 3 | Passive income | 4 | Investment income"`, the caption's "Only labor income sits
  on the line", and the 486-character `role="img"` `aria-label`. Lesson 43 still renders §54(f)'s exact
  clause "Labor income is the most tightly coupled". Lesson 42's end-of-lesson check was **answered**
  (a real click, read back in a separate call per the Environment note's rule 3) so the revealed
  explanation was scanned too.
- **⚠️ What was NOT done, and why.** An exhaustive live walk of all 44 lessons was attempted and
  **abandoned**: an async navigation loop exceeds the 30s tool timeout and leaves an orphan loop
  mutating `location.hash`, which corrupted a partial result before it was noticed. The page was
  reloaded to clear it. The exhaustive claim rests on §55's static walk of 1,145 strings with its three
  controls; the live pass covers the three changed lessons and the figure. Those are different
  guarantees and they are not being conflated here.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` green on all 7. Over the 263 added lines:
  advice-adjacent verbs **0**, child-facing framing **0**. The one `dalio` hit is a **context line, not
  an added one** — `LAUNCH_READINESS.md`'s §10.2 row, which names Dalio while stating the rule and is
  deliberately unscanned. **Control**: `labor` returns 32 on the same diff, so the greps reach the text.
  Every date on an added line is inside the two regenerated `LAUNCH_READINESS.md` rows or a `//` comment
  dating this change; **none reaches rendered UI**, and §2.3's own check over the teaching-copy modules
  (which includes `moneyVisuals.js` and `quizText.en.js`) is green.
- **`DECISIONS.md` conflict** — none. No `localStorage`, `fetch(`, `.json`, `new Date(` or `Date.now`
  added; content stays `.js` modules; `check-payload.mjs` green, so the per-language split (items
  45/48/50) is not undercut. The one adjacent decision is `DECISIONS.md:154`, which records the
  analytics event as `canceled` and carries its own `us-english:allow` marker as a **specimen** — §55
  reads no Markdown and no identifiers, so it cannot reach it. `src/lib/analytics.js` is untouched.
- **Already-done backlog item** — **yes, partially, and deliberately.** This overlaps item 91. It is not
  a redo: item 91's *learner-visible* result was true and this run does not repeat it, while item 91's
  *whole-repo* claim was false and this run corrects it with the measurement above and builds the
  instrument item 91's own closing line recommended. That is the same shape item 91 took toward its own
  predecessor's "0 hits" claim.
- **US-English house style (item 91) applied to my own added prose** — checked by hand, because §55
  deliberately cannot see comments. It produced one correction: my §55 header said the scope excludes
  "Spanish and French content" and **this app has no French** — five languages, en/es/ko/zh/ja. Fixed.
  Every other British spelling on an added line is either a pattern definition, a control specimen, or
  a quoted defect being named.
- **Own verification claim** — the one easiest to overstate is "`src/` and `scripts/` are now clean of
  British spellings". Precisely: clean against a **25-pattern net over 15 English-facing files**, with
  one deliberate exclusion (the marked verbatim quotation) and `aria-labelledby` excluded as an ARIA
  attribute name. It is **not** a claim that no British spelling of any kind survives — the net is a
  stem list, and extending it is how the next instance gets found. **What is genuinely exhaustive** is
  §55's 1,145-string learner-visible corpus, and only because control A proves it reaches lesson bodies
  and controls B and C prove the net both fires and does not over-fire. The 9-spellings-at-`9232cd0`
  figure is reproducible by anyone: `git archive 9232cd0 src | tar -x` somewhere read-only and re-run
  the scan.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(read **post-commit**, 0 tracked modified / 52 untracked — the `7f8a0a81…` this entry first recorded was the mid-run value with this run's own edits still uncommitted, which is not what the next run should compare against).
**Open and unblocked:** **item 129** (re-review the 12 stale translation pairs this run created — a
clean, self-contained run); **item 130** (§55's comment/script blind spot, filed low); **item 27**
(more lesson figures — but three of the last four picks were item 27, so W-5.2's spirit says let it
rest a run). **O-1 remains the entire critical path** — 44 lessons, 5 languages, 160 minutes of content,
and zero people have ever opened this app — and **O-2 is downstream of it**.

### 2026-08-27 (owner-directed: "do item 129 next") — the 12 pairs re-read rather than re-stamped, and the reading found something the rename had nothing to do with (item 129)

**Picked item 129**, owner-directed, the same day the previous run filed it — the self-inflicted
residual of item 128. HEAD had moved to `d4fb0d3` (**the market-data cron committed while this session
was idle**, the documented sibling-task class in the Environment note); tree otherwise clean but for
the untracked `UIUX/` and `drafts/`, neither touched.

#### Step 3.5 — the premise held, and this time it was worth proving rather than assuming

Item 129 asserts the English change was "orthographic only". That is the entire basis for the work
being a confirmation rather than a fresh translation review, so it was measured, not taken:

- **The English delta since the reviewed state is exactly 12 word-level hunks: 11 `labour`→`labor`
  and 1 `specialised`→`specialized`.** Nothing else — no prose, no numbers, no cross-references.
  Measured with a word-level `SequenceMatcher` over `93fa06e^` vs `HEAD` of
  `lessonContent.money.en.js`, both extracted read-only with `git show`.
- **Only two commits have touched that file since the 2026-08-24 boundary** — `b6c9bc9` (which *added*
  lessons 41-44, dated 2026-08-25, i.e. the reviewed state itself) and `93fa06e` (item 128). So there
  is no third edit hiding behind the rename.
- **The differ carries controls both directions**, because "12 hunks, all orthographic" is exactly the
  shape a broken differ also produces: a planted **prose** change (`"money paid for your time and
  skill"` → `"...time, skill and patience"`) was reported as 2 hunks, and a self-compare reported 0.

#### What was actually done — read, not re-stamped

Item 129's own instruction, and the 2026-08-16 precedent it cites, is that a stale pair is cleared by
**reading** it. All 12 pairs were read end to end against the English: both sections, heading, body,
`takeaway` and `thinkAbout`, in `es`, `ko`, `zh` and `ja` for lessons 42, 43 and 44.

- **11 of 12 clean** on all three axes the reviewer-of-record note names — faithfulness, fluency, and
  blindspot safety. §10.1 in particular survives translation everywhere it matters: lesson 43's
  *"Nothing here says one is better"* lands as `es` *"Nada de esto dice que uno sea mejor"*, `ko`
  *"어느 하나가 더 낫다는 이야기는 없습니다"*, `zh` *"没有哪一项在说某种收入更好"*, `ja`
  *"どれかが優れているということではありません"*; and lesson 44's refusal — *"nothing in this track
  will tell you which to pursue"* — is intact in all four.
- **The four legend terms still match each language's own lesson 42**, which is `check-data.mjs`
  §54(e)'s requirement and the thing an English rename could plausibly have desynchronized: `es`
  *ingreso laboral*, `ko` *노동소득*, `zh` *劳动收入*, `ja` *労働所得*. The rename could not touch them,
  and now that has been confirmed by reading rather than inferred from the check being green.
- **⛔ ONE REAL DEFECT FOUND, and it has nothing to do with the rename** — which is the argument for
  reading over re-stamping, made concrete. `ja` lesson 43 wrote **「急を要すもの」**, using the archaic
  `要す` where modern Japanese takes the attributive `要する`. **Confirmed against the app's own
  Japanese rather than from memory**: `lessonContent.essentials.ja.js` writes 「勤続年数を要する
  ベスティング条件」 — the same attributive position, conjugated correctly — so the corpus contradicted
  itself and the money-track instance was the outlier. Fixed to 「急を要するものに感じられる」.
  **A re-stamp would have vouched for it.**

#### Two observations recorded and deliberately NOT changed

Recorded because a review that silently edits to taste is not reviewable, and because both are
judgment calls a later reader may take differently:

- **`ko` lesson 42 renders "the four thousand dollars" as 「이 1,000달러는」** (this $1,000) rather than
  the aggregate. `zh` resolves the same sentence as 「这四笔各自1,000美元的钱」 and `ja` as
  「この合計4,000ドル」. The Korean is arguably *more* precise — each person's $1,000 arrived by one
  mechanism, the four together by four — and no figure is misstated. Left.
- **`zh` lesson 44 renders "A wage is unusually well protected" as 「工资受到的保护，比人们通常意识到
  的要多得多」** ("far more than people usually realize"). That is a mild drift: the English compares a
  wage to the other three, the Chinese makes a claim about the reader's awareness. It carries no
  economic claim the lesson does not make and is §10.1-safe. Left, because rewriting it is a register
  preference rather than a correction, and over-editing a language whose only check is this review is
  the larger risk.

#### Verification

- **Coverage restored: 77% → 84% in all four languages, 10 stale → 7.** The remaining 7 (lessons 1, 4,
  30, 33, 37, 39, 40) are **pre-existing and outside item 129's scope** — they were stale before item
  128 ran, dating to reviews on 2026-08-14/15.
- **The ledger diff is exactly the 12 intended entries and nothing else**, verified by diffing the
  parsed JSON key-by-key against a pre-run copy: 12 changed, 44 lessons before and after.
- **`npm test` 0 failures, 2 warnings** (the two documented baselines), **`npm run build` clean**,
  `check-blindspot` 7/7.
- **`LAUNCH_READINESS.md` moved twice, both times to a value the build computed**: the coverage
  sentence to 84%/7-stale, and the volume sentence **`ja 63,352 → 63,353`** — exactly the one character
  the 要する fix added, which is its own confirmation that nothing else in the Japanese corpus moved.
- **Live browser verification (W-1).** Fresh `dist/` served over `/usr/bin/python3 -m http.server`,
  `preview_start` with a plain `url` (`navOk: true`), **bundle name read back (`index-CmxfuKK8.js`)**
  and matched the build just run, per the Environment note's rule 4. With `ecycles_lang` seeded to
  `ja`, lesson 43 renders under `<html lang="ja">` with **「急を要するもの」 present and the old
  「急を要すもの」 absent**.

#### Step 5 — adversarial self-check

- **Blindspot register** — no regression. `check-blindspot` green on all 7. Over the 38 added lines:
  Dalio/`principles of` **0**, advice-adjacent verbs **0**, child-facing framing **0**. **Control**:
  `reviewedDate` returns 12 on the same diff, so the greps reach the added text. No date reaches
  rendered UI — the only rendered change is one Japanese character.
- **`DECISIONS.md` conflict** — none, and this run is an instance of a decision rather than a
  departure from one. P-4 option (a) is the ledger; every mark is `method: "ai"`, which is the field
  `translation-review.mjs`'s header says exists precisely so an eventual human or professional pass
  can still supersede these entries rather than find them looking already-done.
- **Already-done backlog item** — no. Item 129 was filed by the previous run for exactly this scope,
  and the 7 remaining stale lessons were deliberately left rather than swept in.
- **Own verification claim** — the reproducible half is fully reproducible: the 12-hunk orthographic
  proof, the ledger key-diff, the character-count movement, and the live render. **The half that is
  judgment is the review itself, and it must not be overstated.** Per the reviewer-of-record note in
  `scripts/translation-review.mjs`, this is Claude reading same-family LLM output — real content
  review, but **not** equivalent to a native-speaker or professional pass, and the correlated-blind-spot
  caveat in that header applies in full. **The honest claim is that these 12 pairs were read by a
  careful non-native reader who found one real error in them, not that they are now natively verified.**
  Human review share remains **0% in all four languages**, which is O-3's standing question for the owner.

#### Next run

`npm run owner-tree -- --expect c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`
(post-commit, tree clean). **Open and unblocked:** the **7 remaining stale lessons** (1, 4, 30, 33, 37,
39, 40) — now the only staleness left and a natural one-language-per-run block, filed as **item 131**;
**item 130** (§55's comment blind spot, low); **item 27** (more lesson figures). **O-1 remains the
entire critical path** and **O-3** — a large volume of unreviewed machine translation, human share 0%
and this run did not change that — is the owner decision this run's own caveat points back at.
