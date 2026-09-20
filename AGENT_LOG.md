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
> **19 days**), commit `cf1aab3`. The app went live that day on Netlify; **the canonical host has
> been GitHub Pages since 2026-09-07** (O-4), and since 2026-09-06 `npm run check-deployed`
> verifies the running site rather than a report. `README.md` § Deploying owns
> the URL, the verification and the update procedure — including what cost the time:
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
> 5. Commit and push to `main`. The Pages workflow builds and publishes; then run
>    `npm run check-deployed` (README § Deploying).
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
> **O-4. ✅ CLOSED 2026-09-10, both halves: one owner action and one owner decision.** Found
> 2026-09-07: the canonical GitHub Pages URL returned 404 while the Netlify host that day's move
> retired still served the app. **Action 1, publish the canonical site,** closed the same day, when
> the owner made the repository public and set Settings › Pages › Source to GitHub Actions. ⭐ The
> diagnosis worth keeping: four workflow runs had a green `build` job and failed on
> `actions/deploy-pages@v4` in the `deploy` job, which waits on that setting. **Read which job
> failed, not that the run failed.** **Action 2, retire the old host or keep it and say so,**
> closed 2026-09-10, when the owner chose to keep Netlify up (`3efa938`). README § Deploying
> dropped its `retired-origin` marker and now says the site serves a frozen build that nothing
> watches. Re-measured 2026-09-11: Netlify `/` → **200** serving `index-B1mndoLB.js`, and a
> nonexistent `*.netlify.app` subdomain → **404** (control). ⚠️ **Still true:** an old Netlify link
> reaches a copy that falls further behind with every push, and no check here will notice. Retiring
> it for real means deleting the site and putting the marker back; `scripts/check-deployed.mjs` has
> the format.

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

> **O-6 (new 2026-09-12, decision not action, and its trigger condition was set by a previous run
> rather than by this one). Thirteen archiving passes have each reimplemented the same move by hand.**
> The twelfth pass (2026-09-11) parked the automation question behind an explicit test: *“If the
> thirteenth pass also needs no recipe change, put the automation question to the owner rather than
> deciding it in a run.”* **This run is the thirteenth and the recipe did not move** — the same
> assertions, the same four proofs, the same two tamper plants, all reused verbatim.
> **Why a run must not just build it.** W-6.2 rule 3 asks what learner-visible failure a new check
> would catch, and the honest answer here is **none** — no learner can see the agent log. W-6.3 asks
> which side of the instrument-to-app ratio a proposal falls on, and a mover script falls on the
> `scripts/` side, which is already **2.19x** the app. Against that: the one defect these passes have
> ever shipped (an inverted archive section) is precisely the step a script cannot get wrong, and this
> repo has twice concluded a standing manual recipe belongs in a script (`npm run clean-tree`, the
> former `npm run deploy`: *“nobody should have to remember”*).
> **The question, and it is a genuine trade, not a formality:** automate the move (more `scripts/`
> mass for a process-only gain), or leave it manual and accept that each pass re-derives its own
> proofs (which is what has kept it correct thirteen times). ⛔ **Not decided in this run.**

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
> ✅ **RESOLVED 2026-09-09, and the answer is that the job is ALIVE — the audit's conclusion was the
> wrong one and the owner's correction was right.** The test set above ran to its own deadline and
> refuted the deletion hypothesis: `1dc747a` **2026-09-07 19:46** and `8c385a4` **2026-09-08 19:46**
> both landed in this working copy by themselves, unattended. `npm test` this run: `asOf=2026-09-08`,
> **ageDays 1**, fresh against `STALE_AFTER_DAYS=4`. The 09-05/09-06 gap W-7.3 measured was real, and
> it was a gap rather than an ending. ⭐ **The durable half is the one already in the environment
> note: a scheduler enumerated on one host is evidence about that host.** Sectors was projected to go
> dark today and does not. **W-7.3's clock is closed; O-5 is untouched** — the job commits and still
> does not push, so this freshness reaches a learner only when the owner pushes `main`.
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
✅ **A TENTH FIRING, 2026-09-08 (owner-directed) — NOTHING WAS CUT**, because the only live day was
the one it stood in and the plan may never move every day. Recorded here because its run-log entry
has now itself been archived.
✅ **AN ELEVENTH PASS RAN 2026-09-09 (scheduled dev-agent).** 2026-09-08 moved (**20 entries,
167,824 b**), run log **248,004 → 80,180 b** (99.2% → 32.1% of warn; **0.23 → 19.4 runs** of
headroom), file **680,646 → 514,806 b**. `npm test` warnings **4 → 3**: the log-size warning this
pass exists to clear is gone, and the 3 that remain are the standing translation/option-length ones.
The date clause was a **no-op for the eleventh firing running** — every live entry was newer than
W-7's boundary — and the trigger acted on was the measured warn budget, as in all ten before it.
**No clause was reworded.**
⛔ **The pass's finding is that the cut was NOT the shape the instrument reported, and one character
caused it.** `check-log-size.mjs` had been reporting **2 days in 4 regions, "NOT CONTIGUOUS"**, with
its own warning that such a cut "is not obvious". It was wrong about the log, not about itself: the
entry for item 174 was headed `### 2026-09-09` while the commit that wrote it (`4e08fd8`) is
authored **2026-09-08 20:12**. Corrected before the cut, the run log is **1 day in 1 region**. The
measurement that found it — all 27 live headings against the author date of the commit that added
each, **26 agreed, 1 did not** — is recorded under **item 174** with the relative-day class it
belongs to.
⭐ **AND IT ANSWERS THE NOTE BELOW, in the direction the note did not expect: the recipe still has
not stopped moving, so the mover is still not due.** A script frozen on the ninth pass's recipe
("append the day verbatim, reverse nothing") would have taken this day by its heading dates, moved
**19 of 20 entries**, and left one 09-08 entry live wearing a 09-09 heading — a silent, permanent
corruption of exactly the kind the note says a script would never make. **The recipe moved a third
time in four days.** What DID transfer is the ninth pass's own prescription: the assertion was built
first and the move second. Both ran this pass — reconstruction of the run log byte-for-byte from
live + archived, and the archive proven append-only — each with a planted negative control (a
7,484 b archive deletion; a one-line live deletion) that fired on the right proof and only the right
proof. **They stayed in the scratchpad, deliberately** (W-6.2 rule 3: no learner-visible failure;
W-6.3's ratio) — and the controls, not the scripts, are the part worth re-deriving.
⚠️ **One instrument bug, stated because it nearly became a false alarm.** The first reconstruction
check anchored on `indexOf("## Run log")`, and that string occurs **3 times** in this file — twice as
prose inside the backlog — so it sliced from a backlog mention and reported a mismatch that did not
exist. Anchor on the heading (`\n## Run log\n\n`, which occurs once) and carry the occurrence count
as a control.
✅ **A TWELFTH PASS RAN 2026-09-11 (scheduled dev-agent).** 2026-09-09 moved (**11 entries,
120,733 b**), run log **246,646 → 125,913 b** (98.7% → 50.4% of warn; **0.43 → 15.8 runs** of
headroom), file **680,160 → 559,427 b**. The level line still read green; what fired was the
instrument's *rate* WARN ("less than ONE run's worth of writing"), caused by the previous run's own
entry. One day cleared it, so one day moved. The date clause was a **no-op for the twelfth firing
running**. **No clause was reworded.**
**The recipe did not move this pass.** The eleventh pass's recipe was applied unchanged: all 27 live
headings matched the commits that added them by count, order and subject, and every day was one region.
The proofs were re-derived from `git show HEAD:` copies: the block read back out of the new archive
rebuilds HEAD's live file byte for byte, the new archive is HEAD's plus the heading plus the block cut
independently from HEAD's live file, 11/11 headings sit once in the archive and zero times live, and
everything above the run log is byte-identical. A one-character archive tamper failed only the two
archive-reading proofs, and a one-line live deletion failed only the reconstruction.
**On the note below: one pass without a change is not "stopped moving".** The mover and the proof
stayed in the scratchpad for the note's own W-6.3 reason. If the thirteenth pass also needs no recipe
change, put the automation question to the owner rather than deciding it in a run.

✅ **A THIRTEENTH PASS RAN 2026-09-12 (scheduled dev-agent).** 2026-09-10 moved (**5 entries,
37,166 b**), run log **271,710 → 234,544 b** (108.7% → 93.8% of warn), file **706,725 → 669,559 b**.
The level WARN fired and the instrument named the cut; one day cleared it, so one day moved. **No
clause was reworded and no budget was touched.** Two scheduled runs had deferred this while naming
it, which is why it was over the warn line rather than approaching it.
**The recipe did not move this pass either — so the question the twelfth pass parked is now DUE, and
it is the owner’s.** That pass wrote: *“If the thirteenth pass also needs no recipe change, put the
automation question to the owner rather than deciding it in a run.”* It needed none. The condition is
met and the question is filed as **O-6** in the owner block above — not decided here.

✅ **A FOURTEENTH PASS RAN 2026-09-12 (owner-directed: "do the archiving pass now").** 2026-09-11
moved (**21 entries, 169,594 b**), run log **269,208 → 99,614 b** (107.7% → 39.8% of warn), file
**706,640 → 537,046 b**, leaving 2026-09-12 as the only live day. Four proofs true against
`git show HEAD:` copies, **three** plants each failing exactly the proofs they target. **No clause
was reworded, no budget touched, no script changed** — the date-vs-byte defect is still open and
still the owner’s (items 115/121); **O-6 is unchanged and still unanswered.**
⛔ **The finding is a NEW failure mode for the hand recipe, and it is the strongest evidence O-6 has
yet.** The mover computed line offsets in **UTF-8 bytes** and then used them to `.slice()` a **JS
string**, which indexes UTF-16 code units — with this file’s em-dashes, arrows and emoji that cut
**5,089 b more than the block**. It was caught by an arithmetic assertion (`live shrank by EXACTLY
the block`), not by eye, and the earlier `cutFrom === 0` guard separately refused to delete a 1 b
preamble. **Both are errors a thirteen-times-correct hand recipe made on the fourteenth run**, in the
step the twelfth pass’s note says a script would never get wrong. The recipe DID move this pass —
so the twelfth pass’s stated condition for escalation is not re-triggered, but the cost side of O-6
just got cheaper to argue.
✅ **A FIFTEENTH PASS RAN 2026-09-15 (scheduled dev-agent).** 2026-09-12 moved (**19 entries,
179,098 b**) at 98.4% of warn, 0.56 runs left. Run log **245,993 → 66,895 b**; four proofs true,
three plants each failing only their targets. Byte-space mover from the start, with zero assertion
failures. No clause, budget or script changed; **O-6 is unchanged and still unanswered.**
✅ **A SIXTEENTH PASS RAN 2026-09-18 (scheduled dev-agent).** 2026-09-13 → 09-15 moved (**10 entries,
71,480 b**) at 100.4% of warn. Three days where the plan named one: one day bought 5.3 runs, three buy
8.6. Run log **251,016 → 179,536 b**; four proofs true, three plants failed only their targets. No
clause, budget or script changed; **O-6 still unanswered.**
✅ **A SEVENTEENTH PASS RAN 2026-09-19 (scheduled dev-agent).** 2026-09-17 moved (**8 entries,
84,479 b**) at 101.5% of warn. One day, as planned: it buys 10.3 runs, and 09-18 holds the notes the
live chain still cites. Run log **253,749 → 169,270 b**; four proofs true, three plants failed only
their targets. No clause, budget or script changed; **O-6 still unanswered.**

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

175. **✅ DONE 2026-09-09 (scheduled dev-agent), the same run it was found** — filed in conclusion
    form per W-7.2 rule 1; the instrument, its control and the full before/after are in this date's
    run-log entry.
    **What was true:** the in-lesson glossary chips (`GlossaryTerms.jsx`, the §3.0.3 surface) put a
    term's definition into a panel that was **not a live region**, and the component's own header
    said why: *"it follows its trigger in DOM order, which is where a screen reader looks next."*
    That is true of the **last** chip in a row and false of every other one — `lessonTerms.js` yields
    **54 chip rows, 29 of them multi-chip, 104 chips of which 50 are not last in their row.** The
    worst case is a 5-chip row (essentials 6, economy 25) where the first chip's definition sits four
    nodes past it. `aria-controls` does not bridge that; most screen readers ignore it.
    **What is true now:** the panel carries `role="status"` on the container that was already always
    rendered, so the region exists before its content — item 174's rule, and verbatim the idiom
    `PolicySim.jsx` has used eleven files away since item 34, for a component with the identical shape
    (a row of buttons over one shared panel). Measured live: opening "Stock" on lesson 35 moves the
    page's live-region character total **0 → 361** where it previously moved **0 → 0**, and the swap
    to "Bond" moves it **361 → 337** in place — the case PolicySim's header names as its whole reason
    for a live region, and the case the old rationale did not cover at all.
    ⭐ **Why the item-174 sweep did not catch it, and it is the third recurrence of one shape.** That
    run swept the app's live regions and closed the class at "all six are now correct". **The class
    was "a surface that swaps content in place"; the sweep's scope was "elements already carrying a
    live-region role"** — so a surface with no region could not appear in it. Identical to §82, whose
    class was "an ARIA composite role with no keyboard contract" and whose scope was one role string.
    **A sweep keyed on the marker cannot find the surfaces missing the marker.**
    ⚠️ **Unchanged limit:** no screen reader is drivable from this host, so this is a DOM-precondition
    claim, not a measured announcement.
    **No check shipped** (W-6.2 rule 3, W-6.3 quoted in the run-log entry): deciding from JSX which
    panels *ought* to be live is the brittle regex item 152 was declined for, and nothing in
    `scripts/` reads live regions today.

174. **✅ DONE 2026-09-08 (scheduled dev-agent), the SAME day it was filed** — replaced by its
    conclusion per W-7.2 rule 1; the two instruments, their controls and the full measurements are in
    its run-log entry, now in `AGENT_LOG.archive.md` under `## Archived 2026-09-08`.
    ✏️ **BOTH dates in the line above were wrong until 2026-09-09 (archiving pass), and the absolute
    one had corrupted the run log itself.** This item's run-log entry was headed `### 2026-09-09`
    while the commit that wrote it, `4e08fd8`, is authored **2026-09-08 20:12**; the item was filed by
    `3ec70af` 2026-09-08 18:16, so the close came **1h56m** later, not a day. The heading is corrected
    in the archived copy. ⛔ **This is what item 142's rule is for — a typed date and a file position
    are not evidence, `git log`'s author date is** — and the mistyped character cost more than a wrong
    date: `check-log-size.mjs` read the run log as **two non-contiguous days** and warned that the
    archiving cut was "not obvious", which is why this pass measured before it cut.
    📏 **The class, measured rather than guessed (2026-09-09).** All 27 live run-log headings were
    diffed against the author date of the commit that added each: **26 agreed, 1 did not** — this one.
    Relative-day prose was checked separately for items 170-175 against their filing and closing
    commits: **5 evaluable, 2 wrong** (173 and this one, both claiming "the day after" for a same-day
    close), 3 correct (170, 171; 172 and 175 are self-contained). **No check was built** (W-6.2
    rule 3): the learner-visible-failure sentence cannot be written honestly — no learner reads
    `AGENT_LOG.md`. The instrument is one `git show --unified=0 | grep '^+### '` loop over
    `git log --format=%H -- AGENT_LOG.md`, and it is recorded here so it need not be re-derived.
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

173. **✅ DONE 2026-09-08 (scheduled dev-agent), the SAME day it was filed** — replaced by its
    conclusion per W-7.2 rule 1; the measurements are in that date's twelfth run-log entry, now in
    `AGENT_LOG.archive.md` under `## Archived 2026-09-08`.
    ✏️ **"the day after it was filed" corrected 2026-09-09 (archiving pass), from git rather than from
    reading:** filed by `1e9baad` 2026-09-08 12:13, closed by `6adb2bc` 2026-09-08 16:15 — **4h02m,
    one day.** See item 174 for the measured class this belongs to.
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
      ⛔ **CORRECTED 2026-09-13: the 12-18 month figure itself was wrong, and this item's "do not
      re-derive" rested on a record nobody had measured.** FRED (`GS10`−`GS1`, `GS10`−`TB3MS`,
      `T10Y2Y` vs `USREC`) puts only 2-3 of 6-10 inversion episodes inside 12-18 months; leads ran
      ~6 months to ~2 years. The lesson body (twice), THINK prompt, quiz option and glossary now state
      that range; the 1955 claim and the hedge are unchanged. See the 2026-09-13 run log.
      "this time is different" leaves lesson 36 but stays in lesson 33, where the corpus actually
      teaches it as bubble psychology.
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
    > ⚠️ **A NOTE, not a sub-item and not a new numbered item (W-6.2 rule 2). The RELATIVE-STRENGTH
    > MEASURE was swept 2026-09-09 and is CLEAN — do not re-open it, and in particular do not "fix"
    > the threshold's units.** The measure, its published payload, its five-language learner-facing
    > copy and `check-data.mjs`'s assertions were read together against real data. **Zero defects.**
    > Three things are worth not re-deriving:
    > **(1) The units hypothesis is WRONG, and it is attractive.** A thinkScript field named
    > `Outperform_Percent_1` = 0.5, compared against the RAW decimal sum, sitting in a payload block
    > that declares `unit: "percentage-points"`, reads like a 100x mismatch. It is not one.
    > `DECISIONS.md` records the raw-decimal reading as the closed decision, and the data agrees with
    > it: read as 0.5 **percentage points** the flag would fire on 8 of 11 sectors on an ordinary day,
    > which is not a highlight. **The only source of truth for the study's intent is the owner's
    > thinkScript, which is not in this repo** — so this is not a run's call in either direction.
    > **(2) The reachability measurement, and the control that decides it, because the pooled number
    > lies.** Every `public/data/market.json` ever committed was replayed — 23 distinct `asOf` dates,
    > 2026-08-04 → 2026-09-08, 264 sector observations. **Pooled: 2 of 264 clear the threshold, so it
    > looks live.** Split by `source`: **both of those 2 are `source: "fixture"`** — synthetic
    > placeholder rows — and across the **242 real (`tiingo`) observations the maximum is 35.9 pp
    > (raw 0.359), 72% of the threshold, with ZERO clearing it.** So 0.5-as-raw is strict but not
    > absurd: it marks outperformance the real data has approached and not yet reached. ⛔ **`source`
    > is the control on this file. A distribution computed across `market.json` history without
    > splitting on it is measuring the fixtures too.**
    > **(3) `outperforming` and `outperformThreshold` have NO consumer, measured with controls.** Both
    > grep to **0** under `src/` outside `relativeStrength.js`, while the sibling fields of the same
    > published block — `provisional`, `rank`, `method`, `unit`, `periods` — return **4 to 55**, so
    > the grep plainly reaches these files. The job drops the flag and `parts` at serialization;
    > `market.json` carries the threshold as metadata and no flag at all. **Kept, not deleted:** the
    > "why does it rank there" UI they exist for is the owner's to build. **No check was built** —
    > W-6.2 rule 3, because after a clean sweep of a surface no learner can see, the learner-visible
    > sentence cannot be written honestly. `scripts/` untouched; the replay stayed in the scratchpad
    > and the figures above are the record.

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

163. **✅ CLOSED 2026-09-02, all three parts** — replaced by its conclusion per W-7.2 rule 1. The full
    argument, the premise corrections and the live measurements are in the 2026-09-02 run-log entries.
    **What was true:** (a) the Review recap told a learner who got 0 of 10 right "nice work" under a
    green success tick, an inch above ten red crosses; (b) the heading rotor put the whole Fed
    balance-sheet chart inside "Yield Curve Shapes", because two blocks sat between unrelated `h2`s;
    (c) `Bar` rendered `9` where its own `aria-label` read `9.0`. **What is true now:** the tick and the
    headline both branch at `correctCount === 0` (`166b0fe`), one `qeQtSection` heading owns the QE/QT
    pair and the figure (`7d5cc52`), and `Bar` takes the `formatValue` prop its three siblings in the
    same file already had (`154b152`).
    ⭐ **The durable half, and it is why this item is worth remembering at all: all three sub-items were
    filed by the run that had just LOOKED at the screen, and (a)'s scope, (b)'s two figures and (a)'s
    priority label were every one of them wrong.** (b) claimed "4 of 7 blocks" and the screen has eight,
    of which three unheaded blocks turned out to be correct markup; (a) named one site and there were
    two, and called the defect "a judgment call, not a falsehood" when the second site was a plain
    falsehood in five languages. **A residual is a claim about the code, not a reading of it — a
    residual filed by the run that saw the thing is not exempt from step 3.5.**
    ⚠️ **One thing deliberately left open, measured rather than assumed:** `es` alone writes a comma
    decimal in the balance-sheet description while the chart face renders a period in every language.
    The app has no locale-aware runtime number formatter (`numerals.mjs` is script-side; the only
    runtime one is `usd`, hardcoded `en-US`). Pre-existing, one language, and (c) strictly *reduced* the
    disagreement — `es` face-vs-description now differs only in separator, where before it also
    differed in precision.

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
        ✏️ **DONE 2026-09-04 — and this clause stayed stale about its own residual until 2026-09-09.**
        It read *"`quizMeta.js`'s header still describes the spread as 'roughly 3/3/4/3'"* and handed the
        fix to "the next run to touch that file". **That run was 2026-09-04's, five days before anyone
        read this line again.** The header now quotes **no number at all** and says why: §3 derives the
        distribution from the array on every `npm test`, and a figure a script prints is the only kind
        that cannot rot in a comment. Measured 2026-09-09 for the record: 46 questions, **10/13/13/10**.
        ⭐ **A handoff addressed to "the next run to touch that file" is not addressed to anybody** — the
        run that did the work never saw this clause, and the clause could not see the work.
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
        ✏️ **Overtaken 2026-09-18 (owner-directed) on accuracy, not on length:** the correct option
        itself was false ("rates are already at 0%"; see that date's run log), so it was rewritten in
        all five languages. The new option is **not the strictly longest in any language** (en 23 of
        max 25, es 20/26, ko 11/12, zh 5/6, ja 7, tied with two others at 7), and §65 moved en 56.5 → **54.3%**, es/ko → 52.2%,
        ja → 50.0%. Not a trim done to move the instrument: the text had to change either way.
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
    > ⚠️ **A NOTE, not a sub-item (W-6.2 rule 2). `LoadFailure` still reloads in place, and against a
    > PERMANENTLY missing chunk that is also a loop.** Filed 2026-09-09 by the run that fixed the
    > `AppError` half. Measured the same session, not inferred: the built `LessonReader` chunk was
    > moved out of `dist/`, `#/lesson/29` produced `LoadFailure` (so the tagging still discriminates
    > after that run's edit — a free regression control), and its button reloaded to `app_opened`
    > 1 → 2 **at the same hash**, back onto the same message. **This is the accepted trade, not an
    > oversight**, and the reason is written into `ui.jsx`: the dominant cause of a chunk 404 is a
    > redeploy invalidating a content-hashed chunk under an open tab, which a reload at the SAME url
    > repairs while keeping the reader's place — routing them to `#/learn` would cost every one of
    > those readers their place to help the rarer case where the file is genuinely gone from the
    > server. **Honest priority: low; one live instance, and it needs a judgment (or a
    > reload-attempt counter in `sessionStorage`) rather than a measurement — do not pick it by
    > default.**

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
    > ⛔ **NOTE 2026-09-09 — the app's OWN LESSON AND TRACK NAMES were being reported as undefined
    > jargon, and the instrument now suppresses them. Do not re-derive this.** A lesson that
    > cross-references another by title (the item 36 practice) fed that title to the capitalized-phrase
    > rule: on `all`, **11 of 81 listed candidates were lesson-title or track-label fragments**, and
    > the top three of the whole report were `Short-Term Debt`, `Short-Term Debt Cycle` and
    > `long-term debt` — i.e. lessons **32 and 33**, whose titles those are. Item 68's shape exactly:
    > adding a cross-reference made the report worse while making the content better. Suppressed by a
    > word-aligned n-gram of **≥2 words** over the 44 titles + 3 track labels, printed with its
    > citation, not applied to the `glossary` corpus, with a four-way control.
    > ⚠️ **The one-word half is NOT covered and is the open residual.** This item's own
    > *"beneficiary is not a gap (lesson 14 is titled for it)"* is a **one-word** fragment of
    > *Estate Planning Basics: Wills and Beneficiary Designations*, and the two-word floor
    > deliberately leaves it listed — a one-word title fragment is too ambiguous to suppress without
    > eating `MORE`, `LESS`, `AND` and `RULE`, which were the first draft's false positives.
    > **One live instance, honest priority low; do not pick by default.**
    > ✅ **And the main path was swept for the first time and is CLEAN** — the script defaults to
    > `money` (`argv[2] ?? "money"`) and neither log recorded an economy or essentials run. After the
    > title fragments come out, every economy candidate is ordinary English, a glossary term the
    > extractor split (`Funds Rate`), or defined inline (`Term Premium`, lesson 36, under its own
    > heading). **No glossary entry is owed on the economy track.**

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

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was residual pick #1, and its notes (the `ex` "Steady", `Inflation`, `PMI`) all called themselves arguable, so this was a free pick. It came from checking every macro glossary definition against the log: `When debt is too large` and `Narrow = confidence` return **0** in `AGENT_LOG.md`, `AGENT_LOG.archive.md`, `CLAIMS.md` and `DECISIONS.md`. The control, GDP's `flour`, returns 3) — the glossary defined **Deleveraging** as **"When debt is too large."** That describes a state, while L34, where the term is `defined-here`, teaches a process: "The 4 Ways to Reduce Debt Burden", in which "debts decline relative to income". **By 2003Q1, US household and business debt was 146.1% of GDP, above every earlier reading back to 1947Q4, and it kept rising to 172.0% in 2008Q3 (BIS via FRED `QUSPAM770A`).** Under the old definition, those five years of leveraging up were the deleveraging. The actual deleveraging was the fall that followed, to **150.5% by 2015Q4**. The definition now names the process, says being deeply in debt is not the same thing, and gives the US rise and fall, in all five languages

#### Step 3.5: the premise measured, with controls
- **Instruments:** FRED keyless CSV (`QUSPAM770A` US private nonfinancial credit % GDP, `QUSHAM770A` households, `QUSNAM770A` nonfinancial corporations, `QJPPAM770A` Japan). The script is `scratchpad/a.mjs`.
- **Controls that fired:** (i) `NOSUCHSERIESXYZ` → **HTTP 404**. (ii) Japan's private credit peak is **213.6% (1993Q4)** and **150.0% in 2016Q1**. That matches the 09-18 teen-blurb run's figures exactly. (iii) US 2007Q4 private credit is **170.6%**, the "about 170%" L34 has used since the 09-18 debt-ratio run.
- **US private debt/GDP:** max before 2003 was 145.6 (2002Q4). 2003Q1 was 146.1, a new post-war high, and it rose to 153.3 (2005Q1), 164.9 (2007Q1) and a peak of **172.0 (2008Q3)**. That is +26 points while the debt was already higher than ever measured. After the peak it fell to 154.2 (2012Q1) and **150.5 (2015Q4)**. Households drove both legs: 80.3 → 98.4 (2007Q4) → 76.9. Corporations barely moved (65.8 → 73.0 → 73.6). **Premise BREAKS:** "debt too large" held throughout the run-up, which is the opposite phase to deleveraging. **Scope note:** the series starts in 1947, and private debt/GDP was probably higher in the early 1930s. That is why the text says "since the late 1940s" and not "ever".

#### What shipped (`glossary.js` `Deleveraging.f`, en/es/ko/zh/ja, 5 strings)
- en: *"The process of bringing debt down relative to income after it has grown too large to carry; being deeply in debt is not the same thing. By 2003, US household and business debt was already higher relative to GDP than at any earlier point since the late 1940s, yet it kept climbing, to about 170% in 2008; the deleveraging was the fall that followed, to about 150% by 2015. 4 tools: (1) Austerity, …"* The four-tool list is unchanged, and so is the `ex`. es/ko/zh/ja say the same. ja keeps the glossary's own term デレバレッジ (the lessons use デレバレッジング; that split predates this run).
- One node patcher (UTF-8): old ×1 / new ×0 before and 0 / 1 after, **5/5**, and nothing is written if any check fails. All five read back from the module. `git diff --numstat`: 1/1.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `check-blindspot` | **exit 0**. Planted *"You should buy tech stocks now."* inside the new en `f` (anchor count 1) → **exit 1, §10.1**. Restored from `scratchpad/glossary.post.js` (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | Each language's new clause → `markets-TL4fBvi1.js`. The old "When debt is too large" and "债务过大时" → **no file**. Control: the unchanged `ex` "A country buried in debt eventually" → the markets chunk. The negative probe → no file |
| Live walk | **not done.** This is a text-only change to a field the Glossary and term-detail screens already render. The en `f` is 452 chars, about the length of `Productivity Growth`'s, which renders there now |

#### Step 5: adversarial self-check. Nothing found that needed changing
- **L34 agreement:** L34 §2 says household and business debt fell "from about 170% of GDP to about 150%" from 2007 to 2015. The glossary's "about 170% in 2008 … about 150% by 2015" is the same series and the same rounding (2007Q4 170.6, 2008Q3 172.0). "Relative to income" in the first clause is L34's own wording. The figures are relative to GDP, which is national income.
- **Could the new text mislead?** (i) "Higher than at any earlier point since the late 1940s" is true for the BIS series (2003Q1 146.1 > every value from 1947Q4 to 2002Q4). It does not claim a record against 1929-33, which this series does not cover. (ii) It names private debt only. Total debt rose over 2007-2015, which L34 now says, and the glossary does not contradict it: "household and business" is stated.
- **§10.1:** a definition and dated history, and the plant covers this file. **§10.2:** 0 hits for "Dalio" in `glossary.js`. The four-tool list was already there, and nothing is attributed. **§10.3 / live-looking figure:** none. 2003-2015 is a closed window. **DECISIONS.md:** 1 hit for "deleverag" (l.767, curriculum order), unrelated. **CLAIMS.md:** 0. **Already-done:** the 09-02 translation-completeness pass completed this entry's translations and did not touch its content. The 09-18 L34 runs are extended, not undone. **W-6.3:** 0 lines added to `scripts/`.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **`Deleveraging.ex`: "A country buried in debt eventually has to deleverage".** "Eventually has to" is unfalsifiable as written. Japan's government debt has risen for three decades without a deleveraging, while its private sector did deleverage (1993-2016). Arguable.
- **`Credit Spread`: "Narrow = confidence. Wide = fear/crisis."** Unmeasured (0 log hits). Spreads also widen on liquidity and supply, not only fear. Probably measurable with FRED `BAA10Y`. Not picked.

**Owner-facing, one line:** the glossary defined deleveraging as "when debt is too large", which fits the 2003-2008 run-up, when US household and business debt was already at a post-war high and still rising to about 172% of GDP. The definition now names the process (debt falling relative to income, 172% → 150% by 2015), in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1: residual pick #1 in a new chain, which the rule allows. The previous run was a free pick, and its second note was this entry: "`Credit Spread`: 'Narrow = confidence. Wide = fear/crisis.' Unmeasured … Probably measurable with FRED `BAA10Y`. Not picked") — the glossary defined **Credit Spread** as **"Gap between corporate and government bond yields. Narrow = confidence. Wide = fear/crisis."** The direction holds: **the US Baa–10-year Treasury spread widened in all 11 recessions from 1953 to 2020** (FRED `BAA10YM`, `USREC`). The absolute reading does not. **From 1953 to 1969 the spread never reached 2 percentage points, even in recessions (max 1.82), while in the 2010s expansion it was 2 or more in 107 of 120 months.** So a reading of 2 meant crisis in 1958 and calm in 2014. The definition now says what the spread is, gives both directions as tendencies, and says to read it against its own recent range, with the US figures, in all five languages

#### Step 3.5: the premise measured, with controls
- **Instruments:** FRED keyless CSV (`BAA10YM` monthly from 1953-04, `AAA10YM`, `BAA10Y` daily, `USREC`). Scripts are `scratchpad/cs/a.mjs` and `b.mjs`. `BAMLH0A0HYM2` (high-yield OAS) comes back with only 3 years (from 2023-09), so it was not used.
- **Controls that fired:** (i) `NOSUCHSERIESXYZ` → **HTTP 404**. (ii) The known GFC peak: `BAA10YM` max over the whole series is **6.01 in 2008-12**, and 2007-01 is 1.58, the pre-crisis low people remember. (iii) The Aaa spread reproduces the pattern on its own: it widened in **11 of 11** recessions, and its 1953-69 recession max (0.72) is below **every** 2010-19 month (median 1.70). The finding is not specific to the Baa grade.
- **Direction, stricter than peak-vs-prior-low:** recession peak minus the mean of the 12 months before the start = **+0.93, 0.60, 1.40, 1.93, 1.69, 1.67, 0.62, 0.76, 4.16, 1.29** (1957-2020). 1953 has only 4 prior months (mean 0.81 → peak 1.23, **+0.42**). **Null:** in 522 12-month windows with no recession month in them or in the 12 months before, the same statistic reached 0.5 in **18.4%**. Recessions reached it in 10 of 11. The rise also happens without recessions (2002-03, 2011-12, 2015-16 all ≥3.0), which is fear without a downturn and fits "fear". **Premise HOLDS** for direction.
- **Level by era (median of expansion months / recession months):** 1953-69 **0.92 / 1.21** (max 1.82), 1970-89 1.95 / 2.14, 1990-2006 1.86 / 2.68, 2007-19 **2.57** / 3.78, 2020-26 1.84 / 3.47. 2010-19: **95.8%** of months above 1.82, **89.2%** at 2 or more (daily `BAA10Y`: 85.2%). **Premise BREAKS** for the level: "Wide = fear/crisis" read as a number is wrong across eras.

#### What shipped (`glossary.js` `"Credit Spread".f`, en/es/ko/zh/ja, 5 strings)
- en: *"The extra yield a company pays to borrow, over what the government pays. It tends to widen when lenders fear defaults and narrow when they feel confident, but read it against its own recent range, not as a set number: the US gap between medium-grade (Baa) corporate and 10-year Treasury yields widened in all 11 recessions from 1953 to 2020, yet it never reached 2 percentage points in 1953-1969, even in recessions, while in the long 2010s expansion it was 2 or more in nearly 9 months out of 10."* es/ko/zh/ja say the same. The `ex` ("When investors get nervous about defaults … tends to widen") is unchanged; it is the direction, which holds.
- Three node patchers (UTF-8), each old ×1 / new ×0 before and 0 / 1 after, and nothing written if any check fails: the first 5/5, the second shortened the en opener ("must pay to borrow, compared with the government" → "pays to borrow, over what the government pays") and a third ("fixed number" → "set number") after a re-measure showed the second left it at **499**, still one over `Relative Strength`'s 498 (this row first said the second patch had fixed it; measured, it had not). It is now **497**. All five read back from the module. `git diff --numstat`: 1/1.
- "Medium-grade" is Moody's own description of Baa. "No recession" in 2010-19 is `USREC` = 0 for all 120 months.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `check-blindspot` | **exit 0**. Planted *"You should buy tech stocks now."* after the new en `f` (anchor count 1) → **exit 1, §10.1**. Restored from `scratchpad/cs/glossary.post.js` (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | Each language's new clause → `markets-BICsSLtR.js` (final text, rebuilt after the third patch). Old "Narrow = confidence. Wide = fear/crisis." and "收窄=信心。走阔=恐慌" → **no file**. Control: the unchanged `ex` → the markets chunk. Negative probe → no file |
| Live walk | **not done.** Text-only change to a field the Glossary and term-detail screens already render. The en `f` is 497 chars, just under `Relative Strength`'s (498), which renders there now |

#### Step 5: adversarial self-check. Nothing found that needed changing
- **L39 agreement:** L39 §1, where the term is `defined-here`, still says "Narrow = lenders feel confident. Wide = lenders are demanding extra pay for extra fear." The glossary now adds the era caveat and does not contradict it. L39 §2's phase paragraphs already talk in changes ("begin to widen", "beginning to narrow"), which is what the new definition says to watch. L39 is not edited (see below).
- **Could the new text mislead?** (i) "Widened in all 11 recessions" could be a trivially true statistic. The null above says it is not (18.4% of no-recession windows vs 10/11 at the same bar). (ii) Baa is long-dated and the comparison is the 10-year, so part of the gap is term, not credit. The text says "gap between … yields" and does not claim the gap is pure default risk. (iii) "Its own recent range" does not say how recent. That is deliberate, and the two dated eras show why a fixed cutoff fails.
- **§10.1:** a definition and dated history, and the plant covers this file. **§10.2:** 0 hits for "Dalio" in `glossary.js`. **§10.3 / live-looking figure:** none. 1953-1969, 1953-2020 and the 2010s are closed windows. **DECISIONS.md / CLAIMS.md:** 0 hits for "credit spread". **Already-done:** the archive's `Credit Spread` hits are the 08-xx `gov bond` → `government bond` pass (l.13035) and the translation-completeness pass (l.33365-33380), neither of which measured the content. **W-6.3:** 0 lines added to `scripts/`.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **L39 §1's own "Narrow = … Wide = …" sentence** makes the same level claim in all five languages. It sits in the lesson that defines the term, and a learner who taps the chip now gets the caveat. Measured here (same data). If a later run wants the lesson to say it too, this entry has the figures. Not picked, to keep this change to one surface.
- **The Aaa spread was negative** in several 1950s-80s months (e.g. −0.17 in the 24 months before 1980-02 and 1981-08). Aaa corporates yielded less than the 10-year Treasury, so for those months "the extra yield a company pays" was below zero. This does not touch the text, which uses Baa, and Baa was never negative.

**Owner-facing, one line:** the glossary said a wide credit spread means fear or crisis. The direction holds (it widened in all 11 US recessions since 1953), but the number does not: in 1953-69 it never reached 2 points even in recessions, and in the calm 2010s it was 2 or more almost every month. The definition now says to read it against its own recent range, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1: residual pick #2 in the chain the previous run opened, which the rule allows. The **next** run may not take this run's residual. The previous run's first note was this entry: "L39 §1's own 'Narrow = … Wide = …' sentence makes the same level claim in all five languages … If a later run wants the lesson to say it too, this entry has the figures") — lesson 39, where **Credit Spread** is `defined-here`, still told learners **"Narrow = lenders feel confident. Wide = lenders are demanding extra pay for extra fear."** It came one paragraph after the VIX's numeric cutoffs ("below 15 = calm … above 40 = extreme panic"), which invites reading the spread as a level too. The glossary has carried the era caveat since `c30e684`. The lesson did not, so a learner reading the lesson and one tapping the chip got two different definitions. The paragraph now gives both directions as tendencies, says to watch the direction and compare with the spread's own recent range, and gives the same US figures, in all five languages

#### Step 3.5: the premise measured, with controls
- **Re-measured, not copied from the previous entry.** Script `scratchpad/l39/a.mjs`, FRED keyless CSV (`BAA10YM`, `USREC`).
- **Controls that fired:** (i) `NOSUCHSERIESXYZ` → **HTTP 404**. (ii) Series max **6.01 in 2008-12**, the known GFC peak.
- **Reproduced exactly:** widened in **11 of 11** recessions 1953-2020 (peak minus prior-12-month mean +0.42 … +4.16, the same list as `c30e684`'s entry); the 1953-69 max was **1.82**, and the max in recession months in that span was also **1.82**; 2010-19 had **107 of 120** months ≥2 (min 1.65), with **0** `USREC` months. Latest reading **1.64 (2026-08)**, not used in the text.
- **Premise:** HOLDS as the previous run stated it. The direction is right, and the level reading is wrong across eras.

#### What shipped (L39 `sections[0]`, last paragraph, en/es/ko/zh/ja; 5 strings)
- en: the first sentence is unchanged. The two "=" sentences became *"They tend to widen when lenders demand extra pay for fear of defaults, and narrow when lenders feel confident. But watch which way they move and compare them with their own recent range, not a set number: the US gap between medium-grade (Baa) corporate and 10-year Treasury yields widened in all 11 recessions from 1953 to 2020, yet it never reached 2 percentage points in 1953-1969, even in recessions, while in the long 2010s expansion it was 2 or more in nearly 9 months out of 10."* The figure clause reuses the glossary's wording in every language, so the two surfaces agree word for word on the numbers. The old "extra pay … fear" idea is kept.
- Patcher `scratchpad/l39/patch.mjs`: dry run first, old ×1 / new ×0 before and 0 / 1 after, **5/5**; nothing is written if any check fails. All five read back from the modules. Post-patch copies are in `scratchpad/l39/post/`.
- **Knock-ons the suite demanded:** the ledger marked L39 es/ko/zh/ja stale. I wrote each translation against the new English, read it back, and re-marked it `ai` (O-3 unchanged: 0% human). **Ledger diff: 16 lines, L39's four entries only.** `readiness --write`: en chars 160,662 → **161,059**, LAUNCH_PLAN §4.0 ~28,000 → **~28,100 words**. Minutes stay at 171, and no minutes check fired.

#### Verification
| Check | Result |
|---|---|
| `npm test` | first run **exit 1**: LAUNCH_READINESS §10.4 coverage disagreed with the ledger (the expected stale knock-on). After the ledger and readiness fixes: **exit 0**, 0 FAIL / 3 WARN (the standing three). §83: worst paragraph is still L18 es at 31.6 lines, so the new es paragraph (737 chars) is not the worst |
| `check-blindspot` | **exit 0**. Planted *"You should buy tech stocks now."* after the new en paragraph (anchor count 1) → **exit 1, §10.1**. Restored from the scratchpad snapshot (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | Each language's new clause → its `lessonContent.economy.<lang>` chunk (en/es also match `markets-BICsSLtR.js`, where the glossary carries the same figure clause). The old "Wide = lenders are demanding extra pay" and "宽 = 放贷者在为多出来的恐惧" → **no file**. Control: the unchanged "VIX, nicknamed the" → the en chunk. Negative probe → no file |
| Live walk | **not done.** Text-only change to a paragraph the lesson reader already renders |

#### Step 5: adversarial self-check. Nothing found that needed changing
- **L39 §2 agreement:** §2 says spreads are "narrow" in Expansion and "wide" in Contraction, and that they "begin to widen" at Peak and are "beginning to narrow" at Trough. Read after the new §1, these are relative to the phase before, which is what §1 now says to watch. Not edited.
- **Other surfaces:** `spread` in `quizText.en.js`, `economicSignals.js` and `markets.js` finds only diversification uses and the yield-curve `curveSpread` key. No quiz question makes a credit-spread claim. `DECISIONS.md` / `CLAIMS.md`: 0 hits for "credit spread".
- **§10.1:** direction and dated history, not advice. The plant covers this file. **§10.2:** 0 hits for "Dalio" in all five economy modules. **§10.3 / live-looking figure:** none. The windows are closed, and the 2026-08 reading is not in the text. **Already-done:** extends `c30e684` to the lesson and undoes nothing. **W-6.3:** 0 lines added to `scripts/`.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- Nothing new. **The next run may not take a residual of this chain (W-6.2 rule 1).**

**Owner-facing, one line:** lesson 39 said "Narrow = confident. Wide = fear" as if the credit spread were read like the VIX's fixed cutoffs. It now says to watch which way the spread moves and compare it with its own recent range: in 1953-69 it never reached 2 points even in recessions, and in the 2010s it was 2 or more almost every month. This matches the glossary, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was residual pick #2 and its note was "Nothing new", so this was a free pick. It came from checking the glossary's remaining causal or superlative claims against the log: `biggest and most volatile` and `most important and most volatile` return **0** in `AGENT_LOG.md`, `AGENT_LOG.archive.md`, `CLAIMS.md`, `DECISIONS.md` and `LAUNCH_PLAN.md`. The one earlier mention of "the most volatile part of the economy" (archive l.11888) quotes the glossary during a chip-rendering check and does not measure it) — lesson 30's subtitle said **"Credit is the biggest and most volatile part of the economy"**, the glossary said credit "is the most volatile part of the economy", and quiz `q002`'s explanation (L30, `quizText.*.js` l.38) said "the most important and most volatile part". **None of the three said what swings, and the answer decides whether the claim is true.** As a growth rate, US private credit outstanding is one of the *steadier* series: year-on-year sd **3.49 pp** since 1948, against **11.54** for real private investment, **13.98** for housing and **8.59** for exports. **As a dollar amount, new borrowing swings more than any category of spending**, in every window measured: US households and businesses took on about **$2.1 trillion** of new debt a year in 2006, and their debt shrank by about **$0.7 trillion** a year in 2009-10, while yearly business and housing investment fell by about **$0.9 trillion**. All three surfaces now name the new borrowing and give the 2006 → 2009-10 figures, in all five languages

#### Step 3.5: the premise measured, with controls. It PARTLY broke
- **Instrument:** `scratchpad/credit/{a,b,c,d}.mjs`, FRED keyless CSV. Credit: BIS `CRDQUSAPABIS` (private nonfinancial, adjusted for breaks, $bn, to 2025Q4). Spending: `GDP`, `PCEC`, `GPDI`, `PRFI`, `PNFI`, `GCE`, `EXPGS`, `IMPGS`, `PCDG`. Real: `GDPC1`, `PCECC96`, `GPDIC1`, `EXPGSC1`, `IMPGSC1`, `GCEC1`, with `PRFI` over its own deflator `A011RD3Q086SBEA` (`PRFIC1`/`PNFIC1`/`PCDGCC96` now start only in 2007, so they were not used).
- **Controls that fired:** (i) `NOSUCHSERIESXYZ` → **HTTP 404**. (ii) `GPDIC1` 2009Q2 year on year → **−26.1%**, the known collapse. (iii) Independent source for the flows: Z.1 household (`CMDEBT`) + nonfinancial corporate (`BCNSDODNS`) debt, which leaves out noncorporate business. It reproduces the shape: **+$1.73T** in the year to 2006Q2 (BIS **+$2.10T**) and **−$0.74T** in the year to 2009Q3 (BIS **−$0.74T**). (iv) Real private credit sd **3.49** vs the **3.37** that `7a059b9`'s entry reported for 1948-2026. Close, not exact: window and deflator differ, so this is a sanity bound rather than a reproduction. The Productivity glossary's "about half as much as credit's" survives either figure (1.80/3.49 = 0.52).
- **Reading 1, growth of the credit stock. The claim FAILS.** Year-on-year sd, 1948-2025 (pp): real private credit **3.49**, real GDP 2.62, consumption 2.26, government 5.63, imports 8.33, exports 8.59, private investment **11.54**, residential **13.98**. The same ranking holds in 1985-2025 and 2000-2025, and in nominal terms (credit 3.81 vs investment 12.64).
- **Reading 2, dollar swing in new borrowing vs dollar swing in each kind of spending. The claim HOLDS.** For each flow, I took the sd of its year-on-year change, as % of the prior year's GDP. New private credit (4-quarter change in the stock) **2.67** against the largest spending category, investment **2.00** (consumption 1.92, imports 1.12, government 1.15), 1949-2025. 1985-2025: **3.07** vs 1.85 (consumption). 2000-2025: **3.50** vs 2.19. In levels, new private credit ran from **+15.3% of GDP** (2006Q2) to **−5.1%** (2009Q3), while investment's share ran 12.7-21.4% over the whole period.
- **Disposition, re-decided on the corrected facts.** I expected the claim to be wrong; it is right in one reading and wrong in the other. The lesson teaches reading 2, borrowing as a source of spending (§3, "The Spending Chain"). The glossary's own definition sets up reading 1: "Money borrowed that must be repaid … total credit outstanding". So the fix is **precision, not reversal**: say that the *amount of new borrowing* is what swings, and give the episode. "Biggest" in the subtitle now names what §2 supports: credit against the money the Fed creates. BIS `CRDQUSAPABIS` **$43.1T** (2025Q4) vs `BOGMBASE` **$5.52T** (2026-07), about **7.8×**.

#### What shipped (15 strings, 7 files, all five languages)
- **Glossary `Credit` `f`:** "…Spends just like money. The amount of new borrowing swings more than any kind of spending: US households and businesses took on about $2.1 trillion of new debt a year in 2006, then their debt shrank by about $0.7 trillion a year in 2009-10, while yearly business and housing investment fell by only about $0.9 trillion. In the US, total credit outstanding is many times larger than the monetary base (M0)." The M0 clause is unchanged.
- **L30 subtitle** (`lessons.js`): "In the US, credit far outweighs the money the Fed creates, and new borrowing swings more than any kind of spending" (115 chars; the longest en subtitle is 210, so card layout is not at risk).
- **Quiz explain** (`quizText.*.js` l.38, "What is the most important part of the economy?"): "Credit is the most important part of the economy, and the amount of new borrowing swings more than any kind of spending: US households and businesses took on about $2.1 trillion of new debt a year in 2006, then their debt shrank by about $0.7 trillion a year in 2009-10. …". The keyed option, the option text and the index are unchanged.
- ⚠️ **My first patch said "borrowed … then paid down".** On re-read, both verbs were wrong. $2.1T is *net* new debt; gross mortgage originations alone were larger. And the 2009-10 fall includes defaults and write-offs, not only repayment. A second count-asserted patch (`patch2.mjs`, 10 strings) changed them to "took on … of new debt" and "their debt shrank by". After it: `paid down`/`갚아 나갔`/`净偿还`/`を返済しました`/`pidieron prestados` → **0** in all six files.
- Figures per language: es `$2.1 billones` (the app's existing `$1.75 billones` convention; billón = 10¹²), ko 2조 1천억 / 7천억 / 9천억, zh 2.1/0.7/0.9万亿, ja 2.1/0.7/0.9兆. Patchers: old ×1 / new ×0 before and 0 / 1 after, or nothing is written. Originals are in `scratchpad/credit/orig/`. **All 15 strings were read back from the imported modules, not just from grep counts.**

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three). No ledger or readiness knock-on: subtitle, glossary and quiz text are outside the lesson-body ledger |
| `refresh-readiness --check` | **exit 0** |
| `check-blindspot` | **exit 0**. Planted *"You should buy tech stocks now."* after the new en quiz explain (anchor count 1) → **exit 1, §10.1**. Restored from the scratchpad copy (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | New en/ko glossary clause → `markets-*.js` (plus `quizText.en-*` for the shared en clause). New zh clause → `markets-*` + `quizText.zh-*`. New en/es/ja subtitles → `index-*.js`. Old "most volatile part of the economy", "最不稳定的部分", "最も変動が大きい部分", "más grande y volátil" → **no file**. Control: unchanged Fed Funds definition → `markets-*`. Negative probe → no file |
| Live walk | **not done.** Text-only change on surfaces that already render longer strings |

#### Step 5: adversarial self-check. Nothing found that needed changing beyond the verb fix above
- **Does "more than any kind of spending" overreach?** It is tested against every GDP expenditure category and durables, in three windows, and it holds in all of them. The margin is smallest in 1949-2025 (2.67 vs 2.00). It is not tested against financial flows such as stock trading, but the sentence says "spending".
- **Glossary coherence:** `Productivity Growth` still says it swings "about half as much as credit's". That is a growth-rate comparison, which holds at 1.80 vs 3.49. It does not contradict the new `Credit` text, which is about dollar flows.
- **§10.2:** "Credit is the biggest and most volatile part of the economy" was a near-verbatim, unattributed echo of a well-known Dalio line. The subtitle no longer carries it. `/dalio/i` in the 7 touched files → **0**. **§10.1:** dated history, not advice (the plant covers it). **Live-looking figure:** closed windows only. The M0 ratio is in this log, not in the text. **DECISIONS.md:** 0 hits for "volatile". **Already-done:** undoes nothing. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **L30's title "Credit: The Most Important Part" and the quiz question "What is the most important part of the economy?"** (keyed "Credit") are the same Dalio line's other half. "Most important" is a framing judgment, not a measurable claim, so nothing here refutes it. Whether a quiz should key an opinion as the correct answer is a content question. Arguable; not picked.

**Owner-facing, one line:** the app called credit "the most volatile part of the economy". That is false for credit outstanding, which grows more steadily than investment or housing, and true for new borrowing, which swung from +$2.1T a year (2006) to −$0.7T (2009-10). The lesson subtitle, glossary and quiz now say which, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was a free pick and its only note (L30's "most important") called itself arguable, so this was a free pick. **The first pick's premise broke and the item was re-decided** — see step 3.5) — the glossary defined **PMI** as **"Monthly survey. Above 50 = expansion. Below 50 = contraction. Leading indicator."** In an app whose cycle phases are named Expansion and Contraction, that reads as "PMI below 50 = the economy is contracting". The 09-13 L39 run corrected exactly that reading in the lesson (*"a reading below 50 is not a recession forecast"*) and left the glossary chip saying the old thing. **From late 2022 through 2024 the US manufacturing PMI was below 50 in 26 of 26 months (revised series), while real GDP grew 5.9% and payrolls added about 4.4 million jobs; `USREC` is 0 through 2026-08.** The definition now says what the survey asks, that 50 marks growth or shrinkage in the surveyed sector versus the month before and not the whole economy, and gives the 2022-24 counterexample, in all five languages

#### Step 3.5: the first premise BROKE, and the pick was re-decided
- **First pick: L39 §2's credit-spread phase readings** ("At Peak … credit spreads begin to widen even while headlines still sound upbeat"; "At Trough … credit spreads beginning to narrow"). Never measured against data (the 09-19 Credit Spread runs measured level vs direction, not timing against peaks/troughs).
- **Instrument:** `scratchpad/spread/{a,b,c}.mjs`, FRED keyless CSV `BAA10YM`, `AAA10YM`, `USREC`. **Controls:** `NOSUCHSERIESXYZQ` → **HTTP 404**; derived peaks 1953-07 … 2020-02 and troughs 1954-05 … 2020-04 are NBER's published dates; `BAA10YM` max **6.01** in 2008-12, the known crisis high.
- **Peak claim HOLDS.** Baa spread widened over the **3 months before 8 of 10 NBER peaks** (1957-2020; one of the eight, 1981, by only +0.01; the two exceptions −0.03 and −0.02, i.e. flat), against a placebo of **37.3%** of expansion months more than 24 months from any peak. Over 6-24 month windows it is 5-7/10, so "begin to" (short horizon) is the right wording. Aaa control: 9/10 at 3 months.
- **Trough claim HOLDS.** The widest Baa reading of each recession came **at or before the trough in 9 of 11** (window: recession start → the earlier of the next peak or trough+24). Exceptions: 1970 (+4 months) and 2001 (+11 months, 2002-10). In the 3 months after the trough the spread narrowed in 7/11 and was flat (≤+0.08) in the rest.
- **Disposition:** both are hedged ("tend to", "begin to") and supported. **Nothing to change in L39 §2's spread wording**; recorded here so no run re-derives it.
- **Second pick: glossary `PMI`**, noted "arguable" three times (l.5811, 5850, 5920) on the grounds that L39 spells out what 50 means. Re-read: that is the argument *for* the fix — the lesson and its own glossary chip disagreed, the same shape as `8f7b684`/`c30e684`.
- **Instrument:** DBnomics `ISM/pmi/pm` (keyless) + FRED `USREC`, `GDPC1`, `PAYEMS`, `IPMAN`. **Controls:** bogus DBnomics id → **404**; 2020-05 **43.1** and 2022-12 **48.4** match ISM's headlines; the post-2025-08 junk (11.1, 10.0, 10.0, 10.3) reproduces what the 09-13 L39 run found (archive l.57699) and is excluded; `GDPC1` 2020Q2 vs 2019Q4 **−9.1%**, the known collapse.
- **Measured:** PMI below 50 in **26/26** months 2022-11 → 2024-12 (first prints: 2024-03 was 50.3, hence "almost every month"). Real GDP 2022Q4 → 2024Q4 **+5.9%** (2.9% and 2.8% annual-average growth in 2023 and 2024). Payrolls **+3.97M to +4.38M** depending on the start month. `USREC` 0 from 2022-01 through 2026-08.

#### What shipped (5 strings, 1 file, all five languages)
- **Glossary `PMI` `f`** (en): *"Monthly survey asking purchasing managers whether orders, output, hiring and other activity went up or down from the month before. Above 50 = growing, below 50 = shrinking, in the sector surveyed rather than the whole economy. A leading indicator, but a reading below 50 is not a recession forecast: the US manufacturing PMI stayed below 50 in almost every month from late 2022 through 2024, yet the economy grew about 6% and added about 4 million jobs."* es/ko/zh/ja carry the same content, using L39's own per-language terms (ko `50 초과`/`경기침체`, ja `50超`/`景気後退`, zh `高于50`/`衰退预报`, es `EE.UU.`). `ex` unchanged. ko/ja/zh previously said "50 이상/以上" (≥50); they now say above, matching L39.
- ⚠️ **My first patch also said "factory output fell about 2%" and "more than 4 million jobs".** The self-check shifted the window by one month and both broke: `IPMAN` runs **−2.6% to +0.4%** across start/end choices, and payrolls fall to **3.97M** from a 2022-12 base. A second count-asserted patch (`patch2.mjs`) dropped the factory clause and made the jobs figure "about 4 million". After it, `2%` / `factory output` / `공장 생산` / `工厂产出` / `工場の生産` / `más de 4 millones` → **0** in the PMI entry, all five languages.
- Patchers: old ×1 / new ×0 before, 0 / 1 after, or nothing is written. Original is `scratchpad/spread/orig/glossary.js`. All five strings read back from the imported module.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `refresh-readiness --check` | **exit 0** |
| `check-blindspot` | **exit 0**. Planted *"You should buy tech stocks now."* after the new en clause (anchor count 1) → **exit 1, §10.1**. Restored from the scratchpad copy (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | All five new closing clauses → `markets-*.js`. Old `Below 50 = contraction. Leading` and `50 미만=수축. 선행 지표` → **no file**; the first patch's `factory output fell` → **no file**. Control: unchanged Fed Funds definition → `markets-*`. Negative probe → no file |
| Live walk | **not done.** Text-only change to a glossary string; the chip already renders longer entries (Credit Spread) |

#### Step 5: adversarial self-check. It found one real defect, fixed above (the window-fragile factory and jobs figures)
- **Does "in the sector surveyed rather than the whole economy" overstate?** It is ISM's own definition of the index (a diffusion index of the surveyed sector's month-on-month change), and it matches L39's "activity growing / shrinking". **Does it contradict L39's "tends to move before the broader economy"?** No; the glossary keeps "A leading indicator".
- **§10.2:** no Dalio text; `/dalio/i` in `glossary.js` → 0. **§10.1:** dated history, no advice (the plant covers it). **Live-looking figure:** closed 2022-24 window only. **DECISIONS.md:** 0 hits for `PMI`. **Already-done:** extends the 09-13 L39 fix (archive l.57695) to the glossary; undoes nothing. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- Quiz explain for the "Fear Gauge" question ends *"Contrarian investors watch for spikes as potential buying opportunities."* It describes others' behavior, and L39 §1 says the same with "on the theory that". `check-blindspot` passes it. Arguable; not picked.

**Owner-facing, one line:** the glossary said a PMI below 50 means "contraction", the name of a recession phase in this app; US manufacturing PMI sat below 50 through 2023-24 while the economy grew about 6%. The glossary now says 50 marks growth or shrinkage in the surveyed sector, matching lesson 39, in five languages. Separately, lesson 39's credit-spread timing claims were measured and **hold**. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1: residual pick #1 in a new chain, which the rule allows. The previous run was a free pick, and its only note was this one: "Quiz explain for the 'Fear Gauge' question ends *'Contrarian investors watch for spikes as potential buying opportunities.'* … Arguable; not picked") — the quiz explanation told learners, **in the app's own voice**, that **"Contrarian investors watch for spikes as potential buying opportunities."** Lesson 39 attributes the idea (*"Some contrarian investors … on the theory that panic is often overdone"*) but never says how that theory has done. Measured: **after most VIX spikes above 40 since 1990, US stocks were higher a year later (7 of 9), but about as often as a year after any ordinary day (81.8%)**. **A spike did not reliably mark the bottom:** after the first close above 40 in the 2008 crisis (2008-09-29), SPY fell **38.4%** further, to 2009-03-09, and the first spikes of 2001 and 2020 were followed by falls of **22.3%** and **24.3%**. The quiz line now attributes the theory, as L39 does, and gives the 2008 counterexample. L39 now gives the record. All five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/vix/a.mjs`. FRED keyless `VIXCLS` (header checked `observation_date,VIXCLS`; 1990-01-02 → 2026-09-17) and Tiingo `SPY` `adjClose` (1993-01-29 → 2026-09-18, 8,467 days). **Controls:** VIX record closes **82.69 on 2020-03-16** and **80.86 on 2008-11-20** are the published figures. SPY close 2020-03-23 is **222.95**, the known low. Bogus Tiingo ticker → **HTTP 404**. The VIX did not close above 40 before SPY's data starts (max 36.47, 1990-08-23), so no episode is lost.
- **Episode = first close above 40 after ≥126 trading days without one:** 1998-08-31, 2001-09-17, 2002-07-22, 2008-09-29, 2010-05-07, 2011-08-08, 2015-08-24, 2020-02-28, 2025-04-04. 12-month SPY total return: **+39.3, −14.6, +22.7, −2.3, +23.0, +27.6, +18.1, +34.0, +35.3** → **7/9 positive**. Base rate: **81.8%** of all 8,215 days had a positive 12-month forward return (median +14.4).
- **Sensitivity** (the count depends on the episode definition, so the copy says "most", not "7 of 9"): threshold 40, gap 63 → 8/10; gap 252 → 6/8; threshold 35 → 11/14; 45 → 6/7; 30 → 11/14. It is **75-86% every way**, against 81.8%. The 2008 further fall is **−38.4%** (adjClose) / **−38.8%** (price) at threshold 40 or 45, and **−40.8%** at 35: "almost 40%" holds.
- ⚠️ **Instrument failure, caught:** my first sensitivity loop printed **nothing** for every variant. zsh passed `"40 63"` as one argument, so the threshold was NaN (the `zsh-does-not-word-split` memory); the ugrep `{4}` filter then hid it again. A silent empty table reads as "no episodes". Re-run with `for t g in …`: numbers above.
- **Disposition:** the lesson's hedge ("on the theory that") is accurate as far as it goes. The quiz line was not hedged, and neither surface said the theory's record is about the base rate. The residual note called it arguable on §10.1 grounds. The data settles it: the line presented spikes as opportunities, and the record does not support more than the base rate.

#### What shipped (10 strings, 10 files, all five languages)
- **Quiz `explain`** (Fear Gauge, en): *"Some contrarian investors treat spikes as a sign that panic is overdone, but a spike does not reliably mark the bottom: after the VIX first closed above 40 during the 2008 crisis, US stocks fell almost 40% further."*
- **L39 §1**, appended to the contrarian sentence (en): *"The record is mixed. After most spikes above 40 since 1990, US stocks were higher a year later — but about as often as a year after any ordinary day. And a spike does not reliably mark the bottom: after the first one of the 2008 crisis, stocks fell almost 40% further."* es/ko/zh/ja carry the same content. es keeps each file's own word (*inversores* in the quiz, *inversionistas* in L39).
- ⚠️ **First patch said "September 2008"; `check-blindspot` §2.3 failed it** as a "Month YYYY" date in teaching copy. `patch2.mjs` reworded it to "the 2008 crisis" in all ten strings (es/ko/zh/ja too, for consistency, though §2.3 only matched en).
- Patchers: old ×1 / new ×0 before, 0 / 1 after, or nothing is written. Originals are in `scratchpad/vix/orig/`. Ledger: L39 es/ko/zh/ja re-marked `ai`. `refresh-readiness --write`: en 161,059 → **161,327** chars.

#### Verification
| Check | Result |
|---|---|
| `npm test` after patch 1 | **exit 1**: the expected ledger mismatch, then §2.3 "September 2008" |
| `npm test` final | **exit 0**, 0 FAIL / 3 WARN (the standing three). §83 paragraph walls: none over the ceiling |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* after the new clause in both en files → **exit 1, §10.1**, both files listed. Restored from the scratchpad copy (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | New clauses → `lessonContent.economy.<lang>` and `quizText.<lang>` for all five. Old `as potential buying opportunities`, `잠재적인 매수 기회로 주시합니다`, `潜在的买入机会`, `September 2008` → **no file**. Control: unchanged `on the theory that panic is often overdone` → `lessonContent.economy.en`. Negative probe → no file |
| Live walk | **not done.** Text-only; the L39 paragraph grows by three sentences and §83 measures it under the ceiling |

#### Step 5: adversarial self-check. It found one real defect (the Month-YYYY date), fixed above
- **Could "higher a year later … about as often as any ordinary day" read as a buy signal?** It is the opposite: the clause exists to say a spike added nothing to the odds. I left out the median (+23% vs +14.4%) on purpose. With 9 episodes it is not robust, and it would read as a return promise. **Is "does not reliably mark the bottom" true?** 3 of 9 first spikes were followed by falls of more than 20%, and 1998's was the bottom. "Not reliably" is the claim both ways.
- **§10.2:** no Dalio text. **§10.1:** advice-adjacent wording removed rather than added (plant proves the guard sees both files). **Live-looking figure:** closed historical episodes only, and the date is phrased as "the 2008 crisis". **DECISIONS.md:** 0 hits for `VIX`. **Already-done:** extends the 09-13 L39 VIX cutoffs work and undoes nothing. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- Nothing new.

**Owner-facing, one line:** the quiz told learners VIX spikes are "potential buying opportunities". Measured since 1990, stocks rose in the year after a spike about as often as after any day, and in 2008 they fell almost 40% further after the first spike. The quiz and lesson 39 now say that, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was residual pick #1 and its note was "Nothing new", so this was a free pick. It came from reading every English quiz `explain` for a causal claim no run had measured. `expansion begins again from there` returns **0** measurements in `AGENT_LOG.md`, `AGENT_LOG.archive.md`, `CLAIMS.md`, `DECISIONS.md`. The one archive hit (l.37028) *restored* the clause to es/ko/zh/ja for parity and never tested it) — quiz `q012` (L38, the Trough question) explained that **"the year following a market bottom has shown some of the strongest average returns, since expansion begins again from there."** The timing is backwards. **In 9 of the 10 US recessions since 1957, the stock market's low came 1-5 months *before* the recession ended**, while the economy was still shrinking. **L38's own Trough section already says so** (*"The stock market's own low has usually come before the economy's"*), so the quiz contradicted the lesson it tests. **The exception, 2001, is the counterexample:** the recession ended in November 2001, and SPY did not hit its low until **2002-10-09**, 11 months later. The explanation now gives the lead, the gain after the low, and says the low is clear only in hindsight, with 2001 as the example, in all five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/trough/a.mjs`, `b.mjs`. FRED keyless `USREC` (header checked; 1854-12 → 2026-08) and `SPASTT01USM661N` (OECD monthly US share prices, 1957-01 → 2026-08). Tiingo `SPY` daily, 8,467 days. **Controls:** SPY daily lows land on the published dates **2002-10-09, 2009-03-09, 2020-03-23** (222.95). Bogus Tiingo ticker → **HTTP 404**.
- **Market low = monthly minimum from the peak to trough+12.** Months the low came before the NBER trough: 1957-58 **5**, 1960-61 **4**, 1969-70 **4**, 1973-75 **3**, 1980 **3**, 1981-82 **4**, 1990-91 **5**, 2001 **−11**, 2007-09 **3**, 2020 **1**.
- ⚠️ **First window (peak−12 → trough+24) was wrong, and the table showed it:** it picked the 1962 crash for 1960-61 and 1979-02 for 1980. It also crashed on 1957, because that window starts before the data does. With the window tightened, every low falls in the month of the published daily low or up to 2 months after it (monthly averages lag daily lows).
- **12-month return from the low:** median **+32.7%** (81st-100th percentile of all 824 12-month windows; base median **+9.4%**). **From the NBER trough month:** median **+13.1%**, with 1 of 10 negative (2001, **−16.0%**; SPY total return from the end of the trough month **−16.3%**).
- **Disposition:** "strongest gains after the low" holds, but only in hindsight. "Since expansion begins again from there" is false in 9 of 10 cases on timing, and in 2001 the order ran the other way.

#### What shipped (5 strings, 5 files)
- en: *"At the trough, sentiment is at its most negative. The stock market's own low has usually come a few months before the economy's, while the recession was still under way, and the year after that low has brought some of the market's strongest gains. But the low is clear only in hindsight: after the 2001 recession ended, US stocks did not hit their low until almost a year later."* The hedge sentence after it is unchanged. es/ko/zh/ja reuse L38 Trough's own wording for the first clause.
- ⚠️ **Step 5 found a defect in the first draft, which said "kept falling for almost another year".** SPY *rose* 3.1% from 2001-11-30 to 2002-01-04 (114.05 → 117.62), then fell to the October low. `patch2.mjs` changed it to "did not hit their low until" in all five languages.
- Patchers: old ×1 / new ×0 before, 0 / 1 after, or nothing is written. Originals are in `scratchpad/trough/orig/`. No lesson text changed, so the ledger and readiness figures are unchanged.

#### Verification
| Check | Result |
|---|---|
| `npm test` (final text) | **exit 0**, 0 FAIL / 4 WARN: the standing three, plus the run-log budget (see below) |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* after the new clause (en) → **exit 1, §10.1**. Restored from the scratchpad copy (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** (`dist/` untouched) |
| Built bundle | New 2001 clause → `quizText.<lang>` for all five. Old `since expansion begins again from there`, `そこから拡大が再び始まるからです`, and the first draft's `kept falling for almost another year` / `siguieron cayendo casi un año más` → **no file**. Control: unchanged `not a guarantee for any specific future trough` → `quizText.en`. Negative probe → no file |
| Live walk | **not done.** Text-only, in an explanation that already renders |

#### Step 5: adversarial self-check. It found one real defect (the "kept falling" wording), fixed above
- **Does "strongest gains after the low" read as a buy signal?** The same sentence now says the low can be seen only in hindsight and gives a year in which waiting for the recession to end still meant buying before a further fall. That is less advice-adjacent than the old text, which tied the gains to a phase a learner might think they can identify. §10.1: the plant proves the guard sees this file.
- **§10.2:** no Dalio text. **Live-looking figure:** closed episodes only, with the year and no month (§2.3 green). **DECISIONS.md:** 0 hits for `trough`. **Already-done:** the archive l.37028 run restored the clause for translation parity. This run replaces it in all five languages at once, so parity holds. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- `q012`'s **keyed option** reads *"Pessimism is at its worst, but it has often been a strong time to find investment opportunities"*. It is advice-adjacent in the app's voice, and changing it moves a quiz key and the option-length cue. Arguable; not picked.
- **Run-log budget:** `npm test` warned *before* this entry that it had 0.37 runs of room left (247,056 of 250,000 b warn). This entry goes over the warn line (fail is 350,000). **The next run's pick is the archiving pass.**

**Owner-facing, one line:** a quiz explanation said stocks rebound after a bottom "since expansion begins again from there". In 9 of 10 recessions since 1957 the market bottomed a few months *before* the recession ended, and in 2001 it bottomed almost a year after. The explanation now says that, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: this pick was triggered by an instrument and named by the previous run's second note, "the next run's pick is the archiving pass") — W-5.3's **seventeenth** firing: `npm test` warned that the run log was **over** the 250,000 b warn budget, so 2026-09-17 (8 entries, 84,479 b) moved to the archive

#### Step 3.5: the premise measured, with controls
- **Trigger:** `MEASURED log-size: file 693743 b, run log 253749 b, floor 439994 b (backlog 401588 b), archive 4459935 b, 3 live day(s)`, taken 2026-09-19 at `c58a667`. That is 101.5% of warn (over by 3,749 b, 0.48 runs). **Premise HOLDS.** The script's controls 1-4 fired `ok`.
- **Headings against commits:** 09-17 has 8 headings, and 8 commits touch `AGENT_LOG.md` that day (`f631020` … `6402d2c`); each adds exactly one `+### 2026-09-17` line. The only 09-16 commit is `3585207` (market data), and `### 2026-09-16` returns 0 in both logs, so the archive title's jump from 09-15 to 09-17 hides no entry.
- **How many days:** the instrument's plan was one day, leaving 169,270 b = **10.3 runs** at the measured +7,838 b/commit. That is more than the 16th pass's three-day cut bought (8.6), and 09-18 holds the arguable notes the current chain still cites (`Inflation`, the `q012` keyed option lives in 09-19). One day moved.

#### What shipped
- 09-17 → `AGENT_LOG.archive.md` under `## Archived 2026-09-17`, verbatim, in live-file order. The archive title moves to `→ 2026-09-17` (same length).
- Run log **253,749 → 169,270 b**, file **693,743 → 609,264 b** before this entry and tally, archive **4,459,935 → 4,544,438 b** (+24 b heading + 84,479 b block). W-5.3 got a four-line tally.
- `scratchpad/arch/move.mjs` works in `Buffer` space with 13 assertions (one `## Run log`, every heading dated, 09-17 oldest, contiguous, first, 8 entries, blank-line boundaries on both files, title once and same length, day not already archived), all before any write. It passed on the first run, and its block size equals the instrument's 84,479 b.

#### Verification
| Check | Result |
|---|---|
| Pre-cut | tree `cmp`-equal to `git show HEAD:` for both logs |
| **P1** conservation (block read back out of the new archive and reinserted rebuilds HEAD's live file byte for byte) | **true** |
| **P2** composition (HEAD archive + title + heading + block cut **independently** by line split) | **true** |
| **P3** containment | **8/8** archived once, 0 live |
| **P4** floor above `## Run log` identical to HEAD | **true** |
| Plant 1 (1 char in a moved body line) / Plant 2 (1 backlog line deleted) / Plant 3 (the fourth 09-17 entry deleted from archive) | P1+P2 false / P1+P4 false / P1+P2+P3 false (7/8). Each plant failed exactly its targets |
| Install guard | HEAD re-read `c58a667` and both files `cmp`-equal to HEAD copies immediately before copying; outputs `cmp`-equal after |
| Post-cut `check-log-size` | **0 WARN / 0 FAIL**: `run log 169270 b … 2 live day(s)`, 10.3 runs of headroom |
| `git diff --numstat` (before this entry and tally) | archive +378/−1 (the title line); live 0/−375, a pure cut |
| `npm test` and build | see the commit: both re-run after this entry was written |

#### Step 5: adversarial self-check
- **Blindspot register / stale-date rule:** no file under `src/`, `public/` or `scripts/` was touched, so §10.1-10.3 and §2.3 have nothing to regress on. **DECISIONS.md:** nothing governs archiving mechanics. **W-5.3's limit was respected:** only the action was taken; no clause, budget or script changed, and items 115/121 and O-6 remain the owner's.
- **Already-done:** this is the rule's seventeenth intended repeat. **My verification claim:** P1-P4 use `git show HEAD:` copies as the reference, so a reviewer can re-derive them from the repo. **Limit:** `npm test` cannot see archive loss, so the proofs are the evidence and the green suite is not.
- Nothing found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- Nothing new. The previous run's note on `q012`'s keyed option (*"it has often been a strong time to find investment opportunities"*, advice-adjacent in the app's voice) is unchanged and still live in the 09-19 entry above.

**Owner-facing, one line:** housekeeping only, with no learner-visible change. One run-log day (09-17, 8 entries, 84 KB) moved verbatim to the archive, with a byte-for-byte proof. The log-size warning is cleared and `AGENT_LOG.md` is about 615 KB. **O-6** (should the archiving pass be automated?) is still your call. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** only the W-5.3 tally (4 lines).

### 2026-09-19 (owner-directed: "fix the q012 keyed option next". This is the 09-19 `q012` run's note, taken up on instruction, so W-6.2 rule 1 does not arise) — quiz `q012` (L38, the Trough question) keyed **"Pessimism is at its worst, but it has often been a strong time to find investment opportunities"**: an investing suggestion in the app's own voice, and the longest option by 33 characters in English. **Both halves measured weaker than they read.** The key now says **"Stocks have usually already risen off their low"**, the fact L38's Trough section teaches and the explanation already gives. **In 9 of 10 recessions since 1957, stocks were already 1-27% above their low by the month the recession ended.** In all five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/q012/a.mjs`. FRED keyless `USREC`, `UMCSENT`, `SPASTT01USM661N` (all HTTP 200, headers checked). **Controls:** a bogus series id → **HTTP 404**. The derived troughs are the published NBER months (1958-04 … 2020-04, 10 of 10). The market-low leads (5, 4, 4, 3, 3, 4, 5, −11, 3, 1 months) and the 9.4% base median reproduce the previous `q012` run's figures exactly.
- **Stocks at the NBER trough month, against their low (peak → trough+12):** 2.2, 11.6, 11.4, 25.3, 17.3, 26.9, 21.1, 26.3, 1.3% above it in the 9 recessions where the low came first. 2001 is the exception: its low came 11 months later.
- **"Often a strong time":** the 12-month return from the trough month was −16.0 … +47.6%, median **+12.4%**, against a **+9.4%** median and 72.5% positive for all 824 windows. Three of the ten were at or near the base (9.4, 9.4, 10.6%). The return was somewhat better than usual, not reliably strong, and "find investment opportunities" is advice framing whatever the number.
- **"Pessimism is at its worst":** since 1978, when the survey went monthly, Michigan sentiment's low (peak−6 → trough+12) came **2-8 months before** the NBER trough in 4 of 6 recessions (1980 2, 1982 8, 1990-91 5, 2007-09 7). It came in the same month in 2020 and 11 months after in 2001. At the 2009 trough sentiment read 70.8 against a 55.3 low (2008-11). The pre-1978 data is quarterly and not counted.
- **Disposition:** the premise holds (the option was advice-adjacent), and the measurement adds that its first half is timed wrong in most monthly-era recessions. The replacement uses only the stock fact, which is the best-supported claim (9/10) and the one the lesson already makes.

#### What shipped (5 strings, 5 files; the answer index is unchanged at 1)
- en *"Stocks have usually already risen off their low"*, es *"Las acciones normalmente ya han subido desde su mínimo"*, ko *"주식은 보통 이미 저점에서 올라와 있었습니다"*, zh *"股票通常已经从低点回升"*, ja *"株価はたいてい底値から上がっていた"*.
- **Length cue:** the new key is neither the longest nor the shortest option in any language. The first ja draft (…すでに底値から上がっていた, 21) was the strict longest, so it was cut before patching. Tap-the-longest: en **54.3 → 52.2%**, es 52.2 → 50.0, ja 50.0 → 47.8, ko 52.2 → 50.0, zh 47.8 → 45.7 (one question fewer in each). Tap-the-shortest is unchanged. Item 160 listed `q012` in class B, and this change does not claim to settle that class.
- Patcher: old ×1 / new ×0 before, 0 / 1 after, or nothing is written. Originals are in `scratchpad/q012/orig/`. Quiz text is not in the lesson ledger, so the readiness figures are unchanged.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three; the length-cue figures above are its §65 line) |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* inside the new en option → **exit 1, §10.1**. Restored from the scratchpad copy (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | Each new option → its own `quizText.<lang>` chunk only. Old `strong time to find investment` and `寻找投资机会的好时机` → **no file**. Control: the unchanged `Interest rates are typically at their highest point` → `quizText.en`. Negative probe → no file |
| Live walk | **not done.** Text-only, in an option that already renders |

#### Step 5: adversarial self-check
- **Does the new key contradict the lesson or the explanation?** No: L38 Trough says *"The stock market's own low has usually come before the economy's"*, and the explanation says the same and names 2001 as the exception, which is why the key says "usually".
- **Does it make distractor 4 true?** *"Stocks have historically continued falling for years afterward"*: the one exception fell for 11 months, not years. It stays false.
- **New cue?** The key and distractor 4 are now the two "Stocks …" options and point opposite ways, so a learner can narrow to two without the lesson. That is weaker than the length tell it replaces, and the stem tests the lesson's point directly.
- **§10.1:** the change removes an advice-framed sentence and adds none; the plant proves the guard sees this file. **§10.2:** no Dalio text. **Live-looking figure:** none shipped. **DECISIONS.md / CLAIMS.md:** 0 hits for `trough` or `keyed option`. **Already-done:** the previous `q012` run changed only `explain`. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **"Sentiment is at its most negative" at the trough** is in `q012`'s explanation (all five languages) and L38 Trough's *"This is the point of maximum pessimism"*. Measured above: in 4 of 6 monthly-era recessions sentiment bottomed 2-8 months **before** the trough. A fix changes lesson text in five languages and the ledger, so it was not bundled into this owner-scoped change. It is measured and ready to pick.
- L38 Trough's *"Historically favored in this phase: beaten-down quality stocks, high-yield bonds, and real estate at distressed prices"* is the same framing as the old key. The 09-18 asset-list run covered those lists, so it is not re-raised here.

**Owner-facing, one line:** the Trough quiz's correct answer said the trough "has often been a strong time to find investment opportunities". It now says stocks had usually already risen off their low (true in 9 of 10 recessions since 1957), in five languages, and it no longer gives itself away as the longest option. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "fix the trough pessimism claim next". This is the previous run's first note, taken up on instruction, so W-6.2 rule 1 does not arise) — lesson 38's Trough section opened **"This is the point of maximum pessimism"**, and quiz `q012`'s explanation opened **"At the trough, sentiment is at its most negative."** The lesson ties its phases to recession months (its Contraction section says *"from a contraction's first month to its last"*), so its trough is the month a recession ends. **By then, US surveys of confidence have mostly already hit bottom:** OECD business confidence bottomed 1-9 months earlier in 8 of 10 recessions since 1957 (in the same month in the other 2), and consumer confidence 1-8 months earlier in 7 of 9. **The mood was still grim:** business confidence was in the bottom 13% of its history at all 10 troughs. Both surfaces now say the mood is still grim but has mostly passed its worst, and the lesson gives 2008-09 as the example, in all five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/q012/b.mjs` (the previous run's `a.mjs` for troughs). FRED keyless `UMCSENT`, `CSCICP03USM665S` (OECD consumer confidence, 1960-01 → 2024-01), `BSCICP03USM665S` (OECD business confidence, 1950-01 → 2024-01), and `USREC`, all HTTP 200. **Controls:** a bogus id → **HTTP 404**, and the derived troughs are the 10 published NBER months. Window: peak−6 → trough+12, the same shape as the stock-low window.
- **Months from the confidence low to the NBER trough:** business **3, 8, 0, 2, 1, 6, 2, 9, 6, 0** (earlier in 8, same month in 2, never after). Consumer (OECD, 9 recessions) **3, 1, 3, 2, 8, 4, −11, 4, −2** (earlier in 7). Michigan monthly era (1978+) **2, 8, 5, −11, 7, 0**. The OECD consumer series is built from the Michigan survey, so the two are not independent; business confidence is.
- **Still grim at the trough:** business confidence at the trough month sat at the 1st-13th percentile of its full history in 10 of 10. Michigan: 8th-21st in 4 of 6, and 49th (1991-03) and 43rd (2001-11) in the others.
- **Disposition:** the premise holds. "Maximum" is wrong on timing in most cases, and "still grim" is right. The 2008-09 example: Michigan's low was **55.3 in 2008-11**, seven months before the 2009-06 trough.

#### What shipped (15 strings, 10 files, plus the ledger and readiness figures)
- **L38 Trough**, all five languages. The opener changed (en *"The mood is still grim here — boarded-up storefronts…"*), and the first paragraph gained: *"Surveys tell the same story: in the US, consumer and business confidence have mostly hit bottom a few months before the recession ended, so the gloom has usually passed its worst by the trough itself. Consumer sentiment's low in the 2008-09 recession came in late 2008, about seven months before it ended."*
- **`q012` explain**, all five languages. The opening sentence is now *"At the trough the mood is usually still grim, but it has mostly passed its worst: in the US, surveys of consumer and business confidence have usually hit bottom a few months before the recession ended."* The rest is unchanged.
- ⚠️ **Step 5 found a defect in the first draft**, and `check-blindspot` caught it: the example read "November 2008", which is §2.3's "Month YYYY" shape (reads as live). It now says "late 2008" in all five languages (es *a finales de 2008*, ko *2008년 말*, zh *2008年底*, ja *2008年末*). A second self-found fix: the ja opener doubled 暗い with the next clause's 暗い見出し, so it became 重苦しい.
- Ledger: L38 es/ko/zh/ja re-marked `ai` (via `translation-review.mjs mark`, after re-reading each new Trough paragraph against the English), then re-marked again after the date fix. `refresh-readiness --write`: catalog 161,328 → **161,623** English chars, LAUNCH_PLAN §4.0 ~161,000 → ~162,000 chars and 28,100 → 28,200 words, plus the §10.4 volume sentence. `translation-completeness --write` was **not** run (see memory: it rewrites every ratio).
- Patchers: every old string ×1 / new ×0 asserted before any write, 0 / 1 after. Originals are in `scratchpad/pess/orig/`.

#### Verification
| Check | Result |
|---|---|
| `npm test` (final text) | **exit 0**, 0 FAIL / 3 WARN (the standing three). Ledger report: es/ko/zh/ja **44/44, 0 stale** |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* after the new L38 example (en) → **exit 1, §10.1**. Restored from the scratchpad copy (`cmp` identical) → exit 0. It had already fired on the first draft's "November 2008" (§2.3) |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | Each new opener → its own `lessonContent.economy.<lang>` / `quizText.<lang>` chunk. All eight old openers (`point of maximum pessimism`, `sentiment is at its most negative`, `punto de máximo pesimismo`, `비관론이 최대치에`, `悲观情绪最重的时刻`, `悲観が最大になる地点`, `底では心理が最も悲観的`) and `November 2008` → **no file**. Control: the unchanged `Historically favored in this phase: beaten-down` → the en lesson chunk. Negative probe → no file |
| Live walk | **not done.** Text-only, in a section and an explanation that already render |

#### Step 5: adversarial self-check. It found two real defects (the §2.3 date, the ja repetition), both fixed above
- **Do "still grim" and "passed its worst" contradict each other?** No: the measurement is exactly that. Confidence was low at every trough but had usually turned up from its low.
- **Does the new paragraph contradict the rest of L38?** It extends the section's own point that the stock market's low came before the economy's. The Peak section's *"the mood hasn't caught up yet"* is untouched (see note).
- **§10.1:** nothing advice-framed was added; the plant proves the guard sees the lesson file. **§10.2:** no Dalio text. **§2.3:** caught and fixed; the example names a closed episode by year only. **DECISIONS.md / CLAIMS.md:** 0 hits for `pessimis` or `sentiment`. **Already-done:** the 09-13 and 09-18 L38 runs changed the stock and asset sentences, which are untouched here. **W-6.3:** 0 lines added to `scripts/` (the ledger JSON changed 16 lines of data).
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- L38 Trough, second sentence: *"historically, this is also where the strongest rebounds have started"*. On the same measure, the stock rebound started 1-5 months **before** the trough in 9 of 10 recessions, so "here" means the trough phase broadly rather than the month. Arguable; not measured further.
- L38 Peak: *"Growth stalls, even though the mood hasn't caught up yet"*. It is the mirror claim (sentiment lagging at the peak) and has never been measured. `b.mjs` can answer it by swapping the window to the peak.

**Owner-facing, one line:** lesson 38 and its quiz said the trough of a recession is the point of "maximum pessimism". In US surveys, confidence has usually bottomed a few months before the recession ended, though it was still low at the trough. Both now say the mood is still grim but past its worst, with 2008-09 as the example, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "measure the peak mood claim next". This is the previous run's second note, taken up on instruction, so W-6.2 rule 1 does not arise) — lesson 38's Peak section said **"Growth stalls, even though the mood hasn't caught up yet."** **The premise broke, and it broke the other way:** the mood had usually turned down *before* the recession began. **US business confidence peaked at least 8 months before each of the 11 recessions since 1953** (OECD, ISM-based), and by the recession's first month it had already made a median **54%** of its whole fall to the recession low. Consumer confidence turned down 3-24 months before 8 of 9. The sentence now says the mood has usually already begun to sour, with the business-confidence figure, in all five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/q012/c.mjs` (timing and share of the fall), `d.mjs` (placebo). Series: FRED keyless `USREC`, `UMCSENT`, `CSCICP03USM665S`, `BSCICP03USM665S`, already fetched and header-checked by the previous run (bogus id → 404). **Control:** the derived peaks are the 11 published NBER months (1953-07 … 2020-02).
- **Months from the confidence high (peak−24 → peak) to the NBER peak:** business **9, 24, 12, 9, 10, 18, 8, 24, 16, 24, 18**: 11 of 11 at least 8 months earlier. Three sit at the 24-month window edge, so the true lead is at least that long, which only strengthens the finding. Consumer (OECD, 9 recessions) **3, 11, 16, 24, 0, 23, 13, 11, 23**. Michigan (1978+) **23, 8, 18, 14, 11, 23**.
- **Share of the peak-to-trough+12 fall already made by the peak month:** business median **54%** (≥25% in 10 of 11; 1973 was 13%). OECD consumer median **57%** (1981 0%, 2020 15%). Michigan median **51%** (2020 **1%**).
- **Placebo** (so "fallen from a 2-year high" is not simply what confidence usually looks like): business confidence's drop from its trailing high at the peak month was above the median for expansion months not within 24 months of a peak in **11/11** (60th-100th percentile at a 24-month look-back, 58th-99th at 12). OECD consumer: **7/8** (1981-07 was 0, straight after the 1980 recession). Michigan: 4/6 (1981, 2020).
- **Disposition:** the claim is backwards on average. Exceptions: 2020 (a sudden shock, with consumer mood still near its high) and 1981 (a second recession right after 1980). The replacement cites the business series, which holds in 11/11, and says "usually" for consumers.

#### What shipped (5 strings, 5 files, plus the ledger and readiness figures)
- en: *"Growth stalls, and the mood has usually already begun to sour: in the US, business confidence topped out at least 8 months before each of the 11 recessions since 1953 began, and consumer confidence usually turned down months ahead of them too."* es/ko/zh/ja carry the same content (re-read against the English before `mark`).
- Ledger: L38 es/ko/zh/ja re-marked `ai`. `refresh-readiness --write`: catalog 161,623 → **161,809** English chars, plus the §10.4 volume sentence. LAUNCH_PLAN's rounded figures did not move. `translation-completeness --write` not run.
- Patcher: old ×1 / new ×0 asserted before any write, 0 / 1 after. Originals are in `scratchpad/peak/orig/`.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three). Ledger 44/44, 0 stale |
| `check-blindspot` | **exit 0**, with §2.3 clean (years only). Planted *"You should buy stocks now."* after the new sentence (en) → **exit 1, §10.1**. Restored from the scratchpad copy (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | Each new sentence → its own `lessonContent.economy.<lang>` chunk. All five old sentences → **no file**. Control: the unchanged `This is where the seeds of the next contraction` → the en chunk. Negative probe → no file |
| Live walk | **not done.** Text-only, in a section that already renders |

#### Step 5: adversarial self-check
- **Does it contradict the Trough change an hour earlier?** No. Both now say mood turns before the economy does: it sours before the peak and bottoms before the trough. The two sections now agree with each other and with the stock-timing sentences around them.
- **"At least 8 months" and the window edge:** the shortest measured lead is 8 (1981-07). Leads capped at 24 are lower bounds, so "at least" stays true.
- **"Consumer confidence usually turned down months ahead":** 8 of 9 (OECD) and 6 of 6 (Michigan) highs came before the peak, the shortest by 3 months, and 2020's fall was 1-15% done. "Usually" covers that, and the sentence does not claim a share for consumers.
- **§10.1:** no advice; the plant proves the guard sees the file. **§10.2:** no Dalio text. **§2.3:** years only. **DECISIONS.md / CLAIMS.md:** 0 hits for `pessimis`/`sentiment` (checked in the previous run; this run adds no new term those files govern). **Already-done:** the 09-13/09-18 L38 runs changed the growth/value sentence in this section, which is untouched. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- L38 Peak's first sentences: *"every worker is employed"* and *"Inflation is running at highs"*. The town narrative states these as facts of the phase. Inflation peaking at or after the business-cycle peak is measurable (FRED `CPIAUCSL`), but I have not measured it. Not picked.

**Owner-facing, one line:** lesson 38 said that at an economic peak "the mood hasn't caught up yet". In US data it is the reverse: business confidence peaked at least 8 months before every recession since 1953 and was about halfway down by the time each one started. The lesson now says the mood has usually already begun to sour, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "measure the peak inflation claim next". This is the previous run's note, taken up on instruction, so W-6.2 rule 1 does not arise) — lesson 38's Peak section said **"Inflation is running at highs, and the Fed is raising rates to cool things down."** The inflation half **mostly holds**: at 7 of 11 US recession starts since 1953, CPI inflation was at 84-100% of its high for that expansion, and it rose further during the recession in 7 of 11. **The Fed half does not:** the fed funds rate had usually already peaked (0-16 months before the recession began), and **in all four US recessions since 1990 it was lower than a year earlier, because the Fed had already started cutting.** The Peak section and the "Why These Assets" Peak paragraph (*"At the Peak, the Fed is actively raising rates"*) now say the Fed usually raised rates in the run-up and had often stopped by the peak, in all five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/q012/e.mjs`, `f.mjs`, `g.mjs`. FRED keyless `CPIAUCSL` (1947-01 → 2026-08), `FEDFUNDS` (1954-07 → 2026-08), `USREC`. **Controls:** CPI year-on-year **14.6%** at 1980-03 and **9.0%** at 2022-06 (the published NSA figures are 14.8/9.1; this is SA). Fed funds **6.54** at 2000-07, **5.26** at 2007-07, **19.08** at 1981-01. The 11 NBER peaks as published.
- **Fed funds high (peak−24 → peak, latest max) before the NBER peak:** **0, 5, 4, 2, 0, 1, 16, 8, 5, 10** months (1957 … 2020; no data for 1953). **Change over the 12 months to the peak:** +0.51, +0.96, +2.95, +4.97, +3.75, +10.01, then **−1.09 (1990), −0.54 (2001), −1.00 (2007), −0.82 (2020)**. **Change over 3 months:** above +0.1 only in 1957, 1980 (+0.05, flat) and 1981. Over 2 years the rate rose in 10 of 10, so the run-up claim holds.
- **Inflation:** CPI y/y at the peak month relative to that expansion's high: 4, 96, 58, 99, 100, 100, 84, 91, 59, 87, 61% (the 2001 high is a 1991 recession tail). Higher than two years earlier in 7 of 11 (the base rate for all months is 49%). **It rose by more than 0.2 pp after the peak, during the recession, in 7 of 11** (1953, 1969, 1973-74 to 12.2%, 1980, 1990, 2001, 2008 to 5.5%).
- **Disposition:** inflation "at highs" holds loosely, so it became "usually near its high for the expansion". "The Fed is raising rates" at the peak is wrong for the recent record, so it became the run-up and the 1990+ fact. The other surface making the same claim (L38 "Why These Assets") was changed to match. L39's *"CPI has drifted above target"* at Peak: CPI was above 2% at 9 of 11 peaks (0.4% in 1953, 1.9% in 1960). It holds and was left alone.

#### What shipped (10 strings, 5 files, plus `lessons.js`, the ledger and readiness figures)
- L38 Peak, en: *"Inflation is usually near its high for the expansion, and the Fed has usually spent the run-up raising rates to cool things down. By the time a recession begins it has often stopped: in the four US recessions since 1990, it had already started cutting."*
- L38 Why These Assets, en: *"In the run-up to the Peak, the Fed has usually been raising rates to cool the boom, and that same mechanism now runs in reverse on…"* (the rest is unchanged). es/ko/zh/ja carry the same content.
- `check-data` **FAIL** (by design): L38 now computes to 6 reading minutes, so `lessons.js` `minutes: 5 → 6`. `refresh-readiness --write`: catalog **162,000** English chars / **172** min (from 171). LAUNCH_PLAN §4.0, ~28,300 words. CLAIMS.md A6 cell → 172 min. Ledger L38 es/ko/zh/ja re-marked `ai`.
- Patcher: every old ×1 / new ×0 before any write, 0 / 1 after. Originals are in `scratchpad/peakinf/orig/`.

#### Verification
| Check | Result |
|---|---|
| `npm test` | first run **exit 1** (the minutes check), after the fix **exit 0**, 0 FAIL / 3 WARN (the standing three). Ledger 44/44, 0 stale |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* after the new Peak sentence (en) → **exit 1, §10.1**. Restored (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | All 6 new-string probes → their own language chunks. All 6 old phrasings (`Inflation is running at highs`, `the Fed is actively raising rates`, and the es/ko/zh/ja equivalents) → **no file**. Control: the unchanged `Growth stalls, and the mood has usually already begun to sour` → the en chunk. Negative probe → no file |
| Live walk | **not done.** Text-only, in sections that already render |

#### Step 5: adversarial self-check
- **Does "had already started cutting" hold for every one of the four?** Yes. The 12-month change was negative in 1990, 2001, 2007 and 2020, and the known first cuts were June 1989, January 2001, September 2007 and July 2019.
- **Does the Why section still make sense?** Its mechanism (higher rates weigh on long-duration assets) needs rates to be *high*, not still rising. "The run-up" keeps that, and the "(less exposed … to further hikes)" parenthetical still fits the run-up. **Does the Trough/Contraction text conflict?** Contraction says *"the Fed starts cutting rates"*, and now we say that in recent cycles the cutting started before the contraction. That is compatible ("starts" in the phase is looser than first-cut timing), but see the note.
- **§10.1:** no advice added. **§10.2:** none. **§2.3:** "since 1990" and years only. **DECISIONS.md:** nothing on phase text. **Already-done:** the previous run's mood sentence is untouched (it is the bundle control). **W-6.3:** 0 lines in `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- L38 Contraction: *"the Fed starts cutting rates to try to stop the slide"*. In all four recessions since 1990 the first cut came before the recession began, 2.5-10 months ahead. Arguable, because the Fed kept cutting through each contraction. Not picked.
- L38 Peak's *"every worker is employed"* is town-narrative hyperbole and is not measurable as stated.

**Owner-facing, one line:** lesson 38 said the Fed "is raising rates" at an economic peak. In the four US recessions since 1990 it had already started cutting by the time each began, though it did usually raise rates in the run-up. Two lesson passages now say that, in five languages. The inflation half of the claim mostly held and was only softened. Lesson 38 now reads at 6 minutes. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "measure the contraction rate-cut claim next". This is the previous run's first note, taken up on instruction, so W-6.2 rule 1 does not arise) — lesson 38's Contraction section said **"the Fed starts cutting rates to try to stop the slide"**, placing the first cut inside the recession. **That held for all seven US recessions from 1953 to 1982 and failed for all four since:** the discount rate's first cut came 2-13 months after the recession began in every one of the seven, and in 1973-75 the fed funds rate was still rising eight months in. In 1990, 2001, 2007 and 2020 the target rate's first cut came 13, 2, 3 and 6 months *before*. Lesson 32's takeaway and the 09-19 Peak sentence already say the modern half. The Contraction sentence now gives both halves, in all five languages

#### Step 3.5: the premise, measured with controls
- **Instrument:** `scratchpad/q012/h.mjs`. FRED keyless `DFEDTAR` (1982-09-27 → 2008-12-15), `DFEDTARU` (2008-12-16 →), `INTDSRUSM193N` (IMF, US discount rate, 1950-01 → 2021-08), `FEDFUNDS`, `USREC`, all HTTP 200. **"First cut"** = the first decrease after the last increase before the trough. **Controls:** the target series returns the known first cuts **1989-06-06, 2001-01-03, 2007-09-18**. The July 31, 2019 FOMC cut appears as **2019-08-01**, its effective date.
- **First cut, months after the NBER peak:** discount rate **+7 (1953), +3, +2, +11, +13, +4, +4 (1981)**, then +5 (1990), −2, −4, −6. Target rate (1982+): **−13 (1990), −2 (2001), −3 (2007), −6 (2020)**. Cross-check: fed funds 0.5 pp below its cycle high by **+4, +2, +3, +9, +4, +1** (1957-1981), and **−12, −2, −2, −4** (1990-2020). 1990 is the one case where the measures disagree: the discount rate lagged, but the FOMC's target cuts started in June 1989.
- **1973-75:** discount-rate hike 1974-05 (six months in), fed funds high **12.92 in 1974-07** (eight months in), fed funds half a point below that high by 1974-08, discount cut 1974-12.
- **Disposition:** the claim is right for 1953-82 and wrong for 1990-2020, so the sentence now carries both.
- ⚠️ **Correction to my own previous entry:** its note said the post-1990 first cuts came *"2.5-10 months ahead"*. That was **not measured** (it read fed-funds *highs* as cuts). The measured target leads are **2-13 months** (13, 2, 3, 6). The dated entry above is left as written (§31); this line is the correction.

#### What shipped (5 strings, 5 files, plus the ledger and readiness figures)
- en: *"Unemployment rises across the whole town, and the Fed cuts rates to try to stop the slide. In the seven US recessions from 1953 to 1982, it made its first cut only after the recession had begun (in 1973-75 it was still raising rates eight months in); in the four since, it had already started cutting beforehand."* es/ko/zh/ja carry the same content.
- Ledger L38 es/ko/zh/ja re-marked `ai`. `refresh-readiness --write`: catalog **162,212** English chars. The reading time stays at 6 minutes and the catalog at 172 min.
- Patcher: old ×1 / new ×0 before any write, 0 / 1 after. Originals are in `scratchpad/contr/orig/`.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three). Ledger 44/44, 0 stale |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* after the new sentence (en) → **exit 1**. Restored (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | 5 new-string probes → their own language chunks. 5 old phrasings → **no file**. Control: the unchanged `In Contraction, rates are falling` → the en chunk. Negative probe → no file |
| Live walk | **not done.** Text-only |

#### Step 5: adversarial self-check
- **Does "only after the recession had begun" hold on both measures for all seven?** Discount rate +2 to +13 and fed funds +1 to +9 (no fed funds data for 1953). Yes.
- **Does "in the four since … beforehand" conflict with 1990's discount rate (+5)?** The sentence is about when the Fed started cutting, and its policy rate then was the funds target, first cut 1989-06-06. That matches L32's takeaway and the Peak sentence.
- **The Why section's "In Contraction, rates are falling":** over each recession as a whole, rates were lower at the trough than at the peak. That holds even for 1973-75 (10.03 → 5.54). Left alone.
- **§10.1/§10.2/§2.3:** clean (years only). **DECISIONS.md:** nothing on phase text. **Already-done:** the Peak sentence (b45aa0a) is untouched and agrees. **W-6.3:** 0 lines in `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- Nothing new in L38. `kidsContent.js`'s thermostat blurb (*"Too cold (recession)? Lower rates"*) is a parent-facing simplification with no timing claim. Clean.

**Owner-facing, one line:** lesson 38 said the Fed "starts cutting rates" during a contraction. That was true in all seven US recessions from 1953 to 1982, but in all four since, the first cut came 2-13 months before the recession began. The lesson now says both, in five languages. It also corrects an unmeasured figure in my previous note. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was owner-directed and its only note was "Nothing new in L38", so this was a free pick. It came from a scan of every English economy-lesson and quiz sentence carrying a frequency or history word for 5-word runs that appear nowhere in `AGENT_LOG.md`, `AGENT_LOG.archive.md` or `CLAIMS.md` (`scratchpad/unq.cjs`). `occasionally turned negative` returns **0** in all four files and `DECISIONS.md`, and the archive's two `flights to safety` hits quote the sentence without measuring it) — lesson 36's term-premium section said the term premium **"has occasionally turned negative … often during flights to safety"**. **In the New York Fed's own estimate, the one the section names, it was below zero in 97 of the 120 months from 2015 to 2024, including 48 straight months (2017-03 → 2021-02).** Before 2015 it had dipped below zero in only three single months, all in the 1960s. The Fed Board's model agrees on long stretches but not on dates (58 months, mainly 2012-13, 2016 and 2019-21). And the NY Fed estimate stayed negative from 2021-06 to 2023-08, through a surge in inflation and the fastest hikes in decades, which is not a flight to safety. "Trended lower since the 1980s" **holds** on both models. The sentence now gives the stretches and both models' dates, and offers the causes as explanations rather than as fact, in all five languages

#### Step 3.5: the premise, measured with controls
- **Instruments:** NY Fed `ACMTermPremium.xls` (sheet `ACM Monthly`, column `ACMTP10`, 1961-06 → 2026-08, 783 months), read with `xlrd` installed into the scratchpad only. FRED keyless `THREEFYTP10` (Kim-Wright, Fed Board, daily 1990-01-02 → 2026-09-11; negatives counted on monthly means). Scripts: `scratchpad/tp/a.py`, `k.py`.
- **Controls:** a nonexistent FRED id gives **HTTP 404**. The ACM file's own fitted 10-year yield reproduces known levels: **14.91** (1981-09), **0.54** (2020-07), **4.95** (2023-10). ACM's term-premium peak lands at **5.18 in 1984-05**, the well-known early-1980s high.
- **"Trended lower since the 1980s": holds.** ACM mean **3.86** (1980-84) → **1.15-1.19** (2005-14) → **−0.30 / −0.49** (2015-19 / 2020-24) → **0.62** (2025-26). KW **2.1-2.3** (1990-92) → **0.5-0.7** (2025-26). The rise since 2021 leaves it far below the 1980s on both.
- **"Occasionally turned negative": breaks.** ACM negative runs: 1961-12, 1964-11, 1965-05 (single months, min −0.13), then **2015-01→03, 2016-01→10, 2017-03→2021-02 (48 mo, min −1.36 in 2020-07), 2021-06→2023-08 (27 mo), 2023-12→2024-04, 2024-06→09**: **97 of 120 months in 2015-24**. KW: 2012-02, **2012-05→2013-05**, 2016-02, **2016-04→10**, **2019-03→2021-12 (34 mo)**, 2023-04→05. That is **58 months**, and 56 of them fall in the three named periods.
- **"Often during flights to safety": not measurable as stated, and contradicted in one long stretch.** ACM's 2021-06→2023-08 run spans the 2022 inflation surge and hiking cycle. The two models also disagree on dates, which the section's previous paragraph already warns about ("different models disagree with each other").
- **Disposition:** keep the trend clause, replace "occasionally" with the measured stretches, turn the model disagreement the section already mentions into numbers, and state the causes as explanations offered (QE, safe-haven demand), not as a pattern.

#### What shipped (5 strings, 5 files, plus the ledger and readiness figures)
- en: *"…the term premium has trended lower since the 1980s, and in the 2010s it began spending long stretches below zero — meaning investors were willing to accept less for a 10-year bond than pure rate expectations alone would suggest. In the New York Fed's estimate it was below zero in most months from 2015 to 2024, including four unbroken years from 2017 to 2021. A second widely used model, from the Fed's Board of Governors, puts it below zero for fewer months, mainly in 2012-13, 2016 and 2019-21: the disagreement between models described above, in numbers. Explanations offered include the Fed's own bond buying and strong demand for Treasuries as a safe place to hold money in times of stress."* es/ko/zh/ja carry the same content, with house forms reused: `2012-13` ranges (es bare; ko/zh/ja `…年`/`년`), and the NY Fed named as each language's section already names it.
- Patcher: old ×1 / new ×0 before any write, 0 / 1 after (**5/5**). Originals are in `scratchpad/tp/orig/`. Each rendered paragraph was re-read from the imported module, not just string-matched.
- Ledger L36 es/ko/zh/ja re-marked `ai`. `refresh-readiness --write`: English **162,212 → 162,673** chars, LAUNCH_PLAN ~28,400 words. Catalog still **172 min**; `npm test`'s minutes check is green, so L36's `minutes` is unchanged.

#### Verification
| Check | Result |
|---|---|
| After the edit | `npm test` **exit 1**: only LAUNCH_READINESS §10.4 vs ledger (1 stale per language; expected, addressed as above) |
| Final `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `check-blindspot` | **exit 0**. Planted *"You should buy stocks now."* after the new sentence (en) → **exit 1** (§10.1). Restored (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | 5 new-string probes → their own `lessonContent.economy.<lang>` chunk only. 5 old phrasings → **no file**. Control: the unchanged "The Federal Reserve Bank of New York publishes one widely-cited estimate" → the en chunk. Negative probe → no file |
| Live walk | **not done.** Text-only |

#### Step 5: adversarial self-check
- **"Explanations offered include the Fed's own bond buying" while ACM was negative through QT1 (2017-10 → 2019-07)?** The sentence reports explanations economists give, not a measured pattern, and that is why it is worded so. It does not claim QE and negative premia line up month by month, and the two models disagree on 2017-18 anyway (KW positive).
- **"In the 2010s it began":** the first multi-month negative stretch is 2012-05 on KW and 2015-01 on ACM. Both fall in the 2010s, and the 1960s ACM months are single months within 0.13 of zero. Holds.
- **"The disagreement between models described above":** the preceding paragraph of the same section says it. Holds.
- **§10.1 / §10.2 / §2.3:** clean. The text describes past bond pricing and prescribes nothing, it names no persona, and it has years only, no "Month YYYY" (guard green). **DECISIONS.md:** nothing rules on L36 prose. **Already-done:** `occasionally turned negative` is 0 in both logs; the 09-13 L36 runs measured the inversion lead and length, not the term premium. **W-6.3:** 0 lines added to `scripts/`.
- No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- The same scan flagged L36 §1's *"STEEP — … often seen after the Fed starts cutting short-term rates"* and L34's *"Japan … owed largely to its own citizens … for decades without a default"* as never quoted in either log. Both are probably true as stated; **not measured**.

**Owner-facing, one line:** lesson 36 said the bond market's "term premium" has "occasionally" been negative. In the New York Fed's own estimate it was negative in most months from 2015 to 2024, including four straight years. The lesson now says so and gives a second model's dates, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was a free pick and **both of its notes were measured this run and both HOLD**, so neither became a headline — see step 3.5. The pick that replaced them is a standing note two runs older, filed 2026-09-10 and re-filed 2026-09-18 with the words *"Already recorded, and still not picked by default"*) — lesson 12 told learners **"A 30-year loan often doesn't cross the halfway point between interest and principal until roughly two-thirds of the way through its term."** **The crossover month is set entirely by the interest rate, and the sentence never said so.** At about 7% it is month 242 of 360 (**67.2%** of the term, year 20.2) — the sentence is right. At **3%** it is month **84** (**23.3%**, year 7.0), and at 2.5% month 28. Across every week of US 30-year rates since 1971 the crossing lands in a "roughly two-thirds" band (60-73%) in **38.1%** of weeks, **later** than 73% in **35.3%**, and **before halfway** in **19.5%**; the decade medians run **78%** of term (1971-89), **43%** (2010s) and **23%** (2020-21). Anyone who financed at 2020-21 rates was told year 20 for something that happens in year 7. The lesson and quiz `q025` now make the rate the subject and give both cases, in all five languages; the figure's crossing marker names the rate it draws.

#### Step 3.5: the premise, measured with controls — and the first two candidates were REFUTED
The previous run left two notes. **Both were measured first and both hold, so neither was edited.** This is recorded so a later run does not re-derive them:
- **L36 §1 "STEEP — … often seen after the Fed starts cutting short-term rates. A shape frequently associated with recovery."** **HOLDS, strongly, on both halves.** Defining an easing-cycle start as a local top in monthly `FEDFUNDS` followed by a fall of ≥1 pp within 12 months (23 starts, 1957-2024), the 10y-1y spread **steepened over the next 12 months in 21 of 23** (median **+1.05 pp**), against a placebo of **46.5%** of all 869 12-month windows (median −0.07). 10y-3m agrees (21/23); 10y-2y agrees (13/14 from 1976). For the recovery half: the spread at the NBER trough was above its full-sample median in **10 of 11** recessions since 1953, and the mean over the following 12 months in **10 of 11** (placebo 51.4%). The one exception is 1980-07, inverted through the recovery year because the Fed re-tightened. **No edit.**
- **L34's Japan sentence** ("almost entirely yen-denominated and owed largely to its own citizens and institutions … tool 4 for decades without a default"). Its measurable parts hold as stated (highest major-economy debt ratio; JGBs essentially all yen; domestic holders still the large majority). The only soft part is that domestic *ownership* is offered as a reason the central bank *can* print, where the lesson's own preceding paragraph correctly says the operative fact is the *currency*. **Arguable, not wrong; not edited.**
- **The pick that replaced them, re-measured from scratch.** Two independent instruments: a closed form (2(1+i)^(k-1) > (1+i)^n ⟹ k\* = n − ln2/ln(1+i) + 1) and a month-by-month amortization loop. **They agree at every rate tested**, and the closed form **reproduces the two figures already in the log** — 42% at 4% (the 09-10 note) and 67% at 7% (the 09-18 note). **Controls:** loan size must not matter and does not (the loop returns month 223 at 6% for $100k, $300k and $2,000,000 alike — the principal cancels out of the identity); a 15-year term at 6% crosses at 23.9%, not 61.9%, so the instrument is reading the term. `MORTGAGE30US` reproduces the published extremes, **18.63% (1981-10-09)** and **2.65% (2021-01-07)**; a nonexistent FRED id returns **404**.
- **The claim about the code was re-measured too, and it was accurate.** `moneyVisuals.js:738-772` really does derive the whole curve from the prose phrase (`splitCrossing = 2/3`, k = 2^(1/(1−crossing)) = 8), and `splitMarkerLabel` really is the lesson's sentence lifted verbatim in five languages.

#### What shipped (13 files)
- **Lesson 12 §2, all five languages.** en: *"A 30-year loan crosses the halfway point between interest and principal at a time set by the interest rate, not by the size of the loan: at about 7%, roughly two-thirds of the way through its term, around year 20; at 3%, around year 7."*
- **Quiz `q025`'s `explain`, all five languages** — the last sentence now names the rate instead of asserting two-thirds for a "typical" loan.
- **`moneyVisuals.js`.** `splitMarkerLabel` gains the rate in all five languages ("at about 7%, roughly two-thirds of the way through its term"). The figure itself is **unchanged** — same `splitCrossing`, same curve — because a 2/3 crossing is exactly the ~7% loan it always drew. The derivation comment is corrected: it used to say *"no rate is chosen here, and none is rendered … Nothing in the figure or its labels says so, and nothing should"*, which my edit would have made **false prose left behind next to true code**. It now records that the lesson names ~7% independently, that the agreement with k = 8's 6.9% must be re-checked if either side moves, and that the rate is the one exception to the no-numbers rule *because the prose states it too*.
- Ledger L12 es/ko/zh/ja re-marked `ai`; `refresh-readiness --write` (English 162,673 → **162,771** chars; catalog still **172 min**, so no `minutes` change).
- ⚠️ **Two guards caught this edit and both were right.** §70 requires every label in the split figure to be a **verbatim substring of lesson 12's own prose** — my first wording dropped the exact string "A 30-year loan" and moved the fraction away from the rate, so **6 §70 failures** fired. The prose was restructured so each language's marker is a contiguous span of its own sentence, rather than weakening §70. Then §34's ordinal guard flagged zh **"第20年"/"第7年"** as possible lesson cross-references; the zh wording was changed to **"20年左右" / "7年左右"** rather than adding `年` to `NON_LESSON_COUNTERS`, which would have loosened the instrument for every future run (W-6.3: **0 lines added to `scripts/`**).

#### Verification
| Check | Result |
|---|---|
| Patcher | old ×1 / new ×0 before any write, ×0 / ×1 after, on all 10 content strings (3 passes, originals in scratchpad) |
| Rendered, not string-matched | All 10 strings re-read from the **imported modules**; CJK clean; `splitInterestShare(2/3)` = **0.5000** exactly |
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `check-blindspot` | **exit 0**. Planted *"With rates this low, now is a good time to buy a home."* → **exit 1, FAIL §10.1**. Restored (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | 5 new-string probes → their own lesson chunk and `LessonReader` (the marker lives in `moneyVisuals`); 3 old phrasings incl. `第20年前后` → **no file**; negative control → no file |
| **Live walk** | **Done.** `dist/` served statically, walked to L12. Desktop: marker one line (343×17 px), crossing dot on the curve at 2/3. **Mobile 375px: wraps to two lines, `scrollWidth === innerWidth`, no horizontal overflow.** zh: marker 190×17, prose sentence renders in full. **No console errors.** ⚠️ The static server's 404 control is **uninformative by design** — SPA fallback returns 200 for any path, so the render itself is the control |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: the new text is amortization arithmetic and prescribes nothing; proven by plant, not by reading. §10.2 Dalio: none. §10.3 kids framing: untouched. **Stale-date / live-looking figure: the one worth stating.** "about 7%" sits near the actual current 30-year rate (6.95%, 2026-09-17) — but it is used as one of **two** illustrative rate levels alongside 3%, carries no date, is not labelled current, and the figure's own caption already reads *"Example figures, for teaching — not a projection of your own results"*. `check-blindspot` is green.
- **DECISIONS.md.** Its only lesson-12 entries are about **"PMI"**, in a paragraph this edit did not touch; re-checked after the edit, `PMI` still appears **2×** in L12 en (control: `localStorage` returns 13).
- **Already-done.** `two-thirds`, `crossover`, `amortiz` and `lesson 12` all return **0** in "Completed and pruned". This **closes** a note filed twice and picked neither time; it does not redo one.
- **Would a reviewer reproduce my claims?** The amortization figures need no network — closed form and loop, both given above, and they reproduce two figures the log already held. The rate history needs one keyless FRED CSV whose extremes are published.
- **Could the new text be wrong?** (i) 67.2% is "roughly two-thirds" and year 20.2 is "around year 20"; 23.3% is year 7.0. (ii) "not by the size of the loan" is exact, not approximate — the principal cancels. (iii) The term still matters, and the sentence is scoped to a 30-year loan throughout. (iv) No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- L12 §1's **"another 5%-6% in agent commissions"** still predates the 2024 NAR settlement. Flagged by the 09-18 run, still not measured, still no keyless source.
- L34's Japan sentence, as above: the *currency* does the work the sentence partly credits to *domestic ownership*. Arguable, low value, measured enough to say it is not false.

**Owner-facing, one line:** lesson 12 told learners a 30-year mortgage doesn't tip from mostly-interest to mostly-principal until about two-thirds of the way through. That is true at about 7% — but at 3% it happens around year 7, not year 20. The lesson, the quiz and the figure's label now say what the rate has to do with it, in five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** run log 213,592 b before this entry (`check-log-size`, 2026-09-19). **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "fix the 5%-6% agent commission claim next". This is the previous run's first note, taken up on instruction, so W-6.2 rule 1 does not arise) — lesson 12 said selling a home "usually costs another **5%-6% in agent commissions** — a rate that is negotiable rather than fixed", and **three separate runs flagged it as drifting post-NAR-settlement** (archive l.15957 on 2026-09-10, then l.5131 and l.6107, each recording *"not measured, no keyless source"*). **The premise broke, and it broke in the opposite direction from all three notes: the number is right, and it did not drift.** The US national average total commission was **5.46%** in August 2026 and **5.50%** in 2021 — essentially flat straight through the settlement — and Redfin's closed-transaction data puts the buy-side at **2.43%** in Q1 2024 (before the rules), **2.36%** in Q3 2024 (when they took effect) and **2.40%** in Q1 2025. What the sentence was actually missing is the **structural** change: since **August 17, 2024** a seller is no longer expected by default to pay the buyer's agent, that compensation may not be published on the MLS, and buyers must sign a written agreement with their own agent. Most sellers still pay it, which is why the average barely moved. The sentence now gives the average, the roughly even split, the 2024 change and the fact that it did not lower the cost, **in all five languages**.

#### Step 3.5: the premise, measured with controls — and the standing note was WRONG
- **The instrument was the web, which the three prior notes assumed was unavailable** ("no keyless source"). It is available to this session. **Control: a plausible but nonexistent page on the same host (`nar.realtor/the-facts/…-qzx-nonexistent`) returns HTTP 404 rather than an invented answer**, so a positive result is not the fetcher confabulating.
- **"5%-6%" HOLDS.** Clever's August 2026 agent survey (n=434): total **5.46%**, listing side **2.76%**, buy side **2.70%**; state range **4.62%** (New York) to **6.00%** (Virginia). Five-year trend **5.50% (2021) → 5.46% (2026)**. The national average has never left the 5%-6% band in the window measured.
- **"Drifting" is REFUTED, and by a second, independent instrument of a different kind.** Redfin's aggregated closed-transaction data (not a survey): buy-side **2.43% → 2.36% → 2.37% → 2.40%** across Q1 2024, Q3 2024, Q4 2024, Q1 2025. Had sellers stopped paying the buyer's agent, this is the series that would have collapsed; it did not move.
- **"Negotiable rather than fixed" HOLDS**, and is now better supported than when written — NAR's own settlement FAQ states compensation "is not set by law and is fully negotiable".
- **The real gap, from NAR's own FAQ:** the practice changes took effect **August 17, 2024** (MLSs opting in had until September 16, 2024); offers of buyer-broker compensation may not be published on an MLS; written buyer agreements are required before touring; sellers **may** still offer compensation off-MLS or as a concession.
- **Disposition: keep the figure, add what changed.** Deleting or lowering "5%-6%" — the fix all three notes implied — would have made the lesson **less** accurate. This is the second run in a row where re-measuring flipped a note's disposition rather than just its numbers.
- ⚠️ **A finding the notes never mentioned, caught only by reading all five languages:** the "negotiable rather than fixed" hedge existed in **en, es and zh** and was **absent from ko and ja entirely**. Those two learners were told a flat 5%-6% with no hedge at all. The new text carries the full content in all five, so this closes as a side effect rather than as a separate item.

#### What shipped (10 files)
- **Lesson 12 §1, all five languages.** en: *"…and selling later usually costs another 5%-6% in agent commissions — the US national average has sat near 5.5% for years, split roughly half to each side's agent. Rates are negotiable rather than fixed, and a 2024 legal settlement changed US practice so that a seller is no longer expected by default to cover the buyer's agent's half; most sellers still do, and that share has barely moved since."*
- **No change to the figure "5%-6%" anywhere**, and **no change to `thinkAbout`**, which uses 5%-6% as a given and is still correct. The claim was verified, not replaced.
- **§83 fired and was obeyed rather than worked around.** The added text pushed lesson 12 section[0] paragraph[1] (es) to **1,684 characters ≈ 40 rendered lines**, over the 36-line ceiling. A `\n\n` was inserted **in all five languages** at the seam the paragraph already had — where the topic turns from transaction costs to ongoing ownership costs ("A homeowner is also on the hook…"). **Only the break was inserted; not one word changed, so every translation stays exactly as reviewed**, which is §83's own prescribed remedy.
- Lesson 12 now computes to **5** reading minutes (`lessons.js` 4 → 5; catalog 172 → **173 min**, propagated by `refresh-readiness --write` to LAUNCH_READINESS §4.3, LAUNCH_PLAN §4.3 and CLAIMS.md A6). Ledger L12 es/ko/zh/ja re-marked `ai`.

#### Verification
| Check | Result |
|---|---|
| Patcher | 3 passes with count assertions. ⚠️ **The ko/ja post-assertion failed and the assertion was wrong, not the edit** — those two are *append* edits, so the old string legitimately survives **inside** the new one. Re-verified directly: old ×1, new clause ×1, and the old string is immediately followed by the new clause in both |
| Rendered, not string-matched | All 5 re-read from the **imported modules**; CJK clean |
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three). Three failures were hit and fixed on the way: minutes, §83, and the ledger |
| `check-blindspot` | **exit 0**. Planted *"You should sell now to lock in these commission savings."* → **exit 1, FAIL §10.1**. Restored (`cmp` identical) → exit 0 |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | 5 new-string probes → each lands in its own `lessonContent.essentials.<lang>` chunk; 3 old phrasings → **no file**; negative control → no file |
| **Live walk** | **Done.** Desktop and **375px mobile**, en + ja. The new sentence renders in full; the inserted break renders as a **real blank line** (the body is `white-space: pre-line`, so `\n\n` is a visual paragraph break inside one `<p>`); header reads **"≈5 min"**; `scrollWidth === innerWidth`, no horizontal overflow; **no console errors** |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: the text reports what commissions cost and what a rule change did; it tells nobody to buy, sell or list. Proven by plant. §10.2 Dalio: none. §10.3 kids framing: untouched. **Stale-date / live-looking figure — the one that needed care.** I deliberately wrote *"has sat near 5.5% for years"* rather than "5.46% in 2026": the durable claim is the one the five-year series supports (5.50% → 5.46%), and it does not rot the way a single current-year figure would. "2024 legal settlement" is a dated historical event, the same shape as the lesson's existing "in 2024" down-payment figure that the 09-18 run already cleared. `check-blindspot` green.
- **DECISIONS.md.** Its only lesson-12 entries concern **"PMI"**, in the paragraph after the seam; re-checked after the edit — `PMI` still appears **2×** in L12 en. Nothing rules on commissions.
- **Already-done.** `agent commission`, `NAR settlement` and `5%-6%` all return **0** in "Completed and pruned". This **closes** a note filed three times and measured none of them.
- **W-6.3:** 0 lines added to `scripts/`.
- **Could the new text be wrong?** (i) "near 5.5%" = 5.46%, and "roughly half to each side" = 2.76 / 2.70 — both exact enough for the words used. (ii) "most sellers still do" is inferred, not surveyed: the direct evidence is that the buy-side average did not move, which it could not have failed to do if sellers had broadly stopped paying. That inference is stated in the log rather than dressed up as a measurement. (iii) The sources are an agent survey and a brokerage's own transaction data, not a government series — weaker than this project's usual FRED footing, and the two are independent of each other, which is why both are quoted. (iv) US-specific, and the lesson already frames the section around US figures. (v) No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- Nothing new in L12. The closing-cost "2%-5%" and the down-payment figures were both measured by the 09-18 run and still hold.

**Owner-facing, one line:** three earlier runs flagged lesson 12's "5%-6% agent commissions" as out of date after the 2024 real-estate settlement. Measured: **the number is right and barely moved** — the US average is about 5.5% and was 5.5% before the settlement too. What was missing is that since August 2024 the seller is no longer expected by default to pay the buyer's agent, and that most sellers still do, which is why costs didn't fall. Also found and fixed: **Korean and Japanese were missing the "negotiable, not fixed" hedge entirely.** **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** run log 223,689 b before this entry (`check-log-size`, 2026-09-19). **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "fix the ko/ja hedge gap in other lessons next". **The premise was REFUTED: there is no second instance.** The run re-decided onto a different, real defect the sweep uncovered — see step 3.5) — the 09-19 commission run found that L12's *"negotiable rather than fixed"* hedge existed in en/es/zh and was **missing from ko and ja**, which reads like a class. **It is not one.** Every English strong-qualifier sentence in all **32 non-abridged lessons** was checked against all four translations; **all 15 flagged instances turned out to be false positives**, and the flaw was in my lexicon every time. What the sweep *did* find, on a differently-shaped instrument, is that **lessons 13 and 16 are uniformly short in all four languages at once** — the signature of English that grew after the translations were made. In L13 §1 **all four** had dropped the clause saying *why* settlement timing matters, and **es alone** had also dropped the limit-order sell variant that ko/zh/ja all kept. Restored, in all four languages.

#### Step 3.5: the premise, measured with controls — refuted twice over
- **First instrument (hedge RATE per 1000 chars, lexicon-based).** Controls: corpus reaches real text in all 5 languages; the just-fixed L12 §1 scores >0 in all 5; a nonsense marker scores 0. Result: **0 sections** where ko/ja fall below 25% of their own baseline while en is at or above its own. ⭐ **ko, zh and ja hedge MORE per character than English** (5.74 / 7.60 / 5.96 vs **2.63** per 1000 chars), so a raw count comparison would have "found" a gap in every CJK section and been wrong every time.
- **Second instrument (strong qualifiers only — the ones whose loss turns teaching into assertion).** 15 flags. **I hand-read every one. All 15 carry the qualifier.** The lexicon missed each by an inflection or a synonym: ko `뜻이 아닙니다` (I had `뜻은 아니`), ja `意味しません` and `規則ではなく` (I had `意味ではありません`, `規則ではありません`), zh `没人能保证`, `没有任何保证`, `并不是说` (I had `不保证`, `并不意味`), es `no hay garantía` (I had `no garantiza`). **L36 §0's yield-curve caveat — "a strong signal, not a certainty" — is present and correct in all four.**
- ⛔ **Repairing the lexicon BROKE THE OTHER CONTROL, and that is the finding worth keeping.** v2 added the phrasings above and cleared all the hand-proven cases (CONTROL 1 OK) — but **CONTROL 2 then failed**: with `아닙니다` in the list, the scanner scored the *pre-fix* L12 ko text as hedged, so it could no longer detect the one omission that is known to be real. **v1 had bad recall; v2 had bad precision; neither tuning passes both controls at once.** ⚠️ **A lexicon cannot measure this class, and no run should file a backlog item proposing one.** Hand-reading is the only instrument here that held up.
- **Conclusion: L12's ko/ja gap was an isolated omission, not a class.** Recorded so no future run re-derives it.
- **Re-decided onto what the sweep actually found.** Third instrument, section-level translated/English character ratio against **each language's own median** (es 1.131, ko 0.549, zh 0.339, ja 0.482 over 76 sections). At ≤70% of own median: **0**. At ≤85%: **15, and they are not scattered — they are lessons 13 and 16, in all four languages simultaneously** (L13 §0 72-82%, L13 §1 73-84%, L16 §0 73-78%, L16 §1 77-83%). **One language short is translation style; four short in the same section is the English having moved.** Neither lesson is on the abridged list (1-11, 14), so **item 93 does not cover this** and no run has recorded it (`L13`/`L16` return 0 hits for any translation note; control: `lesson 12` returns 10 + 22).
- **Verified by reading, not by ratio**, before editing: L13 §1's English ends *"…one business day after the trade, **a detail that mostly only matters for quickly using the proceeds of a sale to buy something else**."* **All four translations stopped at the mechanical fact** and dropped the reason to care. Separately, es alone had *"'solo compra a este precio o menos'"* where en/ko/zh/ja all carry the sell variant too.
- **The one fact I was editing around was itself checked:** US equity settlement really is **T+1**, one business day, under SEC rule 15c6-1 **effective May 28, 2024**, so the English sentence being restored is correct and current.

#### What shipped (7 files)
- **L13 §1, four languages** — the settlement "why it matters" clause restored: es *"…—cambiar oficialmente de propietario— un día hábil después de la operación, un detalle que sobre todo importa si quieres usar enseguida el dinero de una venta para comprar otra cosa."*; ko *"이 점은 주로 매도한 대금을 곧바로 다른 것을 사는 데 쓰려 할 때만 문제가 됩니다."*; zh *"——这一点主要在你想马上用卖出所得去买别的东西时才有影响。"*; ja *"これが主に問題になるのは、売却した代金をすぐに別のものの購入に使いたい場合です。"*
- **es also regains the limit-order sell variant** *"(o 'solo vende a este precio o más')"*, bringing it level with the other three.
- **No English changed**, so no `minutes` or catalog change. Ledger L13 es/ko/zh/ja re-marked `ai`; `refresh-readiness --write` updated §10.4's volume sentence only.
- ⚠️ **§33 fired and its prescribed fix was NOT used.** It says to re-record with `translation-completeness -- --write`, which **rewrites every ratio in the file** — the trap that re-recorded 32 ratios across 16 lessons for a one-lesson edit on 2026-09-16. Instead lesson 13's four values were patched by hand (es 1.02→1.07, ko 0.49→0.51, zh 0.31→0.32, ja 0.42→0.43) **with an assertion that exactly one of the 44 keys changed**; `git diff` confirms **4 lines**.

#### Verification
| Check | Result |
|---|---|
| Patcher | 5 anchors, each unique; old ×1 / new ×0 before, new ×1 after (append-style edits assert the NEW string, since the old legitimately survives inside it) |
| Rendered | All four re-read from the imported modules; CJK clean |
| Ratio recheck | L13 §1 es/ko/zh now clear the 85% band; ja **73% → 80%** |
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `check-blindspot` | **exit 0**. Planted *"Deberias comprar acciones ahora mismo."* into the es file → **exit 1, §10.1**. Restored (`cmp` identical) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | 5 restored-clause probes → their own `lessonContent.essentials.<lang>` chunks; 3 old truncated endings → **no file**; negative control → no file |
| **Live walk** | **Done**, es at 1024px: both restorations render in the same paragraph — the sell variant and the full settlement sentence. No horizontal overflow, **no console errors**. ⚠️ One screenshot came back **entirely black** and was discarded rather than read as evidence; the DOM read is what this row rests on |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 proven by plant. §10.2 Dalio: none. §10.3 kids framing: untouched. No date or live-looking figure added — the restored text carries no number at all.
- **DECISIONS.md.** Nothing rules on L13. The `.js`-not-JSON content module rule is respected (content edited in place, no new file).
- **Already-done.** `L13`/`L16` translation notes return **0** in both logs; "Completed and pruned" has no entry. Not a redo.
- **W-6.3:** **0 lines added to `scripts/`** — all three instruments were scratchpad-only and are deliberately not shipped, because instrument 2 proved the class is not lexicon-measurable.
- **Could the new text be wrong?** (i) The restored clauses are translations of shipped English, not new claims. (ii) T+1 is verified above. (iii) The ja section is still at 80% of its median — Japanese runs short generally and the specific omission is fixed, so I did not pad it to hit a number. (iv) No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **L13 §0 and L16 §0/§1 are still 72-83% of their languages' medians in all four languages** — the same signature, not yet read line by line. This is the obvious next pick and it is a **measured** lead, not a hunch. **L16 §1 zh is absent from the ≤85% list only because zh's §1 ratio is 0.288 vs a 0.339 median (85.1%)**, which is a threshold artifact, not a clean bill of health.

**Owner-facing, one line:** the ko/ja hedge gap I found in lesson 12 is **not** a pattern — I checked every qualifier in all 32 full-length lessons and the other 15 suspects all turned out fine (my detector was at fault, not the translations). But the sweep turned up something real: **lessons 13 and 16 are short in all four languages at once**, which means the English grew and the translations never caught up. In lesson 13 all four had dropped the sentence explaining why trade-settlement timing matters, and Spanish had also lost a sell-order example. Restored. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** run log 233,110 b before this entry (`check-log-size`, 2026-09-19). **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "fix L13 §0 and L16 next". This is the previous run's measured lead, taken up on instruction, so W-6.2 rule 1 does not arise) — the previous run left three sections carrying the four-language short signature. **Read line by line, they are not one defect but two kinds**, and only one kind was restored. **What all four translations had dropped and now carry again:** L13 §0's closing advice on *which* account is for which goal; L16 §1's sentence saying the manipulation tactics **don't work on someone who decided in advance** — the only agency in an otherwise fatalistic paragraph; L16 §1's reason the 24-hour rule works (*the want has usually evaporated*); and L16 §0's payoff for Dan's savings, a loop the translations opened and never closed. **What was deliberately left dropped: colour and voice** — an apposition, a "nearly every book about money" aside, a "worth being honest about that" clause. **L16 §0 is therefore still flagged at 76-81% in all four languages, on purpose.**

#### Step 3.5: the premise, re-measured by reading rather than by ratio
The lead was a ratio, and a ratio cannot say *what* is missing. Every one of the three sections was read in all five languages before anything was edited.
- **L13 §0 — premise HOLDS, one clean all-four drop.** English closes *"Many people end up using both kinds of accounts for different goals: **tax-advantaged accounts for retirement, and a taxable brokerage account for money that might be needed sooner**."* **All four stop at "for different goals"** and drop the half that says which is which — the only actionable sentence in the section. (es also softens [1]'s *"just because money arrived"*, and ko drops it; **not restored**, the meaning survives in all four.)
- **L16 §1 — premise HOLDS, and this is the most consequential find of the three.** Paragraph [2] lists what the industry does to you (one-tap checkout, *"Only 2 left"*, countdown timers) and English ends *"**None of it works particularly well on someone who has already decided in advance how they want to spend.**"* **All four dropped that sentence.** Without it the paragraph tells a learner they are being manipulated and offers nothing back — and it is also the setup for [4]'s methods. Paragraph [4] loses a second one: all four stop at *"check whether they still want it"* and drop *"**a surprising share of the time, the want has simply evaporated**"*, which is the reason the method works rather than a ritual. (es alone also dropped *"instead of against nothing at all"*, which ko/zh/ja all kept — restored, same shape as the 09-19 es sell-variant.)
- **L16 §0 — premise PARTLY BREAKS. Four all-four drops, and only one of them is teaching.** Restored: *"**and his savings have grown a little on their own**"* — paragraph [1] tells all five languages that Dan put the remainder in an interest-bearing account, and only English pays that off three years later. **NOT restored, and named so the next run does not "fix" them:** [2]'s *"a person with a bit more money buying something they wanted"* (the heading and "felt exactly the same" already carry it), [3]'s *"a name that turns up in nearly every book written about money"* (colour), [4]'s *"and it's worth being honest about that rather than pretending otherwise"* (voice). ⭐ **These translations are condensed, not wrong. Restoring them would be padding to clear a threshold, which is exactly what the 09-19 run refused to do for ja, and the refusal has to survive an owner asking for the section by name.**
- **Track check, caught by an assertion and not by luck:** the first anchor pass reported **13 of 17 anchors missing at count 0**. Cause: **L16 is in the `money` track, not `essentials`** — L13 is essentials, L16 is money. Re-pointed; all 17 then resolved **×1**. Had the patcher not asserted counts before writing, this would have silently written nothing for L16 and reported success.

#### What shipped (11 files, 17 strings)
- **L13 §0 × 4** — e.g. es *"…para metas distintas: las cuentas con ventajas fiscales para la jubilación, y una cuenta de corretaje sujeta a impuestos para el dinero que podría necesitarse antes."*; ja *"…税制優遇のある口座は老後のため、課税対象の証券口座はもっと早く必要になるかもしれないお金のため、という具合です。"*
- **L16 §1 × 8** — the defense sentence (ko *"이 가운데 어느 것도, 돈을 어떻게 쓸지 미리 정해둔 사람에게는 별로 통하지 않습니다."*; zh *"这些手段对一个已经事先决定好自己要怎么花钱的人，都不太起作用。"*) and the evaporating want (ja *"驚くほど多くの場合、その欲求はただ消えています。"*), plus es's *"en vez de contra nada"*.
- **L16 §0 × 4** — Dan's savings (zh *"；而且他存下的钱也自己长了一点。"*).
- **No English changed**, so no `minutes` or catalog change. Ledger L13+L16 es/ko/zh/ja re-marked `ai`; §10.4 volume sentence refreshed.
- **§33 fired for both lessons and its `--write` was again NOT used** (it rewrites all 44). Lessons 13 and 16 were patched by hand — 13: es 1.07→1.10, ko 0.51→0.52, zh 0.32→0.33, ja 0.43→0.44; 16: es 0.86→0.91, ko 0.45→0.48, zh 0.29→0.30, ja 0.38→0.40 — **with an assertion that exactly two of the 44 keys changed**; `git diff` confirms **8 lines**.

#### Verification
| Check | Result |
|---|---|
| Patcher | **17 anchors, each unique ×1** (after the track correction above); each replacement absent before, present ×1 after |
| Rendered | All 16 all-four restorations re-read from the imported modules **and asserted to land in the intended paragraph index**, not merely somewhere in the file |
| Ratio recheck | flagged sections **15 → 9**. L16 §0 stays flagged in all four **by design** — see step 3.5 |
| `npm test` | **exit 0**, 0 FAIL / 3 WARN (the standing three) |
| `check-blindspot` | **exit 0**. Planted Korean *"지금은 주식을 사기 좋은 때입니다."* into `lessonContent.money.ko.js` → **exit 1, §10.1** — so the guard reaches non-English surfaces, which this run is the first to prove. Restored (`cmp` identical) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0** |
| Built bundle | 12 probes: L13's four land in `lessonContent.essentials.<lang>`, L16's eight in `lessonContent.money.<lang>` — **the track split is confirmed in the artifact, not just the source**. Negative control → no file |
| **Live walk** | **Done**, ko and es. L16 ko: all three restorations present, read back in context ("…빠른 쪽이 결정하게 만들기 위해 존재합니다. **이 가운데 어느 것도, 돈을 어떻게 쓸지 미리 정해둔 사람에게는 별로 통하지 않습니다.**"). L13 es: the which-goals clause closes the section. No horizontal overflow, no console errors |
| ⚠️ Screenshots | **Two came back entirely black and were discarded.** Cause diagnosed rather than retried: `tabs_context` reports **"The Browser pane is currently hidden"**, and a hidden pane returns blank pixels. DOM/text reads are what the row above rests on — the same failure went unexplained in the 09-19 L13 run and is now explained |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 proven by plant, in Korean. §10.2 Dalio: none. §10.3 kids framing: untouched. No date or figure added; the restored clauses carry no numbers.
- **DECISIONS.md.** Nothing rules on L13 or L16 prose. Content edited in place in `.js` modules, per the closed decision.
- **Already-done.** Not a redo: the 09-19 run fixed L13 **§1**; this is **§0** plus L16, and both were named as open leads in that run's own "seen, not fixed" list.
- **W-6.3:** **0 lines added to `scripts/`.**
- **Am I padding?** The honest risk on this pick, and the reason L16 §0's three colour losses were left and the residual 76-81% flag was reported rather than cleared. A run that restores until a number goes green is optimizing the instrument, not the lesson.
- **Could the new text be wrong?** (i) Every restored clause is a translation of shipped English, not a new claim. (ii) The L16 §1 defense sentence is a claim about advertising tactics, not investing, and is the English author's, unchanged. (iii) No fluent reader has seen the es/ko/zh/ja wording (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **The four-language short signature is now exhausted for these three sections**, and what remains in them is condensation the project has chosen to live with. **The ratio instrument has no more unread leads above 85%** — a future run wanting more should lower the threshold deliberately and expect diminishing, mostly-stylistic returns.
- L13 §1 ja is at 80% of its median, unchanged from the 09-19 run; Japanese runs short generally and its specific omission is already fixed.

**Owner-facing, one line:** in lessons 13 and 16 the English had grown and the translations never caught up. The most important loss: lesson 16 lists the tricks shops use to make you decide fast, and **all four translations had dropped the sentence saying those tricks don't work on someone who decided in advance** — the one piece of good news in the paragraph. Restored, along with which account type is for which goal (lesson 13) and why the 24-hour rule works. **I deliberately did not restore the purely stylistic losses**, so lesson 16 §0 still reads as "short" on the instrument; that is a choice, not an oversight. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** run log 242,399 b before this entry (`check-log-size`, 2026-09-19). **Backlog:** 0 b added.

### 2026-09-19 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run was owner-directed, and its own closing note declared its class finished — *"the ratio instrument has no more unread leads above 85%"* — so this was a free pick. It came from ranking every content module by last-touch date AND commit count, the instrument the 09-17 `policyScenarios` run used) — the glossary defined **Yield Curve** as *"Inverted = recession warning, historically about 6 months to 2 years ahead"* with the example *"an inversion has preceded every US recession since 1955."* — **no hedge at all, on the one surface of five that has none.** **The step-3.5 premise broke, and it broke toward making the item bigger:** this is not an unswept entry, it is a fix **reported done on 2026-08-02** and left three-quarters done for 48 days

**Step 3.5 — the premise, re-measured, with the correction that changed what this item is.**
- **What I filed it as:** "`sectors.js` (1 commit) and the macro glossary cohort were never swept for this." **Wrong.** The 2026-08-02 "Stale and dated factual figures reworded" entry (AGENT_LOG.md:4553) records the yield-curve claim being weakened *"across lesson bodies, quiz explanations **and glossary entries**"*. Measured this run: the hedge **is** in `lessonContent.economy.en.js` (takeaway + a `thinkAbout` that names the 2022 inversion), in `quizText.en.js` (*"though not every inversion has been followed by a recession, so it isn't a perfect predictor"*), and in `markets.js:526` — and is **absent from `glossary.js`**, in all five languages. **The glossary carries the same sentence as the quiz `explain` and drops the clause the quiz keeps.** A run's own "applied across X, Y and Z" is a claim about coverage, not a measurement of it.
- **The lag range, measured.** FRED `T10Y2Y` daily (1976-06-01→2026-09-18) against `USREC`. Leads from the **onset** of the episode preceding each of the six US recessions since the series begins: **18, 11, 20, 14, 25, 7 months** — so **7 to 25 months**, and the old "about 6 months to 2 years" was a fair summary *of the pre-2022 record*, not wrong.
- **What broke it is the most recent instance, and it is the one inside a learner's own memory.** The **2022-07-06 → 2024-09-05** inversion ran **539 negative days**, the longest and among the deepest (**-1.08**) in the series, and `USREC` is **0 for every month from 2020-05 through 2026-08** — **49 months (4.08 years) from its onset with no recession**, more than double the top of the range the glossary was teaching. The app's own lesson 36 `thinkAbout` already says this; its glossary chip contradicted it.
- ⚠️ **A control caught my own dead instrument and stopped me editing a sentence that is fine.** My first pass computed 10y−3m from **monthly** `GS10`−`TB3MS` and reported **no inversion before the 1957, 1960 and 1990 recessions** — which would have refuted the `ex` field's *"every US recession since 1955"*. On **daily** `DGS10`−`DTB3` the 1990 case inverts cleanly (**6 negative days, min -0.07, 1989-06-09**, 14 months ahead); the monthly average had washed out a six-day dip. Control: the known 1968-69 inversion returns **137 negative days, min -0.45**. 1957 and 1960 predate `DGS10` (starts 1962-01-02) and are **not testable here in either direction**. **So "since 1955" was left exactly as it was** — the claim I could not verify is also the claim I could not refute, and the instrument that said otherwise was broken.
- **Instrument controls that fired:** a nonexistent FRED id → **HTTP 404** (vs 200 for all five real series); `GS10` 1981-09 = **15.32** and `TB3MS` 1981-05 = **16.30** (published); `USREC` 2020-03/04 = 1 and 2020-05 = 0, 2007-11 = 0 and 2008-01 = 1 (NBER peaks/troughs); `T10Y2Y` range −2.41…2.91.

#### What shipped (1 file, 10 strings — `src/content/glossary.js`, the `Yield Curve` entry, 5 languages × `f` and `ex`)
- **`f`** now gives the measured range and the counterexample: *"Inverted = recession warning — ahead of the six US recessions since 1976 it came 7 to 25 months first. But an inversion is not a guarantee: the curve inverted in 2022 and more than four years later no recession had followed."*
- **`ex`** gains the clause the quiz `explain` has carried since 2026-08-02: *"— though not every inversion has been followed by one."*
- **Written as "more than four years later", not "by 2026", and that was a second-pass correction of my own first draft.** "By 2026" is ambiguous between "by the start of" and "by the end of" and a recession beginning in late 2026 would arguably falsify it. "More than four years later" is measured (49 months) and refers to a **closed** window, so no future event can make it false.
- No English lesson, quiz or `markets.js` prose changed, so **no `minutes` or catalog change**. §67 still reports **0/344** glossary pairs under threshold, so lengthening the English stranded no translation.

#### Verification
| Check | Result |
|---|---|
| Patcher | 10 anchors, each asserted **unique ×1** before writing; CJK replacements additionally **refused** if they carried a 2+ Latin-letter run. Stage 2: 5 more, same assertions |
| Rendered | All 10 strings **read back from the imported module**, not grepped — lengths sane, em dashes real (the `—` escapes decode), no garbled CJK |
| `npm test` | **exit 0**, 0 FAIL / **4 WARN — the same four as before this run** (translation review, translation completeness, option-length cue, log size) |
| `check-blindspot` | **exit 0**. Planted *"Now is a good time to buy stocks."* into the edited `ex` → **exit 1, `FAIL: §10.1 investment-advice-adjacent language reintroduced`**, and the failure **named `glossary.js:36`** — my file and my line, so the guard demonstrably reaches the surface I edited. Restored from a scratchpad copy (`cmp` identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, twice (once per stage) |
| Built bundle | 7 probes (en ×3, es, ko, zh, ja) all land in `markets-*.js`; **two negative controls miss** — the superseded "6 months to 2 years" wording and a nonsense string |
| **Live walk** | **Done**, en and ko, on the served `dist/`. Term detail read back in full in both; the ko list row carries the new `ex` hedge. **No console errors**, no horizontal overflow |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 proven by plant, on the edited field. §10.2 Dalio: `grep -ci dalio src/content/glossary.js` → **0**. §10.3 kids framing: untouched. §2.3: no "Month YYYY" shape added — bare years only (1955, 1976, 2022) — and `check-blindspot` §2.3 passes; `glossary.js` is not in its teaching-copy list either way. **No hardcoded current date and no live-looking figure**: the second-pass reword above exists specifically to remove the one clause that read as pinned to now.
- **DECISIONS.md.** Content edited in place in a `.js` module, per the closed `.js`-not-JSON decision. No state, storage, build or routing change.
- **Already-done backlog item.** Checked directly, because this *is* adjacent to one: the 2026-08-02 item. It is **not a redo — it is the quarter of that item that never landed**, and the 2026-08-30 sweep that listed `Yield Curve` among 14 terse macro entries was about **translation length**, not this claim. Neither is undone.
- **W-6.3:** **0 lines added to `scripts/`.** No new check — and W-6.2 rule 3's sentence *could* be written here, but the honest scope is one entry, so it is a note below rather than an instrument.
- **My own verification claim.** Every figure above is re-derivable from six public keyless FRED series by an independent reviewer; each control's value is a published number, and both plant exit codes reproduce by re-running one command.
- **Could the new text be wrong?** The range and the counterexample are measured above. The residual risk is the `ex` sentence I **did not** touch: "since 1955" rests on 1957 and 1960, which no series available here can test.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **`src/content/sectors.js` is the least-touched content module in the repo — 1 commit, 2026-08-04, 46 days.** Read in full this run and it is **clean**: definitional sector labels, no empirical claim, and all eleven GICS sectors have a real Select Sector SPDR. Recording it as **read and clean** so the next run ranking by last-touch does not re-pick it.
- **Money-track English numbers were swept on the way to this pick and all hold** — L18's $2,000 at 6% for 10 years = **$3,581.70** vs "roughly $3,580"; L16's $300 × 36 = **$10,800**; L16's $200 ÷ $25 = **8 hours**; L17's $400+$300+$100+$250 = **$1,050**, against a $25,000 gross raise at ~30% effective = ~$1,450/month net. **No defect; do not re-sweep.**
- **`AGENT_LOG.md:2289` note (b)** — lesson 36's THINK prompt vs its body — is still open and is now adjacent to this entry's subject.
- ⚠️ **The `ex` field's "since 1955" is unverifiable from this host for its two earliest cases** (1957, 1960: no daily 10-year series before 1962). A future run wanting it should expect to need a non-FRED source, and should **not** repeat the monthly-average approach that failed here.

**Owner-facing, one line:** a learner tapping **Yield Curve** anywhere in the app was told an inversion warns of recession "about 6 months to 2 years" ahead, with no mention that it sometimes warns of nothing — while the lesson, the quiz and the Markets copy all carry that caveat, and the app's own lesson 36 asks the learner about the 2022 inversion that broke the range. The chip now gives the real spread (7 to 25 months before the six recessions since 1976) and names the counterexample: the curve inverted in 2022 and more than four years later no recession had come. **This finishes a fix an earlier run recorded as applied "across ... glossary entries" 48 days ago.** Five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** run log 252,147 b before this entry (`check-log-size`, 2026-09-19) — **already over the 250,000 b warn budget, and this entry pushes it further; the next run's pick is the eighteenth archiving pass.** **Backlog:** 0 b added.

### 2026-09-19 (owner-directed: "do the archiving pass next". This is the previous run's closing note, taken up on instruction, so W-6.2 rule 1 does not arise) — W-5.3's **eighteenth** firing: `npm test` warned the run log was **over** the 250,000 b warn budget at **262,425 b**, so 2026-09-18 (15 entries, 117,216 b) moved verbatim to `AGENT_LOG.archive.md` under `## Archived 2026-09-18`. Run log **262,425 → 145,209 b**, log-size warning cleared (`npm test` 4 WARN → **3**). **The pass's real finding is about its own instrument: one of my four proofs was a tautology and did not fire, and the plant is what caught it**

**Step 3.5 — premise re-measured before touching either file.**
- `check-log-size` MEASURED line, this run: run log **262,425 b** against the 250,000 b warn budget (fail at 350,000), floor **440,371 b**, **2 live days**. Its own four controls fired — sections sum byte-exactly to the file, both section headings located, the region splitter reads an interleaved day as 2 regions and a contiguous one as 1 at an identical 60 b, and all 262,414 b of dated content is contiguous.
- Its proposal — move **2026-09-18**, 117,216 b, a single contiguous region — was **re-derived independently** rather than taken on trust: locating the 15 `### 2026-09-18` headings and the first `### 2026-09-19` heading by byte offset gives a block of **exactly 117,216 b**, reproducing the instrument's figure to the byte. Contiguity re-checked directly: every 09-18 offset precedes the first 09-19 offset, and every 09-19 offset follows the last 09-18 one.
- **The recipe was NOT reused verbatim this time** — see the next block. O-6 (filed at the thirteenth pass, asking whether to automate the move) is **still the owner's and is untouched here**; this pass is evidence bearing on it, not a decision about it.

#### ⚠️ The composition proof was a tautology, and the plant is the only reason I know
- I wrote four proofs and three tamper plants. Two plants fired immediately. **The composition plant did not**, which per the standing rule means a negative result from that proof meant nothing.
- **Cause, diagnosed rather than retried:** composition compared the archive's growth `B(archNew) - B(a0)` against `B(section)` — but `section` **is** the string appended, so both sides moved together under tampering. It could not fail. The live half of the same proof (`B(live) + B(block) === B(t0)`) was real throughout.
- **Fix:** the archive half now measures growth against **independently derived parts** — a `HEADING` constant plus the block — never against the appended string, plus an explicit assertion that the `2026-09-17 → 2026-09-18` title swap is **byte-neutral** (it is: same length). Re-run: **all three plants fire**, the composition plant now failing **composition alone**.
- ⛔ **Scope of this finding, stated rather than rounded up:** this instrument was written fresh this run. Earlier passes' entries describe **conservation** and **containment** proofs (e.g. "containment 17/17 … 0 leaked"); I did **not** find a composition proof of this shape in them and am **not** claiming they carried this defect. **What it does bear on is O-6:** a hand-written proof of an obviously-correct move was wrong on its first draft, which is an argument that an automated mover must ship its own firing plants rather than inheriting a recipe's reputation.

#### What shipped (2 files, no source change)
- `AGENT_LOG.md` **702,796 → 585,580 b**; run log **262,425 → 145,209 b** (58.1% of budget), **1 live day** (2026-09-19, 19 entries).
- `AGENT_LOG.archive.md` **4,544,438 → 4,661,679 b**; new final section `## Archived 2026-09-18`, appended in date order; title range **2026-08-01 → 2026-09-17** becomes **→ 2026-09-18**.
- **No learner-visible change. No clause, budget, threshold or script changed** — the mover lived in the scratchpad and nothing was added to `scripts/` (**W-6.3: 0 lines**).

#### Verification
| Check | Result |
|---|---|
| Conservation (in-script) | Archived block + remaining live rebuilds the original 702,796 b file **byte for byte** |
| **Conservation (independent)** | The block read **back OUT of the written archive file** by its own `## Archived 2026-09-18` heading, spliced before the first 09-19 heading, reproduces `git show HEAD:AGENT_LOG.md` **byte for byte (702,796 b)**. **Negative control: the same splice one byte short does NOT match** |
| Containment | 15 `### 2026-09-18` entries → **live 0, archive +15** |
| Composition | live 585,580 + block 117,216 = **702,796** = original; title swap **byte-neutral**; archive grew **117,241** = heading + block |
| Next-day | All **19** `### 2026-09-19` entries still live and untouched |
| Tamper plants | **3/3 fire after the fix** — a byte dropped in transit fails conservation; an entry left behind fails containment; a byte appearing from nowhere in the archive fails composition **and only composition** |
| `check-log-size` | run log **145,209 b under budget**, **0 warnings**, its own 4 controls firing; **floor 440,371 b unchanged** |
| `npm test` | **exit 0**, 0 FAIL, **3 WARN** — the standing three; the log-size warning is gone |
| Files pristine before the write | `cmp` against scratchpad pre-copies after all plant runs: both **identical** — the plants never wrote |

#### Step 5: adversarial self-check
- **Blindspot register.** No content touched at all: `src/` is untouched, so §10.1, §10.2, §10.3 and the stale-data rule cannot be reached by this diff. Verified by the diff being two markdown files.
- **DECISIONS.md.** W-5.3 is the archiving rule and this pass follows it: entries moved **verbatim**, nothing deleted, nothing edited, appended under a new dated heading in date order. W-7.2 rule 3's "this does NOT license deleting run-log history" is honored — the proof that it is honored is the independent conservation check above, which would fail on any edit.
- **Already-done backlog item.** This is the eighteenth firing of a standing instrument-triggered chore, not a re-pick: the seventeenth cleared through 2026-09-17 and this one clears 2026-09-18. No overlap — containment shows the archive gained exactly the 15 entries that left.
- **My own verification claim.** A reviewer re-running only my commands gets the same result: the conservation check reads `git show HEAD:AGENT_LOG.md` and the two working files, all in the repo. ⚠️ **The honest limit:** once this pass is committed, `HEAD` moves, and the check as written compares against `HEAD` — a later reviewer must name **this** commit's parent (`4cad5d9`) explicitly.
- **Am I padding?** The pass moves one day and changes nothing a learner sees. It is written up at this length only because the tautological proof is a finding worth keeping; the move itself is four lines of the entry.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **O-6 is now eighteen passes old and still undecided.** It asked, at the thirteenth, whether to automate the move. Every pass since has re-derived its own proofs. **This pass is the first one I can find that changed the recipe** — and it changed it because a proof was wrong, which cuts **both** ways: it is an argument that the manual re-derivation is load-bearing, and an argument that the proofs deserve to be a tested script rather than retyped. ⛔ Owner's call, not a run's.
- **The next firing is not imminent.** At the measured **+2,020 b/commit** run-log growth, 145,209 b leaves roughly **52 runs** before the warn budget and ~101 before the fail budget.
- **The floor, not the run log, is the standing problem** — 440,371 b of which the backlog is **401,965 b (91.3%)**, and archiving cannot touch it (W-5.3). W-7.2's test still applies and is the number to quote.

**Owner-facing, one line:** routine housekeeping — the agent log's live run log was over its size budget, so yesterday's 15 entries moved into the archive file, cutting the file every run has to read from 703 KB to 586 KB and clearing the warning. **Nothing a learner sees changed, and nothing was deleted** — the moved text was proven to reconstruct the previous version of the file exactly, byte for byte. The one thing worth your attention: one of the four safety checks I wrote to police the move turned out to be incapable of failing, and I only found that because I deliberately tried to break it. It is fixed, and it is a mark against automating this move without equally adversarial tests. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** run log **145,209 b after this entry's block was cut** (`check-log-size`, 2026-09-19); this entry itself adds to it. **Backlog:** 0 b added.
