#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// LOG SIZE — the measurement W-5.3's archiving rule never had.
//
// Run via `npm test`, alongside check-data.mjs / check-blindspot.mjs /
// check-claims.mjs / check-backlog.mjs / check-payload.mjs /
// check-measurements.mjs.
//
// WHY THIS EXISTS. AGENT_LOG.md's W-5.3 rule reads, in substance: "when this
// file exceeds 600 KB, the next run archives every run-log entry older than
// <a date>". It has fired twice — 2026-08-23 and 2026-08-26 — and **on both
// days its action clause moved nothing**, because every entry older than the
// date it names had already been archived while the file kept growing past the
// trigger anyway. Both times a run discovered that by hand, mid-pass.
//
// The defect is a UNIT MISMATCH: the trigger counts bytes of the whole file,
// the action clause selects entries by date, and nothing makes those two agree.
// Backlog item 115 offered the owner two ways out and the owner picked (a),
// compressing the backlog. What (a) did not do — and what (b) as written would
// not have done either (see the note below) — is give anyone a NUMBER to look
// at. A prose threshold that no script evaluates is a threshold that gets
// noticed after it is crossed, which is precisely the observed history.
//
// So this script does not restate the rule. It measures the two quantities the
// rule is actually about, and reports each one against the remedy that can move
// it:
//
//   * the RUN LOG    — archivable. Moving whole days into AGENT_LOG.archive.md
//                      shrinks this and only this.
//   * the FLOOR      — App summary + Prioritized backlog + Environment note.
//                      W-5.3 says these are NEVER archived, so archiving cannot
//                      move this number by a single byte. Only compressing the
//                      backlog can (item 115's pass).
//
// Splitting them is the whole point. On 2026-08-26 the file was 915,262 bytes
// with a floor of ~485 KB; an archiving pass that emptied the run log entirely
// still could not get under 600 KB, and the rule had no way to say so. Two
// budgets, each naming its own remedy, can.
//
// WHY OPTION (b) IS NOT WHAT THIS IMPLEMENTS, measured 2026-08-26 (third pass).
// Item 115's option (b) is "re-point the trigger at a run-log byte count". That
// changes the TRIGGER only, and the mismatch is between the trigger and the
// ACTION CLAUSE. Worked against the real numbers: on 2026-08-26 the run log
// held 430,101 bytes, ALL of it dated 08-23 or later, with the most recent
// review boundary at 08-23 and everything before it already archived. A run-log
// trigger of 300 KB fires — and "archive entries before the most recent
// weekly-review boundary" still selects zero entries. (b) leaves the no-op
// exactly where it was. A corrected option would have to make the action clause
// byte-driven too: archive whole days, oldest first, until the run log is under
// target. That is a rule change, it is the owner's to make (item 115: "a
// dev-agent run may implement whichever the owner names; it should not
// choose"), and so this script COMPUTES that cut plan and prints it rather than
// performing it.
//
// WHY THERE IS NO FINGERPRINT, unlike check-measurements.mjs's claims. That
// mechanism exists so a number retyped into the log stays checkable across
// later commits. It would be dead weight here: every commit to this repo
// changes AGENT_LOG.md, so a log-size claim's fingerprint would be stale before
// the next run read it, and the check would report RETIRED forever — a vacuous
// green that item 116 warns is worse than no probe at all. This script instead
// re-measures live on every `npm test`, so there is no retyped number to guard.
//
// THRESHOLDS, derived rather than chosen. FILE_CEILING keeps W-5.3's original
// 600 KB, which was never the part that was wrong. The two budgets partition
// it: RUN_LOG_HARD = FILE_CEILING - FLOOR_MAX, so while both budgets hold the
// whole file cannot reach 600 KB. The warn lines sit far enough below to leave
// a run time to act rather than to discover.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOG = join(ROOT, "AGENT_LOG.md");
const ARCHIVE = join(ROOT, "AGENT_LOG.archive.md");

const FILE_CEILING = 600_000; // W-5.3's original trigger, unchanged in value.
const FLOOR_MAX = 250_000; // warn — remedy is backlog compression, NOT archiving
const RUN_LOG_HARD = FILE_CEILING - FLOOR_MAX; // 350,000 — fail
const RUN_LOG_MAX = 250_000; // warn — remedy is an archiving pass
// Everything in '## Run log' that is not under a dated entry heading: the section's own
// heading and its archive pointer. Measured at 1,599 b on 2026-08-27 and structurally flat.
// 5,000 b leaves room for that pointer to grow while still catching a single dropped entry
// (the smallest real entry seen is ~7.7 KB, which clears this by 1.5x).
const UNATTRIBUTED_MAX = 5_000;

let failures = 0;
let warnings = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failures++;
};
const warn = (msg) => {
  console.error(`WARN: ${msg}`);
  warnings++;
};
const ok = (msg) => console.log(`ok: ${msg}`);

const kb = (n) => `${n.toLocaleString("en-US")} b (${(n / 1000).toFixed(0)} KB)`;
const pct = (n, d) => `${((n / d) * 100).toFixed(1)}%`;

// ── Sectioning ────────────────────────────────────────────────────────────
// Same boundary convention as check-backlog.mjs: a section runs from its `##`
// heading to the next `##`. Deliberately shared — two scripts disagreeing about
// where the backlog ends is a defect that would show up as a byte discrepancy
// nobody could explain.
const splitSections = (text) => {
  const lines = text.split("\n");
  const heads = [];
  lines.forEach((l, i) => {
    if (/^## /.test(l)) heads.push(i);
  });
  const out = [];
  if (heads.length && heads[0] > 0) {
    out.push({ title: "(file preamble)", bytes: Buffer.byteLength(lines.slice(0, heads[0]).join("\n") + "\n") });
  }
  heads.forEach((h, k) => {
    const end = k + 1 < heads.length ? heads[k + 1] : lines.length;
    const body = lines.slice(h, end).join("\n") + (end < lines.length ? "\n" : "");
    out.push({ title: lines[h].replace(/^##\s+/, ""), bytes: Buffer.byteLength(body), start: h, end });
  });
  return out;
};

const raw = readFileSync(LOG, "utf8");
const fileBytes = Buffer.byteLength(raw);
const sections = splitSections(raw);

// ── CONTROL 1: byte accounting must be exact. ─────────────────────────────
// A section splitter that silently drops a section reports a smaller file and
// a smaller floor — i.e. it fails GREEN, in the one direction that matters. If
// the parts do not sum to the whole, every number below is wrong and no
// verdict from this script means anything.
const summed = sections.reduce((a, s) => a + s.bytes, 0);
if (summed !== fileBytes) {
  fail(
    `control 1 (byte accounting) FAILED: sections sum to ${summed} b but the file is ${fileBytes} b ` +
      `(off by ${summed - fileBytes}). The section splitter is wrong, so every figure this script ` +
      `prints is wrong. Fix splitSections() before reading anything below.`,
  );
} else {
  ok(`control 1: ${sections.length} sections sum byte-exactly to the file (${kb(fileBytes)})`);
}

// ── CONTROL 2: the two sections this script reasons about must both exist. ──
// If `## Run log` is ever renamed, the run log measures 0 bytes and the floor
// measures the whole file — a confident, wrong, and entirely plausible-looking
// answer. Naming the sections explicitly is what turns that into an error.
const runLogSection = sections.find((s) => /^Run log/.test(s.title));
const backlogSection = sections.find((s) => /^Prioritized backlog/.test(s.title));
if (!runLogSection || !backlogSection) {
  fail(
    `control 2 (sections present) FAILED: AGENT_LOG.md is missing ` +
      `${!runLogSection ? "'## Run log'" : ""}${!runLogSection && !backlogSection ? " and " : ""}` +
      `${!backlogSection ? "'## Prioritized backlog'" : ""}. The file's structure changed; this ` +
      `script cannot tell archivable bytes from floor bytes until it is updated.`,
  );
  console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
  process.exit(1);
}
ok(`control 2: both '## Run log' and '## Prioritized backlog' located`);

const runLog = runLogSection.bytes;
const floor = fileBytes - runLog;

// ── The two budgets ───────────────────────────────────────────────────────
console.log("");
for (const s of sections) {
  console.log(`  ${String(s.bytes).padStart(8)} b  ${pct(s.bytes, fileBytes).padStart(6)}  ${s.title.slice(0, 62)}`);
}
console.log("");
console.log(`  run log (archivable) ${kb(runLog)}  — budget ${kb(RUN_LOG_MAX)} warn / ${kb(RUN_LOG_HARD)} fail`);
console.log(`  floor   (never archived) ${kb(floor)}  — budget ${kb(FLOOR_MAX)} warn`);
console.log("");

// ── The cut plan: the action clause, computed instead of interpreted. ──────
// Entries are `### <date> …`. Archiving cuts on whole-day boundaries (the
// 2026-08-26 pass's convention, and the reason its integrity proof worked), so
// the unit here is a day, not an entry.
const logLines = raw.split("\n");
const days = new Map(); // date -> bytes
let currentDay = null;
for (let i = runLogSection.start; i < runLogSection.end; i++) {
  const m = /^#{2,4}\s+(\d{4}-\d{2}-\d{2})/.exec(logLines[i]);
  if (m) currentDay = m[1];
  if (currentDay) {
    days.set(currentDay, (days.get(currentDay) ?? 0) + Buffer.byteLength(logLines[i]) + 1);
  }
}

// ── CONTROL 3: dated entries must be found, and must not exceed the section. ─
// Zero days parsed is indistinguishable from "the run log is empty" unless it
// is checked. A heading-format change (`###` → `####`, or a date style) would
// otherwise produce an empty, confident, useless cut plan.
const dayBytes = [...days.values()].reduce((a, b) => a + b, 0);
if (days.size === 0) {
  fail(
    `control 3 (dated entries) FAILED: no '### <YYYY-MM-DD>' entry heading found in '## Run log', ` +
      `so the cut plan below would be empty for a parsing reason rather than a real one. Entry ` +
      `heading format changed?`,
  );
} else if (dayBytes > runLog) {
  fail(
    `control 3 (dated entries) FAILED: dated entries sum to ${dayBytes} b, more than the ` +
      `${runLog} b run-log section that contains them. The day attribution is over-counting.`,
  );
} else if (runLog - dayBytes > UNATTRIBUTED_MAX) {
  // Partial-breakage case, found by probing this script rather than by reasoning
  // about it: breaking ONE entry heading out of nine left days.size at 1, so the
  // zero-days check above stayed silent while that entry's 7,668 b quietly fell
  // out of the cut plan. The ratio moved 98.0% -> 88.4% and nothing reported it.
  //
  // The un-attributed remainder is the run log's own `## ` heading plus its
  // archive pointer. That is ~1.6 KB and does not grow with the log, so an
  // absolute threshold is the honest test — a percentage would drift with the
  // section it is measured against. Anything above UNATTRIBUTED_MAX means at
  // least one entry heading is not being parsed.
  //
  // WARN, not FAIL, and the direction is why: the budget verdicts below read
  // `runLog`, the section's own byte count, which a broken heading cannot touch.
  // Only the cut plan consumes `days`, and under-counting a day makes it propose
  // MORE days than needed or cry "impossible" too early. It errs toward alarm,
  // never toward a false all-clear — so it is worth reporting, not worth
  // failing a build over.
  warn(
    `control 3 (dated entries) is PARTIAL: ${days.size} dated day(s) account for ${kb(dayBytes)} of ` +
      `the ${kb(runLog)} run log, leaving ${kb(runLog - dayBytes)} un-attributed — over the ` +
      `${kb(UNATTRIBUTED_MAX)} expected for the section heading and archive pointer alone. At least ` +
      `one '### <YYYY-MM-DD>' entry heading is malformed, so the cut plan below is missing it and ` +
      `will over-propose. The budget verdicts are unaffected (they measure the section, not the days).`,
  );
} else {
  ok(
    `control 3: ${days.size} dated day(s) in the run log, ${kb(dayBytes)} of ${kb(runLog)} ` +
      `(${pct(dayBytes, runLog)}; the remainder is the section's own heading and archive pointer, ` +
      `${kb(runLog - dayBytes)}, under the ${kb(UNATTRIBUTED_MAX)} un-attributed ceiling)`,
  );
}

const sortedDays = [...days.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));

// Whole days, oldest first, until the run log is under target. Reported, never
// performed — see the header on why this script does not archive.
const cutPlan = (target) => {
  let remaining = runLog;
  const move = [];
  for (const [date, bytes] of sortedDays) {
    if (remaining <= target) break;
    if (move.length === sortedDays.length - 1) break; // never propose moving every day
    move.push({ date, bytes });
    remaining -= bytes;
  }
  return { move, remaining, enough: remaining <= target };
};

const report = (target, label) => {
  const { move, remaining, enough } = cutPlan(target);
  if (!move.length) return `  nothing to move: the run log is already under the ${label} budget.`;
  const list = move.map((d) => `${d.date} (${kb(d.bytes)})`).join(", ");
  if (enough) {
    return (
      `  move ${move.length} day(s) to AGENT_LOG.archive.md — ${list} — leaving ${kb(remaining)}, ` +
      `under the ${label} budget of ${kb(target)}.`
    );
  }
  const newest = sortedDays[sortedDays.length - 1];
  return (
    `  ARITHMETICALLY IMPOSSIBLE on whole-day boundaries: moving all but the newest day ` +
    `(${newest[0]}, ${kb(newest[1])}) still leaves ${kb(remaining)}, over the ${label} budget of ` +
    `${kb(target)}. The newest day alone is too large — either cut inside a day (and say so, since ` +
    `it breaks the whole-day convention the integrity proofs rest on) or accept the overage.`
  );
};

if (runLog > RUN_LOG_HARD) {
  fail(
    `AGENT_LOG.md's run log is ${kb(runLog)}, over the hard budget of ${kb(RUN_LOG_HARD)} ` +
      `(= ${kb(FILE_CEILING)} ceiling - ${kb(FLOOR_MAX)} floor budget). Archive before committing ` +
      `unrelated work — W-5.3 says that is a legitimate whole run.\n${report(RUN_LOG_MAX, "warn")}`,
  );
} else if (runLog > RUN_LOG_MAX) {
  warn(
    `AGENT_LOG.md's run log is ${kb(runLog)}, over the warn budget of ${kb(RUN_LOG_MAX)}. ` +
      `An archiving pass is due; it becomes a build failure at ${kb(RUN_LOG_HARD)}.\n` +
      `${report(RUN_LOG_MAX, "warn")}`,
  );
} else {
  ok(
    `run log ${kb(runLog)} is under the ${kb(RUN_LOG_MAX)} warn budget ` +
      `(${pct(runLog, RUN_LOG_MAX)} of it; ${sortedDays.length} day(s) live, oldest ${sortedDays[0]?.[0]})`,
  );
}

if (floor > FLOOR_MAX) {
  warn(
    `AGENT_LOG.md's non-archivable floor is ${kb(floor)}, over the budget of ${kb(FLOOR_MAX)}. ` +
      `**Archiving cannot move this number** — the App summary, the backlog and the Environment note ` +
      `are never archived (W-5.3). The remedy is a backlog compression pass; item 115 records the ` +
      `rule the 2026-08-26 pass used. This is the failure mode where a run archives everything it ` +
      `can and the file is still too big.`,
  );
} else {
  ok(
    `floor ${kb(floor)} is under the ${kb(FLOOR_MAX)} budget (${pct(floor, FLOOR_MAX)} of it; ` +
      `backlog ${kb(backlogSection.bytes)} is ${pct(backlogSection.bytes, floor)} of the floor)`,
  );
}

const archiveBytes = existsSync(ARCHIVE) ? Buffer.byteLength(readFileSync(ARCHIVE, "utf8")) : 0;
console.log(
  `\nMEASURED log-size: file ${fileBytes} b, run log ${runLog} b, floor ${floor} b ` +
    `(backlog ${backlogSection.bytes} b), archive ${archiveBytes} b, ${days.size} live day(s)`,
);
console.log(
  `  (Re-measured on every \`npm test\`; nothing here is retyped, so there is no stale figure to ` +
    `guard. Quote this line with the date you ran it.)`,
);

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
