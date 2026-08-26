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

> ## PRIORITY BLOCK W-5 — set by the weekly review 2026-08-23. Supersedes the 2026-08-16 block below, which is retained for history (W-1 through W-4 are all closed). Read this first.
>
> **The week was strong and the direction is right; this block is about a stop line, a ratio, and four
> pieces of housekeeping.** Build ✅, `npm test` ✅ (0 failures, 2 expected warnings), ~130 commits, no
> regressions found, content independently spot-checked and neutral. The one real risk is that a
> single item is now consuming 100% of capacity with a tail long enough to eat the next two weeks.
>
> ### W-5.1 — ✅ **FULLY DONE 2026-08-24** (scheduled dev-agent). All three steps landed; the stop line held.
> **Outcome:** `zh` economy 39-40 (step 1, 08-23), `ja` economy 29-40 (step 2, six runs 08-23/24), and
> the economy phase **closed** with the `essentials` remainder filed as **new item 94** (step 3, 08-24).
> `npm run translation-completeness` reports **48 abridged pairs — es 12 / ko 12 / zh 12 / ja 12** and
> **0 abridged pairs anywhere in lessons 12-40**. The milestone is statable and checkable: **the main
> path is fully translated in all five languages.** Total cost: **seven runs**, which is what W-5.1
> budgeted. **The stop line is the reason this stopped here instead of running 24 more runs into the
> optional track** — item 94 exists precisely so that continuing is a decision someone makes rather
> than a tranche that keeps going. Leave the original text below; it is the reasoning, and W-5.2's
> ratio rule still binds on item 94.
> ### W-5.1 (original text, retained)
> **Measured, not asserted:** `npm run translation-completeness` reports **62 abridged pairs** —
> `es` 12, `ko` 12, `zh` 14, `ja` 24. At the demonstrated and very consistent rate of **2 pairs per
> run**, finishing all of them is **~31 runs ≈ 8 days of scheduled capacity**, on content in four
> **"(Beta)"-labeled** languages, for an app that **no one has yet opened in any language** (O-1).
> **The sequence, and then stop:**
> 1. **`zh` economy 39-40** — one run. Completes the Chinese economy track. The next-run note at the
>    end of the 2026-08-23 `zh` 37-38 entry has already scoped it, including the re-simulation step;
>    follow it.
> 2. **`ja` economy 29-40** — six runs. `ja` is untouched at 24 abridged and its economy half is the
>    largest single remaining block. **Re-measure the rate before budgeting**: `ko` ran at 0.379
>    added chars per English char and `zh` at 0.226, and item 93 already records that neither
>    inherited the other's. `ja`'s reference is 0.50.
> 3. **Then CLOSE the economy phase of item 93** and file the `essentials` remainder as a **new,
>    separately-prioritized item** — `es` 1-11+14, `ko` 1-11+14, `zh` 1-11+14, `ja` 1-11+14, **48
>    pairs**. Do not roll it into 93 and keep going.
> **Why this is the right boundary and not an arbitrary one.** `economy` (29-40) is the **main path**
> since the 2026-08-18 product reversal; `essentials` (1-15) is the *optional* track. Finishing
> economy in all five languages is a statable, checkable milestone — "the main path is fully
> translated" — and it costs seven runs. Finishing `essentials` costs another twenty-four, on the
> optional track, before a single person has read a word of any of it.
>
> ### W-5.2 PRIORITY — reserve one run in four for work that is not item 93.
> Twenty of the week's last twenty-four commits were item 93. That is defensible for a sprint and
> corrosive as a habit: it is the W-2 note-chain failure in a new costume — direction stops coming
> from the backlog and starts coming from "continue the tranche". **Every fourth scheduled run picks
> from this list instead**, and says in its entry which one it took and why:
> - **W-5.5 / W-5.6 / W-5.7 below** — cheap, and two of them are documentation-integrity defects.
> - ~~**Item 67's residual third** and **item 64's residual candidates**~~ — **BOTH CLOSED; struck
>   2026-08-24 by the run that checked them before picking.** This line had survived on the pick list
>   for seven days after the work was done, and three later run entries copied it forward verbatim.
>   Item 64 reads "✅ ITEM FULLY DONE 2026-08-20 … Nothing in this item is open"; item 67's own text
>   says "**All that remains of this item is `Dividend`**", and `Dividend` shipped that same day —
>   verified this run by reading `src/content/glossary.js`, where the key is present in all five
>   languages. **The lesson is about pick lists, not these two items:** a list of candidates is a
>   claim about current state and goes stale exactly like a figure does, so re-check a candidate's own
>   item before picking it. (Only this live line is corrected — the three run-log entries that repeat
>   it are dated records and stay verbatim, per §31.)
> - **Item 26** (Quizlet/Vocabulary design review) and **item 27** (re-scope: the money track's
>   visuals shipped, so the item as written no longer describes the gap).
> - **Item 76** and **items 70/71** — process items filed by runs that could not finish them.
> - A **backlog refill** is always a legitimate pick (W-2's standing rule, still in force).
>
> ### W-5.3 — ✅ **DONE 2026-08-23** (scheduled dev-agent). The rule below is STANDING and fired once; leave it here.
> **Result:** `AGENT_LOG.md` **1,396,464 → 483,876 bytes** (a 65% cut, back under the trigger); 107 entries
> dated 2026-08-16→08-22 moved verbatim to `AGENT_LOG.archive.md` under a new `## Archived` heading. Entry
> count reconciled 116 = 107 + 9 and a sorted line-by-line diff of all run-log content came back identical,
> with the control itself proven able to fail. **Premise correction, and it matters for next time:** read
> literally, "older than seven days" from 2026-08-23 means *before 08-16* — and everything before 08-16 was
> already archived, so the rule as worded was a **no-op on the day its own trigger fired**. The boundary
> actually used is the archive file's own rule ("before the most recent review boundary" = 08-23), which the
> run-log header already pointed at and which leaves exactly the current review period live. **Reword the
> trigger's action clause to say "before the most recent weekly-review boundary"** rather than a rolling
> seven days; the 600 KB trigger itself was correct and is what caught this.
> **SECOND PREMISE CORRECTION 2026-08-26 (owner-directed archive pass) — the reworded rule was a
> no-op too, and the reason is that this file's shape has changed underneath the rule.**
> The 08-23 correction above says to read the action clause as "before the most recent weekly-review
> boundary". Applied on 2026-08-26 that boundary is **08-23**, and everything before it was already
> archived — so the rule moved **nothing** while the file sat at **915,262 bytes, 1.5x its own
> trigger**. That is the same failure the note above records, one rewording later: **the trigger is
> byte-based and the action clause is date-based, so nothing makes them agree.**
>
> **The measurement that explains it, taken before the pass.** W-3 wrote this rule on 2026-08-16 when
> the run log was **~93%** of the file. On 2026-08-26 the file divided as: **prioritized backlog
> 458,014 bytes (50.0%)**, **run log 430,101 bytes (47.0%)**, Environment note 20,865 (2.3%), App
> summary 5,097 (0.6%). **The backlog is now the larger half.** So archiving every run-log entry —
> which is very nearly what this pass did — still leaves **~485 KB**, with **81% of the trigger
> consumed before a single new entry is written**. At the current rate (~430 KB of entries in the
> three days 08-23→08-25) the file re-crosses 600 KB in about a day, and no archiving pass can
> prevent it.
>
> **What this pass did, and it is deliberately not the rule.** Cut at the byte target on whole-day
> boundaries: 38 entries (08-23, 08-24, 08-25) moved verbatim, leaving only 08-26 live.
> **915,262 → 493,243 bytes, a 46% cut.** Integrity proved the same way as the 08-23 pass — 259
> dated entries before and after across both files, 24,809 entry lines, sorted line-by-line hash
> identical (`af1d371b…`), with the comparison first shown able to fail on a one-word perturbation.
> Keeping the current review period live, as the rule intends, was **arithmetically impossible**:
> 08-25's entries alone are 140,499 bytes and would have landed the file at 633 KB.
>
> **The decision this needs is the owner's, and it is not an archiving decision — see item 115.**
> Either the backlog gets compressed the way W-3 compressed items 17 and 24 (63 and ~80 lines down
> to 27 and 39, keeping the reasoning and dropping the accreted chronology), or the trigger stops
> being a whole-file byte count and becomes a run-log byte count, which is the thing archiving can
> actually move. **A run should not pick between those unilaterally**; both change what a future run
> reads to orient.
> ### W-5.3 (original text, retained — the reasoning is still the rule)
> **Measured across four commits:** `269b6d0` (2026-08-17, immediately after W-3's second archive
> pass) **479,585 bytes / 5,332 lines** → `3caa3c5` (08-21) 1,076,352 → `e455663` (08-21) 1,153,218 →
> `1eeaba7` (08-23) **1,347,816 bytes / 15,878 lines**. W-3 freed 430 KB and six days re-consumed it
> with 430 KB to spare. The run log is now **11,982 of 15,878 lines (75%)** of the file, at an average
> of **~124 lines per run entry**, and the translation entries are the long ones.
> **The rule, so this stops being a one-off someone has to notice:** when `AGENT_LOG.md` exceeds
> **600 KB**, the next run moves every run-log entry older than **seven days** into
> `AGENT_LOG.archive.md`, in one commit that touches nothing else. That is a legitimate whole run.
> Backlog items, the App summary and the Environment note are **never** archived. (W-3's original
> reasoning stands; what it lacked was a trigger, so it fired once and stopped.)
>
> ### W-5.4 — ✅ **DONE 2026-08-24** (scheduled dev-agent). 37 `##` run entries demoted to `###` across both files — and their **276 subsections demoted to `####`**, which the item as written did not ask for. **See the premise correction below; the fix as scoped was incomplete and would have made 36 entries worse.**
> **Post-archive, measured this run:** `AGENT_LOG.md` holds **6 `##` + 3 `###`** run entries (all 9 dated
> 08-23) and `AGENT_LOG.archive.md` holds **31 `##` + 189 `###`**. The archive move was deliberately
> verbatim — that is what its integrity proof rests on — so it relocated the defect rather than creating or
> fixing it. **In the archive the `##` entries are now siblings of the `## Archived <range>` headings**, so
> `## Archived 2026-08-16 → 2026-08-22` structurally appears to end at its first `##` entry. Nothing reads
> the archive's section structure, so nothing breaks today; the live-file risk below is unchanged and still
> the reason to fix it. **Do both files in one mechanical commit** (37 headings total), and prove it with a
> line-count-identical + entry-count-identical check, since a sorted-line diff cannot be used when the
> lines themselves are what changed.
>
> **PREMISE CORRECTION 2026-08-24 — measured before editing, and it changed the fix.** The counts were
> exact (6 + 31 = 37 `##`; the live `###` count had grown 3 → 12 as nine more runs landed, which is a
> stale snapshot, not a wrong claim). What the item got wrong is what the *target shape* is. Measuring
> each entry's **children** rather than only its own level showed two different conventions in the file:
> the 37 `##` entries were **correctly nested internally** (`## entry` > `### subsections`, 36 of 37),
> while the newer `###` entries recent runs wrote were **flat** (`### entry` > `### subsections`, all 12
> live ones). Demoting only the entry line, as the item said, would have converted 36 correctly-nested
> entries into flat ones — trading a top-level defect for a same-level one. **The fix therefore demoted
> the 37 entries AND every heading inside a dated entry in both files** (276 of them), so the whole run
> log is now uniformly `## Run log` > `### entry` > `#### subsection`. The 189 archived `###` entries
> were silent on the convention because 188 of them carry no subsections at all.
> **Method note for the next structural pass:** measure the *shape* (entry level **and** child levels),
> not just the level of the line the item names. A per-entry child-level tally is what exposed this;
> counting `^## ` alone cannot. Fence-awareness was checked too (0 headings inside code fences, fences
> balanced in both files) since the log is full of pasted output.
> ### W-5.4 (original text)
> **76 entries are `### 2026-08-…`; 37 are `## 2026-08-…`, every one of them since
> `## 2026-08-20 — the Sector screen's two "no data" states…`.** At `##` they are siblings of
> `## Run log`, `## Prioritized backlog` and `## Environment note` rather than children of the run
> log, so the file no longer has a table of contents that means anything. **This is exactly the defect
> class item 90 fixed in `LAUNCH_PLAN.md` two days later, in the same week.** Nothing breaks today —
> no script bounds the run log — but `check-backlog.mjs` finds the backlog section by scanning to the
> next `^## `, so a `##` entry that ever lands above the Environment note would silently truncate the
> check. **Fix: demote the 37 to `###` in one mechanical commit** (and use
> `s.replace(old, () => new)`, per the 2026-08-23 tooling note in this same file).
>
> ### W-5.5 — ✅ **DONE** (headline), by the item-93 runs. **The standing rule below is STANDING; leave it here.**
> Original: the item opened **"68 of 160"** against a measured **62**. Item 93's own runs adopted the rule
> and the headline now reads **54**, which is exactly what `npm run translation-completeness` reports.
> **Premise correction, 2026-08-23 (the W-5.6 run):** W-5.5 was still listed as open when this run picked
> its work, and it is not — but the *stop-line box* inside item 93 had drifted to **56** while the headline
> was correct at 54. The rule says "update the headline in the same commit"; the box is a second place and
> was not covered. **The rule now reads: re-read the count off the script and update BOTH the headline and
> the stop-line box.** See item 93's box for the note.
>
> ### W-5.6 — ✅ **DONE 2026-08-23** (scheduled dev-agent). `LAUNCH_READINESS.md` §10.4 now carries item 93's finding.
> **What shipped:** §10.4's closing clause no longer frames the five-language surface as "real ongoing
> maintenance debt … just a cost to keep tracking". It now carries the **per-language reference ratios**
> (p90 across all 40 lessons — `es 1.18, ko 0.55, zh 0.35, ja 0.50`), the **abridged-pair count**
> (**54** — es 12, ko 12, zh 12, ja 18, across 18 of 40 lessons), and the **concentration**, which is the
> part that makes the work schedulable: **48 of 54 pairs are on the optional `essentials` track**, `money`
> is **fully translated in all four languages**, and the only remaining `economy` main-path gap is
> **`ja` 35-40, six pairs**. The header's "Last refreshed" moved 2026-08-16 → 2026-08-23.
> **Premise correction that came out of re-measuring, and it is worth keeping:** this file's "How to
> refresh" section says the build fails if §10.4's character sentence disagrees with live content, and
> `check-data.mjs` §11b says character counts are *deliberately not guarded*. **Both are true and they are
> different guards** — `refresh-readiness.mjs --check` owns the character sentence, `check-data.mjs` §11b
> owns the coverage percentages and explicitly excludes char counts. Nothing is broken; the two comments
> read as contradictory only out of context.
> **Second correction, now recorded in §10.4 itself:** `refresh-readiness.mjs` and
> `translation-completeness.mjs` report **different English corpora — 137,249 vs 140,700 characters.** The
> gap is **exactly the section headings (3,451 en chars, proven by direct computation with a control)**:
> refresh-readiness counts bodies + takeaway + thinkAbout, completeness also counts headings. **The ratios
> survive it** (es 0.981 vs 0.985, ko 0.469 vs 0.470, zh 0.294 vs 0.295, ja 0.359 vs 0.361), so the two can
> be quoted in one row — but only because that was checked, and §10.4 now says so.
>
> ### W-5.6 (original text, retained)
> `LAUNCH_READINESS.md` §10.4 does not carry item 93's finding, and §10.4 is the row the owner reads.
> The scorecard header still says **"Last refreshed: 2026-08-16"** and §10.4 still frames the volume
> ratios as "real ongoing maintenance debt" with no per-language reference. **That framing is what
> item 93 disproved.** Against nothing, `zh` at 0.28× reads as Chinese being compact; against `zh`'s
> own fully-translated reference of **0.35×** it means a fifth of the content is absent. §10.4 also
> publishes one aggregate per language, which hides the fact that the shortfall is *concentrated* —
> and the concentration is the entire reason the work is schedulable. **Add the per-language
> reference ratios and the abridged-pair count to §10.4, and refresh the header.** Small, and it is
> the difference between a scorecard that tracks the launch and one that describes last week.
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

> **PRIORITY BLOCK — set by the weekly review 2026-08-16. This supersedes the 2026-08-09 block below,
> which is retained for history because its P-1/P-2/P-3/P-4 are all now closed. Read this first.**
>
> The 2026-08-09 freeze worked. Both §4.3 content clauses are met (40 lessons, 120/120 minutes), P-2/P-3/
> P-4 all closed, and the agent broadened correctly into structural work, test coverage, accessibility and
> owner-directed UX. This block is not a correction of direction — it fixes three process faults that
> showed up in the last 48 hours of an otherwise strong week.
>
> **W-1. PRIORITY — browser verification is available to scheduled runs. Use it on every UI change.**
> This is the most important item in this block because it is a *regression in what the agent knows about
> its own environment*, and it silently degraded the verification standard of six shipped UI features.
> Timeline: the 2026-08-15 tenth run explicitly tested the "preview_start is disabled for scheduled tasks"
> assumption, **disproved it**, did the first live keyboard/DOM verification ever done by an automated run,
> and wrote it up. One day later the 2026-08-16 **ninth** run wrote "`preview_start` is unavailable to
> unattended scheduled runs in this environment" and deferred verification to "a future *interactive*
> session"; the **tenth** run repeated the same claim. Both are false. **The weekly reviewer re-proved it
> this run** (2026-08-16): built `dist/`, served it with `/usr/bin/python3 -m http.server`, called
> `preview_start` with a plain `url`, and drove the live app via `javascript_tool` — see the Environment
> note, whose documented technique works verbatim. What that verification found is in the review report;
> in short, the features work.
> **Rule going forward: a run that changes rendered UI must either verify it in a live browser using the
> Environment note's technique, or state specifically what it tried and what error it got — not assert a
> capability limit from memory.** The Environment note has been updated so this finding stops being lost.
> **Also do**: the six UI features shipped 2026-08-15/16 (coach mark, glossary example sentences, Practice
> review-batch interstitial, term-detail screen, bookmark toggle, glossary no-results fix) were shipped
> without rendered verification. The reviewer verified the term-detail screen, the bookmark toggle and its
> persistence, the no-results empty state, and TermDetail's focus-on-open. ~~Still unverified: the Practice
> review-batch interstitial's focus management and the one-time Practice coach mark~~ **✅ VERIFIED
> 2026-08-16 (twelfth run this date, live browser).** Both work correctly as built; no bug found. See run
> log for full detail.
>
> **W-2. ✅ REFILL DONE 2026-08-16 (owner-requested, weekly reviewer) — six new items, 27–32, derived
> from the launch plan and listed above items 24/17. The standing rule below still applies.**
> **What was added and why it is not more of the same:** each item names the §-clause it serves and was
> checked against the actual `src/` tree, not proposed from a note. The two sharpest findings, both
> measured rather than asserted: **money 0/28 lessons have a visual** while economy has 5/12 — so the
> "animated diagrams are the differentiator" claim (§3.0.4) is currently carried entirely by the track
> §0 calls "the vehicle, not the product," and a new install opens on money lesson 1, which has none
> (item 27) — and **the app has no routing at all**, so §5's "each lesson a shareable URL" web-funnel
> requirement has nothing to point at (item 31, scoped to respect item 12's port-cost rule). Also added:
> glossary linking from lesson text, which §3.0.3 requires and which this week's term-detail screen
> finally makes worth building (28); the §9.2 event payloads, which are **the half of item 18 that is not
> owner-blocked** (29); the §9.1 falsifiable-claims register, the plan's core discipline and the one this
> project's recurring drift keeps violating (30); and the §9.3 monthly audit, which has never been run
> (32). **Nothing in 27–32 is owner-blocked.**
>
> **W-2 standing rule — refill the backlog rather than extending a note chain.**
> Seven of the last eight runs picked their work from the previous run's "Next run should pick" line rather
> than from this backlog. That chain has produced good work, but it is the same structural failure the
> 2026-08-09 block named in a different costume: the *backlog* stopped being the place direction lives.
> The evidence is that this Open section currently lists only items 24, 17, 21 and 18 — and 17 and 24 are
> self-declared exhausted, 21 is closed on both its axes, and 18 is owner-blocked. Two recent entries say
> "remaining dev-agent-actionable areas are thin," which is a symptom of an unrefilled backlog, not of a
> finished product. **The owner-directed Quizlet/Vocabulary design-review stream was never entered here as
> an item at all** despite driving six commits — it is now item 26 below.
> A run that finds nothing to pick should **write backlog items** (re-read `LAUNCH_PLAN.md` §4.3/§5/§9 and
> propose Phase-0-facing work) rather than extend a note chain. That is a legitimate, valuable run.
>
> **W-3. Archive the run log. ✅ FULLY DONE 2026-08-16 (owner-requested, weekly reviewer) — both
> halves. Nothing left to pick here.**
> Each of the 17 lesson-deepening runs wrote ~110 lines of log for a one-paragraph content change; the
> file had roughly tripled in a week to 909 KB / 9,814 lines, of which the run log was ~93% — a cost paid
> by every run, since each one reads this file to orient.
> **Done:** run-log entries from 2026-08-01 → 2026-08-08 moved verbatim to
> [`AGENT_LOG.archive.md`](AGENT_LOG.archive.md) (4,348 lines / 395 KB, the first 21 runs plus three
> weekly reviews), with a pointer left at the top of the Run log section below. `AGENT_LOG.md` is now
> **5,497 lines / 516 KB, a 43% cut**. Nothing was deleted or edited: entry count reconciles 125 = 125
> against the pre-split file, and a sorted line-by-line diff of all run-log content before vs. after came
> back identical. The cut lands on the previous weekly-review boundary, so one full review period stays
> live. **The archiving rule for future reviews is stated at the top of the archive file** — each Sunday,
> move entries older than the *previous* review boundary across, appending under a new `## Archived
> <range>` heading. A dev-agent run should not need to do this; it is weekly-reviewer work.
> **Also done (second half):** items **17 and 24 compressed** the same day, from 63 and ~80 lines down to
> 27 and 39 — each now states its current status, its standing guidance, and a pointer to the run log,
> instead of carrying a dozen accreted "Update, `<date>`" paragraphs. What was deliberately **kept**:
> item 24's verbatim owner intent (the "wise rather than impulsive" quote) and its full §10.1 tension
> guidance, both load-bearing; item 17's reproducible measurement method, its `lessonContent.money`
> chunk-size caution, and both items' failure-mode warnings. What was **dropped**: the seventeen-run
> deepening chronology and the eighteen `LAUNCH_READINESS.md` refresh notes — history, and still in the
> run log. Two staleness bugs were fixed in passing: item 17's "118/120 minutes" figure (the clause
> closed at 120/120 on 2026-08-15), and **item 24's lesson-id references, which predated the 2026-08-14
> renumbering and were simply wrong** — it cited "lessons 13-27" for mechanics and "28-36" for judgment,
> when money is now 1-28 (mechanics **1–15**, judgment **16–28**). Both items now warn that ids quoted in
> pre-2026-08-14 run-log entries are stale and that `src/content/lessons.js` is the source of truth.
> Backlog section: 142 lines → 66. `AGENT_LOG.md` overall: 909 KB → 515 KB.
>
> **W-4. Small correctness/a11y cleanups found by this review and by recent runs' own notes.**
> Low-risk, well-scoped, good picks for a run with no larger item:
> - ~~Two `<h1>`s on the Glossary term-detail screen.~~ **✅ DONE 2026-08-16 (eleventh run this date).**
>   See run log.
> - ~~Glossary rows are `role="button"` with an `aria-label` of only the term name, so the definition
>   text inside each row may not be announced.~~ **✅ DONE 2026-08-16 — the "check it" came back
>   CONFIRMED, not a false alarm.** Verified in a live browser against the accessibility tree (not by
>   reading the code): each row exposed only its term as its accessible name, and removing the
>   `aria-label` in the live DOM made the definition and example text appear — proving the label was
>   suppressing them. Fixed with `aria-describedby` pointing at the row's own `<dd>`s. See run log.
> - ~~`TermDetail`'s bookmark control described as a "persistent action bar" but coded as a normal
>   in-flow `Button`.~~ **✅ DONE 2026-08-16.** Reworded `src/screens/reference/TermDetail.jsx`'s header
>   comment to describe the button accurately (in-flow, full-width, not sticky/fixed) rather than making it
>   sticky — see run log for why sticky was rejected (no existing per-screen sticky-bar precedent, and it
>   would need z-index/safe-area coordination with `App.jsx`'s fixed bottom nav).
> - ~~`MarketSignals.jsx`'s dead `counterReset: "principle"`~~ **✅ DONE 2026-08-16 — W-4 IS NOW FULLY
>   CLOSED, and so is the entire 2026-08-16 weekly-review block (W-1, W-2, W-3, W-4).** Confirmed inert in
>   a live browser before deleting (`counterReset: "principle 0"` with `counterIncrement: none` and
>   `::before` content `none`), and the rendered list was byte-identical afterward. See run log — it also
>   records an adjacent question this run deliberately did **not** decide (the list is an `<ol>` whose
>   content is unordered), left as item 40 below (filed as 33, then 34, renumbered to 40 on 2026-08-16
>   to resolve a collision with the policy-simulator item 34 — see that item's own note).
> - ~~`Settings.jsx`'s `ChoiceRow` radiogroup using Tab-per-option rather than the ARIA APG
>   roving-tabindex pattern.~~ **✅ DONE 2026-08-16.** Confirmed live before fixing (all 7 radios were tab
>   stops; arrow keys did nothing), then implemented roving tabindex + arrow/Home/End selection. See run
>   log.
> - ~~Item 17's stale "118/120 minutes" figure.~~ **✅ DONE 2026-08-16** as part of W-3's item-17
>   compression, along with item 24's pre-renumbering lesson-id references, which were also wrong.
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
    re-deriving.** `LAUNCH_PLAN.md`'s eight live catalog figures are generated now, §4.3's gate
    verdict included, and §2.5's ids are fixed. See the run log entry of this date. **[Process/Docs —
    was P1 of this refill. The same class item 47 killed, one document over, and this
    one changes what a reader believes about a gate.] `LAUNCH_PLAN.md`'s live figures are stale, and
    its curriculum table names lesson ids that were abandoned three days ago.** Measured against the
    tree, not read off the page:
    - **§2.5's track table is wrong on both rows.** It says Your Money = `13-26 (14)` and How the
      Economy Works = `1-12 (12)`. Actual: **money = 1–28 (28)**, **economy = 29–40 (12)**. The ids
      predate the 2026-08-14 renumbering — the exact defect items 33 and 36 spent four passes chasing
      through lesson prose and quiz explanations, sitting untouched in the section that *defines the
      curriculum* and tells a run "when adding a lesson, declare its `track`."
    - **§4.0 states "12 lessons, ~10,900 characters of English body text, ~12 minutes"** against an
      actual **40 / 136,031 / 120**. The same sentence ends "count it again rather than trusting this
      line," which is item 39's lesson written down and then not followed — by the document that
      wrote it.
    - **§4.3 says "the gate is not close: 12 minutes is not 2 hours."** `LAUNCH_READINESS.md` says both
      §4.3 content clauses are **met** (120/120 since 2026-08-15). **Two authoritative documents
      disagree about whether a Phase-0 gate is cleared** — that is not a stale number, it is a wrong
      answer to the only question the plan exists to answer.
    - Also stale, same cause: §3.1's "the twelve lessons in order", §3.2's "progress ring at 1/12",
      §4.0's asset table and §4.2's "not the 12 lessons".
    - **Scope:** extend `scripts/refresh-readiness.mjs` to generate `LAUNCH_PLAN.md`'s catalog
      figures as well (it already computes every one of them — the guarded-sentence list is data, and
      this is one more entry), and fix §2.5's ids by hand. **Do not** try to generate the prose
      arguments around the figures; §4.1/§4.2's reasoning about *finite content* is judgment that
      happens to cite a number, and rewriting it is an owner call, not a regeneration. Flag it and
      leave it.
    > **What the doing changed about the scope, 2026-08-17.** §2.5's ids were *generated*, not fixed by
    > hand — a hand fix is the thing that rotted. The generator refuses to write a range at all if a
    > track's ids stop being contiguous, since "1–28 (27)" is worse than no figure. §4.1/§4.2 were left
    > alone as instructed, but the three stale counts *inside* their sentences were **deleted rather
    > than guarded** ("a finite 12-minute course" → "a finite course"): the cheapest permanent fix for
    > a figure the argument doesn't need is to remove it, and that keeps the generated set small, which
    > is this script's own stated scope rule.

56. **✅ DONE 2026-08-17 (owner-directed pick). Pruned below as `former item 56` — but read the
    correction first, because this item's premise was false and its evidence was an artifact.**
    **The premise "nothing checks it" was wrong**: `check-data.mjs` §2 has enforced
    `minutes === round(bodyWords/200)` since before the 2026-08-07 split, all 40 lessons satisfied it,
    and an injection test confirmed the check bites. **The evidence was two artifacts stacked**: a
    `chars / 5.5` word proxy (the real ratio is 5.77, inflating every lesson ~5%) read on top of
    ordinary rounding — a lesson stated as 2 minutes legitimately covers [1.5, 2.5), so a 1.25x ratio
    means nothing is wrong. The direction word was backwards too: those six lessons take *longer*
    than stated, which understates. **What was really wrong is what the item told the run to decide** —
    the model. It counted section bodies, takeaway and thinkAbout, and omitted the title, subtitle,
    section headings and **the entire end-of-lesson check**: 5,807 of 29,385 words, ~20% of what the
    reader sees. Fixed, all 40 lessons recalibrated (23 moved, all up), catalog 120 → 144 min. See
    `DECISIONS.md` and the run log. **[Content/Process — was P2.] Nothing checks that a lesson's
    stated `minutes` is honest, and §4.3's content gate is
    computed by summing exactly that unvalidated field.** §3.0.5 requires "an honest minutes
    estimate"; the figure is shown to learners twice (`src/screens/Learn.jsx:154`,
    `src/screens/LessonReader.jsx:218`) and summed by `refresh-readiness.mjs` into the 120 minutes
    that closed §4.3's second clause. Measured at 200 wpm / 5.5 chars per word: **6 of 40 lessons
    overstate by more than 15%** — worst is lesson 10 at **1.31x** (2 stated, ~2.6 actual), then
    lessons 8 and 34 at ~1.24x. Lesson 1 is fine (3 stated, ~2.7 actual), so §3.0.5's "under four
    minutes" clause holds.
    > **Decide the model before touching a number.** 200 wpm and 5.5 chars/word are *my* assumptions,
    > and the honest first half of this item is choosing a defensible reading rate for plain-language
    > financial content and writing down why — a slower rate would flag more lessons, a faster one
    > none. Changing 6 lesson `minutes` values also moves the 120-minute total that a §4.3 clause is
    > currently reported as meeting, so this item can *reopen a closed gate*. That is the right
    > outcome if the estimates are wrong, and it is exactly the kind of thing to state out loud in the
    > run entry rather than discover afterwards.

57. **✅ DONE 2026-08-17 (scheduled dev-agent). Pruned below as `former item 57` — but the premise was
    wrong for the third item running, and how it was wrong is the part worth keeping.** All 11
    occurrences this item named are **deliberate exclusions that `lessonTerms.js`'s header documents by
    lesson id** (rule 2: the lesson *is* the definition, so §3.0.3's first branch holds; rule 1: "credit
    card"/"credit score" is not the macro aggregate). The item also **could not see the real gap by
    construction** — it scanned only the 18 *uncurated* lessons, and the one genuine unaccounted-for use
    was inside a *curated* one: lesson 36 §1's "credit data", now chipped. Wider re-measurement found 77
    glossary-term uses, 34 unlinked, 33 of them correct. The fix that matters is that curation rules 1
    and 2 are now **data** (`deliberatelyUnlinked`, 33 entries) enforced by `check-data.mjs` **§17b**, so
    "unlinked" can no longer be mistaken for "undefined". See the run log entry of this date.
    > **Standing note for whoever measures this surface again.** §17b sweeps only the **29 keys in
    > glossary.js**. "0 unexplained" therefore means every *glossary term* is accounted for, **not** that
    > §3.0.3 is satisfied — jargon with no glossary entry is invisible to it. That residual is item 60.
    <details><summary>Original text of item 57, as filed 2026-08-17</summary>

    **[Content — P3. Small, bounded, and the measurement has a control.] §3.0.3's no-undefined-jargon
    rule: 7 lessons use a glossary term in prose with no link to it.** §3.0.3 says a term "either gets
    defined where it appears or links to the glossary." `src/content/lessonTerms.js` curates links for
    **22 of 40** lessons. Of the 18 uncurated, **7 use a glossary term verbatim in their English body,
    11 occurrences total**: lesson 39 (5 — Consumer Price Index, Purchasing Managers' Index,
    Inflation, Recession), lessons 30/4/15 (Credit), 37 (Quantitative Easing), 5 (Diversification), 8
    (Deductible). The other 11 uncurated lessons use no glossary term at all and need nothing.
    > **The control matters here and is why this number is trustworthy.** The first run of this
    > measurement returned **0** — glossary entries key the term name at `en.s`, not `term.en`, so the
    > matcher was comparing objects and matching nothing. Caught by asserting a *linked* lesson shows
    > hits (lesson 2 → Credit, Emergency Fund, Insurance Premium) before believing the zero. Re-run
    > this control if you re-measure.
    </details>

58. **✅ DONE 2026-08-17 (scheduled dev-agent). The sweep ran; 13 contradictions are listed with
    file:line in the run entry of this date, and the fixes are filed as item 61.** Two things this
    item predicted turned out wrong, both worth not re-deriving. **(a) "Some of them owner calls" —
    none are.** 9 are mechanical (make the doc match the measured tree), 4 are judgment, 0 need the
    owner. **(b) The `measured 20`/`as of 20` grep it prescribed found nothing.** Its one same-day
    annotation (`src/content/lessonTerms.js:52`) recomputed *correct* at 44/22/13/9 — the
    stale-on-arrival pattern is real history but did not recur, so don't re-run that grep expecting a
    hit. The sharpest finding was **not** either of the two this item pre-named: it is
    `LAUNCH_PLAN.md:568`, where **§10.1 — a standing rule the adversarial self-check tells every run
    to check against — names two screens deleted in the 2026-08-04 rebuild**, so the check cannot be
    performed as written. One candidate was measured and **rejected** (§4.3's "Analytics live" is in
    the table's *Ship* column, a requirement, not a status claim). See the run log entry of this date.
    **[Process — was P4. The generalization of the finding that closed item 49.] Read `LAUNCH_PLAN.md`
    and `DECISIONS.md` end to end against the current tree, and record every claim that no longer
    holds.** `README.md` carried a §10.2 violation in its opening sentence for sixteen days while the
    register said "✅ Closed", because the check that certified it scanned `src/` and the v5 prototype
    — the two places the rule was already obeyed. It was found sideways, by putting README under an
    unrelated *path* check. Item 55 is the figures half of the same problem in `LAUNCH_PLAN.md`;
    this is the rest: prose claims, status lines, and "shipped"/"done" annotations that no script can
    check. §10.7 already asks for exactly this ("reconcile this file at each monthly audit"), and
    §9.3's audit has never run. **Bounded deliverable:** a list of contradictions with file:line, in
    the run entry — not a rewrite. Fixing them is a separate decision per item, some of them owner
    calls.
    > **Two entries for the list, found while doing item 55 (2026-08-17) and deliberately not fixed
    > there** — item 55's remit was figures, and neither of these is one:
    > - `LAUNCH_PLAN.md` §3.2 promises a **progress ring**; the app renders a progress **bar**
    >   (`src/components/ui.jsx`'s `ProgressBar`, `role="progressbar"`, confirmed live in a browser
    >   that run). Which one is wrong — the design intent or the implementation — is a judgment call.
    > - §3.1's IA table describes Learn as one ordered list of lessons; since §2.5 it is two tracks,
    >   grouped. Reworded there to "both tracks' lessons in order", but §3.1's surrounding argument
    >   still reasons about a single chain.
    > Item 55 also demonstrated the cheapest disposition for a third class: a stale count inside an
    > argument that doesn't need it should be **deleted**, not corrected and not guarded.
    > **A fourth entry, and a pattern, from item 57 (2026-08-17).** `src/content/lessonTerms.js`'s
    > header claimed "COVERAGE, measured 2026-08-16: 21 links across 10 lessons — 9 economy, 1 money"
    > and then spent four lines explaining a lopsidedness that had already gone: the figure was written
    > *earlier the same day* as the item-35 expansion listed directly beneath it, so it was stale on
    > arrival. Fixed in that run (44 chips / 22 lessons, now pointing at §17b's generated output rather
    > than restating it). **The transferable pattern for this item's sweep: a "measured `<date>`"
    > annotation is least trustworthy when its date matches the change it sits above** — same-day
    > figures are written before the day's work finishes. Grep for `measured 20` and `as of 20` in
    > `src/` and `scripts/`, not just in the Markdown docs.

59. **✅ DONE 2026-08-17 (scheduled dev-agent). `check-data.mjs` §28 now asserts AA on 108 pairs
    (54 per palette) every `npm test`, and the note's own figures are machine-checked. For the fifth
    item running the premise was partly wrong, and this time it was the half that named a defect.**
    **The "note that does not exist" exists**, and has since the 2026-08-04 rebuild (`79d9507`,
    `src/index.css:14`–`17`) — thirteen days before the item was filed. What was true is the part the
    item ranked as background: nothing performed the verification, and **two of the note's three
    figures had drifted from the palette** — light worst case stated 4.72:1, actual **4.62:1**; the
    rejected white-on-dark-accent option stated 4.35:1, actual **2.16:1**. Both were stale in the
    optimistic direction, which is the direction a contrast note is least useful being wrong in.
    Contrast itself was fine: **0 violations**, as the item said. See the run log entry of this date.
    > **Two things worth not re-deriving.** (a) The pair set is **derived by prefix, not listed** —
    > affordable only because the full cartesian product passes, so nothing needs exempting; if a
    > future palette edit makes one pair fail, resist adding an exemption list, because that is the
    > hand-maintained shape F10 was filed against. (b) `--ink-on-fill` must stay out of the ink list:
    > it is `#ffffff` in light mode, so pairing it with `--surface-canvas` manufactures a 1.0:1
    > failure for a pair the app never renders.

63. **✅ DONE 2026-08-17 (scheduled dev-agent). Light `--graph-neutral` is `#7c8494`, the four uses are
    classified, and `check-data.mjs` §28b enforces 3:1 on 70 graph×surface pairs. For the ninth item
    running the premise was partly wrong — and this time BOTH of its headline numbers were, in the
    direction that had made the item look optional.** (a) **"5 of 7 surfaces" was 7 of 7.** The two it
    omitted are `--surface-canvas` (2.48) and **`--surface-card` (2.57) — and card is the surface every
    chart figure in `charts.jsx` actually renders on**, so the one pair that was certainly rendered was
    the one missing from the measurement that deferred the fix. (b) **"Only `--graph-neutral` is
    affected" is false**: light `--graph-amber` is also under 3:1 on three surfaces (sunken 2.92,
    accent-wash 2.85, bad-wash 2.91). That one is *not* rendered — no chart is drawn on a wash — so it
    is exempted with its measured ratios and filed as **item 65** rather than fixed by darkening a
    second color on the way past. The item's suggested `#7c8494` was checked and adopted: 3.76:1 on
    card, 3.36:1 worst across all seven surfaces. See the run log entry of this date.
    <details><summary>Original text of item 63, as filed 2026-08-17</summary>

    **[A11y — the non-text half §28 deliberately did not decide, filed 2026-08-17 by the run that
    closed item 59. Measured, not suspected.] `--graph-neutral` is under WCAG 1.4.11's 3:1 in the
    light palette against 5 of 7 surfaces** — worst **2.30:1** on `--surface-accent-wash`, then 2.35
    (bad-wash), 2.36 (sunken), 2.44 (ok-wash), 2.48 (warn-wash). Only `--graph-neutral` is affected;
    every other graph color clears 3:1 in both palettes, and the **dark palette has 0 pairs under
    3:1** (worst 3.27).
    - **Why §28 excluded it rather than folded it in.** 1.4.11 applies to graphical objects "required
      to understand the content". A neutral gridline or axis is plausibly decorative and exempt; a
      neutral *series* stroke that a reader must distinguish is not. `theme.js` asserts the 3:1 bar
      for this token group, so the app already claims the stricter reading — but which rendered
      strokes actually use `--graph-neutral` is a question about `src/components/charts.jsx`, not
      about the palette, and answering it is judgment. Encoding a guess as an assertion is how a check
      freezes a miscount (item 61's F7).
    - **Scope:** find every `graph.neutral` use in `charts.jsx` and `LessonVisual.jsx`, classify each
      as meaningful or decorative, then either darken the light token (it is `#9aa2b1`; reaching 3:1
      on `--surface-accent-wash` needs roughly `#7c8494`) or record the decorative exemption in
      `theme.js` next to the "3:1 is the bar" line that currently overclaims. **A palette change here
      moves §28's numbers** — the CONTRAST note's figures are asserted, so update them in the same
      change or `npm test` fails, which is the intended behavior and not a bug.
    - **Honest priority: low, and lower than item 60.** No text is affected, so §3.0.7 is untouched;
      this is a stricter reading of a rule the app volunteered.
    </details>

72. **🟡 DEV-AGENT HALF DONE 2026-08-17 (scheduled dev-agent). The build is deployable and the
    clicks are written down; the OWNER HALF — choose a host, drag the folder, hold the URL — is the
    only thing left and it cannot be done from here. Keep flagging it in every run's output until it
    moves, alongside item 18. Do not re-pick this item to "improve" the deploy docs; the refuting
    number is a URL, and no amount of further writing produces one.**
    - **What shipped:** `vite.config.js` gains `base: "./"`, so one `dist/` works at a domain root
      *and* one directory down without being rebuilt; `README.md` gains a `## Deploying` section with
      the two paths (Netlify Drop for a URL in minutes, GitHub/Cloudflare/Netlify-from-repo for a
      durable one), the note that **no host needs an SPA rewrite rule** because routing is hash-based,
      and the two things that stay open after a deploy (frozen market data → item 74; no analytics
      provider → item 18). Verified against a real static server at both shapes — see the run-log entry.
    - **The defect this closed was real and silent**, which is why it survived: served at `/app/`, the
      pre-fix build returned **200 for the HTML and 404 for its entry script**, rendering an empty
      `#root` **with no console error**, because a 404 on a `type="module"` script does not throw into
      the page. `src/lib/useMarketData.js`'s own comment already said "relative to the deployed base so
      it works under a sub-path too" — the app believed it was sub-path safe and the build was not.
    - **Original filing, kept because its framing is the point.** Nothing owns "get this in front of
      one person."** Item 18 (an
    analytics provider account and key) is named in every run's output as the entire critical path out
    of Phase 0, and that is correct — but **item 18 is downstream of a deploy, and no backlog item owns
    the deploy.** Measured, not assumed: no `.github/`, no `netlify.toml`, no `vercel.json`, no `CNAME`;
    `dist/` is gitignored (`.gitignore:2`); `src/lib/analytics.js`'s own header states there is no
    provider or backend and `sink()` writes to `localStorage` on one device.
    - **Why this is not a restatement of item 18.** Item 18 is owner-blocked (it needs an account and a
      key). **A static build served at a URL is not owner-blocked** — §2.1's held Expo-vs-Vite decision
      (item 12) blocks the *store*, not the web funnel, and `DECISIONS.md` already records Vite. `C2`
      in `CLAIMS.md` says the build gap closed on 2026-08-16 (every lesson has a hash URL, no lesson
      needs a signup); what is missing is somewhere to point at.
    - **The honest refuting number is trivial and that is the point:** one reachable URL, or one person
      who has opened the app. The project has 40 lessons, 5 languages, 8 check scripts and a claims
      register, and **zero people have ever opened it**.
    - **Scope, and the trap.** Do *not* let this become another instrument. The deliverable is a
      deploy path and a URL, not a script that checks whether a deploy path exists. **Some of it is
      genuinely an owner action** (choosing a host, holding the account) — so the dev-agent half is:
      make the build deployable as a static artifact, write down exactly what the owner must click, and
      say so in the run output. Flag the owner half in every run until it moves, alongside item 18.
    - Also filed for §10 as **B-3** in `reviews/2026-08-17-monthly-audit.md`.

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

73. **✅ DONE 2026-08-20 (scheduled dev-agent). Both halves landed in one commit the moment the
    owner's tree went clean, exactly as this item predicted — and for the eleventh item running a
    premise broke, this time inside a wording the item told the run to move VERBATIM.**
    **B-1's refuting number was measured against the wrong denominator.** It read "5× `src/` churn";
    the finding it encodes is against `src/` **application code**, the row the audit's own §1 table
    separates from content and locales. Against all of `src/` the ratio is **1.25× in the audit's own
    window and 1.08× today** — the tripwire would have read "not refuted" in the window that produced
    the finding. Against application code it is 10.2× then and **7.56× now**. Moved with the sentences
    verbatim and only the denominator clause corrected, annotated in place. B-2 verbatim, B-3 with the
    item-72 clause folded in as instructed. Now `LAUNCH_PLAN.md` §10.8/10.9/10.10; D3 is `CLAIMS.md`
    row 16 and §9.1 says "16 claims". See the run log entry of this date.
    **[Process — filed 2026-08-17 by §9.3's first monthly audit, which deliberately proposed rather
    than applied these.] Apply the audit's three §10 blindspots and its proposed claim D3.** Both halves
    are written out verbatim and ready to move; neither was applied, for two different reasons that
    should not be collapsed:
    - **⚠️ Re-verified 2026-08-18 (scheduled dev-agent) — this item's own "verbatim, do not paraphrase"
      instructions had already rotted in two places, one in each half. Answering the seventh/eighth
      run's own "Next run" note, which asked whoever finds `LAUNCH_PLAN.md` still dirty to check
      whether *other* queued "apply this saved instruction blind" items had the same failure item 64's
      `Dividend` did (that run's commit `8a1ad5a` found a whole-file scratchpad copy would have silently
      reverted items 67/69). Item 73 is not that shape — nothing here is a stale content copy — but it
      has the *smaller* version of the same disease: a specific location cited once, trusted forever.**
      - **(1) The D3 unblock's line citation is now wrong.** `LAUNCH_PLAN.md:529` was correct
        2026-08-17; as of this run the "It holds all 15 claims" sentence is at line **549** (confirmed
        three consecutive times a second apart by `grep -n` for the sentence text, not by trusting the
        old number, and deliberately **not** re-cited as a new fixed line below — the owner's tree is
        still being edited live and the point being made is that any specific line number is a snapshot,
        not a fact). Twenty lines drifted in one day of unrelated owner edits landing above it. A run
        that ran `sed -i '529s/15/16/'` (or any line-targeted edit) without re-locating the text first
        would have silently corrupted an unrelated sentence — and this item's *own text*, two bullets
        below, already names this exact failure mode ("this run measured three line numbers, pasted
        them, and then watched its own edit to this item move all three") without noticing it had just
        done the same thing to itself two
        bullets up. **Fixed below: the instruction now names the sentence, not a line number.**
      - **(2) B-3 was already false when it was written, and pasting it verbatim would publish a
        refuted claim.** B-3 states "nothing owns 'get this in front of one person' ... no backlog item
        owns the deploy," timestamped *found 2026-08-17* in the audit (`reviews/2026-08-17-monthly-
        audit.md:204`). `git log` shows item 72 — "the build is deployable and the clicks are written
        down," which is exactly the gap B-3 names — was committed `e53cc81` at **2026-08-17T20:15:09**,
        while the audit's own commit (`58db0e1`) landed at **20:00:44**: **item 72 existed 15 minutes
        after B-3 was written.** B-1 and B-2 were left unre-measured on purpose: both carry their own
        future check dates (2026-09-05, 2026-10-03) and are time-delayed claims by design, not
        current-state assertions — re-measuring them early would be answering a question that hasn't
        been asked yet. B-3 has no such framing; it asserts a present-tense fact, and the fact was
        already wrong. **B-3's wording needs one clause before it can move verbatim — see below; B-1/
        B-2 are unchanged and still move as written on their own check dates.**
    - **The three §10 blindspots (B-1 process mass, B-2 the locales held by sunk cost, B-3 the deploy
      gap, corrected above) are BLOCKED** on `LAUNCH_PLAN.md` being owner-clean — §10 lives there and
      the owner's UIUX redesign has it dirty. They are in §10's own register format in the audit's §6,
      each with a refuting number and a check date. **Move B-1 and B-2 across verbatim — the wording is
      the finding. Move B-3 with the correction above folded in** (e.g. append: "— though item 72,
      filed the same day 15 minutes after this was written, now owns the deploy half; what remains
      unowned is only the click-through, which item 72 already names as owner-only").
    - **D3 was decided on the merits 2026-08-17 by a run other than the audit's author, as this item
      asked. The verdict is ADD IT — but "D3 is NOT blocked" was wrong, and D3 is BLOCKED on the same
      owner-dirty file as the §10 half.** `scripts/check-claims.mjs` cross-checks the register's row
      count against `LAUNCH_PLAN.md` §9.1's hand-written "It holds all 15 claims" sentence. Adding any
      sixteenth row fails `npm test` — proved by injection, not reasoned:
      `FAIL: LAUNCH_PLAN.md §9.1 says "It holds all 15 claims" but CLAIMS.md has 16. Replace "15
      claims" with "16 claims".` The fix the check demands is *in the owner's dirty file*, so the row
      cannot land until the redesign is committed. **Both halves of this item are blocked, on one file,
      for one reason.**
    - **The unblock is two edits and needs no re-derivation — find each by its text, not by a line
      number that will have moved again by the time this unblocks.** (a) paste the staged row below
      into `CLAIMS.md`'s §D table; (b) in `LAUNCH_PLAN.md`, find the sentence beginning "It holds all"
      under §9.1 and change `15 claims` → `16 claims`. Then `npm test`. Nothing else moves. **Verified
      2026-08-18 that the staged row still fits: `CLAIMS.md`'s §D table header and both existing rows
      (D1, D2) are unchanged since the audit, 15 total claim rows currently, and the row below adds the
      16th the sentence above needs to say.**
    - **Staged D3 row, verbatim — do not paraphrase, and note the status is stronger than the audit's:**
      > `| D3 | A backlog item's premise can be trusted well enough to implement without re-measuring. |
      > Any filed item's headline number is corrected on execution. | 2026-09-05 | **Yes** |
      > **REFUTED — nine consecutive times (items 55→63), and three more times since the audit proposed
      > this row: item 72 ("worse than filed"), item 62's F11 ("re-measuring found twice what F11
      > filed"), and item 73 itself — whose own "D3 is NOT blocked" premise was false.** |`
    - **The product change §9.1 forces, and it is not a new instrument.** The three most recent items
      that re-measured *before* editing (64's APR half, F11, 72) all found their premise wrong and it
      cost nothing — the error was caught while it was still free. So the change is not "file better
      premises" (nine runs' evidence says nobody can); it is **re-measure the premise, with a control,
      before editing anything** — an explicit step, the way the adversarial self-check became step 5
      after D1. **Its enforcement home is the dev-agent task file, which is the owner's and outside this
      repo**; flag it to them rather than assuming a rule written here is a rule that runs.
      > **✅ THE ENFORCEMENT HOME NOW EXISTS — 2026-08-17, owner-directed, done by the owner's own
      > session.** The dev-agent task file has a new **step 3.5, "Re-measure the item's premise, with a
      > control, before you edit anything — mandatory"**, sitting between "pick the item" (3) and
      > "implement it" (4). It carries the ten-item streak, the two cases where re-measuring changed the
      > *disposition* rather than a figure (65 and 75), the carry-a-control rule with the dark-mode DOM
      > scan as its worked example, and the instruction to re-decide the item on corrected facts rather
      > than treat a broken premise as a blocked run. **Numbered 3.5 deliberately, not by renumbering
      > 4–7:** "step 5" means the adversarial self-check in dozens of entries below, and renumbering
      > would have falsified every one of them. **This does NOT unblock the D3 claims-register row** —
      > that is a different artifact, it still moves `LAUNCH_PLAN.md` §1's gated claim count, and
      > `LAUNCH_PLAN.md` is still owner-dirty. The rule now runs; the claim that measures whether it
      > works is still staged. **Stop flagging the task-file half to the owner in run output.**
    - **How to measure D3 on its 2026-09-05 check date — read this first, because the obvious method
      under-counts.** The premise verdicts are **not** all in run-log entries: most of the nine streak
      verdicts live in *backlog item text*. Grep this file for the phrase `item running` — the backlog
      section carries the majority of the hits and the run log only one. A matcher scanning only the
      `## Run log` section returns **7 of 19 entries**; this run wrote exactly that matcher first and it
      under-counted, which is D2's failure shape one document over. **What it missed, and why, because
      the near-misses are the instructive part:** items 55, 57 and 62's F4 all state the error in their
      own entries in wording the pattern did not cover (*"also wrong in a way no number captures"*,
      *"But item 57's numbers were wrong"*, and *"Six items running"* — plural, against a pattern
      matching `item running`). Item 66 is different and worse: its run-log entry contains the word
      "premise" **zero times**, and its verdict exists only in the backlog. Cited by phrase rather than by `file:line` on purpose — this run measured three line numbers,
      pasted them, and then watched its own edit to this item move all three.
      **Control, because a near-zero result here is more likely to be a broken matcher than a fixed
      process:** any method must flag item 63's entry (*"wrong twice, for the ninth item running"*) as a
      positive and item 64's APR entry (*"breaking a nine-item streak — both held exactly"*) as a
      negative before its count is worth anything.
    - **Honest priority: medium, and both halves unblock together the moment the owner's tree is clean.**
      Whoever picks it up gets both for one `npm test`.

77. **✅ DONE 2026-08-19/20 by the owner's own commit `5633b79` ("Split essentials track out of
    money; register it in readiness figures"), NOT by a dev-agent run — which is why it was still
    sitting here marked blocked. Confirmed by measurement this run, not by reading the commit
    subject:** `§2.5` now carries all three track rows (`essentials` 1–15, `money` 16–28, `economy`
    29–40) with Role prose matching each row's own range, `LAUNCH_READINESS.md` §4.3 reads "split
    across **money (13)** + **economy (12)** + **essentials (15)** tracks", and `npm test` is green
    including `refresh-readiness.mjs --check`. Marked closed here so no future run re-picks it.
    **[Process/Docs — filed 2026-08-18 by the run that found `npm test` red in the owner's working
    tree and traced it, rather than relaxing the guard that was reporting it.] The owner's redesign
    added a third lesson track (`essentials`), and the catalog figures in `LAUNCH_READINESS.md`
    §4.3 and `LAUNCH_PLAN.md` §2.5 are two-track sentences that cannot describe it.** The guard is
    doing its job; the documents are what have to move, and one of them is owner-dirty.
    - **The state, measured this run and reproducible in one command.** `node
      scripts/refresh-readiness.mjs --check` exits 1 on the working tree and exits **0** on a clean
      `git archive HEAD` copy — so the red is the owner's in-flight work, **not** a regression in
      `main`. The tree holds `essentials (15)`, `money (13)`, `economy (12)` = 40 lessons; the named
      tracks cover **25**.
    - **⚠️ DO NOT "fix" this by relaxing the track count. This was measured, not reasoned.** With the
      old `Object.keys(tracks).length === 2` guard bumped to `=== 3` and nothing else changed,
      `--check` did not go green — it proposed **"40 lessons … split across money (13) + economy
      (12)"**, a sentence whose own halves sum to **25 of 40**, and `npm run readiness -- --write`
      would have written it into `LAUNCH_READINESS.md`. A one-character fix here produces a false
      published figure, which is the exact failure class §9.1 exists for.
    - **The unblock, already derived — do not re-derive it. The tool prints it.** Add `"essentials"`
      to `FIGURE_TRACKS` at the top of `scripts/refresh-readiness.mjs` (one list; the §4.3 shape and
      the §2.5 rows are both generated from it as of this run), then run `--check` and paste what it
      names. Verified by injection this run, in a scratchpad copy so no repo file moved:
      - `LAUNCH_READINESS.md` §4.3 wants `**40 lessons / 136,051 English chars / 144 min** — split
        across **essentials (15)** + **money (13)** + **economy (12)** tracks`
      - `LAUNCH_PLAN.md` §2.5 wants a new row `` `essentials` | 1–15 (15) `` and its existing money
        row changed to `` `money` | 16–28 (13) ``
      Then `npm run readiness -- --write`. Nothing else moves.
    - **⛔ BLOCKED on `LAUNCH_PLAN.md` being owner-clean — the same single file that blocks items 73,
      64's `Dividend`, and (found 2026-08-18, re-measuring this item's own premise) 35's second
      glossary batch.** `LAUNCH_READINESS.md` is clean and could be done alone, but doing half
      leaves the suite red anyway, so there is no partial win here. **All four items unblock
      together on one `npm test`; whoever picks one should pick all four.**
    - **Until then, `npm test` is red in the working tree and that is correct.** A run that needs a
      green suite to verify its own change should run the checks against a `git archive HEAD` copy —
      that is what this run did, and the technique is now in the Environment note.
    - **✅ 2026-08-19 — the three strings above were re-derived by injection a day later and
      reproduce EXACTLY, character for character.** They have not decayed; paste them with
      confidence. (Method: `rsync` copy of the owner's whole working tree, `essentials` added to
      `FIGURE_TRACKS`, `--check`. Control: the unmodified copy reproduces the repo's shape-guard
      failure verbatim first.) **One correction to this item's own wording:** "The unblock, already
      derived — do not re-derive it. The tool prints it" overstates it. The tool prints it *only
      after* `FIGURE_TRACKS` is edited; in the repo's current state `--check` stops at the shape
      guard and prints none of the three. Two runs have now paid for that by building a throwaway
      tree copy to find out.
    - **⚠️ 2026-08-19 — `--write` does NOT finish the job, and it leaves §2.5 self-contradicting.
      Measured, not reasoned.** With `essentials` admitted, `--write` updates the money row's range
      cell and reports success — `was: \`money\` | 1–28 (28)` → `now: \`money\` | 16–28 (13)` — while
      the **Role cell in that same row** still reads "**Mechanics (1–15):** budgeting, emergency
      funds, …". Thirteen topics attributed to a range the track no longer contains; 1–15 is
      `essentials` now. The row states two different curricula, in the section that *defines* the
      curriculum. `--write` also only half-writes: the §4.3 sentence and the new `essentials` row
      are `FAIL`s it cannot create, so they stay hand-written either way. **This is now guarded** —
      `refresh-readiness.mjs` fails on a Role cell citing lessons outside its own row's range, so
      the unblocking run gets told rather than shipping it. **The Role prose is editorial and the
      guard deliberately will not rewrite it: budge the topic lists by hand when you split the row.**
    - **Honest priority: high the moment the owner's tree is clean, because it gates every other
      run's step-4 verification. Zero before that.**

84. **✅ DONE 2026-08-20 (owner-directed, interactive) — shipped by title, and the item's own headline
    count was WRONG BY 80%. Read the correction before trusting any figure filed here.**
    - **Shipped: 237 cross-references converted from numbers to titles, across five languages** —
      lesson bodies (en 58, es 37, ko 38, zh 38, ja 38 = 209) plus quiz explanations (en 5, es 5,
      ko 6, zh 6, ja 6 = 28). Zero numeric references remain, verified with the guard's own patterns.
    - **⚠️ THE CORRECTION.** This item filed the total as **128** (es 30, zh 38, ko 1, ja 1). The real
      figure is **237**. The undercount was **my own instrument, not the content**: I scanned `ko` for
      `레슨 N` and `ja` for `レッスン N`, but the prose overwhelmingly writes `N강` and `第N課` — and
      `ja` also writes `第N講`. `check-data.mjs`'s `REF_PATTERNS` already knew all of this, with a
      comment saying hand-enumerating surface forms "has now failed three times in a row." **It failed
      a fourth time, in the item that was filed to fix it.** Use `REF_PATTERNS` as the detector; do not
      write a new one.
    - **The reference style, so a future run matches it.** Quoted title *head* (text before the colon):
      `“Compound Interest”` en/es, `「복리」` ko, `《复利》` zh, `『複利』` ja. **Per-language quote marks
      were chosen against existing usage, not by default** — `ja` already used 「」 for ordinary quotes
      8 times, so titles take 『』; `zh` had 《》 free, which is its standard title mark; `ko` had no
      bracket usage at all. Cross-track references append the track name (`(in How the Economy Works)`),
      which is what the five decoy cases needed. Spanish keeps the noun — `la lección “Título”` — because
      a bare quoted title after an article reads wrong.
    - **Guarded, and the guard was proven by injection.** New `check-data.mjs` **§16b** fails on any
      numeric `Lesson N` reference in any language. Every pre-existing check validates that translations
      *mirror* English; none could catch a reference that is consistent across all five languages and
      still unusable, which is exactly what shipped. Injected one `Lesson 3` into `essentials.en` → the
      guard failed naming `en (1)`; restored from a scratchpad copy, `diff` byte-identical, guard green.
    - **One side effect worth understanding before editing lesson prose again.** Inserting titles put
      text into the body that *matches glossary keys* — "Compound Interest", "Stock", "Bond", "QT" are
      lesson titles **and** glossary terms — so §3.0.3's coverage check demanded a glossary chip on what
      is a pointer to another lesson, not a term the sentence teaches. Fixed in the checker rather than
      by adding ~10 identical `deliberatelyUnlinked` entries: §17b now strips spans matching a real
      lesson title head before scanning. **Control that it did not over-strip:** the coverage numbers
      came back **102 uses / 66 chips / 36 unlinked / 0 unexplained**, identical to before the rewrite.
    - **Also cost:** `essentials` lesson 11 crossed a reading-time boundary (3 → 4 min) and the readiness
      figures moved (144 → 145 min); both regenerated rather than hand-edited.

87. **✅ DONE 2026-08-20 (owner-directed, interactive) — a wrong-target reference found only because
    the title rewrite forced every reference to be resolved.** `quizText` item 41 pointed at two
    lessons that have nothing to do with the concepts it names.
    - **The defect.** Quiz item 41 belongs to `money` lesson 28 ("Does One Lucky Win Prove You Have a
      System?"). Its explanation cited **"lesson 32"** for FOMO and **"lesson 39"** for loss aversion.
      Those ids are `economy` lessons — "The Short-Term Debt Cycle" and "Reading Economic Indicators".
      FOMO is `money` id **20**; loss aversion is `money` id **27**.
    - **The same lesson's own body had it right**, citing 20 and 27 — so the quiz text and the lesson
      text disagreed, in the same lesson. These are stale ids the 2026-08-14 renumbering remapped in
      `lessonContent` and missed in `quizText`, and **all five languages mirrored the wrong pair**,
      which is why the cross-language consistency check never noticed: it verifies translations match
      English, and they did — English was wrong.
    - **Fixed on the way through**: the conversion resolved 32 → "Everyone Can't Be Wrong — Can They?"
      and 39 → "Why Does Losing $50 Hurt More Than Finding $50 Feels Good?" in all five languages.
    - **The lesson for future runs, and it is the reason this is its own item:** a reference that is
      *consistent* is not necessarily *correct*. Nothing in the repo checks that a cross-reference points
      at a lesson that actually covers the thing being cited, and §16b does not close that gap either —
      it only enforces the format. If a future run wants a real guard here, it would have to compare the
      cited lesson's subject against the citing sentence, which is a judgment call, not a regex.


85. **✅ DONE 2026-08-20 (owner-directed, interactive).** The lesson bodies and quiz text are now
    inside §2.3's date guard.
    - **Shipped:** `check-blindspot.mjs`'s §2.3 teaching-copy list stops being hand-maintained at five
      entries and picks up every `lessonContent.*.js` and `quizText.*.js` module — **26 files** now
      scanned, up from 5.
    - **Proven by injection, not by the green tick.** Put `As of March 2026,` into an `essentials`
      lesson body — a file the old list did not cover — and the check failed; restored from a
      scratchpad copy, `diff` byte-identical, check green again. Measured clean on the way in: zero
      "Month YYYY" dates across all 15 lessonContent and 5 quizText modules.
    - **⚠️ KNOWN BOUNDARY, written into the code rather than left implied.** The pattern is English
      month names, so a Spanish "marzo 2026" or a Japanese "2026年3月" still passes. Closing that needs
      a per-language date vocabulary, which item 85 did not scope. What this covers is the English
      source the translations are made from, which is where such a figure would enter the app.


86. **✅ DONE 2026-08-20 (owner-directed, interactive) — a factual error found by reading the bodies,
    fixed in all five languages.** `essentials` lesson 6 and lesson 13 contradicted each other on when
    a taxable brokerage account is taxed, and lesson 6 was the wrong one.
    - **Lesson 6 said:** "Every year, the brokerage saver owes tax on the dividends and gains their
      investments produce, even though they never touched the money." **Lesson 13 said:** "gains are
      taxed as they're realized — when an investment is sold for a profit." Lesson 13 is correct;
      unrealised appreciation is not taxed annually. Lesson 6's phrasing implied it is, in the lesson
      whose whole subject is tax treatment.
    - **All four translations carried the same error in compressed form** — `zh`
      "每年都要缴税的普通券商账户", `ja` "毎年課税される通常の証券口座", `es` "que se grava cada
      año", `ko` "일반 증권 계좌와 달리" — so this was never an English-only fix, and each language's
      lesson 13 already said "realised" correctly, so each language contradicted itself.  <!-- us-english:allow: verbatim quote -->
    - **Fixed** so every language now names both halves: dividends/interest taxed yearly, and the gain
      taxed on sale. The lesson's teaching point is unharmed — annual tax drag on distributions is
      real, and is still what the 401(k) comparison turns on.


80. **✅ DONE 2026-08-20 (owner-directed, interactive) — found by the first live QA sweep of the
    `essentials` track. The reader's `Previous` button walked straight through locked lessons.**
    - **The defect.** `Previous` was gated on `index > 0` alone and stepped through the FLAT,
      track-ordered lesson list (economy 12 → money 13 → essentials 15). From the first lesson of a
      track it therefore landed on the previous track's LAST lesson. Every track's first lesson is
      unlocked from install, so this was reachable by a brand-new user immediately.
    - **Reproduced from a fresh install** (`completedLessons = []`, pasted from the live DOM):
      `#/lesson/1 "LESSON 1 OF 15"` → `#/lesson/28 "LESSON 13 OF 13"` → … all thirteen money
      lessons … → `#/lesson/16 "LESSON 1 OF 13"` → `#/lesson/40 "LESSON 12 OF 12"`. The entire
      40-lesson curriculum was readable without completing anything.
    - **Why it was a defect and not a design choice, which is the part worth keeping.** The same
      lessons are gated on every other surface: the Learn path renders 35 of 40 rows `disabled`, and
      a deep link to a locked `#/lesson/40` redirects to `#/learn` — verified live, both directions.
      `DECISIONS.md` deliberately hardened URLs so that "a URL does not unlock a lesson"; an internal
      button was more permissive than the external entry point that was hardened.
    - **The fix**: `hasPrev = index > 0 && lessons[index - 1].track === lesson.track`
      (`src/screens/LessonReader.jsx`). Backward motion within a track is untouched and is safe by
      construction — `App.isUnlocked` only unlocks a lesson once the previous lesson IN THE SAME
      TRACK is complete, so the lesson behind the one you are reading is always one you finished.
    - **`hasNext` deliberately got no equivalent test, and the reasoning is recorded so a later run
      does not "fix" it too.** Next renders only when the current lesson is `done`, so `index + 1` is
      either the next lesson in this track (unlocked by that completion) or the first lesson of the
      next track (never gated). Forward motion cannot reach a locked lesson, so cross-track Next
      stays — finishing a track and continuing into the next one is good behavior, not a leak.

81. **✅ DONE 2026-08-20 (owner-directed, interactive) — surfaced by the same sweep. Practice was the
    one surface still printing a raw lesson id.**
    - **The defect, live:** the review queue captioned a question **"From lesson 29"** for the lesson
      the reader calls **"LESSON 1 OF 12"** and the Learn path numbers **"1"**. `Practice.jsx` rendered
      `question.lesson`, which is the stable storage id, and ids are deliberately no longer aligned to
      display order.
    - **This is the same bug class `lessons.js` already records as fixed elsewhere** — its
      `lessonsByTrack()` comment says "the reader now shows a lesson's position WITHIN ITS TRACK
      ('Lesson 1 of 12') rather than its raw id", and the Learn path's step-marker comment says the
      three-track reorder made "the economy track's first node read '29'". Both were fixed on
      2026-08-18; Practice was missed. It affects economy (ids 29-40) and money (16-28); `essentials`
      is the one track where it was *coincidentally* correct, since ids 1-15 equal its positions —
      which is precisely why sweeping the new track is what exposed it.
    - **The fix**: a shared `lessonPlacement(id)` in `src/content/lessons.js` returning position,
      track total and track label key, used at both `Practice.jsx` label sites. It is a shared helper
      rather than a third inline derivation **because this is now the third surface to ask the same
      question and the second to get it wrong**.
    - **The label gained the track name, and that was forced by the fix rather than optional.** With
      three tracks there are three "Lesson 1"s and the review queue interleaves them freely, so a bare
      position would have been ambiguous exactly where the queue mixes. `reviewFromLesson` is now
      `"Lesson {n} · {track}"` in all five languages. The number leads so it survives truncation, and
      the in-quiz header caption lost its `flexShrink: 0` (it now ellipsis-truncates) because a
      track name at a 1.3x font scale would otherwise push that row wider than the viewport.
    - **Unresolved on purpose:** a question whose lesson is no longer in the catalog now renders no
      source line at all rather than a wrong number. That case is not currently reachable, since
      `quizMeta` and `lessons.js` agree; it is handled because quiz metadata is keyed by id and can
      outlive a lesson.

82. **✅ DONE 2026-08-20 (owner-directed, interactive) — built as scoped, and the item's own premise
    turned out to be UNVERIFIABLE with the instrument available here. Read the instrument note.**
    - **Shipped:** each of the three track `<section>`s on the Learn path now carries
      `aria-labelledby={`track-${tr.key}-title`}`, pointing at the `<h2>` it already contained, which
      gained the matching `id`. Id shape follows the convention already in the codebase
      (`age-band-${band}`, `sector-window-${window}`, `tab-${tab}`): a literal prefix plus a stable
      key. Verified live: all three resolve to the correct `H2` — `How the Economy Works`,
      `Thinking About Money`, `Money Basics (Optional)` — with no duplicate ids and no stray
      `aria-label`. `Text` forwards `id` because it spreads `...rest`, checked rather than assumed.
    - **⚠️ THE PREMISE I COULD NOT PROVE, stated plainly because the item told the next run to verify
      against the live accessibility tree and that instruction does not work as written.** This item
      claimed "a `<section>` without an accessible name is not exposed as a landmark region". In the
      `read_page` accessibility tree here, a **bare `<section>` with no name at all still renders as
      `region`** — I stripped the attribute from all three in the live DOM and the tree was unchanged.
      So the before/after difference this item was filed to produce is **not observable with this
      tool**, and any future run that "verifies" a landmark fix by seeing `region` in `read_page` has
      verified nothing.
    - **The instrument was calibrated rather than guessed at, and the calibration is the durable
      finding** — now also written into the Environment note. Injecting `aria-label="ZZPROBE-ECONOMY"`
      onto one section produced `region "ZZPROBE-ECONOMY"`, so the tool **does** compute and print
      accessible names; but the section named by `aria-labelledby` printed as a bare `region` with no
      name. The independent check that this is the tool and not the app: `App.jsx`'s
      `tabpanel aria-labelledby={`tab-${tab}`}`, which earlier runs verified as correct, **also**
      prints unnamed in the same tree. **`read_page` surfaces `aria-label` names and not
      `aria-labelledby` names.**
    - **What this leaves the change resting on**, honestly: the DOM-level check that every reference
      resolves to the right heading, and three existing `aria-labelledby` usages in this codebase that
      earlier runs verified by other means. Naming a landmark is unambiguously correct either way — an
      unnamed `region` is useless in a rotor even where one is exposed — so the fix is right; what is
      unproven is the *size* of the improvement, not its direction.

83. **✅ DONE 2026-08-20 (owner-directed, interactive).** `src/screens/Learn.jsx`'s resume comment no
    longer describes the pre-reversal product.
    - **Was:** "`lessons` arrives money-track-first, so this resumes into practical money content
      before optional economics rather than by raw lesson id." Both halves were backwards after
      2026-08-18: `lessons` arrives **economy**-first, and economy is the **main path**, not "optional
      economics".
    - **The replacement was written from `DECISIONS.md`'s two-tracks section** (its 2026-08-18 Update,
      lines 610-624), as this item instructed, rather than from a second guess at current intent. It
      states the order, points at that document as the record if the two ever disagree, notes that
      `essentials` sits last here for the same reason it sits last on the page, and keeps the original
      comment's still-true point that the lookup is index-based because ids are not aligned to display
      order.
    - **The behavior the comment claims was re-verified rather than assumed** — the whole failure mode
      of this item was prose drifting from code. Fresh install (`completedLessons = []`) → "START HERE
      | Transactions: The Building Block | How the Economy Works". With all twelve economy lessons
      complete → "NEXT UP | Does It Put Money In Your Pocket, or Take It Out? | Thinking About Money".
      Flat, track-ordered advance, economy first, exactly as the new comment says.


79. **✅ DONE 2026-08-20 (scheduled dev-agent) — built as scoped, and the item's own proposed wording
    was measured to be FALSE in one of the states it has to cover.** Unblocked the moment the owner's
    redesign landed in `5633b79`: all five `src/locales/*.js` went clean.
    - **What shipped.** One new key `dataStaleTemplate` in all five locales, plus the branch at
      `src/screens/reference/Sectors.jsx:40-63`. The two states now say different things:
      no file → `Market data isn't available right now.`; a file too far from today →
      `The newest reading we have is dated 2026-08-14 — too far from today to show as current.`
    - **⚠️ THE CORRECTION, and it is the reason this item is worth reading rather than skimming.**
      The item scoped the copy as "the newest reading we have is from {date}, **which is too old to
      show**". That sentence is **false in a state `isStale` also covers**: `freshness()` returns stale
      for a date more than `FUTURE_TOLERANCE_DAYS` (1) *ahead* of the device clock, which
      `DECISIONS.md:82-91` established deliberately (item 44). Reproduced live before writing any copy —
      `asOf: 2026-09-30` rendered `Market data isn't available right now. (As of 2026-09-30)`, a date
      **41 days in the future**. So the shipped key says **"too far from today"**, which is true in both
      directions, and it stays one key rather than two. Do not "improve" it back to "too old".
    - **A third state the item did not name, now handled.** `isStale` is also true when `ageDays` is
      `null` — `asOf` missing or malformed. The old expression tested only `isStale && data?.asOf`, so a
      malformed-but-truthy date (`"2026-9-3"`) would have been printed as a real one, by construction of
      the expression that was replaced. The branch now requires `Number.isFinite(ageDays)` before naming
      a date, and falls back to "unavailable" — verified live, renders the no-date sentence.
    - **Its stated priority rationale is now stale, on the good side.** The item said this empty state is
      "presently the *only* thing that screen says" on a `HEAD` deploy. That was true when filed and is
      **no longer**: `market.json` was committed at `asOf: 2026-08-19` in `9b3f4f2`, so a build from
      `HEAD` renders real figures (confirmed live this run). The fix still matters — it is what the
      screen says whenever the daily job lapses more than four days — but it is no longer the default view.
78. **✅ DONE 2026-08-20 (owner-directed). `check-data.mjs` §30 covers `src/utils/date.js` — and for
    the twelfth item running the premise was wrong, this time in BOTH directions at once, which is why
    the section is not the one this item describes.** The item says "no test would fail today if their
    arithmetic did". Measured by injection into a `git archive HEAD` copy, **four** regressions already
    turned the suite red without any new code: `dayDiff` with swapped arguments, off by one, or with a
    wrong month index (all caught by **§25**, which reaches `dayDiff` through `freshness` — so `dayDiff`
    was never untested), and `todayStr()` returning an unpadded `2026-8-20` (caught by
    **`check-claims.mjs`**'s `CLAIMS_TODAY` shape assertion). §23 catches a `toISOString().slice(0, 10)`
    rewrite of `todayStr` *inside `date.js` itself*. **But the item also missed the two gaps that
    matter, and both are consequential:** (1) `dayDiff` recomputed in local time with `Math.floor`
    returns **1** for `dayDiff("2026-03-07", "2026-03-09")` in `America/New_York` — a whole day lost
    across spring forward, the exact defect `date.js`'s header comment says `Date.UTC` exists to
    prevent — and `npm test` stayed **green**; (2) `todayStr()` off by a day with the right shape
    (`getDate() + 1`) passes every existing check and silently moves every streak and every Leitner due
    date. §30 covers those two and deliberately does not restate the four. See the run log entry of
    this date. **The item's own "no bug here" holds — `date.js` is still correct.**
    <details><summary>Original text of item 78, as filed 2026-08-19</summary>

    **[Tests — filed 2026-08-19 by the twelfth run to arrive at the owner's static tree, which picked
    "`src/lib` has no behavioural test coverage" as its item and had that premise break in its hands  <!-- us-english:allow: verbatim quote -->
    at step 3.5, before it edited anything. Read the correction before picking: most of the gap does
    not exist.] `src/utils/date.js` is the only pure logic module in the app with no direct test
    section — and its test home is owner-dirty.**
    - **The premise that broke, with the numbers, because the wrong version of this is an easy pick.**
      `scripts/check-data.mjs` already unit-tests **nine** logic modules — `review.js` (§8),
      `relativeStrength.js` (§9), `lessonIdMigration.js` (§10), `storage.js` (§12), `analytics.js`
      (§13), `marketData/adapters.js` (§14), `marketData/fred.js` (§15), `deepLink.js` (§18) and
      `useMarketData.js` (§25) — imported at `scripts/check-data.mjs:24-33`. A run that reads
      `package.json`'s `test` script, sees seven `check-*.mjs` *consistency* checks and no test
      runner will conclude the app's behavior is untested. It is not. **Do not pick "add unit tests
      for `src/lib`"; nine tenths of it has been done since 2026-08-08.**
    - **What is actually uncovered, measured with a control.** Of the eleven non-JSX logic modules,
      `useAppState.js` is a React hook (not plain-Node testable — the same reason the 2026-08-08 run
      set `storage.js` aside before a `localStorage` mock existed, which §12 now has), and
      **`src/utils/date.js` has no importing test**. Control, so the zero means something: the same
      grep finds `utils/date.js` imported by `check-claims.mjs:31`, `fetch-market-data.mjs:29` and
      `translation-review.mjs:59`, so the instrument can see this import shape and its zero for
      `check-data.mjs` is a real zero, not a pattern that matches nothing.
    - **It carries more than its two-function size suggests.** `todayStr()`/`dayDiff()` are the app's
      single shared notion of "today", read by the streak counter (`useAppState.js`), the Leitner due
      dates (`review.js`), the market-data staleness rule (`useMarketData.js`) and three scripts.
      §23 guards the *idiom* (nothing may compute a calendar date as a UTC date) but never calls
      either function, so no test would fail today if their arithmetic did.
    - **⚠️ There is no bug here — this is regression cover, not a fix, and the run filing it says so
      rather than leaving a future run to discover it.** Probed live in Node against 13 cases before
      filing: same-day, ±1 day, month and year rollovers, the 2028 leap day, a non-leap February, a
      negative span, a 2,422-day span, and both US DST boundaries (2026-03-07→03-09,
      2026-10-31→11-02) — **all correct** — plus `todayStr()`'s `YYYY-MM-DD` shape in
      `America/New_York`. Do not pick this expecting to find a defect.
    - **⛔ BLOCKED on `scripts/check-data.mjs` being owner-clean.** The established home is a numbered
      §-section in that file, and it is one of the owner's 26 modified paths. A separate
      `check-dates.mjs` purely to route around the dirty file was considered and **rejected**: it
      fragments a convention for the duration of one redesign and leaves the owner a merge to
      untangle. **Honest priority: low** — the module is correct today, so this buys regression
      protection, not a repair. It does **not** join the five items that unblock on `LAUNCH_PLAN.md`;
      it is a different file and a separate unblock.
    </details>

88. **✅ DONE 2026-08-20 (owner-directed, same day it was filed). Filed by the run that closed item
    64, built by the next one. The premise held and the two-sided control fired exactly as scoped.**
    *A re-tracking moves no ids, so every id-based test stays green while the prose around them
    silently stops being true.* `5633b79` re-tracked lessons 1-15 out of `money` without renumbering
    them, and `npm test` passed for a full day on two `glossary.js` block headers naming the wrong
    track. **The control this item specified worked in both directions**: `lessonTerms.js`'s header
    cites "Money lesson 12 (renting vs. buying)" and "Money lesson 17" as its worked examples of
    wrong-sense matching — id 12 is `essentials` now (stale) and id 17 is still `money` (correct), so
    a valid instrument had to flag the first and not the second. It did.
    **Nine stale sites fixed**, the sharpest being `src/App.jsx`, whose comment said a first-time
    visitor opens "the first lesson of the money track, which index 0 now is" — index 0 has been
    `economy` since 2026-08-18, and a new install actually opens on lesson 29. Also: `moneyVisuals.js`
    and `LessonVisual.jsx` (three of their four figures are `essentials` lessons now), `glossary.js`'s
    top header, both `lessonTerms.js` section headers, `check-data.mjs` §17's prose, and
    `lessonIdMigration.js`'s present-tense "now money is 1-28".
    **Class closed by `check-data.mjs` §31**, which fails on any src/ or scripts/ comment attributing a
    lesson id to the wrong track, with a `track-ok: <reason>` exemption for deliberate historical
    prose that is checked in BOTH directions (a marker on a reference that is currently correct fails
    too, so an exemption cannot outlive its reason). 9 references checked, 5 exempted. Proved by four
    injections, one of which fired for real during development: the marker leaked onto the adjacent
    line and wrongly exempted the live "essentials lessons 2/3/4" example in §31's own header.
    **Deliberately NOT in scope, and left open as item 89:** the same class in `DECISIONS.md`.

89. **✅ DONE 2026-08-20 (scheduled dev-agent). The three stale lines are repaired the §29 way —
    dated Update appended, line marked historical — and §31 now reads `DECISIONS.md` too. Unusually,
    the premise held on every hit it named — every line number and every verdict checked out. What it
    got wrong was the disposition.** Three corrections worth not re-deriving. **(a) It named five
    hits; two of them were already guarded.** `:587`'s "money is 1-28, economy is 29-40" and the `lessons
    1-12` at `:561` both sit inside the two-tracks section that **§29 already classifies**, both as
    `historical` — so the real repair surface was **three** lines, not five, and the item's "probably
    legitimate history" was not just probable but already enforced. **(b) The substance under all
    three was re-checked and is still true** — lesson 12 does contain "PMI", lesson 17 is about
    lifestyle inflation, and "credit card"/"credit score"/"credit report"/"credit limit" do appear
    across lessons 2/3/4/15. Only the track labels rotted, so no decision changed. **(c) "The check
    belongs beside §29's classification table" was not followed, and the reason is measured.** §29's
    mechanism is a hand-classified table of *ranges in one section*; single-id attributions are §31's
    exact shape, and duplicating its regex into §29 would be two nets over one class. §31 was
    extended instead — but only to `DECISIONS.md`, because running its net over every `.md` finds
    **54 references, 39 stale, and 36 of those 39 are in `AGENT_LOG.md`/`AGENT_LOG.archive.md`**: the
    run log, which must never be edited and would need 36 markers on immutable history to catch three
    real defects. The item's own reasoning ("extending §31 to `.md` would be wrong") is right about
    the conclusion for all Markdown *except* the one normative file, and the dated-truth objection is
    answered by making §31's message for that file prescribe §29's repair rather than an in-place
    rewrite. See the run log entry of this date.
    <details><summary>Original text of item 89, as filed 2026-08-20</summary>

    **[Process — filed 2026-08-20 by the run that built item 88's guard, from the boundary that item
    deliberately drew.]** *`DECISIONS.md` has the same stale track attributions §31 now catches in
    code, and §31 cannot see it.* Measured this run, not suspected — five hits:
    `DECISIONS.md:306` "money lesson 12 (renting vs. buying)" and `:309` "money lessons 2/3/4/15" are
    the same sentences §31 just fixed in `lessonTerms.js`, copied one document over; `:308` "money
    lesson 17" is correct; `:411` "opening money lesson 1 fetches only `lessonContent.money.en`" is
    now doubly wrong (lesson 1 is `essentials`, and its content lives in `lessonContent.essentials.*`);
    `:587` "money is 1-28, economy is 29-40" sits inside a dated entry and is probably legitimate
    history. **Why it is a separate item and not an oversight:** §29's design note is explicit that
    `DECISIONS.md` states *dated* truth, so the repair is "append a new dated Update and reclassify
    the old claim as historical", never an in-place rewrite — a different operation from the code
    fixes, and one that needs the live/historical judgment §29 already models. **Extending §31 to
    `.md` would be wrong for the same reason**; the check belongs beside §29's classification table
    instead. Start by reading §29 and F11's reasoning before touching a line.
    </details>

90. **✅ DONE 2026-08-21 (owner-directed, same day it was filed). Both mismatches fixed by the `#`
    count, guarded by `check-data.mjs` §32b, and the file is now 36/36 consistent. The item's count
    was right and complete — a whole-file sweep found exactly the two it named, no more.** The one
    correction: the item said to check whether §26 parses by heading depth. It does not; the only
    depth-sensitive parser in the repo is **§29, and it reads `DECISIONS.md`**, not this file. There
    are also no anchor links into `LAUNCH_PLAN.md` sections, and Markdown anchors are text-derived
    anyway, so the depth change broke nothing. See the run log entry of this date.
    **[Process — filed 2026-08-21 by the run that closed item 62's F6, from a structural oddity it
    deliberately did not fix. Low value; a good small pick, and read the constraint before starting.]
    `LAUNCH_PLAN.md` §3.1.1 is a `###`, the same heading depth as §3.2/§3.4/§3.5, so the document
    renders it as a *sibling* of §3.1 when its number says it is a child.** Measured this run while
    building §32's heading scan: the file has 40 headings, and the depth-vs-number mismatch is not
    confined to this one — **§2.5 ("Curriculum structure") is a `##` while §2.6 is a `###`**, so §2.5
    renders as a peer of §2 itself. Both are cosmetic in Markdown and both mislead a reader skimming
    the outline.
    - **The constraint that makes this an item rather than a two-minute fix, and the reason F6's run
      left it:** the obvious tidy is to renumber, and renumbering is **forbidden** here — §32's own
      failure message says so, `working_files/build_doc.js` (read-only reference material) names
      sections by number, and the run log is full of `§3.5`/`§2.5` citations that would silently start
      pointing at the wrong text. **The fix is the `#` count, never the number.**
    - **Check before assuming it is safe:** whether anything parses this file by heading depth.
      `check-data.mjs` §26 and §32 both read it; §32 is depth-agnostic by construction (it strips the
      number and compares titles), but §26 was not written with this in mind. Verify, do not assume.

91. **✅ DONE 2026-08-21 (owner-directed: "sweep everything except the dated records"). 123 lines
    swept across 32 files; 10 lines deliberately kept, each with a recorded reason. The item's own
    headline count was WRONG — it said ~69, the real figure is 123 — because the count behind it used
    `analys[ei]s`, which flags "analysis" and "analyses", both correct US English, while missing the
    whole `-ise`/`-ised`/`-isation`/`-iser` family (`capitalised`, `localised`, `tokeniser`,
    `stylised`, `hypothesised`, `generalization`, `normaliser`). Three passes were needed before the
    scan stopped finding new forms.** The three findings worth not re-deriving are in the run log
    entry of this date: the Spanish `check` near-miss, the `canceling` that had been missed in the
    learner-visible surface this agent had already declared clean at 0, and the `CANCELED` event
    identifier that is deliberately still British. Nothing here is open.
    > **⚠️ The `CANCELED` exclusion was LIFTED the same day, owner-directed — and half the reason
    > given for it was wrong.** The event is now `EVENTS.CANCELED: "canceled"`, renamed in all six
    > places at once. This item's entry (and its commit message) said two of the three document
    > enumerations sat "inside `DECISIONS.md` dated records"; **they do not** — both bullets are
    > standing prose with no date stamp, verified with the same classifier that still reads `:472`
    > and `:549` as dated. The *identifier* half of the argument was sound and is why the rename
    > moved as one change; the *dated-record* half was an overstatement that made the work look
    > blocked when it was not. See the run log entry of this date.
    **[Process/Content — filed 2026-08-21 by the run that applied the owner's "US English only"
    instruction to the learner-visible surface, from the residual it deliberately did NOT sweep.]
    ~69 British spellings remain outside learner-visible content, and one slice of them cannot be
    fixed by find-and-replace.** Every figure measured this run, not estimated:
    - **`src/` — 34, and every one is a code comment.** The learner-visible surface is already clean:
      a walk of all 12 content modules plus `locales.en` covering **1,316 English strings** returns
      **0** after this run's two fixes. So nothing here is user-facing, and the value is consistency
      for whoever reads the code, not correctness.
    - **`scripts/` — 16. `LAUNCH_PLAN.md` — 11** (outside §3.1.1/§3.4, already converted).
      **`CLAIMS.md` — 1. `LAUNCH_READINESS.md` — 2.** All mechanical.
    - **⚠️ `DECISIONS.md` — 7, and this is the part that needs a decision rather than an edit.** Some
      sit inside **dated entries**, which §29's rule and this repo's whole dated-truth discipline say
      must not be rewritten in place — the same constraint that stopped item 89 correcting three
      stale lines by hand. Respelling a word inside a record of what was written on a date is a
      smaller falsification than changing a claim, but it is the same kind, and **it is the owner's
      call whether house style outranks verbatimness for orthography.** Ask before sweeping.
    - **Also excluded by design:** `AGENT_LOG.md` and `AGENT_LOG.archive.md`, for §31's reason — run
      log entries are immutable history.
    - **If a guard is wanted afterwards**, the honest scope is learner-visible strings only (where the
      count is already 0 and a regression would be user-facing), not the comment corpus. Reuse this
      run's corpus walk; **and assert a known British instance is inside the corpus before trusting a
      zero** — the first version of that scan missed 40% of the text and reported 0 with all its
      controls passing.

92. **✅ DONE 2026-08-21 (owner-directed, same day it was filed). One string changed — "Borrowing
    gets dearer" → "gets more expensive" — and the item's premise held exactly: a two-pass sweep of
    all 1,316 learner-visible English strings found ONE genuine instance, the one this item named.**
    The value is in what the sweep ruled out, so it is not re-derived: **currency is already
    US-denominated** (zero `£`/pence/quid anywhere in English content, checked by direct grep as well
    as by corpus walk), and **10 of the 11 word-list hits are false positives that must not be
    "fixed"** — "holiday gifts", "coffee shop", "fractional shares", inheritance "in preset shares",
    and six uses of **"flat" meaning unchanging**, including the yield-curve label `curveFlat` and
    lesson 36's `FLAT` heading, which is terminology. **No guard was added, and the number is the
    reason:** a 10-in-11 false-positive rate is exactly §26's documented failure mode, where a check
    whose false positives are ordinary English gets switched off within a week. See the run log entry
    of this date. Nothing here is open.
    **[Content — filed 2026-08-21 by the sweep that fixed item 91's spellings and deliberately
    stopped at the spelling/diction line. Small; read the boundary before picking.] British *diction*
    in learner-visible English copy, which the orthographic sweep does not reach.** One confirmed
    instance: `src/content/policyScenarios.js`'s first-option outcome says **"Borrowing gets
    dearer"** — comprehensible, but not how a US reader would put it ("more expensive", "costlier").
    - **Why it was not just fixed:** item 91's sweep was meaning-preserving by construction — every
      change was one spelling for the same word — so it could be verified mechanically and needed no
      content judgment. Rewording is a **content edit**: it touches a string four translations hang
      off, and it is the kind of change §10.1 wants read for tone before it lands. Different class of
      work, so a different item.
    - **Do the measurement before the edits, and note the instrument does not exist yet.** Diction has
      no regex — a word-list (`dearer`, `while`, `among`, `fortnight`, `queue` for "line", `math`,
      `petrol`, `flat` for "apartment", `holiday` for "vacation", `check`) run over the 1,316-string
      English corpus item 91's run built is the cheap first pass, but it will miss phrasing.
      **Carry item 91's control: assert a known instance ("dearer") is inside the corpus before
      believing a zero** — that is the exact failure that let a `canceling` sit in shipped copy while
      an entry reported the surface clean.
    - **Do NOT touch the non-English locales**, and re-read item 91's `check` near-miss first: the
      same word is British English *and* ordinary Spanish, and a word-list run across all languages
      corrupts lesson content.

93. **[Content — filed 2026-08-21 by the scheduled dev-agent, measured with a control. ✅ ECONOMY
    PHASE CLOSED 2026-08-24 — see the stop-line box. The remainder is now tracked as new item 94.]
    48 of 160 lesson/language pairs ship a condensed *summary* of the English body rather than a
    translation of it.** *(Was 94 at filing. **THE SPANISH ECONOMY TRACK IS DONE: `es` 29-40 are all full
    translations**, twelve pairs paid down across six runs on 2026-08-22, `es` abridged count
    **22 -> 12**. **THE KOREAN ECONOMY TRACK IS DONE TOO: `ko` 29-40 are all full translations**,
    twelve pairs across six runs on 2026-08-22/23, `ko` abridged count **24 -> 12**. **Every
    remaining `es` AND `ko` gap is now in the `essentials` track** (lessons 1-11 and 14) — a
    different, smaller body of work from the one this item was filed about, and the two languages
    have ended in exactly the same shape. **`ja` is untouched at 24 abridged**, and
    it is now the whole of the economy phase of this item. **THE CHINESE ECONOMY TRACK IS DONE:
    `zh` 29-40 are all full translations**, twelve pairs across six runs on 2026-08-23, `zh`
    abridged count **24 -> 12**. **Three of the four languages have now ended in exactly the same
    shape — every remaining `es`, `ko` AND `zh` gap is in the `essentials` track (1-11 and 14).**
    **THE JAPANESE ECONOMY TRACK IS DONE, AND WITH IT THE WHOLE ECONOMY PHASE: `ja` 29-40 are all
    full translations**, twelve pairs across six runs on 2026-08-23/24, `ja` abridged count
    **24 -> 12**. **All four languages have now ended in exactly the same shape — the abridged set is
    IDENTICAL in `es`, `ko`, `zh` and `ja`: lessons 1-11 and 14, the `essentials` track, 12 pairs
    each.** Both main-path tracks (`money` 16-28 and `economy` 29-40) are fully translated in all
    five languages. See the `ko`
    bullets at the end for the rate and the two model corrections the `ko` track produced, the
    `zh` bullet after them for the budgeting correction the final `zh` tranche produced, and the `ja`
    bullet at the very end for why `ja` is the safest track to finish and the tightest to overshoot.)*

    > **⛔ STOP LINE, set by the weekly review 2026-08-23 (W-5.1 at the top of this backlog). ✅ ALL
    > THREE STEPS ARE NOW COMPLETE — 2026-08-24. THIS ITEM IS CLOSED AND SHOULD NOT BE PICKED AGAIN.**
    > This item did NOT run to 160/160, by design. **✅ Step 1 — `zh` economy 39-40, landed 2026-08-23.
    > ✅ Step 2 — `ja` economy 29-40, landed 2026-08-23/24 across six runs. ✅ Step 3 — the economy
    > phase is closed here and the `essentials` remainder (48 pairs) is filed as **new item 94** below,
    > separately prioritized, exactly as W-5.1 required. Do not roll 94 back into this item.**
    > **The milestone the stop line was set to reach, stated so it is checkable:** *the main path is
    > fully translated in all five languages.* `npm run translation-completeness` reports **0 abridged
    > pairs across lessons 12-40 in every language**; the abridged set is **{1-11, 14} in all four**.
    > Reason and the measured arithmetic are in W-5.1. **W-5.5 is closed and now has a standing
    > rule**: the headline count above is re-read off `npm run translation-completeness` by whoever
    > touches this item, in the same commit. It read a stale 68, then 60, then 56, then 54, then 50;
    > it is **48** as of 2026-08-24 (measured directly, `es 12 / ko 12 / zh 12 / ja 12`). **The rule now
    > covers THREE places** — this box, the headline above, and `LAUNCH_READINESS.md` §10.4's prose —
    > because the 2026-08-24 `ja` 37-38 run found §10.4 stale for exactly this reason. *(The "60" written into this box
    > on 2026-08-23 was itself stale within one run — the box and the headline are two places, and only
    > the headline is the one people read. Update both or neither. **This fired a second time:** the box
    > sat at "56" while the headline correctly read 54, and a non-item-93 run doing W-5.6 had to
    > reconcile them on 2026-08-23. The rule works only if "in the same commit" includes this box.)*

    - **What a learner gets — the example this item was filed on, now fixed in `es` and still true in
      the other three languages.** Economy lesson 40 §1 in English is four explanatory paragraphs (the
      indebted family, the factory worker, the farmer's tractor, the closing point). Its Spanish
      **was three bare rule headings and nothing else** — `REGLA 1: No dejes que la deuda crezca más
      rápido que los ingresos.` and two more like it: not a translation of the lesson, a table of
      contents for it. **`es` 40 was completed 2026-08-22 (0.25 -> 1.16) and now carries all four
      paragraphs.** **`ko` was completed 2026-08-23 and `zh` on the same date (0.0784 -> 0.3306,
      the four paragraphs restored against a stub that was three bare rule headings — the `es`
      defect reproduced exactly in a third language).** **`ja` 40 was the last surviving instance of the stub and it was
      completed 2026-08-24 (0.1051 -> 0.4584), all four paragraphs restored.** The defect this whole
      item was filed on now exists in no language, on the main path, anywhere in the corpus.
    - **The worst case found while doing the `es` track was not lesson 40 but lesson 39 §1**, whose
      English is a dashboard of **five** gauges — GDP, CPI, PMI, VIX, credit spreads, each with a
      paragraph and its threshold values, under a one-paragraph intro, so **six paragraphs, not six
      gauges** (this bullet said "six-gauge" until 2026-08-23; corrected by the run that translated
      it, so nobody hunts a sixth) — and whose Spanish was **one line listing the acronyms**.
      **Confirmed identical in `ko` on 2026-08-23**: the Korean was 47 characters against 1,509
      English, the same single line of acronyms. **Confirmed a third time in `zh` on 2026-08-23**:
      34 characters — `GDP、CPI、PMI、VIX、信用利差——读懂经济状态的关键指标。` — literally the five
      acronyms and a colophon. **Expect the same shape in `ja`, whose 39 is 383 characters against
      3,475 English.** Note also that **lesson 39 lands at the TOP of its language's band in both
      languages that have finished it** (`ko` 0.5773 against a 0.51-0.55 band; `zh` 0.3456 against
      0.3161-0.3429 for 29-38) — same lesson, same position, two unrelated languages, and for the
      reason the `ko` run identified: §2's four phase paragraphs are five bare participial fragments
      each in English, which neither language can render as compactly. **Do not read `ja` 39 landing
      high as padding; check paragraph and figure parity and then accept it.**
    - **The measurement, and it now runs on every `npm test`.** `npm run translation-completeness`
      reports translated:English characters per lesson per language over exactly the field set the
      review ledger fingerprints. Volume carried against 140,700 English characters: **es 73%, ko
      36%, zh 23%, ja 32%** — against a full-translation reference (each language's own p90) of **es
      112%, ko 55%, zh 35%, ja 50%**. So es carries about two-thirds of what it should, and the other
      three about two-thirds each as well. **24 of 40 lessons** are abridged in at least one language:
      **all 12 of the economy track (29-40)**, worst in the app at ratios of 0.23-0.35 against es's
      1.12 reference, plus essentials 1-11 and 14. The fully-translated control group that makes the
      rest measurable is **money 16-28 plus essentials 12, 13 and 15**.
      **⚠️ TRACK-BOUNDARY CORRECTION (2026-08-23, by the `zh` 29-30 run's step 3.5).** This item said
      "money 12-28" here and in three other places. **The real tracks are `essentials` 1-15,
      `money` 16-28, `economy` 29-40** — read straight off `lessons.js`'s `track` field. Lessons 12,
      13 and 15 are `essentials` lessons that happen to be fully translated, and **lesson 14 is
      `essentials` too**, which is why this item's own "essentials 1-11 and 14" contradicted its
      "money 12-28" and nobody noticed for two days. Nothing measured is wrong — every ratio, count
      and reference in this item stands — but **do not use "12-28" to scope work**; the `essentials`
      remainder is 1-11 and 14, and it sits inside a 15-lesson track, not a 17-lesson one.
    - **Why no check saw it, which is the part worth not re-deriving.** Every language check in
      `check-data.mjs` asserts *presence* (§1's `checkLangSet`) or *structural agreement with English*
      (§16's cross-references). A field that exists, is well-formed, is consistent with English, and
      carries a quarter of its content passes all of them. **`translation-review-ledger.json` reported
      100%/0-stale for months over exactly this content** — it records that a reviewer saw the text,
      not that the text is all there, and an AI review reading a faithful summary has no way to know
      a summary is not what was wanted. **Do not treat a green ledger as evidence about this item.**
    - **What was already visible, stated honestly — the first draft of this item overclaimed here and
      the step-5 check caught it.** `LAUNCH_READINESS.md` §10.4 **has published the aggregate volume
      ratios since 2026-08-09** (es 0.723x, ko 0.356x, zh 0.226x, ja 0.312x) and calls the surface
      "real ongoing maintenance debt". So the *number* was not hidden. What was missing is what makes
      the number mean anything: **a per-language reference for what a full translation weighs.**
      Against nothing, es 0.723x reads like Spanish being slightly more compact than English; against
      this corpus's own fully-translated lessons at **1.12x**, it means roughly a third of the content
      is absent. §10.4 also reports one aggregate per language, so the fact that the shortfall is
      **concentrated** — money 16-28 complete, economy 29-40 at 0.23-0.35 — is invisible in it, and
      that concentration is what makes the work schedulable.
    - **How it accrued:** seventeen consecutive "Deepen lesson N" runs in 2026-08 grew English and
      left the four translations alone. Each left the suite green. Now guarded — `check-data.mjs`
      **§33** records each pair's ratio in `scripts/translation-completeness-baseline.json` and fails
      if it moves in either direction, so English can no longer quietly outgrow its translations, and
      paying the debt down forces a visible re-record.
    - **Scope it by track, not by count.** The economy track is both the worst and the one the
      2026-08-18 reversal made the main path, so **economy 29-40 in one language is the first
      pick** — probably `es`, which has the highest ratio to begin with and the least distance to
      close. One lesson x one language is a reviewable unit; do not attempt a track x four languages
      in one run.
    - **✅ THE `es` ECONOMY TRACK IS COMPLETE — twelve lessons, six runs, one date (2026-08-22).**
      `es` 29 (0.35 -> **1.11**), 30 (0.34 -> **1.18**), 31 (0.23 -> **1.15**), 32 (0.31 -> **1.15**),
      33 (0.34 -> **1.13**), 34 (0.24 -> **1.16**), 35 (0.31 -> **1.20**), 36 (0.35 -> **1.20**),
      37 (0.31 -> **1.19**), 38 (0.29 -> **1.17**), 39 (0.26 -> **1.21**) and 40 (0.25 -> **1.16**).
      **`npm run translation-completeness` now reports 0 abridged `es` lessons in 29-40.**
      **The measured cost, which is the number to plan the other languages with:** ~4,270 added
      characters for 29/30, ~5,430 for 31/32, ~6,680 for 33/34, ~7,350 for 35/36, ~6,320 for 37/38 and
      ~5,380 for 39/40 — **~35,400 Spanish characters for 12 lessons, against 41,724 English
      characters in the same lessons, i.e. roughly 0.85 added characters per English character** once
      the existing stubs are credited. Budget by English character count, not by lesson count.
      **Two lessons is a comfortable unit for one run; do not stretch it to a whole track.**
    - **A translated `es` lesson lands between 1.02 and 1.20, and that whole band is normal.** Across
      the 23 `es` lessons now at full volume the ratios run **min 1.022, median 1.119, max 1.204**.
      Lessons 35 and 36 came in at the top of it (1.204, 1.198), just above lesson 30's pre-existing
      1.18 — which is what happens when the English side is *terse* (35 §1 is two arrow lines that
      Spanish cannot render as compactly), not evidence of padding. **If a future pair lands above
      ~1.25, check it for added sentences before recording it**; below that, the band is the corpus's
      own and needs no defense.
    - **⚠️ The reference moves as you pay the debt down, so the headline count falls slower than the
      pairs you fix (measured 2026-08-22, second run of the date).** `ABRIDGED_BELOW` is `0.7 x` each
      language's **p90 ratio across this same corpus**, so every lesson you translate in full raises
      the bar for all the others. Translating `es` 31 and 32 moved the `es` reference **1.1206 ->
      1.1390**, which lifted the threshold **0.7844 -> 0.7973** and pushed **essentials lesson 11**
      (`es` ratio **0.7954**, unchanged and untouched by that run) from "fine" to "abridged" by a
      margin of **0.0019**. Net: two pairs fixed, one newly flagged, headline 92 -> 91.
      **This is the metric working, not a regression** — the bar is "what a full translation of these
      lessons weighs", and it should rise as the corpus gets better. Two consequences for whoever
      picks this up: **(a)** do not go hunting for what "broke" lesson 11 — nothing did, and its
      recorded ratio in the baseline is unchanged, which is why §33 stayed silent about it; **(b)**
      expect a handful more borderline essentials lessons (14 is next at **0.8253**) to cross the line
      as `es` 35-40 land, and do not read that as new debt appearing.
      **Update after 33/34, 35/36 and 37/38 (same date): the effect is intermittent, and the
      "decelerating" claim written here after 35/36 was WRONG — corrected on the next run's data.**
      Reference moves: 33/34 pushed `es` 1.1390 -> **1.1485** (+0.0095), 35/36 only to **1.1520**
      (+0.0035), and 37/38 to **1.1682** (+0.0162) — *larger than either*. The p90 does not decay
      monotonically as translations land; it steps whenever a newly-converted lesson displaces the
      element the 90th-percentile index points at, so the move depends on where the new ratios sort,
      not on how many lessons are already done. **Do not predict the next step's size from the last
      one.** Lesson 14 (0.8253) has stayed above the threshold on all three occasions (now 0.8177),
      but its margin has fallen 0.0189 -> **0.0075**, so `es` 39/40 will very likely push it under and
      the final headline should be expected to fall by 1, not 2. Lesson 16 is behind it at 0.8607.
      **✅ That prediction was checked and held exactly (2026-08-22, final `es` run).** 39/40 lifted
      the reference to **1.1803** and the threshold to **0.8262**; lesson 14 sits at **0.8253** and
      crossed by **0.0010**, so the headline fell by 1 (85 -> 84), not 2. **Lesson 14 is therefore
      listed as abridged today without a single character of its Spanish having changed** — worth
      knowing before someone "fixes" it. Lesson 16 (0.8607) is next, with 0.0344 of margin.
    - **The ledger does not move when you do this work, and that is correct.**
      `translation-review.mjs` fingerprints the *English* body, so rewriting a Spanish body neither
      clears nor creates staleness. `es` 30 stays on the stale list for an unrelated English edit.
      **Do not mark a pair reviewed just because you translated it** — that asserts the English-drift
      re-review happened when it did not. Marking is a separate, honest act on separate evidence.
    - **Two things to settle before writing copy, and neither is the agent's call alone.**
      **(a)** DECISIONS.md's machine-translation entry accepted AI translation under "(Beta)"
      labeling; it never said "abridged", so filling these in is consistent with it — but the
      *volume* being added is large enough that the owner should know it is happening.
      **(b)** §10.1 applies to every added sentence in five languages, and `check-blindspot`'s
      advice-adjacency patterns run over all of them, so write mechanism, not guidance.
    - **✅ THE `ko` ECONOMY TRACK IS COMPLETE — 29-40, six runs, 2026-08-22/23.** The final
      tranche: `ko` **39 (0.14 -> 0.58)** and **40 (0.14 -> 0.55)**, landed 2026-08-23, **2,456
      added Korean characters** against 5,759 English. **Whole-track cost: 15,435 added Korean
      characters against 40,764 English, i.e. 0.379 added characters per English character** — use
      that, not the 0.371 five-run figure, to budget `ko` `essentials`. The last tranche ran hot at
      **0.4265/char** because lesson 39 landed at 0.5773 (see the band bullet below); do not read
      that as the rate drifting.
      *(Original five-run record, kept because the figures below are still the per-lesson history.)*
      `ko` 29 (0.15 -> **0.52**), 30 (0.19 -> **0.55**), 31 (0.15 -> **0.54**), 32 (0.17 ->
      **0.53**), 33 (0.18 -> **0.54**), 34 (0.15 -> **0.53**), 35 (0.17 -> **0.55**), 36 (0.17 ->
      **0.55**), 37 (0.16 -> **0.54**) and 38 (0.14 -> **0.51**), against a `ko` reference of
      **0.5510**.
      `ko` abridged **24 -> 14**, headline **84 -> 74**, `ko` volume **0.356x -> 0.451x** of
      English. Cost across the ten: **12,979 added Korean characters** against 35,005 English
      characters, i.e. **0.371 added characters per English character** — the rate has held within
      0.005 across all five runs. **Remaining `ko` economy 39-40: 2,378 Korean characters to add
      against 5,759 English — one run.** That rate is well under half the `es` rate of 0.85, because Korean
      is genuinely more compact and because a full `ko` translation lands at ~0.55 rather than
      ~1.18. **So the "~65,000 characters for `ko`/`zh`/`ja` economy 29-40" estimate carried above
      was far too high for `ko`**: the whole `ko` economy track is landing at roughly **15,600
      characters**, not ~22,000. Re-measure `zh`/`ja` before trusting the estimate for them
      either — `zh` runs at a 0.35 reference and `ja` at 0.50, so neither inherits this rate.
    - **⚠️ The rising-reference drag that dominated the `es` runs DOES NOT APPLY to `ko`, and
      expecting it will cause a false alarm.** In `es`, every completed lesson lifted the p90 and
      eventually pushed untouched essentials lessons under the bar (lesson 14 crossed on 0.0010 with
      no character changed). In `ko` the p90 **did not move at all**: 0.5510 before and after 29/30,
      because the already-complete money track (16-28, ratios 0.45-0.60) *already occupies* the top
      decile, so a newly-converted economy lesson lands **at** the reference rather than above it.
      **Simulated the whole rest of the track** (economy 31-40 all set to 0.55): projected `ko`
      reference **still 0.5510**, threshold **0.3857**, and the nearest un-abridged `ko` lesson —
      16 at **0.4545** — stays clear by 0.0688. **Prediction, recorded to be falsified: each
      remaining `ko` economy tranche should drop the headline by exactly 2, with no collateral
      lesson crossing.** If a `ko` tranche ever drops it by 1, the model here is wrong — investigate
      rather than assuming it is the `es` effect repeating.
      **✅ CHECKED ONCE AND HELD EXACTLY (2026-08-22, the 31/32 run).** Reference **0.5510 before and
      after**, threshold **0.3857**, headline **82 -> 80**, lesson 16 margin **0.0688 unchanged** —
      every predicted figure matched to four decimals. **✅ CHECKED A SECOND TIME AND HELD AGAIN
      (the 33/34 run):** reference **0.5510**, threshold **0.3857**, headline **80 -> 78**, lesson
      16 margin **0.0688** — identical figures. **✅ AND A THIRD TIME (the 35/36 run):** reference
      **0.5510**, threshold **0.3857**, headline **78 -> 76**, lesson 16 margin **0.0688**.
      **✅ AND A FOURTH TIME (the 37/38 run):** same four figures again, headline **76 -> 74**.
      Four for four across eight lessons; treat it as established for 39-40, but still check it.
      **⚠️ FIFTH AND FINAL CHECK (2026-08-23, the 39/40 run): THE HEADLINE HALF HELD, THE REFERENCE
      HALF DID NOT.** Headline **74 -> 72**, exactly 2, and no collateral lesson crossed — that is
      the operative prediction and it is now five for five across ten lessons. But the reference did
      **not** stay at 0.5510: it moved to **0.5523**, threshold **0.3857 -> 0.3866**, and lesson 16's
      margin **0.0688 -> 0.0679**. **Why the model missed it, which is the reusable part:** the
      simulation above assumed each converted economy lesson lands *at* ~0.55 and therefore *at* the
      p90 rather than above it. Lesson 39 landed at **0.5773**, above the element the p90 index
      pointed at, and displaced it. So the `es` rising-reference effect is not absent from `ko` —
      it is merely **dormant while every new lesson lands inside the money track's existing 0.45-0.60
      band**, and it wakes up the moment one lands above it. **For `zh`/`ja`, predict the headline
      move, not the reference**: the headline move is robust to this and the reference is not.
      The margin is still 0.0679, so nothing is near crossing either way.
    - **A translated `ko` lesson lands around 0.45-0.60**, the band the money track 16-28 already
      occupies. 29-38 came in at 0.52, 0.55, 0.54, 0.53, 0.54, 0.53, 0.55, 0.55, 0.54 and 0.51 —
      a band of 0.04 across ten lessons, which is what a consistent translation standard looks
      like. Lesson 38 is the low end at 0.5069 and is still comfortably in band; its English is
      unusually list-dense (three `Historically favored in this phase:` lines), which Korean
      renders compactly. Do not target the `es` band (1.02-1.20) — that is
      a Spanish number and Korean cannot reach it without padding.
      **The final tranche widened the band at the top, for a checked reason (2026-08-23).** `ko` 39
      came in at **0.5773** and 40 at **0.5451**, so the ten-lesson 0.51-0.55 band is really
      **0.51-0.58 across twelve**. 39 was checked for padding before it was recorded and is not
      padded: paragraph counts are **exact** (en 6,6 / ko 6,6), the figure set matches with zero
      extras, and the excess is **concentrated in §2's four phase paragraphs** (ratios 0.64-0.68),
      where English writes five bare participial fragments per phase — "GDP rising steadily, CPI near
      the Fed's target, PMI above 50 and climbing, VIX low, and credit spreads narrow" — and Korean
      must attach a topic particle and a conjugated ending to every one of the five clauses. This is
      the same "the English side is *terse*" mechanism this item already recorded for `es` 35/36 at
      the top of the Spanish band. **A `ko` lesson above ~0.60 should still be checked for added
      sentences; 0.55-0.58 on list-dense English is the corpus's own.**
    - **The `es` currency defect does NOT generalize to the other languages — measured, do not
      re-derive.** The 2026-08-22 finding (English magnitude abbreviations `$900B`/`$9T` left in
      Spanish, where `billón` is 10^12) was checked against every non-English content file this run.
      **`ko` writes the long scale correctly** — `$9000억`, `$9조`, `$950억`, `$2조`, all right — and
      **`zh`/`ja` contain no `$` at all**, because the figures were dropped with the rest of the
      abridged content rather than mistranslated. So there is no cross-language sweep to do here, and
      **no guard is warranted**: the defect class has exactly one instance, already fixed. What this
      *does* confirm is the item's standing warning that these languages need **reading** — `ko` 30
      §1 was not an abridgement of the English at all but **different content** (lender/borrower
      motives, where English is the $20,000-car worked example), which no ratio can detect.
      **⚠️ UPDATE 2026-08-23 (the 37/38 run): `zh` now carries currency magnitudes, and it writes
      them in the long scale WITHOUT a `$`.** Lesson 37 is the first `zh` economy lesson to restore
      them — `1.75万亿美元`, `6000亿美元`, `每月850亿美元`, `约9000亿美元`, `9万亿美元`, `每月950亿美元`
      for English's `$1.75 trillion`, `$600 billion`, `$85B/month`, `$900 billion`, `$9 trillion`,
      `$95 billion a month`. The `zh` economy file still contains **zero `$` characters**, so the
      claim above holds as written; what changed is the reason (rendered as 美元, not dropped).
      **The consequence for the acceptance test matters more than the fact: a sorted-multiset
      comparison of figures CANNOT be the pass/fail criterion on a lesson with currency in it.**
      Chinese 亿 is 10^8, so `$600 billion` correctly becomes `6000亿` and the multiset differs by
      design — lesson 37 reports eight differences (85/850, 95/950, 600/6000, 900/9000) and every
      one is a 10x billion->亿 conversion. Lesson 38, which has no currency, IS an exact multiset.
      **So: run the multiset comparator, then account for every difference as a named scale
      conversion; do not weaken the comparator, and do not read a difference as automatic failure.**
    - **`ja` ECONOMY IS UNDER WAY — 29 (0.1136 -> 0.4513), 30 (0.1355 -> 0.4693), 31 (0.1055 ->
      0.4585), 32 (0.1374 -> 0.4451), 33 (0.1412 -> 0.4753), 34 (0.1260 -> 0.4600), 35 (0.1329 ->
      0.4664), 36 (0.1542 -> 0.4756), 37 (0.1375 -> 0.4518) and 38 (0.1077 -> 0.4438),
      2026-08-23/24, five runs. ONLY 39-40 REMAIN.**
      **⚠️ THE 35-36 TRANCHE ADDS THREE CORRECTIONS. Read them before 37-40.**
      **(1) The overshoot rule is too narrow: it is not only *discursive* prose that runs over the
      predicted band.** The 33-34 run attributed lesson 33's 5% overshoot to discursive register.
      Lesson 36 §1 overshot by the same amount (+3.4% to +6% over predicted, first draft +7-9%) and is
      the opposite of discursive — it is an **enumerated** section: an analogy paragraph plus four
      named curve shapes, each opening `正常（右肩上がり）—`, `フラット —`, `逆イールド… —`,
      `スティープ —`. **Measured, not theorised:** §2 (566 against a predicted 554-567) and §3 (763
      against 744-762) both landed in band in the same lesson, so the overshoot is localised to the
      enumerated section, not spread across the lesson. *Hypothesis, offered as a hypothesis:*
      Japanese restates each list member with a fuller connective where Korean attaches a short
      particle. **The operational rule: expect 5-10% over on discursive AND on enumerated sections;
      keep the "check for added sentences" alarm for the *shape* of the overshoot, not its size.**
      **(2) Lesson 36 §1 carried a NEW defect shape — partial enumeration, not the bare-list defect.**
      The bare-list defect (`es` 40, `ja` 34 §1) is *all* the list members present as bare headings
      with their explanations stripped. **`ja` 36 §1 had only TWO of the English's four curve shapes at
      all** — `正常` and `逆転`; **FLAT and STEEP were absent entirely**, as was the lending-to-a-friend
      analogy that motivates the whole section. 109 characters against 1,341 English. A reader would
      have finished it believing the yield curve has two shapes. **No ratio and no structural check can
      see this — only reading the English alongside it can**, which is the same reason this item keeps
      insisting on the read. **Check the other three languages' 36 §1 when `essentials` is scoped.**
      **(3) The figure-multiset comparator reports PHANTOM differences unless trailing punctuation is
      stripped.** A `/\d[\d,.]*/g` tokenizer captures English's `2,` `2022.` `2024,` (ASCII comma and
      period) while Japanese's `、` and `。` are never captured, so lesson 36 reported four differences
      of which **three were pure artifacts**. Strip `[.,]+$` from each token before comparing. The one
      real difference is the already-named class: English writes *"roughly two years"* as a **word**,
      Japanese as `およそ2年間`. **Lesson 35 is an exact multiset with no adjustment at all.**
      **Tranche cost: 2,771 added Japanese characters against 8,474 English = 0.327/char**, against
      0.336, 0.325 and 0.334 for the three previous tranches — the tightest per-character rate of any
      language in this item, and the independent confirmation is that `npm run readiness` moved `ja`
      **49,299 -> 52,070 characters, a delta of exactly 2,771.**
      **The substitution check came back CLEAN on both.** Both §1s were read against the English before
      a word was written; both are true abridgements in the same order, missing paragraphs rather than
      carrying substituted content. **Running tally: 1 of 8 `ja` economy lessons carried the
      substitution defect (lesson 30).**
      **A negative result worth recording so the next run does not "fix" it:** `ja` 35's `thinkAbout`
      was **already a complete translation** (108 characters against a predicted 114-117) and was left
      untouched. Terse is not the same as abridged; the clause check is what settles it, not the ratio. Tranche costs: **1,782 added Japanese characters against 5,311 English =
      0.336/char** (29/30), **2,025 against 6,222 = 0.325/char** (31/32) and **2,613 against 7,821 =
      0.334/char** (33/34) — between `ko`'s 0.379 and `zh`'s 0.230, and it did NOT inherit either.
      The three tranche rates (0.336, 0.325, 0.334) are tight enough that **`ja` is the first track
      whose per-character rate can actually be budgeted with**; `es` and `zh` both drifted more.
      **Remaining 39-40: 5,759 English characters, about 1,880 Japanese characters over one run**
      (0.326/char, the five-tranche rate). Tranche rates so far: 0.336, 0.325, 0.334, 0.327, 0.326 —
      the spread across five tranches is 0.011, so this budget is the most reliable in the item.
      **⚠️ BUDGET FROM A DENSITY PREDICTOR, NOT FROM A TARGET RATIO — the correction the 31-32 run
      produced, and the 33-34 run found its first limit (see the end of this bullet).** The gap model (`added ≈ (target − current) × English`) is exact once you pick a
      target, but *picking* the target was guesswork: 29/30 chose 0.45-0.47 by hand. There is a
      non-circular predictor sitting in the corpus. Measure **ja:ko total characters on the `ja`
      lessons already fully translated** — 29 `1088/1256 = 0.866`, 30 `1361/1609 = 0.846` — then
      apply that density to `ko`'s own *full* translation of the target lesson. For 31 it predicted
      **1,116-1,143** characters and the lesson landed at **1,121**; for 32 it predicted
      **1,677-1,718** and it landed at **1,681**. **Both inside the predicted band, from information
      available before a word was written.** Use it to catch a draft that is quietly terse: the first
      31/32 draft came in at 1,069 and 1,625 with *complete* clause parity, and the per-section
      version of this check localized the shortfall to exactly two sections (31 §2 at 91% of
      predicted, 32 §1 at 86%) — both of which turned out to be telegraphic Japanese renderings of
      clauses that were all present. Rewriting those two sections more idiomatically, adding nothing,
      closed the gap. **A ratio below the band is a prompt to re-read for terseness, never a licence
      to pad.**
      **The 0.45-0.47 target from 29/30 is now known to be slightly high for this track.** 31 and 32
      landed at **0.4585 and 0.4451** with full parity and no clause dropped. Do not chase 0.47.
      **⚠️ THE PREDICTOR IS TIGHT BUT NOT EXACT, AND THE 33-34 RUN FOUND WHERE IT BREAKS.** With four
      fully-translated `ja` lessons the ja:ko density is **0.8459-0.8662, mean 0.8524** — a ±1.2%
      spread, which is why it predicts so well. It called `ja` 34 at **1,881-1,927** and 34 landed at
      **1,917**: inside. It called `ja` 33 at **1,656-1,696** and the first draft came in at
      **1,779 — 5% ABOVE the band**, with the check for added sentences coming back clean (paragraph
      counts exact, figure multiset accounted, no clause absent from English). **The mechanism is
      register, not padding:** 33 §3 is the most *discursive* prose in the economy track — the
      living-memory argument, no worked example, no figures — and Japanese renders abstract
      discursive English less compactly than it renders narrative. §3 came in at 110% of its
      predicted size and §1, which is narrative, at 107%. **So treat a 5-10% overshoot on a
      discursive section as expected, and reserve the "check for added sentences" alarm for the
      shape of the overshoot, not its bare size.** 33 was brought to **1,737 (0.4753)** by eight
      function-word compressions worth 42 characters — **paragraph counts and figure multiset
      identical before and after, no clause dropped** — and that was done for **ceiling margin**
      (the first draft sat 30 characters under 33's 1,809 ceiling, which is too close to be safe),
      **not to hit the predicted number.** Never compress to make a predictor look right.
      **`ja` 34 §1 is the clearest instance of the bare-list defect in the whole `ja` track**, and
      it is now fixed. English is five blocks — an intro plus four numbered levers, each with a
      worked example (the city laying off workers, the bank writing off loans, the tax-and-transfer,
      the central bank refilling the well). The Japanese was **four bare headings on four lines in a
      single block, 87 characters against 1,257 English (0.069)** — the `es` 40 defect this whole
      item was filed on, reproduced in a fourth language. **Verified rendered:** the reader sets
      `white-space: pre-line`, so the five blocks display as five real paragraphs; screenshotted.
      **⚠️ `ja` IS THE SAFEST TRACK TO FINISH AND THE TIGHTEST TO OVERSHOOT — both halves measured
      2026-08-23.** *Safest:* simulating `ja` 31-40 at 0.44, 0.46, 0.48 AND the band median 0.4909
      leaves the reference at **0.4952 in every case**, threshold **0.3466**, `ja` abridged **12**,
      lesson 16 margin **0.0318** — the whole track can be completed without moving the reference
      once, because the money track already occupies 0.38-0.53 and the p90 index points at lesson 27
      at 0.4952, which ten conversions landing below it cannot displace. *Tightest:* the `ja` band
      median (**0.4909**) sits only **0.0043** under that p90 element, where `zh`'s gap was
      comfortable. **So target ~0.45-0.47 for `ja`, NOT the band median** — a lesson written to the
      median is four thousandths from waking the reference the way `ko` 39 did.
      **⚠️ `ja` 30 §1 was DIFFERENT CONTENT, not an abridgement — the `ko` 30 defect reproduced.**
      Its Japanese read `貸し手はお金を増やしたい。借り手は今買えないものを買いたい。` (lender/borrower
      motives) against English's $20,000-car worked example. That is now **two of four languages**,
      not a `ko` one-off. **Read each `ja` §1 before translating it**; no ratio can see this.
      **Checked again on 31, 32, 33 and 34 (2026-08-23) and ALL FOUR ARE CLEAN** — every `ja` section
      there is a true abridgement of its English section, in the same order, missing paragraphs
      rather than carrying substituted content. **Running tally: 1 of 6 `ja` economy lessons read so
      far carried the substitution defect (lesson 30).** So the defect is **not** a property of the `ja` file as a whole;
      it is per-lesson, and the reading is what settles it. Keep reading, and keep recording the
      negative result — a run that only reports the hits makes the check look like it always fires.
      **`ja` lesson-title cross-references use `『』`, not `「」`.** Measured in the file: `『QE & QT』`,
      `『今回は違う』`, `『経済指標を読む』` x2, `『金利』` — five uses — against `「」`, which the file
      otherwise reserves for quoted terms and emphasis (`「資産効果」`, `「タームプレミアム」`,
      `「2s10s」`). **The one exception is the `「金利」` the 29/30 run introduced in lesson 30**, which
      is off-convention; it is left alone rather than "fixed", because rewriting shipped translated
      prose to satisfy a bracket count is not worth a diff. `ja` 32 §1's new "Credit" reference is
      written `『信用』`, matching the file's majority and `zh`'s `《信贷》` / `ko`'s `「신용」`.
      **`ja` currency convention, measured:** the myriad scale and **no `$`** —
      `2万ドル`, `1万5,000ドル`, `5,000ドル`, `8ドル`. So the figure multiset differs from English BY
      DESIGN, exactly as the `zh` 亿 case does; account for each difference as a named scale
      conversion or a Japanese counter rendering an English *word* (`1個あたり`, `2つの役割`,
      `ビール1杯`), and do not weaken the comparator.
    - **✅ THE `zh` ECONOMY TRACK IS COMPLETE — 29-40, six runs, one date (2026-08-23).**
      `zh` **29 (0.0966 -> 0.3227)**, **30 (0.1203 -> 0.3359)**, **31 (0.0843 -> 0.3399)**,
      **32 (0.1056 -> 0.3254)**, **33 (0.1078 -> 0.3298)**, **34 (0.0941 -> 0.3161)**,
      **35 (0.1072 -> 0.3294)**, **36 (0.1190 -> 0.3385)**, **37 (0.1158 -> 0.3429)** and
      **38 (0.0872 -> 0.3267)**, **39 (0.0843 -> 0.3456)** and **40 (0.0784 -> 0.3306)**, against a
      `zh` reference of **0.3490**. `zh` abridged **24 -> 12**, headline **72 -> 60**, `zh` volume
      **0.226x -> 0.294x** of English. **`npm run translation-completeness` reports 0 abridged `zh`
      lessons in 29-40**; every remaining `zh` gap is `essentials` 1-11 and 14.
      **The measured `zh` rate, which did NOT inherit `ko`'s:** 1,170 added Chinese characters
      against 5,311 English on 29/30 = **0.220/char**; **1,455 against 6,222 English on 31/32 =
      0.234/char**; **1,736 against 7,821 English on 33/34 = 0.222/char**; **1,871 against 8,474
      English on 35/36 = 0.221/char**; **1,677 against 7,177 English on 37/38 = 0.234/char**;
      **1,484 against 5,759 English on 39/40 = 0.258/char**; **9,393 against 40,764
      English across all twelve = 0.230/char**, against `ko`'s 0.379 and `es`'s 0.85. Chinese is the
      most compact of the four and starts from the thinnest stubs.
      **⚠️ THE FLAT PER-CHARACTER RATE IS THE WRONG BUDGET MODEL, AND THE FINAL `zh` TRANCHE
      FALSIFIED IT (2026-08-23).** This bullet said "budget the rest at ~0.226/char" and predicted
      **~1,300** characters for 39/40. The actual was **1,484 — 14% high**. Nothing went wrong; the
      model is simply mis-specified. A flat added-chars-per-English-char rate silently assumes every
      lesson starts from the same stub, and **39/40 had the thinnest stubs in the track** (0.0843 and
      0.0784, against a 29-38 average of 0.1038), so more had to be added to reach the same landing
      ratio. **Use the gap model instead: added ≈ (target ratio − current ratio) × English characters**,
      with the target taken from the language's own band. Checked non-circularly against this tranche
      using only pre-tranche information (the 29-38 band median of 0.3298 and the two stubs): the gap
      model predicts **1,427 — 4.0% error**, against the flat rate's **14.0%**. **This matters most
      for `ja`, which is the entire remaining economy phase**: at `ja`'s reference of 0.4952 the gap
      model budgets **~15,200 Japanese characters across 29-40 (~2,500 per two-lesson run, 0.372/char
      effective)**, where a flat 0.50 reference rate would say ~20,400 — **1.34x too high**.
      Budget each tranche from its own English character count AND its own stub.
    - **A translated `zh` lesson lands around 0.285-0.357**, the band the `money` track 16-28 already
      occupies (min 0.2853, median 0.3460, max 0.3568). 29 and 30 came in at **0.3227 and 0.3359**,
      31 and 32 at **0.3399 and 0.3254**, 33 and 34 at **0.3298 and 0.3161**, just under that
      median — deliberately, because the threshold is only 0.2443 and there is no reason to crowd
      the top of the band. **Do not target
      `ko`'s 0.45-0.60 or `es`'s 1.02-1.20**; those are language numbers and Chinese cannot reach
      them without padding.
      **⚠️ Aiming under the p90 is a CHOICE THE TRANSLATOR MAKES, and 31 shows how easily it slips
      (2026-08-23).** Lesson 31's first Chinese draft landed at **0.3599** — above the 0.3490 p90 and
      above the band's own 0.3568 max — on English that is unusually terse (`Same size loan, opposite
      outcome.`), the same mechanism recorded for `es` 35/36 and `ko` 39. It was brought to **0.3399**
      by compressing Chinese function words (`如果没有`->`没有`, `这就是生产性的债务`->`就是生产性债务`,
      `一阵子`->`一阵`) across eight spans, with **paragraph counts and the figure set identical before
      and after** — no clause was dropped. **The line to hold: compress the rendering, never the
      content.** One of the eight compressions did lose content — `数百万人和数百万家企业` shortened to
      `数百万人和企业`, which drops "millions of" from the businesses — and it was reverted at a cost of
      4 characters once caught. **If a draft can only reach the band by dropping a clause, record the
      higher ratio and let the reference move instead.**
      **⚠️ CORRECTION to the 37/38 run's ceiling rule (2026-08-23, the 39/40 run).** That run
      concluded "the ceiling is a character count, not a ratio, and **it belongs to whichever lesson
      is written second**." The first half is right and the second half is not general. Solved
      directly this run, the two per-lesson ceilings were **independent**: 39 could take **1,212
      characters and 40 could take 797, and neither number changed when the other lesson's length was
      varied across its whole range.** The reason is structural, and it is what to reason from — the
      p90 index points at an element (lesson 26 at 0.3490) that sits **above** both lessons' landing
      ratios, and removing two ratios from below the index while re-inserting them below it leaves
      the element at that index untouched. **So the ceilings couple only when a lesson lands ABOVE
      the p90 element**, which is exactly the 37/38 case (37's first draft hit 0.3515 and moved the
      reference on its own). **The rule: compute each lesson's ceiling against the current p90
      element; if the draft lands below it, the lessons are independent and can be written in either
      order; if it lands above, the reference moves and the tranche must be re-simulated as a pair.**
      This run's 39 still needed compression — the first draft was **1,216, five over its own 1,212
      ceiling**, and moved the reference 0.3490 -> 0.3499 — but it was 39's own ceiling it broke, not
      one inherited from 40. Fixed by **7 function-word compressions worth 15 characters**
      (`经济生产出的所有东西的总价值`->`经济生产出的一切的总价值`, `视为健康水平并以此为目标`->`定为健康的目标水平`,
      `与（更安全的）政府借钱要付的代价之间的差额`->`与（更安全的）政府所付代价之间的差额`), landing at
      **1,201 / 0.3456**, with paragraph counts and the figure multiset identical before and after.
      **The 33/34 run needed no compression at all** — both first drafts landed at 0.3298 and 0.3161,
      inside the target band. **So the 31-style overshoot is a property of the ENGLISH side's
      density, not of the translator drifting**: 31's English is terse (`Same size loan, opposite
      outcome.`) where 33 and 34 are narrative — a neighborhood, a city government, a chef. Expect
      the overshoot again where the English is list-dense or aphoristic, and not where it tells a
      story.
      **35 and 36 landed at 0.3294 and 0.3385, neither needing compression — and 35 FALSIFIES the
      way the density rule was being applied (2026-08-23).** The queued note predicted "35's English
      is arrow-chain terse … expect 35 to need function-word compression and 36 not to". 35 came in
      *lower* than 36 and needed nothing. **Why the prediction missed, which is the reusable
      correction: the rule is about the share of the lesson that is terse, not the presence of a
      terse passage.** Lesson 35's arrow chains are two lines out of 3,928 English characters; its
      §2 and §3 are narrative (a young tech company, a family shopping for a house, the dual mandate
      pulling apart), so the lesson as a whole behaves like 33/34. In `es` 35 the arrow lines *were*
      the section. **Weigh the terse spans against the lesson's total before predicting an
      overshoot.**
      **37 and 38 landed at 0.3429 and 0.3267 — and 37 shows the density rule does not run in
      reverse (2026-08-23).** 37's English has no terse span at all and its first draft still came in
      at 0.3515, over the p90; 38's English is the list-dense one (two `Historically favored in this
      phase:` lines, the shape `ko` 38 rendered at the bottom of its band) and it landed *low*, at
      0.3267, exactly as the `ko` 38 entry predicted. So the rule earns its keep on the list-dense
      side and predicts nothing on the narrative side: **a lesson with no terse passage can still
      overshoot, so measure every draft before recording it.** 37 was brought to 0.3429 by 23
      function-word compressions (29 characters) with paragraph counts and the figure set unchanged.
    - **✅ The headline projection held on all four figures for `zh` (2026-08-23), and this is the
      case the `ko` 39 falsification predicted.** Reference **0.3490 before and after**, threshold
      **0.2443**, headline **72 -> 70**, nearest un-abridged lesson 16 at **0.2853**, margin
      **0.0409** unchanged. That is because 29 and 30 landed *below* the p90 rather than above it —
      the exact condition the `ko` 39/40 run identified as what keeps the reference still. **The
      rule that generalizes: predict the headline always; predict the reference only when you are
      confident the new ratios will land at or under the language's current p90.**
      **✅ CHECKED A SECOND TIME AND HELD ON ALL FOUR FIGURES (2026-08-23, the 31/32 run):**
      reference **0.3490 before and after**, threshold **0.2443**, headline **70 -> 68**, lesson 16's
      margin **0.0409** unchanged. Both landed under the p90 (0.3399, 0.3254) — and this time that
      was *engineered*, not observed: the simulation was run at four candidate target ratios before a
      word was written, and **0.36 was the one that moved the reference** (0.3490 -> 0.3529). Deciding
      the target ratio in advance is what makes the reference half of this projection predictable at
      all.
      **✅ CHECKED A THIRD TIME AND HELD ON ALL FOUR FIGURES (2026-08-23, the 33/34 run):**
      reference **0.3490 before and after**, threshold **0.2443**, headline **68 -> 66**, lesson
      16's margin **0.0409** unchanged. Simulated first again — 0.28/0.30/0.32/0.34 all leave the
      reference at 0.3490 and **0.35 already moves it** (to 0.3500), a full 0.01 tighter than the
      0.36 boundary the 31/32 run measured, because 31 and 32 themselves now sit inside the top
      decile. **The safe target band narrows as the track fills; re-simulate every tranche rather
      than reusing the last one's headroom.** Three for three across six lessons.
      **✅ CHECKED A FOURTH TIME AND HELD ON ALL FOUR FIGURES (2026-08-23, the 35/36 run):**
      reference **0.3490 before and after**, threshold **0.2443**, headline **66 -> 64**, lesson
      16's margin **0.0409** unchanged. Four for four across eight lessons.
      **⚠️ But the "narrows as the track fills" claim above did NOT hold this tranche, and the
      correction matters more than the streak.** The boundary measured **0.35 again** — 0.34 safe,
      0.35 moves the reference to 0.3500 — *identical* to the 33/34 run rather than tighter, and the
      same boundary holds in the simulation for 37/38. So the ceiling does not creep down each
      tranche; **it steps, on the same mechanism the `es` bullet already recorded** — the p90 moves
      only when a newly-converted lesson displaces the element the index points at, and 35/36 at
      0.3294/0.3385 sorted below it. The operational instruction is unchanged (**re-simulate every
      tranche**) but the reason is "you cannot predict which way it steps", not "it always tightens".
      **✅ CHECKED A FIFTH TIME AND HELD ON ALL FOUR FIGURES (2026-08-23, the 37/38 run):**
      reference **0.3490 before and after**, threshold **0.2443**, headline **64 -> 62**, lesson
      16's margin **0.0409** unchanged. Five for five across ten lessons. The boundary measured
      **0.35 for the third consecutive tranche** — 0.34 safe, 0.35 moves the reference to 0.3500 —
      and the same boundary holds in the simulation for 39/40.
      **⚠️ But the ceiling is not really a ratio, it is a CHARACTER COUNT, and this is the first
      tranche that had to sit against it.** With 38 already recorded at 0.3267, re-simulating 37
      *alone* put the boundary at exactly **1,176 Chinese characters** against its 3,360 English;
      37's first draft came in at **1,181** — five characters over — and moved the reference to
      0.3503 by itself. **Simulate the pair first, then re-simulate the second lesson alone against
      the first one's actual landed ratio.** A pair-simulation assumes both lessons land at the same
      target, which hides the case where one has all the headroom and the other has none.
      **⚠️ AND 37's FIRST DRAFT OVERSHOT, WHICH THE TERSE-ENGLISH RULE DID NOT PREDICT.** Lesson 37's
      English is narrative throughout — no arrow chains, no aphorisms, and a §3 that is one
      1,033-character explanatory paragraph. It overshot anyway, at 0.3515. So **the density rule
      predicts overshoot but its converse does not hold: narrative English is not a guarantee of
      landing low.** Do not skip the post-draft measurement because the English "reads like 33/34".
      The fix was 23 function-word compressions worth **29 characters** (`仍然需要` -> `仍需`,
      `创造出` -> `创造`, `已经持有的东西` -> `已持有的东西`, `从金融体系中抽走` -> `从金融体系抽走`),
      **with paragraph counts and the figure set identical before and after** — no clause dropped,
      the same discipline the 31 run recorded.
    - **`zh` lesson 30 §1 was different content, not an abridgement — the second language in which
      that exact lesson was.** The English is the $20,000-car worked example; the Chinese was
      "lenders want money to make more money / borrowers want to buy what they can't afford now",
      i.e. the lender/borrower motives framing — **the same substitution item 93 already recorded for
      `ko` 30**. Two of four languages made the same swap in the same lesson, which suggests it came
      from a shared drafting pass rather than a per-language slip. **Check `ja` 30 for it before
      assuming it is a translation.** No ratio can detect this; it needs reading.
    - **`《》` in Chinese content is NOT exclusively a lesson cross-reference marker.** Lesson 22's
      `zh` carries `《为什么分析师看好》` and `《投资者正在忽视的三个风险》`, which look like lesson
      references and are not — they are the **article headlines inside that lesson's
      confirmation-bias story**, matching English's `"Why analysts are bullish,"` and `"Three risks
      investors are ignoring"`. Chinese marks article titles with `《》` and that is correct
      typography. Checked 2026-08-23 rather than filed as a defect. **Any future guard that treats
      `《》` as a lesson-reference surface form will false-positive on lesson 22.**
    - **The related bookkeeping this item supersedes.** `npm run review-status`'s 7 stale
      lessons per language are a *symptom* — see the run log of 2026-08-21 for why re-marking them
      would have asserted "reviewed" over bodies that are 24-35% of their English.

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
    working "Mark Complete" button — silently, with no error state.**

    > **PREMISE CORRECTION 2026-08-24 — the item said "try again", and an in-place retry is
    > impossible here, not merely worse.** Measured live, with the 404'd file restored to 200 in
    > between: re-importing the **same specifier** still fails **without a network request**, because a
    > rejected dynamic import stays errored in the document's module map for the life of the document;
    > only a **cache-busted specifier** refetches, and Vite needs literal specifiers to split chunks at
    > all. A "Try again" button that re-invoked the loader **would have failed every time it was
    > pressed** — a fix with the same shape as the bug. **The action shipped is a document reload, and
    > the button says `Reload`.** Everything else in the item was correct as written.
    >
    > **What shipped:** `src/components/ErrorBoundary.jsx` (the app's first) paired with `Suspense` by
    > `App.jsx`'s new `AsyncScreen` around all three `lazy()` screens; `.catch` on both loaders in
    > `LessonReader.jsx` and on `Practice.jsx`'s; a `loadFailed` state separating *still downloading*
    > from *will never arrive*; **`Mark Complete`, the pre-lesson hook and the end-of-lesson check all
    > withheld on failure** (the latter two because they feed the Leitner schedule); a shared
    > `LoadFailure` in `ui.jsx` with `role="alert"`; and all three bare `…` placeholders replaced with a
    > real `t.loadingLabel` (`grep -rn '>…<' src/` now returns none). Four new locale keys in five
    > languages, **all five rendered in a live browser**, not merely key-parity checked.
    >
    > **Measured before/after, each against a control** (full table in the run log): content-chunk 404
    > went from *772 chars + enabled Mark Complete* to *an alert, no Mark Complete, and a working
    > `Reload`*; a **screen**-chunk 404 went from a **total white screen** (`#root` 0 children, 0 bytes,
    > proven on a pristine `git archive HEAD` build) to the shell surviving with nav intact; and
    > pressing `Reload` recovered fully with `#/lesson/29` preserved. The healthy control was
    > **byte-identical** before and after.
    - **Measured, not reasoned about.** `dist/` was served over HTTP, one content chunk
      (`lessonContent.economy.en-*.js`) was moved aside so it returned **404**, and economy lesson 1
      was opened from a **fresh origin** (a second port, so no HTTP cache could mask it — the first
      attempt on the warm origin *did* mask it, `transferSize` 300 with full text rendering, which is
      how the cache was caught). Result: the lesson body collapses from **3,294 characters to 772** —
      a **77% content loss** — and what stands in for the entire body is **a single `…`**.
    - **What still renders, and this is the problem.** Title, subtitle, "≈2 min", the BEFORE-YOU-READ
      prequiz, the end-of-lesson check, the disclaimer, and an **enabled `Mark Complete`**. So a
      learner can complete a lesson they were shown no content of — which then feeds the streak and
      the Leitner review queue. It does not white-screen; it lies quietly, which is worse.
    - **Cause:** there is **no error boundary anywhere in `src/`** (`componentDidCatch` /
      `getDerivedStateFromError` / `ErrorBoundary` all return zero matches). `App.jsx` wraps its three
      `lazy()` screens in `<Suspense fallback={<ScreenFallback />}>`, and **Suspense handles *pending*,
      not *rejected***. The 20 per-language content modules (`DECISIONS.md`: `.js`-not-JSON, split per
      language by item 45) are `import()`ed from `LessonReader.jsx`/`Practice.jsx` with no `.catch`.
    - **Why the priority is real rather than theoretical:** `dist/` ships **27 content-hashed chunks**,
      and a 404 on one is the ordinary consequence of **a redeploy while someone has the app open** —
      i.e. this becomes reachable on the day O-1 gives the app a URL, not before. Today no one can hit
      it because no one can reach the app.
    - **Scope when picked:** an error boundary plus a rejected-import path that says *this lesson
      didn't load, try again* and — the part that matters — **does not offer `Mark Complete`**. Check
      the empty-body placeholder (`…`) at the same time: it is indistinguishable from real content.

97. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `check-data.mjs` §36, plus an `export`
    on `HTML_LANG` so the coverage half is an exact map comparison rather than a regex. Premise
    re-measured and it held exactly — `documentElement.lang` and `HTML_LANG` had two hits in the whole
    repo, both inside the hook. Scope grew by one assertion the item did not ask for and one the
    item asked for that turned out to be the weak half; see the run-log entry. [A11y/Tooling — filed
    2026-08-24 by the run that fixed the defect, deliberately not smuggled into
    the same commit.] Nothing stops `<html lang>` from drifting out of sync with the picker again.**
    This run added the `useAppState.js` effect that syncs `document.documentElement.lang` (and the
    `HTML_LANG` map that tags `zh` as `zh-Hans`). It is four lines and has no guard: a future refactor
    of that hook drops it silently, because **no rendered check and no script asserts it**, and the
    symptom is invisible to a sighted reviewer. A `check-data.mjs` section asserting that `useAppState`
    still writes `documentElement.lang` and that `HTML_LANG` covers every key in `TR` would hold it —
    cheap, and the same shape as §35. **Note the floor-control lesson from §35's filing:** a scan that
    matches nothing must fail loudly, not pass.

98. **✅ DONE 2026-08-24 (scheduled dev-agent) — the metadata, the multilingual tab title, the
    guard (`check-data.mjs` §38) and one extension to `check-blindspot.mjs`, in one commit.
    Premise re-measured and it held; two facts the item did not have narrowed the scope, and the run
    found two defects in its own work. See the run-log entry.** [Feature/Distribution — filed
    2026-08-24 by the scheduled dev-agent, measured. Serves `LAUNCH_PLAN.md` §5's web funnel, and is
    downstream of O-1.] `index.html` had no link-preview metadata, so every shareable lesson URL
    shared as a bare link.
    - **What shipped:** `description` + the `og:*` and `twitter:*` sets + two per-palette
      `theme-color` tags + an SVG icon in `index.html`; `public/icon.svg`; and one line in
      `useAppState`'s existing lang effect so the **tab title follows the picker in all five
      languages**, composed from `appTitle`/`appSub` so the app's name has one definition. Verified
      live in all five, including a picker change with **no reload** (the effect re-runs, not just
      mounts).
    - **SCOPE CORRECTION, measured — two tags are deliberately absent and should stay absent until
      O-1.** `og:url` and `og:image` are specified as **absolute** URLs and this app has no origin.
      `base: "./"` exists so the build is path-agnostic and `vite.config.js` forbids hardcoding a
      leading `/`, so a guessed domain would break the property the build is built around. Filed as
      **item 101**. `twitter:card` is `summary` and not `summary_large_image` for a related measured
      reason: the repo contains **no shippable image asset** at all.
    - **The lesson worth carrying, and it is about instruments, not icons.** The first `public/icon.svg`
      served `200 image/svg+xml` **and rendered nothing** — a `--` inside an XML comment (it named the
      CSS property `--fill-accent`) makes the document unparseable. The HTTP check that a run would
      naturally reach for said "fine", and an icon has no console error and no layout to disturb, so
      **nothing would ever have reported it.** §38 therefore parses the SVG rather than checking the
      file exists. **Open the asset, do not just fetch it.**
    - **§38 also pins the two one-definition rules**, both proved by injection: `index.html`'s static
      `<title>` against `en`'s `appTitle`/`appSub` (they are the shared-link name and the in-app name
      for one product), and the three description tags against each other (three consumers, no
      reliable fallback between them, so drift shows different previews in different apps silently).
    - **`check-blindspot.mjs`'s §10.1 file set now includes `index.html`**, for the same reason
      `README.md` joined §10.2: a rule only covers the files it reads. The `description` is the first
      and sometimes only sentence anyone reads about this product, and it sat outside every §10.1
      pattern. Proved with a real before/after — the pre-change script **passes** an injected
      violation, the new one names all three lines.

102. **✅ DONE 2026-08-25 (scheduled dev-agent), same run it was filed. [A11y — found by a live DOM
    sweep of the built app, not by reading code.] `<main role="tabpanel">` and `<nav role="tablist">`
    exposed NO `main` and NO `navigation` landmark, and two of the three bottom tabs pointed
    `aria-controls` at ids that did not exist.** One cause for both: an explicit `role` **replaces** an
    element's implicit role rather than adding to it. Shipped as two nested wrappers (the roles moved
    onto inner `<div>`s, so landmark and tab pattern coexist) plus `aria-controls={active ? … :
    undefined}`, guarded by **`check-data.mjs` §40**.
    - **What makes this worth reading later.** The archived 2026-08-1x accessibility run that added the
      roving-tabindex keyboard pattern to this very nav **inspected this exact markup and wrote that it
      was "already wired correctly, not something to fix"** — naming `role="tablist"` on the `<nav>`,
      `aria-controls` on each button and `role="tabpanel"` on `<main>` as correct plumbing. Every one of
      those attributes *is* individually correct. The composition is what was broken, and **you cannot
      see it by reading attributes — only by reading the resulting accessibility tree.** That entry is a
      dated record and stays verbatim (§31); this item is where the correction lives.
    - **Why the app's usual answer did not apply.** Five other tablists here (`Learn.jsx`,
      `GlossaryTerms.jsx`, `PolicySim.jsx`, `Sectors.jsx`, `ParentGuide.jsx`) each carry a comment
      about keeping the panel rendered and `hidden` so `aria-controls` always resolves. The shell
      cannot: its three screens are separate lazy chunks, so mounting all three would download all
      three on open. Scoping the reference to the selected tab is the truthful alternative —
      activation follows focus, so a tab can never be focused while inactive.
    - **Cost: zero new locale keys.** `t.appTitle` moved from `<nav>` to the inner tablist; no
      translation debt in any of the five languages.

103. **✅ DONE 2026-08-25 (scheduled dev-agent). Shipped — but as a skip-to-NAVIGATION link, not
    the skip-to-content link this item asked for. Three of the item's premises were wrong, and the
    third one changed the disposition. Read the correction before re-deriving any of this.**
    - **PREMISE CORRECTION 1 — the header has ONE tab stop, not two.** The item says a keyboard user
      tabs "the app title, then the 5-option language `<select>`". The app title is a plain `<span>`;
      it has never been focusable. Measured live on all four screens: `header: 1` focusable, every
      time.
    - **PREMISE CORRECTION 2 — "on every screen, including each of the 40 lessons" is false.** Focus
      is already managed on route change: opening a lesson moves focus to the lesson `<h1>` (measured
      — `beforeOpen: BUTTON:Start Learning` → `afterOpenLesson: H1:Transactions…`), and a tab switch
      leaves focus on the nav button. A reader passes the header once per page load, not per lesson.
    - **PREMISE CORRECTION 3 — and this is the one that changed the fix.** Taken together, 1 and 2
      mean a skip-to-content link would **bypass exactly one tab stop while adding one**: net zero
      keypresses, on a screen where `<main>` already comes first and where item 102's landmarks
      already satisfy WCAG 2.4.1 (technique ARIA11) for AT users. **The real distance runs the other
      way.** `<nav>` is the LAST element in the DOM, so reaching the app's primary navigation costs
      **38 tab stops on the Glossary**, 14 inside a lesson, 6 on Learn — measured, tabbable-only
      (the roving tabindex means the nav itself is 1 stop, not 3). So the link ships as
      **"Skip to navigation"**, targeting the active tab button.
    - **PREMISE CORRECTION 4 — `theme.js` does NOT own the focus-ring tokens.** `grep -in
      "focus\|outline" src/theme.js` returns **0** (control: `accent` returns hits). The ring is one
      global `:focus-visible` rule in `src/index.css:206-208`, `outline: 2px solid var(--fill-accent)`
      — which the skip link inherits for free. Good news, not a blocker.
    - **THE TRAP THE ITEM DID NOT MENTION, and it is the reason this is a `<button>`.** `lib/deepLink.js`
      owns `location.hash`. The textbook `<a href="#nav">` fires `hashchange` → `resolveRoute` → no
      match → fallback. **Proved live before writing the fix**: an injected `<a href="#probe-nav">`
      clicked from lesson 29 moved the hash `#/lesson/29` → `#/learn` and the `<h1>` from
      "Transactions" to "Welcome to Economic Cycles", with focus left on `BODY`. Control (a click not
      touching the hash): route unchanged.
    - **Guarded by `check-data.mjs` §41** (fragment-href ban + the control's position before
      `<header>`); the five translations are covered by §1's existing key-set parity, proved by
      injection rather than assumed.

    ORIGINAL TEXT (retained — it is what was measured, and three of its numbers were wrong):
    **There is no skip link, and until item 102 there was nothing for one to point at.**
    `grep -rn "skip to" src/ index.html` returns **0**. A screen-reader user can now jump to the `main`
    landmark via the rotor, but a **sighted keyboard user** still tabs through the header — the app
    title, then the 5-option language `<select>` — on every screen, including each of the 40 lessons.
    - **Now cheap, and it was not before**: `<main>` is a real landmark again, so the link has a target.
      Needs one new locale key in five languages (the visible link text) and the usual
      visually-hidden-until-focused styling; `theme.js` already owns the focus-ring tokens.
    - **Check `MIN_TAP` and the focus ring** when it becomes visible, per §34.

104. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. DECIDED (a): the list
    now sorts by `relativeStrength.rank`, and the 1M/3M/6M control was NOT removed — because the
    item's argument for removing it was measurably wrong. Guarded by `check-data.mjs` §42.**
    - **The choice, stated because the item asked for it to be stated.** (a) — one ordering, and it
      is the one every row prints. The screen's own header comment says relative strength "is shown
      as a rank … because a rank is something a first-time reader can actually act on", and
      `DECISIONS.md` says the WJ measure combines three lookbacks precisely so no single window can
      carry it. A ranking whose order is owned by whichever tab is selected contradicts both.
    - **PREMISE CORRECTION 1 — the item's own reason for preferring (b) does not hold, and it is
      what made (a) affordable.** The item says "sorting by rank would make the three tabs identical
      and the control pointless." **The tabs are not identical.** The percentage each row reports is
      still `change[window]`, and those differ sharply: Technology reads **-0.1% on 3M and +30.3% on
      6M**, Health Care **+7.5% / +17.1% / +11.1%** across 1M/3M/6M. Only the *order* stops moving —
      and the order was never the window's to own. Verified live on all three tabs after the fix.
    - **PREMISE CORRECTION 2 — the item's measured figures are the 3M tab, not the 1M tab.** The
      numbers it quotes (Health Care +17.1%, Financials +12.5%, Materials +6.9%, Energy +6.8%,
      Industrials +4.5%) are the **3M** column of `public/data/market.json` (asOf 2026-08-24); 1M
      reads +7.5 / +3.4 / +4.5 / +5.9 / -2.0. The mislabel does not weaken the item — 3M is the
      **default** window (`useState("3m")`), so the defect was worse than filed: it was what every
      reader saw on arrival, not what they had to click to find.
    - **The defect was also worse on 6M than anywhere: that tab OPENED on `#10 of 11`.** Recomputed
      across all three windows before editing; badges came out `1,3,4,2,7,5,6,10,8,9,11` (3M),
      `8,1,2,9,4,5,3,10,6,7,11` (1M) and `10,2,3,1,6,8,7,4,5,9,11` (6M) — none ascending.
    - **The false comment is fixed and is now enforced rather than merely corrected.** It had also
      **propagated**: `AGENT_LOG.archive.md:10419` (item 40's `<ol>`/`<ul>` audit, 2026-08-16) cites
      the false sentence back as its *evidence* that the list is genuinely an `<ol>` — "`ranked` is
      ordered by relative strength and each row…". The `<ol>` was the right element for a reason
      that was not true at the time. It is true now.
    - **One new string, `sectorsSortNote`, in all five languages.** Fixing the comparator removes the
      contradiction but leaves a fair question — "why is +16.0% below +11.1%?" — so the list states
      its own sort key and what the percentage is. es/ko/zh/ja are AI translations like the rest of
      the "(Beta)" surface (§10.4, O-3).
    - **Residual, deliberately not done:** the item's option (c) — showing the window's own position
      *as well* — is still available and was rejected as two ranks per row on a beginner screen.

    ORIGINAL TEXT (retained — it is what was measured):
    **[Bug/Content — filed 2026-08-25 by the run that shipped item 102, measured during the same
    sweep and CONFIRMED in both the code and the rendered screen. Not fixed there: which of the two
    halves is wrong is a product judgment, not a mechanical fix.] The Sector screen sorts by raw
    return but labels every row with a *relative-strength* rank, so the rank badges render out of
    order — and the code comment claims the opposite of what the code does.**
    - **Measured, live, 1M window:** Health Care `#1` +17.1%, Financials `#3` +12.5%, Materials `#4`
      +6.9%, Energy `#2` +6.8%, Industrials `#7` +4.5%, Consumer Staples `#5`. A reader looking at a
      list captioned "Eleven sectors, ranked" sees 1, 3, 4, 2, 7, 5.
    - **The cause, in the source.** `Sectors.jsx:78` sorts by `bySymbol[…].change[window]` — the raw
      percentage for the selected window. The badge at line 153 renders `rs.rank`, which comes from
      `wjSectorComparison` (the owner's multi-period `WJ_Sector_Comparison` formula, `provisional:
      false`, see `DECISIONS.md`). **Two different orderings, one list.**
    - **There is also a false comment**, the item-75 shape: lines 121-122 say "`ranked` is ordered by
      relative strength, and each row states its own 'rank N of M'". `ranked` is not ordered by
      relative strength. Whichever way the product question is decided, that sentence is wrong today.
    - **Do not just re-sort.** The 1M/3M/6M segmented control re-sorts by window (line 119 says "no
      separate content per tab, just a re-sort"), while the WJ rank is computed across `WJ_PERIODS`
      and does not vary by window — so sorting by rank would make the three tabs identical and the
      control pointless. The honest options are (a) sort by rank and re-scope or remove the window
      control, (b) keep the sort and label the row with the window's own position, or (c) show both,
      labeled. **(b) is the smallest and keeps the owner's formula visible; (a) is the most coherent.**
      Owner-facing enough to be worth one line in a weekly report rather than a silent pick.

105. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. Shipped as
    `scripts/a11y-sweep.js` (9 probes, a self-planting control per probe) plus `check-data.mjs` §43
    and an Environment-note procedure. THE ITEM'S OWN PRESCRIBED GATE WAS WRONG AND WAS REPLACED —
    read the correction below before touching the file.**
    - **Premise re-measured and CONFIRMED**: no check script has any DOM capability. `package.json`
      has no `jsdom`/`puppeteer`/`playwright`/`happy-dom`, and `check-data.mjs` reads source text
      through 46 `readFileSync` calls. **Control**: the same grep returns 2 on `check-payload.mjs`,
      so the instrument reaches these files. One figure was stale in the item's favor and is
      corrected: "**forty sections**" is now **43**, having grown by two (§41, §42) between filing
      and pick — a stale snapshot, not a wrong claim.
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
    - **The item's underlying observation was right, though, and sharper than it knew.** With a native
      listener as the control, a real `focus` listener on a real button recorded **zero** events
      across separate calls while `document.activeElement` was correct throughout. So the true rule
      is not "focus is unreliable here" but **"`activeElement` is trustworthy; focus/blur EVENTS are
      not"** — which is a usable distinction rather than a blanket refusal.
    - **What the instrument found on its first real use**, all with the selftest passing 8/8
      beforehand: `#/learn` **0 findings**, `#/practice` **0**, `#/reference` **0**, and lessons
      **1** and **29** each **1 finding** — the `h1 → h3` heading skip the item flagged. Landmarks
      read `main: 1, nav: 1` on every screen, so items 102/103 have a live regression net now.
      `imagesWithoutAlt` reported **VACUOUS** on all five screens (the app uses inline SVG, so the
      probe matched nothing) — which is the design working: a naive check prints a green zero there.
    - **It caught two defects in itself on day one**, which is the whole argument for the selftest:
      its own `smallTargets` control keyed on `/10x10/` when the planted button renders **16×10** (UA
      padding and min-content width beat a declared `width:10px`), and deliberately breaking the
      layout gate revealed that **§43 printed its reassuring summary line alongside its own
      failure** — the vacuous-green shape §40(d) and §42(c) exist to prevent, reproduced inside the
      section guarding against it. Both fixed in the same commit.
    - **Residual, filed rather than smuggled in: the heading-order finding is now item 106.**

    ORIGINAL TEXT (retained — it is what was measured, and its gate clause is the correction above):

    **Nothing in `npm test` can see the rendered accessibility tree, and item 102 was invisible
    to every static check in the repo.** §40 now guards the specific shape, and `check-data.mjs` is up
    to forty sections — but all of them read source text. Item 102 was a **composition** defect: every
    attribute was individually correct and the browser's computed tree was wrong.
    - **What the sweep that found it actually was**: ~30 lines of `javascript_tool` in the live app —
      duplicate ids, buttons with no accessible name, `aria-controls`/`aria-labelledby`/`aria-describedby`
      that resolve to nothing, heading order, sub-44px hit targets, horizontal overflow. On this run it
      returned **0** for every category except the dangling references (item 102) and one heading-order
      note (below), which is a useful signal about the app's real state, not just about the instrument.
    - **Scope before building.** It cannot join `npm test` — it needs a browser, and the Environment
      note's `dist/` + `python3 -m http.server` + `preview_start` technique is a run-time procedure,
      not a script. The realistic form is **a checked-in script the Environment note tells a run to
      paste**, plus a run-log convention for reporting its counts. Adding a headless-browser dependency
      is **item 12's port-cost rule** territory — scope it before reaching for one.
    - **Honest priority: medium.** It found a real defect on its first use, in the app's most-used
      control, that forty static sections had missed.
    - **ADDED 2026-08-25 by the item-103 run, and it is a precondition the script must assert rather
      than an aside.** A hidden Browser pane makes the instrument lie *silently*: `document.hasFocus()`
      goes `false`, **no focus events fire at all** (a native probe listener recorded zero while
      `document.activeElement` was correct), and timer-based waits hang because the pane is throttled.
      Several interim "the reveal does not fire" readings that run were the harness, not the app.
      **The script must refuse to report a zero unless `document.hasFocus() && document.visibilityState
      === "visible"`** — the §40-style floor, applied to a live instrument instead of a static one.
    - **One finding it returned that is NOT yet an item**, because it is arguable and needs a judgment:
      the lesson reader's heading order runs `H1 → H3 → H2 → H2 → H3`, the `H3` being the "BEFORE YOU
      READ" pre-quiz that sits above the first body `H2`. A skipped level is a WCAG 1.3.1 concern; it
      may also be the correct reading of a pre-quiz as subordinate to the lesson title. Measure the
      other 39 lessons before deciding anything.

115. **[Process/Owner decision — filed 2026-08-26 by the owner-directed archive pass, which could
    not solve this by archiving. See W-5.3's SECOND PREMISE CORRECTION for the measurement.] The
    600 KB trigger can no longer be met by archiving, because the run log is no longer the big
    half of this file. Two options; the owner picks one.**
    - **The numbers, measured immediately before the 2026-08-26 pass** (whole-file 915,262 bytes):
      **backlog 458,014 (50.0%)**, **run log 430,101 (47.0%)**, Environment note 20,865 (2.3%),
      App summary 5,097 (0.6%). W-3 wrote the archiving rule when the run log was **~93%**. After
      moving 38 of 39 entries out, the floor under this file is **~485 KB — 81% of the trigger**,
      and three days of entries (08-23→08-25) were 430 KB, so it re-crosses within about a day.
    - **Option (a): compress the backlog, the way W-3 compressed items 17 and 24.** Those went from
      63 and ~80 lines to 27 and 39 by keeping each item's current status, its standing guidance
      and its reproducible method, and dropping the accreted "Update, `<date>`" chronology — which
      is not lost, it is in the run log. The W-5 priority block and the closed W-1…W-4 blocks are
      the obvious candidates: **W-1 through W-4 are all closed and still occupy their full original
      text**, and several closed items carry both a "DONE" summary *and* the original text retained
      verbatim below it.
    - **Option (b): re-point the trigger at what archiving can actually move** — make it a run-log
      byte count (say 300 KB of entries) rather than a whole-file one. Cheap, honest, and it stops
      the trigger from firing an action that cannot answer it. It does **not** fix the 485 KB floor
      every run pays on read.
    - **Why a run should not just pick.** Both change what a future run reads to orient, and (a)
      edits backlog items, which is the one part of this file that is not append-only history.
      A dev-agent run may implement whichever the owner names; it should not choose.
    - **Honest priority: medium.** It is pure process cost — but it is a cost every single run pays
      before it does anything, and it is now growing from the half nobody is pruning.

114. **✅ DONE 2026-08-26 (scheduled dev-agent). Lesson 30 §1 now says "monetary base (M0)" —
    and the matching standard term in each language — and carries a §3.0.3 chip to the `M0`
    glossary entry. THREE premise corrections below, one of which changed the fix. See the run log.**
    [Content — filed 2026-08-25 by the run that added the M0/M1/M2 glossary entries and the
    Market Dashboard money-supply section, as its stated residual.] Reword the credit lesson's
    "base money supply" to "monetary base" in five languages, so the §3.0.3 glossary chip becomes
    legitimate.**
    > **PREMISE CORRECTION 1 — the prescribed wording would have FAILED the build, and this is the
    > one that changed the implementation.** §17 accepts a section as "mentioning" a term only if
    > the English text contains the glossary **key** (`"M0"`) or its `en.s` (`"Monetary Base
    > (M0)"`) — matched with lookarounds on both sides. The bare words **"monetary base" match
    > neither**. Had this item been implemented as literally written, adding the `lessonTerms`
    > entry would have failed §17 by name. Measured with a five-case probe carrying two positive
    > controls and one negative control, then **proved by injection**: the item's exact wording was
    > injected into the shipped file and `npm test` failed with
    > `lessonTerms[30][1]: "M0" is linked from a section whose English text never mentions it`.
    > **The shipped prose therefore carries the parenthetical: "monetary base (M0)".**
    > **PREMISE CORRECTION 2 — the site inventory was wrong in both directions, and the change is
    > about half the size the item implies.** The item says the phrase is in the lesson body, the
    > quiz `explain` and the `Credit` glossary entry, "in five languages" — which reads as 15
    > edits. Measured: the lesson body carries it in **all 5** languages, but the quiz `explain`
    > and `Credit.f` carry the comparison clause in **English only** — the es/ko/zh/ja versions of
    > both are abridged and stop at "the most volatile part of the economy", so they never contained
    > the phrase. **7 prose edits, not 15.** And there is a **fourth site the item does not name**:
    > `markets.js`'s money-supply comment, which states in the present tense that the app "referred
    > to 'the base money supply' in three places" — true when written, false the moment this item
    > lands.
    > **PREMISE CORRECTION 3 — two of the five languages were already correct.** The item frames all
    > five as needing the same rewording. Measured, `ko` already said **본원통화** and `zh`
    > already said **基础货币** — the standard terms, matching their own glossary entries; they
    > lacked only the `(M0)` tag. Only `es` ("oferta de dinero base") and `ja`
    > ("基礎マネーサプライ", not a standard Japanese term) carried genuinely non-standard renderings.
    > The item's "low priority, buys one chip" framing therefore **undersold it**: it also fixed two
    > real terminology defects in the Beta languages.
    - **Why it is not already done.** `lessonTerms.js` links a lesson section to a glossary key,
      and `check-data.mjs` §17 requires the section's English text to mention that key or its
      `en.s`. The credit lesson says *"total credit outstanding is many times larger than the base
      money supply"* — which is neither `"M0"` nor `"Monetary Base (M0)"`, so the chip fails, and
      correctly: a chip the prose does not name is a chip the reader cannot connect.
    - **The change.** In the economy-track credit lesson body (5 languages) and its quiz `explain`
      (5 languages), "base money supply" → "monetary base" / the matching term already used in each
      M0 glossary entry. Then add the `lessonTerms.js` entry for that lesson/section.
    - **Watch the third site.** The same phrase is also in the `Credit` glossary entry itself. A
      glossary entry cannot carry a chip, so it needs no rewording for §17 — but leaving it as
      "base money supply" while the lesson says "monetary base" is the kind of drift the next
      reader will trip on. Change all three or none.
    - **§2.3 boundary, and it is the whole reason the phrase exists.** The 2026-08-02 run put
      "base money supply" there specifically to REPLACE the dated `~$50T vs ~$3T` figures. This
      item rewords a term; it must not reintroduce a number.
    - **Honest priority: low.** Purely a polish item — the definitions are already reachable by
      search from the Glossary and taught on the Market Dashboard. It buys one chip on one lesson.
      And nobody has opened the app (O-1).

113. **✅ DONE 2026-08-26 (scheduled dev-agent). Shipped as `check-data.mjs` §49 — three
    detectors, each proven against its own sample, plus the two `__selftest_*` call sites as a
    live control. One premise correction below. See the run log.** [Tooling/Guard — filed
    2026-08-25 by the run that closed item 112, as its stated residual. DEFERRED, not forgotten:
    the file it belongs in had uncommitted work by another session for the whole run.] A
    `check-data.mjs` section asserting that no recipe in `a11y-states.js` selects or asserts on
    hardcoded English.
    > **PREMISE CORRECTION 2026-08-26, measured before editing.** The item's characterization of
    > the code was right — 0 hardcoded-text selectors in the 19-state matrix — but **one of its two
    > exemptions was stale and the other was mislocated.** `clickIfPresent` is described as "only
    > ever used for the first-run dialog and being replaced by `dismissDialog`"; that replacement
    > has **already fully happened** (0 recipes call it — it is now unreferenced machinery), so no
    > exemption was needed and none was written. And the two `__selftest_*` states are **not
    > inside `var STATES = [`** — they are built inline in `selftest()` — so a check scoped to
    > "the STATES array and the axis helpers", as the item says, would have seen neither of the two
    > call sites it was told to exempt. The scan is therefore whole-file. **That relocation turned
    > the exemption into the control**: those two are the only text-matching call sites the file is
    > allowed to contain, so requiring exactly 2 of them is what proves the scan reaches the file.
    > **A third detector the item did not name:** it listed `click`/`clickExact`/`hasHeading`,
    > which are the shapes item 112 actually shipped, but an `arrived.is` can equally compare
    > `mainText()`/`innerText` against a literal and never touch a named helper. §49 detects that
    > too.
    - **Why it is worth a section.** Item 112 measured the failure mode rather than imagining it:
      matching controls by English display text made **12 of 13 states unreachable in `es`, and
      the same 12 in `ko`**. Nothing errored. The states were rescued only because each carries an
      arrival assertion — without one, that run would have printed "65 sweeps, all clean" over 48
      sweeps of the Reference menu.
    - **What the check should look for**, inside the `STATES` array and the axis helpers:
      `{ click: "..." }` / `{ clickExact: "..." }` with a non-numeric literal, and `hasHeading("...")`
      in an `arrived.is`. The legitimate selectors are ids (`clickId`, `getElementById`), position
      (`menuItem`, `firstButton`, `lastButton`, `termRow`), ARIA roles/states, numerals
      (`aria-label="130%"`), and labels **read from the app at runtime** (`h1IsLastLabel`,
      `headingIsLastLabel`). `dismissDialog` is fine — it takes no label at all.
    - **Two exemptions the check must allow**, or it will fail on correct code: `clickIfPresent`
      is only ever used for the first-run dialog and is being replaced by `dismissDialog`; and the
      two `__selftest_*` states deliberately reference strings that exist in no language.
    - **Vacuity guard, the §44/§45/§46/§47/§48 shape:** zero recipes found, or an `A11yStates`
      that no longer exposes `sweepLangs`, must fail loudly rather than pass.
    - **Honest priority: medium-low.** `A11yStates.selftest()`'s axis control already fails loudly
      if `setLang` stops asserting, so the worst case is covered from inside the file. This section
      would catch the *next* English string at commit time instead of at sweep time. And nobody has
      opened the app (O-1).

112. **✅ DONE 2026-08-25 (owner-directed). Both axes shipped — 5 languages × 2 font scales — and
    the app came back clean in all 130 sweeps. The defects were all in the instrument: 12 states
    per language were unreachable because every recipe matched ENGLISH display text. Recipes now
    select by id, position, ARIA, numerals, and labels read from the app at runtime. Residual (a
    static guard) deferred to item 113 because `check-data.mjs` was mid-refactor by another
    session. See the run log.**
    - **The number that matters:** without the arrival assertions item 111 added, this run would
      have reported *"5 languages × 13 states = 65 sweeps, all clean"* — and **48 of those would
      have been the Reference menu measured repeatedly under five different names.**
    - **Three more instrument defects, each caught by an assertion, none by re-reading code:**
      `<html lang>` for `zh` is `zh-Hans` and the app was right (`useAppState.js:85`); the
      `setFontScale` helper itself matched "About" in English; and the scale seed was written as a
      percent while the app stores a fraction, so a "130%" sweep was rendering at **100%** until
      `finish()` reported `AXES-NOT-APPLIED`.
    - **The third axis, now a number instead of an impression:** across 13 states,
      `imagesWithoutAlt` is `ok` on **1** and VACUOUS on **12**; `unnamedRegions` `ok` on **3**,
      VACUOUS on **10**; `focusVisibleOnTab` UNAVAILABLE on **13** (item 108 — it has never run).
      The other seven probes are `ok` on all 13.
    - **A control that was itself a defect:** asking for a bogus language `xx` drove the app into
      its error boundary (a native `<select>` rejects unknown values to `""`, which the app then
      stored). Not a shipped defect — `loadLang()` validates on the next load and a plain reload
      recovered fully, and item 99's boundary offered a Reload that worked — but a bad control.
      It now detaches the `<select>` instead.
    - **Original text, retained** — its reasoning is what made the pick correct:
    - **[A11y/Tooling — filed 2026-08-25 by the run that retired item 111, as its stated residual
    rather than smuggled into the same commit.] The state matrix exists now; point it at the two
    axes it does not cover — probes beyond `headingOrder`, and the four languages nobody has ever
    swept in any state.**
    - **Language is the bigger of the two, and it is untouched.** All 19 states in
      `scripts/a11y-states.js` were measured in **`en` only**. The four "(Beta)" languages re-render
      every string in the app, and text length drives the two probes most likely to fire:
      `horizontalOverflow` and `smallTargets`. `de`-style long compounds are not the risk here —
      `ja`/`zh` line-breaking and `ko` particle-driven length are. A `lang` axis on the matrix is
      cheap: the picker is a native `<select>`, and the Environment note already records how to
      drive one (`Object.getOwnPropertyDescriptor(...).set.call(el, v)` + a `change` event).
    - **The second axis is the probe set.** Every sweep in this log has been read for
      `headingOrder`, because that is where the last four defects were. `smallTargets`,
      `horizontalOverflow` and `namelessControls` have been running the whole time and their zeros
      have never been the *subject* of a run — worth one deliberate read across all 19 states,
      especially at the **1.3x font scale**, which no state currently sets.
    - **A third, cheaper axis noticed and not chased:** `imagesWithoutAlt` reports `VACUOUS`
      (scanned 0) on most screens and `unnamedRegions` on several. Vacuous is honest, not clean —
      but a probe that is vacuous *everywhere* is a probe that is not earning its place, and that
      is worth knowing either way.
    - **Do not add states without an `arrived` assertion.** `check-data.mjs` §48 fails on it, and
      the reason is measured: 9 of the file's first 13 recipes reached the wrong screen.
    - **Honest priority: medium.** The instrument is built and the marginal cost per state is now
      seconds, so this is the cheapest a11y work available. But item 111 came back clean across
      nine states, so the prior on finding more `headingOrder` defects is now genuinely lower than
      it was — the language axis is where the remaining probability actually sits. And nobody has
      opened the app (O-1).

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
    - **Clean, all of it:** ParentGuide's 9-12 and 13-17 panels `12` (each with a correct roving
      `aria-selected` and an `aria-labelledby` that follows the band), Practice batch-pause and
      session-complete `12`, lesson reader mid-quiz and both-answered `12322223`, after Mark
      Complete `122223`.
    - **The zeros were made to mean something** rather than asserted: a hand-planted `<h4>` in one
      of the measured states produced `1422223`, 1 finding, and removing it returned `122223`, 0.
    - **The real finding was about the tooling, not the app.** On its first run the new file
      reported **MISSED for 9 of 13 recipes** — setting `location.hash` to the value it already
      holds fires no `hashchange`, so seven Reference states never left the screen they were on.
      Each of those would have been a false clean. See the run log for the four harness facts this
      produced.
    - **Original text, retained** — its reasoning is what made the pick correct:
    - **[A11y/Tooling — filed 2026-08-25 by the run that closed item 110, as its stated residual
    rather than smuggled into the same commit.] The state families item 110 did not reach. Its
    thesis is now three-for-three, but the remaining states are progressively less trafficked.**
    - **What item 110 measured and left clean** (11 states, one defect): Learn landing and
      all-tracks-collapsed, Reference landing, Glossary list and term-detail, Market Dashboard,
      Sector performance, Kids, About, and the Practice runner reached via "Practice all questions"
      (which settles item 109's open question — that entrance renders the identical branch, now
      measured rather than inferred: sequence `1`, 0 findings, quiz confirmed running from the DOM).
    - **What is still unswept**, in descending order of traffic: the **Kids age-selector's non-default
      panels** (it swaps panels without a route change — the same "a state, not a route" shape, and
      the cheapest of these); the Practice **batch-pause** and **session-complete** states against a
      *seeded* queue (item 109 read them on an unseeded one); and the **lesson reader mid-quiz**,
      after the end-of-lesson check is answered.
    - **The seeding trap is already documented and cost item 109 a reading** — writing `ecycles_review`
      while the app is running does nothing, because `useAppState` holds review state in React and
      saves over it. Do the `setItem` and the reload in the same call.
    - **Honest priority: medium.** The yield is real and demonstrated, and every instance is cheap now
      that `headingOrder` sees first-heading defects. But item 110 took the single highest-reach
      screen in the app (the first-run modal, 100% of users); what is left is the tail. And nobody has
      opened the app (O-1).

110. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. Thesis confirmed a third
    time — and the defect was on the one screen with 100% reach. Eleven states swept; the first-run
    disclaimer modal was the only one with a finding. Fixed in two halves (the background is now
    `inert` + `aria-hidden`, and the dialog title is the `<h1>`), guarded by `check-data.mjs` §47.
    Residual filed as item 111. See the run log.**
    - **`aria-modal="true"` was a promise nothing in the DOM kept.** All four background headings
      (Learn's `<h1>` and three track `<h2>`s) measured `ariaHiddenAncestor: false`,
      `inertAncestor: false` — so the first screen anyone ever sees read as a five-heading document
      starting at `<h2>`, sequence `21222`.
    - **Why both halves were needed: fixing the isolation ALONE makes the heading defect worse.**
      With the background correctly hidden, an `<h2>`-first outline stops being an ordering quirk and
      becomes the entire document. §47 fails on either half, and on a removed Tab trap — which is the
      only reason pairing `aria-hidden` with `inert` is safe here.
    - **A mechanism claim walked back mid-run:** `inert` does **not** block a programmatic
      `element.click()`, only user interaction. The honest test for pointer-unreachability is
      `elementFromPoint`, which returns the dialog overlay.
    - **Original text, retained** — its reasoning is what made the pick correct:
    - **[A11y/Tooling — filed 2026-08-25 by the run that closed item 109, as its stated residual
    rather than smuggled into the same commit.] Item 109 was not really about Practice. Every screen
    in this app has only ever been swept in the state a sweep arrives in — and that is now a
    measured generalization, not a worry.**
    - **The evidence.** Practice's landing state read `12` and was called clean by every sweep in
      the log; one button away, the same screen read `3` with no `<h1>`. Item 106's was the same
      shape one layer down (the lesson-reader defect was invisible in the completed state, visible
      only unfinished). **Two for two: the defect was in the state the convenient sweep does not
      reach.**
    - **What has never been swept in a non-landing state**, all reachable and none measured:
      the Reference sub-screens past their first tab (Glossary term-detail, Market signals, Sector
      performance, Parent guide), the first-run disclaimer modal (which is a focus trap over the
      whole app), `LessonReader` in its COMPLETED state (item 106 measured that one — it is the
      exception), and the Learn screen with a track collapsed. The Practice runner reached through
      **"Practice all questions"** rather than "Start Quiz" is the cheapest of all: it renders the
      identical branch, so it is covered by construction, but it was not measured on 2026-08-25 and
      that is stated rather than implied.
    - **Do not just re-run the sweep on more URLs** — that is precisely the move that missed this
      twice. The unit of work is *a state*, not a route: list the states each screen can be in, then
      ask which are unreachable by loading a URL and taking a screenshot.
    - **Honest priority: medium-high.** It is the highest-yield a11y work left because the yield is
      already demonstrated twice, and every instance is cheap now that `headingOrder` can see a
      first-heading defect at all. But nobody has opened the app (O-1), so no screen reader has ever
      been pointed at any of these states.

109. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. The suspicion was right
    and the defect was worse than the item guessed: mid-quiz the page had NO `<h1>` at all — its
    entire outline was one `<h3>`. Fixed by making the question the runner's `<h1>` (`headingLevel`
    prop on `<Question>`, default `"h3"` so the lesson reader is untouched), guarded by
    `check-data.mjs` §46 — and the `headingOrder` probe, which called this screen "ok" every time it
    ever ran, was fixed in the same commit. See the run log.**
    - **The instrument was the reason it survived.** `headingOrder` compared each heading only with
      its PREDECESSOR (`if (prev && lvl > prev + 1)`), so the first heading on a page was never
      examined: a document starting at `<h3>` scored **0 findings, status `ok`**. Measured both
      ways this run — the pre-fix markup returns a finding under the new check and returned none
      under the old one, on the same DOM.
    - **Residual filed as item 110** (other screens' non-landing states), not rolled in here.
    - **Original text, retained** — its reasoning is what made the pick correct:
    - **[A11y/Tooling — filed 2026-08-25 by the run that closed item 106, as its stated residual
    rather than smuggled into the same commit.] The Practice screen has only ever been swept in its
    LANDING state, and the state that carries item 106's defect shape is the one behind the "Start
    Quiz" button.**
    - **Measured this run:** `#/practice` reports `headingOrder` sequence **`12`**, 0 findings — one
      `<h1>` and one `<h2>`, with the quiz not started. Every a11y sweep in the log has read Practice
      this way.
    - **Why that is not enough.** Practice renders the same `<Question>` component the lesson reader
      does (`src/screens/Practice.jsx:315`), so it renders `<h3>`s once a quiz is running — and item
      106 is precisely the case where a `<h3>` appeared with no `<h2>` parent nearby. Practice does
      have an `as="h2"` at `Practice.jsx:408` (`how-review-title`), but **that is the "how review
      works" panel, not necessarily the question container**, and nothing has checked the rendered
      order mid-quiz. `check-data.mjs` §45 explicitly does **not** cover this: it checks the lesson
      reader's two labels, not Practice, and says so.
    - **This is the same trap shape as item 106's, which is why it is worth a run and not a glance.**
      The interesting state is the one a convenient sweep does not reach: there, an all-complete
      `localStorage` seed hid the hook; here, not clicking a button hides the questions. Drive it
      with `javascript_tool` — find the start control by text and `.click()` it, confirm from
      `main`'s own text that the quiz is actually running **before** recording any number, then run
      `headingOrder`. The review queue must be non-empty, so seed `ecycles_review` or complete a
      lesson first; a sweep of an empty-queue Practice screen is the vacuous reading, not a clean one.
    - **Honest priority: medium.** Cheap, it uses instruments that already exist, and it either finds
      a real second instance of a defect just fixed or retires the question. But Practice is a less
      trafficked screen than the lesson reader, and nobody has opened the app (O-1).

119. **[Process/QA — filed 2026-08-26 by the run that closed item 118, as its stated residual
    rather than smuggled into the same commit.] Only three states declare the storage they need.
    That the other nine do not need to is a judgment made by READING, not by a check.**
    - **State:** `scripts/a11y-states.js` gained a `requires` precondition (item 118). `COLD` is
      declared on `learn`, `learn-collapsed` and `practice-landing` — the three whose rendered copy
      was measured to branch on storage. The remaining nine no-reload states (the Reference family)
      were judged storage-independent by reading their screens cold and warm in one session.
    - **Why that is thinner than it looks.** It is exactly the reasoning item 118 disproved one
      level down: "this screen does not vary" is a claim about current code, and a screen that
      gains a storage-dependent element later gets no warning — `requires` is opt-in, so a state
      that *should* declare COLD and does not simply keeps reporting `ok`. The Glossary is the
      live candidate: it already reads `ecycles_glossary_bookmarks`, and a bookmarked row renders a
      different `aria-label`. Nothing in the sweep is a function of that today; one feature is.
    - **The cheap version, and it is a measurement not a build:** for each no-reload state, sweep
      it cold and again with every declared key populated, and diff the two DOMs. States whose DOM
      is byte-identical are provably storage-independent; the rest need `requires`. That converts
      nine judgments into nine measurements and needs no new instrument.
    - **Honest priority: low-medium.** The guard that matters (no mutating step in the no-reload
      set) is checked-in and proven able to fail, so the contamination class is closed. This is
      about the *completeness* of the declarations, and it is downstream of O-1 like everything else.

118. **✅ DONE 2026-08-26 (scheduled dev-agent). The cold sweep came back clean; the instrument did
    not.** The reading task ran — Learn, Reference landing, Glossary, About, Sectors, Market
    Dashboard, LessonReader, all from cleared storage, plus a systematic pass over every
    achievement-flavored locale key and its guard. **No second instance of item 117a exists**, which
    is this item's own stated success condition. Both named candidates were negatives: the streak
    chip is gated on `streak > 0` and renders nothing at zero, and the Reference data screens are
    not functions of learner storage. **What the run found instead** is that `drive()` never touches
    storage (`clear`/`seed` are honored only by `begin()`), so a named state did not name a screen:
    `practice-landing`'s three cards all satisfied its arrival assertion and all reported `ok, 0
    findings` — and `practice-all-questions` was warming storage for every language after the first
    in `sweepLangs()`. Fixed: a declared-and-asserted `requires` precondition with a two-sided
    selftest control, `practice-all-questions` reload-gated, and `check-data.mjs` §48(d) guarding
    that the no-reload set stays side-effect-free (proven able to fail by injection). Residual filed
    as **item 119**. Original text retained below — the reasoning is what made the run look here.

    **[Process/QA — filed 2026-08-26 by the run that fixed item 117(a)'s false card, as the
    generalization of it rather than a second fix smuggled into the same commit.] Every screen in
    this app has only ever been verified WARM. The cold-start state is a different screen, and
    nothing has ever looked at it systematically.**
    - **The defect that motivates it, and it is a measured one, not a worry.** The Review landing
      told a brand-new learner "You're all caught up" under a green check for four weeks. It
      survived a live QA pass because the one prior live check of that card
      (`AGENT_LOG.archive.md:1921`) **seeded a review entry first** and then correctly reported the
      string it saw. The fixture and the bug were the same shape, so the fixture hid it.
    - **The defect CLASS, stated so it is checkable:** copy that is conditional in one place and
      unconditional in another. On that card `seen` branched the body and not the title or icon —
      a half-conditional card, where the un-branched half is the one nobody re-reads.
    - **The instrument is trivial and already proven**, which is the argument for doing this: open a
      route from `localStorage.clear()` instead of from a seed, and read the copy. It needs no new
      script and no new dependency. `a11y-states.js` already knows how to `clear`/`seed` and
      reload, so the states are cheap to express there — but note it checks **structure**, not
      whether a sentence is TRUE, so this is a reading task with a mechanical setup, not a probe.
    - **Where to look, in priority order:** **Learn** (a path where 41 of 44 rows are locked — what
      does the streak counter and any resume affordance say at zero?), **Reference → Sector
      performance / Market signals** (both have "no data" states that item-80-era runs touched, but
      cold rather than stale is a different axis), and the **streak counter** specifically, since a
      streak of 0 is exactly the kind of value a template renders as "0 day streak".
    - **Do NOT turn this into a sweep of all 13 states.** One run, three or four screens, reading
      copy against `review = null` / `completed = []`. If it finds nothing, that is a real and
      publishable answer and the item closes.
    - **Honest priority: medium — the highest of the currently unclaimed items**, because it is the
      only one with a demonstrated hit rate (1 for 1) and because cold start is, by definition, the
      state **every** first user is in. Still downstream of O-1 in the sense that nobody has opened
      the app; **not** downstream of it in the sense that the fix is free and the defect ships today.

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
    - **PREMISE CONFIRMED in its reasoning, EXTENDED in its facts, and the extension changed the
      implementation.** The item framed this as two signals that might diverge — `hasFocus()` vs.
      focus *events*. Measured live, there are **three**, and they fail independently: (a)
      `document.activeElement` is correct, (b) focus events do not fire, (c) **the focused element
      does not match `:focus`/`:focus-visible`** — (c) being new, unmentioned by the header, and the
      one a probe named `focusVisibleOnTab` actually depends on. The probe was gated on (b) and now
      declares `needs: "focusSelectors"`. **Gating it on events would have marked it available on a
      session where the selector matches nothing** — the same lying-green shape one level up.
    - **The item’s prescribed experiment could NOT be run, and the fix did not need it.** It asked
      for the native-listener control "in a session where `hasFocus()` is true". `hasFocus()` read
      **false** on every attempt this run, including after fronting the tab and calling
      `window.focus()`. **The 2026-08-25 divergence was not reproduced and its direction is still
      unknown.** Direct measurement is correct under either answer, which is why the item resolved
      anyway — and the sweep now emits `hasFocus()` alongside the measured capabilities, so the next
      occurrence documents itself instead of costing another run.
    - **Isolation controls, since a bare "0 events" has boring explanations:** `click` delivers (1),
      a synthetic `FocusEvent` reaches the same listener (1), `button:enabled` matches 19. One
      mechanism covers all three observations — the document has no focused area, so per spec no
      focus event fires and nothing matches `:focus`, while `activeElement` still names the element
      that *would* be focused.
    - **A control fired for its own reasons here too.** Measuring the native count and the synthetic
      control on the *same* plant let the synthetic dispatch inflate the native counter to 1, a
      fabricated "events work". Hence **two plants**. Caught only by expecting a zero.
    - **Generalized rule, worth more than this item: a proxy signal fails green, a planted control
      fails loud.** A capability that *can* be measured directly must never be inferred.

    ORIGINAL TEXT (retained — it is what was measured):
    **[Tooling/Measurement — filed 2026-08-25 by the run that shipped item 107, as its stated
    residual rather than smuggled into the same commit.] `scripts/a11y-sweep.js`’s header records
    that `document.hasFocus()` is *permanently false* in this preview pane. On 2026-08-25 it was
    TRUE for an entire session, and that disagreement is unexplained.**
    - **Measured:** across five screen sweeps this run, `focusVisibleOnTab` reported **`VACUOUS`**
      (it ran, and scanned 0) rather than **`UNAVAILABLE`** (its capability was missing) — which
      only happens when `caps.focusEvents`, i.e. `document.hasFocus()`, is true. The header’s
      lying-zero note 2, dated the same day, says the opposite and cites a native listener recording
      zero `focus` events as its evidence.
    - **Why both can be true, and why that is the interesting part:** `hasFocus()` and whether
      focus/blur *events* fire are different things, and the header conflates them into one
      capability. If they can diverge, `needs: "focusEvents"` is gated on the wrong signal — it
      would mark a probe available on exactly the sessions where the events still do not arrive.
    - **What to do:** re-run the native-listener control (a real `focus` listener on a real button,
      asserting event count) in a session where `hasFocus()` is true. Two outcomes, both cheap and
      both useful: events fire, so a whole probe class (focus-visible, focus order, the tab trap) is
      recoverable and the header’s note 2 needs narrowing; or they do not, and the capability must
      be detected by an actual planted event rather than by `hasFocus()`.
    - **Honest priority: medium.** It does not affect any shipped finding — no probe currently
      depends on focus events, which is why this was not chased inside item 107’s run. But it is a
      documented measurement that the instrument itself now contradicts, and a stale capability note
      is how a probe gets marked green on a session where it is blind.

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
    - **Everything else in the item was exact** and is left below as filed. The blindness was
      re-confirmed live before editing: a bare `<section>` planted into `main` moved `totalFindings`
      not at all, while a planted second `<main>` fired `landmarks` immediately.
    - **Known and deliberate:** the probe reports `VACUOUS` on a screen with no regions (e.g. the
      `#/reference` hub, independently confirmed at 0 matching elements). That is the vacuous
      accounting working. **Do not pad `scanned` to make those screens read green.**

    ORIGINAL TEXT (retained — it is what was measured):
    **[A11y/Tooling — filed 2026-08-25 by the run that shipped the named-region fix, as its stated
    residual rather than smuggled into the same commit. The instrument could not see the defect the
    run was fixing, which is the most useful thing a new instrument can tell you on day two.]
    `scripts/a11y-sweep.js` has no probe for an UNNAMED landmark region, so it reported the lesson
    reader `clean` on exactly the defect that run went on to fix.**
    - **Measured 2026-08-25, selftest passing 8/8 first:** `#/lesson/1` returned `0 finding(s)` from
      the `landmarks` probe while carrying three bare `<section>` elements. Reading the probe
      (`scripts/a11y-sweep.js`, the `landmarks` entry) shows why and it is not a bug: it counts
      `main` and `nav` only — `mains.length + navs.length` is its whole `scanned` figure — and has
      no notion of `region` at all. The defect was found by reading the `read_page` tree by hand.
    - **What to add:** an `unnamedRegions` probe — every `section, [role=region]` whose accessible
      name is empty (no `aria-label`, no `aria-labelledby`, or an `aria-labelledby` that does not
      resolve). **It must ship with a planted control in `selftest()` like every other layout-gated
      probe**, or `check-data.mjs` §43(c) will fail it, which is §43 doing its job.
    - **Why the static guard is not enough on its own, even though it shipped first.**
      `check-data.mjs` §44 covers `<section>` tags **written in `src/`**. It cannot see a region
      composed at runtime, one introduced by a library, or a `role="region"` set from a variable —
      and the whole reason `a11y-sweep.js` exists is that source text and the computed tree are
      different things. The two checks overlap deliberately; neither subsumes the other.
    - **Honest priority: medium.** Cheap (one probe plus one plant), and it closes a hole in the
      instrument the last three a11y runs have leaned on. But it guards a class that §44 now also
      guards from the other side, so it is not urgent.

106. **✅ DONE 2026-08-25 (scheduled dev-agent). Fixed by marking up the two block labels the
    lesson reader already had — `as="h2"` on `{t.hookTitle}` and `{t.checkTitle}` — and guarded by
    `check-data.mjs` §45, which was proved able to fail in three modes.**
    - **PREMISE CONFIRMED to the character, and the DISPOSITION still changed.** Both recorded
      sequences reproduced exactly (lesson 1 `132223`, lesson 29 `13223`). What the item got wrong is
      the *fix*: it offered promote-the-`h3`, reorder, or leave-it, and called the choice "still a
      judgment". It is not, once you see that **the block already had a title nobody marked up**. The
      `h3` was not too deep — its parent was missing. Marking up the existing label adds **no new
      string in any of the five languages** (both keys already exist in en/es/ko/zh/ja) and gives the
      hook and check blocks a rotor entry they never had. Nothing moves visually: `<Text>` sets
      `margin: 0` plus explicit font metrics, so the UA's `h2` defaults never apply — measured, not
      assumed (identical computed styles AND identical bounding boxes before/after, including the
      check label at `y = 3528px`).
    - **THE SAMPLING TRAP, and it is the reusable part.** The obvious way to sample all 40 — seed
      `ecycles_completed_lessons` with every id so nothing is locked — **suppresses the defect**: the
      hook renders only while a lesson is UNFINISHED, and the hook's `<h3>` *is* the skip. That sweep
      returns **40/40 clean** and would have closed this item as unreproducible. Unlock by completing
      the **predecessor** only: seed all-but-a-non-consecutive-set and sweep that set; two
      complementary passes (21 + 19) cover the catalog. Seeding `localStorage` on an already-booted
      app does nothing at all (`isUnlocked` reads React state) — lessons redirect to `#/learn` and
      the sweep reports the Learn screen as clean under the lesson's name.
    - **What the survey actually found, which is bigger than the item's headline.** Not "the lesson
      reader skips a level" but **21 of 21 lessons measured in the first-read state skip, and 0 of 40
      do in the revisit state** — i.e. it is every lesson in the catalog, on the only pass through it
      every reader necessarily makes. After the fix: **40/40 lessons in the first-read state, 0
      skips**, each row's screen identity asserted against the catalog title and `hookPresent`
      computed from document order.
    - **Lesson 35, which this item recorded as unsamplable, was sampled** in both states
      (`1322223` / `122223`). The "only 2 of 40 sampled" gap is closed.

    ORIGINAL TEXT (retained — it is what was measured):
    **[A11y — filed 2026-08-25 by the run that built item 105's sweep, as its stated residual rather
    than smuggled into the same commit. This is the finding item 105 explicitly declined to file
    ("it is arguable and needs a judgment"), and it now has independent measurement behind it.]
    The lesson reader's heading order skips a level: `h1 → h3`, because the "BEFORE YOU READ"
    pre-quiz is an `h3` sitting above the first body `h2`.**
    - **Measured 2026-08-25 by `scripts/a11y-sweep.js`, selftest passing 8/8 first:** lesson 1 reads
      `132223` and lesson 29 reads `13223`. **Two of two lessons sampled**, from different tracks
      (`essentials` and `economy`), so it is the reader's template rather than one lesson's content.
    - **Why it is still a judgment and not an obvious bug.** A skipped level is a WCAG 1.3.1 concern.
      But `h3` may also be the *correct* semantic reading of a pre-quiz as subordinate to the lesson
      title — the alternative, promoting it to `h2`, makes the pre-quiz a sibling of the body
      sections, which is arguably a worse description of the document. A third option is to leave
      the level and reorder, which changes the reading experience and is out of scope for an a11y fix.
    - **What is NOT yet measured, and it is the reason this is not just fixed:** only 2 of 40 lessons
      were sampled. Lesson 35 could not be sampled at all — it is locked, and a URL does not unlock
      (`DECISIONS.md`), so the sweep landed on `#/learn` instead. **Sampling the rest means completing
      lessons or seeding `localStorage`**, which is what makes this a whole run rather than a
      five-minute fix. Do that first; the instrument makes it mechanical now.
    - **Honest priority: low-medium.** Real, standards-backed, reproducible on demand — and it affects
      screen-reader navigation of the app's single most-used screen. But it is one skipped level on a
      page whose landmarks, control names and hit targets are all clean, and nobody has opened the app
      (O-1). Do not let it jump the queue ahead of unblocked structural work.

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
    invariant.** [Bug/Tooling — filed 2026-08-24 by the run that closed item 96, as its stated
    residual rather than smuggled into the same commit (the boundary W-5.4 drew before item 95, and
    item 97 before this).] Item 96's boundary covered the three `lazy()` screens; `Learn.jsx` is
    statically imported and was not behind one, and nothing stopped the next screen from being added
    without it.
    - **The headline claim was measured live before anything was edited, and it reproduced exactly:**
      a render throw injected into `Learn` left `#root` at **0 children / 0 bytes** — the same
      signature item 96 measured for a rejected chunk. **Control:** restoring the file and rebuilding
      brought the same page back at **75,317 bytes**, so the blankness was the injection and not the
      instrument. (Getting there needed one correction of its own: on a first visit the app routes
      straight into lesson 1, so `Learn` never renders and the first measurement was reading the
      first-run modal. Byte-identical output before and after the injection is what exposed it.)
    - **What shipped:** `AppError` (`ui.jsx`) with its own copy in five languages — deliberately not
      `LoadFailure`'s, which says the content "couldn't be downloaded" and is a lie about code that
      downloaded fine and then threw; `ScreenBoundary` around App's `<main>`, keyed on `tab` so the
      header and nav survive **and switching tabs is a real recovery** (verified live: Learn crashed,
      tapping Review rendered the queue and cleared the alert); and a **root boundary in `main.jsx`**,
      because `ScreenBoundary` is rendered *by* App and so cannot catch App's own render. The root
      one reads its language from `localStorage` via `loadLang` — verified by crashing the shell with
      `ecycles_lang=ja` and getting Japanese copy from a tree where App never rendered.
    - **PREMISE CORRECTION — the guard half as filed would have failed a correct tree.** This item
      asked §37 to assert that "every `import(` call site under `src/screens/` carries a `.catch`".
      Measured first: there are **25 `import(` lines under `src/screens/` and zero carry a `.catch`**,
      and none should — they are `() => import(...)` thunks in a loader table, and the `.catch`
      belongs to whoever calls the thunk. The unit is the **invocation** (`SOME_LOADERS[key]()`), of
      which there are **three**, not the four this item claimed. §37 asserts on the whole statement,
      since the chain is always multi-line.
    - **§37 asserts three things**, each proven by injection (eight, listed in the run log): every
      screen `App.jsx` imports from `./screens/` is rendered inside a boundary — `AsyncScreen` for the
      lazy ones, which also need the Suspense half, `ScreenBoundary` for any; `main.jsx` renders
      `<App` inside an `ErrorBoundary`; and every loader invocation carries a `.catch`. Three floors,
      per §35/§36's lesson, plus an unbalanced-tag check that fired on its own during the battery.

100. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `src/lib/chunkError.js` (call-site
    tagging), a function-form `ErrorBoundary` fallback, and `check-data.mjs` §39. Read the premise
    correction first — the defect was real and reproduced live, but "one line of code" was wrong.**
    - **The defect held, and it was proved rather than argued.** A throw injected into `Practice`,
      confirmed present in the built chunk, rendered *"This content couldn't be downloaded. Check your
      connection"* — while the console showed the probe itself executing, so the chunk had plainly
      downloaded. Both directions are now proved live: render throw → "Something went wrong",
      404'd chunk → "Didn't load", clean control → neither.
    - **"The gap is one line of code" was false, and the reason is structural.** `ErrorBoundary`
      discarded the caught error entirely — `getDerivedStateFromError()` took no parameter and
      state held only `{ failed }` — so no fallback could see *what* failed no matter how it was
      written. The real shape is three edits: capture the error, allow a function fallback, tag the
      rejection at the `lazy()` call site.
    - **The method chosen, per this item's own instruction to scope it first: tagging, not matching.**
      `chunk()` wraps the loader thunk, so an `import()` rejection is the only thing that can produce
      a `ChunkLoadError`, and the predicate is an `instanceof`. The "cheap and honest fallback" this
      item offered (widen `loadFailedBody` to cover both) was **not** needed — it would have
      discarded the network hint in the one case where the hint is true.
    - **The default is the safe direction, which is why a gap here degrades rather than lies.**
      Anything untagged takes `AppError`, whose copy is true of both events; `LoadFailure` makes a
      claim about the network that can be false.
    - **A residual measured and deliberately NOT filed as an item.** A module that downloads and then
      throws while *evaluating* also rejects `import()`, so it gets the download wording. Narrowing it
      means asking whether the rejection is a `TypeError` (what the HTML spec rejects a failed module
      fetch with) — which would trade the known-real case, a content-hashed chunk 404ing after a
      redeploy, against a case the build and `npm test` import on every run. The reasoning is written
      into `chunkError.js` so a later run does not "fix" it back.
    <details><summary>Original text of item 100, as filed 2026-08-24</summary>

    **[UX/Copy — filed 2026-08-24 by the run that closed item 99, as its stated residual rather than
    smuggled into the same commit.] `AsyncScreen` answers a render bug with a message about the
    network, and now that the right words exist the gap is one line of code.**
    - **The defect.** `AsyncScreen`'s fallback is `LoadFailure`, whose body reads *"This content
      couldn't be downloaded. Check your connection, then reload the page."* That is correct for the
      case it was built for (item 96: a content-hashed chunk that 404s after a redeploy) and **wrong
      for a render error inside a lazy screen**, which is now the more likely of the two — the chunk
      arrived, the code threw. A reader is told to check a connection that is fine.
    - **Why it was not folded into item 99's commit.** Telling the two apart needs a decision, not
      just an edit: React hands the boundary one `error` either way, so distinguishing them means
      either tagging the rejection at the `lazy()` call site or matching on the error, and matching on
      an error message is exactly the kind of thing that breaks silently across a React or Vite
      upgrade. **Scope the discrimination method before writing it.**
    - **Cheap and honest fallback if that turns out to be brittle:** widen `loadFailedBody` to cover
      both ("this screen didn't load"), losing the network hint. `AppError`'s copy already exists in
      all five languages, so the alternative costs no new translation either way.
    - **Honest priority: low.** Nobody sees either message until O-1, and both end in the same reload.
      It is a wrong-words bug, not a broken-behavior one.
    </details>

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
    `####`.** This is the third appearance of one defect class and the first time anything was left
    behind to hold it — item 90 fixed it in `LAUNCH_PLAN.md` (guarded by §32b), W-5.4 fixed 37 entries
    and 276 subsections here (guarded by nothing until now).
    - **Premise re-measured before writing, with an independent instrument**: 239 dated entries across
      the two files, **all `###`**; 282 headings inside them, **all `####`**; 13 blockquoted `> ###`
      headings in the W-5 priority block, which must be and are skipped; 0 headings inside code fences,
      fences balanced in both files. §35 reports the same 239/282, which is the agreement that makes
      the number trustworthy rather than self-confirming.
    - **Both halves are asserted, not just the entry line** — that is W-5.4's own correction encoded:
      a rule pinning only the entry's level would have permitted the flat `### entry > ### children`
      shape it removed.
    - **Four controls fired correctly** (see the run log entry of this date): a `##` dated probe and a
      `#####` child probe both failed at their injected line numbers; a fenced dated heading and a
      blockquoted one were both ignored; and breaking the dated pattern tripped both floors instead of
      passing silently.
    - **What it deliberately does not do.** It checks depth, never titles (§32 explains why the logs
      are out of scope there — entries repeat headings by design) and never content, so §31's rule
      that an entry's record must not be edited is untouched: a `#` count is not a claim.

75. **✅ DONE 2026-08-20 (owner-directed). `--fill-warn` exists in both palettes,
    `NOTE_TONES.warn.rule` points at it, and no `.jsx` under `src/` holds a hex literal any more — and
    for the thirteenth item running the premise broke, this time on the VALUE the item had already
    decided.** Item 75 proposed `#c56c05` ("would read 3.67 and sit inside the band"). As a `--fill-*`
    token that **fails `npm test`**: §28 pairs `--ink-on-fill` with every fill at AA 4.5:1, and white on
    `#c56c05` is **3.80**. The item flagged that adding a fill "perturbs §28's text-on-fill sweep" but
    never carried the number through, so its decided value was unusable. **The palette answered it
    instead:** every existing `--fill-X` is byte-identical to its `--ink-X` (accent `#2563eb`, ok
    `#047857`, bad `#b91c1c`, ink `#16181d`; and in dark `#8ab0ff`/`#54d6a0`/`#ff9a9a`/`#f3f5f9`), so
    `--fill-warn` is `--ink-warn` — **`#9a4a08` light, `#f0b95c` dark**. Measured: white-on-fill 6.26
    light and ink-on-fill 10.62 dark (both inside the sibling band), rule-on-its-own-wash 6.03 light and
    8.99 dark. **Also: the item only ever measured the light palette, and the literal was theme-blind** —
    one constant served both schemes while every sibling rule swapped. Confirmed live in both palettes.
    See the run log entry of this date. The first half (`src/content/lessons.js`) stays resolved as
    recorded below: no value change, and none should be made.
    <details><summary>Status as at 2026-08-17, with the lessons.js half's full diagnosis</summary>

    **🟡 HALF DONE 2026-08-17 (scheduled dev-agent) — and the half that was done turned out
    not to be the edit this item asked for, because the premise "a copy of the token" is FALSE for the
    `lessons.js` site.** The count reproduces exactly (two live literals, plus two correct historical
    mentions in comments; control `#c56c05` found at `src/index.css:63` as expected), but what the two
    literals *are* does not.
    - **`src/content/lessons.js:94` — RESOLVED, no value change, and none should ever be made.**
      Lesson 32's `color` is not a stale copy of `--graph-amber`. It is one of **36 distinct values
      across all 40 lessons**, a per-lesson accent set drawn from the Tailwind palette — `#d97706` is
      amber-600, the same ancestor the old token had, which is the whole of the resemblance. **And the
      field is read by NOTHING**: no `.color` access in `src/` or `scripts/` at HEAD or in the working
      tree, no dynamic `lesson[key]` access, no `check-data.mjs` rule — proved live in the built app on
      the Learn screen with both track headings rendered, where **0 of the 36 accents paint any
      element** while an injected probe carrying lesson 32's own value **was** found (so the scan
      worked). The one accent hex that does render, `#2563eb`, is `--graph-blue`/`--ink-accent` — a
      coincidental overlap, not this field. **Disposition: values kept** (40 coherent accents are
      plausibly what the owner's in-flight redesign wants; deleting a dead field to tidy it is F11's
      bad trade), **and the file header — which listed `color` among the fields "Learn/App need to
      render the path" — now says all of this instead of that false claim.** Pointing it at
      `graph.amber` would have coupled a decorative accent to an accessibility-constrained chart token
      for no reason.
    - **`src/components/ui.jsx:75` — STILL BLOCKED (owner-dirty), but now DECIDED, so the unblocking
      run only has to apply it.** This one *is* a real token gap, and a sharper one than the item
      guessed. `NOTE_TONES` gives every other tone's `rule` a token — `line.strong`, `fill.accent`,
      `fill.ok`, `fill.bad` — and `warn` is a literal **because there is no `--fill-warn` token at all**
      (confirmed: `theme.js`'s `fill` is accent/accentDeep/ok/bad/ink). So the fix is **add
      `--fill-warn` to both palettes and point `NOTE_TONES.warn.rule` at `fill.warn`**, not rename the
      literal.
      **Measured, with the published-WCAG control (21.00 / 1.00 / 4.54 / 3.03, all reproducing to
      0.01):** the warn rule on its own wash is **`#d97706` on `#fffbeb` = 3.07** — item 75's "not an
      accessibility finding" is *technically* right (3:1 is met) but the margin is **0.07**, and every
      other colored tone clears by a mile (accent 4.62, ok 5.21, bad 5.91). **That is item 65's
      finding again, one file over: not a token with a tight pair, a token outside the band its
      siblings share.** `#c56c05` would read 3.67 and sit inside it; `ink.warn` (`#9a4a08`) reads 6.03.
      (`neutral` is 1.32 and is not a violation — `line.strong` is a hairline conveying no state.)
      **Not built this run on purpose:** adding a fill token whose only consumer is a blocked file
      leaves dead code *and* perturbs §28's text-on-fill sweep, so it lands as one change or not at all.
    <details><summary>Original filing (2026-08-17), premise now corrected above</summary>

    **`#d97706` still exists twice in the source as a hardcoded hex, and it no longer
    matches the token it was copied from.** Item 65 moved `--graph-amber` to `#c56c05`; these two did
    not move with it, because neither is a graph token and one of them is in a file the owner has open:
    - `src/components/ui.jsx:75` — the `warn` callout's `rule` color. **Owner-dirty this run, so it was
      not touched**; check `git status` before picking this.
    - `src/content/lessons.js:94` — lesson 32's accent color.
    - **The decision, not the edit, is the work:** either they are the same amber as the charts and
      should read `graph.amber` / a token, or they are independent and should say so. Today they are
      neither — a copy of a value that has since changed, which is how the two silently drift further.
    - **Not an accessibility finding.** A callout rule and a lesson accent are not graph tokens; §28b
      does not bind them, and §28's AA check already covers the text beside them. This is consistency
      and future drift, at **honest priority: low** — and it is genuinely small, which is the only
      reason it is worth filing rather than dropping.

    </details>
    </details>

65. **✅ DONE 2026-08-17 (scheduled dev-agent) — decided AMBER MOVES, because re-measuring the item's
    own figures changed the answer.** Light `--graph-amber` is now **`#c56c05`** (was `#d97706`): same
    hue 32° and saturation 95%, HSL lightness **43.7% → 39.7%**. All three `GRAPH_EXEMPT` entries are
    gone, `§28b` runs **70 pairs, 0 exempted**, and the charts-on-card premise check went with them.
    - **What decided it.** This item said amber "clears the bar on the surfaces that matter today
      (card 3.44, canvas 3.24)". **Neither number reproduces: card was 3.19, canvas 3.08** — margins of
      **0.19 and 0.08**, not 0.44 and 0.24, and the two figures are not even mutually consistent (one
      color on card and canvas can only differ by a factor of 1.029, so 3.44 forces 3.34, never 3.24).
      `src/index.css` has not changed since the commit that filed this item (`git diff 3c84155 HEAD --
      src/index.css` is empty), so they were wrong when written, not overtaken. The three exempted
      ratios (2.92 / 2.85 / 2.91) and the 3.02 ok-wash figure *did* reproduce exactly.
    - **Why the corrected numbers flip the verdict.** With the real figures, amber's **best** case
      (3.19, on card) sat below every other graph token's **worst** case (green 3.37, neutral 3.36, red
      4.32, blue 4.62). It was not "one token with three awkward pairs"; it was one token outside the
      band the other four share. `#c56c05` is the smallest darkening that puts it inside — **3.40 worst,
      3.80 on card** — which is a palette-consistency argument, not "darken until the check passes".
    - **Why the charts-on-card check was deleted too.** Its stated job was to keep the three exemptions
      safe. With zero exemptions it guards nothing, and left in place it would fail a build for moving a
      chart onto `surface.sunken` — a layout choice with no accessibility consequence now that all five
      tokens clear 3:1 on all seven surfaces. Same trade as F11's: a check that breaks the owner's
      in-flight redesign to protect a premise nothing needs is a bad check. The cartesian below is the
      stronger guard it was standing in for.
    - **Proved by injection, both directions.** Reverting the token to `#d97706` fails §28b three times
      with the exact old ratios; adding one now-passing pair back to `GRAPH_EXEMPT` fails with the
      stale-exemption message. Both files restored from a scratchpad copy and `shasum`-confirmed
      identical. Verified live in the browser too: the budget bar's amber segment and the flat yield
      curve both compute to `rgb(197, 108, 5)` on `rgb(255, 255, 255)`.
    - **Left alone on purpose:** two hardcoded `#d97706` literals that are not this token — see item 75.

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
    The `es` calque is rewritten in `src/content/glossary.js` (`Brokerage Account`.`es.f`): "los dividendos
    y **las ganancias realizadas**" → "los dividendos y **cualquier ganancia obtenida al vender una
    inversión**" — the same treatment item 67 gave `en`, mirroring its "any profit made when an investment
    is sold". One clause, one line, rendered-verified in Spanish in the live app.
    **The correction worth keeping, because four consecutive runs paid for it.** Every "Next run" line
    since 2026-08-17 listed this item as **blocked on `src/locales/es.js`**. That file has nothing to do
    with it: it holds UI strings, and `grep` finds **0** occurrences of this glossary prose anywhere in it.
    The text has always lived in `src/content/glossary.js`, which was **clean the entire time**. The block
    was asserted once and copied forward four times without re-measurement — the same "queued pick was
    already blocked" pattern item 62's blockquote named, but inverted: here the *block itself* was fiction.
    **Eleventh consecutive item with a wrong premise, and the third where re-measuring changed the
    disposition rather than a figure.** A queuing run must name the file it means and check it.
    - **Measured before editing; every control fired.** `en` carries item 67's rewrite (`true`) and no
      longer contains `realized gains` (`false`); `es.f` reads back a known phrase (`Cuenta que contiene
      inversiones`, `true`) so the instrument was proven able to see the field before it was trusted for a
      negative; the calque was present (`true`). `ganancias realizadas` occurs **exactly once in the whole
      `es` glossary** — so the item's "one clause, not a survey" is correct, measured rather than assumed.
    - **The `en`-only instrument must not move, and did not.** `npm run jargon -- glossary` reads **54
      candidates / 14 control** before and after, unchanged, because the extractor hardcodes `entry.en?.f`
      and `entry.en?.ex` (`scripts/jargon-candidates.mjs:121-122`). That is both the proof the edit was
      `es`-only and a restatement of *why* this gap existed at all.
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
    - **The bigger version of this item ✅ BUILT 2026-08-18 — and its premise was wrong in both
      directions.** Scope was: point `jargon-candidates.mjs` at a non-`en` locale. Shipped as
      `npm run jargon -- glossary [en|es|ko|zh|ja]`, **but not as scoped.** Two corrections, both
      measured (full table in the 2026-08-18 run-log entry):
      - *"No instrument covers non-`en` glossary prose"* is **FALSE as written** —
        `check-blindspot.mjs` scans all five locales in `src/content/` and the run directly above this
        one proved it by injection. The true claim is narrower: none covers it **for jargon**.
      - *"The rules are English-shaped"* is **TRUE and understated.** Pointed at ko/zh/ja the extractor
        does not fail loudly — it returns a **PASSING control and ~1 candidate**, because the control
        bucket fills with Latin acronyms (GDP, IRA, CPI, PMI, VIX) left untranslated in the prose. The
        ko/zh/ja control buckets are identical and hold **zero** Hangul/Han characters. The old control
        is **anti-correlated with instrument validity** — it passes where the tool is blindest and fails
        on `es`, the one locale emitting real words. A flag built as filed would have answered the
        `zh`/`ja` question with a false green.
      - **So what shipped is a script-aware two-sided control** (detector, then extractor) that makes
        every non-`en` locale exit 1 naming the three causes: `norm()` strips non-ASCII so a CJK token
        cannot be represented at all, the acronym/capitalised rules need letter case, and the n-gram
        sweep needs whitespace plus English head nouns. **Do not "fix" this by loosening the control.**
    - **The `zh`/`ja` content question is now item 76 and is genuinely blocked.** It is NOT answerable
      by reading the strings — that is the unmeasured multi-language drift this item exists to prevent.

68. **✅ DONE 2026-08-17 (scheduled dev-agent) — built as scoped, minus one half that was measured and
    honestly declined. The glossary report is 57 → 54 and, for the first time, an in-place expansion
    makes the number go DOWN.** `jargon-candidates.mjs` now recognizes a **self-defining gloss** and
    drops those terms from the CANDIDATES bucket. Three things about how it was built are the item:
    - **A gloss is recognized only when the expansion spells the acronym** — its words' initials, in
      order, allowing lowercase connectors (`of`, `and`, `the`…) — and sits adjacent to it. Both paren
      orders occur in this content and both are handled: `National Bureau of Economic Research (NBER)`
      (glossary `Recession`) and `CPI (Consumer Price Index)` (economy lesson prose). The second was
      found by the rule, not by me — useful evidence it is not NBER-shaped special-casing.
    - **The apposition half was NOT built, and that is a measurement, not timidity.** This item's own
      scope named item 64's `the annual rate — the APR — on your credit card`. It cannot be verified by
      any initial rule: `annual rate` spells `ar`, not `apr` (the real expansion, "annual percentage
      rate", is not in the prose). Suppressing it would mean suppressing on **punctuation** rather than
      on evidence, which would silently hide bare acronyms written in apposition. That instance is also
      in no report today — one occurrence, below the lesson corpus's reach threshold. The reasoning is
      in the script header so the next run doesn't re-litigate it.
    - **Suppression applies to the acronym and capitalised-phrase rules only, never to the head-noun
      n-gram sweep, and never to extraction itself.** The second half is the subtle one: `GDP`, `IRA`,
      `PMI`, `QE` and `QT` are all glossed somewhere in this content **and** are glossary terms, so
      suppressing at extraction time would have cut the CONTROL count below its recorded 14/12/9/19
      while looking like a clean change. Filtering the candidates bucket alone leaves all four controls
      untouched — verified, not intended.
    - **The control ships with it, in both directions** (a suppression rule fails by doing nothing *and*
      by doing everything, and neither is visible in corpus output): a fixed probe is driven through the
      **real** `scanDoc` path asserting that a glossed acronym and a fragment of its own expansion are
      suppressed, while a bare acronym and an unrelated capitalised phrase are not. Proved by three
      injections — dead rule, over-matching rule, and a bare `NBER` added to a second glossary entry
      (which correctly un-suppressed the term while its expansion fragments stayed suppressed). See the
      run-log entry of this date.
    *Original filing follows.* **[Instrument — filed 2026-08-17 by the run that expanded `NBER`, because
    its own fix did not move
    the number and that is worth recording rather than hiding.] The acronym rule cannot tell "bare
    acronym" from "acronym expanded right next to it", so an in-place fix does not clear the report.**
    `jargon-candidates.mjs` matches `\b([A-Z]{2,6}|\d{3}\(k\))\b` and records the token; it has no
    notion of a gloss. After `NBER` → `National Bureau of Economic Research (NBER)`, the reader's
    problem is solved and **the report is unchanged** — `NBER` is still listed, and the expansion adds
    two *new* fragment candidates (`National Bureau`, `Economic Research`).
    > **Correction, 2026-08-17 (the run that closed this item, by re-measuring rather than re-reading):
    > "unchanged" was understated — the report went UP, 56 → 57.** The two fragments this filing itself
    > names were never subtracted from its own headline figure, so the entry and item 67 both recorded
    > "56 → 55". Reproduced in a throwaway clone: `HEAD~1` = 56, `HEAD` = 57, control 14 at both. That
    > makes the case for this item stronger than it was filed as, not weaker.
    - **Why this was not mistaken for a failed content fix, and the trap it sets for the next run.**
      `APR` is absent from the `economy` report **not** because item 64 taught the instrument anything,
      but because it falls in that corpus's 269 lower-reach suppressed candidates. Glossary mode uses
      threshold 1 by design (item 66), so nothing is suppressed there. **A future run that "fixes" an
      acronym in the glossary and then checks the report will see no change and may conclude its edit
      failed.** It did not.
    - **Scope if built:** suppress an acronym whose expansion appears adjacent in the same doc — i.e.
      treat `Expanded Form (ACR)` and `the expanded form — the ACR —` (item 64's shape) as
      self-defining. Must ship with a control proving a *bare* acronym is still caught, per the
      standing injection rule. **Honest priority: low.** It changes a report's noise floor, not a
      rendered surface — and the noise is already the documented normal condition of this mode.

67. **🟡 TWO-THIRDS DONE 2026-08-17 (scheduled dev-agent) — the two terms that needed no new key are
    fixed and rendered-verified; only the `Dividend` half is still blocked.** `realized gains` and
    `gov bond` are gone from `glossary.js` and from the report (~~56 → 55 candidates~~ **56 → 57 —
    corrected 2026-08-17 by the run that closed item 68, which re-ran the measurement instead of
    re-reading it; the `NBER` expansion's two fragment candidates were never subtracted from this
    figure. Item 68's rule now takes it to 54.** Control still 14 throughout); `NBER` is expanded in
    `en`/`es`/`ja`. **The blocked remainder is exactly one thing:**
    `dividends` still has no `Dividend` entry, because adding a key moves `LAUNCH_PLAN.md` §1's
    gated "32 glossary terms" and that file still has owner edits in flight. See the run-log entry
    of this date; the per-term detail below is kept because the reasoning still applies.
    <details><summary>Original filing (2026-08-17), with per-term status</summary>

    **[Content — the step-2 decision item 66 said to make once, with the number in hand. Filed
    2026-08-17 by the run that measured it. BLOCKED the same way item 64's `Dividend` is.]
    Three of the 56 glossary-definition candidates are real; the rest is noise, and that is the
    finding.** The measurement (below, and reproducible via `npm run jargon -- glossary`) returned 56
    candidates across 32 entries. Read one by one, **53 are extractor noise or ordinary compositional
    English** — acronym-rule hits on the shouty emphasis in `Fed Funds Rate` (`THE`, `ALL`), fragments
    of an entry's own key (`fed funds`, `funds rate`), and phrases like `higher deductible`,
    `regular payment`, `investment account` that need no definition. **The genuine residual is three
    terms**, and none is a surprise of scale — item 66 predicted one and there are three:
    - **`dividends`** (`Brokerage Account`.`en.f`) — item 66's confirmed instance, unchanged.
      **Already solved and already blocked:** the `Dividend` entry is written, verified and sitting in
      `scratchpad/{glossary.with-dividend.js,lessonTerms.with-dividend.js,dividend-glossary.patch}`
      from item 64. Ships with that.
    - **`realized gains`** (`Brokerage Account`.`en.f`) — a tax term of art, used as though known.
      **This one is the argument for the whole item:** it occurs in *no lesson at all* (proved — the
      lesson corpus returns 0 for it, the glossary corpus 1), so it was unreachable by every
      instrument the repo had until now. Not merely unchipped: unmeasurable.
      **✅ FIXED 2026-08-17 by rewrite, not by an entry** — "dividends and **any profit made when an
      investment is sold** are normally taxed in the year they occur." The clause no longer needs the
      term, so no key was added and no gated figure moved. `en` only; see item 69 for the other four.
    - **`NBER`** (`Recession`.`en.f`) — an unexpanded acronym, the exact shape item 64 fixed for APR.
      Weaker than the other two: the sentence around it ("US recessions are dated by the NBER using
      broader criteria") does most of the work, so this may be a one-word expansion rather than an
      entry.
      **✅ FIXED 2026-08-17 in place** — "dated by the **National Bureau of Economic Research (NBER)**".
      Done in `en`, `es` and `ja`; **`ko` and `zh` already expanded it** (`NBER(전미경제연구소)`,
      `NBER（美国国家经济研究局）`), so on this one point the Beta translations were **ahead of the
      English**, which is worth not re-deriving. **The extractor still reports `NBER`** — expected, not
      a failed fix: see item 68.
    - **Also worth one line, not an entry:** `gov bond` / `gov bond rates` (`Credit Spread`,
      `Yield Curve`) is an *abbreviation* — "gov" — in learner-facing copy, which is a plain-language
      question (the real product definition's bar), not an undefined-jargon one.
      **✅ FIXED 2026-08-17** — both now read "government bond". Note both entries' `ex` strings already
      said "government bonds" in full, so the abbreviation was inconsistent *within its own entry*.
    - **Why nothing was fixed in the same run, and it is not timidity.** Adding any glossary key moves
      `LAUNCH_PLAN.md` §1's generated "32 glossary terms", which `npm test` gates — and that file has
      owner edits in flight. This is the identical blocker that stopped item 64's `Dividend`, proved
      there rather than predicted. Expanding `NBER` or `gov` in place adds no key and is *not* blocked,
      but it is a content edit and item 66's own scope note says measure first, fix separately.
    - **Scope when unblocked:** ship `Dividend` from scratchpad (item 64), decide `realized gains`
      (entry, or rewrite the clause to not need one — the cheaper option and probably the right one),
      and expand `NBER`/`gov` in place. **Honest priority: low-medium.** Three terms on a surface a
      reader reaches only by tapping a chip.
      > **Resolved 2026-08-17:** the rewrite *was* the right call — it cost one clause and moved no
      > gated figure, where an entry would have cost §17b chip decisions in every lesson using the
      > term. **All that remains of this item is `Dividend`.**

    </details>

66. **✅ DONE 2026-08-17 (scheduled dev-agent) — measured, and the instrument is permanent.**
    `npm run jargon -- glossary` now points the existing extractor at `glossary.js`'s own `en.f`/`en.ex`
    strings: 32 entries, 70 raw candidates, 56 reported, **14 known glossary terms re-found by the
    control**. The residual is **three real terms, not a body of them** (item 67 carries the decision).
    Two design calls are recorded in the script header rather than here: self-reference needs no special
    case (a term in its own definition is a glossary key, so the existing subtraction handles it), and
    **the reach thresholds drop to 1 on this corpus** because a glossary is not read in order — curation
    rule 2 has no analogue when the reader arrives at one entry from a chip and reads only that entry.
    **The run also found and fixed a false positive in the contiguity control** (`$1,000 deductible`):
    `norm` splits inside a number, so rejoining needed the very comma the clause rule forbids. The join
    now relaxes only when **both** sides of a gap are digits — proved narrow by re-injecting the dead
    clause-break guard and confirming `"stocks Bonds", "interest taxes"` are still caught. See the run
    log entry of this date.
    > **The premise held for once, and the scale held too.** Six of the last seven items had a partly
    > wrong premise. This one predicted "one confirmed instance, the rest unmeasured" and the rest
    > measured out at two more — a rare case where the filing run guessed the shape right. Worth not
    > re-deriving: **`realized gains` appears in zero lessons**, which is the cleanest possible proof
    > that this corpus was genuinely unreachable rather than merely unchecked.

    <details><summary>Original filing (2026-08-17)</summary>

    **[Content/Instrument — a learner-facing surface BOTH jargon instruments are blind to. Filed
    2026-08-17 by the run that closed item 64's APR and phantom halves; found by accident, which is
    the point.] Glossary definitions are prose that no undefined-jargon check reads.** `npm run
    jargon` builds its corpus from lesson `heading`/`body`/`takeaway`/`thinkAbout`
    (`jargon-candidates.mjs`); §17b's `mentionedIn` reads lesson `heading`+`body`
    (`check-data.mjs`). **Neither ever opens `glossary.js`'s own `f` and `ex` strings** — so §3.0.3's
    "no undefined jargon" is measured across lessons and nowhere else, while a reader who taps a chip
    lands on exactly this text.
    - **The one confirmed instance, measured not suspected:** `Brokerage Account`'s `en.f` says
      "…**dividends** and realized gains are normally taxed in the year they occur…". `Dividend` is
      not a glossary key (item 64, blocked), so a reader meeting the word here has no next step.
      That single instance is why this is filed rather than assumed — **the rest of the file is
      unmeasured**, and the first job is to measure it, not to fix anything.
    - **Scope, and the trap.** Step 1 is a measurement: run the existing extractor over
      `glossary.js`'s `f`/`ex` strings and see how large the residual actually is. Step 2 is a
      decision that should be made *once*, with the number in hand — glossary text is written for a
      reader who is already looking something up, so "define every term used in a definition" is
      circular past a point. **Do not add keys to shorten a list** (the `READING THIS` note in
      `jargon-candidates.mjs` says this, and it applies with more force here, since every new key
      also obliges §17b chips across every lesson that uses it — item 64's Stock/Bond half was 15
      lessons of chip decisions).
    - **Cheap and self-limiting:** the corpus is ~32 entries × 2 strings, all in one file, and the
      extractor already exists. This is a measurement run, not a content run.

    </details>

60. **✅ DONE 2026-08-17 (scheduled dev-agent). The residual now has an instrument (`npm run jargon`),
    and the one real gap it found is closed: Brokerage Account is a glossary entry, chipped on lesson 6.
    For the seventh item running the premise was partly wrong — and this time the wrong half was the
    *scale*, not a number.** The item implies a body of undefined money-track jargon. There was one
    occurrence. 43 candidates cleared the reach threshold; **42 are either defined inline where they
    first appear or covered by curation rule 2** (the lesson whose subject *is* the term), and most of
    the list is ordinary compositional English ("savings account", "monthly payment") that needs no
    definition at all. The single genuine miss was a **forward reference**, a shape this item did not
    predict: lesson 6 §0 contrasts "an ordinary brokerage account" with a 401(k) **seven lessons before
    lesson 13 defines what a brokerage account is**, so that occurrence satisfied neither branch of
    §3.0.3. Adding the glossary entry hands the whole class to §17b, which now sweeps 30 keys and holds
    lesson 6's chip and lesson 13's rule-2 exclusion in place permanently. See the run log entry of
    this date.
    > **Two premise corrections worth not re-deriving.** (a) **APR is not money-track jargon** — it
    > appears exactly once in all 40 lessons, in *economy* lesson 35's list of rates that follow the Fed
    > ("the APR on your credit card"), where the sentence's job is the Fed transmission, not APR. Filed
    > with its disposition in item 64. (b) **"beneficiary" is not a gap**: lesson 14 is titled "Wills
    > and Beneficiary Designations" and rule 2 applies — its 9 uses are the lesson teaching the term.
    > **And the residual is still a residual.** `0 unexplained` now covers 30 keys instead of 29, which
    > is not the same as "no undefined jargon" — the instrument reports, it does not certify. Its
    > threshold (≥2 lessons or ≥3 uses) suppressed 422 lower-reach candidates that were never
    > individually read; APR is proof that the suppressed tail can hold a real one.
    <details><summary>Original text of item 60, as filed 2026-08-17</summary>

    **[Content — the residual §17b cannot see, filed 2026-08-17 by the run that closed item 57 rather
    than left implied.] §3.0.3 is now enforced for the 29 glossary terms and for nothing else.**
    `check-data.mjs` §17b proves every *glossary-term* use in all 40 lessons is either chipped or
    deliberately excluded (`0 unexplained`). It cannot see a jargon word that has **no glossary entry**,
    so the honest reading of that zero is "the terms we have definitions for are all handled", not
    "§3.0.3 holds". The gap is real: `lessonTerms.js`'s own header records that before item 35 the
    glossary was 17 entries and all macroeconomic, and item 35 added money-track vocabulary by
    *grepping the lesson bodies* — a method that finds words already in the glossary's neighborhood,
    not words the lessons use and never define.
    - **Scope, and the measurement to do first:** extract the money-track lessons' distinctive nouns
      (the §0 track, 28 lessons) and diff them against `glossary.js` — candidates the header already
      names as absent include APR and beneficiary. Then decide per candidate: add a glossary entry
      (making it chippable), or confirm the lesson defines it inline. **Do not batch-add entries to
      make a number go up** — each one is learner-facing copy under §10.1, where a definition says what
      a thing *is* and never what to do about it.
    - **Carry a control, and expect the premise to be partly wrong.** Items 55, 56 and 57 were each
      filed against a real clause with wrong numbers. Before believing any candidate list, assert that
      the extractor finds a word that IS already in the glossary (the item-57 control's shape), and
      check what already covers the surface — §17b, §17 and item 35's notes — before building anything.
    - **Honest priority: below item 58.** This is content growth on a clause whose measurable half is
      now green, and §4.3's content gates are both met. It is worth doing well, not doing soon.
    </details>

64. **[Content — the three candidates item 60's run measured and deliberately did NOT add, filed
    2026-08-17 by the run that closed it. Each is a decision, and the reason they are together is that
    "add a glossary entry" is the same decision three times, not that they should be batched.]**
    Run `npm run jargon` to reproduce every figure below. **✅ ITEM FULLY DONE 2026-08-20
    (scheduled dev-agent). Stock/Bond, APR and residual (b) closed 2026-08-17; `Dividend` — the last
    piece, blocked since then on an owner-dirty `LAUNCH_PLAN.md` — landed 2026-08-20 the first run
    after the block lifted. Nothing in this item is open.**
    - **✅ DONE 2026-08-17. Both keys added, 21 chips across 15 lessons, 2 exclusions on lesson 5,
      `0 unexplained` held. For the eighth item running the premise was wrong somewhere — and this
      time the wrong number was the one that had been used to defer the work: the SCOPE.** The item
      says "every one of those 24 lessons", which is `14 + 10` — but **7 lessons use both words**, so
      the real union is **16 lessons**, one of which (money 5) is the definition lesson. The job was
      15 lessons of chip decisions, not 24 of them, and the estimate that made it look like "a
      content-review job of a different size" was double-counting. The per-term figures are also
      slightly off, for a reason worth keeping: **`npm run jargon` scans heading + body + takeaway +
      thinkAbout, while §17b scans heading + body only** (`scripts/jargon-candidates.mjs:72-76` vs.
      `check-data.mjs`'s `mentionedIn`), so the two instruments measure different surfaces —
      §17b's are stocks **13 lessons / 43 uses**, bonds **10 / 41**. See the run log entry of this
      date. *Original text:* **`Stock` and `Bond` have no glossary entry, and they are the
      highest-reach absence in the app: stocks in **14 lessons / 47 uses**, bonds in **10 / 44**,
      defined only in money lesson 5 ("Stocks,
      Bonds & Diversification").** Every use in lessons 6, 13, 25, 28 and across the economy track meets
      a reader who may never have opened lesson 5 — tracks unlock independently, so an economy-first
      reader reaches lesson 38's stocks-and-bonds discussion having been taught neither.
      **Why item 60's run did not do it:** two new keys oblige a chip or a written exclusion in *every
      one* of those 24 lessons under §17b, which is a content-review job of a different size than the
      one-lesson fix it shipped, and doing it badly means 24 hasty exclusions that permanently grant
      cover. **This is the real item here; the other two are small.**
    > **Two residuals this run measured and left, so they are not re-derived.**
    > **(a) §17b cannot see a takeaway or a thinkAbout.** Chips render per *section*
    > (`LessonReader.jsx` calls `termsForSection`), so a term used only in a lesson's closing lines has
    > nowhere to hang one — and §17b, sharing that surface, neither obliges nor forbids anything there.
    > Exactly one lesson is in that position today: **money 11's thinkAbout says "stock-picking skill"**
    > and its body never says "stock". Measured, not suspected; disposition **no action** — the phrase
    > points at Lesson 5 in the same sentence. Filed here as the honest statement of what "0
    > unexplained" now covers. **(b) `npm run jargon` now reports a phantom candidate `stocks Bonds`
    > (4 lessons)** — an extractor artifact from the prose "stocks, bonds, or funds", whose two halves
    > are both glossary keys as of this run. The control (`buckets disjoint`) cannot catch it because
    > the pair matches neither key. Cosmetic, report-only, one script: a good small pick.
    > **✅ DONE 2026-08-17 (scheduled dev-agent) — and it was not cosmetic.** The cause was a **dead
    > guard**: the n-gram builder tested the *punctuation-stripped* word for `/[.,;:!?"]/`, one line
    > after the strip that deletes exactly those characters, so the check that was supposed to stop a
    > phrase spanning a clause had never once fired. `stocks Bonds` also spans a **full stop**, not
    > only commas (money 5: "…many different stocks. Bonds don't sidestep…"), which is where its
    > capital B came from. Fixing it removed **51 raw candidates (474 → 423)** and a second reported
    > phantom, `interest taxes`. **A worse bug surfaced while fixing it:** the surface-form set omitted
    > §17b's optional plural, so **`index funds` — `Index Fund`, a glossary entry since item 35 — was
    > sitting in the CANDIDATES bucket being reported as undefined jargon**, i.e. the instrument was
    > inviting a future run to add a duplicate entry. Control moved 11 → 12 known when fixed. Both
    > bugs were invisible to the existing control, which rebuilt its independent form set with the
    > same missing plural; **both now have controls** (a reported multi-word phrase must occur
    > contiguously in the corpus; the independent set carries plurals), each proved by injection.
    - **`Dividend`: ✅ DONE 2026-08-20 (scheduled dev-agent). The block was gone — `LAUNCH_PLAN.md`'s
      worktree sha1 and `HEAD` sha1 both read `6230d855`, and the whole tracked tree was clean. The
      saved patch still applied (`git apply --check` exit 0, 12 added / 0 removed, exactly as this
      item promised), so "save patches, not whole-file copies" is now proven over a 3-day gap and two
      intervening commits to the same file. TWO PREMISE CORRECTIONS, both from the essentials split:
      the uses are in the ESSENTIALS track, not money — the ids 3 and 6 did not move, so every saved
      coordinate stayed valid and only the word "money" was wrong — and the count is 3 raw
      occurrences but 2 tokens, because one is the hyphenated adjective "dividend-paying stocks",
      which the extractor does not emit as a bare term. See the run log for the full accounting.
      *Original text:* **`Dividend`: 3 uses, lessons 3 and 6, never defined. ⛔ BLOCKED on
      `LAUNCH_PLAN.md` being owner-clean — re-verified 2026-08-18 (worktree
      sha1 `07313fd0` != `HEAD` sha1 `967cee51`, so it was still owner-dirty).
      🔴 **BUT THE SAVED WORK IS PARTLY POISONED, FOUND 2026-08-18. The previous instruction here —
      "Do not re-derive it; apply the saved work", naming three artifacts as equals — would have
      silently reverted two later runs' shipped content fixes. Read this before touching any of
      them.** The artifacts were saved 2026-08-17 12:10; `src/content/glossary.js` has been committed
      twice since, and one artifact is a *whole-file copy* that predates both.
      - ❌ **`scratchpad/glossary.with-dividend.js` — DO NOT APPLY. It is a stale whole-file copy.**
        Measured against `HEAD` (files written to disk and diffed, not piped — see the Environment
        note): **4 changed line-pairs + 16 added lines**, where only 12 of those added lines are the
        Dividend entry. The other 4 are older text for **`Yield Curve`, `Credit Spread`, `Recession`
        and `Brokerage Account`**, and copying the file in reverts all four:
        `86c356c` (2026-08-17 14:11, item 67) expanded `gov`->`government` in the first two, `NBER`->
        `National Bureau of Economic Research (NBER)` in `Recession` (en/es/ja), and rewrote
        `Brokerage Account` en `realized gains`->`any profit made when an investment is sold`;
        `e346771` (2026-08-18 00:11, item 69) then rewrote that entry's **es** calque. **So the copy
        would undo items 67 and 69 in one paste — the exact unmeasured multi-language drift item 69
        exists to prevent — and it would do it invisibly, because the paste "succeeds".**
      - ✅ **`scratchpad/dividend-glossary.patch` — THIS IS THE ARTIFACT TO USE.** It touches only
        `src/content/glossary.js`, `git apply --check` exits **0** against the current tree, and
        applied to an isolated copy of `HEAD`'s file it is **purely additive: 0 lines removed, 12
        added.** It survived because a contextual patch's hunk sits below the four entries that
        moved — which is the general lesson: **a saved whole-file copy rots silently, a patch fails
        loudly. Save patches.**
      - ✅ **`scratchpad/lessonTerms.with-dividend.js` — still exactly right**, re-diffed against
        `HEAD` this run: the only changes are the two intended chips (lesson 3 §2 and lesson 6 §0)
        plus their 3-line comment. Nothing else in that file moved.
      - ⚠️ **All three live in an ephemeral session scratchpad** (`/private/tmp/claude-501/.../`
        session `48dad761-ee6d-4adf-94a9-c298881d7dd2`) which is temp and will be cleaned — they were
        still present 2026-08-18, but do not count on that. **The entry text is therefore inlined
        here, so the content survives the directory:**

      ```js
  "Dividend": { en: { s: "Dividend", f: "A share of a company's profits paid out in cash to the people who own its stock. Not every company pays one — many put the profit back into the business instead — and a dividend is separate from any change in the stock's own price.", ex: "A company that earns a profit can keep it to grow the business or pay part of it out to its shareholders as a dividend." }, ko: { s: "배당금", f: "회사가 번 이익의 일부를 그 주식을 가진 사람들에게 현금으로 나눠 주는 것. 모든 회사가 배당금을 지급하지는 않으며(이익을 사업에 다시 투입하는 회사도 많습니다), 배당금은 주가 자체의 등락과는 별개입니다.", ex: "회사는 이익이 나면 사업을 키우는 데 쓸 수도 있고, 그중 일부를 배당금으로 주주에게 나눠 줄 수도 있습니다." }, es: { s: "Dividendo", f: "Una parte de las ganancias de una empresa que se reparte en efectivo entre quienes poseen sus acciones. No todas las empresas lo pagan — muchas reinvierten ese beneficio en el negocio — y el dividendo es independiente de lo que suba o baje el precio de la acción.", ex: "Una empresa que obtiene beneficios puede quedárselos para hacer crecer el negocio o repartir una parte entre sus accionistas como dividendo." }, zh: { s: "股息", f: "公司把利润的一部分以现金形式分给持有其股票的人。并非所有公司都派发股息——许多公司会把利润重新投入业务——而且股息与股价本身的涨跌是两回事。", ex: "公司赚到利润后，可以留下来扩大业务，也可以把其中一部分作为股息分给股东。" }, ja: { s: "配当", f: "会社が上げた利益の一部を、その株式を持つ人たちに現金で分配するもの。すべての会社が支払うわけではなく（利益を事業に再投資する会社も多くあります）、配当は株価自体の値動きとは別のものです。", ex: "会社は利益が出たとき、事業を大きくするために手元に残すことも、一部を配当として株主に分配することもできます。" } },
      ```

      The two `lessonTerms.js` edits are equally small: lesson `3: { 2: [...] }` gains `"Dividend"`
      after `"Stock"`, and lesson `6: { 0: [...] }` gains `"Dividend"` after `"Stock"` — both as
      chips, **not** `defined-here` exclusions, because both are uses rather than definitions.
      **The decisions already made, so the next run does not re-open them:** entry placed at the end
      of the money-track block (money-track by measured use, but it leans on `Stock` and is not a
      separate instrument). A fourth use that **neither instrument can see** — the glossary's own
      `Brokerage Account` definition says "dividends" in `en` — is filed separately as **item 66**.
      **Why the block is hard, not a judgment call:** adding any glossary key moves `LAUNCH_PLAN.md`
      §1's generated "**32** glossary terms" figure (line 65), which `refresh-readiness.mjs` checks
      and `npm test` fails on. This was proved in 2026-08-17's run, not assumed: with the entry and
      both chips in, the *only* remaining failure was that one LAUNCH_PLAN line, and §17b read
      **104 uses / 68 chips / 0 unexplained**.
      **Next run: if `LAUNCH_PLAN.md` is clean**, apply the patch (or paste the entry above), make
      the two `lessonTerms.js` edits, run `npm run readiness -- --write`, then `npm test`. **If it is
      still dirty, do not attempt it.**
    - **`APR`: 1 use, economy lesson 35, acronym never expanded. ✅ DONE 2026-08-17 (scheduled
      dev-agent), exactly as the recommended disposition said** — expanded in place to "the annual
      rate — the APR — on your credit card", no glossary key added for one incidental use. Premise
      confirmed before editing: `APR` appears **once** in all of `src/`, and **only in `en`** — the
      other four locales carry abridged summaries of that section which never use the acronym, so
      this was an en-only edit. Two consequences worth keeping, because neither was in the item:
      **(a)** `lessonTerms.js`'s lesson-35 `Credit` exclusion quotes that sentence verbatim as its
      reason, so the quote was updated in the same commit or it would have gone stale on arrival;
      **(b)** editing English content marks that lesson's four translations **stale** in
      `translation-review-ledger.json` (correct behavior — the ledger hashes the English source),
      which failed `npm test` on the §10.4 coverage figure. Resolved by actually re-reading lesson 35
      in all five languages and re-marking via `translation-review.mjs mark ... ai` — see the run log
      for why the abridged translations are unaffected by an acronym expansion.
      Note this one sits *below* `npm run jargon`'s reach threshold: it was found by hand while checking
      item 60's premise, which is the honest argument for reading the suppressed tail occasionally.

61. **✅ DONE 2026-08-17 (scheduled dev-agent). All 9 mechanical corrections applied, plus both guards
    the item asked for — and for the fourth item running the premise was wrong in one place, which is
    the part worth keeping.** **F7's "five render sites" was itself a miscount: there are six.**
    `src/screens/reference/Sectors.jsx:178` renders `t.disclaimer` through a plain `<Text>` rather
    than the `<Disclaimer>` component, so item 58's component-shaped grep could not see it — the same
    instrument-blindness pattern items 33/36 recorded, committed *by the sweep that exists to catch
    drift*. The §10.1 surface guard therefore matches the **string**, not the component, and all six
    surfaces plus the first-launch modal were verified **rendering in a live browser** with Glossary as
    a negative control. Also raised §26's `EXPECTED_EXEMPTIONS` 11 → 12 (no new exempted path;
    `lessonContent.money.js` is now named twice in `DECISIONS.md`, by the entry it supersedes and the
    entry that supersedes it). The 4 judgment findings were correctly left alone and are now item 62.
    See the run log entry of this date.
    <details><summary>Original text of item 61, as filed 2026-08-17</summary>

    **[Process — P1 of what is left, and the cheapest real item on this list. Filed 2026-08-17 by the
    run that closed item 58; the measurement is already done, so this is execution, not discovery.]
    Apply the 9 mechanical corrections from item 58's sweep.** Each is "make the document match a tree
    fact that was measured, with the measurement in the run entry of 2026-08-17." Ordered by value,
    with F-numbers matching that entry:
    - **F7 first, and it is not just tidying.** `LAUNCH_PLAN.md:568`–`569`'s §10.1 entry says the
      disclaimer renders on "Home, Learn, Markets and About". `Home.jsx` and `Markets.jsx` were
      deleted in the 2026-08-04 rebuild. Real sites, five: `Learn.jsx:168`, `LessonReader.jsx:324`,
      `Practice.jsx:303`, `reference/MarketSignals.jsx:113`, `reference/Settings.jsx:119`. **§10.1 is
      the rule the mandatory adversarial self-check names by number**, so this sentence being
      unresolvable degrades every future run's check, not just this document. Strongly consider
      pairing the fix with a `check-blindspot.mjs` assertion on the render *surfaces* — it currently
      asserts only that the disclaimer key exists per locale, which is why this drifted unseen.
    - **F1.** `LAUNCH_PLAN.md:493`'s §8 roadmap row still calls the §4.3 content gate the project's
      blocker and highest-value work; `:386` (generated) says it is met. Prefer **deleting** the
      figures from the row over regenerating them — item 55's own cheapest-disposition rule, and §8 is
      a roadmap, not a scoreboard.
    - **F2** `:96` analytics "none" → the local-sink seam that exists (`src/lib/analytics.js`).
      **F3** `:247` Reference sub-nav is five, not four (add Sector performance). **F5** `:285` dark
      mode is shipped, and "§backlog" is a dangling reference. **F8** `:179` kids blurbs carry a
      fourth field (`why`, added 2026-08-16, `DECISIONS.md:221`).
    - **F9** `DECISIONS.md:15`–`17` attributes "Expo from week 1" to §2.2/§8 of the *current* plan;
      all four Expo mentions in `LAUNCH_PLAN.md` record it as open, and `:41` is the row that retracted
      it. Retarget the citation to v1 / §0's table. **This one misleads a run about what the plan
      demands**, so treat it as higher than its position here suggests.
    - **F10** `DECISIONS.md:365`–`369` claims to list "every piece of per-user state added so far" and
      names 5 of 12. **The better fix than editing the list is generating it** — a check asserting the
      entry names every `KEYS` member, the shape §17b and §26 already use. **F13** `DECISIONS.md:333`
      says this file still owes an entry for item 45's per-language split; write it.
    - **Do not fold in the 4 judgment findings (F4, F6, F11, F12).** They need a decision, not an
      edit, and mixing them in is how a reviewable diff stops being reviewable. F4 (three lines
      promise a progress ring, the app renders a bar — and `refresh-readiness.mjs:230` keeps the
      *figure* in one of them true while the noun stays wrong) is the one worth deciding soon; the
      run entry's recommendation is to make the plan match the app.
    - **Carry the control this list already earned.** Item 58 measured a fourteenth candidate and
      **rejected** it — §4.3's "Analytics live" is in the *Ship* column, so it states a requirement,
      not a status. Before "fixing" anything not in the nine above, check which column or clause the
      sentence is actually making a claim in.
    </details>

62. **✅ ITEM FULLY CLOSED 2026-08-21 — F4, F6, F11 and F12 are all done; nothing here is open.**
    **[Process — the 4 judgment findings item 58 measured and item 61 deliberately did not touch.
    Filed 2026-08-17 by the run that closed 61, so they stop living only inside a closed item's
    prose.] Each needs a decision, not an edit.** Full evidence with file:line is in item 58's run
    entry of 2026-08-17; F-numbers match it. **Do not batch these** — the reason 61 was cheap is that
    it excluded them.
    - **F4 — ✅ DONE 2026-08-17 (scheduled dev-agent). Decided as recommended: the plan now matches
      the app.** All three lines say "progress bar", the generated shape pins the **noun** as well as
      the figure (`progress bar at 1/40`), and the reasoning is in `DECISIONS.md` so it is not
      re-derived. **The one correction to this item's own text: the third line is §3.3, not §3.4** —
      §3.4 is one of the two sections F6 flags as duplicately-titled "Visual system", which is
      probably how the miscite happened. The bar was measured live (309×6 px, 51.5:1, fill `2.5%` =
      1/40, zero `<svg>`/`<circle>`/`stroke-dasharray`) rather than read off the code. See the run
      log entry of this date. *Original text:* Three lines of
      `LAUNCH_PLAN.md` (§3.2 twice, §3.4 once) promise a **progress ring**; the app has only ever
      rendered a **bar** (`src/components/ui.jsx`'s `ProgressBar`, `role="progressbar"`). The sharp
      part: `scripts/refresh-readiness.mjs` *generates* the figure inside one of those sentences, so a
      script now keeps the number true while the noun stays wrong, and `npm test` passes. Item 58's
      recommendation — **make the plan match the app** — stands: nothing has asked for a ring, §3.0
      does not need one, and building one to satisfy a sentence is the tail wagging the dog.
    - **F6. ✅ DONE 2026-08-21 (scheduled dev-agent) — and with it ITEM 62 IS FULLY CLOSED.** §3.4 is
      retitled **"Theming and typography"**, keeps its number (renumbering §3.5 would break
      `working_files/build_doc.js` and the run log), and its three surviving unique facts — one
      typeface, dark mode shipped, color and type come from `theme.js` — are kept; the contradictory
      "One accent colour per lesson/phase" is gone, with a dated note saying what it was.  <!-- us-english:allow: verbatim quote -->
      `check-data.mjs` **§32** now fails on any two headings in `LAUNCH_PLAN.md` that share a title.
      **Two premise corrections, both from measuring instead of reading.** (1) F6 called the two
      sections "opposite emphases", which reads as a live disagreement between equals — they are not
      equals: **§3.1.1 is cited from `src/theme.js:5`, `src/components/LessonVisual.jsx:33` and
      `LAUNCH_PLAN.md:58`; §3.4 is cited by nothing** outside this log. The disposition follows from
      that, not from taste. (2) Neither section matched the tree. **`src/content/lessons.js` DOES
      author a per-lesson `color` on all 40 lessons** — my first regex missed it because the field is
      a bare `color:` — but nothing reads it (item 75's run had already established this in that
      file's header), so §3.4's directive described dead data and §3.1.1's "survives only as a thin
      accent" overstated a ceiling the app never approached. Both now say what is true. See the run
      log entry of this date. *Original text:* `LAUNCH_PLAN.md` §3.1.1 and §3.4 are **both titled
      "Visual system"** and encode opposite
      emphases on per-lesson color (§3.1.1: one accent, color never as a fill; §3.4: one accent *per
      lesson/phase*). §3.4 reads as a v1 leftover §3.1.1 superseded. Duplicate §-titles are their own
      hazard in a document whose section numbers are load-bearing cross-references.
    - **F11. ✅ DONE 2026-08-17 (scheduled dev-agent) — dated, not rewritten, and not guarded either.**
      A blockquote under the "Gap closed 2026-08-04" bullet marks it as a dated verification record and
      names the commits: every name in it belonged to `c7651a6` (the commit that closed the gap), and
      `79d9507` **the same day** ("Rebuild app from scratch") replaced the component tree and took the
      names with it. **F11 named two dead names; re-measuring found four** — `Home`, `isLessonUnlocked`,
      `markLessonComplete`, `saveCompletedLessons`, with only `loadCompletedLessons` left standing
      (`src/lib/useAppState.js`). **Two design calls worth not re-deriving.** (1) *No guard was added,
      on purpose.* The obvious one — assert the dead names stay dead — would have fired on the owner's
      in-flight redesign, which is Duolingo-shaped and may well reintroduce a `Home` screen; a check
      that breaks the owner's build to protect a footnote is a bad trade. (2) *The note states no live
      claim about the tree.* Its facts are commit hashes (immutable) or explicitly dated ("it held 40
      the day this note was written"), because a dating note that names current internals would rot the
      exact way the text it annotates did. First draft failed this and said `loadCompletedLessons`
      "is the one that survived" — present tense, rot-capable; caught by step 5, reworded to a claim
      about what the rebuild left. *This entry's* other *half was rewritten by item 61 (F10).*
      *Original text:* `DECISIONS.md`'s localStorage entry has a *verification note* naming
      `isLessonUnlocked` and `Home` — neither exists (the gate is `isUnlocked(index)`, `src/App.jsx`).
      **The disposition differs from the rest:** it is a dated record of what was true on 2026-08-04,
      and correcting it would falsify the record. The honest fix is a dating note, not a rewrite — the
      same call item 55 faced with §4.1/§4.2.
    - **F12. ✅ DONE 2026-08-17 (scheduled dev-agent) — guarded, and deliberately NOT generated.**
      `check-data.mjs` **§29** classifies all **11** lesson ranges in the two-tracks section as `live`
      (must equal a track's current range) or `historical` (must equal none), and checks both
      directions, so a classification cannot outlive its reason. **The design call worth not
      re-deriving: it asserts rather than generating, and F11 is why** — these ranges sit inside *dated
      records*, so a `refresh-readiness.mjs` `--write` entry would silently rewrite what an earlier run
      recorded as true on its date. The failure message therefore names the repair (append a NEW dated
      Update, reclassify the old claim) instead of performing it. Scoped to the one section by
      measurement, not by preference: the same net run document-wide picks up `weeks 1–8`, `steps 1–3`
      and `roughly 40–50 terms` — **6 false positives document-wide, 0 in the section**. Proved by
      seven injections including a broken-net floor and a non-contiguous track. `DECISIONS.md`'s prose
      was not rewritten; the only doc change is a pointer comment. See the run log entry of this date.
      *Original text:* `DECISIONS.md`'s two-tracks entry carries pre-renumbering ids in its body (money 13-26,
      economy 1-12; actual: money 1–28, economy 29–40), **corrected by its own "Update, 2026-08-14"**
      at the bottom, so a reader who finishes it is not misled. The finding is the asymmetry: this is
      the identical table `LAUNCH_PLAN.md` §2.5 carries, and §2.5's was *generated* by item 55
      precisely because a hand-written range rots. One document over, the same table is unguarded.
    > **A blocking pattern worth naming, found by this run while picking F12.** Two consecutive "Next
    > run should pick" lines have queued an item that was **already blocked by an owner-dirty file** —
    > this run's queued pick, item 69, lives in `src/locales/es.js`. A queuing run should check
    > `git status` against the item's files before naming it, or say the pick is contingent.

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
    the first two passes both missed entirely. A permanent regression check guards the first half only;
    extending it to quiz explanations is the one piece still open, see the last bullet.]
    The 2026-08-14 lesson-id renumbering missed every non-English in-prose cross-reference, the
    lowercase English ones, and the plural `Lessons N and M` form.**
    > **Third pass, 2026-08-16 (owner-requested, weekly reviewer).** The two passes above fixed
    > `lessonContent.{money,economy}.js` and left **`src/content/quizData.js` untouched** — 7 stale
    > references in 3 quiz explanations survived, and the §16 check added below did not catch them
    > because it only walks lesson prose fields, never quiz `explain` text. Fixed:
    > - Q24 (lesson 11) and Q25 (lesson 12): es `Lección 15` and zh `第15课` → **3** (Compound Interest);
    >   the English in both already correctly said Lesson 3.
    > - Q27 (lesson 14): `Lessons 18 and 20` → **6 and 8** — in **English, es and zh alike**. This one
    >   is the more interesting find: **the English was stale too.** The renumbering regex matched the
    >   singular `Lesson N`, so the *plural* `Lessons 18 and 20` survived in every language at once, and
    >   because all five agreed with each other, a translation-vs-English consistency check can never
    >   see it. Confirmed by content, not arithmetic: the sentence describes "a 401(k) or life insurance
    >   policy," and 6 is *Retirement Accounts: 401(k) and IRA Basics*, 8 is *Insurance*.
    > **Verified after:** across `lessonContent.{money,economy}.js` + `quizData.js`, all five languages —
    > 64 English references, 89 translated, **0 mismatches, 0 pointing at a nonexistent lesson id.**
    > **⚠️ CORRECTION, 2026-08-16 (item-36 run): this "0 mismatches" was measured through the blind
    > ko/ja patterns and was wrong.** The 89 translated references counted were es+zh plus one each from
    > ko/ja; the ~73 ko/ja references written as `N강` / `第N課` were invisible to the measurement, and
    > **67 of them were stale.** es and zh were genuinely fixed by these passes. ko and ja were not.
    > All 67 are fixed and the patterns widened under item 36 — see its closing update. The lesson this
    > adds to the two already recorded here: **a measurement taken with the same instrument that has the
    > blind spot cannot detect the blind spot.** Both this item's "0 remain" and `npm test`'s green were
    > produced by the very patterns that were failing to match.
    > **Lesson for future checks: a consistency check and a correctness check are different things.**
    > §16 verifies translations agree with English; it cannot verify English is right. The plural form
    > was invisible to it for exactly that reason.
    > **✅ Check extended, 2026-08-16 (fourth pass, owner-requested).** §16 now scans `quizData.js`'s
    > `explain` fields as well as lesson prose, and the `en`/`es` patterns capture the multi-number form
    > (`Lessons 6 and 8`, `Lecciones 6 y 8`, `Lessons 3, 5 and 7`) instead of only the first number.
    > Quiz items are scoped **per item**, not pooled per lesson: an `explain` field has no sibling field
    > for a translation to move a reference into, so the item's own English set is the right comparison
    > and pooling would just re-open the hole.
    > **Proven against the real bugs, not just written:** re-injected Q24's zh `第3课`→`第15课` (caught,
    > naming the wrong lesson's title), Q27's es `Lecciones 6 y 8`→`18 y 20` (caught, **both** numbers —
    > which the old single-number pattern would have missed), and an English `Lessons 6 and 99` (caught
    > as a nonexistent id). Negative control: a translation that legitimately carries **fewer**
    > references than its English still passes, so the intended asymmetry survives. File restored and
    > `npm test` green after each.
    > **The known limit is now written into §16's header comment** so the next reader doesn't over-trust
    > it: this verifies translations *agree with* English; it cannot verify English is *right*. The
    > plural bug was invisible precisely because all five languages agreed. The only correctness guard
    > is the nonexistent-id check.
    Found 2026-08-16 while building item 27's lesson-27 visual: the prose read "a different pattern from
    sunk cost (lesson 31, throwing good money after bad)" — but lesson 31 is now *Productivity Growth*,
    and sunk cost is lesson 19. The reference was a pre-renumbering id.
    - **English half: fixed 2026-08-16** (4 references, all lowercase `lesson N`, in lessons 5, 27 and
      28). The renumbering run's regex matched capital `Lesson N` only, so lowercase mentions survived
      untouched. Each fix was confirmed by title match, not by arithmetic alone. Zero lowercase
      references remain in English.
    - **Non-English half: ✅ FIXED 2026-08-16 (later run this date). The count was higher than this item
      estimated — 74 stale references, not 62.** The renumbering entry states the cross-references are
      "English only — the other four languages don't carry these references." **That was false.** The
      four languages carry **77** numbered references (`Lección N`, `레슨 N`, `第N课`, `レッスンN`), of
      which **74 did not match any English reference in the same lesson**, and they were stale in a
      completely regular way — e.g. lesson 6's English says Lesson 3 while its es and zh said 15;
      lesson 7's English says 6 while es/zh said 18. Every one was the **old** id. The 62-vs-74 gap is
      a counting difference, not a content difference: 74 is a per-occurrence count over all five
      surface forms (a single lesson often repeats one reference two or three times), spread across 64
      distinct translated strings. **All 74 are now correct; 0 remain.**
    - **The mapping is exact and mechanical**, so this was a scripted fix, not a retranslation:
      **old money 13–40 → new = old − 12**, **old economy 1–12 → new = old + 28.** Every one of the 74
      resolved under it — zero unresolved, zero needing judgment.
    - **The 3 non-English references that were already correct were left alone** (lesson 35's es/zh
      `Lección 39`/`第39课`, which match the English). The fix only rewrote a number when it was absent
      from that lesson's English reference set *and* its mapped value was present — so it could not
      "fix" a correct reference into a wrong one.
    - **✅ Permanent check added** (§16 of `scripts/check-data.mjs`), which this item correctly called
      more valuable than the one-time fix: every non-English numbered reference must appear in the same
      lesson's English reference set. Deliberately asymmetric — a translation may carry **fewer**
      references than English (several legitimately condense and drop one), but never a *different* one.
      Also fails if English references a nonexistent lesson id. Proven to catch the real bug by
      re-injecting it in all four languages (es `Lección 19`→`31`, and zh/ko/ja `37`→`9`) and confirming
      `npm test` failed each time, then restoring.
    - **Impact:** an es/ko/zh/ja reader following an in-lesson cross-reference was sent to the wrong
      lesson, for two days. Note this is exactly the failure mode item 24's compression warned about —
      ids quoted anywhere that predate the renumbering are not to be trusted.
    - **What this says about the translation-review ledger, worth carrying forward:** `DECISIONS.md`'s
      2026-08-13 entry records an AI review pass over all 40 lessons × es/ko/zh/ja "checking
      faithfulness," and marks 160/160 pairs reviewed (100% coverage, 0% human). That pass did **not**
      catch these 74 wrong references, in 20 different lessons. This is not a reason to redo the pass —
      it is concrete evidence for the caveat that entry already states, that AI review has correlated
      blind spots. The useful generalization: **a mechanical, checkable property should get a script in
      `check-data.mjs`, not a reviewer's attention.** The ledger was deliberately not touched by this
      run (its hash tracks *English* source drift, and no English changed here).


27. **[Content/UX — the scope this item defines is now BUILT (2026-08-16); re-scope before picking it
    again.] Lesson visuals for the money track.**
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

28. **[Content/UX — ✅ MECHANISM DONE 2026-08-16. The linking is built, curated and guarded; what
    remains is a glossary *coverage* gap, filed separately as item 35 — do not re-pick this item to
    "finish" it.]** Lesson text now links to the glossary.
    - **What shipped:** `src/content/lessonTerms.js` (a curated `{ lessonId: { sectionIndex: [glossary
      keys] } }` map) + `src/components/GlossaryTerms.jsx` (a chip row under each tagged section; a
      chip expands that term's definition and example **in place**, without leaving the reader), wired
      into `LessonReader.jsx`, with the label in all five locales. See `DECISIONS.md`
      ("In-lesson glossary links are a curated map, not an automatic prose match").
    - **The scope note's warning was right, and is now backed by a measurement rather than a worry.**
      An automatic English pass over all 40 lessons for the 17 glossary terms yields 47 hits, and the
      false positives are load-bearing: money lesson 12's **"PMI" is private mortgage insurance**, not
      Purchasing Managers' Index; lesson 17's is **"lifestyle inflation"**; lessons 2/3/4/15 say
      "credit card"/"credit score"/"credit report", not the glossary's macro **Credit**. Auto-linking
      would have shipped four wrong definitions on the money track alone.
    - **Guarded by `check-data.mjs` §17**, which fails the build if a link names a missing lesson,
      section or glossary key, repeats a term inside one lesson, or — the one nothing else catches —
      points at a section whose English text no longer contains the term. All six failure modes were
      proven by injection, not by inspection.
    - **Coverage shipped: 21 links across 10 lessons (9 economy, 1 money).** That the money track got
      one is not a curation choice; it is item 35.
    *(Original text below, retained for the reasoning.)*
    §3.0.3: "No undefined
    jargon. A term either gets defined where it appears **or links to the glossary**." The app has a
    searchable glossary and (since 2026-08-16) a per-term detail screen, but **nothing in
    `LessonReader.jsx` links lesson body text to it** — verified 2026-08-16, no glossary import or
    reference anywhere in the reader. A learner who hits "yield curve" mid-lesson has to leave the
    reader, switch tabs, open Reference → Glossary, and search. That is exactly the friction §3.0 exists
    to prevent, and the term-detail screen built this week is the piece that was missing to make linking
    worth doing. **Scope note:** the hard part is deciding *how* terms are marked, not the rendering —
    lesson bodies are plain strings in five languages, so an automatic match-and-link pass has real
    false-positive risk across languages. Prefer an explicit per-section term list over regex-matching
    prose, and read `check-data.mjs`'s locale-parity checks before changing the content shape.

29. **[Process — ✅ DONE 2026-08-16. Both payload gaps closed, both proven in a live browser.]
    Finish the §9.2 event payloads — the half of item 18 that is NOT owner-blocked.**
    §9.2 specifies the minimum set as "lesson started, lesson **completed (with duration)**, quiz taken
    (**with score**)". Verified 2026-08-16 against the call sites: `LESSON_COMPLETED` fired with
    `{lessonId}` and **no duration**; `QUIZ_TAKEN` fired per question with `{lessonId, source, correct}`
    and **no batch score**, even though `Practice.jsx` now computes a real session score for its results
    recap. Item 18 is blocked on the owner creating an analytics account — **but fixing the payloads was
    not**, and doing it now means the day a provider is wired in, the data is already the shape §4.3's
    ≥40%-completion gate needs, instead of starting a fresh measurement window with a known gap.
    - **What shipped:** `lesson_completed` now carries `durationSec`, measured from `performance.now()`
      (monotonic — an NTP correction or timezone change mid-lesson cannot corrupt it, which a
      `Date.now()` difference can). `quiz_taken` now fires **once per finished quiz** with
      `{correct, total, scorePct}`, and the per-question signal it used to carry moved to a new
      `quiz_answered` event rather than being dropped. Two pure helpers (`elapsedSeconds`, `quizScore`)
      do the arithmetic so `npm test` can check it without a browser.
    - **This reversed a recorded decision, and that was handled rather than ignored** — see the run log
      and `DECISIONS.md`. The 2026-08-05 entry explicitly chose per-question `quiz_taken` because "the
      app's review/check unit is a single question, not a multi-question test with a start/end
      boundary." That premise expired on 2026-08-15/16 when `Practice.jsx` gained real sessions with a
      terminal complete screen and a computed score. The decision entry is now marked superseded with
      the reason, not silently overwritten.
    - **Guard against regression:** `check-data.mjs` gained §13b, which asserts the *call sites* pass
      the §9.2 fields (not just that the helpers can compute them) — the precise gap that existed
      before was that both events fired and neither carried its field, which greps as "done."

35. **[Content — ✅ FULLY DONE 2026-08-21. Both batches have shipped: 12 terms 2026-08-16, and the
    second batch 2026-08-21 (2 terms, not the 3 that were queued). The glossary is 35 terms and this
    item is EXHAUSTED as a reach-driven item — do not pick it for a third batch without first defining
    a bar that is not a term count.]**
    - **⚠️ The BLOCK recorded below is SPENT — do not re-derive it (corrected 2026-08-21).** The
      `refresh-readiness.mjs` §1 asset-sentence failure is real and still fires on any new glossary key
      (re-proved by injection this run), but it stopped being a *block* the moment `LAUNCH_PLAN.md`
      became owner-clean: the plan now agrees with the tree, so a new key is one mechanical
      `npm run readiness -- --write` away. In August the tree and the plan already disagreed for the
      owner's reasons, which is what no agent edit could clear. **Items 64, 73 and 77 cite the same
      block; it is spent for all of them.**
    - **Second batch, 2026-08-21: `Interest Rate` and `Savings Account` added (+17 chips, 0 new
      exclusions).** `retirement account` was queued as the third and was **REJECTED on measurement** —
      lesson 6 defines it **4 path positions** after its first use, not the 11 the hand-off claimed
      (11 = `13 − 2`, lesson 13 mistaken for the defining lesson); **3 of its 5 hits are
      cross-references to that lesson's own title**, which §17b strips as non-uses; and `401(k)`/`IRA`
      already cover it. Reach must be measured in **path order** (economy 29-40 → essentials 1-15 →
      money 16-28), not lesson-id order, and with §17b's title-stripping matcher — a raw grep
      overcounts every term whose name is also a lesson title.
    *(Original 2026-08-16 first-batch record below.)*
    **[12 money-track terms added; money-track links went 1 → 20, covering 13 lessons instead of 1.]**
    - **What shipped:** `glossary.js` grew from 17 to **29** terms. The 12 are Compound Interest,
      Emergency Fund, Diversification, Index Fund, Expense Ratio, 401(k), IRA, Principal, Deductible,
      Premium (insurance sense), Vesting, Purchasing Power — each chosen by grepping money lessons
      1–28 for jargon they *actually use*, per this item's own scope guidance, not from a generic
      vocabulary list. All five languages; definitions describe mechanisms only, never what to do
      (§10.1), and `glossary.js` now carries a header saying so.
    - **`lessonTerms.js` gained 19 links** across money lessons 2, 3, 6, 7, 9, 11, 12, 13, 14, 17, 18,
      25 and 26. Two of the twelve (Expense Ratio, Deductible) are **glossary-only by design** — the
      one lesson each appears in is the lesson that defines it, so curation rule 2 excludes a chip.
      Whole-app total: **40 links across 22 of 40 lessons** (was 21 across 10).
    - **A real bug was caught before shipping, and the check was strengthened because of it.** The
      first link computation put **Vesting on six lessons** — because a plain substring test matches
      "vesting" inside **"investing"**. §17's presence check had the same weakness and would have
      passed all six. It now matches with both-side lookarounds plus an optional plural (`\b` is
      unusable — "401(k)" ends in a non-word character), so "index funds" still satisfies "Index Fund"
      while "investing" no longer satisfies "Vesting". Proven by injecting exactly that link and
      confirming it now fails.
    - **Ledger gap answered, not left implicit:** the translation-review ledger covers lesson content
      only, so these 48 non-English glossary fields are outside its coverage number. Written up in
      `DECISIONS.md` under the machine-translation entry, including why widening the ledger is a schema
      change rather than a config one.
    - **Still open here:** a second batch is *possible* (Bond, Collateral, Credit Utilization, Tax
      Bracket, Withholding, Beneficiary, Risk Tolerance all appear in money lessons) but is **not
      queued** — re-read this item's own warning against count-shaped work before adding one. The bar
      is "a word money lessons use that a learner can't look up," not a term total.
    - **⚠️ Re-measured 2026-08-18 (scheduled dev-agent) — this candidate list is stale, and the item is
      now BLOCKED for the same reason as item 64's `Dividend`.** Two things changed since 2026-08-16:
      **(a)** `Bond` shipped as part of item 64, so it is no longer a candidate here — `npm run jargon
      -- money` (re-run this run, `MEASURED jargon money: 3 candidates, 2 control, 0 self-defining, 93
      low-reach [fingerprint bbe1464e]`) finds only **`savings account`** (2 lessons, 4x), **`FOMO`**
      (2 lessons, 4x) and **`lifestyle inflation`** (1 lesson, 4x) — none of the other six named terms
      clear the reach bar against the *current* tree. **(b)** The owner's redesign shrank the `money`
      track from 28 lessons to 13 (`16–28`, `essentials` now holds `1–15`), so this item's own reach
      arithmetic no longer applies to the tree it was written against. **Neither of those is why it's
      blocked.** Verified by injection, in a scratchpad copy (repo untouched): adding one probe term to
      `glossary.js` — with the working tree's real 3-track shape held constant, so the essentials-track
      guard from item 77 isn't the thing firing — independently fails `refresh-readiness.mjs`'s §1
      asset sentence: `LAUNCH_PLAN.md` says "32 glossary terms," the tree now has 33, `npm test` fails.
      **Any new glossary key is blocked on `LAUNCH_PLAN.md` being owner-clean, exactly like item 64's
      `Dividend` and item 73** — this item's own text never named that block because it predates
      `refresh-readiness.mjs` joining `LAUNCH_PLAN.md` (item 55, after this item was filed). **Do not
      pick this item's second batch until `LAUNCH_PLAN.md` is clean — it unblocks together with 64, 73
      and 77 on one `npm test`, and the reach numbers above will need re-measuring again at that point
      since the tree will have moved again.**
    *(Original text below, retained for the measurement that motivated it.)*
    **The
    glossary is 17 terms and every one of them is macroeconomic. The money track — 28 of 40 lessons,
    and per §0 *the product* — has almost no jargon it can link to.**
    Item 28 built the linking mechanism and it works, but it could only produce **1 link across the 28
    money lessons** versus 20 across the 12 economy ones. That ratio is not a curation artifact: it is
    that `glossary.js` holds GDP, CPI, PMI, VIX, QE, QT, yield curve, deleveraging, credit spread,
    debt-to-GDP and so on, and holds **nothing** for the money track's own vocabulary — compound
    interest, principal, APR, expense ratio, index fund, diversification, deductible, premium,
    beneficiary, vesting, 401(k)/IRA, escrow, amortization, emergency fund, net vs. gross pay. Those
    words appear throughout money lessons 1–28 and a learner who doesn't know one has nowhere to go.
    So **§3.0.3 is now met on the vehicle and still unmet on the product** — which is exactly the
    imbalance item 27 flagged for visuals, recurring in a different surface.
    **Scope guidance, and read it before starting:** this is a *content* item, not a code one — the
    mechanism is done and needs no change. Adding a term means writing `s`/`f`/`ex` in **five
    languages**, which lands it squarely in the P-4 machine-translation decision (`DECISIONS.md`:
    accept AI translation under "(Beta)", track the debt). Note the translation-review ledger tracks
    *lessons*, not glossary entries, so new glossary terms are currently untracked by it — say
    explicitly how that is handled rather than leaving it implicit. Pick **8–12 terms that money
    lessons actually use** (grep the lesson bodies; don't invent a vocabulary list), add them, then
    extend `lessonTerms.js` — §17 will refuse any link whose term isn't literally in the section.
    Do **not** turn this into a count-shaped item: the target is "the jargon money lessons actually
    use is definable," not a term total.

36. **[Process — reopened and closed again the same day. "FULLY CLOSED" below was the FOURTH premature
    all-clear on this bug; `第N講` was still unscanned and 11 more ja references were still stale.
    Now fixed, and the guard that generalizes is in — see the fifth-pass note immediately below.]**
    > **Fifth pass, 2026-08-16 (owner-requested: "fix the ko/ja patterns").** Checked rather than
    > assumed, and ja was still broken. **Korean was genuinely fixed** by the pass below (`강` is its
    > only marker — confirmed by tallying every character adjacent to a digit in the ko corpus, not by
    > eyeballing). **Japanese was not:** the prose writes `第N課` *and* `第N講`, and that pass added only
    > `課`. That left **11 more stale ja references** in lessons 16, 17, 18, 20, 27 and 28 — every one a
    > pre-renumbering id, each confirmed against the English reference in the same field.
    > **Why nothing caught it, which is the part worth keeping:** the coverage tripwire added below
    > fires under 20% of English. With `課` matching but `講` not, ja sat at **31/64 ≈ 48%** — a partial
    > surface-form gap passes a ratio floor comfortably. A tripwire catches a *dead* pattern; it cannot
    > catch a *half-dead* one.
    > **So the fix is not another hand-added surface form.** Hand-enumeration has now failed four times
    > (singular-only `Lesson N` → `레슨`/`レッスン` while the prose used `N강`/`第N課` → `課` while it also
    > used `講`). The new **UNRECOGNIZED-COUNTER GUARD** inverts it: it finds the unambiguous CJK
    > ordinal construction `第<number><counter>` and **fails on any counter in neither
    > `LESSON_COUNTERS` nor `NON_LESSON_COUNTERS`.** A translator reaching for a fifth counter now
    > breaks the build with the exact character in the message instead of silently disabling the check.
    > Running it immediately surfaced three real non-references, each read in context against its
    > English source before being whitelisted **with its justification attached**: `第3週` ("her third
    > *week*'s willpower"), `第1節` (mirrors English "Section 1 explained..."), `第4种` ("the fourth
    > *kind* of tool"). The guard rejects a bare addition to that set by design.
    > **Verified:** ja coverage **31 → 44**, now equal to ko and zh (es is 43, and that one is genuine
    > condensation — its near-misses are `elección`/`selección`/"esta lección", checked). Injection
    > tests all pass: a re-injected stale `講` reference is now caught; a novel `第7章` trips the guard
    > with an actionable message; the whitelisted `第3週` stays silent. The 11 fixes were applied in a
    > **single-pass** substitution — a two-pass replace would have turned 31→19 and then 19→7,
    > corrupting the references it had just repaired.
    > **The standing lesson, fourth restatement: a green `npm test` on this check has repeatedly meant
    > "the pattern matched nothing," not "the content is correct."** Before trusting it, read the
    > `cross-references matched per language:` line it now prints every run.
    >
    > *(Original 2026-08-16 closing update — the fourth premature all-clear — follows.)*
    > **Closing update, 2026-08-16.** Blind spot 1 is fixed: `REF_PATTERNS` now carries `ko:
    > /레슨\s*(\d+)|(\d+)\s*강/g` and `ja: /レッスン\s*(\d+)|第\s*(\d+)\s*課/g`, `refsIn` pools **all**
    > capture groups (reading only `m[1]` would have made the new branches match-but-capture-nothing —
    > a silent no-op that looks identical to a passing check), and **67 stale references** were fixed
    > across `lessonContent.money.js` (50 strings), `lessonContent.economy.js` (2) and `quizData.js` (6).
    > **This item said 8, because it measured only `quizData.js`.** The other 59 were in lesson prose,
    > where the same two patterns were equally blind. The honest scale of the miss is in the counts:
    > of 44 Korean references `레슨 N` matched **1**; of 31 Japanese, `レッスン N` matched **1**. For two
    > of five languages this check was scanning essentially nothing while reporting a clean pass.
    > **This also corrects item 33's "0 remain" claim** (and the 2026-08-16 entry that asserted "all 74
    > are now correct; 0 remain"). That measurement was taken *through the blind patterns*, so it could
    > only ever have come back clean — es and zh genuinely were fixed, ko and ja largely were not.
    > **A tripwire now guards the class, not just the instance:** §16 prints the per-language match count
    > on every `npm test` and warns when a non-English language falls below 20% of English's. Proven by
    > reverting both patterns to their old form against the *now-correct* content — it reports `ko=1,
    > ja=1` and fires both warnings, i.e. it would have caught this on day one.
    > **Verified by injection, not inspection:** re-injected the ko `15강` bug (caught), the ja `第15課`
    > bug (caught), and the ja multi-number `第18課と第20課` quiz case (caught, **both** numbers). Live
    > browser confirmed the fixed text renders — lesson 6's ko/ja "think about" now cites lesson 3
    > (복리 / 複利, Compound Interest) instead of 15, and lesson 14's ja quiz explanation reads
    > `第6課と第8課` (Retirement Accounts / Insurance). `en`/`es`/`zh` strings verified byte-identical.
    > **Checked for further gaps:** grepped for other plausible surface forms (`제N강`, `N과`, `第N章`,
    > `第N节`, `课程N`, `unidad/módulo N`) — none present. Coverage is complete for the forms the prose
    > actually uses.
    *(Original text below, including its 8-reference estimate — left as filed, because the gap between
    that number and 67 is the useful part of this item's history.)*
    **Update, 2026-08-16 (item-35 run, a few minutes after filing):** the concurrent run that owns item
    33 shipped `7526e44` "Extend the cross-reference check to quiz explanations and plural forms,"
    which closes **blind spot 2** (§16 now walks `quizData.js` `explain` fields, not just lesson prose)
    and widens the English *and* Spanish patterns to the multi-number form (`Lessons 6 and 8`) — the
    false-positive fix this item said was required for correctness. **Blind spot 1 is untouched:**
    `REF_PATTERNS` still reads `ko: /레슨\s*(\d+)/` and `ja: /レッスン\s*(\d+)/`, while the Korean and
    Japanese prose in `quizData.js` uses **`N강`** and **`第N課`**. Re-running the measurement against
    the post-`7526e44` tree still finds the same **8 stale references** — q#24 ko/ja, q#25 ko/ja
    (`15` → 3) and q#27 ko/ja (`18`/`20` → 6/8) — and `npm test` still passes, because no pattern
    matches them. **What is left is small and specific:** add the two surface forms to `REF_PATTERNS`
    and fix the 8 references (all resolve under old money id − 12). Note the order matters — adding the
    patterns first will fail the build until the content is fixed, which is the point.
    *(Original text below.)*
    **The §16
    cross-reference check has two blind spots that let 8 stale references survive in `quizData.js`
    today.** Found 2026-08-16 by this run while a *concurrent* run was committing `543fd90`, which
    fixed the es/zh half of exactly this. That commit's own message defers the check work — "Not done
    here because a concurrent run holds uncommitted edits to `check-data.mjs`" — i.e. it was blocked on
    this run. `check-data.mjs` is free again as of this commit.
    - **Blind spot 1 — surface forms.** §16's patterns are `레슨 N` (ko) and `レッスン N` (ja), but
      `quizData.js`'s Korean and Japanese prose uses **`N강`** and **`第N課`**. Neither pattern matches,
      so those references are invisible to the check *and* were missed by both fix passes.
    - **Blind spot 2 — scope.** §16 walks `lessonContent` prose fields only; it never reads `quizData`
      explain text at all. `543fd90` fixed that file by hand, with nothing to stop it regressing.
    - **Measured, not asserted:** scanning `quizData` with the two extra surface forms finds **8
      genuinely stale references** remaining after `543fd90` — q#24 ko/ja (`15강`/`第15課` → 3), q#25
      ko/ja (same), q#27 ko/ja (`18`/`20` → 6/8). Every one resolves under the documented mapping
      (old money id − 12), confirming they are pre-renumbering leftovers rather than real references.
    - **Also worth carrying:** a naive pooled-English check reports a 9th (q#27 zh) that is a **false
      positive** — English reads "Lessons 6 and 8" and the singular-anchored pattern captures only the
      first number. So widening the English pattern to the plural/multi-number form is required for
      the check to be *correct*, not merely broader. `543fd90` already names this.

30. **[Process — ✅ DONE 2026-08-16. `CLAIMS.md` + `scripts/check-claims.mjs`, wired into `npm test`.
    14 claims, 2 of them already refuted by this repo's own history.]**
    > **Closing update, 2026-08-16.** Built as specified, with one correction to this item's premise:
    > **"no such artifact exists" was half wrong.** `LAUNCH_PLAN.md` **§4.6 already held four
    > monetization claims**, each with a refuting number. What they lacked was a **check date** — the
    > third of §9.1's three parts, and the one that makes a claim self-refuting rather than merely
    > well-phrased. They are imported as B1–B4 rather than reinvented, and §4.6 now points here.
    > **What shipped:** 14 claims in four groups — **A1–A6** the product-shape bets this build made in
    > code and never wrote down (sequential unlocking, the money-first two-track split, five languages,
    > parent-facing kids content, the Leitner queue, catalog size), **B1–B4** from §4.6, **C1–C2**
    > distribution, **D1–D2** process. Each carries a refuting number, an ISO check date, and an honest
    > measurability verdict.
    > **The register's most useful output is a concentration, not a claim:** 10 of 14 are unmeasurable
    > today and nearly all name **item 18**. That reframes item 18 from one blocked backlog line into
    > the thing keeping most of this project's stated beliefs unfalsifiable.
    > **D1 and D2 are recorded as already REFUTED**, by evidence from this log: D1 (a run's
    > self-reported verification can be trusted) failed twice — the §10.1 "closed" claim that was half
    > done, and item 33's "0 remain" that the item-36 run disproved 67 references later. D2 (a green
    > `npm test` means the property holds) failed via §16's ko/ja patterns matching 1-of-44 and 1-of-31.
    > Per §9.1 the response must be a product change, not a softer restatement, so the three changes
    > those forced are listed in the file (the adversarial self-check, the §16 coverage tripwire, and
    > this register) — written down specifically so they cannot later be quietly softened.
    > **`scripts/check-claims.mjs`** fails on a malformed row, a non-ISO check date ("when analytics
    > land" is rejected by design), a duplicate id, a bad measurability value, or a missing file; it
    > **warns** on past-due dates, which is what §9.3's audit question 4 reads. All six guards proven by
    > injection, file restored and green after each. `CLAIMS_TODAY` overrides today's date so the
    > past-due path is testable and so no date is hardcoded (§2.3).
    > **Known limit, written into the script's header:** it verifies shape and dates. It cannot verify
    > that a claim is any good, that a threshold is the right number, or that a status is honest — and
    > it specifically cannot catch a threshold softened *after* seeing the result, which is the failure
    > §9.1 actually cares about. That one stays a human duty.
    *(Original text below.)*
    §9.1: "Before building anything significant, write one sentence: what you
    believe, the number that would refute it, when you will check." Confirmed 2026-08-16 that **no such
    artifact exists** — `DECISIONS.md` records *why* choices were made and `LAUNCH_READINESS.md` records
    *what is true now*, but nothing records *what we believe and what would prove us wrong by when*.
    §11's first move is to keep the decision log current **and calendar the audit**; §9.1 closes with the
    line that makes it matter: "When a claim is refuted, the response is a change to the product — **not
    a softer restatement of the claim.**" That is precisely the failure this project keeps re-running:
    item 17 and item 24 each softened their own framing across a dozen updates rather than concluding.
    Seed it with the plan's own three examples plus the live bets this build has already made without
    writing them down — sequential unlocking, the two-track split, five languages under "(Beta)",
    parent-facing kids content, the spaced-review queue — each with a refuting number and a check date.
    Where a claim is unmeasurable today, say so and name what would make it measurable (usually item 18).

31. **[Feature — ✅ DONE 2026-08-16. Shipped as scoped: hash routes, one module, no router. What is
    left is not routing work — it is the product question the build surfaced, below.]**
    - **What shipped:** `src/lib/deepLink.js` — `#/learn`, `#/practice`, `#/reference`,
      `#/lesson/<id>`, addressed by stable lesson **id** rather than path index (an index rots into a
      link to a *different* lesson the next time a track is reordered). `App.jsx` gained exactly two
      call sites. No dependency added. Guarded by `check-data.mjs` §18, proven by five injections.
    - **The item's own caution was the design constraint, and it held.** Item 12's port-cost rule is
      why this is hash routing and not a router: the entire web-specific surface is one file plus two
      call sites, which a native shell deletes. Hash routing also needs no server-side rewrite, which
      the static `public/` deployment shape does not have.
    - **⚠️ What this surfaced, and it is an OWNER question, not a follow-up task:** §5's acquisition
      engine is screen-recorded clips, but **a link to a locked lesson cannot open it** — sequential
      unlocking is a recorded product bet (`CLAIMS.md` A1), and letting a URL walk past it would void
      that bet silently from outside the app. So a clip of lesson 20 lands a new visitor in lesson 1
      (not on a cold menu — §3.2), having been promised lesson 20. Options are (a) accept, (b) let a
      link open any lesson read-only without marking progress, (c) drop sequential unlocking. Written
      up in `DECISIONS.md` and on `CLAIMS.md` C2. **A run must not decide this unilaterally** — it is
      the same shape as §10.3's kids framing.
    - **Deliberately not built:** routes for the Reference sub-nav (every route is surface a native
      port must reproduce), and a share/copy-link button (new UI in five languages, and the address
      bar already carries the URL). Neither is queued; a run wanting either should say which clause it
      moves first.
    *(Original text below, retained for the measurement that motivated it.)*
    **Shareable per-lesson URLs — §5's web-funnel requirement. Read the §2.1 caution first.**
    §5: "Web is top-of-funnel: lessons 1–2 playable with no signup, **each lesson a shareable URL**."
    §8's roadmap puts "Web deployed; 10 clips recorded" on the monetization/web row. Verified 2026-08-16:
    **the app has no routing of any kind** — no `history.pushState`, no hash routing, no router
    dependency; tab and lesson selection are component state only. So there is no link to post to
    Product Hunt, Show HN, Reddit or a clip description, and §5's entire distribution motion has nothing
    to point at. **The caution, and it is real:** item 12 (§2.1 Expo vs. web-first) is HELD, and its
    standing rule is that the dev agent "must not deepen the web-only investment in a way that raises
    the eventual port cost." A full web router would do exactly that. **Scope it so it doesn't:** plain
    hash deep-links (`#/lesson/12`) read once on load and written on navigation, isolated behind one
    small module so a native shell can ignore or replace it, and no routing library added. If a run
    concludes even that conflicts with item 12, **say so and leave it** — flagging the conflict is a
    legitimate outcome and better than a silent port-cost increase.

37. **[Process — ✅ DONE 2026-08-16. Refreshed, and the item's own "since it will keep moving" is now
    enforced rather than trusted: `check-data.mjs` §11b fails the build when this figure disagrees with
    the live ledger.]**
    - **What shipped:** §10.4 now reads **es/ko/zh/ja 93% (0% human, 3 stale)** each, and says plainly
      that the drop from 100% is the ledger *working* — English bodies for lessons 5, 27 and 28 were
      edited after review, so those pairs are flagged stale instead of still counted as covered.
    - **The one-line fix was not the valuable half.** This figure went stale for five days because
      nothing compared the scorecard to the ledger it quotes, which is the same shape as item 36's
      blind patterns: the data was right and the document reporting it was wrong. §11b closes that —
      it **fails** (not warns, per §16's precedent that an unread warning is no check) and its message
      prints the exact replacement string, so the fix is a copy-paste. Proven by three injections,
      including re-inserting the real historical `100%/…/100%` text and **deleting the sentence
      entirely** — the latter is the hole a check like this usually has, where removing the claim
      satisfies the checker.
    - **Deliberately NOT guarded: the same row's character-count figures.** They move by single digits
      on any content edit, and a build that fails over 19 characters gets switched off within a week.
      Stated in §11b's header so a later run doesn't "complete" it.
    - **Char figures refreshed anyway** (es 97,994 / ko 48,469 / zh 30,733 / ja 42,555): every
      non-English count fell by **exactly 19** on 2026-08-16 while English stayed identical to the
      character — item 36's cross-reference fixes shortening two-digit lesson numbers to one digit.
      Worth recording because "all four moved by the same 19" is what identifies the cause; a run
      seeing this in isolation would suspect a translation edit.
    *(Original text below.)*
    **`LAUNCH_READINESS.md`'s
    translation-coverage figure is stale.** Its §10.4 row reports "currently 100%/100%/100%/100%
    coverage, 0% human," which was true when the P-4 decision landed 2026-08-11. `npm run
    review-status` now reports **93% in each language with 3 entries stale** — English lesson text has
    been edited since those reviews, so the ledger correctly flags drift. The file is not wrong about
    the *decision*, only about the *number*. Fix is a one-line refresh, but re-run `npm run
    review-status` for the live figure rather than copying this item's, since it will keep moving.
    Worth doing alongside item 32's audit, which reads that file. Recorded as the checkable half of
    claim **A3** in `CLAIMS.md` — the debt is currently drifting the wrong way, which is exactly what
    that claim's second refutation clause watches.

32. **✅ DONE 2026-08-17 (scheduled dev-agent). Run as `reviews/2026-08-17-monthly-audit.md`, nineteen
    days early and deliberately — four of the five questions were fully answerable from the repo today.
    Question 4 was the trivial one (`0 past due`); questions 1, 2, 3 and 5 were not.** The three findings
    worth not re-deriving, each measured rather than asserted:
    - **Q1 — the ratio nobody had summed.** Over the eight days to 2026-08-17: `AGENT_LOG.md` churned
      **20,061 lines** against **1,964 lines of application code** (`src/` minus content and locales) —
      slightly over **10:1**. The run log alone out-churned the entire `src/` tree (16,802). The project
      had been observing this locally for a week (W-3's 909 KB cut, three staleness flags, two
      “actionable areas are thin” notes) and never multiplied it out. **Filed for §10 as B-1.**
    - **Q3 — stronger than “I haven’t spoken to any users.”** There is no surface on which a user could
      exist: no `.github/`, no `netlify.toml`/`vercel.json`/`CNAME`, `dist/` gitignored, and
      `analytics.js`’s own header says there is no provider or backend. Item 18 is correctly named as the
      critical path in every run’s output — but it is **downstream of a deploy that no backlog item
      owns**. That gap is now **item 72**.
    - **Q5(b) — a measured process failure with no claim covering it.** The log records, item by item in
      its own words, a **nine-item consecutive streak of wrong-or-partly-wrong premises** (55, 56, 57,
      then 58 “the fourth item running”, 59, 61/62, 60, 66, 63), broken by item 64. `CLAIMS.md`’s D1 and
      D2 cover *verification*; nothing covers *filing*. Proposed as **D3**, deliberately **not** added —
      an audit that quietly edits the register it is auditing is not auditing it. **Item 73.**
    > **What the audit fixed on the spot, because finding a wrong number and leaving it is the defect.**
    > `CLAIMS.md` had gone stale in two of its own rows within ~24 hours of being written — the file
    > whose entire purpose is to stop beliefs going quietly stale. A6’s status cell said **120 min**
    > (item 56 moved the catalog to **144** the next day); A3’s paragraph said **93%, 0% human, 3
    > stale** and called `LAUNCH_READINESS.md` stale for saying 100%, when `9f24a0b` had re-reviewed
    > those pairs and **`LAUNCH_READINESS.md` was right**. A6’s figure is now **generated** by
    > `refresh-readiness.mjs` (11 figures across 3 docs) and proven to bite on three injections — stale
    > number, deleted sentence, softened verdict. **A3’s was deleted, not guarded**, on item 55’s rule
    > and for a second reason worth stating: the audit’s headline finding is that this project builds
    > too many instruments, and answering it with another instrument would be comic.
    > **What was deliberately NOT done:** §9.3’s closing step (“update §10”) — §10 is in `LAUNCH_PLAN.md`,
    > which the owner has uncommitted edits in. The three blindspots are written in §10’s own format in
    > the audit’s §6, ready to move across verbatim. **Next run of the ritual: 2026-09-05**, the first
    > Saturday, when question 4 stops being trivial — **nine claims come due on that exact date**, six of
    > them unmeasurable and every one of those naming item 18.
    <details><summary>Original text of item 32, as filed 2026-08-16</summary>

    **[Process] Run the §9.3 monthly blindspot audit — it has never been run.** §9.3 specifies one hour,
    first Saturday, five standing questions (the number you avoided looking at; what survives only
    because removing it feels wasteful; what the last three users said, where "I haven't spoken to any"
    *is* the finding; which claim is past its check date; what a skeptical friend would call obviously
    wrong). `LAUNCH_READINESS.md`'s §10.7 row already defers to it ("Recheck that way at each monthly
    audit"), so something is pointing at a ritual nobody has performed. **Next first Saturday is
    2026-09-05.** A dev-agent run can do the preparation honestly — questions 1, 2, 4 and 5 are
    answerable from the repo, and question 3's honest answer today is "none, and that is the finding."
    Write the result as `reviews/YYYY-MM-DD-monthly-audit.md` and update §10 per the plan. Depends on
    item 30 for question 4 (there are no claims with check dates yet to be past).
    </details>

40. **[A11y — ✅ DONE 2026-08-16. Fixed as a pattern, not one line: the audit found the `<ol>`/`<ul>`
    question was the *smaller* of the two defects in these lists.]**
    > **Renumbered 34 → 40 on 2026-08-16 (owner-requested).** Two different items were both numbered
    > 34: this one and the "Be the Fed Chair" policy simulator. This item had the number first (filed
    > as 33 at 13:11, renumbered to 34 in the same commit); the simulator took 34 at 15:31 without
    > noticing. **This one moved anyway** — not by seniority but by blast radius: the simulator's
    > number is cited from `src/content/policyScenarios.js`, `src/components/PolicySim.jsx`,
    > `src/locales/en.js`, `scripts/check-data.mjs`, `scripts/check-blindspot.mjs`, `DECISIONS.md` and
    > `.gitignore`, while every reference to this one is `AGENT_LOG.md` prose. Renumbering the cheaper
    > side is the fix that cannot leave a stale pointer in code.
    > **Reading older entries:** run-log entries dated 2026-08-16 that say *"item 34's `<ol>`/`<ul>`
    > a11y call"* mean **this item (40)**. Those entries are history and were accurate when written, so
    > they are left as they were rather than rewritten. Any other "backlog item 34" — and every one in
    > source code — means the simulator.
    > A duplicate-number check now guards this: `scripts/check-data.mjs` fails if two backlog items in
    > `AGENT_LOG.md` share a number, so the next collision breaks the build instead of being noticed
    > three days later by a human reading the file.
    > **Closing update, 2026-08-16.** `MarketSignals.jsx`'s list is now a `<ul>`. `ratePrinciples` was
    > read before changing it and the six principles have no sequence, ranking or dependency — confirmed
    > by content, not by assuming this item was right.
    > **All eight lists under `src/` were audited, and the verdicts are recorded in `check-data.mjs`
    > §20's header so a later run reads them instead of re-deriving them:** `Learn.jsx`'s lesson path
    > (order is the feature — lessons unlock in sequence) and `Sectors.jsx`'s relative-strength ranking
    > (each row states its own "rank N of M") are genuinely ordered and stay `<ol>`. `ParentGuide.jsx`
    > stays `<ol>` too, on a different ground: it renders a **visible ordinal** per row, so its semantics
    > already match what is on screen. That its ordinal is announced *as well as* the item's position is
    > redundant rather than wrong, and `aria-hidden`-ing it was deliberately **not** done — see the run
    > log for why that would have made the ordinal depend on the WebKit behavior below. The three
    > `charts.jsx` legends were already `<ul>`.
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
    > so a dead pattern can't pass vacuously. Proven by three injections. §20's header also states what
    > it **cannot** do: it cannot tell whether `<ol>` or `<ul>` is right, which is the content judgment
    > this item was actually about.
    *(Original text below.)*
    `MarketSignals.jsx`'s
    (renumbered from 33 → 34 on 2026-08-16: two different items were both filed as "33" by two runs the
    same day — the content bug above and this one. This is the a11y one.)
    "Key Principles" list is an `<ol>` whose content is not ordered.** Noticed 2026-08-16 while removing
    that element's dead `counterReset` (W-4's last item). The element is
    `<ol style={{ listStyle: "none" }}>` and each `<li>` renders a hardcoded, `aria-hidden` em-dash marker
    — so it is *presented* as an unordered list while being *announced* as an ordered one. The six
    principles (policy lags, curve inversions, speed-vs-level, real rates, sustained tightening, where
    tightening stops) have no sequence, ranking, or dependency between them, so `<ul>` looks more accurate.
    **Why this run did not just change it:** the fix is one word, but it is a semantics change nobody has
    decided, and this repo's own norm (see item 21's (b) clause) is that a run should not settle an
    unscoped question implicitly just because it happened to be touching the file. Whoever picks it up
    should confirm the principles really are unordered — read `ratePrinciples` in `src/content/markets.js`
    — and check whether any other list in the app has the same `<ol>`-styled-as-`<ul>` shape, so this is
    fixed as a pattern rather than one line. Verify against a live accessibility tree, not just the source.


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
34. **[Feature — ✅ BUILT 2026-08-16 (scheduled dev-agent). Shipped inside lesson 35, two scenarios,
    three levers each, five languages, no score. Do not re-pick this item to "extend" it — the last
    bullet says what a third scenario has to justify first.] A "Be the Fed Chair" policy simulator.**
    > **Number note, 2026-08-16.** A second item also carried number 34 — the `<ol>`/`<ul>`
    > accessibility item, which actually held it first — until it was renumbered to **40** to end the
    > collision. **This item kept 34**, because its number is cited from source code and config
    > (`policyScenarios.js`, `PolicySim.jsx`, `locales/en.js`, `check-data.mjs`, `check-blindspot.mjs`,
    > `DECISIONS.md`, `.gitignore`), and moving it would have meant a stale pointer in seven files.
    > **Every "backlog item 34" in source code means this item.** In `AGENT_LOG.md` run-log prose, an
    > "item 34" about `<ol>`/`<ul>` lists means item 40.
    > **Built 2026-08-16.** `src/content/policyScenarios.js` (the scenarios) +
    > `src/components/PolicySim.jsx` (the component) + one call site in `LessonReader.jsx`, which is the
    > whole surface — it renders `null` for the other 39 lessons, so §3.1's three destinations are
    > untouched, as this item's own scope caution required. Guarded by `check-data.mjs` §19, and the
    > file is now in `check-blindspot.mjs`'s §2.3 teaching-copy list. Verified in a live browser (both
    > themes, 375px, en + ko). See the run log entry of this date for the full writeup, including the
    > blind-pattern bug the §19 injection test caught in the check itself.
    > **✅ Instrumented 2026-08-16 (later run this date), closing the one gap two entries had filed
    > against this item.** It shipped with no analytics at all, which left §3.0.4's differentiator bet
    > unmeasured — `sim_lever_chosen` now fires on choosing a lever (never on clearing one), carrying
    > `{lessonId, scenarioId, optionId}`, guarded by `check-data.mjs` §13c, and the belief it measures
    > is written down as `CLAIMS.md` **A7** with two refutation clauses. Not measurable until item 18
    > lands; that is the point of shaping it now. See the run log and `DECISIONS.md`.
    > **Two design decisions are load-bearing and are protected only by file-header comments, so they
    > are restated here.** (a) **No score and no correct answer** — every lever returns a consequence,
    > including the ones a committee would rarely pick, because the hosting lesson's whole point is that
    > the trade-off has no formula. A future run that adds scoring reverses the lesson. (b) **No
    > numbered lesson references in the scenario prose** — it names other lessons by subject ("the QE
    > and QT lesson"), because §16's cross-reference guard does not walk this file; §19 fails the build
    > if a number appears. Extend §16 rather than delete that check.
    > **What a third scenario would have to justify:** the two built cover the dual mandate's two
    > directions (overheating, contraction), which is the tension the lesson teaches. A third is only
    > worth it if it teaches a *different* mechanism — the zero lower bound and the handoff to
    > balance-sheet tools is the obvious candidate, and it would belong in the QE/QT lesson, not this
    > one. Adding a fourth scenario to lesson 35 would be the count-shaped drift items 17, 21, 24 and 27
    > each turned into.
    *(Original framing below.)*
    Extracted 2026-08-16 (owner-requested audit of that file) so the idea survives
    independently of the file, whatever is eventually done with it. **Do not copy v6's code** — it uses
    its own `DS` design-system object, carries Dalio branding (§10.2) and hardcoded "April 2026" dates
    (§2.3), and none of that may cross over. This item is the *concept* only.
    - **What it is, in v6:** a scenario card with a macro situation, a question, and three policy
      levers; picking one returns an explanation of the consequence rather than a score. Its two
      scenarios: *"Inflation is raging at 7%. Unemployment is very low at 3.5%. The stock market is
      overheating — what is your move as Fed Chair?"* (hike / cut / do nothing) and *"A severe recession
      hits. Unemployment jumps to 8%, inflation drops to 1%, markets crash 30% — how do you stimulate?"*
      (hike / cut to zero / start QT). Feedback is explanatory: *"Raising rates increases the cost of
      borrowing, cooling demand and slowing inflation."*
    - **Why it is worth building, and why it ranks with item 27 rather than below it:** §3.0.4 says the
      differentiator is what a chat window cannot do. A diagram shows a mechanism; **a simulator lets a
      learner drive one and watch it respond** — the same argument one step further. It maps directly
      onto the economy track's existing spine (lessons 35 interest rates, 37 QE/QT, 32/33 the debt
      cycles) and turns lesson 35's Fed dual-mandate section from prose into a decision the learner
      makes. `grep -rn "simulat" src/` confirms nothing like it exists today.
    - **It is also unusually safe ground for this app.** The §10.1 advice-adjacency rule constrains
      almost every interactive idea in a *personal-finance* app — but this is **central-bank policy, not
      a buy/sell decision**, so the "what would you do" framing carries none of the usual risk. The
      scenarios are hypothetical and dateless, satisfying §2.3 by construction. Keep it that way: no
      real dates, no current readings, and no drift from "here is how the lever works" toward "here is
      what markets will do next."
    - **Scope caution:** build it as one lesson-embedded component (`LessonVisual.jsx`'s pattern), not a
      new tab. §3.1 deliberately cut the app to three destinations, and v6's extra Sectors/Industries/
      Finance tabs are exactly the junk-drawer growth that section removed.
    - **Everything else in v6 has already shipped independently** — audited 2026-08-16: its charts
      (`YieldCurve`, `CycleChart`, `BarChart`), `SectorTable`, `Flashcards`/spaced repetition,
      `MiniQuiz`, `LearningPath`, `Onboarding` and dark mode all have real equivalents in `src/`, built
      without consulting it. `HistoryTimeline` is the only other unshipped piece and it overlaps
      existing lesson content; it is **not** recommended. After this item, v6 holds no unique live idea.


38. **[Process — ✅ DONE 2026-08-16. Filed as cosmetic and one file; it was neither. Three files had the
    idiom, one of them in the market pipeline, and the third was found by the guard rather than by the
    grep that scoped the work.]** `check-claims.mjs` computed "today" in UTC.
    - **What shipped:** all three now import `todayStr` from `src/utils/date.js` — the same function
      `useMarketData` compares against, so the writer and the reader of a date cannot disagree.
      `check-claims.mjs` (the §9.1 past-due warning), `scripts/fetch-market-data.mjs` (the `asOf` stamp
      on `public/data/market.json`), and `scripts/translation-review.mjs` (a ledger entry's
      `reviewedDate`). Guarded by **`check-data.mjs` §23**, which fails on the idiom anywhere under
      `src/` or `scripts/` and separately requires those three scripts to import the shared helper.
    - **The market one was the consequential half, and it was not cosmetic.** `asOf` is what
      `useMarketData` measures staleness from. The job runs 6:30pm ET — 22:30 UTC in EDT, 23:30 in EST
      — so the UTC day was right by ninety minutes in summer and **thirty in winter**. A late start or
      a slow fetch in January stamps tomorrow's date, which reads as a negative age and keeps a
      genuinely stale file looking fresh past `STALE_AFTER_DAYS`. Verified end-to-end: a forced fixture
      run wrote `asOf=2026-08-16` at 23:11 EDT, where the old idiom returned `2026-08-17`.
    - **The one legitimate UTC use is exempted by comment, not by path** — Tiingo's query lower bound,
      where a day either way is swallowed by a 1.5x over-fetch. §23 counts the exemptions and fails if
      the count changes, so a second one has to be argued for rather than inherited.
    - **Known limit, written into §23's header:** it catches the idiom, not the mistake. A hand-composed
      `getFullYear()` date, or a `.toISOString()` sliced on another line, passes. The positive
      import-requirement half is what makes that acceptable — but it names three script paths
      explicitly, so a *fourth* script that starts deriving a date is not covered until someone adds it.

    See item 43 for what this run found on the way, which is the more valuable half.

39. **[Process — ✅ CLOSED 2026-08-17, as its own scoping directed: both replacements (46, 47) have
    landed. Do not pick this again; the un-buildable part is un-buildable for the reasons measured
    below, and the one remaining idea is reviewer work, not a `npm test` gate.] Nothing checks that a check and the document it
    guards land in the same commit.** Filed two runs ago and restated here so it stops living only in a
    note chain. Every guard this project has added (`check-data.mjs` §11b/§16/§17/§19/§20,
    `check-claims.mjs`'s new count guard) protects a document figure or a call-site shape *after* the
    fact; nothing prevents a commit that adds the claim and skips the check, which is how §10.4's
    figure went stale for five days. **Scope it honestly before picking it** — this may not be
    checkable in a script at all, in which case saying so and writing the reasoning down is the
    valuable outcome, not a half-guard that reads as coverage.
    > **✅ SCOPED 2026-08-17 (owner-requested). The item as written is not buildable here, and the
    > reason is structural rather than a matter of effort. What replaces it is two smaller items, 46
    > and 47, both buildable. Everything below is measured — commands in the run-log entry.**
    >
    > **1. "Same commit" is unreachable in this repo, provably — not merely awkward.** The three places
    > a co-landing rule could be enforced are a commit hook, CI, and `npm test`:
    > - **Hook: dead by construction.** `.git/hooks/` holds only samples, and it would not matter if it
    >   did. This repo's commits are made with `git write-tree` + `git commit-tree` + `git update-ref`,
    >   because `git commit` porcelain hangs here for minutes (a documented, long-standing workaround).
    >   **Plumbing runs no hooks.** Verified in a throwaway repo, not assumed: with a `pre-commit` that
    >   `exit 1`s, porcelain refused to commit and the plumbing path created the commit anyway.
    > - **CI: does not exist**, and cannot without a usable remote — `origin` is unusable by standing
    >   rule, so there is no server-side gate to add.
    > - **`npm test`: the only real gate, and it runs before a commit exists.** It sees a working tree,
    >   not a commit boundary. Anything phrased as "in the same commit" is outside what it can observe.
    >   Anything phrased as a property of the tree is inside.
    >
    > **2. Even with an enforcement point, the literal rule is too noisy to be a gate. Measured over the
    > whole history:** 62 commits touched `LAUNCH_READINESS.md` / `LAUNCH_PLAN.md` / `DECISIONS.md` /
    > `CLAIMS.md`; **51** of them changed a line carrying a measurement-shaped figure; **29 of those 51
    > (57%) touched no file under `scripts/`.** A gate firing on 57% of figure-touching commits is
    > noise — and most of those 29 are *correct*, because the guard already existed and needed no edit.
    > That is the tell that the rule is mis-stated: what matters is **coverage** (every live figure has
    > a guard, whenever it was written), not **co-landing**.
    >
    > **3. Why blanket "every figure is guarded" cannot be automatic: live claims and dated records are
    > the same syntax, and they share sentences.** `LAUNCH_READINESS.md`'s §10.4 row contains, in one
    > line, `es 97,994 chars (0.720x…)` — live, must equal the content today — next to "dropped to 93%
    > earlier that day" and "fell by exactly 19 characters", which are history and must *never* change.
    > No parser separates those. The distinction has to be supplied by whoever writes the figure, so
    > some annotation is unavoidable; the only real question is how much. **Size of the surface:** ~119
    > measurement-shaped figures across the four docs plus the App summary, of which **2 are guarded**
    > (§11b's coverage sentence, `check-claims.mjs`'s §9.1 claim count). Annotating all 119 is not
    > worth it, and most of them are history that needs no guard.
    >
    > **4. What is actually worth building — items 46 and 47, in that order.** Both are tree
    > properties, so `npm test` can hold them, and both attack the recurring failure rather than the
    > general one. The recurring failure is not a wrong number: **in every instance on record the
    > number was still right and the *method* had rotted** (see 5 below). Guard the method.
    >
    > **5. What this scoping found while measuring it — the failure, live, for the second time.** The
    > commit that landed *during this scoping* (`6f5c48c`, item 45, per-language content split) deleted
    > `lessonContent.economy.js` and `lessonContent.money.js` and touched no document. Both of
    > `LAUNCH_READINESS.md`'s runnable refresh snippets still imported those paths and threw
    > `ERR_MODULE_NOT_FOUND`; `DECISIONS.md` still described the two-file layout. The figures those
    > snippets produce were all still **correct** (re-derived through the merged view: 40 lessons /
    > 136,031 en chars / 120 min, es 0.720x / ko 0.356x / zh 0.226x / ja 0.313x — exact matches), so
    > nothing numeric was stale. **The procedure was.** And the same paragraph had already recorded
    > this happening once before, three days stale after item 25's split — its own warning text ("the
    > commands below would have thrown an import error… run them, don't trust the text") was true
    > again, about itself. Fixed in this commit; the guards are 46 and 47.
    > **The instrument mattered again**: reading that paragraph shows nothing wrong. Running it fails
    > instantly. Fourth entry in this repo's list (items 33, 36, 43, 44).
    >
    > **Not to be built:** the co-landing detector as a build gate (57% false-positive rate, §2 above).
    > As a *reporting* line in the weekly review — "commits since the last review that changed a doc
    > figure without touching a guard" — it is cheap and possibly useful. That is a reviewer tool, not
    > a `npm test` failure, and it should never be described as coverage.

46. **[Process — ✅ DONE 2026-08-17 (scheduled dev-agent). Shipped as `check-data.mjs` §26, with the
    exemption vocabulary the item asked for and one design change it did not anticipate — patterns are
    expanded and checked rather than skipped, which is what catches `DECISIONS.md`'s brace-contracted
    reference to two deleted files. Closing note at the end of this item.] Every repo path
    a tracked document names must exist.** A ~30-line check over `LAUNCH_READINESS.md`,
    `LAUNCH_PLAN.md`, `DECISIONS.md` and `CLAIMS.md`: every backtick-quoted `*.js/.jsx/.mjs/.json/.md`
    path resolves to a real file, or carries an inline exemption marker — the `utc-date-ok:` shape from
    §23, with the exemption count asserted so a new one has to be argued for.
    - **Measured before proposing:** 93 distinct path references across the four docs; **11 do not
      resolve today**. Four are the real, current breakage item 39's scoping fixed. The other seven are
      exactly the two false-positive classes the exemption vocabulary has to cover, and they are the
      design work: `LAUNCH_PLAN.md`'s `lessons.json`/`quizzes.json`/`glossary.json` name a format the
      project **deliberately rejected** (`DECISIONS.md`: `.js`, not JSON) and must never be "fixed";
      `v5.jsx`/`v6.jsx`/`market.json` are shorthand for paths that do exist elsewhere in the tree.
    - **Why it earns its place:** it would have failed within seconds of `6f5c48c` landing, and it is
      the only check proposed here that needs no annotation of existing content.
    > **Closing note, 2026-08-17.** Built as `check-data.mjs` §26. Marker is `<!-- path-ok: <path> —
    > why -->`, document-scoped rather than line-scoped: five of the ten exemptions sit inside table
    > rows, and an HTML comment on its own line between two rows ends the table. Naming the path in
    > the marker is what keeps document scope honest, plus two counter-assertions — the total is
    > pinned at 11 references, and a marker for a path that now resolves fails as **stale**, so an
    > exemption cannot outlive its reason.
    > **The item's own measurement was wrong in a way worth recording**, and it is the same "read the
    > code, don't run it" mistake this repo keeps logging. It said 93 references / 11 dead / seven
    > false positives across two classes. Actual: **184 references, 70 distinct, 11 dead across four
    > classes** — the hand count missed that `market.json` resolves fine (`public/data/market.json`,
    > by the suffix rule any usable check needs), missed `SKILL.md` entirely (it lives outside the
    > repo), and treated globs as a non-issue when one of them, `lessonContent.{economy,money}.js`,
    > is the *same* item-45 rot in wildcard clothing. A check written to the item's numbers would
    > have skipped it.

47. **[Process — ✅ DONE 2026-08-17 (scheduled dev-agent). Shipped as `scripts/refresh-readiness.mjs`
    with three modes; the two live figures are now generated, and `npm test` holds them. Item 39 is
    closed with it — see the note at the end of this item.] Move
    `LAUNCH_READINESS.md`'s refresh snippets out of the document and compare their output to the
    figures the document states.** The snippets are *code stored in prose*: nothing imports them,
    nothing runs them, and they have now rotted twice while the numbers beside them stayed right.
    - **Scope:** a `scripts/refresh-readiness.mjs` that computes the catalog figures (lesson count,
      English chars, minutes, per-language chars and ratios) and prints them; the doc references the
      script instead of inlining a copy; `npm test` runs it and fails if the doc's stated figures
      disagree — the generate-and-diff shape (`gofmt -l`), and a generalization of what §11b already
      does for the one coverage sentence.
    - **Why this and not annotation:** it removes the duplicate rather than checking it. A figure that
      is derived cannot go stale, and a snippet that is executed cannot name a file that does not
      exist. Both of this item's recorded failures die at once.
    - **Deliberately out of scope:** the other ~119 figures. Only the catalog block and the coverage
      sentence are worth generating today; the rest are history, and history needs no guard.
    > **✅ Built as scoped, 2026-08-17, with one addition the scope did not name and should have.**
    > `scripts/refresh-readiness.mjs` has three modes on the `gofmt` shape: bare prints the figures
    > (what the two deleted snippets did), `--check` compares them against `LAUNCH_READINESS.md` and is
    > chained into `npm test`, and **`--write` rewrites them in place**. The third one is not a
    > convenience — it is what makes the gate survivable, and it answers the objection §11b wrote down
    > when it deliberately refused to guard character counts ("a build that fails over 19 characters
    > would be turned off within a week"). That objection is right about a hand-maintained figure and
    > does not carry to a generated one: the fix is now `npm run readiness -- --write`, so the guard
    > costs a run one command instead of a re-derivation. §11b's coverage sentence was left alone — it
    > already works, and folding it in would have been a rewrite rather than this item.
    > **Guarded surface: exactly two sentences**, the §4.3 catalog row and §10.4's `es…ko…zh…ja`
    > character sentence — the document's only figures that must equal the content *today*. The doc's
    > history figures (`112,387`, `100 minutes`, `dropped to 93%`, "by **exactly 19 characters**") were
    > verified untouched by a `--write` that did change something; that negative control is the one
    > that matters, since item 39's scoping showed live and historical figures share sentences and no
    > parser separates them.
    > **Item 39 is closed by this.** Its two buildable replacements — 46 (§26 dead-path check) and 47 —
    > have both landed. What it correctly ruled out (a co-landing detector as a build gate, 57% false
    > positives) stays ruled out; the reporting-line idea it left for the weekly reviewer is still
    > unbuilt and is a reviewer tool, not a `npm test` failure.

49. **[Process — ✅ DONE 2026-08-17 (owner-directed). Two of the three surfaces were REJECTED on the
    measurement, the item's own ranking was backwards, and putting `README.md` under §26 turned up a
    live §10.2 blindspot violation that had been in the repo's front-door document since it was
    written. See the closing note.] Widen §26's surface, one form at a time.** §26 checked
    backtick-quoted paths in four documents. Three gaps, each a separate decision rather than one sweep:
    - **Markdown link targets** (`[text](path)`) and un-backticked paths. Cheap and probably right —
      a link to a moved file is the same defect §26 exists for, and arguably a worse one because it
      renders as a working link.
    - **`README.md` and `reviews/*.md`.** `README.md` is the one document a new reader runs commands
      from, so it has the strongest claim of the three. `reviews/` are dated snapshots and may belong
      with `AGENT_LOG.md` on the history side.
    - **`AGENT_LOG.md`: deliberately NOT proposed.** An append-only history *should* name files that
      have since been deleted; guarding it would mean annotating every old entry, and the annotation
      would outnumber the content. Recorded here so the next run does not re-derive it as an oversight.
    > **Do not treat this as a coverage gap to close on reflex.** §26's whole value is that a failure
    > means something; each surface added is another exemption class to define first (a `reviews/`
    > sweep would need one per dated snapshot). Measure the dead-reference count for a surface before
    > deciding it is worth guarding — item 46's own filed measurement was wrong in four ways.
    > **✅ CLOSED 2026-08-17. The instruction above was followed, and it paid: one surface added, two
    > rejected on their numbers, and the item's own ranking was backwards.** Full numbers live in
    > `check-data.mjs` §26's header, where the next person to widen it will actually read them.
    > - **`README.md` — ADDED.** 31 backticked references, **3 dead** (`Home.jsx`, `Markets.jsx`,
    >   `More.jsx`, gone in the 2026-08-04 rebuild). The only surface with live rot. Fixed rather than
    >   exempted, along with a "What's here" section that described the pre-rebuild tree throughout.
    > - **Markdown link targets — ADDED, with the honest caveat that they catch nothing today**: 3
    >   references in the guarded docs, 0 dead. The item ranked this first as "cheap and probably
    >   right"; the measurement says it is cheap and currently *empty*. It is in because coverage that
    >   depends on a formatting choice is a hole — rewriting `` `foo.js` `` as `[foo.js](foo.js)` used
    >   to walk a reference out of §26 — not because it found anything. The surface is too small for a
    >   corpus floor to mean anything, so the pattern is self-tested against a fixed probe instead.
    > - **Un-backticked bare paths — REJECTED.** 16 references, 8 dead, and all 8 are paths *already*
    >   exempted in backticked form: +8 exemptions (11 → 19) for 0 new finds. It is also unsound —
    >   the pattern matches `Node.js` in "Requires Node.js 18+", which is English, not a file.
    > - **`reviews/*.md` — REJECTED, and the measurement proved itself mid-run.** 98 references / 6
    >   dead on the first pass; **112 / 8** ninety minutes later, after the weekly reviewer appended a
    >   section whose two new dead paths are it correctly describing files item 45 deleted. A dated
    >   snapshot accrues dead paths *by doing its job* — `AGENT_LOG.md`'s own argument, so `reviews/`
    >   belongs on the history side with it, owing a new exemption every Sunday.
    > **The find this item did not predict**, and the reason adding a surface beat widening a pattern:
    > reading `README.md` properly for the first time turned up **`inspired by the framework
    > popularized by Ray Dalio and other economists` in its opening sentence** — a §10.2 violation in
    > the project's front-door document. §10.2 has been reported closed since 2026-08-01 by a check
    > that scans `src/` and the v5 prototype, i.e. the two places the rule was already obeyed.
    > `LAUNCH_PLAN.md:38` even records replacing this exact sentence pattern elsewhere. Removed, and
    > `check-blindspot.mjs`'s §10.2 scan now covers `README.md` (only README — `LAUNCH_PLAN.md` and
    > `LAUNCH_READINESS.md` name Dalio while *stating* the rule, and a check that forbids describing
    > its own rule is unusable). **Blindspot-register status is unchanged on paper and should not be:
    > §10.2 is closed again, for the first time across the whole surface a reader sees.**

41. **[A11y — ✅ DONE 2026-08-16. Fixed, guarded by a new §22 check — and the live verification of the
    fix found that the same figure was failing sighted readers too, which is the more interesting
    half. See the run log.] `Bar` is the one chart primitive with no accessible description.**
    > Filed as 40 and renumbered to **41** before commit, because `check-backlog.mjs` — which landed from
    > a concurrent run *while this one was in flight* — failed the build on the collision with the
    > renumbered a11y item 40. Working exactly as designed, on its first day, against the next run to
    > make the mistake. Nothing cites 41 from code yet, so this side had the smaller blast radius.
    Every other chart in `charts.jsx`
    (`YieldCurve`, `ProportionBar`, `GrowthCurve`, `AsymmetryChart`, `CycleChart`, and the new
    `BracketStack`) takes a `description` and renders `role="img" aria-label={description}`. `Bar` takes
    none, so lesson 37's Fed balance-sheet figure is a stack of unlabelled `<div>`s to a screen reader —
    the *only* lesson visual in the app with no text alternative. Measured, not assumed: walking lessons
    1/3/7/27/32/36/37 in a live browser returns one `[role="img"]` each except **37, which returns 0**.
    - **Scope:** add `description` to `Bar` and a five-language `balanceSheetDescription` to `markets.js`
      alongside the existing `balanceSheetCaption`, matching how the other six figures are written.
      `Bar` is also used by Reference → Market signals, so check both call sites.
    - **Why it wasn't done in passing:** it needs new five-language content, which is a different kind of
      change from the run that found it, and §17-style parity checks apply. Small, but not a one-liner.
    - **Worth a check, not just a fix:** the general property — every chart primitive that renders a
      figure exposes a text alternative — is assertable in `check-data.mjs` the same way §20 asserts list
      semantics, and would have caught this at the time `Bar` was written.
    > **Closing note, 2026-08-16.** All three bullets done: `balanceSheetDescription` (5 languages, parity
    > for free via §7's `CONTENT_MODULES`), both call sites wired, and **§22** in `check-data.mjs` asserting
    > the general property in both directions — every primitive accepts `description` *and* binds it to a
    > `role="img"` label, and every call site passes a prop that can supply that label. The permitted-prop
    > set is read out of each primitive's own aria-label expression, so `YieldCurve`'s documented
    > `description || label` fallback is accepted on its own terms rather than special-cased.

42. **[A11y — ✅ DONE 2026-08-16 (owner-requested, same evening it was filed). Content shipped as scoped;
    two guard gaps found on the way, both closed — see the closing note and the run log.] The four `YieldCurve` figures
    are labeled by `label`, not by a description — so their accessible name is "Normal (healthy)", which
    names the curve without describing it.** §22 passes them legitimately: `YieldCurve` declares
    `aria-label={description || label}`, both call sites (`LessonVisual` lesson 36, `MarketSignals`'s 2×2
    grid) pass only `label`, and the fallback is deliberate. But a sighted reader sees *the shape* — short
    end below long end, or above it — and the label alone does not carry it, which is the same gap item 41
    just closed for `Bar`, one notch less severe (a name exists; it is thin). Measured: lesson 36 returns 4
    `[role="img"]` whose names are the four short labels.
    - **Scope:** a five-language `yieldCurveDescriptions` keyed by the four curve types in `markets.js`,
      passed at both call sites. No component change — `YieldCurve` already takes `description`.
    - **Do not** "fix" this by deleting the `|| label` fallback: that is what makes §22's derivation
      honest, and injection test (d) confirmed removing it fails both call sites.
    > **Closing note, 2026-08-16.** Shipped exactly as scoped — `yieldCurveDescriptions` in `markets.js`,
    > five languages × four curve types, passed at both call sites, no component change. The fallback was
    > kept, per the bullet above. **Two guard gaps surfaced while doing it, and both are the real content
    > of this item:**
    > 1. **§7's parity helper silently skipped this export's shape.** An object keyed by something other
    >    than a language, holding language maps, matched neither of its two branches — so it was checked by
    >    *nothing*. Proven before fixing: deleting the entire `ko` line from the flat curve left `npm test`
    >    green. A third branch now handles keyed language maps, with a vacuity guard, and the same injection
    >    now fails. Any future export of this shape is covered from day one.
    > 2. **§22's call-site rule was one commit out of date the moment this content existed.** It accepted
    >    `label` for `YieldCurve` because the `|| label` fallback made it a legitimate accessible name — true
    >    while no descriptions existed, false afterwards. Tightened: call sites must pass `description`
    >    outright, and the failure message names the fallback they would otherwise land on. The component
    >    keeps its fallback as a defense against an unnamed figure; it is no longer a license for a call site.
    > **Verified in a live browser, both call sites, en + ko**: all four curves expose the shape description
    > as their accessible name while the verdict labels ("Inverted (Danger)" / "역전 (위험)") remain exposed
    > separately in their figcaptions, so nothing was traded away for the richer name.

43. **[Process — ✅ FOUND AND FIXED 2026-08-16 by item 38's guard, on its first run. Filed as its own
    item because the fix is one character and the finding is repo-wide.] `scripts/translation-review.mjs`
    was invisible to `grep` — and had been since it was written on 2026-08-11.**
    Line 91 wrote its hash separator as a **literal NUL byte** rather than the `\0` escape. One NUL makes
    `grep` class a file as binary and refuse to search it; `file` reported it as "binary data" and
    `grep -n toISOString` on that exact path returned nothing while `sed -n '195p'` printed the match.
    - **How it surfaced, which is the point.** The hand grep that scoped item 38 reported two occurrences
      of the UTC-date idiom. §23's first run reported three. The third was this file. **The scoping
      measurement and the blind spot were the same instrument** — the third recurrence of a lesson items
      33 and 36 each recorded independently, and the first time a *guard* caught it rather than a later
      run cleaning up after it.
    - **What it cost, which is not one stale date.** Every text-scanning check in this repo reads files
      the way a person greps them: §16's cross-references, §17's glossary links, §20's list markers,
      §22's chart descriptions, all of `check-blindspot.mjs` — including its **§10.1 advice-language
      scan**. A file that reads as binary is exempt from all of them at once and reports as a pass. This
      file is a script rather than user-facing content, so nothing was actually shipping unchecked; the
      exposure was that nothing would have said so if it were.
    - **Fixed and guarded.** Raw NUL → `\0`, the same string to the parser and a text file to every tool
      around it. **`check-data.mjs` §24** now fails on a literal NUL anywhere under `src/` or `scripts/`.
      Because the byte lives inside `englishSourceHash`, the change was verified by output rather than by
      inspection: all 40 hashes byte-identical across the edit, and the ledger still reports 100%
      coverage / 0 stale in all four languages.
    - **Worth generalizing, and deliberately not done in this run:** §24 checks NUL only. Other things
      make a file effectively unsearchable — invalid UTF-8, a `.gitattributes` binary marking, a
      minified single line. Whether that is worth a broader "every source file is greppable" assertion
      is a real question and an honest scoping job, not an obvious yes.

44. **[Small — ✅ DONE 2026-08-17. Filed as small and "no §2.3 violation"; the second half of that
    assessment was wrong, and finding out how was the run. See the closing note.] `useMarketData` treats
    a future `asOf` as fresh, and `Sectors.jsx` destructures `ageDays` without using it.**
    With item 38's fix the job can no longer stamp tomorrow's
    date, so the cause is closed — but `isStale` is `ageDays > STALE_AFTER_DAYS`, so any negative age
    still reads as fresh, and a user whose device date is behind the job machine's (a Hawaii evening
    against an Eastern job) sees exactly that. **No §2.3 violation**: the screen prints `asOf` outright
    and never says "N days ago", so nothing is presented as current without its date — which is why this
    is filed small rather than fixed in passing. The unused `ageDays` binding at
    `src/screens/reference/Sectors.jsx:29` is the other half; a run in this file should decide whether
    the hook should clamp, whether the screen should show the age, or whether the binding should go.
    > **Closing note, 2026-08-17.** Fixed as a two-sided rule in `useMarketData.freshness(asOf, today)`,
    > guarded by `check-data.mjs` **§25**, and the three questions above answered: the hook does **not**
    > clamp (a negative age is the evidence the clocks disagree — clamping hides the signal), the screen
    > does **not** show the age (it already prints the absolute date; a relative one is a second rendering
    > of the same fact with its own way of being wrong), and the binding **goes**, with a comment saying
    > which of the three was chosen so the next reader doesn't re-open it.
    > **The item's own "No §2.3 violation" was wrong, and only a rendered check could show it.** The
    > filed defect is a one-sided test — `ageDays > STALE_AFTER_DAYS` reads as "old enough to hide" but
    > means "everything else is current" — and a *missing* `asOf` fails it the same way a future one
    > does: `null > 4` is false, so the file with no date at all was fresh. Served a `market.json` with
    > `asOf` deleted, the pre-fix build rendered all eleven sectors under the heading **"As of
    > undefined"** — figures presented with no date, by the code written to prevent exactly that. The
    > filed reasoning ("the screen prints `asOf` outright") assumed there was always an `asOf` to print.
    > **The negative-age half is real too, and worse than the timezone case that motivated it.** A
    > device whose clock is set five days behind reads a five-day-old file as age −5 and shows it as
    > current; the job's own stamp is no longer the only way to get there. One day ahead is still
    > accepted (`FUTURE_TOLERANCE_DAYS = 1`) because a device west of the job machine legitimately sits
    > on the previous date, and cutting those users off from good data is the worse error.
    > Verified before/after in a live browser at both boundaries — see the run log.

45. **[Perf — ✅ DONE 2026-08-17 (owner-requested). Lesson content split by language as well as by
    track; the largest content chunk drops 499 kB → 117 kB.]** Split `lessonContent` per language.
    > **Why this and not a bigger threshold, or a split down the middle.** `lessonContent.money.js`
    > sat at **499.27 kB against Vite's 500 kB warning — under it by less than a kilobyte**, so the
    > next content edit of any size would have crossed it. Measured before choosing (2026-08-16), the
    > money chunk's 480 kB of body text broke down as **en 97 kB, es 90, ko 102, zh 79, ja 112** —
    > meaning **~80% of the app's largest asset was text the reader's device would never display.**
    > That reframed it: not a build-warning problem but a payload problem, and splitting the file in
    > half would have bought headroom while shipping the same waste. Raising the limit was rejected on
    > precedent — it was done once (2026-08-12, set to 600) and deliberately removed two days later as
    > a symptom-silencer once item 25's real split landed. Same reasoning applies here.
    > **What shipped.** Content is now split on both axes — track (item 25) × language — into ten
    > files, `lessonContent.<track>.<lang>.js`. Fields are plain strings; the language is the file.
    > `LessonReader.jsx` dynamically imports exactly one of the ten, keyed `"<track>:<lang>"` as a flat
    > map of literal specifiers, because Vite can only split a dynamic import it can statically read.
    > **Result: largest content chunk 499.27 kB → 116.84 kB** (money.ja; the English reader loads
    > 102 kB). Ten chunks, none within 380 kB of the threshold. The threshold is no longer reachable
    > by adding lessons — it would take roughly quadrupling the catalog *in one language*.
    > **`lessonContent.js` survives as a node-only merged view**, reassembling the language-map shape
    > for the two consumers that genuinely need every language at once: `check-data.mjs`'s parity
    > checks and `translation-review.mjs`'s coverage hashes. Nothing in the browser bundle imports it.
    > It builds ids and section counts from the **union** across languages, not from English as a
    > spine — taking English as the spine would hide the opposite failure, a lesson or section present
    > in a translation but missing from English, by never looking at it.
    > **Proven equivalent before anything was deleted**, which is the part that made this safe to do
    > mechanically: the reassembled merged view is **`JSON.stringify`-identical** to the pre-split
    > content across all 40 lessons, and **all 40 English source hashes are unchanged** — that second
    > one matters because a moved hash would have marked every one of the 160 lesson/language pairs
    > stale and silently destroyed the translation ledger's state.
    > **One real behavior change, not a pure refactor:** switching language in the picker now
    > triggers a fetch while reading a lesson, where before it was a pure re-render — the text lives
    > in a different file now, so `lang` joined the loader effect's dependencies. Verified live: the
    > swap is imperceptible on localhost and each language's chunk arrives on first use. On a slow
    > connection it is a brief content flash; if that ever reads badly, the fix is to keep the
    > previous language's text on screen until the new module resolves, not to undo the split.
    > **Not done, deliberately:** splitting `quizData.js` (140.88 kB, the largest remaining chunk that
    > carries five languages) the same way. It is well under the threshold and nothing forced the
    > question today — but the same 80%-waste argument applies to it, and a future run looking for a
    > payload win should measure it before inventing something new.


48. **[Perf — ✅ DONE 2026-08-17 (owner-requested). Quiz text split per language, the same second
    axis item 45 applied to lesson bodies. The 140.88 kB shared quiz chunk is gone.]**
    > **Why.** `quizData.js` held all 42 questions in all five languages in one array — 128 kB of
    > text, of which any one reader can read ~25 kB (en 25, es 25, ko 28, zh 21, ja 30) — and it was
    > **statically** imported by both `Practice.jsx` and `LessonReader.jsx`, so it landed in a shared
    > 140.88 kB chunk every reader downloaded. Same waste item 45 removed from lesson bodies. Nothing
    > forced it (it was well under the threshold); item 45's closing note flagged it and this is that.
    > **The shape of the split is dictated by one constraint.** `src/lib/review.js` keys every
    > learner's Leitner state by a question's **index** in the array, and that state is persisted in
    > `localStorage`. Reordering would silently re-point real review histories at different questions.
    > So the split is index-preserving by construction: `quizMeta.js` holds the two
    > language-independent fields (`lesson`, `answer`) once, in order; `quizText.<lang>.js` holds
    > `{q, opts, explain}` at matching indices. **The answer key lives once, not five times** — five
    > copies of a correctness-critical key is precisely the drift this project keeps paying for.
    > **Scheduling never depends on what finished downloading.** `dueQuestions` and
    > `questionsForLesson` read only indices and `lesson`, both in meta, so the queue is computed
    > synchronously from meta and the words are merged in by index at render.
    > **Result:** the 140.88 kB shared chunk is gone; the largest quiz chunk is **31.81 kB** (ja) and a
    > reader fetches exactly one. Opening a lesson now pulls two files — its track/language body and
    > its language's quiz text — where it used to pull one 480 kB body plus a 140 kB quiz blob.
    > **Verified live, and the verification found two real bugs the tests could not see:**
    > 1. **A mid-session language switch kept the old language's question.** `Practice` merged text
    >    into `session` state at start, freezing the words while the chrome around them translated.
    >    Fixed by storing meta-only in `session` and merging text at render — the class of bug, not
    >    the instance. The same mistake had also left the results recap reading `question.q[lang]` on
    >    what was now a plain string, i.e. blank.
    > 2. **Then the fix crashed the screen.** Blanking `quizText` during the swap left
    >    `question.opts` undefined for one render, and a live session renders from it every frame:
    >    `TypeError: Cannot read properties of undefined (reading 'map')`, blank page. Fixed by not
    >    blanking it — the previous language stays on screen until the new module resolves, which
    >    removes the window and a content flash together.
    > Re-verified after: no console errors, question and options render in Japanese mid-session,
    > index 0 still maps to lesson 29's "What drives the economy?" with its options in order, grading
    > still matches the answer key, and a seeded Leitner entry advanced box 1→2 with the right due
    > date while the untouched entry stayed put.
    > **Proven equivalent before deleting anything:** the merged node-only view is
    > `JSON.stringify`-identical to the pre-split `quizData`, and the `answer` and `lesson` keys match
    > index-for-index across all 42 questions.
    > **Note for whoever adds a question next:** append to `quizMeta.js` **and** all five
    > `quizText.<lang>.js` at the same index. `check-data.mjs`'s parity checks fail on a half-added
    > question, and the merged view takes its length from the longest input specifically so a question
    > added to one language but not to meta surfaces rather than being dropped off the end.


50. **[Process — ✅ DONE 2026-08-17 (owner-requested). `scripts/check-payload.mjs`, wired into
    `npm test`. Closes the first concern the 2026-08-16 review's §6.6 raised.]** Assert the payload
    property that items 45 and 48 produced.
    > **The gap.** Those two splits took the largest content chunk from 499.27 kB to 116.84 kB and
    > deleted a 140.88 kB shared quiz chunk — and **nothing asserted any of it.** It was verified by a
    > human opening the app and reading the network panel. A single
    > `import { quizData } from "../content/quizData.js"` added to a screen — the most natural line in
    > the world to write — silently restores all five languages to that screen's chunk, and **every
    > existing check stays green, because the data is still correct. Only the bytes change.** That is
    > the same shape as every other failure this week: a fact nobody checks is a fact that rots.
    > **What it asserts, and why structure rather than bytes.** Byte assertions need `vite build`
    > (which `npm test` does not run) and would need rewriting every time a lesson is edited. The
    > structure that *produces* the payload is stable, and each failure mode is a specific nameable
    > line of code. Four rules:
    > 1. Every per-language module the split promises exists — 15 of them, derived from `lessons.js`'s
    >    `TRACKS` × `LANGS`, so adding a track or a language without its content files fails here
    >    rather than at a reader's first tap.
    > 2. **No module under `src/` imports a merged view** (`lessonContent.js`, `quizData.js`),
    >    statically or dynamically. This is the load-bearing rule: those views exist for
    >    `check-data.mjs` and `translation-review.mjs`, they statically import every language, and any
    >    path from the bundle into one drags the whole catalog back.
    > 3. Per-language modules are imported **only** dynamically from `src/` — a static import hoists
    >    that language into the importing chunk, which is rule 2's failure one language at a time.
    > 4. Every per-language module is named by some dynamic `import()` — the inverse. A module no
    >    loader map reaches is unreachable, and `LOADERS[key]()` on a missing key is a `TypeError` at
    >    runtime, for one language only, which is precisely the gap nobody notices until a reader
    >    switches to it.
    > **All four proven by injection, each restored after:** adding `import { quizData }` to
    > `Practice.jsx` (rule 2), a static `quizText.ko.js` import (rule 3), deleting the `"money:ja"`
    > loader entry (rule 4), and moving `quizText.zh.js` aside (rule 1). Each failed with the specific
    > file named; the tree was clean and green after every one.
    > **Deliberately not checked:** chunk sizes, module counts, anything needing a build. If those are
    > ever wanted they belong in a separate build-time check — this one has to stay fast enough to run
    > on every commit.
    > **Why a fifth script rather than a section in `check-data.mjs`:** contention. Three separate
    > edits to `check-data.mjs` collided with concurrent dev-agent runs on 2026-08-16/17, twice
    > forcing a commit to be reconstructed. A standalone file with its own name has no such conflict,
    > and matches the existing sibling pattern (blindspot, claims, backlog).


**HELD — owner decisions, do not act on these**

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
