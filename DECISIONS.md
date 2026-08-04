# Decisions

A short log of the technical/product choices behind this codebase — what was decided, why, and
whether it's still open. `AGENT_LOG.md` records *what was done and when*; this file records *why*,
so a later run (or the project owner) doesn't have to re-derive the reasoning from git history.
Add a new entry when a run makes a choice future work should be able to look up instead of re-litigate.

## Open

### Expo (React Native) vs. Vite (web-only)

- **Status:** open — owner decision needed. See `AGENT_LOG.md` backlog item 12 (HELD).
- **What was decided:** the 2026-08-01 scaffolding run built the runnable prototype on
  **Vite + React, web-only**.
- **What the launch plan asks for:** §2.2/§8 specify **Expo (React Native)** from week 1, so
  web/iOS/Android share one codebase and the web release (weeks 1–8) is not thrown away when
  app-store builds start (weeks ~9–14).
- **Why Vite anyway:** at scaffolding time the goal was "make the existing prototype buildable and
  runnable at all" with minimal risk to `economic-cycles-v5.jsx`'s content. Vite is a smaller, faster
  loop for that first step than standing up Expo tooling cold.
- **Cost of staying on Vite:** every web-only UI change since then (the four-way `App` split, the
  first-session flow, translation cleanup) raises the eventual Expo port cost, since none of it is
  React Native-aware (DOM-only styling, `localStorage` instead of an RN-compatible storage API, etc).
- **Why still open:** this is a stack choice with real cost either way, not a small technical toggle —
  the dev agent is instructed not to migrate to Expo on its own initiative and not to deepen the
  web-only investment beyond already-curated P2 items. Needs the project owner's call.
- **Revisit when:** before starting any large new web-only UI feature, or whenever the owner is ready
  to schedule the Expo migration.

## Closed

### Content as `.js` modules, not JSON

- **Status:** closed, in effect since the 2026-08-02 JSX-split (steps 1–3).
- **What was decided:** `lessons`, `quizData`, `glossary`, `kidsContent`, and the five per-language
  translation dictionaries (`src/locales/*.js`, `src/content/*.js`) are plain ES module exports
  (`export const lessons = [...]`), not `.json` files.
- **Why:** the content is consumed only by the Vite/React build, which imports `.js` natively with no
  extra loader — `.json` would need either an `import ... assert { type: "json" }` (inconsistent
  bundler/browser support at the time) or a fetch-at-runtime step, either of which is more moving parts
  for content that never changes at runtime. `.js` modules can also carry a header comment (see
  `src/content/quizData.js`'s answer-key-distribution invariant) that JSON cannot, and every value is
  still a plain literal that's trivially diffable in review.
- **Trade-off accepted:** content authors need to write valid JS object/array literals instead of
  strict JSON — no external tooling (e.g. a translation-management platform) can read/write these
  files directly without a small transform. Acceptable while content changes go through git review by
  the same person/agent who can write JS.
- **Revisit when:** if a non-technical content editor or third-party localization tool needs to edit
  these files directly without going through this codebase.

### localStorage-only progress and personalization state

- **Status:** closed as the *current* approach; known gap flagged below.
- **What was decided:** every piece of per-user state added so far — the disclaimer-seen flag
  (`ecycles_seen_disclaimer`), the streak counter (`ecycles_streak`), the continue-tomorrow
  opt-in (`ecycles_continue_pref`), `completedLessons` itself (`ecycles_completed_lessons`,
  added 2026-08-04), and the text-size preference (`ecycles_font_scale`, added 2026-08-04) — is
  stored client-side in `localStorage`, keyed by a fixed string, with no backend, no account
  system, and no sync across devices.
- **Why:** the launch plan's own stack (Supabase-backed accounts) doesn't land until later in the
  roadmap, and none of these features need cross-device sync to be useful — they're single-device
  "did you do something today" signals. Building them against `localStorage` now means zero backend
  dependency and each one degrades safely (wrapped in `try`/`catch`, since `localStorage` throws in
  private-browsing contexts) rather than blocking the feature.
- **Gap closed 2026-08-04:** `App`'s core `completedLessons` state now follows the same pattern —
  lazy-initialized from `localStorage` on mount (`loadCompletedLessons`, falls back to `[]` if unset,
  unparseable, or not an array) and written back on every `markLessonComplete` call
  (`saveCompletedLessons`), both wrapped in `try`/`catch` like every other key here. No component
  changes were needed: `Home`, `Learn`, and the header progress bar all just read the
  `completedLessons`/`isLessonUnlocked` props `App` already passed them, so a persisted value flows
  through unchanged. Verified in the browser (static build + local server): completed lesson 1,
  reloaded, Home still showed "1/12" and lesson 2 remained unlocked.
- **Revisit when:** the app gains real accounts (Supabase), at which point this whole section should
  be superseded by a sync strategy (local-first with server sync, vs. server-authoritative).
