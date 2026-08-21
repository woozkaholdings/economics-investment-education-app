#!/usr/bin/env node
// Translation completeness — how much of each lesson's English body actually
// exists in es/ko/zh/ja.
//
// WHY THIS EXISTS. `check-data.mjs`'s five-language parity checks assert that
// every translated field is *present and non-empty*. Nothing asserted that a
// field carries the same content. It doesn't: most of the catalogue ships
// es/ko/zh/ja bodies that are condensed summaries of the English rather than
// translations of it — economy lesson 40's Spanish §1 is three bare rule
// headings against four explanatory English paragraphs, and its ratio is 0.24
// where a full translation in this corpus runs ~1.11.
//
// This was not unknown, and this header does not claim it was.
// `LAUNCH_READINESS.md` §10.4 has published the aggregate ratios since
// 2026-08-09 (es 0.723x, ko 0.356x, zh 0.226x, ja 0.312x); `DECISIONS.md`
// calls them "the condensed es/ko/zh/ja bodies" in passing. What was missing
// is what those numbers mean. Against nothing, es 0.723x reads as Spanish
// being a bit more compact than English; against this corpus's own fully
// translated lessons at 1.12x, it means a third of the content is absent.
// That is why `reference` below exists, why the ratios are per lesson rather
// than one aggregate per language (the shortfall is concentrated, not spread),
// and why the review ledger could read 100%/0-stale throughout — it records
// that a reviewer saw the text, not that the text is all there.
// See AGENT_LOG.md backlog item 93.
//
// HOW THE DEBT ACCUMULATED, which is what the guard below is shaped against:
// seventeen consecutive "Deepen lesson N" runs in 2026-08 added English
// sections without touching the four translations. Each individual run left
// the suite green. Nothing measured the widening gap.
//
// THE METRIC. Per lesson, per language: translated characters / English
// characters, over exactly the field set `translation-review.mjs`'s
// `englishSourceHash` covers (every section heading and body, plus takeaway
// and thinkAbout) — the same fields the review ledger fingerprints, so the two
// instruments describe the same surface.
//
// Characters, not words, because zh/ja have no spaces to tokenize on; item 76
// is still blocked on a per-language tokenizer. The obvious objection to
// characters is that a faithful Chinese translation is legitimately ~3x
// shorter than its English source, so a raw ratio means nothing across
// languages — which is why nothing here compares a ratio to a fixed constant.
// Every judgment is made against OTHER LESSONS IN THE SAME LANGUAGE (see
// `classify`), and the enforced check compares a lesson only to its own
// recorded past (see `drift`).
//
// Usage:
//   node scripts/translation-completeness.mjs            Print the report.
//   node scripts/translation-completeness.mjs --write    Regenerate the baseline.
//   node scripts/translation-completeness.mjs --check     Exit 1 on drift.
//
// `check-data.mjs` §33 runs the same comparison on every `npm test`; the
// --check flag here is for running it alone while iterating.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_PATH = join(ROOT, "scripts", "translation-completeness-baseline.json");

export const LANGS = ["es", "ko", "zh", "ja"];

// How far a ratio may move before it counts as drift. A translated sentence
// reworded, or one English typo fixed, moves a ratio by well under this;
// adding or dropping a paragraph moves it by much more. Deliberately not
// tighter: a baseline that fails on ordinary copy-editing gets regenerated
// reflexively, which is the same as no baseline at all.
export const TOLERANCE = 0.03;

// A lesson counts as abridged in a language when it carries less than this
// share of what a FULL translation into that same language carries — where
// "full" is the language's own 90th-percentile ratio across all 40 lessons
// (`reference` below). Both numbers are calibrated per language, so zh's
// natural compactness cancels out of the comparison rather than being
// corrected for with a fudge factor.
export const ABRIDGED_BELOW = 0.7;

// Exactly the fields `englishSourceHash` fingerprints.
export function translatedChars(content, lang) {
  let n = 0;
  for (const section of content.sections ?? []) {
    n += (section.heading?.[lang] ?? "").length;
    n += (section.body?.[lang] ?? "").length;
  }
  n += (content.takeaway?.[lang] ?? "").length;
  n += (content.thinkAbout?.[lang] ?? "").length;
  return n;
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[i];
}

// Returns { rows, reference, abridged } where rows is per lesson with a ratio
// per language, reference is the per-language p90 ratio, and abridged lists
// the (id, lang) pairs below ABRIDGED_BELOW * reference.
export function completeness(lessonContent) {
  const ids = Object.keys(lessonContent)
    .map(Number)
    .sort((a, b) => a - b);

  const rows = ids.map((id) => {
    const content = lessonContent[id];
    const en = translatedChars(content, "en");
    const chars = { en };
    const ratio = {};
    for (const lang of LANGS) {
      chars[lang] = translatedChars(content, lang);
      // en === 0 would make every ratio Infinity and every lesson look
      // perfect; report 0 instead and let the floor in check-data catch it.
      ratio[lang] = en > 0 ? chars[lang] / en : 0;
    }
    return { id, chars, ratio };
  });

  const reference = {};
  for (const lang of LANGS) {
    const sorted = rows.map((r) => r.ratio[lang]).sort((a, b) => a - b);
    reference[lang] = percentile(sorted, 0.9);
  }

  const abridged = [];
  for (const row of rows) {
    for (const lang of LANGS) {
      if (row.ratio[lang] < ABRIDGED_BELOW * reference[lang]) abridged.push({ id: row.id, lang });
    }
  }

  return { rows, reference, abridged };
}

export function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null;
  return JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
}

const round = (n) => Math.round(n * 100) / 100;

export function buildBaseline(lessonContent) {
  const { rows } = completeness(lessonContent);
  const ratios = {};
  for (const row of rows) {
    ratios[row.id] = {};
    for (const lang of LANGS) ratios[row.id][lang] = round(row.ratio[lang]);
  }
  return {
    note:
      "Recorded translated:English character ratio per lesson per language. Regenerate with " +
      "`npm run translation-completeness -- --write` whenever a ratio legitimately moves, and say " +
      "in the commit message which way it moved and why. check-data.mjs §33 fails if any pair " +
      "drifts by more than `tolerance` in EITHER direction — a drop means English grew (or a " +
      "translation shrank) without the translation keeping up, which is exactly how most of the " +
      "catalogue became abridged without any run noticing; a rise means someone did the work, and the " +
      "baseline should record it so the debt is visibly paid down rather than silently forgotten.",
    tolerance: TOLERANCE,
    ratios,
  };
}

// Returns the list of pairs whose current ratio differs from the recorded one
// by more than the tolerance, plus any pair missing from either side.
export function drift(lessonContent, baseline) {
  const { rows } = completeness(lessonContent);
  const out = [];
  const seen = new Set();

  for (const row of rows) {
    const rec = baseline.ratios?.[row.id];
    if (!rec) {
      out.push({ id: row.id, lang: "*", kind: "unrecorded", now: null, was: null });
      continue;
    }
    for (const lang of LANGS) {
      seen.add(`${row.id}:${lang}`);
      const was = rec[lang];
      if (was == null) {
        out.push({ id: row.id, lang, kind: "unrecorded", now: round(row.ratio[lang]), was: null });
        continue;
      }
      const now = row.ratio[lang];
      if (Math.abs(now - was) > (baseline.tolerance ?? TOLERANCE)) {
        out.push({ id: row.id, lang, kind: now < was ? "fell" : "rose", now: round(now), was });
      }
    }
  }

  for (const id of Object.keys(baseline.ratios ?? {})) {
    for (const lang of LANGS) {
      if (!seen.has(`${id}:${lang}`)) {
        out.push({ id: Number(id), lang, kind: "stale-record", now: null, was: baseline.ratios[id][lang] });
      }
    }
  }

  return out;
}

async function main() {
  const { lessonContent } = await import("../src/content/lessonContent.js");
  const args = process.argv.slice(2);

  if (args.includes("--write")) {
    writeFileSync(BASELINE_PATH, JSON.stringify(buildBaseline(lessonContent), null, 2) + "\n");
    console.log(`Wrote ${BASELINE_PATH}`);
    process.exit(0);
  }

  if (args.includes("--check")) {
    const baseline = loadBaseline();
    if (!baseline) {
      console.error("FAIL: no baseline; run with --write first.");
      process.exit(1);
    }
    const d = drift(lessonContent, baseline);
    for (const x of d) {
      console.error(`FAIL: lesson ${x.id} [${x.lang}] ${x.kind}: recorded ${x.was}, now ${x.now}`);
    }
    console.log(`${d.length === 0 ? "PASS" : "FAIL"}: ${d.length} drifted pair(s).`);
    process.exit(d.length === 0 ? 0 : 1);
  }

  const { rows, reference, abridged } = completeness(lessonContent);
  console.log("Translation completeness (translated chars / English chars, per lesson):\n");
  console.log(`  reference (p90 ratio, i.e. what a full translation looks like in this corpus):`);
  console.log(`    ${LANGS.map((l) => `${l}=${reference[l].toFixed(2)}`).join("  ")}`);
  console.log(`  a lesson is ABRIDGED below ${ABRIDGED_BELOW} x its language's reference.\n`);

  console.log(`  ${"lesson".padStart(6)}  ${"en".padStart(6)}  ${LANGS.map((l) => l.padStart(7)).join("")}`);
  for (const row of rows) {
    const cells = LANGS.map((l) => {
      const flag = row.ratio[l] < ABRIDGED_BELOW * reference[l] ? "*" : " ";
      return (row.ratio[l].toFixed(2) + flag).padStart(7);
    }).join("");
    console.log(`  ${String(row.id).padStart(6)}  ${String(row.chars.en).padStart(6)}  ${cells}`);
  }

  const perLang = Object.fromEntries(LANGS.map((l) => [l, abridged.filter((a) => a.lang === l).length]));
  const lessons = new Set(abridged.map((a) => a.id));
  const totalEn = rows.reduce((n, r) => n + r.chars.en, 0);
  console.log(`\n  abridged pairs: ${LANGS.map((l) => `${l}=${perLang[l]}`).join("  ")}`);
  console.log(`  lessons abridged in at least one language: ${lessons.size} of ${rows.length}`);
  console.log(`  overall volume carried, against ${totalEn.toLocaleString()} English characters:`);
  for (const lang of LANGS) {
    const t = rows.reduce((n, r) => n + r.chars[lang], 0);
    console.log(
      `    ${lang}: ${t.toLocaleString()} chars — ${((t / totalEn) * 100).toFixed(0)}% of English volume, ` +
        `against ${(reference[lang] * 100).toFixed(0)}% for a full translation`,
    );
  }
  console.log(`\n  Abridged, by lesson: ${[...lessons].sort((a, b) => a - b).join(", ")}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
