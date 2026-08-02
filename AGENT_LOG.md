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
- **Markets dashboard** — yield curve shapes, Fed balance sheet (QE/QT) narrative, rate-change effects on assets. Currently hardcodes `nowDate: "February 2026"` in every language — a stale-data problem flagged in the launch plan (Section 2.3).
- Helper chart components (`Bar`, `YieldCurve`, `CycleChart`) are plain inline-styled SVG/divs, no charting library dependency.

There was no `package.json`, no bundler, and no way to actually run the app before this run. `Economic_Cycles_Launch_Plan.docx` (see `working_files/Economic_Cycles_Launch_Plan.pdf` for the same content as images) is a full launch playbook: Expo/React Native + Supabase + RevenueCat + PostHog stack, freemium pricing ($6.99/mo, $39.99/yr, $79.99 lifetime), a 16-week roadmap, and — importantly — a "Blindspot Register" (Section 10) flagging legal/compliance risks in the *current content* that should be fixed before anything else:

1. **10.1 Investment-advice adjacency**: lessons include "Best Investments" / "Avoid" per cycle phase — must stay general/historical, never personalized, plus needs a plain-language "educational, not investment advice" disclaimer.
2. **10.2 Dalio dependency**: the app directly quotes Ray Dalio (`dalioQuote` in every language) and credits him by name — legal/platform risk; should be reframed as "principles popularized by economists and investors" with quotes removed.
3. **10.3 Kids content / COPPA**: a kids section aimed at ages 5-17 can make the whole app "child-directed" under COPPA, restricting data collection and ads. Should be reframed as a parent-facing "teach your kids" feature rather than a child-facing mode.

The launch plan explicitly calls resolving 10.1–10.3 "your first five moves," ahead of any refactor or new feature.

## Prioritized backlog

Ordered by the launch plan's own priority (legal/compliance first, since it's cheap and de-risks everything else) and by what unblocks future runs.

1. **[MED] Markets tab stale date (launch plan §2.3)**: replace hardcoded `nowDate: "February 2026"` (and the "Current State" framing that implies live data) with an explicitly educational framing that doesn't imply real-time data, per the plan's zero-cost recommended option.
2. **[MED] Split the monolithic JSX (launch plan §2.2)**: extract `TR`, `lessons`, `quizData`, `glossary`, `kidsContent` into `src/content/*.json` or `src/content/*.js` data modules, and split `App` into per-tab components (`Home`, `Learn`, `Markets`, `More`) under `src/components/`. Do this incrementally over several runs — one section at a time — verifying `npm run build` after each extraction so the app never breaks. Preserve all existing content and behavior exactly.
3. **[MED] Dark mode**: the launch plan notes finance audiences skew toward dark mode and recommends shipping it from day one. Add a theme toggle + dark color tokens once the monolith split makes styling more tractable (or do a lighter-weight pass directly on the current inline styles if that's faster).
4. **[LOW-MED] Accessibility pass**: add screen-reader labels to interactive elements (tab buttons, quiz options, language picker), verify dynamic font-size support, check color contrast on the phase colors used throughout.
5. **[LOW-MED] Mobile responsiveness check**: verify the fixed-width inline styles (many `px` values) hold up at small viewport widths (375px); the app targets mobile-first per the launch plan.
6. **[LOW] Basic tests**: no test runner exists yet. Once content is split into data modules, add lightweight tests validating data shape (e.g., every lesson has all 5 languages, every quiz question's `answer` index is valid) — cheap, high-value regression protection for a content-heavy app.
7. **[LOW] FRED live-data integration for Markets tab**: explicitly a *post-launch premium feature* per the launch plan (§2.3) — do not build until the static/educational Markets tab (item 1) is done and the core app has users.
8. **[LOW] Clean up unused translation keys**: `TR` still defines `indicators`, `bestInvest`, `avoidInvest`, `psychology`, `why`, `expansion`, `peak`, `contraction`, `trough`, `expDesc`, `peakDesc`, `contDesc`, `troughDesc` in every language, but nothing in the current `App` component renders them (confirmed via grep during the 2026-08-01 blindspot-fix run — the "Best Investments"/"Avoid" grid the launch plan describes doesn't actually exist in this version of the UI). Either remove the dead keys or build the feature properly with historical/educational framing (not personalized advice) and the same disclaimer treatment as the rest of the Markets tab.

## Environment note

This automated execution environment has **no Node.js in `PATH`** (confirmed 2026-08-01 — no `node`, `npm`, `nvm`, `volta`, `asdf`, or Homebrew present). To verify `npm install && npm run build` for the scaffold introduced today, the agent downloaded a portable Node.js v20.18.1 (darwin-x64) tarball from the official `nodejs.org` distribution into the session scratchpad (outside the repo) and used it locally, without any system-wide install. Future runs should do the same if `node`/`npm` aren't found in `PATH`, rather than skipping build verification.

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
