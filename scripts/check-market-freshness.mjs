// ═══════════════════════════════════════════════════════════════════════════
// MARKET-DATA FRESHNESS — does the file we ship still say anything about now?
//
// W-6.2 rule 3 (the learner-visible failure this would have caught, in one
// sentence): a learner opens Reference → Sectors on the live site and sees
// "market data unavailable" instead of the eleven sector rankings, because the
// owner's daily job stopped four days earlier and nothing in the repo said so.
//
// WHY THIS EXISTS AT ALL. Measured 2026-09-06, with a control (the same grep
// shape finds five readers of AGENT_LOG.md): before this file, **no script in
// this repo read `public/data/market.json`**. `check-data.mjs` §25 tests
// `freshness()` hard, but only against synthetic dates; `check-deployed.mjs`
// names the file solely to EXCLUDE it from the byte comparison, because it is
// regenerated daily. So the one artifact in the tree that goes wrong by
// standing still was the one artifact nothing looked at.
//
// The gap has now been caught twice by a human reading `git log` — W-6.5
// (2026-08-30) and W-7.3 (2026-09-06), eight days apart, both times after the
// fact. This turns that into a line printed on every `npm test`, with a
// countdown before the screen goes blank rather than a post-mortem after.
//
// ── The FAIL / WARN split, which is the whole design decision here ─────────
// Refreshing the data is the OWNER's scheduled job. W-7.3 is explicit: flagged,
// not touched — no dev-agent run can fix a stale file, and a hard failure would
// block every run on work none of them can do. So staleness WARNS.
//
// What FAILS is the half the repo genuinely owns: a file that is missing,
// unparseable, or carries an `asOf` the app's own freshness rule cannot read.
// Those ship a broken artifact to learners and a run CAN fix them — and note
// that `freshness()` folds them in with staleness under one `isStale: true`,
// so a check that only asked "isStale?" could not tell "the job is late" from
// "the file is corrupt". This one separates them, because the remedies have
// different owners.
//
// Nothing here is retyped: the thresholds and the verdict come from
// `src/lib/useMarketData.js`, the same module the browser runs. A check that
// hardcoded "4 days" could drift from the app and report a comfortable number
// while the learner's screen was already empty.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { FUTURE_TOLERANCE_DAYS, STALE_AFTER_DAYS, freshness } from "../src/lib/useMarketData.js";
import { todayStr } from "../src/utils/date.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// `--file` exists so the negative controls can run against fixtures without
// ever writing to the real `public/data/market.json`, which is the owner's
// daily job's output and is never this script's to touch. `--today` does the
// same for the clock: a freshness check whose only test case is "whatever day
// it happens to be" can only be proven on the day it fires.
const argv = process.argv.slice(2);
const argOf = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null;
};
const FILE = argOf("--file") ?? join(ROOT, "public/data/market.json");
const TODAY = argOf("--today") ?? todayStr();

let failures = 0;
let warnings = 0;
const fail = (msg) => { console.error(`FAIL: ${msg}`); failures++; };
const warn = (msg) => { console.error(`WARN: ${msg}`); warnings++; };
const ok = (msg) => console.log(`ok: ${msg}`);

// The day the Sectors screen flips to the unavailable state, stated as a date
// rather than as a countdown: a date is actionable, while "3 days left" stops
// being true the moment it is written down. (Both forms are COMPUTED below
// from the file's own `asOf` — this comment deliberately names no example
// date, because a comment illustrating a freshness rule with a frozen date is
// the defect the rule exists to catch.)
const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
};

let measured = "no file";

if (!existsSync(FILE)) {
  // Not the same as a stale file, and deliberately a failure: `useMarketData`
  // treats a fetch miss as "unavailable", so this ships a permanently empty
  // Sectors screen that no amount of waiting for the daily job will fill.
  fail(`${FILE} does not exist. Reference → Sectors renders the unavailable state for every learner, permanently — this is not the daily job being late. Remedy: \`npm run market\`.`);
} else {
  let data = null;
  try {
    data = JSON.parse(readFileSync(FILE, "utf8"));
  } catch (e) {
    fail(`${FILE} is not parseable JSON (${e.message}). The browser's fetch would reject the same way and the screen falls back to unavailable. Remedy: \`npm run market\`.`);
  }

  if (data) {
    const { ageDays, isStale } = freshness(data.asOf, TODAY);

    if (ageDays === null) {
      // The app cannot say anything true about this file's age, so it shows
      // nothing. Repo's fault and repo-fixable: the writer stamped a field the
      // reader cannot parse.
      fail(
        `market.json has no readable \`asOf\` (got ${JSON.stringify(data.asOf)}); ` +
          `\`freshness()\` returns ageDays=null, which the app treats as stale, so Sectors renders the ` +
          `unavailable state regardless of how current the numbers actually are. ` +
          `Expected a YYYY-MM-DD string, as written by scripts/fetch-market-data.mjs.`,
      );
      measured = `asOf=${JSON.stringify(data.asOf)} (unreadable)`;
    } else {
      measured = `asOf=${data.asOf}, today=${TODAY}, ageDays=${ageDays}`;
      const goesStale = addDays(data.asOf, STALE_AFTER_DAYS + 1);

      if (ageDays < -FUTURE_TOLERANCE_DAYS) {
        // Future-dated past what a timezone can explain. Not the job being
        // late — the two clocks disagree — so it is called by its own name
        // rather than folded into "stale", which is what the app's single
        // boolean would have done.
        warn(
          `market.json is stamped ${-ageDays} day(s) in the FUTURE (asOf=${data.asOf}, today=${TODAY}), ` +
            `beyond FUTURE_TOLERANCE_DAYS=${FUTURE_TOLERANCE_DAYS}. The app already treats this as stale and Sectors is ` +
            `showing the unavailable state now. This is a clock disagreement between the job machine and this one, ` +
            `not a late refresh.`,
        );
      } else if (isStale) {
        warn(
          `market.json is ${ageDays} days old (asOf=${data.asOf}, today=${TODAY}) against STALE_AFTER_DAYS=${STALE_AFTER_DAYS}. ` +
            `Reference → Sectors is ALREADY rendering the unavailable state — on the live site, for anyone who opens it. ` +
            `This is the owner's daily job, not dev-agent work (W-7.3): flag it, do not "fix" it in the repo.`,
        );
      } else if (ageDays === STALE_AFTER_DAYS) {
        warn(
          `market.json goes stale TOMORROW: ${ageDays} days old (asOf=${data.asOf}), and Sectors flips to the ` +
            `unavailable state on ${goesStale}. Owner's daily job. This is the warning W-6.5 and W-7.3 both ` +
            `wanted and neither had.`,
        );
      } else {
        ok(
          `market.json is ${ageDays} day(s) old (asOf=${data.asOf}) — fresh against STALE_AFTER_DAYS=${STALE_AFTER_DAYS}; ` +
            `Sectors goes to the unavailable state on ${goesStale} if the job does not run again.`,
        );
      }
    }
  }
}

console.log(`\nMEASURED market-freshness: ${measured} (thresholds read from src/lib/useMarketData.js: STALE_AFTER_DAYS=${STALE_AFTER_DAYS}, FUTURE_TOLERANCE_DAYS=${FUTURE_TOLERANCE_DAYS})`);
console.log(
  `  (Re-measured on every \`npm test\` against the real file and the real clock; nothing here is ` +
    `retyped, so there is no stale figure to guard. Quote this line with the date you ran it.)`,
);

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
