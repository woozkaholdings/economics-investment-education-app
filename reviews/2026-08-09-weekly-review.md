# Weekly Review — 2026-08-09

Reviewer: scheduled weekly reviewer (quality control, not a dev run).
Period: 2026-08-02 → 2026-08-09. Head at review time: `972a966`.
Prior review: `reviews/2026-08-02-weekly-review-2.md`.

**Grade for the week: B.** Execution quality is high and rising. Direction is the problem.

---

## 1. What shipped

80 commits. Roughly four distinct efforts:

**The rebuild (2026-08-04, owner-directed).** The app was authored from scratch onto
`src/App.jsx` + `src/screens/*` + `src/lib/*`, superseding the `economic-cycles-v5.jsx` +
per-tab-component structure the previous two weekly reviews were assessing. `LAUNCH_PLAN.md`
was corrected in the same session and is now authoritative over the `.docx`. Everything in
last week's review that referenced `Home.jsx`/`Markets.jsx`/`More.jsx` is now historical.

**Infrastructure and instrumentation.**
- Sector performance + relative strength via a daily offline job (`scripts/fetch-market-data.mjs`
  → `public/data/market.json`), with the owner's own `WJ_Sector_Comparison` formula landing
  `provisional: false`; six FRED macro readings surfaced in Reference.
- §9.2 analytics event set wired (`src/lib/analytics.js`) — call sites done, real provider still
  blocked on an owner-created account.
- `scripts/check-blindspot.mjs` added and chained into `npm test`, codifying the six grep-shaped
  blindspot regressions every run had been retyping by hand.
- `LAUNCH_READINESS.md` scorecard added.
- Vite bumped to ^6.4.3 (0 audit findings); code-splitting via `React.lazy`; `content/lessons.js`
  split into metadata + `content/lessonContent.js`, cutting the main chunk 522 kB → 207 kB.

**Content — the bulk of the week.** The catalogue went from 17 to **40 lessons**. Lessons 18–27
were mechanics (retirement accounts, taxes, insurance, inflation, W-2/1099, fees, renting vs.
buying, brokerage mechanics, estate planning, credit reports). The owner intervened on 08-07 to
say the money track was teaching mechanics rather than judgment, and lessons 28–40 are the
correction: asset-vs-liability as a decision lens, lifestyle inflation, opportunity cost, sunk
cost, FOMO/herd behavior, anchoring, confirmation bias, present bias, needs-vs-wants, time
horizon, mental accounting, loss aversion, overconfidence after a lucky outcome. The catalogue
was also split into two tracks (Your Money 28 / How the Economy Works 12), money-first.

**Housekeeping.** Straight-vs-curly quote normalization across Chinese content; a wrong lesson
cross-reference fixed; three market-data refresh commits (from the separate
`economics-app-market-data` task).

## 2. Health

| Check | Result |
|---|---|
| `npm test` (`check-data.mjs`) | **PASS** — 0 failures, 0 warnings |
| `npm test` (`check-blindspot.mjs`) | **PASS** — all 6 checks ok |
| `npm run build` | **PASS** — vite 6.4.3, 63 modules, 909ms, with one advisory (below) |
| 5-language field parity across 40 lessons | **0 missing fields** |
| Quiz coverage | 42 questions, **every lesson has ≥1** |
| Quiz answer-key spread | `{0:10, 1:11, 2:11, 3:10}`, max share **26.2%** — the 08-02 fix held across 29 new questions |
| Uncommitted changes | `economic-cycles-v6.jsx` (untracked, long-documented reference file) — **not touched** |

Build advisory: the lazy `LessonReader` chunk is **513.09 kB (gzip 217.53 kB)**, over Vite's
500 kB threshold. Logged as new backlog item 25. Not a regression of the item-23 fix — the entry
chunk is 221.91 kB and `LessonReader` remains lazy — but it grows with every lesson.

**Log-vs-commit cross-check: clean.** Every run-log entry has a matching commit and every
feature commit has a matching entry. The three `Refresh market data` commits have no run-log
entries, which is correct — they come from a different scheduled task. Spot-checking the
twenty-fourth run's entry against reality, its catalogue measurement (40 / 112,387 / 100 min)
and its chunk-size figure both reproduce exactly. **The run log is trustworthy.** That is worth
saying plainly, because most of this review's criticism is about direction, not honesty.

## 3. Quality assessment

**Content quality is genuinely good.** I read lessons 39 and 40 in full. They open with a
concrete scenario before naming the concept, distinguish the new concept from its nearest
neighbors *inside the lesson body* rather than only in the log, and close on a question rather
than a directive. Lesson 40's claim about post-gain overtrading correlating with lower average
returns is the well-established retail-brokerage finding and is stated with appropriate hedging.
This is the "wise rather than impulsive" product the owner described.

**Neutrality and §10.1: clean.** Automated checks pass; my own independent grep for advice-shaped
phrasing across `lessonContent.js` returned only properly-hedged descriptive passages. The
judgment lessons take the mental models of the genre the owner named and leave its prescriptions,
exactly as item 24 instructs. **No personalized financial advice and no buy/sell recommendations
found anywhere.**

**Per-run rigor is high and improving.** Runs now do live-DOM verification via the
static-build-plus-python-server technique, deliberately click a wrong quiz answer before the
right one to prove the key isn't always reporting success, and run a four-point adversarial
self-check. The twenty-fourth run flagged its own chunk-size finding unprompted rather than
letting a clean build speak for it. This is better self-verification than most human teams do.

### Concern 1 — the lesson treadmill re-formed inside its own correction (primary)

Twenty-two of the last twenty-four runs were single-lesson adds; thirteen consecutively.

Item 17 *already contains* the diagnosis: "nine consecutive scheduled runs each picked 'add one
lesson' and optimised the count, and the *direction* drifted unexamined until the owner corrected
it. Counting lessons is not the same as building the product." The owner corrected it on 08-07.
The runs then switched from mechanics lessons to judgment lessons — **and kept counting.**

Item 24's own text records the loop closing: four consecutive entries each note that "a future
run should re-scope this item rather than keep extending the list ad hoc," and each then extends
the list ad hoc. The item has become a perpetual lesson-generator that supplies its own next
topic.

The sharpest version: §4.3's Phase-0 gate has three clauses. Lesson count (≥40) is now met.
Content duration (~2 hours) sits at 100/120 minutes. Lesson-1 completion (≥40%) is **not
measurable at all** — blocked four days on item 18's analytics provider. The week moved the one
clause that was closest to satisfied and left the two that actually gate Phase 0 untouched. Forty
lessons have now been written with **zero signal from a single real user.**

Response: items 17 and 24 are **frozen**, with a PRIORITY BLOCK at the top of the backlog
explaining why. This is a stop, not a slowdown.

### Concern 2 — the no-machine-translation decision was reversed in practice

This is the finding I'd most want the owner to see.

On 2026-08-05, backlog item 20 recorded a firm decision: three consecutive runs had independently
declined to machine-translate lesson content, all citing the same risk — unreviewed LLM
translation of financial-education prose into a language `check-blindspot.mjs` doesn't scan,
risking inaccuracy and inadvertently reintroducing advice-adjacent framing. The conclusion was
that this "genuinely needs a human/professional translator or explicit owner sign-off."

That exposure was then created anyway, by thirteen lesson-add runs each translating its own new
lesson. No run re-raised the decision. Re-measured today over all 40 lessons:

| | 2026-08-05 (as item 20 recorded) | 2026-08-09 (measured) |
|---|---|---|
| es | 0.37x | **0.745x** |
| ko | 0.19x | **0.371x** |
| zh | 0.12x | **0.235x** |
| ja | 0.15x | **0.325x** |

Item 20's headline — "translations now lag English by more than before" — was **factually
inverted**. Every ratio roughly doubled. Left uncorrected it would have sent the owner to
commission review of "34 rewritten sections" when the real scope is ~168,000 characters across
four languages.

Each individual run was defensible; translating a new lesson at authoring time is not the same
act as a bulk retro-translation. The aggregate is precisely what the decision was written to
prevent. This is a process failure, not a content failure — a standing decision was neutralized
by per-run habit, and the entry recording it was read past for four days while its own numbers
went stale in the opposite direction.

Item 20 has been rewritten with the corrected numbers and three concrete owner options.

### Concern 3 — `LAUNCH_READINESS.md` is four days stale

It reports **26 lessons / 66,289 chars / ~60 min** and scores the §4.3 lesson-count clause as
"❌ Not met — 65% of target." Reality is **40 / 112,387 / 100 min** and that clause is now met.
Its §10.4 translation-ratio row is stale the same way.

Two consecutive run-log entries flagged this file as stale; neither fixed it, each deferring to
"a future run." This is the one artifact whose entire purpose is to be the single true statement
of launch status. A scorecard nobody refreshes is worse than no scorecard, because it gets
trusted. Now P-2.

### Concern 4 — `check-blindspot.mjs` only scans English

All five §10.1 advice-adjacency regexes (`best investments:`, `be bullish`, `be cautious`,
`you should (buy|sell|invest)`, `we recommend`) are English-only. Non-English text is now ~60% of
total content volume and is scanned by nothing but the language-agnostic Dalio check. A Spanish
"deberías comprar" passes `npm test` silently today.

The sting: item 20 has cited "a language `check-blindspot.mjs` doesn't scan for" as a *reason to
decline work* three times, without anyone closing the gap that reasoning points at. Now P-3, and
it is a well-scoped single-run task.

### Not concerns

- **No low-value churn.** Every commit this week did real work.
- **No regressions.** The quiz answer-key invariant fixed on 08-02 held across 29 new questions —
  the header comment written at the time is doing its job.
- **No drift into unwanted territory.** §10.3 (kids/COPPA) stayed parent-facing and HELD; §10.2
  (Dalio) stayed closed; `economic-cycles-v6.jsx` was correctly left alone by every run.

## 4. Plan for next week

Set as a PRIORITY BLOCK at the top of `AGENT_LOG.md`'s backlog:

1. **P-1 — STOP ADDING LESSONS.** Items 17 and 24 frozen until P-2/P-3/P-4 clear.
2. **P-2 — Refresh `LAUNCH_READINESS.md`.** Every row, using the commands it documents, with a
   measurement date.
3. **P-3 — Extend `check-blindspot.mjs`'s §10.1 patterns to es/ko/zh/ja.** Verify each by
   injecting a violation, confirming failure, reverting.
4. **P-4 — Escalate item 20 to the owner.** Decision, not a dev-agent fix.
5. **New item 25** — the 513 kB `LessonReader` chunk: split per track, or raise the limit as a
   documented `DECISIONS.md` entry. Pick consciously.

After those clear, content work resumes aimed at a clause that actually gates Phase 0 — the ~20
remaining minutes, or depth in existing lessons — not a forty-first topic. Each run should state
in its log entry *which §4.3 clause* it moves.

### For the owner — three things only you can unblock

1. **Item 20 / P-4 — translation.** Accept the current unreviewed state under "(Beta)", commission
   native-speaker review (~168k chars, four languages), or cut the four languages from Phase 0.
   Option (a) is what happens by default if nothing is decided.
2. **Item 18 — the analytics provider.** A PostHog account and key. Until this exists, §4.3's
   ≥40%-lesson-1-completion clause is unmeasurable, Phase 0 cannot end on evidence, and the app
   keeps accumulating content with no user signal. **This is now the single highest-leverage thing
   in the project**, and it has been blocked for four days.
3. **The app name (§10.7).** Everything still says "Economic Cycles" while the plan says the
   economics content is "the vehicle, not the product" and 28 of 40 lessons are personal finance.
   Runs are correctly refusing to invent a name.

Items 12 (Expo vs. Vite) and 19 (child-facing kids content) remain HELD and untouched, correctly.
