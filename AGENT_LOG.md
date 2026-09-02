# Agent Log — Economic Cycles App

This file is the memory of the autonomous development agent that runs on this repo on a schedule the owner sets (the cadence is the owner's lever and moves; it is deliberately not restated here, because a number written down here goes stale silently). Each run reads this file, picks the single highest-value backlog item, implements it, verifies it, and appends a dated entry below. Do not delete history — prune the backlog as items complete, but keep the run log intact.

## App summary (rewritten 2026-09-01 — the fourth rewrite, and the first that DELETES the counts rather than correcting them)

⚠️ **Before you put a figure in this section, read this.** The version it replaces was written
2026-08-04 and said "17 lessons, 12 macro/cycle-theory + 5 personal-finance" and "17 sequential
unlocking lessons" — through the 2026-08-07 track split, the 2026-08-14 renumbering and the 2026-08-18
product reversal, for four weeks, in the document every run reads first. Measured 2026-09-01: **44
lessons in three independent tracks**, and **14** lessons carry an inline figure where this said four.
The defect is not that nobody corrected the numbers; it is that they were **retyped here** when
`npm test` prints them. **So: no count in this section that a script generates.** Read `npm test`'s
readiness line (lessons / en chars / minutes), `check-log-size.mjs`'s MEASURED line, and §2.5's track
ranges, which are generated and checked every run.

**The product, in one paragraph — getting this wrong has cost more runs than any bug in the app.**
Three independent curricula, not one path (§2.5). **How the Economy Works is the main path**: a new
install opens on "Transactions", not "Budgeting". **Your Money is the product** — judgment, not
procedure: the spending and investing decisions that mechanics do not settle. **Essentials is optional
mechanics**, kept in full, gating nothing and gated by nothing. Lessons gate sequentially **within** a
track only. The 2026-08-18 reversal that put economy first is in `DECISIONS.md`; **a summary that
describes one sequential chain is describing the app as it was before 2026-08-07.**

`economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` at the repo root are reference material only —
measured 2026-09-01, **zero import statements under `src/` name either** (the one mention is a comment
in `App.jsx` saying exactly this). See "Notes for future runs" below for what each is.

**Structure under `src/` — the shape and the invariants, deliberately not a file list**, because a
list rots on the next file added and this section has now done that twice. `ls` is the source of truth.

- **`App.jsx`** — the shell: three bottom tabs (**Learn**, **Review**, **Reference**), a sticky header
  with the five-language picker (en + Beta-labeled es/ko/zh/ja, §10.4), a first-run disclaimer modal
  (§10.1) with a focus trap that must be dismissed before first use, and a pushed lesson-reader view.
  Hash routing (`#/learn`, `#/practice`, `#/reference`, `#/lesson/<id>`) is owned entirely by
  `lib/deepLink.js` — two call sites here and nothing else. **A URL does not unlock a lesson**;
  `DECISIONS.md` has the reasoning and the owner-facing cost.
- **`theme.js`** — the type scale, spacing, and the semantic *names* for color. ⚠️ **Color VALUES are
  not in this file.** They are CSS custom properties in `index.css` (a light and a dark palette);
  `theme.js` exports `var()` references and holds no hex at all, which is what lets the app follow the
  system setting. AA on every ink-on-surface pair is enforced by `check-data.mjs` §28, and no component
  carries a hex — measured 2026-09-01 at zero across every `.js`/`.jsx` under `src/`.
- **`lib/`** — pure logic, no JSX: app state, the Leitner scheduler (`review.js`, keyed by an **opaque
  question id** since 2026-09-01 and never by array position), deep links, the local analytics sink,
  chunk-load recovery, the lesson-id migration, and the market-data adapters that only the offline job
  calls — never the browser. **All client state is `localStorage` and nothing else** (`DECISIONS.md`):
  completed lessons, the review schedule, the streak, font scale, theme. No account, no sync.
- **`components/`** — UI primitives, icons, the chart library, the per-lesson figures
  (`LessonVisual.jsx`), the quiz question, the glossary term chips, the error boundary, and the
  interactive policy simulator.
- **`screens/`** — `Learn` (the path), `LessonReader` (lesson body, an inline figure on the lessons
  that teach one, an end-of-lesson check on every lesson), `Practice` (the spaced-review queue fed by
  those checks), and `Reference`, whose sub-screens live in `screens/reference/`: glossary and term
  detail, market signals, sector performance, parent guide, settings/about.
- **`content/`** — plain `.js` modules, five-language parity enforced by `npm test`. Lesson bodies are
  split per track and per language (`lessonContent.<track>.<lang>.js`); the quiz is split the same way,
  `quizMeta.js` holding the answer key and the stable question ids and `quizText.<lang>.js` the prose.
  Glossary, glossary-to-lesson links, kids content, market teaching copy, sectors, economic signals,
  money figures and policy scenarios each have their own module.
- **`locales/`** — one file per language, app chrome only; lesson prose lives in `content/`.

**Market data.** The owner's scheduled task writes `public/data/market.json` once a day via
`scripts/fetch-market-data.mjs` — no client-side key, no live call from the browser. Sector performance
ranks the S&P sectors against SPY by the owner's own relative-strength formula; the macro readings come
from FRED. Data older than `STALE_AFTER_DAYS` is suppressed rather than shown as current: §2.3's
standing rule is about *fake* freshness, not about numbers.

`LAUNCH_PLAN.md` (v2) is authoritative and supersedes `Economic_Cycles_Launch_Plan.docx`.
`DECISIONS.md` holds the standing architectural choices (Vite-not-Expo, `.js`-not-JSON content,
`localStorage`-only state, the market-data pipeline); `LAUNCH_READINESS.md` scores the gates.

**Blindspot register — §10 IS the register and this is a pointer, not a copy.** Only the first three
of its entries are closed. **10.1** (investment-advice adjacency) and **10.2** (Dalio dependency) are closed and
are **standing rules, not settled history**: check any lesson or market-copy change against them, and
run `npm run check-blindspot` before committing one. **10.3** (kids/COPPA) ships parent-facing and is
closed on that basis, but is reopened as a *question* — a genuinely child-facing product is a legal and
store-classification decision, not a UI one, and no run may make it. ⚠️ **10.4 through 10.10 are OPEN,
and the paragraph this replaces did not say they exist.** 10.8 ("process mass exceeds product mass")
and 10.10 ("nothing owns getting this in front of one person") are what W-6 below is about.

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
✅ **A FOURTH PASS RAN 2026-09-01 (scheduled dev-agent).** 2026-08-30 and 2026-08-31 moved (18
entries, 181,059 b), run log **246,225 → 65,166 b** (98.5% → 26.1% of warn), file **571,669 →
390,610 b**. The date clause was a **no-op for a sixth time** — the most recent review boundary is
2026-08-30 and nothing in the log predated it — so the trigger acted on was again the measured warn
budget, at **0.34 runs of headroom**. **Two days were moved where one would have cleared the budget**,
and that is a judgment a future pass should repeat or refuse deliberately rather than inherit: one day
buys about 7 runs at the measured +11,052 b/commit of writing, which at this cadence is half a day and
makes the pass a daily chore; two days buy **16.7**. Nothing is deleted either way, and the floor is
untouched at **325,444 b** (item 115, the owner's).
**Containment: 18/18**, re-derived from `git show HEAD:AGENT_LOG.md` per the recipe above rather than
from the transform's own buffer, **with two plants, both fired**: one character changed inside a moved
entry → 17/18, exit 1; a whole 6,058 b entry deleted from the archive → 17/18, exit 1. Both plants were
written to scratchpad copies of the archive and never to the file.
⚠️ **The archive's own title had been stale since the 2026-08-29 pass** — it read
`(2026-08-01 → 2026-08-28)` while the file held entries through 08-29. Corrected to 08-31 this run.
That title is the one line in that file every reader passes without reading, which is why it rotted
through two passes that each had it open.
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

163. **[UX/A11y — filed 2026-09-02 by the run that put the unit on the balance-sheet chart, as three
    things that run SAW on the same walk and deliberately did not fold into the same commit.]
    All three are live and measured; none is a guess.**
    - **(a) The Review recap shows a green success check over "0 of 1 correct".** Measured: answer
      the only queued question wrong → `Practice.jsx`'s recap card renders an unconditional
      `<Icon name="check">` at `ink.ok` above "Review complete". The per-question rows below it
      *do* branch (`r.correct ? "check" : "x"`, `ink.ok : ink.bad`), so the screen contradicts
      itself in two inches. **This is a judgment call, not a falsehood** — "Review complete" is
      true, and the file's own comment argues the retrieval attempt matters more than the grade, so
      a tick meaning "session done" is defensible. Whoever picks it is deciding whether the icon
      reports *completion* or *result*; if result, `correctCount === 0` at minimum should not be a
      green tick. Note this is NOT item 117's defect — that one was the Practice *landing* card
      with `review = null`, closed 2026-08-26.
    - **(b) The Market Dashboard's heading outline names 4 of its 7 blocks.** Measured live:
      `h1 Market Dashboard`, then `h2` for *How Rate Changes Affect Assets*, *Yield Curve Shapes*,
      *Money Supply (M0, M1, M2)*, *Key Principles* — and **nothing** for the cycle curve at the
      top, the QE/QT pair, or the balance-sheet figure. A reader navigating by heading skips three
      sections, one of which is the chart this run just fixed. Same class as item 106 and the two
      `<h2>`s added to `LessonReader`; the fix is the same shape (mark up the label that is already
      there), but two of the three blocks are `Note`/`figcaption` primitives shared elsewhere, so it
      is not a one-liner.
    - **(c) `Bar` renders `9` where its own description says `9.0`.** Four of the five values carry
      one decimal and the fifth does not, because `9.0 === 9` in JavaScript. A `Bar`-wide decimal
      convention (or a formatted string in the data) would fix it; a `.toFixed(1)` inside `Bar`
      would be wrong for a future integer-valued chart.
    - **W-6.2 rule 3, answered:** (a) "a learner who got everything wrong was congratulated with a
      green tick"; (b) "three sections of the Market Dashboard were unreachable by heading
      navigation"; (c) "one bar in five was labeled to a different precision than its siblings".
      All three are things a person would meet. **No check is proposed for any of them** — W-6.3's
      number (`scripts/` at 2.3x `src/`) says a regex is the wrong instrument for all three, and
      (a) is a decision rather than a defect. **Honest priority: (b) medium, (a) low-and-owner's,
      (c) low.**

162. **✅ DONE 2026-09-02 (owner-directed: "do the ko/zh/ja glossary translations too"), the same
    day it was filed — the O-3 call this item said it needed, made for this corpus.** All 42 true
    positives completed across ko/zh/ja (45 strings including the three VIX bands), §67 reads
    **0/336 abridged**. **The durable part is the instrument's false-positive rate, now recorded as
    data:** after the fix, **30 of 336 pairs (9%)** still scored under threshold and every one was
    READ and is complete — the discursive item-35 English rendered in compact CJK. They live in §67's
    `READ_COMPLETE` with the code-point length each had when read; **control 6** proves a listed pair
    cut to 20% FAILS rather than hides, and a plant on the live file confirmed it (36 → 16 cp, exit 1).
    ⚠️ **Read this before applying the same method to item 161's kidsContent remainder:** if the
    parent guide's remaining 21 ko/zh/ja pairs are the same shape, some of them will turn out to be
    complete compact translations too — read each, do not pad. Original filing kept below as the
    dated record.
    [Content — filed 2026-09-02 by the scheduled dev-agent that MEASURED it, with the Spanish
    half FIXED in the same commit. 58 LIVE instances, so W-6.2 rule 2's "note under its parent" does
    not apply — that rule parks residuals with zero live instances, and this is not one.
    Honest priority: MEDIUM for ko/zh/ja, and the remainder is an O-3 decision, not a run's.]
    `glossary.js` ships translated DEFINITIONS that are present, non-empty, and materially shorter
    than the English they translate — and §4 has always reported the file as complete.**
    **This is item 161's defect in a third corpus, found by pointing §66's method at it.** Do not
    quote the figures below — `check-data.mjs` §67 re-derives them on every `npm test`; read the
    live line (W-5.5).
    **`entry.f` renders on TWO screens** — the Glossary list (`Glossary.jsx`) and the term-detail
    screen (`TermDetail.jsx`) — in whatever language the learner has selected. This is not a
    latent corpus.
    **The mechanism is authoring date, not language, and the evidence is the cross-language
    overlap: 14 paths flagged in ALL FOUR languages at once**, and they are exactly the original
    macroeconomic cohort (Bubble, CPI, Credit, Credit Spread, Deflation, Deleveraging, Fed Funds
    Rate, GDP, Inflation, PMI, Productivity Growth, QE, QT, Yield Curve). The personal-finance
    entries added 2026-08-16 (item 35) are complete clause-for-clause in every language; the macro
    entries carried over at the 2026-08-01 split were written as terse glosses and never grew.
    `glossary.js`'s own header already said the file has two vocabularies of two different vintages
    — nothing had ever measured what that cost the translations.
    **A second, narrower mechanism rides along: an English-only edit that never propagated.**
    `Credit.f`'s "monetary base (M0)" clause was added 2026-08-26 by item 114 in English alone,
    which is why the Spanish scored 0.58 while the rest of its sentence was a full translation.
    **Closed in the filing commit: Spanish, 15 strings, es 14 flagged → 0.** Three of its losses
    changed what the app teaches rather than only how much: `Deleveraging` read *"Cuando la deuda es
    excesiva. 4 herramientas."* — announcing four tools and naming none; `Inflation` read *"Cuando
    los precios suben"*, the word restated with both the mechanism and the Fed's ~2% target gone;
    and `Bubble` dropped *"pushing prices far above fair value"*, which is the part that makes it a
    bubble. `Deflation`, `Fed Funds Rate`, `PMI`, `QE`, `QT`, `Yield Curve` and `Credit Spread` had
    each lost their second, interpretive sentence the same way.
    **OPEN: 58 pairs in ko/zh/ja** (read the live §67 line for the current split and the worst
    units). **The fix is new prose in three unreviewed languages, which is squarely inside O-3** —
    a run must not enlarge that surface unilaterally. The Spanish above was completed because it is
    one language and its omissions were changing meaning, and even that is inside O-3's scope to
    re-affirm or cap. This is item 161's precedent applied deliberately, not a new licence.
    ⚠️ **The ratio has BOTH error directions here too, and this run found a false negative in its
    own corpus rather than inheriting the warning from §66.** `VIX` es scored **1.00** — a clean
    ratio — and was still incomplete: the English carries three bands (below 15 / 25-35 / above 40)
    and every one of the four translations carried two, dropping the middle "fear" band. It was
    fixed alongside the flagged set, and it is the reason this item says **an unflagged pair is not
    a certified pair.** The same shape is likely to remain in ko/zh/ja and §67 cannot see it.
    ⚠️ **Do NOT re-use §66's `MIN_EN * 2` gap heuristic here.** It fits `kidsContent` (shortest
    body 95) and fails on this corpus for no defect at all — the glossary's longest short name is
    35 code points and its shortest definition is 70, so 40 sits in a real and empty gap that 80
    would have condemned. §67's control 5 asserts the gap **this** corpus has. Copying a threshold
    across corpora is the drift this log keeps catching in figures; it applies to constants too.
    **§67's known blind spot, asserted as a control rather than left as prose:** a corpus abridged
    EVENLY in every unit moves its own p90 and reads as clean. There is no recorded baseline for
    `glossary.js`, so nothing here would catch slow uniform decay.

161. **✅ DONE 2026-09-02 (owner-directed: "do item 161's remaining ko/zh/ja pairs too") — the O-3
    call this item said it needed, made for this corpus.** §66 reads **0/192 abridged**. Reading the
    21 flagged pairs found **18 true positives and 3 complete translations**; reading the UNFLAGGED
    side found **7 more abridged pairs the ratio never caught** — including the exact one this item
    predicted (ko `13-17.lessons[1]` dropping the 12-24 month lag) and zh `5-8.lessons[1]` dropping
    *"That's like inflation!"*, the blurb's entire point, at a ratio the check called clean. All 25
    completed. **9 pairs remained under threshold after the fix and all 9 are complete** — recorded in
    §66's `READ_COMPLETE` with the length each had when read; control 6 proves a listed pair cut to
    20% FAILS (plant on the live file: zh `13-17.parentTip` 26 → 9 cp, exit 1). **Transferable:** on
    both corpora audited today the ratio's misses were in BOTH directions and roughly equal in count
    — the reading, not the ratio, is the measurement. Original filing kept below as the dated record.
    [Content — filed 2026-09-01 by the scheduled dev-agent that MEASURED it, with the Spanish
    half FIXED in the same commit. 21 LIVE instances, so W-6.2 rule 2's "note under its parent" does
    not apply — that rule parks residuals with zero live instances, and this is not one.
    Honest priority: MEDIUM for ko/zh/ja, and the remainder is an O-3 decision, not a run's.]
    `kidsContent.js` ships translated strings that are present, non-empty, and materially shorter
    than the English they translate — and §5 has always reported the file as complete.**
    **Measured 2026-09-01 over the 48 measurable units × 4 languages: 38 of 192 pairs carried under
    70% of what a full translation into the SAME language carries.** Do not quote that figure —
    `check-data.mjs` §66 re-derives it on every `npm test`; read the live line (W-5.5).
    **The mechanism is authoring date, not language.** The strings written 2026-08-07 — each band's
    first three blurbs, plus every `activity` and `parentTip` — were authored with condensed
    translations; everything added 2026-08-15/16 (the `why` fields, the money-skills blurbs) is
    translated in full. §5 checks presence and non-emptiness, so it certified all of it, and §33's
    completeness metric reads `lessonContent` only and has never seen this corpus.
    **Closed in the filing commit: Spanish, 19 strings, es 17 flagged → 0.** It was the systematically
    abridged language and three of its losses changed what the app teaches, not just how much:
    `9-12.lessons[2]` dropped *"If you earn more than the loan costs"*, leaving the Spanish blurb
    teaching that borrowing for a growing business is simply GOOD debt; `13-17.lessons[2]` dropped
    *"it created a deleveraging — the first in 75 years"*, the concept the blurb exists to name; and
    all three `parentTip`s lost the technique they were telling the parent to use.
    **OPEN: 21 pairs in ko/zh/ja** (read the live §66 line for the current split and the worst units).
    They concentrate in the 5-8 band's first three blurbs and the three `activity` strings — e.g.
    `5-8.lessons[1]` drops *"That's like inflation!"* in all four languages, which is the blurb's
    entire point. **The fix is new prose in three unreviewed languages, which is squarely inside O-3**
    (the standing owner decision on unreviewed machine translation at scale). A run must not enlarge
    that surface unilaterally; the Spanish above was completed because it is one language and its
    omissions were changing meaning, and even that is inside O-3's scope to re-affirm or cap.
    ⚠️ **The ratio is a screening proxy and has BOTH error directions — read every flagged pair
    before believing it.** False positives on short units: `13-17.parentTip` scores zh 0.23 and is a
    complete translation; the three `title`s scored 0.35 and are complete, which is why §66 excludes
    units under 40 code points and controls that exclusion. False negatives too: `13-17.lessons[1]`
    ko silently drops *"But it takes 12-24 months to feel the change!"* and never flagged.
    **§66's known blind spot, asserted as a control rather than left as prose:** a corpus abridged
    EVENLY in every unit moves its own p90 and reads as clean. §33's recorded baseline, not §66, is
    what would catch slow uniform decay; `kidsContent` has no such baseline.

160. **[Content/QA — filed 2026-09-01 by the scheduled dev-agent that MEASURED it, with 40 of 46
    questions affected at filing and four of them fixed in the same commit. Honest priority: HIGH for
    a learning app, and this is not a residual — nothing in the previous run's entry points at it.]
    The quiz can be beaten without reading a single lesson by always tapping the LONGEST option.**
    > ⛔ **PREMISE CORRECTED 2026-09-01 by a later run, by measurement before any edit (step 3.5).
    > The item's disposition below — "the remaining ~36 split into two kinds" — is NOT the partition
    > the corpus has, and the correction changes what is left to do here from a trimming queue into a
    > single owner decision.** Re-measured with four controls (a length reader that must call a
    > planted strictly-longest option beatable, must reject a tie, must reject a short correct option,
    > and a per-language entry-count check against `quizMeta`):
    > - **The defect is corpus-wide, not concentrated in a few chatty options.** 38 of 46 questions
    >   are beatable in at least one language and **29 in all five**. In most of them the correct
    >   option is **1.5-2.5x the whole distractor band**, not a sibling with one clause too many.
    > - **The real cause is an authoring habit, and it is the DISTRACTORS.** The correct option is
    >   written as a complete statement; the three foils are written short. That is why trimming does
    >   not generalize: for most questions the correct option's irreducible content — the concept plus
    >   the feature that distinguishes it — is already longer than the longest distractor.
    > - **⚠️ And naive trimming INVERTS THE TELL, which the filing run named as a risk and the
    >   arithmetic confirms.** The target is not "shorter"; it is *inside the distractor band*, so the
    >   correct option is neither the strict maximum nor the strict minimum. Worked from the measured
    >   bands: trimming the obvious trailing clause off the correct option makes it the **strictly
    >   shortest** in `q019` (en 82 → 36 against a [44-46] band), `q040` (127 → 52 against [74-86])
    >   and `q012` (95 → 25 against [32-62]). Each of those three "fixes" would have moved the
    >   longest-option rate down and the shortest-option rate up by the same three questions.
    > - **A mechanical trailing-clause cut fits inside the band in ALL FIVE languages for exactly
    >   ONE question in the corpus: `q030` (lesson 16), which this run shipped.** (The cutter's
    >   *positives* are sound; its negatives are weak — its delimiter list is Latin/CJK-incomplete, so
    >   "no fit" means "none found by this cutter", not "none exists".)
    > - **The CJK corpus has a structurally higher floor and no trim can reach it.** The `ko`/`zh`/`ja`
    >   distractors are far terser than their English (`q007`'s are **4-9 code points**: 政府加税,
    >   银行停贷), while the correct option must still name a mechanism. `q007` is the worst ratio left
    >   in the corpus (en 2.61x) and is **not trimmable in any of the three**.
    > **So the remainder is not (a)-plus-(b): it is one thing, and it is O-3's.** Closing the gap means
    > lengthening distractors — new prose in four unreviewed languages, across roughly three dozen
    > questions. That is the standing owner decision on unreviewed machine translation at scale, and a
    > run must not enlarge that surface unilaterally to move a metric. **Do not pick this item as a
    > trimming pass; there is nothing left in it that trimming can honestly reach.**
    > ⚠️ **Second correction, mechanical but load-bearing: every question label in this item is an
    > ARRAY POSITION, not a question.** "q12/q21/q37/q43/q40/q41" are 0-based indices into `quizMeta`
    > and resolve to ids **q013, q022, q038, q044, q041, q042** (lessons 39, 8, 24, 42, 27, 28 — the
    > lessons this item names, which is how the reading was confirmed). Read as stable ids they name
    > **different questions in every case** (q012→L38, q021→L7, q037→L23, q043→L41). This item was
    > written the same day `review.js` stopped keying learner state by array position for exactly this
    > reason; the labels are left as-is above because they are a dated record (§31), and this line is
    > the translation. **Cite questions by `id` from here on.**
    **Measured 2026-09-01 over the 46 shipped questions, five languages, controls in both directions:
    tap-the-longest scored `en 40/46 = 87.0%`, `es 39/46 = 84.8%`, `ko 39/46 = 84.8%`,
    `zh 38/46 = 82.6%`, `ja 38/46 = 82.6%`, against a `25.0%` chance baseline for four options.**
    After this run's four fixes: `en 78.3%`, `es 76.1%`, `ko 76.1%`, `zh 73.9%`, `ja 73.9%`. Both
    figures are re-derived by `check-data.mjs` §65 on every `npm test`, so **do not quote the numbers
    above — read the live line** (W-5.5).
    **Why this is a real defect and not a curiosity.** The project already treats exactly this class as
    a defect worth an out-of-priority fix: on 2026-08-02 the weekly reviewer found 12 of 13 correct
    answers sitting at option index 0 — tap-the-first scored **92%** — and moved the option strings to
    de-skew it. §3's degenerate-answer warning is the guard that came out of it, and its own message
    says *"a user who always taps that option would score suspiciously well."* **§3 guards the strategy
    that was found, not the class it belongs to.** The index spread has been clean ever since (28.3%,
    well under §3's 50% line) while a second channel scored 87% and nothing looked at it. The quiz
    feeds both the end-of-lesson check (§3.2's "small win") and the whole Leitner review queue
    (`src/lib/review.js`), so a learner can complete lessons, build a streak and fill a review schedule
    without the checks ever measuring understanding.
    **The cause is structural, which is why the fix is a style rule and not a list of edits.** The
    correct option tends to carry its own justification — *"…, since its policyholder absorbs more of
    the smaller losses"* — while the distractors stay bare assertions. **That justification is already
    in the `explain` field, which the learner is shown the moment they answer**, so in the gratuitous
    cases it is duplicated text that also leaks the answer. **The rule: an option matches the shape of
    its siblings; the reasoning belongs in `explain`.**
    **Done in the filing commit (4 questions × 5 languages = 20 edits), chosen because each is right on
    its own merits and is a clause DELETION in all five languages, never new prose:**
    - **q12 (lesson 39)** `VIX (Volatility Index)` → `VIX`. It was the only option of four with a
      parenthetical expansion, against bare `GDP`/`CPI`/`PMI`; ratio 7.33x, the worst in the corpus.
      Nothing is lost — `glossary.js` defines VIX in all five languages and the `explain` opens
      *"The VIX measures expected market volatility."*
    - **q21 (lesson 8)** dropped *", since its policyholder absorbs more of the smaller losses"*. The
      remainder is now **exactly** its sibling's length in all five languages (en 43/43, es 52/52,
      ko 22/22, zh 12/12, ja 15/15) — the two options differ only in `lower`/`higher`, which is the
      whole question.
    - **q37 (lesson 24)** dropped *", since a 'need' doesn't require justification"*.
    - **q43 (lesson 42)** dropped *", which differ in what they demand and what can go wrong"*.
    **NOT done, deliberately, and the reason is the next holder's decision to make, not a run's.**
    The remaining ~36 split into two kinds:
    - **(a) Already well-designed, leave alone.** q25 and q27 give *every* option a "because…" clause,
      so the shape is uniform and the correct one is only marginally longer — in `ja`, q27's correct
      option is not even the longest. **Trimming these would break the uniform shape and just invert
      the tell**; §65 measures the shortest-option strategy for exactly that reason, and this run's
      edits left it flat (en 2.2%, ko 0.0%).
    - **(b) The head of the list, q40 (201 chars) and q41 (174), where the honest fix needs new
      distractor prose in four unreviewed languages.** Their distractors are short `Name — one clause`
      glosses and the correct answer's concept name is itself long (*"Overconfidence after a lucky
      outcome"*, *"Loss aversion"* plus its asymmetry), so trimming to match costs the concept name
      while lengthening the distractors means **writing new machine-translated prose in es/ko/zh/ja**.
      That is squarely inside **O-3** (the standing owner decision on unreviewed machine translation at
      scale) and a run must not enlarge that surface unilaterally to move a metric.
    **Guard shipped in the same commit: `check-data.mjs` §65**, five scorer controls asserted in both
    directions (correct-always-longest → 100%, always-shortest → 0%, all-equal → 0%, uniform-over-four
    → the 25% chance baseline, and a CJK-vs-Latin specimen so a 2-character option cannot outrank a
    10-character one). It **warns rather than fails** — a failing threshold would block every commit
    until a five-language content pass lands, and (b) above may never be a run's to make.

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
    > **Second residual, measured 2026-09-02 and filed as a NOTE under this item rather than as a
    > numbered one (W-6.2 rule 2 — one live instance, now fixed). The instrument's corpus is
    > LESSON PROSE, and the app's densest finance vocabulary is not in lesson prose.**
    > `jargon-candidates.mjs` reads `lessonContent.*`; §17b's coverage sweep reads lessons too. Neither
    > can see `src/locales/*.js` or the Reference screens' own content modules — so a term the app
    > organizes a whole screen around is invisible to both. The live instance was **"relative
    > strength"**, printed on all eleven Sector-performance rows and in that screen's sort note, and
    > defined in no lesson, no quiz, no glossary entry and no market copy (measured with controls:
    > "yield curve" and "fed funds rate" are found in the same corpus and ARE defined; "purchasing
    > power" is defined and absent from it). Fixed in place rather than by a glossary key — see the
    > 2026-09-02 run entry for why. **Before building a sweep for this, note the corpus is 6,228
    > chars of English chrome and every other figure on those screens already carries its own `what`
    > line; a whole instrument for one term would land on the wrong side of W-6.3.**
    > ✅ **UPDATE, same day, owner-directed: the glossary entry was added as well** ("do the ko/zh/ja
    > glossary entry for relative strength too"). Both surfaces now exist and they do different jobs —
    > `relativeStrengthNote` on the Sectors screen reconciles the rank with the return column, the
    > glossary entry says what the measure is. **It is the only glossary key whose use is a Reference
    > screen rather than lesson prose, so it carries no chip and §17b needs none from it** (that sweep
    > is about terms a lesson USES). Still open and deliberately not taken: the Sectors screen does not
    > LINK to the entry — a reader has to know to look it up.

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

### 2026-09-02 (scheduled dev-agent, self-picked by walking a first-run learner from lesson 1 through Review into Reference) — the Fed balance-sheet chart told a screen-reader user the bars are trillions of dollars and told a sighted reader nothing; "9" sat under the title "Fed Balance Sheet" with no unit anywhere on screen

**The defect, and it is an inversion of the usual one.** `charts.jsx`'s `<Bar>` prints `{d.value}`
bare. Its only content is `balanceSheetHistory` — 0.9 / 4.5 / 3.8 / 9 / 6.7 — and the unit lived in
exactly one place: `balanceSheetDescription`, the `aria-label` on the `role="img"` container. So the
figure's **text alternative carried a fact the figure itself did not**. The caption underneath
(`"The shape, not the exact level, is the point"`) declines to name the level, and `t.balanceSheet`
("Fed Balance Sheet") is a title, not a unit. A sighted learner met a bar labeled **9** and had no way
to know whether that was 9 billion, 9 trillion, or an index. **A text alternative may restate what is
on screen; it must not be the only place a fact appears.**

**Measured live before any edit (step 3.5), on the shipped build `index-D4xvPdq9.js`**, Reference >
Market Dashboard in English:
- `/trillion/i.test(document.body.innerText)` → **false**.
- `/trillion/i.test(document.body.innerHTML)` → **true**, and the surrounding 240 characters are
  `…<figcaption>…Fed Balance Sheet</figcaption><div role="img" aria-label="Five bars, in trillions of
  dollars: 0.9 before 2008, …`.
- **That pair IS the control, and it is two-sided by construction.** The same case-insensitive regex,
  over the same document, finds the word in the aria-label and cannot find it in the rendered text —
  so the negative reading is a property of the page, not of a probe that silently matches nothing.
  (The first post-fix run of this probe *did* return a false negative, for a reason worth keeping:
  the figcaption is `text-transform: uppercase`, so `innerText` returns `$ TRILLIONS` and a
  case-sensitive `includes("$ trillions")` misses it. Instrument fixed, then re-run.)

**The fix.** `<Bar>` gains a `unit` prop, rendered as a second span inside the existing `<figcaption>`
after a `·`, at `fontWeight: 400` against the title's 700 so it reads as subordinate. `unit` is
**outside** the `role="img"` container on purpose — inside it, the value would be announced twice.
The strings are a new `balanceSheetUnit` in `src/content/markets.js`, five languages, each one the
same unit its own language's `balanceSheetDescription` already names, so the face of the figure and
its text alternative cannot drift: `$ trillions` / `billones de dólares` / `조 달러` / `万亿美元` /
`兆ドル`. (`es` uses *billones*, which is 10^12 in Spanish and is therefore the correct rendering of
"trillions" — the description had already made that call.) Both call sites pass it:
`screens/reference/MarketSignals.jsx` and `components/LessonVisual.jsx` (lesson 37, **QE & QT**, on
the main path), which are the only two `<Bar>` instances in the app.

**Why the prop is on `Bar` alone.** `charts.jsx` has ten figcaptions; nine belong to primitives that
label their own geometry (`2Y`/`10Y`/`30Y`, phase names, bracket rows). `Bar` is the only one that
prints a bare number whose magnitude has no other referent on screen — so this is a fix at one
primitive, not a new convention nine other charts now have to satisfy.

**Verification, live in all five languages on `index-8UQ_ZkDB.js`** (the built hash was re-checked
after the final build and is byte-identical to the one driven):
- Figcaption reads `FED BALANCE SHEET · $ TRILLIONS`, `BALANCE DEL FED · BILLONES DE DÓLARES`,
  `연준 대차대조표 · 조 달러`, `美联储资产负债表 · 万亿美元`, `FRBのバランスシート · 兆ドル`.
  The unit is now in `innerText` in all five, with a **negative control in the same probe**
  (`innerText.includes("zzz-not-present")` → false every time), so "found it" is not "matches
  everything".
- **Lesson 37 driven for real**, not asserted: `completed = [29..36]` to unlock it honestly (a URL
  does not unlock a lesson), `#/lesson/37` → the inline figure renders
  `FED BALANCE SHEET · $ TRILLIONS` above the same five values.
- **320px, and the 200% root-font axis, with the differential control that matters.** The Spanish
  string is the longest; at 320px the figcaption wraps to two lines, `scrollWidth - clientWidth` is
  **0**, and the page has **no horizontal scroll**. At 200% the sweep reports four `290 > 288`
  container overflows and 59px of body scroll — **I removed the unit span in place and re-ran the
  identical probe: the findings are byte-identical (4 vs 4, same elements; 59 vs 59). Pre-existing,
  not mine.** The text-overflow probe's own control fired first (a planted 42-character unbreakable
  word in a 40px box with `overflow-wrap: normal` → 1 finding; removed → 0).
- **`npm test`: PASS, 0 failures**, same standing warnings (3 in `check-data` + the floor).
  **`npm run build`: clean.**

**Adversarial self-check (step 5).** *Blindspot register:* §10.1 — `check-blindspot` passes, and it is
**proven non-vacuous over the new field specifically**: planting `"$ trillions — you should buy stocks
now"` into `balanceSheetUnit.en` (grep confirmed the plant landed at `markets.js:268`) gives
**FAIL: §10.1 investment-advice-adjacent language reintroduced**; restored from a scratchpad copy to a
byte-identical sha (`b613b9c9…`), never `git checkout --`. §10.2 — no person or firm named; "Fed" is
the institution the chart has always been titled after. §10.3 — untouched. §2.3 — no date and no
live-looking figure added; the five values are unchanged pre-2026 historical era data. *DECISIONS.md:*
no state-model change (still `localStorage`), the strings are a `.js` content module and not JSON, no
routing or build change. *No hex:* neither touched file contains one — the unit uses `ink.muted`, the
same token as the title. *Already-done:* `balanceSheetUnit` appears **0** times in `AGENT_LOG.md` and
**0** in the archive; the three "axis label" hits are lesson 23's chart and `moneyVisuals.js`, other
figures. *W-6.2:* not the previous run's residual — the last entry is the Learn screen's finished
state and points nowhere near `charts.jsx`. *W-6.3:* `scripts/` **+0 lines**; no instrument added,
and see item 163 for the check that was considered and why it is not filed as due. *My own claim:*
every figure re-runs from the repo — build, open `#/reference` > Market Dashboard, read the
figcaption; the pre-fix state rebuilds at `f48b120`.

⚠️ **Honest limits.** (1) **Four new machine-translated strings** (es/ko/zh/ja), read by no fluent
speaker — O-3's standing condition. These are the mildest end of it: each is a two-or-three-token unit
copied out of a description already shipping in that language, not new prose. (2) The visible values
still render `9` where the description says `9.0`, because `9.0` is `9` in JavaScript. Among four
one-decimal siblings that reads as an inconsistency; it is a `Bar`-wide formatting decision rather
than a data one, so it is noted in item 163 rather than fixed here. (3) The 200% / 320px container
overflows above are real and untouched — this run proved only that they are not mine.

**Owner tree at start and end: `OWNER-TREE f54fc023fb026bcb44277af38101071c245bfda0c8ead5c40049acd487b5c975` (0 tracked modified, 51 untracked — `UIUX/`), untouched. Committed: `src/components/charts.jsx`, `src/content/markets.js`, `src/components/LessonVisual.jsx`, `src/screens/reference/MarketSignals.jsx`, and this log.**

### 2026-09-02 (scheduled dev-agent, self-picked by driving the Learn screen into a state nothing else exercises) — a learner who finishes all 44 lessons is told "NEXT UP: Transactions" over a full progress bar, and lesson 1 is marked Completed and Current lesson in the same row

**The defect, in one line of code that has been there since the screen was written.**
`Learn.jsx` computed the resume pointer as `Math.max(0, lessons.findIndex(l => !completed.includes(l.id)))`.
`findIndex` returns **-1** when every lesson is complete; `Math.max(0, -1)` is **0**. So "there is no
next lesson" was silently rewritten into "the next lesson is the first one", and the app had **no
finished state at all** — it looped a learner who had read every word back to lesson 1.

**Measured live before any edit (step 3.5), on the built app at `index-Cqgk1Lk2.js`**, with
`ecycles_completed_lessons` set to all 44 ids:
- The card read **`NEXT UP` / `Transactions: The Building Block` / `How the Economy Works · ≈2 min` /
  `Progress: 44/44` / `Continue Learning`**.
- Lesson 1's row carried **both** screen-reader markers at once — `Completed` *and* `Current lesson` —
  because `isNext` compares `i === nextIndex`, and `nextIndex` was 0.
- The header subtitle still read **"Pick up where you left off"** with nothing left to pick up.

⚠️ **The premise I started from was mine, not an item's, so the thing that needed a control was the
measurement.** Two controls, both run against the *shipped* build: at **12/44** the card correctly
named `The Subject That Wasn't on the Timetable` (id41, the money track's first lesson) with exactly
**one** current row; at **0/44** it read `START HERE` / `Transactions` / `Progress: 0/44`. So the
44/44 reading is a state the code produces, not an artifact of writing to `localStorage`.

**The fix, and why it is a card rather than a hidden card.** `nextIndex` now keeps **-1 as -1** — it
is the app's only "the path is done" signal, and both consumers read it as one (`nextLesson` becomes
`null`; `i === -1` matches no row, so no completed lesson can also be "current"). `pathComplete`
renders the **same `ResumeCard`** with a different payload: `PATH COMPLETE` / "You've finished every
lesson" / a line about spacing / a **`Go to Review`** button wired to `goToTab("practice")` (a new
`goToReview` prop; `App.jsx` passes it). Same card on purpose — a learner who has read all three
tracks still wants "here is where you are, here is the one thing to do next"; only the next thing is
no longer a lesson. It points at Review because the check questions are already in that queue and
spacing them out is the part of the product that outlives the path.

**Deliberately no count in any of the five new strings.** "You've finished every lesson", not
"…all 44 lessons": the App summary's standing rule is that a retyped figure goes stale silently, and
a lesson added next week would have made this card lie. `LessonReader`'s forward button was checked
and is **not** affected — `hasNext = index < lessons.length - 1` already handles the last lesson.

**Verification, with the control that mattered failing first.**
- **The overflow probe's first control did not fire, and the plant was the broken half.** A planted
  42-character unbreakable word in a 40px box reported `scrollWidth === clientWidth === 40` and the
  probe found nothing. Cause: the app sets **`overflow-wrap: break-word`** globally, so the plant
  *wrapped* instead of overflowing. Re-planted with `overflow-wrap: normal` → `scrollWidth 431 vs
  clientWidth 40`, **probe detects 1**; removed → **0**. Only then were the five language readings
  worth anything.
- **The "current row" probe was controlled in both directions too**: it counts rows whose computed
  `border-top-width` ≥ 2px (the `isNext` treatment, language-agnostic). At 12/44 it returns **1** and
  names the right lesson in Japanese (`時間割になかった科目`); at 44/44 it returns **0**.
- **Live at 320px in all five languages, on a build whose chunk hash I checked** (`index-D4xvPdq9.js`,
  per the standing stale-bundle rule): **0 current rows, 0 overflowing elements, no horizontal body
  scroll**, and the card's five lines read correctly in en/es/ko/zh/ja.
- **The button was clicked, not reasoned about**: `location.hash` becomes `#/practice` and the bottom
  nav's `aria-selected` tab becomes `Review`.
- **`npm test`: PASS, 0 failures**, same standing warnings (3 in `check-data`, plus the floor).
  **`npm run build`: clean.** The final build's hash is byte-identical to the one verified live.

**Adversarial self-check (step 5).** *Blindspot register:* §10.1 — `check-blindspot` already scans
`src/locales/*.js`, so the new strings were in its corpus and passed; proven non-vacuous by planting
`"Go to Review — you should buy now"` into `en.js` (grep confirmed the plant landed), re-running →
**FAIL: §10.1 investment-advice-adjacent language reintroduced**, then restoring from a scratchpad
copy to a byte-identical sha (`3c64c1d8…`, never `git checkout --`). §10.2 — no person or firm named.
§10.3 — untouched. §2.3 — no date and no figure in any new string, by design. *DECISIONS.md:* no state
model change (still `localStorage`), locale strings in `.js` modules, no routing or build change; the
new prop reuses `goToTab`, the existing navigation seam. *Already-done:* **0** occurrences of
`pathComplete`/`pathDone` anywhere in `AGENT_LOG.md` or the archive, and `Math.max(0` now appears in
`src/` only inside the comment explaining its removal — not a redo. *W-6.2:* this is not the previous
run's residual; nothing in the last entry points at the Learn screen. *W-6.3:* `scripts/` **+0 lines**
— no instrument added (see the note filed below for why, and what it would have to be). *My own claim:*
every figure is re-runnable — set `ecycles_completed_lessons` to the 44 ids, load `#/learn`, read the
card; the pre-fix state is reproducible by rebuilding at `0d12102`.

⚠️ **Honest limits.** (1) **Twenty new machine-translated strings** (5 × es/ko/zh/ja), read by no
fluent speaker — O-3's standing condition, and these are prose rather than single nouns, which is the
higher-risk end of it. (2) The completion card is the **same component** as the resume card, so the
two states are told apart by their words, not by their shape; a learner glancing at the screen sees a
familiar card. That was a deliberate trade for a small diff and it is the first thing to revisit if
the finished state ever deserves its own design. (3) **No regression guard was built**, so the exact
class of bug — a sentinel index laundered through `Math.max`/`||`/`??` into a valid-looking value —
can return anywhere else — see the note below, which is why no item was filed.

**Owner tree at start and end: untracked `UIUX/` (51 files), untouched. Committed: `src/App.jsx`,
`src/screens/Learn.jsx`, the five locale files, and this log.**

**Residual, filed as a NOTE and not as a numbered backlog item (W-6.2 rule 2), because the sweep it
would guard has zero remaining live instances — measured, not assumed.** Every other sentinel-index
site in `src/` was read this run: `deepLink.js:96` and `Settings.jsx:28` handle `-1` explicitly and
say so in a comment; `App.jsx:368` indexes an array with the result but is protected by `?.`; and
`LessonReader.jsx:217`'s `findIndex(...) + 1` would print "Lesson 0 of N" on a miss but cannot miss
by construction (it searches the very list its argument came from). **So the Learn screen held the
only live one.** W-6.2 rule 3's question — name the learner-visible failure a check would have caught
— does have an answer here ("the app congratulated nobody and sent a finished learner back to lesson
1"), but the check itself would be a regex over `Math.max(0, …findIndex`, which catches one spelling
of the mistake and not the class; `?? 0`, `|| 0` and `Math.abs` all launder a sentinel the same way.
**W-6.3's number is the tiebreak: `scripts/` is 2.3x `src/`, and this proposal falls on the wrong
side of it.** If a future run finds a SECOND live instance, that is the evidence this note is waiting
for and the check becomes due.

### 2026-09-02 (scheduled dev-agent, RECOVERY of the 04:00 run that died mid-implementation) — the rate-effect cards rendered a bare "↓" with no noun naming what fell; recovered, and the recovered change turned out to strand an arrow of its own at 320px

**This run committed work it did not write, and the identification is the part worth reading.** The
tree held uncommitted edits to `src/content/markets.js` and `src/screens/reference/MarketSignals.jsx`.
**The task file's recovery test failed on them**: it asks whether "the log's latest entry or its 'next
run should pick' item describes exactly these changes", and the latest entry (the Relative Strength
glossary, `0d803b3`) describes something else entirely — it even certifies the tree was clean but for
`UIUX/`. Taken literally that routes to "the user is mid-work: do not touch".

**Three independent measurements said otherwise, so the literal test was not the last word.**
- **Clock.** `0d803b3` committed **02:43 local**. Both files were modified at **04:07:21 / 04:07:33**.
- **Schedule.** This task's cron is `0 */2 * * *`; `lastRunAt` was `10:00:43Z` = **06:00 local**, i.e.
  *this* run. The previous firing was `08:00Z` = **04:00 local**. The edits land **seven minutes into
  a scheduled run of this very task.**
- **Transcript, and this one is decisive rather than circumstantial.** A full-text search of other
  sessions for the literal string `responds: PRICE` returns exactly one hit: a session titled
  **"Economics app dev agent"**, cwd this repo, `lastActivityAt` **08:09:46Z = 04:09 local** — it made
  the edits at 04:07 and stopped two minutes later, before step 6 or step 7.

⚠️ **The durable finding, and it is about the task file rather than about this change. The recovery
clause's literal test can almost never fire for the stall it exists to catch.** Implementation is
step 4 and the log entry is step 6, so **a run that dies while implementing has by definition not
written the sentence the test looks for.** The test can only match a run that stalled *between*
writing the log and committing — the rarer shape. Every mid-implementation stall, which is the common
one, lands in the "user is mid-work, do not touch" branch and its work is stranded there permanently.
**This is the owner's file to change, so nothing was changed; it is reported instead.** A test that
would have worked here: the edits fall inside a scheduled firing window and no other session claims
them.

**What the recovered change does.** Each card under "How Rate Changes Affect Assets" is a cause and an
effect, and only the cause half named itself: the row read `Rates ↑` opposite a bare `↓`. A new
per-asset `responds` field supplies the missing noun, and it is per-asset because the quantity really
does differ — a bond has a **Price**, cash has a **Yield**, a currency has a **Value**. It matters
most on the **cash and dollar** cards, where both arrows point the same way and the row previously
read as one statement about rates rather than as rates → asset. Completeness checked before trusting
it: **6/6** entries carry the field, **one** consumer, and the three constants are populated in all
five languages.

**⚠️ Then the recovered change was refuted, and the refutation is the reason this run is not just a
`git commit`.** At **320px in Spanish**, `Rendimiento` is long enough that adding the noun pushed the
*other* half onto two lines: `Tasas` on line 1, **`↑` alone on line 2**. That is the exact ambiguity
the change exists to remove, reappearing in the half nobody was looking at. Measured as an A/B on the
live DOM — value span reduced to a bare arrow to reconstruct the pre-change state — **0 of 12 labels
broke before, 2 of 12 after**. Fixed in the same commit: `whiteSpace: nowrap` on **both** halves so
neither can split internally, plus `flexWrap: wrap` on the row so the *row* stacks instead. The two
tight rows go to 38px with both halves intact, and the CSS is commented as load-bearing with the
measurement, so a later tidying pass does not delete it.

**Verification, each with its control — and two instruments were caught lying before they were used.**
- **A hand-typed dist probe list returned a false zero.** `収益率` was absent from the bundle because
  I had typed the *Japanese* kanji for the *Chinese* label; the real strings are `收益率` (zh) and
  `利回り` (ja), both present. Re-run driven **from the source constants instead of a typed list**:
  **15/15** label strings found in `dist/assets/markets-*.js`; a never-added probe absent.
- **`getClientRects()` on the value span reported "1 line box" for a span that could have been
  wrapping.** Flex items are blockified, so it returns one border box regardless of internal wrapping
  — a confident wrong answer. Redone with a **Range over the text node**, which does report per-line
  boxes, and controlled: a planted long string reports **3**, then **2** on the shipped build.
- **Live, on a build whose chunk hashes I checked** (`index-Cqgk1Lk2.js`, per the previous entry's
  stale-bundle rule): at **320px**, all five languages report **0 broken halves, 0 overflowing rows,
  no horizontal body scroll** — en/ko/zh/ja single-line, es stacking the two `Rendimiento` rows.
- **Rendered DOM in all five languages**: `Price/Precio/가격/价格/価格`, `Yield/Rendimiento/수익률/收益率/利回り`,
  `Value/Valor/가치/价值/価値`, each read out of the DOM and each paired with the right asset.
- **`npm test`: PASS, 0 failures**, the same standing warnings (3 in `check-data`, plus the floor).
  **`npm run build`: clean. `check-blindspot`: PASS.**

**Adversarial self-check (step 5).** *Blindspot register:* §10.1 — an advice-token matcher over the
added lines returns **0**, and the same matcher fires on a planted *"debería comprar ahora"*, so the
zero is a result and not a dead pattern; the added vocabulary is three nouns and no verb. §10.2 — no
person or firm named (**0** matches for Dalio/Bridgewater). §10.3 untouched. §2.3 — the only date
anywhere is `2026-09-02` inside a source **comment**; no digits entered any learner-visible string.
*DECISIONS.md:* a field added to a `.js` content module is the shape that file mandates; no state, no
routing, no build change. *Already-done:* **0** occurrences of `rateEffects` or "How Rate Changes
Affect Assets" across `AGENT_LOG.md` and the archive, and no prior commit to `MarketSignals.jsx`
touched these rows — this is not a redo. *W-6.3:* `scripts/` **+0 lines**; this run adds no instrument.
*My own claim:* every figure above is re-runnable — `npm test`, the source-driven dist check with its
negative control, the before/after label-wrap A/B, and the live DOM at 320px in five languages.

⚠️ **Honest limits.** (1) **Twelve new machine-translated strings** (3 nouns × 4 languages) read by no
fluent speaker — O-3's standing condition. They are single common financial nouns rather than prose,
which is the low-risk end of that exposure, but they are on the same ledger. (2) The 320px stacking in
Spanish is **correct, not pretty** — two intact halves on two lines. (3) The screen-reader claim in the
recovered comment is reasoned, not tested; no assistive technology was run, and the improvement rests
on the DOM now carrying a noun where it carried a lone glyph.

**Owner tree at start and end: untracked `UIUX/` (51 files), untouched. Committed: exactly the two
recovered files plus this log.**

### 2026-09-02 (owner-directed: "do the ko/zh/ja glossary entry for relative strength too") — the entry the earlier run declined, now built in five languages; and a stale bundle in the tab looked exactly like a key rendered by nothing

**Authorization, and one correction to the premise of the ask.** There was no en/es entry for ko/zh/ja
to catch up with: the run three hours earlier **declined** the glossary key on purpose and explained
the measure in place on the Sectors screen instead (`relativeStrengthNote`). So this is the whole
entry, not a remainder — and `check-data.mjs` §4 requires all five languages non-empty, so the ask
could not have been satisfied with ko/zh/ja alone in any case. Stated rather than quietly widened.

**What shipped — one glossary key, `"Relative Strength"`, in en/es/ko/zh/ja.** The definition is the
general concept, not this app's implementation: a return compared with a benchmark's over the same
stretch, positive when it outpaced and negative when it trailed, with the case that makes it click —
something that fell 2% while the benchmark fell 5% still has positive relative strength — and the note
that rankings built on it usually sum several lookback windows. Conventions read off the corpus first:
the `s` names match the labels the app already ships (`Fuerza Relativa` / `상대강도` / `相对强度` /
`相対強度`), and `S&P 500` is written as the app's own `BENCHMARK.name` in all five rather than
localized to 标普500. Glossary count 42 → 43; `npm run readiness -- --write` regenerated
LAUNCH_PLAN §1's asset sentence, which is a generated figure and failed the suite until it did.

**Both surfaces now exist and they do different jobs**, which is why the earlier run's decision is not
reversed: the screen note reconciles the rank with the return column at the point of confusion, the
glossary entry says what the measure is. It is **the only key in the file whose use is a Reference
screen rather than lesson prose** — recorded in a comment above it, because that is exactly why
`npm run jargon` and §17b could never have surfaced the term, and why it owes §17b no chip (that sweep
covers terms a lesson USES; measured 0 occurrences of the phrase across all 44 lessons and the quiz).

**⚠️ The finding worth the entry, and it is about verification rather than content: a stale bundle in
the tab is indistinguishable from a key that renders nothing.** After the build, the Glossary screen
showed 42 terms and not the new one, while `grep` found all five strings in `dist/`. That is the exact
signature of this project's known "shipped in five languages, rendered by nothing" defect, and I was
one step from filing it as one. `performance.getEntriesByType('resource')` settled it: the tab was
still running **`index-chrQeQwa.js` / `markets-CRYKdSW2.js`**, the *previous* build's chunks, served
from cache on a same-URL navigation. A cache-busting query string loaded `index-DSLmKZYD.js` /
`markets-BhyvXf2u.js` and the entry was there. **The transferable rule: before believing a negative
result from a live page, print the chunk hashes the page actually loaded and check them against
`ls dist/assets/`.** A DOM read is only evidence about the build the tab is running.

**Verification, each with its control.**
- **The instrument sees this entry.** Plant: ko's definition cut from 262 to 13 code points → §67 went
  **0/344 → 1/344 under-threshold, at `ko 1`** with es/zh/ja still 0, so an abridged translation of
  *this* key would be caught. Restored from a scratchpad copy, `diff -q` byte-identical, never
  `git checkout --`; §67 back to 0/344.
- **Live, on the freshly-loaded build**: the full entry renders in **en, es, ko, zh and ja** (each read
  out of the rendered DOM, not the source), and searching "relative" narrows the list to this one term
  with `Volatility Index` correctly filtered out — so the row is reachable, not just present.
- **What ships**: all **5/5** definitions in `dist/assets/markets-*.js`; a never-added probe absent.
- **`npm test`: PASS, 0 failures, 3 warnings** — the same three standing ones. `check-blindspot`: PASS.

**Adversarial self-check (step 5).** *Blindspot register:* §10.1 — the entry says what the measure is
and never what to do with a sector's place in it; an advice-token matcher over all five languages
returns **0**, and the same matcher fires on a planted *"debería comprar ahora"*, so the zero is a
result rather than a broken pattern. §10.2 no person named. §10.3 untouched. §2.3 — no year and no
date anywhere in the entry; the only 3-digit runs are the five occurrences of `S&P 500`, the
benchmark's name, which is the same string the Sectors screen already renders. *DECISIONS.md:* the
"(Beta)" machine-translation decision is enlarged by **12 strings** (3 fields × 4 languages), by owner
instruction, for a named entry; the review ledger covers lesson content only and glossary entries sit
outside it, which this file's header already records — so the 0%-human figure is unchanged and this
run does not pretend otherwise. *Already-done:* no — item 35 grew the glossary from lesson-prose
measurement; this key comes from the opposite direction and is marked as such. *W-6.3:* `scripts/`
**+0 lines**. *My own claim:* every figure from `npm test`, the §67 plant in both directions, dist
greps with a negative control, and the live DOM in five languages on a build whose chunk hashes I
checked.

⚠️ **Honest limits.** Twelve more AI-written strings in four languages read by no fluent speaker —
O-3's standing condition, unchanged. And **the Sectors screen still does not link to the entry**: a
reader who wants the definition has to know to go and look for it. That is a real gap and it was left
deliberately rather than folded in — Reference's sub-screen navigation is state, not a route, so
wiring a term link from that screen is its own change with its own verification, not a line to smuggle
into a glossary commit.

**Owner tree at start and end: untracked `UIUX/` (51 files), untouched.**


### 2026-09-02 (scheduled dev-agent, self-picked by opening the built app and reading a screen) — the Sector-performance list is ordered by a measure the app names eleven times and defines nowhere, and every instrument that hunts undefined jargon reads a corpus that screen is not in

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The three preceding entries are all
translation-corpus work (Spanish glossary, then the ko/zh/ja glossary and parent guide by owner
direction). Rule 1 says the third run in a row does not take another link in that chain, so this run
took none of it: `npm test`'s three standing warnings are all parked on owner decisions (O-3 twice,
item 160's remainder), so instead of picking off a list I **built `dist/`, served it and read the
app**, which is the one thing W-6.0 says nobody is spending capacity on. `preview_start` worked in an
unattended run, contradicting the 2026-09-01 entry's note that it refuses — recorded here because two
entries have now cited that note as a reason to skip live DOM checks.

**The finding, from the screen and not from a file.** On Reference → Sector performance the eleven
rows read `#1 of 11 · +12.5%`, `#2 of 11 · +17.8%`, `#3 of 11 · +11.5%` — the numbers go up and down
against an ordering that never moves. That is not a bug: item 104 fixed the comparator in August, and
the sort note already says the rank and the percentage are different quantities. **What is missing is
the quantity itself.** The screen prints `Relative strength` on every row and calls the list "Ranked
by relative strength", and the term is defined **nowhere in the app**.

**Step 3.5 — measured before editing, in both directions.**
- **Not in the glossary**: 42 keys, 54 surface forms, `/relative|strength/i` matches none, and no
  entry's definition text mentions it. *Controls:* `Credit`, `VIX`, `Inflation`, `Yield Curve` all
  found by the same reader.
- **Not in any lesson, quiz, market copy, kids or parent content**: 0 hits across
  `lessonContent.{economy,essentials,money}.en.js`, `quizText.en.js`, `markets.js`, `kidsContent.js`,
  `economicSignals.js`, `sectors.js`. *Control:* "yield curve" returns 4 in the economy lessons.
- **It lives in exactly three locale strings and the screen**: `relativeStrengthLabel`,
  `sectorsSortNote`, `provisionalNotice` (the last renders only when the data says `provisional`,
  which it does not — the WJ measure shipped 2026-08-04).
- **The cause is corpus, not oversight.** `npm run jargon` and §17b both read lesson prose. A term
  used only in UI chrome is outside both, so no instrument in this repo could ever have raised it.
  Filed as a note under item 60, not as a numbered item (W-6.2 rule 2: one live instance, now fixed).
- **The learner-visible size of it, re-read live rather than reasoned about**: on the 6M tab
  Technology shows **+33.9%, the largest number in the list, at rank 6** (read out of the rendered
  DOM, not out of `market.json`). A reader who assumes the column is the sort key sees a broken list.

**What shipped — one new locale key in five languages, rendered under the existing sort note.**
`relativeStrengthNote`: *"Relative strength compares each sector with S&P 500 over three stretches at
once — roughly two weeks, six weeks and three months — and adds the three gaps up. A sector can show
the biggest return here and still rank below one whose lead is spread across all three."* The three
stretches are `WJ_PERIODS` (10/30/60 daily bars) read off `relativeStrength.js`, not invented; the
second sentence is the reconciliation the sort note leaves open, and it is stated as a property of the
measure rather than as a claim about today's tab (on 1M the biggest return IS rank 1).

**Explained in place rather than as a glossary entry, deliberately.** A reader confused by this list
is on this screen, not in the glossary; a key no lesson uses would owe §17b a chip or an exclusion for
nothing; and every other figure on that screen — each sector's `what`, each FRED signal's `what` —
already carries exactly this kind of line. The one number that ORDERS the list was the only one
without one. Cost: 4 new machine-translated strings instead of 12.

**Verification, each with its control.**
- **A plant that did NOT fire, which is the reason the DOM check exists.** Replacing the render with a
  literal left the key defined in five languages and rendered by nothing — `check-data.mjs` still
  exited 0. That is correct: commit `054d61c` deleted such a key and explicitly shipped **no** guard
  for the class. So `npm test` green proves nothing about whether this key renders, and the live DOM
  is the only proof. Restored from a scratchpad copy, `diff -q` byte-identical, never `git checkout --`.
- **Live**: the note renders under the sort note in English and, with `{name}` substituted, in Korean
  (`S&P 500과 비교해…`). At a 320px viewport `scrollWidth === clientWidth === 320` — no overflow. No
  console errors.
- **What ships**: `npm run build` → `dist/assets/index-*.js` carries all **5/5** strings; the plant
  string and a never-added probe are both **absent**, so the CJK greps are not silently failing.
- **`npm test`: PASS, 0 failures, 3 warnings** — the same three standing ones (0% human review, 48
  abridged essentials pairs, quiz length cue), unchanged. `check-blindspot`: PASS.

**Adversarial self-check (step 5).** *Blindspot register:* clean — no person named (§10.2); the note
says what the measure IS and never what to do about a sector's place in it, and an advice-token grep
over all five strings (should/buy/sell/recommend and the es/ko/zh/ja equivalents) returns 0 (§10.1);
kids framing untouched (§10.3); **the note carries no date and no figure**, so §2.3 is untouched — the
dates in the new code comment are comments, matching the file's existing practice. *DECISIONS.md:* no
conflict with localStorage-only state, `.js` content modules or Vite; the "(Beta)" MT decision is
enlarged by **4 strings of UI chrome**, which is in-kind and does not move the ledger's 0%-human
figure (that counts lesson content). Stated, not finessed. *Already-done:* no — item 104 fixed the
ordering, this explains the measure; the "Completed and pruned" entry for sector relative strength
records that it ships, not that it is explained. *W-6.3:* `scripts/` **+0 lines**; `src/` +5 locale
strings and +2 rendered lines. First entry in several days on the shrinking side of that ratio.
*My own claim:* every figure above comes from `npm test`, `npm run build`, greps with negative
controls, and the live DOM at two viewport widths.

⚠️ **Honest limits.** Four of the five strings are AI-written and read by no fluent speaker — O-3's
standing condition, unchanged. And the note explains the measure; it does not make the ordering
*verifiable* on screen, which would mean printing the score itself. That is deliberate: this screen's
header comment says a rank is shown rather than a bare number "because a rank is something a
first-time reader can actually act on", and a summed-excess figure of `-16.6` is not beginner-legible.
A future run that wants to revisit it should argue with that decision, not quietly reverse it.

**Owner tree at start and end: untracked `UIUX/` (51 files), untouched.**


### 2026-09-02 (owner-directed: "do item 161's remaining ko/zh/ja pairs too") — the parent guide's Korean, Chinese and Japanese completed; the ratio had missed as many abridged blurbs as it caught

**Authorization.** Item 161 filed the ko/zh/ja remainder under O-3; the owner made the call for this
corpus in the same session that made it for the glossary. One corpus, named by the owner — O-3's scope
is not widened by this entry.

**Step 3.5 — the premise was re-read, not inherited, and it was half wrong in the useful direction.**
The item said 21 pairs. Reading them: **18 true positives, 3 complete** (zh `13-17.parentTip` — the
false positive the item itself named — and ja `9-12.lessons[2].text` / `9-12.parentTip`). Then the
**unflagged** side was read too, because item 162's glossary work that morning had found a false
negative at ratio 1.00. **Seven more abridged pairs, none flagged:** ko and zh `5-8.lessons[2]` both
drop *"The economy needs both!"*; zh `5-8.lessons[1]` drops *"That's like inflation!"* — the blurb's
entire point, at 0.26 against a 0.239 threshold; ko `13-17.lessons[1]` drops the 12-24 month lag
(the exact miss item 161 predicted); ko `13-17.lessons[2]` and ja `13-17.lessons[2]` drop *"to stop
the collapse"*; ko and zh `9-12.activity` drop *"Did they go up or down?"*. **So the ratio caught 18
and missed 7 — it is a screening proxy that finds most of the defect, and the reading is the
measurement.** The `why` fields (written 2026-08-16) were confirmed complete in all three languages,
as §66's header claimed.

**What shipped — 24 strings across ko/zh/ja, one line each.** Each restores the clause that was the
blurb's point: the mortgage blurb now says interest is the cost of borrowing in all three; the toy-swap
blurb says the economy is millions of such trades; the parent tip says interest is the bank paying to
use the child's money; the pretend-store activity ends on watching prices change when things are
popular. Register matched the complete 08-16 blurbs in each language (ko `-요` endings, ja `だよ/かな`,
zh plain). Fed naming read off the corpus — 연준 / 美联储 / FRB.

**After the fix, 9 pairs still scored under threshold and all 9 are complete** — the p90 rose (ko
0.551 → 0.593) as the abridged blurbs were completed, and compact CJK renderings of discursive English
crossed under it. Two are `why` fields I had not read before; both carry every clause. Same disposition
as §67 that morning: **`READ_COMPLETE` in §66, dated, with the code-point length at read time**;
control 6 proves a listed pair cut to 20% lands in `shrunk` and fails; an unlisted new abridgement
still warns.

**Verification.** Plant A (shrink listed zh `13-17.parentTip`): **FAIL, 26 → 9 cp, exit 1**; restored
byte-identical. Plant B (re-abridge unlisted ja `5-8.lessons[1]`): **§66 warns at ja 1**; restored
byte-identical. `npm test`: **PASS, 0 failures, 3 warnings** — §66's warning is gone; the three
standing ones remain (0% human review, 48 abridged essentials pairs, quiz length cue). `check-blindspot`
PASS; the token grep's two hits are *"buy and sell with play money"* and *"borrow to buy a house"*.
Build: `dist/assets/Reference-*.js` carries **7/7** probed restored clauses, **0/3** deleted terse
strings, never-added probe absent.

**Adversarial self-check (step 5).** *Blindspot:* clean; the parent tip about a savings account is
parent-facing and describes what interest is, not what to do — same as the English. *DECISIONS.md:*
the Beta MT decision enlarged again, by owner instruction, for a named corpus; ledger still 0% human.
*Already-done:* completes 161, redoes nothing. *W-6.3:* `scripts/` +~50 lines (the record + control
6), 0 in `src/` outside content — growing side, third time today; the record exists so the next
reader does not re-derive nine readings. *My own claim:* every figure from `npm test`, `npm run build`,
two live plants with byte-identical restores, and dist greps with a negative control.

⚠️ **Honest limits.** 24 more AI-written strings in three languages read by no fluent speaker. **Both
corpora completed today are now translated in full and reviewed by nobody** — O-3's condition,
unchanged, and the audit's recommendation stands: ship under Beta and let claim A3 decide.

**Owner tree at start and end: untracked `UIUX/`, untouched.**

### 2026-09-02 (owner-directed: "do the ko/zh/ja glossary translations too") — the O-3 call for the glossary, made; 42 true positives completed, and the ratio's 9% false-positive rate on this corpus recorded as data instead of left as a permanent warning

**Authorization.** Item 162 filed the ko/zh/ja remainder as an owner decision under O-3 and did not
take it. The owner made the call interactively the same day. This entry is that work, and it does not
widen O-3's scope: it is one corpus, named by the owner.

**What shipped — 45 strings across ko/zh/ja, one line each, no English touched.** The 14-path macro
cohort in all three languages (GDP, Deflation, Credit's M0 clause, Fed Funds Rate, Yield Curve, Credit
Spread, Inflation, Productivity Growth, Bubble, PMI, CPI, QT, Deleveraging's four named tools, QE),
plus the VIX false-negative shape in all three — the missing 25-35 band — and one factual nudge found
while there: `ja` VIX said 15以下 (at or below 15) where the English says *below* 15. Conventions were
read off the corpus first: **연준 / 美联储 / FRB** for the Fed (zh had one stray 央行 in QE, now
美联储 like QT), and M0's existing short names — 본원통화(M0), 基础货币（M0）, マネタリーベース（M0）.
Register matched the complete item-35 entries in each language rather than the terse macro glosses
being replaced.

**The finding worth the entry: after the true positives were fixed, §67 still flagged 30 pairs, and
all 30 are complete.** Fixing the macro cohort moved every language's p90 up (ko 0.580 → 0.615, ja
0.500 → 0.509, zh 0.368 → 0.373), so the compact-but-complete item-35 translations crossed under the
threshold — *"The amount of money originally borrowed or invested, kept separate from any interest
charged or earned on it"* is 23 Chinese characters, and there is nothing missing from it. **Three bad
options and the one taken:** padding them satisfies a ratio with worse prose; leaving them warning
teaches every reader to skip the line, which is how the next real regression hides; loosening
`ABRIDGED_BELOW` breaks the shared calibration §66 imports on purpose. **Taken: a dated
`READ_COMPLETE` record — each pair read against its English, stored with the code-point length it had
when read.** It cannot hide a *new* abridgement (an unlisted pair still warns) and it cannot hide a
listed pair that is later cut (control 6: below 90% of the recorded length FAILS). `deliberatelyUnlinked`
is the precedent — curation as data, not as prose.

**Verification, each number with the control that gives it meaning.**
- **The fingerprint fires on the live file, not only in its synthetic control.** `ko Principal.f` cut
  from 36 to 16 code points → `FAIL: §67 … read complete at 36 … now ships at 16 (44%)`, exit 1.
  Restored from a scratchpad copy, `diff -q` byte-identical.
- **The list does not mask a new defect.** `zh QE.f` re-abridged to 美联储购债。→ the warn returns at
  **zh 1** with the other three at 0. Restored byte-identical.
- **Per-language independence held again**: es stayed at 0 through the ko/zh/ja edits.
- **`npm test`: PASS, 0 failures, 4 warnings** — §67's warning is gone; the four standing ones remain.
  `check-blindspot`: PASS. A blunt token grep over the 45 additions hit 买入 / 買う / 買い / 해야 four
  times; each read in context is mechanism (*the Fed buys bonds*, *borrow to buy assets*, *must be
  repaid*, a pre-existing *credit-card purchase* example), none is a directive.
- **What ships, with negatives.** `npm run build` → `dist/assets/markets-*.js` carries **6/6** probed
  restored clauses (Deleveraging's tools and VIX's middle band, one per language), **0/4** of the
  deleted terse strings, and a never-added probe is absent — so the absences are not a grep that
  cannot match CJK.

**Adversarial self-check (step 5).** *Blindspot register:* clean, as above; "연준 목표: 약 2%" and its
zh/ja equivalents are the same standing target the English and es already carry. *DECISIONS.md:* the
"(Beta)" machine-translation decision is exactly what this run enlarges, **by owner instruction, for
this corpus** — stated, not finessed; the ledger still records 0% human review and this run does not
change that number. *Already-done:* no — it completes item 162 rather than redoing anything. *W-6.2
rule 3:* the learner-visible sentence is unchanged from the morning's entry, now in three more
languages. *W-6.3:* `scripts/` grows again, **+~70 lines** for `READ_COMPLETE` and control 6, against
0 in `src/` outside content. I am on the growing side twice today. The defense is that this addition
records a measured false-positive rate that the next corpus audit (item 161's remainder) needs before
it starts; the cost is that the ratio moved the wrong way again. *My own claim:* every figure comes
from `npm test`, `npm run build`, the two live plants with byte-identical restores, and the dist greps
with their negative controls.

⚠️ **Honest limits.** These 45 strings are AI-written ko/zh/ja read by no fluent speaker — O-3's
standing condition, unchanged. The 30 `READ_COMPLETE` pairs were read by the same agent that wrote the
neighbors; a fluent reviewer is the only thing that turns "read complete" into "reviewed".

**Owner tree at start and end: untracked `UIUX/` (51 files), untouched.**

### 2026-09-02 (scheduled dev-agent, self-picked from a third-corpus audit) — the Spanish glossary defined inflation as "when prices rise" and told the reader deleveraging has four tools without naming any of them, and §4 had certified the file every run since it was written

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous run filed nothing and said
so explicitly ("nothing else was filed and no numbered item was created"), and it recorded the launch
plan's actionable-clause lead as spent. So there was nothing to inherit. I self-picked by asking which
learner-visible corpus has a check that measures **presence** where the sibling corpus already proved
presence is not completeness — i.e. by generalizing item 161's finding rather than by continuing it.
`glossary.js` was the answer, and nothing in the backlog named it: `grep -nEi "glossary.*(translat|
abridg|complete)"` over the whole log returns **zero** prior items.

**Step 3.5 — the premise held and got stronger under measurement, and the instrument failed its first
run in a way worth recording.** The premise was "§4 checks the glossary for presence, not content,
exactly as §5 did for `kidsContent` before §66."
- **§4 confirmed by reading it**: it asserts a non-empty `{s, f, ex}` per language and nothing else.
  `entry.f` is rendered on **two** screens — `Glossary.jsx:135` and `TermDetail.jsx:59` — so this is
  live, not latent. The glossary is also outside the translation-review ledger *by design* (its own
  header says so) and §33 reads `lessonContent` only, so nothing had ever measured this file.
- ⚠️ **The first measurement returned a clean zero and was meaningless.** My scorer read `MIN_EN`
  from the wrong `argv` slot, got `NaN`, and printed `scored(en>=NaN)=0 … flagged 0 of 0` — a result
  that looks exactly like a fully translated corpus. It was caught only because the instrument prints
  its own scored-unit count next to the verdict. **That is the whole argument for printing the
  denominator**, and §67 fails hard rather than passing when `rows.length === 0` for the same reason.
- **Corrected, and reproduced twice: 72 of 336 pairs under 70% of a full translation into the same
  language** (es 14, ko 19, zh 20, ja 19), concentrated in `f` (66) over `ex` (6) and never in `s`.
- **The mechanism is authoring date, not language — and the evidence is the cross-language overlap,
  not the prose.** **14 paths flag in ALL FOUR languages at once**, and they are exactly the original
  macroeconomic cohort (Bubble, CPI, Credit, Credit Spread, Deflation, Deleveraging, Fed Funds Rate,
  GDP, Inflation, PMI, Productivity Growth, QE, QT, Yield Curve). The personal-finance batch added
  2026-08-16 (item 35) is complete clause-for-clause in every language. Same finding §66 made about
  `kidsContent`, arrived at independently on a different corpus.
- **A second, narrower mechanism, established from git rather than inferred:** an English-only edit
  that never propagated. `git log -S"monetary base (M0)"` dates `Credit.f`'s M0 clause to `ef0665a`
  (2026-08-26, item 114) — English alone, which is why the Spanish scored 0.58 with the rest of its
  sentence a full translation.

**What shipped — 15 Spanish strings, one line each, and no new prose in any other language.** The 14
flagged, plus one the ratio missed. Three of the losses changed what the app teaches:
`Deleveraging` read *"Cuando la deuda es excesiva. 4 herramientas."* — it announces four tools and
names none; `Inflation` read *"Cuando los precios suben"*, the word restated with the mechanism and
the Fed's ~2% target both gone; `Bubble` dropped *"pushing prices far above fair value"*, which is
the part that makes it a bubble. `Deflation`, `Fed Funds Rate`, `PMI`, `QE`, `QT`, `Yield Curve` and
`Credit Spread` had each lost their second, interpretive sentence the same way. Conventions were read
off the corpus before writing, not assumed: **"el Fed" 27 uses against "la Fed" 4**, and M0's existing
`es.s` is "Base Monetaria (M0)".

⚠️ **The finding that most limits this run's own instrument: a FALSE NEGATIVE found in its own
corpus.** `VIX` es scored **1.00** — as clean as a ratio gets — and was still incomplete. The English
carries three bands (below 15 / 25-35 / above 40) and **all four** translations carried two, dropping
the middle "fear" band. This is not a regression from `f38acb4` (2026-08-31): that commit correctly
propagated its own "no official cutoffs" hedge to all five languages, and the two-band structure it
left in place predates it. Fixed in es alongside the flagged set. **The transferable part: an
unflagged pair is not a certified pair**, and the same shape is very likely still in ko/zh/ja where
§67 cannot see it. Written into item 162 rather than left in this entry.

**§67, and the one place I refused to copy §66.** The check is §66's method pointed at the third
corpus, with five controls. **Control 5 caught me reusing §66's `MIN_EN * 2` gap heuristic**: it fits
`kidsContent` (shortest body 95) and fails on the glossary for no defect at all — longest short name
**35**, shortest definition **70**, so 40 sits in a real and empty gap that 80 condemns. Rewritten to
assert the gap *this* corpus has. **Copying a threshold across corpora is the drift this log keeps
catching in figures; it applies to constants too.**

**Verification, with the control that makes each number mean something.**
- **The check fires on a live plant, and the restore is proven.** `QT.es.f` abridged in the working
  file → §67 goes **es 0 → 1**; restored from a scratchpad copy (never `git checkout --`) and
  `diff -q` reports **byte-identical**, with the count back to es 0.
- **The scorer's controls are not decorative.** Planting a bug in `scoreGloss` — the per-language p90
  reference replaced by a fixed 1.0, the classic wrong metric — makes **control 3 fail** with 96
  flagged pairs where 0 is correct. Restored byte-identical from a scratchpad copy of the script.
- **es 14 → 0, and ko/zh/ja did NOT move** (19/20/19 before and after). That is the control for the
  per-language independence of the p90 reference: a shared denominator would have shifted them.
- **What SHIPS carries it, with a negative control.** `npm run build`, then grep `dist/assets/`:
  4/4 restored clauses land in `markets-DDNM-au6.js` (the Reference chunk), **3/3 deleted terse
  strings are absent**, and a probe string that was never added is **also absent** — so the greps
  that found nothing are not greps that cannot match.
- **`npm test`: PASS, 0 failures, 5 warnings** — the four standing ones plus §67's new one. The
  citation guard did its job: it failed three times on "backlog item 162" until item 162 existed.
- **`npm run check-blindspot`: PASS**, and the 15 added strings grep clean for advice, branding and
  date patterns.

**Adversarial self-check (step 5) — run, and it found two things worth writing down.** *Blindspot
register:* clean — `check-blindspot` passes and the additions define mechanisms without telling anyone
what to do ("Meta del Fed: ~2%" is a standing policy target already in the English and in the existing
`CPI` es entry, not a market reading). ⚠️ **But I checked §2.3's coverage rather than assuming it:
`glossary.js` is NOT in the 26 teaching-copy modules §2.3's date guard scans.** I then measured the
file: **12 date-like matches, all 12 in source comments**, zero in learner-visible strings. **Zero live
instances, so per W-6.2 rule 2 this is a note here and under item 162, not a numbered item.**
*DECISIONS.md conflict:* none on state, storage, module format or platform. The `.js` content module
stays `.js`. **The one real tension is O-3 and it is stated rather than finessed:** 15 strings of
AI-written Spanish were added to a corpus with 0% human review. I followed item 161's precedent
exactly — one language, omissions that change meaning — and that precedent is itself inside O-3's
scope for the owner to re-affirm or cap. *Already-done backlog item:* **no.** No prior item covers
glossary translation completeness (grep above returns zero); item 161 is a different corpus; item 35
added the entries I did not touch; item 114 and `f38acb4` made English-side changes that this run
**propagates rather than undoes**. *W-6.2 rule 3 — the learner-visible sentence:* "a Spanish reader
tapped Deleveraging and read a definition that announces four tools and names none." *W-6.3, quoted
and re-measured as that clause requires:* `scripts/` **16,576** lines against **7,146** lines of app
code — **2.31x**, and **I am on the growing side of it**: this run adds **+174** lines to `scripts/`
and **0** to `src/` outside content. The honest defense is that the corpus it measures was measured
for the first time today and 58 live defects remain in it; the honest cost is that the ratio moved the
wrong way again. *My own verification claim:* every figure above comes from committed content and from
commands an independent reviewer can re-run — `npm test`, `npm run build`, the two plants with their
byte-identical restores, and the dist greps with their negative control.

⚠️ **The honest size of the win.** One language of four. **58 pairs remain** and they are the majority
of the defect; a Korean, Chinese or Japanese learner still taps "GDP" and gets a bare noun phrase where
the English reader gets the recession rule of thumb *and* the caveat that the US does not actually use
it. That remainder is O-3's, not a run's.

**Next run should NOT take item 162's ko/zh/ja remainder** — it is an owner decision, not work. **O-1
remains the entire critical path**: 44 lessons, five languages, 160 minutes of content, 62+ check
sections, and zero people have ever opened this app. A **backlog refill** (W-2's standing rule) is a
legitimate pick; so is the observation that this run and the last two all found real defects by
auditing a learner-visible corpus nothing measured, which suggests the remaining ones are worth
enumerating deliberately rather than one per run.
**Owner tree at start and end of run: the owner's untracked `UIUX/` (51 files), untouched, as in the
previous fifteen runs. `OWNER-TREE` at start: `f54fc023…` (0 tracked modified, 51 untracked).**

### 2026-09-01 (scheduled dev-agent, backlog item 160) — the item said the quiz's remaining length cue splits into "leave alone" and "needs new prose"; measured, it is neither, and three of the obvious trims would have inverted the tell rather than removed it

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous entry closed with *"Next
run should pick from the launch plan or the owner-facing block; nothing was filed for it to inherit"*
and named **§7 (6 references)** and **§4.6 (8)** as the unaudited actionable clauses left. I read
both and neither is a run's: **§7** is the owner's build cadence, spend-when-stuck rule and monthly
budget, and **§4.6** is four falsifiable claims whose status is maintained in `CLAIMS.md` and whose
refutation conditions all begin with active users — downstream of **O-1**. So the launch-plan lead
was spent, and I took **item 160** instead. That is not a residual chain: 160 was filed four runs
ago, the three runs since it took other picks, and the previous run filed nothing for me to inherit.

**Step 3.5 — the premise broke, and the break changed the disposition rather than a figure.** Item
160 said the remaining questions *"split into two kinds"*: **(a)** already well-designed, leave
alone, and **(b)** a two-question head that needs new distractor prose. Measured against the corpus,
that partition does not exist.
- **Instrument and controls, planted before reading any result.** A code-point length reader scoring
  the same "strict extreme" rule §65 uses, with four controls that must fire in both directions: a
  planted strictly-longest correct option must read beatable; a **tie** must not; a **short** correct
  option must not; and every language's `quizText` must have `quizMeta`'s entry count (a silent
  shape change would have measured nothing and looked identical to a clean corpus). All four fired.
- **The defect is corpus-wide, not a handful of chatty options.** **38 of 46** questions are beatable
  in at least one language and **29 in all five**. In most of them the correct option is **1.5-2.5x
  the entire distractor band**, so there is no "one clause too many" to remove.
- **⚠️ The finding that changed what I shipped: three of the obvious trims invert the tell.** §65
  scores the shortest-option strategy on the same threshold for exactly this reason, and the
  arithmetic says it would have caught me. The target is not *shorter*, it is **inside the band** —
  neither strict maximum nor strict minimum. Trimming the trailing clause off the correct option
  makes it the **strictly shortest** in **q019** (en 82 → 36 against a [44-46] band), **q040**
  (127 → 52 against [74-86]) and **q012** (95 → 25 against [32-62]). All three were on my shortlist
  on the first pass, when I was reading ratios instead of bands. Each would have moved one number
  down and the other up by the same three questions.
- **A mechanical trailing-clause cut lands inside the band in all five languages for exactly ONE
  question in the corpus.** That is what shipped. **The cutter's positives are sound and its
  negatives are weak** — its delimiter list is Latin/CJK-incomplete, so a "no fit" means none was
  found by this cutter, not that none exists. Said plainly in the item rather than left implied.
- **The `ko`/`zh`/`ja` corpus has a structurally higher floor that no trim reaches.** Their
  distractors are far terser than the English — `q007`'s are **4-9 code points** (政府加税, 银行停贷)
  against a correct option that still has to name a mechanism. `q007` is the worst ratio left
  (en 2.61x) and is untrimmable in all three.
**Re-decided on the corrected facts: the remainder is one thing and it is O-3's** — closing it means
*lengthening distractors*, i.e. new prose in four unreviewed languages across roughly three dozen
questions. Written into item 160 so the next holder does not re-derive it, with the item's own
"(a)/(b)" text left in place beneath the correction as the dated record it is.

**What shipped — one clause deletion, five languages, no new prose anywhere.** `q030` (lesson 16,
*"what makes something an asset rather than a liability?"*): the correct option was the only one of
four carrying an em-dash aside, *"Which direction money flows after you buy it — in over time, or
out"*, against three bare `Whether …` criteria. The aside is restated in the `explain` the learner
sees the moment they answer (*"The test is the direction of cash over time…"*), which is item 160's
own style rule: **an option matches the shape of its siblings; the reasoning belongs in `explain`.**
Right on its own merits before it is right for the metric. Per language the diff is **one line**.

**Verification, with the control that makes each number mean something.**
- **§65 moved in all five languages and the other direction did not move.** Longest-option
  `en 78.3 → 76.1%`, `es 76.1 → 73.9%`, `ko 76.1 → 73.9%`, `ja 73.9 → 71.7%`, `zh 73.9 → 71.7%`.
  **Shortest-option is unchanged at `en 2.2 / es 2.2 / ja 4.3 / ko 0.0 / zh 2.2%`** — that is the
  control for the inversion above, and it is the reason the three other candidates were dropped.
  Both figures are re-derived every `npm test`; read the live line, do not quote these (W-5.5).
- **Exactly one line changed per file.** A diff against a pre-edit copy held outside the repo reports
  1 removal + 1 addition in each of the five. **Control:** the same differ run on a copy with an
  unrelated string planted reports the same shape, so it can see a change it was not looking for.
- **What SHIPS carries it, proved with a negative control.** `npm run build`, then grep each
  `dist/assets/quizText.<lang>-*.js` chunk for the trimmed head and the deleted clause: **5/5** find
  the head and **5/5** no longer find the clause. **Control:** the pre-edit sources were restored
  from the scratchpad copy, rebuilt, and the identical probe run against that build reports the
  clause **present in all five** — so the PASS is not vacuous and is not a grep that cannot match
  CJK. The edit was then re-applied from the same script and rebuilt.
- **`npm test`: PASS, 0 failures, 4 warnings** — the four standing ones (floor over budget, 0% human
  translation review, 48 abridged pairs, and §65/§66's own warns), none new. `refresh-readiness`
  reports the 12 generated figures still agreeing; the edit removes 5 short strings and does not move
  a lesson-content character count.

**Adversarial self-check (step 5) — run, and it found nothing that needed a fix.** *Blindspot
register:* the change **deletes** text and adds none, so §10.1/§10.2/§10.3 and the §2.3 date rule
cannot be reintroduced by it; `npm run check-blindspot` passes, and the deleted clauses grep clean
for `dalio|buy|sell|recommend|advice|guarantee|\d{4}-\d\d-\d\d`. *DECISIONS.md conflict:* none —
no state, storage, module-format or platform decision is touched; the five files stay `.js` content
modules. *Already-done backlog item:* **no** — item 160's "Done in the filing commit" list is
`q013/q022/q038/q044` (by id) and this run's question is `q030`, which appears in none of them.
*W-6.2 rule 3 / W-6.3:* **no check was built and none is due** — this run adds **0 lines to
`scripts/`** and 0 to `src/` outside content, so the 2.3x instrument-to-app ratio is untouched; §65
already measures this property and already warns, so a second instrument would be measuring a
measured thing. *My own verification claim:* every figure above comes from committed content —
`npm test`, `npm run build`, the band measurement with its four controls, and the dist probe with its
negative control. An independent reviewer re-running those gets these numbers.

⚠️ **The honest size of the win, stated rather than rounded up.** One question of 46. Tapping the
longest option still scores **~72-76%** against a 25% baseline, and this run's own measurement is why
that will not come down much further without the owner's O-3 call. **The measurement is the larger
half of this run, and it is what stops the next run spending itself on trims that invert the cue.**

**Next run should pick from the launch plan or the owner-facing block. Item 160 is now explicitly
marked "do not pick as a trimming pass" and must not be taken by default; nothing else was filed and
no numbered item was created (W-6.2 rule 2).** §7 and §4.6 are audited above and both are the
owner's, so the launch plan's actionable-clause lead is now spent — a **backlog refill** (W-2's
standing rule) is a legitimate next pick. **O-1 remains the entire critical path** — 44 lessons, five
languages, 160 minutes of content, and zero people have ever opened this app. **O-3** unchanged: no
translated prose was added or altered, only deleted in parallel across all five languages.
**Owner tree at start and end of run: the owner's untracked `UIUX/`, untouched, as in the previous
fourteen runs.**

### 2026-09-01 (scheduled dev-agent, W-5.3 archiving pass + the section it uncovered) — the document every run reads first said "17 lessons" and "17 sequential unlocking lessons" for four weeks, through the track split, the renumbering and the product reversal, and the fix is to delete the counts rather than correct them

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous entry left two things: an
explicit ⚠️ that **an archiving pass was due this run** (the run log stood at 98.5% of its warn budget
with **0.34 runs** of headroom), and "next run should pick from the launch plan or the owner-facing
block". Both were honored. The pass is W-5.3's own "legitimate whole run", and the launch-plan pick was
made by re-running the §-reference count on my own instrument — **§9.9, a section that does not exist,
returned 0 as the negative control, and §2.3 returned 250 as the live one** (the previous run measured
240; the growth is its own entry). The least-referenced actionable clauses were **§9.4 (1) and §9.5 (1)**
— both post-store-launch owner criteria no run can move — then **§7 (6)**, **§4.6 (8)**, **§4.0 (11)**
and **§2.2 (14)**. So I audited **§2.2**, the one that is code-shaped, and it came back **CLEAN on all
three of its rules**, which is a result and is reported as one:
- *content files contain no JSX* — holds.
- *screens contain no hardcoded translatable copy* — **0** literal JSX text nodes and **0** hardcoded
  `aria-label`/`alt`/`placeholder`/`title` strings across `screens/`, `components/` and `App.jsx`.
- *components read color from `theme.js` rather than literals* — **0** hex literals in any `.js`/`.jsx`
  under `src/`, against **87** in `index.css`, which is the control proving the scanner can see one.

**That last control is what produced the real pick, and it did so by refuting a sentence in the App
summary.** The scanner reported **0 hex in `theme.js` itself**. A scanner returning zero everywhere is
the failure mode this log names weekly, so it was validated before being believed — and it was right.
`theme.js` holds no color values at all; they are CSS custom properties in `index.css`, and `theme.js`
exports `var()` references. **The App summary has been sending every run to the wrong file for color**
since 2026-08-04. Pulling that thread found ten more.

**Step 3.5 — the premise was mine to make, so it was measured claim by claim, and the audit was built
to be able to say "true".** An audit that returns "stale" for everything is indistinguishable from an
audit that is not reading anything. **Five claims were re-measured and confirmed TRUE** and are the
control: `economic-cycles-v5/v6.jsx` are imported by nothing under `src/` (**0** import statements
naming them, against **152** import statements in `src/` — the grep works, and the one textual mention
is a comment in `App.jsx` saying exactly this); the three bottom tabs are Learn / Review / Reference;
the hash routes are owned by `lib/deepLink.js` with **two** call sites in `App.jsx` and no other file
referencing it; **11** S&P sectors and **6** FRED readings; and no component carries a hex.
**Eleven claims were measured FALSE**, the four that matter being:

| the summary said | measured 2026-09-01 |
|---|---|
| "17 lessons, 12 macro/cycle-theory + 5 personal-finance" | **44** lessons |
| "17 **sequential** unlocking lessons" | **three independent tracks**, gating only within a track |
| "inline charts on the **4** lessons that teach a diagram" | **14** (`LESSON_VISUALS`) |
| "`theme.js` — design tokens (color…). No inline hex anywhere else" | `theme.js` holds **0** hex; the values are 87 custom properties in `index.css` |

The rest: `lib/`, `components/` and `content/` were listed as file inventories and each had gone stale
(no `analytics.js`, `chunkError.js`, `lessonIdMigration.js`; no `ErrorBoundary.jsx`, `GlossaryTerms.jsx`,
`PolicySim.jsx`; no `lessonContent.<track>.<lang>.js`, `lessonTerms.js`, `moneyVisuals.js`,
`policyScenarios.js`, `quizMeta.js`, `quizText.<lang>.js`, and `quizData.js` named as the single quiz
source when the answer key moved out of it); "five sub-screens" against six files; and the blindspot
paragraph described **10.1/10.2/10.3 as though they were the register**, when §10 has ten entries and
**10.4 through 10.10 are open** — including 10.8 and 10.10, which are what the W-6 block is about.

⛔ **THE FIX IS THE RULE, NOT THE NUMBERS, and that is the whole point of the run.** Replacing "17"
with "44" restores the section to exactly the state it was in on 2026-08-04: correct, and one content
change from being wrong again. The failure is not that nobody updated the figure; **it is that the
figure was retyped in this file when `npm test` prints it on every run.** So the rewritten section
**carries no count that a script generates** and cites the generator instead — the readiness line, the
MEASURED log-size line, and §2.5's track ranges, which are generated and checked. The counts it does
keep (three tabs, five languages, two call sites) are structural invariants, each re-measured above.
The one count I wrote and then deleted was "ten entries" in the blindspot pointer: §10 is the register,
and a paragraph that counts it will be wrong the day an eleventh is filed.

**Also fixed, and it is the same defect one line higher: the file preamble said this agent "runs every
3 hours".** The cadence is the owner's lever, they move it deliberately, and the task file is explicit
that the cron is the truth and the documentation goes stale. A number that is not allowed to be
investigated and not allowed to be restored **must not be written down here at all**, so the preamble
now says the schedule is the owner's and says why it is not restated. **The live cron was not read and
was not touched.**

**The archiving pass, committed separately (`85273c2`) so that W-5.3's "one commit that touches nothing
else" holds.** 2026-08-30 and 2026-08-31 moved — **18 entries, 181,059 b**. Run log **246,225 → 65,166 b**
(98.5% → **26.1%** of warn; **0.34 → 16.7** runs of headroom). The date clause was a **no-op for the
sixth time**: the most recent review boundary is 2026-08-30 and nothing in the log predated it, so the
trigger acted on was again the measured budget. **Two days were moved where one would have cleared the
budget**, which is recorded in W-5.3 as a judgment to repeat or refuse rather than inherit — one day
buys about 7 runs at the measured +11,052 b/commit of writing, half a day at this cadence.
**The verification is the containment proof, not the suite.** W-5.3's own note says `npm test` cannot
detect archive loss, so:
- **18/18** moved entries present **verbatim** in the archive and absent from the live log, re-derived
  from `git show HEAD:AGENT_LOG.md` rather than from the transform's buffer — so a reviewer who was not
  present can reproduce it from the repo.
- **Two plants, both fired.** One character changed inside a moved entry → **17/18, exit 1**. A whole
  **6,058 b** entry deleted from the archive → **17/18, exit 1**. Both were written to scratchpad copies
  of the archive; the file itself was never corrupted.
- ⚠️ **The archive's own title had been stale since the 2026-08-29 pass** — `(2026-08-01 → 2026-08-28)`
  on a file holding entries through 08-29. Two passes had that file open and neither read its first
  line. Corrected to 08-31.

**Adversarial self-check (step 5) — run in full; it found no conflict, and here is what was actually
checked rather than a claim that it was.** *Blindspot register:* `npm run check-blindspot` **PASS, 0
failures**. No learner-facing string changed this run: `git diff --stat` against the archiving commit
names **only `AGENT_LOG.md`**, and `npm run build` exits **0**. §10.2 is *named* in the summary as
the title of blindspot 10.2, exactly as the paragraph it replaces named it; that is a register pointer,
not Dalio framing. §10.3's parent-facing posture and "no run may make it" are preserved verbatim in
substance. §2.3: the dated figures added are audit dates in an internal log, not app surfaces, and the
scan over the 26 teaching-copy modules passes. *DECISIONS.md conflict:* none — the summary asserts
`localStorage`-only state, `.js`-not-JSON content and Vite-not-Expo, and all three are the live entries
(`DECISIONS.md` §"Content as `.js` modules, not JSON", §"localStorage-only progress…"). Its two outbound
pointers were resolved rather than assumed: "Notes for future runs" exists, and `DECISIONS.md`'s
"see the App summary" for the relative-strength formula still lands on a sentence that says it.
*Already-done backlog item:* **no** — `grep` for "App summary" across the live log finds no open item
for it; the only prior rewrite is the 2026-08-04 one this replaces, recorded in the backlog preamble.
*W-6.2 rule 3 / W-6.3:* **no check was built and none is due** — this run adds **0 lines to `scripts/`
and 0 to `src/`**, so the 2.3x instrument-to-app ratio is untouched, and a guard that re-measured the
summary's prose would be an instrument for a document only agents read.
*My own verification claim:* every figure above comes from committed code against committed content —
`npm test`, `npm run build`, `node scripts/check-log-size.mjs`, the §-reference count with its two
controls, and the containment script with its two plants. An independent reviewer re-running them gets
these numbers.

⚠️ **The honest cost, stated because W-6.4 is about exactly this.** The rewritten section is
**4,737 → 6,485 b**, and the W-5.3 pass record adds **1,573 b**: the floor goes **325,444 → 328,919 b**,
still the only budget over its limit and still only a backlog compression pass can move it (**item 115,
the owner's**). That is less than one commit of the measured +2,282 b/commit floor growth, spent on the
section with the highest read-to-byte ratio in the repo — but it is spent, not saved.
⚠️ **One stale figure is deliberately left alone:** item 115's floor decomposition quotes
"App summary **4,737**". It is a dated measurement inside a completed item, so §31 applies and it stays
verbatim rather than being quietly re-pointed at 6,485.

**Next run should pick from the launch plan or the owner-facing block; nothing was filed for it to
inherit, and no numbered item was created (W-6.2 rule 2).** §2.2 is now audited and clean, so it is
spent as a pick. The unaudited actionable clauses left are **§7 (6 references)** and **§4.6 (8)**.
**O-1 remains the entire critical path** — 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app. **O-3** unchanged: no translated prose was added or altered.
**Owner tree at start and end of run: the owner's untracked `UIUX/`, untouched, as in the previous
thirteen runs.**

### 2026-09-01 (scheduled dev-agent, self-picked from a §-reference count) — every learner's review schedule was keyed by a question's POSITION in an array, so an ordinary content edit would have re-pointed it at different questions, and the only thing holding the line was a comment asking authors to append

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous run closed a `kidsContent`
translation gap and wrote: *"Next run should pick from the launch plan or the owner-facing block. Item
161 is filed but must not be taken by default."* I did not take it, and I did not take 160 either. I
re-ran the §-reference count that run used, on my own instrument (`§N` occurrences across
`LAUNCH_PLAN.md`, `AGENT_LOG.md`, the archive, `scripts/`, `src/`, `DECISIONS.md`), with §2.3 at
**240** as a live control and a nonexistent-token control returning **0**. §2.6 was just done; §4.0/
§4.4/§4.5 are owner clauses. **§3.3 (17) and §9.3 (16) were next** — but §3.3's notification gap was
closed 08-31 and §9.3's monthly audit is not due until the first Saturday (09-05), which is also
every open `CLAIMS.md` check date, so neither was overdue. I then counted module mentions instead:
`PolicySim` (14) / `policyScenarios` (10) are the least-audited learner-visible feature in the app,
and `CLAIMS.md` A7 names them as the §3.0.4 differentiator.

**PolicySim was audited and is CLEAN — reporting that, because a search that finds nothing is a
result.** All three guards its header claims actually exist (`check-data.mjs` §13c, §19,
`check-blindspot.mjs`'s §2.3 teaching-copy list — grepped, not assumed); `lessonId: 35` still resolves
to "Interest Rates: The Master Signal" despite two renumberings; all five `policySim*` locale keys are
present and rendered. **One false figure found and corrected inline** (2 characters, in a file this
commit already changes): `LessonReader.jsx`'s comment said the simulator "renders nothing for the 39
lessons that host no scenario" — measured, it is **43** (44 lessons, 1 hosts a scenario). Filing a
2 KB backlog item for that would be exactly the floor growth W-6.4 describes.

Reading §19 is what produced the real pick: it validates that every question field is **present**, and
one file over, `quizMeta.js`'s header said in capitals that **array order is load-bearing because
`review.js` keys persisted Leitner state by a question's index**. A capitalized comment is not a guard.

**Step 3.5 — the premise was mine to make, so it was measured by injection, with a control, before
any edit.** There was no backlog item to re-measure; the claim to establish was *"nothing detects a
reorder."* An instrument that silently returns nothing certifies a corpus as clean, so the rewriter
itself was validated first: it parses each of the six quiz modules, re-serializes the array, and was
proven to **round-trip all six byte-identically (`cmp`, silent)** before any mutation was trusted.
- **Defect probe:** swap questions 0 and 1 in `quizMeta.js` **and all five `quizText.<lang>.js`** — a
  reorder that keeps every field valid and every length equal. `npm test` exits **0**, **0 failures**.
  The injection is shown to have landed (`quizMeta[0]` reads lesson 30; `quizText.en[0]` reads the
  other question's text).
- **Control:** `quizMeta[0].answer = 99` in the same file. `npm test` exits **1** —
  `FAIL: quizData[0].answer: index 99 out of range for 4 options`. So the suite genuinely reads these
  files and simply had nothing to say about their order.
- Also measured: `grep -c quizMeta scripts/*.mjs` = **0**. No script imports the module at all.
- **The append-only rule had in fact been honored** — `quizMeta.js` has two commits in its life and
  `b6c9bc9` was 16 insertions at the end, 0 deletions. The property held; nothing enforced it.

**THE FIX IS THE CLASS, NOT A GUARD, and that was a deliberate choice.** A check forbidding reorders
would have preserved the cost that made this bad — under append-only, **deleting a bad question is
unsafe** — in order to protect a key shape that was never worth having. So `quizMeta` now carries a
stable opaque `id` (`q001`…`q046`, assigned once in current order, never reused), `review.js` keys by
it, and both screens pass `question.id`. Ordering is now only a build-time alignment with the
`quizText` modules, where a mistake shows up as visibly wrong words rather than as silent damage on
someone's device. **A one-time migration** maps old numeric keys through "index *i* meant the id now
at *i*" — correct for any state written before today — and needs no new `localStorage` key, because
an already-migrated object has no numeric keys and is returned unchanged.

**The two-direction measurement, which is the learner-visible statement.** Both schedulers were run
side by side on one learner's saved state, before and after two questions are swapped:

| | before the reorder | after the reorder |
|---|---|---|
| index-keyed (HEAD) | asks `q001` (lesson 29) | **asks `q002` (lesson 30)** |
| id-keyed (this commit) | asks `q001` (lesson 29) | asks `q001` (lesson 29) |

They agree before the swap, so the probe is not merely always disagreeing. **The learner answered
lesson 29's question; the old scheduler brings back lesson 30's.**

**Five plants, because a check that cannot fail is decoration. Exit codes quoted, not inferred.**
(1) duplicate id → **exit 1**, `quizData[1].id "q001" duplicates quizData[0]`; (2) `dueQuestions`
reverted to index keying → **exit 1** on the reorder assertion; (3) `migrateIndexKeys` stubbed to
return its input → **exit 1**; (4) `Practice.jsx`'s call site reverted to `recordReview(item.index,…)`
→ **exit 1**; (5) the call renamed so the scan sees nothing → **exit 1**, *"either the screen stopped
recording answers or this check has gone blind."* Every plant restored from a scratchpad copy, never
`git checkout --`, and each restore verified byte-identical with `cmp`.

⚠️ **Plant 2 refuted my own first version of the test, and that is the durable part of this entry.**
The assertion was `eq("a reorder does not re-point…", after, before)`. Under index keying both sides
are **empty arrays** — the state is id-keyed, so an index lookup finds nothing — so `after === before`
**passed on the exact defect it existed to catch.** A same-shaped comparison is satisfiable by two
nothings. It now asserts both sides against the expected id (`[[q001],[q001]]`) and fails under the
plant. **This is the "your instrument must not be vacuously satisfiable" lesson arriving inside a test
written by the run that was hunting that very failure mode**, and it was caught only because the plant
was actually run rather than reasoned about.

**Render proof, and the substitute for the one I cannot run.** No dev server: this session is
unattended and the harness refuses it, so there is no screenshot. Instead the built bundle was
grepped: **46 `id:"qNNN"` literals ship in `dist/assets/index-*.js`**, `q001` and `q046` both present,
**with a negative control** — `q999`, a string I did not add, is absent, so the grep is not matching
everything. `npm run build` exits **0**.

**Adversarial self-check (step 5) — run, and it FOUND ONE REAL CONFLICT, which is fixed in this
commit.**
*DECISIONS.md conflict — yes, and it is the one that mattered.* The 2026-08-14 lesson-renumbering
entry closes: *"The Leitner review schedule (`ecycles_review`) needed no migration — it's keyed by a
question's array index in `quizData`, never by lesson id."* That sentence is now false. **It is a
dated record, so it is left verbatim** and a new dated 2026-09-01 note is appended beneath it — the
rule this repo carries in §29's own failure message, and the same rule that protected the "1/12"
verification note above it. The old bullet is also the best available evidence for *why* the index was
a hazard: the schedule survived a **lesson** renumbering precisely because it never referenced a
lesson, and had no defense at all against the **question** list moving.
*Blindspot register:* `npm run check-blindspot` **PASS, 0 failures**. No Dalio (§10.2), no
advice-adjacent language (§10.1 — no learner-facing prose changed at all this run; every string added
is an opaque id or a source comment), kids framing untouched (§10.3), and §2.3's live-looking-date
scan passes over `quizText.<lang>.js`, which this commit edits the headers of.
*localStorage decision:* unchanged and deliberately so — still client-side only, still one key
(`ecycles_review`), **no new key added**, so §27's `KEYS`-vs-`DECISIONS.md` check is unaffected.
Content is still `.js` modules; nothing platform-level touched.
*Already-done backlog item:* not a redo. `grep` for prior work on review keying across `AGENT_LOG.md`
and the archive returns **nothing**; item 48 split the quiz by language and moved the answer key into
`quizMeta.js` but never touched the schedule's key shape.
*W-6.2 rule 2:* nothing is filed as a numbered item by this run, so the rule does not bite.
*W-6.2 rule 3 — the learner-visible sentence the new check must name:* **"a learner who has been
reviewing for three weeks opens Practice after a content update and is asked a question they have
never seen, treated as nearly mastered, while the question they keep missing has silently inherited a
16-day interval."** For §8b's call-site half the sentence is sharper still: pass a position instead of
an id and **every answer lands under a key nothing reads back, so Practice stays permanently empty
however much the learner answers.**
*W-6.3 — the ratio, re-measured on the wide basis rather than quoted:* the previous entry established
`scripts/*.mjs` + `scripts/*.js` at **16,321** against **7,101** for `src/` minus `content/` and
`locales/` = **2.298x**. Re-measured after this change: **16,402 / 7,146 = 2.295x.** This run adds
**81 lines to `scripts/`** against **45 to `src/`** — it is the rare change that moves the ratio
*down*, and the check it adds is the smallest of the two options it chose between.
*My own verification claim:* an independent reviewer re-running `npm test`, `npm run build`, the two
step-3.5 injections, the five plants and the side-by-side probe gets these exact figures. The 46, the
43 and the two probe outputs are produced by committed code against committed content; the old
scheduler in the probe is `git show HEAD:src/lib/review.js`, so it is reproducible by someone who was
not present for the run.

**Next run should pick from the launch plan or the owner-facing block.** Nothing was filed for it to
inherit. **O-1 remains the entire critical path** — 44 lessons, five languages, 160 minutes, and zero
people have ever opened this app. ⚠️ **An archiving pass is due next run:** before this entry the run log
stood at **234,806 b, 93.9% of its warn budget, 1.39 runs of headroom**; with it the log measures
**246,225 b, 98.5%** (`check-log-size.mjs`, both figures run 2026-09-01). It does **not** cross the
warn budget — I checked rather than assuming, having written the sentence the other way first — but
it leaves **under one run** of room, so the next entry does. The floor is unchanged at **325,444 b against 250,000 b** and only
a backlog compression pass can move it (item 115, the owner's).
**Owner tree at start and end of run: the owner's untracked `UIUX/`, untouched, as in the previous twelve runs.**

### 2026-09-01 (scheduled dev-agent, self-picked from LAUNCH_PLAN §2.6 — the least-referenced learner-visible section) — the parent guide's Spanish told parents that borrowing for a growing business is GOOD debt, because the clause defining good debt was never translated, and the check that certified this file measures presence

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous run closed item 160's first
tranche and said plainly: *"Next run should pick from the launch plan or the owner-facing block. Item
160 is filed but must not be taken by default."* I did not take it. I started from a §-reference count
across `LAUNCH_PLAN.md`, `AGENT_LOG.md`, the archive and `scripts/` — **§4.4 (2), §4.5 (4), §4.0 (11)
and §2.6 (15) are the least-referenced**, and the first three are owner/monetization clauses no run can
move. **§2.6 is the only one that is learner-visible**: `kidsContent.js`, rendered on
Reference → For parents, 21 blurbs in five languages, and `git log` shows it has been audited for
**blurb count and framing** (2026-08-07, 2026-08-15/16) and for **§10.3 adult-addressing** — never for
whether its translations carry what the English says.

**Step 3.5 — the premise was mine to make, so it was measured before any edit, with four controls.**
There was no backlog item here to re-measure; the claim I had to establish was that the file's
translations are incomplete. A ratio instrument that silently returns nothing certifies a corpus as
perfectly clean, which is exactly the false clean bill this file has been getting, so the scorer was
validated first: **positive** (every translation a verbatim copy of its English → 0 flagged);
**negative** (one known-complete unit truncated to 20% → flagged in 4/4 languages); **code points, not
bytes** (`cp("经济需要两者")=6` against 18 bytes — a byte-counting scorer reports every CJK translation as
abridged); **degenerate** (all units equal length → 0 flagged). All four fired before any figure below
was believed.

**The finding. 38 of 204 translated strings carried under 70% of what a full translation into the SAME
language carries** — and `check-data.mjs` §5 has passed on this file every run since it was written,
because **§5 asserts that every field is present and non-empty, which is not the same as carrying the
content.** §33 makes exactly that distinction for lesson bodies; it reads `lessonContent` only.
**Neither `translation-completeness.mjs` nor `translation-review.mjs` contains the string
`kidsContent` (0 occurrences, checked)** — so the ledger that reports *"es 100% reviewed"* has never
included this corpus, and items 93/94 never covered it. This is not a duplicate of that work.

**The mechanism is authoring date, not language, which is why it went unnoticed.** The strings written
2026-08-07 — each band's first three blurbs plus every `activity` and `parentTip` — were authored with
condensed translations; everything added 2026-08-15/16 (the `why` fields, the money-skills blurbs) is
translated in full. Every run since has looked at a file whose newer half is impeccable.

**Three of the Spanish losses changed what the app TEACHES, not just how much of it.** This is the part
that made the run a content fix rather than only an instrument:
- **`9-12.lessons[2]`** dropped *"If you earn more than the loan costs"*. The Spanish read *"Si tu
  puesto de limonada va bien y pides prestado para uno más grande, ¡eso es deuda BUENA!"* — **the
  condition that defines good debt was gone, so the blurb taught that borrowing for a growing business
  is simply good.**
- **`13-17.lessons[2]`** dropped *"it created a deleveraging — the first in 75 years"* — the concept
  the blurb exists to name, and the app's own cycle framing.
- **All three `parentTip`s lost the technique they were telling the parent to use.** *"Use allowance as
  a teaching tool: help them divide money into 'Spend,' 'Save,' and 'Give' jars"* shipped in Spanish as
  *"Usa la mesada como herramienta de enseñanza."* — a parent was told to use a tool and not told what
  it was.

**Shipped — 19 Spanish strings and one guard.**
- **`src/content/kidsContent.js`, Spanish only: `es` 17 flagged → 0.** Applied by exact-match
  replacement per string, each asserted to match **exactly once** (a regex over this file hits the
  wrong band), then two of my own wordings corrected before commit: `Muéstrenle` → `Muéstrale` (an
  *ustedes* form had crept into a sentence that tells the parent to show the child, against the file's
  *tú* convention in every other `parentTip`), and `emitió` → `imprimió` (the original said "printed";
  changing the verb was gratuitous).
- **Spanish only, deliberately, and the limit is O-3.** Completing ko/zh/ja means new prose in three
  languages no fluent reader has checked. Spanish was completed because it is one language, it was the
  systematically abridged one, and its omissions were changing meaning — and **even that is inside
  O-3's scope to re-affirm or cap.** The remaining 21 pairs are item 161 and are not a run's to take.
- **`scripts/check-data.mjs` §66**, five controls, **warning rather than failing** (21 pairs remain and
  the head of them is an O-3 decision, so a failing threshold would block every commit on work a run
  must not do).
- **The blind spot is asserted as a control, not left as prose.** A corpus abridged EVENLY in every
  unit moves its own p90 and reads as clean here; control 3 pins that behavior so that if the
  reference calculation ever changes, the section's warnings stop meaning what its comment says.
  §33's recorded baseline is what catches uniform decay, and `kidsContent` has none.

**The instrument's error bars, recorded because a screening proxy presented as a verdict is the defect
this log keeps finding.** It has **both** error directions and every flagged pair was read before being
believed. **False positives:** `13-17.parentTip` scores `zh 0.23` and is a **complete** translation; the
three `title`s scored ~0.35 and are complete — a three-word title has no clause to drop, so its ratio
measures word-length convention. §66 therefore excludes units under 40 code points and **controls that
exclusion** (control 5 re-derives the gap: the three titles are 15-20 code points, every other unit
≥ 95, and the check fails if a non-title is ever excluded or the gap closes). **False negatives:**
`13-17.lessons[1]` `ko` silently drops *"But it takes 12-24 months to feel the change!"* and never
flagged. **17 of the 38 were `es`; the ratio found them, reading them is what established they were
real.**

**Verification — every figure reproducible by re-running only these commands.** `npm test` exits **0**
(0 failures, 4 warnings: the three standing ones plus §66's new line). `npm run build` succeeds in
**1.09s**, exit **0**. **The pre-fix 38/es-17 is reproducible from the committed instrument against the
pre-fix content, not from this run's scratch work:** restoring `kidsContent.js` to its HEAD state
(sha256 `0c2477dc1ef530768759ddacf5ad4244a156df71d305704a87f4091e4c573ae2`) and running the **committed**
§66 reports `38/192 (es 17, ko 6, zh 5, ja 10)`, matching the throwaway probe that found it; restoring
the fix reports `21/192 (es 0, …)`. Two independent instruments, one of them committed.
**Plants, because a check that cannot fail is decoration:** (A) the scorer stubbed to return no flags →
§66 fails its negative control, `check-data.mjs` exit **1**; (B) `cp()` switched to `Buffer.byteLength`
→ §66 fails its code-point control, exit **1**. **Exit codes are quoted explicitly** rather than
inferred from stdout. Both restored from scratchpad copies, never `git checkout --`, and verified
byte-identical with `cmp`.
**Render proof, and the substitute for the one I could not run.** A previous run's finding — a locale
key that shipped in five languages and was rendered by nothing — is the trap here, so it was checked
first: `ParentGuide.jsx` renders `lesson.text[lang]`, `lesson.why[lang]`, `activity[lang]` and
`parentTip[lang]` at lines 56/58/66/67. **The dev server could not be started — this session is
unattended and the harness refuses it, so there is no screenshot.** Instead, four of the completed
Spanish strings were grepped out of the built bundle and are present in
`dist/assets/Reference-*.js`, the chunk ParentGuide ships in, **with a negative control** (a string I
did not add is correctly absent, so the grep is not matching everything).

**Adversarial self-check (step 5) — run, and it found nothing that required a change.**
*Blindspot register:* `npm run check-blindspot` **PASS, 0 failures**, including §10.1's 8-surface
disclaimer assertion, §10.2 (no Dalio — none touched), §10.3 (`kidsParentIntro`/`refParentsBlurb` still
address an adult; my strings are the blurbs a parent shares, and the framing fields are untouched), and
§2.3's live-looking-date scan. The dates I added — "2008", "75 años", "12 a 24 meses" — are historical
and already present in the English.
*DECISIONS.md conflict:* none. Content stays `.js` modules; no state or platform decision touched.
**The one that needed checking: DECISIONS.md scopes kids content as parent-facing and explicitly
discourages growing the blurb count by default.** Re-measured after the change: **7 / 7 / 7 = 21
blurbs, unchanged** — this run completed translations of existing strings and added no blurb, so
§2.6's published "21 blurbs total" figure also stays true.
*Already-done backlog item:* not a redo of items 93/94 — both are `lessonContent` work, and the two
instruments that implement them contain **0 occurrences** of `kidsContent` (grepped, not assumed).
*W-6.2 rule 2:* item 161 is numbered rather than parked because it has **21 live instances**; that rule
parks residuals measured at *zero* live instances.
*W-6.2 rule 3 — the learner-visible sentence a new check must name:* **"a Spanish-speaking parent opens
For parents and reads that borrowing for a growing lemonade stand is GOOD debt, with the condition that
makes it good deleted."** Written, and it is why this is a check and not a note.
*W-6.3 — the ratio, re-measured rather than quoted:* the previous entry recorded `scripts/` at 13,435
against 7,101 for the app (1.89x). **Re-measured this run: `scripts/*.mjs` 13,626 against src/ 7,101 =
1.92x.** ⚠️ **Correcting the basis, because the number is about to look like it jumped:** that figure
counts `scripts/*.mjs` only; **including `scripts/*.js` (`a11y-states.js`, `a11y-sweep.js`, 2,695
lines) the real ratio is 16,321 / 7,101 = 2.30x**, and W-6.0's original 15,480 was on the wider basis.
The two recent entries have been quoting the narrower one against W-6.0's wider one, so **the reported
fall from 2.35x to 1.89x was partly a basis change, not only progress.** This change adds **191 lines
to `scripts/`** and **0 net to `src/`** (19 Spanish strings got longer; 38 lines changed, 19 of them
deletions of the old strings).
*My own verification claim:* an independent reviewer re-running `npm test`, `npm run build`, the two
plants and the HEAD-content restore gets these exact figures; the 38 and the 21 are produced by the
committed instrument against committed content.

**Next run should pick from the launch plan or the owner-facing block. Item 161 is filed but must not
be taken by default** (W-6.2 rule 1) — and its open half is an O-3 decision, not a run's.
**O-1 remains the entire critical path** — 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app. **The run log is at 89.1% of its warn budget with ~2.5 runs of
headroom** (`check-log-size.mjs`, measured this run), so **an archiving pass is due within about two
runs** — sooner than the previous entry's estimate.
**Owner tree at start and end of run: the owner's untracked `UIUX/`, untouched, as in the previous eleven runs.**

### 2026-09-01 (scheduled dev-agent, self-picked — the quiz is the least-audited learner-visible subsystem) — the quiz can be beaten without reading a lesson by tapping the longest option, which scored 87%; the guard that exists for exactly this defect measures the other channel

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous run closed a dead locale key
and said plainly: *"Next run should pick from the launch plan or the owner-facing block. Nothing here
is queued."* Nothing here is queued. I started from a §-reference count across `LAUNCH_PLAN.md`,
`AGENT_LOG.md`, the archive and `check-data.mjs` — **§9.4 and §9.5 have zero references and §4.4 has
one**, but all three are owner/process clauses no run can move. The least-audited *learner-visible*
subsystem is the quiz: 46 questions feeding both the end-of-lesson check (§3.2's "small win") and the
entire Leitner queue, and `git log`/`AGENT_LOG` show it has been audited for **answer-index spread**
(2026-08-02) and for **a11y markers** (2026-08-30) and never for anything else.

**Step 3.5 — four hypotheses measured, THREE REFUTED, and the refutations are why this run's finding is
not the one I set out to make.** Recording them because a run that reports only its hit is claiming a
hit rate it does not have.
1. **REFUTED — cross-language option misalignment.** `quizMeta.js` holds the answer key once while
   option TEXT lives in five separate `quizText.<lang>.js` files, and three file headers call the
   index alignment "load-bearing". §3 guards only lengths and option counts, so a one-entry drift in
   one language would ship a wrong answer key to that language's learners. **Measured: clean.** Every
   numeric token in every question stem and every option position, en vs the other four — 47 flagged
   pairs, and on reading all 47 are benign: CJK myriad grouping (`$120,000` → `12만`/`12万`), Korean and
   Japanese SOV reordering, and English words where CJK writes digits (`One week` → `1주일`/`1週間`).
   **The numeric proxy has a false-positive rate near 100% and is not a usable alignment instrument** —
   recorded so the next run does not rebuild it.
2. **REFUTED — a wrong answer key.** All 46 keyed options read and checked against their own question
   and `explain`, including the arithmetic ones: Rule of 72 at 9% → 8 years (q16 ✓), 3% nominal less 5%
   inflation → ≈ -2% (q22 ✓), $2,000 at 6% for 10 years → +$1,582 vs the stated "roughly $1,580"
   (q31 ✓), a 1.00% fee gap over 30 years → 1.01⁻³⁰ ≈ 0.74, "roughly a quarter" (q24 ✓). No key is wrong.
3. **REFUTED — the keyed option drifting in translation.** All 46 keyed options read in all five
   languages: every one is a faithful translation of the English. **This is the one place a run can say
   something concrete about O-3's unreviewed-machine-translation risk, so it is worth the line: on the
   46 strings where a translation error would be maximally expensive — the graded answer — the machine
   translations are correct.** That is 46 strings of ~150,000 characters and settles nothing about the
   rest; it is not a review.
4. **CONFIRMED, and severe — a second surface cue nobody had measured.**

**The finding.** **Always tapping the LONGEST option scored `en 40/46 = 87.0%`, `es 84.8%`, `ko 84.8%`,
`zh 82.6%`, `ja 82.6%`, against a `25.0%` chance baseline.** 40 of 46 questions have the correct option
as the strict longest. A learner who has read nothing clears every end-of-lesson check, builds a
streak, and fills a spaced-review schedule that certifies an understanding never tested.

**Why every existing guard reported the quiz as clean, which is the durable part.** §3 already warns on
this exact class, and its message says so: *"a user who always taps that option would score suspiciously
well."* It exists because of a real 2026-08-02 finding — 12 of 13 answers at index 0, **tap-the-first
scored 92%** — which the owner had fixed out of priority. **§3 guards the strategy that was FOUND, not
the class it belongs to.** Position is one channel a learner can read without understanding the
material; length is another. The index spread has been clean ever since (28.3%, against §3's 50% line)
and reported clean every run, while a second channel sat 8 points below the one that was treated as a
defect worth an emergency fix. **A guard written from an instance covers the instance.**

**The cause is structural, not a handful of sloppy items.** The correct option carries its own
justification — *"…, since its policyholder absorbs more of the smaller losses"* — while the distractors
stay bare assertions. **That justification is already in the `explain` field the learner is shown the
moment they answer**, so in the gratuitous cases it is duplicated text that also leaks the answer.

**Controls — six on the scorer, all fired, before any figure above was believed.** A scorer that
returned 0 would report this corpus as perfectly clean and a scorer that returned 1 would condemn any
corpus; both look finished from outside. Positive (correct always strictly longest → 100.0%); negative
(always shortest → 0.0%); degenerate (all options equal length → 0.0%, since a shared maximum is not a
cue); **chance baseline** (answer spread uniformly over four distinct lengths → 25.0%, which is where
the 25% in every figure above comes from rather than from arithmetic); and a CJK-vs-Latin specimen
proving it counts **code points, not bytes** — a 2-character Chinese option must not outrank a
10-character Latin one, and a byte-counting scorer inverts exactly that. **In-corpus negative control:
six English questions where the correct option is NOT longest scored as such.**

**Shipped — 20 content edits and one guard.**
- **`src/content/quizText.{en,es,ko,zh,ja}.js` — 4 questions × 5 languages, every edit a clause
  DELETION, never new prose in an unreviewed language.** q12 `VIX (Volatility Index)` → `VIX` (the only
  option of four carrying a parenthetical, against bare `GDP`/`CPI`/`PMI`; ratio 7.33x, the corpus
  worst — and nothing is lost, `glossary.js` defines VIX in all five languages). q21 dropped *", since
  its policyholder absorbs more of the smaller losses"*, leaving the correct option **exactly** its
  sibling's length in all five languages (en 43/43, es 52/52, ko 22/22, zh 12/12, ja 15/15) so the two
  differ only in `lower`/`higher`, which is the whole question. q37 and q43 dropped their trailing
  justifications likewise. In `ko` and `ja` these clauses lead rather than trail — the deletion is at
  the front of the string, which is why this was done by exact-match replacement per language and not
  by one regex.
- **`scripts/check-data.mjs` §65** — the measurement, with the six controls asserted in both
  directions, warning above §3's own 50% line. **It warns rather than fails**: 40 of 46 questions are
  affected, so a failing threshold blocks every commit until a five-language content pass lands, and
  part of the remainder may never be a run's to make (item 160(b)).
- **Both directions are measured on purpose.** Trimming a correct option too hard just inverts the tell
  — "the short one is right" is the same defect wearing the other face. The shortest-option strategy is
  scored by the same function against the same threshold, and this run's edits left it flat: **en 0.0%
  → 2.2%, ko 0.0%, ja 2.2% → 4.3%**, all far under 50%.

**Result: `en 87.0% → 78.3%`, `es 84.8% → 76.1%`, `ko 84.8% → 76.1%`, `zh 82.6% → 73.9%`,
`ja 82.6% → 73.9%`.** Four questions, ~9 points in every language. **This does not close the defect and
the entry does not claim it does** — item 160 carries the remaining ~36 with the two kinds they split
into, and §65 prints the live figure every run so it cannot drift back quietly.

**What was deliberately NOT changed, because the item is already well-designed.** q25 and q27 give
*every* option a "because…" clause — the shape is uniform and the correct one is only marginally longer
(in `ja`, q27's correct option is not even the longest). Trimming those would break the uniform shape
and buy a metric with a worse item. **The two heads of the remaining list, q40 (201 chars) and q41
(174), need the opposite fix — longer distractors — which means new machine-translated prose in four
languages nobody fluent has read. That is inside O-3 and a run must not enlarge that surface to move a
number.**

**Verification — every figure reproducible by re-running only these commands.** `npm test` exits **0**
(0 failures, 3 warnings: the two standing ones plus §65's new line). `npm run build` succeeds in
**1.09s**. **The pre-fix 87.0% is reproducible from the repo, not from a scratchpad script**: `git
archive HEAD` into a clean directory with only `scripts/check-data.mjs` copied over from this tree —
every content file HEAD's — and §65 independently reports `en 87.0%, es 84.8%, ko 84.8%, ja 82.6%,
zh 82.6%`, matching the throwaway instrument that found it. Two independent instruments, one of them
committed. **Plants, because a check that cannot fail is decoration:** (A) the scorer stubbed to
`return 0` → §65 fails on 5 of its own controls, `check-data.mjs` exit **1**; (B) the language key
swapped to a nonexistent one → *"no questions could be read"*, exit **1**. Both restored from a
scratchpad copy, never `git checkout --`, and both verified byte-identical with `cmp` (sha256
`99c3a1a1db6146fe1f630b0d06c8f79dddd0dcb903066adbcedd36179c89093d`). **Exit codes are quoted
explicitly** because the previous run learned that a short-circuited `&&` chain and a clean run look
identical on stdout. A **true fresh clone** of this working tree (`git archive HEAD` + the seven
modified files, `node_modules` symlinked) runs the full suite to exit **0**, and so does untouched
`HEAD` — W-6.1 route (a) still holds.

**A control failure of my own, recorded because it is this log's own trap.** My first fresh-clone run
exited **1** on 7 §26 `path-ok` failures, and none of them were about my change: I had copied the two
gitignored `economic-cycles-v*.jsx` in, which makes those paths resolve and their markers read as
*stale*. **The Environment note already says not to do this, in bold, and predicts the exact failure
count.** I had followed the recipe at `AGENT_LOG.md:154` instead — a **dated record of what the weekly
review did on 2026-08-30**, when §26 still resolved against the filesystem and the copy was correct.
That line is a historical account and stays verbatim per §31; the live recipe is the Environment note.
**W-5.2's lesson — a candidate list is a claim about current state and goes stale like a figure —
applies to reproduction recipes too, and I re-learned it by walking into it.**

**Adversarial self-check (step 5) — run, and it found nothing that required a change.**
*Blindspot register:* every content edit is a deletion, and no removed clause was a hedge — §10.1's
hedges live in `explain` and lesson prose, both untouched (`npm run check-blindspot`: PASS, 0 failures,
including its 8-surface disclaimer assertion). §10.2 — no Dalio reference touched. §10.3 — no kids
surface touched. Markets stale-data rule — no rendered string gained a date; the `2026-09-01` and
`2026-08-02` in §65's comment are source-comment measurement dates, this file's existing convention.
*DECISIONS.md conflict:* none — content stays `.js` modules, no state or platform decision touched.
**One divergence found and deliberately not "fixed":** `drafts/income-hierarchy.en.md:178` quotes q43's
option in its pre-trim form. That file is the dated 2026-08-25 proposal `DECISIONS.md:687` cites as the
*source* of lessons 41-44, not a spec the shipped quiz must match; nothing asserts equality (§26 checks
the path exists, and the suite is green). Editing an approved dated proposal to match content that
evolved after it would falsify the record — §31.
*Already-done backlog item:* this does not redo the 2026-08-02 de-skew — that fixed the **index**
channel, and `quizMeta.js` is untouched by this commit (spread still `{0:10,1:13,2:13,3:10}`, 28.3%).
It is the sibling channel that fix never looked at.
*W-6.2 rule 3 — the learner-visible sentence a new check must name:* **"a learner who has read nothing
taps the longest option on every check, scores 87%, and the app records lessons complete, a streak, and
a review schedule for understanding it never tested."** Written, and it is the reason this is a check
and not a note.
*W-6.3 — the ratio, re-measured rather than quoted:* W-6.0 recorded `scripts/` at 15,480 lines against
6,589 for the app. **Re-measured this run: `scripts/` 13,435, app 7,101 — the ratio has fallen from
2.35x to 1.89x since W-6.0**, so the number W-6.3 asks the next check-builder to look at has moved in
the right direction and the quoted figure is now stale. This change adds **115 lines to `scripts/`**
and **0 net to `src/`** (20 strings got shorter).
*My own verification claim:* an independent reviewer re-running `npm test`, `npm run build`, the two
plants and the `git archive HEAD` baseline gets these exact figures; the 87.0% is produced by the
committed instrument against committed content, not quoted from this run's scratch work.

**Next run should pick from the launch plan or the owner-facing block. Item 160 is filed but must not
be taken by default** — W-6.2 rule 1, and its remaining head is an O-3 decision, not a run's.
**O-1 remains the entire critical path** — 44 lessons, five languages, 160 minutes of content, and zero
people have ever opened this app. **The run-log budget is at 83.6% of warn with 3.9 runs of headroom**
(`check-log-size.mjs`, measured this run), so an archiving pass is due in about four runs, not this one.
**Owner tree at start and end of run: the owner's untracked `UIUX/`, untouched, as in the previous ten runs.**

### 2026-09-01 (scheduled dev-agent, self-picked from LAUNCH_PLAN §3.5's languages clause) — a locale key that shipped in five languages for four weeks, rendered by nothing, and survived the sweep built to delete it because the sweep's only reader of it was a comment

**Pick, and why it is not a residual chain (W-6.2 rule 1).** The previous run closed item 159 (glossary
chips) and its own closing line says the next run must pick from the launch plan or the owner-facing
block, not from that entry. This run started on **§3.5's "English is the product; the other four
languages ship marked beta"** and asked the cheapest falsifiable question that clause implies: do the
five locale files actually agree with each other and with the code? Nothing here is any run's residual.

**Premise re-measured before any edit, with controls (step 3.5) — and the first two hypotheses were
refuted, which is what moved the pick to the third.**
1. **Placeholder parity across languages — clean.** 616 `en`→other string pairs, **0** mismatches, 0
   missing keys. A dropped `{n}` would render braces or swallow a number in one language; none does.
   (`npm test` §1b already guards this; the measurement agreed with it.)
2. **Code→locale, the direction that renders `undefined` to a learner — guarded, proven by plant.**
   Planted `t.zzyzxMissingKey` into `Learn.jsx`'s ResumeCard action: `check-data.mjs` §6 fails with
   *"src/screens/Learn.jsx references t.zzyzxMissingKey, but "zzyzxMissingKey" is not defined in
   TR.en"*. Restored from a scratchpad copy and diffed byte-identical against `HEAD` (sha256
   `c793512101426a15f6d871d3934399c56277e8486e3a7801387b7079f59ed2f8`), never `git checkout --`.
3. **`en`→one other language — also guarded, also proven by plant.** Deleted `startLesson` from
   `ko.js`: *"FAIL: TR.ko: missing key "startLesson" (present in TR.en)"*, `npm test` exit **1**.
   Restored byte-identical.
4. **The third direction — a key defined in all five and rendered by nothing — is NOT guarded, and had
   a live instance.** `viewAllLessonsTemplate` ("View all {n} lessons →", plus es/ko/zh/ja) is
   referenced nowhere in `src/` outside a **comment**, has no computed-key path that could reach it
   (the only dynamic locale accesses in the app are `t[tr.labelKey]`, `t[tr.blurbKey]` and
   `t[at.labelKey]`, all three track keys, all live), and **shipped in the main bundle**: `grep` on
   `dist/assets/index-BuXHag6V.js` returned `View all {n} lessons →`. It entered with `76be081`, the
   first monolith-split commit, and was never wired into the 2026-08-04 rebuild.

**Why the 2026-08-30 sweep missed it, which is the durable part.** That run (`96606d2`) deleted 18 dead
keys carried in all five languages and explicitly checked its own work with three controls. It read
`src/` as **raw text**, and `viewAllLessonsTemplate`'s only mention in `src/` is inside the JSX comment
in `Practice.jsx` that cites it as evidence for how `ko`/`zh`/`ja` write inline counts. **The key
vouched for itself**: a comment about a string is not a use of it, but to a text sweep the two are the
same bytes. Re-running that sweep's shape with comments stripped and with comments included, on `HEAD`,
gives **1 dead** and **0 dead** respectively — the difference IS the blind spot, reproducible in one
command.

**Controls, six, all fired before any number above was believed** — a sweep that returns nothing looks
exactly like a clean result. (a) positive: `disclaimer`, which §10.1 requires on eight surfaces, reads
live; (b) negative: a fabricated `zzyzxNotAKey` reads dead; (c) dynamic path: all 3 track `labelKey`s
(`trackEconomy`, `trackMoney`, `trackEssentials`), reachable only as `t[tr.labelKey]`, read live — this
is the control the 2026-08-30 run needed and the one a naive sweep fails; (d) the comment stripper
keeps `//` inside a string literal; (e) and (f) it does remove a line comment and a block comment.

**A control failure of my own, recorded because it is the same genre.** The first attempt at plant 3
printed no test output at all and looked like a pass. Cause: `grep -c` exits **1** on a count of zero,
so the `&&` chain short-circuited and `npm test` never ran. **A command that did not execute is
indistinguishable from a command that found nothing** unless you check the exit code — which is why
plant 3's result above quotes `npm test`'s exit status and not just its stdout.

**Shipped — 5 deletions and one comment repair; nothing added to `scripts/`.**
- `src/locales/{en,es,ko,zh,ja}.js` — `viewAllLessonsTemplate` deleted. 154 → **153** keys.
- `src/screens/Practice.jsx` — the comment that cited it. Its two claims were half-anchored to the dead
  string, so both were **re-anchored to live strings**: the inline-count claim now cites
  `reviewDueTemplate` alone, quoting all three of ko/zh/ja verbatim; the spacing claim now contrasts
  `zh`'s `"{n} 题待复习"` (spaced) with `estMinTemplate`'s `"约{n}分钟"` (unspaced) instead of with the
  deleted string. Its live figure "(14 keys)" is now **13**, which `npm test` §1b prints independently
  rather than my arithmetic. Four lines record why, so the next author cites live strings only.

**Verification — every figure below is reproducible by re-running only these commands.**
`npm test` exits **0** (0 failures; the same 2 + 1 warnings as the baseline, the standing floor-budget
one among them). `npm run build` succeeds in **1.05s**. §1b's own line moved **14 → 13 locale keys carry
{placeholders}**. Bundle, measured against a `git archive HEAD` copy built with the same toolchain
rather than quoted from a previous entry: **252.48 → 252.21 kB raw, 90.77 → 90.69 kB gzip**. Both
deleted strings are absent from the rebuilt bundle (`View all {n} lessons` and `查看全部`). A
**fresh-tree copy of this working tree** — `git archive HEAD` plus the six modified files, `node_modules`
symlinked — runs the full suite to **exit 0**, and so does the untouched `HEAD` copy (W-6.1 route (a)
still holds). **No live DOM verification: `preview_start` refuses in an unattended scheduled run
("nobody is present to approve the command"), so the previous entry's note about this is confirmed
rather than assumed.** The render claim here needs none — it is a claim that something is *absent*, and
absence from the built bundle is the stronger evidence anyway.

**Why deleting and not building the affordance.** `Learn.jsx` renders every lesson inside per-track
accordions; there is no truncated list for a "View all" control to expand, and no §-clause asks for one.
Building an unrequested affordance to justify a relic is the inverse of the fix. This is the same
disposition the 2026-08-30 run reached for the nine prototype relics among its 18.

**No new check was built, deliberately (W-6.2 rule 3 + W-6.3).** Rule 3 requires one sentence naming the
learner-visible failure a new check would have caught. **For this direction that sentence cannot be
written honestly**: a dead locale key costs ~270 bytes of payload and is invisible on screen. The two
directions that ARE learner-visible — a blank where a label belongs — are both already guarded, proven
by plants 2 and 3 above rather than by reading the scripts. So the class stays unguarded on purpose,
the instance is fixed, and this residual is **not filed as a numbered item** (W-6.2 rule 2: zero live
instances after this commit, honest priority low). The recipe, if a future sweep wants it, is one
sentence: run the 2026-08-30 sweep with comments stripped, and carry control (c).

**Adversarial self-check (step 5) — run, and it found nothing that required a change.**
*Blindspot register:* no learner-facing prose was added or reworded anywhere — five strings were removed
and one source comment rewritten. §10.1 — `npm run check-blindspot` PASS, 0 failures, and the disclaimer
key is untouched. §10.2 — no Dalio reference touched. §10.3 — `kidsTabLabel` sits directly above the
deleted line in all five files and was **verified live** (`Reference.jsx:69`) before the edit, precisely
so a neighbouring-line deletion could not silently take the kids surface's label with it. Markets
stale-data rule — no rendered string gained a date; the `2026-09-01` in the new comment is a
source-comment measurement date, this file's existing convention.
*DECISIONS.md conflict:* none. `viewAllLessonsTemplate` appears in no decision, claim, README or plan
text (grepped); localStorage-only state, `.js`-not-JSON content and Vite-not-Expo are untouched.
*Already-done backlog item:* this does not redo `96606d2` — it removes a **nineteenth** key that run's
method could not see, and the two-way sweep above is the evidence that the miss was mechanical rather
than a judgment it made.
*My own verification claim:* an independent reviewer re-running `npm test`, `npm run build`, the two
plants and the `git archive HEAD` baseline gets these exact figures; the bundle deltas come from two
builds performed this run, not from any earlier entry.
*W-6.3 — the instrument-to-app ratio, quoted and re-measured:* W-6.0 recorded `scripts/` at 15,480 lines
against 6,589 for the app. This change is **+0 lines in `scripts/`** and **+3 net in `src/`** (16 added,
13 removed) — it moves the ratio in the right direction, which is rare for a run that starts from a
measurement.

**Next run should pick from the launch plan or the owner-facing block.** Nothing here is queued.
**W-6.5 is now stale in the app's favour and should stop being repeated:** `public/data/market.json` is
`asOf 2026-08-31` (committed `55c0c15`), so the daily job is running again and the Sector screen is not
about to go dark. **O-1 remains the entire critical path — 44 lessons, five languages, 160 minutes of
content, and zero people have ever opened this app.**
**Owner tree at start of run: `OWNER-TREE f54fc023fb026bcb44277af38101071c245bfda0c8ead5c40049acd487b5c975` (0 tracked modified, 51 untracked)** — the owner's untracked `UIUX/`, untouched, as in the previous nine runs.

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
