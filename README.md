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

`npm test` then chains four more checks: `scripts/check-blindspot.mjs` (the `LAUNCH_PLAN.md` §10 content rules), `scripts/check-claims.mjs` (`CLAIMS.md`'s §9.1 register), `scripts/check-backlog.mjs` (`AGENT_LOG.md`'s item numbering), and `scripts/refresh-readiness.mjs --check`, which recomputes `LAUNCH_READINESS.md`'s catalog and translation-volume figures from the content and fails if the document disagrees. Run `npm run readiness` to print those figures, or `npm run readiness -- --write` to update the document after a content change.

## Building

```bash
npm run build
```

Output goes to `dist/` — a plain folder of static files. There is no server side: no Node at
runtime, no API key, no environment variable, and no database. Anything that can serve a
directory over HTTP can host it.

## Deploying

**Nothing has ever been deployed.** As of 2026-08-17 there is no host, no URL, and no
evidence that anyone outside this repo has opened the app — see `AGENT_LOG.md` backlog item
72. The build is ready; choosing where to put it is an owner decision, so the steps below
are written as clicks rather than as a script.

### Fastest path to a live URL (a few minutes, no account needed to start)

1. `npm run build` locally.
2. Open <https://app.netlify.com/drop>.
3. Drag the whole `dist/` folder onto the page.
4. It returns a URL like `https://<random-words>.netlify.app` — that is the app, live.
   Sign in and claim the site if you want to keep or rename that URL — an unclaimed drop is
   meant for a quick look, not as an address to hand out. (These are Netlify's steps, checked
   against their documented Drop flow, not run from this repo.)

### Durable path (a real address, re-deployable)

GitHub Pages, Cloudflare Pages or Netlify connected to the repo all work unchanged. On
GitHub Pages a *project* site serves from `https://<user>.github.io/<repo>/` — one directory
down from the domain root — which is exactly the case `vite.config.js`'s `base: "./"` exists
to handle. Do not change that setting to make a path "look right"; it is what lets the same
`dist/` work at a root and under a sub-path without being rebuilt.

**No SPA rewrite rule is needed on any host.** Routing is hash-based (`src/lib/deepLink.js`),
so every screen and every lesson deep link — `#/learn`, `#/lesson/12`, `#/reference` — is the
one `index.html` the server already returns. The usual "redirect all paths to /index.html"
configuration that static React deploys need does not apply here, which is why this repo has
no `netlify.toml`, `vercel.json` or workflow file.

<!-- path-ok: vercel.json — named in order to say this repo does NOT have it. Hash routing means no host needs an SPA rewrite rule, so there is nothing for a host config file to say; if this path ever resolves, the sentence above is what needs rewriting, not this marker -->

### After it is up

- **Market data freezes at build time.** `public/data/market.json` is written on this machine
  by the `economics-app-market-data` scheduled job; a deployed copy is a snapshot. After
  `STALE_AFTER_DAYS` (4 days, `src/lib/useMarketData.js`) the Sector-performance and
  Market-signals figures stop being shown rather than being shown as current — by design
  (`LAUNCH_PLAN.md` §2.3). Keeping them live means re-deploying after the job runs; a
  deployment left alone simply degrades to the rest of the app, which is fully static.
- **Nothing measures usage yet.** `src/lib/analytics.js` has call sites but no provider, so
  `sink()` writes to `localStorage` on one device. Picking a provider and holding the key is
  the other open owner action (`AGENT_LOG.md` item 18); until then, a URL tells you the app
  loads, not whether anyone used it.

## Status

This is a working prototype, not yet a shippable product. See [`AGENT_LOG.md`](AGENT_LOG.md) for the current backlog, [`LAUNCH_READINESS.md`](LAUNCH_READINESS.md) for which launch gates are actually met, and [`LAUNCH_PLAN.md`](LAUNCH_PLAN.md) for the full launch strategy (tech stack, pricing, roadmap).
