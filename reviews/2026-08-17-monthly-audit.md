# Monthly blindspot audit — 2026-08-17

Run by: scheduled dev-agent (backlog item 32). `LAUNCH_PLAN.md` §9.3.
HEAD at start: `d49c465`. Branch `main`, local only, nothing pushed.

> **This is the first time §9.3 has ever been run.** The ritual was specified on day one,
> `LAUNCH_READINESS.md`'s §10.7 row already defers to it ("Recheck that way at each monthly audit"),
> and backlog item 32 filed it on 2026-08-16 with the note that the next first Saturday is
> **2026-09-05**. It is being run nineteen days early and deliberately: item 32 says a dev-agent run
> can do the preparation honestly, and four of the five questions turned out to be fully answerable
> from the repo today. **Treat this as the audit of record for the period and re-run the ritual on
> 2026-09-05** — by then question 4 has nine claims coming due on that exact date, which is the first
> time it will have a non-trivial answer.
>
> **What this audit did NOT do, and why.** §9.3 ends "Then update §10: retire resolved blindspots,
> add new ones." §10 lives in `LAUNCH_PLAN.md`, which **the owner has uncommitted edits in right now**
> (the UIUX redesign, 13 files). An agent does not edit a file the owner is working in. The three new
> blindspots this audit found are written up in §6 below, ready to be moved into §10 verbatim by the
> first run that finds the plan clean.

**Method note.** Every number below is pasted from a tool's own output or computed by a command
recorded next to it. Nothing here was retyped from a previous run-log entry — that is backlog item
70's failure mode, and an audit is exactly the wrong document to reproduce it in.

---

## 1. What number did I avoid looking at this month because I feared the answer?

**The answer is the ratio of prose-about-the-work to work.** Measured over the last eight days
(`git log --since=2026-08-10 --numstat`), lines added+deleted by area:

| Area | Lines churned |
|---|---|
| `AGENT_LOG.md` | **20,061** |
| `src/content/` (lesson text — the product) | 14,749 |
| `scripts/` (the checks) | 6,614 |
| `src/` **application code** (everything not content or locales) | **1,964** |
| `src/locales/` | 89 |
| all other `*.md` (`DECISIONS`, `LAUNCH_*`, `CLAIMS`, `README`, reviews) | 1,671 |

115 commits in that window; 66 touch `src/` at all, 49 touch only docs and scripts.
(`AGENT_LOG.archive.md`'s 8,055 lines are excluded above — that churn is the W-3 archive *move*, not
new prose, and counting it would overstate the case.)

**The uncomfortable framing, stated plainly: the run log alone churned more lines than the entire
`src/` tree, and slightly over ten lines for every line of application code.** Some of that is
legitimate — this project's memory between runs *is* the log, and several entries earned their length
by recording a measurement that would otherwise be re-derived. But ten-to-one is not a memory budget,
it is the shape of a system whose main output has quietly become its own account of itself.

**Why this counts as "avoided" rather than merely "unmeasured."** The evidence that it was avoided is
that the project has been narrating this in fragments for a week without ever summing it: W-3 measured
the log at 909 KB and cut it 43%; three separate entries flagged the App-summary staleness before one
fixed it; two entries wrote "remaining dev-agent-actionable areas are thin." Each of those is a local
observation of the same global fact, and none of them multiplied it out.

**A second, smaller number in the same family — and this one is a defect, not a judgment.** The
falsifiable-claims register `CLAIMS.md`, whose entire purpose is to stop stated beliefs from going
quietly stale, **has not been touched since 2026-08-16** (`20f82e7`) and had gone stale in two of its
own rows within roughly 24 hours:

- **A6's status cell read "40 lessons / 120 min."** The tree says **144 min** — item 56 recalibrated
  every lesson's `minutes` on 2026-08-17 and moved the catalog total. The claim itself still holds
  (144 > 120 clears §4.3 harder than before), but the register was asserting a stale number as its
  evidence.
- **A3's supporting paragraph read "93%, 0% human, 3 entries stale ... drifting the wrong way."**
  `npm run review-status` today reports **40/40 (100%) for all four languages, 0 stale, 0 unreviewed**
  — commit `9f24a0b` re-reviewed the 12 stale pairs *after* `CLAIMS.md` was written. The paragraph
  also accuses `LAUNCH_READINESS.md` of being stale for reporting 100%; `LAUNCH_READINESS.md` was
  right and `CLAIMS.md` is now the stale one.

Both were true when written and rotted underneath the file. Both are fixed in the same commit as this
audit, and A6's figure is now **generated** by `scripts/refresh-readiness.mjs` rather than retyped, so
it cannot rot silently a second time. A3's is not guarded, deliberately — see §5.

---

## 2. What is still in the plan only because removing it feels like wasted work?

**The four non-English locales.** This is the honest answer and it is uncomfortable because the work
is real and large:

- **664 KB** of `es`/`ko`/`zh`/`ja` content and UI strings, against **196 KB** for English — **77% of
  all shipped content bytes are in languages nobody has verified.**
- **0% human review.** 160/160 lesson×language pairs are marked `method: "ai"` in the ledger. That is
  Claude reviewing Claude's own translation, which the `method` field exists precisely to keep visible.
- **Unmeasured by every instrument this repo owns.** The jargon corpus is `en`-only (item 66's caveat
  (c)); §17b's glossary-coverage sweep is `en`-only; the readability model is `en`-only. Backlog item
  69 filed this as "unreachable, not merely unchecked."
- **They tax every content change.** Five-way parity is enforced on every `npm test`, so a one-line
  English edit is a five-file edit.

**What this audit is NOT saying.** It is not saying to cut them. The owner took that decision
explicitly on 2026-08-11 (P-4, option (a): ship under "(Beta)" labeling), and `CLAIMS.md` A3 already
carries the belief with a refuting number. **What the audit is saying is that A3's non-debt half —
"non-English sessions under 15% of total" — is unmeasurable, will stay unmeasurable until item 18
lands, and that the four languages are therefore currently held by a decision that no evidence can
reach.** That is the §9.3 pattern exactly: not wrong, but surviving on sunk cost rather than on a live
argument. The right response is a date, not a deletion — see §6's B-2.

**A candidate that was considered and rejected:** `economic-cycles-v5.jsx` (246 lines, the superseded
prototype). It survives for provenance, it is explicitly protected by the dev-agent task's hard rules,
and it costs one cheap grep in `check-blindspot.mjs`. Keeping it is a decision with a live reason, not
sunk cost.

---

## 3. What did the last three users I spoke to say?

**No user has ever opened this app, and this is stronger than "I haven't spoken to any."** There is no
surface on which a user could exist:

- **No deploy, and no deploy target.** No `.github/`, no `netlify.toml`, no `vercel.json`, no `CNAME`.
  `dist/` exists locally and is `.gitignore`d (`.gitignore:2`).
- **No store presence.** §2.1 Expo-vs-Vite is backlog item 12, still `[HELD]` on an owner call.
- **No analytics backend.** `src/lib/analytics.js`'s own header: the events are "wired to a local sink
  today rather than the plan's target provider (PostHog) — there is no analytics account or backend
  for this project yet." `sink()` writes to `localStorage` on one device and nothing leaves it.

**So the finding is not "we have not asked users." It is that the project has spent a month building
verification apparatus for an artifact that has never been in front of a human being.** Item 18 (an
analytics provider account and key) is named in every run's output as the critical path, which is
correct — but item 18 is downstream of a deploy that also does not exist, and no backlog item owns
that. **C1 is honest about it** ("Unstarted — 0 clips posted, no store presence, no web deploy") and
that honesty has not yet turned into a task.

---

## 4. Which claim is past its check date?

**None.** `node scripts/check-claims.mjs`:

```
  §9.1 claims register: 15 claims, 2 refuted, 0 past due (as of 2026-08-17).
```

That clean answer is close to vacuous today and will not be in three weeks, so the substance is:

- **Nine claims come due on 2026-09-05** (A1, A2, A3, A4, A5, A7, C2, D1, D2) and **six on 2026-10-03**
  (A6, B1–B4, C1). The 2026-09-05 wave is the first real test of this register.
- **Of the nine, six are unmeasurable today — A1, A2, A4, A5, A7, C2 — and every one of them names
  item 18.** (A3 is measurable on its debt half only; D1 and D2 are the two that are fully measurable,
  and both are already refuted.) On 2026-09-05 the honest disposition for those six is "still blocked,
  re-dated" — which is legitimate exactly once. A second consecutive re-dating with no change to item
  18 would mean the register has become the softer-restatement failure its own header forbids, one
  indirection out.
- **Two are refuted and stay refuted** (D1, D2), with their forced product changes recorded. Good.
- **D1 is undercounted, and the undercount is itself the finding.** D1's status cell says
  "**REFUTED — twice**" and names two instances. The log has recorded at least two more since:
  item 62's F4 (a run-log figure that failed re-measurement) and item 67's "56 → 55" (a summary number
  contradicted two paragraphs down in its own entry). Item 70 was built in response to the second.
  So D1 is not merely refuted, it is *recurring* — and a claim whose instance count is itself
  hand-maintained is a small instance of the same disease.

---

## 5. What would a skeptical friend say is obviously wrong right now?

Three things, in the order a friend would actually say them.

**(a) "You have built a quality system for a product with no users, and the quality system is now the
product."** Eight check scripts, a claims register, a decisions log, a readiness scorecard, a
translation-review ledger with drift detection, a measurement-fingerprinting system that re-runs
instruments to verify the run log's arithmetic — and a 10:1 prose-to-code churn ratio (§1) with zero
deploys (§3). Every one of those artifacts was individually justified by a real failure. That is how
this happens; it does not make the aggregate right.

**(b) "Ten of your last thirteen filed backlog items had a wrong premise, and you noticed it one item
at a time."** The log records the streak in its own words, item by item: items 55, 56 and 57 "were
each filed against a real clause with wrong numbers"; then 58 ("the fourth item running"), 59 ("the
fifth consecutive"), 61/62 ("six items running"), 60 ("the seventh item running"), 66 ("the eighth
item running"), 63 ("the ninth item running") — and then item 64, "breaking a nine-item streak,"
where both premises held. Item 68 later recorded "six of the last seven items had a partly wrong
premise."

**This is a measured, currently-checkable process failure that has no claim in `CLAIMS.md`.** D1 and
D2 both cover *verification* (a run's report of what it did); nothing covers *filing* (a run's
description of a defect it has not yet fixed). The observed rate is roughly **9 in 10 at its worst**,
and the fix already discovered — carry a control, re-measure before editing — is written in item 60's
notes and applied inconsistently. Filed as D3 in §6.

**(c) "Your gate says met, and your gate is the one number you grade yourself on."** §4.3's content
clauses are met (40 lessons / 144 min) and have been since 2026-08-15. The remaining Phase-0 clause is
≥40% of installers finishing lesson 1 — which needs installers. The friend's version: *the two clauses
you can satisfy alone are satisfied, and the one that needs the outside world has not moved because
nothing has been shown to the outside world.* This is the same finding as §3 arriving from the
scorecard's direction, which is why it belongs here rather than being deduplicated away.

---

## 6. New blindspots, for §10 — **NOT yet applied** (`LAUNCH_PLAN.md` is owner-dirty)

Written in §10's own register format so a later run can move them across verbatim once the owner's
redesign lands. **Do not paraphrase them on the way — the wording is the finding.**

- **B-1. Process mass exceeds product mass.** *Open, found 2026-08-17 by §9.3's first audit.* The run
  log churned 20,061 lines in eight days against 1,964 lines of application code (§1). No individual
  entry is unjustified; the aggregate is. **Refuting number:** over any 7-day window,
  `AGENT_LOG.md` churn exceeding 5× `src/` churn. **Check:** 2026-09-05.
- **B-2. The four non-English locales are held by sunk cost, not by evidence.** *Open, found
  2026-08-17.* 77% of content bytes, 0% human review, invisible to every instrument (§2). The owner's
  P-4 decision stands; what is missing is a date on which it gets re-argued rather than re-assumed.
  **Check:** 2026-10-03, and the check is "has anything made A3's session-share half measurable yet?"
- **B-3. Nothing owns "get this in front of one person."** *Open, found 2026-08-17.* Item 18
  (analytics) is correctly named as the critical path in every run's output, but it is downstream of a
  deploy, and no backlog item owns the deploy (§3). **Refuting number:** the trivial one — one
  reachable URL, or one person who has opened the app. **Check:** 2026-09-05.

And one new claim for `CLAIMS.md`, also **not applied this run** — the register is a live document and
adding a row to it is a judgment the audit should propose rather than smuggle in beside a figure fix:

- **D3.** *A backlog item's premise can be trusted well enough to implement without re-measuring.*
  **Refuted if** any filed item's headline number is corrected on execution. **Check** 2026-09-05.
  **Measurable today: yes.** **Status on the evidence in §5(b): REFUTED, nine consecutive times.**
  Per §9.1 the response must be a product change, and the honest candidate already exists in the
  process — make "re-measure the premise, with a control, before editing anything" an explicit step,
  the way the adversarial self-check became one after D1.

---

## Disposition of this audit

**Applied in this commit:** the two stale `CLAIMS.md` figures (§1), with A6's now generated by
`scripts/refresh-readiness.mjs` so it cannot rot silently again. A3's is **not** guarded on purpose:
it is a moving operational number whose home is `npm run review-status`, and item 55 established that
the cheapest permanent fix for a figure an argument does not need is to delete it, not to guard it.
Guarding it would also be the wrong lesson to draw from an audit whose headline finding is that this
project builds too many instruments.

**Deferred, with the blocker named:** §10's update and D3's addition (above). §10 is blocked on
`LAUNCH_PLAN.md` being owner-clean. D3 is not blocked — it is deliberately proposed rather than
applied, because an audit that quietly edits the register it is auditing is not auditing it.

**Next run of this ritual: 2026-09-05**, the first Saturday, when question 4 stops being trivial.
