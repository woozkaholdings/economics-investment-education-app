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

166. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

165. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

164. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

163. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

162. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

161. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

160. **🟡 PARTLY DONE, and its own stop-clause is CORRECTED (2026-09-02, owner-directed: "do item 160
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
        standing WARN cleared. **The remainder is still not all class B: `q023` (46%, L9), `q037` (37%, L23),
        `q040` (16%), `q034` (11%) and `q027` (6%) are class A and beatable in all five.** `q023` is next by
        margin. **Do not re-read this item as blocked without re-ranking — rank the whole set, not the top of it.**
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

148. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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

145. **✅ Closed; archived verbatim 2026-09-27** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)".

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

### 2026-09-27 (scheduled dev-agent; **the previous run's two named residuals**: its "Seen, not fixed" said *"Item 67 is probably stale … The next run can confirm this against `glossary.js` and close it"*, and its step 5 named `check-log-size.mjs`'s floor label as doc drift. The previous run was a W-9.1 pick that took no residual, so W-6.2 rule 1 allows this. W-9.4 does not arise: this is not a short-string hand read, and the previous two runs were an archiving pass and a quiz hand read. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit) — **item 67 is closed, and `check-log-size.mjs` no longer says the backlog can never be archived.**

**Step 3.5: the premises, re-measured with controls.**
- **Item 67.** Its three terms came from the 08-17 glossary scan: `dividends`, `realized gains` and `NBER`. Measured today: `GLOSSARY["Dividend"]` has `s`/`f`/`ex` in **all five languages** (en Dividend, es Dividendo, ko 배당금, zh 股息, ja 配当); a nonexistent key reads absent (control). `glossary.js` carries "National Bureau of Economic Research" ×1, and the `realized gains` fix is the rewritten 401(k)/IRA sentence ("dividends and any profit made when an investment is sold…"). `lessonTerms.js` wires `Dividend` as a chip in lessons 3, 6, 35, 42, 43 and 44. In the built bundle all five names are present; a nonsense probe is at **0**. **The premise held exactly.** The item stayed 🟡 for 41 days because item 64 finished the work and nothing updated item 67's line. The archived 2026-08-24 entry had already confirmed this once, and it too left the live line alone.
- **The label.** `floor (never archived)`, the constant's comment, the header and the floor WARN all said archiving cannot move the floor. **That stopped being true this morning**, when W-9.1 moved 129 closed items and the floor fell 460,785 → 275,645 b. Only *run-log* archiving cannot move it. I grepped `scripts/` for every consumer of the label: **nothing parses it**. The only other hit was an unrelated `(never)` in `check-balance-sheet.mjs`. So rewording it breaks no instrument.

**The change.** `scripts/check-log-size.mjs`: the header's FLOOR bullet, the `FLOOR_MAX` comment, the printed label (`floor (not run-log archivable)`), the over-budget WARN (it now names both remedies, and says open items, the App summary and the Environment note are never archived), and the near-crossing remedy string. The patch script required each old string ×1 and each new string ×0. No threshold, arithmetic or verdict changed. `AGENT_LOG.md`: item 67's two lines are replaced by its conclusion (W-7.2 rule 1). It is not archived here; the next closed-item pass can move it.
- **Control on the WARN branch**, which cannot fire at today's 55% of budget: a temporary copy with `FLOOR_MAX = 200_000` (asserted ×1, then deleted) printed the new message in full. Reading it caught one leftover, *"non-archivable floor"* at the start of the sentence, which is now just *"floor"*.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged from baseline) |
| Build | `scripts/build-out-of-tree.sh` → ✓, bundle **`index-D_MFj2n0.js`, the same hash as before**, so no app code changed |
| Bundle probe | `Dividend`/`Dividendo`/`배당금`/`股息`/`配当` all present; nonsense probe 0 |
| MEASURED (before this entry) | file 397,606 b; floor 275,800 b (backlog 237,394 b); run log 121,806 b |

#### Step 5: adversarial self-check
- **Blindspot register:** no app content was touched, and the unchanged bundle hash proves it.
- **DECISIONS.md / W-5.3:** W-5.3's run-log rule is untouched. The new wording only records what W-9.1 already authorized: CLOSED items, verbatim, with a pointer. It does not license archiving open items; the WARN says so.
- **Done work undone?** No. Item 64's closure and the 09-27 archiving pass are not modified.
- **My own claims:** a reviewer who re-runs the glossary dump, the `scripts/` grep, the `FLOOR_MAX` control, `npm test` and the build gets the same results. No conflict found.

**Owner-facing, one line:** housekeeping only. A backlog item that had been finished since August is now marked closed, and the log-size check now describes the archiving it already allows. Nothing learner-visible changed. W-9.5 (translation review) and W-9.6 (the analytics key) are still the asks that move the launch. **W-8.1 still applies:** committed, **not deployed**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-27 (scheduled dev-agent; **W-9.1's named pick**: the weekly review set it as *"the pick for the next run that is not already mid-chain"*, and no chain was open. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. W-9.4 does not arise: this is not a short-string hand read) — **the backlog's first archiving pass: 129 closed items moved verbatim to `AGENT_LOG.archive.md`, each leaving a one-line pointer under its own number.** Backlog **422,379 → 237,239 b**, floor **460,785 → 275,645 b** (92.2% → **55.1%** of budget). W-9's test for 2026-10-04 is a floor below 300,000 b, and it is already met.

**Step 3.5: the premise, re-measured.** W-9.1 said *"of 152 numbered items, 137 are closed … 244,116 b"*. **I reproduced 152 and 137 exactly, and 137 is too many.** Its classifier matched `✅|DONE|CLOSED|RETIRED|EXHAUSTED` anywhere on an item's first line, so it counted five items that are not closed: **72** (🟡 HALF DONE; the owner half is open), **67** (🟡 TWO-THIRDS DONE), **160** (🟡 PARTLY DONE), and **17** and **24** (EXHAUSTED, which means "do not pick by default"; both still carry live direction). **132 items carry a ✅ on their own first line**, and that is the selection rule I used. I kept three of those 132 live on purpose: **122**, because its findings are the method for measuring a backlog, and **157** and **168**, because each carries a standing rule that no script enforces (`owner-directed` is a claim about a person; a cross-track reference must be a signpost, not a presupposition). So **129 items moved** (199,393 b) and 23 stay. The archive section's preamble says all of this.
- **Bounding (item 122 finding 2):** an item ends at the next item or at the next column-0 line that is neither blank nor indented. So the last item (19) stops at "Notes for future runs", and item 26 stops at the retained 08-09 priority block, which is not an item and stays live. The one column-0 line inside an item is item 160's ⭐ line, which is handled explicitly.

**The move.** A scratchpad mover (not committed) rebuilt both files and asserted five proofs before writing. (P1) Substituting each pointer back with its block restores the original byte for byte. (P2) The archive's existing content is an unchanged prefix. (P3) Each block appears exactly once in the new section and nowhere live. (P4) All 23 kept items are byte-identical. (P5) Live shrank by exactly moved − pointers (199,393 − 14,253 b). **An independent re-check parsed the committed archive section itself (129 blocks), substituted it into the new live file, and got `git show HEAD:AGENT_LOG.md` back byte-exactly, with 0 pointers left.** The first dry run aborted, because pointer `55.` is a substring of pointer `155.`. Matching is now newline-anchored; the abort was the proof working.

**What the instrument caught: `check-data.mjs` §52b failed.** Its `HEX_ATTRIBUTION_OK` entry 0 excused a hex in closed item 59 (*"manufactures a 1.0:1"*). §52 scans the live backlog but not the archive, so the moved text is now out of its scope and the exemption was stale. **The check's own message says to delete it**, and I did, leaving a two-line comment that says where the text went. That is the only code change.

**Positive control on the pointers:** I deleted pointer 46 from the live file, and `check-backlog.mjs` failed with **2 dangling citations** (`check-data.mjs:2863`, `:3136`). I restored the file from a scratchpad copy (`cmp` identical) and it passes again. ⛔ **So the pointer lines are load-bearing, for the same reason `former item N` labels are. Never drop one to save bytes.**

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged) |
| `check-backlog` | 152 items, no duplicates; **208/208** citations resolve |
| §35 heading depth | 0 wrong across both log files (the new `##` heading is accepted) |
| Build | `build-out-of-tree.sh` → ✓, bundle `index-D_MFj2n0.js`, **the same hash as before**, so no app code changed |
| MEASURED | file 576,340 → **391,200 b**; backlog **237,239 b**; floor **275,645 b**; run log 115,555 b (untouched) |

#### Step 5: adversarial self-check
- **Blindspot register:** no app content was touched, and the bundle hash proves it.
- **W-5.3 says the backlog is "never archived",** and `check-log-size.mjs`'s header and floor label say the same. W-9.1 overrides that for closed items only. The label now overstates things, because the floor can be moved by this kind of pass as well as by compression. I did not reword the script, because the MEASURED numbers are correct either way. This is noted here as a doc drift.
- **Done work undone?** No. Items 115 and 122 compressed in place; this pass moves text. Every open item is byte-identical (P4).
- **Live references into moved items** (e.g. "item 73's standing method", "item 58's rule") now land on a pointer that names the archive section, where the full text is one search away. I did not check whether each such rule is enforced in code. Only 157 and 168 were kept live for their rules, because I identified those two as unenforced.
- **Archive order:** the next W-5.3 pass will append `## Archived 2026-09-21` *after* this backlog section. That breaks the file's strict date order at one boundary. The section heading is undated on purpose, so no instrument reads it as a day.
- **My own claims:** a reviewer who re-runs the reconstruction snippet described above against `HEAD~1` gets byte identity. No conflict found.

#### Seen, not fixed (W-6.2 rule 2)
- **Item 67 is probably stale.** It says the `Dividend` half "is still blocked", but moved item 64 says *"`Dividend` shipped 2026-08-20"*. Open items were out of scope for this pass (W-9.1: "change no open item"). The next run can confirm this against `glossary.js` and close it.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** 129 finished backlog items were moved word for word into the archive, which cuts `AGENT_LOG.md` by a third (576 → 391 KB) and clears W-9's 300 KB floor target a week early. The two asks in W-9.5 (translation review) and W-9.6 (the analytics key) are still yours.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-27 (scheduled dev-agent; **a free pick**. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit, so W-8.5 stays expired. **The pick is the previous run's named residual: a hand read of the ko/zh/ja quiz `explain` strings.** That run was a free pick that did not itself take a residual, so W-6.2 rule 1 allows this. ⛔ **The next run may take a residual of this one only once more.**) — **ten explanation strings across seven quiz questions were wrong or short. Three questions had grammar or meaning errors (four strings), and four questions had dropped a clause the English makes (six strings; q025 in all three languages).** Explanations appear after the learner answers, so they are where the quiz teaches.
- **ko q028 (lesson 14):** 「은퇴 계좌」**과** 「보험」 put the consonant-form particle after a vowel-final noun. It is now 「은퇴 계좌」**와**.
- **ko + ja q039 (lesson 25):** both said the *protection* was paying the price. ja 保護は…代償を**払われています** is also ungrammatical (a passive with 代償 as object). The ja now reads 保護**のために**…代償を払っています, which matches its own keyed option (…安定性のために…代償を払っている). The ko now reads 보호**의 대가를**…치르고 있지만.
- **ja q031 (lesson 17):** 給料日から給料日へと暮らせる used the potential form ("high earners are *able* to live paycheck to paycheck"), which reads as a capability, not a risk. It now reads 高所得者**でも**…暮らす**ことがある**, the wording lesson 17's ja module already uses.
- **zh q023 (lesson 9):** zh dropped en's last clause, "a bigger number on the statement didn't mean more real wealth". ko and ja keep it, and it is the lesson's point. Restored as 对账单上的数字变大，并不意味着实际财富增加了, using lesson 9 zh's own 实际财富.
- **ko q017 (lesson 3):** said the Rule of 72 is "a quick approximation" without saying of what. It now says 돈이 두 배가 되는 기간을 빠르게 어림하는 방법 (어림 is lesson 3 ko's word).
- **zh q006 and zh/ko/ja q025: repairs that the instrument forced.** See the next bullet.

**Step 3.5: the premise and its controls.** The premise was that `explain` had been measured (length ratio, Jaccard) but never hand-read in ko/zh/ja. The 09-27 options entry says so, and I found no archived hand read. All **46 × 3 = 138** explanations were read side by side with en (dump: 46 entries per file in all four).
- **Particle class, instrument + control:** a Node scan of every `*.ko.js` in `src/content` checks the vowel/consonant particle pairs 과/와, 은/는, 을/를 after a closing quote mark. It returned **exactly 1**, which is q028, the instance I had found by eye (the positive control). So the error class does not recur elsewhere. (I used Node, not grep, because this grep is ugrep and a bounded-repetition pattern aborts.)
- **Lesson-wording controls:** each replacement was checked against its own language's lesson module (by a Node context dump) before it was chosen: ja 暮らすことがあり (money.ja), zh 实际财富 (essentials.zh), ko 어림셈 (essentials.ko), and ja's keyed q039 option.
- **What the instrument caught that I did not plan for:** after the zh q023 addition, `npm test` rose **1 → 2 WARN**. The new WARN was §74's quiz-explanation shortfall, *"q006/L36 zh 0.273, q025/L11 zh 0.270"*. Lengthening one zh explanation raised zh's p90, and that tipped two zh explanations below 70% of it. **Both were omissions I had already noted while reading and had not planned to fix:** q006 zh dropped "a strong track record … so it isn't a perfect predictor", and q025 dropped "even though both funds hold identical investments". I repaired both rather than adding them to READ_COMPLETE, because they are real omissions. q025's clause was also missing in **ko and ja**, so I restored it there too. After that: **1 WARN** again, and §74 reads 0/184.

**The fix.** Three patch scripts required each old string ×1 and each new string ×0 before writing. `git diff --stat`: **3 files, 10 lines in, 10 out**. No English, no options, no stems and no `quizMeta` changed. Every edited explanation was re-dumped and re-read after writing, because a count only proves that a replacement landed, not that it reads correctly.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged from baseline) |
| §74 quiz-explanation shortfall | 0/184 (it was 2/184 transiently, mid-run; see above) |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** |
| Built bundle | 10/10 new phrases in 1 file each; 4/4 old phrases at **0**; nonsense probe **0** |
| Live render | **Not done, on purpose:** these are data strings rendered through the same text child as before, and the bundle probe shows they ship |

#### Step 5: adversarial self-check
- **Blindspot register:** q006 still hedges ("not every inversion…", now plus "not a perfect predictor"). q039's "historically usually enough, though not a guarantee" is untouched in all languages. No advice language, dates, live figures, Dalio or kids framing was added. `check-blindspot` passes inside `npm test`.
- **Answer leak?** `explain` shows only after answering, and no option changed, so §65's option-length cue is not affected.
- **DECISIONS.md:** no conflict; content stays in `.js`.
- **Done work:** the 09-25 stem fixes, the 09-27 option fixes and the 09-25 Yield Curve glossary wording are untouched. The q006 addition says nothing about start years, so the 1955/1976 distinction the glossary fix explains is not reopened.
- **My own claims:** a reviewer who re-runs the dumps, the particle scan, `npm test`, the build and the bundle probes gets the same results. ⛔ All new wording is machine-written and has not been reviewed (O-3).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- ko/ja q006 also drop "a strong track record … not a perfect predictor", but each keeps the hedge "not every inversion was followed by a recession", and §74 does not flag them. I left them alone.
- ko/ja q031 use the calque 월급날에서 월급날로 / 給料日から給料日へ. It matches their own lesson 17 wording, so changing it belongs to the lessons, not the quiz.
- ja q042 renders self-attribution bias as 自己奉仕バイアス (self-serving bias), the same as lesson 28 ja. The two concepts are close, and the choice is consistent.
- **With this run, all three quiz surfaces (stems, options, explanations) have been hand-read in ko/zh/ja.** The quiz chain is closed. This run names no quiz residual.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** ten quiz explanations (seven questions) in Korean, Chinese and Japanese were fixed. There were three grammar or meaning slips, and several explanations had dropped a clause the English makes, including the yield-curve "not a perfect predictor" hedge in Chinese.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-27 (scheduled dev-agent; **a free pick**. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit, so W-8.5 stays expired. The previous run was a free pick (item 152) that named no residual, so W-6.2 rule 1 does not arise. **The pick is the one quiz surface no run has hand-read in ko/zh/ja: the answer options, distractors included.**) — **two Korean quiz options were wrong, and both are fixed. One was ungrammatical. The other said loss aversion compares a pain with a gain, not with the pleasure of a gain.**
- **q039 [0] `ko` (lesson 25):** "…어떤 금액**에게든** 항상 가장 안전한 곳이다" put the animate particle 에게 on an amount of money. It now reads "어떤 금액**이든**". This is a distractor, and it is now 1 character shorter (54 → 53). The keyed [3] (47) was not the longest before and is still not.
- **q041 [1] `ko` (lesson 27, the keyed option):** "손실을 확정 짓는 고통이 같은 크기의 **이득**보다 훨씬 무겁게" compared a pain with a gain. en, zh, ja, ko's own `explain` and ko q042 [3] all compare it with the **pleasure** of an equal gain. It now reads "같은 이득의 **기쁨**보다". **This wording was chosen for length, too:** the natural "같은 크기의 이득이 주는 기쁨보다" takes the key from 45 to 51 characters. That would make the key the longest ko option (the max was 49) and add an option-length cue (item 160). The chosen wording has exactly the same length.

**Step 3.5: the premise and its controls.** The premise was that the options had never been hand-read for translation quality. That is **partly true**. The archive (`AGENT_LOG.archive.md` ~l.32707) records that **all 46 keyed options were read in all five languages**, but only for **key drift**, not for wording. The distractors had never been read. A dump confirmed **46 entries per file** and **552 translated options** (46 × 4 × 3), all of which were read side by side with en.
- **Candidates that I dropped because they match their own lesson's wording** (each checked by grep against that language's lesson module): ko q020 기여 (lesson 6 ko uses 기여/기여금 throughout); zh q020 缴纳 (lesson 6 zh uses 缴纳/缴款); zh q038, which uses bare 想要 as a noun (lesson 24 zh does the same, e.g. "想要是快的"); zh q009 生产力 (9 of 11 economy uses); ja q010 紙幣印刷 (lesson 34 ja uses both it and 紙幣を刷る); ko q044 도착했다 (lesson 42 ko: "메커니즘을 통해 도착했고"). I also left alone ja q029's 『本当の』, since the file already uses 『』 for 7 non-nested quotes, and ko q035's `$89`, which matches its own stem.
- **Control for the grammar hit:** `grep 에게든` over every ko module returns **2**: the known instance and one in `lessonContent.money.ko.js:181` ("다른 어떤 돈에게든 던질 질문"). The second is not the same error. There the money is the addressee of a question, a personification that 에게 allows. So the grep fires on the class, and the class does not recur as an error.

**The fix.** The patcher required each old string ×1 and each new one ×0 before writing. `git diff --stat`: **1 file, 2 lines in, 2 out**. No English, no other language and no `explain` changed.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged) |
| §65 option-length cue | ko **47.8%/0.0%**, the same as the pre-edit run; all five languages are identical to baseline |
| Option lengths (ko) | q039 `[54,33,56,47]` → `[53,33,56,47]`; q041 `[49,45,39,40]` → unchanged |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** |
| Built bundle | Each new phrase is in 1 file. Both old phrases: **0**. Nonsense probe: **0** |
| Live render | **Not done, on purpose:** these are data strings rendered through the same text child as before, and the bundle probe shows they ship |

#### Step 5: adversarial self-check
- **Blindspot register:** no advice language, dates, figures, Dalio or kids framing. `check-blindspot` passes inside `npm test`.
- **Could the q041 edit leak or shift the answer?** Its length is unchanged and §65 did not move. The new wording now matches ko's own `explain`, so it adds no cue the explanation doesn't already give after answering.
- **DECISIONS.md:** no conflict; content stays in `.js`.
- **Done work:** the 09-25 stem fixes (q007, q035) and the keyed-option drift sweep are untouched. ko q042 [3] already had the correct form, and this edit brings q041 in line with it.
- **My own claims:** a reviewer who re-runs the dump, the length probe, the `에게든` grep, `npm test`, the build and the bundle probes gets the same results. ⛔ The new wording is machine-written and has not been reviewed (O-3).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- ja q031 [3] renders "materially nicer" as 明らかに**物質的に**. That reads the idiom ("significantly") as "in material goods". The meaning survives in context (the higher earner's nicer life *is* material), so I left it.
- **With this run, quiz stems and options have both been hand-read in ko/zh/ja; explanations have only been measured (ratio and Jaccard instruments), not hand-read.** A hand read of the ko/zh/ja `explain` strings is the one quiz surface left; under W-6.2 rule 1 the next run may take it.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** two Korean quiz answers were fixed: one grammar slip, and one that described loss aversion as pain vs. gain rather than pain vs. the pleasure of a gain.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-26 (scheduled dev-agent; **a free pick, and not a residual of the short-string chain**, as the previous entry's ⛔ required. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit, so W-8.5 stays expired. **The pick is backlog item 152**, which is the oldest open item that is scoped, needs no owner input and is a code change a reviewer can read in minutes) — **lesson 23's two tinted zones now take their colors from the reward they belong to, not from a hand-typed array that had to be written backwards.**
- **The defect class (W-6.2 rule 3: the learner-visible failure).** The preference-flip figure has two tinted bands. The left band is labeled "Here, the $65 feels worth more", and it must be washed in the $65 line's green. That pairing was the literal prop `zoneColors={[surface.okWash, surface.warnWash]}`, the reverse of `colors={[graph.amber, graph.green]}`. It was correct, but it looked like a typo. "Tidied" to match `colors`, it would tint the $65 band in the $50's amber. Every existing §50 block would stay green, because they read content strings and this was a JSX prop.
- **The fix, which is the route the item preferred.** `src/content/moneyVisuals.js` now exports `flipZoneSeries()`. It returns each zone's winning series index, derived from `flipValue` at the two end vantage points; today that is `[1, 0]`. `src/components/LessonVisual.jsx` defines one `FLIP_PALETTE` entry per series (`{ line, ink, wash }`). All four props are now derived: `colors` and `labelInks` map the palette, and `zoneColors` and `zoneEdges` go through `flipZoneSeries()`. The reversal is no longer written anywhere by hand. Only the *choice* moved into content; the theme tokens stay in the component, so the content module still imports no theme.
- **The guard is `check-data.mjs` §50 (k).** The **model half** asserts that `flipZoneSeries()` equals the winners block (j) already derives from the arithmetic. The **wiring half** asserts that the four `<PreferenceFlip>` props are those exact derived expressions and that each palette entry's line, ink and wash belong to one hue family. A mixed entry is the same bug one level down. The item warned that regexes over JSX read the wrong thing, so this half matches fixed expressions only and carries its own two injections (the old literal array and a mixed-hue entry). If either injection is not caught, or its anchor has gone, §50 fails.

**Step 3.5: the premise and its controls.** The premise held in full. The four props had moved from `:190-194` to `:382-386` with the same values, and nothing else read them (`grep zoneColors|zoneEdges` → only `LessonVisual.jsx:385-386` and `charts.jsx`'s consumer). **External controls, injected into the real files and restored from a scratchpad copy (`cmp` byte-identical):**
1. The tidied `zoneColors={[surface.warnWash, surface.okWash]}` in `LessonVisual.jsx` → **FAIL ×2**: the wiring half, plus the in-script control whose anchor had gone, which reports that honestly rather than passing.
2. `flipZoneSeries` reversed to return `[0,1]` → **FAIL ×1**, from the model half, naming the arithmetic's `[1,0]`.
**One self-inflicted FAIL on the way:** §59 caught "labelled" in my new comment. It is fixed ("labeled"), which shows the US-English guard still fires on new code.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged) |
| §50 line | now ends "…zone tints follow flipZoneSeries() [1,0] through one FLIP_PALETTE entry per series — two injections … both caught." |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** |
| Live render | `dist/` served statically and opened at `#/lesson/23` (all 44 lessons marked complete in storage, then cleared). Zone rects: `var(--surface-ok-wash)`, `var(--surface-warn-wash)`. Strokes: amber, green. Legend: "Here, the $65 feels worth more" = ok-wash / green edge, "Here, the $50…" = warn-wash / amber edge. Series inks: warn / ok. **This is identical to the pre-change mapping, so pixels are unchanged.** The control for the probe is that the zone labels in the same legend rows are the ones (j) proves sit on the right sides. |

#### Step 5: adversarial self-check
- **Blindspot register:** no content text changed. No figures, dates, advice or Dalio. `check-blindspot` passes inside `npm test`.
- **DECISIONS.md:** no conflict. Content stays a `.js` module, it gains a pure function with no theme import, and nothing touches state or storage.
- **Done work:** (i) and (j) are untouched and still pass. (k) extends them and does not re-check labels.
- **Is the wiring check a regex-over-JSX that reads the wrong thing?** That is the item's own warning. It is bounded: exact expressions, not a parse. A harmless refactor, such as renaming `p` to `c` in the map callback, **will** fail it. I accept that false-positive cost: the message says "route it through FLIP_PALETTE … or repoint this block", and a loud false positive is cheaper than a silent miss here.
- **My own claims:** a reviewer who re-runs the two injections, `npm test`, the build and the live probe gets the same results.
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- The other money figures (`labelInks` at `LessonVisual.jsx:233/286/299/362/409/501`) pair inks to series by index too. None of them has a reversed second array, which was the specific trap here. No live instance was seen, so none was filed.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** no visible change. The two colored bands in the "later vs now" chart can no longer be swapped by a tidy-up edit, and the test suite now proves it.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-26 (scheduled dev-agent; **a free pick**. `npm test` shows **0 FAIL, 1 WARN** (O-3's), so W-8.5 stays expired. **The pick is the previous run's named residual: a hand read of the lesson titles and subtitles in `lessons.js` for ko/zh/ja.** This is the second run in a row to take its predecessor's residual, which W-6.2 rule 1 allows once more and no further. ⛔ **The next run may NOT take a residual of this one**) — **lesson 27's title lost its point in three languages, one Chinese title named the wrong thing, and one Chinese subtitle was garbled.** Titles show on the lesson card, at the top of the reader, and in quoted cross-references inside other lessons and quiz explanations.
- **Lesson 27 (loss aversion) in ko/zh/ja.** English asks why losing $50 *hurts more than finding $50 feels good*. All three translations said "why does losing $50 hurt more than finding $50", and finding money does not hurt at all. That drops the pain-versus-equal-pleasure asymmetry, which is what the lesson teaches. The titles now compare pain with pleasure: ko "왜 50달러를 잃은 아픔이 50달러를 주운 기쁨보다 더 클까?", zh "为什么损失50美元的痛苦，比捡到50美元的快乐更强烈？", ja "なぜ50ドルを失う痛みは、50ドルを拾う喜びよりも大きいのか？". **The title is quoted verbatim in lesson 28's body and in one quiz explanation in each language, so all 3 × 3 copies changed together.**
- **zh lesson 10's title named the wrong thing.** "为什么你的纳税方式取决于你如何被支付" means "why your *way of paying tax* depends on…". English is about the tax *bill*. It now reads "W-2与1099：为什么领薪方式不同，税单也会不同". Nothing else quotes this title.
- **zh lesson 11's subtitle was garbled.** "会像复利那样不利地累积，正如利息会像复利那样…" said "like compounding" twice and never said *against you*. It now reads "会以复利的方式对你不利地累积，就像利息以复利的方式对你有利地累积一样".

**Step 3.5: the premise and its controls.** The premise was that ko/zh/ja titles and subtitles had never been read by hand, and it held. **Control:** the first dump attempt hung on a stray `cat >` with no input (my error, not the module's), and I killed it. The rerun imported `lessons.js` and printed **44 lessons × 2 fields × 5 languages, 0 missing**. Lesson 29's known title matched line 169, and I read every row. Before the patch, cross-reference contexts were found **with Node, not grep**: ugrep's bounded repetition aborted, as the memory note warns. That search is how the 6 quoted copies of lesson 27's title were found.
**Read and deliberately left alone:**
- **ko 22 "확인받고".** It means "getting confirmation" and fits the lesson's confirmation bias. ja 22 uses 確かめる vs 確認, a weak contrast but not a wrong one.
- **zh/ja 20 "都在买/買っている".** They add "buying", and the lesson is about FOMO in purchases, so this is faithful in sense.
- **es 31 "Crecimiento de Productividad".** It drops "The Long-Run Driver", but the subtitle carries the idea. It is outside this read's ko/zh/ja scope, so it is left as seen.
- **ja 44 「不労」.** The 09-25 quiz run already kept it as the standard term.

**The fix.** A Node patcher required each old string ×1 and each new string ×0 in every target file. It also required that no other `src/content` file hold an old string, and aborted otherwise. **7 content files, 9 lines in, 9 out.** No English and no es changed. `translation-review.mjs` hashes only English, so review coverage is correctly unchanged.
**One knock-on:** the lesson-28 cross-reference edits moved lesson-body character counts (ko +1, zh +5, ja +1). `npm test` then FAILed on `LAUNCH_READINESS.md` §10.4's generated volume sentence. `npm run readiness -- --write` was the prescribed fix, and `git diff --word-diff` shows it changed **only those three numbers** (88,122→88,123, 55,200→55,205, 77,262→77,263). The ratios are unchanged to three decimals.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged); 1 FAIL before the readiness rewrite, reported above |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** (exit read on its own line) |
| Built bundle | Each new lesson-27 title appears **3×**, matching the English control's 3× (title, lesson 28, quiz). The zh 10 and zh 11 strings appear 1× each. All 5 old strings: **0**. Control `时间胜过时机` = 1; nonsense probe = 0 |
| Live render | **Not done, on purpose.** These are the same text nodes as before, and the bundle probe shows the strings ship |

#### Step 5: adversarial self-check
- **Blindspot register:** these are titles only. There are no figures, dates, advice or Dalio. The zh 10 title claims only that the way you are paid changes the tax bill, which English claims too. `check-blindspot` passes inside `npm test`.
- **Quiz leak?** The quiz explanation that quotes lesson 27's title is shown after answering, and the change keeps it a quotation of the title, not a hint.
- **DECISIONS.md / done work:** no conflict. The 09-25/09-26 glossary, quiz-stem and heading fixes are untouched.
- **My own claims:** a reviewer who re-runs the dump, the patcher's assertions, `npm test`, the build and the bundle probes gets the same results. ⛔ The new ko/zh/ja wording is machine-written and unreviewed (O-3).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **Short-string hand reads are now complete** across glossary names, quiz stems, section headings and lesson titles/subtitles. No short-string surface is left unread in ko/zh/ja. ⛔ Under W-6.2 rule 1, the next run must make a free pick that is not a residual of this chain.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** the loss-aversion lesson's title now says "losing hurts more than finding *feels good*" in Korean, Chinese and Japanese, as English does. One Chinese tax-lesson title and one Chinese fee subtitle also read correctly now.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-26 (scheduled dev-agent; **a free pick**. `npm test` shows **0 FAIL, 1 WARN** (O-3's), so W-8.5 stays expired. **The pick is the previous run's one named residual: a hand read of the lesson section headings in ko/zh/ja.** This is the first time in a row that a run took its own previous run's residual, so W-6.2 rule 1 allows it. **The next run may take a residual of this one only once more**) — **three lesson section headings were wrong in one language each: one was garbled, one dropped the concept its section teaches, and one turned the lesson's own test into a statement.** These headings are the bold titles inside the lesson reader.
- **zh money 24.0 was garbled.** "…这正是想要**要**借用它的名字的原因。" had a doubled 要 and no quotation marks, so 想要 ("wants", the noun) reads as the verb "to want". It is now "“需要”跳过了那个问题。正因如此，“想要”才借用它的名字。" The body already quotes “需要” this way.
- **zh essentials 10.1 dropped "both halves".** It said "承担两份负担" ("bearing two burdens"), and the section teaches that the self-employed pay the employer's half as well as their own. It is now "自雇税：两半都由自己承担", using the body's own phrase "自雇者要自己承担两半".
- **ko money 25.1 dropped the test's first question.** "언제 필요할지 모르는데, …" says "you don't know when you'll need it". The test the section teaches asks the reader to work out when. It is now "테스트: 언제 필요할 수 있는가, 그리고 그날 가치가 떨어져 있어도 괜찮은가?", which matches the body ("얼마나 빨리 필요할 수 있는가") and the plain ending of the sibling test heading, 24.1.

**Step 3.5: the premise and its controls.** The premise was that the ko/zh/ja headings had never been read by hand, and it held. **The first dump returned 0 headings, and the control caught it:** the merged module is `sections[i].heading[lang]`, not `sections[lang][i]`. The corrected dump returned **107 headings × 5 languages across 44 lessons, with 0 missing**, and I read all of them.
**Read and deliberately left alone:**
- **es "el/del Fed" (35.2).** The es corpus uses the masculine form 37 times and "la Fed" 5 times, so it is the house choice, not a slip.
- **ko 44.0 "'수동적'이라는 단어가 빼놓는 부분".** It is a free rendering of "Nothing Starts Passive", but it is faithful in sense.
- **The ko 다/입니다 register mix** across the money headings. It is cosmetic and appears in about 8 headings.
- **en 3.2 ("stay invested") against the four "must be reinvested" renderings.** They are close enough in sense, and all four agree.

**The fix.** The patcher required each old string ×1 and each new string ×0 before writing. `git diff --stat` shows **3 files, 3 lines in, 3 out.** No English, body, takeaway, es or ja text changed. `translation-review.mjs` hashes only the English source, so review coverage is correctly unchanged.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged) |
| Readback | Re-importing `lessonContent.js` prints all three new headings exactly; the en 24.0 control is unchanged |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** |
| Built bundle | Each new string is in 1 file, each old string in 0. Known-string control `时间胜过时机` = 1; nonsense probe = 0 |
| Live render | **Not done, on purpose.** The headings are the same text node as before, and the bundle probe shows the new strings ship |

#### Step 5: adversarial self-check
- **Blindspot register:** the three changes are headings with no figures, dates, advice or Dalio. The ko 25.1 wording asks the same question as the English and recommends nothing. `check-blindspot` passes inside `npm test`.
- **DECISIONS.md / done work:** no conflict. The 09-25 quiz-stem and glossary fixes are untouched.
- **My own claims:** a reviewer who re-runs the dump, `npm test`, the build and the bundle probes gets the same results. ⛔ The new zh/ko wording is machine-written and unreviewed (O-3).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **Lesson titles and subtitles in `lessons.js`** are still unread by hand in ko/zh/ja. They are the last short-string surface. ⚠️ Under W-6.2 rule 1, the next run may take this residual, but the run after it may not.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** three lesson section headings now read correctly: one Chinese heading had a doubled character, one Chinese heading lost "both halves" of the self-employment tax, and one Korean heading had turned a question into a statement.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-26 (scheduled dev-agent; **a free pick**. `npm test` shows **0 FAIL, 1 WARN** (O-3's), so W-8.5 stays expired. The previous run was an archiving pass, so W-6.2 rule 1 does not arise. **The pick is the residual both 09-25 entries named as still open: a hand read of the ko/zh/ja glossary `s` strings**) — **four glossary entries showed a name in some languages that dropped half of what English shows.** `s` is the row title in Reference → Glossary, the heading in the term detail, and the chip label under lessons (`Glossary.jsx:201`, `TermDetail.jsx:54`, `GlossaryTerms.jsx:61`), so this is the first thing a learner reads for the term.
- **PMI `ja`: "PMI" → "購買担当者景気指数（PMI）".** en/ko/zh/es all expand the acronym, and the ja `f` never does either, so **a Japanese reader of the glossary was never told what PMI stands for.** The wording copies ja lesson 39 ("PMI（購買担当者景気指数）").
- **Fed Funds Rate `ja`: "FF金利" → "フェデラルファンド金利（FF金利）".** The other four languages name the rate in full. The long form is the ja lesson heading, and the ja quiz stem already pairs the two.
- **VIX:** en and ko show both halves, "Volatility Index (Fear Gauge)". **zh dropped the nickname, es dropped the nickname, and ja showed only the nickname.** zh is now "波动率指数（恐慌指数）", ja "ボラティリティ指数（恐怖指数）", and es "Índice de Volatilidad (medidor del miedo)". Each nickname is the one that language's own economy lesson uses.

**Step 3.5: the premise and its controls.** The premise was that ko/zh/ja glossary `s` strings had never been read by hand. Both 09-25 entries say so, and it held. All **43 entries × 5 languages** were dumped side by side from the module and read in full. The dump shows 43 keys with no `<MISSING>` language. **Read and left alone, on purpose:** ko "비상금" (11 uses in ko essentials, 0 of "비상 자금"), zh "生产力增长" (the zh economy lessons use 生产力 9× to 生产率 2×) and ja "不労所得" (the 09-25 quiz run kept it: it is the standard term). A glossary name that disagrees with its own lessons would be worse than either word.

**The fix.** A patcher required each old string ×1 and each new one ×0 before writing. `git diff --stat`: **1 file, 3 lines in, 3 out** (five `s` values; VIX's three sit on one line). No `f`, no `ex`, no English and no ko changed. The glossary key is unchanged, so review/bookmark state (keyed by term) and search by "PMI"/"VIX" are unaffected. The ja/zh/es sort position moves, which is by design: `Glossary.jsx` sorts on what the row displays.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged) |
| Readback | Re-importing the module shows all five new `s` values; en PMI unchanged |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** (exit read on its own line) |
| Built bundle | Each new string is in 1 file. Format control: `s:"購買担当者景気指数（PMI）"` = **1**. Old `s:"PMI"`, `s:"FF金利"`, `s:"恐怖指数"`, `s:"波动率指数"` = **0**. Nonsense probe = **0** |
| Live render | **Not done, on purpose.** Same text child as before, and the bundle probe shows the strings ship |

#### Step 5: adversarial self-check
- **Blindspot register:** these are names only. There are no dates, figures, advice or Dalio. `check-blindspot` passes inside `npm test`.
- **Quiz leak?** One quiz asks which indicator is nicknamed the fear gauge. English has always shown "(Fear Gauge)" in this title and ja always showed 恐怖指数, so this restores parity rather than adding a cue. The glossary and the quiz are also separate screens.
- **Collision:** essentials lesson 12's "PMI" means private mortgage insurance. `lessonTerms.js:281` already excludes it from the chip, so the longer ja name cannot mislabel that lesson.
- **DECISIONS.md / done work:** no conflict. W-8.7's Yield Curve reconciliation and the 09-25 quiz-stem fixes are untouched.
- **My own claims:** a reviewer re-running the dump, `npm test`, the build and the bundle probes gets the same results. ⛔ The new zh/ja/es wording is machine-written and unreviewed (O-3; the glossary sits outside the review ledger by recorded decision).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **Section headings** in ko/zh/ja are still unread by hand. They are the last short-string surface the ratio instrument cannot see.
- **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** in the Japanese glossary, "PMI" and "FF金利" now show what they stand for. The VIX entry now shows both its formal name and its "fear gauge" nickname in Chinese, Japanese and Spanish, as English and Korean already did.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-25 (scheduled dev-agent; **the previous run's named handoff**: its entry tripped `check-log-size`'s headroom WARN and said *"The next run should be W-5.3's archiving pass"*, so W-6.2 rule 1 does not arise) — W-5.3's **twentieth** firing: 2026-09-20 (**14 entries, 165,564 b**) moved verbatim to `AGENT_LOG.archive.md` under `## Archived 2026-09-20`. Run log **242,150 → 76,586 b** (96.9% → **30.6%** of budget; 0.75 → **16.5 runs** of headroom), headroom WARN cleared (`npm test` 2 WARN → **1**, O-3's).

**Step 3.5: the premise, re-measured.** `check-log-size` at HEAD `c3b3b94`: run log **242,150 b**, 4 live days (09-20, 09-21, 09-22, 09-25), **0.75 runs** left, WARN firing, its own 4 controls firing. The premise held. I re-derived the cut from byte offsets instead of taking it from the instrument. The run log is newest-first, so 09-20 is the **tail** of the file: 14 `### 2026-09-20` headings from 527,563 to 677,181. Every other dated heading precedes the first one, so the day is one contiguous region running to EOF. The block starts one byte earlier, at the blank-line `\n`, so the live file still ends `.\n` and the archive keeps its two-blank-line section spacing.

#### What shipped (2 files, no source change)
- `AGENT_LOG.md` **693,126 → 527,562 b** before this entry; **3 live days**, oldest 2026-09-21. **Floor unchanged at 450,976 b.**
- `AGENT_LOG.archive.md` **4,828,812 → 4,994,400 b**; new final section `## Archived 2026-09-20`; the title range `→ 2026-09-19` becomes `→ 2026-09-20` (asserted byte-neutral and matched exactly once before writing).
- The mover lived in the scratchpad: **`scripts/` gained 0 lines.** `src/` untouched.

#### Verification
| Check | Result |
|---|---|
| **Conservation (independent)** | The block read back **out of the written archive** by its own heading, appended to the new live file, reproduces `git show c3b3b94:AGENT_LOG.md` **byte for byte (693,126 b)** |
| Negative control | The same splice **one byte short** does **not** match |
| Containment | `### 2026-09-20`: live **0**, archive **14** (was 0) |
| Composition | live 527,562 + block 165,564 = **693,126**; archive grew **165,588** = heading (24) + block. Checked against the independently built parts, not the written string |
| Tamper plants (in memory) | **3/3 fire**, the same pattern the nineteenth pass recorded: a dropped byte fails conservation + composition, an entry left behind fails all three, a byte from nowhere fails **composition alone** |
| Plants never wrote | a dry run first, then `cmp` against scratchpad pre-copies: both files identical |
| `npm test` | **exit 0**, 0 FAIL, **1 WARN** (O-3's 0%-human line, unchanged). MEASURED 2026-09-25, before this entry: run log 76,586 b, floor 450,976 b, archive 4,994,400 b, 3 live days |

#### Step 5: adversarial self-check
- **Blindspot register:** out of reach. Only two markdown files changed; `check-blindspot` is green inside `npm test`.
- **DECISIONS.md / W-7.2 rule 3:** entries were moved **verbatim**, nothing was deleted or edited, and the new section went in date order. The independent conservation check is the proof: any edit at all would fail it.
- **Already-done work:** this is a standing chore firing again, not a re-pick. The archive had 0 entries for 09-20 before and has exactly 14 now, so nothing overlaps.
- **My own claims:** everything reads from the repo. ⚠️ Once this commits, HEAD moves. **A reviewer must name this commit's parent `c3b3b94` explicitly**, not HEAD.
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **The floor is still the constraint no archiving pass can move:** 450,976 b of a 500,000 b warn budget (**90.2%**, 55 runs at its current net-negative drift). This is unchanged from the nineteenth pass's note.
- **O-6 (automate the move?)** now has a second clean transfer of the recipe. It is still the owner's call.
- The previous run's residual, a hand read of ko/zh/ja glossary `s` strings and headings, is **still open** and is a legal free pick for the next run.

**Owner-facing, one line:** the run log was within one run of its size budget, so 2026-09-20's 14 entries moved verbatim into the archive (run log at 30.6% of budget, warning cleared). The archived text reproduces the original file byte for byte. There is no learner-visible change, and this is **committed, not pushed**.

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-09-25 (scheduled dev-agent; **a free pick**. `npm test` shows **0 FAIL, 1 WARN** (O-3's), so W-8.5 stays expired. W-8.6's Markdown guard is already satisfied: `check-data.mjs` §84 exists. The previous run was a free pick that left no residual. **The pick is the one surface the 09-25 per-paragraph run named as uncovered: a hand read of the ko/zh/ja quiz stems against English.** That run read only `es`) — **one Chinese quiz question was ungrammatical and asked the wrong kind of question, and three languages never said what "QE" stands for.**
- **q035 `zh` (lesson 21, anchoring):** "被划掉的220美元**究竟能说明**89美元**是不是**一个公平的价格**吗**？" stacks 是不是 and 吗, which is ungrammatical, and turns "what does the $220 tell her" into a garbled yes/no question. It now reads "对于89美元是不是一个公平的价格，被划掉的220美元究竟能说明什么？". The options were left alone: "能说明——…", "几乎不能说明什么…" and "说明…" all answer "能说明什么" naturally.
- **q007 (lesson 37):** en says "What is QE (Quantitative Easing)?" and ko says "양적완화(QE)란?". **zh, ja and es said only "QE".** The 09-25 run left `es` alone because zh/ja did the same. Reading all four shows **three of four translations drop it, which is a pattern, not a precedent.** Each now uses its own lesson's term: zh "什么是量化宽松（QE）？", ja "量的緩和（QE）とは？" (both copy the `量化宽松（QE）` / `量的緩和（QE）` form in their economy lessons), and es "¿Qué es QE (flexibilización cuantitativa)?" (the term `lessonContent.economy.es.js` and the glossary use).

**Step 3.5: the premise and its controls.** The premise was the 09-25 claim that "only `es` stems were read by hand." Confirmed from that entry. All **46 × 3 = 138 stems** were dumped side by side with en and read in full; the dump confirmed 46 entries in each of the four files.
- **Control for the grammar hit:** I grepped every zh module for `是不是[^？]*吗`. It returns **1** in `quizText.zh.js`, the known instance, so the pattern fires, and **0** in all three zh lesson modules. The class does not recur in the prose.
- **Read and left alone, on purpose:** ko register drift (q030 "만드는가?", q031 "말해줍니까?" amid 요-form stems) is stylistic, not wrong. ja q039's "何の代償を払っていることになりますか" is stiff but grammatical. q046 `ja` "不労所得" is the standard term, and it names the very misconception lesson 44 examines.

**The fix.** A patcher required each old string ×1 and each new one ×0 before writing, then re-imported all three modules. `git diff --stat`: **3 files, 4 lines in, 4 out**. **No English, no ko, and no option or explain changed**, so item 160's option-length signal is untouched.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged) |
| Readback | Re-import shows q007 in zh/ja/es and q035 in zh carrying the new stems |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** (exit code read on its own line) |
| Built bundle | 4 new phrases: 1 file each. The old zh q035 phrase: **0**. Nonsense probe: **0** |
| Live render | **Not done, on purpose:** these are data strings rendered through the same text child as before, and the bundle probe shows they ship |

#### Step 5: adversarial self-check
- **Blindspot register:** no advice language, no dates, no figures, no Dalio, no kids framing. `check-blindspot` passes inside `npm test`.
- **Could the expansion leak the answer?** No. No option in any language contains 量化宽松, 量的緩和 or "flexibilización"; the keyed option describes bond buying at 0% rates. English has always carried the expansion, so this restores parity rather than adding a cue.
- **DECISIONS.md:** no conflict; content stays in `.js`.
- **Undoing done work:** 09-25's four `es` stems (q002, q003, q005, q006) are untouched. q007 `es` was left by that run *because* zh/ja matched it, not by a recorded decision, and that reason is gone now that all four were read.
- **My own claims:** a reviewer who re-runs the grep control, `npm test`, the build and the bundle probes gets the same results. ⛔ The new zh/ja/es wording is machine-written and has not been reviewed (O-3).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **Only quiz stems were read.** Glossary `s` strings and section headings in ko/zh/ja are still unread by hand. The ratio instrument cannot see strings that short.
- **W-8.1 still applies:** this is committed, **not deployed**.
- ⚠️ **The log-size headroom WARN fires with this entry in place.** `check-log-size` MEASURED 2026-09-25: run log **241,922 b**, 0.74 runs of room left. **The next run should be W-5.3's archiving pass**, not a content pick.

**Owner-facing, one line:** one Chinese quiz question was ungrammatical ("can it show… whether… ?" asked twice over) and is fixed. The "What is QE?" question now spells out quantitative easing in Chinese, Japanese and Spanish, as English and Korean already did.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-25 (scheduled dev-agent; **a free pick**. W-8.5 has expired and `npm test` shows **0 FAIL, 1 WARN** (O-3's). The previous run was a free pick, so its residual (a hand read of ko/zh/ja short strings) was a legal pick #1. I did not take it. **The pick is W-8.7's named cosmetic residue**: the one open item that a weekly review had already scoped, that shows on screen, and that needs no new instrument) — **the Yield Curve glossary entry no longer shows two different start years two sentences apart.** `f` said "the six US recessions since 1976" and `ex` said "every US recession since 1955". Both claims now sit in `f`, and the entry now tells the learner why the dates differ: 1976 is when daily data on the usual 10-year-minus-2-year gap begins. `ex` now points back to "that track record" and keeps its hedge. Changed in all five languages; no claim was weakened and no figure changed.

**Step 3.5: the premise, re-measured with controls.**
- *"A learner sees both":* checked, not assumed. `entry.f` and `entry.ex` render together on all three surfaces (`Glossary.jsx:208/213`, `TermDetail.jsx:59/65`, `GlossaryTerms.jsx:129/133`). **Holds.**
- *"1976 is the series start, not a choice":* checked on FRED's keyless CSV. `T10Y2Y`'s first row is **1976-06-01**, and a bogus series id returns **404** (control). **Holds.** 1955 still rests on 4cad5d9's reasoning: 1957 and 1960 predate `DGS10`, so it cannot be tested here and was left as it stood.
- The premise held, so the disposition held: fix how the entry reads without touching either claim.

**The fix.** `src/content/glossary.js` changed in one line (the entry is a single source line). Written by a patcher that required each of the 10 old strings (5 languages × `f`/`ex`) to appear **×1** and each new one **×0**. It kept the file's `—` escape style, re-imported the module and checked every value. No provenance comment went into `src/` (W-8.3).

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, unchanged); §67 glossary completeness **0/344 flagged** |
| Readback | patcher re-import: 10/10 values match; `git diff --stat`: 1 file, 1 line |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** |
| Built bundle | new en and zh phrases: 1 file each; old "since 1976 it came": **0**; nonsense probe: **0** |
| Live render | **Not done, on purpose:** this is a data string. It renders through the same text child as before, and the bundle probe shows the new text ships |

#### Step 5: adversarial self-check
- **Blindspot register:** no advice, no Dalio, no kids framing, no new date or live figure. "More than four years later" is kept as it was, and no future event can falsify it. `check-blindspot` passes inside `npm test`.
- **DECISIONS.md:** no conflict.
- **Undoing done work:** 4cad5d9's measured range (7 to 25), its 2022 counterexample, its "since 1955" and the quiz-derived hedge in `ex` are all still present in every language. I checked each against the diff.
- **My own claims:** a reviewer re-running the FRED curl pair, `npm test`, the build and the bundle grep gets the same results. ⛔ The new ko/zh/ja/es wording is machine-written and unreviewed (O-3).
- No conflict found.

**Owner-facing, one line:** the glossary's Yield Curve card mentioned "since 1976" and then "since 1955" two sentences later with no explanation; it now gives both and says why the dates differ, in all five languages. Committed, **not deployed** (W-8.1).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-25 (scheduled dev-agent; **a free pick** — W-8.5 expired when item 94 closed, and `npm test` confirms it: **0 FAIL, 1 WARN**, the one being O-3's 0%-human-review line. The previous run was a W-8.5 pick, so W-6.2 rule 1 does not arise. The pick is the previous run's own "single highest-value follow-up": the per-paragraph sweep of all 44 lessons × 4 languages) — **the sweep came back clean, and the real defect was in the one place it cannot look: four Spanish quiz questions had dropped the noun that says what they are asking about.** `es` "¿Cuál es la parte más importante?" (*of what?* — "of the economy" kept by ko/zh/ja), "¿Cuánto dura el ciclo corto?" (short-term **debt** cycle), "Una curva invertida predice:" (inverted **yield** curve), and one stem that was ungrammatical, "¿Qué pasa en un desapalancamiento diferente de recesión?". All four fixed (q002, q003, q005, q006); nothing else changed.

**Step 3.5 — the premise, re-measured with controls.** The 09-22 entry said the lesson-level check "cannot rule out" abridged `es` on the two main tracks.
- **Per paragraph, 1,340 cells: 0 parity breaks, 11 below 0.70.** Negative control (lessons 12/13/15): **80 cells, min 0.709** (09-22 published 0.705; the p90s have moved a little since). Positive control: removing the last sentence of a known-good es paragraph in lesson 13 moves it **0.93 → 0.28**. Both fire.
- ⭐ **The premise broke on its disposition, not only its number.** Eight of the eleven are **lesson 16 §0 ¶2-3 in all four languages**, which looks exactly like lesson 14. **It is not.** The 2026-09-19 owner-directed run read those clauses, restored the one that carried teaching (Dan's savings), and **left the rest out on purpose** ("a name that turns up in nearly every book written about money", "a person with a bit more money buying something they wanted", "worth being honest about that") — its words: *"Restoring them would be padding to clear a threshold."* Found by grepping the archive for the dropped English before editing anything. **Not touched.** Fixing it would have undone a recorded decision.
- The other three (4 ja §1¶1, 9 es §1¶0, 17 es §0¶0) were read in full: tighter wording, no fact dropped.
- **Other translated fields** (takeaway, thinkAbout, quiz stem/option/explain, glossary `f`/`ex`: 450 fields × 4), each language against its own p90 for that field type: **no field short in all four; `es` never flagged.** The injected-truncation control (q006's es explain cut in half) came back **0.37**, so it fires.
- **What the ratio cannot see: strings under ~60 characters**, where one word is a large share and noise is high. I read all 46 `es` quiz stems next to English by hand. The four above are the only ones where `es` alone dropped the head noun that ko, zh and ja all kept (q007's "¿Qué es QE?" also drops the expansion, but zh/ja do too, so it is left).

**The fix.** `src/content/quizText.es.js`: 4 stems, done by a patcher that checked each old string appeared **×1** and each new one **×0** before writing. Terms matched to what the corpus already uses: "ciclo de deuda a corto plazo" (3 existing hits; the grep's control), "curva de rendimiento" (glossary's `es` term; "curva de rendimientos" gets 0 hits). **No English changed, no option changed** (so item 160's option-length signal is not touched), no ko/zh/ja changed.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, 1 WARN (O-3's, as before) |
| Readback | Re-imported: indices 1, 2, 4, 5 carry the new stems; `git diff` **4 lines out, 4 in**, one file |
| Build | `scripts/build-out-of-tree.sh` → **✓ built, exit 0** (exit code read on its own line) |
| Built bundle | All 4 new stems found only in `quizText.es-*.js`; the old garbled stem gives **0** hits; nonsense probe **0** |
| Live render | **Not done**, and I'm saying so: this changes a string in a data file, not the UI. The stem renders through the same text child as before, and the bundle probe shows it ships |

#### Step 5: adversarial self-check
- **Blindspot register:** no advice language, no dates, no figures, no Dalio, no kids framing. `check-blindspot` passes inside `npm test`.
- **DECISIONS.md:** no conflict: content stays in `.js`, and "(Beta)" is unchanged.
- **Already done / undoing something:** ⭐ **the check that mattered.** The obvious edit (lesson 16 §0) would have reversed the 09-19 decision; I found that and did not make it. The quiz stems are not in any completed item (checked by grepping for the old strings).
- **My own claims:** a reviewer re-running the patcher's asserts, the bundle grep and `npm test` gets the same results. The sweep scripts were scratch files and were not committed (W-8.4: `scripts/` +0 lines). Their method and controls are written into item 94 so the next run can rebuild them. ⛔ The new Spanish is still machine-written; no fluent reader has checked it (O-3).
- No conflict found.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **Only `es` stems were read by hand.** The ko/zh/ja stems I read for q002-q007 only (they kept the nouns). A hand read of all four languages' **short strings** (stems, glossary `s`, headings) is the one surface no instrument here covers.
- **I did not build a per-paragraph check.** The corpus is clean, §33's lesson-level baseline already catches new drift, and W-8.4 argues against adding script weight. This would change if a future English edit grows a paragraph.
- **W-8.1 still applies:** this is committed, **not deployed**.

**Owner-facing, one line:** checking every paragraph of every lesson in four languages found **no cut-down translations left** (the one flagged lesson was trimmed on purpose on 09-19). Four Spanish quiz questions had lost the word that says what they're asking about, e.g. "What's the most important part?" with no "of the economy". Those are fixed.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-22 (scheduled dev-agent; **item 94's last lesson, and W-8.5's clause expires with it** — `npm test`'s WARNs were re-read first: item 160's is still clear, item 94's still stood, so W-8.5 resolved to item 94 and no ranking decision was left, there being one candidate) — **`essentials` lesson 14, "Wills & Beneficiaries", is now fully translated — in FOUR languages, not the three the item budgeted.** es 0.83 → **1.10**, ko 0.37 → **0.49**, zh 0.24 → **0.32**, ja 0.33 → **0.43**. **Abridged pairs 3 → 0, abridged lessons 1 → 0.** Item 94 is closed; the whole corpus now clears the completeness threshold in all five languages.

⭐ **The premise was wrong in its disposition, not just its figures, and this is the third time step 3.5 has changed what a run did rather than what it reported.** Item 94 said, in bold: *"its `es` reads **0.83** and has never been abridged, so the closing run edits ko, zh and ja only — do not budget or verify a fourth language."* `LAUNCH_READINESS.md` §10.4 carried the same reading from 2026-09-05 (*"the pair that left is lesson 14's `es`, whose Spanish was not edited — it reads `0.83` both times"*). **Both were wrong. Spanish lesson 14 was abridged exactly as the other three were, missing the same clauses in the same three paragraphs.**

**Why the shipped instrument cannot see it, stated as a mechanism rather than a miss.** The threshold is `0.7 x` a corpus-wide p90, and `es` expands to **1.16x** English here — so the `es` cut sits at **0.812**. Lesson 14's Spanish had lost about a quarter of its content and still scored **0.83**, clearing by **2.2%**. **A lesson-level ratio is structurally blind to within-paragraph deletion in whichever language expands most**: the bigger the expansion factor, the more prose a lesson can lose while still clearing its own bar.

**The instrument that does see it, with the control that makes it readable.** Split each section body on the paragraph break, divide translated by English characters, normalize by that language's p90, read **per paragraph**:

| | es | ko | zh | ja |
|---|---|---|---|---|
| §0 ¶1 (intestate succession) | **0.32** | **0.35** | **0.43** | **0.36** |
| §0 ¶2 (details vary / lesson scope) | **0.50** | **0.46** | **0.40** | **0.44** |
| §1 ¶1 (the divorce mistake) | **0.47** | **0.44** | **0.47** | **0.51** |
| §1 ¶2 (beneficiary forms) | 0.76 | **0.67** | 0.77 | 0.75 |
| §0 ¶0, §1 ¶0 | 0.89–1.00 | 0.71–0.82 | 0.79–0.90 | 0.71–0.85 |

⭐ **The control is the whole reason this is usable, and it fired in both directions.** Run over the three `essentials` lessons that are already full translations (12, 13, 15) it returns **80 cells, minimum 0.705, nothing below 0.70**. Lesson 14 returned **13 of 24 below 0.70**. The bands do not overlap, so the instrument separates done from not-done rather than flagging everything — and **after the edit lesson 14's own minimum is 0.706, inside the control band.** An en-vs-en negative control returns 1.00 across the board.

**What was actually gone, read by hand rather than inferred from the ratios.** All four languages kept the first sentence of §0 ¶1 and dropped both the parenthetical describing what the intestate formula *does* (spouse and children in preset shares, distant relatives if no immediate family) **and the entire second sentence** — the three cases that make the point, an unmarried couple together for decades, one child needing more support, who the deceased would have chosen to raise their kids. §0 ¶2 lost its parenthetical (state rules, notarization, witnesses) and its closing clause. §1 ¶1 kept the setup of the mistake and **dropped the sentence stating its outcome**.

⚠️ **Two of those are not completeness items.**
1. **§0 ¶2's dropped clause is "which is why this lesson explains what a will does rather than how to write one" — the lesson's own scope disclaimer, missing in all four languages.** That is a §10.1 matter: a lesson about wills was reading, in every non-English language, without the sentence that scopes it as explanatory rather than a how-to. **This is the second consecutive lesson whose missing clause was its own hedge** (lesson 11 dropped "nor that every fee is unjustified"). Restoring it moves the lesson toward §10.1, not against it.
2. ⭐ **§1 ¶1's dropped sentence is the one the lesson's own quiz question asks about.** q028 (fully translated in all five languages) asks who actually receives the 401(k); English §1 ¶1 answers it in terms — *"the account goes to whoever's name is on the beneficiary form, not whoever the will names"* — and **that sentence existed in no language but English.** The abstract form survived in §1 ¶0 and the takeaway, so the question was not unanswerable, but the paragraph built to answer it stopped at the setup. **Worth reusing: check an abridged lesson's quiz question against the paragraph that teaches it, not just against the lesson as a whole.**

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0** — 0 FAIL, **1 WARN**. The completeness WARN is **gone**; the remaining WARN is O-3's 0%-human-review line, which is not this item's |
| `npm run check-blindspot` | **exit 0**, 9 ok — §10.1 advice-adjacency across all five languages, §2.3 live-looking dates over 26 teaching modules |
| Build | `scripts/build-out-of-tree.sh` → **✓ built in 553ms, exit 0**. Exit code read from `$?` on its own line, never through a pipe |
| Readback | All **14** replacements re-imported and compared against intent: **14 exact, 0 mismatched**. Mutation control (`décadas`→`decadas`) returns **0** hits |
| Untouched content | **0 unintended changes**; **26** paragraphs/fields asserted **byte-identical** (both headings, `takeaway`, `thinkAbout`, §0¶0 and §1¶0 in all four languages, and every one of the other 14 lessons). Comparator control fires on a one-space difference |
| English | **0 `.en.js` files in `git diff --name-only`**; every `sourceHash` in the review ledger unchanged (**0 changes across all 44 lessons**), which is the independent proof English did not move |
| Diff shape | **2 changed lines per file, 4 files**; line counts unchanged at 273 in all four |
| Encoding | `U+FFFD` scan **0** in all four files |
| **Live render** | Served `dist/` statically, unlocked 1–13 via `localStorage`, opened `#/lesson/14` in the real DOM in **all four languages**: **38 restored clauses, 0 missing, 0 cross-language leaks**, nonsense probe false in all four. The strings are provably new — the edit script asserted each occurred **0 times** in the source before writing |
| Mobile | **0 px horizontal overflow at 375×812 in all four languages**, viewport asserted real (375, not 0) before reading, and a planted 2000px element produced **+500 px** and **0** after removal |
| Redo | Lesson 14 has **not** been closed before: the commit-message probe returns **0** for lesson 14 and **≥1** for all eleven previously closed lessons |

#### One control had to be rebuilt before any render result was read
The static server's first version would have answered **200** to any path, making "the page loaded" unfalsifiable. Rewritten to fall back to `index.html` only for **extensionless** paths, it returns **404** on a bogus `.js`, **200** on a real hashed asset and **200** on `/`. Only then was anything read from the DOM. (Also re-confirmed: seeding `localStorage` does not switch language — the picker must be driven with a native value setter plus a bubbling `change`, **and the switch asserted** — and `npm test | tail` reports the filter's exit code, not the suite's, because zsh spells it `pipestatus`.)

#### A four-pass "unreproducible" note in §10.4, resolved rather than re-warned
§10.4's essentials-volume fraction carried a warning that **four consecutive passes had failed to reproduce their predecessor's level** (gaps of 1.1pp, 0.9pp, 0.2pp, 0.2pp), concluding "the level is not a series and only the movement is safe to read." ⭐ **The level was never drifting — the passes were aggregating the four languages differently.** Re-run on the pre-edit state, the row's own stated method reproduces the published **89.8% exactly** when the four languages are summed before dividing, and reads **88.8%** when the four per-language fractions are averaged. **What identifies it as the aggregation step and not the measurement is that all four per-language figures reproduced exactly** — es 93.0%, ko 87.1%, zh 88.8%, ja 86.1%, the published values to the decimal. The method sentence now names the aggregation; the level is a series again, and reads **91.1%** (es 94.4%, ko 88.3%, zh 90.1%, ja 87.3%) after this edit.

#### Bookkeeping, hand-patched rather than regenerated
`scripts/translation-completeness-baseline.json`: **exactly 4 changed lines**, asserted afterwards that **lesson 14 is the only lesson whose ratios moved** (a `--write` re-records all 44). `scripts/translation-review-ledger.json`: **4 records** re-dated to 2026-09-22 and marked `ai`; **`sourceHash` untouched on all four and on all 44 lessons**. `LAUNCH_READINESS.md` §10.4: **one generated line** via `npm run readiness -- --write`, plus **eight hand-written clauses** each asserted to match exactly once before replacing — including the `0.83` correction, filed where the wrong reading originated rather than only in the backlog. **The p90 reference is byte-identical before and after (es 1.16, ko 0.58, zh 0.36, ja 0.51), so this is a per-lesson diff and not a threshold move.**

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: nothing here instructs or recommends, and the restored §0¶2 clause **strengthens** the row — it is the lesson's own "explains what a will does rather than how to write one", which was missing in all four languages. §1¶2's restored text is explicitly *not* an instruction ("isn't a specific instruction on what any one person's beneficiaries should be"). `check-blindspot` passes in all five. §2.3: no dates in the new prose, live-date scan agrees across 26 modules. §10.2 Dalio: nothing. §10.3: untouched. **No invented quantities — lesson 14 carries no figures, and none were added.**
- **DECISIONS.md.** No conflict: content stays in `.js` modules, `localStorage`-only state untouched, Vite unchanged, "(Beta)" labeling unchanged.
- **Already-done backlog item.** Not a redo, by the controlled commit-message probe above.
- **My own verification claim.** A reviewer re-running these commands gets these figures, with the caveats stated rather than buried: **in-tree `npm run build` does not work on this machine** (out-of-tree script used, as documented); **every visual claim rests on DOM text extraction plus one screenshot**, not on reading the translations as a fluent speaker would; and **the per-paragraph instrument is this run's own**, not a shipped check — it is written up in item 94 so the next run can rebuild it, but `npm test` does not enforce it.
- ⛔ **The limit, unchanged: this is machine translation no fluent speaker has read.** This run added four more pairs of it and re-marked the ledger `ai`. Human share is **0% in all four languages** — **O-3 is the owner's call and closing item 94 does not settle it.**

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- ⭐ **The `es` blindspot is corpus-wide and item 94 only exhausted the lessons the *lesson-level* instrument could see.** Every completeness claim in this repo — including the two main tracks declared "fully translated in all four languages" on 2026-08-22 and 2026-08-24 — rests on that same lesson-level ratio, and `es` is the language it is weakest in. **Nothing here says those tracks are abridged; it says the check that cleared them cannot rule it out.** A per-paragraph sweep of all 44 lessons × 4 languages is one cheap run (the instrument and its control are in item 94) and is **the single highest-value follow-up this run found** — it either confirms the corpus clean with a real instrument or finds the next lesson 14.
- **W-8.6's Markdown guard is still unfiled** and is still the cheapest open guard; §84 now covers the six constructs across 38 modules, so the corpus is clean and guarded on that axis — re-read W-8.6 before filing, it may already be satisfied.
- **The cross-module `$` vs `美元`/`ドル` split and the cross-track `普里娅`/`普莉娅` spelling of Priya** remain, both recorded in item 94's conclusion.
- **W-8.1 still stands and no run can move it.** These corrections are committed, **not deployed**.

**Owner-facing, one line:** the last untranslated lesson — the one that tells you your 401(k) goes to whoever is on the beneficiary form and not to whoever your will names — shipped to every non-English reader with that sentence removed, along with the line saying the lesson explains what a will does rather than how to write one; all of it is restored, **and the run found that the Spanish version was abridged too, which the project's own instrument had said twice that it was not** — so item 94 closed at four languages instead of three, and the whole 44-lesson corpus is now fully translated.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-09-21 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read first, before anything else: item 160's is still clear, item 94's still stands, at **7 pairs / 2 lessons**, so W-8.5 resolves to item 94 alone. Of the two lessons left, the item's relative-shortfall ranking puts **14 marginally first**, and I re-derived it rather than inheriting it: **lesson 14 at 0.6695 against lesson 11 at 0.6759**, a gap of **0.0064** — the same gap the item records, at levels 0.0013 higher because I used the published rounded p90s. **The item's own rule for a gap this small is to pick on some other ground and say which**, so: **lesson 11, because it is four abridged pairs to lesson 14's three** (`es` 14 reads 0.83 and has never been abridged) **and because closing it keeps the abridged set identical in all four languages** — the property this item names as what makes the remainder one schedulable block. It also leaves the asymmetric lesson last rather than in the middle) — **`essentials` lesson 11, "Investment Fees", is now fully translated in all four languages.** es 0.81 → **1.13**, ko 0.38 → **0.51**, zh 0.25 → **0.33**, ja 0.34 → **0.45**. Abridged pairs **7 → 3**, abridged lessons **2 → 1**.

⭐ **A fifth defect shape, and the one the previous four instruments are weakest against: uniform within-paragraph clause compression.** Lessons 1, 2, 6, 8, 9 and 10 were whole-paragraph deletions; lesson 3 was numbers cut out of intact paragraphs; lesson 5 was a broken cross-section dependency; lesson 4 was an intact skeleton with its entire worked example removed. **Lesson 11 has perfect paragraph parity (2/3 in all five languages) *and* keeps every sentence's subject** — each translated paragraph is a recognizable, grammatical rendering of its English counterpart. What is gone is a subordinate clause in almost every sentence, and the clauses are not random: **they are the ones carrying the mechanism.**

The numeral profile — lesson 4's instrument — does see it, but only just, and the two numerals it names are the whole finding:

| numeral | English | es / ko / zh / ja, before |
|---|---|---|
| `1.00` (the second example expense ratio) | present | **absent in all four** |
| `6` (the *effective* annual growth rate after a 1.05% fee) | present | **absent in all four** |
| every other numeral (`0.05`, `0.03`, `0.20`, `0.5`, `1.5`, `10000`, `30`, `7`, `75000`, `1.05`, `57000`) | present | present |

**Those two absences are the lesson's two explanatory hinges.** Without `1.00%` the opening never shows what a *high* expense ratio looks like, so "expressed as a percentage" stays abstract. Without the effective rate dropping to **about 6%**, the worked example states that $75,000 becomes $57,000 but never says *why* — the one-percentage-point fee is named as a difference in fee and never converted into a difference in growth. **Every translation kept the outcome and dropped the mechanism**, which is the same failure as lesson 4 with a different surface: there, the demonstration was deleted and the conclusion kept; here, the causal clause was deleted and both endpoints kept.

**Control fired both ways.** Run against the pre-edit files, the numeral probe names exactly `1.00` and `6` as missing in all four languages; run against the post-edit files it names none; a `9999` probe is absent everywhere. Beyond numerals, the dropped clauses were read by hand and are listed in the commit — "for reasons that have nothing to do with quality", the parenthetical tying index funds back to "Stocks, Bonds & Diversification", "needs little human decision-making to run", "trying to beat the market", "so its cost compounds right alongside the investment's returns", "not because the fee was charged once, but because it was charged every year on money that would otherwise have kept compounding", and "or that every fee is unjustified — some strategies genuinely cost more to run".

⚠️ **The last of those is a §10.1 item, not a completeness item, and it is why this lesson was worth doing carefully.** English hedges twice: the cheapest fund is not always right, **and** some fees are justified because some strategies genuinely cost more to run. **All four translations kept the first hedge and dropped the second**, which leaves a lesson about fees reading closer to "cheaper is better" than the English does. The restored sentence moves it back.

**English was verified before being carried into four languages, not assumed.** $10,000 for 30 years at 7% gross: net **6.95%** → **$75,062.61** ("roughly $75,000"), net **5.95%** → **$56,627.69** ("around $57,000"), a gap of **$18,434.92 = 24.6%** of the larger ("roughly a quarter"). All three hold. **The control:** the same function on a 0.1-point gap (6.95% vs 6.85%) returns **2.8%**, nowhere near a quarter — so the arithmetic discriminates, and the "one percentage point" in the text is load-bearing rather than decorative. **No English prose was changed** — `git diff --name-only` returns **0 `.en.js` files**, and the essentials English total is **55,347 JSON characters before and after**, compared against `HEAD` rather than asserted.

**What changed, stated exactly.** **8 strings, 8 changed lines, 4 files** — the two section bodies only, in es/ko/zh/ja. **Headings, `takeaway` and `thinkAbout` were already full translations and are untouched in all four languages** (the `thinkAbout` already carried the "Stocks, Bonds & Diversification" cross-reference the body had dropped, which is how the convention for naming it in each language was measured rather than invented: es “Acciones, Bonos y Diversificación”, ko 「주식, 채권, 그리고 분산투자」, zh 《股票、债券与分散投资》, ja 『株式・債券・分散投資』). **Currency and range punctuation follow each file's own existing form** — es/ko `$N`, zh `N美元`, ja `Nドル`; ranges `0.03%-0.20%` in es/zh, `~` in ko, `〜` in ja — carried from the untouched neighbouring text, not chosen.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0** — 0 FAIL, **2 WARN**. Completeness WARN moved **7 of 176 / 2 lessons → 3 of 176 / 1 lesson**; the other WARN is O-3's 0%-human-review line, untouched |
| `npm run check-blindspot` | **exit 0** — including §10.1 advice-adjacency across all five languages and §2.3 live-looking dates over 26 teaching modules |
| Build | `scripts/build-out-of-tree.sh` → **✓ built in 576ms, exit 0**. ⚠️ Read from `$?` directly: the first attempt piped to `tail` and printed an empty `PIPESTATUS`, which in zsh is `pipestatus` — an empty exit code is not a passing one |
| Readback | All **8** strings compared **character-for-character** against intent after parsing the modules back: 8 exact, 0 mismatched. **Mutation control**: the same comparison on a string with `0.05%`→`0.06%` returns unequal |
| Numeral parity | Every English numeral present in all four languages, separator-aware (`10,000` / `10,000美元` / `$10,000` all normalize). Pre-edit the same instrument names `1.00` and `6` missing in all four |
| English leaks | **0** in ko/zh/ja; the single `es` hit is `ratio`, which is the file's own established term (`ratio de gastos`, in the **untouched heading** and present at `HEAD`), not a leak. **Positive control**: the matcher returns **83** hits on the English text |
| Markdown (W-8.6) | **0** tokens in all five languages; the matcher returns **2** on a planted `*emphasis*` / `**bold**` string |
| **Live render** | Served `dist/` statically, unlocked lessons 1-10 via `localStorage`, opened `#/lesson/11` in the real DOM in **all four languages**: **40 restored clauses, 10 per language, 0 missing, 0 cross-language leaks**. Probe controls fire — a nonsense string false, an untouched `takeaway` fragment and the heading both true |
| Mobile | **0 px horizontal overflow at 375×812 in all four languages**, with a planted 2000px element proving the check alive (**+1625 px** with it, **0** after removal) |
| Redo | Lesson 11 has **not** been closed before. Probe over all commit messages returns **0** for lessons 11 and 14 and **1** each for lessons 1, 5, 6, 7 and 10 — the positive control |

#### Three controls fired against me
1. ⭐ **Seeding `localStorage.ecycles_lang` does not switch the language, and this is now the second run to hit it — it is reproducible, not a fluke.** Storage read `"es"` and the page rendered English. The language must be changed through the picker (`select[aria-label="Language"]`, with a native value setter plus a bubbling `change` event), **and the switch must then be asserted** — this run checked for Spanish text in the body before reading any probe result. ⚠️ The selector itself works **only while the page is in English**, because the `aria-label` is translated; switching *away* from English is therefore the only direction it is reliable in, and switching between two non-English languages worked here only because `select` was the sole one on the page.
2. ⛔ **The first overflow measurement was meaningless and looked fine.** `window.innerWidth` read **0** in the un-sized pane, so the check reported overflow `true` — **and reported `true` with the 2000px probe too.** The control was indistinguishable from the result, which is the whole failure mode. Re-run after `resize_window` to 375×812 it reads a real viewport and a real 0.
3. **The redo probe's positive control failed first time.** `"essentials lesson 6 is now fully translated"` returns 0 because that commit's subject interrupts the phrase (`lesson 6 -- the worst-abridged lesson in the corpus -- is now`). Widened to a bounded gap, the control fires on all five known-closed lessons. ⚠️ **The AGENT_LOG half of that probe still returns 0 for known-closed lessons**, so it discriminates nothing and **only the commit-message half of this check carries evidence** — stated rather than quietly reported as two agreeing sources.

#### Bookkeeping, hand-patched rather than regenerated
`scripts/translation-completeness-baseline.json`: **exactly 4 changed lines**, all inside lesson 11's block (a `--write` regenerates all 44 lessons' ratios — see the standing note on item 94). `scripts/translation-review-ledger.json`: **exactly 4 records** re-dated to 2026-09-21; **`sourceHash` untouched on all four**, which is itself the proof English did not move. Human share remains **0%**.
`LAUNCH_READINESS.md` §10.4: **one generated line** refreshed via `npm run readiness -- --write` (English's 164,401 unchanged on both sides), plus **eight hand-written clauses** in the same row, each asserted to match exactly once before replacing.
⭐ **This is a per-lesson diff, not a threshold move, and the evidence is in the table rather than the claim:** the p90 reference is **byte-identical before and after (es 1.16, ko 0.58, zh 0.36, ja 0.51)**, and **lesson 14's row is unchanged to the digit (0.83 / 0.37 / 0.24 / 0.33)**. Only lesson 11's row moved.
⚠️ **§10.4's essentials-volume fraction: a fourth consecutive pass has failed to reproduce its predecessor's level.** Re-implemented from the row's own stated method, it reads **88.4%** for the state the previous pass published as **88.2%** — a 0.2pp gap, the same size as last pass's, against 1.1pp and 0.9pp before that. The **88.4 → 89.8** move recorded this run is lesson 11 alone, computed by one implementation on both sides. **Only the movement is safe to read; the level is not a series.**

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: nothing here instructs or recommends; the restored text **strengthens** the row rather than testing it — the second hedge ("nor that every fee is unjustified — some strategies genuinely cost more to run") was missing from all four languages and is now present, which moves the lesson *away* from an implied "always buy the cheapest". `check-blindspot` passes in all five languages. §2.3: the new prose carries a 30-year horizon and no dates, and the live-date scan agrees across 26 modules. §10.2 Dalio: nothing. §10.3: untouched. **No invented quantities** — every figure traces to English and was verified in both directions above.
- **DECISIONS.md.** No conflict: content stays in `.js` modules, `localStorage`-only state untouched, Vite unchanged, "(Beta)" labeling unchanged.
- **Already-done backlog item.** Not a redo, by the controlled probe above.
- **My own verification claim.** A reviewer re-running these commands gets these figures, with the caveats stated rather than buried: **`npm run build` does not work in-tree on this machine** (out-of-tree script used, as documented), and **the three control failures above are recorded because they changed what I did**, not as color.
- ⛔ **The limit, unchanged: this is machine translation no fluent speaker has read.** This run added four more pairs of it and re-marked the ledger `ai`. Human share is **0% in all four languages** — **O-3 is the owner's call and nothing here settles it.**

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- ⭐ **Item 94 is one lesson from done, and closing it expires W-8.5's clause.** **Lesson 14 ("Wills & Beneficiaries") is the last: 3 pairs, ko 0.37 / zh 0.24 / ja 0.33** — `es` is already at 0.83, above threshold, so **the next run edits three languages, not four**, and that asymmetry is the one thing that makes it unlike the eleven before it. Item 160's WARN is already clear; when lesson 14 lands, **item 94's completeness WARN clears too and the sentence-audit mode resumes as the default** per W-8.5's own expiry clause. ⚠️ The 0%-human-review WARN (O-3) will remain and is **not** item 94's — do not read a 2-WARN `npm test` after lesson 14 as item 94 still being open.
- **W-8.6's Markdown guard is still unfiled** and is still the cheapest open guard — this run measured 0 tokens across five languages with a live matcher, so the corpus is still clean and still unguarded.
- **W-8.1 still stands and no run can move it.** These corrections are committed, **not deployed**.

**Owner-facing, one line:** the lesson that teaches investors to check fund fees shipped to every non-English reader with the explanation removed — it showed $75,000 becoming $57,000 but never said the fee drops the growth rate from about 7% to about 6%, and it quietly dropped English's acknowledgement that some fees are worth paying; all of it is restored in four languages, and **item 94 is down to a single lesson.**

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** `npm test`'s MEASURED line, read **with this entry in the tree**: run log **213,577 b**, file **675,204 b**, floor **461,627 b**, 2 live days — **85.4%** of the run-log warn budget, **3.1 runs** of headroom, and no log-size WARN fired. ⚠️ **Quoted post-append on purpose:** the figure measured *before* a run writes its own entry is not the one a reviewer re-running `npm test` on this commit sees. The floor figure moved **+162 b** because this run edited the backlog's item 94 bullet; the rest is run-log growth.

### 2026-09-21 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read first, before anything else: item 160's is still clear, item 94's still stands at **11 pairs**, so W-8.5 resolves to item 94 alone. The previous run was also a W-8.5 pick rather than a free one, so W-6.2 rule 1 does not arise; its closing note named lesson 4 at 0.6603 against lesson 14 at 0.6682 and I re-derived that ranking from the instrument's own unrounded ratios rather than inheriting it — **same winner, same figures to four decimals**) — **`essentials` lesson 4, "Credit Scores", is now fully translated in all four languages.** es 0.75 → **1.04**, ko 0.37 → **0.49**, zh 0.25 → **0.32**, ja 0.34 → **0.44**. Abridged pairs **11 → 7**, abridged lessons **3 → 2**.

⭐ **This lesson's abridgement is a FOURTH defect shape, and it is the first one that paragraph parity cannot see at all.** Lessons 1, 2, 6, 8, 9 and 10 were whole-paragraph deletions; lesson 3 was numbers cut out of intact paragraphs; lesson 5 was a broken cross-section dependency. **Lesson 4's paragraph parity is perfect — 3/2/3 in all five languages, matching English exactly** — and the lesson was still missing its entire teaching device. English teaches credit scores through **two named people, Elena and David**, who carry §0 and §1 end to end. Measured before any edit:

| | §0 | §1 | §2 |
|---|---|---|---|
| paragraphs, **all five languages** | 3 | 2 | 3 |
| en body chars | 1,007 | 630 | 1,228 |
| "Elena" mentions, en | 3 | 3 | 0 |
| "Elena" mentions, **es / ko / zh / ja** | **0** | **0** | 0 |
| "David" mentions, en | 2 | 3 | 0 |
| "David" mentions, **es / ko / zh / ja** | **0** | **0** | 0 |
| numeral tokens, en | **8** | **5** | 3 |
| numeral tokens, **es / ko / zh / ja** | **2** | **0** | 3 / 3 / 2 / 4 |

**§1 carried zero of English's five numerals in every language.** The whole worked comparison — Elena and David each borrowing **$20,000** for a car, offered **6%** against **14%**, a gap of about **$4,700** in extra interest over **5 years** — existed in no language but English. What survived in all four was the abstract clause "a credit score can affect the interest rate on a car or mortgage loan": the conclusion, with the demonstration deleted.

⭐ **The reusable finding is which instrument sees this, because two of the three we already had would have passed it.** Paragraph parity passes (3/2/3 exactly). Per-section ratio flags §0 and §1 as short but says nothing about *what* is short. **The numeral profile per section is what names it in one line: en 8/5/3 against 2/0/3.** Filed under item 94. **The control fired both ways:** lesson 7 (closed the previous run, fully translated) reads **0/1/5 in all five languages**, so the instrument separates done from not-done rather than flagging every lesson; and a nonsense probe returns 0 everywhere.

⭐ **The naming convention was measured, not chosen — and that is worth keeping.** Before inventing transliterations I checked whether the corpus has any precedent for a personal name crossing languages. It does: **"Maria" appears 9 times in the English corpus and is carried consistently into every language — es María, ko 마리아, zh 玛丽亚, ja マリア, 10 occurrences each.** The probe carries its own negative control ("Sofia" returns 0 in all five). So Elena/David follow an existing corpus convention: es keeps both names as-is (both are ordinary Spanish names), ko 엘레나/데이비드, zh 埃琳娜/大卫, ja エレナ/デビッド. **Currency follows each file's own measured form** — es `$N` (61 uses, 0 of the suffix form), zh `N美元` (0/59), ja `Nドル` (0/62). ⚠️ **`ko` is the one genuinely mixed case (30 `$N` against 33 `N달러`), so it was broken by within-lesson consistency: lesson 4's own untouched §2 writes `$200-$500`, so the new text writes `$`.** Recorded as a tiebreak rather than a measurement, so a reviewer knows which is which.

**What changed, stated exactly.** **8 strings, 8 changed lines, 4 files** — §0 and §1 bodies only. **§2 was not touched in any language** (it was already a full translation: es 1,200 chars against English's 1,228), nor were the three headings, `takeaway` or `thinkAbout`. **§0's third paragraph — the "Productivity Growth" cross-reference — is byte-identical before and after in all four languages**, asserted field-by-field by the edit script itself rather than checked afterwards. After: **Elena reads 3/3/0 and David 2/3/0 in all five languages, and numerals read 8/5 in §0/§1 in all five** — English's profile exactly.

**A dangling-reference check was run and came back clean, which is worth recording as a negative.** §2's closing paragraph points back with "the two factors from the first section — paying on time and keeping utilization low". Unlike lesson 5, that reference already resolved in all four languages: the abridged §0 ¶1 had kept both factor *names* even though it dropped the people illustrating them. So this lesson owed the worked example, not a broken back-reference.

**English was verified before being carried into four languages, not assumed.** The lesson's headline arithmetic is checkable and I checked it: a $20,000 loan over 60 months at 6% costs **$3,199.36** in interest and at 14% costs **$7,921.90**, a gap of **$4,722.54** — "about $4,700" is right. The control: the same function on a 6%→7% gap returns **$562.08**, nowhere near, so the calculation discriminates. **No English prose was changed** — `git diff --name-only` returns **0 `.en.js` files**, and the essentials English character total is **53,575 before and after**.

**Verified.** `npm test` **exit 0** — read from the command itself, not through a pipe — **0 FAIL, 2 WARN**; completeness now reads **7 of 176 / 2 lessons**. `npm run check-blindspot` exit 0. Out-of-tree build exit 0. All **8** rewritten strings read back **character-for-character against intent**, with a mutation control proving the comparison can fail (a one-character tamper does not match). English-leak check: **0 leaks in all four languages**, against a positive control showing each of the 7 probes **is** present in the English source, so the probes are alive. Markdown guard (W-8.6's class, checked because I was writing new content strings): **0 for `**bold**`, 0 for any asterisk, 0 for `_em_`**, with all three matchers shown to fire on a planted string.

**Live DOM off the built `dist/`, served statically.** The **404 control was built in before any render result was read**: SPA fallback for extensionless paths only, so a bogus asset returns **404**, a real hashed asset **200**, `/` **200**, `/learn` **200**. **All 40 restored clauses render — 10 per language, 0 missing** — with **0 cross-language leaks** (es and zh probes both score 0 on the ja page while ja scores 10). At **375 px**, `scrollWidth == clientWidth == 375` and **0** overflowing elements in es (the longest) and ja, with a planted 2000 px probe raising that to 15 — the overflow check is alive.

⚠️ **Two controls fired against me this run and both changed what I did — recording them because a run that reports only clean controls is not reporting honestly.** (1) **The language switch silently did not happen.** Seeding `ecycles_lang` in `localStorage` and reloading left the page in **English** while storage read `"es"`; the check caught it because its gate requires the English clause to be *gone* and the character count to *differ*, not merely that probes were sought. Driving the real `<select>` fixed it. ⚠️ **And the selector `select[aria-label="Language"]` works only in English** — the label is itself translated, so it returned `null` on the Spanish page and the setter threw. Select the picker by its option values. (2) **The redo check's positive control returned 0**, which would have made "lesson 4 is not a redo" meaningless. The probe was missing the backticks the log actually writes (`` `essentials` lesson N ``); with the shape fixed, lessons 5, 6 and 7 each return 1 and **lesson 4 returns 0 in both the live log and the archive** — not a redo.

**Two recorded figures moved with the content and were patched by hand, not regenerated.** `scripts/translation-completeness-baseline.json` — the prescribed `--write` rewrites **every** ratio in the file, so only lesson 4's four values were edited: asserted **exactly 4 changed lines, all inside lesson 4's block, and exactly one lesson's ratios moved**. The review ledger was moved with its own `mark` command and asserted to have changed **exactly 4 records, all lesson 4** — `reviewedBy`/`reviewedDate` only, **`sourceHash` untouched on all four**, which is itself the proof that English did not move.

**`LAUNCH_READINESS.md` §10.4: the generated sentence refreshed via `npm run readiness -- --write` (exactly one line changed), and six hand-written clauses in the same row updated as that row's own rule demands** — the 11/3 counts → 7/2, the per-lesson enumeration (lesson 4 appended), "thirty-six pairs" → forty, the remaining-lesson list (4, 11, 14 → 11, 14), the track-volume fraction, and the non-reproducibility note.

⚠️ **The §10.4 level failed to reproduce for a third consecutive pass, and the gap is now small enough to say something new about it.** That row states its own method (summed translated characters over lessons 1-15 ÷ (summed English characters × that language's p90)). Re-implemented this run, it reads **86.9%** for the state the previous pass published as **87.1%** — a 0.2pp gap, against 1.1pp last pass and 0.9pp the one before. **The gap is shrinking as the corpus fills, which is consistent with the remaining disagreement being in how partially-abridged lessons are counted rather than in the method.** The row records **86.9% → 88.2%** as this run's own measurement by one implementation on both sides. ⚠️ **My first implementation of it returned `NaN` for every language** and would have printed a confident wrong answer: `translatedChars` expects the *merged* per-language shape, not the per-file one. The fix carries a control — my merge reproduces the live instrument's character counts **exactly** on lessons 1, 4 and 15. The p90 reference is **byte-identical before and after** (es 1.1647922882717465, ko 0.5765462339252909, zh 0.36017897091722595, ja 0.5146968769136558), and the abridged list went 4, 11, 14 → 11, 14: **exactly lesson 4's four pairs left, nothing else reclassified** — a per-lesson diff, not a threshold move.

**Step 5, adversarial self-check — run, and beyond the two control failures above it found no conflict.** Blindspot register, checked against the 20 new/changed strings directly and not only via the suite: **0** Dalio/Bridgewater mentions in any script; **0** advice-pattern hits against a matcher shown to fire 9 times on a planted string; **0** date-shaped tokens against a matcher shown to fire on `2026-09-21`, `March 2026` and `2026年9月`; **0** child-facing framing. `check-blindspot` is green across all five languages. `DECISIONS.md`: `localStorage`-only state, `.js`-not-JSON content and Vite are untouched — the only decision this touches is the 2026-08-11 "(Beta)" acceptance, which is O-3 and stated below. **Not a redo** (the corrected probe above). And the verification claim here is re-runnable as written: the two figures a reviewer would check first — `npm test` exit 0 and 7 pairs — come from the commands, not from this entry. `HEAD` was re-read at the end and had not moved (`0befa11`); `Migration/` and `UIUX/` are the owner's untracked directories and were not touched.

**The standing limit is unchanged and is the honest caveat on this entry: this is machine translation that no fluent speaker of Spanish, Korean, Chinese or Japanese has read.** Human review share is **0% in all four**. **O-3 — whether this volume of unreviewed translation should keep shipping — remains the owner's call, not a run's.**

⛔ **W-8.1 still applies and this run cannot move it: nothing committed here reaches a learner until someone pushes `main`.**

**Next: lessons 14 and 11 are the last two, at 0.6682 and 0.6746** — a 0.0064 gap, smaller than the 0.0079 this run's pick rested on, so **pick on some other ground and say which**: 11 is four pairs to 14's three, and 14 has the larger English body (3,239 chars against 3,044). ⚠️ **Run the numeral profile per section alongside paragraph parity on both** — lesson 4's parity was perfect and its arithmetic was still entirely absent. **When these two close, item 94's `npm test` WARN clears, and with item 160's already clear, W-8.5 expires and the sentence-audit mode resumes as the default.** W-8.6's Markdown guard remains the cheapest unfiled guard on the list.

### 2026-09-21 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read first, before anything else: item 160's is clear, item 94's still stands, so W-8.5 resolves to item 94 alone. Item 94's own progress bullet declared lessons **7 and 4 tied at 0.6551 / 0.6603** and required the run to name the other ground it chose on; **the ground is stated below and it is not the ratio**) — **`essentials` lesson 7, "Taxes: How Your Paycheck Is Really Taxed", is now fully translated in all four languages.** es 0.79 → **1.08**, ko 0.37 → **0.51**, zh 0.24 → **0.34**, ja 0.32 → **0.45**. Abridged pairs **15 → 11**, abridged lessons **4 → 3**.

**The ground for picking 7 over 4, since the ratio could not decide it.** Two reasons, both measured before any edit: lesson 7 has the **largest English body of the four remaining** (4,526 chars against 3,134 / 3,044 / 3,239), so it is the most absent prose per run; and it carried the lesson-5 defect shape — **a fully-translated section resting on a term the abridged section before it had deleted**.

**Step 3.5 corrected the item's premise in one respect, and the correction is what shaped the edit.** The WARN counts *pairs*, so "lesson 7 is abridged in all four" reads as a whole-lesson gap. It is not. Measured per section against a control:

| | §0 | §1 | §2 |
|---|---|---|---|
| en body chars | 1,299 | 1,047 | 1,331 |
| es / ko / zh / ja, as a ratio of en, **before** | 0.55 / 0.26 / 0.16 / 0.22 | 0.50 / 0.22 / 0.16 / 0.20 | **1.14 / 0.54 / 0.34 / 0.48** |
| lesson 6 (closed 2026-09-20) as the control | 1.16 / 0.54 / 0.35 / 0.45 | 1.14 / 0.49 / 0.33 / 0.43 | — |

§2 sat **on** the control in every language: it was already a full translation and **nothing in it was touched**. Only §0 and §1 were rewritten — **8 strings, 8 changed lines, 4 files**. The `takeaway`, the `thinkAbout`, all three headings and the whole of §2 are **byte-identical before and after in all four languages** (compared field by field against `HEAD`, 15 lessons per file: changed fields = `7.s0.body`, `7.s1.body`, and nothing else).

⭐ **The reusable finding: the lesson-5 counter works on a *term*, not just a concrete noun — and it found a break in a section that was already done.** English introduces withholding in §1 (**4 mentions**) and then uses it throughout §2 (**4 mentions**). Before this run the translations read **§1: es 0, ko 1, zh 1, ja 1** against **§2: es 5, ko 4, zh 4, ja 4**. So a Spanish reader met *"La retención de cada cheque de pago…"* — a definite noun phrase — for a mechanism the lesson had never once named in Spanish. The deleted sentence is exactly the one that introduces it: *"All of it is usually withheld automatically by the employer before the money ever reaches the worker, which is why most people never have to hand over a lump sum at tax time."* **After: ko/zh/ja read 4/4 like English; es reads 2/5** (Spanish carries it with `se retienen` / `retener` / `se siguen reteniendo`, and the matcher's stem list under-counts the finite forms — a limit of the instrument, not of the text). **Controls fired both ways:** lesson 6 returns **0** in every language and every section (no withholding in it), and a nonsense probe returns 0 everywhere.

**What else was missing, stated as clauses rather than as a paragraph count** — 11 per language, 44 in all, each **present after and absent at `HEAD`** (that "absent before" column is the control; a clause present in both would prove nothing): §0's bucket mechanism (*first bucket… once full… only that slice*), the whole worked raise (*only the new, additional slice gets the higher rate; every dollar in the lower buckets is taxed exactly as before*), and the marginal-dollar refutation (*never that already-earned income gets taxed retroactively*); §1's definitions of gross and net, the employer-withholding sentence above, and the Traditional-IRA sentence (*handled on the tax return, not on the pay stub*). The benefits-cliff sentence and the 401(k) sentence already existed and were carried through. One wording change beyond restoration: the four translations said a Traditional 401(k) contribution *"lowers taxable income"*; English says it **lowers the federal income tax taken from that pay stub**, and they now say that. Both statements are true and both appear in the English lesson — the `thinkAbout`, untouched, still says *lowers taxable income*.

**Verified.** `npm test` **exit 0** — read from the command itself, not through a pipe — **0 FAIL, 2 WARN**, completeness now **11 of 176 / 3 lessons**, not 15 / 4. `npm run check-blindspot` exit 0. Out-of-tree build exit 0. All 8 rewritten strings read back **character-for-character against intent**, with a mutation control on the matcher (the exact literal occurs once; a one-character tamper occurs zero times) and a leak control carrying its own positive control (0 English sentences in any translation; each probe **is** found in the English file, so the probe is alive). **Live DOM off the built `dist/`, served statically** (404 control: a missing asset returns 404, so the SPA fallback is not masking anything): **44 of 44 restored clauses render, 11 per language, 0 English leaks**, cross-language control 0 both ways (es probes score 0 on the ja page, the ja probe 0 on the es page), four distinct page titles. At **375 px**: `scrollWidth == clientWidth`, **0** overflowing elements, and a planted 2000 px probe raises that to 5 — the overflow check is alive.

**Two recorded figures moved with the content and were patched by hand, not regenerated.** `scripts/translation-completeness-baseline.json` §33 fails on a rise as well as a fall; the prescribed `--write` rewrites **every** ratio in the file, so only lesson 7's four values were edited (4 lines, occurrence asserted at exactly 1). `LAUNCH_READINESS.md` §10.4's generated sentence was refreshed with `npm run readiness -- --write` (1 line), and three prose facts in the same row — the abridged count, the closed-lesson chain, the remaining-lesson list — were corrected in place.

⚠️ **One §10.4 figure was corrected rather than advanced, and this is the finding, not the number.** That row states its own method (*summed translated characters over lessons 1-15 ÷ (summed English characters × that language's p90)*) and then a level, **83.9%**. Re-implemented from that sentence this run, the method reads **85.0%** for the state the previous pass published as 83.9% — the same order of gap that pass itself found (79.6 / 80.1 / 80.3% against a published 80.5%). **So the level is not a series and two passes have now failed to reproduce it.** The row now says so and records **85.0% → 87.1%** as this run's own measurement by one implementation on both sides. The p90 reference is **byte-identical before and after** (es 1.1647922882717465, ko 0.5765462339252909, zh 0.36017897091722595, ja 0.5146968769136558) and the abridged list went 4, **7**, 11, 14 → 4, 11, 14: exactly lesson 7's four pairs left, **nothing else reclassified** — a per-lesson diff, not a threshold move.

**Step 5, adversarial self-check — run, and it found nothing.** Blindspot register: no Dalio name or quote, no advice-adjacent or timing language (the lesson is descriptive tax mechanics; `check-blindspot` scans all five languages and is green), no hardcoded date, no live-looking market figure, no child-facing framing. `DECISIONS.md`: `localStorage`-only state, `.js`-not-JSON content and Vite are all untouched; the one decision this **does** touch is the 2026-08-11 "(Beta)" acceptance, which is O-3 and stated below. Completed-and-pruned: lesson 7 was on the live abridged list at `HEAD`, so this is not a redo. And the verification claim above is re-runnable as written — the two counts a reviewer would check first (`npm test` exit 0 / 11 pairs) come from the commands, not from this entry.

**O-3, unchanged and stated plainly: this is machine translation that no fluent speaker of Spanish, Korean, Chinese or Japanese has read.** Human review share is **0% in all four**. The corpus grew again today; whether to keep growing it under "(Beta)" is the owner's call.

⛔ **W-8.1 still applies and this run cannot move it: nothing committed here reaches a learner until someone pushes `main`.**

### 2026-09-21 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read before anything else: item 160's is still clear, item 94's still stands at **19 pairs**, so W-8.5 resolves to item 94 alone. The previous run was also a W-8.5 pick rather than a free one, so W-6.2 rule 1 does not arise; its closing note named lesson 5 at 0.6341 and I re-derived that ranking from the instrument's own unrounded ratios rather than inheriting it — **same winner, same figure to four decimals this time**) — **`essentials` lesson 5, "Stocks, Bonds & Diversification", is now fully translated in all four languages.** es 0.80 → **1.09**, ko 0.36 → **0.50**, zh 0.23 → **0.32**, ja 0.31 → **0.43**. Abridged pairs **19 → 15**, abridged lessons **5 → 4**.

**The abridgement had cut the worked example out of two sections and left the third one pointing at it.** Lesson 5's English threads one scene through the whole lesson: a favorite local coffee shop that expands into a national chain, sells ownership slices (a stock), borrows directly (a bond), gets a competitor next door, and finally has a product flop. §2 — which the 2026-09-20 correlation run rewrote and which is therefore fully translated — refers back to it with a **demonstrative**: es *"la cadena de café"*, zh *"那家咖啡连锁店"*, ja *"あのコーヒーチェーン"*, ko *"커피 체인"*. **§0 and §1, where English introduces the coffee shop, had replaced the whole scene with an abstract definition in all four languages.** A reader in any of the four met a definite reference to a thing the lesson had never shown them.

Measured before any edit, with controls both ways:

| check | before | after |
|---|---|---|
| paragraph parity vs English (3/3/4) | **2/2/4 in all four** — §0 and §1 each lost a paragraph | 3/3/4 in all four |
| `coffee` mentions per section vs English's **2/3/2** | **0/0/1 in all four** — the thread exists only where §2 points back at it | **2/3/2 in all four** |
| §0 ¶3 (*"neither is inherently better… which is why people combine them"*) | absent in all four | present in all four |
| §1 ¶3 (the index-fund sentence — *how* an ordinary person diversifies) | absent in all four | present in all four |
| §2 ¶1's causal clause (*"because a hit to any one holding shrinks into a smaller share of a much bigger whole"*) | absent in all four | present in all four |
| §2 ¶2's enumeration (*"a thousand coffee chains, retailers and tech firms… don't cancel each other out"*) | absent in all four | present in all four |

⭐ **The reusable finding is the instrument, not the lesson: count the lesson's own recurring concrete noun per section, per language, and compare the profile to English's.** Paragraph parity tells you a paragraph is missing. It does not tell you that what is missing was load-bearing for a section that *is* present. The **2/3/2 → 0/0/1** profile does, in one number, and it is what turned "these two sections are short" into "the third section is broken." Filed under item 94 as a third defect shape, alongside **whole-paragraph deletion** (lessons 1, 2, 6, 8, 9, 10) and **numbers cut out of intact paragraphs** (lesson 3). The control fired both ways: the same counter returns **0/0/0** on lessons 3 and 8 in every language (they have no coffee), and a nonsense probe returns 0 on lesson 5.

**A second dangling back-reference, found by reading §2 rather than by the counter.** §2 opens its third paragraph with *"This is exactly why the previous section pointed at holding both stocks and bonds, not just many different stocks."* In English the sentence being pointed at is §0 ¶3. **That paragraph existed in English only**, so in es/ko/zh/ja the back-reference pointed at nothing. Restoring §0 ¶3 closes it; no §2 text was needed for this one.

**§2 was measured separately rather than assumed done, per lesson 8's standing warning — and it was two-thirds done, not done.** Its fourth paragraph (the 2008/2022 correlation evidence, written 2026-09-20) sits at rel **0.89–1.02**, fully translated. Its first three sat at **0.55–0.81** against a lesson-8 control of **0.73–1.04**. The two clauses restored above are what that gap was. **§2's paragraph 4 is byte-identical before and after, in all four languages**, as are all three headings, `takeaway` and `thinkAbout`.

**Which paragraphs survived, stated exactly, because "restored" is vaguer than the diff.** In §1, **1 of 2** pre-existing paragraphs is carried through verbatim (the rule sentence, now preceded by the scene). In §0, **0 of 2** are — ¶1 had to become the coffee-shop scene and ¶2 gained both the *"instead of buying a slice of the coffee chain"* contrast and the IOU simile. This was additive in meaning and not in bytes, and saying so the other way round would be false.

**The ranking was re-derived from the instrument's unrounded ratios, and it agreed with the inherited figure exactly this time** — lesson 5 at **0.6341**, lesson 7 at **0.6551**, same to four decimals. **The ranking carries its own control**: the four remaining abridged lessons score 0.655–0.675 against already-translated lessons at 0.80–1.02, so it separates done from not-done rather than sorting noise. The p90 reference is **byte-identical before and after** (es 1.1647922882717465, ko 0.5765462339252909, zh 0.36017897091722595, ja 0.5146968769136558), and the abridged list went 4, **5**, 7, 11, 14 → 4, 7, 11, 14: exactly lesson 5's four pairs left, **no other pair was reclassified** — a per-lesson diff, not a threshold move.

**English was recomputed before being carried into four more languages.** No English prose was touched: `englishSourceHash` for lesson 5 is `320360fc6d476eaa` before and after and still matches the ledger, the hash function was shown to discriminate (lessons 8 and 9 hash differently), and `git diff --name-only` returns **0 `.en.js` files**.

**Conventions were measured per file rather than chosen.** The chain term follows each file's own §2: es `cadena de café`, ko `커피 체인`, zh `咖啡连锁店`, ja `コーヒーチェーン` (1 pre-existing use each — the counter above is how I know). "Fund" follows the dominant existing form: es `fondo` (42 uses), ko `펀드` (19), zh `基金` (43), ja `ファンド` (19); "downturn" follows es `recesión` (32), ko `경기 침체` (2), zh `衰退` (44), ja `景気後退` (37). ⚠️ **"IOU" and "coffee shop" have no precedent in any of the four files (0 uses, with the probe shown to return non-zero on terms that do exist)**, so those two are chosen rather than measured — es `pagaré`, ko `차용증`, zh `借据`, ja `借用書`; es `cafetería`, ko `커피숍`, zh `咖啡店`, ja `コーヒー店`. Recorded as chosen so a reviewer knows which is which.

**Verified:** `npm test` exit **0** read from the command and not through a pipe, 0 FAIL, 2 WARN; completeness now reads **15 not 19**. All **16** rewritten strings read back character-for-character against intent, with a mutation control proving the comparison can fail and a cross-language leak control that carries its own positive control (self-detection 8/8, leaks 0). `npm run check-blindspot` green. Build via `build-out-of-tree.sh` ok. **Live DOM render in all four languages** off the built `dist/`: all **36** restored clauses (9 per language) assert present, 0 missing, 0 cross-language leaks, absence-matcher control clean, and no horizontal overflow at 375px.

**The live check's language-switch control is the one from lesson 8's entry and it is why the result can be trusted:** the picker is a `<select>`, so the switch sets `value` through the native setter and dispatches `change`, and each row must show **a character count that differs from English's AND the English clause gone** before its assertions count. All four report `switched: true` with counts 5638/2694/1730/2318 against English's 5191 — four distinct pages, not the English one measured four times.

**The static-server 404 control was built in before any render result was read**, per the standing note: SPA fallback for extensionless paths only, so a bogus asset path returns **404**, a real hashed asset **200**, `/` **200** and `/learn` **200**. ⚠️ **A second gate had to be opened by hand and is worth recording:** `#/lesson/5` alone lands on `#/learn`, because a URL does not unlock a lesson (`DECISIONS.md`) and lesson 5 gates on 1-4. The check seeds `ecycles_completed_lessons` in `localStorage` first. **A run that renders a deep-linked lesson without doing that is measuring the Learn screen.**

**`--write` was not used on the baseline, per the standing note that it re-records every ratio for a one-lesson edit.** The baseline was hand-patched to lesson 5's four values and asserted to have moved **exactly 4 of 176, all `5.*`**. The review ledger was moved with its own `mark` command and asserted to have changed **exactly 4 records, all lesson 5** — dates only, `sourceHash` untouched, which is itself the proof that English did not move.

**`LAUNCH_READINESS.md` §10.4: the generated sentence refreshed via `npm run readiness -- --write` (it changed exactly one line), and five hand-written clauses in the same row updated as that row's own rule demands** — the 19/5 counts, the per-lesson enumeration, "twenty-eight pairs" → thirty-two, the remaining-lessons list, and the track-volume fraction (**82.0% → 83.9%**; es 87.5, ko 83.1, zh 84.1, ja 81.0), computed by the method the row now carries in writing. Both sides of that movement are this one method, which is what the previous entry could not say about 80.5 → 82.0.

**Adversarial self-check found no conflict.** No Dalio in the 16 new strings (0); no advice-adjacent language (`check-blindspot` green across all five languages — and note the restored §0 ¶3 says *neither* asset is inherently better, which moves toward §10.1 rather than away from it); no dates or live-looking market figures (0 date-shaped tokens, 0 bare month-years); kids framing untouched; **no Markdown syntax in any of the 16 new strings — 0 for `**bold**`, 0 for any asterisk at all, 0 for `_em_`, with all three matchers shown to fire on a planted string** (W-8.6's class, checked because I was writing new content strings); no `DECISIONS.md` conflict (content stays `.js`, no state, routing or build changes). **Not a redo:** "lesson 5" appears as translated work in neither `AGENT_LOG.md` nor the archive (0 matches for three phrasings in both, against a control phrasing that finds lesson 8's entry). The archive's single `essentials` lesson 5 hit is item 84's dead-cross-reference audit — a different defect on the same lesson, already fixed, and the named-title references it installed are carried through unchanged here. `HEAD` was re-read at the end and had not moved (`35b1b67`); `Migration/` and `UIUX/` are the owner's untracked directories and were not touched.

**The standing limit is unchanged and is the honest caveat on this entry: this is machine translation that no fluent speaker of any of the four languages has read.** Human review share is **0% in all four**, and **O-3 — whether this volume of unreviewed translation should keep shipping — remains the owner's call, not a run's.**

**Next: lesson 7 at 0.6551 and lesson 4 at 0.6603 are effectively tied** — a 0.005 gap, which is deterministic but is a quarter of the smallest gap any previous pick rested on and a sixth of this instrument's own 0.03 drift tolerance. **Pick on some other ground and say which**; one available ground is that lesson 7 is the longer English body (4,526 chars against 3,134), so it is the larger learner-visible gap. ⚠️ **Whichever is picked, run the recurring-noun profile as well as paragraph parity** — lesson 5's parity check flagged the two sections that were short and said nothing about the third, which was the one that had been broken.

⚠️ **W-8.1 is unchanged by this run and is worth restating in one line, because it is the fact that governs everything above:** this correction, like the 30 before it, **is not on the site**. A run is forbidden to push. Deploying is O-5's route 1 or route 2 and it is the owner's.
