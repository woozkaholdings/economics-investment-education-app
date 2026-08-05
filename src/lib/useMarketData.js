// ═══════════════════════════════════════════════════════════════════════════
// MARKET DATA LOADER
//
// Reads the static file the daily job writes. No provider call, no API key —
// see DECISIONS.md for why the app is deliberately on the far side of a
// scheduled job rather than talking to a market API itself.
//
// Freshness is the whole point of the contract here. §2.3's blindspot was a
// hardcoded date that never changed; the rule now is that the UI either says
// when a figure was taken or says the data is unavailable. It never shows a
// number as if it were current.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { dayDiff, todayStr } from "../utils/date.js";

// Market data older than this stops being presented as a picture of "now".
// Four days covers a long weekend plus a public holiday without nagging, while
// still catching a job that has actually stopped running.
export const STALE_AFTER_DAYS = 4;

export function useMarketData() {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;

    // Relative to the deployed base so it works under a sub-path too.
    fetch(new URL("data/market.json", document.baseURI))
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch(() => {
        // A missing or unreadable file is an expected state, not a crash: the
        // job may never have run on this deployment.
        if (!cancelled) setState({ status: "unavailable", data: null });
      });

    return () => { cancelled = true; };
  }, []);

  const { status, data } = state;
  const ageDays = data?.asOf ? dayDiff(data.asOf, todayStr()) : null;

  return {
    status,
    data,
    ageDays,
    isStale: ageDays !== null && ageDays > STALE_AFTER_DAYS,
    // True when the file came from the offline fixture adapter. The UI labels
    // these plainly rather than letting placeholder numbers read as a reading.
    isSample: data?.source === "fixture",
  };
}

// Formats a decimal fraction (0.0234) as a signed percentage ("+2.3%").
export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const pct = value * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(digits)}%`;
}

// Formats one FRED reading (src/lib/marketData/fred.js). Unlike formatPercent
// above, these values are already in percent units (4.33 means 4.33%, not a
// fraction) — a different shape from the sector change data, so it gets its
// own formatter rather than reusing formatPercent and silently misreading it.
export function formatEconomicReading(entry) {
  if (!entry || !Number.isFinite(entry.value)) return "—";
  return entry.unit === "percent" ? `${entry.value.toFixed(2)}%` : entry.value.toFixed(1);
}
