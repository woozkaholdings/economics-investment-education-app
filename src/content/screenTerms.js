// ═══════════════════════════════════════════════════════════════════════════
// SCREEN → GLOSSARY TERM LINKS (outside the lessons)
//
// The Reference screens' "Terms in this section" rows: the Market Dashboard
// (6408ce4), Sector performance (4f250bb) and the parent guide (fc22872).
// Same rule as `lessonTerms.js`: hand-picked glossary keys for terms a screen
// uses without defining, never a match over prose. Why each key is here, and
// what was measured to choose it, is in the header of the screen that renders
// it.
//
// Moved out of the three screens 2026-10-31 so `check-data.mjs` §17c can read
// them. Inline in JSX they were unchecked: `GlossaryTerms` drops a key that
// glossary.js lacks without a word, and a parent-guide "Deleverage" (for
// "Deleveraging") passed `check-data` with 0 FAIL that day while the 13-17
// band lost its chip. A renamed glossary key fails §17 on `lessonTerms.js`
// and nowhere else, so whoever renamed it had no reason to look here.
// ═══════════════════════════════════════════════════════════════════════════

// MarketSignals.jsx: section → the glossary keys it uses first. Each term is
// chipped once on the screen, in the first section that uses it.
export const marketSignalsTerms = {
  opening: ["GDP", "Inflation"],
  rateEffects: ["Interest Rate", "Stock", "Bond", "Growth Stock"],
  yieldCurve: ["Yield Curve"],
  qeQt: ["QE", "QT"],
  principles: ["Recession"],
};

// Sectors.jsx: economicSignals key → the glossary keys its `what` line uses
// without defining. A signal missing from market.json takes its chips with it.
export const sectorSignalTerms = {
  curveSpread: ["Yield Curve", "Recession"],
  cpiIndex: ["Inflation"],
};

// ParentGuide.jsx: kidsContent age band → the glossary keys its cards use
// without defining.
export const parentGuideBandTerms = {
  "5-8": [],
  "9-12": ["Recession"],
  "13-17": ["Inflation", "Recession", "Interest Rate", "Bubble", "Deleveraging", "Bond", "Stock", "Savings Account"],
};
