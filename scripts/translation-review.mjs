#!/usr/bin/env node
// Translation review ledger — the mitigation the owner chose (P-4, option (a),
// 2026-08-11) for the "no machine translation" decision having been reversed
// in practice: ~168,000 characters of es/ko/zh/ja lesson content shipped as
// unreviewed LLM translation, one lesson at a time, over several weeks, with
// no one noticing until the weekly review caught the aggregate on 2026-08-09
// (see AGENT_LOG.md's "Completed and pruned" section, former item 20). The
// owner's call was to accept that state for now (ship under "(Beta)"
// labeling, `check-blindspot.mjs`'s P-3 patterns as the mechanical guard)
// rather than commission review or cut the languages — but "accept for now"
// only stays a deliberate choice, not a repeat of the same silent drift, if
// review status is tracked and visible. That's what this ledger is for.
//
// Reviewer of record: as of 2026-08-11 (owner instruction, same session:
// "no one will be reviewing, you figure out") there is no dedicated human or
// professional translator available, so review is performed by Claude
// reading each lesson's translation against its English source and judging
// faithfulness, fluency, and blindspot safety — the same kind of judgment
// call `check-blindspot.mjs`'s own header says it can't automate. This is
// real content review, not a mechanical check, but it is NOT equivalent to a
// native-speaker or professional review — same-family LLM output being
// checked by another LLM has correlated blind spots a native reader wouldn't
// share. The `method` field on every ledger record ("ai" vs "human") exists
// specifically so that gap stays visible and an eventual human/professional
// pass (DECISIONS.md option (b)) can still supersede AI-reviewed entries
// rather than being blocked by them looking already-done.
//
// Usage:
//   node scripts/translation-review.mjs [report]
//     Print coverage by language: reviewed / stale / unreviewed counts (with
//     an ai-vs-human breakdown) and a prioritized list (stale first — a
//     previously-trusted review that no longer matches the source — then
//     unreviewed). Always exits 0; this is informational, not a gate (see
//     check-data.mjs's non-fatal summary line, which surfaces the same
//     numbers on every `npm test`).
//
//   node scripts/translation-review.mjs mark <lessonId> <lang> <reviewerName> [method]
//     Record that <reviewerName> reviewed lesson <lessonId>'s <lang>
//     translation against the current English source. <method> is "ai" or
//     "human" (default "human" — pass "ai" explicitly for a Claude-performed
//     review, matching the reviewer-of-record note above). Stores a hash of
//     the source so a later English edit is detected as drift, not silently
//     treated as still-reviewed.
//
//   node scripts/translation-review.mjs unmark <lessonId> <lang>
//     Remove a review record (e.g. it was marked in error).
//
// The ledger (scripts/translation-review-ledger.json) is the source of truth
// for review status and is meant to be updated via `mark` by whoever actually
// does a review — it is not regenerated from content, only grown. A
// lesson/language pair absent from the ledger is "unreviewed" by definition;
// nothing needs to be pre-populated as false.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

import { todayStr } from "../src/utils/date.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER_PATH = join(ROOT, "scripts", "translation-review-ledger.json");
const REVIEW_LANGS = ["es", "ko", "zh", "ja"];

function loadLedger() {
  if (!existsSync(LEDGER_PATH)) return {};
  return JSON.parse(readFileSync(LEDGER_PATH, "utf8"));
}

function saveLedger(ledger) {
  // Sorted keys (lesson id, then language) so re-saving after a `mark` only
  // diffs the entry that actually changed, not the whole file's key order.
  const sorted = {};
  for (const id of Object.keys(ledger).sort((a, b) => Number(a) - Number(b))) {
    const langs = {};
    for (const lang of Object.keys(ledger[id]).sort()) langs[lang] = ledger[id][lang];
    sorted[id] = langs;
  }
  writeFileSync(LEDGER_PATH, JSON.stringify(sorted, null, 2) + "\n");
}

// A stable fingerprint of everything in a lesson that gets translated:
// section headings/bodies, takeaway, thinkAbout — mirrors the field set
// check-data.mjs already validates for 5-language parity. Ignores lessons.js's
// title/subtitle (short, changes rarely, and re-review over a title edit
// alone would be noisy relative to its translation risk).
export function englishSourceHash(content) {
  const parts = [];
  for (const section of content.sections ?? []) {
    parts.push(section.heading?.en ?? "", section.body?.en ?? "");
  }
  parts.push(content.takeaway?.en ?? "", content.thinkAbout?.en ?? "");
  return createHash("sha256").update(parts.join("\0")).digest("hex").slice(0, 16);
}

// Returns { total, reviewed, aiReviewed, humanReviewed, stale, unreviewed,
// staleList, unreviewedList } per language, where staleList/unreviewedList
// are [{id, title}] sorted by id.
export function computeCoverage(lessonContent, lessons, ledger) {
  const titleOf = (id) => lessons.find((l) => l.id === id)?.title?.en ?? `lesson ${id}`;
  const ids = Object.keys(lessonContent).map(Number).sort((a, b) => a - b);
  const byLang = {};
  for (const lang of REVIEW_LANGS) {
    byLang[lang] = {
      total: ids.length,
      reviewed: 0,
      aiReviewed: 0,
      humanReviewed: 0,
      stale: 0,
      unreviewed: 0,
      staleList: [],
      unreviewedList: [],
    };
  }
  for (const id of ids) {
    const content = lessonContent[id];
    const currentHash = englishSourceHash(content);
    for (const lang of REVIEW_LANGS) {
      const record = ledger[id]?.[lang];
      const bucket = byLang[lang];
      if (!record) {
        bucket.unreviewed++;
        bucket.unreviewedList.push({ id, title: titleOf(id) });
      } else if (record.sourceHash !== currentHash) {
        bucket.stale++;
        bucket.staleList.push({ id, title: titleOf(id), reviewedBy: record.reviewedBy, reviewedDate: record.reviewedDate });
      } else {
        bucket.reviewed++;
        if (record.method === "human") bucket.humanReviewed++;
        else bucket.aiReviewed++;
      }
    }
  }
  return byLang;
}

function printReport(coverage) {
  console.log("Translation review coverage (es/ko/zh/ja lesson content, non-blocking):\n");
  for (const lang of REVIEW_LANGS) {
    const c = coverage[lang];
    const pct = c.total ? Math.round((c.reviewed / c.total) * 100) : 0;
    console.log(
      `  ${lang}: ${c.reviewed}/${c.total} reviewed (${pct}%) — ${c.aiReviewed} AI, ${c.humanReviewed} human — ` +
        `${c.stale} stale, ${c.unreviewed} unreviewed`,
    );
  }
  for (const lang of REVIEW_LANGS) {
    const c = coverage[lang];
    if (c.staleList.length) {
      console.log(`\n  [${lang}] STALE — English source changed since last review, needs re-review:`);
      for (const item of c.staleList) {
        console.log(`    lesson ${item.id} "${item.title}" (last reviewed by ${item.reviewedBy} on ${item.reviewedDate})`);
      }
    }
  }
  console.log(
    "\n  Priority order for anyone picking this up: stale entries first (a human already vouched for\n" +
      "  these once, so drift is the highest-signal gap), then unreviewed, most-recently-added lessons\n" +
      "  first (see AGENT_LOG.md's 'Completed and pruned' section, former item 20, and DECISIONS.md's\n" +
      "  'Machine-translated lesson content' entry for the full history and the owner's P-4 decision).",
  );
}

async function main() {
  const [, , cmd = "report", ...rest] = process.argv;
  const { lessons } = await import(join(ROOT, "src", "content", "lessons.js"));
  const { lessonContent } = await import(join(ROOT, "src", "content", "lessonContent.js"));
  const ledger = loadLedger();

  if (cmd === "report") {
    printReport(computeCoverage(lessonContent, lessons, ledger));
    process.exit(0);
  }

  if (cmd === "mark") {
    const [idStr, lang, ...nameAndMethod] = rest;
    const id = Number(idStr);
    const last = nameAndMethod[nameAndMethod.length - 1];
    const hasMethod = last === "ai" || last === "human";
    const method = hasMethod ? last : "human";
    const reviewerName = (hasMethod ? nameAndMethod.slice(0, -1) : nameAndMethod).join(" ");
    if (!lessonContent[id]) {
      console.error(`FAIL: no lesson content for id ${idStr}`);
      process.exit(1);
    }
    if (!REVIEW_LANGS.includes(lang)) {
      console.error(`FAIL: lang must be one of ${REVIEW_LANGS.join(", ")}, got "${lang}"`);
      process.exit(1);
    }
    if (!reviewerName) {
      console.error(`FAIL: usage: mark <lessonId> <lang> <reviewerName> [ai|human]`);
      process.exit(1);
    }
    ledger[id] = ledger[id] || {};
    ledger[id][lang] = {
      reviewedBy: reviewerName,
      // Local day, not UTC — the reviewer's own date is what a ledger entry
      // means (backlog item 38, check-data.mjs §23).
      reviewedDate: todayStr(),
      sourceHash: englishSourceHash(lessonContent[id]),
      method,
    };
    saveLedger(ledger);
    console.log(`Marked lesson ${id} [${lang}] reviewed by ${reviewerName} (${method}).`);
    process.exit(0);
  }

  if (cmd === "unmark") {
    const [idStr, lang] = rest;
    const id = Number(idStr);
    if (ledger[id]?.[lang]) {
      delete ledger[id][lang];
      if (Object.keys(ledger[id]).length === 0) delete ledger[id];
      saveLedger(ledger);
      console.log(`Unmarked lesson ${id} [${lang}].`);
    } else {
      console.log(`Lesson ${id} [${lang}] was not marked reviewed — nothing to do.`);
    }
    process.exit(0);
  }

  console.error(`Unknown command "${cmd}". Usage: report | mark <lessonId> <lang> <reviewerName> [ai|human] | unmark <lessonId> <lang>`);
  process.exit(1);
}

// Only run main() when invoked directly (not when imported for its exports by
// check-data.mjs's non-fatal summary). Compares resolved file URLs rather
// than string-concatenating `file://${process.argv[1]}` — that naive form
// breaks whenever the path contains characters `import.meta.url` percent-
// encodes (spaces, non-ASCII), which this repo's path does on both counts.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
