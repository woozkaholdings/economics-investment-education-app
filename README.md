# Economic Cycles

A single-page React app teaching economic cycles, credit, and market phases — inspired by the framework popularized by Ray Dalio and other economists. Built as the prototype for a planned Economics & Investment Education mobile/web app (see `Economic_Cycles_Launch_Plan.docx`).

## What's here

- [`economic-cycles-v5.jsx`](economic-cycles-v5.jsx) — the entire app: 5-language translations, 12 sequential lessons, a quiz engine, a kids section, a glossary, and a markets dashboard, all in one file (~1,340 lines). This is the canonical source and should be preserved as the app is gradually refactored into smaller pieces.
- `src/main.jsx` — Vite entry point that mounts the app above.
- `AGENT_LOG.md` — running log of automated development sessions and the prioritized backlog.

## Running locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Building

```bash
npm run build
```

Output goes to `dist/`.

## Status

This is a working prototype, not yet a shippable product. See `AGENT_LOG.md` for the current backlog and `Economic_Cycles_Launch_Plan.docx` for the full launch strategy (tech stack, pricing, roadmap).
