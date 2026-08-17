# Economic Cycles

A React app teaching personal money skills and economic cycles, built as the prototype for a planned Economics & Investment Education mobile/web app. The framing is deliberately generic — principles popularized by economists and investors, with no name-brand dependency or quoted author (`LAUNCH_PLAN.md` §10.2). It is educational content, not investment advice, and every screen that discusses markets says so. See [`LAUNCH_PLAN.md`](LAUNCH_PLAN.md) for the authoritative plan; `Economic_Cycles_Launch_Plan.docx` is the superseded original.

## What's here

The app was rebuilt from a single-file prototype on 2026-08-04. `economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` at the repo root are reference material only — gitignored, and imported by nothing under `src/`.

- `src/App.jsx` — the shell: three bottom tabs (Learn, Review, Reference), the pushed lesson-reader view, the language picker, and the first-run disclaimer modal.
- `src/screens/` — `Learn.jsx` (the lesson path), `LessonReader.jsx`, `Practice.jsx` (the spaced-review queue), and `Reference.jsx` with its sub-screens under `src/screens/reference/`.
- `src/components/` — `ui.jsx` (Text/Card/Button/Note/Segmented primitives), `charts.jsx`, `Icon.jsx`, `LessonVisual.jsx`, `Question.jsx`, `PolicySim.jsx`, `GlossaryTerms.jsx`.
- `src/lib/` — pure logic, no JSX: `useAppState.js`, `storage.js`, `review.js` (the Leitner scheduler), `deepLink.js` (hash routes), `useMarketData.js`, `analytics.js`.
- `src/content/` — plain `.js` data modules, 5-language parity enforced by `npm test`: `lessons.js` (40 lessons across a money and an economy track — metadata only), the ten `lessonContent.<track>.<lang>.js` body-text files, `quizData.js`, `glossary.js`, `kidsContent.js`. No JSX, no JSON (see `DECISIONS.md`).
- `src/locales/` — `en.js`/`es.js`/`ko.js`/`zh.js`/`ja.js`, each the full translation dictionary for one language, plus `index.js` re-exporting them as `TR`.
- `src/main.jsx` — Vite entry point that mounts `App`.
- [`AGENT_LOG.md`](AGENT_LOG.md) — running log of automated development sessions and the prioritized backlog.
- `scripts/` — the checks `npm test` runs (see Testing below), plus `scripts/bootstrap-node.sh`, which downloads a pinned, cached Node runtime for sandboxed environments that don't already have Node on `PATH`. Not needed if you already have Node installed locally.

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

Runs `scripts/check-data.mjs`, a fast (~5s) structural check over `src/locales/` and `src/content/`: every language has the same translation keys, every lesson/quiz/glossary/kids entry is present and non-empty in all 5 languages, quiz answers are in range, and every `t.someKey` reference anywhere under `src/` resolves to a real translation key. Catches a missing language field or a dangling reference without needing a browser.

`npm test` then chains four more checks: `scripts/check-blindspot.mjs` (the `LAUNCH_PLAN.md` §10 content rules), `scripts/check-claims.mjs` (`CLAIMS.md`'s §9.1 register), `scripts/check-backlog.mjs` (`AGENT_LOG.md`'s item numbering), and `scripts/refresh-readiness.mjs --check`, which recomputes `LAUNCH_READINESS.md`'s catalogue and translation-volume figures from the content and fails if the document disagrees. Run `npm run readiness` to print those figures, or `npm run readiness -- --write` to update the document after a content change.

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Status

This is a working prototype, not yet a shippable product. See [`AGENT_LOG.md`](AGENT_LOG.md) for the current backlog, [`LAUNCH_READINESS.md`](LAUNCH_READINESS.md) for which launch gates are actually met, and [`LAUNCH_PLAN.md`](LAUNCH_PLAN.md) for the full launch strategy (tech stack, pricing, roadmap).
