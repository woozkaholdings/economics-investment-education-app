#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// refresh-readiness.mjs — the catalogue figures LAUNCH_READINESS.md states,
// computed rather than copied (backlog item 47, filed by item 39's scoping).
//
// WHY THIS EXISTS. LAUNCH_READINESS.md's "How to refresh" section used to
// carry two `node -e '…'` snippets: code stored in prose. Nothing imported
// them, nothing ran them, and they rotted twice — once for three days after
// item 25 split lesson content per track, once for a few hours after item 45
// split it per language. Both times the snippets named a file that no longer
// existed and would have thrown ERR_MODULE_NOT_FOUND, while the figures
// printed *beside* them stayed correct. That is the shape of this project's
// recurring failure and it is worth stating plainly: the number was right and
// the method had rotted. Item 46's §26 check now catches a dead path inside
// such a snippet; this script removes the snippet instead, which kills the
// class rather than guarding it. A figure that is derived cannot go stale,
// and a procedure that runs on every `npm test` cannot name a missing file.
//
// THREE MODES, the `gofmt` shape:
//   (no args)   print the figures — what the deleted snippets did.
//   --check     compare them against what LAUNCH_READINESS.md states, and
//               exit 1 on disagreement. Chained into `npm test`.
//   --write     rewrite those figures in the document in place.
//
// `--write` is not a convenience; it is what makes `--check` survivable.
// check-data.mjs §11b deliberately declined to guard character counts,
// reasoning that "a build that fails over 19 characters would be turned off
// within a week." That objection is correct about a hand-maintained figure
// and does not apply to a generated one: the fix here is one command, not a
// re-derivation, so the gate costs a run nothing to satisfy.
//
// SCOPE — deliberately two sentences. The §4.3 catalogue row and §10.4's
// char/ratio sentence are the document's only *live* catalogue figures: they
// must equal the content as it is today. The other ~119 measurement-shaped
// numbers in the four documents are history ("dropped to 93% earlier that
// day", "fell by exactly 19 characters") and must never change. No parser
// separates the two — see item 39's scoping — so the split is made by hand,
// here, and kept small.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC = "LAUNCH_READINESS.md";
const DOC_PATH = join(ROOT, DOC);
const LANGS = ["en", "es", "ko", "zh", "ja"];

const mode = process.argv[2] ?? "";
if (!["", "--check", "--write"].includes(mode)) {
  console.error(`usage: node scripts/refresh-readiness.mjs [--check|--write]`);
  process.exit(2);
}

// ───────────────────────────────────────────────────────────────────────────
// Measure. `lessons.js` holds id/track/minutes/title/subtitle; body text lives
// in the ten `lessonContent.<track>.<lang>.js` files, and `lessonContent.js`
// is their node-only merged view — the one source that can see every language
// at once, which is what a volume measurement needs. Both paths are real
// imports, so a future split breaks this loudly instead of silently.
const [{ lessons }, { lessonContent }] = await Promise.all([
  import("../src/content/lessons.js"),
  import("../src/content/lessonContent.js"),
]);

const chars = Object.fromEntries(LANGS.map((l) => [l, 0]));
const tracks = {};
let minutes = 0;

for (const lesson of lessons) {
  minutes += lesson.minutes || 0;
  tracks[lesson.track] = (tracks[lesson.track] || 0) + 1;
  const content = lessonContent[lesson.id];
  for (const lang of LANGS) {
    chars[lang] += (content?.takeaway?.[lang] || "").length;
    chars[lang] += (content?.thinkAbout?.[lang] || "").length;
    for (const section of content?.sections || []) {
      chars[lang] += (section.body?.[lang] || "").length;
    }
  }
}

// Floors, before anything is printed or written. A generate-and-diff guard is
// only as trustworthy as its generator: if an import silently yielded nothing,
// `--write` would helpfully rewrite the scorecard to read "0 lessons / 0
// English chars" and `--check` would then agree with it forever. Fail on the
// computation, not on the document.
const floors = [
  [lessons.length >= 20, `lesson count ${lessons.length} (expect ≥20)`],
  [minutes >= 50, `minutes ${minutes} (expect ≥50)`],
  [chars.en >= 50_000, `English chars ${chars.en} (expect ≥50,000)`],
  ...LANGS.slice(1).map((l) => [chars[l] > 0, `${l} chars ${chars[l]} (expect >0)`]),
  [Object.keys(tracks).length === 2, `${Object.keys(tracks).length} tracks (expect 2)`],
];
const broken = floors.filter(([ok]) => !ok).map(([, why]) => why);
if (broken.length) {
  console.error(
    `refresh-readiness: the measurement itself looks wrong, so nothing was compared or written:\n` +
      broken.map((b) => `  - ${b}`).join("\n") +
      `\nCheck that src/content/lessons.js and src/content/lessonContent.js still export what this ` +
      `script reads before touching ${DOC}.`,
  );
  process.exit(1);
}

// Deterministic, locale-independent thousands separators — the document's own
// format. `toLocaleString` would make this output depend on the runtime's ICU.
const n = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const ratio = (lang) => (chars[lang] / chars.en).toFixed(3);

// ───────────────────────────────────────────────────────────────────────────
// The two live figures, as the document states them. Each is a `shape` that
// locates the sentence and an `expected` string that must equal it.
//
// The shape must match even when the numbers are wrong — that is the whole
// mechanism — and a *missing* shape is a failure, not a pass. §11b's note
// applies here too: a check that can be satisfied by deleting the sentence it
// checks is not a check.
const FIGURES = [
  {
    label: "§4.3 catalogue row",
    shape:
      /\*\*\d[\d,]* lessons \/ \d[\d,]* English chars \/ \d[\d,]* min\*\* — split across \*\*money \(\d+\)\*\* \+ \*\*economy \(\d+\)\*\* tracks/g,
    expected:
      `**${n(lessons.length)} lessons / ${n(chars.en)} English chars / ${n(minutes)} min** — ` +
      `split across **money (${tracks.money})** + **economy (${tracks.economy})** tracks`,
  },
  {
    label: "§10.4 translation-volume sentence",
    shape:
      /\*\*es \d[\d,]* chars \([\d.]+x of English's \d[\d,]*\), ko \d[\d,]* \([\d.]+x\), zh \d[\d,]* \([\d.]+x\), ja \d[\d,]* \([\d.]+x\)\*\*/g,
    expected:
      `**es ${n(chars.es)} chars (${ratio("es")}x of English's ${n(chars.en)}), ` +
      `ko ${n(chars.ko)} (${ratio("ko")}x), zh ${n(chars.zh)} (${ratio("zh")}x), ` +
      `ja ${n(chars.ja)} (${ratio("ja")}x)**`,
  },
];

if (mode === "") {
  console.log(`${lessons.length} lessons, ${chars.en} en chars, ${minutes} minutes`);
  console.log(`tracks: ${Object.entries(tracks).map(([t, c]) => `${t} ${c}`).join(", ")}`);
  console.log(
    `chars: ${LANGS.map((l) => `${l} ${chars[l]}${l === "en" ? "" : ` (${ratio(l)}x)`}`).join(", ")}`,
  );
  console.log(`\nAs ${DOC} states them:`);
  for (const f of FIGURES) console.log(`  ${f.label}: ${f.expected}`);
  console.log(`\nRun with --write to put these into ${DOC}, or --check to compare.`);
  process.exit(0);
}

// ───────────────────────────────────────────────────────────────────────────
// Compare, and for --write, replace.
let doc = readFileSync(DOC_PATH, "utf8");
let failures = 0;
let written = 0;

for (const { label, shape, expected } of FIGURES) {
  const found = doc.match(shape);

  if (!found) {
    failures++;
    console.error(
      `FAIL ${DOC} ${label}: the sentence this guard reads is not in the file at all.\n` +
        `  expected shape: ${shape.source}\n` +
        `  This is a failure and not a pass on purpose: a generated figure that has been reworded, ` +
        `moved or deleted is exactly the state the guard exists to catch. Restore the sentence — the ` +
        `text it should contain is:\n    ${expected}`,
    );
    continue;
  }

  if (found.length > 1) {
    // A second copy of a derived figure is a second thing that can rot, which
    // is the defect this item removes rather than guards.
    failures++;
    console.error(
      `FAIL ${DOC} ${label}: stated ${found.length} times. A derived figure belongs in exactly one ` +
        `place; delete the duplicates.\n  ${found.join("\n  ")}`,
    );
    continue;
  }

  if (found[0] === expected) continue;

  if (mode === "--write") {
    doc = doc.replace(shape, expected);
    written++;
    console.log(`updated ${DOC} ${label}:\n  was: ${found[0]}\n  now: ${expected}`);
    continue;
  }

  failures++;
  console.error(
    `FAIL ${DOC} ${label} disagrees with the live content.\n` +
      `  it says:   ${found[0]}\n` +
      `  should be: ${expected}\n` +
      `  Fix with:  npm run readiness -- --write`,
  );
}

if (mode === "--write") {
  if (written) writeFileSync(DOC_PATH, doc);
  else console.log(`${DOC} already matches the live content — nothing to write.`);
  process.exit(failures === 0 ? 0 : 1);
}

if (failures === 0) {
  console.log(
    `  readiness figures: ${lessons.length} lessons / ${n(chars.en)} en chars / ${minutes} min, ` +
      `${FIGURES.length} generated figures in ${DOC} agree with the content.`,
  );
}
process.exit(failures === 0 ? 0 : 1);
