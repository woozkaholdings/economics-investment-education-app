# Launch Readiness Scorecard

Backlog item 15 (`AGENT_LOG.md`, owner-requested 2026-08-04): one place that tracks the launch plan's
actual gates, so a run's own "done" claim isn't the only record. This file lists what has to be true,
what is actually true right now, and how that was checked — not a narrative, a checklist. Update it
whenever a gate's status changes; don't let it go stale the way `AGENT_LOG.md`'s App summary once did.

**Last refreshed: 2026-08-05.**

## Blindspot register (`LAUNCH_PLAN.md` §10)

| # | Item | Status | Evidence |
|---|---|---|---|
| 10.1 | Financial-advice adjacency | ✅ Closed | `grep -rn "best investments\|be bullish\|be cautious" src/content/` — no matches. Disclaimer renders on Home, Learn, Markets, About, first-launch modal. |
| 10.2 | Dalio dependency | ✅ Closed | `grep -rni "dalio" src/ economic-cycles-v5.jsx` — no matches. |
| 10.3 | Kids content / COPPA | ⚠️ Closed-but-reopened | Ships parent-facing (`src/screens/reference/ParentGuide.jsx`), which is the standing rule until the owner decides. **Reopened as a question 2026-08-04 — the owner, not a run, must resolve this.** Do not change the framing without that decision. |
| 10.4 | Five languages = maintenance debt | 🟡 Open, tracked | es/ko/zh/ja labelled "(Beta)" in the language picker. Volume ratio last measured 2026-08-02 (es 0.41x, ko 0.24x, ja 0.18x, zh 0.15x of English) — **stale as of the 2026-08-05 example-rewrite that grew English ~1.7x** (see item 20 in `AGENT_LOG.md`); ratios are now narrower than these numbers suggest. Re-measure before quoting them again. |
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
| Any analytics library present | ❌ None — `grep -rn "posthog\|analytics" src/ package.json` returns zero matches |
| Minimum event set (app opened, lesson started/completed, quiz taken, paywall viewed, trial started, subscribed, cancelled, ad watched) | ❌ Not built |

This is backlog item 18 in `AGENT_LOG.md` and is explicitly required *before* launch, not after. It's
also the reason the installer-completion half of the Phase 0 gate above is unmeasurable — there's no
pipeline to measure it with.

## Process items tracking this scorecard itself

| Item | Status |
|---|---|
| 15 — this scorecard | ✅ Built 2026-08-05 |
| 16 — tighten builder/critic feedback loop | 🟡 Open — needs design, not yet built. The dev-agent `SKILL.md`'s mandatory adversarial self-check (added before this scorecard existed) is the first piece. |

## How to refresh this file

- Blindspot grep checks: the `grep` commands quoted above, run from the repo root.
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
- Instrumentation: `grep -rn "posthog\|analytics" src/ package.json`.
- Installer completion / paywall conversion: not checkable until §9.2 ships — leave marked
  "Unmeasured," don't estimate.
- Do not mark a gate closed here without the same command a skeptical reviewer would run producing the
  same result — that's the whole point of a scorecard existing.
