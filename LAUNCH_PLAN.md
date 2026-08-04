# Economic Cycles — Master Launch Plan (v2)

**Status:** authoritative. Supersedes `Economic_Cycles_Launch_Plan.docx` (v1, August 2026), which is
kept unchanged as the historical original.
**Last revised:** 2026-08-04.
**Product goal:** an economics/investing education app that is *easy to understand* — the clarity
standard in §3.0 is the primary success criterion, ahead of feature count.

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
| Keep the prototype's four-tab layout and visual style (§3.1) | **Navigation and visual system are designed from scratch** — three destinations, authored type and colour (§3.1, §3.1.1) | Same defect one level up: inheriting a sketch's *design* is no different from inheriting its code. The old layout duplicated the lesson list across two tabs and filed core tools under "More". |
| Lessons "based on Ray Dalio's economic-machine framework"; the app credits and quotes him (§1) | All framing is "principles popularized by economists and investors"; no name-brand dependency, no quotes | v1 contradicted its own §10.2, which flags exactly this as legal/platform risk. §10.2 is closed; the plan text now matches. |
| Content becomes `lessons.json`, `quizzes.json`, `glossary.json` (§2.2) | Content lives in `.js` modules under `src/content/` and `src/locales/` | Closed decision — see `DECISIONS.md`, "Content as `.js` modules, not JSON". `.js` imports natively, carries invariant comments, and stays diffable. |
| The Markets tab hardcodes "February 2026" and needs fixing (§2.3) | Already fixed — the tab is dateless and figure-free by design (§2.3) | Shipped 2026-08-02. §2.3 now states the standing rule instead of the defect. |
| Build on Expo (React Native) from week 1 (§2.1, §8) | **Open owner decision.** The runnable app is Vite + React (web-only) today (§2.1) | See `DECISIONS.md`, "Expo vs. Vite". Real cost either way; not an agent's call to make unilaterally. |

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

The asset is not a codebase — it is **subject-matter work**: twelve sequenced lessons, thirteen quiz
questions with explanations, seventeen glossary terms, age-banded kids material, and a market-
teaching dashboard, all in five languages. That content is the thing worth keeping, and it carries
over regardless of what the app is written in.

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
| Payments | none | RevenueCat (App Store + Play + Stripe) | Free below $2.5k/mo revenue. |
| Analytics | none | PostHog | Must land before launch, not after (§9.2). |
| Hosting | static build | Vercel / EAS Hosting | $0 at launch scale. |

### 2.2 Code structure

The application is written fresh, not migrated. Target shape:

```
src/
  App.jsx            app shell — tab routing, header, first-launch notice
  theme.js           design tokens (colour, type, spacing) — no inline hex in components
  lib/               storage + app state hooks; pure logic, no JSX
  components/        reusable pieces (ui primitives, charts)
  screens/           one file per screen; sub-screens nested
  content/           lessons, quiz, glossary, kids, markets — data only
  locales/           one file per language
```

Rules: content files contain **no JSX**; screens contain **no hardcoded copy** that should be
translatable; components read colour and type from `theme.js` rather than literal values.

### 2.3 The Markets tab — standing rule

The tab is an **explicitly educational, dateless, figure-free** teaching surface: yield-curve shapes,
what QE/QT are, how rate changes have historically related to asset classes. It shows no current
date and no live-looking market numbers.

This is not a stylistic preference — a finance app showing stale data loses credibility instantly,
which is worse than showing none. Any run tempted to add a number that *looks* current (a rate, an
index level, a "as of" date) is reintroducing the defect v1 flagged. Live data via FRED remains a
post-launch premium feature (§10 held items), not a pre-launch addition.

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
6. **Plain language over precision theatre.** Prefer the shorter word. Where a simplification is
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
- **Two levels of navigation** (bottom tabs plus a segmented sub-nav) for a twelve-lesson app is
  more chrome than content.

The structure is three destinations, each named for what a beginner would call it:

| Destination | Holds | Why it is top-level |
|---|---|---|
| **Learn** | The path: progress, then the twelve lessons in order. Opening one pushes a full-screen reader. | The spine of the product. One place to see where you are and continue. |
| **Practice** | The quiz, with explanations. | Checking understanding is a distinct intent from reading, and it is how a learner finds out what did not land. |
| **Reference** | Glossary · Market signals · For parents · About | Genuinely look-it-up material, grouped honestly rather than as "everything else". |

A lesson is a **pushed view, not a tab** — it has a back affordance and fills the screen, because
reading is the one thing that deserves undivided attention.

What carries over from the prototype is *content structure*, not layout: sequential unlocking,
per-lesson "Key Takeaway" and "Think About This", and age-banded parent material. Those are
pedagogy, and they earned their place.

### 3.1.1 Visual system

Authored, not inherited. The prototype's look — 10–13px type, saturated tinted boxes stacked on
every screen, a different accent colour per lesson, emoji standing in for interface icons — worked
against §3.0. Small dense text is the opposite of "easy to understand", and when everything is
colour-coded, nothing reads as important.

The system instead is: **16px base type** with a clear hierarchy; **one accent colour** plus
semantic success/caution/danger and a single neutral ramp; **generous whitespace** in place of
borders and tints; **line icons** for interface chrome, with emoji reserved for content where they
carry meaning. Per-lesson colour survives only as a thin accent, never as body text or a fill.

### 3.2 The first five minutes

Design the first session as the most important feature. No registration — drop the user straight
into lesson 1. Lesson 1 ends in a small win: completion animation, progress ring at 1/12, and a
one-tap "continue tomorrow" prompt. Ask for an account only when there is something worth saving.

*Status: shipped as a local-only flow (progress ring, celebration, first-open routing, streak,
continue-tomorrow prompt). The account half waits on a backend.*

### 3.3 Habit mechanics

Visible streak, progress ring, per-lesson minutes estimate, opt-in daily reminder worded as
curiosity ("Why do recessions actually start? Lesson 5 is ready") rather than nagging. Immediate,
kind quiz feedback with explanations.

### 3.4 Visual system

One accent colour per lesson/phase, one neutral background system, **dark mode** (finance audiences
skew dark — still open, §backlog). One typeface. Colour and type come from `theme.js`.

### 3.5 Accessibility and languages

English is the product; the other four languages ship marked **beta** until a native speaker reviews
each. Support dynamic font sizes and screen-reader labels on every interactive element — app stores
increasingly check this and it widens the audience at near-zero cost.

---

## 4. Pricing

Unchanged from v1 — the reasoning survived review.

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | Lessons 1–4, basic quiz, glossary, Markets tab. Good enough to recommend. |
| Premium monthly | $6.99/mo, 7-day trial | All lessons, all quizzes with explanations, kids section, offline, no ads. |
| Premium yearly | $39.99/yr | Same. Priced so yearly is the obvious choice — most revenue should land here. |
| Founding lifetime | $79.99, first 500 | Everything forever + founder badge. Early cash, invested users. |

Paywall sits at the end of lesson 4, where the story reaches long-term debt cycles — maximum
curiosity. Never mid-lesson, never during a first session. Apply to Apple's and Google's
small-business fee programs (30% → 15%) the week store accounts are approved; they are not automatic.

Expect 1–5% free-to-paid conversion. At 2%, ~5,000 MAU ≈ 100 subscribers ≈ ~$350/month. A slope, not
a spike. Change nothing for 90 days after launch — experiments below ~2,000 users produce noise.

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
| Core build | First-session flow, streaks, progress persistence, polished lessons 1–4, dark mode. *(largely done; dark mode open)* |
| Platform decision | Resolve §2.1 (Expo vs. web-first). **Gates store release.** |
| Monetization + web | RevenueCat, paywall, tiers; analytics events (§9.2); web deployed; 10 clips recorded. |
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

### 9.2 Instrument before launch

Minimum events: app opened, lesson started, lesson completed (with duration), quiz taken (with
score), paywall viewed, trial started, subscribed, cancelled, ad watched. If you cannot name the
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
  language reworded to historical and descriptive framing; disclaimer renders on Home, Learn, Markets
  and About plus a first-launch notice. **Standing rule:** general and historical, never personal.
  A lawyer's hour before store launch (~$200–300) remains cheap insurance.
- **10.2 Dalio dependency** — *closed 2026-08-01.* No name-brand framing, no direct quotes, anywhere
  in the app or its marketing. Credit belongs in an acknowledgments line, not the product.
  *(v1's own §1 violated this; corrected in v2.)*
- **10.3 Kids content / COPPA** — *closed 2026-08-01.* Ships as a **parent-facing** "teach your kids"
  feature: no child accounts, no ads anywhere near it. A dedicated kids mode only if data shows real
  demand.
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

### Held — owner decisions, do not start

- **Expo vs. web-first** (§2.1) — needs a human call.
- **FRED live data** for Markets — post-launch premium feature.
- **Sector performance breakdown** — same reasoning; needs a live data source, would reintroduce the
  §2.3 staleness risk pre-launch.

---

## 11. Next five moves

1. Keep the decision log current (`DECISIONS.md`) and calendar the monthly audit (§9).
2. Hold the line on §3.0 — clarity is the criterion, and it is the one most easily lost to feature work.
3. Resolve the platform decision (§2.1). It gates store release and nothing else should be blocked on it.
4. Instrument (§9.2) before launch, not after.
5. Protect the web launch date. Scope flexes; the date does not.
