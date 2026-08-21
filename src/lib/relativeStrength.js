// ═══════════════════════════════════════════════════════════════════════════
// RELATIVE STRENGTH
//
// Implements the owner's own measure (`WJ_Sector_Comparison`, supplied
// 2026-08-04 as a thinkScript study for daily candles). This replaced an
// explicitly-labeled placeholder; see DECISIONS.md.
//
// THE MEASURE
//   For each of three lookbacks — 10, 30 and 60 daily bars — take the asset's
//   return over that window minus the benchmark's return over the same window.
//   Sum the three excess returns. That sum is the score.
//
//     excess(p) = (close/close[p] - 1) − (spy/spy[p] − 1)
//     score     = excess(10) + excess(30) + excess(60)
//
//   The study plots `round(score * 100, 1)` — percentage points, one decimal —
//   and shades the background when the raw (decimal) sum clears
//   `Outperform_Percent_1`, default 0.5.
//
//   Combining three lookbacks is what makes it a *strength* measure rather
//   than a return: a sector only scores well by leading the benchmark across
//   short, medium and longer horizons at once, so a single sharp week cannot
//   carry it.
//
// The strategy interface is unchanged, so the job and the UI did not need to
// know this landed:
//   (series: number[], benchmark: number[], opts) => { value, method, ... }
// with closes oldest-first.
// ═══════════════════════════════════════════════════════════════════════════

// Lookbacks in daily bars, matching the study's `period` / `period2` / `period3`.
export const WJ_PERIODS = [10, 30, 60];

// The study's `Outperform_Percent_1`. Compared against the RAW decimal sum,
// not the ×100 plotted value — keep that distinction when tuning it.
export const OUTPERFORM_THRESHOLD = 0.5;

// Longest lookback plus the current bar: the minimum history the measure needs.
export const MIN_BARS = Math.max(...WJ_PERIODS) + 1;

// Return over `period` bars, measured from the most recent close.
// `closes[len - 1]` is today; `closes[len - 1 - period]` is the reference bar.
function periodReturn(closes, period) {
  if (!Array.isArray(closes) || closes.length < period + 1) return null;
  const last = closes[closes.length - 1];
  const prior = closes[closes.length - 1 - period];
  if (!Number.isFinite(last) || !Number.isFinite(prior) || prior === 0) return null;
  return (last - prior) / prior;
}

// ── the measure ───────────────────────────────────────────────────────────
export function wjSectorComparison(series, benchmark, opts = {}) {
  const periods = opts.periods ?? WJ_PERIODS;
  const threshold = opts.outperformThreshold ?? OUTPERFORM_THRESHOLD;

  // Lookbacks are positional, so the two series must cover the same trading
  // days. They do when both come from one provider call, which is how the job
  // fetches them; a length mismatch means a gap or a late listing, and a
  // silently misaligned comparison would be worse than no number.
  if (!Array.isArray(series) || !Array.isArray(benchmark)) return null;
  if (series.length !== benchmark.length) return null;

  let sum = 0;
  const parts = {};
  for (const period of periods) {
    const assetReturn = periodReturn(series, period);
    const benchReturn = periodReturn(benchmark, period);
    if (assetReturn === null || benchReturn === null) return null;
    const excess = assetReturn - benchReturn;
    parts[`d${period}`] = excess;
    sum += excess;
  }

  return {
    // Percentage points to one decimal — the study's plotted value.
    value: Math.round(sum * 1000) / 10,
    // Raw decimal sum, which is what the threshold is expressed against.
    raw: sum,
    // Per-lookback excess, so a future UI can show *why* a sector ranks where
    // it does rather than only the total.
    parts,
    outperforming: sum >= threshold,
    method: "wj-sector-comparison",
  };
}

// The strategy the job uses. Swapping this is the whole migration path.
export const activeStrategy = wjSectorComparison;

// Computes relative strength for every symbol against one benchmark, then
// ranks them. Ranking lives here rather than in the UI because rank depends on
// the measure's ordering convention, which only the measure knows.
export function computeRelativeStrength(seriesBySymbol, benchmarkCloses, strategy = activeStrategy) {
  const scored = Object.entries(seriesBySymbol)
    .map(([symbol, closes]) => {
      const result = strategy(closes, benchmarkCloses);
      return result === null ? null : { symbol, ...result };
    })
    .filter(Boolean);

  // Higher is stronger. A measure that inverts that must update this
  // comparator too — stated explicitly rather than left as an assumption.
  scored.sort((a, b) => b.value - a.value);

  return scored.map((entry, i) => ({ ...entry, rank: i + 1, of: scored.length }));
}
