# Launch Readiness Scorecard

Backlog item 15 (`AGENT_LOG.md`, owner-requested 2026-08-04): one place that tracks the launch plan's
actual gates, so a run's own "done" claim isn't the only record. This file lists what has to be true,
what is actually true right now, and how that was checked — not a narrative, a checklist. Update it
whenever a gate's status changes; don't let it go stale the way `AGENT_LOG.md`'s App summary once did.

**Last refreshed: 2026-08-05 (night, second run — blindspot-check automation, item 16).**

## Blindspot register (`LAUNCH_PLAN.md` §10)

| # | Item | Status | Evidence |
|---|---|---|---|
| 10.1 | Financial-advice adjacency | ✅ Closed | `npm run check-blindspot` (added 2026-08-05 night, item 16) — no matches for advice-adjacent phrasing, disclaimer key present in every locale. Disclaimer renders on Home, Learn, Markets, About, first-launch modal. |
| 10.2 | Dalio dependency | ✅ Closed | `npm run check-blindspot` — no Dalio references in `src/` or `economic-cycles-v5.jsx`. |
| 10.3 | Kids content / COPPA | ⚠️ Closed-but-reopened | Ships parent-facing (`src/screens/reference/ParentGuide.jsx`), which is the standing rule until the owner decides. **Reopened as a question 2026-08-04 — the owner, not a run, must resolve this.** Do not change the framing without that decision. |
| 10.4 | Five languages = maintenance debt | 🟡 Open, tracked | es/ko/zh/ja labelled "(Beta)" in the language picker. Volume ratio **re-measured 2026-08-05** after the same day's example-rewrite grew English ~1.7x: es 13,926 chars (0.37x of English, was 0.41x), ko 7,369 (0.19x, was 0.24x), ja 5,901 (0.15x, was 0.18x), zh 4,662 (0.12x, was 0.15x) — all four ratios narrowed as expected, since only the `en` field was expanded and translations weren't touched. See item 20 in `AGENT_LOG.md`. |
| 10.5 | Solo-founder single point of failure | 🟡 Open | Code is on git. No confirmation yet that data exports / store credentials / 2FA recovery codes are in a password manager — that's outside what a dev-agent run can verify or do. |
| 10.6 | Building instead of distributing | 🟡 Open, ongoing | Pre-launch (no store presence yet), so the "half of weekly hours to distribution" rule doesn't bind yet. Becomes checkable only after web launch. |
| 10.7 | Plan/practice drift | 🟡 Open, ongoing | Reconciled well so far — `AGENT_LOG.md`'s App summary and `DECISIONS.md` are both current as of the 2026-08-04 rebuild. Recheck at each monthly audit (§9.3). |
| §2.1 | Platform: Expo vs. web-first | 🔒 Held | Owner decision, not started. Blocks store release only, not web launch. |

## Monetization gate — Phase 0 (`LAUNCH_PLAN.md` §4.3)

Phase 0 ("free, instrumented, no payment code") must clear **both**:

| Threshold | Target | Actual | Status |
|---|---|---|---|
| Lesson catalogue size | ≥40 lessons / ~2 hours | **17 lessons / 38,146 English chars / ~33–35 min** | ❌ Not met — roughly 43% of the char/time target, 42% of the lesson-count target |
| Installer lesson-1 completion | ≥40% | **Unmeasured** — no analytics pipeline exists | ❌ Unmeasurable |

Verified 2026-08-05 by importing `src/content/lessons.js` directly (bootstrapped Node) and summing
`title`/`subtitle`/`takeaway`/`thinkAbout`/every section's `heading`+`body`, English only — not carried
forward from the last run-log claim. Matches AGENT_LOG's "~38,100" figure closely (38,146 exact);
reading-time estimate uses ~5.5 chars/word at 200 wpm.

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
- Lesson catalogue size: 
  ```bash
  BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
  node -e '
  import("./src/content/lessons.js").then(({lessons}) => {
    let chars = 0;
    for (const l of lessons) {
      chars += (l.title?.en||"").length + (l.subtitle?.en||"").length + (l.takeaway?.en||"").length + (l.thinkAbout?.en||"").length;
      for (const s of l.sections||[]) chars += (s.heading?.en||"").length + (s.body?.en||"").length;
    }
    console.log(lessons.length, "lessons,", chars, "en chars");
  });'
  ```
- Translation volume ratio (10.4):
  ```bash
  BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
  node -e '
  import("./src/content/lessons.js").then(({lessons}) => {
    const langs = ["en","es","ko","zh","ja"];
    const t = Object.fromEntries(langs.map(l => [l, 0]));
    for (const l of lessons) {
      for (const lang of langs) {
        t[lang] += (l.title?.[lang]||"").length + (l.subtitle?.[lang]||"").length + (l.takeaway?.[lang]||"").length + (l.thinkAbout?.[lang]||"").length;
        for (const s of l.sections||[]) t[lang] += (s.heading?.[lang]||"").length + (s.body?.[lang]||"").length;
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
