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

1. **[HIGH] Blindspot register content fixes (launch plan §10.1–10.3)**: soften "Best Investments"/"Avoid" language to explicitly historical/educational framing in all 5 languages; add an educational disclaimer (shown once + available in a settings/about area); remove direct Dalio quotes and reframe the attribution as "principles popularized by economists and investors"; reframe the Kids tab copy as parent-facing ("teach your kids") rather than child-facing. Pure content edits, no build risk, highest leverage.
2. **[MED] Markets tab stale date (launch plan §2.3)**: replace hardcoded `nowDate: "February 2026"` (and the "Current State" framing that implies live data) with an explicitly educational framing that doesn't imply real-time data, per the plan's zero-cost recommended option.
3. **[MED] Split the monolithic JSX (launch plan §2.2)**: extract `TR`, `lessons`, `quizData`, `glossary`, `kidsContent` into `src/content/*.json` or `src/content/*.js` data modules, and split `App` into per-tab components (`Home`, `Learn`, `Markets`, `More`) under `src/components/`. Do this incrementally over several runs — one section at a time — verifying `npm run build` after each extraction so the app never breaks. Preserve all existing content and behavior exactly.
4. **[MED] Dark mode**: the launch plan notes finance audiences skew toward dark mode and recommends shipping it from day one. Add a theme toggle + dark color tokens once the monolith split makes styling more tractable (or do a lighter-weight pass directly on the current inline styles if that's faster).
5. **[LOW-MED] Accessibility pass**: add screen-reader labels to interactive elements (tab buttons, quiz options, language picker), verify dynamic font-size support, check color contrast on the phase colors used throughout.
6. **[LOW-MED] Mobile responsiveness check**: verify the fixed-width inline styles (many `px` values) hold up at small viewport widths (375px); the app targets mobile-first per the launch plan.
7. **[LOW] Basic tests**: no test runner exists yet. Once content is split into data modules, add lightweight tests validating data shape (e.g., every lesson has all 5 languages, every quiz question's `answer` index is valid) — cheap, high-value regression protection for a content-heavy app.
8. **[LOW] FRED live-data integration for Markets tab**: explicitly a *post-launch premium feature* per the launch plan (§2.3) — do not build until the static/educational Markets tab (item 2) is done and the core app has users.

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
