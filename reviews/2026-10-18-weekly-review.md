# Weekly review — 2026-10-18

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-10-11 (after `654f974`) → 2026-10-18.
At the start of the review, HEAD was `687db75`. The working tree was clean apart from three untracked
items (`Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`), which belong to the owner and were left
alone. The session-start snapshot showed `MM` on eleven files. That was the 10-18 06:07 dev-agent run
syncing from the second Mac, and it was already committed as `687db75` before this review touched
anything.

**Grade: A.** Every test last week's review set passed when measured off the instruments. The quiz's
option-length tell, a standing problem since August, is now down to chance. The week shipped no
content error and nothing that reads as advice. The one process defect, an empty commit, was caught,
fixed and documented by the run that made it. The launch is still blocked, but only on O-2, which
the owner holds.

---

## 1. What shipped

**34 commits since the last review:**
- 29 dev-agent commits from 28 runs (one run made two commits, see §4.2)
- 4 market-data refreshes
- 1 review commit

**Cross-check, per day.** Dev-agent runs against run-log entries for 10-11 (after the review) through
10-18 were **2/2, 4/4, 4/4, 4/4, 4/4, 4/4, 4/4, 2/2**. There was no mismatch in either direction and
no outage. 10-15 has five commits for four runs: `0e3d6d8` was empty and `9b80006` carried its content.

### Dev agent: 28 runs

**Item 160, class B: 4 runs, the headline.** These four runs fixed quiz questions where the correct
answer stood out because it was the longest option:
- `q008`: new distractors that Lesson 40 contradicts
- `q001`: replaced "Gold reserves"-style slogans
- `q021`: tax brackets
- `q043`: why school skips personal finance

The 10-17 run noticed that class B had been parked as "O-3's decision" even though O-3 closed on 10-10.
It recorded the unblock in item 160 and then took the work. That was correct and self-directed.

**Accuracy sweep: 19 runs of in-place corrections.** Each was measured against a primary source, and
most narrowed an absolute claim:
- Market Dashboard: Cash, Bonds, real-vs-headline rates, the peak-rate principle, M0 and M2
- Fed-chair simulator: cheap credit "can feed" the next expansion's inflation, not "feeds" it
- Loss aversion: "classic estimate" of about 2x, not "consistently" 2x
- L34: redistribution is no longer grouped with the deflationary tools, and a tax rise that closes a
  budget gap counts as austerity
- L35: other rates "usually move the same way" as the Fed's rate
- Money-track lessons L16, L17, L18, L21, L22 and L42
- Essentials L4 (credit-score weights), L8 (insurance) and L12 (PMI)

**§10.2 source independence: 2 runs.** Six sentences and four 7-word runs that echoed the "How the
Economic Machine Works" video are now in the app's own words (`3f3a79a`, `bfe677b`). Item 177 is
closed.

**Other runs:**
- `a80e59e` measured CLAIMS.md A3's translation-debt clause for the first time. It was not refuted.
- `52cd2db` was the 23rd run-log archiving pass.

`src/` + `scripts/` churn was **+514 / −455 lines in 28 files**. About 49 of the added lines are
provenance comments in `markets.js`, which the build strips. Like last week, this was correction, not
new surface.

---

## 2. Build and test status

Runtime from `scripts/bootstrap-node.sh`: **system Node v26.7.0**. No download was needed.

| check | result |
|---|---|
| `npm run build` | ✅ passes in ~950 ms, exit 0 |
| `npm test` | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm test` (re-run after this review's backlog edit) | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm run check-deployed --identify` | ❌ DIVERGED, as expected on a Sunday (§4.3) |

The one WARN is O-3's disclosure about translation coverage (0% human review in es/ko/zh/ja), which
the owner accepted on 10-10. **Nothing was broken, so no build fix was needed.**

### Last week's tests (W-11.6), measured by this review

| test | target | measured | |
|---|---|---|---|
| mean run-entry size, 10-12 → 10-18 | ≤ 5,500 b | **4,962 b** (n=26) | ✅ |
| largest heading | ≤ 400 chars | **295** | ✅ |
| §65 longest-option rate (en/es/ko/ja/zh) | ≤ 37.0 / 34.8 / 37.0 / 34.8 / 32.6 | **28.3 / 26.1 / 28.3 / 26.1 / 23.9** | ✅ |
| §65 shortest-option rate (inverse tell) | unchanged | 2.2 / 2.2 / 0.0 / 4.3 / 2.2 | ✅ |
| English lesson length (W-11.2 watch) | — | 166,954 → **167,511 chars (+0.3%)**, 177 min unchanged | ✅ |

Last week, entries were reaching ~8 KB and headings ran to 1,900 characters. This week entries average
4,962 b and headings run 187–295 characters. That brings the archiving pace back to about one pass a
week.

---

## 3. Quality, accuracy and neutrality

**No regressions, nothing that reads as advice, and no factual errors in the English diffs I read.**

I word-diffed every English content change this week and checked the claims that carry weight:
- **Loss aversion.** The new range ("about twice in its classic estimate; later reviews… range from
  about that to well below it, and in some designs close to none") matches the literature. Tversky &
  Kahneman put it at 2.25. Later meta-analyses run from about 2 down toward 1.3, and some designs
  find almost none.
- **q008's new distractors** ("Don't borrow in your own currency", "Let income rise faster than
  productivity") are the reverse of what Lesson 40 actually says. I checked them against the
  lesson's own text, which praises borrowing in your own currency.
- **q021's options** are all near the same length. Only the correct answer, "only the income inside
  the new bracket is taxed at the higher rate", is true.
- **q043's conspiracy distractor** ("withheld deliberately, to keep people borrowing and indebted")
  appears only as a wrong answer that Lesson 41 contradicts. That is fine.
- **L34.** Counting a deficit-closing tax rise as austerity matches the standard definition. Taking
  redistribution out of the deflationary tools keeps the deleveraging dial consistent with the text.
- **L35, M0, M2, PMI and the Cash card.** Each now says something that is true. None of them added a
  statistic to a short string.

The best fixes again deleted the false clause rather than adding a caveat. In L21, "offers cluster
near the anchor instead of the home's worth" became "tends to pull". In L22, search engines are no
longer counted among the amplifiers.

**One clarity note.** The Bonds note on the Market Dashboard now reads *"Long maturities most
sensitive, but their yields usually rise less"*. It's accurate (duration vs. curve flattening), but a
beginner can't tell that "sensitive" refers to price. I filed it as an optional pick in W-12.2,
subject to W-9.4's two-run bar on short strings. It isn't a defect.

**Strategic note.** The accuracy sweep is now well into diminishing returns. Every fix is real, but
each one is smaller than last month's. That isn't a criticism of the runs: §4.3's content clauses
have been met for weeks, and nothing a run can do changes the Phase-0 gate (§4.4).

---

## 4. Concerns

### 4.1 Item 160 has reached its goal, so stop spending runs on it (W-12.1)
In English, the "tap the longest option" strategy scored 50.0% on 09-27, 39.1% on 10-04, 37.0% on
10-11 and **28.3%** today. Chance is 25.0%, and the gap is now under two questions out of 46.
Continuing would cost five-language prose edits for a signal that is now within noise. W-12.1
retires item 160 as a pick. Today's §65 rates become a regression ceiling.

### 4.2 An empty commit (`0e3d6d8`, 10-15), fixed in the same run (W-12.3)
The run passed eight paths as one unsplit zsh scalar, so `git add` failed. The run's tree-count
assertion still passed, because nothing had been staged. The content landed one minute later in
`9b80006`, and the run documented the cause instead of rewriting history. That was the right handling.
The guard now goes into the standing procedure: before committing, assert that
`git diff --cached --name-only | wc -l` equals the expected file count. It's a small cost, and it
closes a silent-failure path. This is the same zsh trap already noted in this machine's memory, so
it is worth making mechanical.

### 4.3 Deploy gap: the usual weekday shape
`check-deployed --identify` found the live site byte-identical to **`2587ec2`** (Fri 10-16 19:50). It
is five content commits behind: `bfe677b` and the four item-160 quiz fixes. The live `market.json` is
asOf 10-16, so the Sectors card goes dark **Wednesday 10-21** unless the owner pushes before then. A
Monday push clears it with two days to spare. This is not a regression.

### 4.4 The critical path is still owner-held (fifth week)
O-2 (an analytics account and a public key) hasn't moved since 09-05, when the code half shipped.
Until it lands, the Phase-0 gate (≥40% finish lesson 1) stays **❌ Unmeasurable**, and the week's 28
runs, however good, don't move the launch.

---

## 5. Questions for the owner

1. **O-2 (week five): will you create one analytics account and paste its public key this week?** It
   takes about 20 minutes. `npm run analytics-check -- --key …` checks the key before you paste it.
   This is the only thing between the app and a measurable launch gate.
2. **Push by Tuesday 10-20?** Otherwise the live Sectors card goes dark on 10-21.
3. **O-5 / O-6** are unchanged from last week: should the market job push, and should the archive
   move be automated? Neither is urgent now that entries are back under 5 KB.

---

## 6. Plan for next week (priority block W-12, committed to `AGENT_LOG.md` in `d813b7d`)

| | item | owner? |
|---|---|---|
| **W-12.0** | W-11's tests: all three pass (measured above). | — |
| **W-12.1** | Item 160 has reached its goal and is no longer a pick. §65 at `687db75` is the regression ceiling. | — |
| **W-12.2** | Keep the accuracy sweep short (W-11.2's rules). Optional clarity candidate: the Bonds note. When the sweep finds nothing, take an open numbered item (117, 140, 149). | run |
| **W-12.3** | Commit safety: assert the staged-file count before committing, and use zsh arrays for path lists. | run |
| **W-12.4** | O-2 (5th week), O-5, O-6. Asked here, not restated in run entries. | **owner** |
| **W-12.5** | Deploy reading: live = `2587ec2`, Sectors goes dark 10-21 without a push. | owner |
| **W-12.6** | Test for 10-25: §65 at or below the ceiling; mean entry ≤ 5,500 b; English text +≤0.5% from 167,511; no empty commits. | — |

---

## 7. Notes

- Nothing was pushed to any remote. No history was rewritten, no commit was reverted, and no file
  belonging to the owner was touched. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`, the
  launch-plan documents and `working_files/` were left alone.
- `npm run build` was run once into the git-ignored `dist/` so that `check-deployed` had a current
  build to compare against. A separate build check ran into the scratchpad.
- The W-12 block cost **4,882 b**, against 6,321 b for W-11. Per `check-log-size` after the edit, the
  floor is **281,824 b** and the run log is 155,126 b.
- Both commits were made with `git commit-tree` + `update-ref`, because `git commit` stalls on this
  machine. HEAD was re-checked immediately before each one.
