// ═══════════════════════════════════════════════════════════════════════════
// FRED
//
// Economics data comes from FRED directly (owner-directed; see DECISIONS.md).
// Used only by the daily job — the key never reaches the browser.
//
// Attribution: FRED® is a registered trademark of the Federal Reserve Bank of
// St. Louis, and its terms expect the source to be credited. Note also that a
// few third-party series carried inside FRED are not redistributable; the
// series below are Federal Reserve and BLS releases, and the job publishes
// only latest values rather than full history in any case.
// ═══════════════════════════════════════════════════════════════════════════

// Series chosen to answer "what is the economy doing?" in plain terms — the
// same questions the lessons teach, so the numbers reinforce the teaching
// rather than sitting beside it.
export const FRED_SERIES = [
  { id: "FEDFUNDS", key: "policyRate", unit: "percent" },   // Fed funds rate
  { id: "DGS2", key: "yield2y", unit: "percent" },          // 2-year Treasury
  { id: "DGS10", key: "yield10y", unit: "percent" },        // 10-year Treasury
  { id: "T10Y2Y", key: "curveSpread", unit: "percent" },    // 10y minus 2y
  { id: "CPIAUCSL", key: "cpiIndex", unit: "index" },       // CPI
  { id: "UNRATE", key: "unemployment", unit: "percent" },   // Unemployment
];

// ── The curve group must share ONE observation date ──────────────────────────
// `DGS2`, `DGS10` and `T10Y2Y` are three views of the same daily H.15 release,
// and the Sector-performance screen prints all three together under the labels
// "2-year Treasury yield", "10-year Treasury yield" and "10-year minus 2-year".
// Taking each series' own latest row independently broke that subtraction:
// measured across the 21 committed `market.json` snapshots, T10Y2Y's newest
// usable row was AHEAD of the two yields' on 20 of them, and on 14 the printed
// spread differed from `yield10y - yield2y` by at least a basis point — a
// learner reading 4.34 / 4.77 / 0.41 on one screen, as they did on 2026-09-04,
// cannot make the arithmetic work.
//
// So these three are resolved to the most recent date on which ALL of them
// carry a number, and the other three series (monthly, unrelated to each
// other) keep their own latest row.
export const CURVE_GROUP = ["DGS2", "DGS10", "T10Y2Y"];

/**
 * The latest date carrying a usable value in EVERY series in `ids`.
 *
 * `rowsById` is `{ [seriesId]: [{ date, value }] }` holding only usable rows.
 * Pure and synchronous on purpose: `fetchEconomics` is untestable offline
 * because it calls `fetch()`, so the alignment rule lives here where
 * `check-data.mjs` §15 can exercise it against fixed FRED-shaped input.
 * Returns null when the series never overlap, which the caller reports rather
 * than silently papering over.
 */
export function alignedDate(rowsById, ids = CURVE_GROUP) {
  const present = ids.map((id) => new Map((rowsById[id] || []).map((r) => [r.date, r.value])));
  if (present.some((m) => m.size === 0)) return null;
  // Descending by date: FRED returns ISO dates, so lexicographic order is
  // chronological order.
  const candidates = [...present[0].keys()].sort().reverse();
  return candidates.find((d) => present.every((m) => m.has(d))) ?? null;
}

async function usableObservations(seriesId, apiKey) {
  const url = `https://api.stlouisfed.org/fred/series/observations`
    + `?series_id=${encodeURIComponent(seriesId)}`
    + `&api_key=${apiKey}&file_type=json&sort_order=desc&limit=8`;
  const res = await fetch(url);
  // Reports the series id, never the URL — the key rides in the query string.
  if (!res.ok) throw new Error(`FRED ${res.status} ${res.statusText} for series ${seriesId}`);
  const data = await res.json();
  // FRED writes "." for missing observations (holidays, not-yet-published), so
  // keep only the rows that actually carry a number.
  const usable = (data.observations || [])
    .filter((o) => o.value && o.value !== ".")
    .map((o) => ({ date: o.date, value: Number(o.value) }));
  if (!usable.length) throw new Error(`FRED returned no usable observation for ${seriesId}`);
  return usable;
}

export async function fetchEconomics(apiKey) {
  if (!apiKey) throw new Error("FRED requires an API key (set FRED_API_KEY)");
  const rowsById = {};
  for (const series of FRED_SERIES) {
    rowsById[series.id] = await usableObservations(series.id, apiKey);
  }

  const shared = alignedDate(rowsById);
  if (!shared) {
    throw new Error(
      `FRED: ${CURVE_GROUP.join(", ")} share no observation date in the last 8 rows — `
      + `refusing to publish a yield curve whose spread is not its own two yields`,
    );
  }

  const out = {};
  for (const series of FRED_SERIES) {
    const rows = rowsById[series.id];
    const row = CURVE_GROUP.includes(series.id)
      ? rows.find((r) => r.date === shared)
      : rows[0];
    out[series.key] = { value: row.value, date: row.date, unit: series.unit, seriesId: series.id };
  }
  return out;
}

// Offline stand-in with the same shape. Values are plainly illustrative and the
// job stamps `source: "fixture"`, so nothing downstream can mistake them for a
// real reading.
export function fixtureEconomics(asOf) {
  const at = (value, unit, seriesId) => ({ value, date: asOf, unit, seriesId });
  return {
    policyRate: at(4.33, "percent", "FEDFUNDS"),
    yield2y: at(3.86, "percent", "DGS2"),
    yield10y: at(4.21, "percent", "DGS10"),
    curveSpread: at(0.35, "percent", "T10Y2Y"),
    cpiIndex: at(320.1, "index", "CPIAUCSL"),
    unemployment: at(4.1, "percent", "UNRATE"),
  };
}
