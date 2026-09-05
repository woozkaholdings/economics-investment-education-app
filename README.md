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

**LIVE since 2026-09-05: <https://magnificent-mochi-73aecc.netlify.app>**

Netlify project `magnificent-mochi-73aecc`, site id `e485658b-2605-499d-86c6-d441e0bd0221`,
owned by the owner's Netlify team. Deployed by dropping a zip of `dist/` on Netlify Drop,
then claimed and set to public. This replaces the "Nothing has ever been deployed" paragraph
that stood here from 2026-08-17 to 2026-09-05.

**Verified the same day, unauthenticated** (plain `curl`, no Netlify session): the site root
returns **200**; the hashed JS bundle under the deployed `assets` directory is **byte-identical**
to the same file in the local build; the deployed market-data JSON serves `asOf 2026-09-04`; and a
made-up asset URL returns **404**, so the 200s are the real files rather than a catch-all. Hash
routing resolves `#/learn` with no rewrite rule, which is what `vite.config.js`'s `base: "./"` is
for. (Asset filenames are content-hashed and change on every rebuild, so they are described here
rather than pinned — a pinned one would be stale after the next deploy.)

⚠️ **The served `index.html` is not byte-identical to the built one, and that is expected.**
Netlify injects one HTML comment and two `<meta>` tags (`hosting-provider`,
`netlify-deploy`) — five lines, no script and no beacon. A diff showing exactly those and
nothing else means the deploy is clean; a diff showing anything more does not.

### To publish an update

1. `npm run build`.
2. Drag `dist/` (or a zip of it) onto the project's Deploys page in Netlify.

Market data freezes at whatever `public/data/market.json` held at build time — see
"After it is up" below.

### How the first deploy actually went — two things the documented Drop flow does not say

Both were measured on 2026-09-05, not read off Netlify's docs, and both surprised the
instructions that used to stand here:

1. **An unclaimed drop is not a public URL.** It is password-protected (the password is
   shown on the drop page) **and it expires about an hour after it is created**. Every path
   returns 401 until it is claimed.
2. **A claimed drop is still not public.** It lands with *Production visibility* set to
   **Private**, so visitors are redirected to a Netlify login. The setting is at
   **Project configuration › General › Visitor access › Edit visibility**, and it has to be
   changed by hand before anyone outside the team can open the site.

### Deploying from scratch somewhere else (a few minutes, no account needed to start)

1. `npm run build` locally.
2. Open <https://app.netlify.com/drop>.
3. Drag the whole `dist/` folder, or a zip of its contents, onto the page.
4. It returns a URL like `https://<random-words>.netlify.app`. Read the two points above
   before treating that URL as live: claim the site, then set visibility to public.

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

<!-- path-ok: economic-cycles-v5.jsx — the owner's local prototype original, GITIGNORED by the 2026-08-16 decision recorded in .gitignore ("ignored, not deleted") — it is on the owner's disk and in git history, and no clone of this repo has it, so this reference must never resolve; restoring the file to the repo would be undoing that decision, not fixing this marker -->
<!-- path-ok: economic-cycles-v6.jsx — the second prototype original, gitignored by the same 2026-08-16 decision and for the same reason; v6 additionally carries the branding that blindspot 10.2 exists to keep out, and hardcoded dates that §2.3 does, so it is deliberately absent from every clone -->
<!-- path-ok: vercel.json — named in order to say this repo does NOT have it. Hash routing means no host needs an SPA rewrite rule, so there is nothing for a host config file to say; if this path ever resolves, the sentence above is what needs rewriting, not this marker -->

### After it is up

- **Market data freezes at build time.** `public/data/market.json` is written on this machine
  by the `economics-app-market-data` scheduled job; a deployed copy is a snapshot. After
  `STALE_AFTER_DAYS` (4 days, `src/lib/useMarketData.js`) the Sector-performance and
  Market-signals figures stop being shown rather than being shown as current — by design
  (`LAUNCH_PLAN.md` §2.3). Keeping them live means re-deploying after the job runs; a
  deployment left alone simply degrades to the rest of the app, which is fully static.
- **Nothing measures usage yet.** `src/lib/analytics.js` has call sites but no provider, so
  events also forward to a real provider once one is named — see **Analytics** below. Until a
  provider is configured, a URL tells you the app loads, not whether anyone used it.

## Analytics

**Off as shipped, and one file turns it on.** `src/lib/analytics.js` has fired
`LAUNCH_PLAN.md` §9.2's event set since 2026-08-05; since 2026-09-05 those events also go to a
provider. `src/lib/analyticsConfig.js` ships with `provider: "none"`, so nothing leaves the
device until someone changes it.

**To turn it on:**

1. Create an account with one provider. **PostHog** is free at this volume and its funnels
   compute §4.3's "≥40% of installers finish lesson 1" gate directly, but it sets a persistent
   id and ships a heavy SDK. A **cookieless** provider (Plausible, Umami) needs no consent
   banner and weighs 1–2 KB, but costs money or measures less. `DECISIONS.md` has the trade in
   full — it is a real choice.
2. Put that provider's **public** site id or ingest key in `src/lib/analyticsConfig.js` and set
   `provider` to `"plausible"`, `"posthog"` or `"custom"`.
3. `npm run build`, then redeploy.

⛔ **Never put a private or personal API key in that file.** It is committed to git and shipped
to every visitor. Providers issue a public *ingest* value (write-only) and a private one (reads
your data); only the first belongs here. The file repeats this warning where the values go.

**What is and is not collected.** Event names plus small scalars — a lesson id, a duration in
seconds, a quiz score. `sanitizeProps` drops anything that is not a number, a boolean, or an
id-shaped string, so prose and typed text cannot leave the device even if a future call site
passes them. No cookie is set and no persistent id is stored; PostHog's required `distinct_id`
is random per page load and held in memory, which means **"unique users" there reads as
"sessions"**.

**Verifying it without a provider account.** Set `provider: "custom"` with `endpoint` pointing
at any local server that accepts a JSON POST, `npm run build`, and open the app: you should see
`app_opened`, `lesson_started`, `quiz_answered`, `quiz_taken` and `lesson_completed` arrive.
That is how the transport was tested — the two payloads §4.3's gate needs (`durationSec` and
`scorePct`) were read off the wire rather than assumed.

## Status

This is a working prototype, not yet a shippable product. See [`AGENT_LOG.md`](AGENT_LOG.md) for the current backlog, [`LAUNCH_READINESS.md`](LAUNCH_READINESS.md) for which launch gates are actually met, and [`LAUNCH_PLAN.md`](LAUNCH_PLAN.md) for the full launch strategy (tech stack, pricing, roadmap).
