#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// DAILY MARKET DATA JOB
//
// Runs once a day after the close. Fetches, computes, and writes a static
// `public/data/market.json` that the app loads like any other asset. The app
// never calls a provider and never holds a key (see DECISIONS.md).
//
//   node scripts/fetch-market-data.mjs                    # fixtures, no network
//   node scripts/fetch-market-data.mjs --adapter=finnhub  # real data
//
// Environment: FINNHUB_API_KEY, FRED_API_KEY.
//
// WHAT IS PUBLISHED: derived values only — percent change, relative-strength
// value and rank, and latest economic readings. Never raw OHLCV. Caching a
// provider's series and serving it to users is redistribution, which several
// free tiers prohibit even where calling the API is fine.
//
// The relative-strength number comes from a PLACEHOLDER strategy that a
// proprietary formula will replace; `relativeStrength.method` in the output
// records which one produced the file. See src/lib/relativeStrength.js.
// ═══════════════════════════════════════════════════════════════════════════

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BENCHMARK, SECTOR_SYMBOLS } from "../src/content/sectors.js";
import { getAdapter } from "../src/lib/marketData/adapters.js";
import { fetchEconomics, fixtureEconomics } from "../src/lib/marketData/fred.js";
import { activeStrategy, computeRelativeStrength } from "../src/lib/relativeStrength.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "data", "market.json");

// Windows the UI offers. Trading days, not calendar days.
const WINDOWS = { "1m": 21, "3m": 63, "6m": 126 };

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : fallback;
};

const pctChange = (closes, days) => {
  if (!closes || closes.length < days + 1) return null;
  const slice = closes.slice(-(days + 1));
  const [first] = slice;
  const last = slice[slice.length - 1];
  return first ? (last - first) / first : null;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

async function main() {
  const adapterName = arg("adapter", "fixture");
  const adapter = getAdapter(adapterName);
  const useFixtures = adapterName === "fixture";
  const asOf = arg("as-of", todayISO());

  const apiKey = process.env.FINNHUB_API_KEY;
  if (adapter.needsKey && !apiKey) {
    throw new Error(`adapter "${adapterName}" needs FINNHUB_API_KEY`);
  }

  const symbols = [...SECTOR_SYMBOLS, BENCHMARK.symbol];
  console.log(`[market] adapter=${adapterName} symbols=${symbols.length}`);

  const closes = await adapter.dailyCloses(symbols, { days: 260, apiKey });
  const benchmark = closes[BENCHMARK.symbol];
  if (!benchmark) throw new Error(`no closes returned for benchmark ${BENCHMARK.symbol}`);

  // Relative strength over the longest window the UI shows.
  const sectorSeries = Object.fromEntries(
    SECTOR_SYMBOLS.filter((s) => closes[s]).map((s) => [s, closes[s].slice(-WINDOWS["3m"] - 1)])
  );
  const rs = computeRelativeStrength(
    sectorSeries,
    benchmark.slice(-WINDOWS["3m"] - 1),
    activeStrategy
  );
  const rsBySymbol = Object.fromEntries(rs.map((r) => [r.symbol, r]));

  const sectors = SECTOR_SYMBOLS.map((symbol) => ({
    symbol,
    change: Object.fromEntries(
      Object.entries(WINDOWS).map(([label, days]) => [label, pctChange(closes[symbol], days)])
    ),
    relativeStrength: rsBySymbol[symbol]
      ? { value: rsBySymbol[symbol].value, rank: rsBySymbol[symbol].rank, of: rsBySymbol[symbol].of }
      : null,
  }));

  const economics = useFixtures
    ? fixtureEconomics(asOf)
    : await fetchEconomics(process.env.FRED_API_KEY);

  const payload = {
    asOf,
    // `source` is the honesty switch the UI keys off: anything built from
    // fixtures is labelled as sample data rather than shown as a reading.
    source: useFixtures ? "fixture" : adapterName,
    benchmark: {
      symbol: BENCHMARK.symbol,
      name: BENCHMARK.name,
      change: Object.fromEntries(
        Object.entries(WINDOWS).map(([label, days]) => [label, pctChange(benchmark, days)])
      ),
    },
    relativeStrength: {
      method: rs[0]?.method ?? null,
      window: "3m",
      // Flags that the current formula is a stand-in, so a consumer of this
      // file never has to guess whether the proprietary one has landed.
      provisional: rs[0]?.method === "baseline-excess-return",
    },
    sectors,
    economics,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`[market] wrote ${OUT} (asOf=${asOf}, source=${payload.source})`);
}

main().catch((err) => {
  console.error(`[market] FAILED: ${err.message}`);
  // Non-zero so a scheduler surfaces the failure. The app keeps serving the
  // previous file and shows its age — better than overwriting good data with
  // a partial or empty result.
  process.exit(1);
});
