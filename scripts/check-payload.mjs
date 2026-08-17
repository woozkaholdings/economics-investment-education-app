#!/usr/bin/env node
// Payload checks — that the app still ships one language's content, not five.
// Run via `npm test`, alongside the other check-*.mjs scripts.
//
// WHY THIS EXISTS. Items 45 and 48 split lesson bodies per (track, language)
// and quiz text per language, taking the largest content chunk from 499.27 kB
// to 116.84 kB and deleting a 140.88 kB shared quiz chunk. Roughly 80% of both
// assets was text the reader's device would never display.
//
// None of that is asserted anywhere. It was verified by a human opening the
// app and reading the network panel, which is exactly the kind of property the
// 2026-08-16 review kept finding had drifted: a fact nobody checks is a fact
// that rots. A single static `import { quizData } from "../content/quizData.js"`
// added to a screen — the most natural line in the world to write — silently
// pulls all five languages back into that screen's chunk, and every existing
// check stays green because the data is still correct. Only the bytes change.
//
// So this asserts the STRUCTURE that produces the payload, not the byte counts:
// byte assertions need a build (npm test does not build) and would need
// rewriting every time a lesson is edited. The structure is stable and the
// failure mode is a specific, nameable line of code.
//
// Deliberately NOT checked: chunk sizes, module counts, or anything requiring
// `vite build`. If those are ever wanted they belong in a separate build-time
// check, not here — this one has to stay fast enough to run on every commit.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

import { TRACKS } from "../src/content/lessons.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const LANGS = ["en", "es", "ko", "zh", "ja"];

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failures++;
};
const ok = (msg) => console.log(`ok: ${msg}`);
const rel = (p) => relative(ROOT, p);

// ── Source scan ───────────────────────────────────────────────────────────
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(js|jsx)$/.test(e.name) ? [p] : [];
  });
}

// `import … from "x"` / `import "x"` at the start of a line — anchoring to the
// line start keeps prose in comments (lessons.js's header names
// content/lessonContent.js in a sentence) from reading as an import.
const STATIC_RE = /^\s*import\s+(?:[^'"\n]*?\sfrom\s+)?["']([^"']+)["']/gm;
const DYNAMIC_RE = /import\(\s*["']([^"']+)["']\s*\)/g;

const files = walk(SRC);
const imports = new Map(); // absolute file -> { static: Set, dynamic: Set }

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const entry = { static: new Set(), dynamic: new Set() };
  for (const [re, key] of [[STATIC_RE, "static"], [DYNAMIC_RE, "dynamic"]]) {
    const r = new RegExp(re.source, re.flags);
    let m;
    while ((m = r.exec(text))) {
      const spec = m[1];
      if (!spec.startsWith(".")) continue; // package imports are not our business
      entry[key].add(resolve(dirname(file), spec));
    }
  }
  imports.set(file, entry);
}

// ── The modules this check is about ───────────────────────────────────────
const MERGED = [
  join(SRC, "content", "lessonContent.js"),
  join(SRC, "content", "quizData.js"),
];

const trackKeys = TRACKS.map((t) => t.key);
const PER_LANGUAGE = [
  ...trackKeys.flatMap((t) => LANGS.map((l) => join(SRC, "content", `lessonContent.${t}.${l}.js`))),
  ...LANGS.map((l) => join(SRC, "content", `quizText.${l}.js`)),
];

// ── 1. Every per-language module the split promises actually exists ───────
{
  const missing = PER_LANGUAGE.filter((p) => !existsSync(p));
  if (missing.length) {
    fail(
      `these per-language modules are missing: ${missing.map(rel).join(", ")}. ` +
        `Tracks come from lessons.js's TRACKS (${trackKeys.join(", ")}) and languages from this ` +
        `script's LANGS — adding either without adding its content files leaves a language that ` +
        `throws on first use.`,
    );
  } else {
    ok(`all ${PER_LANGUAGE.length} per-language content modules exist (${trackKeys.length} tracks × ${LANGS.length} langs, + quiz text)`);
  }
}

// ── 2. The app never imports a merged view ────────────────────────────────
// This is the load-bearing one. The merged views exist for check-data.mjs and
// translation-review.mjs, which need every language at once; they statically
// import all ten content files, so any path from the browser bundle into one
// of them drags the whole catalogue in.
{
  const offenders = [];
  for (const [file, { static: s, dynamic: d }] of imports) {
    if (MERGED.includes(file)) continue; // the merged views themselves are fine
    for (const target of MERGED) {
      if (s.has(target)) offenders.push(`${rel(file)} statically imports ${rel(target)}`);
      if (d.has(target)) offenders.push(`${rel(file)} dynamically imports ${rel(target)}`);
    }
  }
  if (offenders.length) {
    fail(
      `a module under src/ imports a merged content view:\n  ${offenders.join("\n  ")}\n` +
        `  The merged views are node-only (scripts/check-data.mjs, scripts/translation-review.mjs).\n` +
        `  Each one statically imports every language, so importing it from the app restores the\n` +
        `  pre-split payload — ~480 kB of lesson bodies and ~128 kB of quiz text, four fifths of it\n` +
        `  in languages the reader cannot read (backlog items 45 and 48). Nothing else would fail:\n` +
        `  the data is identical, only the bytes shipped change. Import the per-language module\n` +
        `  dynamically instead, the way LessonReader.jsx and Practice.jsx do.`,
    );
  } else {
    ok("no module under src/ imports a merged content view (lessonContent.js, quizData.js)");
  }
}

// ── 3. Per-language modules are reached only by dynamic import ────────────
// A static import from a screen hoists that language into the screen's chunk,
// which is the same failure as (2) one language at a time.
{
  const offenders = [];
  for (const [file, { static: s }] of imports) {
    if (MERGED.includes(file)) continue; // merged views import all of them on purpose
    for (const target of PER_LANGUAGE) {
      if (s.has(target)) offenders.push(`${rel(file)} statically imports ${rel(target)}`);
    }
  }
  if (offenders.length) {
    fail(
      `a per-language content module is imported statically:\n  ${offenders.join("\n  ")}\n` +
        `  Static imports are bundled into the importing chunk whether or not the reader's language\n` +
        `  matches. Use a dynamic import() keyed on the active language.`,
    );
  } else {
    ok("per-language content modules are only ever imported dynamically from src/");
  }
}

// ── 4. Every per-language module has a loader that can reach it ───────────
// The inverse of (3): a language whose module exists but which no loader map
// names is unreachable, and `LOADERS[key]()` on a missing key is a TypeError at
// runtime — for one language, which is exactly the kind of gap nobody notices
// until a reader switches to it.
{
  const dynamicTargets = new Set();
  for (const [file, { dynamic: d }] of imports) {
    if (MERGED.includes(file)) continue;
    for (const t of d) dynamicTargets.add(t);
  }
  const unreachable = PER_LANGUAGE.filter((p) => !dynamicTargets.has(p));
  if (unreachable.length) {
    fail(
      `these per-language modules exist but no dynamic import() in src/ names them:\n  ${unreachable
        .map(rel)
        .join("\n  ")}\n` +
        `  A loader map keyed by language throws TypeError on a missing key, and only for readers\n` +
        `  using that language. Add the entry to CONTENT_LOADERS / QUIZ_TEXT_LOADERS.`,
    );
  } else {
    ok(`all ${PER_LANGUAGE.length} per-language modules are reachable via a dynamic import()`);
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
