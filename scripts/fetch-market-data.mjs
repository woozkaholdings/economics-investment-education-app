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

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BENCHMARK, SECTOR_SYMBOLS } from "../src/content/sectors.js";
import { getAdapter } from "../src/lib/marketData/adapters.js";
import { fetchEconomics, fixtureEconomics } from "../src/lib/marketData/fred.js";
import { MIN_BARS, OUTPERFORM_THRESHOLD, WJ_PERIODS, activeStrategy, computeRelativeStrength } from "../src/lib/relativeStrength.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "data", "market.json");

// ── keys ──────────────────────────────────────────────────────────────────
// Read from a gitignored file at the repo root, so no key ever reaches git or
// the browser. Two filenames are accepted, in this order:
//
//   1. `api-keys.txt`  — VISIBLE in Finder. Copy `API_KEYS.template.txt` to
//                        this name and fill it in. Recommended.
//   2. `.env.local`    — the dotfile convention, for anyone who prefers it.
//                        macOS hides dotfiles, which is precisely why the
//                        visible name exists as well.
//
// Real environment variables always win over both, so a one-off run can
// override the file without editing it.
//
// Deliberately a hand-rolled parser rather than a dependency: this runs in a
// scheduled job against a pinned portable Node, and one fewer install step is
// worth more here than dotenv's edge-case handling.
const KEY_FILES = ["api-keys.txt", ".env.local"];

function loadKeyFile() {
  for (const name of KEY_FILES) {
    const path = join(ROOT, name);
    if (!existsSync(path)) continue;

    for (const rawLine of readFileSync(path, "utf8").split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      // Strip optional surrounding quotes; leave the value otherwise untouched.
      const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
    return name;   // first file found wins; don't merge two sources
  }
  return null;
}

const keyFileUsed = loadKeyFile();

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

  // Each adapter declares which variable holds its key, so adding a provider
  // never means editing this function.
  const keyEnv = adapter.keyEnv ?? "FINNHUB_API_KEY";
  const apiKey = process.env[keyEnv];
  if (adapter.needsKey && !apiKey) {
    throw new Error(
      `adapter "${adapterName}" needs ${keyEnv}. Add it to api-keys.txt `
      + `(copy API_KEYS.template.txt) — see that file for where to get one.`
    );
  }

  const symbols = [...SECTOR_SYMBOLS, BENCHMARK.symbol];
  console.log(`[market] adapter=${adapterName} symbols=${symbols.length}`);

  const closes = await adapter.dailyCloses(symbols, { days: 260, apiKey });
  const benchmark = closes[BENCHMARK.symbol];
  if (!benchmark) throw new Error(`no closes returned for benchmark ${BENCHMARK.symbol}`);

  // The measure needs at least MIN_BARS of history (its longest lookback plus
  // the current bar). Pass a margin above that rather than the exact minimum,
  // and slice asset and benchmark identically so the positional lookbacks stay
  // aligned to the same trading days.
  const rsBars = Math.max(MIN_BARS, WINDOWS["3m"] + 1);
  if (benchmark.length < MIN_BARS) {
    throw new Error(
      `benchmark ${BENCHMARK.symbol} returned ${benchmark.length} closes; `
      + `relative strength needs at least ${MIN_BARS}`
    );
  }
  const sectorSeries = Object.fromEntries(
    SECTOR_SYMBOLS
      .filter((s) => Array.isArray(closes[s]) && closes[s].length >= MIN_BARS)
      .map((s) => [s, closes[s].slice(-rsBars)])
  );
  const rs = computeRelativeStrength(
    sectorSeries,
    benchmark.slice(-rsBars),
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
      // No single "window": the measure sums excess return across all three
      // lookbacks in `periods`, which is what distinguishes it from a return.
      unit: "percentage-points",
      outperformThreshold: OUTPERFORM_THRESHOLD,
      // False now that the owner's own measure is in place; kept in the
      // payload so any future stand-in has to declare itself.
      provisional: rs[0]?.method !== "wj-sector-comparison",
      periods: WJ_PERIODS,
    },
    sectors,
    economics,
  };

  // Guard: never let an accidental fixture run clobber real data. Without this,
  // one scheduled run with a missing key (or a hand-run that forgot --adapter)
  // silently replaces live figures with synthetic ones that still look
  // plausible on screen. Failing loudly and leaving yesterday's real file in
  // place is strictly better — the UI already shows its age.
  if (useFixtures && existsSync(OUT)) {
    try {
      const current = JSON.parse(readFileSync(OUT, "utf8"));
      if (current.source && current.source !== "fixture" && !process.argv.includes("--force")) {
        throw new Error(
          `refusing to overwrite real data (source="${current.source}", asOf=${current.asOf}) `
          + `with fixtures. Pass --force if that is genuinely what you want.`
        );
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.warn("[market] existing file is unreadable; overwriting");
      } else {
        throw err;
      }
    }
  }

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
