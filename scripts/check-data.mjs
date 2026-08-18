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
import { deliberatelyUnlinked, lessonTerms } from "../src/content/lessonTerms.js";
import { kidsContent } from "../src/content/kidsContent.js";
import * as marketsContent from "../src/content/markets.js";
import * as moneyVisualsContent from "../src/content/moneyVisuals.js";
import { bracketBands, bracketIncomes, bracketTax, bracketTiers } from "../src/content/moneyVisuals.js";
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
import { FUTURE_TOLERANCE_DAYS, STALE_AFTER_DAYS, freshness } from "../src/lib/useMarketData.js";
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

// ───────────────────────────────────────────────────────────────────────────
// READING_MODEL — what "≈N min" on a lesson means (backlog item 56).
//
// §3.0.5 asks for "an honest minutes estimate"; the figure is shown on the
// Learn list and again in the reader, and `refresh-readiness.mjs` sums it into
// the ~2-hour total that §4.3's Phase-0 content clause is measured against. So
// the model below is load-bearing three ways over, and it is written here
// rather than inline because deciding it is the actual work — see DECISIONS.md
// ("How a lesson's `minutes` estimate is computed").
//
// WHAT ITEM 56 GOT RIGHT AND WRONG. It was filed as "nothing checks that a
// lesson's stated minutes is honest." That premise was **false**: this check
// has enforced `minutes === round(words/200)` since before the 2026-08-07
// content split, and all 40 lessons satisfied it. The item's evidence — "6 of
// 40 overstate by more than 15%" — was two artifacts stacked: it estimated
// word count as `chars / 5.5` when the real ratio is 5.77 (inflating every
// lesson by ~5%), and it then read *rounding* as error, since a lesson stated
// as 2 minutes legitimately covers anything in [1.5, 2.5) — a ratio of up to
// 1.25x with nothing wrong. Its direction word was also backwards: those six
// lessons take *longer* than stated, which understates rather than overstates.
//
// WHAT WAS ACTUALLY WRONG is the thing the item told the run to decide, and it
// is a modelling error, not a data error: the old count read section *bodies*
// plus takeaway and thinkAbout, and nothing else. It omitted the lesson title
// and subtitle, every section heading, and **the entire end-of-lesson check** —
// its question, its four options, and the explanation the reader is shown after
// answering. That is 5,807 of 29,385 words, ~20% of what the default path puts
// on screen, so every estimate in the app was systematically short. The check
// is not optional or secondary: LessonReader renders it in the same pushed view
// with no separate navigation, and its own comment calls it the thing that
// "makes the reading stick."
//
// WHAT IS COUNTED: every English word the default path renders — title,
// subtitle, each section heading and body, takeaway, thinkAbout, and for each
// of the lesson's check questions its text, all options, and the explanation.
//
// WHAT IS NOT, deliberately, and each of these makes the estimate conservative
// rather than optimistic — except the last:
//   • Time spent *thinking* before answering a check question. Reading the
//     question is counted; deliberating over it is not. Quantifying it would
//     mean inventing a second constant with no measurement behind it.
//   • Time on the four inline diagrams and the policy simulator.
//   • Glossary term chips, which are optional taps — this one cuts the other
//     way, and is why the count is a floor on a curious reader's time, not a
//     promise about one.
// English is the reference language: the figure is one integer shown in all
// five, and whitespace word-counting is meaningless for zh/ja.
const READING_WPM = 200;
const wordsIn = (...texts) =>
  texts.reduce((n, t) => n + (String(t || "").match(/\S+/g) || []).length, 0);

function lessonWords(lesson, content) {
  let words = wordsIn(lesson.title?.en, lesson.subtitle?.en, content.takeaway?.en, content.thinkAbout?.en);
  for (const section of content.sections || []) words += wordsIn(section.heading?.en, section.body?.en);
  for (const q of quizData.filter((q) => q.lesson === lesson.id)) {
    words += wordsIn(q.q?.en, q.explain?.en, ...(q.opts?.en || []));
  }
  return words;
}

const estimateMinutes = (lesson, content) =>
  Math.max(1, Math.round(lessonWords(lesson, content) / READING_WPM));

// 2. lessons: unique ids, every translated field present in all 5 languages,
//    and — since content/lessonContent.js (backlog item 23) — that every
//    lesson has a matching content entry (and vice versa) with no orphans on
//    either side, plus that the metadata's `minutes` estimate still matches a
//    fresh count of the text it is derived from (READING_MODEL above).
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

      // `minutes` is derived, not typed: it must equal READING_MODEL's count
      // of this lesson's own text. A future run that edits a lesson without
      // updating `minutes` fails loudly instead of leaving a stale estimate on
      // the Learn list. See READING_MODEL above for what is counted and why,
      // and DECISIONS.md for the reading rate.
      const expectedMinutes = estimateMinutes(lesson, content);
      if (lesson.minutes !== expectedMinutes) {
        fail(
          `${path} (id ${lesson.id}): minutes is ${lesson.minutes}, but its text computes to ` +
            `${expectedMinutes} — update lessons.js's minutes field to match the edited lesson ` +
            `(READING_MODEL in check-data.mjs §2 defines the count; DECISIONS.md defines the rate)`,
        );
      }
    }
  });

  for (const idStr of Object.keys(lessonContent)) {
    const id = Number(idStr);
    if (!seenIds.has(id)) fail(`lessonContent[${id}]: no matching lesson in lessons.js — orphaned content`);
  }

  // A floor on the model itself. Every per-lesson comparison above passes
  // trivially if `lessonWords` returns 0 for everything — the expected value
  // would clamp to 1 and the only lessons flagged would be the ones stating
  // something else. §20/§22's lesson: a measurement that can silently return
  // nothing needs a check that it returned something.
  const totalWords = lessons.reduce(
    (n, l) => n + (lessonContent[l.id] ? lessonWords(l, lessonContent[l.id]) : 0),
    0,
  );
  if (totalWords < 8_000) {
    fail(
      `§2 reading model: the whole catalogue counts ${totalWords} words (expect ≥8,000). The model, ` +
        `not the content, is what looks broken — check that lessons.js/lessonContent.js/quizData.js ` +
        `still expose the fields lessonWords() reads before trusting any minutes figure.`,
    );
  }

  // §3.0.5's one hard number: "Lesson 1 under four minutes." The rest of the
  // clause is a judgment ("an honest minutes estimate") that the derivation
  // above serves; this half is checkable, and nothing checked it. Lesson 1 is
  // the first screen of a new install and the subject of §4.3's completion-rate
  // gate, so it is the one lesson whose length is a product commitment.
  const first = lessons.find((l) => l.id === 1);
  if (first && first.minutes >= 4) {
    fail(
      `§3.0.5: lesson 1 is ${first.minutes} minutes and the clause requires under four. Either ` +
        `shorten it or take the clause to the owner — do not adjust the estimate, which is derived.`,
    );
  }

  console.log(
    `  reading model: ${totalWords.toLocaleString("en-US")} words @ ${READING_WPM} wpm → ` +
      `${lessons.reduce((n, l) => n + l.minutes, 0)} min across ${lessons.length} lessons; ` +
      `lesson 1 is ${first?.minutes} min (§3.0.5 requires <4).`,
  );
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
    } else if (isKeyedLangMaps(value)) {
      // A named export can also be a plain object keyed by something *other*
      // than a language, whose values are language maps — markets.js's
      // yieldCurveDescriptions, keyed by curve type, is the first of these.
      // Before backlog item 42 this shape fell through both branches above and
      // was therefore checked by nothing at all. Verified by injection rather
      // than assumed: deleting the whole `ko` line from one curve left `npm
      // test` green, which is how this branch came to be written.
      for (const [key, inner] of Object.entries(value)) {
        const p = `${path}.${key}`;
        keyedGroupsChecked += 1;
        if (checkLangSet(inner, p)) {
          for (const lang of LANGS) checkNonEmptyString(inner[lang], `${p}.${lang}`);
        }
      }
    }
  }
}

// True for a plain object whose every value is a language map. Requires *every*
// value to qualify, so a mixed object (say, numbers alongside a caption) is left
// to the branches above rather than half-checked here.
function isKeyedLangMaps(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || "en" in value) return false;
  const inner = Object.values(value);
  return inner.length > 0 && inner.every((v) => v && typeof v === "object" && !Array.isArray(v) && "en" in v);
}

let keyedGroupsChecked = 0;

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

// The keyed-language-map branch above is the one that spent its whole life
// before item 42 matching nothing, so it asserts it matched something — the
// four yield-curve descriptions are the floor.
if (keyedGroupsChecked < 4) {
  fail(`§7: the keyed-language-map branch checked only ${keyedGroupsChecked} group(s) (expected at least 4) — it is probably matching nothing again`);
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

// 13c. The policy simulator's own event. §9.2: "if you cannot name the event
//      that would refute a feature, you do not yet understand the feature."
//      PolicySim is the app's first interactive-in-that-sense feature and the
//      thing CLAIMS.md A7 bets on, so the event is not decoration — it is
//      A7's numerator. What this guards, in order of how easy each is to lose:
//        1. that the event fires at all (it shipped with none);
//        2. that it carries the three ids A7 needs to be read per lesson;
//        3. that CLEARING a lever does not fire it. That third one is the
//           subtle one: a toggle whose both edges fire still *looks*
//           instrumented, and inflates exactly the number A7 reads. The guard
//           is source-order — the early return must sit above the track call.
{
  const sim = readFileSync(new URL("../src/components/PolicySim.jsx", import.meta.url), "utf8");
  const check = (label, ok) => { if (!ok) fail(`policy sim instrumentation: ${label}`); };

  check("PolicySim must fire SIM_LEVER_CHOSEN (A7 has no numerator without it)",
    /track\(EVENTS\.SIM_LEVER_CHOSEN/.test(sim));
  const props = sim.match(/track\(EVENTS\.SIM_LEVER_CHOSEN,\s*\{([^}]*)\}/);
  for (const key of ["lessonId", "scenarioId", "optionId"]) {
    check(`SIM_LEVER_CHOSEN must carry ${key}`, Boolean(props) && new RegExp(`\\b${key}\\b`).test(props[1]));
  }
  check("clearing a lever must NOT fire SIM_LEVER_CHOSEN — the early return belongs above the track call",
    /if\s*\(optionId === chosen\)\s*\{[\s\S]{0,120}?return;[\s\S]{0,200}?track\(EVENTS\.SIM_LEVER_CHOSEN/.test(sim));
  check("SIM_LEVER_CHOSEN must be a distinct event name, not an alias of a §9.2 one",
    EVENTS.SIM_LEVER_CHOSEN === "sim_lever_chosen" &&
      Object.entries(EVENTS).filter(([, v]) => v === EVENTS.SIM_LEVER_CHOSEN).length === 1);
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

// 17b. §3.0.3 COVERAGE — the other direction from §17 (backlog item 57).
//
//      §17 checks that the links that EXIST are still valid. It says nothing
//      about a term used in prose with no link at all, which is the half
//      §3.0.3 is actually about ("a term either gets defined where it appears
//      or links to the glossary"). This section closes that.
//
//      Why it needs an exclusion table rather than just failing on a miss:
//      most unlinked uses are CORRECT. Either the lesson defines the term
//      itself (§3.0.3's first branch) or the prose means something else by the
//      word — lesson 12's PMI is private mortgage insurance, lesson 36's
//      "premium" is the term premium on long bonds. Those judgements lived in
//      lessonTerms.js's header as prose, and that is exactly what failed:
//      backlog item 57 was filed claiming 7 lessons and 11 occurrences of
//      undefined jargon, and all 11 were exclusions the header named by
//      lesson id. A grep cannot subtract a paragraph. So the paragraph became
//      `deliberatelyUnlinked`, and this check requires every occurrence to be
//      accounted for one way or the other:
//
//        (a) unaccounted-for use → FAIL. This is the §3.0.3 violation itself:
//            a glossary term on screen with no chip and no written reason.
//        (b) an exclusion whose term no longer appears in that lesson's
//            English prose → FAIL. Mirrors §17's (d) in the other direction:
//            a stale exemption silently grants cover it was never asked for,
//            so the next real gap in that lesson reads as excluded.
//        (c) an exclusion for a lesson that also LINKS the term → FAIL. The
//            two tables contradict each other and only one can be right.
//
//      SCOPE LIMIT, stated so it is not mistaken for more than it is: this
//      sweeps the keys in glossary.js and nothing else (the count is printed
//      below rather than written here, because it moves). A jargon word with
//      no glossary entry cannot be seen by it, so "0 unexplained" means every
//      GLOSSARY TERM is accounted for — not that §3.0.3 is fully satisfied.
//      Closing that residual means growing the glossary, which is item 35's
//      axis, not this one's. `npm run jargon` (scripts/jargon-candidates.mjs)
//      is the instrument for the part this cannot see: it proposes candidate
//      jargon with no glossary entry, ranked by how many lessons use it. It
//      reports rather than fails, and deliberately is not wired into npm test
//      — deciding which candidate is real jargon is judgement, and the only
//      way to make it blocking would be an allowlist of every acceptable
//      English phrase.
//
//      The matcher is §17's, deliberately: if the two disagree, one of them is
//      wrong about what "the section mentions this term" means, and a shared
//      one cannot drift. The corpus floor below is why an empty parse cannot
//      read as a pass — for an absence check, matching nothing looks identical
//      to having nothing to report (§20/§22's lesson, and the reason item 57's
//      own measurement carried a control).
{
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mentions = (haystack, name) =>
    new RegExp(`(?<![A-Za-z0-9])${escapeRe(name)}s?(?![A-Za-z0-9])`, "i").test(haystack);
  // A glossary key and its English short name are both acceptable surface
  // forms, same as §17 ("QE" is spelled out as "quantitative easing").
  const namesFor = (key) => [key, glossary[key].en.s].filter(Boolean);
  const mentionedIn = (entry, key) =>
    entry.sections.some((s) => {
      const hay = `${s.heading.en}\n${s.body.en}`;
      return namesFor(key).some((n) => mentions(hay, n));
    });

  let linkCount = 0;
  for (const byIndex of Object.values(lessonTerms)) {
    for (const terms of Object.values(byIndex)) linkCount += terms.length;
  }

  let occurrences = 0;
  let unexplained = 0;
  let excluded = 0;
  const reasons = { "defined-here": 0, "other-sense": 0 };

  // (b) and (c): the exclusion table itself must stay true.
  for (const [idKey, byTerm] of Object.entries(deliberatelyUnlinked)) {
    const id = Number(idKey);
    const entry = lessonContent[id];
    if (!entry) {
      fail(`deliberatelyUnlinked[${id}]: no lesson with that id in lessonContent`);
      continue;
    }
    const linkedHere = new Set(Object.values(lessonTerms[id] ?? {}).flat());
    for (const [term, reason] of Object.entries(byTerm)) {
      const path = `deliberatelyUnlinked[${id}]["${term}"]`;
      if (!glossary[term]) {
        fail(`${path}: "${term}" is not a key in glossary.js`);
        continue;
      }
      const code = String(reason).split(":")[0].trim();
      if (code !== "defined-here" && code !== "other-sense") {
        fail(
          `${path}: reason must start with "defined-here" or "other-sense" (got ${JSON.stringify(reason)}). ` +
            `Those are §3.0.3's two legitimate grounds for no chip — anything else is an unreviewed skip.`,
        );
        continue;
      }
      if (code === "other-sense" && !String(reason).includes(":")) {
        fail(
          `${path}: an "other-sense" exclusion must say what the prose means instead ` +
            `("other-sense: <meaning>") — it is a judgement call, and the note is the whole record of it.`,
        );
      }
      reasons[code]++;
      excluded++;
      if (linkedHere.has(term)) {
        fail(
          `${path}: lesson ${id} both links "${term}" and excludes it — lessonTerms and ` +
            `deliberatelyUnlinked contradict each other, and only one of them can be right.`,
        );
      }
      if (!mentionedIn(entry, term)) {
        fail(
          `${path}: lesson ${id}'s English text no longer mentions "${term}" ` +
            `(looked for ${namesFor(term).map((n) => `"${n}"`).join(" or ")}). The prose this exclusion was ` +
            `written for is gone, so the exclusion now covers nothing and hides the next real gap here. ` +
            `Delete the entry.`,
        );
      }
    }
  }

  // (a) the coverage sweep: every glossary term used anywhere must be linked
  //     in that lesson or excluded for it.
  for (const lesson of lessons) {
    const entry = lessonContent[lesson.id];
    if (!entry) continue;
    const linkedHere = new Set(Object.values(lessonTerms[lesson.id] ?? {}).flat());
    const excusedHere = deliberatelyUnlinked[lesson.id] ?? {};
    for (const term of Object.keys(glossary)) {
      if (!mentionedIn(entry, term)) continue;
      occurrences++;
      if (linkedHere.has(term) || term in excusedHere) continue;
      unexplained++;
      fail(
        `§3.0.3: lesson ${lesson.id} ("${lesson.title.en}") uses the glossary term "${term}" in its ` +
          `English text with no glossary chip and no entry in deliberatelyUnlinked. Either link it in ` +
          `lessonTerms[${lesson.id}] (the section where it is first used), or — if the lesson defines it ` +
          `itself or means something else by the word — add it to deliberatelyUnlinked[${lesson.id}] with ` +
          `a reason. See src/content/lessonTerms.js's curation rules.`,
      );
    }
  }

  // Corpus floor. Both tables are hand-maintained and the sweep is an absence
  // check, so a matcher that silently stops matching reports "0 unexplained"
  // — a pass. These bounds are the current corpus with room to move; they are
  // meant to catch a broken instrument, not to pin the content.
  if (occurrences < 40 || linkCount < 25 || excluded < 20) {
    fail(
      `§17b: scanned ${occurrences} glossary-term uses across ${lessons.length} lessons ` +
        `(${linkCount} linked, ${excluded} excluded) — expected at least 40, 25 and 20. The matcher is ` +
        `probably matching nothing rather than the terms having left the content, and for a coverage ` +
        `check that reads as a clean pass.`,
    );
  }
  // Self-test the shared matcher on a fixed probe, for the same reason §26
  // does: the anchoring is the part that has actually been wrong before (a
  // plain substring test accepted "Vesting" on six lessons that say
  // "investing"), and a corpus floor would not notice.
  if (
    !mentions("weighing it alongside credit data", "Credit") ||
    mentions("this lesson is about investing", "Vesting") ||
    !mentions("low-cost index funds", "Index Fund")
  ) {
    fail(
      `§17b: the term matcher is broken on its probe — it must match "credit" as a word, must NOT ` +
        `match "Vesting" inside "investing", and must accept a trailing plural. Without this the ` +
        `coverage sweep can match nothing and still pass.`,
    );
  }

  console.log(
    `  §17b §3.0.3 coverage: ${occurrences} glossary-term uses across ${lessons.length} lessons — ` +
      `${linkCount} chips on ${Object.keys(lessonTerms).length} lessons, ${excluded} deliberately ` +
      `unlinked (${reasons["defined-here"]} defined-here, ${reasons["other-sense"]} other-sense), ` +
      `${unexplained} unexplained.`,
  );
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

// 20. Every <ul>/<ol> under src/ that hides its markers with
//     `listStyle: "none"` must carry an explicit `role="list"` (backlog item
//     34, the a11y one).
//
//     Why this is a real check and not decoration: WebKit removes list
//     semantics from a list whose computed `list-style-type` is `none` — so
//     under VoiceOver such a list is announced as loose text, with no "list, 6
//     items" and no item position. Every list in this app sets `listStyle:
//     "none"` and draws its own marker, so before this check every list in the
//     app was affected, and the app's stated target is mobile, where iOS makes
//     WebKit unavoidable. `role="list"` restores the semantics and is a no-op
//     in engines that never dropped them.
//
//     What this check CANNOT do, stated so it isn't over-trusted: it cannot
//     tell whether <ol> or <ul> is the right element. That is a content
//     judgment — is this list's order load-bearing? — and getting it wrong is
//     exactly the bug this item was filed for (MarketSignals' six unordered
//     principles were an <ol>). The current verdicts, so a later reader can
//     check them rather than re-derive them: Learn's lesson path and Sectors'
//     relative-strength ranking are genuinely ordered; ParentGuide's kids
//     blurbs render a visible ordinal, so <ol> matches what is on screen;
//     every other list is unordered.
{
  const walkJsx = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walkJsx(full);
      return e.isFile() && e.name.endsWith(".jsx") ? [full] : [];
    });

  // Matches an opening <ul>/<ol> tag and everything up to its closing ">",
  // so the role and the style can be found in either order.
  const openTag = /<(ul|ol)\b([^>]*)>/g;
  let listsSeen = 0;

  for (const jsxPath of walkJsx(join(ROOT, "src"))) {
    const src = readFileSync(jsxPath, "utf8");
    const rel = jsxPath.slice(ROOT.length + 1);
    const lineOf = (index) => src.slice(0, index).split("\n").length;

    for (const m of src.matchAll(openTag)) {
      const [, tag, attrs] = m;
      if (!/listStyle:\s*"none"/.test(attrs)) continue;
      listsSeen += 1;
      if (!/role="list"/.test(attrs)) {
        fail(`${rel}:${lineOf(m.index)}: <${tag}> sets listStyle "none" but has no role="list" — WebKit will drop its list semantics (backlog item 34)`);
      }
    }
  }

  // A pattern check that matches nothing passes vacuously — the failure mode
  // §16's ko/ja patterns spent two days in. Assert the scan found the lists.
  if (listsSeen < 8) {
    fail(`§20 found only ${listsSeen} marker-less lists under src/ (expected at least 8) — the scan is probably matching nothing, not the lists having gone away`);
  }
}

// 21. src/content/moneyVisuals.js — lesson 7's marginal-bracket figure
//     (backlog item 27). This checks the *claim the diagram makes*, not that
//     the numbers parse.
//
//     The chart's entire argument is that a raise cannot re-tax the income
//     underneath it: the two stacks must be identical below the old income
//     line, and the extra tax must be smaller than the raise. Both are
//     properties of `bracketBands`, so both are assertable here — which is the
//     point. A diagram whose teaching claim is only true by inspection is one
//     edit away from teaching the opposite of the lesson beside it, and the
//     misconception this lesson exists to correct ("a raise can leave you with
//     less") is exactly what a broken figure would appear to confirm.
{
  const { before, after } = bracketIncomes;
  const raise = after - before;
  const beforeBands = bracketBands(before);
  const afterBands = bracketBands(after, before);
  const sum = (bands) => bands.reduce((s, b) => s + b.amount, 0);
  const key = (b) => `${b.tier}:${b.rate}:${b.amount}`;

  if (raise <= 0) fail(`§21: bracketIncomes must rise (${before} → ${after}) — the figure is a raise`);

  // Checked first because `bracketBands` stops at the first tier that does not
  // extend the one below it. On a monotonic list that is correct (income ran
  // out); on a mis-ordered one it silently drops the top of the stack, and the
  // symptom — "bands sum to less than the income" — points at the wrong line.
  // Found by an injection test of this very check, not by reading the code.
  for (const [i, t] of bracketTiers.entries()) {
    if (i > 0 && !(t.upTo > bracketTiers[i - 1].upTo)) {
      fail(`§21: bracketTiers must ascend — tier ${i} ends at ${t.upTo}, at or below tier ${i - 1}'s ${bracketTiers[i - 1].upTo}`);
    }
    if (i > 0 && !(t.rate > bracketTiers[i - 1].rate)) {
      fail(`§21: bracketTiers rates must ascend — tier ${i} is ${t.rate}%, at or below tier ${i - 1}'s ${bracketTiers[i - 1].rate}%. A flat or falling top band would make the raise look punitive, which is the opposite of lesson 7.`);
    }
  }

  // The scenario has to cross a bracket, or it illustrates nothing.
  const topTier = bracketTiers.findIndex((t) => after <= t.upTo);
  if (topTier === bracketTiers.findIndex((t) => before <= t.upTo)) {
    fail("§21: bracketIncomes must straddle a tier boundary — a raise inside one band cannot show the misconception this lesson corrects");
  }

  for (const [label, income, bands] of [["before", before, beforeBands], ["after", after, afterBands]]) {
    if (sum(bands) !== income) fail(`§21: ${label} bands sum to ${sum(bands)}, not ${income}`);
    for (const b of bands) {
      if (b.amount <= 0) fail(`§21: ${label} has a zero-width band at tier ${b.tier}`);
      if (b.rate !== bracketTiers[b.tier].rate) fail(`§21: ${label} band at tier ${b.tier} carries rate ${b.rate}, not ${bracketTiers[b.tier].rate}`);
    }
  }

  // THE claim. Not "the totals work out" — the layers below the old income
  // line must be the same objects, band for band, in both stacks.
  const unchanged = afterBands.filter((b) => !b.isRaise);
  if (unchanged.map(key).join("|") !== beforeBands.map(key).join("|")) {
    fail(
      "§21: the non-raise layers of the 'after' stack differ from the 'before' stack — " +
      `${JSON.stringify(unchanged.map(key))} vs ${JSON.stringify(beforeBands.map(key))}. ` +
      "The diagram would be showing a raise re-taxing income underneath it, which is the misconception lesson 7 corrects."
    );
  }

  const raiseBands = afterBands.filter((b) => b.isRaise);
  if (sum(raiseBands) !== raise) fail(`§21: the flagged raise bands total ${sum(raiseBands)}, not the ${raise} raise`);
  if (raiseBands.length < 2) {
    fail("§21: the raise should split across two bands — the part still taxed at the old rate is what 'only the overflow is taxed higher' means, and one band cannot show it");
  }

  const extraTax = bracketTax(afterBands) - bracketTax(beforeBands);
  if (!(extraTax > 0 && extraTax < raise)) {
    fail(`§21: extra tax on the raise is ${extraTax} against a raise of ${raise} — take-home pay must rise, which is the lesson's takeaway in one sentence`);
  }
  // The caption states these two figures in all five languages, so a change to
  // the tiers that left the prose alone would ship a chart disagreeing with the
  // words beside it. Pinned rather than recomputed for that reason.
  if (extraTax !== 2400 || raise - extraTax !== 7600) {
    fail(`§21: bracketCaption says $2,400 extra tax and $7,600 kept in all five languages; the figures now compute to ${extraTax} and ${raise - extraTax} — update the captions in the same commit`);
  }

  // The caption also names the split of the raise itself ($6,000 at the old
  // rate, $4,000 at the new one), and that split is the whole reason this
  // scenario was widened from a $6,000 raise — see moneyVisuals.js. A change
  // that keeps the totals but flattens the split would leave the picture
  // arguing that a raise is taxed entirely at the top rate.
  const [lowerSlice, upperSlice] = raiseBands.map((b) => b.amount);
  if (lowerSlice !== 6000 || upperSlice !== 4000) {
    fail(`§21: bracketCaption says the raise splits $6,000 at 20% and $4,000 at 30%; it now splits ${lowerSlice}/${upperSlice}`);
  }
  if (!(lowerSlice > upperSlice)) {
    fail("§21: the part of the raise still taxed at the old rate must be the larger slice — at 375px the smaller one renders too thin to read, and the figure then shows the misconception rather than the correction");
  }
}

// 22. Every chart primitive in src/components/charts.jsx exposes a text
//     alternative, and every call site supplies one (backlog item 41).
//
//     The bug this generalises from: `Bar` was the one primitive that took no
//     `description`, so lesson 37's Fed balance-sheet figure was a stack of
//     unlabelled <div>s — the only lesson visual in the app with no text
//     alternative. Six of seven primitives already had the property; nothing
//     asserted it, so the seventh could be written without it and nothing said
//     so for as long as the figure existed.
//
//     Both halves are needed and neither implies the other. A primitive can
//     accept `description` and never render it; a primitive that renders it
//     correctly is still silent at a call site that omits the prop, because
//     `aria-label={undefined}` drops the attribute entirely and leaves a
//     `role="img"` with no accessible name — worse than no role at all.
//
//     The permitted-props set is read out of each primitive's own aria-label
//     expression rather than hardcoded, which is what lets the call-site
//     failure message name the fallback a call site would land on.
//
//     Call sites must pass `description` outright. That is stricter than it was
//     when this section landed, one commit earlier: `YieldCurve`'s
//     `description || label` fallback was then accepted at call sites, because
//     no curve descriptions existed and a short `label` was the only accessible
//     name available. Item 42 wrote those descriptions, and at that point a
//     call site falling back to `label` is a silent downgrade rather than a
//     design choice. The fallback stays in the component — it still guards
//     against a figure with no name at all — but it no longer excuses a call
//     site from passing the real thing.
{
  const chartsPath = join(ROOT, "src/components/charts.jsx");
  const chartsSrc = readFileSync(chartsPath, "utf8");
  const lineIn = (src, index) => src.slice(0, index).split("\n").length;

  // name → props that may supply the accessible name at a call site.
  const labelProps = new Map();

  for (const m of chartsSrc.matchAll(/export function (\w+)\(\{([^}]*)\}/g)) {
    const [, name, params] = m;
    const takesDescription = /\bdescription\b/.test(params);
    // The primitive's body runs to the next export, or to end of file.
    const bodyStart = m.index;
    const next = chartsSrc.indexOf("\nexport function ", bodyStart + 1);
    const body = chartsSrc.slice(bodyStart, next === -1 ? chartsSrc.length : next);
    const aria = body.match(/role="img"[^>]*?aria-label=\{([^}]+)\}/);

    if (!takesDescription) {
      fail(`§22: charts.jsx:${lineIn(chartsSrc, bodyStart)}: <${name}> takes no \`description\` prop — every chart primitive must expose a text alternative (backlog item 41)`);
      continue;
    }
    if (!aria) {
      fail(`§22: charts.jsx:${lineIn(chartsSrc, bodyStart)}: <${name}> accepts \`description\` but renders no \`role="img"\` with an \`aria-label\` bound to it, so the description never reaches a screen reader`);
      continue;
    }
    const props = aria[1].split("||").map((s) => s.trim()).filter((s) => /^\w+$/.test(s));
    if (!props.includes("description")) {
      fail(`§22: charts.jsx:${lineIn(chartsSrc, bodyStart)}: <${name}>'s aria-label is \`${aria[1].trim()}\`, which does not read \`description\``);
      continue;
    }
    labelProps.set(name, props);
  }

  if (labelProps.size < 7) {
    fail(`§22: found only ${labelProps.size} chart primitives in charts.jsx (expected at least 7) — the export scan is probably matching nothing, not the charts having gone away`);
  }

  // Call sites. The attribute span ends at the first ">" at brace depth 0 —
  // depth tracking is not optional here, since `data={rows.map((d) => ...)}`
  // puts a ">" inside an attribute value, and taking the first one would cut
  // the span short and report a missing prop that is right there.
  const attrsOf = (src, from) => {
    let depth = 0;
    for (let i = from; i < src.length; i += 1) {
      const c = src[i];
      if (c === "{") depth += 1;
      else if (c === "}") depth -= 1;
      else if (c === ">" && depth === 0) return src.slice(from, i);
    }
    return src.slice(from);
  };

  const walkJsx = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walkJsx(full);
      return e.isFile() && e.name.endsWith(".jsx") ? [full] : [];
    });

  let callSites = 0;
  for (const jsxPath of walkJsx(join(ROOT, "src"))) {
    if (jsxPath === chartsPath) continue;
    const src = readFileSync(jsxPath, "utf8");
    const rel = jsxPath.slice(ROOT.length + 1);

    for (const [name, props] of labelProps) {
      for (const m of src.matchAll(new RegExp(`<${name}\\b`, "g"))) {
        const attrs = attrsOf(src, m.index + name.length + 1);
        callSites += 1;
        if (!/\bdescription=/.test(attrs)) {
          const viaFallback = props.filter((p) => p !== "description");
          fail(
            `§22: ${rel}:${lineIn(src, m.index)}: <${name}> passes no \`description\` — ` +
            (viaFallback.length
              // Tightened 2026-08-16 by item 42, and the tightening is the
              // point: this call site was legal the day before, because
              // YieldCurve's `description || label` fallback meant a `label`
              // alone still produced an accessible name. Once five-language
              // descriptions existed for those curves, relying on the fallback
              // stopped being a design choice and became a silent downgrade to
              // a four-word name. The fallback stays in the component as a
              // defence against an unlabelled figure; it is no longer a licence
              // for a call site. Verified: dropping `description=` here passed
              // under the old rule.
              ? `its \`aria-label\` would fall back to ${viaFallback.map((p) => `\`${p}\``).join(" / ")}, which names the figure without describing it (backlog item 42)`
              : "its `role=\"img\"` would render with no accessible name (backlog item 41)")
          );
        }
      }
    }
  }

  if (callSites < 10) {
    fail(`§22: found only ${callSites} chart call sites under src/ (expected at least 10) — the scan is probably matching nothing`);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 23. Nothing computes a calendar date as a UTC date (backlog item 38).
//
//     `new Date().toISOString().slice(0, 10)` is not today. It is today in
//     UTC, which after 8pm Eastern is tomorrow. Two places had it:
//     `check-claims.mjs`, where it reported §9.1 claims past due a day early
//     and cost three consecutive runs a hand-corrected date; and the market
//     job, where it stamps `asOf` on `public/data/market.json` — the field
//     `useMarketData` compares against `todayStr()` to decide whether a
//     reading is too old to show. That one was correct only by the ninety
//     minutes between a 6:30pm ET job and UTC midnight, thirty in winter.
//
//     So this fails on the *idiom*, not on those two files. Any `.toISOString()`
//     truncated to its date half is caught wherever it appears, because the
//     mistake is not specific to a receiver: a `Date` built from anything and
//     then sliced to ten characters yields a UTC calendar date, and a calendar
//     date in this app always means a local one (`src/utils/date.js`).
//
//     There is one legitimate use — a loose lower bound for a provider query,
//     where a day either way is swallowed by a 1.5x over-fetch. Rather than
//     exempting that file by path, a line may opt out with a `utc-date-ok:`
//     comment stating why, so the exemption is reviewable where it is taken
//     and a second one has to be argued for rather than inherited.
//
//     Known limit, stated so this is not over-trusted: it catches the idiom,
//     not the mistake. `new Date().getFullYear()` composed by hand, or a
//     `toISOString()` whose slice happens on another line, would pass. What
//     makes that acceptable is the second half below — the two scripts that
//     actually need a date must import the shared helper, so the way to get a
//     date here is a positive requirement and not merely an absence.
{
  const walkSource = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return e.name === "node_modules" ? [] : walkSource(full);
      return e.isFile() && /\.(js|jsx|mjs)$/.test(e.name) ? [full] : [];
    });

  // `.toISOString()` followed by a date truncation: slice/substring to 10, or
  // split on the "T". Allows whitespace and a newline between the calls, which
  // is how the one exempted call site in adapters.js is actually written.
  const UTC_DATE = /\.toISOString\(\)\s*\.\s*(?:slice|substring)\(\s*0\s*,\s*10\s*\)|\.toISOString\(\)\s*\.\s*split\(\s*(["'])T\1\s*\)\s*\[\s*0\s*\]/g;

  // Comments are blanked before matching, or every explanation of this bug —
  // including the four written in the commit that added this check — reads as
  // an occurrence of it. Blanked rather than removed so match indices still
  // point at the right line. The `[^:]` guard keeps a `https://` inside a
  // string from being read as the start of a line comment.
  const blankComments = (s) =>
    s
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
      .replace(/(^|[^:"'`\\])\/\/[^\n]*/gm, (m, keep) => keep + " ".repeat(m.length - keep.length));

  let filesScanned = 0;
  let dateBearingFiles = 0;
  let exempted = 0;

  for (const path of [join(ROOT, "src"), join(ROOT, "scripts")].flatMap(walkSource)) {
    const src = readFileSync(path, "utf8");
    const rel = path.slice(ROOT.length + 1);
    filesScanned += 1;
    if (src.includes("new Date(")) dateBearingFiles += 1;

    for (const m of blankComments(src).matchAll(UTC_DATE)) {
      const line = src.slice(0, m.index).split("\n").length;
      // The opt-out applies to the statement, which may span lines: look back
      // over the few lines above the match for the marker.
      const preceding = src.slice(0, m.index).split("\n").slice(-6).join("\n");
      if (/utc-date-ok:/.test(preceding)) {
        exempted += 1;
        continue;
      }
      fail(
        `§23: ${rel}:${line}: computes a calendar date as a UTC date ` +
          `(\`.toISOString()\` truncated to ten characters). That is tomorrow's date every evening ` +
          `east of UTC. Use \`todayStr()\` from src/utils/date.js — the same function the app compares ` +
          `against — or add a \`utc-date-ok:\` comment above the line saying why UTC is right here.`,
      );
    }
  }

  // Positive half: the two scripts that derive a date must get it from the
  // shared helper. The absence check above cannot see a hand-rolled UTC date;
  // this says where a date is allowed to come from. If a script here stops
  // needing a date, remove it from this list in the same commit rather than
  // adding an unused import to satisfy the check.
  for (const rel of ["scripts/check-claims.mjs", "scripts/fetch-market-data.mjs", "scripts/translation-review.mjs"]) {
    const src = readFileSync(join(ROOT, rel), "utf8");
    if (!/import\s*\{[^}]*\btodayStr\b[^}]*\}\s*from\s*["']\.\.\/src\/utils\/date\.js["']/.test(src)) {
      fail(
        `§23: ${rel} no longer imports \`todayStr\` from src/utils/date.js. Its notion of "today" must ` +
          `be the app's, not its own — that divergence is backlog item 38.`,
      );
    }
  }

  if (filesScanned < 40 || dateBearingFiles < 3) {
    fail(
      `§23: scanned ${filesScanned} source files, ${dateBearingFiles} of them containing \`new Date(\` ` +
        `(expected at least 40 and 3) — the walk is probably matching nothing, which for an ` +
        `absence check reads exactly like a pass.`,
    );
  }
  if (exempted !== 1) {
    fail(
      `§23: expected exactly 1 \`utc-date-ok:\` exemption (the Tiingo query lower bound), found ${exempted}. ` +
        `A new one is a decision to review, not a default; a vanished one means the marker moved out of ` +
        `range of the line it excuses.`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 24. No source file is invisible to grep (found while writing §23).
  //
  //     §23's third hit was `translation-review.mjs`, which the hand grep that
  //     scoped this work had reported clean. It was not clean; grep had
  //     skipped the whole file, because line 91 wrote its hash separator as a
  //     literal NUL byte rather than the `\0` escape, and one NUL makes grep
  //     class a file as binary and refuse to search it.
  //
  //     That is worth its own check because of what it costs, which is not one
  //     stale date. Every guard in this repo that scans text — §16's
  //     cross-references, §17's glossary links, §20's list markers, §22's chart
  //     descriptions, all of check-blindspot.mjs — reads files the same way a
  //     person greps them. A file that reads as binary is exempt from all of
  //     them at once, silently, and reports as a pass. This repo already has
  //     the lesson written down twice: a measurement taken with the instrument
  //     that has the blind spot cannot detect the blind spot.
  //
  //     Escapes are the fix, never a raw control byte: `"\0"` and a literal NUL
  //     are the same string to the parser and a different file to every tool
  //     around it. Verified when this landed — all 40 `englishSourceHash`
  //     values are byte-identical across the change, so the ledger's stored
  //     hashes stayed valid.
  for (const path of [join(ROOT, "src"), join(ROOT, "scripts")].flatMap(walkSource)) {
    const bytes = readFileSync(path);
    const nul = bytes.indexOf(0);
    if (nul !== -1) {
      const line = bytes.slice(0, nul).toString("utf8").split("\n").length;
      fail(
        `§24: ${path.slice(ROOT.length + 1)}:${line}: contains a literal NUL byte, which makes grep ` +
          `treat the whole file as binary and skip it — every text-scanning check in this repo, ` +
          `including the ones in this file, then passes it without reading it. Write the escape ` +
          `(\`\\0\`) instead; it is the same string to the parser and a text file to everything else.`,
      );
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 25. src/lib/useMarketData.js — the freshness rule (backlog item 44).
//
//     This is the §2.3 contract in one expression: whether the numbers on the
//     Sector-performance screen may be shown at all. It was `ageDays >
//     STALE_AFTER_DAYS`, a one-sided test, so every age below the window
//     counted as fresh — including ages *below zero*, which do not mean "very
//     recent" but "the writer's clock and the reader's clock disagree." A
//     device whose date is set a week behind reads a five-day-old file as -2
//     days old and shows it as current.
//
//     Same shape as the missing-`asOf` case, which the old test also passed:
//     `null > 4` is false, so a file with no date at all was fresh. Both are
//     the same mistake — treating "not known to be old" as "known to be new".
//
//     `freshness` was split out of the hook so this can be checked without a
//     browser or a clock, the way sections 8, 9 and 12–15 check their own
//     modules. The dates below are written out rather than derived from the
//     constants on purpose: they encode where the two boundaries are *meant*
//     to be, so moving a constant fails here and has to be argued for.
{
  const eq = (label, actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fail(`§25 freshness: ${label} — got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
    }
  };

  eq("the table below is written for STALE_AFTER_DAYS = 4 (re-derive the cases if this changes)",
    STALE_AFTER_DAYS, 4);
  eq("the table below is written for FUTURE_TOLERANCE_DAYS = 1 (re-derive the cases if this changes)",
    FUTURE_TOLERANCE_DAYS, 1);

  const TODAY = "2026-08-17";
  const cases = [
    // [asOf, today, ageDays, isStale, what it stands for]
    ["2026-08-17", TODAY, 0, false, "today's file is fresh"],
    ["2026-08-13", TODAY, 4, false, "the last day inside the staleness window"],
    ["2026-08-12", TODAY, 5, true, "one day past it"],
    ["2026-08-18", TODAY, -1, false, "one day ahead: ordinary timezone skew, still fresh"],
    ["2026-08-19", TODAY, -2, true, "two days ahead: further than a timezone explains — item 44's bug"],
    ["2026-08-24", TODAY, -7, true, "a week ahead"],
    // The case with teeth: a five-day-old file read by a device whose date is
    // five days behind. Genuinely stale, negative age, and fresh under the old
    // one-sided test.
    ["2026-08-12", "2026-08-07", -5, true, "a stale file read by a device with a stale clock"],
    // Month and year boundaries, since dayDiff composes calendar dates rather
    // than subtracting milliseconds.
    ["2026-02-26", "2026-03-02", 4, false, "four days across a month boundary"],
    ["2025-12-30", "2026-01-03", 4, false, "four days across a year boundary"],
    ["2025-12-29", "2026-01-03", 5, true, "five days across a year boundary"],
    // No usable date. Not fresh: §2.3 wants a figure shown with its date or
    // not shown, and these have no date to show.
    [undefined, TODAY, null, true, "a file with no asOf field"],
    [null, TODAY, null, true, "an explicitly null asOf"],
    ["", TODAY, null, true, "an empty asOf"],
    ["2026-8-1", TODAY, null, true, "an asOf in a shape this code cannot read"],
    ["yesterday", TODAY, null, true, "a non-date asOf"],
    [20260817, TODAY, null, true, "a non-string asOf"],
  ];
  for (const [asOf, today, ageDays, isStale, label] of cases) {
    eq(`${label} (asOf=${JSON.stringify(asOf)}, today=${today})`, freshness(asOf, today), { ageDays, isStale });
  }

  // Positive half. The table above proves `freshness` is right; nothing in it
  // proves the hook still asks `freshness`. Reintroducing the one-sided
  // comparison inside `useMarketData` would leave every case above green — the
  // exact shape of blind spot §23/§24 were written for.
  const hookSrc = readFileSync(join(ROOT, "src/lib/useMarketData.js"), "utf8");
  const hookBody = hookSrc.slice(hookSrc.indexOf("export function useMarketData"));
  if (!/const\s*\{[^}]*\bisStale\b[^}]*\}\s*=\s*freshness\(/.test(hookBody)) {
    fail(
      `§25: useMarketData() no longer takes its \`isStale\` from freshness(). The rule has to live in ` +
        `the one place the checks above can reach, or this section is testing code the app doesn't run.`,
    );
  }
  if (/ageDays\s*[<>]/.test(hookBody)) {
    fail(
      `§25: useMarketData() compares \`ageDays\` directly. That comparison belongs inside freshness(), ` +
        `where both of its boundaries are stated and checked — a bare \`ageDays > N\` is backlog item 44.`,
    );
  }

  // And the consumer: Sectors.jsx must gate on the flag, not re-derive it.
  const sectorsSrc = readFileSync(join(ROOT, "src/screens/reference/Sectors.jsx"), "utf8");
  if (!/\bisStale\b/.test(sectorsSrc) || /\bageDays\s*[<>]/.test(sectorsSrc)) {
    fail(
      `§25: src/screens/reference/Sectors.jsx must gate its figures on useMarketData's \`isStale\` and ` +
        `must not compare \`ageDays\` itself — one freshness rule, in one place.`,
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 26. Every repo path a tracked document names must exist (backlog item 46,
//     the buildable half of item 39).
//
//     The failure this exists for, twice over, is not a stale number — it is a
//     document whose *instructions* have rotted while its figures stayed
//     right. `LAUNCH_READINESS.md`'s two "how to refresh this file" snippets
//     imported `content/lessonContent.economy.js`, item 45 split that file ten
//     ways, and the snippets became `ERR_MODULE_NOT_FOUND` — for the second
//     time, in a paragraph whose own text says "run them, don't trust the
//     text". Reading the doc showed nothing wrong. Running it failed instantly.
//     A path is the one part of a document a script can check without being
//     told what the document means, so this is the part worth checking.
//
//     Scope: the five tracked docs below. `AGENT_LOG.md` is deliberately out —
//     it is an append-only history whose old entries *should* name files that
//     have since been deleted, and guarding it would mean marking every one.
//
//     What counts as a path reference: a backtick-quoted token, or a Markdown
//     link target, ending in a source/data extension. Tokens containing
//     whitespace are commands that happen to end in one (`grep -rn "posthog"
//     src/ package.json`), not paths.
//
//     ── Surface, widened 2026-08-17 (backlog item 49) ──────────────────────
//     Item 49 proposed three additions and told the run to *measure the dead-
//     reference count for a surface before deciding it is worth guarding*.
//     Measured against this tree; two of the three were rejected on the
//     numbers, and the item's own ranking turned out to be backwards:
//
//     • `README.md` — ADDED. 31 backticked references, **3 dead**
//       (`Home.jsx`, `Markets.jsx`, `More.jsx`, all gone in the 2026-08-04
//       rebuild). The only surface measured with live rot, and the item's own
//       argument for it holds: README is the one document a new reader runs
//       commands from. Needed no exemption class — the three were fixed, not
//       excused, along with the rest of a "What's here" section that still
//       described the pre-rebuild tree.
//     • Markdown link targets — ADDED, and honestly: **0 dead anywhere** (2
//       references in the four docs, 1 in README). This catches nothing today.
//       It is here because coverage that depends on a formatting choice is a
//       hole: converting `` `foo.js` `` to `[foo.js](foo.js)` currently walks a
//       reference out of this check, and a dead link is the worse defect
//       because it renders as a working one.
//     • Un-backticked bare paths — REJECTED. 16 references, 8 dead, and all 8
//       are the *same* paths already exempted in backticked form: it would
//       double the exemption list from 11 to 19 and catch nothing new. It is
//       also unsound at the token level — the bare-path pattern matches
//       `Node.js` in README's "Requires Node.js 18+", which is prose, not a
//       file. A guard whose false positives are English words is off within a
//       week, which is §11b's lesson in a different costume.
//     • `reviews/*.md` — REJECTED, and the measurement made the case by
//       moving while it was being taken. First pass: 98 references, 6 dead
//       (a `dist/` chunk hash, the rejected JSON formats, the pre-rebuild
//       component names). Re-measured ~90 minutes later, after the weekly
//       reviewer appended a section: **112 references, 8 dead** — and both new
//       dead ones are that fresh section correctly describing the two files
//       item 45 deleted. A dated snapshot *accrues* dead paths by doing its
//       job, which is `AGENT_LOG.md`'s argument exactly. `reviews/` belongs on
//       the history side with it: 8 exemptions to write, 0 live instructions
//       to protect, and a new exemption owed every Sunday.
//
//     Resolution is by suffix at a path-segment boundary, because docs name
//     `Practice.jsx` far more often than `src/screens/Practice.jsx`. `-` is
//     NOT a boundary: `v5.jsx` does not resolve to `economic-cycles-v5.jsx`,
//     and it shouldn't — that file is gitignored and the reference is prose
//     shorthand, which is a thing to declare rather than to resolve by accident.
//
//     `dist/` is excluded from the tree on purpose. Including it would make
//     this check pass or fail depending on whether someone had run a build,
//     which is the one property a guard must never have.
//
//     Globs and placeholders (`src/locales/*.js`, `lessonContent.<track>.<lang>.js`,
//     `lessonContent.{economy,money}.js`) are expanded and required to match at
//     least one real file, rather than skipped. Skipping them would have missed
//     `DECISIONS.md`'s brace-contracted reference to the two files item 45
//     deleted — the same rot, written in a form a naive check reads as a wildcard.
//
//     The exemption marker is §23's `utc-date-ok:` shape ported to Markdown:
//     `<!-- path-ok: <path> — why -->`. It is scoped to the DOCUMENT and names
//     the path, rather than being scoped to the line the way §23's is. That is
//     a concession to Markdown, not a preference: five of the ten exemptions
//     sit inside table rows, and an HTML comment on its own line between two
//     rows ends the table. Naming the path is what keeps a document-scoped
//     marker honest, and two counter-assertions do the rest — the total is
//     pinned, and a marker for a path that now resolves fails as stale, so an
//     exemption cannot outlive the reason it was granted.
{
  const DOCS = ["LAUNCH_READINESS.md", "LAUNCH_PLAN.md", "DECISIONS.md", "CLAIMS.md", "README.md"];
  // Counted per *reference*, not per marker: ten markers cover eleven
  // references, because `v6.jsx` is named twice in LAUNCH_PLAN.md. Counting
  // uses rather than declarations means a new mention of an already-exempted
  // path also has to be argued for, which is the stricter and cheaper choice.
  // 11 → 12 on 2026-08-17 (item 61/F13): no new exempted *path*, but
  // `lessonContent.money.js` is now named twice in DECISIONS.md — once by the
  // per-track entry it supersedes and once by the new per-language entry, which
  // records that this file's 499.27 kB against a 500 kB threshold is what forced
  // the second split. Both mentions are the history the :326 marker exempts.
  // 12 → 13 on 2026-08-17 (item 72): README.md's new Deploying section names
  // `vercel.json` in order to say the repo does not have one — hash routing
  // means no host needs an SPA rewrite rule. This is the first exemption
  // granted for an *absence that is the point of the sentence* rather than for
  // history or a rejected format, and the stale-exemption rule is what makes
  // that safe: the day the file appears, this fails and the claim gets re-read
  // instead of quietly becoming false.
  //
  // The same sentence also names `netlify.toml`, which is NOT exempted and does
  // not need to be: `toml` is outside `EXT` below, so §26 never sees it. Left
  // that way on purpose — widening `EXT` to cover one word of prose would pull
  // every future `.toml` mention into this check for no reason anyone has yet.
  // The asymmetry is recorded here rather than papered over, so a later reader
  // does not read the missing marker as an oversight.
  const EXPECTED_EXEMPTIONS = 13;

  const walkAll = (dir, base = "") =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      if (e.name === "node_modules" || e.name === ".git" || e.name === "dist") return [];
      const rel = base ? `${base}/${e.name}` : e.name;
      return e.isDirectory() ? walkAll(join(dir, e.name), rel) : [rel];
    });
  const tree = walkAll(ROOT);

  const EXT = "js|jsx|mjs|json|md|sh";
  const REF = new RegExp("`([^`\\n]+?\\.(?:" + EXT + "))`", "g");
  // A Markdown inline link whose target is a repo path. `http(s):`/`mailto:`
  // targets and bare `#anchor`s are not paths and are excluded by requiring an
  // extension and rejecting a scheme; a trailing `#anchor` on a real path is
  // allowed and dropped, since it addresses a heading inside the file.
  const LINK = new RegExp("\\[[^\\]\\n]*\\]\\((?!\\w+:)([^)\\s#]+?\\.(?:" + EXT + "))(?:#[^)\\s]*)?\\)", "g");
  const MARKER = /<!--\s*path-ok:\s*([^\s]+)\s*(?:—|--)\s*([^>]*?)\s*-->/g;
  const isPattern = (p) => /[*<{]/.test(p);

  // `*` and `<placeholder>` stand for one path segment's worth of name; a
  // `{a,b}` contraction becomes an alternation. Anchored so a match is a whole
  // filename, and allowed to start at any directory depth (same suffix rule).
  const patternRe = (p) => {
    const body = p
      .split(/(\{[^}]*\}|\*|<[^>]*>)/)
      .map((part) => {
        if (part === "*") return "[^/]*";
        if (/^<[^>]*>$/.test(part)) return "[^/.]+";
        if (/^\{[^}]*\}$/.test(part)) {
          return `(?:${part.slice(1, -1).split(",").map((a) => a.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`;
        }
        return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");
    return new RegExp(`^(?:.*/)?${body}$`);
  };

  const resolves = (p) => {
    if (isPattern(p)) {
      const re = patternRe(p);
      return tree.some((f) => re.test(f));
    }
    const norm = p.replace(/^\.\//, "");
    return tree.some((f) => f === norm || f.endsWith(`/${norm}`));
  };

  let occurrences = 0;
  let commandLike = 0;
  let linkRefs = 0;
  let exemptionsUsed = 0;
  const declared = new Map(); // "doc\0path" -> { where, reason }

  for (const doc of DOCS) {
    let text;
    try {
      text = readFileSync(join(ROOT, doc), "utf8");
    } catch {
      fail(`§26: ${doc} is missing — it is one of the four tracked documents this section guards`);
      continue;
    }
    const lines = text.split("\n");

    lines.forEach((line, i) => {
      for (const m of line.matchAll(MARKER)) {
        const key = `${doc}\0${m[1]}`;
        if (m[2].length < 10) {
          fail(
            `§26: ${doc}:${i + 1}: \`path-ok: ${m[1]}\` gives no reason. The marker exists so the ` +
              `exemption is arguable where it is taken; write why the path is allowed not to exist.`,
          );
        }
        if (declared.has(key)) fail(`§26: ${doc}:${i + 1}: duplicate \`path-ok: ${m[1]}\` marker`);
        declared.set(key, { where: `${doc}:${i + 1}`, reason: m[2] });
      }
    });

    const exempted = new Set();
    lines.forEach((line, i) => {
      // Backticked tokens and link targets are counted the same way and share
      // one exemption namespace: they are the same reference in two syntaxes,
      // and `[`x.js`](x.js)` legitimately counts twice for the same reason a
      // path named on two lines does — every mention has to be true.
      for (const m of [...line.matchAll(REF), ...line.matchAll(LINK)]) {
        const ref = m[1].trim();
        if (/\s/.test(ref)) {
          commandLike += 1;
          continue;
        }
        occurrences += 1;
        if (m[0].startsWith("[")) linkRefs += 1;
        if (resolves(ref)) continue;
        if (declared.has(`${doc}\0${ref}`)) {
          exemptionsUsed += 1;
          exempted.add(ref);
          continue;
        }
        fail(
          `§26: ${doc}:${i + 1}: names \`${ref}\`, which does not exist. Either the path moved and the ` +
            `document was not updated with it (backlog item 46's whole reason — this is how ` +
            `LAUNCH_READINESS.md's refresh snippets rotted twice), or the reference is deliberate ` +
            `history, in which case add \`<!-- path-ok: ${ref} — why -->\` to ${doc} and raise ` +
            `EXPECTED_EXEMPTIONS in check-data.mjs §26.`,
        );
      }
    });

    // A marker whose path now resolves is a granted exemption outliving its
    // reason — the shape that makes a suppression list quietly become a lie.
    for (const [key, { where }] of declared) {
      if (!key.startsWith(`${doc}\0`)) continue;
      const p = key.slice(doc.length + 1);
      if (exempted.has(p)) continue;
      fail(
        resolves(p)
          ? `§26: ${where}: \`path-ok: ${p}\` is stale — that path exists now. Delete the marker and ` +
              `lower EXPECTED_EXEMPTIONS; an exemption that outlives its reason suppresses a real find later.`
          : `§26: ${where}: \`path-ok: ${p}\` exempts a path ${doc} no longer mentions. Delete it.`,
      );
    }
  }

  // Floors, because for a mostly-absence check an empty scan reads as a pass.
  if (occurrences < 180 || tree.length < 80) {
    fail(
      `§26: scanned ${occurrences} path references across ${DOCS.length} docs against a ${tree.length}-file ` +
        `tree (expected at least 180 and 80) — the scan is probably matching nothing rather than the ` +
        `references having gone away.`,
    );
  }

  // The link surface is too small for a corpus floor to be honest: there are 3
  // link targets in the guarded docs today, so "expected at least 1" would fire
  // the day someone rewrote one as a backticked path — a failure that means
  // nothing. The regex is self-tested instead, which is what a corpus floor was
  // approximating anyway: does this pattern still match the thing it is for?
  {
    const probe = "see [the reader](src/screens/LessonReader.jsx) and [the plan](https://x.test/a.md)";
    const got = [...probe.matchAll(LINK)].map((m) => m[1]);
    if (got.length !== 1 || got[0] !== "src/screens/LessonReader.jsx") {
      fail(
        `§26: the Markdown-link pattern is broken — on a fixed probe it should match exactly the one ` +
          `repo path and skip the http target, and it returned ${JSON.stringify(got)}. Without this ` +
          `the link surface silently scans nothing, which for an absence check reads as a pass.`,
      );
    }
  }
  if (exemptionsUsed !== EXPECTED_EXEMPTIONS) {
    fail(
      `§26: expected exactly ${EXPECTED_EXEMPTIONS} exempted path references, found ${exemptionsUsed}. ` +
        `Every one is a document naming a file that does not exist: three formats the project rejected ` +
        `(LAUNCH_PLAN.md), two prototype shorthands, two superseded content paths kept as history ` +
        `(DECISIONS.md — the money one named twice, by the entry it supersedes and by the entry that ` +
        `supersedes it), a build-output chunk name, a brace contraction of the same two paths, and the ` +
        `dev-agent SKILL.md that lives outside the repo. A new one is a decision to review, not a default.`,
    );
  }
  console.log(
    `  §26 doc paths: ${occurrences} references across ${DOCS.length} docs (${linkRefs} as Markdown ` +
      `links), ${exemptionsUsed} exempted, ${commandLike} command lines skipped.`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 27. DECISIONS.md's localStorage entry names every key the app persists.
//
//     Why (item 61/F10, 2026-08-17): the entry opened "every piece of per-user
//     state added so far" and then listed 5 of 12. Universally quantified, so it
//     was false rather than merely out of date — and it is the reference for what
//     the app persists, which §4.5's "state is local-only, no selling of learner
//     data" leans on.
//
//     Generated rather than corrected, which is §17b's and §26's shape: the fix
//     for a hand-maintained list that rots is not a better hand-maintained list.
//     Direction is deliberately one-way — a key in code and missing from the doc
//     fails; prose naming a key that no longer exists is §26's job, not this
//     section's.
// ─────────────────────────────────────────────────────────────────────────────
{
  const storageSrc = readFileSync(join(ROOT, "src", "lib", "storage.js"), "utf8");
  const keysBlock = storageSrc.match(/export const KEYS = \{([\s\S]*?)\n\};/);
  const decisions = readFileSync(join(ROOT, "DECISIONS.md"), "utf8");

  if (!keysBlock) {
    fail(
      "§27: could not find the `export const KEYS = { ... }` block in src/lib/storage.js. The scan " +
        "matches nothing rather than the keys having gone away, and for a coverage check that reads " +
        "as a pass.",
    );
  } else {
    const keys = [...keysBlock[1].matchAll(/"(ecycles_[a-z_]+)"/g)].map((m) => m[1]);
    // Floor: the app has had at least 5 persisted keys since 2026-08-04, so a
    // parse returning fewer means the regex broke, not that state was removed.
    if (keys.length < 5) {
      fail(
        `§27: parsed only ${keys.length} keys out of KEYS (expected at least 5) — the key pattern is ` +
          `probably broken rather than the app having stopped persisting state.`,
      );
    }
    const undocumented = keys.filter((k) => !decisions.includes(`\`${k}\``));
    if (undocumented.length) {
      fail(
        `§27: DECISIONS.md's "localStorage-only progress and personalization state" entry does not ` +
          `name ${undocumented.length} key(s) the app persists: ${undocumented.join(", ")}. That entry ` +
          `is the reference for what leaves nothing and stays on the device; add each new key to it in ` +
          `the same change that adds the key.`,
      );
    } else {
      console.log(`  §27 persisted state: all ${keys.length} KEYS members named in DECISIONS.md.`);
    }
  }
}

// 28. src/index.css — WCAG AA contrast on every palette pair the app renders
//     (backlog item 59, §3.0.7).
//
//     Read the item's premise correction first, because it is the reason this
//     section is shaped the way it is. Item 59 was filed as "`theme.js` and
//     `index.css` both claim the palette's contrast is verified; nothing
//     verifies it, and the note one of them cites does not exist." The second
//     half is false: the CONTRAST note has been in `index.css`'s header since
//     the 2026-08-04 rebuild (`79d9507`), thirteen days before the item was
//     filed. The first half was true, and is what this fixes.
//
//     So this is not a bug report. Every pair passed when measured — 0
//     violations in both palettes — and this section exists to keep that true
//     through a future palette edit, which is the one kind of change that can
//     break contrast silently and invisibly to every other check in `npm test`.
//
//     THE PAIR SET IS DERIVED, NOT LISTED. Inks, surfaces and fills are read
//     out of the parsed CSS by prefix, so a token added tomorrow is covered
//     tomorrow. This is F10's lesson (a hand-maintained list that rots is not
//     fixed by a better hand-maintained list) and it is affordable here only
//     because the full cartesian product actually passes: all 7 inks clear AA
//     on all 7 surfaces, in both palettes, so nothing has to be exempted and
//     no judgment about "which pairs are real" has to be encoded and kept true.
//
//     Deliberately NOT checked, each for a stated reason:
//     • `--ink-on-fill` is excluded from the ink list and paired only with the
//       fills. It is #ffffff in light mode; on `--surface-canvas` that is
//       1.0:1, and including it would manufacture a failure for a pair the app
//       never renders.
//     • `--line-*` is not text. • `--graph-*` is not text either — `theme.js`
//       says "Graphics only ... where 3:1 is the bar. Never text." It is now
//       checked at that lower bar by §28b below, which closed backlog item 63.
//       This note used to say light `--graph-neutral` was "under 3:1 against 5
//       of 7 surfaces"; that undercounted — it was under 3:1 against **all 7**,
//       and the two it omitted (`--surface-card` at 2.57, `--surface-canvas` at
//       2.48) included the only surface any chart actually renders on. See
//       §28b's header for the classification that resolved the judgment call.
// ─────────────────────────────────────────────────────────────────────────────
{
  const AA = 4.5;
  const cssPath = join(ROOT, "src", "index.css");
  const cssSrc = readFileSync(cssPath, "utf8");

  // ── relative luminance / contrast, per WCAG 2.1 ──
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (hex) =>
    0.2126 * channel(parseInt(hex.slice(1, 3), 16)) +
    0.7152 * channel(parseInt(hex.slice(3, 5), 16)) +
    0.0722 * channel(parseInt(hex.slice(5, 7), 16));
  const contrast = (a, b) => {
    const [hi, lo] = luminance(a) > luminance(b) ? [luminance(a), luminance(b)] : [luminance(b), luminance(a)];
    return (hi + 0.05) / (lo + 0.05);
  };

  // SELF-TEST FIRST. This section asserts that numbers are large enough, so a
  // broken luminance formula reads as a pass on every pair at once — the same
  // trap §20/§22/§26 each had to guard, and the worst version of it, because
  // there is no absence to notice. Three fixed probes with published answers.
  const probes = [
    ["#ffffff", "#000000", 21.0],
    ["#2563eb", "#ffffff", 5.17], // blue-600 on white, a published reference pair
    ["#16181d", "#16181d", 1.0],
  ];
  let probesOk = true;
  for (const [a, b, expected] of probes) {
    if (Math.abs(contrast(a, b) - expected) > 0.01) {
      probesOk = false;
      fail(
        `§28: the contrast function failed its own self-test — ${a} on ${b} computed as ` +
          `${contrast(a, b).toFixed(2)}:1, expected ${expected}:1. Every assertion below is a ` +
          `lower bound, so a broken formula would have reported every pair as passing.`,
      );
    }
  }

  // ── parse the three palette blocks ──
  const parseBlock = (label, re) => {
    const m = cssSrc.match(re);
    if (!m) {
      fail(
        `§28: could not find the ${label} palette block in src/index.css. The scan matches nothing ` +
          `rather than the palette having gone away, and for a contrast check that reads as a pass.`,
      );
      return null;
    }
    const tokens = {};
    for (const [, k, v] of m[1].matchAll(/(--[a-z-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens[k] = v;
    // Floor: the palette has carried 27 hex tokens since 2026-08-04. Far fewer
    // means the token pattern broke, not that the design system shrank.
    if (Object.keys(tokens).length < 20) {
      fail(
        `§28: parsed only ${Object.keys(tokens).length} colour tokens from the ${label} palette ` +
          `(expected at least 20) — the token pattern is probably broken rather than the palette ` +
          `having been emptied.`,
      );
      return null;
    }
    return tokens;
  };

  const light = parseBlock("light (`:root`)", /:root\s*\{([\s\S]*?)\n\}/);
  const darkExplicit = parseBlock("explicit dark (`:root[data-theme=\"dark\"]`)", /:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
  const darkMedia = parseBlock(
    "system dark (`@media (prefers-color-scheme: dark)`)",
    /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{([\s\S]*?)\n {2}\}/,
  );

  // The two dark palettes are duplicated source, and index.css's own comment
  // says they are "kept in one place so the two can never drift apart" — which
  // is the intent, not a mechanism. This is the mechanism.
  if (darkExplicit && darkMedia) {
    const drifted = [...new Set([...Object.keys(darkExplicit), ...Object.keys(darkMedia)])].filter(
      (k) => darkExplicit[k] !== darkMedia[k],
    );
    if (drifted.length) {
      fail(
        `§28: the system-dark (@media) and explicit-dark ([data-theme="dark"]) palettes in ` +
          `src/index.css disagree on ${drifted.length} token(s): ` +
          drifted.map((k) => `${k} (${darkMedia[k] ?? "absent"} vs ${darkExplicit[k] ?? "absent"})`).join(", ") +
          `. A user who picks "dark" explicitly would see different colours from one who inherits it ` +
          `from the OS. The file's header comment promises these can never drift; keep them identical.`,
      );
    }
  }

  let pairsChecked = 0;
  const worst = {};
  for (const [label, palette] of [["light", light], ["dark", darkExplicit]]) {
    if (!palette) continue;
    // Derived by prefix — see the header note on why this is not a list.
    const inks = Object.keys(palette).filter((k) => k.startsWith("--ink-") && k !== "--ink-on-fill");
    const surfaces = Object.keys(palette).filter((k) => k.startsWith("--surface-"));
    const fills = Object.keys(palette).filter((k) => k.startsWith("--fill-"));

    const pairs = [];
    for (const ink of inks) for (const surface of surfaces) pairs.push([ink, surface]);
    for (const f of fills) pairs.push(["--ink-on-fill", f]);

    // Floor: 7 inks x 7 surfaces + 5 fills = 54 since 2026-08-04. A prefix
    // filter that silently matched nothing would otherwise pass 0 pairs.
    if (pairs.length < 50) {
      fail(
        `§28: the ${label} palette yielded only ${pairs.length} text/background pairs (expected at ` +
          `least 50, from ${inks.length} inks x ${surfaces.length} surfaces + ${fills.length} fills). ` +
          `The prefix filters are probably broken rather than the design system having collapsed.`,
      );
      continue;
    }

    let low = { ratio: Infinity, pair: null };
    for (const [fg, bg] of pairs) {
      const r = contrast(palette[fg], palette[bg]);
      pairsChecked++;
      if (r < low.ratio) low = { ratio: r, pair: `${fg} on ${bg}` };
      if (r < AA) {
        fail(
          `§28: ${label} palette fails WCAG AA — ${fg} (${palette[fg]}) on ${bg} (${palette[bg]}) is ` +
            `${r.toFixed(2)}:1, below ${AA}:1. LAUNCH_PLAN.md §3.0.7 requires body text at AA.`,
        );
      }
    }
    worst[label] = low;
  }

  // The header note's own figures, asserted against what was just computed.
  // This is the half that keeps the *prose* honest: item 59 exists because two
  // files claimed a verification that nothing performed, and the claim that
  // rotted worst was a number. Two of the note's three figures were wrong when
  // measured on 2026-08-17 (light worst case stated 4.72, actual 4.62; the
  // rejected white-on-dark-accent option stated 4.35, actual 2.16 — the
  // direction was right but the number understated it by half).
  if (probesOk && worst.light && worst.dark && darkExplicit) {
    const claims = [
      ["light worst case", /Light: worst case ([\d.]+):1/, worst.light.ratio],
      ["dark worst case", /Dark: worst case ([\d.]+):1/, worst.dark.ratio],
      [
        "white on the dark accent fill (the rejected option)",
        /white on --fill-accent would have been ([\d.]+):1/,
        contrast("#ffffff", darkExplicit["--fill-accent"]),
      ],
    ];
    // Matched against a whitespace-normalized copy: the note is a wrapped
    // comment, so any of these sentences can break across lines mid-phrase
    // (the white-on-fill one already does), and a pattern that only matched
    // the current wrapping would fail on reflow rather than on drift.
    const noteText = cssSrc.replace(/\s+/g, " ");
    for (const [label, re, computed] of claims) {
      const m = noteText.match(re);
      if (!m) {
        fail(
          `§28: src/index.css's CONTRAST header note no longer states its ${label} figure in the ` +
            `form this check reads (${re}). The note is machine-checked precisely so it cannot drift ` +
            `from the palette; keep the sentence, or update this pattern in the same change.`,
        );
      } else if (Math.abs(Number(m[1]) - computed) >= 0.005) {
        fail(
          `§28: src/index.css's CONTRAST note states ${label} as ${m[1]}:1, but the palette now ` +
            `computes ${computed.toFixed(2)}:1. Update the note in the change that moved the colour.`,
        );
      }
    }
  }

  if (pairsChecked > 0) {
    console.log(
      `  §28 contrast: ${pairsChecked} pairs at AA >= ${AA}:1 across both palettes` +
        (worst.light && worst.dark
          ? ` (worst light ${worst.light.ratio.toFixed(2)}:1 ${worst.light.pair}; ` +
            `worst dark ${worst.dark.ratio.toFixed(2)}:1 ${worst.dark.pair}).`
          : "."),
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 28b. `--graph-*` at WCAG 1.4.11's 3:1 (backlog item 63).
  //
  // 1.4.11 binds only graphical objects "required to understand the content",
  // so item 63 correctly refused to assert anything until the uses were
  // classified. They now are — all four rendered uses of `graph.neutral`:
  //
  //   MEANINGFUL (colour is the only thing distinguishing the object)
  //   • charts.jsx GrowthCurve via LessonVisual.jsx:107 — the compounding
  //     diagram's two series are both plain 2.5px polylines. Nothing but hue
  //     separates them, so the neutral stroke must be perceivable. This is the
  //     case that decides the item.
  //   • charts.jsx Bar via LessonVisual.jsx:169 and MarketSignals.jsx:89 — the
  //     bar's *height* carries the comparison (see Bar's own comment: at
  //     height={90} a ten-fold expansion once drew as four equal bars), so the
  //     bar has to be distinguishable from the card it sits on.
  //
  //   DECORATIVE (exempt, and not relied on)
  //   • charts.jsx:286 BracketStack's dashed "raise" outline. It is
  //     `aria-hidden`, non-interactive, and BracketStack's header comment says
  //     it "only names what the height difference already shows" — and a bold
  //     `raiseLabel` in `ink.body` sits directly above it. Redundant twice.
  //
  // Three meaningful uses, so the token must clear 3:1 — and the old #9aa2b1
  // did not, at 2.57:1 against `--surface-card`. Item 63's own figures missed
  // that pair: it reported "5 of 7 surfaces" and listed only the washes and
  // sunken, omitting card and canvas, so the surface every chart renders on
  // was the one absent from the measurement that deferred the fix.
  //
  // WHY THE ASSERTION IS WIDER THAN THE FINDING. Only graph x `--surface-card`
  // is rendered today. Asserting just that pair would encode "charts only ever
  // sit on card" as an invisible premise, which is F7's failure (a check that
  // freezes a guess). So the full cartesian is asserted, the three pairs it
  // cannot yet clear are exempted *by measured value*, and the premise that
  // makes them safe to exempt is itself checked below. An exemption that
  // records its own ratio cannot rot silently: move the colour and it fails.
  // ───────────────────────────────────────────────────────────────────────────
  const GRAPH_MIN = 3.0;

  // Each exemption states the pair, the ratio measured on 2026-08-17, and why
  // it is tolerable. Remove an entry the moment its pair clears the bar — the
  // check below fails if an exempted pair starts passing, so a later palette
  // fix cannot leave a stale exemption behind claiming a problem that is gone.
  const GRAPH_EXEMPT = [
    ["light", "--graph-amber", "--surface-sunken", 2.92],
    ["light", "--graph-amber", "--surface-accent-wash", 2.85],
    ["light", "--graph-amber", "--surface-bad-wash", 2.91],
  ];
  // The shared reason, asserted rather than trusted: every chart figure in
  // charts.jsx paints itself `surface.card`, so no graph token is ever drawn
  // on a wash or on sunken. `--graph-amber` on card is 3.44:1 and passes; its
  // three sub-3:1 pairs are with surfaces charts do not use. Filed as backlog
  // item 65 rather than fixed here — darkening a second palette colour is a
  // visual-design change, not an accessibility fix for a rendered defect.
  {
    const chartsSrc = readFileSync(join(ROOT, "src", "components", "charts.jsx"), "utf8");
    const figureSurfaces = [...chartsSrc.matchAll(/background:\s*surface\.([A-Za-z]+)/g)].map((m) => m[1]);
    if (figureSurfaces.length < 5) {
      fail(
        `§28b: found only ${figureSurfaces.length} \`background: surface.*\` declarations in ` +
          `src/components/charts.jsx (expected at least 5, one per chart figure). The scan is ` +
          `probably broken — and it is the premise that makes §28b's exemptions safe, so a scan ` +
          `that matches nothing must not read as a pass.`,
      );
    }
    const offCard = [...new Set(figureSurfaces.filter((s) => s !== "card"))];
    if (offCard.length) {
      fail(
        `§28b: a chart figure in src/components/charts.jsx now renders on surface.` +
          `${offCard.join(", surface.")} rather than surface.card. §28b exempts three ` +
          `\`--graph-amber\` pairs *because* no chart is drawn on a wash or on sunken — that ` +
          `premise just stopped holding. Either revert the surface, or re-measure the graph ` +
          `tokens against it and drop the exemption (backlog item 65).`,
      );
    }
  }

  let graphPairs = 0;
  const graphWorst = {};
  if (probesOk) {
    for (const [label, palette] of [["light", light], ["dark", darkExplicit]]) {
      if (!palette) continue;
      const graphs = Object.keys(palette).filter((k) => k.startsWith("--graph-"));
      const surfaces = Object.keys(palette).filter((k) => k.startsWith("--surface-"));
      // Floor: 5 graph tokens x 7 surfaces = 35 since 2026-08-04.
      if (graphs.length * surfaces.length < 30) {
        fail(
          `§28b: the ${label} palette yielded only ${graphs.length} graph tokens x ` +
            `${surfaces.length} surfaces (expected at least 30 pairs). The prefix filters are ` +
            `probably broken rather than the chart palette having been deleted.`,
        );
        continue;
      }
      let low = { ratio: Infinity, pair: null };
      for (const g of graphs) {
        for (const s of surfaces) {
          const r = contrast(palette[g], palette[s]);
          graphPairs++;
          const exempt = GRAPH_EXEMPT.find(([l, gg, ss]) => l === label && gg === g && ss === s);
          if (exempt) {
            if (r >= GRAPH_MIN) {
              fail(
                `§28b: ${label} ${g} on ${s} is now ${r.toFixed(2)}:1 and clears ${GRAPH_MIN}:1, but ` +
                  `it is still listed in GRAPH_EXEMPT. Delete the entry — a stale exemption ` +
                  `understates the palette and hides the next real regression behind it.`,
              );
            } else if (Math.abs(r - exempt[3]) >= 0.005) {
              fail(
                `§28b: ${label} ${g} (${palette[g]}) on ${s} (${palette[s]}) is ${r.toFixed(2)}:1, but ` +
                  `GRAPH_EXEMPT records it as ${exempt[3]}:1. The colour moved without the ` +
                  `exemption being revisited; re-measure and update the entry, or fix the pair.`,
              );
            }
            continue;
          }
          if (r < low.ratio) low = { ratio: r, pair: `${g} on ${s}` };
          if (r < GRAPH_MIN) {
            fail(
              `§28b: ${label} palette fails WCAG 1.4.11 — ${g} (${palette[g]}) on ${s} ` +
                `(${palette[s]}) is ${r.toFixed(2)}:1, below ${GRAPH_MIN}:1. theme.js says graph ` +
                `tokens are "chart strokes and dots, where 3:1 is the bar"; charts render on ` +
                `surface.card, and a series stroke that only colour distinguishes is a graphical ` +
                `object required to understand the content. Darken the token, or — if this ` +
                `particular use is decorative — say so in GRAPH_EXEMPT with its measured ratio.`,
            );
          }
        }
      }
      graphWorst[label] = low;
    }
  }

  if (graphPairs > 0) {
    console.log(
      `  §28b graph contrast: ${graphPairs} pairs at 1.4.11 >= ${GRAPH_MIN}:1 across both palettes, ` +
        `${GRAPH_EXEMPT.length} exempted` +
        (graphWorst.light && graphWorst.dark
          ? ` (worst light ${graphWorst.light.ratio.toFixed(2)}:1 ${graphWorst.light.pair}; ` +
            `worst dark ${graphWorst.dark.ratio.toFixed(2)}:1 ${graphWorst.dark.pair}).`
          : "."),
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 29. DECISIONS.md's lesson-id ranges (backlog item 62's F12).
//
//     Item 55 generated `LAUNCH_PLAN.md` §2.5's track table *because* a
//     hand-written lesson range rots: §2.5 said money `13-26` / economy `1-12`
//     for three days after the 2026-08-14 renumbering made it money 1–28 /
//     economy 29–40. F12's finding is that the identical table sits one
//     document over, in DECISIONS.md's two-tracks entry, still hand-written
//     and unguarded.
//
//     **Why this asserts rather than generates, which is the whole design.**
//     The obvious fix — add the sentence to `refresh-readiness.mjs`'s guarded
//     list — is wrong here, and F11 says why: DECISIONS.md's entries are
//     *dated records*. The live range lives inside "Update, 2026-08-14", and a
//     `--write` pass would silently rewrite what a run recorded as true on a
//     date, which falsifies the record rather than fixing it. So this check
//     never edits: it fails, and its message names the honest repair —
//     **append a new dated Update and reclassify the old claim as historical
//     below.** Generation is right for a document that states current truth;
//     assertion is right for one that states dated truth.
//
//     Scope is the one section that talks about lesson ids, located by its
//     heading. Scoping to the section is not laziness, it is what makes the
//     net sound: run document-wide, the same pattern also matches "weeks 1–8",
//     "steps 1–3", "roughly 40–50 terms" and a §5 quote about "lessons 1–2",
//     none of which are lesson ids. Six false positives document-wide, zero
//     inside the section — and §26's lesson is that a guard whose false
//     positives are ordinary prose is off within a week.
//
//     Every range the net finds must be classified below. `live` means it must
//     equal a track's current range; `historical` means it must equal none of
//     them (a historical claim that starts matching again is either mislabelled
//     or a coincidence worth looking at). Both directions are checked, so a
//     classification cannot outlive its reason — the same property §26's
//     `path-ok` markers and §28b's `GRAPH_EXEMPT` ratios have.
{
  const HEADING = "### Two lesson tracks, money-first, instead of one sequential path";
  const doc = readFileSync(join(ROOT, "DECISIONS.md"), "utf8");
  const start = doc.indexOf(HEADING);

  if (start === -1) {
    fail(
      `§29: DECISIONS.md no longer contains the heading "${HEADING}". That section is where this ` +
        `repo records which lesson ids belong to which track, and §29 has nothing to check without ` +
        `it. If the entry was retitled, update HEADING here in the same change; if it was removed, ` +
        `delete §29 and say so in DECISIONS.md rather than leaving a check that passes vacuously.`,
    );
  } else {
    const end = doc.indexOf("\n### ", start + HEADING.length);
    const section = doc.slice(start, end === -1 ? doc.length : end);

    // A range written as `13-26`, `13–26` or `13→26`. Two-digit endpoints only,
    // and neither side may touch another digit or a dash: that is what keeps
    // `2026-08-14` out (its `08` is preceded by `-`, its `26` by `20`) without
    // needing a date exception. Trailing punctuation is deliberately *allowed*
    // — an earlier draft excluded a following `,` and silently lost three of
    // the eleven claims, including one of the two live ones.
    const NET = /(?<![\d-])(\d{1,2})\s*(?:[-–—]|→|-now-)\s*(\d{1,2})(?![\d-])/g;
    const found = [...section.matchAll(NET)]
      .map((m) => ({ text: m[0], lo: +m[1], hi: +m[2] }))
      // Ascending pairs inside the lesson-id space. The money track's four
      // backward cross-references ("16→3, 17→10, 21→4") are lesson *pointers*,
      // not ranges, and read as noise here.
      .filter((r) => r.lo >= 1 && r.hi > r.lo && r.hi <= 60);

    // Classified by hand, once, with the reason. Ordered as they appear.
    const CLAIMS = [
      ["13-26", 1, "historical", "the 2026-08-07 money range, before the renumbering"],
      ["1-12", 3, "historical", "the 2026-08-07 economy range: the track table, the sentence about where those lessons came from, and the `(was ...)` note in the Update"],
      ["12-now-17", 1, "historical", "part of the `23→12-now-17` cross-reference audit, itself a pre-renumbering id"],
      ["13→26", 1, "historical", "the 'cosmetic seam' the renumbering removed — money as it then ran"],
      ["1→12", 1, "historical", "the same sentence's economy half"],
      ["1-28", 1, "live", "money"],
      ["29-40", 1, "live", "economy"],
      ["13-40", 1, "historical", "the money range immediately before the 2026-08-14 remap"],
      ["1-40", 1, "historical", "the remap table's domain, not a track — `bijective over 1-40`"],
    ];

    // Floor first: if the net breaks, every assertion below passes by matching
    // nothing, which is the vacuous pass §20/§22 exist to make impossible.
    const expectedTotal = CLAIMS.reduce((n, [, count]) => n + count, 0);
    if (found.length < 8) {
      fail(
        `§29: the range pattern found only ${found.length} lesson ranges in DECISIONS.md's ` +
          `two-tracks section (expected ${expectedTotal}). The pattern is probably broken rather ` +
          `than the section having been emptied — a scan that matches nothing must not read as a pass.`,
      );
    } else {
      // `TRACKS` is an array of `{key, ...}`, not a keyed object — reading it
      // as one yields a single `undefined` track whose range matches nothing,
      // which made every live claim "wrong" on the first run of this check.
      const current = Object.fromEntries(
        TRACKS.map(({ key }) => {
          const ids = lessons.filter((l) => l.track === key).map((l) => l.id).sort((a, b) => a - b);
          return [key, {
            ids,
            lo: ids[0],
            hi: ids[ids.length - 1],
            contiguous: ids.every((id, i) => i === 0 || id === ids[i - 1] + 1),
          }];
        }),
      );
      for (const [key, r] of Object.entries(current)) {
        if (!Number.isInteger(r.lo) || !Number.isInteger(r.hi)) {
          fail(`§29: track "${key}" yielded no lesson ids, so its range cannot be derived — the tree read is broken, not the document.`);
        } else if (!r.contiguous) {
          // Same argument refresh-readiness.mjs makes for §2.5: a range is only
          // an honest description of a contiguous set. Without this, a track
          // with a hole in it still produces a first/last pair, and DECISIONS.md
          // could be certified as "matching the tree" against a range that
          // skips lessons.
          fail(
            `§29: track "${key}" ids are not contiguous (${r.ids.join(", ")}), so "${r.lo}-${r.hi}" ` +
              `is not a description of it. DECISIONS.md states each track as a range; a catalogue ` +
              `with a hole in it needs the entry reworded to a list, and §29's CLAIMS table with it.`,
          );
        }
      }
      const trackFor = (r) =>
        Object.keys(current).find((t) => current[t].lo === r.lo && current[t].hi === r.hi);

      const seen = new Map();
      for (const r of found) seen.set(r.text, (seen.get(r.text) ?? 0) + 1);

      for (const [text, count, status, why] of CLAIMS) {
        const actual = seen.get(text) ?? 0;
        if (actual !== count) {
          fail(
            `§29: DECISIONS.md's two-tracks section states "${text}" ${actual} time(s); §29 has it ` +
              `classified ${status} and expects ${count} (${why}). A claim that was reworded or ` +
              `removed must be re-read and reclassified here, not quietly dropped from the check.`,
          );
          continue;
        }
        const [lo, hi] = text.split(/[-–—]|→|-now-/).map(Number);
        const matches = trackFor({ lo, hi });
        if (status === "live" && matches !== why) {
          fail(
            `§29: DECISIONS.md states the ${why} track as "${text}", but ${why} is now ` +
              `${current[why].lo}-${current[why].hi} in src/content/lessons.js. ` +
              `**Do not edit the 2026-08-14 Update to say the new numbers** — it is a dated record ` +
              `of what was true then, and rewriting it falsifies the record (backlog item 62's F11). ` +
              `Append a NEW dated Update stating the current ranges, then move "${text}" to ` +
              `historical in §29's CLAIMS table and add the new range as live.`,
          );
        }
        if (status === "historical" && matches) {
          fail(
            `§29: "${text}" is classified historical, but it is now the ${matches} track's actual ` +
              `range. Either the classification is wrong, or a renumbering has landed back on an old ` +
              `range — read the sentence before deciding which. A historical claim that has become ` +
              `true again is not an exemption worth keeping.`,
          );
        }
      }

      const classified = new Set(CLAIMS.map(([t]) => t));
      for (const text of [...seen.keys()].filter((t) => !classified.has(t))) {
        fail(
          `§29: DECISIONS.md's two-tracks section states a lesson range "${text}" that §29 does not ` +
            `classify. Read it, then add it to CLAIMS as \`live\` (it must equal a track's current ` +
            `range) or \`historical\` (it must equal none). An unclassified range is exactly the ` +
            `hand-written table item 55 had to generate one document over.`,
        );
      }

      console.log(
        `  §29 DECISIONS.md lesson ranges: ${found.length} claims in the two-tracks section, ` +
          `${CLAIMS.filter(([, , s]) => s === "live").length} live and checked against the tree ` +
          `(money ${current.money.lo}-${current.money.hi}, economy ${current.economy.lo}-${current.economy.hi}), ` +
          `${CLAIMS.filter(([, , s]) => s === "historical").reduce((n, [, c]) => n + c, 0)} dated and required not to match.`,
      );
    }
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
