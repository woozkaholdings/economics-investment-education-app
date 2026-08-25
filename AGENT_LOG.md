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

103. **[A11y — filed 2026-08-25 by the run that shipped item 102, as the keyboard half of the same
    fix. Small.] There is no skip link, and until item 102 there was nothing for one to point at.**
    `grep -rn "skip to" src/ index.html` returns **0**. A screen-reader user can now jump to the `main`
    landmark via the rotor, but a **sighted keyboard user** still tabs through the header — the app
    title, then the 5-option language `<select>` — on every screen, including each of the 40 lessons.
    - **Now cheap, and it was not before**: `<main>` is a real landmark again, so the link has a target.
      Needs one new locale key in five languages (the visible link text) and the usual
      visually-hidden-until-focused styling; `theme.js` already owns the focus-ring tokens.
    - **Check `MIN_TAP` and the focus ring** when it becomes visible, per §34.

104. **[Bug/Content — filed 2026-08-25 by the run that shipped item 102, measured during the same
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

105. **[Process/Tooling — filed 2026-08-25 by the run that shipped item 102, from how that defect was
    found.] Nothing in `npm test` can see the rendered accessibility tree, and item 102 was invisible
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
    - **One finding it returned that is NOT yet an item**, because it is arguable and needs a judgment:
      the lesson reader's heading order runs `H1 → H3 → H2 → H2 → H3`, the `H3` being the "BEFORE YOU
      READ" pre-quiz that sits above the first body `H2`. A skipped level is a WCAG 1.3.1 concern; it
      may also be the correct reading of a pre-quiz as subordinate to the lesson title. Measure the
      other 39 lessons before deciding anything.

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

## Run log

> **Entries before 2026-08-23 live in [`AGENT_LOG.archive.md`](AGENT_LOG.archive.md)** — moved there
> in three passes (2026-08-01→08-08 and 2026-08-09→08-15 on 2026-08-16/17; 2026-08-16→08-22 on
> 2026-08-23), verbatim and complete. Between them they cover every run up to the 2026-08-23 weekly
> review: the initial scaffold and rebuild, the JSX split, the market-data pipeline, lessons 18–40,
> the §4.3 minutes clause reaching 120/120, the per-track content split and the lesson-id
> renumbering, the routing/deep-link work, the claims register, and the `es`/`ko`/`zh` economy
> translation tranches. **You do not need to read any of it to pick up work** — for those periods
> `reviews/2026-08-16-weekly-review.md` and `reviews/2026-08-23-weekly-review.md` are both shorter
> and better organized than the entries they summarize.
>
> The entries below start at the 2026-08-23 weekly-review boundary, i.e. the current review period.
> When archiving again, follow the rule at the top of the archive file — and note that the trigger
> now lives in the backlog's W-5.3 (600 KB), so a dev-agent run may legitimately do this, not only
> the weekly reviewer.

### 2026-08-23 (scheduled dev-agent) — `ko` economy 39-40: the Korean economy track closes, and the prediction breaks on its last check

**Picked:** item 93's sixth and final Korean tranche — the one the previous run queued. Owner tree
`OWNER-TREE c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2 (0 tracked modified,
52 untracked)` — **UNMOVED** across all six `ko` runs. `HEAD` still `3d7d900`.

#### Step 3.5 — premise confirmed to the character, and one characterization corrected

`ko` 39 = **0.1396**, 40 = **0.1357** at `HEAD`. **Control first**: 37 and 38 re-measured at
**0.5378 / 0.5069**, matching the previous run's recorded figures. Characters-to-add
**1,430 + 948 = 2,378** against 5,759 English — the previous run's projection, matched exactly, not
approximately.

**One premise correction.** The item describes lesson 39 §1 as "a six-gauge dashboard". The English
has **five** gauges (GDP, CPI, PMI, VIX, credit spreads) under a one-paragraph intro — six
*paragraphs*, not six gauges. Corrected in the item itself so the `zh`/`ja` runs do not go hunting a
sixth.

**Read both.** Lesson 39 §1 was **47 Korean characters against 1,509 English** — one line listing the
five acronyms, the exact shape the item predicted from the `es` work. §2 was a single condensed
paragraph that had lost the per-phase gauge readings, the leading-indicator lag and its reason
(GDP measures activity that already happened), and the closing point about reading the cycle rather
than reacting to it. Lesson 40 §1 was **the three bare rule headings this whole item was filed on** —
the Korean twin of the Spanish `REGLA 1:` stub, with the indebted family, the factory worker, the
farmer's tractor and the policy-maker closing all absent; §2 was one sentence against two paragraphs,
missing the 75-100 year and 5-8 year cycle lengths and the entire "not random noise" paragraph.

#### What shipped

- **`src/content/lessonContent.economy.ko.js`** — lessons **39 and 40** rewritten from summary to
  full translation. Section counts (2 and 2) and headings unchanged. **Seven of ten fields changed;
  lesson 39's `thinkAbout` was already a faithful full translation and the patch left it
  byte-identical** rather than rewriting it for the sake of it. Exactly 7 lines of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`39.ko` 0.14 -> 0.58,
  `40.ko` 0.14 -> 0.55).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `ko 61,871 (0.451x)` -> `ko 64,327 (0.469x)`.

#### Verification

- `npm test` **PASS, exit 0, 0 failures**, 2 pre-existing warnings. `npm run build` clean in 1.03s.
  `npm run check-blindspot` **0 failures**.
- **§33 run before re-recording failed on exactly two lines**, 39 [ko] and 40 [ko], no others.
- **Paragraph-count parity: 39 en 6,6 / ko 6,6 and 40 en 4,2 / ko 4,2** — exact. They had been
  1,1 and 1,1.
- **Figures matched by containment with zero extras, both directions**, and with both controls
  firing: 39 `[2, 50, 15, 40, 4]` and 40 `[1, 2, 3, 75, 100, 5, 8]` identical in en and ko. A
  known-absent probe (`999`) reported missing and a known-present one (`50`) reported present, so a
  silent pass was ruled out. **Unlike lesson 37, no value-based parse was needed** — 39 and 40 carry
  no currency magnitudes, only percentages, index levels and year counts, which Korean writes in
  Arabic numerals.
- **Cross-reference parity, 1:1 and in order.** 39: en `“The 4 Phases of Economic Cycles”` ->
  `「경제 순환의 4단계」`. 40: all seven, in the English's order — `「장기 부채 순환」`,
  `「생산성 성장」` x2, `「장기 부채 순환」`, `「단기 부채 순환」`, `「거래」`, `「신용」`. Each
  resolves to a real `ko` lesson title head (L33, L31, L32, L29, L30). The Korean had **none** of
  them before. §16b (no numeric `Lesson N`) is respected — and the §2 phrase I first drafted as
  "한 강씩" was rewritten to avoid `강`, which is `check-data.mjs` §16's Korean surface form for a
  lesson number; it would not have matched (the pattern needs a preceding digit), but writing prose
  that sits one character away from a guard's pattern is how the ja `課`/`講` miss happened.
- **Hedge parity, 3-for-3 and 1-for-1.** Lesson 39's English hedges three times (`tends to move`,
  `tend to point`, `tend to show up`); the Korean carries all three, **two as `경향이 있` and one as
  `대개`**. Counting only `경향이 있` would have reported 2-vs-3 and invited a "fix" to correct
  prose — the same instrument trap the 37/38 run hit from the other direction, so the count was read
  against the surrounding text rather than trusted. Lesson 40: en `probably` x1, ko `가능성이 큰지`
  x1. Both hedge regexes were controlled against a known-positive and a known-negative string.
- **§10.1 — five Korean patterns over 3,262 characters of Korean, all clean, with five controls, all
  firing.** §10.2 `/dalio/i` checked directly: clean. §2.3: **zero 4-digit years** in either lesson,
  in any field. §10.3: no surface. Lesson 39's VIX paragraph is the one place advice adjacency was a
  live risk — English says some contrarian investors look to buy when the VIX spikes — and the
  Korean renders it as a description of what those investors do (`매수 시점으로 삼기도 합니다`),
  never as an instruction; it does not trip `(사야|팔아야|투자해야)\s?합니다`.
  Lesson 40 §1's "This is simple advice" is translated as `단순한 조언` — it is advice about not
  letting debt outgrow income, i.e. the lesson's own subject, not investment guidance, and it mirrors
  English rather than adding anything.
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8851`, language switched
  through the app's own `<select>` with a real `change` event, disclaimer dismissed, all 40 lessons
  marked complete because **a URL does not unlock a lesson** — the first read returned a Learn-tab
  fallback at 0/40 progress and that was the app behaving as documented, not a failure). Both lessons
  render in full: **39 en 4,064 / ko 2,335 characters, 40 ko 1,623**, every named paragraph present,
  all four of 39's figures on screen, all seven of 40's cross-references rendering in order.
  **Each reading asserted single-language**: with the language-picker options stripped, lesson 39's
  only Latin word of 4+ characters is `NBER` (an acronym the English carries too) and lesson 40 has
  none. **English re-checked as a control** — switched back through the same `<select>`, lesson 39's
  English body is unchanged and intact. Console clean, `localStorage` cleared, server stopped.
  *(Tooling note, matching the 2026-08-18 ninth run: `read_page` returns an empty 0x0 tree against
  this app; `javascript_tool` and `screenshot` both work. Not a regression in the app.)*

#### The prediction held on the half that matters and broke on the other

Recorded prediction: headline **-2 exactly, no collateral crossing, reference staying 0.5510**.

- **Headline: 74 -> 72, exactly 2, nothing else crossed.** Five for five across ten lessons.
- **Reference: FALSIFIED.** It moved **0.5510 -> 0.5523**, threshold **0.3857 -> 0.3866**, lesson 16's
  margin **0.0688 -> 0.0679**. The model assumed every converted lesson lands *at* the p90; lesson 39
  landed at **0.5773**, above the element the p90 index pointed at, and displaced it. The `es`
  rising-reference effect was never absent from `ko` — it was dormant while new lessons landed inside
  the money track's existing band. Written into item 93 so `zh`/`ja` predict the headline, not the
  reference.

`ko` volume **0.451x -> 0.469x** of English. Tranche cost **2,456 added Korean characters against
5,759 English = 0.4265/char**, above the 0.371 that had held across five runs — because of lesson
39's 0.5773, not because the rate drifted. **Whole `ko` economy track: 15,435 added characters
against 40,764 English = 0.379/char.**

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: §10.1 five patterns with five
  firing controls plus the hedge parity, §10.2 `/dalio/i` run directly on the new text, §2.3 a
  year-scan returning empty, §10.3 no surface. The VIX and `조언` sentences are the two that needed a
  judgment call and both mirror English without adding a directive.
- **`DECISIONS.md` conflict** — none. Content stays in `.js` modules, no state or build change, and
  the machine-translation entry explicitly accepts AI translation under "(Beta)" labeling.
- **Already-done backlog item** — no. Sixth and final `ko` tranche; the previous five are recorded
  and this one does not touch them (37/38 re-measured identical, which is also the control).
- **Own verification claim** — reproducible; every figure above came from a command re-run this run,
  not carried forward. **One claim I nearly made was wrong**: lesson 39's 0.5773 sits above the
  0.51-0.55 band the previous ten established, and the honest first reading of that is padding. I
  checked it — paragraph counts exact, no extra figures, excess concentrated in §2's four phase
  paragraphs where English uses bare participial fragments Korean cannot render without particles and
  endings — and recorded the widened band rather than trimming correct prose to make the metric look
  tidy. **One thing I did NOT do:** the translation-review ledger is untouched for the twelfth run
  running — it fingerprints the **English** body. **No fluent Korean reviewer has read any of these
  twelve lessons.** Lesson 40 is the app's closing lesson and the one a learner is most likely to
  quote back; its register is unverified by anyone who speaks the language.

#### Next run

**Item 93 has no `ko` or `es` economy work left.** What remains is **`zh` and `ja`, 24 abridged
pairs each**, and **`es`/`ko` `essentials` (1-11 and 14), 12 each**. The natural next pick is
**`zh` economy 29-30**, but **its cost is unmeasured and must not inherit the `ko` rate** — `zh` runs
at a 0.35 reference against `ko`'s 0.55, and `zh` 29-40 currently sit at 0.08-0.12, i.e. thinner than
`ko` ever was. Measure characters-to-add before scoping the tranche, and **predict only the headline
move**, per the falsification above. Note also that `zh` and `ja` contain **no `$` figures at all**
in the economy track — the numbers were dropped with the rest of the abridged content, so they must
be *added*, not preserved, and lesson 37's QE table is where that will bite.
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (owner-directed) — `zh` economy 29-30: the third language starts, and the item's track boundaries were wrong

**Picked:** the owner asked for "zh economy 29-30 next" — item 93's first Chinese tranche. Owner tree
`OWNER-TREE c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2 (0 tracked modified,
52 untracked)` at the start of the run — **UNMOVED**. `HEAD` `b93b97b`.
**⚠️ It did not stay unmoved — see "A concurrent editor" at the end. Nothing was committed from it.**

#### Step 3.5 — numbers confirmed, and the item's track boundaries falsified

`zh` 29 = **0.0966**, 30 = **0.1203** at `HEAD`; `zh` reference **0.3490**, threshold **0.2443**, 24
abridged. The item's "`zh` runs at a 0.35 reference" and "`zh` 29-40 sit at 0.08-0.12" both reproduce
exactly (measured range **0.0784-0.1203**).

**The control did the work this run.** Measuring the "already-complete money track 12-28" as the
band to aim for returned **min 0.2439** — *below* the 0.2443 threshold, i.e. a supposedly-complete
lesson reading as abridged. That is the shape of a broken instrument, so I checked the track field
instead of the id range: **the real tracks are `essentials` 1-15, `money` 16-28, `economy` 29-40.**
The 0.2439 was lesson 14, which is `essentials` and legitimately abridged. **Item 93 said "money
12-28" in four places while also listing "essentials 1-11 and 14"** — the two statements contradict
each other and had for two days. Nothing measured was wrong; every ratio and count in the item
stands. All four occurrences are corrected, with a note so the `essentials` remainder is not scoped
off a 17-lesson track that does not exist.

**A second control was mis-specified and caught.** My cross-reference control asserted lesson 37's
`zh` carries `《QE与QT》`; it returned empty. The regex was fine — **`《QE与QT》` is in lesson 32** —
and re-running the control there fired. Had I trusted the empty result as "the instrument works, the
content is clean", every negative cross-reference result this run would have been worthless.

**Read both.** Lesson 29 §1 was **84 Chinese characters against 1,120 English** — three bare
assertions, with the coffee purchase, the credit-card tap, the barista's employer and the
$500/100-loaves price arithmetic all absent. §2 had lost the wheat/stock market examples and
compressed the two government roles to six words each. **Lesson 30 §1 was not an abridgement at
all** — the English is the $20,000-car worked example; the Chinese was "lenders want money to make
more money / borrowers want to buy what they can't afford now". **That is the same substitution item
93 already recorded for `ko` 30**, in the same lesson, in a second language.

#### What shipped

- **`src/content/lessonContent.economy.zh.js`** — lessons **29 and 30** rewritten from summary to
  full translation. Section counts (2 and 3) and headings unchanged. **Nine of nine body/takeaway/
  thinkAbout fields changed**; exactly 9 lines of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`29.zh` 0.10 -> 0.32,
  `30.zh` 0.12 -> 0.34).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `zh 30,993 (0.226x)` -> `zh 32,163 (0.234x)`.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings. `npm run build` clean in 1.05s.
  `npm run check-blindspot` **0 failures**.
- **§33 run before re-recording failed on exactly two lines**, 29 [zh] and 30 [zh], no others.
- **Paragraph-count parity exact on all five sections: 29 en 3,3 / zh 3,3 and 30 en 3,3,3 / zh
  3,3,3.** They had been 3,2 and 3,2,2 — so this run added paragraphs the Chinese had dropped
  entirely, not just text inside existing ones.
- **Figures matched by containment with zero extras, both directions, with both controls firing:**
  29 `[500, 100, 5]` and 30 `[20000, 5000, 15000, 8, 10000]` identical in en and zh after
  comma-stripping. **No value-based parse was needed** (unlike `ko` 37): Chinese writes these as
  `20,000美元`, digits unchanged, so token containment is meaningful here.
- **Cross-reference parity 1:1** — 30 §1's `“Interest Rates”` -> `《利率》`, resolving to lesson 35's
  `zh` title head. Lesson 29 has none in English and none in Chinese. **List markers preserved: en 2
  bullets / zh 2** in lesson 29 §2 (§20's check).
- **§10.1 — five Chinese patterns over 1,765 Chinese characters, all clean, with five controls, all
  firing.** §10.2 `/dalio/i` run directly: clean. §2.3: **zero 4-digit years**. §10.3: no surface.
  Nothing in either lesson is advice-adjacent by construction — they teach what a transaction and a
  credit contract *are*, with no asset claims at all, which makes this the lowest-risk pair in the
  track on that axis.
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8852`, language switched
  through the app's own `<select>` with a real `change` event, disclaimer dismissed, progress seeded
  before the reload because **a URL does not unlock a lesson**). Both render in full: **29 zh 1,044
  characters, 30 zh 1,268**, every named paragraph present, both bullets, `《利率》`, and all eight
  figures on screen. **Each reading asserted single-language: zero Latin words of 4+ characters in
  either lesson** once the language-picker options are stripped. **English re-checked as a control**
  — lesson 30's English body unchanged and intact at 3,654 characters. Console clean, `localStorage`
  cleared, server stopped.

#### The projection held on all four figures, and it is the case `ko` 39 predicted

Reference **0.3490 before and after**, threshold **0.2443**, headline **72 -> 70**, lesson 16's
margin **0.0409** unchanged. The previous run falsified the "reference stays put" half of this model
when `ko` 39 landed *above* the p90 and displaced it; `zh` 29 and 30 landed *below* it, which is the
condition under which the reference is still. The rule now recorded in item 93 is: **predict the
headline always, the reference only when the new ratios will land at or under the current p90.**

Cost: **1,170 added Chinese characters against 5,311 English = 0.220/char** — against `ko`'s 0.379
and `es`'s 0.85. **`zh` did not inherit the `ko` rate**, exactly as the item warned.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: §10.1 five patterns with five
  firing controls, §10.2 run directly on the new text, §2.3 a year-scan returning empty, §10.3 no
  surface. No asset or allocation language exists in either lesson to get wrong.
- **`DECISIONS.md` conflict** — none from my change. Content stays in `.js` modules, no state or
  build change, and the machine-translation entry accepts AI translation under "(Beta)" labeling.
  *(`DECISIONS.md` is modified in the working tree by someone else — see below — but not by me.)*
- **Already-done backlog item** — no. First `zh` tranche; `es` and `ko` economy are closed and
  untouched, and their ratios re-measured identical this run.
- **Own verification claim** — reproducible. **The claim I nearly made wrongly was the control
  itself**: an empty cross-reference result on lesson 37 looked like a clean instrument reporting
  clean content, and it was neither — the reference lives in lesson 32. I also nearly filed lesson
  22's two `《》` spans as stray cross-references; they are article headlines inside its
  confirmation-bias story and match the English. Both are written into item 93. **One thing I did
  NOT do:** the translation-review ledger is untouched — it fingerprints the **English** body.
  **No fluent Chinese reviewer has read either lesson.**

#### A concurrent editor is active in the working tree — nothing of it was committed

Partway through this run, `DECISIONS.md` and `LAUNCH_PLAN.md` became modified without my touching
them. `HEAD` did not move. The changes are **US-English spelling normalizations** —
`judgment`->`judgment`, `catalog`->`catalog`, `theater`->`theater`, `color`->`color`, 2 lines
each. Per the hard rules I **did not stage, revert or otherwise touch either file**, and this run's
commit contains only its own four. Two things for whoever owns that sweep:
**(a)** one of the four edits rewrites a word **inside a dated verification note in `DECISIONS.md`**
whose own text says *"Deliberately not corrected: rewriting a dated verification falsifies it"* —
the house rule as recorded is that quotations and dated records stay verbatim, so that one may want
reverting. **(b)** the sweep did **not** touch `AGENT_LOG.md`, so there was no conflict with this
entry.

#### Next run

**Item 93: `zh` economy 31-32**, a projected **~1,370 added Chinese characters** (6,222 English at
the measured 0.220/char), headline expected **70 -> 68**, and **the reference should stay 0.3490**
provided both land under it — target the 0.29-0.36 band, not `ko`'s. Lesson 32 carries **two**
English cross-references (`“Credit”`, `“QE & QT”`) and the `zh` currently has only `《QE与QT》`, so
`《信贷》` needs adding. After that, 33-40 in four more tranches; **34 and 36 are the heavy ones.**
**`ja` remains entirely unmeasured on the added-character basis, and `ja` 30 should be checked for
the same lender/borrower substitution `ko` and `zh` both had.**
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (scheduled dev-agent) — `zh` economy 31-32, and the run where the *translator* nearly moved the reference

**Picked:** the previous run's queued item — item 93's second Chinese tranche. Owner tree
`OWNER-TREE aa5eba4e446801d284251bb4a963cd54447ab401fa5d9d5618cd7b8098b4565a (2 tracked modified,
52 untracked)` at the start of the run — **MOVED** against the recorded `c2331799…`, and per the
⚠️ note in the Environment section I checked *which* files before concluding anything: the two are
`DECISIONS.md` and `LAUNCH_PLAN.md`, still carrying the **US-English spelling sweep** the previous
run documented and did not touch. Not the owner's redesign, not `market.json`. Untouched again here;
this run's commit contains only its own three files. `HEAD` `ba26324`.

#### Step 3.5 — every number in the item reproduced, and the controls did fire

| Claim in item 93 | Re-measured | Verdict |
|---|---|---|
| `zh` reference 0.3490, threshold 0.2443 | 0.3490 / 0.2443 | holds |
| `zh` 31 and 32 sit at 0.08-0.12 | **0.0843** and **0.1056** | holds |
| headline 70, `zh` abridged 22 | 70, 22 | holds |
| projected English side 6,222 chars | 2,445 + 3,777 = **6,222** | holds |
| lesson 32 has two English cross-references, `zh` has only one | en `“Credit”`, `“QE & QT”`; zh `《QE与QT》` alone | holds |
| tracks are `essentials` 1-15, `money` 16-28, `economy` 29-40 | read off `lessons.js`'s `track` field | holds |

**Eight controls, all fired** before any negative result was believed: the `zh` money-track band
re-derived to **min 0.2853 / median 0.3460 / max 0.3568**, matching the item's recorded figures to
four decimals (the instrument agrees with an independently written number); `《》` found in zh 32 and
in zh 29's *absence* of one; the number extractor found `15000` in both en and zh 31 after
comma-stripping; year, `/dalio/i` and bullet regexes each fired on an injected probe. **This is the
control the previous run got wrong** — it asserted a cross-reference in the wrong lesson and read the
empty result as clean. Here every scan that returned empty had a sibling that returned a hit.

**Read both lessons before scoping.** `zh` 31 §1 was **61 characters against 968 English** — the
farmer's crop rotation, the factory's machine, the whole productivity-growth definition, all absent;
only the "long run vs short run" contrast survived. §2 had collapsed the two $15,000 borrowers into
`坏的：…好的：…`, losing the vacation, the tractor's income, and the closing "will the borrowed money
pay itself back?" test. `zh` 32 §1 was three assertions where English is the factory-town narrative;
§2 was two arrow chains. **Neither was a content substitution** — unlike `ko`/`zh` 30, both were
faithful-but-skeletal abridgements, so nothing had to be un-said, only said.

#### What shipped

- **`src/content/lessonContent.economy.zh.js`** — lessons **31 and 32** rewritten from summary to
  full translation. Section counts (2 and 3) and headings unchanged. **Nine of nine body/takeaway/
  thinkAbout fields changed**; exactly 9 lines of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`31.zh` 0.08 -> 0.34,
  `32.zh` 0.11 -> 0.33).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `zh 32,163 (0.234x)` -> `zh 33,618 (0.245x)`.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings (review-ledger staleness; the
  completeness warning, now reading **68** pairs). `npm run build` clean in 963ms.
  `npm run check-blindspot` **0 failures**. Node 20.18.1 via `scripts/bootstrap-node.sh`, foreground.
- **§33 run before re-recording failed on exactly two lines**, 31 [zh] and 32 [zh], no others.
- **Paragraph-count parity exact on all five sections: 31 en 3,4 / zh 3,4 and 32 en 3,3,3 / zh
  3,3,3.** They had been 2,2 and 3,2,3 — so this run restored paragraphs the Chinese had dropped
  outright, not just text inside existing ones.
- **Figures matched by containment with zero extras, both directions:** 31 `[15000]` and 32
  `[5, 8, 5, 8, 5, 8]` identical in en and zh after comma-stripping. Token containment is meaningful
  in Chinese here for the same reason as last run — `15,000美元` keeps the digits. **Note English 32
  §3's "rates approach zero" is a word in both languages (`零`), so it is outside the digit scan by
  construction, not missing from it.**
- **Cross-reference parity 1:1, and one was added:** 32 §1's `“Credit”` -> **`《信贷》`** (new this
  run; resolves to lesson 30's `zh` title head 信贷) and §3's `“QE & QT”` -> `《QE与QT》` (lesson 37).
  Lesson 31 has none in English and none in Chinese. **No list markers in either lesson, en or zh**
  (§20's check).
- **§10.1 — five Chinese patterns over 2,073 Chinese characters, all clean, with five controls, all
  firing.** §10.2 `/dalio/i` run directly: clean. §2.3: **zero 4-digit years**. §10.3: no surface.
  The one place advice adjacency was a live risk is 32 §3's account of central banks buying bonds;
  the Chinese renders it as what happened and why (`由于无法再继续降息，央行转而直接购买债券`), a
  description of policy, and states no view about any asset.
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8853`, language switched
  through the app's own `<select>` with a real `change` event, `ecycles_seen_disclaimer` and all 40
  lessons seeded before the reload because **a URL does not unlock a lesson**). Both render in full,
  every named paragraph present, plus `15,000美元`, both `《》` references, and the body's three `5-8`
  spans (the page shows five — the lesson subtitle and a quiz option carry one each). **Page Han-glyph
  counts were 861 and 1,248**, and that figure is a *presence* check, not the parity measure: it
  counts `[一-鿿]` only, so it excludes the punctuation that `translatedChars` counts and includes the
  page chrome that it does not. The parity numbers are the 831/1,229 field totals above.
  **Each reading asserted single-language: zero Latin words of 4+ characters in either lesson** once
  the language-picker options are stripped. **English re-checked as a control** — switched back
  through the same `<select>`, lesson 32 renders its English narrative intact (4,588 characters of
  page text) with `“Credit”` and `“QE & QT”` present. Console clean (`onlyErrors` returned nothing),
  `localStorage` cleared, server stopped and confirmed unreachable.

#### The projection held on all four figures — and this time it was engineered, not observed

Reference **0.3490 before and after**, threshold **0.2443**, headline **70 -> 68**, lesson 16's
margin **0.0409** unchanged. The difference from the previous run is that the target ratio was
**simulated at four candidate values before a word was written**: 0.30, 0.32 and 0.34 all leave the
reference at 0.3490, and **0.36 moves it to 0.3529**. So "predict the reference only when the new
ratios land at or under the p90" is not a thing you observe afterwards — it is a thing you decide by
picking the target, and item 93 now says so.

Cost: **1,455 added Chinese characters against 6,222 English = 0.234/char**, against 29/30's 0.220.
Two-tranche `zh` total **2,625 against 11,533 = 0.228/char**. `zh` volume **0.234x -> 0.245x**.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: §10.1 five patterns with five
  firing controls, §10.2 run directly on the new text, §2.3 a year-scan returning empty next to a
  probe that fires, §10.3 no surface.
- **`DECISIONS.md` conflict** — none from my change. Content stays in `.js` modules, no state or
  build change, and the machine-translation entry accepts AI translation under "(Beta)" labeling.
  *(`DECISIONS.md` is modified in the working tree by the US-English sweep — not by me, not staged.)*
- **Already-done backlog item** — no. Second `zh` tranche; **29 and 30 re-measured identical to the
  values the previous run recorded (0.3227 and 0.3359)**, which is simultaneously the proof that this
  run did not disturb them.
- **Own verification claim** — reproducible; every figure above is a pasted command output from this
  run. **What the check caught, and it is the thing worth carrying forward: the first Chinese draft of
  lesson 31 came in at 0.3599 — above the p90 and above the `zh` band's own maximum.** Recording it
  would have moved the reference and quietly falsified the projection above, and the tempting fix is
  to trim until the number looks right, which is exactly what this log has warned against since the
  `ko` 39 entry. What I did instead: checked it for padding first (paragraph counts exact, figure set
  exact, so it was not padded — English 31 §2 is genuinely terse), then compressed **Chinese function
  words only** across eight spans, and re-verified that paragraph counts and the figure set were
  unchanged. **One of those eight did lose content** — `数百万人和数百万家企业` -> `数百万人和企业`,
  dropping "millions of" from "millions of people and businesses" — and it was caught on re-reading
  the compressions against the English and reverted, at a cost of 4 characters and one extra
  `readiness --write`. The final 0.3399 is a real translation, not a trimmed one. **One thing I did
  NOT do:** the translation-review ledger is untouched — it fingerprints the **English** body.
  **No fluent Chinese reviewer has read either lesson.**

#### Next run

**Item 93: `zh` economy 33-34**, English **3,654 + 4,167 = 7,821 characters**, projected
**~1,800 added Chinese characters** at the two-tranche rate of 0.228/char, headline expected
**68 -> 66**, and **the reference should stay 0.3490 provided both land at or under it** — target the
0.30-0.34 band and simulate before writing, as this run did. **34 is one of the two heavy lessons in
the track** (the other is 36 at 4,546) and it is the deleveraging lesson, so its `zh` should be read
for the same *content substitution* `ko`/`zh` 30 had rather than assumed to be a clean abridgement.
After 33-34, four lessons remain in three tranches. **`ja` is still entirely unmeasured on the
added-character basis, and `ja` 30 has still not been checked for the lender/borrower substitution.**
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (scheduled dev-agent) — `zh` economy 33-34: the Chinese track is half done, and a guard I did not know about caught the one figure that was wrong

**Picked:** the previous run's queued item — item 93's third Chinese tranche. Owner tree
`npm run owner-tree -- --expect aa5eba4e…` read **`UNMOVED aa5eba4e446801d284251bb4a963cd54447ab401fa5d9d5618cd7b8098b4565a (2 tracked modified, 52 untracked)`** — the same two files (`DECISIONS.md`, `LAUNCH_PLAN.md`) still carrying the owner's
US-English spelling sweep, untouched again here. `HEAD` `7d061fe` at the start of the run and
unchanged at commit time. This run's commit contains only its own three files.

#### Step 3.5 — every number reproduced, and the controls fired

| Claim in item 93's queued note | Re-measured | Verdict |
|---|---|---|
| `zh` reference 0.3490, threshold 0.2443 | 0.3490 / 0.2443 | holds |
| English side 3,654 + 4,167 = 7,821 characters | 3,654 + 4,167 = **7,821** | holds |
| `zh` 33 and 34 are the thinnest pair yet | **0.1078** and **0.0941** | holds |
| headline 68, `zh` abridged 20 | 68, 20 | holds |
| lesson 16 nearest un-abridged, margin 0.0409 | 16 at 0.2853, margin **0.0409** | holds |
| 34 is one of the two heavy lessons | 4,167 English, second only to 36's 4,546 | holds |

**Controls, all fired.** `translatedChars` run against a hand-built probe with known field lengths
(expected en 10 / zh 5, got 10 / 5 — the instrument counts what it claims to); the `zh` money-track
band re-derived to **min 0.2853 / median 0.3460 / max 0.3568**, matching item 93's independently
written figures to four decimals; and the `《》`, `第N课`, year and digit extractors each run against
an injected probe string carrying one of every form. Nothing was read as clean on an empty result
that did not have a sibling returning a hit.

**Both lessons read before scoping, and the substitution the item warned about is NOT here.** Item 93
flagged 34 as a deleveraging lesson and told this run to read it for the same *content substitution*
`ko`/`zh` 30 had. It does not have one: `zh` 33 and 34 are both faithful-but-skeletal abridgements —
33 §1 was 2 paragraphs against English's 4 (the neighborhood, the stretched mortgage, the
self-feeding confidence, the manageable-looking debt burden all absent), 34 §1 was **a bare four-line
list** where English gives an intro plus four worked examples (the city government laying off
workers, the bank calling in loans, the tax redistribution, the central bank refilling the well).
Nothing had to be un-said, only said.

#### What shipped

- **`src/content/lessonContent.economy.zh.js`** — lessons **33 and 34** rewritten from summary to
  full translation. Section counts (3 and 3) and headings unchanged. **Nine of ten body/takeaway/
  thinkAbout fields changed; the tenth — 34's `takeaway` — was already a complete translation and was
  deliberately left byte-identical.** Exactly 9 lines of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`33.zh` 0.11 -> 0.33,
  `34.zh` 0.09 -> 0.32).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `zh 33,618 (0.245x)` -> `zh 35,354 (0.258x)`.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings (review-ledger staleness; the
  completeness warning, now reading **66** pairs). `npm run build` clean in 957ms.
  `npm run check-blindspot` **0 failures**. Node 20.18.1 via `scripts/bootstrap-node.sh`, foreground.
- **§33 run before re-recording failed on exactly two lines**, 33 [zh] and 34 [zh], no others.
- **Paragraph-count parity now exact on all six sections: 33 en 4,4,3 / zh 4,4,3 and 34 en 5,4,4 /
  zh 5,4,4.** They had been 2,2,1 and 1,3,1 — so this run restored eight paragraphs the Chinese had
  dropped outright.
- **Figures matched by containment with zero extras, both directions**, after the fix below: 33
  `[2008, 1989, 1929, 0, 5, 8, 75, 100, 1929, 75, 100, 100]` and 34 `[1, 2, 3, 4, 0, 2008, 2015,
  1920, 1930, 1, 2, 1980, 4, 4]` identical in en and zh. *(A separate 4-digit-year scan reports
  1920/1930/1980 for `zh` and not for `en`; that is the instrument, not the content — `\b(19|20)\d{2}\b`
  finds no word boundary inside English's `1920s`. The digit scan above has no `\b` and is the
  authoritative one.)*
- **Cross-reference parity 1:1, and one was added:** 33 §1's `“The Short-Term Debt Cycle”` ->
  **`《短期债务周期》`** (new this run; resolves to lesson 32's `zh` title). Lesson 34 has none in
  English and none in Chinese. Zero numeric `第N课` references in either.
- **§10.1 — five Chinese advice patterns over 2,537 characters (2,147 Han), all clean, with five
  controls, all firing.** §10.2 `/dalio|达利欧/i` run directly: clean. §2.3: a current-date scan
  (`202[5-9]年\d+月|今年|本月`) clean against a firing control; the historical years 1929/1989/2008/
  2015/1920s/1930s/1980s are all in the English. §10.3: no surface. **The place advice adjacency was
  a live risk is 33 §3's closing paragraph, and it is the one the old Chinese had dropped** — English
  explicitly hedges "This isn't a reason to expect a repeat on any particular timeline — nobody can
  time it". The Chinese now carries that hedge (`没有人能算准时点`) rather than leaving the lesson
  ending on a bubble-warning with no caveat. **The hedge got *more* faithful, not less.**
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8871`, language switched
  through the app's own `<select>` with a real `change` event, `ecycles_seen_disclaimer` and all 40
  lessons seeded before the reload because **a URL does not unlock a lesson**). Lesson 33: **all 15
  named probes present**, 1,245 Han glyphs. Lesson 34: **all 24 named probes present**, 1,326 Han
  glyphs — including the four worked examples, the wheelbarrows of cash, `第1种（紧缩）`,
  `第2种（违约）` and `第四根杠杆`. **Each reading asserted single-language: the only Latin words of
  4+ characters on either page are `English`/`Espa`/`Beta` from the language picker.** **English
  re-checked as a control** — switched back through the same `<select>`, lesson 34 renders its
  English intact (5,126 characters, all 7 English probes present, 5 Han glyphs and all 5 are the
  picker's `中文`). Console clean (`onlyErrors` returned nothing), `localStorage` cleared, server
  stopped and confirmed unreachable.

#### The projection held on all four figures for the third time — but the headroom shrank

Reference **0.3490 before and after**, threshold **0.2443**, headline **68 -> 66**, lesson 16's
margin **0.0409** unchanged. Simulated before writing, as the previous run established: 0.28, 0.30,
0.32 and 0.34 all leave the reference at 0.3490 — but **0.35 now moves it** (to 0.3500), where the
31/32 run measured the boundary at 0.36. **The safe band narrows as the track fills**, because the
lessons this work already converted are themselves now sitting in the top decile. Re-simulate every
tranche; do not reuse the last one's headroom.

Cost: **1,736 added Chinese characters against 7,821 English = 0.222/char**, against 0.220 and 0.234
on the first two tranches. Three-tranche `zh` total **4,361 against 19,354 = 0.225/char**. `zh`
volume **0.245x -> 0.258x**. **Neither draft needed compressing** — both landed in band first time,
which is what happens when the English side is narrative rather than terse.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: §10.1 five patterns with five
  firing controls, §10.2 run directly on the new text, §2.3 a current-date scan returning empty next
  to a probe that fires, §10.3 no surface.
- **`DECISIONS.md` conflict** — none from my change. Content stays in `.js` modules, no state or
  build change, and the machine-translation entry accepts AI translation under "(Beta)" labeling.
  *(`DECISIONS.md` is modified in the working tree by the owner's US-English sweep — not by me, not
  staged.)*
- **Already-done backlog item** — no; third `zh` tranche. **29-32 re-measured identical to the values
  the previous two runs recorded** (0.3227, 0.3359, 0.3399, 0.3254), which is simultaneously the
  proof this run disturbed none of them.
- **Own verification claim** — reproducible; every figure above is a pasted command output.
  **What the check caught, and it is the reusable part: a guard I did not know existed found the one
  figure I had gotten wrong, and my own scan had already flagged it as "an expected artifact."**
  The first draft of 34 §3 wrote `就根本没有第4根杠杆` for English's "doesn't have that fourth lever
  at all". My digit scan reported one extra `4` in `zh` versus `en`, and I talked myself into filing
  it as a rendering convention — the same shape of reasoning this log has warned about since the `ko`
  39 entry. `npm test` then **failed** on it: §16's ordinal-counter guard rejects `第N<counter>` whose
  counter is in neither `LESSON_COUNTERS` nor `NON_LESSON_COUNTERS`, precisely so a construction like
  this cannot be waved through. The guard offered two exits — add `根` to `NON_LESSON_COUNTERS` with
  justification, or change the text. **Changing the text was the better answer and not the easier
  one:** English writes *"fourth"* as a word there and digits for *"tool 1"* / *"tool 2"*, so
  `第四根杠杆` is the more faithful rendering, and it restores exact figure-set parity in both
  directions instead of documenting an exception to it. **The lesson to carry: when a self-scan
  produces an anomaly and an explanation for the anomaly in the same breath, the explanation is the
  part to distrust.** **One thing I did NOT do:** the translation-review ledger is untouched — it
  fingerprints the **English** body. **No fluent Chinese reviewer has read either lesson.**

#### Next run

**Item 93: `zh` economy 35-36**, English **3,928 + 4,546 = 8,474 characters**, projected
**~1,900 added Chinese characters** at the three-tranche rate of 0.225/char, headline expected
**66 -> 64**, and **the reference should stay 0.3490 provided both land at or under it** — target the
0.30-0.33 band and **re-simulate rather than reusing this run's numbers, because the safe ceiling has
already moved from 0.36 to 0.35 in two tranches.** **36 is the heaviest lesson in the track** (4,546
English) and 35's English is arrow-chain terse — the `es` 35/36 and `ko` 39 entries both record that
shape overshooting the band, so expect 35 to need function-word compression and 36 not to. After
35-36, four lessons remain in two tranches. **`ja` is still entirely unmeasured on the added-character
basis, and `ja` 30 has still not been checked for the lender/borrower substitution `ko` 30 and `zh` 30
both had.**
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (scheduled dev-agent) — `zh` economy 35-36: eight of twelve, and the tranche that falsified two of its own queued predictions

**Picked:** the previous run's queued item — item 93's fourth Chinese tranche. Owner tree
`npm run owner-tree -- --expect aa5eba4e…` read **`UNMOVED aa5eba4e446801d284251bb4a963cd54447ab401fa5d9d5618cd7b8098b4565a (2 tracked modified, 52 untracked)`** — the same two files (`DECISIONS.md`,
`LAUNCH_PLAN.md`) still carrying the owner's US-English spelling sweep, untouched again here. `HEAD`
`33fc23b` at the start of the run and unchanged at commit time. This run's commit contains only its
own three files.

#### Step 3.5 — every number reproduced, and the controls fired

| Claim in item 93's queued note | Re-measured | Verdict |
|---|---|---|
| `zh` reference 0.3490, threshold 0.2443 | 0.3490 / 0.2443 | holds |
| English side 3,928 + 4,546 = 8,474 characters | 3,928 + 4,546 = **8,474** | holds |
| `zh` 35 and 36 are at 0.11 / 0.12 | **0.1072** and **0.1190** | holds |
| headline 66, `zh` abridged 18 | 66, 18 | holds |
| lesson 16 nearest un-abridged, margin 0.0409 | 16 at 0.2853, margin **0.0409** | holds |
| 36 is the heaviest lesson in the track | 4,546 English, ahead of 34's 4,167 | holds |
| tracks are `essentials` 1-15, `money` 16-28, `economy` 29-40 | read off `lessons.js`'s `track` field | holds |

**Controls, all fired.** `translatedChars` run against a hand-built probe with known field lengths
(expected en 10 / zh 5, got 10 / 5); the `zh` money-track band re-derived to **min 0.2853 / median
0.3460 / max 0.3568**, matching item 93's independently written figures to four decimals; and an
injected probe string carrying one of every hunted form (`第3课`, `《测试课》`, `1966年`, `12-18个月`,
`•`, `dalio`/`达利欧`, `2026年8月`) fired all seven extractors before any of them was allowed to return
a clean empty result. The digit-multiset comparator was validated on a deliberately mismatched pair
(`5,7` vs `5,8`) and reported the difference.

**Both lessons read before scoping, and both are faithful-but-skeletal abridgements** — no content
substitution of the `ko`/`zh` 30 kind. `zh` 35 §2 was two arrow lines and a proverb (65 characters
against 1,176 English), dropping the young tech company's cost of capital, the utility-company
contrast, the bond-price mechanism, the family's mortgage payment, the money-market yield and the
dollar entirely; §3 was one paragraph against three, with 2021-2023 and the whole "two goals that
pull apart" argument absent. `zh` 36 §1 was **two paragraphs against five** — the friend-lending
analogy, FLAT and STEEP all missing outright, and the INVERTED paragraph reduced to "危险！" plus the
1955 fact; §3 was one paragraph against four, with the New York Fed estimate and the
"estimated from a model, and different models disagree" caveat gone. Nothing had to be un-said.

#### What shipped

- **`src/content/lessonContent.economy.zh.js`** — lessons **35 and 36** rewritten from summary to
  full translation. Section counts (3 and 3) and headings unchanged. **Nine of ten body/takeaway/
  thinkAbout fields changed; the tenth — 35's `thinkAbout` — was already a complete translation of
  the English and was deliberately left byte-identical.** Exactly 9 lines of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`35.zh` 0.11 -> 0.33,
  `36.zh` 0.12 -> 0.34).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `zh 35,354 (0.258x)` -> `zh 37,225 (0.271x)`.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings (review-ledger staleness; the
  completeness warning, now reading **64** pairs). `npm run build` clean in 1.09s.
  `npm run check-blindspot` **0 failures**. Node 20.18.1 via `scripts/bootstrap-node.sh`, foreground.
- **§33 run before re-recording failed on exactly two lines**, 35 [zh] and 36 [zh], no others.
- **Paragraph-count parity now exact on all six sections: 35 en 3,3,3 / zh 3,3,3 and 36 en 5,3,4 /
  zh 5,3,4.** They had been 3,2,1 and 2,1,1 — so this run restored **nine paragraphs** the Chinese
  had dropped outright.
- **Figure sets identical as sorted MULTISETS, not merely by containment** (the weaker test the
  previous three runs used): 35 `[0,12,12,12,2,2021,2022,2023,23,24,24,25,5,5,50,6]` (n=16) and 36
  `[10 ×9, 12 ×3, 18 ×3, 1955, 1966, 1980, 2 ×7, 2022 ×2, 2024, 30]` (n=28) — equal in en and zh
  after comma-stripping, with no extras in either direction. Multiset equality is the stronger claim
  because it catches a repeated figure appearing the wrong number of times, which containment cannot.
- **Cross-reference parity 1:1, and one was added:** 35 §1 gained **`《短期债务周期》`** (lesson 32's
  `zh` title; English's §1 references "The Short-Term Debt Cycle" and the Chinese carried nothing),
  joining the two existing `《解读经济指标》`, so **3 English references and 3 Chinese**. Lesson 36 has
  none in English and none in Chinese. **Zero `第N<counter>` constructions in either lesson**, so
  §16's ordinal-counter guard has nothing to adjudicate this time.
- **§10.1 — five Chinese advice patterns over both lessons, all clean, with five controls, all
  firing.** §10.2 `/dalio|达利欧/i` run directly: clean. §2.3: a current-date scan
  (`202[5-9]年\d+月|今年|本月|本周`) clean against a firing control; every year present
  (1955/1966/1980s/2021-2023/2022/2024) is in the English. §10.3: no surface. **The place advice
  adjacency was a live risk is 36 §1's INVERTED paragraph, and the old Chinese ended it on
  "危险！"** — a bare alarm. The English hedges twice ("not every inversion has been followed by a
  recession, so it's a strong signal, not a certainty"), and the Chinese now carries both hedges
  (`并非每一次倒挂之后都发生了衰退，所以它是一个强烈的信号，而不是确定性`). **The hedge got more
  faithful, not less** — the same direction as the 33/34 run's §3 fix. 35 §2's "Don't fight the Fed"
  paragraph is rendered as what has historically coincided with what, stating no view about any asset.
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8894`, language switched
  through the app's own `<select>` with a real `change` event, `ecycles_seen_disclaimer` and all 40
  lessons seeded **and then reloaded** — the seeding does not take effect until the reload, and a URL
  does not unlock a lesson). Lesson 35: **all 32 named probes present**, 1,509 Han glyphs, all three
  `《》` references rendered. Lesson 36: **all 41 named probes present**, 1,503 Han glyphs, including
  the friend analogy, all four curve shapes, the New York Fed, and 「2s10s」. **Each reading asserted
  single-language: the only Latin words of 4+ characters on either page are `English`/`Espa`/`Beta`
  from the language picker.** **English re-checked as a control** — switched back through the same
  `<select>`, lesson 36 renders its English intact (5,422 characters, all 10 English probes present,
  5 Han glyphs and all 5 are the picker's `中文`/`日本語`). Console clean (`onlyErrors` returned
  nothing), `localStorage` cleared, server stopped and confirmed unreachable.

#### The projection held a fourth time — and two of the queued note's other predictions did not

Reference **0.3490 before and after**, threshold **0.2443**, headline **66 -> 64**, lesson 16's
margin **0.0409** unchanged. Four for four across eight lessons. Simulated before writing, as
established: 0.28/0.30/0.32/0.33/0.34 all leave the reference at 0.3490 and **0.35 moves it** to
0.3500. Both drafts landed inside that at 0.3294 and 0.3385, first time, no compression.

**Two queued predictions were wrong, and both are written back into item 93 rather than left here.**

1. **"The safe band narrows as the track fills" did not narrow.** The boundary is **0.35 again**,
   identical to the 33/34 run's rather than tighter, and the same boundary holds in the simulation
   for 37/38. The p90 steps only when a new lesson displaces the element the index points at; 35/36
   sorted below it, so nothing moved. The instruction (re-simulate every tranche) survives; the
   reason changes from "it always tightens" to "you cannot predict which way it steps".
2. **"Expect 35 to need function-word compression and 36 not to" was backwards.** 35 landed
   *lower* (0.3294 vs 0.3385) and needed nothing. The terse-English rule was being applied to the
   presence of a terse passage rather than to its share of the lesson: 35's arrow chains are two
   lines out of 3,928 English characters, and its §2/§3 are narrative. In `es` 35 the arrow lines
   *were* the section. **Weigh the terse spans against the lesson total.**

Cost: **1,871 added Chinese characters against 8,474 English = 0.221/char**, against 0.220, 0.234 and
0.222 on the first three tranches. Four-tranche `zh` total **6,232 against 27,828 = 0.224/char**.
`zh` volume **0.258x -> 0.271x**.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: §10.1 five patterns with five
  firing controls plus `npm run check-blindspot`'s own per-language pass, §10.2 run directly on the
  new text, §2.3 a current-date scan returning empty next to a probe that fires, §10.3 no surface.
- **`DECISIONS.md` conflict** — none from my change. Content stays in `.js` modules, no state or
  build change, and the machine-translation entry accepts AI translation under "(Beta)" labeling.
  *(`DECISIONS.md` is modified in the working tree by the owner's US-English sweep — not by me, not
  staged.)*
- **Already-done backlog item** — no; fourth `zh` tranche. **29-34 re-measured identical to four
  decimals against the values the previous three runs recorded** (0.3227, 0.3359, 0.3399, 0.3254,
  0.3298, 0.3161), which is simultaneously the proof this run disturbed none of them.
- **Own verification claim** — reproducible; every figure above is a pasted command output.
  **What the check caught, and it is the part worth carrying: the containment-based figure check the
  last three runs used is weaker than those runs' write-ups implied.** `de.filter(x => !dz.includes(x))`
  in both directions reports "zero extras" for `[10, 10]` against `[10]` — a lesson that mentions
  10-year bonds nine times in English and three times in Chinese would pass it clean. Lesson 36 has
  **nine** `10`s and **seven** `2`s, so it is exactly the shape that check cannot see. Re-run as a
  sorted-multiset comparison (with a deliberately-mismatched control to prove the comparator fires),
  both lessons are equal — so **the content was right and the instrument was weak**, which is the
  less alarming of the two outcomes but the one that had to be established rather than assumed.
  Prior runs' figure-parity claims are not retracted: containment is a real check, just a coarser one
  than "identical". **One thing I did NOT do:** the translation-review ledger is untouched — it
  fingerprints the **English** body. **No fluent Chinese reviewer has read either lesson.**

#### Next run

**Item 93: `zh` economy 37-38**, English **3,360 + 3,817 = 7,177 characters**, projected
**~1,600 added Chinese characters** at the four-tranche rate of 0.224/char, headline expected
**64 -> 62**, and **the reference should stay 0.3490** — simulated this run at the *next* tranche's
position and 0.28 through 0.34 all leave it there, with **0.35 the boundary**; still re-simulate
rather than trusting this line. **37 is the QE/QT lesson**, whose `zh` already carries `《QE与QT》`-
adjacent vocabulary from lesson 32's cross-reference, so check its existing stub for terminology that
must stay consistent with 32's; **38 is the four-phases lesson and its English is list-dense** (the
`ko` 38 entry records three `Historically favored in this phase:` lines), which is the shape that
renders compactly — expect 38 low in the band rather than high, and do not read that as thin.
After 37-38, **only 39-40 remain** (5,759 English), one run, and the `zh` economy track is done.
Note item 93's standing warning for 39: its English §1 is a **six-paragraph, five-gauge dashboard**
and both `es` and `ko` shipped a single line of acronyms there. **`ja` is still entirely unmeasured on
the added-character basis, and `ja` 30 has still not been checked for the lender/borrower
substitution `ko` 30 and `zh` 30 both had.**
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (scheduled dev-agent) — `zh` economy 37-38: ten of twelve, and the first tranche that had to sit against the ceiling

**Picked:** the previous run's queued item — item 93's fifth Chinese tranche. Owner tree
`npm run owner-tree -- --expect aa5eba4e…` read **`UNMOVED aa5eba4e446801d284251bb4a963cd54447ab401fa5d9d5618cd7b8098b4565a (2 tracked modified, 52 untracked)`** — the same two files (`DECISIONS.md`,
`LAUNCH_PLAN.md`) still carrying the owner's US-English spelling sweep, untouched again here. `HEAD`
`18ffa15` at the start of the run and unchanged at commit time. This run's commit contains only its
own three files.

#### Step 3.5 — every number reproduced, and the controls fired

| Claim in item 93's queued note | Re-measured | Verdict |
|---|---|---|
| `zh` reference 0.3490, threshold 0.2443 | 0.3490 / 0.2443 | holds |
| English side 3,360 + 3,817 = 7,177 characters | 3,360 + 3,817 = **7,177** | holds |
| `zh` 37 and 38 are at 0.12 / 0.09 | **0.1158** and **0.0872** | holds |
| headline 64, `zh` abridged 16 | 64, 16 | holds |
| lesson 16 nearest un-abridged, margin 0.0409 | 16 at 0.2853, margin **0.0409** | holds |
| 37 is the QE/QT lesson, 38 the four-phases lesson | read off `lessons.js` | holds |
| 38's English is list-dense | two `Historically favored in this phase:` lines | holds |
| the 0.35 boundary still holds for 37/38 | 0.34 safe, **0.35** moves the reference to 0.3500 | holds |

**Controls, all fired.** `translatedChars` run against a hand-built probe with known field lengths
(expected en 15 / zh 6, got 15 / 6); the multiset comparator validated on two deliberately
mismatched pairs — `5,7` vs `5,8` **and** `[10,10]` vs `[10]`, the containment blindspot the previous
run identified — and it reported both as unequal; and an injected probe string carrying one of every
hunted form (`第3课`, `《测试课》`, `1966年`, `12-18个月`, `dalio`/`达利欧`, `2026年8月`/`今年`,
`应该买入`, `最佳投资：`, `我们建议`, `$900B`) fired **all nine** extractors before any of them was
allowed to return a clean empty result.

**Both lessons read before scoping, and both are faithful-but-skeletal abridgements** — no content
substitution of the `ko`/`zh` 30 kind. `zh` 37 §1 was **two paragraphs against five** (67 characters
against 1,164 English), keeping only "when rates hit 0% the central bank prints electronically" and
the balance-sheet figures, and dropping the master-dial framing, the ledger-entries-not-a-printing-press
aside, the Fed-as-enormous-buyer image, the whole price/yield/rotate-into-risk chain, the entire
QE1/QE2/QE3/COVID list and the "nine times the size of the pre-2008 institution" comparison; §2 was
two paragraphs against four, missing the balloon analogy and the drains-money/yields-UP paragraph
outright. `zh` 38 was worse: §3 was **one paragraph against four**, compressing all four phase
mechanisms into one clause each, and §1/§2 dropped the factory-town callback, both `Historically
favored in this phase:` lines, the S&P figures for expansion (+14-28%) and contraction (-22-35%),
and the defensive-asset list (Treasuries, gold, utilities/healthcare, cash). 38's `takeaway` was also
missing its third sentence. Nothing had to be un-said.

#### What shipped

- **`src/content/lessonContent.economy.zh.js`** — lessons **37 and 38** rewritten from summary to
  full translation. Section counts (3 and 3) and headings unchanged. Six of six section bodies
  changed, plus 38's `takeaway`; **37's `takeaway` and `thinkAbout` and 38's `thinkAbout` were
  already complete translations of the English and were deliberately left byte-identical.**
  Exactly 7 lines of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`37.zh` 0.12 -> 0.34,
  `38.zh` 0.09 -> 0.33).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `zh 37,225 (0.271x)` -> `zh 38,902 (0.283x)`.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings (review-ledger staleness; the
  completeness warning, now reading **62** pairs). `npm run build` clean in 983ms.
  `check-blindspot` all `ok`. Node 20.18.1 via `scripts/bootstrap-node.sh`, foreground.
- **§33 run before re-recording failed on exactly two lines**, 37 [zh] and 38 [zh], no others.
- **Paragraph-count parity now exact on all six sections: 37 en 5,4,1 / zh 5,4,1 and 38 en 3,3,4 /
  zh 3,3,4.** They had been 2,2,1 and 2,2,1 — so this run restored **eight paragraphs** the Chinese
  had dropped outright.
- **Figures: lesson 38 is an exact sorted MULTISET** (n=10 either side, zero differences).
  **Lesson 37 is deliberately NOT, and this is the run's one substantive instrument finding.**
  It reports eight differences, and **all eight are long-scale currency conversions**, audited
  pair by pair: `$85B/month`->`每月850亿美元`, `$95 billion a month`->`每月950亿美元`,
  `$600 billion`->`6000亿美元`, `$900 billion`->`约9000亿美元` — each a 10x billion->亿 step —
  with `$1.75 trillion`->`1.75万亿美元` and `$9 trillion`->`9万亿美元` numerically unchanged.
  So the previous run's "multiset equality is the acceptance test" does not survive contact with a
  lesson that has currency in it. **The rule written into item 93 is: run the comparator, then
  account for every difference as a NAMED scale conversion — do not weaken the comparator, and do
  not read a difference as automatic failure.** Checked against the `es` currency defect this item
  already records: the `zh` economy file still contains **zero `$` characters**, and every magnitude
  is written 亿/万亿, so the Spanish `billón` bug has no `zh` analogue here.
- **Cross-reference parity 1:1, and two were added:** 37 §1 gained **`《利率》`** (English's §1 names
  "Interest Rates", lesson 35, and the Chinese carried nothing) and 38 §1 gained
  **`《短期债务周期》`** (lesson 32; English opens "Picture the same factory town from…"), joining
  38 §3's existing `《利率》`. So 1 English reference and 1 Chinese in 37, 2 and 2 in 38.
  **Zero `第N课` constructions in either lesson**, so §16's numeric guard has nothing to adjudicate.
- **The `Historically favored in this phase:` lines were checked against the other languages before
  being written**, not just against §10.1's regex: `es` writes `Históricamente favorecidos en esta
  fase:` and `ko` writes `이 국면에서 역사적으로 선호된 자산:`, so `历史上在这个阶段受到青睐的资产：`
  is the same descriptive shape all four languages use — historical coincidence, not a
  recommendation, and not the `最佳投资：` form the check forbids.
- **§10.1 — five Chinese advice patterns over both lessons, all clean, with five controls, all
  firing.** §10.2 `/dalio|达利欧/i` run directly: clean. §2.3: a current-date scan
  (`202[5-9]年\d*月?|今年|本月|本周`) clean against a firing control; every year present
  (2008/2010/2012/2020/2022/2024) is in the English. §10.3: no surface. The place advice adjacency
  was a live risk is 38's two favored-asset lines and §3's four phase paragraphs, and every one of
  them is rendered as what has historically coincided with what — `历史上，这个阶段与标普500约
  +14-28%的平均回报同时出现` — stating no view about any asset today.
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8897`, language switched
  through the app's own `<select>` with a real `change` event, `ecycles_seen_disclaimer` and all 40
  lessons seeded into **`ecycles_completed_lessons`** and then reloaded). Lesson 37: **all 42 named
  probes present**, 893 Han glyphs, the `《利率》` reference rendered, and the QE1-COVID block
  rendering as four separate lines. Lesson 38: **all 47 named probes present**, 1,045 Han glyphs,
  including the factory town, both favored-asset lines, all four phase mechanisms and the restored
  third takeaway sentence. **Each reading asserted single-language: zero Latin words of 4+ characters
  on either page.** **English re-checked as a control** — switched back through the same `<select>`,
  lesson 38 renders its English intact (4,781 characters, all 14 English probes present, 5 Han glyphs
  and all 5 are the picker's `中文`/`日本語`). Console clean (`onlyErrors` returned nothing),
  `localStorage` cleared, server stopped and confirmed unreachable.

#### The projection held a fifth time — and the ceiling turned out to be a character count

Reference **0.3490 before and after**, threshold **0.2443**, headline **64 -> 62**, lesson 16's
margin **0.0409** unchanged. Five for five across ten lessons.

**The queued note's other two predictions split.** "38's English is list-dense, expect it low in the
band rather than high" was **right** — 38 landed at 0.3267, the second-lowest of the ten. "37 carries
`《QE与QT》`-adjacent vocabulary from lesson 32's cross-reference, check its stub for terminology that
must stay consistent" was **checkable but empty**: 32's `zh` does carry `《QE与QT》`, and 37's own stub
already used 量化宽松/量化紧缩/资产负债表 consistently with it, so there was nothing to reconcile.

**What this tranche adds that the previous four could not, because none of them was tight:**
37's first draft landed at **0.3515** and moved the reference to 0.3503 on its own. The pair
simulation run before writing said 0.34 was safe and 0.35 was not — but a *pair* simulation assumes
both lessons land at the same target. Re-simulating 37 alone against 38's actual 0.3267 put the real
boundary at **1,176 characters** against 3,360 English; the draft was **1,181**, five over.
**The ceiling is a character count, not a ratio, and it belongs to whichever lesson is written
second.** 37 was brought to **0.3429** by 23 function-word compressions worth 29 characters
(`仍然需要`->`仍需`, `创造出`->`创造`, `已经持有的东西`->`已持有的东西`, `从金融体系中抽走`->`从金融体系抽走`),
paragraph counts and figure set identical before and after, no clause dropped.

**And 37 falsifies the converse of the density rule.** 37's English is narrative throughout — no
arrow chains, no aphorisms, a §3 that is one 1,033-character explanatory paragraph — the shape item
93 records as landing comfortably. It overshot anyway. **The rule predicts overshoot from terse
English; it does not predict safety from narrative English.** Both corrections are written into item
93 rather than left here.

Cost: **1,677 added Chinese characters against 7,177 English = 0.234/char**, against 0.220, 0.234,
0.222 and 0.221 on the first four tranches. Five-tranche `zh` total **7,909 against 35,005 =
0.226/char**. `zh` volume **0.271x -> 0.283x**.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: §10.1 five patterns with five
  firing controls plus `npm run check-blindspot`'s own per-language pass, §10.2 run directly on the
  new text, §2.3 a current-date scan returning empty next to a probe that fires, §10.3 no surface.
  The one new surface this run creates — restored currency magnitudes in `zh` — was checked against
  the `es` `billón` defect class specifically, and the file carries zero `$`.
- **`DECISIONS.md` conflict** — none from my change. Content stays in `.js` modules, no state or
  build change, and the machine-translation entry accepts AI translation under "(Beta)" labeling.
  *(`DECISIONS.md` is modified in the working tree by the owner's US-English sweep — not by me, not
  staged.)*
- **Already-done backlog item** — no; fifth `zh` tranche. **29-36 re-measured identical to four
  decimals against the values the previous four runs recorded** (0.3227, 0.3359, 0.3399, 0.3254,
  0.3298, 0.3161, 0.3294, 0.3385), which is simultaneously the proof this run disturbed none of them.
- **Own verification claim** — reproducible; every figure above is a pasted command output.
  **What the check caught: the previous run's own strengthened instrument — sorted-multiset figure
  equality — would have FAILED this tranche's lesson 37 for a correct translation.** Taken as a
  pass/fail gate it says eight figures are wrong; read properly it says four currency magnitudes were
  converted to the Chinese long scale, which is exactly what the `es` currency bullet asks for. That
  is the second consecutive run in which the instrument, not the content, was the thing that needed
  correcting — and it is worth noticing that the correction runs the *opposite* direction from last
  run's (containment was too weak; strict multiset is too strong). Both are recorded in item 93.
  **One thing I did NOT do:** the translation-review ledger is untouched — it fingerprints the
  **English** body. **No fluent Chinese reviewer has read either lesson.**

#### A tooling note, recorded because it will happen again

Editing this file with a Node script that calls `String.prototype.replace(old, newString)` **silently
corrupted it mid-run**: the replacement text contained a backtick immediately after a dollar sign
(from a markdown code span wrapped around a dollar sign), and a dollar sign followed by a backtick
is JS's substitution pattern for
"everything in the subject string BEFORE the match". It spliced 4,000 lines of this file into itself
and reported success. **Caught by `git diff --numstat` reading 4131 insertions against an edit that
should have been ~250**, not by the script, which had per-edit occurrence-count guards and passed all
of them — the guards check the *needle*, and the bug was in the *replacement*.
**Fix, and the rule for any future run editing this file programmatically: pass a FUNCTION,
`s.replace(old, () => replacement)`, which makes every `$`-sequence inert.** Recovery was
`git show HEAD:AGENT_LOG.md > AGENT_LOG.md` after copying the corrupt version and the already-written
run-log entry to the session scratchpad — no `checkout --`, and nothing else in the tree was touched.

#### Next run

**Item 93: `zh` economy 39-40 — the final Chinese tranche.** English **3,475 + 2,284 = 5,759
characters**, current `zh` **293 (0.0843)** and **179 (0.0784)**, projected **~1,300 added Chinese
characters** at the five-tranche rate of 0.226/char, headline expected **62 -> 60**, and **the
reference should stay 0.3490** — simulated this run at the 39/40 position: 0.28 through 0.34 all
leave it there, **0.35 is the boundary** for the third tranche running. **Re-simulate anyway, and
this time re-simulate the second lesson alone against the first's landed ratio** — that is the step
this run had to add. Note item 93's standing warning for 39: its English §1 is a **six-paragraph,
five-gauge dashboard** (GDP, CPI, PMI, VIX, credit spreads) and both `es` and `ko` shipped a single
line of acronyms there; `zh` 39 at 293 characters against 3,475 English is the same shape. Lesson 40
is the three-rules lesson whose `es` stub was three bare rule headings — the example item 93 was
filed on — so **read `zh` 40 before scoping it**. After 39-40 the `zh` economy track is complete and
**`ja` becomes the whole of item 93's economy work: still entirely unmeasured on the added-character
basis, and `ja` 30 has still not been checked for the lender/borrower substitution `ko` 30 and
`zh` 30 both had.**
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (scheduled dev-agent) — `zh` economy 39-40: the Chinese economy track closes, and the tranche that falsified its own budgeting rule

**Picked:** item 93's sixth and final Chinese tranche — step 1 of the weekly review's W-5.1 stop line.
**W-5.2's one-run-in-four reserve is satisfied**: the previous dev-agent commit (`45cb9b0`, the
US-English sweep) was not item 93 work, so this run was free to continue the tranche.

**Owner tree.** `npm run owner-tree -- --expect aa5eba4e…` read **`MOVED`** — and per the Environment
note's own warning, I checked *which* file before concluding anything. The deviation went from 2
tracked modified to **0**: commit `45cb9b0`, authored by the owner, committed the very US-English edits
W-5.7 flagged as owner-only, and **handled both protected spans correctly** — the `catalogue` inside the
dated verification note and the `colour` inside the quotation of the old §3.1.2 were reverted and marked
`us-english:allow`. So `MOVED` here means the owner acted, not that anything is wrong. **W-5.7 is
closed by the owner.** New baseline for the next run: **`d5ccab8e67fc757febcdbe7885ca48403d44c5784de100812c5b3b7527ad2c67` (3 tracked modified — all
three are mine — 52 untracked).** `HEAD` `45cb9b0` at the start of the run and unchanged at commit time.

#### Step 3.5 — every number reproduced, and the controls fired

| Claim in item 93's queued note | Re-measured | Verdict |
|---|---|---|
| `zh` reference 0.3490, threshold 0.2443 | 0.3490 / 0.2443 | holds |
| English side 3,475 + 2,284 = 5,759 characters | 3,475 + 2,284 = **5,759** | holds |
| `zh` 39 at 293 (0.0843), 40 at 179 (0.0784) | **293 / 0.0843** and **179 / 0.0784** | holds |
| headline 62, `zh` abridged 14 | 62, 14 | holds |
| lesson 16 nearest un-abridged, margin 0.0409 | 16 at 0.2853, margin **0.0409** | holds |
| 39 §1 is a six-paragraph five-gauge dashboard | read off `lessons.js`/`…economy.en.js` | holds |
| 40 is the three-rules lesson, `es`-stub shape | `zh` 40 §1 is **three bare rule headings** | holds |
| 0.28–0.34 leave the reference; 0.35 is the boundary | simulated: 0.345 safe, **0.350 moves it to 0.3500** | holds |

**Controls.** `translatedChars` was validated against a hand-built probe with known field lengths, plus
a negative probe carrying no `zh` fields at all (expected 0, got 0). The figure comparator was validated
on two deliberately mismatched pairs — `50,15` vs `50,40` **and** `[10,10]` vs `[10]`, the containment
blindspot — and reported both unequal. A paragraph-parity control was run against untouched lesson 29.
**Two controls did NOT fire on the first attempt, and both were my instrument rather than the code**:
the `translatedChars` probe expectation was arithmetically wrong (I wrote 6 for a probe whose `zh`
fields are 2+3+1+1 = 7), and the §10.3 child-facing probe string omitted the very forms its regex hunts.
Both were fixed and re-run before any negative result was believed — which is the whole point of step
3.5's control rule, and it is worth recording that the failure mode was *the control being wrong*, not
the check.

**Both lessons read before scoping, and both are the exact defect shapes item 93 predicted.** `zh` 39 §1
was **one line of acronyms against six English paragraphs** — `GDP、CPI、PMI、VIX、信用利差——读懂经济状态的关键指标。`,
34 characters against 1,509 — dropping the doctor/vital-sign framing, the dashboard-gauge image, and
every one of the five gauges' mechanisms and threshold values (NBER's broader criteria, the Fed's 2%
target, PMI's leading-indicator status, the VIX's 15/40 bands and the contrarian reading, the credit-
spread narrow/wide reading). §2 was **one paragraph against six**, compressing all four phases into one
clause each and dropping the closing point about why the lag is what lets you read the cycle. `zh` 40 §1
was **three bare rule headings and nothing else** — the `es` defect this item was filed on, reproduced
exactly in a third language — with all four explanatory paragraphs absent (the indebted family, the
factory worker, the farmer's tractor, the closing point); §2 was one sentence against two paragraphs.
**40's `takeaway` also dropped its final clause** (`about your money, career, and life`). Nothing had to
be un-said. **39's `thinkAbout` and 40's `thinkAbout` were already complete translations and were left
byte-identical.**

#### What shipped

- **`src/content/lessonContent.economy.zh.js`** — lessons **39 and 40** rewritten from summary to full
  translation, plus 40's truncated `takeaway` restored. Section counts (2 and 2) and headings unchanged.
  Four of four section bodies changed. Exactly **5 lines** of the file differ.
- **`scripts/translation-completeness-baseline.json`** — exactly two numbers (`39.zh` 0.08 -> 0.35,
  `40.zh` 0.08 -> 0.33).
- **`LAUNCH_READINESS.md`** — generated §10.4 figure, `zh 38,902 (0.283x)` -> `zh 40,386 (0.294x)`.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings (review-ledger staleness; the completeness
  warning, now reading **60** pairs). `npm run build` clean in 885ms. Node v26.7.0, foreground.
- **§33 run before re-recording failed on exactly two lines**, 39 [zh] and 40 [zh], no others, both in
  the `rose` direction.
- **Paragraph-count parity now exact on all four sections: 39 en 6,6 / zh 6,6 and 40 en 4,2 / zh 4,2.**
  They had been 1,1 and 1,1 — so this run restored **fourteen paragraphs** the Chinese had dropped
  outright, the largest single-tranche restoration of the `zh` track.
- **Figures: both lessons are exact sorted MULTISETS** (39 n=10, 40 n=8, zero differences either side).
  Unlike 37, neither lesson contains currency, so the long-scale 亿/万亿 accounting the previous run had
  to do does not arise here — and the `zh` economy file still contains **zero `$` characters**.
- **Cross-reference parity 1:1 in both, in the same order, and eight were added**: 39 §1 gained
  **`《经济周期的4个阶段》`**, and 40 gained all seven it was missing — `《长期债务周期》`, `《生产力增长》`
  (×2), `《长期债务周期》`, `《短期债务周期》`, `《交易》` and `《信贷》`. **Zero `第N课` constructions**, so
  §16's numeric guard has nothing to adjudicate. Each rendering was checked against the `zh` title in
  `lessons.js` and against the five 《》 forms already in the file.
- **Terminology checked against the existing corpus, not invented.** The stub called Trough `触底期`;
  lesson 38 established **`低谷`** as the phase name (with `触底` reserved for the verb), so 39 now uses
  `低谷`. The `=` in `高于50 = 预期扩张` is a plain ASCII `=` with spaces, matching lesson 29's
  `总支出 = 货币支出 + 信贷支出` and the `es`/`ko` renderings, not a fullwidth `＝`. The lesson-40
  callbacks reuse the imagery already in the Chinese: `房贷月供一年比一年吃掉更多的工资` from `zh` 33 and
  `农民的那台拖拉机` from `zh` 31.
- **§10.1 — nine patterns over both lessons, all clean, each against a probe control that fires.**
  §10.2 `/dalio|达利欧/i` clean; §2.3 current-date scan clean against a firing control, and **the
  Chinese text contains no four-digit year at all**; §10.3 no surface. **The place advice adjacency was
  a live risk is 39 §1's VIX paragraph**, where English says some contrarian investors look to buy when
  the VIX spikes. The Chinese renders it as a description of what a group does and why they believe it —
  `一些逆向投资者专门在VIX飙升时寻找买入机会，他们的理由是恐慌往往反应过度` — stating no view about any
  asset today, and matching the English's own attribution rather than softening or dropping it.
- **Live browser** (rebuilt `dist/`, `/usr/bin/python3 -m http.server 8911`, language switched through
  the app's own `<select>` with a real `change` event, disclaimer and all 40 lessons seeded into
  `localStorage`, reloaded). Lesson 39: **all 39 named probes present**, 1,061 Han glyphs, the
  `《经济周期的4个阶段》` reference rendered, both `= 预期扩张`/`= 预期收缩` threshold lines intact.
  Lesson 40: **all 29 named probes present**, 799 Han glyphs, all seven cross-references rendered and
  the restored takeaway clause `金钱、职业和人生` present. **Each reading asserted single-language: the
  only Latin of 4+ characters on either page is the language picker plus `NBER`, which is English's own
  acronym.** **English re-checked as a control** — switched back through the same `<select>`, lesson 40
  renders its English intact (2,937 characters, all 14 English probes, 5 Han glyphs, all 5 the picker's
  `中文`/`日本語`). Console clean (`onlyErrors` returned nothing), `localStorage` cleared, server stopped
  and confirmed unreachable.

#### The projection held a sixth time — and the tranche falsified its own budget

Reference **0.3490 before and after**, threshold **0.2443**, headline **62 -> 60**, lesson 16's margin
**0.0409** unchanged. **Six for six across twelve lessons.** `zh` abridged **14 -> 12**; every remaining
`zh` gap is now `essentials` 1-11 and 14.

**What this tranche adds, and it is a correction to the item's own planning rule rather than to a
translation.** The queued note budgeted 39/40 at the five-tranche rate of 0.226 added Chinese characters
per English character, predicting **~1,300**. The actual was **1,484 — 14% high**. The cause is not
drift: **39 and 40 had the thinnest stubs in the track** (0.0843 and 0.0784 against a 29-38 average of
0.1038), and a flat per-character rate silently assumes every lesson starts from the same place.
Re-checked **non-circularly**, using only information available before the tranche was written (the
29-38 band median of 0.3298 and the two measured stubs), the **gap model** — `added ≈ (target − current)
× English` — predicts **1,427, a 4.0% error against the flat rate's 14.0%**. This is written into item
93, and it matters immediately: for `ja`, the entire remaining economy phase, the gap model budgets
**~15,200 characters across 29-40 (~2,500 per two-lesson run)** where a flat 0.50-reference rate would
say ~20,400 — **1.34× too high**.

**And the previous run's ceiling rule needed narrowing.** 37/38 concluded the character ceiling "belongs
to whichever lesson is written second". Solved directly this run, **39's ceiling (1,212) and 40's (797)
were independent** — neither moved when the other lesson's length was varied across its full range —
because the p90 index points at an element *above* both landing ratios, so removing two ratios from
below it and re-inserting them below it leaves that element untouched. **The ceilings couple only when a
draft lands above the p90 element**, which is precisely what happened to 37. 39 still needed compression
— its first draft was **1,216, five characters over its own ceiling**, and moved the reference to 0.3499
— but it broke its own ceiling, not one inherited from 40. Brought to **1,201 / 0.3456** by 7
function-word compressions worth 15 characters, paragraph counts and figure multiset identical before
and after, no clause dropped.

**A cross-language regularity worth having, because `ja` 39 is coming.** Lesson 39 lands at the **top of
its language's band in both languages that have finished it** — `ko` at 0.5773 against a 0.51-0.55 band,
`zh` at 0.3456 against 0.3161-0.3429 for 29-38 — and would have landed higher still had the ceiling not
forced compression. Same lesson, same position, two unrelated languages, and the `ko` run already
identified the mechanism: §2's four phase paragraphs are five bare participial fragments each in English
(`GDP rising steadily, CPI near the Fed's target, PMI above 50 and climbing, VIX low, and credit spreads
narrow`), which neither language can render as compactly. **Do not read `ja` 39 landing high as padding.**

Cost: **1,484 added Chinese characters against 5,759 English = 0.258/char**, against 0.220, 0.234,
0.222, 0.221 and 0.234 on the first five tranches. **Whole-track `zh` cost: 9,393 added Chinese
characters against 40,764 English = 0.230/char**, against `ko`'s 0.379 and `es`'s 0.85. `zh` volume
**0.283x -> 0.294x**.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and checked rather than inferred: nine §10.1/§10.2/§2.3/§10.3 patterns
  run directly over the new Chinese with a probe control for each, plus `npm run check-blindspot`'s own
  per-language pass. The §10.3 control did not fire on the first attempt and the check was re-run after
  fixing the probe. The one surface where advice adjacency was genuinely live — 39's VIX paragraph — is
  quoted in full above rather than asserted clean.
- **`DECISIONS.md` conflict** — none. Content stays in `.js` modules, no state, routing or build change,
  and the machine-translation entry accepts AI translation under "(Beta)" labeling.
- **Already-done backlog item** — no; sixth and final `zh` tranche. **29-38 re-measured identical to
  four decimals against the values the previous five runs recorded** (0.3227, 0.3359, 0.3399, 0.3254,
  0.3298, 0.3161, 0.3294, 0.3385, 0.3429, 0.3267), which is simultaneously the proof this run disturbed
  none of them.
- **Own verification claim** — reproducible; every figure above is a pasted command output, and the one
  figure that was *not* reproducible as first written has been removed. **What the check caught: my
  first "exact model reproduces the tranche to the character" comparison was circular** — it fed the
  landed ratios back in as the target, so it could not have been wrong. Recomputed against the
  pre-tranche band median instead, the honest error is **4.0%, not 0%**, and that is the number recorded
  in item 93 and above. A model validated on its own output is the same defect class as a control that
  cannot fail.
  **One thing I did NOT do:** the translation-review ledger is untouched — it fingerprints the **English**
  body. **No fluent Chinese reviewer has read either lesson, and none has read any of the twelve.**

#### Next run

**Item 93 enters its `ja` phase: `ja` economy 29-30**, the first of six runs, per W-5.1 step 2. English
**2,411 + 2,900 = 5,311 characters**, current `ja` **274 (0.1136)** and **393 (0.1355)**, `ja` reference
**0.4952**, and the gap model budgets **~1,989 added Japanese characters** for the pair (932 + 1,057) —
**use the gap model, not a flat rate; that is this run's correction.** Expect the headline **60 -> 58**,
but **predict the headline move, not the reference** (the `ko` track's fifth-check finding). Two standing
warnings carry into `ja`: **`ja` 30 has still not been checked for the lender/borrower content
substitution `ko` 30 and `zh` 30 both had** — read it before scoping, since no ratio can detect it — and
`ja` is **entirely unmeasured on the added-character basis**, so treat the first tranche's rate as data,
not confirmation. After 29-40, **close the economy phase and file the `essentials` remainder (48 pairs)
as a new item** rather than rolling it into 93.
**W-5.6 remains open and unclaimed** — `LAUNCH_READINESS.md` §10.4's *narrative* still frames the volume
ratios as undifferentiated maintenance debt with no per-language reference; this run refreshed only the
generated figure the test enforces. **W-5.3 (600 KB archive trigger) and W-5.4 (37 run-log entries at
`##` instead of `###`) are also still open**; this entry is written at `###`.
**Item 18 remains the entire critical path to ending Phase 0**, blocked on the owner creating an
analytics-provider account, and **item 72's owner half — a deployed URL — is blindspot 10.10**.

### 2026-08-23 (owner-directed, interactive) — the UIUX/ set's *visual language*, applied: a warm palette and an editorial serif

**Picked:** owner-directed — "have you designed UIUX? implement it", then "apply the design when you
finish". `HEAD` `ab0bb83` throughout; the owner's `UIUX/` and `drafts/` stayed untracked and unread
beyond the images themselves.

#### The premise check corrected my own first answer

I told the owner "no, nothing has been designed" on the strength of item 26's note, which says the
`UIUX/` folder is "unread and uninterpreted" and instructs runs to leave it alone. **That note is
stale and I was wrong.** Reading the code rather than the backlog: `components/ui.jsx` carries a
whole section headed **"PATTERNS ADAPTED FROM THE UIUX/ REFERENCE SET (2026-08-17)"** with five
primitives — `IconTile`, `Tile`, `TileGrid`, `Steps`, `ResumeCard` — and `git log -S` dates them to
`5633b79`. They are wired into `Reference.jsx`, `Practice.jsx` and `Learn.jsx`, which I confirmed in
the live browser: the Reference tab **is** Vocabulary's "Explore topics" tile grid, and Review's "How
review works" **is** the Vocabulary/Quizlet trial-timeline rail. The 2026-08-21 entry records the
whole thing, including its finding that four of five mocked screens were already built.
**Item 26's note has been corrected in this commit** so the next run is not misled the way I was.

#### What was genuinely missing, and is what shipped

The 2026-08-21 pass adopted the reference set's **structures** and left its **voice**: every app in
`UIUX/` is warm and editorial (Vocabulary's cream + serif titles, Buddy's soft light cards), while
this app was cool blue on near-black. That gap is the whole of this change.

- **`src/index.css` — both palettes repainted warm.** Light is a cream canvas `#f8f5f0` over white
  cards with warm greige sunken/hairlines and warm-black ink; dark is a warm espresso `#14120f`.
  All three blocks (`:root`, the `@media` dark, the explicit `[data-theme="dark"]`) rewritten, the
  last two identical as §28 requires.
- **A system serif on the two largest type scales only** — `--font-display` in `index.css`,
  `family` in `theme.js`, honored by `Text` in `ui.jsx`. Body copy is untouched sans. No webfont:
  the app must work from a dragged-and-dropped `dist/`, so a font CDN is not acceptable.
- **`src/App.jsx`** — the first-run modal scrim was an inline `rgba(9,11,15,0.6)`, a cool literal
  that predates this change and now clashed. Warmed to `rgba(28,26,23,0.6)`, matching `--ink-strong`.
  No *new* inline color was introduced anywhere.

#### What was deliberately NOT changed

- **`theme.js`'s one-accent rule.** The accent stays blue-family (`#2f43c4` / `#a9b6ff`) rather than
  taking Vocabulary's sage-teal, because green/amber/red are reserved for success/caution/error here.
  A teal accent would collide with `fill.ok` — the same reason the 2026-08-21 run rejected an
  artboard that drew completed markers in the accent.
- **The 40 per-lesson accents in `content/lessons.js`.** Still a field nothing renders, and that file
  warns in its own comment against "fixing" them (item 75 already made that mistake once). Untouched.
- **Anything from the paywall screens.** A large share of `UIUX/` is subscription UI — Vocabulary's
  "Go Premium"/"Unlock all" and its Settings "Manage subscription", Duolingo's friends-invite. Item
  26 records a standing owner instruction that none of it may be built while §4.3's Phase-0 gate is
  open, and the sign-in surfaces would contradict `DECISIONS.md`'s localStorage-only state anyway.
- **The dated run-log entries that quote the old hexes.** `#2563eb` and `#fbfbfd` appear in
  `AGENT_LOG.md` and `AGENT_LOG.archive.md`; those are dated verifications and rewriting one
  falsifies it, which is this repo's own standing rule.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings. `npm run build` clean. `check-blindspot`
  0 failures.
- **The palette was solved offline BEFORE it was written**, against a contrast function validated on
  two published WCAG values (`#000` on `#fff` = 21.00, `#767676` on `#fff` = 4.54). The real check
  then reproduced the prediction **to two decimals**: §28 **110 pairs at AA**, worst light
  **5.61:1** (`--ink-bad` on `--surface-sunken`), worst dark **5.81:1**; §28b **70 graph pairs at
  1.4.11**, **0 exempted**, worst light 3.84:1, worst dark 3.95:1.
- **The warm palette is more accessible than the one it replaces on the light worst case — 4.62:1
  rising to 5.61:1.** Dark moves from 5.93:1 to 5.81:1, still far above the 4.5:1 bar.
- §28's three machine-checked figures in the `index.css` CONTRAST header were updated in the same
  change, including the rejected-option claim (white on the dark accent fill, now **1.94:1**).
- **Live browser, both schemes** (`dist/` rebuilt, `/usr/bin/python3 -m http.server 8912`, mobile
  viewport). Measured rather than eyeballed, with the two traps the 2026-08-21 entry records both
  avoided: contrast taken against **the first opaque ancestor, not `body`**, and the theme
  **asserted** (`data-theme="light"`) rather than assumed. A black-on-white probe injected as a
  control read exactly **21.00**. Live readings — page title **15.97:1**, tile label **6.63:1**,
  body copy **6.45:1** — **agree with the offline computation to two decimals on all three.**
- **A third repetition of the screenshot-color trap, worth recording because it has now caught two
  different runs.** The accent photographs as violet. `getComputedStyle` reads `rgb(47, 67, 196)`,
  exactly `#2f43c4`. **Do not "fix" a color from a screenshot in this app.**

#### Adversarial self-check (step 5)

- **Blindspot register** — clean. No content string changed anywhere in this commit, so §10.1/§10.2/
  §2.3 have no new surface; `check-blindspot` passes 0/0 and the §10.1 disclaimer still renders on
  Reference (confirmed in the live DOM, not assumed). §10.3's Kids tile still reads "For grown-ups
  teaching kids" — parent-facing, unchanged.
- **`DECISIONS.md` conflict** — none, and one was actively preserved: `theme.js`'s rule 2 (one
  accent; green/amber/red mean only success/caution/error) is the reason the accent did not become
  teal. localStorage-only, `.js` content modules and Vite are untouched.
- **`LAUNCH_PLAN.md` conflict — FOUND ONE, and it is the real finding of this check.** §3.4 read
  **"One typeface."** and the serif makes that false. Rather than ship a plan that contradicts the
  code — the drift this project has already had three times — §3.4 was updated in the same commit,
  with the reasoning that "one typeface" was aimed at the v1 chaos §3.1.1 describes (a different
  accent per lesson, emoji for icons) and not at a disciplined two-family pairing with a fixed role
  for each.
- **Already-done backlog item** — this is the sharpest risk here, since a "UIUX redesign" shipped
  2026-08-21. It is **not** a redo: that pass changed structure and explicitly left the palette
  alone, and I verified each of its five primitives was already present and wired before writing
  anything, rather than rebuilding them. This commit touches no component's markup except one
  `fontFamily` line and one scrim literal.
- **Own verification claim** — reproducible; the offline model was validated against published WCAG
  constants before use, the live instrument against an injected 21:1 probe, and the two agree to two
  decimals. **What this check caught in my own conduct: my first answer to the owner was wrong** —
  I asserted no design existed on the strength of a backlog note instead of reading the code. The
  note is now fixed, but the lesson is the one step 3.5 already states: a backlog item's
  characterization of the code is evidence, not fact.

#### Next

**§3.4's "one typeface" is now two — if the owner dislikes the serif, it is a one-line revert**
(`family` in `theme.js`), and the palette is a three-block revert in `index.css`. Both are isolated
to this commit. **Still open from the 2026-08-21 canvas and unchanged by this run:** the Leitner
box-distribution strip on Review, which costs five locale keys x five languages and was offered back
to the owner rather than shipped — **an open owner decision, not an oversight.**

### 2026-08-23 (owner-directed, interactive) — the last three UIUX/ patterns, and a serif that had reached only half the headings

**Picked:** owner-directed via `/design` — reference the `UIUX/` folder, design it, implement it. A
design canvas was drafted and published first, then implemented. `HEAD` `cade971`; the owner's
`UIUX/` and `drafts/` stayed untracked.

#### Step 3.5 — the premise, re-measured

The premise this time was my own previous entry's claim that the structural half of the `UIUX/`
redesign was complete. **Verified rather than assumed**, in the live browser: `Tile`/`TileGrid` render
the Reference tab, `Steps` renders Review's "How review works", `ResumeCard` renders Learn's Next-up
card. All present. So the remaining work really was three patterns, not a redesign — and the canvas
says so on its face rather than proposing a rebuild of things that exist.

#### What shipped

- **P1 — the reader's back control is a circular chip** (`LessonReader.jsx`). Every app in the folder
  puts back/close in a round chip on a light disc. **The visible label is gone, so `t.backLabel` now
  feeds `aria-label` and `title`** — the accessible name had to move, and dropping it would have been
  a silent regression. Target grows from roughly 60×20 to **40×40**, confirmed by
  `getBoundingClientRect`.
- **P2 — the Review steps rail is one continuous bar** (`ui.jsx`'s `Steps`). The Vocabulary original
  (`UIUX/Vocabulary iOS 187`, the screen `Practice.jsx` already cites) runs a single rounded rail the
  full height; the shipped version broke the connector at every icon, reading as three unrelated
  rows. The wash moved from the per-step tiles to the rail, so **no token changed**.
- **P3 — the primary button is bevelled** (`ui.jsx`'s `BUTTON_VARIANTS.primary`). The one signature
  shared by every app in the folder and missing here: Duolingo bevels the bottom edge, Vocabulary
  casts a hard offset shadow. Shipped as the restrained version — a 3px inset bottom edge.
- **P0 — a real defect in my own previous commit, found while implementing.** That commit wired the
  display serif into `Text`'s scale lookup. **Two display-scale headings do not go through `Text`** —
  the lesson title in `LessonReader.jsx:270` and the sub-screen title in `Reference.jsx:107`, both raw
  `<h1>`s with inline styles — so they stayed in Inter. The reader's lesson title is the largest type
  in the app. Both now carry `family.display`.

#### Two things the canvas said that the build disproved

- **`fill.accentDeep` is the wrong token for the bevel, and only dark mode shows it.** The Decisions
  artboard recommended reusing it: right in light (`#24339b` under `#2f43c4`), **wrong in dark**,
  where the "deep" accent is *lighter* than the face (`#c3ccff` over `#a9b6ff`) — a bevel lit from
  below. Shipped as **`--shadow-bevel`**, its own two-scheme token, darker than the face in both:
  verified by reading the rendered button's computed `boxShadow` and comparing relative luminance
  (light face 0.147 / bevel darker; dark face **0.491** / bevel **0.264**). **The canvas was corrected
  to say so** rather than left describing a build that did not happen.
- **It is a `--shadow-` token, not a `--fill-` one, on purpose.** §28 pairs every `--fill-*` with
  `--ink-on-fill` and demands AA; a 3px edge nothing prints on would have been forced to answer an
  accessibility question that does not exist. `--shadow-*` sits outside §28's prefix filters.

#### Verification

- `npm test` **exit 0, 0 failures**, 2 pre-existing warnings. `npm run build` clean.
  `check-blindspot` 0 failures. §28 still **110 pairs at AA** and §28b **70 graph pairs, 0 exempted**,
  with the same worst cases as before — the bevel token deliberately does not enter that matrix.
- **Live browser, both schemes.** Serif on the reader `h1` confirmed by `getComputedStyle` —
  **`ui-serif, Georgia, …`, where the same read returned `Inter` before the fix**. Back chip: 40×40,
  `border-radius: 999px`, `aria-label` "Back", **visible text empty** (so the name genuinely rests on
  the label). Bevel: computed `boxShadow` inset colour read back as `rgb(36,51,155)` light and
  `rgb(124,136,207)` dark, each darker than its face by luminance.
- **The screenshot lied again and the measurement caught it — third time in three days.** The reader's
  lesson title *looked* serif in a screenshot taken before the fix; `getComputedStyle` said `Inter`.
  This is now the same trap as the violet-accent one, in a different property.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean. No content string changed; `check-blindspot` 0 failures, §10.1's
  disclaimer still on every surface that requires it. §10.3: **Duolingo's winding path, mascot and
  streak gamification were considered and deliberately not built** — the app ships parent-facing by
  decision, and a mascot path reframes it at children, which is a legal/store-classification question
  and not a UI one. That refusal is written onto the canvas itself so it is not re-proposed.
- **`DECISIONS.md` conflict** — none. `theme.js`'s one-accent rule holds (the bevel is a shade of the
  existing accent, not a new hue); localStorage-only, `.js` content modules and Vite untouched. The
  paywall and sign-in screens that make up much of `UIUX/` were again left alone, per item 26's
  standing owner instruction and the localStorage-only decision.
- **Already-done backlog item** — no, and this was checked in the browser rather than assumed: the
  five existing `UIUX/`-derived primitives were confirmed present and wired before anything was
  designed, so none was rebuilt. `Steps` was modified, not re-created.
- **Own verification claim** — reproducible; every figure is a computed-style read or a command.
  **What the check caught: the canvas I had already published contained a recommendation that was
  wrong in dark mode.** The honest move was to correct the published artboard, not to quietly ship
  something else and leave the design saying otherwise.
- **Copyright** — the references are other companies' shipping apps. General learning-app patterns
  were adapted (a round back chip, a continuous step rail, a bevelled button); no branded element —
  mascot, palette, node art, wordmark — was reproduced.

#### Noted, not fixed

**The primary button is 42px tall, not 44.** Measured this run. Pre-existing, comes from `space["3"]`
padding plus a 1rem label, and changing it moves every button in the app — out of scope for a run
asked to apply three patterns. Filed here rather than silently widened.

#### Next

**Unchanged and still the critical path:** item 18 (analytics account) and item 72's owner half (a
deployed URL), both owner-blocked. **Item 93's `ja` phase** — `ja` economy 29-30 — is the next
scheduled pick, per W-5.1 step 2 and this date's earlier entry.

### 2026-08-23 (scheduled dev-agent) — the run log archived under W-5.3, and the archive would have silently blinded a check

**Picked:** W-5.3, whose trigger had fired and was not acted on. `AGENT_LOG.md` stood at **1,396,464
bytes** against a **600 KB** threshold, and every run pays to read this file to orient. Also the
right pick under **W-5.2** (one run in four is not item 93): the last scheduled run was `zh` 39-40,
and W-5.1's next step (`ja` economy 29-30) is explicitly a six-run block, so taking the cheap
structural item first costs that block nothing. `HEAD` `4b4a6b1`; the owner's `UIUX/` and `drafts/`
stayed untracked and untouched.

#### Step 3.5 — the premise, re-measured, and it broke in two places

- **The size claim held.** W-5.3 said the run log was 75% of the file; measured per-date it is
  **1,013,969 of 1,396,464 bytes = 72.6%**. Close enough to act on, and reported as measured.
- **Break 1 — the rule as written was a no-op on the day it fired.** W-5.3 says to move entries
  "older than seven days". Seven days before 2026-08-23 is 08-16, and *everything* before 08-16 was
  already archived by the two earlier passes — so a literal reading moves **zero bytes** while the
  file sits at 2.3× its threshold. The boundary actually used is the archive file's own rule, which
  the run-log header already directs archivers to: move everything before the most recent
  weekly-review boundary (**08-23**), leaving the current review period live. That is 08-16→08-22.
  The correction is written into W-5.3 itself so the next archiver does not re-derive it.
- **Break 2 — and this is the one worth the run.** The archive would have **silently disabled
  `check-measurements.mjs`**. That script re-runs the jargon instrument against every `MEASURED`
  line it finds, but it read **only `AGENT_LOG.md`**. Measured before touching anything: 7 claims
  parsed, **1 enforced** — and all 7, the enforced one included (2026-08-21, `money`, fingerprint
  `0aa8425a`), sit in entries dated 08-16→08-22. A verbatim move leaves the script with zero claims,
  where it takes its `!claims.length` branch, prints "nothing to verify" and **passes green**. The
  branch exists precisely to make that state visible; archiving would have reached it by accident,
  and `npm test` would have stayed 0 failures throughout.

#### What shipped — two commits, in this order so no window exists where the check is vacuous

1. **`26b5488` — `check-measurements.mjs` reads `AGENT_LOG.md` *and* `AGENT_LOG.archive.md`** (the
   archive optional via `ENOENT`), and every message now names the file it found a claim in instead
   of hardcoding `AGENT_LOG.md:<line>`. A claim stays enforced while its fingerprint holds, wherever
   the entry quoting it now lives.
2. **The archive move**, verbatim, touching no run-log content: 107 entries dated 08-16→08-22 moved
   under a new `## Archived 2026-08-16 → 2026-08-22` heading. `AGENT_LOG.md` **1,396,464 → 483,876
   bytes (−65%)**; archive 739,227 → 1,652,981.

#### Verification

- **Commit 1 is behaviour-neutral today, and provably so, not by reading the diff:** the archive
  contained **0** `MEASURED` lines, and the check reported the same **7 claims / 1 enforced / 6
  retired** before and after. Then two injected probes proved the new path is live rather than
  merely harmless — a probe carrying the current fingerprint raised it to **8 claims / 2 enforced**,
  and a probe with a wrong candidate count **failed and cited `AGENT_LOG.archive.md:8050` by name**.
  The archive was restored from a scratchpad copy and its SHA-256 re-checked (`01c1a8df…`), never by
  `git checkout --`.
- **The move lost nothing:** entry count reconciles **116 = 107 archived + 9 live**, and a sorted
  line-by-line comparison of all run-log content before vs. after is **identical (10,935 non-blank
  lines both sides)**.
- **The control was made to fail before it was believed — and the first attempt at it was wrong.**
  Probing by dropping `before[:-1]` still reported "identical", because the line it removed was
  blank and the comparison filters blanks by design. Re-probed properly: deleting one *non-blank*
  line → not identical; mutating one character → not identical; unmodified → identical. Had the
  first probe been accepted, the whole integrity claim above would have rested on a comparison never
  shown capable of failing.
- **After the move:** `npm test` **exit 0**, `npm run build` clean, and `check-measurements` still
  reports 7 claims / 1 enforced — now sourced from the archive, which is the entire point of
  commit 1.

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and structurally so: no file under `src/` or `src/content/` was
  touched, no rendered string changed, no date or market figure introduced. `check-blindspot` 0
  failures.
- **`DECISIONS.md` conflict** — none. No architectural surface involved; localStorage-only, `.js`
  content modules and Vite untouched.
- **Already-done backlog item** — this is the third archive pass, and that is the rule working, not
  duplication: the previous two covered 08-01→08-08 and 08-09→08-15, and the ranges do not overlap
  (verified against the archive's existing `## Archived` headings before appending).
- **Own verification claim** — reproducible from the commands above. **What the check caught in my
  own work:** the broken control described above. It also caught that this entry initially wanted to
  say "the archive changed nothing" — it changed where a check gets its input, which is why commit 1
  exists and is described first.
- **A consequence I am not hiding:** because the move is verbatim, **31 `##`-level entries landed in
  the archive as siblings of its `## Archived <range>` headings**, so that heading structurally
  appears to end early. Nothing parses the archive's sections, so nothing breaks — but it means
  W-5.4 now spans two files, and I have re-scoped it with the measured post-archive counts rather
  than leaving it describing the pre-archive file. Fixing it here would have changed the very lines
  the integrity proof compares, so it was deliberately left to its own commit.

#### Noted, not fixed

**This entry is written at `###` while the 9 live entries above it are `##`** — `###` is the level
W-5.4 says is correct, so it is written forward-correct rather than consistent with a defect.

#### Next

**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL — Netlify
Drop is a drag of `dist/`) and **O-2** (item 18, an analytics account). **O-3** — the volume of
unreviewed machine translation — is a decision, not a task, and is still waiting.
**Next scheduled pick: `ja` economy 29-30**, resuming W-5.1 step 2's six-run block; the rate must be
re-measured against `ja`'s own 0.50 reference rather than inherited from `ko` (0.379) or `zh`
(0.226). **W-5.4 is now the cheapest non-93 item** and is fully scoped above.

### 2026-08-23 (owner-directed, mid-run) — the UIUX/ set's *touch targets*: eleven control classes were under 44, the smallest at 20x20

**Picked:** owner-directed. This run started as the scheduled `ja` economy 29-30 pick (W-5.1 step 2)
and had completed step 3.5 on it when the owner interjected **"proceed implementing UIUX"**. Switched
to the UIUX stream; the `ja` measurement is preserved at the bottom of this entry so the next run does
not repeat it. `HEAD` `a7343d7` throughout; `UIUX/` and `drafts/` stayed untracked and unread.

#### Step 3.5 — the premise, re-measured, and it was understated by an order of magnitude

The 2026-08-23 "last three UIUX/ patterns" entry filed this under **"Noted, not fixed"**: *"The primary
button is 42px tall, not 44 … changing it moves every button in the app — out of scope."* Taken at face
value that is a 2px shortfall on one component.

**Measured live before touching anything, at a 375px mobile viewport: eleven control classes rendered
under 44x44, and `Button` was the mildest of them.**

| Control | Site | Before | After |
|---|---|---|---|
| Coach-mark dismiss ✕ | `App.jsx` | **20x20** | 44x44 |
| Sector period tabs `1M/3M/6M` | `ui.jsx` `Segmented` | **19x31** | 44x44 |
| Practice runner exit ✕ | `Practice.jsx` | 32x32 | 44x44 |
| Kids age tabs | `ui.jsx` `Segmented` | 63x31 | 63x44 |
| Language picker `select` | `App.jsx` | 121x27 | 121x44 |
| Lesson term chips | `GlossaryTerms.jsx` | 68x27 | 76x44 |
| Reference / TermDetail back | `Reference.jsx`, `TermDetail.jsx` | 90x33 | 90x44 |
| PolicySim option chips | `PolicySim.jsx` | 109x35 | 44 floor |
| Reader back chip | `LessonReader.jsx` | 40x40 | 44x44 |
| Theme radios | `Settings.jsx` | 98x43 | 98x44 |
| `Button`, every variant | `ui.jsx` | 293x42 | 293x44 |

`1M` at **19px wide** fails not only WCAG 2.5.5's 44px (AAA) but **2.5.8's 24px AA floor**. The
coach-mark ✕ at 20x20 is under a quarter of the required area, and it is the control that dismisses
an overlay sitting on top of the lesson list.

**The premise correction that matters for scoping:** the filed note's reason for deferring — "it moves
every button in the app" — is true of `Button` and irrelevant to the other ten, which are hand-styled
one-offs that no shared component was ever going to fix. The item was deferred on the cost of its
cheapest part.

**Controls carried, because a size scan that silently returns nothing looks exactly like a clean app.**
(a) A probe of known size (`123x37`, later `61x29`) injected and read back exactly before each sweep.
(b) Every "after" sweep kept a deliberately undersized `30x21` probe in the DOM — **it appears in every
result list below**, so an empty-except-the-probe result means the scan ran and found nothing, not that
the scan was blind. (c) The two controls unreachable in a browser — PolicySim's chips (behind 34
lessons) and the runner exit — were measured by **replicating their exact inline-style block**, a
technique validated by replicating the term chip first and getting **68x27, matching the live chip to
the pixel**.

#### What shipped

- **`theme.js` — a new `MIN_TAP = 44` token**, with the rule written where someone will find it: why 44
  (Apple HIG, WCAG 2.5.5, and every app in `UIUX/` is an iOS app built to it), and **why `minHeight` and
  never `height`** — the app has a user font scale to 1.3x, and a fixed height clips the label at the
  large end. Icon-only controls that carry no text are the stated exception and pin both dimensions.
- **Twelve call sites** moved onto the token, including `Learn.jsx`'s two **bare `44` literals** — it was
  the one file already honoring the rule, in a form no other file could discover.
- **The term chips' horizontal padding rose with their height** (`space[3]` -> `space[4]`): a 44px pill
  on 12px of side padding reads as a narrow capsule, and these wrap into rows where proportion is what
  the eye reads. This is the only *visual* judgment in the change; everything else is a floor.
- **`Question.jsx` states the floor it was already meeting by padding coincidence**, so a later padding
  edit cannot drop the answer options under it in silence.
- **`check-data.mjs` §34**, a regression guard: every file under `src/` rendering a raw `<button>` or
  `<select>` must reference `MIN_TAP`, and no bare `44` may appear as a `minHeight`/`minWidth`.

#### The guard is deliberately weak, and says so

§34 **cannot measure a rendered height** — nothing static can, and its own output says "rendered sizes
are verified in a browser, not here." What it catches is the failure mode that actually produced this
defect: a screen written with hand-tuned padding by someone who did not know the rule existed. A file
can still import `MIN_TAP` and misuse it.

**All three of its arms were proven able to fail before being trusted**, each restored from a scratchpad
copy rather than `git checkout --`:
1. Stripped `MIN_TAP` from `GlossaryTerms.jsx` → `FAIL: §34: … renders a raw <button> … but never
   references MIN_TAP`.
2. Planted a bare `minHeight: 44` in `Learn.jsx` → `FAIL: §34: … writes a bare 44`.
3. Blinded the regex to `<buttonXX` → the floor fired: `FAIL: §34: only 0 file(s) … matched (expected at
   least 8)`, which is the arm that stops "found nothing" from reading as "nothing wrong".
`git diff --stat` on the probed files afterwards showed only the intended edits.

#### Verification

- `npm run build` clean. **`npm test` exit 0, 0 failures**, the same 2 pre-existing warnings
  (translation review coverage; item 93's 60 abridged pairs). `check-blindspot` 0 failures.
- **§28 contrast unchanged — 110 pairs at AA, worst light 5.61:1, worst dark 5.81:1; §28b 70 graph pairs,
  0 exempted.** Expected, and checked rather than assumed: `git diff` contains **zero hex changes** and
  touches no token color.
- **Live browser, both schemes, 375x812.** Learn, the reader, Practice (home *and* a started runner),
  Reference root and all five sub-screens: **nothing under 44x44 except the control probe.** Dark
  asserted by reading the shell background — `rgb(20, 18, 15)`, the warm espresso `#14120f` — not by
  trusting the emulation, which is the trap the Environment note records.
- **The `minHeight`-not-`height` claim was tested, not just asserted.** At the 1.3x font scale
  (root `20.8px`) the floors held *and* the controls grew past them: theme radios 44 -> **48**, text-size
  buttons **55**, tab bar **63**, and a scan for any control whose content exceeds its box returned
  **none**. The reader's icon-only back chip — where both dimensions are pinned — holds a 15x15 icon in
  its 44x44 box with `scrollWidth/Height` 42x42, so pinning does not clip at the large end either.
- **Screenshotted** the reader's term chip and the coach mark. The coach-mark message row was changed to
  `display:flex` to center its new floor, so it was checked visually rather than by measurement alone:
  two-line message, left-aligned, ✕ centered. No layout break.
- **One instrument failure caught and fixed mid-run:** the first "after" sweep reported *identical*
  numbers to the "before" sweep. The control probe fired correctly, so the instrument was fine — the
  browser was serving the **cached bundle**. Confirmed by reading `script[src]` (`index-DAfMlhHh.js`,
  the pre-build hash) and fixed with a cache-busting query. **Without the probe this would have read as
  "the change did nothing."**

#### Adversarial self-check (step 5)

- **Blindspot register** — clean, and structurally so: `git diff` touches **no file under
  `src/content/` or `src/locales/`** and changes no rendered string, so §10.1/§10.2/§2.3 gain no new
  surface. `check-blindspot` 0 failures. §10.3's Kids tile still reads "For grown-ups teaching kids".
- **`DECISIONS.md` conflict** — none. No color moved, so `theme.js`'s one-accent rule is untouched;
  localStorage-only state, `.js` content modules and Vite are all unaffected.
- **`LAUNCH_PLAN.md` conflict** — checked explicitly this time, because the previous UIUX run found one
  (§3.4's "one typeface"). `grep -niE "44 ?(px|pt)|touch target|tap target|hit area"` over
  `LAUNCH_PLAN.md` and `DECISIONS.md` returns **nothing** — no spec is contradicted, and none existed to
  guide this either, which is part of why it drifted.
- **Already-done backlog item** — no. The only prior mention of "44px targets" in the log or archive is
  the 2026-08-21 entry *verifying* them on Learn; that run established the standard on one screen and
  this one extends it and removes its bare literal. No backlog item covers touch targets, which is
  itself the finding: **eleven failing control classes had no item.**
- **Own verification claim** — reproducible from the commands above, and every arm of the new guard was
  demonstrated failing before being reported as passing. **What the check caught in my own work:** the
  cached-bundle false negative described above, which I was one step from writing up as a clean result.

#### Noted, not fixed

**The Leitner box-distribution strip on Review is still an open owner decision, not an oversight.** It
was offered back to the owner on 2026-08-21 and again on 2026-08-23 (it costs five locale keys x five
languages). "Proceed implementing UIUX" is not clearly an answer to that specific question, so it was
not built unilaterally. **It is the one remaining unbuilt item from the UIUX canvas.**

#### Next

**The scheduled `ja` pick is unchanged and its step 3.5 is already done — do not re-derive it.**
Measured this run with the instrument's own numbers: `ja` reference **0.495189**, threshold
**0.346633**, headline **60** abridged pairs (`es` 12, `ko` 12, `zh` 12, `ja` 24). **`ja` 29 is
`en=2411 ja=274 ratio=0.1136`; `ja` 30 is `en=2900 ja=393 ratio=0.1355`.** The `ja` p90 index points at
**lesson 27 (0.495189)**, and the money/essentials band `ja` should land in is **min 0.3784 / median
0.4909 / max 0.5343**. Both stubs sit far below the p90 element, so per the 39/40 ceiling rule the two
lessons are **independent and may be written in either order**. Nearest clear `ja` lesson is **16 at
0.3784, margin 0.0318** — the one to watch for a collateral crossing. Gap model budget: roughly
**(0.49 − 0.11) x 2411 + (0.49 − 0.14) x 2900 ≈ 1,930 Japanese characters** for the pair.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-23 (scheduled dev-agent) — `ja` economy 29-30: the fourth language starts, and a track that can be finished without ever moving its own reference

**Picked:** W-5.1 step 2, `ja` economy 29-40, first tranche (item 93). `HEAD` `ee570bf` at start and at
commit; `UIUX/` and `drafts/` stayed untracked and unread. Owner-tree fingerprint observed this run:
**`ad74c89a1ed7c6f3f1418f540b5fe87bb681d8ebd32110d5bc03dd479f5c5270`** (3 tracked modified — all mine —
52 untracked).

#### Step 3.5 — the premise held to four decimals, and the instrument was proven able to move

The previous run pre-computed this tranche's step 3.5 and asked that it not be re-derived. It was
re-run anyway as a *check*, not a re-derivation, and **every figure reproduced exactly**: `ja`
reference **0.495189**, threshold **0.346633**, headline **60** (`es` 12, `ko` 12, `zh` 12, `ja` 24),
`ja` 29 `en=2411 ja=274 ratio=0.1136`, `ja` 30 `en=2900 ja=393 ratio=0.1355`, band **min 0.3784 /
median 0.4909 / max 0.5343**, nearest clear `ja` lesson **16 at 0.3784, margin 0.0318**. The p90 index
(35) points at **lesson 27 at 0.495189**.

**Controls, because a ratio that does not move looks the same whether the content changed or the
instrument is blind.** (a) A **100-character probe** injected into `ja` 29's takeaway moved the count
`274 -> 374` and the ratio `0.1136 -> 0.1551`, **exactly +100**, while `ja` 30 stayed at 0.1355 —
proving the instrument is per-lesson and not aggregating. (b) With the probe in place `npm test`
**failed on §33** (`lesson 29 [ja] is now at 0.16, up from a recorded 0.11`), proving the drift guard
sees this surface rather than passing it through. (c) The probe was reverted **from a scratchpad copy,
never `git checkout --`**, and the restored file's `shasum` matched the pre-injection hash
(`ff086a87…`) with `git status` clean before any real edit began.

**A third control, on the edit method itself.** These files are `JSON.stringify(v, null, 2)` blocks
under a hand-written header. Before editing, the *current* 29 and 30 values were re-serialized and
checked to be **byte-present in the file** — both `true` — so the splice could not silently reformat
neighboring lessons. `git diff --stat` afterwards touches only the two intended blocks.

#### The premise correction this tranche produced — `ja` 30 §1 is not an abridgement

Item 93 records that **`ko` 30 §1 "was not an abridgement of the English at all but different
content"** (lender/borrower motives, where English is the $20,000-car worked example) and warns that no
ratio can detect this. **`ja` 30 §1 is the same defect, reproduced a second time**: its Japanese read
`貸し手はお金を増やしたい。借り手は今買えないものを買いたい。` — lender and borrower motives — against
English's worked example of a $20,000 car, $5,000 saved and a $15,000 loan. So this is now **two of
four languages**, not a `ko` one-off, and it is the strongest evidence in the item that **these
languages need reading, not measuring**. `ja` 29 by contrast was a true abridgement.

#### What shipped

- **`ja` 29 (0.1136 -> 0.4513)** and **`ja` 30 (0.1355 -> 0.4693)** — full translations, **1,782 added
  Japanese characters** against 5,311 English, i.e. **0.336 added characters per English character**.
- **Structural parity is exact**, checked rather than eyeballed: sections en=ja on both lessons,
  paragraph counts **29 §1 3/3, §2 3/3; 30 §1 3/3, §2 3/3, §3 3/3**, bullets **2/2** on 29 §2. The old
  `ja` stubs collapsed §2 (and 30's §2/§3) to two paragraphs each; the bullet block is now its own
  paragraph, matching English.
- **Currency follows the file's own convention, which is the myriad scale and no `$`.** Measured before
  writing: `lessonContent.money.ja.js` uses `5万ドル`, `45万ドル`, `2,000ドル`, and **neither `ja` file
  contains a single `$`**. So `$20,000 -> 2万ドル`, `$15,000 -> 1万5,000ドル`, `$5,000 -> 5,000ドル`,
  `$10,000 -> 1万ドル`, `$8 -> 8ドル`.
- **The Fed and the cross-reference follow the siblings.** `FRB` is this file's established rendering
  (12 existing uses, 0 of `連邦準備制度`), matching `es` `Reserva Federal` / `ko` `연준` / `zh` `美联储`;
  the title reference renders as `「金利」`, the short form `ko` and `zh` both use. §16 is unaffected —
  it counts *numbered* references, and this one is by title.

#### The figure multiset, accounted for rather than asserted

Item 93's rule is to run the comparator and then **name every difference**, not to weaken it. Run:
**`ja` 29 shows 2 differences, `ja` 30 shows 6.** Every one is accounted:
- **Scale conversions (the Japanese analogue of the `zh` 亿 case):** `20,000 -> 2万` (contributes `2`),
  `15,000 -> 1万5,000` x2 (contributes `1` x2 and `5,000` x2), `10,000 -> 1万` (contributes `1`).
- **Counter artifacts rendering English *words*, not figures:** `1個あたり` ("per loaf"), `1日に`
  ("a day"), `たった1つの` ("a single"), `1人の買い手、1人の売り手` ("one buyer, one seller"),
  `2つの役割` ("two roles"), `ビール1杯` ("a beer"), `最初の1か月分` ("a first month's").
**Zero English figures were dropped and zero were added** — `100`, `5`, `500` all present in 29; `8`
and all four dollar amounts present in 30.

#### The projection, and the reason `ja` is the safest of the four tracks

**All four predicted figures held.** Headline **60 -> 58**, exactly 2. Reference **0.495189 before and
after**. Threshold **0.346633**. Lesson 16's margin **0.0318**, unchanged. This is the `zh` 29/30 case
repeating, for the reason item 93 identified: both lessons landed *below* the p90 element.

**Simulated the whole rest of the track, and the result is unusually strong.** With `ja` 31-40 all set
to 0.44, 0.46, 0.48 **and** the band median 0.4909, the reference is **0.4952 in every case**, the
threshold **0.3466**, `ja` abridged **12** (essentials 1-11 and 14), and lesson 16's margin **0.0318**.
**So the entire `ja` economy track can be completed without moving the reference once**, because the
already-complete money track occupies 0.38-0.53 and the p90 index points at lesson 27 at 0.4952 — an
element that ten conversions landing below it cannot displace.
**⚠️ The caveat is tighter here than in `ko` or `zh`, and it is the one thing to carry forward.** `ja`'s
band median (**0.4909**) sits only **0.0043** under the p90 element (**0.4952**). In `zh` that gap was
comfortable; here, a lesson written to the median is four thousandths from waking the reference the way
`ko` 39 did at 0.5773. **Target ~0.45-0.47 for `ja`, not the band median** — this run deliberately did,
landing at 0.4513 and 0.4693 with **105 and 75 characters** of ceiling headroom.

**Budget note, honestly stated:** the gap model predicted **~1,930** characters *for a landing ratio of
0.4909*; the actual was **1,782** because the target was deliberately set lower. Against the target
actually chosen the model is exact to the character (814 predicted / 814 actual on 29; 968 / 968 on
30). **The model was not falsified — the target was changed** — and next runs should budget from their
own chosen target, not from this tranche's total.

#### Verification

- **`npm test` exit 0, 0 failures**, the same 2 pre-existing warnings — and the completeness warning
  now reads **58** where it read 60, which is the debt visibly paid down rather than a silent pass.
- **`npm run build` clean** (886ms). `npm run check-blindspot` **0 failures**.
- **`LAUNCH_READINESS.md` §10.4 was refreshed by its own guard, not by hand.** `npm test` failed first
  with `ja 42,879 (0.312x)` disagreeing with the live content; `npm run readiness -- --write` moved it
  to **`ja 44,661 (0.325x)`** and nothing else on the line changed. That guard firing is what stopped
  this run from shipping a scorecard describing last week.
- **The baseline moved exactly two pairs, both upward** — `29 ja 0.11 -> 0.45`, `30 ja 0.14 -> 0.47`,
  `git diff --stat` reporting **2 insertions, 2 deletions** and nothing else.
- **The review ledger correctly did NOT move** (`npm run review-status` unchanged, no ledger file in
  `git status`). Per item 93 that is right: it fingerprints the *English* body, and **no pair was
  marked reviewed just because it was translated.**
- **Live browser, `dist/` served on 127.0.0.1:8801, 375x812 mobile.** Both lessons opened via
  `#/lesson/29` and `#/lesson/30` (lesson 30 needed 29 in `completedLessons` first — a URL does not
  unlock a lesson, exactly as `DECISIONS.md` says). **Both render in full**: every paragraph, both
  bullets on 29 §2, the arrow chain, the `「金利」` reference, takeaway, thinkAbout, and the §10.1
  disclaimer. Dark scheme asserted by **reading** the computed background — `rgb(20, 18, 15)` — not by
  trusting the emulation. Screenshotted 30 §1.
- **Not the cached-bundle trap the previous run hit:** the rendered Japanese is text that did not exist
  anywhere before this run (`最後に買ったコーヒーを思い浮かべてください`), so a stale bundle could not
  have produced it; the served `index-C1a5ONNM.js` also matches this build's output hash.

#### Adversarial self-check (step 5)

- **Blindspot register — one hit investigated and cleared, which is why the grep is run over the diff
  rather than assumed.** `git diff | grep -ic dalio` returned **1**. Localized per file and per side:
  **0 on every added line in all three files.** The match is a *context* line — `LAUNCH_READINESS.md`'s
  unchanged §10.2 row, which names Dalio while stating the rule and which that row itself documents as
  deliberately not scanned. §10.1: 0 advice-adjacent matches on added lines and `check-blindspot` clean
  across its per-language `ja` patterns. §2.3: 0 date or live-figure matches on added lines, and the
  check passes over `lessonContent`. §10.3: untouched, no kids surface in the diff.
- **`DECISIONS.md` conflict** — none. localStorage-only state, `.js` content modules and Vite are all
  unaffected; the machine-translation entry's option (a) covers adding AI translation under "(Beta)",
  which is what this is. **The O-3 flag applies and is repeated below rather than quietly omitted.**
- **Already-done backlog item** — no. Item 93 records `ja` as **untouched at 24 abridged**; 29 and 30
  have never carried a translation of the English body. Nothing was undone.
- **Own verification claim** — reproducible from the commands above. **What the check caught in my own
  work:** the Dalio hit, which read as a §10.2 regression until it was localized to a context line; and
  the readiness failure, which I would otherwise have reported a green suite without.

#### O-3, restated because this run is exactly what it is about

This run added **1,782 characters of unreviewed machine translation** in a "(Beta)"-labeled language.
**No fluent Japanese reviewer has read either lesson.** Human review share is **0% in all four
languages**. That is consistent with the owner's 2026-08-11 decision and it is still the thing the
owner should either re-affirm or cap.

#### Next

**`ja` economy 31-32**, the second of six tranches. Pre-measured this run so it need not be re-derived:
`ja` **31 is `en=2445 ratio=0.1055`, ceiling 1,210 characters**; **32 is `en=3777 ratio=0.1374`,
ceiling 1,870 characters** (both against the p90 element 0.495189). Both stubs sit far below that
element, so **the two lessons are independent and may be written in either order**. Target **0.45-0.47,
not the 0.4909 median** — see the 0.0043 caveat above. Gap-model budget at 0.46: roughly
**(0.46 − 0.1055) x 2445 + (0.46 − 0.1374) x 3777 ≈ 2,085 Japanese characters**. Remaining after that:
**35,453 English characters across `ja` 31-40**, about **11,900 Japanese characters over five runs** at
this tranche's realized 0.336/char. **Read `ja` 31 and 32 §1 before translating** — two of four
languages have now had a lesson-30-shaped "different content, not abridged" stub, and only reading
finds it.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-23 (scheduled dev-agent) — `ja` economy 31-32, and a non-circular way to know how long a translation should be

**Picked:** W-5.1 step 2, `ja` economy 31-40, second tranche (item 93). W-5.2's one-in-four
non-93 reserve is satisfied and then some — of the six commits before this one, **four were not item
93** (the archive pass, the measurement-check fix, and two UIUX/ runs), so continuing the tranche is
the backlog's own instruction rather than a note chain. `HEAD` `6e08bd0` at start and at commit;
`UIUX/` and `drafts/` stayed untracked and unread. Owner-tree fingerprint at start:
**`c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`** (0 tracked modified, 52
untracked).

#### Step 3.5 — the premise reproduced exactly, and one figure in it had already drifted

The previous run pre-computed this tranche. **Every figure it queued reproduced to six decimals**:
`ja` reference **0.495189**, threshold **0.346633**, headline **58** (`es` 12, `ko` 12, `zh` 12,
`ja` 22), `ja` **31 `en=2445 ja=258 ratio=0.105521`**, **32 `en=3777 ja=519 ratio=0.137411`**,
ceilings **1,210** and **1,870**, p90 index 35 pointing at **lesson 27 at 0.495189**, nearest clear
`ja` lesson **16 at 0.3784, margin 0.0318**.

**The one correction: the `ja` band median is 0.4878, not the 0.4909 the item still quotes.** It
moved because 29 and 30 landed at 0.4513 and 0.4693 — *below* the old median — so translating
lessons pulls the median of the clear set down even while the reference holds still. Nothing
downstream depended on it (the ceilings are set by the p90 *element*, not the median), but the
"0.0043 under the p90 element" caveat the previous run wrote is now **0.0074**, i.e. slightly less
tight than recorded. The band bullet's advice is unchanged; only the number moved.

**Controls, three of them, each proven able to fail.** (a) A **100-character probe** injected into
`ja` 31's takeaway moved that lesson `258 -> 358` and its ratio `0.1055 -> 0.1464` — **exactly
+100** — while `ja` 32 stayed at 519, proving the instrument is per-lesson and not aggregating.
(b) With the probe in place `npm test` **failed on §33** (`lesson 31 [ja] is now at 0.15, up from a
recorded 0.11`), proving the drift guard sees this surface. (c) The probe was reverted **from a
scratchpad copy, never `git checkout --`**, and the restored file's `shasum` matched the
pre-injection hash `c94c1816…` with `git status` clean before any real edit began. A fourth control
covered the *edit method*: these files are `JSON.stringify(v, null, 2)` under a hand-written header,
so a full parse-and-reserialize round-trip was checked to be **byte-identical to the file** before
any splice, and `git diff --stat` afterwards reported **9 insertions, 9 deletions in one file**.

#### The defect the previous run warned about is NOT in these two lessons, and that is worth recording

Item 93 records that `ko` 30 §1 and `ja` 30 §1 were **different content, not abridgements** — a
defect no ratio can see — and told this run to read 31 and 32 §1 before scoping. **Read, and both are
clean:** every `ja` section in 31 and 32 is a true abridgement of its English counterpart, in the
same order, dropping paragraphs rather than substituting content. `ja` 31 §1 carried English's second
paragraph and nothing else; §2 carried the good-debt/bad-debt shape with the `$15,000` figure and the
fourth paragraph gone. **Reporting the negative is the point** — a check that is only written up when
it fires looks, in the log, like a check that always fires.

#### What shipped

- **`ja` 31 (0.1055 -> 0.4585)** and **`ja` 32 (0.1374 -> 0.4451)** — full translations, **2,025
  added Japanese characters** against 6,222 English, i.e. **0.325 added characters per English
  character** (29/30 ran at 0.336).
- **Structural parity is exact:** sections en=ja on both; paragraphs **31 §1 3/3, §2 4/4; 32 §1 3/3,
  §2 3/3, §3 3/3**. The old stubs collapsed 31 §1 to 2 and §2 to 2, and 32 §2 to 2; 32 §3 looked
  full at three paragraphs but carried **234 characters against 1,493 English**, which is the reason
  paragraph count alone is not a completeness check.
- **Currency follows the file's own convention** — the myriad scale, no `$`: `$15,000 -> 1万5,000ドル`.
  Verified in the browser that the rendered page contains **zero `$`**.
- **The "Credit" cross-reference is `『信用』`**, matching this file's five existing `『』` title
  references rather than the one off-convention `「金利」` lesson 30 introduced. `『QE & QT』` in 32 §3
  was already correct and is preserved.

#### The figure multiset, every difference named

**`ja` 31 shows 3 differences, `ja` 32 shows 1.** All accounted:
- **31:** `15,000 -> 1万5,000` — a myriad-scale conversion, which removes `15,000` and contributes
  `1` and `5,000`. **Zero English figures dropped, zero added.**
- **32:** one extra `1`, from `1日に` ("a day") — a Japanese counter rendering an English *word*, not
  a figure. English's `5` and `8` each appear **three times on both sides** (`5-8年` x3).

#### The projection held a seventh time

Headline **58 -> 56**, exactly 2. Reference **0.495189 before and after**. Threshold **0.346633**.
Lesson 16's margin **0.0318**, unchanged. Both lessons landed below the p90 element, which is the
mechanism item 93 already identifies. Simulating the remaining `ja` 33-40 at 0.455 leaves the
reference at **0.495189**, the threshold at **0.346633** and `ja` abridged at **12** — so the
track-completion simulation still holds with two more real data points in it.

#### The correction this tranche produced: budget from a density predictor, not from a chosen target

29/30 picked a target ratio of 0.45-0.47 **by hand**, and its budget note honestly said the gap model
was "exact against the target actually chosen" — which is exact only in the sense that it re-derives
an input. There is a non-circular predictor available: **the ja:ko character ratio on the `ja`
lessons already fully translated** (29 `1088/1256 = 0.866`, 30 `1361/1609 = 0.846`), applied to
`ko`'s own full translation of the lesson being written. Computed **before drafting**, it predicted
**1,116-1,143** characters for 31 and **1,677-1,718** for 32. They landed at **1,121** and **1,681** —
inside both bands.

**It also earned its keep.** The first draft came in at **1,069** and **1,625** with complete clause
parity — nothing dropped. The per-section version of the predictor localized the shortfall to exactly
two sections, **31 §2 at 91% of predicted and 32 §1 at 86%**, and re-reading those two showed
telegraphic renderings of clauses that were all present (`新しい工場ができて数百人を雇った町を想像して
ください` for `Imagine a town where a new factory opens and hires hundreds of workers`). Rewriting
those two sections idiomatically, **adding no content**, closed the gap. **A ratio under the band is
a prompt to re-read for terseness; it is never a licence to pad**, and the two are distinguishable
only by clause-level comparison, which is what was done.

#### Verification

- **`npm test` exit 0, 0 failures**, the same 2 pre-existing warnings — and the completeness warning
  now reads **56** where it read 58.
- **`npm run build` clean** (882ms). **`npm run check-blindspot` 0 failures.**
- **`LAUNCH_READINESS.md` §10.4 was refreshed by its own guard, not by hand.** `npm test` failed
  first with `ja 44,661 (0.325x)`; `npm run readiness -- --write` moved it to **`ja 46,686
  (0.340x)`**. A `--word-diff` of that row shows **exactly one changed token pair** and nothing else.
- **The baseline moved exactly two pairs, both upward** — `31 ja 0.11 -> 0.46`, `32 ja 0.14 -> 0.45`,
  **2 insertions, 2 deletions**.
- **Every other economy lesson is byte-identical to `HEAD`**, proven by parsing both revisions and
  comparing objects, not by reading the diff: the only ids whose `ja` character count changed are
  **31 and 32**.
- **The review ledger correctly did NOT move** (`npm run review-status` unchanged, no ledger file in
  `git status`). It fingerprints the **English** body; no pair was marked reviewed for being
  translated.
- **Live browser**, rebuilt `dist/` served on `127.0.0.1:8842`, 375x812 mobile, language switched
  through the app's own `<select>` with a real `change` event. Lesson 31: **all 17 named probes
  present**, 1,236 Japanese glyphs, zero `$`. Lesson 32: **all 21 named probes present**, 1,795
  Japanese glyphs, `『信用』` and `『QE & QT』` both rendered. **Each reading asserted single-language:**
  the only Latin runs of 4+ characters on either page are the picker's own `English`/`Espa`/`Beta`.
  **English re-checked as a control** — switched back through the same `<select>`, lesson 32 renders
  its English intact (4,583 characters, all 9 probes) with **5 Japanese glyphs, all 5 the picker's
  `中文日本語`**. Dark scheme asserted by reading the computed background, `rgb(20, 18, 15)`. Console
  clean, `localStorage` cleared, server stopped and confirmed unreachable.
- **Two instrument faults caught by the controls rather than by luck, and both would have produced a
  confident wrong reading.** (1) Seeding the language via `localStorage.setItem('ecycles_lang',
  JSON.stringify('ja'))` silently did nothing — the app stores the raw string `ja`, not `"ja"` — so
  the first probe run reported **all 15 Japanese probes missing** on a page that was simply still in
  English. The English words visible in the same reading are what exposed it. (2) Three English
  control probes "failed" because I typed curly apostrophes; the body uses straight ones, and the
  page contains **no `’` at all**. Neither was a content defect, and neither would have been
  distinguishable from one without a control that names what it expects to see.

#### Adversarial self-check (step 5)

- **Blindspot register — one hit investigated and cleared.** §10.2: `dalio|principles` on added lines
  **0** (with a probe control proving the grep fires). §10.1: 0 advice-adjacent matches on added
  lines across both Japanese and English patterns, and `check-blindspot` clean on its per-language
  `ja` pass. §10.3: 0 kids-surface matches. **§2.3 looked like a hit — eight `2026` matches on added
  lines — and it is a context artifact.** All eight are in `LAUNCH_READINESS.md`'s §10.4 row, which
  is one 3,000-character line, so a line-level diff reprints the whole row; the **removed** line
  carries the same eight, and the `--word-diff` above shows the only real change is the `ja` volume
  figure. **The content file itself contains zero four-digit years on added lines** — its only digits
  are `1`, `5`, `5,000` and `8`, exactly the accounted multiset.
- **`DECISIONS.md` conflict** — none. Content stays in `.js` modules; no state, routing or build
  change; the machine-translation entry's option (a) covers adding AI translation under "(Beta)".
  **The O-3 flag applies and is restated below rather than quietly omitted.**
- **Already-done backlog item** — no. Item 93 records `ja` 31 and 32 as abridged at 0.11 and 0.14,
  and the byte-identity proof above shows nothing else was touched or undone.
- **Own verification claim** — reproducible; every figure above is a pasted command output. **What
  the check caught in my own work:** the `2026` hit, which read as a §2.3 regression until it was
  localized per file and per diff side; and the band-median figure, which I nearly carried forward
  from the item's text (0.4909) instead of re-measuring it (0.4878).

#### O-3, restated because this run is exactly what it is about

This run added **2,025 characters of unreviewed machine translation** in a "(Beta)"-labeled language.
**No fluent Japanese reviewer has read either lesson, and none has read any of the four `ja` economy
lessons now translated.** Human review share is **0% in all four languages**. That is consistent with
the owner's 2026-08-11 decision and it is still the thing the owner should either re-affirm or cap.

#### Next

**`ja` economy 33-34**, the third of six tranches. Pre-measured this run: **33 is `en=3654
ratio=0.1412`, ceiling 1,809 characters**; **34 is `en=4167 ratio=0.1260`, ceiling 2,063**. Both
stubs sit far below the p90 element, so **the two are independent and may be written in either
order**. **Budget with the density predictor, not a chosen target** — `ko`'s full 33 is 1,958
characters and 34 is 2,224, so at the measured ja:ko density of 0.856 a full `ja` 33 is **~1,676
(ratio 0.459)** and 34 **~1,904 (ratio 0.457)**, i.e. roughly **2,540 added characters** for the
pair. Both land ~150-350 characters under their ceilings, so neither should move the reference;
**predict the headline (56 -> 54), not the reference.** **Read both §1s before translating** — 30's
substituted-content defect has appeared in two of four languages and 31/32 were clean, so the base
rate is real but not universal, and only reading settles it. Remaining after 33-34: **`ja` 35-40**,
21,410 English characters, ~7,000 Japanese over three runs.
**W-5.6 remains open and unclaimed** — `LAUNCH_READINESS.md` §10.4's *narrative* still frames the
volume ratios as undifferentiated maintenance debt with no per-language reference; this run refreshed
only the generated figure the guard enforces. **W-5.4** (run-log entries at `##` instead of `###`,
across two files) is also still open; this entry is written at `###`.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-23 (scheduled dev-agent) — `ja` economy 33-34: the bare-list defect in a fourth language, and where the density predictor breaks

**Picked:** W-5.1 step 2, third `ja` tranche (item 93) — the item the previous run queued, and the
owner asked for it directly. W-5.2's one-in-four non-93 reserve remains satisfied: of the six commits
before this one, **three were not item 93**. `HEAD` `eac087a` at start and at commit; `UIUX/` and
`drafts/` stayed untracked and unread. Owner-tree at start:
**`c2331799fd3ee413aca864fd82d247a35ea31b01a70a6c4e37b00f6aad9105b2`** (0 tracked modified).

#### Step 3.5 — every queued figure reproduced

Reference **0.495189**, threshold **0.346633**, headline **56** (`es` 12, `ko` 12, `zh` 12, `ja` 20),
**33 `en=3654 ja=516 ratio=0.141215`**, **34 `en=4167 ja=525 ratio=0.125990`**, ceilings **1,809** and
**2,063**, p90 index 35 at **lesson 27 / 0.495189**, lesson 16 margin **0.0318**. Nothing to correct
this time — the previous run's queued note was accurate in every particular.

**Controls, deliberately varied from last run's so a pass could not be vacuous.** (a) A **150**-character
probe (not 100) injected into **`ja` 34 §1's body** (not a takeaway) moved that lesson `525 -> 675`,
**exactly +150**, while `ja` 33 held at 516 — per-lesson, not aggregating. (b) `npm test` then **failed
on §33** (`lesson 34 [ja] is now at 0.16, up from a recorded 0.13`). (c) Restored **from a scratchpad
copy, never `git checkout --`**, `shasum` matching `e6eceb45…` with `git status` clean before any real
edit. (d) The parse-and-reserialize round-trip was asserted **byte-identical** before the splice.

#### Both lessons read before scoping, and the defect they carry is the one this item was filed on

Item 93's substitution defect (`ko` 30 / `ja` 30: different content, not an abridgement) is **not**
present in 33 or 34 — both are true abridgements in English's own order. **Running tally: 1 of 6 `ja`
economy lessons read so far carried it.** What 34 carries instead is worse and more familiar:

**`ja` 34 §1 was the bare-list defect — the `es` 40 shape this whole item was filed on, in a fourth
language.** English is five blocks: an intro plus four numbered levers, each with a worked example (a
city laying off workers and shrinking its own tax base; a bank writing off loans it knows won't be
repaid; tax-and-transfer and the social tension it raises; the central bank refilling the well that
austerity just drained). The Japanese was **four bare headings on four lines in a single block — 87
characters against 1,257 English, a ratio of 0.069**. Not a translation of the lesson; a table of
contents for it. `ja` 33 §3 and 34 §3 were each **one paragraph against three and four**.

#### What shipped

- **`ja` 33 (0.1412 -> 0.4753)** and **`ja` 34 (0.1260 -> 0.4600)** — full translations, **2,613
  added Japanese characters** against 7,821 English = **0.334/char**, against 0.336 (29/30) and
  0.325 (31/32). **Three tranches inside 0.011 of each other**, which makes `ja` the first track
  whose per-character rate is actually stable enough to budget with.
- **Structural parity exact:** sections en=ja on both; paragraphs **33 §1 4/4, §2 4/4, §3 3/3; 34 §1
  5/5, §2 4/4, §3 4/4**. The five-block shape of 34 §1 is the fix.
- **Cross-reference `『短期債務サイクル』`** in 33 §1, following the file's `『』` title convention;
  `「失われた10年」` in 34 §2 stays in `「」`, correctly — it is a quoted term, not a lesson title.

#### The figure multiset, and a tokenizer artifact caught by re-running it

First pass reported **5 differences on 33** — including `2008,` vs `2008` and `1989,` vs `1989`. Those
are **my regex capturing English's trailing commas**, not content. Re-run with a comma-aware tokenizer:
**zero English figures dropped in either lesson**, and the only additions are **three `10`s**, all
rendering English *words* — `for a decade` (33 §1), `roughly a decade` and `the 'lost decade'` (34 §2).
**Year provenance checked separately and every year in the new Japanese appears in the English**:
33 `1929/1989/2008`, 34 `1920/1930/1980/2008/2015`. 34 gained `1920` and `1930` because the stub had
dropped the Weimar/Depression paragraph entirely. **No current-looking date; no `2026` anywhere.**

#### The projection held an eighth time

Headline **56 -> 54**, exactly 2. Reference **0.495189 before and after**. Threshold **0.346633**.
Lesson 16 margin **0.0318**, unchanged.

#### Where the density predictor breaks — the correction this tranche produced

The predictor (ja:ko character density on already-translated `ja` lessons, applied to `ko`'s full
translation) was **0.8459-0.8662, mean 0.8524** on four data points. It called **34 at 1,881-1,927**
and 34 landed at **1,917 — inside**. It called **33 at 1,656-1,696** and 33's first draft came in at
**1,779, 5% above the band**.

**The check for added sentences came back clean** — paragraph counts exact, figure multiset accounted,
no English clause absent. **The mechanism is register, not padding.** Lesson 33 §3 is the most
*discursive* prose in the economy track: the living-memory argument, no worked example, no figures.
It came in at **110%** of predicted; §1, which is narrative, at **107%**; the narrative-heavy lesson 34
averaged **101%**. Japanese renders abstract discursive English less compactly than narrative English,
and the predictor has no term for that. **So a 5-10% overshoot on a discursive section is expected;
the "check for added sentences" alarm should fire on the *shape* of an overshoot, not its bare size.**

33 was then brought to **1,737 (0.4753)** by **eight function-word compressions worth 42 characters**,
with **paragraph counts and figure multiset identical before and after and no clause dropped**. That
was done for **ceiling margin** — the first draft sat **30 characters** under 33's 1,809 ceiling, too
close to be safe — **not to make the predictor look right**. Compressing to hit a predicted number
would be the same defect class as validating a model on its own output, which the `zh` 39-40 run
already had to correct once.

#### Verification

- **`npm test` exit 0, 0 failures**, same 2 pre-existing warnings; the completeness warning now reads
  **54** where it read 56. **`npm run build` clean** (910ms). **`check-blindspot` 0 failures.**
- **`LAUNCH_READINESS.md` §10.4 refreshed by its own guard**, `ja 46,686 (0.340x) -> 49,299 (0.359x)`;
  `--word-diff` shows **exactly one changed token pair**.
- **Baseline moved exactly two pairs upward** (`33 ja 0.14 -> 0.48`, `34 ja 0.13 -> 0.46`), 2
  insertions / 2 deletions.
- **Every other economy lesson byte-identical to `HEAD`**, proven by parsing both revisions and
  comparing objects: the only changed ids are **33 and 34**.
- **Review ledger correctly did NOT move** — it fingerprints the English body.
- **Live browser**, rebuilt `dist/` on `127.0.0.1:8853`, 375x812 mobile, language switched through the
  app's own `<select>`. Lesson 33: **all 19 named probes present**, 1,872 Japanese glyphs. Lesson 34:
  **all 24 present**, 2,035 glyphs. Only Latin runs of 4+ characters on either page are the picker's
  `English`/`Espa`/`Beta`. **English control** — switched back, lesson 34 renders its English intact
  (5,121 characters, all 9 probes, **5 Japanese glyphs, all 5 the picker's `中文日本語`**). Background
  read as `rgb(20, 18, 15)`. Console clean, `localStorage` cleared, server stopped and confirmed
  unreachable.
- **The rendered five-block structure was verified, not assumed — and my first probe for it was
  wrong.** Looking for four `<p>` elements starting `1. `…`4. ` returned **empty**, which reads
  exactly like the bare-list defect surviving. It is not: the reader renders each section body as **a
  single `<p>` with `white-space: pre-line`**, so the blank lines are real paragraph breaks inside one
  element. Confirmed by reading the computed style and counting **4 blank-line separations → 5
  blocks**, and by the screenshot, which shows the four levers as four separate explained paragraphs.

#### Adversarial self-check (step 5)

- **Blindspot register — clean, with probe controls proving each grep fires.** §10.2 `dalio|principles`
  on added content lines **0**. §10.1 **0** advice-adjacent matches across Japanese and English
  patterns; `check-blindspot`'s per-language `ja` pass clean. §10.3 **0**. §2.3: three `20xx` matches
  on added content lines (`2008` x2, `2015`) — **all historical, all present in the English source**,
  verified by extracting years from both sides rather than by eye. **What the check caught in my own
  work here:** my first year-provenance script used `\b` word boundaries, which do not exist between
  CJK characters, so it reported `ja` 33 as having *no* years at HEAD when its stub plainly read
  `米国2008年`. Re-run without `\b`; the conclusion held but the first evidence for it was worthless.
- **`DECISIONS.md` conflict** — none. `.js` content modules, no state/routing/build change, and the
  machine-translation entry's option (a) covers this. **O-3 restated below.**
- **Already-done backlog item** — no. Item 93 records 33 and 34 as abridged at 0.14 and 0.13; the
  byte-identity proof shows nothing else was touched.
- **Own verification claim** — reproducible; every figure is pasted command output. Two of my own
  instruments were wrong before they were right (the comma-greedy figure tokenizer, the `\b` year
  regex) and a third probe (the `<p>`-per-paragraph check) looked for a DOM shape the app does not
  use. **All three were caught by controls or by cross-checking, and all three would have produced a
  confident wrong sentence in this entry.**

#### O-3, restated

This run added **2,613 characters of unreviewed machine translation** in a "(Beta)"-labeled language.
**No fluent Japanese reviewer has read either lesson, nor any of the six `ja` economy lessons now
translated.** Human review share is **0% in all four languages**. Consistent with the owner's
2026-08-11 decision, and still the thing to either re-affirm or cap.

#### Next

**`ja` economy 35-36**, the fourth of six tranches. Pre-measured: **35 is `en=3928 ratio=0.1329`,
ceiling 1,945**; **36 is `en=4546 ratio=0.1542`, ceiling 2,251**. Both stubs sit far below the p90
element, so the two are independent.
**⚠️ Budget with the PRE-33 density band (0.8459-0.8662), not the six-lesson one.** Lesson 33 landed at
**0.887** and widens the six-point band to 0.8459-0.8871, mean 0.8598 — but 33 is the discursive
outlier described above, and folding it in pushes the predicted upper bound uncomfortably near both
ceilings (35 predicted up to 2,205 against a 2,251 ceiling; 36 up to 1,899 against 1,945). Using the
four-point band: **35 ≈ 1,811-1,854 characters (ratio ~0.46-0.47), 36 ≈ 2,103-2,153**, i.e. roughly
**2,600 added** for the pair, with **~90-140 characters of ceiling margin each**. **If a draft lands
within 50 characters of its ceiling, compress before recording** — 33 needed exactly that.
**Read both §1s first.** Also note **`ja` 35 §2 already contains `「FRBに逆らうな。」`** and 35 §3 two
`『経済指標を読む』` references — preserve them; they are correct as they stand.
**W-5.6 remains open and unclaimed** (§10.4's *narrative*, not the generated figure this run
refreshed). **W-5.4** is also still open; this entry is written at `###`.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-23 (scheduled dev-agent) — W-5.6: §10.4 stops calling the translation gap "maintenance debt", and the two instruments turn out to measure different corpora

**Why this item and not `ja` 35-36.** W-5.2 reserves **one run in four** for work that is not item 93.
The last non-93 run was the touch-targets commit (`ee570bf`); since then `ja` 29-30, 31-32 and 33-34 ran
back to back. This is the fourth, so it took from W-5.2's list. Between the two documentation-integrity
defects on that list, **W-5.6 over W-5.4**: W-5.4's stated risk is latent — I confirmed only
`check-backlog.mjs` bounds a section with `^## ` (`scripts/check-backlog.mjs:44-45`) and it is currently
bounded correctly by `## Environment note`, so nothing is broken today. W-5.6 changes a row the owner
actually reads, and it is the row they would read to decide **O-3**.

**Step 3.5 — premise re-measured, with controls. Three corrections, one of which killed part of the item.**

- **W-5.6's own premise: HOLDS.** Header read `Last refreshed: 2026-08-16`; §10.4's closing clause read
  *"still real ongoing maintenance debt … not a decision left to make, just a cost to keep tracking."*
  Both confirmed verbatim before editing.
- **Correction 1 — W-5.5 was already done, and is still listed as open.** The item-93 headline reads
  **"54 of 160"**, which is exactly what `npm run translation-completeness` reports. But item 93's
  **stop-line box** had drifted to **56** while the headline was right — the box's own warning
  (*"the box and the headline are two places … update both or neither"*) firing a second time, against
  the rule written to prevent it. Fixed both, and widened the standing rule to name the box explicitly.
  Also corrected the parenthetical's `ja` state (`29-30 landed, 24 -> 22`) to the true `29-34 landed,
  24 -> 18`.
- **Correction 2 — the "the build guards this" comments look contradictory and both are true.**
  `LAUNCH_READINESS.md`'s "How to refresh" says the build fails if §10.4's character sentence disagrees
  with content; `check-data.mjs:693` says character counts are **deliberately not guarded** ("a build
  that fails over 19 characters would be turned off within a week"). **Different guards:**
  `refresh-readiness.mjs --check` owns the character sentence, `check-data.mjs` §11b owns the coverage
  percentages. I nearly wrote this up as a defect. It is not one.
- **Correction 3, the substantive one — the two translation instruments report different English
  corpora.** `npm run readiness` says **137,249** English characters; `npm run translation-completeness`
  says **140,700**. Same content, 3,451 apart. **Cause, computed rather than guessed:**
  `refresh-readiness.mjs:114-117` counts `section.body` + `takeaway` + `thinkAbout`;
  `translation-completeness.mjs:82-86` also counts `section.heading`. Direct computation over
  `lessonContent.js` with **three controls, all PASS**: bodies-only en = **137,249** (matches
  refresh-readiness exactly), bodies+headings en = **140,700** (matches completeness exactly), and the
  difference = **3,451 = the heading total exactly**. **The ratios survive the difference** — es 0.981 vs
  0.985, ko 0.469 vs 0.470, zh 0.294 vs 0.295, ja 0.359 vs 0.361 — which is *why* the two can be quoted in
  one row, and §10.4 now says so instead of leaving a reader to trip over two English totals.

**What shipped.** §10.4's closing clause now carries the three things that make its aggregate ratios
readable: the **per-language reference ratios** (each language's p90 across all 40 lessons — *what a full
translation looks like in this corpus* — `es 1.18, ko 0.55, zh 0.35, ja 0.50`, abridged below 0.7x its
own reference), the **abridged-pair count** (**54**: es 12, ko 12, zh 12, ja 18, across 18 of 40 lessons),
and the **concentration**, measured by joining the abridged pairs to `lessons.js` tracks:

- **48 of the 54 pairs are on the optional `essentials` track** (lessons 1-11, 14).
- **`money` is fully translated in all four languages — 0 abridged pairs.**
- **The only remaining `economy` main-path gap is `ja` 35-40 — six pairs.**

That last line is W-5.1's stop line restated as a measurement, which is the useful form for O-3: *the main
path is one language and six lessons from complete; the optional track is about four-fifths absent in
every language.* Header moved 2026-08-16 → 2026-08-23, scoped to say this pass changed one row's
narrative and no generated figure.

**Verification.** `npm test` — **0 failures, 2 expected warnings**; its own translation warning
independently reports **"54 of 160 … (18 lessons affected)"**, matching the numbers I published without
my having supplied them. `npm run build` ✅ (952 ms). `check-backlog.mjs` still parses the backlog after
my edits inside it ("no duplicate backlog item numbers (70 items)", "all 118 citations resolve"), and
refresh-readiness reports "12 generated figures … agree with the content" — i.e. I did not hand-edit a
generated sentence. §10.4 verified to still be a **single table row** (one line, 4,608 chars, closing `|`).
**Control for that last claim, because "I didn't touch the guarded sentence" is exactly the kind of thing
that is asserted rather than shown:** I corrupted `es 134,697` → `134,698` in place; the guard **failed
with the exact replacement string**; restoring from a scratchpad copy (not `git checkout --`) returned the
file **byte-identical, 20,576 = 20,576**, and the guard passed again. **A control that came back WEAK and
was redesigned:** my first sensitivity probe for the track join tested a numeric-vs-string key lookup that
succeeds either way, proving nothing; the replacement injects a nonexistent lesson id **999** and confirms
it lands in `UNKNOWN`, so the 48/6 split rests on an instrument shown able to fail.

**Step 5 — adversarial self-check.**
- **Blindspot register** — no regression. No Dalio reference, no advice-adjacent language (the added prose
  is about character counts and track membership, not markets), no child-facing kids framing. The dates I
  added are in **documentation**, which §2.3 is not about — its rule covers teaching-copy modules, and
  `check-blindspot` confirms "§2.3 no live-looking dates in 26 teaching-copy modules" still passes.
- **`DECISIONS.md` conflict** — none. No state, routing, build or content-format change. The 2026-08-11
  machine-translation decision is untouched; this run supplies the measurement the owner would use to
  re-affirm or cap it, which is O-3's ask, not a reversal of it.
- **Already-done backlog item** — **this check fired for real.** W-5.5 was on my candidate list and is
  already complete; I recorded that and fixed the residual box drift instead of redoing the headline.
- **Own verification claim** — reproducible from pasted command output (`npm test`, `npm run build`,
  `npm run readiness`, `npm run translation-completeness`). The one figure not printed by an existing
  script — the 48/6 track split — is computed by a scratchpad script whose control is described above.

#### O-3, restated

This run added **no translation**. It did measure the thing O-3 asks the owner to decide about, and the
measurement is now in the document the decision would be made from: **human review share remains 0% in
all four languages**, and the remaining machine-translated backlog is **54 pairs, 48 of them on the
optional track**. Unchanged: the owner should either re-affirm the 2026-08-11 decision or cap it.

#### Next

**`ja` economy 35-36** — resume item 93; the `ja` 33-34 entry above pre-measured both lessons (35 is
`en=3928 ratio=0.1329`, ceiling 1,945; 36 is `en=4546 ratio=0.1542`, ceiling 2,251) and warns to budget
with the **pre-33 density band (0.8459-0.8662)**, not the six-lesson one. That note stands unchanged; read
it before starting. **Per the rule widened this run, that tranche updates BOTH item 93's headline and its
stop-line box** from `npm run translation-completeness`.
**W-5.4 remains open and is now the only unclaimed item in the W-5 housekeeping set** — 37 `##` run
entries to demote to `###` (6 live + 31 in the archive; re-measured this run and the count is exact,
189 `###` already correct in the archive). This entry is written at `###`.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-23 (scheduled dev-agent) — `ja` economy 35-36, a defect shape the bare-list rule does not cover, and a comparator that was reporting phantom differences

**Why this item.** W-5.2 reserves one run in four for work that is not item 93; the previous run
(`2aba2a5`, W-5.6) was that run, so this one resumes the tranche. The `ja` 33-34 entry pre-measured
both lessons and the W-5.6 entry re-queued them; that note was followed as written.

**Step 3.5 — every queued figure reproduced exactly, and the controls fired.**

- `npm run translation-completeness`: headline **54** (`es 12 / ko 12 / zh 12 / ja 18`) — matches the
  item's headline and its stop-line box, which the previous run reconciled.
- **35 `en=3928 ratio=0.1329`, ceiling 1,945; 36 `en=4546 ratio=0.1542`, ceiling 2,251** — all four
  figures reproduced to the character against the queued note.
- **Pre-33 density band 0.8459-0.8662** reproduced; it predicts **35 at 1,811-1,855** and **36 at
  2,103-2,153**, which is the queued note's own band (its "1,854" is a rounding of 1,855).
- **CONTROL, and it fired:** injecting 1,300 filler characters into `ja` 35 §1 moved the measured
  ratio **0.1329 -> 0.4638**, cleared the abridged flag, and dropped the `ja` count 18 -> 17 by
  exactly one. A negative result from this instrument would therefore have meant something.
- **CONTROL on the figure comparator, and it fired:** injecting `9999年` into `ja` 35 §1 moved its
  figure count 2 -> 3.
- **Both §1s read against the English before writing.** Both are true abridgements in the same order
  — no substituted content. Running tally: **1 of 8** `ja` economy lessons carried the lesson-30
  substitution defect.

**What shipped.** `ja` 35 **522 -> 1,832 characters (0.1329 -> 0.4664)** and `ja` 36 **701 -> 2,162
(0.1542 -> 0.4756)**; **2,771 added Japanese characters against 8,474 English = 0.327/char**.
Headline **54 -> 52**, `ja` abridged **18 -> 16**, `ja` volume **0.359x -> 0.379x** of English.
Preserved as instructed and verified rendered: `ja` 35 §2's `「FRBに逆らうな。」`, both of §3's
`『経済指標を読む』`, and §1's new cross-reference written `『短期債務サイクル』` to the file's majority
convention. `ja` 36 §3's `「タームプレミアム」` and §2's `「2s10s」` likewise stand.

**The finding this tranche produced, and it is a defect shape the item did not have a name for.**
`ja` 36 §1 was **109 characters against 1,341 English**, and the missing content is not evenly thinned:
English names **four** curve shapes (NORMAL, FLAT, INVERTED, STEEP) after a lending-to-a-friend
analogy, and **the Japanese carried only two of them** — `正常` and `逆転`. FLAT, STEEP and the analogy
were absent altogether. That is **not** the bare-list defect this item was filed on (`es` 40, `ja` 34
§1), where every list member is present as a bare heading with its explanation stripped. It is
**partial enumeration**: the list survives, two of its four members do not, and a reader finishes the
section believing the yield curve has two shapes. **No ratio, and no structural check in
`check-data.mjs`, can see the difference** — which is why this item keeps insisting the English be
read alongside. Filed in item 93 with a note to check `es`/`ko`/`zh` 36 §1 when `essentials` is scoped.

**A second correction, to the acceptance test itself.** The figure-multiset comparator reported four
differences on lesson 36 and **three of them were artifacts of the tokenizer, not of the translation**:
`/\d[\d,.]*/g` captures English's trailing ASCII `2,` `2022.` `2024,` while Japanese's `、` and `。`
are never captured. Stripping `[.,]+$` per token leaves exactly **one** real difference, and it is the
class this item already names — English writes *"roughly two years"* as a **word**, Japanese as
`およそ2年間`. **Lesson 35 is an exact multiset with no adjustment at all.** Recorded in item 93 so the
next run does not re-derive it or, worse, weaken the comparator to make the phantoms go away.

**A third correction: the overshoot rule was too narrow.** The 33-34 run attributed lesson 33's 5%
overshoot to *discursive* register. Lesson 36 §1 overshot by the same margin and is the opposite of
discursive — it is enumerated. **Localised, not assumed:** in the same lesson §2 landed **566** against
a predicted 554-567 and §3 **763** against 744-762, both in band, so the overshoot sits in §1 alone.
The mechanism (Japanese restating each list member with a fuller connective) is recorded in item 93
**as a hypothesis**; the measurement is what the rule now rests on.

**The compression, and why it happened.** 36's first draft was **2,206 — 50 characters over the band
and 45 from its 2,251 ceiling**, inside the "compress before recording" line the 33-34 run wrote.
Two passes of function-word compression brought it to **2,162** (ceiling margin **89**). Verified
before and after: **paragraph counts identical (5/3/4, matching English exactly), figure multiset
identical, no clause dropped.** This was done for ceiling margin, per the standing rule — **not** to
make the predictor look right, which the item forbids.

**The projection held a ninth time, and the reference did not move.** `ja` reference **0.4951894
before and after**, threshold **0.3466**, headline down by **exactly 2**, no collateral lesson
crossing. Lesson 35 landed at **1,832 inside its predicted 1,813-1,855**; lesson 36 at **2,162**, six
characters over its 2,107-2,156 band (+0.28%). Both sit below the p90 element (lesson 27 at 0.4952),
which is why the reference stayed asleep — the condition this item identified for `ja`.

**A tooling note that will happen again, and a guard that earned its keep.** The **per-language**
content files store `body` as a **plain string**; only the aggregated `lessonContent.js` exposes
`body.ja`. My first edit script read `sections[i].body.ja` — `undefined` — so `JSON.stringify(undefined)`
returned `undefined` and `text.split(undefined)` found **zero** occurrences. **The occurrence-count
guard threw instead of writing the file unchanged and reporting success**, which is exactly the
silent-no-op failure mode step 3.5 exists to prevent. Keep the `if (count !== 1) throw` in every
string-replacement script, alongside the existing `s.replace(old, () => new)` note.

**Verification.** `npm test` — **PASS, 0 failures, 2 expected warnings**. §33 first **failed on both
lessons** ("is now at 0.47, up from a recorded 0.13 … re-record it"), which is the guard working;
re-recorded with `npm run translation-completeness -- --write`. `refresh-readiness.mjs --check` then
failed on §10.4's character sentence and was refreshed with `npm run readiness -- --write` — **`ja`
49,299 -> 52,070, a delta of exactly 2,771**, independently confirming the added-character count from
a second instrument I did not supply the number to. `npm run build` ✅ (913 ms).
**Live browser verification (W-1), served from `dist/` via `python3 -m http.server`:** language
switched to `ja`, lessons 35 and 36 opened at `#/lesson/35` and `#/lesson/36`. **Control on every
assertion — the English string was confirmed *absent* before the Japanese was confirmed present**, so
a false positive from a stale render was ruled out. `ja` 36 §1 renders as **5 paragraphs**
(`white-space: pre-line`, 4 blank-line breaks) matching English's 5 blocks, with all four curve shapes
present; `ja` 35 §1 renders as **3 paragraphs** with the arrow lines intact and both
`『経済指標を読む』` references live. Screenshotted.

**Step 5 — adversarial self-check.**
- **Blindspot register** — no regression, checked rather than assumed: `npm run check-blindspot`
  passes with **§10.2 no Dalio references**, **§10.1 no advice-adjacent language in en/es/ko/zh/ja**,
  **§10.3** intact, and **§2.3 no live-looking dates in 26 teaching-copy modules** — the last one
  matters here because both lessons carry years (1955, 1966, 1980s, 2022, 2024). Every one of them is
  historical and present in the English source; nothing was added that reads as current.
  §10.1 specifically: `「FRBに逆らうな。」` is pre-existing and is framed exactly as English frames it —
  an informal rule investors *cite*, with the historical coincidence stated, not a recommendation.
- **`DECISIONS.md` conflict** — none. No state, routing, build or content-format change; `.js` content
  modules unchanged in form. The 2026-08-11 "(Beta)" machine-translation decision is honored, and the
  volume this run adds is exactly what **O-3** asks the owner to re-affirm or cap.
- **Already-done backlog item** — no. `ja` 35-36 is the queued step of the W-5.1 stop line; 29-34 are
  done and were not touched.
- **Own verification claim** — reproducible from the pasted output of `npm test`, `npm run build`,
  `npm run translation-completeness` and `npm run readiness`. The two figures no existing script
  prints — the density band and the per-section budget — come from scratchpad scripts whose controls
  are described above, and the 2,771 delta is corroborated by `readiness`, a second instrument.

#### O-3, restated because this run is exactly what it is about

This run added **2,771 characters of unreviewed machine-translated Japanese**. Human review share
remains **0% in all four languages**; `npm test`'s own warning reports **83% (0% human)** for each.
Remaining after this run: **52 pairs, 48 of them on the optional `essentials` track**. Unchanged: the
owner should either re-affirm the 2026-08-11 decision or cap it.

#### Next

**`ja` economy 37-38**, the fifth of six tranches. Pre-measured this run: **37 is `en=3360 ko=1807
ja=462 ratio=0.1375`, ceiling 1,664, predicted 1,528-1,565**; **38 is `en=3817 ko=1935 ja=411
ratio=0.1077`, ceiling 1,890, predicted 1,637-1,676** (pre-33 band 0.8459-0.8662; the eight-point band
is now 0.8459-0.8871, mean 0.8605 — 36 landed at 0.8697, above the pre-33 top, which is the overshoot
above, so **keep budgeting from the pre-33 band**). Margins are comfortable on both (~99 and ~214),
the widest of the track so far.
**Read both §1s first, and read them for partial enumeration, not just for thinness** — this run's
finding. **37 §1 is en 5 paragraphs against ja 2** and **38 §3 is en 4 paragraphs against ja 1 with
en=1,576 characters against ja=137**, the largest single section gap left in the track; expect
missing list members there, not merely compressed ones.
**Per the standing rule, that tranche updates BOTH item 93's headline and its stop-line box** from
`npm run translation-completeness`.
**W-5.4 remains open and is the only unclaimed item in the W-5 housekeeping set** — 37 `##` run
entries to demote to `###` (6 live + 31 archived). This entry is written at `###`.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).

### 2026-08-24 (scheduled dev-agent) — `ja` economy 37-38: the economy track's last full tranche, a whole-list omission, and where the density predictor has no precision at all

**Why this item.** W-5.1 step 2, fifth of six tranches. W-5.2 reserves one run in four for non-item-93
work; the run before last (`2aba2a5`, W-5.6) was that run, so the tranche continues. The `ja` 35-36
entry pre-measured both lessons and this run followed that note as written.

**Step 3.5 — every queued figure reproduced to the character, and both controls fired.**

- `npm run translation-completeness`: headline **52** (`es 12 / ko 12 / zh 12 / ja 16`) — matches the
  item's headline and its stop-line box, which the previous run reconciled.
- **37 `en=3360 ko=1807 ja=462 ratio=0.1375`, ceiling 1,663** and **38 `en=3817 ko=1935 ja=411
  ratio=0.1077`, ceiling 1,890** — all eight figures reproduced exactly against the queued note.
- **Pre-33 density band 0.8459-0.8662** reproduced; it predicts **37 at 1,528-1,565** and **38 at
  1,637-1,676**, which is the queued note's own band to the character.
- **CONTROL on the completeness instrument, and it fired:** injecting 1,320 filler characters into
  `ja` 37 §1 and `ja` 38 §3 moved the ratios **0.1375 -> 0.5304** and **0.1077 -> 0.4535**, cleared
  both abridged flags, and dropped the `ja` count **16 -> 14** by exactly 2. Restored from a scratchpad
  copy (never `git checkout --`) and verified byte-identical by `shasum` before any real edit.
- **CONTROL on the figure comparator, and it fired:** injecting `9999年` surfaced `9999` in the
  JA-only difference list for both lessons.
- **Both lessons read against the English before a word was written.** Neither carries the lesson-30
  substitution defect — both are true abridgements in the same order. **Running tally: 1 of 10** `ja`
  economy lessons carried substitution.

**The defect these two carried, and 37 §1 is a shape this item has not had a name for.** The item has
recorded the *bare-list* defect (every member present as a bare heading, explanations stripped —
`es` 40, `ja` 34 §1) and *partial enumeration* (some members simply absent — `ja` 36 §1). **`ja` 37 §1
is neither: the four-line QE1/QE2/QE3/COVID enumeration was absent in its entirety**, not thinned and
not partially present, alongside the rate-dial opening and the buying-pressure paragraph — 87
characters against 1,188 English. Call it **whole-list omission**. It matters separately from partial
enumeration because the two fail differently for a reader: partial enumeration leaves a reader
*confidently wrong* (the yield curve has two shapes), whole-list omission leaves them merely
*ignorant* that a list existed. Both are invisible to every ratio and every structural check in
`check-data.mjs`; only reading the English alongside finds either. **`ja` 38 §1 carried the partial
kind in the same run** — English names growth stocks, cyclical stocks **and real estate**, the
Japanese carried only the first two — and **38 §2 and §3 dropped all four asset lists and both S&P
figures outright** (§3 was 137 characters against 1,576 English, the largest single section gap in
the track).

**What shipped.** `ja` 37 **462 -> 1,518 characters (0.1375 -> 0.4518)** and `ja` 38 **411 -> 1,694
(0.1077 -> 0.4438)**; **2,339 added Japanese characters against 7,177 English = 0.326/char**.
Headline **52 -> 50**, `ja` abridged **16 -> 14**, `ja` volume **0.379x -> 0.396x** of English.
Paragraph counts now match English **exactly on all six sections** (37: 5/4/1, 38: 3/3/4), verified
rendered. Cross-references written `『金利』` and `『短期債務サイクル』` to the file's majority
convention; `「資産効果」` and the pre-existing Buffett quote `「他人が貪欲な時に恐れ、恐れている時に
貪欲になれ」` preserved verbatim.

**A terminology decision, recorded because there was no precedent to follow.** English "commodities"
appears **nowhere else in the corpus in any language** — grep across `src/content/` and `src/locales/`
returns zero hits for `コモディティ`, `一次産品` or `商品先物`. The first draft wrote `商品`, which in
Japanese reads as "merchandise" and would have taught the wrong word; both instances are now
`コモディティ`. Korean uses `원자재`. **This is the first ja/en term pair in the economy track with no
house convention, so it is written down here rather than left to the next run to re-decide.**

**The correction this tranche produced: the density predictor has a per-lesson precision that does
NOT extend to individual short fields, and the item was about to be used as though it did.** The
ja:ko predictor is quoted in this item at a ±1.2% spread (0.8459-0.8662 pre-33). **Measured across
the eight completed `ja` economy lessons, that spread is a whole-lesson property only:** sections-only
density runs **0.8432-0.8887** but `takeaway` alone runs **0.7431-0.8925** and `thinkAbout` alone
**0.8000-0.9558** — a spread ten times wider. The aggregates agree (sections 0.8626, short fields
0.8523), which is exactly why the noise is invisible until you look per-field. **Operationally: do
not read a short field's miss against its predicted band as a defect signal.** It caught something
real anyway — 38's first-draft takeaway sat at density **1.000**, above even the wide short-field
maximum, and re-reading found no added clause but genuine verbosity (`自分が` where Japanese needs no
subject); compressed to 0.924, inside the observed range, with all three English sentences intact.

**A negative result worth recording so the next run does not "fix" it.** `ja` 37's `takeaway` was
**already a complete translation** — 57 characters against a predicted 62-63, all three English
clauses present — and was left untouched. Same call the 35-36 run made on 35's `thinkAbout`. **Terse
is not abridged; the clause check settles it, not the ratio.** That single deliberate non-edit is most
of why 37 landed at **1,518 against a predicted 1,529-1,564** (11 under). §2 (343 against 343-351) and
§3 (485 against 482-493) were both clause-checked line by line against the English before being
accepted — every clause present, nothing telegraphic — so **nothing was padded to reach the band**,
which this item forbids.

**The figure multiset, every difference named — and lesson 38's English side is now exactly covered.**
Lesson 37 shows five EN-only tokens and seven JA-only; **all five are 兆/億 scale conversions** of the
kind this item already documents for `zh` 亿 (`$1.75 trillion` -> `1兆7500億ドル`, `$600 billion` ->
`6000億`, `$85B` -> `850億`, `$900 billion` -> `9000億`, `$95 billion` -> `950億`), and the sixth
JA-only token is English's **"nine times" written as a word** against `9倍`. Lesson 38's **EN-only list
is empty** — every English figure survives, including the `+14-28%`, `-22-35%` and `+38-50%` that were
absent before — and its four JA-only tokens are all English ordinals written as words (`a second`,
`a third` ×2, `the first year`) rendered as digits. **Zero unexplained differences in either lesson,
and the comparator was not weakened to get there.**

**The projection held a tenth time, and the reference stayed asleep as predicted.** `ja` reference
**0.4951894167167769 before and after**, threshold **0.346633**, headline down by **exactly 2**, no
collateral lesson crossing. Both lessons landed below the p90 element (lesson 27 at 0.4952) — 37 at
0.4518 and 38 at 0.4438 — which is the documented condition for the reference not moving. Note the
control run demonstrated the other branch: at 0.5304 the injected lesson 37 *did* move the reference
to 0.4969, so the instrument is capable of the move it declined to make.

**Verification.** `npm test` — **PASS, 0 failures, 2 expected warnings**. §33 first **failed on both
lessons** ("is now at 0.45, up from a recorded 0.14 … re-record it"), which is the guard working;
re-recorded with `npm run translation-completeness -- --write`. `refresh-readiness.mjs --check` then
failed on §10.4's character sentence and was refreshed with `npm run readiness -- --write` — **`ja`
52,070 -> 54,409, a delta of exactly 2,339**, independently confirming the added-character count from
a second instrument that was never given the number. `npm run build` ✅ (969 ms). Proved by direct
object comparison against `git cat-file blob HEAD:` that **only lessons 37 and 38 differ** in the file
and the lesson-id set is unchanged.
**Live browser verification (W-1), served from `dist/` via `python3 -m http.server`:** language
switched to `ja`, lessons opened at `#/lesson/37` and `#/lesson/38`. **Control on every assertion — the
English string was confirmed *absent* before the Japanese was confirmed present**, ruling out a stale
or English render. Both `EN_absent_*` probes returned false and all 26 Japanese probes true. Rendered
paragraph blocks measured off `white-space: pre-line` elements: **37 = 5/4/1 and 38 = 3/3/4, matching
English exactly**; the QE1-COVID list renders as its own block. Screenshotted.

**Also fixed in this commit, because this run is what made it stale.** `LAUNCH_READINESS.md` §10.4's
**prose** figures still read "54 abridged pairs — es 12, ko 12, zh 12, ja 18 … 48 of the 54 … the only
remaining gap on the `economy` main path is `ja` 35-40 — six pairs". `refresh-readiness.mjs` owns only
the *character* sentence (the W-5.6 run established this — two guards, different surfaces), so the
prose went stale when 35-36 landed and staler when 37-38 did. Now reads **50 pairs, `ja` 14, 14 of 40
lessons, 48 of the 50 on `essentials`, and `ja` 39-40 — two pairs** on the main path. **This is the
W-5.5 defect class in a third location:** the same count lives in the item headline, the stop-line box
*and* §10.4, and only two of the three were under a rule. §10.4 is now named in that rule below.

**Step 5 — adversarial self-check.**
- **Blindspot register** — no regression, checked rather than assumed: `npm run check-blindspot`
  passes with **§10.2 no Dalio references**, **§10.1 no advice-adjacent language in en/es/ko/zh/ja**,
  **§10.3** intact, and **§2.3 no live-looking dates in 26 teaching-copy modules** — which matters
  here because these two lessons are the most date- and figure-dense in the track (2008, 2010, 2012,
  2020, 2022, 2024). Every one is historical and present in the English source. **§10.1 deserves the
  specific note:** this tranche restored four *asset-class* lists, the most advice-adjacent surface in
  the app. Each is written as the English writes it — `この局面で歴史的に選好されてきた資産：` , a
  statement about what has happened, not what to do. No imperative form, no `べきです`, no `推奨`.
- **`DECISIONS.md` conflict** — none. No state, routing, build or content-format change; `.js` content
  modules unchanged in form. The 2026-08-11 "(Beta)" machine-translation decision is honored, and the
  volume this run adds is exactly what **O-3** asks the owner to re-affirm or cap.
- **Already-done backlog item** — no. `ja` 37-38 is the queued step of the W-5.1 stop line; 29-36 are
  done and were proven untouched by object comparison against `HEAD`, not by reading the diff.
- **Own verification claim** — reproducible from the pasted output of `npm test`, `npm run build`,
  `npm run translation-completeness`, `npm run readiness` and `npm run check-blindspot`. The three
  figures no existing script prints — the density band, the per-section budget and the short-field
  spread — come from scratchpad scripts whose controls are described above, and the 2,339 delta is
  corroborated by `readiness`, a second instrument.

#### O-3, restated because this run is exactly what it is about

This run added **2,339 characters of unreviewed machine-translated Japanese**. Human review share
remains **0% in all four languages**; `npm test`'s own warning reports **83% (0% human)** for each.
Remaining after this run: **50 pairs, 48 of them on the optional `essentials` track**. Unchanged: the
owner should either re-affirm the 2026-08-11 decision or cap it.

#### Next

**`ja` economy 39-40 — the last tranche of item 93's economy phase.** Pre-measured this run:
**39 is `en=3475 ko=2006 ja=383 ratio=0.1102`, ceiling 1,720, predicted 1,697-1,738**; **40 is
`en=2284 ko=1245 ja=240 ratio=0.1051`, ceiling 1,131, predicted 1,053-1,078** (margin 53).
**⚠️ LESSON 39 IS THE FIRST LESSON IN THE TRACK WHOSE PREDICTED BAND CROSSES ITS OWN CEILING — the top
of the band sits 18 characters ABOVE 1,720, not below it.** Every previous tranche had headroom (99
and 214 this run). Two consequences, and neither is a reason to under-translate: **(a)** budget 39 from
the *bottom* of the band and compress for ceiling margin as you draft, section by section — the
standing rule, and this is the run it was written for; **(b)** if 39 lands above 1,720 anyway with full
clause parity, **that is acceptable and it will move the `ja` reference**, because the lesson would
displace the p90 element (lesson 27 at 0.4952). **Predict the headline move, not the reference** — the
item's own rule, learned when `ko` 39 did exactly this. A headline drop of 2 is the operative
prediction either way; a drop of 1 means the model is wrong, so investigate rather than assume.
**Two standing warnings in item 93 both point at lesson 39 and both should be believed.** Its English
§1 is a **five-gauge dashboard in six paragraphs** (GDP, CPI, PMI, VIX, credit spreads under a
one-paragraph intro — six paragraphs, not six gauges), and **measured this run, `ja` 39 §1 is 46
characters against 1,523 English across 6 English paragraphs rendered as 1** — the same single line of
acronyms found in `es`, `ko` and `zh`, now confirmed rather than predicted. **§2 is the same shape**
(en 6 paragraphs, ja 1, 208 against 1,596). **`ja` 40 §1 is 82 characters against 1,056 across 4
English paragraphs rendered as 1**, which is the stub itself. **Lesson 39 lands at
the TOP of its language's band in all three languages that have finished it** — do not read that as
padding; check paragraph and figure parity and accept it. **`ja` 40 is the last surviving instance of
the three-bare-rule-headings stub this whole item was filed on** — read it first.
**Per the standing rule, that tranche updates item 93's headline, its stop-line box AND
`LAUNCH_READINESS.md` §10.4** — three places now, from `npm run translation-completeness`.
**After 39-40, close the economy phase** and file the `essentials` remainder (48 pairs) as a new,
separately-prioritized item — W-5.1 step 3. Do not roll it into 93 and keep going.
**W-5.4 remains open and is the only unclaimed item in the W-5 housekeeping set** — 37 `##` run
entries to demote to `###` (6 live + 31 archived). This entry is written at `###`.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account).
Owner-tree fingerprint observed this run: `f4e4f1dbe22649410d1db7c7bade2c9e14501ee8a6e589de98dea1b44b51197b`
(3 tracked modified — all mine — 52 untracked).

### 2026-08-24 (scheduled dev-agent) — `ja` economy 39-40: the economy phase closes in all five languages, and the ceiling that mattered for nine tranches turns out to be consequence-free

**Why this item.** W-5.1 step 2's sixth and final tranche, then step 3. W-5.2 reserves one run in
four for non-item-93 work; `2aba2a5` (W-5.6) was that run and two tranches have landed since, so the
tranche was free to continue — and this is the run that ends it rather than extending it.

**Step 3.5 — all eight queued figures reproduced to the character, and both controls fired.**

- `npm run translation-completeness`: headline **50** (`es 12 / ko 12 / zh 12 / ja 14`) — matches the
  item headline and its stop-line box.
- **39 `en=3475 ko=2006 ja=383 ratio=0.1102`, ceiling 1,720** and **40 `en=2284 ko=1245 ja=240
  ratio=0.1051`, ceiling 1,131** — all eight reproduced exactly. "Ceiling" confirmed as
  `en x reference` (3475 x 0.4951894 = 1720.8; 2284 x 0.4951894 = 1130.9), and the *floor* (the
  abridged threshold, `en x 0.7 x reference`) computed alongside it at **1,204.5** and **791.7**.
- **CONTROL on the completeness instrument, and it fired:** injecting 1,300/800 filler characters
  moved the ratios **0.1102 -> 0.4858** and **0.1051 -> 0.4553**, cleared both abridged flags, and
  dropped `ja` **14 -> 12** by exactly 2. Restored from a scratchpad copy (never `git checkout --`)
  and verified byte-identical by `shasum` (`d23097db…`) before any real edit.
- **CONTROL on the figure comparator, and it fired:** injecting `9999年` surfaced `9999` in the
  JA-only list for lesson 39.
- **Both lessons read against the English before a word was written.** Neither carries the lesson-30
  substitution defect. **Final tally: 1 of 12** `ja` economy lessons carried substitution.

**A premise correction that sharpens the queued warning rather than breaking it.** The queued note
warned that **39 is the first lesson in the track whose predicted band crosses its own ceiling — top
of band 18 characters above 1,720**. That figure is correct *for the pre-33 density band
(0.8459-0.8662)* it was computed from. **Re-fitted on all ten completed `ja` economy lessons (29-38),
the band is 0.8401-0.8871**, which predicts 39 at **1,685-1,780** — the top is **60** characters above
the ceiling, not 18 — and the **aggregate predictor (0.8607) lands at 1,727, itself 7 above the
ceiling.** So it was not merely the band's tail that crossed; the central estimate crossed too.

**And then the correction that actually matters: the ceiling is consequence-free, and has been all
along.** Nine tranches have budgeted carefully against the ceiling on the theory that a moving
reference raises the abridged threshold for every other lesson and could drag one under. **Simulated
this run across the entire band — 1,685 / 1,727 / 1,780, plus the bare floor at 1,210 — the outcome
is identical in every case:** headline **50 -> 48**, `ja` **14 -> 12**, abridged set exactly
`{1-11, 14}`, and **zero collateral crossings anywhere**. When the reference does move it goes
**0.4951894 -> 0.4968597**, lifting the threshold **0.346633 -> 0.347802** — and the nearest
non-abridged `ja` lesson (16, at 0.38) is nowhere near it. **Operationally: translate for clause
parity and stop budgeting against the ceiling.** The reference's move is bounded by wherever the next
p90 element sorts, which on a corpus this far along is a rounding error.

**An instrument that lied, caught by a control, and worth recording because the shell caused it.**
The first simulator run reported a confident `MOVED`, a full abridged list and a headline for **four
different inputs, all identical** — because `for n in "1685 1046"; do node sim.mjs "$PWD" $n` does
**not** word-split in zsh, so both arguments arrived as `NaN`, and `NaN` ratios sort into the p90
without erroring. It printed a plausible answer from no input at all. **The instrument now refuses to
print on non-finite args (exit 2), and its control is that it reproduces today's real state exactly
from the real inputs (383/240 -> reference UNMOVED, threshold 0.346633, 14 abridged, headline 50).**
This is the `git show | wc -l` failure class in a new costume: plausible output, no error, wrong.

**The defects these two carried.** `ja` 39 §1 was **46 characters against 1,523 English** — a single
line of five acronyms, the *bare-list* defect in its purest form (every gauge named, every
explanation and every threshold value stripped, plus the doctor analogy absent). §2 was **208 against
1,596**, one paragraph against six, mixing *partial enumeration* (CPI dropped from both the Expansion
and Peak gauge lists — a reader would learn the wrong number of gauges) with *whole-list omission*
(Contraction's five-gauge list absent entirely, rendered as "all indicators align downward") and a
missing closing paragraph and cross-reference. **`ja` 40 §1 was the last surviving instance of the
three-bare-rule-headings stub this whole item was filed on** — 82 characters against 1,056, three
rule statements with all four explanatory paragraphs and both cross-references gone; §2 was 65
against 922, dropping the second paragraph and every figure.

**What shipped.** `ja` 39 **383 -> 1,674 (0.1102 -> 0.4817)** and `ja` 40 **240 -> 1,047 (0.1051 ->
0.4584)**; **2,098 added Japanese characters against 5,759 English = 0.364/char**. Headline
**50 -> 48**, `ja` abridged **14 -> 12**, `ja` volume **0.396x -> 0.412x** of English. Paragraph
counts match English **exactly on all four sections** (39: 6/6, 40: 4/2), verified rendered.
Cross-references written `『経済サイクルの4つの局面』`, `『長期債務サイクル』`, `『生産性成長』`,
`『短期債務サイクル』`, `『取引』`, `『信用』` — the file's `『』` convention for lessons, with `「」`
reserved for terms, so `「恐怖指数」` (Fear Gauge) is quoted the other way on purpose.

**39 landed 9 characters below the band and was NOT padded — the clause check settles it.** All twelve
paragraphs were checked line by line against the English before being accepted: §1's six gauges carry
every threshold (`2％`, `50超`/`50未満`, `15未満`, `40超`) and the NBER qualifier; §2's four phases each
carry all five gauges, and the closing lag paragraph is present. Sections-only density came out
**0.8336 against a band of 0.8432-0.8887** — a 1.2% shortfall on a lesson that is unusually
list-dense, where Korean's inter-word spaces inflate the denominator. **Full clause parity plus a
below-band ratio means the band is wrong for this lesson, not that content is missing**, and the item
forbids padding to reach a band. The one field that *was* wrong went the other way: 39's first-draft
`takeaway` sat at density **0.909**, above even the wide short-field maximum (0.8925), and re-reading
found genuine verbosity rather than an added clause — compressed to **0.879** with all clauses intact.

**The figure multiset — the English side is now completely covered in both lessons.** **EN-only is
empty for 39 and for 40.** Lesson 39's two JA-only tokens are both English words rendered as digits
(`two straight quarters` -> `2四半期`, `over the next month` -> `1か月`), the documented pattern.
Lesson 40's `3x2` is **unchanged from before this edit** — English writes "The Three Rules" and "these
three rules" as words where Japanese uses `3つのルール` — and I deliberately wrote `三つの中で` and
`この三つを` as words rather than digits so the edit added **zero** new figure differences to that
lesson. Also avoided `1時間当たり` in favor of `時間当たり` for the same reason.

**Verification.** `npm test` — **PASS, 0 failures, 2 expected warnings**. §33 first **failed on both
lessons** ("is now at 0.48/0.46, up from a recorded 0.11 … re-record it"), which is the guard working;
re-recorded with `npm run translation-completeness -- --write`. `refresh-readiness.mjs --check` then
failed on §10.4's character sentence and was refreshed with `npm run readiness -- --write` — **`ja`
54,409 -> 56,507, a delta of exactly 2,098**, independently corroborating the added-character count
from a second instrument that was never given the number. `npm run build` ✅ (906 ms).
`npm run check-blindspot` ✅. `npm run check-backlog` ✅ (71 items, no duplicate numbers).
**Proved the edit is surgical by object comparison against `git cat-file blob HEAD:`** — lesson-id set
identical (12 ids), **only 39 and 40 differ, the other 10 byte-identical**, and the comparator's
control (an injected change to lesson 29) was detected. Also proved the file can be regenerated from
its own parsed object **byte-identically** (`shasum` match) before editing, so the re-emit could not
reformat the other ten lessons.
**Live browser verification (W-1), served from `dist/` via `python3 -m http.server`:** language `ja`,
lessons opened at `#/lesson/39` and `#/lesson/40`. **Control on every assertion — the English string
was confirmed *absent* before the Japanese was confirmed present**, ruling out a stale or English
render. All 8 `EN_absent_*` probes returned false and all 39 Japanese probes true. Rendered paragraph
blocks measured off `white-space: pre-line` elements: **39 = 6/6 and 40 = 4/2, matching English
exactly**. No console errors. Screenshotted.

**Also updated, because this run is what made them stale.** `LAUNCH_READINESS.md` §10.4's **prose**
now reads **48 pairs, `ja` 12, 12 of 40 lessons**, and its main-path clause records that **both
`money` and `economy` are fully translated in all five languages** rather than naming `ja` 39-40 as
the last gap. The header's "Last refreshed" moved 2026-08-23 -> 2026-08-24. **A third figure in that
row was stale from two runs earlier and is now fixed:** the two-instrument note still read
`ja 0.359 vs 0.361` when `ja` had moved twice since — now **`0.412 vs 0.412`** (both recomputed
directly; the headings gap is still exactly **3,451** en chars). That is the W-5.5 defect class in its
third location, which is why the rule in item 93's box now names all three places explicitly.

**W-5.1 step 3 — the economy phase is CLOSED and the remainder is filed as new item 94.**
Item 93 is marked closed and should not be picked again. **New item 94** carries the `essentials`
remainder — 48 pairs, `es`/`ko`/`zh`/`ja` 12 each, lessons 1-11 and 14 — as a separately-prioritized
item, with an explicit recommendation **not to start it until O-1 is resolved**: 24 runs ≈ 6 days of
capacity on the *optional* track, in four "(Beta)" languages, for an app no one has opened. Three
things were written into 94 that this run measured and that do not carry over from 93: the density
bands were fitted on `economy` and must be **re-fitted on essentials 12/13/15** (the only fully
translated in-track references); the abridged set is now **identical across all four languages**, so
one English-side read scopes the defect for all four at once ("read once, translate four times", not
available on 93); and **O-3 applies with more force here** than it did on the main path.

**The milestone, stated so it is checkable rather than announced.** `npm run translation-completeness`
reports **0 abridged pairs across lessons 12-40 in every language** and an abridged set of
`{1-11, 14}` **identical in all four**. The main path — `money` 16-28 and `economy` 29-40, the product
since the 2026-08-18 reversal — is fully translated in all five languages. Cost: **seven runs**,
which is exactly what W-5.1 budgeted.

**Step 5 — adversarial self-check.**
- **Blindspot register** — no regression, checked rather than assumed: `npm run check-blindspot`
  passes with **§10.2 no Dalio references** (these two lessons are the most Dalio-shaped content in
  the app — the three rules and the layered-template summary — and carry no attribution, matching the
  English), **§10.1 no advice-adjacent language in en/es/ko/zh/ja**, **§10.3** intact, and **§2.3 no
  live-looking dates in 26 teaching-copy modules** — easy here, since the added text contains no dates
  at all, only structural thresholds (`2％`, `50`, `15`, `40`) and cycle lengths (`75〜100年`, `5〜8年`).
  **§10.1 deserves the specific note and I probed it rather than trusting the pass:** scanned the
  2,696 added characters for `べきです`/`推奨`/`おすすめ`/`保証`/`儲か` and imperative buy-sell forms —
  **zero hits, with the scan's control proven able to fire.** The two `買` occurrences are `購買担当者`
  (PMI) and the contrarian-VIX sentence, which is third-person descriptive (`〜人もいます`, "there are
  also people who") and tracks the English clause for clause. `40`'s `単純な助言です` renders English's
  "This is simple advice" and is about debt, income and productivity — not markets.
- **`DECISIONS.md` conflict** — none. No state, routing or build change; the `.js` content module is
  unchanged in *form*, proven by the byte-identical round-trip above. The 2026-08-11 "(Beta)"
  machine-translation decision is honored, and the volume added is exactly what **O-3** asks the owner
  to re-affirm or cap — now escalated into item 94's own text rather than only restated here.
- **Already-done backlog item** — no. `ja` 39-40 was the queued step; 29-38 were proven untouched by
  object comparison against `HEAD`, not by reading the diff. Filing 94 rather than extending 93 is
  W-5.1 step 3 as written, and 94's box says explicitly that it is not a continuation.
- **Own verification claim** — reproducible from the pasted output of `npm test`, `npm run build`,
  `npm run translation-completeness`, `npm run readiness`, `npm run check-blindspot` and
  `npm run check-backlog`. The figures no existing script prints — the density band, the per-section
  budget, the short-field spread and the four simulated outcomes — come from scratchpad scripts whose
  controls are described above, including the one that caught the zsh word-splitting failure. The
  2,098 delta is corroborated by `readiness`, a second instrument.

#### O-3, restated — and this is the last item-93 run that will restate it

This run added **2,098 characters of unreviewed machine-translated Japanese**, closing the economy
phase. Human review share remains **0% in all four languages**; `npm test`'s own warning reports
**83% (0% human)** for each. Remaining: **48 pairs, all on the optional `essentials` track**, now
item 94 — which recommends the owner be asked *before* that work starts. Unchanged: the owner should
either re-affirm the 2026-08-11 decision or cap it. **The stop line means this is a natural place for
that decision to be made, rather than one more day of tranches.**

#### Next

**Item 93 is closed. Do NOT pick item 94 next** — it is the optional track, it is 24 runs, and its own
box recommends waiting for O-1. **W-5.2's list is the right place to pick from, and it is now the
whole of the actionable backlog:**
- **W-5.4 is the only unclaimed item in the W-5 housekeeping set and is the natural next pick** — 37
  run entries at the wrong heading level (6 live + 31 archived) to demote to `###`, one mechanical
  commit across two files, proven with a line-count-identical + entry-count-identical check (a
  sorted-line diff cannot be used when the lines themselves are what changed). Use
  `s.replace(old, () => new)` per the 2026-08-23 tooling note. **This entry is written at `###`.**
- **Item 67's residual third** and **item 64's residual candidates** — small, English-facing, open
  since 2026-08-17.
- **Item 26** (Quizlet/Vocabulary design review) and **item 27** (needs re-scoping: the money track's
  visuals shipped, so the item as written no longer describes the gap).
- **Items 76, 70/71** — process items filed by runs that could not finish them.
- A **backlog refill** is always a legitimate pick (W-2's standing rule, still in force). With 93
  closed and 94 parked, this is worth considering seriously: the Open set is now thin in a way it has
  not been for a week, and that is a symptom to act on rather than a reason to start 94 early.
**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). **O-1 is now also the gate on item 94**, so it blocks more than it
did yesterday.
Owner-tree fingerprint observed this run: `ce0d0a9cf73b035415eb5b1e502f8b360ebb6471416e4762dede93933a115c4b`
(4 tracked modified — all mine — 52 untracked). Previous run's `f4e4f1db…` differed only because its
own three files were still uncommitted when it measured.

### 2026-08-24 (scheduled dev-agent) — W-5.4: the run log gets one heading hierarchy, and the item's own fix would have made 36 entries worse

#### Step 3.5 — the counts reproduced exactly, and the *fix* was still wrong

Both headline figures are exact: **6 `##` dated entries in `AGENT_LOG.md` + 31 in `AGENT_LOG.archive.md`
= 37**, matching the item's re-scoped text to the unit. The only stale number is the live `###` count,
which the item recorded as **3** and is now **12** — nine more runs landed since, all writing at `###`.
That is a snapshot aging, not a wrong claim, and it is recorded rather than "corrected".

**The second claim also reproduced.** `scripts/check-backlog.mjs:45` really does bound the backlog with
`lines.findIndex((l, i) => i > start && /^## /.test(l))`, so a `##` entry landing above `## Environment
note` would silently truncate the check. Today the first `^## ` after the backlog heading is
`## Environment note`, so nothing is broken — exactly as the item says. No other script keys on run-entry
heading level: `check-measurements.mjs` scans both logs for MEASURED lines regardless of depth, and
`check-data.mjs`'s heading-collision check is scoped to `LAUNCH_PLAN.md` only.

**Controls, and both fired.** (a) A probe entry `## 2026-01-01 (PROBE)` appended to a scratchpad copy
took the count 6 → 7, so the counter can see what it is looking for. (b) A level census over both files
returned **37 `##` + 201 `###` dated headings and zero at any other depth**, so the two-level assumption
is measured, not assumed. (c) Fence-awareness: **0 headings sit inside code fences** and fences are
**balanced in both files** — worth checking in a log this full of pasted output, since a `## ` inside a
fence is text and demoting it would corrupt a transcript.

**Where the premise broke — and it changed the fix, not just a figure.** The item scopes the work as
"demote the 37 to `###`". Measuring each entry's *children* rather than only its own level shows the run
log has been written in **two different conventions**:

| entry level | children | count | shape |
|---|---|---|---|
| `##` | `###` | 36 | correctly nested |
| `##` | none | 1 | n/a |
| `###` | `###` | 12 (all live) | **flat** |
| `###` | none | 189 (archived) | silent on the convention |

The 37 entries the item calls defective were **correctly nested internally**; the newer `###` entries
recent runs wrote — the ones treated as the model — are **flat**, with each entry's own subsections as
its siblings. Demoting only the entry line would have converted **36 correctly-nested entries into flat
ones**, trading a top-level defect for a same-level one and calling it done. The archived 189 could not
arbitrate because **188 of them carry no subsections at all**.

**Re-decided on the corrected facts:** demote the 37 entries **and** every heading inside a dated entry,
in both files, so the run log is uniformly `## Run log` > `### entry` > `#### subsection`. That subsumes
the item as written instead of contradicting it, and it also repairs the 12 live `###` entries the item
never mentioned.

#### What shipped

One mechanical pass over `AGENT_LOG.md` and `AGENT_LOG.archive.md`:

- **37 dated run entries `##` → `###`** (6 live, 31 archived).
- **276 subsection headings `###` → `####`** (107 live, 169 archived) — every heading inside a dated
  entry span.
- **Nothing else.** The 7 structural `##` headings survive untouched: `## App summary`,
  `## Prioritized backlog`, `## Environment note`, `## Run log`, and the three `## Archived <range>`
  boundaries. Blockquoted backlog headings (`> ### W-5.x`) were never in scope — they do not start with
  `#`, and the guard in my edit script caught me assuming otherwise on the first attempt.

The transform walks lines with a fence toggle, treats any non-dated heading at depth ≤ 2 as a structural
boundary that ends the current entry, and demotes with `line.replace(/^###/, () => "####")` per this
file's 2026-08-23 tooling note about `$&` in replacement strings.

#### Verification

- **Line counts identical**: `AGENT_LOG.md` 6,973 → 6,973; `AGENT_LOG.archive.md` 19,144 → 19,144
  (measured before the run-log entry and backlog edit were appended).
- **Entry counts identical**: dated entries were 37 `##` + 201 `###`; they are now **0 `##` + 238 `###`**
  in the two files combined (18 live + 220 archived). 37 + 201 = 238.
- **Text byte-identical**: `diff <(sed -E 's/^#+ //' BEFORE) <(sed -E 's/^#+ //' AFTER)` is empty for both
  files — every line is unchanged once the heading marker is stripped. This is the check the item asked
  for in place of a sorted-line diff.
- **Only heading lines changed**: 226 changed lines in the live file and 400 in the archive, of which
  **0** fail `^[<>] #{2,4} `. Both totals are exactly 2 × (entries + children): 2 × 113 and 2 × 200.
- **Shape re-measured after the edit**: every dated entry is `###` and every child is `####`. The two
  entries still reporting `##` children are the instrument's own known limitation — a `## Archived`
  boundary attributed to the preceding entry — not defects; both were inspected by line number.
- `npm test` — **PASS, 0 failures**, 2 pre-existing warnings (the item-94 translation debt and the §34
  static touch-target note). `check-backlog` still locates the section and reports **71 items / 118
  citations resolved**, which is the direct proof the demotion did not disturb the scan it protects.
  `check-measurements` still finds its **7 claims across both logs**.
- `npm run build` — **✓ built in 908ms**.

#### Adversarial self-check (step 5)

- **Blindspot register** — no regression, and run rather than assumed: `npm run check-blindspot` passes
  with §10.2 (no Dalio), §10.1 (no advice-adjacent language in any of the five locales; disclaimer key
  present and rendering on all 8 surfaces), §10.3 (parent-facing kids framing intact) and §2.3 (no
  live-looking dates in 26 teaching-copy modules). This change cannot plausibly touch them — it edits no
  file under `src/`, adds no prose to any entry, and changes no character other than `#` — but the
  register is checked by running the script, not by reasoning that it is safe.
- **`DECISIONS.md` conflict** — none. No state, routing, content-module or build change; `DECISIONS.md`
  records nothing about run-log heading structure.
- **Already-done backlog item** — no. W-5.4 has never been marked done in either file, and it was the
  explicitly recommended next pick in the previous entry's "Next" section.
- **The tension worth naming**: `check-data.mjs`'s §31 comment says run-log entries "must never be
  edited". That rule is about an entry's *record* — its claims and figures, which are history. W-5.4 is
  an explicitly filed, deliberately re-scoped item authorizing exactly these headings in exactly these
  two files, and the byte-identical stripped-text diff above proves no entry's record moved. Flagging it
  because a future run reading only the §31 comment could reasonably think this commit broke it.
- **Own verification claim** — reproducible by re-running `npm test` and `npm run build`, and by
  re-deriving the counts with `grep -cE '^## 20[0-9]{2}-'` / `'^### 20[0-9]{2}-'` on both files against
  `git show HEAD~1:AGENT_LOG.md`. The before/after copies the diff checks used were taken in the
  scratchpad, and the same comparison reruns from `git show`.

#### What this closes, and what it does not

W-5.4's stated risk was **latent** — a `##` entry that "ever lands above the Environment note". It is now
**structurally impossible**: there are zero `##` dated entries, and the convention that produces them is
gone from both files. The file also has a table of contents that means something for the first time since
2026-08-20. What it does **not** do is add a guard: nothing stops a future run from writing `## 2026-…`
again. That is filed below as a new item rather than smuggled into this commit.

#### Next

**W-5.4 is closed; the W-5 housekeeping set is now fully claimed.** New item filed by this run:

- **NEW — a guard so the heading convention cannot drift back.** This run fixed 37 entries by hand-rolled
  script; nothing prevents the 38th. A ~15-line check in `scripts/check-data.mjs` asserting that in both
  logs every `^#{1,6} 20\d{2}-\d{2}-\d{2}` heading is exactly `###` and every heading inside a dated entry
  span is `####` would make this permanent. **Cheap, and it is the reason this class of item keeps
  recurring** — item 90 fixed the same defect in `LAUNCH_PLAN.md`, W-5.4 fixed it here, and neither left
  anything behind to hold it. Fence-aware, and it must skip blockquoted `> ###` backlog headings.

Otherwise the pick list is unchanged from the previous entry and is now thin enough to be worth acting on:
- **Item 67's residual third** and **item 64's residual candidates** — small, English-facing, open since
  2026-08-17.
- **Item 26** (Quizlet/Vocabulary design review); **item 27** needs re-scoping before it can be picked.
- **Items 76, 70/71** — process items filed by runs that could not finish them.
- **A backlog refill** (W-2's standing rule) is a legitimate and increasingly justified pick: with 93
  closed and 94 parked behind O-1, the Open set is thin.
- **Do NOT pick item 94** (the `essentials` translation remainder, 24 runs on the optional track in four
  "(Beta)" languages). Its own box recommends waiting for O-1.

**Unchanged and still the critical path, both owner-blocked:** **O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). O-1 also gates item 94.

### 2026-08-24 (scheduled dev-agent) — a guard for the run-log heading convention, and a control that proves a fenced heading is not a heading

**Picked:** the item the previous run filed in its own closing note — *"nothing stops a future run from
writing `## 2026-…` again."* W-5.4 repaired 37 dated entries and 276 subsections by hand-rolled script
and left nothing behind to hold the result. This run adds `scripts/check-data.mjs` **§35**, filed as
backlog **item 95** and closed in the same commit.

**This is a W-5.2 pick** (work that is not item 93), and it is the correct one on the merits rather than
only by rotation: item 93's economy phase closed last run, item 94 is explicitly parked behind O-1, and
the previous entry named this guard as the single new item it had filed.

#### Premise re-measured first, with an independent instrument (step 3.5)

The item's claim is about *what the files currently are*, so it was measured before a line was written —
with a scratchpad script written independently of §35, not by reading §35's own output:

- **239 dated entries** across `AGENT_LOG.md` (19) + `AGENT_LOG.archive.md` (220) — **all `###`**, zero
  at any other depth.
- **282 headings inside those entries** (113 live + 169 archived) — **all `####`**, zero otherwise.
- **13 blockquoted `> ###` headings**, all in the live file's W-5 priority block. These are prose inside
  a blockquote, not outline, and must be skipped; the `^` anchor does that without a special case.
- **0 headings inside code fences**, fences balanced in both files (5 opens live, 14 archived). The log
  is full of pasted shell output, so this was checked rather than assumed.

§35 independently reports **239 / 282 / 0 wrong**. The agreement between two separately-written
instruments is the reason the number is worth anything — §35 confirming its own arithmetic would not be.

**One premise refinement, and it is why the previous entry's count differs from this one.** W-5.4
reported "two entries still reporting `##` children — the instrument's own known limitation, a
`## Archived` boundary attributed to the preceding entry". That artifact is gone here because both
instruments close an entry's span on **any heading of depth ≤ 2**, so `## Archived 2026-08-16 →
2026-08-22` ends the entry above it instead of being counted as its child. Not a defect that was fixed —
a measurement artifact that this instrument does not have.

#### What §35 asserts, and what it deliberately does not

Both halves of the shape, not just the entry line: **entry `###`** *and* **children `####`**. That is
W-5.4's own correction encoded — its premise check found that a rule pinning only the entry's level
would have converted 36 correctly-nested entries into the flat `### entry > ### children` shape it was
removing. Checking one level without the other is how that trade happens silently.

The failure message names the real consequence rather than the aesthetic one: at `##` a dated entry is a
sibling of `## Run log`, `## Prioritized backlog` and `## Environment note`, and **`check-backlog.mjs`
finds the backlog section by scanning forward to the next `^## `** — so one `##` entry landing above the
Environment note truncates that scan into a silent pass. It also says *change the `#` count, do not edit
the entry's text*, for the same reason §32b's message says *fix the depth, never renumber*: the tempting
repair is the destructive one.

Deliberately out of scope: **titles** (§32 already records why the logs are excluded from duplicate-title
detection — run-log entries repeat headings by design) and **content**. §31's rule that an entry's record
must never be edited is untouched, because a `#` count is not a claim.

#### Controls — four of them, and each one had to be able to fail

Probes were injected into `AGENT_LOG.md`, which was restored from a **scratchpad copy** afterward
(`git checkout --` is never used on this repo's files); the pre-injection `md5` `3970e5ca…` was recorded
before and re-verified after, and `scripts/check-data.mjs` likewise returned to `38f0b626…`.

| Probe | Expected | Result |
|---|---|---|
| `## 2026-01-01 (PROBE A)` — a dated entry at depth 2 | **fail** | ✅ failed, citing `AGENT_LOG.md:7126` — the injected line |
| `##### PROBE B` — a child at depth 5 inside that entry | **fail** | ✅ failed, citing line 7128 and naming its parent entry |
| `### 2026-01-02 (PROBE C)` + `#### …` inside a code fence | **ignored** | ✅ ignored |
| `> ## 2026-01-03 (PROBE D)` — blockquoted | **ignored** | ✅ ignored |

The counts are the proof for the two negative controls, which is the half that is easy to fake: totals
moved **239 → 240** and **282 → 283**, i.e. by exactly the two probes that were supposed to count. Had
fence-awareness or the `^` anchor failed, the fenced pair and the blockquoted line would have shown up in
those totals whether or not they raised a failure.

**Fifth control, on the instrument itself.** Both floors were proven able to fire: changing `20\d{2}` to
`19\d{2}` in §35's dated pattern made it match nothing, and it reported **two failures** ("only 0 dated
entries … expected at least 100" and the child equivalent) rather than "0 at the wrong depth, PASS". This
is the §32/§32b floor pattern and it exists because a scan that matches nothing is byte-identical to a
clean result. Restored immediately after.

#### Verification

- `npm test` — **PASS, 0 failures**, 2 pre-existing warnings (item 94's translation debt; the review
  ledger's 0% human share). Measured *before* this entry was appended: `§35 run-log heading depth: 239
  dated entr(ies) and 282 heading(s) inside them across 2 log file(s), 0 at the wrong depth.` **After
  this entry and item 95 land it reads 240 / 288 / 0** — the entry adds itself and its six `####`
  subsections, which is the check watching the commit that introduced it.
- `npm run build` — **✓ built in 922ms**.
- `check-backlog` — **71 items → 72** with item 95 added, **118 citations resolved**, no duplicate
  numbers. The backlog scan still terminates correctly, which is the property §35 exists to protect.

#### Adversarial self-check (step 5)

- **Blindspot register** — no regression, and run rather than reasoned about: `npm run check-blindspot`
  passes on §10.2 (no Dalio), §10.1 (no advice-adjacent language in any of the five locales, disclaimer
  present and rendering on all 8 surfaces), §10.3 (parent-facing kids framing) and §2.3 (no live-looking
  dates in 26 teaching-copy modules). This change adds no prose to any user-facing surface and edits
  nothing under `src/`, but the register is checked by running the script.
- **`DECISIONS.md` conflict** — none. No state, routing, content-module or build change; `DECISIONS.md`
  records nothing about log structure or about `check-data.mjs`'s section set.
- **Already-done backlog item** — no. This is the first guard for this property in these files; W-5.4
  fixed the instances and explicitly declined to add the guard in the same commit ("filed below as a new
  item rather than smuggled into this commit"). §32b guards the same defect class in a different file
  and shares none of this code path.
- **The tension worth naming, again** — §31's comment says run-log entries "must never be edited". §35
  never edits; it only reads. But it does something §31 should be read alongside: it makes a *future*
  hand-edit of a heading mandatory when a run writes the wrong depth. That is the same authorization
  W-5.4 already carried, narrowed to one character on one line.
- **A second-order risk, stated rather than discovered later** — §35 now makes `npm test` fail on a
  malformed heading, which means a run that writes `## 2026-…` cannot commit until it fixes it. That is
  the intent, but it also means the **weekly archive pass must keep both files scannable**: moving
  entries across cannot drop either file below the floors. The floors (100 and 100, against 239 and 282)
  leave that headroom deliberately, and the archive move is verbatim, so it cannot change a depth.
- **Own verification claim** — reproducible by re-running `npm test` and `npm run build`, and by
  re-deriving 239 / 282 with any independent scan that resets its entry span on `^#{1,2} `. The probe
  runs are reproducible by re-injecting the four lines above and re-running `node scripts/check-data.mjs`.

#### Next

The pick list is unchanged and thin, which is itself the signal:

- **A backlog refill** (W-2's standing rule) is now the strongest pick. Item 93 is closed, 94 is parked
  behind O-1, and the W-5 housekeeping set is fully claimed — the Open set is down to residuals.
- **Item 67's residual third** and **item 64's residual candidates** — small, English-facing, open since
  2026-08-17.
- **Item 26** (Quizlet/Vocabulary design review); **item 27** still needs re-scoping before it is
  pickable.
- **Items 76, 70/71** — process items filed by runs that could not finish them.
- **Do NOT pick item 94** (the `essentials` remainder — 24 runs on the optional track, four "(Beta)"
  languages, behind O-1 by its own box).

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL — `dist/`
builds, routing is hash-based, Netlify Drop is a drag of the folder) and **O-2** (item 18, an analytics
account, which §4.3's Phase-0 completion gate cannot be scored without). Zero people have opened this app.


### 2026-08-24 (scheduled dev-agent) — `<html lang>` never followed the language picker, and the pick list had been recommending two closed items for seven days

**Picked:** a W-5.2 pick (not item 93). The previous entry named a **backlog refill** as the strongest
remaining candidate and listed four fallbacks. Checking those fallbacks *before* picking one is what
produced this run's work — two of them are closed, and looking for a replacement surfaced a real
rendered defect that no item had ever named.

#### The pick list itself was the first thing that failed re-measurement (step 3.5)

W-5.2's list and the last three run entries all offer **"item 67's residual third and item 64's
residual candidates — small, English-facing, open since 2026-08-17."** Both are closed:

- **Item 64** reads `✅ ITEM FULLY DONE 2026-08-20 … Nothing in this item is open`.
- **Item 67**'s own closing line reads *"All that remains of this item is `Dividend`"* — and `Dividend`
  shipped 2026-08-20, **verified by reading the source rather than the log**: the key is present in
  `src/content/glossary.js` with `en`/`ko`/`es`/`zh`/`ja` all populated.

**The finding is about pick lists, not about these two items.** A list of candidates is a claim about
current state and goes stale exactly the way a figure does — W-5.5 established that rule for *numbers*,
and this is the same defect in a different shape. The live W-5.2 line is struck and annotated; **the
three run-log entries that repeat it were left verbatim**, because §31 says a dated record is not edited.

#### The defect this run fixed, measured in a live browser before a line was written

`src/lib/useAppState.js` owns `lang` and has two sibling effects that push state onto the root element —
`style.fontSize` for the text-size control, `dataset.theme` for the color scheme. **There was no third
one for `lang`**, and `index.html` ships a hardcoded `lang="en"`. So every non-English locale rendered
its content inside a document still declaring itself English.

Measured on the built app (`dist/` served over HTTP, `preview_start` with a plain `url` — the
Environment note's technique, per W-1):

| Step | `document.documentElement.lang` | Evidence it is a real observation |
|---|---|---|
| Fresh load | `en` | — |
| Switch picker to 한국어 | **`en` (unchanged)** | Page text became Korean (`경제 순환`, `레슨 1 / 12`) and `localStorage.ecycles_lang` became `ko` |

**Controls, because a negative reading and a broken instrument look identical.**
- **Control A (the switch really happened):** the body text and the stored key both moved to Korean, so
  "`lang` unchanged" is not the trivial truth that nothing changed.
- **Control B (the instrument can see this attribute change):** setting `documentElement.lang` to
  `PROBE-XX` read back as `PROBE-XX`, then restored. The read path works; `en` was real.
- **Control C (the sibling pattern does fire):** `documentElement.style.fontSize` was `100%` — an
  untouched root has `""` — so the hook's effect-to-root pattern works and `lang` was simply absent
  from it.

#### The fix, and the one judgment call in it

Four lines in `useAppState.js`, next to the two effects it mirrors, plus an `HTML_LANG` map. Identity
for four locales; **`zh` is tagged `zh-Hans`**, and that was measured rather than assumed: scanning the
four `zh` content modules found **0 Traditional-only forms against 4,534 Simplified counterparts**. The
scanner was controlled by running it over the `ja` modules, where it found **1,046** — so its zero on
`zh` is a result, not a silent miss. `HTML_LANG[lang] ?? lang` degrades to the bare code if a sixth
locale is ever added without touching the map.

#### Verification — rendered, per W-1

Rebuilt, then driven through the real `<select>` on the served build:

| Picked | `<html lang>` |
|---|---|
| es / ko / ja / en | `es` / `ko` / `ja` / `en` |
| zh | **`zh-Hans`** |

- **Cold-load persistence:** `ecycles_lang=zh` + `#/lesson/29`, full reload → `lang="zh-Hans"` on load,
  so the tag is restored from storage and not merely reactive to the picker.
- **Console:** no errors.
- `npm test` — **PASS, 0 failures**, the same 2 pre-existing warnings as before the change (item 94's
  translation debt; the review ledger's 0% human share). `npm run build` — **✓ built in 902ms**.

#### A second defect found while testing, filed as item 96 rather than fixed here

Probing what happens when a content chunk fails to load turned up something worth more than this run's
own fix. With one content chunk returning **404**, economy lesson 1 does **not** white-screen — it
renders **772 characters instead of 3,294 (a 77% loss)**, with the entire lesson body replaced by a
single `…`, and with the title, both quizzes, the disclaimer and an **enabled `Mark Complete`** all
intact. A learner can complete a lesson they were shown nothing of, and it feeds the streak and the
review queue. Cause: **no error boundary exists anywhere in `src/`**, and `Suspense` catches *pending*,
not *rejected*.

**The cache nearly hid this.** The first attempt reported full text with `transferSize: 300`; re-running
from a **fresh origin** (a second port) is what exposed it. Filed as **item 96** with the method, since
it becomes reachable the day O-1 gives the app a URL and a redeploy invalidates a hashed chunk under an
open tab.

#### Adversarial self-check (step 5)

- **Blindspot register** — run, not reasoned about: `npm run check-blindspot` passes all six (§10.2 no
  Dalio, §10.1 advice language + disclaimer on all 8 surfaces, §10.3 parent-facing, §2.3 no live-looking
  dates). This change adds **no prose to any user-facing surface** — it writes one DOM attribute.
- **`DECISIONS.md` conflict** — none. No new persisted key (it reads the existing `lang` state), no
  routing change, no content-module change, no build change; the localStorage-only and `.js`-content
  decisions are untouched. `DECISIONS.md` records nothing about document language.
- **Already-done backlog item** — no, and this was checked with controls rather than by memory:
  `documentElement.lang`, `<html lang`, "lang attribute" and `zh-Hans` return **zero matches** across
  `AGENT_LOG.md`, `AGENT_LOG.archive.md`, `DECISIONS.md`, `LAUNCH_PLAN.md` and `scripts/`. The same
  grep shape finds `documentElement` (10), `translation-completeness` (34) and `a11y` (32), so the zero
  is real. All 10 `documentElement` mentions were read: every one is `scrollWidth`, `style.fontSize` or
  `clientWidth`. **No conflicting `lang` attribute in JSX either** — the 10 `lang=` hits under `src/`
  are React props passed between components, never an attribute on a DOM node.
- **Own verification claim** — reproducible by anyone re-running only what is listed: build, serve
  `dist/`, drive the `<select>`, read `document.documentElement.lang`. The `zh-Hans` justification is
  reproducible by re-running the Traditional/Simplified scan with its `ja` control.
- **Second-order risk, stated rather than discovered later** — the fix has **no guard**, so a future
  refactor of `useAppState` drops it silently and no sighted reviewer would notice. Filed as **item 97**
  instead of smuggled into this commit, which is the same boundary W-5.4 drew before item 95.

#### Next

- **Item 96** (the silent empty-lesson defect) is the strongest pick on the board — it is a rendered
  user-facing bug with a measured 77% content loss and a reproduction recipe already written down.
- **Item 97** (a guard for this run's fix) is small and pairs naturally with 96, since both live in the
  render path.
- **A backlog refill** remains legitimate (W-2), and is now partly discharged: this run filed **96, 97,
  98** from measurement rather than from notes, and struck two closed candidates off the pick list.
- **Do NOT pick item 94** (the `essentials` remainder — optional track, four "(Beta)" languages, parked
  behind O-1 by its own box).

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Zero people have opened this app — and item 96 is a reminder that the
first real deploy is also the first time a whole class of failure becomes reachable.

### 2026-08-24 (scheduled dev-agent) — item 96: a lesson you can complete without being shown it, and a "Try again" button that could never have worked

Picked **item 96**, the strongest thing on the board and a genuine user-facing bug: a content chunk that
404s renders an empty lesson with a working **Mark Complete**. Non-item-93 work, so **W-5.2's ratio is
respected** (four consecutive non-93 runs now); item 94 was deliberately **not** picked, per its own box.

#### Step 3.5 — premise re-measured with controls, and it held exactly

Item 96 is the first item in a long while whose premise survived intact. Both halves reproduced:

- **Code claim.** `componentDidCatch` / `getDerivedStateFromError` / `ErrorBoundary` → **0 matches**
  under `src/`. **Control:** the same grep shape finds `Suspense` **7** and `lazy(` **3**, so the zero is
  real and not a broken instrument.
- **Runtime claim, re-run from scratch.** Built `dist/`, copied it twice into the scratchpad, removed
  `lessonContent.economy.en-*.js` from one copy only, and served the two on **separate ports** — the
  fresh origin is what defeats the HTTP cache that masked this on the filing run.
  **Instrument control:** the same URL returned **200 on :8611** and **404 on :8612**.
  Result on the broken origin: **772 characters against the control's 3,294** — the item's figures to
  the character — **0 `<h2>` sections**, the body replaced by a bare `…`, and `Mark Complete`
  **present and enabled**. Console carried an **uncaught (in promise)** rejection.

#### The finding that changed the fix: an in-place retry is impossible, not merely inferior

The item's scope said *"try again"*. I was about to build a retry button that re-invoked the loader —
and measured it first. **Once a dynamic import rejects, that specifier stays errored in the document's
module map for the life of the document.** Proven live, with the file restored to 200 in between:

| Re-import, after the file is back at **200** | Result |
|---|---|
| same specifier | **still fails** — no network request |
| `?retry=1` appended | **succeeds** |

Vite needs **literal** specifiers to split chunks at all (that is what `CONTENT_LOADERS` is), so there
is no cache-busted specifier to offer. **A "Try again" button would have failed every single time it
was pressed** — a fix that looks like a fix and lies exactly the way the bug does. The action is
therefore a **document reload**, and the button says `Reload`, not `Try again`.

#### What shipped

- **`src/components/ErrorBoundary.jsx`** (new) — the app's first. `App.jsx`'s `AsyncScreen` now pairs
  it with `Suspense` around all three `lazy()` screens; the pairing is a component so a fourth screen
  cannot be added with only half of it.
- **`LessonReader.jsx`** — `.catch` on **both** loaders, a `loadFailed` state that separates *still
  downloading* from *will never arrive*, and — the point of the item — **`Mark Complete` withheld**,
  along with the pre-lesson hook and the end-of-lesson check. Those two are withheld for a specific
  reason: they feed the **Leitner schedule**, so grading recall of a body that never rendered puts a
  never-taught question into the review queue.
- **`Practice.jsx`** — same `.catch`. Its buttons were already `disabled={!quizText}`, so a rejection
  never crashed it; it just left two dead buttons and no explanation, forever.
- **`ui.jsx` — `LoadFailure`**, shared by all three surfaces plus the boundary fallback so they cannot
  drift in wording, with `role="alert"`.
- **The bare `…` placeholders** — item 96 asked for these to be checked "at the same time". All three
  (`App.ScreenFallback`, `LessonReader`, `Sectors`) now render a real `t.loadingLabel`. `grep -rn '>…<' src/`
  returns **none**. Fixing `Sectors` also made `App.jsx`'s comment claiming parity with it true again.
- **Four new locale keys in all five languages** (`loadingLabel`, `loadFailedTitle`, `loadFailedBody`,
  `loadFailedRetry`).

#### Verification — live browser, four cases, each against a control (W-1)

Built, copied `dist/` per case, removed exactly one chunk per copy, served each on its own port.
**Instrument control first:** content chunk / screen chunk returned `200 200` on the healthy origin,
`404 200` on the content-broken one, `200 404` on the screen-broken one.

| Case | Before | After |
|---|---|---|
| **Healthy** (control) | 3,294 chars, check present, Mark Complete | **identical — 3,294 chars, check present, Mark Complete**; 0 console errors; all 4 routes render |
| **Content chunk 404** | 772 chars, `…`, **Mark Complete enabled** | 459 chars, `role="alert"`, **no Mark Complete**, check withheld, `Reload` offered |
| **Screen chunk 404** | **total white screen** — `#root` **0 children, 0 bytes**, app gone | shell survives — **5,922 bytes**, nav intact, alert shown |
| **`Reload` pressed** after the chunk returns | — | **full recovery: 3,294 chars, Mark Complete back, `#/lesson/29` preserved, no first-run modal** |

The white-screen row is measured, not asserted: the "before" was produced by building a **pristine
`git archive HEAD` copy** (Environment note's recipe) and breaking the same chunk in it.

**All five languages rendered**, not just checked for key parity — the picker was driven through
`en`/`es`/`ko`/`zh`/`ja` against an origin with all five economy chunks removed, and every one showed
its own translated title, body and `Reload`, with **Mark Complete absent in all five**. The five
`loadingLabel` strings are present in the shipped bundle (control: an invented string returns 0).

Console on the failure paths now carries **only labeled, caught errors** (`[LessonReader] content load
failed`) — the uncaught rejection is gone. `npm run build` **✓ 962ms**; `npm test` **0 failures**, the
same **2 pre-existing warnings** (item 94's translation debt, the 0% human review share).

#### Adversarial self-check (step 5)

- **Blindspot register** — `npm run check-blindspot` **passes all six**, run rather than reasoned about.
  This adds user-facing prose in five languages, so §10.1 is the live risk: the new strings are a load
  error, carry no advice language, and the **disclaimer still renders on the failure state** (visible in
  the screenshot), so §10.1's 8-surface requirement holds. No dates, no Dalio, no child-facing framing.
- **`DECISIONS.md` conflict** — none. No new persisted key, no routing change, no content-module change,
  no build change. `DECISIONS.md` records nothing about error handling or reload behavior.
- **Already-done backlog item** — no. `ErrorBoundary`, `componentDidCatch`, `LoadFailure` and
  `loadFailed` return **0 matches** across `AGENT_LOG.md`, the archive, `DECISIONS.md` and
  `LAUNCH_PLAN.md` except inside item 96's own text and the entry that filed it — all four hits read.
  **Control:** the same grep finds `chunk` **289**, `Suspense` **5**, so the zeros are real.
- **Own verification claim** — reproducible by re-running only what is listed: build, copy `dist/`,
  `mv` one chunk aside, serve on a fresh port, drive the page. Every number above came from that loop,
  and the two "before" figures came from a `HEAD` build, not from memory.
- **Residual, stated rather than discovered later.** `Learn.jsx` is **statically** imported, so it is
  not inside an `AsyncScreen` and a render error there still takes the tree down. Not widened into this
  commit — `LoadFailure`'s wording ("couldn't be downloaded") would be wrong for a render bug. Filed as
  **item 99** with the guard half.

#### Next

- **Item 97** (a `check-data.mjs` guard for the `<html lang>` sync) is small and still open.
- **Item 99** (a top-level boundary for the non-lazy screens, plus a guard that a new `lazy()` screen
  cannot skip `AsyncScreen` and a loader cannot lose its `.catch`) is this run's own residual.
- **Item 98** (link-preview metadata) serves §5 and is cheap.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Item 96 was worth doing precisely because it is **unreachable until
O-1 lands and reachable the moment it does** — the first redeploy under an open tab is the first time
a hashed chunk 404s at a real reader. Owner-tree fingerprint observed this run:
`cfc738474b654a4be905ece137da8855a670441857b84f73cddb27d5fb929cf2` (0 tracked modified, 52 untracked).

### 2026-08-24 (scheduled dev-agent) — item 97: a guard for `<html lang>`, and the half of it I wrote first would have passed the exact refactor it exists to catch

Picked **item 97**, named first in the previous run's "Next" and the highest thing on the board by the
log's own stated order (97 → 99 → 98, with item 94 explicitly parked). Non-item-93 work, so **W-5.2's
ratio is respected** — five consecutive non-93 runs now.

#### Step 3.5 — premise re-measured with a control, and it held

Item 97 claims the four-line `<html lang>` sync effect has **no guard at all**. Both halves reproduced:

- **`grep -rn "documentElement.lang\|HTML_LANG" scripts/ src/`** → **2 hits**, both inside
  `src/lib/useAppState.js` itself (the map on line 77, the effect on line 137). Nothing in
  `scripts/`, so no script asserts it, and `npm test`'s seven scripts are the whole test surface —
  there is no unit-test directory to have missed.
  **Control:** the same grep shape for `MIN_TAP` (known to be guarded, by §34) returns **10+ files
  including `scripts/check-data.mjs`**. The zero is real, not a broken instrument.
- **The silent-drift path is `?? lang`**, and reading it confirmed the item's reasoning: a sixth
  locale added to `TR` with no `HTML_LANG` entry does not throw — it emits a bare tag. Silent by
  construction, and inaudible to a sighted reviewer, which is why "no guard" is worse here than
  elsewhere.

#### The finding that changed the change: a file-level reference check is not a check

The item scoped two assertions — the hook still writes `documentElement.lang`, and `HTML_LANG` covers
every key in `TR`. I wrote a third of my own accord: that whatever assigns the attribute reads its
value from `HTML_LANG` rather than hardcoding a tag. My first version asked whether the **file**
mentioned `HTML_LANG` anywhere. Then I injected the obvious refactor — rewriting the effect to use the
`const root = document.documentElement` alias the theme effect two lines above already uses:

| Injection | First version | After the fix |
|---|---|---|
| `const r = document.documentElement; r.lang = lang;` | **PASS** — the map's own declaration satisfied the file-level match | **FAIL**, named and located |

The declaration counted as a reference to itself. The check is now **per line**: the assignment line
must read `HTML_LANG`. This is the whole reason step 3.5 asks for injections rather than a re-read — I
would have committed a guard that passed the single most likely way this regresses, and it would have
looked exactly like a working guard from the outside.

#### What shipped

- **`scripts/check-data.mjs` §36** (~140 lines with its reasoning header), asserting five things:
  `HTML_LANG` and `TR` have **identical key sets** (both directions — an orphan tag is drift too);
  every tag is **well-formed BCP-47** *and* its **primary subtag equals the locale key**, so a
  transposed entry cannot pass a shape-only regex; `index.html`'s pre-mount `lang` **exists** and is
  one of the shipped tags; some file under `src/` **still assigns** the attribute; and every
  assignment **line** reads `HTML_LANG`. Plus a **floor** (`sources.length < 20`), per §35's lesson.
- **`src/lib/useAppState.js`** — `HTML_LANG` is now exported, with a comment saying it is exported
  for §36 and why the `?? lang` fallback is correct at runtime yet exactly what makes the drift
  silent. **No behavior change**: an `export` keyword and two comment blocks.
- Worth noting against `DECISIONS.md:576`, which observes that the locale-parity checks "catch a
  **missing** language, never a wrong one" — §36's primary-subtag assertion is a *wrong-one* check,
  for this one attribute. It does not generalize to content, and does not claim to.

#### Verification — nine injections, each restored from a scratchpad copy, never `git checkout --`

Controls first and last: the unmodified tree **PASSes** on both sides of the battery, and `git status`
after it showed only the two intended files modified (`index.html` and `src/locales/index.js` were
each mutated during the run and are back at `HEAD`).

| # | Injection | Result |
|---|---|---|
| 1 | effect deleted (the item's headline mode) | **FAIL**, named |
| 2 | `export` removed from `HTML_LANG` | **hard crash at ESM link time** — loud, but see the residual |
| 3 | aliased write `r.lang = lang` | **FAIL** — *this is the one the first draft passed* |
| 4 | sixth locale `pt` added to `TR`, no tag | **FAIL**, named |
| 5 | transposed tag (`ko: "ja"`) | **FAIL** — "announces ko content as ja" |
| 6 | malformed tag (`zh_HANS`) | **FAIL**, named |
| 7 | `lang` attribute removed from `index.html` | **FAIL**, named |
| 8 | `index.html` ships `lang="fr"` | **FAIL**, lists the five real tags |
| 9 | orphan key in `HTML_LANG` not in `TR` | **FAIL**, named |
| 10 | **floor**: the `src/` walk truncated to 3 modules | **FAIL** — "the scan is not seeing the code it is supposed to police" |

**The invariant itself re-verified live**, because a guard is worth exactly what the thing it guards is
worth: served the built `dist/` and drove the real picker through all five languages, reading
`document.documentElement.lang` after each. **es→`es`, ko→`ko`, zh→`zh-Hans`, ja→`ja`, en→`en`.**
**Instrument control:** a no-op read taken first held at `en`, so the reader is not merely echoing the
last write. Zero console errors.

`npm run build` **✓ 924ms, exit 0**; `npm test` **exit 0**, 0 failures, the same **2 pre-existing
warnings** (item 94's translation debt, the 0% human review share). §36 reports:
`5 tag(s) for 5 locale(s), 1 assignment line(s) across 70 module(s) under src/, index.html starting at "en"`.

#### Adversarial self-check (step 5)

- **Blindspot register** — `npm run check-blindspot` **passes all six**, run rather than reasoned
  about. This change adds **no user-facing prose at all** (an `export` keyword, comments, and a test
  section), so §10.1/§10.2/§10.3 and the stale-date fix have no surface here. No dates, no Dalio, no
  child-facing framing, no market figures.
- **`DECISIONS.md` conflict** — none. No persisted key, no routing change, no content-module change,
  no build change. The `.js`-not-JSON decision covers `src/locales/*` and `src/content/*`; `HTML_LANG`
  lives in `src/lib/` and was already a `.js` export in all but the keyword. Read `DECISIONS.md:354`
  and `:570` in full rather than grepping past them.
- **Already-done backlog item** — no. **`§36` returns 0 hits** across `AGENT_LOG.md`, the archive,
  `DECISIONS.md`, `LAUNCH_PLAN.md` and `scripts/` outside the section I just wrote, so the number is
  free and this duplicates no earlier section. **Control:** the same grep for `§35` returns
  `AGENT_LOG.md` and `check-data.mjs`. `HTML_LANG` appears only in item 97's own text and the entry
  that filed it — both read.
- **Own verification claim** — reproducible from the commands listed: the injections are single
  `perl -0pi -e` substitutions against named strings, each followed by `node scripts/check-data.mjs`
  and a restore from the scratchpad copy. Every figure above came from that loop.
- **Residual, stated rather than discovered later.** Injection 2 (the `export` removed) fails as an
  **unmessaged ESM SyntaxError**, not a `§36:` line. That is inherent — a static `import` cannot
  survive its own export vanishing in order to report on it. It is loud and it exits non-zero, so it
  cannot pass silently; it just reads as a stack trace instead of a sentence. Not worth a dynamic
  import to soften.

#### Next

- **Item 99** (a top-level boundary for the statically-imported `Learn.jsx`, plus the guard half:
  every `lazy(` in `App.jsx` inside `AsyncScreen`, every `import(` under `src/screens/` carrying a
  `.catch`) is now the top of the list — item 97 was above it and is closed. Its guard half is the
  same shape as §36 and §35, and **§36's lesson transfers directly: assert on the call-site line, not
  on the file**, or a `.catch` moved one line away will pass.
- **Item 98** (link-preview metadata) is cheap and serves §5. **Corroborated this run by accident:**
  driving the picker through all five languages, `document.title` stayed
  `"Economic Cycles — Master the Economy"` in every one — the item's "`<title>` hardcodes English"
  clause is now measured, not asserted.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Item 97 is worth its run for a reason specific to O-1: `<html lang>`
is read by assistive technology and by nobody else in this repo, so it is precisely the kind of defect
that can regress for weeks unnoticed and is only ever discovered by the first screen-reader user — who
does not exist until O-1 lands.

### 2026-08-24 (scheduled dev-agent) — item 99: the blank page had one more door, and the guard as filed would have failed a correct tree

Picked **item 99**, named first in the previous run's "Next" and the top of the board with item 97
closed. Non-item-93 work, so **W-5.2's ratio is respected** — six consecutive non-93 runs.

#### Step 3.5 — premise re-measured with controls, and one claim of three was wrong

- **"`Learn` has no boundary above it"** — reproduced by reading `App.jsx`: `AsyncScreen` wraps the
  three `lazy()` screens; `<Learn>` sits bare in `<main>`. **Control:** the three lazy screens are
  inside it, so the absence is specific to `Learn` and not a failure to find the wrapper.
- **"a render error blanks the page"** — reproduced **live**, not reasoned about. Injected a throw
  into `Learn`, rebuilt, served `dist/`, and read `#root`: **0 children, 0 bytes**. **Control:**
  restore + rebuild returned the same page at **75,317 bytes**.
  **The instrument needed a correction first, and it is the reason to always carry a control.** The
  first reading came back *byte-identical to the unmodified app* (21,021 bytes both times), which
  looks like "the injection did nothing". It was not: on a first visit the app routes straight into
  lesson 1, so `Learn` never renders at all and I was measuring the first-run modal. Only after
  dismissing first-run and going to `#/learn` did the blank page appear. **A pair of identical
  numbers is what exposed it** — had they differed slightly I would have believed the first result.
- **"every `import(` call site under `src/screens/` carries a `.catch`"** — **FALSE**, and this
  changed the guard rather than a figure. There are **25 `import(` lines under `src/screens/` and
  zero carry a `.catch`**. They are `() => import(...)` thunks in a loader table; the `.catch`
  belongs to the **invocation**, of which there are **three** (`CONTENT_LOADERS` and
  `QUIZ_TEXT_LOADERS` in `LessonReader.jsx`, `QUIZ_TEXT_LOADERS` in `Practice.jsx`) — not the four
  the item claimed. **Written as filed, §37 would have failed a correct tree on 25 counts.**

#### What shipped

- **`AppError`** (`components/ui.jsx`) — a sibling of `LoadFailure`, same reload action, different
  words. `LoadFailure` says the content *"couldn't be downloaded"*, which is a lie about code that
  downloaded fine and then threw. New copy in **five languages** (`appErrorTitle`, `appErrorBody`);
  `loadFailedRetry` is reused rather than duplicated because the action really is identical.
- **`ScreenBoundary`** around App's `<main>`, **keyed on `tab`**. It wraps the screen area rather
  than the app so the header and bottom nav survive — and the key is what makes that offer real: a
  boundary that has caught stays caught, so without remounting per tab the nav would be visible and
  useless. **Switching tabs is therefore also the recovery.**
- **A root boundary in `main.jsx`**, which is the half that is easy to miss: `ScreenBoundary` is
  rendered *by* `App`, so it cannot catch `App`'s own render — a throw in the header, the nav, the
  first-run modal or `useAppState` unmounts the tree above it. Its copy comes from `localStorage`
  through `loadLang` (now exported, one comment saying why), since App may never have rendered.
- **`scripts/check-data.mjs` §37**, asserting three invariants with three floors and an
  unbalanced-tag integrity check. Reports `4 screen(s) in App.jsx (3 lazy / 1 static) inside 4
  boundary region(s), root boundary in main.jsx, 3 loader invocation(s) across 4 screen file(s)`.
  Those numbers were derived by independent grep **before** the section existed and agree with it,
  which is what makes them trustworthy rather than self-confirming.

#### Verification — three live browser proofs, then eight injections against §37

Live, against a served `dist/`:

| # | Injection | Before this run | After |
|---|---|---|---|
| A | throw in `Learn` | `#root` **0 children / 0 bytes**, blank | **5,964 bytes**: message + header + nav |
| B | tap Review while Learn is crashing | — | Review queue renders, alert gone (`key={tab}`) |
| C | throw in `App` itself, `ecycles_lang=ja` | blank | **Japanese** `AppError` from a tree App never rendered |

**A corroboration I did not design.** The console history spans both sides of the fix, and the
pre-fix chunk logs the identical error as **`Uncaught`** while the post-fix chunks log it through
**`[ErrorBoundary]`** and never as uncaught. Independent of anything I asserted.

§37's battery — each a `perl`/`python` substitution against a named string, each restored from a
scratchpad copy, **never `git checkout --`**. Controls first and last: the unmodified tree **PASSes**
on both sides, and `git status` after it showed only the intended files modified.

| # | Injection | Result |
|---|---|---|
| 0 | control, unmodified | **PASS** |
| 1 | `ScreenBoundary` removed, `Learn` left bare | **FAIL**, named at `App.jsx:360` + region floor |
| 2 | `AsyncScreen` tags left unbalanced | **FAIL** — the integrity check fired first, refusing to report on a scan it cannot trust |
| 3 | `Practice` moved into `ScreenBoundary` (balanced, but no Suspense) | **FAIL** — the lazy-only rule holds |
| 4 | a new screen imported and rendered bare | **FAIL** — *this is the regression §37 exists to stop* |
| 5 | root boundary removed from `main.jsx` | **FAIL**, named |
| 6 | `.catch` dropped from `LessonReader`'s content loader | **FAIL**, named at the invocation line |
| 7 | **floor**: loader tables renamed `*_MAP` | **FAIL** — "0 invocation(s) … this scan has gone blind" |
| 8 | control, after all restores | **PASS** |

`npm run build` **✓ 932ms, exit 0**; `npm test` **exit 0**, 0 failures, the same **2 pre-existing
warnings** (item 94's translation debt, the 0% human review share). Final live read of the shipped
tree: 75,317 bytes, **0 alerts**, `<html lang>` `en` — the boundaries are inert when nothing throws.

#### Adversarial self-check (step 5)

- **Blindspot register** — `npm run check-blindspot` **passes all six**, run rather than reasoned
  about. This change does add user-facing prose, so §10.1 is live surface here: the new copy names no
  asset, no market, no action, and makes no forward-looking claim — it says a screen broke and to
  reload. No dates, no Dalio, no child-facing framing, no market figures.
- **`DECISIONS.md` conflict** — none. No persisted key added (the root boundary *reads* `ecycles_lang`
  through the existing reader), no routing change, no build change, and the new copy lives in
  `src/locales/*.js`, which is the `.js`-not-JSON decision's own shape.
- **Already-done backlog item** — no. `§37` returns **0 hits** across `AGENT_LOG.md`, the archive,
  `DECISIONS.md`, `LAUNCH_PLAN.md` and `scripts/` outside the section just written. **Control:** the
  same grep for `§36` returns `AGENT_LOG.md` and `check-data.mjs`. Item 96 is adjacent and its work is
  **not** redone — it owns the lazy screens and the `.catch`es, both of which §37 now *guards* rather
  than reimplements.
- **Own verification claim** — reproducible from the commands listed; every figure above came from
  that loop, and the two byte counts that matter (0 and 75,317) were each read twice.
- **A real conflict this check caught, and it was fixed inside the run rather than reported after.**
  The first §37 draft treated `ScreenBoundary` as sufficient for **every** screen. That passes a tree
  where a `lazy()` screen has a boundary but no `<Suspense>` — a state that renders nothing while the
  chunk is in flight. Injection 3 exists because of that; the lazy rule now requires `AsyncScreen`
  specifically.
- **Residual, stated rather than discovered later.** A render bug inside a *lazy* screen is still
  caught by `AsyncScreen` and still answered with `LoadFailure`'s wrong "couldn't be downloaded"
  wording. Now that `AppError` exists this is one line of code plus a decision about how to tell the
  two errors apart — **filed as item 100**, deliberately not smuggled into this commit.

#### Next

- **Item 98** (link-preview metadata) is the top of the list and is cheap; it serves §5's web funnel
  and its `<title>`-hardcodes-English clause is already measured rather than asserted (the previous
  run corroborated it while driving the picker).
- **Item 100** is the residual above — low priority, and read its "scope the discrimination method
  before writing it" bullet first.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Item 99 is worth its run against O-1 for the same reason item 97 was:
the blank page it removes is not reachable in development at all — it needs a real deploy, a real
redeploy under an open tab, or a real device — so it is a defect that can only ever be found by the
first user, who does not exist until O-1 lands.

### 2026-08-24 (scheduled dev-agent) — item 98: the whole product's link preview, and an icon that returned HTTP 200 while rendering nothing

Picked **item 98**, named first in the previous run's "Next" and the top of the board with item 99
closed. Non-item-93 work, so **W-5.2's ratio holds** — seven consecutive non-93 runs.

#### Step 3.5 — premise re-measured with controls; the claims held, and two facts the item did not have changed the scope

- **"`index.html` carries `charset`, `viewport` and `<title>` and nothing else"** — **CONFIRMED
  exactly.** A tag extractor over the file returned those three and no others: no `description`, no
  `og:*`, no `twitter:*`, no icon, no `theme-color`. **Control:** the same extractor found the three
  tags I already knew were there, so an empty `og:*` result is a real absence and not a dead regex.
  (The item said **11 lines**; the file is **12**. Trivial, recorded because a figure is a figure.)
- **"the `<title>` hardcodes English"** — **CONFIRMED, and the instrument was controlled.**
  `document.title` has **0 hits** across `src/`, while the control `documentElement.lang` has **1**
  (the §36 effect) — so the grep works and nothing has ever set the title.
- **"routes are hash-based, so per-lesson previews are not available"** — CONFIRMED in
  `lib/deepLink.js` and in `vite.config.js`'s own note. Scoped site-level, as the item asked.
- **NEW, and it removed two tags from the scope.** `og:url` and `og:image` are specified as
  **absolute** URLs, and this app **has no origin until O-1**. Worse, `base: "./"` exists precisely so
  the build is path-agnostic, and `vite.config.js` says in as many words that nothing here may
  hardcode a leading `/`. Shipping a guessed domain would break the one property the build is built
  around, so both tags are deliberately absent with the reason written into the file.
- **NEW.** The repo contains **no shippable image asset** — `public/` held only `data/market.json`,
  and the only images anywhere are the read-only launch-plan page scans in `working_files/`. So
  `twitter:card` is `summary`, not `summary_large_image`: there is no image to put in a large card.

#### What shipped

- **`index.html`** — `description`, `og:type`/`site_name`/`title`/`description`/`locale`,
  `twitter:card`/`title`/`description`, an SVG icon, and **two `theme-color` tags** (one per palette,
  matched to `--surface-canvas`, because the app follows the system scheme by default). The
  description carries the app's own disclaimer sentence rather than a marketing claim.
- **`public/icon.svg`** — one cycle drawn in a single stroke on the accent fill. SVG because it is the
  only icon format this repo can author without adding a raster toolchain (item 12's port-cost rule).
- **The tab title follows the picker.** One line added to the same `useAppState` effect that owns
  `<html lang>`, composed from `appTitle`/`appSub` rather than a sixth locale key — so the app's name
  keeps **one** definition.
- **`check-data.mjs` §38**, and **`check-blindspot.mjs`'s §10.1 file set now includes `index.html`.**

#### The two defects this run found in its own work, both by refusing to trust a green result

**1. The icon returned HTTP 200, the right content type — and rendered nothing.** `curl` said
`200 image/svg+xml`, which is the check a run naturally reaches for and which was **worthless**.
Opening the file in a real browser showed an **XML parse-error page**: my comment named the CSS
custom property `--fill-accent`, and a `--` inside `<!-- -->` terminates the comment and invalidates
the document. An icon has no console error and no layout to disturb, so **nothing else would ever have
reported this** — it would have shipped as a permanently blank favicon. Fixed, and **§38 now parses
the SVG** rather than only checking the file exists; the comment in the file explains why the property
name cannot be written there.

**2. My own report line lied under the exact condition it existed for.** §38 printed
`9 required <meta> present` from `REQUIRED.length` — a constant. Injection 1 removed `og:description`
and the line still read **"9 required present"** beside its own failure. Now `presentRequired` is
counted, and the same injection reads **8/9**.

#### Verification — a live five-language browser sweep, then twenty injections

Live, against a served `dist/` (the Environment note's technique, per W-1):

| Check | Result |
|---|---|
| `<title>` in all five languages | `en` Economic Cycles — Master the Economy · `ko` 경제 순환 — 경제를 마스터하세요 · `zh` 经济周期 — 掌握经济运行 · `ja` 経済サイクル — 経済をマスターしよう · `es` Ciclos Económicos — Domina la Economía |
| the picker, **without a reload** | es → ko flipped title *and* `<html lang>` live, so the effect re-runs rather than only mounting |
| `<html lang>` unregressed (§36) | `zh` still `zh-Hans`, each other locale itself |
| icon | `200 image/svg+xml`, **and rendered** — screenshotted after the fix |
| shipped tree | `#root` 78,004 bytes, 1 child, **0 alerts**, 0 console errors |

**`en` alone proves nothing here** — the static and runtime titles are identical in English, so the
four non-English locales are the whole test. That is why the sweep is five rows and not one.

§38's battery — each injection **proved to have landed** before its result was read, each restored
from a scratchpad copy, **never `git checkout --`**. Controls at both ends.

| # | Injection | Result |
|---|---|---|
| 0 | control, unmodified | **PASS** |
| 1 | `og:description` removed | **FAIL**, named (and exposed the constant-count bug above) |
| 2 | `description` emptied | **FAIL** — "empty unfurls the same as absent" |
| 3 | `<title>` renamed | **FAIL** — named against en's `appTitle`/`appSub` |
| 4 | `og:title` drifts from the app name | **FAIL**, named |
| 5 | icon file deleted | **FAIL** — "links an icon it does not serve" |
| 6 | one `theme-color` dropped | **FAIL** — palette count |
| 7 | `theme-color` loses its media query | **FAIL**, named |
| 8 | `document.title` set from a literal | **FAIL** — "a second definition of the app's name" |
| 9 | the title assignment removed | **FAIL** — "nothing under src/ assigns document.title" |
| 10 | **floor**: head stripped to two tags | **FAIL** — the floor fires *by name*, not only the gaps |
| 14 | **the real bug**: `--` inside the SVG comment | **FAIL**, named |
| 15 | `</svg>` removed | **FAIL** — 1 unclosed element |
| 16 | `xmlns` dropped | **FAIL**, named |
| 17 | unterminated comment | **FAIL** — twice, by two independent rules |
| 19 | `og:description` drifts from `description` | **FAIL** — all three quoted side by side |
| 20 | control, after all restores | **PASS** |

**Injection 8 failed to land the first time and I nearly recorded it as a passing check.** The source
held `\u2014`, not a literal em-dash, so the substitution matched nothing while the test *looked*
clean — a silent no-op is indistinguishable from a guard that caught nothing. Every injection above is
now asserted to have landed before its result is read, and the escape is a literal em-dash, matching
the rest of the repo.

**The §10.1 extension was proved by a genuine before/after**, and the first attempt at that was also
worthless: running the pre-change script from the scratchpad **crashed** on `ROOT` resolution and
printed nothing, which reads exactly like "scanned it and found nothing". Re-run from inside
`scripts/` so `ROOT` resolves: advice-adjacent prose injected into all three description tags is
**PASSed by the old script** (blind) and **FAILed by the new one**, which names all three lines.
**Control A:** the old script PASSes the clean tree, proving it runs at all.

`npm run build` **✓ 971ms, exit 0**; `npm test` **exit 0**, 0 failures, the same **2 pre-existing
warnings** (item 94's translation debt, the 0% human review share).

#### Adversarial self-check (step 5)

- **Blindspot register** — `npm run check-blindspot` **passes all six**, run rather than reasoned
  about. This change adds user-facing prose, so §10.1 is live surface: the description names no asset,
  no market and no action, and it **carries the disclaimer sentence itself**. Explicit greps on the
  two new files: `dalio` **0**, market figures **0**, child-facing terms **0**. One `20\d\d` hit,
  checked rather than waved through — it is the SVG namespace URL `www.w3.org/2000/svg`, not a date.
- **`DECISIONS.md` conflict** — none, and the nearest decision was read rather than recalled. The hash
  routing entry's reasoning is item 12's port-cost rule; this change adds **no dependency, no path
  router, no prerendering and no server rewrite**, and is scoped site-level *because* of that entry.
  A `<head>` is web-only, but an Expo port discards `index.html` wholesale, so the added port cost is
  zero. `public/` already ships a static asset (`data/market.json`), so the icon needs no new shape.
- **Already-done backlog item** — no. `favicon` and `theme-color` each return **exactly one** hit
  across `AGENT_LOG.md`, the archive and `LAUNCH_PLAN.md`: **item 98's own filing text**.
  `twitter:card` and `open graph` return **zero**. The four `og:` hits are substrings of `backlog:`.
  **Control:** `hash routing` returns 5 and 5 in the two logs, so the greps see the files.
- **Own verification claim** — reproducible from the commands listed. The two claims that would be
  easiest to fake are the ones with controls attached: the five-language sweep (because `en` is not
  evidence) and the §10.1 before/after (because a crashed script prints the same nothing as a clean one).
- **A real conflict this check caught, fixed inside the run.** The description is written **three
  times** because the three consumers do not reliably fall back to one another — three copies of one
  sentence, each read by a different client, so an edit to one changes the preview in some apps and
  not others with nothing reporting it. That is the same one-definition problem I had just fixed for
  the title and had not applied here. §38 now pins all three together (injection 19).

#### Next

- **Item 100** (`AsyncScreen` answers a render bug with a message about the network) is the top of the
  list. Read its "scope the discrimination method before writing it" bullet first — the item is
  explicit that matching on an error message is the brittle option.
- **Item 101** (filed below) is item 98's stated residual: `og:url` and `og:image`, both of which need
  the origin O-1 has not produced.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). Item 98 is the sharpest illustration yet of the O-1 shape: this run
built the preview card for **every shareable URL in the product**, and not one of those URLs exists.
The work is real and it is inert until someone drags `dist/` onto Netlify Drop.

### 2026-08-24 (scheduled dev-agent) — item 100: the boundary could not have chosen its words, because it never saw the error

Picked **item 100**, named first in the previous run's "Next" and the top of the board. Non-item-93
work, so **W-5.2's ratio holds** — eight consecutive non-93 runs.

#### Step 3.5 — premise re-measured with controls; the defect is real, and the item's estimate of the fix was wrong

- **"`AsyncScreen`'s fallback is `LoadFailure`"** — CONFIRMED at `src/App.jsx:57`, and confirmed to be
  the *innermost* boundary around the three lazy screens, so it wins over `ScreenBoundary` for
  anything thrown inside them.
- **"a render error inside a lazy screen gets the download wording"** — **CONFIRMED LIVE, not read.**
  A `throw` injected at the top of `Practice`, **proved present in the built chunk** (`grep` of
  `dist/assets/Practice-*.js`) before the result was read, rendered:
  *"DIDN'T LOAD — This content couldn't be downloaded. Check your connection, then reload the page."*
  The console carried the probe error itself, which is the proof the chunk **downloaded and ran**.
  **Control:** the same build with the probe removed renders Practice normally, 0 `[role=alert]`.
- **"`AppError`'s copy already exists in all five languages"** — CONFIRMED; `appErrorTitle` and
  `appErrorBody` are present in all five locale files, so the fix cost no new translation.
- **PREMISE CORRECTION — "the gap is one line of code" is false, and the reason changed the design.**
  `ErrorBoundary` **discarded the caught error**: `static getDerivedStateFromError()` took no
  parameter and state was `{ failed: false }`. No fallback could have discriminated no matter how it
  was written, because nothing above it ever carried the error. The real shape is three edits, and
  the boundary change is the load-bearing one.

#### The discrimination method, scoped before it was written (as the item asked)

**Tagging at the `lazy()` call site, never matching the error text.** `chunk()` wraps the loader
thunk, so an `import()` rejection is the only thing that can produce a `ChunkLoadError`, and the
predicate is an `instanceof`. The rejected alternative — matching *"Failed to fetch dynamically
imported module"* — is a string owned by the browser and the bundler, differing across engines and
breaking silently on a React or Vite upgrade, with the symptom appearing only on a reader's device.

**The default is deliberately the safe direction.** Anything untagged reads as a render error, because
`AppError`'s copy ("hit an unexpected error", reload) is true of *both* events while `LoadFailure`
makes a claim about the network that can be a lie. A gap in the tagging therefore degrades to a vaguer
message, never to a wrong one. The item's offered fallback — widen `loadFailedBody` to cover both —
was **not** taken: it discards the network hint in the one case where the hint is true.

#### What shipped

- **`src/lib/chunkError.js`** — `ChunkLoadError`, `chunk()`, `isChunkLoadError()`. The `cause` is
  preserved, so the underlying `TypeError` is still in the console for a bug report; the tag adds a
  fact rather than replacing one.
- **`ErrorBoundary`** captures the error and accepts a **function** `fallback`. Node fallbacks still
  work, so `main.jsx`'s root boundary and `ScreenBoundary` are untouched.
- **`AsyncScreen`** picks `LoadFailure` for a tagged chunk failure and `AppError` otherwise.
- **`check-data.mjs` §39**, and **§37's "what is deliberately not checked" note**, which named this
  exact residual as its own and is no longer true.

#### The defect this run found in its own work

**§39's summary line asserted the very thing it had just failed.** With message-matching injected, the
line still printed *"AsyncScreen picks LoadFailure vs AppError by tag, not by message"* beside three
failures saying otherwise — the **same shape as §38's constant-count bug two runs ago**, in a section
written by the run that had read that entry. The words are now derived from the behavioural result and
the text scan, and the same injection reads
*"BY SOMETHING OTHER THAN THE TAG — see the failures above; 1 false positive(s) … 1 error-text read(s)"*.

#### Verification

Live, against a served `dist/` (the Environment note's technique, per W-1) — all three states, because
one direction proves nothing:

| State | Rendered |
|---|---|
| render throw in a lazy screen | **"Something went wrong … your saved progress is not affected"** |
| its chunk moved aside (a real 404) | **"Didn't load … couldn't be downloaded. Check your connection"** |
| clean build, chunk restored | Practice renders, **0 alerts** |
| **`ja`, render throw in `Reference`** | **問題が発生しました** + the ja body; nav 学習/復習/資料, `<html lang>` `ja`, title 経済サイクル |
| header + bottom nav in every failure state | **survive** — the reader can still reach another tab |

The 404 state also re-confirmed the module-map behaviour `ErrorBoundary` documents: a same-document
reload could **not** recover after the chunk was restored, only a fresh document could. That is why
the button says "Reload".

**Code splitting survived the wrapper** — `dist/` still emits separate `Practice-*`, `Reference-*` and
`LessonReader-*` chunks, checked because Vite needs a literal specifier and `chunk()` sits around the
arrow that holds it.

§39's battery — **12 injections plus 2 controls**, each **proved to have landed** before its result
was read (an edit that matched nothing threw rather than reporting a pass), each restored from a
scratchpad copy, **never `git checkout --`**:

| # | Injection | Result |
|---|---|---|
| 0 | control, unmodified | **PASS** |
| 1 | a lazy screen loses its `chunk()` wrapper | **FAIL**, names the screen |
| 2 | `AsyncScreen` reverts to one fallback | **FAIL** |
| 3 | predicate kept, but both branches are `LoadFailure` | **FAIL** |
| 4 | `ErrorBoundary` stops capturing the error | **FAIL** |
| 5 | `ErrorBoundary` reverts to a node-only fallback | **FAIL** |
| 6 | the predicate goes back to matching the message | **FAIL — by three independent rules**, one of them behavioural |
| 7 | `chunk()` drops the `cause` | **FAIL** |
| 8 | `chunk()` stops tagging | **FAIL** |
| 9 | `chunk()` mutates the *resolved* module | **FAIL** |
| 10 | `en`'s crash copy drifts back to connection wording | **FAIL** |
| 11 | `ja` copies its load copy into its crash copy | **FAIL** |
| 12 | `App.jsx` stops importing `chunk()` | **FAIL** |
| 13 | control, after every restore | **PASS** |

Injection 6 is the one that matters: it is caught **behaviourally** (a `TypeError` carrying the
browser's real module-fetch message must not be recognised) as well as textually. A text scan alone
would have been satisfied by a cleverer regex.

`npm run build` **✓ 919ms, exit 0**; `npm test` **exit 0**, 0 failures, the same **2 pre-existing
warnings** (item 94's translation debt, the 0% human review share).

#### Adversarial self-check (step 5)

- **Blindspot register** — `npm run check-blindspot` **passes all seven**, run rather than reasoned
  about. This change adds **no user-facing string at all** — it reuses copy that already shipped in
  five languages — so §10.1's surface is unchanged. Greps on the three touched files plus the new one:
  `dalio` **0**, advice verbs **0**, child-facing terms **0**. Four `20\d\d-\d\d-\d\d` hits, checked
  rather than waved through: all are dated source comments, the repo's own convention, and §2.3's
  scan is over teaching-copy modules, none of which this run touches. **Control:** the same grep
  returns 2 for a file I knew carried dates.
- **`DECISIONS.md` conflict** — none, and the nearest entries were read rather than recalled. Item
  12's port-cost rule: **no dependency added** (`package.json` and `vite.config.js` are byte-identical
  this run), and `chunkError.js` is dependency-free ES module code that a React Native port keeps
  verbatim. The `LessonReader` chunk-split entry depends on Vite seeing literal specifiers — checked
  live, the split is intact. localStorage-only and `.js`-not-JSON are untouched.
- **Already-done backlog item** — no. `chunkError`, `isChunkLoadError` and `ChunkLoadError` return
  **0** hits across `AGENT_LOG.md` and the archive; **control:** `ErrorBoundary` returns 7. This
  *completes* items 96 and 99 rather than redoing either — §37's own comment had filed this residual
  under "what is deliberately not checked", and that note is corrected in the same commit.
- **Own verification claim** — reproducible from the commands listed. The claim easiest to fake is
  "the render throw was really a render throw", which is why the proof is the probe's own console
  error plus its presence in the built chunk, not the absence of a network error.

#### Next

- **Item 101** — `og:url` and `og:image`. **Blocked on O-1**, which is the point of it; do not pick it
  before there is an origin.
- With 96/97/98/99/100 all closed, the board's unblocked items are thin. A **backlog refill** (W-2's
  standing rule) is a legitimate and probably correct pick for the next run — re-read `LAUNCH_PLAN.md`
  against the real `src/` tree rather than extending this note chain.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). This run fixed the sentence a reader sees when a screen breaks. **No
reader has ever seen either sentence, right or wrong**, because the app has no URL.

### 2026-08-25 (scheduled dev-agent) — item 102: two landmarks the app never had, and the run that had already checked this markup and called it correct

The board's unblocked items were thin and the previous run's "Next" said so, naming a **backlog refill**
(W-2's standing rule) as the probable pick. Took that, but grounded it the way W-2 asks — *"checked
against the actual `src/` tree, not proposed from a note"* — by running a **live DOM sweep of the built
app** and filing what it found. It found a real defect in the app's most-used control, so the run
shipped that and filed the rest. Non-item-93 work, so **W-5.2's ratio holds** — nine consecutive
non-93 runs. Owner tree at start: `OWNER-TREE a2d919f5662300aa11d96c799a15ba19c2498fc52254832fc2d4ed1578637afa` (2 tracked
modified — both mine — and 52 untracked, all under the owner's `UIUX/` and `drafts/`).

#### Step 3.5 — the premise here was "the board is thin", and it was re-measured against each item, not read off the summary

W-5.2's own lesson from 2026-08-24 is that **a pick list is a claim about current state and goes stale
exactly like a figure does**, so every candidate was checked against its own item text before the sweep
started: **64** and **67** closed (struck 08-24); **70** closed ("✅ DONE 2026-08-17"); **71** carries an
explicit gate — *"take it only when one of these numbers has actually been wrong once"* — that has not
fired; **74** is by its own text not dev-agent work; **76** is blocked on a per-language tokeniser;
**101** is genuinely blocked on O-1; **94** is parked behind O-1 by its own box. That is the whole
unblocked board, and the conclusion held.

#### What the sweep is, and the control that makes its zeros mean something

~30 lines of `javascript_tool` against a served `dist/`, run on Learn, Review, Reference, the Sector
screen and the lesson reader: duplicate ids, buttons with no accessible name, `aria-controls` /
`aria-labelledby` / `aria-describedby` that resolve to nothing, heading order, sub-44px hit targets,
horizontal overflow. **Every category returned 0 except two** — which is only meaningful because the
instrument was shown to fire: the same scan that reported `panel-practice` and `panel-reference` as
unresolvable reported `panel-learn` as resolvable **in the same call**, so a positive and a negative
came out of one measurement. Sub-44px targets returned 0 across all five screens, independently
re-confirming the 2026-08-23 touch-target work.

#### The defect, and why forty static checks could not see it

**An explicit `role` REPLACES an element's implicit role.** So `<main role="tabpanel">` exposed **no
`main` landmark** and `<nav role="tablist">` exposed **no `navigation` landmark** — on every screen,
including each of the 40 lessons. Landmark jumping (VoiceOver's rotor, NVDA's `D`) is the normal way a
screen-reader user skips a sticky header, and there was nothing to jump to.

Riding on the same element: `<main>`'s id is `panel-${tab}`, so only the **active** tab's panel exists,
yet all three tabs carried `aria-controls={`panel-${item.key}`}` unconditionally. Two of three tabs
pointed at ids no element had — a dangling IDREF (axe's `aria-valid-attr-value`), on every screen.

**PREMISE CORRECTION, and it is the reason this item exists at all.** The archived accessibility run
that added the roving-tabindex keyboard pattern to *this very nav* inspected *this very markup* and
recorded that it was **"already wired correctly, not something to fix"** — naming `role="tablist"` on
the `<nav>`, `aria-controls` on each button, and `role="tabpanel"` on `<main>`. Every one of those
attributes **is** individually correct; the **composition** is what was broken. That run verified by
reading attribute wiring against the APG pattern, which cannot see this, and no static check since has
been able to either. The entry is a dated record and stays verbatim (§31); item 102 carries the
correction.

#### What shipped

- **`src/App.jsx`** — `role="tabpanel"` moved off `<main>` onto an inner `<div>`, `role="tablist"` off
  `<nav>` onto an inner `<div>`; both landmarks restored, both patterns intact.
- **`aria-controls={active ? `panel-${item.key}` : undefined}`.** The five other tablists in this app
  each carry a comment about keeping the panel rendered and `hidden` so the reference always resolves;
  **that answer is unavailable in the shell**, because the three screens are separate lazy chunks and
  mounting all three would download all three on open. Scoping to the selected tab is truthful:
  activation follows focus in `onTabKeyDown`, so a tab can never be focused while inactive.
- **`check-data.mjs` §40**, written as a **general rule rather than a patch** — no element with an
  implicit landmark role (`main`/`nav`/`header`/`footer`/`aside`) may carry an explicit `role`
  *anywhere* under `src/`. `<section>` and `<form>` are deliberately excluded: their landmark roles are
  conditional on an accessible name, so a bare `role` on them is not automatically a loss.
- **Zero new locale keys.** `t.appTitle` moved from `<nav>` to the inner tablist — no translation debt
  in any of the five languages.

#### The trap inside the check, caught by its own control

§40 bans the string `<main role="tabpanel">` — and `App.jsx`'s new comments **spell that string out as
the thing not to do**. A scan that reads comments flags the documentation of the fix as the bug. Hence
`stripComments()`, and hence injection 7 below, which exists to prove that line is load-bearing rather
than tidy: with stripping disabled, §40 fires **2 false positives on its own documentation**.

#### Verification

Live, against a served `dist/` (the Environment note's technique, per W-1). The rendered
**accessibility tree**, not the DOM, because the DOM is what the earlier run read:

| State | `read_page` tree |
|---|---|
| after the fix | `main` › `tabpanel`, `navigation` › `tablist "Economic Cycles"` |
| **control: the two roles re-injected into the live DOM** | `main` and `navigation` **gone** — collapse to `tabpanel` / `tablist` |
| after reload | both landmarks back |

That middle row is the proof the tree instrument can show the failure, and it reproduces the pre-fix
state exactly. Also checked live: **0 dangling references on all three tabs** (active tab resolves,
inactive tabs carry no attribute); **ArrowRight from Learn** moves focus to Review *and* switches the
panel, so the roving tabindex survived the restructure; **`ja`** renders landmarks intact with the
tablist labeled 経済サイクル and `<html lang>` `ja`; layout unchanged at 375x812 by screenshot, `scrollWidth === clientWidth === 375`
on every screen. **Code splitting survived** — `dist/` still emits separate `Practice-*`, `Reference-*`
and `LessonReader-*` chunks.

§40's battery — **7 injections plus 2 controls**, each **proved to have landed** before its result was
read (an edit matching nothing throws rather than reporting a pass), each restored from a scratchpad
copy, **never `git checkout --`**:

| # | Injection | Result |
|---|---|---|
| 0 | control, unmodified | **PASS** |
| 1 | `<main>` takes `role="tabpanel"` back | **FAIL**, names the element and the lost landmark |
| 2 | `<nav>` takes `role="tablist"` back | **FAIL** |
| 3 | the inner `tabpanel` role is deleted | **FAIL** |
| 4 | the inner `tablist` role is deleted | **FAIL** |
| 5 | `aria-controls` goes unconditional again | **FAIL** |
| 6 | a **different file** overrides a landmark (`Learn.jsx`) | **FAIL** — the rule is general, not App.jsx-only |
| 7 | the check stops stripping comments | **FAIL ×2**, on its own documentation |
| 8 | control, after every restore | **PASS** |

**A correction to my own first reading of that table:** the battery initially reported "other=1" beside
every injection, which looked like a second section failing. It was not — my filter was counting the
suite's own `FAIL: N failure(s)` summary line. Re-run with the summary excluded, **§40 is the only
section that fires** in all seven. Worth writing down because an unexplained second failure is exactly
the kind of thing that gets waved through.

`npm run build` **✓ 1.06s, exit 0**; `npm test` **exit 0**, 0 failures, the same **2 pre-existing
warnings** (item 94's translation debt, the 0% human review share).

#### Adversarial self-check (step 5)

- **Blindspot register** — `npm run check-blindspot` **passes all seven**, run rather than reasoned
  about. This change adds **no user-facing string at all**: the only non-comment additions are two
  wrapper `<div>`s, one `style` change and the conditional attribute, verified by reading the filtered
  diff. Two `2026-08-25` hits in added lines, checked rather than waved through — both are in §40's
  own comment header, the repo's convention for dated source comments, and §2.3's scan is over
  teaching-copy modules, which `scripts/check-data.mjs` is not. **Control:** the same date grep returns
  `2026-08-24` from `public/data/market.json`, so the instrument fires.
- **`DECISIONS.md` conflict** — none. Item 12's port-cost rule: **no dependency added**;
  `package.json` and `vite.config.js` are byte-identical (`git diff --stat` empty). localStorage-only,
  `.js`-not-JSON and Vite-not-Expo are all untouched.
- **Already-done backlog item** — no, and this was the axis worth checking hardest, since the nav's
  ARIA has been worked on before. `"main landmark"` and `"navigation landmark"` return **0** across
  `AGENT_LOG.md` **and** the archive; **control:** `ErrorBoundary` returns 15. The 12 archived
  `aria-controls` hits were read, not counted: they are the *other* tablists (Learn tracks, glossary,
  policy sim, sectors, parent guide), each already solved by keeping its panel rendered. This run
  **corrects** the one entry that touched this markup rather than redoing it.
- **Own verification claim** — reproducible from the commands listed. The claim easiest to fake is
  "the landmarks are really there", which is why the proof is a tree reading with a two-sided control
  (inject the roles → landmarks vanish; reload → they return) rather than a single green screenshot.
  The injection battery left no residue: `git status` shows exactly two modified files, and
  `Learn.jsx` — mutated by injection 6 — is not among them.

#### Next

- **Item 103** (skip link) is the natural follow-on and is now cheap for the first time: it needs a
  `main` landmark to point at, which is what this run created. One new locale key in five languages.
- **Item 104** is a confirmed rendering bug (Sector ranks out of order) but carries a **product
  judgment** about the 1M/3M/6M control — worth the owner's eye, or an explicit choice recorded in the
  entry that picks it. **Item 105** proposes making this run's sweep a checked-in, repeatable thing.
- **Do NOT pick item 94** — optional track, four "(Beta)" languages, parked behind O-1 by its own box.

**Unchanged and still the entire critical path, both owner-blocked: O-1** (a deployed URL) and **O-2**
(item 18, an analytics account). This run gave the app two landmarks it never had. **No screen reader
has ever reached this app**, because it has no URL.
