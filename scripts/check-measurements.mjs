#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// MEASUREMENT CLAIMS — does AGENT_LOG.md still agree with the instrument?
//
// Run via `npm test`, alongside check-data.mjs / check-blindspot.mjs /
// check-claims.mjs / check-backlog.mjs / check-payload.mjs.
//
// WHY THIS EXISTS (backlog item 70). Every measurement in this repo reaches
// AGENT_LOG.md by being retyped by hand, and until now nothing checked the
// retyping. Item 67's run-log entry recorded the glossary jargon report going
// "56 → 55". It was really 56 → 57 — and the same entry, two paragraphs down,
// *correctly describes the two new candidates* that make it 57. The run had the
// facts and still wrote a wrong summary number.
//
// That is worse than a typo, because of what these numbers are for: a future
// run reads them to decide whether its own change worked. A wrong one doesn't
// just misinform — it teaches the next run to distrust a correct instrument, or
// to "fix" something that was never broken. Item 68's run lost real time to
// exactly that, chasing a 57 that its predecessor had written down as 55.
//
// It is also the third instance of one shape: item 55 fixed it one level up
// (LAUNCH_PLAN.md's gate answer is generated, not retyped) and item 62's F12
// flagged it one document over (DECISIONS.md's hand-written lesson ranges).
//
// HOW IT WORKS. `jargon-candidates.mjs` ends with one line built to be pasted:
//
//   MEASURED jargon glossary: 54 candidates, 14 control, 3 self-defining, 0 low-reach  [fingerprint 8e8cf29e]
//
// This script finds every such line anywhere in AGENT_LOG.md, re-runs the
// instrument for each mode cited, and compares.
//
// THE FINGERPRINT IS THE WHOLE DESIGN, and it is the answer to the objection
// item 70(b) filed against itself — that checking a quoted number is "harder
// than it sounds because the corpus moves under it". It is: a bare "54
// candidates" starts failing the moment someone adds a lesson, for a reason
// that is not a mistake, and a check that cries wolf on correct work gets
// deleted. So the instrument stamps each line with a hash of everything that
// can move its numbers — the corpus, the glossary subtraction set, and its own
// source (item 68 moved glossary 57 → 54 by changing the rule alone, with the
// content untouched). A claim is ENFORCED while its fingerprint still matches
// and RETIRED, not failed, once either side moves. Old entries age out on their
// own; nobody has to prune them.
//
// WHAT IT DOES NOT DO. It cannot check prose. "56 → 55" written in a sentence
// is still unverifiable, and this script says nothing about it — the fix for
// that is to paste the line instead of describing it. Nor does it check the
// other instruments (check-data.mjs's §-numbers, readiness figures); those are
// already generated or asserted in their own files. This covers the one report
// that is read by hand, retyped by hand, and has now been wrong twice.
// ═══════════════════════════════════════════════════════════════════════════

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOG = join(ROOT, "AGENT_LOG.md");
const INSTRUMENT = join(ROOT, "scripts", "jargon-candidates.mjs");
const MODES = ["money", "economy", "essentials", "all", "glossary"];

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failures++;
};
const ok = (msg) => console.log(`ok: ${msg}`);

// The claim shape. Leading `>`, backticks and indentation are stripped so a
// line stays checkable when it is quoted, indented under a bullet, or fenced —
// all three occur in this log, and a claim that stops being seen because of
// markdown around it is a claim that silently stops being checked.
const CLAIM =
  /^[\s>`*_-]*MEASURED\s+jargon\s+(\w+):\s+(\d+)\s+candidates,\s+(\d+)\s+control,\s+(\d+)\s+self-defining,\s+(\d+)\s+low-reach\s+\[fingerprint\s+([0-9a-f]+)\]/;

const claims = [];
readFileSync(LOG, "utf8")
  .split("\n")
  .forEach((line, i) => {
    const m = CLAIM.exec(line);
    if (!m) return;
    claims.push({
      line: i + 1,
      mode: m[1],
      numbers: { candidates: +m[2], control: +m[3], selfDefining: +m[4], lowReach: +m[5] },
      fingerprint: m[6],
    });
  });

// Re-run the instrument once per mode actually cited, and read its own line
// back. Parsing the real command's real output is the point: a checker that
// re-implemented the extraction could agree with the log while both disagreed
// with what `npm run jargon` prints.
const measured = new Map();
const measure = (mode) => {
  if (measured.has(mode)) return measured.get(mode);
  let out;
  try {
    out = execFileSync(process.execPath, [INSTRUMENT, mode], { encoding: "utf8" });
  } catch (err) {
    // Non-zero here means the instrument's OWN control failed. Its message has
    // already gone to stderr; this says why that lands in `npm test`.
    fail(
      `\`node scripts/jargon-candidates.mjs ${mode}\` exited ${err.status}. Its control failed, so ` +
        `every measurement claim about "${mode}" in AGENT_LOG.md is now unverifiable — fix the ` +
        `instrument before trusting any of them.`,
    );
    measured.set(mode, null);
    return null;
  }
  const m = CLAIM.exec(out.split("\n").find((l) => CLAIM.test(l)) ?? "");
  if (!m) {
    fail(
      `\`node scripts/jargon-candidates.mjs ${mode}\` printed no MEASURED line. AGENT_LOG.md quotes ` +
        `${claims.filter((c) => c.mode === mode).length} claim(s) for this mode that can no longer be ` +
        `checked against anything. If the line was renamed, update this script's CLAIM pattern in the ` +
        `same change.`,
    );
    measured.set(mode, null);
    return null;
  }
  const current = {
    numbers: { candidates: +m[2], control: +m[3], selfDefining: +m[4], lowReach: +m[5] },
    fingerprint: m[6],
  };
  measured.set(mode, current);
  return current;
};

let enforced = 0;
let retired = 0;
// Counted separately from `enforced` because the first draft of the summary
// below said "N enforced against a re-run and agreeing" using `enforced` alone
// — so it reported agreement in the same breath as a FAIL line saying the
// opposite. Caught by this script's own injection test, and it is the exact
// defect the item is about: a summary figure that does not follow from the
// facts printed beside it.
let disagreeing = 0;
for (const claim of claims) {
  if (!MODES.includes(claim.mode)) {
    // A claim naming a mode that does not exist could never match a fingerprint,
    // so it would live forever in the retired pile looking checked.
    fail(
      `AGENT_LOG.md:${claim.line}: measurement claim names mode "${claim.mode}", which ` +
        `\`npm run jargon\` does not accept (${MODES.join(", ")}). A claim in an unrunnable mode is ` +
        `never checkable — fix the mode name or delete the line.`,
    );
    continue;
  }
  const current = measure(claim.mode);
  if (!current) continue;
  if (current.fingerprint !== claim.fingerprint) {
    retired++;
    continue;
  }
  enforced++;
  const wrong = Object.keys(claim.numbers).filter((k) => claim.numbers[k] !== current.numbers[k]);
  if (wrong.length) {
    disagreeing++;
    fail(
      `AGENT_LOG.md:${claim.line}: this measurement claim does not reproduce, and its fingerprint ` +
        `(${claim.fingerprint}) says neither the content nor the instrument has changed since it was ` +
        `written — so the number was mistyped, not outdated. Disagrees on: ` +
        `${wrong.map((k) => `${k} (log ${claim.numbers[k]}, actual ${current.numbers[k]})`).join("; ")}. ` +
        `Re-run \`npm run jargon -- ${claim.mode}\` and paste its MEASURED line verbatim.`,
    );
  }
}

// Said out loud rather than passing quietly. This check's reassuring answer and
// its vacuous answer look identical from the outside — the same failure mode
// the jargon script's own CONTROL exists to prevent — so the counts are always
// printed, including the zero.
if (!claims.length) {
  ok(
    `AGENT_LOG.md quotes no MEASURED lines yet — nothing to verify. This check only has teeth once a ` +
      `run pastes one (see \`npm run jargon\`'s last line).`,
  );
} else {
  ok(
    `${claims.length} measurement claim(s) in AGENT_LOG.md: ${enforced - disagreeing} enforced against ` +
      `a re-run and agreeing, ${disagreeing} enforced and DISAGREEING (see above), ${retired} retired ` +
      `(the corpus or the instrument moved since they were written).`,
  );
  if (!enforced) {
    ok(
      `  note: 0 enforced. Every quoted claim predates the current content/instrument, so this run ` +
        `proved nothing about them — that is expected after a content change, not a pass.`,
    );
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
