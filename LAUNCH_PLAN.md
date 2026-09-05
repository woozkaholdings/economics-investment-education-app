# Economic Cycles — Master Launch Plan (v2)

**Status:** authoritative. Supersedes `Economic_Cycles_Launch_Plan.docx` (v1, August 2026), which is
kept unchanged as the historical original.
**Last revised:** 2026-08-04.
**Product goal:** a **financial-literacy and money-lessons app for kids through adults**, in plain
language and an easy-to-read format. The clarity standard in §3.0 is the primary success criterion,
ahead of topical coverage or feature count.

> **On the name.** The repository, the v1 document title, and much of the lesson content
> ("economic cycles", yield curves, QE/QT) read as an economics course for adults. That is the
> *vehicle*, not the product — owner-clarified 2026-08-04. How the economy works is taught in
> service of someone understanding money. Judge every screen and every lesson by whether a
> motivated beginner, or an older child, can follow it without re-reading.

> **⚠️ SUPERSEDED IN PART, 2026-08-18 (owner-directed).** The "vehicle, not the product" framing
> above is **no longer the ordering rule**, and is kept because the 2026-08-07 track split and the
> 2026-08-14 renumbering were both built to implement it — deleting it would leave those changes
> unexplained. What replaces it:
>
> - **The economic machine is now the main path.** `TRACKS` order is `economy` → `money` →
>   `essentials`, and a new install opens on the economy track.
> - **The money track teaches judgment, not procedure.** It is now lessons 16-28 only — what counts
>   as an asset, why a raise disappears, sunk cost, present bias. The owner's framing: *wise money
>   lessons, not practical information throwing* — the insight that financial literacy is not taught
>   in school, and that income from labour behaves differently from income from assets or a business.  <!-- us-english:allow: blockquoted excerpt -->
> - **The mechanics became optional.** Lessons 1-15 (budgeting, credit scores, 401(k), insurance,
>   taxes) are the new `essentials` track: kept in full, accurate, and reachable, but no longer the
>   first thing a new learner meets. Fifteen how-to lessons in front of the door was the problem.
>
> **What did NOT change:** the clarity standard in §3.0 is still the primary success criterion, the
> audience is still kids-through-adults, and §10.1's no-advice rule binds the new material *harder* —
> a hierarchy of income types must be taught as how those incomes **behave** (does it continue when
> you stop working? how is it taxed? what risk does it carry?), never as a recommendation about what
> a reader should go and earn. See DECISIONS.md's 2026-08-18 Update for the mechanics of the split.
>
> This widened audience pulls against §10.3, which deliberately made the kids material
> **parent-facing** to avoid COPPA's child-directed classification. That tension is real and is
> **an owner decision, not a design one** — see §10.3.

> **How to use this file.** This is the plan automated runs and the project owner both read.
> `AGENT_LOG.md` records *what was done*; `DECISIONS.md` records *why*; this file records *what we
> are building and in what order*. Section numbers match v1 so existing references (§10.1, §2.2,
> §3.2 …) still resolve.

---

## 0. What changed from v1, and why

v1 was written when a single-file prototype was the only asset, so it framed the whole build as
"migrate the prototype." That framing turned out to be the plan's central defect: it kept work
anchored to a sketch instead of to a product, and it has since drifted out of agreement with
decisions the project actually made.

| v1 said | Corrected in v2 | Why |
|---|---|---|
| Migrate `economic-cycles-v5.jsx` file-by-file into the new structure (§2.2, §7.1, §8, §11) | **The app is authored fresh in `src/`. `v5.jsx`/`v6.jsx` are reference inputs only** (§2.1) | A prototype is a source of *requirements*, not a codebase to inherit. Patching it carried its accidents forward as if they were decisions. |
| Keep the prototype's four-tab layout and visual style (§3.1) | **Navigation and visual system are designed from scratch** — three destinations, authored type and color (§3.1, §3.1.1) | Same defect one level up: inheriting a sketch's *design* is no different from inheriting its code. The old layout duplicated the lesson list across two tabs and filed core tools under "More". |
| Lessons "based on Ray Dalio's economic-machine framework"; the app credits and quotes him (§1) | All framing is "principles popularized by economists and investors"; no name-brand dependency, no quotes | v1 contradicted its own §10.2, which flags exactly this as legal/platform risk. §10.2 is closed; the plan text now matches. |
| Content becomes `lessons.json`, `quizzes.json`, `glossary.json` (§2.2) | Content lives in `.js` modules under `src/content/` and `src/locales/` | Closed decision — see `DECISIONS.md`, "Content as `.js` modules, not JSON". `.js` imports natively, carries invariant comments, and stays diffable. |
| The Markets tab hardcodes "February 2026" and needs fixing (§2.3) | Already fixed — the tab is dateless and figure-free by design (§2.3) | Shipped 2026-08-02. §2.3 now states the standing rule instead of the defect. |
| Build on Expo (React Native) from week 1 (§2.1, §8) | **Open owner decision.** The runnable app is Vite + React (web-only) today (§2.1) | See `DECISIONS.md`, "Expo vs. Vite". Real cost either way; not an agent's call to make unilaterally. |

<!-- path-ok: economic-cycles-v5.jsx — the owner's local prototype original, GITIGNORED by the 2026-08-16 decision recorded in .gitignore ("ignored, not deleted") — it is on the owner's disk and in git history, and no clone of this repo has it, so this reference must never resolve; restoring the file to the repo would be undoing that decision, not fixing this marker -->
<!-- path-ok: economic-cycles-v6.jsx — the second prototype original, gitignored by the same 2026-08-16 decision and for the same reason; v6 additionally carries the branding that blindspot 10.2 exists to keep out, and hardcoded dates that §2.3 does, so it is deliberately absent from every clone -->
<!-- path-ok: v5.jsx — prose shorthand for economic-cycles-v5.jsx, gitignored on disk (see .gitignore); the table above is history and must keep naming it the way v1 did -->
<!-- path-ok: v6.jsx — prose shorthand for economic-cycles-v6.jsx, gitignored on disk; same reason -->
<!-- path-ok: lessons.json — a format this project DELIBERATELY REJECTED (see DECISIONS.md, "Content as .js modules, not JSON"). It must never resolve; making it resolve would be undoing the decision -->
<!-- path-ok: quizzes.json — same rejected-format row; never to be "fixed" into an existing path -->
<!-- path-ok: glossary.json — same rejected-format row; never to be "fixed" into an existing path -->

**Standing rule that replaces the migration instruction:**

> `economic-cycles-v5.jsx` and `economic-cycles-v6.jsx` are **reference material, not source code.**
> Read them for *what the product should cover* — lesson topics and sequence, quiz questions,
> glossary terms, kids-section framing, chart and feature ideas. Never import them, extend them,
> re-export them, or wire them into the build. Neither file is part of the application.
>
> They also carry defects that must **not** be copied forward: `v6.jsx` reintroduces direct Dalio
> branding and a hardcoded "April 2026" date, both of which this plan explicitly removes (§10.2,
> §2.3).

---

## 1. Executive summary

The asset is not a codebase — it is **subject-matter work**:
**44 sequenced lessons, 46 quiz questions with explanations, 43 glossary terms**, age-banded kids
material, and a market-teaching dashboard, all in five languages. That content is the thing worth
keeping, and it carries over regardless of what the app is written in.
*(Those three figures are generated by `npm run readiness`, not typed — see §4.0.)*

Three strategic calls, unchanged from v1 because they still hold:

1. **Sell structure and habit, not information.** Facts are free and every LLM explains them. People
   pay for a guided path, visible progress, and the feeling of getting somewhere.
2. **One codebase across platforms**, sequenced — web first, stores later. (Which framework delivers
   this is the open §2.1 decision.)
3. **Run the project as a system that audits itself** (§9) against a living blindspot register (§10).

What v2 adds: **clarity is the product** (§3.0). An education app that is merely accurate is not
finished. If a motivated beginner cannot follow a lesson without re-reading it, that lesson is a bug.

---

## 2. Product architecture

### 2.1 The stack

The app is authored in this repository under `src/`. Current runnable stack: **Vite + React**,
web-only, no backend, all state in `localStorage`.

| Layer | Current | Planned | Notes |
|---|---|---|---|
| App | Vite + React (web) | **Open** — Expo (React Native) vs. staying web-first | `DECISIONS.md`. Blocks store release, not web release. |
| Content | `.js` modules in `src/content/`, `src/locales/` | Same; possibly server-hosted later | Closed decision. |
| State | `localStorage` | Supabase accounts + sync | Closed as current approach; revisit with real accounts. |
| Payments | none | Route depends on §4.3 phase and the §2.1 platform call | Not built. See §4 — the current phase has no payment code by design. |
| Analytics | local event sink (`src/lib/analytics.js`) | PostHog | Events are defined and fire; the log is capped and stays on the device. Wiring a provider is owner-blocked on an account and key (§9.2, backlog item 18). |
| Hosting | static build | Vercel / EAS Hosting | $0 at launch scale. |

### 2.2 Code structure

The application is written fresh, not migrated. Target shape:

```
src/
  App.jsx            app shell — tab routing, header, first-launch notice
  theme.js           design tokens (color, type, spacing) — no inline hex in components
  lib/               storage + app state hooks; pure logic, no JSX
  components/        reusable pieces (ui primitives, charts)
  screens/           one file per screen; sub-screens nested
  content/           lessons, quiz, glossary, kids, markets — data only
  locales/           one file per language
```

Rules: content files contain **no JSX**; screens contain **no hardcoded copy** that should be
translatable; components read color and type from `theme.js` rather than literal values.

### 2.3 The Markets tab — standing rule

The tab is an **explicitly educational, dateless, figure-free** teaching surface: yield-curve shapes,
what QE/QT are, how rate changes have historically related to asset classes. It shows no current
date and no live-looking market numbers.

This is not a stylistic preference — a finance app showing stale data loses credibility instantly,
which is worse than showing none.

**Updated 2026-08-04:** daily end-of-day data now ships (Reference → Sector performance), so the rule
is sharper than "no numbers". The distinction that matters is *fake freshness* versus *dated
freshness*. v1's defect was a hardcoded date that never moved. What is permitted is a real `asOf`
that updates, is shown before any figure, and suppresses itself: data older than four days renders
"unavailable" rather than as a current reading, and fixture-built data is labeled as a sample. Any
figure without that machinery behind it still violates this section. See `DECISIONS.md`, "Market
data", and the teaching surfaces (yield-curve shapes, QE/QT) remain deliberately dateless.

---

### 2.5 Curriculum structure — three tracks

*Added 2026-08-07 (owner-directed). Implements §0's "the economics is the vehicle, not the product."
Split into three 2026-08-18 (owner-directed, interactive) — see the note at the top of this document
and DECISIONS.md's 2026-08-18 Update for why: the money track was two curricula under one label, and
the split makes each independently gated.*

The catalog is **three independent curricula**, not one sequential path:

| Track | Key | Lessons | Role |
|---|---|---|---|
| **How the Economy Works** | `economy` | 29–40 (12) | The main path. A new install opens here. Transactions, credit, productivity, the debt cycles, deleveraging, rates, the yield curve, QE/QT, phases, indicators. |
| **Your Money** | `money` | 16–28, 41–44 (17) | The product — judgment, not procedure. The spending and investing decisions mechanics don't settle: opportunity cost, lifestyle inflation, hedonic adaptation, sunk cost, herd behavior, anchoring, confirmation bias, present bias, needs vs. wants, time horizon, mental accounting, loss aversion, the hot-hand fallacy. |
| **Essentials** | `essentials` | 1–15 (15) | Optional mechanics — kept in full and unchanged, but gates nothing and nothing gates it. Budgeting, emergency funds, compound interest, credit scores, stocks/bonds/diversification, 401(k)/IRA basics, taxes, insurance, inflation, W-2 vs. 1099, investment fees, renting vs. buying, brokerage accounts, estate planning, credit reports vs. scores. |

All three tracks have their first lesson unlocked from install; lessons gate sequentially **within** a
track only. **How the Economy Works leads** — a new install opens into "Transactions," not
"Budgeting."

**The three id ranges above are generated** by `npm run readiness` and checked on every `npm test`
(backlog item 55). They are guarded because they failed: this table still read `money 13-26` and
`economy 1-12` for three days after the 2026-08-14 renumbering — the stale-id defect items 33 and 36
chased through four passes of lesson prose and quiz explanations, sitting untouched in the section
that *defines* the curriculum. The range form assumes each track's ids are contiguous; the generator
refuses to write rather than round over a gap if that stops being true.

**Why this had to change.** Until 2026-08-07 these were one chain in build order, so the entire
practical curriculum sat behind ~24 minutes of macro theory. That is the single clearest instance of
the §10.7 drift this plan warns about: §0 was rewritten on 2026-08-04 to say the economics is the
vehicle, and the app was never changed to match. It also worked against §4.3's own second gate
(≥40% of installers finish lesson 1) by putting the least audience-relevant lesson first.

**When adding a lesson,** declare its `track` — `npm test` fails otherwise. Ask which track *and*
which age band it serves before writing it (§3.0).

### 2.6 Kids financial literacy — a real gap, not a built feature

*Assessed 2026-08-07 after the owner asked whether kids lessons are already in the plan. Figures
refreshed 2026-08-15 (dev-agent run) — this section had gone stale after two rounds of content
additions (AGENT_LOG.md backlog item 21); see that item's run-log entries for what changed and why.*

**What exists today is a growing appendix, not yet a kids curriculum.** `src/content/kidsContent.js`
holds three age bands (5-8, 9-12, 13-17), each now with **seven short blurbs and one activity —
21 blurbs total** (up from three per band / nine total as originally assessed here), surfaced only
inside Reference → Parent Guide as parent-facing "teach your kids" material.

Two problems as originally assessed; the first is unchanged, the second is now partially closed:

1. **It is still not lesson-shaped.** 21 blurbs against 40 adult lessons; each band carries
   `title`/`lessons`/`activity`/`parentTip`, and each blurb inside it carries `text` and `why`
   (the `why` field added 2026-08-16, `DECISIONS.md`). **Resolved 2026-08-16:** a kid-directed lesson UI
   stays owner-only (§10.3/item 19, unchanged); richer parent-facing content structure is not
   blocked but isn't scoped either, and growing the blurb count by default is explicitly discouraged
   (it isn't gated by any §4.3-style clause). See `DECISIONS.md` ("Kids financial-literacy content:
   format stays parent-facing, structural depth un-scoped") and backlog item 21.
2. **Its content was economics, not money skills — now a mix.** Each band's original three blurbs
   are still economics (5-8: trading toys, inflation, a piggy bank; 9-12: mortgages/credit, economic
   seasons, "good" debt; 13-17: connected spending, the Fed as thermostat, 2008). The four blurbs
   added per band since (2026-08-07 and 2026-08-15) are genuine money-skills content: wants vs.
   needs, earning an allowance, saving toward a goal, a first bank account, checking a balance
   before spending, "pay yourself first," comparison shopping, delayed gratification, budgeting as a
   plan made before spending, sales tax, gross vs. net pay, and what a credit score measures (framed
   as not something to build on purpose as a teenager).

**The safe next step, needing no legal decision:** the money-skills topics originally named here
(allowance and saving, wants vs. needs, earning, price comparison, a first account) are now built —
see the list above. More topics can still be added in the same parent-directed format without a
legal decision; §10.3's COPPA posture stays untouched either way.

**The step that is NOT a design decision:** making the kids material *child-facing* — child accounts,
a kids mode, or kid-directed lesson UI — changes the app's COPPA classification, its store privacy
category, and its ad eligibility. Per §10.3 that is an **owner decision**; no run may make it.

---

## 3. UI/UX

### 3.0 The clarity standard (primary success criterion)

The app's promise is that a beginner *understands*. Every screen is measured against these, and a
failure here outranks a missing feature:

1. **One idea per screen.** If a lesson section teaches two things, it is two sections.
2. **Concrete before abstract.** Lead with a thing that happens to a person, then name the concept.
   "You buy coffee; that is a transaction" before "an economy is the sum of transactions."
3. **No undefined jargon.** A term either gets defined where it appears or links to the glossary.
   If it needs neither, it probably should not be there.
4. **Show, don't only tell.** The animated diagrams are the differentiator — an LLM can explain a
   yield curve in text; a curve inverting in front of the reader is what a chat window cannot do.
5. **Short enough to finish.** Lesson 1 under four minutes; every lesson carries an honest
   minutes estimate. People commit to five minutes, not to "learning economics."
6. **Plain language over precision theater.** Prefer the shorter word. Where a simplification is
   genuinely lossy, say so in one clause ("roughly", "a common rule of thumb") rather than
   retreating into jargon — see the GDP/recession and yield-curve wordings already in the content.
7. **Readable by default.** Body text meets WCAG AA contrast, scales with the in-app text-size
   control, and works at 375px wide.

### 3.1 Information architecture

**Navigation is designed around the learning path, not inherited from the prototype.** v1 said to
keep the prototype's four tabs (Home, Learn, Markets, More) because they were "standard mobile
navigation." That was the same defect as §0: preserving a sketch's accidents as if they were
decisions. Reviewed against §3.0, that layout had three real problems:

- **"More" was a junk drawer.** The quiz and the glossary are core comprehension tools; filing them
  behind a generic label says they are leftovers.
- **Home and Learn duplicated each other.** Both rendered a lesson list, so "where do I continue?"
  had two answers.
- **Two levels of navigation** (bottom tabs plus a segmented sub-nav) for an app this size is
  more chrome than content.

The structure is three destinations, each named for what a beginner would call it:

| Destination | Holds | Why it is top-level |
|---|---|---|
| **Learn** | The path: progress, then both tracks' lessons in order (§2.5). Opening one pushes a full-screen reader. | The spine of the product. One place to see where you are and continue. |
| **Practice** | The quiz, with explanations. | Checking understanding is a distinct intent from reading, and it is how a learner finds out what did not land. |
| **Reference** | Glossary · Market signals · Sector performance · For parents · About | Genuinely look-it-up material, grouped honestly rather than as "everything else". |

A lesson is a **pushed view, not a tab** — it has a back affordance and fills the screen, because
reading is the one thing that deserves undivided attention.

What carries over from the prototype is *content structure*, not layout: sequential unlocking,
per-lesson "Key Takeaway" and "Think About This", and age-banded parent material. Those are
pedagogy, and they earned their place.

#### 3.1.1 Visual system

Authored, not inherited. The prototype's look — 10–13px type, saturated tinted boxes stacked on
every screen, a different accent color per lesson, emoji standing in for interface icons — worked
against §3.0. Small dense text is the opposite of "easy to understand", and when everything is
color-coded, nothing reads as important.

The system instead is: **16px base type** with a clear hierarchy; **one accent color** plus
semantic success/caution/danger and a single neutral ramp; **generous whitespace** in place of
borders and tints; **line icons** for interface chrome, with emoji reserved for content where they
carry meaning.

**Per-lesson color is not rendered at all.** The ceiling this section set was "a thin accent, never
body text or a fill"; the rebuilt app went further and paints none of it — lesson rows draw their
badge from the shared `ink.*`/`fill.*` tokens. `src/content/lessons.js` still authors a `color` on
all 40 lessons that **nothing reads** (measured under backlog item 75 on 2026-08-17, re-measured
2026-08-21), kept deliberately in case a redesign wants it; that file's header states the one thing a
redesign must not do with it. Painting it would owe it a contrast pass — new work, not a rename.

### 3.2 The first five minutes

Design the first session as the most important feature. No registration — drop the user straight
into lesson 1. Lesson 1 ends in a small win: completion animation, progress bar at 1/44, and a
one-tap "continue tomorrow" prompt. Ask for an account only when there is something worth saving.

*Status: shipped as a local-only flow (progress bar, celebration, first-open routing, streak,
continue-tomorrow prompt). The account half waits on a backend. The v1 plan said "ring" here and in
§3.3; the app has only ever rendered a bar, and 2026-08-17 decided the plan should match the app —
see `DECISIONS.md`.*

### 3.3 Habit mechanics

Visible streak, progress bar, per-lesson minutes estimate, opt-in daily reminder worded as
curiosity ("Why do recessions actually start? Lesson 5 is ready") rather than nagging. Immediate,
kind quiz feedback with explanations.

*Status, added 2026-08-31 — this was the only subsection of §3 carrying no status line, and that is
how the gap below shipped for 28 days without being named. Four of the five mechanics are built:
the streak chip and both progress bars (`Learn.jsx`), the per-lesson minutes estimate on the path,
the resume card and the reader (`estMinTemplate`, derived — see §3.0.5), and immediate quiz feedback
with a per-question explanation on both quiz surfaces. **The daily reminder is NOT built and cannot
be from this codebase**: there is no Notification API call, service worker, manifest or push
subscription anywhere in the build, and scheduling a next-day notification needs the held
Expo-vs-Vite platform decision (§2.1, `DECISIONS.md`). What ships is the opt-in half only — a
once-a-day prompt on lesson completion whose choice is persisted for a future reminder feature to
read. **Its button promised the missing half until 2026-08-31**, reading "Remind me tomorrow" in all
five languages (`ko`/`zh` said "notify me" outright); it is now a commitment the learner makes ("I'll
be back tomorrow"), which is true as shipped and still records the same opt-in. When a real reminder
lands, this clause's "worded as curiosity rather than nagging" requirement applies to the
notification copy and is not yet met by anything.*

### 3.4 Theming and typography

**§3.1.1 is the visual system**; this section is only the theming layer under it. ~~One typeface.~~
**Two, since 2026-08-23 (owner-directed), and the pairing is the rule rather than an exception:** a
**system serif** on the two largest scales only (`display`, `title` in `theme.js`) and the sans stack
everywhere else. Body copy — everything a learner reads at length — is unchanged. This is the
editorial voice of the owner's `UIUX/` reference set, and it is a system stack, so it costs no
webfont. **"One typeface" was aimed at the v1 chaos §3.1.1 describes** (a different accent per
lesson, emoji for icons); a two-family pairing with a fixed role for each is not that, and the
one-accent rule it sat beside is untouched. See `DECISIONS.md`.
**Dark mode** (finance audiences skew dark) — **shipped**: light/dark/system in
`src/lib/useAppState.js`, picker in `src/screens/reference/Settings.jsx`. Color and type come from
`theme.js`, which carries a single accent in its `ink`/`fill`/`surface` variants and no per-lesson
palette. **The palette itself is warm as of 2026-08-23** — cream over white in light, warm espresso
in dark — re-derived against `check-data.mjs` §28 rather than eyeballed: 110 text pairs at WCAG AA,
70 graph pairs at 1.4.11, zero exemptions.

*Retitled 2026-08-21 (backlog item 62's F6). Until then this was a second section also called "Visual
system", opening "One accent colour per lesson/phase" — the v1 emphasis §3.1.1 supersedes, and one <!-- us-english:allow: verbatim quotation of the old §3.1.2 opening line; see AGENT_LOG.md:194-199 -->
the app has never shipped. The duplicate title was the load-bearing defect, not the wording: §-numbers
here are cited from source (`src/theme.js`, `src/components/LessonVisual.jsx`) and by the dev-agent's
blindspot rules, so a reference by title had two possible targets that said opposite things.
`scripts/check-data.mjs` §32 now enforces that no two headings in this file share a title. The number
3.4 was kept rather than the section deleted, because renumbering §3.5 would break references in
`working_files/build_doc.js` and throughout the run log.*

### 3.5 Accessibility and languages

English is the product; the other four languages ship marked **beta** until a native speaker reviews
each. Support dynamic font sizes and screen-reader labels on every interactive element — app stores
increasingly check this and it widens the audience at near-zero cost.

---

## 4. Monetization

> Rewritten 2026-08-04. v1's pricing table was written when the app was an idea; it did not survive
> contact with the content that actually exists. This section replaces it.

### 4.0 What is actually for sale

Measure before pricing. The lesson content today is
**44 lessons, ~152,000 characters of English body text, ~161 minutes of reading end to end**.
That is roughly **26,400 words** — a short book, not the long magazine article this line described
when the catalog held twelve lessons.

This sentence used to end "count it again rather than trusting this line," and for two weeks nobody
did: it was still quoting twelve lessons and twelve minutes on 2026-08-17, when the catalog held
forty and a hundred and twenty. **So it is no longer typed.** Every figure in it, in §1, in §2.5's
track table, in the asset table below and in §4.3's gate verdict is generated by
`scripts/refresh-readiness.mjs`; `npm test` fails when the document disagrees with the content, and
`npm run readiness -- --write` updates it. What is *not* generated — deliberately — is the reasoning
in §4.1 and §4.2 about what finite content can be sold for. That is judgment that happens to cite a
number, and regenerating it would be a script rewriting an argument.

The catalog splits into two very different things, and conflating them is what produced v1's
pricing:

| Asset | Recurs? | Monetizable as |
|---|---|---|
| 44 lessons + quiz + glossary | **No** — finite; a few sittings to finish, then it is done | A one-time purchase |
| Spaced review queue | Yes — value accrues the longer you use it | Subscription |
| Daily sector + FRED data | Yes — updates every weekday | Subscription |
| Parent guide (kids bands) | No, but recurs *per child* | Family purchase |
| 5 languages, plain-language reading level | No — a reach multiplier, not a product | Distribution |

**A subscription must be justified by what recurs.** Charging a recurring fee for a finite course
invites the obvious question at renewal — "I finished it, why am I still paying?" — and the honest
answer today would be "you aren't getting anything new."

### 4.1 Why v1's numbers don't hold

v1 proposed $6.99/mo and $39.99/yr, benchmarked against Bloom (~$15/mo) and Finimize (~$200/yr).
Those are the wrong comparables: Bloom bundles actual investing tools and Finimize sells market
briefings to active investors. Against the *real* competitive set, consumer willingness to pay for
financial-literacy content alone is weak:

- **Khan Academy** — comprehensive, free, nonprofit.
- **Zogo** — free to the user; **financial institutions pay for it** as a white-label product.
- **Greenlight** — parents do pay ($5.99–14.98/mo), but the anchor is a **debit card and allowance
  tooling**, not lessons. It serves 6.5M+ parents and children with ~75 institutional partnerships
  including JPMorgan Chase and U.S. Bank.

The pattern across the category: **where financial literacy is the whole product, the consumer
usually does not pay — an institution does.** Where consumers pay, it is because the lessons ride on
top of a tool that does something.

### 4.2 Three revenue paths, ranked by fit

**1. Institutional / white-label — the strongest fit, and absent from v1.**
Credit unions, banks, employers and schools buy financial-literacy tools as a compliance, CRA and
member-acquisition line item, on budgets that do not depend on 2% consumer conversion. This app's
genuine assets map unusually well: five languages, a plain-language reading level that spans kids to
adults, and a parent-facing kids module — exactly what an institution needs for a mixed-age
membership. Zogo proves the model; Greenlight proves institutions will white-label. One credit-union
contract can exceed a year of consumer subscriptions.
*Cost:* a sales motion, not a build. Slow, relationship-driven, and unglamorous for a solo builder —
but the numbers work at small scale in a way consumer freemium does not.

**2. One-time unlock — the honest consumer offer for finite content.**
A "full course" unlock at **$14.99–$19.99** matches what the catalog actually is. No churn to
manage, no renewal question to answer, far higher conversion than a subscription at the same
perceived value, and it can be sold today without pretending to depth that does not exist. Weaker
LTV, but real revenue from a small audience.

**3. Subscription — only once something genuinely recurs.**
Defensible when the daily data and an expanding lesson catalog carry it, not the finite course. Price
lower than v1: **$3.99/mo or $24.99/yr**. What renews is the market data, the review queue, and new
tracks — say so on the paywall instead of listing lessons.

**Ads** stay exactly as §6 defines them: rewarded video only, free tier only, not before ~1,000 DAU,
and **never** in or near the parent/kids material (§10.3). Not a pillar; a nudge toward paying.

### 4.3 Recommended sequence

Each phase has a gate. Do not skip a gate because the next phase is more exciting.

| Phase | Ship | Gate to leave it |
|---|---|---|
| **0 — Free, instrumented** *(now)* | No payment code. Analytics live (§9.2). Grow the catalog. | ≥40 lessons / ~2 hours of content **and** ≥40% of installers finishing lesson 1 |
| **1 — One-time unlock** | Free: lessons 1–4 + glossary + market signals. $14.99 unlocks everything. | ≥3% of active users purchasing, sustained a month |
| **2 — Subscription alongside** | $3.99/mo · $24.99/yr for data + review + new tracks. Keep the one-time unlock. | Renewal at month 2 ≥60% |
| **3 — Family & institutional** | Family plan (one purchase, several children's bands — parent-held, **no child accounts**). Begin credit-union / employer outreach. | — |

Phase 0 is where the app is now, and its first gate is **met** (44 lessons / 161 min) — the ≥40
lesson-count clause since 2026-08-09, the ~2-hour clause since 2026-08-15. What remains is the second
clause, **≥40% of installers finishing lesson 1, and it is not measurable at all**: no analytics
provider is wired (§9.2), so that rate is *unknown*, not low. **The work standing between this
project and the end of Phase 0 is therefore instrumentation, not billing code and not more lessons** —
see `AGENT_LOG.md` backlog item 18, which is blocked on an owner action (an analytics provider account
and key).

> *This paragraph read "the gate is not close: 12 minutes is not 2 hours" until 2026-08-17, while
> `LAUNCH_READINESS.md` — whose figures are generated — recorded both content clauses as met. Two
> authoritative documents gave opposite answers to the only question this section exists to answer,
> for two days. The verdict above is now generated from the catalog too (backlog item 55): if a
> lesson is deleted and the gate reopens, `npm test` fails until this sentence says so.*

### 4.4 Where the paywall sits

v1 put it after lesson 4, at peak curiosity. That still holds, with two corrections: never mid-lesson,
never in a first session, and — new — **never between a learner and their review queue.** Review is
the retention mechanic; gating it would trade the habit for a conversion, and the habit is what makes
anything else sellable later.

Apply to Apple's and Google's small-business programs (30% → 15%) the week store accounts are
approved; they are not automatic. On web, card processing is ~3%, which is why the web version is
where subscriptions should be sold whenever a store's rules permit it.

**Blocked on §2.1.** Payment rails follow the platform decision: web-only means card processing
directly, while app stores mean a cross-store layer. Wiring payments before that call is decided
means building it twice.

### 4.5 What must not be monetized

- **No advice, at any tier.** Paying cannot unlock anything that reads as personalized guidance —
  §10.1 does not have a premium exception.
- **No ads near the kids/parent material, and no child accounts, ever** (§10.3). A family plan is
  purchased and held by a parent.
- **No paywalled disclaimer or safety content.** The educational-purpose notice stays free and
  visible at every tier.
- **No selling of learner data.** There is none to sell — state is local-only (`DECISIONS.md`) — and
  that should stay a deliberate position, not an accident of not having a backend yet.

### 4.6 Falsifiable claims (§9.1)

Written now, while nothing is at stake. **These four are B1–B4 in [`CLAIMS.md`](CLAIMS.md)**, which
adds the check dates this section never gave them and is where their status is maintained:

- *"People will pay for this content at all."* — **Refuted if** under 3% of active users buy the
  one-time unlock within a month of Phase 1.
- *"The recurring parts justify a subscription."* — **Refuted if** month-2 renewal is under 60%, or
  if under 25% of subscribers open the app in a week where no new lesson shipped.
- *"Consumer-direct is the right channel."* — **Refuted if** twelve months of consumer revenue is
  under $300/month while a single institutional conversation reaches a quote. Then Path 1 becomes
  the primary business and consumer becomes the top of its funnel.
- *"The paywall is in the right place."* — **Refuted if** under 5% of users who reach it start a
  purchase within a week.

---

## 5. Distribution

The acquisition engine is content made from the app itself: a 30-second clip of the yield curve
inverting is exactly what performs on short-form video, and screen-recording the app *is* the content
pipeline. Three posts a week; every lesson yields two or three clips.

Launch moments: Product Hunt and Show HN for the web version (the interactive-animation angle is
genuinely Show-HN-worthy), then relevant subreddits — reading each one's self-promotion rules first
and leading with a useful explainer, never a download link.

ASO targets phrases people type: "learn investing", "economics for beginners", "how the economy
works", "interest rates explained". Screenshots show the diagrams and lesson flow, not the home
screen. Prompt for ratings right after a good quiz score.

Web is top-of-funnel: lessons 1–2 playable with no signup, each lesson a shareable URL.

---

## 6. Ads — a deliberately small role

Rewarded video only, free tier only, and **not until ~1,000 DAU** — below that it is coffee money
against real SDK and privacy-disclosure complexity. Premium users never see an ad, ever; it is half
the reason to pay. **Never any ad in or near the kids section** (§10.3 explains the legal reason).

Launch with zero ads. When they are added, measure whether ad-exposed users convert to Premium at a
different rate — that number decides whether they stay.

---

## 7. Workflow

Small loops: describe one change, let the AI implement, test, commit with a one-line note. Never
batch ten changes before testing — when something breaks you will not know which change did it.
Build Monday–Thursday, release to web Friday, submit store updates every two to three weeks.

When stuck — and it will usually be environment problems, not code — paste the full error and ask
for an explanation before a fix; search the exact error text; and if walled for more than two days,
buy an hour of expert help. One $50 hour beats a lost week.

Budget: ~$30–35/month steady state, plus Apple ($99/yr) and Google ($25 one-time) before store
release.

---

## 8. Roadmap

| Phase | What ships |
|---|---|
| Foundation | App authored in `src/` — screens, theme, content modules, runnable locally. *(done)* |
| Core build | First-session flow, streaks, progress persistence, polished lessons 1–4, dark mode. *(done)* |
| **Content depth** | The §4.3 Phase 0 content gate: a catalog deep enough to be a course rather than a demo. **§4.3 is the authority on whether it is met — do not restate its verdict here.** |
| Platform decision | Resolve §2.1 (Expo vs. web-first). **Gates store release and the payment route.** |
| Monetization + web | Analytics events (§9.2) *first*, then the one-time unlock (§4.3 Phase 1). No subscription until Phase 2's gate is met. Web deployed; 10 clips recorded. |
| Web launch | Product Hunt + Show HN + Reddit. Watch funnels daily. |
| Store prep | Fixes from real feedback; listings, screenshots, privacy labels; submit; apply to fee programs. |
| Store launch | Apps live. Rating prompts on. Clips continue. |
| First audit | First monthly blindspot audit (§9.3); first funnel review; decide next quarter from data. |

Weeks are deliberately unhurried. A shipped smaller app beats an unshipped complete one — scope
flexes, the launch date does not.

---

## 9. The self-refuting system

Every significant belief is written as a claim a number can prove wrong, with a date to check it.
Solo builders fail less from bad ideas than unexamined ones — nobody is around to disagree, so the
process has to.

### 9.1 Falsifiable claims

Before building anything significant, write one sentence: what you believe, the number that would
refute it, when you will check. Examples:

- "Users want guided lessons — refuted if under 40% of installers finish lesson 1 in month one."
- "The lesson-4 paywall is placed right — refuted if under 5% who hit it start a trial within a week."
- "Clips drive installs — refuted if 30 posted clips produce under 200 store visits."

When a claim is refuted, the response is a change to the product — **not a softer restatement of the
claim.** That is what makes this self-refuting rather than self-justifying.

**The live register is [`CLAIMS.md`](CLAIMS.md)** (created 2026-08-16, backlog item 30). It holds all
17 claims — §4.6's four monetization ones, the product-shape bets this build had made in code without
ever writing down, distribution, and the process claims — each with a refuting number, an ISO check
date, and an honest note on whether it is measurable at all today. `npm test` fails on a malformed row
and warns on a past-due check date; §9.3's audit question 4 reads that output.

### 9.2 Instrument before launch

Minimum events: app opened, lesson started, lesson completed (with duration), quiz taken (with
score), paywall viewed, trial started, subscribed, canceled, ad watched. If you cannot name the
event that would refute a feature, you do not yet understand the feature.

### 9.3 The monthly blindspot audit

One hour, first Saturday. Five standing questions:

1. What number did I avoid looking at this month because I feared the answer? Look now.
2. What is still in the plan only because removing it feels like wasted work?
3. What did the last three users I spoke to say? ("I haven't spoken to any" *is* the finding.)
4. Which claim is past its check date?
5. What would a skeptical friend say is obviously wrong right now?

Then update §10: retire resolved blindspots, add new ones.

### 9.4 Kill and pivot criteria, written while calm

Six months post-store-launch under 300 MAU and under $100/month despite consistent marketing → stop
building features, spend a month purely on distribution. Twelve months under $300/month → the
business case is refuted; then deliberately choose to continue as a hobby, pivot the asset (the
animation engine could serve corporate financial-literacy training), or wind down cleanly.

### 9.5 Escaping ambiguity

Feeling lost is almost always an unresolved question, not hard work. Write the question in one
sentence; if data answers it, pull the data; if users answer it, ask three; if only building answers
it, build the smallest test this week. Never sit in ambiguity longer than a week.

---

## 10. Blindspot register

### Closed

- **10.1 Financial-advice adjacency** — *closed 2026-08-02.* All per-phase "best investments / avoid"
  language reworded to historical and descriptive framing. **Standing rule:** general and historical,
  never personal. A lawyer's hour before store launch (~$200–300) remains cheap insurance.
  **Where the disclaimer renders — seven screens plus the first-launch modal:** Learn, the lesson
  reader, Practice, the Reference hub, and Reference's Market signals, Sector performance and About
  sub-screens; the modal is in `src/App.jsx`. *The Reference hub was added 2026-08-17 with the
  UIUX redesign: the tab strip it replaced always opened a sub-screen, so whether this screen carried
  the disclaimer depended on which sub-screen the strip defaulted to — and the default, Glossary,
  does not render one.* This list is enforced by `scripts/check-blindspot.mjs`, not maintained by
  hand — *the screen names it carried until 2026-08-17 were `Home` and `Markets`, deleted in the
  2026-08-04 rebuild, so for thirteen days the standing rule the per-run self-check names by number
  could not be checked as written.* Note that Sector performance renders the disclaimer string
  directly rather than through the `Disclaimer` component; a guard that greps for the component and
  not the string inherits exactly that blind spot, and one did.
- **10.2 Dalio dependency** — *closed 2026-08-01.* No name-brand framing, no direct quotes, anywhere
  in the app or its marketing. Credit belongs in an acknowledgments line, not the product.
  *(v1's own §1 violated this; corrected in v2.)*
- **10.3 Kids content / COPPA** — *closed 2026-08-01, but now under tension.* Ships as a
  **parent-facing** "teach your kids" feature: no child accounts, no ads anywhere near it.
  **Reopened as a question 2026-08-04**: the owner clarified the product spans kids to adults, which
  is not the same as an adult product with a parent guide bolted on. Going genuinely child-facing
  changes the app's COPPA classification, its store privacy category, and what it may show — it is a
  legal and business decision, **not a UI one**, and no run should make it unilaterally. Until the
  owner decides, the parent-facing framing stands and the closed-item rules above still bind.
  A middle path that needs no reclassification: keep the *reading level* accessible to an older
  child throughout while keeping accounts, data collection, and ads adult-only.
- **Markets stale data (§2.3)** — *closed 2026-08-02.* Dateless and figure-free by design.

Closed items are **regressions to guard against**, not settled history — every change near this
content should be checked against them.

### Open

- **10.4 Five languages is maintenance debt.** English is the product; the other four are beta until
  human-reviewed. Do not market in a language you cannot answer support email in.
- **10.5 Solo-founder single points of failure.** Code is on git; also export data monthly and keep
  store credentials and 2FA recovery codes in a password manager.
- **10.6 The quiet failure mode: building instead of distributing.** The likeliest failure is six
  months of pleasant feature-building with no users. After web launch, any month with zero
  distribution experiments is a red-flag finding regardless of how much code shipped. Standing rule:
  half of weekly hours go to distribution until 1,000 MAU.
- **10.7 (new) Plan/practice drift.** v1 spent months instructing runs to migrate a prototype the
  project had already outgrown, and to use JSON the project had already rejected. A plan nobody
  reconciles against reality quietly becomes wrong. Reconcile this file at each monthly audit and
  record contradictions in `DECISIONS.md`.

- **10.8 (new) Process mass exceeds product mass.** *Open, found 2026-08-17 by §9.3's first audit
  ([`reviews/2026-08-17-monthly-audit.md`](reviews/2026-08-17-monthly-audit.md) §1).* The run log
  churned 20,061 lines in eight days against 1,964 lines of application code. No individual entry is
  unjustified; the aggregate is. **Refuting number:** over any 7-day window, `AGENT_LOG.md` churn
  exceeding 5× the churn of `src/` **application code** — `src/` excluding `src/content/` and
  `src/locales/`. **Check:** 2026-09-05.
  *The audit wrote that threshold against all of `src/`, and the denominator was a transcription
  error between the finding and its tripwire — the audit's own §1 table lists application code as a row
  separate from content and locales precisely because content is the bulk of `src/` churn, and its
  headline sentence is "ten lines for every line of application code". Corrected 2026-08-20 when the
  entry moved here, with both readings measured rather than argued. Against **all of `src/`**: 1.25× in
  the audit's own window, 1.08× today — so the threshold as written would have read "not refuted" in the
  very window that produced the finding. Against **application code**: 10.2× then (the audit's own
  20,061/1,964; that window re-measures to 10.6× today because it now contains commits that landed after
  the audit did) and **7.56× now** — 22,856 log lines against 3,023 over 2026-08-13→20. The correction
  leaves this blindspot open, which is the answer the uncorrected number would have hidden.*
- **10.9 (new) The four non-English locales are held by sunk cost, not by evidence.** *Open, found
  2026-08-17.* 77% of content bytes, 0% human review, invisible to every instrument (audit §2). The
  owner's P-4 decision stands; what is missing is a date on which it gets re-argued rather than
  re-assumed. **Check:** 2026-10-03, and the check is "has anything made A3's session-share half
  measurable yet?"
- **10.10 (new) Nothing owns "get this in front of one person."** *Open, found 2026-08-17.* Item 18
  (analytics) is correctly named as the critical path in every run's output, but it is downstream of a
  deploy, and no backlog item owns the deploy (audit §3) — though item 72, filed the same day 15
  minutes after this was written, now owns the deploy half; what remains unowned is only the
  click-through, which item 72 already names as owner-only. **Refuting number:** the trivial one — one
  reachable URL, or one person who has opened the app. **Check:** 2026-09-05.

### Held — owner decisions, do not start

- **Expo vs. web-first** (§2.1) — needs a human call.

Two items previously held here — FRED live data and sector performance breakdown — were unheld
2026-08-04 by explicit owner direction and have since shipped (daily job + UI, see §2.3 and
`DECISIONS.md`). Removed from Held rather than left inconsistent with reality; see `AGENT_LOG.md`'s
2026-08-04 run log for what was built.

---

## 11. Next five moves

1. Keep the decision log current (`DECISIONS.md`) and calendar the monthly audit (§9).
2. Hold the line on §3.0 — clarity is the criterion, and it is the one most easily lost to feature work.
3. Resolve the platform decision (§2.1). It gates store release and nothing else should be blocked on it.
4. Instrument (§9.2) before launch, not after.
5. Protect the web launch date. Scope flexes; the date does not.
