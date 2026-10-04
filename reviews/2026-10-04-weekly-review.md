# Weekly review — 2026-10-04

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-09-27 → 2026-10-04.
Working tree at review start: `91557e0`, clean apart from two untracked directories
(`Migration/`, `UIUX/`) that are the owner's and were not touched.

**Grade: A−.** Execution stayed at last week's high bar, and the two things that pulled last week
down both fixed themselves without an owner touching them: **W-9.1 landed and its test passes by
48,248 b; W-9.4 cut short-string hand reads from 6-of-7 runs to 1-of-31.** This is also the first
week in three with **no outage** — 4 runs/day on all seven full days, 31 run-log entries against 31
non-market commits, no mismatch in either direction. What holds it below an A is that the critical
path has now not moved for a third week and is still entirely owner-held — and that W-9.2, re-measured,
turns out to be worse than last week's reading.

---

## 1. What shipped

**35 commits: 31 dev-agent, 4 market-data refreshes.** Cross-checked per day — non-market commits
against live run-log entries — **4/4, 4/4, 5/5, 4/4, 4/4, 4/4, 4/4, 2/2 for 09-27 → 10-04. No
mismatch in either direction.** The 09-21 → 09-26 entries were archived mid-week by W-5.3's
twenty-first firing and are in `AGENT_LOG.archive.md` under `## Archived 2026-09-21 → 2026-09-26`.
One of the 31 was owner-directed and interactive (09-29, the Spanish style questions).

### The headline: the quiz's option-length tell was closed out, and the gain is measured

Five runs closed `q023`, `q037`, `q040`, `q034` and `q027` — item 160's class A, now **exhausted
except `q021`, which is unreachable.** Measured for this review by running `check-data.mjs` §65 in a
worktree at last week's HEAD (`deb8cdf`) and again at `91557e0`, so both columns come off the
instrument and neither is retyped from a run entry:

| longest-option strategy | 2026-09-27 | 2026-10-04 | chance |
|---|---|---|---|
| en | 50.0% | **39.1%** | 25.0% |
| es | 47.8% | **37.0%** | 25.0% |
| ko | 47.8% | **37.0%** | 25.0% |
| ja | 45.7% | **34.8%** | 25.0% |
| zh | 43.5% | **32.6%** | 25.0% |

**The exploitable edge over chance fell from 25.0 points to 14.1 in English — a 44% cut in a week.**
Shortest-option scores did **not** move (2.2 / 2.2 / 0.0 / 4.3 / 2.2), so no run paid for the forward
tell by creating the inverse one — the trap item 160 warns about twice. The 10-04 run also found and
recorded *why* the queue had looked shorter than it was: `q027`'s "6%" margin was the **English
minimum**, while ko/zh/ja were 100/61/53%. Ranking by the minimum had been hiding the loudest CJK
tell in the corpus.

### Content accuracy, mostly aimed at non-US learners

- **Four parent-guide fixes** (`kidsContent.js`, 09-30 → 10-02), each a US-only fact being taught to
  ko/zh/ja parents: sales tax is **not** added at the register in Japan, Korea, China or the EU;
  pension and health-insurance deductions there are **premiums, not taxes**; the
  spending-is-income saying no longer arrives in US dollars; and three unsourced superlatives were
  dropped, two of which contradicted each other ("the single habit", twice, about different habits).
- **Lesson 5** no longer gives one fund's 2008 return (AGG's 8%) as the typical one — now
  *5%–8%, depending on the fund*, in all five languages.
- **Lesson 33**'s figure alternative text no longer tells screen-reader users that short debt cycles
  "repeat every 5-8 years"; it says *on average*, with the real US spread.
- **Fed-chair simulator**: the euro area was not "already in recession" when the ECB hiked in 2011
  (true for 2008, not 2011, by the euro area's own dating committee); seven ko/zh/ja wording fixes;
  and all six levers measured to fit at 320 px in five languages.

### Neutrality guard widened twice

`check-blindspot.mjs` now catches Chinese *"now is a good time to buy stocks"* (up to four Han
characters may sit between the verb and `的好`; bare `买`/`卖` count as verbs) and Spanish's
post-nominal *"el momento ideal para invertir"* plus *"start investing"* in en/es. Each widening
ships a concrete sentence that previously passed, and the control mechanism was itself upgraded —
`fires` may now be a list, and **every** listed sentence must match, or the check fails as a dead
pattern. This guards the app's single most important neutrality rule.

### Four runs that changed no code, and said so

Lesson 13's `$10-$30` commission range, lesson 11's fee ranges against ICI, item 117's note (i), and
the 320 px lever risk: all re-measured, all held, nothing in `src/` touched, residuals closed as
measured. **Four of 31 runs produced no code change and that is a feature, not idle time.**

### Spanish style (owner-directed), log mechanics, and the claims audit

- **09-29, owner-directed**: Spanish titles to sentence case (correct Spanish orthography), *tú* in
  the Fed-chair simulator, masculine "Fed" throughout — 14 files. I scanned the sweep for
  proper nouns accidentally lowercased and found none; `Fed`, `Reserva Federal`, `PIB`, `IPC`,
  `Estados Unidos` and `Japón` all keep their capitals, and lowercase `banco central` is the generic.
- **W-5.3 pass 21** (10-03) and **item 167's late move** (09-28) — 2 of 31 runs, 6%, on log
  mechanics. Pass 21's byte accounting was verified rather than trusted: **−98,482 b** out of
  `AGENT_LOG.md`, **+102,797 b** into the archive, which is the claimed 102,758 b plus a 39 b heading
  with 4,276 b of pointers written back.
- **The 10-04 claims audit** answered `LAUNCH_PLAN.md` §9.3's question 4 (a day late, and it says so):
  16 rows re-measured — not re-read — and re-dated to 2026-11-07, the next audit. **It found two of
  its own rows had been stale for 29 days:** A1 still claimed `analytics.js` had zero network calls
  when the transport shipped 2026-09-05, and C1 still said "no web deploy" after the site went live
  the same day. Both are still unmeasurable, but on **O-2** now, not on code. The run also named the
  recurring pattern: `check-claims.mjs` validates that a threshold is a number and a date is a date,
  and cannot tell a live claim from a dead one.

---

## 2. Build and test status

Runtime from `scripts/bootstrap-node.sh`: **system Node v26.7.0, npm 11.19.0** — no download needed,
and the script reported the rollup/esbuild native binaries load under it.

| check | result |
|---|---|
| `npm run build` | ✅ **passes**, built in 1.00s, exit 0 |
| `npm test` | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm test` (re-run after this review's backlog edit) | ✅ **0 FAIL, 1 WARN**, exit 0 |
| `npm run check-deployed` | ❌ **DIVERGED** — see §4.3 |

The single warning is **O-3's**: translation review coverage 100% reviewed / **0% human** in all four
non-English languages. That is an owner decision, not a defect. **Nothing was broken this week, so no
build fix was needed** — the one code change this role is permitted was not required.

MEASURED off `check-log-size.mjs` before this review wrote anything: floor **251,752 b** (50.4% of
the 500,000 b budget), backlog **213,346 b**, run log **164,355 b** (65.7% of warn, 8 live days).
**W-9's test — "W-9.1 has landed and the floor is below 300,000 b on 2026-10-04" — passes with
48,248 b to spare**, against a projection of ~216,000 b that item 167's late move helped close on.
All `check-log-size` controls pass; the five sections sum byte-exactly to the file.

---

## 3. Quality, accuracy and neutrality

**No regressions found. No advice-adjacency found. One content-accuracy problem found, and it is
mine rather than the week's — see §4.1.**

`npm run check-blindspot` is green inside `npm test` with per-language pattern sets for all five
languages, §10.1 passes on 34 advice patterns across five languages and all 8 disclaimer surfaces,
and two of this week's commits *strengthened* that net. I read the week's content diffs directly
rather than trusting the checks. **No buy/sell language, no personalized advice, no recommendation,
no hedge removed, no threshold relaxed.** Net churn in `src/` is **+342 / −338 lines** — this was a
week of in-place correction, not of new surface.

The methodological discipline stayed high and is worth two specific notes. The `q027` fix is not a
deletion: the English *gained* substance (*"until the owner buys something with it"*) while shedding
the tell, and the reasoning it dropped was already carried in that question's `explain`, which the run
checked before moving it. And the claims audit put a control on every scan it ran — the PostHog host
string appears twice in the live bundle, which is how it proved the scan was reading the file at all
before reporting `provider:"posthog"` zero times.

---

## 4. Concerns

### 4.1 ⛔ A content over-claim this review found, in four places, never examined before

The essentials brokerage lesson teaches that uninvested cash in a brokerage account **does not
grow** — in the lesson body, in its `takeaway` (*"money inside it only grows once it's used to buy
something"*), in `q027`'s correct option and in `q027`'s `explain`. **Most major US brokerages sweep
uninvested cash into an interest-bearing bank-sweep or money-market position**, so a learner who
opens a real account and watches that cash earn interest has been told the opposite of what they see.

**Measured rather than assumed: `money market` returns 0 matches across `AGENT_LOG.md`,
`AGENT_LOG.archive.md` and `CLAIMS.md`, and every `sweep` hit in those files is the verb.** This
class has never been raised. The week did not introduce it — `q027`'s old wording made the same claim
— but it is now in four places and in five languages.

**The teaching point is sound and must survive the fix:** a brokerage account is a container, not an
investment, and opening one commits nothing. Only the absolute form of the second clause is wrong, so
the fix is a hedge, not a rewrite. Filed as **W-10.1**, the week's priority pick, deliberately as a
*content* pick: it needs no owner input and is bounded at four sites.

### 4.2 ⛔ W-9.2 re-measured, and the task file is wrong about something bigger than the remote

`economics-app-dev-agent` is **still `enabled: false`, `lastRunAt` 2026-09-07**, cron every 2 hours,
while 31 commits landed this week on a clean 6-hour cadence. Unchanged from last week. **What is new
is the second false claim in the same sentence.** Line 9 of that `SKILL.md` reads:

> *"the GitHub remote 'origin' is NOT usable — never push, never fetch … The main application is
> economic-cycles-v5.jsx, a single-file React app."*

**Both halves are false, measured today.** The remote half stopped being true at O-4. The second half
points every run at a **13,207 b legacy prototype last touched on 2026-08-16 by `d7b7153` "Stop both
prototypes appearing in the project (owner decision)"**: `index.html:63` loads `/src/main.jsx`,
`src/App.jsx:9` says *"This app is authored here … deliberately not imported"*, and neither `v5.jsx`
nor `v6.jsx` is imported anywhere under `src/`.

Every run has ignored it — all 31 commits touched `src/` — but **it is the first thing each one
reads**, and that same file's own Node note was false for 15 days for exactly this reason. ⛔ **Owner
action: fix line 9 in whichever task definition actually runs.** The never-push rule stays; *"NOT
usable"* and the `v5.jsx` sentence both go.

**The good news in this item:** the outage half of W-9.2 did not recur. Last week was a 72-hour gap,
the week before 40 hours; this week was **zero**.

### 4.3 The deploy gap is the same shape for the third week, and the margin is still one day

**Measured with `check-deployed --identify`, which rebuilt 7 candidates and found a byte-identical
match: the live bundle is `f4928ff` (Friday 2026-10-02 19:51).** Four commits behind, and all four
are the quiz-length fixes — **the learner is missing precisely this week's best work.** Live
`market.json` `asOf` 2026-10-02, age 2 d; `STALE_AFTER_DAYS` is 4, so **Sectors goes to the
unavailable state on 2026-10-06** and a Monday push clears it with one day in hand.

**This is not a regression and not a surprise — it is W-9.3's weekday-push cycle, confirmed a third
time.** ⚠️ **A Sunday review will always see this.** A future review must not re-raise it as
alarming; the only thing to watch is the one-day margin, and O-5's two routes (have the job push, or
document the gap) are unchanged.

### 4.4 Log growth: the archiving treadmill is now ~4 days, and the lever is entry size

Measured: **31 entries, mean 5,300 b each**, ≈21,200 b/day at 4 runs/day. Headroom to the 250,000 b
run-log warn is **85,645 b ≈ 16 entries ≈ 4.0 days**, so W-5.3's twenty-second firing is due around
**2026-10-08**. `check-log-size`'s own headroom figure agrees: **16.2 runs**. Two of this week's 31
runs went to log mechanics (6%) — acceptable, and no run should "fix" this. The lever is entry size,
not archiving cadence, and entry size is flat week over week rather than growing. Filed as a note
(**W-10.6a**) specifically so no run manufactures work from it.

A second, smaller note: **`CLAIMS.md` has no size guard** — `check-log-size.mjs` cannot see it. It is
36,713 b, with 17 claim rows totalling 22,403 b, and the rows have begun to accrete chained *"Earlier
record follows"* history; **A1's status cell alone is 2,957 b / 462 words.** Not urgent at 36 KB and
deliberately **not** a pick — W-9.1's lesson is that the move is cheap once the mass is real, and the
mass is not real yet. Re-measure at the 2026-11-07 audit.

### 4.5 Direction: the work is good and none of it can reach the gate

Every §4.3 content clause is met (44 lessons / 174 min, all three tracks translated in five
languages). The one unmet Phase-0 gate — installer lesson-1 completion ≥40% — is **❌ Unmeasurable**
and stays that way until O-2 lands. The code half of O-2 has shipped and been verified since
2026-09-05. **Nothing a run did this week moved the launch, because nothing a run can do moves it.**
That is not a criticism of the runs; it is why §5 is the owner's part of this report.

---

## 5. The owner's part, asked as questions rather than restated as blockers

Per O-1's own lesson — sixteen consecutive closing lines moved it none of the way; one direct
instruction moved it all of the way in about twenty minutes — these are asks, not status:

1. **O-2 — create one analytics account and paste a public key.** Four steps, ~20 minutes, and
   §4.3's Phase-0 gate becomes measurable for the first time in this project's life. It is the whole
   critical path and nothing is in front of it.
2. **O-3 — fund a fluent review of one language, cap what ships under "(Beta)", or re-affirm the
   decision now that the error rate is known.** Human-reviewed share is **0% in all four** non-English
   languages, and this week added five more hand-found defects in `moneyVisuals.js` and seven in the
   Fed-chair simulator to an already-measured density.
3. **W-10.2 — fix line 9 of the dev-agent task file** (two false claims, one of which names the wrong
   file as the application).
4. **O-5 — decide between having the job push and documenting the weekend gap.** One missed Monday
   push takes Sectors dark on Wednesday.

---

## 6. Plan for next week (priority block W-10, committed to `AGENT_LOG.md`)

| | item | owner? |
|---|---|---|
| **W-10.0** | W-9's test, taken first: floor **251,752 b**, below 300,000 b — **passes by 48,248 b**. W-9.4 worked (hand reads 6-of-7 → **1-of-31**); keep it. | — |
| **W-10.1** | ⛔ **PRIORITY — the brokerage uninvested-cash over-claim** (§4.1). Four sites, English first then four languages, hedge rather than rewrite, teaching point preserved. Needs no owner input. | run |
| **W-10.2** | ⛔ Fix line 9 of the dev-agent `SKILL.md`: the remote is usable (never push), and the application is `src/`, **not** `economic-cycles-v5.jsx`. | **owner** |
| **W-10.3** | Item 160's class A is **exhausted**; do not re-open it as a trimming item. Class B is O-3's. If re-ranked, rank **per language**, not by the minimum. | run (bound) |
| **W-10.4** | O-5, unchanged. A Sunday review will always see the gap — watch the one-day margin, do not re-raise it as alarming. | **owner** |
| **W-10.5** | O-2 and O-3, unchanged and third week, asked as questions (§5). | **owner** |
| **W-10.6** | Two notes filed so no run manufactures them: the ~4-day run-log treadmill, and `CLAIMS.md`'s missing size guard. **Neither is this week's work.** | — |
| **W-10.7** | This block's cost and W-10's test. | — |

**W-10's own test, for the 2026-10-11 review:** two measurements, both taken off instruments rather
than retyped — **(i) W-10.1 has landed**, and **(ii) §65's longest-option rate has not risen above
the 2026-10-04 reading in any language (en 39.1 / es 37.0 / ko 37.0 / ja 34.8 / zh 32.6)**, i.e. no
distractor edit quietly gave the tell back.

---

## 7. Notes

- `Migration/` and `UIUX/` are untracked and were left untouched, as were the launch-plan documents
  and `working_files/`.
- Nothing was pushed to any remote. No history was rewritten. No commit was reverted. No file of the
  owner's was modified.
- The W-10 block cost **10,198 b**, against W-9's 10,677 b, W-8's 11,676 b and W-7's 12,567 b.
  Floor after it: **261,950 b (52.4% of budget)** — read off `check-log-size.mjs`, not projected.
- A temporary git worktree at `deb8cdf` was created under the session scratchpad for the §65
  before/after measurement and is removed at the end of this run; the repository was not checked out.
