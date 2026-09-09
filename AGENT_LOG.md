# Agent Log — Economic Cycles App

This file is the memory of the autonomous development agent that runs on this repo on a schedule the owner sets (the cadence is the owner's lever and moves; it is deliberately not restated here, because a number written down here goes stale silently). Each run reads this file, picks the single highest-value backlog item, implements it, verifies it, and appends a dated entry below. Do not delete history — prune the backlog as items complete, but keep the run log intact.

## App summary (rewritten 2026-09-01 — the fourth rewrite, and the first that DELETES the counts rather than correcting them)

⚠️ **Before you put a figure in this section, read this.** The version it replaces was written
2026-08-04 and said "17 lessons, 12 macro/cycle-theory + 5 personal-finance" and "17 sequential
unlocking lessons" — through the 2026-08-07 track split, the 2026-08-14 renumbering and the 2026-08-18
product reversal, for four weeks, in the document every run reads first. Measured 2026-09-01: **44
lessons in three independent tracks**, and **14** lessons carry an inline figure where this said four.
The defect is not that nobody corrected the numbers; it is that they were **retyped here** when
`npm test` prints them. **So: no count in this section that a script generates.** Read `npm test`'s
readiness line (lessons / en chars / minutes), `check-log-size.mjs`'s MEASURED line, and §2.5's track
ranges, which are generated and checked every run.

**The product, in one paragraph — getting this wrong has cost more runs than any bug in the app.**
Three independent curricula, not one path (§2.5). **How the Economy Works is the main path**: a new
install opens on "Transactions", not "Budgeting". **Your Money is the product** — judgment, not
procedure: the spending and investing decisions that mechanics do not settle. **Essentials is optional
mechanics**, kept in full, gating nothing and gated by nothing. Lessons gate sequentially **within** a
track only. The 2026-08-18 reversal that put economy first is in `DECISIONS.md`; **a summary that
describes one sequential chain is describing the app as it was before 2026-08-07.**

`economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` at the repo root are reference material only —
measured 2026-09-01, **zero import statements under `src/` name either** (the one mention is a comment
in `App.jsx` saying exactly this). See "Notes for future runs" below for what each is.

**Structure under `src/` — the shape and the invariants, deliberately not a file list**, because a
list rots on the next file added and this section has now done that twice. `ls` is the source of truth.

- **`App.jsx`** — the shell: three bottom tabs (**Learn**, **Review**, **Reference**), a sticky header
  with the five-language picker (en + Beta-labeled es/ko/zh/ja, §10.4), a first-run disclaimer modal
  (§10.1) with a focus trap that must be dismissed before first use, and a pushed lesson-reader view.
  Hash routing (`#/learn`, `#/practice`, `#/reference`, `#/lesson/<id>`) is owned entirely by
  `lib/deepLink.js` — two call sites here and nothing else. **A URL does not unlock a lesson**;
  `DECISIONS.md` has the reasoning and the owner-facing cost.
- **`theme.js`** — the type scale, spacing, and the semantic *names* for color. ⚠️ **Color VALUES are
  not in this file.** They are CSS custom properties in `index.css` (a light and a dark palette);
  `theme.js` exports `var()` references and holds no hex at all, which is what lets the app follow the
  system setting. AA on every ink-on-surface pair is enforced by `check-data.mjs` §28, and no component
  carries a hex — measured 2026-09-01 at zero across every `.js`/`.jsx` under `src/`.
- **`lib/`** — pure logic, no JSX: app state, the Leitner scheduler (`review.js`, keyed by an **opaque
  question id** since 2026-09-01 and never by array position), deep links, the local analytics sink,
  chunk-load recovery, the lesson-id migration, and the market-data adapters that only the offline job
  calls — never the browser. **All client state is `localStorage` and nothing else** (`DECISIONS.md`):
  completed lessons, the review schedule, the streak, font scale, theme. No account, no sync.
- **`components/`** — UI primitives, icons, the chart library, the per-lesson figures
  (`LessonVisual.jsx`), the quiz question, the glossary term chips, the error boundary, and the
  interactive policy simulator.
- **`screens/`** — `Learn` (the path), `LessonReader` (lesson body, an inline figure on the lessons
  that teach one, an end-of-lesson check on every lesson), `Practice` (the spaced-review queue fed by
  those checks), and `Reference`, whose sub-screens live in `screens/reference/`: glossary and term
  detail, market signals, sector performance, parent guide, settings/about.
- **`content/`** — plain `.js` modules, five-language parity enforced by `npm test`. Lesson bodies are
  split per track and per language (`lessonContent.<track>.<lang>.js`); the quiz is split the same way,
  `quizMeta.js` holding the answer key and the stable question ids and `quizText.<lang>.js` the prose.
  Glossary, glossary-to-lesson links, kids content, market teaching copy, sectors, economic signals,
  money figures and policy scenarios each have their own module.
- **`locales/`** — one file per language, app chrome only; lesson prose lives in `content/`.

**Market data.** The owner's scheduled task writes `public/data/market.json` once a day via
`scripts/fetch-market-data.mjs` — no client-side key, no live call from the browser. Sector performance
ranks the S&P sectors against SPY by the owner's own relative-strength formula; the macro readings come
from FRED. Data older than `STALE_AFTER_DAYS` is suppressed rather than shown as current: §2.3's
standing rule is about *fake* freshness, not about numbers.

`LAUNCH_PLAN.md` (v2) is authoritative and supersedes `Economic_Cycles_Launch_Plan.docx`.
`DECISIONS.md` holds the standing architectural choices (Vite-not-Expo, `.js`-not-JSON content,
`localStorage`-only state, the market-data pipeline); `LAUNCH_READINESS.md` scores the gates.

**Blindspot register — §10 IS the register and this is a pointer, not a copy.** Only the first three
of its entries are closed — ⚠️ **plus 10.10, closed 2026-09-05 when the app went live; that makes four, and this sentence is left in its original shape so the correction is visible rather than smoothed away.** **10.1** (investment-advice adjacency) and **10.2** (Dalio dependency) are closed and
are **standing rules, not settled history**: check any lesson or market-copy change against them, and
run `npm run check-blindspot` before committing one. **10.3** (kids/COPPA) ships parent-facing and is
closed on that basis, but is reopened as a *question* — a genuinely child-facing product is a legal and
store-classification decision, not a UI one, and no run may make it. ⚠️ **10.4 through 10.9 are OPEN,
and the paragraph this replaces did not say they exist.** 10.8 ("process mass exceeds product mass")
is what W-6 below is about, and it was **checked on 2026-09-05: the tripwire fires at 10.61x against
a 5x threshold, in all 17 rolling windows since it was filed.** **10.10 ("nothing owns getting this
in front of one person") is CLOSED 2026-09-05** — a reachable URL exists, which is half of its own
stated refuting number; the other half, one person having opened the app, is unmeasured until O-2.

## Prioritized backlog

> Rewritten 2026-08-04 (dev-agent run). The previous version of this section, and of the App summary
> above, still described the pre-rebuild `economic-cycles-v5.jsx` + `Home.jsx`/`Markets.jsx`/`More.jsx`
> split — three separate run-log entries flagged that staleness (2026-08-04, twice) before this run
> actually did the rewrite. Re-derived from `LAUNCH_PLAN.md`, `DECISIONS.md`, and the real `src/` tree,
> not carried forward from the old text. Nothing is deleted — the old numbered items now live in
> "Completed and pruned" below, and the full detail is always in the run log.

**P1/P2 — cleared.** The JSX-monolith split, the first-session flow, and the 2026-08-04 rebuild onto
`src/App.jsx` + `src/screens/*` + `src/lib/*` are all done. See "Completed and pruned" and the run log
for the history. No open P1/P2 items.

**Open**

> ## ⛔ OWNER ACTIONS — nothing in this repo can move these, and they are the whole critical path
>
> **Standing block, promoted to the top of the backlog by the weekly review 2026-08-23.** ⭐ **What
> it was built to diagnose is settled by how O-1 ended, and this is the conclusion it exists to
> carry:** naming a blocker in the closing line of every run entry — sixteen consecutive runs across
> nineteen days — moved it none of the way; **one direct owner instruction moved it all of the way,
> in about twenty minutes.** A closing line in a 15,000-line log is not an escalation. **Ask the
> owner for a decision rather than restating a blocker.**
>
> **O-1. A URL. ✅ CLOSED 2026-09-05** (owner-directed, interactive; open 2026-08-17 → 2026-09-05,
> **19 days**), commit `cf1aab3`. The app is live at
> <https://magnificent-mochi-73aecc.netlify.app>, and since 2026-09-06 `npm run check-deployed`
> verifies that against the running site rather than against a report. `README.md` § Deploying owns
> the URL, the site id, the verification and the update procedure — including what cost the time:
> **"deployed" and "reachable" were three steps and the repo's instructions described one** (an
> unclaimed Netlify Drop is password-protected and expires in about an hour; a *claimed* drop still
> lands with Production visibility **Private**, redirecting visitors to a login, until that is
> changed by hand).
> ⚠️ **What O-1 did NOT close: blindspot 10.10's second half.** A reachable URL exists; **whether
> one person has ever opened the app is still unmeasured**, and stays that way until O-2 lands. Do
> not write "someone has used it" anywhere on the strength of this item.
>
> **O-2. An analytics provider account and key. (Item 18.)** `src/lib/analytics.js` fires the §9.2
> event set with the §9.2 payloads; `sink()` writes to one device's `localStorage`. §4.3's Phase-0
> completion-rate gate (≥40% finish lesson 1) is scored **❌ Unmeasurable** on the readiness scorecard
> and cannot be scored any other way. O-2 is downstream of O-1 — **and O-1 closed 2026-09-05, so
> this is now the top of the critical path and nothing is in front of it.** The gate it unblocks is
> the one that says whether anybody finishes lesson 1.
> 🟡 **NARROWED 2026-09-05 (owner-directed): the code half is DONE and verified end to end.** This
> item no longer reads "an analytics provider account **and key**, then swap `sink()`". The
> transport ships; `src/lib/analyticsConfig.js` says `provider: "none"`. **The whole remaining owner
> action is four steps:**
> 1. Create an account at one provider — **PostHog** (free at this volume; its funnels compute
>    §4.3's ≥40% gate directly) or a **cookieless** one (Plausible/Umami: no consent banner, ~1-2 KB,
>    but paid or less capable). The trade is written out in `DECISIONS.md`; it is a real choice, not
>    a formality.
> 2. Paste that provider's **public** site id / ingest key into `src/lib/analyticsConfig.js` and set
>    `provider`. ⛔ **Never paste a private or personal API key** — the file ships to every visitor
>    and says so.
> ✅ **Step 3's pre-flight actually works as of 2026-09-07** (owner-directed, "set up posthog"). The
> documented `npm run analytics-check -- --key phc_xxx` — the form meant to check a key BEFORE pasting
> it — read `provider` from the committed file, saw `"none"`, and exited without probing. A CLI
> `--key`/`--host`/`--provider` now overrides the file. **Nothing about the owner action changed; the
> tool for it did.**
> 3. **`npm run analytics-check`** (added 2026-09-06) — verify the key is actually accepted
>    BEFORE building. ⛔ **Nothing else in this repo can tell you.** PostHog’s capture endpoint
>    answers **HTTP 200 to any key at all** (measured 2026-09-06, both regions, with a 404
>    control), and the browser send is fire-and-forget by design, so a typo or a US-key/EU-host
>    mismatch is indistinguishable from success: build green, deploy green, dashboard empty.
>    The check probes `/decide/`, which validates the token, and carries an invalid-token
>    control that must come back 401 or it refuses to give a verdict.
> 4. `npm run build`.
> 5. Redeploy `dist/` to <https://magnificent-mochi-73aecc.netlify.app>.
> **Then §4.3's Phase-0 gate becomes measurable for the first time** — and only then; a per-device
> `localStorage` log still cannot be aggregated across installs.
> ✏️ **`LAUNCH_READINESS.md`'s Instrumentation section agrees with this item as of 2026-09-06.** Until
> then it said the provider work had not started ("`track()` writes to a local `localStorage` rolling
> log only") and told a reviewer to expect `grep -rn "posthog" src/ package.json` to return nothing,
> which stopped being true on 2026-09-05. Nothing about O-2 changed — **the scorecard did.**
>
> **O-3 (new, decision not action). A large volume of unreviewed machine translation is now shipping
> every day, and the "(Beta)" decision was made about a smaller, static surface.** `DECISIONS.md`
> accepted option (a) on 2026-08-11 — ship the existing AI translations under "(Beta)" labeling — for
> a corpus that was then sitting still. Since 2026-08-22 item 93 has added roughly **10,000–12,000
> characters per day** of new `es`/`ko`/`zh` prose, and every run entry says so plainly: *"No fluent
> Chinese reviewer has read either lesson."* Human review share is **0% in all four languages** and
> falling as a proportion. Item 93 itself flags this ("the owner should know it is happening") and
> that flag is the honest one. **Nothing here is wrong or blocked — this is a scale change the
> original decision did not contemplate, and the owner should either re-affirm it or cap it.**
>
> **O-4 (new 2026-09-07, and it inverts what this repo believes about where the app is). The
> canonical URL returns 404 and the RETIRED one returns 200.** Measured this run with controls:
> `https://woozkaholdings.github.io/economics-investment-education-app/` → **404** (the instrument's
> own nonexistent-path control fired first, so the 404 is real); the Netlify site the 09-07 decision
> retired → **200, serving `index-B1mndoLB.js`** with `market.json` at `asOf 2026-09-04`. A
> nonexistent `*.netlify.app` subdomain → 404, so that 200 is not a catch-all. **`LAUNCH_PLAN.md`
> §10.10 — "the app is live at <the Netlify URL>" — is the document that is telling the truth**, and
> `README.md`, the one the migration updated, was the one describing a dead host as live and a live
> host in the past tense. Corrected this run.
> **Two owner actions, and they are independent:**
> 1. **Publish the canonical site.** README § Deploying already carries the measured blocker (this
>    repository is private; Pages from a private repo needs a paid plan) and its three routes. This
>    run re-confirmed the premise rather than restating it: unauthenticated `GET` of the repo API →
>    **404** against a **200** control on a public repo, `git ls-remote` over HTTPS → *Repository not
>    found*, and `woozkaholdings.github.io/` itself → **404**, so no Pages site is published from the
>    account at all. ⚠️ The account's plan is **not** visible from here; do not write down which of
>    the three routes is needed (see the environment note on local vs global absence).
> 2. **Actually retire the old host** — delete or unpublish the Netlify site — or decide to keep it
>    and drop the `retired-origin` marker from README § Deploying, saying there why. Until one of
>    those, two versions of the app are reachable and only one is watched.
> **What is no longer an owner action: noticing.** `npm run check-deployed` now reads
> `retired-origin` markers from README and fails while a retired origin still answers with a Vite
> bundle. It is the first thing in this repo that looks at a host other than the canonical one.
> ✅ **HALF CLOSED 2026-09-07, hours later, owner-directed ("publish the canonical site").** Action
> 1 is **DONE and certified**: the owner made the repository public and set Settings › Pages ›
> Source to GitHub Actions; `npm run check-deployed` reports the canonical URL serving HEAD with the
> entry bundle **byte-identical** and the 404 control firing. ⭐ **The diagnosis that unblocked it is
> the part worth keeping:** four workflow runs had failed and the obvious reading — a broken build —
> was wrong. Every one had a **green `build` job** and failed on `actions/deploy-pages@v4` in the
> **`deploy`** job, which is gated on a repository setting that no re-run substitutes for. **Read
> which job failed, not that the run failed.** ⛔ **Action 2 is still open and is now SAFE to do**,
> which it was not this morning: Netlify was the only reachable copy, so deleting it would have
> taken the app offline. The canonical site is verified, so the old host can go.
> ⚠️ **And the branch this run's own entry recorded as unexercised — "canonical serves HEAD but a
> retired origin is up" — fired for the first time on that same check, exactly as written.**

>
> **O-5 (new 2026-09-08, and it is the residual of item 74 rather than a new discovery). Publishing
> follows a push to `main`, and nothing owns the push — so the live site's market data is current by
> coincidence.** The Pages workflow builds and deploys on every push, which is what closed item 74's
> headline gap. But the `economics-app-market-data` scheduled job **commits without pushing**, and a
> dev-agent run is forbidden to push. **Measured from `origin/main`'s reflog 2026-09-08:** pushes at
> **2026-08-26 00:15**, then nothing until **2026-09-07 22:06** — a **twelve-day gap** containing the
> daily market commits of 09-01 through 09-04. They went live only because eight owner-directed
> pushes went out that evening for an unrelated reason.
> **Why it matters and when:** `STALE_AFTER_DAYS` is 4. The live site serves `asOf 2026-09-07`, so
> **Reference → Sectors goes to its unavailable state for every visitor on 2026-09-12** unless a push
> carrying a fresher `market.json` lands first. The rest of the app is unaffected — 44 lessons, the
> glossary, review and the parent guide all keep working on a stale deployment.
> **Two routes, and they are the owner's to choose:**
> 1. **Have the market job push** after its commit. It already runs on the owner's machine with the
>    owner's credentials; this makes the daily refresh reach learners without anyone remembering.
> 2. **Decide the Sectors screen may go dark between pushes** and say so in `README.md` § Deploying,
>    at which point this stops being a defect and becomes a documented property.
> ✅ **What is no longer an owner action: noticing.** `npm run check-deployed` now measures the age of
> the market.json the live host actually served and projects the date the live screen goes dark. It is
> an advisory and never fails the verdict, deliberately.

> ## PRIORITY BLOCK W-7 — set by the weekly review 2026-09-06. Supersedes W-6's *active* clauses below. W-6's standing rules (W-6.2's residual-chain rule, W-6.3's ratio-quoting rule) are UNCHANGED, still binding, and W-6.2 WORKED — see W-7.0. Read this first.
>
> **The week shipped 113 commits, build and tests green, and the app went LIVE. That is the largest
> single step this project has taken. W-6.2 changed run behavior in a way that is visible in the
> data, not just asserted. This block is about one thing W-6 could not have seen, because it did not
> exist on 2026-08-30: _the app is now deployed, and "committed to main" has stopped meaning
> "shipped to a learner."_**
>
> ### W-7.0 — what last week's block actually did. Credit where it is measured.
> Re-measured 2026-09-06 off the tree at `656958e`, not read off the log:
> - **W-6.2 rule 1 bound, and runs said so in their own headings.** Four separate entries this week
>   open with "W-6.2 rule 1 sent me off a Nth consecutive X pick". Scheduled picks are now dominated
>   by **live walks of the built app** (7), **corpus-wide sweeps of a never-swept class** (8), and
>   **`LAUNCH_PLAN.md` clauses** (7). The 146→147→148→149 residual chain W-6.0 measured did not recur.
> - **The instrument-to-app ratio IMPROVED**, which W-6.3 asked to be re-measured rather than obeyed:
>   `scripts/` **19,305** lines vs app code (`src/` minus `content/`+`locales/`) **8,833** — **2.19x**,
>   down from 2.35x (15,480 / 6,589). This week's insertions were `scripts/` **+3,991** vs `src/`
>   **+3,662** — near parity, against last week's 8,987 / 3,058. **The instruments stopped outgrowing
>   the app.** ⚠️ One number inside that is still moving the wrong way: `check-data.mjs` is now
>   **11,597 lines** in one file, up from 8,711 (+33%).
> - **W-6.2 rule 2 worked on the item COUNT and did nothing to the BYTES**, and that is W-7.2.
>
> ### W-7.1 — ✅ CLOSED 2026-09-06, all three steps. The app is live AND current, and the gap this block found now has a permanent instrument.
> **What was true when this block was written (2026-09-06):** the app had been live since 09-05 and
> four learner-visible commits were not on it — among them a lesson still teaching that a recession
> is when prices fall. **What is true now: the site serves HEAD.** Step 1 (redeploy) landed
> owner-directed the same day. Step 2 shipped `npm run check-deployed` (`b425633`) and its
> `-- --identify` mode (`acf117e`), which rebuilds recent commits until one reproduces the live
> bundle byte for byte — so nothing has to *record* a deploy; the artifact identifies itself. Step
> 3's cadence question was put to the owner and came back **"nobody should have to remember"**, so
> `npm run deploy` (`1781b87`, recorded in `DECISIONS.md`) deletes the manual drag rather than
> scheduling it.
> ✏️ **SUPERSEDED 2026-09-07 (owner decision): Netlify is retired and GitHub Pages is canonical.**
> The one owner action this clause named — create a Netlify token — **no longer exists**, and the
> token was the reason it was named: publishing needed a credential only the owner could make, so
> every update in between was a manual drag. The site now publishes from
> `.github/workflows/deploy-pages.yml` on push, authenticating with Actions' own `GITHUB_TOKEN`.
> `npm run deploy` and `scripts/deploy.mjs` are **deleted**. The remaining owner action is a
> one-time browser setting (Settings › Pages › Source: GitHub Actions), not a secret.
> ⭐ **W-7.1's finding is unchanged and is what made this the right trade:** the instrument that
> matters is `npm run check-deployed`, which certifies the **artifact** rather than the process,
> and it is host-agnostic — it reads the URL from `README.md` and survived the host change
> untouched in purpose.
> **Re-verified 2026-09-06 by this run against the site, not the log:** entry bundle
> `index-B1mndoLB.js` byte-identical at 264,930 b, `icon.svg` / `og-card.png` / `index.html`
> identical, and the 404 control fired.
> ⭐ **The transferable finding, and it is why both instruments above exist.** O-1 changed the
> definition of "done" and nothing in the repo changed with it: every instrument here certifies the
> **tree**, and not one could see the deployed **artifact**, so the app could be correct in the repo
> and wrong on the web indefinitely with every check green. **A claim about the live site that is
> not measured against the live site is a guess** — demonstrated twice, the second time by this
> block's own author, who named the wrong deployed commit by reading it off a run-log headline.
>
> ### W-7.2 — the floor grew 40% in a week WITH three compression passes running, and the cause is not new items. It is accretion.
> `npm test` still warns every run. Measured 2026-09-06 vs the `c55a887` tree of 2026-08-30:
> | region | 2026-08-30 (`c55a887`) | 2026-09-06 (`602879f`) | change |
> |---|---|---|---|
> | backlog section | 295,280 b | **425,473 b** | **+130,193 b (+44.1%)** |
> | ├ priority blocks (above item 1) | 28,568 b | **58,852 b** | **+30,284 b (+106.0%)** |
> | └ numbered items | 266,712 b | **366,621 b** | +99,909 b (+37.5%) |
> | numbered items (count) | 131 | 145 | +14 |
> | **OPEN items (count)** | **26** | **28** | **+2** |
>
> ⚠️ **The 09-06 column is corrected (2026-09-06, dev-agent) and the original is not annotated
> under it, per rule 1 below.** As first written it read 412,906 / 46,285 — the region measured
> **before this block was inserted into it**, so W-7 charged its own 12,567 b to nobody and the
> priority region's growth was reported at +62% when it is **+106%**. Re-measured at `602879f`
> with the same boundary that reproduces the 08-30 column byte-exactly (295,280 / 28,568 /
> 266,712), which is the control that says the two columns are comparable.
>
> ⭐ **Read those last two rows against the first. Open items grew by TWO and the backlog grew by
> 118 KB.** W-6.4 diagnosed the growth as newly-filed residual items and W-6.2 rule 2 was written to
> stop them. **Rule 2 worked — and the file grew anyway, because the growth was never in new items.**
> It is **existing text accreting**: annotations, retractions, re-measurements and "ORIGINAL CLAUSE,
> kept because the retraction above refers to it" preservations, layered onto items that are already
> closed. Mean bytes per item went **2,036 → 2,528**.
> ⛔ **The fastest-growing region in the whole file is the priority-block region itself — it
> DOUBLED in a week (+106%), and the single largest contributor is this block.** W-6.1 was the
> worst individual instance: a **closed** item carrying its original clause, a retraction of it, a
> retraction of the retraction's prescribed fix, a three-row measurement table, and two "kept
> because the retraction refers to it" preservations — **five layers on a settled question.** It
> was collapsed to one paragraph on 2026-09-06 (−3,727 b). This is the reviewer's own defect, and
> it is named here rather than smoothed away.
> **Three compression passes ran this week** (3rd ~54 KB, 4th 7,708 b, 5th 17,157 b ≈ **79 KB
> recovered**) against **~197 KB of gross growth**. **Compression is losing 2.5:1 and cannot win**;
> it has been tried five times.
> **The rule, and it is about closed text, not about any item:**
> 1. **When an item or clause CLOSES, it is replaced by its conclusion, not annotated with one.** One
>    paragraph: what was true, what is true now, the date, the commit. **The full argument is already
>    in the run log, which is what the run log is for and which archiving already handles.**
> 2. **"ORIGINAL CLAUSE, kept because the retraction refers to it" is retired as a pattern.** Rewrite
>    the retraction so it does not need the original quoted underneath it. If the original wording
>    genuinely matters, it is in git and in the run log — **cite the commit, do not paste the text.**
> 3. ⚠️ **This does NOT license deleting run-log history** (W-5.3 is unchanged) and does not license
>    smoothing away a correction. **The record of having been wrong stays; the five layers of it in
>    the live backlog do not.**
> 4. **W-7 supersedes W-6 and W-5's active clauses. Apply rules 1-2 to THIS block first** when its
>    clauses close. ✅ **Done 2026-09-06, the run after W-7.1 landed:** W-7.1, W-6.1, W-6.5 and O-1
>    were each replaced by their conclusion — **−6,752 b, and the priority region went 58,852 →
>    52,100 b.** Nothing open was touched and no run-log history was deleted.
> 5. ⛔ **This block cost 12,567 b to write** — the backlog went 412,906 → **425,473 b** at
>    `602879f` — **and W-6's cost 17,717 b over its week. A review that diagnoses accretion in prose
>    that accretes is the defect it is describing.** The measurement was that **every weekly block
>    so far had grown after being written, and none had ever shrunk.**
>    **So the test of this block is not whether the next run agrees with it — it is whether the
>    backlog is smaller on 2026-09-13 than the 425,473 b it stood at when it was written.**
>    ✅ **Standing at 397,785 b on 2026-09-07 — 27,688 b UNDER the baseline** (09-06's rule-4
>    collapse took it to 418,721 b; two days of writing put it back over at 431,186 b; item 27's
>    collapse this run took −33,704 b). **Rule 1 is what moves this number:** one closed item, more
>    than twice the ~15.8 KB mean of the five generic compression passes — though not more than the
>    largest of them (~54 KB), and that comparison is stated rather than rounded in rule 1's favor.
>    **Next review: open with a fresh measurement of that number before anything else** (the
>    instrument is `check-log-size.mjs`'s MEASURED line; do not retype either figure).
>
> ### W-7.3 — market data has missed two days, and the stale date is now inside the week. Owner's job; flagged, not touched.
> `public/data/market.json` is `asOf 2026-09-04`; refresh commits ran daily 08-31 → 09-04 and there is
> **none on 09-05 or 09-06**. `STALE_AFTER_DAYS` is **4** (`src/lib/useMarketData.js:20`, `ageDays >
> STALE_AFTER_DAYS`), so the Sector screen starts rendering the unavailable state on
> **2026-09-09**. This is the **second** occurrence of the W-6.5 pattern in eight days. ⛔ **It is the
> owner's scheduled job, not dev-agent work — do not "fix" it in the repo.** ⚠️ **But note what is new
> since W-6.5: the app is live.** A stale-data gap is no longer invisible; it is a public surface
> degrading. **W-7.1's guard and this share one root** — nothing in this repo watches anything outside
> the tree.
> ✏️ **Corrected 2026-09-06 (dev-agent), two ways.**
> **(a) "the Sector and Market Signals screens" was wrong — it is ONE screen**, and this is a
> *re-regression*, not a new finding: **item 74 corrected exactly this on 2026-08-19 "by measurement,
> not reading"**, and W-7.3 lost it 18 days later. Re-measured this run: `grep -rn "useMarketData" src/`
> has one consumer, `Sectors.jsx`. `MarketSignals.jsx` imports only `content/markets.js` and never
> fetches `market.json` — it is dateless teaching copy, unaffected by staleness in either direction.
> ⭐ **A weekly review is not a fresh measurement of everything it restates; it can carry a stale claim
> forward past a correction the backlog already holds.**
> **(b) The last sentence is now false, and deliberately so:** `npm run check-market`
> (`scripts/check-market-freshness.mjs`) watches this file on every `npm test` — WARN when it is stale
> or goes stale tomorrow, FAIL only for a missing/unparseable/unreadable-`asOf` file, which is the half
> the repo owns and a run can fix. It does not refresh anything; W-7.3's ⛔ stands untouched.
> ⚠️ **2026-09-07 (owner-directed environment audit) — read the correction inside it before acting.**
> Every scheduler on this host was enumerated: the Claude scheduled-task list (20 tasks;
> `economics-app-dev-agent` is there, no market task is), `crontab -l` (one entry, an unrelated
> `htf_miner` job), and `~/Library/LaunchAgents` + `launchctl list` (no match for
> `econom`/`ecycle`/`market`). **Nothing visible from this host runs `scripts/fetch-market-data.mjs`**,
> and the audit concluded from that that the job had been deleted or disabled. ✏️ **The owner corrected
> it the same day: the task lives on "machine A" and stays there.** ⛔ **The conclusion was drawn from
> one machine's scheduler about a setup with more than one machine — the second time in this session
> that local absence was read as global absence** (the first was an Apple Developer account, run-log
> 2026-09-07). **`~/.claude/scheduled-tasks/` is per-machine: a job on another host is not absent from
> here, it is invisible from here, and those are different findings.**
> **What this checkout can still say, measured:** the sampled refresh commits `20fde17`, `83a4fa8` and
> `55c0c15` are all in **this** working copy's reflog — 502 entries back to the initial commit, one
> committer identity, one timezone, **zero merge commits** — so the job commits into *this* directory
> rather than a separate clone someone merges. **The falsifiable test, which costs nothing:** if the
> job is live, the next refresh commit arrives here by itself. `market.json` is `asOf 2026-09-04` and
> Sectors renders the unavailable state on **2026-09-09**, so **no new refresh commit in this log by
> 09-09 is the answer** — and until then this clause must not be re-diagnosed from this host. Still ⛔
> owner-only, still not repo work.
> ### W-7.4 — content quality: no regressions found, and the safety guard was independently re-proved.
> **This review verified §10.1 rather than reading its green line.** Planted *"With rates this low, now
> is a good time to buy stocks."* into `src/content/lessonContent.economy.en.js`, confirmed the plant
> landed (file 47,236 → 47,329 b), ran `check-blindspot` → **exit 1, `FAIL: §10.1
> investment-advice-adjacent language reintroduced`**; restored from a scratchpad copy (`cmp` identical,
> tree clean) → **exit 0**. The timing class `2ab2dec` added on 09-02 is real and load-bearing, and its
> own controls (8 timing patterns each firing on their own sentence, 2 shipped sentences staying clean)
> are the right shape. **No advice-adjacent or personalized-recommendation language found anywhere this
> week.** The week's content commits are corrections *toward* accuracy — the 2s10s spread direction, QT
> vs tapering, the Fed's target index, the compounding arithmetic, the replication-failure citation, the
> 1930s austerity case, and the recession/deflation distinction. **This is the strongest content-accuracy
> week in the project's history.** The irony in W-7.1 is that almost none of it is in front of anyone.
>
> ### W-7.5 — O-3 restated a third time, and the reason to decide it is now different.
> Unchanged on the numbers: **es/ko/zh/ja at 100% reviewed, 0% human**; **47 abridged pairs**, all on
> the optional `essentials` track. **What changed is that it is published.** The "(Beta)" decision of
> 2026-08-11 was made about an unpublished corpus; four languages of unreviewed machine translation are
> now on a public URL under the owner's name. **Re-affirm it, cap it, or gate the non-English pickers
> until review — owner's call, and it is now a shipping decision rather than a roadmap one.**

> ## PRIORITY BLOCK W-6 — set by the weekly review 2026-08-30. Supersedes W-5's *active* clauses below. W-5's standing rules (W-5.2's pick-list warning, W-5.3's archiving rule, W-5.5's re-read-the-count rule) are UNCHANGED and still binding. Read this first.
>
> **The week was, on craft, the best this project has had. 96 commits, build and tests green, not one
> regression, and a standard of adversarial self-checking — premises re-measured, controls planted,
> probes proven dead and replaced — that most funded teams never reach. This block is not about
> quality. It is about where that quality is being spent.**
>
> ### W-6.0 — the measurement this block is built on. Read it before disagreeing with the rest.
> Measured 2026-08-30 off the tree at `94b4914`, not read off the log:
> - `scripts/` is **15,480 lines**. The app's own code (`src/` minus `content/` and `locales/`) is
>   **6,589 lines**. The instruments are **2.3x the application they measure.**
> - This week: `scripts/` **+8,987** insertions, `src/` **+3,058**. `check-data.mjs` alone is **8,711
>   lines / 62 sections**.
> - **29 of the open backlog items** carry the phrase *"filed … by the run that"* — they are residuals
>   a run filed from its own work, not work derived from the launch plan. **15 open items say
>   "Downstream of O-1". 8 say "Zero live instances". 27 say "Honest priority: low".**
> - The last six runs form an unbroken chain: 146→147→148→149, then 150→151→152, then 153+154. **Every
>   link was filed by the run that closed the previous link.**
>
> **This is W-2's note-chain failure in its third costume.** W-2 caught direction coming from the
> previous run's "next run should pick" line. W-5.2 caught it coming from "continue the tranche".
> **It now comes from "close my own residual" — and W-5.2's remedy expired without being replaced,
> because it was written against item 93 and item 93 closed on 08-24.** A rule scoped to one item
> stops binding when that item does. This one is scoped to the shape instead.
>
> ### W-6.1 — ✅ CLOSED 2026-08-30 via route (a). The recipe this block used to carry is deleted, because it was the last known way to make `npm test` fail on a fresh clone.
> **What was true:** `npm test` exited 1 on a fresh clone — `§26: DECISIONS.md names
> drafts/income-hierarchy.en.md, which does not exist` — and the working tree was green only
> because the owner had that file untracked. **What is true now:** route (a) **tracked** it
> (`5d958ff`, 2026-08-30; re-verified 2026-09-06 with `git ls-files`), making the citation true
> rather than exempted. Route (c) — §26 resolving against the git index instead of the filesystem —
> shipped as **item 157**, and is the one that fixes the class. See item 154 for the two-direction
> measurement.
> ⭐ **The transferable finding, and it is this review's own error rather than a run's: an error
> message that prescribes a fix is a CLAIM about the fix, not a measurement of it.** This block
> authorized route (b) — §26's own suggested `path-ok` marker — sight-unseen, and **route (b)
> cannot work at all**: §26 fails a reference whose path is missing *and* fails a `path-ok` marker
> whose path is present, and a clone and the owner's tree are exactly those two mutually exclusive
> states. A scheduled run spent itself proving that (`90bfeaf`). §26's advice is wrong for every
> reference to a path that exists locally and not in the repo, and a weekly review is not exempt
> from measuring before authorizing.
> ⛔ **Do not write a fresh-clone recipe anywhere: `npm run clean-tree` IS the recipe** (Environment
> note, 2026-09-06). The prose recipe this block carried until now copied the gitignored
> `economic-cycles-v*.jsx` into the clean tree, which falsifies six `path-ok` markers at once and
> drops the exemption count to 13 against an expected 20 — **the priority block that existed
> because the suite failed on a fresh clone contained the only known way to make it fail on one**
> (re-measured three ways 2026-09-06 against `480b242`: real clone **exit 0**, `git archive` **exit
> 0**, `git archive` + that `cp` **exit 1, 7 × §26**). Adding `cp -R drafts` is the same defect
> wearing the other face — route (a) already ships `drafts/` inside `git archive HEAD`.
>
> ### W-6.2 PRIORITY — the residual-chain rule. This replaces W-5.2's ratio, which expired with item 93.
> **The rule, and it is about shape, not about any item:**
> 1. **A run may not take its own previous run's residual as its headline pick more than TWICE in a
>    row.** The third run picks from the launch plan, from the owner-facing items, or refills the
>    backlog (W-2's standing rule — still a legitimate, valuable whole run).
> 2. **A residual measured at "zero live instances" AND "honest priority: low" is a NOTE UNDER ITS
>    PARENT ITEM, not a numbered backlog item.** Numbering it makes a guard for a property that
>    currently holds compete for capacity with work that moves launch — and it is what grew the floor
>    in W-6.4. Items **120, 126, 140, 143, 144, 149, 152, 153** are hereby **PARKED**: leave the text
>    exactly where it is, do not pick any of them by default, and do not renumber anything.
> 3. **Every new check must name, in one sentence, the LEARNER-VISIBLE failure it would have caught.**
>    §50 blocks (i) and (j) pass this test cleanly — a stale caption an inch from the curve, and a
>    figure that inverts its own lesson, are both things a person would see. Item 152's proposed
>    regex over `LessonVisual.jsx` props does not obviously pass it. **If the sentence cannot be
>    written, the check is not due.**
> ⚠️ **What this rule is NOT saying.** The residual-filing *discipline* — closing an item and filing
> what you found rather than smuggling it into the same commit — is one of the best habits in this
> log and must not stop. **The defect is that the filed residual then becomes the next pick by
> default.** File it; do not turn around and pick it.
>
> ### W-6.3 — the instrument-to-app ratio is now a number to watch, not a rule to obey.
> No threshold is set, deliberately: several of this week's instruments were plainly worth it (§28c
> caught an invisible focus ring across the entire build; the a11y state matrix caught bars drawn 9px
> tall at 320px; §59 caught two safety guards blind to the start of every paragraph — all three were
> real, learner-visible, and shipped). **The number in W-6.0 is here so the next run that proposes a
> check has to look at it first.** Quote it, re-measure it, and say which side of it the proposal
> falls on.
>
> ### W-6.4 — the floor is over budget, and the CAUSE is W-6.2, not insufficient compression.
> `npm test` warns every run: the non-archivable floor is **313,522 b against a 250,000 b budget**,
> growing **+3,834 b per commit**. The backlog alone is **285,978 b** — it is now the floor. Archiving
> cannot touch it (W-5.3), and two compression passes have already run.
> **The link nobody has drawn: each residual filed under W-6.2's habit is a 2-4 KB richly-argued
> backlog item that its own author labels low priority.** That is the growth. **Compression treats the
> symptom; W-6.2 rule 2 treats the cause.** Item 115's two options for the owner remain open and this
> review does not pre-empt them.
>
> ### W-6.5 — ✅ closed as written, and then RECURRED. The live instance is W-7.3 above, which is open.
> **What was true (2026-08-30):** `market.json` sat at `asOf 2026-08-28` with no commit on 08-29 or
> 08-30, and this clause predicted the Sector screen would go stale on about 09-02. **It did not:**
> the job resumed, committing 08-31 and 09-01 (`55c0c15`, `18769e0`). **What is true now:** a second
> gap is open — no refresh commit since `20fde17` (`asOf 2026-09-04`), measured 2026-09-06 — and it
> is **W-7.3's**, not this one's. Item 74 has the mechanism; `STALE_AFTER_DAYS` is 4. Owner's
> scheduled job either way: flagged, not touched.
>
> ### W-6.6 — O-3 restated, because the scale changed again and the decision has not.
> The economy track is now **complete in all five languages** and the money track shipped four new
> lessons. `npm test` reports **es/ko/zh/ja at 100% reviewed, 0% human** — every word of four
> languages is unreviewed machine translation, and 48 of 176 lesson/language pairs are still condensed
> summaries rather than translations (item 93/94). The "(Beta)" decision in `DECISIONS.md` was made
> on 2026-08-11 about a smaller, static surface. **Re-affirm it or cap it — owner's call, unchanged
> and now larger.**

> ## PRIORITY BLOCK W-5 — set by the weekly review 2026-08-23. Supersedes the 2026-08-16 block below (W-1 through W-4 all closed). Read this first.
>
> **The week was strong and the direction is right; this block is about a stop line, a ratio, and four
> pieces of housekeeping.** The one real risk it named is that a single item consumes 100% of capacity
> with a tail long enough to eat the next two weeks.
>
> ### W-5.1 — ✅ **FULLY DONE 2026-08-24** (scheduled dev-agent). All three steps landed; the stop line held.
> **Outcome:** the economy phase **closed**, with the `essentials` remainder filed as **new item 94**.
> `npm run translation-completeness` reported **48 abridged pairs — es 12 / ko 12 / zh 12 / ja 12** and
> **0 abridged pairs anywhere in lessons 12-40**: the main path is fully translated in all five
> languages. Cost: **seven runs**, which is what W-5.1 budgeted.
> **The reasoning that still binds, and the reason to keep it after the work is done.** `economy`
> (29-40) is the **main path** since the 2026-08-18 product reversal; `essentials` (1-15) is the
> *optional* track. Finishing economy is a statable, checkable milestone and cost seven runs; finishing
> `essentials` costs roughly **twenty-four more runs**, on the optional track, before a single person
> has read a word of any of it (O-1). **Item 94 exists precisely so that continuing is a decision
> someone makes rather than a tranche that keeps going**, and W-5.2's ratio rule still binds on it.
> **Re-measure the rate before budgeting any of it** — the per-language rates do not transfer (`ko` ran
> at 0.379 added chars per English char, `zh` at 0.226, `ja`'s reference is 0.50); item 93 records that
> neither inherited the other's, and carries the fuller density bands.
>
> ### W-5.2 — ⛔ **EXPIRED 2026-08-24 when item 93 closed; REPLACED BY W-6.2 ABOVE. Do not act on
> the ratio below — it is scoped to an item that no longer exists.** The ⚠️ pick-list warning at
> the end of this clause is STANDING and still binds. Original text kept for the reasoning:
> **reserve one run in four for work that is not item 93.**
> Twenty of the week's last twenty-four commits were item 93. That is defensible for a sprint and
> corrosive as a habit: it is the W-2 note-chain failure in a new costume — direction stops coming
> from the backlog and starts coming from "continue the tranche". **Every fourth scheduled run picks
> from this list instead**, and says in its entry which one it took and why:
> - **W-5.5 / W-5.6 / W-5.7 below** — cheap, and two of them are documentation-integrity defects.
> - **Item 26** (Quizlet/Vocabulary design review) and **item 27** (re-scope: the money track's
>   visuals shipped, so the item as written no longer describes the gap).
> - **Item 76** and **items 70/71** — process items filed by runs that could not finish them.
> - A **backlog refill** is always a legitimate pick (W-2's standing rule, still in force).
> ⚠️ **The standing lesson this list taught, which is about pick lists and not about any item on it.**
> Item 67's and item 64's residuals sat on this list for seven days after the work was done, and three
> run entries copied the line forward verbatim before a run finally checked the items themselves. **A
> list of candidates is a claim about current state and goes stale exactly like a figure does — re-read
> a candidate's own item before picking it.** (Only the live line was corrected; the run-log entries
> that repeat it are dated records and stay verbatim, per §31.)
>
> ### W-5.3 — the archiving rule. ✅ **DONE 2026-08-23**, and the rule below is STANDING; leave it here.
> ⚠️ **The 600 KB in the next sentence is a DATED figure as of 2026-09-08.** The owner raised
> `FILE_CEILING` to **850,000 b** that day (`DECISIONS.md`, closing item 115). The rule's own
> date-vs-byte defect is untouched by that and is still item 115/121 territory; **read the live
> thresholds off `check-log-size.mjs`, never off this clause.**
> **The rule:** when `AGENT_LOG.md` exceeds **600 KB**, the next run moves run-log entries older than
> the most recent weekly-review boundary into `AGENT_LOG.archive.md`, in one commit that touches
> nothing else. That is a legitimate whole run. **Backlog items, the App summary and the Environment
> note are never archived.**
> ⛔ **This rule has a KNOWN DEFECT and has fired twice without moving anything. Read this before
> trusting it.** The trigger is a **whole-file byte count** and the action clause is a **date**, so
> nothing makes the two agree: on both 2026-08-23 and 2026-08-26 everything older than the boundary it
> names had already been archived while the file kept growing past the trigger. Rewording the clause
> once (rolling seven days → most recent review boundary) did not fix it, and **option (b), re-pointing
> the trigger at a run-log byte count, would not either** — it moves the trigger while the action
> clause stays date-based. A corrected rule must make the action clause **byte-driven**: archive whole
> days, oldest first, until the run log is under target. **That is a rule change and it is the owner's
> to make** — a run must not pick unilaterally, because it changes what every future run reads to
> orient. See **item 115** (the owner's two options) and **item 121** (`scripts/check-log-size.mjs`,
> which measures both budgets on every `npm test` and prints the whole-day cut plan without performing
> it).
> ✅ **A PASS RAN 2026-08-29 (scheduled dev-agent) — the rule above is UNCHANGED and its defect is
> still open; only the action was taken.** 2026-08-26 and 2026-08-27 moved to the archive (21 entries,
> 199,064 b), taking the run log from **330,738 b to 132,195 b**. The trigger acted on was **not** the
> 600 KB clause above — the file was 3,730 b under it — but `check-log-size.mjs`'s hard budget, which
> the run log would have hit in **1.9 commits**, at which point `npm test` exits 1 and *no run can
> commit anything*. The two rules disagreed about whether anything was due, and only the newer one
> could stop a build. **This does not settle item 115**, and a run must still not reword the clauses
> above. **The floor is untouched and is now the only budget over its limit: 265,532 b of 250,000 b.**
✅ **A SECOND PASS RAN 2026-08-30 (scheduled dev-agent).** 2026-08-28 moved (12 entries, 122,768 b),
run log **256,308 → 133,567 b**, file **597,412 → 474,671 b**. Same shape as the 2026-08-29 pass: the
trigger acted on was the *measured* warn budget, not the date clause, which was a no-op for a fourth
time. **The defect in the rule above is still open and still the owner's (item 115).**
✅ **A THIRD PASS RAN 2026-09-01 (scheduled dev-agent).** 2026-08-29 moved (10 entries, 85,449 b),
run log **266,511 → 181,070 b**, file **576,464 → 491,023 b**. The run-log budget is now CLEAR at
72.4% of warn; the floor is untouched at 309,953 b and remains the only budget over its limit
(item 115, the owner's). Same shape as both earlier passes — the trigger acted on was the measured
warn budget, and the date clause was a **no-op for a fifth time**.
✅ **A FOURTH PASS RAN 2026-09-03 (scheduled dev-agent).** 2026-09-02 moved (23 entries, 185,529 b),
run log **236,983 → 51,449 b** (94.8% → 20.6% of warn; 1.46 → 22.3 runs of headroom), file
**603,842 → 418,308 b**. Containment 23/23 against `git show HEAD:AGENT_LOG.md`, 0 leaked, 5 retained,
one-byte plants dead 0/23. The floor is untouched at **366,859 b** and remains the only budget over
its limit (item 115, the owner's).
⛔ **New evidence for item 115, and it is the strongest yet: this is the first firing where the 600 KB
whole-file trigger was genuinely OVER — 603,842 b — and the pass was STILL a no-op under the rule's
own action clause**, which moves entries older than the most recent review boundary (W-6's, 2026-08-30)
when both live days were after it. **Triggered and inert at the same time**, for the sixth firing
running. The earlier five no-ops could be read as the trigger merely being early; this one cannot.
The pass acted on the measured warn budget, as the four before it did. **No clause was reworded.**
⚠️ **WITHIN-DAY ORDER — REWRITTEN 2026-09-08 (ninth pass), because the instruction that stood here
would have corrupted that pass.** It read: *"within a day the archive reads OLDEST-FIRST, reversing
the live log's newest-first … A pass that appends a day verbatim ships it backwards. Reverse the
day."* **Both of its premises are now false, and each was measured this time rather than re-read.**
(1) **The eighth pass did NOT reverse.** Its `## Archived 2026-09-06` section is heading-for-heading
identical to the live file at `82be17d` (18/18, `cmp` on the extracted heading lists) — a verbatim
append. (2) **The live log's within-day order FLIPPED on 2026-09-07, from newest-first to
oldest-first**, and nothing recorded it: on 09-06 the first entry in the file is the 20:11 commit and
the second is 18:08 (descending), while on 09-07 the first is the 00:24 commit and on 09-08 all nine
entries sit in exact ascending commit order. Verified against `git log` author timestamps, not file
position (item 142).
✅ **So the rule is now simply: append the day VERBATIM and reverse nothing.** That is what the
archive header already promises ("these are the original entries, moved verbatim"), it is what the
eighth pass actually did, and it is what keeps each archived day a faithful record of how the live
file read — including the 09-06/09-07 direction change, which the archive now preserves rather than
smooths away. ⛔ **Do not "fix" the archive to a single uniform direction**: those days genuinely were
written in opposite orders, and flattening them would make the archive disagree with history.
⚠️ **The 2026-09-05 incident the old note cited is unchanged and is why this still needs a reader:**
`npm test` passes 0 failures on a section in either direction, so nothing enforces this. The check
that survives is the one that does not depend on which direction is current — **diff the archived
day's heading list against the live file's for that day at the commit before the cut, and require
them equal.**

⛔ **But the reason this pass nearly did not happen is the durable part, and it is a defect in the
instrument, not in the rule.** The previous two runs both read the script's own headroom line and
concluded the pass could wait: it reported **101.3 runs** of room. The honest figure was **6.6**.
See the note under **item 121** — the projection divided headroom by a mean that includes archiving
commits, so *the act of archiving made the next archiving pass look unnecessary*. **Fixed this run.**
⚠️ **AND A NOTE THE NEXT PASS MUST READ, filed here rather than as a numbered item (W-6.2 rule 2).**
**`npm test` cannot detect archive loss.** Proven by plant, not by inspection: deleting a whole
9,168 b entry from `AGENT_LOG.archive.md` and re-running the suite gives **0 failures**. Nothing
checks that what left the run log arrived in the archive. **So "tests pass" is not evidence that an
archiving pass was faithful** — the only evidence is a verbatim containment check of every moved
entry against a pre-cut copy, plus a corrupted-plant negative. Do both, in-run, and report the count.
✅ **The 2026-09-01 pass did exactly this and reported 10/10** — and improved the recipe in one way
worth keeping: **the pre-cut copy does not have to be a scratchpad file.** `git show HEAD:AGENT_LOG.md`
IS the pre-cut copy, so the whole containment proof is reproducible from the repo by a reviewer who
was not present for the run. A scratchpad copy proves it only to its author.
**No check was built for this** (W-6.2 rule 3: no learner-visible failure; W-6.3: `scripts/` is
already 2.3x `src/`). If a future owner decision makes archiving routine enough to be worth guarding,
this note is the case for it.
✅ **A FOURTH PASS RAN 2026-09-01 (scheduled dev-agent).** 2026-08-30 and 2026-08-31 moved (18
entries, 181,059 b), run log **246,225 → 65,166 b** (98.5% → 26.1% of warn), file **571,669 →
390,610 b**. The date clause was a **no-op for a sixth time** — the most recent review boundary is
2026-08-30 and nothing in the log predated it — so the trigger acted on was again the measured warn
budget, at **0.34 runs of headroom**. **Two days were moved where one would have cleared the budget**,
and that is a judgment a future pass should repeat or refuse deliberately rather than inherit: one day
buys about 7 runs at the measured +11,052 b/commit of writing, which at this cadence is half a day and
makes the pass a daily chore; two days buy **16.7**. Nothing is deleted either way, and the floor is
untouched at **325,444 b** (item 115, the owner's).
**Containment: 18/18**, re-derived from `git show HEAD:AGENT_LOG.md` per the recipe above rather than
from the transform's own buffer, **with two plants, both fired**: one character changed inside a moved
entry → 17/18, exit 1; a whole 6,058 b entry deleted from the archive → 17/18, exit 1. Both plants were
written to scratchpad copies of the archive and never to the file.
⚠️ **The archive's own title had been stale since the 2026-08-29 pass** — it read
`(2026-08-01 → 2026-08-28)` while the file held entries through 08-29. Corrected to 08-31 this run.
That title is the one line in that file every reader passes without reading, which is why it rotted
through two passes that each had it open.
> ⚠️ **And a fact the cut plan cannot see, learned by cutting: A DAY IN THE RUN LOG NEED NOT BE
> CONTIGUOUS.** 2026-08-27 was two blocks 367 lines apart, because the log switched from append-order
> to prepend-order mid-day. Taking "a day" as one region would have split it; concatenating blocks in
> file order would have written the archive out of sequence. **Order entries by their commit
> timestamps, not by their position in the file.** Filed as **item 142**.
✅ **A SIXTH PASS RAN 2026-09-05 (scheduled dev-agent).** 2026-09-04 moved (16 entries, 172,235 b),
run log **244,006 → 71,770 b** (97.6% → 28.7% of warn; **0.59 → 17.4 runs** of headroom), file
**650,705 → 478,469 b**. Containment **16/16** byte-identical against `git show HEAD:AGENT_LOG.md`,
0 leaked, 6 retained; the mover was proven first on a *planted* copy (16 MOVE + 6 KEEP plants, each
landing exactly once) and its two refusal guards fired for the right reason. The date clause was a
**no-op for the eighth firing running**; the trigger acted on was the measured warn budget, as in all
five previous passes. **No clause was reworded.** The floor is untouched at **406,699 b**.
✅ **A SEVENTH PASS RAN 2026-09-06 (scheduled dev-agent).** 2026-09-05 moved (14 entries, 147,690 b),
run log **289,013 → 141,323 b** (115.6% → 56.5% of warn; **7.3 runs from the 350,000 b FAIL** → 12.1 runs
of headroom). Containment **14/14** byte-identical against
`git show HEAD:AGENT_LOG.md`, 0 leaked, 16 retained, each landing exactly once; the whole-corpus
non-blank-line multiset across both files is unchanged (md5 `6789576d…`, 4 blank lines normalized at
entry boundaries) and the never-archived floor is **byte-identical** (md5 `2dccb4a5…`). The mover was
proven on a planted copy first (14 MOVE + 16 KEEP plants, a dead plant returning 0 so absence is real)
and both refusal guards fired for the right reason while leaving the files identical. **Order confirmed
against `git log` timestamps, not just by reversal** — oldest `ba7fd0d` 00:15 opens the section, newest
`a01246b` 22:19 closes it. The date clause was a **no-op for the ninth firing running**; the trigger
acted on was the measured warn budget, as in all six previous passes. **No clause was reworded.**
**The floor: the archiving MOVE took 0 b out of it — byte-identical, proven above.** What moved it
is this run's own writing into it: the collapse above **−574 b**, this record **+2,075 b**. ⚠️ **The
resulting total is deliberately NOT retyped here.** W-7.2 rule 4 exists because a block measured its
region *before* inserting itself into it, and every correction I made to that figure changed it again.
**Read `check-log-size.mjs`'s MEASURED line** (floor, backlog, run log — generated every `npm test`)
and compare the backlog against W-7.2 rule 5's **425,473 b** baseline for 2026-09-13.
✅ **A NINTH PASS RAN 2026-09-08 (owner-directed: "do the archiving pass next").** 2026-09-07 moved
(17 entries, 167,613 b), run log **250,908 → 83,295 b** (100.4% → 33.3% of warn), file **706,382 →
538,769 b**, leaving 2026-09-08 as the only live day. Conservation proven the reversible way:
re-inserting the block **read back out of the archive file** reassembles byte-identically to
`git show HEAD:AGENT_LOG.md` at 706,382 b, with a one-character tamper as the negative control so
"identical" is a comparison that can fail; containment **17/17** headings present in the archive, 0
left behind. The eighth pass recorded itself only in the run log, which this pass has now archived —
its numbers are in `## Archived 2026-09-07`. **No clause was reworded**; the within-day order note
above WAS rewritten, and that is the pass's real finding rather than the cut.
⛔ **This pass answers the note below, and the answer is "not yet, and here is the evidence".** A
mover scripted on 2026-09-06's convention would have **reversed 2026-09-07 and corrupted it**: the
live log's within-day direction flipped that same day, and the standing instruction to reverse was
already false when it was read. **Freezing a hand-recipe into a script is only safe once the recipe
has stopped moving** — this one moved twice in three days (the 09-05 inverted section, then the
direction flip). The step that would actually have caught both is not the mover but the *assertion*
above: archived day == live day at the commit before the cut. Build that first, and the mover second.

📝 **Note for the next pass, filed rather than built (W-6.2 rule 2 — a NOTE, not a numbered item).**
Seven passes have each reimplemented the move by hand, and the one defect that has actually shipped —
the inverted 09-04 section — is the step a script would never get wrong. This repo has twice concluded
that a standing manual recipe belongs in a script (`npm run clean-tree`, `npm run deploy`: *"nobody
should have to remember"*). **The counter-argument is W-6.3**: `scripts/` is already ~2.2x `src/`, and
W-6.2 rule 3 asks what learner-visible failure it would catch — **none; no learner can see an
out-of-order archive.** So it is not due as a *check*. It may be due as *automation of a standing
action*, which is a different question, and this note exists so the next pass decides it deliberately
instead of hand-rolling an eighth mover. A working one is in this run's scratchpad, not committed.

> **Why the shape of this file changed underneath the rule.** W-3 wrote it on 2026-08-16 when the run
> log was **~93%** of the file. By 2026-08-26 the backlog was the larger half, so archiving every
> run-log entry still left a floor no archiving pass could reduce. **That floor is the number to watch,
> and only a backlog-compression pass can move it.**
>
> ### W-5.4 — ✅ **DONE 2026-08-24** (scheduled dev-agent). 37 `##` run entries demoted to `###` across both files, plus their **276 subsections to `####`** — which the item as written did not ask for.
> The run log is now uniformly `## Run log` > `### entry` > `#### subsection`. `check-backlog.mjs`
> finds the backlog by scanning to the next `^## `, so a `##` entry landing above the Environment note
> would silently truncate the check — that is why the level matters.
> ⚠️ **Method note for the next structural pass, and the reason this item is worth keeping.** Measured
> before editing, the fix as scoped **would have made 36 entries worse**: the 37 `##` entries were
> correctly nested internally while the newer `###` entries were flat, so demoting only the entry line
> would have traded a top-level defect for a same-level one. **Measure the *shape* — entry level AND
> child levels — not just the level of the line the item names.** A per-entry child-level tally is what
> exposed it; counting `^## ` alone cannot. Fence-awareness was checked too (0 headings inside code
> fences, fences balanced in both files), since this log is full of pasted output.
>
> ### W-5.5 — ✅ **DONE** (headline), by the item-93 runs. **The standing rule below is STANDING; leave it here.**
> The item opened at **"68 of 160"** against a measured 62 — a count quoted in prose that nothing
> re-derived. **The rule: re-read the count off the script and update BOTH the headline AND the
> stop-line box inside item 93, in the same commit.** The box is the second place, and a premise
> correction on 2026-08-23 found it drifted to 56 while the headline was correct — the first version of
> this rule named only the headline and so did not cover it.
>
> ### W-5.6 — ✅ **DONE 2026-08-23** (scheduled dev-agent). `LAUNCH_READINESS.md` §10.4 now carries item 93's finding.
> §10.4 now publishes the per-language reference ratios, the abridged-pair count, and — the part that
> makes the work schedulable — the **concentration** of the shortfall, instead of framing the
> five-language surface as undifferentiated "maintenance debt". Against nothing, `zh` at 0.28x reads as
> Chinese being compact; against `zh`'s own fully-translated reference of 0.35x it means a fifth of the
> content is absent. **A ratio without its reference is not a measurement** — that is the transferable
> part.
> ⚠️ **Two premise corrections from re-measuring, both worth keeping because both look like bugs and
> are not.** (1) `LAUNCH_READINESS.md` says the build fails if §10.4's character sentence disagrees
> with live content, while `check-data.mjs` §11b says character counts are *deliberately not guarded*.
> **Both are true and they are different guards** — `refresh-readiness.mjs --check` owns the character
> sentence, `check-data.mjs` §11b owns the coverage percentages and explicitly excludes char counts.
> (2) `refresh-readiness.mjs` and `translation-completeness.mjs` report **different English corpora —
> 137,249 vs 140,700 characters.** The gap is **exactly the section headings (3,451 en chars, proven by
> direct computation with a control)**: the first counts bodies + takeaway + thinkAbout, the second also
> counts headings. **The ratios survive it** (es 0.981 vs 0.985, ko 0.469 vs 0.470, zh 0.294 vs 0.295,
> ja 0.359 vs 0.361), so the two can be quoted in one row — but only because that was checked, and
> §10.4 now says so.
> ⚠️ **ANNOTATION 2026-09-04 (scheduled dev-agent) — the clause above is a dated record and stays
> verbatim (§31 / item 91); this note exists so the next run does not copy its numbers forward again.**
> **Every figure in (2) has since moved**: re-measured today the two corpora are **150,608 vs 154,302**
> and the gap is still **exactly the section headings**, now **3,694** — the *claim* held, all four
> *numbers* did not. Item 89's paragraph and §10.4's note were the two places they had been retyped,
> and by today they had drifted from each other as well (this clause says `ja 0.359 vs 0.361`; §10.4
> said `ja 0.412 vs 0.412`). **§10.4 no longer restates any of them** — the note there now carries the
> claim and names `npm run readiness` / `npm run translation-completeness` instead, so there is nothing
> left to go stale. **Do not "correct" the numbers above; they are what was true on 2026-08-23.**
>
> ### W-5.7 — note only, no action: four uncommitted US-English edits are in the owner's working tree, and two of them touch protected text.
> `DECISIONS.md` and `LAUNCH_PLAN.md` each carry two unstaged one-word changes (`judgment`→`judgment`,
> `catalog`→`catalog`, `theater`→`theater`, `color`→`color`). **The reviewer did not touch them and
> no run should.** Flagged because two of the four fall inside the exception item 91 deliberately
> honored — quotations and dated records stay verbatim: the `catalog` edit is inside a blockquoted
> **dated verification note** whose own next sentence reads *"Deliberately not corrected: rewriting a
> dated verification falsifies it"*, and the `color` edit rewrites a **quotation** of the old §3.1.2's
> opening line (`"One accent colour per lesson/phase"`), which makes the quotation no longer a  <!-- us-english:allow: verbatim quote -->
> quotation. **Owner's call, and only the owner's.**

> **PRIORITY BLOCK — weekly review 2026-08-16. ✅ ENTIRELY CLOSED (W-1, W-2, W-3, W-4), superseded by
> W-5 above. Kept only for the four standing rules below; the work chronology is in the run log.**
>
> **W-1 standing rule — browser verification is available to scheduled runs. Use it on every UI change.**
> This block existed because of a *regression in what the agent knew about its own environment*: a run
> proved live browser verification worked, and two later runs then asserted from memory that
> `preview_start` is unavailable to unattended scheduled runs and deferred verification to "a future
> interactive session". **Both were false**, and the bad assumption silently degraded the verification
> standard of six shipped UI features. **The rule: a run that changes rendered UI must either verify it
> in a live browser using the Environment note's technique, or state specifically what it tried and
> what error it got — never assert a capability limit from memory.**
>
> **W-2 standing rule — refill the backlog rather than extending a note chain.**
> Seven of eight consecutive runs picked their work from the previous run's "Next run should pick" line
> rather than from this backlog. That chain produced good work, but it is a structural failure: the
> *backlog* stops being the place direction lives, and "remaining actionable areas are thin" becomes a
> symptom of an unrefilled backlog rather than of a finished product. **A run that finds nothing to
> pick should write backlog items** — re-read `LAUNCH_PLAN.md` §4.3/§5/§9 and propose Phase-0-facing
> work — **rather than extend a note chain. That is a legitimate, valuable run.**
>
> **W-3 — the run log's first archive, and the compression precedent this file keeps re-using.**
> Superseded operationally by W-5.3's rule above. What still binds is the **compression method**, first
> applied here to items 17 and 24 (63 and ~80 lines down to 27 and 39): keep each item's current
> status, its standing guidance and its reproducible method; drop the accreted "Update, `<date>`"
> chronology, which is not lost because it is in the run log. Deliberately **kept** in that pass: item
> 24's verbatim owner intent (the "wise rather than impulsive" quote) and its §10.1 tension guidance,
> item 17's reproducible measurement method and its `lessonContent.money` chunk-size caution, and both
> items' failure-mode warnings. ⚠️ **Two staleness bugs surfaced only because someone compressed:**
> item 17's "118/120 minutes" and **item 24's lesson-id references, which predated the 2026-08-14
> renumbering and were simply wrong**. **Lesson ids quoted in pre-2026-08-14 run-log entries are stale;
> `src/content/lessons.js` is the source of truth.**
>
> **W-4 — small correctness/a11y cleanups. ✅ FULLY CLOSED 2026-08-16**; six items, all verified in a
> live browser before and after. Two are worth remembering as method: the glossary-row `aria-label`
> finding was **CONFIRMED against the live accessibility tree, not by reading code** (removing the
> label in the live DOM made the suppressed definition text appear), and `MarketSignals.jsx`'s dead
> `counterReset` was **confirmed inert in a live browser before deleting**, with the rendered list
> byte-identical afterward. See the run log.
>
> **Not a priority, and deliberately so:** more lesson content. Both §4.3 content clauses are met. A run
> that wants to add or deepen a lesson must first say which *unmet* gate it moves — there currently is no
> content-side gate left, so the honest answer is "none." The single remaining Phase-0 clause is item 18's
> ≥40% lesson-1 completion rate, and it is blocked on an owner action (an analytics provider account), not
> on more content. **Item 18 is now the entire critical path to ending Phase 0** — flag it to the owner in
> every run's output until it moves.

> **BACKLOG REFILLED 2026-08-17 (owner-directed), items 55–59.** Derived by reading `LAUNCH_PLAN.md`
> §0–§11 end to end and checking each clause against the actual `src/` tree — not carried forward from a
> run-log note. Every one names the plan clause it serves, every one is unblocked today, and **every
> number below was measured, with a control where the measurement could silently return zero.** They are
> listed in value order; a run may disagree, but should say why.
>
> **Two candidates were measured and NOT filed, which is half the value of a refill:**
> - *§3.3's opt-in daily reminder.* It does not exist — but `src/lib/useAppState.js:188` already says so
>   in a comment, and correctly attributes the blocker to the **held §2.1 platform decision** (a static
>   web page cannot notify a closed tab without a service worker and push infrastructure). The code is
>   already honest; filing an item would just restate it. **Owner-blocked, not backlog work.**
>   > ⛔ **PREMISE CORRECTED 2026-08-31, and this bullet is the reason the defect lived 28 days.**
>   > *"The code is already honest"* was measured on the **comment**, not on the **string a learner
>   > reads**. The comment was honest to a developer; the button underneath it said **"Remind me
>   > tomorrow"** in all five languages — `ko` *"내일 알림 받기"* and `zh` *"明天提醒我"* say **notify
>   > me** outright — and it fires on the first lesson completed each day, which for a new learner is
>   > the first lesson they ever finish. **Two conclusions in this bullet were each right about one
>   > surface and wrong about the other:** "already honest" was true of the comment and false of the
>   > UI, and "owner-blocked" was true of the *reminder feature* and false of the *copy* — rewording
>   > a button needs no platform decision. **The transferable part, which this log has now paid for
>   > in a fourth costume (item 108's proxy, §28c's focus ring, the VIX bands): a developer-facing
>   > comment is not evidence about the learner-facing surface it sits above.** Fixed 2026-08-31 —
>   > the CTA is now a commitment the learner makes ("I'll be back tomorrow"), true as shipped, with
>   > `optedIn` unchanged so a real reminder feature can still read it. The reminder itself remains
>   > correctly owner-blocked. (The `:188` pointer is also stale — the block is at `:216-233` today.)
> - *§3.0.7 WCAG AA contrast.* `theme.js` claims "Contrast for both palettes is verified in
>   `index.css`", and `index.css:91` points at a "contrast note above" **that does not exist**. So the
>   claim is unverifiable as written — but computing it says the claim is **true**: every ink×surface and
>   ink-on-fill pair in both palettes clears 4.5:1, **0 violations**. Filed as **59** at the bottom, and
>   deliberately marked low value: it guards a property that currently holds, which is worth doing
>   cheaply and worth nobody's afternoon.

55. **✅ DONE 2026-08-17 (scheduled dev-agent). Pruned to "Completed and pruned" below as
    `former item 55`; the diagnosis is kept here because three of its five findings are worth not
    re-deriving.** See the run log.

56. **✅ DONE 2026-08-17 (owner-directed pick). Pruned below as `former item 56` — but read the
    correction first, because this item's premise was false and its evidence was an artifact.** See the run log.

57. **✅ DONE 2026-08-17. Curation rules 1 and 2 are now DATA (`deliberatelyUnlinked`, 33 entries)
    enforced by `check-data.mjs` §17b, so "unlinked" can no longer be mistaken for "undefined".**
    See the run log — the item's own 11 occurrences were all deliberate exclusions, and it could not
    see the one real gap by construction.
    > **STANDING NOTE for whoever measures this surface again: §17b sweeps only the keys in
    > `glossary.js`.** "0 unexplained" therefore means every *glossary term* is accounted for — **not**
    > that §3.0.3 is satisfied. Jargon with no glossary entry is invisible to it. That residual is
    > item 60. **Re-run the control too**: the first measurement returned 0 because glossary entries
    > key the term at `en.s`, not `term.en`, so the matcher compared objects and matched nothing.

58. **✅ DONE 2026-08-17 — the doc-vs-tree sweep ran; 13 contradictions listed with file:line in the
    run entry, fixes filed as item 61.** None needed the owner, contrary to the item's prediction.
    > **The transferable pattern, worth not re-deriving: a "measured `<date>`" annotation is LEAST
    > trustworthy when its date matches the change it sits above.** Same-day figures get written
    > before the day's work finishes. Grep `measured 20` and `as of 20` in `src/` and `scripts/`,
    > not just in the Markdown docs.
    > **Cheapest disposition for a stale count inside an argument that does not need it: delete it**,
    > rather than correcting or guarding it.

59. **✅ DONE 2026-08-17 (scheduled dev-agent). `check-data.mjs` §28 now asserts AA on 108 pairs
    (54 per palette) every `npm test`, and the note's own figures are machine-checked. For the fifth
    item running the premise was partly wrong, and this time it was the half that named a defect.**
    > **Two things worth not re-deriving.** (a) The pair set is **derived by prefix, not listed** —
    > affordable only because the full cartesian product passes, so nothing needs exempting; if a
    > future palette edit makes one pair fail, resist adding an exemption list, because that is the
    > hand-maintained shape F10 was filed against. (b) `--ink-on-fill` must stay out of the ink list:
    > it is `#ffffff` in light mode, so pairing it with `--surface-canvas` manufactures a 1.0:1
    > failure for a pair the app never renders.

63. **✅ DONE 2026-08-17 (scheduled dev-agent). Light `--graph-neutral` was given a value, the four uses
    are classified, and `check-data.mjs` §28b enforces 3:1 on 70 graph×surface pairs. For the ninth item
    running the premise was partly wrong — and this time BOTH of its headline numbers were, in the
    direction that had made the item look optional.** See the run log.
    > **The hex this headline used to quote was stale for four days and cost two wrong figures in
    > shipped code comments (item 125).** It said `#7c8494`, the value this run set; the 2026-08-23
    > warm repaint moved the token and nobody re-read the headline. **The value is deliberately not
    > restated here** — restating it just re-arms the trap. `src/index.css` is the palette; read it
    > there. Enforced by `check-data.mjs` §52.

72. **🟡 DEV-AGENT HALF DONE 2026-08-17 (scheduled dev-agent). The build is deployable and the
    clicks are written down; the OWNER HALF — choose a host, drag the folder, hold the URL — is the
    only thing left and it cannot be done from here. Keep flagging it in every run's output until it
    moves, alongside item 18. Do not re-pick this item to "improve" the deploy docs; the refuting
    number is a URL, and no amount of further writing produces one.**

74. **✅ CLOSED 2026-09-08 (scheduled dev-agent)** — replaced by its conclusion per W-7.2 rule 1; the
    measurements, the controls and the refuted half are in this date's run-log entry.
    **What was true when it was filed (2026-08-17):** a deployed copy's `market.json` freezes at build
    time, so after `STALE_AFTER_DAYS` (**4**) the Sector-performance screen stops showing figures —
    §2.3 working as intended — and **nothing owned the rebuild**. The item's own recommendation was
    *"cheapest real answer is probably not a script: connect the host to the repo, and the existing
    job's commit is the trigger."*
    **What is true now:** that is exactly what shipped. `.github/workflows/deploy-pages.yml` (owner
    decision 2026-09-07) publishes on every push to `main`, so a deploy follows a commit and no human
    has to remember a drag-and-drop. **The item's headline gap is closed by the host migration, not by
    this run.**
    ⛔ **But the gap MOVED rather than vanished, and this is the part to keep: the deploy follows a
    PUSH, and nothing owns the push.** Measured 2026-09-08 from `origin/main`'s reflog: pushes happened
    **2026-08-26 00:15**, then not again until **2026-09-07 22:06** — a **twelve-day gap**, inside which
    the daily market commits of 09-01, 09-02, 09-03 and 09-04 all landed. They reached the live host
    only when eight owner-directed pushes went out on 09-07 for an unrelated reason. The scheduled
    market job **commits and does not push**, and a dev-agent run is forbidden to. So the live site's
    market data is current **by coincidence**, not by ownership. → **filed as owner action O-5.**
    ✅ **What this run built, because it is the half a run CAN own — noticing.** `npm run check-deployed`
    now computes the age of the market.json **the live host actually served** against
    `STALE_AFTER_DAYS` (imported from `src/lib/useMarketData.js`, never restated) and projects the date
    the live Sectors screen goes dark, as an **advisory that never touches the verdict** — the header's
    standing rule, kept, because a guard that reds every few days for an expected reason is a warning
    nobody reads. A `--today` flag makes the projection exercisable on any day.
    ⛔ **And the defect that made this worth a run rather than a note:** `check-market-freshness.mjs`
    reads the file **in the tree** and then said *"Reference → Sectors is ALREADY rendering the
    unavailable state — on the live site, for anyone who opens it."* That is a claim about a host made
    from a file on disk — W-7.1's guess, in `npm test`, on every run. Three messages corrected to say
    what they measured and to point at the check that owns the live half.
73. **✅ DONE 2026-08-20 (scheduled dev-agent). The audit's three §10 blindspots are now
    `LAUNCH_PLAN.md` §10.8/10.9/10.10 and claim D3 is `CLAIMS.md` row 16 (§9.1 says "16 claims").**
    See the run log for the full staged wordings and the two premise breaks.
    > **STANDING METHOD, and this item broke on it twice: find the sentence by its TEXT, never by a
    > line number.** `LAUNCH_PLAN.md:529` was correct when filed and was line 549 a day later —
    > twenty lines of unrelated owner edits above it. A line-targeted edit would have silently
    > corrupted an unrelated sentence.
    > **B-1's refuting number is measured against `src/` APPLICATION CODE, not all of `src/`.**
    > Against all of `src/` the ratio is ~1.1-1.25x and the tripwire reads "not refuted" in the very
    > window that produced the finding; against application code it is 7.5-10x. D3's check date is
    > **2026-09-05** and the item records how to measure it.

77. **✅ DONE 2026-08-19/20 by the owner's own commit `5633b79`, not by a dev-agent run — which is
    why it sat here marked blocked. Confirmed by measurement, not by reading the commit subject.**
    See the run log.
    > **⚠️ DO NOT "fix" a track-count failure by relaxing the count. This was measured.** The
    > `essentials` track is registered in the readiness figures; a run that loosens the assertion to
    > make `npm test` green is removing the thing that caught a real split.

84. **✅ DONE 2026-08-20 (owner-directed) — 237 cross-references converted from numbers to titles
    across five languages, guarded by `check-data.mjs` §16b (proven by injection).** See the run log.
    > **⚠️ THE CORRECTION, and it is why no figure filed in this item should be trusted: the headline
    > count was WRONG BY 80%** — filed as 128, actual 237. **The reference style, so a future run
    > matches it:** the quoted title *head* (text before the colon).

87. **✅ DONE 2026-08-20 (owner-directed, interactive) — a wrong-target reference found only because
    the title rewrite forced every reference to be resolved.** See the run log.

85. **✅ DONE 2026-08-20 (owner-directed, interactive).**
    - **⚠️ KNOWN BOUNDARY, written into the code rather than left implied.** The pattern is English
      month names, so a Spanish "marzo 2026" or a Japanese "2026年3月" still passes. Closing that needs
      a per-language date vocabulary, which item 85 did not scope. What this covers is the English
      source the translations are made from, which is where such a figure would enter the app.

86. **✅ DONE 2026-08-20 (owner-directed) — a factual error found by reading the bodies, fixed in
    all five languages: lesson 6 named only one of the two ways a taxable account is taxed. All four
    translations carried the same error in compressed form.** See the run log.

80. **✅ DONE 2026-08-20 (owner-directed, interactive) — found by the first live QA sweep of the
    `essentials` track. The reader's `Previous` button walked straight through locked lessons.**

81. **✅ DONE 2026-08-20 (owner-directed, interactive) — surfaced by the same sweep. Practice was the
    one surface still printing a raw lesson id.** See the run log.

82. **✅ DONE 2026-08-20 (owner-directed, interactive) — built as scoped, and the item's own premise
    turned out to be UNVERIFIABLE with the instrument available here. Read the instrument note.**
    - **⚠️ THE PREMISE I COULD NOT PROVE, stated plainly because the item told the next run to verify
      against the live accessibility tree and that instruction does not work as written.** This item
      claimed "a `<section>` without an accessible name is not exposed as a landmark region". In the
      `read_page` accessibility tree here, a **bare `<section>` with no name at all still renders as
      `region`** — I stripped the attribute from all three in the live DOM and the tree was unchanged.
      So the before/after difference this item was filed to produce is **not observable with this
      tool**, and any future run that "verifies" a landmark fix by seeing `region` in `read_page` has
      verified nothing.

83. **✅ DONE 2026-08-20 (owner-directed, interactive).** See the run log.

79. **✅ DONE 2026-08-20 (scheduled dev-agent) — built as scoped, and the item's own proposed wording
    was measured to be FALSE in one of the states it has to cover.**
    - **⚠️ THE CORRECTION, and it is the reason this item is worth reading rather than skimming.**
      The item scoped the copy as "the newest reading we have is from {date}, **which is too old to
      show**". That sentence is **false in a state `isStale` also covers**: `freshness()` returns stale
      for a date more than `FUTURE_TOLERANCE_DAYS` (1) *ahead* of the device clock, which
      `DECISIONS.md:82-91` established deliberately (item 44). Reproduced live before writing any copy —
      `asOf: 2026-09-30` rendered `Market data isn't available right now. (As of 2026-09-30)`, a date
      **41 days in the future**. So the shipped key says **"too far from today"**, which is true in both
      directions, and it stays one key rather than two. Do not "improve" it back to "too old".

78. **✅ DONE 2026-08-20 (owner-directed). `check-data.mjs` §30 covers `src/utils/date.js` — the
    app's whole notion of "today", which the market-data staleness contract and the review scheduler
    both rest on. This is regression cover, not a bug fix, and the filing run said so.** See the run
    log — the premise was wrong in both directions at once, which is why §30 is not the section this
    item described.

88. **✅ DONE 2026-08-20 (owner-directed, same day it was filed). Filed by the run that closed item
    64, built by the next one. The premise held and the two-sided control fired exactly as scoped.** See the run log.

89. **✅ DONE 2026-08-20 (scheduled dev-agent). The three stale lines are repaired the §29 way —
    dated Update appended, line marked historical — and §31 now reads `DECISIONS.md` too. Unusually,
    the premise held on every hit it named — every line number and every verdict checked out. What it
    got wrong was the disposition.** See the run log.

90. **✅ DONE 2026-08-21 (owner-directed, same day it was filed). Both mismatches fixed by the `#`
    count, guarded by `check-data.mjs` §32b, and the file is now 36/36 consistent. The item's count
    was right and complete — a whole-file sweep found exactly the two it named, no more.**

91. **✅ DONE 2026-08-21 (owner-directed: "sweep everything except the dated records"). 123 lines
    swept across 32 files; 10 kept, each with a recorded reason.** See the run log.
    > **⚠️ The item's own headline count was WRONG (~69 vs 123) because the scan used `analys[ei]s`,
    > which flags two correct US spellings while missing the entire `-ise`/`-ised`/`-isation`/`-iser`
    > family.** Three passes were needed before it stopped finding new forms. **If a guard is ever
    > wanted, the honest scope is learner-visible strings only.**
    > **`AGENT_LOG.md` and `AGENT_LOG.archive.md` are excluded by design, per §31** — run-log entries
    > are dated records. So are quotations. That exception is why two of the owner's own US-English
    > edits were flagged and left alone (W-5.7).
    > ⛔ **CORRECTION 2026-08-27 (item 128's run): this item's closing claim — "the final whole-repo
    > scan returns exactly the 10 intended exclusions and nothing else" — was FALSE on the day it was
    > written, and the run log's entry for it is a dated record that stays verbatim, so the correction
    > lives here.** Measured against the tree at this item's own commit (`git archive 9232cd0`):
    > **nine British spellings in `src/` and seven in `scripts/` sat outside the exclusion list**,
    > all in code comments, including a `colour` — a form this item's entry lists as one it fixed.
    > The 123-line result and the 1,316-string learner-visible result are both sound; only the
    > whole-repo sentence overstated its instrument, which walked values and not comments.
    > **The advice at the top of this item was right and has now been taken**: the guard exists as
    > `check-data.mjs` §55, scoped to learner-visible strings. See items 128 and 130.

92. **✅ DONE 2026-08-21 (owner-directed, same day it was filed). One string changed — "Borrowing
    gets dearer" → "gets more expensive" — and the item's premise held exactly: a two-pass sweep of
    all 1,316 learner-visible English strings found ONE genuine instance, the one this item named.** See the run log.

93. **✅ ECONOMY PHASE CLOSED 2026-08-24 (filed 2026-08-21). The main path is fully translated in
    all five languages — `npm run translation-completeness` reports 0 abridged pairs across lessons
    12-40 in every language. The remainder (48 pairs, `essentials` 1-11 and 14, identical in `es`,
    `ko`, `zh` and `ja`) is tracked as item 94. DO NOT PICK THIS ITEM AGAIN; do not roll 94 back
    into it.** Full detail — six tranches per language, the defect examples, the per-run arithmetic —
    is in the run log.
    > **STANDING RULE (from W-5.5), and it has fired three times.** The abridged-pair count is re-read
    > off `npm run translation-completeness` by whoever touches this item, **in the same commit**, in
    > **all three places**: this box, item 94's headline, and `LAUNCH_READINESS.md` §10.4's prose. It
    > has read a stale 68, 60, 56, 54 and 50; it is **48** as of 2026-08-24.
    - **The density bands, which are what item 94 needs and must not be re-derived.** A translated
      lesson lands at **`es` 1.02-1.20** (median 1.119), **`ko` 0.45-0.60**, **`zh` 0.285-0.357**,
      **`ja` ~0.50**. These are *language* numbers: do not target another language's band, and do not
      read a low ratio as abridgement across languages. Above ~1.25 in `es`, check for added
      sentences. **The bands were fitted on `economy` lessons only — item 94 says to re-fit on
      `essentials` 12, 13 and 15 before budgeting.**
    - **The rising-reference drag applies to `es` and NOT to `ko`/`zh`/`ja`.** `ABRIDGED_BELOW` is
      0.7x each language's own p90, so in `es` every completed lesson lifted the bar and pushed
      untouched lessons under it. In `ko` the p90 did not move at all (0.5510 before and after),
      because the already-complete money track occupies the top decile. Expecting the drag elsewhere
      causes a false alarm.
    - **Track boundaries, read off `lessons.js`'s `track` field:** `essentials` **1-15**, `money`
      **16-28**, `economy` **29-40**. This item said "money 12-28" in four places for two days. **Do
      not use "12-28" to scope work.**
    - **Why no check saw any of this, and the trap it still sets.** `check-data.mjs` asserts
      *presence* and *structural agreement with English*; a field that exists, is well-formed, agrees
      with English and carries a quarter of its content passes every one. **`translation-review-ledger.json`
      read 100%/0-stale for months over exactly this content** — it records that a reviewer saw the
      text, not that the text is all there. **A green ledger is not evidence about this item.**
    - **Three defect shapes, all needing reading rather than a ratio: bare list** (rule headings with
      no body), **partial enumeration** (three of five gauges), **whole-list omission**. Plus two
      specific warnings: **`zh`/`ko` lesson 30 §1 is different content, not an abridgement** — check
      `ja` 30 before assuming it is a translation — and **`《》` in Chinese is not exclusively a
      lesson-reference marker** (lesson 22's are article headlines), so any guard treating it as one
      will false-positive.
    - **The `es` currency defect does not generalize — measured, do not re-derive.** `ko` writes the
      long scale correctly and `zh`/`ja` contain no `$` at all. One instance, already fixed, no
      guard warranted.

94. **[Content — filed 2026-08-24 by the scheduled dev-agent as W-5.1 step 3, when item 93's economy
    phase closed. This is the `essentials` remainder, deliberately filed as a SEPARATE item rather
    than rolled into 93, because it is a different body of work with a different priority.] 48 of 160
    lesson/language pairs — the whole of the `essentials` track — ship a condensed *summary* rather
    than a translation. `es` 12, `ko` 12, `zh` 12, `ja` 12: lessons 1-11 and 14, identical in all
    four languages.**

    > **⚠️ READ THIS BEFORE PICKING IT UP. This item is NOT a continuation of item 93, and the case
    > for doing it is materially weaker than the case for the work that just finished.** Item 93 was
    > P1 because it was on the **main path** — the track the 2026-08-18 product reversal made the
    > product. `essentials` (1-15) is the **optional** track. At the demonstrated and very consistent
    > rate of **2 pairs per run**, 48 pairs is **~24 runs ≈ 6 days of scheduled capacity**, in four
    > **"(Beta)"-labeled** languages, for an app that **no one has yet opened in any language (O-1)**.
    > **The weekly review's W-5.2 rule still binds** — at most one run in four on translation work —
    > and on this item that ratio should if anything be more conservative, not less.
    > **Recommendation from the run that filed it: do not start this until O-1 is resolved.** A
    > deployed URL would tell us whether anyone reads the optional track at all, which is exactly the
    > evidence needed to decide whether these 48 pairs are worth six days. Filing it here so the work
    > is *scoped and schedulable*, not so it is *scheduled*.

    - **Why it is cheap to resume when the time comes: everything item 93 learned transfers.** The
      per-language density predictors, the ceiling arithmetic, the paragraph-parity check, the strict
      figure multiset, the control-before-negative-result discipline and the three named defect shapes
      (**bare list**, **partial enumeration**, **whole-list omission**) are all recorded in item 93
      and its run-log entries. Read item 93's bullets first; do not re-derive them.
    - **One thing that does NOT transfer, measured 2026-08-24.** Item 93's density bands were fitted
      on `economy` lessons only. `essentials` lessons are shorter and more list-shaped than `economy`
      lessons, and item 93 already records that the ja:ko predictor loses all precision on short
      fields. **Re-fit the band on `essentials` lessons 12, 13 and 15 — the three that are already
      fully translated — before budgeting anything here.** Those three are the only in-track
      reference points that exist.
    - **The abridged set being identical across all four languages is new, and it is an opportunity.**
      Every previous phase of this work was per-language. Here the same 12 lessons are abridged in
      every language, so a single English-side read of a lesson scopes the defect for all four at
      once. **Read once, translate four times** is available on this item and was not available on 93.
    - **O-3 applies to this item with more force than it did to 93.** Human review share is 0% in all
      four languages. 93 at least added unreviewed prose on the path the product is about; this item
      would add ~48 pairs of it to the optional track. **The owner should be asked before this starts,
      not after** — see O-3 at the top of this backlog.

    > **NOTE ADDED 2026-08-31 by the run that audited §3.0 clause 2 — a SECOND, independent content
    > defect on this same track, measured the same day. Filed here rather than as a numbered item
    > (W-6.2 rule 2 + W-6.4), because it is the same decision as the one above: is the optional track
    > worth spending runs on before O-1?** §3.0.2 says *"Concrete before abstract. Lead with a thing
    > that happens to a person, then name the concept."* **`essentials` 10, 11, 12, 13, 14 and 15 —
    > six consecutive lessons — each open by defining their subject** ("A W-2 and a 1099 are both tax
    > forms…", "Mutual funds and ETFs charge an annual fee called an expense ratio…", "A brokerage
    > account is just a container…", "A will is a legal document…", "A credit report is a detailed
    > record…"). **`essentials` 1-9 are nine for nine concrete-first** — Maria, James, Elena, "Picture
    > a neighborhood of a thousand homes". The habit stops at lesson 10 and never returns.
    > **Cost, and why it is bigger than it looks:** unlike `money` 24 — which was fixed the same day
    > by inverting two paragraphs, because its scene was already written — **none of these six
    > contains a concrete scene anywhere in the lesson to promote.** Each needs a scene authored from
    > nothing, then carried into `es`/`ko`/`zh`/`ja`, on lessons that are *also* on this item's
    > abridged list. **So do it in the same pass as the translation work above, not separately** —
    > the "read once, translate four times" opportunity applies to both defects at once, and doing
    > them apart pays the five-language cost twice.
    > **The measurement, so nobody re-derives it:** first two sentences of section 1, screened for a
    > named person or a scene verb, 44 lessons, three controls fired (29 and 1 must read concrete, a
    > synthetic definition-first opener must read abstract). The screen has a **measured 3-in-13
    > false-positive rate** (lessons 35, 39 and 26 use a metaphor, an analogy and a concrete scenario
    > and satisfy the clause without a name or a scene verb), so **it is a reading aid and must not
    > be turned into a build gate** — that is why no check was built. See the 2026-08-31 run-log
    > entry for the full method and the false-positive list.
    > ⛔ **THE AUDIT'S OWN ARITHMETIC DID NOT CLOSE, and it was four days before anyone noticed —
    > corrected 2026-09-04 (scheduled dev-agent) by re-running the screen with its own three
    > controls.** The 2026-08-31 entry says *"Ten are real"* and then names **seven**: `essentials`
    > 10-15 and `money` 24. **Three counted defects were never written down**, so the note above —
    > the only place a picker looks — reads as *"the main path is clean and the cluster is on the
    > optional track."* **It is not.** Re-running the strict screen (scene verb or name, in the first
    > two sentences of section 1, controls: lesson 29 and lesson 1 must read concrete, a synthetic
    > definition-first opener must read abstract — all three fired) flags **15 of 44** today against
    > the audit's 13, the difference being scene-verb vocabulary rather than corpus drift. Subtracting
    > the audit's seven named defects and its three recorded false positives leaves exactly three,
    > **all of them `economy` — the track a new install opens on**:
    > - **37 (QE & QT)** — the real one, and the only lesson in the whole flag set with **no person,
    >   no scene and no metaphor of its own** anywhere in the section that carries its claim. Its
    >   "master dial already turned down to 0%" is lesson 35's metaphor, arriving by explicit
    >   cross-reference. ✅ **FIXED 2026-09-04** — a concrete lead in five languages; see the run log.
    > - **34 (the four levers)** and **40 (the three rules)** — **both false positives, and the reason
    >   generalizes.** Each opens with a one-sentence enumerating stem and then goes concrete
    >   *immediately*: 34's ¶1 is *"Think of a city government facing a budget shortfall that lays off
    >   workers"*, 40's second sentence is *"Remember the family from “The Long-Term Debt Cycle”"*.
    >   A screen that reads two sentences cannot tell a definition-first lesson from a **list whose
    >   stem is one sentence long**, and both of these are lists.
    > **So the honest false-positive rate is 6 in 15, not 3 in 13** — the screen is roughly twice as
    > wrong as the note above says, which strengthens rather than weakens its conclusion that it must
    > never become a build gate. **Nothing on the main path is now open under this clause**; the
    > `essentials` 10-15 cluster below is the whole remainder and its deferral is unchanged.


96. **✅ DONE 2026-08-24 (scheduled dev-agent), same day it was filed. The premise re-measured
    exactly — 772 vs 3,294 characters, to the character — and the item's own scope contained one
    impossible instruction; see the premise correction below. [Bug/UX — filed 2026-08-24 by the
    scheduled dev-agent, proved in a live browser with a control. HIGH VALUE, and it gets worse the
    moment O-1 lands.] A lesson whose content chunk fails to load renders as an empty lesson with a
    working "Mark Complete" button — silently, with no error state.** See the run log.

97. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `check-data.mjs` §36, plus an `export`
    on `HTML_LANG` so the coverage half is an exact map comparison rather than a regex. Premise
    re-measured and it held exactly — `documentElement.lang` and `HTML_LANG` had two hits in the whole
    repo, both inside the hook. Scope grew by one assertion the item did not ask for and one the
    item asked for that turned out to be the weak half; see the run-log entry. [A11y/Tooling — filed
    2026-08-24 by the run that fixed the defect, deliberately not smuggled into
    the same commit.] Nothing stops `<html lang>` from drifting out of sync with the picker again.** See the run log.

98. **✅ DONE 2026-08-24 (scheduled dev-agent) — the metadata, the multilingual tab title, the
    guard (`check-data.mjs` §38) and one extension to `check-blindspot.mjs`, in one commit.
    Premise re-measured and it held; two facts the item did not have narrowed the scope, and the run
    found two defects in its own work. See the run-log entry.**

102. **✅ DONE 2026-08-25, same run it was filed — found by a live DOM sweep of the built app, not
    by reading code. `<main role="tabpanel">` and `<nav role="tablist">` exposed NO `main` and NO
    `navigation` landmark, and two of three bottom tabs pointed `aria-controls` at ids that did not
    exist. Zero new locale keys.** See the run log.
    > **Why the app's usual answer did not apply:** five other tablists here are inside a landmark
    > already, so the pattern that is right everywhere else was wrong exactly once.

103. **✅ DONE 2026-08-25 (scheduled dev-agent). Shipped — but as a skip-to-NAVIGATION link, not
    the skip-to-content link this item asked for. Three of the item's premises were wrong, and the
    third one changed the disposition. Read the correction before re-deriving any of this.**

104. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. DECIDED (a): the list
    now sorts by `relativeStrength.rank`, and the 1M/3M/6M control was NOT removed — because the
    item's argument for removing it was measurably wrong. Guarded by `check-data.mjs` §42.**

105. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. Shipped as
    `scripts/a11y-sweep.js` (9 probes, a self-planting control per probe) plus `check-data.mjs` §43
    and an Environment-note procedure. THE ITEM'S OWN PRESCRIBED GATE WAS WRONG AND WAS REPLACED —
    read the correction below before touching the file.**
    - **⛔ PREMISE CORRECTION, and it changed the design rather than a number.** The item specified
      that the script "**must refuse to report a zero unless `document.hasFocus() &&
      document.visibilityState === 'visible'`**". **Measured: both are permanently false in this
      preview pane even when the tab is fronted and the page is demonstrably rendering** — buttons
      measured 139×44, the document 2944px tall, the screenshot correct. That gate would have
      refused to report **anything, ever**: the exact silent-zero failure it was written to prevent,
      wearing the costume of a safety check. **Implemented instead: a per-capability gate.** Hard-gate
      on *live layout* (achievable, provable, and the thing the geometry probes actually need);
      mark only focus-EVENT-dependent probes `UNAVAILABLE`; report `VACUOUS` — never `ok` — for a
      probe that scanned nothing.

115. **✅ CLOSED 2026-09-08 BY OWNER DECISION ("raise the budget") — the option this item held open
    since 2026-08-26 is taken, and the full reasoning is in `DECISIONS.md`.** Collapsed to its
    conclusion per W-7.2 rule 1 from 8,082 b; the six passes' methods and figures are in the run log
    for 2026-08-26, 08-27, 08-30, 09-02, 09-04 and 09-08.
    **What was true:** the never-archived floor was over a 250,000 b budget, and this item held the
    two remedies only the owner could authorize — delete closed items outright, or raise the budget.
    Six compression passes ran against it. **What is true now:** `FLOOR_MAX` is **500,000** and
    `FILE_CEILING` **850,000**; the floor stood at 430,586 b when the decision landed and the suite
    reports **0 warnings on this section for the first time since 2026-08-27**.
    ⭐ **The measurement that decided it, and it is the one to keep: the budget was unreachable by the
    only remedy it named.** This item's fifth pass measured the headline-only projection as
    **invariant to compression** — 254,621 b before a pass and 254,621 b after, identical to the byte
    — because compression and the headline-only cut remove *the same material*. So no number of
    further passes could reopen the option, and the standing warning was evidence the **budget** was
    wrong rather than the writing (item 121's own clause).
    ⛔ **`FLOOR_MAX` and `FILE_CEILING` are COUPLED; never move one alone.** `RUN_LOG_HARD` is derived
    (`FILE_CEILING - FLOOR_MAX`), so raising the floor alone drops the run log's *fail* line below its
    own warn line and fails the suite — measured, not reasoned. A startup assertion now refuses to
    print a verdict from an incoherent pair, proven by injection.
    ⚠️ **Still true and not changed by this:** compression is near its floor under the current rule —
    the remaining closed-item mass is standing rules, traps and `⚠️`/`⛔` blocks that the rule's
    kept-list protects, corroborated from the other direction by the sixth pass declining items 115,
    121, 168 and 125 as protected. **The lever that still works is W-7.2 rule 1**, and the lever never
    pulled is W-6.2 rule 2 — not filing zero-live-instance residuals as numbered items at all.

114. **✅ DONE 2026-08-26 (scheduled dev-agent). Lesson 30 §1 now says "monetary base (M0)" — and
    the matching standard term in each language — and carries a §3.0.3 chip to the `M0` glossary
    entry.** See the run log for three premise corrections, one of which changed the fix.
    > **The one worth carrying: the prescribed wording would have FAILED the build.** §17 requires the
    > section's English text to mention the glossary key or its `en.s`, and a bare "monetary base"
    > is neither `M0` nor `Monetary Base (M0)` — hence the parenthetical in the shipped prose.
    > **§2.3 boundary:** the phrase exists because the 2026-08-02 run removed dated figures from it.
    > Rewording it must not reintroduce a number.

113. **✅ DONE 2026-08-26 (scheduled dev-agent). Shipped as `check-data.mjs` §49 — three
    detectors, each proven against its own sample, plus the two `__selftest_*` call sites as a
    live control. One premise correction below. See the run log.** See the run log.

112. **✅ DONE 2026-08-25 (owner-directed). Both axes shipped — 5 languages × 2 font scales — and
    the app came back clean in all 130 sweeps. The defects were all in the instrument: 12 states
    per language were unreachable because every recipe matched ENGLISH display text. Recipes now
    select by id, position, ARIA, numerals, and labels read from the app at runtime. Residual (a
    static guard) deferred to item 113 because `check-data.mjs` was mid-refactor by another
    session. See the run log.**

111. **✅ RETIRED 2026-08-25 (owner-directed) — no defect. All nine of its states measured clean, so
    the yield stopped at three-for-three. The run shipped `scripts/a11y-states.js` (19 states, each
    with an arrival assertion) + `check-data.mjs` §48 instead, so that a clean answer is
    reproducible in ~1.6s rather than an afternoon of hand-driving. Residual filed as item 112.
    See the run log.**
    - **⛔ TWO PREMISE CORRECTIONS, both to text I wrote myself this morning.**
      **(a)** There is no `Kids.jsx` — the age selector lives in
      `src/screens/reference/ParentGuide.jsx`.
      **(b) The claim that item 109 read the batch-pause and session-complete states "on an
      *unseeded* queue" was simply false**, and item 109's own table says so: it records
      `batch pause (10 of 14)`, i.e. a seeded fourteen-question queue. I had misread item 109's
      seeding-trap paragraph, which is about a seed that silently *reverted*, not an absent one.
      Re-measured on a properly seeded queue: both states reproduce `12` exactly.
    - **The seeding trap is already documented and cost item 109 a reading** — writing `ecycles_review`
      while the app is running does nothing, because `useAppState` holds review state in React and
      saves over it. Do the `setItem` and the reload in the same call.

110. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. Thesis confirmed a third
    time — and the defect was on the one screen with 100% reach. Eleven states swept; the first-run
    disclaimer modal was the only one with a finding. Fixed in two halves (the background is now
    `inert` + `aria-hidden`, and the dialog title is the `<h1>`), guarded by `check-data.mjs` §47.
    Residual filed as item 111. See the run log.**

109. **✅ DONE 2026-08-25 (scheduled dev-agent), the same day it was filed. The suspicion was right
    and the defect was worse than the item guessed: mid-quiz the page had NO `<h1>` at all — its
    entire outline was one `<h3>`. Fixed by making the question the runner's `<h1>` (`headingLevel`
    prop on `<Question>`, default `"h3"` so the lesson reader is untouched), guarded by
    `check-data.mjs` §46 — and the `headingOrder` probe, which called this screen "ok" every time it
    ever ran, was fixed in the same commit. See the run log.**

123. **✅ DONE 2026-08-27 (scheduled dev-agent), the day after it was filed. Shipped as
    `check-data.mjs` §51 — and the item's headline premise was WRONG in the direction that had made
    it look optional: it said "one known instance and it is already fixed", and there were TWO MORE
    STILL SHIPPING.** See the run log.
    > **The correction, kept because it is the reason the item was worth picking.** The item priced
    > itself "low-medium" on the grounds that the class was invisible but empty. Reading the call
    > sites found `AsymmetryChart`'s shared zero line (the two bars ARE their distance from it, and
    > they run in opposite directions) and `CycleChart`'s long-run trend line (`trendLabel` is drawn
    > beneath it and names it, so a caption refers to it). Both were `line.strong`, both measured
    > **1.71:1 light / 1.62:1 dark** on `surface.card` — live, in the rendered DOM, not just from the
    > palette — and both are now `graph.neutral` at **5.24:1 / 4.47:1**.
    > **The generalizable half: no `--line-*` token clears 3:1 against ANY surface in either palette
    > (28 pairs, worst 1.75:1).** So a meaningful line-token graphic is a defect *by construction* and
    > no shade of the token fixes it — which is why §51 is a call-site rule, not a color threshold.
    > §51a machine-checks that premise so the rule cannot outlive its own justification.
    > ⛔ **What §51 does NOT cover, stated so the next run does not assume it does.** It matches SVG
    > paint attributes. `AsymmetryChart`'s zero line was a `borderTop` on a positioned `<div>` —
    > lexically identical to the ~50 correct card borders — and was found by *reading the file*, not
    > by the scanner. That residual is **item 124**.

124. **✅ DONE 2026-08-28 (owner-directed, as one half of item 135). Built exactly as this item's
    "shape that could work" specified — a live-DOM probe rather than a widened source pattern —
    and proven firing on a REAL figure, not only on a plant.**

125. **✅ DONE 2026-08-27 (scheduled dev-agent). The one stale figure is gone, the standing rule is
    now enforced by `check-data.mjs` §52 — and the item's own hypothesis was REFUTED: nothing else
    moved in that repaint.** See the run log.
    > **The premise correction, and it is the reason to keep this item rather than prune it.** The
    > item predicted a sweep "would find whatever else moved in the same repaint." It was run across
    > all of living text — the backlog, the App summary, the Environment note, the five standing
    > docs, and all 72 files under `src/` — and found **exactly one real defect, item 63's headline**.
    > Three other hits were false positives — two are registered, and the third was this item's own
    > original text, which no longer quotes the hex — and all three are instructive: two name a token while
    > quoting the *other* side of a pair, and `lessons.js`'s comment is flagged **because it exists to
    > argue that lesson 32's decorative accent is not `--graph-amber`**. **This was a defect, not a class.**
    > **Standing rule, unchanged and now enforced: a hex quoted in this log is a dated observation,
    > not the palette.** Read the token out of `src/index.css` every time, including when a closed
    > item states it confidently.
    > **Disposition of item 63's headline, per item 58's rule (a stale figure inside an argument that
    > does not need it is deleted, not corrected).** The hex is **not restated** with a fresh value —
    > restating re-arms the trap four days later. The headline now says the run gave the token a
    > value and points at `src/index.css`.
    > ⚠️ **§52's scope is narrower than this item imagined, and that is stated in the code rather
    > than implied: it catches a hex sharing a LINE with the token it misattributes.** A hex whose
    > token is named a paragraph away, or referred to only as "the amber", is invisible to it. The
    > small register is a measured result, not an omission. Residual filed as **item 126**.
    > **The run log and `AGENT_LOG.archive.md` are deliberately OUT of scope** (§31 / item 91: an
    > entry that recorded "3.76:1 at `#7c8494`" was true when written). That exclusion is not
    > cosmetic — injection 5 removed the boundary and a dated entry's injected probe value
    > immediately failed the build.

127. **✅ DONE 2026-08-29 (scheduled dev-agent). Shipped as `scripts/numerals.mjs` + `check-data.mjs`
    §61, with §53(f) now per-language and §21's caption read rather than asserted about. Read the two
    corrections below before extending any of it.** See the run log.
    - **The decision the item left open, made on measurement:** the **numeral normalizer**, not
      §54(e)-style label anchoring — labels are not available here, because lesson 17's claim *is* its
      numerals. Scoped to Arabic digits + myriad units (`만/万/萬`, `천/千`, `억/亿/億`, `조/兆`);
      deliberately no Chinese numeral characters and no written-out English, the corpus using digits
      throughout.
    - ⛔ **THE ITEM'S CHARACTERIZATION OF §21 AND §50 WAS WRONG, and the truth is slightly worse.**
      It said the blind spot "applies to §21's and §50's figure-vs-prose checks". Neither had a
      body-prose check at all: both pin literals and assert **about** prose ("the caption states these
      figures in all five languages") with nothing reading it. §21 is fixed; **§50 is not — see item
      150.**
    - ⚠️ **THE INSTRUMENT TRAP THIS ITEM WARNED ABOUT HAS A FIFTH CASE IT DID NOT NAME, and it is the
      one that bites.** Korean `만` is *both* the myriad marker and the particle "only". Lesson 7's
      Korean caption says `$4,000만 30% 구간에` and the first draft of the parser read it as
      40,000,000, reporting a figure as missing that is plainly there. **The fix is NOT a
      currency-prefix rule** — that was tried and the corpus refuted it, since the Korean markets copy
      writes `$6000억`. It is that **a thousands-separated mantissa never takes a myriad unit**:
      measured over the whole corpus, 58 digit-runs are followed by a unit char, 57 genuine and none
      with a comma, 1 false and it has one.
    - **Where the controls live now:** §61 asserts the parser against 9 specimens as **exact set
      equality**, 4 of them refutations a greedy parser fails. §21's and §53's own per-language
      controls prove the instrument is *on*; §61 is what proves it is *right*.

128. **✅ DONE 2026-08-27 (scheduled dev-agent), the same day it was filed — but read the premise
    correction, because the item's headline was three times too small, its file list was missing a
    rendered surface, and the real finding is about item 91 rather than about a word.** See the run log.
    > **The item said "8 occurrences in one file, honest priority: low." Measured: 11 occurrences
    > across 8 lines, plus a fourth coupled surface the item's own fix-list omitted
    > (`quizText.en.js`, a rendered quiz explanation), plus `specialised` in the same lesson body and
    > `favour` in a rendered answer option — 36 British spellings across 11 files in total.**
    > ⛔ **The correction that matters is to item 91's closing claim, and it is the reason this stopped
    > being a spelling nit.** Item 91 (2026-08-21) closed with *"the final whole-repo scan returns
    > exactly the 10 intended exclusions and nothing else"*. Re-measured by extracting the tree at item
    > 91's own commit (`git archive 9232cd0`, read-only) and re-running the scan: **nine British
    > spellings sat in `src/` outside that exclusion list on the day it was written**, plus seven more
    > in `scripts/` — and `colour` is a form item 91's entry lists as one it fixed. Its trustworthy
    > number came from walking 1,316 **learner-visible strings**, a corpus with no comments in it;
    > the "whole-repo" sentence claimed a scope its instrument never had.
    > **The transferable lesson, and the reason the fix was a guard and not a rename: a style rule
    > with no instrument is a claim, not a property.** Six days after item 91, lessons 42-44 shipped
    > "Labour income" — the term lesson 42 *defines* — into lesson prose, a legend label, a caption
    > and a screen-reader description, and nothing noticed. Closed by `check-data.mjs` **§55**, scoped
    > exactly as item 91's own closing advice recommended (learner-visible strings only).
    > ⚠️ **Two traps this run hit, both worth not re-deriving.** (1) A blanket `labelled`→`labeled`
    > replace rewrites **`aria-labelledby`**, a real ARIA attribute name (17 occurrences repo-wide);
    > it broke §44 inside this very run. (2) A sweep instrument whose extension list omits **`.mjs`**
    > reports "0 occurrences across 0 files" for `scripts/`, which reads exactly like clean.

129. **✅ DONE 2026-08-27 (owner-directed: "do item 129 next"), the same day it was filed. Coverage
    restored 77% → 84% in all four languages. The premise held — and the reading found a defect the
    rename had nothing to do with, which is the case for reading over re-stamping.** See the run log.
    > **The premise was proved, not assumed:** the English delta since the reviewed state is exactly
    > **12 word-level hunks, 11 `labour`→`labor` + 1 `specialised`→`specialized`**, measured with a
    > controlled differ (a planted prose change reported 2 hunks; a self-compare reported 0).
    > ⛔ **The finding: `ja` lesson 43 wrote 「急を要すもの」, the archaic `要す` where modern Japanese
    > takes the attributive `要する`** — unrelated to the rename, and **a re-stamp would have vouched
    > for it**. Confirmed against the app's own Japanese rather than from memory:
    > `lessonContent.essentials.ja.js` conjugates the same position correctly, so the corpus
    > contradicted itself. Fixed.
    > **Two deviations were recorded and deliberately left** (`ko` 42's rendering of "the four
    > thousand dollars" as the per-person $1,000; `zh` 44's "far more than people usually realize"
    > for "unusually well protected"). Neither misstates a figure or breaches §10.1. **Over-editing a
    > language whose only check is this review is the larger risk** — that judgment is the reusable part.
    > ⚠️ **What this does NOT establish.** Every mark is `method: "ai"`. Per
    > `scripts/translation-review.mjs`'s reviewer-of-record note this is real content review but **not**
    > a native-speaker pass, and the correlated-blind-spot caveat applies. **Human review share is
    > still 0% in all four languages** — that is O-3, and it is the owner's.

131. **✅ DONE 2026-08-28 (owner-directed: "do items 131 and 132 next") — 28 of 28 pairs, coverage
    95% → 100% in all four languages, 7 stale → 0.** Collapsed to its conclusion 2026-09-08 per W-7.2
    rule 1 from 6,461 b; the per-tranche chronology and the superseded figure corrections are in the
    run log for 2026-08-27 and 2026-08-28.
    **What was true:** seven lessons were flagged stale against their reviewed-English hash, and this
    item scoped the work as a re-stamp, one language per run. **What is true now:** all 28 pairs were
    **read in full**, not re-stamped, and the reading found defects no consistency check could reach.
    ⭐ **Five findings that outlive the item, which is why it is collapsed rather than deleted.**
    1. **A uniform omission is invisible to every cross-language check in this repo.** Lesson 1 named
       María in §1/§2 while **all four** translations had dropped her introduction from §0 — and
       because they agreed with each other, §16 (which verifies translations against English, not
       English against sense) could not see it. **Reading is the only instrument for that class.**
    2. **A lesson's rendered surface spans `lessonContent` AND `moneyVisuals`.** Normalizing the `es`
       body's two spellings on that file's majority was wrong; the live page then showed the other
       spelling from a different module. **"The majority in this file" is a sample, not a convention.**
    3. **Count code points, not `wc -m`, on any CJK corpus.** `wc -m` counts bytes with no UTF-8
       locale set (three Han characters report 9), inflating ko/zh/ja roughly threefold. Ratios
       survived because both sides were measured the same way; absolute figures did not.
    4. **A hash over the source language cannot see drift in the target.** Staleness truthfully said
       "the English moved a little" while the *translations* had grown 2.8x–4.7x — ~29,000 characters
       of never-reviewed machine translation that the flag called a re-review and which was a **first**
       review.
    5. **A pair whose source has not moved is not thereby correct.** Lessons 1 and 4 were
       byte-identical to their reviewed state and the read still found the defect in (1).

134. **✅ DONE 2026-08-27 (owner-directed: "do item 134 next"), the same day it was filed — shipped
    as `check-data.mjs` §56, with 33 live repairs. Read the premise correction: this item was wrong
    about the size of the problem AND wrong about the design, and the design error was the one that
    would have shipped a check that fails on correct prose.**
    > ⛔ **"Zero live instances as of this entry" was wrong by 33.** The item measured `lessonContent`
    > only. Re-measured across the twelve modules §55 walks, in all five languages: **`zh` carried 8
    > corner-bracket spans and 25 ASCII-single-quote spans — 33 in 15 strings across 5 modules** —
    > against its own 152 full-width quotations. `en`, `es`, `ko` and `ja` were clean. **The hand
    > review that found 2 of these missed 33 of the same family, because it was only looking where it
    > was reading.**
    > ⛔ **"The title/non-title join is the load-bearing part" was exactly backwards — it is the main
    > FALSE-POSITIVE source, and building it would have failed the build on correct copy.** Several
    > lesson-title heads are ordinary common nouns. `locales.ja.heroInsight` writes 「取引」 quoting the
    > concept — the English at that spot is a plain *"transactions"*, no lesson reference — and the
    > join would have flagged it as a mis-bracketed title. Lesson 44's own title
    > (`The Part the Word “Passive” Leaves Out`) would have been flagged too, for containing quotes.
    > **§56 therefore reads REPERTOIRE, not role**: which marks each language may use at all, decidable
    > from the character, no sentence understanding, no false-positive class.
    > **The honest cost, stated in §56's header rather than hidden: it does NOT catch the `ja` title
    > drift** that this item was half-filed for. Telling a title reference from an ordinary quotation
    > needs context; that stays with review. It does catch the `zh` drift, and it caught 33 more.
    > **Also corrected: `ja` uses `『』` for SEVEN coined labels, not six** — the sixth-vs-seventh is
    > `moneyVisuals`, outside `lessonContent`, which is the same scope error as the headline.

136. **✅ DONE 2026-08-28 (owner-directed: "do item 136 next"). `figureClaims` now covers 7 of 11
    primitives; the remaining four are documented as deliberately uncovered WITH the measurement
    behind each, so no future run has to re-derive them. 2 of 5 built, 3 declined — read the two
    corrections, because this item dismissed its strongest candidate in a line and misdescribed
    another.**
    > ⛔ **`BracketStack` was grouped with `Bar` as rendering "values whose only relation is
    > proportional to the number beside them". That describes `Bar` and not `BracketStack`**, whose
    > caption opens *"Below the old income line the two stacks are **identical**"* — an equality
    > between rendered boxes in two different columns, the same shape as `outcomeGrid`'s claim and
    > the same shape as the defect that shipped there twice. Built. Measured live: the shared bands
    > render **65.17px and 78.22px in both columns**, and `minHeight: 2` cannot bind (smallest band
    > 13.03px).
    > ⛔ **The strongest candidate of the five was not discussed at all: lesson 3's `GrowthCurve`**,
    > whose own text states four render claims — same starting point, one line straight, the other
    > curving, and a gap that widens. Built.
    > **THE TEST THAT DECIDED BOTH, and it is the transferable part.** Every one of these claims is
    > true of the source arithmetic **by construction** — which is exactly what refuted
    > `ProportionBar`. The question that separates them is **whether a CONTEMPLATED edit breaks it**.
    > For `GrowthCurve` one exists with a date: item 137 gave lesson 23 a log y-axis on 2026-08-28
    > and declined to do the same here on judgment alone. Measured in the real plot box, a log axis
    > **swaps the two descriptions** — the "straight" line bends from **0 → 6.69** off its chord
    > (2.7 stroke widths) while the "curving" one flattens from **15.61 → 0.01**. Proved on the LIVE
    > figure, not only a plant: injecting that axis fired both halves (7.36px vs a 2.75px stroke;
    > 0.01px), and restoring the points returned the sweep to 0.
    > **The three declined, on measurement rather than judgment:** `YieldCurve` and `CycleChart` are
    > **hardcoded SVG path constants** — no data→render mapping exists to break, so a claim would
    > assert a literal against itself (a stronger reason than this item's "no stated quantity",
    > which was wrong: their orderings *are* stated). `Bar` is the one case where this item's own
    > reasoning holds, and it **prints each value as text above its bar** — the same property item
    > 137 used to keep `GrowthCurve` linear. **`ProportionBar` stays refuted; do not rebuild it.**
    > ⚠️ **Latent false positive now written into the probe: `data-figure` sits on the PRIMITIVE.**
    > `GrowthCurve` is generic and only lesson 3 uses it, so claim and caption agree today. A second
    > lesson drawing two curving lines through it would inherit a claim its caption does not make.
    > **Fix is to move `data-figure` to the call site, not to loosen the claim.** The same latency
    > already applies to `lossAsymmetry` and `outcomeGrid`.

137. **✅ DONE 2026-08-28 (scheduled dev-agent). Lesson 23's y-axis is logarithmic; the left edge
    went from 1.64px apart under a 2.58px stroke (0.64x) to 7.00px (2.72x), and `figureClaims`
    reports the figure clean in a live render. Read the premise correction — BOTH of this item's
    stated blockers were larger on paper than in measurement, which is why it had been filed
    rather than shipped.**
    > ⛔ **"`flipDescription` would have to be rewritten in five languages" — FALSE, measured.**
    > A log axis mutes the hockey stick but does not spend it: the $50's last-segment slope goes
    > from **9.68x** the mean of the earlier segments to **3.48x**, still by far the steepest
    > stretch, and it still crosses and still finishes **15.6%** of the plot height clear (was
    > 35.0%). Every clause of the text alternative — "turns sharply upward, crosses above ..., and
    > finishes well above it" — was checked against the rendered geometry and holds. **No content
    > string in any language was touched.**
    > ⛔ **"§50 (f)'s drawability clause would need re-deriving" — FALSE.** That clause tests where
    > the crossing sits **along the x-axis** (5%–95%). A y-scale cannot move it, and the live
    > marker/bracket check confirms it did not.
    > **The trade that IS real, stated so the owner can reverse it in one line** (`flipYNorm` in
    > `moneyVisuals.js`): the late upturn is less dramatic than it was. It was shipped because the
    > alternative is a figure whose caption says "the $65 is simply the better deal" over a
    > picture that draws one line — and because this axis carries no label, gridline or printed
    > value, so a monotone transform spends nothing a reader could have read off it.
    > **Now a property, not a claim:** `check-data.mjs` §50 (i) asserts ≥5% of plot height at both
    > edges (the stroke is exactly 2.5% of plot height at every scale, so that is two stroke
    > widths) **and** that the scale never reorders the curves. Both halves were proven by
    > injection — the old linear scale reports 1.59%, a non-monotone scale reports the reorder.
    > ⚠️ **Deliberately NOT changed: `GrowthCurve` keeps its linear axis.** The same argument does
    > not transfer — that figure **prints its endpoint values as text**, so its axis is readable
    > and a log transform there would misstate numbers a reader can check. A log axis is safe here
    > *because* this one is deliberately unlabeled.

135. **✅ DONE 2026-08-28 (owner-directed: "do item 135 next"), the same day it was filed — shipped
    together with item 124 as `a11y-sweep.js`'s `figureClaims` probe, because they were one probe
    read from two sides. Read the premise correction: the capability BOTH items said "already
    exists" did not, and finding that out fixed a live hole in a different probe.**
    > ⛔ **"The a11y sweep already renders the app and walks each `role="img"` subtree" was false,
    > and it is the sentence both items were built on.** `imagesWithoutAlt` selected
    > `img, svg[role='img']` — an ARIA role on an element the selector could not match. Measured:
    > on lesson 28 the page holds **1** `[role="img"]` and the probe matched **0**, with the
    > control firing on lesson 44's `<svg role="img">` so the selector was proven working rather
    > than broken generally.
    > ⛔ **AND THE SCOPE OF THAT HOLE WAS WRONG TWICE — the second time mine, in the fix's own
    > comment.** I first wrote "two of eight figures are divs", from the two I happened to have
    > open. Parsing every `role="img"` against its owning component says **6 of 11 primitives**
    > are `<div role="img">` — `Bar`, `ProportionBar`, `AsymmetryChart`, `BracketStack`,
    > `GapColumns`, `OutcomeGrid` — i.e. the probe was blind to the **majority** of the app's
    > figures, not to an exception. **The hand count was wrong in the same direction as item
    > 134's: it counted where it was looking.** Nothing shipped unnamed (§22 guards it at the call
    > site), but the probe's claim was broader than its behavior — the lying zero that file exists
    > to prevent, in the file itself. Fixed to `img, [role='img']` in the same commit.
    > **What shipped:** four figures now DECLARE the relation their own caption states, keyed by a
    > language-independent `data-figure` attribute, and the probe checks that and nothing else —
    > `outcomeGrid` (four cells equal), `earningsGap` (the two gap segments equal), `lossAsymmetry`
    > (the loss bar taller), `incomeTradeoff` (labor's dot on the rail, the others clear of it by
    > more than a dot diameter). Deliberately **not** a generic "does this figure look right"
    > check, which would be unfalsifiable.
    > **The measurements are non-trivial, which is the point** — lesson 17's two gap segments render
    > at **7.08px each while their columns are 70.8px and 170px** (and both are above the
    > `minHeight: 4` floor, so the equality is not an artifact of it); lesson 27's bars are
    > **37.5px vs 75px**, the 2x the lesson states; lesson 44's labor dot lifts **0.0px** off the
    > rail against the other three at **48.4 / 72.6 / 96.8** with a 10.3px diameter.
    > **Residual — 7 of 11 primitives still have no declared claim. That is item 136**, and it is
    > deliberate rather than unfinished: a claim is only worth writing where the caption states a
    > checkable relation.

132. **✅ DONE 2026-08-28 (owner-directed) — 8 sentences added, cross-track references now 40/40.
    Read the premise correction first: this item's central claim was wrong by 8 and its
    recommendation was the opposite of what the corpus does.**
    > ⛔ **"These are the only two cross-track pointers in the corpus" — there are TEN.** Measured by
    > resolving every quoted title head in every English lesson body against `lessons.js`'s `track`:
    > **44 quoted-title references, 10 cross-track**, in four directions, not the two this item names.
    > **Eight of the ten were already translated in all four languages**; lessons 1 and 4 were the
    > only gap, 8 instances of 40.
    > ⛔ **Which reverses this item's recommendation.** It said *"do not fix it in isolation —
    > translating one sentence into four languages inside an otherwise-abridged lesson makes the
    > corpus less coherent, not more."* But **lessons 5 and 9 are also `essentials`, also abridged,
    > and their cross-track pointers ARE translated** — lesson 9 (`es` 0.539 / `zh` 0.173) is *more*
    > abridged than lesson 4 (0.684 / 0.227). Keeping the pointer is the corpus's established
    > practice in half the cases, so fixing these two made it **more** consistent. **The item priced
    > the fix against a rule the corpus does not follow.**
    > ⚠️ **Instrument trap, worth not re-deriving: the first measurement said 15 missing and was
    > wrong.** `head()` split titles on an **ASCII** colon, so every `zh`/`ja` head became the whole
    > title and five correctly-translated references read as absent. Caught only because the control
    > was re-keyed to `zh`/`ja` text read by eye. **A split character is a locale, not a delimiter** —
    > item 127's myriad-grouping trap in a new costume.

133. **✅ DECIDED AND CLOSED 2026-08-29 (scheduled dev-agent) — NO PROSE CHANGE, and a guard shipped
    instead (`check-data.mjs` §60). Read the premise corrections first; two of the item's three
    factual claims were wrong, and the third does not lead where the item assumed.**
    > **The original item, kept because the question was a good one:** `ko` uses `대출자` for
    > *lender*, and the word — literally "one who lends out" — is very frequently read as the person
    > *taking* the loan in ordinary Korean consumer-finance usage.
    - **⛔ PREMISE CORRECTION 1 — the alternative the item names does not exist in the corpus.** The
      item measured "`대출 기관` 8". That string, with the space, occurs **0 times**. The corpus uses
      **`대출기관`** (no space), 8 times. A run following the item literally would grep, get zero, and
      conclude the alternative was never adopted — the exact false negative item 127 warns about.
    - **⛔ PREMISE CORRECTION 2 — the eight uses are a different track, and the split is semantic, not
      accidental.** `대출기관` appears **only in `essentials`** (credit scores, mortgages, PMI — where
      the referent really is an institution). `대출자` appears **only in `economy`** (bond buyers,
      credit markets, "foreign lenders") where 기관 would be wrong or narrowing. So "the corpus
      already carries an unambiguous alternative and uses it eight times" is false as an argument for
      swapping: the two words are cleanly partitioned by track and each is right where it sits.
    - **The third claim reproduces, and it still does not warrant an edit.** All **13** `ko` sites
      were read in context this run. Every one is resolvable from its own sentence or its immediate
      neighbors: the apposition `은행, 신용협동조합, 또는 딜러`; the verb `빌려줍니다`; `추가 대가를
      요구`; and in the glossary the explicit contrast `차입자가 내는 금리는 곧 대출자가 얻는 수익`.
      **`대출자` is never used for a borrower anywhere in the corpus.** So this is a readability
      preference in a language with 0% human review, and **item 76's standing rule applies verbatim**
      — rewriting on one run's reading is the unmeasured multi-language drift items 69 and 76 exist to
      prevent.
    - **What shipped instead, and why a guard for a property that currently holds.** The measurement
      generalized: the five languages' *role vocabulary* had never been checked at all. Measured
      2026-08-29 across 5 languages x 3 tracks — **zero role errors anywhere.** `economy` carries
      lender 13x and borrower 3-4x in every language; `es` renders three of English's four
      "borrower"s as **`deudores`** (a correct synonym the item's method would have scored as
      missing); `zh` splits `essentials`' eight lenders as `贷方` 5 + `贷款机构` 3. `check-data.mjs`
      **§60** now asserts, en-anchored, that a track using a role word >= 2x in English has that role
      lexically present in all four translations. It is **presence, not counts** — a count tripwire
      fails on any legitimate rewrite.
    - **The residual that is NOT closed, stated rather than buried:** §60 cannot see a *swap*. A
      translation that used `대출자` for the borrower and `차입자` for the lender throughout would
      keep both roles lexically present and pass. Catching that needs per-sentence alignment, which
      is item 76's instrument and still unbuilt. **§60 catches collapse and drop, not inversion.**

138. **✅ DONE 2026-08-28 (owner-directed: "do item 138 next"), the same day it was filed. Shipped
    as `check-data.mjs` §58, proved able to fail four ways — including by replaying the real
    eight-day defect. Read the two corrections: this item specified the wrong detector, and one of
    its own numbers was a guess.**
    > ⛔ **"Key on the `(in <Track>)` suffix" would have covered 23% of the surface.** Measured: only
    > **10 of 44** references carry that suffix, and they are exactly the 10 cross-track ones — the
    > suffix names the *other track*, so it appears only when the reference crosses one. The 34
    > same-track references are bare quoted titles.
    > ⛔ **"The same-track references are already correct" was UNVERIFIED when this item was filed** —
    > the filing run measured per-language presence for the 10 cross-track references only and
    > generalized to all 44. Re-measured: **176 instances, 0 missing**, so the claim was true. It was
    > still a guess wearing a number, and it was my own entry's.
    > **The design that replaced it, and it is the transferable part: require the target to be marked
    > as a TITLE, not merely mentioned.** Fourteen lesson heads are ordinary common nouns (`Credit`,
    > `Taxes`, `Insurance`, `Transactions`, `Budgeting`), so a substring test accepts the ordinary
    > word and calls a dropped reference present. §58 requires each language's own title marks (§56's
    > repertoire), which **closes the gap §56's header records as out of its reach** — §56 reads
    > repertoire and cannot tell a title reference from an ordinary quotation; §58 knows which spans
    > are references because English says so.
    > ⚠️ **Prefix hazard, found by probing rather than by it firing: `Credit` is a prefix of `Credit
    > Scores` and of `Credit Reports vs. Credit Scores`.** Match extracted spans for **equality**;
    > never `includes(mark + head)`. Both give 44 today; only equality stays right.
    > ⚠️ **§33 looked like it should have caught the original defect and could not**, and the reason
    > generalizes: §33 and its baseline **did not exist on 2026-08-20** (the baseline file was added
    > 2026-08-21 by `e455663`), so it recorded the already-degraded ratio as the norm. **A baseline
    > taken after a defect makes the defect the baseline.**
    > **Scope shipped wider than this item asked:** lesson prose **and** `quizData.explain` — §16's
    > two surfaces, so the title era does not cover less than the numeric era did. **50 references
    > (44 prose, 6 quiz), 200 instances, 0 dropped, 0 unmarked.**

139. **✅ DONE 2026-08-28 (scheduled dev-agent), the same day it was filed. Shipped as
    `check-data.mjs` §28c — 14 ring x surface pairs at 1.4.11's 3:1, both palettes, the ring token
    DERIVED from the `:focus-visible` rule rather than hardcoded. The item's "cheaper 80%" was the
    right shape and its WCAG citation was wrong; read the two corrections below.** See the run log.
    > **PREMISE CORRECTIONS 2026-08-28, both from measuring rather than reading.**
    > **(1) The criterion.** The item cites "WCAG **2.4.11** (focus appearance)". In WCAG 2.2,
    > 2.4.11 is *Focus Not Obscured (Minimum)*; the appearance criterion is **2.4.13, and it is
    > AAA**. The AA bar that actually binds a focus indicator's contrast is **1.4.11**, which is
    > what §28c asserts. 2.4.13's AREA/THICKNESS half remains uncovered — `outline: 2px solid`
    > with a 2px offset is what ships and nothing measures it.
    > **(2) "It currently clears AA everywhere §28 already measures it" — §28 does not measure it
    > at all.** §28 pairs `--ink-*` against surfaces and `--ink-on-fill` against fills; §28b pairs
    > `--graph-*`. **No section paired the ring token against a surface.** That the ring looked
    > covered is a coincidence of the palette: `--ink-accent` and `--fill-accent` hold the *same
    > hex* in both palettes, so §28 was measuring an identical number for a different reason.
    > **The control that settles it:** repointing `:focus-visible` at `--line-hairline` — a token
    > both §28 and §28b exclude — produces **14 failures, every one of them §28c, and zero from
    > anything else in the suite.** An invisible focus ring was green across the whole build.

146. **✅ DONE 2026-08-29 (scheduled dev-agent). The a11y matrix has a third axis — viewport width —
    and §3.0.7's 375px promise now has a stated, refusable measurement behind it.**
    - **What shipped:** `A11yStates.expectViewport(px)` declares the width a session is sweeping at
      and **throws** when the DOM disagrees; `env()` gains `layoutViewportWidth`, `viewportExpected`
      and `viewportMatches` (never silently `true` — `null` means no claim was made); `runAll()`
      gains an unconditional `viewportClaim` line; and `selftest()` gains a two-sided control that
      proves the assertion accepts the true width and refuses a wrong one, restoring any prior
      declaration either way.
    - **The result it was built to state, 2026-08-29 at `resize_window` mobile:** all **19 states
      clean at 375px** — 12 no-reload in one `runAll`, plus all 7 reload-seeded states driven
      individually (`first-run-modal`, `lesson-unfinished`, `lesson-midquiz`,
      `practice-all-questions`, `practice-runner`, `practice-batch-pause`, `practice-complete`).
      `smallTargets` and `horizontalOverflow` — the two probes that exist for this clause — reported
      **12 ok / 0 findings** with **0 vacuous**, over a session in which all 11 sweep controls fired.
      **§3.0.7 holds; it had simply never been said.**
    - ⛔ **The item's own opening premise was FALSE and step 5 caught it — do not re-derive the
      wrong version.** The first draft said the app had never been swept at 375px. It has: the
      **2026-08-04** accessibility pass swept 375px, 320px portrait, 320px + the 130% font step, and
      568x320 landscape, `scrollWidth === innerWidth` everywhere. The true, narrower gap is that
      that pass was **one geometry equality rather than these eleven probes**, and predates this
      matrix (2026-08-25), the storage preconditions, both other axes, the 2026-08-23 warm palette
      and serif pairing, and more than half of today's 44 lessons.
    - **The measurement that justified the item, with its control:** `viewportWidth` appears **zero**
      times in `AGENT_LOG.md` and its archive — no matrix sweep has ever stated a width — while the
      control terms `htmlLang` (8) and `sweepLangs` (18) appear, so the grep was live rather than
      broken. The hazard is the lying zero one level up: **a full sweep at desktop width reports 19
      clean states and reads exactly like a mobile sweep.**
    - ⚠️ **`innerWidth` is not the width the app lays out into, and the delta is not constant.**
      Measured on three screens: Practice cold `375/375` (page does not scroll), Reference `375/360`,
      lesson 1 `375/360` — this harness renders a classic space-consuming scrollbar only where the
      page scrolls, which a phone's overlay scrollbar never does. **A first draft of the code comment
      called the 15px "persistent" from a single sample; that was wrong and is corrected in place.**
      Assert on `innerWidth` (the only figure constant across states), read `layoutViewportWidth`
      **per state**, and never from the summary `env`, which is sampled once after the last state.
      The sweep is therefore *stricter* than a real 375px phone on exactly the scrolling screens, so
      a clean `horizontalOverflow` cannot be a false pass in that direction.
    - **Residual, deliberately not built:** 320px and landscape are in the 2026-08-04 pass and in no
      instrument. One axis with one asserted width is the honest unit of work here — **filed as item
      147** rather than smuggled in.

147. **✅ DONE 2026-08-29 (owner-directed: "do item 147 next"), the day it was filed. All three
    widths swept — and "no new code needed" was wrong: the compounding case found a real defect and
    the run shipped a fix.** See the run log.
    - **The three configurations and what they returned.** 320px portrait: **19/19 states clean**
      (12 no-reload + all 7 reload-seeded). 568x320 landscape: **12/12 clean**, plus the first-run
      modal specifically (the 2026-08-04 pass called it out) — dialog 320px tall, no internal
      scroll, "Got it" button fully visible at bottom 241 of 320. **320px x 130% font: 11/12 —
      one real finding**, below.
    - ⛔ **The item predicted "no new code, unless a width produces findings". A width produced
      findings.** `Reference > Market signals` scrolls the document horizontally at 320px x 130%:
      `scrollWidth=323 vs clientWidth=305`, an 18px overflow, traced to the Fed-balance-sheet
      `Bar` chart's last column ("Second tightening"). **Clean at 320px x 100% and at 375px** — it
      is specifically the compounding case, which is exactly what the 2026-08-04 pass was checking
      for and the reason that configuration is on the list. **Filed as item 148**, because the fix
      is a design call rather than a defect with one right answer.
    - **What this run DID ship, which is the other half of the same screen:** `Bar`'s box height is
      now font-relative. See item 148 for why the horizontal half was separated from it.
    - **Standing note for the next width sweep.** The reload-gated states were swept at 320
      portrait but **NOT at 130% font** — `runAll` covers only the 12 no-reload states, and the
      seven others are three tool calls each. So the lesson and quiz screens are **unmeasured at
      the compounding configuration**. That is a real coverage gap, stated rather than rounded off,
      and it is where the next instance would live.
    - **✅ THAT GAP IS NOW MEASURED (2026-08-29, scheduled dev-agent) and it is clean.** All seven
      reload-gated states driven individually at **320px x 130%**, `rootFontSizePx: 20.8` asserted
      on each: **7/7 clean, `0 unavailable` on every one.** With `runAll`'s 12 that is **19/19 at
      one declared axis, 18 clean** — the single finding being item 148's known overflow, which
      reproducing here is a control rather than a regression.
    - ⛔ **AND THIS ITEM'S OWN "19/19 clean" WAS OVERSTATED.** `focusVisibleOnTab` needs a
      tabbed-into document; `begin()` reloads and throws that state away, and only the `verdict`
      string says so while `status` stays `"ok"`. This item's seven states were therefore swept on
      **ten** probes, not eleven, and a hand-assembled total could not show it. **The findings
      stand; the coverage did not.** `A11yStates.coverage()` plus the Tab step now in the header
      recipe are the fix — see item 149.

174. **✅ DONE 2026-09-09 (scheduled dev-agent), the day after it was filed** — replaced by its
    conclusion per W-7.2 rule 1; the two instruments, their controls and the full measurements are in
    this date's run-log entry.
    **What was true:** the app had six ARIA live regions and two of them announced nothing, because
    the node was inserted with its text already inside it — `LessonReader`'s "Complete!" toast (9
    chars at insertion, every lesson completion) and `App`'s `PracticeCoachMark` (64 chars, once per
    install). Both are `position: fixed` overlays meant to leave, so `Question.jsx`'s "render it
    always and empty" fix did not transfer.
    **What is true now:** `ui.jsx` exports a persistent, `SrOnly`, always-mounted `Announcer`; the
    toast is `aria-hidden` and the coach mark has dropped its `role` (**not** `aria-hidden` — it owns
    two reachable buttons). Both messages reuse existing locale keys, so **no translation debt was
    added**. Re-measured on `index-DnLpZ5BO.js`: **0 nodes created by either interaction**, both
    regions populated in place, controls firing in both directions. **All six regions are now
    correct**, so the class is swept and closed at zero.
    ⚠️ **The one thing to carry forward, because it bites an instrument this repo relies on:** a
    persistent announcer means *"does a `role="status"` node exist on this screen"* answers YES
    everywhere, and on the path it is usually non-empty. Item 169's silent-discard measurement was
    written on that test; it is annotated in `DECISIONS.md` and `deepLink.js` as retired, with the
    replacement — **read the announcer's CONTENT, never its presence.**
    ⚠️ **Unchanged limit:** no screen reader is drivable from this host, so this is a DOM-precondition
    claim, not a measured announcement.

173. **✅ DONE 2026-09-08 (scheduled dev-agent), the day after it was filed** — replaced by its
    conclusion per W-7.2 rule 1; the measurements are in this date's twelfth run-log entry.
    **What was true:** closing a lesson dropped focus to `<body>`, so a keyboard or screen-reader
    learner who finished a lesson deep in a 44-row path was returned to the top of the DOCUMENT.
    Re-measured live before editing on `index-BC_zH3HN.js` at 375x812: the row was at `scrollY 713`
    when opened, `activeElement` was **BODY** after Back, and the same read reported a focused row
    and a focused `h1` elsewhere, so BODY was a finding and not a dead instrument. **What is true
    now:** `App` records the lesson open **at close time** into `returnFocusIndex` and `Learn`
    restores it behind `Reference.jsx`'s guard — restore only when focus actually fell — reused
    rather than re-derived. All three close paths are covered, including browser Back/back-swipe via
    `onRoute`, which the item had listed as out of reach.
    ⭐ **The finding the item did not contain, and it is the one worth keeping: the obvious fix would
    have failed SILENTLY on a whole track.** `Learn` unmounts while a lesson is open, so closing one
    re-seeds the accordion from the *next* lesson's track — measured: read an `essentials` lesson
    while `money` holds the next lesson, close it, and the essentials `<ol>` is `hidden` again.
    `focus()` on a row inside a hidden subtree is a no-op that throws nothing and returns nothing
    (measured, with a visible row as the control that took focus on the same call). Seeding
    `openTrack` from the row being restored fixes it; reading `activeElement` back afterwards turns
    any residual no-op into the scroll-to-top the learner would otherwise have got.
    ⚖️ **The one behavioral trade, decided rather than stumbled into:** `closeLesson`'s unconditional
    `scrollTop()` is gone, because "go to the top of the path" and "put me back on the row I was
    reading" cannot both be honored. `Learn` now runs exactly one of them. `focus({preventScroll:
    true})` would have kept both at the price of a focus ring parked off-screen, which is WCAG
    2.4.7's problem rather than a fix for it. **Measured: the trade is invisible in the most common
    case** — a new learner closing the path's first lesson still lands at `scrollY 0`, because that
    row is already there.

172. **✅ DONE 2026-09-08 (scheduled dev-agent), the day it was found** — filed in conclusion form
    per W-7.2 rule 1; the measurements are in this date's seventh run-log entry. **What was true:**
    tapping the tab you are already standing on returned you to that tab's root on **Learn only**.
    `goToTab` resets what the shell owns (`reading`), and a pushed view owned by a SCREEN —
    Reference's `section`, Glossary's `selectedTerm`, Practice's `session` — was invisible to it, so
    from Reference › Glossary two taps on the highlighted Reference tab left the screen
    byte-identical (14,378 chars both times) and the Review tab did the same mid-session, while the
    identical gesture on Learn returned to the path. Switching tabs and back DID clear them, but only
    as a side effect of `ScreenBoundary` being keyed by `tab`. **What is true now:** `goToTab` calls
    `dismissAllPushed()` when `key === tab`, draining the same stack Back pops — so no new state, no
    remount, and Learn's track accordion is measurably preserved. Back still closes ONE level and the
    re-tap goes to the root; that difference is deliberate and is guarded. `check-data.mjs` §81,
    proven by six injections. ⭐ **The transferable part is that this section's own first draft was
    structural and went GREEN on a broken drain** — swapping the loop for `stack[stack.length - 1]()`
    leaves a function that still exists and still closes something. Splitting the pure `dismissAll(stack)`
    out so the guard can *run* it, rather than pattern-match its source, is what made injection 5 fire.

171. **✅ DONE 2026-09-08 (scheduled dev-agent), the day it was filed** — replaced by its conclusion
    per W-7.2 rule 1; the measurements are in this date's fifth run-log entry. **What was true:**
    `isUnlocked(index)` asked only whether the PREVIOUS lesson in display order was completed and
    never whether THIS one was, so anything inserted at the front of a track re-locked finished
    work — `b6c9bc9` (2026-08-25) prepended ids 41-44 to `money`. Re-measured live before editing,
    with the id-migration flag pre-set so nothing was remapped: completed `[16,17,18]` rendered the
    id-16 row `disabled: true` carrying **both** "Complete previous lessons first" and "Completed",
    and the learner could not reopen it; control `[44,16,17,18]` opened the same row. **What is true
    now:** the rule moved to `src/lib/lessonUnlock.js` and gained clause 1 — a completed lesson is
    always open — chosen over option (b) because (a) subsumes it: the contradictory row is now
    unreachable by construction rather than merely relabelled. Guarded by `check-data.mjs` §80,
    which sweeps the completed-AND-locked invariant across 8 completed-set shapes and carries the
    control that fails if the sequential gate widens (3 of 44 open on a fresh install). Proven by
    four injections. `CLAIMS.md` A1's mechanism citation and `DECISIONS.md`'s tracks section were
    updated in the same commit.

170. **✅ DONE 2026-09-08 (owner-directed: "do item 170 next"), the day it was filed** — replaced by
    its conclusion per W-7.2 rule 1; the measurements are in this date's second run-log entry.
    **What was true:** `Practice.jsx` rendered the §10.1 disclaimer once, at the foot of the queue
    overview, behind the three `return`s inside `if (session)` — so it was gone from the moment
    "Practice all questions" was pressed, through the question runner, the batch pause and the
    completion card. Re-measured before editing, with the landing as the control: landing ✅ ×1,
    all three session states ❌. **What is true now:** one `<Disclaimer>` in the file inside a local
    `ScreenFrame`, all four returns through it, all four states verified ✅ ×1 on the built app.
    ⭐ **The item offered three options and the choice was made on a measurement, not a preference.**
    Option (c) was to accept the runner as deliberately chrome-free; it lost because `LessonReader`
    renders the **same `components/Question.jsx`** with `<Disclaimer>` directly beneath it — the app
    had already decided that a quiz question carries the notice, and the only open question was
    whether its two screens agree. Option (b) (pause and completion card only) would have left the
    runner disagreeing with the lesson reader over the identical question.
    ⛔ **The class is CLOSED at two instances and that is swept, not assumed** — the other six §10.1
    surfaces each have exactly one top-level `return` in their component, so no branch can skip the
    string. `App.jsx`'s is in `FirstRunNotice`, defined above the default export; the awk recipe is
    in LAUNCH_PLAN.md §10.1. **Do not re-run this sweep.**

168. **✅ DONE 2026-09-06 (scheduled dev-agent), the same run it was found — content and guard in one
    commit. [Content/QA] A same-track cross-reference that points FORWARD is a pointer at a LOCKED
    lesson, and three of them were written in backward-citation grammar.**
    - ⚠️ **NOTE ADDED 2026-09-07 (W-6.2 rule 2 — a note, not a numbered item). §75 WAS ENGLISH-ONLY
      AND ONE LISTED PAIR WAS WRONG IN JAPANESE; `check-data.mjs` §75b now covers the other four
      languages. Do not re-sweep this class.** §75's header declares its scope as English prose plus
      quiz `explain`, and each `FORWARD_OK` entry's `why` reviews the **English** phrasing. The
      `32->37` entry recorded *"neutral present tense"* on 2026-09-06 — true of the English, false of
      the `ja` shipping beside it, which read **『QE & QT』で扱った状況** (*"the situation covered in
      “QE & QT”"*), backward-citation grammar aimed five positions ahead in the same gated track.
      `es`/`ko`/`zh` all carried the English's present tense. Fixed to **が扱う状況**; confirmed live
      with lessons 29-31 complete, where lesson 32 opens and lesson 37 renders
      `前のレッスンを先に完了してください`.
      **§75b pins the reviewed WORDING per language** (`mark` on each entry) rather than judging new
      wording, for §75's own stated reason — signpost-versus-presupposition is a reading, not a regex.
      **16 (pair, language) references across the 4 listed pairs.** Proven to fail four ways
      (the defect restored; a `mark` deleted; `[:：]` narrowed to `[:]`, item 132's trap; a translation
      dropping the pointer), each restored from a scratchpad copy.
      ⚠️ **The pin is a SAMPLE, not a census:** `35->39` has two instances per language and one mark.
      **The whole class is otherwise swept to zero and does not need re-running:** all **278** resolved
      title references (44 lessons x 5 languages) — **193 same-track backward**, **25 same-track
      forward** across 4 sentences (the one defect above), **60 cross-track** (out of scope). The
      mirror class, a forward-phrased reference pointing *backward*, is **0 in 193**.
      ⛔ **Two instrument traps, so the sweep is not rebuilt wrong a third time.** Matching **full
      titles only** misses the shipped convention (references cite the **pre-colon head**), and
      extracting **quoted spans** silently loses every reference to a title that contains its own
      quotes (*"Why 'Later' Never Feels as Real as 'Now'"*, `为什么“以后”…`) — that cost 2 of 278 and
      looked exactly like a clean corpus. **Substring-on-title with an opening-mark requirement** is
      the shape that survives both. A backward-cue regex is **not** shippable: measured false-positive
      rate one flag in two.
    - **The standing rule, which is the part to keep.** `App.isUnlocked` gates on the previous lesson
      **in display order**, so a reference to a lesson later in the same track names something the app
      will not open. That is fine as a **signpost** (*"more on that in “Interest Rates”"* — lesson 30
      has carried one correctly the whole time) and a defect as a **presupposition** (*"the same target
      **from** …"*, *"the test **from** … stops being a tidy definition"*). **Write forward references
      forward.**
    - **Guarded by `check-data.mjs` §75**, a reviewed LIST (4 pairs, each with the phrasing that makes
      it acceptable) rather than a ban, because the distinction above is a reading and not a regex.
      Any **unlisted** forward pair fails. Proven to fail two ways, on injections restored from a
      scratchpad copy: a planted `As “Three Rules of Thumb” showed`, and — with the corpus
      **unmodified** — deleting the `43→16` entry, which reproduces the original defect's own message.
    - ⚠️ **DO NOT read §75's forward count as a defect count.** It is **5** before the fix and **5**
      after, on purpose: the references still point forward, which is correct. The grammar is what
      changed. A future run "improving" this by driving the count down would be deleting legitimate
      signposts.
    - ⛔ **BUILD THE INSTRUMENT ON DISPLAY ORDER, NEVER ON LESSON IDS**, and §75's control C exists to
      make that unfaultable: money runs `41,42,43,44,16,…`, so lesson 16 citing lesson 43 is
      **backward** while `16 < 43`. An id-based version reports a clean corpus and is wrong in both
      directions at once.
    - **Two notes filed here rather than as numbered items (W-6.2 rule 2).**
      (i) **Cross-track references also use past tense for lessons the reader may never have opened**
      — *"“The 4 Phases of Economic Cycles” **showed** how…"* is one of 12 cross-track instances.
      Deliberately **out of §75's scope**: the tracks are independent, nothing orders them, and item
      132 built these with an "(in <track>)" tag for exactly this reason. Raising it is an item-132
      question, not a §75 gap. **Zero action unless the owner wants the convention changed.**
      (ii) **§58 counts 50 English title references where §75 counts 64, and neither is blind** — §58
      pools per (lesson, target) while §75 counts occurrences and also reads `takeaway`/`thinkAbout`.
      Recorded so a future run does not "reconcile" them into agreement.
    - **The cause is worth naming: prose written against one display order, read in another.**
      `lessonsByTrack()` has been reordered twice (2026-08-07, 2026-08-18) and a reorder can turn a
      backward reference forward **without touching a character of prose**. Lesson 43's was not that —
      `b6c9bc9` put lessons 41-44 in front deliberately and the reference was written forward — but
      the class is the same, and §75 is what makes the next reorder loud.

169. **✅ CLOSED 2026-09-07** (commit below), and it is replaced by its conclusion per W-7.2 rule 1.
    **What was true:** on the Reference › Market Dashboard, a two-word label spilled ~40px outside
    its own card in `es` under browser/OS text zoom. **What is true now:** the offending span carries
    `minWidth: 0` instead of `whiteSpace: "nowrap"`, so the body's `overflow-wrap: break-word` can
    break the word; measured 0 overflow at 100/130/150/175/200% in all five languages.
    ⚠️ **Three things this item asserted were wrong, and they are kept here because they are the
    reusable part — every one of them was refuted by measuring, not by reading.**
    **(a) It named the wrong component.** "The QE/QT cards' label rows" — the QE/QT block is two
    `<Note>` elements with no flex row in them. The defect was in the **rate-effects** cards
    ("How rate moves have historically related to asset classes"), on the **one** card of six whose
    noun is YIELD → es "Rendimiento". The numbers in the item were right; the name on them was not.
    **(b) Its fix (a), `minWidth: 0` alone, is a TRAP, not a weaker option.** Measured on the live
    page: the span's box shrinks 154 → 114 and **the ink does not move** — still one line, still
    `scrollWidth` 154, still spilling onto the next card. A row-level geometry probe goes GREEN on it
    while the learner sees the identical screen. It works only in combination with dropping `nowrap`.
    **(c) Its fix (b), `overflow-wrap: anywhere`, changes nothing at all** while `white-space: nowrap`
    is on the same element — `nowrap` suppresses every break, and no `overflow-wrap` value overrides
    it. ⭐ **And a fourth, which was this run's own hypothesis and died the same way:** a non-breaking
    space does **not** pin the arrow to its noun under `anywhere`, which treats the nbsp as an
    arbitrary break point (control: a synthetic noun that fits alone but not with the arrow renders
    `"Cotizado " / "↑"` with nbsp and plain space alike). The arrow survives on the shipped corpus
    because "Rendimiento" is itself wider than the card, so the break lands mid-word — **incidental,
    not guaranteed**, and said plainly here rather than claimed as a property.
    **No check was built** (W-6.2 rule 3 / W-6.3). The learner-visible sentence is writable, but the
    only statically decidable form is a regex for one declaration in one file, which is a guard for a
    property that currently holds; the generalizable rule — "a `nowrap` on a flex item that has to fit
    a container" — is not statically decidable. `scripts/` untouched, so W-6.3's ratio stays at the
    **2.25x** (20,616 / 9,124) measured this run. The regression guard is item 155's text probe, and
    the trap in (b) is written into the source comment where the next editor will hit it.
167. **[Content/Accuracy — filed 2026-09-05 by the run that fixed lesson 34's US-1930s claim, from
    the same close reading of the economy track. All three are LIVE and were read on the built app,
    not inferred; none is a residual of that run's own edit.]**
    > ⚠️ **A SEVENTH NOTE, not a sub-item (W-6.2 rule 2). The ANSWER-KEY-vs-TRANSLATED-OPTION-ORDER
    > class is swept and CLOSED at zero instances — do not re-run it.** 2026-09-07. `quizMeta.answer`
    > is an **index**, and entry i of `quizMeta.js` is entry i of all five `quizText.<lang>.js`, so a
    > translation that reordered its own `opts` would grade a correct pick as wrong **in that language
    > only**. `check-data.mjs` §3 checks option **count** parity and answer-index range; nothing tied
    > the key to non-English content, and `quizMeta.js`'s header carries the rule as prose ("when
    > editing options, move the whole option string and update `answer` to match") — the same shape as
    > the order comment that file records having been burned by before 2026-09-01. **Zero
    > misalignments, by three instruments.** (1) **Positional anchors** — digits + ALL-CAPS acronyms:
    > 12 of 184 (question, language) pairs decisively evaluable, 0 flags. (2) **Per-option numeric
    > agreement**: 136 of 736 (question, option, language) triples covered (18%), **4 flags, all
    > legitimate rendering** — "longer than a year" → `1년`/`1年`, and "Priya's" → `프리야의 1,000달러`
    > restoring the elided noun; a planted `ko` swap fired the control. (3) **`explain` ranked against
    > that language's OWN options** by character 2/3-gram Jaccard (no segmentation, so es/ko/zh/ja
    > score identically well): full coverage, and the usable signal is **cross-language differencing** —
    > the 5 questions where exactly one language disagrees (`q007` ja, `q021` ko, `q031` ja, `q038` es,
    > `q046` ja) were **all read by hand and are all correctly aligned and correctly keyed**. Also
    > swept: **duplicate options, 0 across 230 (question, language) sets**, control fired.
    > ⛔ **Two instrument findings, because both are traps this log has hit before.** **(a) In a
    > Latin-script language an ordinary Latin word is not an anchor.** The first version scored
    > shared vocabulary and returned 8 flags, **6 of them `es`, every one at a 0.01 margin** — the
    > same shape as the fourth note's `\w`-is-ASCII artifact, one alphabet later. Anchors must be
    > things translation cannot touch: digits and acronyms. **(b) Option LENGTH cannot be a guard, and
    > this is measured rather than asserted.** Against every single adjacent swap of the real corpus
    > as planted positives: raw length-rank Kendall tau catches **27%** at a threshold that already
    > costs 7 false positives, and the per-question-normalized form **49% at a 10% flag rate**. It is
    > a fine **ranking** — the 7 worst-ranked pairs were read by hand and all were aligned — and it is
    > not a test. ⚠️ **A related fact for item 160, measured on the way:** option-length rank is
    > **strongly preserved by translation** (median tau **0.67** over 179 pairs), which is the
    > mechanism behind §65 scoring 52-57% in all five languages rather than in English alone — the
    > four translations **inherit** the tell rather than adding one.
    > **No check was built** (W-6.2 rule 3 — after an empty sweep the learner-visible sentence cannot
    > be written honestly; and the only instrument with real coverage would ship a 4-entry exemption
    > list for zero defects, the trade the fifth note declined). `scripts/` untouched; W-6.3's ratio
    > unmoved. The scripts stayed in the scratchpad; the definitions above are the record.
    > ⚠️ **Overlap disclosed rather than glossed:** the sixth note swept explain-vs-distractor in
    > **English** and says do not re-run it — this ran the **four translations**, for a different
    > question (option ORDER, not distractor plausibility); the fourth note swept numeric drift in
    > **lesson bodies**, this swept **quiz options**. Neither English half is claimed as new work.
    > ⚠️ **A SIXTH NOTE, not a sub-item (W-6.2 rule 2). The EXPLAIN-vs-KEYED-ANSWER class is swept
    > and CLOSED at zero instances — do not re-run it.** 2026-09-07: the `explain` field a learner is
    > shown the moment they answer was ranked against all four of its own options for every question,
    > to find any explanation that justifies a **distractor** rather than the keyed answer. **46 of 46
    > agree.** 16 flagged; **all 16 are instrument artifacts, read individually against the question
    > text** — the tokenizer drops digits, so `q003`'s "1-2 / 20-30 / 75-100 / 5-8 years" and `q015`'s
    > four percentage splits all reduce to the single token *years* / *needs wants savings* and tie at
    > 1.000; `q017`'s options reduce to nothing at all and tie at 0.000. The rest lose on vocabulary
    > their own explanation legitimately uses about the alternative it is rejecting (`q023`'s explain
    > must say *nominal return* to subtract it; `q010` is the documented NOT-question). **No check was
    > built** (W-6.2 rule 3 — after an empty sweep the learner-visible sentence cannot be written
    > honestly; W-6.3's ratio is quoted in the run-log entry). The script stayed in the scratchpad.
    > ⛔ **The instrument note, because the artifact rate is the finding here and not the zero:** a
    > bag-of-words overlap **cannot rank numeric or near-identical-vocabulary options at all**, and it
    > does not fail loudly when it can't — it returns a confident tie. Both controls passed (an
    > explain restating the keyed option ranks it #1; one restating a distractor is flagged) and were
    > still worthless for 5 of the 16, because **a control proves the instrument can see a difference
    > it is shown, not that a difference exists to see.** Anyone re-opening this class needs an
    > instrument that reads numbers as numbers.
    > ⚠️ **A FIFTH NOTE, not a sub-item (W-6.2 rule 2). THREE more classes swept 2026-09-05 — do not
    > re-run any of them.** (1) **Glossary↔lesson definitional agreement — ZERO real instances.** All
    > 43 glossary terms against 1,319 English lesson sentences, plus `economicSignals.js` and the 68
    > parallel English strings in `markets.js`; controls fired both ways (`Deflation` >0,
    > `Blorptronics` 0). Two lookalikes died on inspection and must not be re-derived: lesson 36's
    > *term premium* is already in `lessonTerms.js`'s `deliberatelyUnlinked` as `other-sense`, and
    > lesson 11's *index fund* attribution to lesson 5 (which contains `index` zero times in five
    > languages) is **supported**, because lesson 11 §0 supplies the bridge and lesson 5 describes the
    > thing without naming it. (2) **Attributed cross-references — ZERO in 24.** Every sentence
    > claiming another lesson *showed* something, read against its target; controls: a known title
    > resolves, a fabricated one does not, self-references 0. (3) **Typographic integrity — ONE
    > instance in 2,380 fields, fixed the same day**: lesson 5 §2 opened a sentence with a lowercase
    > *the*, left there on 2026-08-20 when item 84's conversion replaced *"Lesson 38's"* and did not
    > restore the capital; all four translations already read it correctly. Doubled words, double
    > spaces, missing space after a period, space before punctuation and curly-quote balance are all
    > **zero**. **No check was built for any of the three** (W-6.2 rule 3, W-6.3 at 2.15x): the
    > sentence-case probe runs at a **96% false-positive rate** (22 of 23 are `EE.UU.`/`U.S.`/`vs.`
    > or a `?”` closing a quoted question), so a guard means shipping an abbreviation allowlist for
    > one defect in 44 lessons.
    > ⛔ **The instrument trap, and it is a sharper version of the fourth note's:** the doubled-word
    > probe reported **8 hits, all Spanish, all fake** — JS `\w` is ASCII-only, so in *"una economía a
    > lo largo"* the `í` is a non-word char and `\b` matched before the final **a**, reading `a a`.
    > **The control passed and was worthless: an English doubled word was planted to validate an
    > instrument then pointed at Spanish.** Fixed with `\p{L}` and a control planted in the scanned
    > language that also asserts the artifact is dead (`por toda una economía a lo largo` → 0).
    > **A control has to be planted in the same alphabet as the corpus.**
    > ⚠️ **A THIRD NOTE, not a sub-item (W-6.2 rule 2). The QUESTION-ANSWERABILITY class is swept and
    > is CLOSED at one fixed instance — do not re-run this sweep.** 2026-09-05: every one of the 46
    > end-of-lesson checks was scored against the lesson it is attached to *and* against all 44 lesson
    > bodies. **44 of 46 rank their own lesson #1** (identity control: every lesson's own takeaway
    > ranks that lesson #1, 44/44). The two that do not: `q045` at rank 2 inside its own four-lesson
    > arc, **read and correct**; and **`q004` at rank 21 of 44** — *"What causes inflation?"* was
    > attached to **lesson 30**, which contains the word *inflation* **zero** times and *production*
    > **zero** times **in all five languages**, while lesson 32 contains each **twice in all five**.
    > Fixed the same day by moving `q004` to lesson 32 (one integer; `q004`'s id is unchanged, so
    > persisted Leitner state survives) plus L32's derived `minutes` 3 → 4. **No guard is due**
    > (W-6.2 rule 3, W-6.3 at 1.82x): one defect in 46 does not earn a permanent instrument, and both
    > sweep scripts stayed in the scratchpad.
    > ⛔ **The trap, because a coverage score alone gets this wrong:** `q010` and `q005` score low for
    > a legitimate reason — they ask which item is **NOT** one of a list, so the correct option is
    > *deliberately* absent from the lesson. A word-coverage sweep cannot tell a NOT-question from a
    > misplaced one. **The instrument that decides has to rank the question against every lesson, not
    > score it against its own.** `q010` sits at rank 1 under that instrument.
    > ⚠️ **And a live, unfixed find from the same walk, filed here rather than numbered: `checkIntro`
    > is a fixed singular string.** *"A quick question before you move on."* renders above **two**
    > questions on the two lessons that carry two (L34 all along, and L32 since the `q004` move — the
    > count of affected lessons is 2 before and 2 after, measured, so nothing regressed). W-6.2 rule
    > 3's sentence: *"a learner is told to expect one question and is shown two."* Fixing it is a
    > five-language copy change (`checkIntro` has no count template; §68 is the precedent for one).
    > **Honest priority: low** — it is a wording mismatch, not a false claim about the material.
    > ✅ **DONE 2026-09-06 (scheduled dev-agent). Two keys, not a count template — and the note
    > above pointed at the wrong precedent.** §68 IS about count templates, and its own failure
    > message says to park a count outside the noun phrase rather than add a plural rule; a `{n}`
    > here would have bought a scanned template needing an exemption, to render a number the learner
    > can see by counting to two. The branch this needed already existed as `check.length`, so:
    > `checkIntroPlural` in five languages, rendered on `check.length > 1`, one line in
    > `LessonReader.jsx`. **The three languages that said "one" literally** — en "A quick question",
    > es "Una pregunta", zh "先来一个小问题" — now read "A few quick questions", "Unas preguntas
    > rápidas", "先来几个小问题"; ko and ja carried a singular by implication and now read 몇 가지 /
    > いくつか. **Plural wording carries no number**, so a third question on some future lesson does
    > not falsify it the way "a couple" would.
    > ⚠️ **A FOURTH NOTE, not a sub-item (W-6.2 rule 2). The ENGLISH↔TRANSLATION NUMERIC-DRIFT class
    > is swept and CLOSED at zero instances — do not re-run it.** 2026-09-05: percentages and 4-digit
    > years compared between each English lesson and its four translations, **176 (lesson, language)
    > pairs**. **4 flags, all false positives on inspection** — `L12 zh` writes `$1,800` as `1800美元`
    > (no comma), `L11 ko` renders "exactly one percentage point" as `1%포인트`, `L32`/`L37 ko` render
    > "approach zero" as `0%`. **No drift exists; no check was built** (W-6.2 rule 3 — after an empty
    > sweep the learner-visible sentence cannot be written honestly).
    > ⛔ **The transferable part is the instrument, not the result. The FIRST version reported 36 flags
    > and every one was an artifact of its own regex:** the lookahead `(?![\d,.%])` rejected any year
    > followed by a comma, so English lesson 36 — which reads *"turning positive again in 2024, well
    > past…"* — scanned as containing **no 2024**, manufacturing a tidy story that ko/zh/ja were
    > carrying a stale inversion window three days after that lesson was corrected in English. **It had
    > no control.** With a two-sided planted probe (`2024,` `1929.` `2050` must be read; `1,929,000`,
    > `20.24`, `1799`, `2100`, `12345` must not) the count fell **36 → 4 → 0 real**. A digit-scanner
    > over prose needs its punctuation boundaries proven, and **"the translations drifted" is a
    > conclusion attractive enough to skip proving the instrument first** — which is what happened.
    > ⚠️ **A SECOND NOTE, not a sub-item (W-6.2 rule 2). The CHECKABLE-ARITHMETIC class is swept —
    > do not re-run it.** 2026-09-05: every sentence in all three tracks carrying a multiplier word
    > or two or more magnitudes was parsed out and recomputed — **120 sentences across 35 lessons,
    > one defect**, in lesson 3 §2 (the early-saver comparison was false at the lesson's own 6%),
    > fixed the same day in five languages. **The positive control was (a) below**: a sweep that
    > misses lesson 37's "nine times the size" proves nothing, and this one caught it. Everything
    > else checks out to the cent — lesson 11's fee example, lesson 18's $3,580, lesson 17's $1,050
    > and $400, lesson 4's rate gap (which *understates*), lesson 3's own figure data. **No guard was
    > built and none is due** (W-6.2 rule 3, W-6.3): one defect in 120 sentences does not earn a
    > permanent regex. ⛔ **And the trap recorded in the run log: the folk "early saver stops
    > contributing" framing is ALSO false at 6% ($197,395 vs $200,903) — do not "fix" lesson 3 by
    > restoring it.**
    > ⛔ **(a) below was deliberately NOT taken by that run** even though its sweep pointed straight
    > at it — item 167 is exhausted for headline picks, and folding it in would have been the smuggle
    > W-6.2's ⚠️ names. It is still open and still near-free.
    > ⚠️ **A NOTE, not a fourth sub-item (W-6.2 rule 2). The research-authority class is swept and
    > sits at ONE fixed instance — do not re-run this sweep.** 2026-09-05: every sentence in all
    > three tracks citing research / studies / experiments / economists as authority was regexed and
    > read — **25 hits, one defect**: lesson 18's ego-depletion claim ("willpower runs low over the
    > course of a day the way a muscle gets tired"), fixed the same day in five languages. **The two
    > lookalikes are innocent and were deliberately left alone:** lessons 19/27's loss aversion at
    > "roughly twice" (the standard ratio, already hedged) and lesson 28's more-trading-lower-returns
    > (Barber-and-Odean-shaped, replicated across markets). See the run log for the instrument, the
    > control that caught a bad glossary grep, and why widening would have damaged two good lessons.
    - **(a) ✅ DONE 2026-09-05 (scheduled dev-agent). "nine times" → "ten times" in all five
      languages.** Premise reproduced exactly before editing (en/es/ko/zh/ja all carried the 9x
      wording against the same $900B → $9T pair). **Disposition decided as the item asked:** the
      em-dash clause modifies *the $9 trillion stack*, so it is a claim about the **peak**, and the
      peak is 10x — which is also what the lesson's own two rounded figures divide to, and what the
      real series gives ($8.97T ÷ $0.90T = 9.96). ⚠️ **It was NOT taken as a headline pick on its
      own** — see (d) below, which is the defect this run actually went looking for and found in the
      same lesson; (a) rode along because it is the same sentence-level class in the same section,
      not because the chain resumed.
      ORIGINAL TEXT, kept because the line above refers to it:
      > **(a) Lesson 37 (QE & QT) says the balance sheet "grew from roughly $900 billion before 2008
      > to a peak of about $9 trillion in 2022 — a stack of bonds nine times the size of the entire
      > pre-2008 institution."** $9T against $900B is **ten** times, not nine; nine is the *increase*
      > divided by the base. The sentence reads as a claim about the peak, so a learner doing the
      > division gets a different number than the sentence gives them. Cheapest of the three; decide
      > whether the intended claim is the peak (10x) or the growth (9x) and say which.
    - **(d) ✅ DONE 2026-09-05 (scheduled dev-agent), and it is what this run was actually for.
      Lesson 37's THINK prompt contradicted the lesson's own figure table three blocks above it.**
      The body lists `QE1 (2008): $1.75 trillion`; the prompt read *"The Fed printed $2+ trillion in
      2008 and unlimited in 2020."* Both in all five languages. Neither reading rescues it: it is
      not QE1's $1.75T, and it is not the 2008 balance-sheet expansion (~$1.3T) either — `$2+
      trillion` matches only the *total* balance sheet at end-2008, which is not a thing that was
      "printed". Now reads *"$1.75 trillion in QE1 starting in 2008"*, reusing each language's own
      existing rendering of that figure from the table above it (`$1.75 billones`, `$1.75조`,
      `1.75万亿美元`, `1兆7500億ドル`) rather than a fresh translation of the number.
      ⛔ **A THIRD SURFACE carries `$2+ trillion` and was deliberately NOT changed — do not
      re-derive this.** `src/content/kidsContent.js:84` says *"The Fed printed $2+ trillion to stop
      the collapse"* in all five languages. It is **not** pinned to a single year and it reads across
      the whole crisis response, where QE1+QE2 = $2.35T makes "$2+ trillion" fair; and it sits on the
      parent-facing guide with no adjacent figure to disagree with. **The defect was the
      self-contradiction, not the number** — same call, and same reasoning, as (b)'s two untouched
      neighbours.
    - **(b) ✅ DONE 2026-09-05 (scheduled dev-agent). Lesson 36's THINK prompt no longer poses a
      settled episode as an open bet.** Premise re-measured and confirmed exactly as filed in all
      five languages before editing; see the run log. The replacement anchors on a **closed
      interval** — "the 12-18 month window … closed at the end of 2023 without a US recession" —
      because the obvious alternative ("no recession *yet*") is a §2.3 liability that nothing checks.
      ⚠️ **Two neighbours were checked and deliberately NOT changed; do not re-derive this.** `12-18`
      appears on three surfaces, not one: the prompt, the end-of-lesson **quiz** question
      (`quizText.*.js:75`) and the **glossary** `Yield Curve` entry. Both neighbours state the
      *general* pattern, which is what the lesson teaches and what the 1955 record supports, and the
      quiz's `explain` already carries the hedge. **The defect was the present tense, not the 12-18
      month figure** — widening the fix to all three would have hedged the lesson's own thesis on the
      strength of one episode. "this time is different" leaves lesson 36 but stays in lesson 33,
      where the corpus actually teaches it as bubble psychology.
      ORIGINAL TEXT, kept verbatim because the entry above refers to it:
      > **(b) Lesson 36 (Yield Curve): the THINK question contradicts the lesson body on the same
      > screen.** The body's second section now says the 2022 inversion "stayed inverted for roughly
      > two years … before turning positive again in 2024, well past the 'typical' 12-18 month lead
      > time"; the THINK prompt three blocks below still asks *"The yield curve inverted in 2022.
      > Historical pattern says recession within 12-18 months. Some say 'this time is different.' What
      > do you think?"* — i.e. it poses as open a window the body has already closed. Same class as the
      > 2026-09-04 QT/tapering and 2s10s finds: a screen disagreeing with itself. Five languages.
    - **(c) ✅ DONE 2026-09-06 (scheduled dev-agent). CONFIRMED as a third self-contradiction, and
      the item's own open question is closed by measurement.** The stop-clause below asked whether the
      glossary already draws the distinction. It does, in the sharpest possible way: **the `Recession`
      entry does not mention prices at all** (NBER's broader criteria; its example pairs rising
      unemployment with falling GDP), so this was never a whole-app simplification the owner chose.
      `lessonTerms.js` attaches **both** chips to this exact section, so the contradicting definition
      was one tap below the sentence. Fixed in five languages: businesses **discount**, activity
      shrinks, that is the recession — and deflation is now a distinct, conditional deeper case that
      **echoes the glossary's `Deflation` entry** rather than contradicting the `Recession` one.
      ⚠️ **`disinflation` was deliberately NOT introduced** (zero occurrences corpus-wide; naming it
      buys a glossary key in five languages to teach a label the lesson does not need), and **both
      `Deflation` and `Recession` had to stay in the English section** or §17(d) fails the two chips.
      Lesson 34's "deflationary tools" is the adjective sense and was correctly left alone.
      ORIGINAL TEXT, kept because the entry above refers to it:
      > **(c) Lesson 32 (Short-Term Debt Cycle) equates an ordinary recession with deflation** —
      > "businesses start cutting prices to attract customers — that's deflation … That's a recession."
      > Most postwar US recessions ran *disinflation*, not a falling price level. ⚠️ **Not measured
      > against the glossary yet** — the glossary's own `Deflation` entry and lesson 34's use of the
      > word have to be read first, because if they already draw the distinction this is a third
      > self-contradiction and if they do not it is a whole-app simplification the owner may have
      > chosen. **Do not treat (c) as confirmed; (a) and (b) are.**
    - **W-6.2 rule 3, answered:** (a) "a learner divides 9 by 0.9 and gets a different answer than
      the sentence"; (b) "the lesson tells a reader on one screen that the window is open and that it
      closed"; (c) "a learner is taught that recession means prices fall"; (d) "the lesson prints
      $1.75 trillion in a table and $2+ trillion in the prompt three blocks below it". **No check is
      proposed for any of them** — all four are single sentences, and `scripts/` at 2.15x `src/`
      (W-6.3) says a regex is the wrong instrument. **Honest priority: (b) medium — it is a live
      self-contradiction on the main path; (a) low but near-free; (c) unmeasured.**
      ⛔ **ITEM 167 IS FULLY CLOSED 2026-09-06 — (a), (b), (c) and (d) are all done.** Its five
      notes stay as do-not-re-run records of swept classes.
      ORIGINAL LINE, kept because the line above supersedes it:
      > ⛔ **ONLY (c) IS LEFT. (a), (b) and (d) are done.**
      ⚠️ **AND THE W-6.2 rule 1 BAR BELOW HAS LAPSED — corrected 2026-09-05, because it was
      re-read literally rather than carried forward.** Rule 1 reads: *"A run may not take its
      **own previous run's** residual as its headline pick **more than TWICE in a row**."* Both
      qualifiers had stopped applying. The chain was filing-run → (b)-run, and **ten runs
      intervened** before this one, so nothing was "in a row"; and item 167 was filed by a run
      twelve runs back, so it is not **this** run's previous run's residual under any reading.
      **A bar written while a chain was live does not survive the chain** — the same shape as
      W-5.2's ratio expiring with item 93, and the same shape as W-5.2's own ⚠️ standing warning
      that a pick-list goes stale exactly like a figure does. The clause is annotated rather than
      deleted so the correction is visible.
      ORIGINAL CLAUSE, kept because the correction above refers to it:
      > ⛔ **(b) is DONE, so this item is now a two-part remainder — and W-6.2 rule 1 is EXHAUSTED
      > for this chain: the 2026-09-05 filing run was link one and the (b) run was link two. A run
      > may not take (a) or (c) as its headline pick.**

166. **✅ DONE 2026-09-04 (scheduled dev-agent). The Sector screen now credits both sources, and
    `check-data.mjs` §73 keeps it doing so.** See the run log. Two five-language locale keys —
    `priceSourceTemplate` ("Sector and index prices from {source}.") under the sector list and
    `economicsSourceCredit` (the Federal Reserve Bank of St. Louis / FRED®) under the economics list —
    both gated on `!isSample`, since crediting a vendor for fixture numbers would be false.
    `priceSourceName()` in `src/lib/useMarketData.js` maps `market.json`'s **adapter name** to the
    vendor's display name and returns `null` for anything unknown.
    ⚠️ **The part worth not re-deriving: `source` is an adapter slug, not a display string**, so a new
    adapter in `adapters.js` with no entry in `PRICE_SOURCE_NAMES` renders *real vendor prices with no
    credit and no error anywhere*. That silent path is what §73 exists for; DECISIONS.md names Twelve
    Data as the drop-in alternative, so the switch is a live possibility, not a hypothetical.
    ⛔ **Checked and DECLINED in the filing walk, kept so it is not re-derived: the missing disclaimer
    on Glossary and Kids is NOT a defect.** `check-blindspot.mjs`'s `EXPECTED_SURFACES` is a closed
    list of 8 that deliberately excludes Glossary, TermDetail and ParentGuide, `Reference.jsx`'s §10.1
    comment says so, and the check fails on an EXTRA surface as well as a missing one. Adding one
    means editing LAUNCH_PLAN §10.1 and that list together — owner-facing, not a fix.
    ⚠️ **And the instrument trap:** `grep -c '<Disclaimer' Sectors.jsx` returns 0 while the screen
    plainly renders one — it emits the bare `{t.disclaimer}` string. A component-name grep is not a
    disclaimer census.

165. **✅ FULLY CLOSED 2026-09-06 (owner-directed), content and guard both** — collapsed to its
    conclusion 2026-09-08 per W-7.2 rule 1 from 20,571 b. The repair chronology, the layered headline
    corrections and the instrument-convention argument are in the run log for 2026-09-02 through
    2026-09-06; `0a30707` is the guard's commit.
    **What was true:** the quiz's `explain` field — the surface item 160 moves reasoning *into* — was
    abridged in a large share of question/language pairs, concentrated on the main path, so a learner
    answering in es/ko/zh/ja got one sentence where the English reader got the mechanism.
    **What is true now:** every open pair is repaired, and `check-data.mjs` **§74** guards the field on
    every `npm test`, shipping at **0/184 abridged, 7 `READ_COMPLETE` entries (0 inert), 7 control
    groups firing** — read off the suite this run, not off this item. The 7 exemptions are compact-CJK
    renderings that carry every English clause and flag by hundredths: **item 162's false-positive
    class recurring in a third corpus**, and padding them would be writing filler to satisfy an
    instrument.
    ⛔ **Read §74's numbers against §74, never against this item.** §74 computes p90 with
    `ceil(0.9n)-1`, matching its §66/§67 siblings; this item's historical figures used
    `round(0.9n)-1`, and on this corpus the two genuinely disagree (third decimal, and whether `q002`
    ja flags). Control 5 pins the convention against a vector where they diverge, so a future switch
    fails loudly instead of silently redefining every figure.
    ⚠️ **Three traps kept because nothing else states them.** (1) **A p90 reference is computed from
    the corpus it measures**, so repairing the corpus moves the instrument — quote one with a date.
    (2) **Sentence-counting is a proxy for content and re-punctuation defeats it**: a translation that
    splits one English sentence in two matches the total while dropping a whole sentence, which is how
    a "closed" claim got made twice off a measure this item's own text said not to trust over the
    ratio. (3) **A fingerprint list is a measurement, not an estimate** — the first `READ_COMPLETE`
    list shipped with lengths typed rather than measured, and control 7 named all three on its first run.
    ⭐ **The finding that outlives the item: a fix applied to one corpus is not applied to the
    concept.** `DECISIONS.md` records a 2026-08-16 review repairing an es-only dropped word in a lesson
    body; seventeen days later the quiz explanation *of the same mechanism* still dropped it in three
    languages, because `translation-review.mjs` and `check-data.mjs` §33 both read `lessonContent` and
    neither had ever opened `quizText`.
    **Tracked elsewhere, not here:** the lesson *bodies* on those same `essentials` lessons are still
    condensed summaries — item 94 and `npm test`'s translation-completeness warning. **O-3 applies:**
    ~1,050 characters of machine translation shipped here, none read by a fluent speaker.

164. **✅ DONE 2026-09-02 (scheduled dev-agent) — the headline premise reproduced exactly, and the
    item's own list of phrasings did not: one of the three it proposed fires on shipped teaching
    copy. Widened in all five languages, with a two-sided control.**
    - **Premise, re-measured before editing (step 3.5), by plant and control:** planting
      `qeQtSection: "QE, QT — now is a good time to buy"` into `src/locales/en.js` gave **PASS**;
      the control plant `"you should buy now"` gave **FAIL**. Blind pattern list, live corpus —
      exactly as filed.
    - ⛔ **What the item got wrong, and it is the part worth keeping.** It named three missing
      phrasings: *"a good time to buy"*, *"consider buying"*, *"worth buying"*. **`worth buying`
      fires on a shipped money-track takeaway** — "wants are everything else, including plenty of
      things worth buying" — so landing the item as written would have failed the build on correct
      content. `consider buying` has zero live hits but is a normal teaching framing
      ("consider buying versus renting") and was dropped for the same reason. **The first Spanish
      draft repeated the mistake independently**: `momento (de|para) comprar` fires on a shipped
      lesson's temporal "En el momento de comprar, ambas decisiones se sintieron iguales", so the
      Spanish patterns now require the evaluative or copular frame (`un buen momento para comprar`,
      `es el momento de comprar`). Both live sentences are now must-stay-clean controls.
    - **Shipped:** a **timing** class in five languages (8 patterns) plus the softened first-person
      verbs the existing recommendation patterns missed (`we suggest|advise`, `sugerimos|aconsejamos`,
      `권해 드립니다`, `おすすめします`). §10.1 goes from **25 to 33 patterns**. Every one was checked
      against the current corpus for false positives first — **0 hits across 39 files** — and each of
      the five plants that a learner could have met (`now is a good time to buy` / `ahora es un buen
      momento para comprar` / `지금이 매수하기 좋은 시기입니다` / `现在是买入的好时机` / `今が買い時です`)
      now FAILs the check.
    - ⚠️ **A pattern's own must-flag sample is not optional, proven by one that was dead when
      written.** The Korean timing pattern was drafted as `(매수|…|팔)기 좋은` and matched **nothing**
      — not even `매수하기 좋은 시기`, the phrase it exists for. It looked identical to a clean
      result. The new control asserts each timing pattern against the advice sentence it was written
      for, so a dead pattern fails loudly instead of reporting a clean corpus forever.

163. **[UX/A11y — filed 2026-09-02 by the run that put the unit on the balance-sheet chart, as three
    things that run SAW on the same walk and deliberately did not fold into the same commit.]
    All three are live and measured; none is a guess.**
    - **(a) ✅ DONE 2026-09-02 (owner-directed: "do item 163(a) next") — but READ THE PREMISE
      CORRECTION: this item named ONE site and there are TWO, and it called the defect "a judgment
      call, not a falsehood" when half of it is a plain falsehood in five languages.**
      *As filed:* the recap card renders an unconditional `<Icon name="check">` at `ink.ok` above
      "Review complete", while the per-question rows below it *do* branch — the screen contradicting
      itself in two inches. **That much reproduced exactly** (0 of 10 → one 2rem green tick over ten
      red `ink.bad` crosses). **What the item missed is the `atBatchPause` branch twelve lines
      above**, which renders the same unconditional tick over `reviewBatchTitle` — **"{n} done —
      nice work"**, es "bien hecho", ko "잘하고 있어요", zh "做得好", ja "いい調子です". Measured live
      by driving ten real wrong answers: **"10 done — nice work" over "0 of 10 correct"**. That is
      not a defensible judgment call; it is praise for a session in which nothing landed, and the
      item's "not a falsehood" reading is true of `reviewCompleteTitle` and false of this one.
      **The decision this item said the picker must make, made, and split in two** — because the
      tick and the headline are different kinds of thing. The tick is a **signal**: it now goes
      `info`/`ink.muted` when `correctCount === 0` at BOTH sites, matching the two-state shape the
      landing card already uses for `seen > 0`. It is deliberately **not** red — the session was
      completed, and a miss is a productive event in a Leitner scheduler. The headline is a
      **claim**: a new `reviewBatchTitleNoneRight` in five languages says what actually happened to
      those questions ("{n} done — these come back tomorrow"), which is what this screen's own "How
      review works" rail already promises. `reviewCompleteTitle` stays unconditional: unlike "nice
      work" it is true at every score. **The boundary is exactly `correctCount === 0`** — 1 of 10
      still reads "nice work" with the green tick, measured. Note this was NOT item 117's defect —
      that one was the Practice *landing* card with `review = null`, closed 2026-08-26, and its
      conditional-icon shape is the precedent this followed rather than undid.
      ⚠️ **And the transferable part, which is the second time in two days item 163 has taught it:**
      **(b)'s numbers were wrong and (a)'s scope was wrong, both filed by the run that had just
      looked at the screen.** A residual is a claim about the code, not a reading of it.
    - **(b) ✅ DONE 2026-09-02 (owner-directed: "do item 163(b) next") — but READ THE PREMISE
      CORRECTION, because it changed the scope from three blocks to one heading.**
      *As filed:* "the outline names 4 of its 7 blocks … a reader skips three sections". **Both
      figures were wrong.** Re-measured on the built app before editing: the screen has **eight**
      content blocks, four carry an `h2`, and **four** do not — the cycle chart, the *Illustrative
      Scenario* note, the QE/QT pair, and the balance-sheet figure. I had missed the scenario note.
      **But the corrected count is not the interesting part.** Three of those four are not defects:
      the cycle chart and the scenario note sit **between the `h1` and the first `h2`**, which is
      the `h1`'s own content and the correct description of a screen's opening; and the
      balance-sheet figure's `figcaption` is a caption, which is what a figure's label should be.
      **The real defect is narrower and sharper than the item claimed:** the QE/QT pair and the
      balance-sheet figure sat *between* two unrelated `h2`s, so a rotor user was told the entire
      Fed-balance-sheet chart belongs to **"Yield Curve Shapes"**. Fixed with **one** `h2`
      (`qeQtSection`, five languages) that owns both — not three headings, and no new primitive.
      See the run log for the differential control that reproduced the pre-fix ownership in place.
    - **(c) ✅ DONE 2026-09-02 (owner-directed: "do item 163(c) next"). The defect reproduced
      exactly; three things around it did not.**
      *As filed:* `Bar` renders `9` where its own description says `9.0`, because `9.0 === 9` in
      JavaScript. **Reproduced live on the built app: `["0.9","4.5","3.8","9","6.7"]` against an
      aria-label reading "…9.0 after the pandemic response…".** The control is intrinsic — the other
      four bars DO carry a decimal, so a probe returning a constant could not have produced that row.
      **Three corrections:**
      1. **It is on TWO screens, not one.** `balanceSheetHistory` is drawn by two `Bar` call sites —
         `MarketSignals.jsx` (Reference > Market Dashboard) **and** `LessonVisual.jsx` for
         `kind === "balanceSheet"`, which is **lesson 37, "QE & QT: The Fed's Power Tools"**. Both
         measured showing `9`.
      2. **The "future integer-valued chart" is a PRESENT one.** `Practice.jsx`'s Leitner box strip
         is the third `Bar` call site and renders question counts — measured at `7 / 3 / 2 / 0 / 0`
         under the unit "questions". A `.toFixed(1)` inside `Bar` would have shipped "7.0 questions"
         and "0.0". The item was right to warn and wrong that the risk was hypothetical.
         (`Bar`'s own comment said "both call sites"; there are three. Corrected in the same commit.)
      3. **No new convention was needed — `Bar` was the only one MISSING the existing one.**
         `ProportionBar`, `GrowthCurve` and `GapColumns` in the same file all already take a
         `formatValue` prop. `Bar` now takes one too, defaulting to identity so the integer strip is
         untouched. Precision is a property of the series, so `balanceSheetFormat` is exported from
         `content/markets.js` beside the data and beside the description that states the decimal,
         and both call sites pass it. Verified after the fix on both screens and in all five
         languages: `0.9 4.5 3.8 9.0 6.7`; the Leitner strip still reads `7 3 2 0 0`.
      ⚠️ **What is NOT fixed, measured rather than assumed:** `es` alone writes a comma decimal in
      its description ("0,9 … 9,0") while the chart face renders a period in every language — the
      app has no locale-aware runtime number formatter (`numerals.mjs` is script-side, and the only
      runtime formatter is `usd`, hardcoded `en-US`). Pre-existing, one language, and the fix
      strictly *reduces* the disagreement: `es` face-vs-description now differs only in separator,
      where before it also differed in precision.
    - **W-6.2 rule 3, answered:** (a) "a learner who got everything wrong was congratulated with a
      green tick"; (b) "three sections of the Market Dashboard were unreachable by heading
      navigation"; (c) "one bar in five was labeled to a different precision than its siblings".
      All three are things a person would meet. **No check is proposed for any of them** — W-6.3's
      number (`scripts/` at 2.3x `src/`) says a regex is the wrong instrument for all three, and
      (a) is a decision rather than a defect. **Honest priority: (b) medium, (a) low-and-owner's,
      (c) low.** ⛔ **(a)'s priority label was wrong too**: "low-and-owner's" was assigned on the
      belief that it was purely a judgment call, and the batch-pause half needed no decision from
      anyone. **Nothing here remains open.**
    - ⚠️ **(b)'s own numbers were wrong, and this item is the evidence.** I filed (b) from a live
      measurement I had just taken, and still got both the total and the count of missing headings
      wrong — and the *disposition* wrong with them, since three of the four "missing" headings turn
      out to be correct markup. **A residual filed by the run that saw the thing is not exempt from
      step 3.5.** ✅ **All three closed 2026-09-02** — this line read "(a) and (c) remain open"
      until 2026-09-02's compression pass; they closed later the same day, and the item's own
      summary above already said so. A closed item can still contradict itself.

162. **✅ DONE 2026-09-02 (owner-directed: "do the ko/zh/ja glossary translations too"), the same
    day it was filed — the O-3 call this item said it needed, made for this corpus.** All 42 true
    positives completed across ko/zh/ja (45 strings including the three VIX bands), §67 reads
    **0/336 abridged**. **The durable part is the instrument's false-positive rate, now recorded as
    data:** after the fix, **30 of 336 pairs (9%)** still scored under threshold and every one was
    READ and is complete — the discursive item-35 English rendered in compact CJK. They live in §67's
    `READ_COMPLETE` with the code-point length each had when read; **control 6** proves a listed pair
    cut to 20% FAILS rather than hides, and a plant on the live file confirmed it (36 → 16 cp, exit 1).
    ⚠️ **Read this before applying the same method to item 161's kidsContent remainder:** if the
    parent guide's remaining 21 ko/zh/ja pairs are the same shape, some of them will turn out to be
    complete compact translations too — read each, do not pad.
    **`entry.f` renders on TWO screens** — the Glossary list (`Glossary.jsx`) and the term-detail
    screen (`TermDetail.jsx`) — in whatever language the learner has selected. This is not a
    latent corpus.
    **The mechanism is authoring date, not language, and the evidence is the cross-language
    overlap: 14 paths flagged in ALL FOUR languages at once**, and they are exactly the original
    macroeconomic cohort (Bubble, CPI, Credit, Credit Spread, Deflation, Deleveraging, Fed Funds
    Rate, GDP, Inflation, PMI, Productivity Growth, QE, QT, Yield Curve). The personal-finance
    entries added 2026-08-16 (item 35) are complete clause-for-clause in every language; the macro
    entries carried over at the 2026-08-01 split were written as terse glosses and never grew.
    `glossary.js`'s own header already said the file has two vocabularies of two different vintages
    — nothing had ever measured what that cost the translations.
    **A second, narrower mechanism rides along: an English-only edit that never propagated.**
    `Credit.f`'s "monetary base (M0)" clause was added 2026-08-26 by item 114 in English alone,
    which is why the Spanish scored 0.58 while the rest of its sentence was a full translation.
    ⚠️ **The ratio has BOTH error directions here too, and this run found a false negative in its
    own corpus rather than inheriting the warning from §66.** `VIX` es scored **1.00** — a clean
    ratio — and was still incomplete: the English carries three bands (below 15 / 25-35 / above 40)
    and every one of the four translations carried two, dropping the middle "fear" band. It was
    fixed alongside the flagged set, and it is the reason this item says **an unflagged pair is not
    a certified pair.** The same shape is likely to remain in ko/zh/ja and §67 cannot see it.
    ⚠️ **Do NOT re-use §66's `MIN_EN * 2` gap heuristic here.** It fits `kidsContent` (shortest
    body 95) and fails on this corpus for no defect at all — the glossary's longest short name is
    35 code points and its shortest definition is 70, so 40 sits in a real and empty gap that 80
    would have condemned. §67's control 5 asserts the gap **this** corpus has. Copying a threshold
    across corpora is the drift this log keeps catching in figures; it applies to constants too.
    **§67's known blind spot, asserted as a control rather than left as prose:** a corpus abridged
    EVENLY in every unit moves its own p90 and reads as clean. There is no recorded baseline for
    `glossary.js`, so nothing here would catch slow uniform decay.

161. **✅ DONE 2026-09-02 (owner-directed: "do item 161's remaining ko/zh/ja pairs too") — the O-3
    call this item said it needed, made for this corpus.** §66 reads **0/192 abridged**. Reading the
    21 flagged pairs found **18 true positives and 3 complete translations**; reading the UNFLAGGED
    side found **7 more abridged pairs the ratio never caught** — including the exact one this item
    predicted (ko `13-17.lessons[1]` dropping the 12-24 month lag) and zh `5-8.lessons[1]` dropping
    *"That's like inflation!"*, the blurb's entire point, at a ratio the check called clean. All 25
    completed. **9 pairs remained under threshold after the fix and all 9 are complete** — recorded in
    §66's `READ_COMPLETE` with the length each had when read; control 6 proves a listed pair cut to
    20% FAILS (plant on the live file: zh `13-17.parentTip` 26 → 9 cp, exit 1). **Transferable:** on
    both corpora audited today the ratio's misses were in BOTH directions and roughly equal in count
    — the reading, not the ratio, is the measurement.
    ⚠️ **The ratio is a screening proxy and has BOTH error directions — read every flagged pair
    before believing it.** False positives on short units: `13-17.parentTip` scores zh 0.23 and is a
    complete translation; the three `title`s scored 0.35 and are complete, which is why §66 excludes
    units under 40 code points and controls that exclusion. False negatives too: `13-17.lessons[1]`
    ko silently drops *"But it takes 12-24 months to feel the change!"* and never flagged.
    **§66's known blind spot, asserted as a control rather than left as prose:** a corpus abridged
    EVENLY in every unit moves its own p90 and reads as clean. §33's recorded baseline, not §66, is
    what would catch slow uniform decay; `kidsContent` has no such baseline.

160. **🟡 PARTLY DONE, and its own stop-clause is CORRECTED (2026-09-02, owner-directed: "do item 160
    next"). The clause below says "there is nothing left in it that trimming can honestly reach" and
    routes the remainder to O-3. That is TRUE OF MECHANICAL CUTS — re-proven this run with a stronger
    cutter — and FALSE OF HAND DELETION, which reached the band in all five languages on two
    questions, including one of the two the clause names as the head of the O-3 queue.**
    - ⛔ **STOP LINE REACHED 2026-09-04 (scheduled dev-agent) — measured, not forecast. Everything
      still open in this item is class B, and class B is O-3's decision. Read this before picking it again.**
      - **Length is the ONLY exploitable axis in this quiz, and that is now measured rather than assumed.**
        Two other tells were scored this date, each with controls that fired in both directions:
        **answer position** — `0:10 / 1:13 / 2:13 / 3:10` over 46 questions, best single position
        **28.3% against a 25.0% baseline** (economy 28.6%, essentials 26.7%, money 35.3%); and the
        **absolute-qualifier tell** ("only/never/always/all…") — 22 of 46 questions carry at least one
        absolute-worded option, **P(correct | option is absolute) = 22.2% against 25.0%**, and the
        eliminate-the-absolutes strategy resolves to one survivor on **3 of 46** and is **0 for 3**.
        **Neither is a tell. Do not re-derive them.** Position is additionally guarded by
        `check-data.mjs` §3 at a 50% threshold; absolutes have no guard and need none.
        ⚠️ **`quizMeta.js`'s header still describes the spread as "roughly 3/3/4/3", which is the
        13-question figure from the 2026-08-02 de-skew.** The property it asserts holds; the number is
        stale. Left alone deliberately — W-5.5's rule says re-read it, not that a comment's arithmetic is
        this run's work — but the next run to touch that file should fix it.
      - ⛔ **CLASS A IS NOT A REACHABILITY SCREEN, and it comes apart at the second-ranked question.**
        Class A means "the English correct option has a detachable reasoning tail". Ranked by relative
        margin the queue is **`q008` 57% (B), `q021` 56% (A), `q014` 53% (B), `q005` 50% (A)**.
        **`q021` (lesson 7, marginal tax brackets) is class A and unreachable:** its tail
        (`— the rest is unchanged`, 22 code points) leaves the option at **87 against a ceiling of 54**
        (option 109, band [44,54]), because all three distractors are short slogans; `zh` must reach
        **≤16 from 25** and `ja` **≤18 from 32**. **A detachable tail does not imply a sufficient one.**
      - **`q005` (lesson 34) is the last reachable question and was DECLINED on quality, not on cost.**
        49 → ~23 lands in `en`, but its bands are **`zh` [4,6]** and **`ja` [6,7]** — landing them means
        re-cutting two unreviewed translations to six and seven characters to move §65 by two points.
        That is precisely the "moving the instrument without moving the defect" failure this item's own
        2026-09-03 corollary named. **If a future run wants it, it is a deliberate O-3-shaped choice.**
      - **Live §65 at this stop line, reproduced independently with five scorer controls:** longest-option
        **en 56.5%, es/ko 54.3%, zh/ja 52.2%**; shortest-option 2.2/2.2/0.0/2.2/4.3; **19 beatable in all
        five, 28 in at least one, 124 instances.** ⚠️ **`npm test` will warn at 56.5% every run from here
        and that is now expected, not a regression** — item 121's "a permanent warning is evidence the
        check or the budget is wrong" applies, and the resolution is O-3's, not a trim's.
      - **Honest priority: the remainder is BLOCKED, not low.** Distractor-quality work is new prose in
        four unreviewed languages. **Owner call (O-3), and it is the same call O-3 already asks for.**
    > ⚠️ **NOTE ADDED 2026-09-07 (W-6.2 rule 2 — a note, not a numbered item). A DIFFERENT quiz
    > defect class was swept to ZERO the same day; do not re-run it.** Every prior distractor pass in
    > this log is about LENGTH. The class *"a distractor the lesson itself asserts is true"* — a
    > learner picks an option the lesson told them was true and the app marks it wrong — had never
    > been swept (`AGENT_LOG.md` + archive return 0 for `also true`, `more than one correct`, `two
    > defensible`). Swept all **138 distractors** (46 questions x 3) against their own lesson body by
    > content-word coverage and by longest contiguous phrase match; controls fired in both directions
    > (`q001`'s verbatim correct option cov 1.00, an off-topic string cov 0.00, a verbatim L29 phrase
    > matching 5/5, and 46/46 questions resolving to a body). **Zero full-containment distractors,
    > and the 25 top-ranked read clean by hand.** Two structural notes so the ranking is not
    > re-derived: **`q010` is the corpus's only true negation-form question** ("which is NOT one of
    > the 4 tools"), where every distractor SHOULD be lesson-asserted and a high score is correct;
    > and numeric/acronym options (`q013` GDP/CPI/PMI, `q017`'s year figures) rank top on any
    > word-overlap measure and are noise. The instrument was a scratchpad reading aid and is
    > deliberately not committed — it has no threshold that could be a gate (W-6.2 rule 3).

    - ⛔ **RANKING BY DELETION COST RANKS BY WHAT THE EDIT COSTS *ME*, NOT BY WHAT THE LEARNER CAN
      EXPLOIT — and the two run opposite ways.** The previous pass closed by naming `q034` as
      "cheapest, tightest" (window 8, 12 code points to remove) and `q039` as the expensive one
      (73). Both figures reproduce exactly. But a learner cannot see a *count* of code points; they
      see a *proportion*. Measured as **relative margin — (len(correct) − len(longest distractor))
      / len(longest distractor)**, with two controls (a 2x runner-up scores 1.000, a +1-of-100
      scores 0.010): **`q034` is 11%, near the WEAKEST of the all-five set, and `q032` was 79-131%
      in every language — the largest tell in the corpus, and more than double the runner-up in
      zh and ja.** Cheap-first and exploitable-first are close to inversely ordered here, which is
      exactly why the biggest tells have survived nine passes. **Rank by relative margin; use
      deletion cost only to break ties.**
    - ⚠️ **A COROLLARY THAT KILLS THE CHEAPEST-LOOKING WORK ENTIRELY.** By deletion cost the three
      cheapest questions in the corpus are `q009` (1 code point), `q010` (1) and `q018` (2) — nine
      tell-instances for about four characters, which looks like the best trade in the item. It is
      not work at all: their relative margins are **3%, 3% and 3%**, i.e. one character out of
      thirty. Shipping those would drop §65 by four points while changing **nothing a human eye can
      resolve** — moving the instrument without moving the defect. **Measured: 6 of the 129
      beatable instances rest on a margin under 5%.** So §65's strict-max rule over-reports, but
      only slightly; the number to distrust is not the rate, it is any ranking built from it.
    - ⚠️ **NOT A PURE DELETION, and the reason is worth keeping.** Deleting the clause alone left
      **en at 44 against a floor of 46** — strictly *shortest*, i.e. the inverse tell this item
      warns about, created by the fix for the forward one. The English was re-worded rather than
      cut (`plus roughly $1,580 more` → `plus the roughly $1,580 he gave up`). **A band has two
      walls, and the cheap questions are the ones where they are close together.**
    - **The remaining 28 split into two classes, and item 160's own rule only reaches one of
      them.** Screening the English correct option for a detachable reasoning tail (em dash, or a
      `because`/`since`/`so that`/`which`/`that would`/`if` subordinator; control: `"A — B"` reads
      true, `"Always buy stocks"` reads false): **class A — a tail to move into `explain` — is 12
      questions** (`q005 q021 q023 q027 q028 q033 q034 q035 q036 q037 q039 q040`); **class B — no
      tail; the correct option is already a bare phrase and the DISTRACTORS are the short ones —
      is 16** (`q001 q004 q006 q008 q009 q010 q011 q012 q014 q018 q019 q024 q025 q031 q043 q045`).
      **`q008` (lesson 40) is now the corpus's largest tell at 57-133% and it is class B**: its
      answer is *"Don't have debt rise faster than income"* against *"Always buy stocks"*, *"Never
      borrow money"*, *"Save 50% of income"* — a two-term comparison against three one-term
      slogans, with nothing to delete. **Class B is not this item's rule; it is distractor-quality
      work, it means writing new prose in four unreviewed languages, and it is therefore O-3's**,
      exactly like the (b) clause below. **A future pass that keeps ranking by relative margin will
      hit class B almost immediately — that is the stop line, not a surprise.**
    - ⛔ **THE PREVIOUS PASS'S CANDIDATE LIST OMITTED THE CORPUS'S WIDEST-WINDOW QUESTION, and the
      omission is a property of how the list was built rather than an error in it.** That pass
      named `q026`, `q034`, `q039`, `q012` as "the next candidates", honestly qualified as "of the
      ones inspected this run". Ranking **all 22** by the window measure this item prescribes puts
      **`q029` first** — minimum window 17 code points against `q026`'s 14, `q039`'s 12 and
      `q034`'s 8 — and `q029` appears on no previous list. **Rank the whole set, not the ones you
      happened to open**; the ranking is four lines of arithmetic over `quizMeta` + the five
      `quizText` modules and is written out in the run-log entry.
    - ⚠️ **MARGIN IS THE THING TO RECORD, NOT JUST FEASIBILITY — the tightest cell here is `q026`
      zh at 21 against a ceiling of 23.** A landing that merely clears `bandMax` re-opens the
      question the moment someone trims a distractor, which is the fragility this item already
      flagged on `q020`'s four exact ties. Every other cell this pass has ≥4 of margin. **Quote
      `answer` and `[bandMin, bandMax]` per language when filing a landing, so the next editor can
      see which cells are load-bearing.**
    - **`q020`** dropped `in retirement` / `now` and their four translations, which made the
      answer the **exact mirror of its inverted distractor** — the same sentence with `withdraw`
      and `contribute` swapped, at 73/73 en, 60/60 es, 41/42 ko, 28/28 zh, 37/37 ja. That is the
      strongest form of this item's style rule: length carries **zero** information, and the pair
      stays equal-length by construction as long as both are edited together. ⚠️ Four of those
      five are exact ties at the band ceiling, so an edit to distractor **[1] alone** re-opens the
      question — edit the pair or neither.
    - ⚠️ **RANK THE QUEUE BY WINDOW WIDTH, NOT BY HOW MUCH MUST COME OUT — this is the reusable
      part.** The obvious ranking (total deletion needed across five languages) puts `q001`,
      `q006`, `q011` first; all three are **infeasible**, because their distractor bands are
      narrow (`q001` zh window **1**, `q004` zh **1**, `q014` ja **0**). `q046` and `q020` sit
      8th and 14th on that ranking and are the two easiest in the corpus, because their bands are
      wide (`q020` en [21,73]). The measurement to take per language is the pair
      **`[bandMin, bandMax]`** and the allowed deletion range **`[len-bandMax, len-bandMin]`**;
      a candidate is feasible when the semantically irreducible string fits inside it in **all
      five**. Prove the candidate is a deletion rather than a rewrite by asserting it is a
      **subsequence** of the shipped string (control: appending one character must fail).
    - **The binding constraint is CJK, and it is the distractor ceiling rather than the answer
      floor.** The clause below says CJK correct options cannot be trimmed; measured across all
      24, the sharper statement is that `ko`/`zh`/`ja` **distractors** run 2-16 code points, so
      the ceiling a trimmed answer must fit under is tiny — `q001`'s Chinese band is [4,5]. Its
      parenthetical `（货币+信贷）` is exactly the shape this item likes and deleting it lands at
      **3**, i.e. strictly shortest: the tell inverted, not removed. **`q001` is the first
      question a new install answers and it is O-3's, not a trimmer's.**
    - ⛔ **AND THE LAST ONE CLOSED THE SAME DAY, owner-directed ("do q042 with the distractor
      work") — the FIRST deliberate O-3 enlargement in this project, priced at +550 characters
      across 15 distractor strings, +366 of them in the four unreviewed languages.** `q042` was the
      question no deletion could reach (a 7-character window in en, **2** in ja). Its three bare
      distractors now each name what that bias would look like in the story, checked against the
      question's own `explain`. **Budget the rest of this item at one question per pass, and expect
      the reading-time coupling:** the option prose is inside `READING_MODEL`, so lesson 28 went
      4 → 5 minutes and the catalog total 160 → 161, regenerated through `npm run readiness`.
    - ⚠️ **AND THE RULE THIS ITEM RESTS ON HAS A HOLE — see item 165.** "The reasoning belongs in
      `explain`" assumes `explain` carries it. Measured this run: **69 of 184 question/language
      pairs are abridged**, concentrated on `q001`-`q014`, the economy track. `q007`'s Spanish
      explanation said only "QE is the Fed's emergency tool" — the mechanism was missing in four
      languages. **Before moving reasoning out of an option, check that the destination is not a stub
      in es/ko/zh/ja.**
    > ⚠️ **Second correction, mechanical but load-bearing: every question label in this item is an
    > ARRAY POSITION, not a question.** "q12/q21/q37/q43/q40/q41" are 0-based indices into `quizMeta`
    > and resolve to ids **q013, q022, q038, q044, q041, q042** (lessons 39, 8, 24, 42, 27, 28 — the
    > lessons this item names, which is how the reading was confirmed). Read as stable ids they name
    > **different questions in every case** (q012→L38, q021→L7, q037→L23, q043→L41). This item was
    > written the same day `review.js` stopped keying learner state by array position for exactly this
    > reason; the labels are left as-is above because they are a dated record (§31), and this line is
    > the translation. **Cite questions by `id` from here on.**
    **Measured 2026-09-01 over the 46 shipped questions, five languages, controls in both directions:
    - *Compressed 2026-09-04 (fifth backlog-compression pass, owner-directed). Dropped: the
      per-tranche shipping chronology and its superseded §65 progressions, the per-tranche O-3
      accounting, the retained ORIGINAL ITEM TEXT block and the old (a)/(b) candidate lists — all of
      it in the run log and the archive under those dates. Kept byte-identical: the headline, the ⛔
      stop line, and every block carrying a standing rule or a named trap. Two were nearly lost and
      are here because a marker count caught them — q020's *edit the pair or neither* tie constraint,
      and the ⚠️ note that the old `q12`-style labels are ARRAY POSITIONS rather than ids. **The live
      §65 figures are the stop line's, not any tranche's.***
159. **✅ DONE 2026-09-01 (scheduled dev-agent) — but the premise as written is WRONG in its
    headline and RIGHT in its consequence, and the correction changed what got built. Read the
    correction before citing this item.**
    > ⛔ **PREMISE CORRECTED 2026-09-01, by measurement, before any edit (step 3.5).** The claim
    > "**every** content instrument sweeps `sections` and skips `takeaway`/`thinkAbout`" is false and
    > was cheap to refute: `translation-review.mjs`, `translation-completeness.mjs`,
    > `refresh-readiness.mjs`, `jargon-candidates.mjs` and four separate corpus walks inside
    > `check-data.mjs` all read both fields today, by name. **And the lesson-38 failure this item was
    > filed from was not a field-coverage failure at all** — `check-blindspot.mjs` greps whole files
    > line by line, so §10.1 has never been field-scoped; the takeaway survived because no *pattern*
    > matched it, not because no sweep read it. Attributing that escape to field coverage would have
    > sent the fix to the wrong place.
    > **What the measurement did find, and it is the item's real content:** exactly ONE instrument
    > was field-blind — §17b's `mentionedIn`, the §3.0.3 coverage sweep — and the UI was blind the
    > same way, because `GlossaryTerms` rendered under sections only. The two agreed with each other.
    > **9 glossary-term uses across 7 lessons were visible to nothing**: GDP and Debt-to-GDP Ratio on
    > 33, Deflation and Credit on 34, QE on 35, Interest Rate on 38 and on 9, Emergency Fund on 8,
    > Stock on 11. §17b printed "0 unexplained" over a corpus that never contained them.
    > **Shipped:** `TAIL` is now a section key in `lessonTerms.js` carrying those 9 chips, a chip row
    > renders under the takeaway/reflection pair with its own five-language label, §17 validates
    > `TAIL` entries against that pair's text, §17b sweeps it, and two new guards fail if either the
    > row or the widened corpus goes away. Sweep 136 → 145 uses, 95 → 104 chips, 30 → 31 lessons,
    > 0 unexplained on both sides. `deliberatelyUnlinked` was NOT used: its only two legitimate
    > reasons are `defined-here` and `other-sense`, and not one of the nine is either.
    **Scope note before anyone builds an instrument for this (W-6.3 — `scripts/` is 2.3x `src/`).**
    The cheap version is not a new script: it is adding `takeaway`/`thinkAbout` to the field list
    that §17b and the §10.1 corpus walk already iterate. Measure which existing sweeps take a field
    list at all before proposing a new section.
    **Residual, filed as a NOTE under this item rather than as a numbered item (W-6.2 rule 2), because
    it measures zero live instances today:** the same closing-pair blindness could exist in the other
    direction for `LessonVisual` captions and `PolicySim` copy, which no per-field corpus walk names
    at all. Not measured this run. **If a future run picks it, measure first — this item is the
    standing proof that a residual's own headline can be wrong while its consequence is real.**

158. **[Owner decision — filed 2026-08-31, NOT actionable by a run. §10.2's text bans "no direct
    quotes, anywhere in the app", and the app ships a direct Warren Buffett quotation.]**
    `lessonContent.economy.{en,es}.js:196` — lesson 38's `thinkAbout` opens *Warren Buffett says
    "Be fearful when others are greedy, and greedy when others are fearful."* §10.2's register
    entry is titled **"Dalio dependency"** but its body reads **"No name-brand framing, no direct
    quotes, anywhere in the app or its marketing. Credit belongs in an acknowledgments line, not
    the product."**
    **This has been looked at and deliberately left, twice** (archive: *"the Buffett quotation in
    38's thinkAbout was left byte-identical"*, and *"§10.2 explicitly re-checked: /dalio/i clean"*)
    — both runs read §10.2 as Dalio-scoped, which the entry's title supports and its body does not.
    **The ambiguity is in the rule, not in the runs**, and a run must not resolve it unilaterally in
    either direction: deleting a quotation the register may not actually ban, or keeping one it
    does, are both content decisions with a legal-adjacent rationale behind them.
    **What the owner is being asked for is one word: is §10.2's "no direct quotes" clause scoped to
    Dalio, or general?** If general, the Buffett quotation goes and `check-blindspot.mjs` gains a
    pattern; if Dalio-scoped, §10.2's body should say so, because as written it reads as a standing
    rule the app violates on lesson 38.

157. **✅ DONE 2026-08-30 (scheduled dev-agent, self-picked; the owner independently asked for
    this item the same day — see the attribution correction below), the same day it was filed —
    and it re-classified SEVEN references, not "every existing reference". Read the two
    corrections below before trusting this item's own scoping.**
    > ⛔ **ATTRIBUTION CORRECTION 2026-08-30 (owner-directed: "fix the log attribution").**
    > This headline and the run-log entry both opened with `owner-directed: "do route (c)
    > next"`. **No such directive was given, and that exact string was never said by anyone.**
    > The run selected item 157 itself, from the backlog, which is a scheduled dev-agent run
    > working exactly as intended and needs no borrowed authority. The owner did ask for this
    > item the same day — in the words *"do item 157 now"* — so the **substance** (that the
    > owner wanted it) is right while the **quotation** was not.
    > **The run-log entry at `### 2026-08-30 … (item 157)` KEEPS its original header verbatim**,
    > per §31 and item 91: run-log entries are dated records, and the established convention in
    > this log is that only the live line is corrected while the dated record stands with a
    > pointer to the correction. That is why the two now disagree on purpose.
    > ⚠️ **The standing rule this earns, because a fabricated quotation is worse than a wrong
    > number: `owner-directed` is a CLAIM ABOUT A PERSON, and a quoted directive asserts words
    > someone actually said.** Do not write `owner-directed` unless a directive was actually
    > given, and do not put quotation marks around a paraphrase or a reconstruction of what the
    > pick "would have been" asked for. **`(scheduled dev-agent)` is the honest and entirely
    > respectable default** — most of this log's best work carries it. An invented directive
    > also corrupts the record of what the owner actually decided, which is the one thing in
    > this repo no measurement can reconstruct.
    > **CORRECTION 1 — the blast radius was measured, and the item over-estimated it.** Before
    > touching anything, both trees were computed and every reference resolved under each: exactly
    > **7 references across 2 paths** change classification — `economic-cycles-v5.jsx` (5 refs:
    > LAUNCH_READINESS 37, LAUNCH_PLAN 57 + 72, DECISIONS 23, README 7) and
    > `economic-cycles-v6.jsx` (2 refs: LAUNCH_PLAN 72, README 7). Nothing else moved. The
    > prediction was then confirmed exactly by the real check, which failed on those 7 lines and no
    > others. `node_modules/` and `dist/` were never at risk — §26's walk already excluded them and
    > no reference names them with a guarded extension.
    > **CORRECTION 2 — "tracked-or-ignored" is the WRONG predicate, and adopting it would have
    > re-opened the class this item exists to close.** The item proposed it to keep the gitignored
    > prototypes resolving. But `economic-cycles-v5.jsx` is gitignored precisely so that **no clone
    > ever has it** (the 2026-08-16 owner decision, "ignored, not deleted"). A README telling a
    > cloner to read a file they cannot have is the same broken promise as `drafts/` was — the only
    > difference is which git mechanism hides it. So the predicate implemented is **tracked**, and
    > the 7 references became honest `path-ok` exemptions: 6 markers, 7 uses,
    > `EXPECTED_EXEMPTIONS` **13 → 20**.
    > **THE INDEX, not `HEAD`.** The index is the commit about to be made, so a run that adds a file
    > and cites it from a document in the SAME commit still passes — this repo's normal shape.
    > `HEAD` would have forced that into two commits. Proven by control C below.
    > **Controls — four, run in a REAL `git clone` so the index path was the one exercised, plus the
    > refutation half the item asked for:**
    > - **A** baseline clone → exit **0** (git index, 136 files, 20 exempted).
    > - **B** a file **present on disk but untracked**, cited from README → **exit 1**. The identical
    >   plant in a non-git copy, where §26 falls back to the filesystem, → **exit 0 with zero
    >   findings.** That pair is the two-sided proof: the rule changed in the intended direction,
    >   rather than everything merely continuing to pass.
    > - **C** the same file **staged** → exit **0** (333 refs, 137 files) — same-commit workflow intact.
    > - **D** a path existing nowhere → exit **1** — the original catch still works.
    > - **Both halves green:** working tree exit 0 and fresh clone exit 0, each reporting 20
    >   exemptions.
    > ⚠️ **The Environment note's clean-tree recipe changed with this** and has been updated: it must
    > no longer `cp economic-cycles-v*.jsx` into the archive copy, because that would make the two
    > paths resolve there and their new markers fail as **stale** — the same "control that fails for
    > its own reasons" trap, wearing the opposite face. A `git archive` copy is not a git repo, so
    > §26 falls back to the filesystem there, which is correct in that copy *only* while nothing
    > untracked is copied in. To exercise the primary path instead, use `git clone -q .`.
    >

156. **✅ DONE 2026-09-03 (scheduled dev-agent) — the measurement this item asked for was taken, and
    it cleared the axis the item names while finding a LIVE defect on an axis the item does not
    mention.** The item's question — does the coach mark center correctly at 320px/200%? — answers
    **yes**, at 100/115/130/150/200%: `left: 16, right: 304`, `scrollWidth === clientWidth === 320`,
    0 box and 0 text overflows. **The pattern-consistency argument was sound and the change it
    defended was right.**
    ⛔ **What the item did not scope was the VERTICAL clearance, and that was broken in shipping
    code.** `bottom` was `calc(… + 12px + 76px + 10px)`, where `76px` is the nav pill's height
    measured at the 1.3x font scale — a text-driven quantity frozen as a constant. Browser/OS text
    zoom goes past 1.3x (WCAG 1.4.4, AA — the same criterion item 153 established): the clearance
    fell 23.4 → 18.2 → 12.9 → 6.6px across 100/115/130/150% and **inverted to a 37.2px overlap at
    200%**, where the pill is 123.2px tall. The coach mark is `zIndex: 150` over the nav's 100, so
    `elementFromPoint` at the top edge of **all three tabs** returned the coach mark. Tap targets
    shrank by 32px of 113px rather than dying, and the overlay was plainly visible over the tab bar.
    - **Fixed:** `--nav-h` is published from a `ResizeObserver` on the nav and the offset reads
      `var(--nav-h, 76px)`. Verified at six root font sizes in `en` and `ko`: `--nav-h` matches the
      measured pill to ≤0.02px and clearance is exactly 10px throughout.
    - ⚠️ **`rem` was considered and is WRONG, which is the transferable part.** The pill's height is
      not a function of root font size alone — the tab labels wrap (item 153), so at the **same** 200%
      root font the pill is **123.2px in English and 99.2px in Korean**. No font-relative constant
      spans a 24px language-dependent gap; re-expressing the px constant as `4.75rem` would have been
      the same defect in a better-looking unit.
    - **The durable methodology note is in the run-log entry** and a reviewer needs it: in the Browser
      pane `requestAnimationFrame` never resolves, and `ResizeObserver` does not deliver while the
      pane is hidden — a planted control observer fired 0 times and the fix looked like a no-op. A
      `computer{action:"screenshot"}` forces the paint that delivers the callbacks.

155. **✅ CLOSED 2026-09-08 (scheduled dev-agent)** — replaced by its conclusion per W-7.2 rule 1;
    the full argument, every measurement and the refuted premise are in this date's run-log entry.
    **What was true:** the text-zoom sweep that had found the class's live defects existed only in
    each session's browser console, and `a11y-sweep.js`'s `horizontalOverflow` could not see text
    overflow at all — an overflowing word does not widen its element's border box, so a right-edge
    scan reads the box as innocent. Four live defects in this class in ten days (the Reference hub's
    clipped headings, the lesson reader's "Completar" button, `MarketSignals.jsx`'s bare `1fr` grid,
    seven ja/zh fullwidth-bracket clips), each found by an ad-hoc probe that then evaporated.
    **What is true now:** `a11y-sweep.js` carries a 12th probe, `textOverflow`, reading
    `el.scrollWidth` against the element's own box, with the four exclusions each chosen from a
    measurement on this app (XHTML namespace only — 16 phantom SVG `<text>` findings on the Market
    Dashboard; the visually-hidden idiom; deliberate `nowrap` + `ellipsis`; scrollable self or
    ancestor) and a deepest-element rule, because one planted leaf produced **17** flags. It has a
    planted control that `check-data.mjs` §43 now requires (11 → 12 probes declared, all
    layout-gated ones controlled). Swept clean and non-vacuous over 10 screen readings at 320px/200%
    in `en` and `ja`, with the control re-fired in the `ja` context to prove the zero was a reading.
    ⛔ **One premise of this item was REFUTED and must not be re-derived:** it said the
    scrollable-ancestor exclusion "applies to the BOX probe too", citing the parent guide's age-band
    rail as a false positive "on every run at 200%". Measured 2026-09-08: it is **not**.
    `horizontalOverflow`'s element scan is gated on `documentElement.scrollWidth > clientWidth`, and
    on that screen the rail is clipped so the document never scrolls — the gate never opens and the
    scan never runs. The exclusion is needed for the **new, ungated** text probe (where the rail
    reports 424 against a 288px box) and **`horizontalOverflow` was correctly left untouched.**
154. **✅ DONE 2026-08-30 (owner-directed: "fix the fresh-clone test failure now") via ROUTE (a)
    — `drafts/income-hierarchy.en.md` is now TRACKED, and a fresh clone exits 0.**
    > **The measurement, both directions, on the tree that shipped the fix:**
    > `git archive $(git write-tree)` into an empty directory, `node_modules` symlinked, the two
    > gitignored `economic-cycles-v*.jsx` copied, **and `drafts/` deliberately NOT copied** —
    > `npm test` exits **0** (4 warnings, all recorded debt). The working tree also exits **0**.
    > **Before the fix the same recipe exited 1**, which the weekly review reproduced first so
    > the fix had something to prove.
    > **Why (a) and not (c):** route (a) makes `DECISIONS.md:669`'s citation TRUE rather than
    > exempted — the file is the approved proposal behind shipped lessons 41-44, and a source
    > document for shipped content belongs in the repo. `drafts/` was never gitignored
    > (`git check-ignore` exits 1), so nothing about the owner's setup argued against it.
    > **Route (c) is still worth doing and is filed as item 157** — it prevents the whole class,
    > which (a) does not.
    > ⚠️ **The file carries British spellings ("labour", "favour", "specialised", "catalogue")
    > and they are CORRECT AS THEY STAND. Do not "fix" them.** It is a dated approval document
    > (2026-08-18) cited as a dated record by `DECISIONS.md`, and item 91's house-style rule
    > exempts quotations and dated records verbatim. It is also genuinely out of scope: §59's
    > MARKDOWN set is exactly five normative documents (`DECISIONS.md`, `LAUNCH_PLAN.md`,
    > `CLAIMS.md`, `README.md`, `LAUNCH_READINESS.md`) — measured, not assumed, and the reason
    > tracking the file introduced no §59 failure.

153. **✅ DONE 2026-08-30 (scheduled dev-agent) — but read the premise correction first, because
    this item named the WRONG SCREEN, its numbers did not reproduce, and the basis on which W-6.2
    parked it was the one thing that turned out to be false.**
    > **PREMISE RE-MEASUREMENT 2026-08-30 — the headline was false at `HEAD` and the item was still
    > right that a defect existed.** Re-measured on the screen the item named (320px, light, `en`,
    > Reference > Market Dashboard), with the chart confirmed rendered (all five bars present, so
    > not a lying zero): **0 overflowing nodes at 100/115/130/150/200%**, scrollWidth 320 at every
    > step except 324 at 200% — against the item's claimed 3/9/15 nodes and 323/359/447. The item's
    > figures were taken BEFORE item 148's fix landed and were filed unchanged after it.
    > **The tab-bar half was real but on a different screen.** Sweeping all nine screens instead of
    > the one named found the failures on **Reference hub** (scrollWidth **408** vs a 320 viewport,
    > 16 nodes, at 200%) and **Sector performance** (**379**, the `NAV` itself 347px wide).
    > **⚠️ The instrument the item prescribed cannot see the worst of it.** A right-edge scan over
    > `getBoundingClientRect()` misses TEXT overflow, because an overflowing word does not widen its
    > element's border box. The tell is a `scrollWidth` that disagrees with a zero node count, and
    > following it found clipped headings the box probe called clean.
    > **⚠️ W-6.2 parked this item as "zero live instances AND honest priority: low". That parking
    > was correct given the item's TEXT and wrong about the app:** the real instances were live and
    > learner-visible — a hub that scrolled sideways, headings cut off mid-word under
    > `overflow-x: hidden`, and three age-band labels drawn on top of one another. The park is not
    > the defect; **an item's own numbers going stale between filing and reading is**, which is what
    > step 3.5 exists for.
    - **Measured 2026-08-30, 320px light, `en`, Reference > Market Dashboard, by overriding the root
      font size directly:** 100% and 115% clean; **130% → 3 overflowing nodes** (scrollWidth 323);
      **150% → 9** (359); **200% → 15** (447). At 150% and above the overflowing set stops being the
      chart alone — `NAV`, a `BUTTON` and a `SPAN` from the bottom tab bar appear in it.
    - **What item 148's fix does and does not cover.** The chart half is fixed: below 375px the bars
      are rows, so the chart no longer overflows at any of these steps. **The tab bar is untouched**
      and was never in item 148's scope.
    - **The honest framing, because it decides the priority.** `FONT_SCALE_STEPS` tops out at **1.3**,
      so 150% and 200% are not reachable through the app's own control — only through browser or OS
      text zoom. WCAG **1.4.4 (Resize Text, AA)** is about exactly that path, so this is a real
      criterion and not a hypothetical, but it is one the app has never claimed.
    - **Carry a control if you pick it up:** the root-font override used above is the instrument, and
      its two-sided control is that 100%/115% must read clean on the same screen in the same pass.
    - **Honest priority: low-to-medium.** Downstream of O-1 like everything else.
    - **✅ WHAT SHIPPED (2026-08-30).** One root cause in five places: a flex or grid track whose
      automatic minimum is its MIN-CONTENT size, so it could not shrink when text grew.
      `TileGrid` → `repeat(auto-fit, minmax(min(6.5rem, 100%), 1fr))`; the nav pill → `100vw`-based
      width and auto-margin centering instead of `100%`/`left: 50%`; the tab buttons → `minWidth: 0`
      plus a wrappable label; `Segmented` → `flexShrink: 0` so its container's `overflowX: auto`
      scrolls instead of the labels overlapping; Settings' radio rows → `flexWrap: "wrap"`; and
      `body { overflow-wrap: break-word }` so a long word breaks rather than being CLIPPED by the
      `overflow-x: hidden` that was already there. **9 screens × 100/130/200% all report 0 box and 0
      text overflow, scrollWidth 320 throughout**, both probes' controls firing in the same pass.
    - **The threshold was computed, not eyeballed, and the first draft was a regression.** `9rem`
      collapsed the hub to one column at 100% on every 320px phone. `6.5rem` keeps two columns at
      100/115/130% — 130% being `FONT_SCALE_STEPS`' own ceiling, so nothing reachable in-app moves —
      and collapses only at 150/200%.

152. **[Content/QA — filed 2026-08-30 by the run that closed item 151, as its stated residual rather
    than smuggled into the same commit.] §50 now proves lesson 23's zone/series/axis labels say the
    right things in the right positions. The COLORS those positions are drawn in are paired by index
    too, in a different file, and nothing checks that pairing at all.**
    - **The coupling, read off `LessonVisual.jsx:190-194` on 2026-08-30:**
      `colors={[graph.amber, graph.green]}` (series 0 = the sooner $50 = amber, series 1 = the later
      $65 = green), `labelInks={[ink.warn, ink.ok]}`, `zoneColors={[surface.okWash, surface.warnWash]}`
      and `zoneEdges={[graph.green, graph.amber]}`. The zone arrays are **deliberately the reverse of
      the series arrays**: zone 0 is the band where the *later* reward wins, so it is washed with the
      *later* reward's green. That inversion is correct and it looks like a mistake, which is exactly
      the shape someone "tidies".
    - **The hole:** rewrite `zoneColors` to `[surface.warnWash, surface.okWash]` for consistency with
      `colors`, and the figure washes the wait-for-the-$65 band in the $50's amber and vice versa,
      while §50 (i) and (j) both stay green — they read content strings and this is a JSX prop. The
      learner then reads a band whose color says one thing and whose label says the other.
    - **Why it was not done in item 151's commit:** (j) asserts over `moneyVisuals.js` exports, which
      `check-data.mjs` already imports. These four arrays are JSX props in a component file that no
      §50 block reads, so covering them needs either a source-text parse of `LessonVisual.jsx` (brittle)
      or lifting the color choice into the content module beside the labels it belongs to (a real
      refactor, and the better answer). **Decide which before writing any check** — a regex over JSX
      props is the kind of instrument this log has repeatedly found reading the wrong thing.
    - **Carry a control:** whichever route, injecting the swapped `zoneColors` must fail and the
      shipped order must pass. If lifting into content, the control is free the way (j)'s was.
    - **Honest priority: low.** Zero live instances — the pairing is correct today and was measured,
      not assumed. Downstream of O-1 like everything else.

151. **✅ DONE 2026-08-30 (scheduled dev-agent). Shipped as `check-data.mjs` §50 block (j) —
    THREE pairs, not the two the item scoped. Every premise held, including the one it flagged as
    needing confirmation. Read the corrections below.**
    > **PREMISE RE-MEASUREMENT 2026-08-30 — all four premises TRUE, which is itself worth recording
    > after ten consecutive items whose premises were wrong somewhere.** `flipZoneLabels[0]`→$65 /
    > `[1]`→$50 and `flipSeriesLabels[0]`→$50 / `[1]`→$65 in all five languages, read through
    > `amountsIn` with a live-instrument control, not by eye.
    > **The ⚠️ "confirm the drawn order" flag resolved in the item's favor.** `PreferenceFlip` fills
    > `zoneColors[0]` from the left edge to the crossing; at the left vantage the later reward is
    > perceived higher (4.643 vs 3.846). So zone 0 IS the wait-for-the-$65 band and the item's stated
    > assertion direction was right, not its mirror. The block derives this from `flipValue` at the two
    > end vantage points rather than pinning it, so a `k`/reward edit moves the expectation.
    > **SCOPE WAS WIDER THAN THE ITEM SAID, for the second item running.** `flipAxisLabels` is the same
    > shape — two elements, consumed by position (`[0]` drawn at the left edge, `[1]` at the right),
    > `[1]` states $50 in all five languages, `[0]` states neither — and block (i) reads neither of
    > them. Swapped, the figure captions its left edge, where the lesson says both rewards are a year
    > off, with "the $50 is available today". Same instrument, no extra cost, so it shipped here.
    > **The control the item proposed was the one that did not survive.** "A swap must fail while the
    > other four languages stay clean" covers the CONTENT and is what the five injections do. As an
    > INSTRUMENT probe it is unreachable: every spec is symmetric, so a passing pair's reverse always
    > fails the `must` half and a "reverse also passes" probe can never go red. It was written, proven
    > dead, and replaced. See the run log for both deleted probes and what shipped instead.

150. **✅ DONE 2026-08-30 (scheduled dev-agent). Shipped as `check-data.mjs` §50 block (i) —
    FIVE surfaces per language, not the one the item scoped. Both of the item's premises held; the
    scope was wider than it said. Read the correction below.**

149. **[Process/QA — filed 2026-08-29 by the run that built `A11yStates.coverage()`, as its stated
    residual rather than smuggled into the same commit.] `coverage()` can now name a probe that did
    not run on every state. It cannot tell "not applicable here" apart from "should have applied and
    silently did not" — and the first real run of it returned three such probes.**
    - **Measured 2026-08-29, 19 states at 320px x 130%:** `partialProbes` = `imagesWithoutAlt`
      (ok 1, VACUOUS 11 of 12 no-reload), `figureClaims` (ok 1, VACUOUS 11), `unnamedRegions`
      (ok 3, VACUOUS 9). Every one of those zeros is *probably* correct — a Practice runner has no
      `<figure>` and no `<img>` — but "probably" is the whole defect. This is item 118's shape one
      level up: **a probe that never fires looks exactly like a probe that keeps passing**, and the
      matrix has never stated which screens each probe is *supposed* to apply to.
    - **The cheap version, which reuses the whole existing mechanism:** let a state DECLARE the
      probes it expects to be live (`expects: ["figureClaims"]`), the same opt-in shape `requires`
      already uses for storage. `coverage()` then reports a VACUOUS-where-expected as a **gap** and
      a VACUOUS-where-undeclared as fine, and an over-declaration fails loudly. Roughly four states
      need a declaration; the rest are honestly empty.
    - **Carry a control if you pick it up**, and the two-sided one is obvious: `reference-markets`
      genuinely has figures (`figureClaims: ok`) and `practice-runner` genuinely has none — a
      declaration mechanism that cannot tell those two apart is not measuring anything.
    - **The other stated boundary, recorded here so it is not rediscovered:** `sweepLangs()`
      deliberately does not record into the ledger, so **no coverage claim in this repo yet crosses
      the language axis** — the 19/19 above is `en` only, and light theme only. Folding five
      languages into one row would produce exactly the mixed-axis average `coverage()` refuses to
      print, so widening this needs a per-axis claim shape, not a bigger ledger.
    - **Honest priority: low.** No shipped defect is known to live here. **Do not pick it over
      content or over an owner-facing item**, and note that item 120 carries the same caveat for the
      same reason. Downstream of O-1 like everything else.

148. **✅ DONE 2026-08-30 (scheduled dev-agent). Shipped as a fourth option the item had not
    priced — the columns become ROWS below 375px — plus `check-data.mjs` §62. The item's mechanism
    was exactly right; two of its numbers were not, and the fix had a silent failure mode of its own
    that the first working version shipped. Read the corrections below.**

140. **[A11y/Tooling — filed 2026-08-28 by the run that built §28c (item 139), as its stated
    residual rather than smuggled into the same commit.] §28c assumes the ring lands on a SURFACE.
    That is true today, it was measured rather than assumed, and nothing keeps it true.**
    - **State:** `outline-offset: 2px` paints the ring outside the control's border box, so the
      color beneath it is the nearest ancestor that paints a background — never the control's own
      fill. §28c therefore asserts ring x the 7 `--surface-*` tokens and deliberately **omits the
      fills**, because the ring token IS `--fill-accent`: ring-on-`--fill-accent` is **1.00:1 by
      construction**, and every fill pair fails (1.00–2.25:1 light, 1.00–1.74:1 dark). Asserting
      them would need an exemption list for pairs the app never renders — F10's shape, and the same
      reasoning that keeps `--ink-on-fill` out of §28's ink list.
    - **What was measured, so nobody re-derives it (2026-08-28, live against `dist/`):** 4 routes x
      2 themes = **8 sweeps, 106 focusable controls, 0 whose under-ring background could not be
      resolved**, and exactly **four distinct backgrounds** across all of it — `--surface-canvas`
      and `--surface-card` in each palette. **No `--fill-*` appeared under any ring.** Worst live
      ratio **7.10:1**, against §28c's static worst of 6.40:1 (light `--surface-sunken`, a surface
      no focusable currently sits on).
    - **The residual is a LAYOUT question and only a live sweep answers it.** Put a focusable inside
      a fill-backgrounded container — a filled callout, a selected segment that paints its own
      background, a primary-colored banner with a link in it — and the ring is drawn on that fill at
      ~1:1, while §28c stays green. No static check over `index.css` can see it.
    - ⚠️ **Two instrument traps this run hit, both of the "clean-looking answer that means nothing"
      family.** (a) **The pane defaults to system dark** — the first scan resolved `--fill-accent`
      to `#a9b6ff` with `data-theme` unset, so a single-pass sweep measures dark twice and reports
      it as both. Force `data-theme` explicitly and **carry a control per palette** (a planted
      focusable in a `var(--fill-accent)` wrapper; it read 1.00:1 in each). (b) **While the Browser
      pane is hidden, `innerWidth/innerHeight` are 0 and `getBoundingClientRect()` collapses** — a
      zero-size filter then silently drops most of the screen (35 of 53 controls on `#/learn`). The
      Environment note warns about this; front the tab and re-read `innerWidth` before trusting a
      count. **A timed-out async sweep also keeps running** and mutates `location.hash` underneath
      the next measurement — reload before re-measuring.
    - **Honest priority: low.** Zero live instances, measured. Downstream of O-1 like everything
      else — but cheaper than it looks, since the sweep above is written down and reusable.

144. **[Process/Tooling — filed 2026-08-29 by the run that built §59 (item 130), as its stated
    residual.] A comment block that MENTIONS `us-english:allow` in prose is exempted by it, and
    the first live instance was found by accident.**
    - **What happened, 2026-08-29:** §55's own header stopped failing §59 partway through the
      build, before any marker was placed in it. The cause: the header contains the sentence "see
      the us-english:allow note at §31's duplicate-title check above" — a *reference* to the
      convention, which the substring test reads as a *declaration* of it. The fix applied was to
      make that block's exemption explicit and stop the sentence quoting the token, but the
      mechanism is still there for the next comment that discusses the marker by name.
    - **Why it was not "fixed" this run.** Every candidate is worse than the defect at today's
      scale: requiring the marker at line start breaks the two Markdown markers already placed
      mid-line; requiring a following em-dash clause is a style rule a checker cannot enforce
      honestly; and a distinct "declaration" token means re-placing all 13. **One defect is not a
      class** — the same reasoning item 126 records.
    - **Carry a control if you pick it up:** the current tree is the positive fixture (13 real
      declarations, all deliberate), and a comment that merely names the token is the negative —
      write one, and the net must still flag its British spelling.
    - **Honest priority: low.** Zero live instances after the fix above, measured.

145. **✅ DONE 2026-08-29 (owner-directed: "do item 145 next"), the day after it was filed — and the
    item's central claim was FALSE. Two safety-relevant checks were live-defective the whole time.**
    - **What the item said, and what was wrong with it.** It said: *"No shipped instrument is
      affected, and that was verified rather than assumed."* **It was assumed.** The run that filed it
      checked which scripts *import* the content modules, found that every script it thought of as a
      "prose reader" imports, and generalized. It never considered a script that **greps the raw files
      without reading prose semantically** — which is exactly what `check-blindspot.mjs` does.
    - **THE LIVE DEFECT, proven by injection in both directions 2026-08-29.** `check-blindspot.mjs`
      reads `src/content/*.js` raw and applies **seven patterns that open with `\b`**: six §10.1
      advice patterns (en + es) and the §2.3 month-year date pattern. Lesson bodies are stored one
      physical line each with paragraph breaks as the literal escape `\n`, so the character before a
      paragraph-initial word is the letter `n` and **no word boundary exists**.
      **Measured, same phrase, same file, two positions:** `"We recommend buying now."` injected at a
      paragraph start → §10.1 reports **clean, build passes**; injected mid-paragraph → **build
      fails**. Identically for `"January 2026 was the turning point."` against §2.3.
      **So the two checks that exist to keep investment-advice language (§10.1) and live-looking dates
      (§2.3) away from learners were blind to the most likely position for a new sentence** — the
      start of a paragraph.
    - **The fix, and why it is an expansion rather than a split.** `grepFiles` now routes every line
      through `matchesLine()`, which expands the literal `\n` to a real newline before matching. A
      newline is a non-word character, which is precisely the boundary the leading `\b` needs.
      Splitting on the expanded newlines was rejected: it would renumber every hit, and the `file:line`
      in a failure message is how the owner finds the string. **Only `\n` needed expanding** — the
      corpus's other escapes (`\"`, `\\`) already put a non-word character before the next word, the
      CJK patterns never had boundaries to lose, and the unanchored patterns
      (`you should (buy|sell|invest)`) were never affected.
    - **The control that keeps it fixed, and it is executable rather than a comment.** A new
      end-of-file control plants the banned phrases in the corpus's real `\n`-escaped storage shape
      and requires they be caught; it also runs the **pre-fix matcher** on the same line and reports
      that it still misses — so the expansion is demonstrated to be load-bearing rather than asserted.
      It uses **the real pattern objects** (captured into module-level holders), not a second copy —
      item 141's lesson. Three further branches report distinct causes: patterns never captured,
      patterns broken outright, and a false positive on descriptive prose (`"were bullish"` must stay
      clean, so a widened net is caught as well as a narrowed one).
    - **The rest of the sweep, done properly this time and with a reason per script.** SAFE, verified
      individually: `check-data.mjs` §55 (walks **imported objects** — `TR`, `lessonContent`,
      `glossary` — so newlines are real), §59 (comment prose and Markdown, both real newlines), and
      its three `\b` uses (JSX source and prop strings, not content); `refresh-readiness.mjs`
      (dynamic `import()` in a `Promise.all` — my previous grep shape missed it and would have
      misfiled it as "no content access"); `translation-completeness`, `jargon-candidates`,
      `translation-review`, `check-payload`, `fetch-market-data` (all import). `check-measurements`,
      `check-claims`, `check-backlog`, `check-log-size`, `owner-tree` touch no content file and hold
      no leading-`\b` regex.
    > ⚠️ **THE STANDING LESSON, and it is not about escapes.** The false claim was not a guess — it
    > carried the words *"verified rather than assumed"* and named the scripts it checked. What made
    > it wrong was the **category**: "instruments that read prose" silently excluded "instruments that
    > grep files", and the sweep inherited that category without ever stating it. **A negative result
    > is only as wide as the set it enumerated — so write down the set, not just the verdict.** The
    > enumeration above is in this item for exactly that reason.
    - **The rule for measuring this corpus is unchanged and still one line: import it, never grep it.**
      Where a raw scan is genuinely required — as in `check-blindspot.mjs`, which must report
      `file:line` — expand `\n` first and **carry a control that plants a paragraph-initial specimen**.

143. **[Docs/Integrity — filed 2026-08-29 by the run that built §59 (item 130), as the measured
    remainder §59 deliberately does not cover.] Four British spellings live in `AGENT_LOG.md`'s
    own prose, and one lives in a dev-script string; §59 sees neither by design.**
    - **Measured 2026-08-29, and the split is the whole point.** `AGENT_LOG.md` carries 27 real
      hits. **22 are mentions** — quotations of the forms §55 bans, in entries about §55 — and
      **5 are prose**, of which 4 are genuine British usage: `capitalised-phrase` twice (lines
      1832, 1938), `neighbour` (3600), `practising` (4087). The fifth is a quoted failure message.
    - **The dev-script string is `scripts/a11y-sweep.js:525`** ("dot centre", inside a failure
      message). It is left in place ON PURPOSE and §59's header says so: it is the negative control
      for the comments-only boundary — if a future widening starts flagging it, the net has stopped
      reading comment prose and started reading source, which is the shape that would fail the
      build on `us-english.mjs`'s own specimen list.
    - **What a run picking this up should NOT do:** sweep `AGENT_LOG.md` with a blind replace. The
      22 mentions must survive verbatim — they are dated records of what a past run found, and
      "US English only" has always exempted quotations and dated records (see the owner's 2026-08-21
      note). Fix the 4 by hand, leave the 22, and do not put the file in §59's scope.
    - **Honest priority: low.** Zero learner-visible instances. Downstream of O-1.

142. **✅ DONE 2026-08-29 (scheduled dev-agent). `check-log-size.mjs` scans the run log into
    REGIONS, not dates, and its cut plan now says when a day it proposes moving is in more than one
    piece.** See the run log for the measurements and the sabotage test.
    - **One of the item's own figures was wrong and is corrected here:** the two 2026-08-27 blocks
      were **1,070 lines apart**, not 367 — 367 is the length of the *first block* (lines 4746–5112
      of `744dc8c`). The headline claim and both byte totals (77,928 b / 121,136 b) reproduced
      exactly.
    - **The standing lesson, which is about controls and not about archiving.** The live file has one
      region per day, so running the new splitter on it can only ever prove it does not *hallucinate*
      a split. Under a sabotage that made the splitter position-blind again, control 3's live line
      still read **"every day is contiguous"** — a green that means nothing. The positive fixture has
      to be synthetic (control 4), and it is what makes the negative result on the live file readable.
    - **Still true and deliberately unchanged:** the live section is prepend-order, the archive is
      ascending, and both are conventions — the defect was that the *tool* assumed contiguity, never
      that the file is wrong. Do not "fix" this by re-sorting the live log.

141. **✅ DONE 2026-08-29 (scheduled dev-agent), the same day it was filed — folded into item 130's
    commit exactly as this item directed ("do not pick it alone… worth folding into the next run
    that touches §55"). The stem is in `scripts/us-english.mjs` in the `emphasise` shape, and both
    halves of the trap are now controls: `hypothesised`/`hypothesising` are in MUST_CATCH,
    `hypothesis`/`hypotheses` in MUST_NOT_CATCH. §55's control line moved 34 → 38 specimens and

130. **✅ DONE 2026-08-29 (scheduled dev-agent). Shipped as `scripts/us-english.mjs` (the shared
    pattern set, its two control lists, and a real comment tokenizer) plus `check-data.mjs` §59,
    which reads 1,111 comment blocks across 87 source files and 1,892 lines of the five normative
    Markdown documents. The `us-english:allow` marker is load-bearing from today: 13 exemptions
    are honored, including the 4 that earlier runs placed in `DECISIONS.md` and `LAUNCH_PLAN.md`
    in anticipation of a checker that did not exist. All 7 comment spellings and both unmarked
    Markdown ones were swept IN THE SAME COMMIT, as this item required.**
    > ⚠️ **One half of the premise was wrong and it changed the section's scope, not just a
    > figure.** The item's source-side claim reproduced EXACTLY — 7 real British spellings in
    > comments, the same seven it names. Its Markdown claim ("2 unmarked … against 4 correctly
    > carrying `us-english:allow`") was measured over `DECISIONS.md` and `LAUNCH_PLAN.md` only.
    > Over the whole normative set the figure is **40 unmarked, 38 of them in `AGENT_LOG.md`** —
    > and of that file's 27 real hits (11 more are `aria-labelledby`), **22 are MENTIONS**: a run
    > log that documents a spelling rule has to quote the spellings, and `AGENT_LOG.md:1465` names
    > all seven comment spellings in the act of filing this item. **So `AGENT_LOG.md` is out of
    > §59's scope on measurement**, not on convenience — marking 22 lines would be churn and every
    > future entry about §55 would fail the build. The 4 real British spellings in the log's own
    > prose are item 143.

126. **[Docs/Integrity — filed 2026-08-27 by the run that closed item 125, as its stated residual
    rather than smuggled into the same commit.] §52 only sees a hex that shares a line with the
    token it misattributes.**
    - **State:** `check-data.mjs` §52b scans living text for `--token` + `#hex` co-occurrence **on one
      line** and requires agreement with `src/index.css`, with a 2-entry register of deliberate
      mismatches. §52a guards the palette parse itself.
    - **What it cannot see.** A hex introduced in one sentence and attributed in the next
      ("the neutral we picked. It is `#7c8494`"); a figure quoted with no token named at all ("the
      amber is 3.2:1 on white"); and a **derived** number — a contrast ratio computed from a stale
      hex — which is the shape that actually shipped in two `charts.jsx` comments. §52 would have
      caught the hex in those comments; it would not catch the ratio if the hex were dropped.
    - **`scripts/` is out of scope too, by a measured decision rather than an oversight.** The only
      palette attributions there are inside `check-data.mjs` itself, where they are probe data and
      failure-message templates — §52's positive control must literally contain `#7c8494` to prove
      the scanner fires. Extending the scan there was measured: it finds **exactly two** other lines,
      both the "other side of the pair" false positive already registered. Four or five register
      entries to police the checker was the wrong trade. **The cost is real and is written into the
      code:** §52's own first draft quoted a live value in a `scripts/` comment, which nothing would
      have caught. The step-5 self-check found it and the fix was to stop quoting the value.
    - **The shape that could work:** treat a hex within N lines of a token mention as an attribution
      candidate and require an explicit register decision. That trades a bigger register for a wider
      net, and the register is the maintenance cost — do not build it until there is a second real
      instance to justify the cost. **One defect is not a class** (this item's parent proved that).
    - **Honest priority: low.** Zero known live instances. Downstream of O-1 like everything else.

122. **✅ DONE 2026-08-27 (owner-directed: "compress the backlog to bring the floor under budget")
    — floor 218,895 → 191,956 b, backlog 192,933 → 165,994 b, every item number surviving and all 17
    open items byte-identical.** Collapsed to its conclusion 2026-09-08 per W-7.2 rule 1 from 4,839 b;
    the pass method and its two figure corrections are in the 2026-08-27 and 2026-08-28 run entries.
    ⭐ **Four findings that outlive the pass, and the first two are about measuring a backlog — read
    them before running another one.**
    1. **A byte count over a section of closed items measures what CAN be read, not what can be
       deleted, and only opening it distinguishes the two.** The "23 KB lever" this item identified
       yielded **10,652 b**: the rest was load-bearing — `check-backlog.mjs` builds its valid-item
       set from every `former item N` string in this file (items 22 and 23 are cited from four source
       files with no other accounting, proven by injection), one "Note" is an *open* owner decision,
       and the remainder is standing rules.
    2. ⛔ **A per-item byte split must bound the LAST item at the next SECTION header, not at the end
       of the section.** Bounding it at the end made item 19 read as 23,478 b when its body is
       **307 b** — it had absorbed "Notes for future runs" and "Completed and pruned" beneath it, and
       that false figure was used to call a 23 KB lever an owner decision. Sum the parts against the
       section total as a control; they must agree byte-exactly.
    3. **The bytes were not where the first pass looked.** Item 115 compressed 79 closed items and
       left the backlog's preamble byte-identical — and that preamble held 34,857 b, of which the
       closed W-1…W-4 blocks and W-5's retained-original duplicates were the bulk. Compressing those
       gave 16,519 b, **more than the five largest closed items combined.**
    4. **Open items stay byte-identical, asserted rather than eyeballed** — that is the binding
       constraint on every pass since.

121. **✅ DONE 2026-08-27; EXTENDED 2026-08-28 to rates; RATE PROJECTION CORRECTED 2026-09-01 —
    read the correction first, because the extension shipped a figure that was wrong by 15x in the
    direction that hides work.**
    > ⛔ **CORRECTED 2026-09-01 (scheduled dev-agent).** The runs-left projection divided headroom by
    > the **net** mean over every sampled interval — a series that includes archiving and compression
    > commits as large negatives. Measured over the identical 16-commit window on 2026-09-01: run-log
    > net mean **+680 b/commit**, writing-only mean **+10,481 b over 12 of 15 intervals**. One
    > archiving commit (**-115,573 b**) and two commits that touched the file without touching the run
    > log produced the whole gap. The line therefore printed **"101.3 run(s)"** of headroom where the
    > honest answer was **6.6**, and the floor's version printed the incoherent **"-Infinity run(s) of
    > writing to come back out"**.
    > **The failure is self-concealing, which is why it survived two runs that both looked at it:
    > performing an archiving pass injects a large negative into the window, which lowers the mean,
    > which reports MORE headroom — so the remedy makes the next application of the remedy look
    > unnecessary.** Two consecutive runs deferred a due pass on the strength of that line.
    > **Fix:** project from the writing rate (positive intervals only), print the net rate beside it,
    > and say which one the runs-left figures use. If a window contains no growing interval there is
    > no writing rate, so it falls back to the net mean — which is then <= 0 and prints "no growth at
    > the sampled rate" rather than a large false headroom. Net **+15 lines**; no new section, no new
    > script (W-6.3).
    > **Why the existing controls could not catch it, which is the transferable part.** The extension
    > shipped with a positive control that plants *uniform* growth (`+1,000 b/commit` → reports
    > `+1,000`). In an all-positive window the net mean and the writing mean are the SAME NUMBER, so
    > that plant passes identically before and after this fix. **A control built from a clean synthetic
    > series cannot detect a defect whose trigger is a mixed one.** The plant needed a negative in it.
    > (The original **+9,170 b/commit** figure quoted below was measured in a window that happened to
    > contain no archiving commit, so it was correct when written — this is drift into a defect, not an
    > error at the time.)
    > **EXTENDED 2026-08-28 (scheduled dev-agent): the script measures the RATE as well as the level,
    > and warns when a budget is less than one run's writing away.** A level says *where the file is*;
    > it cannot say whether a remedy works. Measured over the 15 intervals since item 122's
    > compression pass: floor **+3,541 b/commit** mean (min -748, max +8,506, **1 of 15**
    > net-negative), run log **+9,170 b/commit**. Item 122 bought **26,939 b ≈ 7.3 runs** against a
    > leak of one run per run. **Headroom when this was written: floor 894 b = 0.25 runs.**
    > ⛔ **That reframes items 115/121/122 and W-5.3, and it is the durable part.** All four treat the
    > problem as a LEVEL with two remedies (archive / compress). Both remedies are one-off, the growth
    > is continuous, and no level reading can show that: **"floor at 99.6% of budget" reads as *nearly
    > there*, while the identical state read as a rate says *the next commit crosses it*.** A
    > compression pass is not a fix, it is a **bailing bucket that buys ~7 runs**.
    > **Every git read is controlled, because a failed history read would report a delta of ZERO** —
    > item 108's "a proxy fails green" exactly. Four controls, all proven by injection in throwaway
    > repos rather than argued: a planted **+1,000 b/commit** growth reports **+1,000 exactly**; and a
    > revision missing `## Run log`, an all-identical floor, and an absent git checkout each report
    > **UNAVAILABLE** naming the control that failed. **None of them can print a zero.**
    > ⚠️ **The new warn is CLEARABLE, not decoration** — it goes quiet as soon as a compression or
    > archiving pass lands, which is why it is a warn and not a permanent banner. **If it ever becomes
    > permanent, that is the evidence that the BUDGET is wrong rather than the writing**, and moving a
    > budget is the owner's call under item 115's rule, not a run's.
    > ⚠️ **Do not read the mean as a per-RUN figure without checking.** It is per *commit touching
    > `AGENT_LOG.md`*, and bookkeeping commits (the owner-tree fingerprint ones) contribute a real
    > +0 that pulls it down. The hand figure over substantive runs only was +3,705 b.
    > **What it does NOT do, deliberately, and this is the part to read before picking it up.**
    > This is **not** item 115's option (b), and it does **not** close W-5.3's defect. The script's
    > own header argues (b) would not have worked: (b) re-points the *trigger* at a run-log byte
    > count, but the mismatch is between the trigger and the *action clause*, so a run-log trigger
    > would fire and "archive entries before the most recent review boundary" would still select
    > zero. A real fix makes the action clause byte-driven too — **that is a rule change, and item
    > 115 says a dev-agent implements whichever the owner names and must not choose.** So the
    > script COMPUTES the whole-day cut plan and prints it; it never archives.
    > **The two budgets, and why splitting them is the point.** `run log` is archivable; `floor`
    > (App summary + backlog + Environment note) is never archived, so **archiving cannot move the
    > floor by one byte** — only a backlog-compression pass can. On 2026-08-26 the file was 915 KB
    > with a ~485 KB floor: emptying the run log entirely still could not reach 600 KB, and the
    > rule had no way to say so. Each budget now names the remedy that can actually move it.
    > **Baseline measured 2026-08-27, all green:** file 295,551 b, run log 79,527 b (32% of its
    > 250 KB warn budget), floor 216,024 b (86% of its 250 KB budget, backlog 88% of that). **The
    > floor is the one to watch** — it is at 86% and archiving is powerless against it.
    > ⚠️ **Do not add a fingerprint to its `MEASURED log-size:` line.** Every commit here changes
    > `AGENT_LOG.md`, so the fingerprint would be stale before the next run read it and
    > `check-measurements.mjs` would report RETIRED forever — the vacuous green item 116 warns
    > about. It re-measures live instead; there is no retyped number to guard.

120. **[Process/QA — filed 2026-08-26 by the run that closed item 119, as its stated residual
    rather than smuggled into the same commit.] The storage audit tests ONE point in
    storage-space, so a `requires` that is too COARSE still passes it.**
    - **State:** `A11yStates.auditBegin/auditFinish` diffs each no-reload state cold against a
      single `WARM_FIXTURE` value per key. Every current `requires` predicate is an *emptiness*
      assertion — `COLD` (no completed lessons, no review history) and `NO_BOOKMARKS`.
    - **What that cannot see.** The audit answers "does this screen vary between empty and
      non-empty?". It does not answer "does it vary between two non-empty values?" — 1 bookmark
      vs 20, `completed = [1]` vs all 44, a review queue of 3 vs one of 40. A state whose
      declaration is satisfied by both still sweeps two different screens and reports `ok` for
      both, which is item 118's defect with a narrower mouth. Nothing in the file can currently
      express "this state needs SPECIFIC storage", only "this state needs storage to be empty".
    - **The cheap version:** give the audit a second warm fixture (different magnitudes, same
      keys) and diff warm-A against warm-B. States that differ there need a declaration finer
      than emptiness, or a recipe that pins the magnitude. Reuses the whole existing mechanism —
      the two controls, the snapshot, the delta — and adds one fixture.
    - **Honest priority: low.** No shipped defect is known to live here; this is the next
      question the instrument cannot answer, written down so it is not rediscovered. Downstream
      of O-1 like everything else. **Do not pick this over content or over an owner-facing item.**

119. **✅ DONE 2026-08-26 (scheduled dev-agent). Nine judgments became nine measurements: eight
    screens are provably storage-independent and one — the Glossary, exactly the candidate this
    item named — was silently sweeping the wrong variant.** See the run log.

118. **✅ DONE 2026-08-26 (scheduled dev-agent). The cold sweep came back clean; the instrument did
    not.** See the run log.

117. **[UX/Product — filed 2026-08-26 by the run that scoped "Practice all questions" to the
    questions the learner has reached, as its stated residual rather than smuggled into the same
    commit.] Two things that run decided by judgment and that the owner can cheaply reverse.**
    - **(a) Hidden, not disabled, when the pool is empty.** A brand-new learner now sees a Review
      landing with **zero buttons** (measured). The argument for hiding is that the only honest
      label for a dead control is the Steps rail directly beneath it, which already says a check
      question joins the queue when you finish a lesson — and item 96's sibling is the precedent
      against shipping a disabled button with no explanation. **The argument against is that an
      empty screen teaches nothing about what the button would have done.** A third option nobody
      priced: keep it visible and route it to Learn.

      **PREMISE CORRECTED 2026-08-26 by the run that picked this item, and the correction changed
      what (a) is about.** Measured from cleared storage: the screen is **not empty** — it carries
      the card, the three-step rail and the disclaimer. It was **false**. The card showed a green
      check and *"You're all caught up"* over *"A quick question before you move on."*
      (`t.checkIntro`, whose only other call site is LessonReader's end-of-lesson check) to a
      learner with `review = null`. `seen` already branched the **body** and never branched the
      **title or icon**, so the half that never branched was the false half. **That is fixed** —
      `reviewNotStartedTitle` / `reviewNotStartedBody` in all five languages, plus a `book` icon
      at `ink.muted`. **(a) itself is still open and still a judgment call**, but its "argument
      against" is retired: the screen now explains itself in one sentence, so hiding the button no
      longer costs the learner the explanation. Whoever picks this is choosing between *a sentence*
      and *a sentence plus a route to Learn* — not between a button and a void.
    - **(b) "Reached" means completed-or-already-answered, not unlocked.** An unlocked lesson is one
      the learner MAY open, not one they have read, so including it would be the same defect one
      lesson later — but it is a *product* line, and `CLAIMS.md` A1 is the bet it serves. If the
      owner wants "practice anything you could open", it is a one-line predicate change.
    - ~~**A cheap improvement neither branch needs a decision for:** the label still reads "Practice
      all questions" while the session may now be 2 questions long. Appending ` (N)` costs **zero
      locale keys** (digits are language-independent) and explains the number the learner gets.~~
      **✅ DONE 2026-08-28 (scheduled dev-agent) — but NOT as this bullet specified, and the
      difference is the part worth keeping.** Shipped as a per-language template
      (`practiceAllTemplate`, five keys) rendering e.g. `Practice all questions (6)`, verified live in
      all five languages at n = 1, 14 and 0.
      > ⛔ **"Zero locale keys" was arithmetically true and wrong as a design claim.** Two
      > measurements killed it. **(1) Plural agreement breaks at the first state a learner reaches.**
      > Measured: **46 questions over 44 lessons** (42 own one, 2 own two), so the pool is **1** after
      > one completed lesson and takes **44 distinct values** along the path — and `en`/`es` render
      > *"Practice all 1 questions"* if the count sits inside the noun phrase. `ko`/`zh`/`ja` have no
      > plural agreement and read better with it inline, so **no single JSX append is right for all
      > five languages**. **(2) Spacing is language-specific and the call site cannot know it** — `zh`
      > writes `"{n} 题待复习"` with spaces and `"查看全部{n}节课"` without.
      > **The house convention, measured:** every count in a **sentence** is a locale template (14
      > keys before this change); the only counts built in JSX are bare numeric ratios (`3 / 12`).
      > **Transferable: "costs zero locale keys" prices the change in the one currency that does not
      > capture what makes it wrong.**
      > Residual filed as nothing — but note the change created the 15th templated key and nothing
      > checked any of them, so `check-data.mjs` **§1b** (placeholder parity across languages, proved
      > able to fail three ways) landed with it. It catches a *structurally* wrong translation, never
      > a semantically wrong one.
    - ⛔ **(a)'s ARGUMENT NOW REFERS TO COPY THAT NO LONGER EXISTS, and the copy it referred to was
      false (corrected 2026-09-02).** (a) rests on "the Steps rail directly beneath it, which already
      says a check question joins the queue **when you finish a lesson**". It did say that, in five
      languages, and **finishing a lesson has never enrolled anything**: `completeLesson` does not
      touch the schedule and `recordReview` is reachable only from an answer. Measured through the
      real UI from cleared storage — open lesson 29, press Mark Complete, answer nothing —
      `ecycles_completed_lessons` is `[29]`, `ecycles_review` **does not exist**, and the Review tab
      told that learner to do the thing they had just done. Fixed by naming the real trigger in all
      five languages; **(a) is still open and still a judgment call**, but read its argument as "the
      rail explains how a question enters the queue", which is now true.
    - **Two seams noticed while measuring this, filed as notes and not as items (W-6.2 rule 2).**
      (i) `showPracticeCoachMark` is `completedLessons.length > 0`, so the coach mark sends the
      learner to Review at exactly the moment Review is empty — harmless now that the card names the
      right next action, but the trigger is still completion. (ii) ~~The `Steps` rail marks `done` with
      **color only** — measured, step 1's glyph stays the `book` path and only moves
      `--ink-accent` → `--ink-ok` — so the done state is carried by hue alone.~~
      ⛔ **PREMISE WRONG, and the half it got wrong is the half that mattered — corrected and CLOSED
      2026-09-03 (scheduled dev-agent).** "Color only" is false: measured on the built app, the done
      step's title also carries `text-decoration: line-through` and drops `--ink-strong` →
      `--ink-muted`. A sighted learner gets two non-color signals, so there was never a WCAG 1.4.1
      defect here and the fix this note proposed (swap the glyph) would have addressed nothing.
      **What the note missed by scoping to color is that NONE of the three signals reaches assistive
      technology**: the glyph is `aria-hidden`, `line-through` is not announced, and muted ink is a
      color. Measured with a control that fires (the Learn path's own `SrOnly` "Completed" on a
      completed lesson, which the same instrument reads back): the done step and its two undone
      siblings read out **identically, word for word**. Fixed by giving `Steps` a `doneLabel` prop
      rendered through `SrOnly` — the convention the Learn path already uses — in all five languages.
      **Transferable: "carried by hue alone" and "carried by nothing an AT can reach" are different
      defects with different fixes, and the first is the one that is easy to see in a screenshot.**
    > ⚠️ **A NOTE, not a sub-item (W-6.2 rule 2), filed 2026-09-07 by the run that made storage
    > failure visible.** (a) is a judgment call about what a learner sees when the review pool is
    > empty. There is now a **second** way that screen can be empty that (a) does not contemplate:
    > **site storage blocked**, where the pool is empty on every load no matter how much the learner
    > has answered, because `ecycles_review` never persists. The new storage notice sits above the
    > panel on the Review tab too, so that learner is no longer told nothing — **but whichever branch
    > of (a) the owner picks, it should be read against a Review screen that is permanently
    > not-started-yet rather than briefly so.**
    > **Measured live on the built app 2026-09-07, not inferred.** Storage blocked, lesson 1
    > completed, end-of-lesson check answered correctly: *in the same session* Review reads
    > **"Practice all questions (1)"** with the 1-day Leitner box at **1** — React state holds it.
    > After a `location.reload()` (marker asserted gone, blocker asserted still installed) the same
    > screen reads **"Nothing to review yet / Answer the check question at the end of a lesson and it
    > starts showing up here"** — to a learner who had just done exactly that. **The empty state is
    > not merely uninformative here; it describes the learner's behavior wrongly**, which is a
    > sharper version of the same defect (a) was filed about.
    - **Honest priority: low.** The defect is fixed; these are the seams around it. **All of it is
      downstream of O-1** — nobody has opened the app, so no learner has met either branch.

116. **✅ DONE 2026-08-28 (scheduled dev-agent). `focusVisibleOnTab` is a real probe; the sweep
    reports `0 unavailable` for the first time. The item's central premise — that the harness
    cannot focus a document — was FALSE, and it is the reason the probe sat stubbed for two
    days.** See the run log.
    > ⛔ **PREMISE CORRECTION, and it is the durable half of this item.** "What blocks it is the
    > harness" was wrong. Every 2026-08-26 measurement reproduces exactly **at page load**, and
    > the word that did not belong was *permanent*: the document simply has **no focused area
    > until a real input event reaches the pane**. Send one `computer{action:"key", text:"Tab"}`
    > and on the next call `hasFocus()` is true, focus events fire, `:focus` and `:focus-visible`
    > both match, and a later programmatic `.focus()` **inherits** focus-visible — which is what
    > lets one probe cover a whole screen without a Tab press per element. `visibilityState`
    > stays `"hidden"` throughout, so it was never the signal to read.
    > **⚠️ Seed with Tab, NOT with a click.** A click gives `:focus` without `:focus-visible`
    > (the spec's pointer-vs-keyboard heuristic). Since `index.css`'s `:focus-visible` rule is
    > the app's *only* focus styling, a click-seeded sweep finds every control ringless and
    > reports the whole app broken. This is why `focusVisibleSelectors` is measured as its own
    > third capability rather than inferred from `focusSelectors` — the item-108 proxy mistake
    > has now been available to make three times, once per pseudo-class.
    > **⚠️ `hasFocus()` also lies about KEYBOARD DELIVERY, which is a second proxy failure and
    > cost a wrong conclusion inside this very run.** With the first-run dialog open it read
    > `true` across sixteen key presses of which a capturing `document` keydown listener received
    > **zero** — while a synthetic dispatch to that same listener fired, proving the listener was
    > alive. Eight of those presses had already been read as *"the focus trap holds"*. **If a
    > measurement depends on a key press landing, plant a keydown listener and count trusted
    > events.** Redone that way the trap does hold: 16 trusted keydowns, focus entered the dialog
    > and never left — §47's static guard now has its rendered-tree half.
    > **Residual, filed as item 139:** the probe answers *"does anything change on focus"*, not
    > *"is the change perceivable"* — WCAG 2.4.11/1.4.11 contrast of the indicator is uncovered.

108. **✅ DONE 2026-08-26 (scheduled dev-agent). The focus capability is now MEASURED by a planted
    control (`measureFocus()`) instead of inferred from `document.hasFocus()`, and
    `check-data.mjs` §43(d) fails if the proxy ever returns. Residual filed as item 116.**

107. **✅ DONE 2026-08-25 (scheduled dev-agent), the day after it was filed. Shipped as the
    `unnamedRegions` probe in `scripts/a11y-sweep.js`, with a planted control in `selftest()`
    (§43(c) proved able to fail on it) and a five-variant discrimination matrix measured live.**

106. **✅ DONE 2026-08-25 (scheduled dev-agent). Fixed by marking up the two block labels the
    lesson reader already had — `as="h2"` on `{t.hookTitle}` and `{t.checkTitle}` — and guarded by
    `check-data.mjs` §45, which was proved able to fail in three modes.**

101. **✅ DONE 2026-09-05 (scheduled dev-agent), the day after O-1 closed** — collapsed to its
    conclusion 2026-09-08 per W-7.2 rule 1 from 6,819 b, including two `ORIGINAL TEXT (retained)`
    tails that rule 2 retires. The measurements are in the 2026-09-05 run entry.
    **What was true:** `og:url` and `og:image` were the two preview tags item 98 could not ship —
    both must be absolute and there was no origin, and `og:image` also needed an image the repo did
    not have. **What is true now:** `index.html` carries `og:url`, `og:image`
    (+`:width`/`:height`/`:alt`), `twitter:image` and `twitter:card: summary_large_image`;
    `public/og-card.png` is 1200x630; `check-data.mjs` §38 covers all of it.
    ✅ **And it is LIVE, measured 2026-09-08 rather than assumed.** The ⛔ block this item carried said
    the card was not live — true of the *retired Netlify host*. Against the canonical URL:
    `og-card.png` → **200** with a nonexistent-path control at **404**, and the served `index.html`
    carries `og:image` pointing at the canonical origin. Pages deploys on push, so the owner action
    that block named no longer exists.
    ⛔ **The refuted suspicion, recorded so nobody re-raises it.** `index.html` source reads
    `href="/icon.svg"`, which looks like a live violation of the no-leading-slash rule the whole
    path-agnostic build rests on. It is not: **Vite rewrites public-directory references in
    `index.html` against `base`**, and the built file reads `./icon.svg` — measured on a real build,
    with a control (the same grep over a copy with the slash restored does find it). **The invariant
    is on the BUILT output, not on the source**, and neither `vite.config.js` nor this item said so.
    ⚠️ **`og:url`/`og:image` are the only two absolute URLs in the build**, so the origin is written
    into every `dist/`. §38 pins both to the URL in README's Deploying section, so a move to a custom
    domain fails `npm test` instead of silently unfurling the old host.
    ⭐ **The under-scoping worth keeping: a browser is a rasterizer.** This item treated the card as
    blocked on "adding a raster toolchain". It was not — the card is authored as Canvas2D drawing code
    (`scripts/og-card.js`), rendered once and decoded to PNG. Zero new dependencies, so item 12's
    port-cost rule never engaged, and the card is editable text rather than an opaque binary.

99. **✅ DONE 2026-08-24 (scheduled dev-agent) — both halves, the fix and the guard, in one commit.
    `Learn` and the app shell now sit behind error boundaries, and `check-data.mjs` §37 holds the
    invariant.**

100. **✅ DONE 2026-08-24 (scheduled dev-agent). Shipped as `src/lib/chunkError.js` (call-site
    tagging), a function-form `ErrorBoundary` fallback, and `check-data.mjs` §39. Read the premise
    correction first — the defect was real and reproduced live, but "one line of code" was wrong.**

76. **[Content/Process — filed 2026-08-18 by the run that built item 69's instrument half, which is
    what turned this from an opinion into a blocked measurement.] `zh` and `ja` `Brokerage Account`
    are term-of-art shape, and nothing can currently measure whether that generalizes.**
    - **The content question.** Item 67 rewrote `en`'s "realized gains" into a phrase that explains the
      mechanism; item 69 did the same for `es`. `ko` (`실현된 매매 차익`) already explains it. **`zh`
      `已实现的收益` and `ja` `実現した利益` do not** — they sit roughly where `en` was before item 67.
    - **Why it is blocked, and blocked on something real.** `npm run jargon -- glossary zh` now exists
      and **exits 1**: the extractor cannot represent a single Han character (see item 69's closing
      bullet and the 2026-08-18 entry). So there is no instrument that can tell you whether these two
      strings are a pattern across 32 entries × 4 languages or the only two instances. **Rewriting them
      on one run's reading is exactly the unmeasured multi-language drift item 69 was filed to prevent
      — do not do it, and do not treat "I read them and they look fine" as measurement.**
    - **The unblocking work is a per-language tokeniser**, and it is genuinely a piece of work, not a
      flag: `norm()` needs a Unicode-aware form, the acronym/capitalised-phrase rules need per-script
      replacements, and zh/ja need real word segmentation (ko can lean on eojeol spacing but still
      needs non-English head nouns). `DECISIONS.md:311` already accepted a related trade-off for the
      same reason. **Scope it before building it, and check whether a dependency-free segmenter is even
      available — item 12's port-cost rule applies to adding one.**
    - **Honest priority: low.** Two known strings, both comprehensible to a native reader, in a beta-
      labeled translation layer. The value is the instrument, not these two edits — and if the
      instrument is ever built, run it before deciding anything.
    > **PARTIAL ANSWER 2026-08-29 (the run that closed item 133), and it narrows what this item still
    > needs.** This item says "nothing can currently measure whether that generalizes". For
    > **role-term vocabulary** that is no longer true: `check-data.mjs` §60 measures per-language
    > presence of a role across a whole track **without segmentation**, by anchoring on English and
    > matching declared surface forms — §54(e)'s word-matching trick, which sidesteps the zh/ja
    > tokenizer entirely. That answered item 133 (5 languages x 3 tracks, zero role errors).
    > **What it does NOT answer, and why this item stays open:** §60 tests presence, so it cannot
    > tell a *pattern* from *two instances* — which is precisely this item's question about
    > `Brokerage Account`. A per-language tokenizer is still the unblocking work. **The transferable
    > part: "is this role represented at all?" is answerable today; "is this phrasing typical?" is
    > not.**

95. **✅ DONE 2026-08-24 (scheduled dev-agent), same run it was filed. [Process/Tooling — filed by
    the W-5.4 run's own closing note: "nothing stops a future run from writing `## 2026-…` again."]
    `check-data.mjs` §35 now asserts the run-log heading convention in both `AGENT_LOG.md` and
    `AGENT_LOG.archive.md`: every dated entry heading is `###`, every heading inside an entry is
    `####`.** See the run log.

75. **✅ DONE 2026-08-20 (owner-directed). `--fill-warn` exists in both palettes,
    `NOTE_TONES.warn.rule` points at it, and no `.jsx` under `src/` holds a hex literal any more — and
    for the thirteenth item running the premise broke, this time on the VALUE the item had already
    decided.** See the run log.

65. **✅ DONE 2026-08-17 — decided AMBER MOVES, because re-measuring the item's own figures changed
    the answer: amber's real contrast margins were 2-3x smaller than the item claimed, so the token
    moved instead of the exemption being made permanent. Proved by injection in both directions.**

70. **[Process — filed 2026-08-17 by the run that found item 67's headline number was wrong, because the
    error is structural and will recur.] Every measurement this repo reports lands in `AGENT_LOG.md` by
    being retyped by hand, and nothing checks the retyping.** Item 67's entry recorded "56 → 55" for a
    figure that was actually 56 → 57 — and the same entry, two paragraphs down, *correctly describes the
    two new candidates* that make it 57. The run had the facts and still wrote a wrong summary number,
    which is exactly what a hand-copied figure does. This is the shape item 55 already fixed one level
    up (`LAUNCH_PLAN.md`'s gate answer is generated, not retyped) and item 62's F12 flagged one document
    over (`DECISIONS.md`'s hand-written lesson ranges).
    - **Why it matters more than a typo.** These numbers are how a future run decides whether its change
      worked. A wrong one doesn't just misinform — it teaches the next run to distrust a correct
      instrument, or to "fix" something that was never broken.
    - **Scope if built, cheapest first:** (a) a `--json` flag on `jargon-candidates.mjs` so a run pastes
      output rather than retyping it; (b) a check that any `N → M candidates` claim in the *most recent*
      run-log entry still reproduces, which is harder than it sounds because the corpus moves under it;
      (c) accept the cost and instead require entries to quote the tool's own line verbatim. **(c) is
      free and probably right.** **Honest priority: low-medium** — no user-facing effect, but it is the
      second time in two days a run-log number has failed re-measurement (item 62's F4 was the first).
    - **✅ DONE 2026-08-17 (scheduled dev-agent) — built as (c) plus the half of (b) this item argued was
      too hard, because a fingerprint makes it easy.** `jargon-candidates.mjs` now ends with one line
      built to be pasted, and `scripts/check-measurements.mjs` (in `npm test`) re-runs the instrument and
      holds the log to every such line. **The objection filed against (b) — "the corpus moves under it" —
      is answered by stamping each line with a hash of everything that can move its numbers**: the
      corpus, the glossary subtraction set, **and the instrument's own source** (item 68 moved glossary
      57 → 54 by changing the rule alone, content untouched). A claim is enforced while its fingerprint
      holds and **retired, not failed**, once either side moves — so old entries age out on their own and
      the check never cries wolf on correct work. **(a) was not built and is not needed**: the pasted
      line is the machine-readable form, and a second `--json` shape would be a second thing to keep in
      sync. **What it still does not cover** is prose: "56 → 55" written in a sentence remains
      unverifiable, and the fix for that is to paste the line instead of describing it. See item 71 for
      the other instruments.

71. **[Process — filed 2026-08-17 by the run that built item 70, from the boundary that item deliberately
    did not cross.] `check-measurements.mjs` covers exactly one instrument, and the others are still
    hand-retyped into this log.** Item 70 fixed `npm run jargon` because that report is the one that has
    been wrong twice. But `npm run review-status`, `check-data.mjs`'s §28 contrast-pair counts and
    `check-payload.mjs`'s chunk sizes are all read by eye and retyped into run-log entries the same way,
    with the same nothing checking them.
    - **The mechanism already exists and is generic**: emit a `MEASURED <tool> <mode>: …  [fingerprint
      <hash>]` line, fingerprinted over the tool's inputs **and its own source**, and
      `check-measurements.mjs`'s `CLAIM` pattern plus its per-mode re-run loop extend to it with the
      tool name as a second key. The work is picking each tool's headline numbers and its fingerprint
      inputs, not building anything new.
    - **Do not do all three at once.** Each one is a judgment about which numbers are the headline
      ones; batching them is how the fingerprint inputs get chosen carelessly and a claim ends up
      permanently retired (always "outdated", never checked) without anyone noticing — the vacuous-pass
      failure `check-measurements.mjs` prints its `0 enforced` note to make visible.
    - **Honest priority: low.** Item 70 was earned by two real failures; this is the same shape
      pre-emptively, and `check-payload.mjs`'s figures in particular already live in a file that asserts
      them. Take it only when one of these numbers has actually been wrong once.
    - **2026-08-17: a contrast number WAS wrong, and this item would not have caught it.** Item 65's
      "card 3.44, canvas 3.24" were both wrong (3.19 / 3.08). But `check-data.mjs` never printed either
      figure — §28b prints only the *worst* pair per palette, and that line was correct. The wrong
      numbers were hand-computed for a pair the tool does not report. **So the gate above has still not
      fired**, and extending `check-measurements.mjs` to §28b's printed line would not have helped. The
      class this belongs to is the one item 70 explicitly left uncovered: a figure written in prose that
      no instrument ever emitted. The cheap defense remains item 70's — paste the tool's line, and if you
      need a number the tool does not print, print it.

69. **✅ DONE 2026-08-18 (scheduled dev-agent) — and the headline finding is that it was NEVER BLOCKED.**
    - **No gated figure moved, and the ledger does not apply.** Entry count stays **32**, so
      `LAUNCH_PLAN.md` §1's generated "32 glossary terms" is untouched — which is why this was shippable
      while `Dividend` (items 64/67) still is not: that one *adds a key*. The APR trap does not apply
      either: `scripts/translation-review-ledger.json` is keyed by **lesson id** over `lessonContent` and
      does not cover the glossary, and it hashes the **English** source, which this edit does not touch.
    - **⚠️ ko/zh/ja are NOT closed by this run, and this item's own claim about them is partly wrong.**
      The filing says all three are "already more descriptive than the English was". Re-read against the
      actual strings, that holds for **`ko` only** — `실현된 매매 차익` ("realized *buy–sell* profit")
      genuinely explains the mechanism. **`zh` `已实现的收益` and `ja` `実現した利益` are the local
      term-of-art shape** ("realized gains" / "realized profit"): roughly where the English *was* before
      item 67, not ahead of it. **Deliberately not rewritten** — no instrument covers non-`en` glossary
      prose, and changing two translations on my own reading is exactly the unmeasured multi-language
      drift this item was filed to avoid. It is a real residual, not a closed question; it is the smaller
      half of the "bigger version" bullet below.

68. **✅ DONE 2026-08-17 — built as scoped, minus one half that was measured and honestly declined.
    The glossary report went 57 → 54, the first time an in-place expansion made the number go DOWN.**

67. **🟡 TWO-THIRDS DONE 2026-08-17 (scheduled dev-agent) — the two terms that needed no new key are
    fixed and rendered-verified; only the `Dividend` half is still blocked.** See the run log.

66. **✅ DONE 2026-08-17 (scheduled dev-agent) — measured, and the instrument is permanent.**

60. **✅ DONE 2026-08-17 (scheduled dev-agent).** The residual has an instrument (`npm run jargon`)
    and the gap it found is closed: Brokerage Account is a glossary entry, chipped on lesson 6.
    Collapsed to its conclusion 2026-09-08 per W-7.2 rule 1 from 6,265 b; the FOMO and
    relative-strength investigations are in the 2026-08-30 and 2026-09-02 run entries.
    ⚠️ **The instrument REPORTS, it does not certify.** `0 unexplained` covers the glossary keys that
    exist, and its threshold (≥2 lessons or ≥3 uses) suppresses hundreds of lower-reach candidates
    that nobody has read. Two premise corrections stand: **APR is not money-track jargon** (one use in
    all 40 lessons, in economy L35, filed with its disposition in item 64) and **"beneficiary" is not
    a gap** (lesson 14 is titled for it and teaches it).
    ⭐ **A green coverage number is a statement about the vocabulary you already admitted, and new
    content arrives outside it.** §17b reported 0 unexplained and was *correct* while money lessons
    41-44 shipped four unglossed high-reach terms (Labor/Business/Investment/passive income), because
    they were not keys. **A run that adds lessons should run `npm run jargon` on the track it touched.**
    ⛔ **And the instrument's own report line once overstated what it had checked.** It printed "no
    acronym in this corpus is expanded next to itself" — a claim about content the count could not
    support, since suppression needs *every* occurrence glossed. FOMO was glossed once and bare three
    times; the report now says "…EVERY time it appears" and names the terms spelled out somewhere.
    **The meta-lesson is sharper than the fix:** the note that sent a run after FOMO hedged that it
    "was not measured", and that hedge was the only true sentence in it — the confident half was
    written anyway, and measuring showed no entry was due at all.
    ⚠️ **The corpus is LESSON PROSE, and the app's densest finance vocabulary is not all in lesson
    prose.** `jargon-candidates.mjs` and §17b both read `lessonContent`; neither can see
    `src/locales/*.js` or the Reference screens' own modules. The live instance was **"relative
    strength"**, on all eleven Sector rows and defined nowhere (controls: "yield curve" and "fed funds
    rate" are found and defined in the same corpus). Fixed in place, and a glossary entry added
    2026-09-02 — the only key whose use is a Reference screen rather than lesson prose, so it carries
    no chip and §17b needs none from it. **Before building a sweep for this, note the corpus is ~6,228
    chars of English chrome and every other figure on those screens already carries its own `what`
    line; a whole instrument for one term lands on the wrong side of W-6.3.**
    **Still open, deliberately not taken:** the Sectors screen does not LINK to that glossary entry —
    a reader has to know to look it up.

64. **✅ BOTH CLOSED — struck from the W-5.2 pick list 2026-08-24 after seven days of being
    recommended when nothing was open. `Dividend` shipped 2026-08-20; the other two keys landed
    2026-08-17 (21 chips across 15 lessons). Nothing in this item is open.** See the run log.
    > **Residual worth not re-deriving: §17b cannot see a `takeaway` or a `thinkAbout`.** Chips
    > render per *section*, so a glossary term used only in those two fields is invisible to the
    > coverage check in both directions.

61. **✅ DONE 2026-08-17 (scheduled dev-agent). All 9 mechanical corrections applied, plus both guards
    the item asked for — and for the fourth item running the premise was wrong in one place, which is
    the part worth keeping.** See the run log.

62. **✅ ITEM FULLY CLOSED 2026-08-21 — F4, F6, F11 and F12 all done; nothing here is open.** See
    the run log.
    > **A blocking pattern named by the run that closed F12, and it recurs: two consecutive "Next run
    > should pick" notes pointed at work that was already finished.** Re-check a candidate's own item
    > before picking it — a pick list is a claim about current state and goes stale like a figure.

26. **[UX — owner-directed] Quizlet/Vocabulary + `UIUX/` design-reference review. ✅ CLOSED
    2026-09-07 (scheduled dev-agent), when its last named follow-up — surfacing saved glossary terms —
    shipped. Per W-7.2 rule 1 this is the conclusion, not the four passes that produced it; those are
    in the run log for 2026-08-16, 08-21, 08-23 and 09-02, and in `DECISIONS.md`.**
    - **What it was:** ~200 Mobbin screenshots of Quizlet/Vocabulary (2026-08-15) and later the
      `UIUX/` folder (Buddy, Duolingo, Quizlet, Vocabulary, Nibble), read for transferable patterns.
      Everything the two reviews named is now built — quiz markers, review recap, the Practice coach
      mark, glossary examples, the review-batch interstitial, term detail + bookmark toggle, the five
      `ui.jsx` primitives under its own header, the warm repaint, `MIN_TAP` (guarded by
      `check-data.mjs` §34), and the Leitner box strip.
    - ⛔ **Two standing instructions survive the close and still bind.** (1) **The owner's no-paywall
      rule:** much of `UIUX/` is subscription UI, and none of it may be built from while §4.3's
      Phase-0 gate is open. (2) **Do not re-derive the 2026-08-21 redesign**, and do not extend this
      stream with newly invented ideas — the reference set is read, not a well to return to.
    - ⛔ **The last follow-up was deferred for three years' worth of runs on a premise that could not
      have come true, and the correction is the transferable part.** From 2026-08-16 the rule was
      *"that should wait to see whether the underlying toggle gets used"*, restated four more times and
      finally recorded here as *"blocked on item 18's analytics, not on effort."* Measured 2026-09-07:
      `src/` has **8 `track()` call sites** (`grep -rn "track(" src`, control: the known
      `EVENTS.LESSON_COMPLETED` site is among them) and **not one is the bookmark toggle**; there is
      no term-bookmark event in §9.2's set. **No provider key would ever have produced the evidence the
      wait was waiting for.** On top of that the wait was circular: a save with nowhere to read it back
      has no reason to be used, so usage data would have under-reported it even if it existed.
      ⭐ **A deferral names a condition; check that something in the tree can actually report it.**

> **PRIORITY BLOCK — set by the weekly review 2026-08-09. SUPERSEDED 2026-08-16 (see above); all four
> items below are closed. Retained for history.**
>
> **P-1. STOP ADDING LESSONS. The lesson treadmill is closed until P-2, P-3 and P-4 are done.**
> Thirteen of this week's runs added exactly one lesson each; twenty-two of the last twenty-four runs
> were single-lesson adds. The lessons themselves are good — that is not the problem. The problem is
> that item 17 *already names this failure mode in its own text* ("nine consecutive scheduled runs each
> picked 'add one lesson' and the direction drifted unexamined... Counting lessons is not the same as
> building the product"), the owner corrected it once on 2026-08-07, and the pattern re-formed inside
> the correction — the runs switched from mechanics lessons to judgment lessons and kept counting.
> The §4.3 Phase-0 gate has three clauses. Lesson count (≥40) is now **met**. The other two —
> ~2 hours of content, and ≥40% of installers finishing lesson 1 — are the ones that actually gate
> Phase 0, and **neither moved at all this week**; the completion-rate clause is not even measurable
> (item 18). A run that adds lesson 41 is optimizing the one clause that is already satisfied.
> Do not add a new lesson until P-2 through P-4 below are cleared. This is a stop, not a slowdown.
>
> **P-2. ✅ DONE 2026-08-09 (twenty-fifth run).** Refreshed `LAUNCH_READINESS.md`: now correctly reports
> **40 lessons / 112,387 chars / 100 min**, the §4.3 lesson-count clause as met, current translation
> ratios (es 0.745x/ko 0.371x/zh 0.235x/ja 0.325x), 15 kids blurbs (was stale at 9), and current
> disclaimer-render screen names. Also fixed a real bug found along the way: the file's own documented
> refresh script read `content/lessons.js` alone, which stopped holding lesson body text after item 23's
> 2026-08-07 split into `lessonContent.js` — the *documented* method would have returned ~4,860 chars,
> not 112,387. Both refresh snippets in the file now read the correct two files. See that run's log entry
> for full detail. **P-1 still requires P-3 and P-4 before the lesson freeze lifts — P-2 alone doesn't
> unfreeze items 17/24.**
>
> **P-3. ✅ DONE 2026-08-11.** Extended `check-blindspot.mjs`'s §10.1 check with per-language pattern
> sets for es/ko/zh/ja (5 patterns each, mirroring the shape of the 5 English ones — heading, "be
> bullish", "be cautious", "you should buy/sell/invest", "we recommend"). Verified against current
> content with zero false positives before landing, then injected one real violation phrase per
> language (e.g. Spanish "deberías comprar esta acción ahora mismo", Korean "지금 이 주식을 사야 합니다")
> into a scratch append to `src/content/glossary.js`, confirmed `check-blindspot.mjs` failed on each,
> then `git checkout --` reverted the file — `git status` was clean before committing this entry.
> `npm test` and `npm run build` both pass with the extended check. See run log for full detail.
>
> **P-4. ✅ DONE 2026-08-11 (owner decision, interactive session).** Owner chose **option (a)**: accept
> the current state (~40 lessons of unreviewed es/ko/zh/ja machine translation ships under "(Beta)"
> labeling), rather than (b) commissioning native-speaker review or (c) cutting the four languages.
> Landed alongside the decision, not after it: `scripts/translation-review.mjs` +
> `scripts/translation-review-ledger.json`, a review-tracking ledger (per lesson per language: reviewed
> by whom, when, against what English-source hash; drift-detected if English is edited after review) so
> "accept for now" is a tracked, revisitable state rather than the same kind of silent drift that caused
> P-4 to need escalating in the first place. `npm run review-status` reports coverage on demand; `npm
> test` now prints a non-blocking one-line summary every run via `check-data.mjs` (currently 0% in all
> four languages — accurate, not a bug). See `DECISIONS.md` ("Machine-translated lesson content...") for
> the full writeup and this run's log entry for verification detail.
> **Update, 2026-08-13 (interactive session):** the ai/human `method` field drafted the same day as the
> decision above (2026-08-11) but left uncommitted for two days (see the Notes section's now-resolved
> entry) was finished and landed, and Claude performed a full AI review pass over all 40 lessons ×
> es/ko/zh/ja — **160/160 pairs now `method: "ai"` in the ledger, coverage 100%/100%/100%/100% (0%
> human)**. Found and fixed three real translation-fidelity issues along the way (lesson 5's es/ko/zh/ja
> "rates already at 0%" overclaim, lesson 13's es/ko/zh/ja invented-example substitution, lesson 21's
> es-only dropped "incomes"). See `DECISIONS.md`'s updated entry and this date's run log for full detail
> — this is real judgment-based review, not a human/professional one, and the `method` field keeps that
> distinction visible for whoever eventually does the latter.
>
> **P-1 status: P-2, P-3, and P-4 are all done. The lesson freeze's stated unlock condition is met.**
> That does not mean the next run should default straight back to "add lesson 41" — re-read the
> "After P-1 lifts" note just below; the freeze existed to stop optimizing an already-met clause, and
> that reasoning doesn't reverse just because the three named blockers cleared. A run resuming lesson
> content should say explicitly which §4.3 clause it moves (minutes, not count) or that it's
> deliberately deepening an existing lesson instead of adding a 41st topic.
>
> **After P-1 lifts**, the lesson treadmill does *not* simply resume. The next content work should be
> aimed at a clause that actually gates Phase 0 — the ~20 remaining minutes (§4.3's content-duration
> clause), or deepening existing lessons rather than adding a forty-first topic. Re-read §4.3's table
> before picking, and write down in the run entry *which clause* the run moves.

> **Backlog refilled 2026-08-16 (W-2, owner-requested).** Items 27–32 below were derived by re-reading
> `LAUNCH_PLAN.md` §3.0, §3.2, §5, §8, §9.1, §9.2 and §9.3 against the actual `src/` tree — not carried
> forward from a run-log note chain. Every one is dev-agent-actionable today (none is owner-blocked), and
> each names the plan clause it serves. They are listed in the reviewer's value order; a run is free to
> disagree, but should say why in its entry. **Pick from here, not from the previous run's note.**

33. **[Content — ✅ DONE 2026-08-16 after a third pass. `lessonContent` fixed, then `quizData.js` — which
    the first two passes both missed entirely. §16 now guards both.]
    The 2026-08-14 lesson-id renumbering missed every non-English in-prose cross-reference, the
    lowercase English ones, and the plural `Lessons N and M` form.**
    > **⛔ The two lessons this item exists to carry, both learned the expensive way.**
    > **(1) A measurement taken with the same instrument that has the blind spot cannot detect the
    > blind spot.** This item once reported "0 mismatches" across all five languages. It was wrong:
    > the ~73 `ko`/`ja` references written as `N강` / `第N課` were invisible to the patterns doing the
    > counting, and **67 of them were stale**. Both this item's "0 remain" *and* `npm test`'s green
    > were produced by the very patterns that were failing to match. (Fixed under item 36, which
    > widened the patterns and added the coverage tripwire.)
    > **(2) A consistency check and a correctness check are different things.** §16 verifies that
    > translations agree with English; **it cannot verify that the English is right** — and the plural
    > form `Lessons 18 and 20` was stale in *every language at once*, so all five agreed with each
    > other and no consistency check could ever see it. Caught only by reading the content (the
    > sentence describes "a 401(k) or life insurance policy": 6 is *Retirement Accounts*, 8 is
    > *Insurance*). **This limit is written into §16's header comment**; the only correctness guard is
    > the nonexistent-id check.
    > **What §16 covers now:** lesson prose *and* `quizData.js`'s `explain` fields, with the `en`/`es`
    > patterns capturing the multi-number form (`Lessons 3, 5 and 7`) rather than only the first
    > number. Quiz items are scoped **per item, not pooled per lesson** — an `explain` field has no
    > sibling field for a translation to move a reference into, so pooling would just re-open the hole.
    > Proven against the real bugs by re-injection, with a negative control (a translation legitimately
    > carrying *fewer* references than its English still passes, so the intended asymmetry survives).
    > **What this says about the translation-review ledger, worth carrying forward:** `DECISIONS.md`'s
    > 2026-08-13 entry records an AI review pass over all 40 lessons × es/ko/zh/ja "checking
    > faithfulness", marked 160/160 reviewed. That pass did **not** catch these 74 wrong references in
    > 20 lessons. Not a reason to redo it — concrete evidence for the caveat that entry already states,
    > that AI review has correlated blind spots. **The generalization: a mechanical, checkable property
    > should get a script in `check-data.mjs`, not a reviewer's attention.**

27. **[Content/UX — ✅ CLOSED 2026-09-07 (scheduled dev-agent): NO CANDIDATE REMAINS under this
    item's own two rules, in any track. Do not pick it again without a new rule.] Lesson visuals.**
    > **COLLAPSED 2026-09-07 (W-7.2 rule 1) from 48,083 b to this.** It was **11.2% of the entire
    > backlog** — the largest single object in the file — and what it held was twelve chronological
    > "Nth visual added" narratives, their layered corrections, and a decade of dated coverage counts
    > that **this item's own text forbids anyone from quoting**. All of it is in the run log, in
    > `AGENT_LOG.archive.md`, and in git (`413f9cc` is the last revision carrying the full text; each
    > figure's design argument is one `git log -S` away). **Every per-figure do-not-improve warning
    > that was dropped is asserted by `check-data.mjs` in code, with the same reasoning written into
    > its failure message** — verified before deleting, not assumed. **The four constraints under
    > "Standing constraints" below are the ones NO check holds; they are kept because of that.**
    >
    > **What was true:** the money track was the least illustrated of the three, and this item drove
    > twelve figures onto it and its neighbours. **What is true now, measured 2026-09-07 with the
    > parse below and its control:** **26** lessons carry no figure, and **all 26 are on the ⛔
    > rejection list** — which has no stale entry either (bare-set against rejection-set, both
    > directions, programmatically). Coverage: economy **7/12**, money **7/17**, essentials **4/15**.
    > **The money track was exhausted before the closing run began** — all ten of its bare lessons
    > were already rejected — so the last two unevaluated lessons in the whole app were economy 29
    > and 31. Both were evaluated; both reject.
    > **⛔ 29 — "Transactions: The Building Block" — REJECTED, rule 2, and it is the highest-stakes
    > rejection in this item:** it is lesson 1 of the main path, the lesson §4.3's Phase-0 gate is
    > about. Four designs, each already shipped or self-defeating: the transaction/income chain as a
    > closed loop **is lesson 30's `SpendingLoop`**, one lesson later and deliberately placed there;
    > `$500 ÷ 100 loaves = $5` as a partitioned total is `budgetSplit`/`mortgageSplit`/`BracketStack`'s
    > shape, and the prose performs that division in one clause; transaction → market → economy as
    > containment is `NestedCycles` one axis over; and a two-segment bar splitting the $500 into cash
    > and credit **invents the one proportion the lesson is about**. **Rule 1 does NOT reject 29** — it
    > states $500, 100 and $5 in all five languages and would invent nothing.
    > **⛔ 31 — "Productivity Growth: The Long-Run Driver" — REJECTED, rules 1 AND 2.** Rule 1 with the
    > invented quantity named, as the rule requires: the obvious figure is the straight productivity
    > trend with credit swinging around it, and its entire visual claim is **the amplitude of those
    > swings relative to the trend, and their period** — lesson 31 states **neither**, in any language
    > (all five scanned: the lesson contains exactly **one** number, `$15,000`). The contrast that
    > proves this reading is lesson 33, where `NestedCycles` was allowed *because* the prose bounds
    > both spans ("5-8 years", "75-100 years"). Rule 2 rejects it twice over: that shape **is**
    > `NestedCycles`, two lessons later, and section 2's "same $15,000, opposite outcome" is
    > **`SunkFork`'s** topology, shipped on lesson 19. ⚠️ It is also **Dalio's signature chart**;
    > §10.2 is *not* what rejected it — rules 1 and 2 did, independently and first — but a run
    > reaching for that design should know it is adjacent to a closed blindspot as well.
    > ⭐ **The transferable finding, and it is why this closes rather than parks: the economy track's
    > two remaining gaps are surrounded by the shapes that would fill them.** 29 sits beside lesson
    > 30's loop; 31 sits between 32/33/38's cycles. That is not an obstacle to route around — it is
    > the do-not-redraw rule reporting that **this track's figure vocabulary is complete.**
    > **What would legitimately reopen this item:** a genuinely NEW shape nobody has drawn here,
    > argued from a sentence some lesson's prose cannot write — **not** a lesson off the list below,
    > and **not** a softening of either rule. The rules are load-bearing, not ceremony: between them
    > they killed six named designs on the closing run alone.
    >
    > **⛔ NEVER QUOTE A COVERAGE COUNT FROM THIS ITEM, including the one three paragraphs up.** Every
    > count ever typed here has gone stale — "money is 4/28" survived four weeks, and the 2026-08-27
    > figures were still being quoted on 2026-09-07 when all three were wrong. **Run the parse; it
    > takes one command and cannot be stale:**
    > ```
    > node -e "const u=new URL('file://'+process.cwd()+'/src/content/lessons.js').href;import(u).then(async({lessons})=>{const fs=await import('node:fs');const m=fs.readFileSync('src/components/LessonVisual.jsx','utf8').match(/LESSON_VISUALS\s*=\s*\{([\s\S]*?)\n\}/);const ids=[...m[1].matchAll(/^\s*(?:'([^']+)'|\"([^\"]+)\"|([\w-]+))\s*:/gm)].map(x=>x[1]||x[2]||x[3]);const by={};for(const l of lessons)(by[l.track]??=[]).push(String(l.id));for(const[t,v]of Object.entries(by))console.log(t,v.filter(i=>ids.includes(i)).length+'/'+v.length,'bare:',v.filter(i=>!ids.includes(i)).join(' '))})"
    > ```
    > **Carry the control:** it must parse **44** lessons, must find `36`, must not find `9999`, and
    > must report **0 orphan ids**. ⚠️ A *regex* over `lessons.js` returns **0 lessons** — the entries
    > are multi-line; importing the module is what works, and the control is what catches it.
    >
    > **THE TWO RULES. Every rejection below is one of them.**
    > 1. **The quantity rule.** Does the prose state every quantity *the shape needs*, or only the
    >    ones that make it sound plausible? A shape needing **zero** passes vacuously.
    >    ⛔ **IT IS ABOUT INVENTED QUANTITIES, NOT ABOUT HAVING SOME — misread that way it has
    >    wrongly rejected TWO lessons**, 25 (shipped 2026-09-04) and 19 (shipped 2026-09-07), both
    >    re-decided under this correction rather than overridden. **When this rule rejects a lesson,
    >    name the quantity that would have to be invented and the mark it would be invented for.** If
    >    that sentence cannot be written, the rule is not what is doing the rejecting.
    >    ⭐ **A shape whose parameters cancel can be sourced from a single stated fact, and that is
    >    not inventing one** — `SplitBand` (lesson 12) is the worked case: neither principal nor
    >    payment survives the amortization algebra, so the whole curve follows from the one number
    >    the lesson states.
    > 2. **The do-not-redraw rule.** A figure may not restate a shape this app already ships.
    >
    > **⛔ MEASURED REJECTIONS — DO NOT RE-DERIVE ANY OF THESE.** `money`: **16, 18, 20, 21, 22, 24,
    > 26, 41, 42, 43**. `essentials`: **2, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15**. `economy`: **29, 31,
    > 35, 39, 40**. That is all 26 bare lessons. ~~19~~ and ~~25~~ were on this list and are now
    > **shipped**, both via rule 1's correction rather than an override. **There is no named
    > candidate, deliberately** — a named candidate is how this item became count-shaped twice. A run
    > that wants one reads a lesson's prose and names what the prose cannot do. **Do not pick a
    > lesson because a diagram is "plausible" there.**
    >
    > **Where each shipped figure's argument and guard live.** Twelve figures ship; each is a
    > component in `src/components/charts.jsx` and each is asserted by a numbered `check-data.mjs`
    > block whose failure messages carry the reasoning. The pointer, verified alive 2026-09-07 (all
    > twelve return ≥2 hits in both files, which is the control):
    > `grep -n '<Component>' src/components/charts.jsx scripts/check-data.mjs` for `BracketStack`,
    > `GrowthCurve`, `GapColumns`, `PreferenceFlip`, `TradeoffPlot`, `OutcomeGrid`, `SpendingLoop`,
    > `BalanceBand`, `SplitBand`, `NestedCycles`, `MatchGrid`, `SunkFork`.
    > ⚠️ **Do NOT grep the `LESSON_VISUALS` kind names** (`outcomeGrid`, `budgetSplit`, `earningsGap`,
    > …): measured 2026-09-07, six of nine return **zero** hits in `check-data.mjs`, so that pointer
    > reads as "unguarded" for figures that are in fact guarded. The component name is the live key.
    >
    > **STANDING CONSTRAINTS — the four things here that NO check asserts. Everything else in this
    > item's old body was either dated record or a warning `check-data.mjs` now enforces.**
    > 1. 🔎 **The yield-curve morph's halfway frame is the lesson's own flat shape, and nothing in
    >    the code asserts it.** All four shapes share the x control points `10,40,70,130` and differ
    >    only in height, so the halfway frame of a **normal → inverted** morph is `37.5,37.5,35,35`
    >    against the authored **flat** shape's `38,37,36,34` — **21× closer to flat than to either
    >    endpoint**, so the animation walks lesson 36's own stated sequence (normal → flat →
    >    inverted) with no new copy. Nobody designed this; it is an accident of the geometry. **A
    >    future run must not re-author a shape's heights or "improve" the easing without re-checking
    >    that property** — it is the figure's whole pedagogical claim.
    > 2. ⚠️ **Lesson 36's four-up grid was TRADED, not lost.** The four shapes are no longer visible
    >    simultaneously in the lesson; that was traded for the lesson's second section and takeaway
    >    (which are a *transition*), for ~3× the linear size at 375px (§3.0.7), and for §3.0.1. **The
    >    simultaneous comparison still ships unchanged in Reference > Market signals.** A run that
    >    wants the grid back in the lesson **owes an argument against those three**, not a preference
    >    for grids.
    > 3. ⛔ **A figure's geometry is a RENDERED property and a source check cannot see it.** Two
    >    figures shipped with every style literal correct and rendered unequal rows: `OutcomeGrid` at
    >    **82px against 52px** (a label inside a cell) and `SpendingLoop` at **35px against 52px** (a
    >    row heading wrapping to two lines) — CSS grid sizes a row to its tallest item, so the
    >    inequality arrived through *content*. Both were found only by measuring the live DOM.
    >    **The first live measurement of any new figure should be its boxes**, and prefer structural
    >    invariants (no text in a cell; a fixed shared height) over stylistic ones. The two instances
    >    are now held by §57 (e2) and §64; **the practice is general and is held by nothing.** The
    >    general instrument is item 135.
    > 4. ✅ **Lift a figure's labels from the lesson; do not translate them.** Every string
    >    `SpendingLoop` renders except its text alternative is a **verbatim substring of lesson 30 in
    >    the same language** (6 strings × 5 languages), so 24 of its 28 non-English strings are not
    >    new translation at all. This matters because `DECISIONS.md`'s 2026-08-16 scope limit says
    >    chart labels are *"the content type where an unreviewed translation is least visible, because
    >    a wrong label still renders as a correctly-shaped chart"*, and the parity checks catch **a
    >    missing language, never a wrong one**. `check-data.mjs` §64 is the first check here that
    >    catches a *wrong* label, and it does it by anchoring to the lesson rather than by reviewing
    >    the translation. **A future figure whose labels can be lifted should be lifted.**
    >    ⚠️ **Pointer correction 2026-09-07:** the text this replaces cited "§64 (a)", "§64 (c)" and
    >    "§64 (d)". **§64 carries no lettered sub-blocks** — all three properties (labels lifted
    >    verbatim, the ring's step order, `LOOP_BOX` never gaining a size) are asserted inside a
    >    single unlettered §64. Cite it plainly; the lettered form resolves to nothing.
    >
    > **⛔ One do-not-re-derive note that is NOT about a bare lesson, kept because a run could
    > otherwise "fix" it: lesson 32 shares the `cycle` figure with lesson 38, deliberately.** When
    > `NestedCycles` replaced the shared `cycle` figure on lesson 33 (2026-09-04), lesson 32 was left
    > on it on measured grounds: scanning each lesson's own prose for the four rendered phase labels
    > **in its own language** (positive control: lesson 38, which owns the vocabulary, scores 4/4 in
    > all five), **lesson 33 scored 1 of 4 and lesson 32 scores 2-3 of 4** — lesson 32's own headings
    > are "Expansion Phase" and "Contraction & Recession", so most of the labels are its own words.
    > The parse above still shows `32 -> cycle` and `38 -> cycle`. **Zero learner confusion is
    > *claimed* here, not measured** — a run picking this up should start from that scan rather than
    > re-deriving it, and should not treat the shared figure as an oversight.
    >
    > ⭐ **And the finding that outlived the item, kept because it is about reading plans, not about
    > figures.** §3.0.4 — the clause this item was built on — reads *"an LLM can explain a yield curve
    > in text; a curve inverting in front of the reader is what a chat window cannot do."* **It was
    > quoted fifteen times for its first half and never for its second.** The word is **"animated"**,
    > and `charts.jsx` contained **zero** state or motion primitives in 1,047 lines until 2026-08-31 —
    > every figure in the app was still. (Lesson 36's morph runs on `requestAnimationFrame` with an
    > explicit `prefers-reduced-motion` check, because `index.css`'s reduce block uses `!important` on
    > CSS animation/transition and is **blind to a rAF loop** — that guard is load-bearing, not
    > ceremony.) **A plan clause can be cited accurately, repeatedly, for months, and still have half
    > of it go unread — because each citation quotes it to justify the work already being done. The
    > half nobody acts on is the half that does not resemble the current tranche.**

28. **✅ MECHANISM DONE 2026-08-16 — `src/content/lessonTerms.js`, a curated lesson→glossary link
    table, guarded by `check-data.mjs` §17. Do not re-pick this item to "finish" it: what remains is
    a glossary *coverage* gap, and that is item 35.** See the run log.

29. **[Process — ✅ DONE 2026-08-16. Both payload gaps closed, both proven in a live browser.]
    Finish the §9.2 event payloads — the half of item 18 that is NOT owner-blocked.** See the run log.

35. **✅ FULLY DONE 2026-08-21. Both batches shipped — 12 terms 2026-08-16, 2 more 2026-08-21. The
    glossary is 35 terms (38 since the M0/M1/M2 entries).**

36. **✅ CLOSED 2026-08-16 (fifth pass, owner-requested). `ja` cross-reference coverage 31 → 44,
    equal to `ko` and `zh`. The guard that generalizes is in: `check-data.mjs` §16 prints the
    per-language match count and fails on a drop.** See the run log.
    > **THE STANDING LESSON, and it took four premature all-clears to learn: on this check a green
    > `npm test` has repeatedly meant "not scanned", not "clean".** Hand-enumerating surface forms
    > failed four times (`레슨 N`, `レッスン N`, `15강`, `第N講`), and the scope was wrong too —
    > §16 walked lesson prose only and never read `quizData`. **Verify this class by injection, not
    > inspection**, and use a **single-pass** substitution: a two-pass replace corrupts the counts.

30. **[Process — ✅ DONE 2026-08-16. `CLAIMS.md` + `scripts/check-claims.mjs`, wired into `npm test`.
    14 claims, 2 of them already refuted by this repo's own history.]**
    > **Premise correction from building it:** "no such artifact exists" was half wrong. `LAUNCH_PLAN.md`
    > **§4.6 already held four monetization claims**, each with a refuting number. What they lacked was a
    > **check date** — the third of §9.1's three parts, and the one that makes a claim self-refuting
    > rather than merely well-phrased. They are imported as B1–B4 rather than reinvented.
    > **The register's most useful output is a concentration, not a claim:** 10 of 14 are unmeasurable
    > today and nearly all name **item 18**. That reframes item 18 from one blocked backlog line into
    > the thing keeping most of this project's stated beliefs unfalsifiable.
    > **⛔ D1 and D2 are recorded as already REFUTED**, by evidence from this log, and they are why the
    > adversarial self-check exists: **D1 — a run's self-reported verification can be trusted** — failed
    > twice (the §10.1 "closed" claim that was half done; item 33's "0 remain" that the item-36 run
    > disproved 67 references later). **D2 — a green `npm test` means the property holds** — failed via
    > §16's ko/ja patterns matching 1-of-44 and 1-of-31. Per §9.1 the response must be a product change,
    > not a softer restatement, so the three changes those forced (the adversarial self-check, the §16
    > coverage tripwire, and this register) are listed in the file **specifically so they cannot later
    > be quietly softened**.
    > **`check-claims.mjs`** fails on a malformed row, a non-ISO check date ("when analytics land" is
    > rejected by design), a duplicate id, a bad measurability value, or a missing file; it **warns** on
    > past-due dates, which is what §9.3's audit question 4 reads. All six guards proven by injection.
    > `CLAIMS_TODAY` overrides today's date so the past-due path is testable and no date is hardcoded (§2.3).
    > **Known limit, written into the script's header:** it verifies shape and dates. It cannot verify
    > that a claim is any good, that a threshold is the right number, or that a status is honest — and
    > it specifically cannot catch a threshold softened *after* seeing the result, which is the failure
    > §9.1 actually cares about. **That one stays a human duty.**

31. **✅ DONE 2026-08-16 — hash routing shipped as scoped: `src/lib/deepLink.js`, `#/learn`,
    `#/practice`, `#/reference`, `#/lesson/<id>`, one module, no router, respecting item 12's
    port-cost rule.** See the run log.
    > **⚠️ What this surfaced is an OWNER question, not a follow-up task: a URL does not unlock a
    > lesson.** §5's acquisition funnel wants each lesson to be a shareable link, and the sequential
    > unlock model means a shared link lands on a locked screen. Recorded in `DECISIONS.md` with the
    > owner-facing cost. **Deliberately not built:** routes for the Reference sub-nav.

37. **✅ DONE 2026-08-16. §10.4's translation-coverage figure is now enforced rather than trusted —
    `check-data.mjs` §11b fails the build when it disagrees with the live ledger.** See the run log.
    > **Deliberately NOT guarded: the same row's character-count figures.** They move by single digits
    > on any content edit, so guarding them would make every content commit red. `refresh-readiness.mjs
    > --check` owns the character sentence; §11b owns the coverage percentages and explicitly excludes
    > char counts. The two comments read as contradictory only out of context.

32. **✅ DONE 2026-08-17 — §9.3's first monthly audit, run nineteen days early and deliberately, as
    `reviews/2026-08-17-monthly-audit.md`. Its three proposed §10 blindspots and claim D3 were
    applied by item 73.** See the run log.
    > **Deliberately NOT done: §9.3's closing "update §10" step** — §10 lives in `LAUNCH_PLAN.md`,
    > which an audit should propose against rather than edit in the same pass.

40. **[A11y — ✅ DONE 2026-08-16. Fixed as a pattern, not one line: the audit found the `<ol>`/`<ul>`
    question was the *smaller* of the two defects in these lists.]**
    > **The bigger find, which this item did not anticipate:** every list in the app sets
    > `listStyle: "none"`, and **WebKit removes list semantics from exactly that** — so under VoiceOver
    > on iOS all eight were announced as loose text, with no "list, N items" and no item position. The
    > `<ol>`/`<ul>` mixup affected one list; this affected all of them, on the platform the app targets.
    > All eight now carry an explicit `role="list"`.
    > **⚠️ Honest limit on that half, stated because this log's D1 claim exists:** the `<ol>`→`<ul>` fix
    > and the `role="list"` attributes were verified live; **the WebKit behavior itself was not**, because
    > the preview browser here is Chromium, where `role="list"` is a no-op. That half rests on documented
    > WebKit behavior, not on a measurement taken in this environment.
    > **Guarded by `check-data.mjs` §20**, which fails if any `listStyle: "none"` list lacks
    > `role="list"`, and — per item 36's lesson — fails *itself* if its scan matches fewer than 8 lists,
    > so a dead pattern can't pass vacuously. Proven by three injections. **§20's header carries the
    > per-list verdicts for all eight lists, and what the check cannot do** (it cannot tell whether
    > `<ol>` or `<ul>` is right, which is the content judgment this item was actually about) — read them
    > there rather than re-deriving them.
    > ⚠️ **Renumbered 34 → 40 on 2026-08-16, and this is how to read older entries.** Two items were
    > both numbered 34; this one moved, by blast radius rather than seniority — the other (the "Be the
    > Fed Chair" policy simulator) is cited from seven files in `src/`, `scripts/` and `DECISIONS.md`,
    > while every reference to this one was `AGENT_LOG.md` prose. **Run-log entries dated 2026-08-16
    > that say "item 34's `<ol>`/`<ul>` a11y call" mean this item (40).** Those entries are history and
    > stay verbatim. Any other "backlog item 34" — and every one in source code — means the simulator.
    > `check-data.mjs` now fails the build if two backlog items share a number.

24. **[Content — EXHAUSTED in substance; do not pick by default] The money track teaches mechanics, but
    the owner asked for judgment.** Compressed 2026-08-16 by the weekly review (W-3) from ~80 lines of
    accreted "Update, `<date>`" paragraphs; nothing below is new, and the full history is in the run log
    (2026-08-07 → 2026-08-09). Owner-stated 2026-08-07 in an interactive session, correcting the
    direction fifteen consecutive lessons had been built in — **it takes precedence over item 17's raw
    lesson-count framing.**
    **Verbatim owner intent, do not paraphrase this away:** *money lessons* means lessons in the spirit
    of books like **"Rich Dad, Poor Dad"** — "it is crucial to be wise rather than impulsive and the app
    is there to help learn about making wise choices."
    - **Status: satisfied in substance. Do not add a fourteenth judgment lesson by default.** Thirteen
      judgment lessons were built 2026-08-07 → 2026-08-09, and **every topic this item's own "what to
      write instead" list named is now built.** The gap it was written against — that every money lesson
      was procedural (*here is how a mechanism works*) and none taught decision-making (*how to choose,
      how to notice you're about to choose badly, why people who know the mechanics still end up broke*)
      — is closed.
    - **Current ids, post-2026-08-14 renumbering:** money **1–15 are the mechanics lessons**; money
      **16–28 are the judgment lessons** — asset-vs-liability lens, lifestyle inflation, opportunity
      cost, sunk cost, FOMO/herd behavior, anchoring, confirmation bias, present bias, needs-vs-wants,
      time horizon, mental accounting, loss aversion, overconfidence after a lucky win. **Ids cited in
      run-log entries written before 2026-08-14 are pre-renumbering and are wrong now — read
      `src/content/lessons.js`, don't trust a quoted id.**
    - **Two unbuilt candidates remain**, and they come from an informal starter list, not from this
      item's original scope: lifestyle creep after a windfall, and "too good to be true" pattern
      recognition (the latter possibly overlapping lesson 20's FOMO/herd-behavior lesson — read both
      before committing). **Neither moves any §4.3 clause**; read item 17 and the 2026-08-16 PRIORITY
      BLOCK before picking either.
    - **The §10.1 tension — do not skip this.** That genre is advice-heavy and parts of it are contested
      (e.g. Kiyosaki's "your house is not an asset" conflicts with standard accounting; his leveraged
      real-estate advocacy is genuinely risky prescriptive advice; parts of the book are disputed as
      fictionalised). §10.1 forbids advice-adjacency and `check-blindspot.mjs` only catches literal
      phrases — it cannot catch "this reads like advice," which the script's own header says stays a
      judgment call. **Take the genre's mental models and its behavioral insight; leave its
      prescriptions.** Teach the lens ("does this put money in or take it out?") and be honest that real
      purchases sit in between; never write "buy assets, not liabilities" as a directive, never name a
      product to buy, never imply a path to wealth. Do not cite or quote the book as an authority — it
      is a pointer to a genre the owner named, not a source to copy.
    - **The failure mode this item created:** four consecutive runs each wrote "a future run should
      re-scope this rather than keep extending the list ad hoc," and each then extended the list ad hoc
      anyway. It functioned as a perpetual lesson-generator.

17. **[Content — EXHAUSTED, both §4.3 content clauses met] Grow the lesson catalog.** Compressed
    2026-08-16 by the weekly review (W-3) from ~63 lines; the deepening-run chronology and the eighteen
    `LAUNCH_READINESS.md` refresh notes it carried are history and live in the run log (2026-08-12 →
    2026-08-15). Derived from `LAUNCH_PLAN.md` §4.3 — the plan's own explicit gate, not owner-assigned.
    - **Status: 40 lessons / 136,031 English chars / 120 minutes (28 money + 12 economy). Both §4.3
      content clauses are met** — lesson count (≥40) cleared 2026-08-09; minutes (~120) cleared
      2026-08-15 by lesson 36's term-premium section, after seventeen consecutive +1-minute deepening
      runs. **This item's stated purpose — move a §4.3 content clause — is exhausted. Do not pick it for
      another deepening, and do not add a forty-first topic.**
    - **Measurement method, reproducible:** sum every lesson's `sections[].body.en` + `takeaway.en` +
      `thinkAbout.en` across `content/lessonContent.economy.js` + `content/lessonContent.money.js`, and
      sum `minutes` from `content/lessons.js`. **`minutes` is not hand-set and cannot silently drift:**
      `scripts/check-data.mjs` recomputes it as `round(words / 200)` from the body text and fails
      `npm test` on mismatch — so the number scored against the gate is the same number the app shows a
      learner. (Independently verified by the 2026-08-16 weekly review.)
    - **This does not end Phase 0.** §4.3 requires the content clauses **and** ≥40% of installers
      finishing lesson 1. That third clause is unmeasured and blocked on an owner action (item 18 — a
      real analytics provider), **not on more content**. Per §4.3 verbatim: "the highest-value
      monetization work right now is writing lessons, not writing billing code" — but with both content
      clauses met, that sentence no longer points at more lessons. Do not start billing/paywall work
      ahead of the gate either; see item 15.
    - **Chunk-size caution for any future content edit:** `lessonContent.money` builds to 499.36 kB,
      just under Vite's 500 kB warning threshold. A deepening pass on a *money*-track lesson must check
      the post-build chunk size before committing; economy-track content lands in a separate chunk.
    - **The failure mode this item created:** nine consecutive scheduled runs each picked "add one
      lesson" and optimized the count while the direction drifted unexamined, until the owner corrected
      it (item 24). **Counting lessons is not the same as building the product.**

21. **[Content] Kids financial literacy — content gap closed; content-depth structural change built (2026-08-16, eighth run).**
    **Update, 2026-08-16 (eighth run this date):** executed the content-depth scoping this item's own text
    below calls "a real content-architecture change... needs its own scoping pass" — added a `why` field
    (one sentence, all 5 languages, written fresh not machine-copied) to all 21 existing blurbs, rendered
    in `ParentGuide.jsx` under a new "Why it matters" label. Full detail, including why this was done as
    one uniform migration across all three age bands rather than a single-band pilot, is in that date's
    run log entry. This closes point (b) below — do not treat content-depth scoping as still-open work; a
    future run wanting more depth here needs a fresh scoping decision (e.g. per-blurb activities), not a
    default extension of this shape. Text below is retained for the item's full history.
    Assessed 2026-08-07 after the owner asked whether kids lessons were already in the master plan —
    see `LAUNCH_PLAN.md` §2.6. **Update, 2026-08-07 (tenth run):** each of the three age bands grew from
    three blurbs to five (fifteen total, up from nine), adding the missing money-skills material —
    wants-vs-needs, earning an allowance, saving toward a goal, a first kids' bank account, checking a
    balance before spending, "pay yourself first." **Update, 2026-08-15 (eleventh run):** each band grew
    from five to seven blurbs (**21 total**), adding comparison shopping, delayed gratification, budgeting
    as a plan, sales tax, gross-vs-net pay, and what a credit score measures. This backlog item's own text
    went stale after that run — it still said "fifteen... vs. 26 adult lessons" — while `LAUNCH_PLAN.md`
    §2.6 and `LAUNCH_READINESS.md` were correctly refreshed to 21 blurbs / 40 adult lessons the same date
    (twelfth run). Corrected here to match: **21 blurbs (7 per band × 3 bands) vs. 40 adult lessons.**
    **The "grow further vs. lesson-shaped structure" question, resolved:** this was really two different
    questions wearing one label.
    (a) *Making kids content **child-facing*** — a kid-directed lesson UI the child navigates themselves,
    with its own progress/quiz flow like `LessonReader.jsx` — was already answered: §10.3 reserves this
    for the owner (COPPA/store-classification decision), and item 19 (HELD) says so explicitly. Nothing
    changes here; still owner-only, still not to be built on this item's initiative.
    (b) *Deepening the **content** itself* (richer per-topic material — more structure per entry, not
    just a longer list) while staying strictly parent-facing (rendered only in `ParentGuide.jsx`, never
    surfaced to a child) does *not* touch COPPA status — but it's a real content-architecture change (new
    fields, a new render shape), not a same-shaped addition, so it needs its own scoping pass rather than
    being decided implicitly by whichever run gets to it next.
    **Decision:** do not pursue (a) on this item's initiative — unchanged, owner-only, see item 19.
    Do not default to (b) either, absent a future run actually scoping it. See `DECISIONS.md` ("Kids
    financial-literacy content: format stays parent-facing, structural depth un-scoped") for the full
    writeup. **A parallel, narrower caution:** simply adding another blurb to the existing three-field
    format (the pattern the 2026-08-07 and 2026-08-15 updates both followed) is itself a count-shaped
    backlog item — the same failure mode the PRIORITY BLOCK's P-1 flagged for item 17/24 ("counting
    lessons is not the same as building the product"), and it has already repeated once here (nine → 15 →
    21). Nothing in `LAUNCH_PLAN.md` §4.3 or elsewhere gates on a kids-blurb *count* the way it gates on
    adult lesson count/minutes, so there is no launch-plan reason to keep growing this number by default.
    A future run picking this item should have a specific new topic or a specific structural change in
    mind, not "add one more blurb because the list has room." **Not a design decision (do NOT do this):**
    making kids material child-facing — child accounts, a kids mode, kid-directed lesson UI — changes
    COPPA classification, store privacy category, and ad eligibility. §10.3 reserves it for the owner.
18. **[Process] Instrumentation (§9.2) — 🟡 call sites done 2026-08-05, TRANSPORT done 2026-09-05,
    only the provider account is still open.**
    > ⚠️ **NOTE 2026-09-07 (W-6.2 rule 2 — a note, not an item). The instrumented set is 8 call sites
    > and it is narrower than "the app".** Measured (`grep -rn "track(" src`, control:
    > `EVENTS.LESSON_COMPLETED` resolves to one of them): APP_OPENED, LESSON_STARTED,
    > LESSON_COMPLETED, QUIZ_TAKEN x2, QUIZ_ANSWERED x3, SIM_LEVER_CHOSEN. **The glossary bookmark
    > toggle fires nothing**, and §9.2's event set has no term-bookmark event — so a question like
    > "does anyone save terms?" is unanswerable even with a key pasted in. That is a plan question,
    > not a run's call. ⛔ **The transferable half is in item 26's close:** a follow-up was deferred
    > five times on evidence this list could never produce. **Before deferring anything "until
    > analytics", check this list for the event it needs.**
    > ✅ **2026-09-05 (owner-directed, "set up analytics for O-2"). The half a run can do is done.**
    > `src/lib/analyticsConfig.js` ships with `provider: "none"`; `track()` writes the local log
    > **and** forwards to whichever of `plausible` / `posthog` / `custom` that file names. **No
    > `track()` call site changed** — the promise the 2026-08-05 entry made. **What is left is one
    > owner action and it is now much smaller than "swap `sink()`":** create an account, paste the
    > public site id or ingest key into that file, `npm run build`, redeploy.
    > **Verified end-to-end with no provider account**, by pointing `custom` at a local receiver and
    > driving the built app in a browser: **5 events arrived** — `app_opened`,
    > `lesson_started{lessonId:29}`, `quiz_answered`, `quiz_taken{correct,total,scorePct}`,
    > `lesson_completed{durationSec:102}` — under **one** session id. §4.3's gate needs exactly the
    > last two payloads and both were read off the wire.
    > ⛔ **The finding worth not re-deriving: `navigator.sendBeacon` always sends with credentials
    > mode `include`,** so an `application/json` beacon triggers a credentialed preflight that any
    > `Access-Control-Allow-Origin: *` endpoint rejects — **0 of 5 events arrived**, with nothing
    > thrown and nothing logged. Beacons are now used only for `text/plain`; everything else uses
    > `fetch` with `credentials: "omit"` + `keepalive`. **A unit test could not have caught this**;
    > it took a real browser posting at a real receiver.
    > ⚠️ **NOTE ADDED 2026-09-07 (W-6.2 rule 2 — a note under this item, not a numbered item). The
    > same re-mount that was corrupting the review schedule also double-fires `quiz_answered`, and
    > that half was deliberately NOT fixed.** The schedule fix (`onlyWhenDue`, see "Completed and
    > pruned") guards `recordReview` only; `track(EVENTS.QUIZ_ANSWERED, …)` sits on the next line and
    > still fires once per answer per mount, so re-opening a lesson and re-answering its check sends
    > a second `quiz_answered` for the same question. **It is invisible today** — `provider: "none"`,
    > so the events go to one device's `localStorage` and nowhere else — **and it stops being
    > invisible the moment step 1 of O-2 lands**, which is why it is filed here rather than under the
    > fix. `quiz_taken` is already guarded per lesson-open by `quizFiredRef` and is unaffected;
    > §4.3's ≥40% gate reads `lesson_completed`, not this event, so the gate is not at risk. **Decide
    > it with the provider, not before:** whether a re-answer is one event or two is a question about
    > what the funnel is supposed to count, and answering it now would be guessing.

    > ⚠️ **No guard was built and none is due** (W-6.2 rule 3, W-6.3 at 2.15x). The learner-visible
    > failure `sanitizeProps` prevents — prose or typed text leaving the device — has **zero live
    > instances**: every call site passes scalars, measured. Guarding the guard is not earned yet;
    > if a call site ever passes a string that is not id-shaped, that is when it is.
    > ⚠️ **The provider choice was deliberately left to the owner** — cost and privacy differ
    > materially (PostHog: free here, native funnels for the ≥40% gate, but a persistent id and a
    > heavy SDK; cookieless: no consent banner, ~1-2 KB, but paid or less capable). The seam means
    > the choice no longer blocks any code. `DECISIONS.md` has the full reasoning.
    `src/lib/analytics.js` (`track()`/`EVENTS`) fires `app_opened`, `lesson_started`,
    `lesson_completed`, and `quiz_taken` (see run log entry "Wire the §9.2 minimum analytics event set").
    `paywall_viewed`/`trial_started`/`subscribed`/`canceled`/`ad_watched` have names reserved but don't
    fire — no paywall/billing/ad feature exists yet to fire them from. Events currently land in a local
    `localStorage` rolling log, not a real provider (PostHog, per the plan) — that swap needs an account
    and API key a dev-agent run can't create; see `DECISIONS.md`. What's left: create that account
    (owner action) and swap `analytics.js`'s `sink()`; item 17's D1 lesson-1-completion measurement is
    still blocked until then, since a per-device local log can't be aggregated across installs.
    **This is now the only thing gating the end of Phase 0** — both §4.3 content clauses are met (item
    17), so no amount of further content work moves the gate. Flag it to the owner in every run's output.
    **But do not read "blocked" as "nothing to do here": item 29 is the half of this item that is not
    owner-blocked** — §9.2 specifies `lesson_completed` *with duration* and `quiz_taken` *with score*,
    and neither payload carries them today. Fixing that now means the data is the right shape the day an
    account exists, instead of starting the measurement window with a known gap.
34. **✅ BUILT 2026-08-16 — the "Be the Fed Chair" policy simulator, inside lesson 35: two
    scenarios, three levers each, five languages, no score. Do not re-pick this to "extend" it.** See
    the run log.
    > **NUMBER NOTE, load-bearing: a second item also carried number 34** (the `<ol>`/`<ul>` a11y
    > item, renumbered to **40**). **Every "backlog item 34" in source code means THIS item.** In
    > run-log prose before 2026-08-16, "item 34" may mean either.
    > **Two design decisions are protected only by file-header comments** in
    > `src/content/policyScenarios.js` — read them before editing. **A third scenario must first
    > justify itself**: the two built already cover the dual mandate's two halves.

38. **✅ DONE 2026-08-16. All three sites now import `todayStr` from `src/utils/date.js`; the
    market-pipeline one was the consequential half, since `asOf` drives the staleness contract.
    Guarded by `check-data.mjs` §23.** See the run log.
    > **Known limit, written into §23's header: it catches the IDIOM, not the mistake.** A hand-composed
    > UTC date string still passes. The one legitimate UTC use is exempted by comment, not by path.

39. **✅ CLOSED 2026-08-17 as its own scoping directed — both replacements (items 46, 47) landed.
    Do not pick this again.** See the run log for the full scoping.
    > **NOT TO BE BUILT, measured rather than judged: the co-landing detector as a build gate.** Over
    > the sampled window it had a **57% false-positive rate**, and "same commit" is provably
    > unreachable in this repo anyway. Blanket "every figure is guarded" cannot be automatic either —
    > live claims and dated records are different classes, and §31 protects the second.

46. **[Process — ✅ DONE 2026-08-17 (scheduled dev-agent). Shipped as `check-data.mjs` §26, with the
    exemption vocabulary the item asked for and one design change it did not anticipate — patterns are
    expanded and checked rather than skipped, which is what catches `DECISIONS.md`'s brace-contracted
    reference to two deleted files. Closing note at the end of this item.] Every repo path
    a tracked document names must exist.**

47. **[Process — ✅ DONE 2026-08-17 (scheduled dev-agent). Shipped as `scripts/refresh-readiness.mjs`
    with three modes; the two live figures are generated and `npm test` holds them. Item 39 is closed
    with it.] Move `LAUNCH_READINESS.md`'s refresh snippets out of the document and compare their
    output to the figures the document states.**
    > **The `--write` mode is what makes the gate survivable**, and the scope did not name it. Bare
    > prints the figures, `--check` compares them and is chained into `npm test`, and **`--write`
    > rewrites them in place**. That third mode answers the objection §11b wrote down when it
    > deliberately refused to guard character counts ("a build that fails over 19 characters would be
    > turned off within a week"). **That objection is right about a hand-maintained figure and does not
    > carry to a generated one** — the fix is now `npm run readiness -- --write`, one command instead of
    > a re-derivation. §11b's coverage sentence was left alone; folding it in would have been a rewrite.
    > **Guarded surface: exactly two sentences** — the §4.3 catalog row and §10.4's character sentence,
    > the document's only figures that must equal the content *today*. ⚠️ **The negative control is the
    > one that matters:** the doc's history figures (`112,387`, `100 minutes`, "by **exactly 19
    > characters**") were verified untouched by a `--write` that did change something, because item 39's
    > scoping showed live and historical figures share sentences and no parser separates them.
    > **Item 39 is closed by this.** What it correctly ruled out (a co-landing detector as a build gate,
    > 57% false positives) stays ruled out; the reporting-line idea it left for the weekly reviewer is
    > still unbuilt and is a reviewer tool, not an `npm test` failure.

49. **[Process — ✅ DONE 2026-08-17 (owner-directed). Two of the three proposed surfaces were REJECTED
    on the measurement, the item's own ranking was backwards, and putting `README.md` under §26 turned
    up a live §10.2 blindspot violation that had been in the repo's front-door document since it was
    written.] Widen §26's surface, one form at a time.**
    > ⚠️ **Do not treat this as a coverage gap to close on reflex.** §26's whole value is that a failure
    > means something; each surface added is another exemption class to define first. **Measure the
    > dead-reference count for a surface before deciding it is worth guarding** — item 46's own filed
    > measurement was wrong in four ways, and two of the three surfaces here failed on their numbers.
    > Full figures live in `check-data.mjs` §26's header, where the next person to widen it will read them.
    > - **`README.md` — ADDED.** 31 references, **3 dead**. The only surface with live rot.
    > - **Markdown link targets — ADDED, and they catch nothing today** (3 references, 0 dead). In
    >   because coverage that depends on a formatting choice is a hole — rewriting `` `foo.js` `` as
    >   `[foo.js](foo.js)` used to walk a reference out of §26 — not because it found anything.
    > - **Un-backticked bare paths — REJECTED.** 16 references, 8 dead, all 8 *already* exempted in
    >   backticked form: +8 exemptions for 0 new finds. Also unsound — the pattern matches `Node.js` in
    >   "Requires Node.js 18+", which is English, not a file.
    > - **`reviews/*.md` — REJECTED, and the measurement proved itself mid-run:** 98 references / 6 dead
    >   on the first pass, **112 / 8** ninety minutes later after the weekly reviewer appended a section
    >   correctly describing files item 45 deleted. **A dated snapshot accrues dead paths by doing its
    >   job**, so it belongs on the history side — the same argument that keeps `AGENT_LOG.md` out.
    > **`AGENT_LOG.md` is deliberately NOT proposed**, for that reason: an append-only history *should*
    > name files that have since been deleted, and the annotation would outnumber the content. Recorded
    > so the next run does not re-derive it as an oversight.
    > **The find this item did not predict, and the reason adding a surface beat widening a pattern:**
    > reading `README.md` properly for the first time turned up **"inspired by the framework popularized
    > by Ray Dalio and other economists" in its opening sentence** — a §10.2 violation in the project's
    > front-door document, while §10.2 had been reported closed since 2026-08-01 by a check that scanned
    > `src/` and the v5 prototype, **i.e. the two places the rule was already obeyed.** Removed, and
    > `check-blindspot.mjs`'s §10.2 scan now covers `README.md` — only README, because `LAUNCH_PLAN.md`
    > and `LAUNCH_READINESS.md` name Dalio while *stating* the rule, and a check that forbids describing
    > its own rule is unusable.

41. **[A11y — ✅ DONE 2026-08-16. Fixed, guarded by a new §22 check — and the live verification of the
    fix found that the same figure was failing sighted readers too, which is the more interesting
    half. See the run log.] `Bar` is the one chart primitive with no accessible description.** See the run log.

42. **[A11y — ✅ DONE 2026-08-16 (owner-requested, same evening it was filed). Content shipped as scoped;
    two guard gaps found on the way, both closed — see the closing note and the run log.] The four `YieldCurve` figures
    are labeled by `label`, not by a description — so their accessible name is "Normal (healthy)", which
    names the curve without describing it.** See the run log.

43. **[Process — ✅ FOUND AND FIXED 2026-08-16 by item 38's guard, on its first run. Filed as its own
    item because the fix is one character and the finding is repo-wide.] `scripts/translation-review.mjs`
    was invisible to `grep` — and had been since it was written on 2026-08-11.**

44. **[Small — ✅ DONE 2026-08-17. Filed as small and "no §2.3 violation"; the second half of that
    assessment was wrong, and finding out how was the run. See the closing note.] `useMarketData` treats
    a future `asOf` as fresh, and `Sectors.jsx` destructures `ageDays` without using it.** See the run log.

45. **✅ DONE 2026-08-17 (owner-requested). Lesson content is split by language as well as by track
    — ten chunks — and the largest content chunk fell 499.27 kB → 116.84 kB. Proven equivalent before
    anything was deleted.** See the run log.
    > **One real behavior change, not a pure refactor: switching language in the picker now fetches a
    > chunk.** `lessonContent.js` survives as a node-only merged view for the checks.
    > **Deliberately not done: splitting `quizData.js`** (the largest remaining chunk) — the run log
    > records why.

48. **[Perf — ✅ DONE 2026-08-17 (owner-requested). Quiz text split per language, the same second
    axis item 45 applied to lesson bodies. The 140.88 kB shared quiz chunk is gone.]** See the run log.

50. **[Process — ✅ DONE 2026-08-17 (owner-requested). `scripts/check-payload.mjs`, wired into
    `npm test`. Closes the first concern the 2026-08-16 review's §6.6 raised.]**
    > **The gap it closes.** The per-language splits took the largest content chunk from 499.27 kB to
    > 116.84 kB and deleted a 140.88 kB shared quiz chunk — and **nothing asserted any of it.** A single
    > `import { quizData } from "../content/quizData.js"` added to a screen — the most natural line in
    > the world to write — silently restores all five languages to that chunk, and **every existing
    > check stays green, because the data is still correct. Only the bytes change.**
    > **Why structure rather than bytes.** Byte assertions need `vite build` (which `npm test` does not
    > run) and would need rewriting every time a lesson is edited. The structure that *produces* the
    > payload is stable, and each failure mode is a nameable line of code. Four rules: every promised
    > per-language module exists (derived from `TRACKS` × `LANGS`); ⛔ **no module under `src/` imports a
    > merged view** (`lessonContent.js`, `quizData.js`) — the load-bearing rule, since those views
    > statically import every language and any path into one drags the whole catalog back; per-language
    > modules are imported **only dynamically** (a static import is that same failure one language at a
    > time); and every per-language module is named by some dynamic `import()`, since a module no loader
    > reaches is a runtime `TypeError` for one language only. **All four proven by injection**, tree
    > clean and green after each.
    > **Deliberately not checked:** chunk sizes, module counts, anything needing a build. If those are
    > ever wanted they belong in a separate build-time check — this one stays fast enough for every commit.
    > **Why a fifth script rather than a section in `check-data.mjs`:** contention. Three separate edits
    > to `check-data.mjs` collided with concurrent dev-agent runs on 2026-08-16/17, twice forcing a
    > commit to be reconstructed. A standalone file has no such conflict and matches the sibling pattern.

12. **✅ DECIDED AND UNHELD 2026-09-07 (owner, interactive): the app ships on iOS to the App Store,
    via Expo / React Native. The web app stays live and current.** Replaced by its conclusion per
    W-7.2 rule 1; the full reasoning, the two rejected options and the measured port surface are in
    `DECISIONS.md` § "Expo (React Native) vs. Vite (web-only)" and in this date's run log.
    ⛔ **What did NOT change, and a run must not read this as permission.** "Do not migrate to Expo on
    your own initiative" **still binds** — the rewrite is ~7,345 lines of UI and cannot be done one
    two-hour run at a time. **What did change:** "do not deepen the web-only investment" is now a
    measured cost rather than a theoretical one. Every new inline `style={{}}` and DOM-only component
    joins the rewrite. **Prefer content, `lib/` and content-parity work until a costed migration plan
    exists** — and that plan is the next thing this item wants, not code.
    ⚠️ **The one external fact that is NOT settled**, separated from the one that is: the paid Apple
    Developer Program membership is measured present, but `security find-identity` showed **one
    `Apple Development` identity and no `Apple Distribution`** — build-and-run on a device, not ship.
    A distribution certificate and provisioning profile are still real, undone steps.
19. **[HELD] Genuinely child-facing kids content** (§10.3, reopened 2026-08-04) — a COPPA/store-
    classification decision, not a UI one. The parent-facing framing (closed 2026-08-01) stands until the
    owner decides otherwise; do not change `ParentGuide.jsx`'s framing on this run's own initiative.

**Notes for future runs (informational — not actionable backlog items)**

- **RESOLVED 2026-08-13.** `scripts/translation-review.mjs`'s ai/human `method` field — uncommitted in
  the working tree for two days and flagged by roughly a dozen runs as an in-progress feature not to
  touch — was finished, committed, and actually used (160/160 lesson/language pairs marked
  `method: "ai"`) in an interactive session. See `DECISIONS.md` and the run log.
- **RESOLVED 2026-08-16 (owner decision).** `economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` are
  **gitignored and left on disk, untouched** — ignored, not deleted; v5's content stays in git history.
  Neither is imported by anything, and every feature in v6 has since shipped independently in `src/`;
  its one unique idea survives as **item 34**, concept only and explicitly not its code. ⛔ **Two
  standing rules outlive the resolution, because v6 is contaminated:** it carries direct Ray Dalio
  branding and quotes (§10.2, closed) and a hardcoded current date (§2.3, fixed) — **never carry
  anything over from it**, and **do not restore either file to the repo without asking the owner.**
  Consequence worth knowing: a fresh clone has no v5, so `check-blindspot.mjs`'s §10.2 scan reports
  whether it scanned v5 or found it absent rather than asserting either way.
- **OPEN — an owner decision, and the one note here that is not closed.** `main`'s reachable history
  starts at commit `2dc0264` ("Split monolithic JSX step 4a"). Roughly a dozen earlier commits (the
  initial scaffold, the original blindspot-register fixes, the Markets stale-date fix,
  `scripts/bootstrap-node.sh`, JSX-split steps 1–3, the language-Beta labeling, the data-shape
  harness) still exist as objects — `git cat-file -t` succeeds for `eda6dd0`, `ecdda70`, `5ab5c48`,
  `6feca25`, `76be081`, `053f8b2` — but are **not ancestors of `main`**. Most likely an early run's
  plumbing commit (`commit-tree`/`update-ref`, used because `git commit` hangs in this environment)
  picked up a stale parent hash. **No content is lost**: `2dc0264`'s tree already contains everything
  those steps produced. The owner's call is whether to reattach the orphans before they are
  garbage-collected, or leave them. Found 2026-08-04, unchanged since.

**Completed and pruned**

> ⛔ **The `former item N` labels below are load-bearing — never drop one to save bytes.**
> `check-backlog.mjs` builds its set of valid item numbers from every `former item N` string in this
> file, and **items 22 and 23 are cited from `src/` and `scripts/` with no other accounting anywhere in
> it** (proven by injection 2026-08-28: replacing `former item 22` fails `npm test` with 4
> dangling-citation errors). ⚠️ **A label must sit on ONE line** — the matcher requires a literal
> space, so a label wrapped as `former item` / newline / `55` does not register at all; two of them
> were wrapped that way and had been contributing nothing. Full detail for every line below is in the
> run log at the date given; this section is pointers, not history.

- **The end-of-lesson check counted one answer as many** — 2026-09-07. `Question`'s "one answer per
  question" lock is component state, so it lasted as long as the mount; the check re-mounts on a
  language switch and on leaving/re-entering the lesson, and each re-mount re-armed it. A question
  the learner had just MISSED was promoted a box and pushed a day further out. Fixed by
  `acceptsScheduleUpdate` (`src/lib/review.js`) applied at the lesson-check call site only, guarded
  by `check-data.mjs` §8b(ii). Found by a live walk, not by a sweep; four injections, both
  directions. Never had a numbered item.

- **§3.0.3 glossary coverage enforced in both directions (former item 57)** — 2026-08-17.
  `check-data.mjs` §17b: every glossary-term use is either linked or listed in `deliberatelyUnlinked`
  with a reason. Its scope limit, and the control that first made it return a false zero, are on live
  item 57 above and are deliberately not duplicated here.
- **The `minutes` reading model corrected to count the whole lesson (former item 56)** — 2026-08-17.
  The field was already derived and enforced; the *formula* was wrong, omitting the title, subtitle,
  section headings and the entire end-of-lesson check — about 20% of the words on screen. §2 now
  counts all of it at 200 wpm with a catalog-wide floor, so a blind count cannot read as a pass.
  Catalog total went 120 → 144 minutes, moving §4.3's content clause further clear rather than
  reopening it. See `DECISIONS.md`.
- **`LAUNCH_PLAN.md`'s catalog figures generated, and its Phase-0 gate verdict with them (former item 55)**
  — 2026-08-17. `scripts/refresh-readiness.mjs` owns 10 figures across two documents, including §4.3's
  "is the gate met?" verdict. That verdict is why the item was P1: the plan read "the gate is not
  close" while the generated scorecard said both content clauses were already met.
- **Lesson ids renumbered to match track order (former item 22)** — 2026-08-14. money is 1-28, economy
  29-40 (was money 13-40, economy 1-12), so a new learner's first lesson displays as "Lesson 1". Done
  by script against a verified id→id table across every id-bearing surface, plus a one-time
  client-side migration (`src/lib/lessonIdMigration.js`) for already-installed users' persisted
  progress. ⚠️ **Lesson ids quoted in pre-2026-08-14 run-log entries are stale;
  `src/content/lessons.js` is the source of truth.**
- **`lessonContent.js` split per track (former item 25)** — 2026-08-14. `LessonReader-*.js` fell
  557.70 kB → 5.92 kB. This superseded the 2026-08-12 mitigation, which had only raised Vite's
  `chunkSizeWarningLimit` to quiet the warning (that override is since removed). Later split per
  language as well — live item 45. See `DECISIONS.md`.
- **Machine-translation decision reversal, owner escalation (former item 20 / backlog P-4)** —
  2026-08-11 owner decision: option (a), accept the unreviewed es/ko/zh/ja state under "(Beta)"
  labeling. `DECISIONS.md` holds the three-option writeup and the reasoning;
  `scripts/translation-review.mjs` plus its ledger make the 0%-reviewed share visible instead of
  able to drift unnoticed. ⚠️ **`translation-review.mjs` cites this entry by name in two places
  (lines 7 and 159) — the phrase "former item 20" must stay findable here.** The decision itself is
  being reopened as a question by **O-3** at the top of this backlog: it was made about a static
  corpus, and the corpus is no longer static.
- **Lesson content split out of the main bundle (former item 23)** — 2026-08-07. `lessons.js` became
  lightweight metadata plus a lazy-loaded body module; the main chunk fell 522.40 kB → 207.01 kB.
- **Blindspot-register regression checks automated (former item 16)** — 2026-08-05.
  `scripts/check-blindspot.mjs` codifies the §10.2 / §10.1 / §10.3 / §2.3 greps that every run's step 5
  had been retyping by hand. **It is not a replacement for the judgment half of step 5** — "does this
  read like advice" still needs someone reading the diff.
- **Launch-readiness scorecard (former item 15)** — 2026-08-05. `LAUNCH_READINESS.md`, where every
  gate carries the exact command that produced its status rather than a narrative claim.
- **FRED economic readings surfaced on Sector performance (former item 13)** — 2026-08-04. Each
  reading is dated individually rather than sharing the payload's `asOf`, because CPI and unemployment
  update monthly while the Treasury yields update daily.
- **Sector performance and relative strength (former item 14)** — 2026-08-04. The daily job
  (`scripts/fetch-market-data.mjs`) writes `public/data/market.json`; `Sectors.jsx` ranks eleven S&P
  sectors against SPY. The placeholder formula it shipped with was replaced by the owner's own on
  2026-08-04 — see the App summary.
- **The accessibility pass: dynamic font scaling, both mobile-responsiveness sweeps, `npm audit`** —
  2026-08-04. 103 inline `fontSize` values converted to `rem` behind a 4-step "Aa" control
  (`ecycles_font_scale`); a global `box-sizing: border-box` reset added, the app having had no
  stylesheet before, so every `width: 100%` element with its own padding was sized in `content-box`;
  swept at 375px, at 320px portrait, at 320px combined with the 130% font step to check the two
  features do not compound, and at 568×320 landscape including the first-launch modal —
  `scrollWidth === innerWidth` everywhere, a clean result rather than a skipped check. `vite` was
  bumped `^5.4.11` → `^6.4.3`, taking `npm audit` to 0 vulnerabilities.
- **Phase-color contrast (plan §3.5)** — 2026-08-04. Green and amber failed 4.5:1 as small text and
  moved to darker shades, left unchanged as borders and fills, which need only 3:1. ⚠️ **The hexes
  this entry used to quote are deliberately not restated** — the palette has moved twice since, and
  live item 63 records what a stale hex quoted here cost. `src/index.css` is the palette; read it
  there. The property is now machine-enforced on every `npm test` by §28 (AA on 108 pairs) and §28b
  (3:1 on 70 graph pairs).
- **`completedLessons` persisted, and the whole first-session flow, steps 6a–6e** — 2026-08-03/04.
  localStorage keys `ecycles_completed_lessons`, `ecycles_streak` and `ecycles_continue_pref`;
  first-open routing straight into lesson 1, a completion toast and progress-ring animation, and a
  once-a-day continue-tomorrow opt-in that records a preference and **schedules no real notification**
  — see `src/lib/useAppState.js:188` for why that is the held §2.1 platform decision and not an
  oversight.
- **The JSX split, steps 1–4d: `economic-cycles-v5.jsx` from 1,340 lines to 135** — 2026-08-02.
  Locales, then content modules, then the four per-tab components, each verified independently by the
  weekly review. Superseded wholesale by the 2026-08-04 rebuild onto `src/App.jsx`.
- **Data-shape check harness (`npm test`) and `scripts/bootstrap-node.sh`** — 2026-08-02. The harness
  catches a missing language field in about 5 seconds, with no browser and no two-minute build.
- **Quiz answer key de-skewed** — 2026-08-02 (weekly reviewer, owner-requested, out of priority
  order). Correct answers had been 12 of 13 on index 0 — tap-the-first scored 92% — and are now spread
  roughly 3/3/4/3 across the four positions. ⚠️ **Pointer corrected 2026-08-28: the header comment
  explaining the invariant lives in `src/content/quizMeta.js`, not `quizData.js`.** The answer key
  moved there in item 48's per-language split, and `quizData.js` is now a node-only merged view the
  app never imports. Read it before adding or editing a question; `npm test` warns if any one index
  ever holds more than half the answers again.
- **Stale and dated factual figures reworded** — 2026-08-02. The `~$50T credit vs ~$3T money` figures
  became figure-free "many times larger than the base money supply"; the "2+ quarters of falling GDP =
  recession" line became a rule of thumb with an NBER note; and the yield curve "has predicted EVERY
  US recession since 1955" became the correct and weaker claim — inversions have preceded every
  recession since 1955, but not every inversion is followed by one. All three across lesson bodies,
  quiz explanations and glossary entries.
- **Unused translation keys deleted** — 2026-08-03. 13 keys with zero call sites, removed from all
  five locales rather than built out, because building them would have reopened §10.1.
- **`DECISIONS.md` created** — 2026-08-03, with Expo-vs-Vite (open, owner), `.js`-not-JSON content
  modules, and localStorage-only state.
- **`README.md` refreshed to the split structure, and `check-data.mjs`'s `t.key` scan broadened to
  every component file** — 2026-08-02. The scan had been reading only `economic-cycles-v5.jsx`, so it
  covered less of the translation-key surface with every extraction.
- **Language picker "(Beta)" labeling (§3.5/§10.4)** — 2026-08-02. ⚠️ **The 2026-08-02 per-language
  volume ratios this entry used to quote are deleted rather than corrected** — they were four weeks
  stale, and a ratio without its reference is not a measurement (W-5.6). `LAUNCH_READINESS.md` §10.4
  publishes the live ones with their references.
- **Blindspot register: §10.2 Dalio de-branding and §10.3 parent-facing kids framing** — 2026-08-01,
  verified by the weekly review. **§2.3 Markets-tab stale date** — 2026-08-02. **§10.1
  investment-advice adjacency, fully closed 2026-08-02**: the "be bullish when cutting / be cautious
  when hiking" directive and lesson 10's rendered per-phase "Best investments: growth stocks / value
  stocks / …" lines were reworded to historical, descriptive framing in all five languages; the
  `disclaimer` key now renders on Home, Learn, Markets and About; and a one-time first-launch modal
  (`ecycles_seen_disclaimer`) shows it before first use. ⛔ **All of these are standing rules, not
  settled history** — check any content change against them.

## Environment note

⛔ **`git write-tree` can silently produce a PARTIAL tree, because a concurrent run can leave the
index EMPTY. Verify the tree's file count before `update-ref`.** Happened 2026-09-07 and it produced
a commit recording **145 deletions** out of 145 tracked files. The sequence: the owner's market-data
job committed `1dc747a` mid-run, and the index was left with **0 entries**; `git add` of three files
therefore built an index of exactly three; `git write-tree` faithfully wrote a three-file tree; and
`commit-tree` recorded everything else as deleted. **Nothing in that chain errors** — each command
did precisely what it was asked, and `git status` beforehand looked normal because it compares the
working tree, which was fine.
**The guard costs one line, and it goes between `write-tree` and `update-ref`:**

```bash
TREE=$(git write-tree)
git ls-tree -r "$TREE" --name-only | wc -l     # must match `git ls-files | wc -l` at HEAD
git diff --stat HEAD "$TREE"                    # must show ONLY your files, and no deletions
```

**Recovery, if it already happened** (non-destructive — neither command touches a working-tree
file, and every file is still on disk): `git update-ref refs/heads/main <good-sha>` then
`git read-tree <good-sha>`. Confirm first with a content-hash comparison rather than by assuming —
`git rev-parse <good-sha>:<path>` against `git hash-object <path>` for every tracked file said 142
of 145 identical and the 3 differing were exactly the intended edits. ⚠️ **Both commands may be
refused by the permission classifier**; that is a stop-and-ask, not something to work around.
⚠️ **`git commit-tree -F <file>` for anything long** — a heredoc'd message in the command itself
hits zsh's argument limit ("command too long") and the commit silently does not happen.

**Node: run the script, do not read a claim about the machine.** `scripts/bootstrap-node.sh`
prints the `bin` directory to put on `PATH` and works on either kind of machine — it uses a system
Node when one is installed that Vite accepts, and otherwise downloads and caches a pinned v20.18.1
under `$HOME/.cache/ecycles-node` (real home, so it persists across runs unlike the session
scratchpad). Never installs anything system-wide, never touches the repo.

```bash
BIN_DIR="$(scripts/bootstrap-node.sh)"
export PATH="$BIN_DIR:$PATH"
npm install && npm run build
```

Add `--force-download` (or `NODE_BOOTSTRAP_FORCE=1`) to ignore a system Node and pin to v20.18.1.

⚠️ **This paragraph used to assert the machine had no Node at all, and that is why it now asserts
nothing.** It was confirmed true on 2026-08-01, was false from 2026-08-22, and stayed in the note
every run reads first for 15 days, sending each run to download a second runtime it did not need.
Fixed 2026-09-06 by moving the question into `bootstrap-node.sh`, which re-measures it on every call.
⭐ **The class: a fact about the environment written in prose has no way to notice the environment
changing.** It was filed three times — the 2026-08-30 weekly review, then two run-log notes — and
each filing restated it instead of ending it.
⛔ **And it has now happened a second time, to the correction itself (measured 2026-09-07, the
owner-directed environment audit).** The replacement paragraph carried its own dated inventory —
*"`node` **v26.7.0** … `brew` present"*, measured 2026-09-06 — and **not one of those items
describes the machine this ran on a day later**: `node` is **v24.18.0**, `/usr/local/bin/node` is a
root-owned universal binary dated 2026-06-23 (the official installer, not a Homebrew symlink), and
`brew` is **not found at all**. **Whether that is a second machine or the same one changed does not
matter** — which is the point: a prose inventory cannot tell those two apart, and a run that trusts
one is wrong either way. **The mechanism held perfectly through it**: `scripts/bootstrap-node.sh`
printed `/usr/local/bin` and *"Using system Node v24.18.0"* on the first call, with no edit. **So the
inventory is deleted rather than corrected a second time** — run the script; it is the only thing
here that has never been stale.

**Measuring against a clean tree while the owner's is dirty — `git archive`, never `git checkout --`
(2026-08-18).** `npm test` runs against the *working* tree, so while the owner has an in-flight redesign
the suite can be red for reasons that have nothing to do with your change, and you cannot tell the two
apart by reading the failure. The control is a pristine copy of `HEAD`, which is read-only with respect
to the repo:

```bash
npm run clean-tree                  # git archive HEAD — §26's filesystem fallback
npm run clean-tree -- --clone       # real git clone   — §26's primary git-index path
npm run clean-tree -- --ref <sha>   # any commit-ish; archive mode also takes a tree-ish
```

⛔ **THE RECIPE IS NO LONGER WRITTEN DOWN — `scripts/clean-tree.sh` IS the recipe (2026-09-06,
owner-directed), and this note must never restate its steps again.** It was five lines of prose here
for six weeks and it was **wrong twice**: it carried a `cp economic-cycles-v*.jsx` step deleted from
one copy of the recipe and not the other (the only known way to make this suite fail on a clean
tree — it makes six §26 `path-ok` markers resolve, so all six report *stale* and the count lands at
13 against 20), and once that was fixed the surviving block still did not run, because `$SCRATCH` was
used in three code blocks here and defined in none and `tar -x -C` does not create its destination.
**Both were found by executing the prose, and neither by reading it.** The script cleans up after
itself on success and **keeps the copy, with its path, on failure**, so a red run can be read where
it happened.

**⚠️ UPDATED 2026-08-30 (W-6.1, route (c)): do NOT copy the prototypes in any more.** This recipe used
to carry a third line, `cp economic-cycles-v5.jsx economic-cycles-v6.jsx "$SCRATCH/head/"`, because
`git archive` ships only tracked files and §26's doc-path check then reported **7 failures** naming
them. **§26 no longer resolves against the filesystem**, so those seven are exemptions now and the copy
is not merely unnecessary — it is actively harmful: it would make the two paths resolve in the copy and
their `path-ok` markers fail as *stale*, which is the same "control that fails for its own reasons" trap
wearing the opposite face. The `node_modules` symlink IS still load-bearing, and was also found by the
control failing rather than by reading: `check-data.mjs` reaches `src/lib/deepLink.js`, which imports
`react`, so a copy without it dies with `ERR_MODULE_NOT_FOUND` — the scripts are *not* dependency-free,
whatever their imports look like at the top. With that one line, the `HEAD` copy runs the full suite to
**exit 0**. That gives a two-sided answer: **red on the working tree and green on the `HEAD` copy means
the owner's dirt caused it; red on both means you did.**

✅ **BUILT 2026-09-06 the same day it was filed, owner-directed ("do the `npm run clean-tree` script
too").** The note below declined it under W-6.2 rule 3 and W-6.3; **the owner overrode that, and the
decline is kept rather than deleted because the reasoning was sound and the call was not a run's to
make.** ORIGINAL NOTE:
> ⚠️ **A note, not a numbered item (W-6.2 rule 2): the durable fix for this class is to stop writing
> the recipe down.** It has now been wrong twice — the `cp economic-cycles-v*.jsx` line that survived
> in W-6.1 after being deleted here, and the two missing lines above — and each time a run paid for it
> with a lost baseline. Five lines behind `npm run clean-tree` (`mktemp -d`, archive, symlink, `npm
> test`) cannot drift from what runs, because it *is* what runs. **Not built 2026-09-06, deliberately:**
> W-6.2 rule 3 asks for the learner-visible failure a new check would have caught, and there is none —
> this is a process defect, and `scripts/` is 2.17x the app it measures (W-6.3). It is written here so
> the next run that reaches for it is choosing, not re-deriving.

**A `git archive` copy is not a git repo, and §26 knows.** It falls back to the filesystem walk there,
which is correct *in that copy specifically* because an archive contains precisely the tracked set —
but only while nothing untracked is copied in, which is the whole reason the `cp` line above had to go.
If you need a control that exercises §26's PRIMARY path instead, use `npm run clean-tree -- --clone`;
a clone is a git repo, so it resolves against the index the way the owner's tree does. Used to prove
`refresh-readiness.mjs`'s failure was the owner's new third lesson track and not a regression — see
backlog item 77.

**"Has the owner's tree moved since the last run?" is now one command: `npm run owner-tree`
(2026-08-19).** Eleven consecutive runs have opened by asking this, and every one of them answered it
with `git diff --shortstat` — which cannot actually answer it, since a shortstat can coincide across
genuinely different trees (a point the eighth run of 2026-08-18 raised and then still relied on).
`scripts/owner-tree.mjs` fingerprints the working tree's full deviation from `HEAD` — the tracked patch
plus the content of every untracked file — as one sha256:

```bash
npm run owner-tree                      # OWNER-TREE <sha256>  (N tracked modified, M untracked)
npm run owner-tree -- --expect <sha256> # UNMOVED (exit 0) / MOVED (exit 1)
```

**Record the fingerprint your run observed in your run-log entry**; the next run compares with one
`--expect` and gets a real yes/no instead of a coincidence-prone stat. It **refuses to print** (exit 2)
if any untracked file is unreadable, and exits 2 rather than stack-tracing when run outside a git repo
(e.g. inside a `git archive` control copy). That refusal is the whole point and it is not theoretical:
the first, hand-rolled version of this check on 2026-08-19 piped `git status --porcelain` through
`sed 's/^?? //'`, which leaves git's quoting attached to the 50+ `UIUX/` paths that contain spaces, so
**every** `shasum` failed on a nonexistent filename — and the pipeline still emitted a confident 64-hex
digest, of an empty stream. Hence `-z` internally, and hence the hard failure.

**⚠️ `MOVED` does not mean "the owner's redesign landed" — check WHICH file moved before deciding
anything (2026-08-19).** The fingerprint covers the whole working-tree deviation, so anything the
owner is *not* responsible for is inside it too. The live case: `public/data/market.json` is rewritten
by the `economics-app-market-data` job **every weekday after close**, i.e. *underneath a running
session*. This date's fourth run read `UNMOVED 28365ead…` at commit time and `MOVED fd6fd235…` an hour
later, **with the same 26/57 file counts** — the only difference was `asOf: 2026-08-18 → 2026-08-19`
and 62 lines of numbers. A run that takes `MOVED` at face value concludes the owner's tree landed and
picks the five `LAUNCH_PLAN.md` items, which are still blocked. **On `MOVED`, run `git status --short`
and diff the named files first**; a move confined to `market.json` is the daily job, not the owner.
That particular instance is now closed — `market.json` was committed on its own the same day (see the
run log), so it has left the deviation set — but the class has not: any file a sibling automated task
touches will do this again.

**A piped `git show ... | wc -l` can silently lie here — write the blob to a file and measure the file
(2026-08-18).** Several compound Bash commands this run died with **exit 138** partway through, and the
damage is not that they failed: it is that they printed *plausible* partial output first. The same
measurement, run twice, gave `glossary.js` at `HEAD` as **72 lines** and then **235**; a `for` loop over
four commits reported 321/440/263/235 for a file that is 72 lines. Nothing errored, and each individual
number looked like a real answer. **What is trustworthy:**

```bash
git rev-parse HEAD:src/content/glossary.js       # blob id — authoritative, no content streamed
git diff --stat <revA> <revB> -- <path>          # empty output == identical, no pipe involved
git cat-file blob HEAD:<path> > "$SCRATCH/f"     # then wc -l / diff the FILE, not a pipe
```

Two blob ids being equal settled in one command what four rounds of `git show | wc -l` had contradicted
themselves about. **The reason this is in the Environment note and not just a run-log line is that it
defeats step 3.5 exactly the way the dark-mode DOM scan did**: a truncated pipe returns a clean-looking
number, so a run that "measured" something can be confidently wrong. It was caught only because the
control (diff the saved copy against the commit it was taken from, expect *only* the known addition)
came back with 438 unexplained lines instead of 0. **Carry the control; when it fails, suspect the
instrument before the finding.**


**Browser visual verification — now possible, use this instead of assuming it can't be done.**
Every run-log entry since the JSX split began has a line like "did not visually verify — `preview_start`
can't spawn `npm run dev` because its process spawn doesn't see the bootstrapped Node in `PATH`." That
limitation is real (the browser-preview tool's process spawn uses a different, minimal `PATH` than the
shell `Bash` tool, so the `scripts/bootstrap-node.sh`-provided `node`/`npm` are invisible to it), but it
only blocks the **dev server** (`npm run dev`, which needs `node` to stay running as a process). A static
build does not have that problem, because `/usr/bin/python3` **is** on the browser-preview tool's `PATH`
(confirmed 2026-08-04) even though `node`/`npm` are not. Workaround, verified working end-to-end
2026-08-04:

```bash
BIN_DIR="$(scripts/bootstrap-node.sh)"
export PATH="$BIN_DIR:$PATH"
npm run build                                    # produces dist/
(cd dist && nohup /usr/bin/python3 -m http.server 8763 --bind 127.0.0.1 \
  > /tmp/ecycles-static-preview.log 2>&1 & disown)
```

Then call the browser-preview tool's start action with a plain `url` (`http://127.0.0.1:8763`) rather
than a `name` — passing `url` opens a browser tab directly at that address and does **not** go through
`.claude/launch.json` or spawn any command, so the `PATH`-visibility problem never comes up. No changes
to `.claude/launch.json` are needed or were made; the existing `npm run dev` entry there is unaffected
and still won't work in this sandbox.

**This works in unattended scheduled runs, not just interactive sessions — confirmed twice, and do not
re-derive it as impossible.** A 2026-08-15 scheduled dev-agent run (tenth run that date) tested the
then-standing "`preview_start` is disabled for scheduled tasks" assumption instead of inheriting it, found
it false, and did the first live keyboard/DOM verification by an automated run. The 2026-08-16 **weekly
review run** independently re-confirmed it: `npm run build`, `python3 -m http.server 8791` against `dist/`,
`preview_start` with a plain `url` (returned `navOk: true`), then drove the live app through
`javascript_tool` — dismissed the first-launch modal, opened Reference → Glossary, opened a term-detail
view, toggled its bookmark and read `localStorage` back, and exercised the no-results empty state.
Nevertheless the 2026-08-16 ninth and tenth runs *both* asserted "`preview_start` is unavailable to
unattended scheduled runs," deferred verification to "a future interactive session," and shipped six UI
features unverified. **That assertion is false. If a UI change needs verification, try the technique above
and report the actual error if it fails — do not assert the limit from memory.** See the 2026-08-16
weekly review's W-1.

**What this verified in practice (2026-08-04, interactive session, not an automated dev-agent run)**: the
built app boots, first-open routing lands on Lesson 1 with the first-launch disclaimer modal, the `More`
sub-nav and kids age-selector switch panels correctly with the right live `aria-selected`/`aria-controls`/
`aria-labelledby` wiring (checked via the browser tool's JS-eval action, not just eyeballed), and the
quiz flow renders the WCAG-contrast-fixed green correct-answer text. This is the first time any run —
automated or interactive — has gotten a real rendered/DOM-level check in this sandbox, as opposed to
build-success-plus-code-review. **Future dev-agent runs should use this static-build-plus-python-server
technique for visual verification instead of writing another "could not visually verify" caveat.** The
server is not persistent infrastructure — it's started fresh, points at whatever `dist/` was just built,
and doesn't need to be torn down deliberately (it's a plain background process against a throwaway port,
not something committed or relied on between runs).

**`read_page`'s accessibility tree shows `aria-label` names but NOT `aria-labelledby` names — and
every `<section>` prints as `region` whether or not it is named (2026-08-20).** Two separate traps in
one instrument, both found while verifying backlog item 82, and both of the "returns a clean-looking
answer that means nothing" family this section keeps warning about.

- **A bare `<section>` still prints as `region`.** Stripping `aria-labelledby` from all three Learn
  track sections in the live DOM left the tree **unchanged**. So `region` appearing in `read_page` is
  no evidence that a landmark is named, and a run that "verifies" a landmark fix that way has verified
  nothing.
- **`aria-labelledby` names do not print.** Calibrated rather than assumed: injecting
  `aria-label="ZZPROBE"` onto a section printed `region "ZZPROBE"`, so the tool does compute names —
  but a section named via `aria-labelledby` printed as a bare `region`. The check that this is the
  tool and not the app: `App.jsx`'s `tabpanel aria-labelledby={`tab-${tab}`}`, verified correct by
  earlier runs, **also** prints unnamed.

**So for any `aria-labelledby` work, verify at the DOM level** — that the attribute is present, that
`document.getElementById(...)` resolves it, and that the target carries the expected text — and say in
the run log that the a11y-tree instrument could not confirm it. Do not report "confirmed in the
accessibility tree" for a name this tool cannot render.

**If you measure geometry, resize the viewport first — `getBoundingClientRect()` returns zero-width
boxes otherwise (2026-08-17).** The `Viewport: 0x0` condition described below is not only a `read_page`
/screenshot problem: it makes **layout measurement silently meaningless** while everything else keeps
working. On a fresh `preview_start`, `window.innerWidth` and `document.body`'s width both read **0**,
so every `getBoundingClientRect().width` is 0 or near-0 — and nothing errors, so a run that measures an
element's shape gets plausible-looking JSON that means nothing. Clicks, `innerText`, `aria-*` and
`getComputedStyle` are all unaffected, which is exactly why this is easy to miss. **Fix: call the
browser tool's resize action with the `mobile` preset (375x812) before measuring**; widths become real
immediately (confirmed this run — the same element went from `w: 0` to `w: 309`). Sanity-check
`window.innerWidth > 0` before believing any measurement.

**Browser-tool click/screenshot unreliability, seen across multiple runs (2026-08-04 through 2026-08-07)
— when this happens, stop trusting `computer` and drive the DOM directly.** Several runs have hit the
`computer` tool's screenshot action returning a blank/black frame, and `read_page` reporting
`Viewport: 0x0` even though the page genuinely has content at a real size (confirmed via
`window.innerWidth`/`innerHeight` in `javascript_tool`). When that happens, coordinate-based `computer`
clicks land on the wrong element — the fifteenth run (2026-08-07) accidentally answered a quiz question
wrong this way before catching it via `aria-checked` inspection. **The reliable fallback**: do everything
through `javascript_tool` — find the target element via `querySelectorAll`/`textContent` matching, call
`.click()` on it directly (this does work; React's synthetic event system does receive a real DOM
`click()` dispatch), and confirm the result by re-reading `document.querySelector('main').innerText` or
an `aria-*` attribute afterward, **not** by the immediate return value of the click call — a real click's
effect can take one extra tool round-trip to show up, so checking too early reads as "nothing happened"
even when the click worked. For a native `<select>`, plain `el.value = "x"` does not notify React; use
`Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(el, "x")` followed by
`el.dispatchEvent(new Event("change", {bubbles: true}))`.

**The `computer` tool's `key` action (real Enter/Space keypresses) does not reliably activate elements in
this sandbox — confirmed 2026-08-18, and this is a tooling gap, not an app bug. Check it this way before
concluding either.** Sent a real `Return` keypress via `computer` at a focused `<div role="button"
tabIndex={0}>` (a Glossary term row, whose `onClick`/`onKeyDown` are both explicit React handlers) and
separately at a focused native `<button>` (TermDetail's "Back") — **neither activated**, confirmed by a
screenshot showing the pre-press screen unchanged. Before concluding the app doesn't handle keyboard
activation, dispatch a **fully-specified synthetic event** instead: `new KeyboardEvent("keydown", {key:
"Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true})` via
`element.dispatchEvent(...)` in `javascript_tool`. On the custom `role="button"` div this **did** fire
the app's own `onKeyDown` handler (the state change showed up one round-trip later, same timing note as
above) — proving the app's keyboard handling is correct and the gap is specifically in how `computer`'s
key action reaches the page here. A native `<button>`'s Enter-activates-click is a browser default action
tied to a *trusted* event, which no `dispatchEvent` call (synthetic, however fully-specified) can
trigger — that one has no app-level logic to verify at all, so don't spend a round-trip trying to
`dispatchEvent` an Enter into a native button; use `.click()` directly, which is equivalent for
verification purposes since the app cannot observe the difference. **Net rule: for a custom interactive
element's keyboard handling specifically, verify with a fully-specified `dispatchEvent`, not `computer`'s
`key` action; for anything else, `javascript_tool`'s `.click()` remains the reliable path already
documented above.**

**Two harness facts about driving the sweep, both learned the expensive way 2026-08-28 (items
135/124).**

- **FRONT THE TAB BEFORE ANY TIMED LOOP — a hidden preview pane throttles `setTimeout` to ~1s.** A
  loop over 13 lessons with a 320ms wait between them timed out at 30s, twice, and the tool reported
  "the Browser pane is currently hidden... the pane may be stuck". It was not stuck: the page was
  alive and had reached lesson 37. Background tabs clamp timers, so every 250-320ms wait silently
  became a second. `tabs_select` on the tab first, then batch 4-5 navigations per call, and the same
  loop finishes well inside the limit. **A timeout here reads exactly like a hang and is not one.**
- **You cannot plant a defect by writing an inline style onto a REAL React component's element — it
  reverts, and it reverts silently.** Setting `bar.style.height` (even with `!important`) on
  `AsymmetryChart`'s bar read back unchanged one call later, because React owns `element.style` and
  rewrites it on the next commit. Worse, *clearing* one — `el.style.height = ""` — does not restore
  the app's value, it removes React's own, so the "restore" leaves a different defect behind. **Two
  consequences:** plant into a SYNTHETIC element carrying the same hooks (the selftest's own
  technique) rather than into a live component, and **restore by reloading the page**, never by
  clearing the property. A live-DOM plant that you cannot cleanly undo is a plant you must not leave
  the session holding — reload and re-measure zero before reporting anything clean.

**The live accessibility sweep is a checked-in file now — `scripts/a11y-sweep.js` (2026-08-25, item
105). Do not re-derive it, and do not hand-roll a one-off DOM scan.** Every section of
`check-data.mjs` reads source text, so the whole class of *composition* defects — where every
attribute is individually correct and the browser's computed tree is still wrong — is invisible to
`npm test`. That class is not hypothetical: it is what items 102 and 103 were. Load it the way it was
verified, which also proves the checked-in file is the thing that ran rather than a retyped copy:

```bash
cp scripts/a11y-sweep.js dist/            # dist/ is gitignored; the static server already serves it
```
```js
// then, in javascript_tool, one call each:
fetch('/a11y-sweep.js').then(r => r.text()).then(src => eval(src))
A11ySweep.selftest()   // RUN THIS FIRST — see below
A11ySweep.run()
```

**`A11ySweep.selftest()` is not optional, and it is the reason this file exists rather than a snippet
in a run-log entry.** It plants one known defect per probe, asserts each probe *finds* its plant, then
removes the plants and confirms they are gone. A sweep whose selftest has not passed **this session**
proves nothing — step 3.5's "carry a control", encoded into the instrument instead of left to the
operator to remember. It has already earned this twice on its first day: it caught a broken
expectation in its own `smallTargets` control (a planted `10px` button renders **16x10**, because UA
padding and min-content width beat the declared width — so a control keyed to exact geometry fails for
its *own* reasons), and breaking the layout gate on purpose exposed that `check-data.mjs` §43 printed
its reassuring summary line **alongside its own failure**.

**The four ways this harness produces a lying zero — all measured. The sweep itself encodes 1-3;
4 is the operator's and no script can catch it, which is why it is written out here:**
1. **Layout is not live.** On a fresh `preview_start`, `innerWidth` and every `getBoundingClientRect()`
   read **0**, so geometry probes return zero findings because nothing has a size. **Taking a
   screenshot forces layout** — that is the fix, and the sweep hard-gates on it and prints `REFUSED`
   rather than a clean-looking report.
2. **Focus events never fire.** `document.hasFocus()` is `false` and `visibilityState` is `"hidden"` in
   this pane **even when the tab is fronted and the page is demonstrably rendering**. Measured with a
   native listener as the control: a real `focus` listener on a real button recorded **zero** events
   across separate calls while `document.activeElement` was correct throughout. **So
   `activeElement` assertions are trustworthy here and anything built on focus/blur EVENTS is not.**
3. **Reading in the same call that clicked.** React commits asynchronously; a same-call read returns
   the previous render. Click in one call, read in the next.
4. **The browser is running the PREVIOUS build.** Added 2026-08-25 after it produced one false
   negative. `python3 -m http.server` serves `index.html` with a `Last-Modified` the browser is happy
   to reuse, so a rebuild changes the hashed asset name while the page keeps loading the old one — a
   post-change check then measures pre-change markup and reports the fix missing (or, worse, reports
   a pre-existing defect absent). Navigating with `force: true` does **not** clear it; `?cb=N` on
   `index.html` does. **Read the bundle name back before trusting any live result:**
   `[...document.querySelectorAll("script[src]")].map(s => s.src)` must match the filename `npm run
   build` just printed.

**A correction worth carrying, because item 105 specified the opposite.** The item asked for the gate
`document.hasFocus() && document.visibilityState === "visible"`. Both are permanently false in this
pane (see 2 above), so that gate would have **refused to report anything, forever** — the same
silent-zero failure wearing the costume of a safety check. The implemented gate is **per-capability**:
hard-gate on live layout, which is achievable and provable, and mark only the focus-event-dependent
probe `UNAVAILABLE`. A probe that scanned nothing reports `VACUOUS`, never `ok`.

**Reporting convention for run-log entries.** Quote the verdict line plus the two numbers that make a
zero meaningful: `selftest PASS (8/8 controls fired, plantsRemoved true)` and, per screen, `N
finding(s); V vacuous; U unavailable`. A bare "no accessibility issues found" is not a result.

### The Browser pane cannot answer a modality question, and it fails at it SILENTLY (2026-09-08)

**Measured, after a run reported a ring as "reasoned, not measured" and the owner asked for the real
walk.** The pane is frequently **hidden** (`tabs_context` says so; `tabs_select` does not un-hide it,
and nothing exposed to a run does). In that state:
- `document.hasFocus()` is **`true`** while `document.visibilityState` is **`hidden`**.
- `computer key Tab` returns **`pressed Tab x1`** — a success string — and **focus does not move.**
  Verified against a seeded, still-focused row. A hidden document does not perform sequential focus
  navigation.
- Draw-waiting actions (`left_click`, scroll, hover) **time out** with a clear error. Keys do not.
  ⛔ **Do not generalize from the timeout to "no real input works"** — that was the wrong inference
  the first time, and it is the more dangerous direction: a timeout tells you it failed, a delivered
  keypress that moves nothing does not.
- Consequence: **`:focus-visible`, focus order and `:hover` cannot be measured in the pane.**
  Programmatic `focus()` is all a run can do there, and `:focus-visible` correctly does not match it,
  so the pane will report "no ring" for a page whose ring is fine.

**The instrument that does work, and it needs nothing committed.** Real Chrome is on this machine at
`/Applications/Google Chrome.app`. Install `puppeteer-core` **into the session scratchpad, never into
the repo**, point `executablePath` at that Chrome, and drive the same statically-served `dist/`:

```bash
cd "$SCRATCHPAD/kbwalk" && npm init -y && npm install puppeteer-core
# executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```
`page.keyboard.press("Tab")` performs genuine focus navigation and sets keyboard modality;
`page.mouse.click()` sets pointer modality. ⭐ **Run BOTH and report both** — a modality claim with
only the keyboard walk is unfalsifiable. The pair that means something is keyboard →
`:focus-visible true` + a painted outline, mouse → `false` + `none`, on the same element after the
same journey.

## Run log

### 2026-09-08 (scheduled dev-agent, backlog item 155 — the previous scheduled run's residuals were both OWNER actions, so this pick was free) — the overflow probe this repo has shipped since August cannot see text overflow, and the ad-hoc probe that keeps finding the defects has evaporated into a session scratchpad four times in ten days

**The pick.** Item 155 has been open since 2026-08-30. It is the only open item whose class has
produced **four live defects in the last ten days** — the Reference hub's headings clipped mid-word
at 200%, the lesson reader's "Completar" button off the right edge at 320px, `MarketSignals.jsx`'s
bare `1fr` grid clipping a quarter of a screen, and seven `ja`/`zh` elements clipping their
fullwidth brackets — and **every one of the four was found by a probe pasted into a browser console
that then vanished with the session.** W-6.2 rule 3's sentence writes itself here, which is why this
was worth a run rather than a note.

**Step 3.5 — three premises re-measured on the built app, two confirmed and ONE REFUTED. The
refutation shrank the change.**

*(1) Confirmed, and sharper than the item filed it.* The item says a right-edge scan "is not
sufficient". Measured with an 80px box holding one long unbreakable word planted live at 320px:
- **clipped by an ancestor — the app's normal case:** `documentElement.scrollWidth` stays
  **320 === clientWidth**, so `horizontalOverflow`'s gate never opens and its element scan never
  runs. It reports **exactly zero** while **363px** of text sits in an **80px** box.
- **not clipped:** the gate opens and the probe names **seven** elements — the whole bottom nav and
  its children, sized to a document the plant widened — and **never the plant itself**, whose border
  box ends at **304px** against a 321px limit. ⭐ **It does not merely miss the defect; it fires at
  the symptom and names innocent elements.** That is not a new shape: item 155 already recorded the
  bottom nav reported past the viewport while the real defect was the lesson reader's button row.

*(2) Confirmed — all four exclusion classes exist on this app and were measured, not reasoned:*
16 phantom SVG `<text>` findings on the Market Dashboard ("Peak" 17px box / 43px scroll, "Trough"
25/120); Learn's sr-only "Current lesson" span at **scrollWidth 90 against a 1px box**, the first
thing an unexcluded probe finds; the header's brand text, **224px of content in a 42px box**,
ellipsised on purpose; and the parent guide's age-band rail at **424 against 288**.

*(3) ⛔ **REFUTED, and this is the one that changed the disposition.** The item says the
scrollable-ancestor exclusion "applies to the BOX probe too, not just the text probe", and cites the
age-band rail reporting 440px "as a false positive **on every run at 200%**". **It is not.** Run at
320px/200% on that screen, the shipped `horizontalOverflow` returns `status: ok, findings: []` —
because its element scan is gated on `documentElement.scrollWidth > clientWidth`, the rail is
clipped, the document does not scroll, and **the scan never runs at all.** The exclusion is required
for the **new, ungated** text probe and for nothing else. **So `horizontalOverflow` was left
untouched** — the item would have had me "fix" a probe whose gate already protects it, which is the
2026-09-07 favicon shape one week later.

**What shipped.** `scripts/a11y-sweep.js` gains a 12th probe, `textOverflow` (+114 lines, one file,
purely additive; nothing under `src/` touched). It reads `el.scrollWidth > Math.ceil(box) + 1` —
the element's **own** box, which is the only measurement that names the element at fault — with the
four exclusions above and a helper, `inScrollableBox`, deliberately not wired into
`horizontalOverflow` per (3).

⭐ **The deepest-element rule, and it is the part I would have got wrong by reasoning.** Overflow
propagates UP: **one planted leaf produced SEVENTEEN flags**, the leaf plus its whole ancestor chain
to `<main>`. Item 155 hit this from the other side and recorded the correction — a ja/zh sweep
reporting "6 flags in ja, 4 in zh" where the honest defect counts were **3 and 1**. The probe drops
any flagged element containing another flagged element and reports the leaf.

⚠️ **And the control had to be rebuilt twice, because the first two versions fired on their own
account.** Dropped into `<main>`, the plant produced **fourteen extra findings** across the Learn
cards that were not there a moment earlier — sibling boxes re-sizing around a new flex item — with a
baseline of 0 measured immediately before. Wrapping it in `overflow:hidden` so it could not widen the
document (`scrollWidth` back to 320) **did not fix that.** Only taking it out of flow entirely did:
`position:fixed` far offscreen, the file's own plant idiom. **A control that perturbs the app it is
measuring proves nothing**, and the two failed versions are written into the plant's comment so the
next person does not re-derive them.

**Verification — 10 screen readings, all `ok`, none vacuous, zero findings, at 320px / 200% root
font** (browser text zoom, which is the real WCAG 1.4.4 axis; the app's own control caps at 130% and
silently falls back to 100% if you write `2` into its localStorage key — measured, and worth knowing
before anyone reads a 200% figure off that route). `en`: Learn 149 elements, Practice 42, Reference
hub 54, Glossary 328, Sector performance 153, Kids 74, About 40. `ja`: Reference hub 54, Market
Dashboard 175, lesson reader 85. **Every screen label was asserted against the rendered `<h1>` before
its reading was kept** — two navigations silently did not happen during this run (a `history.back()`
landed on a lesson reader while I had labeled the reading "About"), and both were caught that way
rather than reported.
**The zeros are readings, not a dead instrument:** the planted control fired in the `ja` /
Market Dashboard / 200% / 320px context itself, `plantsRemoved: true`,
`appFindingsAfterCleanup: 0`. **And exclusion 4 is doing work rather than describing an absent
element** — on the Kids screen the rail is present and would flag (`scrollWidth 424 > box 288`,
`wouldFlag: true`) while the probe reads clean.
⛔ **What is NOT claimed:** three screens (en lesson reader, en Market Dashboard, en Kids) were swept
with the prototype before the exclusions were final, and the term-detail, mid-session Practice, quiz
and first-run-dialog states were not swept at all. `focusVisibleOnTab`'s control did not fire this
session and did not before my change either — it is the documented operator step (one real `Tab`
into the pane), unrelated to this work, and I verified it failed identically on the pre-change file.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **20,970** lines vs app code
(`src/` minus `content/`+`locales/`) **9,252** — **2.27x**, up from the 2.24x measured 2026-09-07.
This change is **+114 lines to `scripts/` (+0.55%) and 0 to `src/`, so it moves the number the wrong
way**, and the honest defense is not the size: it is that four defects in this class shipped or were
caught in ten days, and the instrument that caught each one was thrown away immediately afterwards.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found.** Nothing under `src/` was touched — the diff is one file in
`scripts/`, 114 insertions and **0 deletions**. No lesson prose, quiz, glossary, market copy or
learner-rendered date changed; no Dalio-adjacent content, no advice language, no child-facing
framing. `npm run check-blindspot` **exit 0**, read from the process exit code. The `2026-09-08`
dates I wrote are in code comments recording measurements — this project's convention, not the
Markets-tab class of a date rendered to a learner.
**DECISIONS.md conflict: none.** `localStorage`-only state, `.js`-not-JSON content and Vite-not-Expo
are all untouched. The one it could have been is item 12's port-cost rule on adding a headless
browser: **I did not.** The file stays a zero-dependency script pasted into a browser, exactly as its
own header describes, and is still deliberately outside `npm test`. `grep -in "headless|a11y-sweep|
puppeteer|playwright" DECISIONS.md` returns nothing.
**Already-done: no.** `grep -ic "textoverflow"` over `AGENT_LOG.md` and `DECISIONS.md` returns
**0 and 0** — no run has built or pruned this probe before.
**My own verification claim, weakest part first:** ⚠️ **the live sweep is the half an independent
reviewer cannot reproduce from my commands alone** — it needs a build, a static serve of `dist/` and
a browser pane, and its numbers are readings of a rendering rather than of the tree. What does
reproduce exactly, from the exit codes and not from a grep count: `npm test` **exit 0, 0 failures,
4 warnings**, `npm run build` **exit 0**, `npm run check-blindspot` **exit 0**. ⚠️ I initially read
`npm test`'s result through `| tail` and got an **empty** exit code — the environment note's own
pipe trap — and re-ran it writing to a file to read `$?` directly; the exit 0 above is from the
second run. **`check-data.mjs` §43 is the reproducible guard on this change specifically**: it
requires every `needs: "layout"` probe to carry a planted control, and its line moved from 11 probes
to **"12 probe(s) declared (11 layout-gated, all with planted controls)"** — verified by re-running
its own probe-table regex against the pre-change file (11) and the post-change file (12), rather than
by trusting the printed sentence.
**Backlog bytes (W-7.2 rule 1 + rule 5):** item 155 closed and was **replaced by its conclusion, not
annotated with one** — **9,568 b → 2,242 b, −7,326 b.** W-7.2 rule 5's standing number,
measured by `check-log-size.mjs` this run and not retyped from the block: the backlog is
**413,234 b**, against the **425,473 b** it stood at when W-7 was written — **12,239 b under**.

### 2026-09-08 (scheduled dev-agent, backlog item 74 — gated since 2026-08-17 on "do not pick before a deploy exists", and a deploy now exists) — `npm test` has been saying "on the live site, for anyone who opens it" about a file on disk, and the live site's market data is current by coincidence rather than by ownership

**The pick, and why not my own previous run's residual.** The last run closed item 155 and left
unswept screens behind it; W-6.2's ⚠️ says file it, do not turn around and pick it. Item 74 was the
one open item whose **blocking condition changed underneath it**: it says in its own header *"do not
pick before a deploy exists — it is a maintenance problem for a site nobody has yet."* The site went
live 2026-09-05 and canonical on 2026-09-07.

**Step 3.5 — the item's headline premise is now FALSE, and re-measuring changed the disposition from
"build the missing rebuild automation" to "the automation shipped; the gap moved one step upstream".**
Item 74 said a deployed copy freezes at build time and **nothing owns the rebuild**, and recommended
*"cheapest real answer is probably not a script: connect the host to the repo."* Measured:
`.github/workflows/deploy-pages.yml` does exactly that — `on: push: branches: [main]`, build then
`actions/deploy-pages@v4`. **The item's own recommendation shipped on 2026-09-07.** Writing the
script it half-proposed would have duplicated a workflow that already exists.

⭐ **But the gap moved rather than closed, and this is the measurement worth keeping. The deploy
follows a PUSH, and nothing owns the push.** From `origin/main`'s reflog: pushes at **2026-08-26
00:15**, then nothing until **2026-09-07 22:06** — a **twelve-day gap**. The daily market refreshes
committed **09-01 18:31, 09-02 18:31, 09-03 18:31 and 09-04 18:31** all fall inside it, so the
scheduled job demonstrably **commits without pushing**; they reached the live host only when eight
owner-directed pushes went out on the evening of 09-07 for an unrelated reason. A dev-agent run is
forbidden to push. **So the live site's market data being current today is a coincidence.** Filed as
**O-5**, with the date it stops being one: the live site serves `asOf 2026-09-07` against
`STALE_AFTER_DAYS=4`, so **Sectors goes dark for every visitor on 2026-09-12** absent a push.

⛔ **And the defect that made this a run rather than a note — this repo's own test suite makes the
claim W-7.1 forbids, once per run.** `scripts/check-market-freshness.mjs` reads
`public/data/market.json` **in the tree** — it has no network code at all (grepped; its three
`fetch` hits are prose) — and then said, verbatim:
> *"Reference → Sectors is ALREADY rendering the unavailable state — on the live site, for anyone who
> opens it."*

That is a statement about a host, made from a file on disk, printed by `npm test`. Two more messages
in the same file made the same slide in miniature ("Sectors goes to the unavailable state on
{date}"). **W-7.1's rule is that a claim about the live site that is not measured against the live
site is a guess; this was the guess wearing the suit of a measurement.**

**Step 3.5, second premise — REFUTED, and it shrank the change.** I went in intending to add live
market-age reporting to `check-deployed.mjs`. It **already reports it**: line 425's `MARKET_DATA`
branch has printed `live asOf X, repo asOf Y` since the file was written, with a deliberate header
rule that the age *"is REPORTED and never fails the verdict."* So the missing piece was never the
fetch or the report — it was the **age arithmetic and the projection**, and the rule about not
failing was already decided and is kept rather than re-litigated.

**What shipped (two files, both in `scripts/`, 100 insertions).**
1. `check-deployed.mjs` computes the served file's age via `freshness()` and `STALE_AFTER_DAYS`
   **imported from `src/lib/useMarketData.js`** — the same single-definition discipline
   `check-market-freshness` already uses, so the threshold cannot drift from the app — and projects
   the date the live screen goes dark. It lands in a new **advisory channel** printed in all three
   verdict branches and deliberately kept out of `problems`, honoring the header's existing rule.
   A `--today` flag exists for the reason `check-market-freshness` has one, quoted from that file:
   *"a freshness check whose only test case is 'whatever day it happens to be' can only be proven on
   the day it fires."*
2. `check-market-freshness.mjs`'s three messages now say what they measured and name
   `check-deployed` as the owner of the live half, plus a scope note in its header.

**Five branches, five controls, all exercised.** The clock was moved with `--today`; the repo-vs-live
divergence was driven by editing **`dist/data/market.json`** — a gitignored build artifact, never
`public/data/market.json`, which is the owner's file — and `dist/` was rebuilt afterwards and
re-verified back at `asOf 2026-09-07`:
- **silent** at the real clock (live age 1d) — the negative control, and the one that matters most:
  a projection that fires every day is not a projection.
- **`--today 2026-09-11`** (age 4) → *"goes to the unavailable state on 2026-09-12 — tomorrow"*.
- **`--today 2026-09-12`** (age 5) → *"ALREADY showing the unavailable state ON THE LIVE SITE"*, and
  because repo and live agree it correctly says a redeploy will not fix it — the daily job must run.
- **repo ahead, both fresh** → the "not a defect, the deploy follows a push" line.
- **repo ahead, live stale** → *"The data exists; it just is not deployed. Push to `main`."*
  The boundary is exactly `STALE_AFTER_DAYS`: 4 → tomorrow, 5 → already dark.
⛔ **One branch is UNEXERCISED and I am not claiming otherwise:** the unreadable-`asOf` path needs the
live host to serve a malformed file, which I cannot arrange without touching the deployed site.

⚠️ **A separate finding, reported and NOT acted on (it is a different item's scope):** the
`index.html` comparison still prints *"identical apart from Netlify's injected tags"* against a
GitHub Pages site that injects nothing. The filters are documented as intentionally kept for the next
host, so the code is right and only the two verdict strings are stale. Left alone rather than
smuggled into this commit.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **21,067** lines vs app code
(`src/` minus `content/`+`locales/`) **9,252** — **2.28x**, up from the 2.27x I measured yesterday.
⚠️ **This is the SECOND consecutive run to add to `scripts/` and nothing to `src/`, and that is the
honest concern with this pick**, not its size (+100 lines, +0.5%). The defense is specific rather
than general: this is not a new instrument but arithmetic added to one that already fetched the file,
and it is paired with **deleting a false sentence** from a check that runs on every commit.

#### Step 5 — adversarial self-check
⛔ **`npm run check-blindspot` exit 0 is NOT evidence about this change, and saying so is the point.**
I checked what it scans before quoting it: `src/`, `README.md`, `index.html` and the v5 prototype —
**not `scripts/`**. So its green is true and irrelevant here. The real argument is stronger and
narrower: `git diff --name-only` returns **two files, both under `scripts/`**, nothing outside it, so
no string in this change can reach a learner. **A previous run of mine quoted this same exit code as
if it covered a `scripts/`-only diff; it did not.**
**DECISIONS.md conflict: none, and I checked the one it could have been.** The market-data decision
is that the app never calls a provider and reads a file the offline job writes — untouched; this
reads the *deployed copy of that file* over HTTP from a script, not from the browser. `localStorage`,
`.js`-not-JSON and Vite-not-Expo are all untouched.
**Already-done: no.** `grep -c "live age\|goesDark"` over `AGENT_LOG.md` and `DECISIONS.md` returns
**0 and 0**.
**A rule I could have broken and deliberately did not:** `check-deployed.mjs`'s header records the
decision that the market file's age *"is REPORTED and never fails the verdict — a guard that goes red
every day for an expected reason is a warning nobody reads."* The obvious version of this change
makes staleness a `problems.push`. That would have reversed a recorded decision to make my own output
louder, so the age is an advisory and the exit code is unchanged.
**My own verification claim, weakest part first:** ⚠️ **the advisory's real-clock silence is a
measurement of the world and will change** — on 2026-09-12 the same command starts printing the
already-stale line without anything in this repo changing. That is the instrument working, not a
regression, and it is written here so the next run does not read it as one. Reproducible from exit
codes, not grep counts: `npm test` **exit 0, 0 failures, 4 warnings**, `npm run build` **exit 0**.
`npm run check-deployed` exits **1** for the retired Netlify origin (O-4 action 2, owner's), which is
unrelated to this change and was exit 1 before it.
⭐ **And the branch my previous run recorded as unexercised has now fired, exactly as written.** That
entry said the `⚠️ canonical is serving HEAD but a retired origin is up` verdict *"will first run on
the day the Pages site publishes"*. It is the verdict `check-deployed` returns today.
**Backlog bytes (W-7.2 rule 1):** item 74 closed and replaced by its conclusion, **3,394 b → 2,739 b
(−655 b)**; O-5 costs **+1,848 b**. ⚠️ I first wrote both of those from arithmetic in my head (1,847 / net
+1,192) — item 70's defect, in the entry that closes an item about not retyping numbers — so the
figure that counts here is `check-log-size.mjs`'s own, not mine: **the backlog goes 413,234 b →
414,428 b, +1,194 b.** This run grew it, and I am not dressing that up as a reduction. It stays
**11,045 b under** the 425,473 b W-7.2 rule 5 measures against.

### 2026-09-08 (scheduled dev-agent, self-picked from a live walk — not a backlog item, and the item I went looking for turned out to be clean) — The one screen whose entire subject is market figures drops the "not advice" disclaimer in every state except the one where the data is fresh, and that is the state it stops being in on 2026-09-12

**The pick, and the two premises that died on the way to it.** My previous two runs both landed
entirely in `scripts/` and both said so as their own honest concern, so this run went looking for
learner-visible work in `src/`. Two candidate premises were measured and **refuted before any edit**:

1. **"`index.html`'s `href="/icon.svg"` is a root-absolute path that breaks on a GitHub Pages project
   site."** `vite.config.js`'s own comment says nothing in the app builds a URL from a hardcoded
   leading `/`, and `index.html` appears to contain two. **Vite rewrites it**: `dist/index.html`
   ships `href="./icon.svg"` and `src="./assets/index-<hash>.js"`. No defect. Do not re-derive this.
2. **"The four states item 155's new `textOverflow` probe never swept are where the next clip is."**
   Swept all four at **320px and 200%** — first-run dialog (`en`), lesson reader + end-of-lesson quiz
   unanswered and answered (`en`), mid-session Practice and its answered state (`ja`), glossary list
   and term detail (`ja`). **Zero findings, 8 readings, and the zeros are readings**: `A11ySweep.selftest()`
   fired the `textOverflow`, `horizontalOverflow` and `smallTargets` controls at the start in the
   `en` context and again in the `ja`/200% context, `plantsRemoved: true`, `appFindingsAfterCleanup: 0`,
   and the scans were non-vacuous (90 / 85 / 93 / 38 / 47 / 328 / 31 elements). **The class is clean;
   no check was built and none is due** (W-6.2 rule 3 — after an empty sweep the learner-visible
   sentence cannot be written honestly). ⛔ `focusVisibleOnTab`'s control did **not** fire, so nothing
   above is claimed about focus rings; that is the documented operator step and it failed identically
   for the previous run.

⭐ **What the walk found instead, and it is a §10.1 register instance rather than a layout one.**
Driving the Sectors screen through its non-success states: with `market.json` fresh the screen ends
with *"Educational content only — not personalized investment, legal, or tax advice…"*; with the same
build and `asOf 2026-08-25`, **the entire screen is one sentence about the data being too old and the
disclaimer is gone.** Same with the file returning 404. `Sectors.jsx` rendered `{t.disclaimer}` once,
at the bottom of the success branch, behind two earlier `return`s.

⛔ **This is not an exotic state.** `STALE_AFTER_DAYS` is 4, publishing follows a push that nothing
owns (O-5, filed by my previous run), and the live site serves `asOf 2026-09-07` — so **2026-09-12 is
the date on which this becomes what every visitor to Reference › Sector performance sees**, on the
screen whose entire content is market figures and investing vocabulary.

⚠️ **`npm run check-blindspot` was green through all of it, and it is not at fault.** Its §10.1
surface check greps each named file for the rendered string and prints *"disclaimer renders on all 8
surfaces §10.1 names"*. That claim is about **files**; a learner meets **states**. LAUNCH_PLAN.md
§10.1 already records that this exact file was the reason the guard matches the string rather than
the `<Disclaimer>` component — **and a grep for a string still cannot see which branch the string is
in.** A source check that could is a parser, not a regex, so the fix is structural rather than a new
guard: `Sectors.jsx` now has exactly **one** `{t.disclaimer}`, inside a local `ScreenFrame`, and all
three returns go through it.

**What shipped (one file in `src/`, 47 insertions / 10 deletions, plus the two records).**
`src/screens/reference/Sectors.jsx` gains `ScreenFrame` and loses the branch-local footer;
`LAUNCH_PLAN.md` §10.1 gains the state-vs-screen rule; `AGENT_LOG.md` gains **item 170**.

**Four states, measured before and after on the built app at 320px — and `dist/data/market.json` is
what was edited, never `public/data/market.json`, which is the owner's file.**

| state | how it was produced | before | after |
|---|---|---|---|
| fresh (`asOf 2026-09-07`) | shipped file | ✅ disclaimer, 11 sectors | ✅ disclaimer **×1**, 11 sectors |
| stale (`asOf 2026-08-25`) | `perl -i` on `dist/`, substitution count asserted `== 1` | ❌ **absent** | ✅ present |
| unavailable | `dist/data/market.json` moved away, `GET` → **404** | ❌ **absent** | ✅ present |
| loading | `window.fetch` patched to a never-settling promise for `market.json`, then Sectors remounted | (same `return` as the diff's first hunk) | ✅ present |

The before column for **stale** and **unavailable** was taken by rebuilding the **pre-fix** file out
of a scratchpad copy and serving it, not by reading the diff; the fixed file was restored with `cmp`
proving it byte-identical, and `dist/` was rebuilt afterwards with `cmp dist/data/market.json
public/data/market.json` proving the fixture is gone. ⚠️ **The loading row's "before" is the one
cell I did not measure** — it is the same early `return` visible in the diff's first hunk, and I am
recording that rather than implying a fifth measurement.

**Layout re-checked after the change, because the fix adds a node to three branches:** the fixed
stale screen swept in `ja` at 320px/200% — `textOverflow` 27 scanned / 0 findings, `horizontalOverflow`
0, `smallTargets` 0, with both controls re-fired in that same context.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **21,067** lines vs app code
(`src/` minus `content/`+`locales/`) **9,289** — **2.27x**, down from the **2.28x** measured
2026-09-08 by my previous run. ⭐ **`scripts/` +0, `src/` +37. This is the first run in three to move
that number the right way**, and it did so by fixing the app rather than by building an instrument
for it.

#### Step 5 — adversarial self-check
**Blindspot register: this change is IN the register, and it closes an instance rather than opening
one.** §10.1 is the entry; the change adds no prose a learner reads (the only new string is the
existing `t.disclaimer`, rendered in more states) and touches no lesson, quiz, glossary or market
copy. §10.2 (Dalio) and §10.3 (child-facing framing) are untouched — the diff contains no name and
no kids surface. The Markets-tab class is the one worth naming explicitly: **the dates in my new
comment (`2026-09-08`, `2026-08-25`) are code comments recording measurements, not a date rendered
to a learner** — the screen's own dates still come from `data.asOf` and `t.asOfTemplate`, untouched.
`npm run check-blindspot` **exit 0**, read from `$?`, and here it IS evidence: the diff is under
`src/`, which is what that script scans.
**DECISIONS.md conflict: none, and I checked the two it could have been.** The market-data decision
(app reads a file the offline job writes, never a provider) is untouched — no fetch was added or
moved. `localStorage`-only state, `.js`-not-JSON content and Vite-not-Expo are all untouched.
`ScreenFrame` is a local function component, so item 12's port-cost rule is not engaged: nothing was
added to `components/`, and no dependency exists that a native shell would have to replace.
**Already-done: no.** `grep -ic "ScreenFrame"` over `AGENT_LOG.md` and `DECISIONS.md` returns **0**
and **0**; item 79 is the closest prior work on this screen and it changed the stale *sentence*, not
what surrounds it.
**A rule I could have broken and deliberately did not:** the obvious tidy-up is to swap the raw
`<Text>` for the shared `<Disclaimer>` component. That would change a fact LAUNCH_PLAN.md §10.1
states in writing and alter the footer's padding for no learner benefit, so the markup is preserved
byte-for-byte and only its position moved.
**My own verification claim, weakest part first:** ⚠️ **the state table is a reading of a rendering
and an independent reviewer cannot reproduce it from a command list alone** — it needs a build, a
static serve of `dist/` and a browser pane, and two of its four rows required editing a build
artifact. What reproduces exactly, from exit codes rather than from grep counts: `npm test`
**exit 0, 0 failures, 4 warnings**, `npm run build` **exit 0**, `npm run check-blindspot` **exit 0**.
⚠️ **And the sharpest thing I can say against my own report: `check-blindspot` printed the same
green line before this change as after it.** That is not the fix being unverified — it is the
measurement this entry exists to record, and it is why no new check was written to "prove" the fix.
The proof is the four-row table and the fact that the file now contains one `{t.disclaimer}` that no
branch can bypass.
**Backlog bytes (W-7.2 rule 1):** nothing closed this run, so nothing was replaced by a conclusion;
item 170 is new and costs **+2,161 b**, measured by `check-log-size.mjs` and not by my arithmetic —
the backlog goes **414,428 b → 416,589 b**. This run grew it. It stays **8,884 b under** the
425,473 b W-7.2 rule 5 measures against.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (owner-directed: "do item 170 next", the day it was filed — second entry this date) — The app already decided that a quiz question carries the "not advice" notice; it just decided it on one of the two screens that render the same quiz component

**The pick was the owner's.** Item 170 was filed by my own previous run as the one instance of the
`Sectors.jsx` class it deliberately did not fold into that commit, because this one needed a decision
and that one did not. **W-6.2 rule 1 does not bind an owner-directed pick, and it would not have bound
this one anyway** — it names a run taking its *own previous run's* residual, and the previous run's
entire argument for filing rather than fixing was that the choice was not a run's to make. The owner
made it.

**Step 3.5 — the premise reproduces exactly, and the item's own three options do NOT survive contact
with a measurement it never took.**
The premise, re-measured on the built app at 320px in `en` with the queue overview as the control and
`t.disclaimer` as the probe string, each state driven by hand rather than inferred:

| Practice state | how it was reached | disclaimer |
|---|---|---|
| queue overview — **control** | `#/practice` | ✅ present ×1 |
| question runner | pressed "Practice all questions (24)" | ❌ absent |
| batch pause | answered 10, reached "10 done — nice work / 2 of 10 correct" | ❌ absent |
| completion card | pool reduced to 2 lessons, answered both, "See Results" | ❌ absent |

Mechanism confirmed in source too: `if (session)` at line 212 holds three `return`s (`atBatchPause`,
`!item`, and the runner) ahead of the queue-overview return that carried the string. **A fourth state
that could have been a fourth defect is not one:** `loadFailed` renders `<LoadFailure>` *inside* the
queue-overview return, so it was always covered.

⭐ **What re-measuring changed: the item framed this as a product call with three options, and one
measurement settles it.** Item 170's option (c) was to accept the runner as deliberately chrome-free
and record that in §10.1. **`LessonReader` and `Practice` import and render the SAME
`components/Question.jsx`** — measured, both files, line 22/29 — and `LessonReader` puts
`<Disclaimer>` directly beneath it. Read live: the end-of-lesson check ends *"…Stock prices |
Educational content only — …| Next Lesson"*. **So the app had already decided that a quiz question
carries the notice; the only open question was whether its two screens agree about the same
question.** (c) would have shipped that disagreement deliberately, and (b) — pause and completion card
only — would have left the runner as the one place the disagreement lives. **Option (a), uniform.**

**What shipped: one file in `src/`, 45 insertions / 10 deletions.** `Practice.jsx` gains a local
`ScreenFrame` and its four returns pass through it, so the file holds exactly one `<Disclaimer>` —
the same structural shape `Sectors.jsx` took this morning, deliberately, so the two read as one rule
rather than two patches. **All four states re-measured after the build: ✅ present, count 1, in every
one.** Order checked too, because a footer can bury an action: in the answered runner the `Next`
button is at y=584 and the disclaimer at y=628, so nothing moved below the control.

⛔ **The other six §10.1 surfaces were then SWEPT rather than presumed clean, and this is the part
worth keeping.** Between each component's `export default function` and its `t.disclaimer` line,
`Learn`, `LessonReader`, `Reference`, `MarketSignals`, `Settings` and `App` have **exactly one**
top-level `return` each — one component, one return, nothing to skip. `App.jsx`'s hit is in
`FirstRunNotice`, a single-return modal defined above the default export, which is why its disclaimer
line (130) precedes its component line (237) and why a naive line-order reading would have flagged it.
**The class is closed at two instances; the recipe is written into LAUNCH_PLAN.md §10.1 so nobody
re-runs it.**

**Layout re-checked, because the fix adds a node to three branches that had none:** the runner swept
in `ja` at 320px/200% — `textOverflow` 39 scanned / 0 findings, `horizontalOverflow` 0,
`smallTargets` 0, `headingOrder` clean — with the `textOverflow`, `horizontalOverflow`,
`smallTargets` and `headingOrder` controls all re-fired in that same context, `plantsRemoved: true`,
`appFindingsAfterCleanup: 0`.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **21,067** lines vs app code
(`src/` minus `content/`+`locales/`) **9,324** — **2.26x**, down from the **2.27x** measured earlier
today. `scripts/` +0, `src/` +35. **Two consecutive runs have now moved it the right way**, both by
fixing the app.

#### Step 5 — adversarial self-check
**Blindspot register: this change is IN §10.1 and closes its second instance rather than opening
anything.** No lesson, quiz, glossary or market prose changed — the only string rendered is the
existing `t.disclaimer`, in more states. No Dalio-adjacent content (§10.2), no child-facing framing
(§10.3); the diff contains neither. The Markets-tab class: **the dates in the new comment are code
comments recording measurements, not a date rendered to a learner** — this screen renders no date at
all. `npm run check-blindspot` **exit 0**, read from `$?`, and it IS evidence here because the diff is
under `src/`, which is what that script scans.
**DECISIONS.md conflict: none, and I checked the two it could have been.** `localStorage`-only state
is untouched — `ScreenFrame` is presentational and reads nothing. Item 12's port-cost rule is not
engaged: `ScreenFrame` is a local function component, nothing was added to `components/`, and no
dependency appeared. The Leitner scheduler, `review.js` and the session state machine are byte-for-byte
unchanged; only four JSX wrappers moved.
**Already-done: no** — item 170 is one run old and this is its first implementation; `grep -c
"ScreenFrame"` over `AGENT_LOG.md` returns hits only from today's two entries.
**A trap I could have walked into and did not:** the obvious edit is to append `<Disclaimer>` to each
of the four returns. That ships four copies of the string, and `check-blindspot`'s regex would have
been just as green about four as about one — the same instrument that could not see the defect cannot
see that shape either. One frame, one string, four call sites.
**My own verification claim, weakest part first:** ⚠️ **the four-row before/after table is a reading
of a rendering, and an independent reviewer cannot reproduce it from a command list** — it needs a
build, a static serve of `dist/`, a browser pane and roughly a dozen scripted clicks per row. ⚠️ **And
one row is weaker than the others: the completion card was reached by shrinking the pool to two
lessons rather than by finishing all 24**, which is a different route to the same `!item` branch, and
I am recording that rather than implying I answered twenty-four questions. What reproduces exactly,
from exit codes and not from grep counts: `npm test` **exit 0, 0 failures, 4 warnings**, `npm run
build` **exit 0**, `npm run check-blindspot` **exit 0**. ⚠️ **And the same sentence as this morning
still holds and is still the point: `check-blindspot` printed the identical green line before this
change and after it.**
**Backlog bytes (W-7.2 rule 1):** item 170 closed and was replaced by its conclusion rather than
annotated with one — **2,143 b → 1,709 b, −434 b**. Measured by `check-log-size.mjs` and not by my
arithmetic: the backlog goes **416,589 b → 416,162 b, −427 b.** It stays **9,311 b under** the
425,473 b W-7.2 rule 5 measures against.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (owner-directed: "fix the strings" — third entry this date) — A verdict line that named a retired vendor and credited a strip that never ran, replaced by one that reports what it actually stripped

**The pick was the owner's**, from a finding my 2026-09-08 run reported and deliberately did not act
on ("a different item's scope"). `check-deployed.mjs` printed *"identical apart from Netlify's
injected tags"* / *"differs beyond Netlify's injected tags"* against a GitHub Pages site, one day
after Netlify was retired.

**Step 3.5 — the premise held and grew a second defect.** The claim to re-measure was "the code is
right and only the two verdict strings are stale."
- **The filters are inert against this host — measured, not inferred.** Against the live canonical
  `index.html` (4,625 b, fetched this run) the netlify-comment filter removes **0 b** and the
  hosting-`<meta>` filter removes **0 b**.
- **Control, run before the zero was believed:** Netlify's own shape — its three-line comment and
  its two `<meta name="hosting-provider"/"netlify-deploy">` tags — planted before `</head>` fires
  them at **52 b** and **100 b**. **So the filters are inert HERE and are not broken**, which is the
  distinction the old comment was reaching for and the verdict string was not.
- ⚠️ **What the item did not say, found on the way: the comment block above the filter opened
  TWICE.** Two `// index.html, modulo the tags the host injects.` lines, four lines apart — the
  2026-09-07 host migration prepended a new header without removing the old one. Fixed here; it is
  the same accretion shape W-7.2 describes, one file over.

**What shipped (two files, no `src/` change, 40 insertions / 13 deletions).**
1. `stripInjected` split into `stripHostTags` (the two host filters) + the blank-line/trim
   normalization, **so the byte count and the comparison read the same definition** rather than
   keeping two copies of one regex pair.
2. The verdict reports `hostTagBytes`, measured per run: `apart from N b of host-injected tags` when
   the host injects, `with nothing to strip — this host injects no tags` when it does not. ⭐ **No
   host is named in either branch.** The point is not that "Netlify" was the wrong word — it is that
   a hardcoded claim about the host goes stale exactly the way a hardcoded claim about the machine
   does, which this repo has now written down for Node, for the App summary's counts, and here.
3. `README.md` § check-deployed said the same stale thing in prose ("modulo the one comment and two
   `<meta>` tags Netlify injects") and now carries the measurement and the control's numbers.

**Branches exercised, and one is NOT.**
- **red / `=== 0`** — live, end to end: `✗ index.html — differs (4625 b live vs 4625 b local),
  compared with nothing to strip — this host injects no tags`.
- **green / `=== 0`** — live, end to end, by making the fixture genuinely in-sync: the live
  `index.html` **and** the live entry bundle `index-Ddd60uv_.js` (267,686 b, fetched) copied into
  `dist/`, which took the whole check to `✓ byte-identical` and printed
  `✓ index.html — identical, with nothing to strip — this host injects no tags`. `dist/` was rebuilt
  afterwards and re-verified (`cmp dist/data/market.json public/data/market.json`, entry back to
  `index-BX9VoYlv.js`).
- ⛔ **green / `> 0` — EXPRESSION ONLY, wiring unexercised, and I am not claiming otherwise.**
  It needs a live host that injects. I built one (a copy of `dist/` with Netlify's tags planted,
  served on 127.0.0.1:8812) and it could not be reached: **the README canonical-URL parser matches
  `<https://…>` only**, so a local `http://` origin is skipped. The two definitions were therefore
  evaluated directly against that same planted document — `apart from 152 b of host-injected tags`
  — with the real canonical document as the negative control in the same run.
  ⚠️ **And the failed attempt is worth recording rather than deleting:** with the canonical line
  malformed, the parser silently took the next `https://` URL in § Deploying — `app.netlify.com/drop`
  — and ran against it. It **refused a verdict** (`⛔ NO VERDICT`, the 404 control returned 200), so
  no wrong answer was produced, and `check-data.mjs` §38 pins that line anyway, so this is not an
  open hole. It is a note about how the fallback behaves, not an item.
- **`--self-test` exit 0 both before and after**, which is the control that says the strip is still
  complete after being split in two.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **21,091** lines vs app code
**9,324** — **2.26x**, unchanged at two decimal places from earlier today. ⚠️ `scripts/` **+24**,
`src/` **0**, so this run moves it the wrong way and the two runs before it moved it the right way.
The honest defense is not the size: it is that the change **deletes a false sentence** from output an
owner reads, and the deletion is what was asked for.

#### Step 5 — adversarial self-check
⛔ **`npm run check-blindspot` exit 0 is NOT evidence about this change, and quoting it as if it were
is a mistake a previous run of mine made.** It scans `src/`, `README.md`, `index.html` and the v5
prototype — so its green **does** cover `README.md` here, and does **not** cover
`scripts/check-deployed.mjs`. `git diff --name-only` returns those two files; no string in the script
half can reach a learner, and the README half is covered by the guard.
**Blindspot register: nothing found.** No lesson, quiz, glossary or market copy; no §10.1 disclaimer
surface (the two `ScreenFrame` fixes earlier today are untouched); no §10.2 name; no §10.3 framing.
The `2026-09-08` dates I wrote are code comments recording measurements, not a learner-facing date.
**DECISIONS.md conflict: none.** Hosting is the one it touches and the change does not move it:
GitHub Pages stays canonical, the Netlify-shaped filters are **kept** rather than deleted, and the
decision that origins are declared in `README.md` and never as a literal in a script is the reason
this fix reports a number instead of hardcoding a host name.
**Already-done: no.** The finding was filed as prose in the 2026-09-08 item-74 entry and no run has
acted on it; `grep -c "hostTagBytes"` over `AGENT_LOG.md` and `DECISIONS.md` returns 0 and 0.
**A change I could have made and deliberately did not:** delete the two filters, since they strip
nothing today. That would be the same mistake in the other direction — the control proves they work,
and the next host that injects would need them written from scratch by someone who no longer has the
Netlify document to look at.
**My own verification claim, weakest part first:** ⚠️ **the `> 0` branch's wiring is unexercised**,
stated above rather than smoothed over, and the green branch was exercised against a fixture I
assembled from the live site rather than against a genuinely in-sync deploy — which does not exist
yet, because the two commits before this one are unpushed. Reproducible from exit codes, not grep
counts: `npm test` **exit 0, 0 failures, 4 warnings**, `check-deployed --self-test` **exit 0**,
`npm run check-deployed` **exit 1** (unchanged, and for two reasons that predate this change: the
canonical site serves `14da22d` while HEAD is ahead, and the retired Netlify origin still answers).
**Backlog bytes:** no item opened or closed; this entry is run-log, which archiving can move.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 free — the previous run was owner-directed and filed no residual, so this pick was a corpus-wide sweep with the probe that shipped yesterday) — the sweep came back clean across 17 screen-states, and the one flag it raised was my own instrument standing inside a flex row

**The pick.** Item 155 shipped `textOverflow` into `scripts/a11y-sweep.js` on 2026-09-08 and proved
it against plants. **Nothing had then run it over the app.** A probe validated only against its own
plants is an untested claim about the corpus, so this run swept the corpus with it: 320px viewport,
`ecycles_font_scale` **1.3** (the app's own maximum, `FONT_SCALE_STEPS` in `theme.js` — not a browser
zoom), against the built `dist/` served on 127.0.0.1:8815 with a 404 control.

**Step 3.5 — the premise was "the app has more of the class item 155 kept finding." It is REFUTED,
and the refutation is the run's main result.**
- **17 screen-states swept, 0 defects:** Learn / Practice hub / Practice **question runner** /
  Reference hub / Glossary / Market Dashboard / Sector performance / Kids / About in `en`; Learn,
  Practice, Reference in `zh`; Reference hub in `ja`; and **all 44 lesson reader pages** in `en`.
- **Every sweep carried a firing control** — an off-flow `position: fixed` plant at `left: -9999px`
  holding one long unbreakable word in an 80px box, verified in the same run that produced each
  result, so no zero here is an unfired instrument.
- **The one flag, lesson 7, is a false positive and stays one:** a `div` 3px past its box on both
  sides at `left: -3px; right: -3px`, `aria-hidden="true"`, `pointer-events: none` — the dashed
  highlight ring the stacked-column figure draws deliberately outside its column. Filed as a note
  below, not as an item and not as a probe exclusion (W-6.2 rule 3: no learner can see it).

⚠️ **AND THE CONTROL CAUGHT ME CONTAMINATING THE APP, which is the part worth keeping.** My first two
control plants were appended to `<main>` and their `remove()` never ran, because the call that would
have run it timed out. `<main>` is `display: flex; flex-direction: row`, so two 80px plants took
160px and squeezed the content column **288px → 128px**. The probe then reported two findings — a
progress bar and a "Go to Review" button — that were **entirely my own doing**, and they looked
exactly like real narrow-viewport defects. Removing the plants took the column back to 288px and both
findings vanished. **A plant that participates in layout is not a control, it is an edit**; the
shipped `selftest()` already knew this and positions its own plants fixed and offscreen. Every sweep
after that used the same shape.

**What shipped, and it is the one real finding the sweep left standing** (2 files, `src/` only,
48 insertions / 4 deletions, no `scripts/` change).
`ProgressBar` had **no clamp**: `pct = (value / max) * 100` and `aria-valuenow={value}` raw.
- **Measured live before the fix**, with `ecycles_completed_lessons` holding more ids than the
  catalog has lessons: Learn's ResumeCard rendered the fill at **`width: 136.364%`**
  (`scrollWidth 346` in a **254px** box) and shipped **`aria-valuenow="60"` against
  `aria-valuemax="44"`** — out of range, so invalid ARIA. The visible label read **"Progress: 60/44"**;
  `progressLabel` is rendered as text *and* used as the bar's `aria-label`, so the wrong number was
  on screen, not merely announced.
- **The spill was invisible** — the track's own `overflow: hidden` swallowed it — which is precisely
  why it needed a probe to find and why leaving it was not an option: nothing on screen would ever
  have reported it.
1. `ui.jsx`: `value` is clamped into `[0, max]` and **the same clamped number drives both the fill and
   `aria-valuenow`**, so the bar and the announcement cannot disagree and neither can leave the track.
2. `Learn.jsx`: `done` now counts only completed ids that still name a live lesson
   (`new Set(lessons.map(l => l.id))`), so the NUMBER is right rather than merely in range. The
   per-track counters below it already filtered this way; this is the flat total catching up with
   them. **Both halves are needed together** — the clamp alone would have drawn a full bar under a
   label still reading "60/44", which is a new disagreement rather than a fix.

⚠️ **REACHABILITY, STATED HONESTLY BECAUSE IT IS THE WEAKEST PART OF THE CASE.** `completeLesson`
dedupes and only ever writes a real id, and the live catalog is ids **1-44 contiguous** (measured),
so **no device in the field can be over-count today**. It becomes reachable the day a lesson is
removed: `completedLessons` persists raw ids, nothing prunes an id whose lesson is gone, and this
repo has renumbered lesson ids once (`lib/lessonIdMigration.js`) and adds lessons routinely. This is
a guard placed ahead of a content change, not a live defect repaired — and it is written that way in
the code comment too.

**Verification, live on the rebuilt bundle `index-xAcYx9gX.js`, not on the source.**
- **Over-count case, after:** `aria-valuenow="44"` / `aria-valuemax="44"` / label `Progress: 44/44` /
  fill `100%` / `scrollWidth 254 === box 254`. The 136.364% and the 60/44 are both gone.
- **Control, run because "everything clamps to full" would look identical to a fix:**
  `[29,30,31,32,33,999,1000]` — five live economy ids and two orphans — reads **`5/44`**, fill
  **11.3636%**, with the track bars at `5/12`, `0/17`, `0/15`. It counts, it does not saturate, and
  the headline now agrees with the three track bars instead of contradicting them. ⚠️ The *pre-fix*
  value for this second case (7/44) is read off the diff, not measured; the measured before-evidence
  is the 60/44 case above.
- `npm run build` clean, `npm test` **exit 0, 0 failures, 4 warnings** — the same four as the
  pre-change baseline this run took.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **21,091** lines vs app code
**9,368** — **2.25x**, down from 2.26x earlier today. `scripts/` **+0**, `src/` **+44**. This run
moves it the right way, and the reason is not restraint: the fix that the sweep found belonged in the
component, and the probe that found it already existed.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found.** No lesson, quiz, glossary, kids or market copy is touched; no
§10.1 disclaimer surface (the two `ScreenFrame` fixes of 2026-09-08 are untouched, and the Practice
runner's disclaimer was observed intact during the sweep); no §10.2 name; no §10.3 framing. ⚠️ **I
wrote `2026-09-08` into two code comments**, which is the §2.3 shape — so I measured rather than
argued: `grep -c "2026-09-08"` against the shipped `dist/assets/index-xAcYx9gX.js` returns **0**
(Vite strips comments), and §2.3 is about rendered copy regardless. `npm run check-blindspot`
**exit 0**, and unlike the previous run's case its green **does** cover this change — both edited
files are under `src/`, which is what that script scans.
**DECISIONS.md conflict: none.** The one decision that names this component is "Progress is a bar,
not a ring" (2026-08-17) and the change keeps the bar. `localStorage`-only state is unchanged — the
same key is read, nothing new is written, and no storage migration is introduced.
**Already-done: no.** `grep -i progressbar` returns 0 hits in the live `AGENT_LOG.md`, 2 in
`DECISIONS.md` (the ring decision) and 10 in the archive — all of them about the ARIA attributes
existing or the bar-vs-ring shape, **none about a clamp or about filtering the completed count.**
**My own verification claim, weakest part first:** ⚠️ the fix guards a state **no shipping device can
currently be in** (see REACHABILITY above), so its live value today is the ARIA correctness of a
branch nobody reaches; I am not claiming a learner is helped this week. The sweep's 17 clean states
are each a single-run measurement, not a repeated one, and `es`/`ko` were not swept at all — the
languages I chose were `zh` and `ja` on the argument that CJK has the defect history, which is a
prior, not a measurement. Everything above is reproducible from exit codes rather than grep counts:
`npm test` **exit 0**, `npm run check-blindspot` **exit 0**, `npm run build` clean.
**Backlog bytes:** no numbered item opened or closed; the false positive below is a note under item
155, per W-6.2 rule 2.

📝 **Note filed under item 155 rather than as a numbered item (W-6.2 rule 2 — zero learner-visible
instances).** `textOverflow` has a fifth false-positive class it does not exclude: **a decorative
overlay deliberately drawn outside its parent's box.** The live instance is lesson 7's stacked-column
figure, whose dashed highlight ring is `position: absolute; left: -3px; right: -3px`, `aria-hidden`,
`pointer-events: none` — 3px of overflow on each side, by design. One instance corpus-wide, and the
flag is 3px, so it is cheap to read past; an exclusion for `aria-hidden` + negative inline inset
would be the shape if a second instance ever appears. **Do not build it for this one.**

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 free — the previous run's only residual was a note under item 155 that ends "do not build it for this one", so this pick came from a live walk of the routing the app has had since August) — a shared link to a locked lesson is discarded in silence, and the address bar is rewritten so the last trace of what the learner clicked is gone

**The pick.** Not a backlog item. The open numbered items are either closed-in-substance (167, 163),
owner decisions (117(a)/(b), 158), or blocked on O-3 (94, 160's remainder), so this came from reading
`lib/deepLink.js` against `LAUNCH_PLAN.md` §5 — *"each lesson a shareable URL"* — now that the app is
actually live and those URLs can be clicked by someone other than me.

**Step 3.5 — the premise reproduced exactly, with controls firing in both directions.** Built app on
`127.0.0.1:8821` (static `dist/`, 404 control fired), returning learner
(`ecycles_seen_disclaimer` set), nothing completed:

| case | link | lands on | hash after | notice |
|---|---|---|---|---|
| A | `#/lesson/35` (locked) | Learn path | **`#/learn`** | **none** |
| B **control** | `#/lesson/29` (unlocked) | the lesson reader | `#/lesson/29` | — |
| C | `#/lesson/9999` (no such id) | Learn path | **`#/learn`** | **none** |
| D **control** | `#/practice` | Review | `#/practice` | — |

"None" is `document.querySelectorAll('[role="status"],[role="alert"]')` returning **zero nodes** — and
B is what makes that zero mean something, because a probe that could not see a honored link either
would have produced the same table.

⚠️ **AND THE FIRST RUN OF THAT MEASUREMENT WAS CONTAMINATED BY MY OWN SETUP, which is the part worth
keeping.** I seeded `ecycles_completed_lessons` with `[29,30]` after a `localStorage.clear()`. The
clear also removed `ecycles_legacy_lesson_id_migrated`, so `loadCompletedLessons` did its job and
remapped my ids through `OLD_TO_NEW_LESSON_ID` — I read the state back as **`[17,18]`** and spent a
detour reading two money-track rows as an economy-track contradiction. **A `localStorage.clear()` is
not a neutral starting state in an app that owns a migration**; every measurement after that point
sets the flag and reads the stored value back to prove nothing moved.

**What shipped** (8 files, 148 insertions / 10 deletions).
1. **`lib/deepLink.js`** — `resolveRoute` returns `missed` beside `{ tab, reading }`: `null`, or
   `{ lessonId, reason: "locked" | "unknown" }`. Ids only, no title — the module is deliberately free
   of content. `initialRoute` passes it through **except** on the first-visit branch, which keeps
   reporting nothing: that visitor is reading lesson 1, not stranded on a menu, and a path notice does
   not belong on a screen that is not the path.
2. **`App.jsx`** — a `linkMiss` state fed from both call sites, rendered as a dismissible `Note` in
   the same slot as the storage notice. Self-clearing: any honored navigation writes `null` through
   `onRoute`, and `openLesson` clears it too.
3. **`locales/*.js`** — `linkMissLabel`, `linkMissLockedTemplate` (`{title}`, so §1b's placeholder
   parity check covers it), `linkMissUnknown`, `linkMissDismiss`, five languages.
4. **`check-data.mjs` §18(d2)** — the refusal must be *reported*. W-6.2 rule 3's sentence: *a learner
   opens a shared link to a lesson they have not unlocked and gets a 44-row path with no indication
   which row was theirs or that a link was involved.*

**This does not touch the unlock bet, and that is checked rather than asserted.** No URL opens a
locked lesson; §18(d)'s existing injection still proves it, and live case A's reader never opened.
`DECISIONS.md` is amended rather than contradicted — its (a)/(b)/(c) list is about *where the learner
lands* and is complete for that question; it never contemplated whether the app admits the link
existed. This is still option (a).

**A second, separate defect fixed because measuring mine exposed it.** The notice rendered
*"…and it opens.Dismiss"* — `Note` wraps children in one `<p>` and `Button` is `inline-flex`, so the
control lands on the end of the sentence and its `marginTop` does nothing. ⚠️ **The storage notice
shipped 2026-09-07 has the identical defect**, measured with an **off-flow** plant of that exact shape
(`position: fixed; left: -9999px`, so it could not disturb layout — the lesson from the previous run's
contaminating plants): button at **44px** from the paragraph's left edge, i.e. same line; **0px** with
`display: flex; width: fit-content`. Both call sites fixed. Shipping one corrected notice beside an
identical uncorrected one would have been worse than either.

**Verification, live on the rebuilt bundle `index-WoER86X-.js`, not on the source.**
- **Locked:** notice reads *"That lesson isn't open yet — Your link was for "Interest Rates: The
  Master Signal". Finish the lesson before it on this path and it opens."* Dismiss at offset **0px**,
  **75px** wide inside a **308px** paragraph — its own line, not full width.
- **Unknown id:** *"Your link pointed to a lesson that isn't in this app."*
- **Dismiss:** button present → clicked → button gone, notice gone.
- **Control, honored link:** `#/lesson/29` opens the reader, `noticePresent: false`, hash kept.
- **Control, first visit:** `#/lesson/35` with cleared storage still opens lesson index 0 with the
  disclaimer modal and **no** notice — the §3.2 behavior `DECISIONS.md` settled is untouched.
- **All five languages**, each with the localized lesson title and `html lang` read back:
  `es` (ESA LECCIÓN AÚN NO ESTÁ ABIERTA / "Tasas de Interés: La Señal Maestra"), `ko` (`ko`,
  "금리: 마스터 신호"), `zh` (`zh-Hans`, "利率：主导信号"), `ja` (`ja`), `en`.
- **Guard proven by injection, three times, each restored from a scratchpad copy and `cmp`-verified
  identical afterwards** — never `git checkout --`. Each injection produced **exit 1 with exactly one
  failure, and it was mine**: dropping the `locked` report → *"a locked lesson link must report why it
  was not honored, got null"*; dropping the `unknown` report → *"must report itself as unknown"*;
  making an honored link report a miss → *"an honored lesson link must report no miss"*. The third is
  the control that stops the first two from passing under "always report something".
- `npm run build` clean, `npm run check-blindspot` **exit 0**, `npm test` **exit 0, 0 failures,
  4 warnings** — the same four as this run's pre-change baseline.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **+25** lines vs `src/` **+123**.
This is the second consecutive run where the app grew faster than the instruments, and again not out of
restraint — the defect was in the app, and the one check added is 25 lines because the module it guards
is pure and needs no browser.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, and the one shape that looked like a hit was measured rather than
argued.** No lesson, quiz, glossary, kids or market copy is touched. §10.2: zero name matches in the
diff. §10.3: untouched. §10.1: the new copy is about lesson unlocking and makes no financial claim, and
the path's own disclaimer was verified **still rendering on the same screen as the notice** (present:
true, with a nonsense control string absent). ⚠️ I wrote `2026-09-08` / `2026-09-07` into code comments,
which is the §2.3 shape — so: `grep -c` against the shipped bundle returns **0** for both, against a
control of **1** for a string that *is* shipped copy. `npm run check-blindspot` **exit 0**, and its green
covers this change: every edited runtime file is under `src/`, which is what it scans.
**DECISIONS.md conflict: none, and the one entry this change touches is amended in the same commit** so
the record does not go stale. `localStorage`-only state is unchanged — no key read, written or added.
Hash-routing-with-no-router is unchanged: no route added, no dependency, and the stated port cost does
not move (a shell that deletes `deepLink.js` leaves `missed` null and the notice never renders).
**Already-done: no.** `grep -c linkMiss` returns **0** in `AGENT_LOG.md`, the archive and `DECISIONS.md`.
The prior art is item 31 and the `DECISIONS.md` entry, both of which record the decision to *fall back*
and neither of which mentions telling the learner.
**My own verification claim, weakest parts first, because two of them are real.**
⚠️ **(1) The storage-notice half was measured on a reconstruction, not on the shipped notice.** I could
not force `persistenceBroken` in this browser pane, so I built a plant with that notice's exact
structure and measured it. The structure is identical by reading, and the 44px→0px result is a real
measurement of *that shape* — but it is one inference short of measuring the thing itself, and it is
written that way here rather than rounded up.
⚠️ **(2) The four non-English notices are unreviewed machine translation** — 16 new strings on
`es`/`ko`/`zh`/`ja`, which is O-3's subject. They are app chrome rather than lesson prose, which is the
class this project has shipped routinely, but the honest statement is that no fluent reader has seen
them.
(3) Every claim above is reproducible from an exit code or a read-back DOM value rather than from a grep
count, and the live figures come from the rebuilt bundle by name.
**Backlog bytes:** one numbered item **opened** (171) and none closed — filed rather than fixed, with its
reachability stated as **zero live instances today**, which is why the item says so in its own text.

📝 **Item 171 filed, and it came out of the contaminated setup above rather than out of the pick.** While
reading state back I found that `isUnlocked` never asks whether *this* lesson is completed, so a lesson
the learner has **finished** renders disabled under "Complete previous lessons first" the moment anything
is inserted ahead of it in its track — which `b6c9bc9` did on 2026-08-25 by prepending ids 41-44 to
`money`. Reproduced with clean, unmigrated state (`[16,17,18]` → the id16 row `disabled: true`, carrying
**both** "Complete previous lessons first" and "Completed"), control fired (`[44,16,17,18]` → same row
open). Not fixed here: the fix changes the predicate that gates `CLAIMS.md` A1 and should not ride along
in a routing commit.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent, backlog item 171 — W-6.2 rule 1 chain at link one; the previous run filed it and deliberately did not fix it) — a lesson the learner had FINISHED rendered greyed out under "Complete previous lessons first" while the same row announced "Completed", and the rule that did it had never once asked whether this lesson was done

**The pick.** Item 171, filed by the previous run out of a state it built to test something else. W-6.2
rule 1 permits it at link one. It is the rare residual whose reachability is *zero live instances today*
and whose priority is still not low, because the trigger — inserting lessons at the front of a track —
is a routine habit here, and the next one re-locks finished work for **every** installed learner at once.

**Step 3.5 — the premise reproduced exactly, live, with the control firing in both directions.** Built
app on `127.0.0.1:8834` (static `dist/`, 404 control fired), returning learner, storage written directly
with `ecycles_legacy_lesson_id_migrated` **pre-set** so nothing was remapped — that flag is the control
for the contamination that cost the previous run a detour, and `stored` was read back as exactly what
was written every time.

| completed | display order | id-16 row (index 16) | labels |
|---|---|---|---|
| `[16,17,18]` | money = 41,42,43,44,**16**,17,… | **`disabled: true`** | **"Complete previous lessons first" AND "Completed"** |
| `[44,16,17,18]` **control** | same | `disabled: false` | "≈5 min \| Completed" |

Both halves of the item hold. Display order was measured off `lessonsByTrack()` rather than read off the
item: `money => 41,42,43,44,16,…,28`, so id 16's predecessor is id 44. ⭐ **The control also moved the
defect onto id 44** — completed, predecessor not — which is what showed the trigger is not "front
insertion" specifically but **any** lesson completed while its predecessor is not; front insertion is
just the way this repo produces that state.

**The disposition, re-decided on the corrected facts.** The item offered (a) a completed lesson is
always unlocked, and (b) the row stops claiming both things while staying locked. **(a), because it
subsumes (b):** under (a) the contradictory row is unreachable by construction, where (b) would relabel
a row while still refusing to reopen a lesson the learner finished — the actual complaint.

**What shipped** (5 files, 1 new).
1. **`src/lib/lessonUnlock.js`** (new, 56 lines) — the predicate, moved out of `App.jsx` as pure logic
   so it can be exercised without rendering a screen. Two clauses: a completed lesson is always open;
   otherwise the previous lesson **of the same track** must be completed.
2. **`src/App.jsx`** — `isUnlocked` is now a `useCallback` wrapper. No behavior in the shell.
3. **`scripts/check-data.mjs` §80** — the guard. W-6.2 rule 3's sentence: *a learner who has finished a
   lesson opens the path, finds it greyed out and unclickable under "Complete previous lessons first"
   while the same row says "Completed", and cannot reopen their own work.*
4. **`CLAIMS.md` A1** and **`DECISIONS.md`** — the record, below.

**§80 is a swept invariant, not a spot check**, which is what retires the class rather than the
instance: for **8 completed-set shapes** (including out-of-order and front-insertion shapes, all-done,
and every-other-row) no lesson may be both completed and locked. Plus three directional controls — the
open-set on a fresh install must be **exactly the first of each track (3 of 44)**, the id-16 seam must
still report **locked** when it is *not* completed, and `App.jsx` must actually import and call the
module.

**Verification, on the rebuilt bundle `index-DQNXxYN1.js`, not on the source.**
- **The defect, gone:** completed `[16,17,18]` → id-16 row `disabled: false`, "≈5 min | Completed", and
  **contradictions across all 44 rows = 0**.
- **The learner can actually reopen it** — clicked the row, reader opened at `#/lesson/16`, "LESSON 5 OF 17".
- **Control, the gate still holds:** id 44 still `disabled: true` with **only** the locked label, and
  **7 rows open, not 44**.
- **Control, "NEXT UP" cannot land on finished work:** `nextIndex` is computed from
  `!completedLessons.includes(l.id)` and never consults the predicate — read in `Learn.jsx` and seen
  live (Progress 3/44, NEXT UP = id 41, uncompleted).
- **A shared link to a COMPLETED lesson now opens it** (real page load, `#/lesson/16` → reader), where
  before it was refused. **The unlock bet is untouched:** `#/lesson/35` (locked) still lands on the path
  and still renders the previous run's notice — *"That lesson isn't open yet…"* — verified on a real load.
- **Guard proven by four injections, each restored from a scratchpad copy and `cmp`-verified identical
  afterwards** — never `git checkout --`, and each plant asserted to have landed before running. Removing
  clause 1 → the item-171 message by name plus the sweep, **20 failures**; widening clause 1 to `return
  true` → *"the open lesson indices are [0..43]; expected [0,12,29]"* — **this is the control that stops
  clause 1 from being written as "always unlock"**; collapsing the track check → the money and essentials
  first lessons report gated behind the previous track; deleting the `App.jsx` call → §80(e).
- `npm run build` clean, `npm run check-blindspot` **exit 0**, `npm test` **exit 0**.
  ⚠️ **The warning count is asserted rather than eyeballed:** HEAD's own `check-data.mjs` run against
  this working tree returns **0 failures / 3 warnings**, identical to the post-change run, so §80 added
  neither — it contains **0** `warn(` calls.

⭐ **§26 caught the new file before I did, and it was right.** `npm test` failed three ways the moment
the docs cited `lessonUnlock.js`: §26 resolves paths **against the git index**, and the file was still
untracked. That is item 157's design working exactly as intended — a fresh clone and this tree must
agree — and it is the check that would have caught shipping a module the repo does not contain.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **+119** lines vs `src/` **+62**.
The instruments grew faster this run, and that is stated rather than shaded: the app fix is genuinely
small (one clause), and the guard is a sweep over 8×44 cases with three controls because a spot check
here is what let the defect exist for two weeks.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, and the one shape that looked like a hit was measured rather than
argued.** No lesson, quiz, glossary, kids or market copy is touched; §10.2 zero name matches in the diff;
§10.3 untouched; §10.1 makes no financial claim and `check-blindspot` is **exit 0**. ⚠️ I wrote
`2026-09-08`, `2026-08-25` and a commit hash into code comments, which is the §2.3 shape — so: `grep -c`
against the shipped bundle returns **0** for each, against a control of **1** for a string that *is*
shipped copy.
**DECISIONS.md conflict: none, and the two entries this touches are amended in the same commit** so the
record does not go stale. `localStorage`-only state unchanged — no key read, written or added. ⚠️ **The
entry that needed real checking is "a URL does not unlock a lesson"**, because a link to a completed
lesson now opens where it did not: it holds, because the lesson was unlocked by the learner's own
completion and not by the link, and §18(d)'s injection resolves with **nothing** completed and still
proves no URL opens a locked lesson. §75's standing rule ("a same-track forward reference names something
the app will not open") also survives — clause 1 only opens lessons already completed, and a forward
reference names one that is not.
**Already-done: no.** `grep -c lessonUnlock` returns **0** in `AGENT_LOG.md`. The prior art is item 171
itself and item 168's §75 note, neither of which changed the predicate.
**My own verification claim, weakest part first.** ⚠️ **(1) The "zero live instances today" reachability
is inherited from the item, not re-derived.** I confirmed normal play can only complete a display-order
prefix and that no URL opens a locked lesson, which is the argument — but the app has been live since
2026-09-05 with no analytics, so *nobody can measure what any real install actually holds*, and that is
O-2's subject rather than something this run closed. (2) Everything else above is reproducible from an
exit code or a read-back DOM value, and the live figures come from the rebuilt bundle by name.
⚠️ **(3) One probe of mine was wrong before it was right, and it is kept here rather than smoothed
away:** driving `location.hash` from the console reported the link-miss notice as **missing**, which
looked like a regression in the feature shipped hours earlier. It is not — an in-app hash mutation is
followed by the app's own rewrite to `#/learn`, which self-clears the notice by design. Re-measured with
a **real page load**, the notice renders. **A same-page hash write is not the same event as opening a
link**, and the app is built to tell them apart.
**Backlog bytes:** one numbered item **closed and collapsed** (171, 31 → 15 lines per W-7.2 rule 1) and
**none opened** — this run files no residual.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 free — the previous run filed no residual, so this pick came from a live walk of the tab bar, the one control on every screen that had never been walked) — the app has a "take me back to the top of this tab" gesture, it works on exactly one of the three tabs, and the two where it does nothing are the two whose screens own their own pushed views

**The pick.** Not a backlog item. A live walk of the built app on `127.0.0.1:8841` (static `dist/`,
404 control fired) at 375x812, starting from the Reference tab because it is the least recently
swept surface. **Two premises died on the way, and both are recorded rather than smoothed away —
neither cost a commit.**

**Step 3.5 — the two refuted premises first, because they are the useful part.**
1. ⚠️ **"Back from a Reference sub-screen skips the index and lands in a lesson."** Reproduced, then
   **withdrawn: it was my own instrument.** I had reached `#/reference` by writing `location.hash`,
   and this app deliberately distinguishes a same-page hash write from a real navigation — two
   history entries ended up sharing an `entryIndex`, so `isBack` read false and the dismissal was
   skipped. Re-measured with a **real page load and in-app taps only**: Back closes the glossary and
   lands on the Reference index, correctly. **This is the second run in two days to be caught by the
   same trap**, and the previous run's note in the log is what named it.
2. ⚠️ **"The glossary list has no clickable rows"** — 43 terms rendered with zero `<button>`s.
   Also mine: the rows are `div[role="button"]` with `tabIndex={0}`, an `aria-label` and a real
   `onKeyDown` for Enter/Space. A `button`-only query cannot see them, and `el.onkeydown` is null on
   a React-delegated handler, so the follow-up "no keyboard support" reading was wrong the same way.
   Read in the source before believing it. **No defect; nothing changed.**

**What the walk actually found, measured with the Learn tab as the control.** Tapping the tab you
are already standing on:

| tab | pushed view open | tap the ALREADY-SELECTED tab | tap a different tab, then return |
|---|---|---|---|
| Learn | lesson reader | ✅ returns to the path | ✅ resets |
| Review | running review session | ❌ **screen byte-identical** | ✅ resets |
| Reference | Glossary (or any sub-screen) | ❌ **byte-identical, twice** (14,378 chars) | ✅ resets |

The control fires in both directions: tapping a *different* tab changed the screen every time, so the
app was reachable and simply ignored that one gesture; and the tab reports `aria-selected="true"`
while doing nothing, so it is a dead control for a keyboard or screen-reader user too.

⭐ **The diagnosis, which is what makes this one line rather than a feature.** `goToTab` resets what
the **shell** owns — `reading`, the lesson reader — which is why Learn was always right. Reference's
`section`, Glossary's `selectedTerm` and Practice's `session` are the **screen's** own `useState`,
which the shell cannot reach. And the "resets on tab switch" column above is **not a design
decision**: `ScreenBoundary` is keyed by `tab`, so the screen unmounts. The one route into a tab that
does *not* unmount it was therefore the one route that behaved differently, and nothing had ever
decided that it should.

**What shipped** (4 files, 0 new).
1. **`src/lib/deepLink.js`** — `dismissAllPushed()`, which drains the stack `useDismissOnBack`
   already maintains, plus the pure `dismissAll(stack)` underneath it (see the self-check below for
   why that split exists). No new hook call sites, no new state, no route, no remount.
2. **`src/App.jsx`** — `goToTab` calls it when `key === tab`, and `tab` joins the dependency array.
3. **`scripts/check-data.mjs` §81** — the guard. W-6.2 rule 3's sentence: *a learner reading a
   Reference sub-screen, or part-way through a review session, taps the highlighted tab they are
   already standing on and nothing happens, while the identical tap on Learn returns them to the
   path.*
4. **`DECISIONS.md`** — the 2026-09-06 pushed-view amendment extended, including the explicit note
   that the port cost is **unchanged** because this adds no call sites.

**Back and the re-tap are kept as different gestures on purpose** — Back means one step, a re-tap
means the root of the tab — so Reference › Glossary › a term takes two Backs or one tap. §81(d)
exists precisely because merging them is the plausible simplification.

**Verification, on the rebuilt bundle `index-CVin1QBJ.js`, not on the source.**
- **Fixed:** one tap on the active Reference tab from **two levels deep** (Glossary › term detail)
  returns to the Reference index; one tap on the active Review tab mid-session returns to the review
  root.
- **Control, Learn unchanged:** in a lesson → tap Learn → back on the path, and the track accordion
  the learner had opened by hand (`Thinking About Money`, not the default) is **still open** — the
  measurement that says this reused the dismiss path instead of blunt-remounting the screen.
- **Control, Back still pops ONE level:** term detail → Back → glossary (14,378 chars) → Back →
  Reference index. Not drained.
- **Control, the previous two runs' features intact on a real page load:** `#/lesson/35` (locked)
  still lands on the path and still renders *"THAT LESSON ISN'T OPEN YET"* with the lesson named.
- `npm run build` clean, `npm run check-blindspot` **exit 0**, `npm test` **exit 0**.
  ⚠️ **The warning count is asserted rather than eyeballed:** HEAD's own `check-data.mjs`, run
  against this working tree, returns **0 failures / 3 warnings** — identical to the post-change run,
  so §81 added neither. It contains **0** `warn(` calls.

⭐ **§26 caught a citation before I did.** `npm test` failed on `check-data.mjs:12372` citing
"backlog item 172" while no such item existed — the guard shipped before the item was filed. That is
the doc-vs-tree check doing exactly its job.

**W-6.3's ratio, re-measured this run rather than quoted:** `scripts/` **+131** lines vs `src/`
**+63**. The instruments grew faster again, and the honest reason is that the app fix is one guarded
call while the guard runs a behavioral drain test plus four structural assertions — but see the
self-check: the structural half alone was not enough, and that is not padding.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found.** No lesson, quiz, glossary, kids or market copy is touched —
the diff is navigation plumbing and one guard. §10.2 zero name matches; §10.3 untouched; §10.1 makes
no financial claim and `check-blindspot` is **exit 0**. ⚠️ I wrote `2026-09-08` into code comments,
which is the §2.3 shape, so: `grep -c` against the shipped bundle returns **0** for it, against a
control of **1** for a string that *is* shipped copy.
**DECISIONS.md conflict: none, and the entry this touches is extended in the same commit.** The one
that needed real checking is the deep-link grammar's *"its sub-nav is deliberately not routed"* —
it **holds, and this change is the reason it can keep holding**: no hash was added and no route
invented, which is the option that entry and the module header both rule out. `localStorage`-only
state unchanged: no key read, written or added.
**Already-done: no.** `grep -c dismissAllPushed` returns **0** in `AGENT_LOG.md` before this entry.
The prior art is the 2026-09-06 Back work, which built the stack this drains and deliberately left
the tab bar alone.
**My own verification claim, weakest part first.**
⚠️ **(1) The guard's first draft was WRONG and my own injection is what found it.** §81 was
structural — it asserted the call site, the dependency array, and that `popstate` still pops one.
Injection 5 replaced the drain's loop with `stack[stack.length - 1]()` and **§81 stayed green**,
because a function that still exists and still closes *something* satisfies every source-shape
assertion. That broken drain would have left one tap on the Reference tab sitting in the glossary
instead of at the tab's root. Fixed by splitting the pure `dismissAll(stack)` out so the section can
**run** it with three recording entries and assert `[top, middle, bottom]`. **Six injections now
fire** (call site removed; `tab` dropped from the deps; Back made to drain; Reference unregistered;
drain made a pop; drain reversed to bottom-up) — each planted, asserted to have landed, then restored
from a scratchpad copy and `cmp`-verified identical. Never `git checkout --`.
⚠️ **(2) Two of my own measurements were wrong before they were right** (the two premises above), and
in both cases the instrument, not the app, was the defect. Neither reached a commit, and the reason
they did not is that each had a control that disagreed with it.
(3) Everything else above is reproducible from an exit code or a read-back DOM value, and the live
figures come from the rebuilt bundle by name.
⚠️ **(4) What this run did NOT measure: whether any real learner has ever made this gesture.** The
app has been live since 2026-09-05 with no analytics provider, so the reachability argument is
design-level only. That is O-2's subject, not something this run closed.
**Backlog bytes:** one numbered item **opened and closed in the same entry** (172, filed in
conclusion form per W-7.2 rule 1, 15 lines). `MEASURED log-size` after this run's edits: backlog
**419,193 b** — still under W-7.2 rule 5's 425,473 b baseline, by 6,280 b.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (owner-directed: "do the archiving pass next" — tenth entry this date) — W-5.3's ninth pass, and the standing instruction for how to do it was false in both of its halves; following it would have shipped the day backwards

**The pick.** Owner-directed, off the warning my previous run left: `npm test` had the run log at
**250,908 b** against a 250,000 b warn budget. `check-log-size.mjs`'s cut plan named one day —
2026-09-07, 167,613 b, single contiguous region — leaving 83,295 b.

**Step 3.5 — the premise I re-measured was not the byte count, it was the RECIPE, and it is where
the whole run went.** W-5.3 carries a standing instruction added 2026-09-03: *"within a day the
archive reads OLDEST-FIRST, reversing the live log's newest-first … A pass that appends a day
verbatim ships it backwards. Reverse the day."* It is the first thing a pass reads about how to do
the cut. **Both halves are false, and each was measured rather than re-read.**
1. **The eighth pass did not reverse anything.** Its `## Archived 2026-09-06` section is
   heading-for-heading identical to the live file at `82be17d`: 18/18, `cmp` on the two extracted
   heading lists reports SAME order, not reversed. It was a verbatim append.
2. **The live log's within-day order flipped on 2026-09-07 and nothing recorded it.** On 09-06 the
   file opens with the 20:11 commit and continues with 18:08 — descending. On 09-07 it opens with
   the 00:24 commit, and on 09-08 all nine entries sit in **exact ascending commit order**. Checked
   against `git log` author timestamps rather than file position, which is item 142's rule.
⭐ **So the instruction inverted twice over: it described the archive's direction backwards AND the
live log's, and its action clause — "reverse the day" — would have taken a correctly-ordered 09-07
block and shipped it backwards.** That is the exact defect the note itself exists to prevent, which
is what makes it worth the run: **a recipe is a claim about the files, and it goes stale the same way
a figure does.** ⚠️ I nearly followed it. The only reason I did not is that step 3.5 applies to
process text and not just to backlog items.

**What shipped.** The cut, plus two corrections to the rule's annotations — **no clause of W-5.3
itself was reworded** (its trigger and action clauses are the owner's, item 115).
1. **`AGENT_LOG.md` → `AGENT_LOG.archive.md`**: 2026-09-07, 17 entries, 167,613 b, appended
   **verbatim** under `## Archived 2026-09-07`. Archive header range moved 2026-09-06 → 2026-09-07
   (asserted 1 match before, 1 after, 0 of the old string).
2. **The within-day order note, rewritten** to what the files actually do: append verbatim, reverse
   nothing — which is also what the archive header has always promised ("moved verbatim"). It says
   explicitly **not** to flatten the archive to one uniform direction, because 09-06 and 09-07
   genuinely were written in opposite orders and the archive should keep saying so.
3. **A ninth-pass ledger line**, which also answers the seventh pass's open note about scripting the
   mover: **not yet.** A mover scripted on 09-06's convention would have reversed 09-07 and corrupted
   it. The recipe has moved twice in three days, and **the piece worth building first is not the
   mover but the assertion** — archived day == live day at the commit before the cut.

**Verification, in the form a reviewer can re-run.**
- **Conservation, the reversible way:** the block was read back **out of the archive file** (not from
  a variable still in hand) and re-inserted at the cut point; the result is **byte-identical to
  `git show HEAD:AGENT_LOG.md` at 706,382 b**. Files throughout, never `$(...)` — the eighth pass
  lost an hour to command substitution stripping a trailing newline.
- **Negative control:** flipping one character at offset 348,861 of the reassembly makes the
  comparison fail, so "identical" is a comparison that *can* fail.
- **Containment:** `### 2026-09-07` headings — **0** in the live file, **17** in the archive, and all
  17 from `git show HEAD:AGENT_LOG.md` are present in the archive by exact-line match, 0 left behind.
  2026-09-08 stays live, 9 entries.
- **Region boundaries derived from content, not from the line numbers I had read:** the script
  re-locates the day by heading prefix and asserts contiguity (no non-09-07 day heading inside the
  span) before cutting. The 167,613 b it reports agrees with `check-log-size.mjs`'s independent
  figure.
- `npm test` **exit 0**, `npm run build` clean, `npm run check-blindspot` **exit 0**.

**The numbers this leaves behind are deliberately not retyped.** W-7.2 rule 4 exists because a block
measured its region before inserting itself into it. The run log above is the figure *before* this
entry was written; **`npm test`'s MEASURED log-size line is the only non-stale form of it.** The
floor is **unmoved by the cut** — archiving cannot touch it, which is W-5.3's own point — and what
moves it is this run's writing into it.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found.** Two Markdown logs; no lesson, quiz, glossary, kids or market
copy, no component, no date string in shipped code. `check-blindspot` re-run **exit 0** regardless.
**DECISIONS.md conflict: none.** W-5.3 names an archiving pass as a legitimate whole run. Its clauses
are quoted, not reworded, and its known date-vs-byte defect stays open and stays the owner's (item
115) — the trigger acted on was the measured warn budget, for the **tenth firing running**, and the
date clause was a no-op again.
**Already-done: no.** This is the ninth pass; each moved a different day.
**My own verification claim, weakest part first.**
⚠️ **(1) The two order findings rest on mapping run-log headings to commits by subject text, and
that mapping is judgment, not an identifier.** I reduced the exposure by making the decisive test
independent of it: comparing the archive's 09-06 heading list against `git show 82be17d:AGENT_LOG.md`
is a `cmp` between two files and needs no mapping at all. The commit-time evidence is corroboration
on top of that, not the load-bearing part.
⚠️ **(2) I did not verify the archive's sections older than 09-06.** The claim "the eighth pass
appended verbatim" is measured; "every pass did" is **not** claimed, and the 2026-09-05 record says
the sixth pass shipped an inverted section, so the archive's earlier sections are of mixed direction
by its own account. The rewritten note says to preserve what is there rather than normalize it,
which is the conservative reading and does not depend on auditing them.
(3) The conservation and containment results are reproducible from `cmp` exit codes and grep counts.
**Backlog bytes:** no numbered item opened or closed — but **the backlog region still grew**, and
saying otherwise would have been wrong: `check-log-size.mjs` counts the priority blocks inside the
backlog region, so this run's two W-5.3 annotations land there. Measured after this entry:
**421,918 b**, which is **3,555 b under** W-7.2 rule 5's 425,473 b baseline for 2026-09-13. The floor
moved for the same reason — the archiving MOVE takes 0 b out of it, W-5.3's own point.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 free — the previous run was owner-directed and filed no residual, so this pick came from the code surface rather than from a chain) — the Reference hub dropped focus to `<body>` every time a learner closed a section, and the run that fixed the identical bug one level down had written the words "the identical gap one level up" and walked past it

**The pick, and it is a deferral being collected rather than a discovery.** Grepping `src/` for
focus-restore call sites returned exactly one — `Glossary.jsx`'s `rowRefs`/`returnFocusTerm` pair.
Its own header comment says the open direction is handled "app-wide (LessonReader, TermDetail
itself); the close direction wasn't." The run that built it (archived entry, `Glossary.jsx` +23/−2)
closes with: *"Scoped to this file on purpose: `Reference.jsx`'s hub↔section navigation has the
identical gap one level up, but that file is one of the 26 owner-dirty ones."* **The constraint was
the owner's working tree on that day, and it is gone** — `Reference.jsx` is tracked and clean, and
`git status` this run shows only `Migration/` and `UIUX/` untracked, both the owner's.

**Step 3.5 — premise re-measured live, with a control that fires, before anything was edited.**
Built `dist/`, served it on `127.0.0.1:8871` (404 control fired on a nonexistent path), Browser pane
resized to 375x812 and confirmed non-zero. Every reading below is a direct `javascript_tool` read of
`document.activeElement`, one action per call, never in the same call as the click.
- **Control (known-good, and the reason a negative below is readable):** Reference › Glossary › the
  *Gross Domestic Product* row › Back → `activeElement` is the `<div role="button"
  aria-label="Gross Domestic Product">` row. **The instrument can see a restore when one happens.**
- **Case A, the pick:** Reference hub › Glossary tile › the section's Back → **BODY**.
- **Case B:** Learn › a lesson row › the reader's Back → **BODY**. Same class, different owner — see
  item 173, filed rather than folded in.
Open-direction focus was correct at every one of the three sites, exactly as the log already said.

**What shipped — 2 files, +55/−5, and not one string a learner can read.**
1. **`components/ui.jsx`** — `Tile` becomes `forwardRef`. This is the idiom already in the file:
   `Button` is `forwardRef` for the same stated reason ("needs a real node to call .focus() on"),
   and `Tile` has exactly **one** call site, so the blast radius is the file being fixed. React here
   is **18.3.1**, checked rather than assumed — `ref` is not a plain prop, so it does not reach the
   `<button>` through the existing `...rest` spread.
2. **`screens/Reference.jsx`** — a `tileRefs` map, a `returnFocusSection` state, and one
   `closeSection` that both the on-screen Back button and `useDismissOnBack` now run, so the restore
   fires whichever way the section closes. Same shape as `Glossary.jsx`, one level up.

**⭐ The adversarial pass found a real regression in my own first version, and it is the part worth
keeping.** Restoring unconditionally made the fix **steal focus**: re-tapping the already-selected
Reference tab drains the same dismiss stack (`dismissAllPushed`, `DECISIONS.md` 2026-09-08), and
that gesture has focus sitting on the **nav tab button** — measured, `activeElement` went from the
tab button up into the tile grid, costing a keyboard user their place in the tab bar. **The defect
was never "a section closed"; it is "the node holding focus was unmounted and focus fell to
`<body>`."** So the effect now restores only when `activeElement` is `body`/`documentElement`/null.
That keys on the invariant instead of on the gesture, which is what makes the boundary case come out
right: a tab re-tap **with focus inside the section** (in the glossary search box) *does* restore,
because there focus genuinely fell. Both halves of that one gesture were measured. It also keeps
`DECISIONS.md`'s "Back and the re-tap stay different gestures on purpose" true in the focus
dimension, which was luck the first time and is now intentional.

**Verification, in the form a reviewer can re-run.** Final bundle **`index-DkIEnxqk.js`**, confirmed
served by reading `script[src]` off the page before each measurement (the documented
`http.server`-caching trap), viewport 375x812.
| gesture | before | after |
|---|---|---|
| section, on-screen Back | BODY | **Glossary tile** |
| section, browser Back (`history.back()`) | BODY | **Sector performance tile** |
| section, tab re-tap, focus on nav tab | tab button | **tab button (unchanged — the guard)** |
| section, tab re-tap, focus in search box | BODY | **Glossary tile** |
| nested: term › Back › Back | row, then BODY | **row, then Glossary tile** |
| **lesson reader Back (untouched)** | BODY | **BODY** |
Per-tile keying is measured, not assumed: About restored to About and Sectors to Sectors, so nothing
is hardcoded to the first tile. `location.hash` stayed `#/reference` throughout — no route added,
which is what `DECISIONS.md` and `deepLink.js`'s header both require.
`npm test` **exit 0** (read from `$?` on an unpiped run — `${PIPESTATUS[0]}` is a bashism and this
shell is zsh, where it silently reads as empty), **4 warnings, the documented baseline set**:
review coverage, translation completeness, quiz option-length cue, log floor. `npm run build` exit
**0**, `npm run check-blindspot` exit **0**.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, and proved directly rather than by an exit code.** Filtering the
diff to added lines that are neither comment nor blank leaves **21 lines and zero string literals** —
there is no learner-facing copy in this change to regress. No Dalio reference, no advice-adjacent
language, no disclaimer touched (`Reference.jsx`'s `<Disclaimer>` on the hub is untouched and still
renders), no kids framing, no date string, no market figure. `check-blindspot` exit 0 as well.
**DECISIONS.md conflict: none, checked against the three entries that could have collided.** No route
and no hash added (measured, not reasoned — the hash stayed `#/reference` through every step), so the
"sub-nav is deliberately unrouted" decision holds; **no new `useDismissOnBack` call site** — the
existing one now takes a named callback instead of an inline arrow, so the recorded port cost of
"three one-line hook calls" is unchanged; no `localStorage` and no persistence of any kind (a ref map
and one piece of in-memory state).
**Already-done backlog item: no, and this is the one to be careful about.** It is the *same class* as
the archived `Glossary.jsx` fix and deliberately reuses its shape — but that run fixed **term rows
inside** the glossary and named this hub as explicitly not done. The nested control above shows both
now firing in sequence, which is what a duplicate could not produce.
**My own verification claim, weakest part first.**
⚠️ **(1) The "before" column of the table is from the pre-fix bundle (`index-CVin1QBJ.js`) and the
"after" from `index-DkIEnxqk.js` — two builds, not a single reversible experiment.** I did not build
a pre-fix tree on a second port the way the archived Glossary run did. What carries the weight
instead is the **in-session negative control**: the lesson-reader row still reports BODY on the
*final* bundle, so the instrument was still capable of reporting failure at the moment it reported
success for Reference. That is weaker than a two-port A/B and is stated as such.
⚠️ **(2) The tab-re-tap regression was found by measurement and not by reading.** My first version
read correctly and shipped a focus theft; had I not driven that gesture I would have committed it and
described it as a pure improvement. The row is in the table because the check earned its place.
(3) The `activeElement` reads and the exit codes are reproducible from the commands above.
**Backlog:** no item closed (this collected a deferral recorded in a run-log entry, not a numbered
item); **one opened — item 173**, the lesson-reader half, with the scroll-vs-focus-ring tension named
and W-6.2 rule 1 flagged against picking it next.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 SATISFIED — my own previous run filed item 173 and flagged it as not-to-be-picked, so this pick came from a corpus-wide sweep of a never-swept class rather than from the chain) — answering any question in the app threw a keyboard learner to the top of the document, on all 46 checks and every Practice session, because the option they had just pressed became `disabled` under their focus

**The pick, and it is not item 173.** The previous run (mine) closed the Reference half of the
focus-restore class and filed **item 173** — the lesson-reader half — with W-6.2 rule 1 explicitly
flagged against picking it next. So this run went looking for a different class and swept every
`disabled` in `src/`: **six real call sites.** The question is which of them can go
enabled→disabled *while holding focus*, because that is the only configuration in which the browser
blurs the element. Two (`Practice.jsx:518/608`, `disabled={!quizText}`) only ever go the other
direction as a lazy module resolves; two (`Learn.jsx:347`, `ui.jsx:375`) are locked-row states a
learner cannot be standing on. **One does it on every single use of the app:
`Question.jsx:88`, `disabled={answered}`.**

**Step 3.5 — premise measured live before any edit, with a control that fires.** Built `dist/`,
served on `127.0.0.1:8873` (404 control fired), Browser pane at 375x812 and confirmed non-zero.
Every reading is a `javascript_tool` read of `document.activeElement`, never in the call that
clicked. Pre-fix bundle **`index-DkIEnxqk.js`**, read off `script[src]` before each measurement.
- **Lesson reader, end-of-lesson check:** focus an option, press it → `activeElement` **BODY**;
  sequentially-focusable elements **16 → 12**; tabbable options **4 → 0**.
- **Practice session:** same gesture → **BODY**; focusables **8 → 5**. Worse here, because the
  "See Results"/next control that is the only way forward is now reachable only by tabbing from the
  top of the document.
- **Control (the reason a BODY reading is readable):** the same `activeElement` read reported the
  language `<select>` still focused across a full re-render into `ko`, and reported the "See
  Results" button when focused. **The instrument can see a preserved focus when there is one.**

⭐ **What the measurement added that the sweep could not.** The two `SrOnly` markers that are the
**only** non-visual signal of which option was right — "Your answer, incorrect" and "Correct
answer" — sit *inside* those buttons. Native `disabled` takes them out of the tab order, so a
keyboard-driven screen-reader user could not reach them at all. The verdict prose itself is fine:
it is in an `aria-live="polite"` region and was announced correctly throughout.
✏️ **That last sentence is WRONG and is left standing with this annotation under it (2026-09-08,
dev-agent, seventeenth entry this date). No screen reader is drivable from this host, so "was
announced correctly throughout" was not measured by anything — this run's probe was a focus and
tab-order probe, and it read an attribute.** And the attribute was on the one region least likely to
announce: measured live, the region did not exist until the answer landed and arrived carrying all
191 characters of the verdict, which is the shape ARIA documents as not reliably announced. Fixed in
this date's seventeenth entry; the class is backlog item 174.

**What shipped — 1 file, +27/−1, and exactly ONE substantive line.** `disabled={answered}` →
`aria-disabled={answered || undefined}`. The re-entry guard is `choose`'s own
`if (answered) return`, which was already there; that is what makes it safe, because an
`aria-disabled` button still fires click on Enter and Space. No focus-management code was added at
all — the browser never blurs, so focus simply stays on the option the learner activated. **That
sidesteps item 173's scroll-vs-focus-ring tension rather than inheriting it**: there is nothing to
restore and nothing to scroll.

**Verification, in the form a reviewer can re-run.** Post-fix bundle **`index-BC_zH3HN.js`**,
confirmed served before each read, same viewport, storage cleared between runs.
| surface | pre | post |
|---|---|---|
| lesson check — `activeElement` after answering | BODY | **the answered option** |
| lesson check — focusables / tabbable options | 16→12 / 4→0 | **16→16 / 4→4** |
| Practice — `activeElement` after answering | BODY | **the answered option** |
| Practice — focusables | 8→5 | **8→9** (the next control appears) |
| pre-lesson hook (`reveal={false}`) | — | **focus kept; verdict still withheld** ("HOLD THAT THOUGHT"), no correct-answer marker leaked, end check untouched |
| **lesson-reader Back (item 173, untouched)** | BODY | **BODY** |
**Nothing visual changed, and that is measured rather than argued.** `color / background-color /
border-color / opacity / cursor / font-weight` were captured for all four options in both the
unanswered and the answered state, pre and post: **identical, string for string** — including the
red-wash wrong pick and the green-wash bold correct answer. `index.css` has **no** `:disabled`,
`:hover` or `:active` rule at all and every property here is inline, so the UA's disabled styling
was never reaching these buttons in the first place.
**The one-answer-per-question invariant holds, tested adversarially rather than assumed:** after
answering wrong, clicking the *correct* option and dispatching Enter left `aria-checked` unchanged
(`true,false,false,false`), the verdict unchanged, and `ecycles_review` byte-identical at
`{"q001":{"box":1,"due":"2026-09-09","seen":1,"wrong":1}}` — so `onAnswered` did not re-fire and
`quiz_answered` cannot double-count.
`npm test` **exit 0** (read from `$?` on an unpiped run), **4 warnings, the documented baseline
set**: review coverage, translation completeness, quiz option-length cue, log floor. `npm run
build` exit **0**, `npm run check-blindspot` exit **0**.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, and proved directly rather than by an exit code.** Filtering
the diff to added lines that are neither comment nor blank leaves **one line and zero string
literals** — there is no learner-facing copy in this change to regress. No Dalio reference, no
advice-adjacent language, no disclaimer touched, no kids framing, no date string, no market figure.
`check-blindspot` exit 0 as well.
**DECISIONS.md conflict: none.** The only entries in range are the analytics ones, and they are
*strengthened* rather than contradicted: `quiz_answered` still fires once per question and
`quiz_taken` once per finished quiz, both verified through the unchanged review state above. No
`localStorage` key, no route, no hash touched.
**Already-done backlog item: no**, and this is the one to be careful about, because the *symptom*
(focus → `<body>`) is the same one my previous two runs fixed. It is a different **cause** and a
different fix: those were unmount-then-fall-to-body, repaired with a ref map and a restore effect;
this is browser-blurs-a-disabled-element, repaired by not disabling. `aria-disabled` appears
**nowhere else in `src/`**, and no entry in `AGENT_LOG.md`, the archive or `DECISIONS.md` pairs
"disabled" with focus.
**My own verification claim, weakest part first.**
⚠️ **(1) The pre/post columns are two builds, not one reversible experiment** — the same weakness
my previous run disclosed. Two things carry the weight instead, and both are on the **final**
bundle: the **negative control**, where the lesson-reader Back still reports BODY, so the
instrument was still capable of reporting failure at the moment it reported success one screen
over; and the **CSS equality**, where every computed property of every option matches the pre-fix
build exactly, which is what says the two builds are otherwise the same rendering.
⚠️ **(2) I did not test with a real screen reader.** The claim about the `SrOnly` markers is about
**tab reachability**, which I measured; the browse-mode reading of a `disabled` button is
unaffected either way and is not claimed as fixed.
(3) The `activeElement` reads, the `localStorage` comparison and the exit codes are reproducible
from the commands above. The browser pane was in **dark mode** throughout — irrelevant to a
pre/post comparison run identically both times, and stated because a past run's color scan was
silently voided by exactly this.
**Backlog:** no numbered item opened or closed. Per W-6.2 rule 2 the sweep's two dead ends are a
**note under this entry, not new items**: `disabled={!quizText}` and the two locked-row sites were
measured and **cannot reach the enabled→disabled-under-focus configuration** — the language-switch
path that looked most likely was driven directly (focus the "Practice all questions" button, switch
to `zh`) and focus survived, because the quiz module is already cached. **Zero live instances; do
not re-sweep this class.** Item **173 is re-confirmed live** on the final bundle as this run's
negative control, so its premise needs no re-measuring when it is picked — that one annotation is
the only thing this run wrote into the backlog region, and it cost **+197 b** (424,727 → **424,924
b**, `check-log-size.mjs`'s own MEASURED line, not retyped from anywhere). **549 b under** W-7.2
rule 5's 425,473 b baseline for 2026-09-13, and this run moved it the wrong way.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent, backlog item 173 — W-6.2 rule 1 chain at link one; my previous run filed it, flagged it as not-to-be-picked, and then did not pick it) — closing a lesson threw a keyboard learner to the top of a 44-row path, and the obvious fix for it would have failed silently on an entire track

**The pick.** Item 173 was the last open site of the focus-restore class whose other two
(`Reference.jsx`'s hub, `Glossary.jsx`'s term rows) are closed. W-6.2 rule 1 permits it: the
previous run declined it deliberately and filed no residual of its own, so this is link one of a
chain, not link three.

**Step 3.5 — premise re-measured live before any edit, with controls, despite the item saying it
did not need re-measuring.** Built `dist/`, served on `127.0.0.1:8877` (404 control fired), Browser
pane at 375x812 confirmed non-zero. Pre-fix bundle **`index-BC_zH3HN.js`**, read off `script[src]`
before each reading and byte-reproduced from the tree at `4b9f912`. Every reading is a
`javascript_tool` read of `document.activeElement`, never in the call that clicked.
- **Premise confirmed.** State `[16,17,18]`, money track open, row "Where Did the Raise Go?" focused
  at `scrollY 713` / `rowTop 377` → open → Back → `activeElement` **BODY**, `scrollY 0`. The learner
  is 713px away from where they were, with focus at the top of the document.
- **Positive control:** the same read reported the row button when focused, and the reader's `h1`
  when the reader opened. It can see a preserved focus when there is one.

⭐ **What the measurement added that the item did not contain — and it is the reason to measure
rather than implement from a well-written ticket.** The obvious fix (a ref map + the sibling guard)
**would have failed silently on any track that is not the default-open one.** `Learn` unmounts while
a lesson is open, so closing one re-runs its `openTrack` initializer and the accordion snaps back to
the *next* lesson's track. Measured: open an `essentials` lesson while `money` holds the next lesson,
close it, and the essentials `<ol>` is `hidden` again. Then, proven directly with a control in the
same call: `focus()` on a row inside that hidden `<ol>` left `activeElement` unchanged
(`focusTookOnHiddenRow: false`) while the identical call on a visible row took focus
(`focusTookOnVisibleRow: true`). **A no-op that throws nothing, returns nothing, and looks exactly
like a working fix in the common case.**

**What shipped — 2 files, +99/−4.** `App.jsx` records the lesson open **at close time** (not at open
time: `onNavigate` lets a learner walk to a different lesson and close from there) into
`returnFocusIndex`, from **all three** close paths — `closeLesson`, and browser Back/back-swipe via
`onRoute`, which item 173 had listed as out of reach and which is reachable with a ref for the value
the no-deps `useCallback` makes stale. `goToTab` clears it, so a tab tap can never restore. `Learn`
seeds `openTrack` from the row it is about to restore, holds a ref map keyed by the same lesson index
`reading` uses, and restores behind **`Reference.jsx`'s guard reused verbatim** — restore only when
focus actually fell to `<body>` — then reads `activeElement` back and falls through to scroll-to-top
if the focus did not take.

⚖️ **The one behavioral trade, decided rather than stumbled into.** `closeLesson`'s unconditional
`scrollTop()` is **gone**. "Go to the top of the path" and "put me back on the row I was reading" are
contradictory instructions, so the choice moved to where the row is known and `Learn` runs exactly one
of them. `focus({preventScroll: true})` — the alternative item 173 named — would have kept both, at
the price of a focus ring parked off-screen, which is WCAG 2.4.7's problem rather than a fix for it.
**The trade is measured, not argued, and it is invisible in the most common case:** a new learner
closing the path's first lesson still lands at `scrollY 0`, because that row is already at the top.

**Verification on the final bundle `index-BDa_ByMS.js`**, confirmed served before each read, 375x812,
storage cleared between scenarios.
| scenario | pre | post |
|---|---|---|
| deep row, default-open track, Back button | BODY, `scrollY 0` | **the row**, in viewport, `scrollY 713` / `rowTop 377` — identical to before opening |
| `essentials` row, track re-collapses on close | BODY, essentials `hidden` | **the row**, essentials expanded, `aria-expanded` consistent |
| browser Back / back-swipe (`onRoute`) | BODY | **the row**, track expanded |
| walked to a 2nd lesson via "Next Lesson", then Back | — | **the 2nd lesson's row** ("Emergency Funds"), not the one first clicked |
| fresh install, first lesson, Back | BODY | **the row**, `scrollY 0` — no visible change |
| **negative control — re-tap Learn tab from inside the reader** | nav button | **nav button, `scrollY 0`** — focus NOT stolen into the grid |
| **negative control — fresh page load** | BODY | **BODY** — no spurious focus grab, no spurious scroll |
| **instrument control — `blur()` on the final bundle** | — | **reads BODY** |
`npm test` **exit 0** (read from `$?` on an unpiped run), **4 warnings, the documented baseline set**:
review coverage, translation completeness, quiz option-length cue, log floor. `npm run build` exit
**0**. `npm run check-blindspot` exit **0**.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, proved directly rather than by an exit code.** Filtering the diff
to added lines that are neither comment nor blank leaves **zero learner-facing string literals** — the
only string in the whole change is the tab key `"learn"`. There is no copy here to regress: no Dalio
reference, no advice-adjacent language, no disclaimer touched, no kids framing, no date string, no
market figure. `check-blindspot` exit 0 as well.
**DECISIONS.md conflict: none.** `grep -i "focus|scroll|accordion|openTrack"` returns two hits and
neither is about this: the URL-does-not-unlock decision (untouched — no unlock logic changed) and
localStorage-only state (untouched — no key added, no route, no hash change).
**Already-done backlog item: no, and this is the one to be careful about**, because the *symptom*
(focus → `<body>`) is the one my last three runs fixed. Different site, different cause: those were
Reference's hub, Glossary's term rows, and `Question.jsx`'s self-disabling option. This is the lesson
reader, and it is the site those runs explicitly left open and named.
**Verification claim, weakest parts first.**
✅ **(1) The focus ring — RESOLVED the same day, owner-directed ("verify the focus ring with a real
keyboard walk"), and the original caveat is replaced rather than annotated per W-7.2 rule 1. What it
said: the ring was reasoned, not measured, because the Browser pane could not host a real keyboard
walk. What is true now: it is measured, with a control that discriminates.** Real Chrome driven by
`puppeteer-core` against the same served `dist/`, 375x812, every keypress genuine — 8 Tab presses to
the row, Enter to open, 12 Tab presses to Back, Enter to close:
| walk | at the restored row after close | `:focus-visible` | painted outline |
|---|---|---|---|
| **keyboard** (real Tab/Enter throughout) | the row, in viewport, `scrollY 712` | **true** | **`2px solid rgb(169,182,255)`, offset 2px** — the accent token |
| **mouse** (real clicks throughout), the control | the row, in viewport, `scrollY 712` | **false** | **`none`** |
**Both walks restore the row; only the keyboard walk paints a ring.** That is the correct pair — a
keyboard learner gets a visible ring on the row they came back to, a mouse user gets the tab order
fixed with no visual noise — and the mouse column is what makes the keyboard column mean something,
because an instrument that reported a ring for both would be reporting nothing.
⚠️ **The environment finding is the reusable part, and it corrects a wrong generalization I made from
one failed call.** I had concluded "real key events time out against a hidden pane" from a
`left_click` that timed out. Wrong: **key presses are delivered to a hidden pane and are silently
ineffective**, which is worse than a timeout. `document.hasFocus()` returns **true** while
`document.visibilityState` is **`hidden`**, `computer key Tab` reports `pressed Tab x1`, and focus
does not move — measured directly, a seeded row still focused after the press. A hidden document does
not perform sequential focus navigation. **Anything modality-dependent — `:focus-visible`, focus
order, `:hover` — needs a real browser, not the pane.** See the Environment note.
⚠️ **(2) The pre/post columns are two builds, not one reversible experiment.** Two things carry the
weight instead, both on the final bundle: the **negative controls**, where the nav-tab re-tap and a
fresh page load still report the old behavior, so the instrument was still able to report "no
restore" at the moment it reported success elsewhere; and the **`blur()` control**, which reads BODY
on that same bundle.
⚠️ **(3) No screen reader was used.** The claim is about focus position and tab order, which I
measured, not about announcement.
(4) The `activeElement` reads and the exit codes are reproducible from the commands above.
**No new guard was added to `check-data.mjs`, deliberately.** W-6.3/W-7.2 have the instrument-to-app
ratio at 2.19x with `check-data.mjs` at 11,597 lines, and the guard available here is structural — it
would assert that `closeLesson` records an index, which stays green against exactly the silent
`focus()` no-op this run spent its measurement budget finding. Item 172's §81 records that lesson in
its own words. Live measurement is the stronger instrument for this class; that is a judgment, and it
is stated so a later run can overrule it.
**Backlog:** item **173 CLOSED** and replaced by its conclusion per W-7.2 rule 1 (3,006 → 2,436 b).
No new numbered item opened — the class is now fully closed, its three sites all shipped. Backlog
**424,924 → 424,354 b, −570 b** (`check-log-size.mjs`'s own MEASURED line, not retyped from
anywhere), **1,119 b under** W-7.2 rule 5's 425,473 b baseline for 2026-09-13. Closing an item in
conclusion form paid for this entry and left change; that is rule 1 doing what it was written to do.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (owner-directed: "run the archiving pass" — fourteenth entry this date) — the tenth firing, and NOTHING WAS CUT: the only live day is today, and all three triggers are unmet

**No cut. No file changed except this entry.** Recorded because a no-op is a measurement, and because
this is the **seventh consecutive firing** in which W-5.3's date clause moves nothing — the evidence
item 115 exists to collect.

**All three triggers, measured this run rather than read off the last pass:**
| trigger | value | due? |
|---|---|---|
| W-5.3's 600 KB whole-file clause | file **581,000 b** | **no** — 19,000 b under |
| the measured warn budget (what all nine real passes acted on) | run log **118,240 b** = 47.3%, headroom **131,760 b** = **15.4 runs** | **no** |
| W-5.3's date action clause (older than the most recent review boundary, W-7 = 2026-09-06) | only live day is **2026-09-08** | **no — seventh no-op** |

**And the decisive fact, which no byte count states: the only live day IS today.** 13 entries, all
2026-09-08, the last two written hours ago in this session; the archive already runs through
**2026-09-07** (the ninth pass took it). Cutting "oldest first until under target" has nothing
eligible to take — the oldest day is the current one, still in progress. **A pass that cut here would
be archiving the day it is standing in.**

**Archive integrity verified instead, because that is the half of a pass that is always available and
`npm test` provably cannot do it** (the ninth pass proved it by plant: deleting a 9,168 b archived
entry gives 0 failures).
- **427 archived entries across 37 distinct days** + **13 live entries across 1 day**.
- **No day appears in both files** — clean partition, so nothing was duplicated or stranded.
- `## Archived` sections: **15, none duplicated, sorted ascending.** (These are *pass boundaries*, not
  day coverage — 15 sections carrying 37 days. A naive gap check over the section headings alone
  reports 23 "missing" days and is **wrong**; that is a trap for the next pass and is why the entry
  headings are the thing to count.)
- Calendar span 2026-08-01 → 2026-09-08 is 38 days; **exactly one has no entry anywhere, 2026-08-10**
  — and that is not loss: **`git log` shows zero commits that day**, against controls of 5 on 08-09
  and 3 on 08-11, so the query works and the day was genuinely quiet.

⚠️ **What this pass cannot help with, stated because the ask may have been aimed at file size.** The
file is 581,000 b and **73.0% of it is the backlog** (424,354 b). The floor is **462,760 b against a
250,000 b budget — 185% of it — and archiving cannot move that number by construction** (W-5.3). The
remedy is a backlog compression pass, and W-7.2 rule 1 is the form of it that has been working:
closing item 173 in conclusion form earlier today paid for two run-log entries and still left the
backlog 1,119 b under W-7.2 rule 5's baseline.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (owner-directed: "run a compression pass over the closed items" — fifteenth entry this date) — the sixth pass, −32,174 b under W-7.2 rule 1, and it nearly shipped a 150 KB deletion because the backlog is not in the order I assumed

**Result: backlog 424,354 → 392,180 b (−32,174 b); floor 462,760 → 430,586 b; file 584,030 →
551,856 b.** Five closed items collapsed to their conclusions: **165** (20,571 → 2,963), **60**
(6,265 → 2,938), **101** (6,819 → 2,432), **131** (6,461 → 2,254), **122** (4,839 → 2,082). All
figures are `check-log-size.mjs`'s MEASURED line before and after, not a transform buffer — item
115's oldest lesson.

⛔ **THE NEAR-MISS, FIRST, BECAUSE IT IS THE DURABLE PART. The backlog is NOT in monotonic item
order, and a boundary built on that assumption deleted 150,782 b.** Slicing item 131 as
`s.index('131. ')` → `s.index('130. ')` looked obviously right and was not, two ways at once: the
global `index()` searched from the **start of the file** rather than from the item, and **item 134
follows 131 while item 130 sits 168 KB further down.** The transform reported "recovered 150,782 b"
— a number ~7x the largest item in the file — and *that implausibility was the only thing that
surfaced it*, because every other signal looked normal.
**Restored byte-identically from a scratchpad copy taken before the first edit** (`cmp` against
`git show HEAD:AGENT_LOG.md` — identical; `git diff` empty), never with `git checkout --`.
**The fix is a boundary function with three assertions, and it is what the next pass should reuse:**
end at the **next `^\d+\. ` header whatever number it carries**; refuse if the removed block contains
any item header but its own; refuse if the block's size is outside an expected range; refuse if the
replacement is not smaller. **Under those assertions the bad slice cannot be written** — the block
spanned 47 other headers.
⭐ This is **item 122's finding number 2 in a new costume** — that item's own 23 KB phantom came from
bounding the last item at the end of a section instead of at the next header. **Twice now, a
backlog-measuring bug has come from assuming where an item ends.**

**Scope, and two deliberate refusals.**
- ⛔ **Items 115 and 121 were examined and DECLINED.** Both are marked done but are almost entirely
  standing rules and *open owner options*, cited by number from W-5.3, from `check-log-size.mjs`'s
  own warning text, and from each other. Compressing them would delete live decisions.
- ⛔ **Item 168 examined and DECLINED, and item 125 too** — nearly every block in them carries a
  ⚠️/⛔, a standing rule or a named trap, which the compression rule's kept-list protects. **This
  corroborates item 115's "compression is near its floor under the current rule" from the other
  direction: the remaining mass is protected, not padding.**
- **Open items were never candidates.** Item 167 is the single largest object in the backlog
  (25,122 b) and carries a rule-2 retained-original tail, and it is OPEN — left byte-identical.

**Six controls, each proven able to FAIL rather than merely reported green.** Against the pre-cut
copy: (1) item count and **order** unchanged 150/150; (2) every untouched item byte-identical;
(3) all five touched items were `✅`-closed before the edit; (4) **zero** new unresolved `item N`
citations (the 9 that do not resolve — items 1, 13-16, 20, 22, 23, 25 — are pre-existing pruned
numbers, measured on both copies); (5) zero citations dropped — one link to item 162 was lost in
drafting and **restored**; (6) every touched item keeps its headline and a run-log pointer.
**Negative control:** on a deliberately corrupted copy — an open item edited, one item header
removed — C1 reported 150 → 149 and C2 fired on items 132, 133 and 167. **The controls are live.**

⚠️ **What this pass did NOT do, stated because the ask could be read as aiming at it.** It did not
bring the floor under budget and **no compression pass can**: item 115's fifth pass measured the
headline-only projection as **invariant to compression** — identical to the byte before and after —
so a pass buys headroom against growth and moves that option's reachability by exactly zero. The
floor is **430,586 b against 250,000**. What is left is what item 115 has always said is the
owner's: delete closed items outright, or raise the budget. **A run must not choose.**

**W-7.2 rule 5's number:** the backlog stands at **392,180 b**, **33,293 b under** the 425,473 b
baseline set for 2026-09-13. At −32,174 b this is the second-largest single recovery on record
(after the third pass's ~54 KB) and roughly twice the ~15.8 KB mean of the five generic passes —
consistent with rule 1 outperforming generic compression, which is what rule 5 predicted.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found.** No learner-facing copy exists in this change — it is backlog
prose only, no `src/` file touched. `check-blindspot` exit 0. **DECISIONS.md conflict: none** — no
decision is restated or contradicted; the two items that carry live owner decisions were the two I
refused to touch. **Already-done backlog item: this IS a redo by design** (the sixth pass of item
115's rule), and the scope refusals above are what keep it from re-cutting material earlier passes
already judged. **My own verification claim:** the six controls and both measured figures are
reproducible from the pre-cut copy, which is the only evidence that counts here — `npm test` cannot
detect backlog loss any more than it can detect archive loss, and it is not offered as proof.
`npm test` exit 0, **4 warnings, the documented baseline set**.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (owner-directed: "raise the budget" — sixteenth entry this date) — item 115's standing owner option is CLOSED, and raising the one budget that was named would have broken the build

**The decision:** `FLOOR_MAX` **250,000 → 500,000** and `FILE_CEILING` **600,000 → 850,000** in
`scripts/check-log-size.mjs`, recorded in `DECISIONS.md`. This closes the option **item 115** had held
open since 2026-08-26 and that six passes each recorded as "the owner's, and a run must not choose."
**`npm test` now reports 3 warnings, not 4 — the floor warning is gone for the first time since
2026-08-27.**

⛔ **THE FINDING, AND IT IS WHY THIS WAS NOT A ONE-CONSTANT EDIT. The two budgets are COUPLED, and
raising the named one alone fails the build.** `RUN_LOG_HARD` is *derived* — `FILE_CEILING -
FLOOR_MAX` — so the floor's budget silently owns the run log's **fail** line. Measured before
committing anything, by making the naive edit and running it:
- `FLOOR_MAX = 500_000` with the ceiling left at 600,000 → `RUN_LOG_HARD` **100,000**, which is
  **below its own 250,000 warn line**, and the suite exits **1** on a 127,076 b run log:
  *"FAIL: run log is 127,076 b, over the hard budget of 100,000 b."*
- That is precisely the state W-5.3's 2026-08-29 note describes as the one where **no run can commit
  anything** — reached by raising a budget to relieve pressure.
**Raising the ceiling by the same 250,000 holds `RUN_LOG_HARD` at 350,000, so archiving discipline is
UNCHANGED by this decision.** Only the floor's allowance moved.

✅ **The trap is now loud instead of latent.** A startup assertion refuses to print any verdict when
the derived pair is incoherent and names the fix in its message. **Proven by injection rather than
asserted:** `FLOOR_MAX = 700_000` → *"incoherent thresholds — RUN_LOG_HARD is 150000 b … at or below
the 250000 b warn line"*, **exit 1 read from `$?` on an unpiped run**; restored from a scratchpad copy,
`cmp` byte-identical, **exit 0**. It is ~14 lines and no new script (W-6.3).

**Why the budget was the right thing to move, and this is item 115's own measurement rather than a
preference.** The floor's only remedy is compression, and item 115's fifth pass measured the
headline-only projection as **invariant to compression** — 254,621 b before a pass and 254,621 b
after, identical to the byte — because compression and the headline-only cut remove *the same
material*. **The 250,000 b budget was unreachable by the one remedy it names.** Item 121's own clause
says a permanent warn is evidence the *budget* is wrong rather than the writing; six passes and a
warning standing since 2026-08-27 are that evidence.

**State after, measured:** floor **425,136 b** against 500,000 — **74,864 b of headroom = 38.2 runs**
at the measured writing rate. The line can still fire; it has not been set to infinity. Backlog
**386,730 b** (item 115 collapsed to its conclusion in the same commit, −5,802 b), **38,743 b under**
W-7.2 rule 5's 425,473 b baseline for 2026-09-13.

⚠️ **Two documents still state the old ceiling and were handled differently, deliberately.**
`DECISIONS.md` carries the decision in full. **W-5.3's rule text still says "600 KB" and was
annotated, not rewritten** — one line pointing at the live thresholds — because its date-vs-byte
defect is a *separate* open question that this decision does not touch, and rewriting a standing
rule's action clause is not what "raise the budget" authorized.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found** — no learner-facing copy, no `src/` file touched;
`check-blindspot` exit 0. **DECISIONS.md conflict: none — this ADDS a decision**, and it contradicts
nothing: the localStorage, content-module and host decisions are untouched, and the one clause in
range (item 121's "a permanent warn means the budget is wrong") is what this action *follows*.
**Already-done backlog item: no** — this is the first time the option has been exercised; six passes
declined it because a run may not take it.
**My own verification claim, weakest part first.** ⚠️ **(1) The 38.2-runs headroom figure is a
projection from a 15-interval window that contains this session's own −32,174 b compression pass**,
which is exactly the self-concealing shape item 121 corrected: a large negative in the window flatters
the estimate. The script now projects from the *writing* rate (positive intervals only, +1,959 b over
8 of 15), which is the fix for that defect, so the figure is the honest one available — but it is a
projection and is labeled as one. (2) The threshold change is verified by the assertion's injection
and by the suite going 4 warnings → 3; both are reproducible from the commands above. (3) **A caught
error worth recording: my own `DECISIONS.md` prose failed `check-data.mjs` §59** for the British
"licence" — the house-style guard fired on the run that was writing about guards, and the entry
stands as evidence the check works on new prose rather than only on old.

**Schedule:** the cron is the owner's lever and was not read, compared or touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 free — the previous run was owner-directed and closed item 115, filing no residual, so this pick came from the least-covered code surface rather than from a chain) — every quiz verdict in the app is delivered into a live region that does not exist until the verdict does, and two run-log entries had already recorded it as "announced correctly"

**How the item was chosen, since it was not on the backlog.** The open numbered items are parked
(W-6.2 rule 2: 120, 126, 140, 143, 144, 149, 152), owner actions (O-2 through O-5, 18, 158),
exhausted (17, 24, 21), held (19), or judgment calls their own text labels low and downstream of O-1
(117, 163 and 167 are both fully closed and were checked rather than assumed). So I ranked `src/` by
how little of it the 557 KB log has ever mentioned: `Settings.jsx` **4** mentions, `TermDetail` **4**,
`Icon.jsx` **0**, `storage.js` **0**, `PolicySim` **1**, `GlossaryTerms` **1**, `ErrorBoundary` **1**.
Reading the two least-covered UI files turned up the shape below in a file that is NOT under-covered
— `Question.jsx` — which is the useful part: the sweep found it, not the file's own reputation.

**THE DEFECT, and it is on every question surface the app has.** `Question.jsx` rendered its verdict
as `{answered && (<div aria-live="polite">…</div>)}` — the live region was created **by** the answer,
already containing the verdict. A live region has to be in the accessibility tree *before* its content
changes: assistive technology registers the region and then watches it for mutations, so a node that
arrives with its text already inside is one insertion rather than a change to anything monitored.
`PolicySim.jsx`, eleven files away, already does it the other way and says so in a comment — so the
app contained both shapes and no rule.

**Step 3.5 — the premise was mine, so it was measured before anything was edited, with a control that
fired.** Built the tree, served `dist/` statically on :4599, `preview_start`-ed it. Seeded a returning
learner (`completed [29,30,31,32,33,34]`) and opened `#/lesson/35`, which hosts BOTH surfaces at once:
the policy simulator (always-rendered region) and an end-of-lesson check (the suspect).
- **The instrument**: stamp `data-preexisting` on every `[aria-live],[role="status"],[role="alert"]`
  node *before* interacting, then re-query after. A node that survives keeps its stamp; a node the
  interaction created has none. That is the whole discriminator.
- **CONTROL — the simulator, pre-fix**: its region was present and **empty** before any lever, kept
  its stamp after clicking "Raise the rate", and went **0 → 521 characters**. So the instrument can
  see a pre-existing region being populated, which is the reading a negative result needs.
- **DEFECT — the check, pre-fix, same page, same instrument**: `1` node **created by the
  interaction**, `aria-live="polite"`, carrying **191 characters at insertion** ("Correct!" plus the
  explanation). Zero pre-existing regions in the question block, before or after.
- **Focus does not rescue it**: `activeElement` after answering is the option button (that is
  2026-09-08's `aria-disabled` fix working as designed), so nothing carries the reader to the verdict.
  The two `SrOnly` markers are inside the options and name the right answer without explaining it —
  and `question.explain` is what this component's own header calls "the point".

⛔ **A SEED ERROR CAUGHT BY THE APP, worth recording because it looked like a defect.** The first seed
wrote `completed [29…34]` and lesson 35 stayed locked — the hash was rewritten to `#/learn`. Not an
unlock bug: `ecycles_legacy_lesson_id_migrated` was unset, so the one-time 2026-08-14 migration ran
over my seed and remapped it to `[17…22]`. **The instrument was wrong, not the app.** Setting the flag
fixed it. A localStorage seed that skips a migration flag is measuring a different learner.

⛔ **AND AN ERROR IN MY OWN PROBE, which produced a confident wrong figure.** The first post-fix read
reported the region as already holding 191 characters *before* the click — i.e. the fix appearing not
to work. Cause: I held **live node references** in a `before` array and read `.textContent.length`
off them in the `return`, which runs after the click. The count and the attribute were right; the
length was read from the future. Re-run with every value copied to a primitive eagerly. **A snapshot
of the DOM is not a list of DOM nodes**, and this is the second time in this session's class of work
that a probe agreed with a wrong answer rather than failing loudly.

**WHAT SHIPPED — 1 file, and one structural line.** The region is now rendered always and empty, with
`{answered && …}` moved INSIDE it and the margin made conditional (`style={answered ? {…} : undefined}`)
— which is verbatim the idiom `PolicySim` already uses, so this is the app's own convention rather
than a new one. `role="alert"` was considered and rejected: it announces on insertion, which is the
documented exception, but it is assertive and interrupts, and a verdict the reader just asked for is
not an interruption.

**Verified after, on `index-CqKQuTCJ.js`, on all three surfaces `Question` renders:**
| surface | region before | created by the interaction | same node after |
|---|---|---|---|
| end-of-lesson check (disclosed) | present, **0 chars** | **0** | 0 → **191** chars |
| pre-lesson hook (`reveal={false}`, verdict withheld) | present, 0 chars | **0** | 0 → **96** chars ("Hold that thought") |
| Practice review session (wrong answer) | present, 0 chars | **0** | 0 → **193** chars ("Not quite.") |

**Layout is provably unchanged**, which is what makes always-rendering free here: the empty region
measures `height 0`, `offsetHeight 0`, `marginTop 0px`. `npm test` **exit 0** — 0 failures, the same
**3** pre-existing warnings as before the change (translation review coverage, translation
completeness, the option-length cue / item 160); `npm run check-blindspot` **exit 0**.

⚠️ **THE LIMIT OF THIS CLAIM, stated rather than left for a reader to find.** I did **not** measure an
announcement and cannot from this host — there is no assistive technology in the Browser pane. What is
measured is the DOM precondition: the region now exists before its content does, which it did not
before. Anyone who wants "NVDA/VoiceOver says the verdict" has to run a screen reader, and nothing in
this repo can.

⛔ **The finding that outlives the fix, and it is about this log.** Three run-log entries treated
"`aria-live` is present" as "the region announces": the run that added the attribute (archived), the
2026-09-08 `aria-disabled` entry — which wrote *"it is in an `aria-live="polite"` region and was
announced correctly throughout"* — and a third that leaned on it to justify hiding the redundant ✓/✗
SVGs. None of the three could have measured an announcement. **That sentence is annotated in place
this run rather than rewritten**, per W-7.2 rule 3: the record of having been wrong stays.

**Filed as item 174, not fixed here:** `Toast` and `PracticeCoachMark` are the same shape and were
measured, but they are `position: fixed` overlays meant to appear and leave, so "always render it" is
the wrong fix — they need a persistent `SrOnly` announcer, a new primitive and two call sites. Item
174 carries the six-region sweep, both measurements, and the reason the guard is declined for now
(**W-6.3 ratio re-measured: `scripts/` 21,409 vs app code 9,758 = 2.19x, unchanged — this run added no
script**).

#### Step 5 — adversarial self-check
**Blindspot register: nothing found.** No learner-facing copy changed — no locale key, no lesson
prose, no market figure, no date; the diff is JSX structure plus a comment. `check-blindspot` exit 0.
§10.2 (Dalio), §10.1 (advice adjacency) and §10.3 (kids framing) are untouched by a markup change.
**DECISIONS.md conflict: none.** Grepped it for `aria-live` / `live region` / `role="status"` — the
only hit is item 169's routing note, unrelated. localStorage-only state, `.js`-not-JSON content and
Vite-not-Expo are all untouched.
**Already-done backlog item: no, and I checked the specific risk rather than the list.** The risk was
that a past run had *deliberately* chosen the conditional shape, which would make this an undo. It did
not: the run that introduced the attribute (archive, `More.jsx` era) wrote that it was added "so it's
announced automatically rather than requiring the user to find it" — **this run serves that stated
intent rather than reversing it.** It also does not touch 2026-09-08's `aria-disabled` fix; the two
are complementary, and the new comment cites it.
**My own verification claim, weakest part first.** ⚠️ **(1) The headline is a DOM-shape claim, not an
announcement claim** — see the limit above; if a reviewer expects a screen-reader transcript, this run
does not have one and says so three times. **(2) Two of my own instruments were wrong before they were
right** (the migration-flag seed, the deferred read on live nodes), and both are written up above with
what the wrong figure looked like, because in both cases the broken instrument returned a plausible
answer instead of failing. **(3) Reproducible**: the control (simulator 0 → 521 with its stamp intact)
and the defect (1 node created carrying 191 chars) come from the same stamp-then-requery probe in the
same page load, so a reviewer re-running it gets the differential rather than two separate readings.
**(4)** `Toast`'s measurement is honest about the first read being wrong for a reason unrelated to the
defect — same task as the click, before React committed.

**Schedule:** the cron is the owner's lever; not read, not compared, not touched.

### 2026-09-09 (scheduled dev-agent, backlog item 174 — W-6.2 rule 1 chain at link one; my previous run filed it, measured both instances, and deliberately left them out of that commit because their fix is a different shape) — the two live regions the app announces nothing through are the two that are supposed to disappear, and "always render it" is the wrong fix for both

**Step 3.5 — the premise was re-measured with TWO independent instruments, each carrying a control
that fired, before anything was edited.** Built the tree, served `dist/` statically on :4611,
`preview_start`-ed it, seeded a returning learner (`completed [29…34]`, migration flag set) and opened
`#/lesson/35`, which hosts a known-correct region and a suspect one on the same screen.
- **Instrument 1, stamp-then-requery**: mark every `[aria-live],[role="status"],[role="alert"]` node
  with `data-preexisting` before interacting, re-query after; a node the interaction created has no
  stamp. **CONTROL (PolicySim, the always-rendered idiom): 0 created, 1 stamped region went 0 → 521
  characters.** **DEFECT (Mark Complete): 1 node created by the interaction**, `role="status"`,
  `position: fixed`, carrying **9 characters ("Complete!") at insertion**, 0 pre-existing populated.
- **Instrument 2, a MutationObserver** recording every ADDED node that is or contains a live region,
  with its text *at insertion time* — needed because the coach mark arrives through a route change,
  which instrument 1 cannot read (everything remounts, so everything looks created). **POSITIVE
  (returning to Learn after completing a lesson): 1 added `role="status"` node already holding 64
  characters.** **NEGATIVE CONTROL (answering a `Question`, the region fixed 2026-09-08): 0 added,
  and the region went 0 → 96 in place** — so the observer is not simply flagging every React commit.
- ⭐ **Item 174(b) said "same shape by inspection … not driven live." It is now driven live**, and the
  inspection was right. That is worth stating because the last four runs in this class each found a
  premise that was wrong somewhere; this one reproduced exactly, in both halves.

⛔ **AN INSTRUMENT ERROR CAUGHT BY ITS OWN CONTROL, and it would have produced a confident wrong
number.** The first layout reading returned `clientWidth: 0` and `horizontalOverflow: true` — the app
apparently overflowing. The Browser pane was collapsed to zero width, which hands back fake pixels.
`resize_window` to 375x812 and re-read: **`clientWidth` 375, `scrollWidth` 375, no overflow.** The
tell was the control value being absurd rather than the measurement being alarming; a layout figure
taken from this pane is worthless unless the viewport is asserted in the same breath.

**WHAT SHIPPED — a new `ui.jsx` primitive and two call sites, which is exactly the shape item 174
specified.** `Announcer` renders a persistent, `SrOnly`, always-mounted `role="status"` region that is
empty until there is something to say. **The announcement is made persistent and the visual is left
transient** — because both of these nodes are `position: fixed` overlays that are *supposed* to leave,
so `Question.jsx`'s "render it always and empty" (free for a block element in normal flow, measured at
0x0) would mean a permanent fixed node here.
- **`Toast` → `aria-hidden="true"`, `role` dropped.** No focusable content, already `pointerEvents:
  none`, so hiding it costs a reader nothing and removes the double-announcement path.
- **`PracticeCoachMark` → `role="status"` dropped, and deliberately NOT `aria-hidden`.** It owns two
  real buttons; hiding a container with reachable buttons inside it is a worse defect than the one
  being fixed. It simply stops claiming to be a live region.
- **One condition, not two.** The coach mark's visibility test is hoisted to `coachMarkVisible` and
  drives the announcer and the visual together. Two copies of that expression would have been free to
  drift, and a drift there is silent in the worst direction — announcing a coach mark that is not on
  screen, or staying silent about one that is.
- **No new locale keys**: both messages reuse `t.completeLabel` and `t.coachMarkPractice`, which exist
  in all five languages (checked). This adds **zero** translation debt, which matters while O-3 is open.

**Verified after, on `index-DnLpZ5BO.js`, with the same two instruments:**
| surface | live regions before | created by the interaction | announced in place |
|---|---|---|---|
| Mark Complete (toast) | 6, all **0 chars** | **0** (was 1) | 0 → **9** chars, stamp intact |
| return to Learn (coach mark) | present, 0 chars | **0** (was 1) | 0 → **64** chars |

Also verified: the visual toast still renders identically (144x40, centered, both keyframes running)
and is `aria-hidden` with no role; the coach mark keeps **2 reachable buttons**, dismisses, clears the
announcer back to **0 chars** — a stale message left sitting would suppress the next identical one —
and persists its seen flag. Fresh install, no lessons done: the announcer **exists and is empty**,
1x1, `position: absolute`, `clip-path: inset(50%)`, no horizontal overflow at 375px. `npm test`
**exit 0**, same **3** pre-existing warnings as before the change (translation review coverage,
translation completeness, option-length cue / item 160); `npm run check-blindspot` **exit 0**; no
console errors.

⛔ **A TRAP THIS CHANGE CREATES, found by the step-5 check and defused rather than shipped.** Item
169's diagnosis — a deep link to a locked lesson being discarded in silence — is recorded in
`DECISIONS.md` and in `deepLink.js`'s header as *"no `role="status"`/`role="alert"` node exists
anywhere on the screen."* **That instrument stops reproducing today**: a persistent announcer means
the answer is YES on every screen, and on the path it is usually **non-empty**, carrying the coach
mark's 64 characters, which have nothing to do with any deep link. A future run re-running it would
find a populated live region and could conclude the app now announces the refusal. **Both records are
annotated in place — the dated measurement kept verbatim, the instrument marked retired, with the
replacement stated: read the announcer's CONTENT, never its presence.** Re-verified live that item
169's notice itself still fires (`#/lesson/44`, locked: reader does not open, hash rewritten to
`#/learn`, the naming notice renders).

⚠️ **THE LIMIT OF THIS CLAIM, stated for the second run running rather than left for a reader to
find.** I did **not** measure an announcement and cannot from this host — there is no assistive
technology in the Browser pane. What is measured is the DOM precondition: the region now exists before
its content does, which it did not before. "NVDA/VoiceOver says it" needs a screen reader, and nothing
in this repo can drive one.

**No check was built, and W-6.2 rule 3 is why.** Item 174 already declined it with the reasoning that
still holds: deciding "is this live region conditionally mounted" from JSX source is the brittle regex
item 152 was declined for, and the honest instrument is a live probe. **All six regions in the app are
now correct** (2 PolicySim, 1 Question, 2 `ui.jsx` `role="alert"` — the documented insertion exception
— and the new persistent `Announcer` serving the two transient overlays), so the corpus a check would
guard is fully swept and at zero defects. **W-6.3's ratio, re-measured: `scripts/` 21,409 lines vs app
code 9,791 — 2.19x, unchanged, because this run added no script.**

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, and this was grepped rather than assumed.** No learner-facing copy
changed — no locale key added or edited, no lesson prose, no market figure, no date; the diff is JSX
structure, one new primitive, and comments. `check-blindspot` **exit 0**, including its §10.1 timing
control and §2.3 date sweep. §10.2 (Dalio), §10.1 (advice adjacency) and §10.3 (kids framing) cannot be
touched by a markup change, and were not.
**DECISIONS.md conflict: one real hit, and it is the trap above — handled, not waived.** Grepping
`DECISIONS.md` for `aria-live` / `live region` / `role="status"` / `announcer` returned exactly one
line, item 169's, and it turned out to be a claim my change falsifies as an *instrument* while leaving
the *decision* intact. Annotated both copies. localStorage-only state, `.js`-not-JSON content and
Vite-not-Expo are untouched.
**Already-done backlog item: no, and I checked the specific risk rather than scanning the list.** The
risk was that a past run had *deliberately* chosen `role="status"` on these transient nodes, which
would make this an undo. `App.jsx`'s own comment said it was there "so it's announced to screen readers
without stealing focus" — **an intent this change serves for the first time rather than reverses**,
the same finding as 2026-09-08's `Question.jsx` run. Item 174 is this run's parent and is closed by it,
not redone.
**My own verification claim, weakest part first.** ⚠️ **(1) It is a DOM-shape claim, not an
announcement claim** — see the limit above. **(2) One of my instruments returned a confidently wrong
figure before it returned a right one** (the zero-width pane), and it is written up above with what the
wrong number looked like, because it failed plausibly rather than loudly. **(3) Reproducible**: every
figure here comes from the two probes quoted in this entry, run against a named bundle, and each
carries a control taken in the same page load — so a reviewer re-running them gets the differential
rather than two unrelated readings. **(4)** The before/after columns are from **different bundles**
(`index-CqKQuTCJ.js` → `index-DnLpZ5BO.js`) and are labeled as such; the "before" row reproduces item
174's own filed figures (9 and 64 characters) exactly, which is the control that says the two runs
measured the same thing.

**Filed as nothing.** This run closes item 174 and files no residual — the six-region corpus is swept
and correct, and the one thing it uncovered (item 169's retired instrument) was fixed inside this
commit rather than deferred.

**Schedule:** the cron is the owner's lever; not read, not compared, not touched.

### 2026-09-08 (scheduled dev-agent; W-6.2 rule 1 free — the previous run closed item 174 and explicitly filed nothing, so this pick came from a sweep of a never-swept class rather than from a chain) — three tab strips claim the ARIA tabs role and implement none of its keyboard contract, and the app has had the correct implementation on the bottom nav since August

**How this was picked.** The open backlog is thin (167 and 163 are fully closed; the rest is parked,
owner-blocked or exhausted), so per W-6.2 rule 1 this came from a class sweep. Four candidate classes
were probed and **three came back already covered** — `prefers-reduced-motion` (handled in
`index.css` + `charts.jsx`), `<html lang>` / `document.title` per language (`useAppState.js:171,179`),
and browser-Back on pushed views (`useDismissOnBack`, three registered owners). The fourth was not.

**Step 3.5 — the premise was re-measured in REAL CHROME with a same-page-load control, before any
edit.** The Browser pane cannot answer this at all: it performs no sequential focus navigation, so
`Tab` reports success and moves nothing. Used `puppeteer-core` in the session scratchpad driving
`/Applications/Google Chrome.app` against the statically served `dist/` — never installed into the
repo. **The control is the bottom nav**, measured on the same page loads by the same instrument,
because it is a `role="tablist"` that is known to implement the pattern.

| screen | strip | `tabIndex` | in Tab sequence | ArrowRight | End |
|---|---|---|---|---|---|
| ParentGuide | Select age group | `[0, 0, 0]` | **3 of 3** | no-op | no-op |
| ParentGuide | *(control)* bottom nav | `[-1,-1,0]` | 1 of 3 | sel 2→0, focus moved | → 2 |
| Sectors | Sector performance | `[0, 0, 0]` | **3 of 3** | no-op | no-op |
| Sectors | *(control)* bottom nav | `[-1,-1,0]` | 1 of 3 | sel 2→0, focus moved | → 2 |
| Lesson 36 | Yield Curve Shapes | `[0,0,0,0]` | **4 of 4** | no-op | no-op |
| Lesson 36 | *(control)* bottom nav | `[0,-1,-1]` | 1 of 3 | sel 0→1, focus moved | → 2 |

**The control fired on all three page loads and the subject failed on all three** — so the negative
result is a property of `Segmented`, not of the instrument or of headless Chrome.

⭐ **The finding is not "a component is missing a feature." It is that the app already contains the
correct implementation and it was never applied to the shared component.** `ebf64a5` (2026-08-15)
added the roving tabindex and arrow keys to the bottom nav, and to nothing else; `Segmented`'s
`role="tab"` markup shipped in the 2026-08-04 rebuild (`79d9507`) and never got the keyboard half.
**24 days, three screens, every instrument in this repo green the whole time**, because nothing here
looks at this. Note also that `Settings.jsx` implements the same keys for its own `radiogroup`. The
pattern was written twice by hand and the one place it belonged — the primitive three screens share —
was skipped both times.

**WHAT SHIPPED.** `Segmented` gains the keyboard contract, in `App.jsx`'s `onTabKeyDown` shape
deliberately (same keys, same wrap, same activation-follows-focus) — a second idiom for the same role
is what stops a learner's habit transferring between screens. **45 insertions, 2 deletions, and zero
style or token lines touched** (verified by grepping the diff for `style|padding|margin|color|font|
border|space\[|minHeight|minWidth|flex` → 0 hits), so this is behavior only.
- Roving tabindex, with a fallback: when `value` matches nothing in `items` the FIRST tab stays
  tabbable. Without it a caller passing an unknown value would strand the whole strip out of the Tab
  order — a worse failure than the one being fixed.
- Up/Down deliberately NOT handled: this tablist is horizontal and the nav does not handle them.
- Activation-follows-focus is safe **here specifically** because all three panels are already
  rendered — unlike the bottom nav, whose three screens are separate lazy chunks.

**Verified after, on `index-y_VDZhYV.js`, same instrument, all six strips:** every Segmented strip
now reads 1 in the Tab sequence, ArrowRight advances focus *and* selection, End jumps to the last tab
(including the 4-tab yield-curve strip, 0→1→3). **10 Tab stops across the three strips collapse to
3.** The nav control is unchanged on every screen.
**The mouse path was verified too, because a roving tabindex is exactly the change that can break
it:** a real `page.mouse.click()` on the third age band still selects it, the panel heading and
`aria-labelledby` update, **and `tabIndex` follows to `[-1,-1,0]`** — so a learner who clicks and then
presses Tab lands on the tab they chose, not back at the first. `ArrowLeft` immediately after a mouse
click works (2→1), so the two modalities compose. Geometry unchanged: tabs 63/67/73 x 44px (MIN_TAP
satisfied), no horizontal overflow at 420px.

**A GUARD SHIPPED, and W-6.3's number is quoted against it rather than after it.** `check-data.mjs`
**§82**: every JSX opening tag carrying `role="tab"` must also carry `tabIndex` and `onKeyDown`.
W-6.2 rule 3's sentence is writable here — *the arrow keys the app taught you on the nav are dead,
and Tab costs one stop per tab* — which is why this was built where item 152's regex was declined.
⚠️ **The ratio is against it and that is stated, not buried: 22,825 / 9,877 = 2.31x, UP from the
2.19x the 09-06 review recorded** (which said "unchanged, because this run added no script"). Taken
anyway for one reason: the class went undetected for 24 days across three screens.

⛔ **THE GUARD'S FIRST DRAFT WAS WRONG, AND THE REAL CORPUS CAUGHT IT RATHER THAN MY CONTROLS.** A
naive `<[^>]*>` ends a tag inside the first arrow function it meets, so the scanner is brace- and
quote-aware — and on its first run it **failed on `src/App.jsx`'s own tab**, because a `//` comment
inside that tag reads *"only the selected tab's panel"* and the apostrophe opened a string that
swallowed the rest of the tag. **My two controls both passed while the instrument was broken**; they
were clean strings with no comments in them. Fixed by skipping comments *before* opening quotes, and
**control 3 is now that exact shape** (apostrophe + a `>` after it). The tell was that it failed
loudly on a file I knew was correct — had `App.jsx` been the *defective* one, this would have looked
like a true positive.
**Proven able to fail on the real corpus, not just on its controls:** deleted `tabIndex` from
`ui.jsx` (34,227 → 34,171 b, plant confirmed landed) → `FAIL: §82: src/components/ui.jsx declares
role="tab" without tabIndex`; restored from a scratchpad copy and re-ran → PASS. Repeated for
`onKeyDown` → `without onKeyDown`. Restored file `cmp`-identical to the shipped version.

**`npm test` exit 0**, same **3** pre-existing warnings as before the change (translation review
coverage, translation completeness, option-length cue / item 160); `npm run check-blindspot` exit 0;
`npm run build` clean, and the committed tree builds to `index-y_VDZhYV.js` — **the exact bundle every
"after" figure above was measured on**.

#### Step 5 — adversarial self-check
**Blindspot register: nothing found, grepped rather than assumed.** No learner-facing copy changed —
no locale key, no lesson prose, no market figure, no date in shipped content; the diff is JSX
behavior, one guard, and comments. `check-blindspot` exit 0 including its §10.1 timing control and
§2.3 date sweep. §10.2 (Dalio), §10.1 (advice adjacency) and §10.3 (kids framing) cannot be reached by
a keyboard-handler change — and although ParentGuide is one of the three screens touched, **nothing
about its parent-facing framing was altered**: no copy, no labels, no `kidsContent`.
⚠️ **DECISIONS.md conflict: ONE REAL HIT, and it is named rather than waived.** Item 12 was unheld
2026-09-07 — the app ships on iOS via Expo/React Native — and its standing rule is *"do not deepen the
web-only investment … every new inline `style={{}}` and DOM-only component joins the rewrite. Prefer
content, `lib/` and content-parity work."* **This pick is none of those three, and `tabIndex` /
`onKeyDown` / `ref.focus()` are DOM-only.** Taken anyway, on two grounds stated for the owner to
overrule: (1) the marginal port cost is ~0 — **no new component and no new inline style** (measured
above at zero style lines), and a native port replaces `Segmented` wholesale, where the tabs keyboard
contract does not exist; (2) the same decision says *"the web app stays live and current"*, and this
is a live defect on that surface. §82 lives in `scripts/`, which does not port at all. **If the owner
reads item 12 more strictly than this, the 45 lines revert cleanly and §82 stands on its own.**
localStorage-only state, `.js`-not-JSON content and Vite-not-Expo are untouched.
**Already-done backlog item: no, and the specific risk was checked rather than the list scanned.** The
risk was that a past run had deliberately declined arrow keys here, making this an undo.
`ArrowRight`/`ArrowLeft` appear **nowhere** in AGENT_LOG.md, `onTabKeyDown` **zero** times, and
`git log -S` shows the pattern added once (`ebf64a5`, nav only). No run has ever considered this
component's keyboard behavior. Not a redo, not an undo.
**My own verification claim, weakest part first.** ⚠️ **(1) The guard is a PRESENCE check, not a
behavior check** — it asserts two attributes sit on the same element, and would pass an `onKeyDown`
that does nothing. Behavior is covered only by the live differential above, which is not in `npm
test`. **(2) My controls failed to catch my own instrument bug** (see above); the real corpus did.
**(3) This is a real keyboard measurement, not a DOM-shape inference** — `page.keyboard.press` in
headless Chrome performs actual sequential focus navigation, which is precisely what the Browser pane
cannot do. **(4) It is still not a screen-reader claim**: nothing here drives NVDA or VoiceOver, and I
do not assert what one announces. **(5) Reproducible**: every figure comes from two scripts
(`tabs.mjs`, `sweep.mjs`) run against a named bundle, each carrying the bottom nav as a control taken
in the same page load — so a reviewer gets the differential, not two unrelated readings. Before and
after are from **different bundles** (`index-DnLpZ5BO.js` → `index-y_VDZhYV.js`) and labeled as such;
the "before" column was re-measured by restoring HEAD's `ui.jsx`, rebuilding, and re-running the
identical script.

**Filed as nothing.** All three `Segmented` call sites are fixed by the one change and the class is
swept to zero across all 20 `.jsx` files; §82 guards the next one. No residual.

**Schedule:** the cron is the owner's lever; not read, not compared, not touched.

### 2026-09-08 (owner-directed: "fix" — second entry this date) — the comment explaining why the shell scopes its `aria-controls` described five tablists that do not exist and a technique the app does not use

**What this is.** The previous run noticed this in passing while measuring `Segmented` and did not act
on it. Both copies of the claim are now corrected. **Comments only — the built bundle hash is
identical before and after (`index-y_VDZhYV.js`), which is the control that says no shipped code
moved**, and every changed line matches `^[+-]\s*//`.

**The claim, which lived in `src/App.jsx`'s tab comment AND in `check-data.mjs` §40's own header:**
that an unconditional `aria-controls` is *"the exact shape five other tablists in this app carry a
comment about avoiding"*, whose answer is *"render the panel and `hidden` it"*.

**Both halves are false, measured 2026-09-08:**
- **The count.** `grep -rn 'role="tablist"' src/` returns **two** definitions — the shell's nav and
  `ui.jsx`'s `Segmented` — and `Segmented` is instantiated **three** times. So "five other" is wrong
  at one (definitions) or three (instances), never five. `Reference.jsx`'s third hit is a note that
  its old strip *was* a tablist and deliberately is not one now, i.e. a retired one.
- **The technique.** `grep -rn "hidden"` across all three panel sites (`ParentGuide.jsx`,
  `Sectors.jsx`, `LessonVisual.jsx`) returns **zero**. **No panel in this app is rendered-and-hidden.**
  The comment credits the other tablists with an approach none of them takes.

⭐ **The real contrast was there to be stated and had been replaced by a fabricated one.** `Segmented`
gives all of its tabs **ONE always-present panel**, which is exactly why its unconditional
`aria-controls` is truthful. The shell cannot do that — its three screens are separate lazy chunks
with a panel each, so mounting all three would download all three on open. That is a sharper reason
for the shell's scoped reference than the one the comment gave, and it is now what both copies say.

**Why this is worth a commit rather than a note.** §40's header is a **check's own documentation** —
the text a future run reads to decide whether the check still describes reality. A false count there
is the same failure class as the App-summary counts the 2026-09-01 rewrite deleted: a number retyped
into a document every run reads first. Per W-7.2 rule 2 the original wording is **not** quoted
underneath the correction in `check-data.mjs`; it is in git and quoted once here.

#### Step 5 — adversarial self-check
**Blindspot register: not reachable.** No learner-facing surface exists in a source comment; no locale
key, lesson prose, market figure or shipped date changed. `check-blindspot` exit 0. The identical
bundle hash is the strongest form of this claim — §10.1/10.2/10.3 cannot be moved by a diff that
changes no shipped byte.
**DECISIONS.md conflict: none, and item 12 specifically is NOT engaged.** The previous entry took a
real item-12 conflict (DOM-only code deepening the port surface) and left it flagged for the owner.
**This change adds no DOM-only code and no code at all** — it cannot deepen the port surface, and it
does not settle or quietly re-argue that open question, which stands exactly as filed.
**Already-done backlog item: no.** Nothing in the backlog or the pruned list concerns §40's header
text. This corrects a claim, it does not redo a fix.
**My own verification claim.** ⚠️ **(1)** The measurement is a `grep` over `src/`, so it is a claim
about **this tree** and nothing else. **(2)** The strongest evidence is negative — *no* panel uses
`hidden` — and a negative from a grep is only as good as the pattern; the pattern here is the bare
word `hidden`, which is deliberately over-broad (it would match `hidden` in any form) and still
returned zero, so a narrower true instance cannot be hiding behind it. **(3)** The bundle-hash
identity is reproducible: build before, build after, compare the emitted entry chunk name.

**Filed as nothing.** No residual.

**Schedule:** the cron is the owner's lever; not read, not compared, not touched.
