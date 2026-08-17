// Shared local-timezone date helpers for localStorage-backed daily features
// (streak counter, continue-tomorrow prompt). Kept dependency-free.
//
// Also imported by the Node scripts — `scripts/check-claims.mjs` for the §9.1
// register's "today", and `scripts/fetch-market-data.mjs` for the `asOf` it
// stamps on `public/data/market.json`. That is deliberate rather than
// incidental: `useMarketData` compares that stamp against `todayStr()`, so the
// writer and the reader must agree on what day it is. Both scripts previously
// computed their own date as `new Date().toISOString().slice(0, 10)`, which is
// the UTC day and is a different day from this one every evening east of UTC
// (see check-data.mjs §23, which now fails the build on that idiom).

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Whole-day difference between two YYYY-MM-DD strings, via Date.UTC to avoid
// DST/timezone drift a raw millisecond subtraction across local dates would have.
export function dayDiff(a, b) {
  const toUTC = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((toUTC(b) - toUTC(a)) / 86400000);
}
