// ═══════════════════════════════════════════════════════════════════════════
// LESSON → GLOSSARY TERM LINKS
//
// LAUNCH_PLAN §3.0.3: "No undefined jargon. A term either gets defined where
// it appears or links to the glossary." The app has had a glossary since the
// rebuild, but nothing in LessonReader pointed at it — a learner who hit
// "yield curve" mid-lesson had to leave the reader, switch tabs, and search
// (backlog item 28).
//
// SHAPE, and why it is this shape. `{ lessonId: { sectionIndex: [glossary
// keys] } }` — an explicit, hand-curated list, deliberately NOT a regex pass
// over prose. Lesson bodies are plain strings in five languages, and matching
// them automatically is wrong in both directions:
//
//   • Wrong sense. Money lesson 12 (renting vs. buying) contains "PMI" —
//     private mortgage insurance, not the glossary's Purchasing Managers'
//     Index. Money lesson 17 is about *lifestyle* inflation, not the
//     macroeconomic kind. Lessons 2/3/4/15 say "credit card", "credit score",
//     "credit report" — none of which is the glossary's macro sense of Credit.
//     An automatic pass links all five to a definition that does not apply.
//   • Wrong language. The five locales use different surface forms and
//     inflections, so any per-language matcher is five separate matchers with
//     five separate false-positive profiles.
//
// Keys here are language-independent glossary keys, so the chip renders the
// reader's own language straight from glossary.js and no prose is ever
// matched at runtime.
//
// It also lives in its own module rather than inside lessonContent.money.js /
// lessonContent.economy.js on purpose: the money content chunk builds to
// ~499 kB, just under Vite's 500 kB warning threshold (AGENT_LOG.md item 17's
// chunk-size caution), and this map is small enough to sit in the reader's own
// chunk instead of pushing that one over.
//
// CURATION RULES (scripts/check-data.mjs §17 enforces the mechanical ones):
//   1. Same sense only. Tag a term only where the lesson uses it the way
//      glossary.js defines it — see the exclusions above.
//   2. Not on its own lesson. Skip the lesson whose subject *is* the term: the
//      whole lesson is the definition, so §3.0.3's first branch already holds.
//      That is why Credit carries no chip on lesson 30, Productivity Growth
//      none on 31, Deleveraging none on 34, Yield Curve none on 36, QE/QT none
//      on 37, Inflation none on money 9, and why lesson 39 (Reading Economic
//      Indicators, which defines GDP/CPI/PMI/VIX/credit spreads inline as its
//      entire body) carries none at all.
//   3. Once per lesson, on first use. A term is tagged in the earliest section
//      that uses it, never repeated in later sections of the same lesson.
//   4. Literally present. The term's English name must actually appear in that
//      section's English heading or body — checked by §17, so a later content
//      edit or section reorder fails the build instead of silently leaving a
//      chip on a section that no longer mentions the term.
//
// COVERAGE, measured 2026-08-16: 21 links across 10 lessons — 9 economy, 1
// money. The lopsidedness is not an oversight and not a curation choice: it is
// that glossary.js holds 17 terms and every one of them is macroeconomic
// (GDP, CPI, QE, yield curve, deleveraging…). The money track's own jargon —
// compound interest, expense ratio, APR, deductible, beneficiary, index fund,
// vesting — is not in the glossary at all, so there is nothing for those 28
// lessons to link to. See AGENT_LOG.md item 35.
// ═══════════════════════════════════════════════════════════════════════════

export const lessonTerms = {
  // ── Money track ──────────────────────────────────────────────────────────
  // 25 "Does This Money Need to Be There Tomorrow, or in Thirty Years?" uses
  // macro inflation as the reason a savings account loses ground over decades.
  25: { 0: ["Inflation"] },

  // ── Economy track ────────────────────────────────────────────────────────
  // 29 introduces credit a full lesson before 30 teaches it.
  29: { 0: ["Credit"] },
  31: { 0: ["Credit"] },
  32: { 0: ["Inflation", "Credit"], 1: ["Deflation", "Recession"], 2: ["QE"] },
  33: { 0: ["Bubble"], 1: ["Deleveraging", "Recession", "Credit"] },
  34: { 1: ["Inflation"], 2: ["GDP", "Debt-to-GDP Ratio"] },
  35: { 2: ["Inflation"] },
  36: { 0: ["Recession"], 1: ["GDP", "Inflation"] },
  38: { 0: ["GDP", "Inflation", "Credit"] },
  40: { 1: ["Credit", "Productivity Growth"] },
};

// Terms for one section, or an empty array. Keeps LessonReader from having to
// know the map's shape.
export function termsForSection(lessonId, sectionIndex) {
  return lessonTerms[lessonId]?.[sectionIndex] ?? [];
}
