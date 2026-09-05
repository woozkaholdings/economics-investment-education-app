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
of its entries are closed — ⚠️ **plus 10.10, closed 2026-09-05 when the app went live; that makes four, and this sentence is left in its original shape so the correction is visible rather than smoothed away.** **10.1** (investment-advice adjacency) and **10.2** (Dalio dependency) are closed and
are **standing rules, not settled history**: check any lesson or market-copy change against them, and
run `npm run check-blindspot` before committing one. **10.3** (kids/COPPA) ships parent-facing and is
closed on that basis, but is reopened as a *question* — a genuinely child-facing product is a legal and
store-classification decision, not a UI one, and no run may make it. ⚠️ **10.4 through 10.9 are OPEN,
and the paragraph this replaces did not say they exist.** 10.8 ("process mass exceeds product mass")
is what W-6 below is about, and it was **checked on 2026-09-05: the tripwire fires at 10.61x against
a 5x threshold, in all 17 rolling windows since it was filed.** **10.10 ("nothing owns getting this
in front of one person") is CLOSED 2026-09-05** — a reachable URL exists, which is half of its own
stated refuting number; the other half, one person having opened the app, is unmeasured until O-2.

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
> ✅ **UPDATE 2026-09-05: O-1 CLOSED — the app is live at
> <https://magnificent-mochi-73aecc.netlify.app>.** The block is no longer "these two items"; **O-2
> is the whole critical path now.** ⭐ **And the mechanism this block diagnosed is confirmed by how
> it ended:** it did not close because a run escalated harder. It closed the first time the owner
> asked for it directly, in one interactive session, in about twenty minutes — deploy, claim, set
> public. **Nineteen days of closing lines moved it none of the way; one instruction moved it all of
> the way.** Whatever this block is for, that is the evidence about what works, and it argues for
> asking the owner for a decision rather than restating a blocker.
>
> **O-1. A URL. ✅ CLOSED 2026-09-05 (owner-directed, interactive) — the app is live at
> <https://magnificent-mochi-73aecc.netlify.app>.** Open 2026-08-17 → 2026-09-05, **19 days**, and
> named as "the entire critical path" in the closing line of every run entry for the last sixteen of
> them. Netlify project `magnificent-mochi-73aecc`, site id `e485658b-2605-499d-86c6-d441e0bd0221`,
> on the owner's Netlify team. `dist/` was zipped and dropped on Netlify Drop; the owner claimed the
> site and set visibility to public. **Verified unauthenticated after each step, not on report:** `/`
> **200**, the hashed bundle **byte-identical** to the local build, `/data/market.json` at
> `asOf 2026-09-04`, and a nonexistent path **404** — so the 200s are real files, not a catch-all.
> `README.md` § Deploying now carries the URL, the verification and the update procedure.
> ⛔ **Two things the old "Netlify Drop is a drag of the `dist/` folder" line got wrong, both
> measured on the way through and both now corrected in `README.md`.** (1) An **unclaimed** drop is
> password-protected and **expires in about an hour** — it is not a URL to hand out, which the line
> above half-knew and understated. (2) A **claimed** drop is still not public: it lands with
> *Production visibility* = **Private** and redirects visitors to a Netlify login, until that is
> changed by hand at Project configuration › General › Visitor access. **Between them, "deployed"
> and "reachable" were three separate steps, and the repo's instructions described one.**
> ⚠️ **What is NOT closed by this: the second half of 10.10's refuting number.** A reachable URL
> exists; **whether one person has opened the app is still unmeasured**, and stays that way until
> O-2 lands. Do not write "someone has used it" anywhere on the strength of this item.
>
> **O-2. An analytics provider account and key. (Item 18.)** `src/lib/analytics.js` fires the §9.2
> event set with the §9.2 payloads; `sink()` writes to one device's `localStorage`. §4.3's Phase-0
> completion-rate gate (≥40% finish lesson 1) is scored **❌ Unmeasurable** on the readiness scorecard
> and cannot be scored any other way. O-2 is downstream of O-1 — **and O-1 closed 2026-09-05, so
> this is now the top of the critical path and nothing is in front of it.** The gate it unblocks is
> the one that says whether anybody finishes lesson 1.
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
> ### W-6.5 — ✅ **RESOLVED BY ITSELF; re-measured 2026-09-02 (scheduled dev-agent). The job did not stop.**
> `public/data/market.json` is `asOf 2026-09-01` and committed on 08-31 and 09-01 (`55c0c15`, `18769e0`)
> after the 08-29/08-30 gap this clause saw. The Sector screen did **not** go stale on 09-02 as predicted
> below. Nothing to do — this line is annotated rather than deleted so the next run does not re-raise it.
> ORIGINAL CLAUSE, kept because the correction above refers to it:
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
✅ **A FOURTH PASS RAN 2026-09-03 (scheduled dev-agent).** 2026-09-02 moved (23 entries, 185,529 b),
run log **236,983 → 51,449 b** (94.8% → 20.6% of warn; 1.46 → 22.3 runs of headroom), file
**603,842 → 418,308 b**. Containment 23/23 against `git show HEAD:AGENT_LOG.md`, 0 leaked, 5 retained,
one-byte plants dead 0/23. The floor is untouched at **366,859 b** and remains the only budget over
its limit (item 115, the owner's).
⛔ **New evidence for item 115, and it is the strongest yet: this is the first firing where the 600 KB
whole-file trigger was genuinely OVER — 603,842 b — and the pass was STILL a no-op under the rule's
own action clause**, which moves entries older than the most recent review boundary (W-6's, 2026-08-30)
when both live days were after it. **Triggered and inert at the same time**, for the sixth firing
running. The earlier five no-ops could be read as the trigger merely being early; this one cannot.
The pass acted on the measured warn budget, as the four before it did. **No clause was reworded.**
⚠️ **Convention a future pass needs and no clause states: within a day the archive reads OLDEST-FIRST,
reversing the live log's newest-first.** Appending the day as a verbatim slab inverts it and turns
every "the previous run…" sentence around. Verified against the `## Archived 2026-09-01` section and
now covered by an asserted order control.

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
✅ **A SIXTH PASS RAN 2026-09-05 (scheduled dev-agent).** 2026-09-04 moved (16 entries, 172,235 b),
run log **244,006 → 71,770 b** (97.6% → 28.7% of warn; **0.59 → 17.4 runs** of headroom), file
**650,705 → 478,469 b**. Containment **16/16** byte-identical against `git show HEAD:AGENT_LOG.md`,
0 leaked, 6 retained; the mover was proven first on a *planted* copy (16 MOVE + 6 KEEP plants, each
landing exactly once) and its two refusal guards fired for the right reason. The date clause was a
**no-op for the eighth firing running**; the trigger acted on was the measured warn budget, as in all
five previous passes. **No clause was reworded.** The floor is untouched at **406,699 b**.
⛔ **THE CORRECTION THIS PASS OWES THE NEXT ONE, and it is about a claim in this very clause.** The
2026-09-03 note above says the oldest-first convention is *"now covered by an asserted order control"*.
**There is no such control.** `grep -rn "oldest-first\|chronolog\|order control" scripts/*.mjs` returns
three hits and all three are `check-log-size.mjs`'s *cut plan* — which days to move — not the archive's
internal order. This pass appended the day as a verbatim slab, **inverted the whole of 2026-09-04**, and
`npm test` passed **0 failures** on the inverted file; only reading the note and diffing against the
`## Archived 2026-09-03` section caught it. **The convention is real and load-bearing** (every "the
previous entry…" sentence reverses) **and it is enforced by nothing but a reader.** Still no check
built — W-6.2 rule 3 refuses it, because no learner can see an out-of-order archive — so the honest
remedy is this sentence: **a pass that appends a day verbatim ships it backwards.** Reverse it, then
diff the first heading against the previous section's first heading.

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
> ⚠️ **ANNOTATION 2026-09-04 (scheduled dev-agent) — the clause above is a dated record and stays
> verbatim (§31 / item 91); this note exists so the next run does not copy its numbers forward again.**
> **Every figure in (2) has since moved**: re-measured today the two corpora are **150,608 vs 154,302**
> and the gap is still **exactly the section headings**, now **3,694** — the *claim* held, all four
> *numbers* did not. Item 89's paragraph and §10.4's note were the two places they had been retyped,
> and by today they had drifted from each other as well (this clause says `ja 0.359 vs 0.361`; §10.4
> said `ja 0.412 vs 0.412`). **§10.4 no longer restates any of them** — the note there now carries the
> claim and names `npm run readiness` / `npm run translation-completeness` instead, so there is nothing
> left to go stale. **Do not "correct" the numbers above; they are what was true on 2026-08-23.**
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
    > ⛔ **THE AUDIT'S OWN ARITHMETIC DID NOT CLOSE, and it was four days before anyone noticed —
    > corrected 2026-09-04 (scheduled dev-agent) by re-running the screen with its own three
    > controls.** The 2026-08-31 entry says *"Ten are real"* and then names **seven**: `essentials`
    > 10-15 and `money` 24. **Three counted defects were never written down**, so the note above —
    > the only place a picker looks — reads as *"the main path is clean and the cluster is on the
    > optional track."* **It is not.** Re-running the strict screen (scene verb or name, in the first
    > two sentences of section 1, controls: lesson 29 and lesson 1 must read concrete, a synthetic
    > definition-first opener must read abstract — all three fired) flags **15 of 44** today against
    > the audit's 13, the difference being scene-verb vocabulary rather than corpus drift. Subtracting
    > the audit's seven named defects and its three recorded false positives leaves exactly three,
    > **all of them `economy` — the track a new install opens on**:
    > - **37 (QE & QT)** — the real one, and the only lesson in the whole flag set with **no person,
    >   no scene and no metaphor of its own** anywhere in the section that carries its claim. Its
    >   "master dial already turned down to 0%" is lesson 35's metaphor, arriving by explicit
    >   cross-reference. ✅ **FIXED 2026-09-04** — a concrete lead in five languages; see the run log.
    > - **34 (the four levers)** and **40 (the three rules)** — **both false positives, and the reason
    >   generalizes.** Each opens with a one-sentence enumerating stem and then goes concrete
    >   *immediately*: 34's ¶1 is *"Think of a city government facing a budget shortfall that lays off
    >   workers"*, 40's second sentence is *"Remember the family from “The Long-Term Debt Cycle”"*.
    >   A screen that reads two sentences cannot tell a definition-first lesson from a **list whose
    >   stem is one sentence long**, and both of these are lists.
    > **So the honest false-positive rate is 6 in 15, not 3 in 13** — the screen is roughly twice as
    > wrong as the note above says, which strengthens rather than weakens its conclusion that it must
    > never become a build gate. **Nothing on the main path is now open under this clause**; the
    > `essentials` 10-15 cluster below is the whole remainder and its deferral is unchanged.


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
    > ⛔ **FIFTH PASS 2026-09-04 (owner-directed). Recovered 17,157 b on the artifact — floor
    > 410,754 → 393,597 b — and THE OWNER OPTION BELOW HAS NOW EXPIRED. Read this before running a
    > sixth.**
    > **Headline-only for every closed item now projects to 254,621 b — OVER the 250,000 b budget by
    > 4,621.** On 2026-09-02 the fourth pass measured that same projection at 232,194 b, *under* by
    > 17,806, and predicted about three days left. It was right. **Control, because a projection
    > compared against another run's projection is worthless unless the two instruments agree:** my
    > estimator run against `767a96f` itself reports **232,009 b against their 232,194 — 185 b, 0.08%.**
    > ⛔ **AND THE FINDING THAT SHOULD STOP A SIXTH PASS BEING ORDERED FOR THIS PURPOSE: the
    > projection is INVARIANT to compression. Measured before and after this pass: 254,621 b, and
    > 254,621 b — identical to the byte.** Compression under this rule and the headline-only cut
    > remove *the same material*, so a pass buys headroom against the floor's growth and moves the
    > option's reachability by exactly **zero**. No number of further passes reopens it. **What is
    > left is what item 115 has always said is the owner's: delete closed items outright, or raise the
    > budget.** A run must not choose.
    > **Scope, following the fourth pass's precedent:** only the three closed items changed since
    > `767a96f` (160, 165, 156); items an earlier pass already judged were left alone. **156 was
    > examined and DECLINED** — 659 b droppable, and it included a run-log pointer a reviewer needs.
    > All open items byte-identical; 142/142 item numbers survive; all 190 `backlog item N` citations
    > still resolve.
    > **FOURTH PASS 2026-09-02 (owner-directed: "do the backlog compression pass next"). Recovered
    > 8,846 b on the artifact — floor 366,737 → 357,891 b — and its value is the arithmetic, not the
    > bytes.** Scoped deliberately to material the rule had never touched (8 items added and 6 changed
    > since `2ce1b6f`); **the 128 items the third pass processed were left alone**, because a
    > classifier finding ~17 KB more in them is a regex second-guessing this item's own recorded
    > judgment call, and over-keeping is the stated error direction. All six controls green.
    > ⛔ **THE OWNER OPTION BELOW IS STILL OPEN AND IS NOW CLOSING.** Measured today: floor over
    > budget by **107,891 b** (was 37,564 on 08-30); headline-only for closed items projects to
    > **232,194 b — under budget by 17,806** (was under by 35,359). **The margin halved in three days
    > and at the floor's writing rate it is gone in about three more**, after which the only moves
    > left are deleting closed items outright or raising the budget (item 121's `⚠️` anticipates
    > exactly that). Nothing a run may decide.
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

167. **[Content/Accuracy — filed 2026-09-05 by the run that fixed lesson 34's US-1930s claim, from
    the same close reading of the economy track. All three are LIVE and were read on the built app,
    not inferred; none is a residual of that run's own edit.]**
    > ⚠️ **A FIFTH NOTE, not a sub-item (W-6.2 rule 2). THREE more classes swept 2026-09-05 — do not
    > re-run any of them.** (1) **Glossary↔lesson definitional agreement — ZERO real instances.** All
    > 43 glossary terms against 1,319 English lesson sentences, plus `economicSignals.js` and the 68
    > parallel English strings in `markets.js`; controls fired both ways (`Deflation` >0,
    > `Blorptronics` 0). Two lookalikes died on inspection and must not be re-derived: lesson 36's
    > *term premium* is already in `lessonTerms.js`'s `deliberatelyUnlinked` as `other-sense`, and
    > lesson 11's *index fund* attribution to lesson 5 (which contains `index` zero times in five
    > languages) is **supported**, because lesson 11 §0 supplies the bridge and lesson 5 describes the
    > thing without naming it. (2) **Attributed cross-references — ZERO in 24.** Every sentence
    > claiming another lesson *showed* something, read against its target; controls: a known title
    > resolves, a fabricated one does not, self-references 0. (3) **Typographic integrity — ONE
    > instance in 2,380 fields, fixed the same day**: lesson 5 §2 opened a sentence with a lowercase
    > *the*, left there on 2026-08-20 when item 84's conversion replaced *"Lesson 38's"* and did not
    > restore the capital; all four translations already read it correctly. Doubled words, double
    > spaces, missing space after a period, space before punctuation and curly-quote balance are all
    > **zero**. **No check was built for any of the three** (W-6.2 rule 3, W-6.3 at 2.15x): the
    > sentence-case probe runs at a **96% false-positive rate** (22 of 23 are `EE.UU.`/`U.S.`/`vs.`
    > or a `?”` closing a quoted question), so a guard means shipping an abbreviation allowlist for
    > one defect in 44 lessons.
    > ⛔ **The instrument trap, and it is a sharper version of the fourth note's:** the doubled-word
    > probe reported **8 hits, all Spanish, all fake** — JS `\w` is ASCII-only, so in *"una economía a
    > lo largo"* the `í` is a non-word char and `\b` matched before the final **a**, reading `a a`.
    > **The control passed and was worthless: an English doubled word was planted to validate an
    > instrument then pointed at Spanish.** Fixed with `\p{L}` and a control planted in the scanned
    > language that also asserts the artifact is dead (`por toda una economía a lo largo` → 0).
    > **A control has to be planted in the same alphabet as the corpus.**
    > ⚠️ **A THIRD NOTE, not a sub-item (W-6.2 rule 2). The QUESTION-ANSWERABILITY class is swept and
    > is CLOSED at one fixed instance — do not re-run this sweep.** 2026-09-05: every one of the 46
    > end-of-lesson checks was scored against the lesson it is attached to *and* against all 44 lesson
    > bodies. **44 of 46 rank their own lesson #1** (identity control: every lesson's own takeaway
    > ranks that lesson #1, 44/44). The two that do not: `q045` at rank 2 inside its own four-lesson
    > arc, **read and correct**; and **`q004` at rank 21 of 44** — *"What causes inflation?"* was
    > attached to **lesson 30**, which contains the word *inflation* **zero** times and *production*
    > **zero** times **in all five languages**, while lesson 32 contains each **twice in all five**.
    > Fixed the same day by moving `q004` to lesson 32 (one integer; `q004`'s id is unchanged, so
    > persisted Leitner state survives) plus L32's derived `minutes` 3 → 4. **No guard is due**
    > (W-6.2 rule 3, W-6.3 at 1.82x): one defect in 46 does not earn a permanent instrument, and both
    > sweep scripts stayed in the scratchpad.
    > ⛔ **The trap, because a coverage score alone gets this wrong:** `q010` and `q005` score low for
    > a legitimate reason — they ask which item is **NOT** one of a list, so the correct option is
    > *deliberately* absent from the lesson. A word-coverage sweep cannot tell a NOT-question from a
    > misplaced one. **The instrument that decides has to rank the question against every lesson, not
    > score it against its own.** `q010` sits at rank 1 under that instrument.
    > ⚠️ **And a live, unfixed find from the same walk, filed here rather than numbered: `checkIntro`
    > is a fixed singular string.** *"A quick question before you move on."* renders above **two**
    > questions on the two lessons that carry two (L34 all along, and L32 since the `q004` move — the
    > count of affected lessons is 2 before and 2 after, measured, so nothing regressed). W-6.2 rule
    > 3's sentence: *"a learner is told to expect one question and is shown two."* Fixing it is a
    > five-language copy change (`checkIntro` has no count template; §68 is the precedent for one).
    > **Honest priority: low** — it is a wording mismatch, not a false claim about the material.
    > ⚠️ **A FOURTH NOTE, not a sub-item (W-6.2 rule 2). The ENGLISH↔TRANSLATION NUMERIC-DRIFT class
    > is swept and CLOSED at zero instances — do not re-run it.** 2026-09-05: percentages and 4-digit
    > years compared between each English lesson and its four translations, **176 (lesson, language)
    > pairs**. **4 flags, all false positives on inspection** — `L12 zh` writes `$1,800` as `1800美元`
    > (no comma), `L11 ko` renders "exactly one percentage point" as `1%포인트`, `L32`/`L37 ko` render
    > "approach zero" as `0%`. **No drift exists; no check was built** (W-6.2 rule 3 — after an empty
    > sweep the learner-visible sentence cannot be written honestly).
    > ⛔ **The transferable part is the instrument, not the result. The FIRST version reported 36 flags
    > and every one was an artifact of its own regex:** the lookahead `(?![\d,.%])` rejected any year
    > followed by a comma, so English lesson 36 — which reads *"turning positive again in 2024, well
    > past…"* — scanned as containing **no 2024**, manufacturing a tidy story that ko/zh/ja were
    > carrying a stale inversion window three days after that lesson was corrected in English. **It had
    > no control.** With a two-sided planted probe (`2024,` `1929.` `2050` must be read; `1,929,000`,
    > `20.24`, `1799`, `2100`, `12345` must not) the count fell **36 → 4 → 0 real**. A digit-scanner
    > over prose needs its punctuation boundaries proven, and **"the translations drifted" is a
    > conclusion attractive enough to skip proving the instrument first** — which is what happened.
    > ⚠️ **A SECOND NOTE, not a sub-item (W-6.2 rule 2). The CHECKABLE-ARITHMETIC class is swept —
    > do not re-run it.** 2026-09-05: every sentence in all three tracks carrying a multiplier word
    > or two or more magnitudes was parsed out and recomputed — **120 sentences across 35 lessons,
    > one defect**, in lesson 3 §2 (the early-saver comparison was false at the lesson's own 6%),
    > fixed the same day in five languages. **The positive control was (a) below**: a sweep that
    > misses lesson 37's "nine times the size" proves nothing, and this one caught it. Everything
    > else checks out to the cent — lesson 11's fee example, lesson 18's $3,580, lesson 17's $1,050
    > and $400, lesson 4's rate gap (which *understates*), lesson 3's own figure data. **No guard was
    > built and none is due** (W-6.2 rule 3, W-6.3): one defect in 120 sentences does not earn a
    > permanent regex. ⛔ **And the trap recorded in the run log: the folk "early saver stops
    > contributing" framing is ALSO false at 6% ($197,395 vs $200,903) — do not "fix" lesson 3 by
    > restoring it.**
    > ⛔ **(a) below was deliberately NOT taken by that run** even though its sweep pointed straight
    > at it — item 167 is exhausted for headline picks, and folding it in would have been the smuggle
    > W-6.2's ⚠️ names. It is still open and still near-free.
    > ⚠️ **A NOTE, not a fourth sub-item (W-6.2 rule 2). The research-authority class is swept and
    > sits at ONE fixed instance — do not re-run this sweep.** 2026-09-05: every sentence in all
    > three tracks citing research / studies / experiments / economists as authority was regexed and
    > read — **25 hits, one defect**: lesson 18's ego-depletion claim ("willpower runs low over the
    > course of a day the way a muscle gets tired"), fixed the same day in five languages. **The two
    > lookalikes are innocent and were deliberately left alone:** lessons 19/27's loss aversion at
    > "roughly twice" (the standard ratio, already hedged) and lesson 28's more-trading-lower-returns
    > (Barber-and-Odean-shaped, replicated across markets). See the run log for the instrument, the
    > control that caught a bad glossary grep, and why widening would have damaged two good lessons.
    - **(a) Lesson 37 (QE & QT) says the balance sheet "grew from roughly $900 billion before 2008
      to a peak of about $9 trillion in 2022 — a stack of bonds nine times the size of the entire
      pre-2008 institution."** $9T against $900B is **ten** times, not nine; nine is the *increase*
      divided by the base. The sentence reads as a claim about the peak, so a learner doing the
      division gets a different number than the sentence gives them. Cheapest of the three; decide
      whether the intended claim is the peak (10x) or the growth (9x) and say which.
    - **(b) ✅ DONE 2026-09-05 (scheduled dev-agent). Lesson 36's THINK prompt no longer poses a
      settled episode as an open bet.** Premise re-measured and confirmed exactly as filed in all
      five languages before editing; see the run log. The replacement anchors on a **closed
      interval** — "the 12-18 month window … closed at the end of 2023 without a US recession" —
      because the obvious alternative ("no recession *yet*") is a §2.3 liability that nothing checks.
      ⚠️ **Two neighbours were checked and deliberately NOT changed; do not re-derive this.** `12-18`
      appears on three surfaces, not one: the prompt, the end-of-lesson **quiz** question
      (`quizText.*.js:75`) and the **glossary** `Yield Curve` entry. Both neighbours state the
      *general* pattern, which is what the lesson teaches and what the 1955 record supports, and the
      quiz's `explain` already carries the hedge. **The defect was the present tense, not the 12-18
      month figure** — widening the fix to all three would have hedged the lesson's own thesis on the
      strength of one episode. "this time is different" leaves lesson 36 but stays in lesson 33,
      where the corpus actually teaches it as bubble psychology.
      ORIGINAL TEXT, kept verbatim because the entry above refers to it:
      > **(b) Lesson 36 (Yield Curve): the THINK question contradicts the lesson body on the same
      > screen.** The body's second section now says the 2022 inversion "stayed inverted for roughly
      > two years … before turning positive again in 2024, well past the 'typical' 12-18 month lead
      > time"; the THINK prompt three blocks below still asks *"The yield curve inverted in 2022.
      > Historical pattern says recession within 12-18 months. Some say 'this time is different.' What
      > do you think?"* — i.e. it poses as open a window the body has already closed. Same class as the
      > 2026-09-04 QT/tapering and 2s10s finds: a screen disagreeing with itself. Five languages.
    - **(c) Lesson 32 (Short-Term Debt Cycle) equates an ordinary recession with deflation** —
      "businesses start cutting prices to attract customers — that's deflation … That's a recession."
      Most postwar US recessions ran *disinflation*, not a falling price level. ⚠️ **Not measured
      against the glossary yet** — the glossary's own `Deflation` entry and lesson 34's use of the
      word have to be read first, because if they already draw the distinction this is a third
      self-contradiction and if they do not it is a whole-app simplification the owner may have
      chosen. **Do not treat (c) as confirmed; (a) and (b) are.**
    - **W-6.2 rule 3, answered:** (a) "a learner divides 9 by 0.9 and gets a different answer than
      the sentence"; (b) "the lesson tells a reader on one screen that the window is open and that it
      closed"; (c) "a learner is taught that recession means prices fall". **No check is proposed for
      any of them** — all three are single sentences, and `scripts/` at 2.15x `src/` (W-6.3) says a
      regex is the wrong instrument. **Honest priority: (b) medium — it is a live self-contradiction
      on the main path; (a) low but near-free; (c) unmeasured.** ⛔ **(b) is DONE, so this item is
      now a two-part remainder — and W-6.2 rule 1 is EXHAUSTED for this chain: the 2026-09-05 filing
      run was link one and the (b) run was link two. A run may not take (a) or (c) as its headline
      pick.**

166. **✅ DONE 2026-09-04 (scheduled dev-agent). The Sector screen now credits both sources, and
    `check-data.mjs` §73 keeps it doing so.** See the run log. Two five-language locale keys —
    `priceSourceTemplate` ("Sector and index prices from {source}.") under the sector list and
    `economicsSourceCredit` (the Federal Reserve Bank of St. Louis / FRED®) under the economics list —
    both gated on `!isSample`, since crediting a vendor for fixture numbers would be false.
    `priceSourceName()` in `src/lib/useMarketData.js` maps `market.json`'s **adapter name** to the
    vendor's display name and returns `null` for anything unknown.
    ⚠️ **The part worth not re-deriving: `source` is an adapter slug, not a display string**, so a new
    adapter in `adapters.js` with no entry in `PRICE_SOURCE_NAMES` renders *real vendor prices with no
    credit and no error anywhere*. That silent path is what §73 exists for; DECISIONS.md names Twelve
    Data as the drop-in alternative, so the switch is a live possibility, not a hypothetical.
    ⛔ **Checked and DECLINED in the filing walk, kept so it is not re-derived: the missing disclaimer
    on Glossary and Kids is NOT a defect.** `check-blindspot.mjs`'s `EXPECTED_SURFACES` is a closed
    list of 8 that deliberately excludes Glossary, TermDetail and ParentGuide, `Reference.jsx`'s §10.1
    comment says so, and the check fails on an EXTRA surface as well as a missing one. Adding one
    means editing LAUNCH_PLAN §10.1 and that list together — owner-facing, not a fix.
    ⚠️ **And the instrument trap:** `grep -c '<Disclaimer' Sectors.jsx` returns 0 while the screen
    plainly renders one — it emits the bare `{t.disclaimer}` string. A component-name grep is not a
    disclaimer census.

165. **🟡 MAIN PATH CLOSED **on content** 2026-09-04 (scheduled dev-agent); the essentials remainder is open.
    ⛔ **The "MAIN PATH CLOSED 2026-09-03" this line used to carry was FALSE, and so was the
    "none on the main path" bullet below — see the correction under them.**
    [Content — filed 2026-09-02 by the run that took `q007`, from a measurement it had to make
    before it could apply item 160's own style rule.] The quiz's `explain` field — the one surface
    item 160 moves reasoning INTO — was abridged in 69 of 184 question/language pairs, and the
    shortfall was concentrated on the main path.**
    > ⛔ **HEADLINE FIGURE CORRECTED 2026-09-03, and the correction is about how it went stale.**
    > "69 pairs across 19 questions" was measured **before** this item's own filing commit repaired
    > `q007`. Re-measured 2026-09-03 with the same instrument and the same controls, the p90
    > references reproduce **exactly** (es 1.162 ko 0.582 zh 0.380 ja 0.520) and the count did not:
    > it was **65 across 18**. A count in an item ages against the work the item describes.
    > ✅ **2026-09-03: nine questions repaired in four languages — `q001`-`q006`, `q008`, `q011`,
    > `q013`, 36 `explain` values, +1,633 characters.**
    > ⛔ **BOTH FIGURES THAT FOLLOWED THAT LINE WERE WRONG. Corrected 2026-09-03 by the `q020` run;
    > do not re-quote the originals, which are struck through here and stand uncorrected in commit
    > `a91b02c`'s message because history is not rewritten.**
    > ~~"The ratio measure is now 41 pairs across 13 questions"~~ — **41/13 was the reading after the
    > FIRST of that run's three patches**, quoted as the post-commit figure without re-running after
    > `q006` and `q013` landed. Recomputed against the trees themselves: `HEAD~1` **65/18**,
    > `a91b02c` **33 pairs across 11 questions**.
    > ~~"down to q020 (essentials lesson 6), es and zh — 2 pairs"~~ — it was **4 pairs**. `ko` and
    > `ja` scored en-equal on sentence count only because they split the English's semicolon-joined
    > first sentence in two; the second English sentence was absent in all four. **The residual was
    > filed off the sentence counter when the item's own ratio instrument had it right.**
    > ✅ **`q020` repaired 2026-09-03 (owner-directed) in all four languages, +207 characters.**
    > Corpus now: sentence measure **0 pairs**; ratio measure **29 pairs across 10 questions**, all
    > partial shortfalls and none a dropped sentence.
    > ⚠️ **What `q020` actually was, and it is why "low priority" was the wrong call:** the sentence
    > four languages had dropped was not mechanism, it was the **hedge** — *"Which is better depends
    > on an individual's own tax situation, not a fixed rule."* Scanned across the corpus, **4 of 46
    > English explanations carry a hedge (`q006`, `q012`, `q013`, `q020`) and `q020` was the only one
    > that lost it in translation** — `q012`'s "not a guarantee" survives in all four, so this was an
    > outlier, not a pattern. Stated precisely: a **content-parity** gap, not a missing disclaimer —
    > §10.1's global disclaimer renders under the explanation in every language.
    > ⚠️ **Do not re-derive the selection instrument's TWO traps — and do not trust it over the
    > ratio.** (1) Sentence counting by terminal punctuation reads `EE.UU.` as two sentence ends,
    > which scored the Spanish `q006` as three sentences when it is one — a false negative that
    > would have left `q006` unrepaired. Mask `EE.UU.`/`U.S.`/`vs.`/`etc.` and make that sentence
    > the control. (2) Even masked, it missed `q020` in **ko and ja**, because a translation that
    > splits one English sentence into two matches the total while dropping a whole sentence's
    > content. **Sentence count is a proxy for content; re-punctuation defeats it. The ratio
    > instrument this item was filed with flagged all four correctly, both times.** Full account in
    > the two 2026-09-03 run entries.
    > ⚠️ **The recurrence this exposed, which is bigger than the item.** `DECISIONS.md` records the
    > 2026-08-16 review fixing "an es-only drop of 'incomes' from lesson 21's inflation-mechanism
    > sentence". Seventeen days later the Spanish **quiz explanation of the same mechanism** (`q004`)
    > still dropped it, and so did zh and ja — because `scripts/translation-review.mjs` (by
    > `DECISIONS.md`'s stated scope limit) and `check-data.mjs` §33 (by construction) both read
    > `lessonContent` and neither has ever opened `quizText`. **A fix applied to one corpus is not
    > applied to the concept.**
    - **Measured, with a per-language reference and two controls** (a language against itself scores
      1.00; a halved string scores 0.50). Each language's **p90 explain/en ratio across all 46
      questions** — what a full translation looks like in this corpus — is **es 1.16, ko 0.58,
      zh 0.38, ja 0.52**; a pair counts as abridged below 0.7x its own language's reference, the same
      test `translation-completeness.mjs` applies to lesson bodies. **19 of 46 questions are
      abridged in at least one language; 69 pairs in total.**
    - **Why this is worse than an ordinary translation gap.** Item 160's rule is *"the reasoning
      belongs in `explain`"*, and three runs have now moved reasoning out of options on that basis.
      **In four languages, for these 19 questions, it is being moved into a field that does not carry
      it** — the learner answers, and gets one sentence where the English reader gets the mechanism.
      `q007` was the live instance: es/ko/zh/ja said only "QE is the Fed's emergency tool" while en
      also explained buying bonds at the zero bound. **Repaired for `q007` only** (+203 characters);
      the other 18 questions are untouched.
    - **Honest priority: medium-high, and it is O-3-shaped** — closing it is roughly 60-70 short
      paragraphs of new machine translation, which is the owner's standing call. **Do not confuse it
      with item 93/94**, whose instrument reads `lessonContent` and has never looked at `quizText`.
      `npm run translation-completeness` does not measure this field; the script above lives in the
      run entry and would need to move into `scripts/` before any check depends on it.
    - **Priority after both 2026-09-03 passes: the dropped-sentence class is EMPTY** (sentence
      measure 0 pairs, hedge parity 4/4). What is left is 29 ratio-flagged pairs across 10 questions,
      all partial shortfalls, ~~none on the main path~~.
      > ⛔ **"NONE ON THE MAIN PATH" WAS FALSE, and it is this item making the mistake its own text
      > warns against one screen earlier.** Re-measured 2026-09-04 with an independent
      > re-implementation of this item's ratio instrument (three controls, all fired: a language
      > against itself scores 1.000 and flags nothing; a uniformly halved corpus scores 0.500 and
      > still flags nothing, because the reference moves with it; one live pair cut to 20% flags in
      > all four languages). The 29/10 headline **reproduced exactly**. Then the tracks were read off
      > `lessons.js` rather than assumed: **`q003` L32, `q010` L34, `q011` L35, `q012` L38 and
      > `q014` L33 are all `track: "economy"` — the main path.** Five of the ten questions and
      > **14 of the 29 pairs** were on the track a new install opens on. The "closed" claim came from
      > the **sentence** measure, which this item's own ⚠️ says two paragraphs earlier not to trust
      > over the ratio.
      > ⚠️ **And one reference figure had drifted:** `es` p90 is **1.184**, not the 1.162 the
      > 2026-09-03 correction certified as reproducing "exactly" — `q020`'s own +207-character
      > repair raised it. ko 0.582 / zh 0.380 / ja 0.520 are unmoved. **A p90 reference is computed
      > from the corpus it measures, so repairing the corpus moves the instrument.** Quote it with a
      > date.
    - **`q003` (L32, ko/zh/ja) and `q011` (L35, zh) — READ, COMPLETE, NOT EDITED.** Both are
      two-sentence English rendered whole in compact CJK; they flag because the ratio is 1-3
      hundredths under a threshold, not because anything is missing. **This is item 162's
      false-positive class in a third corpus** (there, 30 of 336). `q012`'s `zh` **still flags
      after the repair** at 0.262 against a 0.266 threshold — one code point — and is likewise
      complete. **These five pairs are this corpus's `READ_COMPLETE` seed.**
    - **Result: 29 pairs / 10 questions → 20 pairs / 8 questions**, and every remaining question is
      on **`essentials`** (L4, L7, L8, L9, L14) — the optional track. The line this item has
      wanted to write is now true, and true on content rather than on the instrument.
    - ⛔ **THE GUARD IS AN OWNER DECISION, AND THE ORDERING IS THE POINT — not a deferral.** A
      `quizText` completeness check satisfies W-6.2 rule 3 cleanly (the learner-visible failure is
      "answered in Spanish, shown one clause where the English reader is shown the mechanism"), and
      the natural form is **§66/§67's scorer applied to a third corpus**. **The blocker is not size.
      It is that §66 and §67 each landed WITH a `READ_COMPLETE` list built by reading every flagged
      pair** — 9 and 30 respectively. Here that means **reading 29 unread pairs against their
      English**, which is O-3 work and therefore the owner's call. Landing the check first would ship
      a permanent 29-pair warning, which item 121's own ⚠️ already calls evidence that the check or
      the budget is wrong. **Read first, then guard.**
      > ⚠️ **Updated 2026-09-04: the read is now 5 of 20 done and the arithmetic changed with it.**
      > A check landed today would ship a **15-pair** warning, not 29, and it would already have a
      > 5-entry `READ_COMPLETE` list (`q003` ko/zh/ja, `q011` zh, `q012` zh) with the code-point
      > length each had when read. **The ordering rule is unchanged and still the owner's** — the
      > remaining 15 pairs sit on `essentials` L4/L7/L8/L9/L14 and are unread.
      > ⛔ **AND THE REMAINDER IS OUT OF ORDER, not merely owner-gated — noticed 2026-09-04 by a run
      > that considered picking it and did not. All five remaining questions sit on lessons whose
      > BODIES are abridged in the same four languages.** `npm test`'s translation-completeness line
      > reads **48 abridged lesson/language pairs, all on `essentials` lessons 1-11 and 14** (item
      > 93/94); the five questions left here are on **L4, L7, L8, L9 and L14** — every one of them
      > inside that set. So repairing a question's Spanish explanation for lesson 4 restores parity on
      > the *check* of a lesson whose *body* the same reader gets as a condensed summary. **That is
      > the wrong end first**, and it makes the remainder downstream of **item 94**, not merely of
      > O-3's volume question. Whoever picks this up should take the lesson bodies or neither.

    - *Compressed 2026-09-04 (fifth backlog-compression pass, owner-directed). Dropped: the
      per-question repair chronology for `q010`/`q012`/`q014`, the superseded track-distribution and
      inter-pass priority bullets, and the per-tranche O-3 accounting — all in the run log under
      2026-09-03 and 2026-09-04. Kept byte-identical: the headline with all its ⛔/⚠️ corrections and
      instrument traps, the `q003`/`q011` READ-COMPLETE finding, the live remaining counts, and the
      ⛔ owner-decision block.*
164. **✅ DONE 2026-09-02 (scheduled dev-agent) — the headline premise reproduced exactly, and the
    item's own list of phrasings did not: one of the three it proposed fires on shipped teaching
    copy. Widened in all five languages, with a two-sided control.**
    - **Premise, re-measured before editing (step 3.5), by plant and control:** planting
      `qeQtSection: "QE, QT — now is a good time to buy"` into `src/locales/en.js` gave **PASS**;
      the control plant `"you should buy now"` gave **FAIL**. Blind pattern list, live corpus —
      exactly as filed.
    - ⛔ **What the item got wrong, and it is the part worth keeping.** It named three missing
      phrasings: *"a good time to buy"*, *"consider buying"*, *"worth buying"*. **`worth buying`
      fires on a shipped money-track takeaway** — "wants are everything else, including plenty of
      things worth buying" — so landing the item as written would have failed the build on correct
      content. `consider buying` has zero live hits but is a normal teaching framing
      ("consider buying versus renting") and was dropped for the same reason. **The first Spanish
      draft repeated the mistake independently**: `momento (de|para) comprar` fires on a shipped
      lesson's temporal "En el momento de comprar, ambas decisiones se sintieron iguales", so the
      Spanish patterns now require the evaluative or copular frame (`un buen momento para comprar`,
      `es el momento de comprar`). Both live sentences are now must-stay-clean controls.
    - **Shipped:** a **timing** class in five languages (8 patterns) plus the softened first-person
      verbs the existing recommendation patterns missed (`we suggest|advise`, `sugerimos|aconsejamos`,
      `권해 드립니다`, `おすすめします`). §10.1 goes from **25 to 33 patterns**. Every one was checked
      against the current corpus for false positives first — **0 hits across 39 files** — and each of
      the five plants that a learner could have met (`now is a good time to buy` / `ahora es un buen
      momento para comprar` / `지금이 매수하기 좋은 시기입니다` / `现在是买入的好时机` / `今が買い時です`)
      now FAILs the check.
    - ⚠️ **A pattern's own must-flag sample is not optional, proven by one that was dead when
      written.** The Korean timing pattern was drafted as `(매수|…|팔)기 좋은` and matched **nothing**
      — not even `매수하기 좋은 시기`, the phrase it exists for. It looked identical to a clean
      result. The new control asserts each timing pattern against the advice sentence it was written
      for, so a dead pattern fails loudly instead of reporting a clean corpus forever.

163. **[UX/A11y — filed 2026-09-02 by the run that put the unit on the balance-sheet chart, as three
    things that run SAW on the same walk and deliberately did not fold into the same commit.]
    All three are live and measured; none is a guess.**
    - **(a) ✅ DONE 2026-09-02 (owner-directed: "do item 163(a) next") — but READ THE PREMISE
      CORRECTION: this item named ONE site and there are TWO, and it called the defect "a judgment
      call, not a falsehood" when half of it is a plain falsehood in five languages.**
      *As filed:* the recap card renders an unconditional `<Icon name="check">` at `ink.ok` above
      "Review complete", while the per-question rows below it *do* branch — the screen contradicting
      itself in two inches. **That much reproduced exactly** (0 of 10 → one 2rem green tick over ten
      red `ink.bad` crosses). **What the item missed is the `atBatchPause` branch twelve lines
      above**, which renders the same unconditional tick over `reviewBatchTitle` — **"{n} done —
      nice work"**, es "bien hecho", ko "잘하고 있어요", zh "做得好", ja "いい調子です". Measured live
      by driving ten real wrong answers: **"10 done — nice work" over "0 of 10 correct"**. That is
      not a defensible judgment call; it is praise for a session in which nothing landed, and the
      item's "not a falsehood" reading is true of `reviewCompleteTitle` and false of this one.
      **The decision this item said the picker must make, made, and split in two** — because the
      tick and the headline are different kinds of thing. The tick is a **signal**: it now goes
      `info`/`ink.muted` when `correctCount === 0` at BOTH sites, matching the two-state shape the
      landing card already uses for `seen > 0`. It is deliberately **not** red — the session was
      completed, and a miss is a productive event in a Leitner scheduler. The headline is a
      **claim**: a new `reviewBatchTitleNoneRight` in five languages says what actually happened to
      those questions ("{n} done — these come back tomorrow"), which is what this screen's own "How
      review works" rail already promises. `reviewCompleteTitle` stays unconditional: unlike "nice
      work" it is true at every score. **The boundary is exactly `correctCount === 0`** — 1 of 10
      still reads "nice work" with the green tick, measured. Note this was NOT item 117's defect —
      that one was the Practice *landing* card with `review = null`, closed 2026-08-26, and its
      conditional-icon shape is the precedent this followed rather than undid.
      ⚠️ **And the transferable part, which is the second time in two days item 163 has taught it:**
      **(b)'s numbers were wrong and (a)'s scope was wrong, both filed by the run that had just
      looked at the screen.** A residual is a claim about the code, not a reading of it.
    - **(b) ✅ DONE 2026-09-02 (owner-directed: "do item 163(b) next") — but READ THE PREMISE
      CORRECTION, because it changed the scope from three blocks to one heading.**
      *As filed:* "the outline names 4 of its 7 blocks … a reader skips three sections". **Both
      figures were wrong.** Re-measured on the built app before editing: the screen has **eight**
      content blocks, four carry an `h2`, and **four** do not — the cycle chart, the *Illustrative
      Scenario* note, the QE/QT pair, and the balance-sheet figure. I had missed the scenario note.
      **But the corrected count is not the interesting part.** Three of those four are not defects:
      the cycle chart and the scenario note sit **between the `h1` and the first `h2`**, which is
      the `h1`'s own content and the correct description of a screen's opening; and the
      balance-sheet figure's `figcaption` is a caption, which is what a figure's label should be.
      **The real defect is narrower and sharper than the item claimed:** the QE/QT pair and the
      balance-sheet figure sat *between* two unrelated `h2`s, so a rotor user was told the entire
      Fed-balance-sheet chart belongs to **"Yield Curve Shapes"**. Fixed with **one** `h2`
      (`qeQtSection`, five languages) that owns both — not three headings, and no new primitive.
      See the run log for the differential control that reproduced the pre-fix ownership in place.
    - **(c) ✅ DONE 2026-09-02 (owner-directed: "do item 163(c) next"). The defect reproduced
      exactly; three things around it did not.**
      *As filed:* `Bar` renders `9` where its own description says `9.0`, because `9.0 === 9` in
      JavaScript. **Reproduced live on the built app: `["0.9","4.5","3.8","9","6.7"]` against an
      aria-label reading "…9.0 after the pandemic response…".** The control is intrinsic — the other
      four bars DO carry a decimal, so a probe returning a constant could not have produced that row.
      **Three corrections:**
      1. **It is on TWO screens, not one.** `balanceSheetHistory` is drawn by two `Bar` call sites —
         `MarketSignals.jsx` (Reference > Market Dashboard) **and** `LessonVisual.jsx` for
         `kind === "balanceSheet"`, which is **lesson 37, "QE & QT: The Fed's Power Tools"**. Both
         measured showing `9`.
      2. **The "future integer-valued chart" is a PRESENT one.** `Practice.jsx`'s Leitner box strip
         is the third `Bar` call site and renders question counts — measured at `7 / 3 / 2 / 0 / 0`
         under the unit "questions". A `.toFixed(1)` inside `Bar` would have shipped "7.0 questions"
         and "0.0". The item was right to warn and wrong that the risk was hypothetical.
         (`Bar`'s own comment said "both call sites"; there are three. Corrected in the same commit.)
      3. **No new convention was needed — `Bar` was the only one MISSING the existing one.**
         `ProportionBar`, `GrowthCurve` and `GapColumns` in the same file all already take a
         `formatValue` prop. `Bar` now takes one too, defaulting to identity so the integer strip is
         untouched. Precision is a property of the series, so `balanceSheetFormat` is exported from
         `content/markets.js` beside the data and beside the description that states the decimal,
         and both call sites pass it. Verified after the fix on both screens and in all five
         languages: `0.9 4.5 3.8 9.0 6.7`; the Leitner strip still reads `7 3 2 0 0`.
      ⚠️ **What is NOT fixed, measured rather than assumed:** `es` alone writes a comma decimal in
      its description ("0,9 … 9,0") while the chart face renders a period in every language — the
      app has no locale-aware runtime number formatter (`numerals.mjs` is script-side, and the only
      runtime formatter is `usd`, hardcoded `en-US`). Pre-existing, one language, and the fix
      strictly *reduces* the disagreement: `es` face-vs-description now differs only in separator,
      where before it also differed in precision.
    - **W-6.2 rule 3, answered:** (a) "a learner who got everything wrong was congratulated with a
      green tick"; (b) "three sections of the Market Dashboard were unreachable by heading
      navigation"; (c) "one bar in five was labeled to a different precision than its siblings".
      All three are things a person would meet. **No check is proposed for any of them** — W-6.3's
      number (`scripts/` at 2.3x `src/`) says a regex is the wrong instrument for all three, and
      (a) is a decision rather than a defect. **Honest priority: (b) medium, (a) low-and-owner's,
      (c) low.** ⛔ **(a)'s priority label was wrong too**: "low-and-owner's" was assigned on the
      belief that it was purely a judgment call, and the batch-pause half needed no decision from
      anyone. **Nothing here remains open.**
    - ⚠️ **(b)'s own numbers were wrong, and this item is the evidence.** I filed (b) from a live
      measurement I had just taken, and still got both the total and the count of missing headings
      wrong — and the *disposition* wrong with them, since three of the four "missing" headings turn
      out to be correct markup. **A residual filed by the run that saw the thing is not exempt from
      step 3.5.** ✅ **All three closed 2026-09-02** — this line read "(a) and (c) remain open"
      until 2026-09-02's compression pass; they closed later the same day, and the item's own
      summary above already said so. A closed item can still contradict itself.

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
    complete compact translations too — read each, do not pad.
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
    — the reading, not the ratio, is the measurement.
    ⚠️ **The ratio is a screening proxy and has BOTH error directions — read every flagged pair
    before believing it.** False positives on short units: `13-17.parentTip` scores zh 0.23 and is a
    complete translation; the three `title`s scored 0.35 and are complete, which is why §66 excludes
    units under 40 code points and controls that exclusion. False negatives too: `13-17.lessons[1]`
    ko silently drops *"But it takes 12-24 months to feel the change!"* and never flagged.
    **§66's known blind spot, asserted as a control rather than left as prose:** a corpus abridged
    EVENLY in every unit moves its own p90 and reads as clean. §33's recorded baseline, not §66, is
    what would catch slow uniform decay; `kidsContent` has no such baseline.

160. **🟡 PARTLY DONE, and its own stop-clause is CORRECTED (2026-09-02, owner-directed: "do item 160
    next"). The clause below says "there is nothing left in it that trimming can honestly reach" and
    routes the remainder to O-3. That is TRUE OF MECHANICAL CUTS — re-proven this run with a stronger
    cutter — and FALSE OF HAND DELETION, which reached the band in all five languages on two
    questions, including one of the two the clause names as the head of the O-3 queue.**
    - ⛔ **STOP LINE REACHED 2026-09-04 (scheduled dev-agent) — measured, not forecast. Everything
      still open in this item is class B, and class B is O-3's decision. Read this before picking it again.**
      - **Length is the ONLY exploitable axis in this quiz, and that is now measured rather than assumed.**
        Two other tells were scored this date, each with controls that fired in both directions:
        **answer position** — `0:10 / 1:13 / 2:13 / 3:10` over 46 questions, best single position
        **28.3% against a 25.0% baseline** (economy 28.6%, essentials 26.7%, money 35.3%); and the
        **absolute-qualifier tell** ("only/never/always/all…") — 22 of 46 questions carry at least one
        absolute-worded option, **P(correct | option is absolute) = 22.2% against 25.0%**, and the
        eliminate-the-absolutes strategy resolves to one survivor on **3 of 46** and is **0 for 3**.
        **Neither is a tell. Do not re-derive them.** Position is additionally guarded by
        `check-data.mjs` §3 at a 50% threshold; absolutes have no guard and need none.
        ⚠️ **`quizMeta.js`'s header still describes the spread as "roughly 3/3/4/3", which is the
        13-question figure from the 2026-08-02 de-skew.** The property it asserts holds; the number is
        stale. Left alone deliberately — W-5.5's rule says re-read it, not that a comment's arithmetic is
        this run's work — but the next run to touch that file should fix it.
      - ⛔ **CLASS A IS NOT A REACHABILITY SCREEN, and it comes apart at the second-ranked question.**
        Class A means "the English correct option has a detachable reasoning tail". Ranked by relative
        margin the queue is **`q008` 57% (B), `q021` 56% (A), `q014` 53% (B), `q005` 50% (A)**.
        **`q021` (lesson 7, marginal tax brackets) is class A and unreachable:** its tail
        (`— the rest is unchanged`, 22 code points) leaves the option at **87 against a ceiling of 54**
        (option 109, band [44,54]), because all three distractors are short slogans; `zh` must reach
        **≤16 from 25** and `ja` **≤18 from 32**. **A detachable tail does not imply a sufficient one.**
      - **`q005` (lesson 34) is the last reachable question and was DECLINED on quality, not on cost.**
        49 → ~23 lands in `en`, but its bands are **`zh` [4,6]** and **`ja` [6,7]** — landing them means
        re-cutting two unreviewed translations to six and seven characters to move §65 by two points.
        That is precisely the "moving the instrument without moving the defect" failure this item's own
        2026-09-03 corollary named. **If a future run wants it, it is a deliberate O-3-shaped choice.**
      - **Live §65 at this stop line, reproduced independently with five scorer controls:** longest-option
        **en 56.5%, es/ko 54.3%, zh/ja 52.2%**; shortest-option 2.2/2.2/0.0/2.2/4.3; **19 beatable in all
        five, 28 in at least one, 124 instances.** ⚠️ **`npm test` will warn at 56.5% every run from here
        and that is now expected, not a regression** — item 121's "a permanent warning is evidence the
        check or the budget is wrong" applies, and the resolution is O-3's, not a trim's.
      - **Honest priority: the remainder is BLOCKED, not low.** Distractor-quality work is new prose in
        four unreviewed languages. **Owner call (O-3), and it is the same call O-3 already asks for.**
    - ⛔ **RANKING BY DELETION COST RANKS BY WHAT THE EDIT COSTS *ME*, NOT BY WHAT THE LEARNER CAN
      EXPLOIT — and the two run opposite ways.** The previous pass closed by naming `q034` as
      "cheapest, tightest" (window 8, 12 code points to remove) and `q039` as the expensive one
      (73). Both figures reproduce exactly. But a learner cannot see a *count* of code points; they
      see a *proportion*. Measured as **relative margin — (len(correct) − len(longest distractor))
      / len(longest distractor)**, with two controls (a 2x runner-up scores 1.000, a +1-of-100
      scores 0.010): **`q034` is 11%, near the WEAKEST of the all-five set, and `q032` was 79-131%
      in every language — the largest tell in the corpus, and more than double the runner-up in
      zh and ja.** Cheap-first and exploitable-first are close to inversely ordered here, which is
      exactly why the biggest tells have survived nine passes. **Rank by relative margin; use
      deletion cost only to break ties.**
    - ⚠️ **A COROLLARY THAT KILLS THE CHEAPEST-LOOKING WORK ENTIRELY.** By deletion cost the three
      cheapest questions in the corpus are `q009` (1 code point), `q010` (1) and `q018` (2) — nine
      tell-instances for about four characters, which looks like the best trade in the item. It is
      not work at all: their relative margins are **3%, 3% and 3%**, i.e. one character out of
      thirty. Shipping those would drop §65 by four points while changing **nothing a human eye can
      resolve** — moving the instrument without moving the defect. **Measured: 6 of the 129
      beatable instances rest on a margin under 5%.** So §65's strict-max rule over-reports, but
      only slightly; the number to distrust is not the rate, it is any ranking built from it.
    - ⚠️ **NOT A PURE DELETION, and the reason is worth keeping.** Deleting the clause alone left
      **en at 44 against a floor of 46** — strictly *shortest*, i.e. the inverse tell this item
      warns about, created by the fix for the forward one. The English was re-worded rather than
      cut (`plus roughly $1,580 more` → `plus the roughly $1,580 he gave up`). **A band has two
      walls, and the cheap questions are the ones where they are close together.**
    - **The remaining 28 split into two classes, and item 160's own rule only reaches one of
      them.** Screening the English correct option for a detachable reasoning tail (em dash, or a
      `because`/`since`/`so that`/`which`/`that would`/`if` subordinator; control: `"A — B"` reads
      true, `"Always buy stocks"` reads false): **class A — a tail to move into `explain` — is 12
      questions** (`q005 q021 q023 q027 q028 q033 q034 q035 q036 q037 q039 q040`); **class B — no
      tail; the correct option is already a bare phrase and the DISTRACTORS are the short ones —
      is 16** (`q001 q004 q006 q008 q009 q010 q011 q012 q014 q018 q019 q024 q025 q031 q043 q045`).
      **`q008` (lesson 40) is now the corpus's largest tell at 57-133% and it is class B**: its
      answer is *"Don't have debt rise faster than income"* against *"Always buy stocks"*, *"Never
      borrow money"*, *"Save 50% of income"* — a two-term comparison against three one-term
      slogans, with nothing to delete. **Class B is not this item's rule; it is distractor-quality
      work, it means writing new prose in four unreviewed languages, and it is therefore O-3's**,
      exactly like the (b) clause below. **A future pass that keeps ranking by relative margin will
      hit class B almost immediately — that is the stop line, not a surprise.**
    - ⛔ **THE PREVIOUS PASS'S CANDIDATE LIST OMITTED THE CORPUS'S WIDEST-WINDOW QUESTION, and the
      omission is a property of how the list was built rather than an error in it.** That pass
      named `q026`, `q034`, `q039`, `q012` as "the next candidates", honestly qualified as "of the
      ones inspected this run". Ranking **all 22** by the window measure this item prescribes puts
      **`q029` first** — minimum window 17 code points against `q026`'s 14, `q039`'s 12 and
      `q034`'s 8 — and `q029` appears on no previous list. **Rank the whole set, not the ones you
      happened to open**; the ranking is four lines of arithmetic over `quizMeta` + the five
      `quizText` modules and is written out in the run-log entry.
    - ⚠️ **MARGIN IS THE THING TO RECORD, NOT JUST FEASIBILITY — the tightest cell here is `q026`
      zh at 21 against a ceiling of 23.** A landing that merely clears `bandMax` re-opens the
      question the moment someone trims a distractor, which is the fragility this item already
      flagged on `q020`'s four exact ties. Every other cell this pass has ≥4 of margin. **Quote
      `answer` and `[bandMin, bandMax]` per language when filing a landing, so the next editor can
      see which cells are load-bearing.**
    - **`q020`** dropped `in retirement` / `now` and their four translations, which made the
      answer the **exact mirror of its inverted distractor** — the same sentence with `withdraw`
      and `contribute` swapped, at 73/73 en, 60/60 es, 41/42 ko, 28/28 zh, 37/37 ja. That is the
      strongest form of this item's style rule: length carries **zero** information, and the pair
      stays equal-length by construction as long as both are edited together. ⚠️ Four of those
      five are exact ties at the band ceiling, so an edit to distractor **[1] alone** re-opens the
      question — edit the pair or neither.
    - ⚠️ **RANK THE QUEUE BY WINDOW WIDTH, NOT BY HOW MUCH MUST COME OUT — this is the reusable
      part.** The obvious ranking (total deletion needed across five languages) puts `q001`,
      `q006`, `q011` first; all three are **infeasible**, because their distractor bands are
      narrow (`q001` zh window **1**, `q004` zh **1**, `q014` ja **0**). `q046` and `q020` sit
      8th and 14th on that ranking and are the two easiest in the corpus, because their bands are
      wide (`q020` en [21,73]). The measurement to take per language is the pair
      **`[bandMin, bandMax]`** and the allowed deletion range **`[len-bandMax, len-bandMin]`**;
      a candidate is feasible when the semantically irreducible string fits inside it in **all
      five**. Prove the candidate is a deletion rather than a rewrite by asserting it is a
      **subsequence** of the shipped string (control: appending one character must fail).
    - **The binding constraint is CJK, and it is the distractor ceiling rather than the answer
      floor.** The clause below says CJK correct options cannot be trimmed; measured across all
      24, the sharper statement is that `ko`/`zh`/`ja` **distractors** run 2-16 code points, so
      the ceiling a trimmed answer must fit under is tiny — `q001`'s Chinese band is [4,5]. Its
      parenthetical `（货币+信贷）` is exactly the shape this item likes and deleting it lands at
      **3**, i.e. strictly shortest: the tell inverted, not removed. **`q001` is the first
      question a new install answers and it is O-3's, not a trimmer's.**
    - ⛔ **AND THE LAST ONE CLOSED THE SAME DAY, owner-directed ("do q042 with the distractor
      work") — the FIRST deliberate O-3 enlargement in this project, priced at +550 characters
      across 15 distractor strings, +366 of them in the four unreviewed languages.** `q042` was the
      question no deletion could reach (a 7-character window in en, **2** in ja). Its three bare
      distractors now each name what that bias would look like in the story, checked against the
      question's own `explain`. **Budget the rest of this item at one question per pass, and expect
      the reading-time coupling:** the option prose is inside `READING_MODEL`, so lesson 28 went
      4 → 5 minutes and the catalog total 160 → 161, regenerated through `npm run readiness`.
    - ⚠️ **AND THE RULE THIS ITEM RESTS ON HAS A HOLE — see item 165.** "The reasoning belongs in
      `explain`" assumes `explain` carries it. Measured this run: **69 of 184 question/language
      pairs are abridged**, concentrated on `q001`-`q014`, the economy track. `q007`'s Spanish
      explanation said only "QE is the Fed's emergency tool" — the mechanism was missing in four
      languages. **Before moving reasoning out of an option, check that the destination is not a stub
      in es/ko/zh/ja.**
    > ⚠️ **Second correction, mechanical but load-bearing: every question label in this item is an
    > ARRAY POSITION, not a question.** "q12/q21/q37/q43/q40/q41" are 0-based indices into `quizMeta`
    > and resolve to ids **q013, q022, q038, q044, q041, q042** (lessons 39, 8, 24, 42, 27, 28 — the
    > lessons this item names, which is how the reading was confirmed). Read as stable ids they name
    > **different questions in every case** (q012→L38, q021→L7, q037→L23, q043→L41). This item was
    > written the same day `review.js` stopped keying learner state by array position for exactly this
    > reason; the labels are left as-is above because they are a dated record (§31), and this line is
    > the translation. **Cite questions by `id` from here on.**
    **Measured 2026-09-01 over the 46 shipped questions, five languages, controls in both directions:
    - *Compressed 2026-09-04 (fifth backlog-compression pass, owner-directed). Dropped: the
      per-tranche shipping chronology and its superseded §65 progressions, the per-tranche O-3
      accounting, the retained ORIGINAL ITEM TEXT block and the old (a)/(b) candidate lists — all of
      it in the run log and the archive under those dates. Kept byte-identical: the headline, the ⛔
      stop line, and every block carrying a standing rule or a named trap. Two were nearly lost and
      are here because a marker count caught them — q020's *edit the pair or neither* tie constraint,
      and the ⚠️ note that the old `q12`-style labels are ARRAY POSITIONS rather than ids. **The live
      §65 figures are the stop line's, not any tranche's.***
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
    **Scope note before anyone builds an instrument for this (W-6.3 — `scripts/` is 2.3x `src/`).**
    The cheap version is not a new script: it is adding `takeaway`/`thinkAbout` to the field list
    that §17b and the §10.1 corpus walk already iterate. Measure which existing sweeps take a field
    list at all before proposing a new section.
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

156. **✅ DONE 2026-09-03 (scheduled dev-agent) — the measurement this item asked for was taken, and
    it cleared the axis the item names while finding a LIVE defect on an axis the item does not
    mention.** The item's question — does the coach mark center correctly at 320px/200%? — answers
    **yes**, at 100/115/130/150/200%: `left: 16, right: 304`, `scrollWidth === clientWidth === 320`,
    0 box and 0 text overflows. **The pattern-consistency argument was sound and the change it
    defended was right.**
    ⛔ **What the item did not scope was the VERTICAL clearance, and that was broken in shipping
    code.** `bottom` was `calc(… + 12px + 76px + 10px)`, where `76px` is the nav pill's height
    measured at the 1.3x font scale — a text-driven quantity frozen as a constant. Browser/OS text
    zoom goes past 1.3x (WCAG 1.4.4, AA — the same criterion item 153 established): the clearance
    fell 23.4 → 18.2 → 12.9 → 6.6px across 100/115/130/150% and **inverted to a 37.2px overlap at
    200%**, where the pill is 123.2px tall. The coach mark is `zIndex: 150` over the nav's 100, so
    `elementFromPoint` at the top edge of **all three tabs** returned the coach mark. Tap targets
    shrank by 32px of 113px rather than dying, and the overlay was plainly visible over the tab bar.
    - **Fixed:** `--nav-h` is published from a `ResizeObserver` on the nav and the offset reads
      `var(--nav-h, 76px)`. Verified at six root font sizes in `en` and `ko`: `--nav-h` matches the
      measured pill to ≤0.02px and clearance is exactly 10px throughout.
    - ⚠️ **`rem` was considered and is WRONG, which is the transferable part.** The pill's height is
      not a function of root font size alone — the tab labels wrap (item 153), so at the **same** 200%
      root font the pill is **123.2px in English and 99.2px in Korean**. No font-relative constant
      spans a 24px language-dependent gap; re-expressing the px constant as `4.75rem` would have been
      the same defect in a better-looking unit.
    - **The durable methodology note is in the run-log entry** and a reviewer needs it: in the Browser
      pane `requestAnimationFrame` never resolves, and `ResizeObserver` does not deliver while the
      pane is hidden — a planted control observer fired 0 times and the fix looked like a no-op. A
      `computer{action:"screenshot"}` forces the paint that delivers the callbacks.

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
    - **A LIVE INSTANCE, found 2026-09-03 by a run doing something else and reported rather than
      fixed — the property does NOT still hold.** At **320px / 130% / es**, the lesson reader's
      "Completar" button reaches x = **329.3** against a 320px viewport (`scrollWidth` 329). **Control
      carried, because the run had just added a figure to that screen and had to know whose defect it
      was:** lesson 33 at identical settings, with no new figure on it, shows the identical button at
      the identical 329.3 and the identical `scrollWidth`. So it is pre-existing, it is the button
      rather than the figure, and it is exactly the class this item's probe is for — a right-edge scan
      would catch it, since the button's own border box overflows. Untouched by that run (out of its
      scope); this is the first named live instance this item has.
    - ✅ **THE LIVE INSTANCE IS FIXED 2026-09-03 (scheduled dev-agent) — the app half only; the
      probe this item is actually about is still unbuilt and still open.** ⛔ **And the instance's
      own scope, filed one run earlier, was WRONG in the way this log names weekly: it said
      `es`, and `en` overflowed too.** Re-measured on the built app at 320px before any edit, with
      a planted 900px probe firing (9 findings) and a clean read at 0.9/1.0/1.15 as the negative
      control: `es` "Completar" right edge **329.3**, `en` "Mark Complete" **326.6**, both against a
      320px viewport; `ko`/`zh`/`ja` clean, with the probe re-planted in the `ja` context to prove
      the zero was a reading and not a dead instrument. **Mechanism, measured rather than inferred:**
      a flex item's `min-width` is `auto`, so neither button can shrink below min-content —
      142.3px ("Anterior") + 163px ("Completar") + an 8px gap needs **313.3px of a 288px row**.
      **Fixed with `flexWrap: "wrap"` on the row** (`src/screens/LessonReader.jsx`), which breaks the
      line on exactly the min-content condition and so needs no breakpoint: identical geometry at
      scale 1.0 (both buttons on one line, 128.7/221.3 at 390px), stacked full-width above it.
      Post-fix sweep, all five languages × {0.9, 1.0, 1.15, 1.3, 1.5, 2.0} root font at 320px:
      `scrollWidth === 320`, zero findings, control still firing.
      ⚠️ **The bottom nav's 200% overflow was a SYMPTOM of this one, not a second defect.**
      Pre-fix at `en`/2.0 the scan also reported `NAV`/`BUTTON:Reference` past the viewport; they are
      gone post-fix, and the Learn screen — which has no reader row — measures clean at 2.0 on its
      own. A fixed-position bar sized to a document the reader row had widened.
    - **Honest priority: low-to-medium.** ⛔ **The "property that holds" half of the line below is now
      false** — see the live instance above. It guards a property that held as of 2026-08-30 and does
      not today, which strengthens the item rather than weakening it.
      Original: it guards a property that holds as of 2026-08-30, but it
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
    - ⛔ **(a)'s ARGUMENT NOW REFERS TO COPY THAT NO LONGER EXISTS, and the copy it referred to was
      false (corrected 2026-09-02).** (a) rests on "the Steps rail directly beneath it, which already
      says a check question joins the queue **when you finish a lesson**". It did say that, in five
      languages, and **finishing a lesson has never enrolled anything**: `completeLesson` does not
      touch the schedule and `recordReview` is reachable only from an answer. Measured through the
      real UI from cleared storage — open lesson 29, press Mark Complete, answer nothing —
      `ecycles_completed_lessons` is `[29]`, `ecycles_review` **does not exist**, and the Review tab
      told that learner to do the thing they had just done. Fixed by naming the real trigger in all
      five languages; **(a) is still open and still a judgment call**, but read its argument as "the
      rail explains how a question enters the queue", which is now true.
    - **Two seams noticed while measuring this, filed as notes and not as items (W-6.2 rule 2).**
      (i) `showPracticeCoachMark` is `completedLessons.length > 0`, so the coach mark sends the
      learner to Review at exactly the moment Review is empty — harmless now that the card names the
      right next action, but the trigger is still completion. (ii) ~~The `Steps` rail marks `done` with
      **color only** — measured, step 1's glyph stays the `book` path and only moves
      `--ink-accent` → `--ink-ok` — so the done state is carried by hue alone.~~
      ⛔ **PREMISE WRONG, and the half it got wrong is the half that mattered — corrected and CLOSED
      2026-09-03 (scheduled dev-agent).** "Color only" is false: measured on the built app, the done
      step's title also carries `text-decoration: line-through` and drops `--ink-strong` →
      `--ink-muted`. A sighted learner gets two non-color signals, so there was never a WCAG 1.4.1
      defect here and the fix this note proposed (swap the glyph) would have addressed nothing.
      **What the note missed by scoping to color is that NONE of the three signals reaches assistive
      technology**: the glyph is `aria-hidden`, `line-through` is not announced, and muted ink is a
      color. Measured with a control that fires (the Learn path's own `SrOnly` "Completed" on a
      completed lesson, which the same instrument reads back): the done step and its two undone
      siblings read out **identically, word for word**. Fixed by giving `Steps` a `doneLabel` prop
      rendered through `SrOnly` — the convention the Learn path already uses — in all five languages.
      **Transferable: "carried by hue alone" and "carried by nothing an AT can reach" are different
      defects with different fixes, and the first is the one that is easy to see in a screenshot.**
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
    > ✅ **BUILT 2026-09-02 (owner-directed: "build the Leitner box-distribution strip"), after being
    > offered back three times. It was the last unbuilt item from the canvas, so THIS STREAM IS NOW
    > COMPLETE and item 26 can close.** The cost estimate that held it open was re-measured and was
    > exactly right: five new locale keys x five languages, 25 strings, all machine-translated (O-3's
    > standing condition applies). What the estimate got wrong was the OTHER half of its own sentence
    > — "changes nothing a learner does" was a judgment about behavior, and the strip's actual value
    > is that it is the only place the schedule's SHAPE is visible: the due card and the practice-all
    > button both report today, and nothing showed that the boxes exist or that material climbs them.
    > Built by REUSING `charts.jsx`'s `Bar` at a fifth call site rather than as a new primitive, so
    > `scripts/` gained 0 lines and the strip inherited the sub-375px row layout and the `rem` box
    > height that stopped bar tracks rendering 9px tall at 130% root font. See the run-log entry for
    > the plural defect the n=1 control caught after the rule to prevent it had already been written.
    > ORIGINAL CLAUSE, kept because the line above answers it:
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
    > would have had to invent the one quantity the lesson says nobody checked. ~~**Lesson 25**
    > (save vs. invest) closes on *"not a formula with one right numeric answer"* and states no rate,
    > horizon or amount to plot.~~ **✅ LESSON 25 SHIPPED 2026-09-04 (scheduled dev-agent) as
    > `MatchGrid` — this rejection is RE-DECIDED, not overridden, and the distinction is the useful
    > part.** Both of its stated facts reproduce exactly: lesson 25 states no rate, horizon or amount,
    > and it does close by refusing a numeric answer. **What does not follow is the conclusion**, and
    > the reason is visible in the same entry: the quantity rule asks whether the prose states every
    > quantity *the shape needs*, and a shape that needs **zero** satisfies it vacuously. The run that
    > wrote this rejection picked **lesson 28** in the same commit — a partition carrying no magnitude
    > at all — so the categorical option was in its hand while it applied the quantitative test to
    > lesson 25. **The rule is about invented quantities; it was read as a requirement to have some.**
    > The second half of the rejection is the stronger one and it does bind: a grid over savings
    > against investing can hand the reader the rule the lesson withholds. **The line that survives
    > the objection is between the PAIRING and the THRESHOLD.** The pairing is stated at length in
    > lesson 25's own prose in five languages; the threshold — how soon is soon, what rate, what
    > amount — is what it declines, and `check-data.mjs` §72 (a) fails the build on a digit in any
    > axis label while §72 (e) fails it on a green, a red, a tick or a cross.
    > **The rule held in all three, and it is still first in line for any
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
    > ⚠️ **AND THE 2026-09-04 RUN RE-DERIVED THREE OF THEM ANYWAY (18, 21 and 42), reaching the same
    > verdicts independently and paying for the privilege. Not because the list is unclear — it is
    > excellent — but because it sits ~85 lines BELOW this item's headline, past a re-scope notice
    > and eight "Nth visual added" paragraphs.** The transferable part is not "read more carefully":
    > it is that **an item this long has a body a picker will not reach before it starts measuring**,
    > and these two ⛔ candidate lists are the single highest-value thing in it. Whoever next
    > compresses this item should lift them to the TOP, directly under the item's title.
    > **Tenth visual added 2026-09-03: lesson 34 (deleveraging), as `BalanceBand` — the first figure
    > whose subject is an INTERVAL.** Coverage re-parsed with this item's own control (must find 36,
    > must not find 9999, 44 lessons): **economy 7/12, essentials 3/15, money 5/17 — 15 of 44, 0
    > orphan ids.**
    > **It cleared the bar on the lesson's own takeaway sentence**: *"Print enough money to offset
    > deflation, but not so much you cause hyperinflation."* That is a floor and a ceiling on one
    > dial, delivered as two clauses joined by "but" — prose can name each bound and cannot show that
    > they bound the same dial with the good outcome between them. The quantity rule passes vacuously,
    > as it did for `OutcomeGrid` and `SpendingLoop`: the figure needs no quantity and the lesson
    > states none in that section. **The two OUTER zones carry the same label on purpose** (the lesson
    > gives Germany in the 1920s and the US in the 1930s as instances of the same "ugly
    > deleveraging"), which is what makes the figure a claim about non-monotonicity rather than a list
    > of three cases. 45 of its 50 strings are lifted verbatim from lesson 34; `check-data.mjs` §69
    > holds all of it, and its (c) block is the one to read — see the run entry for why an ordering
    > control scoped to the whole lesson passes in English and is wrong in the other four.
    > ⚠️ **String correction 2026-09-05 — a fact correction, not a design correction.** The left
    > anchor now reads **"The US in 1930-32"** in all five languages: lesson 34's claim about the US
    > 1930s was factually wrong and was fixed that day (see the run log). **The non-monotonicity
    > argument above and the figure's shape are unchanged** — only the anchor's date range moved,
    > and §69 (a) forced the figure and the prose to move together. The 2026-09-03 text above is
    > kept verbatim per §31.
    > ⛔ **THE MONEY TRACK NOW HAS NO REACHABLE CANDIDATE UNDER THIS ITEM'S OWN RULE, measured
    > 2026-09-03 — this is a finding, not a to-do.** Money is **5/17** and is the track §0 calls the
    > product. Of its twelve bare lessons, **16, 18, 19, 20, 21, 24, 25, 26 and 42** are this item's
    > existing measured rejections; the three never assessed were read on 2026-09-03 and all three
    > fail: **22** (confirmation bias) and **41** (the subject that wasn't on the timetable) state no
    > quantity and no structure — their claims are about attention and about history — and **43**'s
    > axis is time-coupling, which is *already one of the two axes lesson 44's `TradeoffPlot` draws*,
    > so a figure there would redraw a shipped axis one lesson early. **Economy 35, 39 and 40 were
    > also read: 35 is a dial whose effects the lesson lists sequentially with no magnitude for any of
    > them.** The next figure must come from `essentials` (twelve bare, none ever assessed) or from a
    > lesson whose prose changes. **Do not re-derive any of the rejections above.**
    > **Eleventh visual added 2026-09-03: lesson 12 (renting vs. buying), as `SplitBand` — the first
    > `essentials` figure since 2026-08-16, and the first whose subject is a COMPOSITION THAT
    > INVERTS.** Coverage re-parsed with this item's own control (must find 36, must not find 9999,
    > 44 lessons, joined against `lessons.js`'s `track`): **economy 7/12, essentials 4/15, money
    > 5/17 — 16 of 44, 0 orphan ids.** ⚠️ The parser in this item's older text — a regex over
    > `lessons.js` — returns **0 lessons** today because the entries are multi-line; importing the
    > module is what works, and the control is what caught it. Do not re-derive that.
    > **It cleared the bar on section 2's own pair of sentences**: *"early payments are mostly
    > interest, and later payments are mostly principal"*, then, separately, *"A 30-year loan often
    > doesn't cross the halfway point between interest and principal until roughly two-thirds of the
    > way through its term."* Three claims live there and prose can only make them one at a time —
    > that the two parts are shares of ONE payment, that the larger of the two swaps, and that the
    > swap is **not** at the middle. The last is the lesson's own flagged surprise ("a pattern many
    > buyers don't expect") and it is a POSITION: a sentence can name it, and cannot put it beside
    > the midpoint it is being contrasted with.
    > ⛔ **THE QUANTITY RULE PASSES BY DERIVATION, WHICH IS NEW HERE AND IS THE PART TO REUSE.**
    > Lesson 12 gives no payment amount and no interest rate, so a curve drawn by eye would be
    > inventing the rate — the exact ground lessons 16, 18 and 21 were rejected on. But the interest
    > share of a fixed payment is `s(f) = 1 - k^(f-1)` with `k = 2^(1/(1-crossing))`, in which
    > neither the principal nor the payment survives; so the **entire curve follows from the one
    > number the lesson states**, the two-thirds crossing, and `k = 8`. `check-data.mjs` §70 (d)
    > re-derives it rather than re-reading it. **The rule to carry: a shape whose parameters cancel
    > can be sourced from a single stated fact, and that is not the same as inventing one.**
    > ⚠️ **NO SCALE ON THE VERTICAL AXIS, AND IT MUST STAY THAT WAY.** `s(0) = 7/8` is derived, not
    > stated; the lesson says only "mostly". §70 (f) asserts the SVG carries exactly two `<text>`
    > nodes (the two end labels), so a future run cannot add a tick, a percentage or a real
    > amortization schedule without the check failing — all three would make the figure state what
    > the prose declines to.
    > ⛔ **AND THE COLOR LESSON, which is item 135's class arriving in a figure that had already
    > been checked.** The first version drew the boundary in `ink.muted` and shipped a comment
    > saying it was "a stroke with luminance of its own". Measured on the built app against the two
    > fills it is drawn ON: **1.10:1 and 1.18:1 in light, 1.36:1 and 1.58:1 in dark.** It is a text
    > token (7.01:1 on the card) and on a saturated fill it is nearly invisible — the boundary, the
    > marker and the dot would all have vanished. `surface.card` replaced it (7.72/5.93 light,
    > 8.93/10.41 dark) and §70 (e) asserts the pair against all three palette blocks. **§28b covers
    > graph-on-surface and says nothing about a mark drawn ON a fill; that gap is general, and any
    > future figure that draws one owes the same live measurement.**
    > ⛔ **THE ELEVEN `essentials` LESSONS STILL BARE WERE ALL READ ON 2026-09-03 — do not
    > re-derive these.** **5** (diversification), **8** (insurance), **10** (W-2 vs 1099), **14**
    > (estate planning) and **15** (credit reports vs scores) state **no quantity at all** in the
    > section that carries their claim; 5's and 8's shapes would each have to invent a series, and
    > 15's cross-product of bureaus and models would have to commit to a count the lesson
    > deliberately leaves open ("multiple scoring models", "such as"). **9** (inflation) looked
    > strong — a nominal line rising while a real line falls — but states $1,000 and twenty years
    > and then gives both rates as "a modest percentage" and "a similar or larger percentage": two
    > lines, two invented slopes, which is lesson 16's rejection exactly. **11** (fees) states every
    > quantity a chart needs ($10,000, 30 years, 7% vs ~6%, $75,000 vs $57,000) and is rejected on
    > the OTHER rule: lesson 3's shipped `GrowthCurve` is already two lines from one origin whose
    > caption is "the gap widens every year", and lesson 11's own prose says a fee works "exactly
    > like" that — so the figure would redraw a shipped shape to illustrate a stated analogy. **2**,
    > **4**, **6** and **13** state scattered amounts with no structure joining them. **The next
    > figure has no named candidate here either**, and that is a finding rather than a gap.

    > **THE BAR FOR AN ELEVENTH IS UNCHANGED AND STILL BINDS**, and there is again **no named
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
    > ⛔ **NINTH VISUAL, 2026-09-04, AND IT IS THE FIRST IN THIS ITEM THAT REPLACED A WRONG FIGURE
    > RATHER THAN FILLING A GAP — because the rule quoted directly above was applied to the CANDIDATE
    > and never turned on the INCUMBENTS.** The paragraph above declines `CycleChart` for lesson 31
    > because its four phase dots are lesson **38**'s vocabulary. That same figure was, at the moment
    > that sentence was written, **already shipping on lessons 32 and 33** — five and six screens
    > before the lesson that defines the phases. Measured on the built app 2026-09-04: lessons 32, 33
    > and 38 rendered a **byte-identical `<figure>`, 1,667 characters, one fingerprint**, with lessons
    > 30 (3,132 b) and 36 (1,069 b) differing as the controls that prove the extractor was live.
    > **The mapping was never a decision about lesson 33 at all**: `git log -S` shows `33: "cycle"`
    > entered in `e15e63d`, the owner-directed lesson-id **renumbering** (item 22), which only re-keyed
    > `5: "cycle"` — the three-way share predates the track split and no run ever chose it for this
    > lesson.
    > **On lesson 33 the mismatch is not marginal, and the instrument had a control that fired.**
    > Scanning each lesson's own prose for the four rendered phase labels **in its own language**
    > (positive control: lesson 38, which owns the vocabulary, must score 4/4 — it does, in all five):
    > **lesson 33 scores 1 of 4 in all five languages** (only "Peak"), lesson 32 scores 2-3 of 4. And
    > lesson 33's takeaway says what it teaches is *"fundamentally different from a regular
    > recession"* — over the picture the previous lesson uses for a regular recession.
    > **Shipped as `NestedCycles` (charts.jsx) + `nestedCycles*` (markets.js), guarded by
    > `check-data.mjs` §71.** It clears this item's bar on lesson 33's third section, which states
    > both spans in adjacent sentences — *"each one arrives every 5-8 years"* and *"The long-term cycle
    > spans 75-100 years"* — and then draws the conclusion that follows from dividing them: *"almost
    > nobody alive personally remembers the last time it peaked."* **Prose can put two numbers next to
    > each other; it cannot do the division.** The figure is that division already done: one long rise
    > with twelve short cycles riding it, bracketed at one cycle and at the whole span.
    > ⚠️ **BOTH AXES CARRY NO SCALE AND THERE IS NO TIME ORIGIN, and the second one is §10.1.** Lesson
    > 33 defines the vertical axis (*"the debt burden (the ratio of what's owed to what's earned)"*)
    > and states no value for it anywhere, so no tick and no number is drawn on it. The horizontal
    > axis is a **span**, not a set of dates: lesson 33 closes by *asking* the reader whether today
    > looks like the late stage of a long-term cycle, and a "you are here" marker would answer that
    > question for them. §71 (d) holds both, and **a future run must not add a date, a "today" line or
    > a shaded region.**
    > ⚠️ **THE CYCLE COUNT IS BOUNDED BY THE LESSON, NOT CHOSEN.** 75/8 ≈ 9.4 and 100/5 = 20, so any
    > whole count in [10, 20] is derivable from the prose and nothing outside it is; `NEST_CYCLES` is
    > 12 and §71 (c) asserts the interval rather than the constant. **This is the answer to lesson
    > 16's and lesson 17's rejection test** ("does the prose state every quantity the shape needs?"):
    > here it states a *range* for the one quantity that matters, which is enough, and states nothing
    > for the axis — so the axis gets nothing.
    > ⛔ **THE SUITE CAUGHT A REAL DEFECT IN THE FIRST DRAFT, and the fix was not the one the error
    > prescribed.** The figure shipped a baseline rule in `line.hairline`; `check-data.mjs` §51b failed
    > it (no `line.*` token clears 1.4.11's 3:1, so such a rule is legal only as registered
    > decoration). **Registering it would have been wrong.** Measured from the curve's own arithmetic,
    > the wave passes within **~5px** of that floor at its first trough, and a rule that close under a
    > curve reads as the axis's **zero** — a value lesson 33 states nowhere, on the axis this figure's
    > own header insists carries no scale. The rule was **removed**, not exempted; the full-span
    > bracket already frames the plot in a `graph` token §28b holds to 3:1. §71 (d) now keeps it out
    > on the *content* ground as well as the contrast one. (W-6.1's standing lesson, met in the wild:
    > **an error message that prescribes a fix is a claim about the fix, not a measurement of it.**)
    > **Coverage re-measured 2026-09-04 with the parser control (must find 1, 30, 44; must not find 2,
    > 29, 31): economy 7/12, essentials 4/15, money 5/17 — 16 of 44, 0 orphans.** The comment in
    > `LessonVisual.jsx` said **6/12, 3/15, 14 of 44** — stale since lessons 34 and 12 landed on
    > 2026-09-03, in the same comment block that says "do not quote a coverage count from backlog item
    > 27; re-run the parse". Corrected in this commit. **Do not quote these three numbers either.**
    > **Note, not an item (W-6.2 rule 2): lesson 32 has the same defect in a milder form and is left
    > alone deliberately.** Its own headings are "Expansion Phase" and "Contraction & Recession", so
    > 2-3 of the four labels are its own words, and "Trough" is in none of the five. Zero learner
    > confusion is *claimed* here, not measured — this is a note so that a future run picking it up
    > starts from the scan above rather than re-deriving it.
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
      > deleted.** ~~Coverage 2026-08-31: **13/44 overall — economy 5/12, money 5/17, essentials
      > 3/15**, unchanged since 2026-08-28. In display order the path's **first three lessons — 29
      > (Transactions), 30 (Credit), 31 (Productivity Growth) — carry no figure**, so the screen a new
      > install actually opens is still the case against the differentiator; only its id moved.~~
      > ⛔ **BOTH OF THOSE SENTENCES WERE FALSIFIED LATER THE SAME DAY, by the run that added lesson
      > 30's `SpendingLoop` — whose own note sits 40 lines below in this same item and says 14/44,
      > economy 6/12. This item has therefore been internally contradictory since 2026-08-31; struck
      > and corrected 2026-09-02 (scheduled dev-agent).** Re-parsed with this item's own control
      > (must find 36, must not find 9999): **14/44 — economy 6/12, essentials 3/15, money 5/17.**
      > **Lesson 30 HAS a figure.** The concrete failure mode of leaving it: a run reading the struck
      > text adds a SECOND figure to lesson 30. **The bullet's point survives the correction and
      > narrows** — it is now one lesson, not three: **lesson 29 is the screen a new install opens
      > and it carries no figure**, measured live 2026-09-02 at 0 figures and 0 `[role="img"]`
      > (control: lesson 36 returns 1 and 1). See the "dead pick 2" paragraph in that date's run log,
      > and read the ⛔ block below before proposing one — **both of lesson 29's candidate figures are
      > already measured and declined there, and a third variant that adds a credit split to the
      > \$500 invents the proportion the lesson is about, which is the same rejection again.**
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

### 2026-09-05 (owner-directed, interactive: "deploy the dist folder to Netlify Drop", then "claimed it, update the README and close out O-1") — O-1 is CLOSED after 19 days: the app is live at <https://magnificent-mochi-73aecc.netlify.app>, and getting there took three steps where the repo's instructions described one

**This is the first deploy in the project's history.** O-1 has been named "the entire critical path"
in the closing line of every run entry since 2026-08-20. It closed the first time the owner asked for
it directly, in one session.

**⛔ The part with transferable content: "deployed" and "reachable" are three steps, not one.**
`README.md` said Netlify Drop "is a drag of the `dist/` folder", written from Netlify's documented
flow. Measured by doing it:
1. **An unclaimed drop is not a public URL.** It is password-protected (password shown on the page)
   **and expires in about an hour**. Verified: every path returned **401**, root and hashed asset
   both serving the same 3,551 b password gate.
2. **A claimed drop is still not public.** Claiming produced a real site (`site_id`
   `e485658b-2605-499d-86c6-d441e0bd0221`, owner's team) that **still 401'd** — with a *different*
   786 b body redirecting to `app.netlify.com/edge-access`. *Production visibility* was **Private**;
   visitors got a Netlify login. The setting is at Project configuration › General › Visitor access.
3. Only after the owner set it public did the URL serve the app.
**Each step's claim was checked before it was believed, and steps 1 and 2 both failed the check.**
The owner's message said "claimed it" and the site was still 401 at that moment; had that been taken
on report, `README.md` would now assert a live URL that redirected every visitor to a login.

**Verification of the live site — unauthenticated `curl` from the shell, no Netlify session.**
Root **200**; the hashed bundle **byte-identical** to the local build (`cmp`); the deployed
market-data JSON at `asOf 2026-09-04`; **negative control**: a made-up asset URL returns **404**, so
the 200s are real files rather than a catch-all. **Cold client-side render**, in the in-app browser
pane which has no Netlify cookie: the deep link `#/learn` holds its hash, the app boots, and the
**§10.1 first-run disclaimer modal renders and gates first use** — so the launch-blocking legal
surface works for a first-time visitor, not just in dev.
⚠️ **The served `index.html` is NOT byte-identical to the built one and that is expected**: Netlify
injects one comment and two `<meta>` tags (`hosting-provider`, `netlify-deploy`) — five lines, no
script, no beacon. Recorded in `README.md` so a future diff is readable.

**What shipped.** `README.md` § Deploying rewritten around the live URL, the verification, an update
procedure, and the three-step finding above. `AGENT_LOG.md`: **O-1 closed** with its 19-day span;
**O-2 promoted** to sole critical path; the ⛔ OWNER ACTIONS header corrected from "these two items";
the App summary's blindspot paragraph corrected from "10.4 through 10.10 are OPEN".
`LAUNCH_PLAN.md`: **10.10 moved from Open to Closed**, its refuting number satisfied on the URL
clause.

**⭐ What the day says about the mechanism, and it is the reason this entry exists rather than just a
commit.** This morning's scheduled run checked 10.8 and 10.10 because both fell due today, and
recorded of 10.10: *"no scheduled run can ever close 10.10 — only the owner can supply the fact."*
**That prediction held exactly, hours later.** The two things no run could produce were a Netlify
sign-in and a visibility setting. **Nineteen days of closing lines moved this none of the way; one
direct instruction moved it all of the way** — which is evidence for asking the owner for a decision
over restating a blocker, and is now written into the OWNER ACTIONS block.

**Step 5 — adversarial self-check.** *Blindspot register:* no app content changed — `dist/` was
rebuilt from HEAD and published unmodified; `check-blindspot` exit 0. Before publishing, `dist/` was
scanned for secrets and identifiers (no keys, no `woojoongkim`/`Kaeun`/email, no `/Users/` paths, and
none of the three real values in `api-keys.txt`) with the scan **proven live** — a 40-char probe from
`api-keys.txt` is absent from `dist/` but found in a planted copy of `index.html`. *DECISIONS.md
conflict:* none; the Vite/static/hash-routing choices are what made a zip-drop work at all.
*Already-done item:* no — nothing has ever been deployed before. *My own verification claim:* every
figure is from a command re-run this session, and the negative controls (404, planted probe) mean a
reviewer can tell a working instrument from a dead one.
⛔ **What the check found against me: §26 failed twice on my first `README.md` draft**, which cited
`/assets/index-DFShU1Ip.js` and `/data/market.json` as evidence. They are URL paths on the live site;
§26 correctly read them as repo paths that do not exist. **Not fixed with an exemption** — the
filenames are content-hashed and would have gone stale on the next deploy anyway, so the README now
describes them instead of pinning them. Second time today that §26 caught a citation and the right
answer was to stop citing, not to exempt.

**⚠️ What is NOT true now, stated because it is the easy thing to overclaim.** **Nobody has been
measured opening this app.** 10.10's refuting number is an OR and only the URL clause is satisfied;
`analytics.js`'s `sink()` still writes to one device's `localStorage`. **O-2 is the whole critical
path**, and §4.3's Phase-0 completion gate stays ❌ Unmeasurable until it lands. §10.6 (building
instead of distributing) is the open blindspot that now carries the weight — its standing rule, half
of weekly hours to distribution, starts applying **today**.

**Cost accounting.** `npm test` exit 0; verdict lines identical to the pre-edit baseline except the
W-6.4 floor warning, **412,623 → 415,072 b (+2,449)** — backlog and App-summary edits land in the
non-archivable floor, and this is the expected price of closing the item rather than a regression.
`npm run build` exit 0. **0 lines added to `scripts/`.**

**Owner tree:** `git status` at run start and before writing showed the owner's untracked `UIUX/` and
0-byte `course` only, **untouched**. `HEAD` re-checked and unmoved at `7636636` before writing;
`public/data/market.json` untouched at `asOf=2026-09-04`.

### 2026-09-05 (scheduled dev-agent, picked from `LAUNCH_PLAN.md` §10 — two blindspot checks fell due TODAY and nothing in the repo watches those dates) — 10.8's tripwire fires at 10.61x against a 5x threshold, every one of the 17 rolling windows since it was filed fires, and 10.10 cannot be closed by any run because its refuting fact is not observable from inside the repo

**Where the pick came from, and why it is not a residual chain.** The previous entry queued nothing
("this run files no numbered residual"), and item 167's remaining (a)/(c) are explicitly barred as a
headline pick by their own W-6.2 rule 1 clause. So I went to the launch plan and found two blindspot
entries whose **Check:** field read **2026-09-05** — today. Both were undone.

**Step 3.5 — the premise re-measured before anything was edited.**
1. *Are they actually due and undone?* `grep '\*\*Check:\*\*' LAUNCH_PLAN.md` returns three dates:
   10.8 and 10.10 at **2026-09-05**, 10.9 at 2026-10-03. `grep '10\.8' AGENT_LOG.md` returns two
   hits, neither a measurement. The 2026-09-04 owner-directed run (`e290e80`) did review the **nine
   `CLAIMS.md` rows** that shared this date — it did not touch the blindspot register, which is a
   separate register with its own dates.
2. *What enforces those dates?* **Nothing.** No script under `scripts/` reads `Check:` or `Refuting
   number` — `check-claims.mjs` covers `CLAIMS.md` only. The dates arrive unannounced; a run has to
   notice them. That is why both were still open on the day they came due.

**⭐ 10.8 — the tripwire FIRES, and the number has moved the wrong way.** 7-day window ending
2026-09-05: **25,173 lines of `AGENT_LOG.md` churn against 2,372 lines of application code
(`src/` minus `src/content/` and `src/locales/`) = 10.61x**, threshold **5x**, against the **7.56x**
this entry recorded when it was filed on 2026-08-20 — **+40%**. It is not one bad week: **all 17
rolling 7-day windows ending 2026-08-20 through 2026-09-05 exceed the threshold**, min **7.07x**,
max **19.52x**, and the seven windows ending on or after the day W-6.2 landed read 14.59, 14.26,
16.54, 10.91, 11.12, 10.92, 10.61. **The remedy aimed at this shape is not visibly moving the
number it was aimed at.** Against all of `src/` the same window reads 6.21x, so unlike 2026-08-20
the denominator correction is no longer what decides the answer — both readings now fire.

**⛔ The instrument, its control, and the trap it caught in my own first pass.**
- Instrument: `git log --since --until --numstat --no-merges`, insertions+deletions per path,
  `AGENT_LOG.md` over `src/`-minus-content-and-locales. `AGENT_LOG.archive.md` **excluded** — an
  archiving pass is a *move*, not new writing (including it reads 15.45x for this window).
- **Calibration control, run before the result was believed:** re-measure this entry's own window
  (2026-08-13 → commit `367707f`, which is the commit that wrote the 7.56x). It returns **3,023
  application lines exactly**, 22,893 log lines against the 22,856 recorded, **7.57x against 7.56x**.
  The instrument reproduces the reading it is being compared to. Two more: path classification
  asserted against **9/9** known paths, and an empty window returns `commits=0` and `NaN` rather
  than a clean-looking zero.
- ⛔ **What the control caught against me.** My rolling-window pass and my single-window pass
  disagreed (26,050/2,385 vs 25,173/2,372) for the *same* stated window. The rolling script labelled
  each row with `new Date(e).toISOString()` — **which converts an end-of-day local timestamp to UTC
  and shifts every label one day forward**. Every ratio was right; every date attached to one was
  wrong, and the version of this entry I had drafted quoted "ending 08-22" and "ending 08-30" for
  windows that end on 08-21 and 08-29. Caught only because two instruments were run over one window
  and made to agree. **A date label is a measurement too.**

**10.10 — not refuted, and it cannot be refuted from here.** Still zero: no host-config or CI
workflow file in the tree, `README.md` §Deploying still opens *"Nothing has ever been deployed"*
(written 2026-08-17, still accurate), and the only `netlify.app`/`github.io` strings anywhere are
that section's own instructions, a `vite.config.js` comment and one archive line — four hits, which
are the scan's positive control; a nonsense probe returns none. **The finding worth recording is
about the tripwire, not the count:** a reachable URL and "one person has opened the app" are facts
about the world outside this repo, no local instrument can see either, and the hard rules forbid a
run touching the remote. **No scheduled run can ever close 10.10.** The entry now says so, and says
in advance what would count as evidence.

**What shipped.** `LAUNCH_PLAN.md` only — 48 insertions, 2 deletions. Both entries keep their
original text **verbatim**; the result is appended under each, and each `Check:` moves to
**2026-10-03** with the reason in the line. That date is not invented: it is §9.3's monthly-audit
date and the one the 2026-09-04 run moved all nine `CLAIMS.md` rows to, on the reasoning that rows
falling due on a day no audit runs is how a prompt becomes a warning nobody acts on. The register
now has one date instead of three.

**Two things deliberately NOT done.**
- **No script.** W-6.2 rule 3 asks for the learner-visible failure a new check would catch; a churn
  ratio has none, and `scripts/` is already 2.15x the application. The full recipe and its control
  are written into the register entry instead, so the next check reproduces rather than re-derives.
- **No new backlog item.** Filing a 3 KB item about excessive process writing into the 382 KB
  backlog that W-6.4 says *is* the over-budget floor would be the finding happening again. This
  entry is also kept deliberately short for the same reason; it lands in the archivable run log
  (103 KB, 41% of budget), not the floor.

**Verification.** `npm test` **exit 0**; the `WARN`/`FAIL`/`PASS` verdict lines `diff` **byte-identical**
to a baseline captured before editing (4 warnings, all pre-existing). `npm run build` exit 0, 958 ms.
`npm run check-blindspot` exit 0. ⚠️ **One thing the build caught:** my first draft of 10.10 named
`netlify.toml` and `vercel.json` as files that do not exist, and `check-data.mjs` §26 failed on
`vercel.json` — correctly, since §26 verifies cited paths resolve. **The fix was not a `path-ok`
exemption** (W-6.1's retraction is about exactly that reflex, and `README.md` already carries the
marker for that filename): the sentence now defers to `README.md` §Deploying instead of re-listing
the paths, so no exemption was added and `EXPECTED_EXEMPTIONS` is unmoved.

**Step 5 — adversarial self-check.** *Blindspot register:* no app-facing content changed; added lines
grep **0** for `dalio` and for advice phrasing, against a positive control (`window`, 7 hits) proving
the grep is live, and `check-blindspot` exits 0. The dates I added are dated-record fields in a
planning document, not §2.3's live-looking figures in teaching copy. *DECISIONS.md conflict:* `process
mass`, `churn` and `10.8` all return **0** there (liveness control: `localStorage` returns 11); no
recorded decision governs the register's schedule. *Already-done item:* no run has ever measured 10.8
— the only two hits in the live log are the App summary naming it open and one cross-reference.
*My own verification claim:* every number in the register entry comes from a command whose exact form
is written beside it, and the calibration control means a reviewer can tell a working instrument from
a broken one without trusting me.

**Top item for the next run: nothing is queued from here.** 10.8's reading is evidence for the
**weekly reviewer and the owner**, not a task a run can take — the response to it is a process
decision, and a run picking "reduce process mass" as a work item would be the loop closing on itself.
**O-1 remains the entire critical path — 44 lessons, 5 languages, 162 minutes of content, and zero
people have ever opened this app; 10.10 is now recorded as unclosable by any run, which is the same
sentence with the mechanism attached.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` and the 0-byte `course` file only, **untouched**. `HEAD` re-checked before writing and
unmoved at `ed8531a`; the daily market-data job did not fire during the run and
`public/data/market.json` is untouched at `asOf=2026-09-04`.

### 2026-09-05 (scheduled dev-agent, self-picked: a class never swept in this repo) — a sentence in the middle of lesson 5 starts with a lowercase "the", because the reference conversion that replaced "Lesson 38's" with "the" on 2026-08-20 did not put the capital back, and the four translations have read it correctly the whole time

**Pick, and why it is not a note-chain.** The previous entry closed with *"Nothing is queued; this run
files no numbered residual… Go back to learner-visible work"*, so W-6.2 rule 1 has nothing to bind
against. I did not open the previous run's lesson. The pick came out of a sweep I chose, below.

**Step 3.5 — what I set out to measure, and the disposition it forced.** My starting item was
**glossary-vs-lesson definitional agreement**: the last four real defects this project shipped fixes for
(2s10s backwards, QT-as-tapering, the Fed's target hung on CPI, the 1930s austerity case) are all *one
surface disagreeing with another about what a term means*, and no sweep of that class exists. Built it,
carried a two-sided control (`Deflation` must return >0 definitional sentences, `Blorptronics` exactly 0;
both fired), ran it over **1,319 English sentences in 44 lessons** against all **43** glossary terms, then
over `economicSignals.js` and the **68** parallel English strings in `markets.js`.
- **The class came back clean, and that is the honest result.** Every definitional use I read agrees with
  the glossary. **Two apparent finds died on inspection and are recorded so nobody re-derives them:**
  (i) lesson 36 uses *term premium* five times while the glossary's `Premium` is the insurance sense —
  already handled, `lessonTerms.js`'s `deliberatelyUnlinked` carries
  `Premium: "other-sense: the term premium on long bonds, not an insurance premium"`; (ii) lesson 11's
  `thinkAbout` attributes an *index fund* claim to lesson 5, which contains the string `index` **zero**
  times in all five languages — but lesson 11's own §0 supplies the bridge (*"A fund that simply tracks a
  market index (the diversification idea from “Stocks, Bonds & Diversification”, done automatically)"*)
  and lesson 5 does say *"a fund that holds hundreds or thousands of companies… without picking individual
  stocks themselves"*. **The attribution is supported; it is not a defect.** I also ran the attributed
  cross-reference class while the corpus was loaded — **24 sentences that claim another lesson *showed*
  something**, controls at both ends (a known title resolves, a fabricated one does not, self-references
  = 0) — and read every one against its target. No defect.
- **So I redirected to a mechanical class instead: typographic integrity of the shipped prose**, which
  nothing in `npm test` looks at. Five probes over **2,380 non-empty fields** (44 lessons × 5 languages,
  plus all 43 glossary `f`/`ex` pairs): doubled words, double spaces, a missing space after a period,
  a space before punctuation, and curly-quote balance. **Four of the five: zero hits.**

**⛔ The probe that did fire was my own regex, again, and the control I had was the wrong control.**
`\b(\w+)\s+\1\b` reported **8 doubled words, all Spanish, all fake**: JavaScript's `\w` is ASCII-only, so
in *"una economía a lo largo"* the `í` is a non-word character and `\b` matches before the final **a** —
the scanner read `a a`. Every one of the eight was a word ending in an accented vowel or `ñ` followed by
` a `. **My control passed and was worthless: I planted an English doubled word to check an instrument I
then pointed at Spanish.** Rebuilt with Unicode property escapes and a control that plants in the
language being scanned *and* asserts the artifact is gone — `economía economía aquí` → 1, `la la casa` → 1,
`we we go` → 1, **`por toda una economía a lo largo` → 0**, `una prima pequeña a un fondo` → 0. Re-run:
**8 → 0.** This is the second consecutive run whose first instrument manufactured a tidy story; the
transferable part is narrower than "use a control" — **a control has to be planted in the same alphabet
as the corpus.**

**⭐ The one real defect, out of 23 sentence-start candidates across `en`+`es`.** Twenty-two are
abbreviation artifacts (`EE.UU.`, `U.S.`, `vs.`, and `?”` closing a quoted question mid-sentence) — read
and dismissed individually, not batch-suppressed. The twenty-third is live in the shipped English build:

> …something that affects nearly the whole market at once. **the** four cycle phases in “The 4 Phases of
> Economic Cycles” showed that a broad economic contraction tends to pull most companies' stock prices
> down together…

It opens the paragraph that carries lesson 5's whole point — that diversification has a limit.

**Provenance, traced rather than guessed, with both controls firing** (`the four cycle phases in` → 2 hits
at HEAD; `ZZZNOTHERE` → 0). The phrase does not exist before `7046854` (2026-08-20, *"Name the lesson,
don't number it: 237 cross-references converted to titles"*), whose parent reads **"…at once. Lesson 38's
four cycle phases showed that…"**. The conversion replaced the sentence's first word and left the
replacement lowercase. The archive shows the same sentence was authored as *"lesson 10's four cycle
phases"* and survived the 2026-08-14 renumbering — **three renamings, and the capital was lost on the
third. 16 days on the shipped English main build.** ⚠️ Worth one line for whoever audits the ledger:
lesson 5's four translations were re-marked reviewed **on 2026-08-20, the same day this landed**, and the
review did not catch it.

**The finding that settles the fix: English is the only outlier.** es *"Las cuatro fases de la lección
«Las 4 Fases del Ciclo Económico»… mostraron que…"*, and ko/zh/ja each open the sentence with the lesson
title as a proper subject. The correction is English rejoining the other four, not an editorial
preference. **Fix: one character**, `at once. the four cycle phases in` → `at once. The four cycle phases
in`, applied through a guarded script that refuses unless it finds **exactly one** occurrence, the target
is absent afterward, the replacement is unique, **and the file length is unchanged** — which is what makes
"no generated figure moved" a property of the edit rather than a hope.

**The one consequence, and I did the work it asked for rather than papering over it.** Editing lesson 5's
English invalidated its four translation hashes → coverage `100% → 98% (1 stale each)` and §11 failed on
`LAUNCH_READINESS.md`. I read **all three sections, the takeaway and the reflection prompt of lesson 5 in
es/ko/zh/ja against the corrected English** before re-marking: every claim corresponds, and the sentence in
question already reads correctly in all four. The abridgment (all four drop s0's coffee-shop opening and
s2's closing clause) is the **known item-93/94 debt — lesson 5 is on `translation-completeness`'s abridged
list of 12** — not a new gap. Marked `ai` under the same reviewer identity recent dev-agent runs use.
Coverage back to `100%, 0 stale`.

**Verification — exit codes read directly, never through a pipe.** `npm test` **exit 0, 0 failures,
4 warnings**, `diff`ed against a baseline captured *before* I edited anything. ⚠️ **Three of the four are
byte-identical; the fourth is not, and saying so is the point** — the W-6.4 floor warning moved
**410,113 → 412,623 b**, which is this entry’s own backlog note being added to the section the floor
measures. It is the expected cost of writing item 167’s fifth note, not a regression, and the version of
this sentence I drafted before writing the log claimed all four were identical. `npm run build` **exit 0, 997 ms**. `npm run check-blindspot` **exit 0**.
Generated figures unmoved: **44 lessons / 151,788 en chars / 162 min**, the same line as the baseline, as
a length-preserving edit requires. **And the proof it reaches a learner rather than the source tree:**
`The four cycle phases in` is in the shipped chunk `dist/assets/lessonContent.essentials.en-kBRF6sjp.js`,
and `once. the four cycle phases` returns **0 occurrences across every asset in `dist/`**.

**Step 5 — adversarial self-check.** *Blindspot register:* a capital letter adds no advice verb, no date,
no market figure, no Dalio, no child-facing framing — and `check-blindspot` exit 0 over all five languages
is the evidence, not my reading of my own edit. *DECISIONS.md conflict:* grepped `capitali`, `sentence
case`, `four cycle phases`, `lesson 5` — one hit, an unrelated 2026-08-13 note about a *"rates already at
0%"* overclaim; no closed decision touches this, and a prose edit inside a `.js` content module is the
shape those decisions mandate. *Already-done backlog item:* grepped the live log and the archive — item
33's *"the lowercase English ones"* is about the `lesson N` **reference form**, a different thing, and the
archive's only `four cycle phases` hit is the 2026-08 authoring of this very section. Not a redo.
*My own verification claim:* every figure above was printed by a command re-run this session, the warning
comparison is a `diff` rather than a memory, and the `dist/` greps let a reviewer confirm the
learner-facing result from the built output alone.

**W-6.2 rule 3 / W-6.3, answered explicitly: no check is due and none was built.** The learner-visible
sentence is writable — *"a sentence in the middle of a lesson starts with a lowercase letter"* — so the
rule does not refuse it on that ground. It is refused on the instrument: **22 of 23 candidates are false
positives (96%)**, so a permanent guard means shipping an abbreviation allowlist and a quote-boundary rule
into a `scripts/` tree measured this run at **18,147 lines against `src/`-minus-content-and-locales'
8,437 — 2.15x**. One defect in 44 lessons does not buy that. `git diff --stat -- scripts/` is **one file,
`translation-review-ledger.json` — a data record, zero lines of instrument code**; all four sweep scripts
stay in the session scratchpad.

**O-3 accounting: 0 characters of new translated prose.** English-only, and the character count did not
move at all. The four translations were re-read and re-marked, not rewritten.

**One measurement taken in passing, recorded here rather than in the backlog** (W-6.4 — the floor is the
over-budget one, and item 27 already tells pickers to re-parse rather than trust its numbers): lesson-visual
coverage re-parsed with **item 27's own control** (must find 36 ✓, must not find 9999 ✓, 44 lessons ✓) is
**economy 7/12, essentials 4/15, money 6/17 — 17 of 44, 0 orphans**, against the `15 of 44` that item last
recorded on 2026-09-03. Two figures shipped since (lesson 12 `mortgageSplit`, lesson 27 `lossAsymmetry`).

**Top item for the next run.** **Nothing is queued; this run files no numbered residual** (W-6.2 rule 2).
**Three classes are newly swept and closed** — recorded under item 167 so nobody re-runs them:
glossary↔lesson definitional agreement (**zero** real instances), attributed cross-references (**zero** in
24), and typographic integrity (**one** instance in 2,380 fields, fixed here). The run log has ample
headroom — **archiving is not due, do not pick it.** **O-1 remains the entire critical path — 44 lessons,
5 languages, 162 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked `UIUX/`
and the 0-byte `course` file only, **untouched** — neither deleted nor committed, per the hard rules.
`HEAD` re-checked before writing and unmoved at `84a4b3b`; the daily market-data job did not fire during
the run and `public/data/market.json` is untouched at `asOf=2026-09-04`.

### 2026-09-05 (scheduled dev-agent, self-picked off a corpus-wide sweep whose original premise was refuted) — the compounding lesson told the reader that Priya withdraws $60 a year from her original $1,000; Priya is the saver two paragraphs above who puts in $200 a month and finishes near $400,000, and all four translations already said "you"

**Pick, and it is not a note-chain.** The previous entry (the sixth archiving pass) closed with *"Nothing
is queued and this run files no numbered residual… Go back to learner-visible work"* — so W-6.2 rule 1
has nothing to bind against here, and I did not take a handoff. The pick came out of a sweep I chose,
described below. ⚠️ **Honest disclosure about adjacency:** the defect I shipped a fix for is in
**lesson 3**, which the 2026-09-05 compound-interest run (`aaee2c0`) also edited. It is a *different
sentence in a different section*, and I reached it by auditing that lesson's arithmetic as one of ten
lessons in a mechanical sweep — not by following that run's residual, which explicitly filed none. But
the adjacency is real and the next run should know it, because "I found more in the lesson the last run
touched" is the shape W-6.2 exists to catch even when the path there was independent.

**Step 3.5 — THE PREMISE I PICKED WAS WRONG, and the instrument that "proved" it was broken.**
My starting item was: *the four translations carry numeric drift from their English source, and nothing
checks it corpus-wide.* The second half held (§21/§50/§53 anchor five-language figures, but each is
scoped to one named lesson's figure — 7, 17, the rewards pair — so there is no corpus-wide comparison).
**The first half did not survive its own instrument.**
- **First scan: 36 of 176 (lesson, language) pairs flagged**, including what looked like a serious find —
  ko/zh/ja lesson 36 carrying `2022` twice and a `2024` the English "did not have", three days after a
  run corrected that exact lesson's inversion window in English only.
- **It was my regex.** Its lookahead `(?![\d,.%])` rejected any year followed by a comma, and English
  lesson 36 plainly reads *"…turning positive again in 2024, well past the 'typical' lead time."* The
  scan reported the English as containing **no 2024 at all**. A stale-translation story was sitting
  there fully formed, and it was an artifact.
- **Caught by a control I should have had before the first result, not after:** the corrected scan
  carries a planted probe asserting **both directions** — `2024,` `1929.` and `2050` must be read;
  `1,929,000`, `20.24`, `1799`, `2100` and `12345` must not; three known percents must parse. It exits
  non-zero if the probe disagrees, so a silently-empty scan cannot look clean.
- **Re-run with the control passing: 36 flags → 4.** And **all four of those are false positives too**,
  each confirmed by reading the sentence: `L12 zh` writes `$1,800`/`$1,900` as `1800美元`/`1900美元`
  (no comma → my year pattern ate them); `L11 ko` renders English's spelled-out *"exactly one
  percentage point"* as `1%포인트`; `L32 ko` renders *"rates approach zero"* as `0%`; `L37 ko` the same.
- **Disposition change, per step 3.5: the item is refuted, not deferred.** There is **no detectable
  numeric drift between English and the four translations** in the classes that survive translation as
  literal digits. **No check was built** — W-6.2 rule 3 refuses it, and after the sweep came back empty
  the sentence naming a learner-visible failure it would have caught cannot be written honestly.

**What the sweep found instead, after I redirected it.** With the corpus already loaded I ran the
mechanical part over English only: every lesson stating both a rate and a dollar amount (**10 lessons**),
then checked each one's arithmetic by hand.
⚠️ **Disclosure, found by step 5 and not by me while I was doing it: this partly RE-RAN a class item 167
marks "swept — do not re-run it"** (its second note: 120 sentences across 35 lessons, one defect). My
hand-audit of 10 lessons duplicated a subset of that and **found nothing new, which confirms it** —
worth exactly one sentence, not a run. **The defect I actually shipped did not come from that
instrument and could not have:** recomputing arithmetic cannot see a sentence whose numbers are all
correct and whose *owner* is the wrong person. It came from reading the lesson.
- **L4** — $20,000 car loan, 5 years, 6% vs 14%, *"well over $2,000 in extra interest"*. Amortized:
  $3,199 vs $7,922 interest, a **$4,722** gap. True, and conservatively stated. ✓
- **L18** — $2,000 at 6% for ten years → *"roughly $3,580"*. Actual **$3,581.70**. ✓
- **L3 §1/§2** — Rule of 72 at 6%/9% → 12/8 years ✓; $1,000 → $2,000/$4,000/$8,000 at 12/24/36 ✓;
  and the previous run's corrected §2 checks out: **Priya $398,300 vs Tom $401,806** at 6% (0.88% apart,
  *"within about 1%"*, *"near $400,000 apiece"*), contributions **$96,000 / $144,000** exact, and its
  claim that the ranking flips with the rate is right — **Priya ahead at 7% ($525k vs $488k), Tom ahead
  at 5% ($305k vs $333k)**.
- **⭐ L3 §3 — the defect.** *"If **Priya's** account pays 6% and she withdraws that 6% in cash every
  year to spend, she's back to simple interest: the same **$60** a year, forever, on her original
  **$1,000**."* **Priya has no $1,000 and no $60.** She is §2's saver: $200 a month from 25 to 65,
  finishing near $400,000. The $1,000/$60 belong to **§1's unnamed example**, and the phrase *"the same
  $60"* points at §1 — which is precisely why the name cannot be hers. Under either reading the sentence
  is broken: it either misnames §1's saver or invents a Priya balance that contradicts §2 while calling
  it "the same".

**The finding that settles what the fix should be, and it is the strongest evidence in this entry:
all four translations already say "you".** es *"Si retiras el interés…"*, ko *"매년 이자를 현금으로
인출하면…"*, zh *"如果你每年把利息以现金形式取出…"*, ja *"毎年利息を現金で引き出すと…"* — every one is
impersonal and tied to §1's $1,000/$60. **English was the only outlier**, so the correction is not my
editorial preference; it is English rejoining the other four.
**Provenance, measured with a two-sided control rather than assumed:** the phrase has been in the file
since `5633b79` (2026-08-19) split the essentials track out — present in **all 5** commits that ever
touched it. Control: `Rule of 72` → 2 hits at HEAD (expect >0), `ZZZNOTHERE` → 0 (expect 0), both fire.
**17 days on the shipped English main build.**

**The fix — one sentence, and the numbers are untouched.**
> Go back to that first $1,000 earning 6%: if you withdraw the $60 in cash every year to spend, you're
> back to simple interest — the same $60 a year, forever, on the original $1,000.

It drops the wrong name, anchors the reader explicitly to §1 (so `$1,000`/`$60` have a referent on the
page), and matches the voice the other four languages already use. Applied through a guarded script that
refuses unless it finds **exactly one** occurrence and verifies `Priya's account` is absent afterward.

**The two consequences I had to resolve, both of which the suite caught and neither of which I guessed at.**
1. **The ledger went stale, correctly.** Editing lesson 3's English invalidated its four translation
   hashes → coverage `100% → 98% (1 stale each)` and `check-data.mjs` §11 failed on
   `LAUNCH_READINESS.md`'s recorded figure. **I did not paper over this by editing the doc to say 98%.**
   I did the re-review the ledger is asking for: I read §2 and §3 of all four translations against the
   corrected English and confirmed they correspond — §3 matches it *better* than the old text, and §2
   carries the corrected `$400,000 / $96,000 / $144,000 / 6%` claim in all four. Then marked them
   `ai`, under the same reviewer identity the previous run used hours earlier for this same lesson.
   Coverage back to `100%, 0 stale`. **The abridgment (all four drop §2's closing clause) is the known
   item-93 debt, not a new gap.**
2. **Two generated figures moved** — English chars `151,774 → 151,788`. Refreshed with
   `npm run readiness -- --write`; the diff is those two numbers and nothing else.

**Verification — exit codes read directly, never through a pipe.** `npm test` **exit 0, 0 failures,
4 warnings**, and the four are **byte-for-byte the baseline's four** (translation review, completeness
48 pairs, item 160's 56.5% length cue, the W-6.4 floor) — captured *before* I edited anything, which is
what makes "no new warning" a measurement rather than a memory. `npm run build` **exit 0, 911 ms**.
`npm run check-blindspot` **exit 0**. **And the proof it reaches a learner, not just the source tree:**
the corrected sentence is in the shipped chunk `dist/assets/lessonContent.essentials.en-sDsS5Uti.js`,
and `Priya's account` returns **0 occurrences across every asset in `dist/`**.

**Step 5 — adversarial self-check.** *Blindspot register:* the new sentence adds no advice verb, no
date, no market figure, no Dalio, no child-facing framing — and `check-blindspot` re-run clean over all
five languages is the evidence, not my reading of my own sentence. *DECISIONS.md conflict:* grepped for
`Priya`, `lesson 3`, `Compound Interest` — **zero hits**; no closed decision touches this, and a prose
edit inside a `.js` content module is the shape those decisions mandate. *Already-done backlog item:*
grepped `Priya's account` / `simple interest` across the whole log — **zero hits**, so this is not a
redo; the adjacent `aaee2c0` fixed §2's arithmetic, a different sentence. *Persona convention:* checked
that no `check-data.mjs` section asserts on character names before removing one — none does.
*My own verification claim:* every figure above was printed by a command re-run this session, the
arithmetic is recomputed rather than quoted, and the `dist/` greps let a reviewer confirm the
learner-facing result from the built output alone.
**W-6.3:** `git diff --stat -- scripts/` is **one file, `translation-review-ledger.json` — a data
record, zero lines of instrument code.** The sweep script that produced this finding lives in the
session scratchpad and is deliberately **not** committed: it found no defect in its own class, and
committing an instrument that proved nothing is exactly what W-6.0 measured 2.3x too much of.

**O-3 accounting: 0 characters of new translated prose.** English-only edit; the four translations were
re-read and re-marked, not rewritten.

**Top item for the next run.** **Nothing is queued; this run files no numbered residual** (W-6.2 rule 2).
**One** class is newly swept and closed — recorded under item 167 so nobody re-runs it:
**English↔translation numeric drift, zero real instances in 176 pairs, and the first instrument lied.**
(The arithmetic class was **already** closed by item 167's second note; my re-audit of 10 lessons only
confirmed it and should not have been spent — see the disclosure above.) The run log has ample headroom after yesterday's archive — **archiving is
not due, do not pick it.** **O-1 remains the entire critical path — 44 lessons, 5 languages, 162 minutes
of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked `UIUX/`
and the 0-byte `course` file only, **untouched** — neither deleted nor committed, per the hard rules.
`HEAD` re-checked before writing and unmoved at `679b701`; the daily market-data job did not fire during
the run and `public/data/market.json` is untouched at `asOf=2026-09-04`.

### 2026-09-05 (scheduled dev-agent, W-5.3 archiving pass — the sixth) — the pass itself was routine; what was not is that the clause telling me how to order the archive also told me a control enforced it, and no such control exists, so the day went in backwards and the full suite passed on it

**Pick, and why it is not a note-chain.** The previous entry closed by measuring the archiving pass as
due *after* writing itself: `check-log-size.mjs` read **243,766 b / 97.5% of warn / 0.62 runs**. W-6.2
rule 1 is about picking up a **residual** — that run filed none, and W-5.3 archiving is a standing rule
with a measured trigger, which the clause itself calls a legitimate whole run. Re-measured at run start
rather than taken on report: **244,006 b, 97.6%, 0.59 runs of headroom.** Premise holds. Writing this
entry alone would have crossed the budget.

**Step 3.5 — the mover was proven on a planted copy before it touched the real file.**
- **Instrument fires in both directions before any result was read:** 16 `MOVE` plants (one per 09-04
  entry) and 6 `KEEP` plants (one per 09-05 entry) planted into a scratchpad copy; pre-move grep gives
  live 16/6, archive 0/0, and a **dead plant never inserted returns 0** — so "not found" is a real
  absence and not a broken pattern.
- **Post-move on the planted copy:** live MOVE **0**, archive MOVE **16**, live KEEP **6**, archive KEEP
  **0**, and each of the 16 lands **exactly once** (no duplication, no loss).
- **Both refusal guards fired for the right reason**, checked by reading the message rather than the
  exit code: moving the *newest* day → *"is not the OLDEST/tail block — refusing (would strand older
  days)"*; an absent day → *"not present"*. Both left the files byte-identical.
- **Then on the real files, against the repo rather than my own buffer:** 16/16 09-04 headings in
  `git show HEAD:AGENT_LOG.md` are in the archive, **0 leaked, 0 lost**, 6 retained live, the moved
  block **byte-identical** to HEAD, and the **floor byte-identical** — preamble + App summary + backlog
  + Environment note compared as a unit, so nothing archivable was taken from a never-archived section.

**⭐ What the adversarial check actually caught, and it had already shipped into the file.** W-5.3's
2026-09-03 note states the convention — *within a day the archive reads **oldest-first**, reversing the
live log's newest-first* — and adds that it is *"now covered by an asserted order control."* **That
second half is false.** `grep -rn "oldest-first\|chronolog\|order control" scripts/*.mjs` returns three
hits, all of them `check-log-size.mjs`'s **cut plan** (which days to move, oldest first); **nothing
asserts the archive's internal order.** My mover appends the day as a verbatim slab, which preserves the
*live* newest-first order — so `## Archived 2026-09-04` went in **inverted**, and `npm run test` passed
**0 failures** on it. It was caught by diffing my section's first heading against the
`## Archived 2026-09-03` section's, not by any instrument. Reversed in place: the section now opens on
the oldest 09-04 entry (the launch-scorecard sweep) and closes on the newest (item 166), matching 09-03.
**Re-verified after the reorder: 16/16 still byte-identical, 0 leaked.**
- **The whole-corpus control, because a reorder is exactly where content goes missing quietly:** the
  **non-blank line multiset across BOTH log files** is byte-identical before and after
  (`md5 292823f07db8902c46ce036f9d6a1f6a` both sides) once the two intended lines are excluded — the
  archive title's range and the new `## Archived 2026-09-04` heading. Only **2 blank lines** were
  normalized away at entry boundaries. Nothing was lost, altered or duplicated.
- **No check was built.** W-6.2 rule 3 refuses it and the sentence cannot be written: **no learner can
  see an out-of-order archive.** The remedy filed instead is one line in W-5.3 telling the next pass
  that appending a day verbatim ships it backwards, plus the correction of the false claim — because a
  note that says a control exists is worse than no note, and this run is the proof.

**The archive is history, so the second thing worth proving is that moving text out of the live file
does not shrink any checker's corpus.** Read, not assumed: `check-measurements.mjs:67` sets
`LOGS = [AGENT_LOG.md, AGENT_LOG.archive.md]` — it reads **both**, which is what makes MEASURED claims
survive archiving. `check-backlog.mjs` reads only `AGENT_LOG.md`'s backlog section, proven byte-identical
above. `check-blindspot.mjs` never reads either log — its corpus is `src/`, `economic-cycles-v5.jsx`,
`README.md` and `index.html`. Combined with the unchanged union-of-lines, **no check lost visibility.**

**Verification.** `npm test` **0 failures, 4 warnings**, and the four are the previous entry's opening
baseline unchanged (translation review 0% human, 48 abridged pairs, item 160's 56.5% length cue, the
W-6.4 floor). **The fifth warning is gone, and removing it was the point:** before the pass the suite
also raised *"the run log is under its budget by less than ONE run's worth of writing."* `npm run build`
clean, **912 ms**, bundle `index-D6mmTRPP.js` — **byte-identical to the previous run's**, which is the
right result for a documentation-only commit. `npm run check-blindspot` **0 failures**.
**The numbers, off `check-log-size.mjs` re-run after the move:** run log **244,006 → 71,770 b**
(97.6% → **28.7%** of warn), headroom **0.59 → 17.4 runs**, file **650,705 → 478,469 b**, 1 live day.
⚠️ **Exit codes were read directly, not through a pipe** — `npm test; echo $?` — after an earlier
`| tail` in this session printed an empty `EXIT=`, which is the failure mode where a pipeline's status
is the filter's and a red suite reads green.

**Step 5 — adversarial self-check.** *Blindspot register:* nothing in `src/` is touched — the diff is
two Markdown files — so §10.1/§10.2/§10.3 and the §2.3 stale-data rule have a byte-identical corpus, and
the identical bundle hash is the evidence rather than a grep over unchanged text. *DECISIONS.md
conflict:* grepped — it carries no archiving clause; W-5.3 lives in `AGENT_LOG.md`, and I acted on the
measured budget exactly as the five previous passes did while **rewording no clause**, which W-5.3
reserves to the owner. *Already-done backlog item:* no — this is the recurring standing action, not a
redo; and it is deliberately **not** a backlog-compression pass, which is the other half of item 115 and
the only thing that can move the floor. *My own verification claim:* every figure above was printed by a
script re-run this session, and the containment proof reads `git show HEAD:AGENT_LOG.md` rather than my
scratchpad copy, so a reviewer who was not present can reproduce it from the repo alone.
**W-6.3:** `scripts/` is unchanged — `git diff --stat -- scripts/` is **empty**, zero lines of
instrument code — so the 1.82x ratio the previous entry measured is untouched. This pass falls on the
harmless side by construction.

**O-3 accounting: zero.** No prose in any language; no content file touched.

**Top item for the next run.** **Nothing is queued and this run files no numbered residual** (W-6.2
rule 2). The run log has **17.4 runs** of headroom, so archiving is not due again for a long while —
**do not pick it, and do not read this line as a handoff.** The floor is the standing exception at
**406,699 b against 250,000**, and only a backlog-compression pass moves it; that is item 115's half and
the owner's. Go back to learner-visible work. **O-1 remains the entire critical path — 44 lessons, 5
languages, 162 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked `UIUX/`
and the 0-byte `course` file only, **untouched** — neither deleted nor committed, per the hard rules.
`HEAD` re-checked before writing and unmoved at `6bc0424`; the daily market-data job did not fire during
the run and `public/data/market.json` is untouched at `asOf=2026-09-04`.

### 2026-09-05 (scheduled dev-agent, self-picked: a second class never swept in this repo) — the end-of-lesson check on the second lesson of the main path asked "What causes inflation?", and neither that lesson nor its four translations contains the word inflation, or the word production, anywhere

**Where the pick came from.** Item 167 is still exhausted for headline picks by its own ⛔ clause, and
its two live sub-items ((a) lesson 37's `9x`, (c) lesson 32's deflation clause) were left alone —
verified at the end. The other live candidates were re-read first per W-5.2:
- **Item 165's remainder** — still correctly owner-gated and, by its own ⛔, *out of order*: the five
  remaining questions sit on `essentials` lessons whose bodies are abridged in the same four
  languages, so it is downstream of item 94.
- **The floor / archiving** — `check-log-size.mjs` at run start: run log **229,831 b, 91.9% of warn,
  2.0 runs of headroom**, 2 live days, last pass 2026-09-04. Near, not due; the floor warning
  (404,347 b) is W-6.4's and archiving cannot touch it.

So, as on the previous run, a **class** rather than a sentence — and deliberately one axis over from
that run's, because the last six picks all read lesson *prose*. This one reads the seam between two
corpora: **is the answer to each end-of-lesson check actually taught by the lesson it is attached
to?** `AGENT_LOG.md` + archive return **0** for `answer is taught`, `untaught`, `quiz sweep` and
`not taught in the lesson`; the three `answerable` hits are about other things entirely. Never swept.
W-6.2 rule 3, answered before building anything: *"a learner finishes a lesson, is handed its check,
and is asked about a mechanism the lesson never mentioned."*

**⛔ Step 3.5 — two independent instruments, both validated in both directions before any result was
read.** Both live in the scratchpad and neither is committed.
- **Instrument 1 (`answerable.mjs`)** parses all three tracks and scores each question's *correct
  option* against its own lesson body by stemmed content-word coverage.
  *Positive control:* a planted off-topic answer ("Baltic Dry shipping freight index tonnage") on
  lesson 29 scores **0.00**. *Negative control:* `q001`'s correct option, which is verbatim in lesson
  29, scores **1.00**. *Coverage control:* **46/46** questions resolve to a body over 200 chars.
- **Instrument 2 (`bestfit.mjs`)** is the one that decides, and it is independent of the first:
  IDF-weighted, it scores each question against **all 44** lesson bodies and reports where the
  lesson it is actually attached to *ranks*. *Identity control:* every lesson's own takeaway must
  rank that lesson #1 — **44/44**, which is what makes a low rank mean something. *Positive control:*
  the off-topic query ranks L29 **30th of 44**.

**The result is one outlier and it is not close.** 44 of 46 questions rank their own lesson **#1**.
`q045` ranks 2nd inside its own four-lesson arc (L43 0.48 against neighbour L42's 0.51) and is fine —
read in full, it is on-lesson. **`q004` ranks its own lesson 21st of 44, at 0.12.** The corpus's own
best fits for it are **L9 (0.63)** and **L32 (0.46)**.

⭐ **`q004` — "What causes inflation?" → *"Spending growing faster than production"* — was attached to
lesson 30, "Credit: The Most Important Part", which the reader meets as `LESSON 2 OF 12` on the track
a new install opens on.** Measured across all five languages rather than inferred from English:

| | inflation | production |
|---|---|---|
| **L30** en / es / ko / zh / ja | **0 / 0 / 0 / 0 / 0** | **0 / 0 / 0 / 0 / 0** |
| **L32** en / es / ko / zh / ja | 2 / 2 / 2 / 2 / 2 | 2 / 2 / 2 / 2 / 2 |

The L32 row is the control for the L30 row: the same five per-language patterns that return zero on
lesson 30 return two on lesson 32, so "nothing found" is not the instrument failing to look. Lesson
30's three sections are *How Credit Works*, *Credit vs Money* and *The Spending Chain* — credit
creation, settlement, and spending-as-income. It never reaches prices.

**Where the answer actually IS, in almost the question's own words — lesson 32 §1:** *"When spending
and incomes grow faster than the town can really produce, businesses respond by raising prices
instead of magically producing more — that's inflation."* And the corpus itself already says so:
**lesson 9 cites "the definition of inflation in 'The Short-Term Debt Cycle'"** — which is lesson 32.
`q004`'s own `explain` ("When spending and incomes grow faster than the production of goods, prices
rise. That's inflation.") is a paraphrase of that L32 sentence. The question was written for lesson
32 and landed on lesson 30.

**How it got there, because it says the mapping was never per-question.** At `98a79ce` the quiz was a
flat ordered list with **no `lesson` field at all**; the field arrived later, in one pass, when
per-lesson checks were built. In that flat order `q004` sits between `q003` (→ L32) and `q005` (→
L34). Nothing has touched its assignment since: `q004` appears three times in this log and four in the
archive, **every one of them about the length of its `explain` translations** — including a
2026-09-03 parity table that prints `| q004 | 30 |` and quotes *"That's inflation."* in the next
column without anyone noticing the two disagree.

**What shipped: one integer.** `quizMeta.js` — `q004.lesson` **30 → 32**. Plus the one derived figure
that moves with it: lesson 32's `minutes` **3 → 4**, because §2's reading model counts a lesson's own
check text and L32 was already at **679 words / 3.40 min**; with `q004` it is **714 / 3.57**, so 4 is
now the honest round. (L30 goes 620 → 585 words, **3.10 → 2.93**, and stays at 3.) Four minutes is the
catalog's modal value — 20 of 44 lessons, and L33-L36 and L38 beside it on the same track.
- **`q004`'s id does not change, which is the whole point.** `src/lib/review.js` has keyed every
  learner's Leitner state by the opaque question id since 2026-09-01; a persisted `q004` entry
  survives the move untouched, and no migration is needed. This is that change collecting its first
  dividend.
- **⭐ And the reason this fix is worth naming as a shape: it costs ZERO new translation.** `lesson`
  lives once, in `quizMeta.js`, so the correction lands in all five languages at once. Every other
  content fix in the last week added es/ko/zh/ja prose that no fluent reviewer has read (O-3). This
  one adds none — the O-3 accounting for this run is **0 code points in all five languages**.

⛔ **What I considered and did NOT do.** (1) **Move it to L9**, which scores highest (0.63): wrong —
L9 is on the optional `essentials` track, already has `q023`, and *defers the definition to L32 in its
own text*. It scores high because it says "inflation" often, not because it teaches the cause.
(2) **Write a new L30 question** on *The Spending Chain*: that means a new opaque id and five
languages of unreviewed machine translation, for a lesson that keeps `q002` and is not left without a
check. More debt, more risk, less certainty. **L30 retains exactly one question and it is on L30's own
material** — verified live below.

**Verification.** `npm test` **0 failures, 4 warnings** — the four are this run's opening baseline
(translation review share 0% human, 48 abridged pairs, item 160's 56.5% length cue, the W-6.4 floor),
identical in kind to the previous entry's. One transient failure appeared mid-run and was the
*expected* consequence: `§2 lessons[3] (id 32): minutes is 3, but its text computes to 4`, i.e. the
check caught the derived figure before I did, and `npm run readiness -- --write` then moved the four
generated catalog figures 161 → **162 min** across `LAUNCH_READINESS.md` §4.3, `LAUNCH_PLAN.md`
§4.0/§4.3 and `CLAIMS.md` A6. `npm run build` clean, **919 ms**. `npm run check-blindspot` **0
failures**.
**Live, on the built app, not inferred.** Served `dist/` statically at 420x900; bundle read back as
**`index-D6mmTRPP.js`**, this build's output.
- **Lesson 30** renders `LESSON 2 OF 12`, `≈3 min`, and a check containing **one** `h3` — *"What is
  the most important part of the economy?"* The inflation question is gone from it.
- **Lesson 32** renders `LESSON 4 OF 12`, `≈4 min`, and both questions, in order. Confirmed again
  after switching the header picker to **한국어 (Beta)**: `약 4분`, and *"인플레이션의 원인은? …
  지출이 생산보다 빠르게 증가"*.
- **The `BEFORE YOU READ` hook is unaffected** — it takes a lesson's *first* question, which is
  `q002` on L30 and `q003` on L32 both before and after. (The duplicate `h3` in lesson 32's outline is
  that hook, not a regression.)
- **⭐ The migration property proved by driving three real localStorage states, not by reading
  `Practice.jsx`:** (**A**) completed `[29,30]` **with** a seeded `ecycles_review` entry for `q004` →
  *"1 ready to review"*, pool **3**, one question in box 2 — an existing learner keeps their history.
  (**B**) completed `[29,30]`, no history → pool **2**; `q004` no longer reaches a learner who has not
  been taught inflation. (**C**) completed `[29,30,31,32]` → pool **5**; it arrives with lesson 32.
  **Differential control, because B is the only state that discriminates:** the same pool computed
  against `git show HEAD:src/content/quizMeta.js` gives **3 `["q001","q002","q004"]`** for state B
  where the working tree gives **2**, and the live app rendered **2**.

**Step 5 — adversarial self-check.**
*Blindspot register:* §10.1 — **no learner-visible string is added, edited or removed by this commit**,
so §10.1's scanned corpus is byte-identical and a planted-string proof would be a proof about nothing;
the check that applies is that the disclaimer still *renders*, and it does, on both lessons and in
both languages I drove (`Educational content only …` / `교육용 콘텐츠입니다 …`). §10.2 — no person or
firm named. §10.3 — untouched. §2.3 — no date and no live-looking figure; `minutes` is derived by
`check-data.mjs` from the text and asserted every run, which is the opposite of a typed number.
*DECISIONS.md conflict:* ⚠️ **one clause looks like a conflict and is not, so do not re-derive this.**
`DECISIONS.md:701` lists **`quizMeta.lesson`** among the surfaces that make lesson ids "stable
identifiers". That bullet forbids **renumbering lessons** — it is naming what a renumber would break.
No lesson id, `lessonContent` key, `#/lesson/N` link or question id changes here; one question's
*pointer* moves from a lesson that does not teach its answer to the one that does. Grepped for a
standing decision on the quiz→lesson mapping specifically: **none exists.**
*Already-done backlog item:* no — the seven historical `q004` mentions are all about `explain` length,
and no "Completed and pruned" entry covers a question's lesson assignment.
*My own verification claim:* every number above was printed by a script re-run this session with its
control beside it, or read off the built app with the bundle name confirmed; the one comparative claim
(state B was 3, is 2) was computed against `HEAD`'s own file rather than remembered.
**W-6.3, with its basis in the same breath:** `scripts/*.mjs` = **15,325** lines against `src/` minus
`content/` and `locales/` = **8,437**, a ratio of **1.82x** — both figures reproduce the previous
entry's exactly. This run falls on the harmless side and further than that one did: **zero lines of
instrument code, no new check, and `git diff --stat -- scripts/` is empty.** Two sweeps of a
46-question corpus that came back with one defect do not earn a permanent regex.
⚠️ **What the check found against me:** my first reading had instrument 1 alone deciding the pick, and
it ranks `q010` (L34) fourth-worst at 0.50 — a question whose correct option is *deliberately* absent
from its lesson, because it asks which tool is **NOT** one of the four. A coverage score cannot tell a
misplaced question from a NOT-question; that is why instrument 2 exists and why it, not the first
sweep, chose the target. `q010` sits at rank **1** on instrument 2.
⚠️ **And what I stopped myself doing:** `q005` and `q010` both sit on L34, and `checkIntro` — *"A quick
question before you move on."* — is a fixed singular string. It has been rendering above two questions
on L34 all along (**measured live on L34, which this commit does not touch**), and after this move it
does so on L32 instead of L30. The count of affected lessons is **2 before and 2 after**, so this
commit neither causes nor worsens it. Filed as a note below; folding a five-language copy change into
a one-integer commit is the smuggle W-6.2's ⚠️ names.

**O-3 accounting: zero.** No prose was written in any language.

**Top item for the next run.** This run files **no numbered residual** — per W-6.2 rule 2 both findings
are notes under item 167, where the last two class sweeps were also recorded. **The answerability class
is swept and closed at one instance; do not re-run it.** Nothing here is a default pick. **O-1 remains
the entire critical path — 44 lessons, 5 languages, 162 minutes of content, and zero people have ever
opened this app.** ⚠️ **The archiving pass (W-5.3) IS due next run, and that is measured after this entry
was written, not projected from run start.** `check-log-size.mjs` read **229,831 b / 91.9% / 2.0 runs**
before I wrote; with this entry appended it reads **243,766 b / 97.5% / 0.62 runs**, and it now raises
its own second warning: *"the run log is under its budget by less than ONE run's worth of writing …
The level above still reads green and will not once this run commits."*

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` and the empty `course` file only, **untouched**. `HEAD` re-checked before writing and unmoved
at `aaee2c0`; the daily market-data job did not fire during the run and `public/data/market.json` is
untouched at `asOf=2026-09-04`. The 0-byte untracked `course` file remains present and unexplained —
neither deleted nor committed, per the hard rules.

### 2026-09-05 (scheduled dev-agent, self-picked: a class never swept in this repo) — the lesson that teaches compound interest asked the reader to trust that ten early years beat a doubled contribution, and at the 6% the same lesson had established two paragraphs above, they do not

**Where the pick came from, and why it is not a §3.0 content read like the last five.** Item 167 is
**exhausted for headline picks by its own ⛔ clause** — its (a) and (b) were links one and two of a
W-6.2 rule 1 chain — so neither the lesson-37 `9x` nor the lesson-32 deflation remainder could be
this run's pick, and I confirmed at the end that I left both alone. The two live pick-list candidates
were re-read first per W-5.2's standing warning:
- **Item 160** — still correctly parked; its own ⛔ clause makes the remainder class-B distractor
  prose in four unreviewed languages, i.e. O-3's decision. Its `quizMeta.js` header ask stays queued
  for the next run that touches that file; this run does not.
- **The floor / archiving** — `check-log-size.mjs` this session: run log **217,087 b, 86.8% of warn,
  3.3 runs of headroom**, 2 live days, last pass 2026-09-04. Near, not due.

So I went looking for a **class**, not another sentence: **checkable arithmetic** — every place the
app states a number a reader could verify with a calculator. `AGENT_LOG.md` + archive return **0**
for `arithmetic sweep`, `does the math` and `does not divide`, so this class has never been swept.
W-6.2 rule 3, answered before building anything: *"a reader does the arithmetic the sentence invites
and gets the opposite answer."*

**⛔ Step 3.5 — instrument first, and validated in both directions before I read a single result.**
`scratchpad/arith.mjs` parses all three tracks' English modules (not greps them) and selects any
sentence carrying a multiplier word/notation or two or more magnitudes.
- **Positive control:** item 167(a)'s known-defective sentence (lesson 37's *"nine times the size"*)
  must appear. It did — **CAUGHT**. A sweep that misses the one defect already on file proves nothing.
- **Negative control:** no sentence without a number may be selected. **CLEAN, 0 leaked.**
- Yield: **120 candidate sentences across 35 lessons**, all read.

**What the sweep actually found, and most of it is the app being right.** I recomputed every
candidate. The corpus is in **very good shape** and that is a real result, not a filler sentence —
lesson 1's `12+15+9+18 = 54`, `54×12 = 648` and the 50/30/20 split of $3,000; lesson 3's
`$1,060 × 6% = $63.60` and the Rule-of-72 doubling ladder (`1.06^12 = 2.01`, `^24 = 4.05`,
`^36 = 8.15`); lesson 11's fee example (`1.0695^30` → **$75,058** vs `1.0595^30` → **$56,637**, and
"roughly a quarter of the total balance" = **24.5%**); lesson 17's `400+300+100+250 = 1,050` and the
`$400` that survives a `$1,450` raise; lesson 18's `$2,000 × 1.06^10` = **$3,581.70** against a stated
"roughly $3,580"; lesson 4's rate-gap interest (actually **$4,723**, so "well over $2,000" understates
rather than overstates); lesson 37's QE1/QE2/QE3 and the `$95B/month` QT pace. **Every one checks out.**
The lesson-3 figure checks out too: `compoundSeries` is `1000×1.06^t` and `1000+60t` sampled every
5 years, and all fourteen values reproduce.

⭐ **One sentence does not, and it is the load-bearing claim of its section.** Lesson 3 §2, "Time
Beats Timing":

> *"Say Priya starts saving $200 a month at age 25, while her friend Tom waits until 35 and saves
> $400 a month — twice as much, every month, for the rest of their working lives. Even though Tom is
> putting in more money each month, **Priya's extra decade of compounding often lets her end up ahead
> by retirement**…"*

**At the 6% this same lesson establishes in §1 and re-uses in §3 with the same named character, Tom
ends up ahead, not Priya.** Monthly annuity to age 65:

| annual return | Priya ($200/mo, 40 y) | Tom ($400/mo, 30 y) | who wins |
|---|---|---|---|
| 5% | $305,204 | $332,903 | **Tom** by $27,699 |
| **6%** | **$398,298** | **$401,806** | **Tom** by $3,508 |
| 7% | $524,963 | $487,988 | Priya by $36,974 |

**Break-even is 6.109%** — the claim is not merely imprecise, it is *false on the wrong side of a
threshold the lesson itself picked.* Doubling the monthly contribution almost exactly cancels a
ten-year head start, which is why this particular pairing is unstable.
- **Instrument controls for the arithmetic itself:** the closed-form annuity and a month-by-month
  brute-force loop **AGREE to the cent** ($398,298.15 both ways), and a ~0% rate returns exactly
  `$100 × 120 = $12,000`. I did not trust my own algebra.
- **Reach measured, not assumed: all five languages carry the same claim**, and the four
  translations are abridged summaries (part of the 48 known abridged pairs) that kept precisely the
  unstable pairing — *"ahorra el doble pero empieza una década después"*, *"10년 늦게 두 배를"*,
  *"十年后才开始存两倍金额"*, *"10年後に2倍の額を"*.
- **Nothing downstream stakes on it.** Lesson 3's only end-of-lesson check tests the Rule of 72
  (`72 ÷ 9 ≈ 8`) and is untouched; the lesson's figure draws §1's `$1,000` example, not §2's
  comparison; `git log -S"Priya's extra decade of compounding" -- src/` returns **five commits, all
  of them the original authoring (`2afcb42`) plus four file splits** — **no run has ever content-edited
  this paragraph** (**control:** the same command on `"this time is different"` returns yesterday's
  real content edit `21b2431` alongside its splits).

**What shipped — one paragraph, five languages, and the corrected version is a better lesson than the
false one.** English now reads: *"…and both stop at 65. At the 6% from the example above they finish
within about 1% of each other, near $400,000 apiece. Priya put in $96,000 of her own money along the
way; Tom put in $144,000. Doubling the monthly amount is what it took to buy back a ten-year head
start, and it only just did it — push the return a little higher and Priya ends up ahead, a little
lower and Tom does."*
- The section's thesis **survives and gets stronger**: the honest finding is that a decade was worth
  as much as **$48,000 more out of pocket**, which is what "time matters enormously" actually buys.
  The false version asked the reader to take a win on trust; this one hands them the arithmetic.
- **The four translations stay abridged** rather than being expanded to full translations — changing
  their abridgement status is item 93/94 and O-3 territory, not a correctness fix's business.
- ⚠️ **The Spanish abridgement drops the two names**, so my first draft left `ella`/`él` with no
  antecedent; corrected to *"quien empezó antes / quien empezó después"* before verifying.

⛔ **THE TRAP, and this is the part most worth not re-deriving — the obvious "fix" is also false.**
The folk version of this example has the early saver *stop* contributing (invest 10 years, then never
again, vs. a later saver who pays in for 30). A future run reaching for that framing would reintroduce
exactly the same defect: measured here, at 6% the early saver ends at **$197,395** against
**$200,903** — she still loses, and needs about **6.7%** to win. **Neither version of this classic is
true at 6%. Do not "restore" the striking version.**

**Verification.** `npm test` **0 failures, 3 warnings** — the three are the run's opening baseline
(translation review share, 48 abridged pairs, item 160's 56.5% length cue) plus the standing floor
warning, all identical in kind. Two transient failures appeared mid-run and were the *expected*
consequence of an English content edit: the ledger correctly marked lesson 3's four translations
**stale** (re-marked `ai`, never `human`) and `refresh-readiness.mjs --write` regenerated the catalog
figures (151,621 → 151,774 en chars). `npm run build` clean, **969 ms**. `npm run check-blindspot`
**0 failures**.
**Live, on the built app, not inferred.** Served `dist/` statically at 420x900 and read the rendered
`<main>`; bundle read back as **`index-k-r-0tDe.js`**, which is this build's output. Lesson 3 renders
the new paragraph in **en** and, after switching the header picker, in **中文 (Beta)**. The reader
still shows **≈3 min** and `npm test`'s reading model is unmoved at **161 min**.
⚠️ **Instrument note:** the previous entry's two seeding traps both reproduced and its remedy works —
seed `ecycles_completed_lessons` as **numbers** and set `ecycles_legacy_lesson_id_migrated`, or
`#/lesson/3` bounces to `#/learn`. Essentials gates within its own track, so `[1,2]` is the seed for
lesson 3.

**Step 5 — adversarial self-check.**
*Blindspot register:* §10.2 — no person or firm named; Priya and Tom are the lesson's existing
fictional characters. §10.3 — untouched. §2.3 — no date and no live-looking market figure; the 6% is
this lesson's own teaching rate, already defended in `moneyVisuals.js`'s header, and the dollar
outcomes are arithmetic at that stated rate, the same class as lesson 18's shipped `$3,580`.
§10.1 — **proved, not asserted**: planted `"You should buy stocks now."` into the *new* sentence →
`check-blindspot` **FAILS and quotes my exact paragraph back**, so the added text is genuinely inside
§10.1's scanned corpus; restored from a scratchpad copy to a byte-identical
`ac5c7548…`, never `git checkout --`, and the restored file passes **0 failures**.
*DECISIONS.md conflict:* none — `compound|6%|essentials track` returns **0** hits (**control:**
`localStorage` returns **11** in the same file). No state, build, routing or content-format change;
content stays `.js`.
*Already-done backlog item:* no — the `-S` history above shows the paragraph has never been edited,
and no "Completed and pruned" entry covers lesson 3's prose.
*My own verification claim:* every number in this entry was printed by a script re-run this session
with its control beside it, or read off the built app with the bundle name confirmed.
**W-6.3, and the previous entry asked the next run to state the basis in the same breath as the
number — so: `scripts/*.mjs` = 15,325 lines against `src/` minus `content/` and `locales/` = 8,437
lines, a ratio of 1.82x on the `.mjs` basis.** Both figures reproduce the previous entry's exactly, so
the divergence it flagged was the numerator's basis and is now settled. This run falls on the harmless
side: **zero lines of instrument code and no new check** — `git diff --stat -- scripts/` shows only
`translation-review-ledger.json`, which is ledger data. The sweep script lives in the scratchpad and
is deliberately not committed; a 120-sentence class that came back with one defect does not earn a
permanent regex.
⚠️ **What the check found against me:** my first draft of the English replacement said they finish
"a little under $400,000 each" — Tom finishes at **$401,806**, which is *over*. Caught by re-reading
my own table rather than my own sentence, and replaced with "within about 1% of each other", which is
the measured **0.88%**. Small, but it is the exact failure mode this log is about: I had the correct
number in front of me and wrote a rounder one.
⚠️ **And what I stopped myself doing:** fixing lesson 37's `9x` while I was in the arithmetic class
with the sweep already pointing at it. It is **item 167(a)**, its ⛔ clause forbids it as a headline
pick, and folding it in here would have been the smuggle W-6.2's ⚠️ names. Verified left alone:
`grep -c "nine times the size"` still returns **1**.

**O-3 accounting: one paragraph per language — en +153, es +115, ko +82, zh +58, ja +65 code points**
in `lessonContent.essentials.*`. No fluent reviewer has read any of the non-English text; the ledger
records this run as `ai`, not `human`, and the four languages return to 100% reviewed / 0% human.

**Top item for the next run.** This run files **no numbered residual** — per W-6.2 rule 2 the sweep's
result is a **note under item 167**, not a new item, because the class came back at one known defect
and needs no guard. Nothing here is a default pick. **O-1 remains the entire critical path — 44
lessons, 5 languages, 161 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` and the empty `course` file only, **untouched**. `HEAD` re-checked before writing and unmoved
at `d8c9387`; the daily market-data job did not fire during the run and `public/data/market.json` is
untouched at `asOf=2026-09-04`. The 0-byte untracked `course` file remains present and unexplained —
neither deleted nor committed, per the hard rules.


### 2026-09-05 (scheduled dev-agent, picked from LAUNCH_PLAN §3.0 under W-6.2 rule 1) — the app hung the Fed's 2% target on CPI, which is not the index the target is set on, and then spent the next section teaching the reader to read CPI against "the Fed's target" four times

**Where the pick came from.** The previous run filed **no residual**, so nothing was queued by default;
its own closing line named the launch plan, an owner-facing item, or the floor as the honest
candidates. I re-read the two live pick-list candidates first, per W-5.2's standing warning that a
candidate list goes stale exactly like a figure does:
- **Item 160** (the `npm test` option-length warning, 56.5%) — **re-read and correctly still parked.**
  Its own ⛔ stop-line clause says everything left in it is class B, which is distractor-quality prose
  in four unreviewed languages, and therefore O-3's decision. Its one small standing ask (the stale
  "roughly 3/3/4/3" comment in `quizMeta.js`) is scoped to "the next run to touch that file"; this run
  does not touch it, so it stays queued rather than being smuggled in here.
- **The floor** — `check-log-size.mjs` says the run log is at **81.6% of warn with 4.6 runs of
  headroom**, and the last compression pass was **yesterday** and recovered 17,157 b. Not due.

So: §3.0, and the same question the previous run asked — where does the app state something more
confidently than the evidence supports? It looked at psychology in the money track. I looked at the
**macro-indicator vocabulary**, because that is where the app makes its most specific institutional
claims and because the last four content reads were all lesson prose rather than the Reference
surfaces the lessons feed into.

**⛔ Step 3.5 — the premise re-measured with controls, before any edit.** No filed item to check, so
what had to be established was that the claim is wrong, how far it reaches, and that no run has
already ruled on it.

The claim, in the `CPI` glossary entry:

> *"Measures average price changes. Main inflation gauge. **Fed targets ~2%.**"*

**The Fed's 2% longer-run goal is not defined on CPI.** The FOMC's Statement on Longer-Run Goals
sets it on the **PCE price index**, and the two do not read the same: CPI runs structurally a little
higher (fixed-basket weighting, less substitution, out-of-pocket urban scope only, against PCE's
chained weights and broader scope). Attaching the target to CPI is not a rounding simplification —
it names the wrong instrument, and the reader then reads the wrong one against 2%.

**Measured through the parsed modules, not grepped** (a grep of `glossary.js` for a display name
proves nothing — the previous run was caught by exactly that, and its correction is why I parsed):
- **Instrument controls, both directions:** `glossary` parses to **43 terms**; `GDP`, a term I know is
  there, reads **present**; `PCE`, a term I believed absent, reads **absent**. A scan for
  `/inflation|inflaci|인플레|通胀|インフレ/` over the whole glossary returns **4 entries**, so the
  scanner is live; the same scan for PCE-shaped strings (`PCE|personal consumption|个人消费|개인소비|
  個人消費`) returns **0 across all 43 terms × 5 languages**. **"PCE" appears nowhere in `src/` or
  `scripts/` at all.**
- **Five for five in the glossary:** `es` *"Meta del Fed: ~2%"*, `ko` *"연준 목표: 약 2%"*,
  `zh` *"美联储目标约2%"*, `ja` *"FRB目標：約2%"*.

⭐ **The reach is what makes it worth a run, and it is bigger than the glossary.** Sweeping every
lesson body in all three tracks and five languages for a paragraph carrying both a `2%` and an
inflation word returns **two lessons, and only two**:
- **Lesson 39, "Reading Economic Indicators"** — §1's CPI paragraph ends *"The Fed targets roughly 2%
  inflation as healthy"*, in all five languages. **And §2, the section immediately below it, then
  teaches the reader to use it: *"CPI near the Fed's target"*, *"CPI has drifted above target"* —
  the conflation is not a stray sentence, it is the reading rule the lesson hands over.**
- **Lesson 35, "Interest Rates"** — *"stable prices (in practice, roughly 2% inflation per year, **the
  same target from the indicator dashboard in 'Reading Economic Indicators'**)"*. This one is
  **innocent and I am recording why so the next run does not re-convict it**: it states the target as
  a rate, not as a gauge, and its cross-reference points at lesson 39's *number*, which stays true
  after the fix. Editing it would have been the over-correction, not the fix.
- **The quiz is clean.** No question in any language stakes an answer on the CPI-target tie
  (`2%` in `quizText.en.js` returns only the real-return arithmetic in a different lesson), so
  nothing downstream had to move.

**Never assessed by any run, with a positive control.** `git log -S"Fed targets roughly 2% inflation"
-- src/` returns **four commits, all of them the lesson's original authoring (`2afcb42`, "Rewrite all
17 lessons") plus three file splits** — no content edit has ever touched it. **Control:** the same
command shape on `"this time is different"` returns yesterday's real content edit `21b2431` alongside
its splits, so the instrument finds content edits when they exist. The glossary line is worse:
`-S"Main inflation gauge"` returns **one** commit, `98a79ce`, the extraction out of the monolith.
`PCE` returns **0** in `AGENT_LOG.md`, the archive and `DECISIONS.md` (**control:** `yield curve`
returns **17 / 40 / 2** in the same three files).

**What shipped — two sentences, five languages each, and deliberately nothing else.** The glossary
entry now reads *"…The most widely quoted inflation gauge. The Fed's ~2% goal is set on a different
measure, the PCE price index, which usually reads slightly below CPI."* Lesson 39's sentence becomes
*"The Fed treats roughly 2% inflation as healthy — though it sets that goal on a close relative of
CPI, the PCE price index, which usually reads a little lower."*
- **§2 of lesson 39 was left alone on purpose.** Once §1 tells the reader the target lives on a
  neighbouring index that reads slightly lower, *"CPI near the Fed's target"* is shorthand the reader
  has been equipped for rather than a claim they have been misled by. Rewriting four more phrases
  would have quadrupled an unreviewed-translation diff to restate something the paragraph above now
  says once.
- **No effect size and no citation apparatus in the body** — §3.0.6 forbids retreating into precision
  theater, and "usually reads a little lower" is the part a beginner can use. The acronym is named
  once because a reader who hears "PCE" in a news bulletin should recognize it; it is not a glossary
  term, so §17b owes it no chip.

**Verification.** `npm test` — **0 failures, 4 warnings**, all four identical in kind to this run's
opening baseline (translation review share, 48 abridged pairs, item 160's 56.5% length cue, the
`AGENT_LOG` floor). Two transient failures appeared mid-run and were the expected consequence of an
English content edit, not regressions: the ledger correctly marked lesson 39's four translations
**stale**, re-marked `ai` — never `human` — and `refresh-readiness.mjs --write` rewrote the generated
catalog figures (151,511 → 151,621 en chars). `npm run build` clean, **966 ms**.
`npm run check-blindspot` **0 failures**.
**Live, on the built app, not inferred.** Served `dist/` statically and read the rendered `<main>`;
bundle read back as **`index-svVhcVEK.js`**, which is this build's output.
- **Glossary → Consumer Price Index** renders the new definition in **en**, and switching the header
  picker to **中文 (Beta)** renders the Chinese one.
- **Lesson 39** renders the new sentence in **en** and in **日本語 (Beta)**. The reader still shows
  **≈5 min** and `npm test`'s reading model is unmoved at **161 min**.
⚠️ **Two instrument notes for the next run, both cost me time here.**
1. **Seeding a lesson unlock has two traps, not one.** `ecycles_completed_lessons` is compared with
   `includes()` against `lessons.js` ids, which are **numbers** — seeding `["29",…]` as strings
   silently counts toward the progress total while unlocking nothing. And on reload with
   `ecycles_legacy_lesson_id_migrated` unset, `migrateLegacyLessonIds` remaps economy ids 29-38 to
   **money ids 17-26**, so a correct seed is destroyed by the very next reload. **Set the migration
   marker and seed numbers**, then reload; `#/lesson/39` bounces to `#/learn` until both hold, which
   is the deep-link guard behaving correctly.
2. The Browser pane was **hidden** for this run, so `computer` clicks time out with a clear error.
   `javascript_tool` + `get_page_text` drive it fine; that is not a fallback, it is the right tool
   when the pane is not displayed. (Last run's note about a 0x0 viewport is a different failure —
   I resized to 420x900 first and it never fired.)

**Step 5 — adversarial self-check.**
*Blindspot register:* §10.2 — no person or firm named beyond "the Fed", which the sentence already
contained. §10.3 — untouched. §2.3 — no date and no live-looking market figure; the `~2%` is a
standing policy target that was already in both strings, and "reads a little lower" is qualitative by
design rather than a number that can go stale. §10.1 — **proved rather than asserted**: planted
`"You should buy stocks now."` into the *new* glossary sentence → `check-blindspot` **FAILS**, so the
added text is genuinely inside §10.1's scanned corpus and a clean pass means something; restored from
a scratchpad copy to a byte-identical `c4ebdd52…`, never `git checkout --`, and the restored file
passes **0 failures**.
*DECISIONS.md conflict:* none. `CPI|PCE|inflation target` returns **1** hit, line 39, which is the
FRED-as-data-source decision and is untouched by a prose edit (**control:** `localStorage` returns
**11** in the same file). No state, build, routing or content-format change — content stays `.js`.
*Already-done backlog item:* no — see the `-S` history and the zero-with-control PCE grep above.
*My own verification claim:* every figure in this entry was printed by a command re-run this session
with its control beside it, or read off the built app with the bundle name confirmed.
⛔ **What the check found against me — and this one is a correction to the previous entry, not to my
change.** W-6.3 asks each run to quote and re-measure the instrument-to-app ratio. **The previous
entry's `scripts/` 18,147 does not reproduce on any basis I can construct.** Measured today on the
same tree: `scripts/*.mjs` = **15,325** lines; `scripts/` counting every file = **19,643** (the
difference is `translation-review-ledger.json`, 1,146 lines, plus the non-`.mjs` remainder). `src/`
minus `content/` and `locales/` = **8,437**, which **reproduces the previous entry exactly** — so the
divergence is on the numerator only. **The next run should state its basis in the same breath as the
number**; a ratio quoted without one is the same defect as a count retyped into the App summary.
Either way this run falls on the harmless side of it: **zero lines of instrument code and no new
check** — `git diff --stat -- scripts/` shows only `translation-review-ledger.json`, which is ledger
data, not an instrument.
⚠️ **And what I stopped myself doing:** rewriting §2's four *"CPI … target"* phrases and lesson 35's
cross-reference. Three surfaces, one sweep is the tempting shape and it is the exact
over-correction the last three runs have been caught alternating into. I measured lesson 35, found it
true as written, and left it — **leaving it alone is part of the finding.**

**O-3 accounting: one clause added per language in two files — lesson bodies en +110, es +105,
ko +66, zh +36, ja +54 code points; the glossary entry +364 across all five languages in one file.**
No fluent reviewer has read any of the non-English text; the ledger records this run as `ai`, not
`human`, and the four languages return to 100% reviewed / 0% human.

**Top item for the next run.** This run files **no residual**, so nothing here is a default pick.
Two things it *did* surface, both left deliberately unpicked: item 160's `quizMeta.js` header ask is
still waiting for the next run that touches that file, and the W-6.3 numerator basis above wants
stating once rather than re-deriving. **O-1 remains the entire critical path — 44 lessons, 5
languages, 161 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` and the empty `course` file only, **untouched** (`OWNER-TREE` 52 untracked at both ends).
`HEAD` re-checked before writing and unmoved at `2a94251`; the daily market-data job did not fire
during the run and `public/data/market.json` is untouched at `asOf=2026-09-04`. The 0-byte untracked
`course` file the previous entry flagged is **still present and still unexplained** — neither deleted
nor committed, per the hard rules.


### 2026-09-05 (scheduled dev-agent, picked from LAUNCH_PLAN §3.0 under W-6.2 rule 1) — the lesson that teaches "don't rely on willpower" proved it with the one willpower finding that has most publicly failed to replicate, three sentences after the same lesson had modeled the careful version of exactly that move

**Where the pick came from.** The previous run closed item 167 (b) and said in its own closing line
that **W-6.2 rule 1 is exhausted for that chain** — no residual of it may be the headline. So this
run picks from the launch plan. §3.0 is the plan's *primary success criterion* and its clause 6 is
about not retreating into precision theater; what I went looking for was the opposite failure —
**claims the app states more confidently than the evidence supports.** The money track was the place
to look: it is "the product" since the 2026-08-18 reversal, it leans harder on psychology than the
other two tracks, and the last two close readings were both of `economy`.

**⛔ Step 3.5 — the premise re-measured, with controls, before any edit.** I did not have a filed
item to re-measure, so what had to be established was that the defect is real, that it is *one*
defect and not a pattern, and that the neighbours are innocent.

The claim, in `money` lesson 18 §2 ("Why Later Loses to Now"):

> *"Trying to out-willpower a vivid, present temptation every single time is exhausting, and research
> on self-control consistently finds it unreliable — **willpower runs low over the course of a day the
> way a muscle gets tired.**"*

That second half is the **strength / ego-depletion model**, and "research consistently finds" is
close to the reverse of its record: the multi-lab preregistered replications (23 labs, N≈2,100, then
a second at N≈3,500) put the effect at or near zero, and the meta-analytic re-reads found heavy
publication bias in the original literature. It is one of the best-known replication failures in
psychology, and the app asserts it as settled — **in all five languages.** Confirmed by dumping
§2 from each of the five money modules rather than skimming the browser: `es` *"la fuerza de voluntad
se agota a lo largo del día como se cansa un músculo"*, `ko` *"의지력은 근육이 지치듯 하루가 지나면서
소진됩니다"*, `zh` *"意志力会像肌肉一样，随着一天过去而逐渐疲乏"*, `ja` *"意志力は筋肉が疲れるのと同じ
ように、一日のうちに目減りしていきます"*. Five for five.

⭐ **What makes it a defect rather than a simplification is where it sits.** The paragraph
*immediately above it* does the careful thing with a weaker-but-better-surviving finding — the
marshmallow experiments — and says so out loud: *"Later research complicated the original story…
That complication doesn't erase the core finding, it sharpens it."* **The lesson already knows how to
hold a contested result.** It then spends the next paragraph asserting, flatly, the finding that has
actually collapsed. Two opposite epistemic standards, three sentences apart, and the confident one
went to the weaker claim.

⭐ **And the claim was load-bearing in the wrong direction.** The paragraph's *conclusion* — stop
fighting temptation, change the choice — is right and is what the app repeats in three other places.
Its stated *reason* was a failed finding, so the lesson's advice about not trusting willpower rested
on a willpower claim the reader should not trust. **Fixing it makes the argument sound rather than
weaker**, because the replacement reason is better supported than the one it removes.

**Controls, and one of them caught me.** My first neighbour sweep grepped `glossary.js` for term
names and returned zero for `willpower`/`self-control`/`gratification` — **and the control failed
too**: `Opportunity Cost`, a term I knew was in there, also returned zero. The glossary stores
entries as `{en:{s,f,ex}, …}` maps, so grepping the file for a display name proves nothing. Re-run
through the parsed module with `Gross Domestic Product` as a control that must be true: **43 terms,
control true, and none of the four search terms present anywhere in the entry text.** A negative from
the first instrument would have been worthless.
- **History:** `git log -S"the way a muscle gets tired" -- src/` returns **three commits and all
  three are the lesson's creation plus two file moves** (`fef3bb1` created it as "lesson 30"; the
  per-track and per-language splits moved it). **Positive control:** the same command shape on
  `"this time is different"` returns yesterday's real content edit `21b2431` alongside its moves. So
  the sentence entered with the original lesson and **no run has ever assessed it.**
- **Never touched by a previous run, and not undoing one:** `willpower|self-control|ego depletion|
  muscle gets tired` returns **0** in `AGENT_LOG.md` and **2** in the archive — both about the
  *technique* (automate the choice so it needs no daily willpower), neither about the mechanism.
  **Control:** `temporal discounting|opportunity cost|marshmallow` returns 1 and 19 in the same
  files, so the grep is live. My change preserves both of those runs' point and now supports it
  correctly.

**⭐ The class swept, and the sweep is what kept this to one sentence.** Regexed every
research-authority sentence across all three tracks' English bodies, takeaways and think-prompts —
**25 hits.** I read all 25 rather than counting them. **Exactly one is a failed finding.** The two
that look like the same shape are **not** defects and I am recording why so the next run does not
re-derive it:
- lessons 19 and 27, *"losses feel roughly twice as painful as equivalent gains feel good"* — that
  is loss aversion at the standard λ≈2, it is hedged with "roughly", and it survives the critiques
  aimed at it far better than depletion does;
- lesson 28, *"investors who trade more often after a run of gains tend to earn lower average
  returns"* — Barber-and-Odean-shaped, replicated across markets.
**Leaving them alone is the finding.** The last three runs have been caught alternately ignoring
neighbours and over-correcting toward them; the discipline is to check them, not to convict them.

**What shipped — one paragraph, five languages, no new mechanism invented.** The conclusion, the
worked example, the takeaway and the think-prompt are untouched. The replacement keeps *"trying to
out-willpower a vivid, present temptation every single time is exhausting"*, marks the tank/muscle
story as the *familiar* explanation rather than the finding, says plainly that it held up poorly when
large teams ran the experiments again, and then gives the reason that did survive: **people who are
good at self-control are mostly not winning more fights against temptation — they have arranged
things so there are fewer fights to have.** That is the same paragraph's own advice, now with support
under it. Deliberately **no citation apparatus and no effect sizes in the body** — §3.0.6 forbids
retreating into precision theater, and this is a beginner lesson, not a literature review.

**Verification.** `npm test` — **0 failures, 4 warnings**, all four pre-existing and unchanged in
kind from this run's opening measurement (translation review share, translation completeness at 48
pairs, item 160's option-length cue at en 56.5%, the `AGENT_LOG` floor). Two transient failures
appeared mid-run and were the expected consequence of a content edit, not regressions: the review
ledger correctly marked lesson 18's four translations **stale** (English source changed), re-marked
`ai` — never `human` — and the four generated catalog figures were rewritten by
`refresh-readiness.mjs --write` (151,092 → 151,511 en chars). `npm run build` clean, **984 ms**.
`npm run check-blindspot` **0 failures**.
**Live, on the built app, not inferred:** served `dist/` statically, seeded the money track's
prerequisites so lesson 18 is genuinely unlocked (a URL does not unlock a lesson), and read the
rendered `<main>`. Bundle read back as **`index-COKHCcpZ.js`**, which is this build's output. The new
paragraph renders in **en**, and switching the header picker to **中文 (Beta)** renders the Chinese
one. The reader still shows **≈5 min** and `npm test`'s reading model is unmoved at **161 min**, so
no `minutes` value needed changing. ⚠️ **One instrument note for the next run:** `read_page` first
returned "(empty page)" at **viewport 0x0** — the pane had no width. Resize before reading, or a
live check silently returns nothing.

**Step 5 — adversarial self-check.** *Blindspot register:* no market surface, no kids surface, no
Dalio, no date or live-looking figure; the new text contains no imperative and no advice-adjacent
construction — it describes what people who do this well tend to have arranged, which is the same
register as the sentence it replaced. `npm run check-blindspot` **0 failures**, and §17b reports
**0 unexplained** glossary-term uses, so the new prose introduced no term owing a chip.
*DECISIONS.md conflict:* none — `willpower|self-control|psycholog|replicat` returns **0** there
(**control:** `localStorage` returns 11 in the same file), and nothing about state, build, content
format or track ordering is near this change.
*Already-done backlog item:* no — see the `-S` history and the archive reading above.
*My own verification claim:* every figure here was printed by a command re-run this session with its
control beside it, or read off the built app with the bundle name confirmed.
*W-6.3 (instrument-to-app ratio):* re-measured on the previous entry's exact basis and it
**reproduces to the line — `scripts/` 18,147 against `src/` minus content and locales 8,437, 2.15x,
unmoved.** This run adds **zero** lines of instrument code and **no new check**; `git diff --stat --
scripts/` shows only `translation-review-ledger.json`, which is the ledger data, not an instrument.
⛔ **What the check found against me:** the glossary instrument above was invalid and its control is
the only reason I know that. I also had to stop myself widening this into the loss-aversion and
retail-trading sentences — three surfaces, one sweep is a tempting shape, and it would have hedged
two findings that do not need hedging.

**O-3 accounting: one reframed paragraph per non-English language — es +441, ko +205, zh +133,
ja +186 characters (en +419).** No fluent reviewer has read any of it; the ledger records this run as
`ai`, not `human`, and the four languages return to 100% reviewed / 0% human.

**Top item for the next run.** This run files **no residual**, so nothing here is a default pick.
The honest candidates are the launch plan again, an owner-facing item, or the floor: `npm test` has
warned on every run that the non-archivable floor is **402,049 b against a 250,000 b budget** and the
backlog alone is **371,801 b** — W-6.4 says the cause is W-6.2 rule 2, not insufficient compression,
and the last pass was 2026-09-04. **O-1 remains the entire critical path — 44 lessons, 5 languages,
161 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` only, **untouched** (`OWNER-TREE cd1cc722…`, 51 untracked). `HEAD` re-checked before writing
and unmoved at `21b2431`; the daily market-data job did not fire during the run and
`public/data/market.json` is untouched at `asOf=2026-09-04`.
⚠️ **One surprise, left alone and reported rather than acted on:** at staging time a new **empty,
0-byte, untracked file named `course`** was present at the repo root (mtime 04:13 today), which was
not there at run start. I cannot account for it, nothing in this run writes to that path, and it is
not mine to explain — so per the hard rules it was **neither deleted nor committed**, and the owner
should know it is there.



### 2026-09-05 (scheduled dev-agent, backlog item 167 (b)) — lesson 36 posed the 2022 inversion as a live open bet three blocks under a body paragraph that had already closed it; and the neighbour I checked *because* the last run got caught not checking neighbours turned out to be fine, which is the finding that keeps it from being widened

**Where the pick came from.** Item 167 (b), filed by the previous run off the same close reading of
the economy track. **W-6.2 rule 1 permits it**: that filing entry counted itself as link one and said
so explicitly, so this is link two of the allowed two. **The next run may not take a residual of this
one as its headline** — it picks from the launch plan, the owner-facing items, or refills the backlog.

**⛔ Step 3.5 — the premise re-measured, with a control, before any edit.** Item 167 (b) claims a
screen that disagrees with itself in five languages. Reproduced by dumping lesson 36's `thinkAbout`
and section-2 body from all five content modules (not skimmed in the browser):

> body: *"It inverted in mid-2022 and stayed inverted for roughly two years, the longest stretch on
> record, before turning positive again in 2024, well past the 'typical' 12-18 month lead time."*
> THINK: *"The yield curve inverted in 2022. Historical pattern says recession within 12-18 months.
> Some say 'this time is different.' What do you think?"*

**Confirmed exactly as filed, in en/es/ko/zh/ja.** The item's characterization of the code held too —
the prompt is a single `thinkAbout` string per language and nothing else renders it. Control on the
grep that established the scope: `2s10s`, a string I knew was in the same lessons, returned 5 files
from the identical command shape that returned 5 for the `this time is different` family. **The
prompt has never been edited**: `git log -S"this time is different" -- src/content/` returns five
commits and **all five are file moves** (the per-track and per-language splits), with the positive
control `-S"The US in 1930-32"` correctly returning yesterday's content commit. It entered with the
original content and no run has assessed it.

**⭐ What re-measuring changed, and this time it *narrowed* the item rather than widening it.** The
last two runs were both caught treating a claim's neighbours as out of scope, so I swept them first.
`12-18` across `src/` returns three surfaces, not one: the lesson, **the end-of-lesson quiz question**
(`quizText.*.js:75`, "An inverted yield curve predicts: … Recession within 12-18 months") and **the
glossary's `Yield Curve` entry** ("Inverted = recession signal within 12-18 months"). Both sit inches
from the prompt — the quiz renders directly below it on the same screen, which the screenshot shows.
**Neither is a defect and I am recording why, so the next run does not re-derive it.** They are claims
about the *general* pattern, which is what the lesson teaches and what the 1955 record supports; the
quiz's own `explain` already carries the hedge ("not every inversion has been followed by a
recession, so it isn't a perfect predictor"). **The defect was never the 12-18 month figure — it was
the present tense.** Only the `thinkAbout` asserted an *open* window over a specific, resolved
episode. So the fix is one field in five languages, and **the two neighbours are deliberately
untouched.**

**What shipped.** `src/content/lessonContent.economy.{en,es,ko,zh,ja}.js` — lesson 36's `thinkAbout`,
one string per language, nothing else in the file. The replacement anchors on the closed interval
rather than on an open one:

> *"The yield curve inverted in mid-2022, and the 12-18 month window that the 'typical' lead time
> points to closed at the end of 2023 without a US recession. Does that make the signal wrong — or
> does it mean 'typical' was never a promise about any single episode?"*

**The construction is the point and it is worth not re-deriving: a bounded interval cannot go stale.**
"mid-2022 + 18 months closed at the end of 2023" is true forever. The obvious alternative phrasing —
"no recession has followed it *yet*" — would have been a §2.3 liability of exactly the kind this app
keeps finding, a sentence that silently becomes false and that nothing checks. **The prompt also
keeps its pedagogical job**: it still asks the learner to weigh the signal, using the material the
body's own third section (term premium) and the 1966 counter-example give them.
**+117 en chars; es +126, ko +56, zh +39, ja +60.** Length is now 259 en chars against a sibling range
of 139-305 — it had been the second-shortest prompt in the track at 142.
`scripts/translation-review-ledger.json` — lesson 36 re-marked in es/ko/zh/ja (method `ai`), because
the English edit correctly flipped all four to **stale**. `LAUNCH_READINESS.md` regenerated through
`npm run refresh-readiness --write`, never typed.

**Checked and NOT done, so it is not re-derived:** the phrase "this time is different" leaves lesson
36 but **stays in the corpus where it is actually taught** — lesson 33, as bubble psychology, where
the archive shows it was deliberately placed. Verified at 1 occurrence after the edit. The concept is
not lost; it stopped being used to frame a settled question as unsettled.

**Verification.**
- `npm test` **0 failures, 4 warnings — identical to the baseline taken before editing** (log-size
  floor, quiz option-length cue, translation completeness, translation review coverage). The
  intermediate state was proof the ledger works: the prose edit alone produced **1 FAIL** (readiness
  §10.4 disagreeing with the live ledger) and flipped all four languages to 98% (1 stale), which is
  the drift detection firing rather than a regression.
- `npm run build` clean. `npm run check-blindspot` **0 failures**.
- **Read live on the built app at 375x812**, `dist/` served statically, one language per call and
  never reading in the same call as the reload. Per language: new string **1**, old string **0**, and
  an untouched section-2 phrase **1** as a passive control. **The instrument was proven live in each
  of the five**: before each count I injected a probe element carrying that language's *old* string,
  confirmed the reader returned **1** for it, removed the probe, and only then counted — so a zero on
  the old string is a live instrument reading zero, not a dead one returning nothing. Screenshot of
  the `en` THINK box, with the quiz question visible below it.

**Step 5 — adversarial self-check.**
*Blindspot register:* clean, checked not assumed. §10.2 — `dalio` returns **0 added lines** across the
whole diff (the one raw hit is an unchanged *context* line of `LAUNCH_READINESS.md`'s own §10.2 row,
which states the rule; positive control `151,092` returns 2 added lines from the same command shape).
§10.1 — `check-blindspot` PASS; the new prose asks a question about a historical episode and no advice
pattern reaches it. §10.3 — untouched. **§2.3 — this change is a §2.3 *improvement*, which is the
cleanest way to put it**: the string removed was the one piece of teaching copy that read as
present-tense-current, and the replacement is bounded.
*DECISIONS.md conflict:* none. The combined grep returns 6 hits and I read all six rather than
counting them — FRED as the economics source (39), the translation field set and the tail term-chip
rule (204, 358), the per-language chunking (456, 471) and track ordering (622). **None governs this
content**, and the two that could have — the `takeaway`/`thinkAbout` term-chip rules — are satisfied:
the new text introduces no glossary term needing a chip, and `check-data.mjs` §17b passes. Control:
`localStorage` returns 11 in the same file, so the grep is live.
*Already-done backlog item:* no — see the `-S` history above; never edited, never assessed.
*My own verification claim:* every number above was printed by a command re-run this session.
*W-6.3 (instrument-to-app ratio):* **re-measured, and the re-measurement caught me misreading the
previous entry before I quoted it.** My first two counts of `scripts/` gave 15,325 (`*.mjs`) and
19,643 (all files) against the previous entry's **18,147**, and neither reconciled. The previous
figure counts **`.mjs` + `.js`, excluding the two JSON data files** — on that basis it reproduces
**exactly**: 18,147 against `src/` minus content and locales at **8,437**, **2.15x**, unmoved.
**This run adds 0 lines of instrument code**; the ledger's `8 8` in `--numstat` is four date/hash
pairs rewritten in place, net zero, not growth. `scripts/` is byte-identical to `ba7fd0d`.
⛔ **What the check found against me.** The near-miss was in the *opposite* direction from the last
two runs, and it is worth naming as its own failure mode. Having just been burned twice by ignoring
neighbours, my first instinct on finding the quiz and the glossary both carrying "12-18 months" was
that they were part of the defect — three surfaces, one fix. **That would have been wrong and would
have damaged the lesson**: it would have hedged the general pattern the lesson exists to teach, on
the strength of one episode. **Over-correcting from the last run's lesson is its own error.** The
discipline is to check the neighbours, not to assume they are guilty.

**O-3 accounting: one reframed prompt per non-English language — es +126, ko +56, zh +39, ja +60
characters.** No fluent reviewer has read any of it. The ledger records it as `ai`, not `human`.

**Filed, not picked (W-6.2 rule 2 — this is a NOTE, and deliberately not a numbered item):** item 167
(a) (the 9x/10x balance-sheet multiple in lesson 37) and (c) (the recession-equals-deflation
simplification in lesson 32) both remain open under item 167 and are untouched by this run. (c) is
still unmeasured against the glossary and item 167's own ⚠️ says so.

**Top item for the next run:** ⛔ **not a residual of this one — W-6.2 rule 1 is now exhausted for
this chain.** Item 167 (a) is near-free but it is this chain's third link; the honest next pick is the
launch plan, an owner-facing item, or a backlog refill. **O-1 remains the entire critical path — 44
lessons, 5 languages, 161 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` only, **untouched**. `HEAD` re-checked before writing and unmoved at `ba7fd0d`; the daily
market-data job did not fire during the run, and `public/data/market.json` is untouched at
`asOf=2026-09-04`.


### 2026-09-05 (scheduled dev-agent, self-picked off a close reading of the economy track) — the lesson teaching "balance is everything" used the US in the 1930s as its pure-austerity failure, which drops the one case in the corpus where the same country ran both mixes; and the claim was not only in the prose, it was the left anchor of the figure drawn an inch below it

**Where the pick came from.** The previous run filed nothing for me to take, and named item 160's
`quizMeta.js` header comment as the queued ask. I read item 160 first, per W-5.2's standing warning
that a pick list is a claim about current state: **everything still open in it is behind its own ⛔
stop line and is O-3's**, and the only reachable piece is a one-line stale comment. Item 165's
remainder is likewise owner-gated *and* out of order behind item 94. So this is a self-pick from the
main path, which is where the last three self-picked runs found real defects.

**⛔ Step 3.5 — the premise here is mine, so it got the same treatment.** I read all twelve economy
lessons end to end (42,597 b dumped from the modules, not skimmed in the browser) and carried three
candidates out. The one taken is lesson 34's:

> *"The US in the 1930s leaned almost entirely on austerity, and the result was the Great Depression."*

**Three things are wrong with it and they compound.** (1) **Ordering** — the downturn began in
August 1929; the policy mix deepened it, it did not cause it. (2) **The decade** — the US did not
lean "almost entirely on austerity" across the 1930s. It did in **1930-32** (the Revenue Act of 1932,
budget-balancing at every level of government, and a defense of the gold standard that kept money
tight while roughly 9,000 banks failed). Then in **1933** it left the gold standard, devalued the
dollar and let money expand, and the recovery started that year — the era's version of the lesson's
own tool 4. (3) **The teaching cost, which is the reason this outranked the other two candidates**:
the section's whole claim is that the *mix* decides the outcome, and the US 1930s is the only case
in the corpus where one country ran both mixes inside one decade. Naming it as the pure-austerity
failure spends the best available evidence for the lesson's own thesis on the opposite point.

**⭐ What re-measuring changed: the scope. The item I would have written said "one sentence in five
languages." It is a sentence AND a figure.** `deleveragingAnchors[lang][0]` and
`deleveragingDescription[lang]` in `content/markets.js` both carry the same claim, because lesson 34's
`BalanceBand` dial lifts its anchors verbatim from the prose (item 27, 2026-09-03). A prose-only fix
would have left the figure asserting the old claim an inch below the corrected paragraph — the
"figure that inverts its own lesson" shape §50 (i) exists for. **`check-data.mjs` §69 (a) is what
made that unmissable rather than lucky**: it requires all 45 figure strings to appear verbatim in that
language's lesson text, so the prose edit alone fails the build. The guard did the work a new check
would have; **`scripts/` is unchanged by this run — 0 lines added.**

**What shipped.**
- `src/content/lessonContent.economy.{en,es,ko,zh,ja}.js` — lesson 34, section 2, third paragraph:
  the one sentence replaced by two. **+367 en chars; es +426, ko +208, zh +118, ja +169.**
- `src/content/markets.js` — the left anchor and the text alternative, 2 sites × 5 languages:
  "The US in the 1930s" → "The US in 1930-32", and the four translations of each.
- `src/components/charts.jsx` — the design comment that quotes the claim (comment only).
- `scripts/translation-review-ledger.json` — lesson 34 re-marked in es/ko/zh/ja (method `ai`),
  because the English edit correctly flipped all four to **stale** and the ledger is only ever
  grown by whoever did the review. `LAUNCH_READINESS.md` / `LAUNCH_PLAN.md` figures regenerated
  through `npm run refresh-readiness --write`, never typed.

**⚠️ One thing the build caught that I had gotten wrong.** The first ja draft wrote *"第4の手段"*.
`check-data.mjs`'s ordinal-counter guard failed it: `の` is in neither `LESSON_COUNTERS` nor
`NON_LESSON_COUNTERS`, and the guard's whole point is that a translator reaching for a new counter
must not silently disable the cross-reference check. **The right fix was not to widen the set** —
lesson 34's own section 3 already says **`手段4`** and `四つの手段`, so the ja text now uses the form
the lesson already uses. (zh's `第4种工具` needed nothing: `种` is already in `NON_LESSON_COUNTERS`
with lesson 34 named as its justification.)

**Verification.**
- `npm test` **0 failures**; warnings **4 and identical to the baseline I took before editing**
  (log-size floor, quiz option-length cue, translation completeness, translation review coverage).
  `npm run build` clean. `npm run check-blindspot` **0 failures**.
- **§69 re-ran green at 45 verbatim containments across 5 languages** — the figure and the prose
  agree after the change, and they were proven to disagree before it, because the prose-first edit
  failed §69 until `markets.js` followed.
- **Read live on the built app at 375x812**, `dist/` served statically, one language per call and
  never reading in the same call as the reload. Per language: the new anchor appears **2×** (prose +
  figure), the old string **0×**, and **the control fired in all five** — the Germany anchor, which I
  did not touch, also reads 2×, so an instrument returning zero for the old string is a live
  instrument rather than a dead one. `1933` present once in each. Screenshot of the dial in `en`
  shows "The US in 1930-32" in the left ugly zone.
- Reading time unchanged at **≈4 min** for lesson 34 and **161 min** for the catalog.

**Step 5 — adversarial self-check.**
*Blindspot register:* clean, checked not assumed. §10.2 — `dalio` greps to **0** in all seven changed
files. §10.1 — `check-blindspot` PASS; the new prose is economic history and no advice pattern reaches
it. §10.3 — untouched. §2.3 — **the one that needed thinking about**: the change adds four year
figures (1930-32, 1933, 1929 by implication, 9,000 banks). All are historical and none is a
live-looking or current-dated figure; §2.3's own scan over the 26 teaching-copy modules passes.
*DECISIONS.md conflict:* none — `1930`, `deleveraging dial`, `lesson 34` and `Great Depression` all
grep to **0** there; no recorded decision governs this content.
*Already-done backlog item:* no. The claim entered with the original lesson content and no run has
ever assessed it. `"in the 1930s"` appears **once each** in `AGENT_LOG.md` and the archive, both in
item 27's 2026-09-03 figure-design note, which was *building a figure on* the claim rather than
checking it (positive control: `§69` returns 1 and 6 in the same two files, so the grep is live).
*My own verification claim:* every number above was printed by a command re-run this session; the
live reads are the same one-liner against the same URL in five languages.
*W-6.3 (instrument-to-app ratio):* re-measured, not quoted — `scripts/` **18,147** lines against
`src/` minus content and locales **8,437**, **2.15x**, unmoved from the previous entry's figure
because **this run adds 0 lines to `scripts/`**. First run in a while on the right side of that number.
⛔ **What the check found against me.** Two things. **First, I nearly shipped a prose-only fix** —
the figure never entered my scoping until I grepped for the phrase across `src/` rather than in the
lesson module, and §69 would have caught it, but only after I had written the run entry claiming it
was done. **Second, I edited a dated 2026-09-03 backlog note in place** to update the anchor string,
then reverted it: §31 says dated records stay verbatim, so the correction is appended under it
instead. Both are the same error — treating a claim's *neighbours* as out of scope.

**O-3 accounting: one new paragraph-half per non-English language — es +426, ko +208, zh +118, ja
+169 characters.** No fluent reviewer has read any of it. It is a correction rather than an
enlargement, and the alternative was leaving four languages carrying a false historical claim, but
O-3 counts it and the ledger records it as `ai`, not `human`.

**Filed, not picked (W-6.2):** **item 167**, three more content defects read off the same pass —
lesson 37's balance-sheet multiple (9x vs 10x), lesson 36's THINK prompt contradicting its own body
about the 2022 inversion, and an unmeasured recession-equals-deflation simplification in lesson 32.
**(b) is the strongest and is the same self-contradiction shape as the last three finds.**

**Top item for the next run:** item **167 (b)** — but W-6.2 rule 1 counts this as link one, so a run
taking it is within the cap. **O-1 remains the entire critical path — 44 lessons, 5 languages,
161 minutes of content, and zero people have ever opened this app.**

**Owner tree:** `git status` at run start and again before writing showed the owner's untracked
`UIUX/` only, **untouched**. `HEAD` re-checked before writing and unmoved at `2c1d276`; the daily
market-data job did not fire during the run, and `public/data/market.json` is untouched at
`asOf=2026-09-04`.
