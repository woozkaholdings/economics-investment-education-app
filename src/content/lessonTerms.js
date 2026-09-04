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
//   • Wrong sense. Essentials lesson 12 (renting vs. buying) contains "PMI" —
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
//      on 37, Inflation none on money 9, Stock/Bond none on money 5, and why
//      lesson 39 (Reading Economic Indicators, which defines GDP/CPI/PMI/VIX/
//      credit spreads inline as its entire body) carries none at all.
//   3. Once per lesson, on first use. A term is tagged in the earliest section
//      that uses it, never repeated in later sections of the same lesson.
//   4. Literally present. The term's English name must actually appear in that
//      section's English heading or body — checked by §17, so a later content
//      edit or section reorder fails the build instead of silently leaving a
//      chip on a section that no longer mentions the term.
//   5. The closing pair counts as a place. `TAIL` below is a section key like
//      any other, standing for the takeaway + reflection prompt that close
//      every lesson. Rules 1-4 apply to it unchanged; rule 3 orders it last,
//      which it is, because non-numeric keys iterate after numeric ones.
//
// WHY `TAIL` EXISTS, and it is a measured gap rather than a symmetry.
// Chips rendered under sections only, and §17b's coverage sweep read sections
// only, so the two agreed with each other and were blind together: a glossary
// term whose ONLY use in a lesson is in the boxed Key Takeaway or the
// reflection prompt had no chip, no entry in `deliberatelyUnlinked`, and no
// failure — §17b printed "0 unexplained" without ever looking. Measured
// 2026-09-01: 48 glossary-term uses live in those two fields across the 44
// lessons, 39 of them already chipped from a section, and **9 were visible to
// no instrument at all** — GDP and Debt-to-GDP Ratio on 33, Deflation and
// Credit on 34, QE on 35, Interest Rate on 38 and on 9, Emergency Fund on 8,
// Stock on 11. Those nine are the `TAIL` entries below.
// None of the nine qualified for `deliberatelyUnlinked`: its two legitimate
// reasons are "defined-here" and "other-sense", and each of the nine is the
// glossary's own sense, used without definition. A learner met "debt-to-GDP
// ratio" in a reflection prompt with nothing to tap. So the fix had to be the
// chip, not an exemption — which is why this key is a render surface in
// LessonReader and not just a wider net in check-data.
//
// COVERAGE is not stated here on purpose. `scripts/check-data.mjs` §17b
// computes and prints it — chips, lessons covered, deliberate exclusions,
// glossary-term uses swept, unexplained — on every `npm test` run. Read it
// there.
//
// This paragraph used to carry those four numbers, and they went stale twice in
// two days: the first figure ("21 links across 10 lessons") was written earlier
// the same day as the item-35 expansion listed below it, so it was wrong on
// arrival; its replacement ("44 chips ... 77 uses ... 33 deliberate") lasted
// until item 60 added one chip and one exclusion. Both were written directly
// above the sentence telling the reader that §17b generates them. A figure an
// argument does not need is cheapest to delete, not to correct again.
//
// The personal-finance lessons were uncoverable before item 35 for a real
// reason worth keeping: glossary.js held 17 entries and every one was
// macroeconomic, so §3.0.3's "or links to the glossary" branch had nothing to
// point at on the 28 lessons §0 called the product at the time. See
// AGENT_LOG.md item 35.
// ═══════════════════════════════════════════════════════════════════════════

// The section key for a lesson's closing pair (takeaway + reflection prompt).
// A string rather than an index so it can never collide with a real section,
// and so `lessonTerms[id]` still iterates sections in order with the closing
// pair last (JS orders integer-like keys first).
export const TAIL = "tail";

export const lessonTerms = {
  // ── Personal finance (essentials 1-15 + money 16-28) ─────────────────────
  // Labeled "Money track" until 2026-08-20; of the 14 lessons in this block,
  // 9 are `essentials` and 5 are `money` since the 2026-08-19 split (5633b79)
  // re-tracked ids 1-15 without renumbering them.
  // Expanded 2026-08-16 (item 35) once the glossary gained these terms.
  // Each link was computed by matching the term against the section's English
  // text with word boundaries and an optional plural, then filtered by the
  // curation rules above — notably rule 2, which is why 401(k)/IRA carry no
  // chip on lesson 6, Emergency Fund none on 2, Diversification none on 5, and
  // Compound Interest none on 3. Two of the twelve new terms (Expense Ratio,
  // Deductible) are glossary-only: the single lesson each appears in is the
  // lesson that defines it, so a chip there would be redundant.
  // Stock/Bond chips (item 64, 2026-08-17) sit on every same-sense use outside
  // lesson 5, INCLUDING the money lessons after 5 that a sequential reader has
  // already been taught. The alternative — a "defined-earlier" exclusion —
  // would grant cover from unlock order, and unlock order is exactly what does
  // not hold here: the two tracks unlock independently, so lesson 5 is not
  // behind an economy-track reader at all. See AGENT_LOG.md item 64.
  2: { 0: ["Interest Rate"], 1: ["Stock", "Savings Account"], 2: ["Premium"] },
  // 3 §2 says returns compound only if dividends and gains stay invested;
  // it uses the word twice and defines it neither time (item 64).
  3: { 1: ["Interest Rate"], 2: ["Index Fund", "Stock", "Dividend", "Savings Account"] },
  // 6 §0 contrasts "an ordinary brokerage account" with a workplace 401(k)
  // seven lessons before 13 defines what a brokerage account is — the
  // forward-reference shape item 60 found, and the reason Brokerage Account
  // became a glossary entry rather than being left to lesson 13.
  6: { 0: ["Vesting", "Brokerage Account", "Stock", "Bond", "Dividend"] },
  7: { 1: ["401(k)", "IRA"] },
  // 9's reflection prompt is the lesson's only use of the retail sense the
  // glossary entry explicitly covers ("from mortgages to savings balances").
  9: { 0: ["Purchasing Power", "Savings Account"], [TAIL]: ["Interest Rate"] },
  // 11 says "stock" in its body only inside the cross-reference “Stocks, Bonds
  // & Diversification”, which item 84's rule strips — so "stock-picking skill"
  // in the reflection prompt is the lesson's first real use of the term.
  11: { 0: ["Diversification", "Index Fund"], [TAIL]: ["Stock"] },
  12: { 1: ["Principal", "Interest Rate"] },
  13: { 0: ["401(k)", "IRA", "Stock", "Bond", "Savings Account"], 1: ["Diversification"] },
  14: { 1: ["401(k)", "IRA"] },
  // 8 (Insurance) never says "emergency fund" in its body; the reflection
  // prompt contrasts the two ideas, which is where the term arrives.
  8: { [TAIL]: ["Emergency Fund"] },
  17: { 1: ["Emergency Fund"] },
  16: { 0: ["Savings Account"] },
  18: { 0: ["Compound Interest"] },
  // 25 "Does This Money Need to Be There Tomorrow, or in Thirty Years?" uses
  // macro inflation as the reason a savings account loses ground over decades.
  25: { 0: ["Inflation", "Stock", "Bond", "Interest Rate", "Savings Account"], 1: ["Emergency Fund", "Purchasing Power"] },
  26: { 1: ["Emergency Fund"] },
  28: { 0: ["Stock"] },
  // 42/43/44 (the four-ways-money-arrives arc) each mention Ben's dividend;
  // chipped at its first mention in each lesson.
  //
  // The four income terms (added to glossary.js 2026-08-30) follow rule 2 and
  // rule 4 together, and the two rules land them in different places. Lesson 42
  // §0 defines all four in its own prose, so all four are excluded there rather
  // than chipped — that lesson IS the definition. 43 and 44 then use them as
  // settled vocabulary and define none of them, so each is chipped at its first
  // use in that lesson. Which terms appear where is not symmetric and rule 4
  // decides it, not the arc's shape: 43's English never says "passive income"
  // (it says "rent and royalties are loosely coupled"), and 44's never says
  // "business income" or "investment income". Chipping by theme rather than by
  // literal presence would have put two dead chips on 44, which §17 fails on.
  42: { 0: ["Dividend"] },
  43: { 0: ["Dividend", "Labor Income", "Business Income", "Investment Income"], 1: ["Emergency Fund"] },
  44: { 0: ["Dividend", "Passive Income", "Labor Income"] },

  // ── Economy track ────────────────────────────────────────────────────────
  // 29 introduces credit a full lesson before 30 teaches it.
  29: { 0: ["Credit"], 1: ["Stock", "Interest Rate"] },
  // 30 §1 names the monetary base only to say credit dwarfs it, so the chip is
  // the only place a reader learns what it is (rule 2 leaves Credit itself
  // unchipped here — this lesson IS its definition).
  30: { 0: ["Interest Rate"], 1: ["M0"] },
  31: { 0: ["Credit"] },
  32: { 0: ["Inflation", "Credit", "Interest Rate"], 1: ["Deflation", "Recession"], 2: ["QE", "Bond"] },
  // 33 teaches the long-term debt cycle without ever writing "GDP" in its
  // body; the reflection prompt then opens on "the US debt-to-GDP ratio".
  33: { 0: ["Bubble", "Stock"], 1: ["Deleveraging", "Recession", "Credit", "Interest Rate"], [TAIL]: ["GDP", "Debt-to-GDP Ratio"] },
  // 34's body says "deflationary tools" (an adjective §17's matcher rightly
  // will not accept for the noun) and never says "credit" at all — both
  // arrive as nouns in the closing pair, which is what the takeaway balances.
  34: { 0: ["Bond"], 1: ["Inflation"], 2: ["GDP", "Debt-to-GDP Ratio"], [TAIL]: ["Deflation", "Credit"] },
  // 35's takeaway is where QE is named — "that's where QE comes in", a
  // forward pointer to lesson 37 two lessons before it unlocks. The chip is
  // the item-60 shape: a reader meets the term before the lesson that owns it.
  35: { 0: ["Savings Account"], 1: ["Stock", "Bond"], 2: ["Inflation"], [TAIL]: ["QE"] },
  // 36 §1 "weighing it alongside employment, inflation, and credit data" is the
  // macro sense, and was the one unaccounted-for GLOSSARY-TERM use in all 40
  // lessons when item 57 swept them. Not "the only jargon gap": §17b can only
  // see the keys in glossary.js, so a jargon word with no glossary entry is
  // invisible to it. That residual is a real limit, not a closed one — run
  // `npm run jargon` to see the candidates it cannot; item 60 used it to find
  // one (Brokerage Account, chipped on lesson 6 above).
  36: { 0: ["Recession", "Bond", "Interest Rate"], 1: ["GDP", "Inflation", "Credit"] },
  37: { 0: ["Stock", "Bond", "Interest Rate"] },
  // 38's body names interest rates only inside the cross-reference
  // “Interest Rates” (stripped by item 84's rule); the takeaway uses the term
  // plainly — "how interest rates move through the economy".
  // Split across sections 0 and 1 when 38's two "&"-joined sections became the
  // lesson's own four phases (§3.0.1): rule 3 puts each term on its earliest
  // section, and Inflation and Bond are first used under "Peak", not "Expansion".
  38: { 0: ["GDP", "Credit", "Stock"], 1: ["Inflation", "Bond"], [TAIL]: ["Interest Rate"] },
  // 39 defines its eight indicators inline and carries no chip for any of them
  // (see deliberatelyUnlinked below) — but it does not define "stock", which is
  // why the one term it does chip is the one it merely uses in passing.
  39: { 0: ["Stock"] },
  40: { 1: ["Credit", "Productivity Growth"] },
};

// Terms for one section, or an empty array. Keeps LessonReader from having to
// know the map's shape. `sectionIndex` is a section's index or `TAIL`.
export function termsForSection(lessonId, sectionIndex) {
  return lessonTerms[lessonId]?.[sectionIndex] ?? [];
}

// ═══════════════════════════════════════════════════════════════════════════
// DELIBERATELY UNLINKED — the other half of §3.0.3, written down
//
// A glossary term can appear in a lesson's English prose and correctly carry
// no chip, for exactly two reasons: the lesson defines it right there (§3.0.3's
// FIRST branch — curation rule 2), or the prose means something else by the
// word (curation rule 1). Both were documented in the header above as prose,
// which turned out not to be enough: backlog item 57 was filed against this
// file claiming "7 lessons use a glossary term with no link, 11 occurrences",
// and every one of those 11 was an exclusion the header names by lesson id.
// A prose rule cannot be subtracted from a grep, so the grep kept winning.
//
// This table is that subtraction, as data. `scripts/check-data.mjs` §17b now
// requires every glossary-term use in every lesson to be EITHER linked in
// `lessonTerms` above OR listed here with a reason — so an unaccounted-for
// term fails the build, and a re-measurement of "unlinked terms" returns the
// one number that means anything: how many are unexplained. That number is 0.
//
// Shape: `{ lessonId: { glossaryKey: "defined-here" | "other-sense: …" } }`.
// Per lesson, not per section — rule 3 makes chips a per-lesson decision, and
// pinning a section number here would rot on every content reorder for no
// gain. §17b does check the term is still SOMEWHERE in the lesson's English
// text, so an exclusion cannot outlive the prose it was written for.
//
// "other-sense" entries are the judgment calls and each says what the prose
// actually means. They are the reason this file is hand-curated at all: an
// automatic matcher links every one of them to a definition that does not
// apply, which is worse for a learner than no chip.
// ═══════════════════════════════════════════════════════════════════════════

export const deliberatelyUnlinked = {
  // ── Personal finance (essentials 1-15 + money 16-28) ─────────────────────
  // Same relabel as above (2026-08-20): 11 of the 12 lessons in this block are
  // `essentials` today, 1 is `money`.
  2: {
    "Emergency Fund": "defined-here",
    Credit: "other-sense: a credit card, not credit as a macro aggregate",
  },
  3: {
    "Compound Interest": "defined-here",
    Credit: "other-sense: credit-card debt as the mirror of compounding",
  },
  4: { Credit: "other-sense: a credit score, not credit as a macro aggregate" },
  5: {
    Diversification: "defined-here",
    // Rule 2, and the reason Stock/Bond became glossary entries at all: this
    // lesson IS their definition ("sells small ownership slices to raise money
    // — that's a stock", "A bond is closer to a loan"), and until item 64 it
    // was the only place in 40 lessons that defined either word.
    Stock: "defined-here",
    Bond: "defined-here",
  },
  6: { "401(k)": "defined-here", IRA: "defined-here" },
  8: {
    // Both are defined in so many words: "a relatively small amount — the
    // premium", "the deductible is the amount the policyholder pays out of
    // pocket". Premium is chipped on lesson 2, which uses it without defining.
    Premium: "defined-here",
    Deductible: "defined-here",
  },
  9: { Inflation: "defined-here" },
  11: { "Expense Ratio": "defined-here" },
  12: {
    PMI: "other-sense: private mortgage insurance, not Purchasing Managers' Index",
    Credit: "other-sense: 'an unsecured loan like a credit card'",
  },
  13: {
    // Rule 2: the lesson's own first sentence is the definition ("a brokerage
    // account is just a container — a place to hold investments, not an
    // investment itself"), so §3.0.3's first branch holds. The chip lives on
    // lesson 6, which uses the term seven lessons earlier without defining it.
    "Brokerage Account": "defined-here",
  },
  15: { Credit: "other-sense: credit reports and scores, not the macro aggregate" },
  17: { Inflation: "other-sense: lifestyle inflation, not the macroeconomic kind" },
  41: { Credit: "other-sense: credit reporting rules, not credit as a macro aggregate" },
  42: {
    // Rule 2, four times over. Lesson 42 §0 is one paragraph that defines all
    // four in a row ("Labor income is money paid for your time and skill … "),
    // which is the lesson's entire subject — the chips would point a reader at
    // a definition three lines below the one they are already reading. The
    // chips are on 43 and 44, which reuse the vocabulary without restating it.
    "Labor Income": "defined-here",
    "Business Income": "defined-here",
    "Investment Income": "defined-here",
    "Passive Income": "defined-here",
  },

  // ── Economy track ────────────────────────────────────────────────────────
  30: { Credit: "defined-here" },
  31: { "Productivity Growth": "defined-here" },
  34: { Deleveraging: "defined-here" },
  35: {
    "Fed Funds Rate": "defined-here",
    Credit: "other-sense: 'the annual rate — the APR — on your credit card'",
  },
  36: {
    "Yield Curve": "defined-here",
    // §2 teaches the *term* premium — unrelated to an insurance premium, and
    // the one wrong-sense case the header's original rule-1 list missed.
    Premium: "other-sense: the term premium on long bonds, not an insurance premium",
  },
  37: { QE: "defined-here", QT: "defined-here" },
  // 39 (Reading Economic Indicators) defines all eight inline as its entire
  // body — the largest single block of rule 2, and the bulk of item 57's count.
  39: {
    GDP: "defined-here",
    CPI: "defined-here",
    PMI: "defined-here",
    VIX: "defined-here",
    "Credit Spread": "defined-here",
    Inflation: "defined-here",
    Recession: "defined-here",
    Credit: "defined-here",
  },
};
