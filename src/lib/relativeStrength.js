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
//   and shades ITS OWN chart background when the raw (decimal) sum clears
//   `Outperform_Percent_1`, default 0.5. That shading belongs to the study;
//   this app renders nothing from it — see the note on `outperforming` below.
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
// not the ×100 plotted value — keep that distinction when tuning it. The same
// reading is recorded in DECISIONS.md and is the closed decision here.
//
// ⚠️ THE ×100 DISTINCTION INVITES A UNITS HYPOTHESIS, AND THE HYPOTHESIS IS
// WRONG. Written down because refuting it consumed most of a run: a field named
// `..._Percent_1` sitting next to a payload that declares
// `unit: "percentage-points"` reads like a 100x mismatch, and it is not one.
// Measured 2026-09-09 by replaying every `public/data/market.json` ever
// committed (23 distinct `asOf` dates, 2026-08-04 → 2026-09-08):
//   - Pooled, 2 of 264 sector observations clear 0.5, so the flag looks live.
//   - Split by `source` — the control that decides it — BOTH of those 2 are
//     `source: "fixture"`, i.e. synthetic placeholder rows. Across the 242 real
//     (`tiingo`) observations the largest score is 35.9 pp (raw 0.359): 72% of
//     the threshold, and ZERO clear it.
// So 0.5-as-raw is strict but not absurd — it marks outperformance real data has
// approached and not yet reached. The alternative reading, 0.5 percentage
// points, would flag 8 of 11 sectors on an ordinary day, which is not a
// highlight. Do not "re-unit" this constant: the only source of truth for the
// study's intent is the owner's thinkScript, which is not in this repo.
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
    // ⚠️ NO CONSUMER, measured rather than assumed (2026-09-09): `outperforming`
    // and `OUTPERFORM_THRESHOLD` both grep to 0 under `src/` outside this file,
    // while the sibling fields of the same published block — `provisional`,
    // `rank`, `method`, `unit`, `periods` — return 4 to 55, so the grep plainly
    // reaches these files. The job drops this flag and `parts` at serialization;
    // `market.json` publishes the THRESHOLD as metadata and no flag at all. Both
    // are kept because the "why does it rank there" UI they exist for is the
    // owner's to build — not because anything reads them today.
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
