# Economic Cycles

A single-page React app teaching economic cycles, credit, and market phases — inspired by the framework popularized by Ray Dalio and other economists. Built as the prototype for a planned Economics & Investment Education mobile/web app (see `Economic_Cycles_Launch_Plan.docx`).

## What's here

The app was originally a single 1,340-line file; it's since been split into content, translation, and component modules, each with a single, obvious place to make a given kind of change:

- [`economic-cycles-v5.jsx`](economic-cycles-v5.jsx) — the top-level `App` component. Now just tab-switching, the header, and the first-launch disclaimer modal; each bottom tab is its own file.
- `src/locales/` — `en.js`/`es.js`/`ko.js`/`zh.js`/`ja.js`, each the full translation dictionary for one language, plus `index.js` re-exporting them as `TR`.
- `src/content/` — `lessons.js` (the 12 sequential lessons), `quizData.js` (the quiz questions), `glossary.js`, `kidsContent.js` (the age-banded kids section). All pure data, no JSX.
- `src/components/` — one file per bottom tab: `Home.jsx`, `Learn.jsx`, `Markets.jsx`, `More.jsx` (which itself holds the quiz/kids/glossary/about sub-sections), plus `charts.jsx` for the shared `Bar`/`YieldCurve`/`CycleChart` chart helpers.
- `src/main.jsx` — Vite entry point that mounts `App`.
- `AGENT_LOG.md` — running log of automated development sessions and the prioritized backlog.
- `scripts/check-data.mjs` — structural checks over the content/locale modules (see Testing below).
- `scripts/bootstrap-node.sh` — downloads a pinned, cached Node runtime for sandboxed environments that don't already have Node on `PATH`. Not needed if you already have Node installed locally.

## Running locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Testing

```bash
npm test
```

Runs `scripts/check-data.mjs`, a fast (~5s) structural check over `src/locales/` and `src/content/`: every language has the same translation keys, every lesson/quiz/glossary/kids entry is present and non-empty in all 5 languages, quiz answers are in range, and every `t.someKey` reference in `economic-cycles-v5.jsx`/`src/components/*.jsx` resolves to a real translation key. Catches a missing language field or a dangling reference without needing a browser.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Status

This is a working prototype, not yet a shippable product. See `AGENT_LOG.md` for the current backlog and `Economic_Cycles_Launch_Plan.docx` for the full launch strategy (tech stack, pricing, roadmap).
