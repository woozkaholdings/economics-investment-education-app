# Weekly review — 2026-09-27

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-09-20 → 2026-09-27.
Working tree at review start: `deb8cdf`, clean apart from two untracked directories
(`Migration/`, `UIUX/`) that are the owner's and were not touched.

**Grade: B+.** Execution is an A — the best-evidenced content work this project has produced.
Direction is what pulls it down: the two mandated high-value items closed on 2026-09-22, and the
remaining five days went back into an unbounded proofreading mode while the only thing standing
between this app and its Phase-0 gate is an owner action nobody escalated.

---

## 1. What shipped

**30 commits.** 25 dev-agent, 5 market-data refreshes. Every run-log entry has a matching commit
and every commit has an entry — **15 live entries against 15 non-market commits for 09-21 → 09-27,
no mismatch in either direction.** The 09-20 entries were archived mid-week by W-5.3's twentieth
firing and are present in `AGENT_LOG.archive.md` under `## Archived 2026-09-20`.

### The headline: W-8.5's two mandated picks are both closed

| | before | after |
|---|---|---|
| Abridged lesson/language pairs | 47 across 12 lessons | **0 across 0 lessons** |
| `npm test` warnings | 3 (a fortnight ago) | **1** |

- **Item 94 — the `essentials` track — CLOSED 2026-09-22.** Twelve lessons fully translated in
  four languages across 09-20/21/22 (lessons 1, 6, 10, 9, 3, 2, 8, 5, 7, 4, 11, 14). **All three
  tracks now clear the completeness threshold in all five languages.** Lesson 14 turned out to
  need four languages rather than the three the item budgeted — Spanish had been hidden behind a
  threshold artifact for seventeen days, and the run that found it said so plainly rather than
  quietly doing the extra work.
- **Item 160 — the quiz option-length cue — closed.** The `q039` key was 178 code points against
  a 120-point longest distractor, and the tail duplicated text the learner is already shown in
  `explain`. The entry that fixed it also explains *why* the item's own STOP LINE had wrongly
  declared nothing was left: it ranked all 46 questions, examined only the top four, and
  generalized.

### Seven hand-read translation passes (09-25 → 09-27)

Glossary names → quiz stems → per-paragraph sweep → section headings → lesson titles → quiz
options → quiz explanations. Roughly **thirty real defects** fixed. See §5 — this is simultaneously
the week's best work and the week's direction problem.

### One code change and one archiving pass

- **Item 152** (`afa59b5`): lesson 23's tinted zones now derive their colors from the reward they
  belong to via `flipZoneSeries()` instead of a hand-written array that had to be written
  backwards. Guarded by `check-data.mjs` §50(k). Clean, and the comment explaining why `[1, 0]`
  is correct and *looks* wrong earns its ten lines.
- **W-5.3's twentieth firing** (`24bc2d0`): 2026-09-20 (14 entries, 165,564 b) moved verbatim to
  the archive; run log 242,150 → 76,586 b.

---

## 2. Build and test status

Run 2026-09-27 with the runtime `scripts/bootstrap-node.sh` reported (system Node **v26.7.0**,
npm 11.19.0 — no download needed).

| check | result |
|---|---|
| `npm run build` | ✅ **passes**, built in 1.01s, exit 0 |
| `npm test` | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm run check-deployed` | ❌ **DIVERGED** — see §4 |

The single warning is **O-3's**: translation review coverage is 100% reviewed / **0% human** in
all four non-English languages. That is an owner decision, not a defect — and §5 argues it has
become a much sharper one.

**Nothing was broken this week, so no build fix was needed.** All `check-log-size` controls pass;
the five sections still sum byte-exactly to the file.

---

## 3. Quality, accuracy and neutrality

**No regressions found. No content-accuracy problems found. No advice-adjacency found.**

`npm run check-blindspot` is green inside `npm test`, with per-language pattern sets for all five
languages. I read the week's content diffs directly rather than trusting the check. Every change
is translation fidelity or factual precision:

- The Rule of 72 now says what it approximates (doubling time).
- "QE" is spelled out in `zh`/`ja`/`es`.
- The Yield Curve glossary entry no longer shows two different start years two sentences apart —
  and, importantly, **it reconciled them without weakening either claim**, keeping its hedge and
  explaining that 1976 is where daily 10y−2y data begins.
- Lesson 23's zone tints are now derived rather than hand-typed.

**No buy/sell language, no personalized advice, no recommendation, no hedge removed.**

The methodological discipline is genuinely high and worth recording. Two examples from the last
commit alone: lengthening one `zh` explanation raised that language's p90 and tipped two others
below the shortfall threshold — the run **repaired both rather than whitelisting them**, because
they turned out to be real omissions; and a particle scan was written in Node rather than grep
because the repo's `grep` is ugrep and aborts on bounded repetition. Positive and negative controls
appear on both sides of nearly every claim.

---

## 4. Concerns

### 4.1 A 72-hour dev-agent outage, and the task entry that should record it is disabled

Dev-agent commits per day, 09-20 → 09-27: **10, 4, 1, 0, 0, 4, 4, 2.** The gap from `2783821`
(09-22 00:19) to `8af3d04` (09-25 00:05) is **~72 hours, about 12 missed runs** at the 6-hour
cadence. The market-data job committed at 19:49 on both 09-23 and 09-24, so **the machine was up
and the dev schedule was not.** No entry mentions it — a run that does not fire cannot write one.

**This is the second consecutive week with a multi-day silent gap** (W-8.2 recorded ~40 hours) and
it is getting longer, so it is no longer reasonable to read it as a one-off.

⭐ **New, and actionable by the owner:** the scheduled task `economics-app-dev-agent` is
**`enabled: false`, `lastRunAt` 2026-09-07**, cron every 2 hours. Commits have continued on a clean
6-hour cadence for twenty days, so **whatever runs the dev agent is not that task entry.** The
stale entry is still the `SKILL.md` a reader would open, and it still asserts *"the GitHub remote
is NOT usable — never push, never fetch"*, which stopped being true when O-4 made the repo public
and GitHub Pages became canonical. Worth reconciling which definition is authoritative; the
never-push rule should stay, the "NOT usable" claim should go.

### 4.2 The deploy lag is a weekend, not a coincidence — W-8.1 was right about the cost, wrong about the shape

Re-measured from `origin/main`'s reflog, which is the only record of it: pushes landed at
**21:16 on 09-21, 09-22, 09-23, 09-24 and 09-25** — five consecutive weekdays, each on or just
after that day's market commit — and **none on Saturday or Sunday.**

The same shape explains last week's alarm: W-8.1's "last push 2026-09-18, 28 commits behind" was
measured **on a Sunday**, at the peak of exactly this cycle, across the two highest-volume days the
project has ever had. The steady state is a reliable weekday push, not the coincidence O-5
describes.

**Current state, measured:** `npm run check-deployed` reports **❌ DIVERGED** — live
`assets/index-Csl251B_.js` against local `index-D_MFj2n0.js`, **6 commits** of 09-26/09-27 content
corrections not live, live `market.json` **asOf 2026-09-25, age 2 days**.

⚠️ **The residual risk is thin margin, and it is worth stating precisely because it is small.**
`STALE_AFTER_DAYS` is 4 and a Friday `asOf` is already 3 days old by Monday's push, so **one missed
Monday push takes Reference → Sectors dark on Wednesday.** O-5's route 1 (have the job push)
removes this; route 2 (document it) now has a much easier sentence to write than it did last week.

### 4.3 Log growth: the dev agent is no longer the cause, and this reviewer is

W-8.8 set the test "backlog below 413,641 b on 2026-09-27". Measured before this review wrote
anything: **411,512 b — 2,129 b under.** The test passes, and it reverses W-8.0's story.
**Run activity was net-negative on the backlog this week**, because items 94 and 160 were replaced
by their conclusions rather than annotated with them. W-7.2 rule 1 is working.

The accretion is now the **weekly reviews**: W-6 cost 17,717 b, W-7 12,567 b, W-8 11,676 b, and
**this block cost 10,677 b** — cheaper than all three, and still the largest single write of the
week. Owning the consequence plainly: the W-9 block moved the floor from **449,918 b (90.0% of
budget, 54.8 runs of headroom)** to **460,785 b (92.2%, 42.9 runs)**, which pulls the projected
floor WARN in from ~2026-10-11 to **~2026-10-08**. That is a real cost and it is the reviewer's,
not a run's.

The structural fix is measured and is now W-9.1: **137 of the 152 backlog items are closed and
occupy 244,116 b — 59.3% of the section.** W-5.3 has archived the run log twenty times; nothing has
ever archived the backlog.

### 4.4 The mode is unbounded and the constraint has moved

**Six of the last seven runs were a hand read of one ko/zh/ja short-string surface.** Every entry
cites W-6.2 rule 1 correctly — the chain was legally reset on 09-26 18:05 by one non-residual pick
(item 152) and immediately re-entered. **The rule counts consecutive residuals, not mode, so a
single interleaved pick buys an unbounded chain.** 44 lessons × every string × 4 languages is not
a finite queue.

Meanwhile **every §4.3 content clause is met** (44 lessons / 174 min / all tracks translated), and
the one unmet Phase-0 gate — installer lesson-1 completion ≥40% — is **❌ Unmeasurable** until a
provider key exists. The code half of O-2 has been done and verified since 2026-09-05. The owner
action is four steps and roughly twenty minutes.

**Nothing a run did this week moved the launch, because nothing a run can do moves it.** That is
not a criticism of the runs; it is the reason §5 belongs at the top of the owner's attention.

---

## 5. The week's most useful finding, and it is an argument for an owner decision

The proofreading passes have accidentally produced the strongest evidence O-3 has ever had.

O-3 asks the owner to re-affirm or cap shipping unreviewed machine translation. It was filed when
the defect rate was **hypothetical**. It is not hypothetical now. Seven hand-read passes found
roughly **thirty learner-visible defects**, including:

- an ungrammatical Korean particle after a vowel-final noun (`「은퇴 계좌」과` → `와`);
- a Japanese passive that made the *protection* pay the price, ungrammatical as written;
- a Japanese potential form reading "high earners are *able* to live paycheck to paycheck" —
  a capability where the lesson teaches a risk;
- four Spanish quiz stems missing the head noun that says what is being asked ("the most important
  part" — *of what?*);
- a Chinese section heading that dropped the concept its section teaches, and a Korean heading that
  turned the lesson's own question into a statement;
- "Rule of 72" with no mention of what it approximates.

⭐ **The finding is not that any one of these is severe. It is the density, and the surface.**
Six passes into six surfaces nobody had hand-read; **six came back with defects.** Human review
share remains **0% in all four languages**. The 2026-08-11 "(Beta)" decision was made about a
smaller, static corpus and without a measured error rate. There is now one.

Per this backlog's own top-of-file lesson from O-1 — sixteen consecutive closing lines moved it
none of the way; one direct instruction moved it all of the way in twenty minutes — **this is
written as an ask, not a restated blocker:**

> **Fund a fluent review of one language, cap what ships under "(Beta)", or re-affirm the decision
> now that the error rate is known.**

---

## 6. Plan for next week (priority block W-9, committed to `AGENT_LOG.md`)

| | item | owner? |
|---|---|---|
| **W-9.1** | ⛔ **PRIORITY — backlog archiving pass.** Move the 137 closed items (244,116 b) verbatim to `AGENT_LOG.archive.md`, leaving a one-line pointer each. Projected: backlog 422,379 → ~178,000 b, floor → ~216,000 b (~43%), headroom 42.9 → ~240 runs. Verbatim move, byte-accounted, no deletions; if it cannot be proven byte-exact, do not commit it. | run |
| **W-9.2** | Reconcile the disabled `economics-app-dev-agent` task entry with whatever actually runs, and fix its false "remote is NOT usable" claim. The 72-hour outage is invisible from inside the log. | **owner** |
| **W-9.3** | O-5, unchanged but re-shaped: route 1 (job pushes) or route 2 (document the weekend gap). One missed Monday push takes Sectors dark on Wednesday. | **owner** |
| **W-9.4** | ⛔ New bound: **a run may not pick a short-string hand read of a translated surface if either of the previous two runs did**, whatever the residual bookkeeping says. W-6.2 rule 1 is unchanged for every other pick. | run |
| **W-9.5** | Escalate O-3 as a direct question, with this week's measured defect density (§5). | **owner** |
| **W-9.6** | O-2 remains the entire critical path. Four steps, ~20 minutes, and the Phase-0 gate becomes measurable for the first time. | **owner** |

**W-9's own test, for the 2026-10-04 review:** not whether the next run agrees with the block, but
whether **W-9.1 has landed and the floor is below 300,000 b.** Open with a fresh MEASURED line off
`check-log-size.mjs` before anything else, and do not retype a figure from this file.

---

## 7. Notes

- `Migration/` and `UIUX/` are untracked and were left untouched, as were the launch-plan documents
  and `working_files/`.
- Nothing was pushed to any remote. No history was rewritten. No commit was reverted.
- Four of the six owner items (O-2, O-3, O-5, plus W-9.2) are now the whole critical path. **The
  repo side of this product is in good shape; the launch is not waiting on code.**
