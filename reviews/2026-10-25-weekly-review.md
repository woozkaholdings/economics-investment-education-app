# Weekly review — 2026-10-25

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-10-18 (after `4744658`) → 2026-10-25.
At the start of the review, HEAD was `fe55f54`. The session-start snapshot showed 14 modified files.
That was the 10-25 06:05 dev-agent run syncing from the second Mac, and it was already committed as
`fe55f54` before this review touched anything. The only uncommitted items are three untracked paths
(`Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`). They belong to the owner and were left alone.

**Grade: A−.** Every test last week's review set passed, and I found no factual error and nothing
that reads as advice. The minus is about value, not quality. 22 of 27 runs were one-clause
narrowings ("every" → "most", "is" → "often is") on a corpus the sweep has now fully covered. The
launch is still blocked only on O-2, which the owner holds (sixth week).

---

## 1. What shipped

**29 commits since the last review:**
- 27 dev-agent commits from 27 runs
- 2 market-data refreshes

**Cross-check, per day.** Commits against run-log entries for 10-18 (after the review) through 10-25:
**2/2, 4/4, 4/4, 3/3, 4/4, 4/4, 4/4, 2/2**. There was no mismatch in either direction. On 10-21 the
12:00 slot has no commit and no entry, so it was a skipped run on the second Mac, not a logging gap.

### Dev agent: 27 runs

**Accuracy sweep: 22 runs.** Each narrowed one claim in place, in five languages:
- **Lessons:** L27 (a loss sale "records the loss rather than causing it"), L30 (new credit is "a
  promise to pay that didn't exist"), L35 twice (the Fed's statutory goals; rate cuts and home
  prices after 2007), L39 (CPI at the trough), and L44's takeaway.
- **Essentials:** L4, L6, L7 twice (EITC refundability; the refund heading now says "often"), L12,
  L13 and L14.
- **Glossary:** Principal, Brokerage Account and Passive Income.
- **Quiz:** q028 (divorce-revocation law vs. a 401(k)) and q046.
- **Parent guide:** three cards (kids 5-8, kids 9-12, teens 13-17).
- **Market Dashboard:** the Bonds and Stocks notes.

**Other runs (5):**
- `7fceda2` added glossary entries for "Growth Stock" and "Value Stock", chipped in L38.
- `b8db5d6` (item 117): the Review tab no longer gives false instructions when site storage is
  blocked.
- `9b403a3`: `check-blindspot` §10.1 now catches "you should open/put/move…", in five languages.
  That is a real widening of the advice guard.
- `2605c2d` (item 140, closed): the live a11y sweep measures each focus ring against what it is
  drawn on. 0 findings across 9 screens × 2 palettes.
- `1e0645c`: the 24th archiving pass.

`src/` + `scripts/` + `public/` churn was **+531 / −264 lines in 37 files**, mostly provenance
comments and five-language string swaps. It added no new surface.

---

## 2. Build and test status

Runtime from `scripts/bootstrap-node.sh`: **system Node v26.7.0**. No download was needed.

| check | result |
|---|---|
| `npm run build` | ✅ passes in ~1.0 s, exit 0 |
| `npm test` | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm test` (re-run after this review's backlog edit) | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm run check-deployed -- --identify` | ❌ DIVERGED, as expected on a Sunday (§4.4) |

The one WARN is O-3's translation-coverage disclosure (0% human review in es/ko/zh/ja), which the
owner accepted on 10-10. **Nothing was broken, so no build fix was needed.**

### Last week's tests (W-12.6), measured by this review

| test | target | measured | |
|---|---|---|---|
| §65 longest-option rate (en/es/ko/ja/zh) | ≤ 28.3 / 26.1 / 28.3 / 26.1 / 23.9 | **28.3 / 26.1 / 28.3 / 26.1 / 23.9** | ✅ (at ceiling) |
| mean run-entry size, 10-19 → 10-25 | ≤ 5,500 b | **5,363 b** (n=25) | ✅ (up from 4,962) |
| largest heading | ≤ 400 chars | **385** | ✅ (near cap) |
| English lesson text | ≤ +0.5% from 167,511 | **168,197 (+0.41%)**, 177 min unchanged | ✅ |
| no empty commit | 0 | **0** of the last 32 | ✅ |

---

## 3. Quality, accuracy and neutrality

**No factual errors and no regressions in the English diffs I read.** I word-diffed every English
content change and checked the claims that carry weight:
- **q028 / Essentials L14.** A state revocation-on-divorce law can reach an IRA or an individual
  life policy, but ERISA preempts it for a 401(k) (*Egelhoff v. Egelhoff*, 2001). The new
  explanation says exactly that, and "some life insurance" correctly leaves out employer group
  policies.
- **Essentials L7.** A refundable credit like the EITC can make a refund larger than all the tax
  withheld, and it is paid only at filing. That's correct. Softening the heading to "often" follows
  from it.
- **L35.** Section 2A of the Federal Reserve Act names three goals (maximum employment, stable
  prices, moderate long-term rates), so "two legally required goals" was wrong and is fixed. Home
  prices did keep falling for years after the Fed began cutting in September 2007.
- **L27, L30, L39, Essentials L6/L12/L13, and Principal.** Each now says something true. "Roth
  removes the tax" is right, and so is "dividends are taxed in the year paid".
- **Growth Stock / Value Stock glossary entries.** Accurate, relative, and explicitly "not a verdict
  that the stock is a bargain". That's good neutral wording.

### One neutrality watch: the Stocks card (`06589a4`), W-13.1
The note now reads *"On paper growth stocks are hit hardest, yet they beat value stocks in 4 of the
last 5 hiking cycles."* The measurement behind it is careful: Fama-French daily data, robust to
breakpoints and ±5-day shifts, with a Russell cross-check. The "N of the last 5 cycles" form matches
the gold, real-estate and dollar notes. The difference is that those siblings describe an asset's
own direction, while this one **ranks one style against another**. On a dashboard that reads closest
to a "what to hold when the Fed hikes" rule. The tally also hides magnitude: the five cycle gaps
(+5.2 / +1.7 / −26.4 / +13.3 / +9.0 pts) net about +2.8 pts, so "4 of 5" overstates something
close to a wash. It isn't advice and it isn't false, but it's the one string this week I'd change.
W-13.1 asks for the note to describe what stocks themselves did (measured), or to drop the history
clause. It also sets a rule: no short string ranks one asset class or style against another.

### Strategic: the sweep is mostly hedging now (W-13.2)
The sweep has now been through every content surface. Eleven of 27 runs continued the previous
run's residual. The fixes are real, but they are getting smaller, and the main thing they do now is
add hedges. Hedge words in the English lessons ("often/usually/can/may/most…") rose from 12.35 to
**12.49 per 1,000 words** this week (11.7 on 09-20). That isn't a defect yet. But a beginner's
text where every claim says "often" teaches less, and nothing in the instruments pushes back.
W-13.2 sets a bar: narrow a claim only when a common case misleads a learner. A sweep that finds
nothing is a valid run that should get a short entry.

---

## 4. Concerns

### 4.1 The critical path is still owner-held (sixth week)
O-2 (an analytics account and a public key, about 20 minutes) hasn't moved since 09-05. The Phase-0
gate (≥40% finish lesson 1) stays **❌ Unmeasurable**. No run can change that, so the week's 27
runs, however careful, don't move the launch.

### 4.2 Low marginal value per run
Four runs a day on a content-complete app with an owner-held gate means one-word corrections
by the dozen. They aren't harmful, and each is checked. But the cost (five-language edits, ledger
churn, about 5 KB of log per run) now buys little. I filed this as an owner question, O-7, rather
than letting runs decide their own cadence.

### 4.3 Entry size is creeping back
The mean went from 4,962 to 5,363 b and a heading reached 385 of 400. Both are still within the
test. W-13.3 targets a mean ≤ 5,000 b.

### 4.4 Deploy gap: the usual weekday shape
`check-deployed --identify` found the live site byte-identical to **`3afd410`** (Fri 10-23 19:50),
five content commits behind (`49f0b4b`, `71ad358`, `9a4186d`, `fee5fca`, `fe55f54`). The live
`market.json` is asOf 10-23, so the Sectors card goes dark **Wednesday 10-28** unless a push lands
before then. This is not a regression.

---

## 5. Questions for the owner

1. **O-2 (week six): will you create one analytics account and paste its public key?** Running
   `npm run analytics-check -- --key …` verifies the key first. This is the only thing between the
   app and a measurable launch gate.
2. **O-7 (new): should the dev agent slow from 4 runs a day to 1 until O-2 lands?** The content is
   complete and the sweep is in diminishing returns. A slower cadence would cost little and save
   most of the churn. This setting lives on the second Mac's scheduled task, so only you can change
   it.
3. **Push by Tuesday 10-27?** Otherwise the live Sectors card goes dark on 10-28.
4. **O-5 / O-6** are unchanged: should the market job push, and should the archive move be
   automated?

---

## 6. Plan for next week (priority block W-13, committed to `AGENT_LOG.md`)

| | item | owner? |
|---|---|---|
| **W-13.0** | W-12's tests: all four pass (measured above). | — |
| **W-13.1** | Stocks card: replace the growth-vs-value tally with what stocks did (measured), or drop the clause. New rule: no short string ranks one asset class or style against another. | run (pick) |
| **W-13.2** | Shrink the sweep. Narrow a claim only for a common misleading case, don't start residual chains from true sentences, and give a clean sweep a short entry. | run |
| **W-13.3** | Mean entry ≤ 5,000 b. | run |
| **W-13.4** | O-2 (6th week), O-5, O-6, and new O-7 (cadence). Asked here, not restated in runs. | **owner** |
| **W-13.5** | Deploy reading: live = `3afd410`; Sectors goes dark 10-28 without a push. | owner |
| **W-13.6** | Test for 11-01: §65 at or below the ceiling; mean entry ≤ 5,000 b; English text +≤0.3% from 168,197; no empty commits; W-13.1 resolved. | — |

---

## 7. Notes

- Nothing was pushed to any remote. No history was rewritten, no commit was reverted, and no file
  belonging to the owner was touched. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`, the
  launch-plan documents and `working_files/` were left alone.
- `npm run build` was run into the git-ignored `dist/` so that `check-deployed` had a current build
  to compare against.
- The W-13 block cost **4,754 b** (W-12: 4,882 b). After the edit, `check-log-size` reports a floor
  of **287,462 b** against the 500 KB budget, and the run log is 153,586 b.
- The hedge-density figure is a quick grep of `lessonContent.{economy,money,essentials}.en.js`
  (whole files, code included), not an instrument. Use it only as a trend: `d83bf5b` (09-20) 11.7,
  `4744658` 12.35, `fe55f54` 12.49 per 1,000 words.
- Both commits were made with `git commit-tree` + `update-ref`, because `git commit` stalls on this
  machine. HEAD was re-checked immediately before each one.
