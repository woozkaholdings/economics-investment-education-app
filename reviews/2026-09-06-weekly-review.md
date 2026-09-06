# Weekly review — 2026-09-06

**Period:** 2026-08-30 → 2026-09-06 (since `c55a887`, the last review)
**HEAD at review:** `656958e` → curation committed as `a878e8c`
**Reviewer:** scheduled weekly-review task. No feature work performed; the build was already green, so no code changes were made.
**Grade: A−.** The app went live, content accuracy had its best week, and last week's course-correction demonstrably worked. The minus is one thing, and it is serious: almost none of the week's learner-visible fixes are actually in front of a learner.

---

## 1. The week in numbers

| | |
|---|---|
| Commits | **113** |
| Diffstat vs `c55a887` | 80 files, **+24,751 / −4,742** |
| Build (`npm run build`) | ✅ **pass** — 1.07s, entry 264.93 kB / 95.23 kB gzip |
| Tests (`npm test`, 8 checks) | ✅ **pass**, exit 0 — 4 standing warnings, 0 failures |
| Live site | ✅ **up** — `/` 200, `/data/market.json` 200, 404 control 404 |
| App code (`src/` minus content/locales) | 6,589 → **8,833** lines |
| Instruments (`scripts/`) | 15,480 → **19,305** lines |
| Instrument-to-app ratio | 2.35x → **2.19x** (improved) |
| Backlog section | 295,280 → **425,414 b** (+44%) |
| Open backlog items | 26 → **28** |

**Log/commit cross-check: reconciles.** Run-log entries (live + archive) per day vs commits: 10/16, 8/9, 8/10, 23/25, 12/13, 16/18, 14/14, 10/11. Every surplus commit is accounted for by a non-run-entry category — daily market refreshes, W-5.3 archiving passes, backlog compression passes, the 08-30 review's own two commits, and a handful of same-run follow-ups. **No entry claims work without a commit, and no substantive commit lacks an entry.**

## 2. What shipped

**The headline: O-1 closed after 19 days.** The app is live at <https://magnificent-mochi-73aecc.netlify.app> (`cf1aab3`, 09-05, owner-directed). The run recorded something more useful than the deploy: "deployed" and "reachable" were three steps where the repo's instructions described one — an unclaimed Netlify drop is password-protected and expires in ~1h, and a claimed one still lands *Private*. `README.md` now documents all three.

**O-2 narrowed to four owner steps.** The analytics transport is built, provider-agnostic and verified end-to-end (`9e00f95`). `npm run analytics-check` (`c253b8d`) was then built to close a genuine trap: PostHog's capture endpoint returns **200 to any key at all**, so a typo is indistinguishable from success — build green, deploy green, dashboard empty. The check probes `/decide/`, which validates the token, and carries an invalid-token control that must return 401 or it refuses to give a verdict. That is exactly the right shape.

**Content accuracy — the strongest week in the project's history.** Corrections landed on: the 2s10s spread defined backwards in five languages for three weeks (`104e8ca`); QT defined as tapering (`0a141d0`); the Fed's 2% target hung on CPI rather than PCE (`d8c9387`); compound interest whose own arithmetic refuted its promise (`aaee2c0`, `84a4b3b`); a willpower claim resting on the most publicly failed replication in the literature (`2a94251`); the 1930s used as a pure-austerity case in the one lesson about policy *mix* (`ba7fd0d`); and recession conflated with deflation (`992a057`). These are real economics errors, found by reading, and fixed neutrally.

**Accessibility and first-run flow** got sustained attention: quiz right/wrong markers with no non-visual channel, the learning path reading as one identical string to a screen reader, a recap saying "nice work" over ten red crosses, a learner finishing all 44 lessons and being sent back to lesson 1, the Back button dumping a learner out of Reference from three levels deep.

## 3. Health

**Build ✅ · Tests ✅ (exit 0).** Four standing warnings, all recorded debt rather than regressions: translation human-review share 0%, 47 abridged lesson/language pairs, the quiz option-length cue (item 160), and the AGENT_LOG floor over budget.

**Safety guard independently re-proved.** I did not read §10.1's green line. I planted *"With rates this low, now is a good time to buy stocks."* into `src/content/lessonContent.economy.en.js`, confirmed the plant landed (47,236 → 47,329 b), ran `check-blindspot` → **exit 1, `FAIL: §10.1 investment-advice-adjacent language reintroduced`**, then restored from a scratchpad copy (`cmp` identical, tree clean) → **exit 0**. The timing-pattern class added 09-02 after a plant slipped through is real and load-bearing. **No advice-adjacent, personalized, or buy/sell language anywhere in the week's work.**

## 4. Concerns

### 4.1 ⛔ The app is live and six commits of learner-visible fixes are not on it — *top priority*

Measured against the running site:
- Live entry bundle **`index-C1_r8HAt.js`, 263,940 b**; a build of `HEAD` produces **`index-B1mndoLB.js`, 264,930 b**. Under content-addressed hashing that is a **990 b** proof the deployed artifact is not `HEAD`.
- `git rev-list --count 5d6893c..HEAD -- src/ public/ index.html` = **6**.

Still being served to anyone who visits: lesson 32 teaching that **a recession is when prices fall**; lesson 43 citing a locked lesson; the Back button dumping learners out of Reference; the review recap's four screen-reader-identical rows; 15 quiz explanations missing their last clause.

**The general finding is bigger than these six commits. O-1 changed what "done" means and nothing in the repo changed with it.** For nineteen days a fix merged to `main` had shipped, because there was nowhere else for it to go. That is now false — and *every* instrument here still measures the tree. `npm test`, `check-blindspot`, `check-claims`, `refresh-readiness` all certify `main`; **not one can see the deployed artifact.** The app can be right in the repo and wrong on the web indefinitely with every check green.

**And the class already bit once and was fixed as an incident.** `5d6893c`, four days after launch: *"The og:image card shipped in the repo a day ago and every shared link still unfurled as a text stub; dist is redeployed."* That run redeployed and did not ask what else was undeployed. Six commits later, here we are.

### 4.2 The floor grew 40% with three compression passes running — and the cause was misdiagnosed

| region | 08-30 | 09-06 | change |
|---|---|---|---|
| backlog | 295,280 b | 412,906 b | **+39.8%** |
| ├ priority blocks | 28,568 b | 46,285 b | **+62.0%** |
| └ numbered items | 266,712 b | 366,621 b | +37.5% |
| **open items** | **26** | **28** | **+2** |

**Open items grew by two; the backlog grew by 118 KB.** W-6.4 blamed newly-filed residuals and W-6.2 rule 2 was written to stop them. **Rule 2 worked and the file grew anyway, because the growth was never in new items** — it is existing text accreting annotations, retractions and "ORIGINAL CLAUSE, kept because the retraction refers to it" preservations. Three compression passes recovered ~79 KB against ~197 KB of gross growth: **losing 2.5:1, after five attempts.**

**The fastest-growing region is the priority block written by the previous weekly review (+62%), and W-6.1 is the worst instance** — a *closed* item now carrying its original clause, a retraction of it, a retraction of the retraction's prescribed fix, a measurement table, and two preservation blocks. Five layers on a settled question. That is the reviewer's defect, not a run's, and W-7.2 names it as such.

### 4.3 Market data has missed two days

`market.json` is `asOf 2026-09-04`; refresh commits ran daily 08-31 → 09-04 and none on 09-05 or 09-06. With `STALE_AFTER_DAYS = 4`, the Sector and Market Signals screens degrade on **2026-09-09**. Second occurrence of the W-6.5 pattern in eight days. **Owner's scheduled job — flagged, not touched.** What is new is that the app is live, so this is now a public surface degrading rather than a local one.

### 4.4 Two open owner decisions, both now shipping decisions

- **O-3 / translation:** es/ko/zh/ja at **0% human review**, 47 abridged pairs. The "(Beta)" decision of 08-11 was made about an unpublished corpus. Four languages of unreviewed machine translation are now on a public URL under the owner's name. Re-affirm, cap, or gate the pickers.
- **`check-data.mjs` is 11,597 lines in one file**, up 33% this week. Not urgent, but it is the one number inside the improved ratio still moving the wrong way.

## 5. What last week's block actually achieved

Recorded because it is measured, not asserted: **W-6.2 rule 1 bound and runs said so in their own headings.** Four entries open with "W-6.2 rule 1 sent me off a Nth consecutive X pick". Scheduled picks are now dominated by live walks of the built app (7), corpus sweeps of never-swept classes (8), and `LAUNCH_PLAN.md` clauses (7). The 146→147→148→149 residual chain did not recur. **The instrument-to-app ratio improved** (2.35x → 2.19x) and weekly insertions moved from 2.9:1 in favor of scripts to near parity (3,991 / 3,662). W-6.3 asked for the number to be re-measured rather than obeyed; it was, and it moved the right way.

## 6. Plan for next week (backlog block W-7, committed in `a878e8c`)

1. **W-7.1 — redeploy, then guard the gap.** Build and redeploy `dist/`, verified unauthenticated. Then build a check that compares the live entry bundle against a local `HEAD` build and fails on divergence. ⛔ **Prove it red against today's divergence *before* fixing the divergence** — the negative control exists now and will not after the redeploy. Then write a deploy cadence into `DECISIONS.md`; the repo currently has no answer at all.
2. **W-7.2 — closed text is replaced by its conclusion, not annotated with one.** "ORIGINAL CLAUSE, kept because…" is retired; cite the commit instead of pasting the text. Run-log history is untouched (W-5.3 unchanged). Applies to W-7 itself first.
3. **W-7.3 — market refresh** is the owner's job; flagged, stale on 09-09.
4. **W-7.5 — O-3 is now a shipping decision.** Owner's call.
5. **Standing:** W-6.2's residual-chain rule and W-6.3's ratio-quoting rule remain binding.

**The test of this block is stated inside it:** the backlog is **425,414 b** as of this commit. Next review opens with that number. If it has grown again, W-7.2 failed the same way W-6.4 did, and the remedy is structural rather than another rule.
