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

**P1 — do these in order**

1. **[P1] Label es/ko/zh/ja "Beta" in the language picker** (launch plan §3.5 *and* §10.4). **This is now first — it has been open a week while three larger items went ahead of it, and it is the only launch-blocking accuracy claim currently live in the product.** Non-English lesson body text is a fraction of the English; re-measured 2026-08-02 and unchanged: **es 0.41x, ko 0.24x, ja 0.18x, zh 0.15x** (en 10,565 chars vs es 4,303 / ko 2,511 / zh 1,573 / ja 1,850). Quiz `explain` text shows the same pattern. Note that locale **key** coverage is *perfect* — 83 keys, 0 missing and 0 extra in all four languages — so nothing looks wrong in code review; the gap is purely body-copy volume. The plan's v1 fix is **not** to translate everything: mark the four non-English entries "Beta" in the picker and do not market them until a native speaker reviews each. Keep these ratios recorded here so the gap stays visible. **One run.**
2. **[P1] Finish the content extractions — all three in ONE run** (launch plan §2.2, continued). `quizData` (lines 17–57), `glossary` (62–80), and `kidsContent` (85–116) → `src/content/*.js`. **The "one extraction per run" rule is retired for these three**: they are ~95 lines combined and use a mechanical pattern already proven twice on much larger blocks. Same verification standard as before — byte-exact content diff plus `npm run build`. Keep the new modules **pure data** (no imports, no functions, no template literals), as `lessons.js` already is; that is what keeps the eventual JSON conversion trivial.
3. **[P1] Add the data-shape check harness (`npm test`) — before touching `App`.** Promoted from P2. Once item 2 lands, all content lives in modules and this becomes cheap: assert every lesson/quiz/glossary/kids entry has all 5 language keys; every quiz `answer` index is within its `opts` range; **the answer-index distribution is not degenerate** (see item 5 — a naive in-range check passes today's quiz); no referenced translation key is undefined. The weekly review wrote ~20 lines of Node that runs in under a second and produced real signal; a 2-minute `vite build` proves the JSX parses, not that a Korean lesson still renders. **This must be green before item 4 starts.**
4. **[P1] Split `App` into per-tab components** — `Home`, `Learn`, `Markets`, `More` under `src/components/`, plus the `Bar`/`YieldCurve`/`CycleChart` helpers. `App` is now lines 183–692 (~510 lines) and this is the genuinely risky half of §2.2. **One tab per run**, item 3's checks green after each.

**P2 — after P1 is clear**

5. **[P2] Fix the quiz answer key.** Found by the 2026-08-02 review: `quizData` answer indices are `0,0,0,0,0,0,0,0,0,3,0,0,0` — **12 of 13 correct answers are option 0**, so a user who always taps the first option scores 92% without reading. Every index is in range, so this is a content-design defect, not a data defect. Shuffle the *stored* answer positions (reorder `opts` and update `answer`) — do not shuffle at render time, because the `explain` text references option content.
6. **[P2] Stale/dated factual figures.** Wider than previously recorded. **"~$50T total credit vs ~$3T actual money"** (early-2010s numbers, far off current US aggregates) appears in a lesson body, a quiz `explain`, **and** the `Credit` glossary entry. **"2+ quarters of falling GDP = recession"** is stated as a *definition* in a lesson body, the `GDP` glossary entry, **and** the `Recession` glossary entry — it is a rule of thumb; US recessions are dated by the NBER on broader criteria. Also reword the quiz claim that inverted yield curves "have predicted every US recession since 1955" — the pattern is real but the standard framing acknowledges false positives. Spot-checked and **correct — leave alone**: QE1/QE2/QE3 sizes, the ~$900B → ~$9T Fed balance-sheet arc, PMI 50 threshold, VIX bands.
7. **[P2] First-session flow (launch plan §3.2–3.3) — now decomposed, so it can actually be picked up.** The plan calls the first five minutes "your most important feature" and sequences it as Move 4, right after the §2.2 migration. None of it exists. Take these one per run, in order:
   - 7a. **Progress ring on Home** (lessons completed / 12) plus an estimated "≈N min" label on each lesson card.
   - 7b. **Lesson-completion celebration** — a small animation on "Mark Complete" and the ring advancing.
   - 7c. **First-open routing** — with no saved progress, land straight in lesson 1 rather than on Home. (No signup exists to skip, which is already what the plan wants; make it explicit and keep it that way.)
   - 7d. **Streak counter on Home**, localStorage-backed — reuse the `try/catch` pattern already established by `ecycles_seen_disclaimer`.
   - 7e. **One-tap "continue tomorrow" prompt** at lesson end. **localStorage only** — real reminder notifications need the Expo decision (item 11) and must not be started here.
8. **[P2] Clean up unused translation keys** — `indicators`, `bestInvest`, `avoidInvest`, `psychology`, `why`, `expansion`, `peak`, `contraction`, `trough`, `expDesc`, `peakDesc`, `contDesc`, `troughDesc` are defined in all 5 languages but nothing renders them. (The *rendered* "Best investments" phase language in lesson 10 was a different, now-fixed issue — see the §10.1 completion entry below.) Either delete them or build the feature with historical/educational framing and the same disclaimer treatment. Pick one — don't leave this open indefinitely.
9. **[P2] Refresh `README.md` — it now misdescribes the repo, publicly.** It says `economic-cycles-v5.jsx` is "the entire app … all in one file (~1,340 lines)"; the file is 692 lines and the translations and lessons live in `src/locales/` and `src/content/`. `origin` is a public GitHub repo (`woozkaholdings/economics-investment-education-app`), so this is the first thing a visitor reads. Update the structure description, mention `scripts/bootstrap-node.sh` under "Running locally", and **fold this into whichever run changes the structure next** rather than spending a whole run on it. The Ray Dalio attribution line stays — launch plan §10.2 explicitly permits credit in an acknowledgments line; keep it as attribution, never as branding.
10. **[P2] Add `DECISIONS.md`** — launch plan Move 1 asks for a decision log and this file is a *work* log, not serving that purpose. Small: record the Expo-vs-Vite choice and its status, the `.js`-not-JSON content format and why, and the localStorage-only progress approach. One short run.

**P3 — polish, only after P1 and P2**

11. **[P3] Triage `npm audit`.** `npm install` reports advisories and suggests `npm audit fix --force` (breaking changes). Only Vite and React are direct dependencies, so this is probably transitive dev-tooling noise that never ships to users — but nobody has looked. Run `npm audit`, record the actual counts here, then either fix or write down why not. **Do not run `--force`.**
12. **[P3] Dark mode** (plan §3.4). After item 4 — against the current inline styles it would just have to be redone.
13. **[P3] Accessibility pass**: screen-reader labels on tab buttons, quiz options, and the language picker; dynamic font-size support; contrast check on the phase colors (plan §3.5). Also add `aria-label`/keyboard-dismiss support to the first-launch modal — it currently has no focus trap or Escape handling.
14. **[P3] Mobile responsiveness check** at 375px — the file is full of fixed `px` values and the product is mobile-first.

**HELD — owner decisions, do not act on these**

15. **[HELD] Expo vs. Vite — needs a human call, and it is now closer to the critical path.** Launch plan §2.2 and §8 (weeks 1–2) specify building on **Expo (React Native)** so web/iOS/Android share one codebase; the 2026-08-01 scaffold run chose **Vite + React (web-only)** instead. That was a reasonable way to make the prototype runnable and the plan does sequence web first, but every further web-only UI change raises the eventual port cost — and item 7 is a large one. The dev agent must **not** migrate to Expo on its own initiative and must **not** deepen the web-only investment beyond items 1–10. Surface this for the project owner to decide.
16. **[HELD] FRED live-data integration for the Markets tab** — explicitly a *post-launch premium feature* per launch plan §2.3. Do not start. The static/educational Markets tab rework shipped 2026-08-02.

**Completed and pruned**

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
