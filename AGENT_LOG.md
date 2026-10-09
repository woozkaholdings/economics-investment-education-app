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
    answer key vs translated option order. `kidsContent.js`'s "$2+ trillion" was kept on purpose.

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
        standing WARN cleared. **The remainder is still not all class B: `q037` (37%, L23), `q040` (16%),
        `q034` (11%) and `q027` (6%) are class A and beatable in all five.** `q034` is next by margin.
        (`q023` done 2026-10-02, `q037`, `q040` and `q034` done 2026-10-03; landings in those days' run logs.
        `q027` done 2026-10-04: its "6%" was the **en minimum**; ko/zh/ja were **100/61/53%**, so the
        min-margin ranking hid the loudest CJK tell left. **Class A is now empty except `q021`
        (unreachable).** Rank per language, not by the minimum.)
        **Do not re-read this item as blocked without re-ranking — rank the whole set, not the top of it.**
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

144. **✅ Closed 2026-09-29; archived verbatim 2026-09-29** to `AGENT_LOG.archive.md`, "Archived backlog (closed items)". Premise was wrong: §59's own header was a live mention-only exemption. A marker now counts only when not in backticks (`declaresAllow`), guarded by §59 CONTROL D.

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

### 2026-10-09 (scheduled dev-agent; **a free pick**. The previous run said ⛔ *"the next run may NOT take a residual of this one"*, so I took none: its two notes (L40's thinkAbout, L33/L34's rate statements) are both left. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is a §10.2 fix carried into four languages. `npm test` showed **exit 0, 0 FAIL, 1 WARN** (O-3's) before any edit. **The pick came from a scan no run had made:** a Node scan of every English content file for population claims (`most people|studies show|research finds|…`), which returned 15 hits. One of them, L40's closer *"Most people — including most policy makers — don't pay nearly enough attention to it"*, read like a line from the source video, so I measured that) — **lesson 40 no longer ends its Three Rules section with a near-verbatim, unattributed line from the closing of the video its economy lessons were adapted from. §10.2 rules that out (*"no direct quotes, anywhere in the app"*), and the line was also an unmeasured claim about what "most policy makers" do. The paragraph now says the three rules apply to a household, a business and a government alike, and that they are rules of thumb, not laws: as Rule 1 showed, a rule can be broken for years before the cost arrives.**

**Step 3.5: the premise, measured against the transcript, with controls both ways. It holds.** I fetched a published transcript (singjupost.com; 4,585 words once the `<p>` text is extracted, including site chrome; its first line is the video's own title). Its close reads: *"This is simple advice for you and it's simple advice for policy makers. You might be surprised but most people — including most policy makers — don't pay enough attention to this."* The app shipped *"This is simple advice for you AND for policy makers alike. Most people — including most policy makers — don't pay nearly enough attention to it."* That is the same two sentences with three words changed. I then built an instrument (`overlap.mjs`, scratchpad): normalized 6-word shingles of the transcript against every line of the 10 English content files. **Positive control:** L40's closer fires (*"is simple advice for you and"*, *"most people including most policy makers don't pay"*). **Negative control:** the same transcript with its words shuffled returns **0** hits across all 10 files. One limitation: I checked only one transcript. The WebFetch read and the curl download are the same page, so they do not confirm each other.

#### What shipped
- `lessonContent.economy.<lang>.js` L40, last paragraph of "The Three Rules", en/es/ko/zh/ja (5 strings). en: *"The same three rules apply to a household, a business and a government. They are rules of thumb, not laws: as Rule 1 showed, a rule can be broken for years before the cost arrives."* Each file keeps its own terms: es *Regla 1* and *reglas generales* (the file's existing word for "rule of thumb"), ko 법칙 1/경험칙, zh 法则1/经验法则, ja ルール1/経験則.
- Knock-ons, each found by the check that failed on it: ledger L40 es/ko/zh/ja re-marked `ai` after reading each sentence against the English (`npm test`'s §10.4 FAIL named them). `npm run readiness -- --write`: en 166,389 → **166,425** chars, still **177 min**. `lessons.js` minutes are unchanged; no check asked for a change. `translation-completeness --write` was **not** run (memory note).
- Patcher (node, UTF-8, `split/join`): old ×1 / new ×0 asserted per file before writing. A second dry run after applying refuses (exit 1). The originals are in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). The first run after the edit failed only on the §10.4 ledger figure. §65 en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6, unchanged (no option touched) |
| `check-blindspot` sees the file | planted *"You should buy index funds now."* before the new L40 sentence → **exit 1** (§10.1 FAIL); restored from the scratchpad copy, `cmp`-equal → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` built, `index-CrY3sWpa.js`, system Node v24.18.0 |
| Bundle | the new sentence is in **1** asset per language and the old sentences are in **0**, all 5 languages. Control: the unchanged "Run that pattern across many" is in 1. Nonsense probe: 0 |
| Overlap re-run | L40 no longer fires. The other 9 economy-lesson hits are unchanged, so the instrument still reads the file |

#### Step 5: adversarial self-check
- **Is the new sentence true?** "A rule can be broken for years" is exactly what Rule 1's text, as fixed on 10-08, now shows: US households 1980-2007, and Japan's government 1990-2023. "Household, business and government" keeps the old line's scope (the reader and policymakers) and adds the business that Rule 2's factory already uses. The new sentence has no shingle overlap with the transcript.
- **Did I just shorten a lesson?** The paragraph made no teaching point. It was an exhortation plus a claim about people that nobody had measured. The new one carries Rule 1's lesson forward instead.
- **§10.1:** I added no instruction to buy, sell or borrow; the planted control proves the guard reads this file. **§10.2:** nothing names or credits anyone: `/dalio/i` returns 0 in the added lines, and `check-blindspot` is green. **§2.3:** I added no dates or figures. **Completed work:** the 10-08 L40 Rule 1 / q008 fix is untouched. **DECISIONS.md:** it says nothing on lesson wording. **Would a reviewer get my result?** Yes, by re-running the transcript fetch, the overlap scan with both controls, the patch assertions, `npm test`, the planted control, the build and the bundle probes. No conflict found.

**Seen, not fixed, and measured (the scan's other hits; ⛔ do not "fix" these as one sweep):** with the same instrument, **13 more lines share 6+ consecutive words with the transcript**. Economy L29 (10 w, the definition of a transaction), L30, L31 (**14 w**: *"…matters most in the long run but credit matters most in the short run"*), L32 ×2, L33 ×2, L34; quizText q-lines 31/38 (8 w and 10 w: *"credit is the most important part of the economy"*), 58 (12 w), 96 (7 w: Rule 1's option wording) and 108; essentials L9 (6 w, a phrase). Most of these are a definition or a standard term, not a lifted aside. Whether close wording of a *concept* counts as a "direct quote" under §10.2 is the same scope question backlog item 158 already puts to the owner about the Buffett line, so a run should not settle it. One of them is also a content question, and that one is arguable but reachable: the quiz item *"What is the most important part of the economy?"* keys **credit** as the answer, which is the source's opinion taught as fact. **Not picked by default.** L40's thinkAbout *"more than most people"* stands. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked, and `public/data/market.json` is modified by the market job; none of these are mine and I touched none of them. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 40's last paragraph was the source video's closing two sentences with three words changed, which §10.2 rules out, so it now makes its own point in all five languages. A transcript scan finds 13 shorter overlaps, mostly definitions. Whether those count is your call (it is the same question as item 158's Buffett line). Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-08 (scheduled dev-agent; **the previous run's named residual, L32 §3's "lenders and central banks tend to keep rates a little lower on average, cycle after cycle"**, named in the two previous entries' "Seen, not fixed" as *"a causal claim that 2022's hikes complicate. Not measured"*. The previous run was itself a residual pick, so this is the second in a row. W-6.2 rule 1 allows that, and ⛔ **the next run may NOT take a residual of this one.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. `npm test` showed **exit 0, 0 FAIL, 1 WARN** (O-3's) before any edit) — **lesson 32 §3 no longer says, as a timeless rule, that lenders and central banks keep rates a little lower "cycle after cycle, just to keep debt serviceable". It now says more debt makes each rate rise hurt more, gives the dated US run of falling cycle highs (about 19% in 1981 to under 2.5% in 2018-19), says falling inflation explains part of that but not all, and says it isn't a law: the highs rose every cycle from the 1950s to 1981, and in 2023 the Fed went back above 5%.**

**Step 3.5: the premise, measured with FRED's keyless CSV. It holds, in a sharper form than the residual said.** Controls: `NOSUCHSERIESXYZ` → **404**, `FEDFUNDS`/`USREC`/`CPIAUCSL` → 200; the `USREC`-derived post-war peaks and troughs match NBER's dates (the same instrument as the two previous entries); `FEDFUNDS` 1981-06 **19.10** and 2023-08 **5.33** match the published monthly figures; CPI 1980-03 YoY **14.59%** SA (BLS NSA 14.8). Highest monthly effective fed funds rate in each trough-to-trough cycle:
| cycle | high | | cycle | high |
|---|---|---|---|---|
| 1954-58 | 3.50 (1957-10) | | 1982-91 | 11.64 (1984-08) |
| 1958-61 | 4.00 (1959-11) | | 1991-2001 | 6.54 (2000-07) |
| 1961-70 | 9.19 (1969-08) | | 2001-09 | 5.26 (2007-02) |
| 1970-75 | 12.92 (1974-07) | | 2009-20 | 2.42 (2019-04) |
| 1975-80 | 17.61 (1980-04) | | 2020- | **5.33 (2023-08)** |
| 1980-82 | 19.10 (1981-06) | | | |
So "a little lower, cycle after cycle" held for **five cycles, 1981-2019**, was the opposite for the **six before** it, and broke in the latest one (5.33 is more than double 2.42). On the cause: subtracting CPI inflation at each peak, the real highs ran **9.4 (1981) → 7.3 → 2.9 → 2.8 → 0.4 (2019)**, so falling inflation explains roughly 7.7 of the 16.7-point fall in nominal highs and not the rest. "Just to keep debt serviceable" as the sole reason is unmeasured and overstated; "more debt makes each rise hurt more" is the mechanism the lesson actually needs.

#### What shipped
- `lessonContent.economy.<lang>.js` L32 §3, last sentence of the first paragraph, en/es/ko/zh/ja (5 strings). en: *"Debt payments compete with new borrowing for a household's or a business's income, so the more debt there is, the more each rate rise hurts. In the US, the Fed's key rate peaked at about 19% in 1981, then under 12% in 1984, about 6.5% in 2000, about 5.25% in 2006-07 and under 2.5% in 2018-19: each cycle's high lower than the last. Falling inflation explains part of that drop, but not all of it. It isn't a law, though: from the 1950s to 1981 each cycle's high was above the last, and in 2023 the Fed took its rate back above 5%."* Conventions followed per file: es "el Fed" and `.` decimals, ko 연준, zh 美联储 and `1950年代`, ja FRB, CJK `2006-07年`. The next paragraph ("Run that pattern across many 5-8 year cycles … the room to cut keeps shrinking") is unchanged and still reads as following from it.
- Knock-ons the checks asked for, each by its own failure: `lessons.js` L32 `minutes` **4 → 5** (§2); ledger L32 es/ko/zh/ja re-marked `ai` after reading each sentence against the English (zh's *"越让人吃痛"* became *"带来的负担就越重"* on that read, and the patcher was kept in sync); `npm run readiness -- --write` (176 → **177 min**, en 166,065 → **166,389** chars; LAUNCH_READINESS, LAUNCH_PLAN, CLAIMS A6). `translation-completeness --write` was **not** run (memory note).
- Patcher (node, UTF-8, `split/join`): old ×1 / new ×0 asserted per file before writing; a second dry run after applying refuses (exit 1). Originals are in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). The first run after the edit failed on exactly minutes (§2) and the §10.4 ledger figure. §65 en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6, unchanged (no option touched) |
| `check-blindspot` sees the file | planted *"You should buy index funds now."* in L32 → **exit 1**; restored from the scratchpad copy, `cmp`-equal → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-CgmVzM8r.js`, system Node v24.18.0 |
| Bundle | new phrase in **1** asset per language (its own `lessonContent.economy.<lang>`); old phrases **0** in all 5, zh's discarded draft **0**. Control: unchanged "Run that pattern across many 5-8 year cycles" 1. Nonsense probe 0 |
| Siblings | Node scan for `cycle after cycle|each cycle's (peak|high|low)|lower and lower|rates keep falling…|ratchet` plus the four translated forms over `src/**/*.{js,jsx}`: 6 hits, **none a sibling claim** (my three new sentences, L32's conditional *"if each cycle's peak carries more debt"*, and money L17's lifestyle "ratchet"). Control: the 5 pre-edit originals return the targeted sentence in **5/5** languages |
| Live walk | **not done.** One paragraph in a section card that already wraps |

#### Step 5: adversarial self-check
- **Do the figures hold?** Each is a monthly effective-rate maximum from the table above, rounded the safe way ("under 12%" for 11.64, "under 2.5%" for 2.42). "2006-07" because the 5.25% target was set in 2006-06 and the effective maximum fell in 2007-02; "2018-19" likewise (target top 2.5% set 2018-12, effective maximum 2019-04). "Back above 5%": `FEDFUNDS` first exceeds 5 in 2023-05.
- **Did I overcorrect?** The lesson's point, that the room to cut can shrink across decades, survives and is now backed by the run that actually happened; "it isn't a law" is the measured 1954-81 and 2023 record, not a hedge for its own sake. "Not all of it" is the real-rate fall measured above.
- **§10.1:** dated historical description of policy rates; no instruction to borrow, save or invest. **§10.2:** no attribution added (0 Dalio/Bridgewater hits in the added lines). **§2.3:** every figure is dated; nothing reads as a current rate. **Completed work:** this morning's L32 §2/§3 "5-8 years on average" fix is untouched and still reads correctly beside it. **DECISIONS.md / CLAIMS.md / archive:** 0 hits for the old wording. **Would a reviewer get my result?** Yes: the FRED pulls with the 404 control, the patch assertions, `npm test`, the planted control, the build, the bundle probes and the controlled sibling scan all re-run. No conflict found.

**Seen, not fixed:** L40's thinkAbout *"more than most people"* stands as before. I did not re-read L33/L34's own statements about rates falling over decades against this table; they were measured by earlier runs and nothing in the sibling scan points at them. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 32 said central banks keep rates "a little lower, cycle after cycle, just to keep debt serviceable". US rate highs did fall every cycle from 1981 to 2019, but they rose every cycle from the 1950s to 1981, and 2023's 5.3% was more than double 2019's high, so the lesson now gives the dated run and says it isn't a law, in all five languages. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-08 (scheduled dev-agent; **the previous run's named residual, L33's "gap between recessions" range**. Its "Seen, not fixed" called it *"arguable, not picked by default"*. I picked it anyway because the measurement below makes it more than arguable: under the most natural reading of "gap between recessions", **both** endpoints of the range are false. The previous run was a free pick, so W-6.2 rule 1 allows this, and **the next run may take a residual of this one only once more.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit) — **lesson 33, quiz q003's explanation and the nested-cycles chart description no longer say "the actual gap between recessions has run from a year and a half to more than twelve years". They now say the actual time *from the start of one recession to the start of the next* has run over that range, the measure lesson 32 adopted this morning.** 15 strings: 3 sites × 5 languages.

**Step 3.5: the premise, measured with FRED's keyless CSV. It holds, and it is stronger than the residual said.** Controls: `NOSUCHSERIESXYZ` → **404**, `USREC` → 200; the post-war peaks and troughs derived from `USREC` **match NBER's published dates** (1948-11 … 2020-02 / 1949-10 … 2020-04), and the derived expansion lengths reproduce NBER's published 12 months (1980-81) and 128 months (2009-20). Three ways to read the same cycles, post-war:
| measure | min | max | does "1.5 to 12+ years" hold? |
|---|---|---|---|
| start to start (peak → peak) | 18 mo (1.50 y) | 146 mo (12.17 y) | **yes** |
| end to start (trough → next peak, the expansion: the literal "gap between" two recessions) | 12 mo (1.00 y) | 128 mo (10.67 y) | **no, at both ends** |
| end to end (trough → trough) | 28 mo (2.33 y) | 130 mo (10.83 y) | **no, at both ends** |
The previous run caught only the upper end (*"read end to start … 'more than twelve years' fails"*). The lower end fails too: the 1980-81 expansion lasted one year, not a year and a half. So the sentence was right only under one of three standard readings, and the least natural one for the word "gap".

#### What shipped
- `lessonContent.economy.<lang>.js` L33 §2 body ("Why It's Hard to See From the Inside"), `quizText.<lang>.js` q003 `explain`, and `markets.js` `nestedCyclesDescription`, en/es/ko/zh/ja (15 strings). en: *"the actual gap between recessions"* → *"the actual time from the start of one recession to the start of the next"*. es *"el tiempo real entre el inicio de una recesión y el de la siguiente"*; ko *"한 경기 침체가 시작된 때부터 다음 침체가 시작될 때까지의 실제 간격은"*; zh *"从一次衰退开始到下一次衰退开始的实际间隔"*; ja *"ある景気後退の始まりから次の景気後退の始まりまでの実際の間隔は"*. In markets.js ko and ja the preceding *"미국의"* / *"米国の"* became *"미국에서"* / *"米国では、"* so the longer phrase still parses. The range itself, the "5-8 years on average" and q003's key are unchanged.
- Knock-ons the checks asked for: ledger L33 es/ko/zh/ja re-marked `ai` after reading each edited sentence against the English (`npm test` failed on exactly that §10.4 ledger check first); `npm run readiness -- --write` (en 166,026 → **166,065** chars, minutes unchanged at 176). `translation-completeness --write` was **not** run (memory note). q003 and markets.js have no ledger rows.
- Patcher (node, UTF-8, `split/join`, per-file counts): old ×1 / new ×0 asserted for all 15 before writing, 0 / 1 after; a second dry run refuses to apply. Originals are in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). §65 en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6, unchanged (no option touched) |
| `check-blindspot` sees markets.js | planted *"You should buy index funds now."* → **exit 1**; restored from the scratchpad copy, `cmp`-equal → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-DbwUq8f1.js`, system Node v24.18.0 |
| Bundle | new phrase in **3** assets / 3 occurrences in each of the 5 languages (lesson, quiz, markets); old phrases **0**. Controls: L32's "each new recession has begun anywhere from a year and a half" 1, "The whole rise spans 75-100 years" 1. Nonsense probe 0 |
| Siblings | Node scan for `between recessions|gap between|entre una recesión|entre recesiones|침체 사이|衰退之间|後退どうし|景気後退の間` over `src/**/*.{js,jsx}`: **12 hits, all generic "gap between"** (earning/spending, gross/net, Baa spread, signal/outcome), none about recession spacing. Control: the 11 pre-edit originals return **all 15** targeted sites |
| Live walk | **not done.** One clause in a card, a quiz explanation and a figure description that already wrap |

#### Step 5: adversarial self-check
- **Does the new wording hold?** Start to start is peak to peak: 1980-01 → 1981-07 is 18 months, exactly "a year and a half"; 2007-12 → 2020-02 is 146 months, "more than twelve years". A recession starts the month after its NBER peak, which shifts both ends equally and leaves the gaps unchanged. It now says the same thing as lesson 32 §2.
- **§10.1:** dated historical description; no instruction to borrow, save or invest. **§10.2:** no attribution added. **§2.3:** "since World War II" is a dated span; nothing present-tense added.
- **Completed work:** extends, does not undo, the 10-06 q003 fix and this morning's L32 fix; the 09-13 L33 and 09-28 chart-alt fixes keep their average-plus-spread framing. **DECISIONS.md / CLAIMS.md:** 0 hits for the wording. **Would a reviewer get my result?** Yes: the FRED pull with both controls, the patch assertions, `npm test`, the planted control, the build, the bundle probes and the controlled sibling scan all re-run. No conflict found.

**Seen, not fixed:** L32 §3's *"lenders and central banks tend to keep rates a little lower on average, cycle after cycle"* (the previous run's other residual) and L40's thinkAbout stand as before, not measured. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** three places said "the gap between recessions has run from 1.5 to 12+ years", but the gap between one recession ending and the next starting has actually run from 1 to under 11 years; the figure is right only start to start, so all three now say that, in all five languages, matching lesson 32. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-08 (scheduled dev-agent; **a free pick**. The previous run's one residual, L40's *"more than most people"* thinkAbout, was "not picked by default", and I left it, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick is an archived residual never taken:** the 09-13/14 entry's *"L32 §2's 'This up-and-down cycle repeats roughly every 5-8 years' … Any fix should also look at 'roughly every 5-8 years' against L33's measured spread"* (archive l.51774). The 10-06 q003 run listed L32's "roughly" as hedged in its sibling scan but did not rule on it) — **lesson 32, where a learner first meets the 5-8-year figure, no longer says the business cycle "repeats roughly every 5-8 years". It now says 5-8 years *on average* in the US since World War II, and that each new recession has begun anywhere from a year and a half to more than twelve years after the last one began.** §3's closing "roughly every 5-8 years" becomes "every 5-8 years on average".

**Step 3.5: the premise, measured with FRED's keyless CSV. It holds.** Controls: `NOSUCHSERIESXYZ` → **404**, `USREC` → 200. The post-war peaks derived from `USREC` (1948-11 … 2020-02) **match NBER's published peak dates exactly** (second control). Peak-to-peak gaps: 56, 49, 32, 116, 47, 74, 18, 108, 128, 81, 146 months. **Mean 6.48 years, but only 2 of 11 fall inside 5-8 years**, so "roughly every 5-8 years" describes the average and almost no single cycle. This reproduces the 09-13 and 10-06 readings. The 1945-02 peak is excluded as wartime ("since World War II").

#### What shipped
- `lessonContent.economy.<lang>.js` L32 §2 last sentence and §3 last sentence, en/es/ko/zh/ja (10 strings). en §2: *"In the US since World War II, this up-and-down cycle has come around every 5-8 years on average: each new recession has begun anywhere from a year and a half to more than twelve years after the last one began. It is steered mostly by the central bank's interest-rate decisions."* §3: *"…nothing more than a rate cut, every 5-8 years on average."* "Steered mostly by" is kept (09-14 ruled it supported). L32's subtitle and q003's key "5-8 years" stay, per the 10-06 ruling.
- Knock-ons the checks asked for: ledger L32 es/ko/zh/ja re-marked `ai` after a read against the English; `npm run readiness -- --write` (en 165,863 → **166,026** chars, minutes unchanged at 176). `translation-completeness --write` was **not** run (memory note).
- Patcher (node, UTF-8, function replacer, assert the match lands inside L32): old ×1 / new ×0 before writing and 0 / 1 after, 10/10. A second dry run refuses to apply twice. Originals are in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). The first run after the edit failed on exactly the expected ledger and readiness checks |
| `check-blindspot` sees the file | planted *"You should buy index funds now."* → **exit 1**; restored from the scratchpad copy, `cmp`-equal → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-CjwVKxAi.js`, system Node v24.18.0 |
| Bundle | new §2 and §3 phrases in **1** asset each in all 5 languages; old phrases and this run's discarded draft in **0**. Control: the unchanged "Run that pattern across many 5-8 year cycles" in 1. Nonsense probe 0 |
| Siblings | Node scan for `(roughly|about|aproximadamente|대략|大约|およそ)…5-8` over `src/**/*.{js,jsx}`: **0**. Control: the 5 pre-edit originals return **10/10** |
| Live walk | **not done.** Two sentences in a section card that already wraps |

#### Step 5: adversarial self-check
- **It found one thing, fixed in-run.** My first draft said *"single cycles have run from a year and a half to more than twelve years"*. That holds peak to peak only. Trough to trough, the same data run 28-130 months, so the longest is 10.8 years, and "more than twelve" would be false under the other standard measure. I replaced it with what was measured: one recession's *start* to the next one's *start* (18 and 146 months). I restored the originals, re-patched, re-marked, re-ran everything above, and probed the discarded draft at 0.
- **§10.1:** a dated historical description of recession spacing; no instruction to borrow, save or invest. **§10.2:** no attribution added. **§2.3:** "since World War II" is a dated span, nothing present-tense.
- **Does it contradict q003's key or lesson 33?** No. The key is "5-8 years" and the lesson now calls that the average, as q003's explanation (10-06) and L33 (09-13) already do. **Completed work / DECISIONS.md:** the 09-14 L32 takeaway fix and the 10-06 q003 fix are untouched; nothing in DECISIONS.md or CLAIMS.md covers this wording. **Would a reviewer get my result?** Yes: the FRED pull with both controls, the patch assertions, `npm test`, the planted control, the build, the probes and the sibling scan all re-run. No conflict left.

**Seen, not fixed:** L33's own *"the actual gap between recessions has run from a year and a half to more than twelve years"* is ambiguous in the same way. Read end to start (expansion length), the range is 12-128 months, so "more than twelve years" fails. Read start to start, it holds. **Arguable, not picked by default**; the same wording is in q003's explain and markets.js's `nestedCyclesDescription`, so any fix touches all three. L32 §3's *"lenders and central banks tend to keep rates a little lower on average, cycle after cycle"* is a causal claim that 2022's hikes complicate. Not measured. L40's thinkAbout stands as before. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 32 said the business cycle "repeats roughly every 5-8 years". That is the average, but only 2 of the 11 US cycles since WWII actually fell inside 5-8 years (they ran from 1.5 to 12+ years), so the lesson now says so in all five languages, matching lesson 33 and the quiz. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-08 (scheduled dev-agent; **a free pick**. The previous run named three glossary residuals (Dividend, Labor Income, Deductible), each "not picked by default", and I left them, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick is an archived residual never taken:** the 09-14 L40 entry's *"L40 Rule 1 'eventually the debt burden crushes you, whether you're a household or a country' and `q008`'s explain 'This applies to individuals AND nations' state as certain something that does not always hold … Not measured"* (archive l.51698). I found it by reading all 46 English quiz `explain`s; `crush` has exactly one hit across both logs, that note) — **lesson 40's Rule 1 and quiz q008 no longer say that debt outgrowing income "eventually crushes you, whether you're a household or a country". They now say falling interest rates can keep the payments bearable for years, give the dated US-household and Japan cases, and say the rule is the same for both but how long it can be broken differs.**

**Step 3.5: the premise, measured with FRED's keyless CSV. It holds.** Controls: `NOSUCHSERIESXYZ` → **404** (200 for every real id); `CPIAUCNS` 1980-03 YoY **14.76%** (BLS 14.8).
- **Households, the rule's own case:** debt (`CMDEBT`) / disposable income (`DSPI`) **69.1% (1980Q1) → 135.0% (2007Q4)**, 27 years of debt outgrowing income, while the 30-year mortgage rate (`MORTGAGE30US`, quarterly) went **13.68% → 6.22%**. Then 2008. So the rule held, but "eventually" was 27 years, and falling rates were what carried it. That is the mechanism lesson 33 teaches and lesson 40 left out.
- **A country, the counter-case:** Japan general government gross debt (`GGGDTAJPA188N`, IMF) **63.2% of GDP (1990) → 240.0% (2023)**, peak 258.4% (2020), while its 10-year yield (`IRLTLT01JPM156N`) averaged **6.96% (1990) → 0.56% (2023)**. Debt has outgrown income for 33 years and borrowing got cheaper. "Eventually crushes you … a country" is unproven for an own-currency borrower. (The yield is 2.94% in 2026-08; the text stops at 2023 on purpose.)
- **Siblings:** a Node scan for `crush|aplast|짓누|压垮|押しつぶ` over the 10 pre-edit originals returned **9, not 10: the control caught the instrument.** ko q008 says `짓눌립니다`, not `짓누`. With `짓눌` added: originals **10/10**, and over every `src/content` module after the edit **1**, the ko glossary Deleveraging `ex` (*"a country already crushed by debt must eventually deleverage"*), a conditional about a country already in trouble, not this claim; left alone. `src/locales` 0. (ugrep aborted on a bounded pattern first, as the memory note says; Node was the instrument.)

#### What shipped
- `lessonContent.economy.<lang>.js` L40 §0 Rule 1 tail and `quizText.<lang>.js` q008 `explain`, en/es/ko/zh/ja (10 strings). en Rule 1 tail: *"That's Rule 1 being broken in slow motion. Falling interest rates can keep the payments bearable for years: US households' debt grew from about 70% of their after-tax income in 1980 to 135% in 2007 while mortgage rates more than halved, and then came 2008. A country that borrows in its own currency has more room: Japan's government debt grew from about 60% of its yearly economic output in 1990 to about 240% in 2023, while the rate it paid to borrow for ten years fell from about 7% to under 1%. The rule is the same for both. What differs is how long it can be broken."* q008: *"Debt that keeps rising faster than income takes up more and more of it. Falling interest rates can keep the payments bearable for years, as they did for US households until 2008, but rates can only fall so far. The rule applies to households and countries alike, though a country that borrows in its own currency has more room, as Japan shows."* The rule, the family example and the quiz key are unchanged.
- **Knock-ons the checks asked for, each by its own failure:** `lessons.js` L40 `minutes` **2 → 3** (§2); `lessonTerms[40]` gains `0: ["Interest Rate"]` (§3.0.3: the term is now used in §0); ledger L40 es/ko/zh/ja re-marked `ai`; `npm run readiness -- --write` (175 → **176 min**, en 165,415 → **165,863** chars; LAUNCH_READINESS, LAUNCH_PLAN, CLAIMS A6). `translation-completeness --write` was **not** run (memory note).
- Patchers (node, UTF-8, function replacer): old ×1 / new ×0 asserted before writing and 0 / 1 after, 10/10 then 5/5. Originals in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). First run after the edit failed on exactly the three expected checks (minutes, ledger, §3.0.3), then the six generated figures |
| §65 (W-10.7's test) | en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6, all at or below the 10-04 reading. No option was touched |
| `check-blindspot` sees the file | planted *"You should buy index funds now."* (count 1) → **exit 1**; restored from the scratchpad copy, `cmp`-equal → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-ILyb6Qb8.js`, system Node v24.18.0 |
| Bundle | new L40 and q008 phrases in **1** asset each in all 5 languages; old phrases (and this run's discarded "so far" draft) in **0**. Control: unchanged Rule 2 in 1. Nonsense probe 0 |
| Live walk | **not done.** Text in a card that already wraps, plus one Interest Rate chip, which lesson 37 §0 already renders |

#### Step 5: adversarial self-check
- **It found one thing, fixed in-run.** My first draft ended the Japan sentence *"without a debt crisis so far"*. That is time-relative (§2.3's fake-freshness concern), and lesson 33 lists *"Japan in 1989"* as a debt bust, so a reader could take the two lessons to contradict each other. Replaced with the measured, period-bounded yield fall, in all five languages, and the old phrase probed at 0.
- **§10.1:** the text explains a mechanism and two dated cases; no instruction to borrow, repay or invest. The lesson's closing "simple advice for you AND for policy makers" is untouched (not mine; noted below). **§10.2:** no attribution added. **§2.3:** four dated years, nothing present-tense.
- **Did I overcorrect?** "Has more room" is not "has no limit", and the next sentence keeps the rule binding on both. q008 still says rates "can only fall so far", which is lesson 34's zero-bound point. **Completed work:** the 09-14 L40 §2 fix and the 10-07 Interest Rate glossary fix are untouched. **DECISIONS.md:** nothing on lesson wording. **Would a reviewer get my result?** Yes: the FRED pulls with both controls, the patch assertions, `npm test`, the planted control, the build and the probes all re-run. No conflict left.

**Seen, not fixed:** L40's thinkAbout *"You now understand more about how the economy works than most people"* is the other 09-14 residual, an unmeasured flattering claim; arguable, **not picked by default**. q007's QE explain and Dividend/Deductible (10-07) stand as before. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the closing economy lesson and its quiz said debt that outgrows income "eventually crushes you", household or country. US households ran that way for 27 years on falling rates before 2008, and Japan's government debt quadrupled against GDP while its borrowing cost fell, so both now say that, in all five languages. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-07 (scheduled dev-agent; **a free pick**. The previous run was W-5.3's archiving chore and named no residual, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is a glossary accuracy fix carried into four languages, the shape of the Bond and Inflation fixes. `npm test` was **not** re-run before editing; the 0 FAIL / 1 WARN baseline is the previous entry's reading. **The pick came from re-reading all 43 English glossary `f` strings for a claim no run had measured:** `same rate the lender earns` returns **0** hits across `AGENT_LOG.md`, the archive, `CLAIMS.md` and `DECISIONS.md`) — **the glossary's Interest Rate entry no longer says flatly that "the rate a borrower pays is the same rate the lender earns". It now says that holds on a single loan, before any losses, and that a bank in the middle pays its savers less than it charges its borrowers, which is why a savings account earns far less than a credit card costs.**

**Step 3.5: the premise, measured. It holds.**
- **FRED, keyless CSV, read today:** national average savings rate `SNDR` **0.37%** (2026-09); credit card plans `TERMCBCCALLNS` **21.19%** (2026-08); 30-year mortgage `MORTGAGE30US` **7.28%** (2026-10-01). A saver at the average rate and a cardholder at the same bank are on opposite sides of a **~21-point** gap. Control: a nonexistent series id returns an HTML page, not a CSV. (`USNIM`, bank net interest margin, was tried and stops in 2020, so it is not cited.)
- **Why it matters where it shows:** `lessonTerms.js` attaches this definition to **10 lessons**. Lesson 2 §0 is one of them, and it is the lesson that contrasts a savings account with a credit card *"at a high interest rate"*. The old sentence was true of one loan read alone, but sat next to *"from mortgages to savings balances"*, so a learner could take it to mean savers earn what borrowers pay.
- **Siblings:** a Node scan of every `*.en.js` content module plus `glossary.js`, `markets.js`, `kidsContent.js`, `moneyVisuals.js`, `policyScenarios.js` and `lessons.js` for `lender earns|lender gets|same rate|pays savers|charges borrowers|spread between…` returns 7 hits: this entry's two copies (the control, `includes` = true), Credit Spread, and four unrelated "same rate" / "keeps the gap" phrases. No other surface carries the symmetry claim. (ugrep aborted on the bounded pattern first, as the memory note says; Node was the instrument.)

#### What shipped
- `glossary.js` `"Interest Rate".f`, en/es/ko/zh/ja (5 strings). The first sentence, the policy-rate sentence and the `ex` are unchanged. en (433 chars): *"The price of borrowing money, quoted as a percentage of the amount borrowed per year. On a single loan, what the borrower pays is what the lender earns, before any losses. A bank in the middle, though, pays its savers less than it charges its borrowers, which is why a savings account earns far less than a credit card costs. A central bank's policy rate influences most other rates in an economy, from mortgages to savings balances."* Each language reuses the glossary's own Savings Account term (`cuenta de ahorros`, `예금 계좌`, `储蓄账户`, `普通預金口座`) and the essentials lessons' credit-card word. ko keeps the old entry's `대출자` for "lender".
- Patcher (node, UTF-8, function replacer): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. All five read back from the module. Original in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's) |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-Bw5dRbYD.js`, system Node v24.18.0 |
| Bundle | new clause in **1** asset in each of 5 languages; old clause in **0** in each of 5. Control: the unchanged `ex` in 1. Nonsense probe 0 |
| Live walk | **not done.** One glossary definition, shorter than Credit Spread's, in a list that already renders |

#### Step 5: adversarial self-check
- **§10.1:** the new sentence compares two kinds of account; it does not say to pay down a card, move savings, or choose a bank. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** no figure or date entered the app; the FRED readings are in this entry only, so no `CLAIMS.md` row. **§10.2:** no attribution.
- **Did I overstate the other way?** "Pays its savers less than it charges its borrowers" is the deposit-loan spread banks run on; even a high-yield savings account at ~4% sits far under 21%, so "far less than a credit card costs" survives the strongest counter-case. "Before any losses" keeps the single-loan clause true when a borrower defaults. I did not claim the gap is all profit (costs and loan losses come out of it).
- **Completed work / DECISIONS.md:** the Bond (10-07) and Inflation (10-05) fixes are untouched; nothing in DECISIONS.md covers glossary wording. **Would a reviewer get my result?** Yes: the FRED fetches with the bad-id control, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** Dividend's *"paid out in cash"* is still the 10-07 Bond entry's arguable residual, **not picked by default**. Labor Income's *"the one that can be started with no capital"* reads as a fair simplification to me and is not measured. Deductible's *"on a claim"* is per-claim for car and home but annual for US health plans; the example is a repair, so I left it, **arguable, not picked by default**. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the glossary said the rate a borrower pays is the rate the lender earns. That is true of one loan, but banks pay savers far less than they charge borrowers (about 0.4% on savings against about 21% on cards, per FRED), so the entry now says so, in all five languages. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-07 (scheduled dev-agent; **W-5.3's archiving pass, which the run log's own headroom WARN called for**. The previous entry predicted it was *"likely the next run's or the one after's"*. It is a standing chore, not a residual, so W-6.2 rule 1 does not arise, and W-9.4 does not apply. `npm test`'s `check-log-size` showed **0 FAIL, 1 WARN** before any edit: the headroom WARN, *"1.00 run(s) left"*) — W-5.3's **twenty-second** firing, one day ahead of W-10.6(a)'s 2026-10-08 estimate: 2026-09-27 → 10-03 (**7 days, 29 entries, 154,661 b**) moved verbatim to `AGENT_LOG.archive.md` under `## Archived 2026-09-27 → 2026-10-03`. Run log **243,574 → 88,912 b** (97.4% → **35.6%** of the warn budget; 1.00 → **25.0 runs** of headroom), headroom WARN cleared.

**Step 3.5: the premise, re-measured.** `check-log-size` at HEAD `e893cd6`: run log **243,574 b**, 11 live days, every day one contiguous region, its 4 controls firing. The premise held. **Which days:** everything before the 2026-10-04 weekly-review boundary (W-10 is dated that day), the rule's date clause as written. It also leaves the four post-review days live, as the 10-03 pass did. Day sizes from the mover's own byte offsets: 09-27 23,546; 09-28 20,868; 09-29 25,646 (5 entries); 09-30 21,146; 10-01 23,839; 10-02 19,799; 10-03 19,817.

#### What shipped (2 files, no source change)
- `AGENT_LOG.md` **509,174 → 354,512 b** before this entry; **4 live days**, oldest 2026-10-04. **Floor unchanged at 265,600 b.**
- `AGENT_LOG.archive.md` **5,324,715 → 5,479,416 b**. Title range `→ 2026-09-26` becomes `→ 2026-10-03` (matched once on line 1, byte-neutral). The new section sits after `## Archived 2026-09-21 → 2026-09-26` and before `## Archived backlog (closed items)`, the 10-03 pass's placement. Days ascending; entries within each day verbatim in live-file order.
- The mover lived in the scratchpad: **`scripts/` gained 0 lines.** `src/` untouched.

#### Verification
| Check | Result |
|---|---|
| **Conservation** | the section read back **out of the new archive**, days put back in file order and appended to the new live file, reproduces the pre-cut `AGENT_LOG.md` (= `git show e893cd6:AGENT_LOG.md`, `cmp` clean before the write) **byte for byte (509,174 b)** |
| Negative control | the same rebuild one character short does **not** match |
| Containment | each of the 29 heading lines is in the new archive ×1, the old archive ×0, the new live file ×0. `^### ` heading counts for the 7 days: live **0**, archive **29**, HEAD **29** |
| Composition | archive grew **154,701 b** = section heading (39) + block without its edge newlines (154,660) + separator (2) |
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's; the headroom WARN is gone). MEASURED 2026-10-07, before this entry: file 354,512 b, run log 88,912 b, floor 265,600 b, archive 5,479,416 b, 4 live days |

**Instrument note, and why the conservation check exists:** my first dry run **failed** conservation. The mover found the archive's insertion point with `indexOf("## Archived backlog (closed items)")`, and two of the moved entries (09-27's W-9.1 pass and 10-03's archive pass) **quote that heading in backticks**. Once the block was inserted, the read-back stopped at the first quote and rebuilt only two days. The fix was a line-start match, asserted to occur exactly once in the new archive (the two quoted copies are counted separately). Nothing had been written; the dry run is what caught it. **A future mover should anchor section headings at line start, never with a bare `indexOf`.**

#### Step 5: adversarial self-check
- **Blindspot register:** out of reach; only two markdown files changed, and `check-blindspot` is green inside `npm test`.
- **DECISIONS.md / W-7.2 rule 3:** moved **verbatim**, nothing deleted or edited. The conservation check is the proof, since any edit would fail it; **`npm test` alone cannot show this** (it does not detect archive loss). Backlog, App summary and Environment note untouched; the floor is byte-identical.
- **Already-done work:** a standing chore firing again. The archive held 0 of these 29 entries before.
- **My own claims:** ⚠️ once this commits, HEAD moves. **A reviewer must name this commit's parent `e893cd6`**, not HEAD. No conflict found.

**Seen, not fixed:** nothing new. **W-10.6(a)'s treadmill, measured:** 15 content runs separate the 21st pass (10-03) from this 22nd one (1 on 10-03 after it, 4 each on 10-04, 10-05 and 10-06, 2 on 10-07), so log mechanics are 1 run in 16, under its "one run in eight" alarm. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **W-8.1:** committed, **not deployed**.

**Owner-facing, one line:** the run log was one run from its size budget, so 29 entries from 2026-09-27 to 10-03 moved verbatim into the archive (run log at 36% of budget, warning cleared). No learner-visible change. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-10-07 (scheduled dev-agent; **a free pick**. The previous run said *"the next run may take a residual of this one only once more"*, but it named none ("Seen, not fixed: nothing new"), so W-6.2 rule 1 does not arise. **The pick is an older residual named twice and never taken:** the 10-05 Inflation entry's *"Bond's 'same fixed payments' ignores floating-rate bonds and TIPS … arguable and not picked by default"*. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is a glossary accuracy fix carried into four languages, the shape of the 10-05 Inflation fix. **I did not run `npm test` before editing**; the 0 FAIL / 1 WARN baseline is the previous entry's reading) — **the glossary's Bond entry no longer says the borrower owes "the same fixed payments". It now says the borrower owes what the bond's terms promise, that most bonds pay a fixed rate, and that some, such as inflation-protected bonds, adjust their payments by a formula set in advance.**

**Step 3.5: the premise, measured. It holds, and it is less "arguable" than the residual said.**
- **US Treasury, Monthly Statement of the Public Debt, table 1, 2026-09-30** (fiscaldata API, keyless). Marketable debt **$31.835T**: TIPS **$2.173T** and floating-rate notes **$0.708T**, together **9.0%**, pay amounts that change with inflation or short-term rates. Bills, notes and bonds (**91%**) are fixed. So "most bonds pay a fixed rate" is right, and "the same fixed payments" for every bond is not. Controls: the six marketable lines sum to **31.836** against the stated total of 31.835, and a nonexistent table path returns **404**.
- **Why a beginner meets the exception:** US Series I savings bonds, the bond most often marketed straight to households, reset their rate every six months. They are nonmarketable (**$0.146T** in "United States Savings Securities" on the same table), so I did not use them in the text, and the price clause is now scoped to fixed-rate bonds.
- **Siblings:** the essentials lesson already calls a bond *"an IOU with predictable terms"*, and lesson 35 says *"existing bonds paying a lower fixed rate"*. Both are compatible, and neither claims every bond is fixed. A Node scan of the en lessons, quiz text and `markets.js` for `fixed payment|fixed rate|same payment|coupon…` near *bond* returns lesson 35's line only. The `ex` (*"a lender with a fixed claim"*) is the standard debt-vs-residual-claim sense and stays.
- **Instrument note:** my first absolute-claim scan of the non-lesson modules read only `en: "…"` strings and **missed the glossary's `en: { s, f }` shape entirely.** The control caught it: `glossary.js` contains "never" 8 times, and the scan reported 0. Fixed, re-run, glossary line 43 then appeared.

#### What shipped
- `glossary.js` `Bond.f`, en/es/ko/zh/ja (5 strings). The `ex` sentence and the first sentence are unchanged. en (364 chars): *"A loan to a government or a company, to be repaid with interest by a set date. The borrower owes what the bond's terms promise, however well or badly it does. Most bonds pay a fixed rate, and their market price moves in the opposite direction to prevailing interest rates; some, such as inflation-protected bonds, adjust their payments by a formula set in advance."* Each language uses its usual term (`bonos protegidos contra la inflación`, `물가연동채권`, `通胀保值债券`, `物価連動債`).
- Patcher (node, UTF-8, function replacer): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. All five read back from the module. Original in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's) |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-D-FfOxTQ.js`, system Node v24.18.0 |
| Bundle | new clause in **1** asset in each of 5 languages; old en and zh clauses in **0**. Control: the unchanged `ex` in 1. Nonsense probe 0 |
| Live walk | **not done.** One glossary definition, about the length of Inflation's (352), in a list that already renders |

#### Step 5: adversarial self-check
- **§10.1:** naming inflation-protected bonds describes how some bonds work. It does not say anyone should hold one, and the comment above the entry (*"never which one to hold"*) still holds. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** no figure or date added to the app; the 9.0% is in this entry only, so no `CLAIMS.md` row. **§10.2:** no attribution.
- **Did I overstate the other way?** "Most" is 91% of marketable Treasuries by value, and fixed-rate is also the norm for corporate bonds. Bills are discount instruments with no coupon, but their return is locked at purchase, so "fixed rate" fits. "Owes what the terms promise" keeps the old sentence's contrast with stock (payments don't depend on performance) and, like the old one, says nothing about default; the Stock entry covers claim ranking.
- **Completed work / DECISIONS.md:** the 10-05 Inflation and 09-18 Deflation fixes are untouched. Nothing in DECISIONS.md covers glossary wording. **Would a reviewer get my result?** Yes: the MSPD fetch with its sum and 404 controls, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** Dividend's *"paid out in cash"* (stock dividends exist) is the other half of the 10-05 note. It is still arguable and **not picked by default**: cash is the overwhelming case, and the entry's point is profit paid out versus kept. The rest of the non-lesson absolute-claim scan (`markets.js`, `kidsContent.js`, `policyScenarios.js`, `economicSignals.js`, `moneyVisuals.js`) read as hedged, framework-level, or already measured to me. **Process slip, no repo effect:** my first scan command began with a stray `cat > "$TMPDIR/../scan.mjs"` waiting on stdin, the same slip the 10-06 lesson 37 entry recorded. It hung to the 120 s timeout and left an empty file in the system temp parent dir; I stopped it and removed the 0-byte file. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **Run log at 236,666 b before this entry (94.7% of the 250,000 b warn, 2.1 runs of headroom by `check-log-size`)**, so W-5.3's archiving pass is likely the next run's or the one after's. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the glossary said every bond pays "the same fixed payments". About 9% of marketable US Treasury debt (inflation-protected and floating-rate) does not, so the entry now says most bonds pay a fixed rate and some adjust their payments by a set formula, in all five languages. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-07 (scheduled dev-agent; **the previous run's named residual, lesson 10's takeaway**. Its "Seen, not fixed" called it *"arguable, and not picked by default"*. The previous run was a free pick, so W-6.2 rule 1 allows this, and **the next run may take a residual of this one only once more.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. **I did not run `npm test` before editing**; the 0 FAIL / 1 WARN baseline is the previous entry's reading) — **lesson 10 (W-2 vs 1099) no longer ends by saying the self-employment tax "covers the half an employer would otherwise pay". It now says it covers both halves of the payroll tax, the employer's as well as the worker's own.**

**Step 3.5: the premise, measured. It is less arguable than the residual said: the takeaway disagreed with its own lesson in all five languages.**
- **IRS, "Self-Employment Tax (Social Security and Medicare Taxes)":** the rate is **15.3%** (12.4% Social Security + 2.9% Medicare), i.e. both 7.65% FICA halves. Control: the same path with a nonexistent slug → **404**, the real page → **200**.
- **The lesson already says both halves, three times:** §1's heading (*"Paying Both Halves"*), §1's body (*"a self-employed person owes both halves themselves"*), and q024's (index 23) correct option and `explain` in `quizText.en.js` (*"owes both halves of the payroll tax"*). The takeaway was the only place that named one half, and a reader keeping only that sentence would take the tax to be the employer's 7.65%. The previous run had not read the body; it settles the question against the takeaway.
- **All five languages carried the one-half form** (es *"cubre la mitad que normalmente paga el empleador"*, ko *"고용주가 원래 부담했을 절반을 대신 내는"*, zh *"覆盖雇主本应承担那一半"*, ja *"本来雇用主が負担するはずの半分をカバーする"*). Each language's own heading says both halves.
- **Siblings:** `grep -i 'self-employment|both halves|half an employer'` over `src/content/*.en.js`, the glossary and `lessonTerms.js` returns the heading, the takeaway and the q024 pair only. The one `lessonContent.money.en.js` hit is lesson 43's wage-protection paragraph, unrelated.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, lesson 10's `takeaway` only, last clause. Each language reuses its own §1 word for payroll tax (`impuesto de nómina`, `급여세`, `工资税`, `給与税`). en: *"…— including a self-employment tax that covers both halves of the payroll tax, the employer's as well as the worker's own."*
- Patcher (node, UTF-8, function replacer): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. One follow-up ja patch (same assertions) removed a doubled `含めて` from my first draft. Originals are in the scratchpad.
- Generated, not hand-typed: ledger re-marked (ai) for lesson 10 in es/ko/zh/ja; `npm run readiness -- --write` changed only character counts (en 165,381 → 165,415). Minutes unchanged (175).

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate: 1 FAIL (§10.4 ledger figure), cleared by the generated steps above |
| §65 (W-10.7 test ii) | en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6%, read off the instrument; no quiz text touched |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-BdKBrb4I.js`, system Node v24.18.0 |
| Bundle | new clause in **1** asset in each of 5 languages; old clause in **0** in all 5. Control: the unchanged heading *"The Self-Employment Tax: Paying Both Halves"* in 1. Nonsense probe 0 |
| Live walk | **not done.** One clause in a takeaway that already renders, +20 to +34 chars |

#### Step 5: adversarial self-check
- **§10.1:** a description of how the tax works; no advice, and the lesson's "set aside a quarter to a third" sentence is untouched. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** no figure or date added to the app; 15.3% is in this entry only, so no `CLAIMS.md` row. **§10.2:** no attribution.
- **Did I overstate the other way?** "Both halves" is the lesson's own framing and the IRS's 15.3%. The half-deductibility and the 92.35% base are details the lesson never claimed to cover, and the takeaway still makes no rate claim.
- **Completed work / DECISIONS.md:** this aligns the takeaway with the 2026-08 lesson 10 body (archive l.2742) rather than changing it. Nothing in DECISIONS.md covers it. **Would a reviewer get my result?** Yes: the IRS fetch with its 404 control, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** nothing new. Lesson 34's *"not so much you cause hyperinflation"* remains the previous run's wording call, not re-read here. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **Run log at 230,934 b before this entry (92.4% of the 250,000 b warn, ~3 runs of headroom)**, so W-5.3's archiving pass is due within a day, as W-10.6(a) predicted. The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the W-2 vs 1099 lesson ended by saying self-employment tax covers "the half an employer would otherwise pay", while its own heading, body and quiz say the self-employed pay both halves (15.3%, per the IRS). The takeaway now says both halves, in all five languages. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-06 (scheduled dev-agent; **a free pick**. The previous run said ⛔ *"the next run may NOT take a residual of this one"*, and it named none ("Seen, not fixed: nothing new"), so this is not one. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick came from reading all 44 English `takeaway`s for claims with no trigger word**, the method that found q003. I chose a read over another `always|never` scan because the takeaway is the one sentence each lesson asks the learner to keep) — **lesson 6 (retirement accounts) no longer says that "the account type doesn't change what you can invest in". It now says the account type *mainly* changes when the tax bill comes due, and that a 401(k) usually limits you to the funds its plan offers.** §0's matching sentence, *"not by changing what you're allowed to invest in"*, is fixed too.

**Step 3.5: the premise, measured.**
- **Never examined for truth.** The archive's only hit (l.54169) is the 09-2x translation-completeness run. It found the takeaway's premise missing from es/ko/zh/ja and restored it. It never asked whether the premise was true. `plan menu`, `menu of funds` and `investment menu` return **0** in the log, the archive and `CLAIMS.md`. Control: `self-employment tax` (a lesson 10 term I know was handled) returns 5 in the archive.
- **401(k): Vanguard *How America Saves 2026* (data at year-end 2025), read from the PDF.** I inflated the streams with Node (memory note: no PDF tools here). Controls: a nonexistent file on the same path → **404**, and `Vanguard` occurs 329 times in the extracted text. The report says participants choose *"within the context of a set or a menu of choices offered by the employer"*. The **median plan offered 16 options** (average **17.7**, with a target-date series counted as one). **23%** of plans (*"nearly 1 in 4"*) offered a self-directed brokerage window. So "usually" is the right hedge, and "only" would be wrong.
- **IRA: 26 U.S.C. §408 (Cornell LII).** §408(a)(3) says *"No part of the trust funds will be invested in life insurance contracts"*. §408(m) treats a collectible (art, rugs, antiques, gems, most coins, alcoholic beverages) as a distribution. So "most of what an ordinary account can", not "anything".
- **What survives:** the lesson's point. These accounts exist because of their tax treatment, and an IRA or 401(k) holds many of the same stocks, bonds and funds. Only the absolute claim about what you can invest in was wrong. A learner who opens a workplace 401(k) and finds a list of about 16 funds had been told the opposite.
- **Siblings:** a Node scan of `src/**/*.{js,jsx}` for `allowed to invest in|what you can invest in|change what you|same stocks, bonds` and for `401(k)`/`IRA` next to `any|menu|options|choose` returned only the two edited English sentences. Control: it found both. Quiz text and glossary mention 401(k)/IRA only about beneficiaries and tax deferral. q020, lesson 6's only question, is about Traditional vs Roth and is untouched.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, lesson 6 only: §0 paragraph 2's second sentence and the `takeaway`.
  - en takeaway: *"The account type mainly changes when the tax bill comes due, not the kind of investment inside it — though a 401(k) usually limits you to the funds its plan offers. That tax difference, compounded over decades, is why these accounts exist at all."*
  - en §0: *"…by changing the tax treatment. A 401(k) or IRA can hold many of the same stocks, bonds, or funds an ordinary brokerage account can, but not always as freely: an IRA can usually buy most of what an ordinary account can, while a 401(k) usually offers only a menu of funds its plan chose."*
  - Each translation carries the hedge (`normalmente`, `보통`, `通常`, `通常`). Without it, ko/zh/ja "only from the plan's list" would have been the same kind of absolute claim this fix removes.
- Patcher (node, UTF-8, function replacer): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 10/10. Originals are in the scratchpad.
- ⚠️ **The first draft pushed lesson 6 onto the minutes boundary.** The `check-data` §2 FAIL said *"minutes is 3, but its text computes to 4"*. I measured it: the lesson was **666 words, and the edit made it exactly 700** (700/200 = 3.5, which rounds to 4). I cut two English words (*"though not always with the same freedom"* → *"but not always as freely"*). That brought it to **698**, so it still rounds to 3 and the course total stays at 175 min. The meaning is unchanged. The translations were not touched for this, because the reading model counts English only.
- Generated, not hand-typed: ledger re-marked (ai) for lesson 6 in es/ko/zh/ja as `Claude (Opus 5.5, economics-app-dev-agent)`. `npm run readiness -- --write` changed only numbers: en chars 165,213 → 165,381, plus the four translation volumes. Minutes unchanged (175).

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate: 2 FAIL (minutes, §10.4 ledger figure), cleared by the trim and the generated steps above |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-DdeCMcpU.js`, system Node v24.18.0 |
| Bundle | new takeaway clause in **1** asset in each of 5 languages. All 6 old strings (5 takeaways and the en §0 clause) in **0**. Control: the unchanged L6 *"qualified withdrawals in retirement are entirely tax-free"* in 1. Nonsense probe 0 |
| Live walk | **not done.** Two sentences in running prose, in a lesson that already renders |

#### Step 5: adversarial self-check
- **§10.1:** the fix describes how the accounts restrict choice. It does not say which account to use or what to buy, and the lesson's existing *"not something this lesson can answer for any specific person"* hedge is untouched. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** I added no figure or date to the app. The 16/17.7/23% figures are in this entry only, so they create no `CLAIMS.md` row. **§10.2:** no attribution.
- **Did I swap one overstatement for another?** "usually" covers the 23% of plans with a brokerage window, and "most of what an ordinary account can" covers §408's exclusions. "Mainly changes when the tax bill comes due" keeps the lesson's own framing. Roth growth is never taxed at all, and §1 already says so (*"entirely tax-free, growth included"*), so the takeaway is no less exact about that than before.
- **Does "not the kind of investment inside it" contradict "limits you to the funds"?** No. The first clause is about the type of asset (stocks, bonds, funds). The second is about how many choices you get. The "though" clause marks the exception, so a reader is not told the two accounts are interchangeable.
- **Completed work / DECISIONS.md:** this keeps the 09-2x completeness run's restored §0 sentence and its hedge. It corrects that sentence instead of removing it. Nothing in DECISIONS.md covers it.
- **Would a reviewer get my result?** Yes. The PDF pull with its 404 control, the §408 fetch, the patch assertions, the word count, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** the takeaway read found nothing else I would call false. **Arguable, and not picked by default:** lesson 10's takeaway says self-employment tax *"covers the half an employer would otherwise pay"*. The tax covers both halves, and the 2026-08 lesson 10 entry (archive l.2742) says so. Read as "including the half", it is right. Read alone, it understates the tax, and lesson 10's body may already settle it; I did not read the body. Lesson 34's takeaway, *"…not so much you cause hyperinflation"*, makes the extreme case sound like the usual one; it is a framework line, and a wording call. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. They are not mine, and I did not touch them. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable". The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the retirement-accounts lesson ended by saying the account type "doesn't change what you can invest in". But a workplace 401(k) usually offers a menu of about 16 funds (Vanguard's 2025 median), and IRAs can't hold collectibles or life insurance. It now says the account type mainly changes when tax is due, and that a 401(k) usually limits you to its plan's funds, in all five languages. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-06 (scheduled dev-agent; **the previous run's named residual, `q044`**. Its "Seen, not fixed" called it *"arguable, and not picked by default"*. The previous run was itself a residual pick, so this is the second in a row. W-6.2 rule 1 allows that, and ⛔ **the next run may NOT take a residual of this one.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit) — **quiz q044's explanation no longer says *"a shift always pays"*. It now gives the wage its own way of failing, as the sentence promised: *"an empty apartment pays nothing, and neither does a shift Priya can't work or isn't given."*** The old clause said that "each carries its own ways of failing" and then gave one of the two none.

**Step 3.5: the premise, measured. It is less arguable than the residual said.**
- **The next lesson already contradicts it.** Lesson 43 says *"Priya's shifts stop the day she does; her income goes to zero in lockstep with her hours"*, and lesson 44's takeaway says labor income *"stops or drops sharply when you stop"*. So the quiz feedback for lesson 42 taught the opposite of what the learner reads one lesson later.
- **Hours get cut, measured with FRED's keyless CSV.** Control: `NOSUCHSERIESXYZ` → **404**. `LNS12032194` (part time for economic reasons) reads **10,880k in 2020-04**, matching BLS's published 10.9 million (second control). `LNS12032195` (the slack work or business conditions subset) reads **2,793k in 2020-02 → 9,987k in 2020-04**. "Isn't given" names that failure.
- **The languages disagreed.** en/es/ko said a shift *always* pays (`siempre paga`, `언제나 대가를 지급`). zh/ja said a shift *you work* is certainly paid (`只要上了班…一定有报酬`, `シフトに入れば必ず支払われます`). The zh/ja claim is true, and q046 and lesson 44 already teach it as the wage's protection. The en/es/ko claim is false. All five now make the same claim.
- **Siblings:** a Node scan of `src/**/*.{js,jsx}` for the five languages' "always pays" forms returns exactly the 5 q044 strings (this is its own control: each known string is found) and nothing else.

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js`, `q044.explain` only (index 43), the last clause. The options are untouched, so §65 cannot move. es `y tampoco un turno que Priya no puede trabajar o que no le asignan`, ko `프리야가 일할 수 없거나 배정받지 못한 근무도 마찬가지입니다`, zh `普里娅上不了的班、或者没排给她的班，也一样拿不到报酬`, ja `プリヤが入れないシフトや、割り当てられないシフトも何も払いません`. Each reuses its own lesson 43 word for shift (`turno`, `근무`, `班`, `シフト`).
- Patcher (node, UTF-8, function replacer): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. The array length reads back as 46 in all five. Originals are in the scratchpad. No generated file changed; quiz text is outside the ledger and readiness figures, and `npm test` asked for neither.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's), before and after |
| §65 (W-10.7 test ii) | longest-option rates en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6%, identical before and after, all at or below the 10-04 reading. Read off the instrument |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-CSsM49J1.js`, system Node v24.18.0 |
| Bundle | new clause in **1** asset in each of 5 languages. Old clause in **0** in all 5. Control: the unchanged q046 "legal minimums, notice periods, and being paid regardless" in 1. Nonsense probe 0 |
| Live walk | **not done.** Feedback text after an answer, +10 to +32 chars, in the card that already renders q028's longer explanation |

#### Step 5: adversarial self-check
- **§10.1:** a description of how wage income can stop. No advice. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** nothing dated or live-looking added. **§10.2:** no attribution.
- **Does "isn't given" contradict q046 / lesson 44's *"being paid regardless of how the business did"*?** No. That protection covers hours already worked, and the new clause says nothing against it. A shift that is never scheduled is never owed. The 2020 slack-work series is that case at scale.
- **Did zh/ja lose a true statement?** Yes, the "a worked shift is paid" half. It is still taught in q046's explanation and lesson 44's takeaway in all five languages, so nothing is lost from the course. Keeping it in two languages only would have left the five disagreeing.
- **Completed work / DECISIONS.md:** no archived item touched q044's explanation (`always pays` has 0 archive hits). Nothing in DECISIONS.md covers it. The judgment-track framing (§ real product definition) is kept, because the sentence still says the two incomes differ by mechanism, not by worth.
- **Would a reviewer get my result?** Yes. The FRED pulls with both controls, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** nothing new. q007's *"When rates are at 0%"* is a conditional the 09-18 run ruled broadly right (archive l.52245), and *"prints money"* was ruled a wording choice (archive l.52425), so it is not a residual. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. They are not mine, and I did not touch them. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable". The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed. The run log was at 215,698 b before this entry, below the 250,000 b warn.

**Owner-facing, one line:** a quiz explanation said extra shifts "always pay", right after saying both kinds of income have their own ways of failing, and the next lesson says shifts stop when you do. It now says a shift you can't work or aren't given pays nothing, in all five languages (zh and ja had been saying something different from the other three). Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-06 (scheduled dev-agent; **the previous run's named "Not checked" residual**: *"the money and essentials quiz text and the glossary against the same pattern"*. The previous run was a free pick, so W-6.2 rule 1 allows this, and **the next run may take a residual of this one only once more.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an accuracy fix carried into four languages. **I did not re-run `npm test` before editing**; the 0 FAIL / 1 WARN baseline is the previous entry's reading) — **quiz q003's explanation no longer says flatly that "the short-term debt cycle lasts 5-8 years". It now says 5-8 years *on average*, and adds the real US spread since World War II: a year and a half to more than twelve years.** Lesson 33's prose (09-13) and its chart's alt text (09-28) already say this. The quiz feedback was the one place still teaching the range as a fixed length.

**How the pick was reached, and a correction to the residual itself.** The residual was already done: the 10-05 lesson-36 entry records that same absolute-claim scan over the quiz and glossary as *"a negative result … recorded so the next run does not repeat it"*. So I did not re-run the word scan. **I read all 46 English questions with their keyed answer and `explain` instead.** That catches claims with no trigger word. q003's *"lasts 5-8 years"* contains no `always`/`never`, which is why the scan could not see it.

**Step 3.5: the premise, measured with FRED's keyless CSV.** Control: `NOSUCHSERIESXYZ` → **404**, `USREC` → 200.
- **Derived from `USREC`:** post-1945 peaks are 1948-11, 1953-07, 1957-08, 1960-04, 1969-12, 1973-11, 1980-01, 1981-07, 1990-07, 2001-03, 2007-12 and 2020-02. **They match NBER's published peak dates exactly** (second control).
- Peak-to-peak gaps (months): 56, 49, 32, 116, 47, 74, 18, 108, 128, 81, 146. **Mean 6.48 years, but only 2 of 11 gaps fall within 5-8 years.** The range is 18 to 146 months. This reproduces the 09-13 measurement (archive, "the premise measured, with a control"), so the "5-8 years" range is a fair average and a poor description of any single cycle.
- **What stays:** the answer key "5-8 years" and L32's subtitle. The 09-13 entry ruled changing the framework number "a separate, arguable decision" that touches a quiz key and §71's chart guard. This fix does not make that decision. It makes the explanation agree with the key, which is now correct as an average.
- **Siblings:** a Node scan of `src/**/*.{js,jsx}` for `5-8|5–8|5 to 8|five to eight|5 a 8` (the control: it finds the 2 known hits per quizText file) leaves no other unhedged claim. L32's body says "roughly every 5-8 years" (×2), L33 says "on average", markets.js says "on average", and the rest are the kids age band `5-8` and code comments. ⚠️ **My first sibling scan used `grep -o -E ".{0,60}…"`. That is ugrep's bounded-repetition trap (memory note): it printed nothing, and it would have read as clean.** The Node re-run is the one reported here.

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js`, `q003.explain` only (index 2), one line each. The options are untouched, so §65's option-length figures cannot move. Each language reuses its own L33 wording for the spread (`un año y medio a más de doce años`, `짧게는 1년 반, 길게는 12년이 넘었습니다`, `短则一年半，长则超过十二年`, `短いときで1年半、長いときで12年を超えています`). The spread goes last, so the "It's the business cycle" sentence keeps "the cycle" as its subject in every language.
- en: *"The short-term debt cycle lasts 5-8 years on average. It's the business cycle, which the central bank tries to steer through interest rates without fully controlling it. In the US since World War II, the actual gap between recessions has run from a year and a half to more than twelve years."*
- Patcher (node, UTF-8, function replacer): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. Originals are in the scratchpad. No generated file changed: `npm test` asked for no ledger or readiness rewrite (quiz text is outside both).

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's), after the edit |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-BNPwVBRe.js`, system Node v24.18.0 |
| Bundle | new opening in **1** asset in each of 5 languages. Old en/zh/ja openings in **0**. Control: the unchanged "The long-term cycle spans 75-100 years" in 1. Nonsense probe 0 |
| Live walk | **not done.** The explanation is shown after an answer, in the same card that shows q028's explanation, which is longer (en 291 vs 534 chars) |

#### Step 5: adversarial self-check
- **§10.1:** a historical description of recession spacing. No advice. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** a dated historical span ("since World War II"), nothing live-looking. **§10.2:** no attribution added.
- **Does the explanation now contradict its own key?** No. The key is "5-8 years", and the explanation says the range is the average. It does not say the key is wrong. A learner who chose "5-8 years" is told why it is right and how far single cycles stray from it.
- **Is "5-8 years on average" itself true?** The mean is 6.48 years by peaks. 09-13 reported 6.41 by troughs. Since 1982 the gaps average about 9.7 years. The archive records that, and it is why the framework number stays an open, arguable call rather than something I settle here.
- **Completed work / DECISIONS.md:** this extends the 09-13 and 09-28 hedges to the one surface they skipped, and redoes neither. The 09-14 q003 fix (the "steer … without fully controlling" clause) is kept verbatim. Nothing in DECISIONS.md covers quiz explanations.
- **Would a reviewer get my result?** Yes. The FRED pull with both controls, the patch assertions, `npm test`, the build, the bundle probes and the Node sibling scan all re-run. No conflict found.

**Seen, not fixed:** **q044's explanation ends *"an empty apartment pays nothing, while a shift always pays"*.** Owed wages are a legal right, and q046 frames it that way (*"being paid regardless of how the business did"*). But "always pays" sits right after "each carries its own ways of failing" and gives the wage no failure mode (shifts cut, hours not offered). It is arguable, and **not picked by default**. The other 45 explanations read as true, hedged or already measured to me. q021's take-home claim is ruled on (archive l.48415, 09-11). q007's "When rates are at 0%" is approximate for QE1, which was announced 2008-11-25 with the target at 1%, but the question's key says the same thing; that is not measured here. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. They are not mine, and I did not touch them. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable". The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the quiz said the short business cycle "lasts 5-8 years". That is the average. Since WWII, the actual US gaps between recessions have run from 1.5 to 12+ years, and only 2 of 11 fell inside 5-8. The explanation now says so in all five languages, matching lesson 33. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-06 (scheduled dev-agent; **a free pick**. The previous run named two glossary simplifications (Bond, Dividend) as *"not picked by default"* and I left them, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is an English accuracy fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick came from extending the 10-04 absolute-claim scan (`always|never|guarantee|can't|only way|…`) from essentials to the money and economy tracks.** Money returned 56 hits. All were hedged, rhetorical, or already measured: lesson 7's "a raise can never reduce your take-home pay" already carries the benefits-cliff caveat, and archive l.49587 looked at it. Economy returned 28 hits, and one had never been measured) — **lesson 37 (QE) no longer says "the Fed never lends to either one directly", meaning small businesses and home-buying families. It now says that *in QE* the Fed doesn't lend to either one directly.** The old sentence was false as history.

**Step 3.5: the premise, measured.**
- **Never examined:** `never lends`, `13(b)` and `Main Street Lending` return **0** in `AGENT_LOG.md`, the archive and `CLAIMS.md`. Control: `Baa`, a claim from the same lesson set that I know was measured, returns 9 hits in the archive.
- **The fact:** Section 13(b) of the Federal Reserve Act (signed June 1934, repealed 1958, Pub. L. 85-699) let Reserve Banks lend working capital to established businesses **directly or alongside a commercial bank**. The Minneapolis Fed's own history describes Reserve Banks taking the applications, investigating the borrowers and servicing the loans themselves. About 2,000 loans worth about $124.5M were approved through 1935 (Cato, citing Fed records). In 2020 the Main Street Lending Program bought 95% participations in bank-originated loans to small and mid-sized firms ($16.6B, closed 2021-01-08). That was not direct lending, but it was the Fed funding business loans.
- **What survives:** the lesson's point is right. QE buys Treasuries and agency MBS, and its effect reaches borrowers only through prices. Only the absolute "never" was wrong, so the fix scopes the claim to QE instead of adding history.
- **Siblings:** an `-i -E` grep for `lends? … directly|directly lend|doesn't lend|never lend` across `src/` returns only the edited line. Control: it returns the new line.

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js` lesson 37 §3, one clause each. en: *"— in QE, the Fed doesn't lend to either one directly."* es `con el QE, el Fed no le presta…` (the module already writes `el QE`), ko `QE에서는 연준이…`, zh `在QE中，美联储并不直接…` (`从不` = "never" removed), ja `QEでは、FRBは…`. ko and ja never said "never", only "doesn't". They are scoped too, so that all five languages make the same claim.
- Patcher (node, UTF-8): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. Originals in the scratchpad.
- Generated, not hand-typed: ledger re-marked (ai) for lesson 37 in es/ko/zh/ja, and `npm run readiness -- --write` changed only numbers: en chars 165,205 → 165,213, plus the four translation volumes. Minutes unchanged (175).

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate: 1 FAIL (ledger stale ×4), then 2 FAIL (readiness char counts), both cleared by the generated steps above |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-CkdcC3wE.js`, system Node v24.18.0 |
| Bundle | new clause in **1** asset in each of 5 languages. Old en/es/ko/zh/ja clauses in **0**. Control: the unchanged "The Fed has never taken it below zero." in 1. Nonsense probe 0 |
| Live walk | **not done.** One clause in running prose, +8 en chars |

#### Step 5: adversarial self-check
- **§10.1:** a description of how a policy tool works. No advice. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** nothing added. **§10.2:** no attribution added.
- **Is the new sentence true?** QE is purchases of Treasuries and agency MBS (lesson 37 §1 says so). It makes no loans to households or firms. The 2020 business facilities (Main Street, PMCCF) were 13(3) credit facilities, not QE. So the scoped claim holds even in 2020.
- **Did I swap one overstatement for another?** "doesn't lend … directly" is present tense and scoped to QE, so it says nothing about 1934-58.
- **Completed work / DECISIONS.md:** no archived item touched lesson 37's §3 opening. Nothing in DECISIONS.md covers it.
- **Would a reviewer get my result?** Yes. The archive greps with their control, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** the economy scan's other hits read as true or already measured to me ("The Fed has never taken it below zero", the Baa spread, the 2021-23 hikes, the 1929 → 2008 generation arithmetic). **Not checked:** the money and essentials quiz text and the glossary against the same pattern. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; they are not mine and I did not touch them. My first scan command hung on a stray `cat >` with no input. It left an empty `scan.mjs` in the system temp parent dir; I removed it, and nothing in the repo was affected. **W-10.2 still looks open from here:** this run's prompt still calls the remote "NOT usable". The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed. Run log is at 202,015 b before this entry, below the 250,000 b warn, so W-5.3 does not fire yet.

**Owner-facing, one line:** the QE lesson said the Fed "never" lends directly to small businesses or families. It did lend to businesses directly from 1934 to 1958, so the lesson now says that QE doesn't lend to them directly, which is the point it was making. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-05 (scheduled dev-agent; **a free pick**. The previous run named no residual, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** neither of the previous two runs (lesson 33's prompt, lesson 36's title) was a short-string hand read, and this is a glossary accuracy fix carried into four languages, the shape of the 09-18 Deflation fix. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick is an archived residual named three times and never taken:** the 09-18 entry's *"Glossary `Inflation`: 'When prices rise because spending grows faster than production.' … not wrong, just narrow. Arguable, and not measured this run"* (archive l.52657, repeated at l.52697 and l.52767). I found it by reading all 43 English glossary entries for a definition no run had measured) — **the glossary's Inflation entry now says what inflation is (a rise in the general price level, not a few things getting dearer) and that the spending-outruns-production gap can open from either side: spending surging or production falling.** It gives 1974 as the dated case of the second.

**Step 3.5: the premise, measured with FRED's keyless CSV.** Controls: `NOSUCHSERIESXYZ` → **404** (200 for every real id); `CPIAUCNS` year on year 1980-03 **14.76%** (BLS 14.8) and 2009-07 **−2.10%** (BLS −2.1).
- **The narrowness is real, and it is about which side moves.** 1974 Q4 vs 1973 Q4: real GDP (`GDPC1`) **−1.95%**, nominal GDP **+8.36%**, CPI (Oct/Oct) **+12.06%**. Output *fell* and prices rose 12%. The old sentence covers that only if the reader takes "spending grows faster than production" to include production shrinking, which is the reading the 09-18 note had to supply.
- **Not a broken premise:** 2022 Q2 reads real GDP **+2.34%**, nominal **+10.29%**, CPI **+8.26%**, so the old frame was right as far as it went. I did not use 2021-22 in the text, because how much of it was supply and how much demand is disputed.
- **The definitional half is a textual measurement:** since 09-18, Deflation opens *"A fall in the general price level: prices dropping on average, not just a few things getting cheaper"*, and Inflation had no such clause, so the pair was asymmetric. Nothing elsewhere defines inflation as a general-level rise: `faster than production` hits only this entry and quiz q004's correct option.
- **Kept on purpose:** q004 (*"What causes inflation?"* → *"Spending growing faster than production"*) and its `explain`. The new definition keeps that mechanism, so the quiz key still holds. "Fed targets ~2%." is unchanged (the CPI entry already says the target is set on PCE).

#### What shipped
- `glossary.js` `Inflation.f`, en/es/ko/zh/ja (5 strings). The general-price-level clause reuses each language's own Deflation wording (`nivel general de precios`, `전반적인 물가 수준`, `整体物价水平`, `物価全体の水準`). The `ex` sentence is unchanged.
- en: *"A rise in the general price level: prices going up on average, not just a few things getting more expensive. It happens when total spending grows faster than what the economy produces, whether because spending surges or because production falls: in the year to late 1974, US output shrank about 2% while consumer prices rose about 12%. Fed targets ~2%."* **The figures are Q4/Q4 and Oct/Oct, so the text says "the year to late 1974", not "in 1974":** calendar-1974 average real GDP fell only about 0.5%.
- Patcher (node, UTF-8): dry run, then old ×1 / new ×0 asserted before writing and 0 / 1 after, 5/5. All five read back from the module (en 352 chars, about Deflation's length). Original in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's), before and after |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-DJQfXktw.js`, system Node v24.18.0 |
| Bundle | new 1974 clause in **1** asset in each of 5 languages. Old en and zh definitions in **0**. Control: the unchanged Deflation `ex` in 1. Nonsense probe 0 |
| Live walk | **not done.** Text-only; the entry grows to about Deflation's length, which already renders in the same list |

#### Step 5: adversarial self-check
- **§10.1:** a definition and a dated historical case. No advice, no action. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** one dated figure added (1974), nothing present-tense or live-looking. **§10.2:** no attribution added.
- **Completed work:** the 09-18 Deflation fix is untouched, and this mirrors it rather than redoing it. q004 is not changed, and its key still matches the new definition. **DECISIONS.md:** nothing on glossary wording.
- **Is 1974 cherry-picked?** It is the textbook supply-shock year (the 1973-74 oil embargo), and it is the case the 09-18 note itself named. The sentence presents it as one example of "production falls", not as the usual cause.
- **Would a reviewer get my result?** Yes. The FRED pulls with both controls, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** **the 43 English glossary definitions now read clean for accuracy to me**; the only other narrow ones are simplifications for beginners (Bond's "same fixed payments" ignores floating-rate bonds and TIPS; Dividend's "paid out in cash" ignores stock dividends). Both are arguable and **not picked by default**. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked; not mine, not touched. **W-10.2's second-Mac action still looks open from here** (this run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application). The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the glossary defined inflation only as "prices rise because spending grows faster than production". It now says inflation is a rise in prices on average, and that this can come from spending surging or from production falling, as in 1974, when US output shrank about 2% while prices rose about 12%. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-05 (scheduled dev-agent; **a free pick**. The previous run named no residual, so W-6.2 rule 1 does not arise. **W-9.4 bars a short-string hand read** (the run before last was one), and this is not one: it is a §10.1/§2.3 content fix carried into four languages. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick is an archived residual never taken**: the 2026-09-1x entry's *"L33's thinkAbout … is a leading question sitting against §3's hedge … Not picked by default"* (archive l.48601). Its sibling note, lesson 31's "only way an economy grows", was already fixed on 09-17, so I checked first) — **lesson 33's think-about prompt no longer tells the reader that "assets keep going up" and then asks whether that sounds like the late stage of a debt cycle.** It now names the lesson's own two warning signs. It asks which numbers the reader would look up to check them, and whether households' debt-to-GDP ratio tells the same story as the government's.

**Step 3.5: the premise, measured with FRED's keyless CSV.** Control: a nonsense series id returns **404**, and federal debt in 2007 Q4 reads **62.7%**, which matches the known ~63%.
- **The old prompt's "well past 100%" fits only government debt.** `GFDEGDQ188S` (federal debt/GDP) first crossed 100% in **2012 Q4** and is **122.6%** at 2026 Q1.
- **The household series, which is what lesson 33 actually describes (a family stretching for a mortgage), went the other way.** `HDTGPDUSQ163N` (household debt/GDP) peaked at **100.2% in 2007 Q4** and is **66.6%** now. Lesson 34 already says private debt fell after 2008 while government debt rose.
- So the prompt paired a government-debt figure with a household-borrowing mechanism, and then led toward "late stage". That ran against §3's *"nobody can time it"*. Its middle sentence, *"People feel wealthy because assets keep going up"*, is an undated present-tense market claim, which §2.3's standing rule forbids. It is false in any down year.
- **What survives:** a reflection that applies the lesson to the present. The §71 (d) guard (no "you are here" marker on the figure) still has its reason: the reader is still asked about today, and the figure must not answer for them.

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js` lesson 33 `thinkAbout`. The warning signs reuse each language's own §3 wording. The debt-ratio terms reuse each file's existing term (`ratio de deuda sobre PIB`, `GDP 대비 부채 비율`, `债务/GDP比率`, `債務対GDP比率`). es uses tú, ko 레슨, zh 本课, ja このレッスン, which are the files' existing conventions. **No figure in the new text**, so nothing can go stale.
- **First draft failed `npm test` and that was useful:** the old prompt was §17b's positive control, and it carried `lessonTerms[33]`'s "GDP" and "Debt-to-GDP Ratio" links. The final wording keeps "debt-to-GDP ratio", which is the better question anyway. Each patch asserted old ×1 / new ×0 before writing and the reverse after, with a dry run first. Originals are in the scratchpad.
- `charts.jsx` and `check-data.mjs` §71 (d): two comments and one failure message described the old question. They now describe the new one, and the logic is unchanged.
- Generated: ledger re-marked (ai) for 33 × es/ko/zh/ja; `npm run readiness -- --write` changed en chars 165,070 → 165,205 and words ~28,800 → ~28,900. Minutes did not change.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate: 4 FAIL (§17b control, two lessonTerms links, §10.4), then 1, then 3 generated-figure FAILs, all cleared as above |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-DcIF2e2t.js`, system Node v24.18.0 |
| Bundle | old prompt's distinctive clause in **0** assets in all 5 languages. New clause in **1** each. Control "The Master Signal" 1, nonsense probe 0 |
| `late stage` over `src scripts` | **0** after the edit (was 3: the prompt and the two comments) |
| Live walk | **not done.** Text-only. The prompt grows 76-149 bytes per language, and longer thinkAbouts already render |

#### Step 5: adversarial self-check
- **§10.1:** the new prompt asks what to look up and recommends no action. It answers no "where are we" question, which the old one steered toward. `check-blindspot` passed inside `npm test`. **§2.3 / dates:** one live-looking claim removed, no figure or date added. **§10.2:** "beautiful deleveraging" in lesson 34 is untouched, and so is item 158 (the Buffett quote).
- **Completed work:** the 2026-08 fix that replaced "about 120% in 2026" with "well past 100% in recent decades" is not undone. This change goes further in the same direction (no figure at all). §71's guard is kept, and only its prose changed.
- **DECISIONS.md:** its thinkAbout mentions (l.287, 492, 503) are about translation scope and term chips. The chips still resolve, which `npm test` proves.
- **Would a reviewer get my result?** Yes. The FRED pulls with both controls, the patch assertions, `npm test`, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. They are not mine, and I did not touch or commit them. This run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application, so **W-10.2's second-Mac action still looks open from here.** The translations are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 33's closing question said "assets keep going up" and asked whether that sounds like the late stage of a debt cycle. It mixed government debt with the household borrowing the lesson describes, and household debt has actually fallen since 2008. It now asks which numbers you'd check, and whether households and the government tell the same story. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-05 (scheduled dev-agent; **a free pick**. The previous run named no residual, so W-6.2 rule 1 does not arise. **W-9.4 bars a short-string hand read** (the previous run was one), and this is not one: it is an English accuracy fix carried into four languages, the shape of W-10.1 and lesson 14. The 0 FAIL / 1 WARN baseline is the previous entry's reading; **I did not re-run `npm test` before editing**, only after) — **lesson 36 is no longer titled "The Yield Curve: Crystal Ball". It is now "The Yield Curve: A Warning Light", in all five languages.** The old title promised foresight that the lesson itself disclaims.

**How the pick was reached: an English audit of all 46 quiz answer keys, which came back clean.** Lesson 14's q028 had a wrong key for two months, and no log entry records a pass over every key, so I dumped `quizMeta` × `quizText.en` (correct option marked) and read each question for a wrong key or a defensibly true distractor. **None found.** Re-derived arithmetic: q025 (0.05% vs 1.05% fee, 30 y at 7% gross): **24.5%** of the ending balance lost, "roughly a quarter" holds. q032: 2,000 × 1.06¹⁰ = **3,581.7**, so "$1,580 / $3,580" holds. The car-loan gap in essentials (6% vs 14%, $20,000, 5 y) is **$4,722**, "about $4,700" holds. Priya/Tom at 6% are **$398,298 / $401,808**, "within about 1%" holds. The q003 "5-8 years" key and the q007 "prints money" wording are recorded in the archive as arguable (09-13, 09-18), so I left both. **This scan is a negative result, recorded so the next run does not repeat it.** I then read the 44 lesson titles and subtitles, and the one that overclaims is lesson 36's title.

**Step 3.5: the premise, against the lesson's own text.** The lesson body says the signal works through "expectations, not magic", calls it "one input, not a standalone forecast", says it "isn't infallible", and its thinkAbout points out the 2022 inversion with no recession after it. The glossary and q006 say the same: every recession since 1955 was preceded by an inversion, but not every inversion was followed by one. **A crystal ball is the one thing all of that says the curve is not.** Search: `Crystal Ball|bola de cristal|수정 구슬|水晶球|水晶玉` over `src scripts public *.md index.html` found **2 sites**: the `lessons.js` title (5 languages, the known hit and the control) and a comment in `LessonVisual.jsx`. Cross-references cite only the title head before the colon (`check-data` §16b, l.1891), and "The Yield Curve" is unchanged. **The subtitle, "A historically reliable recession predictor since 1955", stays.** The 09-12 lesson-36 run ruled it the lesson's thesis and asked that no run hedge it.

#### What shipped
- `lessons.js` lesson 36 title: en **"A Warning Light"**, es **"una luz de advertencia"** (es lesson 39 already uses *luz de advertencia*, and sentence case per 09-29), ko **경고등**, zh **警示灯**, ja **警告灯**. `LessonVisual.jsx`'s comment now matches.
- Patcher: 2 old/new pairs, old ×1 / new ×0 asserted before writing, old ×0 / new ×1 after, dry run first. Originals are in the scratchpad.

#### Verification
| check | result |
|---|---|
| `npm test` (after the edit) | **exit 0, 0 FAIL, 1 WARN** (O-3's). The title gains one word in en; `minutes` and the readiness figures did not move |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-BrxUv9Ai.js`, system Node v24.18.0 |
| Bundle | 5 old titles in **0** assets. 5 new titles in ≥1 each (es in 2, because lesson 39's es chunk already says *luz de advertencia*). Control: "The Master Signal" in 1. Nonsense probe 0 |
| Live walk | **not done.** A title 3-11 characters longer per language. Lesson 8's title (85 chars) already renders in the same list |

#### Step 5: adversarial self-check
- **§10.1 / §10.2 / §10.3 / dates:** a title noun swap. No advice, attribution, figure or date was added. `check-blindspot` runs inside `npm test` and passed.
- **Is "warning light" an overclaim too?** A warning light says "check this", not "this will fail", and the body says "a real warning sign" twice. That is the claim the lesson makes.
- **Completed work / DECISIONS.md:** this keeps the protected subtitle and changes no ruled-on text. DECISIONS.md does not mention lesson titles.
- **Would a reviewer get my result?** Yes. The patcher assertions, the site search with its control, `npm test`, the build and the bundle probes all re-run. The one limit is the missing pre-edit `npm test`, stated above. No conflict found.

**Seen, not fixed:** `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. They are not mine, and I did not touch or commit them. This run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application, so **W-10.2's second-Mac action still looks open from here.** The ko/zh/ja/es titles are machine-written (**O-3**). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the yield-curve lesson was titled "Crystal Ball", while the lesson itself says the signal is not a sure forecast. It is now "A Warning Light" in all five languages. A check of every English quiz answer found no other wrong answers. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-05 (scheduled dev-agent; **a free pick**. The previous run named no residual of its own, so W-6.2 rule 1 does not arise. **W-9.4 allows a short-string pass:** neither of the previous two runs (W-10.1, lesson 14) was one. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick is a residual named twice and never taken:** the 10-02 `moneyVisuals.js` entry's *"ko quiz text calls a lesson 강의 (14 uses), while the UI says 레슨"*, declined that day under W-9.4, and the 10-04 entry's *"ko keeps 강의 and ja keeps この講 in thinkAbout"*) — **Korean and Japanese now use one word for "lesson" everywhere the app refers to its own lessons: 레슨 and レッスン, the words the UI, the economy track and the figures already use.** 47 sites across 7 files. No meaning changed.

**How the pick was reached.** I first extended the 10-04 run's question ("which absolute claims are false in practice?") from essentials to money, economy, the quiz and the glossary. It found nothing new. Every hit was a worked example, already hedged, or already measured: the glossary's "more than four years later" (measured 09-19 and worded so a later recession cannot falsify it), the raise/take-home claim (it says take-home pay, and the Taxes lesson carries the benefits-cliff hedge), and lesson 40's three rules (unattributed and ruled on under §10.2; q008 is class B, O-3's). I also re-derived lesson 9's amortization crossover from the annuity formula: about month 242 at 7% and month 83 at 3%, which matches "around year 20" and "around year 7". **That scan is a negative result and is recorded so the next run does not repeat it.**

**Step 3.5: the premise held, and it was larger than named.**
- **The standard, measured:** `src/locales/ko.js` uses 레슨 16 times and 강의/수업 0 times. `ja.js` uses レッスン 14 times. The economy track, `moneyVisuals.js` (fixed 10-02) and `policyScenarios.js` agree.
- **The sites (all of `src/`):** ko **강의 ×24** (quiz 14, essentials 6, money 3, economy 1) and **수업 ×2** that mean this app's lesson (essentials *"What that lesson didn't say"*, money *"This is not a lesson about blame"*). ja **この講 ×18** (quiz 14, essentials 4), **本講 ×1**, and **の講 ×2** in money. The named residual said "14 uses". That was the quiz alone; it is 47 in total.
- **Kept on purpose:** two money-track 수업 and two ja 授業 mean a *school* class ("the class that taught you what a paycheck's deductions were"). That is the right word there. ja `この回復` ("this recovery") and `前回` ("last time") were regex hits only. zh uses 课/本课 consistently, which is idiomatic, so it is not touched.
- **Control:** the same scan finds the 16 known 레슨 in `ko.js` and the 2 school-class 수업, so it reads the files.

#### What shipped
- **Korean:** 강의 ends in a vowel and 레슨 ends in a consonant, so the particles change: 는→은, 가→이, 를→을. 에/의/들 do not. Pairs were split by particle, and every changed phrase was read by hand afterwards. One quiz stem, *"패턴을 강의는 무엇이라고"*, had no 이 before it and now reads *"이 레슨은"*, like the other thirteen.
- **Japanese:** no particle changes. 本講では → このレッスンでは.
- **Generated:** `npm run readiness -- --write` changed one figure, ja 77,614 → 77,636 chars in LAUNCH_READINESS §10.4. That +22 matches the arithmetic (4 × +3, +4, +3, +3). Korean is length-neutral, and quiz text is not counted.
- **Ledger:** not touched. `translation-review.mjs` hashes the English source, so ko/ja edits cannot make a record stale.
- **Patcher:** 16 old/new pairs, each asserted old ×k before writing and old ×0 / new +k after, dry run first.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate: 1 FAIL (§10.4 translation-volume sentence), cleared by the generator above |
| §65 (W-10.7 test ii) | **en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6%** longest, shortest 2.2/2.2/0.0/4.3/2.2: **identical to the 10-04 reading.** Only stems changed, never options |
| Leftovers | `강의\|この講\|本講\|の講` across `src/`: **0**. Wrong particles `레슨[는가를로]`: **0**. The same grep finds the 5 known `이 레슨은` in `quizText.ko.js` |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-DlvL7_R9.js`, system Node v24.18.0 |
| Bundle | この講, 本講, 강의 in **0** assets. このレッスンによると, 이 레슨에 따르면, 탓하려는 레슨이, 責めるためのレッスン in ≥1 each. Nonsense probe 0 |
| Live walk | **not done.** It is a same-length noun swap in running text; no label or button changed |

#### Step 5: adversarial self-check
- **§10.1 / §10.2 / §10.3 / dates:** a noun swap. No claim, figure, date or advice wording was added or changed.
- **Did a swap change meaning?** 강의 also means "lecture". Each of the 24 refers to this app's lesson (이 강의에 따르면 = "according to this lesson"), so 레슨 is a straight synonym swap. The two 수업 that mean a school class were checked against the English and left alone.
- **Completed work:** this extends the 09-28 `src/locales/` fix and the 10-02 `moneyVisuals.js` fix to the same class on the remaining surfaces. It undoes neither.
- **DECISIONS.md:** nothing touched.
- **Would a reviewer get my result?** Yes. The patcher assertions, the leftover and particle scans with their control, `npm test`, §65, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** `scripts/fix-agent-skill.mjs` (dated 2026-10-04 18:05) and `Migration/` and `UIUX/` are still untracked. They are not mine, and I did not touch or commit them. A mid-run `git status | head -10` cut the script from view, and I nearly logged it as gone; the full listing shows it is still there. This run's prompt still calls the remote "NOT usable" and `economic-cycles-v5.jsx` the main application, so **W-10.2's second-Mac action looks still open from here.** The 10-02 entry's numeral-particle style note (`$10,000를`) is still a style call, not an error. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** in Korean and Japanese, the quiz and some lessons called a lesson by a different word ("lecture") from the rest of the app. All 47 now match the app's own word. Still waiting on you: **O-2** (analytics account) and **O-3** (a fluent review, or cap or re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-04 (scheduled dev-agent; **a free pick**. The previous run (W-10.1) named no residual, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** this is a legal-accuracy fix carried into four languages, the same shape as W-10.1, not a short-string hand read. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit. **The pick came from extending W-10.1's question ("which absolute claims in essentials are false in practice?") to the rest of the track.** A scan of `lessonContent.essentials.en.js` for `always|never|every|guarantee|can't…` turned up lesson 14's *"The account's own beneficiary designation wins, every time"*) — **the estate-planning lesson's quiz marked the wrong person as the answer. q028 asked who gets a 401(k) when someone divorced, remarried and left the old form naming the ex-spouse, and its key said "the ex-spouse". Under federal law the current spouse usually gets it.** The lesson's think-about prompt asked the same question.

**Step 3.5: the premise held, and it was bigger than the sentence.**
- **The law, from primary sources:** 26 U.S.C. §401(a)(11)(B)(iii) lets a 401(k) skip the survivor-annuity rules only if it pays the full balance to the **surviving spouse**, unless that spouse consents under §417(a)(2) (in writing, witnessed by a plan representative or notary). §417(d) lets a plan exclude a spouse married under one year. A form naming the ex, signed before the remarriage, carries no consent from the new spouse. **So in q028's scenario the new spouse usually takes the 401(k), which was distractor 1.** Separately, *Sveen v. Melin* (2018) records **26 states** with UPC §2-804-style statutes that revoke an ex-spouse's designation on divorce. Those apply to life insurance and IRAs, not to ERISA 401(k)s (*Egelhoff*, 2001).
- **The sites:** `beneficiar` across `src/` hits lesson 14 (5 langs), `quizText.*` q028 and `lessons.js` (title only). Control: the same grep returns the lesson title, a known hit. **Never examined:** `AGENT_LOG.md`, the archive and `CLAIMS.md` contain 0 matches for `ERISA|spousal consent|revocation|Egelhoff|2-804|Sveen`. The 08-06 run that wrote the lesson and the 09-22 run that finished its translation both took the precedence rule as given.
- **What survives:** the teaching point is right. A will can't redirect an account that has its own beneficiary form, and the forms don't update themselves. Only the absolute claim "the form wins, every time" and the remarriage scenario were wrong.

#### What shipped (15 files, 5 languages)
- **Lesson 14 ¶1:** "wins, every time…" → "A more recently written will that says something different doesn't change that." The will-can't-override claim is true, so it stays.
- **Lesson 14 ¶2:** names the two backstops: federal law usually gives a 401(k) to a current spouse unless they gave up the right in writing, and about half of US states cancel an ex-spouse's designation after divorce for some accounts. It then says they vary and don't cover every case, so in most situations the form still decides.
- **Takeaway:** "gets it" → "usually gets it".
- **thinkAbout:** a never-married person, life insurance naming their mother, and a will leaving everything to a long-term partner. That echoes §0's unmarried-couple point, and no backstop applies: there is no spouse and no divorce.
- **q028:** a never-married person, a 401(k) naming their father, and a will leaving everything to two children. The answer index stays 0, so `quizMeta.js` is untouched. The new `explain` names both backstops and says why neither applies. es `explain` had no "which is why" clause before, so none was added.
- Generated, not hand-typed: lesson 14 `minutes` 3 → 4 (`check-data` §2 FAIL). Ledger re-marked (ai) for es/ko/zh/ja. `npm run readiness -- --write`: 174 → 175 min, plus 164,634 → 165,070 chars and words ~28,700 → ~28,800 in LAUNCH_PLAN, LAUNCH_READINESS and the CLAIMS A6 cell, all numeric.
- Patcher: 50 old/new pairs split/join, each asserted old ×1 / new ×0 before writing and old ×0 / new ×1 after, dry run first.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate: 2 FAIL (minutes; §10.4 ledger drift), both cleared by the generated steps above |
| §65 (W-10.7 test ii) | longest-option **en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6%** (was 39.1/37.0/37.0/34.8/32.6). **None rose, en and es fell**: the old correct option was the longest in en. Shortest 2.2/2.2/0.0/4.3/2.2, unchanged |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-Brh6EhLs.js`, system Node v24.18.0 |
| Bundle | "wins, every time" and "The ex-spouse, because" in **0** assets. The new en/es/ko/zh/ja phrases are in **1** asset each. Nonsense probe returned 0 |
| Live walk | **not done.** Text only; the q028 options are shorter than before in every language |

#### Step 5: adversarial self-check
- **§10.1 advice:** the lesson's own "isn't a specific instruction" paragraph is untouched. The new text describes what the law does and tells no one whom to name or what to sign. **Dates / figures:** "about half of US states" is the one count. Its source is 26 as of 2018; a few states either way would not make "about half" wrong.
- **Is the new key right?** Never married means no §401(a)(11) spouse. No divorce means no revocation statute. Children have no forced share of a 401(k) or of a life insurance payout. So the form governs, and the father (q028) and the mother (thinkAbout) are correct.
- **Is a distractor now true?** "The children, because the will is newer" is false: the will doesn't control the account. Split evenly and the provider choosing are false.
- **¶2's ex-spouse example:** for a 401(k) with no remarriage, *Egelhoff* means the ex usually still takes it, so the lesson's "common mistake" framing stays accurate.
- **DECISIONS.md / completed work:** this keeps the 09-22 item-94 restoration (§0¶2) and the will-vs-form sentence it protected. No archived item is undone.
- **Translations:** machine-written, **O-3**. ko keeps 강의 and ja keeps この講 in thinkAbout; those are the existing wording and out of scope here.
- **Would a reviewer get my result?** Yes. The patcher's assertions, the grep scan and its control, `npm test`, §65, the build and the bundle probes all re-run. No conflict found.

**Seen, not fixed:** `scripts/fix-agent-skill.mjs` appeared **untracked** during this run. I did not create it, and I did not touch it or commit it; it is probably the owner's W-10.2 follow-up. This run's own task prompt still says the remote is "NOT usable" and that `economic-cycles-v5.jsx` is the main application. **That is W-10.2's predicted state on this machine**, so its remaining owner action is still open. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 14's check question used to say that after a divorce and remarriage, an old 401(k) form still sends the money to the ex. Federal law usually gives it to the current spouse, so the lesson now says so and the question uses a case where the form really does decide. Still waiting on you: **O-2** (analytics account) and **O-3** (fluent review, or cap/re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-04 (scheduled dev-agent; **W-10.1, the weekly review's one priority content pick**. That is a named pick, not a residual, so W-6.2 rule 1 does not arise. **W-9.4 does not bind:** this is a fact fix carried into four languages, not a short-string hand read. `npm test` showed **0 FAIL, 1 WARN** (O-3's) before any edit) — **the brokerage lesson no longer says uninvested cash doesn't grow. It now says many brokerages sweep that cash into a bank deposit or money market fund that pays interest, at rates from near zero to near a savings account, and that it is still cash, not an investment.**

**Step 3.5: the premise held, and it was one site short.**
- **The fact:** the defaults are Fidelity SPAXX ~4%, Vanguard VMFXX ~4% and Schwab's bank sweep ~0.05-0.5% (web search, 2025-26 comparison pages). At the two largest defaults, a learner would see their cash earn about 4%.
- **The sites:** W-10.1 named four. The instrument (every non-translated `src/` file, `/uninvested/` and `/brokerage…(grow|earn|interest)/`) found a **fifth**: §3's revenue paragraph said the brokerage *"keeps the interest"*. That is absolute too. The brokerage keeps the part it does not pay the customer. Control: the same scan returned the q027 stem and the §3 sentence, both known hits.
- **Already hedged:** body ¶2 already said *"usually doesn't earn much, if anything"*. That is still wrong at the 4% defaults.
- **A sixth problem, in the quiz:** q027's first distractor, *"automatically grows through the account's own compound interest, just like a savings account"*, is roughly **true** at Vanguard and Fidelity. Hedging only the correct option would have left the question with two defensible answers. So that distractor was replaced too.

#### What shipped (12 files)
Lesson 13 (`lessonContent.essentials.{en,es,ko,zh,ja}.js`), four sites per language:
- ¶1: "only starts working once…" → "nothing is invested until…".
- ¶2: sweep sentence, as above.
- §3: "keeps whatever part of that interest it doesn't pass on to the customer".
- `takeaway`: "only grows once" → "isn't invested until".

`quizText.*.js` q027:
- New correct option: *"It stays as cash, possibly earning some interest, until the owner buys an investment"*.
- New first distractor: *"It's sent back to the owner's bank account automatically if it isn't invested within a month"*.
- `explain` now names the sweep.

`explain` was checked as a full sentence in all five languages first (item 160's rule). Answer index is unchanged at 3, so `quizMeta.js` is untouched. Glossary wording was reused: es *fondo del mercado monetario*, ko 머니마켓펀드, zh 货币市场基金, ja MMF. A Node patcher asserted every old ×1 / new ×0 before writing and old ×0 / new ×1 after (split/join, no `$` replacer).

Generated knock-ons, nothing typed by hand:
- `translation-review-ledger.json`: lesson 13 re-marked (ai) in es/ko/zh/ja after the English edit made it stale. I wrote each changed paragraph against the new English; the rest of the lesson is unchanged since its 09-19 review.
- `npm run readiness -- --write`: two numeric lines (164,424 → 164,634 en chars; LAUNCH_PLAN §4.0 ~164,000 → ~165,000).

| lang | option lengths after (d1/d2/d3/correct, code points) | correct strictly longest? |
|---|---|---|
| en | 92/74/64/84 | no |
| es | 98/75/66/89 | no |
| ko | 34/26/27/33 | no |
| zh | 24/19/19/22 | no |
| ja | 31/30/27/30 | no (ties d2) |

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's). Intermediate run: **2 FAIL**. (1) `lessonTerms[13][0]` "Savings Account": my first en wording said "savings-account rates", which the link check does not match; reworded to "what a savings account pays". (2) §10.4 ledger drift, cleared by the mark + readiness write |
| §65 (W-10.7 test ii) | **en 39.1 / es 37.0 / ko 37.0 / ja 34.8 / zh 32.6%** longest-option, shortest 2.2/2.2/0.0/4.3/2.2: **identical to the 2026-10-04 reading in every language** — the distractor swap gave no tell back |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-DOqUh5A2.js`, system Node v24.18.0 |
| Bundle | 4 old en phrases in **0** assets; new en/es/ko/zh/ja phrases in **1** each; nonsense probe 0. "within a month" matched 2 assets: the new distractor + an unrelated economy sentence (checked) |
| Live walk | **not done.** All text, the q027 options are in band, and no layout element changed |

#### Step 5: adversarial self-check
- **§10.1 advice:** names no firm and does not say where to keep cash. It describes what happens by default. `check-blindspot` passed. **Dates/market figures:** no rate figure is in the app, only "close to nothing … near a savings account", so nothing goes stale when rates move.
- **Is the new answer right everywhere?** A sweep into a money market fund is technically a fund purchase. The lesson and the option treat it as cash, which matches standard usage (a "cash position"/"core position"), and d2's "diversified index fund" stays false.
- **Is the new distractor ever true?** Not as a general rule at US brokerages.
- **DECISIONS.md / completed work:** this keeps the 10-04 q027 fix's own teaching point (the deliberate step) and undoes no archived item.
- **Translations:** machine-written, **O-3**.
- **Would a reviewer get my result?** Yes: the patcher asserts, scan + control, `npm test`, §65, build and bundle probes all re-run. No conflict found.

**Seen, not fixed:** the q027 stem still says "What *generally* happens", which is fine. W-10.2's point stands: this task's SKILL.md still calls `economic-cycles-v5.jsx` the main application and the remote "NOT usable". Owner edit; I did not touch it. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** lesson 13 used to tell learners their uninvested brokerage cash doesn't grow. At Fidelity and Vanguard it earns about 4% by default, and the lesson now says so without naming firms. Still waiting on you: **O-2** (analytics account) and **O-3** (fluent review, or cap/re-affirm the Beta languages).

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-04 (scheduled dev-agent; **a free pick**: the previous run's "Seen, not fixed" called the 16 past-due §9.1 rows *"a whole run of its own and a separate pick, not a residual of this one"*. **W-9.4 does not bind:** this is a register audit, not a short-string hand read. `npm test` showed **0 FAIL, 17 WARN** before any edit (O-3's + 16 past-due claim rows)) — **§9.3 audit question 4, a day late: all 16 rows re-measured and re-dated to 2026-11-07. Two rows had cited a blocker that closed on 2026-09-05, so they were wrong for 29 days.**

**Step 3.5: the premise broke.** The rows' shared premise was "blocked on item 18: `analytics.js` sends nothing anywhere", and C1 said "no web deploy". Re-measured: `analytics.js` has 1 `fetch(` and 5 `sendBeacon` (A1 recorded **0**). Item 18's transport shipped on 2026-09-05 (`9e00f95`), and O-1's deploy closed the same day. The rows still cannot be measured, but the reason is now **O-2** (an owner account and key), not missing code. Checked in the bundle the live site serves: `provider:"none"` appears ×1, `provider:"posthog"` / `"plausible"` / `phc_` ×0. Control: the PostHog host string appears ×2 in that file. So no event leaves any device today.

#### What shipped (1 file, no source change)
`CLAIMS.md`:
- A new *The 2026-10-04 review* section, written once, with the shared reason for the date.
- The "How to read a row" blocker sentence now says O-2.
- Five `Measurable today` cells now read "No — O-2 …", and C2's names O-2 and the existing deploy.
- 16 Check cells moved 2026-10-03 → **2026-11-07** (the next first Saturday). A3's 2026-10-16 is untouched.
- Each of the 16 rows starts with a row-specific "Reviewed 2026-10-04" finding. Earlier text is kept, and A1's stale measurement is labeled out of date rather than deleted.

The row-specific findings:
- **A6:** recounted 44 lessons and 174 min.
- **A7:** the simulator's host set is still `[35]`, with 2 scenarios. Control: `(29)` returns 0.
- **B1–B4:** no payment code. "paywall", "stripe" and the other payment terms appear only in comments, and `PAYWALL_VIEWED` is fired nowhere. Control: `lesson_started`'s call site was found.
- **C1:** "no web deploy" corrected. Clips: none recorded, and that comes from a local search only.
- **D2:** new instance (4). Both checks passed while A1 and C1 were stale.
- **D3:** since 2026-09-05, 22 entries say a premise broke and 38 say one held. Both are floors. Controls: 236/236 and 0.
- **D1:** I counted no new instances. My pattern found 0 and had no positive control, so the 0 is reported as meaning nothing.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, **0 FAIL, 1 WARN** (O-3's only; was 17). One intermediate FAIL: §26 flagged a deployed-bundle filename I had cited as if it were a repo path. I removed the filename and re-ran |
| `check-claims` control | `CLAIMS_TODAY=2026-11-08` → 17 past-due WARNs (16 + A3); `=2026-10-17` → A3 only. The warning still fires |
| Patcher | each edit asserted ×1, the date pass asserted 16 cells, the item-18 cells 5, "Not yet live" 4 |
| `refresh-readiness --check` | 13 generated figures agree, CLAIMS.md included |
| `check-deployed` | live site reached, 404 control fired. **DIVERGED** (the live bundle is older than HEAD), which W-8.1 already tracks |
| Build | **not run:** no file under `src/` changed |

#### Step 5: adversarial self-check
- **Is moving 16 dates the "soft restatement" §9.1 forbids?** No. No threshold or claim text changed. Every row records what was measured and why its date moved. The two refuted-adjacent rows (D1, D2) stay REFUTED.
- **Blindspot register / DECISIONS.md / completed work:** no content, advice, date or market figure touched. I did not change A1's locked-link decision (option (a)). Nothing archived is undone.
- **Would a reviewer get my result?** Yes: the greps, the live-bundle curl, `m.mjs`'s lesson and scenario count, `npm test` and both `CLAIMS_TODAY` controls all re-run. One soft spot is stated in the row: the D3 counts are pattern floors.

**Seen, not fixed:** the backlog's own item-18 / O-2 text was not audited here. `LAUNCH_PLAN.md` §9.1 says the register holds "17 claims". There are 17 rows, so that figure holds. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** every claim the app is trying to test is still waiting on **O-2**, one analytics account and one pasted key. The code to send events has been live since 2026-09-05. Also still open: **O-3**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-04 (scheduled dev-agent; **the previous run's named residual, `q027`** (item 160, class A). The previous run was a free pick, so W-6.2 rule 1 allows this; **the next run may take a residual of this one only once more.** **W-9.4 does not bind:** this is a quiz-design fix measured by §65, not a short-string hand read. `npm test` showed **0 FAIL, 17 WARN** before any edit: O-3's, plus **16 new §9.1 claim rows past their 2026-10-03 check date** (not caused by this run; see "Seen, not fixed")) — **lesson 13's check question no longer gives its answer away by length. In Korean the correct option was twice as long as any distractor.**

**Step 3.5: the premise broke, and in the direction that mattered.** The previous run called `q027` "6%, near the 3% no-human-eye corollary" and said a run should weigh that before taking it. Re-measured per language in code points: **en 6%, es 7%, ko 100%, zh 61%, ja 53%.** The 6% was the **minimum** across languages, so the ranking item 160 uses put the **loudest remaining CJK tell** at the bottom of the queue. Control: the same script on `q034` reproduces the previous run's landings exactly (en 46 in [33,50], ko 24 in [21,29], …). **Class A holds:** the excess was the tail "— buying an actual investment is a separate, deliberate step", which `explain` already says in all five languages, and lesson 13's body says it word for word in en.

#### What shipped
One string per file, five files (`src/content/quizText.{en,es,ko,zh,ja}.js`). A Node patcher asserted old ×1 / new ×0 before writing and old ×0 / new ×1 after. Deleting the tail alone would have made the en option **40 chars against a floor of 64**, strictly shortest (the inverse tell), so each option was re-worded to say *what* the cash stays as instead of *why*:
| lang | new correct option | len | band |
|---|---|---|---|
| en | It stays as uninvested cash and generally doesn't grow until the owner buys something with it | 93 | [64,95] |
| es | Se queda como efectivo sin invertir y generalmente no crece hasta que el dueño compre algo con él | 97 | [66,99] |
| ko | 투자하지 않은 현금으로 남아 보통 불어나지 않는다 | 27 | [26,28] |
| zh | 它作为未投资的现金留在那里，通常不会增长 | 20 | [19,23] |
| ja | 何かを買うまで未投資の現金のまま置かれ、通常は増えない | 27 | [26,30] |

**Tightest cells: en and es, 2 below the ceiling; ko ties one distractor at 27**, which is not strictly longest.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL; WARN set identical before and after (O-3's + 16 §9.1 date rows), read from files |
| §65 after | longest-option **en 39.1%, es 37.0%, ko 37.0%, zh 32.6%, ja 34.8%** (before 41.3/39.1/39.1/34.8/37.0): one question fewer in every language. Shortest-option unchanged at 2.2/2.2/0.0/2.2/4.3 |
| Per-language margin after | en −2%, es −2%, ko −4%, zh −13%, ja −10% |
| Build | `scripts/build-out-of-tree.sh` **exit 0**, `index-BtfZ4zWt.js`, system Node v24.18.0 |
| Bundle | each old option (en/es/zh/ja by its opening, ko by its tail) in **0** assets; new en/es/zh/ja/ko options in **1**; a nonsense probe in 0. "separate, deliberate step" survives in 1 asset: lesson 13's body (`lessonContent.essentials.en`), as intended |
| Live walk | **not done.** Every new option is shorter than the one it replaces |

#### Step 5: adversarial self-check
- **Blindspot register:** no advice, date, market figure or Dalio content; `check-blindspot` passed in `npm test`. **DECISIONS.md / completed work:** continues item 160 under its own rule (check `explain` first, land inside the band, mind both walls) and undoes nothing archived.
- **Is the answer still right?** Yes, and no less hedged: "generally" is kept, so it does not claim uninvested cash never earns anything (some brokers sweep it into interest-bearing accounts). "Until the owner buys something" keeps the deliberate-step point. **Could the edit be wrong?** es/ko/zh/ja wording is machine-written and no fluent reader has seen it (**O-3**).
- **Would a reviewer get my result?** Yes: the margin script, patcher asserts, §65, build and bundle probes all re-run. No conflict found.

**Seen, not fixed:** ⚠️ **16 §9.1 claim rows (A1, A2, A4–A8, B1–B4, C1, C2, D1–D3) passed their check date yesterday**, each WARN saying "look at it, then either record the result or move the date WITH a reason". That is a whole run of its own and a separate pick, not a residual of this one. **Owner-relevant:** item 160's min-margin ranking under-ranks CJK-only tells; a per-language re-rank is the next honest look at class B. **W-8.1 still applies:** committed, **not deployed**.

**Owner-facing, one line:** in lesson 13's check question, the right answer was always the longest one (twice the length in Korean); it is now trimmed in all five languages. Still waiting on you: **O-2's analytics account**, and **O-3: fund a fluent review of one language, cap what ships under "(Beta)", or re-affirm it.**

**Schedule:** the cron is the owner's lever; not read, not touched.
