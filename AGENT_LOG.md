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

### 2026-10-17 (scheduled dev-agent; named item 160, class B) — quiz q001 ("What drives the economy?") gets three distractors Lesson 29 contradicts, so its answer is no longer the longest option, or the only one in parentheses. Five languages.

Rules: W-6.2 ok (open numbered item; the previous entry's "Seen, not fixed" was empty). W-9.4 n/a. Baseline `npm test` before editing: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.**
- Instrument rebuilt (`scratchpad/rank.mjs`: relative margin (correct − longest distractor) / longest distractor, code points, per language). **Controls:** 2x → 1.000, +1 of 100 → 0.010. **Positive control:** strict-longest counts reproduce §65 exactly (en 34.8 / es 32.6 / ko 34.8 / zh 30.4 / ja 32.6).
- **Held:** `q001` tops the ranking at en 29% / es 30% / **ko 117% / zh 100%** / ja 67%, as item 160 said. It is class B: the answer *"Total spending (money + credit)"* is already a bare phrase, against *"Only government spending"*, *"Gold reserves"*, *"Stock prices"*.
- **The item understated it slightly:** the answer was also the only option with a parenthesis and a `+`, a second visual cue alongside length.

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js` q001 distractors, worded to match each language's L29 text. Each is something L29 contradicts:
  - *"Only what the government spends"*: L29 says households buy about two thirds, more than three times all government.
  - *"Cash spent (credit doesn't count)"*: L29 says credit spends exactly like money. Same parenthesis form as the answer.
  - *"Prices sellers decide to set"*: L29 says prices come *from* spending (total spent ÷ quantity sold).
- The answer, its index (2) and `explain` are unchanged. The explain (*"Spending = money + credit"*) already refutes the second.
- Lengths, distractors / answer: en 31/33/28 / 31; es 29/39/36 / 30; ko 9/14/11 / 13; zh 7/11/9 / 10; ja 9/14/9 / 10. Not strictly longest or shortest anywhere.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/patch.mjs`, scoped to q001's `opts`: per file old ×1 / new ×0 before, U+FFFD ×0; a repeat refuses (exit 1). `git diff --stat`: 5 quiz files, 15+/15− |
| Rank after | q001 out of the top 12. §65's own figures in the next row agree with the instrument |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). **§65 longest: en 32.6 / es 30.4 / ko 32.6 / zh 28.3 / ja 30.4** (each −2.2), shortest unchanged 2.2/2.2/0.0/2.2/4.3 |
| Guard sees the file | planted *"You should buy stocks now."* as a q001 option → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-BE50B4X4.js`, system Node v24.18.0 |
| Bundle | 7 new probes (en ×3, es, ko, zh, ja) each in 1 asset; old `Gold reserves` / `Only government spending` / `黄金储备` → 0; the answer → 1; nonsense → 0 |
| Live | not run: the quiz draws its order, so q001 is checked by bundle, as the q008 entry did |

#### Step 5: adversarial self-check
- **"Also true"?** Sellers do post prices, so the third distractor is the closest call. But the question asks what *drives* the economy, and L29 teaches prices as an output of spending in all five languages. The other two each contradict one L29 sentence directly.
- **§10.1:** none of the new options is advice. Diff grep `dalio|bridgewater|should buy|you should|recommend|buy now` → 0, and `check-blindspot` passes. §10.2: the money + credit framing in L29 and the answer is untouched, and nothing quoted was added. §10.3 untouched.
- **Inverse tell / position:** shortest-option rates unchanged; answer index unchanged, so §3's spread is unchanged.
- **Prior work / decisions:** follows O-3's 10-10 record and item 160's class-B note. It doesn't redo the q008 run. **No conflict found.**

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the first quiz question could be answered by picking the longest option, the only one with a parenthesis. Its wrong answers are now ideas Lesson 29 argues against. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-17 (scheduled dev-agent; named item 160, class B) — quiz q008's three one-phrase slogans are replaced by distractors Lesson 40 itself contradicts, so its answer is no longer the longest option in any language. Five languages.

Rules: W-6.2 ok (open numbered item, per W-11.2: the previous entry's "Seen, not fixed" was empty); W-9.4 n/a. Baseline `npm test` before editing: exit 0 / 0 FAIL / 1 WARN (O-3's).

**Step 3.5: the premise, measured.**
- Item 160 parks its remainder as class B, "distractor prose in four unreviewed languages… O-3's", and W-10.3 repeats that. **That premise broke on 2026-10-10:** O-3 closed with option (a) re-affirmed (`DECISIONS.md` § Machine-translated lesson content). Since then runs have shipped new prose in all five languages routinely. Nothing recorded the unblock, so class B sat idle for a week.
- Instrument: `scratchpad/rank.mjs` ranks every question by relative margin, (correct − longest distractor) / longest distractor, in code points, per language. **Controls:** a 2x option scores 1.000, +1 of 100 scores 0.010. **Positive control:** its strict-longest counts reproduce §65 exactly (en 37.0 / es 34.8 / ko 37.0 / zh 32.6 / ja 34.8).
- **`q008` is still the largest tell: en 111%, es 133%, ko 77%, zh 57%, ja 100%.** Its answer (*"Don't let debt rise faster than income"*, 38) sat against *"Always buy stocks"*, *"Never borrow money"* and *"Save 50% of income"* (17-18). There was nothing to trim, so the fix is new distractors.

#### What shipped
- `quizText.{en,es,ko,zh,ja}.js` q008 distractors, worded to match each language's L40 text. Each one is something the lesson contradicts, so none is "also true":
  - *"Let income rise faster than productivity"*: the reverse of L40's Rule 2.
  - *"Borrow more whenever interest rates fall"*: L40's 1980-2007 story, which ended in 2008.
  - *"Don't borrow in your own currency"*: L40 says a country that does has *more* room.
- The answer, its index (3) and `explain` are unchanged. The explain already refutes two of the three (falling rates "can only fall so far"; own currency gives "more room").
- Lengths, distractors / answer: en 40/40/33 / 38; es 61/57/34 / 56; ko 22/23/17 / 23; zh 10/12/9 / 11; ja 18/15/10 / 18. The answer is neither strict longest nor strict shortest anywhere.
- `check-data.mjs` §65 header comment: one sentence saying O-3 closed, so this prose is now a run's work.
- Item 160: a dated note that class B is unblocked, plus the next questions by per-language margin.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/patch.mjs`: per file, old block ×1 / new ×0 before; ×0 / ×1 after; U+FFFD ×0; a repeat refuses (exit 1). `git diff --stat`: 5 quiz files, 15+/15− |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). **§65 longest: en 34.8 / es 32.6 / ko 34.8 / zh 30.4 / ja 32.6** (each −2.2), shortest unchanged 2.2/2.2/0.0/2.2/4.3 |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-BAblGAXk.js`, system Node v24.18.0 |
| Bundle | 6 new probes (en ×2, es, ko, zh, ja) each in 1 asset; old `Always buy stocks` / `Never borrow money` / `总是买股票` → 0; the answer → 2 (quizText + L40, expected); nonsense → 0 |
| Live | not run: the quiz draws its order, so q008 is checked by bundle, as the 10-17 item-177 entry did |

#### Step 5: adversarial self-check
- **"Also true"?** Each distractor contradicts a sentence in L40 in all five languages (checked against each language's lesson text). The question asks for "the first rule", i.e. L40's Rule 1, so none of them is a defensible answer.
- **§10.1:** "Borrow more whenever interest rates fall" is imperative, but it's a wrong answer, and the explain says why. `check-blindspot` passes. §10.2/§10.3 untouched.
- **Inverse tell:** shortest-option rates unchanged, and the answer index is unchanged, so §3's position spread is unchanged.
- **Decisions / prior work:** this follows O-3's 10-10 record rather than reopening it. Yesterday's item-177 wording of the answer is kept. **No conflict found.**

**Seen, not fixed:** nothing new. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** on one quiz question you could pick the right answer just because it was the longest. Its wrong answers are now plausible rules the lesson argues against. More questions like it are listed under item 160 and are now ordinary run work, because your O-3 call settled the translation question. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-17 (scheduled dev-agent; free pick, the A3 WARN) — CLAIMS.md A3's debt clause measured for the first time: abridged pairs 93 → 47 → 0 over two months and the human share flat at 0%, so debt did not grow. Not refuted; next check 2026-11-07. No source change.

Rules: W-6.2 ok (free pick: the WARN the previous entry's baseline named); W-9.4 n/a. Baseline `npm test` before editing: exit 0 / 0 FAIL / **2 WARN** (O-3's, and A3 past its 2026-10-16 check date).

**Picking.** A3's row set 2026-10-16 as "the first day the clause can be evaluated". Its debt half asks for two consecutive months of growth, and the ledger begins 2026-08-11. `check-claims.mjs` says to record the result or move the date with a reason. That is owed work, and it can be measured today.

**Step 3.5: the premise, measured.**
- Row's premise: the debt half is checkable now; the usage half (non-English sessions) is blocked on O-2. **Held.** `analyticsConfig.js` still has no provider (O-2 open). The debt half needs only the repo.
- Instrument: `scratchpad/a3/history.mjs`. For each date it `git archive`s the last commit on or before that date (`src/` + the review ledger), runs **today's** `completeness()` on it, and counts ledger `method` per language. The same instrument is used at every point, so a threshold change can't masquerade as a trend. (`translation-completeness.mjs` last changed `93fa06e`, 2026-08-27.)
- **Positive control:** 2026-08-24 (`fe649d9`) and 2026-09-04 (`2c1d276`) both give **48, es/ko/zh/ja 12 each**, matching the two figures the row recorded. HEAD gives 0, matching `npm run translation-completeness`.

| date (commit) | lessons | abridged pairs | human-reviewed |
|---|---|---|---|
| 08-16 (`01d6d6d`) | 40 | **93** | 0 of 160 |
| 09-16 (`3585207`) | 44 | **47** (es 11) | 0 of 176 |
| 10-16 (`2587ec2`) | 44 | **0** | 0 of 176 |

Both months the abridged count fell and the human share stayed flat. **The clause is not met.** (Intermediate points 09-30 and 10-10 also read 0, which agrees with LAUNCH_READINESS §10.4's "0 as of 2026-09-22".)

#### What shipped (1 file, no source change)
- `CLAIMS.md` A3: check 2026-10-16 → **2026-11-07** (the next §9.3 audit, where every other row falls due). The measurable cell now says the debt half is measured and the usage half is blocked on O-2. The status cell carries the table's result, the control, and the earlier record kept verbatim under "Earlier record follows". The 2026-10-04 review paragraph's "A3… was not reviewed" gets a pointer to the row.
- **Written down, not fixed:** both legs of the metric are now at their floor (0 abridged, 0% human). From here the clause can fire only if a lesson ships abridged. It cannot see "no fluent speaker has read any of it", which is O-3's question, closed by the owner 2026-10-10. The threshold is left as written. Re-aiming it after the result is in is what §9.1 forbids.

#### Verification
| check | result |
|---|---|
| Edit | two wording passes by a Node patch asserting each match count == 1; `git diff --stat`: CLAIMS.md 2+/2− |
| `npm test` after | exit 0, 0 FAIL, **1 WARN** (O-3's). The A3 WARN is gone |
| Parser reads the new date | `CLAIMS_TODAY=2026-11-08 check-claims` lists **A3** among 17 past-due rows; `CLAIMS_TODAY=2026-11-06` → 0 warnings |
| Build | not run: the change is one Markdown file nothing imports; no bundle can differ |

#### Step 5: adversarial self-check
- **Blindspots:** no app text touched; §10.1/§10.2/§10.3 and the Markets stale-data fix can't regress from a register edit.
- **DECISIONS.md:** O-3's 2026-10-10 re-affirmation stands; this entry doesn't reopen it and doesn't move A3's threshold.
- **True?** "Not met" follows from the row's own definition (debt grows if abridged pairs rise or the human share falls), and neither happened in either month. The one way this could be wrong is the instrument reading old commits differently, and the 08-24/09-04 control rules that out.
- **Prior work:** LAUNCH_READINESS §10.4 already records 0 abridged since 09-22; no figure there changed, so it isn't touched. **No conflict found.**

**Seen, not fixed:** `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed (nothing to deploy).

**Owner-facing, one line:** the "five languages are worth it" claim had its translation-debt half checked for the first time. Debt shrank both months (93 → 47 → 0 shortened translations), so it isn't refuted. That measure can't see that no human has reviewed the translations; that's your O-3 call, already made. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-17 (scheduled dev-agent; named item 177) — the last four 7-word runs shared with the "Economic Machine" video (L32, L33, L34 takeaway, q008's keyed option) are reworded in English. Meaning unchanged, so es/ko/zh/ja keep their text.

Rules: W-6.2 ok (open numbered item, filed by the previous run's "Seen, not fixed"); W-9.4 n/a. Baseline `npm test` this run, before editing: exit 0 / 0 FAIL / **2 WARN** (O-3's, plus CLAIMS.md A3 past its 2026-10-16 check date. The clock, not this change).

**Step 3.5: the premise, measured.**
- Transcript: sozai.app `index.md` (200, 33,431 b; a nonexistent slug → **404**).
- Instrument rebuilt (`scratchpad/ngram.mjs`: maximal shared runs of ≥7 normalized words vs every `src/**` .js/.jsx line, README, index.html). **Result: exactly the item's four, 7 words each.** **Negative control:** Wikipedia "Business cycle" (raw, 200) through the same instrument → 3 runs, all proper names (Federal Reserve Bank of New York / St. Louis).
- **The item understated two of the four.** In context, L33's *"This is the long-term debt peak."* is the video's sentence, in the same place in the story (the cycle reverses → this sentence). q008's option is the video's Rule 1 word for word. L34's takeaway is the video's *"income needs to grow faster than debt grows"*. Only L32 was a sentence fragment (*"spending and incomes grow faster than the"*, the rest already the app's own). Disposition unchanged: reword all four.

#### What shipped
- `lessonContent.economy.en.js` L32 *"outrun what the town can really produce"*, L33 *"That turning point is the peak of the long-term debt cycle."* ("peak" kept, because the paragraph after it says "when these peaks hit"), L34 takeaway *"Income has to outpace debt."* `quizText.en.js` q008 *"Don't let debt rise faster than income"*, now the same as L40's Rule 1. Each says what the old one said. No figure added (W-11.2).
- **es/ko/zh/ja unchanged, by reading.** Each language's four sentences already say what the new English says ("than the town can really produce"; "this is the peak of long-term debt"; "income must grow faster than debt"). The q008 option was already "don't let…" in all four. L32/L33/L34 re-marked `ai` after reading those sentences against the new source. Ledger diff: 72 lines, 12 entries; `review-status` stale 3 → **0** per language. quizText has no ledger.
- `readiness --write`: en 167,500 → **167,511** chars.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/patch.mjs`, 4 pairs: before old ×1 / new ×0; after old ×0 / new ×1 / U+FFFD ×0; a repeat refuses (exit 1) |
| Instrument after | 4 → **0** runs at 7 words. Still fires at 6 (5 runs, one *"of the long term debt cycle"*: a term of art the item says to keep) |
| `npm test` after | exit 0, 0 FAIL, 2 WARN (same two as baseline); §65 unchanged en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6 |
| Guard sees the file | planted *"You should buy stocks now."* into the new q008 option → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-BUz27ZjR.js`, system Node v24.18.0 |
| Bundle | 3 new lesson probes each in 1 asset; q008's new option in 2 (quizText + L40's Rule 1, expected); 4 old phrases → 0; "The Long-Term Debt Cycle" control → 3; nonsense → 0 |
| Live | `python3 -m http.server` over the build (404 control → 404), 29-33 seeded. en `#/lesson/32`, `/33`, `/34`: new true, old false; L33 heading control true. DOM `ZQXNONSENSEPROBE` planted true, removed false. q008 checked by bundle only (the quiz draws its order). localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **§10.2:** the diff only removes quoted wording. Diff grep `dalio|bridgewater` → 0. Item 158's open framing question (named quotes, "beautiful deleveraging") is untouched; I added one line to it about L40's three-rules structure rather than act on it. **§10.1:** diff grep `should buy|you should|recommend|buy now` → 0.
- **True?** All four keep their claim. "Income has to outpace debt" is the condition for a debt burden to fall, which is what L34 teaches. q008 still keys the same option index, and its explain is unchanged.
- **Prior work / decisions:** the four strings are absent from DECISIONS.md, CLAIMS.md, README and LAUNCH_*. This finishes what item 177 filed; it does not undo the 10-16 run. **No conflict found.**

**Seen, not fixed:** only the item 158 note above. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** four more short lines (Lessons 32-34 and one quiz answer) still matched the "economic machine" video word for word. They're now in the app's own words. One framing question is yours, added to item 158: Lesson 40's "three rules" follow the video's structure. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-16 (scheduled dev-agent; free pick, §10.2 residual) — six sentences that reproduced the "How the Economic Machine Works" video near-verbatim (L29 subtitle + definition, L31 ×2, quiz q004/q009 explains) are now in the app's own words. Five languages.

Rules: W-6.2 ok (free pick); W-9.4 n/a. Baseline `npm test` this run, before editing: exit 0 / 0 FAIL / 1 WARN.

**Picking.** A quantifier sweep (132 hits, control fired) found only already-measured claims (L36, L39). Reading L31 I recognized its takeaway (*"Every time you borrow, you create a cycle…"*) as the video's line. LAUNCH_PLAN §10.2 says *"No name-brand framing, no direct quotes, anywhere in the app"*, and `check-blindspot` only greps the name, so an unattributed quote is invisible to it.

**Step 3.5: the premise, measured.**
- Two transcripts (singjupost.com, sozai.app; both 200, nonexistent-path control → **404**) agree word for word.
- Instrument (`scratchpad/sweep/ngram.mjs`): shared 7-word runs vs every `src/**` line, README, index.html. **Result: 9 runs, the longest 14 words**: *"[Productivity] matters most in the long run, but credit matters most in the short run"* (L31 §1, verbatim), *"spending and incomes grow faster than the production of goods, prices rise"* (q004 explain, 12w), *"a buyer exchanging money or credit with a seller for"* (L29 §1, 10w), *"Every time you buy something, you create a transaction"* (L29 subtitle, 9w), and five 7-word runs.
- **Negative control:** Wikipedia "Business cycle" (200, 3× the transcript's length) through the same instrument → **1** run, a proper name ("the Federal Reserve Bank of St. Louis").
- **Premise held**, and it was wider than L31: four complete sentences quoted verbatim, plus the L31 takeaway paraphrasing three consecutive sentences (*"anytime you borrow you create a cycle. This is as true for an individual as it is for the economy"*), and q009's explain repeating half of the L31 quote.

#### What shipped
- `lessonContent.economy.*.js` L29 §1 definition, L31 §1 sentence, L31 takeaway; `quizText.*.js` q004 and q009 explains; `lessons.js` L29 subtitle. 30 one-sentence edits, written per language and hand-read against the English. Meanings kept, two hedged on the way: inflation prices *"tend to rise"*, and credit swings *"drive much of"* the short-run ups and downs, not "matter most". No figure added (W-11.2).
- L29 and L31 es/ko/zh/ja re-marked `ai` (`translation-review.mjs mark`; ledger diff 48 lines, exactly those 8 entries). `readiness --write`: en 167,382 → **167,500** chars. That rounds LAUNCH_PLAN §4.0 from ~167,000 to ~168,000,, by the script.

#### Verification
| check | result |
|---|---|
| Patch | 30 pairs, old ×1 / new ×0 before; old ×0 / new ×1 / U+FFFD ×0 after; a repeat refuses (exit 1) |
| Instrument after | 9 → **4** runs, longest 14 → **7** words. The 4 untouched 7-word sites still fire, which is the control |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's); §65 unchanged (en 37.0 / es 34.8 / ko 37.0 / ja 34.8 / zh 32.6) |
| Guard sees the file | planted *"You should buy stocks now."* after the new takeaway → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-BYqXB4tT.js`, system Node v24.18.0 |
| Bundle | 10 new probes (en ×6, es, ko, zh, ja) each in exactly 1 asset; 5 old phrases → 0; L29 title control → 1; nonsense → 0 |
| Live | `python3 -m http.server` over the build (404 control → 404), 29-30 seeded. en `#/lesson/31`: new ×2 true, old ×2 false, heading true. ja via the real select (`<html lang="ja">`): L31 new true / old false; L29 subtitle + definition new true / old false. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **§10.2:** the diff removes quoted text and adds no name or attribution (diff grep `dalio|bridgewater` → 0). **§10.1:** diff grep `should buy|you should|recommend|buy now` → 0.
- **True?** Each claim is kept or softened; q004 still explains its keyed option and now matches L32 §1.
- **Prior work / decisions:** none of the five sentences appears in DECISIONS.md or CLAIMS.md. The only log mention (archive, q004) is about which lesson the question is mapped to, not its wording. **No conflict found.**

**Seen, not fixed:** four 7-word overlaps remain: L32 *"spending and incomes grow faster than the…"*, L33 *"this is the long-term debt peak"*, L34 *"income needs to grow faster than debt"*, and q008 option *"Don't have debt rise faster than income"* (L40 already says "Don't let…"). Plus L31's thinkAbout *"borrow from your future self"* (5w). Short and arguable: filed as backlog item 177. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** six lines in the app (Lessons 29 and 31, two quiz explanations) were word-for-word or near-word-for-word from the well-known "economic machine" video, which your plan rules out. They're now in the app's own words, in all five languages. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-16 (scheduled dev-agent; free pick, lesson sweep) — L35's "master dial" no longer says "nearly every other rate… follows", mortgage first: rates usually move with it, a new mortgage less reliably. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's L7 lead was marked arguable and stays a note); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** I scanned the three English lesson files for absolute quantifiers (119 hits, read by hand). Most are narrative or already hedged. L35 §1 opened: *"When the Fed turns it, nearly every other rate in your financial life follows — the rate on a new mortgage, what your savings account pays you, the annual rate — the APR — on your credit card."* No commit has touched it since creation (`2afcb42`, 08-05). A sibling regex over glossary/markets/quiz/kids/policy found only this sentence. **Control:** it fired on that known sentence.

**Step 3.5: the premise, measured.** FRED CSV, keyless (`curl` 200 ×6; a nonexistent series id → **404**). Monthly FEDFUNDS vs MORTGAGE30US (weekly → monthly mean) vs MPRIME, 1972 → 2026-09, all windows with a Fed move of at least the threshold:
| window, Fed move | prime same direction | 30-yr mortgage same direction |
|---|---|---|
| 12 m, ≥1.0 pt | **98.7%** (309/313) | **86.3%** (270/313) |
| 6 m, ≥0.5 pt | 96.7% | 81.6% |
- **Positive control:** prime, which card APRs key off, comes back near 100% on the same instrument. **Reading control:** the lesson's own *"about 3.1% to 4.2%"* reproduces from the same weekly series (3.12 on 12-16-2021, 4.16 on 03-17-2022).
- **Counterexamples:** Aug → Dec 2024, fed funds 5.33 → 4.48 while the mortgage went **6.50 → 6.71** (6.96 by Jan). In 2004-06, fed funds +4.2 pts and the mortgage +0.5. Savings (SNDR) went the same way as the Fed both ways in 2022-25, by much less.
- **Premise held:** "follows" is true of card APRs, true in direction for savings, and only usually true for a new mortgage, the first item the sentence named.

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js`, L35 §1, one sentence narrowed, no figure added (W-11.2). en: *"…most other rates in your financial life usually move the same way: what your savings account pays you, the annual rate — the APR — on your credit card, and, less reliably, the rate on a new mortgage."* The mortgage now comes last, next to the existing "market-set rates move first" passage. es/ko/zh/ja say the same. I wrote each one and hand-read it against the English.
- L35 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,352 → **167,382** chars.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/fed/patch.mjs`: 5 pairs, old ×1 / new ×0 each before; after, old ×0 / new ×1 / U+FFFD ×0; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-SviZ6IWT.js`, system Node v24.18.0 |
| Bundle | each of 5 new probes in exactly 1 asset; the 5 old phrases → 0; control (L35 heading) → 1; nonsense → 0 |
| Live | `python3 -m http.server` over the build (404 control → 404), economy 29-34 seeded, `#/lesson/35`. en: new true, old false, heading control true. es/ko/zh/ja via the real select: own new true, own old false, no English left, `<html lang>` followed (es/ko/zh-Hans/ja). DOM `ZQXNONSENSEPROBE`: true, then false. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **True and neutral?** The new sentence describes how rates relate. It says nothing about when to borrow or refinance. The arrows below it ("Raise the dial → borrowing gets more expensive") are tendencies and still hold. The glossary "Fed Funds Rate" (*"influences most other rates… from mortgages to savings accounts"*) and the quiz explanation (*"ripples out to mortgages…"*) say "influence", not "follow", so they agree and were left alone. Diff grep `dalio|should buy|recommend|you should` → 0.
- **Prior work / decisions:** `git log -S"every other rate"` → creation and file splits only. DECISIONS.md and CLAIMS.md say nothing on it. The 10-12 Cash-card fix (*"moves with it, often by less"*) agrees. **No conflict found.**

**Seen, not fixed:** nothing new beyond L7's arguable W-4 line. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the interest-rates lesson said that when the Fed moves, nearly every other rate "follows", mortgage first. But mortgage rates rose through the Fed's 2024 cuts. It now says most rates usually move the same way, and a new mortgage less reliably. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-16 (scheduled dev-agent; free pick, lesson sweep) — essentials L8: "Three numbers shape almost every insurance policy" now says most home, auto and health policies, and that life insurance usually has no deductible. Five languages.

Rules: W-6.2 ok (free pick; the previous lead, L31's productivity line, was marked arguable and stays a note); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** No commit since 09-15 names essentials 1, 2, 7, 8, 9 or 15. I read all six in English. L1's $54 → $648 and 40% rent, and L2's $50/wk → $600 in 12 weeks, check out arithmetically. L8 §2 opened: *"Three numbers shape almost every insurance policy"* (premium, deductible, coverage limit). But §1 of the same lesson lists life insurance among "every type", and life insurance has no deductible. Nothing has touched the sentence since creation (`43cc966`, 08-06).

**Step 3.5: the premise, measured.**
- **California Dept. of Insurance consumer guides** (`curl` 200): the life guide (91,719 b) has **"premium" ×50, "deductible" ×0**. It defines the face amount as what is paid to the beneficiary (less policy loans). **Control:** the same regulator's residential guide, read the same way, has **"deductible" ×4**. A third URL came back 48,035 b, exactly the size of a nonexistent-path control, so it was a soft 404 and I discarded it.
- **Auto:** liability coverage typically has no deductible; collision and comprehensive each carry one (NerdWallet, Bankrate). About 75-79% of insured drivers buy collision or comprehensive (III, via carinsurance.com), so "most auto policies" holds. **Health:** KFF EHBS 2025 finds **88%** of covered workers with single coverage have a general annual deductible.
- **Premise held:** "almost every policy" was false for a whole category the lesson itself names, and "most home, auto and health" is true.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L8 §2 first sentence, narrowed. No figure added (W-11.2). en: *"Three numbers shape most home, auto and health policies (life insurance usually has no deductible)."* es/ko/zh name the same three kinds of insurance. **ja drops 医療:** Japanese private 医療保険 mostly pays fixed per-day benefits with no deductible, so ja says 住宅や自動車. Each translation was hand-read against the English.
- L8 es/ko/zh/ja re-marked `ai` (ledger 24 lines). `refresh-readiness --write`: en 167,303 → **167,352** chars.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/ins/patch.mjs`: 5 pairs, old ×1 / new ×0 each before; after, old ×0 / new ×1 / U+FFFD ×0; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1** (§10.1); restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back`, `index-JA8bc5OW.js`, system Node v24.18.0 |
| Bundle | each of 5 new probes in exactly 1 asset; the 5 old phrases → 0; control (§1 heading) → 1; nonsense → 0 |
| Live | `python3 -m http.server` over the build (404 control → 404), essentials 1-7 seeded, `#/lesson/8`. en: new true, old false, §2 heading control true. es/ko/zh/ja via the real select: own new true, own old false, no English left, `<html lang>` followed (es/ko/zh-Hans/ja). DOM `ZQXNONSENSEPROBE`: true, then false. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **True and neutral?** The parenthetical is a fact about product structure. It doesn't say which policy to buy, and the section's own "not a rule this lesson can hand out" paragraph is unchanged. The quiz item for this lesson (higher deductible → lower premium) and the glossary "Deductible" definition both still agree. Diff grep `dalio|should buy|recommend` → 0.
- **Prior work / decisions:** `git log -S` → creation and file splits only. DECISIONS.md and CLAIMS.md say nothing on this. **No conflict found.**

**Seen, not fixed:** L7's *"A refund or amount owed that swings from year to year usually means an outdated W-4"* and *"most workers fill out once… and never revisit"* are unmeasured population claims (tax-law changes, e.g. 2022's end of the advance child tax credit, also swing refunds). Arguable, so not picked. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the insurance lesson said premium, deductible and coverage limit shape "almost every" policy, but life insurance (which the lesson also covers) has no deductible. It now names home, auto and health, and notes the life exception. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-16 (scheduled dev-agent; free pick, lesson sweep) — essentials L4: on-time payment and low utilization "still do most of the work", not "almost all": FICO weights them 35% + 30%. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's only lead was measured and held, see below); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** Previous lead: L17 §2's *"high earners can and regularly do live paycheck to paycheck"*. **Measured, and it holds.** Fed SHED 2024 (Income and Expenses chapter, HTML 200; a wrong-slug URL → 404): 66% of adults with $100k+ income spent less than their income last month, so about a third had no margin. **Control:** the same page's all-adults split, 51 / 19 / 30, matches the published summary. No edit. Money L24/L26 and economy L31 were read and are clean (framing or already measured). Essentials L4 §3 ended: *"the two factors from the first section — paying on time and keeping utilization low — still do almost all of the work from there."* No commit has touched it since creation (`512852d`, 08-13).

**Step 3.5: the premise, measured.**
- **myFICO "What's in my FICO Scores"** (`curl` 200; a nonexistent sibling slug → 404): payment history **35%**, amounts owed **30%**, length of history **15%**, new credit **10%**, credit mix **10%**. **Control:** all five factor labels found with their weights, and they sum to 100.
- Even on the generous reading (all of "amounts owed" counts as utilization), the two factors are **65%**. Length of history (15%) is exactly what a starting-from-zero reader doesn't have yet.
- **Premise held:** "almost all" overstates it, and "most" is true. §1 already says the other factors "matter too, but less", so this sentence was the only place the lesson contradicted itself.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L4 §3 last sentence, narrowed with no figure added (W-11.2). en *"still do most of the work from there."* es *la mayor parte del trabajo*; ko *대부분의 일을*; zh *大部分的作用*; ja *大部分の役割を* (the old ja *ほとんどの* reads as "almost all"). Each was hand-read against the English.
- L4 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,309 → **167,303** chars.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/fico/patch.mjs`: 5 pairs, old ×1 / new ×0 each before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each of 5 new probes in exactly 1 file, its own `lessonContent.essentials.*` chunk; 5 old phrases + a nonsense probe → 0 files |
| Live | `python3 -m http.server` over the build (404 control → 404), essentials 1-3 seeded, `#/lesson/4`. en: new true, old false, "Starting From Zero" heading as control. es/ko/zh/ja via the real select: own new true, own old false, no English left, `<html lang>` followed (es/ko/zh-Hans/ja). DOM `ZQXNONSENSEPROBE`: true, then false. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **True and neutral?** The sentence still credits the two factors §1 calls the biggest, and the quiz explain (*"usually the biggest factors"*) agrees. No advice, date or Dalio (diff grep 0; §10.1 plant above).
- **Prior work / decisions:** `git log -S"almost all of the work"` → only creation and the file splits. DECISIONS.md mentions credit scores only for track/glossary scope. CLAIMS.md is silent. The glossary has no factor claim. **No conflict found.**

**Seen, not fixed:** L31's *"productivity grows in a fairly straight, gentle line"*. Year-to-year productivity growth does dip below zero, but the claim is relative to credit, and L30 measured credit as the bigger swing. Arguable. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the credit-score lesson said on-time payment and low balances do "almost all" the work. FICO's own weights put them at about two-thirds, so it now says "most". Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-15 (scheduled dev-agent; free pick, lesson sweep) — L17: the better apartment's lift fades over "a year or two", not "about three months", and moving back's loss "tends to weigh more", not "far stronger". Five languages.

Rules: W-6.2 ok (free pick; the previous entry's only lead, L16 §2, was marked arguable); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN. `check-log-size` before: run log 102,425 b, PASS.

**Picking.** Essentials L1/L2/L9 (no accuracy commit since 09-01) were read and are clean. Money L17 §1 ¶4 had two claims unchanged since `bb7f772` (08-07): *"Within about three months, the better apartment stops registering as better"* and a loss *"far stronger"* than the upgrade's satisfaction.

**Step 3.5: the premise, measured.**
- **Wolbring 2017** (*J Happiness Stud* 18(5), SOEP; RePEc abstract): housing satisfaction rises after a move, *"declines in the following years"*, and *"after about 2 years"* returns to levels from several years before. Moves made for housing reasons bring *"partly lasting gains"*. **Nakazato, Schimmack & Oishi 2011** (*Soc Indic Res* 100, SOEP; secondary summary, the DIW page refused the connection): housing satisfaction rose and stayed elevated. Life satisfaction didn't move.
- **Positive control:** Europe PMC returned **Suh, Diener & Fujita 1996** (PMID 8656337): *"only life events during the previous 3 months influenced life satisfaction"*. That is the likely source of "three months". It covers life events in general and overall satisfaction, not how a home feels. A nonexistent-title query → `hitCount 0`.
- **Loss half:** L27 (10-12) now says the classic ~2× estimate is the top of a range that runs *"well below it, and in some designs close to none"* (Brown et al. 2024 median 1.69). "Far stronger" is the old figure, and the course itself has since corrected it.
- **Premise held.** Adaptation is real, so the ratchet stays. The three-month timing and the "far" don't hold up.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L17 §1 ¶4, narrowed with no figure added (W-11.2). en: *"Within a year or two, the better apartment mostly stops registering as better… Most of the pleasure faded; the $400 didn't. …it would feel like a loss, and losses tend to weigh more than the mild satisfaction the upgrade produced in the first place."* es/ko/zh/ja carry the same three changes, hand-read. That read caught doubled connectives in ko/zh/ja (그리고, 而, そして), and a second patch removed them.
- L17 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,303 → **167,309** chars.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/l17/patch.mjs` 15 pairs + 3 connective pairs, old ×1 / new ×0 each before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each of 5 new probes in exactly 1 file, its own `lessonContent.money.*` chunk; 5 old phrases + a nonsense probe → 0 files |
| Live | `python3 -m http.server` over the build (404 control → 404), 16 seeded, `#/lesson/17`. en: 3 new clauses true, 2 old false, heading as control. es/ko/zh/ja via the real select: own new + loss clauses true, own old false, no English left, Priya's name as in-language control, `<html lang>` followed. DOM `ZQXNONSENSEPROBE`: true, then false. localStorage cleared, server stopped |

#### Step 5: adversarial self-check
- **True and neutral?** The ratchet, the $400 arithmetic and the takeaway (*"the pleasure of each one fades while its cost doesn't"*) all stand. "Fades" is what both studies show. No advice, date or Dalio (diff grep 0; §10.1 plant above).
- **Prior work / decisions:** `git log -S"Within about three months"` → only creation and the two file splits. DECISIONS.md mentions L17 only for glossary-chip scope. The quiz and glossary don't repeat either claim. The loss clause now agrees with L27 instead of contradicting it. **No conflict found.**

**Seen, not fixed:** L17 §2 *"high earners can and regularly do live paycheck to paycheck"*. Self-report surveys support it, but those are industry polls, so not measured here. `public/data/market.json` (market job), `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone (W-11.4). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** L17 said a nicer apartment stops feeling nicer "within about three months". German panel data puts the fade at about two years, and partial for moves made for the home itself, so the lesson now says "within a year or two, mostly". Its "far stronger" sense of loss now matches lesson 27's corrected range. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-15 (scheduled dev-agent; free pick, lesson sweep) — L16 no longer says its cash-flow "asset/liability" names turn up "in nearly every book written about money": some popular money books use the words more loosely than an accountant would. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's only lead, L41's heading, was marked arguable); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** Money lessons 16 and 20 are the only ones no accuracy commit has ever named. L20's claims are about mechanism and hold. L16 §1 said *"That difference has a name that turns up in nearly every book written about money. An asset is something that puts money into your pocket over time. A liability is something that takes money out."* That is the *Rich Dad* cash-flow sense. Economy L30, which comes earlier on the main path, uses the accountant's sense in all five languages: the lender *"now holds an asset (you owe them money), and you hold a liability (you owe it)"*.

**Step 3.5: the premise, measured.**
- **Fed SCF 2019-22 bulletin** (HTML, `curl` 200; a nonexistent sibling URL → 404; "Survey of Consumer Finances" ×23 as an in-page control): *"The most commonly held type of nonfinancial asset in 2022 was a vehicle"*, and vehicle loans are counted as debt. Under L16's definition, Maya's car is a liability.
- **FASB Concepts Statement 8 ch. 4** (secondary summaries via search): an asset is a present right to an economic benefit, and a liability is a present obligation to transfer one. Ownership and obligation, not cash-flow direction.
- **Positive control:** the same search found the cash-flow definition attributed to Kiyosaki, and critics noting accountants don't use it. The SCF *PDF* inflated to subset-encoded glyphs, and its control word read 0, so that extraction was discarded, not read as a negative.
- **Premise held:** this usage belongs to some popular books, not "nearly every book", and it contradicts L30 unless flagged. The *Rich Dad* lens stays. Only the universality claim goes.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L16 §1 ¶4 + takeaway. en: *"Some popular money books give that difference a name, using the words “asset” and “liability” more loosely than an accountant would."* Takeaway: *"In this lesson's sense, an asset puts money into your pocket…"*. es *«activo» y «pasivo» con más libertad que un contador* / *En el sentido de esta lección*; ko *'자산'과 '부채'라는 말을 회계사보다 느슨한 뜻으로* / *이 레슨에서 말하는 뜻으로*; zh *对“资产”和“负债”这两个词的用法比会计师宽松* / *按本课的说法*; ja *「資産」と「負債」という言葉を会計士よりゆるい意味で* / *このレッスンの意味では*. A first draft said "two words"; a hand read found that vague, so a second patch names them. The words for "lesson" match each file's existing usage.
- L16 es/ko/zh/ja re-marked `ai`. `refresh-readiness --write`: en 167,229 → **167,303** chars. The quiz item (*"According to this lesson…"*) was already scoped and is unchanged.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/l16/patch.mjs` 10 pairs + `patch2.mjs` 5 pairs, old ×1 / new ×0 each before; repeats refuse (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each of 6 new probes in exactly 1 file, its own `lessonContent.money.*` chunk; 5 old phrases + a nonsense probe → 0 files |
| Live | `python3 -m http.server` over the build (404 control → 404), 41-44 seeded, `#/lesson/16`. en: body + takeaway true, old false, "Maya and Dan" as control. es/ko/zh/ja via the real select: own new body + takeaway true, own old sentence false, no English left, name as in-language control, `<html lang>` followed. DOM `ZQXNONSENSEPROBE`: true, then false. localStorage cleared |

#### Step 5: adversarial self-check
- **True and neutral?** The lens and the "which direction the money flows" test are unchanged. The edit removes a universality claim and the conflict with L30. It adds no advice, date or Dalio (the plant above; diff grep for advice/date strings → 0).
- **Prior work / decisions:** `git log -S"nearly every book written about money" -- src` → only creation (`6918fc9`) and the two file splits. DECISIONS.md and CLAIMS.md say nothing on asset/liability definitions. L43's "asset-versus-liability test" still reads true, and so does the quiz. **No conflict found.**

**Seen, not fixed:** L16 §2's *"the vivid feeling wins nearly every time"*. It's unsourced, but framed as experience, so arguable. `market.json` (asOf 10-14, market job), `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine and are left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** L16 presented the *Rich Dad* "a car is a liability" definition as the one in nearly every money book. The Fed counts a car as a household's most common asset, and lesson 30 teaches that sense, so L16 now flags its usage as looser than an accountant's. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-15 (scheduled dev-agent; free pick, lesson sweep) — L42 no longer says "almost every dollar" of investment, business and rental income "started life as labor income": they usually start with it, and returns compound from there. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's two "Seen, not fixed" leads were both marked arguable); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** The previous entry left L28 and 41-44 as the money lessons no commit since 09-15 names. L28's retail-trading claim matches Barber & Odean 2002 ("Online Investors", recalled: switchers beat the market before going online, then traded more and lagged it), so I left it. L41/43/44 were corrected 09-11/12. The 09-11 entry flagged L42's *"almost every dollar of the other three started life as labor income belonging to someone"* as an owner framing call and didn't pick it by default. It's an empirical claim, though, so I measured it.

**Step 3.5: the premise, measured.**
- **Compounding:** Tiingo SPY (repo key), 1995-01-03 → 2025-01-02, adjClose **26.35 → 573.39 = 21.8×**. **Control:** the price-only close went 45.78 → 584.64 = **12.8×**, which matches the S&P 500's known move (~459 → ~5,868), and adjClose > close as dividends require. So a dollar of saved wages held 30 years is **~95% returns** by the end (~90% after CPI's ~2.1×). The later dollars started life as investment income, not labor.
- **Flow:** FRED `LABSHPUSA156NRUG` (PWT labor share) 2023 = **0.568**. **Control:** the known value is ~0.57-0.6, so the instrument reads true. A nonexistent series id → 404. That means about 40% of national income arises as capital income each year. Also `PIROA` 2026-08 = $4.71T against `COE` 2026-Q2 = $16.35T.
- **Premise held:** the *starting* money is usually saved wages or the owner's hours, which supports the lesson's point. "Almost every dollar" does not hold once returns compound.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L42 §2 + takeaway, narrowed with nothing added (W-11.2). en: *"…the honest shape of the whole thing: the other three usually start with labor income belonging to someone."* Takeaway: *"…and the other three usually start with somebody's labor income."* es *suelen empezar con el ingreso laboral de alguien*; ko *대개 누군가의 노동소득에서 시작됩니다*; zh *通常都是从某个人的劳动收入起步的*; ja *たいてい誰かの労働所得から始まります*. I hand-read each against the English. The next sentence still follows: *"The categories aren't a ladder people climb by escaping work."*
- L42 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,253 → **167,229** chars, still 177 min.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/l42/patch.mjs`: 10 pairs, old ×1 / new ×0 before (ja's two identical new strings allowed for); a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each new probe appears in exactly 1 file, its own `lessonContent.money.*` chunk; 5 old phrases + a nonsense probe → 0 files |
| Live | `python3 -m http.server` over the build (404 control → 404), 41 seeded, `#/lesson/42`. en: body + takeaway clauses true, 2 old false, §1 heading as control. es/ko/zh/ja via the real select: body + takeaway show only that language's version, 10 old strings absent, `<html lang>` followed. DOM `ZQXNONSENSEPROBE`: true, then false. localStorage cleared |

#### Step 5: adversarial self-check
- **True and neutral?** "Usually start with" is about how these incomes begin, which the lesson's own examples show (Ben's saved wages, Tom's deposit, Alina's hours). Nothing ranks the categories. No advice, date or Dalio (diff grep 0; §10.1 plant above).
- **Prior work / decisions:** `git log -S"almost every dollar of the other three"` → only creation (`b6c9bc9`, the owner-approved draft) and archive text. CLAIMS.md and DECISIONS.md don't mention it. The glossary's Labor/Investment Income definitions make no origin claim, and the L44 figure caption ("years of saved wages") still agrees. **No conflict found.** This text came from the owner-approved draft. The 09-11 entry declined to touch it, and I narrowed it on measurement.

**Seen, not fixed:** L41's heading *"Thirteen Years, and Not One Hour on This"*. It's framed as most adults' experience, and 09-11 already hedged the body. Arguable. `public/data/market.json` is uncommitted from the market job and left alone (W-11.4). `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** L42 said nearly every dollar of investment, business and rental income began as someone's wages. Thirty years of SPY compounding turn a saved dollar into ~95% returns, so it now says those incomes "usually start with" labor income. Still waiting on you: **O-2**.

**Two commits, the first empty.** `0e3d6d8` carries this run's message on a tree identical to `3f411eb`. I passed the file list as `$FILES`, which zsh doesn't word-split, so `git add` failed on one 8-path pathspec, and the tree-count assertion passed because nothing had been added. The content is in the next commit. I didn't rewrite history to fold them together. **Lesson:** use a zsh array (`FILES=(…); git add -- $FILES`), and assert `git diff --cached --name-only | wc -l` against the expected count, not just the tree's file count.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-15 (scheduled dev-agent; free pick, lesson sweep) — L22's feed section no longer counts search engines among the amplifiers or says the algorithm hands the bias back "faster each time": feeds can tilt, and search showed both headlines. Five languages.

Rules: W-6.2 ok (free pick; the previous entry's "Seen, not fixed" was empty, and items 149/120 say not to pick them over content); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** Commit subjects since 09-15 never name money lessons 22, 24, 26, 28 or 41-44. Of 22/24/26, only L22 §3 makes empirical claims, and they've been unchanged since `1f798b9` (08-14).

**Step 3.5: the premise, measured.** en said *"…the platform he searched on wasn't neutral either. Search engines, investing forums, and social apps are built to show more of whatever keeps someone clicking… Over enough searches, his feed quietly reshapes itself into an amplifier…"* and *"a habit an algorithm learns and hands back, faster each time."* Europe PMC REST (keyless; control: a nonexistent-title query → `hitCount 0`):
- **Robertson et al. 2023** (*Nature*, PMID 37225979), Google Search, 2018 + 2020: participants' *engagement* held more identity-congruent and unreliable sources than their search results *exposed* them to. The selecting was the user's, not the engine's.
- **González-Bailón et al. 2023** (*Science*, 37499003): on Facebook, ideological segregation rises from potential to actual (curated) exposure. **Guess et al. 2023** (*Science*, 37498999): a chronological feed showed more content from moderate friends and mixed-audience sources than the algorithmic one. **Nyhan et al. 2023** (*Nature*, 37500978): most of what users see comes from like-minded sources.
- **Positive control:** those three confirm the *feed* claim, so the sources can confirm, not only refute.
- **Premise held:** feeds tilt, and search wasn't shown to. "Faster each time" has no source at all. §1 already says *"The search returned both headlines either way"*; §3 contradicted it.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L22 §3: three clauses narrowed, nothing added (W-11.2). en: *"Tomás's late-night search showed him both headlines, and which one he read was his own choice. The feeds he scrolls afterward aren't that even-handed. Investing forums and social apps are built…"*; *"Over time, his feed can tilt toward the belief he already held — not because anyone rigged it, but because his own past clicks trained it to."*; *"…a habit an algorithm can learn and hand back."* es/ko/zh/ja carry the same three changes, hand-read against the English.
- L22 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,292 → **167,253** chars, still 177 min.

#### Verification
| check | result |
|---|---|
| Patch | 15 pairs, old ×1 / new ×0 each before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each new probe only in its own `lessonContent.money.*` chunk; 5 old phrases and a nonsense probe → 0 files |
| Live | `python3 -m http.server` over `dist/` (404 control → 404), `#/lesson/22` seeded. en: 3 new clauses true; 3 old and "Search engines" false. es/ko/zh/ja via the select: own new clause only, Tomás's name as in-language control, `<html lang>` followed. DOM `PROBE_ZQX`: true, then false. localStorage cleared |

#### Step 5: adversarial self-check
- **True and neutral?** Every remaining claim is about feeds, which three 2023 field studies support. Search is left as the story already framed it. No advice, date or Dalio (§10.1 plant above).
- **Prior work / decisions:** `git log -S"faster each time"` → only `1f798b9` (created) and `6f5c48c` (file split). DECISIONS.md and CLAIMS.md don't mention algorithms or confirmation bias, and the quiz and glossary don't repeat the claim (`grep -i algorithm src/` → only this file). **No conflict found.**

**Seen, not fixed:** the heading "Why Your Feed Makes It Worse" stands. Nyhan 2023 found that cutting like-minded exposure moved no attitudes, but that measured polarization, not decision confidence, so it's arguable. "Reliably gets more clicks" rests on selective-exposure research (Hart et al. 2009 meta-analysis, a moderate effect; recalled, not fetched). `public/data/market.json` (asOf 2026-10-14) is uncommitted from the market job and is left alone per W-11.4. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the confirmation-bias lesson blamed search engines for retraining on your clicks and called the effect "faster each time". Research finds search results were less one-sided than what people chose to click, so the lesson now puts that on feeds, which "can tilt". Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-14 (scheduled dev-agent; residual of the L21 run) — L18's marshmallow paragraph no longer says waiting depends on "whether their household has taught them" that promises are kept: the study varied whether an adult had just kept one. Five languages.

Rules: W-6.2 ok (residual of a free pick; one more residual allowed); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Step 3.5: the premise, measured.** The previous entry's "Seen, not fixed" was recalled, not fetched. Europe PMC REST (keyless; PubMed's page served a cookie wall; control: a nonexistent PMID → `hitCount 0`):
- **Kidd, Palmeri & Aslin 2013** (*Cognition*, PMID 23063236), N = 28, mean age 4;6: the marshmallow task run *"in an environment demonstrated to be either unreliable or reliable"*. Reliable-condition children waited significantly longer (p < 0.0005). The manipulation was the experimenter's broken or kept promise minutes earlier, not the child's home.
- **Watts, Duncan & Quan 2018** (*Psych Sci*, PMID 29799765): the link from waiting to age-15 achievement was half the original size and shrank by two-thirds with controls for family background and the home environment. That concerns what waiting *predicts*, not what drives it.
- **Positive control:** both abstracts support the paragraph's direction (waiting depends on things outside the child's control), so the source could confirm the clause, not only refute it.
- **Premise held:** "household has taught them" is an extrapolation. The measured cause is whether the adults present have kept their word.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L18 §2, one clause narrowed (W-11.2, no statistic). en: *"…like whether the adults around them have kept their promises about 'later'."* es *como si los adultos a su alrededor han cumplido sus promesas sobre 'después'* (keeps the original's *como si* + indicative); ko *주변 어른들이 '나중'에 대한 약속을 지켜 왔는지처럼*; zh *比如身边的大人是否兑现过关于“以后”的承诺*; ja *周りの大人が「後で」という約束を守ってきたかどうかなど*. Hand-read against the English. The next sentence ("easier to practice when the environment makes waiting feel safe") still follows.
- L18 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,307 → **167,292** chars, still 177 min.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/marsh/patch.mjs`: old ×1 / new ×0 in all 5 before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from a file, not a pipe |
| Guard sees the file | planted *"You should buy stocks now."* after the new en clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each new probe in only its own `lessonContent.money.*` chunk; 5 old phrases and a nonsense probe → 0 files |
| Live | static `dist/` (404 control `/assets/nope.js` → 404), 16-17 seeded, `#/lesson/18`. **My first pass read all-false in four languages, old phrases included: the lazy chunk hadn't loaded.** Re-read after a 1 s wait, with the marshmallow word as an in-language control: each language showed its own new clause, no old one, no other language's, and `<html lang>` followed. DOM `PROBE_ZQX`: true, then false. localStorage cleared |

#### Step 5: adversarial self-check
- **True and neutral?** Kidd's in-session manipulation is exactly "adults around them have kept their promises". N = 28 is small, but the paragraph already says "later research" and the direction matches. No advice, date or Dalio (§10.1 plant above).
- **Prior work / decisions:** `git log -S"household has taught them"` → only the lesson's creation (`fef3bb1`) and two file splits. DECISIONS.md and CLAIMS.md don't mention delay of gratification; the quiz, glossary and kids content don't repeat the clause. **No conflict found.**

**Seen, not fixed:** nothing new in L18. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the marshmallow passage credited a child's household for teaching that promises are kept. The study actually varied whether an adult had just kept a promise, so it now says "the adults around them". Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-14 (scheduled dev-agent; free pick, lesson sweep) — L21's home-listing example no longer says offers "cluster near the anchor instead of near the home's actual worth": listing prices pull estimates part of the way, not all of it. Five languages.

Rules: W-6.2 ok (free pick, as the previous entry required); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Picking.** The older "Seen, not fixed" leads were already measured (balance-sheet caption 10-11, Growth names 10-12, L38 Peak `b45aa0a`). Money lessons 16-28 and 41-44 are the least-touched since 09-20. A scan of their empirical sentences found L21 §2, unchanged since `28e5555`.

**Step 3.5: the premise, measured.** en: *"A home listed at $450,000 shapes every offer that follows… — offers cluster near the anchor instead of near the home's actual worth."*
- Lab: Northcraft & Neale 1987 (OBHDP 39:84-97) hypothesized *insufficient* adjustment. As reported secondhand (EdgeProp; I couldn't read the paper's scanned tables here), agents' appraisals across a $30,000 listing-price spread differed by about $14,550, roughly **48%** of the gap. A later study reports anchoring indexes of **67%** (agents) and **86%** (students).
- Field: Bucchianeri & Minson 2013 (JEBO 89:76-92), >14,000 sales: higher list prices go with higher sale prices.
- **Positive control:** the same sources support the lesson's direction (the anchor pulls), so they can confirm a claim, not just refute one.
- **Premise held for the clause:** estimates move partway toward the anchor. "Every offer" and "instead of near the home's actual worth" go further than the evidence does.

#### What shipped
- `lessonContent.money.{en,es,ko,zh,ja}.js`, L21 §2: the clause was narrowed rather than given a statistic (W-11.2). en now reads *"A home listed at $450,000 tends to pull the offers that follow toward it, even from buyers who never independently priced the neighborhood."* es *tiende a atraer hacia sí las ofertas que siguen*; ko *이후에 이어지는 제안들을 그 가격 쪽으로 끌어당기는 경향이 있습니다*; zh *往往会把之后的报价拉向这个价格*; ja *その後に続く提示価格をその価格の方へ引き寄せる傾向があります*. Hand-read against the English. The salary sentence, the takeaway and the quiz don't make the "cluster" claim, so they're unchanged.
- L21 es/ko/zh/ja re-marked `ai` (ledger 12 lines). `refresh-readiness --write`: en 167,365 → **167,307** chars, still 177 min.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/anchor/patch.mjs`: old ×1 / new ×0 in all 5 before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read from the file, not through a pipe. The first run failed §10.4; the re-mark and refresh fixed it |
| Guard sees the file | planted *"You should buy stocks now."* after the new en sentence → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each new probe is in only its own `lessonContent.money.*` chunk; the 5 old phrases and a nonsense probe → 0 files |
| Live | static `dist/` in the Browser pane (404 control: `/assets/nope.js` → 404), money 16-20 + 41-44 seeded, `#/lesson/21`. Via the language select, each language showed only its own probe, no old phrase, and `<html lang>` followed. DOM control `PROBE_ZQX`: true, then false. localStorage cleared after |

#### Step 5: adversarial self-check
- **True and neutral?** "Tends to pull… toward it" holds at every measured index (48-86%) and in the field data. The sentence is about negotiation psychology, not an asset. It has no advice, date or Dalio (§10.1 plant above).
- **Consistency:** the salary sentence's "tends to pull the eventual number toward theirs" now matches. The takeaway ("treat it as a starting offer, not a fact") still follows. DECISIONS.md and CLAIMS.md don't mention anchoring. **No conflict found.**

**Seen, not fixed:** L18's marshmallow paragraph credits "whether their household has taught them that promises… are usually kept". The best-known follow-up (Kidd et al. 2013) varied whether *the experimenter* had kept a promise, so "household" is an extrapolation (recalled, not fetched). Arguable. While trying to read the 1987 paper's scan, a Browser-pane navigation to its PDF triggered a download dialog on the owner's screen. Nothing was saved by me; don't retry that URL. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the anchoring lesson said a listing price makes offers bunch up at it rather than at the home's worth. Research shows a partial pull, so it now says the price "tends to pull" offers toward it. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-14 (scheduled dev-agent; residual of the previous L34 run) — L34 tool 1 now says a tax rise that closes a budget gap counts as austerity, so the lesson's 1930-32 "large tax increase" maps to a deflationary tool. Five languages.

Rules: W-6.2 ok (second residual in a row; ⛔ the next run may NOT take a residual of this one); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Step 3.5: the premise, measured.** The previous entry's "Seen, not fixed": tool 1 is "CUT SPENDING (Austerity)", and its body describes only layoffs and cancelled contracts. But the 1930-32 example lists *"a large tax increase"* among *"the deflationary tools"*. After the last run, the only tool that mentions taxes is tool 3, which "raises taxes on higher earners" and is "not mainly shrinking" spending. The Revenue Act of 1932 raised the top rate **25% → 63%** (Wikipedia; FRASER *Commercial & Financial Chronicle* 1932-06-04), so a learner who maps it onto the four tools lands on tool 3. That contradicts the example. Its stated purpose was to balance the budget, not to fund transfers, so it is tool 1 in substance. **Positive control:** the lesson's own sentence lists it as deflationary, and the 10-14 entry's CBO table has every tax-change multiplier above 0, so a deficit-closing tax rise shrinks output in every estimate. **Premise held.**

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js`, L34 tool 1: one sentence appended at the end of the paragraph. en: *"Raising taxes to close the gap counts as austerity too: the money goes toward closing the deficit rather than toward support for others, so it also takes spending power out of the economy."* es *Subir impuestos para tapar ese agujero también cuenta como austeridad…le quita poder de compra a la economía*; ko *부족분을 메우려고 세금을 올리는 것도 긴축에 해당합니다…경제에서 구매력을 빼냅니다*; zh *为填补缺口而加税也算紧缩…从经济中抽走购买力*; ja *不足を埋めるための増税も緊縮に含まれます…経済から購買力を奪います*. Each reuses that language's existing word for the gap (agujero / 예산 부족 / 缺口 / 不足) and tool 3's word for spending power. Hand-read against the English.
- Heading, dial labels ("cutting, defaulting") and quiz option "Austerity (cutting spending)" unchanged. "Cutting" still covers spending cuts, and the quiz option is narrow but not false. W-11.2: one sentence, no figure.
- L34 es/ko/zh/ja re-marked `ai`. Ledger diff **8 lines**, the four source hashes (same reviewer and date as the previous run). `refresh-readiness --write`: en 167,176 → **167,365** chars, still 177 min.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/austerity/patch.mjs`: anchor ×1 / new ×0 in all 5 before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's), read directly (no pipe) |
| Guard sees the file | planted *"You should buy stocks now."* after the new en sentence → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | each of the 5 probes is in only its own language's `lessonContent.economy.*` chunk; nonsense probe → 0 files |
| Live | static `dist/` in the Browser pane, economy 29-33 seeded, `#/lesson/34`. Driving the language select en→es→ko→zh→ja: each language showed exactly its own probe and none of the others; `<html lang>` followed. DOM control `PROBE_ZQX` read true, then false |

#### Step 5: adversarial self-check
- **True and neutral?** Deficit-closing tax rises are contractionary in standard estimates. The sentence states a mechanism and doesn't rank austerity or recommend it. No advice, date or Dalio (§10.1 plant above).
- **Consistency:** 1930-32's tax increase now maps to tool 1. Tool 3 is still separated by where the money goes, and "Why Tool #4" ("only tool 1 (austerity) and tool 2 (default)") still holds. DECISIONS.md and CLAIMS.md don't mention austerity; `git log -S` finds no earlier version of this sentence. **No conflict found.**

**Seen, not fixed:** the 1930-32 example says the US leaned on "budget-balancing", and federal outlays may have *risen* from FY1930 to FY1932 (recalled from OMB Historical Table 1.1, **not fetched**). The 1932 act was the budget-balancing attempt, so this is arguable and unmeasured. ⛔ That would be a third residual, so the next run picks free. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the debt lesson's "cut spending" tool now also covers tax rises that close a budget gap, so its 1932 tax-increase example no longer contradicts the tool list. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-14 (scheduled dev-agent; residual of the 10-13 PMI run) — L34 no longer groups tool 3 (redistribution) with the deflationary tools: a tax-funded transfer isn't reliably deflationary. Lesson + the deleveraging dial, five languages.

Rules: W-6.2 ok (residual of a free pick; one more residual allowed); W-9.4 n/a. Baseline: the previous entry's `npm test` exit 0 / 0 FAIL / 1 WARN.

**Held, no edit: L40 Rule 3's *"isn't just moving numbers around"*.** It's loose but not false: rule 3 is the only one of the three that raises output.

**Step 3.5: the pick's premise, measured.** L34 called tool 4 *"the opposite of the first three tools"* and named the deflationary tools *"(cutting, defaulting, taxing)"*, the dial's left end label. Tool 3 as the lesson describes it is a **transfer**: tax higher earners to fund support for everyone else. CBO Working Paper 2015-02's output multipliers (via Wharton's reproduction; cbo.gov 403s here): transfers to persons **0.4-2.1**, one-year tax cuts for higher-income people **0.1-0.6**. A $1 tax-funded transfer nets **−0.2 to +2.0** (matched low/low +0.3, high/high +1.5). **Positive control:** the same table classifies tool 1 correctly, since federal purchases are 0.5-2.5, so cutting them shrinks output in every case. Caveat: this treats a tax rise as a mirrored tax cut. **Premise held:** "deflationary" doesn't describe tool 3.

#### What shipped
- `lessonContent.economy.{en,es,ko,zh,ja}.js`, L34. Three edits each: tool 3 gains one sentence (en: *"Unlike the first two tools, it moves spending power from one group to another rather than mainly shrinking it."*); tool 4 becomes *"the opposite of the first two tools"*; the balance paragraph's group becomes *"(cutting, defaulting)"*. es *traslada poder de compra de un grupo a otro en lugar de, sobre todo, reducirlo*; ko *전체 지출을 주로 줄이기보다 구매력을 한 집단에서 다른 집단으로 옮깁니다*; zh *主要是把购买力从一部分人转到另一部分人手中，而不是让总支出萎缩*; ja *支出全体を主に縮めるのではなく、購買力をある層から別の層へ移します*.
- `markets.js`: the dial's left end label and text alternative, ×5 (§69 requires both to be lesson substrings). The zone-order comment now says tools 1-2, with a dated note on why tool 3 sits on neither end. `charts.jsx`: two comments ("tools 1-3", "the first three"). The quiz and glossary don't group the tools, so they're unchanged.
- L34 es/ko/zh/ja re-marked `ai`; ledger diff **24 lines, L34's four entries**. `refresh-readiness --write`: en 167,075 → **167,176** chars, still 177 min; LAUNCH_PLAN §4.0 ~29,200 → ~29,300 words.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/delev/patch.mjs`: 27 pairs, each old ×1 / new ×0 before; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). The first run failed §10.4; the re-mark and refresh fixed it |
| §69 sees the label | planted the old `"cutting, defaulting, taxing"` end label → 3 §69 FAILs; restored (`cmp`) → 0 |
| Guard sees the file | planted *"You should buy stocks now."* after the new en sentence → `check-blindspot` **exit 1**; restored → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | 5 new probes, each only in its own language's economy chunk; the new end label in `markets-*`; 10 old phrases → 0 files; nonsense → 0 |
| Live | static `dist/` in the Browser pane, economy 29-33 seeded, `#/lesson/34`. In all five languages (via the select) the new sentence, "first two" and the 2-tool group are present. Dial alt text reads "cutting, defaulting —". DOM control `PROBE_ZQX`: true, then false. A ko/zh probe for 증세/加税 read true. It was too broad (it matches the 1932 tax rise and tool 3 itself); the exact old tuples are 0 in the bundle |

#### Step 5: adversarial self-check
- **True and neutral?** The sentence doesn't call tool 3 stimulative, which the range's low end wouldn't support. No advice, date or Dalio (§10.1 plant above).
- **Internal consistency:** the 1930-32 example still lists *"a large tax increase"* among the deflationary tools. The Revenue Act of 1932 raised taxes to balance the budget, which is austerity (tool 1), not a funded transfer, so it holds. But tool 1's heading says only *"CUT SPENDING"*. Seen, not fixed.
- **Prior work:** `git log -S"cutting, defaulting, taxing"` shows the phrase in the lesson since the initial commit (`eda6dd0`), and lifted into the dial on 09-03 (`2c4f58b`). Nothing in the run log or archive had measured tool 3's sign. DECISIONS.md: no conflict. **No conflict found.**

**Seen, not fixed:** tool 1's heading "CUT SPENDING (Austerity)" omits tax rises, which the 1930-32 example counts. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the debt lesson called "tax the rich to fund support" a spending-shrinking tool like cuts and defaults. CBO estimates don't support that; it now says it moves spending power between groups. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-13 (scheduled dev-agent; free pick, lesson sweep) — essentials L12's PMI no longer "cancels automatically once enough equity has built up": the automatic trigger is the payment schedule, and a rise in the home's value doesn't count. Five languages.

Rules: W-6.2 ok (the previous entry left no residual; free pick); W-9.4 n/a. `npm test` before: not run; the previous entry's exit 0 / 0 FAIL / 1 WARN is the baseline, and the post-edit run reproduces it.

**Found by** a Node scan of the 44 lessons' English quantifier sentences sharing no 30-char window with either log or `CLAIMS.md` (whitespace-normalized): 338 → 184 unmentioned. Controls: a known-measured L33 sentence → found; nonsense → not. (My first version never tested its positive control; fixed.)

**Candidate 1 held, no edit: L35 *"Most of the time these two goals point the same direction"*.** FRED PCEPILFE/UNRATE/NROU, 1960-01 → 2026-08, n = 800; "pulling apart" = core-PCE gap from 2% and unemployment gap from NROU call for opposite policy. Controls: bogus id → 404; UNRATE 2009-10/2020-04 asserted; oracle 100%, anti-oracle 0%, 204-month shift 47%. At ±0.5 tolerance they pulled apart **26%** of months (±1: 15-18%; 2008-26: 3%). Only zero tolerance gives 46%. Holds.

**Candidate 2, the pick: L12 *"…typically cancels automatically once enough equity has built up."*** CFPB ("When can I remove PMI", fetched today): under the Homeowners Protection Act the servicer must end PMI automatically when the principal is **scheduled** to reach 78% of the **original** value, or at the loan's midpoint; 80% is request-only. A price rise never counts, and prepaying doesn't move the automatic date. **Premise held:** the sentence implies a trigger the law doesn't have.

#### What shipped
- `lessonContent.essentials.{en,es,ko,zh,ja}.js`, L12 §3, one clause each. en: *"…and typically cancels automatically once the scheduled payments have paid down enough of the loan; a rise in the home's value doesn't count toward that."* es *una vez que los pagos programados han reducido lo suficiente el préstamo; que la vivienda suba de valor no cuenta para eso*; ko *예정된 상환으로 대출 잔액이 충분히 줄어들면… 집값이 오른 것만으로는 자동 해지되지 않습니다*; zh *按计划还款使贷款余额降到足够低时自动取消；房价上涨并不计入其中*; ja *予定どおりの返済でローン残高が十分に減ると…住宅の値上がりは、これには数えられません*. Hand-read all four against the English.
- W-11.2: narrowed, no figure (78% stays out). English +84 chars, still 177 min.
- L12 es/ko/zh/ja re-marked `ai` (`translation-review.mjs mark`); ledger diff **24 lines, exactly L12's four entries**. `readiness --write`: §4.3 166,991 → **167,075** chars, plus §10.4's volume sentence. `translation-completeness --write` not run.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/pmi/patch.mjs`: old ×1 / new ×0 for all 5 before, the reverse after; a repeat refuses (exit 1) |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's). The first run failed §10.4 (L12 stale ×4), and the second failed the §4.3/§10.4 figures; both were fixed as above |
| Guard sees the file | planted *"You should buy stocks now."* after the new clause → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0 |
| Bundle | 5 new probes → each in its own language's `lessonContent.essentials.*` chunk; 5 old probes → 0 files; nonsense → 0 |
| Live | static `dist/` in the Browser pane, essentials 1-11 seeded complete, `#/lesson/12`. New present / old absent in **all five languages** (language select). DOM control: injected `PROBE_ZQX` read true, then false after removal |

#### Step 5: adversarial self-check
- **True and neutral?** The new clause is the HPA rule without the number, and it says what the lesson's own "equity" (built by payments) meant. It gives no advice to buy, rent or refinance (§10.1 plant above). §10.2/§10.3 n/a; no date (§2.3).
- **Over-claim check:** Fannie/Freddie let a borrower *request* removal based on a new appraisal after seasoning. The clause says only that a price rise doesn't count toward the **automatic** cancellation, which stays true.
- **Siblings:** "PMI"/"mortgage insurance" across `src/` (control: L12 matched) appear only here plus the unrelated ISM-PMI quiz option. DECISIONS.md's two PMI lines are about term chips. `git log -S` shows the clause unchanged since the track split. **No conflict found.**

**Seen, not fixed:** the other 182 are mostly scenario setup. Next candidates: L40's productivity line *"the only one of the three that isn't just moving numbers around"*, and L34 grouping tool 3 (redistribution) with the deflationary tools. The latter is lifted into `BalanceBand`'s labels (§69), so 15+ strings move. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the home-buying lesson said mortgage insurance cancels automatically "once enough equity has built up". By law the automatic trigger is the payment schedule, not a rise in the home's price, so it now says that. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-13 (scheduled dev-agent; free pick, W-11.2 Dashboard sweep) — the Key Principle "Real rates — after inflation — say more than headline rates" no longer ranks them: on FRED, the real rate didn't say more. Five languages.

Rules: W-6.2 ok (the previous entry left no residual to take; free pick); W-9.4 n/a. `npm test` before: not run; the archiving entry's exit 0 / 0 FAIL / 1 WARN is the baseline, and the post-edit run reproduces it.

**Why this line:** it had **0** hits in `AGENT_LOG.md`, the archive and `CLAIMS.md` (control: "work with lags" → 2 archive hits, the 09-17 sweep). It is the last `ratePrinciples` item nobody had measured. The open numbered items (117, 140, 143, 149, 76) still say not to pick them over content.

**Step 3.5: the premise, measured.** Keyless FRED CSV: FEDFUNDS, CPIAUCSL, CPILFESL, UNRATE, USREC, GS10, TB3MS, monthly 1959-2026 (`scratchpad/real/an.mjs`, which throws on a bad header or a non-numeric value). **Controls:** bogus id → **404**; FF 1981-01 = 19.08, UNRATE 2009-10 = 10.0 and USREC 2008 asserted; month-parity AUC **0.500**; −(10y−3m) AUC **0.876**; the oracle's Spearman **1.000**.

| signal | AUC: recession starts ≤12m (706 months, 108 positive) | Spearman with ΔU over the next 24m |
|---|---|---|
| nominal FF | **0.774** | **0.390** |
| FF − core CPI yoy | 0.749 | 0.338 |
| FF − headline CPI yoy | 0.683 | 0.218 |
| FF − core realized over the *next* 12m | 0.683 | n/a |

Split 1959-84 / 1985-2026: nominal wins both on ΔU (0.39/0.45 vs core 0.21/0.42). On AUC, core real edges it only after 1985 (0.780 vs 0.728). The 10-12 peak-rate run had real slightly ahead at cycle peaks (0.22 vs 0.17, n = 12, both weak). **Premise breaks:** no reliable edge either way, so "say more" is unsupported. Real rates still matter: 1975-06 had FF 5.55% with real −3.6%.

#### What shipped
- `markets.js` `ratePrinciples[3]`, five languages. en: *"Real rates — after inflation — are worth reading alongside headline rates, not instead of them."* es *conviene leerlas junto a las nominales, no en su lugar*; ko *대신하기보다 함께 볼 때 의미가 있습니다*; zh *值得与名义利率一起看，而不是取而代之*; ja *名目金利の代わりではなく、あわせて見ると役立ちます*. Hand-read all four.
- An 8-line dated comment carries the figures; the build strips it. W-11.2: narrowed, no figure ships.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/real/patch.mjs` asserts old ×1 / new ×0 for each of 6 sites, then the reverse. A first try refused on a bad comment anchor and wrote nothing (`cmp` vs a pre-copy); a repeat refuses |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Guard sees the file | planted *"You should buy stocks now."* → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` exit 0, `markets-CzWDFSIL.js` |
| Bundle | 5 new probes → `markets-*.js`; old en → 0 files; `AUC 0.77` (the comment) → 0; nonsense → 0. The old zh phrase's one hit is an unrelated L-economy sentence |
| Live | static `dist/` in the Browser pane, Reference → Market Dashboard: new sentence present and old absent in **all five languages**; control principle ("speed of change") present |

#### Step 5: adversarial self-check
- **Is the new line true and neutral?** It makes no ranking claim, and it is analytical, not advice (§10.1 plant above). §10.2/§10.3 n/a. No date added (§2.3).
- **Instrument fairness:** a trailing-inflation real rate is an ex-post proxy. The forward-realized variant did no better (0.683), so the result doesn't come from the proxy choice.
- **Siblings:** a scan of `src/content/` for real-rate comparatives found only this line (control: it matched). **DECISIONS / completed work:** `git log -S` shows the line unchanged since the rebuild, and no prior entry measured it. **No conflict found.**

**Seen, not fixed:** the `ratePrinciples` list is now fully measured. Remaining unmeasured Dashboard text is lesson-33/34 figure labels, which are lifted verbatim from the lessons (§64/§69/§71), so their lessons are the place to measure. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Market Dashboard said real (after-inflation) rates "say more" than headline rates; 65 years of FRED data show no reliable edge either way, so it now says to read them together. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched.

### 2026-10-13 (scheduled dev-agent; W-5.3 archiving pass, owed by the previous entry) — run log days 2026-10-04 → 10-10 (28 entries, 191,935 b) moved verbatim to the archive. No source change.

Rules: a standing chore, not a residual, so W-6.2 n/a; W-9.4 n/a. W-5.3's **twenty-third** firing.

**Step 3.5: the premise, re-measured.** `check-log-size` at HEAD `6847c70`, before any edit: run log **244,277 b** (97.7% of the 250,000 b warn), **0.92 runs** of headroom, WARN; 10 live days, each one contiguous region, controls 1-4 firing. The premise held. **Which days:** everything before the most recent weekly-review boundary (W-11, 2026-10-11), the rule's date clause as written, so 10-11 → 10-13 stay live, as the 22nd pass kept its boundary day.

#### What shipped (2 files, no source change)
- `AGENT_LOG.md` **518,136 → 326,199 b** before this entry; **3 live days**, oldest 2026-10-11. **Floor unchanged at 273,859 b.**
- `AGENT_LOG.archive.md` **5,479,416 → 5,671,392 b** under `## Archived 2026-10-04 → 2026-10-10`, after the 09-27 → 10-03 section and before the line-start `## Archived backlog (closed items)`. Title `→ 2026-10-03` becomes `→ 2026-10-10` (line 1, byte-neutral). Days ascending, entries within a day in live-file order (the 22nd pass's layout). Day sizes: 10-04 23,084; 10-05 24,254; 10-06 28,917; 10-07 23,965; 10-08 29,711; 10-09 32,155; 10-10 29,837.
- The mover lived in `scratchpad/archive/move.mjs`; `scripts/` gained 0 lines. It anchors the backlog heading at line start and asserts it occurs once, per the 22nd pass's instrument note.

#### Verification
| Check | Result |
|---|---|
| Pre-state | both files `cmp`-identical to `git show HEAD:` before the write |
| Conservation (mover) | section read back out of the new archive string, days reversed and appended to the new live file → the original **518,136 b** byte for byte; the same rebuild one character short does not match |
| Conservation (independent, from disk) | a separate script re-read both written files: new archive minus the section, title reverted, **==** HEAD's archive; live rebuilt **==** HEAD's `AGENT_LOG.md`; one-char-short control **false** |
| Containment | each of the 28 heading lines: new archive ×1, old archive ×0, new live ×0. `^### 2026-10-0[4-9]\|10-10` counts: live **0**, archive **28** |
| Composition | archive grew **191,976 b** = heading 37 + `\n\n` + block 191,935 + `\n\n` |
| Repeat | re-running the mover refuses (exit 1) |
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (O-3's; the headroom WARN is gone). MEASURED 2026-10-13, before this entry: file 326,199 b, run log 52,340 b, floor 273,859 b, archive 5,671,392 b, 3 live days, 31.7 runs of headroom |

#### Step 5: adversarial self-check
- **Blindspot register / DECISIONS.md:** out of reach; only two markdown files changed. Moved **verbatim**, nothing deleted or edited (W-7.2 rule 3): the two conservation checks are the proof, since `npm test` cannot detect archive loss. Backlog, App summary and Environment note untouched; the floor is byte-identical.
- **Already-done work:** the archive held 0 of these 28 entries before.
- **My own claims:** once this commits HEAD moves, so **a reviewer must name this commit's parent `6847c70`**. No conflict found.

**Seen, not fixed:** nothing new. W-10.6(a)'s treadmill: **24** dev-agent runs separate the 22nd pass (`8bda77c`, 10-07) from this one, so log mechanics are 1 run in 25. W-11.1's entry-size test (10-12 → 10-18) is measured off the file at the next review; the four 10-12 entries are still live for it. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are untracked and not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the run log was one run from its size budget, so 28 entries from 2026-10-04 to 10-10 moved verbatim into the archive (run log at 23% of budget, warning cleared). No learner-visible change. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; not read, not touched. **Backlog:** 0 b added.

### 2026-10-13 (scheduled dev-agent; residual of the peak-rate run held, then a free pick) — "Be the Fed Chair": cheap credit no longer "feeds" the next expansion's inflation as a rule. It can, and after 2008 it didn't. Five languages.

Rules: W-6.2 ok (I took the previous run's residual, its second in a chain; it held, so no edit. ⛔ The next run may NOT take a residual of this one); W-9.4 n/a. `npm test` before: exit 0, 0 FAIL, 1 WARN (O-3's). Run log 239,158 b before; **after this entry `check-log-size` WARNs (0.88 runs of headroom), so the next run owes W-5.3’s archiving pass.**

**Residual first: *"The speed of change often matters more than the level itself"* (Dashboard). It holds, so no edit.** I rebuilt the previous run's cycle table from keyless FRED FEDFUNDS / UNRATE / CPILFESL: the same 12 peaks and FF values, and ρ(level, Δunemployment) = **0.17**, as the previous run reported. 2023-08 now has its 36 months, so n = 13. Spearman against Δunemployment: level 0.17, speed (pts/yr) 0.33, fastest 12-month rise 0.28, size of the hike 0.54. Head to head, in pairs where speed and level disagree, the faster cycle came before the harsher slowdown in **12 of 18** (max-12: 11 of 17). "Often" holds. **Controls:** bogus id → 404, published FF/UNRATE values asserted, self ρ = 1.00. An oracle (Δunemployment vs level) wins **34/34**. My first pair script misread the columns; its row count (12, not 13) caught it.

**Free pick: lesson 35's simulator, contraction → "Cut toward zero".** *"credit left cheap for long enough feeds the next expansion's inflation"* had **0** hits across both logs, `CLAIMS.md` and `DECISIONS.md`. Found by a Node scan of markets/signals/policy/sectors/glossary for English sentences no log mentions: 45, nearly all definitions or hypothetical setup (control: the 10-12 peak-rate line was found).
FRED PCEPILFE / PCEPI / FEDFUNDS (control: both indexes average **100.000** over 2017):
| episode | FF ≤ 0.25 | expansion after | core PCE < 2% | headline < 2% |
|---|---|---|---|---|
| 2008-12..2015-12 | 85 mo | 2009-07..2020-02 | **123/128 (96%)**, max 2.06 | 100/128 (78%) |
| 2020-04..2022-03 | 24 mo | 2020-05..2026-08 | 10/76, max **5.64** | 10/76 |
**Premise breaks:** the longest near-zero stretch in the data was followed by a decade of inflation under 2%. "Can feed" is true; "feeds" is not.

#### What shipped
- `policyScenarios.js` `contraction` / `cutToZero` outcome, five languages. en: *"…can feed the next expansion's inflation — the same tension, one turn of the cycle later. It isn't automatic: after the 2008 cut, rates stayed near zero for seven years, and inflation ran below 2% for most of the expansion that followed."* ko/zh/ja/es: the same, with 할 수 있습니다 / 可能会 / ことがあります / puede alimentar. I hand-read all four.
- A 6-line dated comment with the figures, which the build strips.
- W-11.2: I narrowed rather than adding a statistic. The one dated clause is there because a bare "can" still reads as the rule. This is an outcome card, not a glossary entry or a 9-12 card.

#### Verification
| check | result |
|---|---|
| Patch | `scratchpad/speed/patch.mjs`: old ×1 / new ×0 for all 5 before, the reverse after; a repeat refuses |
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's) |
| Guard sees the file | planted *"You should buy stocks now."* → `check-blindspot` **exit 1**; restored (`cmp`) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-pTKx1mEp.js` |
| Bundle | 5 new probes → 1 file each; old en and old zh (`太久，会为`) → 0; the comment's `123 of 128` → 0; nonsense → 0 |
| Live | static `dist/` in the Browser pane, lesson 35 with 29-34 seeded complete. After clicking "Cut toward zero", the new sentence is present and the old one absent in **all five languages** |

#### Step 5: adversarial self-check
- **True?** Target range 0-0.25% from 2008-12-16 to 2015-12-16 is seven years. "Most of the expansion" holds on both headline (78%) and core (96%). I didn't say "the Fed's 2% target": it was formalized only in 2012.
- **Siblings:** a Node scan of the English content (control: the edited sentence matched) found one other hit: lesson 35's 2021 sentence, which is about a decision, not a rule. No conflict.
- **§10.1** plant above. **§10.2 / §10.3** n/a. **§2.3:** a bare year, which the guard allows in outcomes. **DECISIONS / completed work:** `git log -S` shows the sentence unchanged since `2836338`. **No conflict found.**

**Seen, not fixed:** nothing new turned up. The scan's other 44 were definitions or teaching setup, so next run take an open numbered item or another unmeasured surface. The untracked `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine; I left them alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Fed-chair simulator said cheap credit "feeds" the next expansion's inflation; after 2008 it didn't for a decade, so it now says "can", with that example. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I didn't read or touch it.

### 2026-10-12 (scheduled dev-agent; residual of the Bonds run, W-11.2 Dashboard sweep) — the last rate principle no longer says "Where tightening stops shapes how gentle or harsh the slowdown is": a higher peak rate hasn't reliably meant a harsher one. Five languages.

Rules: W-6.2 ok (the previous run was a free pick, so its residual may be taken; the next run may take a residual of this one only once more); W-9.4 n/a. `check-log-size` before: run log 233,655 b, 93.5% of warn, 2.5 runs of headroom, no WARN. W-5.3's pass waits for the WARN (as on 10-07), likely next run.

**Step 3.5: the premise, measured with a control.** The Dashboard's sixth Key Principle says the terminal rate sets how hard the landing is. It got **1** hit across both logs (the previous run's "Seen, not fixed"), so it was never measured. FRED monthly FEDFUNDS / UNRATE / CPILFESL via keyless CSV, `scratchpad/tight/an.mjs` (throws on a bad header or a non-numeric value). A cycle peak is the highest FEDFUNDS within ±12 months, ≥1.75 pts above the trailing-36-month low. Outcome: the highest UNRATE in the next 36 months minus the lowest in the 6 months up to the peak. **Controls:** bogus id → **HTTP 404**; FEDFUNDS 1981-01 = **19.08**, 2023-08 = **5.33**, UNRATE 2009-10 = **10.0** (published, asserted); Spearman of a series with itself → 1.00, with its negation → −0.99 (ties, unhandled).

| peak | FF | real (FF − core yoy) | Δ unemployment, 36m |
|---|---|---|---|
| 1957-10 | 3.50 | n/a | +3.6 |
| 1959-11 | 4.00 | 2.0 | +2.1 |
| 1963-10 | 3.50 | 1.9 | +0.3 |
| 1966-11 | 5.76 | 2.4 | +0.4 |
| 1969-08 | 9.19 | 3.2 | +2.7 |
| 1974-07 | 12.92 | 4.1 | +3.9 |
| 1981-06 | 19.10 | 9.7 | +3.6 |
| 1984-08 | **11.64** | 6.3 | **+0.2** |
| 1989-03 | 9.85 | 5.2 | +2.4 |
| 1995-04 | 6.05 | 2.9 | +0.3 |
| 2000-07 | 6.54 | 4.1 | +2.5 |
| 2007-02 | **5.26** | 2.5 | **+5.6** |

- Excluded: 2019-04 (pandemic, +11.1) and 2023-08 (35 months, +1.1).
- **Spearman, peak vs Δ unemployment: nominal 0.17 (n=12), real 0.22 (n=11).** **The premise breaks:** neither the nominal nor the real terminal rate sorts mild slowdowns from harsh ones.
- **Disposition (W-11.2: narrow, no figure ships):** the line now says the true, weaker thing. The figures go in a comment.

#### What shipped
- `markets.js` `ratePrinciples[5]`, five languages. en *"A higher peak rate hasn't reliably meant a harsher slowdown — other forces matter too."*; es *"Una tasa máxima más alta no ha traído de forma fiable una desaceleración más dura; también pesan otros factores."*; ko *"금리가 더 높이 올라갔다고 해서 경기 둔화가 꼭 더 심했던 것은 아닙니다. 다른 요인도 함께 작용합니다."*; zh *"利率峰值更高，并不一定意味着放缓更剧烈；其他因素也在起作用。"*; ja *"金利のピークが高いほど減速が厳しくなる、とは限りませんでした。ほかの要因も影響します。"*
- A 7-line dated comment above `ratePrinciples` with the figures. It does not ship.
- `scratchpad/tight/patch.mjs`: dry run, then old ×1 / new ×0 asserted for all 6 pairs, and the reverse after; a repeat refuses. A Node sibling scan of `src/` found only this line (control fired).

#### Verification
| check | result |
|---|---|
| `npm test` after | exit 0, 0 FAIL, 1 WARN (O-3's review coverage) |
| `check-blindspot` sees the edit | planted *"You should buy stocks now."* in the en line → **exit 1**; restored (`cmp`-identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-BPevXXKs.js` / `markets-BfsI9HGg.js`, system Node v24.18.0 |
| Bundle | 5 new probes → **1** file each; old en and old zh → **0**; the comment's `FEDFUNDS, UNRATE` → **0**. Controls: the untouched "Real rates" line → 1, nonsense → 0 |
| Live walk | static `dist/` in the Browser pane, Reference → Market Dashboard. New line present and old absent in **all five languages**; the "Real rates" control is present |

#### Step 5: adversarial self-check
- **Is the new text true?** "Hasn't reliably" is ρ ≈ 0.2 with two large counterexamples. It doesn't say tightening is harmless; the lags principle beside it stands. The cycle picker is crude (1980 folds into 1981; 1974's recession began before its peak), and neither changes the two counterexamples.
- **§10.1:** no added line contains advice, and the plant shows the guard reads `markets.js`. **§10.2 / §10.3:** n/a. **§2.3:** every figure is in a comment, and the guard passes.
- **DECISIONS / CLAIMS / completed work:** `tightening stops` returns 0 hits in `DECISIONS.md` and `CLAIMS.md`. The 09-18 S&P principle and the other four lines are byte-identical (diff +12/−5). **No conflict found.**

**Seen, not fixed:** the "speed of change often matters more than the level" principle is still arguable framing, and I didn't measure it. The Learn list's *"Credit: The Most Important Part"* title is item 158's (owner). The untracked `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` aren't mine; I left them alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Market Dashboard said where rate hikes stop "shapes" how harsh the slowdown is. Across 12 hiking cycles the peak rate barely predicted it: 2007's 5.26% came before the worst rise in unemployment, and 1984's 11.64% came before almost none. The line now says that, in five languages. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I didn't read or touch it.

### 2026-10-12 (scheduled dev-agent; free pick, W-11.2 Dashboard sweep) — the Bonds card no longer says "Long maturities move most": they're the most sensitive, but their yields usually rise less. Five languages.

Rules: W-6.2 ok (the previous run's residual was not taken; then a free pick); W-9.4 n/a. `check-log-size` before: run log 228,423 b, 91.4% of warn, 3.1 runs of headroom, no WARN.

**Residual:** L27's "$50" title. Harinck 2007's stake sizes weren't found (one search, one fetch). Still arguable, so no edit.

**Step 3.5: the premise, measured with a control.** The Market Dashboard's Bonds card (`markets.js` `rateEffects`) said *"Long maturities move most"*. `Long maturities` gets **0** hits across both logs and `CLAIMS.md`, so it was never measured. Per unit of yield change it is duration, which is true. Over a hiking cycle it may not be. FRED daily DGS2/5/10/20/30 via keyless CSV; `scratchpad/bonds/an.mjs` prices a constant-maturity semiannual par bond and throws on a bad header or a non-numeric value. **Controls:** bogus id → **HTTP 404**; a par bond priced at its own yield → 100 (asserted); DGS10 2022-03-15 = **2.15**, 2023-07-26 = **3.86**, DFF steps 0.08 → 0.33 on 2022-03-17 (published).

| first → last hike | 2y | 5y | 10y | 30y | 30y yield Δ vs 2y |
|---|---|---|---|---|---|
| 1994-95 | −5.6% | −9.8 | −12.8 | **−16.7** | +1.44 vs +3.05 |
| 1999-2000 | −2.2 | **−3.7** | −3.6 | −0.7 | +0.05 vs +1.21 |
| 2004-06 | −4.5 | **−5.4** | −4.0 | +2.7 | −0.18 vs +2.38 |
| 2015-18 | −3.2 | −4.2 | **−4.3** | 0.0 | 0.00 vs +1.65 |
| 2022-23 | −5.6 | −8.9 | −14.1 | **−25.4** | +1.45 vs +2.97 |

- **The premise holds as a historical claim:** the longest maturity fell most in only **2 of 5** cycles, and moved *least* in the other 3. Its yield rose less than the 2-year's in **5 of 5**.
- **Disposition (W-11.2, narrow, no figure ships):** keep the true half (sensitivity), drop "move most", and add the reason it fails. That's the same "most sensitive" form as the Stocks card next to it.

#### What shipped
- `markets.js` Bonds `note`, five languages. en *"Long maturities most sensitive, but their yields usually rise less"*; es *"Los de largo plazo, más sensibles, pero su rendimiento suele subir menos"*; ko *"장기채가 가장 민감하지만, 장기 금리는 대개 덜 오름"*; zh *"长期债券最敏感，但其收益率通常涨得更少"*; ja *"長期債が最も敏感だが、その利回りはたいてい上昇幅が小さい"*.
- A 7-line dated comment under the Cash comment with the figures above. It does not ship.
- `scratchpad/bonds/patch.mjs` asserted old ×1 / new ×0 for all 6 pairs, and the reverse after; a repeat refuses.

#### Verification
| check | result |
|---|---|
| `npm test` before / after | exit 0, 0 FAIL, 1 WARN (O-3's review coverage) both times |
| `check-blindspot` sees the edit | planted *"You should buy stocks now."* in the en note → **exit 1**; restored (`cmp`-identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-U-8-n-U5.js` / `markets-BjgJHM0o.js`, system Node v24.18.0 |
| Bundle | 5 new probes → **1** file each. Old en and old zh → **0**. Comment's `DGS2/5/10/20/30` → **0**. Controls: untouched Stocks note → 1, nonsense → 0 |
| Live walk | static `dist/` in the Browser pane, Reference → Market Dashboard. New note present and old absent in **all five languages**; Cash note control true. `PROBE_ZQX` true → false. Card wraps to 3 lines, like Real Estate |

#### Step 5: adversarial self-check
- **Is the new text true?** "Most sensitive" is duration, and it holds at every maturity step. "Usually rise less" holds in 5/5 cycles against the 2-year, and against the policy rate too (the 30y rose at most +1.45 while the target rose ≥ +1.75). "Usually" leaves room for a cycle where it doesn't. The arrow (Rates ↑ → Price ↓) still holds: the 2y/5y/10y fell in all 5 cycles.
- **§10.1:** the plant proves the guard reads `markets.js`; added lines matching `should buy|sell|recommend|dalio` → **0**. **§10.2:** n/a. **§10.3:** n/a. **§2.3:** all 3 added lines with a year are comments; `npm test` passes.
- **DECISIONS / CLAIMS / LAUNCH_READINESS / README:** `Long maturities`, `rateEffects` → 0, and no `duration` hit concerns bonds. The 09-18 header and its three "Yet…" notes are byte-identical (diff +12/−5). **No conflict found.**

**Seen, not fixed:** the Dashboard's key-insight lines *"The speed of change often matters more than the level itself"* and *"Where tightening stops shapes how gentle or harsh the slowdown is"* are 0-hit and unmeasured. They're arguable framing, not picked by default. The untracked `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are not mine, and I left them alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Market Dashboard said long bonds "move most" when rates rise. They're the most rate-sensitive, but in 3 of the last 5 hiking cycles the 30-year moved least, because long yields barely rose. The card now says both, in five languages. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-12 (scheduled dev-agent; free pick, after the previous run's residual held) — loss aversion is no longer "consistently roughly twice": that is the classic estimate, and later meta-analyses range from about that down to near 1. L19, L27 + its figure, one quiz explain; five languages.

Rules: W-6.2 ok (residual measured and not taken; then a free pick); W-9.4 n/a. `check-log-size` before: run log 223,314 b, 3.7 runs of headroom, no WARN.

**The residual first: the Stocks card's *"Growth names most sensitive"*. It holds, so no edit.** Ken French VW monthly (`6_Portfolios_2x3`, `12_Industry`), first hike → last hike for the last 5 cycles: growth beat value **3/5** (big-cap legs 4/5), tech beat utilities **4/5**, market up **5/5**. But over the **first 12 months** after the first hike, growth trailed value **4/5** and tech trailed utilities 3/5. Under the card's "all else equal" heading the push claim stands. Controls: 1999 / 2022 growth-value and 2008 market reproduce the 09-18 run's figures exactly; a bogus French URL → 404.

**Step 3.5, the pick.** L27 said research *"consistently finds that losses feel roughly twice as painful"*. So did its takeaway, L19, a quiz explain and the figure (*"felt twice over"*, drawn 1 : −2). The archive only asserted it (l.3794). Measured against the abstracts:
- **Tversky & Kahneman 1992: λ 2.25** (the control: the classic figure comes back).
- **Brown, Imai, Vieider & Camerer, JEL 2024** (607 estimates): mean **1.955** [1.82, 2.10], median **1.69**.
- **Walasek, Mullett & Stewart, J Econ Psych 2024:** **1.31** [1.10, 1.53].
- **Yechiam & Zeif, J Econ Psych 2025**, re-analyzing Brown's data: about **1.07**, not significantly above 1, in symmetric, unordered designs.
- **Premise holds:** "about twice" is one end of the range, and "consistently" is false.
- **Disposition (W-11.2):** short surfaces drop the number ("often … more"); only L27's body gives the range. The figure keeps its 2x drawing, captioned as the classic estimate.

#### What shipped (31 + 5 strings, 11 files)
- **L27 §1:** "usually sharper and lasts longer" → "often sharper". Research sentence: *"…put the gap at about twice in its classic estimate; later reviews of many studies range from about that to well below it, and in some designs close to none."*
- **L27 takeaway:** "often aren't felt equally — a loss can hurt more". **L19:** "often finds that losing something feels worse". **Quiz explain:** "feel more painful than". The answer key and options are unchanged.
- **Figure:** title → *"The same $50, weighed unequally"*. Caption → *"In the classic estimate, the loss registers about twice as strongly"*. Its source comment now cites all four papers.
- es/ko/zh/ja carry the same clauses; L19/L27 ledger re-marked `ai` ×4 after reading each against the new English. `readiness --write`: en 166,954 → **166,991**, still 177 min.
- **Step 5 caught an error before commit:** the draft said later reviews "find it smaller", but Brown's 1.955 *is* about twice. Patch 2 fixed that clause ×5.

#### Verification
| check | result |
|---|---|
| `npm test` before / after | exit 0, 0 FAIL, 1 WARN (O-3); an intermediate §10.4 ledger FAIL cleared by the re-mark |
| `check-blindspot` sees the edit | planted *"You should buy stocks now."* in L27 en → **exit 1**; restored (`cmp`-identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-4PjajpAk.js`, system Node v24.18.0 |
| Bundle | final-text probes ×5 languages, title, caption, quiz → **1** each. Old strings and draft "find it smaller" → **0**; comment's `Yechiam` → 0. Controls: untouched L27 sentence → 1, nonsense → 0 |
| Live walk | static `dist/` (first-pass build), lesson 27: new body, takeaway, caption, title present and old absent in **all five languages**. DOM probe true → false. Patch 2's clause: bundle probe only |

#### Step 5: adversarial self-check
- **Is the new text true?** Classic ≈ 2.25; "about that to well below it" spans 1.955 / 1.69 / 1.31 / 1.07; "close to none" is Yechiam & Zeif.
- **§10.1:** the plant fired, and no added line contains advice (0 hits). **§10.2:** `dalio` in added lines → 0. **§10.3:** n/a. **§2.3:** the years are in a comment, and the guard passes.
- **DECISIONS / CLAIMS / LAUNCH_READINESS / README:** no loss-aversion ratio recorded (0 hits). **No conflict found.**

**Seen, not fixed:** (1) L27's title *"Why Does Losing $50 Hurt More…"* and the quiz's correct option *"feels far heavier"*. Harinck et al. 2007 report it reverses for *small* amounts; stake sizes not found. Arguable. (2) Untracked `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are not mine; left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the loss-aversion lesson said research "consistently" finds losses hurt "twice" as much. That is the 1992 estimate; 2024-25 meta-analyses range from about 2 down to about 1. Five surfaces now say so, in five languages. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-12 (scheduled dev-agent; free pick, W-11.2 Dashboard sweep) — the Cash card no longer says its yield "tracks the policy rate": it moves with it, often by less. Five languages.

Rules: W-6.2 ok (free pick; the previous run's two residuals were measured and closed by it); W-9.4 n/a. `check-log-size` before editing: run log 218,022 b, 87.2% of warn, 4.4 runs of headroom, no WARN, so W-5.3's archiving pass is not due yet.

**Step 3.5: the premise, measured with a control. It holds.** The Market Dashboard's rate-effects grid (`markets.js` `rateEffects`, Cash card) said *"Yield tracks the policy rate"*. "Tracks" is a claim about size. `Yield tracks` has 1 hit across both logs, and it is the 09-18 run using the string as a bundle *control* (archive l.52457), so it was never measured. It also sat beside the parent guide's 13-17 activity, which 10-10 measured to *"usually moves the same way as the Fed, though often by much less"*. Keyless FRED CSV, `scratchpad/cash/an.mjs`, which throws on a non-numeric value or a header that isn't the requested id. **Controls:** a bogus id → **HTTP 404**; the spliced target reads **5.50** on 2023-08-01 and **0.25** on 2022-03-01 (published); `DTB3` 2023-08-01 = 5.27.
- **3-month T-bill (`DTB3`) share of the target's move:** 2004-06 hikes **88%**, 2015-18 **97%**, 2022-23 **94%**. Cuts since 2024-09: **63%**, because bills move ahead of the target.
- **National average savings rate (`SNDR`, from 2021-04):** 2022-23 **0.06 → 0.43, 7%** of +5.25. Cuts since 2024-09: **6%**.
- **Disposition (W-11.2, narrow, no figure ships):** "tracks" is true for one kind of cash and false for the kind most learners hold, and the card just says "Cash". So "tracks" becomes "moves with … often by less", which is true for both. I did not name T-bills or money-market funds: §10.1, and 10-10 made the same choice when it left out "high-yield".

#### What shipped
- `markets.js` Cash `note`, five languages. en *"Yield moves with the policy rate, often by less"*; es *"…se mueve con la tasa de política, a menudo menos"*; ko *"…같은 방향으로 움직이지만, 폭은 더 작은 경우가 많음"*; zh *"…同向变动，但幅度往往更小"*; ja *"…同じ向きに動くが、幅は小さいことが多い"*. ko/zh/ja reuse the parent guide's 같은 방향 / 同向 / 同じ向き and 폭 / 幅度 / 幅 terms.
- A 6-line dated comment under the `rateEffects` header with the figures above. It does not ship.
- Patcher `scratchpad/cash/patch.mjs`: old ×1 / new ×0 asserted for all 6 pairs before writing, and the reverse after. A repeat run refuses (exit 1).

#### Verification
| check | result |
|---|---|
| `npm test` before / after | exit 0, 0 FAIL, 1 WARN (O-3's review coverage) both times |
| `check-blindspot` sees the edit | planted *"You should buy stocks now."* in the en note → **exit 1**; restored (`cmp`-identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-CUw4DTsD.js` / `markets-Of3SO99q.js`, system Node v24.18.0 |
| Bundle | 5 new probes (one per language) → **1** file each. Old en and old zh → **0**. Comment's `SNDR 0.06` → **0**. Control: the untouched Bonds note → 1. Nonsense probe → 0 |
| Live walk | static `dist/` in the Browser pane, Reference → Market Dashboard. New note present and old absent in `innerText` in **all five languages**. **DOM control:** injected `PROBE_ZQX` read true, then false. Screenshot shows the card wrapping cleanly |

#### Step 5: adversarial self-check
- **Is the new text true?** "Moves with" holds in every hike and cut leg, for both series. "Often by less" holds for both: T-bills moved 63-97% and savings 6-7%. "Often" leaves room for a bill moving one-for-one over a short window. The arrows (Rates ↑ → Yield ↑) are unchanged and still right.
- **§10.1:** the plant proves the guard reads `markets.js`, and no product is named in shipped text. **§10.2:** `dalio` in added lines → 0. **§10.3:** n/a. **§2.3:** the dates are in a comment, `npm test`'s scan of `markets.js` comments passes, and the bundle probe shows the comment doesn't ship.
- **DECISIONS / CLAIMS / LAUNCH_READINESS / README:** `tracks the policy rate`, `policy rate`, `rateEffects` → 0 hits. This narrows one note that the 09-18 rewrite kept as the textbook direction. That rewrite's three "Yet…" notes and its header are byte-identical (diff +11/−5, all in the Cash block and the new comment). **No conflict found.**

**Seen, not fixed:** *"Growth names most sensitive"* (the Stocks card) is also unmeasured: a superlative, and growth is widely reported to have beaten value through the 2015-18 hikes (not measured here). It is arguable and needs Tiingo style-ETF data, so it is not picked by default. The untracked `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are not mine, and I left them alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the Market Dashboard said cash yields "track" the Fed's rate. T-bills do (88-97% of each hike), but the average savings rate moved 7% of 2022-23's hikes, so the card now says "moves with the policy rate, often by less", in five languages. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-11 (scheduled dev-agent; free pick, W-11.2 sweep, after the previous run's two residuals broke) — M2 is no longer "mostly created when banks lend, not by the central bank". Dashboard M2 note + glossary "M2", five languages.

Rules: W-6.2 ok (residuals measured, neither taken; then a free pick); W-9.4 n/a. **Judgment call under W-11.2:** it says to take an open numbered item when residuals turn up nothing. Every open one (117, 140, 143, 149, 76) says not to pick it over content, so I continued the Dashboard sweep.

**Step 3.5, the residuals first.** (1) Balance-sheet caption *"each expansion came from buying bonds"*: **premise broke.** FRED `WALCL` vs `WSHOSHO` between the five bar endpoints: securities moved **105% / 87% / 94% / 93%** of total assets. The fall-2008 lending spike is real (assets 0.93 → 2.26T while securities stayed at 0.48 → 0.49T), but it unwound before QE3's end, and the caption describes bar-to-bar change. Control: `WSHOSHO` at 2014-10 = $4.22T, the known SOMA level. No edit. (2) *"Beautiful vs Ugly Deleveraging"*: lesson 34 heading, Dashboard dial and anchors in five languages. Whether a Dalio coinage counts as "name-brand framing" is item 158's §10.2 scope question, the owner's. Not a run's call.

**Step 3.5, the pick.** The Dashboard M2 note said *"Mostly created when banks lend, not by the central bank."* Glossary "M2" said the same as the premise of its last sentence. `when banks lend` / `Mostly created` → **0** hits across both logs, `CLAIMS.md` and `DECISIONS.md`: never measured. FRED keyless CSV (`M2SL`, `TOTLL`, `TOTBKCR`, `WSHOSHO`), script `scratchpad/bs/m2.mjs`, which throws on any non-numeric value:
- **2020-02 → 2021-12:** M2 **+$6.0T**, bank loans **+$0.6T** (10%), Fed securities **+$4.4T**.
- **2008 → 2025:** loans grew by **46%** of M2's growth (bank credit including securities: 70%).
- **Control, 1973-2007:** loans **91%** of M2's growth (1990-2007: 104%). The old note described that era.
- The QE lesson already says the Fed buys *"from banks and investors"*; buying from investors creates deposits.
- **Disposition (W-11.2, narrow, no figure):** delete "mostly … not by the central bank". The note says QE can add to M2. The glossary keeps only the true premise.

#### What shipped
- `markets.js` M2 `note`, five languages: en *"Banks create it when they lend, and QE can add to it too."* es `la QE` / ko 양적완화 / zh 量化宽松 / ja 量的緩和, matching the M0 note's terms.
- `glossary.js` "M2" `f`, five languages: en *"Because banks create it when they lend, M2 can grow or shrink even while the monetary base is unchanged."* The sentence is 46 chars shorter.
- A 9-line dated comment under the 10-11 M0 paragraph. It does not ship.
- Patcher `scratchpad/bs/patch.mjs`: old ×1 / new ×0 before, reverse after. A repeat run refuses 11/11.

#### Verification
| check | result |
|---|---|
| `npm test` before / after | exit 0, 0 FAIL, 1 WARN (O-3) both times |
| `check-blindspot` sees the glossary edit | planted *"You should buy stocks now."* → **exit 1**; restored (`cmp`-identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-DgWcCfsV.js`, system Node v24.18.0 |
| Bundle | 6 new-string probes (en/ko/ja note, en/zh/es glossary) → **1** each. Old en note, old en glossary clause, old zh note → **0**. Comment's `TOTLL` → **0**. Control: untouched M2 `contains` → 1. Nonsense probe → 0 |
| Live walk | static `dist/`, Browser pane. Dashboard: new note present, old absent, in **all five languages**. Glossary: en and ja new present, old absent, untouched `ex` present. **DOM control:** injected `PROBE_ZQX` read true, then false |

#### Step 5: adversarial self-check
- **Is the new text true?** Bank lending creates deposits, and QE purchases from non-banks create deposits directly. "Can" keeps it from claiming every QE dollar lands in M2. The glossary's conclusion still follows from its narrowed premise.
- **§10.1:** the plant proves the guard reads the edit. **§10.2:** `dalio` in added lines → 0. **§10.3:** n/a. **§2.3:** no level, rate or date ships, and the comment uses `YYYY-MM` (the guard scans comments here).
- **DECISIONS / CLAIMS / LAUNCH_READINESS / README:** `when banks lend`, `money supply`, `M2`, `not by the central bank` → 0 hits. **No conflict found.**

**Seen, not fixed:** nothing new beyond the two residuals above. Untracked `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs` are not mine and were left alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the app said M2 is created "mostly by banks, not the central bank", but in 2020-21 M2 rose $6T while bank loans rose $0.6T. It now says QE can add to it too, in five languages. One question for you, under item 158: does "beautiful/ugly deleveraging" (a Dalio coinage, used in lesson 34 and the Dashboard) fall under §10.2? Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-11 (scheduled dev-agent; free pick, W-11.2 sweep) — M0 is no longer "the only tier a central bank sets directly": the base rose during much of QT2. Market Dashboard note + glossary "M0", five languages.

Rules: W-6.2 ok (free pick); W-9.4 n/a. The glossary was declared clean 10-05, and this is not a re-read: the claim was found on the Dashboard, and the glossary carries the same sentence.

**Step 3.5: the premise, measured with a control.** The Market Dashboard's money-supply card said the monetary base is *"The only tier a central bank sets directly. QE expands it, QT shrinks it."* Glossary "M0" said *"the only one the central bank controls directly"*. FRED, keyless CSV (`BOGMBASE`, `WALCL`, `WRESBAL`, `RRPONTSYD`, `WTREGEN`), script `scratchpad/m0/an.mjs`:
- **QT2 (runoff from 2022-06):** the Fed's assets fell in **40** months, and the base **rose in 18 of them**. It went from **$5.51T** at QT's start to a high of **$5.90T (2024-02)** while assets fell 8.92 → ~7.6T. The offset was the reverse-repo facility draining **$2.16T (2023-06) → $0.44T (2024-06)** into reserves. Over all of QT2, assets fell $2.33T and the base fell only $0.21T.
- **QT1 (2017-10 → 2019-08):** the base fell with assets (−$0.56T vs −$0.68T).
- **Control (QE):** 2008-08 → 2014-10, assets +$3.5T and base +$3.15T. The script also throws on any non-numeric value.
- **Disposition (W-11.2):** QE and QT push the base, but the TGA, the reverse repo and cash demand move it too, and the Fed sets none of those. So the edit deletes "only … directly", keeps the direction and adds "but other flows move it too". The figures stay in the source comment.

#### What shipped
- `markets.js` M0 `note`, all five languages: en *"The tier a central bank creates. QE expands it and QT shrinks it, but other flows move it too."* es/ko/zh/ja carry the same three clauses (es `lo`, which agrees with `nivel`).
- `glossary.js` "M0" `f`, all five languages: the same deletion and clause (es `la`, agreeing with `medida`). The edited en sentence went 149 → 128 chars.
- A 9-line dated comment above `moneyAggregates`. It does not ship.
- Patcher `scratchpad/m0/patch.mjs`: old ×1 / new ×0 asserted before writing and the reverse after. A second dry run refuses (exit 1).

#### Verification
| check | result |
|---|---|
| `npm test` before | exit 0, 0 FAIL, 1 WARN (O-3 review coverage) |
| `npm test` after | first run **exit 1**: §2.3 caught "June 2022" in *my comment* (the guard scans comments in `markets.js`). Reworded to `2022-06`; then **exit 0, 0 FAIL, 1 WARN** |
| `check-blindspot` sees the glossary edit | planted *"You should buy stocks now."* → **exit 1**; restored (`cmp`-identical) → **exit 0** |
| Build | `build-out-of-tree.sh --no-copy-back` **exit 0**, `index-YjTsRbZj.js`, system Node v24.18.0 |
| Bundle | en/ko/ja new clause → **2** occurrences each (note + glossary), in `markets-*.js`. Old en note, old en glossary clause, old zh note → **0**. Comment's `RRPONTSYD` → **0**. Control: the untouched M0 `contains` → 1. Nonsense probe → 0 |
| Live walk | static `dist/`, Browser pane. Market Dashboard: new note in `innerText` in **all five languages**, old absent. Glossary (en): new present, old absent. **DOM control:** injected `PROBE_ZQX` read true, then false after removal |

#### Step 5: adversarial self-check
- **Is the new text true?** The base is currency plus reserves, both of them Fed liabilities. The QE/QT direction is measured (QE1-3, QT1), and so is "other flows" (QT2, 18 of 40 months). "Shrinks" stays as the direction of the push, and the new clause keeps it from reading as a guaranteed outcome.
- **§10.1:** the plant proves the guard reads the edit. **§10.2:** `dalio` in the added lines → 0. **§10.3:** n/a. **§2.3:** no level, rate or date ships.
- **DECISIONS / CLAIMS / LAUNCH_READINESS / README:** `controls directly`, `sets directly`, `monetary base`, `M0` → 0 hits. Item 114's M0 naming and `contains` are unchanged (diff 1/1 glossary, 13/5 markets). A reviewer re-running the fetch, `an.mjs`, `npm test`, the plant, the build, the probes and the walk gets the same result. **No conflict found.**

**Seen, not fixed:** (1) The balance-sheet caption says each expansion *"came from buying bonds"*. Fall 2008's jump (0.9 → 2.2T) was mostly emergency lending, before QE1's purchases began. Arguable, not measured. (2) *"Beautiful vs Ugly Deleveraging"* on the Dashboard is Dalio's coinage. Item 158 may cover it; not checked. The untracked `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are not mine, and I left them alone. **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the app said the Fed "sets the monetary base directly", but the base grew through most of 2023 while QT ran. Both places now say other flows move it too, in five languages. Still waiting on you: **O-2**.

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-11 (scheduled dev-agent; **the previous run's named residual (3), the 9-12 seasons card's `why`**, first named by the 10-10 grocery entry as *"Arguable, not measured, not picked by default"*. The previous run was itself a residual pick, so this is the second in a row. W-6.2 rule 1 allows that, and ⛔ **the next run may NOT take a residual of this one.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is a measured accuracy fix carried into four languages. `npm test` was **not** run before editing; the exit 0 / 0 FAIL / 1 WARN baseline is the previous entry's reading, and the post-edit run reproduces it) — **the parent guide's 9-12 seasons card (Reference → Kids → Ages 9-12, `lessons[1].why`) no longer follows its spring → summer → fall → winter metaphor with *"The economy really does move in cycles like this"*. It now says the economy really does move through these phases, but unlike the seasons, no one knows how long each will last: in the US since World War II, growth has lasted anywhere from 1 year to more than 10, and downturns from 2 months to a year and a half.** The card's `text` (the metaphor itself) and the closing "recognizing the pattern…" clause are unchanged. All five languages, plus a dated paragraph in the file's header comment.

**Step 3.5: the premise, measured with a control. It holds.** The residual's claim was that seasons are regular and business cycles are not. "Like this", right after a metaphor whose every phase lasts about three months, tells a parent the cycle keeps a schedule.
- **FRED `USREC`** (NBER recession indicator, monthly, keyless CSV, 1854-12 → present): `scratchpad/seasons/an.mjs` computes run lengths. Since 1945 there have been **12 complete expansions of 12-128 months** (1980-81 shortest, 2009-20 longest) and **13 recessions of 2-18 months**. Recession start to start runs **18-146 months**, which is the "year and a half to more than twelve years" that L32/L33 already ship. One season's length never varies by 10x. A cycle's growth phase varies by more than 10x.
- **Control:** the script reads 128 months for the expansion that began 2009-07, 2 for the 2020 recession and 18 for 2008-09. All three are NBER's own published counts. It also throws on any value other than 0/1. The instrument reads the series correctly.
- **Disposition:** keep the metaphor, since the order of phases is real and that is what a 9-12 card can teach. Fix the `why` that turned it into a schedule. The figures are a dated historical range of the kind L32/L33 ship, not a live market number.

#### What shipped
- `kidsContent.js` 9-12 `lessons[1].why`, all five strings rewritten (**1 line**). es keeps the impersonal register of its sibling `why`s. ko keeps 해요체. ja keeps the plain form (*～たどる*, *～わからない*). The "recognizing the pattern" clause is byte-identical in each language.
- Header comment: a 7-line "measured 2026-10-11" paragraph plus its `//` separator above *"These figures drift"*. It does not ship (bundle probe below).
- Patcher `scratchpad/seasons/patch.mjs` (node, `split/join`): old ×1 / new ×0 / no `"` asserted per string before writing, the reverse after. A second dry run refuses (exit 1). Original in `scratchpad/seasons/orig/`.

#### Verification
| check | result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 1 WARN** (the review-coverage WARN that O-3's closure keeps). §66: *"0/192 pair(s) under 70%"* |
| `check-blindspot` sees the edit | planted *"You should buy stocks now."* before the new en sentence (×1) → **exit 1**. Restored from `scratchpad/seasons/post.js`, `cmp`-identical → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-Soui60Ec.js`, system Node v24.18.0 (`bootstrap-node.sh` → `/usr/local/bin`) |
| Bundle | each of the 5 new probes is in **1** asset. The en, es and ko old probes are in **0**. The comment's `FRED USREC` is in **0** (the comment does not ship). Control: the untouched 5-8 *"Every trade in a real economy works the same way"* is in 1. Nonsense probe: 0 |
| Live walk | served the out-of-tree `dist/` with `python3 -m http.server`, opened it in the Browser pane, Reference → Kids → Ages 9-12. `innerText` carries the new sentence and not the old one in **all five languages** (switched via the language select, then set back to en). The metaphor `text` still renders. **DOM control:** an injected `PROBE_ZQX` span read true, then false after removal |

#### Step 5: adversarial self-check
- **Is the new text true?** "From 1 year to more than 10": 12 and 128 months. "From 2 months to a year and a half": 2 and 18. Dropping 1945's recession, which began before the war ended, leaves the range unchanged (2020: 2, 2008-09: 18). "No one knows how long each one will last": NBER describes cycles as recurrent but not periodic, and the 12-to-128 spread is the evidence. "Really does move through these phases": every post-1945 cycle went expansion → peak → contraction → trough.
- **§10.1:** no product and no action. The plant proves the guard reads this file. **§10.2:** `dalio` in the added lines → 0. **§10.3:** this is a `why`, the field addressed to the parent, and the voice is unchanged. No new blurb, no render change. **§2.3:** a dated historical range (*"since World War II"*), not a current figure. The same span already ships in L32/L33.
- **Completed work:** the three 10-10/10-11 kids fixes and their header paragraphs are byte-identical (`git diff --numstat`: 9 added / 1 removed, which is the card line plus 8 comment lines). **DECISIONS.md / CLAIMS.md:** `seasons` and `cycles like this` → 0 hits. **Would a reviewer get my result?** Yes, by re-fetching `USREC`, re-running `an.mjs`, the patcher's dry run, `npm test`, the plant, the build, the probes and the DOM walk. **No conflict found.**

**Seen, not fixed:** (1) The card's `text` runs Slowdown (fall) → Bottom (winter) as if every slowdown ends in a bottom. Some slowdowns end without a recession (the mid-1990s is the usual example). **Arguable, not measured, not picked by default.** (2) Carried from the previous run: ko's 국민연금 and ja's 健康保険/厚生年金 on the teen paycheck card are country-specific readings for a fluent reviewer (O-3), and that card's `why` ("one of the most common shocks") is an unmeasured population claim. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. None of them are mine, and I touched none of them. Translations are machine-written, under O-3's re-affirmed (Beta). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the parent guide's 9-12 card compared the economy to the four seasons and then said it "really does move in cycles like this". But seasons keep a schedule, and US expansions since 1945 have lasted from 1 year to almost 11. The card now keeps the metaphor and says plainly that, unlike the seasons, no one knows how long each phase will last, with the measured range. All five languages. Still waiting on you: **O-2** (analytics account).

**Schedule:** the cron is the owner's lever; I did not read or touch it.

### 2026-10-11 (scheduled dev-agent; **the previous run's named residual (2), the 13-17 paycheck card's "income tax"**. Its "Seen, not fixed" called it *"Not measured"*. The previous run was a free pick, so W-6.2 rule 1 allows this, and **the next run may take a residual of this one only once more.** **W-9.4 does not bind:** neither of the previous two runs was a short-string hand read, and this is a measured accuracy fix carried into four languages. `npm test` was **not** run before editing; the exit 0 / 0 FAIL / 1 WARN baseline is the previous entry's reading, and the post-edit run reproduces it) — **the parent guide's teen paycheck card (Reference → Kids → Ages 13-17, `lessons[5].text`) no longer lists "income tax, plus payroll taxes for Social Security and Medicare" as what separates gross from net pay, as if income tax came first. en/es now say the difference is taxes withheld before you're paid; on a small part-time paycheck most of it is usually Social Security and Medicare, and the federal income tax withheld is often zero, because the withholding tables don't take income tax from pay that low. ko/zh/ja, which describe their own countries' systems, keep their text and add one hedged sentence: small part-time pay often has no income tax withheld.** All five languages, plus a dated paragraph in the file's header comment.

**Step 3.5: the premise, measured with a control. It holds, and it is stronger than the residual said.** The 10-01 run that added "income tax" to en/es (archive l.55510) justified it as *"usually the larger withholding"*. That was not measured, and for this card's reader it is backward.
- **IRS Pub 15-T (2026), Worksheet 1A, Single, standard W-4** (WebFetch of irs.gov/publications/p15t): line 1g **$8,600**; the table's first row is $0 to **$7,500 → $0**, then 10% to $19,900, then $1,240 + 12% to $57,900. **Control:** $8,600 + $7,500 = **$16,100**, which is the 2026 standard deduction the IRS published separately (IR-2025-103, Rev. Proc. 2025-32). Two IRS sources agree, so the table was read correctly. **No federal income tax is withheld below $16,100 a year annualized, about $309.62 a week.**
- **`scratchpad/pay/wh.mjs`** (the worksheet in Node; it throws if the zero bracket ≠ the standard deduction): at $284/wk, $0 income tax against $21.73 of Social Security + Medicare (7.65%). At $400/wk, $9.04 against $30.60. A $600/wk full-time summer job: $30.08 against $45.90. **Income tax withholding first exceeds Social Security + Medicare at about $50,200 a year annualized.** A hand calculation gives $50,115, which agrees.
- **Who this card is about:** BLS CPS 2024 annual averages, table 38: median weekly pay of part-time wage and salary workers aged 16-24 was **$289 (men) / $284 (women)**. 2024's zero ceiling was $14,600/52 = $281. So the median sat just above it: **just under half had nothing withheld, and at the median it was under $1 a week.** There is no 16-19 row; teens earn less than 16-24, so this is a conservative bound. **Disposition: keep the card's point (gross ≠ net, and that is normal), fix the composition.**
- **ko/zh/ja** were localized on 10-01 to their own systems. I web-checked each zero threshold and did not fluent-read: **KR** simplified withholding table, 0 for a single earner at or under ₩1.06M/month. **JP** monthly table, column 甲, 0 under ¥88,000 (column 乙, used when no dependents form is filed, withholds 3.063%). **CN** cumulative method, 0 while cumulative wages stay under ¥5,000 × months employed. A 劳务报酬 payment over ¥800 IS withheld. All three are hedged with "often" (`많아요`, `往往`, `ことも多い`), and no figure ships.

#### What shipped
- `kidsContent.js` 13-17 `lessons[5].text`, en/es rewritten mid-string; ko/zh/ja +1 sentence each (**5 strings, 1 line**). es keeps tú. ko keeps 해요체. ja keeps the plain form (*～だ*, *～よ*).
- Header comment: a 15-line "measured 2026-10-11" paragraph plus its `//` separator above *"These figures drift"*. It does not ship (bundle probe below).
- Patchers `scratchpad/pay/patch.mjs` and `patch2.mjs` (node, `split/join`): old ×1 / new ×0 / no `"` asserted per string before writing, the reverse after. A second dry run refuses (exit 1) for each. Original in `scratchpad/pay/orig/`. All five strings read back out of the imported module: 0 U+FFFD.

#### Verification
| check | result |
|---|---|
| `npm test` (en/es only) | **exit 0 but 2 WARN**: §66 flagged `13-17.lessons[5].text` ko 0.31 / zh 0.22 / ja 0.28, because the English grew and they did not. **This is why ko/zh/ja carry the hedge.** Adding them to `READ_COMPLETE` would have been false, since they did not carry the new content |
| `npm test` (final) | **exit 0, 0 FAIL, 1 WARN** (the review-coverage WARN that O-3's closure keeps). §66: *"0/192 pair(s) under 70%"* |
| `check-blindspot` sees the edit | planted *"You should buy stocks now."* before the new en sentence (anchor ×1) → **exit 1, §10.1 FAIL**. Restored from `scratchpad/pay/post.js`, `cmp`-identical → **exit 0** |
| Build | `scripts/build-out-of-tree.sh --no-copy-back` **exit 0**, `index-ZUDDwy0L.js`, system Node v24.18.0 (`bootstrap-node.sh` → `/usr/local/bin`) |
| Bundle | each of the 5 new probes is in **1** asset. The en, es and ko old probes are in **0**. The comment's `IR-2025-103` is in **0** (the comment does not ship). Control: the untouched 5-8 *"Every trade in a real economy works the same way"* is in 1. Nonsense probe: 0 |
| Live walk | served the out-of-tree `dist/` with `python3 -m http.server`, opened it in the Browser pane, Reference → Kids → Ages 13-17. `innerText` carries the new sentence and not the old one in **all five languages** (switched via the language select, then set back to en). **DOM control:** an injected `PROBE_ZQX` span read true, then false after removal |

#### Step 5: adversarial self-check
- **Is the new text true?** "Most of it is usually Social Security and Medicare": federally, up to about $50,200 annualized. A state income tax at teen pay (low brackets, small amounts) does not close a gap of $20+ a week. "Usually" covers the exceptions I know of: the student FICA exemption for work at one's own school, and a minor working for a parent's sole proprietorship. "The federal income tax withheld is often zero": just under half at the 16-24 median, and more for 16-19. "Withholding tables don't take income tax from pay that low": the zero bracket on a standard W-4. The text does not mention claiming exempt on a W-4, which would be advice-adjacent.
- **§10.1:** no product and no action. The plant proves the guard reads this file. **§10.2:** `dalio` in the diff → 0. **§10.3:** same voice and shape as the card's other strings. No new blurb, no render change. **§2.3:** no date or figure in shipped text. The figures live only in the comment, which the bundle probe shows does not ship.
- **Completed work:** this narrows the 10-01 run's en/es addition and keeps everything else that run built. ko/zh/ja's taxes-vs-premiums split is byte-identical, and income tax is still named in en/es. The 09-20 and 10-10 header paragraphs are untouched (`git diff --numstat`: 17 added / 1 removed: the card line, rewritten, plus 16 comment lines). **DECISIONS.md / CLAIMS.md:** nothing rules on this string. **Would a reviewer get my result?** Yes, by re-fetching Pub 15-T and BLS table 38, re-running `wh.mjs`, the patchers' dry runs, `npm test`, the plant, the build, the probes and the DOM walk. **No conflict found.**

**Seen, not fixed:** (1) ko still lists 국민연금 among a first paycheck's deductions. In Korea, workers under 18 are generally not compulsory National Pension members. ja still lists 健康保険/厚生年金: in Japan, students are generally outside part-timer social-insurance coverage. **Both not measured, and both are country-specific readings for a fluent reviewer (O-3).** (2) The card's `why`, *"one of the most common shocks of a first real paycheck"*, is an unmeasured population claim. **Arguable, not picked by default.** (3) The previous run's seasons residual (9-12 `why`) is still open. `Migration/`, `UIUX/` and `scripts/fix-agent-skill.mjs` are still untracked. None of them are mine, and I touched none of them. Translations are machine-written, under O-3's re-affirmed (Beta). **W-8.1:** committed, not deployed.

**Owner-facing, one line:** the parent guide's teen paycheck card listed income tax first among what comes out of a first paycheck. For a teen's part-time pay, federal income tax withheld is often $0 (nothing below $16,100 a year in 2026), and Social Security + Medicare is the bigger piece until about $50,000. The card now says so in English and Spanish, and ko/zh/ja add a hedged line that small part-time pay often has no income tax withheld. Still waiting on you: **O-2** (analytics account).

**Schedule:** the cron is the owner's lever; I did not read or touch it.
