# Launch Readiness Scorecard

Backlog item 15 (`AGENT_LOG.md`, owner-requested 2026-08-04): one place that tracks the launch plan's
actual gates, so a run's own "done" claim isn't the only record. This file lists what has to be true,
what is actually true right now, and how that was checked — not a narrative, a checklist. Update it
whenever a gate's status changes; don't let it go stale the way `AGENT_LOG.md`'s App summary once did.

**Last refreshed: 2026-08-16 (scheduled dev-agent run).** Prior partial refresh 2026-08-15 (backlog
item 21) updated only the Kids-curriculum row below; this pass re-verified and updated the two rows
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
| 10.2 | Dalio dependency | ✅ Closed | `npm run check-blindspot` — no Dalio references in `src/` or `economic-cycles-v5.jsx`. |
| 10.3 | Kids content / COPPA | ⚠️ Closed-but-reopened | Ships parent-facing (`src/screens/reference/ParentGuide.jsx`), which is the standing rule until the owner decides. **Reopened as a question 2026-08-04 — the owner, not a run, must resolve this.** Do not change the framing without that decision. |
| 10.4 | Five languages = maintenance debt | 🟡 Open, tracked (translation coverage), but the owner decision this row used to flag is resolved | es/ko/zh/ja labelled "(Beta)" in the language picker. Volume ratio **re-measured 2026-08-16** over all 40 lessons (unchanged lesson count since 2026-08-09, but content grew from lesson-deepening runs through 2026-08-15), sourced from `content/lessonContent.economy.js`+`content/lessonContent.money.js` (split from the single `lessonContent.js` on 2026-08-14, item 25's real fix — see `DECISIONS.md`): **es 97,994 chars (0.720x of English's 136,031), ko 48,469 (0.356x), zh 30,733 (0.226x), ja 42,555 (0.313x)**, zero missing fields in any language (re-run 2026-08-16 with this file's own documented command, against committed content). Every non-English figure fell by **exactly 19 characters** that day while English stayed identical to the character — that is item 36's stale-cross-reference fixes shortening two-digit lesson references to one digit, not a measurement change or a translation edit. **P-3 (above) and P-4 are both done**: the blindspot check now scans all five languages, and the owner resolved the machine-translation question 2026-08-11 — option (a), accept the current unreviewed state under "(Beta)" labelling, tracked going forward via `scripts/translation-review.mjs`'s ledger. Live coverage: **es 100% (0% human, 0 stale), ko 100% (0% human, 0 stale), zh 100% (0% human, 0 stale), ja 100% (0% human, 0 stale)**. **Back to 100% as of 2026-08-16 (owner-requested re-review).** It had dropped to 93% earlier that day, and the drop was the ledger working rather than a regression: English bodies for lessons 5, 27 and 28 were edited after their reviews (cross-reference fixes, backlog items 33 and 36), so the ledger flagged those 12 pairs stale instead of continuing to count them as covered — the first time drift detection had fired since it was built for P-4. The re-review confirmed the English change in all three lessons was **only** lesson-reference numbers, no prose, and that each translated reference now names the lesson its own surrounding text describes; see this date's run log for the method. `check-data.mjs` §11 now fails the build if this sentence disagrees with the live ledger, so it cannot silently go stale again (this row's figure was three weeks' worth of unnoticed drift when backlog item 37 caught it); run `npm run review-status` for per-lesson detail. See "former item 20" in `AGENT_LOG.md`'s Completed-and-pruned section and `DECISIONS.md` for the full writeup. Remaining open part of this row: the five-language surface is still real ongoing maintenance debt (a sixth lesson deepening, translated four ways, keeps outpacing this file's own last-measured snapshot) — not a decision left to make, just a cost to keep tracking. |
| 10.5 | Solo-founder single point of failure | 🟡 Open | Code is on git. No confirmation yet that data exports / store credentials / 2FA recovery codes are in a password manager — that's outside what a dev-agent run can verify or do. |
| 10.6 | Building instead of distributing | 🟡 Open, ongoing | Pre-launch (no store presence yet), so the "half of weekly hours to distribution" rule doesn't bind yet. Becomes checkable only after web launch. |
| 10.7 | Plan/practice drift | 🟠 **Open — one real instance found and fixed 2026-08-07** | This row previously read "Reconciled well so far," which was **wrong**. `LAUNCH_PLAN.md` §0 was rewritten 2026-08-04 to say the economics content is "the *vehicle*, not the product," but the app kept gating all 14 practical money lessons behind 12 macro-theory lessons, and every string still says "Economic Cycles." The plan changed; the product didn't. Fixed structurally by §2.5's two tracks (owner-directed); **the name is still unreconciled and is an open owner decision.** Lesson: this row was scored from "are the docs current?" — the real test is whether the *app* matches them. Recheck that way at each monthly audit (§9.3). |
| §2.1 | Platform: Expo vs. web-first | 🔒 Held | Owner decision, not started. Blocks store release only, not web launch. |

## Monetization gate — Phase 0 (`LAUNCH_PLAN.md` §4.3)

Phase 0 ("free, instrumented, no payment code") must clear **both**:

| Threshold | Target | Actual | Status |
|---|---|---|---|
| Lesson catalogue size | ≥40 lessons / ~2 hours | **40 lessons / 136,031 English chars / 120 min** — split across **money (28)** + **economy (12)** tracks, see `LAUNCH_PLAN.md` §2.5 | ✅ Both §4.3 content clauses **met** — lesson-count (40/40) since 2026-08-09, minutes (120/120) since 2026-08-15 (lesson 36's term-premium section). Completion-rate clause (item 18) remains unmeasured — see row below. |
| Installer finishes lesson 1 — *structural precondition* | Lesson 1 should be worth finishing | A new install opens into the money track's first lesson (fixed 2026-08-07), not the macro-theory chain | ⚠️ Still unmeasurable (no analytics pipeline), but the structural obstacle is gone |
| Kids curriculum | Part of the product per §0 (kids→adults) | **21 blurbs** (7 per age band x 3 bands), parent-facing, each now with a "why it matters" note — see `LAUNCH_PLAN.md` §2.6 and backlog item 21 | 🟡 Gap narrowed, not closed — each blurb now carries `text` + `why` (2026-08-16, eighth run), a real content-depth step beyond the flat list, but still not lesson-shaped (no headings/sections/quiz per topic); child-facing UI is an owner/COPPA decision (§10.3), unchanged. Growing the blurb *count* further is still not the default next step — see `DECISIONS.md` ("Kids financial-literacy content...") |
| Installer lesson-1 completion | ≥40% | **Unmeasured** — no analytics pipeline exists | ❌ Unmeasurable |

Verified 2026-08-09 (backlog P-2) by importing `src/content/lessons.js` (id/track/minutes/title/subtitle)
and `src/content/lessonContent.js` (sections/takeaway/thinkAbout) together via bootstrapped Node, summing
`sections[].body.en`+`takeaway.en`+`thinkAbout.en` per lesson and `minutes` from `lessons.js` — **this
corrects the method documented below**, which read `lessons.js` alone and undercounted every lesson's
body text, since item 23 (2026-08-07) split that text out into `lessonContent.js` and left `lessons.js`
holding only metadata; the old method would have reported roughly 4,860 chars across all 40 lessons, not
112,387. The corrected number matches what recent `AGENT_LOG.md` run-log entries have independently
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
| Minimum event set — paywall viewed / trial started / subscribed / cancelled / ad watched | ❌ Not fired — no paywall/billing/ad feature exists yet to fire them from |
| Real analytics provider (events actually collected off-device) | ❌ None — `track()` writes to a local `localStorage` rolling log only; `grep -rn "posthog" src/ package.json` returns zero matches. See `DECISIONS.md`. |

This is backlog item 18 in `AGENT_LOG.md`. The call-site plumbing for every event the app can
currently produce is done; **still open** is swapping the local sink for a real provider (needs an
account/API key a dev-agent run can't create) — until that lands, the installer-completion half of
the Phase 0 gate above stays unmeasurable off-device, though it is now inspectable per-device via
`localStorage.getItem("ecycles_analytics_log")`.

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
- Lesson catalogue size — **as of 2026-08-14 (item 25's real fix), lesson body text lives in
  `content/lessonContent.economy.js` + `content/lessonContent.money.js`, not one `lessonContent.js`**
  (this section named the single-file path until 2026-08-16, three days after the split — the commands
  below would have thrown an import error, not just returned a stale number; run them, don't trust the
  text). `content/lessons.js` still holds only id/track/icon/color/minutes/title/subtitle. Read all three:
  ```bash
  BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
  node -e '
  Promise.all([import("./src/content/lessons.js"), import("./src/content/lessonContent.economy.js"), import("./src/content/lessonContent.money.js")]).then(([{lessons}, econ, money]) => {
    const lessonContent = {...econ.lessonContent, ...money.lessonContent};
    let chars = 0, minutes = 0;
    for (const l of lessons) {
      minutes += l.minutes || 0;
      const c = lessonContent[l.id];
      chars += (c?.takeaway?.en||"").length + (c?.thinkAbout?.en||"").length;
      for (const s of c?.sections||[]) chars += (s.body?.en||"").length;
    }
    console.log(lessons.length, "lessons,", chars, "en chars,", minutes, "minutes");
  });'
  ```
- Translation volume ratio (10.4) — same split-file source:
  ```bash
  BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
  node -e '
  Promise.all([import("./src/content/lessons.js"), import("./src/content/lessonContent.economy.js"), import("./src/content/lessonContent.money.js")]).then(([{lessons}, econ, money]) => {
    const lessonContent = {...econ.lessonContent, ...money.lessonContent};
    const langs = ["en","es","ko","zh","ja"];
    const t = Object.fromEntries(langs.map(l => [l, 0]));
    for (const l of lessons) {
      const c = lessonContent[l.id];
      for (const lang of langs) {
        t[lang] += (c?.takeaway?.[lang]||"").length + (c?.thinkAbout?.[lang]||"").length;
        for (const s of c?.sections||[]) t[lang] += (s.body?.[lang]||"").length;
      }
    }
    console.log(t);
  });'
  ```
- Instrumentation: `grep -rn "track(EVENTS\." src/` for call sites (expect App/LessonReader/Practice);
  `grep -rn "posthog" src/ package.json` for whether a real provider has been wired in yet (expect no
  matches until that happens).
- Installer completion / paywall conversion: not checkable until §9.2 ships — leave marked
  "Unmeasured," don't estimate.
- Do not mark a gate closed here without the same command a skeptical reviewer would run producing the
  same result — that's the whole point of a scorecard existing.
