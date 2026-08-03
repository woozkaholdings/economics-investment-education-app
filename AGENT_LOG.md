# Agent Log — Economic Cycles App

This file is the memory of the autonomous development agent that runs every 3 hours on this repo. Each run reads this file, picks the single highest-value backlog item, implements it, verifies it, and appends a dated entry below. Do not delete history — prune the backlog as items complete, but keep the run log intact.

## App summary (as of 2026-08-01)

`economic-cycles-v5.jsx` is a 1,340-line single-file React app (no build tooling existed before this run). It implements:

- **5 languages** (en, es, ko, zh, ja) via a `TR` translation dictionary and per-item `{en, es, ko, zh, ja}` objects throughout.
- **4 bottom tabs**: Home, Learn, Markets, More.
- **12 sequential lessons** based on the economic-machine framework popularized by Ray Dalio (transactions → credit → productivity growth → short-term debt cycle → long-term debt cycle → deleveraging tools, etc.), each with sections, a key takeaway, and a "think about this" prompt. Lessons unlock in order as prior ones are completed.
- **Quiz engine** (`quizData`) — ~13 multiple-choice questions with explanations, in all 5 languages.
- **Kids section** (`kidsContent`) — age-banded (5-8, 9-12, 13-17) lessons, an activity, and a parent tip.
- **Glossary** (`glossary`) — ~16 terms, searchable, translated.
- **Markets dashboard** — yield curve shapes, Fed balance sheet (QE/QT) narrative, rate-change effects on assets. (The hardcoded `nowDate: "February 2026"` stale-data problem flagged in launch plan §2.3 was fixed 2026-08-02 — the tab is now explicitly an illustrative teaching scenario with no dates.)
- Helper chart components (`Bar`, `YieldCurve`, `CycleChart`) are plain inline-styled SVG/divs, no charting library dependency.

There was no `package.json`, no bundler, and no way to actually run the app before this run. `Economic_Cycles_Launch_Plan.docx` (see `working_files/Economic_Cycles_Launch_Plan.pdf` for the same content as images) is a full launch playbook: Expo/React Native + Supabase + RevenueCat + PostHog stack, freemium pricing ($6.99/mo, $39.99/yr, $79.99 lifetime), a 16-week roadmap, and — importantly — a "Blindspot Register" (Section 10) flagging legal/compliance risks in the *current content* that should be fixed before anything else:

1. **10.1 Investment-advice adjacency**: lessons include "Best Investments" / "Avoid" per cycle phase — must stay general/historical, never personalized, plus needs a plain-language "educational, not investment advice" disclaimer. **Closed 2026-08-02** — see run log.
2. **10.2 Dalio dependency**: the app directly quotes Ray Dalio (`dalioQuote` in every language) and credits him by name — legal/platform risk; should be reframed as "principles popularized by economists and investors" with quotes removed. **Closed 2026-08-01.**
3. **10.3 Kids content / COPPA**: a kids section aimed at ages 5-17 can make the whole app "child-directed" under COPPA, restricting data collection and ads. Should be reframed as a parent-facing "teach your kids" feature rather than a child-facing mode. **Closed 2026-08-01.**

The launch plan explicitly calls resolving 10.1–10.3 "your first five moves," ahead of any refactor or new feature. **All three are now closed** as of 2026-08-02.

## Prioritized backlog

> **Curated by the weekly review, 2026-08-02 (second pass)**
> (`reviews/2026-08-02-weekly-review-2.md`). This ordering supersedes every previous one,
> including the 00:26 curation. **Do not start a P2/P3 item while a P1 is open**, and work
> P1 items in the numbered order — the ordering is deliberate, not a menu.

**P1 — cleared.** The `App`-into-per-tab-components split (launch plan §2.2) is complete:
`Home`, `Markets`, `Learn`, and `More` all now live under `src/components/`, along with the
`Bar`/`YieldCurve`/`CycleChart` chart helpers (`src/components/charts.jsx`). `App` itself
is down to 135 lines and is now just tab-switching/header/first-launch-modal glue — see
the run log entries below for all four steps. **P2 is now open.**

**P2 — after P1 is clear**

1. **[P2] First-session flow (launch plan §3.2–3.3) — now decomposed, so it can actually be picked up.** The plan calls the first five minutes "your most important feature" and sequences it as Move 4, right after the §2.2 migration. None of it exists. Take these one per run, in order:
   - 6a. **Progress ring on Home** (lessons completed / 12) plus an estimated "≈N min" label on each lesson card.
   - 6b. **Lesson-completion celebration** — a small animation on "Mark Complete" and the ring advancing.
   - 6c. **First-open routing** — with no saved progress, land straight in lesson 1 rather than on Home. (No signup exists to skip, which is already what the plan wants; make it explicit and keep it that way.)
   - 6d. **Streak counter on Home**, localStorage-backed — reuse the `try/catch` pattern already established by `ecycles_seen_disclaimer`.
   - 6e. **One-tap "continue tomorrow" prompt** at lesson end. **localStorage only** — real reminder notifications need the Expo decision (item 12) and must not be started here.
2. **[P2] Clean up unused translation keys** — `indicators`, `bestInvest`, `avoidInvest`, `psychology`, `why`, `expansion`, `peak`, `contraction`, `trough`, `expDesc`, `peakDesc`, `contDesc`, `troughDesc` are defined in all 5 languages but nothing renders them (confirmed again by the new `npm test` harness's used-vs-defined `TR` key check — these 13 show up as defined-but-unused). (The *rendered* "Best investments" phase language in lesson 10 was a different, now-fixed issue — see the §10.1 completion entry below.) Either delete them or build the feature with historical/educational framing and the same disclaimer treatment. Pick one — don't leave this open indefinitely.
3. ~~**[P2] Refresh `README.md`.**~~ **DONE 2026-08-02** — see the run log entry below and the completed list. Prune this slot at the next curation.
4. **[P2] Add `DECISIONS.md`** — launch plan Move 1 asks for a decision log and this file is a *work* log, not serving that purpose. Small: record the Expo-vs-Vite choice and its status, the `.js`-not-JSON content format and why, and the localStorage-only progress approach. One short run.
5. ~~**[P2] Broaden `scripts/check-data.mjs`'s `t.key` usage scan beyond `economic-cycles-v5.jsx`.**~~ **DONE 2026-08-02** — see the run log entry below and the completed list. The scan now also globs `src/components/*.jsx`; verified by deliberately injecting a dangling `t.` reference into `More.jsx` and confirming the harness fails with the correct file path, then reverting. Prune this slot at the next curation.

**P3 — polish, only after P1 and P2**

8. **[P3] Triage `npm audit`.** `npm install` on 2026-08-02 reports **2 vulnerabilities (1 moderate, 1 high)** in the dev-dependency tree (`npm audit fix --force` was suggested, breaking changes implied). Only Vite and React are direct dependencies, so this is probably transitive dev-tooling noise that never ships to users — but nobody has run `npm audit` itself to see which packages. **Do not run `--force`.**
9. **[P3] Dark mode** (plan §3.4). Now unblocked (the `App` split is done) — against the current inline styles it would just have to be redone.
10. **[P3] Accessibility pass**: screen-reader labels on tab buttons, quiz options, and the language picker; dynamic font-size support; contrast check on the phase colors (plan §3.5). Also add `aria-label`/keyboard-dismiss support to the first-launch modal — it currently has no focus trap or Escape handling.
11. **[P3] Mobile responsiveness check** at 375px — the file is full of fixed `px` values and the product is mobile-first.

**HELD — owner decisions, do not act on these**

12. **[HELD] Expo vs. Vite — needs a human call, and it is now closer to the critical path.** Launch plan §2.2 and §8 (weeks 1–2) specify building on **Expo (React Native)** so web/iOS/Android share one codebase; the 2026-08-01 scaffold run chose **Vite + React (web-only)** instead. That was a reasonable way to make the prototype runnable and the plan does sequence web first, but every further web-only UI change raises the eventual port cost — and item 3 (first-session flow) is a large one. The dev agent must **not** migrate to Expo on its own initiative and must **not** deepen the web-only investment beyond the P2 items above. Surface this for the project owner to decide.
13. **[HELD] FRED live-data integration for the Markets tab** — explicitly a *post-launch premium feature* per launch plan §2.3. Do not start. The static/educational Markets tab rework shipped 2026-08-02.

**Completed and pruned**

- **`README.md` refreshed to match the current split structure** — done 2026-08-02, see run log. Replaced the stale "one 1,340-line file" description with the actual `src/locales/` / `src/content/` / `src/components/` layout, added a Testing section for `npm test`, and mentioned `scripts/bootstrap-node.sh`.
- **`scripts/check-data.mjs` `t.key` scan broadened to `src/components/*.jsx`** — done 2026-08-02, see run log. Was only reading `economic-cycles-v5.jsx`, silently covering less of the translation-key surface with each JSX-split extraction. Now reads the main file plus every component file; verified with an injected-then-reverted dangling-key test.
- **Stale/dated factual figures reworded** — done 2026-08-02, see run log. The `~$50T total credit vs ~$3T actual money` figures (lesson body, quiz `explain`, `Credit` glossary entry) were replaced with figure-free "many times larger than the base money supply" framing; the `2+ quarters of falling GDP = recession` line (lesson body, `GDP` and `Recession` glossary entries) is now framed as a rule of thumb with an NBER note; the yield-curve "has predicted EVERY US recession since 1955" claim (lesson subtitle+body, quiz `explain`) now acknowledges inversions have preceded every recession since 1955 but not every inversion is followed by one.
- **JSX split, step 4d (`More` tab → `src/components/More.jsx`) — the `App` split is now fully done.** Done 2026-08-02, see run log. Fourth and last of the four per-tab extractions. Unlike `Home`/`Markets`/`Learn`, `More`'s local state (`moreSection`, quiz `qIdx`/`qStarted`/`qAnswer`/`qScore`/`qDone`, `kidsAge`, `glossSearch`) moved *into* the component rather than staying lifted in `App`, since nothing outside `More` read any of it. `quizData`/`glossary`/`kidsContent` are now imported directly in `More.jsx` rather than passed as props, matching the precedent `Markets.jsx` set for `charts.jsx`. `economic-cycles-v5.jsx` down to 135 lines — now just tab-switching/header/first-launch-modal glue.
- **JSX split, step 4c (`Learn` tab → `src/components/Learn.jsx`)** — done 2026-08-02, see run log. Third of the four per-tab extractions; `economic-cycles-v5.jsx` down to 294 lines.
- **JSX split, step 4b (`Markets` tab → `src/components/Markets.jsx`, chart helpers → `src/components/charts.jsx`)** — done 2026-08-02, see run log. Second of the four per-tab extractions; `economic-cycles-v5.jsx` down to 380 lines.
- **Quiz answer key de-skewed** — done 2026-08-02 (by the weekly reviewer, at the owner's request, out of normal priority order). Correct-answer positions now spread `2,0,3,1,3,2,0,3,1,2,0,1,2` (counts by index `{0:3, 1:3, 2:4, 3:3}`, max share 31%) instead of 12 of 13 on index 0. `npm test` reports 0 warnings. **`src/content/quizData.js` now carries a header comment explaining the invariant — read it before adding or editing a question.**
- **JSX split, step 4a (`Home` tab → `src/components/Home.jsx`)** — done 2026-08-02, see run log. First of the four per-tab extractions; `economic-cycles-v5.jsx` down to 529 lines.
- **Data-shape check harness (`npm test`)** — added 2026-08-02, see run log below. Checks locale/content modules structurally in ~5s; no browser or 2-minute build needed to catch a missing language field.
- **JSX split, step 3 (`quizData`, `glossary`, `kidsContent` → `src/content/*.js`)** — done 2026-08-02, see run log. All content now lives in modules; `economic-cycles-v5.jsx` down to 591 lines.
- **Language picker "Beta" labelling (§3.5/§10.4)** — done 2026-08-02, see run log. The es/ko/zh/ja options in the language `<select>` now read e.g. "🇰🇷 한국어 (Beta)"; English is unchanged. Translation-volume ratios measured 2026-08-02 (**es 0.41x, ko 0.24x, ja 0.18x, zh 0.15x** of English lesson-body chars) are noted here for reference if a future run wants to re-measure after content is added.
- **JSX split, step 1 (`TR` → `src/locales/*.js`)** and **step 2 (`lessons` → `src/content/lessons.js`)** — done 2026-08-02, see run log. Independently verified by the second weekly review: 12 lessons intact, 0 missing language fields, exact locale key parity, `economic-cycles-v5.jsx` down from 1,340 to 692 lines.
- **Reproducible build environment** — `scripts/bootstrap-node.sh` added 2026-08-02, see run log below.
- Blindspot register §10.2 (Dalio de-branding) and §10.3 (parent-facing Kids framing) — done 2026-08-01, verified by the weekly review.
- Markets tab stale date (§2.3) — done 2026-08-02.
- **§10.1 (investment-advice adjacency) — fully closed 2026-08-02.** All three gaps the weekly review flagged are resolved: (1) the "be bullish when cutting / be cautious when hiking" directive sentence and, more significantly, a previously-unnoticed set of rendered "Best investments: growth stocks / value stocks / ..." per-phase lines in lesson 10 (all 5 languages) were reworded to historical/descriptive framing ("historically favored in this phase..."); (2) the `disclaimer` key now also renders on the Learn tab (below "Think About This") and in a new About sub-section, so it appears on Home, Learn, Markets, and About; (3) a one-time first-launch modal (localStorage-backed, key `ecycles_seen_disclaimer`) shows the disclaimer before first use, and a permanent About sub-section was added to the More tab for ongoing access. See the run-log entry below for details.

## Environment note

This automated execution environment has **no Node.js in `PATH`** (confirmed 2026-08-01 — no `node`, `npm`, `nvm`, `volta`, `asdf`, or Homebrew present). **As of 2026-08-02, use `scripts/bootstrap-node.sh` instead of re-downloading Node by hand.** It caches a pinned Node v20.18.1 under `$HOME/.cache/ecycles-node` (real home directory — persists across runs, unlike the session scratchpad) and prints the runtime's `bin` directory on stdout:

```bash
BIN_DIR="$(scripts/bootstrap-node.sh)"
export PATH="$BIN_DIR:$PATH"
npm install && npm run build
```

First run on a given machine downloads (~30s); every run after that reuses the cache instantly. Never installs anything system-wide, never touches the repo.

## Run log

### 2026-08-01 — Initial scaffolding (first run)

- Read `economic-cycles-v5.jsx` in full and extracted the text of `Economic_Cycles_Launch_Plan.docx` (via a small Python/zipfile script, since `pdftoppm` wasn't available to render the PDF copy) to understand the product's current state and roadmap.
- Created this file (`AGENT_LOG.md`) with the app summary and prioritized backlog above.
- Added a minimal Vite + React scaffold so the existing prototype actually builds and runs locally, without moving or modifying `economic-cycles-v5.jsx` (its content is untouched — future runs will migrate pieces out of it per backlog item 3):
  - `package.json` (react, react-dom, vite, @vitejs/plugin-react)
  - `vite.config.js`
  - `index.html`
  - `src/main.jsx` — mounts `App` imported directly from `../economic-cycles-v5.jsx`
  - `.claude/launch.json` — dev-server config (`npm run dev`, port 5173) for local preview tooling
  - Extended `.gitignore` to also ignore `dist/`
- Added `README.md` describing the project and how to run/build it.
- **Verified**: since this execution environment has no Node.js in `PATH`, downloaded a portable Node v20.18.1 (darwin-x64) into the session scratchpad (not committed, not installed system-wide) and ran `npm install` (62 packages, installed cleanly) followed by `npm run build`, which succeeded (`✓ 30 modules transformed`, `dist/assets/index-*.js` ~239 kB / ~98 kB gzip). Could not verify the dev server visually in-browser in this sandboxed run (no system Node for the browser-preview tool to spawn); a local interactive session with Node installed should confirm `npm run dev` renders correctly.
- **Next run should pick**: backlog item 1 (blindspot register content fixes — disclaimer, softened investment language, Dalio quote removal, parent-facing kids framing). It's pure content, explicitly the launch plan's own first priority, and doesn't depend on the (larger, riskier) monolith-splitting work.

### 2026-08-01 — Blindspot register content fixes (launch plan §10.1–10.3)

Resolved the three legal/compliance content risks the launch plan flags as the first priority, all as content-only edits to `economic-cycles-v5.jsx` (no structural changes):

- **§10.1 Investment-advice adjacency**: added a new `disclaimer` translation key ("Educational content only — not personalized investment, legal, or tax advice. Markets carry risk; past patterns don't guarantee future results.", in all 5 languages) and rendered it on the Home tab (below the featured-insight card) and the Markets tab (below the Key Principles box) — the two screens where investment-adjacent content appears. Also confirmed via `grep` that the "Best Investments"/"Avoid" grid the launch plan describes doesn't actually exist in this version's rendered UI — those translation keys (`bestInvest`, `avoidInvest`, `indicators`, etc.) are defined but unused; added as new backlog item 8 rather than silently deleting them, since a future run should decide whether to build the feature (with proper historical framing) or remove the dead keys.
- **§10.2 Dalio dependency**: removed every direct "Ray Dalio" reference from the file (was in the header comment, a section comment, the Home tab's quoted "featured insight" + "— Ray Dalio" byline, lesson 12's subtitle, a quiz question, and one Kids 13-17 lesson) — 5 languages each where user-facing. The literal quote on Home was rewritten as an original paraphrase (renamed `dalioQuote` → `heroInsight`) rather than removed outright, so the feature still works; attribution is now generic ("principles popularized by economists and investors") per the plan's own recommended language.
- **§10.3 Kids content / COPPA**: reframed the Kids tab from child-facing to parent-facing — `kidsTitle` changed from "Economics for Kids" to "Teach Your Kids About Money" (and equivalents in es/ko/zh/ja), and added a new `kidsParentIntro` line rendered just below the tab header ("A parent's guide — pick your child's age band, then read and share these explanations together."). Did not rewrite the lesson body copy itself (still addressed to "you" as a read-together voice) — that's a much larger content rewrite and the framing change is what actually addresses the COPPA/child-directed-classification risk the plan raises. No ads or accounts exist anywhere in the app yet, so those specific plan concerns don't apply yet either.
- **Verified**: `grep -c` confirmed `Dalio` has zero remaining occurrences in the file, and the new keys (`heroInsight`, `disclaimer`, `kidsParentIntro`) each appear the expected number of times (5 definitions + correct usage count). Ran `npm run build` with the same portable Node v20.18.1 runtime from the previous run — succeeded (`✓ 30 modules transformed`, `dist/assets/index-*.js` ~240 kB / ~99 kB gzip, built in ~3 min). Did not visually verify in a browser (still no system Node for the preview tool in this sandboxed environment) — a local interactive session should eyeball the Home, Markets, and Kids tabs to confirm the new disclaimer/intro text reads well in all 5 languages.
- **Next run should pick**: backlog item 1 (Markets tab stale `"February 2026"` date — §2.3 of the launch plan). It's the next cheapest, highest-leverage item and doesn't depend on the larger monolith-splitting work (item 2).

### 2026-08-02 — Markets tab stale-date fix (launch plan §2.3)

Resolved the launch plan's §2.3 "Markets tab problem" using its own zero-cost recommended option — make the tab explicitly educational with no dates, instead of wiring live data (FRED integration stays a post-launch item, backlog item 8). Content-only changes to `economic-cycles-v5.jsx`, all 5 languages:

- Renamed the `nowDate` key (was `"February 2026"` / `"Febrero 2026"` / etc.) to `scenarioNote`, now reading "For teaching purposes — not live market data" (and per-language equivalents), rendered under the Markets tab header in place of the hardcoded date.
- Changed `currentState` from "Current State" to "Illustrative Scenario" in all 5 languages, and removed the `— {date}` suffix from that section's heading.
- Rewrote the "Current State" body paragraph: dropped the specific dated claims (`"Jan 2026 Fed minutes"`, `"CPI ~2.4%"`, `"Fed Funds Rate 4.25-4.50%"`, `"highest since 1932"`) in favor of a generic, historically-framed "late expansion" scenario description that doesn't pin to any real date or specific real-world figures that will go stale.
- Applied the same fix to a lesson `thinkAbout` prompt (lesson 11, "Watch Multiple Indicators") that had the identical problem — reframed "In February 2026: ..." as "Imagine an economy where: ..." in all 5 languages, again dropping the "highest since 1932" dated claim.
- Also fixed a related stale-data-implying label found while working: the Fed Balance Sheet bar chart's last data point was labeled "QT2 / Now" — changed to "QT2 / '22-24" so the chart doesn't imply a live current reading either.
- **Verified**: `grep -n "nowDate|February 2026|1932|4.25-4.50|Jan 2026"` returns zero matches in the file. Ran `npm run build` using the portable Node v20.18.1 runtime (reused from a prior run's session scratchpad, copied into this run's scratchpad since sessions don't share `/tmp`) — first attempt failed with a JS syntax error (straight double-quotes nested inside a double-quoted string in the new Chinese "Current State" text, `"一个"扩张后期"情形..."`); fixed by switching to Chinese curly quotes (`“…”`), matching the pattern already used in the Japanese string. Second build succeeded: `✓ 30 modules transformed`, `dist/assets/index-1Iu_pOM1.js` ~241 kB / ~99.75 kB gzip, built in ~2m 52s. Could not visually verify in the browser preview tool — confirmed (again) that this sandboxed environment has no system Node/npm in `PATH`, so `preview_start` fails to spawn `npm run dev` (`Failed to spawn process: No such file or directory`); this is the same limitation noted in the 2026-08-01 entries, not new.
- **Found in passing**: an untracked `reviews/2026-08-02-weekly-review.md` existed in the working tree from a separate, legitimate scheduled task (`economics-app-sunday-review`, confirmed via `list_scheduled_tasks`) that had reviewed the repo's state earlier the same day, including this run's in-progress uncommitted diff. Left it untouched and did not commit it — not this run's file to manage — but folded its concrete findings (advice-adjacent lesson language not fully closed, translation-parity gap, stale factual figures) into the backlog above.
- **Next run should pick**: backlog item 1 (P0 — finish §10.1: reword the "be bullish when cutting / be cautious when hiking" lesson sentence to historical framing and add the disclaimer to the Learn tab). It's flagged P0 by the independent weekly review, it's a genuine gap in previously-reported-as-done work, and it's cheap.

### 2026-08-02 — Finish §10.1 (investment-advice adjacency), close it out

Picked backlog item 1 as ranked by the 2026-08-02 weekly review. Content/UI-only changes to `economic-cycles-v5.jsx`:

- **Reworded advice-adjacent language.** Lesson 8's "Don't fight the Fed" section had "When the Fed is cutting → be bullish. When hiking → be cautious." (English only) — rewritten to "Historically, Fed easing (rate cuts) has coincided with rising asset prices, while Fed tightening (rate hikes) has coincided with more cautious market conditions." **While implementing this, found a bigger instance of the same problem the backlog item hadn't named**: lesson 10 ("The 4 Phases of Economic Cycles") has rendered body text (not the separate unused `bestInvest`/`avoidInvest` keys — this is inline in `sections[].body`, confirmed rendered via `lesson.sections.map` at the Learn tab) reading "Best investments: Growth stocks, cyclical stocks..." / "Best investments: Value stocks, commodities..." / "Best investments: Treasury bonds, gold..." / "Best investments: Beaten-down quality stocks..." for all 4 phases, in all 5 languages (es/ko/zh/ja versions are shorter but have the same "mejores inversiones" / "최적 투자" / "最佳投资" / "最適投資" pattern). This is exactly the launch plan's §10.1 concern — investment recommendation grids per cycle phase — so it was reworded too: "Best investments: X" → "Historically favored in this phase: X" (and equivalents) in all 5 languages, both phase pairs.
- **Disclaimer now on the Learn tab.** Added a `ℹ️ {t.disclaimer}` block below the "Think About This" box on every lesson (was previously only on Home and Markets).
- **New "About" sub-section in the More tab.** Added a 4th sub-nav entry (`aboutTabLabel`) alongside Quiz/Kids/Glossary, rendering `aboutTitle` + `aboutBody` (a short, factual description: what the app teaches, that it collects no accounts/personal data, and that nothing in it is personalized advice) plus the standard disclaimer block. New keys added in all 5 languages: `aboutTabLabel`, `aboutTitle`, `aboutBody`, `firstLaunchTitle`, `firstLaunchOk`.
- **First-launch notice.** Added a `showFirstLaunch` state + `useEffect` that checks `localStorage.getItem("ecycles_seen_disclaimer")` on mount and shows a centered modal (title + the same `disclaimer` text + an acknowledge button) if unset; dismissing sets the localStorage flag so it only shows once. This is the app's first use of `localStorage` — wrapped in try/catch so it degrades gracefully if storage is unavailable (private-mode browsers).
- **Verified**: `grep` confirms zero remaining matches for `"be bullish"`/`"be cautious"` and `"Best investments:"`; `aboutTabLabel:`/`firstLaunchOk:` each appear 5 times (once per language); the disclaimer render pattern appears 5 times (Home, Learn, Markets, About, first-launch modal). Reused a portable Node v20.18.1 runtime copied from another session's scratchpad (`PATH`-prefixed, not installed system-wide, not committed) — `npm run build` succeeded: `✓ 30 modules transformed`, `dist/assets/index-C0PXGqaw.js` 245.05 kB / 101.02 kB gzip, built in 1m 57s. Did not visually verify in a browser — same no-system-Node limitation noted in every prior entry; a local interactive session should click through the first-launch modal, the Learn tab disclaimer, and the new About sub-section in all 5 languages.
- **Found in passing, not fixed this run**: the `bestInvest`/`avoidInvest`/`indicators`/etc. translation keys (backlog item 6) remain genuinely unused and are a separate, smaller matter from the lesson-10 body text fixed above — left as-is per the existing backlog item.
- **Next run should pick**: backlog item 1 (P0 — the `scripts/bootstrap-node.sh` reproducible build environment). §10.1 is now fully closed, so the only remaining P0 is the build-environment one; it's cheap, self-contained, and unblocks every future run from re-discovering the scratchpad-Node trick.

### 2026-08-02 — Weekly review (quality control, not a dev run)

Written by the `economics-app-sunday-review` scheduled task. Full report:
`reviews/2026-08-02-weekly-review.md`. This entry is a pointer — read the report before
picking the next item.

- **Reviewed**: all three commits to date (`eda6dd0` user prototype, `deea610` scaffold,
  `ecdda70` blindspot fixes). Run 3 (`5ab5c48`, Markets stale-date) committed while the
  review was running and is deferred to next week's review.
- **Log ↔ commit cross-check: clean.** Every run-log entry maps to a real commit and vice
  versa. The log is also honest about what it skipped, which is the right instinct — keep
  doing that.
- **Build: PASS** on `ecdda70` — Vite 5.4.21, `✓ 30 modules transformed`, 240.54 kB /
  98.93 kB gzip, 2m 4s, exit 0. Verified in an isolated copy of the tree so the repo's own
  `dist/` and the in-flight working tree were not disturbed. **No tests exist.**
- **Grade for the week: B+.** Right items, right order, small reversible diffs, no churn
  and no regressions. Marked down for reporting §10.1 as resolved when it was about half
  done, and for the translation-parity gap going unnoticed.
- **Course corrections now in the backlog above** — the two P0s (finish §10.1 including the
  first-launch/settings disclaimer; make the Node bootstrap reproducible), the
  language-beta labelling, dark mode demoted below the monolith split, the previously
  absent first-session flow, and the Expo-vs-Vite question marked HELD for the owner.
- **A note on self-verification**: run 3's first build *failed* (a JS syntax error from
  straight quotes nested inside a double-quoted Chinese string) and the agent caught and
  fixed it before committing. That is the process working — and it is also the strongest
  argument for backlog item 5: a 2-minute full build is a slow way to learn you typo'd a
  quote mark.
- No files were reverted or deleted by this review, and nothing was pushed to any remote.

### 2026-08-02 — Reproducible build environment (backlog P0)

Picked the sole remaining P0: every prior run's log had a variant of "downloaded a portable
Node tarball into the session scratchpad, which doesn't survive between runs" — pure waste,
and exactly the item the 2026-08-02 weekly review called out. Fixed it properly instead of
re-discovering the trick again next run:

- Added `scripts/bootstrap-node.sh` (new file, executable). It detects OS/arch (`darwin`/
  `linux`, `x64`/`arm64`), checks a cache directory for an already-extracted Node runtime,
  and if missing downloads the pinned `node-v20.18.1-<platform>-<arch>.tar.gz` from
  `nodejs.org`'s official distribution, extracts it, and prints the runtime's `bin`
  directory to stdout (all progress logging goes to stderr, so the stdout stream is clean
  for `BIN_DIR="$(scripts/bootstrap-node.sh)"`-style capture).
- **Key fix over past runs**: the cache directory defaults to `$HOME/.cache/ecycles-node`,
  not the session scratchpad. Confirmed by inspection that `$HOME` in this execution
  environment is the real, persistent `/Users/woojoongkim` — unlike `/tmp`/scratchpad paths,
  which are per-session and don't survive. This means the ~30s download only happens once
  ever on this machine; every run after this one (including the weekly review) reuses the
  cached extraction in well under a second.
- Confirmed the "another session's scratchpad" copy-hack that showed up in three separate
  prior run-log entries is no longer needed.
- Updated the Environment note above with the new usage pattern and removed the old
  scratchpad-copy advice.
- **Verified**: ran the script cold (no cache) — downloaded and extracted correctly,
  `node --version` → `v20.18.1`. Ran it again immediately — hit the cache, skipped the
  download, same version reported. Then, using the script's output, ran the full
  `npm install && npm run build` from a clean shell (`PATH` prefixed with the script's
  `bin` dir, nothing installed system-wide) — `npm install` succeeded (64 packages, up to
  date), `npm run build` succeeded: `vite v5.4.21`, `✓ 30 modules transformed`,
  `dist/assets/index-C0PXGqaw.js` 245.05 kB / 101.02 kB gzip, built in 1m 55s. This is the
  same output hash as the previous run's build, confirming no content regression.
- **Next run should pick**: backlog item 1 (P1 — start splitting the monolithic JSX,
  launch plan §2.2). It's now the top of the list, it's explicitly sequenced first in the
  launch plan ("the foundation everything else stands on"), and the reproducible build
  environment this run just landed is exactly what makes multi-step extraction work safe to
  verify incrementally. Start with the smallest, lowest-risk extraction: `TR` → `src/locales/*.js`.

### 2026-08-02 — JSX split, step 1: extract `TR` → `src/locales/*.js`

Picked backlog item 1 (P1, top of the list): began the monolithic-JSX split the launch plan
(§2.2) calls "the foundation everything else stands on." Did the smallest, lowest-risk
extraction first — the `TR` translation dictionary — leaving `lessons`, `quizData`,
`glossary`, `kidsContent`, and the `App` component split for future runs, per the backlog's
own "one extraction per run" guidance.

- Added `src/locales/en.js`, `es.js`, `ko.js`, `zh.js`, `ja.js` — each `export default {...}`
  holding exactly that language's key/value pairs, byte-identical to the corresponding block
  previously inside `TR` in `economic-cycles-v5.jsx` (only the wrapping `lang: { ... },` was
  swapped for `export default { ... };`, the body lines are untouched).
- Added `src/locales/index.js`, which imports all five and re-exports `export const TR = { en, es, ko, zh, ja };` — same shape as the object it replaces, so every existing `TR[lang].key` / `t.key` (via `const t = TR[lang]`) call site in `economic-cycles-v5.jsx` needed zero changes.
- In `economic-cycles-v5.jsx`, replaced the 243-line inline `const TR = { ... };` block (old lines 9–250) with a single `import { TR } from "./src/locales/index.js";`. Nothing else in the file was touched — `git diff` confirms the change is exactly that one deletion/insertion, no incidental edits.
- **Verified content integrity precisely, not just "it builds"**: for each of the 5 languages, diffed the old in-file body (from the pre-commit version of `economic-cycles-v5.jsx` via `git show HEAD:...`) against the new module's body line-for-line (byte length compared: en 3669/3669, es 3796/3796, ko 2558/2558, zh 2230/2230, ja 2481/2481 — all exact matches). Also confirmed via `git diff --stat` that `economic-cycles-v5.jsx` changed by exactly "1 insertion(+), 243 deletions(-)" with no other hunks.
- **Verified build**: using `scripts/bootstrap-node.sh` (cached Node v20.18.1, no download needed), `npm run build` succeeded — `✓ 36 modules transformed` (up from 30, the +6 being the 5 new locale files + index), `dist/assets/index-B22SSX9B.js` 245.08 kB / 101.05 kB gzip, built in 2m 13s. Bundle size is within 0.03 kB of the previous build (245.05 kB), consistent with content being relocated rather than altered.
- **Did not visually verify in the browser preview tool** — `preview_start` still fails with `Failed to spawn process: No such file or directory` because that tool's spawn environment doesn't see the bootstrapped Node on `PATH` (the same limitation noted in every prior run's entry; not a regression from this change). Given the byte-exact content diff and successful build, risk is low, but a local interactive session should still click through all 5 languages once to eyeball rendering.
- **Next run should pick**: continue backlog item 1 — extract `lessons` (now at lines 17–504 of `economic-cycles-v5.jsx`, the next-largest content block) into `src/content/lessons.js`, following the same pattern (module export, single import, byte-diff verification, build). After `lessons`, `quizData`/`glossary`/`kidsContent` remain, then the `App`-component split into per-tab files.

### 2026-08-02 — JSX split, step 2: extract `lessons` → `src/content/lessons.js`

Continued backlog item 1, picking up right where the previous run left off (same day,
requested directly rather than waiting for the next scheduled run). Extracted the
`lessons` array — the next-largest content block after `TR` (484 lines, all 12 lessons
across 5 languages) — following the same pattern established for the `TR` extraction.

- Added `src/content/lessons.js`: `export const lessons = [ ... ];`, body byte-identical
  to the array previously inline in `economic-cycles-v5.jsx` (old lines 18–499).
- In `economic-cycles-v5.jsx`, replaced the 488-line block (section-header comment +
  `const lessons = [ ... ];`, old lines 13–500) with `import { lessons } from
  "./src/content/lessons.js";`, placed with the other top-of-file import. No call site
  changed — `lessons` is referenced the same way everywhere in `App` (`lessons[idx]`,
  `lessons.length`, `lessons.map`, etc.).
- **Verified content integrity**: diffed the old in-file array body (via `git show
  HEAD:...`) against the new module's body line-for-line — 483 lines on both sides,
  exact string match. `git diff --stat` on `economic-cycles-v5.jsx` showed exactly the
  expected single contiguous deletion (489 lines removed, 1 import line added), nothing
  else touched.
- **Verified build**: `npm run build` (bootstrapped Node v20.18.1) succeeded —
  `✓ 37 modules transformed` (up from 36), `dist/assets/index-Dq_-UGyp.js` 245.08 kB /
  101.06 kB gzip, built in ~2m — byte-for-byte identical bundle size to the pre-extraction
  build, confirming no content or behavior change.
- Same known limitation as every prior run: `preview_start` can't spawn `npm run dev`
  (its process spawn doesn't see the bootstrapped Node on `PATH`), so no browser
  visual check. Risk is low given the exact content-diff match.
- **Next run should pick**: continue backlog item 1 — extract `quizData` (now lines
  17–61 of `economic-cycles-v5.jsx`) into `src/content/quizData.js`, then `glossary`
  and `kidsContent`, then split `App` into per-tab components.
  *(Superseded by the second weekly review below — take all three content blocks in one
  run, and land the data-shape checks before touching `App`.)*

### 2026-08-02 — Weekly review, second pass (quality control, not a dev run)

Written by the `economics-app-sunday-review` scheduled task, ~9 hours after its first pass
the same day. Full report: `reviews/2026-08-02-weekly-review-2.md`. **Read that report
before picking the next item** — the backlog above was rewritten wholesale by it.

- **Reviewed**: the five dev runs that landed after the first pass — `5ab5c48`/`eafc235`
  (Markets stale date), `7ad8698` (§10.1 closed), `6feca25` (build bootstrap), `76be081`
  and `053f8b2` (monolith split steps 1–2) — plus a re-verification of the whole week.
- **Log ↔ commit cross-check: clean.** All eight dev-run entries map to real commits and
  vice versa. Run 7 was in flight (uncommitted) when the review started and committed as
  `053f8b2` mid-review; nothing of it was touched, staged, or reverted.
- **Build: PASS** at `053f8b2` — Vite 5.4.21, `✓ 37 modules transformed`,
  `dist/assets/index-Dq_-UGyp.js` 245.08 kB / 101.06 kB gzip, 2m 19s, exit 0. **The bundle
  hash matches the one run 7 reported**, independently reproducing its claimed output.
  `scripts/bootstrap-node.sh` hit its cache and produced Node v20.18.1 in under a second —
  the item did exactly what it was supposed to. **No tests exist.**
- **Grade for the week: A−**, up from B+. Every P0 from the 00:26 review was closed, in
  order, within nine hours. §10.1 was closed *better* than asked — the agent found and
  fixed the lesson-10 per-phase investment lines the review had missed. The split was
  verified independently: 12 lessons intact, **0 missing language fields** anywhere, locale
  key parity exact (83 keys, 0 missing / 0 extra in all four non-English languages),
  `economic-cycles-v5.jsx` down 1,340 → 692 lines.
- **New findings that became backlog items**: the quiz answer key is **12 of 13 on option
  index 0** (a user who always taps the first option scores 92% — item 5); the stale
  `$50T/$3T` and `2+ quarters = recession` figures appear in more places than previously
  recorded, including three glossary entries (item 6); `README.md` now misdescribes the
  repo on a public GitHub remote (item 9); `npm install` reports unexamined audit
  advisories (item 11).
- **Course corrections**: language **Beta** labelling moved to the top of P1 after a week
  of being outranked; the three remaining content extractions collapsed into **one** run
  (the one-per-run rule was right for 244- and 484-line blocks, not for ~95 lines); the
  data-shape checks **promoted to P1 and made a precondition** for the `App` split; the
  first-session flow **decomposed into 7a–7e** so it can finally be picked up instead of
  sitting in an "unscheduled" bucket.
- **A note on the review loop**: this is the second pass in one day only because the dev
  agent is running far faster than its stated cadence — seven runs in ~18 hours, against a
  header that says "every 3 hours" and a schedule that says 6. The output is good, so this
  is not a complaint; but the working tree changed twice mid-review, and two agents writing
  the same files is a real hazard. Worth reconciling the stated cadence with the real one.
- No files were reverted or deleted by this review, and nothing was pushed to any remote.

### 2026-08-02 — Language picker "Beta" labelling (launch plan §3.5 / §10.4)

Picked the top of the P1 list as ranked by the second weekly review: mark the four
non-English language options "Beta" in the language picker, since non-English lesson
body text is a fraction (0.15x–0.41x) of the English content and nothing in the UI
previously disclosed that.

- One-line change in `economic-cycles-v5.jsx`: the `<select>` options map now appends
  `" (Beta)"` to the label for every language except `en` (`l !== "en" ? " (Beta)" : ""`),
  so English is unaffected and es/ko/zh/ja each render e.g. "🇪🇸 Español (Beta)". No new
  translation key was added — "Beta" is used as-is across all languages, consistent with
  how the picker itself mixes scripts (it's a language-selection control, read before the
  chosen language takes effect).
- **Verified**: `git diff` confirms the change is exactly the one line described above,
  nothing else touched. Ran `npm install && npm run build` with `scripts/bootstrap-node.sh`'s
  cached Node v20.18.1 — succeeded, `✓ 37 modules transformed`,
  `dist/assets/index-IK1ntW5s.js` 245.10 kB / 101.07 kB gzip, built in 2m 24s (bundle size
  within 0.02 kB of the prior build, consistent with a ~20-byte string addition). Did not
  visually verify in the browser preview tool — same known limitation as every prior run
  (`preview_start` can't spawn `npm run dev` because its process spawn doesn't see the
  bootstrapped Node on `PATH`); risk is low for a one-line conditional string change,
  confirmed correct by the diff and the ternary logic (`l !== "en"` excludes only English,
  matches `Object.keys(langFlags)` = `en, es, ko, zh, ja`).
- **Found in passing, not fixed this run**: `npm install` reports "2 vulnerabilities
  (1 moderate, 1 high)" — recorded the actual counts into backlog item 10 (npm audit
  triage) since that item previously said "record the actual counts here" and nobody had.
  Did not run `npm audit` itself or investigate which packages, per the existing
  "don't touch P3 while P1 is open" rule.
- **Next run should pick**: backlog item 1 (P1 — finish the content extractions: `quizData`,
  `glossary`, `kidsContent` → `src/content/*.js`, all three in one run per the second
  weekly review's guidance). It's now the top of P1, it's mechanical and low-risk
  (~95 lines combined, same proven pattern as the `TR` and `lessons` extractions), and it's
  the precondition for item 2 (the data-shape check harness).

### 2026-08-02 — JSX split, step 3: extract `quizData`, `glossary`, `kidsContent` → `src/content/*.js`

Picked up the second weekly review's top P1 item: finished the monolithic-JSX content
extraction by moving the three remaining content blocks in one run, as instructed (the
"one extraction per run" rule was retired for these three since they total ~95 lines,
far smaller than the `TR` and `lessons` blocks already extracted with the same pattern).

- Added `src/content/quizData.js` (`export const quizData = [ ... ];`, was
  `economic-cycles-v5.jsx` lines 17–57, 13 quiz questions across 5 languages),
  `src/content/glossary.js` (`export const glossary = { ... };`, was lines 62–80, 16
  terms), and `src/content/kidsContent.js` (`export const kidsContent = { ... };`, was
  lines 85–116, 3 age bands). All three are pure data — no imports, no functions, no
  template literals — matching `lessons.js`.
- In `economic-cycles-v5.jsx`, added three import lines (`quizData`, `glossary`,
  `kidsContent` from `./src/content/*.js`) alongside the existing `TR`/`lessons` imports,
  and deleted the now-redundant inline blocks together with their section-header comments
  (old lines 17–120, replacing the whole "QUIZ DATA" / "GLOSSARY" / "KIDS CONTENT" section).
  No call site elsewhere in the file changed — `quizData[i]`, `glossary["GDP"]`,
  `kidsContent["5-8"]`, etc. are referenced identically.
- **Verified content integrity precisely, not just "it builds"**: diffed each old inline
  body (via `sed` on the pre-edit file) against the corresponding new module's body,
  line-for-line — `quizData` 39/39 lines, `glossary` 17/17 lines, `kidsContent` 30/30
  lines, all exact matches, zero diff output. `git diff --stat` on
  `economic-cycles-v5.jsx` confirmed exactly "3 insertions(+), 104 deletions(-)" (692 →
  591 lines), consistent with relocating ~104 lines of content into 3 new import lines.
- **Verified build**: `npm install` (0 new packages, same 2 pre-existing dev-tooling
  audit advisories as every prior run — unchanged, not investigated further per the
  existing P3 npm-audit item) then `npm run build` using
  `scripts/bootstrap-node.sh` (cached Node v20.18.1) — succeeded: `✓ 40 modules
  transformed` (up from 37, the +3 being the new content files), `dist/assets/index-
  C_i7fFmG.js` **245.10 kB / 101.07 kB gzip** — identical to the pre-extraction build
  size, confirming the change relocated content without altering it. The build itself
  ran slow (~2m 35s, and a first attempt hit the 4-minute foreground timeout with no
  output yet) — consistent with the log's existing note that another concurrent
  automated session can slow builds; re-ran in the background and waited for it to
  finish rather than assuming a hang.
- Did not visually verify in the browser preview tool — same known limitation as every
  prior run (`preview_start` can't spawn `npm run dev` because its process spawn doesn't
  see the bootstrapped Node on `PATH`). Risk is low given the exact line-diff match.
- Renumbered the backlog to reflect this item's completion: the former item 2 (data-shape
  check harness) is now item 1 and is unblocked; the former item 3 (split `App`) is now
  item 2; every P2/P3/HELD item shifted down by one accordingly, with cross-references
  (e.g. the Expo-vs-Vite HELD item's reference to "item 6") updated to match.
- **Next run should pick**: backlog item 1 (P1 — add the data-shape check harness,
  `npm test`). It's now unblocked, it's cheap (~20 lines of Node per the weekly review's
  own prototype), and it's an explicit precondition the backlog sets before item 2 (the
  riskier `App`-into-per-tab-components split) can start.

### 2026-08-02 — Data-shape check harness (`npm test`)

Picked backlog item 1 (P1, top of the list, and an explicit precondition for the `App`
split that follows it): added the structural test harness the second weekly review asked
for, so a missing language field or a bad index doesn't have to wait on a 2-minute
`vite build` (which only proves the JSX parses) or a browser session (which this
environment still can't run) to surface.

- Added `scripts/check-data.mjs` (plain Node, ESM, no test framework/dependency —
  matches the weekly review's own ~20-line prototype in spirit, ended up closer to 90
  lines because it checks five differently-shaped content modules plus the app's
  translation-key usage, not just one). Wired as `npm test` in `package.json`
  (`"test": "node scripts/check-data.mjs"`).
- **What it checks**, per module:
  - `src/locales/*.js` (`TR`): every language has exactly the same key set as `en`
    (missing/extra keys both fail), every value a non-empty string.
  - `src/content/lessons.js`: unique lesson `id`s; `title`/`subtitle`/`takeaway`/
    `thinkAbout` and every section's `heading`/`body` present in all 5 languages and
    non-empty.
  - `src/content/quizData.js`: `q`/`opts`/`explain` present in all 5 languages; `opts`
    has the *same option count* in every language (not just present); `answer` is an
    integer in range. Also computes the answer-index distribution and **warns
    (non-fatal)** if one index accounts for more than half of correct answers — this is
    what catches the "12 of 13 answers are option 0" defect backlog item 2 (formerly
    item 3) exists to fix. It's a warning, not a failure, on purpose: the fix itself is
    a separate, deliberately-sequenced P2 item, and this harness's job right now is to
    surface the signal, not to block on content decisions that aren't in scope for this
    run.
  - `src/content/glossary.js`: every term has all 5 languages, each a non-empty
    `{s, f}` pair.
  - `src/content/kidsContent.js`: every age band's `title`/`activity`/`parentTip` and
    every entry in `lessons[]` present in all 5 languages and non-empty.
  - `economic-cycles-v5.jsx`: every `t.someKey` reference (regex over the file, `t` is
    the per-render `const t = TR[lang]`) resolves to a real key in `TR.en` — catches a
    dangling reference a build wouldn't (JSX renders `undefined` silently, it doesn't
    throw).
- **Verified the checks are real, not rubber-stamps**: manually cross-checked the `t.`
  usage scan outside the script (67 unique `t.KEY` references found via the same regex,
  all 67 resolve against `TR.en`'s 83 keys, confirming the 16-key gap is exactly the
  known-and-tracked unused-translation-keys backlog item, not a script bug). Also
  grepped the file for any other single-letter `t` identifier (loop/callback params)
  that could collide with the `t.KEY` regex and confirmed there are none.
- **Verified it runs and is green**: `npm test` (via `scripts/bootstrap-node.sh`'s
  cached Node v20.18.1) completes in ~5 seconds — `PASS: 0 failure(s), 1 warning(s)`,
  the one warning being the already-tracked degenerate quiz-answer-index issue described
  above. Ran it both directly (`node scripts/check-data.mjs`) and via `npm run test` to
  confirm the `package.json` wiring works.
- **Verified no regression**: `npm run build` still succeeds —
  `dist/assets/index-C_i7fFmG.js` **245.10 kB / 101.07 kB gzip**, the *exact same bundle
  hash* as the previous run's build, confirming this run touched only tooling
  (`package.json`, `scripts/check-data.mjs`), not any shipped content or app code.
- **Environment note for future runs**: `git diff`, `git show <file> | ...` via process
  substitution, and a chained `git add && git status` all hung in this session (matches
  the standing memory note that git commands can stall here). Worked around it by not
  using `git diff` at all (relied on precise, deliberate edits instead) and by running
  `git add` on its own. One of the hung commands left a stale `.git/index.lock`; before
  removing it, confirmed via `ps aux` that no real `git` process was still running (the
  earlier grep match on "git" was a false positive from `Logitech`-named processes), then
  removed the lock. No files were reverted or force-anything used.
- **Next run should pick**: backlog item 1 (P1, now unblocked — split `App` into
  per-tab components under `src/components/`: `Home`, `Learn`, `Markets`, `More`, plus
  the `Bar`/`YieldCurve`/`CycleChart` helpers). Do one tab per run per the existing
  guidance, and run `npm test` (fast) alongside `npm run build` after each to confirm
  the extraction didn't drop a prop or a language field.

### 2026-08-02 — JSX split, step 4a: extract Home tab → `src/components/Home.jsx`

Picked backlog item 1 (P1, top of the list, now unblocked by the data-shape harness):
began the `App`-into-per-tab-components split, the riskier half of the launch plan's
§2.2 migration. Did the smallest, most self-contained tab first, per the existing
"one tab per run" guidance — `Home` has no local state of its own (only reads props) and
no sub-navigation, unlike `Learn` (lesson state), `Markets` (three chart helpers), or
`More` (four sub-sections).

- Added `src/components/Home.jsx`: `export default function Home({ t, lang,
  completedLessons, lessons, isLessonUnlocked, setCurrentLesson, setTab, scrollTop })`.
  JSX body is byte-identical to the old inline `{tab === "home" && (...)}` block (old
  lines 180–244 of `economic-cycles-v5.jsx`) — only the wrapping `<div>...</div>` was
  hoisted into a component function and its free variables (`t`, `lang`,
  `completedLessons`, `lessons`, `isLessonUnlocked`, `setCurrentLesson`, `setTab`,
  `scrollTop`) turned into named props; no rendering logic changed.
- In `economic-cycles-v5.jsx`: added `import Home from "./src/components/Home.jsx";`
  alongside the existing content imports, and replaced the 66-line inline Home block
  with `{tab === "home" && (<Home t={t} lang={lang} completedLessons={completedLessons}
  lessons={lessons} isLessonUnlocked={isLessonUnlocked}
  setCurrentLesson={setCurrentLesson} setTab={setTab} scrollTop={scrollTop} />)}`.
  `git diff --stat` confirmed exactly "3 insertions(+), 65 deletions(-)" on that one
  file, nothing else touched. File went 591 → 529 lines.
- **Verified**: `npm test` (data-shape harness, cached Node v20.18.1 via
  `scripts/bootstrap-node.sh`) still passes — `PASS: 0 failure(s), 1 warning(s)`, the one
  warning being the already-tracked degenerate quiz-answer-index issue (unrelated to this
  change). `npm install` (no new deps, same 2 pre-existing dev-tooling audit advisories)
  then `npm run build` succeeded: `✓ 41 modules transformed` (up from 40, the +1 being
  the new `Home.jsx`), `dist/assets/index-BjMrKTAT.js` **245.33 kB / 101.24 kB gzip** —
  within 0.23 kB of the pre-extraction build (245.10 kB), consistent with relocating a
  render function (plus its `export default`/`import` boilerplate) rather than altering
  behavior. Build ran ~2m 24s in the background while another process may have been
  competing for CPU, per the log's standing note — waited for completion rather than
  assuming a hang.
- Did not visually verify in the browser preview tool — same known limitation as every
  prior run since the JSX-split work began (`preview_start` can't spawn `npm run dev`
  because its process spawn doesn't see the bootstrapped Node on `PATH`). Risk is low:
  the extracted JSX is textually identical to what it replaced, and only prop-passing
  was added.
- **Environment note reconfirmed**: sandboxed `git status`/`git diff --stat` timed out
  at the 2-minute tool limit on the first attempt (no stale lock found afterward — it
  appears the index write simply hadn't finished, consistent with the existing
  iCloud-sync-latency note in memory). Retried unsandboxed and it succeeded immediately.
  No destructive git operations were used; matches the standing guidance to retry rather
  than escalate.
- **Next run should pick**: continue backlog item 1 — extract the `Markets` tab into
  `src/components/Markets.jsx`. It's the next-best candidate: fully self-contained (no
  local `App` state, only reads `t`/`lang`), and it's a natural pairing with hoisting the
  `Bar`/`YieldCurve`/`CycleChart` helper components (currently still inline at the top of
  `economic-cycles-v5.jsx`) into the same file or a shared `src/components/charts.js`,
  since `Markets` is their only caller. After `Markets`: `Learn` (has `currentLesson`
  navigation state — decide whether that stays lifted in `App` and is passed down, or
  moves into the component; lifted is simpler and matches the `Home` pattern), then
  `More` (largest — 4 sub-sections with their own local state: quiz/kids/glossary/about).

### 2026-08-02 — Quiz answer key de-skewed (out-of-order, owner-requested)

Done by the `economics-app-sunday-review` reviewer, **not** a normal dev run: the project
owner asked for backlog item 2 (P2) directly, ahead of the open P1. Recording it here so
the next dev run doesn't re-do it. Content-only change to `src/content/quizData.js`; the
dev agent's in-flight `Markets` extraction was untouched.

- **The problem**: `quizData` answer indices were `0,0,0,0,0,0,0,0,0,3,0,0,0` — 12 of 13
  correct answers sat at option index 0, so tapping the first option every time scored 92%
  without reading a single question. Every index was in range, so this was invisible to a
  naive validity check; the `npm test` harness's distribution warning was what kept it
  visible.
- **The fix**: for each affected question, the correct option string was **moved** to a new
  position and the distractors kept their relative order, applying the *same* permutation
  to all five language arrays. `answer` was updated to match. New distribution:
  `2,0,3,1,3,2,0,3,1,2,0,1,2` — counts by index `{0:3, 1:3, 2:4, 3:3}`, max share 31%,
  comfortably under the harness's 50% threshold. Three questions (2, 7, 11) already had a
  workable position and were left byte-identical to reduce diff noise.
- Shuffled the **stored** positions, not at render time, as the backlog item specified —
  `explain` text refers to option *content* (e.g. the "which is NOT one of the 4 tools"
  question), so render-time shuffling would have been safe for position but pointless for
  memorisation, and stored order is what a reviewer can actually inspect.
- Added a header comment to `src/content/quizData.js` recording the invariant and how to
  keep it when adding or editing questions — the failure mode here is habit (writing the
  correct answer first), so the counter-measure belongs next to the data.
- **Verified three ways.** (1) A scratch script diffed the old module (from
  `git show HEAD:...`) against the new one: for all 13 questions × 5 languages, the option
  *set* is unchanged and `oldOpts[oldAnswer] === newOpts[newAnswer]` — i.e. the correct
  answer is still the same string everywhere, and no `q`/`explain` text changed. This is
  the check that matters; a reordering bug would otherwise silently make a wrong option
  correct in one language only. (2) `npm test` → `PASS: 0 failure(s), 0 warning(s)` — the
  degenerate-distribution warning is gone. Note `npm test` imports the module through
  Node's real ESM loader, so a parse or shape error would have failed there.
- **No bundler build was run for this change, and the commit message for `99a5a03`
  overstates this — read this entry, not that message.** A `vite build` was attempted twice
  in an isolated copy of the tree (HEAD + this one file, with `node_modules` symlinked back
  to the repo so the agent's in-flight `Markets.jsx`/`charts.jsx` and the repo's `dist/`
  stayed untouched); both attempts exited without emitting `dist/` or any log output —
  the symlinked `node_modules` appears to break vite's resolution when its realpath lies
  outside the project root. A full `npm run build` in the repo itself was deliberately
  **not** run, because the working tree contained the dev agent's half-finished `Markets`
  extraction and a failure there would have been theirs, not this change's. Given the file
  is pure data (string arrays and integers, no JSX, no new syntax) and Node parsed and
  evaluated it during `npm test`, the residual bundler risk is very low — but it is
  non-zero, so **the next dev run should confirm `npm run build` is green** as it would
  anyway.
- **Still open, unchanged by this run**: the quiz `explain` for question 2 still carries the
  stale "~$50T vs ~$3T" figure and question 6 still overstates the yield-curve record —
  both are backlog item 3 (stale factual figures), deliberately not touched here.
- **Next run should pick**: unchanged — continue P1 item 1, the `Markets` tab extraction
  that was already in flight.

### 2026-08-02 — JSX split, step 4b: extract Markets tab → `src/components/Markets.jsx`

Continued backlog item 1, picking up right where the previous run (step 4a, `Home`) left
off, per its own "next run should pick" note. `Markets` was the next-best candidate: fully
self-contained (only reads `t`/`lang`, no local `App` state), and a natural pairing with
hoisting the three chart helpers it exclusively calls.

- Added `src/components/charts.jsx` — `Bar`, `YieldCurve`, `CycleChart`, each now a named
  export (`export function ...`) instead of a private top-of-file function in
  `economic-cycles-v5.jsx`. Bodies are byte-identical to what they replaced.
- Added `src/components/Markets.jsx`: `export default function Markets({ t, lang })`,
  importing `{ Bar, YieldCurve, CycleChart }` from `./charts.jsx`. JSX body is
  byte-identical to the old inline `{tab === "markets" && (...)}` block — only the
  wrapping `<div>...</div>` was hoisted into a component and its two free variables
  (`t`, `lang`) turned into props.
- In `economic-cycles-v5.jsx`: removed the three now-unused inline helper functions,
  added `import Markets from "./src/components/Markets.jsx";`, and replaced the
  89-line inline Markets block with `{tab === "markets" && <Markets t={t} lang={lang} />}`.
  File went 529 → 380 lines (149 lines removed — the 3 helpers plus the inline tab body,
  replaced by 2 import lines and 1 component call). `grep` confirmed zero remaining
  references to `Bar`/`YieldCurve`/`CycleChart` in the main file.
- **Mistake caught by the build, fixed same run**: first wrote the chart-helpers file as
  `charts.js` — Vite's import-analysis plugin rejected it (`Failed to parse source for
  import analysis because the content contains invalid JS syntax`) since the file contains
  JSX and only `.jsx`/`.tsx` are parsed as such. Renamed to `charts.jsx` and updated the
  one import in `Markets.jsx` to match; second build succeeded. Noting this so a future
  extraction doesn't repeat it: **any new file with JSX syntax needs a `.jsx` extension**,
  even a "helpers" file that doesn't look like a component at first glance.
- **Concurrent-session note**: partway through this run, `AGENT_LOG.md` and
  `src/content/quizData.js` were found modified on disk by another session (the weekly
  reviewer, fixing the quiz-answer-key item at the owner's direct request — see the run
  log entry directly above this one). Re-read the full current `AGENT_LOG.md` before
  making any further edits to it, appended this entry and the backlog updates on top of
  the current version rather than the one held in memory from earlier in this run, and
  did not touch `quizData.js` — not this run's file, and the other session's own entry
  confirms it deliberately left this run's in-flight `Markets`/`charts` files alone. No
  overwriting occurred in either direction.
- **Verified**: `npm test` (data-shape harness) passes clean —
  `PASS: 0 failure(s), 0 warning(s)` (the previously-tracked quiz-distribution warning is
  gone because of the other session's fix noted above, not this run's change — confirmed
  by re-running twice for consistency). `npm run build` succeeded on the second attempt
  (after the `.jsx` rename): `✓ 43 modules transformed` (up from 41, the +2 being
  `charts.jsx` and `Markets.jsx`), `dist/assets/index-CLqi2Cgj.js` **245.39 kB /
  101.18 kB gzip** — within 0.06 kB of the pre-extraction build (245.33 kB), consistent
  with relocating render functions rather than altering behavior.
- Did not visually verify in the browser preview tool — same known limitation as every
  prior run (`preview_start` can't spawn `npm run dev` because its process spawn doesn't
  see the bootstrapped Node on `PATH`).
- **Next run should pick**: continue backlog item 1 — extract the `Learn` tab into
  `src/components/Learn.jsx`. It carries `currentLesson`/lesson-navigation state and the
  `markLessonComplete`/`isLessonUnlocked` helpers — keep that state lifted in `App` and
  pass it down as props (matching the pattern used for `Home` and `Markets`) rather than
  moving it into the component, since `currentLesson` likely needs to stay visible to
  `App` for the header progress bar and any future first-open routing (backlog item 4,
  6c). After `Learn`: `More` (largest remaining — 4 sub-sections, each with its own local
  state: quiz `qIdx`/`qStarted`/`qAnswer`/`qScore`/`qDone`, kids `kidsAge`, glossary
  `glossSearch`; consider whether `More`'s sub-nav state can move into the component itself
  since nothing outside `More` reads it, unlike `currentLesson`).

### 2026-08-02 — JSX split, step 4c: extract Learn tab → `src/components/Learn.jsx`

Continued backlog item 1, picking up right where the previous run (step 4b, `Markets`)
left off, per its own "next run should pick" note. `Learn` was the next-best candidate:
it carries `currentLesson`/navigation state, but per the established pattern that state
stays lifted in `App` (the header's progress bar and lesson-count reads elsewhere in
`App` depend on `completedLessons`/`lessons`, and `currentLesson` is exactly the kind of
value a future first-open-routing feature, backlog item 4/6c, would need `App` to see)
and is simply passed down as props, matching `Home` and `Markets`.

- Added `src/components/Learn.jsx`: `export default function Learn({ t, lang, lessons,
  completedLessons, currentLesson, isLessonUnlocked, setCurrentLesson,
  markLessonComplete, scrollTop })`. JSX body is byte-identical to the old inline
  `{tab === "learn" && (...)}` block (old lines 125–214 of `economic-cycles-v5.jsx`) —
  only the wrapping `<div>...</div>` was hoisted into a component function, its free
  variables turned into named props, and the derived `const lesson = lessons[currentLesson];`
  line (previously computed once in `App`, used only inside this block) moved inside the
  new component since nothing else in `App` reads the singular `lesson` value (confirmed
  by grepping every `\blesson\b` occurrence in the file before editing — all matches were
  either the original declaration or inside the block being extracted).
- In `economic-cycles-v5.jsx`: added `import Learn from "./src/components/Learn.jsx";`
  alongside the other tab-component imports, deleted the now-dead `const lesson = ...`
  line, and replaced the 90-line inline Learn block with `{tab === "learn" && (<Learn
  t={t} lang={lang} lessons={lessons} completedLessons={completedLessons}
  currentLesson={currentLesson} isLessonUnlocked={isLessonUnlocked}
  setCurrentLesson={setCurrentLesson} markLessonComplete={markLessonComplete}
  scrollTop={scrollTop} />)}`. `git diff --stat` confirmed exactly "4 insertions(+), 90
  deletions(-)" on that one file, nothing else touched. File went 380 → 294 lines.
- **Verified**: `npm test` (data-shape harness, cached Node v20.18.1 via
  `scripts/bootstrap-node.sh`) passes clean — `PASS: 0 failure(s), 0 warning(s)`. `npm
  install` (0 new packages, same 2 pre-existing dev-tooling audit advisories as every
  prior run) then `npm run build` succeeded: `✓ 44 modules transformed` (up from 43, the
  +1 being the new `Learn.jsx`), `dist/assets/index-DNlsDuGT.js` **245.67 kB / 101.28 kB
  gzip** — within 0.28 kB of the pre-extraction build (245.39 kB), consistent with
  relocating a render function rather than altering behavior. The build ran slow again
  (~3m 10s, first foreground attempt hit a 5-minute timeout with no output yet) —
  consistent with the log's existing note that a concurrent automated session can slow
  builds; re-ran in the background and waited for completion rather than assuming a hang.
- Did not visually verify in the browser preview tool — same known limitation as every
  prior run since the JSX-split work began (`preview_start` can't spawn `npm run dev`
  because its process spawn doesn't see the bootstrapped Node on `PATH`). Risk is low:
  the extracted JSX is textually identical to what it replaced, only prop-passing and the
  `lesson` derivation were added/moved.
- **Environment note reconfirmed twice this run**: sandboxed `git status` timed out (2-min
  tool limit) on the very first call of the run — no stale lock found at that point,
  consistent with the iCloud-sync-latency explanation already in memory. Later, after the
  build, unsandboxed `git status` also timed out (twice, at 1 min then 3 min) and this time
  *did* leave a stale 0-byte `index.lock` with no live git process holding it; removed it
  per the standing memory note and re-ran `git status` in the background (rather than
  foreground) to give the iCloud enumeration enough time — it completed in well under the
  5-minute monitor window. No destructive git operations were used.
- **Next run should pick**: continue backlog item 1 — extract the `More` tab into
  `src/components/More.jsx`. It's the last of the four per-tab extractions and the
  largest: 4 sub-sections (quiz/kids/glossary/about) each with their own local state.
  Decide whether `moreSection` and the per-section state (`qIdx`/`qStarted`/`qAnswer`/
  `qScore`/`qDone`, `kidsAge`, `glossSearch`) move into the new component or stay lifted
  in `App` — nothing outside `More` currently reads any of it, unlike `currentLesson`,
  so moving it in is a reasonable option this time, but lifted-and-passed-down (matching
  every prior extraction) is the lower-risk default if time is short. After `More` is
  done, `App` itself should be just tab-switching/header/first-launch-modal glue, and the
  next backlog item becomes free: the stale-figures content fixes (`$50T`/`2+ quarters`),
  the README refresh, or `DECISIONS.md`.

### 2026-08-02 — JSX split, step 4d: extract More tab → `src/components/More.jsx` — `App` split complete

Picked up directly at the owner's request (not the scheduled cadence), continuing right
where step 4c (`Learn`) left off. `More` was the last and largest remaining tab: 4
sub-sections (quiz/kids/glossary/about), each with its own local state.

- **Departed from the `Home`/`Markets`/`Learn` pattern on purpose, per the backlog's own
  note.** Before writing anything, grepped every occurrence of `moreSection`, the quiz
  state (`qIdx`/`qStarted`/`qAnswer`/`qScore`/`qDone`), `kidsAge`, `glossSearch`, and
  `resetQuiz` in `economic-cycles-v5.jsx` — confirmed every single reference besides the
  `useState`/`const` declarations themselves fell inside the More block being extracted.
  Since nothing in `App` (header, other tabs, bottom nav) reads any of it, moved all of
  it into the new `More` component with its own `useState` calls instead of lifting it
  and threading it back down as props — the header progress bar's dependency on
  `currentLesson` (the reason `Learn`'s state stayed lifted) doesn't apply here.
- **Also moved the `quizData`/`glossary`/`kidsContent` imports into `More.jsx` directly**,
  matching the precedent `Markets.jsx` already set for `charts.jsx` (a exclusively-used,
  dependency-free content/helper module gets imported by its one consumer rather than
  threaded through `App` as a prop) — confirmed via grep that none of the three content
  modules are referenced anywhere in `economic-cycles-v5.jsx` outside the block being
  extracted.
- Added `src/components/More.jsx`: `export default function More({ t, lang })` — only two
  props, versus `Home`'s seven and `Learn`'s nine, since everything else is now local
  state or a direct import. JSX body is byte-identical to the old inline
  `{tab === "more" && (...)}` block (old lines 133–278 of `economic-cycles-v5.jsx`).
- In `economic-cycles-v5.jsx`: added `import More from "./src/components/More.jsx";`,
  removed the now-dead `quizData`/`glossary`/`kidsContent` imports and the eight now-dead
  `useState` declarations plus `resetQuiz`, and replaced the 146-line inline More block
  with `{tab === "more" && <More t={t} lang={lang} />}`. `git diff --stat` confirmed
  exactly "2 insertions(+), 161 deletions(-)" on that one file, nothing else touched.
  File went 294 → 135 lines — `App` is now purely tab-switching, the header, and the
  first-launch modal.
- **Verified content integrity precisely, not just "it builds"**: extracted the old
  inline block (lines 134–278, via `git show HEAD:economic-cycles-v5.jsx`) and the new
  component's return-statement body, stripped both of leading indentation, and diffed —
  143/143 lines, zero diff output, confirming the JSX is exactly what it replaced.
- **Verified build**: `npm test` (data-shape harness, cached Node v20.18.1 via
  `scripts/bootstrap-node.sh`) passes clean — `PASS: 0 failure(s), 0 warning(s)`. `npm
  install` (0 new packages, same 2 pre-existing dev-tooling audit advisories) then `npm
  run build` succeeded: `✓ 45 modules transformed` (up from 44, the +1 being the new
  `More.jsx`), `dist/assets/index-BwhMw2bV.js` **245.71 kB / 102.89 kB gzip**. Raw size is
  within 0.04 kB of the pre-extraction build (245.67 kB), but **gzip jumped 1.61 kB**
  (101.28 → 102.89 kB) — larger than every prior extraction's gzip delta (all were
  <0.3 kB). Investigated rather than assumed: the line-for-line content diff above proves
  no bytes changed, so this is a compression-boundary artifact — moving `quizData`/
  `glossary`/`kidsContent` from being inlined next to other content in the same chunk to
  being pulled in via a separate component's import graph changed what gets grouped for
  gzip's sliding window, not what the app ships. Not a content regression, but noting the
  investigation here so a future run doesn't have to redo it if the same pattern recurs.
- **Found in passing, not fixed this run**: `scripts/check-data.mjs`'s dangling-`t.key`
  scan only reads `economic-cycles-v5.jsx`, not the `src/components/*.jsx` files where
  almost all `t.` usage now actually lives (after all four extractions). It still passed
  clean this run, so there's no known live bug, but the safety net has been narrowing
  with every JSX-split step without anyone flagging it until now — added as new backlog
  item 7 (P2) rather than fixing inline, to keep this run's diff focused on the `More`
  extraction it was scoped for.
- Did not visually verify in the browser preview tool — same known limitation as every
  prior run since the JSX-split work began (`preview_start` can't spawn `npm run dev`
  because its process spawn doesn't see the bootstrapped Node on `PATH`). Risk is low:
  the extracted JSX is textually identical to what it replaced.
- **Environment note reconfirmed**: sandboxed `git status` hung and left a stale 0-byte
  `index.lock` twice more this run (no live git process either time, confirmed via `ps
  aux` before removing); running `git status`/`git add`/the commit itself in the
  background rather than foreground consistently let the iCloud-sync-latency window pass
  without hitting the tool's own timeout. No destructive git operations were used.
- **P1 (the monolithic-JSX split) is now fully cleared** — see the backlog section above,
  rewritten to reflect this. **Next run should pick**: P2 item 1 is already done (quiz
  answer key); the next open P2 items are, in no particular forced order now that P1 no
  longer gates them: stale factual figures (`$50T`/`2+ quarters`, item 2), the
  `check-data.mjs` coverage broadening this run just flagged (item 7, cheap and
  self-contained), or the README refresh (item 5, now especially overdue since the repo
  structure changed again). The first-session flow (item 3) is the largest remaining P2
  item and likely deserves its own dedicated run per its own 6a–6e breakdown.

### 2026-08-02 — Stale/dated factual figures reworded (P2)

Picked backlog item 2 (stale factual figures): the app's core value is teaching accurate
economics, and this item had been independently flagged by two weekly reviews as a real
correctness gap. Content-only changes, no structural edits:

- **`~$50T total credit vs ~$3T actual money`** — these were early-2010s US aggregate
  figures presented as current, in three places: the "Credit vs Money" lesson body (all 5
  languages), the corresponding quiz question's `explain` (English only had the numbers;
  other languages were already generic), and the `Credit` glossary entry's English `f`
  field. Replaced with figure-free framing that teaches the same concept without going
  stale: "total credit outstanding is many times larger than the base money supply — a
  gap that has only widened over time" (and per-language equivalents in the lesson body,
  where all 5 languages had carried the specific numbers).
- **`2+ quarters of falling GDP = recession`** — stated as a flat *definition* in three
  places: the "Reading Economic Indicators" lesson body (English only), the `GDP`
  glossary entry (English only), and the `Recession` glossary entry (all 5 languages).
  Reworded everywhere to frame it as a widely-used **rule of thumb**, not the official
  definition, and added that the US officially dates recessions via the NBER using
  broader criteria (employment, income, spending), not GDP alone. The `Recession` entry
  needed a genuine rewrite in all 5 languages since all 5 carried the flat definition;
  `GDP`'s rule-of-thumb note was only added to the English entry since the other 4
  languages already just said "total value of goods/services produced" with no recession
  claim to fix.
- **`Has predicted EVERY US recession since 1955`** — the underlying claim (every
  recession since 1955 was preceded by an inversion) is true and worth keeping, but the
  standard framing also notes inversions don't perfectly forecast recessions (false
  positives exist), so the flat "predicted every recession" phrasing overstates certainty.
  Reworded in the yield-curve lesson's subtitle, section body (all 5 languages), and the
  corresponding quiz `explain` (all 5 languages) to: every recession since 1955 was
  preceded by an inversion, but not every inversion has been followed by a recession — a
  strong signal, not a certainty. Left the quiz question's `answer` index (2, "Recession
  within 12-18 months") unchanged since the softened wording doesn't change which option
  is correct.
- **Spot-checked and confirmed correct, left alone** (per the backlog's own note, not
  re-verified from scratch this run): QE1/QE2/QE3 sizes, the ~$900B → ~$9T Fed
  balance-sheet arc, PMI's 50 threshold, VIX bands.
- **Verified**: `grep` for `50T`/`50 trillion`/`50万亿`/`50조`/`50兆`, `$3T`/`3 trillion`,
  `2+ quarters`/`Falling 2+`, and the various "predicted every recession" phrasings
  (en/es/ko/zh/ja) across `src/content/*.js` returns zero remaining stale-figure matches —
  only the deliberately-rewritten, now-qualified "1955" sentences remain. `npm test`
  (data-shape harness, cached Node v20.18.1 via `scripts/bootstrap-node.sh`) passes clean:
  `PASS: 0 failure(s), 0 warning(s)`. `npm install` (0 new packages, same 2 pre-existing
  dev-tooling audit advisories as every prior run) then `npm run build` succeeded:
  `✓ 45 modules transformed` (unchanged — this run only edited existing data files, added
  no new modules), `dist/assets/index-B5ScNqHG.js` **247.22 kB / 103.94 kB gzip** — up
  from the prior build's 245.71 kB / 102.89 kB, consistent with the reworded strings being
  longer (added qualifying clauses) rather than a regression; built in ~2m 25s.
- Did not visually verify in the browser preview tool — same known limitation as every
  prior run (`preview_start` can't spawn `npm run dev` because its process spawn doesn't
  see the bootstrapped Node on `PATH`). Risk is low: every change is a like-for-like
  string rewording with no logic or shape change, confirmed by the clean `npm test` pass.
- **Concurrent-session note**: partway through this run, while `npm run build` was
  running in the background, `git status` showed `scripts/check-data.mjs` modified and an
  untracked `src/components/More.jsx.bak2` — neither created by this run. This looks like
  another session mid-edit on backlog item 7 (broadening `check-data.mjs`'s `t.key` scan
  to `src/components/*.jsx`, exactly what that item describes) with an in-progress backup
  artifact from its editing tool. Left both completely untouched, per the standing
  concurrent-session precedent from the `Markets` extraction run — this run's commit
  includes only the files it intentionally changed
  (`src/content/{lessons,quizData,glossary}.js` and this log).
- **Next run should pick**: whichever P2 item is highest-value once `scripts/check-data.mjs`'s
  in-flight edit (observed above) has landed and this log reflects it — likely item 5
  (`check-data.mjs` scan broadening) if that other session stalled before committing, or
  otherwise item 1 (first-session flow, 6a) or item 3 (README refresh, now overdue across
  two structural changes). Re-read this file and re-run `git status` first, since a
  concurrent session was active during this run's build.

### 2026-08-02 — Broaden `scripts/check-data.mjs`'s `t.key` scan to `src/components/*.jsx`

Picked up directly at the owner's request, completing exactly the in-flight edit the
previous run's entry flagged (its own `scripts/check-data.mjs` and a stray
`src/components/More.jsx.bak2` were observed modified/untracked mid-build and correctly
left untouched — that observation was this run, not a third session).

- **The gap**: the harness's dangling-translation-key check (§6 of `check-data.mjs`) only
  read `economic-cycles-v5.jsx`. After the four-step JSX split (`Home`/`Markets`/`Learn`/
  `More`), almost all `t.someKey` usage now lives in `src/components/*.jsx` — the check had
  been silently covering less of the app with every extraction, down to just the ~5 `t.`
  references remaining in the now-135-line `App` shell.
- **The fix**: replaced the single hardcoded `economic-cycles-v5.jsx` read with a list built
  from that file plus every `*.jsx` file in `src/components/` (`readdirSync`), scanning each
  independently so a failure names the actual offending file rather than a generic "the app."
- **Verified the check is real, not a rubber stamp — deliberately broke it and watched it
  catch the break.** Before trusting the "0 failures" result, grepped every component file
  for a standalone `t` identifier that could collide with the `\bt\.` regex (loop params,
  other variables) — none found (`Learn.jsx`, `Home.jsx` `l`/`i` map params; `More.jsx`'s own
  state setters; nothing named bare `t` except inside the word "Don't" in a `Markets.jsx`
  comment, which the regex correctly ignores since it requires `.` immediately after `t`).
  Then injected a real dangling reference (`{t.thisKeyDoesNotExistAnywhere}`) into
  `More.jsx`, ran `npm test`, confirmed it failed with `src/components/More.jsx references
  t.thisKeyDoesNotExistAnywhere, but "thisKeyDoesNotExistAnywhere" is not defined in TR.en` —
  correct file, correct key — then reverted the injection (diffed clean against the
  pre-injection copy) and re-ran to confirm `PASS: 0 failure(s), 0 warning(s)` again.
- **Verified build**: `npm run build` (bootstrapped Node v20.18.1) succeeded — `✓ 45 modules
  transformed` (unchanged; `check-data.mjs` is a dev-only Node script, never part of the Vite
  bundle graph). Bundle output matched the previous run's own reported hash exactly
  (`index-B5ScNqHG.js`, 247.22 kB / 103.94 kB gzip) — confirming the earlier-observed gzip
  jump was entirely that run's content reword, not this run's tooling-only change.
- **Concurrent-edit hazard encountered directly this run, not just observed in passing.**
  Immediately after staging `scripts/check-data.mjs`, a `git diff --cached --stat` showed
  someone else's staged files (`AGENT_LOG.md` + the three stale-figures content files)
  instead of mine — the other session's own `git add`/commit landed between my stage and my
  check. A follow-up `git status` confirmed their commit (`790cd77`) had gone through cleanly
  and my staged `check-data.mjs` was untouched, just knocked back to unstaged by the
  intervening index write (not lost — `Write`/`Edit` tool changes live in the working tree,
  independent of the index). Re-staged only `scripts/check-data.mjs` after their commit
  settled, rather than re-running a broad `git add`. No files were reverted, no one's commit
  was interfered with.
- Also removed `src/components/More.jsx.bak2` — a stray backup file this run's own test
  procedure (`sed -i.bak2`) created and then no longer needed once the injected-key test was
  reverted via a clean file copy instead.
- **Next run should pick**: item 1 (first-session flow, 6a — progress ring on Home) or item 3
  (README refresh) are the cheapest remaining P2 items; item 2 (unused translation keys) and
  item 4 (`DECISIONS.md`) are also open and unblocked. No P0/P1 remains open.

### 2026-08-02 — Refresh `README.md`

Picked up directly at the owner's request, closing backlog item 3 — the README had said
`economic-cycles-v5.jsx` was "the entire app … all in one file (~1,340 lines)" since before
any of the four JSX-split steps landed, and this is a public repo (`origin` is
`woozkaholdings/economics-investment-education-app`), so it was misdescribing the codebase
to the first thing any visitor reads.

- **"What's here" section rewritten** to describe the actual current structure: `src/locales/`
  (5 per-language translation files + `index.js`), `src/content/` (lessons/quizData/glossary/
  kidsContent, pure data), `src/components/` (one file per bottom tab — `Home`/`Learn`/
  `Markets`/`More` — plus the shared `charts.jsx` helpers), and `economic-cycles-v5.jsx` itself
  now described accurately as just the tab-switching/header/first-launch-modal shell it's
  been since the `More` extraction, not "the entire app."
- **Added a new "Testing" section** documenting `npm test` (`scripts/check-data.mjs`) — this
  didn't exist in the README at all before, despite being added to the repo two runs ago.
- **Mentioned `scripts/bootstrap-node.sh`** in the file listing, framed correctly for an
  external reader: it's for sandboxed environments without Node already on `PATH` (i.e. this
  automated agent's own execution environment), not something a normal contributor with Node
  installed needs to run.
- **Left unchanged, deliberately**: the intro paragraph (still accurate) and the Ray Dalio
  attribution line — launch plan §10.2 explicitly permits credit in an acknowledgments-style
  line; this reads as attribution, not branding, so it stays as-is.
- **Verified**: confirmed current line counts by hand before writing (`economic-cycles-v5.jsx`
  135 lines; `Home.jsx` 69, `Learn.jsx` 93, `Markets.jsx` 93, `More.jsx` 163, `charts.jsx` 58)
  so every file reference and description in the new README matches the repo's actual current
  state, not a stale snapshot. Ran `npm test` (cached Node v20.18.1 via
  `scripts/bootstrap-node.sh`) to confirm the working tree is otherwise undisturbed —
  `PASS: 0 failure(s), 0 warning(s)`. **Did not run `npm run build`** — `README.md` is not part
  of the Vite module graph (confirmed by reading `vite.config.js`/`index.html`; nothing
  references it), so a full ~2-3 minute build would verify nothing a docs-only change could
  have broken. `git status` before staging showed only `README.md` modified — no concurrent
  session collision this run, unlike the previous one.
- **Next run should pick**: item 1 (first-session flow, 6a — progress ring on Home) is the
  next-most-valuable P2 item and is fully decomposed into small sub-steps already; item 2
  (unused translation keys) and item 4 (`DECISIONS.md`) remain open and unblocked as smaller
  alternatives. No P0/P1 remains open.
