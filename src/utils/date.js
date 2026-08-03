// Shared local-timezone date helpers for localStorage-backed daily features
// (streak counter, continue-tomorrow prompt). Kept dependency-free.

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
