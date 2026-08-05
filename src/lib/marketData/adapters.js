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

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// ── Finnhub (default) ─────────────────────────────────────────────────────
// Free tier is 60 requests/minute, which a twelve-symbol daily job never
// approaches. Requires a free API key.
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
      const data = await getJSON(url);
      if (data.s !== "ok" || !Array.isArray(data.c)) {
        throw new Error(`finnhub returned no candles for ${symbol}`);
      }
      out[symbol] = data.c;
    }
    return out;
  },
};

// ── Stooq (keyless fallback) ──────────────────────────────────────────────
// Plain CSV, no key, no signup. There is no formal API or terms of service
// behind it, so it is a fallback and a local-development convenience rather
// than something to depend on in production.
export const stooq = {
  name: "stooq",
  needsKey: false,
  async dailyCloses(symbols, { days = 260 } = {}) {
    const out = {};
    for (const symbol of symbols) {
      const url = `https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}.us&i=d`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} for ${symbol} from stooq`);
      const rows = (await res.text()).trim().split("\n").slice(1);
      const closes = rows
        .map((row) => Number(row.split(",")[4]))
        .filter((n) => Number.isFinite(n));
      if (closes.length === 0) throw new Error(`stooq returned no rows for ${symbol}`);
      out[symbol] = closes.slice(-days);
    }
    return out;
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

export const ADAPTERS = { finnhub, stooq, fixture };

export function getAdapter(name) {
  const adapter = ADAPTERS[name];
  if (!adapter) {
    throw new Error(`unknown market-data adapter "${name}" (have: ${Object.keys(ADAPTERS).join(", ")})`);
  }
  return adapter;
}
