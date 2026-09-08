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
- `scripts/` — the checks `npm test` runs (see Testing below), plus `scripts/bootstrap-node.sh`, which prints the `bin` directory to put on `PATH`: your system Node when it is one Vite accepts, otherwise a pinned, cached download for sandboxed environments that have none. Not needed if you already have Node installed locally.

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

`npm test` then chains eight more checks: `scripts/check-blindspot.mjs` (the `LAUNCH_PLAN.md` §10 content rules), `scripts/check-claims.mjs` (`CLAIMS.md`'s §9.1 register), `scripts/check-backlog.mjs` (`AGENT_LOG.md`'s item numbering), `scripts/check-payload.mjs` (bundle size), `scripts/check-measurements.mjs`, `scripts/check-log-size.mjs` (`AGENT_LOG.md`'s size budgets), `scripts/check-market-freshness.mjs` (`public/data/market.json`'s `asOf` against `STALE_AFTER_DAYS`), and `scripts/refresh-readiness.mjs --check`, which recomputes `LAUNCH_READINESS.md`'s catalog and translation-volume figures from the content and fails if the document disagrees. Run `npm run readiness` to print those figures, or `npm run readiness -- --write` to update the document after a content change. (⚠️ **This count has now been wrong twice.** It said "four more" and named four until 2026-09-06; the correction to "seven" was already stale when it was written, because `check-market-freshness.mjs` landed the same day. **The list that cannot go stale is `package.json`'s `test` script** — read it there rather than trusting this sentence.)

### Checking a clean tree

```bash
npm run clean-tree                  # git archive HEAD, then npm test in the copy
npm run clean-tree -- --clone       # same, from a real git clone
```

`npm test` runs against the *working* tree, so an in-flight change can make it red for reasons that have nothing to do with your edit. `scripts/clean-tree.sh` runs the suite against a pristine copy of a committed tree instead, symlinking `node_modules` rather than copying it: green there and red here means the working tree caused it. The two modes are not interchangeable — an archive copy is not a git repo, so `scripts/check-data.mjs`'s doc-path check falls back to walking the filesystem, while a clone exercises the git-index path this tree uses. The copy is deleted on success and kept, with its path printed, on failure.

## Building

```bash
npm run build
```

Output goes to `dist/` — a plain folder of static files. There is no server side: no Node at
runtime, no API key, no environment variable, and no database. Anything that can serve a
directory over HTTP can host it.

## Deploying

**CANONICAL URL: <https://woozkaholdings.github.io/economics-investment-education-app>**

✅ **LIVE, and this line is written on the only evidence that licenses it.** `npm run
check-deployed` against the running URL, 2026-09-07: the hashed entry bundle came back
**byte-identical** at 267,686 b (sha256 `7260fd67788f…`), `icon.svg`, `og-card.png` and
`index.html` all identical, and the nonexistent-path control returned 404 first so the 200s are
real files. (The bundle's *name* is deliberately not written here — Vite content-hashes it, so a
filename in a document goes stale on the next build. §26 caught a draft of this line doing it.) **The green Actions run is not what closed this** — a green run says the job ran. This
section says LIVE only when `check-deployed` says so; it had said "NOT SERVING YET — measured,
`HTTP 404`" for two days while the workflow was failing, which is the wording working as intended.
(This repo once shipped a "deployed ✅" that was not live. That is why.)

GitHub Pages, built and published by `.github/workflows/deploy-pages.yml` on every push to
`main`. **Nothing is dragged anywhere and nothing has to be remembered** — that is the whole
reason this host was chosen.

✅ **The private-repo blocker is CLEARED, 2026-09-07 (owner-directed).** This section used to
carry it as the reason nothing published: Pages does not serve a private repository on the free
plan, and this one was private. **The owner made the repository public**, chosen over GitHub Pro,
staying on Netlify, and Cloudflare Pages — see `DECISIONS.md` § Hosting for the four routes and
why this one. Measured after the change: the repo API returns `"private": false` against a
known-public control, and the raw-content host serves `AGENT_LOG.md` at **HTTP 200**.
**So the candid internal record is public now** — `AGENT_LOG.md`, `AGENT_LOG.archive.md`,
`DECISIONS.md`, `CLAIMS.md` and `reviews/`, plus every commit's author line. That was measured
before the decision, not after: no credential appears in any tracked file or anywhere in
**29,065,030 bytes** of `git log --all -p`, and the sweep carried an in-corpus control, because an
empty stream and a clean corpus look identical. `api-keys.txt` was never committed.

⚠️ **What the four failed workflow runs before this were, so nobody re-diagnoses them.** Every one
had a **green `build` job** — checkout, `npm ci`, `npm run build`, `upload-pages-artifact` — and
failed on `actions/deploy-pages@v4` in the `deploy` job. **That step is the one that needs
Settings › Pages › Source set to GitHub Actions**, and no amount of re-running the workflow
substitutes for it. ⛔ **Do not read a failed run as a broken build.** Read which job failed.

> ⚠️ **NETLIFY IS RETIRED BY DECISION AND IS STILL SERVING (owner decision, 2026-09-07).**
> `https://magnificent-mochi-73aecc.netlify.app` went up 2026-09-05 and, **measured 2026-09-07,
> still returns HTTP 200 with a real build** — one that is already a day behind `main`. It is
> therefore the only reachable copy of this app while the canonical URL above returns 404, and
> `LAUNCH_PLAN.md` §10.10 is right to say the app is live there. **Retiring a host is an action on
> that host, not a sentence in a document:** the site has to be deleted or unpublished in the
> Netlify dashboard, which is the owner's to do. Until then two versions are reachable, only the
> canonical one is watched, and every link already shared points at the unwatched one.
> <!-- retired-origin: https://magnificent-mochi-73aecc.netlify.app — retired 2026-09-07 when GitHub Pages became canonical; `npm run check-deployed` fails while it is still answering, because "retired" was a decision and not yet a measurement. -->
> **Why it was retired:** publishing required a personal access token that only the owner could
> create, and until it existed **every** update was a manual drag — which is exactly how the live site spent a day
> four commits behind `main`, and then nine. `scripts/deploy.mjs` was the Netlify uploader and is <!-- path-ok: scripts/deploy.mjs — DELETED 2026-09-07 when Netlify was retired. Named here as history: this sentence exists to say the file is gone, so the reference must never resolve. Restoring the file to make this marker unnecessary would be undoing the decision, not fixing a path. -->
> **deleted**, along with the `npm run deploy` script and the `.netlify-token` mechanism; if you
> find a reference to any of them, it is stale. `.gitignore` keeps its `.netlify-token` line on
> purpose, so a leftover token file on any machine can still never be committed.
> **`npm run check-deployed` is NOT Netlify-specific and is unchanged in purpose** — it reads the
> URL from this section and verifies the running site, whoever serves it.

**This is a project site, so it is served from a sub-path** (`/economics-investment-education-app/`),
not a domain root. That works unchanged and is not a coincidence: `vite.config.js` sets
`base: "./"` so every asset resolves relatively, the market-data fetch uses `document.baseURI`
(`src/lib/useMarketData.js`), and routing is hash-based. **Do not "fix" `base` to an absolute path
to make a URL look tidy** — that is the setting that lets one `dist/` serve from a root or a
sub-path without being rebuilt. Verified 2026-09-07 by serving the real `dist/` under a
`/economics-investment-education-app/` prefix locally: app renders, `icon.svg` and
`data/market.json` both resolve, and a made-up asset 404s.

**One-time setup (owner, once, in the browser).** An agent cannot flip this:
GitHub → the repo → **Settings › Pages › Build and deployment › Source: GitHub Actions**.
Until that is set, the workflow runs and the deploy step fails. There is **no token to create**
and no secret to store — the workflow authenticates with the repo's own `GITHUB_TOKEN`.

### The link preview

`index.html` carries a full unfurl card: `og:url`, `og:image` and
`twitter:card: summary_large_image`, pointing at `public/og-card.png` — 1200x630, the
1.91:1 box every major client crops to. The image is drawn by `scripts/og-card.js`, which
ships alongside it so the wording and the colors can be changed by editing text rather than
by replacing a binary nobody can open; that file's header has the one-minute recipe for
regenerating the PNG in a browser.

⚠️ **The URL above is the single definition of this site's origin.** `og:url` and `og:image`
are the only two absolute URLs in the whole build (everything else resolves relatively — see
`vite.config.js`), and `check-data.mjs` §38 asserts both against the URL in **this section**.
So if the site ever moves to a custom domain, **change the URL here first**: `npm test` will
then fail until `index.html` agrees, instead of the app quietly unfurling a preview for a host
it no longer lives on.

### To publish an update

**Push to `main`.** That is the whole procedure; the workflow builds and publishes.

```
git push origin main
npm run check-deployed
```

⛔ **The push is not the verification, and the green check mark on the Actions run is not
either.** `npm run check-deployed` fetches the running site and compares the hashed entry bundle
byte for byte against a local build — run it after the workflow finishes. To see what is pending
*before* pushing, run **`npm run check-deployed -- --identify`**: it works out which commit is
live from the live bundle itself and lists the commits a learner is missing.

Market data freezes at whatever `public/data/market.json` held at build time — see
"After it is up" below.
### ⛔ `npm run check-deployed` — because merging is no longer shipping

Added 2026-09-06. **Nothing else in this repo can see the deployed artifact.** `npm test`
(8 checks), `check-blindspot`, `check-claims` and `refresh-readiness` all certify the working
*tree*; every one of them stays green while the live site serves something else. Before
2026-09-05 that was harmless, because merging to `main` *was* shipping and there was nowhere
else for a fix to go. Since the app went live it is false, and the gap is not hypothetical:
measured 2026-09-06, the live site was **four commits behind `main`** and still taught that a
recession is when prices fall — a factual economics error corrected in the repo the day
before, sitting in front of learners alongside a screen-reader defect and a Back button that
threw the reader out of the Reference tab.

(That figure read "six commits" until `--identify` was built later the same day and measured
the deployed commit instead of inferring it. The two extras — a tooling-only commit and the
15 truncated quiz explanations — were already live. The correction is left visible because it
is the whole argument for the flag: **a claim about the live site that is derived from the
repo is a guess.**)

The check fetches the live site and compares it to `dist/`:

- **App code** — the content-hashed entry bundle. Vite renames it whenever any module in the
  graph changes, so one filename comparison covers all of `src/`; matching names are then
  compared byte-for-byte.
- **Unhashed `public/` files** (`og-card.png`, `icon.svg`, `index.html`) by sha256. These are
  *not* imported by the entry bundle, so an entry-only check is blind to them — which is
  exactly how the og:image card sat in the repo for a day while every shared link unfurled a
  text stub. `index.html` is compared modulo the one comment and two `<meta>` tags Netlify
  injects.
- **`data/market.json`** is reported and never fails the verdict: the owner's daily job
  rewrites it, so it diverges from any build by design, and a guard that goes red every day
  for an expected reason is a warning nobody reads.

**Exit codes: `0` in sync · `1` diverged · `2` no verdict.** It is not in `npm test` — it
makes a network call, and `npm test` must keep passing offline on a fresh clone. It refuses a
verdict rather than passing when it cannot measure: if a nonexistent path does not 404 (a
catch-all host or proxy), if the live document contains no Vite entry (a Netlify site set to
*Private* serves a **login page with HTTP 200**), if `dist/` is older than any build input, or
if build inputs are uncommitted. `npm run check-deployed -- --self-test` proves the injected-tag
filter is complete.

#### `-- --identify` — which commit is actually live

Nothing records a deploy, and the deployed artifact carries no commit id. It does not need
to. Vite content-hashes the entry bundle, so **the artifact is a fingerprint of the tree that
built it**: `--identify` rebuilds recent commits (newest first, `--limit` defaults to 40) until
one reproduces the live bundle **byte for byte**, then lists exactly which commits a learner is
not getting. `-- --since <commit>` still takes that baseline on trust if you already know it.

⚠️ **Why this is not a nicety.** The weekly review of 2026-09-06 answered this question by
hand, took the last deploy off a run-log headline, and **named the wrong commit** — reporting
six undeployed commits when there were four, and listing as "still missing" a fix that was
already live. Measured the same day: the live bundle is byte-identical to a build of
**`0a30707`**, and the four undeployed commits are `992a057`, `855fadd`, `9ea716b`, `480b242`.

It carries its own control: a rebuild of `HEAD` must reproduce the `dist/` built here, or the
probe cannot recognize a commit it just built and a miss would mean nothing — so it refuses to
run rather than reporting one. Two limits, both stated by the output: it matches on bytes and
never on the filename, and it rebuilds old trees against **today's** `node_modules`, so a
candidate whose dependencies have since changed will not reproduce. A failed identification
therefore says *not identified*, never *not deployed*.

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
no `netlify.toml` and no `vercel.json`. It *does* carry one workflow file — `.github/workflows/deploy-pages.yml` — which exists to publish to Pages, not to satisfy a routing requirement; the no-rewrite-rule point above is unaffected.

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
3. **`npm run analytics-check`** — verify the key is accepted *before* you ship it.
4. `npm run build`, then redeploy.

⛔ **A green build is not evidence that analytics works, and neither is a 200 from the
provider.** Sending is fire-and-forget by design, and PostHog’s capture endpoint answers
**HTTP 200 to any key at all** — measured 2026-09-06 against both the US and EU hosts with a
deliberately invalid key, with a 404 control on the same host proving the 200 was real
accept-and-discard rather than a catch-all. So a typo, or a US key pointed at the EU host, looks
**exactly** like a working setup from inside this repo: build passes, deploy passes, dashboard
stays empty, nothing says why. `npm run analytics-check` probes `/decide/` instead, which
actually validates the project token, and it **runs a deliberately-invalid-token control first
and refuses to give a verdict if that control does not come back 401** — so it cannot report a
pass while blind. Exit codes: `0` verified, `1` off or rejected, `2` no verdict (control failed),
`3` provider it cannot validate. It can also check a key before you paste it:
`npm run analytics-check -- --key phc_xxx --host https://eu.i.posthog.com`.

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
