# Falsifiable claims register (`LAUNCH_PLAN.md` §9.1)

> §9.1: *"Before building anything significant, write one sentence: what you believe, the number that
> would refute it, when you will check."*
>
> **The rule that makes this register worth keeping:** when a claim is refuted, the response is *a
> change to the product* — **not a softer restatement of the claim.** A claim edited to be easier to
> satisfy has not survived; it has been abandoned quietly. If you are tempted to reword a "Refuted if"
> threshold, stop and write down why the old number was wrong *before* you knew the result. If you
> cannot, the claim is refuted and the register should say so.

Created 2026-08-16 (backlog item 30). This is the artifact §9.1 asks for and the one §9.3's monthly
audit question 4 ("which claim is past its check date?") reads. It is deliberately separate from its
two neighbors, which answer different questions:

| File | Answers |
|---|---|
| `DECISIONS.md` | *Why* we chose what we chose. |
| `LAUNCH_READINESS.md` | *What is true now.* |
| **`CLAIMS.md`** (this file) | **What we believe, what number would prove us wrong, and when we look.** |

`npm test` runs `scripts/check-claims.mjs` over this file: it fails on a malformed row and warns when
a claim is past its check date. That check exists because this project's recurring failure is not
having bad beliefs — it is letting stated beliefs go unexamined until they quietly soften.

## How to read a row

- **Refuted if** — a number and a threshold. If you cannot write one, you do not yet understand the
  belief well enough to hold it (§9.2's version of the same test: *"If you cannot name the event that
  would refute a feature, you do not yet understand the feature."*).
- **Check** — an ISO date, always, even when the claim is not measurable yet. A blocked claim still
  gets a date on which we look at *whether it is still blocked*. "When analytics land" is not a date
  and is how a claim goes three months unexamined.
- **Measurable today** — honest yes/no. Most are **no**, and nearly all of those name backlog item 18
  (no analytics provider; `analytics.js`'s `sink()` writes to `localStorage` on one device and nothing
  leaves it). **That concentration is itself the finding: item 18 is not one blocked backlog item, it
  is the thing keeping most of this register unfalsifiable, and therefore the critical path out of
  Phase 0.**

---

## A. Product-shape bets

Bets this build has already made in code, and which had never been written down as claims until this
file existed. Each names the mechanism that implements it, so a future reader can find the thing that
would have to change if the claim is refuted.

| ID | Claim | Refuted if | Check | Measurable today | Status |
|---|---|---|---|---|---|
| A1 | Sequential unlocking within a track raises completion versus letting people browse freely. (`isUnlocked` in `useAppState.js`, rendered by `Learn.jsx`.) | Under 40% of installers finish lesson 1 in month one — §4.3's own Phase-0 clause. | 2026-09-05 | No — item 18 | Open, unmeasured |
| A2 | *(claim text as written 2026-08-16, kept verbatim)* Money-first two-track ordering fixes the §0 "vehicle, not the product" mismatch. (`TRACKS` in `lessons.js`; `DECISIONS.md`.) | *(threshold kept verbatim — it has NOT been relaxed)* Under 60% of first sessions start a money-track lesson once measurable. | 2026-10-03 | No — item 18, and since 2026-08-18 unmeasurable in principle | **SUPERSEDED 2026-08-18 by the owner's economy-first reversal (`DECISIONS.md`); recorded here 2026-09-04. Not refuted, and not softened.** The app stopped opening on the money track that day. The count is still nominally takeable — measured live 2026-09-04 on the built app from cleared `localStorage`, all three tracks' first lessons are tappable on a fresh install, so a first session *can* start a money-track lesson — but it no longer measures what it was written to measure. The same live reading shows the START HERE card is "Transactions: The Building Block" in How the Economy Works, so 60% is now a threshold on how many installers navigate *away from* the default, and A2 was written about the default itself. Successor: **A8**. The check date moved from 2026-09-05 to the monthly-audit date **with this reason written down**, per §9.1 — not to postpone a live check, but because the 09-05 date would have queued a dead claim for a measurement nothing can perform. |
| A3 | Five languages under "(Beta)" are worth their maintenance cost. (`locales/`, five-way parity enforced by `npm test`.) | Non-English sessions under 15% of total once measurable; **or** translation review debt grows for two consecutive months. | 2026-09-05 | Partly — debt half only | Open; debt half checkable now |
| A4 | Parent-facing kids content costs us little engagement versus a child-facing build. (`screens/reference/`, §10.3.) | Kids-guide views under 2% of sessions once measurable. | 2026-09-05 | No — item 18 | Open, unmeasured. **Not a free choice** — §10.3 is a COPPA/store-classification decision reopened 2026-08-04 and owner-held; if this claim is refuted the response is an owner decision, not a unilateral UI change. |
| A5 | The Leitner spaced-review queue earns its complexity. (`lib/review.js`, `screens/Practice.jsx`.) | Under 20% of users who finish ≥3 lessons open Review within a week. | 2026-09-05 | No — item 18 | Open, unmeasured |
| A6 | The catalog is now large enough for Phase 0. | §4.3's content clauses unmet: under 40 lessons or under ~2 hours. | 2026-10-03 | **Yes** | **Holding** — 44 lessons / 161 min, both clauses met (`LAUNCH_READINESS.md`) |
| A7 | Interactive content — a mechanism the reader drives, not just watches — is the §3.0.4 differentiator a chat window cannot copy. (`components/PolicySim.jsx`, `content/policyScenarios.js`.) | Under 35% of sessions that open the hosting lesson fire at least one `sim_lever_chosen`; **or** learners who move a lever complete that lesson at no higher a rate than those who don't. | 2026-09-05 | No — item 18 | Open, unmeasured; the event exists as of 2026-08-16 |
| A8 | Economy-first ordering — the macro chain as the main path, judgment second — is what installers actually want to open with. (2026-08-18 owner reversal; `TRACKS` in `lessons.js`; `DECISIONS.md`.) | More than 40% of installers who open any lesson leave the economy track for `money` or `essentials` before finishing three economy lessons; **or** economy lesson 1's completion rate comes in below the money track's first lesson once both are measurable. | 2026-10-03 | No — item 18 | Open, unmeasured. Replaces **A2**. |

**A2 carries a measurement flaw worth stating rather than hiding:** the pre-split single-chain baseline
was never captured, so this claim can only be checked forward against its own threshold, never as a
before/after comparison. The split may well have been right — the argument in `DECISIONS.md` is a good
one — but the evidence for it will always be weaker than it would have been had anyone measured first.

**A2 was superseded by an owner decision on 2026-08-18 and this register did not notice for seventeen
days (recorded 2026-09-04).** The 2026-08-18 reversal in `DECISIONS.md` made `economy` the first
track, so the app no longer opens on a money-track lesson — which is exactly what A2's threshold asks
about. From that day the row's number measured the opposite of its own sentence — how many
installers navigate away from the track the app opens on, rather than whether opening on money was
right. It is not that the count became impossible (all three tracks' first lessons are tappable on a
fresh install, measured live 2026-09-04); it is that the mechanism the claim names stopped existing
while the number stayed syntactically fine. `LAUNCH_PLAN.md` §0 and `DECISIONS.md` were both updated when the decision landed, and
`LAUNCH_READINESS.md`'s §4.3 row was repaired on 2026-09-04 by the run that found it — **this file was
the third carrier of the same reversed premise, and the one with a refuting number attached to it.**
A2 is therefore marked SUPERSEDED with its claim and its threshold kept verbatim, so that nobody
reading later can mistake this for the softening §9.1 forbids; **A8 is the live successor**, written
against the mechanism the product actually has.

**The transferable part, and it is the reason this paragraph is longer than the fix:** *a claim rests
on a decision, and nothing in this repo joins the two.* A refuting number stays syntactically valid
after the mechanism under it is reversed — `check-claims.mjs` parsed A2 happily every run for
seventeen days, because a script can check that a threshold is a number and a date is a date, and
cannot check that the thing being counted still exists. **So when `DECISIONS.md` records a reversal,
grep this file in the same change.** No check was built for that (`LAUNCH_PLAN.md` §9.1's own note on
what this register deliberately does not verify applies: no script can tell a live claim from a dead
one), and the honest guard is the habit, not another instrument.

**What A8 does differently, stated before any result is known.** A2's threshold could be satisfied by
the navigation alone — the app opened on the money track, so first sessions started there. A8's first
clause measures **leaving** the track the app opens on, and its second is a **comparison** between two
tracks' first lessons, so neither can be won by the ordering the claim is about. The 40% and the
"three lessons" are first guesses and are recorded as ones, the way A7's 35% is.

**A3's two halves have different strengths.** The debt half is checkable today, and the way to check
it is to **run `npm run review-status`** — not to read a figure here. This paragraph used to quote one
("93%, 0% human, 3 entries stale"); it was true when written on 2026-08-16, commit `9f24a0b`
re-reviewed those very pairs the same day, and the number sat wrong until §9.3's first monthly audit
found it on 2026-08-17. It is deleted rather than corrected, because a moving operational figure
restated in a second file is a figure that will rot again. *(That sentence also accused
`LAUNCH_READINESS.md` of being stale for reporting 100%. It was not; this file was. Recorded rather
than silently dropped — see `reviews/2026-08-17-monthly-audit.md` §1.)*

What is durable is the **shape**, which is what the figure was being cited for and which has not
changed: coverage has run at or near 100% while **the human share has never left 0%** — every reviewed
pair is `method: "ai"`, Claude reviewing Claude. That is the half of A3 worth arguing about. The
translation **volume ratios** are **not** evidence either way and are deliberately not quoted here —
Chinese and Japanese encode the same content in far fewer characters, so a low ratio is expected and
is not a quality signal. Do not cite those ratios as refutation.

**A7 is the one claim here whose measurement was built before the claim was written down, and only
just.** The simulator shipped 2026-08-16 with no instrumentation at all; `sim_lever_chosen` was added
the same day, specifically because §9.2's test ("if you cannot name the event that would refute a
feature, you do not yet understand the feature") had no answer for the app's only interactive feature.
Three things about it should be read as stated, not softened later:
- **The two clauses test different things on purpose.** The first asks whether anyone drives the model;
  the second asks whether driving it mattered. A feature can pass the first and fail the second, and
  that combination — people touch it, it changes nothing — is the one that would actually refute
  §3.0.4, because it is what a decorative interaction looks like in data.
- **35% is a first guess and is recorded as one.** It is set where it is because a lever is a single
  tap directly under prose that invites it, so a rate far below a third would mean the invitation is
  not landing. If it is missed, the honest move is a product change (or a documented reason the number
  was wrong *before* the result was known) — not a lower threshold.
- **The denominator is one lesson, not the app.** `PolicySim` renders for the lesson that hosts it and
  `null` for the other 39, so A7 is measured against that lesson's `lesson_started`. A run that adds a
  simulator elsewhere widens the denominator and must say so here.

---

## B. Monetization

These four already existed in `LAUNCH_PLAN.md` §4.6 — item 30 recorded them as absent, which was not
quite right. They are reproduced here because §4.6 gave each a refuting number but **no check date**,
which is the half of §9.1 that makes a claim self-refuting rather than merely well-phrased. The plan
remains the source for their wording; this file adds the dates.

All four are gated on Phase 1, which has not started (no payment code exists, per §4.3). Their check
date is therefore a date to review *whether the gate has moved*, not a date to read a conversion rate.

| ID | Claim | Refuted if | Check | Measurable today | Status |
|---|---|---|---|---|---|
| B1 | People will pay for this content at all. | Under 3% of active users buy the one-time unlock within a month of Phase 1. | 2026-10-03 | No — Phase 1 not started | Not yet live |
| B2 | The recurring parts justify a subscription. | Month-2 renewal under 60%, or under 25% of subscribers open the app in a week with no new lesson. | 2026-10-03 | No — Phase 2 not started | Not yet live |
| B3 | Consumer-direct is the right channel. | Twelve months of consumer revenue under $300/month while one institutional conversation reaches a quote. | 2026-10-03 | No | Not yet live |
| B4 | The paywall sits in the right place. | Under 5% of users who reach it start a purchase within a week. | 2026-10-03 | No — no paywall exists | Not yet live |

---

## C. Distribution

| ID | Claim | Refuted if | Check | Measurable today | Status |
|---|---|---|---|---|---|
| C1 | Clips drive installs. (§9.1's own example; §5's acquisition engine.) | 30 posted clips produce under 200 store visits. | 2026-10-03 | No | **Unstarted — 0 clips posted, no store presence, no web deploy.** §8 puts "Web deployed; 10 clips recorded" on the monetization row. |
| C2 | Web is viable top-of-funnel: lessons 1–2 playable with no signup, each lesson a shareable URL (§5). | Under 10% of visitors arriving on a `#/lesson/N` link open a second lesson. | 2026-09-05 | No — needs item 18's analytics and a web deploy | **Build gap closed 2026-08-16 (backlog item 31): every lesson now has a URL and no lesson needs a signup.** The threshold above is now writable because the mechanism exists; it stays unmeasurable until there is a deploy to receive arrivals and a provider to count them. **A second gap this claim now exposes:** a link to a locked lesson cannot open it (sequential unlocking, A1), so a shared clip of lesson 20 lands a new visitor in lesson 1 instead. That tension is real and owner-facing — see `DECISIONS.md`. |

---

## D. Process claims

The claims this project has actually got wrong. They are here because §9.1's discipline applies to how
the work is done, not only to the product — and because all three of the below were refuted by evidence
already sitting in `AGENT_LOG.md`.

| ID | Claim | Refuted if | Check | Measurable today | Status |
|---|---|---|---|---|---|
| D1 | A scheduled run's self-reported verification can be trusted at face value. | Any run's claimed verification is later found false. | 2026-09-05 | **Yes** | **REFUTED — twice.** (1) A run reported §10.1 "closed" when it was roughly half done. (2) Item 33 reported "all 74 correct, 0 remain" on 2026-08-16; the item-36 run the same day found **67 stale references still there**, because the measurement had been taken with the same blind patterns that caused the bug. |
| D2 | A green `npm test` means the content property it checks actually holds. | A check passes while the property it names is violated. | 2026-09-05 | **Yes** | **REFUTED.** §16's ko/ja patterns matched 1 of 44 and 1 of 31 real references; the check reported a clean pass over 67 stale ones. A check that silently matches nothing is indistinguishable from a check that passes. |
| D3 | A backlog item's premise can be trusted well enough to implement without re-measuring. | Any filed item's headline number is corrected on execution. | 2026-09-05 | **Yes** | **REFUTED — nine consecutive times (items 55→63), and three more times since the audit proposed this row: item 72 ("worse than filed"), item 62's F11 ("re-measuring found twice what F11 filed"), and item 73 itself — whose own "D3 is NOT blocked" premise was false.** Five further instances since the row was staged, all of them *after* step 3.5 made re-measurement mandatory: items 75, 78, 79, 82 and 84 (whose filed count was wrong by 80%), plus this row's own landing run, which found blindspot 10.8's refuting number measured against the wrong denominator. Step 3.5 changed *when* the correction happens, not *whether* — item 78's premise broke before it edited anything, which is the whole of the gain. |

**The product changes these three forced, per §9.1's rule — recorded so none is softened later:**

1. The **adversarial self-check** step, now mandatory in the dev-agent task before any commit, with an
   explicit "would an independent reviewer re-running only your commands get your result?" clause.
   Added after D1's first instance.
2. The **§16 coverage tripwire** (`scripts/check-data.mjs`): per-language cross-reference match counts
   printed on every `npm test`, with a warning when a language falls below 20% of English's. Added
   after D2, and verified to fire on the historical blind spot.
3. **This file**, and `scripts/check-claims.mjs`'s past-due warning — the generalization of both. D1
   and D2 are the same failure at different altitudes: a claim checked with an instrument that cannot
   see the failure it is looking for.
4. **Step 3.5 of the dev-agent task — "re-measure the item's premise, with a control, before you
   edit anything"** — added 2026-08-17 by the owner, between "pick the item" and "implement it".
   Added after D3, and numbered 3.5 rather than by renumbering 4–7 because "step 5" means the
   adversarial self-check in dozens of run-log entries. D3 stays **REFUTED** with the step in place,
   and that is the correct reading: the step does not make filed premises true, it moves the
   correction to before the edit, where it is free.

**The standing lesson, stated once so it need not be rediscovered:** *a measurement taken with the
instrument that has the blind spot cannot detect the blind spot.* When a check comes back clean,
the question is not "does it pass?" but "would it fail if the property were violated?" — and the only
honest answer comes from breaking it on purpose.

---

## Claims deliberately not written

Recorded so a later reader does not mistake omission for oversight:

- **Anything about retention past week one.** No mechanism exists to observe it and no plan clause
  depends on it yet. A claim nobody can check for six months is noise in a register whose value is
  that every row is live.
- **App-name / product-fit (§10.7).** `LAUNCH_READINESS.md` marks it open: the plan says money is the
  product, and the app is still called "Economic Cycles." That is a live *owner decision*, not a
  belief awaiting a number, so it stays in the blindspot register rather than becoming a claim here.
