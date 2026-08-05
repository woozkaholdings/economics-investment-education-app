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

async function latestObservation(seriesId, apiKey) {
  const url = `https://api.stlouisfed.org/fred/series/observations`
    + `?series_id=${encodeURIComponent(seriesId)}`
    + `&api_key=${apiKey}&file_type=json&sort_order=desc&limit=8`;
  const res = await fetch(url);
  // Reports the series id, never the URL — the key rides in the query string.
  if (!res.ok) throw new Error(`FRED ${res.status} ${res.statusText} for series ${seriesId}`);
  const data = await res.json();
  // FRED writes "." for missing observations (holidays, not-yet-published), so
  // take the most recent row that actually carries a number.
  const usable = (data.observations || []).find((o) => o.value && o.value !== ".");
  if (!usable) throw new Error(`FRED returned no usable observation for ${seriesId}`);
  return { value: Number(usable.value), date: usable.date };
}

export async function fetchEconomics(apiKey) {
  if (!apiKey) throw new Error("FRED requires an API key (set FRED_API_KEY)");
  const out = {};
  for (const series of FRED_SERIES) {
    const { value, date } = await latestObservation(series.id, apiKey);
    out[series.key] = { value, date, unit: series.unit, seriesId: series.id };
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
