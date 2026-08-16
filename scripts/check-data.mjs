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
import { lessonTerms } from "../src/content/lessonTerms.js";
import { kidsContent } from "../src/content/kidsContent.js";
import * as marketsContent from "../src/content/markets.js";
import * as moneyVisualsContent from "../src/content/moneyVisuals.js";
import { economicSignals } from "../src/content/economicSignals.js";
import { policyScenarios } from "../src/content/policyScenarios.js";
import { sectors } from "../src/content/sectors.js";
import { MAX_BOX, dueQuestions, recordAnswer } from "../src/lib/review.js";
import { MIN_BARS, OUTPERFORM_THRESHOLD, WJ_PERIODS, wjSectorComparison } from "../src/lib/relativeStrength.js";
import { OLD_TO_NEW_LESSON_ID, migrateLegacyLessonIds } from "../src/lib/lessonIdMigration.js";
import { ROUTED_TABS, initialRoute, parseRoute, resolveRoute, routeHash } from "../src/lib/deepLink.js";
import { computeCoverage } from "./translation-review.mjs";
import * as storageLib from "../src/lib/storage.js";
import { EVENTS, MAX_LOGGED_EVENTS, elapsedSeconds, monotonicNow, quizScore, track } from "../src/lib/analytics.js";
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

// 4. glossary: every term has all 5 languages, each with a non-empty {s, f, ex}.
{
  for (const [term, entry] of Object.entries(glossary)) {
    const path = `glossary["${term}"]`;
    if (checkLangSet(entry, path)) {
      for (const lang of LANGS) {
        const def = entry[lang];
        if (def == null || typeof def !== "object") {
          fail(`${path}.${lang}: expected an {s, f, ex} object, got ${typeof def}`);
          continue;
        }
        checkNonEmptyString(def.s, `${path}.${lang}.s`);
        checkNonEmptyString(def.f, `${path}.${lang}.f`);
        checkNonEmptyString(def.ex, `${path}.${lang}.ex`);
      }
    }
  }
}

// 5. kidsContent: every age band has title/activity/parentTip in all 5
//    languages, plus a non-empty lessons array. Each lesson entry is
//    { text: {lang}, why: {lang} } — the "why" field (added 2026-08-16,
//    backlog item 21's content-depth scoping) explains why the concept
//    matters, translated the same way as text.
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
        for (const field of ["text", "why"]) {
          const lPath = `${path}.lessons[${li}].${field}`;
          if (checkLangSet(l[field], lPath)) {
            for (const lang of LANGS) checkNonEmptyString(l[field][lang], `${lPath}.${lang}`);
          }
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
  // moneyVisuals.js is new 2026-08-16 (backlog item 27) and gets parity
  // coverage from day one. Its numeric exports (budgetSegments,
  // compoundSeries, compoundYears, lossFelt) carry no language maps, so
  // checkModuleParity skips them and only the label/caption/description
  // sets are checked — which is the intent.
  moneyVisuals: moneyVisualsContent,
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

  //   11b. LAUNCH_READINESS.md's §10.4 row quotes this coverage figure, and
  //   quoting a number is how it goes stale. It reported 100%/100%/100%/100%
  //   from 2026-08-11 until backlog item 37 caught it on 2026-08-16, by which
  //   time the real figure was 93% with 3 stale entries per language — the
  //   ledger was doing its job and the scorecard was reporting the opposite.
  //   That is the same failure this whole section exists to prevent, one level
  //   up: §11 surfaces the number on every run, and nothing checked that the
  //   document claiming to be the scorecard agreed with it.
  //
  //   This FAILS rather than warns, on the §16 precedent — a warning nobody
  //   reads is indistinguishable from no check. It is deliberately narrow:
  //   the trigger is only the four coverage percentages, which move when a
  //   review lands or a lesson's English drifts past the staleness line, not
  //   on every keystroke. The row's *character-count* figures are NOT guarded,
  //   because they shift by single digits on any content edit and a build that
  //   fails over 19 characters would be turned off within a week.
  //
  //   The failure message states the exact replacement string, so the fix is a
  //   copy-paste rather than a re-derivation.
  const READINESS = "LAUNCH_READINESS.md";
  const readiness = readFileSync(join(ROOT, READINESS), "utf8");
  const expected = ["es", "ko", "zh", "ja"]
    .map((lang) => {
      const c = coverage[lang];
      const pct = c.total ? Math.round((c.reviewed / c.total) * 100) : 0;
      const humanPct = c.total ? Math.round((c.humanReviewed / c.total) * 100) : 0;
      return `${lang} ${pct}% (${humanPct}% human, ${c.stale} stale)`;
    })
    .join(", ");

  if (!readiness.includes(expected)) {
    // Report what the file currently claims, so the failure names the drift
    // rather than only the fix. An absent figure is also a failure: a run that
    // "fixes" this by deleting the sentence would otherwise pass, which is the
    // §16 blind-spot shape — a check that can be satisfied by removing the
    // thing it checks.
    const found = readiness.match(/es \d+% \(\d+% human, \d+ stale\)(?:, (?:ko|zh|ja) \d+% \(\d+% human, \d+ stale\))*/);
    fail(
      `${READINESS} §10.4's translation-coverage figure disagrees with the live ledger.\n` +
        `       it says:  ${found ? found[0] : "(no coverage figure found in the file at all)"}\n` +
        `       should be: ${expected}\n` +
        `       Replace that sentence verbatim. See backlog item 37 for why this is checked.`,
    );
  }
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

  // §9.2's two payload requirements — "lesson completed (with duration)" and
  // "quiz taken (with score)". Both numbers are produced by pure helpers in
  // analytics.js precisely so they can be checked here without a browser;
  // the screens only supply the readings and the counts.
  eq("elapsedSeconds rounds a millisecond span to whole seconds", elapsedSeconds(1_000, 62_400), 61);
  eq("elapsedSeconds returns 0 for an instant completion, not null", elapsedSeconds(500, 500), 0);
  eq("elapsedSeconds returns null when the start reading was never taken",
    elapsedSeconds(null, 5_000), null);
  eq("elapsedSeconds returns null rather than a wrong number when time appears to run backwards",
    elapsedSeconds(9_000, 1_000), null);
  eq("monotonicNow returns a finite millisecond reading", Number.isFinite(monotonicNow()), true);
  eq("two monotonicNow readings never go backwards", monotonicNow() <= monotonicNow(), true);

  eq("quizScore carries the raw counts alongside the percentage",
    quizScore(3, 4), { correct: 3, total: 4, scorePct: 75 });
  eq("quizScore rounds the percentage", quizScore(1, 3), { correct: 1, total: 3, scorePct: 33 });
  eq("quizScore handles a perfect and a zero score", [quizScore(2, 2).scorePct, quizScore(0, 5).scorePct], [100, 0]);
  eq("quizScore refuses to divide by zero", quizScore(0, 0), { correct: null, total: null, scorePct: null });
  eq("quizScore rejects more correct answers than questions",
    quizScore(5, 3), { correct: null, total: null, scorePct: null });

  // The event-name split this instrumentation depends on: `quiz_taken` is now
  // once per finished quiz (with a score) and `quiz_answered` is the
  // per-question signal it used to carry. Both names must exist and differ,
  // or one of the two call-site kinds is silently logging as the other.
  eq("QUIZ_ANSWERED exists and is distinct from QUIZ_TAKEN",
    EVENTS.QUIZ_ANSWERED !== undefined && EVENTS.QUIZ_ANSWERED !== EVENTS.QUIZ_TAKEN, true);
}

// 13b. The §9.2 payload requirements at the *call sites*, checked against the
//      screen sources. The helpers above prove the numbers are computed
//      correctly; this proves the screens actually pass them — the exact gap
//      that existed before (both events fired, neither carried its §9.2
//      field). Source-text checks, not behavioural ones: these files render
//      React and cannot be imported here.
{
  const reader = readFileSync(new URL("../src/screens/LessonReader.jsx", import.meta.url), "utf8");
  const practice = readFileSync(new URL("../src/screens/Practice.jsx", import.meta.url), "utf8");

  const check = (label, ok) => { if (!ok) fail(`analytics call sites: ${label}`); };

  check("LessonReader's LESSON_COMPLETED must carry a durationSec (§9.2 'with duration')",
    /EVENTS\.LESSON_COMPLETED[\s\S]{0,200}?durationSec:\s*elapsedSeconds\(/.test(reader));
  check("LessonReader's QUIZ_TAKEN must spread a quizScore (§9.2 'with score')",
    /EVENTS\.QUIZ_TAKEN[\s\S]{0,240}?\.\.\.quizScore\(/.test(reader));
  check("Practice's QUIZ_TAKEN must spread a quizScore (§9.2 'with score')",
    /EVENTS\.QUIZ_TAKEN[\s\S]{0,240}?\.\.\.quizScore\(/.test(practice));
  check("per-question answers must fire QUIZ_ANSWERED, not QUIZ_TAKEN, in LessonReader",
    /EVENTS\.QUIZ_ANSWERED/.test(reader));
  check("per-question answers must fire QUIZ_ANSWERED, not QUIZ_TAKEN, in Practice",
    /EVENTS\.QUIZ_ANSWERED/.test(practice));
  // A quiz is taken once, not once per answer: neither screen may fire
  // QUIZ_TAKEN from inside a Question's onAnswered handler without a guard.
  check("LessonReader fires QUIZ_TAKEN exactly once per lesson-open (guarded by quizFiredRef)",
    /quizFiredRef\.current\s*=\s*true;\s*\n\s*track\(EVENTS\.QUIZ_TAKEN/.test(reader));
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

// 16. In-prose lesson cross-references ("...see Lesson 32") must point at the
//     same lesson in every language. This exists because of a real shipped
//     bug (backlog item 33): the 2026-08-14 lesson-id renumbering rewrote
//     English references with a regex that matched capital "Lesson N" only,
//     so lowercase English mentions and *every* non-English mention kept
//     their pre-renumbering ids. 74 references across es/ko/zh/ja pointed at
//     the wrong lesson for two days, silently — nothing in the app or the
//     build can notice a link that resolves to a real-but-wrong lesson.
//
//     The check is deliberately asymmetric: a translation may carry FEWER
//     references than English (several are condensed and legitimately drop
//     one), but every number it does carry must appear in that lesson's
//     English reference set. That is the property a renumbering breaks, and
//     it needs no per-language translation judgement to verify.
//
//     Covers lesson prose AND quizData.js `explain` fields. The quiz half was
//     added 2026-08-16 after this check's first version missed seven stale
//     references there — it walked lesson prose only, so quiz explanations
//     went unscanned through two separate repair passes.
//
//     SECOND KNOWN LIMIT, added 2026-08-16 after it bit: this check is only as
//     good as REF_PATTERNS covering the surface forms each language ACTUALLY
//     writes. The ko and ja patterns originally matched `레슨 N` / `レッスン N`
//     while the prose overwhelmingly used `N강` / `第N課`, so those two
//     languages went effectively unscanned — and the earlier repair pass that
//     reported "74 fixed, 0 remain" was measuring through the same blind
//     patterns. 67 stale ko/ja references were still there, and `npm test`
//     passed the whole time. Before trusting a green result here, check that
//     each language's reference COUNT is plausible against its prose; a
//     near-zero count means the pattern is wrong, not that the content is
//     clean. The coverage tripwire at the end of this section prints the
//     per-language match count on every run and warns when one collapses.
//
//     KNOWN LIMIT, do not mistake this check for more than it is: it verifies
//     the translations AGREE WITH English. It cannot verify English is right.
//     When the renumbering left "Lessons 18 and 20" stale in every language at
//     once, all five agreed and this check stayed silent; a human reading the
//     sentence ("a 401(k) or life insurance policy from Lessons 18 and 20")
//     against the lesson titles is what caught it. The only correctness guard
//     here is the real-lesson-id check below, which catches a reference to an
//     id that does not exist — not one that exists but is wrong.
{
  // Per-language surface forms of "Lesson N". Capture group 1 is the number,
  // or — for the languages that write them that way — a *list* of numbers.
  //
  // The plural/multi-number form matters more than it looks. The 2026-08-14
  // renumbering's regex matched the singular "Lesson N", so the one plural
  // reference in the content ("...a 401(k) or life insurance policy from
  // Lessons 18 and 20") survived untouched in English, es AND zh at once. All
  // five languages therefore agreed with each other, and the first version of
  // this check — which only ever compared translations against English —
  // structurally could not see it. See item 33's third pass: a consistency
  // check and a correctness check are not the same thing, and pooling every
  // number in the phrase is what lets this one catch the English side at all
  // (via the real-lesson-id check below).
  // Every language needs EVERY surface form its own prose actually uses, not
  // the one form a reader of the English would guess. The ko and ja patterns
  // below each carry two alternatives because the translations overwhelmingly
  // use the second one: of 44 Korean references, `레슨 N` covered exactly 1 and
  // `N강` covered 43; of 31 Japanese references, `レッスン N` covered 1 and
  // `第N課` covered 30. So for two of the five languages this check was, in
  // practice, scanning nothing — and it reported a clean pass over 67 stale
  // references (item 36). A pattern that matches almost none of its language's
  // real prose fails silently and looks exactly like a pattern that passes.
  //
  // Note zh `第N课` and ja `第N課` differ only in simplified vs. traditional
  // 课/課. That single-codepoint difference is why the ja form was missed while
  // the zh one worked: they look like the same pattern and are not.
  const REF_PATTERNS = {
    en: /\bLessons?\s+(\d+(?:\s*(?:,|and|&)\s*\d+)*)/gi,
    es: /\bLecci[óo]n(?:es)?\s+(\d+(?:\s*(?:,|y|e)\s*\d+)*)/gi,
    ko: /레슨\s*(\d+)|(\d+)\s*강/g,
    zh: /第\s*(\d+)\s*课/g,
    // 講 added 2026-08-16: the ja prose uses 課 and 講 interchangeably, and the
    // item-36 pass added only 課 — leaving 11 more stale references invisible.
    // That miss did not trip the coverage tripwire below either, because ja
    // still matched ~48% of English. See the UNRECOGNIZED-COUNTER guard after
    // the tripwire, which is what actually generalizes: enumerating surface
    // forms by hand has now failed three times in a row.
    ja: /レッスン\s*(\d+)|第\s*(\d+)\s*[課講]/g,
  };

  const lessonTitle = new Map(lessons.map((l) => [l.id, l.title.en]));

  const refsIn = (text, lang) => {
    if (!text) return [];
    const re = new RegExp(REF_PATTERNS[lang].source, REF_PATTERNS[lang].flags);
    const out = [];
    let m;
    while ((m = re.exec(text))) {
      // Pool ALL capture groups, not just group 1: the ko/ja patterns are
      // alternations, so the number lands in group 2 for the `N강` / `第N課`
      // branch. Reading only m[1] would make those branches match-but-capture-
      // nothing, which is the same silent no-op as not having the pattern.
      const captured = m.slice(1).filter(Boolean).join(" ");
      for (const n of captured.match(/\d+/g) ?? []) out.push(Number(n));
    }
    return out;
  };

  // Every translated prose field of a lesson, as [path, languageMap] pairs.
  const proseFields = (entry, id) => {
    const fields = [];
    (entry.sections ?? []).forEach((sec, i) => {
      if (sec.heading) fields.push([`lessonContent[${id}].sections[${i}].heading`, sec.heading]);
      if (sec.body) fields.push([`lessonContent[${id}].sections[${i}].body`, sec.body]);
    });
    if (entry.takeaway) fields.push([`lessonContent[${id}].takeaway`, entry.takeaway]);
    if (entry.thinkAbout) fields.push([`lessonContent[${id}].thinkAbout`, entry.thinkAbout]);
    return fields;
  };

  for (const [idKey, entry] of Object.entries(lessonContent)) {
    const id = Number(idKey);
    const fields = proseFields(entry, id);

    // The lesson's English references, pooled across all its prose fields —
    // pooled rather than per-field because translations routinely move a
    // reference into a different section or into the takeaway.
    const englishRefs = new Set(fields.flatMap(([, map]) => refsIn(map.en, "en")));

    // An English reference to a lesson that doesn't exist is its own bug.
    for (const n of englishRefs) {
      if (!lessonTitle.has(n)) {
        fail(`lessonContent[${id}]: English prose references "Lesson ${n}", which is not a real lesson id`);
      }
    }

    for (const [path, map] of fields) {
      for (const lang of LANGS) {
        if (lang === "en") continue;
        for (const n of refsIn(map[lang], lang)) {
          if (englishRefs.has(n)) continue;
          const expected = [...englishRefs].sort((a, b) => a - b);
          fail(
            `${path}.${lang}: references lesson ${n} ("${lessonTitle.get(n) ?? "no such lesson"}"), ` +
              `which the English text of lesson ${id} never references — ` +
              `its English references are [${expected.join(", ") || "none"}]. ` +
              `A translated cross-reference must point at the same lesson as the English it mirrors ` +
              `(this is how the 2026-08-14 renumbering left 74 stale references in es/ko/zh/ja; ` +
              `see AGENT_LOG.md item 33).`,
          );
        }
      }
    }
  }

  // Quiz explanations carry cross-references too ("...the same compounding
  // math from Lesson 3"), and the first version of this check walked lesson
  // prose only — so seven stale references survived *two* separate repair
  // passes before anyone scanned quizData.js at all (item 33, third pass).
  //
  // Scoped per quiz item rather than pooled per lesson: unlike a lesson's
  // prose, an `explain` field has no sibling field for a translation to move a
  // reference into, so the item's own English set is the correct comparison
  // and a looser one would just re-open the hole.
  quizData.forEach((item, i) => {
    if (!item.explain) return;
    const path = `quizData[${i}] (lesson ${item.lesson}).explain`;
    const englishRefs = new Set(refsIn(item.explain.en, "en"));

    for (const n of englishRefs) {
      if (!lessonTitle.has(n)) {
        fail(`${path}.en: references "Lesson ${n}", which is not a real lesson id`);
      }
    }

    for (const lang of LANGS) {
      if (lang === "en") continue;
      for (const n of refsIn(item.explain[lang], lang)) {
        if (englishRefs.has(n)) continue;
        const expected = [...englishRefs].sort((a, b) => a - b);
        fail(
          `${path}.${lang}: references lesson ${n} ("${lessonTitle.get(n) ?? "no such lesson"}"), ` +
            `which this quiz explanation's English text never references — ` +
            `its English references are [${expected.join(", ") || "none"}]. ` +
            `Quiz explanations were the blind spot that kept item 33 open through two repair passes; ` +
            `see AGENT_LOG.md item 33.`,
        );
      }
    }
  });

  // Surface-form coverage tripwire. The failure this exists for is not a stale
  // reference — it is a PATTERN that silently matches nothing, which presents
  // as a clean pass. ko and ja each sat at 1 matched reference against 40+ real
  // ones in the prose, and every check above passed for as long as that lasted.
  //
  // The rule is deliberately loose: translations legitimately condense and drop
  // references, so a lower count than English is normal and not worth a warning.
  // What is NOT normal is a language whose count collapses toward zero while its
  // prose plainly carries references. 20% of English is well under any real
  // translation ratio (the lowest here is ~48%) and well above the ~1.5% a
  // dead pattern produces.
  const refTotals = Object.fromEntries(LANGS.map((l) => [l, 0]));
  const countIn = (map) => {
    for (const lang of LANGS) refTotals[lang] += refsIn(map[lang], lang).length;
  };
  for (const [idKey, entry] of Object.entries(lessonContent)) {
    for (const [, map] of proseFields(entry, Number(idKey))) countIn(map);
  }
  for (const item of quizData) if (item.explain) countIn(item.explain);

  console.log(
    `  cross-references matched per language: ${LANGS.map((l) => `${l}=${refTotals[l]}`).join(", ")}`,
  );
  for (const lang of LANGS) {
    if (lang === "en") continue;
    if (refTotals[lang] < refTotals.en * 0.2) {
      warn(
        `§16: only ${refTotals[lang]} cross-references matched in "${lang}" against ${refTotals.en} in English. ` +
          `That is almost certainly a REF_PATTERNS surface-form gap, not clean content — ` +
          `grep the ${lang} prose for how it actually writes "Lesson N". ` +
          `This is exactly how 67 stale ko/ja references passed every check (AGENT_LOG.md item 36).`,
      );
    }
  }

  // UNRECOGNIZED-COUNTER GUARD.
  //
  // The tripwire above only catches a pattern that matches almost NOTHING. It
  // cannot catch a PARTIAL surface-form gap, and that is what has actually
  // happened every time: ja wrote both 第N課 and 第N講, the item-36 pass added
  // only 課, and the remaining 11 stale 講 references sat at ~48% coverage —
  // comfortably above the 20% floor, so nothing complained.
  //
  // Hand-enumerating surface forms has now failed three times (singular-only
  // "Lesson N"; then 레슨/レッスン while the prose used N강/第N課; then 課
  // while it also used 講). So this guard inverts the problem: instead of
  // listing the forms we accept, it finds the unambiguous CJK ordinal
  // construction 第<number><counter> and fails on any counter NOT in the known
  // set. A translator reaching for a fourth counter breaks the build with the
  // exact character in the message, instead of silently disabling the check.
  {
    // Counters that DO mean "Lesson N" — every one of these is matched by
    // REF_PATTERNS above, so the cross-reference check actually sees them.
    const LESSON_COUNTERS = new Set(["課", "講", "课"]);

    // Counters that appear in this content and do NOT mean "Lesson N". Each was
    // read in context against its English source before being listed here — an
    // unexplained entry in this set would re-create exactly the blind spot the
    // guard exists to close, so keep the justification attached:
    //   週 — lessonContent[1].sections[2].ja "マリアの第3週の意志力" = her third
    //        WEEK's willpower. A duration, not a lesson.
    //   節 — lessonContent[8].sections[2].ja "第1節では" mirrors the English
    //        "Section 1 explained..." — an intra-lesson section, not a lesson.
    //   种 — lessonContent[34].sections[2].zh "第4种工具" = the fourth KIND of
    //        tool, mirroring the English "All four tools...".
    const NON_LESSON_COUNTERS = new Set(["週", "節", "种"]);

    const scanCounters = (path, map) => {
      for (const lang of ["ja", "zh", "ko"]) {
        for (const m of (map[lang] ?? "").matchAll(/第\s*(\d+)\s*(.)/g)) {
          if (LESSON_COUNTERS.has(m[2]) || NON_LESSON_COUNTERS.has(m[2])) continue;
          fail(
            `${path}.${lang}: found "第${m[1]}${m[2]}" — an ordinal construction whose counter ` +
              `"${m[2]}" is in neither LESSON_COUNTERS nor NON_LESSON_COUNTERS. If it means ` +
              `"Lesson ${m[1]}", the cross-reference check is silently skipping it (this is how ` +
              `11 stale ja references survived the item-36 pass): add "${m[2]}" to ` +
              `REF_PATTERNS.${lang} and LESSON_COUNTERS, then re-verify. If it means something ` +
              `else, add it to NON_LESSON_COUNTERS **with the sentence and its English source**, ` +
              `the way the existing entries are justified. Do not add it bare.`,
          );
        }
      }
    };
    for (const [idKey, entry] of Object.entries(lessonContent)) {
      for (const [path, map] of proseFields(entry, Number(idKey))) scanCounters(path, map);
    }
    quizData.forEach((item, i) => {
      if (item.explain) scanCounters(`quizData[${i}].explain`, item.explain);
    });
  }
}

// 17. src/content/lessonTerms.js — the §3.0.3 lesson→glossary links (backlog
//     item 28). The map is hand-curated because an automatic prose match links
//     the wrong sense (money lesson 12's "PMI" is private mortgage insurance,
//     not Purchasing Managers' Index; lesson 17's is *lifestyle* inflation).
//     Curation is a judgement call and cannot be checked here — but the four
//     ways a curated map rots mechanically can be, and are:
//
//       (a) it names a lesson or section that no longer exists,
//       (b) it names a glossary key that no longer exists,
//       (c) it repeats a term inside one lesson (rule 3 — chips are once per
//           lesson, on first use), or
//       (d) it tags a section whose English text does not actually contain
//           the term any more.
//
//     (d) is the one that matters most and the one nothing else would catch:
//     a chip whose section was reworded or reordered still renders happily,
//     pointing a learner at a definition for a word that is no longer on the
//     screen. The presence test runs against the ENGLISH heading + body only —
//     English is the source the curation was done against, and the chips
//     render from glossary keys rather than from matched prose, so no
//     per-language matching is involved or wanted here.
//
//     The match is case-insensitive and allows a trailing plural "s" ("index
//     funds" satisfies "Index Fund"), but is anchored on both sides so it
//     cannot fire on a word that merely CONTAINS the term. That anchoring is
//     not hypothetical tidiness: a plain substring test accepted "Vesting" on
//     six lessons during item 35 because every one of them says "investing".
//     \b is not usable here — glossary keys include "401(k)", whose last
//     character is not a word character — hence the explicit lookarounds.
{
  const seenPerLesson = new Map();
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mentions = (haystack, name) =>
    new RegExp(`(?<![A-Za-z0-9])${escapeRe(name)}s?(?![A-Za-z0-9])`, "i").test(haystack);

  for (const [idKey, byIndex] of Object.entries(lessonTerms)) {
    const id = Number(idKey);
    const entry = lessonContent[id];
    if (!entry) {
      fail(`lessonTerms[${id}]: no lesson with that id in lessonContent`);
      continue;
    }

    for (const [indexKey, terms] of Object.entries(byIndex)) {
      const index = Number(indexKey);
      const section = entry.sections[index];
      const path = `lessonTerms[${id}][${index}]`;

      if (!section) {
        fail(`${path}: lesson ${id} has only ${entry.sections.length} section(s)`);
        continue;
      }
      if (!Array.isArray(terms) || terms.length === 0) {
        fail(`${path}: must be a non-empty array of glossary keys`);
        continue;
      }

      const haystack = `${section.heading.en}\n${section.body.en}`;

      for (const term of terms) {
        if (!glossary[term]) {
          fail(`${path}: "${term}" is not a key in glossary.js`);
          continue;
        }

        const key = `${id}:${term}`;
        if (seenPerLesson.has(key)) {
          fail(
            `${path}: "${term}" is already linked in section ${seenPerLesson.get(key)} of lesson ${id} — ` +
              `a term is chipped once per lesson, on its first use (lessonTerms.js curation rule 3)`,
          );
        } else {
          seenPerLesson.set(key, index);
        }

        // The English key and the English short name are both acceptable
        // surface forms — glossary keys like "QE" are spelled out in prose as
        // "quantitative easing" and vice versa.
        const names = [term, glossary[term].en.s].filter(Boolean);
        if (!names.some((name) => mentions(haystack, name))) {
          fail(
            `${path}: "${term}" is linked from a section whose English text never mentions it ` +
              `(looked for ${names.map((n) => `"${n}"`).join(" or ")} in "${section.heading.en}"). ` +
              `Either the section was reworded and the link is now stale, or the link was wrong ` +
              `to begin with — see lessonTerms.js curation rule 4.`,
          );
        }
      }
    }
  }

  // Every locale must carry the chip row's label, or four of the five
  // languages render an unlabelled row of buttons.
  for (const lang of LANGS) {
    checkNonEmptyString(TR[lang]?.lessonTermsLabel, `TR.${lang}.lessonTermsLabel`);
  }

  // The reader must actually render the component. The map and the component
  // can both be perfect while nothing calls them — which is exactly the state
  // §3.0.3 was in before item 28 (a glossary existed; nothing linked to it).
  const reader = readFileSync(new URL("../src/screens/LessonReader.jsx", import.meta.url), "utf8");
  if (!/<GlossaryTerms[\s\S]{0,160}termsForSection\(/.test(reader)) {
    fail("LessonReader must render <GlossaryTerms> with termsForSection() (§3.0.3, backlog item 28)");
  }
}

// 18. src/lib/deepLink.js — §5's "each lesson a shareable URL" (backlog item
//     31). The module is deliberately split so its rules are checkable without
//     a browser: everything except `useDeepLink` is pure, and that is the half
//     where a shared link actually breaks.
//
//     What is checked, and why each one is a real failure mode rather than a
//     restatement of the code:
//
//       (a) round-tripping. A hash the app WRITES must parse back to the state
//           it was written from, for every lesson and every tab. If it doesn't,
//           the sync in `useDeepLink` never settles: state writes a hash, the
//           hash resolves to different state, which writes a different hash.
//       (b) lesson links address a lesson by `id`, not by path index. An
//           indexed link rots into a link to a *different lesson* the next time
//           a track is reordered — silently, which is the whole reason the
//           2026-08-14 renumbering took a scripted migration.
//       (c) garbage in a shared link is survivable: a nonexistent id, a
//           non-numeric id, an unknown tab and an empty hash all resolve to the
//           lesson path rather than to a blank screen or a crash.
//       (d) a locked lesson does not open from a URL. This is the check that
//           guards a product decision (CLAIMS.md A1, sequential unlocking)
//           rather than a coding mistake — a permissive resolver would void
//           that bet from outside the app, and nothing else in the repo would
//           notice.
//       (e) `App.jsx` actually calls both halves. The module can be perfect
//           while nothing imports it — the same "it greps as done" failure §13b
//           was added for.
{
  const lessonPath = lessonsByTrack();

  // (a) + (b): every lesson round-trips, through its id.
  for (const [index, lesson] of lessonPath.entries()) {
    const hash = routeHash({ tab: "learn", reading: index, lessons: lessonPath });
    if (hash !== `#/lesson/${lesson.id}`) {
      fail(`deepLink: lesson at index ${index} formats as "${hash}", expected "#/lesson/${lesson.id}" (§5 links address lessons by id, not index)`);
    }
    const back = resolveRoute(hash, lessonPath, () => true);
    if (back.tab !== "learn" || back.reading !== index) {
      fail(`deepLink: "${hash}" resolved to ${JSON.stringify(back)}, expected {tab:"learn",reading:${index}}`);
    }
  }

  // (a) for the three tab routes.
  for (const tab of ROUTED_TABS) {
    const hash = routeHash({ tab, reading: null, lessons: lessonPath });
    if (hash !== `#/${tab}`) fail(`deepLink: tab "${tab}" formats as "${hash}"`);
    const back = resolveRoute(hash, lessonPath, () => true);
    if (back.tab !== tab || back.reading !== null) {
      fail(`deepLink: "${hash}" resolved to ${JSON.stringify(back)}, expected {tab:"${tab}",reading:null}`);
    }
  }

  // (c) garbage resolves to the path, never to a crash or a blank tab.
  const maxId = Math.max(...lessonPath.map((l) => l.id));
  for (const bad of ["", "#", "#/", "#/nope", `#/lesson/${maxId + 1}`, "#/lesson/abc", "#/lesson/1e2", "#/lesson/", "#/lesson/1/2", "#/glossary"]) {
    const back = resolveRoute(bad, lessonPath, () => true);
    if (back.tab !== "learn" || back.reading !== null) {
      fail(`deepLink: unrecognised hash ${JSON.stringify(bad)} resolved to ${JSON.stringify(back)}, expected the lesson path`);
    }
  }

  // Parsing is case-insensitive and tolerates a trailing slash — a link that
  // has been through a chat client or a CMS should still open.
  for (const variant of ["#/LESSON/1", "#/lesson/1/", "#lesson/1", "#/Practice"]) {
    if (parseRoute(variant) === null) fail(`deepLink: "${variant}" should parse (links get case-mangled and slash-mangled in transit)`);
  }

  // (d) a locked lesson does not open from a URL.
  {
    const lockedIndex = lessonPath.findIndex((l, i) => i > 0 && lessonPath[i - 1].track === l.track);
    const lockedId = lessonPath[lockedIndex].id;
    const nothingCompleted = (index) => {
      const prev = lessonPath[index - 1];
      return !prev || prev.track !== lessonPath[index].track;
    };
    const back = resolveRoute(`#/lesson/${lockedId}`, lessonPath, nothingCompleted);
    if (back.reading !== null) {
      fail(`deepLink: a URL opened lesson ${lockedId}, which is locked — sequential unlocking (CLAIMS.md A1) must not be reachable around`);
    }
    // ...and the first lesson of a track, which is never locked, still does.
    const openBack = resolveRoute(`#/lesson/${lessonPath[0].id}`, lessonPath, nothingCompleted);
    if (openBack.reading !== 0) {
      fail(`deepLink: lesson ${lessonPath[0].id} is the first of its track and must open from a URL, got ${JSON.stringify(openBack)}`);
    }
  }

  // §3.2's first-open routing survives: no link still lands a new install in
  // lesson 1, and a returning visitor still lands on the path.
  if (initialRoute("", lessonPath, () => true, true).reading !== 0) {
    fail("deepLink: initialRoute with no hash must still open a first-time visitor in lesson 1 (§3.2)");
  }
  if (initialRoute("", lessonPath, () => true, false).reading !== null) {
    fail("deepLink: initialRoute with no hash must land a returning visitor on the path");
  }
  // A link always wins over first-open routing, or a shared link is useless to
  // exactly the audience §5 is trying to reach — people who have never opened
  // the app before.
  const linked = initialRoute(`#/lesson/${lessonPath[1].id}`, lessonPath, () => true, true);
  if (linked.reading !== 1) fail("deepLink: a link must win over first-open routing for a first-time visitor");
  if (initialRoute("#/reference", lessonPath, () => true, true).tab !== "reference") {
    fail("deepLink: a tab link must win over first-open routing for a first-time visitor");
  }
  // ...but a lesson link a first-time visitor CANNOT open (locked, or a bad
  // id) falls back to lesson 1, not to a cold menu. This is the §5 arrival
  // case — someone sent a clip of lesson 20 has no progress, so the link
  // cannot resolve, and a menu is the §3.2 outcome the app exists to avoid.
  for (const dead of [`#/lesson/${lessonPath[1].id}`, `#/lesson/${maxId + 1}`]) {
    const first = initialRoute(dead, lessonPath, (i) => i === 0, true);
    if (first.reading !== 0) {
      fail(`deepLink: a first-time visitor arriving at an unopenable ${dead} should land in lesson 1 (§3.2), got ${JSON.stringify(first)}`);
    }
    // A returning visitor keeps the path: they have their own progress on it,
    // and dropping them back into lesson 1 would discard it.
    const returning = initialRoute(dead, lessonPath, (i) => i === 0, false);
    if (returning.reading !== null) {
      fail(`deepLink: a returning visitor arriving at an unopenable ${dead} should land on the path, got ${JSON.stringify(returning)}`);
    }
  }

  // (e) the shell wires both halves up.
  const app = readFileSync(join(ROOT, "src/App.jsx"), "utf8");
  if (!/initialRoute\(/.test(app) || !/useDeepLink\(/.test(app)) {
    fail("App.jsx must call both initialRoute() and useDeepLink() — the module routing nothing is indistinguishable from no routing (§5, backlog item 31)");
  }
}

// 19. src/content/policyScenarios.js — the "Be the Fed Chair" simulator
//     (backlog item 34). checkModuleParity above would cover `situation` and
//     `question` for free, but not the language maps nested inside each
//     option's array — which is where most of the words are — so this walks
//     the whole shape instead of adding the module to CONTENT_MODULES.
//
//     The last check here is the interesting one. This content deliberately
//     names other lessons by subject ("the QE and QT lesson") rather than by
//     number, because §16's cross-reference guard walks lesson prose and quiz
//     explanations and would never see a stale number in this file. Two
//     renumberings have already left stale ids across five languages; this
//     fails the build rather than let a third one hide here. If a future run
//     genuinely wants numbered references, the fix is to extend §16's scan to
//     this module, not to delete this check.
{
  const seenIds = new Set();
  const lessonIds = new Set(lessons.map((l) => l.id));

  // The surface forms §16 knows about, in all five languages — deliberately
  // copied from its REF_PATTERNS rather than re-invented, including ja's 課
  // *and* 講 (the prose uses both) and zh's simplified 课.
  //
  // The `\d\s*강` form carries no trailing \b on purpose. The first draft of
  // this check wrote `\d\s*강\b` and an injected `37강의` sailed straight
  // through it: JS's \b is ASCII-based, so between 강 and 의 — two non-word
  // characters — there is no boundary to match. That is the same instrument-
  // blindness item 36 was about, caught here only because the injection test
  // was actually run instead of assumed.
  const numberedRef =
    /(?:Lesson|Lección|Lecciones|Lessons)\s*\d|레슨\s*\d|\d\s*강|第\s*\d+\s*[课課講]|レッスン\s*\d/i;

  if (policyScenarios.length === 0) fail("policyScenarios: no scenarios defined — PolicySim would render nothing anywhere");

  for (const scenario of policyScenarios) {
    const path = `policyScenarios[${scenario.id}]`;

    if (typeof scenario.id !== "string" || scenario.id.length === 0) fail(`${path}: scenario needs a non-empty string id`);
    if (seenIds.has(scenario.id)) fail(`${path}: duplicate scenario id — ids key React lists and must be unique`);
    seenIds.add(scenario.id);

    if (!lessonIds.has(scenario.lessonId)) {
      fail(`${path}: lessonId ${scenario.lessonId} is not a real lesson — the simulator would never render`);
    }

    for (const field of ["situation", "question"]) {
      if (checkLangSet(scenario[field], `${path}.${field}`)) {
        for (const lang of LANGS) checkNonEmptyString(scenario[field][lang], `${path}.${field}.${lang}`);
      }
    }

    // Two levers is a choice; one is a statement with a button on it.
    if (!Array.isArray(scenario.options) || scenario.options.length < 2) {
      fail(`${path}.options: expected at least 2 options, got ${scenario.options?.length}`);
      continue;
    }

    const seenOptions = new Set();
    for (const option of scenario.options) {
      const oPath = `${path}.options[${option.id}]`;
      if (typeof option.id !== "string" || option.id.length === 0) fail(`${oPath}: option needs a non-empty string id`);
      if (seenOptions.has(option.id)) fail(`${oPath}: duplicate option id within one scenario`);
      seenOptions.add(option.id);

      for (const field of ["label", "outcome"]) {
        if (checkLangSet(option[field], `${oPath}.${field}`)) {
          for (const lang of LANGS) checkNonEmptyString(option[field][lang], `${oPath}.${field}.${lang}`);
        }
      }
    }
  }

  // Every string in the module, checked for a numbered lesson reference.
  for (const scenario of policyScenarios) {
    const strings = [
      ...LANGS.flatMap((l) => [scenario.situation?.[l], scenario.question?.[l]]),
      ...(scenario.options || []).flatMap((o) => LANGS.flatMap((l) => [o.label?.[l], o.outcome?.[l]])),
    ].filter((s) => typeof s === "string");
    for (const s of strings) {
      if (numberedRef.test(s)) {
        fail(`policyScenarios[${scenario.id}]: numbered lesson reference in "${s.slice(0, 80)}…" — name the lesson by subject, or extend §16's scan to this file`);
      }
    }
  }

  // And the component actually mounts it: a module nothing renders is
  // indistinguishable from no simulator (the §5 lesson from item 31's check).
  const reader = readFileSync(join(ROOT, "src/screens/LessonReader.jsx"), "utf8");
  if (!/<PolicySim\b/.test(reader)) {
    fail("LessonReader.jsx must render <PolicySim> — the scenarios exist but nothing shows them (backlog item 34)");
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
