// ═══════════════════════════════════════════════════════════════════════════
// RELATIVE STRENGTH
//
// ⚠️ THE IMPLEMENTATION BELOW IS A PLACEHOLDER, NOT THE PRODUCT'S CALCULATION.
//
// A proprietary relative-strength formula will replace `baselineStrategy`
// later (owner-stated 2026-08-04; see DECISIONS.md). Everything downstream is
// written against the *strategy interface*, never against this arithmetic, so
// that swap is one file.
//
// Rules for anyone touching this or its callers:
//   • Do not describe the placeholder as the app's relative-strength measure —
//     not in the UI, not in a commit message, not in a run log.
//   • Do not assume the output's range, sign convention, or scale. A future
//     formula may be a ratio, a z-score, a 0-100 rank, or something else.
//     Treat the value as opaque and rank-comparable within a single snapshot
//     only — not comparable across days.
//   • Do not move this maths into a component. The UI renders whatever the
//     strategy returns and knows nothing about how it was produced.
//
// A strategy has the shape:
//   (series: number[], benchmark: number[], opts) => { value, label }
// where `series` and `benchmark` are closes, oldest first.
// ═══════════════════════════════════════════════════════════════════════════

// Percentage change across the whole window, as a decimal.
function totalReturn(closes) {
  if (!Array.isArray(closes) || closes.length < 2) return null;
  const first = closes[0];
  const last = closes[closes.length - 1];
  if (!first || !last) return null;
  return (last - first) / first;
}

// ── placeholder ───────────────────────────────────────────────────────────
// Simple excess return over the benchmark across the window. Chosen because it
// is obvious and easy to sanity-check by hand — NOT because it is a good
// measure. It has no volatility adjustment, no smoothing, and no trend term.
export function baselineStrategy(series, benchmark) {
  const assetReturn = totalReturn(series);
  const benchReturn = totalReturn(benchmark);
  if (assetReturn === null || benchReturn === null) return null;
  return {
    value: assetReturn - benchReturn,
    // Marks provenance in the payload itself, so a stale `market.json` built
    // with the placeholder can be told apart from one built with the real
    // formula without reading the job's source.
    method: "baseline-excess-return",
  };
}

// The strategy the job currently uses. Swapping this is the whole migration.
export const activeStrategy = baselineStrategy;

// Computes relative strength for every symbol against one benchmark, then
// ranks them. Ranking is done here rather than in the UI because rank depends
// on the strategy's ordering convention, which only the strategy knows.
export function computeRelativeStrength(seriesBySymbol, benchmarkCloses, strategy = activeStrategy) {
  const scored = Object.entries(seriesBySymbol)
    .map(([symbol, closes]) => {
      const result = strategy(closes, benchmarkCloses);
      return result === null ? null : { symbol, ...result };
    })
    .filter(Boolean);

  // Higher is stronger. If a future strategy inverts that, it must also update
  // this comparator — hence the explicit note rather than a silent assumption.
  scored.sort((a, b) => b.value - a.value);

  return scored.map((entry, i) => ({ ...entry, rank: i + 1, of: scored.length }));
}
