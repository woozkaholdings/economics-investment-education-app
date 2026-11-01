# Weekly review — 2026-11-01

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-10-25 (after `f80b967`) → 2026-11-01.
At the start of the review, HEAD was `0bce6f5` (the 11-01 00:08 dev-agent run). The session-start
snapshot listed 28 modified files, but they were that run's sync from the second Mac, and all of
them were already committed in `0bce6f5` by the time this review ran `git status`. The only
uncommitted items are three untracked paths (`Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`).
They belong to the owner and were left alone.

**Grade: A.** Last week's main course-correction (W-13.2, "shrink the sweep") worked. Content
narrowings fell from 22 of 27 runs to 3 of 26. The freed runs went to defects a learner would
actually hit, and every one I read is correct. Four of last week's five tests pass. The fifth
missed by one entry: a heading of 457 chars against a 400 cap. The launch is still blocked only
on O-2, which the owner holds (seventh week).

---

## 1. What shipped

**30 commits since the last review:**
- 26 dev-agent commits from 26 runs
- 4 market-data refreshes (asOf 10-26, 10-27, 10-29, 10-30)

**Cross-check, per day.** Commits against run-log entries for 10-25 (after the review) through
11-01: **2/2, 4/4, 4/4, 4/4, 4/4, 4/4, 3/3, 1/1**. There was no mismatch in either direction. On
10-31 the 18:00 slot has no commit and no entry, so it was a skipped run on the second Mac, not a
logging gap. No commit was empty.

### Dev agent: 26 runs, by kind

**UI copy vs. app behavior, and live walks (6).** This was the most valuable group this week.
- `0909c73` / `2b24c4f`: Review's rail said a question "stops asking". The scheduler never retires
  one; past box 5 it returns every 16 days. It now says "It asks less often". The es fix also
  removes a reading as an order to the learner.
- `5db9708`: the caught-up card said questions return "a day or two" later. The scheduler's gaps
  are 1, then 4, 8 and 16 days. The card now matches.
- `d54e3f3`: finishing the last lesson no longer prompts "Keep the streak going. Come back tomorrow
  to continue where you left off." Nothing is left to continue.
- `d37ef6e` / `616e877`: a refused deep link from Review or Reference now shows its notice. An
  unknown lesson id now says "Lesson not found" instead of "That lesson isn't open yet", which
  implied the lesson exists.

**Glossary reach (5).** Chip rows now appear on the Market Dashboard (`6408ce4`), Sector
performance (`4f250bb`) and the parent guide (`fc22872`), for terms those screens used without
defining. `69c8ef2` moved those keys into `screenTerms.js`, so a renamed glossary key now fails
the build (§17c) instead of silently dropping a chip. `0bce6f5` fixed ko's "Savings Account" to
저축 계좌, the term the lessons use 23 times.

**Advice guard (3).** `check-blindspot` §10.1 now catches "you should <adverb> buy" (`87e986f`),
Korean "should buy" in its Sino-Korean, honorific and polite forms (`a80e957`), and the bare
imperative "Buy stocks now." in all five languages (`6e7cfca`). Before that, no language had an
imperative class. This was a real hole in the neutrality guard, and it's now closed with controls.

**Content accuracy (3).**
- `c7f4164` closed W-13.1. The Stocks card no longer ranks growth stocks against value stocks. It now
  says stocks ended 4 of the last 5 hiking cycles higher.
- `d9d315d`: the QE/QT notes now open "On paper:". The QT note adds "yet stocks ended both QT rounds
  higher". The old arrow said "stocks ↓" while the S&P 500 rose +18% and +67% through the two
  runoffs.
- `1fe1565`: essentials L8 said insurance can't cover "something that's already happened". It now
  says "one that's already happened (a house that has already burned down)", so a reader with a
  chronic condition doesn't take it to mean them.

**Second reads and clean sweeps (5).** `2142726`, `46d0161`, `f4934a0` and `ba4e933` were W-9.4
second reads with no change. `86a5db6` was a clean sweep, logged short as W-13.2(b) asks.

**Tooling and housekeeping (4).** `b814d6c` (item 149) and `b7c41f1` (item 120) tightened the a11y
coverage and storage audits, and `b7c41f1` caught a real over-coarse declaration on its first run.
`480ac7b` closed item 143. `9a239b0` documented PostHog's "Discard client IP data" setting, without
which Settings › About's "doesn't collect personal data" would become false the day O-2 lands. That
is a good catch, and it's now in O-2's owner steps.

`src/` churn was modest and targeted. No new screens or features beyond the chip rows.

---

## 2. Build and test status

Runtime from `scripts/bootstrap-node.sh`: **system Node v26.7.0**. No download was needed.

| check | result |
|---|---|
| `npm run build` at `0bce6f5` | ✅ exit 0 |
| `npm test` at `0bce6f5` | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm test` after this review's backlog edit | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm run check-deployed -- --identify` | ⚠️ live = `fea128a`, 4 commits behind (§4.3) |

The one WARN is O-3's translation-coverage disclosure (0% human review in es/ko/zh/ja), which the
owner accepted on 10-10. **Nothing was broken, so no build fix was needed.**

### Last week's tests (W-13.6), measured by this review

| test | target | measured | |
|---|---|---|---|
| §65 longest-option rate (en/es/ko/ja/zh) | ≤ 28.3 / 26.1 / 28.3 / 26.1 / 23.9 | **28.3 / 26.1 / 28.3 / 26.1 / 23.9** | ✅ (at ceiling) |
| mean run-entry size, 10-26 → 11-01 | ≤ 5,000 b | **3,347 b** (n=24) | ✅ (down from 5,363) |
| largest heading | ≤ 400 chars | **457** (the 10-31 analytics entry) | ❌ (one entry) |
| English lesson text | ≤ +0.3% from 168,197 | **168,230 (+0.02%)** | ✅ |
| no empty commit | 0 | **0** | ✅ |
| W-13.1 resolved | either way | `c7f4164` + second read `2142726` | ✅ |

Hedge words in the three English lesson files ("often/usually/can/may/most…", whole files): **471
at `fe55f54` → 471 at HEAD**. For the first time in weeks the count is flat. This is a grep, not
an instrument, and its word list differs from last week's, so compare only within this row.

---

## 3. Quality, accuracy and neutrality

**I found no factual errors, no regressions and nothing that reads as advice.** I read every
English content diff and the key code diffs:
- **Stocks card / QE-QT notes.** The S&P 500 did rise over both QT runoffs (2017-10 → 2019-07 and
  2022-06 → 2025-11). The run tested robustness under ±1-month endpoint shifts and dropped a QE
  clause that failed the test. That is the right discipline.
- **Review copy.** The new strings match `src/lib/review.js`'s box intervals.
- **`d54e3f3`.** `finishesPath` uses the same "every lesson" test as Learn's `pathComplete`, and it
  correctly reads the pre-click `completedLessons`.
- **`616e877`.** The new label keys off `linkMiss.reason === "locked"`, so a locked lesson keeps
  the old heading.
- **Analytics doc.** It states correctly that PostHog falls back to the request IP. It also says
  the "discard" default applies only to EU organizations, and the configured host is the US one.

### One neutrality watch (W-14.3): past-episode tallies are accumulating

The Market Dashboard now pairs textbook arrows with "N of the last 5" tallies on four cards:
- stocks "ended 4 of the last 5 hiking cycles higher"
- home prices ended "each of the last 5" higher
- gold "fell in only 1"
- the QT note: "yet stocks ended both QT rounds higher"

Each is measured and true, and "on paper vs what happened" is a good lesson. Read together, though,
they edge toward "assets rise whatever the Fed does". That is closer to a holding rule than any
single string, and it's the kind of pattern a teen could take as guidance. `ratePrinciples[4]` is
the right model: it gives the 1973-74 exception and the drawdowns of up to 23% along the way.
**W-14.3 bars any new tally.** It doesn't ask to change the existing ones.

---

## 4. Concerns

### 4.1 The run log is nearly full (W-14.1, top priority)
`check-log-size`: the run log is **243,037 b, 97.2%** of the 250 KB warn budget, with about **2
runs** of headroom. The last archiving pass was 10-23. A W-5.3 pass is now the next run's first
job. Shorter entries this week slowed the growth (3.3 KB per entry against 5.4 KB), but four runs
a day still fill the budget in about two weeks.

### 4.2 The critical path is still owner-held (seventh week)
O-2 (an analytics account and a public key, about 20 minutes plus the new IP setting) hasn't moved
since 09-05. The Phase-0 gate (≥40% finish lesson 1) is still **❌ Unmeasurable**. This week's work
improved the product a learner would meet, but it can't move the launch.

### 4.3 Deploy gap: the usual weekend shape
`check-deployed --identify` found the live site byte-identical to **`fea128a`** (Fri 10-30 19:50).
It is four commits behind: `fc22872`, `69c8ef2`, `9a239b0` and `0bce6f5`. The live `market.json` is
asOf 10-30, so the Sectors card goes dark **Wednesday 11-04** unless a push lands before then. Last
week's warning that Sectors would go dark on 10-28 didn't come true, because a push landed in time.

### 4.4 Minor: one heading over the cap
The 10-31 analytics entry's heading is 457 chars. W-14.4 restates the cap.

---

## 5. Questions for the owner

1. **O-2 (week seven): will you create one analytics account and paste its public key?** If you
   choose PostHog, also turn on Settings › Project › "Discard client IP data" first (added 10-31).
   `npm run analytics-check -- --key …` verifies the key. This is the only thing between the app
   and a measurable launch gate.
2. **O-7 (week two, unanswered): should the dev agent slow from 4 runs a day to 1 until O-2
   lands?** This week's runs were better than last week's, so the case for slowing down is weaker.
   But the run-log budget (§4.1) is the cost of the current cadence. The setting lives on the
   second Mac, so only you can change it.
3. **Push by Tuesday 11-03?** Otherwise the live Sectors card goes dark on 11-04.
4. **O-5 / O-6** are unchanged: should the market job push, and should the archive move be
   automated? §4.1 makes O-6 more relevant.

---

## 6. Plan for next week (priority block W-14, committed to `AGENT_LOG.md`)

| | item | owner? |
|---|---|---|
| **W-14.0** | W-13's tests: 4 of 5 pass; one heading at 457 chars. | — |
| **W-14.1** | **PRIORITY, next run:** the W-5.3 archiving pass (run log at 97.2% of budget). | run |
| **W-14.2** | Keep picking code-vs-copy checks and live walks over sweeps. Next: a first session walked end to end in es and ko, and every behavior-number string checked against its constant. | run |
| **W-14.3** | No new past-episode tallies ("N of the last 5 … higher") on any surface. The existing ones stay. | run |
| **W-14.4** | Headings ≤ 400 chars, every entry. | run |
| **W-14.5** | O-2 (7th week), O-7, O-5, O-6. Deploy: live = `fea128a`; Sectors goes dark 11-04 without a push. | **owner** |
| **W-14.6** | Test for 11-08: §65 at or below the ceiling; mean entry ≤ 5,000 b and no heading > 400; run log under the warn budget after the pass; English text grows ≤ 0.3% from 168,230; no empty commits; no new tally. | — |

---

## 7. Notes

- Nothing was pushed to any remote. No history was rewritten, no commit was reverted, and no file
  belonging to the owner was touched. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`, the
  launch-plan documents and `working_files/` were left alone.
- `npm run build` wrote into the git-ignored `dist/`, which `check-deployed` compares against.
- The W-14 block cost about **4.5 KB**, on the backlog (floor) side, not the run log. After the
  edit, `check-log-size` reports a floor of **295,129 b** against the 500 KB budget. The run log
  is unchanged at 243,037 b.
- Entry sizes and heading lengths came from a scratchpad script that splits `## Run log` on
  `### YYYY-MM-DD` headings. The per-day counts matched `git log` exactly.
- Both commits were made with `git commit-tree` + `update-ref`, because `git commit` stalls on this
  machine. HEAD was re-checked immediately before each one.
