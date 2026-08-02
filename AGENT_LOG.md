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

> **Curated by the weekly review, 2026-08-02** (`reviews/2026-08-02-weekly-review.md`).
> This ordering supersedes previous orderings. **Work P0 items before anything else**, and
> do not start a P2/P3 item while a P1 is open. The 2026-08-02 dev run had already folded
> some review findings in here before this curation; those are kept and re-ranked.

**P1 — the foundation**

1. **[P1] Split the monolithic JSX (launch plan §2.2), continued** — `TR` → `src/locales/*.js` is done (2026-08-02, see run log). Next extraction: `lessons`, `quizData`, `glossary`, `kidsContent` → `src/content/*.js`, then split `App` into per-tab components (`Home`, `Learn`, `Markets`, `More`) under `src/components/`. **One extraction per run**, `npm run build` verified after each, content and behavior preserved exactly. Suggested next step: `lessons` (largest single content block, lines 17–504 of `economic-cycles-v5.jsx`) → `src/content/lessons.js`.
2. **[P1] Non-English content parity gap.** Lesson body text in es/ko/zh/ja is a fraction of the English — measured character-count ratios across all 23 lesson body blocks: **es 0.41x, ko 0.24x, ja 0.18x, zh 0.15x**. Whole paragraphs exist only in English. This is missing content, not rough phrasing. Per launch plan §3.5 the v1 fix is **not** to translate everything — it is to **label es/ko/zh/ja "Beta" in the language picker** and not market them until a native speaker reviews each. Do that; keep the ratios recorded here so the gap stays visible.

**P2 — after the split**

3. **[P2] Data-shape tests.** No test runner exists. As soon as item 1 puts content in modules, add lightweight tests: every lesson/quiz/glossary/kids entry has all 5 language keys; every quiz `answer` index is within its `opts` range; no referenced translation key is undefined. This is what makes an item-2-class gap impossible to reintroduce silently — and a fast check that a 2-minute `vite build` does not give you.
4. **[P2] Stale/dated factual figures.** "total credit ~$50T vs. actual money ~$3T" (early-2010s numbers, far off current US aggregates) and "falling 2+ quarters = recession" stated as a definition in both a lesson body and the `GDP` glossary entry (it's a rule of thumb; US recessions are dated by NBER). Reword. Spot-checked and **correct — leave alone**: QE1/QE2/QE3 sizes, the ~$900B → ~$9T Fed balance-sheet arc, PMI 50 threshold, VIX bands.
5. **[P2] Clean up unused translation keys** — `indicators`, `bestInvest`, `avoidInvest`, `psychology`, `why`, `expansion`, `peak`, `contraction`, `trough`, `expDesc`, `peakDesc`, `contDesc`, `troughDesc` are defined in all 5 languages but nothing renders them (the *rendered* "Best investments" phase language elsewhere in lesson 10 was a different, now-fixed issue — see the 2026-08-02 §10.1 completion entry below; these specific keys were never wired to any UI). Either delete them or build the feature with historical/educational framing and the same disclaimer treatment. Pick one — don't leave this open indefinitely.

**P3 — polish, only after P1 is done**

6. **[P3] Dark mode** (plan §3.4). Do this *after* item 1; against the current inline styles it would just have to be redone.
7. **[P3] Accessibility pass**: screen-reader labels on tab buttons, quiz options, and the language picker; dynamic font-size support; contrast check on the phase colors (plan §3.5). Also add `aria-label`/keyboard-dismiss support to the new first-launch modal (2026-08-02) — it currently has no focus trap or Escape handling.
8. **[P3] Mobile responsiveness check** at 375px — the file is full of fixed `px` values and the product is mobile-first.

**Not yet scheduled — needs decomposing before it can be a run**

9. **[UNSCHEDULED] First-session flow (launch plan §3.2–3.3).** The plan calls the first five minutes "your most important feature": no-signup entry straight into lesson 1, a sub-4-minute lesson 1, a completion animation, a progress ring, a streak prompt. **None of this exists and nothing in the backlog covered it until now.** It belongs after item 1 and is much larger than one run — decompose it into per-run pieces before starting.

**HELD — owner decisions, do not act on these**

10. **[HELD] Expo vs. Vite — needs a human call.** Launch plan §2.2 and §8 (weeks 1–2) specify building on **Expo (React Native)** so web/iOS/Android share one codebase; the 2026-08-01 scaffold run chose **Vite + React (web-only)** instead. That was a reasonable way to make the prototype runnable and the plan does sequence web first, but every further web-only UI change (items 6–8) raises the eventual port cost. The dev agent must **not** migrate to Expo on its own initiative and must **not** deepen the web-only investment beyond items 1–5. Surface this for the project owner to decide.
11. **[HELD] FRED live-data integration for the Markets tab** — explicitly a *post-launch premium feature* per launch plan §2.3. Do not start. The static/educational Markets tab rework shipped 2026-08-02.

**Completed and pruned**

- **JSX split, step 1 (`TR` → `src/locales/*.js`)** — done 2026-08-02, see run log.
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
