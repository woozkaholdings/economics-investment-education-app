#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// CLAIMS.md — the LAUNCH_PLAN.md §9.1 falsifiable-claims register.
//
// §9.1 asks for three things per belief: what you believe, the number that
// would refute it, and WHEN YOU WILL CHECK. The third is the one that rots
// silently — a register with no date discipline becomes a list of opinions,
// which is precisely the drift §9.1 exists to prevent ("when a claim is
// refuted, the response is a change to the product, not a softer restatement
// of the claim").
//
// So this check enforces the shape, and warns on the dates:
//   - every claim row parses, with a unique id and no empty cells
//   - "Check" is a real ISO date, not "when analytics land" (a claim blocked
//     on something else still gets a date to review the blockage)
//   - "Measurable today" is an explicit yes/partly/no
//   - past-due claims WARN rather than fail — a check date arriving is a
//     prompt to look, not a build break. §9.3's monthly audit question 4
//     ("which claim is past its check date?") reads exactly this output.
//
// Deliberately NOT checked: whether a claim is any good, whether its
// threshold is the right number, or whether its status is honest. No script
// can verify that. See CLAIMS.md's own note on softening a threshold after
// seeing the result — that failure is invisible here and is a human duty.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "CLAIMS.md");

let failures = 0;
let warnings = 0;
const fail = (m) => (console.error(`FAIL: ${m}`), failures++);
const warn = (m) => (console.warn(`WARN: ${m}`), warnings++);

// The register's own "today". Passed in so a run is reproducible and so this
// never depends on a hardcoded date drifting stale (§2.3's standing rule).
const today = process.env.CLAIMS_TODAY ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
  fail(`CLAIMS_TODAY is "${today}", expected YYYY-MM-DD`);
  process.exit(1);
}

let text;
try {
  text = readFileSync(FILE, "utf8");
} catch {
  fail("CLAIMS.md is missing — the §9.1 register is the artifact backlog item 30 created; do not delete it");
  process.exit(1);
}

// Claim rows look like: | A1 | claim | refuted if | 2026-09-05 | No — item 18 | Open |
const ROW = /^\|\s*([A-D]\d+)\s*\|(.+)\|\s*$/;
const MEASURABLE = /^(yes|no|partly)\b/i;

const claims = [];
text.split("\n").forEach((line, i) => {
  const m = line.match(ROW);
  if (!m) return;
  const id = m[1];
  const cells = m[2].split("|").map((c) => c.trim());
  const where = `CLAIMS.md:${i + 1} (${id})`;

  if (cells.length !== 5) {
    fail(`${where}: expected 5 cells after the id (claim, refuted-if, check, measurable, status), got ${cells.length}`);
    return;
  }
  const [claim, refutedIf, check, measurable, status] = cells;

  for (const [name, value] of [["claim", claim], ["refuted-if", refutedIf], ["check", check], ["measurable", measurable], ["status", status]]) {
    if (!value.replace(/\*|_|`/g, "").trim()) fail(`${where}: "${name}" cell is empty`);
  }

  const date = check.replace(/\*|_|`/g, "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fail(
      `${where}: check date is "${date}", expected an ISO YYYY-MM-DD. ` +
        `§9.1 requires a date even when the claim is blocked — a blocked claim gets a date to review ` +
        `whether it is still blocked. "When analytics land" is how a claim goes a quarter unexamined.`,
    );
  } else if (Number.isNaN(Date.parse(date))) {
    fail(`${where}: check date "${date}" is not a real date`);
  }

  const meas = measurable.replace(/\*|_|`/g, "").trim();
  if (!MEASURABLE.test(meas)) {
    fail(`${where}: "measurable today" is "${meas}", expected it to start with yes / no / partly`);
  }

  claims.push({ id, where, date, status: status.replace(/\*/g, "").trim() });
});

if (claims.length === 0) {
  fail("CLAIMS.md contains no parseable claim rows — expected rows like `| A1 | ... |`");
}

const seen = new Map();
for (const c of claims) {
  if (seen.has(c.id)) fail(`${c.where}: duplicate claim id ${c.id} (also at ${seen.get(c.id)})`);
  seen.set(c.id, c.where);
}

// Past-due: a warning, not a failure. The point is to surface the question at
// the monthly audit, not to block a commit on an unrelated calendar date.
const due = claims.filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.date) && c.date < today);
for (const c of due) {
  warn(
    `§9.1 claim ${c.id} is past its check date (${c.date}, today ${today}) — status "${c.status}". ` +
      `Look at it, then either record the result or move the date WITH a reason. ` +
      `Moving a date silently is the soft restatement §9.1 forbids.`,
  );
}

// LAUNCH_PLAN.md §9.1 quotes this register's size in prose ("It holds all N
// claims"). A figure in one file describing the contents of another is the
// exact shape that went stale for five days in §10.4 (see check-data.mjs
// §11b) — so it fails, not warns, and the message carries the replacement
// text so the fix is a copy-paste. Deliberately NOT extended to the group
// breakdown in the same sentence: that prose describes what the groups *are*,
// which does not move when a claim is added to one of them.
{
  const PLAN = join(ROOT, "LAUNCH_PLAN.md");
  let plan = "";
  try {
    plan = readFileSync(PLAN, "utf8");
  } catch {
    fail("LAUNCH_PLAN.md is missing — §9.1 is the section this register serves");
  }
  if (plan) {
    const m = plan.match(/It holds all\s*\n?\s*(\d+)\s*claims/);
    if (!m) {
      fail(
        `LAUNCH_PLAN.md §9.1 no longer contains its "It holds all N claims" sentence. ` +
          `Restore it (N = ${claims.length}) rather than deleting the claim — a removed figure ` +
          `satisfies a checker while losing the thing it was checking.`,
      );
    } else if (Number(m[1]) !== claims.length) {
      fail(
        `LAUNCH_PLAN.md §9.1 says "It holds all ${m[1]} claims" but CLAIMS.md has ${claims.length}. ` +
          `Replace "${m[1]} claims" with "${claims.length} claims".`,
      );
    }
  }
}

// Anchored to the START of the status cell, and case-sensitive on "REFUTED".
// A loose /refuted/i substring test counts A4, whose status merely says what
// *would* follow *if* it were refuted — the register discusses refutation
// constantly, so only a status that opens by declaring it should count.
const refuted = claims.filter((c) => /^REFUTED\b/.test(c.status));
console.log(
  `  §9.1 claims register: ${claims.length} claims, ${refuted.length} refuted, ${due.length} past due (as of ${today}).`,
);

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
