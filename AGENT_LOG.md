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
> **O-3 ✅ CLOSED 2026-10-10 (owner instruction "you do"): option (a) re-affirmed.** es/ko/zh/ja keep
> shipping, AI-reviewed, under "(Beta)", with the label measured live first. The record and what would
> reopen it are in `DECISIONS.md` § Machine-translated lesson content, "Re-affirmed 2026-10-10". ⛔ **Runs
> stop listing O-3 as "still waiting on you".** The review-coverage WARN stays, as the disclosure.
> The original text follows.
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

> ## PRIORITY BLOCK W-13 — set by the weekly review 2026-10-25. Supersedes W-12's *active* clauses below. The standing rules are UNCHANGED and still binding: W-12.3's staged-count assert, W-11.1's entry format, W-9.4's two-run bar on short-string hand reads, W-7.2 rules 1–3 on closed text, W-6.2's residual-chain rule, W-6.3's ratio-quoting rule, W-5.3's archiving rule. Read this first.
>
> **The week: 29 commits since `4744658`: 27 dev-agent (27 runs), 2 market refreshes.** Run-log
> entries match commits 27/27 (per day 2, 4, 4, 3, 4, 4, 4, 2). 10-21 has three runs because the
> 12:00 slot has no commit and no entry, so it is a skipped run, not a mismatch. Build green. `npm test` exits 0 with
> 0 FAIL and 1 WARN (O-3's disclosure). Grade **A−**. Every W-12 test passed and the review found no
> factual error. But 22 of the 27 runs were one-clause narrowings, and the launch is still blocked
> only on O-2.
>
> ### W-13.0 — W-12's tests, measured. All four pass, two with little room left.
> (i) §65 at HEAD: en 28.3 / es 26.1 / ko 28.3 / ja 26.1 / zh 23.9. That is exactly the ceiling,
> and shortest-option rates are unchanged. (ii) The mean entry dated 10-19 → 10-25 is **5,363 b**
> (n=25, cap 5,500), up from 4,962. The largest heading is **385 chars** (cap 400). (iii) English
> lesson text is **168,197** chars, +0.41% against a 0.5% allowance. (iv) No empty commit among
> the last 32.
>
> ### W-13.1 — the Stocks card's note: say what the arrow claims, not a growth-vs-value score.
> `06589a4` was well measured (Fama-French, robust to breakpoints, with a Russell cross-check), and
> its gold, real-estate and dollar siblings use the same "N of the last 5 cycles" form. The Stocks
> note is the one that differs. It tallies one style **beating another**: *"yet they beat value
> stocks in 4 of the last 5 hiking cycles"*. That is the closest thing on the dashboard to a "which
> to hold when the Fed hikes" rule. The tally also hides magnitude: +5.2/+1.7/−26.4/+13.3/+9.0 nets
> about +2.8 pts over five cycles, so "4 of 5" overstates a pattern that is roughly a wash. **Pick
> for next week, with W-9.4's two runs:** keep the "on paper" theory label. Replace the relative
> tally with what stocks themselves did over the same five cycles, first hike to last (measure it;
> don't retype it from here). Or drop the history clause if no simple true statement fits. Five
> languages. **Rule from now on:** no short string may rank one asset class or style against
> another over a handful of cycles. **Picked 2026-10-25** (run 1 of 2 under W-9.4): the note now
> says stocks ended 4 of the last 5 hiking cycles higher. **Second read 2026-10-26: no defect,
> settled** (Yahoo `^GSPC` agrees with Tiingo SPY on all 5 cycles). Not a pick any more.
>
> ### W-13.2 — the accuracy sweep has covered the corpus. Shrink it, and don't manufacture.
> This week touched every surface: economy, money and essentials lessons, the glossary, quiz
> explanations, the parent guide and the dashboard. Eleven runs were residual chains of the run before.
> The fixes I read are true (q028 vs *Egelhoff*, EITC refundability, the Fed's three statutory goals,
> post-2007 home prices). But the content is now hedging faster than it is getting more accurate:
> hedge words in the English lessons ("often/usually/can/may/most…") went from 12.35 to **12.49 per
> 1,000 words** this week. That's a watch, not a defect. **From now on:** (a) narrow a claim only
> when you can name a real, common case where the old wording misleads a learner. A rare exception
> is not enough. (b) When a sweep run finds nothing, log a short entry (≤ 2,000 b) and stop. That is
> a good outcome, not a wasted run. (c) Don't start a residual chain from a sentence that is already
> true.
>
> ### W-13.3 — entry size is creeping back. Aim for a mean ≤ 5,000 b.
> 4,962 → 5,363 b in one week, with a heading at 385/400. W-11.1's format holds. Cut the restated
> sources and the per-language quotes of unchanged text first.
>
> ### W-13.4 — owner items, asked in the review, not restated in runs.
> **O-2** (6th week) is still the only critical-path item. **O-5 / O-6** are unchanged. **New, O-7
> (decision):** with content complete and the gate owner-held, should the dev agent keep running 4×
> a day, or slow to 1× until O-2 lands? Runs must not change their own cadence.
>
> ### W-13.5 — deploy, measured.
> `check-deployed --identify`: live = **`3afd410`** (Fri 10-23 19:50), byte-identical, and 5
> content commits behind. The live `market.json` is asOf 10-23, so Sectors goes dark **Wed 10-28**
> without a push. That's the usual weekday shape.
>
> ### W-13.6 — this block's test, for 2026-11-01.
> (i) §65 at or below W-12.1's ceiling. (ii) Mean entry dated 10-26 → 11-01 ≤ 5,000 b, and no heading
> over 400 chars. (iii) English lesson text grows ≤ 0.3% from **168,197**. (iv) No empty commit.
> (v) W-13.1 resolved, either way. Run the instruments; don't retype these figures.

> ## PRIORITY BLOCK W-12 — set by the weekly review 2026-10-18. Supersedes W-11's *active* clauses below. The standing rules are UNCHANGED and still binding: W-11.1's entry format (it worked, so it stays), W-9.4's two-run bar on short-string hand reads, W-7.2 rules 1–3 on closed text, W-6.2's residual-chain rule, W-6.3's ratio-quoting rule, W-5.3's archiving rule. Read this first.
>
> **The week: 34 commits since `654f974`: 29 dev-agent (28 runs; one run made two commits, see
> W-12.3), 4 market refreshes and 1 review. 28 run-log entries for 28 runs, 4/day on every full day,
> no mismatch, no outage.** Build green. `npm test` exits 0 with 0 FAIL and 1 WARN (O-3's disclosure).
> Grade **A**. Every test W-11 set passed, measured off the instruments, and no content error or
> advice-adjacency was found. The launch is still blocked on O-2, which only the owner can move.
>
> ### W-12.0 — W-11's tests, measured. All three pass.
> (i) **Entry size:** the mean entry dated 10-12 → 10-18 is **4,962 b** (n=26, target ≤ 5,500). The
> largest heading is **295 chars** (cap 400). (ii) **§65 longest-option rates at `687db75`:** en
> **28.3** / es **26.1** / ko **28.3** / ja **26.1** / zh **23.9**, against a ceiling of 37.0 / 34.8 /
> 37.0 / 34.8 / 32.6. Shortest-option rates are unchanged at 2.2 / 2.2 / 0.0 / 4.3 / 2.2. (iii)
> **Length watch:** English lesson text went from 166,954 to **167,511 chars (+0.3%)**, and lesson
> time held at **177 min**.
>
> ### W-12.1 — item 160 has reached its goal. Stop picking it.
> Class B was unblocked correctly on 10-17 (O-3 had closed), and four runs (q008, q001, q021, q043)
> took English from 37.0% to **28.3%**. Chance is 25.0%. With 46 questions the remaining gap is under
> 2 questions, which is noise, not a tell. **Item 160 is no longer a pick.** §65's rates at `687db75`
> are now a regression ceiling only: en 28.3 / es 26.1 / ko 28.3 / ja 26.1 / zh 23.9, with
> shortest-option rates at or below 2.2 / 2.2 / 0.0 / 4.3 / 2.2. Re-open item 160 only if a later
> edit pushes a rate above that ceiling.
>
> ### W-12.2 — keep the accuracy sweep, short and measured. W-11.2's rules still hold.
> This week's fixes were sound (spot-checked by the review: loss aversion's "classic estimate" range,
> L35's rates "usually move the same way", L34 tax rises as austerity, M0/M2, PMI on the payment
> schedule, the q008 distractors against L40's own text). Prefer narrowing a false clause to adding a
> figure. **One clarity candidate, optional and subject to W-9.4:** the Market Dashboard Bonds note
> *"Long maturities most sensitive, but their yields usually rise less"* is accurate but terse, and a
> beginner can't tell that "sensitive" means price. If picked, say price and yield explicitly. **Picked 2026-10-18** (run 1 of 2 under W-9.4). **Second read 2026-10-19: no defect, settled.** Not a pick any more.
> **When the sweep turns up nothing,** take an open numbered item (e.g. 117, 140, 149) rather than
> re-reading a surface a run has already declared clean.
>
> ### W-12.3 — commit safety: assert what was staged, not just the tree.
> `0e3d6d8` committed with an empty change set. The 8 paths were passed as one unsplit zsh scalar, so
> `git add` failed and the run's tree-count check still passed. `9b80006` carried the content, and
> the run documented it honestly. **From now on:** before committing, assert that
> `git diff --cached --name-only | wc -l` equals the expected file count, and use a zsh array for path
> lists. One line in the entry is enough. Not a pick.
>
> ### W-12.4 — owner items. O-2 is still the only critical-path item (5th week).
> **O-2:** one analytics account and one public key, ~20 minutes. Until it lands, §4.3's Phase-0 gate
> stays **❌ Unmeasurable**. **O-5** (have the market job push, or document the weekend gap) and
> **O-6** (automate the archive move) are still undecided. They are asked again in the review, not
> here. Runs should not restate them in entries.
>
> ### W-12.5 — deploy and market data, measured. The usual weekday shape.
> `check-deployed --identify`: the live site is **`2587ec2`** (Fri 10-16 19:50), byte-identical. It
> is 5 content commits behind (`bfe677b` and the four item-160 quiz fixes). The live `market.json` is
> asOf 10-16, so Sectors goes dark **Wed 2026-10-21** unless there's a push before then. Not a defect.
>
> ### W-12.6 — this block's test, for 2026-10-25.
> (i) §65 at or below W-12.1's ceiling. (ii) The mean entry dated 10-19 → 10-25 is ≤ 5,500 b, and no
> heading is over 400 chars. (iii) English lesson text grows ≤ 0.5% from **167,511** chars. (iv)
> No empty commit: every dev-agent commit touches at least one file. Run the instruments; do not
> retype any of these from here.

> ## PRIORITY BLOCK W-11 — set by the weekly review 2026-10-11. Supersedes W-10's *active* clauses below. The standing rules are UNCHANGED and still binding: W-9.4's two-run bar on short-string hand reads, W-7.2 rules 1–3 on closed text, W-6.2's residual-chain rule, W-6.3's ratio-quoting rule, W-5.3's archiving rule. Read this first.
>
> **The week shipped 28 dev-agent commits, 3 owner-directed ones and 4 market refreshes (35 since
> `a117f05`). Build green, `npm test` 0 FAIL / 1 WARN (O-3's disclosure). 28 run-log entries
> against 28 dev-agent commits, 4/day on every full day, no mismatch, no outage.** Grade **A−**.
> Content work was accurate and source-measured; the owner closed **O-3** and **W-10.2**. What holds
> it below an A: O-2 has not moved for a fourth week, and **run entries grew ~50% within the week**
> (W-11.1).
>
> ### W-11.0 — W-10's test, measured off the instruments. It passes on both halves.
> (i) W-10.1 landed in `f22dc00` (five sites). (ii) `check-data.mjs` §65 at `befb49a`: longest-option
> **en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6**, each at or below the 10-04 reading (39.1 / 37.0
> / 37.0 / 34.8 / 32.6). Shortest-option rates unchanged (2.2 / 2.2 / 0.0 / 4.3 / 2.2). en and es
> *improved*. No edit gave the tell back.
>
> ### W-11.1 ⛔ PRIORITY (process) — run entries are getting longer, and the headings are what grew most.
> Measured off the run log by date, mean bytes per entry: last week **4,841–5,959** (mean ≈5,300).
> This week **5,771 (10-04) → 6,064 → 7,229 → 5,991 → 7,428 → 8,039 → 7,459 → 8,055 (10-11)**. The
> `### date (…)` heading alone went from **~550–650 chars on 10-04 to ~1,350–1,900 by 10-09/10-11**.
> Nearly all of that growth is the pick-justification preamble (*"W-6.2 rule 1 allows that… W-9.4 does
> not bind… `npm test` was not run before editing…"*). At ~8 KB × 4 runs/day the run log needs an
> archiving pass every ~3 days, and the archive (5.48 MB) grows ~200 KB a week.
> **The rule from the next run on:**
> 1. **Heading ≤ 300 characters:** date, `scheduled dev-agent`, the pick type (free pick / residual of
>    X / named item), and one clause on what changed. Nothing else goes in the heading.
> 2. **Rule compliance gets one line in the body, not a paragraph:** e.g. *"Rules: W-6.2 ok (free
>    pick); W-9.4 n/a."* Only explain a rule when a run is making a judgment call under it.
> 3. **Target ≤ 5,000 b per entry.** Measurements stay. Restating the previous entry's reasoning,
>    re-quoting the backlog, and narrating what was *not* done beyond one "Seen, not fixed" line go.
> ⛔ **Do not "fix" past entries.** This is forward-only, and it is not a pick. No run should spend
> itself on log editing.
> **Test for 2026-10-18:** mean bytes per run entry dated 10-12 → 10-18 is **≤ 5,500 b**, measured
> off the file, and no heading is over 400 characters.
>
> ### W-11.2 — the accuracy sweep is good work. Keep it, but keep the corrections short.
> The week's 28 runs were nearly all in-place accuracy fixes, each measured against a primary source
> (FRED USREC, BLS CPS/CPI, IRS Pub 15-T, FDIC SNDR, Fed H.4.1). This review spot-checked the
> English diffs and found **no error and no advice-adjacency**. Highlights: **`q028`'s answer key was
> wrong** (ERISA gives a 401(k) to a current spouse), and that was fixed by rebuilding the scenario
> around a never-married person rather than adding a caveat. Lessons 37 and 40 lost two leading prompts
> (*"Does this help explain wealth inequality?"*, *"you understand more than most people"*). And
> Lesson 36 is no longer a "Crystal Ball". These are neutrality improvements, not just accuracy ones.
> **The watch item is length.** English lesson text grew **164,424 → 166,954 chars (+1.5%)** and
> **174 → 177 min** in a week of corrections only. Three glossary entries roughly doubled (Inflation
> now 352 chars, Interest Rate 433). **Rule for hedge fixes:** prefer deleting or narrowing the false
> clause to adding a statistic. A figure belongs in a lesson body. It does not belong in a glossary
> definition or a 9-12 parent card unless the claim can't be made true without it. Not a reason to
> revisit this week's edits.
> **When "Seen, not fixed" turns up nothing,** say so and take an open numbered item. Do not re-read
> a surface a previous run already declared clean (e.g. the 43 English glossary definitions, 10-05).
>
> ### W-11.3 — owner items. O-3 ✅ and W-10.2 ✅ closed this week. O-2 is now the only critical-path item.
> **O-2 (fourth week):** one analytics account and a public key, four steps, ~20 minutes. §4.3's
> Phase-0 gate (≥40% finish lesson 1) stays **❌ Unmeasurable** until it lands, and nothing a run does
> moves the launch while that is true. **O-5:** unchanged; see W-11.4. **O-6** (automate the
> archive move or keep it manual): still undecided. It gets more relevant as W-11.1's entry size
> sets the archiving cadence.
>
> ### W-11.4 — deploy and market data, measured. The same weekday shape, and not alarming.
> `check-deployed --identify`: live = **`6510e60`** (Fri 10-09 21:16), byte-identical. Six content
> commits behind (the parent-guide fixes and L40's prompt). Live `market.json` asOf 2026-10-09, so
> Sectors goes dark **2026-10-13 (Tue)**, and a Monday push clears it with a day in hand.
> **Market data 10-08 is missing, by design:** that run fetched `asOf=2026-10-08` and **declined to
> commit because the tree was dirty** (the second Mac's in-progress edits, synced via iCloud). That is
> the documented behavior, and 10-09's data superseded it. ⛔ Not a defect; do not "fix" it.
>
> ### W-11.5 — notes, not picks.
> Floor **267,237 b (53.4%)**, run log **208,058 b (83.2% of warn, 5.5 runs headroom)**. The 23rd
> archiving pass is due ~10-12, which is fine. The 22nd ran 10-07, 1 of 28 runs (3.6%).
> `kidsContent.js` gained 38 lines of provenance comments this week. Build strips them, and they're
> useful. Note only. `CLAIMS.md`'s missing size guard (W-10.6b) gets re-measured at the 11-07 audit.
>
> ### W-11.6 — this block's test.
> **(i)** W-11.1's entry-size test above, and **(ii)** §65 longest-option rates stay at or below
> **en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6**. Run the instruments; do not retype either from
> here.

> ## PRIORITY BLOCK W-10 — set by the weekly review 2026-10-04. Supersedes W-9's *active* clauses below. The standing rules are UNCHANGED and still binding: W-9.4's two-run bar on short-string hand reads (it WORKED — see W-10.0), W-7.2 rules 1–3 on closed text, W-6.2's residual-chain rule, W-6.3's ratio-quoting rule, W-5.3's archiving rule. Read this first.
>
> **The week shipped 31 dev-agent commits, build green, `npm test` 0 FAIL / 1 WARN, and the two
> things that pulled last week's grade down both fixed themselves without an owner touching them.**
> ⭐ **First clean week in three: 4 runs/day on all seven full days, 31 run-log entries against 31
> non-market commits, no mismatch in either direction, no outage.** Grade **A−**; the only reason it
> is not higher is that the critical path has not moved for a third week and is still owner-held.
>
> ### W-10.0 — W-9's test, taken first, as it required. It passes by a wide margin.
> Measured 2026-10-04 off `check-log-size.mjs`'s MEASURED line before this block was written:
> floor **251,752 b** (50.4% of the 500,000 b budget), backlog **213,346 b**, run log **164,355 b**
> (65.7% of warn, 8 live days). **W-9's test was "W-9.1 has landed and the floor is below
> 300,000 b" — it passes with 48,248 b to spare.** The 09-27 pass's byte accounting was verified
> independently this review rather than taken on trust: W-5.3 pass 21 moved **−98,482 b** out of
> `AGENT_LOG.md` and **+102,797 b** into the archive — the claimed 102,758 b plus a 39 b heading,
> with 4,276 b of pointers written back.
> ⭐ **W-9.4 WORKED, and that is worth recording because it was one line against an unbounded mode.**
> Short-string hand reads of a translated surface: **6 of the last 7 runs last week, 1 of 31 this
> week** (`moneyVisuals.js`, 10-02, which correctly cited the rule as *allowing* it). Every other run
> states its W-9.4 position explicitly and three declined a residual *because* of it. **Keep the
> rule. It cost nothing and it bought the week back.**
>
> ### W-10.1 ✅ LANDED 2026-10-04 (five sites, not four, plus q027 distractor 1 — see that run entry). ⛔ PRIORITY — the one content pick, reviewer-found, never looked at before.
> **The essentials brokerage lesson teaches, in four places, that uninvested cash in a brokerage
> account does not grow.** `lessonContent.essentials.en.js` body (*"the account only starts
> working…"*), its `takeaway` (*"money inside it only grows once it's used to buy something"*),
> `q027`'s correct option (*"stays as uninvested cash and generally doesn't grow until the owner buys
> something with it"*) and `q027`'s `explain`. **Most major US brokerages sweep uninvested cash into
> an interest-bearing bank-sweep or money-market position**, so a learner who opens a real account
> and watches that cash earn interest has been told the opposite of what they see.
> **Measured, so this is filed rather than assumed: `money market` returns 0 matches across
> `AGENT_LOG.md`, the archive and `CLAIMS.md`; every `sweep` hit is the verb. Never examined.**
> ⚠️ **The teaching point is sound and must survive the fix** — a brokerage account is a container,
> not an investment; opening one commits nothing. What is wrong is the absolute form of the second
> clause, so the fix is a hedge, not a rewrite: *doesn't grow the way an investment would* / *any
> interest it earns is not the account working as an investment*. **English first, then carried into
> four languages — the shape the 09-28 lesson-5 and lesson-33 fixes already proved this week.** Check
> `explain` is not a stub in es/ko/zh/ja first (item 160's own rule).
> **Filed as a content pick deliberately: it needs no owner input, it is bounded at four sites, and
> O-6's complaint is that runs spend their budget on log mechanics instead of on the app.**
>
> ### W-10.2 — W-9.2 re-measured, and it is WORSE than last week's reading. Still owner-only.
> `economics-app-dev-agent` is **still `enabled: false`, `lastRunAt` 2026-09-07**, cron every
> 2 hours, while 31 commits landed this week on a clean 6-hour cadence. Unchanged. **What is new is
> the second false claim in the same sentence, and it is the dangerous one.** Line 9 of that
> `SKILL.md`: *"the GitHub remote 'origin' is NOT usable — never push, never fetch … The main
> application is economic-cycles-v5.jsx, a single-file React app."*
> **Both halves are false, measured today.** The remote half stopped being true at O-4. The second
> half points every run at a **13,207 b legacy prototype last touched 2026-08-16 by `d7b7153`
> "Stop both prototypes appearing in the project (owner decision)"** — `index.html:63` loads
> `/src/main.jsx`, `src/App.jsx:9` says *"This app is authored here … deliberately not imported"*,
> and neither `v5.jsx` nor `v6.jsx` is imported anywhere under `src/`.
> ⛔ **Owner action: fix line 9 in whichever task definition actually runs.** The never-push rule
> stays; *"NOT usable"* and the `v5.jsx` sentence both go. **Every run has so far ignored it — all 31
> commits touched `src/` — but it is the first thing each one reads, and that same file's own Node
> note was false for 15 days for exactly this reason.** A false first line survives because nobody
> re-measures the sentence they have already read twenty times.
>
> ### W-10.3 — item 160's class A is EXHAUSTED, and the result is this week's headline.
> Five runs closed `q023`, `q037`, `q040`, `q034` and `q027`. **Measured independently this review by
> running `check-data.mjs` §65 in a worktree at last week's HEAD (`deb8cdf`) and at `91557e0` — both
> figures off the instrument, neither retyped from a run entry:**
>
> | longest-option strategy | 2026-09-27 | 2026-10-04 | chance |
> |---|---|---|---|
> | en | 50.0% | **39.1%** | 25.0% |
> | es | 47.8% | **37.0%** | 25.0% |
> | ko | 47.8% | **37.0%** | 25.0% |
> | ja | 45.7% | **34.8%** | 25.0% |
> | zh | 43.5% | **32.6%** | 25.0% |
>
> **The edge over chance fell from 25.0 points to 14.1 in English — a 44% cut in one week — and the
> shortest-option inverse tell did NOT move (2.2/2.2/0.0/4.3/2.2), so no run bought the forward tell
> by creating the backward one.** That is the trap this item warns about twice; none of the five hit it.
> ⛔ **Class A is now empty except `q021` (unreachable — its tail leaves the option at 87 against a
> ceiling of 54). Do not re-open item 160 as a trimming item.** What remains is class B, distractor
> prose in four unreviewed languages, and that is **O-3's**, exactly as the item says.
> ⚠️ **If a future run does re-rank it, rank per language, not by the minimum:** `q027`'s "6%" was the
> en minimum while ko/zh/ja were 100/61/53%, so the minimum ranking had been hiding the loudest CJK
> tell in the corpus. The 10-04 run found that itself and wrote it down.
>
> ### W-10.4 — the deploy gap is the same shape for the third week, and the margin is still one day.
> **Measured with `check-deployed --identify`, which rebuilt 7 candidates and found a byte-identical
> match: the live bundle is `f4928ff` (Friday 2026-10-02 19:51).** Four commits behind, and all four
> are W-10.3's quiz fixes — **the learner is missing precisely this week's best work.** Live
> `market.json` `asOf` 2026-10-02, age 2 d; `STALE_AFTER_DAYS` is 4, so **Sectors goes to the
> unavailable state on 2026-10-06** and a Monday push clears it with one day in hand.
> **Not a regression and not a surprise — W-9.3's weekday-push cycle, confirmed a third time.** O-5's
> two routes are unchanged. ⚠️ **A Sunday review will ALWAYS see this; do not re-raise it as
> alarming.** The only thing to watch is the one-day margin.
>
> ### W-10.5 — O-2 and O-3, unchanged, third week. Asked as questions, not restated as blockers.
> **O-2 is still the entire critical path.** Four steps, ~20 minutes, and §4.3's Phase-0 completion
> gate becomes measurable for the first time. The code half shipped 2026-09-05 and the 10-04 claims
> audit re-proved it: the live bundle ships `provider:"none"` once and `posthog`/`plausible`/`phc_`
> zero times, with the PostHog host string appearing twice as the control that the scan read the file.
> **O-3 is unchanged and its evidence only got stronger.** Human-reviewed share is **0% in all four
> non-English languages** — the one standing `npm test` WARN, every run, all week. This week added
> five more hand-found defects in `moneyVisuals.js` and seven in the Fed-chair simulator.
> ⭐ **Per O-1's own lesson, both are written as asks:** *"Fund a fluent review of one language, cap
> what ships under (Beta), or re-affirm the decision now that the error rate is known."*
>
> ### W-10.6 — two notes that are NOT this week's work, filed so no run manufactures them.
> **(a) The run-log archiving treadmill is now ~4 days, not weekly, and the lever is entry size.**
> Measured: 31 entries, **mean 5,300 b each**, ≈21,200 b/day at 4 runs/day; headroom to the
> 250,000 b warn is **85,645 b ≈ 16 entries ≈ 4.0 days**, so W-5.3's 22nd firing is due around
> **2026-10-08**. Two of this week's 31 runs went to log mechanics (6%). **That is acceptable and no
> run should "fix" it this week** — but a reviewer should notice if it reaches one run in eight.
> **(b) `CLAIMS.md` has no size guard and its rows have begun to accrete.** 36,713 b; 17 rows
> totalling 22,403 b; **A1's status cell alone is 2,957 b / 462 words** of chained *"Earlier record
> follows"* history, which `check-log-size.mjs` cannot see. **Not urgent at 36 KB and deliberately
> NOT a pick** — the move is cheap once the mass is real, and it is not yet. Re-measure 2026-11-07.
>
>
> ### W-10.2 ✅ CLOSED 2026-10-10 on the dev-agent Mac (`Kaeunui-noteubug.local`), by the owner running `node scripts/fix-agent-skill.mjs` interactively.
> Output: remote sentence, application sentence and cadence aside replaced; 10,079 → 11,462 b; backup
> `SKILL.md.bak-2026-10-04`; `economics-app-market-data` is not on this machine and was skipped. **Verified
> independently afterwards:** `diff` against the backup shows only line 9 replaced plus the dated note
> and the `src/` paragraph inserted. `NOT usable` now appears only inside the dated note, and
> `never push` appears twice (line 9 and the HARD RULES). Line 46's `economic-cycles-v5.jsx` is the
> rule to preserve that file's content, which is still true. ⚠️ A session could not run the script
> itself: the auto-mode classifier denies edits to `~/.claude/scheduled-tasks/` as self-modification,
> so a future fix of this kind is the owner's to run. ⛔ **Runs stop writing "W-10.2 still looks open
> from here."**
>
> ### W-10.2 ADDENDUM — ⭐ SOLVED, owner-directed 2026-10-04, same day. The two-week puzzle has a mundane answer, and it was in a sibling task file all along.
> **The dev agent runs on a SECOND MAC.** Verbatim, from
> `~/.claude/scheduled-tasks/economics-app-market-data/SKILL.md`, in a parenthetical dated
> 2026-09-07: *"that agent now runs on a second Mac against the same iCloud-synced repo, where the
> dirty-tree check below cannot see its in-progress edits until iCloud has synced them"*.
> **That date is the same date this machine's `economics-app-dev-agent` entry was disabled
> (`lastRunAt` 2026-09-07T04:00:39Z).** So the disabled entry is not a misconfiguration and not
> orphaned bookkeeping — **it is intentional, and W-9.2's "whatever runs the dev agent is not that
> task entry" was right about the fact and wrong to treat it as a defect.** Three weekly reviews
> theorized about this; the answer was one `grep` away in a file none of them opened.
> ⛔ **What this means for the line-9 fix, stated plainly because it is the part that matters:**
> `~/.claude` is a real local directory on this Mac, **not** a symlink into the iCloud-synced tree
> (measured: `readlink` returns nothing; the synced path is
> `~/Documents/문서 - Kaeun의 노트북/…` and `~/.claude` is not under it). **So the corrections applied
> today reach only this Mac's copies. The prompt actually in force is the copy on the second Mac,
> and it presumably still says the remote is "NOT usable" and that the application is
> `economic-cycles-v5.jsx`.** ⛔ **W-10.2 is therefore NOT closed. The remaining owner action is to
> apply the same two corrections on the second Mac**, where `~/.claude/scheduled-tasks/economics-app-dev-agent/SKILL.md`
> is the file that every run reads first.
> **Also now explained: the outages.** W-8.2's ~40 hours and W-9.2's ~72 hours are a second Mac
> asleep, offline, or not synced — not a cron fault on this one. The market-data job kept committing
> through both because it runs *here*. **That is why the gap is only ever visible from this side, and
> it is the right thing for a weekly review to keep measuring from commit timestamps.**
> ⚠️ **Standing correction for future reviews: there are two machines, and this repo is iCloud-synced
> between them.** Do not read a disabled task entry here as evidence about what runs there, and do
> not assume a file under `~/.claude` is the one a run reads.
>
> ### W-10.8 — two task files corrected today (owner-directed), and a third was already clean.
> `economics-app-dev-agent/SKILL.md` line 9: the remote sentence and the `v5.jsx` sentence both
> replaced, with the old text quoted verbatim in a dated ⚠️ note per this project's convention, plus
> a pointer that the app is `src/` with `src/main.jsx` as its entry. **`economics-app-market-data/SKILL.md`
> carried the same false remote sentence and was corrected identically** — it fires every weekday, so
> fixing only the dev-agent copy would have been half a fix. `economics-app-sunday-review/SKILL.md`
> never carried the claim. **Verified: `.github/workflows/deploy-pages.yml` is `on: push: branches: [main]`,
> so "the remote is the deploy path" is measured, not asserted.**
> ⭐ **Noted in the market-data file for the owner, and deliberately NOT acted on: because a push is
> what deploys, that file is exactly where O-5 route 1 ("have the job push") would be implemented**,
> and weekend `market.json` staleness on the live site is the problem it solves. A run must not make
> that change itself.
> ### W-10.7 — the cost of this block, and W-10's test.
> Floor **251,752 b** before this block; the after-figure goes in the report off
> `check-log-size.mjs`, not retyped from here. W-9 cost 10,677 b, W-8 11,676 b, W-7 12,567 b.
> **The test of W-10 is not whether the next run agrees with it. It is two measurements:**
> **(i) W-10.1 has landed**, and **(ii) §65's longest-option rate has not risen above the 2026-10-04
> reading in any language (en 39.1 / es 37.0 / ko 37.0 / ja 34.8 / zh 32.6)** — i.e. no distractor
> edit quietly gave the tell back. **Run the instrument; do not retype either figure from this block.**

> ## PRIORITY BLOCK W-9 — set by the weekly review 2026-09-27. Supersedes W-8's *active* clauses below. The standing rules are UNCHANGED and still binding: W-7.2 rules 1–3 on closed text, W-6.2's residual-chain rule (but read W-9.4, which bounds it differently), W-6.3's ratio-quoting rule, W-5.3's archiving rule. Read this first.
>
> **The week shipped 30 commits, build green, and `npm test` went 2 WARN → 1.** Item 94 closed
> 2026-09-22 and item 160 is closed, so **both of W-8.5's mandated picks are done and that clause
> expired exactly as written.** The corpus now clears the completeness threshold in all five
> languages with **0 abridged pairs**. The execution quality this week is the best-evidenced this
> project has produced — controls on both sides, instrument findings the run did not plan for and
> repaired rather than whitelisted, limits stated. ⛔ **This block disputes none of that. It is
> about where that quality is being spent, and about one number that is no longer the dev agent's
> fault.**
>
> ### W-9.0 — W-8.8's test, taken first, as it required.
> Measured 2026-09-27 off `check-log-size.mjs`'s MEASURED line, before this block was written:
> backlog **411,512 b**, floor **449,918 b** (90.0% of budget), run log **115,555 b** (46.2% of
> warn, 5 live days). **W-8.8's test PASSES, and by more than it asked:** the bar was "below
> 413,641 b on 2026-09-27" and the backlog came in **2,129 b under** it.
> ⭐ **Read what that means, because it reverses the story W-8.0 told.** W-7.2 rule 1 is not
> merely holding the line — **run activity was net-NEGATIVE on the backlog this week**, because
> items 94 and 160 were replaced by their conclusions instead of annotated with them. **The
> accretion that remains is not coming from the runs. It is coming from the weekly reviews:** W-8
> cost 11,676 b, W-7 12,567 b, W-6 17,717 b. Three review blocks outweigh a fortnight of dev-agent
> restraint. That is this reviewer's problem before it is a run's, and W-9.6 prices this block.
>
> ### W-9.1 ⛔ PRIORITY — the one structural fix, and it is run-sized, measured, and nobody's fault.
> The floor is at **90.0% of its 500,000 b budget** with **54.8 runs** of headroom — at 4 runs/day,
> the floor WARN fires around **2026-10-11**. W-5.3 archives the run log twenty times over; **nothing
> has ever archived the backlog**, so every closed item still sits in it at full length.
> **Measured 2026-09-27 by parsing the section itself:** of **152 numbered items, 137 are closed**
> (✅/DONE/CLOSED/RETIRED/EXHAUSTED) and they occupy **244,116 b — 59.3% of the 411,512 b section.**
> The 15 open items are 80,440 b. **Those three figures were measured BEFORE this block was
> written**; the projection below is stated against the section as it stands WITH it, so the two
> are not retypings of each other.
> ⛔ **The pick for the next run that is not already mid-chain: a backlog archiving pass, built as
> W-5.3's move and not as a new invention.** Move the closed items **verbatim** into
> `AGENT_LOG.archive.md` under `## Archived backlog (closed items)`, leave a one-line pointer where
> each block was, and change no open item. Projected: backlog **422,379 → ~178,000 b**, floor
> **460,785 → ~216,000 b (~43% of budget)**, headroom **42.9 → ~240 runs**.
> **Why this satisfies W-6.2 rule 3 despite no learner seeing the log:** rule 3 asks what failure a
> new *check* would catch, and this is not a new check — it is the existing archiving recipe applied
> to the section that now carries the mass. The learner-visible failure it prevents is the one O-6
> names: a run spending its budget on log mechanics instead of the app.
> ⚠️ **Do not delete anything.** Verbatim move, byte-accounted, the way all twenty run-log passes
> were. If the move cannot be proven byte-exact, do not commit it.
>
> ### W-9.2 — a 72-hour outage, and the task entry that should have recorded it is disabled.
> Dev-agent commits per day, 09-20 → 09-27: **10, 4, 1, 0, 0, 4, 4, 2.** The gap from `2783821`
> (09-22 00:19) to `8af3d04` (09-25 00:05) is **~72 hours — about 12 missed runs at the 6-hour
> cadence.** The market-data job committed at 19:49 on both 09-23 and 09-24, so **the machine was
> up and the dev schedule was not.** No run entry mentions it, because a run that does not fire
> cannot write one. **This is the second consecutive week with a multi-day silent gap** (W-8.2:
> ~40 hours), and it is getting longer.
> ⭐ **New this week, and it is the part an owner can act on:** the scheduled task
> `economics-app-dev-agent` is **`enabled: false` with `lastRunAt` 2026-09-07**, and its cron reads
> every 2 hours. Commits have continued on a clean **6-hour** cadence for twenty days regardless, so
> **whatever is running the dev agent is not that task entry.** The stale entry is nonetheless the
> `SKILL.md` a reader would open, and it still says *"the GitHub remote is NOT usable — never push,
> never fetch"* — which stopped being true when O-4 made the repo public and Pages became canonical.
> ⛔ **Owner action, not a run's: reconcile which task definition is authoritative and fix that
> sentence in whichever one runs.** A run must still never push; the false half is "NOT usable".
>
> ### W-9.3 — W-8.1 was right about the cost and wrong about the shape. The deploy lag is a WEEKEND, not a coincidence.
> **Re-measured 2026-09-27 from `origin/main`'s reflog, which is the only record of it:** pushes
> landed at **21:16 on 09-21, 09-22, 09-23, 09-24 and 09-25** — five consecutive weekdays, each
> on or just after that day's market commit — and **none on Saturday or Sunday.** The same shape
> explains W-8.1: its "last push 2026-09-18 21:18, 28 commits behind" was measured on a **Sunday**,
> at the peak of exactly this cycle, across the two highest-volume days the project has ever had.
> **O-5's "current by coincidence" is no longer the right description of the steady state.** What
> is true today, measured with `npm run check-deployed`: **❌ DIVERGED** — live
> `assets/index-Csl251B_.js` against local `index-D_MFj2n0.js`, **6 commits** of 09-26/09-27
> content corrections not live, live `market.json` **asOf 2026-09-25, age 2d**.
> ⚠️ **The residual risk is thin margin, and it is worth stating precisely because it is small:**
> `STALE_AFTER_DAYS` is 4, a Friday `asOf` is 3 days old by Monday's push, so **one missed Monday
> push takes Reference → Sectors dark on Wednesday.** Route 1 (have the job push) still removes
> this; route 2 (document it) now has a much easier sentence to write than it did last week.
>
> ### W-9.4 — the residual-chain rule is being satisfied to the letter while the mode runs unbounded.
> **Six of the last seven runs were a hand read of one ko/zh/ja short-string surface** — glossary
> names, quiz stems, section headings, lesson titles, quiz options, quiz explanations. Each entry
> correctly cites W-6.2 rule 1, and each is correct: the chain was legally reset on 09-26 18:05 by
> **one** non-residual pick (item 152) and immediately re-entered. **The rule counts consecutive
> residuals; it does not count MODE, so a single interleaved pick buys an unbounded chain.**
> ⛔ **W-9.4 replaces that bound for as long as this block is active: a run may not pick a
> short-string hand read of a translated surface if EITHER of the previous two runs did, whatever
> the residual bookkeeping says.** Rule 1 is unchanged for every other kind of pick.
> ⭐ **This is a bound, not a verdict.** The mode is finding real defects at a high rate and W-9.5
> is the reason that matters. But 44 lessons × every string × 4 languages is not a finite queue,
> and **the constraint on this product has moved** — see W-9.5.
>
> ### W-9.5 — the proofreading passes have accidentally produced the strongest evidence O-3 has ever had. Escalate it.
> O-3 asks the owner to re-affirm or cap shipping unreviewed machine translation. It was filed when
> the defect rate was **hypothetical**. It is not hypothetical now. **This week's seven hand-read
> passes found roughly thirty real defects in shipped non-English content**, every one of them
> learner-visible: an ungrammatical Korean particle after a vowel-final noun; a Japanese passive
> that made the *protection* pay the price; a Japanese potential form that read "high earners are
> *able* to live paycheck to paycheck"; four Spanish quiz stems missing the head noun that says what
> is being asked; a Chinese heading that dropped the concept its section teaches; a Korean heading
> that turned the lesson's own question into a statement; "Rule of 72" with no mention of what it
> approximates.
> ⭐ **The finding is not that any one of these is severe. It is the density, and the surface.**
> Every pass into a surface nobody had hand-read came back with defects — glossary names, stems,
> headings, titles, options, explanations, six for six. **Human review share is still 0% in all
> four languages.** The 2026-08-11 "(Beta)" decision was made about a smaller, static corpus and
> without a measured error rate; there is now one.
> ⛔ **Ask the owner for a decision; do not restate the blocker in a closing line.** That is O-1's
> own lesson, recorded at the top of this backlog: sixteen consecutive closing lines moved O-1 none
> of the way, and one direct instruction moved it all of the way in twenty minutes. **The ask is
> one sentence: fund a fluent review of one language, or cap what ships under "(Beta)", or
> re-affirm it now that the rate is known.**
>
> ### W-9.6 — O-2 is the whole critical path and no one asked about it this week.
> Every §4.3 content clause is **met** (44 lessons / 174 min / all tracks translated). The one
> unmet Phase-0 gate — **installer lesson-1 completion ≥40%** — is scored **❌ Unmeasurable** and
> stays that way until a provider key exists. The code half has been done and verified since
> 2026-09-05; the owner action is **four steps and roughly twenty minutes**, written out in O-2.
> **Nothing a run did this week moved the launch, because nothing a run CAN do moves it.** That is
> not a criticism of the runs — it is the reason W-9.5's escalation and this one belong at the top
> of the report rather than in a closing line.
>
> ### W-9.7 — the cost of this block, per W-7.2 rule 5.
> Backlog **411,512 b** before this block. W-8 cost 11,676 b, W-7 12,567 b, W-6 17,717 b, and
> W-9.0 shows those blocks are now the accretion. **This block was written to be cheaper than its
> three predecessors**; the after-figure goes in the report, read off `check-log-size.mjs` and not
> retyped from here. **The test of W-9 is not whether the next run agrees with it — it is whether
> W-9.1 has landed and the floor is below 300,000 b on 2026-10-04.** Next review: open with a fresh
> MEASURED line before anything else.

> ## PRIORITY BLOCK W-8 — set by the weekly review 2026-09-20. Supersedes W-7's *active* clauses below. W-7's standing rules (W-7.2 rules 1–3 on closed text, W-6.2's residual-chain rule, W-6.3's ratio-quoting rule) are UNCHANGED and still binding. ⚠️ **There was no weekly review on 2026-09-13 — `reviews/` goes 09-06 → 09-20, so this block covers two weeks of direction and one week of commits.** Read this first.
>
> **The week shipped 66 commits, build and tests green, and the content work in them is the
> best-evidenced this project has produced — measured against named series, with positive AND
> negative controls, limits stated rather than buried, landed in all five languages. Nothing in this
> block disputes that. ⛔ It is about one fact that sits on top of all of it: _not one of those
> corrections has reached a learner._**
>
> ### W-8.0 — W-7.2 rule 5's test, taken first, as rule 5 required.
> Measured 2026-09-20 off `check-log-size.mjs`'s MEASURED line (not retyped from any prior entry):
> backlog **401,965 b**, floor **440,371 b** (88.1% of budget), run log **231,099 b** (92.4% of warn,
> 2 live days). **Rule 5's test PASSES** — 425,473 b was the 2026-09-06 baseline, so the backlog is
> **23,508 b under it**, the first time a weekly block has been smaller a fortnight on. ⚠️ **But read
> it against 09-07's 397,785 b, not only against the baseline: it is +4,180 b since. Rule 1 stopped
> the growth; it has not reversed it.** The log-size WARN cleared this week (`npm test` 4 → 3
> warnings) via W-5.3's seventeenth and eighteenth firings.
>
> ### W-8.1 ⛔ PRIORITY — the single most important fact about this week, and no run can fix it.
> **`origin/main` is `b900df3`. Local `main` is 28 commits ahead. The last push was 2026-09-18
> 21:18.** Every learner-visible correction from 09-18 20:11 onward — the whole 09-19/09-20 body of
> work, 26 content fixes — **is not on the site.** This is O-5 exactly as filed, now with a date
> attached:
> - The live `public/data/market.json` is `asOf 2026-09-18`; HEAD's is `asOf 2026-09-20`.
> - `STALE_AFTER_DAYS` is **4** and the test is `ageDays > 4` (`src/lib/useMarketData.js:20,52`).
> - **So Reference → Sectors goes to its unavailable state for every visitor on 2026-09-23** unless
>   a push carrying a fresher `market.json` lands first. The other 44 lessons, the glossary, Review
>   and the parent guide are unaffected — a stale deployment still teaches.
> ⛔ **Owner action, and it is O-5's route 1 or route 2, unchanged.** A run is forbidden to push and
> this block does not ask one to. ⭐ **What this measurement adds to O-5 is the shape of the cost:**
> the gap is no longer an abstraction about coincidence. It is 28 specific corrections, including
> five that replaced a false historical claim with a measured one, sitting in a repo nobody reads.
> **A correction that is not deployed is not a correction; it is a note to ourselves.**
>
> ### W-8.2 — cadence: ~8 scheduled runs did not fire, and nothing in the log knows it.
> Run entries per day, 09-13 → 09-20: **6, 3, 1, 0, 8, 15, 21, 5**. Against a 6-hour schedule (4/day)
> **09-14, 09-15 and 09-16 are 3, 1 and 0**, and the gap from `0bc1a95` (09-15 00:04) to `f631020`
> (09-17 16:13) is **~40 hours with no dev-agent commit**. The market-data job kept running at 19:46
> throughout, so the machine was up; the dev schedule was not. **No run entry mentions the gap,
> because a run that does not fire cannot write one** — this is structurally invisible from inside
> the log, which is why it is recorded here. Owner-facing note only; no action for a run.
>
> ### W-8.3 — W-7.2's accretion did not stop. It MOVED, from the backlog into `src/`.
> Measured 2026-09-20 over `ca9ebd7..HEAD` (the week), six teaching-content modules:
> | file | lines added | of which comment | of which code |
> |---|---|---|---|
> | `content/markets.js` | +50 | **+50** | **0** |
> | `content/kidsContent.js` | +32 | +31 | +1 |
> | `content/moneyVisuals.js` | +23 | +23 | 0 |
> | `content/sectors.js` | +14 | +14 | 0 |
> | `content/policyScenarios.js` | +5 | +5 | 0 |
> | **total** | **+124** | **+123** | **+1** |
>
> `markets.js` is now **37.7% comment by line**, up from 32.9% a week ago, and the block above its
> `scenario` export runs ~40 lines for one sentence: the old wording, that nothing had tested it, the
> operationalization, three findings, a stated limit, and a note that no check guards it.
> ⭐ **This is not a request to delete provenance, and deleting it would be the wrong lesson.** Those
> blocks are why the corrections can be trusted, and the "re-measure, do not retype" discipline in
> them is correct. **The rule is W-7.2 rule 1, applied where it now bites:** when a question CLOSES,
> it is replaced by its conclusion, not annotated with one. **The finding, the limit and the
> re-measure warning stay. The narration of the search does not — it is already in the run log, which
> is what the run log is for.** Target: a provenance block for one corrected sentence should be
> readable in under ten lines.
>
> ### W-8.4 — the instruments started outgrowing the app again, and one file is most of it.
> Re-measured 2026-09-20, same method as W-7.0 (`scripts/` non-JSON lines vs `src/` minus
> `content/`+`locales/`): **22,752 / 10,196 = 2.23x**, against 2.19x on 09-06. This week's net was
> `scripts/` **+307** vs `src/` **+126** — instruments grew **2.4x faster than the app**, reversing
> the near-parity W-7.0 credited. **`check-data.mjs` alone took +308/−1 of it and now stands at
> 13,175 lines** (11,597 on 09-06, **+13.6% in a fortnight**), in one file. W-6.3 says this is a
> number to watch rather than a rule to obey, and it is quoted here rather than acted on — **but
> W-6.2 rule 3 binds before the next check is written: name the learner-visible failure it catches.**
>
> ### W-8.5 PRIORITY — the agent has one mode, and two unblocked learner-visible items sat out the week.
> **61 of 61 dev-agent commits this week were a single-sentence accuracy correction or an archiving
> pass.** That mode is working and this block is not asking for it to stop. **But it is unbounded** —
> 44 lessons × every sentence is not a finite queue — and meanwhile **two items that a run CAN close,
> that need no owner, and that `npm test` warns about every single run, were not picked once:**
> 1. **Item 94 — the `essentials` track.** `npm test` WARN: **47 of 176 lesson/language pairs carry a
>    condensed summary rather than a translation**, 12 lessons, and per `LAUNCH_READINESS.md` §10.4
>    **all of them are on `essentials`** while both main-path tracks are fully translated. This is the
>    largest single learner-visible gap left in the product that a run can close. It has a measured
>    scope, a per-lesson list (`npm run translation-completeness`), and it is one schedulable block
>    because the abridged set is identical in all four languages.
> 2. **Item 160 — the quiz option-length cue.** `npm test` WARN: **always tapping the longest option
>    scores en 24/46 = 52.2% against a 25.0% chance baseline.** A learner can pass half the checks off
>    the option shape without understanding the material — which is a content-accuracy defect in the
>    assessment, the same class of defect the week spent 61 runs on in the prose.
> **The rule, and it is the one course-correction this block asks for:** ⛔ **before a run picks a
> sentence to measure, it must first check whether item 94 or item 160 still carries a standing
> `npm test` WARN. If either does, that is the pick.** A run may override this, but it must say in
> its entry why the sentence it chose instead was more valuable to a learner than closing a warning
> the test prints every time it runs. **When both WARNs clear, this clause expires and the
> sentence-audit mode resumes as the default.**
>
> ### W-8.6 — a class was diagnosed and only its instance was fixed.
> `f6b24f9` found Lesson 5 shipping the literal characters `*and*` to every English learner and
> reasoned the class precisely: the reader renders `{section.body}` as a plain text child, there is no
> Markdown dependency and no `dangerouslySetInnerHTML`, **so any Markdown written into a content
> string arrives on screen as itself.** It then fixed the one string. Re-measured 2026-09-20: the
> corpus is **clean in all five languages** (0 matches for `**…**` across `lessonContent.*` and
> `quizText.*`, 0 for single-asterisk emphasis in English) and **no `check-data.mjs` section guards
> it** — the section list ends at §84. **This is the cheapest guard on the open list and it satisfies
> W-6.2 rule 3 outright:** the learner-visible failure is asterisks on the page, and it has already
> happened once. File it as the next `check-data.mjs` section.
>
> ### W-8.7 — content quality and neutrality: no regressions, and the readability worry from 09-17 is measured closed.
> `npm run check-blindspot` is green inside `npm test`, and this review read the most advice-adjacent
> surface changed this week directly rather than trusting the check: `markets.js`'s teaching scenario
> is hypothetical, undated, carries no recommendation, and its closing sentence now states a 2.8x lift
> **and** the three episodes with no downturn behind it. **No buy/sell language, no personalized
> advice, no regression found anywhere in the week.**
> ✅ **`f00b1fd`'s worry is closed by measurement, not by assertion.** That run found four correct
> corrections had landed in one lesson-35 paragraph and left it at **1,949 characters**. Re-measured
> 2026-09-20 across all 334 English paragraphs in all three tracks: **longest is 1,201; 1 paragraph
> over 1,200; 5 over 900.** The split worked and the corpus is not over-long. ⚠️ **Watch, do not act:**
> reading time went 171 → **174 min** this week and every hedge adds words. **If a future review finds
> the max back over ~1,500, the cause is this mode and the fix is a break, not a shorter hedge.**
> ✅ **Residue below CLOSED 2026-09-25 (dev-agent): both years now sit in `f`, and the entry says why they differ.** ~~One cosmetic residue:~~ the Yield Curve glossary entry now
> reads "the six US recessions since 1976" in its definition and "every US recession since 1955" in
> its example. Both are correct and `4cad5d9` explains exactly why the two dates differ (1957 and
> 1960 predate `DGS10` and are untestable here). **A learner sees two start years two sentences
> apart.** If a run touches this entry, reconcile the presentation without weakening either claim.
>
> ### W-8.8 — the cost of this block, per W-7.2 rule 5, which applies to W-8 first.
> The backlog stood at **401,965 b** before this block was written and **413,641 b** after — **this
> block cost 11,676 b**, against W-7's 12,567 b and W-6's 17,717 b. Both figures are read off
> `check-log-size.mjs`, before and after. **The test of W-8 is not whether the next run agrees with
> it — it is whether the backlog is BELOW 413,641 b on 2026-09-27.** Next review: open with a fresh
> MEASURED line before anything else, and do not retype either figure.

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

55. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

56. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

57. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

58. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

59. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

63. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

72. **🟡 DEV-AGENT HALF DONE 2026-08-17 (scheduled dev-agent). The build is deployable and the
    clicks are written down; the OWNER HALF — choose a host, drag the folder, hold the URL — is the
    only thing left and it cannot be done from here. Keep flagging it in every run's output until it
    moves, alongside item 18. Do not re-pick this item to "improve" the deploy docs; the refuting
    number is a URL, and no amount of further writing produces one.**

74. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".
73. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

77. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

84. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

87. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

85. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

86. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

80. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

81. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

82. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

83. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

79. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

78. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

88. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

89. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

90. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

91. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

92. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

93. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

94. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

96. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

97. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

98. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

102. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

103. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

104. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

105. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

115. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

114. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

113. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

112. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

111. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

110. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

109. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

123. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

124. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

125. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

127. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

128. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

129. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

131. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

134. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

136. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

137. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

135. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

132. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

133. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

138. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

139. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

146. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

147. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

177. **✅ DONE 2026-10-17 (scheduled dev-agent): the four 7-word runs are reworded in English, and the rebuilt instrument finds 0 (see that day's run-log entry). L31's 5-word "borrow from your future self" is left: it is a common personal-finance phrase.** Original text follows. **Four short phrases still shared with the "How the Economic Machine Works" transcript (§10.2, found 2026-10-16).** That run removed the six complete sentences the app had quoted (L29, L31, q004, q009). Its 7-word overlap instrument (`ngram.mjs` in that entry; a Wikipedia "Business cycle" control gives 1 run, a proper name) still finds four 7-word runs: L32 *"spending and incomes grow faster than the…"*, L33 *"this is the long-term debt peak"*, L34 *"income needs to grow faster than debt"*, and q008's keyed option *"Don't have debt rise faster than income"*. L40 already words that rule *"Don't let debt rise faster than income"*, so the option is the cheapest fix, and it keeps option length unchanged for §65. Also L31's thinkAbout *"borrow from your future self"* (5 words). **Arguable:** these are short and close to common phrasing. Reword only with the instrument re-run, and do not turn this into a sweep of ordinary terms like "short-term debt cycle", which the lessons need.

176. **✅ Closed 2026-10-02 (dev-agent).** `check-blindspot.mjs`'s zh timing pattern now allows up to four Han characters between the verb and `的好`, and accepts bare `买`/`卖`. Its `fires` list (all must match) covers `买入的好时机`, `买入股票的好时机` and `买股票的好时机`. Live instances were 0 and are still 0. Details are in the 2026-10-02 run-log entry.

175. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

174. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

173. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

172. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

171. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

170. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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

169. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".
167. **✅ Closed 2026-09-06; archived verbatim 2026-09-28** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".
    All four lesson defects (a)–(d) are fixed in five languages. ⛔ **Its notes record seven classes
    swept and CLOSED — do not re-run any without reading the archived item first:** research-authority
    citations; checkable arithmetic; English↔translation numeric drift; question answerability;
    glossary↔lesson agreement, attributed cross-references and typography; `explain` vs keyed answer;
    answer key vs translated option order. `kidsContent.js`'s "$2+ trillion" was kept on purpose;
    ✏️ **re-decided 2026-10-10 on measurement** (FRED `WALCL`: net growth ~$1.4T before QE2, so
    the ruling's QE1+QE2 rescue failed). It now gives the balance-sheet doubling. See that run entry.

166. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

165. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

164. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

163. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

162. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

161. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

160. **✅ GOAL REACHED 2026-10-18 (weekly review, W-12.1): §65 longest-option rates are en 28.3 / es 26.1 / ko 28.3 / ja 26.1 / zh 23.9 against 25.0% chance. No longer a pick; those rates are now a regression ceiling.** Earlier status follows. **🟡 PARTLY DONE, and its own stop-clause is CORRECTED (2026-09-02, owner-directed: "do item 160
⭐ **PROMOTED by the weekly review 2026-09-20 (W-8.5).** This item still carries a standing `npm test` WARN (longest-option tapping scores en 52.2% against a 25.0% baseline) and was not picked once in the 61 dev-agent commits of 2026-09-13 → 09-20. **While that WARN stands, this item outranks a sentence-audit pick** — see W-8.5 for the rule and the override clause.
    next"). The clause below says "there is nothing left in it that trimming can honestly reach" and
    routes the remainder to O-3. That is TRUE OF MECHANICAL CUTS — re-proven this run with a stronger
    cutter — and FALSE OF HAND DELETION, which reached the band in all five languages on two
    questions, including one of the two the clause names as the head of the O-3 queue.**
    - ⛔ **STOP LINE REACHED 2026-09-04 (scheduled dev-agent) — measured, not forecast. Everything
      still open in this item is class B, and class B is O-3's decision. Read this before picking it again.**
      - ✏️ **CORRECTED 2026-09-20: "everything still open is class B" was FALSE, and the flaw is that the
        stop line ranked the whole corpus and then examined only the top four.** By relative margin those
        four were `q008` 57% (B), `q021` 56% (A, unreachable), `q014` 53% (B) and `q005` 50% (A, declined
        on narrow zh/ja bands) — all four figures reproduce exactly 16 days on. **It generalized from them
        and never looked at rank 5 onward, where `q039` sat at 48%, class A, with the WIDEST bands in the
        reachable set** (zh [23,35], ja [30,53] — the opposite of the q005 objection the stop line rested
        on). Fixed this date in all five languages; §65 dropped one question in every language and the
        standing WARN cleared. **The remainder is still not all class B: `q037` (37%, L23), `q040` (16%),
        `q034` (11%) and `q027` (6%) are class A and beatable in all five.** `q034` is next by margin.
        (`q023` done 2026-10-02, `q037`, `q040` and `q034` done 2026-10-03; landings in those days' run logs.
        `q027` done 2026-10-04: its "6%" was the **en minimum**; ko/zh/ja were **100/61/53%**, so the
        min-margin ranking hid the loudest CJK tell left. **Class A is now empty except `q021`
        (unreachable).** Rank per language, not by the minimum.)
        **Do not re-read this item as blocked without re-ranking — rank the whole set, not the top of it.**
      - ✏️ **CLASS B UNBLOCKED 2026-10-17 (dev-agent).** Class B was parked as "O-3's decision", and **O-3 closed
        2026-10-10** with AI-reviewed translations re-affirmed, so distractor prose in es/ko/zh/ja is now a run's
        work. `q008` (L40), the largest tell at 57-133%, got three distractors the lesson contradicts (the reverse of
        Rule 2; borrowing more as rates fall; not borrowing in your own currency). §65 → en 34.8 / es 32.6 / ko 34.8 /
        zh 30.4 / ja 32.6, shortest unchanged. **Next by per-language margin:** ~~`q001` (ko 117%, zh 100%)~~ (done
        2026-10-17, see that day's q001 entry), ~~`q021`~~ (done 2026-10-18: answer trimmed AND new
        distractors; ✏️ its old distractors were 44-54-char sentences, not "short slogans", and one, *"less money
        overall"*, echoed L7's own benefits-cliff caveat), ~~`q043`~~ (done 2026-10-18: answer trimmed AND new
        distractors; ✏️ L41's stated 3 min sat 2 words under the 4-min boundary, so English options must keep
        their word count), `q004` (ko 88%), `q019` (zh 86%),
        `q014` (ko 84%). Write distractors the lesson itself contradicts, so none is "also true".
        After q043, §65 reads en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1; `q004` heads the ranking.
        ⚠️ **Quiz options count toward a lesson's `minutes`** (READING_MODEL counts every option), so
        check the lesson's word total before and after; `check-data` §2 fails if it crosses a boundary.
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
159. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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
    **Possibly in scope too (noted 2026-10-11, not decided):** *"beautiful / ugly deleveraging"* is Dalio's
    coinage, used unattributed in lesson 34's heading and the Dashboard's dial, label and anchors, in five
    languages. The same one-word answer decides it; a run should not rename it first.
    **Also (noted 2026-10-17, not decided):** lesson 40's "The Three Rules" are the video's closing "three
    rules of thumb", in its order, and q008's stem calls Rule 1 "the first rule of thumb". The wording is
    now the app's own (item 177); the structure is the same framing question as above.

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

156. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

155. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".
154. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

153. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

152. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

151. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

150. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

149. **✅ DONE 2026-10-27 (scheduled dev-agent): states now declare the conditional probes they expect (`expects`), and `coverage()` holds them to it both ways. Declared + VACUOUS is a gap, undeclared + live is a DECLARATION MISMATCH, and undeclared + VACUOUS counts as honestly empty. Premise corrected: 6 states need a declaration, not ~4. Measured live over all 19 states: 0 mismatches, 0 partial probes. See that day's run-log entry.** Earlier text follows.
    **[Process/QA — filed 2026-08-29 by the run that built `A11yStates.coverage()`, as its stated
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

148. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

140. **✅ DONE 2026-10-24 (scheduled dev-agent): the hand measurement below is now `a11y-sweep.js`'s `ringBackdrop` probe, with a planted control in `selftest()` that §43 requires. Re-measured live: 9 screens × 2 palettes, 0 findings, the same four surfaces, worst 7.10:1. Residual, not an item: `a11y-states.js` sweeps whichever theme the page is in, so dark still needs the operator to set `data-theme` (item 149's axis note). Earlier text follows.**
    **[A11y/Tooling — filed 2026-08-28 by the run that built §28c (item 139), as its stated
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

144. **✅ Closed 2026-09-29; archived verbatim 2026-09-29** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)". Premise was wrong: §59's own header was a live mention-only exemption. A marker now counts only when not in backticks (`declaresAllow`), guarded by §59 CONTROL D.

145. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

143. **✅ DONE 2026-10-28 (scheduled dev-agent). Premise corrected first: the 4 uses named below are no
    longer in the live log (archived verbatim, so exempt as dated records), and the live prose held 2
    others, both in item 76: `tokeniser` and `capitalised-phrase` (the code's rule is
    `capitalized-phrase`). Both fixed. A line scan with `us-english.mjs`'s `scan()` now finds only
    mentions (a marked quote and this item). The `:525` pointer had rotted to `:732`; the §59 header
    now names the file without a line.** The original text follows.
    **[Docs/Integrity — filed 2026-08-29 by the run that built §59 (item 130), as the measured
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

142. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

141. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

130. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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

121. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

120. **✅ DONE 2026-10-27 (scheduled dev-agent): `auditWarmBegin()`/`auditWarmFinish()` diff a second warm fixture, and §48(e) holds both to the same keys. The first run found `reference-glossary-term` too coarse; it now declares NO_BOOKMARKS (see that day's run-log entry).**
    **[Process/QA — filed 2026-08-26 by the run that closed item 119, as its stated residual
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

119. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

118. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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
      (i) ~~`showPracticeCoachMark` is `completedLessons.length > 0`, so the coach mark sends the
      learner to Review at exactly the moment Review is empty — harmless now that the card names the
      right next action, but the trigger is still completion.~~ ⛔ **PREMISE WRONG — CLOSED
      2026-09-30 (scheduled dev-agent); nothing in `src/` changed.** The *schedule* is empty then;
      **Review is not**. `practicePool` counts every question of a completed lesson, and all 44
      lessons own ≥1 question (Node over `quizMeta`: 46 questions, 0 lessons with none), so the pool
      is ≥1 whenever the coach mark can show. Live on the built app, from cleared storage: complete
      lesson 29 without answering its check (`completed [29]`, `ecycles_review` null), and the coach
      mark shows. Tapping it lands on Review with **"Practice all questions (1)"** under the
      not-started card. Control: with nothing completed, the same screen has no practice button.
      **Completion is the right trigger.** What is left is (a)'s: the card says "Nothing to review
      yet" right above a working practice button. (ii) ~~The `Steps` rail marks `done` with
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
    > ✅ **The wrong-description half FIXED 2026-10-18 (scheduled dev-agent):** with storage blocked, the nothing-due card now says review can't be saved here (`reviewNoStorage*`, five languages), fresh, after answering and after a reload, measured live with an unblocked control. **(a) itself is still open.**
    - **Honest priority: low.** The defect is fixed; these are the seams around it. **All of it is
      downstream of O-1** — nobody has opened the app, so no learner has met either branch.

116. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

108. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

107. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

106. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

101. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

99. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

100. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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
    - **The unblocking work is a per-language tokenizer**, and it is genuinely a piece of work, not a
      flag: `norm()` needs a Unicode-aware form, the acronym/capitalized-phrase rules need per-script
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

95. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

75. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

65. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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

69. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

68. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

67. **✅ CLOSED 2026-09-27 (scheduled dev-agent). All three terms are done: `NBER` and `realized gains`
    on 2026-08-17, and `Dividend` on 2026-08-20 under item 64 (all five languages, re-read from
    `glossary.js` on 2026-09-27). This line stayed 🟡 for 41 days because item 64 closed the work and
    nothing updated this item.** See the run log.

66. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

60. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

64. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

61. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

62. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

26. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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

33. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

27. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

28. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

29. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

35. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

36. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

30. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

31. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

37. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

32. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

40. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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
34. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

38. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

39. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

46. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

47. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

49. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

41. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

42. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

43. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

44. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

45. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

48. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

50. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

12. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".
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

### 2026-10-30 (scheduled dev-agent; the previous entry's "Seen, not fixed", the unknown-link heading) — A link to a lesson id that doesn't exist now shows the heading "Lesson not found". It used to show "That lesson isn't open yet", which says the lesson exists and will open. A locked lesson keeps the old heading. Five languages.

Rules: W-6.2 ok (residual of `d37ef6e`). W-13.2(c) ok: the old heading is false for this case, not a true sentence being narrowed. W-9.4: run 1 of 2, so the five new strings get a second read next run. `npm test` at `8a5a0f7`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: measured.** `App.jsx` passed `t.linkMissLabel` for both `missed.reason` values. Only the body switched (`linkMissLockedTemplate` vs `linkMissUnknown`). The catalog holds ids 1–44 with no gaps, so today the unknown case comes only from a hand-edited link or a future id removal. That is rare, but the heading is plainly false there, and the body right below it says so.

#### What shipped (6 files)
`src/App.jsx`: the `Note` label now follows `linkMiss.reason`. New key `linkMissUnknownLabel` in all five locales: en "Lesson not found", es "Lección no encontrada", ko 레슨을 찾을 수 없습니다 (the same 습니다 register as its sibling), zh 找不到这节课 (the sibling's 这节课), ja レッスンが見つかりません (the sibling's ません).

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Parity control | with the ja key removed, `check-data` printed `FAIL: TR.ja: missing key "linkMissUnknownLabel"` and exited 1. Restored from the scratchpad copy, and the key count went back to 1 |
| Build | `build-out-of-tree.sh --no-copy-back` succeeded: the previous entry’s `index-DpcBx8_w.js` → `index-BaI4lg7u.js`. Each new string is in 1 asset |
| Live, new bundle | In-tab `#/lesson/999` (en): "Lesson not found" plus the unknown body, at `#/learn`. Returning full load of `#/lesson/999` (ko): 레슨을 찾을 수 없습니다, at `#/learn` |
| Controls | In-tab locked `#/lesson/30` (en) and a returning full load of locked `#/lesson/31` (ko) both still show "isn't open yet" / 아직 열리지 않은 레슨입니다, and not the new heading |

**Step 5:** this is a UI heading with no market, advice, Dalio or kids content, and `check-blindspot` passed. DECISIONS.md's "a locked link does not open" holds, since `resolveRoute` is untouched. The 10-29 deep-link fix is kept: only the label changed. **No conflict found.** My first full-load attempt opened the path’s first lesson, because I hadn't set `ecycles_seen_disclaimer` and the app treated the visit as a first visit. That is `initialRoute`'s intended behavior, not a defect.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-29 (scheduled dev-agent; free pick, a live walk of deep links at 375px) — A locked lesson link opened from Review or Reference now shows the "That lesson isn't open yet" notice. Before, it landed on the path with no notice, and the first Back stayed on the path. On the path itself, the address bar no longer keeps the refused `#/lesson/<id>`. No copy change.

Rules: W-6.2 ok (free pick; the previous entry left no residual). W-9.4 n/a (no string). W-13.2 n/a (a code fix, not a narrowed claim). `npm test` at `f4934a0`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: measured live** (`dist/` at `f4934a0` served statically; real asset 200, bogus `.js` 404). I pasted `#/lesson/30` (locked) into a returning learner's tab:
- **From Review:** the path rendered with **no notice**, at 0, 50, 150, 400 and 1000 ms. An event log showed why. `popstate` routed the link and set `missed`. The hash effect then pushed `#/learn`. `hashchange` fired last, and by then `location.hash` was already `#/learn`, though its `newURL` still said `/lesson/30`. So the second `sync` resolved `#/learn` and cleared `missed`. The old comment's premise ("`sync` is idempotent") holds only for a link that opens.
- **From Reference:** same, plus 2 history entries. Back 1 stayed on the path at `#/lesson/30` and only now showed the notice. Back 2 reached Reference.
- **From the path (control):** the notice did show, because nothing changed state and nothing was pushed. But the address bar kept `#/lesson/30`, so a reload or a copied link carried the refused lesson.
**Controls:** a first-visit load of `#/lesson/30` opened lesson 1 and rewrote the hash, as `initialRoute` intends. A returning visitor's full load showed the notice at `#/learn`. Both confirm the notice instrument fires, and both are the load path, not the in-tab path.

#### What shipped (1 file)
`src/lib/deepLink.js`, `useDeepLink` only. `sync` now writes the resolved place's own hash over a refused one with `replaceState`, in the same entry, keeping its stamp. The listener now skips `hashchange` when the address bar already names the app's current hash (`hashRef`), so the second call can't clear `missed`. `resolveRoute`, `initialRoute` and the pure half are unchanged, so §18 still covers them. Two stale comments corrected.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BrD57vrr.js` → `index-DpcBx8_w.js` |
| Live, new bundle | Review → `#/lesson/30`: notice, `#/learn`, +1 entry. Reference → same, +1 entry (was +2), and one Back returns to Reference. Path → notice, `#/learn`. Unknown `#/lesson/999` from Review: its notice, `#/learn`. `scrollWidth` 375 |
| Controls, new bundle | a valid link from Review opens lesson 29 and keeps its hash, and Back returns to Review. Back from Reference › Glossary closes the glossary and keeps `#/reference`. First-visit load → lesson 1. Returning load of locked `#/lesson/31` → notice at `#/learn`. Pasting unlocked `#/lesson/30` on the path opens it |

**Step 5:** no string changed, so no §10.1/§10.2/§10.3, date or translation exposure. DECISIONS.md's hash-routing and "a locked link does not open" decisions are kept: `resolveRoute` is untouched. Item 31, the 09-06 Back dismissal and the 09-08 `missed` notice are kept, and the last two were re-measured above. No `src/` code writes the hash, and the skip link is a `<button>` (`App.jsx:472`), so the new skip can't swallow an in-page anchor. **No conflict found.** Not covered: a browser that fires `hashchange` without `popstate` would stamp the pasted entry with the index below it. That gap was already there; the effect's same-hash branch does the same.

**Seen, not fixed:** an unknown-id link shows the heading "That lesson isn't open yet" over "Your link pointed to a lesson that isn't in this app". The heading is false for a lesson that will never open. It is rare (a hand-edited or rotted link). `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` (asOf 10-28) aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-29 (scheduled dev-agent; `reviewEmptyBody`'s second read, owed under W-9.4 by `5db9708`) — the four translations hold. Each says what the scheduler does and matches its own rail. No content change.

Rules: W-9.4 ok (the previous two runs: `d54e3f3` was a code change, and `5db9708` was a behavior fix, not a hand read, as `d54e3f3`'s entry counted it). W-6.2 ok (named item). `npm test` at `d54e3f3`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Measured** (`scratchpad/rv.mjs`, `review.js`'s own `recordAnswer`): a first answer lands at +1 day whether it is right or wrong, then +2 and +4 on right answers. A wrong answer resets to +1. **Control:** the instrument reproduces `BOX_INTERVALS` = [1, 2, 4, 8, 16] and the wrong-answer reset, both known from the source.

**Read by hand, all four:** each says "the day after your first answer, then longer gaps while you keep getting it right", the same claim as en. Each reuses its rail's vocabulary: es *acertar* and *intervalo*, zh 间隔就会拉长 word for word, ko 간격, ja 間隔 and 正解. Each is grammatical: ko 다음 날 is spaced, and es *responder la pregunta* takes the same direct object as the rail's *Respóndela*. None misleads a learner in a common case (W-13.2(a)), so I left them.

**Build:** `build-out-of-tree.sh --no-copy-back` exit 0, `index-BrD57vrr.js` (unchanged). Each of the five new strings is in 1 asset, and the old en string is in 0.

**Step 5:** log only. No `src/` edit means no §10.1/§10.2/§10.3, date or DECISIONS.md exposure. Run 1's change is kept, not undone. **No conflict found.** Staged count asserted = 1.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` (asOf 10-28) aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-29 (scheduled dev-agent; free pick, UI copy that describes app behavior, checked against the code) — Finishing the last lesson no longer asks the learner to "Keep the streak going. Come back tomorrow to continue where you left off." Nothing is left to continue, and only a lesson completion bumps the streak. No copy change.

Rules: W-9.4 bars a translated-surface hand read this run (`2b24c4f` was one), so `reviewEmptyBody`'s owed second read waits for the next run. This is a code change with no new string. W-6.2 ok (not a residual). W-13.2(a): every learner whose last lesson is their first completion that day sees it. `npm test` at `5db9708` was not re-run before editing; the previous entry reports exit 0 / 0 FAIL / 1 WARN.

**Step 3.5: the premise, measured live** (`dist/` at `5db9708` served statically; real asset 200, bogus `.js` 404). I seeded 43/44 complete, streak 5 dated yesterday, prompt last shown yesterday, then opened lesson 28 and clicked Mark Complete. Result: 44/44, streak 6, and the prompt rendered with its title, body and "I'll be back tomorrow" CTA. `useAppState.js` confirms the streak moves only in `completeLesson`: review answers never bump it, so tomorrow the chip still shows 6, and the day after it shows 0. The Learn screen at 44/44 says "Nothing left to unlock — what happens now is review". The reader contradicted it one click earlier. **Instrument check:** my first seed came back with lesson 16 missing, not 28, because the legacy-id migration remapped unflagged ids. I re-seeded with `ecycles_legacy_lesson_id_migrated` set before trusting any reading.

#### What shipped (2 files)
- `src/screens/LessonReader.jsx`: `handleComplete` skips the prompt when this completion finishes the path. The test is the same as Learn's `pathComplete` (every lesson in `lessons`, which is all 44 via `lessonsByTrack()`), run against the render's pre-click `completedLessons`. On that completion nothing is written to `ecycles_continue_pref` either.
- `src/lib/useAppState.js`: comment only. The prompt's contract now names the exception.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Build | `build-out-of-tree.sh` exit 0, `LessonReader-DJg2aCT7.js` → `LessonReader-Dfj5v5ON.js`, `index-CTXP7WIo.js` → `index-BrD57vrr.js` |
| Live, new bundle, 43/44 → 44/44 | no prompt and no CTA. Streak 5 → 6, `continue_pref` untouched, focus on Next Lesson |
| Control, 42/44 → 43/44 (lesson 15 still open) | prompt and CTA render, and `continue_pref` records "asked today" |

**Step 5:** no string changed, so no §10.1/§10.2/§10.3, date or translation exposure, and `check-blindspot` passes. DECISIONS.md has nothing on the prompt, and storage stays localStorage-only. LAUNCH_PLAN §4's opt-in is kept on every completion that has a next lesson. On the one that finishes the path, the opt-in was recording a promise to "continue" that had nothing behind it. The archive's two prompt entries (its 08-03 build and the 08-31 CTA rewording) are untouched. No a11y state clicks Mark Complete, so no fixture depends on this. **No conflict found.**

**Seen, not fixed:** at 44/44 the reader still offers "Next Lesson" to an already-finished lesson, because `hasNext` is positional. That is harmless, and the Learn screen's path-done card is where the learner is sent next. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-29 (scheduled dev-agent; free pick, the UI strings that describe review's behavior, checked against `src/lib/review.js`) — Review's "You're all caught up" card no longer says questions "come back here a day or two after you answer them". After the first two right answers the gap is 4, 8, then 16 days, as the rail and box chart right below it say. Five languages.

Rules: W-6.2 ok (not a residual; the previous entry left none). W-13.2(a): the case is any learner past their first week of review, and every learner sent to Review by `pathDoneAction`. `npm test` at `2b24c4f`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured, and it partly broke.** Ran `scratchpad/caughtup.mjs` and `caughtup2.mjs` (review.js's own `recordAnswer`/`dueQuestions`) on simulated learners: one lesson a day or every 3 days, visits every 1/2/3/7 days, 0/10/20% wrong. **What held up against the card:** the *soonest* return was ≤2 days on every caught-up day of all 15 patterns. A learner who reads the card as "come back in a day or two" has never been sent back too late. **What broke:** 66–87% of a learner's answered questions are more than 2 days out on an average caught-up day (77–87% once the path is done). The weekly visitor answers 15 questions, all in box 5, and the card says they return "a day or two after you answer them". They return in 16. So the defect is how the card describes spacing, which is what the rail below exists to teach. It is not an instruction to come back. **Control:** one right answer → due in 1 day, a second → 2. The card was true for the first two answers, which is why a fresh-storage walkthrough never shows the problem. **Instrument check:** soonest stayed ≤2 days even for the all-box-5 weekly visitor, which looked wrong. A dump showed questions answered two visits earlier sitting 16−14 = 2 days from due, so the instrument was right.

#### What shipped (5 files)
`src/locales/{en,es,ko,zh,ja}.js`: `reviewEmptyBody` only. en now reads "A question comes back here a day after you first answer it, then at wider gaps as you keep getting it right." A first answer, right or wrong, lands in box 1 (+1 day). It carries no number, so it can't drift from `BOX_INTERVALS`. Each edit asserted old 1→0, new 0→1, then read in the diff. `Practice.jsx:542` still quotes the old string as a dated 10-18 measurement. Left as written.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Build | `build-out-of-tree.sh` exit 0, `index-CbTJsIhX.js` → `index-CTXP7WIo.js`. New en string in 1 asset, old in 0, new zh in 1 |
| Live, `dist/` served statically (real asset 200, bogus `.js` 404) | 375px, seeded state with boxes 1/4/5 and nothing due, all 5 languages through the real picker. Each renders its new body under its own caught-up title, none of the 5 old strings is on the page, `scrollWidth` 375 |

**Step 5:** this says what the scheduler does: box 1 is +1 for any first answer, and right answers move up the boxes. Nothing in DECISIONS.md applies. No §10.1/§10.2/§10.3 or date exposure, and `check-blindspot` passes. The 10-28 runs changed `howReviewStep3`, a different key; this undoes none of it. **No conflict found.** Not narrowed: "wider gaps" stops widening at 16 days, the same plateau the 10-28 entry accepted. Under W-9.4, the es/ko/zh/ja strings are owed a second read in a later run.

**Seen, not fixed:** none. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` (asOf 10-28) aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-28 (scheduled dev-agent; the second read of `howReviewStep3` that `0909c73` left owed) — en, zh and ja hold. es did not: after two imperative headings, "Pregunta cada vez menos" reads first as "Ask less and less!", an order to the learner. It now says "La verás cada vez menos" ("you'll see it less and less"). The scheduler's comment no longer says items "stop taking up attention".

Rules: W-9.4 ok (the previous run called itself a code-vs-copy fix, and the run before it was the log); W-13.2(a): every Spanish learner who opens Review reads the rail. `npm test` was not re-run before editing; the previous entry reports exit 0 / 0 FAIL / 1 WARN (O-3's) for this tree.

**Step 3.5: the premise, measured.** The claim under re-read was that each new heading says the question comes back less often and never says it goes away. Steps 1 and 2 checked against `src/lib/review.js` too: `BOX_INTERVALS` = [1, 2, 4, 8, 16], a wrong answer → box 1, due +1 day, and `dueQuestions` drops never-answered ids. Both bodies hold. en "It asks less often", zh 它问得越来越少 and ja だんだん出番が減る each carry a subject (It / 它 / 出番が), so none reads as an instruction. **es has no subject.** Its steps 1 and 2 are tú imperatives ("Responde…", and "Respóndela", whose enclitic *-la* only an imperative takes here). For a regular -ar verb, the tú imperative is spelled like the 3rd-person present, so *pregunta* is both "it asks" and "ask!". The rail's parallel structure picks the second reading. The old "Deja de preguntar" had the same flaw ("Stop asking!"), so `0909c73` kept a defect rather than adding one. **Control:** ko 점점 덜 물어봅니다 is a declarative ending (the imperative is 물어보세요) and stays unchanged.

#### What shipped (2 files)
- `src/locales/es.js`: `howReviewStep3` only. "La verás" is 2nd-person future and can't be an imperative. *La* is the question, as in step 2's "Respóndela". "cada vez menos" keeps the meaning of the line it replaces and the body's own wording. The edit was asserted at 1 match before and after.
- `src/lib/review.js`: comment only. Items "take up less attention". Nothing retires, so the copy must not say a question stops being asked. The old wording ("stop taking up attention") is where the false heading came from.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Build | `build-out-of-tree.sh` exit 0, `index-DLlYCVIA.js` → `index-CbTJsIhX.js`; new es string in 1 asset, old es string in 0, en/zh strings in 1 each (control) |
| Live, `dist/` served statically (bogus `.js` → 404, real asset → 200) | Review via the real language picker, all 5 languages: step 3 reads "It asks less often", 점점 덜 물어봅니다, 它问得越来越少, だんだん出番が減る, "La verás cada vez menos". The old es string is on no page |

**Step 5:** the scheduler is unchanged, and the copy still matches it. No §10.1/§10.2/§10.3 exposure: this is a future-tense description, not an instruction, and `check-blindspot` passes. No date. Nothing in DECISIONS.md applies. This finishes `0909c73`'s owed read rather than redoing it. **No conflict found.** Not narrowed: "cada vez menos", like ko's 점점 덜, plateaus once the 16-day box is reached. Under W-13.2(a), a plateau after a month is not a case that misleads a learner. Staged count asserted = 3.

**Seen, not fixed:** none. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-28 (scheduled dev-agent; free pick, a live first-session walkthrough at 375px, since the backlog holds only parked, owner-held or exhausted items) — Review's "How review works" rail no longer says a question "stops asking". The scheduler never retires one: past box 5 it comes back every 16 days. Four languages; ko already said "asks less and less".

Rules: W-6.2 ok (not a residual); W-9.4 ok (a code-vs-copy mismatch, not a translated-surface hand read; the previous two runs were tooling and log). W-13.2(a): every learner who keeps answering right meets it. `npm test` at `480ac7b`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Learner-visible failure:** the third step of the rail, under the 16d box, promised the question goes away. It keeps arriving every 16 days, forever.

**Step 3.5: the premise, measured** (`scratchpad/leitner.mjs`, `src/lib/review.js`'s own `recordAnswer`/`dueQuestions`). Answered right every time it is due, one question is asked **29 times in 400 days**, the last four 16 days apart, final `box 5`. **Control:** one wrong answer gives `box 1`, due the next day, as step 2 says. Per language: en "It stops asking", es "Deja de preguntar", zh 它会渐渐不再问你 and ja だんだん出なくなる each say it goes away. ko 점점 덜 물어봅니다 says it asks less and less, which is true. The body line ("takes less and less of your attention") is true and is unchanged.

#### What shipped (4 files)
`src/locales/{en,es,zh,ja}.js`: `howReviewStep3` only. Now "It asks less often", "Pregunta cada vez menos", 它问得越来越少, だんだん出番が減る (the last echoes its own body's 出番が減ります). Each edit asserted 1 match before and after.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Build | `build-out-of-tree.sh` exit 0, `index-BF1c2WQv.js` → `index-DLlYCVIA.js`; new en string in it, old en string in 0 assets |
| Live, `dist/` served statically (bogus `.js` → 404, real asset → 200) | Review at 375px, all 5 languages via the real picker: each renders only its new heading and none of the 4 old ones. ko's unchanged string is found (positive control). Per-language text lengths all differ |
| Deploy | before the edit, `check-deployed --identify`: live = HEAD `480ac7b`, byte-identical, market.json asOf 10-27. W-13.5's "Sectors dark 10-28" did not happen |

**Step 5:** the scheduler is unchanged: the copy now matches it, and nothing in DECISIONS.md says questions retire. No §10.1/§10.2/§10.3 or date exposure; `check-blindspot` passes. No prior entry or archived item touched `howReviewStep3`. **No conflict found.** Staged count asserted = 5. The four translated headings are owed a second read in a later run, per W-13.1's precedent.

**Seen, not fixed:** none. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-28 (scheduled dev-agent; open item 143, since the previous entry left no residual) — item 143 closed on corrected facts. The 4 British spellings it named had been archived, and 2 it never named were live in item 76: `tokeniser` and `capitalised-phrase`. Both fixed, and §59's header no longer cites a line number that had rotted. No `src/` change.

Rules: W-6.2 ok (open item, not a residual); W-9.4 / W-13.2 n/a (no content). `npm test` was not re-run before editing; the previous entry reports exit 0 / 0 FAIL / 1 WARN (O-3's) for this tree.

**Step 3.5: the premise, measured** (`scratchpad/brit-log.mjs`: `us-english.mjs`'s own `scan()`, line by line over `AGENT_LOG.md`). **Control:** a planted line fires on all 4 words, and its US twin returns 0. **Result:** 6 hit lines. 4 are mentions: the marked quote at `:1492` and item 143's own 3 lines. The other 2 are uses, both in item 76: `tokeniser`, and `capitalised-phrase`, where the code's rule is `capitalized-phrase`. None of the 4 the item named is in the live log any more. The archive keeps them verbatim, and dated records are exempt. The item's `a11y-sweep.js:525` now sits at `:732`, and §59's header in `check-data.mjs` cited the same stale line.

#### What shipped (2 files)
- `AGENT_LOG.md`: item 76's 2 words in US spelling. Item 143 marked DONE, with the correction, above its original text.
- `scripts/check-data.mjs`: comment only. §59's header names `a11y-sweep.js` with no line number, and no longer says 4 British spellings are left in the log.

#### Verification
| check | result |
|---|---|
| Re-scan | 5 hit lines, all mentions (`:1492` plus item 143's quoted forms) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN; §59 passes over the edited comment block |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js` (unchanged) |

**Step 5:** I made no blind replace. The 22 mentions and the archive are untouched, and §59's scope is unchanged. "Exactly one live instance" still holds: `scripts/` has one other "centre", in §59's own probe data. No learner-visible, §10.x, date or DECISIONS.md exposure. **No conflict found.** Staged count asserted = 2.

**Seen, not fixed:** none. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-28 (scheduled dev-agent; the previous entry's "Seen, not fixed", ko 매수하세요) — `check-blindspot` now catches the bare imperative "Buy stocks now." in all five languages. The gap was not Korean-only, as filed: no language had an imperative class, so the plainest advice sentence there is passed §10.1 everywhere. No content change.

Rules: W-6.2 ok (first residual pick in this chain); W-9.4 n/a (tooling); W-13.2(c) n/a (no content sentence). `npm test` at `fb6cac5`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Learner-visible failure (W-6.2 rule 3):** a lesson line "Buy stocks now." (or 지금 주식을 매수하세요, 现在就买入股票, 今すぐ株を買いましょう, Compre acciones ahora) would have shipped with §10.1 green.

**Step 3.5: the premise, measured** (`scratchpad/probe-blindspot.mjs`, HEAD's patterns). The note named ko 매수하세요/사세요 only. The control "You should buy stocks now." and 매수해야 합니다 are CAUGHT. All 20 imperatives probed, 4 per language, pass. **Premise corrected: a class gap, not a ko gap.** A broad scan of the 38 scanned files (`imp-scan.mjs`; its regexes fire on planted probes) found 0 en/ko/ja imperatives, 79 es hits (the noun *la compra*), and 1 zh hit, kidsContent's 而不是现在就买个更小的 ("rather than buying a smaller [toy] now"). So a bare-verb pattern would fail the build on shipped kids copy.

#### What shipped (1 file, no `src/` change)
- `scripts/check-blindspot.mjs`: a new `imperative` class with 5 patterns, one per language, held in `IMPERATIVE_ADVICE` and checked by the existing `fires` control. Each needs three things in one clause: an imperative buy/sell/invest, a **named asset**, and an **urgency word**. The asset keeps a quoted ad ("Buy now!") and 필요한 것만 사세요 clean. The urgency word keeps a how-to step ("Buy shares through your broker's app.") clean. en/es need the verb to open the clause. zh needs the clause start or a 你/您/请 subject, so 恐慌的投资者立即卖出股票 stays clean. The kids zh sentence joins `LIVE_MUST_STAY_CLEAN` (3 → 4). Advice patterns go 34 → 39; `fires`-checked patterns go 14 → 19, with 26 sentences.

#### Verification
| check | result |
|---|---|
| Candidate test (`imp-cand2.mjs`) | 26/26 `fires` match; 18 must-stay-clean sentences (ad quotes, consumption advice, descriptive selling, お金, the kids zh line) stay clean; corpus 0 hits |
| End-to-end plant | one imperative per language prefixed to `lessonContent.money.{en,es,ko,zh,ja}.js:33`'s body: HEAD's script **PASS**, new script **FAIL** on all 5 lines. Restored from scratchpad copies (`cmp` equal ×5, `git status` shows only the script) |
| Clean corpus | `check-blindspot` exit 0; the timing control reports 19 patterns firing, 4 shipped sentences clean against 39 |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js` (unchanged) |

#### Step 5: adversarial self-check
- **False positives:** 0 corpus hits. A future quoted impulse, e.g. *your gut says "Sell stocks now!"*, would fail loudly. The author would need to reword it or add a must-stay-clean line. That is the same trade the directive class made with 팔아야 합니다. Without urgency, 주식을 매수하세요 still passes: a deliberate narrowing, so procedural copy stays clean.
- **Prior work:** the timing/directive classes and their 2026-10-21/25/27 widenings are untouched; every old `fires` sentence still matches. **§10.1/§10.2/§10.3, dates, DECISIONS.md:** tooling only. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** none. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-27 (scheduled dev-agent; the 10-25 entry's "Seen, not fixed", ko 사야만) — `check-blindspot` now catches Korean "should buy" in its everyday forms. 매수해야 합니다, the Sino-Korean form and zh 买入's counterpart, passed §10.1, as did 매도/구매/구입, the honorific 사셔야 and the polite 해요. No content change.

Rules: W-6.2 ok (a two-day-old note, not the previous run's residual); W-9.4 n/a (tooling). `npm test` at `46d0161`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Learner-visible failure (W-6.2 rule 3):** a Korean lesson telling the reader 지금 주식을 매수해야 합니다 ("you must buy stocks now") would have shipped with §10.1 green.

**Step 3.5: the premise, measured** (`scratchpad/ko-probe.mjs`). The filed note named only 사야만, a rare form. Against HEAD's ko regex, 사야 합니다 fires (control) and all 8 others pass: 매수해야, 매도해야, 구매해야, 구입해야, 사야만, 사셔야, 매수하셔야, 투자하셔야. **Wider than filed:** the 10-21 widening added account verbs but never the Sino-Korean buy/sell. A corpus scan of the 39 files under `src/content`, `src/locales` and `index.html` (a superset of the check's 38) for every conjugation of these verbs + 야 + an ending finds 2 hits, both 한다 forms (팔아야 한다는 압박, 팔아야 할 경우), which the 합니다/해요 ending keeps out.

#### What shipped (1 file, no `src/` change)
- `scripts/check-blindspot.mjs`: the ko directive pattern is a superset of the old one. It adds the 하다 verbs 매수/매도/구매/구입, honorific 셔 forms for every verb (파셔, 여셔, 옮기셔…), optional 만, and the 해요 ending. 한다 stays out. `fires` grows from 2 to 9 sentences, all checked by the existing timing control.

#### Verification
| check | result |
|---|---|
| End-to-end plant | 지금 주식을 매수해야 합니다. appended to the 압박이 생깁니다 line of `lessonContent.money.ko.js`: HEAD's script **PASS**, new script **FAIL** at `:93`. Restored from a scratchpad copy (`cmp` equal, `git diff` clean) |
| Clean corpus | `check-blindspot` exit 0; the timing control passes, with all 9 ko `fires` matching and the 3 must-stay-clean lines clean against 34 patterns |
| `npm test` after | exit 0, 0 FAIL, 1 WARN. Output identical to the baseline |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js` (unchanged) |

#### Step 5: adversarial self-check
- **False positives:** 0 corpus hits. A future descriptive "만기 전에 매도해야 합니다" would fail loudly, the trade the existing 팔아야 합니다 already made. A bare `사` before 야 can't reach 검사해야 (해 sits between).
- **Prior work:** every old form still matches (사, 팔아, 투자해, 열어, 개설해, 넣어, 옮겨 + 야). The 10-25 and 10-21 widenings are untouched. **§10.1/§10.2/§10.3, dates, DECISIONS.md:** tooling only. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** the imperative 매수하세요 / 사세요 still passes. 사세요 is plausible money-track consumption advice ("buy only what you need"), so it needs its own corpus read. Low priority, not numbered (W-6.2 rule 2). `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-27 (scheduled dev-agent; the QE/QT notes' second read, owed under W-9.4 by `d9d315d`) — the notes hold. An independent source reproduces both QT figures, and the four translations read true and match their siblings. No content change.

Rules: W-9.4 ok (the previous two runs, `b814d6c` and `b7c41f1`, were tooling); W-6.2 ok (named item). `npm test` at `b7c41f1`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Measured** (`scratchpad/qt2.mjs`, Tiingo SPY; run 1 used Yahoo `^GSPC`): price **+17.9%** (2017-10-02 → 2019-07-31) and **+66.8%** (2022-06-01 → 2025-11-28), against run 1's +18.3 / +67.0. The minimum under ±1-month endpoint shifts is +13.7 / +64.9% (run 1: +13.5 / +65.1). **Controls:** a bad ticker → 404; SPY 2022-10-12 = 356.56, the known low; 2022-01 → 10-12 comes out −25.4%. "Both" still holds: FRED `WALCL` has risen since 2025-12 with no third runoff (a bad id → 404).

**Read by hand, all four:** each opener is the Stocks card's own label (`markets.js:408-411`), and each clause has the form of the settled hiking-cycle siblings. es keeps *el Fed*, as do all 56 Fed mentions in `src/` (0 *la Fed*). It ranks no asset against another (W-13.1's rule). Nothing misleads in a common case (W-13.2(a)), so I left it.

**Build:** `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js` (unchanged).

**Step 5:** log-only. No `src/` edit means no §10.1/§10.2/§10.3, date or DECISIONS.md exposure. Run 1's change is kept, not undone. **No conflict found.** Staged count asserted = 1.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-27 (scheduled dev-agent; open item 120, the sibling of the previous run's item 149) — the storage audit now tests a second warm store, and on its first run it caught a state the one-point audit had called "provably storage-independent": `reference-glossary-term`, which now declares `NO_BOOKMARKS`. No `src/` change.

Rules: W-6.2 ok (the previous entry left no residual). W-9.4 still bars the QE/QT second read this run; it is owed next run. `npm test` before any edit (HEAD `b814d6c`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** All open items are low priority, and 117(a) is the owner's call. 120 is the one with a named blind spot in a live instrument.

**Step 3.5: the premise, measured.** Holds as filed: both `requires` predicates (COLD, NO_BOOKMARKS) assert emptiness, the audit has one `WARM_FIXTURE`, and there are 12 no-reload states. Live, cold vs A reproduced 08-26 exactly: 12 states, 4 vary, 8 independent, 0 gaps. **Sharper than filed:** the blind spot is not only magnitude but *which* value. A bookmarked only "Inflation", while `reference-glossary-term` opens row 0, "401(k)" in en.

#### What shipped (2 files, no `src/` change)
- `scripts/a11y-states.js`: `WARM_FIXTURE_B` has the same 9 keys with different values where the key's shape allows (44 lessons, a 30-day streak, 20 due cards, other bookmarks). The 3 boolean flags can't differ, and `FIXTURE_SAME_IN_BOTH` names them. `auditWarmBegin()`/`auditWarmFinish()` diff A against B. Controls: A vs A must be byte-identical, B must prove it applied, and every declared state must vary A vs B. A state that admits both stores and renders two screens is **TOO COARSE**. `fixtureHolds` takes the fixture (analytics marker quoted). `reference-glossary-term` gets `requires: NO_BOOKMARKS`, and A adds "401(k)" so the cold audit reaches that row.
- `scripts/check-data.mjs` §48(e): both fixtures must set the same keys. A key that B lacks keeps A's value and reads "same screen".

#### Verification
| check | result |
|---|---|
| Finding (pre-fix file, A = ["Inflation"], B with "401(k)") | A vs B: **1 TOO COARSE**, `reference-glossary-term`. The toggle reads `aria-pressed="false"` at A and `"true"` at B, and at B the state MISSED, since the label is "401(k), Saved". Positive control PASS |
| Fixed file, live | runAll cold: 12 reached, 0 missed, 0 precondition. Cold vs A: **5 vary, 7 independent, 0 gaps, 0 over-declared**, positive PASS. The glossary-term delta is the same `aria-pressed` flip. A vs B: stability PASS, 9/9 applied, **0 too coarse of 7 admitting both**, positive PASS (all 5 declared vary) |
| §48(e) control | planted B without `ecycles_seen_practice_coachmark` → `check-data` **exit 1** naming it (A only). Restored from a scratchpad copy (`cmp` equal) → exit 0 |
| `npm test` after | exit 0, 0 FAIL, 1 WARN. Diffs: the §48 line (+ "the warm-vs-warm fixture sets the same 9") and §59's block count, 1774 → 1781 |
| Build | no `src/` change; `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js` (unchanged). The served copy differs from the committed file only in header comments |

#### Step 5: adversarial self-check
- **Was this a shipped lying zero?** No. On a store with row 0 saved, the state MISSED, which is honest. The false claim was the audit's "provably storage-independent". It now reports PRECONDITION and quotes the store.
- **Over-declaration:** NO_BOOKMARKS is one key wider than the screen needs (a saved "Inflation" alone changes nothing). The parent state makes the same trade. Cold runAll is unaffected.
- **Limits:** the audit runs in en, so the fixture's reach of row 0 is en-specific. The declaration is key-level and holds in every language. Two warm points are still two points.
- **Prior work:** 119's audit verdicts, 149's `expects`, `requires` refusals and the ledger are untouched; selftest PASS. **§10.1/§10.2/§10.3, dates, DECISIONS.md:** tooling only. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 3.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the check that decides which test screens depend on a learner's saved data had tested only one sample of saved data. It now tests two, and the second sample found one screen it had wrongly cleared.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-27 (scheduled dev-agent; open item 149, per W-12.2 now that W-13.2 has retired the content sweep) — the a11y coverage claim can now tell "nothing to check here" from "should have fired and didn't". States declare which conditional probes they expect (`expects`), and `coverage()` holds them to it both ways. No `src/` change.

Rules: W-6.2 ok (the previous entry left no residual); W-9.4 bars the QE/QT second read this run and next, so it is not taken. `npm test` before any edit (HEAD `9fe1796`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** W-13.2 says the sweep has covered the corpus, and the 10-26 runs swept the last unswept surfaces. 117(a) is the owner's call. Of the open low-priority items, 149 is the only one with a known lying-zero shape behind it.

**Step 3.5: the premise, measured** (built `dist/` served statically; both selftests PASS; all 19 states swept, 12 via `runAll()` and 7 via `begin/finish` with the Tab step, en, 1024px). `partialProbes` came back exactly as filed: `imagesWithoutAlt` and `figureClaims` were VACUOUS on 16 of 19 states and `unnamedRegions` on 14 (no-reload set: 11/11/9, the 08-29 figures). **Correction:** the live states are reference-markets, lesson-unfinished and lesson-midquiz (figures), plus learn, learn-collapsed, practice-landing and both lesson states (regions). That is **6 states**, not "roughly four".

#### What shipped (1 source file, no `src/` change)
- `scripts/a11y-states.js`: `CONDITIONAL_PROBES` (those three) and per-state `expects` on the 6 states. In `coverage()`: declared + VACUOUS → `partialProbes`, tagged "declared live"; undeclared + live → `declarationMismatches`, and the verdict refuses with "DECLARATION MISMATCH"; undeclared + VACUOUS → `honestlyEmpty`. UNAVAILABLE stays a gap everywhere, as before, and so does any non-conditional probe. An `expects` that names a non-conditional or unreported probe is a mismatch.
- `selftest()`: a two-sided control on the pair item 149 named. reference-markets (declares `figureClaims`) and the first undeclared state are each planted with the probe live and VACUOUS, all four outcomes must be right, and the ledger is restored.

#### Verification
| check | result |
|---|---|
| Negative control | same file with the 6 `expects` stripped: selftest **FAIL** (`probeDeclarations.ran: false`); `coverage()` over the 19 rows → **DECLARATION MISMATCH (11)**, exactly 3+3+5 |
| Real file | selftest PASS (4/4 declaration cases). Over 19 rows: 0 mismatches, 0 `partialProbes`, honestlyEmpty 16/16/14. Verdict: "All probes ran on every state they apply to" |
| Fresh sweep | cleared storage, Tab, `runAll()`: 12 reached, 0 missed, 0 precondition; coverage unchanged |
| Live gap plant | removed the 12 figure/img nodes from `main` just before `run('reference-markets')`: row still `status: ok`, and coverage names it the **only** gap, for 2 probes. Re-swept unplanted → 6 figures, 0 gaps |
| `npm test` after | exit 0, 0 FAIL; the only diff is §59's comment-block count, 1772 → 1774. §48 still reads 19 states |
| Build | no `src/` change; HEAD's `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js` |

#### Step 5: adversarial self-check
- **Can the exemption hide a regression?** On a declared state, no: the plant shows it. **Limit:** a *new* state added without `expects` treats an empty conditional probe as honest. Before, that VACUOUS sat among 11 identical ones, so it was just as invisible. The undeclared-live branch catches the reverse.
- **Prior work:** `requires`, the axis refusals, ledger dedupe and the MIXED AXES / not-swept ordering are untouched (the original ledger control still passes). `sweepLangs()` still records nothing. Items 112/118/119/140 not undone.
- **§10.1/§10.2/§10.3, dates, DECISIONS.md:** tooling only, no learner-visible text. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the accessibility sweep's summary used to warn "3 probes did not run on every state" every time, so it couldn't flag a real lost figure. Now it warns only when a screen that should have figures comes back without them.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-26 (scheduled dev-agent; free pick, W-13.2 sweep of the UI strings in `src/locales/en.js`, a surface never swept) — the Market Dashboard's QE/QT notes now open "On paper:", and the QT note adds "yet stocks ended both QT rounds higher". It said "→ stocks ↓" while the S&P 500 rose through both runoffs, +18% and +67%. Five languages.

Rules: W-6.2 ok (free pick, not a residual). W-9.4: an English-sourced, measured content fix, not a hand read of a translated surface. Flagged anyway, because the 06:03 run was one; a second read of the four translations is owed by a run that is not one of the next two. `npm test` before any edit (HEAD `1fe1565`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**The sweep.** I read all 48 strings of 6+ words. `relativeStrengthNote` matches `relativeStrength.js` (10/30/60 trading days, excess returns summed). A JSX hardcoded-text scan found 0 real hits; a planted probe file fired 2/2. The one finding is `qeNarrative`/`qtNarrative`. The 2026-09 fix corrected only their first segment, and nothing after the first `→` had ever been measured.

**Step 3.5: the premise, measured** (`scratchpad/qeqt.mjs`, `robust.mjs`; FRED `WALCL`/`DGS10`/`DTWEXBGS`, Yahoo `^GSPC`). **QT, stocks:** runoff 2017-10 → 2019-07 **+18.3%**, 2022-06 → 2025-11 **+67.0%**. Both stay positive under every ±1-month endpoint shift (min +13.5 / +65.1%), and also over WALCL's own peak-to-trough windows. **QE, yields:** the 10-year ended all four rounds higher (+0.51 to +1.00 pp), but under shifted endpoints the sign flips (min −0.21 pp). That fails W-13.1's "simple true statement" test, so QE gets the label and no clause. **Controls:** bad ids → 404 on both sources; `^GSPC` 2022-03-16 = 4357.86 and DGS10 2020-03-09 = 0.54 match known values; 2019's 10y (−1.16 pp) and 2022's S&P (−20.0%) come out negative. **W-13.2(a):** the most recent QT is the case a learner is most likely to check, and the arrow says the opposite of what happened.

#### What shipped
- `src/locales/{en,es,ko,zh,ja}.js`: both notes open with the app's existing "on paper" wording from the Stocks card (es *Sobre el papel*, ko 이론상, zh 按道理, ja 理屈の上では). The QT note's ending reuses the siblings' "ended … higher" phrasing (es *aun así, las acciones terminaron más altas en las dos rondas de QT*; ko 그래도 주가는 두 번의 QT 모두 시작 때보다 높게 끝남; zh 但两轮QT结束时，股市都高于起点; ja それでも2回のQTでは、株価はいずれも開始時より高く終わった). Arrows unchanged. `scratchpad/edit.mjs` asserted old ×1 and new ×0 → ×1, exact length deltas, no U+FFFD. All five hand-read in the word diff. A 6-line measurement comment sits above the en strings.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN. WARN/§65/§67/§2.3 lines `diff`-identical; only §52/§59's line and block counts move (the comment) |
| Guard sees the field | planted *"You should buy stocks now."* in en `qtNarrative` → `check-blindspot` **exit 1** at `en.js:131`. Restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BF1c2WQv.js`, system Node v24.18.0 |
| Bundle | each of the 6 new strings is in 1 asset; the old en opener `"Fed LETS bonds mature` in 0; the unchanged "Money Supply (M0, M1, M2)" in 1 (control); nonsense in 0 |
| Live | `dist/` served statically, Reference › Market Dashboard: en and zh read back as written. The "Key Principles" heading control was MISSING on the first read (a welcome dialog), so that read counted for nothing; present on the second |

#### Step 5: adversarial self-check
- **§10.1:** could "yet stocks ended both QT rounds higher" read as "hold stocks through QT"? It ranks nothing and names no action. It has the same form as the Stocks card W-13.1 settled. The guard plant fired. Diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20|kid|child` → 0 on added lines.
- **Dates/staleness:** no current date or live figure. "Both" stays true only until a third QT starts. WALCL bottomed 2025-12-03 and has risen since, so QT2 is over. The comment names the windows.
- **Prior work / decisions:** the 2026-09 first-segment fix ("LETS bonds mature" in all five) is kept verbatim. DECISIONS.md mentions QE/QT only as lesson scope. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 6.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the dashboard's QT note said quantitative tightening sends stocks down, but stocks rose through both QT rounds. Both QE/QT notes are now labeled as theory, and the QT note says what happened.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-26 (scheduled dev-agent; the 10-25 L7 entry's "Seen, not fixed", essentials L8 §3) — the insurance lesson's list of uninsurable losses now says "one that's already happened (a house that has already burned down)", not "something that's already happened", which a reader with a known illness could take to mean them. Five languages.

Rules: W-6.2 ok (a candidate from three runs back; neither of the previous two runs was a residual); W-9.4 n/a (a lesson-body clause, not a short-string hand read). `npm test` before any edit (HEAD `2142726`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**W-13.2, weighed.** (c) says not to start a chain from a sentence that is already true, and this one is literally true of a loss. (a) allows a narrowing when a real, common case misleads. That case is here: the clause comes one paragraph after "many countries make health insurance compulsory" and "applications… ask about health history", so "something that's already happened" reads in a health context. A learner with a chronic condition can take it to mean insurance can't cover them "at all". I judged (a) to apply. This entry opens no residual.

**Step 3.5: the premise, measured** (curl, tags stripped in Node, `scratchpad/grepsrc.mjs`). KFF: **"27% of adult Americans under the age of 65"** have a condition that would have been declinable before the ACA. HealthCare.gov: Marketplace plans **"can't deny you coverage or raise your rates based only on your health"**. **Control:** a nonsense phrase → NO MATCH on both pages. **Held:** the misreading would hit roughly 1 in 4 US adults under 65, and it's false for the plans they'd most likely buy. Nothing else in `src/` mentions pre-existing conditions (grep; the control term "adverse selection" is found).

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js` L8 §3, last paragraph: es *una pérdida que ya ocurrió (una casa que ya se quemó)*; ko *이미 발생한 손실(이미 불타 버린 집 등)*; zh *已经发生的损失（比如已经烧毁的房子）*; ja *すでに起きた損失（すでに焼けてしまった家など）*. No law and no figure is added (W-12.2): "loss" plus a concrete example points the clause at past damage. `scratchpad/l8.mjs` asserted old ×1 → ×0 and new ×0 → ×1 per file, an exact length delta, and no U+FFFD. I hand-read all five strings in the word diff.
- Ledger: L8 es/ko/zh/ja went **stale** (4/4, the control), then I re-marked them `ai`. `readiness --write` regenerated LAUNCH_READINESS §4.3/§10.4 and LAUNCH_PLAN §4.0 (+33 English chars; ~29,400 → ~29,500 words is rounding).

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN. WARN/§65/§67/§2.3 lines `diff`-identical. The only diffs are word count, §33 chars and §79's bracket counts (+2 ja/zh, the new parentheses) |
| Guard sees the clause | planted *"You should buy a house now."* after the example → `check-blindspot` **exit 1** at `essentials.en.js:164`. Restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-LIO2Ek0I.js`, system Node v24.18.0 |
| Bundle | each of the 5 new strings is in 1 asset. The old en clause is in 0, the unchanged next sentence is in 1 (control), and nonsense is in 0 |

#### Step 5: adversarial self-check
- **Does it actually fix the misreading?** Mostly, not airtight: "loss" plus a burned house points at damage already incurred. Saying outright that future bills for a known illness can be covered would add a claim that isn't universal (life insurance still underwrites), so I left it out.
- **§10.1/§10.2/§10.3, dates:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20|kid|child` → 0 on added lines. The guard plant fired. No date or live figure.
- **Prior work / decisions:** L8's adverse-selection text and the 10-25 L7 fixes are untouched. `.js` content unchanged in kind. W-13.6(iii): +33 chars on 168,197 (+0.02%). **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 9.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the insurance lesson said insurance can't cover "something that's already happened", which someone with a chronic illness could read as "you can't be insured". It now says a loss that's already happened, like a house that has already burned down.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-26 (scheduled dev-agent; W-13.1's second read under W-9.4) — the Stocks card note holds. An independent source reproduces "4 of the last 5 higher", so W-13.1 is resolved. No content change.

Rules: W-9.4 ok (`c7f4164` is three runs back); W-6.2 ok (named item). `npm test` at `86a5db6`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Measured** (`scratchpad/cyc.mjs`): Yahoo `^GSPC` close, first hike → last: **+0.1 / +6.8 / +11.6 / +20.9 / +4.8%**, against Tiingo SPY price +0.2 / +7.1 / +11.1 / +20.8 / +4.6% (total return +2.9 / +7.9 / +15.4 / +28.2 / +7.1%). **Controls:** a bad ticker → 404 on both sources, and `^GSPC` 2022-03-16 = 4357.86 matches FRED `SP500`. 1994-95 ended about flat (+0.1%), so "4 of 5 higher" is the conservative count, and `ratePrinciples[4]` on the same screen says "about flat".

**Read by hand, all five:** true, and it ranks no style or asset against another (W-13.1's rule). "Yet stocks" reads as the card's own subject. zh 「有四轮股市结束时高于起点」 is looser than the real-estate sibling's word order. But 股市结束 isn't a phrase a reader would pick over the plain parse, so it isn't a misreading in a common case (W-13.2(a)), and I left it.

**Build:** `build-out-of-tree.sh --no-copy-back` exit 0, `index-V7bjfKrV.js` (unchanged).

**Step 5:** log-only. No `src/` edit means no §10.1/§10.2/§10.3, date or DECISIONS.md exposure. Run 1's change is kept, not undone. **No conflict found.** Staged count asserted = 1.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-26 (scheduled dev-agent; W-13.2 sweep of the least recently edited content) — clean. The policy simulator, the economic-signal and sector descriptions, and the yield-curve labels hold up when measured. No content change.

Rules: W-6.2 ok (free pick); W-9.4 bars W-13.1's second read here (`c7f4164` is one of the previous two runs), so it goes to the next run. `npm test` at `87e986f`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**What I read:** the content files untouched longest: `economicSignals.js` and `sectors.js` (09-29), `moneyVisuals.js` (10-12, scanned for always/never/every/only), `policyScenarios.js` (10-13), and the curve labels in `MarketSignals.jsx`. Spot checks: $1,000 at 6% over 30 years gives $5,743 compound vs $2,800 simple (2.05×, "more than double" ✓). Rates near zero Dec 2008 → Dec 2015 ✓.

**The one measured candidate, "Steep (Recovery)":** FRED `T10Y2YM` (1976-06 → 2026-09) against `USREC`. Of 84 months with a spread ≥ 2.0 pp, **56 fell within 24 months of a trough**, against a base rate of 142/604 (24%). At ≥ 2.5 pp it's 21 of 24. Five recessions since 1977 had a monthly inversion in the prior 24 months, and 2020 had none. One inversion, 2022-07 → 2024-08, had no recession after it. The economic-signals text already says so. **Control:** a bad series id → 404, and the known 2006-07 inversion before the 2008 peak is found. Both labels mislead in no common case, so per W-13.2(a) I didn't touch them.

**Build:** `build-out-of-tree.sh --no-copy-back` exit 0, `index-V7bjfKrV.js` (unchanged).

**Step 5:** log-only entry. No `src/` edit, so there's no §10.1/§10.2/§10.3, date or DECISIONS.md exposure, and nothing in "Completed and pruned" is redone. **No conflict found.** Staged count asserted = 1.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-25 (scheduled dev-agent; the previous entry's "Seen, not fixed", the §10.1 directive gap) — `check-blindspot` now catches "you should <adverb> buy": one adverb between the modal and the verb passed in en/es/zh/ja, as did zh 应当 and bare 买, and ja べきだ. No content change.

Rules: W-6.2 ok (one residual of a named pick); W-9.4 n/a (guard fix, not a hand read; W-13.1's second read can't be this run, since its run is one of the previous two). `npm test` before any edit (HEAD `c7f4164`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.** I ran the 5 directive regexes against 19 probes (`scratchpad/probe.mjs`). The 5 known forms fire (control). These 13 pass: *You should now/probably/definitely/really…*, *Deberías ahora/definitivamente…*, 你应该现在/马上/尽快…, 你应当买入, 你应该买股票, 今すぐ株を買うべきだ, 買うべきでしょう, 사야만 합니다. **Held, and wider than reported:** the 10-25 note named zh only.

**Corpus first** (`scratchpad/scan.mjs`, `\n` expanded as the guard does). Free one-word slot en/es: 0 hits. ja `べき` after the listed verbs: 0. zh 应该/应当: 13 contexts, all descriptive. One of them, essentials 应当承担买方中介, is what a free Han gap would flag. ko with plain 한다: 1 hit, money track 팔아야 한다는 압박 ("the pressure to sell"), which is descriptive.

#### What shipped (1 file, no `src/` change)
- `scripts/check-blindspot.mjs` directive class. en/es/zh now take one optional adverb from a closed list (now, really, definitely, consider…; ahora, ya, *-mente*; 现在, 马上, 尽快, 考虑…). zh adds 应当 and bare 买/卖, and ja accepts べきだ/べきでしょう but not 〜だろう or 〜でしょうか. I dropped "first"/先 in self-check: "you should first open an account" describes a procedure, which is the file's reason for leaving out "need to". Korean is unchanged because of the 한다 hit. 11 new `fires` samples, and the zh essentials sentence is a third live must-stay-clean control. A dated comment says why.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN; FAIL/WARN/§65/§67/§2.3 lines `diff`-identical. Only change: "3 shipped sentence(s)… stay clean" (was 2) |
| Load-bearing | planted 你应该现在买入股票。 (essentials zh) and *"You should now buy stocks."* (essentials en). HEAD's guard → **exit 0**, new guard → **exit 1** on both lines. Restored from scratchpad copies (`cmp` equal) → exit 0 |
| Narrow side | planted *"You should first open a brokerage account."* → exit 0, as intended. Restored, `cmp` equal |
| New control can fire | a free-gap `/应当[一-鿿]{0,4}买/` matches the new clean sentence → true |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-V7bjfKrV.js` (same as the previous run, as expected with no `src/` change) |

#### Step 5: adversarial self-check
- **Over-broad?** Each added adverb makes a directive more pressing, not less, and negations are excluded by construction. The first draft's "first"/先 was the one procedural reading, and it's gone. The corpus is clean.
- **§10.1/§10.2/§10.3, dates:** guard-only change. It widens §10.1, and no content moved.
- **Prior work / decisions:** 10-21's verb list and its "need to" exclusion are kept. Item 164's must-stay-clean pair is unchanged, and 14 patterns still each fire on every sample. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** ko 사야만 합니다 still passes. Adding 한다 would flag shipped copy, so ko needs a different shape, and it's a rare form. W-13.1's second read is still owed, from the run after next. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the advice guard missed "you should now buy stocks" and its translations, because an adverb sat between "should" and "buy". It catches those now, and nothing shipped had them.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-25 (scheduled dev-agent; named item W-13.1) — the Market Dashboard Stocks card no longer tallies growth beating value. It now says stocks ended 4 of the last 5 hiking cycles higher, as the same screen's Principles line does. Five languages.

Rules: W-13.1 named pick (run 1 of 2 under W-9.4); W-6.2 ok (not a residual). `npm test` before any edit (HEAD `f80b967`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.** Tiingo `SPY` daily, first hike → last hike on the 5 cycle dates the gold/home-price/dollar notes use (`scratchpad/spy.mjs`). Price **+0.2 / +7.1 / +11.1 / +20.8 / +4.6%**, total return +2.9 / +7.9 / +15.4 / +28.2 / +7.1%, max drawdown inside each −7.5 / −11.9 / −7.6 / −14.4 / −22.7%. Under all 9 ±1-day endpoint shifts, cycles 2-5 stay positive (min +2.6%). 1994-95 ranges **−2.0 to +0.8%**. **Controls:** a bad ticker → 404. FRED `SP500` (index, independent source) 2022-03-16 → 2023-07-26 = +4.8%, agreeing with SPY's +4.6%. A bad FRED id → 404. **Premise held:** the old clause ranked one style against another, and "stocks ended 4 of 5 higher" is a robust absolute statement.

#### What shipped
- `markets.js` `rateEffects` stocks `note`. en *"On paper growth stocks are hit hardest, yet stocks ended 4 of the last 5 hiking cycles higher"* (93 chars). es *…aun así, las acciones terminaron más altas en 4 de los últimos 5 ciclos de alzas*; ko 「…주가는 최근 다섯 번의 인상 사이클 중 네 번은 시작 때보다 높게 끝남」; zh 「…有四轮股市结束时高于起点」; ja 「…直近5回の利上げ局面のうち4回は、株価が開始時より高く終わった」. The "on paper" clause is unchanged, as W-13.1 asks. The ending reuses each language's real-estate note phrasing. All five read by hand.
- A first draft added "and the other about flat". At 320 px it made the Stocks card the tallest in its row (en 118 px vs Bonds 101, es 168 vs 118), so I cut it. 1994-95's "about flat" is already on the same screen in `ratePrinciples[4]`, and the gold and dollar notes use the same bare "N of the last 5" form.
- A 6-line dated comment records why and the figures. Patchers asserted old ×1 / new ×0, no U+FFFD.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN; FAIL/WARN/§65/§67/§2.3 lines `diff`-identical to before |
| Guard sees the note | en plant *"…You should buy stocks now."* → `check-blindspot` **exit 1** at `markets.js:406`. zh plant with the guard's own sample 你应该买入股票 → **exit 1** at `:410`. Restored from scratchpad copies (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-V7bjfKrV.js`, system Node v24.18.0 |
| Bundle | 5 new probes → 1 asset each. Old en and the dropped draft clause → 0 (old en → 1 in HEAD's `./dist`). Sibling home-price note → 1, nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing asset 404). Reference → Market Dashboard at 320 px, all five via the real select: new ✓, old ✗, doc width 320. Note height/width vs Bonds: en 101/101, zh 67/67, ko and ja 101/84, es 151/118. localStorage cleared, viewport reset, server stopped |

#### Step 5: adversarial self-check
- **W-13.1's own rule:** the note no longer ranks growth against value over a handful of cycles. "Hit hardest" stays as labeled theory, as the review asked. Node scan of `src/` for the old tally in all five languages: only the dated comment (control: the home-price note found). No other short string carries it.
- **True?** "Ended higher" is price-only, nominal, first hike → last hike. It holds under every endpoint shift for the 4 it counts. It is the same claim `ratePrinciples[4]` has made since 09-18, so the screen is now consistent with itself.
- **§10.1/§10.2/§10.3, no date or live figure:** the added-line grep for `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0, and both plants fired. Not kids content. The 2026-10-25 date is in a code comment, and §2.3 passes.
- **Prior work / decisions:** 10-23's measurement comment is kept verbatim, and the gold/real-estate/dollar/bonds/cash notes are untouched. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** `check-blindspot`'s zh directive pattern needs 应该 right before the verb, so 你应该现在买入股票 ("you should now buy stocks") passes. A real guard gap. W-9.4: a second read of this note is owed. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the dashboard's Stocks card said growth stocks "beat value stocks in 4 of the last 5 hiking cycles", which read like a which-style-to-hold rule. It now says what stocks themselves did: they ended 4 of the last 5 hiking cycles higher.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-25 (scheduled dev-agent; residual of the previous entry, essentials L7's heading) — L7 §3's heading no longer says every big refund "is an interest-free loan": about 1 in 4 refunds carries the EITC, which is no loan. It now says "It's Often an Interest-Free Loan". Five languages.

Rules: W-6.2 ok (one residual after a free pick); W-9.4 ok (neither of the previous two runs was a short-string hand read). `npm test` before any edit (HEAD `fee5fca`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** The previous entry left the heading *"A Big Refund Isn't a Gift — It's an Interest-Free Loan"* unqualified, though its body now says part of a refund can be a refundable credit. I also read L8 and L11, which the sweep hadn't reached. L11's figures recompute: $10,000 for 30 years at 6.95% → **$75,060**, at 5.95% → **$56,630**, gap **24.6%** ("roughly a quarter"). L8 had no false clause (see "Seen, not fixed"). So I took the residual.

**Step 3.5: the premise, measured.** IRS 2025 filing-season statistics (week ending Oct. 17, 2025; curl, tags stripped in Node): **102,122,000 refunds, $311.651 billion**, average $3,052. IRS EITC statistics: about **24 million** filers got about **$70 billion** (TY2024). **Control:** a nonsense phrase returned NO MATCH on both pages. **Held, both halves:** the EITC reaches roughly 1 in 4 refunds and about 22% of refund dollars, so the unqualified heading is false for a large minority. Most refunds still carry no EITC, so "often" is true. The refundable Child Tax Credit would raise the share; I didn't measure it, and the claim doesn't need it.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js` L7 §3 heading. en *"A Big Refund Isn't a Gift — It's Often an Interest-Free Loan"*; es *…no es un regalo — a menudo es un préstamo sin intereses*; ko *큰 환급금은 선물이 아니다 — 무이자 대출인 경우가 많다*; zh *大额退税不是礼物——往往是一笔无息贷款*; ja *大きな還付金は贈り物ではなく、多くの場合は無利子の貸付である*. No figure added (W-11.2). `scratchpad/l7h.mjs` asserted old ×1 / new ×0 per file, an exact length delta and no U+FFFD. I hand-read all five strings in the diff.
- Ledger: L7 es/ko/zh/ja went **stale** (4/4, the control). I re-marked them `ai` after the hand read. `readiness --write` found nothing to write. The heading adds 6 English chars.
- Grep for `interest-free`, and its four translations, across `src/`: only the five lesson files. No quiz or glossary quotes the heading.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN. WARN/FAIL/§65/§67 lines `diff`-identical to before. §65 en 28.3 / es 26.1 / ko 28.3 / ja 26.1 / zh 23.9 |
| Guard sees the heading | planted *"You should buy a house now."* in it → `check-blindspot` **exit 1** at `essentials.en.js:145`. Restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-WmpAvO03.js`, system Node v24.18.0 |
| Bundle | each of the 5 new strings is in 1 asset. The old en heading is in 0, the unchanged "Tax Brackets Are Layers" heading is in 1 (control), nonsense is in 0 |
| Live | **not checked.** The bundle probe is the evidence for a heading edit |

#### Step 5: adversarial self-check
- **Overcorrected?** "Often" is the narrowest fix that makes the heading true. It doesn't say "usually", which would claim a share I measured only by count. "Isn't a Gift" stays: neither over-withholding nor an earned credit is a gift, and the body explains both.
- **§10.1/§10.2/§10.3, no date or figure:** the content diff grep for `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0. The guard plant fired. Not kids content, and no live figure.
- **Prior work / decisions:** the previous entry's EITC sentence and the earlier W-4 and benefits-cliff fixes are untouched. `.js` content unchanged in kind. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 7.

**Seen, not fixed:** L8 §3 says insurance can't cover *"something that's already happened"*. That's true of a loss, but a reader could take it to include a known illness, which ACA health plans must cover. The sentence is ambiguous, not false, so I left it as a candidate for a later read. W-9.4 applies to the L7 heading: a second read is owed. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the tax lesson's heading said every big refund is an interest-free loan to the government. For the roughly 1 in 4 refunds that carry the Earned Income Tax Credit, it isn't, so the heading now says "often".

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-25 (scheduled dev-agent; free pick, W-12.2 sweep of essentials L1/3/5/7/8/11) — essentials L7's refund section no longer treats every refund as over-withheld pay: a refundable credit such as the EITC can pay more than all the tax withheld, and only at filing. Five languages.

Rules: W-6.2 ok (free pick; the previous entry left no residual); W-9.4 n/a (measured accuracy fix). `npm test` before any edit (HEAD `2605c2d`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** This week's runs had not named essentials L1, 3, 5, 7, 8 or 11, so I read L1, 3, 5 and 7 by meaning. L1's figures check ($1,200/$3,000 = 40%; $54 → $648). L3's Priya/Tom figures recompute at 6% monthly: **$398,290 vs $401,806** (0.9% apart), contributions $96,000/$144,000. L5's 2008/2022 figures were already measured. L7 §2 gave one: *"If the estimate withheld more than the real bill, the difference comes back as a refund. It was the worker's own money the whole time"*, under the heading *"A Big Refund Isn't a Gift — It's an Interest-Free Loan"*. `refundable|EITC|earned income` → 0 hits in log, archive, CLAIMS, DECISIONS (control: `W-4` → 44 in the archive).

**Step 3.5: the premise, measured.** IRS "Refundable tax credits" (curl, tags stripped in Node): *"a credit you can get as a refund even if you don't owe any tax"*. IRS EITC statistics: about **24 million** filers got about **$70 billion**, averaging **$2,894** (TY2024), which is about the lesson's own "$3,000 refund". The 2025 filing-season average refund was **$2,947** (IRS filing-season statistics). Advance EITC through the paycheck (Form W-5) was repealed from 2011, so the credit comes only by filing. **Control:** a nonsense phrase returned NO MATCH on each page. **Held:** for ~24M filers, much of a "big refund" is a credit, not money withheld early. A W-4 change can't move it into the paycheck.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js` L7 §2 ¶2: one sentence appended. No figure added (W-11.2). en *"Part of a refund can be something else, though: a refundable tax credit, such as the Earned Income Tax Credit for lower-income workers, can make a refund larger than all the tax that was withheld, and that part is paid only when a return is filed."* es *…el Crédito Tributario por Ingreso del Trabajo (EITC)…*, ko 근로소득 세액공제(EITC), zh 劳动所得税抵免（EITC）, ja 勤労所得税額控除（EITC）. Each keeps "EITC" so the term is findable; the translated names weren't checked against IRS's own translated pages. `scratchpad/l7.mjs` asserted anchor ×1 / new ×0 per file, length grew by exactly the insert, and no U+FFFD. I hand-read all five paragraphs in full.
- `lessonTerms.js` `deliberatelyUnlinked[7]`: `Credit` as other-sense (tax credit, not borrowed money). §3.0.3 **failed** on the new word first, which is the guard working. The glossary's "Credit" is borrowing.
- Ledger: L7 es/ko/zh/ja went **stale** (4/4, the control). I re-marked them `ai` after the hand read. `readiness --write`: en **167,949 → 168,197** chars (+0.15%). Since W-12.1's 167,511 that's +0.41%, and W-12.6(iii) allows 0.5%.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN; WARN/FAIL/§65/§67 lines `diff`-identical to before |
| Guard sees the paragraph | planted *"You should buy a house now."* after the new sentence → `check-blindspot` **exit 1** at `essentials.en.js:146`; restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-C7UJSZTk.js`, system Node v24.18.0 |
| Bundle | each of the 5 new strings is in 1 asset (0 in the repo's stale `./dist`). The unchanged heading is in 1 of each (control); nonsense is in 0 |
| Live | **not checked.** The bundle probe is the evidence for a one-sentence edit |

#### Step 5: adversarial self-check
- **Overcorrected?** The ¶ still says over-withholding is the worker's own money, which stays true. The new sentence only says part of a refund *can* be a credit. "Paid only when a return is filed" is true by construction: the part above all tax withheld can't come through withholding. The 2021 advance child tax credit has expired.
- **§10.1/§10.2/§10.3, no date or figure:** the content diff grep for `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 (the one diff hit is the dated "as of 2026-08-16" in the regenerated LAUNCH_READINESS row, which was there before). The guard plant fired. Not kids content, and no live figure.
- **Prior work / decisions:** the W-4, benefits-cliff and 401(k) clauses fixed earlier in L7 are untouched. No quiz quotes the ¶ (`interest-free|W-4` in `quizText.en.js` → 0 L7 hits). `.js` content unchanged in kind. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 9.

**Seen, not fixed:** the heading *"A Big Refund Isn't a Gift — It's an Interest-Free Loan"* is still unqualified, though its body now is. It's a short string, so W-9.4 applies, and it's left for a second read. L8 and L11 are not read yet. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the tax lesson said every big refund is your own over-withheld pay. For about 24 million lower-income filers, much of it is the Earned Income Tax Credit, which is paid only at filing. It now says so.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-24 (scheduled dev-agent; open item 140, after a W-12.2 sweep found nothing) — the live a11y sweep now checks what every focus ring is drawn against. A ring on a `--fill-*` container would read ~1:1 while §28c stays green. Re-measured live: 0 findings across 9 screens in both palettes. No `src/` change.

Rules: W-6.2 ok (the previous entry left no residual); W-9.4 n/a. `npm test` before any edit (HEAD `9a4186d`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** I read, by meaning, the surfaces this week's sweep had not reached: money L16-20, 22, 23, 25, 28 and economy L29, L40. No false clause turned up. L23's 1981 figures match Thaler's paper ($15→$20 in a month; $3,000→$4,000 in a year). L40's Rule 1 figures were FRED-measured on 10-08 (archive). W-12.2 says that when the sweep is clean, take 117, 140 or 149. 117 is the owner's judgment call, and 149 says not to pick it over other work. So I took 140.

**Step 3.5: the premise, measured.** 140 says §28c checks the ring only against surfaces, and that only a live sweep can see a ring drawn on a fill. Both hold. `index.css:271` is still the only focus rule (`outline: 2px solid var(--fill-accent); outline-offset: 2px`). `fill.accent/ok/ink` are still used as backgrounds (`ui.jsx:179,184`, `LessonReader.jsx:81`). **Control on the guard:** I added the probe with no selftest plant first, and `check-data` §43 **failed**, naming `ringBackdrop`.

#### What shipped (1 source file, no `src/` change)
- `scripts/a11y-sweep.js`: a `ringBackdrop` probe (layout-gated). It reads the ring color from the global `:focus-visible` rule, resolved in the current theme, and walks each enabled, non-inert focusable's ancestors. Alpha-0 layers are skipped and partial alpha is composited. A ratio under 3:1 is a finding. A background-image or an unparseable color is also a finding, never a skip. It reports `theme` (and says UNSET if `data-theme` is unset), the backdrop tally and the worst ratio. Helpers: `rgba`, `luminance` (0.03928, same as §28), `contrast`, `over`, `ringColor`.
- `selftest()` plant: a button inside a fully transparent layer inside a `var(--fill-accent)` wrapper. It expects `= 1.00:1` and the plant's id together.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN; WARN/FAIL/§65/§67 lines `diff`-identical to before. §43: 13 probes, 12 layout-gated, all planted |
| selftest, live (built `dist/` served statically) | `ringBackdrop`: **control fired**, both on fresh load and after a reload (`focusVisibleOnTab` UNAVAILABLE without a Tab press, as documented) |
| Ring color | light `rgb(47,67,196)` = `--fill-accent` #2f43c4; dark `rgb(169,182,255)` = #a9b6ff. By hand: #2f43c4 on white = **7.72:1**, which the probe also reports |
| Live tree control | painted `--fill-accent` on the real parent of "Practice all questions (1)" → exactly 1 finding, 1.00:1, on that button; restored → 0 |
| Sweep | Learn, lesson 29, Practice (fresh, and with `[29]` completed), Reference hub, Glossary, Market Dashboard, Sectors, Kids, About; each in light and dark: **0 findings**. Backdrops are only `--surface-canvas`/`--surface-card` in each palette. Worst **7.10:1** (light canvas), the same figure 140 recorded on 08-28 |

**An instrument trap, caught by a count:** my first pass set the hash and swept in the next call. Practice, Reference and lesson 29 all came back with the same 5 controls, which were only the app shell, because the lazy screens hadn't rendered yet. The lesson then had 18 controls in the DOM. I re-swept with a content check before measuring, and every scanned count then matched the DOM count.

#### Step 5: adversarial self-check
- **Limit, stated:** the nearest-painting-ancestor model doesn't see a ring that spills over a *sibling's* fill within 4px. On today's screens no focusable sits next to a fill. Recorded here, not filed.
- **§10.1/§10.2/§10.3, no date or figure:** tooling only. The diff grep `should|recommend|dalio` → 0.
- **Prior work / decisions:** §28c is untouched, and the probe checks what §28c deliberately leaves out. `focusVisibleOnTab` and its plant are unchanged. `a11y-states.js` picks up the probe through `A11ySweep.run()` with no edit. DECISIONS.md has nothing on the sweep. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the accessibility sweep now checks the contrast of every keyboard focus ring against what it is drawn on. Today all of them pass in both themes (worst 7.1:1, minimum 3:1), and the check will catch it if a button ever lands on a colored panel.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-24 (scheduled dev-agent; the previous entry's residual, L35 §2's rate-cut sentence) — L35 no longer says that when the Fed cuts, "real estate recovers": home prices kept falling for years after the 2007 cuts began. Its "bond prices rise" now needs market rates to follow the Fed down: the 10-year yield rose after 4 of 7 first cuts. Five languages.

Rules: W-6.2 ok (first residual of a free pick); W-9.4 n/a (measured accuracy fix). `npm test` at HEAD `71ad358` (a `git archive` copy with `node_modules` symlinked; I skipped this before the first edit and ran it on the copy instead): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.** FRED CSV (keyless), first-cut months 1989-06, 1995-07, 1998-09, 2001-01, 2007-09, 2019-07, 2024-09. **Control:** Case-Shiller national NSA, 2006-07 peak → 2012-02 trough = **−27.4%**, the bust's published size, so the instrument reads housing correctly. (1) **Home prices (CSUSHPINSA):** year-on-year change was negative for all 37 months 0-36 after the 2007 cut, and for 14 of them after 1989. In every other cycle, prices were already rising at the first cut (year-on-year +1.7% to +9.2%), so there was nothing to "recover". **Premise held.** (2) **Wider than logged, bonds (GS10):** the 10-year yield 12 months after the first cut was higher in 1989 (8.28→8.48), 1995 (6.28→6.87), 1998 (4.81→5.92) and 2024 (3.72→4.12), and lower in 2001, 2007 and 2019. So long-bond prices did *not* rise in 4 of 7 cycles. **Index check on my own first draft:** I first wrote "didn't hit bottom until 2012". The trough is 2012-02 on Case-Shiller SA and 2012Q2 on FHFA all-transactions, but **2011-05** on FHFA purchase-only (HPIPONM226S). That year depends on the index, so I replaced it with "kept falling for years", which holds on all three (3.7-4.6 years).

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js` L35 §2 ¶5, the first sentence becomes two. en *"Cut rates, and the sequence tends to run in reverse: stocks rise, bond prices rise as long as market rates follow the Fed down, and gold often rises. Home prices don't always follow: after the Fed began cutting in 2007, they kept falling for years."* es *…siempre que las tasas del mercado sigan al Fed a la baja… Los precios de la vivienda no siempre acompañan: …siguieron bajando durante años.*; ko 시장 금리가 연준을 따라 내려가는 한 채권 가격이 오르고 … 집값은 늘 따라오지는 않습니다 … 몇 년 동안 계속 떨어졌습니다; zh 只要市场利率跟着美联储下行，债券价格就会上涨 … 房价却不一定跟上 … 又持续下跌了好几年; ja 市場金利がFRBに続いて下がる限り債券価格が上がり … 住宅価格はいつもついてくるとは限りません … 何年も下がり続けました. No figure added (W-11.2). "Stocks rise" stays, because the next paragraph already qualifies it with 1995-2008.
- `scratchpad/cuts.mjs` and `cuts2.mjs` asserted old ×1 / new ×0 per file, the reverse after, and no U+FFFD; each refuses a re-run (exit 1).
- Ledger: after each English edit, L35 es/ko/zh/ja were reported **stale** (4/4, the control). I re-marked them `ai` after reading each against the final English. `npm run readiness -- --write`: en chars 167,824 → **167,949** (+0.07%; W-12.6(iii) allows up to 168,348).

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); WARN/FAIL lines and the §65/§67 lines are `diff`-identical to HEAD's run |
| Guard sees the paragraph | planted *"You should buy a house now."* after the new en clause → `check-blindspot` **exit 1** at `lessonContent.economy.en.js:134`; restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-IKNXaKG4.js`, system Node v24.18.0 |
| Bundle | 6 new probes (5 languages + the en bond clause) each in 1 asset (0 in HEAD's `./dist`). The old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire). The interim "2012" draft → 0, nonsense → 0, and the unchanged heading control → 1 |
| Live | **not checked.** The bundle probe is the evidence for this one-sentence edit |

#### Step 5: adversarial self-check
- **Overcorrected?** "As long as market rates follow the Fed down" is true by definition (prices rise when yields fall) and agrees with §1, which says market rates move on their own. "Don't always follow" doesn't claim home prices usually fall: they were higher a year later after 6 of the 7 first cuts.
- **§10.1/§10.2:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0, and the guard plant fired. **§10.3:** not kids content. **No date or live figure**: 2007 is a historical anchor.
- **Prior work / decisions:** today's §3 dual-mandate fix and §2's dollar and "Don't fight the Fed" sentences are untouched. No quiz quotes the old sentence (Node scan of `quizText.en.js` for rate-cut phrasing → 2 unrelated hits). `.js` content modules unchanged. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**Seen, not fixed:** nothing new in L35. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 35 said rate cuts make "real estate recover" and bond prices rise. Home prices kept falling for years after the 2007 cuts, and long-term yields rose after 4 of the last 7 first cuts, so it now says both depend on what the market does.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-24 (scheduled dev-agent; free pick, W-12.2 sweep of economy L31-35) — L35 no longer says Congress gave the Fed "two legally required goals": the statute names three. It now says the two at the center of its rate decisions are the dual mandate. Five languages.

Rules: W-6.2 ok (free pick; I declined the previous entry's residual, see below); W-9.4 n/a (measured accuracy fix). `npm test` before any edit (HEAD `49f0b4b`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** The previous residual (L44/q046 qualify "notice periods" but not "legal minimums") was filed as low priority because the US has a minimum wage, so I left it. Economy L29-35 had no sweep this week (only L30's car-loan residual). Read in English: L31, L32, L33, L34, L35. L31-34 turned up no false clause on this read. L33's "75-100 years" is the model's own span, and the NestedCycles chart and q003 depend on it, so it's not a sweep fix. In L35 §3: *"Congress gave the Fed two legally required goals at once, known as its dual mandate"*.

**Step 3.5: the premise, measured.** 12 U.S.C. §225a (Cornell LII, WebFetch, asked to quote verbatim): *"so as to promote effectively the goals of maximum employment, stable prices, and moderate long-term interest rates."* The Chicago Fed's dual-mandate page quotes the same 1977 clause and calls only the first two *"known collectively as the 'dual mandate'"*. **Control:** asked the LII page for a numeric inflation target, the fetch said NONE FOUND. That's correct: 2% is the Fed's own choice, not statute. So it reports absence rather than inventing one. **Premise held:** the law names three goals, and "dual mandate" is the Fed's name for two of them.

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js` L35 §3 ¶1, one clause each. en *"…Congress set the Fed's goals in law, and the two at the center of its rate decisions are known as its dual mandate: stable prices (…) and maximum employment (…)."* es *el Congreso fijó por ley los objetivos del Fed, y los dos que están en el centro de sus decisiones sobre las tasas…*; ko 의회는 연준의 목표를 법으로 정해 두었고, 그중 금리 결정의 중심에 있는 두 가지를…; zh 国会以法律规定了美联储的目标，其中处于利率决策核心的两个…; ja 議会はFRBの目標を法律で定めており、そのうち金利の決定の中心にある二つを…. The heading ("Two Goals That Can Conflict") stays true. No figure added, and the third goal isn't spelled out (W-11.2: narrow, don't add).
- `scratchpad/mandate.mjs` asserted old ×1 / new ×0 per file, the reverse after, and no U+FFFD; a re-run refuses (exit 1). A second asserted edit dropped a doubled 其 from the zh clause.
- Ledger: L35 es/ko/zh/ja were reported **stale** after the English edit (the control) and re-marked `ai` after I read each against the new English. `npm run readiness -- --write` updated en chars 167,793 → **167,824** (`LAUNCH_READINESS.md` 2/2).

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); WARN/FAIL lines `diff`-identical to the pre-edit run. §65 unchanged (en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1), §67 0/360 |
| Guard sees the paragraph | planted *"You should buy bonds now"* after "dual mandate" → `check-blindspot` **exit 1** at `lessonContent.economy.en.js:138`; restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-B6aNWnVJ.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset (0 in HEAD's `./dist`); the old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0; unchanged heading control → 1 |
| Live | **not checked.** The bundle probe is the evidence for this one-clause edit |

#### Step 5: adversarial self-check
- **Overcorrected?** The new clause is true under the statute and the Fed's own usage. It doesn't claim the third goal is unimportant, only that two drive the rate decisions this section discusses. `policySimIntro`'s "The dual mandate has no formula" is still true and unchanged.
- **§10.1/§10.2:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. **§10.3:** not kids content. **No date or live figure.**
- **Prior work / decisions:** the §3 section added in the archive (l.6945) is kept. Only its first clause narrows. `.js` content modules unchanged. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**Seen, not fixed:** L35 §2 says that when rates are cut, *"real estate recovers"*. Home prices kept falling for years after the 2007 cuts began, and the next paragraph already says the pattern is mixed for stocks. Low priority, not numbered (W-6.2 rule 2). `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 35 said Congress gave the Fed two legal goals. The law names three (the third is moderate long-term interest rates), so it now says the two at the center of its rate decisions are what's called the dual mandate.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-24 (scheduled dev-agent; the previous entry's residual, glossary "Passive Income") — the glossary entry no longer implies that every wage carries a legal minimum and a notice period. Most US jobs are at-will, and some countries have no minimum wage. It now says a wage has both "in most countries", as lesson 44's body does. Five languages.

Rules: W-6.2 ok (first residual of a free pick); W-9.4 n/a (measured accuracy fix). `npm test` before any edit (HEAD `3afd410`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.** The entry said *"unlike a wage the income carries no legal minimum and no notice period"*. Both clauses assume every wage has the protection. (1) **Notice:** NCSL's at-will overview (WebFetch, asked to quote verbatim): employment is *"presumed to be 'at-will' in all U.S. states except Montana"*. (2) **Minimum:** ILO's "How many countries have a minimum wage" says *"more than 90 per cent of ILO member States"* have one, and names exceptions (Singapore, Brunei, Qatar, Bahrain, the UAE, Ethiopia, Suriname). **Control:** asked the same NCSL page whether an at-will employer must give notice of termination, the fetch said the page doesn't say. So it reports absence rather than inventing a quote. **Premise held, and it was wider than logged:** the minimum-wage clause overstates too, so the qualifier covers both, as L44 §2 does (*"In most countries it comes with legal minimums, notice periods…"*). A Node scan of English `src` for `notice period|legal minimum|minimum wage` finds only this entry unqualified (L44 body, L44 takeaway and q046 all carry "in most countries").

#### What shipped
- `src/content/glossary.js` "Passive Income" `f`, the last sentence in each of five languages. en *"…came first, and unlike a wage, which in most countries comes with a legal minimum and a notice period, the income carries neither."* The qualifier reuses L44's own words: ko 대부분의 나라에서, es *en la mayoría de los países*, zh 在大多数国家, ja 多くの国では. ko/zh/ja split the long sentence in two. Each was hand-read against the new English. No figure added (W-11.2). A 5-line comment above the entry records the old text and both sources.
- `scratchpad/passive.mjs` asserted old ×1 / new ×0 per string, the reverse after, and no U+FFFD; a re-run refuses (exit 1). The glossary is outside the translation ledger, so nothing was re-marked, and lesson chars are unchanged.

#### Verification
| check | result |
|---|---|
| Diff | 1 source file, 6+/1− (one line holds all five strings, plus the comment) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); WARN/FAIL lines `diff`-identical to the pre-edit run. §67 0/360 flagged, §65 unchanged (en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1) |
| Guard sees the entry | planted *"You should buy dividend stocks now."* after the new en clause → `check-blindspot` **exit 1** at `glossary.js:180`; restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-CrnJJdqG.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; the old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0; unchanged `ex` control → 1 |
| Live | built `dist/` served statically (`/` 200, missing asset 404). Reference → Glossary in all five languages via the real select: new ✓, old ✗, the entry's `ex` control ✓, negative ✗. ⚠️ My first probe ran before dismissing the welcome notice and read false for everything, controls included. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Overcorrected?** "In most countries" is true of both protections (ILO >90%; notice is law in most OECD countries, per the 10-23 entry). The entry still says passive income has neither, which is true everywhere. No country is singled out and no figure added, so nothing can go stale.
- **§10.1/§10.2:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0, and the guard plant fired. The entry still describes the income and says nobody should pursue it. **§10.3:** not kids content. **No date or live figure.**
- **Prior work / decisions:** this aligns the glossary with the 10-23 L44/q046 fix and touches neither. `.js` content modules unchanged. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2 (glossary.js, AGENT_LOG.md).

**Seen, not fixed:** L44's takeaway and q046 qualify "notice periods" but not "legal minimums". ILO says minimums are not universal either, though the US has one, so it's true for the app's default reader. Low priority, not numbered (W-6.2 rule 2). `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the glossary's "Passive Income" entry implied that every job comes with a minimum wage and a notice period. Most US jobs are at-will, and some countries have no minimum wage, so it now says "in most countries".

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-23 (scheduled dev-agent; free pick, W-12.2 sweep of money L41-44) — L44's takeaway and quiz q046's explanation no longer list "notice periods" as a protection every wage carries. Every US state but Montana is at-will, so most US jobs have no legal notice period. Both now say "in most countries", as L44's own body does. Five languages.

Rules: W-6.2 ok (free pick; I declined the previous entry's residual, see below); W-9.4 n/a (measured accuracy fix). `npm test` before any edit (HEAD `7fceda2`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** The previous residual (Market Dashboard cards don't link to the glossary) is a feature, not a fix. Its premise is also off: Sectors explains "relative strength" inline and links no glossary chip either. Read in English: L41, L42, L43, L44. L41-43 read clean. In L44, §2's body says *"In most countries it comes with legal minimums, notice periods…"*, but the takeaway drops the qualifier: *"the protections a wage carries: legal minimums, notice periods, and getting paid…"*. q046's explanation (lesson 44) says the same thing unqualified. The 09-11 L44 creditor run (archive l.48631) fixed the body's creditor clause and left both of these alone.

**Step 3.5: the premise, measured.** NCSL's at-will overview (WebFetch, asked to quote verbatim or say NONE FOUND): *"Employment relationships are presumed to be 'at-will' in all U.S. states except Montana"*, and an employer *"can terminate an employee at any time"*. Federal WARN requires 60 days' notice only for plant closings and mass layoffs at larger employers (DOL WARN page: *"qualified plant closings and mass layoffs"*). **Control:** DOL's general Termination page returned NONE FOUND for both questions, so the fetch reports absence rather than inventing a quote. "Most countries" is still fair: a WebSearch summary of OECD Employment Outlook 2026 (not opened) puts the OECD-average notice period at 1.3 months for a 4-year tenure. The app's examples are in dollars and its essentials track teaches the 401(k), so its default reader is in the one rich country this is false for. **Premise held.**

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js` L44 takeaway: en *"legal minimums, in most countries a notice period, and getting paid…"*. The qualifier reuses each body's own words: es *en la mayoría de los países*, ko 대부분의 나라에서는, zh 在大多数国家还有, ja 多くの国では. 1/1 per file.
- `quizText.{en,es,ko,zh,ja}.js` q046 `explain`: en *"legal minimums, notice periods in most countries, and being paid regardless…"*, with the same words per language. Options untouched, so §65 is unaffected. 1/1 per file.
- Edit script asserted old ×1 / new ×0 before, new ×1 / old ×0 / U+FFFD ×0 after, and refused on re-run.
- Ledger: L44 es/ko/zh/ja were reported **stale** after the English edit (the control) and re-marked `ai` after I read each against the new English. `npm run readiness -- --write` updated en chars 167,774 → **167,793** (`LAUNCH_READINESS.md` 2/2).

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); WARN/FAIL lines `diff`-identical to the pre-edit run |
| Guard sees the takeaway | planted *"You should buy dividend stocks now,"* in the en takeaway → `check-blindspot` **exit 1** at `lessonContent.money.en.js:268`; restored from a scratchpad copy (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-a-NHSr3s.js`, system Node v24.18.0 |
| Bundle | 10 new probes (2 × 5 languages) each in 1 asset; both old en forms → 0 (each → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0; unchanged body control → 1 |
| Live | built `dist/` served statically (`/` 200, missing asset 404). `#/lesson/44` with seeded progress, all five languages via the real select: new ✓, old ✗, body control ✓, negative ✗. ⚠️ The first batched pass read false for everything, controls included, because it probed before the lazy chunk rendered. Separate calls read true. q046 checked in the bundle only. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Overcorrected?** "In most countries" stays true where notice is the law, and it matches the body two paragraphs up. It adds no figure or date, and it doesn't single out the US, so nothing can go stale.
- **§10.1/§10.2:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. The sentence describes legal protections and tells nobody which income to pursue. **§10.3:** not kids content. **No date or live figure.**
- **Prior work / decisions:** this keeps the earlier creditor fix and the body untouched. Nothing in "Completed and pruned" is undone, and `.js` content modules are unchanged. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 13.

**Seen, not fixed:** glossary "Passive Income" says that *"unlike a wage the income carries no legal minimum and no notice period"*. That implies the same thing about wages, and in five languages it carries a §67 length record. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 44's summary and its quiz explanation told readers every wage comes with a notice period. Most US jobs are at-will and have none, so both now say "in most countries", as the lesson body already did.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-23 (scheduled dev-agent; the previous entry's residual, the glossary gap) — the glossary now defines "Growth Stock" and "Value Stock", and lesson 38 chips both on its first section. L38 used "growth stocks" four sections before defining it, and the Market Dashboard's Stocks card compares the two without defining either. Five languages.

Rules: W-6.2 ok (first residual of a free pick); W-9.4 n/a (new entries, not a hand read of an existing surface). `npm test` before any edit (HEAD `06589a4`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.** Glossary keys: 43, none for growth or value (the same scan finds "Stock", the control). English content: "growth/value stock" appears only in L38 (§0, §1, §4) and the `markets.js` note. L38 §0 says "Growth stocks are often added…" and defines growth only in §4 ("priced mostly on profits still years away"). Value is defined inline in §0. **Premise held.** Two claims in the new text were measured rather than assumed. (1) **Style indexes sort on price-to-book, among other ratios** (WebSearch: Russell uses book-to-price plus growth forecasts; S&P uses B/P, E/P and S/P against three growth factors). So the text says "measures such as price-to-book". (2) **The example "a bank or utility often counts as value":** in Fama-French's 12-industry value-weighted BE/ME, Utils and Money were above the 12-industry median in **37 of 37** years from 1990 to 2026. **Control:** BusEq (tech) was never above the median in the 27 years since 2000, so the instrument separates the two groups.

#### What shipped
- `glossary.js`: two entries after Bond, with a dated 10-line source comment. They say what each label is and that it is relative: a company can move between groups. Value is "not a verdict that the stock is a bargain". The terms are the ones L38 and the card already use per language: es *acción de crecimiento / de valor*, ko 성장주/가치주, zh 成长股/价值股, ja グロース株/バリュー株. All five read by hand.
- `lessonTerms.js` 38 §0: `+ "Growth Stock", "Value Stock"` (rule 3: first use).
- `LAUNCH_PLAN.md` §1: 43 → 45 glossary terms, written by `npm run readiness -- --write`.
- `check-data.mjs` §67: the length screen flagged `Growth Stock.ex` in ko 0.40 / zh 0.24 / ja 0.31. The English example runs 160 code points and CJK renders it compactly. I read each translation against the English, and each carries all four clauses. So they went into `READ_COMPLETE` with their lengths (64/38/50) and a dated comment. Its summary line no longer dates every listed read 2026-09-02.

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). §17b 150 → **152** uses, 109 → **111** chips, 0 unexplained. §67 0/360 flagged. §65 unchanged (en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1) |
| §17b sees the term | removed the Growth Stock chip → `check-data` **exit 1** naming lesson 38 and "Growth Stock"; restored from a scratchpad copy (`cmp` equal) |
| Guard sees the entry | planted *"You should buy growth stocks now."* in the en example → `check-blindspot` **exit 1** at `glossary.js:139`; restored (`cmp` equal) → exit 0 |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-C1ms7hRd.js`, system Node v24.18.0 |
| Bundle | 5 new probes (one per language) each in 1 asset; nonsense → 0; HEAD `./dist` finds the Stock definition (instrument control) |
| Live | built `dist/` served statically (`/` 200, missing asset 404). Reference → Glossary lists both. Growth Stock detail read in en/ko/zh/ja/es via the real select. L38's chip not opened live: the lesson is locked on a fresh profile, and §17b's injection above covers the link. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **§10.1:** the definitions describe what each label is. Nothing says which to hold. Value's "not a verdict that the stock is a bargain" works against a buy reading. Diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. **§10.2/§10.3:** n/a. **No date or live figure:** the example names no numbers.
- **Consistency:** L38 §4 says growth is "priced mostly on profits still years away". The glossary makes the comparative claim ("more of its price… than a value stock"), which is weaker and agrees.
- **Prior work / decisions:** no log, archive or DECISIONS.md line declines these terms. The only mention is the 10-23 residual. `.js` content modules unchanged. **No conflict found.**
- **The READ_COMPLETE additions** are the judgment call here. Control 6 fails any listed pair later cut below 90% of its recorded length.
- **Commit safety (W-12.3):** staged count asserted = 5.

**Seen, not fixed:** the Market Dashboard cards don't link to the glossary (only Sectors does), so the card's reader still has to look the terms up. Not filed (W-6.2 rule 2). `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** "growth stock" and "value stock" now have glossary entries in all five languages, and lesson 38 links them where it first uses them. Before, the lesson used "growth stocks" four sections before explaining it.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-23 (scheduled dev-agent; free pick, W-12.2 sweep of the Market Dashboard) — the rate-effects Stocks card no longer says "Growth names most sensitive": growth stocks were never the hardest-hit group when yields rose, and they beat value stocks over 4 of the last 5 hiking cycles. It now says that, with "hardest" labeled "on paper". Five languages.

Rules: W-6.2 ok (free pick; the previous run was the archive chore); W-9.4 n/a (measured accuracy fix). `npm test` before any edit (HEAD `1e0645c`): exit 0 / 0 FAIL / 1 WARN (O-3's).

**Picking.** `sectors.js`, `economicSignals.js`, `moneyVisuals.js` captions, L31 and L38 read clean. The Stocks note dates from the 08-04 rebuild and was never measured.

**Step 3.5: the premise, measured.** Fama-French daily value-weighted BE/ME portfolios (growth = Lo 30, value = Hi 30), 12-industry portfolios and FRED DGS10, all keyless. (1) **Per point of 10y yield rise**, growth did worse than value in every span since 1962 (negative slope in all 5 spans), but only as a lean: it lagged on 52-59% of up-yield days in each decade. It was **never the hardest-hit group**: 4th to 7th of 14, with utilities or staples hardest hit in each span since 2000. So "most" is false. (2) **Over the last 5 hiking cycles** (first hike to last, the same 5 as the gold, real-estate and dollar notes), growth minus value was **+5.2 / +1.7 / −26.4 / +13.3 / +9.0** pts. Growth beat value in 4 of 5. That holds with Lo 20/Hi 20 and Lo 10/Hi 10, and across ±5-day start/end shifts (121/121 in every case but 1999-2000 Lo 30, 117/121). **Controls:** Tiingo SPY reproduces the 09-18 entry's +11.1 / +20.8 / +4.6 exactly; a bad ticker and a bad FRED id → 404. Russell IWF/IWD total return, an independent source, agrees on the winner in all 3 cycles it covers. **Premise held:** the superlative is false, and history went the other way.

#### What shipped
- `markets.js` `rateEffects` stocks `note`, one string per language. en *"On paper growth stocks are hit hardest, yet they beat value stocks in 4 of the last 5 hiking cycles"* (98 chars, the Bonds note's length). es *"Sobre el papel, las de crecimiento son las más afectadas; aun así, superaron a las de valor en 4 de los últimos 5 ciclos de alzas"*. ko 「이론상으로는 성장주가 가장 크게 타격을 받지만, 최근 다섯 번의 인상 사이클 중 네 번은 가치주를 앞섬」. zh 「按道理成长股受冲击最大，但在最近五轮加息周期中，有四轮跑赢了价值股」. ja 「理屈の上ではグロース株が最も打撃を受けるが、直近5回の利上げ局面のうち4回はバリュー株を上回った」. The "on paper" words and the stock terms are L38's own, per language; the numerals follow each language's sibling notes. All five read by hand.
- A dated 10-line comment above `rateEffects` with sources and figures. `scratchpad/tools/edit.mjs` asserted old ×1 / new ×0 before, new ×1 / U+FFFD ×0 after, and refused on re-run.

#### Verification
| check | result |
|---|---|
| Diff | 2 files incl. this log; `markets.js` +15 / −5 |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged (en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1); §2.3 ok |
| Guard sees the note | planted *"You should buy growth stocks now."* in the en note → `check-blindspot` **exit 1**, naming `markets.js:401`; restored from a scratchpad copy (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-C8gsoAv5.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset (`markets-*.js`); old en and old ja → 0 (old en → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing asset → 404). Reference → Market Dashboard, all five languages via the real select: control (a sibling card) ✓, new ✓, old ✗. At 320px (en/es/ja): no overflow, and the card is the Bonds card's height. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Overcorrected?** "On paper… hardest" keeps the textbook duration claim but labels it, as L38's Why section does ("On paper, growth stocks… should get the biggest lift"). The history clause is what the card's header asks of a note. **Sibling scan** (Node over `src/content`, `growth (stocks|names|compan)`): L38's four sentences, which say the same thing about whole expansions, and L35's tech-vs-utilities passage ("more exposed… than a utility's", then "tech beat utilities in eleven" of 14). Both agree with this measurement. No new defect.
- **§10.1/§10.2:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. The note reports what happened over past cycles and tells nobody what to hold. **§10.3:** not kids content. **No date or live figure:** §2.3 passes, and "the last 5 hiking cycles" is the sibling notes' phrasing.
- **Prior work / decisions:** this follows 09-18's pattern (`47e594c` and the gold/real-estate/dollar notes) and leaves 10-12/10-18's Bonds note alone. Nothing in "Completed and pruned" is undone. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** the glossary has no entry for growth or value stocks. This card and L38 use both terms, and only L38 defines value (inline). The old note's "growth names" had the same gap. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Market Dashboard told readers growth stocks are "most sensitive" to rising rates. They were never the hardest-hit group, and they beat value stocks over 4 of the last 5 Fed hiking cycles, so the card now says that and labels "hit hardest" as the textbook view.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-23 (scheduled dev-agent; W-5.3 archiving pass, owed by the previous entry) — run log days 2026-10-11 → 10-17 (28 entries, 145,458 b) moved verbatim to the archive. No source change.

Rules: a standing chore, not a residual, so W-6.2 n/a; W-9.4 n/a. W-5.3's **twenty-fourth** firing.

**Step 3.5: the premise, re-measured.** `check-log-size` at HEAD `bcfac93`, before any edit: run log **247,836 b** (99.1% of the 250,000 b warn), **0.39 runs** of headroom, WARN; 12 live days, all contiguous, controls 1-4 firing. Held. **Which days:** everything before the most recent weekly-review boundary (W-12, 2026-10-18), so 10-18 → 10-22 stay live, and W-12.6(ii)'s 10-19 → 10-25 entries remain in place for the 10-25 review.

#### What shipped (2 files, no source change)
- `AGENT_LOG.md` **530,089 → 384,629 b** before this entry; 5 live days, oldest 2026-10-18. Everything above `## Run log` byte-identical (floor unchanged at 282,253 b).
- `AGENT_LOG.archive.md` **5,671,392 → 5,816,891 b** under `## Archived 2026-10-11 → 2026-10-17`, before the line-start `## Archived backlog (closed items)`; title `→ 2026-10-10` becomes `→ 2026-10-17` (byte-neutral). Days ascending, entries within a day in live-file order. Growth 145,499 b = heading 37 + 2 + block 145,458 + 2.
- Mover in `scratchpad/archive/move.mjs`; `scripts/` gained 0 lines.

#### Verification
| Check | Result |
|---|---|
| Pre-state | both files `cmp`-identical to `git show HEAD:` |
| Conservation (mover, in memory) | section read back, regrouped newest-first, appended → original 530,089 b exactly; one-char-short control does not match |
| Conservation (independent, from disk) | archive minus section, title reverted **==** HEAD's archive; live rebuilt **==** HEAD's live; one-char-short **false** |
| Containment | 28/28 heading lines: new archive ×1, old archive ×0, new live ×0 |
| Repeat | re-running the mover refuses (exit 1) |
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's; the headroom WARN is gone). MEASURED 2026-10-23, before this entry: run log 102,376 b (41.0% of warn), 26.7 runs of headroom, archive 5,816,891 b |

#### Step 5: adversarial self-check
Only two markdown files changed, moved verbatim with nothing edited or deleted (W-7.2 rule 3; the conservation checks are the proof, since `npm test` can't see archive loss). Backlog, App summary and Environment note untouched; the archive held 0 of these 28 entries before. A reviewer must name this commit's parent `bcfac93`. **No conflict found.** Commit safety (W-12.3): staged count asserted = 2.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the run log was under one run from its size budget, so 28 entries from 2026-10-11 to 10-17 moved verbatim into the archive (now 41% of budget). No learner-visible change.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-22 (scheduled dev-agent; the previous entry's residual, essentials L14 ¶2) — the estate-planning lesson now says which accounts the state divorce laws reach: an IRA or life insurance you buy yourself, though not a 401(k). And "about half of US states" is now "many": newer counts run to 35 or more. Five languages.

Rules: W-6.2 ok (residual of a free pick; the next run may take a residual of this one only once more); W-9.4 n/a (measured legal-accuracy fix). Baseline `npm test` at `bf4776d`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1. `check-log-size`: 241,401 b before this entry (96.6% of the 250 KB warn budget), so **W-5.3's archive pass is due next run.**

**Step 3.5: the premise, measured.** The residual said ¶2 is "true as written" but doesn't say a 401(k) is outside the state laws, right after a 401(k)-and-ex-spouse example. WebSearch: **Egelhoff v. Egelhoff (2001)** holds ERISA preempts revocation-on-divorce statutes for ERISA plans (a Bradley 2022 article says the same). **Control, the side that must hold:** **Sveen v. Melin (2018)** upheld Minnesota's statute for an individual life policy, and after Sveen the Court left standing an Arizona ruling that applied one to an IRA. So the instrument returns "reaches" as well as "doesn't". **Held, and it broke a second figure:** the count. Sources from around Sveen say **26 states** (2018). Bradley 2022 says **at least 35** with UPC-2-804-style statutes reaching non-probate assets; an undated Mississippi bill note says **more than 40**. The counts use different definitions, so "about half" is defensible for 2018 and likely an undercount now. W-12.2 says narrow rather than add a figure, so it becomes "many", which is true under every count.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L14 ¶2, one clause each. en *"…and many US states automatically cancel an ex-spouse's designation after a divorce for some kinds of accounts, such as an IRA or life insurance you buy yourself, though not a 401(k)."* es *"…muchos estados… como un IRA o un seguro de vida contratado por cuenta propia, aunque no en un 401(k)."* (`un IRA` matches the file's 3× masculine usage). ko 「미국의 많은 주는 이혼 후 IRA나 본인이 직접 가입한 생명보험처럼 401(k)가 아닌 일부 계좌에서…」. zh 「美国许多州…例如IRA或自己购买的人寿保险，401(k)则不在此列。」 ja 「また米国の多くの州では、離婚後、IRAや自分で加入した生命保険など、401(k)以外の一部の口座について…」. All five read by hand in full. ⚠️ **My first zh draft ended 「但不包括401(k)。」 straight before the next sentence's 「但这些规定…」**, two 但 in a row. Caught on the read-back and reworded before marking.
- L14 es/ko/zh/ja re-marked `ai` (ledger 16 lines). `readiness --write` changed numbers only: en **167,711 → 167,774** chars (+0.16% since W-12.1's 167,511; allowance 0.5%).
- `scratchpad/edit.mjs` asserted old ×1 / new ×0 for all 5 strings before, old ×0 / new ×1 / U+FFFD ×0 after, and refused on re-run (exit 1). The zh fix had its own assert, same shape.

#### Verification
| check | result |
|---|---|
| Diff | 8 files incl. this log; content 5×1 line, ledger 16, LAUNCH_READINESS 2 rows (numbers only) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. Only the word count (36,114 → 36,126, still 177 min, L14 holds at 4), §33's char total and the readiness figures moved. With HEAD's ledger: exit 1 (1 stale per language, §10.4 disagreeing), so the guard saw the edit |
| Guard sees the lesson | planted *"You should open an IRA now."* after the new en clause → `check-blindspot` **exit 1**, naming `lessonContent.essentials.en.js:252`; restored from a scratchpad copy (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-fwT4yDAL.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in exactly 1 asset (that language's essentials chunk); old en and old ja → 0 (old en → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing asset → 404). Lessons 1-13 seeded, `#/lesson/14`. en: control (title) ✓, new ✓, old ✗. ko via the real select's setter + change event (`lang=ko`; the pane was 0×0, so no a11y tree): control ✓, new ✓, old ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Overcorrected?** "Life insurance you buy yourself" is deliberate: employer group life usually sits under ERISA, so the state law may not reach it. A governmental or church 401(k) isn't under ERISA. That's a rare edge, and yesterday's q028 entry made the same call. "Many" doesn't claim most, and the next sentence ("they vary by account and by state and don't cover every case") still holds. **Sibling scan** (Node over `src/`, half-of-states / many-states / ex-spouse / revocation in all five languages): the 5 new clauses (the control) plus q028's explanation, which already says the same thing. Old forms → 0.
- **§10.1/§10.2:** the diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. The text describes the law and tells nobody whom to name. **§10.3:** not kids content. **No date or live figure in learner text.**
- **Prior work / decisions:** this keeps the 10-04 L14 rewrite's structure and the 401(k) spousal-right clause word for word, and agrees with today's q028 fix. Nothing in "Completed and pruned" is undone. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8. ⚠️ My draft said 9; the assert caught it, and both figures here were corrected before the commit.

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the estate-planning lesson said "about half of US states" cancel an ex-spouse's beneficiary designation after a divorce, right after a 401(k) example. Those laws can't reach a 401(k), and newer counts put it at 35+ states, so it now says "many US states… such as an IRA or life insurance you buy yourself, though not a 401(k)".

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-22 (scheduled dev-agent; free pick, W-12.2 sweep of the quiz explanations) — quiz q028's explanation no longer lists "a state law canceling an ex-spouse's designation after a divorce" as a rule that can override a 401(k) form: federal law keeps those state laws away from a 401(k). It now says they can reach an IRA or some life insurance, but not a 401(k). Five languages.

Rules: W-6.2 ok (free pick; the previous entry's L4 residual chain was closed, and no residual of it was taken); W-9.4 n/a (measured legal-accuracy fix). Baseline `npm test` at `7f7ad56`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1. `check-log-size`: run log 235,197 b, 2.8 runs of headroom, so W-5.3 is not due yet.

**Picking.** I read all 46 English `explain` strings. Most are hedged or were measured by earlier runs (q005's "every US recession since 1955" is the SF Fed's 10y-1y finding; q025's crossover years and q024's "roughly a quarter" recompute exactly). q028's explanation, written 2026-10-04, says: *"Rules that can override a form, like a current spouse's right to a 401(k) or a state law canceling an ex-spouse's designation after a divorce, don't apply here."* The question is about a 401(k), so a reader takes both rules as ones that can override a 401(k) form. The second one can't.

**Step 3.5: the premise, measured.** WebSearch: **Egelhoff v. Egelhoff (2001)** held that ERISA preempts Washington's revocation-on-divorce statute for ERISA plans, and the ex-wife still named on the Boeing plan forms collected. Kennedy v. DuPont (2009) applied the same plan-documents rule to a savings plan. **Control, the side that must hold:** the same search confirms **Sveen v. Melin (2018)** upheld such a statute for a non-ERISA life insurance policy, and IRAs sit outside ERISA too. So the instrument can return "applies" as well as "doesn't apply". The 10-04 run's own entry (archived) recorded exactly this split ("Those apply to life insurance and IRAs, not to ERISA 401(k)s") and then wrote the explanation without it. **Premise held:** the clause is false by implication for the account the question is about. This matters in practice, because a divorced reader could conclude state law fixes an old 401(k) form. It doesn't, and the ex usually collects.

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js` q028 `explain`, one sentence replaced by two. en: *"Rules that can override a form don't apply here: there was never a spouse, so no spouse has a claim to the 401(k), and there was no divorce. Even after a divorce, a state law canceling an ex-spouse's designation can reach an IRA or some life insurance, but federal law keeps it from reaching a 401(k)."* es/ko/zh/ja say the same. All five read by hand in full. The question, options and answer index are unchanged, so §65 can't move. The es explanation still has no closing "That is why…" sentence; the 10-04 run left it that way, and so do I.
- `scratchpad/edit.mjs` asserted old ×1 / new ×0 for all 5 strings before, old ×0 / new ×1 / U+FFFD ×0 after, and refused on re-run (exit 1).

#### Verification
| check | result |
|---|---|
| Diff | 6 files incl. this log; each `quizText` file 1 line |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). Only the reading-model line changed: 36,091 → 36,114 words, still 177 min |
| Guard sees the explain | planted *"You should open an IRA now."* after the new en sentence → `check-blindspot` **exit 1**, naming `quizText.en.js:298`; restored from a scratchpad copy (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-z5zMMdqt.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in exactly 1 asset (that language's `quizText` chunk); old en and old ja → 0 (old en → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | **not done.** The explanation appears only after answering q028 in Practice. The bundle probe covers each language's chunk |

#### Step 5: adversarial self-check
- **Overcorrected?** "Federal law keeps it from reaching a 401(k)" is true of the plan's payout. Two edges stay out of learner text: a governmental or church 401(k) isn't under ERISA, and some state courts let the family sue the ex *after* the payout. Neither changes who the plan pays. "Can reach" hedges the ~26-state variation. **Sibling scan** (Node over `src/content`, ex-spouse in all five languages): 15 hits. 5 are this explanation (the control), and 10 are lesson 14 ¶2 in five languages. That paragraph says "about half of US states… cancel an ex-spouse's designation after a divorce **for some kinds of accounts**", which is true, but right after a 401(k)-and-ex-spouse example it doesn't say a 401(k) isn't one of them. Seen, not fixed (below).
- **§10.1/§10.2:** the diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. The text describes the law and tells nobody whom to name. **§10.3:** not kids content. **No date or live figure.**
- **Prior work / decisions:** this keeps the 10-04 run's answer key and scenario, and corrects only its explanation. Nothing in "Completed and pruned" is undone, and DECISIONS.md says nothing on it. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 6.

**Seen, not fixed:** lesson 14 ¶2 (essentials, five languages) could name which accounts the state laws reach: *"…for some kinds of accounts, such as an IRA or life insurance you buy yourself, though not a 401(k)."* It's true as written, so this is a clarity residual, and the next run may take it. A lesson edit also needs the ledger re-mark and `minutes` check. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the estate-planning quiz's explanation listed state divorce laws among the rules that can override a 401(k) beneficiary form. Federal law stops those laws from reaching a 401(k), so an ex-spouse still named on the form usually collects. It now says that.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-22 (scheduled dev-agent; the previous entry's residual, essentials L4's subtitle) — the credit-score lesson's subtitle no longer says the score "follows you into almost every big purchase": a purchase paid in cash never touches it. It now says "almost every big loan". Five languages.

Rules: W-6.2 ok (residual of a residual of a free pick, its last allowed link: ⛔ **the next run may NOT take a residual of this one**); W-9.4 n/a (measured accuracy fix). Baseline `npm test` at `fabbbd4`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Step 3.5: the premise, measured.** The two biggest purchases most people make are a home and a car. Sources found by WebSearch: (1) **NAR 2025 Profile of Home Buyers and Sellers:** all-cash purchases averaged **26%** over the year, a record (19% for primary homes, 30% for repeat buyers). (2) **Experian, auto finance:** about **80%** of new vehicles are financed (80.5% in Q1 2025, via Mercer Capital), and historically only about **54-55%** of used ones (Q2 2014, Q3 2019). Used sales outnumber new about 2.5 to 1, so roughly 4 in 10 vehicle purchases are made without a loan. A purchase without a loan doesn't involve a credit score, so "almost every big purchase" is false. **Control, the side that must hold:** a loan almost always involves a score check. FICO says its scores are used by 90% of top US lenders, and Fannie Mae and Freddie Mac mortgages require one. That's FICO's own claim, so no figure goes into learner text. **Premise held:** the claim is true of loans, not purchases. W-12.2 says narrow the clause, so I changed the noun and added no number. The lesson body already covers apartments and insurance, so the subtitle doesn't have to.

#### What shipped
- `lessons.js` essentials id 4 `subtitle`, one noun each. en *"A number that follows you into almost every big loan"*. es *"…en casi cada préstamo grande"*. ko 「거의 모든 큰 대출을 따라다니는 숫자」. zh 「几乎跟随你每一笔大额贷款的数字」 (笔 is the right measure word for a loan). ja 「ほぼすべての大きな借り入れについてくる数字」. All five read by hand. No header comment: `lessons.js` carries none per lesson, and this log has the reasoning.
- `scratchpad/edit.mjs` asserted old ×1 / new ×0 for all 5 strings, and refused on re-run (exit 1).

#### Verification
| check | result |
|---|---|
| Diff | 2 files incl. this log; `lessons.js` 1 line |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). Output is **byte-identical** to the baseline: same word count, so `minutes` and §2 hold, and §65 can't move |
| Guard sees the subtitle | planted *"You should open a credit card now."* in the en subtitle → `check-blindspot` **exit 1**, naming `lessons.js:245`; restored from a scratchpad copy (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-DpuunZ1J.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en and old ja → 0 (old en → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing asset → 404). The subtitle renders only in the lesson reader, so I set completed lessons to [1,2,3] and opened `#/lesson/4`. en: control (the title) ✓, new ✓, old ✗. ja via the real select (`lang=ja`): control ✓, new ✓, old ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Overcorrected?** "Almost" covers the exceptions: a loan from family, or a dealer that lends without checking. Dropping "purchase" loses the apartment and insurance uses, but the lesson's first section names both. **Sibling scan** (Node over `src/`, every/each/all/most + big/large/major + purchase/loan, and the old and new forms in four languages): 8 hits. 5 are this subtitle (the control). The other 3 are the 5-8 kids card fixed earlier today and its header. No new defect.
- **§10.1/§10.2:** the diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. **§10.3:** not kids content. **No date or live figure in learner text.**
- **Prior work / decisions:** the 10-16 L4 run ("still do most of the work") touched the body, not the subtitle. Nothing in "Completed and pruned" is undone. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** nothing new. The run log is 230,101 b before this entry (`check-log-size`, 2026-10-22), so W-5.3's archive pass is still due in about 4 entries. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the credit-score lesson's subtitle said the score follows you into "almost every big purchase". About a quarter of homes and around 4 in 10 cars are bought without a loan, and then no score is checked, so it now says "almost every big loan".

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-22 (scheduled dev-agent; residual of the 10-21 credit-score run, kids 5-8) — the parent guide's comparison-shopping card no longer says the habit "saves real money on every big purchase": checking a second price often pays, not always. It now says it "can save". Five languages.

Rules: W-6.2 ok (residual of a free pick; the next run may take a residual of this one only once more); W-9.4 n/a (measured accuracy fix). Baseline `npm test` at `a4041c1`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Step 3.5: the premise, measured.** Kaplan & Menzio, "The Morphology of Price Dispersion" (NBER w19877, IER 2015), via WebSearch: within one market, the same good's price has a standard deviation of about **19-36%**, and the distribution is **symmetric**. A household's whole basket varies less, 9-14%. So comparing prices often pays. That is the positive control: the habit's value isn't zero, so "can save" holds. But with a symmetric spread, in a two-store check the first store is the cheaper one about half the time, and checking then saves nothing. **Premise held:** "every" is false, and "can" is true. W-12.2 says narrow the clause, so no figure goes into learner text. **The residual's second half, groceries called a "big thing", is settled, not fixed:** next to a toy, the 5-8 card's comparison, a grocery bill is big. That reading is the child's frame and it's defensible.

#### What shipped
- `kidsContent.js` 5-8 `lessons[2].why`, one clause each. en *"…can save real money on big purchases for the rest of a person's life."* es *"puede ahorrar dinero real en las compras grandes"*. ko 「큰 지출을 할 때 실제로 돈을 아껴줄 수 있어요」. zh 「可以让人一辈子在大额购物上省下…」. ja 「大きな買い物で本当にお金を節約できる」. All five read by hand. The `text` and `activity` are unchanged.
- A dated 7-line header paragraph with the source and the reasoning. `scratchpad/edit.mjs` asserted old ×1 / new ×0 for all 6 strings, and refused on re-run (exit 1).

#### Verification
| check | result |
|---|---|
| Diff | 2 files incl. this log; `kidsContent.js` 1 line + 8 header lines |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). §65 unchanged. Changed lines: §52 (+8 scanned lines, the header) and §66: still 0/192 under threshold, and one registered read-complete pair moved above threshold (5 → 4 under, 4 → 5 inert), i.e. this card's new translation is longer relative to en |
| Guard sees the card | planted *"You should open a brokerage account now."* before the en `why` → `check-blindspot` **exit 1**; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-CknTkhmY.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en and old ja → 0 (old en → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing asset → 404). Reference → Kids: en control ("comparison shopping") ✓, new ✓, old ✗; ja via the real select (`lang=ja`): control ✓, new ✓, old ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Overcorrected?** "Can save" still endorses the habit, and the card's point stands. **Sibling scan** (Node over `src/`, every/each + purchase, comparison shopping, and the four translated forms): 13 hits. The card's own 6 are the control. The rest are L29's subtitle "Every purchase is a trade" (true by definition), an essentials thinkAbout's "write down every purchase" (an instruction to record, not a claim), and essentials L4's subtitle "almost every big purchase", already hedged. No new defect found.
- **§10.1/§10.2:** the diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0 added, and the guard plant fired. **§10.3:** the `why` stays the adult-facing rationale. **No date or live figure in learner text.**
- ⚠️ **My miss, caught before the commit:** the draft of this entry called the "Every purchase is a trade" subtitle "L1". `lessons.js` puts it at economy **id 29**.
- **Prior work / decisions:** this doesn't touch the 10-21 credit cards or any quiz, so §65 can't move. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** essentials L4's subtitle *"A number that follows you into almost every big purchase"*: a home or car loan checks credit, but most cash purchases don't. That's arguable and unmeasured. Run log is 224,965 b before this entry, so W-5.3's archive pass is due in about 5 entries. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the parent guide told 5-8 parents that comparing prices "saves real money on every big purchase". Prices for the same thing do vary a lot between stores, but sometimes the first one is the cheapest, so it now says the habit "can save".

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-21 (scheduled dev-agent; free pick, W-12.2 parent-guide sweep) — the 13-17 credit-score card no longer says a score "isn't something you build on purpose as a teenager": some families do, and essentials L4 says how. It now says you don't have to start as a teenager. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's residual, the 9-12 card's mortgage wording, was left alone); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** I read all 21 English cards plus the three activities and tips in `kidsContent.js`. The archive shows this card's clause was written on 2026-08 as §10.1 framing ("not an instruction to open credit early") and never measured.

**Step 3.5: the premise, measured.** (1) **The app contradicts itself:** essentials L4 ("Credit Scores: Your Financial Reputation"), "Starting From Zero" section: *"Being added as an authorized user on a trusted family member's older, well-managed card can also add that account's history to your own report."* (2) **CFPB, "Becoming Credit Visible" (2017)**, PDF inflated with Node (`scratchpad/pdftext.mjs`; no PDF tools here): *"The credit records of an additional 9.6 percent of consumers were created when the consumer became an authorized user"*. Table 7: 18.3% of consumers under 25 had an authorized-user account. **Control:** the same passage's "15 percent… with a co-borrower" plus 9.6 gives its own stated "about 1-in-4", so the extraction read the right numbers. (3) **Issuers:** Experian (2024) says the history is added when the child is included, "or at age 18 with some card issuers". Per-issuer claims come only from blogs, so none is in learner text. **Premise held:** a parent can build a teen's credit file on purpose, even if some issuers add it only at 18. The clause is false as a statement of fact.

#### What shipped
- `kidsContent.js` 13-17 `lessons[6].text`, one clause. en *"You don't have to start building one as a teenager — but…"*. es *"No hace falta empezar a construirlo siendo adolescente"*. ko 「십대 때부터 꼭 만들기 시작해야 하는 건 아니지만」. zh 「十几岁时不必开始建立它」. ja 「10代のうちから作り始めなければならないものではないけれど」. The card's point stays: habits first, no instruction to open credit. No figure and no mechanism in learner text. The `why` is unchanged.
- A dated 10-line header paragraph with the figures and sources. ⚠️ **My miss, caught before the commit:** my first draft said "essentials lesson 16" (the archive's 2026-08 number). `lessons.js` puts the credit-score lesson at essentials **id 4**, and §31 now checks that reference (17 → 18 references).
- `scratchpad/edit.mjs` asserted old ×1 / new ×0 per string and refused on re-run (exit 1).

#### Verification
| check | result |
|---|---|
| Diff | 2 files incl. this log; `kidsContent.js` 1 line + 10 header lines |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). The only changed lines are §31 (+1 reference, my header's) and §52 (+10 scanned lines) |
| Guard sees the card | planted *"You should open a credit card now."* before the new en clause → `check-blindspot` **exit 1**; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-DCgpMFH1.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en and ja → 0 (the old en → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing asset → 404). Reference → Kids → Ages 13-17: en control ("Real-World Economics") ✓, new ✓, old ✗. ja via the real select: control ✓, new ✓, old ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Does "don't have to" overcorrect?** It says neither "should" nor "shouldn't", so it holds under any issuer's policy. **Sibling scan** (Node, `.en.js` + glossary + kids + `locales/en.js`, both orders of teen/minor/kid ↔ credit/score within 160 chars): 0 hits other than this card and its header. Those 2 are the control.
- **§10.1:** the diff grep for `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20xx` → 0, and the guard plant fired. **§10.3:** the card keeps its read-together voice, addressed through the parent. **No date or live figure in learner text.**
- **Prior work / decisions:** this doesn't undo the 2026-08 "not an instruction to open credit early" intent. It keeps that intent and drops only the false fact. Quiz untouched, so §65 can't move. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** 5-8's comparison-shopping `why` says it "saves real money on every big purchase" (an "every" that W-12.2 would narrow), and 5-8 calls groceries a "big thing". Both are unmeasured. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the parent guide told teens' parents a credit score "isn't something you build on purpose as a teenager", but adding a teen to a parent's card does exactly that (the app's own credit-score lesson says so). It now says they don't have to start that early.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-21 (scheduled dev-agent; the previous entry's residual, kids 9-12) — the parent guide's 9-12 credit card says "Most adults borrow money for something big at some point", not "Almost every adult eventually": SCF 2022 supports "most". es also drops the false friend *eventualmente* in 3 places. Five languages.

Rules: W-6.2 ok (residual of a free pick; ⛔ the next run may take a residual of this one only once more); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** Seven entries since 10-18 call this "unmeasured (no lifetime source)"; none records a web search. Two WebSearches found no ever-borrowed figure, so I measured the floor.

**Step 3.5: the premise, measured.** Fed SCF 2022 summary extract (`scfp2022excel.zip` → `SCFP2022.csv`, 22,975 records, `scratchpad/scf.mjs`), weighted by `WGT`. "Something big" = `HMRTHEL`/`HRESDBT`/`HVEH_INST`/`HEDN_INST` > 0, held at one moment. **Controls:** all families, any debt **77.4** (Fed Table 4: 77.4), vehicle **34.7** (34.7), education **21.7** (21.8), card balance **45.2** (45.2). Any debt by age 55-64 / 65-74 / 75+ = **77.2 / 64.8 / 53.4** (EBRI's published reading of the same survey: identical). Result by head's age: <35 **73.0**, 35-44 **77.1**, 45-54 **77.1**, 55-64 65.2, 65-74 50.1, 75+ 37.7. A point-in-time share is a floor for "at some point", so **"most" is measured; "almost every" (~90%+) is neither shown nor refuted.** Narrowed per W-12.2. **Second defect, found reading the five:** es *eventualmente* means "possibly", not "eventually" (RAE returned 403; Migaku and Gymglish both call it a false friend). It appeared 3 times in src, each translating *eventually*.

#### What shipped
- `kidsContent.js` 9-12 `lessons[0].why`, first clause only. en *"Most adults borrow money for something big at some point — …"*. es *"La mayoría de los adultos pide prestado en algún momento para algo grande — …"*. ko 거의 모든 어른은 결국 → 「대부분의 어른은 언젠가」. zh 几乎每个成年人最终都会 → 「大多数成年人都会在某个时候」. ja 大人になればほとんどの人が → 「大人の大半は、いつか」. No figure in learner text. A dated paragraph goes in the file header, with the figures and controls.
- es *eventualmente* → *tarde o temprano*: `quizText.es.js` stem *"¿Por qué el ciclo de deuda a largo plazo tiene que girar tarde o temprano?"* and `glossary.js` "Deleveraging" `ex` *"Un país abrumado por la deuda tarde o temprano tiene que desapalancarse…"*. Options, answer index and explains unchanged. `quizText.es.js:328`'s *"la eventual opción"* stays: the adjective means "possible", which is right there.
- `scratchpad/edit.mjs` asserted old ×1 / new ×0 per string and refused on re-run; all five hand-read.
- ⚠️ **My miss, caught by the bundle probe:** my src scan listed the glossary hit, but I misread it as English. The post-build *eventualmente* probe returned 1 asset, and that is how the third string got fixed. Read each hit's text, not just its file.

#### Verification
| check | result |
|---|---|
| Diff | 4 files incl. this log; `kidsContent.js` 1 line + 10 header lines, `quizText.es.js` 1, `glossary.js` 1 |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). §65 and §66 (*"0/192 pair(s) under 70%"*) identical to baseline; the only changed line is §52's scanned-line count (+9, the header) |
| Guard sees the card | planted *"You should open a Roth IRA now."* before the new en clause → `check-blindspot` **exit 1**; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-CoxVbxwD.js`, system Node v24.18.0 |
| Bundle | 5 new kids probes + 2 *tarde o temprano* probes each in 1 asset; *"Almost every adult"* → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); *eventualmente* → 0; nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing file → 404). Reference → Kids → Ages 9-12: en control ("How Money Moves") ✓, new ✓, old ✗; es via the real select: control ✓, new ✓, *eventualmente* ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Still true?** The floor is 73-77% at every head age under 55, counting only home, vehicle and education loans, not card balances. **Sibling scan** (`almost every|nearly every|most adults…` within 80 chars of `borrow|debt|loan|mortgage`, all `src/`): 0 new hits. **Control:** the old string in the new header comment fired.
- **§10.3:** the card stays parent-facing. Only the `why` clause changed; the `text` still addresses the child through the parent. **§10.1/§10.2:** diff grep `dalio|bridgewater|you should|recommend|buy now|should buy|as of 20` → 0. No date or live figure in learner text.
- **Prior work / decisions:** this doesn't touch the 10-11 seasons or paycheck cards. Quiz options are unchanged, so §65's ceiling (W-12.1) can't move. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 4.

**Seen, not fixed:** the lifetime share is still unknown (a cohort source like PSID would settle it); the card no longer depends on it. The card's `text` opens *"When your parents borrow money for a house"*, assuming a mortgage; arguable, not measured. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the parent guide told parents "almost every adult" borrows for a car, home or education. Fed survey data supports "most" (about three in four families under 55 have such a loan at any one time), so it now says that. Spanish also stopped using *eventualmente* to mean "eventually", in three places.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-21 (scheduled dev-agent; free pick, the 10-19/10-20 "Seen, not fixed" guard gap) — `check-blindspot` §10.1 now catches "You should open/put/move…", not only "buy/sell/invest", in all five languages. The class carries the same must-fire control as the timing class. No content change.

Rules: W-6.2 ok (free pick; the note was filed by two runs and picked by neither); W-9.4 n/a (guard, not prose). W-6.2 rule 3, the learner-visible failure: a lesson line telling the reader *"You should open a Roth IRA now"* would reach learners with `npm test` green. W-6.3: `scripts/` 24,311 lines vs app code (`src/` minus content and locales) 10,681 = **2.28x**; this adds net +18 lines to a check that already exists. Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.** I planted each sentence in `lessonContent.essentials.en.js` before the "Traditional vs Roth" text and ran `check-blindspot`. *"You should open a Roth IRA now."* → **exit 0**, *"You should put your savings in index funds."* → **exit 0**, *"You should move your money into bonds."* → **exit 0**. **Control:** *"You should buy stocks now."* → **exit 1**. The premise held: the pattern listed only buy/sell/invest. **Corpus first:** a Node scan of `src/content`, `src/locales` and `index.html` (39 files, `\n` expanded) finds **0** "you should / ought to / 'd better" in English. Every Spanish *debería*, Korean *-야 합니다*, Chinese *应该* and Japanese *べき* hit was listed by hand. None uses an added verb, so the widening has 0 live false positives. It also found that Japanese uses the short する-verb form (判断すべき, 調整すべき), and the old pattern's `投資するべきです` missed **投資すべきです**.

#### What shipped
- `scripts/check-blindspot.mjs`: the five per-language "should <verb>" lines move into a `directive` list with `fires` samples (held as `DIRECTIVE_ADVICE`). Added verbs: en open/put/move/transfer, plus *ought to* / *had better* / *'d better*. es abrir/poner/mover/transferir. ko 열어야/개설해야/넣어야/옮겨야. zh 开立/开设/开户/转入. ja 開設す(る)/開く/移す, and the すべき form. Every old verb is still in place. **"need to" is left out on purpose:** *"you need to open an account to buy shares"* describes how something works. The pattern count is unchanged at 34 (20 + 9 timing + 5 directive).
- The item-164 control now checks timing and directive entries together, so a dead pattern fails the build. ⭐ **It caught my first draft:** `you (…|'d better)` needs a space before *'d*, so *"You'd better move…"* could never match. Fixed to `you( should| ought to| had better|'d better)`.

#### Verification
| check | result |
|---|---|
| Diff | 2 files incl. this log; `check-blindspot.mjs` +26 / −8 |
| Plants, paragraph-initial (after `Intro.\n\n` in the first `"body"`) | en open / put / move, es *abrir*, ko *개설해야*, zh *开立*, ja *投資すべきです* → **exit 1** each. Descriptive *"You need to open an account to buy shares."* → **exit 0** (must stay clean). Each restored from a scratchpad copy (`cmp` equal) |
| `check-blindspot` | exit 0: "14 timing and directive pattern(s) each fire…", 34 advice patterns |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1, unchanged |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BPTi_IxO.js` (same as 10-20: no `src/` change), system Node v24.18.0 |

#### Step 5: adversarial self-check
- **Did anything get narrower?** Each old regex is a subset of its replacement: same verbs, and for ja `投資す(る)?` covers `投資する`. The en pattern still has no leading `\b`, as before. *"You should buy stocks now."* is a `fires` sample, so losing it would fail the build.
- **Future false positives:** ko 넣어야/옮겨야 could match non-money prose (*"공식에 숫자를 넣어야 합니다"*). Live hits are 0. If one appears, narrow the verb, not the check.
- **§10.1/§10.2/§10.3, decisions, prior work:** no content or UI touched. This builds on items 145 and 164 and undoes neither. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2.

**Seen, not fixed:** the 10-19/10-20 notes' *"check-blindspot misses 'You should open…'"* is closed by this entry. A bare imperative (*"Open a Roth IRA now."*) still passes; a pattern for that would hit how-to prose, so it's a judgment call left to the per-run read. Kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` and the uncommitted `public/data/market.json` (asOf 10-20) aren't mine and are left alone. **W-8.1:** committed, not deployed. Per W-12.5, live Sectors goes stale today (Wed 10-21) without a push; that's the owner's call.

**Owner-facing, one line:** the safety check that blocks investment advice in lessons only knew "you should buy/sell/invest". It now also blocks "you should open an account / put or move your money", in all five languages.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-20 (scheduled dev-agent; free pick, W-12.2: the 10-19 glossary entry's L6 residual) — essentials L6's takeaway no longer says the account type "mainly changes when the tax bill comes due": in a Roth, growth is usually never taxed. It now says the account type changes "when, or whether, its growth is taxed". Five languages.

Rules: W-6.2 ok (free pick; the previous run's residuals were measured first, see below); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** I measured the previous entry's residual first. L39 Expansion *"CPI near the Fed's target"*: FRED `CPIAUCSL` YoY over every `USREC`=0 month since 1948 (`scratchpad/exp.mjs`). **Controls:** 2022-06 = 8.98, 1980-03 = 14.59, 2015-06 = 0.18 (published ≈9.0 / 14.6 / 0.1-0.2). FRED's missing 2025-10 value is skipped, with a calendar lookback. The median expansion month is **2.8%**; 45% of months are in 1-3% (63% since 1983), and 26% are above 4% (1970s). In 9 of 11 expansions, CPI rose ≥0.5 pt from the first year to the last. **It holds loosely as "a normal reading", so I left it alone.** So I took L6's takeaway, flagged 09-11, 10-06 and 10-19 and never picked: the defect the 10-19 glossary fix closed.

**Step 3.5: the premise, measured.** IRS *Roth IRAs* (WebFetch summarizer): *"You cannot deduct contributions to a Roth IRA"* and *"qualified distributions are tax-free"*. The 10-19 entry's designated-Roth FAQ adds *"(including earnings)"*. **Control, the same instrument on *Traditional IRAs*:** amounts *"are not taxed until you take a distribution"*, and it reports no tax-free claim. **Held:** a Roth is funded with taxed money, like a brokerage account, so it doesn't change *when* tax is paid on contributions. It removes the tax on growth. "Mainly changes when" is true of Traditional only. It contradicted L6 §1.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L6 takeaway, first clause only. en *"The account type mainly changes when, or whether, its growth is taxed, not the kind of investment inside it — …"*. es *"…cuándo tributa su crecimiento, o si llega a tributar, no…"*. ko 「…불어난 수익에 세금이 언제 붙는지, 혹은 아예 붙지 않는지이지, …」. zh 「…增值部分什么时候缴税、甚至要不要缴税，而不是…」. ja 「…増えた分にいつ税金がかかるか、そもそもかかるかどうかで、…」. The growth nouns are each language's §1 terms. No figure (W-11.2). ⚠️ **My first draft added a parenthesis, *"(in a Roth, usually not at all)"*, +6 words. That pushed L6 from 3 to 4 min, and `check-data` §2 failed on it.** I cut it to "when, or whether" (+1 word), and minutes held at 3. `scratchpad/l6.mjs` and `l6b.mjs` asserted old ×1 / new ×0 per file, and a re-run refuses. I hand-read all five.
- L6 es/ko/zh/ja re-marked `ai` (ledger 16 lines). `readiness --write` changed numbers only: en **167,701 → 167,711** chars (+0.12% since W-12.1's 167,511; the allowance is 0.5%).

#### Verification
| check | result |
|---|---|
| Diff | 8 files incl. this log; content 5×1 line, ledger 16, LAUNCH_READINESS 2 rows, numbers only |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. With HEAD's ledger and the first draft: exit 1 (§2 minutes 3≠4, §10.4 disagreeing), so the guards saw the edit |
| Guard sees the lesson | planted *"You should open a Roth IRA now. You should invest now."* after the takeaway → `check-blindspot` **exit 1** (it fires on *invest*; *open* is still the 10-19 known gap); restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-BPTi_IxO.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing file → 404). Lessons 1-5 seeded, `#/lesson/6`: en shows control ("Traditional vs Roth") ✓, new ✓, old ✗; zh via the real select: control ✓, new ✓, old ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Still true?** Traditional: growth taxed at withdrawal ("when"). Roth: qualified withdrawals tax-free ("whether"). Both halves now match §1 and the 10-19 glossary. A Node scan of English content and the glossary for when-only wording (`changes … when the tax|defers that tax`) → 0. **Controls:** HEAD's L6 → 1, the pre-10-19 glossary → 1.
- **§10.1/§10.2/§10.3:** compares account mechanics and recommends none. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|best account|open a roth|as of 20` → 0. No date or figure.
- **Prior work / decisions:** this keeps the 10-06 run's 401(k)-menu clause and the 09-11 §1 fix word for word. It changes the one clause both left. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**Seen, not fixed:** `check-blindspot` still misses *"You should open…"* (10-19 note). Kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed. Per W-12.5 the live `market.json` goes stale Wed 10-21 without a push; that's the owner's call.

**Owner-facing, one line:** the retirement-accounts lesson ended by saying the account type mainly changes *when* you pay tax. With a Roth, the growth usually isn't taxed at all, so it now says "when, or whether".

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-20 (scheduled dev-agent; free pick, W-12.2 sweep of economy L36-39) — L39's Trough line no longer says the CPI gauge reads "low" there. Inflation has usually kept falling for months after the recovery began, so it now says CPI is usually still cooling. Five languages.

Rules: W-6.2 ok (free pick; the previous two runs left only the unmeasurable kids 9-12 line); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** I read L36-39 by meaning; L36-38 hold only claims the archive already measured. L39 §2's Trough line lists *"GDP near its low point, CPI low, …"*. The 09-11 run that fixed the Contraction clause (archive) left it with *"inflation is typically at its cycle low there"*, asserted, not measured.

**Step 3.5: the premise, measured.** FRED `CPIAUCSL` and `USREC` (keyless CSV), YoY at each of the 12 NBER troughs since 1949, compared with the low over the next 24 months (`scratchpad/trough.mjs`). **Controls:** the trough months it derives match NBER's 12 dates; YoY for 2022-06 = 8.98 and for 1980-03 = 14.59 (published ≈9.0 and 14.6 SA). The instrument can say "at the low": it did for 3 troughs. **Result:** in **9 of 12**, inflation kept falling by ≥0.5 pt for another **7-24 months** (e.g. 1975-03: 10.5% → 5.0% by 1976-12; 1991-03: 4.8% → 2.7%). Only 1949, 2009 and 2020 bottomed at or within a month of the trough. As a level, 6 of 12 troughs were above 2.5%, including 10.5% (1975) and 13.2% (1980). **The premise held:** "CPI low" is wrong as a level and wrong as "at its cycle low". It is right as a direction, which is also how the sentence describes the other four gauges. No figure added (W-11.2).

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js`, L39 §2 Trough, one clause each. en *"CPI usually still cooling (inflation tends to keep falling for months after the recovery begins)"*. es *"el IPC suele seguir enfriándose (la inflación tiende a seguir bajando durante meses después de que empieza la recuperación)"*. ko 「CPI는 대개 아직 식고 있으며(인플레이션은 회복이 시작된 뒤에도 몇 달 동안 계속 내려가는 경향이 있습니다)」. zh 「CPI通常仍在降温（通胀往往在复苏开始后还会继续回落好几个月）」. ja 「CPIはたいていまだ冷え続けており（インフレ率は回復が始まってからも数か月は下がり続ける傾向があります）」. The cooling verbs are the ones each language's Contraction clause already uses. `scratchpad/l39.mjs` asserted old ×1 / new ×0 per file, then the reverse, and a re-run refuses. I hand-read all five.
- L39 es/ko/zh/ja re-marked `ai` (ledger 24 lines). `readiness --write` changed numbers only: en **167,612 → 167,701** chars (+0.11% since W-12.1's 167,511; allowance 0.5%). LAUNCH_PLAN §4.0's rounded word count moved 29,300 → 29,400.

#### Verification
| check | result |
|---|---|
| Diff | 9 files incl. this log; content 5×1 line, ledger 24, LAUNCH_READINESS 2 rows, LAUNCH_PLAN 1, numbers only |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. Before re-marking: exit 1 (1 stale per language, §10.4 disagreeing), so the guard saw the edit |
| Guard sees the lesson | planted *"You should buy stocks now,"* after the new en clause → `check-blindspot` **exit 1** at economy.en.js; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-CeUB2yNu.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (missing file → 404). Seeded 29-38 as numeric ids plus `ecycles_legacy_lesson_id_migrated` (string ids read as 0/44 and bounce to `#/learn`). en `#/lesson/39`: control ✓, new ✓, old ✗. ko via the real select: first read all-false, control included (chunk loading); re-read control ✓, new ✓, old ✗. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **Still true?** "Usually" and "tends to" carry 9 of 12, and "for months" sits inside the measured 7-24. The clause now agrees with the Contraction line's "CPI cooling" and with CPI being a lagging gauge. A Node scan of English content for trough-and-low-inflation wording → 0 hits. **Control:** HEAD's copy → 1 (the old clause). L38 and the Dashboard make no trough-inflation claim (grep → 0).
- **§10.1/§10.2/§10.3:** describes a gauge and names no asset or action. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|as of 20` → 0. No date or figure.
- **Prior work / decisions:** this completes the 09-11 run's "CPI cooling" fix, which named this clause and left it alone. It doesn't touch the 09-19 Peak "drifted above target" check (measured, held). **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 9.

**Seen, not fixed:** L39 §2 Expansion's *"CPI near the Fed's target"*: the Fed has had a formal 2% target only since 2012, and 1970s expansions ran far above it. It's arguable as "what a normal reading looks like", and not measured. Kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed. Per W-12.5 the live `market.json` goes stale Wed 10-21 without a push; that's the owner's call.

**Owner-facing, one line:** the indicators lesson said inflation reads "low" at the bottom of a recession. Usually it is still falling and keeps falling for months into the recovery (in 1975 it was 10.5%), so it now says that.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-20 (scheduled dev-agent; the previous entry's residual, L27's "paperwork") — L27 no longer says that when you sell an investment at a loss "only the paperwork changes": in a taxable account a realized loss can offset gains and some income. It now says selling records the loss rather than causing it. Five languages.

Rules: W-6.2 ok (residual of a free pick, so the next run may take a residual of this one only once more); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** The previous entry's "Seen, not fixed" named L27 §2: *"The money is already lost either way; only the paperwork changes at the moment of selling."* It called this "arguable; not measured". `paperwork` gets 0 hits in the archive, CLAIMS and DECISIONS, and 1 in this log (that note). The kids 9-12 line still has no lifetime source.

**Step 3.5: the premise, measured.** IRS Topic 409 (WebFetch summarizer): when capital losses exceed gains, the excess is deductible up to *"the lesser of $3,000 ($1,500 if married filing separately)"*, and the rest carries forward. Gains and losses are tied to a sale. **Control, same instrument and page:** asked whether personal-use losses are deductible, it quoted *"…aren't tax deductible"*, so it reports a no when the page says no. **Held:** in a taxable account, selling at a loss can change the tax bill, so "only the paperwork" is false there. It is still true that the loss already happened. The fix narrows the clause and adds no tax mechanics or figure (W-12.2, W-11.2). A tax-loss sentence would sit next to advice language.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L27 §2, one sentence each. en *"…; selling records the loss rather than causing it."* es *"…; vender registra la pérdida, no la causa."* ko 「…— 파는 것은 손실을 기록하는 것이지, 손실을 만들어내는 것이 아닙니다.」 zh 「…；卖出是把亏损记录下来，而不是造成亏损。」 ja 「…——売ることは損失を記録することであって、損失を生み出すことではありません。」 I kept "only"/뿐/只是/だけ out of the CJK on purpose, since that word was the defect. `scratchpad/l27.mjs` asserted old ×1 / new ×0 per file, then the reverse; a re-run refuses. I hand-read all five.
- L27 es/ko/zh/ja re-marked `ai` (ledger 24 lines, lesson 27 only; the reviewer string moves from "Opus 5" to "Opus 5.5"). `readiness --write` changed numbers only: en **167,616 → 167,612** chars (+0.06% since W-12.1's 167,511; allowance 0.5%).

#### Verification
| check | result |
|---|---|
| Diff | 8 files incl. this log; content 5×1 line, ledger 24, LAUNCH_READINESS 2 rows, numbers only |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. Before re-marking: exit 1 (1 stale per language, §10.4 disagreeing), so the guard saw the edit |
| Guard sees the lesson | planted *"You should buy a home now."* after the new en clause → `check-blindspot` **exit 1** at money.en.js:195; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-heXjeZFA.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (`/` 200, missing file → 404). `#/lesson/27`, other lessons seeded: en shows the new clause and not the old one. ⚠️ ko's first read returned all-false, **control included**, because it ran before the reload had rendered. A re-read gave control ✓, new ✓, old ✗. Body sentence only, so no layout check |

#### Step 5: adversarial self-check
- **Still true?** A sale records a decline that already happened, in any account type, so the clause holds where the old one failed (taxable accounts). The paragraph's point, that the loss is sunk, is unchanged. A Node scan of English content for `only the paperwork|paper loss|nothing changes when you sell|selling doesn't change|records the loss` → 1 hit, the new clause. **Control:** HEAD's copy → 1 (the old clause).
- **§10.1/§10.2/§10.3:** says nothing about whether to sell. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|tax-loss|harvest|as of 20` → 0. No date or figure.
- **Prior work / decisions:** this doesn't touch the 10-12 loss-aversion range fix in §1 or the 10-20 L13 tax clause. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**Seen, not fixed:** kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed. Per W-12.5 the live `market.json` goes stale Wed 10-21 without a push; that's the owner's call.

**Owner-facing, one line:** the loss-aversion lesson said selling at a loss changes "only the paperwork". In a taxable account it can also lower your tax bill, so now it just says selling records the loss rather than causing it.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-20 (scheduled dev-agent; free pick, W-12.2 sweep by meaning: policy simulator, signals, money and essentials lessons) — essentials L13 no longer says a taxable brokerage account is taxed only when an investment is sold for a profit: dividends and interest are taxed in the year they're paid, as L6 and the glossary already say. Five languages.

Rules: W-6.2 ok (free pick; the kids 9-12 line is still unmeasurable); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** Read by meaning. Clean: `policyScenarios.js`, `economicSignals.js` (checkable claims already measured in the archive; labels match `fred.js`), money L21/24/26/27. Essentials L2/9/10/13/14/15 gave one: L13 §1 names only *"gains are taxed as they're realized — when an investment is sold for a profit"*, while the same section describes sweep interest. Item 86 (08-20) fixed L6 to name both halves and left L13 with one. `dividends and interest`: 0 hits in log, archive, CLAIMS, DECISIONS.

**Step 3.5: the premise, measured.** IRS Pub 550 (downloaded, tags stripped in Node): *"you are considered to receive interest, dividends, or other earnings … when they are credited to your account and subject to your withdrawal"*, and *"Report amounts you receive from money market funds as dividend income"*, which covers one of L13's own sweep destinations. IRS Topic 404 agrees. **Controls:** Topic 409 (same summarizer) ties gains to a sale and says nothing on yearly dividend tax; a phrase absent from Pub 550 returned -1. **Held:** holding without selling is not tax-free.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L13 §1, one clause each. en *"…but dividends and interest are taxed in the year they're paid, and gains are taxed as they're realized — when an investment is sold for a profit — rather than…"*. es *"los dividendos y los intereses se gravan el año en que se pagan, y las ganancias…"*. ko 「배당금과 이자는 지급된 해에, 차익은 … 실현되는 시점에 과세되며」. zh 「但股息和利息要在派发当年缴税，收益则会在实现时…」. ja 「配当や利息は支払われた年に、値上がり益は実現時…」. The terms are L6's in each language. No figure added (W-11.2). `scratchpad/l13.mjs` asserted old ×1 / new ×0 per file, then the reverse, and a re-run refuses. I hand-read all five sentences in full.
- `lessonTerms.js` 13 §0 gains a `Dividend` chip: §3.0.3 failed on the new use, same sense as the glossary entry.
- L13 es/ko/zh/ja re-marked `ai` (ledger 16 lines). `readiness --write` changed numbers only: en **167,553 → 167,616** chars (+0.063% since W-12.1's 167,511; the allowance is 0.5%).

#### Verification
| check | result |
|---|---|
| Diff | 9 files incl. this log; content 5×1 line, lessonTerms 1, ledger 16, LAUNCH_READINESS 2 rows, numbers only |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. Before the chip and re-marks: exit 1 (4 stale, §10.4 disagreeing, §3.0.3 naming "Dividend"), so the guards saw the edit |
| Guard sees the lesson | planted *"You should buy a home now."* after the new en clause → `check-blindspot` **exit 1** at essentials.en.js:230; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` green, `index-B1i6J-fX.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (404 control → 404). `#/lesson/13`, lessons 1-12 seeded: en shows the new clause and not the old one, plus a "Dividend" chip; ko is the same, with a 배당금 chip. Body paragraph only, so no layout check |

#### Step 5: adversarial self-check
- **Still true?** "In the year they're paid" is constructive receipt, per Pub 550. Tax-exempt municipal interest is the edge case, but "taxed" is still the normal treatment for a beginner's account, as in L6. A Node scan for sale-only tax wording (`taxed only when|not taxed until … sold|taxed when … sold|taxed as they're realized`) finds only L13 itself. **Control:** HEAD's copy → 1. The glossary, money and economy lessons → 0.
- **§10.1/§10.2/§10.3:** describes a tax mechanism and recommends no account. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|best account|as of 20` → 0. No date or live-looking figure.
- **Prior work / decisions:** this completes item 86's 08-20 principle ("both halves are named") in the one lesson it left. It doesn't touch L6 or the glossary's 10-19 Roth fix. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 9.

**Seen, not fixed:** L27 §2, selling at a loss, *"only the paperwork changes"*: a realized loss can offset gains. Arguable (the point is the loss is sunk); not measured. Kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the brokerage lesson implied a regular investment account owes no tax until you sell. Dividends and interest are taxed every year, so it now says that, matching the retirement lesson.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-19 (scheduled dev-agent; free pick, W-12.2 sweep of the glossary, by meaning rather than quantifier) — glossary "Brokerage Account" no longer says "a 401(k) or IRA defers that tax": that is true only of the Traditional versions. It now says they put off the tax until withdrawal or, in the Roth version, can remove it altogether. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's kids line is still unmeasurable); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** This morning's glossary sweep was a quantifier scan, so it could only catch overstatements. I read all 43 English entries for wrong mechanisms instead. One had no measurement anywhere (`defers that tax` gets 0 hits in the log, archive, CLAIMS and DECISIONS): "Brokerage Account" said that *"a 401(k) or IRA defers that tax"*. The 09-11 L6 entry already flagged the same flaw in L6's takeaway (*"for a Roth the growth is never taxed rather than taxed later"*) but didn't pick it. L6 §2, the IRA entry and the essentials brokerage lesson all describe Roth correctly.

**Step 3.5: the premise, measured** (IRS pages, read through WebFetch's summarizer). *Roth IRAs*: *"qualified distributions are tax-free"* and *"You cannot deduct contributions to a Roth IRA."* *Retirement plans FAQs on designated Roth accounts*: eligible distributions *"(including earnings) are generally tax-free"*. **Control, the same instrument on the Traditional IRA page:** amounts *"are not taxed until you take a distribution"*, so the summarizer tells deferral apart from exemption. **Held:** "defers" is right for Traditional accounts and wrong for Roth ones, and both the 401(k) and the IRA come in a Roth version.

#### What shipped
- `src/content/glossary.js` "Brokerage Account" `f`, one clause in each of five languages. en *"…while a 401(k) or IRA puts off that tax until withdrawal or, in its Roth version, can remove it altogether."* ko 「…인출할 때까지 미루고, 로스 방식이라면 아예 없앨 수도 있습니다」, es *"…hasta el retiro o, en su versión Roth, pueden eliminarlo por completo"*, zh 「…推迟到取款时，罗斯型甚至可以完全免除」, ja 「…引き出し時まで先送りし、ロス型なら課税そのものがなくなることもあります」. Roth terms match each IRA entry. No figure added (W-11.2). A 5-line comment above the entry records the old text and the sources.
- `scratchpad/brok.mjs` asserted old ×1 / new ×0 per string, and the reverse after; a re-run refuses. All five strings hand-read against the English. The glossary is outside the translation ledger (file header), so nothing was re-marked; lesson chars are unchanged at 167,553.

#### Verification
| check | result |
|---|---|
| Diff | 1 source file, 6+/1− (one line holds all five strings, plus the comment) |
| `npm test` after | exit 0 (read directly, not through a pipe), 0 FAIL, 1 WARN (O-3's); §65 unchanged |
| Guard sees the entry | planted *"You should buy a home now."* after the new en clause → `check-blindspot` **exit 1**, naming glossary.js:84; restored (`cmp` equal) → **exit 0**. ⚠️ My first plant, *"You should open a Roth IRA now."*, got **exit 0**: the guard matches literal phrases only, as its header says |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `index-rw59GL3L.js`, system Node v24.18.0 |
| Bundle | 5 new probes each in 1 asset; old en clause → 0 (→ 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (404 control → 404). Reference → Glossary: en shows the new clause and not the old one, and the entry's `ex` control is present. ko after `ecycles_lang=ko` is the same. At 320px the ko line is 288 wide and the page's scrollWidth is 320 |

#### Step 5: adversarial self-check
- **Still true?** Traditional: tax at withdrawal (IRS). Roth: qualified withdrawals are tax-free, earnings included (IRS), and non-qualified ones may not be, so it says "can". A Node scan of all English `src` for `tax-deferred|defers tax|postpones tax|puts off that tax` finds 2 hits: my new clause (the control) and the essentials lesson, which is already correct.
- **§10.1/§10.2/§10.3:** describes a tax mechanism and recommends neither version. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|open a roth|choose roth|best account|as of 20xx` → 0. No date or live-looking figure renders.
- **Prior work / decisions:** this brings the glossary into line with L6's 09-11 fix and the IRA entry, and touches neither. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2 (glossary.js, AGENT_LOG.md).

**Seen, not fixed:** `check-blindspot` doesn't catch *"You should open a Roth IRA now."*, because its literal list has `should buy` but not `should open`. A known limit (header). L6's takeaway, *"mainly changes when the tax bill comes due"*, is still the hedged simplification the 09-11 entry left. Kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the glossary said retirement accounts only delay tax on investment gains. For Roth accounts, the tax on growth can be gone entirely, so now it says that.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-19 (scheduled dev-agent; the previous entry's residual, L30's car loan) — L30 no longer says of a car loan's new credit that "nobody had to save it first": about a third of US car loans come from finance companies, which lend investors' money. The credit is still new, "a promise to pay that didn't exist a moment ago". Five languages.

Rules: W-6.2 ok (residual of a free pick, so the next run may take a residual of this one only once more); W-9.4 n/a (measured accuracy fix). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** The previous entry's "Seen, not fixed" named two residuals. Kids 9-12 *"Almost every adult eventually borrows…"* still has no lifetime source. The other was L30 §1: *"$15,000 of brand-new credit is created out of thin air — nobody had to save it first"*, two sentences after a lender list that names *"the dealership itself"*. It had 0 hits in the log, archive, CLAIMS and DECISIONS before that entry.

**Step 3.5: the premise, measured.** The claim holds for a deposit-taking lender, since a bank or credit union creates the deposit when it lends. It fails for a lender that funds itself by borrowing.
- **Fed G.20 / G.19, keyless FRED CSV:** consumer motor-vehicle loans owned and securitized by **finance companies** (`DTCTLNVHFNM`) were **$554.9 B** at 2024-10, against **$1,568.6 B** in total (`MVLOAS`, last reading 2024-10). That's **35.4%**. Finance companies borrow from bond, ABS and commercial-paper investors, which is someone's savings.
- **Control, an independent source:** Experian Q2 2025: captives **26.63%** of total auto financing, banks 27.50%, credit unions 21.04%. Its definitions differ from the Fed's, but both put non-depository lenders at a quarter to a half. **Held:** the clause is false for about a third of car loans, including the dealership case the lesson names (captives: 52% of new-car financing).
- The credit itself, the asset/liability pair in the next sentence, is new whoever lends. So the fix narrows the clause and adds no bank mechanics.

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js`, L30 §1, one clause replaced. No figure added (W-11.2). en *"…is created out of thin air: a promise to pay that didn't exist a moment ago."* es *"…: una promesa de pago que un momento antes no existía."* ko *"… — 조금 전까지는 없던 상환 약속입니다."* zh *"——一份片刻之前还不存在的还款承诺。"* ja *"少し前まで存在しなかった、返済の約束です。"* `scratchpad/l30.mjs` asserted old ×1 / new ×0 per file, the reverse after; a re-run refuses. All five sentences hand-read against the English.
- L30 es/ko/zh/ja re-marked `ai` (ledger 24 lines, lesson 30 only). `readiness --write` changed only numbers: en **167,534 → 167,553** chars (+0.026% since W-12.1's 167,511; W-12.6(iii) allows 0.5%).

#### Verification
| check | result |
|---|---|
| Diff | 8 files incl. this log; content 5×1 line, ledger 24, LAUNCH_READINESS word-diff = 6 numbers only |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. Before re-marking: exit 1, 1 stale per language and §10.4 disagreeing, so the guard saw the edit |
| Guard sees the lesson | planted *"You should buy a car now."* after the new en clause → `check-blindspot` **exit 1**, naming economy.en.js:44; restored (`cmp` equal) → **exit 0** |
| §10.2 overlap | sozai.app transcript (200, 33,431 b, same size as 10-17; bad slug → 404). 7-word runs shared with the new en sentence: **0**. Control: L31's old verbatim line → **9** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-CZKfFMBs.js`, system Node v24.18.0 |
| Bundle | 5 new probes (one per language) each in 1 asset; old en clause → 0 (and → 1 in HEAD's `./dist`, so the probe can fire); nonsense → 0 |
| Live | built `dist/` served statically (404 control → 404). `#/lesson/30` with lesson 29 seeded as complete: en shows the new sentence and not the old one. ko after `ecycles_lang=ko` is the same. Body paragraph only, so no layout check was needed |

#### Step 5: adversarial self-check
- **Still true?** The new clause holds for every lender type. "Out of thin air" now describes the credit, as §2's bar tab does, not the lender's cash. No quiz question relies on the old clause (`quizText.en.js` grep → 0).
- **§10.1/§10.2/§10.3:** describes a mechanism, no advice. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now` → 0. The 7-gram overlap is 0. No date or live-looking figure renders.
- **Prior work / decisions:** this doesn't touch L30's §2 credit-vs-M0 gap (measured earlier) or the 10-15 L16 fix, which kept L30's accountant's sense of asset/liability, and this keeps it too. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**Seen, not fixed:** kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured (no lifetime source). Nothing new turned up. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the credit lesson said nobody had to save the money for a car loan first. That's false for the roughly a third of car loans made by finance companies, so now it just says the credit is new.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-19 (scheduled dev-agent; free pick, W-12.2 sweep of the essentials lessons) — essentials L12: a renter can move with a month or two of notice "at the end of a lease", not at any time. About 68% of US leases are fixed-term. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's kids line is still unmeasurable, see below); W-9.4: this is a content fix, not a short-string hand-read pick. Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** Quantifier scans with a planted *"Prices always rise."* control that fired (`scratchpad/quant.mjs`, `lq.mjs`). They covered `markets.js`, `sectors.js`, `moneyVisuals.js`, quiz explanations, the economy lessons and the essentials lessons. Each hit was checked against the log, archive and CLAIMS. Everything checkable was already measured (nested-cycles caption, q021's take-home line, q005's inversions, the gap figure) except one essentials L12 clause with 0 hits in all three: *"…and a renter can typically move with a month or two of notice."* The sentence before it says rent buys a *fixed period*, and the clause has no scope, so it reads as "any time".

**Step 3.5: the premise, measured.** BLS, "Housing leases in the U.S. rental market" (Spotlight 2022, CPI Housing Survey Jan-Jun 2022): **59.6%** of leases are 12-month, **31.8%** month-to-month, **8.6%** other lengths (most often 24-month). **Control:** the three shares sum to 100.0. They also match the same page's state detail, with month-to-month highest in CA (62.7%). So about **68%** of renters are on a fixed term, and for them, leaving mid-lease with a month's notice usually means a penalty. The lease defines it, as the BLS page itself says. **Held:** "typically" is false at most points of most leases, and true at the lease's end or on month-to-month.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L12 §1, one clause narrowed. No figure added (W-11.2). en *"…and at the end of a lease, a renter can typically move with a month or two of notice."* es *"y, al terminar el contrato, …"*, ko *"계약 기간이 끝나면 세입자는 보통…"*, zh *"而租约到期时，租客通常…"*, ja *"契約期間の終わりには、借主は通常…"*. Each old string matched exactly once before replacing. I hand-read each new sentence in full against the English.
- L12 es/ko/zh/ja re-marked `ai` (ledger 16 lines). `npm run readiness -- --write` changed only numbers: en **167,511 → 167,534** chars (+0.014%; W-12.6(iii) allows 0.5%), lesson time 177 min unchanged.

#### Verification
| check | result |
|---|---|
| Diff | 8 files incl. this log; content 5×1 line, ledger 16, LAUNCH_READINESS word-diff = 6 numbers only |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged. Before re-marking: exit 1, 4 stale and §10.4 disagreeing, so the guard saw the edit |
| Guard sees the lesson | planted *"You should buy a home now."* after the new en clause → `check-blindspot` **exit 1**, naming essentials.en.js:216; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-BE355T2x.js`, system Node v24.18.0 |
| Bundle | 5 new probes (one per language) each in 1 asset; old en clause → 0; nonsense → 0 |
| Live | `dist/` served statically (404 control → 404). `#/lesson/12` with progress seeded: en shows the new clause, the old one is absent; ko after a language switch is the same. Body paragraph only, so no layout check was needed |

#### Step 5: adversarial self-check
- **Still true?** At the end of a fixed-term lease, 30-60 days' notice is the usual non-renewal term, and month-to-month renters can always leave that way, so "at the end of a lease" covers both. It doesn't say mid-lease moves are impossible, only that they aren't the typical case. Korean renters' usual 2-year 전세/월세 contract makes the ko version more accurate, not less.
- **§10.1/§10.2/§10.3:** describes a trade-off, no advice. The diff grep `dalio|bridgewater|should buy|you should|recommend|buy now` hits only pre-existing LAUNCH_READINESS row text, since the word-diff is numbers only. No date or live-looking figure renders.
- **Prior work / decisions:** this doesn't touch L12's down-payment, commission or 30-year crossing figures (09-19, 10-13). **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**W-12.2's Bonds note, second read (W-9.4):** I read all five strings during the scan. No defect found. zh 价格波动最大 is the usual Chinese duration phrasing, and every language names both price and yield. **Settled.**

**Seen, not fixed:** kids 9-12 *"Almost every adult eventually borrows…"* is still unmeasured (no lifetime source). L30's car loan is *"created out of thin air — nobody had to save it first"*, and the lender list includes non-bank lenders (captive finance companies fund from investors). It's arguable, since the credit pair is still created. Not measured, not picked by default. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the renting lesson said renters can typically move with a month or two of notice. Most US leases are 12-month, so it now says at the end of a lease.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-19 (scheduled dev-agent; free pick, W-12.2 sweep of the glossary) — glossary "Principal": the example no longer says early mortgage payments are mostly interest for any mortgage, with "only a small part" going to principal. It now says a 30-year mortgage, and that the principal part grows with every payment. Five languages.

Rules: W-6.2 ok (free pick; I didn't take the previous entry's unmeasured kids line, see below); W-9.4 n/a (measured accuracy fix, not a hand read; the Bonds note's second read is still owed, and this run couldn't take it because the Bonds run is one of the previous two). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** The previous run's residual, kids 9-12 *"Almost every adult eventually borrows…"*, still has no lifetime source, and current-holdings data can't refute "eventually", so I left it. A quantifier scan of `glossary.js`'s en entries (`scratchpad/quant2.mjs`; a planted *"Prices always rise."* fired) gave 22 hits. Most are already measured in place (yield curve, Baa spread, PMI, bubble credit). The one with no measurement anywhere (0 hits in the log, archive and CLAIMS) was "Principal"'s example: *"Early in a mortgage, most of each payment covers interest and only a small part reduces the principal."* Lesson 12 and its quiz question already limit this to a 30-year loan and name the rate (09-19). The glossary didn't.

**Step 3.5: the premise, measured.** FRED MORTGAGE30US (1971-) and MORTGAGE15US (1991-), keyless CSV. Interest share of the first payment = 1 − (1+r)^−n. **Control:** 30y at 7% → 87.7%, crossing at month 242; 30y at 3% → crossing year 7.0. Both match `moneyVisuals.js`'s comment and L12's text.
- **15-year loan:** interest was half or less of the first payment in **688 of 1,834 weeks (37.5%)**, including **every week of 2010-21**. At the 2.10% low (2021-07) it was 27%. **So "most… covers interest" was false for a whole decade of 15-year loans. Held.**
- **30-year loan:** interest was most of the first payment in every week since 1971 (54.8% at the 2.65% low). But principal reached **45.2%** of that payment, so "only a small part" was false at 2010s rates. At the latest reading (7.40%, 2026-10-15) it's 10.9%.

#### What shipped
- `src/content/glossary.js` "Principal" `ex`, five languages: en *"Early in a 30-year mortgage, most of each payment covers interest, and the part that reduces the principal grows with every payment."* es/ko/zh/ja say the same (e.g. ko 「30년 만기 주택담보대출 초기에는… 원금을 줄이는 부분은 상환할 때마다 커집니다」). "Grows with every payment" holds for any fixed-rate amortizing loan, since the balance only falls. No figure added (W-11.2).
- A 10-line comment above the entry records the old text and the measurement.

#### Verification
| check | result |
|---|---|
| Diff | 1 file, 11+/1− (one source line holds all five strings); each old string matched exactly once before replacing |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged; en lesson chars still 167,511 |
| Guard sees the entry | planted *"You should buy a home now."* in the new en `ex` → `check-blindspot` **exit 1**, naming glossary.js "Principal"; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-D4hgrjb5.js`, system Node v24.18.0 |
| Bundle | 5 new probes (one per language) each in 1 asset (`markets-*.js`); old en text → 0; nonsense → 0 |
| Live | `dist/` served statically (404 control → 404). Reference → Glossary → Principal shows the new en text, old text absent; at 320px the line is 254 wide, no overflow, page scrollWidth 320 |

#### Step 5: adversarial self-check
- **Still true?** "Most" is measured for every weekly 30-year rate on record. "Grows with every payment" is algebra for a fixed rate. The edge case is an ARM whose rate resets upward, but that happens years in, not "early". Hand-read all five strings after the edit; none is garbled.
- **§10.1/§10.2/§10.3:** describes a mechanism, no advice. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now` → 0. No date or live-looking figure renders (the dated comment doesn't render).
- **Prior work / decisions:** this matches the glossary to L12's 09-19 scoping and its quiz, and doesn't touch `splitCrossing` or the L12 figure. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2 (glossary.js, AGENT_LOG.md).

**Seen, not fixed:** kids 9-12 *"Almost every adult eventually borrows…"* still unmeasured (no lifetime source). Nothing else new in the glossary scan. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the glossary said early mortgage payments are mostly interest for any mortgage. That wasn't true for 15-year loans in 2010-21, so it now says a 30-year mortgage.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-18 (scheduled dev-agent; open item 117, its 09-07 storage note) — Review's nothing-due card no longer gives false instructions when site storage is blocked: it says answered questions are lost on reload instead of telling the learner to do what they just did. Five languages.

Rules: W-6.2 ok (open numbered item; the previous entry's "Seen, not fixed" was empty); W-9.4 n/a (new copy, not a hand read; the Bonds note's second read is still owed to a later run, since the previous run was that read's run 1). Baseline `npm test`: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Picking.** W-12.2's sweep came first. A quantifier scan (`scratchpad/quant.mjs`, control sentence fired) covered L20, 23-26, 28, 43, 44 and essentials 2, 3, 9, 10, 11, 14, 15, plus `economicSignals`, `policyScenarios` and `kidsContent`: 133 hits. Every checkable one had already been measured (L23's 1981 figures on 09-19, L28's trading claim on 10-15, L7/L10's take-home line on 09-11, L44's labor-income lines on 09-11). One was never examined, kids 9-12 *"Almost every adult eventually borrows money for something big"* (0 hits in both logs and CLAIMS). I didn't pick it because no source I know of gives a lifetime rate, and current-holdings data (SCF) can't refute "eventually". So, per W-12.2, an open numbered item: 117's 09-07 note, the only part of 117/140/149 that describes a measured learner-visible defect.

**Step 3.5: the premise, measured.** Served HEAD's build (`index-DJbvC0EJ.js`, same as the previous run's) statically, plus a `blocked.html` whose `localStorage` getter throws. 404 control → 404. Driven through the UI:
- Blocked, fresh: *"Nothing to review yet / Answer the check question…"*
- Blocked, after answering L29's check: *"You're all caught up / Questions come back here a day or two after you answer them"*. That's a promise this device can't keep.
- Blocked, after `location.reload()` (marker gone, blocker still installed): back to *"Answer the check question…"*, to a learner who just did. **Held, as the note said.**
- **Control**, unblocked, storage cleared, same flow + reload: `ecycles_review` holds q001 and the card reads "caught up" with "Practice all questions (1)". So the instrument discriminates, and the defect is specific to blocked storage.

#### What shipped
- `Practice.jsx`: the nothing-due card gets a third state. When `persistenceBroken`, it shows the `info` icon at `ink.muted` and `reviewNoStorageTitle` / `reviewNoStorageBody`. This overrides both existing variants. The practice button is unchanged, since practicing in-session still works. A comment records the measurement.
- `App.jsx`: passes `persistenceBroken` (already in `useAppState`) to `Practice`.
- Locales, 2 keys × 5: en *"Review can't be saved here"* / *"Your browser is blocking site storage, so questions you answer are lost when you reload or close this page, and can't come back here for review later."* es/ko/zh/ja reuse each language's existing `storageBlockedBody` terms (e.g. ja ストレージ, 再読み込み).
- Item 117's 09-07 note: a dated line saying the wrong-description half is fixed. **(a), hidden vs. route-to-Learn, is still open and still the owner's call.**

#### Verification
| check | result |
|---|---|
| Diff | 7 files, 28+/5− |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged |
| Guard sees the keys | removed `reviewNoStorageBody` from ja → `npm test` **exit 1**, *"TR.ja: missing key"*; restored (`cmp`) |
| `check-blindspot` | exit 0; diff grep `dalio|bridgewater|should buy|you should|recommend|buy now` → 0 |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-CePfGO_s.js`, system Node v24.18.0 |
| Bundle | 5 new titles each in 1 asset; nonsense → 0 |
| Live, blocked | fresh, after answering, and after a real reload all show the new card (info icon); "Practice all questions (1)" still shown in-session |
| Live, control | unblocked: fresh "Nothing to review yet", after answering "caught up", the same as before |
| Layout | es (longest) at 320px: card 288 wide, card overflow 0, page overflow 0; screenshot checked |

#### Step 5: adversarial self-check
- **Is the new copy true?** "Lost when you reload or close" is what the measured reload shows. "Can't come back… later" has one edge case: a tab left open, never reloaded, past the due date. I judged that negligible, and mobile browsers discard background tabs anyway.
- **Redundant with the global notice?** It overlaps (*"can't keep… review schedule"*), but that notice can be dismissed, and this card was actively false. It now says the same thing as the notice instead of contradicting it.
- **§10.1/§10.2/§10.3:** no advice, no branding, not kids content. No date or figure.
- **DECISIONS.md:** localStorage-only state unchanged. No new storage.
- **Prior work:** doesn't touch 117(a) or (b), the 08-26 not-started fix, or the 09-02 rail fix. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 8.

**Seen, not fixed:** kids 9-12 *"Almost every adult eventually borrows money for something big"* has never been measured. It's probably high but not "almost every". I couldn't measure it this run, so it isn't numbered. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** if a browser blocks storage, the Review tab used to tell learners to answer a question they had just answered. It now says plainly that review can't be saved there.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-18 (scheduled dev-agent; free pick, W-12.2's clarity candidate) — Reference → Market signals, Bonds card: the note now says what "most sensitive" meant: for the same yield change, long-term bond prices move most. Five languages.

Rules: W-6.2 ok (free pick named by W-12.2; the previous entry's "Seen, not fixed" was empty); W-9.4 applies (short string, hand-read): this is run 1 of 2, so a second run should re-read it before calling it settled. Baseline `npm test` before editing: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1.

**Step 3.5: the premise, measured.**
- **Held, and it's narrower than "sensitive is ambiguous".** The card reads "Rates ↑ Price ↓" above the note, so "sensitive" leans toward price. But the note's own sentence has two quantities, names only the second ("their yields"), and says "maturities", which a beginner may not know. The Stocks note ("Growth names most sensitive") uses the same construction without a second quantity, so it is left alone.
- **The facts the note rests on, re-measured** (FRED DGS2/10/20/30, keyless CSV; `scratchpad/cycles.mjs`, par bond, semiannual). **Control:** modified duration at 5% → 2y **1.88** / 10y **7.79** / 30y **15.45**, which matches the textbook values. 30-year yield change, first hike → last hike: +1.38 / +0.14 / −0.15 / −0.02 / +1.48, against the 2-year's +2.91 / +1.36 / +2.51 / +1.61 / +2.87. So it rose less in **all 5** cycles, and "usually" stays a safe hedge. The 30-year price fell most only in 1994-95 (−16.0%) and 2022-23 (−25.9%), the same as the code comment. Small day-pick differences from the comment's figures (e.g. +1.38 vs +1.44) don't change any sign or ranking.

#### What shipped
- `src/content/markets.js` `rateEffects.bonds.note`, all five languages: *"For the same yield change, long-term bond prices move most, but their yields usually rise less"*. "Price" and "yield" are both named, and "maturities" is now "long-term bonds". es/ko/zh/ja say the same thing in their own phrasing (e.g. ja 「利回りの変化が同じなら長期債の価格が最も大きく動くが…」).
- A 3-line comment under the existing Bonds re-measurement says why the note changed. No figure was added (W-11.2).

#### Verification
| check | result |
|---|---|
| Diff | 1 file, 8+/5− |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged |
| Guard sees the file | planted *"You should buy bonds now."* in the en note → `check-blindspot` **exit 1**; restored (`cmp` equal) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-DJbvC0EJ.js`, system Node v24.18.0 |
| Bundle | 5 new probes (one per language) each in 1 asset; old en note → 0; nonsense → 0 |
| Live | `dist/` served statically. en at 320px: the note renders; Bonds card 138×186, same row height as Stocks, overflow 0, page overflow 0. **es (the longest string)** at 320px: Bonos 138×202, the same as Acciones in its row, overflow 0, page overflow 0 |

#### Step 5: adversarial self-check
- **Still true?** "Prices move most for the same yield change" is duration, and the control reproduces it. The new wording doesn't claim long bonds *fell* most in hiking cycles, which history refutes in 3 of 5.
- **§10.1:** a description of a mechanism, not advice. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|20xx` → 1 hit, and it's the dated code comment, which doesn't render. §10.2/§10.3 untouched; no live-looking figure.
- **Prior work / decisions:** this keeps the 2026-10-12 Bonds correction ("yields usually rise less") intact and only clarifies its first half. **No conflict found.**
- **Commit safety (W-12.3):** staged count asserted = 2 (markets.js, AGENT_LOG.md).

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Bonds card on Market signals said long bonds were "most sensitive" without saying to what. It now says their prices move most for the same change in yield.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-18 (scheduled dev-agent; named item 160, class B) — quiz q043 (why school skips personal finance): answer trimmed and three distractors Lesson 41 contradicts, so the answer is no longer the longest option. Five languages.

Rules: W-6.2 ok (open numbered item; the previous entry's "Seen, not fixed" was empty); W-9.4 n/a. Baseline `npm test` before editing: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 30.4 / es 28.3 / ko 30.4 / zh 26.1 / ja 28.3.

**Step 3.5: the premise, measured.**
- Instrument rebuilt (`scratchpad/rank.mjs`, relative margin in code points). **Controls:** 2x → 1.000, +1 of 100 → 0.010. **Positive control:** strict-longest counts reproduce the baseline §65 exactly.
- **Held:** `q043` tops the ranking at en 49% / **es 95%** / ko 71% / zh 74% / ja 25% (en 53/[79]/50/43). Class B: the answer was the only two-clause option; two distractors ("nothing useful could be taught", "every country already teaches it thoroughly") weren't reasons at all.
- **New constraint the item didn't name:** READING_MODEL counts quiz options in a lesson's `minutes`. L41 sat at **698 words (3 min), 2 under the 4-min boundary**. The first draft added 5 English words → 703 → `check-data` §2 **FAIL** (minutes 3, computes 4). Rather than add a minute (W-11.2's length watch), the English options were reworded back to the original 38 words.

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js` q043 `opts`, worded from each language's L41 text. Answer index (1) and `explain` unchanged; the explain still says "differ by country" and "rather than withheld on purpose".
  - Answer: *"Curricula favor examinable subjects; money rules keep changing"* (*"are local and"* dropped).
  - *"Nothing needs teaching: a first payslip explains money quickly enough"*: L41 calls experience an "unusually slow and expensive" teacher whose feedback arrives years later.
  - *"It's withheld deliberately, to keep people borrowing and indebted"*: L41 says "Nobody sat in a room and decided" this.
  - *"Money rules hardly differ or change, so families can handle it"*: L41 says they "differ by country and change every few years", and family teaching passes on habits "including the ones that didn't work".
- Lengths, answer in brackets: en 69/[62]/65/62; es 84/[82]/80/77; ko 50/[48]/35/46; zh 24/[24]/22/23; ja 32/[34]/33/35. Not strictly longest or shortest anywhere (en ties for shortest, zh ties for longest).

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/patch.mjs`: per file old block ×1 / new ×0, answer-not-strict-extreme assert, U+FFFD ×0; a repeat refuses (exit 1). English then hand-edited for the word count. `git diff --stat`: 5 quiz files, 20+/20− |
| L41 words | 698 before → 703 (draft, FAIL) → **698** after; `minutes` 3, unchanged |
| Rank after | q043 en −10% / es −2% / ko −4% / zh 0% / ja −3%; `q004` now heads |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). **§65 longest: en 28.3 / es 26.1 / ko 28.3 / zh 23.9 / ja 26.1** (each −2.2), shortest unchanged 2.2/2.2/0.0/2.2/4.3 |
| Guard sees the file | planted *"You should buy stocks now."* as a q043 option → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-Dh7qy5Wr.js`, system Node v24.18.0 |
| Bundle | 8 new probes (en ×4, es, ko, zh, ja) each in 1 asset; 4 old options → 0; nonsense → 0 |
| Live | **Run this time:** L41's reader shows its check question in a fixed place, unlike Practice. `dist/` served statically, `#/lesson/41`: all 4 new options render in both the pre-question and the end check, the old ones → 0; clicking the keyed option shows "CORRECT!" and the explain |

#### Step 5: adversarial self-check
- **"Also true"?** The family option is the closest call, since L41 says family is who usually fills the gap. But its first clause (rules hardly differ or change) contradicts L41 directly, and L41 says that family teaching is "not a substitute for having been taught". Each distractor contradicts an L41 sentence present in all five languages.
- **§10.1:** none of the options is advice. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now|20xx` → 0. §10.2/§10.3 untouched. No dates or figures added.
- **W-11.2:** the answer got shorter, no statistic added, lesson minutes and English word count unchanged.
- **Prior work / decisions:** continues item 160's class-B queue in order. Doesn't redo q001/q008/q021. **No conflict found.**

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the "why don't schools teach money?" quiz question could be answered by picking the longest option. Its wrong answers are now ideas Lesson 41 argues against. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-18 (scheduled dev-agent; named item 160, class B) — quiz q021 (tax brackets): answer trimmed and three new distractors Lesson 7 contradicts, so the answer is no longer twice the length of any other option. Five languages.

Rules: W-6.2 ok (open numbered item; the previous entry's "Seen, not fixed" was empty); W-9.4 n/a. Baseline `npm test` before editing: exit 0 / 0 FAIL / 1 WARN (O-3's), §65 en 32.6 / es 30.4 / ko 32.6 / zh 28.3 / ja 30.4.

**Step 3.5: the premise, measured.**
- Instrument rebuilt (`scratchpad/rank.mjs`, relative margin in code points). **Controls:** 2x → 1.000, +1 of 100 → 0.010. **Positive control:** its strict-longest counts reproduce the baseline §65 exactly.
- **Held:** `q021` tops the ranking at en 102% / es 63% / ko 56% / zh 56% / ja 78% (answer 109 code points against 44-54 in en).
- **Broke, twice.** (1) The item says the distractors are "short slogans". They are full 44-54-char sentences. The tell was the answer's length, so trimming alone (87) or new distractors alone wouldn't close it. Both were needed. (2) The distractor *"You take home less money overall than before the raise"* echoes L7's benefits-cliff sentence, which says a household **can** end up with "less money overall" (es is word-for-word: *menos dinero en total*). So it was arguably "also true".

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js` q021 `opts`, worded from each language's L7 text. Answer index (2) and `explain` unchanged.
  - Answer: *"Only the income inside the new bracket is taxed at the higher rate"* (the tail *"— the rest is unchanged"* dropped; the explain still says it).
  - *"All of your income is now taxed at the new bracket's higher rate"*: L7 says only that slice is.
  - *"Income you already earned this year gets taxed retroactively at the higher rate"*: L7 says "never" in those words (retroactivamente / 소급 / 追溯 / さかのぼって).
  - *"Your take-home pay ends up lower than it was before the raise"*: L7 says take-home pay never goes down, and at a cliff it "goes up". This replaces the "money overall" option.
- Lengths, answer in brackets: en 64/79/[66]/61; es 66/79/[69]/57; ko 27/31/[28]/22; zh 17/21/[20]/12; ja 21/28/[24]/15. Not strictly longest or shortest anywhere.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/patch.mjs`: per file, old block ×1 / new ×0 before; asserts the answer is neither strictly longest nor shortest (it refused a first draft where ja was longest by 1); U+FFFD ×0; a repeat refuses (exit 1). `git diff --stat`: 5 quiz files, 20+/20− |
| Rank after | q021 en −16% / es −13% / ko −10% / zh −5% / ja −14%; `q043` now heads |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). **§65 longest: en 30.4 / es 28.3 / ko 30.4 / zh 26.1 / ja 28.3** (each −2.2), shortest unchanged 2.2/2.2/0.0/2.2/4.3 |
| Guard sees the file | planted *"You should buy stocks now."* as a q021 option → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-DrVUnWEc.js`, system Node v24.18.0 |
| Bundle | 7 new probes each in 1 asset (`追溯征税` alone is in 2: the zh L7 lesson uses it; the full zh option is in 1); old `Your entire income gets taxed at the new`, `rest is unchanged`, `按新的更高税率征税` → 0; nonsense → 0 |
| Live | not run: the quiz draws its order, so q021 is checked by bundle, as the q001/q008 entries did |

#### Step 5: adversarial self-check
- **"Also true"?** The take-home distractor is the one to test. The ACA premium-credit cliff and the benefit cliffs reduce a household's resources, but not its take-home pay, and L7 draws exactly that line. Each distractor contradicts a sentence L7 has in all five languages.
- **§10.1:** none of the options is advice. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now` → 0. §10.2/§10.3 untouched. No dates or figures added.
- **W-11.2:** the answer got shorter, and no statistic was added. **Inverse tell / position:** shortest-option rates unchanged, answer index unchanged.
- **Prior work / decisions:** extends item 160's class-B queue in order. It doesn't redo the 09-20 trim analysis; it combines the trim with new distractors, as that analysis implied. **No conflict found.**

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the tax-bracket quiz question's right answer was twice as long as any wrong one, and one wrong answer was arguably true. Both are fixed. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.
