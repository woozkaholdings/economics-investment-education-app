// ═══════════════════════════════════════════════════════════════════════════
// BALANCE-SHEET CHART — are the five bars still the numbers FRED says?
//
// W-6.2 rule 3 (the learner-visible failure this would have caught, in one
// sentence): a learner opens Reference → Market Dashboard, or lesson 37's
// inline figure, and reads a Fed balance-sheet bar that is simply the wrong
// height — or hears a screen reader say a value that no longer matches the bar
// beside it.
//
// ⚠️ THIS CHECK WAS ARGUED AGAINST BY THE RUN THAT PROPOSED IT, AND BUILT ON
// OWNER INSTRUCTION (2026-09-12). The note filed that morning said a guard here
// was not due, because the endpoint convention (below) prevents drift "by
// construction" and the only failure left was a bar off by one decimal. The
// owner said build it. **The argument was half wrong and the second half of
// this file is why:** the convention prevents drift only for bars whose era has
// CLOSED, and nothing was stopping the next run from adding a bar for an era
// still in progress — which is exactly the defect that was just fixed.
//
// ── WHAT THE SERIES MEANS, which is the thing being checked ────────────────
// Every bar is its era's ENDPOINT — the extreme the balance sheet reached
// before the next phase began — not a current reading. `balanceSheetDescription`
// says so in all five languages ("…9.0 after the pandemic response, 6.5 after
// the second tightening"), and the series comment says it from the other side:
// labeled by era rather than by date "so it reads unambiguously as history".
//
// That is the property this file tests, and it is testable precisely BECAUSE
// it is an endpoint: a closed era's extreme is a fact that never moves, so a
// disagreement with FRED is always a defect here and never just the passage of
// time. On 2026-09-12 four of five bars reproduced and `qt2` did not — it held
// 6.7, the level on the day it was written, ~12 days from rendering as 6.8.
//
// ── THE FAIL / WARN / NO-VERDICT SPLIT ────────────────────────────────────
// FAIL   — a bar disagrees with FRED, or a stated value is missing from a
//          language's description, or a bar has no era window (and so is
//          unchecked). All three are the repo's own and a run can fix them.
// WARN   — an era window whose end is in the future or absent: that bar tracks
//          a moving quantity and WILL drift. This is the rule the 6.7 bug broke,
//          turned into a tripwire for the next bar rather than a comment.
// NO VERDICT — FRED is unreachable or a control did not fire. Never a pass and
//          never a failure: an instrument that cannot measure says so, per
//          `check-deployed.mjs`. Offline, `--offline` still runs the half that
//          needs no network.
//
// Nothing here is retyped: the bars, the formatter and the descriptions are
// imported from `src/content/markets.js`, the same module the app renders.
// ═══════════════════════════════════════════════════════════════════════════

import {
  balanceSheetDescription,
  balanceSheetFormat,
  balanceSheetHistory,
} from "../src/content/markets.js";
import { todayStr } from "../src/utils/date.js";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const OFFLINE = has("--offline");
const SELF_TEST = has("--self-test");

let failures = 0;
let warnings = 0;
let noVerdict = false;
const fail = (msg) => { console.error(`FAIL: ${msg}`); failures++; };
const warn = (msg) => { console.error(`WARN: ${msg}`); warnings++; };
const ok = (msg) => console.log(`ok: ${msg}`);

// ── The era spec ──────────────────────────────────────────────────────────
// Deliberately HERE and not in `src/content/markets.js`: these windows are
// test scaffolding, and shipping them would put bytes in the app bundle that
// no screen renders (check-payload.mjs would be right to object).
//
// The cost of that split is drift between spec and data, so it is closed
// below: a bar with no window FAILS, and a window with no bar FAILS. Adding a
// bar without deciding its window is not possible quietly.
//
// `mode` follows from what ends an era: an expansion ends at its maximum, a
// tightening ends at its minimum. `pre08` is the pre-QE1 plateau, the baseline
// the chart starts from.
const ERAS = {
  pre08: { from: "2007-01-01", to: "2008-09-03", mode: "max", why: "pre-QE1 plateau, up to the week before Lehman" },
  qe123: { from: "2014-10-01", to: "2015-06-30", mode: "max", why: "QE3 ends; the balance sheet plateaus at its post-QE3 high" },
  qt1:   { from: "2019-06-01", to: "2019-10-31", mode: "min", why: "trough of the 2017-19 tightening, before the repo-crisis rebound" },
  covid: { from: "2022-02-01", to: "2022-06-30", mode: "max", why: "peak of the pandemic expansion, just before QT2 began" },
  qt2:   { from: "2025-09-01", to: "2026-02-28", mode: "min", why: "trough of the 2022-25 tightening; runoff ended 2025-12-01" },
};

const FRED = (id) => `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`;
const SERIES = "WALCL";           // Fed total assets, weekly, $ millions
const BOGUS = "WALCLNOTASERIES";  // 404 control

// ── Offline half: the bars and the five descriptions must agree ───────────
// This is not a formality. The 2026-09-12 fix had to change SIX places for one
// bar — the value and the same figure inside five translated descriptions —
// and the scan that found them all was initially run with an unquoted glob
// that silently matched nothing. Five of six would have shipped unfixed, and
// the chart would have disagreed with its own screen-reader text.
const LANGS = Object.keys(balanceSheetDescription);
const decimalFor = (lang, formatted) => (lang === "es" ? formatted.replace(".", ",") : formatted);

const checkDescriptions = () => {
  let bad = 0;
  for (const bar of balanceSheetHistory) {
    const shown = balanceSheetFormat(bar.value);
    for (const lang of LANGS) {
      const want = decimalFor(lang, shown);
      if (!balanceSheetDescription[lang].includes(want)) {
        fail(
          `balanceSheetDescription.${lang} does not contain "${want}", the value bar "${bar.key}" renders. ` +
            `The figure and its text alternative have drifted apart: a sighted reader sees ${shown} and a ` +
            `screen-reader user is told something else.`,
        );
        bad++;
      }
    }
  }
  if (bad === 0) {
    ok(
      `all ${balanceSheetHistory.length} bar value(s) appear in all ${LANGS.length} description(s) ` +
        `(${LANGS.join("/")}), each in its own decimal form — es uses a comma`,
    );
  }
  return bad;
};

// ── Spec/data drift, both directions ──────────────────────────────────────
const checkSpecCoverage = () => {
  let bad = 0;
  for (const bar of balanceSheetHistory) {
    if (!ERAS[bar.key]) {
      fail(
        `bar "${bar.key}" has no era window in this file, so NOTHING checks its value. ` +
          `Add one to ERAS (from/to/mode) — deciding the window is the work; the digit is not.`,
      );
      bad++;
    }
  }
  for (const key of Object.keys(ERAS)) {
    if (!balanceSheetHistory.some((b) => b.key === key)) {
      fail(`ERAS has a window for "${key}", which is no longer a bar in balanceSheetHistory. Remove it.`);
      bad++;
    }
  }
  if (bad === 0) ok(`every bar has an era window and every window has a bar (${balanceSheetHistory.length})`);
  return bad;
};

// ── The rule the 6.7 bug broke, as a tripwire for the NEXT bar ────────────
const checkErasAreClosed = () => {
  // `todayStr()` rather than a UTC slice: check-data.mjs §23 caught the UTC
  // form here, and it was right — east of UTC that reads as tomorrow all
  // evening, so an era ending today would stop warning several hours early.
  const today = todayStr();
  for (const [key, era] of Object.entries(ERAS)) {
    if (!era.to || era.to > today) {
      warn(
        `era "${key}" ends ${era.to ?? "(never)"}, which is not in the past. Its extreme can still move, so the ` +
          `bar tracks a live quantity and will drift — which is exactly how "${key}" would repeat the 6.7 defect. ` +
          `A bar belongs in this chart only once its era has closed.`,
      );
    }
  }
};

const parseCsv = (text, id) => {
  const rows = [];
  for (const line of text.trim().split("\n").slice(1)) {
    const [date, raw] = line.split(",");
    if (!date || raw === undefined || raw === "" || raw === ".") continue;
    const v = Number(raw);
    if (Number.isFinite(v)) rows.push([date, v / 1000]); // $M -> $B
  }
  if (rows.length === 0) throw new Error(`${id}: no usable rows`);
  return rows;
};

const get = async (url) => {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  try {
    const res = await fetch(url, { signal: ac.signal });
    return { status: res.status, text: res.status === 200 ? await res.text() : "" };
  } catch (err) {
    return { status: null, error: err.message, text: "" };
  } finally {
    clearTimeout(t);
  }
};

// ── main ──────────────────────────────────────────────────────────────────
console.log("Balance-sheet chart — bars vs FRED\n");

const descBad = checkDescriptions();
const specBad = checkSpecCoverage();
checkErasAreClosed();

let measured = "not measured (offline)";

if (OFFLINE) {
  console.log("\n  (--offline: the FRED comparison was skipped by request; the checks above need no network.)");
} else {
  console.log(`\n  control  → GET ${FRED(BOGUS)}`);
  const control = await get(FRED(BOGUS));
  console.log(`  series   → GET ${FRED(SERIES)}`);
  const real = await get(FRED(SERIES));

  if (real.status === null || control.status === null) {
    noVerdict = true;
    console.error(
      `\n  ⛔ NO VERDICT — FRED is unreachable (${real.error ?? control.error}). The instrument cannot support a\n` +
        `     result either way, so this is neither a pass nor a failure. Re-run with a network, or use\n` +
        `     \`--offline\` to run only the checks above.`,
    );
  } else if (control.status !== 404) {
    noVerdict = true;
    console.error(
      `\n  ⛔ NO VERDICT — the 404 control returned HTTP ${control.status} for a series id that does not exist.\n` +
        `     Something is answering for everything, so a 200 on the real series proves nothing.`,
    );
  } else if (real.status !== 200) {
    noVerdict = true;
    console.error(`\n  ⛔ NO VERDICT — ${SERIES} returned HTTP ${real.status} while the control correctly returned 404.`);
  } else {
    ok(`control fired: a nonexistent series id returns 404 while ${SERIES} returns 200`);
    const rows = parseCsv(real.text, SERIES);
    // Parse control: this series is weekly back to 2002, so anything under a
    // thousand rows means the CSV shape changed and every extreme below would
    // be computed from a fraction of the data.
    if (rows.length < 1000) {
      noVerdict = true;
      console.error(
        `\n  ⛔ NO VERDICT — ${SERIES} parsed to only ${rows.length} row(s); expected >1000 weekly observations.\n` +
          `     The CSV shape changed and the extremes below would be computed from a fraction of the series.`,
      );
    } else {
      ok(`${SERIES} parsed: ${rows.length} weekly rows, ${rows[0][0]} .. ${rows[rows.length - 1][0]}`);
      const lines = [];
      for (const bar of balanceSheetHistory) {
        const era = ERAS[bar.key];
        if (!era) continue; // already FAILed in checkSpecCoverage
        const win = rows.filter(([d]) => d >= era.from && d <= era.to);
        if (win.length === 0) {
          fail(`era "${bar.key}" (${era.from}..${era.to}) selects no observations from ${SERIES}.`);
          continue;
        }
        const pick = win.reduce((a, b) => (era.mode === "max" ? (b[1] > a[1] ? b : a) : (b[1] < a[1] ? b : a)));
        const [pickDate, pickVal] = pick;
        // Self-test perturbs the STATED value to prove this comparison can fail.
        const stated = SELF_TEST && bar.key === "covid" ? bar.value + 0.4 : bar.value;
        const shown = balanceSheetFormat(stated);
        const fromFred = balanceSheetFormat(pickVal / 1000);
        const agree = shown === fromFred;
        // How far the underlying number sits from flipping the displayed
        // decimal. On a closed era this is informational; it is the quantity
        // that went wrong on qt2 while nothing was watching.
        const t = pickVal / 1000;
        const margin = Math.min(Math.abs(t - (Math.round(t * 10) / 10 - 0.05)), Math.abs(t - (Math.round(t * 10) / 10 + 0.05)));
        lines.push(
          `  ${bar.key.padEnd(6)} stated ${shown}  FRED ${fromFred} (${era.mode} ${pickDate}, ${t.toFixed(3)}T)  ` +
            `${agree ? "match" : "*** MISMATCH ***"}  [${margin.toFixed(3)}T from the next decimal]`,
        );
        if (!agree) {
          fail(
            `bar "${bar.key}" shows ${shown} but ${SERIES}'s ${era.mode} over ${era.from}..${era.to} is ` +
              `${t.toFixed(3)}T, which renders as ${fromFred} (${era.why}). ` +
              `Fix the value AND the same figure in all ${LANGS.length} descriptions.`,
          );
        }
      }
      console.log(`\n${lines.join("\n")}`);
      measured = `${SERIES} @ ${rows[rows.length - 1][0]}, ${balanceSheetHistory.length} bar(s) compared`;
    }
  }
}

if (SELF_TEST) {
  console.log(
    `\n  --self-test: the "covid" bar's STATED value was perturbed by +0.4 above. This run is correct only if\n` +
      `  it reported exactly one MISMATCH, on covid. A self-test that passes clean means the comparison is blind.`,
  );
}

console.log(`\nMEASURED balance-sheet: ${measured}; descriptions ${descBad === 0 ? "agree" : `${descBad} mismatch(es)`}, spec coverage ${specBad === 0 ? "complete" : `${specBad} gap(s)`}`);
console.log(`  (Re-measured against FRED on every run; nothing here is retyped. Quote this line with the date you ran it.)`);

if (noVerdict) {
  console.log(`\nNO VERDICT: the FRED comparison did not run. ${failures} failure(s), ${warnings} warning(s) from the offline checks.`);
  process.exit(failures === 0 ? 0 : 1);
}
console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
