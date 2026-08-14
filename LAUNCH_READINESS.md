# Launch Readiness Scorecard

Backlog item 15 (`AGENT_LOG.md`, owner-requested 2026-08-04): one place that tracks the launch plan's
actual gates, so a run's own "done" claim isn't the only record. This file lists what has to be true,
what is actually true right now, and how that was checked — not a narrative, a checklist. Update it
whenever a gate's status changes; don't let it go stale the way `AGENT_LOG.md`'s App summary once did.

**Last refreshed: 2026-08-09 (backlog item P-2, set by the 2026-08-09 weekly review — this file was
four days stale, still reporting 26 lessons against an actual 40, and scoring the §4.3 lesson-count
clause "Not met" after it had already cleared).**

## Blindspot register (`LAUNCH_PLAN.md` §10)

| # | Item | Status | Evidence |
|---|---|---|---|
| 10.1 | Financial-advice adjacency | ✅ Closed | `npm run check-blindspot` (added 2026-08-05 night, item 16) — re-run 2026-08-09, all 6 checks `ok`, no matches for advice-adjacent phrasing, disclaimer key present in every locale. Disclaimer renders on the first-launch modal (`App.jsx`) plus `Learn.jsx`, `LessonReader.jsx`, `Practice.jsx` (Review tab), and the Reference sub-screens `MarketSignals.jsx`/`Sectors.jsx`/`Settings.jsx` — screen names updated 2026-08-09 to match the current Learn/Review/Reference tab structure (the "Home, Markets, About" wording was from before the 2026-08-04 rebuild). **English-only**: the five regex patterns in `check-blindspot.mjs` don't scan es/ko/zh/ja, which is now ~60% of content volume by character count — tracked as backlog **P-3**. |
| 10.2 | Dalio dependency | ✅ Closed | `npm run check-blindspot` — no Dalio references in `src/` or `economic-cycles-v5.jsx`. |
| 10.3 | Kids content / COPPA | ⚠️ Closed-but-reopened | Ships parent-facing (`src/screens/reference/ParentGuide.jsx`), which is the standing rule until the owner decides. **Reopened as a question 2026-08-04 — the owner, not a run, must resolve this.** Do not change the framing without that decision. |
| 10.4 | Five languages = maintenance debt | 🟡 Open, tracked | es/ko/zh/ja labelled "(Beta)" in the language picker. Volume ratio **re-measured 2026-08-09** over all 40 lessons, sourced from `content/lessonContent.js` (`sections[].body`+`takeaway`+`thinkAbout`) — the previous 2026-08-06 measurement read `content/lessons.js` alone, which stopped holding lesson body text once item 23 split it out into `lessonContent.js` on 2026-08-07, so that figure had been silently wrong for three days: **es 83,758 chars (0.745x of English's 112,387), ko 41,727 (0.371x), zh 26,397 (0.235x), ja 36,551 (0.325x)**, zero missing fields in any language. Every ratio roughly doubled since 2026-08-06 because lessons 27-40 were each authored with full parallel translations. This is a bigger exposure, not a smaller one — see item 20 in `AGENT_LOG.md` and **P-4** (owner decision needed: the "no bulk machine translation" call from 2026-08-05 was reversed in practice, one lesson at a time, in a language `check-blindspot.mjs` doesn't scan). |
| 10.5 | Solo-founder single point of failure | 🟡 Open | Code is on git. No confirmation yet that data exports / store credentials / 2FA recovery codes are in a password manager — that's outside what a dev-agent run can verify or do. |
| 10.6 | Building instead of distributing | 🟡 Open, ongoing | Pre-launch (no store presence yet), so the "half of weekly hours to distribution" rule doesn't bind yet. Becomes checkable only after web launch. |
| 10.7 | Plan/practice drift | 🟠 **Open — one real instance found and fixed 2026-08-07** | This row previously read "Reconciled well so far," which was **wrong**. `LAUNCH_PLAN.md` §0 was rewritten 2026-08-04 to say the economics content is "the *vehicle*, not the product," but the app kept gating all 14 practical money lessons behind 12 macro-theory lessons, and every string still says "Economic Cycles." The plan changed; the product didn't. Fixed structurally by §2.5's two tracks (owner-directed); **the name is still unreconciled and is an open owner decision.** Lesson: this row was scored from "are the docs current?" — the real test is whether the *app* matches them. Recheck that way at each monthly audit (§9.3). |
| §2.1 | Platform: Expo vs. web-first | 🔒 Held | Owner decision, not started. Blocks store release only, not web launch. |

## Monetization gate — Phase 0 (`LAUNCH_PLAN.md` §4.3)

Phase 0 ("free, instrumented, no payment code") must clear **both**:

| Threshold | Target | Actual | Status |
|---|---|---|---|
| Lesson catalogue size | ≥40 lessons / ~2 hours | **40 lessons / 126,159 English chars / 111 min** — split across **money (28)** + **economy (12)** tracks, see `LAUNCH_PLAN.md` §2.5 | 🟡 Lesson-count clause **met** (40/40) since lesson 40 (2026-08-09); char/time clause not met — 111/120 min, ~93% |
| Installer finishes lesson 1 — *structural precondition* | Lesson 1 should be worth finishing | A new install opens into the money track's first lesson (fixed 2026-08-07), not the macro-theory chain | ⚠️ Still unmeasurable (no analytics pipeline), but the structural obstacle is gone |
| Kids curriculum | Part of the product per §0 (kids→adults) | **15 blurbs** (5 per age band x 3 bands), parent-facing, up from 9 as of 2026-08-07 — see `LAUNCH_PLAN.md` §2.6 and backlog item 21 | ❌ Gap — still 3 fields/band (`lessons`/`activity`/`parentTip`), not lesson-shaped; expanding it parent-facing is safe work, making it child-facing is an owner/COPPA decision (§10.3) |
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
| Minimum event set — lesson started / completed | ✅ Fires (`LessonReader.jsx`) |
| Minimum event set — quiz taken | ✅ Fires per answered question (`LessonReader.jsx` lesson-check + `Practice.jsx` review queue), tagged `source` |
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
- Lesson catalogue size — **as of 2026-08-07 (item 23), lesson body text lives in
  `content/lessonContent.js`, not `content/lessons.js`** (which now holds only id/track/icon/color/
  minutes/title/subtitle). Read both:
  ```bash
  BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
  node -e '
  Promise.all([import("./src/content/lessons.js"), import("./src/content/lessonContent.js")]).then(([{lessons}, {lessonContent}]) => {
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
- Translation volume ratio (10.4) — same `lessonContent.js` source:
  ```bash
  BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
  node -e '
  Promise.all([import("./src/content/lessons.js"), import("./src/content/lessonContent.js")]).then(([{lessons}, {lessonContent}]) => {
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
