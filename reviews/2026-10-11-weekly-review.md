# Weekly review — 2026-10-11

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-10-04 (after `a117f05`) → 2026-10-11.
Working tree at review start: HEAD `befb49a`, clean except for three untracked items (`Migration/`,
`UIUX/`, `scripts/fix-agent-skill.mjs`). Those are the owner's and were left alone. The session-start
snapshot showed `MM` on ten files. That was the 10-11 06:04 dev-agent run (on the second Mac) still
syncing, and it was committed as `befb49a` before this review touched anything.

**Grade: A−.** The week was steady, accurate and source-measured, and the owner closed two
long-running items (O-3, W-10.2). It falls short of an A for two reasons. O-2, the whole critical path,
has not moved for a fourth week. And **run-log entries grew ~50% within the week**, which this review
turns into the one process priority (W-11.1).

---

## 1. What shipped

**35 commits since the last review: 28 dev-agent, 3 owner-directed, 4 market-data refreshes.**
Cross-checked per day: dev-agent commits against live run-log entries, **2/2, 4/4, 4/4, 4/4, 4/4,
4/4, 4/4, 2/2 for 10-04 (post-review) → 10-11**. No mismatch either way, and no outage. The three
owner-directed commits (`b834f3a`, `560aac9`, `f2aa395`) are logged in the backlog, not the run log,
which is the established convention for interactive work.

### Owner-directed, and the most consequential of the week
- **W-10.2 solved, then closed.** The dev agent runs on a **second Mac**, as `b834f3a` found from a
  sibling task file. That explains the disabled task entry here and the earlier "outages". On 10-10
  the owner ran `scripts/fix-agent-skill.mjs` on that Mac (`f2aa395`). The prompt actually in force no
  longer calls the remote "NOT usable" or names `economic-cycles-v5.jsx` as the application.
- **O-3 closed** (`560aac9`). Shipping es/ko/zh/ja under "(Beta)" was re-affirmed with the scale
  stated in `DECISIONS.md`. The review-coverage WARN stays as the disclosure.

### Dev agent: 28 runs, almost all in-place accuracy corrections
- **W-10.1 landed** (`f22dc00`, 10-04). Uninvested brokerage cash can earn interest through sweep
  accounts. Fixed at five sites plus a q027 distractor, with the teaching point ("a container, not an
  investment") kept.
- **A wrong answer key fixed.** `q028`/Lesson 14 said a 401(k) goes to whoever is on the form even
  over a current spouse. ERISA usually gives it to the spouse. The run rebuilt the scenario around a
  never-married person instead of stacking caveats (`d99f0a0`).
- **Neutrality improvements.** Lesson 37's prompt no longer leads with *"Does this help explain
  wealth inequality?"*. It names both QE channels and asks which is bigger. Lesson 40 dropped *"you
  understand more than most people"*. Lesson 33's prompt no longer asks whether *today* looks like a
  late-cycle peak. Lesson 36 went from "Crystal Ball" to "A Warning Light" in five languages. Lesson 40
  also dropped a closer lifted from the source video (§10.2).
- **Absolutes made true.** The short cycle is "5-8 years *on average*" (L32, q003, chart text).
  Recession spacing is start-to-start. Rates fell cycle over cycle 1981–2019 "not as a rule", backed by
  peak figures. Debt outgrowing income doesn't "eventually crush" a country on cue (household 1980–2007
  and Japan 1990–2023 figures). Self-employment tax covers both halves. A 401(k) usually limits fund
  choice. Savings accounts compound on their own. The glossary's Bond, Interest Rate and Inflation
  entries were corrected.
- **Parent guide** (5 runs, 10-10 → 10-11). The Fed's balance sheet "doubled", instead of "$2+ trillion
  printed". A savings rate follows the Fed's direction "often by much less" (FDIC SNDR: ~8%
  pass-through). A month of five grocery prices isn't "measuring inflation". A teen's income-tax
  withholding is often $0 (IRS Pub 15-T 2026 vs BLS median teen pay). Cycles have phases, not a
  schedule.
- **Other:** ko/ja use one word for "lesson". The 22nd run-log archiving pass ran (`8bda77c`).

`src/` + `scripts/` churn: **+441 / −402 lines in 27 files**. This was correction, not new surface.

---

## 2. Build and test status

Runtime from `scripts/bootstrap-node.sh`: **system Node v26.7.0**. No download was needed.

| check | result |
|---|---|
| `npm run build` | ✅ passes, built in 995 ms, exit 0 |
| `npm test` | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm test` (re-run after this review's backlog edit) | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm run check-deployed` | ❌ DIVERGED, as expected on a Sunday (§4.3) |

The one WARN is O-3's translation-coverage disclosure (0% human review in es/ko/zh/ja), which the
owner re-affirmed this week. **Nothing was broken, so no build fix was needed.**

**W-10's test passes on both halves.** I measured it myself rather than taking it from `b834f3a`:
(i) W-10.1 landed in `f22dc00`. (ii) `check-data.mjs` §65 at `befb49a` gives longest-option rates of
**en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6** against the 10-04 ceiling of 39.1 / 37.0 / 37.0
/ 34.8 / 32.6. English and Spanish *improved*, and shortest-option rates are unchanged.

---

## 3. Quality, accuracy and neutrality

**No regressions. No advice-adjacency. No factual errors found in the English diffs I read.**

I read every English content diff this week, word-diffed, and spot-checked the load-bearing figures
against what I know of the sources:
- Fed funds peaks of ~19% (1981), <12% (1984), 6.5% (2000), 5.25% (2006–07), <2.5% (2018–19)
- Household debt rising from ~70% to ~135% of disposable income (1980 → 2007)
- Japanese government debt rising from ~60% to ~240% of GDP (1990 → 2023)
- 1974: output down ~2% and CPI up ~12%
- The Fed's balance sheet going from under $1T to over $2T in Sept–Dec 2008

All are consistent. The 1989/2007 top-1% wealth shares (23% / 29%, Fed DFA) are plausible and I did
not re-verify them independently. `check-blindspot` and §10.1 are green inside `npm test`.

What stood out was the method. Every fix names a primary source and a control: FRED USREC
reproducing NBER's own published counts, and CPI food-at-home as a positive control for the grocery
basket. The best edits *removed* a claim instead of hedging it. `q028` was rebuilt around a clean
scenario, and the leading QE prompt was replaced with a balanced question.

**One watch item: length.** A week of corrections only grew English lesson text **164,424 → 166,954
chars (+1.5%)** and **174 → 177 minutes**. Three glossary definitions grew to 352–433 characters, and
the Inflation entry now carries a 1974 statistic. Nothing here is wrong. But a hedge that adds a
statistic costs a beginner more than one that deletes the false clause. W-11.2 asks for the shorter
fix where it is enough.

---

## 4. Concerns

### 4.1 Run-log entries grew ~50% inside one week (W-11.1, the week's priority)
Measured off the file, mean bytes per run entry by day:

| | 09-27 → 10-04 (last week) | this week |
|---|---|---|
| range | 4,841 – 5,959 | 5,771 (10-04) → 6,064 → 7,229 → 5,991 → 7,428 → 8,039 → 7,459 → **8,055 (10-11)** |

Most of the growth is in the **heading**. It ran ~550–650 characters on 10-04 and ~1,350–1,900 by
10-09/10-11, almost all of it pick-justification preamble about which rules do and don't bind.
`check-log-size`: run log 208,058 b, **5.5 runs of headroom**, so the 23rd archiving pass is due
about 10-12. At ~8 KB × 4/day an archiving pass is needed every ~3 days, and
`AGENT_LOG.archive.md` (5.48 MB) grows ~200 KB a week. Last week's review said the lever was entry
size, and that entry size was flat. It is no longer flat.
**The correction is forward-only and is not a pick:**
- headings ≤ 300 characters
- one line for rule compliance
- target ≤ 5,000 b per entry
- measurements kept, restatement cut

The test for 10-18 is a mean of ≤ 5,500 b for entries dated 10-12 → 10-18.

### 4.2 The critical path is still entirely owner-held (fourth week)
§4.3's content clauses have been met for weeks. The Phase-0 gate (≥40% finish lesson 1) is still
**❌ Unmeasurable** until O-2 lands, and the code half has been shipped and verified since 09-05.
**Nothing any run did this week moved the launch, because nothing a run can do moves it.** That is
not a criticism of the runs.

### 4.3 Deploy gap: the same weekday shape, not alarming
`check-deployed --identify` rebuilt 9 candidates. The live bundle is byte-identical to **`6510e60`**
(Fri 10-09). It is six content commits behind, all parent-guide fixes plus Lesson 40's prompt. Live
`market.json` is asOf 10-09, so Sectors goes dark **Tue 10-13**, and a Monday push clears it with a
day in hand. That matches W-9.3/W-10.4. Not a regression.

### 4.4 Market data 10-08 was skipped, correctly
The 10-08 market-data run fetched `asOf=2026-10-08` and **declined to commit because the tree was
dirty** with the second Mac's in-progress edits. That is the documented behavior, and the 10-09
refresh superseded it. Filed in W-11.4 so no run "fixes" it.

---

## 5. The owner's part, as questions

1. **O-2: will you create one analytics account and paste a public key this week?** It's four steps
   and ~20 minutes, and it is the only thing between the app and a measurable Phase-0 gate.
2. **O-5: have the market job push, or document the weekend gap?** The market-data `SKILL.md` already
   carries a note on where route 1 would go.
3. **O-6: automate the archive move, or keep it manual?** This matters more now that entries are
   ~8 KB.

---

## 6. Plan for next week (priority block W-11, committed to `AGENT_LOG.md`)

| | item | owner? |
|---|---|---|
| **W-11.0** | W-10's test passes on both halves (measured above). | — |
| **W-11.1** | ⛔ **PRIORITY (process):** headings ≤ 300 chars, one line for rule compliance, entries ≤ 5,000 b. Forward-only, not a pick. | run |
| **W-11.2** | Continue the accuracy sweep. Prefer deleting or narrowing a false clause to adding a statistic, especially in glossary and parent-guide text. When nothing turns up, take an open numbered item rather than re-reading a surface already declared clean. | run |
| **W-11.3** | O-2 (4th week), O-5, O-6, asked as questions. | **owner** |
| **W-11.4** | Deploy and market-data notes. Neither is a defect. | — |
| **W-11.5** | Size notes: archive pass due ~10-12, `kidsContent.js` provenance comments, `CLAIMS.md` at 11-07. | — |
| **W-11.6** | Test for 10-18: entry-size test, plus §65 rates at or below en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6. | — |

---

## 7. Notes

- Nothing was pushed to any remote. No history was rewritten, no commit was reverted, and no file of
  the owner's was touched. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`, the launch-plan
  documents and `working_files/` were left alone.
- I did not archive the closed backlog blocks (W-1…W-9, ~200 KB). The floor is at 53.4% of budget
  with 426 runs of headroom, so it isn't due, and W-9.1's lesson is to move mass only once it's real.
- The W-11 block cost **6,321 b**, against W-10's 10,198 b and W-9's 10,677 b. That is deliberately
  smaller, since it asks the runs for brevity. The floor after it is **273,558 b (54.7% of budget)**,
  read off `check-log-size.mjs` and not projected.
