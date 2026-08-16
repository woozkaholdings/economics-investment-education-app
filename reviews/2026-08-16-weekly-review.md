# Weekly Review — 2026-08-16

Reviewer: scheduled weekly-review task (quality control, not a dev run).
Period: 2026-08-09 → 2026-08-16. Branch `main`, local only, nothing pushed.
HEAD at review start and end of curation: `683a947`.

**Grade: A−.** The strongest week the project has had. Every priority the 2026-08-09 review set
was closed, the freeze it imposed did its job, and the agent broadened out of the content
treadmill into structural work, test coverage, accessibility and owner-directed UX. It is marked
down from an A by a real process regression in the last 48 hours (W-1 below) — the agent forgot
that it can verify UI in a browser and shipped six UI features unverified on that false belief.

---

## 1. Summary of the week's changes

**51 commits.** Cross-checked against `AGENT_LOG.md`'s run log entry-by-entry: **no mismatches
found.** Every run entry has a matching commit and every dev commit has a matching entry. (The
four "Refresh market data" commits come from the separate `economics-app-market-data` scheduled
task and correctly have no dev-agent entries.) One trivial labelling drift: the entry titled
"2026-08-16 (scheduled dev-agent)" committed at 22:09 on 08-15.

### The 2026-08-09 PRIORITY BLOCK — fully closed

| | Item | Outcome |
|---|---|---|
| P-1 | Stop adding lessons | Held. **No 41st lesson was added all week.** |
| P-2 | Refresh `LAUNCH_READINESS.md` | Done 08-09, refreshed again 08-16. |
| P-3 | `check-blindspot.mjs` → es/ko/zh/ja | Done 08-11, verified by injecting a real violation per language and confirming failure. |
| P-4 | Escalate the translation decision | Done 08-11 (owner chose option (a), accept under "(Beta)"), plus a review ledger with drift detection. Followed 08-13 by a full AI review pass — **160/160 lesson×language pairs**, which found and fixed three genuine fidelity bugs. |

### §4.3 Phase-0 content gate — both clauses now met

Seventeen lesson-deepening runs moved the minutes clause **101 → 120/120**. Combined with the
lesson-count clause (≥40, cleared 08-09), **both content clauses of the Phase-0 gate are met.**

I checked whether "120 minutes" is self-certified and it is not: `minutes` is machine-derived as
`round(words / 200)` from each lesson's English body text, and `scripts/check-data.mjs` recomputes
it and **fails the build if a hand-set value drifts**. The number the app shows a learner and the
number claimed against the gate are the same number, enforced. That is the right way to score a
gate, and it deserves credit.

### Structural and quality work (the genuinely encouraging part)

- **`lessonContent.js` split per track** (item 25's real fix) — `LessonReader` chunk 557.70 kB →
  5.92 kB; both content chunks now under Vite's 500 kB threshold, and the earlier 600 kB
  warning-limit override was removed rather than left as a permanent silencer.
- **Lesson ids renumbered to track order** (item 22, owner-directed) — money 1–28, economy 29–40,
  so a new learner's first lesson displays as "Lesson 1," not "Lesson 13." Scripted, not
  hand-edited, and shipped with a one-time client-side migration for already-installed users'
  persisted progress.
- **Test coverage added for five `lib/` modules** — lesson-id migration (bijection tests),
  `storage.js`, `analytics.js`, `marketData/adapters.js`, `marketData/fred.js`.
- **Accessibility** — roving-tabindex arrow-key nav on the bottom tab bar, then a live browser
  keyboard verification of it; later a real focus-management gap found and fixed in Practice.
- **Owner-directed Quizlet/Vocabulary design review** (~200 Mobbin screenshots) → six UX commits:
  dual right/wrong quiz markers, Review results recap, one-time Practice coach mark, glossary
  example sentences, Practice review-batch interstitial, glossary term-detail screen + bookmark
  toggle. Notably, the runs **declined to build paywall UI** from the reference material, per the
  owner's explicit instruction and §4.3's open Phase-0 gate. That restraint is the right call.
- **Kids content** — 15 → 21 blurbs, then a `why` ("why it matters") field on all 21 in all five
  languages, closing the content-depth question item 21 had left open.

---

## 2. Build and test status — **all passing**

Run with the bootstrapped portable Node v20.18.1 (`scripts/bootstrap-node.sh`, cache hit).

```
npm run build   ✓ built in 837ms — 66 modules, no warnings
                  largest chunk lessonContent.money 499.36 kB (under the 500 kB threshold)
npm test        PASS: 0 failure(s), 1 warning(s)
                  (warning is the known, non-blocking translation-review coverage line: 100%
                   coverage in all four languages, 0% human — accurate, not a bug)
check-blindspot PASS: 0 failure(s) — all 6 checks ok
```

No commit this week broke the build. No fix was needed, so I made no code changes.

### Live browser verification (done by this review)

Because the two most recent runs claimed they *couldn't* verify in a browser (see W-1), I did it
myself, using the technique the Environment note already documents: `npm run build` → serve
`dist/` with `/usr/bin/python3 -m http.server` → `preview_start` with a plain `url` → drive via
`javascript_tool`. It worked on the first attempt (`navOk: true`).

Verified against the live rendered app:

- App boots; first-launch disclaimer modal renders with the correct non-advice disclaimer text.
- First-open routing lands on **"Lesson 1 of 40 — Budgeting"** (the money track), confirming the
  track reordering and id renumbering work end to end for a new learner.
- **Glossary term-detail screen** opens on row tap; focus moves to the term heading
  (`document.activeElement` = the `<h1>`), matching the LessonReader pattern.
- **Bookmark toggle** works: label flips "Save term" → "Remove from saved", `aria-pressed` flips
  `false` → `true`, and it persists — `localStorage.ecycles_glossary_bookmarks` = `["GDP"]`.
- **Bookmarked state in the list**: the row renders the bookmark glyph and its accessible name
  becomes `"Gross Domestic Product, Saved"`.
- **The 08-16 no-results fix works**: searching a non-matching string renders "No terms match your
  search." — not the search placeholder it used to echo back.
- Review tab renders its empty-queue state with the disclaimer.

Still unverified (both need a populated review queue to reach): the **Practice review-batch
interstitial's focus management** and the **one-time Practice coach mark**. Left as a W-1 task.

---

## 3. Quality assessment, concerns, regressions

### Concern 1 (top) — the agent forgot it can verify UI, and shipped six features on that belief

This is the week's one real regression, and it is a *knowledge* regression rather than a code one.

On **2026-08-15**, the tenth run did something genuinely excellent: it took the standing assumption
"`preview_start` is disabled for scheduled tasks," **tested it instead of inheriting it**, found it
false, performed the first live keyboard/DOM verification ever done by an automated run, and wrote
the finding up.

On **2026-08-16**, one day later, the ninth run wrote that `preview_start` "is unavailable to
unattended scheduled runs in this environment" and deferred verification to "a future *interactive*
session." The tenth run repeated the same claim. Both are false, and I re-proved it this run on the
first try.

The cost is concrete: **six UI features shipped in ~24 hours with no rendered verification.** The
work turned out to be correct — I verified four of the six above — so this is a process failure, not
a defect report. But the pattern is precisely the one the 2026-08-09 review flagged in another form:
*a hard-won finding was recorded and then read past*. The finding lived only in a run-log entry
8,183 lines into an 883 KB file, while the Environment note above it still framed browser
verification through a 2026-08-04 *interactive-session* precedent.

Fixed structurally, not just noted: the Environment note now states the capability plainly, names
both confirmations, and says explicitly not to re-derive the limit from memory. Set as **W-1**.

### Concern 2 — the backlog stopped being where direction lives

**Seven of the last eight runs picked their work from the previous run's "Next run should pick"
line, not from the backlog.** The note chain produced good work, so this is easy to miss — but the
backlog's Open section had degraded to four items of which three were exhausted or closed (17, 24,
21) and one is owner-blocked (18). Two recent entries concluded "remaining dev-agent-actionable
areas are thin," which is a symptom of an unrefilled backlog, not of a finished product.

The clearest evidence: the **owner-directed Quizlet/Vocabulary design-review stream drove six
commits and was never entered in the backlog at all.** I have added it as item 26 and set **W-2**,
which makes "write backlog items" an explicitly legitimate run for an agent that finds nothing to
pick.

### Concern 3 — `AGENT_LOG.md` is now 883 KB / 9,533 lines, and every run reads it

Each of the 17 deepening runs wrote roughly 110 lines of log for a one-paragraph content change.
The file has roughly tripled in a week. Items 17 and 24 have each accreted a dozen "Update, <date>"
paragraphs, so the part that should be read every run (the backlog) is now buried in the part that
is history. Set as **W-3**: archive run-log entries older than ~14 days to `AGENT_LOG.archive.md`
and compress items 17/24 to current state plus a pointer. Nothing to be deleted.

### Concern 4 — small quality items (none blocking)

Found by my own read and live check, plus two the agent flagged itself:

- **Two `<h1>` elements on the Glossary term-detail screen** — confirmed live: `Reference`'s page
  heading and `TermDetail`'s own. One should be an `<h2>`.
- **Glossary rows are `role="button"` with an `aria-label` of only the term name.** Since an
  `aria-label` overrides element contents for name computation, the definition inside each row may
  not reach a screen-reader user navigating by control. Flagged as *check this with real AT*, not
  as a confirmed bug.
- **`TermDetail`'s bookmark control is documented as a "persistent action bar"** in both its commit
  message and its header comment, but is a normal in-flow button. Code and its own docs disagree.
- `MarketSignals.jsx`'s dead `counterReset: "principle"`, and `Settings.jsx`'s `ChoiceRow`
  radiogroup using Tab-per-option rather than the ARIA roving-tabindex pattern.
- Item 17's backlog text still shows a stale "118/120 minutes" though the clause closed at 120/120.

All folded into **W-4**.

### On the seventeen deepening runs

Worth stating plainly, because it looks like the old failure mode: it mostly isn't. The 2026-08-09
block explicitly authorised "the ~20 remaining minutes, or depth in existing lessons," the runs
moved a genuine unmet gate clause, the metric is machine-verified rather than self-asserted, and
**the agent stopped on its own** once the clause cleared, pivoting to test coverage and
accessibility without being told. That is the self-correction the freeze was meant to produce.

The residue of the old pattern is in the *logging*, not the work: seventeen near-identical
~110-line entries, each restating the whole item's history. That is Concern 3, and it is a cheaper
problem than the one it replaced.

### Content accuracy and neutrality — clean

- `check-blindspot.mjs` passes all six checks, now across **all five languages** (P-3), not English
  only as at the last review.
- No personalized financial advice, no buy/sell recommendations, no return promises found.
- Spot-read the GDP glossary entry: it correctly frames "two straight quarters" as *a common rule
  of thumb* and notes the US dates recessions on broader criteria — the careful hedging the
  2026-08-02 review asked for is holding.
- The 08-13 AI translation pass found and fixed three real fidelity issues, including an
  "rates already at 0%" overclaim in four languages. Good catch.
- §10.3 (kids/COPPA) stayed parent-facing and HELD; §10.2 (Dalio) stayed closed;
  `economic-cycles-v6.jsx` was correctly left untouched by every run — as it has been all month.
- The `method: "ai"` vs `human` distinction in the translation ledger is honest bookkeeping: the
  ledger reads 100% coverage / **0% human**, and `npm test` prints that every run rather than
  letting "100%" imply professional review.

### No regressions found

The quiz answer-key invariant, the disclaimer render set, the blindspot rules, and the market-data
staleness contract all held. The lesson-id renumbering — the riskiest change of the week, touching
every id-bearing surface — shipped with a user-progress migration *and* bijection tests, and the
live check confirms a new learner lands on Lesson 1 correctly.

---

## 4. Plan for next week

Set as a new PRIORITY BLOCK at the top of `AGENT_LOG.md`'s backlog, superseding (but retaining) the
2026-08-09 block:

1. **W-1 — Browser verification is available; use it on every UI change.** Environment note fixed
   so the finding stops being lost. Verify the two features I couldn't reach (Practice interstitial
   focus, Practice coach mark).
2. **W-2 — Refill the backlog.** Direction must come from the backlog, not from note chains.
   Writing backlog items is now an explicitly valid run. Design-review stream entered as item 26.
3. **W-3 — Archive the run log** (883 KB → manageable) and compress items 17/24.
4. **W-4 — Small a11y/correctness cleanups**, listed above.

**Explicitly not a priority: more lesson content.** Both §4.3 content clauses are met. A run
wanting to add or deepen a lesson must first name the unmet gate it moves — and there is no
content-side gate left.

### For the owner — what only you can unblock

1. **Item 18 — the analytics provider (PostHog account + key). This is now the entire critical
   path.** Both content clauses of the Phase-0 gate are met, so the ≥40% lesson-1-completion clause
   is the *only* thing left gating Phase 0 — and it is unmeasurable without a real provider, since a
   per-device `localStorage` log can't aggregate across installs. It has been blocked for eleven
   days. It also blocks the one deferred design-review follow-up (surfacing saved glossary terms),
   which three runs correctly declined to build without usage evidence. Nothing the dev agent can do
   substitutes for this.
2. **The app name (§10.7).** Everything still says "Economic Cycles" while the plan says economics
   is "the vehicle, not the product" and 28 of 40 lessons are personal finance. Runs are correctly
   refusing to invent a name.
3. **Item 12 (Expo vs. Vite)** and **item 19 (child-facing kids content / COPPA)** remain HELD and
   were correctly untouched all week.

### Uncommitted changes

`economic-cycles-v6.jsx` remains untracked at the repo root, as it has been since 2026-08-04. Not
touched by this review, and correctly not touched by any run this week. It is reference material of
unknown origin and must not be treated as a build fixture.

### One note on cadence

The dev agent ran roughly every two hours this week (12 runs on 08-15, 10 on 08-16), while
`AGENT_LOG.md`'s own header says "every 3 hours." Not a problem in itself — throughput was good and
quality held — but it is worth the owner knowing that backlog burn is now much faster than the
weekly-review cadence assumes, which is part of why Concern 2 (an empty backlog) appeared within a
week of the last one being set.
