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

// The other end of the same contract, and the half that was missing until
// backlog item 44. A stamp *ahead* of the device's own date is ordinary up to
// a point: the job stamps its own local day, so a device west of the job
// machine — or one opened in the hour after the job's local midnight — can
// legitimately still be on the previous date. One day of that is expected.
//
// Further ahead than that, the two clocks disagree by more than a timezone can
// explain, and the age stops being evidence of anything: a device whose date
// is set a week behind reads a five-day-old file as -2 days old, i.e. as fresh.
// That is the failure this bound exists for. `isStale` means "do not present
// these numbers as current", and an age this code cannot trust belongs on that
// side of the line, not on the freshness side by default.
export const FUTURE_TOLERANCE_DAYS = 1;

// The freshness rule on its own, taking both dates as arguments so it is pure
// and testable without React or a clock (scripts/check-data.mjs §25).
//
// `ageDays` is reported raw and unclamped, negatives included. Clamping was the
// other candidate fix for item 44 and is rejected deliberately: a negative age
// is the *evidence* that the two clocks disagree, and folding it into 0 would
// hide the signal this function is here to act on.
export function freshness(asOf, today) {
  const parseable = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const ageDays = parseable(asOf) && parseable(today) ? dayDiff(asOf, today) : null;
  return {
    ageDays,
    // A null age — no `asOf` at all, or one in a shape this code cannot read —
    // is not freshness either. §2.3's rule is that a figure appears with its
    // date or does not appear; a figure whose date is missing fails that on
    // its face, and the old `ageDays > STALE_AFTER_DAYS` test passed it.
    isStale: ageDays === null || ageDays > STALE_AFTER_DAYS || ageDays < -FUTURE_TOLERANCE_DAYS,
  };
}

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
  const { ageDays, isStale } = freshness(data?.asOf, todayStr());

  return {
    status,
    data,
    ageDays,
    // Only meaningful once `status === "ready"`: with no file loaded there is
    // nothing to call stale, and reporting `true` while still loading would
    // make a consumer that renders the flag before checking `status` flash a
    // "no data" state on every open.
    isStale: status === "ready" && isStale,
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
