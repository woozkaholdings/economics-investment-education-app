#!/usr/bin/env node
// Data-shape checks for the content/locale modules under src/content and
// src/locales. Run via `npm test`. Catches the class of bug a JSX/build
// check can't: a missing language field, an out-of-range quiz answer, or a
// dangling `t.someKey` reference — without needing a browser.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { TR } from "../src/locales/index.js";
import { lessons, TRACKS, lessonsByTrack } from "../src/content/lessons.js";
import { lessonContent } from "../src/content/lessonContent.js";
import { quizData } from "../src/content/quizData.js";
import { glossary } from "../src/content/glossary.js";
import { kidsContent } from "../src/content/kidsContent.js";
import * as marketsContent from "../src/content/markets.js";
import { economicSignals } from "../src/content/economicSignals.js";
import { sectors } from "../src/content/sectors.js";
import { MAX_BOX, dueQuestions, recordAnswer } from "../src/lib/review.js";
import { MIN_BARS, OUTPERFORM_THRESHOLD, WJ_PERIODS, wjSectorComparison } from "../src/lib/relativeStrength.js";
import { OLD_TO_NEW_LESSON_ID, migrateLegacyLessonIds } from "../src/lib/lessonIdMigration.js";
import { computeCoverage } from "./translation-review.mjs";
import * as storageLib from "../src/lib/storage.js";
import { EVENTS, MAX_LOGGED_EVENTS, track } from "../src/lib/analytics.js";
import { redactUrl, getAdapter, fixture, ADAPTERS } from "../src/lib/marketData/adapters.js";
import { FRED_SERIES, fixtureEconomics } from "../src/lib/marketData/fred.js";

// A minimal in-memory localStorage mock, installed as a global before
// storage.js's tests run below (node has no localStorage of its own).
// storage.js reads `localStorage` lazily inside each function rather than
// at module scope, so it's safe to import it up top and only install the
// mock right before exercising it in section 12.
class FakeLocalStorage {
  constructor() {
    this._data = new Map();
  }
  getItem(key) {
    return this._data.has(key) ? this._data.get(key) : null;
  }
  setItem(key, value) {
    this._data.set(key, String(value));
  }
  removeItem(key) {
    this._data.delete(key);
  }
  clear() {
    this._data.clear();
  }
}

// A variant that throws on every access, mirroring the real-world case
// storage.js exists to guard against — privacy modes where localStorage
// throws instead of returning null (see the file's own header comment).
class ThrowingLocalStorage {
  getItem() {
    throw new DOMException("access denied", "SecurityError");
  }
  setItem() {
    throw new DOMException("access denied", "SecurityError");
  }
}

const LANGS = ["en", "es", "ja", "ko", "zh"];
const TRACK_KEYS = new Set(TRACKS.map((tr) => tr.key));
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
let warnings = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failures++;
}

function warn(msg) {
  console.warn(`WARN: ${msg}`);
  warnings++;
}

function checkLangSet(obj, path) {
  if (obj == null || typeof obj !== "object") {
    fail(`${path}: expected an object keyed by language, got ${typeof obj}`);
    return false;
  }
  const keys = Object.keys(obj).sort();
  const expected = [...LANGS].sort();
  if (keys.join(",") !== expected.join(",")) {
    fail(`${path}: language keys are [${keys.join(", ")}], expected [${expected.join(", ")}]`);
    return false;
  }
  return true;
}

function checkNonEmptyString(value, path) {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(`${path}: expected a non-empty string, got ${JSON.stringify(value)}`);
  }
}

// 1. TR locale dictionaries: every language has the same key set as en,
//    and every value is a non-empty string.
{
  if (checkLangSet(TR, "TR")) {
    const enKeys = new Set(Object.keys(TR.en));
    for (const lang of LANGS) {
      const keys = new Set(Object.keys(TR[lang]));
      for (const k of enKeys) if (!keys.has(k)) fail(`TR.${lang}: missing key "${k}" (present in TR.en)`);
      for (const k of keys) if (!enKeys.has(k)) fail(`TR.${lang}: extra key "${k}" (not present in TR.en)`);
      for (const k of keys) checkNonEmptyString(TR[lang][k], `TR.${lang}.${k}`);
    }
  }
}

// 2. lessons: unique ids, every translated field present in all 5 languages,
//    and — since content/lessonContent.js (backlog item 23) — that every
//    lesson has a matching content entry (and vice versa) with no orphans on
//    either side, plus that the metadata's `minutes` estimate still matches a
//    fresh count of the content it's a snapshot of.
{
  const seenIds = new Set();
  lessons.forEach((lesson, i) => {
    const path = `lessons[${i}]`;
    if (seenIds.has(lesson.id)) fail(`${path}: duplicate lesson id ${lesson.id}`);
    seenIds.add(lesson.id);

    // Every lesson belongs to exactly one track. Without this, a lesson added
    // by a future run with no `track` would silently appear on neither path.
    if (!TRACK_KEYS.has(lesson.track)) {
      fail(`${path} (id ${lesson.id}): track is ${JSON.stringify(lesson.track)}, expected one of [${[...TRACK_KEYS].join(", ")}]`);
    }

    for (const field of ["title", "subtitle"]) {
      if (checkLangSet(lesson[field], `${path}.${field}`)) {
        for (const lang of LANGS) checkNonEmptyString(lesson[field][lang], `${path}.${field}.${lang}`);
      }
    }

    const content = lessonContent[lesson.id];
    if (content == null) {
      fail(`${path} (id ${lesson.id}): no matching entry in lessonContent.js`);
      return;
    }

    for (const field of ["takeaway", "thinkAbout"]) {
      if (checkLangSet(content[field], `lessonContent[${lesson.id}].${field}`)) {
        for (const lang of LANGS) checkNonEmptyString(content[field][lang], `lessonContent[${lesson.id}].${field}.${lang}`);
      }
    }

    if (!Array.isArray(content.sections) || content.sections.length === 0) {
      fail(`lessonContent[${lesson.id}].sections: expected a non-empty array`);
    } else {
      content.sections.forEach((section, si) => {
        const sPath = `lessonContent[${lesson.id}].sections[${si}]`;
        for (const field of ["heading", "body"]) {
          if (checkLangSet(section[field], `${sPath}.${field}`)) {
            for (const lang of LANGS) checkNonEmptyString(section[field][lang], `${sPath}.${field}.${lang}`);
          }
        }
      });

      // `minutes` in lessons.js is a snapshot of what estimateMinutes() used
      // to compute live from this same body text before the 2026-08-07 split.
      // Recomputing it here means a future run that edits a lesson's body
      // without updating `minutes` fails loudly instead of leaving a stale
      // reading-time estimate on the Learn list.
      const words = [...content.sections.map((s) => s.body.en), content.takeaway.en, content.thinkAbout.en]
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const expectedMinutes = Math.max(1, Math.round(words / 200));
      if (lesson.minutes !== expectedMinutes) {
        fail(`${path} (id ${lesson.id}): minutes is ${lesson.minutes}, but its content computes to ${expectedMinutes} — update lessons.js's minutes field to match the edited body`);
      }
    }
  });

  for (const idStr of Object.keys(lessonContent)) {
    const id = Number(idStr);
    if (!seenIds.has(id)) fail(`lessonContent[${id}]: no matching lesson in lessons.js — orphaned content`);
  }
}

// 2b. tracks: every track's label/blurb resolves in all 5 languages, no track
//     is empty, and grouping by track loses or duplicates no lesson.
{
  for (const tr of TRACKS) {
    for (const key of [tr.labelKey, tr.blurbKey]) {
      for (const lang of LANGS) {
        checkNonEmptyString(TR[lang]?.[key], `TR.${lang}.${key} (track "${tr.key}")`);
      }
    }
    const count = lessons.filter((l) => l.track === tr.key).length;
    if (count === 0) fail(`TRACKS: track "${tr.key}" has no lessons — it would render as an empty section`);
  }

  const grouped = lessonsByTrack();
  if (grouped.length !== lessons.length) {
    fail(`lessonsByTrack(): returned ${grouped.length} lessons, expected ${lessons.length} — a lesson's track matches no TRACKS entry`);
  }
  const groupedIds = new Set(grouped.map((l) => l.id));
  for (const l of lessons) {
    if (!groupedIds.has(l.id)) fail(`lessonsByTrack(): lesson ${l.id} is missing from every track`);
  }
}

// 3. quizData: language parity on q/opts/explain, matching option counts
//    across languages, in-range answers, and a (non-fatal) check on whether
//    the answer-index distribution is degenerate.
{
  const answerCounts = {};
  quizData.forEach((item, i) => {
    const path = `quizData[${i}]`;
    checkLangSet(item.q, `${path}.q`);
    checkLangSet(item.explain, `${path}.explain`);

    if (checkLangSet(item.opts, `${path}.opts`)) {
      const enCount = Array.isArray(item.opts.en) ? item.opts.en.length : -1;
      LANGS.forEach((lang) => {
        if (!Array.isArray(item.opts[lang])) {
          fail(`${path}.opts.${lang}: expected an array`);
        } else if (item.opts[lang].length !== enCount) {
          fail(`${path}.opts.${lang}: has ${item.opts[lang].length} options, expected ${enCount} (matching opts.en) — language parity mismatch`);
        } else {
          item.opts[lang].forEach((opt, oi) => checkNonEmptyString(opt, `${path}.opts.${lang}[${oi}]`));
        }
      });

      if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= enCount) {
        fail(`${path}.answer: index ${item.answer} out of range for ${enCount} options`);
      } else {
        answerCounts[item.answer] = (answerCounts[item.answer] || 0) + 1;
      }
    }

    // Every question belongs to the lesson that teaches it — the lesson reader
    // builds its end-of-lesson check from this field.
    if (!Number.isInteger(item.lesson) || !lessons.some((l) => l.id === item.lesson)) {
      fail(`${path}.lesson: ${JSON.stringify(item.lesson)} is not a real lesson id`);
    }
  });

  // A lesson with no question renders an empty check, which reads as a bug to
  // the learner and silently drops that lesson out of the spaced-review pool.
  const withQuestions = new Set(quizData.map((q) => q.lesson));
  for (const lesson of lessons) {
    if (!withQuestions.has(lesson.id)) {
      fail(`quizData: lesson ${lesson.id} ("${lesson.title.en}") has no question — its end-of-lesson check would be empty`);
    }
  }

  const total = quizData.length;
  const counts = Object.values(answerCounts);
  if (total > 0 && counts.length > 0) {
    const maxShare = Math.max(...counts) / total;
    if (maxShare > 0.5) {
      warn(
        `quizData: answer-index distribution is degenerate — ${Math.round(maxShare * 100)}% of correct ` +
          `answers share one option index (counts by index: ${JSON.stringify(answerCounts)}). A user who ` +
          `always taps that option would score suspiciously well. Tracked as a separate backlog item; ` +
          `an in-range check alone would not have caught this.`
      );
    }
  }
}

// 4. glossary: every term has all 5 languages, each with a non-empty {s, f}.
{
  for (const [term, entry] of Object.entries(glossary)) {
    const path = `glossary["${term}"]`;
    if (checkLangSet(entry, path)) {
      for (const lang of LANGS) {
        const def = entry[lang];
        if (def == null || typeof def !== "object") {
          fail(`${path}.${lang}: expected an {s, f} object, got ${typeof def}`);
          continue;
        }
        checkNonEmptyString(def.s, `${path}.${lang}.s`);
        checkNonEmptyString(def.f, `${path}.${lang}.f`);
      }
    }
  }
}

// 5. kidsContent: every age band has title/activity/parentTip in all 5
//    languages, plus a non-empty lessons array translated the same way.
{
  for (const [band, entry] of Object.entries(kidsContent)) {
    const path = `kidsContent["${band}"]`;
    for (const field of ["title", "activity", "parentTip"]) {
      if (checkLangSet(entry[field], `${path}.${field}`)) {
        for (const lang of LANGS) checkNonEmptyString(entry[field][lang], `${path}.${field}.${lang}`);
      }
    }
    if (!Array.isArray(entry.lessons) || entry.lessons.length === 0) {
      fail(`${path}.lessons: expected a non-empty array`);
    } else {
      entry.lessons.forEach((l, li) => {
        if (checkLangSet(l, `${path}.lessons[${li}]`)) {
          for (const lang of LANGS) checkNonEmptyString(l[lang], `${path}.lessons[${li}].${lang}`);
        }
      });
    }
  }
}

// 6. every `t.someKey` reference anywhere under src/ resolves to a real TR.en
//    key (`t` is the `TR[lang]` translation object, passed down as a prop).
//    Walks the tree rather than listing directories, so moving or adding a
//    screen can't silently shrink this check's coverage — which is exactly
//    what happened while components were being extracted one at a time.
//
//    Note this scans src/ only. The `economic-cycles-v*.jsx` files at the repo
//    root are reference material, not part of the app (LAUNCH_PLAN.md §0), and
//    are deliberately excluded.
{
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walk(full);
      return e.isFile() && e.name.endsWith(".jsx") ? [full] : [];
    });

  const jsxFiles = walk(join(ROOT, "src"));
  if (jsxFiles.length === 0) fail("no .jsx files found under src/ — the t.key scan covered nothing");

  const defined = new Set(Object.keys(TR.en));
  for (const jsxPath of jsxFiles) {
    const src = readFileSync(jsxPath, "utf8");
    const used = new Set([...src.matchAll(/\bt\.([a-zA-Z_][a-zA-Z0-9_]*)/g)].map((m) => m[1]));
    const rel = jsxPath.slice(ROOT.length + 1);
    for (const key of used) {
      if (!defined.has(key)) fail(`${rel} references t.${key}, but "${key}" is not defined in TR.en`);
    }
  }
}

// 7. Generic 5-language parity for a content module's named exports — used
//    for markets.js, sectors.js and economicSignals.js. Handles both a bare
//    array of language maps and an array of objects that contain them (e.g.
//    sectors.js's { symbol, name, what }), so a new module in the same shape
//    gets checked for free by adding it to CONTENT_MODULES below.
function checkModuleParity(moduleExports, moduleLabel) {
  for (const [name, value] of Object.entries(moduleExports)) {
    const path = `${moduleLabel}.${name}`;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        // Entries are either a bare language map or an object containing them.
        const maps = item && typeof item === "object" && "en" in item ? { "": item } : item;
        for (const [field, inner] of Object.entries(maps)) {
          if (inner && typeof inner === "object" && "en" in inner) {
            const p = field ? `${path}[${i}].${field}` : `${path}[${i}]`;
            if (checkLangSet(inner, p)) {
              for (const lang of LANGS) checkNonEmptyString(inner[lang], `${p}.${lang}`);
            }
          }
        }
      });
    } else if (value && typeof value === "object" && "en" in value) {
      if (checkLangSet(value, path)) {
        for (const lang of LANGS) {
          const v = value[lang];
          if (Array.isArray(v)) {
            if (v.length === 0) fail(`${path}.${lang}: expected a non-empty array`);
            v.forEach((s, i) => checkNonEmptyString(s, `${path}.${lang}[${i}]`));
          } else {
            checkNonEmptyString(v, `${path}.${lang}`);
          }
        }
      }
    }
  }
}

const CONTENT_MODULES = {
  markets: marketsContent,
  // sectors.js was never wired into this check before — its `name`/`what`
  // language maps had no automated parity check. economicSignals.js is new
  // this run and gets the same coverage from day one.
  sectors: { sectors },
  economicSignals: { economicSignals },
};
for (const [label, moduleExports] of Object.entries(CONTENT_MODULES)) {
  checkModuleParity(moduleExports, label);
}

// 8. spaced-review scheduler. Pure logic, so it is checked here rather than in
//    a browser: the schedule decides when a learner sees a question again, and
//    an off-by-one there is invisible until days later.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`review: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  let s = recordAnswer({}, 3, true, "2026-08-04");
  eq("first correct answer enters box 1, due next day", [s["3"].box, s["3"].due], [1, "2026-08-05"]);

  s = recordAnswer(s, 3, true, "2026-08-05");
  eq("second correct answer advances to box 2", [s["3"].box, s["3"].due], [2, "2026-08-07"]);

  s = recordAnswer(s, 3, false, "2026-08-07");
  eq("a miss drops back to box 1", [s["3"].box, s["3"].due, s["3"].wrong], [1, "2026-08-08", 1]);

  let capped = {};
  for (let i = 0; i < 10; i++) capped = recordAnswer(capped, 0, true, "2026-08-04");
  eq("box is capped", capped["0"].box, MAX_BOX);

  eq("interval arithmetic crosses a month boundary",
    recordAnswer({}, 1, true, "2026-08-31")["1"].due, "2026-09-01");

  // Never-answered questions belong to their lesson's check, not to review —
  // surfacing them here would quiz material the learner hasn't reached.
  eq("unseen questions are never due", dueQuestions({}, quizData, "2026-08-04").length, 0);

  const mixed = {
    "2": { box: 1, due: "2026-08-04", seen: 1, wrong: 0 },
    "5": { box: 1, due: "2026-08-09", seen: 1, wrong: 0 },
  };
  eq("due today is included, future is not",
    dueQuestions(mixed, quizData, "2026-08-04").map((x) => x.index), [2]);

  const overdue = {
    "2": { box: 1, due: "2026-08-04", seen: 1, wrong: 0 },
    "5": { box: 1, due: "2026-08-01", seen: 1, wrong: 0 },
  };
  eq("most overdue comes first",
    dueQuestions(overdue, quizData, "2026-08-04").map((x) => x.index), [5, 2]);
}


// 9. relative strength (WJ_Sector_Comparison). The measure decides what the
//    sector screen ranks, and an off-by-one in a positional lookback is
//    invisible on screen — it just produces a plausible wrong order.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`relativeStrength: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  const bars = MIN_BARS;
  const flat = (v) => Array(bars).fill(v);
  const jumpTo = (end) => { const a = flat(100); a[bars - 1] = end; return a; };

  eq("lookback set matches the study", WJ_PERIODS, [10, 30, 60]);
  eq("needs longest lookback + current bar", MIN_BARS, 61);

  // +10% over every lookback against a flat benchmark: three excesses of 0.10.
  const plus10 = wjSectorComparison(jumpTo(110), flat(100));
  eq("+10% across all three lookbacks scores 30.0", plus10.value, 30);
  eq("raw sum is the decimal the threshold uses", Math.round(plus10.raw * 1000) / 1000, 0.3);
  eq("0.3 does not clear the 0.5 threshold", plus10.outperforming, false);
  eq("per-lookback breakdown is exposed", Object.keys(plus10.parts), ["d10", "d30", "d60"]);

  eq("+20% clears the threshold", wjSectorComparison(jumpTo(120), flat(100)).outperforming, true);
  eq("underperformance is negative", wjSectorComparison(jumpTo(90), flat(100)).value, -30);

  // Matching the benchmark exactly is zero excess, not zero return.
  const matched = wjSectorComparison(jumpTo(110), jumpTo(110));
  eq("matching the benchmark scores 0", matched.value, 0);

  // Guards: a silently misaligned comparison is worse than no number.
  eq("insufficient history returns null", wjSectorComparison(Array(bars - 1).fill(100), Array(bars - 1).fill(100)), null);
  eq("mismatched series lengths return null", wjSectorComparison(flat(100), Array(bars + 9).fill(100)), null);

  if (OUTPERFORM_THRESHOLD !== 0.5) {
    warn(`relativeStrength: OUTPERFORM_THRESHOLD is ${OUTPERFORM_THRESHOLD}, not the study's 0.5`);
  }
}

// 10. Lesson-id migration table (backlog item 22's OLD_TO_NEW_LESSON_ID). This
//     is a large hand-written 40-entry table with no structural constraint
//     enforcing it — a single transcription typo (a duplicated target id, or a
//     missing one) would silently point an already-installed user's unlock
//     state at the wrong lesson, with no error and no visible symptom until
//     someone's progress looked wrong. Checked here as a pure function, no
//     browser needed.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`lessonIdMigration: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  const expected1to40 = Array.from({ length: 40 }, (_, i) => i + 1);
  const keys = Object.keys(OLD_TO_NEW_LESSON_ID).map(Number).sort((a, b) => a - b);
  const vals = Object.values(OLD_TO_NEW_LESSON_ID).slice().sort((a, b) => a - b);
  eq("every old id 1-40 has an entry, none extra or missing", keys, expected1to40);
  eq("every new id 1-40 is hit exactly once — a true bijection, no dropped or duplicated target", vals, expected1to40);

  eq("known ids remap via the table", migrateLegacyLessonIds([1, 13, 40]), [29, 1, 28]);
  eq("an id not in the table (e.g. a lesson added after this one-time migration) passes through unchanged",
    migrateLegacyLessonIds([41, 99]), [41, 99]);
  eq("empty input stays empty", migrateLegacyLessonIds([]), []);
}

// 11. Translation review coverage (informational, non-blocking — never fails
//     the build). Surfaces P-4's accepted-for-now state (see AGENT_LOG.md item
//     20, DECISIONS.md "Machine translation review") on every `npm test` run
//     instead of only when someone remembers to run
//     `npm run review-status` by hand — the whole reason P-4 needed an owner
//     escalation was that this exact number drifted for weeks, unnoticed,
//     between weekly reviews.
{
  const ledgerPath = join(ROOT, "scripts", "translation-review-ledger.json");
  const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
  const coverage = computeCoverage(lessonContent, lessons, ledger);
  const parts = Object.entries(coverage).map(([lang, c]) => {
    const pct = c.total ? Math.round((c.reviewed / c.total) * 100) : 0;
    const humanPct = c.total ? Math.round((c.humanReviewed / c.total) * 100) : 0;
    return `${lang} ${pct}% (${humanPct}% human)${c.stale ? ` (${c.stale} stale)` : ""}`;
  });
  warn(
    `translation review coverage — ${parts.join(", ")} of lesson content reviewed; see the ` +
      `per-language human share above — most review so far is AI (see the method field, ` +
      `DECISIONS.md). Run 'npm run review-status' for detail.`,
  );
}

// 12. src/lib/storage.js — every persisted value in the app goes through
//     this file (see its own header comment), but it had no test coverage
//     of its own; AGENT_LOG.md flagged this twice as the natural next piece
//     and twice deferred it for needing a localStorage mock (node has none
//     built in). FakeLocalStorage/ThrowingLocalStorage above supply that.
//     Two things this checks that a human skim wouldn't: (a) the read/write
//     round trip and fallback behavior for every exported function, and
//     (b) that KEYS has no accidental duplicate string value — two features
//     silently sharing one localStorage key would corrupt each other's
//     state with no error and no visible symptom, the same failure shape
//     section 10 above guards against for lesson ids.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`storage: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  const keyValues = Object.values(storageLib.KEYS);
  eq("KEYS has no duplicate storage key across different features", keyValues.length, new Set(keyValues).size);

  globalThis.localStorage = new FakeLocalStorage();

  eq("readRaw returns the fallback when nothing is stored", storageLib.readRaw("missing", "fallback"), "fallback");
  eq("readRaw returns null fallback by default", storageLib.readRaw("missing"), null);
  eq("writeRaw reports success", storageLib.writeRaw("k1", "hello"), true);
  eq("readRaw reads back what writeRaw wrote", storageLib.readRaw("k1"), "hello");
  eq("writeRaw stores non-string values via String()", storageLib.writeRaw("k2", 42), true);
  eq("readRaw returns the stringified value", storageLib.readRaw("k2"), "42");

  eq("readJSON returns the fallback when nothing is stored", storageLib.readJSON("missing-json", { a: 1 }), { a: 1 });
  eq("writeJSON reports success", storageLib.writeJSON("k3", { streak: 5, days: [1, 2, 3] }), true);
  eq("readJSON round-trips a nested object", storageLib.readJSON("k3", null), { streak: 5, days: [1, 2, 3] });
  eq("writeJSON/readJSON round-trip null falls back instead of returning null",
    (storageLib.writeJSON("k4", null), storageLib.readJSON("k4", "fallback")), "fallback");

  globalThis.localStorage.setItem("corrupt", "{not valid json");
  eq("readJSON falls back on unparseable stored data", storageLib.readJSON("corrupt", "fallback"), "fallback");

  eq("readArray returns [] when nothing is stored", storageLib.readArray("missing-array"), []);
  storageLib.writeJSON("arr", [1, 2, 3]);
  eq("readArray reads back a stored array", storageLib.readArray("arr"), [1, 2, 3]);
  storageLib.writeJSON("not-arr", { not: "an array" });
  eq("readArray guards a wrong-shape stored value instead of returning it", storageLib.readArray("not-arr"), []);

  globalThis.localStorage = new ThrowingLocalStorage();

  eq("readRaw falls back instead of throwing when localStorage.getItem throws",
    storageLib.readRaw("anything", "safe"), "safe");
  eq("writeRaw reports failure instead of throwing when localStorage.setItem throws",
    storageLib.writeRaw("anything", "x"), false);
  eq("readJSON falls back instead of throwing when localStorage.getItem throws",
    storageLib.readJSON("anything", "safe"), "safe");
  eq("writeJSON reports failure instead of throwing when localStorage.setItem throws",
    storageLib.writeJSON("anything", { x: 1 }), false);
  eq("readArray falls back to [] instead of throwing when localStorage.getItem throws",
    storageLib.readArray("anything"), []);

  delete globalThis.localStorage;
}

// 13. src/lib/analytics.js — the §9.2 minimum-event-set sink. `track()`'s
//     entire job is appending a well-shaped entry to a capped rolling log
//     (see the file's own header comment); nothing enforced that shape or
//     the cap before this. Reuses FakeLocalStorage/ThrowingLocalStorage from
//     section 12, since analytics.js is itself a thin wrapper over
//     storage.js's readJSON/writeJSON.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`analytics: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  const eventValues = Object.values(EVENTS);
  eq("EVENTS has no duplicate event-name value", eventValues.length, new Set(eventValues).size);
  eq("EVENTS includes every §9.2 minimum event", [
    "app_opened", "lesson_started", "lesson_completed", "quiz_taken",
    "paywall_viewed", "trial_started", "subscribed", "cancelled", "ad_watched",
  ].every((name) => eventValues.includes(name)), true);

  globalThis.localStorage = new FakeLocalStorage();

  track(EVENTS.LESSON_STARTED, { lessonId: 5 });
  let log = storageLib.readArray("ecycles_analytics_log");
  eq("track() appends one entry to the rolling log", log.length, 1);
  eq("the logged entry carries the event name and props", { event: log[0].event, props: log[0].props },
    { event: "lesson_started", props: { lessonId: 5 } });
  eq("the logged entry stamps an ISO timestamp", typeof log[0].at === "string" && !Number.isNaN(Date.parse(log[0].at)), true);

  track(EVENTS.APP_OPENED);
  log = storageLib.readArray("ecycles_analytics_log");
  eq("track() defaults props to {} when the caller omits it", log[1].props, {});

  globalThis.localStorage.clear();
  for (let i = 0; i < MAX_LOGGED_EVENTS + 5; i++) track(EVENTS.QUIZ_TAKEN, { i });
  log = storageLib.readArray("ecycles_analytics_log");
  eq(`the rolling log is capped at MAX_LOGGED_EVENTS (${MAX_LOGGED_EVENTS})`, log.length, MAX_LOGGED_EVENTS);
  eq("the cap drops the oldest entries first (FIFO), keeping the most recent", log[0].props, { i: 5 });
  eq("...and the newest entry is the very last one pushed", log[log.length - 1].props, { i: MAX_LOGGED_EVENTS + 4 });

  globalThis.localStorage = new ThrowingLocalStorage();
  let threw = false;
  try {
    track(EVENTS.LESSON_COMPLETED, { lessonId: 1 });
  } catch {
    threw = true;
  }
  eq("track() degrades safely instead of throwing when localStorage.setItem throws", threw, false);

  delete globalThis.localStorage;
}

// 14. src/lib/marketData/adapters.js — the daily market-data job's provider
//     interface. Only the three pure, network-free pieces are testable here
//     (dailyCloses() itself calls fetch()): redactUrl(), which exists
//     specifically to keep a provider API key out of any log or error
//     message the job produces, so a regression here is a real key-leak
//     risk, not just a cosmetic bug; getAdapter()'s unknown-name error path;
//     and fixture.dailyCloses(), the offline/no-key adapter used for local
//     development.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`marketData/adapters: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  eq("redactUrl masks a trailing token= param (finnhub/tiingo shape)",
    redactUrl("https://finnhub.io/api/v1/stock/candle?symbol=SPY&resolution=D&token=sk_live_abc123"),
    "https://finnhub.io/api/v1/stock/candle?symbol=SPY&resolution=D&token=[REDACTED]");
  eq("redactUrl masks a leading ?token= param",
    redactUrl("https://api.tiingo.com/tiingo/daily/SPY/prices?token=sk_live_abc123&startDate=2026-01-01"),
    "https://api.tiingo.com/tiingo/daily/SPY/prices?token=[REDACTED]&startDate=2026-01-01");
  eq("redactUrl masks apikey= (twelvedata shape), case-insensitively",
    redactUrl("https://api.twelvedata.com/time_series?symbol=SPY&apikey=sk_live_abc123&interval=1day"),
    "https://api.twelvedata.com/time_series?symbol=SPY&apikey=[REDACTED]&interval=1day");
  eq("redactUrl masks camelCase apiKey= and api_key= variants",
    redactUrl("https://example.com/?apiKey=abc&x=1") + " | " + redactUrl("https://example.com/?api_key=abc&x=1"),
    "https://example.com/?apiKey=[REDACTED]&x=1 | https://example.com/?api_key=[REDACTED]&x=1");
  eq("redactUrl masks every credential param when more than one is present",
    redactUrl("https://example.com/?token=aaa&apikey=bbb"),
    "https://example.com/?token=[REDACTED]&apikey=[REDACTED]");
  eq("redactUrl leaves a URL with no credential param unchanged",
    redactUrl("https://example.com/?symbol=SPY&resolution=D"),
    "https://example.com/?symbol=SPY&resolution=D");

  eq("getAdapter returns the named adapter for every key in ADAPTERS",
    Object.keys(ADAPTERS).every((name) => getAdapter(name) === ADAPTERS[name]), true);
  let threwOnUnknownAdapter = false;
  try {
    getAdapter("not-a-real-provider");
  } catch (err) {
    threwOnUnknownAdapter = /unknown market-data adapter/.test(err.message);
  }
  eq("getAdapter throws a named error for an unknown adapter", threwOnUnknownAdapter, true);

  eq("fixture adapter declares it needs no API key", fixture.needsKey, false);
  const fixtureRun1 = await fixture.dailyCloses(["SPY", "XLK"], { days: 30 });
  const fixtureRun2 = await fixture.dailyCloses(["SPY", "XLK"], { days: 30 });
  eq("fixture.dailyCloses is deterministic across repeated calls (stable diffs)", fixtureRun1, fixtureRun2);
  eq("fixture.dailyCloses returns exactly `days` closes per symbol", Object.values(fixtureRun1).map((c) => c.length), [30, 30]);
  eq("fixture.dailyCloses returns only finite numeric closes", Object.values(fixtureRun1).flat().every(Number.isFinite), true);
}

// 15. src/lib/marketData/fred.js — fixtureEconomics(), the offline stand-in
//     for the six FRED readings the Sector-performance screen displays.
//     fetchEconomics() itself calls fetch() and isn't testable here; the
//     real regression risk on the fixture side is silent drift between
//     FRED_SERIES (what the job/screen expect) and fixtureEconomics()'s
//     hardcoded keys (what local/offline runs actually get).
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`marketData/fred: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  const seriesKeys = FRED_SERIES.map((s) => s.key).sort();
  const out = fixtureEconomics("2026-08-15");
  eq("fixtureEconomics has exactly one entry per FRED_SERIES key (no drift)",
    Object.keys(out).sort(), seriesKeys);
  eq("every fixture entry's unit matches its FRED_SERIES declaration",
    FRED_SERIES.every((s) => out[s.key].unit === s.unit), true);
  eq("every fixture entry's seriesId matches its FRED_SERIES id",
    FRED_SERIES.every((s) => out[s.key].seriesId === s.id), true);
  eq("every fixture entry carries a finite numeric value",
    Object.values(out).every((entry) => Number.isFinite(entry.value)), true);
  eq("every fixture entry is stamped with the asOf date passed in",
    Object.values(out).every((entry) => entry.date === "2026-08-15"), true);

  const outRepeat = fixtureEconomics("2026-08-15");
  eq("fixtureEconomics is deterministic across repeated calls with the same asOf", outRepeat, out);

  const outOtherDate = fixtureEconomics("2026-01-01");
  eq("a different asOf only changes the date field, not the illustrative values",
    Object.fromEntries(Object.entries(outOtherDate).map(([k, v]) => [k, v.value])),
    Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.value])));
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
