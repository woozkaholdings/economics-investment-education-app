# Weekly Review — 2026-08-16

Reviewer: scheduled weekly-review task (quality control, not a dev run).
Period: 2026-08-09 → 2026-08-16. Branch `main`, local only, nothing pushed.
HEAD at review start and end of curation: `683a947`.

> **Updated twice since it was written. Sections 1–4 are the review as committed on the morning of
> 2026-08-16 and are left as the record of the week.**
> - **[§5](#5-addendum--the-rest-of-2026-08-16)** — the rest of 2026-08-16: 28 more commits in nine
>   hours, all four priorities closed the same day, and a content bug that took five passes to fix.
> - **[§6](#6-addendum--2026-08-16-evening-through-2026-08-17)** — 14 further commits through
>   2026-08-17, dominated by payload work: the app's two largest assets were both carrying five
>   languages to readers who read one.
>
> Where they disagree the later section is current: §2's build figures are superseded by §6.5, and
> §4's plan by §5.7 and then §6.7. HEAD at the latest update: `1ee13dc`.

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

---

## 5. Addendum — the rest of 2026-08-16

Written at end of day, HEAD `2836338`. The review above was committed at 09:17. Between then and
18:19, **28 further commits landed** — more than half the week's total (51) in nine hours, from the
scheduled dev agent and from owner-directed work in an interactive session.

### 5.1 All four W-priorities closed the same day they were set

| Priority set that morning | Closed by |
|---|---|
| **W-1** Browser verification | `b624f19` — the agent verified the Practice interstitial and coach mark live, the two features the review couldn't reach. Verification is now standard practice in run entries. |
| **W-2** Refill the backlog | `02e23a6` — items 27–32, each derived from a named launch-plan clause. |
| **W-3** Archive the run log | `57d9f89` (909 KB → 516 KB) + `93ea015` (items 17/24 compressed, 142 lines → 66). |
| **W-4** Small cleanups | `f58a253`, `058e889`, `9ec55fc`, `40ad455`, `8a78cfd` — all five done, including both a11y items. |

The agent's own run notes cite picking from the backlog "not from a note chain," which is W-2's
standing rule taking effect immediately.

### 5.2 What shipped from the refilled backlog — most of it the same day

- **Item 27 — money-track lesson visuals** (`39513e9`). Money went **0/28 → 3/28**: lesson 1
  (budget split), lesson 3 (compound vs simple interest), lesson 27 (loss-aversion asymmetry).
  Every figure is its own lesson's worked example. Verified live at 375px in dark mode.
- **Item 28 — glossary linking from lesson text** (`9cfd3c7`), plus **item 35**, 12 money-track
  glossary terms linked into lessons (`0161b89`). §3.0.3 was unmet since launch; it is now met.
- **Item 29 — §9.2 event payloads** (`9b496f4`): `lesson_completed` now carries duration,
  `quiz_taken` a score. The half of item 18 that was never owner-blocked.
- **Item 30 — `CLAIMS.md`**, the §9.1 falsifiable-claims register, with `check-claims.mjs` wired
  into `npm test` (`0112fc7`). 14 claims. Its most useful output is a concentration, not a claim:
  **10 of 14 are unmeasurable today and nearly all name item 18.**
- **Item 31 — shareable per-lesson URLs** (`a984b2d`), scoped as hash routes in one module with no
  router, respecting item 12's port-cost constraint. §5's web funnel now has something to link to.
- **Item 34 — "Be the Fed Chair"** (`2836338`). Extracted from the v6 prototype at 15:31 as a
  concept-only backlog item; **shipped inside lesson 35 by 18:19.** The one idea worth salvaging
  from that file is now a real feature, and the file itself is retired (§5.4).

### 5.3 The cross-reference bug — five passes, ~163 stale references, four premature all-clears

This is the day's most important finding, and it is a process finding, not a content one. The
2026-08-14 lesson-id renumbering left cross-references pointing at real-but-wrong lessons. It was
declared fixed four times before it actually was:

| Pass | Commit | Fixed | Why the previous "done" was wrong |
|---|---|---|---|
| 1 | `1e6af79` | 4 English | Renumbering regex matched capital `Lesson N`; lowercase survived |
| 2 | `bfeb719` | 74 es/ko/zh/ja + a §16 check | Pass 1 only looked at English |
| 3 | `543fd90` | 7 in `quizData.js` | Passes 1–2 and the new check all walked lesson prose only |
| 4 | `c9884bf` | 67 ko/ja | `레슨`/`レッスン` patterns matched **1 of 44** and **1 of 31**; the check was scanning almost nothing while reporting a clean pass |
| 5 | `0a8a7af` | 11 ja | The ja prose uses `第N課` **and** `第N講`; pass 4 added only `課` |

Two findings generalize beyond this bug:

- **A consistency check is not a correctness check.** §16 verifies translations agree with English.
  When the renumbering left `Lessons 18 and 20` stale in *every* language at once, all five agreed
  and the check stayed silent. A human reading the sentence against the lesson titles caught it.
- **A coverage ratio catches a dead pattern, not a half-dead one.** The tripwire added in pass 4
  fires below 20% of English; with `課` matching and `講` not, Japanese sat at ~48% and passed.

Pass 5 therefore stopped hand-enumerating surface forms (which had failed four times) and added an
**unrecognized-counter guard**: it finds the CJK ordinal `第<number><counter>` and fails on any
counter that isn't explicitly classified as a lesson reference or explicitly justified as not one.
A fifth surface form now breaks the build with the character in the message. Japanese coverage went
**31 → 44**, equal to ko and zh.

**This pattern is now recorded where it cannot be quietly forgotten:** `CLAIMS.md` carries D1 ("a
run's self-reported verification can be trusted") and D2 ("a green `npm test` means the property
holds") as **already refuted**, citing this bug as the evidence.

### 5.4 Both prototypes retired (owner decision)

`economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` are now **gitignored and left on disk,
untouched** — ignored, not deleted (`d7b7153`, `9e2fd3c`). v5 was untracked via `git rm --cached`
with its content still in git history; v6 was never tracked. This ends twelve days of every run
writing a "not touched, and why" note about v6. It was safe because v6 was audited first
(`cbec154`): it is imported by no code, everything in it had shipped independently, and its one
exception became item 34 — which then shipped the same day. Also `f111ca6`: `.scratch-*` ignored,
since runs leave throwaway analysis scripts behind.

### 5.5 Health at end of day — still green, with two things to watch

```
npm run build   ✓ 952ms, no warnings
npm test        PASS: 0 failure(s), 1 warning(s)   (check-data)
                PASS: 0 failure(s)                 (check-blindspot)
                PASS: 0 failure(s), 0 warning(s)   (check-claims, new)
                cross-references matched: en=64, es=43, ja=44, ko=44, zh=44
```

**Bundle sizes moved a lot** and deserve a look next week — `LessonReader` 5.92 → **38.46 kB**,
`markets` 17.57 → **58.70 kB** (glossary linking, deep links, the simulator), `Reference` 82.31 →
61.96 kB. `lessonContent.money` sits at **499.27 kB, still under Vite's 500 kB threshold by under a
kilobyte** — the next money-track content edit of any size will cross it. Item 17 already carries
this caution; it is now urgent rather than theoretical.

**Translation coverage dropped 100% → 93%** (3 lessons × 4 languages marked stale). **This is the
system working, not a regression** — lessons 5, 27 and 28 had their English edited by the
cross-reference fixes, and the P-4 ledger's drift detection fired for the first time since it was
built. It does need action: those 12 pairs need re-review.

### 5.6 New concerns found this evening

1. **Duplicate backlog item number.** Two different items are both numbered **34** — an a11y item
   about `MarketSignals.jsx`, and the Fed Chair simulator. Cosmetic today, but the backlog is now
   the direction mechanism (W-2), and two items sharing an id is exactly how a run picks the wrong
   one. Worth a renumber.
2. **An incomplete commit needed a follow-up.** `df4f3f8` is titled "Carry the item-37 content
   `6e9f766` was supposed to contain" — i.e. a run committed a message describing work the commit
   didn't include. Self-corrected within a minute, and worth watching rather than acting on.
3. **The premature all-clear pattern (§5.3)** is the one to actually carry forward. Four "done"
   claims on one bug, each made in good faith and each measured through the very instrument that
   was broken.

### 5.7 Revised plan for next week — supersedes §4

W-1 through W-4 are all closed, so the priority block that opened them is spent. What remains:

1. **Re-review the 12 stale translation pairs** (lessons 5, 27, 28 × es/ko/zh/ja). Small, and it
   restores the ledger to a true 100%.
2. **The `lessonContent.money` chunk at 499.27 kB.** Split it or raise the limit *consciously*, as
   a `DECISIONS.md` entry — do not let the next content edit cross the threshold by accident.
3. **Item 32 — run the §9.3 monthly blindspot audit.** Never performed; next first Saturday is
   **2026-09-05**. Item 30's `CLAIMS.md` now supplies audit question 4 ("which claim is past its
   check date"), which was previously unanswerable.
4. **Renumber the duplicate item 34.**
5. **Do not start new content.** Both §4.3 content clauses remain met; items 17 and 24 remain
   exhausted. Item 27's own text now says the scope it defined is built and needs re-scoping before
   anyone picks it again.

**For the owner, unchanged and now sharper: item 18 (the analytics provider) is the entire critical
path.** `CLAIMS.md` quantified it — **10 of this project's 14 written-down beliefs are unfalsifiable
until it exists.** Everything else on the Phase-0 gate is met. The app name (§10.7) and item 12
(Expo vs. Vite) remain open owner decisions; item 19 (child-facing kids content) remains HELD and
untouched.

**Grade for the week: unchanged at A−.** Today does not change the week's assessment, but it sharpens
the reason for the minus: throughput and craft are both excellent, and the thing holding it back from
an A is not effort or direction — it is that "done" has repeatedly been asserted through an
instrument that was itself broken. The unrecognized-counter guard and `CLAIMS.md`'s D1/D2 are the
first structural answers to that, and both landed today.

---

## 6. Addendum — 2026-08-16 evening through 2026-08-17

Written at HEAD `1ee13dc`. Fourteen commits since §5 was committed. The through-line is payload: the
two largest assets in the app were each shipping five languages to a reader who reads one, and
removing that exposed a second problem — documentation that described how to regenerate itself using
code paths that no longer existed.

### 6.1 The payload work (items 45 and 48)

| | Before | After |
|---|---|---|
| Largest lesson-content chunk | 499.27 kB | **116.84 kB** |
| Shared quiz chunk | 140.88 kB | **gone** — largest is 31.81 kB, one fetched |
| English reader's lesson body | 480 kB | **102 kB** |

Both started as "the chunk is near the 500 kB warning," and in both cases **measuring first changed
the fix.** Of `lessonContent.money.js`'s 480 kB: en 97 kB, es 90, ko 102, zh 79, ja 112 — ~80% was
text the device would never display. That is a payload problem wearing a build-warning costume, and
splitting the file in half would have bought headroom while shipping the same waste. Raising the
limit was rejected on precedent: it was done once (2026-08-12, set to 600) and deliberately removed
two days later as a symptom-silencer.

`quizData.js` was the same shape one file over — 128 kB of questions in five languages, **statically**
imported by both `Practice` and `LessonReader`, so it landed in a shared chunk every reader
downloaded whether or not they ever opened Review.

The quiz split had one hard constraint worth recording: **`review.js` keys every learner's Leitner
state by a question's index in the array, and that state is in `localStorage`.** Reordering would
silently re-point real review histories at different questions. So `quizMeta.js` holds the two
language-independent fields (`lesson`, `answer`) once and in order, `quizText.<lang>.js` holds the
words at matching indices, and scheduling reads only meta — the queue never depends on which module
finished downloading. The answer key lives once rather than five times, which is the same
"don't store a correctness-critical fact five ways" reasoning §5.3 arrived at the hard way.

Both splits were proven equivalent before anything was deleted: the reassembled merged views are
`JSON.stringify`-identical to the originals, all 40 English source hashes were unchanged (a moved
hash would have marked all 160 translation pairs stale), and the quiz `answer`/`lesson` keys match
index-for-index across 42 questions.

### 6.2 Live verification caught two bugs the suite could not

`npm test` was green through both of these; only a browser found them.

1. **A mid-session language switch kept the old language's question.** `Practice` merged text into
   session state at start, so the words froze while the chrome around them translated. Fixed by
   storing meta-only in session and merging at render — the class, not the instance. The same
   mistake had left the results recap reading `question.q[lang]` on what was now a plain string.
2. **The fix then crashed the screen.** Blanking `quizText` during the swap left `question.opts`
   undefined for one render of a live session — `TypeError` on `.map`, blank page. Fixed by not
   blanking: the previous language holds until the new module resolves, removing the window and a
   content flash together.

This is now the second consecutive session where the browser check found what the tests could not,
and it is the strongest argument for W-1 remaining a standing rule rather than a one-off correction.

### 6.3 My own change broke the docs, and the agent found it (items 46, 47)

Worth stating plainly because it is a consequence of this reviewer's work: **item 45's split turned
`LAUNCH_READINESS.md`'s two "how to refresh this file" snippets into `ERR_MODULE_NOT_FOUND`** — they
imported `content/lessonContent.economy.js`, which the split replaced with ten files. It was the
second time those snippets had rotted (item 25's per-track split broke them once already), and both
times **the figures printed beside them stayed correct while the method rotted** — the document was
right about the numbers and wrong about how to get them.

The agent's response went past the instance twice over:

- **Item 46** added a check that every backticked file path in `LAUNCH_READINESS`/`LAUNCH_PLAN`/
  `DECISIONS`/`CLAIMS` must resolve or carry an explicit `<!-- path-ok: … -->` waiver. A path is the
  one part of a document a script can verify without understanding what the document means.
- **Item 47** deleted the snippets entirely, replacing them with `scripts/refresh-readiness.mjs`
  (`--check` chained into `npm test`, `--write` to update in place). The reasoning is the good part:
  a check-only gate over hand-maintained figures "would be turned off within a week," and that
  objection dissolves once the figure is generated rather than typed.

### 6.4 Correctness finds by the dev agent

- **Item 44 — a real user-facing bug, on a screen written to prevent exactly it.** `useMarketData`'s
  staleness test was one-sided (`ageDays > STALE_AFTER_DAYS`), so a **null** age passed as fresh:
  `null > 4` is false. The pre-fix build served the Sector screen rendering all eleven sectors under
  the heading **"As of undefined"** — undated figures, from the code whose whole purpose is §2.3's
  no-undated-figures rule. A negative age (wrong device clock) passed the same way.
- **Item 38 — `new Date().toISOString().slice(0,10)` is not today, it is today in UTC**, which after
  8pm Eastern is tomorrow. Three sites, including the `asOf` stamp that market-data staleness is
  measured *from*. Filed as cosmetic and one file; was neither.
- **Item 39 — scoped to "no," which was the valuable answer.** The proposed rule (a check and the
  document it guards must land in the same commit) is unenforceable here, and the reason is worth
  knowing: **this repo commits via `write-tree`/`commit-tree`/`update-ref` because `git commit`
  porcelain hangs, and plumbing runs no hooks.** Verified in a throwaway repo. With no CI and no
  usable remote, `npm test` is the only gate — and it runs against a working tree, before a commit
  exists, so "same commit" is not a property it can observe.

### 6.5 Health — green, and the shape of the bundle has changed

```
npm test   PASS check-data (1 warning) · PASS check-blindspot · PASS check-claims · PASS check-backlog
           cross-references: en=64, es=43, ja=44, ko=44, zh=44
           §9.1 claims register: 15 claims, 2 refuted, 0 past due
           backlog: 30 items, 68 "backlog item N" citations, all resolve
npm run build   ✓ 22 chunks, no warnings
```

**The largest asset in the app is now the app itself** (`index`, 232 kB) rather than content — the
first time that has been true. Content chunks now top out at 116.84 kB and a reader fetches two of
them. Translation coverage is back to **100%, 0 stale** in all four languages.

`npm test` now chains four checks, up from one a week ago: data shape, blindspot register, claims
register, backlog integrity — plus the readiness figures via `--check`.

### 6.6 Concerns

1. **Nothing is enforcing that a reader ever sees the small chunks.** Both splits are verified by
   me opening the app and reading the network panel. There is no test asserting "opening a lesson
   fetches one content file," so a future refactor that statically imports a merged view would
   silently restore the 480 kB payload with every check still green. That is the same
   shape as §5.3's lesson — a property nobody checks is a property that drifts.
2. **`AGENT_LOG.md` is growing again**, and fast: the run log has taken on 14 substantial entries
   since the 909 kB → 516 kB archive on 08-16. The archiving rule written into
   `AGENT_LOG.archive.md` says to move entries older than the previous review boundary at each
   Sunday review — which is due this coming Sunday and should not be skipped.
3. **Two items were filed by a run while this reviewer held the same numbers in flight** (46, 47 vs.
   my 48). The `check-backlog` guard caught it before it landed, which is the guard working — but it
   is a symptom of two writers with no coordination beyond a file, and it will recur.

### 6.7 Revised priorities — supersedes §5.7

1. **Assert the payload property in a test.** Concern 1 above. Something as simple as failing if
   `Practice.jsx`/`LessonReader.jsx` statically import a merged content module would hold the line.
2. **Item 32 — the §9.3 monthly blindspot audit**, still never run; next first Saturday is
   **2026-09-05**. `CLAIMS.md` now answers its question 4 ("which claim is past its check date"),
   which was previously unanswerable.
3. **Archive the run log again at the Sunday review**, per the rule already written down.
4. **Do not start new content.** Both §4.3 content clauses remain met; items 17 and 24 remain
   exhausted; item 27's own text says the scope it defined is built and needs re-scoping first.

**For the owner, unchanged and now the only thing left: item 18, the analytics provider.**
`CLAIMS.md` quantifies it — **10 of the project's 15 written-down beliefs are unfalsifiable until it
exists**, and the ≥40%-lesson-1-completion clause is the sole remaining Phase-0 gate. The app name
(§10.7) and item 12 (Expo vs. Vite) remain open owner decisions; item 19 (child-facing kids content)
remains HELD and untouched.

**Grade for the week: unchanged at A−.** Nothing since §5 changes the week's assessment. If anything
it sharpens the same point: the two best pieces of work in this stretch — the payload splits and the
readiness-figure generation — both came from measuring something that had been asserted, and the two
worst bugs were both found by looking at the running app rather than at a green test.
