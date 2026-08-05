// ═══════════════════════════════════════════════════════════════════════════
// MARKET DATA ADAPTERS
//
// One interface, several providers. Only the daily job imports these — the app
// itself never calls a provider, never holds a key, and only reads the static
// file the job writes (see DECISIONS.md).
//
// An adapter is:
//   { name, needsKey, dailyCloses(symbols, { days, apiKey }) -> { [symbol]: number[] } }
// with closes ordered oldest-first.
//
// Deliberately NOT included: Yahoo Finance and Finviz. Finviz's API is a paid
// tier, so free use means scraping against their terms with a one-request-per-
// minute ban threshold; Yahoo has had no official API since 2017 and its
// unofficial endpoints change without notice. Neither is a safe base for a
// paid product. See DECISIONS.md for the full reasoning before adding either.
// ═══════════════════════════════════════════════════════════════════════════

const DAY = 86400;

// Strips credentials out of a URL before it can reach a log, an error report,
// or the scheduled job's output. Providers pass keys as query parameters, so
// the naive `for ${url}` in an error message publishes the key to wherever
// that message lands.
export function redactUrl(url) {
  return String(url).replace(/([?&](?:token|api_?key|apikey)=)[^&]*/gi, "$1[REDACTED]");
}

async function getJSON(url, label) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${label ?? redactUrl(url)}`);
  }
  return res.json();
}

// ── Finnhub ───────────────────────────────────────────────────────────────
// ⚠️ NOT USABLE ON THE FREE TIER (verified 2026-08-04). The key authenticates
// fine — `/quote` returns 200 — but `/stock/candle`, the only endpoint with
// the history this job needs, answers 403 "You don't have access to this
// resource." Historical candles are a paid plan.
//
// Kept because it works immediately on a paid Finnhub plan, and because
// `/quote` remains available if a future feature only needs a last price.
export const finnhub = {
  name: "finnhub",
  needsKey: true,
  async dailyCloses(symbols, { days = 260, apiKey } = {}) {
    if (!apiKey) throw new Error("finnhub adapter requires an API key");
    const to = Math.floor(Date.now() / 1000);
    const from = to - days * DAY;
    const out = {};
    for (const symbol of symbols) {
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${apiKey}`;
      // Label rather than URL: never let a key reach an error message.
      const data = await getJSON(url, `finnhub candles for ${symbol}`);
      if (data.s !== "ok" || !Array.isArray(data.c)) {
        throw new Error(`finnhub returned no candles for ${symbol}`);
      }
      out[symbol] = data.c;
    }
    return out;
  },
};

// ── Tiingo (default) ──────────────────────────────────────────────────────
// Free tier includes end-of-day history, which is exactly what this job needs.
// Free key: https://www.tiingo.com/account/api/token
// Returns oldest-first already.
export const tiingo = {
  name: "tiingo",
  needsKey: true,
  keyEnv: "TIINGO_API_KEY",
  async dailyCloses(symbols, { days = 260, apiKey } = {}) {
    if (!apiKey) throw new Error("tiingo adapter requires TIINGO_API_KEY");
    // Ask for calendar days generously; ~365 covers 260 trading days.
    const start = new Date(Date.now() - Math.ceil(days * 1.5) * 86400_000)
      .toISOString().slice(0, 10);
    const out = {};
    for (const symbol of symbols) {
      const url = `https://api.tiingo.com/tiingo/daily/${encodeURIComponent(symbol)}/prices`
        + `?startDate=${start}&token=${apiKey}`;
      const rows = await getJSON(url, `tiingo prices for ${symbol}`);
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error(`tiingo returned no rows for ${symbol}`);
      }
      // adjClose accounts for splits and dividends — the right basis for a
      // performance comparison; close alone would show a split as a crash.
      const closes = rows
        .map((r) => Number(r.adjClose ?? r.close))
        .filter(Number.isFinite);
      out[symbol] = closes.slice(-days);
    }
    return out;
  },
};

// ── Twelve Data ───────────────────────────────────────────────────────────
// Alternative free tier with EOD history. Free key:
// https://twelvedata.com/pricing  (the free plan is enough — 12 calls/day)
// NOTE: returns newest-first, so the series is reversed to match the
// oldest-first contract every other adapter honours.
export const twelveData = {
  name: "twelvedata",
  needsKey: true,
  keyEnv: "TWELVEDATA_API_KEY",
  async dailyCloses(symbols, { days = 260, apiKey } = {}) {
    if (!apiKey) throw new Error("twelvedata adapter requires TWELVEDATA_API_KEY");
    const out = {};
    for (const symbol of symbols) {
      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}`
        + `&interval=1day&outputsize=${days}&apikey=${apiKey}`;
      const data = await getJSON(url, `twelvedata time_series for ${symbol}`);
      if (data.status === "error" || !Array.isArray(data.values)) {
        throw new Error(`twelvedata error for ${symbol}: ${data.message ?? "no values"}`);
      }
      const closes = data.values
        .map((v) => Number(v.close))
        .filter(Number.isFinite)
        .reverse();
      out[symbol] = closes;
    }
    return out;
  },
};

// ── Stooq ─────────────────────────────────────────────────────────────────
// ⚠️ NO LONGER USABLE (verified 2026-08-04). The CSV endpoint now answers with
// a JavaScript proof-of-work bot challenge instead of data:
//   "This site requires JavaScript to verify your browser."
// Fetching it programmatically would mean defeating bot detection, which this
// project will not do. Kept only so the failure is explicit rather than
// looking like an empty response.
export const stooq = {
  name: "stooq",
  needsKey: false,
  async dailyCloses() {
    throw new Error(
      "stooq is behind a JavaScript bot challenge and is no longer a usable data source. "
      + "Use --adapter=tiingo or --adapter=twelvedata."
    );
  },
};

// ── Fixture (offline) ─────────────────────────────────────────────────────
// Deterministic synthetic series so the pipeline and the UI can be built and
// reviewed with no key and no network. Clearly fake by construction — the
// values are generated, not sampled from any market — and the job stamps
// `source: "fixture"` into its output so a fixture-built file can never be
// mistaken for real data downstream.
export const fixture = {
  name: "fixture",
  needsKey: false,
  async dailyCloses(symbols, { days = 260 } = {}) {
    const out = {};
    symbols.forEach((symbol, s) => {
      // A stable per-symbol drift and wobble; no randomness, so repeated runs
      // produce identical output and diffs stay meaningful.
      const drift = 0.0002 * (((s * 7) % 11) - 5);
      const amp = 0.01 + 0.002 * (s % 4);
      const closes = [];
      let price = 100 + s * 3;
      for (let d = 0; d < days; d++) {
        price *= 1 + drift + amp * Math.sin((d + s * 13) / 9);
        closes.push(Number(price.toFixed(2)));
      }
      out[symbol] = closes;
    });
    return out;
  },
};

export const ADAPTERS = { tiingo, twelvedata: twelveData, finnhub, stooq, fixture };

export function getAdapter(name) {
  const adapter = ADAPTERS[name];
  if (!adapter) {
    throw new Error(`unknown market-data adapter "${name}" (have: ${Object.keys(ADAPTERS).join(", ")})`);
  }
  return adapter;
}
