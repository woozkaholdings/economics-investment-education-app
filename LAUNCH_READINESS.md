# Launch Readiness Scorecard

Backlog item 15 (`AGENT_LOG.md`, owner-requested 2026-08-04): one place that tracks the launch plan's
actual gates, so a run's own "done" claim isn't the only record. This file lists what has to be true,
what is actually true right now, and how that was checked — not a narrative, a checklist. Update it
whenever a gate's status changes; don't let it go stale the way `AGENT_LOG.md`'s App summary once did.

**Last refreshed: 2026-08-24 (scheduled dev-agent run, backlog item 93 — the economy phase closes).**
This pass changed **one row's figures and one clause of its narrative**: §10.4 now reads **48 abridged
pairs — es 12, ko 12, zh 12, ja 12 across 12 of 40 lessons**, and the clause that named `ja` 39-40 as
the last main-path gap now records that **both main-path tracks are fully translated in all five
languages** (`money` since 2026-08-22, `economy` as of this date). The remaining 48 pairs are **all**
on the optional `essentials` track, and the abridged set is now **identical in all four languages**.
Also corrected here: the two-instrument note's `ja` ratio pair, which had gone stale two runs earlier
(`0.359 vs 0.361` → **`0.412 vs 0.412`**) — the same one-figure-in-a-third-place defect W-5.5 names.
The generated figures in this file were **not** hand-edited (they are owned by
`scripts/refresh-readiness.mjs`; see "How to refresh this file") and were refreshed with
`npm run readiness -- --write` this date.
Prior refresh 2026-08-23 (scheduled dev-agent run, backlog W-5.6): §10.4's closing clause, which had
framed the five-language surface as "real ongoing maintenance debt … just a cost to keep tracking".
That framing is what backlog item 93 disproved — the shortfall is *absent content*, it is
*concentrated* on the optional track, and it is therefore schedulable rather than perpetual.
Prior refresh 2026-08-16 (scheduled dev-agent run); partial refresh 2026-08-15 (backlog
item 21) updated only the Kids-curriculum row below; the 08-16 pass re-verified and updated the two rows
that had drifted furthest — 10.1 (still describing P-3 as open three days after it closed) and 10.4
(char/ratio figures dated 2026-08-09, three lesson-deepening runs and a lesson-count freeze ago), plus
this header. Every other row was re-checked against current source and left as-is where still accurate.
Original 2026-08-09 refresh note, for history: backlog item P-2, set by the 2026-08-09 weekly review —
the file was four days stale, still reporting 26 lessons against an actual 40, and scoring the §4.3
lesson-count clause "Not met" after it had already cleared.

## Blindspot register (`LAUNCH_PLAN.md` §10)

| # | Item | Status | Evidence |
|---|---|---|---|
| 10.1 | Financial-advice adjacency | ✅ Closed | `npm run check-blindspot` (added 2026-08-05 night, item 16) — re-run 2026-08-16, all 6 checks `ok`, no matches for advice-adjacent phrasing, disclaimer key present in every locale. Disclaimer renders on the first-launch modal (`App.jsx`) plus `Learn.jsx`, `LessonReader.jsx`, `Practice.jsx` (Review tab), and the Reference sub-screens `MarketSignals.jsx`/`Sectors.jsx`/`Settings.jsx`. **P-3 done 2026-08-11**: `check-blindspot.mjs`'s §10.1 check now carries per-language pattern sets for es/ko/zh/ja (5 patterns each, mirroring the English ones) in addition to English — no longer English-only. |
| 10.2 | Dalio dependency | ✅ Closed — **but it was not, from 2026-08-01 to 2026-08-17** | `npm run check-blindspot` — no Dalio references in `src/`, `README.md`, or `economic-cycles-v5.jsx`. **`README.md` was added to that scan on 2026-08-17, and it was carrying the violation the whole time**: its opening sentence read "inspired by the framework popularized by Ray Dalio and other economists." This row said "✅ Closed" for sixteen days on the strength of a check whose scope was `src/` plus the v5 prototype — the two places the rule was already obeyed. Found sideways, by backlog item 49 putting `README.md` under the *path* check (`check-data.mjs` §26) and someone finally reading the file. Removed, and the §10.2 scan now covers README. Kept in this row rather than in the run log because the lesson is about this scorecard: **a green check is evidence about its own scope and nothing else, and "closed" here means "closed everywhere a reader looks."** `LAUNCH_PLAN.md` and this file still name Dalio while *stating* the rule; those are deliberately not scanned. |
| 10.3 | Kids content / COPPA | ⚠️ Closed-but-reopened | Ships parent-facing (`src/screens/reference/ParentGuide.jsx`), which is the standing rule until the owner decides. **Reopened as a question 2026-08-04 — the owner, not a run, must resolve this.** Do not change the framing without that decision. |
| 10.4 | Five languages = maintenance debt | 🟡 Open, tracked (translation coverage), but the owner decision this row used to flag is resolved | es/ko/zh/ja labeled "(Beta)" in the language picker. Volume ratio **re-measured 2026-08-16** over all 40 lessons (unchanged lesson count since 2026-08-09, but content grew from lesson-deepening runs through 2026-08-15), sourced from `content/lessonContent.js`, the node-only merged view of the ten `content/lessonContent.<track>.<lang>.js` files (split per track 2026-08-14 by item 25, per language 2026-08-17 by item 45 — see `DECISIONS.md`): **es 150,082 chars (0.997x of English's 150,493), ko 72,369 (0.481x), zh 45,509 (0.302x), ja 63,779 (0.424x)**, zero missing fields in any language (re-run 2026-08-16 with this file's own documented command, against committed content). Every non-English figure fell by **exactly 19 characters** that day while English stayed identical to the character — that is item 36's stale-cross-reference fixes shortening two-digit lesson references to one digit, not a measurement change or a translation edit. **P-3 (above) and P-4 are both done**: the blindspot check now scans all five languages, and the owner resolved the machine-translation question 2026-08-11 — option (a), accept the current unreviewed state under "(Beta)" labeling, tracked going forward via `scripts/translation-review.mjs`'s ledger. Live coverage: **es 100% (0% human, 0 stale), ko 100% (0% human, 0 stale), zh 100% (0% human, 0 stale), ja 100% (0% human, 0 stale)**. **Back to 100% as of 2026-08-16 (owner-requested re-review).** It had dropped to 93% earlier that day, and the drop was the ledger working rather than a regression: English bodies for lessons 5, 27 and 28 were edited after their reviews (cross-reference fixes, backlog items 33 and 36), so the ledger flagged those 12 pairs stale instead of continuing to count them as covered — the first time drift detection had fired since it was built for P-4. The re-review confirmed the English change in all three lessons was **only** lesson-reference numbers, no prose, and that each translated reference now names the lesson its own surrounding text describes; see this date's run log for the method. `check-data.mjs` §11 now fails the build if this sentence disagrees with the live ledger, so it cannot silently go stale again (this row's figure was three weeks' worth of unnoticed drift when backlog item 37 caught it); run `npm run review-status` for per-lesson detail. See "former item 20" in `AGENT_LOG.md`'s Completed-and-pruned section and `DECISIONS.md` for the full writeup. **Remaining open part of this row — re-framed 2026-08-23 (backlog W-5.6), because the aggregate ratios above cannot be read without a per-language reference and were being read as compactness.** Against nothing, `zh 0.294x` reads as Chinese simply being a denser language. Against **this corpus's own fully-translated lessons in Chinese** it means roughly a sixth of the content is absent. `scripts/translation-completeness.mjs` supplies that reference: each language's **p90 ratio across all 40 lessons — what a full translation actually looks like here** — is **es 1.18, ko 0.55, zh 0.35, ja 0.50**, and a lesson counts as *abridged* below 0.7x its own language's reference. Measured 2026-08-24: **48 abridged pairs — es 12, ko 12, zh 12, ja 12 — across 12 of 40 lessons** (`npm run translation-completeness`). **The shortfall is concentrated, not spread, and that is the whole reason it is schedulable:** **all 48 remaining pairs are on the optional `essentials` track** (lessons 1-11 and 14), and both main-path tracks are now **fully translated in all four languages (0 abridged pairs)** — `money` (16-28) since 2026-08-22 and `economy` (29-40) as of 2026-08-24, when `ja` 39-40 closed the last gap. The abridged set is now **identical in all four languages**, which is what makes the remainder one schedulable block rather than four. So the honest statement of this row is not "ongoing maintenance debt" but: *the main path is fully translated in all five languages, and the optional `essentials` track is about four-fifths absent in every language.* **Note on the two character figures in this row:** the `es 134,697 …` sentence above is generated by `scripts/refresh-readiness.mjs`, which counts section **bodies** plus takeaway/thinkAbout; `translation-completeness.mjs` also counts section **headings**, so it reports a corpus of 140,700 English characters against the 137,249 above. The gap is exactly the headings (3,451 en chars, verified 2026-08-23) and the ratios agree to within 0.4 points either way (es 0.981 vs 0.985, ko 0.469 vs 0.470, zh 0.294 vs 0.295, ja 0.412 vs 0.412) — the two instruments describe the same surface, not two different ones. |
| 10.5 | Solo-founder single point of failure | 🟡 Open | Code is on git. No confirmation yet that data exports / store credentials / 2FA recovery codes are in a password manager — that's outside what a dev-agent run can verify or do. |
| 10.6 | Building instead of distributing | 🟡 Open, ongoing | Pre-launch (no store presence yet), so the "half of weekly hours to distribution" rule doesn't bind yet. Becomes checkable only after web launch. |
| 10.7 | Plan/practice drift | 🟠 **Open — one real instance found and fixed 2026-08-07** | This row previously read "Reconciled well so far," which was **wrong**. `LAUNCH_PLAN.md` §0 was rewritten 2026-08-04 to say the economics content is "the *vehicle*, not the product," but the app kept gating all 14 practical money lessons behind 12 macro-theory lessons, and every string still says "Economic Cycles." The plan changed; the product didn't. Fixed structurally by §2.5's two tracks (owner-directed); **the name is still unreconciled and is an open owner decision.** Lesson: this row was scored from "are the docs current?" — the real test is whether the *app* matches them. Recheck that way at each monthly audit (§9.3). |
| §2.1 | Platform: Expo vs. web-first | 🔒 Held | Owner decision, not started. Blocks store release only, not web launch. |

## Monetization gate — Phase 0 (`LAUNCH_PLAN.md` §4.3)

Phase 0 ("free, instrumented, no payment code") must clear **both**:

| Threshold | Target | Actual | Status |
|---|---|---|---|
| Lesson catalog size | ≥40 lessons / ~2 hours | **44 lessons / 150,493 English chars / 160 min** — split across **money (17)** + **economy (12)** + **essentials (15)** tracks, see `LAUNCH_PLAN.md` §2.5 | ✅ Both §4.3 content clauses **met** — lesson-count (40/40) since 2026-08-09, minutes (**144**/120) since 2026-08-15, when the clause first cleared at 120. The jump from 120 to 144 on 2026-08-17 is not new content: backlog item 56 found the `minutes` model omitted section headings and the whole end-of-lesson check (~20% of the words on screen) and recalibrated all 40 lessons — see `DECISIONS.md`, "How a lesson's `minutes` estimate is computed". Completion-rate clause (item 18) remains unmeasured — see row below. |
| Installer finishes lesson 1 — *structural precondition* | Lesson 1 should be worth finishing | A new install opens into the money track's first lesson (fixed 2026-08-07), not the macro-theory chain | ⚠️ Still unmeasurable (no analytics pipeline), but the structural obstacle is gone |
| Kids curriculum | Part of the product per §0 (kids→adults) | **21 blurbs** (7 per age band x 3 bands), parent-facing, each now with a "why it matters" note — see `LAUNCH_PLAN.md` §2.6 and backlog item 21 | 🟡 Gap narrowed, not closed — each blurb now carries `text` + `why` (2026-08-16, eighth run), a real content-depth step beyond the flat list, but still not lesson-shaped (no headings/sections/quiz per topic); child-facing UI is an owner/COPPA decision (§10.3), unchanged. Growing the blurb *count* further is still not the default next step — see `DECISIONS.md` ("Kids financial-literacy content...") |
| Installer lesson-1 completion | ≥40% | **Unmeasured** — no analytics pipeline exists | ❌ Unmeasurable |

**The two figures in the table above are generated, not typed** — `npm run readiness` prints them,
`npm test` fails if this file disagrees with them, and `npm run readiness -- --write` updates them
(backlog item 47). Everything in the dated paragraph below is history, including its 112,387-char and
100-minute figures; they are what the numbers were on 2026-08-09 and must not be "corrected."

**Since 2026-08-17 the same generator also owns `LAUNCH_PLAN.md`'s catalog figures** (backlog item
55) — eight more, in §1, §2.5's track table, §3.2, §4.0 and §4.3's Phase-0 verdict. It was extended
because the two documents had *disagreed*: this file said both §4.3 content clauses were met while
the plan still said "the gate is not close: 12 minutes is not 2 hours." Ten generated figures now
share one measurement, so that particular contradiction cannot recur.

Verified 2026-08-09 (backlog P-2) by importing `src/content/lessons.js` (id/track/minutes/title/subtitle)
and `src/content/lessonContent.js` (sections/takeaway/thinkAbout) together via bootstrapped Node, summing
`sections[].body.en`+`takeaway.en`+`thinkAbout.en` per lesson and `minutes` from `lessons.js` — **this
corrects the method documented below**, which read `lessons.js` alone and undercounted every lesson's
body text, since item 23 (2026-08-07) split that text out into `lessonContent.js` and left `lessons.js`
holding only metadata; the old method would have reported roughly 4,860 chars across all 40 lessons, not
112,387. (That corrected method is what `scripts/refresh-readiness.mjs` now implements, so the
correction can no longer be lost the way the original was.) The corrected number matches what recent `AGENT_LOG.md` run-log entries have independently
reported (e.g. the twenty-fourth run's "40 lessons / 112,387 English characters / 100 minutes"), so this
isn't a new figure — it's this file catching up to a method the run log had already switched to. Reading
time is the app's own per-lesson `minutes` field, summed directly (100), not derived from a char/wpm
estimate — the char/wpm cross-check this file used through 2026-08-06 is dropped since `minutes` is now
the number the app itself displays to a learner and is what §4.3's "~2 hours" target should be checked
against.

**Per §4.3 verbatim: "the highest-value monetization work right now is writing lessons, not writing
billing code."** No billing/paywall code exists in `src/` — confirmed by `grep -rni "paywall\|stripe\|purchase\|subscri" src/` returning no matches outside comments/content copy that merely *describes* the future plan.

## Instrumentation (`LAUNCH_PLAN.md` §9.2)

| Requirement | Status |
|---|---|
| Analytics call-site abstraction present | 🟡 Built 2026-08-05 — `src/lib/analytics.js` (`track()`/`EVENTS`), not PostHog yet |
| Minimum event set — app opened | ✅ Fires (`App.jsx`, once per load) |
| Minimum event set — lesson started / completed **(with duration)** | ✅ Fires (`LessonReader.jsx`); `lesson_completed` carries `durationSec` since 2026-08-16 (item 29) — §9.2's duration clause, which the event did not satisfy before that date |
| Minimum event set — quiz taken **(with score)** | ✅ Fires once per finished quiz with `{correct, total, scorePct}` since 2026-08-16 (item 29) — `LessonReader.jsx`'s lesson check (at its last answer) and `Practice.jsx`'s review session (at its complete screen), tagged `source`. The per-question signal it used to carry is preserved under `quiz_answered`. Before 2026-08-16 this row read "✅ fires per answered question", which met the event-name half of §9.2 but not its *with score* half |
| Minimum event set — paywall viewed / trial started / subscribed / canceled / ad watched | ❌ Not fired — no paywall/billing/ad feature exists yet to fire them from |
| Real analytics provider (events actually collected off-device) | ❌ None — `track()` writes to a local `localStorage` rolling log only; `grep -rn "posthog" src/ package.json` returns zero matches. See `DECISIONS.md`. |

This is backlog item 18 in `AGENT_LOG.md`. The call-site plumbing for every event the app can
currently produce is done; **still open** is swapping the local sink for a real provider (needs an
account/API key a dev-agent run can't create) — until that lands, the installer-completion half of
the Phase 0 gate above stays unmeasurable off-device, though it is now inspectable per-device via
`localStorage.getItem("ecycles_analytics_log")`.

<!-- path-ok: economic-cycles-v5.jsx — the owner's local prototype original, GITIGNORED by the 2026-08-16 decision recorded in .gitignore ("ignored, not deleted") — it is on the owner's disk and in git history, and no clone of this repo has it, so this reference must never resolve; restoring the file to the repo would be undoing that decision, not fixing this marker -->
<!-- path-ok: SKILL.md — the dev-agent's scheduled-task definition, which lives outside this repo at ~/.claude/scheduled-tasks/economics-app-dev-agent/SKILL.md and is not a repo file -->

## Process items tracking this scorecard itself

| Item | Status |
|---|---|
| 15 — this scorecard | ✅ Built 2026-08-05 |
| 16 — tighten builder/critic feedback loop | 🟡 Partially built (2026-08-05 night) — the mechanical half is automated: `scripts/check-blindspot.mjs` (`npm run check-blindspot`, also chained into `npm test`) codifies the §10.1/10.2/10.3/§2.3 grep checks every run used to retype by hand. The judgment half — does new prose *read* like advice, does a framing change need the owner — still needs a human or an agent reading the actual diff; the dev-agent `SKILL.md`'s mandatory adversarial self-check covers that part. |

## How to refresh this file

- Blindspot grep checks: `npm run check-blindspot` from the repo root (or `npm test`, which chains it
  after the data-shape checks). Runs the §10.1/10.2/10.3/§2.3 checks quoted above in one command instead
  of retyping four separate greps — see `scripts/check-blindspot.mjs`'s header comment for what it does
  and, importantly, what it doesn't (judgment calls still need a human/agent reading the diff).
- Lesson catalog size and translation volume ratio (10.4) — **you do not refresh these by hand, and
  as of 2026-08-17 (backlog item 47) you cannot let them go stale.** Both figures are generated by
  `scripts/refresh-readiness.mjs`, which `npm test` runs in `--check` mode: if the §4.3 catalog row
  or §10.4's `es … ko … zh … ja …` character sentence disagrees with the live content, the build
  fails and names the replacement string. **As of 2026-08-17 the same command also owns nine figures
  in `LAUNCH_PLAN.md`** (§1's asset sentence, §2.5's three track-id ranges, §3.2's progress figure,
  §4.0's volume/word-count/asset-table figures, and §4.3's Phase-0 gate verdict — backlog item 55, the
  third track-id range added by item 77 on 2026-08-19), so
  `--write` may touch either document. To see the numbers, or to update the documents after a content
  change:
  ```bash
  npm run readiness            # print them
  npm run readiness -- --write # put them into both documents
  ```
  The script imports `content/lessons.js` (id/track/icon/color/minutes/title/subtitle),
  `content/quizData.js` and `content/glossary.js` (question and term counts, for §1), and
  `content/lessonContent.js`, the node-only merged view of the ten
  `content/lessonContent.<track>.<lang>.js` files — the one source that can see every language at
  once, which is what a volume measurement needs. Reading time is the app's own per-lesson `minutes`
  field summed directly, not a char/wpm estimate.
  **Why this stopped being a snippet:** these two bullets used to inline the `node -e '…'` commands,
  and that copy of code went stale twice, both times naming a file that no longer existed — the
  single pre-2026-08-14 file for three days after item 25 split content per track, and the two
  per-track files for the hours between item 45's per-language split and its correction. Both times
  the commands would have thrown `ERR_MODULE_NOT_FOUND` while the numbers printed beside them stayed
  correct: the figure was right and the *method* had rotted. A script that runs on every `npm test`
  cannot name a missing file, and a derived figure cannot disagree with its source. See backlog items
  39 (the scoping) and 47 in `AGENT_LOG.md`.
- Instrumentation: `grep -rn "track(EVENTS\." src/` for call sites (expect App/LessonReader/Practice);
  `grep -rn "posthog" src/ package.json` for whether a real provider has been wired in yet (expect no
  matches until that happens).
- Installer completion / paywall conversion: not checkable until §9.2 ships — leave marked
  "Unmeasured," don't estimate.
- Do not mark a gate closed here without the same command a skeptical reviewer would run producing the
  same result — that's the whole point of a scorecard existing.
