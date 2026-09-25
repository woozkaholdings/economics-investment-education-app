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

94. **✅ DONE 2026-09-22 (scheduled dev-agent) — the whole item, replaced by its conclusion per W-7.2
    rule 1.** The `essentials` track's abridged translations are closed: **0 abridged pairs across all
    44 lessons in all four languages** (`npm run translation-completeness`). Filed 2026-08-24 at 48
    pairs / 12 lessons; closed one lesson per run in the order **1, 6, 10, 9, 3, 2, 8, 5, 7, 4, 11, 14**
    across 2026-09-20/21/22. This item's `npm test` completeness WARN is gone and **W-8.5's priority
    clause expires by its own terms**; the **1 WARN that remains is O-3's 0%-human-review line, not
    this item's** — do not read it as this item still being open.

    ⛔ **What this item did NOT settle, and no run can: O-3.** Every pair it closed is machine
    translation no fluent speaker has read. Human share is **0% in all four languages**. "Fully
    translated" here means *clears this corpus's own volume threshold* and nothing more.

    ⭐ **The finding worth keeping — a lesson-level ratio is structurally blind to within-paragraph
    deletion in whichever language expands most (found 2026-09-22, on the closing lesson).** This item
    budgeted lesson 14 as **three** languages, on the strength of the shipped instrument scoring `es`
    at 0.83 against a 0.812 cut and never flagging it; `LAUNCH_READINESS.md` §10.4 had recorded the
    same reading on 2026-09-05. Measured per paragraph, `es` was abridged in **exactly the same three
    paragraphs** as ko/zh/ja, missing the same clauses — Spanish expands to ~116% of English here, so
    dropping about a quarter of a lesson still clears a lesson-level threshold by 2.2%. The closing run
    edited **four** languages. **The instrument that sees it**, and the one to reuse on any future
    completeness claim, is the **per-paragraph** ratio: split each section body on the paragraph break,
    divide translated by English characters, normalize by that language's p90, and read per paragraph
    rather than per lesson. **Its control is what makes it usable:** over the already-full `essentials`
    lessons (12, 13, 15) it returns **80 cells, minimum 0.705, nothing below 0.70**, while lesson 14
    returned **13 of 24 below 0.70** — the bands do not overlap, so it separates done from not-done
    rather than flagging everything. After the edit lesson 14's own minimum was **0.706**, inside the
    control band.

    ⭐ **Five defect shapes were found under this item, and every one of them survives paragraph
    parity.** Each was found only after the previous instrument had passed the lesson: **(1)
    whole-paragraph deletion** (lessons 1, 2, 6, 8, 9, 10); **(2) numbers cut out of intact
    paragraphs** — lesson 3 matched English 2/3/2 on paragraphs with every figure gone; **(3) a broken
    cross-section dependency** — lesson 5's §2 said "*that* coffee chain" for a shop only English had
    introduced; **(4) a named worked example deleted wholesale while the definition it exists to
    illustrate is kept** — lesson 4's parity was a perfect 3/2/3 and Elena/David read 0/0/0 in all
    four; **(5) uniform within-paragraph clause compression** — lessons 11 and 14, where every sentence
    keeps its subject and loses the subordinate clause carrying the mechanism. **Parity is necessary
    and nowhere near sufficient:** the per-section numeral profile catches (2) and (4), the
    recurring-concrete-noun profile catches (3), and only the per-paragraph ratio above catches (5).

    ⚠️ **Twice the missing clause was the lesson's own hedge — a §10.1 matter, not a completeness
    one.** Lesson 11 dropped English's second hedge ("nor that every fee is unjustified — some
    strategies genuinely cost more to run") in all four languages, leaving a lesson about fees reading
    closer to "cheaper is better" than the English does. Lesson 14 dropped "which is why this lesson
    explains what a will does rather than how to write one" in all four — the sentence that scopes a
    lesson about wills as explanatory rather than a how-to. **Both restorations move the lesson toward
    §10.1, not against it. Check hedge parity, not only volume, whenever an abridged lesson touches
    §10.1.**

    ✅ **The corpus-wide per-paragraph sweep this item asked for ran 2026-09-25, and it came back clean.**
    **1,340 paragraph cells** (44 lessons × 4 languages): **0 parity breaks, 11 cells below 0.70.** Eight
    are lesson 16 §0 ¶2-3 in all four languages — **condensation a 2026-09-19 owner-directed run chose
    on purpose and named so no run "fixes" it** (archive, "fix L13 §0 and L16 next"); leave it. The
    other three (4 ja §1¶1, 9 es §1¶0, 17 es §0¶0) were read in full and are tighter wording with
    every fact kept. Controls: lessons 12/13/15 → 80 cells, min 0.709; dropping one sentence from a
    known-good es paragraph → 0.93 to 0.28. **The main tracks are not abridged in `es`.** Takeaways,
    thinkAbouts, quiz stems/options/explains and glossary `f`/`ex` swept per field the same way: no
    field short in all four languages. ⚠️ **The instrument's blind spot is short strings** (it reads
    only fields ≥60 English chars), and that is where the real defect was: **four `es` quiz stems
    (q002, q003, q005, q006) had dropped the noun ko/zh/ja all kept** — fixed 2026-09-25, see the run log.

    ⭐ **Naming and currency conventions here are MEASURABLE, not choices.** "Maria" appears 9x in the
    English corpus and is carried consistently into every language (es María, ko 마리아, zh 玛丽亚,
    ja マリア), with "Sofia" returning 0 everywhere as the negative control — so lesson 4's Elena/David
    followed an existing precedent rather than being invented. Currency follows each file's own
    dominant form (es `$N`, zh `N美元`, ja `Nドル`); **`ko` is genuinely mixed and must be broken by
    within-lesson consistency instead.** Two splits were found and deliberately left standing, because
    closing either is a corpus-wide call rather than a rider on a translation pass: the cross-module
    `$` vs `美元`/`ドル` split against `moneyVisuals.js`, and the cross-track `普里娅`/`普莉娅` spelling
    of Priya.

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

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read before anything else: item 160's is still clear, item 94's still stands at 23 pairs, so W-8.5 resolves to item 94 alone. The previous run was also a W-8.5 pick rather than a free one, so W-6.2 rule 1 does not arise; its closing note named lesson 8 at 0.5803 and I re-derived that ranking from the instrument's own unrounded ratios rather than inheriting it — **same winner, different third decimal**, see below) — **`essentials` lesson 8, "Insurance", is now fully translated in all four languages.** es 0.68 → **1.08**, ko 0.33 → **0.50**, zh 0.21 → **0.31**, ja 0.28 → **0.43**. Abridged pairs **23 → 19**, abridged lessons **6 → 5**.

**The abridgement had cut the explanations and kept the rules.** English teaches the premium/deductible/limit trade-off through a mechanism: a higher deductible carries a lower premium *because the policyholder absorbs more of the smaller, more common losses, and the insurer only steps in once things get more expensive.* **All four translations compressed that to "and vice versa."** The lesson's subject survived and the reason for it did not — the same defect shape lessons 2 and 3 turned out to have.

Measured before any edit, with controls both ways:

| check | before | after |
|---|---|---|
| paragraph parity vs English (3/3/4) | **2/2/4 in all four** — §0 and §1 each lost a paragraph | 3/3/4 in all four |
| §1's causal clause ("because… only steps in once…") | **absent in all four** | present in all four |
| §1's second §10.1 hedge ("the goal here is understanding…") | **absent in all four** | present in all four |
| `thinkAbout` contrast (what each of the two things is *for*) | **absent in all four** | present in all four |

**The ranking was re-derived, and the re-derivation disagreed with the inherited figure in the third decimal while agreeing on the pick.** The previous run published lesson 8 at 0.5803 and lesson 5 at 0.6410; recomputing relative shortfall (per-language ratio ÷ that language's p90, meaned over four languages) gives **8 at 0.5739 and 5 at 0.6341** — a 0.060 gap, no tie. **The ranking carries its own control**: already-translated lessons score 0.86–0.90 against the six abridged ones' 0.57–0.67, so it separates done from not-done rather than sorting noise.

⚠️ **Paragraph parity is a one-directional instrument, and this run measured which direction.** It fires correctly on lesson 8 (mismatch in all four) and stays quiet on all seven already-translated controls — but it is **also quiet on lessons 4, 11 and 14, which are abridged**. Their compression is inside the paragraphs, which is exactly what lesson 3 found. **Parity proves absence, never completeness; do not close a lesson on it alone.**

**Which is why §2 got measured separately rather than assumed done.** §2 was at 4/4 paragraph parity the whole time and would have passed a parity-only check. Per-section ratios put it at **rel 0.75/0.73/0.73/0.68** against §0 and §1's 0.86–0.91 — **`ja`'s §2 was below the 0.7 abridged threshold on its own.** It had dropped the adverse-selection spiral (*"pushing premiums up for everyone"* — the consequence that makes adverse selection a problem rather than a curiosity) and moral hazard's actual mechanism (*"in ways that make a loss more likely"*). Restored in all four; §2 now reads rel 0.96/0.89/0.87/0.81. **Had this run stopped at the two sections the parity check flagged, it would have reported the lesson closed with its economics still missing.**

**English was recomputed before being carried into four more languages, since a translation run multiplies whatever English says by four.** No English prose was touched: `englishSourceHash` is `0181668ce7d8d531` before and after, and the hash function was shown to discriminate (lessons 2 and 9 hash differently). `git diff --name-only` returns **0 `.en.js` files**.

**Conventions were measured per file rather than chosen.** "this lesson" follows each file's dominant existing form — es `esta lección`, ko `이 강의`, ja `この講`, zh `本课` (each verified in situ). "From the very first dollar" has **no precedent in any of the four files**, so it follows each file's currency word: es `dólar` (7 uses), ko `달러` (35), zh `美元` (65), ja `ドル` (64).

**Verified:** `npm test` exit **0**, 0 FAIL, 2 WARN, exit code read from the command and not through a pipe; completeness now reads **19 not 23**. All **16** rewritten strings read back character-for-character against intent, with a mutation control proving the comparison can fail and a cross-language control (0 leaks across 4 languages × 3 sections). `npm run check-blindspot` green. Build via `build-out-of-tree.sh` ok. **Live DOM render in all four languages** off the built `dist/`: all **36** restored clauses (9 per language) assert present, 0 cross-language leaks, absence-matcher control clean.

⚠️ **The live check failed once, silently, and the control is what caught it.** The first pass reported all 36 clauses missing in all four languages — which reads as a catastrophic edit failure. It was not: the language picker is a `<select>`, my query looked for `button`, nothing was clicked, and **every "result" was the English page measured four times.** The tell was `chars: 5875` identical across all four rows. The re-run sets `value` through the native setter, dispatches `change`, and **carries a positive control that the switch actually happened** (per-language character counts must diverge from English's and the English clause must be gone) — all four now report `switched: true`. **A language-switch assertion without a did-it-switch control is unfalsifiable.**

**The static-server 404 control was built in before any render result was read**, per the standing note: SPA fallback only for extensionless paths, so a bogus asset path returns **404** while a real hashed asset returns **200** and `/` returns 200. Without that, "the page loaded" proves nothing.

**`--write` was not used on the baseline, per the standing note that it re-records every ratio for a one-lesson edit.** The baseline was hand-patched to lesson 8's four values, asserted **4 of 176 moved, all `8.*`**, and the rewrite was **byte-neutral in length** (0-byte delta, 4 lines in `git diff`). The review ledger was moved with its own `mark` command and asserted to have changed **exactly 4 records, all lesson 8**. ⚠️ Note the baseline recorded lesson 8 at es 0.66/ko 0.32/zh 0.20/ja 0.27 while the live report read 0.68/0.33/0.21/0.28 — **pre-existing drift inside the 0.03 tolerance, not created by this run.**

**`LAUNCH_READINESS.md` §10.4: the generated sentence refreshed via `npm run readiness -- --write` (it changed exactly one line), and five hand-written clauses in the same row updated as that row's own rule demands** — the 23/6 counts, the per-lesson enumeration, "twenty-four pairs" → twenty-eight, the remaining-lessons list, and the track-volume fraction.

⭐ **A published figure in that row could not be reproduced, and this run recorded that rather than quietly overwriting it.** The previous run published the `essentials` track at **80.5% of a full translation's volume (es 83.1, ko 78.4, zh 79.9, ja 77.6)**. Three defensible readings of that sentence — aggregate volume ÷ (aggregate English × p90), the mean of per-lesson relative ratios, and the same on the report's rounded 2dp figures — put the identical pre-edit corpus at **79.6%, 80.1% and 80.3%**. None lands on 80.5. **The method was not recoverable from the number**, so the row now carries **82.0% (es 85.6, ko 81.3, zh 82.1, ja 79.2)** *with the method written into the row*, plus the instruction to read the movement as roughly two points rather than as 80.5 → 82.0 exactly. **A fraction with no method attached cannot be updated, only replaced.**

**This was a per-lesson diff and not a threshold move, and that was checked rather than assumed** — the row itself insists on the distinction. The p90 reference is **byte-identical before and after** (es 1.1647922882717465, ko 0.5765462339252909, zh 0.36017897091722595, ja 0.5146968769136558), and the abridged list went 4, 5, 7, **8**, 11, 14 → 4, 5, 7, 11, 14: exactly lesson 8's four pairs left, no other pair was reclassified.

**Adversarial self-check found no conflict.** No Dalio in the new strings (0); no advice-adjacent language (`check-blindspot` green across all five languages, and the restored §1 hedge *strengthens* §10.1 — it puts back the sentence saying the lesson will not tell the reader which combination is right for them); no dates or live-looking figures (0 date-shaped tokens); kids framing untouched; **no Markdown syntax in any of the 16 new strings, with the matcher shown to fire on a planted `**bold**` and a planted `*em*`** (W-8.6's class, checked because I was writing new content strings); no `DECISIONS.md` conflict (content stays `.js`, no state or build changes); and not a redo — **"lesson 8" appears as translated work in neither `AGENT_LOG.md` nor the archive (0 matches in both)**. `HEAD` was re-read at the end and had not moved (`e3ee80e`); `Migration/` and `UIUX/` are the owner's untracked directories and were not touched.

**The standing limit is unchanged and is the honest caveat on this entry: this is machine translation that no fluent speaker of any of the four languages has read.** Human review share is **0% in all four**, and **O-3 — whether this volume of unreviewed translation should keep shipping — remains the owner's call, not a run's.**

**Next by relative shortfall, recomputed after this edit: lesson 5 at 0.6341, then lesson 7 at 0.6551** — a 0.021 gap, closer than the last two picks but still ordered. ⚠️ **Whichever is picked, measure §2-style within-paragraph compression as well as paragraph parity** — this run found the parity check clean on a section that was the worst in the lesson.

⚠️ **W-8.1 is unchanged by this run and is worth restating in one line, because it is the fact that governs everything above:** this correction, like the 29 before it, **is not on the site**. A run is forbidden to push. Deploying is O-5's route 1 or route 2 and it is the owner's.

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read before anything else, and **item 160's has CLEARED** (§65 now reports the longest-option strategy at en **50.0%**, no longer warning) while item 94's still stands at 27 pairs. So W-8.5 resolves to item 94 alone. The previous run was also a W-8.5 pick rather than a free one, so W-6.2 rule 1 does not arise; its closing note named lesson 2, and I re-derived that ranking from the instrument's own unrounded ratios rather than inheriting it) — **`essentials` lesson 2, "Emergency Funds", is now fully translated in all four languages.** es 0.56 → **1.10**, ko 0.29 → **0.51**, zh 0.20 → **0.33**, ja 0.26 → **0.44**. Abridged pairs **27 → 23**, abridged lessons **7 → 6**.

**The abridgement had deleted the entire worked scene and kept only the rule.** English teaches emergency funds through James: a $600 car repair he did not see coming, $50 a week covering it inside three months, and — the sharpest moment in the lesson — what would have happened if that money had been in stocks during a 15% drawdown. **All four translations had no James at all, and neither figure.** What shipped in es/ko/zh/ja was the guideline ("3-6 months of essential expenses") with every concrete instance of it removed, which is the same defect shape lesson 3 turned out to have: *the lesson's subject survived and its evidence did not.*

Measured before any edit, with a control both ways:

| check | before | after |
|---|---|---|
| paragraph parity vs English (3/2/3) | **2/2/3 in all four** — section 0 lost a paragraph | 3/2/3 in all four |
| English amounts present | **5 of 7** in all four (missing `600`, `15`) | 7 of 7 |
| named character | **absent in all four** | James / 제임스 / 詹姆斯 / ジェームズ |
| opener | a definition in all four | the scene, in all four |

**The instrument had to be rebuilt once before any of those numbers were read, and the first version would have reported a false defect.** A naive `$600`-style match reported 10 of 27 amounts "missing" from lesson 3 — a lesson closed clean an hour earlier — because **es writes `$3.000` where English writes `$3,000`**, and CJK writes `1,000美元`. Rewritten to compare numeric *values* across every separator style, it reports **0 missing on all five already-translated lessons (1, 3, 6, 9, 10) and flags only lesson 2** — the discrimination the first version did not have. Both controls fire: an absent value (`7777777`) reports missing in 4/4 languages, a known-present one in 0/4.

**English was recomputed before being carried into four more languages, since a translation run multiplies whatever English says by four.** Both figures hold exactly: $50/week reaches $600 in **12 weeks (2.77 months)**, which is what "within three months" claims; $50/month × 12 = **$600**, the annual insurance bill the sinking-fund example names. No English prose was touched — `englishSourceHash` is `315980b66a7d90d3` before and after, and the hash function was shown to discriminate (lesson 3 hashes differently).

**Conventions were measured per file rather than chosen.** es `$N` with comma separators (55 occurrences, 0 local-form); zh `N美元` (53/0); ja `Nドル` (55/0); **ko left alone deliberately** — it is genuinely mixed (30 `$N` vs 26 `달러`) with no dominant form, so lesson 2's own existing `달러` style was followed. Name transliteration follows lesson 3's precedent in the same files (Priya → 프리야 / 普莉娅 / プリヤ), so James → **제임스 / 詹姆斯 / ジェームズ**, kept Latin in es as that file keeps Priya and Tom.

**Verified:** `npm test` exit **0**, 0 FAIL, 2 WARN, exit code read from the command and not through a pipe; completeness now reads **23 not 27**. All **12** rewritten strings read back character-for-character against intent, with a cross-language control (0 of 36 wrong-language matches) and a mutation control proving the comparison can fail. `npm run check-blindspot` green. Build via `build-out-of-tree.sh` ok. **Live DOM render in all four languages** off the built `dist/`, every restored clause asserted present, 0 cross-language leaks, and an absence-matcher control passing. ⚠️ **No screenshot is offered as evidence**: the Browser pane was hidden, so its pixels came back a flat dark rectangle — the `innerText` assertions are the proof, not the image.

**The static-server 404 control was built in before any render result was read**, per the standing note: SPA fallback only for extensionless paths, so a bogus asset path returns **404** while a real hashed asset returns **200**. Without that, "the page loaded" is unfalsifiable.

**`--write` was not used on the baseline, and the reason is now measured rather than inherited.** `npm run translation-completeness -- --write` re-recorded **54 of 176 ratios** when exactly 4 should move. The baseline was restored from a scratchpad copy proven byte-identical to `HEAD` (`cmp`, not `git checkout --`) and hand-patched to lesson 2's four values only, asserted **4 of 176 moved, all `2.*`**. The review ledger was patched the same way: **8 fields, all `2.*`**.

⚠️ **An inherited style outlier was measured and deliberately NOT fixed.** The baseline is **172 of 176 ratios at 2dp**; the 4 full-precision outliers are lesson 3's, written by the previous run's hand-patch. Lesson 2 follows the dominant 2dp form (which is also what `--write` itself emits). The comparison uses a tolerance, so this is cosmetic — recorded, not swept into an unrelated lesson's numbers.

**`LAUNCH_READINESS.md` §10.4: one generated sentence refreshed via `npm run readiness -- --write` (it changed exactly one line), and the hand-written narrative updated as that row's own rule demands — including a clause that had inverted.** It read *"the optional `essentials` track is about four-fifths absent in every language."* Nine of the fifteen `essentials` lessons have been fully translated since that was written, so measured against each language's own p90 the track now carries **80.5% of a full translation's volume (es 83.1%, ko 78.4%, zh 79.9%, ja 77.6%)** — **the mirror image of what the row claimed.** ⭐ **The transferable part: a prose fraction ages in the direction the work moves, and nothing failed while it was wrong.** The generated sentence two inches above it was correct the whole time; `npm test` guards that one and cannot see this one.

**This was a per-lesson diff and not a threshold move, and that was checked rather than assumed** — the row itself insists on the distinction. The p90 reference is **es 1.16, ko 0.58, zh 0.36, ja 0.51 before and after**, so no other pair was reclassified: exactly lesson 2's four pairs left the list because the work was done.

**Adversarial self-check found no conflict.** No Dalio in any changed file (0 across all five); no advice-adjacent language (`check-blindspot` green, and the new prose describes what an emergency fund is *for*, never what the reader should buy); no dates or live-looking figures (0 date-shaped tokens in all four); kids framing untouched; no Markdown syntax in any of the five languages, with the matcher shown to fire on a planted `**bold**` (W-8.6's class, checked because I was writing new content strings); no `DECISIONS.md` conflict; and not a redo — lesson 2 appears in earlier entries only as a *control* for other lessons' instruments, never as translated work. `HEAD` was re-read at the end and had not moved (`c27e1e3`); `Migration/` and `UIUX/` are the owner's untracked directories and were not touched.

**The standing limit is unchanged and is the honest caveat on this entry: this is machine translation that no fluent speaker of any of the four languages has read.** Human review share is **0% in all four**, and **O-3 — whether this volume of unreviewed translation should keep shipping — remains the owner's call, not a run's.**

**Next by relative shortfall, recomputed after this edit: lesson 8 at 0.5803, then lesson 5 at 0.6410** — a clear 0.061 gap, no tie. **The ranking now carries its own control**: translated lessons 2, 3 and 12 score 0.9082 / 0.9245 / 0.9270 against the remaining six's 0.5803-0.6820, so it is separating done from not-done rather than sorting noise.

⚠️ **W-8.1 is unchanged by this run and is worth restating in one line, because it is the fact that governs everything above:** this correction, like the 28 before it, **is not on the site**. A run is forbidden to push. Deploying is O-5's route 1 or route 2 and it is the owner's.

### 2026-09-20 (scheduled dev-agent; W-6.2 rule 1 does not arise as a block — the previous run was a free pick, so its residual would have been a legal pick #1, but **this run did not take it**: the residual (re-basing lesson 23's $50/$65 on the literature's gentler $100/$110 shape) was re-read against the figure it constrains and left where it is, see "the residual I did not take" below. This was a free pick, from the previous run's own instrument pointed at the one track it had never been pointed at — the `essentials` track. Controls fired both ways: `cross the halfway point between interest and principal` returns 1, `in agent commissions` 7, `the point of maximum pessimism` 4, two nonsense strings 0) — lesson 5, where **Diversification** is `defined-here`, taught on three surfaces that stocks and bonds **"have historically tended to respond to the same conditions differently"** and that this is **"what actually cushions a portfolio during a downturn"**. **That is a description of roughly 1998-2021 presented as the historical record**, and it is the opposite of the three decades before it and of the most recent downturn a learner would remember. **In 2022 US stocks fell about 18% and a broad US bond fund fell about 13% in the same year.**

**Step 3.5 — the premise re-measured before anything was edited, with controls that fired in both directions.**
- **Instruments.** FRED CSV, keyless (`fredgraph.csv?id=`): `GS10` monthly 10-year Treasury yields 1953-2026, `SPASTT01USM661N` OECD US share prices 1957-2026. Tiingo daily `adjClose` (the repo's own key, never printed): `SPY` 1993-, `IEF`/`TLT` 2002-, `AGG` 2003-. **Negative controls: a nonexistent FRED id returns HTTP 404, a nonexistent Tiingo ticker returns HTTP 404** — neither invents an answer.
- **Positive controls — the annual figures reproduce published numbers.** `SPY` 2022 **-18.2%** against the S&P 500 total return's published -18.11%; `AGG` 2022 **-13.0%** against the Bloomberg US Aggregate's published -13.01%; `SPY` 2008 **-36.8%** against -37.0%. The instrument is reading what it claims to read.
- **The long history needed a modelled bond return, and the model is validated rather than asserted.** No keyless Treasury total-return index reaches back past 2023 here (`BAMLCC0A0CMTRIV` and `BAMLCC4A0710YTRIV` are both capped at ~3 years by the graph endpoint, with and without `cosd`), so 10-year total returns were built from `GS10` by the standard par-bond approximation. **Control: against the real `IEF` 2002-2026 it correlates 0.725 month by month, and the annual figures track closely — 2022 modelled -15.4% vs actual -15.2%, 2008 18.4% vs 17.9%, 2021 -3.8% vs -3.3%.** Self-correlation returns 1.000 and the negated series -1.000.
- **Cross-check on the conclusion itself, which is the control that matters most.** The modelled pair (OECD stocks + GS10 bonds) and the actual pair (SPY + IEF) were run over the same four windows: **2003-09 -0.096 / -0.104, 2010-19 -0.492 / -0.451, 2020-21 -0.729 / -0.373, 2022-26 +0.389 / +0.561. Signs agree in all four.**
- **What the record actually says.** Monthly stock/bond correlation: **1970s +0.330, 1980s +0.268, 1990-97 +0.443** — positive, i.e. they moved *together*. Then **1998-2009 -0.192, 2010s -0.492, 2020-21 -0.729**, and **2022-2026 +0.389** again. On rolling 60-month windows the split is total: **0 of 120 windows negative in each of the 1970s, 1980s and 1990s; 120 of 120 negative in the 2010s.** The 10-year window crosses zero around 2001-02.
- **And the cushion itself, year by year.** Of the 20 years since 1958 in which stocks fell, bonds fell too in **5** (1969, 1987, 1994, 2018, 2022) and rose in 15 — so "often" is right and "historically tended to" oversells it. **2008 is the cushion working** (stocks -36.8%, `AGG` +7.9%, `TLT` +33.9%); **2022 is it absent** (stocks -18.2%, `AGG` -13.0%, `TLT` -31.2%), and a 60/40 built from the long series has only 2008 and 1974 worse.
- ⚠️ **An honest limit, stated rather than rounded in my favor.** `SPASTT01USM661N` is a *monthly average* of share prices, so it understates calendar-year swings (it reads 2022 as -9.0% where SPY's month-end series reads -18.2%). **It is used only for correlation signs, never for a figure that reached the app** — every percentage in the shipped text comes from the daily `adjClose` series that reproduces the published numbers above.

#### What shipped (11 files, **0 lines to `scripts/`** — W-6.3)
- **Lesson 5 §2's closing paragraph, all five languages.** "historically tended to respond … differently" → **"often respond … differently — and when they do, that difference is what softens a downturn"**, plus a new paragraph giving the three eras, 2008 as the cushion working and 2022 as it absent.
- **The takeaway, all five languages.** "tend to respond differently … the whole point of holding both, **not a coincidence**" → **"often respond differently … But 'often' is not 'always': in 2022 they fell together."** The old wording's "not a coincidence" was the strongest form of the claim and is the part the record does not support.
- **§0's closing line (English only — the four translations condensed it away years ago):** "a stock and a bond behave differently in the same conditions" → **"often behave differently"**.
- **`lessons.js`: lesson 5 `minutes` 3 → 4.** Not a judgement call — `check-data.mjs` §2 **hard-failed** at 3 after the edit and passed at 4, so the reading-time model was positively validated rather than silently skipped.
- `scripts/translation-completeness-baseline.json`: **lesson 5's four ratios only** (es 0.75→0.80, ko 0.32→0.36, zh 0.20→0.23, ja 0.28→0.31 — the translations *gained* content). ⚠️ **The prescribed fix, `npm run translation-completeness -- --write`, was deliberately NOT used**: it re-records every lesson's ratios, which would have rewritten 32 unrelated figures for a one-lesson edit. Patched by hand and proved: **`diff` against the pre-edit copy shows exactly 4 changed lines, all inside lesson 5.**
- Ledger L5 es/ko/zh/ja re-marked `ai` (the English source hash moved twice — once for the edit, once for the asterisk removal below); `LAUNCH_PLAN.md` / `LAUNCH_READINESS.md` / `CLAIMS.md` generated figures only, via `npm run readiness -- --write` (catalog 173 → 174 min).

#### A defect I introduced, caught by the live render and removed
The new paragraph used `*together*` for emphasis. **The lesson reader does not process markdown** — it renders the asterisks literally, which the DOM read showed. They were removed in all five languages, and a corpus scan confirms **the only remaining emphasis pair in the whole English corpus is the pre-existing `*and*` in this same lesson** (shipped, learner-visible, left alone — see the note below). Had I trusted the source diff instead of the rendered page, this would have shipped.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 3 WARN** — the same three as the pre-edit baseline (coverage 100%/0% human, completeness 47 pairs, quiz length-cue 52.2%). **No new warning** |
| §2 reading-time model | **Proved live, not assumed**: FAILed at `minutes: 3` naming lesson 5, passed at 4 |
| §33 completeness | **Proved live**: FAILed on es and ko before the baseline patch, passed after; `diff` confirms 4 lines touched, 40 other lessons untouched |
| `npm run check-blindspot` | **exit 0**. §10.1 clean across 33 advice patterns × 5 languages; **§2.3 clean across the 26 teaching-copy modules including the ones I edited** — 1970s/2008/2022 are historical, not live-looking |
| Build | `npm run build` fails on this host (iCloud-synced `node_modules` holds one CPU's rollup binary); **`scripts/build-out-of-tree.sh` → ✓ built in 579ms**, mirrored to `dist/` |
| Live render | Served `dist/` statically (**control: a missing path → 404**) and read the real DOM at `#/lesson/5` in **en, zh and ja** — lesson 5 is gated, so lessons 1-4 were marked complete in `localStorage` to reach it. All three show the new paragraph and takeaway, header reads **≈4 min**, no mojibake in the CJK, and the asterisk count is back to the pre-existing 2 |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 — the new prose is descriptive ("stocks fell about 18%"), recommends nothing, and `check-blindspot` passes in all five languages. §10.2 — no name-brand or Dalio dependency added; no researcher or firm is named to the learner. §10.3 — untouched. **Stale-data rule** — §2.3 passes over the exact modules edited, and the era sentence is deliberately written **"in the years after 2022"** rather than "since 2022", so no future year can falsify it (the same guard the 2026-09-19 yield-curve run used).
- **DECISIONS.md.** No conflict: `.js` content modules edited in place, `localStorage` and Vite untouched, four translations marked `ai` per the 2026-08-11 option-(a) decision.
- **Already-done backlog item.** Measured, not assumed: `stock-bond`, `cushions a portfolio`, `60/40`, `bond fund` and `Bloomberg` each return **0** across `AGENT_LOG.md`, the archive, `CLAIMS.md`, `DECISIONS.md` and `LAUNCH_PLAN.md`. The archive's 9 `stock/bond` hits are all item 64's **glossary-vocabulary** work, and its single `correlation` hit is lesson 21's anchoring research. **This claim has never been measured here.**
- **My own verification claim.** A reviewer re-running my commands gets the same result: FRED's CSV route needs no key, the Tiingo series come from the repo's own key, and every control above is one command. **The one thing they should not take from me is the pre-1990s correlation**, which rests on a modelled bond return — it is cross-checked against real data only from 2002 on, and the shipped sentence says "moved together through the 1970s, 1980s and 1990s", a direction, not a figure.
- **Am I padding?** The diff is three sentences plus one paragraph in five languages. The write-up is long because the measurement is the expensive half and the *modelled* half needs its limits on the record.

#### The residual I did not take, and why
The previous run left "re-base lesson 23's $50/$65 on the literature's $100-now-vs-$110-tomorrow shape" as **"a genuine one-run item for a run that wants it"**. Re-read against `moneyVisuals.js`: the figure's x-axis is a *vantage point in months* and its gap between rewards is one month, so the literature's one-**day** gap cannot be plotted on it without rebuilding the axis, the `flipMonths` sampling and `flipCrossing` as well as the five bodies, seven text keys × five languages, the §50 constants and quiz `q025`. **That is not a one-run item, and the previous run had already made the lesson honest** ("some people", figures declared stretched for legibility). Left in place; the note above is corrected rather than deleted so the next run does not re-derive the axis constraint.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **`*and*` in lesson 5 §2 renders as literal asterisks to every learner, in English only**, and it is the corpus's sole instance. The fix is not a string swap — it is the question of whether `LessonReader` should support emphasis at all, which is a renderer decision affecting five languages. **One-line reproduction: open `#/lesson/5` and count `*` in `main.innerText` — it is 2.**
- **The `essentials` sweep's other zero-hit sentences read clean** on inspection: L4's "commonly 300-850" (FICO's published range), L10's "split roughly in half between employer and employee" (7.65% each), L7's withholding mechanics. **The one remaining measurable lead is L5 §0's "Bonds have historically been less volatile than stocks, but they generally offer lower long-run average returns"** — checked in passing and it **holds** on the data above, so it was left alone.
- **The `essentials` track had never been run through the frequency/superlative sweep** before this run; `economy` and `money` had. It is now swept, and the leads are the two lines above.

**Owner-facing, one line:** the lesson that teaches diversification told learners, as historical fact, that bonds respond differently to the same conditions than stocks and that this is what cushions a portfolio in a downturn. That describes roughly 1998 to 2021 and not the record — US stocks and bonds moved *together* through the 1970s, 1980s and 1990s, and in 2022 both fell in the same year, stocks about 18% and a broad bond fund about 13%. Diversification is still sound and the lesson still teaches it; it now says "often" rather than "historically", and gives 2008 as the year the cushion worked and 2022 as the year it wasn't there, in all five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** `check-log-size`'s MEASURED line before this entry read file 607,490 b, run log 167,119 b, floor 440,371 b, 1 live day — quote the next run's own line, not this one. **Backlog:** 0 b added — the residuals above are notes under this entry, per W-6.2 rule 2.

### 2026-09-20 (scheduled dev-agent; W-6.2 rule 1 permits this: the previous run was a free pick, so its residual is a legal pick #1 — the first link in a chain, not the third. The residual it left was the ONE it explicitly declined to fix, on the grounds that the fix was "a renderer decision affecting five languages") — lesson 5 §2 shipped the characters **`*and*`** to every English learner, asterisks and all, and had done for months. **The step-3.5 premise held on the facts and BROKE on the disposition:** the previous run framed the fix as "whether `LessonReader` should support emphasis at all". Measured, the corpus contains **exactly one** Markdown construct in **24,543 strings and keys across 38 modules** — so the question is not whether to build an emphasis renderer for one instance. It is to say the emphasis in words and guard the class. Shipped as a three-word prose fix plus `check-data.mjs` **§84**.

**Step 3.5 — both halves of the premise re-measured before anything was edited, with controls that fire in both directions.**
- **Half 1, "the reader does not process markdown" — CONFIRMED, three ways.** No Markdown dependency in `package.json`; `grep -rn "dangerouslySetInnerHTML" src/` returns **nothing**; `LessonReader.jsx:470` renders `{section.body}` as a plain text child of `<Text style={{whiteSpace:"pre-line"}}>`. React escapes text children, so every character arrives as itself.
- **Half 2, "the only emphasis pair in the English corpus" — CONFIRMED and then WIDENED.** The previous run's claim was scoped to English emphasis. A scan of **all 38 modules under `src/content` and `src/locales`, all five languages**, for six constructs (`*em*`, `**strong**`, `_em_`, `` `code` ``, `[text](url)`, `## heading`) returns **exactly 2 hits, which are one string**: lesson 5 §2 at its source file and again through `lessonContent.js`, the merged view that re-assembles the ten per-track files. Nothing else in the corpus carries markup of any kind.
- **The control that makes those zeros mean something.** A scan returning nothing and a scan that is broken are the same output. All six patterns were run against a synthetic probe module carrying one instance of each: **all six fired, each on its own construct**. A negative probe (`5 * 3 = 15`, `snake_case`, a lone `*`) fired **zero**. The zeros in the real corpus are real zeros.

#### What shipped (4 files, and the prose half is three words)
- **`lessonContent.essentials.en.js`, lesson 5 §2, English only:** `holding stocks *and* bonds` → **`holding both stocks and bonds`**. The stress moves from a typographic mark nothing parses into the word `both`, which every renderer handles. **The four translations needed no edit** — they never had the asterisks (measured, not assumed).
- **`scripts/check-data.mjs` §84 — the guard, +170 lines.** W-6.2 rule 3's sentence, and it is not hypothetical: *a learner reading lesson 5 sees the characters `*and*` printed on the page.* **W-6.3, re-measured here rather than quoted:** `scripts/` **22,572** lines against app code (`src/` minus `content/`+`locales/`) **10,196** — **2.21x**, and this falls on the `scripts/` side. What buys it is that the defect is **invisible in a diff** — `*and*` looks like emphasis to the author and to every reviewer reading the patch, and only the rendered page disagrees.
- `translation-review-ledger.json`: lesson 5's four `sourceHash` values only (the English body moved). **4 lines changed, nothing else** — `git diff` confirms the only altered key is `sourceHash`.
- `LAUNCH_READINESS.md`: generated figures via `npm run readiness -- --write` — **2 lines, 164,169 → 164,172 English chars**, which is exactly the **+3 bytes** my string edit added. An independent cross-check that one string moved. ⚠️ `translation-completeness -- --write` was **not** run (it re-records all 32 ratios for a one-lesson edit); §33 passed untouched, so its baseline needed no patch at all.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 3 WARN** — byte-identical to the pre-edit baseline (coverage 100%/0% human, completeness 47 pairs, quiz length-cue 52.2%). **No new warning** |
| §84 fires on the REAL defect | **Proved by tamper plant**, restored from a scratchpad copy: the original `*and*` string put back verbatim → **FAIL naming lesson 5 section[2] at both paths** (source file and merged view), exactly as the section documents |
| §84 fires on OTHER constructs and OTHER modules | **Proved**: `**Diversification**` planted into a `glossary.js` string value → FAIL naming `glossary.Diversification.en.s` |
| §84's own controls | All three fire: 6 patterns each on their own probe, 5 benign strings unflagged, non-empty corpus |
| `npm run check-blindspot` | **exit 0**. §10.1 clean across 33 advice patterns × 5 languages; §2.3 clean across 26 teaching-copy modules |
| Build | `npm run build` fails on this host (iCloud-synced `node_modules`, one CPU's rollup binary); **`scripts/build-out-of-tree.sh` → ✓ built in 580ms**, mirrored to `dist/` |
| Live render | Served `dist/` statically (**control: a missing path → 404**), unlocked the gate via `ecycles_completed_lessons`, read the real DOM at `#/lesson/5`. **Asterisk count in `main.innerText`: 0**, down from the 2 the previous run measured; the sentence reads "holding both stocks and bonds" |

#### A dead instrument of my own, caught by a plant that FAILED to fire
The second tamper plant aimed `**Diversification**` at `glossary.js` and **§84 stayed green**. The plant had landed on the object **key** (`"**Diversification**": {...}`) and my walker recursed into values only — it never looked at keys. **This is the exact silence the section exists to break, sitting inside the section itself.** Keys are now scanned too: the corpus count went **10,450 → 24,543** with **still zero hits** (so no false positives from keys — `snake_case` and numeric ids are all rejected by the same patterns), and re-planting the identical key-position defect now **FAILs**. ⭐ Had the plant been aimed one character to the right, I would have reported a guard that was blind to every key in the app.

#### A second one, caught by the suite rather than by me
§59 failed my own §84 comment for the British spelling **"emphasised"**. Fixed to `emphasized`. The US-English rule (item 91, 2026-08-21) applies to comments I write, not just to shipped copy.

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 — the diff adds no advice language; the three changed words are `both stocks and`. §10.2 — no Dalio, no named researcher or firm. §10.3 — untouched. **Stale-data rule** — §2.3 passes over the 26 teaching-copy modules; the only date I introduced (`2026-09-20`) is in a `scripts/` comment recording when a measurement was taken, which is this project's convention, and is not learner-visible.
- **DECISIONS.md.** No conflict, and this was the one worth checking, because the obvious alternative fix WOULD have been one: adding a Markdown renderer means a new runtime dependency and a change to how five languages render. `grep -niE "markdown|emphasis|asterisk|rich text" DECISIONS.md` returns **nothing** — so no closed decision blesses a renderer either. **I did not add one**, and §84 now records in the tree why the corpus does not need one.
- **Already-done backlog item.** Measured across `AGENT_LOG.md`, the archive, `CLAIMS.md`, `DECISIONS.md` and `LAUNCH_PLAN.md`: `"literal markup"` **0**, `"§84"` **0**, `"emphasis pair"` **1** (the previous run's note, i.e. this residual). The archive's 43 `markdown` hits were read individually and are **all** about `.md` documentation files — §26's doc-path checks, §59's US-English set, "the diff is two Markdown files". ⚠️ The first attempt to read them used `grep -oiE ".{70}markdown.{70}"`, which **printed nothing** — ugrep aborts on bounded repetition, and an aborted scan is indistinguishable from a clean one. Re-run in Node, which is where the 43 hits came from. **Markup inside rendered content strings has never been guarded here.**
- **My own verification claim.** A reviewer re-running my commands gets my results: every measurement above is one command, the tamper plants restore from scratchpad copies (never `git checkout --`), and both restorations were confirmed **byte-identical by md5** *and* by `git status` no longer listing the file. **The one thing they should NOT take from me is the screenshot** — the browser pane reported `visibilityState: "hidden"` and returned a black image. The live verification here is the **DOM text read**, which ran correctly in that state, and its own control (planting `probe *and* probe` into `main` moved the count 0 → 2 → 0) is what makes its zero load-bearing. I am not claiming a visual check I did not get.
- **Am I padding?** The content diff is three words. The write-up is long because the guard, the two plants and one dead instrument of my own are the substance, not the prose fix.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **The renderer question is now answered by measurement rather than deferred.** The corpus wants emphasis in **one** place, and that place now says `both`. If a future run has a real need for emphasis across five languages, §84 is the thing to change — and it should be changed deliberately, not worked around by deleting an asterisk.
- **§84 reports a lesson-body defect twice** (source file + `lessonContent.js` merged view). That is the honest count — both are real paths to the same string — and is documented in the section rather than de-duplicated, because de-duplicating would hide which file to edit.

**Owner-facing, one line:** the lesson that teaches diversification has been printing `*and*` on screen — asterisks included — to every English learner for months, because someone wrote Markdown emphasis into text that nothing in the app parses as Markdown. It now reads "holding **both** stocks and bonds", which says the same thing in a way every renderer handles. The wider finding is that this was the **only** such instance in 24,543 strings across the whole app, so no Markdown support was added; instead `npm test` now fails if any content string ever carries markup again — a check proved by putting the original defect back and watching it fail. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** `check-log-size`'s MEASURED line before this entry read file 620,591 b, run log 180,220 b, floor 440,371 b, 2 live days — quote the next run's own line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2, and the residual this run closed was never a numbered item.

### 2026-09-20 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run's own residual section declares its class answered — *"the renderer question is now answered by measurement rather than deferred"* — so there was no residual to take and this was a free pick. It came from ranking every content module and screen by last-touch date AND commit count, the instrument the 09-19 glossary run used) — the Sectors screen told learners that **Industrials** is *"Machinery, airlines, railroads and builders."* **Airlines are 2.01% of that sector — the smallest of its twelve industries. Aerospace and defense are 24.98% — the largest — and the line did not mention them.** Three other sector blurbs omitted a top-weight industry the same way. Corrected in all five languages.

**Step 3.5 — the premise broke, and it broke toward making the item BIGGER.**
- **What I picked it as:** *"`src/content/sectors.js` is the least-touched content module — 1 commit, 2026-08-04, 47 days — and has never been swept."* The first half is true (`git log` per module; it is last by both date and commit count). **The second half is false.** Measured across `AGENT_LOG.md` + the archive: this file has been **read by at least three previous runs** (2026-08-27, 2026-09-13, and the 09-19 glossary run), each recording it **"read clean"** — *"eleven definitional sector blurbs with nothing measurable"*.
- ⭐ **That verdict is the defect.** The blurbs ARE measurable: the fund sponsor publishes a **Fund Industry Allocation** for every one of these eleven ETFs, and it disagrees with four of them. "Nothing measurable here" was a statement about where three runs looked, not about the content.
- **A prior run had already seen the smaller half and parked it for exactly the reason I could now remove.** The archive carries, under "Seen, deliberately NOT fixed and NOT numbered": *"`sectors.js` XLI ... **builders** ... GICS puts homebuilders in Consumer Discretionary ... **the ETF composition was not measured this run**. Arguable, not picked."* **This run measured it.** And the measurement says "builders" was not even the biggest problem in that sentence — the missing aerospace and defense was, and no run had noticed it. `aerospace` returns **0** in `AGENT_LOG.md`, the archive, `CLAIMS.md`, `DECISIONS.md` and `LAUNCH_PLAN.md`; so does `payment companies`; so does `XLY`. **Instrument control: `sectors.js` returns 17 in the same scan, so the zeros are real zeros.**

**The measurement, with controls firing in both directions.** Two independent sources per fund, both from the sponsor: the **daily holdings file** (`.xlsx`, parsed from its own zip — 11 funds, 86/50/80/… names, weights summing 99.6-100.0%) and the **published Fund Industry Allocation** (`sectorspdrs.com`, as of **17-Sep-2026**, rows summing 99.99-100.01%).
- **Control 1, the fetch:** a nonexistent ticker (`xzz`) returns **HTTP 404** for the holdings file and a page with **no industry table at all** for the fund page — so neither instrument can invent a number for a fund that does not exist.
- **Control 2, my own classification against theirs:** hand-classifying XLI's 86 holdings into aerospace/defense gives **25.25%** against the sponsor's published **24.98%** — the two agree, which is what licenses reading the holdings files for the questions the industry table does not answer.
- **Control 3, the cross-fund lookup:** the four big US homebuilders resolve to **XLY** — `DHI` 0.97%, `LEN` 0.45%, `PHM` 0.59%, `NVR` 0.44% — and to no other sector fund; `CAT` resolves to XLI at 6.93%. The "builders" question is settled by data rather than by reading GICS prose.

**What the eleven actually look like. 8 of 11 name their largest industry and were left alone** (XLK, XLV, XLE, XLB, XLRE, XLU, XLC, and XLF/XLP/XLY/XLI are the four below). The four that did not:

| sector | the line said | what the sponsor publishes |
|---|---|---|
| **XLI** Industrials | "Machinery, **airlines**, railroads and builders." | **Airlines 2.01% — smallest of 12.** Aerospace & Defense **24.98% — largest — unnamed.** Machinery 20.81%, Ground Transportation 10.10% |
| **XLY** Consumer Discretionary | "…cars, travel, restaurants." | **Retail unnamed and it is the biggest block:** Broadline 26.06% + Specialty 20.10% + Distributors 0.47% = **46.63%**, more than Automobiles (21.52%) and restaurants/leisure (24.98%) apart |
| **XLF** Financials | "Banks, insurers and payment companies." | **Capital Markets 25.53% unnamed** (Banks 28.50%, Insurance 13.31%) |
| **XLP** Consumer Staples | "…food, soap, toothpaste." | **Beverages 20.49% unnamed** (Household Products 16.29%, Food 15.62%) |

#### What shipped (1 file, 20 strings)
- **XLI** → **"Aircraft, defense, machinery and railroads."** Names the top three industries (≈56% of the sector), drops the 2.01% example, and retires the ambiguous "builders" rather than arguing about it.
- **XLY** → "Things people buy when they feel well off — **shopping**, cars, restaurants and travel."
- **XLF** → "Banks, insurers, **investment firms** and payment companies."
- **XLP** → "Things people buy no matter what — food, **drinks**, soap, toothpaste."
- All four in **en/es/ko/zh/ja**, each language keeping its own punctuation convention (es `:`, ko/ja ` — `, zh `——`).
- **A header note in the file** recording the rule ("the `what` line must name where the sector's WEIGHT actually is"), the date, the source, the four corrections and the four figures — plus *"These weights drift. Re-measure before trusting them; do not retype them."* **Zero `scripts/` mass; W-6.3's ratio is unmoved at 2.21x.**

#### Why NO check was added (W-6.2 rule 3, answered rather than skipped)
The learner-visible sentence is easy to write — *a learner reading the Industrials row is told about airlines, 2% of the sector, and not about aerospace and defense, 25%.* **The check is what cannot be built honestly.** Every instrument that would catch it needs a live fetch from the fund sponsor, and `npm test` is offline by design (`--offline` skips even the existing FRED comparison); a committed snapshot of the weights would be a second copy of exactly the kind of figure that just rotted. So the durable artifact is the **header note**, which costs nothing and tells the next run what to re-measure and that it must.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 3 WARN** — identical to the pre-edit baseline (coverage 100%/0% human, completeness 47 pairs, quiz length-cue 52.2%). **No new warning**; readiness figures unchanged and still agreeing (44 lessons / 164,172 en chars / 174 min) |
| `npm run check-blindspot` | **exit 0.** §10.1 clean across 33 advice patterns × 5 languages; §10.2 no Dalio; §2.3 clean across 26 teaching-copy modules, `sectors.js` among them |
| Edit safety | Each of the 20 replacements asserted its old string occurred **exactly once** before writing, and after writing that the old string is **absent** and the new one **present**; the script refuses and writes nothing if any count is off |
| Strings are not garbled | The 20 values were **read back out of the module itself**, not out of the diff: code-point counts printed, **zero U+FFFD, zero lone surrogates**, and 0 missing `name`/`what` fields across 11 sectors × 5 languages |
| Build | `npm run build` fails on this host (iCloud-synced `node_modules`); `scripts/build-out-of-tree.sh` → **✓ built in 567ms**, mirrored to `dist/` |
| In the bundle | All 4 new strings present in `dist/assets/`, all 4 old strings **gone** |
| Live render | Served `dist/` statically, walked Reference → Sector performance in the real DOM: all **11** rows render, all four corrected lines read correctly in **en**, and all four in **ko** with **no U+FFFD**. Old XLI/XLF strings absent. Screenshot confirms the Industrials and Consumer Discretionary rows on screen |
| **The DOM control** | Injecting `PROBE_XYZ` into `<main>` moved the read **false → true → false**, so the "old string absent" zeros are load-bearing rather than a dead read |

#### A dead instrument of my own, caught before it mattered
My first attempt at the header note died in the shell rather than in the file — an apostrophe in *"the sector's WEIGHT"* closed a single-quoted `node -e`, and zsh then tried to execute `//` as a command. It failed loudly and wrote nothing, but it is the same shape as the `$var:path` and bounded-repetition traps already in this log: **a quoting failure that had exited 0 would have left a half-written comment in a content file.** Rewritten as a heredoc script file, which is what the repo's own habit already prescribes.

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 — `check-blindspot` passes; the four new strings are definitional ("Banks, insurers, investment firms…"), contain no timing, recommendation or second person, and name no security to buy. §10.2 — no Dalio, no named firm or researcher. §10.3 — untouched. **§2.3 stale-data rule — the one worth checking, because I deliberately put dates (`2026-09-20`, `17-Sep-2026`) and weights into a file §2.3 polices.** They are in a **comment**, and comments do not ship: `2026-09-20`, `17-Sep-2026`, `sectorspdrs`, `24.98` and `DHI` each return **0 files in `dist/assets/`**, against a control (`Aircraft, defense`) returning **1**. Nothing learner-visible gained a date.
- **DECISIONS.md.** No conflict. `grep -niE "sector|ticker|ETF|SPDR"` returns the market-data adapter decision and the owner's relative-strength formula — both about the *pipeline* and the *ranking*, neither about the plain-language blurbs. No new dependency, no state change, content stays a `.js` module.
- **Already-done backlog item.** The opposite of duplication: this **closes a note a previous run explicitly parked**, on the exact grounds it named ("the ETF composition was not measured"). But the honest version is the one in step 3.5 — **three runs read this file and called it clean**, so the thing being corrected is partly those runs' verdict, and that is written above rather than smoothed away.
- **My own verification claim.** A reviewer re-running my commands gets my results: every figure comes from one fetch and one parse of the sponsor's own files, both controls are in the commands, and the live check is a DOM read with its own injected probe. **One thing they should NOT take from me: the industry *labels* are the sponsor's, but the mapping from "Aerospace & Defense" to the word "defense" on screen is my editorial judgment**, as is "shopping" for Broadline + Specialty Retail. The weights are measured; the plain-language rendering of them is a choice, and four unreviewed languages carry it (O-3).

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **XLRE's "Property owners and landlords, mostly via REITs" is true but flat.** Specialized REITs are **39.32%** of the sector — cell towers and data centers — which is not what "landlords" calls to mind. It passes the test applied here (its largest industry is REITs, and it says REITs), so it was left alone rather than stretched to fit.
- **XLP's largest industry is Consumer Staples Distribution & Retail at 32.96%** — Walmart and Costco, the *sellers* rather than the goods. The line describes the goods on purpose ("things people buy no matter what"), which is the right frame for a beginner; only the missing drinks were fixed.
- **The same question has never been asked of `economicSignals.js` or the glossary's sector entries.** Not measured here; not filed as an item.

**Owner-facing, one line:** the Sectors screen described Industrials as "machinery, airlines, railroads and builders" — but airlines are **2%** of that sector, the smallest slice in it, while **aerospace and defense are 25%**, the largest, and went unmentioned; three other sector descriptions had the same shape of gap (Consumer Discretionary left out retail, which is nearly half of it). All four now name where the money actually is, in all five languages, measured against the fund sponsor's own published industry breakdown with a 404 control and a second, independent cross-check. The wider finding is that **three earlier runs read this file and recorded it "clean — nothing measurable"**, which is why the file now carries a note saying what to measure and that the numbers drift. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** `check-log-size`'s MEASURED line before this entry read file 631,407 b, run log 191,036 b, floor 440,371 b, 2 live days — quote the next run's own line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2, and the note this run closed was never a numbered item.

### 2026-09-20 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run left three notes, and this run took none of them — I read `economicSignals.js`, the surface its third note names, found nothing I could call a defect on the weight-naming question it asks, and did NOT run the sweep it asks for, so no claim is made there. This was a free pick, from reading the one learner-visible screen whose copy the log has never corrected: Reference → Parent guide) — the 13-17 band's activity told a teenager **"Pick a stock and track it for 3 months. Compare its movement to what the Fed does with rates. Can you see the connection?"** **The honest answer at that horizon is no**, and the app's own main path already says so. Corrected in all five languages.

#### The defect, and why it is the app contradicting itself rather than a debatable simplification

Every other activity in this file asks a question whose answer a child will actually see — prices rise when a thing is popular (5-8), grocery prices move over a month (9-12). **The 13-17 one is the only one whose leading question has no discoverable answer**, and three surfaces on the main path already say why:

| surface | what it says | since |
|---|---|---|
| `markets.js` `ratePrinciples` item 1 | *"Policy changes work with lags — **often a year or more**."* | unchanged since the 08-04 rebuild |
| lesson 35 (Interest Rates), closing ¶ | a rate move reaches an asset price *"**only if everything else holds still**, and in a downturn it rarely does"* | `8723d7a` |
| `markets.js` `rateEffects` header | the arrows are the push **ALL ELSE EQUAL**, *"not what history shows happening next"* | 2026-09-18 |

So the app tells a reader on one screen that rates work over **a year or more** and on another to look for the effect in **three months** — and the three runs of 2026-09-18 reframed the Reference table precisely because the single-asset link does not hold.

#### Measured 2026-09-20, with controls, before editing anything

Rolling 3-calendar-month windows, daily start dates. Fed target = `DFEDTAR` spliced to `DFEDTARU` at 2008-12-15.

- **In 54.0% of windows since 1990 the Fed's target did not change at all.** More often than not there is nothing on the Fed side to compare against. (Since 2008-12: 68.1%.)
- **Across 10 long-listed large caps** (AAPL MSFT KO DIS NKE MCD WMT JNJ XOM PG; Tiingo `adjClose`), over the **42,202** windows in which the Fed **did** move, the stock moved in the textbook direction (rates ↑ → price ↓) in **49.4%** and against it in 50.6%. **A coin flip.** Per-ticker **45.4%** (MSFT) to **57.2%** (WMT), straddling 50.
- **What does track the Fed:** bank prime rate **190/190 = 100.0%**, money-market account rate **98.9%** (2009-), FDIC national savings rate **92.9%** (2021-).

**Controls.** FRED bad series id → **404** (not an invented answer); `FEDFUNDS` 1981-06 = **19.10**; the 2007-09-18 cut (5.25→4.75) and the 2022-03-17 first hike (0.25→0.50) both reproduce on the spliced series; Tiingo bogus ticker → **404**; SPY `adjClose` calendar-2008 = **−36.8%** against the published −36.8%, 2020 Q1 = **−19.4%** against ≈−19.6%.

⛔ **A weak control that did NOT license the result, and the instrument I had to build because of it.** My first positive control was bond ETFs — SHY **54.3%**, TLT **50.9%**. **Those barely beat a coin flip, so they validate nothing**, and a negative result under a dead instrument means nothing. Rather than report the 49.4% on the strength of a control that did not fire, I built one that must: the **3-month T-bill (`DTB3`) through the identical windowing and sign machinery moved with the target in 95.2%** of the same windows. That is what makes the 49.4% a finding rather than an artifact. (The bond-ETF result is not a failure of the ETFs — bond prices trade on *expected* future rates, so a realized target change is largely already in the price. It is simply not a control.)

#### What shipped (1 file, 5 strings + a header)

- **en** → *"For 3 months, track a stock and a savings account's rate next to what the Fed does. One follows the Fed closely; the other mostly doesn't. Which is which?"* — keeps the stock (the part a teenager wants to do), adds the thing that **does** respond, and turns a leading question with no answer into a real one with a discoverable answer.
- es/ko/zh/ja carry the same two-track comparison, each in its own punctuation convention.
- **A header comment on `kidsContent.js`**, which had none, recording the old wording, the three surfaces it contradicted, every figure above, the positive control, and *"These figures drift. Re-measure before trusting them; do not retype them."* **Zero `scripts/` mass — W-6.3's ratio is unmoved.**

#### Why NO check was added (W-6.2 rule 3, answered rather than skipped)

The learner-visible sentence is easy — *a teenager is told to find a connection that is a coin flip at that horizon.* The check is not. Catching it needs a live fetch of prices and the target; `npm test` is offline by design, and a committed snapshot would be a second copy of the kind of figure that rots. The durable artifact is the header note. **`npm run check-blindspot` already covers the file for the rule that matters here** (§10.1) — proven below rather than assumed.

#### Verification

| Check | Result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 3 WARN** — identical to the pre-edit baseline (coverage 100%/0% human, completeness 47 pairs, quiz length-cue 52.2%); readiness unchanged at 44 lessons / 164,172 en chars / 174 min |
| `npm run check-blindspot` | **exit 0** |
| Edit safety | Each of the 5 replacements asserted its old string occurred **exactly once** and the new one **zero** times before writing; after writing, re-read from disk: old **0**, new **1**, all five. The script refuses and writes nothing if any count is off |
| Strings are not garbled | The values were **read back out of the module**, not the diff: 255 fields scanned across all three bands, **0 U+FFFD, 0 lone surrogates, 0 missing** |
| Build | `npm run build` fails on this host (iCloud-synced `node_modules`); `scripts/build-out-of-tree.sh` → **✓ built in 548ms**, mirrored to `dist/` |
| In the bundle | All 5 new strings present, all 5 old strings **gone** |
| Comment does not ship | `2026-09-20`, `DFEDTARU`, `Tiingo adjClose` and `42,202` each return **0 files** in `dist/assets/`, against a control (`savings account's rate`) returning **1** |
| Live render | Served `dist/` statically and walked Reference → Parent guide → 13-17 in the real DOM. Reads correctly in **all five languages**, **0 U+FFFD**; the old string is absent from the panel |
| **The DOM control** | Injecting `PROBE_XYZ_CONTROL` into the panel moved the read **false → true → false**, so the "old string absent" zeros are load-bearing |
| **The guard control** | §10.1's coverage of this file was **proven, not inferred**: planting *"You should buy stocks now."* into my own new `en` string made `check-blindspot` **exit 1 and name `kidsContent.js:136`**. Restored from a scratchpad copy (never `git checkout --`) and re-verified **by SHA-256**, identical; probe count 0; guard back to exit 0 |

⛔ **One verification I did NOT get, stated rather than skipped: there is no screenshot.** The Browser pane was hidden for this run, and a hidden pane does not composite frames — it would have handed back a placeholder, not the screen. The DOM read with the injected probe above is stronger evidence for *this* change (it reads the text, not pixels), but nobody should read "live render: OK" here as "someone looked at it".

#### Step 5: adversarial self-check

- **Blindspot register.** §10.1 — clean, and **proven** by the planted probe above rather than by trusting a PASS line. The new string is observational (*track*, *next to*, *which is which*), names no security to buy, carries no timing and no second-person directive. §10.2 — no Dalio, no named firm. §10.3 — the voice is unchanged from its three sibling activities, `kidsParentIntro` and `refParentsBlurb` are untouched, and the guard still reads both as addressing an adult; **nothing here moves the app toward child-facing**, which is the owner-only call. §2.3 — I put a date and figures into a file §2.3 does **not** scan (the §2.3 list is 26 teaching-copy modules and `kidsContent.js` is not among them), so I checked the bundle directly instead of relying on the guard: none of it ships, with a firing control.
- **DECISIONS.md.** No conflict. The one relevant entry ("Kids financial-literacy content: format stays parent-facing, structural depth un-scoped") reserves **structural** change — new fields on `kidsContent.js`, a new render shape in `ParentGuide.jsx`. I added neither: one existing string's text inside the existing 3-field format, zero render changes. That decision also warns against runs "backing into" the question by **adding blurbs**; I added **zero** blurbs.
- **Already-done backlog item.** Not a duplicate: `Pick a stock and track it` and `practice investment account` each return **0** in both `AGENT_LOG.md` and `AGENT_LOG.archive.md` — this copy has never been touched since it shipped.
- **My own verification claim.** A reviewer re-running my commands gets my numbers; the controls are in the commands. **Two things they should not take from me.** (1) **The ticker set is mine.** Ten large caps I chose is not a random sample of what a teenager would pick; the honest bound is the per-ticker spread, **45.4%-57.2%**, which straddles 50 rather than sitting under it — the claim is "no reliable direction", not "stocks go the other way". (2) **"A savings account's rate follows the Fed" rests on national averages** (FDIC/FRED), not on any particular bank — a sticky legacy savings account at a big bank may barely move, which is itself a thing the activity's reader may discover. The wording says *a savings account's rate*, not *your bank will move it*.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)

- **The `parentTip` directly under it still reads "Set up a practice investment account. Real-time experience is the best teacher for understanding market psychology."** *"The best teacher"* is an unsupported superlative, and it now sits under an activity teaching that short-run single-stock movement is mostly noise. **I left it** because it is a claim about pedagogy, not a false claim about markets, and I measured nothing that bears on it — changing it would have been an unmeasured edit riding along with a measured one.
- **The English strings in this file use straight quotes** (`\"Pay yourself first\"`, `'Spend,' 'Save,' 'Give'`) while `glossary.js` uses curly (`“the money supply”`). Corpus-wide typographic convention; not measured here, not filed.
- **`economicSignals.js` is still unswept** for the previous run's weight-naming question. I read it and did not act; that is not the same as having swept it.

**Owner-facing, one line:** the parent guide told a teenager to pick a stock, track it for three months and look for the connection to what the Fed does with rates — but **in 54% of three-month stretches since 1990 the Fed did not move at all**, and when it did, ten well-known stocks went the textbook way **49.4%** of the time, which is a coin flip; the app's own interest-rate lesson already says rate changes take "a year or more". The activity now has the teenager track **a stock and a savings-account rate side by side** and work out which one follows the Fed — the savings side does, **93-100%** of the time — so the question finally has an answer they can find. All five languages, measured against Fed and market data with controls that fire, including a positive control built after my first one turned out to be worthless. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2.

⚠️ **One side effect of mine, disclosed and committed separately.** While trying to read the Tiingo key I ran `. ./api-keys.txt` — **that file is documentation, not an env file**, so the shell executed its prose, and one of the lines it executed was `npm run market`. That refreshed `public/data/market.json` (`asOf` 2026-09-18 → 2026-09-20; the diff is **that one line**, nothing else). The data is correct and current, so it is committed on its own rather than left stranded in the tree or folded into this change. **The key itself was never printed.** The right way to read it is `grep -m1 '^TIINGO_API_KEY=' api-keys.txt | cut -d= -f2-`, which is what the rest of this run used.

### 2026-09-20 (scheduled dev-agent; W-6.2 rule 1 does not arise: the previous run left three residuals and this run took **none** of them — the `parentTip` superlative, the straight-vs-curly quote convention and the `economicSignals.js` weight-naming sweep are all still open, untouched and unclaimed. This was a free pick, from pointing the previous runs' unseen-phrase instrument at the surfaces it had never been pointed at: the **non-lesson content modules** (`markets.js`, `moneyVisuals.js`, `policyScenarios.js`, `economicSignals.js`, `sectors.js`, `lessonTerms.js`, `glossary.js`), scoring each claim-shaped English sentence by the share of its 5-word runs appearing nowhere in `AGENT_LOG.md`, the archive, `CLAIMS.md`, `DECISIONS.md` or `LAUNCH_PLAN.md`. Controls fired both ways: `the point of maximum pessimism` returns 5, a nonsense string returns 0) — the Market Dashboard's Illustrative Scenario closed with **"This mix of signals is the kind that has historically shown up late in an expansion, before growth clearly turns."** **One clause holds and one does not, and neither had ever been tested.** The lateness is real and strong; the implied sequel is not. Corrected in all five languages.

#### The defect, and where it came from

The sentence is the payoff line of `Reference › Market Dashboard`, under the label **Illustrative Scenario** and the note *"For teaching purposes — not live market data"*. The framing is honest about being hypothetical. **What it is not hypothetical about is the history it asserts** — and the archive shows the clause was *introduced* by a de-staling pass (archive l.69), which stripped the dated figures (`"Jan 2026 Fed minutes"`, `"CPI ~2.4%"`) and added a historical generalization in their place to justify the genericness. **A fix for a stale-date defect introduced an unmeasured empirical claim, and nothing has looked at it since.**

Never measured, with controls both ways: `shown up late in an expansion` **0**, `before growth clearly turns` **0**, `rising tariffs adding cost pressure` **0**, `policymakers divided` **0** across all five documents; `the point of maximum pessimism` returns **5** and a nonsense string **0**.

#### Measured 2026-09-20, with a positive control, before editing anything

Monthly frame **1964-07 → 2026-06** (658 expansion months; the start is set by the 10-year trailing window on `FEDFUNDS`). The scenario's own four conditions, operationalized: real GDP (`GDPC1`) growing year-on-year **but slower than the previous quarter**; CPI (`CPIAUCSL`) year-on-year **above 2%**; `FEDFUNDS` **at or above its trailing 10-year 75th percentile**. Outcome = a `USREC` 0→1 month. (*"Policymakers divided"* is not in any series and was not proxied; *"rising tariffs"* was left out rather than proxied badly — both stated, not smuggled.)

| clause | verdict | measurement |
|---|---|---|
| *"has historically shown up late in an expansion"* | ✅ **HOLDS, strongly** | Of mix months inside US expansions **that ended**, **87.5%** fell in the final third — median position **0.87** of the way through — against **36.1%** for expansion months generally |
| *"before growth clearly turns"* | ❌ **does not hold as stated** | P(recession starts within 12 months \| mix) = **40.4%** against a **14.6%** base. A real **2.8x** lift — and not a turn |

**The spread is the finding.** Across the **16** contiguous mix episodes the gap to the next recession ran **1 to 72 months** (median 15): `1968-07..1969-12` → +1, `1984-08` → **+72**, `2017-01..2017-03` → +36. **39.4%** of mix months had no recession start within **24** months, and **3 episodes have had no downturn follow at all** — the most recent ended **17 months** before the end of the data.

**Robustness — the verdict is not an artifact of one threshold.** Re-specified five ways (CPI>2.5, CPI>3, rate top tercile, rate top decile, slowing two quarters running), the last-third share lands **79.6%–89.7%** and P(rec12) **35.5%–55.9%** every time. Both halves of the verdict survive all six.

**Controls.** FRED bad series id → **404** (not an invented answer); `FEDFUNDS` 1981-06 = **19.10** as published; `USREC` 2020-03 = 1, 2020-05 = 0, 2007-11 = 0, 2008-01 = 1; `GDPC1` reaches back to 1947Q1.

⛔ **The positive control is what makes the 87.5% a finding rather than arithmetic.** "Months late in an expansion cluster late in an expansion" is nearly circular, so a high number proves nothing on its own. An **inverted yield curve** (`GS10`−`TB3MS`) pushed through the **identical** windowing, position and sign machinery returns **84.5%** in the last third at median position **0.889** — a known-strong indicator scoring the same as the mix, on an instrument that therefore discriminates rather than flatters.

⚠️ **The limit, stated rather than buried.** The 87.5% is computed **only over expansions that ended**, because an unfinished expansion has no denominator. **The three no-downturn episodes are precisely the ones that measure cannot see.** That is exactly why the new sentence carries them instead of leaving the lateness figure to speak alone.

#### What shipped (1 file, 5 strings + a header comment)

- **en** → *"…This mix of signals has historically clustered near the end of US expansions — but it is not a countdown: the gap before growth actually turned has run from one month to six years, and more than once the mix appeared and the expansion simply carried on."* The measured clause is kept and sharpened (`near the end of US expansions`, which is what was measured); the unmeasured sequel is replaced by the measured spread.
- es/ko/zh/ja carry the same two-part shape, each in its own punctuation convention. **Deliberately date-free in all five** — the register matches L40's map-not-timetable fix and L38's "not a schedule of what comes next".
- **A header comment on `scenario`**, recording the old wording, both verdicts, the operationalization, the positive control, the robustness grid, the closed-expansion limit and *"These figures drift. Re-measure before trusting them; do not retype them."* It also now warns that `check-blindspot` §2.3 scans this file. **Zero `scripts/` mass — W-6.3's ratio is unmoved.**

#### Why NO check was added (W-6.2 rule 3, answered rather than skipped)

The learner-visible failure is easy to name — *a reader is taught to read a signal mix as a countdown that has twice run six years and three times not arrived*. The check is not: catching it needs a live fetch of `GDPC1`, `CPIAUCSL`, `FEDFUNDS` and NBER dates, and `npm test` is offline by design. A committed snapshot would be a second copy of the kind of figure that rots. The durable artifact is the header note, and **§2.3 and §10.1 already cover this exact string — proven below rather than assumed.**

#### Verification

| Check | Result |
|---|---|
| `npm test` | **exit 0, 0 FAIL, 3 WARN** — the WARN set `diff`s **identical** to the pre-edit baseline (coverage 100%/0% human, completeness 47 pairs, quiz length-cue 52.2%); readiness unchanged at 44 lessons / 164,172 en chars / 174 min; run log under budget |
| `npm run check-blindspot` | **exit 0** |
| Edit safety | Each of the 5 replacements asserted its old string occurred **exactly once** and the new one **zero** times before writing; re-read from disk after: old **0**, new **1**, all five. The script refuses and writes nothing if any count is off |
| Strings are not garbled | Values **read back out of the module**, not off the diff: 5/5 present, **0 U+FFFD, 0 lone surrogates**, and the em dash normalized from a `—` escape to the literal character the rest of the file uses |
| Build | `npm run build` fails on this host (iCloud-synced `node_modules`); `scripts/build-out-of-tree.sh` → **✓ built in 576ms**, mirrored to `dist/` |
| In the bundle | All 5 new strings present (1 file each), all 5 old strings **gone** (0 files) |
| Comment does not ship | `2026-09-20`, `CPIAUCSL`, `trailing 10-year 75th percentile` and `87.5%` each return **0 files** in `dist/assets/`, against a control (`is not a countdown`) returning **1** |
| Live render | Served `dist/` statically and walked Reference → Market Dashboard in the real DOM, **in all five languages**: new string present 5/5, old string absent 5/5, **0 U+FFFD** |
| **The DOM control** | Injecting `PROBE_XYZ_CONTROL` into the panel moved the read **false → true → false**, so the "old string absent" zeros are load-bearing |
| **Guard control A (§10.1)** | Planting *"Now is a good time to buy."* into my own new `en` string made `check-blindspot` **exit 1** naming §10.1. Restored from a scratchpad copy (never `git checkout --`) and re-verified **by SHA-256**, identical |
| **Guard control B (§2.3)** | Planting *"as in March 2026"* into the same string made it **exit 1** naming §2.3 **and `markets.js:330`**. Restored and re-verified by SHA-256; probe strings left behind: **0** |

⛔ **Two things I did NOT get, stated rather than skipped.** (1) **No screenshot** — the Browser pane was hidden, and a hidden pane does not composite frames; the five-language DOM read above reads the text rather than pixels, which is stronger evidence for *this* change, but nobody should read it as "someone looked at it". (2) **The static server's HTTP status is a dead control here** — `serve -s` is SPA mode and rewrites a nonexistent asset path to `index.html` with a **200**. I noticed and replaced it with a content control: the real asset contains `is not a countdown` (1) and the bogus path does not (0) while returning the HTML fallback (1).

#### Step 5: adversarial self-check

- **Blindspot register.** §10.1 — clean, and **proven** by plant A rather than by trusting a PASS line; the new text is descriptive (*clustered*, *has run*, *carried on*), names no security, gives no timing directive and no second person. §10.2 — no Dalio, no named firm or person; regex-checked across all five strings. §10.3 — `kidsContent.js` untouched. §2.3 — **proven** by plant B; all five strings regex-checked for a month name or a bare `20\d\d` and all five return false. The new comment carries `2026-09-20`, which §2.3's English-month-name pattern does not match by design, and the bundle check above confirms it does not ship either way.
- **DECISIONS.md.** No conflict. The one `scenario` entry there (l.185) is about **`policyScenarios.js`** and PolicySim's lever groups — a different file and a different export that happens to share a noun. Nothing in DECISIONS.md rules on `markets.js`'s Illustrative Scenario.
- **Already-done backlog item.** Not a duplicate: the three `Market Dashboard` hits in `AGENT_LOG.md` are a label spilling 40px at 320px and the balance-sheet chart's bars — layout and figures, never this copy. `late expansion` returns **0** in `AGENT_LOG.md` and **1** in the archive, and that one hit is the entry that *wrote* the sentence, not one that measured it.
- **My own verification claim.** A reviewer re-running my commands gets my numbers; the controls are in the commands. **Three things they should not take from me.** (1) **The operationalization is mine.** "Growing but slowing", "above target" and "elevated" are my thresholds, not the app's — which is why six specifications are reported rather than one, and why the verdict is stated as the pattern that survives all six. (2) **`USREC` is the NBER's dating, revised with long lags**, so the recent no-downturn episodes are "no recession dated through 2026-08", not "no recession happened". The shipped wording says *the expansion simply carried on*, which is the claim the data supports. (3) **Two of the scenario's four conditions were not measured at all** — *"policymakers divided"* has no series, and *"rising tariffs"* I declined to proxy rather than proxy badly. The finding is therefore about the three-condition macro core, and the shipped sentence claims nothing about the other two.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)

- **`nestedCyclesDescription` (markets.js) still says the short cycles "repeat every 5-8 years", flat.** Lesson 33's prose was corrected on 2026-09-13 to *"one has come along every 5-8 years on average … though the actual gap between recessions has run from a year and a half to more than twelve years"*, and **the chart's text alternative never got the hedge** — the same three-quarters-done shape as the 09-19 yield-curve glossary fix. The 09-13 run filed it as arguable because `check-data` §71 (c) bounds the chart's cycle count by that phrase and `nestedCyclesShortLabel` lifts it. **Measured leads already exist in the archive; a run that wants this has the figures and needs only to decide whether a figure's alt text may hedge where its printed label cannot.** Not picked here — it is a second helping of the same meal and this run's pick was already in this file.
- **The previous run's three residuals are still open and I claim nothing about them**: the `parentTip` *"best teacher"* superlative, the straight-vs-curly quote convention, and `economicSignals.js`'s weight-naming sweep. I read `economicSignals.js` during the sweep above — its six `what` strings scored low on the unseen-phrase instrument and I found nothing I could call a defect — but **that is not the sweep that note asks for** and does not close it.

**Owner-facing, one line:** the Market Dashboard's teaching scenario told readers that its mix of signals *"has historically shown up late in an expansion, before growth clearly turns"* — measured against US data since 1964, **the first half is true and strong** (88% of such months fell in the last third of expansions that ended, against 36% for expansion months generally, and an inverted yield curve scores the same 84% through the identical instrument) **but the second half is not a countdown**: the gap before a downturn has run from **one month to six years**, 39% of those months saw no recession within two years, and three episodes have had none follow at all. The sentence now keeps the measured lateness and gives the spread instead of the implied sequel, in all five languages. **Committed, not pushed** (O-5).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2.

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick, not a free one** — this is the first run under the 2026-09-20 weekly block, and W-8.5 says that while item 94 or item 160 carries a standing `npm test` WARN, that is the pick. Both did. Item 160 was taken because it is one schedulable block; item 94 is 47 lesson/language pairs and is not) — quiz `q039` (lesson 25) keyed a **178-code-point** option against a longest distractor of **120**: *"He's paying for stability this specific money doesn't currently need, **since its long time horizon would give it room to recover from a temporary drop before he'd ever withdraw it**"*. The bolded half is a reasoning tail that was **already in `explain` verbatim, in all five languages**. **Item 160's own STOP LINE said no such question was left. It was wrong, and the reason it was wrong is reusable: it ranked the whole corpus and then examined only the top four.**

#### Step 3.5 — the WARN's figures HOLD; item 160's stop line BREAKS

Re-measured independently (my own scorer, not `check-data.mjs`), before touching anything:

| claim | source | verdict |
|---|---|---|
| longest-option tapping scores **en 24/46 = 52.2%** vs 25.0% chance | `npm test` §65 WARN | ✅ reproduces exactly |
| the cue is **English-only** | implied by the WARN text | ❌ **all five**: en 52.2, es 50.0, ko 50.0, zh 45.7, ja 47.8. Only en crosses §65's `> 0.5` line |
| *"Everything still open in this item is class B"* | item 160 STOP LINE, 2026-09-04 | ❌ **false** |

**Negative control on the scorer**: the *shortest*-option strategy scores **2.2 / 2.2 / 0.0 / 2.2 / 4.3** — near-zero where longest is ~2x chance. A scorer returning nothing would look identical to a clean corpus; this one discriminates. Margin-function controls: 2x runner-up → 1.000, +1-of-100 → 0.010, exact tie → 0.000, half → −0.500. Class-A screen: `"A — B"` → true, `"Always buy stocks"` → false. Log-grep controls fired both ways: `q012` (fixed 09-19) returns 20 hits, `q099` returns 0.

**How the stop line went wrong.** Its four examined questions all reproduce 16 days on — `q008` **57%** (B), `q021` **56%** (A but unreachable: its tail is 22 code points and leaves 87 against a ceiling of 54), `q014` **53%** (B), `q005` **50%** (A, declined because landing zh meant cutting to 4-6 characters). From those four it concluded the class was exhausted and routed the remainder to O-3. **It never ranked past rank 4.** `q039` sat at **48%** — class A, a genuine detachable tail, and **the widest landing bands in the reachable set**, which is the exact inverse of the `q005` objection the stop line rested on. Item 160's own rule already said to expect this: *"RANK THE QUEUE BY WINDOW WIDTH, NOT BY HOW MUCH MUST COME OUT"* — `q039` had been dismissed by an earlier pass as *"the expensive one (73)"*, i.e. by the deletion-cost ranking the item itself later declared inverted.

This is **not** the "moving the instrument without moving the defect" failure item 160 warns about: that corollary is about margins under 5% (one character in thirty). `q039`'s correct option was **48% longer** than its longest distractor in the tightest language — a gap the eye resolves without reading a word.

#### What shipped (5 files, 5 strings — no `scripts/` mass, W-6.3 ratio unmoved)

The reasoning tail was dropped and the cost named in its place. Nothing was lost to the learner: the tail's content is in `explain`, which is shown the moment they answer (`en` *"its fifteen-year horizon gives it far more room to recover from a bad stretch before he'd withdraw it"*, and the equivalent in es/ko/zh/ja — checked in all five, not assumed).

**Landings, quoted per item 160's own filing rule (`answer` length and `[bandMin, bandMax]`), so the next editor can see which cell is load-bearing:**

| lang | before | after | distractor band | headroom (below max / above min) |
|---|---|---|---|---|
| en | 178 | **96** | [76, 120] | 24 / 20 |
| es | 213 | **113** | [83, 140] | 27 / 30 |
| ko | 96 | **47** | [33, 56] | **9 / 14** ← tightest cell |
| zh | 60 | **28** | [23, 35] | 7 / 5 |
| ja | 80 | **45** | [30, 53] | 8 / 15 |

Every cell lands **strictly inside** the band — neither longest nor shortest in any language. An earlier `ko` draft sat at 51 (5 below the ceiling) and was re-centred to 47 rather than shipped tight.

⚠️ **A band has two walls.** Item 160 records a past fix that created the *inverse* tell while curing the forward one, so the shortest-option strategy was re-scored after the edit: **2.2 / 2.2 / 0.0 / 2.2 / 4.3 — unchanged in every language.** The tell was removed, not flipped.

#### Verification

| Check | Result |
|---|---|
| `npm test` | **exit 0, 0 FAIL.** §65's WARN **cleared** (3 WARN → 2: item 93 coverage and item 94 completeness, both unchanged). ⚠️ **Then back to 3 — but a different third**: appending this entry took the run log to 242,280 b and tripped `check-log-size`'s *less than one run of headroom* warning. **A reviewer at HEAD sees 3 WARN, not 2**, and the third is W-5.3's archiving trigger, not the quiz |
| §65's own line | `en 50.0%/2.2%, es 47.8%/2.2%, ja 45.7%/4.3%, ko 47.8%/0.0%, zh 43.5%/2.2% … 5 scorer control(s) fired in both directions` — **one question dropped in every language**, not just the one that was warning |
| `npm run check-blindspot` | **exit 0** |
| Edit safety | Each replacement asserted its old string occurred **exactly once** and the new string **zero** times before writing; after writing, old **0**, new **1**, all five. The script writes nothing if any count is off |
| Not a count-only assertion | Values **re-imported from the modules** and re-measured for length and band position, not read off the diff — a garbled string passes a 1/0 count |
| Build | `scripts/build-out-of-tree.sh` → **✓ built in 544ms**, mirrored to `dist/` |
| In the bundle | All 5 new strings present, all 5 old reasoning tails **gone**, one `quizText.<lang>` asset each |
| Ranking re-run | `q039` is **off** the beatable list: beatable-in-≥1 **26 → 25**, beatable-in-all-five **16 → 15** |

⛔ **Three things I did not get, stated rather than skipped.** (1) **No live-DOM or screenshot check.** The bundle grep proves the string ships; it does not prove someone looked at the Practice screen. This change is five plain strings in a field the reader renders as a text child, and I judged the bundle check sufficient — but nobody should read it as a render check. (2) **The translations are unreviewed by a fluent speaker**, as every run in this project says; I shortened ko/zh/ja prose and no native reader has seen it (O-3). (3) **`en` is now exactly 50.0%**, and §65 warns at `> 0.5`. **The WARN cleared by one question and is one question from returning** — if any future edit lengthens a keyed option or trims a distractor, it comes straight back. That is a real property of this landing, not a hedge.

#### Step 5: adversarial self-check — one real thing found and dealt with, the rest clean

- ⚠️ **Found: the fix could have created the inverse tell.** Deleting the tail outright put `en` near its floor. Caught before shipping by scoring *both* directions (see the table above); the option was re-worded to name the cost (*"in growth given up"*) rather than merely cut, landing mid-band in all five. This is the same failure item 160 records against a past `q020`-era fix, and it was avoided by measurement rather than by care.
- **Blindspot register.** §10.1 — the new option is **less** advice-adjacent than the old one, not more: the tail it removes (*"would give it room to recover … before he'd ever withdraw it"*) edges toward a recommendation about long-horizon money, while the replacement states only a cost. No second person, no security named, no timing directive; `check-blindspot` exit 0. §10.2 — no Dalio, no named person or firm (regex-checked across all five strings). §10.3 — `kidsContent.js` untouched. Markets stale-data — no date and no figure in any of the five strings (`2026`, month names, bare `20\d\d` all return false).
- **W-8.6's Markdown class.** My `en` and `es` strings contain **em dashes, not asterisks**; 0 Markdown constructs added. (W-8.6's guard is still unfiled — see below.)
- **DECISIONS.md.** No conflict: `q039` returns **0** there, and there is no ruling on quiz option wording. Content stays in `.js` modules; no state, build or platform decision touched.
- **Already-done backlog item.** Not a redo, checked two ways: `q039` appears **4** times in `AGENT_LOG.md` and all four are item 160 listing it as an unfixed *candidate*, and `git log --all -S` over `quizText.en.js` returns **no commit** that ever touched its text.
- **My own verification claim.** A reviewer re-running `npm test` gets my headline figures from §65's own printed line — it recomputes them on every run, so nothing here is retyped. **What they should not take from me:** the per-language band table came from my scratchpad scorer, which is deliberately not committed (W-6.2 rule 3 — it has no threshold that could be a gate, and §65 already prints the aggregate); and "the reasoning is already in `explain`" is my reading of five prose fields, four of them in languages I cannot have reviewed by a native speaker.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)

- **`q023` (L9, 46%) is next by margin and is class A** — *"It shrank — the real return was roughly -2%, even though the balance grew"*, beatable in all five. Then `q037` (37%, L23), `q040` (16%), `q034` (11%), `q027` (6%). **The queue is not empty and the stop line should not be read as saying it is** — the correction is now written into item 160 itself so this is not re-derived.
- **W-8.6's Markdown guard is still unfiled.** The weekly review named it the cheapest open guard and the corpus is currently clean in all five languages. I did not add it: this run's pick was mandated by W-8.5 and adding a `check-data.mjs` section is a separate change. **It remains the cheapest item on the list.**
- **Item 94 is untouched and is now the only W-8.5 WARN left.** With §65 clear, the next run's W-8.5 test resolves to item 94 alone.

**Owner-facing, one line:** the quiz could be half-beaten by tapping the longest option (**en 52.2% against a 25% baseline**), and the backlog item tracking it had declared itself blocked on an owner decision. **That stop line was wrong** — it had ranked all 46 questions and then examined only the top four. Rank five was `q039`, whose keyed answer carried a 58-character reasoning tail already printed verbatim in the explanation the learner sees the instant they answer. Removing it in all five languages dropped the exploit in **every** language (en 52.2 → 50.0, es/ko 50.0 → 47.8, zh 45.7 → 43.5, ja 47.8 → 45.7) **without** creating the mirror-image "the short one is right" tell (shortest-option scores unchanged at 0–4.3%), and cleared a warning `npm test` had printed on every run. **At least five more questions of the same shape remain.** Build and tests green; **committed, not pushed** (O-5, W-8.1).

**Next run: the log-size warning fired on this entry, so W-5.3's nineteenth archiving pass is the pick** (run log 242,280 b of a 250,000 b budget, 2026-09-19 and 09-20 live). **Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one. **Backlog:** +1,086 b — the corrected stop line in item 160, which step 3.5 requires be written into the item rather than left in a run entry.

### 2026-09-20 (owner-directed: "do the archiving pass next". This is the previous run's closing handoff, taken up on instruction, so W-6.2 rule 1 does not arise) — W-5.3's **nineteenth** firing: 2026-09-19 (**21 entries, 167,108 b**) moved verbatim to `AGENT_LOG.archive.md` under `## Archived 2026-09-19`. Run log **242,710 → 75,602 b** (97.1% → **30.2%** of budget), log-size warning cleared (`npm test` 3 WARN → **2**). **This is the first firing triggered by the headroom warning rather than by being over budget** — and the eighteenth pass's corrected composition proof transferred to a fresh pass and discriminated, which is a data point O-6 has been waiting nineteen passes for.

**Step 3.5 — the instrument's proposal re-derived independently, not taken on trust.**
- `check-log-size` MEASURED line, this run: run log **242,710 b**, floor **453,246 b**, **2 live days**, its own four controls firing.
- Its proposal — move 2026-09-19 — was re-derived from byte offsets rather than read off the instrument: **21** `### 2026-09-19` headings from **453,258** to **607,196**, first `### 2026-09-20` at **620,366**, giving a block of exactly **167,108 b**. Contiguity re-checked directly: every 09-19 offset precedes the first 09-20 offset and every 09-20 offset follows the last 09-19 one, so the day is **one region**, not two.
- ⚠️ **My derivation and the instrument differ by one byte on the dated total** (mine 242,698, its 242,699) and the difference is blank-line accounting at the `## Run log` boundary, not a disagreement about content. Recorded rather than smoothed over. The byte-exact conservation proof below is what the move actually rests on.
- **The trigger changed shape and that is worth one line.** The seventeenth and eighteenth passes fired when the run log was already **over** the 250,000 b warn budget (252,147 b and 262,425 b). This one fired at **97.1% of budget** on W-5.3's *less-than-one-run-of-headroom* warning, which my own previous entry tripped. **The budget was never breached.** That is the warning working as designed, one run earlier than the old trigger would have.

#### The eighteenth pass's fix transferred, and the plant proves it
The eighteenth pass found its composition proof was a **tautology** — it compared the archive's growth against the string it had just appended, so both sides moved together and it could not fail. Its fix was to measure growth against **independently derived parts** (a `HEADING` constant plus the block). **That corrected form was reused here verbatim and it discriminates:** the "byte appearing from nowhere in the archive" plant fails **composition and nothing else**. Under the old tautological form that plant would not have fired at all.

⛔ **What this does and does not say about O-6** (the standing question, filed at the thirteenth pass, of whether to automate the move). It says the recipe **has now survived one transfer intact** — the first pass since the correction needed no further change, which is the kind of stability that makes a script defensible. It does **not** say the proofs are safe to inherit without firing plants: the eighteenth pass's whole finding was that a hand-written proof of an obviously-correct move was wrong on its first draft. **Still the owner's call, still not decided in a run.**

#### What shipped (2 files, no source change)
- `AGENT_LOG.md` **695,956 → 528,848 b**; run log **242,710 → 75,602 b**, **2 live days → 1** (2026-09-20, 6 entries).
- `AGENT_LOG.archive.md` **4,661,679 → 4,828,812 b**; new final section `## Archived 2026-09-19` appended in date order; title range `2026-08-01 → 2026-09-18` becomes `→ 2026-09-19`.
- **Floor unchanged at 453,246 b** — the backlog was not touched. **No learner-visible change; no clause, budget, threshold or script changed.** The mover lived in the scratchpad: **`scripts/` gained 0 lines** (W-6.3 ratio unmoved).

#### Verification
| Check | Result |
|---|---|
| Conservation (in-script) | Archived block + remaining live rebuilds the original **695,956 b** file byte for byte |
| **Conservation (independent)** | The block read **back OUT of the written archive** by its own `## Archived 2026-09-19` heading, spliced before the first 09-20 heading, reproduces `git show HEAD:AGENT_LOG.md` **byte for byte (695,956 b)** |
| **Negative control on that proof** | The same splice **one byte short** does **not** match — so the match above is load-bearing, not vacuous |
| Containment (on disk, re-counted) | `### 2026-09-19`: live **0**, archive **21** (was 0) — exactly the 21 that left |
| Next-day untouched | `### 2026-09-20`: live **6**, archive **0** |
| Composition | live 528,848 + block 167,108 = **695,956** = original; archive grew **167,133** = heading (25) + block (167,108); title swap asserted **byte-neutral** before writing |
| Tamper plants | **3/3 fire** — a dropped byte fails conservation + composition; an entry left behind fails conservation + containment + composition; a byte from nowhere in the archive fails **composition alone** |
| Plants never wrote | Plants ran **in memory only**; `cmp` against scratchpad pre-copies immediately before the real write: both files **identical** |
| `check-log-size` | run log **75,602 b, 30.2% of budget, 1 live day**, 0 warnings, its own 4 controls firing; floor **453,246 b unchanged** |
| `npm test` | **exit 0**, 0 FAIL, **2 WARN** — the log-size warning is gone; the two remaining are item 93 coverage and item 94 completeness, both unchanged |

#### Step 5: adversarial self-check
- **Blindspot register.** Unreachable by this diff: `src/` is untouched and the change is two markdown files. §10.1/§10.2/§10.3 and the stale-data rule cannot be affected by moving run-log text between files; `check-blindspot` is green inside `npm test` regardless.
- **DECISIONS.md / W-7.2 rule 3.** W-5.3 is the archiving rule and this follows it: entries moved **verbatim**, nothing deleted, nothing edited, appended under a new dated heading in date order. Rule 3's *"this does NOT license deleting run-log history"* is honored, and the **proof** that it is honored is the independent conservation check — any edit at all would fail it.
- **Already-done backlog item.** Nineteenth firing of a standing instrument-triggered chore, not a re-pick: the eighteenth cleared through 2026-09-18, this clears 2026-09-19, and containment shows the archive gained exactly the 21 entries that left. No overlap.
- **My own verification claim.** A reviewer re-running my commands gets my result — everything reads from the repo. ⚠️ **The same limit the eighteenth pass recorded still applies and I am repeating it rather than assuming it carried:** the independent conservation check reads `git show HEAD:AGENT_LOG.md`, and once this pass commits, `HEAD` moves. **A later reviewer must name this commit's parent (`2ffb28a`) explicitly.**
- **Am I padding?** The move itself is three lines of this entry. The length is the transfer result on the eighteenth pass's fix, which is the one thing here a future pass would otherwise re-derive.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **The floor is the number to watch now, not the run log.** Run log is at **30.2%** of budget with ~15 runs of headroom, but the **floor is 453,246 b against a 500,000 b warn budget (90.6%)** and archiving cannot touch it — the floor is the App summary, the backlog and the Environment note. W-8.0's rule-5 test passed on the backlog this week, but **the floor is the constraint an archiving pass structurally cannot relieve.** Not picked here; recorded so the next pass does not mistake a green run log for a green file.
- **W-8.5's remaining WARN is item 94 alone.** §65 cleared in the previous run, so the next scheduled run's W-8.5 test resolves to item 94 (47 lesson/language pairs) unless the owner directs otherwise.
- **O-6 is now nineteen passes old and still undecided**, with one new data point in its favor recorded above. Owner's call.

**Owner-facing, one line:** the run log had **0.65 of a run** of headroom left, so 2026-09-19's 21 entries (167,108 b) moved verbatim into the archive, taking the run log from **97.1% to 30.2%** of its budget and clearing the warning — **the first time this chore ran before the budget was breached rather than after.** Nothing was edited or deleted: the archived block, read back out of the archive file and spliced into the live one, reproduces the original **byte for byte**, and the one-byte-short control confirms that match means something. **No learner-visible change.** `npm test` exit 0, 3 WARN → 2. **Committed, not pushed** (O-5, W-8.1). ⚠️ **The run log is no longer the binding constraint — the floor is, at 90.6% of budget, and no archiving pass can move it.**

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2.

### 2026-09-20 (owner-directed: "do item 94 next", taken up on instruction, so W-6.2 rule 1 does not arise. This also satisfies **W-8.5** — item 94 was the last of its two standing WARNs after §65 cleared earlier today — and it settles **O-3**'s standing ask for this item: item 94's own filing note says *"the owner should be asked before this starts, not after"*, and this instruction is that answer) — **`essentials` lesson 1 is now fully translated in all four languages.** es 0.61 → **1.05**, ko 0.30 → **0.53**, zh 0.20 → **0.33**, ja 0.26 → **0.46**. Abridged pairs **47 → 43**, abridged lessons **12 → 11**. **The abridgement was not merely short — it had broken a cross-section dependency that left an on-screen figure asserting numbers the prose never derived.**

**Step 3.5 — premise re-measured, and the item's own deferral is stale in TWO ways.**
- The WARN's figures reproduce: **47 pairs, 12 lessons (1-11 and 14)**, es 11 / ko 12 / zh 12 / ja 12. Item 94's text says **48**; the 48→47 move is already recorded in `LAUNCH_READINESS.md` §10.4 as a threshold move, not work.
- ⛔ **Item 94's central recommendation — *"do not start this until O-1 is resolved"* — is obsolete. O-1 closed 2026-09-05**, fifteen days ago, and the item was never updated. Its second gate, O-3's *"the owner should be asked before this starts"*, is answered by this run's instruction. **Neither blocker survives; the item was deferred behind two conditions that have both since been met.**
- **The characterization "condensed summary rather than a translation" is TRUE and I checked it rather than assuming.** Section counts are parallel (3/3/3 in all five), so the loss is inside the bodies. Read line by line, lesson 1's four translations had each dropped: §0's entire worked example ($3,000 → $1,500 needs / $900 wants / $600 savings) **and** the "rent alone eats 40% of her pay, so adjust the split to fit your numbers" caveat; §0's specific $1,200 rent and $50 phone; §1's closing paragraph (*"Most people find one or two categories like this…"*); and §2's explanation of *why* remembering-to-save fails.

#### The defect underneath the volume gap: an orphaned figure
Measured before editing: **§2 cites Maria's $600 in all five languages, but only English's §0 derives it.** In es/ko/zh/ja the number arrived as a bare assertion.
It is worse than that, and the **live browser is what showed it**: the lesson renders a figure, `MARIA'S $3,000 MONTH` (`moneyVisuals.js`), captioned **$1,500 · 50% / $900 · 30% / $600 · 20%** — **in all five languages, including the four whose prose never mentioned those three numbers.** The abridgement had left the figure illustrating a derivation the reader could not see. That is now fixed in all four.
**Control that the figure-checker is not blind:** §1's figure multiset (`12, 15, 9, 18, 54, 648`) is **identical in all five languages** and always was — the abridgement was selective, not uniform, so a checker reporting "all match" would have been wrong. And lesson 2 §0, still abridged, **mismatches**, as it must.

#### What shipped (7 files)
- **4 content modules** — `lessonContent.essentials.{es,ko,zh,ja}.js`, lesson 1 only: 3 section bodies + `takeaway` + `thinkAbout` each, less the 4 fields that were already complete and were correctly skipped rather than rewritten (ko/ja `thinkAbout`, zh `takeaway` + `thinkAbout`).
- **`scripts/translation-completeness-baseline.json`** — ⚠️ **patched by hand, NOT with the prescribed `--write`.** §33's failure message says to run `npm run translation-completeness -- --write`; that regenerates **every** ratio, and a past run used it for a one-lesson edit and silently re-recorded 32 ratios across 16 lessons. **Asserted instead: exactly 1 of 44 lessons changed, 4 lines, `note` and `tolerance` byte-identical.**
- **`scripts/translation-review-ledger.json`** — L1 es/ko/zh/ja re-marked `ai`, 1 of 44 lessons changed. ⚠️ **Worth recording because the ledger could not have caught this itself:** it keys staleness on the **English** `sourceHash`, which did not move, so it went on reporting a 2026-08-28 review of translations that no longer exist.
- **`LAUNCH_READINESS.md`** — the generated §10.4 volume sentence via `npm run readiness -- --write` (one row, figures only), **plus a hand-written count in the same row that no instrument guards**: it still read *"all 48 remaining pairs … (lessons 1-11 and 14)"*. Now carries a dated 43 / 11-lesson re-measurement that says explicitly this one **is** a per-lesson diff, unlike the 48→47 threshold move recorded above it.
- **`scripts/` gained 0 lines** (W-6.3 ratio unmoved); the verification instruments stayed in the scratchpad.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, **2 WARN** (item 93 coverage; item 94 completeness, now reading **43** not 47) |
| Ratios | es **1.05**, ko **0.53**, zh **0.33**, ja **0.46** — all clear their thresholds (0.812 / 0.406 / 0.252 / 0.357) |
| **Not padded to threshold** | The four ratios land **on top of lessons 12/13/15**, the only fully-translated in-track reference points (ko 0.51-0.53, zh 0.33, ja 0.44-0.48). A translation padded to clear a bar would sit at the bar, not at the reference |
| No figure dropped | Every English numeral in all 3 sections appears in all 4 translations — **0 missing, in 12 of 12 section/language pairs** |
| `ja` numeral extras explained | `ja` carries digits English spells out (第1週 for "week one", 1つか2つ for "one or two"). **Pre-existing convention, proven against HEAD**: ja §1 already had `1, 4` and §2 already had `3` before this edit |
| Paragraph parity | 3/3/3 per section in all four, matching English |
| Encoding | **0 U+FFFD, 0 lone surrogates** in all 20 edited fields, read back out of the modules |
| Edit safety | Each field asserted old-unique-and-new-absent before writing, old-gone-and-new-once after. **The guard fired for real**: ko `thinkAbout` was already complete, the run aborted, and the four files were restored **from scratchpad pre-copies** (never `git checkout --`), verified clean by `git status`, then re-applied with a no-op branch |
| Build | `scripts/build-out-of-tree.sh` → **✓ built in 573ms**; new prose present in exactly 1 asset per language |
| **Live render, all four languages** | Served `dist/` statically and walked to Fundamentos del dinero → lesson 1 in the real DOM: all five restored elements present in **es, ko, zh and ja**, **0 U+FFFD**, plus a screenshot |
| **Render controls** | A string present in no language returns **false** (the checker discriminates); the static server returns a real **404** for a bogus asset path — I wrote a server that does **not** SPA-rewrite `/assets/`, because a previous run found `serve -s` returns 200 for everything and kills that control |
| `npm run check-blindspot` | **exit 0** |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 — the new prose is descriptive budgeting mechanics with no security, no second person directive, no timing claim; `check-blindspot` green, and all four strings screened clean for advice patterns. §10.2 — no Dalio, no named person or firm beyond the lesson's own fictional Maria. §10.3 — `kidsContent.js` untouched. Stale-data — **no bare 4-digit year in any of the four**, checked directly.
- **DECISIONS.md.** No conflict: content stays in `.js` modules (not JSON), no state, build or platform decision touched. The "(Beta)" labeling decision is unchanged and is exactly what O-3 governs.
- **Already-done backlog item.** Not a redo: lesson 1 was on the abridged list continuously from 2026-08-24 through this run, and `translation-completeness` confirms it left the list only now.
- **My own verification claim.** A reviewer re-running `npm run translation-completeness` gets my four ratios; the figure and encoding checks are scratchpad scripts and are described above rather than shipped (W-6.2 rule 3 — no threshold that could be a gate). ⛔ **The limit that matters, and it is not small: I wrote unreviewed machine translation in four languages and then verified it with instruments that measure *length, numerals and encoding* — none of which can see whether the Korean is idiomatic or the Japanese register is right.** Every check above would pass on fluent prose and on awkward prose alike. This is O-3 exactly, and this run **increased** the unreviewed volume rather than reducing it.
- **Am I gaming the instrument?** The specific risk on this item is writing to the ratio rather than to the reader. Two things argue against it: the ratios landed at the in-track reference rather than at the threshold, and the content added is **enumerable and English-sourced** — every restored element corresponds to a named English sentence, listed in step 3.5 above.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **43 pairs remain: lessons 2-11 and 14.** At this run's rate (4 pairs, 1 lesson) that is **~11 more runs**. Item 94's old estimate of 2 pairs/run and ~24 runs was fitted on per-language work; **the "read once, translate four times" structure the item predicted is real** — reading English lesson 1 once scoped all four languages, and the four translations were written in one pass.
- ⚠️ **The next lesson is not lesson 2 by default.** **Lesson 6 is the worst-abridged in the corpus** (es 0.41, ko 0.20, zh 0.12, ja 0.17 — zh is at a third of its threshold). If the next run wants maximum learner-visible gain per run, that is the pick; if it wants the track readable in order, lesson 2. **Not decided here.**
- **The `essentials` 10-15 concrete-first defect (item 94's 2026-08-31 note) was NOT touched.** That note says to fix it *in the same pass* as the translation work on those lessons, to avoid paying the five-language cost twice. **Lesson 1 is not in that cluster, so nothing was owed here** — but a run picking lessons 10, 11 or 14 must author a concrete scene in English first and carry it into four languages, and should budget accordingly.
- **Item 94's stale "do not start until O-1" recommendation is now contradicted by this entry but still sits in the item text.** I did not rewrite the item body — the backlog is at 91.5% of the floor and W-8.0's rule 5 is watching its size. **Recorded here instead; a future editor of that item should delete the recommendation rather than annotate it (W-7.2 rule 1).**

**Owner-facing, one line:** the optional `essentials` track shipped a condensed summary instead of a translation in all four non-English languages, and lesson 1 is now the first of those twelve lessons to be fully translated — es, ko, zh and ja, verified rendering in a live browser. **The gap was not only volume:** the lesson draws a figure captioned *$1,500 / $900 / $600* in every language, and in the four translations the prose that derives those numbers from Maria's $3,000 had been cut, so the figure illustrated a calculation the reader was never shown. **47 → 43 pairs; 11 lessons left, roughly eleven more runs at this rate.** ⚠️ **The honest caveat is unchanged and this run made it bigger, not smaller:** this is machine translation that no fluent speaker has read, and none of my checks can tell good Korean from awkward Korean — that is O-3, and it is your decision, not a run's. `npm test` exit 0. **Committed, not pushed** (O-5, W-8.1).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2.

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick, not a free one** — `npm test`'s two WARNs were re-read before anything else and item 94's still stands, so W-8.5 says that is the pick. The previous run was owner-directed, so W-6.2 rule 1 does not arise; its closing note offered lesson 2 "in order" or lesson 6 "maximum learner-visible gain per run" and **left the choice open. Lesson 6.**) — **`essentials` lesson 6, the worst-abridged lesson in the whole 44-lesson corpus, is now fully translated in all four languages.** es 0.41 → **1.14**, ko 0.20 → **0.54**, zh 0.12 → **0.34**, ja 0.17 → **0.45**. Abridged pairs **43 → 39**, abridged lessons **11 → 10**. **The abridgement had cut the paragraph the lesson's own takeaway is a conclusion of, and the hedge that keeps a Roth-vs-Traditional discussion out of §10.1 territory.**

**Step 3.5 — premise re-measured, and it held on both the figures and the characterization.**
- The WARN reproduces: **43 pairs, 11 lessons (2-11 and 14)**, es 10 / ko 11 / zh 11 / ja 11. The previous run's claim that **lesson 6 is the worst-abridged** reproduces exactly — `zh 0.12` against a 0.252 threshold, **a third of the bar** and the lowest cell in the table.
- **"Condensed summary rather than a translation" is true here and I read it line by line rather than inferring it from the ratio.** Section counts are parallel (2/2 in all five) and paragraph counts are parallel (3/3), so the loss is *inside* the paragraphs: each of the four had kept one compressed clause per English paragraph and dropped the rest.
- **What was missing, enumerated** — §0's entire two-coworker worked example ($200/month, 30 years, same return) **and** its `Compound Interest` cross-reference; §0's expansion of IRA and "through a bank or brokerage, employer or not"; §0's "up to a set limit" and "a detail worth checking rather than assuming"; §1's opening framing sentence ("both come in two versions, and the biggest difference is when the tax bill comes due"); §1's "smaller rules differ too" sentence; and **the whole of §1's closing paragraph**.

#### The two defects underneath the volume gap
1. **An orphaned conclusion — the same shape as lesson 1's orphaned figure, in prose.** The `takeaway` in **all five languages** says the account type *"doesn't change what you can invest in — it changes when the tax bill comes due"*. **Only English's §0 ever said the first half.** The sentence that establishes it ("the government … changed the tax treatment, not what you're allowed to invest in — a 401(k) or IRA can hold many of the same stocks, bonds, or funds") was cut from es/ko/zh/ja, so the takeaway arrived as an assertion with its premise removed. Measured before the edit and re-measured after, per language, with a string present in no language returning `false` as the control.
2. **A §10.1-relevant hedge was missing in four languages and present in one.** English §1 ends *"Both are simplifications of a genuinely individual, forward-looking tax question — not a rule that fits everyone, and not something this lesson can answer for any specific person."* **That sentence existed only in English.** It was not dangerous *yet* only because the four translations had also dropped the career-stage guidance it qualifies — so the honest statement is that this run **added advice-adjacent content to four languages and its hedge in the same edit**, never one without the other. The house phrasing for that disclaimer was taken from the corpus's own parallel sentence in `essentials` 8 (insurance) in each language, not invented.

#### What shipped (7 files)
- **4 content modules** — `lessonContent.essentials.{es,ko,zh,ja}.js`, lesson 6 only: §0 body, §1 body and `thinkAbout` in each. **`takeaway` was read in all four and skipped rather than rewritten** — it was already complete, and the two section `heading`s were already complete too.
- **`thinkAbout` needed a fix of its own the ratio would not have shown.** All four had dropped its middle sentence ("a tax-advantaged account doesn't add extra return by itself — it just lets more of the growth compound undisturbed"), which is the antecedent of the closing question. In es the question read *"¿Por qué importaría más…?"* with nothing left for *"importaría"* to refer to.
- **`scripts/translation-completeness-baseline.json`** — ⚠️ **patched by hand, and the guard that made me do it fired for real this time.** §33's failure message says to run `--write`; that regenerates every ratio, and **this run measured what that would have cost: 22 of 44 lessons currently differ from the recorded baseline at 2 decimal places, 19 of them purely as jitter inside §33's own 0.03 tolerance.** `--write` would have silently re-recorded all 22. Instead the patch is driven by **§33's own `drift()` comparator rather than a re-implementation of it**: 4 drifting pairs before (all lesson 6), 1 of 44 lessons written, 0 drifting pairs after, `note` and `tolerance` byte-identical — with a control that forcing `15:zh` to 0.99 makes the comparator report exactly 1 pair.
- **`scripts/translation-review-ledger.json`** — L6 es/ko/zh/ja re-marked `ai` for today, 1 of 44 lessons changed, `sourceHash` untouched because English did not move.
- **`LAUNCH_READINESS.md`** — the generated §10.4 volume sentence via `npm run readiness -- --write`, plus the row's hand-written counts. ⚠️ **Per W-7.2 rule 1 the previous run's 2026-09-20 sentence was REWRITTEN to cover both of today's closures rather than annotated with a fourth dated re-measurement** — it now reads 39 / 10 lessons and names lessons 1 and 6; the remaining-pairs clause goes "lessons 2-11 and 14" → "lessons 2-5, 7-11 and 14".
- **`scripts/` gained 0 lines of logic** (+8/−8, both JSON ledgers); W-6.3's ratio is unmoved and no new `check-data.mjs` section was written, so W-6.2 rule 3 does not arise.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, **2 WARN** (item 93 coverage; item 94 completeness, now reading **39** not 43) |
| Ratios | es **1.14**, ko **0.54**, zh **0.34**, ja **0.45** — all clear their thresholds (0.812 / 0.406 / 0.252 / 0.357) |
| **Not padded to threshold** | The four land on the in-track reference set — lessons 1/12/13/15 sit at es 1.05-1.16, ko 0.51-0.54, zh 0.33, ja 0.44-0.48. A translation written to clear a bar would sit at the bar; zh cleared 0.252 and landed at 0.34 |
| No figure dropped | Every English numeral (`200`, `30`, `401`) present in all four; **0 missing, 0 unexplained extras**, across all 4 fields × 4 languages |
| **Numeral check discriminates** | Control both ways: lesson 2 `zh` (still abridged) misses **4 of 7** English numerals, lesson 15 `zh` (translated) misses **0 of 4** — a checker that reported "all present" everywhere would have been wrong |
| Paragraph parity | 3/3 per section in all four, matching English; section count 2/2 |
| Encoding | **0 U+FFFD, 0 lone surrogates** in all 16 fields, read back out of the modules and again out of the live DOM |
| Quote conventions (§56) | es `“…”` for the title reference + ASCII `'match'`; ko `「복리」`; zh `《复利》` + `“匹配”` (no ASCII quotes); ja `『複利』` + `「マッチング」`. `npm test` §56 green |
| Edit safety | 12 fields asserted old-unique **and** new-absent across **all four files before any write**, then old-gone-and-new-once after; pre-copies taken to the scratchpad first (never `git checkout --`) |
| Build | `scripts/build-out-of-tree.sh` → **✓ built in 557ms**; the new prose is in **exactly 1 asset per language**, and a string in no asset returns 0 |
| **Live render, all four languages** | Served `dist/` statically, unlocked 1-5 via `localStorage` and opened `#/lesson/6` in the real DOM: **12 of 12 restored elements present in es, ko, zh and ja** — worked example, cross-reference, IRA expansion, the takeaway's premise, the match limit, the vesting caveat, the two-versions framing, the smaller-rules sentence, the Roth/Traditional hedge, the not-a-rule disclaimer and the `thinkAbout` bridge — **0 U+FFFD**, plus a screenshot of the `ja` render |
| **Render controls** | A string present in no language returns **false** in all four; the static server returns a real **404** for a bogus `/assets/` path (it deliberately does not SPA-rewrite `/assets/`, because `serve -s` returns 200 for everything and kills that control) |
| `npm run check-blindspot` | **exit 0** |

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1 — the one real risk of this item, stated above: the new §1 ¶3 is the most advice-adjacent prose this run wrote, and it carries English's attributed hedging (`suele decirse que es candidato` / `흔히 … 후보로 설명되고` / `常被描述为…的适用人选` / `候補として説明されることが多く`) **plus** the "not a rule that fits everyone" disclaimer, in all four. `check-blindspot` exit 0 over all five languages, and a direct scan of the new strings for imperative buy/sell forms returns nothing. §10.2 — no Dalio/달리오/达利欧/ダリオ/Bridgewater anywhere in the new prose. §10.3 — `kidsContent.js` untouched. Stale-data — **0 four-digit years in the new prose**, with the same regex returning `2026` on a positive control.
- **DECISIONS.md.** No conflict: content stays in `.js` modules, no state/build/platform decision touched, "(Beta)" labeling unchanged (that is O-3's subject, not this edit's).
- **Already-done backlog item.** Not a redo: lesson 6 has been on the abridged list continuously since the list existed (2026-08-24), and `translation-completeness` shows it leaving only now.
- **My own verification claim.** A reviewer re-running `npm run translation-completeness` gets these four ratios and `npm test` exits 0; the numeral, encoding and DOM checks are scratchpad scripts and browser reads, described above rather than shipped as gates (W-6.2 rule 3).
- ⛔ **The limit, unchanged and made bigger by this run, not smaller: this is machine translation no fluent speaker has read.** Every instrument above measures length, numerals, encoding, punctuation class and string presence — **all of them pass identically on fluent prose and on awkward prose.** That is O-3, and it is the owner's decision. The one thing I can say beyond volume is that each restored element corresponds to a named English sentence, enumerated in step 3.5.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **39 pairs remain: lessons 2-5, 7-11 and 14.** Two runs have now closed one lesson each, so the rate is **~1 lesson / 4 pairs per run** and the remainder is **~10 runs**, not item 94's original 24.
- **The next pick by worst-first is lesson 9** (es 0.54, ko 0.28, zh 0.17, ja 0.25), then lesson 3 (zh 0.19) and lesson 2 (zh 0.20). **Lesson 3 is worth naming for a second reason:** it is `Compound Interest`, the lesson **both** lesson 1 and lesson 6 now cross-reference by title in all five languages, and it carries a figure.
- ⚠️ **Lessons 10, 11 and 14 still owe the `essentials` 10-15 concrete-first defect** (item 94's 2026-08-31 note): a scene must be authored in English first and carried into four languages, in the same pass. **Lesson 6 is not in that cluster, so nothing was owed here.**
- **The baseline's 19 within-tolerance stale ratios were left alone deliberately.** They are jitter, not debt, and re-recording them would put 19 lessons' worth of noise in a diff about one lesson. Noting it because it is the second run in a row to find §33's prescribed `--write` unusable as written — **if a third run hits it, the fix is §33's failure message, not another hand-patch.**

**Owner-facing, one line:** the worst-translated lesson in the app — retirement accounts, where Chinese carried barely an eighth of the English — now reads in full in Spanish, Korean, Chinese and Japanese, verified in a live browser in all four. **Two things were broken beyond volume:** the lesson's closing takeaway told every reader that an account type "doesn't change what you can invest in", and the sentence establishing that had been cut from all four translations; and English's "this is not a rule that fits everyone, and not something this lesson can answer for you" existed **only in English**. **43 → 39 pairs; 10 lessons left, roughly ten more runs.** ⚠️ **The caveat is unchanged: this is machine translation no fluent speaker has read, and none of my checks can tell idiomatic Korean from awkward Korean** — that is O-3 and it is your call. `npm test` exit 0. **Committed, not pushed** (O-5, W-8.1 — the gap is now 29 commits).

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one. **Backlog:** 0 b added — the notes above are under this entry, per W-6.2 rule 2.

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read before anything else: item 94's still stands, item 160's §65 has **cleared**, so W-8.5 resolves to item 94 alone and that is the pick) — **`essentials` lesson 10 is now fully translated in all four languages AND its English opener is concrete-first, in one pass.** es 0.57 → **1.07**, ko 0.27 → **0.51**, zh 0.17 → **0.31**, ja 0.24 → **0.44**. Abridged pairs **39 → 35**, abridged lessons **10 → 9**. **The second half of this entry is the interesting one: the adversarial self-check caught that the pick owed a second, separate defect, and the fix was cheaper than the note budgeting it said it would be — because that note's premise was wrong.**

**Why lesson 10 and not lesson 9, which the previous run named as "the next pick by worst-first".** Ranked by *relative* shortfall — each pair's ratio divided by its own language's p90 reference, averaged over the four — lesson 10 is worst at **0.470** and lesson 9 second at **0.478**. That is a hair, and on the previous run's raw-`zh` ordering lesson 9 leads instead. **The tiebreak was not the metric: lesson 10 is in the `essentials` 10-15 concrete-first cluster and lesson 9 is not**, and item 94's own note says that cluster's two defects must be fixed in the same pass or the five-language cost gets paid twice. Taking 10 pays it once; taking 9 first would have left 10's two defects still coupled.

#### What the abridgement had actually removed
Takeaway and thinkAbout were already fully translated in all four languages — **the entire gap was the two section bodies**, each collapsing the English to a single paragraph:
- **§0 lost the worked example entirely.** English contrasts a staff graphic designer (set hours, a manager → W-2) with a freelance one (own hours, own equipment → a 1099 from each client over a threshold). All four translations kept the abstract rule — *the difference is who controls how the work is done* — and dropped the concrete pair that shows it. Also gone: "each January", "not your job title", and the threshold.
- **§1 lost the number a learner would actually use.** English ¶3 — *set aside roughly a quarter to a third of what you earn before it reaches your checking account, because on a W-2 that already happened automatically* — was **absent in all four languages**. So was the clause that the employer's half of payroll tax "never even appear[s] on the employee's pay stub", which is what makes the lesson's point land.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, **2 WARN** (item 93 coverage; item 94 completeness, now reading **35** not 39). Exit code read directly, not through a pipe |
| Ratios | es **1.07**, ko **0.51**, zh **0.31**, ja **0.44** — all clear their thresholds (0.812 / 0.406 / 0.252 / 0.357) |
| Not padded to threshold | The four land on the in-track reference set (lessons 1/6/12/13/15), not just over the bar |
| Paragraph parity | §0 **3/3** and §1 **3/3** in all four, matching English after the rewrite; section count 2/2 |
| Numeral parity | **0 missing** in all four. ko/ja carry extras (`1`,`3`,`4`) that are **digit-form renderings of English words** — 1월/1月 for "January", 4분의 1·3분의 1 / 4分の1・3分の1 for "a quarter to a third" — not invented quantities |
| **Numeral check discriminates** | Control: lesson 2 (still abridged) misses **7 of 12** English numerals in es and ko, 9 of 12 in zh. A clean result on lesson 10 therefore means something |
| Content read back | All 8 rewritten bodies re-imported and compared **character for character** against the intended text; a negative control (es §0 === ko §0) correctly returned false |
| Encoding | zh and ja read back rendered, by eye and by clause probe — no mojibake; terminology matches the untouched takeaway/thinkAbout (`留出`, `取り分け`) |
| Edit safety | Every replacement asserted **unique before writing**; diff is exactly **2 lines per translation file**, and the completeness baseline was hand-patched to **lesson 10's 4 ratios only** — `--write` would have re-recorded all 176 |
| Build | In-tree `npm run build` **fails** on this machine (rollup native binary / iCloud CPU mismatch, pre-existing and documented in `scripts/build-out-of-tree.sh`). `scripts/build-out-of-tree.sh` → **✓ built in 549ms** |
| **Live render** | Served `dist/` statically (with a **404 control** on a bogus path), unlocked 1-9 via `localStorage`, opened `#/lesson/10` in the real DOM in **en, es and ja**: all three restored clauses present, paragraph breaks intact. Two negative controls (a Spanish string in the Japanese render; a string in no language) both false |
| `npm run check-blindspot` | **exit 0**, 9 ok — including §10.1 advice-adjacency across all five languages on the modules edited here |
| Review ledger | English changed, so the ledger correctly marked lesson 10 **stale in all four**; re-marked `ai` (not human). Coverage back to 44/44, **human share still 0%** |

#### The concrete-first half, and why it is in this entry rather than a future one
**Step 5 caught this, not step 3.** The translation work was finished and verified before the adversarial self-check read item 94's 2026-08-31 note and found that lesson 10 is one of six consecutive `essentials` lessons that open by *defining* their subject, against §3.0.2's "concrete before abstract" — and that the note's explicit instruction is **do it in the same pass as the translation, not separately.** Committing the translation alone would have satisfied the item's headline and violated its method.

**The note's cost premise broke on contact, in the direction that made the fix cheaper.** It says none of the six "contains a concrete scene anywhere in the lesson to promote", so each needs one authored from nothing. **Lesson 10 had one** — the staff-vs-freelance designer contrast, sitting in ¶2 of its own first section, one paragraph below the definition. The fix was therefore closer to `money` 24 (which the note contrasts as the cheap case) than to the expensive case it was filed as: **name the two designers, promote them to ¶1, and delete the now-duplicated example from ¶3.** Lesson 10 now opens *"Last January, two graphic designers opened their mail"* — Nadia on staff, Priya freelance — and the definition follows in ¶2. That correction is written into item 94 so the next run checks each remaining lesson for a promotable scene instead of inheriting the budget.

**Screened with the item's own three controls, all of which fired** (lessons 29 and 1 must read concrete, a synthetic definition-first opener must read abstract): lesson 10 now reads concrete on **both** signals (name and scene verb). ⚠️ **The screen was used as a reading aid and not as a verdict** — item 94 records its measured false-positive rate at 6 in 15 and says it must never become a build gate; the opener was read directly.

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: the most advice-adjacent sentence here is the "quarter to a third" rule, and it is **reported convention, not instruction**, in all five languages — *"se les dice de forma constante"*, *"말이 늘 따라붙는"*, *"总被反复叮嘱"*, *"繰り返し言われる"*. `check-blindspot` passes on all five. §2.3: "Last January" / "去年の1月" is a story frame with no year and is not a live-looking date — the check agrees. §10.2 Dalio: nothing. §10.3 kids framing: untouched.
- **DECISIONS.md.** No conflict: content stays in `.js` modules, "(Beta)" labeling unchanged, no state/build/platform decision touched.
- **Already-done backlog item.** Not a redo — lesson 10 has been on the abridged list since the list existed, and its concrete-first defect has been open and explicitly unclaimed since 2026-08-31.
- **My own verification claim.** A reviewer re-running these commands gets these figures, **with one caveat stated rather than buried: `npm run build` does not work in-tree on this machine** and `scripts/build-out-of-tree.sh` is the route that does. The live-render proof needs `dist/` served statically; the browser pane's screenshot came back blank (a known artifact) so **every visual claim above rests on text extraction and DOM probes, not on a screenshot.**
- ⛔ **The limit, unchanged: this is machine translation no fluent speaker has read.** This run added four more pairs of it and re-marked the ledger `ai`. Human share is **0% in all four languages** — O-3 is the owner's call and nothing here settles it.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **35 pairs remain: lessons 2, 3, 4, 5, 7, 8, 9, 11 and 14.** Three runs have now closed one lesson each; at ~1 lesson / 4 pairs per run the remainder is **~9 runs**.
- **Next pick by relative shortfall: lesson 9** (0.478), then lessons 3 and 2 (both 0.510). **None of the three is in the concrete-first cluster**, so they cost translation only. **Lessons 11 and 14 still owe both defects** — but check each for a promotable scene first; lesson 10's did not need authoring from nothing.
- **W-8.1 still stands and no run can move it.** These corrections are committed, not deployed.

**Owner-facing, one line:** the lesson on employee-vs-contractor taxes was missing its worked example and its one actionable number in every non-English language, and opened with a definition instead of a person in all five — all of that is fixed together, and item 94 is down to nine lessons.

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one.

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read before anything else and item 94's still stands, so W-8.5 resolves to it alone. The previous run was also a W-8.5 pick rather than a free one, so W-6.2 rule 1 does not arise; its closing note named lesson 9 as next by relative shortfall and I re-derived that ranking rather than inheriting it) — **`essentials` lesson 9 is now fully translated in all four languages.** es 0.54 → **1.06**, ko 0.28 → **0.50**, zh 0.17 → **0.30**, ja 0.25 → **0.44**. Abridged pairs **35 → 31**, abridged lessons **9 → 8**. **The abridgement was not merely short: it had cut the bridge paragraph that the next section's opening pronoun refers back to, and the paragraph the lesson's own `thinkAbout` calls back to in all four languages.**

#### Step 3.5: the premise, re-measured with controls
The previous run's two claims both reproduce exactly. **Relative shortfall** (each pair's ratio ÷ its own language's p90 reference, averaged over the four) puts lesson 9 worst of the remaining nine at **0.4777**, next 2 and 3 at 0.512 and 0.511 — recomputed from the instrument's own table, not copied. **Lesson 9 is not in the concrete-first cluster**: item 94's note records `essentials` 1-9 as nine for nine concrete-first, and lesson 9 opens *"Ask a grandparent what a movie ticket or a loaf of bread cost when they were young"* — a scene, not a definition. So this lesson costs translation only, and **no English prose was touched** (the review ledger's English `sourceHash` for lesson 9 reads `8c61811e53af7d86` before and after, which is an independent check on that claim).

#### What the abridgement had actually removed
`thinkAbout` was fully translated in all four; **the entire gap was the two section bodies and the takeaway**, each cut from three paragraphs to two.
- **§0 ¶3 was absent in all four — and it is the bridge.** English closes §0 with *"This isn't a flaw unique to cash in a drawer — it's what inflation does to purchasing power generally, whether the money is in a drawer, a low-interest savings account, or anywhere else that doesn't grow fast enough to keep up."* §1 then opens *"A savings account that pays interest sounds like it's protecting against **this problem**"*. With ¶3 gone, "este problema" / "이 문제" / "这个问题" / "この問題" pointed at a **drawer** problem, and the section it introduces is about a **savings account**. The referent the pronoun needs was the deleted sentence.
- **§1 ¶3 was absent in all four — and all four `thinkAbout`s still call back to it.** English ¶3 is the one that links to "Compound Interest": *compounding needs to outpace inflation, not just be positive.* Every translation deleted it while keeping a `thinkAbout` that opens on 「복리」/《复利》/『複利』/"Interés Compuesto". **The closing reflection referred back to a connection its own lesson never drew** — the same cross-section dependency break lesson 1's run found, in a different shape.
- **§1 ¶2 stated the formula and never used it.** All four jumped from `real return ≈ nominal return − inflation rate` straight to the conclusion, dropping the sentence that shows the subtraction doing work: an account up a modest percentage in a year prices rose as much or more is **bigger in dollars, flat or shrinking in what it buys**.
- **§0 ¶2 was generic where English is concrete.** English names *groceries, gas, and rent*; all four said only "daily necessities". "A loaf of bread" was gone from ¶1 in all four, and "the number printed on those bills never changes" from ¶2.
- **The takeaway lost its "because" clause** in all four — *"because that's what determines whether your money's actual purchasing power is rising or falling"*, i.e. the half that says why real return is the thing to watch.

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, **2 WARN** (item 93 coverage; item 94 completeness, now reading **31** not 35). Exit code read from the command directly, never through a pipe |
| Ratios | es **1.06**, ko **0.50**, zh **0.30**, ja **0.44** — all clear their thresholds (0.812 / 0.406 / 0.252 / 0.357) |
| Not padded to threshold | The four land on the in-track fully-translated band (lessons 1/6/10/12/13/15: es 1.05-1.16, ko 0.50-0.54, zh 0.30-0.34, ja 0.44-0.48), not just over the bar |
| Paragraph parity | §0 **3/3** and §1 **3/3** in all four, matching English; section count 2/2 |
| Content read back | All 12 rewritten strings re-imported and compared **character for character** against the intended text; negative control (es §0 === ko §0) correctly false |
| **Edit safety** | Every replacement asserted **unique before writing**; diff is exactly **3 lines per translation file**; line counts unchanged; the completeness baseline was **hand-patched to lesson 9's four ratios only** — 43 lessons asserted byte-identical afterwards, because `--write` re-records all 176 |
| Numeral parity | 0 missing in all four. ⚠️ **Stated weakly on purpose: lesson 9 carries exactly one English numeral (`1,000`), so a clean result here is nearly uninformative about this lesson.** The instrument itself does discriminate — control on still-abridged lesson 2 reports 3-4 of 7 missing — but the character-exact read-back, not this check, is what carries the claim |
| Encoding | zh and ja read back rendered in the live DOM; `U+FFFD` scan clean in all four; terminology matches the untouched `thinkAbout` (`복리`, `复利`, `複利`) |
| Build | In-tree `npm run build` still fails on this machine (rollup native binary / iCloud CPU mismatch, pre-existing and documented in `scripts/build-out-of-tree.sh`). `scripts/build-out-of-tree.sh` → **✓ built in 622ms**, exit 0 |
| **Live render** | Served `dist/` statically (**404 control** on a bogus path returned 404, 200 on index), unlocked 1-8 via `localStorage`, opened `#/lesson/9` in the real DOM in **all four languages**: every restored clause present, **3 rendered paragraph blocks** per body in each. Cross-language negative controls (a Spanish string in the ja/zh render, a Japanese string in the zh render, a Chinese string in the ko render, a nonsense string) **all false** |
| `npm run check-blindspot` | **exit 0**, 9 ok — including §10.1 advice-adjacency across all five languages and §2.3 live-looking dates on the modules edited here |
| Review ledger | Re-marked lesson 9 `ai` in all four with today's date and the module's dominant reviewer name. **Coverage did not move and could not have** — see the finding below. Human share still **0%** |

#### A real gap found in passing: the review ledger is blind to translation rewrites
`translation-review.mjs` stores a hash of the **English** source. This run rewrote 12 translated strings and changed no English, so `review-status` read **"44/44, 0 stale"** throughout — the lesson 9 entries went on vouching for text that had been replaced. Re-marking is a manual step a run must remember; nothing fails if it is skipped. **This is adjacent to, but not the same as, the WARN's own caveat** ("it checks that a reviewer saw the text, not that the text is all there"): that one is about coverage vs. completeness, this one is about the entry silently outliving its subject. Written into item 94 rather than numbered (W-6.2 rule 2) — it is one line of the same item's method, and building the check is a separate change.

#### One inherited inconsistency fixed, and a guard that caught my own miscount
zh lesson 9 wrote the drawer figure as `1000美元`. The rest of that module uses the comma form **13 times — including the same $1,000 figure in the Compound Interest lesson this section now cross-references**. Converted lesson 9's three to `1,000美元`. **My first attempt asserted "3 bare forms in the module" and the guard rejected it at 4**: a `500-1000美元` range in another lesson also matches. The replacement was re-scoped to lesson 9's section string, with a control asserting that range untouched. Nothing was written on the failed attempt.

#### Where a control earned its keep
The post-write control "the old string must be gone" **fired on `ja.takeaway` and nothing was written to that file.** The cause was not a bad edit: ja's old takeaway is a **strict prefix** of the new one (the new text appends the "because" clause where es/ko/zh restructure their endings), so a plain substring test cannot distinguish "replaced" from "not replaced". Replaced with a control that tests the old string **plus its closing quote** — the JSON value rather than the text — and proved to discriminate both ways against the unedited file before being trusted.

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: nothing here instructs. The most advice-adjacent sentence is §1 ¶3's "compounding needs to outpace inflation, not just be positive" — a condition stated about arithmetic, carried faithfully from English, and `check-blindspot` passes it in all five languages. §2.3: the new prose contains durations ("twenty years", "20년", "20年間") and **no dates** — the live-date scan agrees across 26 teaching modules. §10.2 Dalio: nothing. §10.3 kids framing: untouched. **No invented quantities** — English deliberately says "a modest percentage" rather than naming one, and all four translations keep it unnamed.
- **DECISIONS.md.** No conflict: content stays in `.js` modules, `localStorage`-only state untouched, Vite unchanged, "(Beta)" labeling unchanged.
- **Already-done backlog item.** Not a redo — lesson 9 has been on the abridged list since the list existed, and no run has previously edited its translations.
- **My own verification claim.** A reviewer re-running these commands gets these figures, with two caveats stated rather than buried: **`npm run build` does not work in-tree on this machine**, and **every visual claim above rests on DOM text extraction, not on a screenshot** (the pane's screenshots are unreliable here and none was taken).
- ⛔ **The limit, unchanged: this is machine translation no fluent speaker has read.** This run added four more pairs of it and re-marked the ledger `ai`. Human share is **0% in all four languages** — O-3 is the owner's call and nothing here settles it.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **31 pairs remain: lessons 2, 3, 4, 5, 7, 8, 11 and 14** — ~8 runs at the measured rate. **Next by relative shortfall: lesson 3 (0.5110) and lesson 2 (0.5120), tied within a thousandth**; neither is in the concrete-first cluster. **Lessons 11 and 14 still owe both defects** — check each for a promotable scene first, per lesson 10's correction.
- **`LAUNCH_READINESS.md` §10.4's hand-written narrative was stale again** (it still read "35 — es 8, ko 9, zh 9, ja 9, across 9 lessons" and listed lessons "2-5, 7-9"). Updated with the per-lesson diff the row's own rule demands. **The generated sentence beside it was correct the whole time, for the fourth recorded occasion.**
- **W-8.6's Markdown guard is still unfiled** and is still the cheapest open guard.
- **W-8.1 still stands and no run can move it.** These corrections are committed, not deployed.

**Owner-facing, one line:** the lesson on inflation eating savings was missing, in every non-English language, both the sentence that connects "cash in a drawer" to "your savings account" and the sentence its own closing question refers back to — so the section transition and the closing reflection pointed at text that wasn't there; all of it is restored, and item 94 is down to eight lessons.

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** quote your own `npm test` MEASURED line, not this one.

### 2026-09-20 (scheduled dev-agent; **W-8.5's mandated pick** — `npm test`'s WARNs were re-read before anything else and item 94's still stands at 31 pairs, so W-8.5 resolves to it alone. The previous run was also a W-8.5 pick rather than a free one, so W-6.2 rule 1 does not arise; its closing note named lesson 3 and lesson 2 as tied within a thousandth and I re-derived that ranking from the instrument's own unrounded ratios rather than inheriting it) — **`essentials` lesson 3, "Compound Interest", is now fully translated in all four languages.** es 0.61 → **1.08**, ko 0.29 → **0.53**, zh 0.19 → **0.34**, ja 0.25 → **0.44**. Abridged pairs **31 → 27**, abridged lessons **8 → 7**. **This lesson's abridgement is a different shape from the previous four: paragraph parity was already perfect (2/3/2 in all four, matching English). Nothing had been cut at the paragraph level — the numbers had been cut out of the paragraphs.** A lesson whose entire subject is an arithmetic demonstration shipped, in every non-English language, as a definition with the arithmetic removed.

#### Step 3.5: the premise, re-measured with controls
- **The ranking reproduces, and the tie is real.** Recomputed from `completeness()`'s unrounded ratios rather than the printed 2-dp table: **lesson 3 at 0.509978, lesson 2 at 0.510172** — a gap of 0.0002, so the previous run's "treat them as tied" holds and its rounded figures (0.511 / 0.512) were right about the order. Took lesson 3 as the worst.
- **Control fired.** The same scorer run over the three in-track lessons that are already fully translated (`essentials` 12, 13, 15) returns **0.917 / 0.905 / 0.929** — so the instrument separates complete from abridged by roughly 0.4, and a lesson scoring 0.51 is not a compactness artifact.
- **The concrete-first question re-checked rather than inherited, and the answer is more interesting than the item says.** Item 94 records `essentials` 1-9 as nine for nine concrete-first. **That is true of the English and false of the translations.** English opens *"Imagine you put $1,000 into an account earning 6% a year"* — a scene. All four translations opened with *"Simple interest is earned only on the principal…"* — a definition. **The abridgement had deleted the concrete opener**, so the two defects this item tracks separately were, on this lesson, the same deletion. No English prose was touched; restoring the translation fixed both.
- **English `sourceHash` for lesson 3 reads `8ce798dba2274973` before and after** — an independent check on the "no English was edited" claim.

#### What the abridgement had actually removed
**Six of seven paragraphs were condensed; only §1 ¶1 was complete.** The losses are not evenly spread — they are concentrated on every number in the lesson.
- **§0 ¶1 lost the entire worked example, in all four.** English walks the balance forward: $1,000 at 6% → year one $60 → balance $1,060 → year two's 6% on $1,060 = **$63.60** → year three on **$1,123.60**. All four replaced the whole thing with one abstract sentence. **The lesson is called "Compound Interest: Money That Makes Money" and its demonstration of compounding was gone.**
- **§0 ¶2 lost the payoff of the Rule of 72.** All four kept "72 ÷ rate" and "12 years at 6%, 8 at 9%" and dropped the sentence that makes it mean anything: *that same $1,000 becomes roughly $2,000 in about 12 years, $4,000 in 24, and $8,000 in 36 — without adding another dollar.*
- **§2 ¶1 was a cross-section dependency break — the same shape lessons 1 and 9 turned out to have.** English says *"Go back to that first $1,000 earning 6%"*. All four kept the callback — es *"sobre los $1,000 originales"*, ko *"원금 $1,000"*, zh *"最初1,000美元"*, ja *"元本1,000ドル"* — **while §0, which is where that $1,000 was introduced, no longer contained it.** Every translation pointed back at a figure its own lesson had never stated.
- **The same break reaches the on-screen figure.** Lesson 3's `LessonVisual` caption reads *"the same $1,000, the same 6%"* in all five languages. In English it refers to §0. **In the four translations it referred to nothing** — and now does.
- **§1 ¶2 lost both named characters and the hedge.** English has **Priya** (start at 25, $200/mo) and **Tom** (start at 35, $400/mo); all four deleted the names and ran it as two anonymous savers. All four also dropped the closing clause — *"and it only just did it — push the return a little higher and Priya ends up ahead, a little lower and Tom does"* — **which is the clause that keeps the example from reading as a law.** Without it, "start early and you beat someone saving twice as much" ships as a promise.
- **§1 ¶3: es and ko lost the consequence entirely**, ending at "unpaid interest compounds too" and dropping *why that matters* — that years of a credit-card balance can cost more in interest than the original purchase. zh and ja kept a generalized version ("high-interest debt") and lost "credit card".
- **§2 ¶2 lost, in all four:** the parenthetical that some accounts **default to paying interest out**, the "five-minute task" framing, and the entire closing sentence about re-checking on every account because providers reset the default on renewal or transfer.

#### The arithmetic was verified before being carried into four more languages
A translation run multiplies whatever the English says by four, so the English figures were checked rather than trusted. **All of them hold.**
| English claim | Recomputed |
|---|---|
| $1,000 @6%: $60 → $1,060 → $63.60 → $1,123.60 | exact |
| 72 ÷ 6 = 12 yrs, 72 ÷ 9 = 8 yrs | actual doubling **11.9** and **8.0** yrs |
| "$8,000 in 36 years" | actual **$8,147** — the text calls it an approximation, correctly |
| Priya/Tom "within about 1% of each other, near $400,000 apiece" | **$398,298** vs **$401,806** — gap **0.88%** |
| contributions $96,000 / $144,000 | exact (480 × $200, 360 × $400) |
| **the hedge**: "a little higher and Priya ends up ahead, a little lower and Tom does" | **true, and the crossover is where the text implies**: at 6.0% Tom leads by $3.5k; at 6.5% Priya leads by $14.3k; at 5.5% Tom leads by $17.2k |

#### Verification
| Check | Result |
|---|---|
| `npm test` | **exit 0**, 0 FAIL, **2 WARN** (item 93 coverage; item 94 completeness, now reading **27** not 31). Exit code read from the command directly, never through a pipe |
| Ratios | es **1.08**, ko **0.53**, zh **0.34**, ja **0.44** — all clear their thresholds (0.815 / 0.404 / 0.252 / 0.360) |
| Not padded to threshold | All four land inside the in-track fully-translated band (lessons 1/6/9/10/12/13/15: es 1.05-1.16, ko 0.50-0.54, zh 0.30-0.34, ja 0.44-0.48) |
| Paragraph parity | §0 **2/2**, §1 **3/3**, §2 **2/2** in all four, matching English; sections 3/3. **This one was already correct before the edit and is not evidence of anything here** — stated so it is not read as a win |
| Content read back | All 12 rewritten strings re-imported and compared **character for character** against the intended text — 12/12 exact; negative control (es §0 === ko §0) correctly false |
| **Numeral parity** | English lesson 3 carries **25 amounts**; **0 missing in all four**. ⚠️ Unlike lesson 9's near-vacuous single-numeral result, this is the check that carries the most here — and the instrument was proved to discriminate on the same run: still-abridged **lesson 2 reports 3 of 7 missing** (`600`, `50`, `15`) in all four |
| **Reverse numeral control** | Amounts present in a translation but not in English: es 0, zh 0, **ko 2**, **ja 4**. Chased rather than waved off — they are `10년`/`5분` and `2倍`/`3年目`/`10年`/`5分`, i.e. English writing "ten-year", "five-minute", "twice as much", "Year three" in words where CJK uses digits. **Not invented money**, and the control confirms it: untouched lesson 1's `ja` reports the same 4 |
| **Edit safety** | Every replacement asserted **unique before writing** and **absent after**; new string asserted present exactly once; line counts unchanged in all four files; diff is exactly **3 changed lines per file** (6 diff lines = 3 removed + 3 added) |
| Baseline | Hand-patched to **lesson 3's four ratios only** — asserted afterwards that exactly 4 of 176 entries moved and all four are lesson 3. `--write` was **not** used: it re-records all 176 |
| Encoding | `U+FFFD` scan **0** in all four files; zh and ja read back rendered in the live DOM |
| Build | In-tree `npm run build` still fails on this machine (rollup native binary / iCloud CPU mismatch, pre-existing and documented in `scripts/build-out-of-tree.sh`). `scripts/build-out-of-tree.sh` → **✓ built in 573ms**, exit 0 |
| **Live render** | Served `dist/` statically and opened `#/lesson/3` in the real DOM in **all four languages**, with lessons 1-8 unlocked via `localStorage`. Every restored clause present: **es 10/10, ko 10/10, zh 11/11, ja 10/10** probes. Rendered paragraph blocks **2/3/2** per section, `white-space: pre-line` confirmed. Cross-language negative controls (each language's distinctive strings searched in the other three renders) **all false**; a nonsense string false in all four |
| **A control that had to be rebuilt before it meant anything** | The first static server answered **200** to a deliberately bogus asset path, because its SPA fallback served `index.html` for everything — so "the page loaded" would have been unfalsifiable. Rewritten to fall back only for extensionless paths; it then returned **404** on the bogus `.js` and **200** on a real hashed asset. Only after that did any render result get read |
| `npm run check-blindspot` | **exit 0**, 9 ok — including §10.1 advice-adjacency across all five languages and §2.3 live-looking dates over 26 teaching modules |
| Review ledger | Re-marked lesson 3 `ai` in all four; asserted exactly 4 of 176 entries changed. Human share still **0%** |

#### One inherited inconsistency fixed, and one deliberately left
**Fixed.** `$`-form money figures were the outlier in two files and lesson 3 was the *only* place they occurred. Measured before touching anything: `lessonContent.essentials.zh.js` carried **34 `N美元` against 5 `$N`** — and **all five `$N` were in lesson 3 §1**. `ja` was identical in shape: **35 `Nドル` against 5 `$N`, all five in lesson 3 §1**. Since those strings were being rewritten anyway, they were written in each file's dominant form; both files now read **0 `$N`**. **`ko` was left alone on purpose** — it is genuinely mixed (`$N` in lessons 3, 4, 11, 12, 13 against 25 `N달러`), so there is no dominant form to move toward and lesson 3 was already internally consistent.
**Left, and it is worth the next run knowing.** That fix exposes a **cross-module convention split**: `moneyVisuals.js`, which renders lesson 3's inline figure, is **244 `$N` against 4** — `$` is that module's house style in all five languages. So the zh/ja lesson-3 screen now reads `1,000美元` in the prose and `$1,000` in the figure caption. **This is a pre-existing split, not one this run created** (zh §2 already said `1,000美元` beside the same caption), and closing it means converting one module or the other across five languages — a separate change, not a rider on a translation pass. **Filed here rather than numbered, per W-6.2 rule 2.**

#### Where the names came from
Priya and Tom are not new to the corpus, so the transliterations were **measured, not invented**: `프리야`/`톰`, `普莉娅`/`汤姆`, `プリヤ`/`トム`. ⚠️ **One discrepancy surfaced and was deliberately not "fixed":** the `money` track renders Priya as **`普里娅`** in zh while `essentials` (lesson 10) renders her **`普莉娅`**. Lesson 3 follows its own file, because that is the file a reader walking the `essentials` track reads. **The cross-track split is real and is left standing** — deciding which spelling wins is a corpus-wide call, not a lesson-3 one.

#### Step 5: adversarial self-check
- **Blindspot register.** §10.1: nothing here instructs; the most advice-adjacent restored sentence is §2's "it's worth checking on every account you open", which is about an administrative setting, is carried faithfully from shipped English, and passes `check-blindspot` in all five languages. **The restored §1 ¶2 hedge cuts *against* §10.1** — without it the lesson promised that starting early beats saving twice as much, and now it says the result is knife-edge. §2.3: the new prose carries ages and durations and **no dates**; the live-date scan agrees across 26 modules. §10.2 Dalio: nothing. §10.3: untouched. **No invented quantities** — every figure traces to English, verified in both directions above.
- **DECISIONS.md.** No conflict: content stays in `.js` modules, `localStorage`-only state untouched, Vite unchanged, "(Beta)" labeling unchanged.
- **Already-done backlog item.** Not a redo — lesson 3 has been on the abridged list since the list existed and no run has previously edited its translations.
- **My own verification claim.** A reviewer re-running these commands gets these figures, with two caveats stated rather than buried: **`npm run build` does not work in-tree on this machine**, and **every visual claim above rests on DOM text extraction, not on a screenshot** — none was taken.
- ⛔ **The limit, unchanged: this is machine translation no fluent speaker has read.** This run added four more pairs of it and re-marked the ledger `ai`. Human share is **0% in all four languages** — O-3 is the owner's call and nothing here settles it.

#### Seen, deliberately NOT fixed and NOT numbered (W-6.2 rule 2)
- **27 pairs remain: lessons 2, 4, 5, 7, 8, 11 and 14** — ~7 runs at the measured rate of one lesson / four pairs. **Next by relative shortfall, recomputed after this edit: lesson 2 (0.5102), then lesson 8 (0.5739)** — no tie this time, a clear 0.064 gap. **Lesson 2 is not in the concrete-first cluster; lessons 11 and 14 still owe both defects**, so check each for a promotable scene before budgeting it as authored-from-nothing.
- **`LAUNCH_READINESS.md` §10.4's hand-written p90 reference was stale**: it read `es 1.18` where the live instrument now reads **1.16**. Corrected, with a note telling the reader to run the command rather than quote the sentence. **That is the fifth recorded occasion on which a hand-typed figure in this row was wrong while the generated sentence beside it was right.**
- **The cross-module `$` vs `美元`/`ドル` split** described above, and the cross-track `普里娅`/`普莉娅` split.
- **W-8.6's Markdown guard is still unfiled** and is still the cheapest open guard.
- **W-8.1 still stands and no run can move it.** These corrections are committed, not deployed.

**Owner-facing, one line:** the lesson whose whole job is to show compound interest doing its work shipped to every non-English reader with the arithmetic taken out — no $1,000 growing to $1,060 to $1,123.60, no doubling chain, no Priya and Tom, and a later paragraph plus the on-screen figure both pointing back at a "$1,000" the lesson had never mentioned; all of it is restored in four languages, and item 94 is down to seven lessons.

**Schedule:** the cron is the owner's lever; not read, not touched. **Log size:** `npm test`’s MEASURED line, read **with this entry in the tree**: run log **147 KB**, file **603 KB**, floor 456,519 b, 1 live day — **~59%** of the run-log warn budget, **8.6 runs** of headroom. ⚠️ **Quoted post-append on purpose, and rounded to the KB the instrument itself prints, not to the byte:** the figure a run measures *before* writing its own entry is not the one a reviewer re-running `npm test` on the commit sees, and a byte-exact quote inside the file it measures cannot be made true — correcting it moves it again. The floor figure is exact because this entry does not touch the floor.
