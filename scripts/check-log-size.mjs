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
// WHY A LEVEL IS NOT ENOUGH, added 2026-08-28. Everything above measures where
// the file IS. That is what both remedies are priced against, and it is not the
// quantity that decides whether either remedy works. Measured over the sixteen
// commits after item 122’s compression pass: the floor grew by a mean of
// +3,705 b per commit, only ONE of fifteen intervals was net-negative, and the
// pass itself bought 26,939 b — about 7.3 runs. A remedy that buys seven runs
// against a leak of one run per run is a bailing bucket, and no LEVEL reading can
// say so: "floor at 99.6% of budget" reads as *nearly there*, while the same
// state expressed as rate reads as *the next commit crosses it*. So this script
// also measures the RATE, and divides the headroom by it. That number — runs of
// headroom — is the one a run can act on.
//
// The rate is read from git history, which introduces the one failure mode this
// block is shaped around: if the git read fails, a naive implementation reports a
// delta of ZERO, which is indistinguishable from a run that spent nothing. That
// is item 108’s "a proxy fails green" exactly. Every git read here is therefore
// controlled — the sample must be non-empty, each historical parse must satisfy
// the same byte-accounting control 1 applies to the live file, and the sampled
// floors must not be all-identical (a constant would render as flawless
// discipline). If any control does not hold, the block reports UNAVAILABLE and
// says which one, rather than printing a comfortable number.
//
// THRESHOLDS, derived rather than chosen. FILE_CEILING keeps W-5.3's original
// 600 KB, which was never the part that was wrong. The two budgets partition
// it: RUN_LOG_HARD = FILE_CEILING - FLOOR_MAX, so while both budgets hold the
// whole file cannot reach 600 KB. The warn lines sit far enough below to leave
// a run time to act rather than to discover.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
// Commits touching AGENT_LOG.md to sample for the growth rate. 16 spans roughly
// two days at the 2026-08 cadence — long enough that one unusually large or
// small entry cannot set the mean, short enough that it reflects how runs write
// NOW rather than how they wrote before the last compression pass.
const HISTORY_SAMPLE = 16;

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

// Reduce a whole AGENT_LOG.md to the numbers the budgets are about. Shared by
// the live file and by every historical revision the rate block reads, so a
// change to the sectioning convention can never make "then" and "now" mean two
// different things — which is the failure that would make a rate silently wrong
// rather than loudly absent.
const measureText = (text) => {
  const bytes = Buffer.byteLength(text);
  const secs = splitSections(text);
  const rl = secs.find((s) => /^Run log/.test(s.title));
  const bl = secs.find((s) => /^Prioritized backlog/.test(s.title));
  return {
    bytes,
    exact: secs.reduce((a, s) => a + s.bytes, 0) === bytes,
    runLog: rl ? rl.bytes : null,
    backlog: bl ? bl.bytes : null,
    floor: rl ? bytes - rl.bytes : null,
  };
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
//
// A DAY IS NOT NECESSARILY ONE REGION, and that is why the primitive below is a
// region rather than a date. Item 142, measured while executing this script's
// own plan on 2026-08-29: the plan correctly said `move 2 day(s) — 2026-08-26
// (77,928 b), 2026-08-27 (121,136 b)`, and 2026-08-27 was TWO blocks — entry
// headings at lines 4746–5112 and 6182–7237 of that revision, 1,070 lines apart
// — because the log changed direction mid-day (appended below before `eb3c11a`,
// prepended above after). A `Map<date, bytes>` accumulated by scanning lines is
// position-blind, so both figures were right and the plan still could not say
// that one of its two days was in two pieces. A run following it literally
// either cuts the day as one region (splitting it) or concatenates the blocks in
// file order (writing the archive 08-27, 08-26, 08-27, breaking the ascending
// order the archive's own header promises). Both were avoided by hand that day.
//
// So: scan into REGIONS, derive days by summing them, and make the plan say when
// a day it proposes moving is not contiguous. Same bytes, same cut, one more
// fact — the one a run under budget pressure is least likely to check for itself.
const logLines = raw.split("\n");

// Maximal runs of consecutive lines sharing a date, in file order. Byte
// attribution is line-for-line identical to the Map-based scan this replaced
// (every line from the first dated heading onward belongs to the date most
// recently seen), so day totals are unchanged by construction — see control 4.
const splitRegions = (lines, from, to) => {
  const out = [];
  let currentDay = null;
  for (let i = from; i < to; i++) {
    const m = /^#{2,4}\s+(\d{4}-\d{2}-\d{2})/.exec(lines[i]);
    if (m) currentDay = m[1];
    if (!currentDay) continue;
    const last = out[out.length - 1];
    if (last && last.date === currentDay) {
      last.bytes += Buffer.byteLength(lines[i]) + 1;
      last.lastLine = i;
    } else {
      out.push({ date: currentDay, bytes: Buffer.byteLength(lines[i]) + 1, firstLine: i, lastLine: i });
    }
  }
  return out;
};

const regions = splitRegions(logLines, runLogSection.start, runLogSection.end);
const days = new Map(); // date -> bytes
const dayRegions = new Map(); // date -> region[]
for (const r of regions) {
  days.set(r.date, (days.get(r.date) ?? 0) + r.bytes);
  dayRegions.set(r.date, [...(dayRegions.get(r.date) ?? []), r]);
}

// ── CONTROL 4: the region splitter must actually be able to see a split day. ─
// The live file today has one region per day, so running the splitter on it
// proves only that it does not hallucinate a split — a negative fixture. Without
// a positive one, a splitter that returned "one region per date" unconditionally
// would look exactly this green, and the item this control exists for would be
// undetectable by the code written to detect it. Two in-memory fixtures, same
// entries, differing only in ORDER: interleaved must read 2 regions for the
// split date, contiguous must read 1. Both are asserted, because either half
// passing alone is compatible with a broken splitter.
{
  const entry = (d, n) => [`### ${d} entry ${n}`, `body ${n}`];
  const fx = (rows) => rows.flat();
  const interleaved = fx([entry("2026-08-27", 1), entry("2026-08-26", 2), entry("2026-08-27", 3)]);
  const contiguous = fx([entry("2026-08-27", 1), entry("2026-08-27", 3), entry("2026-08-26", 2)]);
  const seen = (lines, date) => splitRegions(lines, 0, lines.length).filter((r) => r.date === date).length;
  const pos = seen(interleaved, "2026-08-27");
  const neg = seen(contiguous, "2026-08-27");
  const bytesOf = (lines) => {
    const rs = splitRegions(lines, 0, lines.length);
    return rs.filter((r) => r.date === "2026-08-27").reduce((a, r) => a + r.bytes, 0);
  };
  if (pos !== 2 || neg !== 1) {
    fail(
      `control 4 (region splitter) FAILED: a date interleaved with another read as ${pos} region(s) ` +
        `(expected 2) and the same entries written contiguously read as ${neg} (expected 1). The ` +
        `multi-region warning below cannot fire, so its silence means nothing.`,
    );
  } else if (bytesOf(interleaved) !== bytesOf(contiguous)) {
    // The byte-attribution half: splitting a day into regions must not change
    // what the day WEIGHS, or the cut plan's arithmetic silently moves with it.
    fail(
      `control 4 (region splitter) FAILED: the same entries total ${bytesOf(interleaved)} b split ` +
        `and ${bytesOf(contiguous)} b contiguous. Region bytes do not sum back to the day.`,
    );
  } else {
    ok(
      `control 4: the region splitter reads an interleaved date as 2 regions and the same entries ` +
        `contiguous as 1, at an identical ${bytesOf(interleaved)} b — it can see a split day, and ` +
        `splitting one does not change its weight`,
    );
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
  const split = [...dayRegions.entries()].filter(([, rs]) => rs.length > 1);
  ok(
    `control 3: ${days.size} dated day(s) in ${regions.length} region(s) in the run log, ` +
      `${kb(dayBytes)} of ${kb(runLog)} ` +
      `(${pct(dayBytes, runLog)}; the remainder is the section's own heading and archive pointer, ` +
      `${kb(runLog - dayBytes)}, under the ${kb(UNATTRIBUTED_MAX)} un-attributed ceiling)` +
      (split.length
        ? ` — ${split.length} day(s) NOT contiguous: ${split.map(([d, rs]) => `${d} in ${rs.length} pieces`).join(", ")}`
        : ` — every day is contiguous`),
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

// The structural half of the plan: which of the proposed days are in more than
// one piece, and where those pieces are. A byte-correct plan can still be
// structurally wrong to execute (item 142), and this is the sentence that says
// so — printed only alongside a real proposal, because a permanent decoration
// for a hazard nobody is about to hit is how a warning stops being read.
const contiguityNote = (move) => {
  const split = move.map((d) => [d.date, dayRegions.get(d.date) ?? []]).filter(([, rs]) => rs.length > 1);
  if (!split.length) return `\n  Contiguity: all ${move.length} proposed day(s) are single regions — cut and concatenate in file order.`;
  const detail = split
    .map(([d, rs]) => `${d} in ${rs.length} pieces (lines ${rs.map((r) => `${r.firstLine + 1}-${r.lastLine + 1}`).join(", ")})`)
    .join("; ");
  return (
    `\n  ⚠️ NOT CONTIGUOUS — ${detail}. The byte figures above are still right; the CUT is not ` +
    `obvious. Taking such a day as one region splits it, and concatenating the proposed regions in ` +
    `file order can write the archive out of date order. Move every piece, and order the archive by ` +
    `the entries' own dates, not by their position in this file.`
  );
};

const report = (target, label) => {
  const { move, remaining, enough } = cutPlan(target);
  if (!move.length) return `  nothing to move: the run log is already under the ${label} budget.`;
  const list = move.map((d) => `${d.date} (${kb(d.bytes)})`).join(", ");
  if (enough) {
    return (
      `  move ${move.length} day(s) to AGENT_LOG.archive.md — ${list} — leaving ${kb(remaining)}, ` +
      `under the ${label} budget of ${kb(target)}.` + contiguityNote(move)
    );
  }
  const newest = sortedDays[sortedDays.length - 1];
  return (
    `  ARITHMETICALLY IMPOSSIBLE on whole-day boundaries: moving all but the newest day ` +
    `(${newest[0]}, ${kb(newest[1])}) still leaves ${kb(remaining)}, over the ${label} budget of ` +
    `${kb(target)}. The newest day alone is too large — either cut inside a day (and say so, since ` +
    `it breaks the whole-day convention the integrity proofs rest on) or accept the overage.` +
    contiguityNote(move)
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

// ── The RATE, and the headroom expressed in runs. ─────────────────────────
// Read from git history rather than from anything retyped into the log, for the
// same reason this script has no fingerprint: a rate written down is stale one
// commit later.
const git = (args) =>
  execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });

const rate = (() => {
  let revs;
  try {
    revs = git(["log", "--format=%H", `-${HISTORY_SAMPLE}`, "--", "AGENT_LOG.md"]).trim().split("\n").filter(Boolean);
  } catch {
    return { ok: false, why: "`git log` failed — not a git checkout, or git is unavailable here" };
  }
  // CONTROL A: a sample of one yields no interval, and an empty sample yields a
  // mean of zero — which prints as "this log is not growing", the most
  // comfortable possible wrong answer.
  if (revs.length < 3) {
    return { ok: false, why: `only ${revs.length} commit(s) touch AGENT_LOG.md; 3+ are needed before a rate means anything` };
  }
  const samples = [];
  for (const rev of revs) {
    let blob;
    try {
      blob = git(["show", `${rev}:AGENT_LOG.md`]);
    } catch {
      return { ok: false, why: `\`git show ${rev.slice(0, 7)}:AGENT_LOG.md\` failed` };
    }
    const m = measureText(blob);
    // CONTROL B: control 1's byte-accounting property, applied to every
    // historical revision. A revision whose sections do not sum to its own file
    // has been mis-parsed, and a mis-parsed "then" produces a confident delta.
    if (!m.exact) return { ok: false, why: `byte accounting does not hold at ${rev.slice(0, 7)} — that revision is mis-parsed` };
    if (m.runLog === null || m.backlog === null) {
      return { ok: false, why: `'## Run log' or '## Prioritized backlog' is absent at ${rev.slice(0, 7)}, so its floor is not comparable` };
    }
    samples.push({ rev, ...m });
  }
  samples.reverse(); // oldest first
  // CONTROL C: identical floors across every revision would render as perfect
  // discipline. In practice it means the history read returned the same blob
  // each time — a broken read that fails green.
  if (new Set(samples.map((s) => s.floor)).size === 1) {
    return { ok: false, why: "every sampled revision reports an identical floor — the history read is not varying, and 'no growth' here would be an artifact" };
  }
  const deltas = { floor: [], runLog: [] };
  for (let i = 1; i < samples.length; i++) {
    deltas.floor.push(samples[i].floor - samples[i - 1].floor);
    deltas.runLog.push(samples[i].runLog - samples[i - 1].runLog);
  }
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const head = samples[samples.length - 1];
  return {
    ok: true,
    n: deltas.floor.length,
    oldest: samples[0].rev.slice(0, 7),
    floorMean: mean(deltas.floor),
    floorMin: Math.min(...deltas.floor),
    floorMax: Math.max(...deltas.floor),
    floorNeg: deltas.floor.filter((d) => d < 0).length,
    runLogMean: mean(deltas.runLog),
    // What the working tree has added on top of the newest commit: this run's
    // own spend, which is the only part the run reading this can still change.
    uncommittedFloor: floor - head.floor,
    uncommittedRunLog: runLog - head.runLog,
  };
})();

console.log("");
if (!rate.ok) {
  // Reported, not silently skipped — see the header. An absent rate is a known
  // unknown; a zero would be a false all-clear.
  console.log(`  growth rate: UNAVAILABLE — ${rate.why}.`);
  console.log(`  (The budget verdicts above are unaffected; they measure levels, which need no history.)`);
} else {
  const runsLeft = (headroom, perRun) => (perRun <= 0 ? Infinity : headroom / perRun);
  const floorRuns = runsLeft(FLOOR_MAX - floor, rate.floorMean);
  const runLogRuns = runsLeft(RUN_LOG_MAX - runLog, rate.runLogMean);
  const sgn = (n) => `${n >= 0 ? "+" : "-"}${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
  // Two decimals below 2 runs: rounding 0.96 to "1.0" directly under a warning
  // that says "less than ONE run" reads as a contradiction in the instrument.
  const show = (r) => (r === Infinity ? "no growth at the sampled rate" : `${r.toFixed(r < 2 ? 2 : 1)} run(s)`);
  console.log(`  growth rate over the last ${rate.n} interval(s) (from ${rate.oldest}):`);
  console.log(
    `    floor    ${sgn(rate.floorMean)} b/commit mean ` +
      `(min ${sgn(rate.floorMin)}, max ${sgn(rate.floorMax)}; ${rate.floorNeg} of ${rate.n} net-negative)`,
  );
  console.log(
    `    run log  ${sgn(rate.runLogMean)} b/commit mean`,
  );
  // Over budget, "headroom 0 b = -0.67 run(s)" is incoherent — a clamped numerator
  // beside an unclamped ratio. Past the line the useful quantity is the overage and
  // how much writing has to come back out, so say that instead.
  const headroomPhrase = (left, budget, level, runs) =>
    level > budget
      ? `OVER by ${kb(level - budget)} (${show(-runs)} of writing to come back out)`
      : `${kb(left)} = ${show(runs)}`;
  console.log(
    `    headroom floor ${headroomPhrase(FLOOR_MAX - floor, FLOOR_MAX, floor, floorRuns)}; ` +
      `run log ${headroomPhrase(RUN_LOG_MAX - runLog, RUN_LOG_MAX, runLog, runLogRuns)}`,
  );
  console.log(
    `    this working tree, on top of HEAD: floor ${sgn(rate.uncommittedFloor)} b, run log ${sgn(rate.uncommittedRunLog)} b`,
  );

  // The signal a LEVEL cannot give: crossing is one commit away. This warns
  // BEFORE the budget verdict above does, which is the entire reason the rate is
  // measured. It clears the moment a compression or archiving pass lands, so it
  // is a condition to act on rather than a permanent decoration.
  for (const [name, left, over, remedy] of [
    ["floor", floorRuns, floor > FLOOR_MAX, "a backlog compression pass (archiving cannot move the floor)"],
    ["run log", runLogRuns, runLog > RUN_LOG_MAX, "an archiving pass"],
  ]) {
    if (!over && left < 1) {
      warn(
        `the ${name} is under its budget by less than ONE run's worth of writing (${show(left)} left at ` +
          `${sgn(name === "floor" ? rate.floorMean : rate.runLogMean)} b/commit). ` +
          `The level above still reads green and will not once this run commits. Remedy: ${remedy}.`,
      );
    }
  }
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
