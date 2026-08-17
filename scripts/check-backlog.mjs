#!/usr/bin/env node
// Integrity checks for AGENT_LOG.md's "Prioritized backlog" section. Run via
// `npm test`, alongside check-data.mjs / check-blindspot.mjs / check-claims.mjs.
//
// WHY THIS EXISTS. On 2026-08-16 two different items were both numbered 34 —
// the `<ol>`/`<ul>` accessibility item and the "Be the Fed Chair" policy
// simulator. Nothing noticed for five hours. Runs started disambiguating in
// prose ("backlog item 34 (the feature one)", "the a11y item 34, not this
// one"), which is the tell that a human had already absorbed the cost.
//
// It matters more than a numbering nit because of what the backlog now is: the
// 2026-08-16 weekly review's W-2 made it the mechanism that decides what gets
// built ("pick from here, not from the previous run's note"). Two items sharing
// an id is precisely how a run picks the wrong one — and the same day's item-33
// saga showed how expensive a stale numeric pointer gets once code cites it.
//
// So this checks the two properties that keep numeric references trustworthy:
//   1. no two backlog items share a number;
//   2. every "backlog item N" cited from source code resolves to a real item.
//
// Deliberately NOT checked: gaps in the sequence. Items get pruned to
// "Completed and pruned" all the time and a missing number is normal.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOG = join(ROOT, "AGENT_LOG.md");

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failures++;
};
const ok = (msg) => console.log(`ok: ${msg}`);

const log = readFileSync(LOG, "utf8");
const lines = log.split("\n");

// The backlog runs from its heading to the next top-level heading. Bounding it
// this way matters: the run log below is full of prose like "item 34" and of
// numbered lists that are not backlog items.
const start = lines.findIndex((l) => /^## Prioritized backlog/.test(l));
const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
if (start === -1 || end === -1) {
  fail("AGENT_LOG.md: could not locate the '## Prioritized backlog' section — has the file's structure changed?");
} else {
  const section = lines.slice(start, end);

  // 1. Duplicate item numbers.
  const seen = new Map(); // number -> [line numbers, absolute in the file]
  section.forEach((l, i) => {
    const m = /^(\d+)\.\s+\*\*/.exec(l);
    if (!m) return;
    const n = Number(m[1]);
    if (!seen.has(n)) seen.set(n, []);
    seen.get(n).push(start + i + 1);
  });

  let dupes = 0;
  for (const [n, at] of [...seen.entries()].sort((a, b) => a[0] - b[0])) {
    if (at.length < 2) continue;
    dupes++;
    fail(
      `AGENT_LOG.md: backlog item ${n} is defined ${at.length} times (lines ${at.join(", ")}). ` +
        `Two items sharing a number is how a run picks the wrong one, and how a code comment citing ` +
        `"backlog item ${n}" becomes ambiguous. Renumber the one with the SMALLER blast radius — the ` +
        `one whose number is cited from fewer places — to the next unused number, and leave a note in ` +
        `both items saying which is which (see items 34 and 40 for the worked example).`,
    );
  }
  if (!dupes) ok(`no duplicate backlog item numbers (${seen.size} items)`);

  // 2. Every "backlog item N" cited from code resolves to a real item.
  //    The 2026-08-14 renumbering shipped stale numeric pointers for two days;
  //    a citation to a renumbered item is the same failure in a different file.
  //
  //    A completed item is NOT a dangling reference. Items move to "Completed
  //    and pruned" as `(former item N)` and code that still cites them is
  //    correct — `lessonContent.money.js` citing item 25 is a true statement
  //    about why the file exists. So the known set is open items PLUS every
  //    number the pruned section accounts for. That distinction is the whole
  //    value of the check: a number nobody can account for is the bug, and a
  //    number with a documented afterlife is not.
  const known = new Set(seen.keys());
  for (const m of log.matchAll(/former item (\d+)/gi)) known.add(Number(m[1]));
  const walk = (dir) =>
    existsSync(dir)
      ? readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
          const p = join(dir, e.name);
          if (e.isDirectory()) return walk(p);
          return /\.(js|jsx|mjs)$/.test(e.name) ? [p] : [];
        })
      : [];

  const files = [...walk(join(ROOT, "src")), ...walk(join(ROOT, "scripts"))];
  let cited = 0;
  let dangling = 0;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/backlog\s+item\s+(\d+)/gi)) {
      cited++;
      const n = Number(m[1]);
      if (known.has(n)) continue;
      dangling++;
      const lineNo = text.slice(0, m.index).split("\n").length;
      fail(
        `${relative(ROOT, file)}:${lineNo}: cites "backlog item ${n}", which is not an item in ` +
          `AGENT_LOG.md's backlog. Either it was renumbered (update this citation) or pruned to ` +
          `"Completed and pruned" (cite the run log instead, or drop the number).`,
      );
    }
  }
  if (!dangling) ok(`all ${cited} "backlog item N" citations in src/ and scripts/ resolve`);
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
