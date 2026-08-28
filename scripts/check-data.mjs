#!/usr/bin/env node
// Data-shape checks for the content/locale modules under src/content and
// src/locales. Run via `npm test`. Catches the class of bug a JSX/build
// check can't: a missing language field, an out-of-range quiz answer, or a
// dangling `t.someKey` reference — without needing a browser.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

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
import { HTML_LANG } from "../src/lib/useAppState.js";
import { ROUTED_TABS, initialRoute, parseRoute, resolveRoute, routeHash } from "../src/lib/deepLink.js";
import { computeCoverage } from "./translation-review.mjs";
import {
  LANGS as COMPLETENESS_LANGS,
  completeness,
  drift as completenessDrift,
  loadBaseline as loadCompletenessBaseline,
} from "./translation-completeness.mjs";
import * as storageLib from "../src/lib/storage.js";
import { EVENTS, MAX_LOGGED_EVENTS, elapsedSeconds, monotonicNow, quizScore, track } from "../src/lib/analytics.js";
import { redactUrl, getAdapter, fixture, ADAPTERS } from "../src/lib/marketData/adapters.js";
import { FUTURE_TOLERANCE_DAYS, STALE_AFTER_DAYS, freshness } from "../src/lib/useMarketData.js";
import { FRED_SERIES, fixtureEconomics } from "../src/lib/marketData/fred.js";
import { dayDiff, todayStr } from "../src/utils/date.js";

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

// 1b. Placeholder parity across languages (filed with item 117's counted
//     "Practice all questions ({n})" button, which made this the 15th key of
//     this shape). A locale value like "{n} ready to review" is interpolated
//     by `String.replace("{n}", …)` at the call site, so a translation that
//     drops or mistypes its token does not throw and does not fall back — it
//     RENDERS THE BRACES to the learner, in that language only, on a screen
//     nobody sweeping English would look at.
//
//     Measured before writing this: 14 keys carried placeholders and all 14
//     agreed across all five languages, so this guards a property that holds
//     today rather than repairing one. It is here because the property has no
//     other instrument and because §1 above already walks exactly this data —
//     not because a defect was found. (Item 130's "one defect is not a class"
//     argues against building a NET for a hypothetical; this is ten lines
//     inside a loop that is already running, which is the other side of that
//     trade.)
//
//     The comparison is deliberately the SET of tokens, not their order or
//     count: `lessonProgressTemplate` legitimately reorders {done}/{total} per
//     language, and a language may repeat a token.
{
  if (checkLangSet(TR, "TR")) {
    const tokens = (v) => [...new Set(String(v).match(/\{[a-zA-Z]+\}/g) ?? [])].sort().join(",");
    const before = failures;
    let templated = 0;
    for (const k of Object.keys(TR.en)) {
      const en = tokens(TR.en[k]);
      if (!en) {
        // The converse also has to hold, or a stray token in one language is invisible.
        for (const lang of LANGS) {
          if (lang !== "en" && tokens(TR[lang][k])) {
            fail(`§1b: TR.${lang}.${k} contains the placeholder(s) ${tokens(TR[lang][k])} but TR.en.${k} contains none — nothing interpolates it, so those braces render literally.`);
          }
        }
        continue;
      }
      templated++;
      for (const lang of LANGS) {
        const got = tokens(TR[lang][k]);
        if (got !== en) {
          fail(`§1b: TR.${lang}.${k} has placeholders [${got || "none"}] where TR.en.${k} has [${en}]. These are interpolated by a literal String.replace at the call site, so a missing token renders as-is and an unknown one is never substituted — "${TR[lang][k]}" would reach the learner verbatim.`);
        }
      }
    }
    // CONTROL, both directions: the comparison must reject a dropped token and
    // accept a legitimate reordering. Without this a bug in `tokens()` (say, a
    // regex that matches nothing) passes every key silently.
    const t = (v) => [...new Set(String(v).match(/\{[a-zA-Z]+\}/g) ?? [])].sort().join(",");
    if (t("{n} ready to review") === t("ready to review")) {
      fail("§1b CONTROL: the placeholder comparison cannot tell a template from the same string with its token removed, so every result above is meaningless.");
    }
    if (t("{done} of {total}") !== t("{total}: {done}")) {
      fail("§1b CONTROL: the placeholder comparison is order-sensitive, which would fail lessonProgressTemplate's legitimate per-language reordering.");
    }
    if (templated < 10) {
      fail(`§1b CONTROL: only ${templated} keys were seen to carry placeholders; 14 did when this check was written, so a number this low means the walk or the pattern is broken and the clean result above says nothing.`);
    }
    // Gated on this section's own failure count: an "all agree" line printed
    // three lines under its own FAIL is a false statement in the output, and
    // the log is what run entries quote.
    if (failures === before) {
      console.log(`  §1b: ${templated} locale keys carry {placeholders}; all agree across ${LANGS.length} languages (a dropped token renders its braces to the learner).`);
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
// is a modeling error, not a data error: the old count read section *bodies*
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
      `§2 reading model: the whole catalog counts ${totalWords} words (expect ≥8,000). The model, ` +
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
    "paywall_viewed", "trial_started", "subscribed", "canceled", "ad_watched",
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
//      field). Source-text checks, not behavioral ones: these files render
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
//     it needs no per-language translation judgment to verify.
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

  // CROSS-REFERENCES ARE BY TITLE, NOT BY NUMBER (backlog item 84,
  // owner-directed 2026-08-20). Every check above this line validates that a
  // translated reference points at the SAME lesson as the English it mirrors.
  // None of them can catch the failure that actually shipped: a reference that
  // is internally consistent across all five languages and still unusable,
  // because the number it names is a lesson ID and the UI shows a lesson's
  // position within its track. Track sizes are 12/13/15, so the largest number
  // any screen displays is 15 — and 30 of the 58 English references cited
  // something above that, pointing at a lesson number no reader could find.
  //
  // The fix was to name the lesson: “Compound Interest”, «Interés Compuesto»,
  // 「복리」, 《复利》, 『複利』. A title survives a reorder and a renumbering;
  // a number survives neither, and display order has now changed twice.
  //
  // So this asserts ABSENCE, which the consistency checks structurally cannot.
  // If you are adding a cross-reference, write the lesson's title. If you are
  // seeing this fire, something reintroduced "Lesson N" prose.
  {
    const offenders = LANGS.filter((l) => refTotals[l] > 0);
    if (offenders.length) {
      fail(
        `§16b: numeric "Lesson N" cross-references are back in ${offenders
          .map((l) => `${l} (${refTotals[l]})`)
          .join(", ")}. Cross-references must name the lesson's TITLE, not its number — ` +
          `a number is a lesson id, and the reader only ever sees a lesson's position within its track ` +
          `(backlog item 84). Use the localized title from lessons.js.`,
      );
    } else {
      console.log(`  §16b: no numeric "Lesson N" cross-references in any language — references are by title`);
    }
  }

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
//     the wrong sense (essentials lesson 12's "PMI" is private mortgage insurance,
//     not Purchasing Managers' Index; lesson 17's is *lifestyle* inflation).
//     Curation is a judgment call and cannot be checked here — but the four
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
  // languages render an unlabeled row of buttons.
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
//      "premium" is the term premium on long bonds. Those judgments lived in
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
//      — deciding which candidate is real jargon is judgment, and the only
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

  // A CROSS-REFERENCE IS NOT A TERM USE (backlog item 84). Cross-references in
  // lesson prose name the lesson they point at — “Compound Interest”,
  // “Stocks, Bonds & Diversification”, “QE & QT” — and several of those titles
  // are also glossary keys. Left in the haystack they read as the lesson using
  // the term, so this check demanded a glossary chip on a phrase that is a
  // pointer to another lesson, not a concept the sentence is teaching. Linking
  // it would send a reader to a definition when the text meant "go read that
  // lesson", and excluding each one by hand would put ~10 identical entries in
  // deliberatelyUnlinked.
  //
  // Only spans that match a real lesson title head are removed, not every
  // quoted span, so this cannot silently swallow an ordinary quotation that
  // happens to contain a glossary term.
  const TITLE_SPANS = lessons
    .map((l) => `“${l.title.en.split(":")[0]}”`)
    .sort((a, b) => b.length - a.length);
  const stripTitleRefs = (text) => {
    let out = text;
    for (const span of TITLE_SPANS) out = out.split(span).join(" ");
    return out;
  };

  const mentionedIn = (entry, key) =>
    entry.sections.some((s) => {
      const hay = stripTitleRefs(`${s.heading.en}\n${s.body.en}`);
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
            `("other-sense: <meaning>") — it is a judgment call, and the note is the whole record of it.`,
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
      fail(`deepLink: unrecognized hash ${JSON.stringify(bad)} resolved to ${JSON.stringify(back)}, expected the lesson path`);
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
//     The bug this generalizes from: `Bar` was the one primitive that took no
//     `description`, so lesson 37's Fed balance-sheet figure was a stack of
//     unlabeled <div>s — the only lesson visual in the app with no text
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
              // defense against an unlabeled figure; it is no longer a license
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
        `§28: parsed only ${Object.keys(tokens).length} color tokens from the ${label} palette ` +
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
          `. A user who picks "dark" explicitly would see different colors from one who inherits it ` +
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

    // Floor: 7 inks x 7 surfaces + 6 fills = 55 (5 fills / 54 until
    // 2026-08-20, when --fill-warn landed with backlog item 75). A prefix
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
            `computes ${computed.toFixed(2)}:1. Update the note in the change that moved the color.`,
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
  // classified. They now are — all six rendered uses of `graph.neutral`.
  //
  // ⚠️ CITED BY COMPONENT, NOT BY LINE, and deliberately. This list carried
  // four `file:line` references and by 2026-08-27 all four had rotted — it
  // said charts.jsx:286 for a BracketStack outline that was by then at :396,
  // and two LessonVisual.jsx lines that had moved when lesson 23's figure
  // landed. Nothing checks these, they drift on every insertion above them,
  // and a component name is both stable and greppable. Do not reintroduce
  // line numbers here.
  //
  //   MEANINGFUL (color is the only thing distinguishing the object)
  //   • charts.jsx GrowthCurve, via LessonVisual — the compounding diagram's
  //     two series are both plain 2.5px polylines. Nothing but hue separates
  //     them, so the neutral stroke must be perceivable. This is the case that
  //     decides the item.
  //   • charts.jsx Bar, via LessonVisual and MarketSignals — the bar's
  //     *height* carries the comparison (see Bar's own comment: at height={90}
  //     a ten-fold expansion once drew as four equal bars), so the bar has to
  //     be distinguishable from the card it sits on.
  //   • charts.jsx AsymmetryChart's shared zero line (added 2026-08-27, backlog
  //     item 123). The two bars ARE their distance from it and they run in
  //     opposite directions, so it is the reference the whole figure is read
  //     against. Was `line.strong` at 1.71:1 light / 1.62:1 dark — see §51,
  //     which is the section that found it.
  //   • charts.jsx CycleChart's long-run trend line (added 2026-08-27, item
  //     123). `trendLabel` is drawn beneath it and names it, so a caption
  //     refers to this line. Same origin, same measurement.
  //
  //   DECORATIVE (exempt, and not relied on)
  //   • charts.jsx BracketStack's dashed "raise" outline. It is `aria-hidden`,
  //     non-interactive, and BracketStack's header comment says it "only names
  //     what the height difference already shows" — and a bold `raiseLabel` in
  //     `ink.body` sits directly above it. Redundant twice.
  //
  // Five meaningful uses, so the token must clear 3:1 — and the old #9aa2b1
  // did not, at 2.57:1 against `--surface-card`. Item 63's own figures missed
  // that pair: it reported "5 of 7 surfaces" and listed only the washes and
  // sunken, omitting card and canvas, so the surface every chart renders on
  // was the one absent from the measurement that deferred the fix.
  //
  // WHY THE ASSERTION IS WIDER THAN THE FINDING. Only graph x `--surface-card`
  // is rendered today. Asserting just that pair would encode "charts only ever
  // sit on card" as an invisible premise, which is F7's failure (a check that
  // freezes a guess). So the full cartesian is asserted.
  //
  // It is asserted with NO exemptions as of 2026-08-17 (backlog item 65). Three
  // light `--graph-amber` pairs used to be exempted, on the premise — asserted
  // in code here — that every chart figure renders on `surface.card`. Item 65
  // re-measured that premise's own figures and they did not reproduce: this
  // comment claimed amber on card was 3.44:1 when it was 3.19:1, and canvas
  // 3.24:1 when it was 3.08:1. The real margins were 0.19 and 0.08, not 0.44
  // and 0.24, which is a different decision — amber's *best* case was below
  // every other graph token's *worst* case. So amber moved (#d97706 ->
  // #c56c05, see src/index.css) instead of the exemption being made permanent,
  // all 35 light pairs now clear 3.36:1, and both the exemption list and the
  // charts-on-card premise check went away with it. Note the shape: item 63's
  // figures missed card and canvas, and item 65's mis-stated the same two.
  // ───────────────────────────────────────────────────────────────────────────
  const GRAPH_MIN = 3.0;

  // Empty, and that is the strongest state this list has: every pair below is
  // held to GRAPH_MIN with nothing carved out. Kept as a list rather than
  // deleted so the escape hatch has rules attached — an entry must state the
  // pair, the ratio measured the day it was added, and why it is tolerable,
  // and the loop below FAILS on an entry whose pair has started passing, so a
  // later palette fix cannot leave a stale exemption behind.
  const GRAPH_EXEMPT = [];
  // The charts-on-card scan that used to live here was deleted with the
  // exemptions it justified (backlog item 65). It asserted that every
  // `background: surface.*` in charts.jsx was `surface.card` — the premise that
  // made the three amber exemptions safe. With no exemptions, it guards
  // nothing: a chart moved onto a wash is now covered by the cartesian below,
  // which is a stronger check than the premise ever was. Left in place it would
  // fail a build for moving a chart onto `surface.sunken`, which is a layout
  // choice with no accessibility consequence now that all five tokens clear
  // 3:1 on all seven surfaces.

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
                  `GRAPH_EXEMPT records it as ${exempt[3]}:1. The color moved without the ` +
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
                `tokens are "chart strokes and dots, where 3:1 is the bar", and a series stroke ` +
                `that only color distinguishes is a graphical object required to understand the ` +
                `content. Darken the token, or — if the uses this token has today are all ` +
                `decorative — say so in GRAPH_EXEMPT with its measured ratio and its reason.`,
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
//     them (a historical claim that starts matching again is either mislabeled
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
      // Reclassified 2026-08-18: the owner-directed three-track split moved
      // money to its judgment half and gave the mechanics half its own key, so
      // "1-28" stopped describing a live track and became the record of what
      // money was between the 2026-08-14 renumbering and that split.
      ["1-28", 1, "historical", "the money range between the 2026-08-14 renumbering and the 2026-08-18 three-track split"],
      // Reclassified 2026-08-25: lessons 41-44 were inserted at the FRONT of
      // money's display order without renumbering (this repo's ids are never
      // renumbered for a display-order change — see the 2026-08-18 Update
      // below), so money's id set is now two disjoint blocks rather than one
      // range. "16-28" alone stopped being a complete description of money the
      // moment 41-44 joined it; it now stands alongside a second live claim,
      // and both are required (see "live claims are a UNION, not a range"
      // below). Two mentions: the 2026-08-18 Update, and the 2026-08-25 one
      // that restates it alongside 41-44.
      ["16-28", 2, "live", "money"],
      ["41-44", 1, "live", "money"],
      ["1-15", 1, "live", "essentials"],
      // Two mentions since 2026-08-18: the original track table, plus the new
      // dated Update restating economy as the range that did NOT move.
      ["29-40", 2, "live", "economy"],
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
        }
      }
      // A single (lo, hi) pair can only describe a CONTIGUOUS id set, and this
      // repo's ids are deliberately never renumbered to keep a track's ids
      // contiguous after a display-order change (see the 2026-08-18 and
      // 2026-08-25 Updates) — so a track can legitimately end up as two or
      // more disjoint blocks. `trackFor` below is exact-bounds matching, used
      // only for the historical-collision check (a dated claim's bounds
      // coincidentally matching a CURRENT track's overall span); live claims
      // are validated separately, below, by reconstructing each track's full
      // id SET from every live claim naming it and comparing sets, not bounds.
      // That subsumes the old single-range "is this track contiguous" gate:
      // a track described by exactly the wrong ranges still fails, just via
      // set mismatch instead of a contiguity flag.
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
        if (status === "historical") {
          const [lo, hi] = text.split(/[-–—]|→|-now-/).map(Number);
          const matches = trackFor({ lo, hi });
          if (matches) {
            fail(
              `§29: "${text}" is classified historical, but it is now the ${matches} track's actual ` +
                `range. Either the classification is wrong, or a renumbering has landed back on an old ` +
                `range — read the sentence before deciding which. A historical claim that has become ` +
                `true again is not an exemption worth keeping.`,
            );
          }
        }
      }

      // Live claims are a UNION, not a range: every claim classified `live`
      // for a track is expanded to the integers it spans and pooled with every
      // other live claim for that SAME track, and the pooled set must exactly
      // equal the track's real ids — no id claimed that the track doesn't
      // have, none of the track's real ids left unclaimed. For a track with
      // one contiguous block (essentials, economy today) this is exactly the
      // old lo/hi check with extra paranoia; for a track split across
      // disjoint blocks (money, since 2026-08-25) it is the only check that
      // can be honest about it at all.
      const liveByTrack = {};
      for (const [text, , status, why] of CLAIMS) {
        if (status === "live") (liveByTrack[why] ??= []).push(text);
      }
      for (const [key, r] of Object.entries(current)) {
        if (!Number.isInteger(r.lo) || !Number.isInteger(r.hi)) continue; // already failed above
        const claims = liveByTrack[key] ?? [];
        if (claims.length === 0) {
          fail(`§29: track "${key}" has no live range claim in DECISIONS.md's CLAIMS table — add one describing its current ids.`);
          continue;
        }
        const claimedIds = new Set();
        for (const text of claims) {
          const [lo, hi] = text.split(/[-–—]|→|-now-/).map(Number);
          for (let i = lo; i <= hi; i++) claimedIds.add(i);
        }
        const actualIds = new Set(r.ids);
        const extra = [...claimedIds].filter((id) => !actualIds.has(id)).sort((a, b) => a - b);
        const missing = [...actualIds].filter((id) => !claimedIds.has(id)).sort((a, b) => a - b);
        if (extra.length || missing.length) {
          fail(
            `§29: DECISIONS.md's live claim(s) for "${key}" (${claims.join(", ")}) describe ids ` +
              `${[...claimedIds].sort((a, b) => a - b).join(",")}, but ${key} is actually ` +
              `${r.ids.join(",")} in src/content/lessons.js` +
              (extra.length ? ` — claims ${extra.join(",")}, which ${key} doesn't have` : "") +
              (missing.length ? ` — missing ${missing.join(",")}` : "") +
              `. **Do not edit an already-dated Update to say the new numbers** — it is a dated ` +
              `record of what was true then, and rewriting it falsifies the record (backlog item ` +
              `62's F11). Append a NEW dated Update stating the current ranges, then update this ` +
              `entry's classification (and §29's CLAIMS table) to match.`,
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

      const rangeDesc = (r) => (r.contiguous ? `${r.lo}-${r.hi}` : r.ids.join(","));
      console.log(
        `  §29 DECISIONS.md lesson ranges: ${found.length} claims in the two-tracks section, ` +
          `${CLAIMS.filter(([, , s]) => s === "live").length} live and checked against the tree ` +
          `(${Object.entries(current).map(([k, r]) => `${k} ${rangeDesc(r)}`).join(", ")}), ` +
          `${CLAIMS.filter(([, , s]) => s === "historical").reduce((n, [, c]) => n + c, 0)} dated and required not to match.`,
      );
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 30. src/utils/date.js — the app's single notion of "today" and of "how many
//     days apart" (backlog item 78).
//
//     `todayStr()` and `dayDiff()` are read by the streak counter
//     (`useAppState.js`), the Leitner due dates (`review.js`), the market-data
//     staleness rule (`useMarketData.js`) and three scripts. There is no known
//     bug: this is regression cover.
//
//     **What was already covered, measured by injection rather than assumed —
//     because item 78 filed this as "no test would fail today if their
//     arithmetic did", and that was wrong three times over.** Four regressions
//     injected into `date.js` in a `git archive HEAD` copy already turn the
//     suite red without this section: `dayDiff` with its arguments swapped,
//     off by one, or with a wrong month index (all caught by §25, which
//     reaches `dayDiff` through `freshness`); and `todayStr()` returning an
//     unpadded `2026-8-20` (caught by check-claims.mjs's CLAIMS_TODAY shape
//     assertion). A `todayStr()` rewritten to `toISOString().slice(0, 10)` is
//     caught by §23 above. So this section deliberately does NOT restate those.
//
//     **The two regressions that passed green, which are what it is for:**
//
//     1. **`dayDiff` computed in local time.** Replacing the `Date.UTC`
//        composition with `new Date(y, m - 1, d)` and `Math.floor` makes
//        `dayDiff("2026-03-07", "2026-03-09")` return **1** in
//        `America/New_York` — a whole day lost across spring forward — and
//        `npm test` still exits 0. That is the exact defect the header comment
//        in `date.js` says the `Date.UTC` composition exists to prevent, and
//        nothing was checking it. §25's case table crosses month and year
//        boundaries but no DST boundary.
//     2. **`todayStr()` off by a day with the right shape.** `getDate() + 1`
//        passes every existing check: the shape is still `YYYY-MM-DD`, so
//        check-claims is satisfied, and §23 only greps for the UTC idiom. It
//        would silently break the streak counter and every Leitner due date.
//
//     **Method, and why the control matters more than the assertions.** The
//     DST cases walk every consecutive-day pair of a year in several named
//     zones rather than hardcoding transition dates, so they cannot go stale
//     against a tzdata update and cannot miss a transition I misremembered.
//     But a walk that never meets a transition passes for the wrong reason and
//     is indistinguishable from a walk that meets one and handles it — so each
//     DST zone must first be *shown* to contain exactly one short and one long
//     local day inside the scanned range, and each fixed-offset zone to contain
//     none. If that control stops holding, the zone list is what is broken, not
//     `dayDiff`.
//
//     `process.env.TZ` is set and restored inside this block. Node re-reads it
//     per `Date` operation, so this needs no child process — but it does mean
//     nothing below may depend on the ambient zone, hence the restore and
//     hence this section sitting last.
{
  const ORIGINAL_TZ = process.env.TZ;
  // `process.env.TZ = undefined` stores the *string* "undefined", which is not
  // a zone and is not what was there before. Found by the restore assertion
  // below firing on this section's own first run, which is the assertion
  // earning its place.
  const restoreTZ = () => {
    if (ORIGINAL_TZ === undefined) delete process.env.TZ;
    else process.env.TZ = ORIGINAL_TZ;
  };
  const YEAR = 2026;

  // [zone, expected short (23h) days in YEAR, expected long (25h) days]
  const ZONES = [
    ["America/New_York", 1, 1],
    ["Europe/London", 1, 1],
    ["Australia/Sydney", 1, 1],   // southern hemisphere: transitions run the other way round
    ["America/Santiago", 1, 1],
    ["Asia/Kolkata", 0, 0],       // +05:30 — a half-hour offset, no DST
    ["Pacific/Kiritimati", 0, 0], // +14:00 — the extreme east, no DST
  ];

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  let pairsChecked = 0;
  let transitionsCovered = 0;

  for (const [tz, wantShort, wantLong] of ZONES) {
    process.env.TZ = tz;

    // The control, first: does this walk actually meet the thing it is testing?
    let short = 0;
    let long = 0;
    for (let i = 0; i < 365; i++) {
      const hours = (new Date(YEAR, 0, 2 + i).getTime() - new Date(YEAR, 0, 1 + i).getTime()) / 3600000;
      if (hours < 24) short++;
      if (hours > 24) long++;
    }
    if (short !== wantShort || long !== wantLong) {
      fail(
        `§30 control: in ${YEAR}, ${tz} has ${short} local day(s) shorter than 24h and ${long} longer, ` +
          `expected ${wantShort} and ${wantLong}. The dayDiff results below prove nothing until this ` +
          `holds — a walk that never crosses a DST boundary passes for the wrong reason. Fix the zone ` +
          `list (a tzdata change, or a zone that abolished DST), not dayDiff.`,
      );
      continue;
    }
    transitionsCovered += short + long;

    // Every consecutive calendar day in the year is exactly one day apart, in
    // every zone — including across whichever days the control just proved are
    // 23 and 25 hours long.
    let firstBad = null;
    for (let i = 0; i < 365; i++) {
      const a = iso(new Date(YEAR, 0, 1 + i));
      const b = iso(new Date(YEAR, 0, 2 + i));
      pairsChecked++;
      const got = dayDiff(a, b);
      if (got !== 1 && firstBad === null) firstBad = [a, b, got];
    }
    if (firstBad) {
      const [a, b, got] = firstBad;
      fail(
        `§30: in ${tz}, dayDiff("${a}", "${b}") is ${got}, expected 1. Consecutive calendar days are ` +
          `one day apart in every zone; if this fails on a DST date, dayDiff has stopped composing its ` +
          `dates with Date.UTC and is subtracting local milliseconds — see the header comment in ` +
          `src/utils/date.js.`,
      );
    }

    // A whole year, in one call, across every transition the zone has.
    const yearSpan = dayDiff(`${YEAR}-01-01`, `${YEAR + 1}-01-01`);
    if (yearSpan !== 365) {
      fail(`§30: in ${tz}, dayDiff("${YEAR}-01-01", "${YEAR + 1}-01-01") is ${yearSpan}, expected 365.`);
    }
  }

  restoreTZ();
  if (process.env.TZ !== ORIGINAL_TZ) fail("§30: failed to restore process.env.TZ");

  // The landmark cases, written out rather than derived — they record what the
  // function is *meant* to do, which a property loop does not say out loud.
  const CASES = [
    ["2026-08-20", "2026-08-20", 0, "same day"],
    ["2026-08-20", "2026-08-21", 1, "one day forward"],
    ["2026-08-21", "2026-08-20", -1, "one day back — the sign is part of the contract"],
    ["2026-01-31", "2026-02-01", 1, "month rollover"],
    ["2025-12-31", "2026-01-01", 1, "year rollover"],
    ["2028-02-28", "2028-03-01", 2, "a leap year: February has 29 days"],
    ["2026-02-28", "2026-03-01", 1, "a non-leap year: it does not"],
    ["2026-01-01", "2026-12-31", 364, "most of a year"],
    ["2020-01-01", "2026-08-20", 2423, "a multi-year span, leap days included"],
  ];
  for (const [a, b, want, label] of CASES) {
    const got = dayDiff(a, b);
    if (got !== want) fail(`§30: dayDiff("${a}", "${b}") is ${got}, expected ${want} (${label}).`);
  }

  // todayStr(), cross-checked against a different instrument. Intl derives the
  // date from the same clock by a different route, so agreement is evidence;
  // re-deriving it with getFullYear/getMonth/getDate would only restate the
  // implementation and would agree with an off-by-one version of it.
  for (const tz of ["America/New_York", "Pacific/Kiritimati", "Asia/Kolkata", "UTC"]) {
    process.env.TZ = tz;
    const got = todayStr();
    const want = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(got)) {
      fail(`§30: todayStr() returned "${got}" in ${tz}, which is not YYYY-MM-DD. Zero-padding is load-bearing — useMarketData's freshness() rejects any other shape, so every market figure would read as stale.`);
    } else if (got !== want) {
      fail(
        `§30: todayStr() is "${got}" in ${tz} but the same clock formats as "${want}" via Intl. ` +
          `The app's "today" is wrong by ${dayDiff(want, got)} day(s), which moves every streak and ` +
          `every Leitner due date.`,
      );
    }
    if (dayDiff(got, got) !== 0) fail(`§30: dayDiff(todayStr(), todayStr()) is not 0 in ${tz}.`);
  }
  restoreTZ();
  if (process.env.TZ !== ORIGINAL_TZ) fail("§30: failed to restore process.env.TZ after the todayStr cases");

  // Positive half, in §25's sense: the checks above test date.js, not the app's
  // use of it. §23 already requires the three *scripts* to import todayStr from
  // here; these are the three modules inside the app that must not roll their
  // own. If one stops needing a date, remove it from this list in the same
  // commit rather than keeping an unused import.
  for (const rel of ["src/lib/review.js", "src/lib/useAppState.js", "src/lib/useMarketData.js"]) {
    const src = readFileSync(join(ROOT, rel), "utf8");
    if (!/from\s*["']\.\.\/utils\/date\.js["']/.test(src)) {
      fail(
        `§30: ${rel} no longer imports from src/utils/date.js. The streak counter, the Leitner due ` +
          `dates and the market-staleness rule have to share one notion of "today" — that divergence ` +
          `is backlog item 38, and these checks cannot see a hand-rolled copy.`,
      );
    }
  }

  console.log(
    `  §30 src/utils/date.js: ${pairsChecked} consecutive-day pairs across ${ZONES.length} zones ` +
      `(${transitionsCovered} DST transitions covered), ${CASES.length} landmark cases, ` +
      `todayStr cross-checked against Intl in 4 zones.`,
  );
}

// 31. No source comment — and no line of DECISIONS.md — may attribute a lesson
//     id to the wrong track (backlog items 88 and 89).
//
//     WHY THIS EXISTS. The 2026-08-19 essentials split (5633b79) re-tracked
//     lessons 1-15 out of `money` **without renumbering them**. Every id-based
//     test stayed green — the ids were still correct — while the prose around
//     them quietly stopped being true, and `npm test` passed for a full day on
//     two glossary.js block headers that named the wrong track. That is the
//     signature of this class: a re-tracking is invisible to anything that
//     checks ids, and visible only to a reader who happens to know better.
//
//     Scope is deliberately narrow: comments in src/ and scripts/ that name a
//     track and a lesson id in the same breath — "essentials lessons 2/3/4",
//     which is live and correct, or a stale "money lesson 12".   track-ok: illustrative
//     That phrasing is specific enough to be a
//     real claim about the id and rare enough not to collide with ordinary
//     prose — §26's lesson is that a guard whose false positives are ordinary
//     English gets switched off within a week. It does NOT try to police every
//     stale track statement: "the money track — 28 of the 40 lessons" names no
//     id and is not matched. A range ("money lessons 1-28") is matched as a  track-ok: illustrative
//     range and compared against the track's real extent.
//
//     THE EXEMPTION, and why both directions are checked. A historical claim
//     is legitimate and common in this repo — "money lesson 5 until the split"  track-ok: illustrative
//     is *correct prose about the past*. Such a line may carry a
//     `track-ok: <reason>` marker on it or the line above. As with §26's
//     `path-ok` and §29's live/historical classification, the marker is
//     checked in both directions: a `track-ok:` on a reference that is
//     currently CORRECT fails too, because that means the exemption has
//     outlived its reason and is now hiding a live claim.
//
//     WHY DECISIONS.md IS IN SCOPE AND NO OTHER MARKDOWN IS (item 89, and the
//     numbers are measured, not estimated). Running this net over every `.md`
//     at the repo root plus `reviews/` finds **54 references, 39 of them
//     stale** — but **36 of those 39 are in AGENT_LOG.md and
//     AGENT_LOG.archive.md**, which are the run log: entries a past run wrote
//     on a date, which must never be edited and would each need a marker. The
//     guard would cost 36 annotations on immutable history to catch three real
//     defects, which is §26's failure mode exactly — a check whose false
//     positives are ordinary prose gets switched off within a week.
//     **DECISIONS.md alone is 5 references, 3 stale**, and it is the one
//     Markdown file here that is normative rather than narrative, so it is the
//     only one worth the net.
//
//     Its repair is NOT this check's usual "correct the track name", because
//     §29's design note governs there: DECISIONS.md states *dated* truth, so a
//     claim that was true on its date is repaired by **appending a new dated
//     Update and marking the old line `track-ok:`**, never by rewriting what a
//     run recorded. In Markdown the marker is written as an HTML comment,
//     `<!-- track-ok: <reason> -->`, so it is invisible in the rendered page;
//     the trailing `-->` is stripped before the reason is read.
{
  const walkSource = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return e.name === "node_modules" ? [] : walkSource(full);
      return e.isFile() && /\.(js|jsx|mjs)$/.test(e.name) ? [full] : [];
    });

  const trackOf = new Map(lessons.map((l) => [l.id, l.track]));
  const extent = {};
  for (const l of lessons) {
    const e = (extent[l.track] ??= { lo: l.id, hi: l.id });
    e.lo = Math.min(e.lo, l.id);
    e.hi = Math.max(e.hi, l.id);
  }
  const TRACK_NAMES = Object.keys(extent).join("|");

  // "<track> lesson 12", "<track> lessons 2/3/4/15", "<track> lessons 1-28".
  // The trailing group collects a `/`- or `,`-separated id list; RANGE catches
  // the dash form (hyphen or en/em dash) so it is compared as an extent.
  const REF = new RegExp(
    String.raw`\b(${TRACK_NAMES})[ -]lessons?\s+#?(\d+)\s*(?:([-–—])\s*(\d+))?((?:\s*[\/,]\s*\d+)*)`,
    "gi",
  );
  // The reason may end at an HTML comment close when the claim lives in
  // Markdown; `-->` is punctuation, never part of the reason.
  const MARKER = /track-ok:\s*(.*?)\s*(?:-->)?\s*$/;

  let refsChecked = 0;
  let exempted = 0;
  let mdRefs = 0;

  const DOC = join(ROOT, "DECISIONS.md");
  for (const file of [
    ...walkSource(join(ROOT, "src")),
    ...walkSource(join(ROOT, "scripts")),
    DOC,
  ]) {
    const rel = file.slice(ROOT.length + 1);
    const isDoc = file === DOC;
    const lines = readFileSync(file, "utf8").split("\n");

    lines.forEach((line, i) => {
      // In source, comment text only: a string literal naming a track and an id
      // is data, not a claim about the corpus, and this check has no business
      // in it. In DECISIONS.md every line is prose, so every line is a claim.
      let text;
      if (isDoc) {
        text = line;
      } else {
        const comment = line.match(/\/\/(.*)$|\*(.*)$/);
        if (!comment) return;
        text = comment[1] ?? comment[2] ?? "";
      }

      for (const m of text.matchAll(REF)) {
        const track = m[1].toLowerCase();
        // Same line only in Markdown. The line-above fallback exists because a
        // source comment wraps across lines that are all comment; a Markdown
        // prose line has no such convention, and an HTML comment can always sit
        // inline on the exact line. Allowing the fallback here leaked a real
        // exemption on this check's first run over DECISIONS.md: a marker
        // excusing one stale line silently excused a CORRECT reference that had
        // wrapped onto the next line of the same sentence — the marker hiding a
        // live claim, which is the very thing both directions exist to prevent.
        const marker = MARKER.exec(text) ?? (isDoc ? null : MARKER.exec(lines[i - 1] ?? ""));
        const reason = marker?.[1]?.trim();
        let wrong;
        let detail;

        if (m[3]) {
          // Range form: compare against the track's real extent.
          const [lo, hi] = [+m[2], +m[4]];
          const e = extent[track];
          wrong = lo !== e.lo || hi !== e.hi;
          detail = `"${m[0].trim()}" — \`${track}\` is ${e.lo}-${e.hi}`;
        } else {
          const ids = [
            +m[2],
            ...(m[5] || "").split(/[\/,]/).map((x) => +x.trim()).filter(Boolean),
          ];
          const bad = ids.filter((id) => (trackOf.get(id) ?? "no such lesson") !== track);
          wrong = bad.length > 0;
          detail =
            `"${m[0].trim()}" — ` +
            bad.map((id) => `lesson ${id} is \`${trackOf.get(id) ?? "not a lesson"}\``).join(", ");
        }

        refsChecked += 1;
        if (isDoc) mdRefs += 1;

        if (wrong && !reason) {
          fail(
            `§31: ${rel}:${i + 1}: ${detail}. Lesson ids do not move when a track is re-cut, so a ` +
              `${isDoc ? "sentence" : "comment"} naming both goes stale silently — that is backlog ` +
              `item ${isDoc ? "89" : "88"}. ` +
              (isDoc
                ? `DECISIONS.md states dated truth (§29's design note), so do NOT rewrite the line: ` +
                  `append a new dated Update to this entry saying what the re-tracking changed, and ` +
                  `mark this line \`<!-- track-ok: <reason> -->\`.`
                : `Correct the track name, or if the sentence is deliberately about the past, add ` +
                  `\`track-ok: <reason>\` on this line or the one above saying which change made ` +
                  `it historical.`),
          );
        } else if (wrong && reason) {
          exempted += 1;
        } else if (!wrong && reason) {
          fail(
            `§31: ${rel}:${i + 1}: \`track-ok\` on a reference that is CORRECT — ${m[0].trim()} ` +
              `matches the live tracks. The marker has outlived its reason ("${reason}") and is now ` +
              `hiding a live claim instead of excusing a historical one. Delete it.`,
          );
        }
      }
    });
  }

  // Floor, for the same reason §29 has one: DECISIONS.md's references are few
  // enough that a broken net reads as a clean pass rather than as a failure.
  // Five is what the file holds today: three marked historical (lessons 12,
  // 2/3/4/15 and 1, all re-tracked by the essentials split) and two live
  // (lesson 17 is still `money`, lesson 36 is still `economy`). Deleting a
  // reference is fine — lower this and say so in the same change — but
  // dropping to zero silently is what this catches.
  if (mdRefs < 4) {
    fail(
      `§31: only ${mdRefs} track/lesson reference(s) found in DECISIONS.md (expected at least 4). ` +
        `The pattern is more likely broken than the file emptied — a scan that matches nothing must ` +
        `not read as a pass. If references really were removed, lower this floor in the same change.`,
    );
  }

  console.log(
    `  §31 track/lesson attributions: ${refsChecked} reference(s) in src/ + scripts/ + DECISIONS.md ` +
      `(${mdRefs} of them in DECISIONS.md) checked against lessons.js, ${exempted} exempted as ` +
      `historical via \`track-ok:\`.`,
  );
}

// 32. No two headings in LAUNCH_PLAN.md may share a title (backlog item 62's
//     F6).
//
//     WHY THIS EXISTS. §3.1.1 and §3.4 were both called "Visual system" for
//     the whole life of the v2 plan, and they said opposite things about
//     per-lesson color: §3.1.1 "one accent color ... never as body text or a
//     fill", §3.4 "One accent colour per lesson/phase". The wording was the
//     visible half; the load-bearing half is that this document's section
//     numbers are cited from source (`src/theme.js`, `src/components/
//     LessonVisual.jsx`) and from the dev-agent's own blindspot rules (§10.1,
//     §10.2, §10.3), so a reference made by TITLE rather than by number had
//     two possible targets that contradicted each other. A reader resolving
//     "see the Visual system section" could land on either.
//
//     us-english:allow — that "colour" is a VERBATIM QUOTATION of the §3.4
//     line the plan has since deleted, and the "color" one line above is a
//     quotation of §3.1.1, which still exists and now reads "color". One
//     quotation of live text, one of dead text, opposite treatment: item 91
//     drew that line and §55 below is scoped so it can never reach here.
//
//     WHY LAUNCH_PLAN.md AND NO OTHER DOCUMENT, measured rather than assumed:
//     over the five normative Markdown files here (LAUNCH_PLAN, DECISIONS,
//     CLAIMS, README, LAUNCH_READINESS) the duplicate-title count today is
//     1 / 0 / 0 / 0 / 0, and the one is this defect. Guarding the other four
//     would protect a property nothing threatens, while LAUNCH_PLAN.md is the
//     only file whose §-numbers are load-bearing cross-references. AGENT_LOG.md
//     is deliberately out of scope for the reason §31 gives: run-log entries
//     repeat headings by design and must never be edited.
//
//     The comparison is on the TITLE with any leading section number stripped,
//     because "3.1.1 Visual system" and "3.4 Visual system" are the collision —
//     identical numbers are impossible and identical full heading lines would
//     miss the real case.
{
  const PLAN = join(ROOT, "LAUNCH_PLAN.md");
  const headings = readFileSync(PLAN, "utf8")
    .split("\n")
    .map((line, i) => ({ line, n: i + 1 }))
    .filter((h) => /^#{1,6}\s+\S/.test(h.line))
    .map((h) => ({
      ...h,
      title: h.line
        .replace(/^#{1,6}\s+/, "")
        .replace(/^[0-9]+(?:\.[0-9]+)*\.?\s*/, "")
        .trim()
        .toLowerCase(),
    }));

  const byTitle = new Map();
  for (const h of headings) {
    if (!byTitle.has(h.title)) byTitle.set(h.title, []);
    byTitle.get(h.title).push(h);
  }

  let duplicated = 0;
  for (const [title, hits] of byTitle) {
    if (hits.length < 2) continue;
    duplicated += 1;
    fail(
      `§32: LAUNCH_PLAN.md has ${hits.length} headings titled "${title}" (lines ` +
        `${hits.map((h) => h.n).join(", ")}). This document's §-numbers are cited from source and ` +
        `from the blindspot rules, so a reference by title must resolve to exactly one section. ` +
        `Retitle one of them — and if they say different things, decide which is current rather ` +
        `than leaving both. Do NOT renumber to fix this: other sections' numbers are referenced ` +
        `from working_files/build_doc.js and the run log.`,
    );
  }

  // Floor, for the same reason §29 and §31 have one: a heading regex that stops
  // matching would report "no duplicates" — indistinguishable from a clean pass.
  // The file holds 40 headings today; the floor is well under that so ordinary
  // editing does not trip it, and only a broken pattern can.
  if (headings.length < 20) {
    fail(
      `§32: only ${headings.length} heading(s) found in LAUNCH_PLAN.md (expected at least 20). ` +
        `The pattern is more likely broken than the document emptied — a scan that matches nothing ` +
        `must not read as a pass.`,
    );
  }

  console.log(
    `  §32 LAUNCH_PLAN.md headings: ${headings.length} heading(s), ${byTitle.size} distinct ` +
      `title(s), ${duplicated} duplicated.`,
  );
}

// 32b. A numbered heading in LAUNCH_PLAN.md must be nested as deeply as its
//      number says (backlog item 90).
//
//      WHY THIS EXISTS. §3.1.1 was a `###` — the same depth as §3.2, §3.4 and
//      §3.5 — so every renderer drew it as a SIBLING of §3.1 while its number
//      says it is a child of it. §2.5 was a `##`, drawing it as a peer of §2
//      itself rather than one of its subsections. Both are invisible in the raw
//      source, where the number is right there next to the wrong `#` count, and
//      both mislead anyone reading the rendered outline or a generated table of
//      contents — which is the form this document is usually skimmed in.
//
//      THE REPAIR IS ALWAYS THE `#` COUNT, NEVER THE NUMBER, and the failure
//      message says so, because the tempting fix is the destructive one:
//      §-numbers here are cited from source, from the dev-agent's blindspot
//      rules, and from thousands of run-log lines, so renumbering a section to
//      match its depth silently repoints every one of those references. §32's
//      message carries the same warning for the same reason.
//
//      Unnumbered headings are skipped rather than guessed at: the document
//      title and §10's `Closed`/`Open`/`Held` subheadings carry no number to
//      check a depth against, and inferring one from position would be a rule
//      about prose rather than about a stated number.
{
  const PLAN = join(ROOT, "LAUNCH_PLAN.md");
  let numbered = 0;
  let mismatched = 0;

  readFileSync(PLAN, "utf8")
    .split("\n")
    .forEach((line, i) => {
      const h = /^(#{1,6})\s+(\S.*)$/.exec(line);
      if (!h) return;
      const num = /^([0-9]+(?:\.[0-9]+)*)\.?\s/.exec(h[2]);
      if (!num) return;
      numbered += 1;

      // "2" -> depth 2 (## under the `#` title); "2.1" -> 3; "3.1.1" -> 4.
      const expected = num[1].split(".").length + 1;
      if (h[1].length === expected) return;
      mismatched += 1;
      fail(
        `§32b: LAUNCH_PLAN.md:${i + 1}: §${num[1]} is written as \`${h[1]}\` (depth ${h[1].length}) ` +
          `but its number implies \`${"#".repeat(expected)}\` (depth ${expected}), so it renders at ` +
          `the wrong level of the outline. Fix the \`#\` count — do NOT renumber the section to match ` +
          `the depth: §-numbers in this file are cited from source, from the blindspot rules and from ` +
          `the run log, and renumbering repoints all of them silently.`,
      );
    });

  // Floor, for the same reason §32 has one: a heading regex that stopped
  // matching would report no mismatches, which reads exactly like a pass.
  if (numbered < 20) {
    fail(
      `§32b: only ${numbered} numbered heading(s) found in LAUNCH_PLAN.md (expected at least 20). ` +
        `The pattern is more likely broken than the document emptied.`,
    );
  }

  console.log(
    `  §32b LAUNCH_PLAN.md heading depth: ${numbered} numbered heading(s), ` +
      `${numbered - mismatched} at the depth their number implies, ${mismatched} not.`,
  );
}

// ---------------------------------------------------------------------------
// §33. Translation completeness: the es/ko/zh/ja bodies must not fall further
// behind their English source than they already have.
//
// The gap this closes. Every other language check in this file asserts that a
// translated field is PRESENT (§1's `checkLangSet`) or that it mirrors
// English's structure (§16's cross-references). None of them can see a field
// that exists, is well-formed, is consistent with English — and carries a
// quarter of its content. That is the actual state of most of the catalog:
// economy lesson 40's Spanish carries three bare rule headings against four
// explanatory English paragraphs. `npm run translation-completeness` measures
// and lists it; AGENT_LOG.md item 93 tracks paying it down.
//
// Why a recorded baseline rather than a threshold. The debt accrued across
// seventeen "Deepen lesson N" runs, each of which grew English and left the
// four translations alone, and each of which left this suite green. A
// threshold cannot catch that (the lessons were already below any threshold
// worth setting); a per-pair record of where each lesson stood CAN, because
// growing English alone moves that pair's ratio down. The check fires in both
// directions on purpose — see the baseline file's own `note`.
{
  const baseline = loadCompletenessBaseline();
  if (!baseline) {
    fail(
      "§33: scripts/translation-completeness-baseline.json is missing. Regenerate it with " +
        "`npm run translation-completeness -- --write` — without it, nothing is watching whether " +
        "the translations are keeping up with the English.",
    );
  } else {
    for (const d of completenessDrift(lessonContent, baseline)) {
      if (d.kind === "fell") {
        fail(
          `§33: lesson ${d.id} [${d.lang}] carries ${d.now} of its English by character, down from a ` +
            `recorded ${d.was}. Either the English grew and the translation did not follow, or the ` +
            `translation lost content. Translate the new material, or — if the move is legitimate — ` +
            `re-record it with \`npm run translation-completeness -- --write\` and say why in the ` +
            `commit message.`,
        );
      } else if (d.kind === "rose") {
        fail(
          `§33: lesson ${d.id} [${d.lang}] is now at ${d.now}, up from a recorded ${d.was} — the ` +
            `translation gained content. That is the direction this project wants; re-record it with ` +
            `\`npm run translation-completeness -- --write\` so the debt is visibly paid down.`,
        );
      } else {
        fail(
          `§33: lesson ${d.id} [${d.lang}] is ${d.kind} (recorded ${d.was}, now ${d.now}). The lesson ` +
            `set and the baseline disagree; regenerate with ` +
            `\`npm run translation-completeness -- --write\`.`,
        );
      }
    }

    const { rows, reference, abridged } = completeness(lessonContent);

    // Floor, for the reason §32 and §32b have one: if `translatedChars` ever
    // stopped finding text, every ratio would read 0, nothing would be
    // classified against a p90 of 0, and "0 abridged" would print — which
    // looks exactly like the day this debt is finally paid off.
    const enTotal = rows.reduce((n, r) => n + r.chars.en, 0);
    if (rows.length < 20 || enTotal < 50_000) {
      fail(
        `§33: only ${rows.length} lesson(s) and ${enTotal} English character(s) measured (expected at ` +
          `least 20 and 50,000). The instrument is more likely broken than the catalog emptied.`,
      );
    }

    const perLang = COMPLETENESS_LANGS.map(
      (l) => `${l}=${abridged.filter((a) => a.lang === l).length}`,
    ).join(" ");
    const lessonsAbridged = new Set(abridged.map((a) => a.id)).size;
    console.log(
      `  §33 translation completeness: ${rows.length} lessons x 4 languages against ` +
        `${enTotal.toLocaleString()} English chars; abridged pairs ${perLang} ` +
        `(${lessonsAbridged} lessons in at least one language); reference p90 ratio ` +
        `${COMPLETENESS_LANGS.map((l) => `${l}=${reference[l].toFixed(2)}`).join(" ")}.`,
    );
    if (abridged.length > 0) {
      warn(
        `translation completeness — ${abridged.length} of ${rows.length * 4} lesson/language pairs ` +
          `carry a condensed summary rather than a translation of the English body ` +
          `(${lessonsAbridged} lessons affected). This is recorded debt, not a regression: see ` +
          `AGENT_LOG.md backlog item 93 and run 'npm run translation-completeness' for the list. ` +
          `Note the translation-review ledger can read 100% while this is true — it checks that a ` +
          `reviewer saw the text, not that the text is all there.`,
      );
    }
  }
}

// §34. Touch targets: every file that renders a raw interactive element must
// import the `MIN_TAP` floor from theme.js.
//
// WHAT THIS CATCHES, AND WHAT IT HONESTLY CANNOT. It cannot measure a rendered
// height — nothing in a static check can. What it catches is the failure mode
// that actually produced this defect: a screen written with hand-tuned padding
// by someone who did not know the rule existed. Measured 2026-08-23, before
// `MIN_TAP` existed, ELEVEN control classes rendered under 44 CSS px — the
// coach-mark dismiss at 20x20, the Sector period tabs at 19x31 (under even
// WCAG 2.5.8's 24px AA floor), the lesson term chips at 27 tall, and `Button`
// itself at 42. Exactly one file, `screens/Learn.jsx`, honored it, with a bare
// `44` literal that no other file could discover.
//
// So the invariant is deliberately weak but discoverable: touch the import and
// you will find the token's comment, which states the rule and why it is
// `minHeight` rather than `height`. A file can still import `MIN_TAP` and
// misuse it; that is what the live-browser sweep in the run log is for.
{
  const walkJsx = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walkJsx(full);
      return e.isFile() && e.name.endsWith(".jsx") ? [full] : [];
    });

  // A raw interactive element — one styled at the call site rather than through
  // ui.jsx's `Button`, which carries the floor for everything that uses it.
  const RAW_CONTROL = /<(button|select)\b/;
  const files = walkJsx(join(ROOT, "src"));
  let withControls = 0;
  const missing = [];

  for (const path of files) {
    const src = readFileSync(path, "utf8");
    if (!RAW_CONTROL.test(src)) continue;
    withControls += 1;
    if (!/\bMIN_TAP\b/.test(src)) missing.push(relative(ROOT, path));
  }

  for (const path of missing) {
    fail(
      `§34: ${path} renders a raw <button> or <select> but never references MIN_TAP. Every ` +
        `control a finger taps sets minHeight (and minWidth when the label is short) to that ` +
        `floor — see the token's comment in src/theme.js for why 44 and why it is a floor rather ` +
        `than a fixed height.`,
    );
  }

  // Floor, for the same reason §32 and §33 have one: if the regex above ever
  // stops matching, "0 files missing the token" and "the scan found nothing"
  // are the same green result.
  if (withControls < 8) {
    fail(
      `§34: only ${withControls} file(s) under src/ matched the raw-control regex (expected at ` +
        `least 8). The scan is not seeing the components it is supposed to police.`,
    );
  }

  const bareLiteral = [];
  for (const path of files) {
    const src = readFileSync(path, "utf8");
    if (/\b(?:minHeight|minWidth):\s*44\b/.test(src)) bareLiteral.push(relative(ROOT, path));
  }
  for (const path of bareLiteral) {
    fail(
      `§34: ${path} writes a bare 44 as a minHeight/minWidth. Use MIN_TAP from theme.js so the ` +
        `floor is greppable and has one definition.`,
    );
  }

  console.log(
    `  §34 touch targets: ${withControls} file(s) under src/ render a raw control, ` +
      `${withControls - missing.length} referencing MIN_TAP; ${bareLiteral.length} bare 44 ` +
      `literal(s). (Static check — rendered sizes are verified in a browser, not here.)`,
  );
}

// ---------------------------------------------------------------------------
// §35. Run-log heading depth: in AGENT_LOG.md and AGENT_LOG.archive.md every
//      dated entry heading must be `###`, and every heading inside an entry
//      must be `####`.
//
//      WHY THIS EXISTS. The convention has now been repaired twice by hand and
//      nothing was left behind to hold it. Item 90 fixed the same defect class
//      one document over (LAUNCH_PLAN.md, guarded by §32b); W-5.4 fixed it here
//      on 2026-08-24, demoting 37 dated entries that had been written as `##`
//      and the 276 subsections underneath them. At `##` a dated entry is a
//      SIBLING of `## Run log`, `## Prioritized backlog` and `## Environment
//      note` rather than a child of the run log, so the file's outline stops
//      meaning anything — and `check-backlog.mjs` finds the backlog section by
//      scanning forward to the next `^## `, so one `##` entry landing above the
//      Environment note would silently truncate that scan into a pass.
//      W-5.4's own closing note is what this section answers: "nothing stops a
//      future run from writing `## 2026-…` again."
//
//      THE SHAPE, NOT JUST THE LEVEL. W-5.4's premise check found two live
//      conventions — correctly-nested `## entry > ### children` and flat
//      `### entry > ### children` — so a rule that only pinned the entry line
//      would have converted 36 correctly-nested entries into flat ones. Both
//      halves are therefore asserted: the entry's own level AND its children's.
//
//      WHAT IS DELIBERATELY NOT CHECKED. Not titles: §32 explains why the logs
//      are out of scope for duplicate-title detection (entries repeat headings
//      by design), and this is a different property — depth, which has exactly
//      one correct answer. Not content: §31's rule that a run-log entry's
//      record must never be edited is untouched, because a `#` count is not a
//      claim. Blockquoted headings are skipped by the `^` anchor rather than by
//      a special case — the backlog's W-5 priority block writes its subsections
//      as `> ###` inside a blockquote, and those are prose, not outline. Fenced
//      lines are skipped explicitly: the log is full of pasted shell output and
//      a `#` comment inside a fence is not a heading.
{
  const LOGS = ["AGENT_LOG.md", "AGENT_LOG.archive.md"];
  // A dated heading is the entry marker; `## Archived <range>` and the other
  // top-level sections are boundaries that end an entry's span.
  const DATED = /^(#{1,6})\s+(20\d{2}-\d{2}-\d{2})/;
  let datedSeen = 0;
  let childrenSeen = 0;
  let wrongDepth = 0;

  for (const name of LOGS) {
    const lines = readFileSync(join(ROOT, name), "utf8").split("\n");
    let fence = null;
    let entry = null;

    lines.forEach((line, i) => {
      const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
      if (f) {
        if (fence === null) fence = f[1][0];
        else if (f[1][0] === fence) fence = null;
        return;
      }
      if (fence !== null) return;

      const h = /^(#{1,6})\s+(\S.*)$/.exec(line);
      if (!h) return;
      const depth = h[1].length;
      const dated = DATED.exec(line);

      if (dated) {
        datedSeen += 1;
        entry = { n: i + 1, title: h[2] };
        if (depth === 3) return;
        wrongDepth += 1;
        fail(
          `§35: ${name}:${i + 1}: the dated entry "${h[2].slice(0, 60)}" is written as ` +
            `\`${h[1]}\` (depth ${depth}) but every run-log entry is \`###\`, a child of ` +
            `\`## Run log\`. At \`##\` it becomes a sibling of the backlog and Environment ` +
            `sections, and check-backlog.mjs — which finds the backlog by scanning to the next ` +
            `\`^## \` — would silently truncate. Change the \`#\` count on this line and on the ` +
            `headings inside the entry (those are \`####\`); do not edit the entry's text.`,
        );
        return;
      }

      // A `##`-or-shallower heading is a document section, so it closes the
      // entry span rather than being counted as one of its children.
      if (depth <= 2) {
        entry = null;
        return;
      }
      if (!entry) return;
      childrenSeen += 1;
      if (depth === 4) return;
      wrongDepth += 1;
      fail(
        `§35: ${name}:${i + 1}: "${h[2].slice(0, 60)}" sits inside the run-log entry at ` +
          `${name}:${entry.n} but is written as \`${h[1]}\` (depth ${depth}); headings inside an ` +
          `entry are \`####\`. Any other depth breaks the entry's outline — at \`###\` it renders ` +
          `as a sibling of the entry rather than a section of it, which is the flat shape W-5.4 ` +
          `removed, and anything deeper nests under a \`####\` that may not exist.`,
      );
    });
  }

  // Floor, for the same reason §32 and §32b have one: if either regex stopped
  // matching, the loop would report no wrong depths — indistinguishable from a
  // clean pass. 239 entries and 282 children exist today across the two files;
  // the floors sit far below that, so ordinary appending never trips them and
  // only a broken pattern can. They are also a guard on the archive itself:
  // moving entries across must not make either file unreadable to this scan.
  if (datedSeen < 100) {
    fail(
      `§35: only ${datedSeen} dated run-log entr(ies) found across ${LOGS.join(" + ")} ` +
        `(expected at least 100). The pattern is more likely broken than the log emptied — a scan ` +
        `that matches nothing must not read as a pass.`,
    );
  }
  if (childrenSeen < 100) {
    fail(
      `§35: only ${childrenSeen} heading(s) found inside run-log entries (expected at least 100). ` +
        `Same reason as the entry floor: a child scan that matches nothing reads exactly like a pass.`,
    );
  }

  console.log(
    `  §35 run-log heading depth: ${datedSeen} dated entr(ies) and ${childrenSeen} heading(s) ` +
      `inside them across ${LOGS.length} log file(s), ${wrongDepth} at the wrong depth.`,
  );
}

// ---------------------------------------------------------------------------
// §36. `<html lang>` follows the language picker.
//
// WHY THIS EXISTS. A screen reader picks its voice, and a browser its font
// stack, from the document's language. `index.html` ships a hardcoded
// `lang="en"`, so the four non-English locales are announced in English unless
// something rewrites the attribute after mount — which `useAppState` does, in
// a four-line effect, added 2026-08-24. Nothing asserted it (measured the same
// day this section was written: `documentElement.lang` and `HTML_LANG` had
// exactly two hits in the whole repo, both inside the hook itself), and the
// symptom is inaudible to a sighted reviewer, so a refactor that drops the
// effect regresses silently and indefinitely.
//
// WHAT IS CHECKED, AND WHY EACH PART. The coverage half is exact rather than
// textual because `HTML_LANG` is imported: adding a sixth language to `TR`
// without a tag for it is the drift this catches, and the hook's `?? lang`
// fallback is what makes that drift silent instead of loud. The source half
// has to be a scan — a React effect cannot be run here — so it asserts the two
// things a refactor would break: that some file under src/ still assigns
// `documentElement.lang`, and that whatever file does reads the tag from
// `HTML_LANG` rather than hardcoding one.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not the rendered attribute — that needs a
// browser, and the run log carries the live five-language sweep. Not the
// effect's dependency array: matching `}, [lang]);` textually would break on
// reformatting while catching nothing a reader would ever get wrong.
{
  const trKeys = Object.keys(TR).sort();
  const tagKeys = Object.keys(HTML_LANG).sort();

  for (const key of trKeys) {
    if (!Object.prototype.hasOwnProperty.call(HTML_LANG, key)) {
      fail(
        `§36: locale \`${key}\` exists in TR but has no HTML_LANG entry, so <html lang> would fall ` +
          `back to the bare code. Add a BCP-47 tag for it in src/lib/useAppState.js — see zh's ` +
          `comment there for when a bare code is not good enough.`,
      );
    }
  }
  for (const key of tagKeys) {
    if (!Object.prototype.hasOwnProperty.call(TR, key)) {
      fail(
        `§36: HTML_LANG carries \`${key}\`, which is not a language in TR. The map is meant to be ` +
          `one tag per shipped locale, no more.`,
      );
    }
  }

  // A tag has to be well-formed, and its primary subtag has to be the locale it
  // is filed under — that is the half that catches a transposed entry, which a
  // shape-only regex would wave through.
  const TAG = /^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-(?:[A-Z]{2}|\d{3}))?$/;
  for (const [key, tag] of Object.entries(HTML_LANG)) {
    if (!TAG.test(tag)) {
      fail(
        `§36: HTML_LANG.${key} is \`${tag}\`, which is not a well-formed BCP-47 tag ` +
          `(language, optional Script in Titlecase, optional REGION).`,
      );
    } else if (tag.split("-")[0] !== key) {
      fail(
        `§36: HTML_LANG.${key} is \`${tag}\`, whose primary subtag is \`${tag.split("-")[0]}\`. ` +
          `A locale must be tagged as itself; this announces ${key} content as ${tag.split("-")[0]}.`,
      );
    }
  }

  // index.html's value is the pre-mount one, correct only until the effect
  // runs. It still has to be a tag this app actually ships.
  const indexHtml = readFileSync(join(ROOT, "index.html"), "utf8");
  const initial = indexHtml.match(/<html\b[^>]*\blang="([^"]*)"/);
  if (!initial) {
    fail(
      `§36: index.html's <html> element has no lang attribute. It is the language of the document ` +
        `until React mounts, and assistive tech reads it in that window.`,
    );
  } else if (!Object.values(HTML_LANG).includes(initial[1])) {
    fail(
      `§36: index.html ships <html lang="${initial[1]}">, which is not one of the tags in ` +
        `HTML_LANG (${Object.values(HTML_LANG).join(", ")}).`,
    );
  }

  // The source half.
  const walkSrc = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walkSrc(full);
      return e.isFile() && /\.(js|jsx)$/.test(e.name) ? [full] : [];
    });
  const sources = walkSrc(join(ROOT, "src"));

  // Deliberately not `documentElement.lang =`: the theme effect two lines above
  // this one in useAppState.js already writes through a `const root =
  // document.documentElement` alias, so the narrow form would miss the obvious
  // refactor. Any `.lang =` assignment in a file that reaches for
  // `documentElement` is the site.
  //
  // The match is per LINE, not per file, and that distinction is load-bearing:
  // an earlier draft of this section asked only whether the file mentioned
  // `HTML_LANG` anywhere, which the *declaration* satisfies — so rewriting the
  // effect to `root.lang = lang` passed it. Proven by injection, not reasoned
  // about. A multi-line assignment will trip this; that is the safe direction.
  const assigns = [];
  for (const path of sources) {
    const src = readFileSync(path, "utf8");
    if (!/\bdocumentElement\b/.test(src)) continue;
    const lines = src.split("\n").filter((l) => /\.lang\s*=[^=]/.test(l));
    if (lines.length) assigns.push({ path: relative(ROOT, path), lines });
  }

  if (assigns.length === 0) {
    fail(
      `§36: nothing under src/ assigns documentElement.lang. index.html's hardcoded lang="en" is ` +
        `then the document's language forever, and the four non-English locales are announced in ` +
        `English. Restore the effect in src/lib/useAppState.js.`,
    );
  }
  for (const { path, lines } of assigns) {
    for (const line of lines) {
      if (!/\bHTML_LANG\b/.test(line)) {
        fail(
          `§36: ${path} assigns a lang attribute without reading HTML_LANG on the same line: ` +
            `\`${line.trim()}\`. The tag has one definition so zh stays zh-Hans — assigning the ` +
            `raw locale key instead re-introduces the bare \`zh\` this map exists to avoid.`,
        );
      }
    }
  }

  // Floor, for the same reason §32/§33/§34/§35 have one: if the walk or the
  // regex above ever stops matching, "nothing hardcodes a tag" and "the scan
  // saw no files at all" are the same green result.
  if (sources.length < 20) {
    fail(
      `§36: the src/ walk found only ${sources.length} module(s) (expected at least 20). The scan ` +
        `is not seeing the code it is supposed to police.`,
    );
  }

  console.log(
    `  §36 <html lang>: ${tagKeys.length} tag(s) for ${trKeys.length} locale(s), ` +
      `${assigns.reduce((n, a) => n + a.lines.length, 0)} assignment line(s) across ${sources.length} module(s) under src/, ` +
      `index.html starting at \`${initial ? initial[1] : "—"}\`. ` +
      `(Static check — the rendered attribute is verified in a browser, not here.)`,
  );
}

// §37. Every screen renders inside an error boundary, and every content
// loader carries a `.catch`.
//
// WHY THIS EXISTS. Item 96 gave the three `lazy()` screens a boundary; item 99
// found `Learn` outside one, because it is a *static* import and so was never
// part of "the lazy screens". Measured live 2026-08-24: a render throw inside
// `Learn` left `#root` at 0 children and 0 bytes — a blank page, the same
// signature a rejected chunk produced before item 96. Nothing static asserted
// either half, so the next screen added to `App.jsx` regresses it silently and
// the symptom only ever appears on a user's device.
//
// WHAT IS CHECKED, AND WHY EACH PART. Three invariants, all textual, because a
// React tree cannot be rendered here:
//   (a) every component `App.jsx` imports from `./screens/` is used ONLY
//       inside a boundary region — `AsyncScreen` for the lazy ones (which also
//       need the Suspense half) or `ScreenBoundary` for any screen. This is
//       the one that catches a new screen dropped into `<main>` bare.
//   (b) `main.jsx` renders `<App` inside an `ErrorBoundary`. `ScreenBoundary`
//       is rendered BY App, so it cannot catch App's own render — a throw in
//       the header, the nav, the first-run modal or `useAppState` needs an
//       ancestor that App did not create.
//   (c) every loader-table invocation under `src/screens/` ends in a `.catch`.
//
// PREMISE CORRECTION, and it changed the check. Item 99 filed (c) as "every
// `import(` call site under src/screens/ carries a `.catch`". Measured before
// writing this: there are 25 `import(` lines under `src/screens/` and **none**
// of them carries a `.catch`, nor should they — they are `() => import(...)`
// thunks sitting in a loader table, and the `.catch` belongs to whoever calls
// the thunk. Written as filed, this section would have failed a correct tree.
// The unit is therefore the INVOCATION (`SOME_LOADERS[key]()`), of which there
// are three, and the assertion runs over the whole statement rather than the
// one line, since the chain is always multi-line.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not that a boundary's fallback is the
// *right* copy — that residual was this section's, it was closed by item 100
// on 2026-08-24, and §39 owns it now: `AsyncScreen` picks the download copy
// only for a tagged chunk failure and the render-crash copy otherwise. This
// section still asserts only that a boundary EXISTS. Not the rendered result:
// the live proof is in the run log.
{
  const appSrc = readFileSync(join(ROOT, "src/App.jsx"), "utf8");

  // Boundary regions, by tag. Neither tag nests inside itself, so a sequential
  // pairing is exact; an unbalanced count means the scan can no longer be
  // trusted and is reported rather than silently producing short regions.
  const regionsFor = (tag) => {
    const opens = [...appSrc.matchAll(new RegExp(`<${tag}[\\s>]`, "g"))].map((m) => m.index);
    const closes = [...appSrc.matchAll(new RegExp(`</${tag}>`, "g"))].map((m) => m.index);
    if (opens.length !== closes.length) {
      fail(
        `§37: <${tag}> opens ${opens.length} time(s) and closes ${closes.length} time(s) in ` +
          `src/App.jsx. Self-closing or unbalanced boundary tags break this scan, so the result ` +
          `below cannot be trusted — fix the markup rather than this check.`,
      );
      return [];
    }
    return opens.map((start, i) => [start, closes[i]]);
  };

  const asyncRegions = regionsFor("AsyncScreen");
  const screenRegions = regionsFor("ScreenBoundary");
  const anyRegions = [...asyncRegions, ...screenRegions];
  const inside = (index, regions) => regions.some(([a, b]) => index > a && index < b);

  // Screens, by how they are imported. `lazy()` screens carry the extra
  // requirement of the Suspense half; static ones only need a boundary.
  const lazyScreens = [...appSrc.matchAll(/const\s+(\w+)\s*=\s*lazy\(/g)].map((m) => m[1]);
  const staticScreens = [...appSrc.matchAll(/^import\s+(\w+)\s+from\s+"\.\/screens\//gm)].map((m) => m[1]);
  const allScreens = [...lazyScreens, ...staticScreens];

  for (const name of allScreens) {
    const uses = [...appSrc.matchAll(new RegExp(`<${name}[\\s/>]`, "g"))].map((m) => m.index);
    if (uses.length === 0) {
      fail(
        `§37: \`${name}\` is imported as a screen in src/App.jsx but never rendered there. Either ` +
          `it is dead, or this scan's JSX matcher has stopped seeing usages — both need a look.`,
      );
      continue;
    }
    const required = lazyScreens.includes(name) ? asyncRegions : anyRegions;
    const label = lazyScreens.includes(name) ? "<AsyncScreen>" : "a boundary (<AsyncScreen> or <ScreenBoundary>)";
    for (const at of uses) {
      if (!inside(at, required)) {
        const line = appSrc.slice(0, at).split("\n").length;
        fail(
          `§37: src/App.jsx:${line} renders <${name}> outside ${label}. A throw inside it — a ` +
            `render bug, or for a lazy screen a chunk that 404s after a redeploy — unmounts the ` +
            `whole tree and leaves a blank page with no message (items 96, 99).`,
        );
      }
    }
  }

  // (b) The outermost boundary, which App cannot provide for itself.
  const mainSrc = readFileSync(join(ROOT, "src/main.jsx"), "utf8");
  const rootOpen = mainSrc.indexOf("<ErrorBoundary");
  const rootClose = mainSrc.indexOf("</ErrorBoundary>");
  const appUse = mainSrc.search(/<App[\s/>]/);
  if (appUse === -1) {
    fail(`§37: src/main.jsx does not render <App />. This scan is pointed at the wrong file.`);
  } else if (rootOpen === -1 || rootClose === -1 || !(appUse > rootOpen && appUse < rootClose)) {
    fail(
      `§37: src/main.jsx renders <App /> outside an ErrorBoundary. ScreenBoundary inside App ` +
        `cannot catch App's own render, so a throw in the header, the bottom nav, the first-run ` +
        `modal or useAppState goes back to being a blank page (item 99).`,
    );
  }

  // (c) Loader-table invocations. See the premise correction above for why the
  // unit is the invocation and not the `import(` line.
  const screensDir = join(ROOT, "src/screens");
  const screenFiles = readdirSync(screensDir, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.jsx?$/.test(e.name))
    .map((e) => join(screensDir, e.name));

  let invocations = 0;
  for (const path of screenFiles) {
    const src = readFileSync(path, "utf8");
    for (const m of src.matchAll(/\b[A-Z][A-Z0-9_]*_LOADERS\s*\[/g)) {
      // Walk to the end of the statement, tracking nesting, so the whole
      // promise chain is examined rather than the invocation's own line.
      let depth = 0;
      let end = m.index;
      for (; end < src.length; end++) {
        const c = src[end];
        if (c === "(" || c === "[" || c === "{") depth++;
        else if (c === ")" || c === "]" || c === "}") depth--;
        else if (c === ";" && depth <= 0) break;
      }
      const statement = src.slice(m.index, end);
      // The table's own declaration has no `(` after the key, so it is not a
      // call and is not this check's business.
      if (!/\]\s*\(/.test(statement.slice(0, statement.indexOf("\n") + 1) || statement)) continue;
      invocations++;
      if (!/\.catch\s*\(/.test(statement)) {
        const line = src.slice(0, m.index).split("\n").length;
        fail(
          `§37: ${relative(ROOT, path)}:${line} calls a content loader with no \`.catch\` in the ` +
            `chain. A rejected content chunk then leaves the promise unhandled and the screen ` +
            `waiting forever — item 96 measured that as a lesson with no body and a working Mark ` +
            `Complete button, at a 77% content loss.`,
        );
      }
    }
  }

  // Floors, for the reason §32/§33/§34/§35/§36 have them: a scan that matches
  // nothing and a codebase with nothing wrong are the same green result.
  if (allScreens.length < 4) {
    fail(
      `§37: found only ${allScreens.length} screen import(s) in src/App.jsx (expected at least 4). ` +
        `The import matcher is not seeing the code it is supposed to police.`,
    );
  }
  if (anyRegions.length < 4) {
    fail(
      `§37: found only ${anyRegions.length} boundary region(s) in src/App.jsx (expected at least 4).`,
    );
  }
  if (invocations < 3) {
    fail(
      `§37: found only ${invocations} content-loader invocation(s) under src/screens/ (expected at ` +
        `least 3). The loader tables were renamed, or this scan has gone blind.`,
    );
  }

  console.log(
    `  §37 screen boundaries: ${allScreens.length} screen(s) in App.jsx ` +
      `(${lazyScreens.length} lazy / ${staticScreens.length} static) inside ${anyRegions.length} ` +
      `boundary region(s), root boundary in main.jsx, ${invocations} loader invocation(s) ` +
      `across ${screenFiles.length} screen file(s) all carrying .catch. ` +
      `(Static check — the live blank-page proof is in the run log.)`,
  );
}

// §38. index.html carries link-preview metadata, and the app's name has one
// definition.
//
// WHY THIS EXISTS. Routing is hash-based (`lib/deepLink.js`), so `#/lesson/29`
// is never sent to a server and every shareable lesson URL is *this one*
// document to a crawler or a link unfurler. That makes index.html's <head> the
// entire preview surface for the whole product — §5's web funnel rests on about
// a dozen lines that nothing imports, nothing renders, and no test touched
// before this section. Measured 2026-08-24 (backlog item 98) on the file as it
// then stood: `charset`, `viewport` and `<title>` and nothing else — no
// description, no og:*, no twitter:*, no icon, no theme-color.
//
// THE HALF THAT IS ACTUALLY SUBTLE. Neither a crawler nor an unfurler runs the
// app's JS, so the static <title> is the only name they see, while a reader in
// the app sees the one `useAppState` writes from `appTitle`/`appSub`. Those are
// two independent strings for one name, and drift between them is invisible in
// both directions: renaming the app in the locales leaves the shared preview
// saying the old name, and editing index.html leaves the tab saying it. This
// section pins them to each other rather than to a literal, so there is still
// exactly one place to make the change.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not `og:url` or `og:image`: both are
// specified as absolute URLs and this app has no origin until owner action O-1
// lands, and `base: "./"` (vite.config.js) means nothing here may hardcode a
// path. Requiring them would force a guessed domain into the file. Not the
// rendered preview — that needs a live unfurler against a real URL, which is
// O-1 again. Not the description's prose: check-blindspot.mjs owns §10.1 and
// now scans this file for it (added the same day, for the same reason README
// was added to §10.2 — a rule only covers the files it reads).
{
  const html = readFileSync(join(ROOT, "index.html"), "utf8");

  // Attribute order is not fixed by anything, so match on the tag and read the
  // pair out of it rather than assuming `name` precedes `content`.
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const metaValue = (key) => {
    for (const tag of metas) {
      const k = tag.match(/\b(?:name|property)="([^"]*)"/i);
      if (!k || k[1].toLowerCase() !== key.toLowerCase()) continue;
      const v = tag.match(/\bcontent="([^"]*)"/i);
      if (v) return v[1];
    }
    return null;
  };

  const REQUIRED = [
    ["description", "the body of every unfurled link and search result"],
    ["og:type", "without it an unfurler may not treat the page as a page at all"],
    ["og:site_name", "the product's name, shown above the title in most clients"],
    ["og:title", "the headline of the preview card"],
    ["og:description", "the body of the preview card"],
    ["og:locale", "the language the preview copy is written in"],
    ["twitter:card", "chooses the card shape; without it the link stays bare"],
    ["twitter:title", "not every client falls back to og:*"],
    ["twitter:description", "not every client falls back to og:*"],
  ];
  let presentRequired = 0;
  for (const [key, why] of REQUIRED) {
    const value = metaValue(key);
    if (value !== null && value.trim()) presentRequired++;
    if (value === null) {
      fail(
        `§38: index.html has no <meta> for \`${key}\` — ${why}. Hash routing makes this document ` +
          `the preview for every lesson URL in the app, so a gap here is a gap for all of them.`,
      );
    } else if (!value.trim()) {
      fail(`§38: index.html's \`${key}\` is empty, which unfurls the same as absent.`);
    }
  }

  // An icon, and it has to be one this repo actually ships — a <link> pointing
  // at a file that was deleted is worse than none, because it looks handled.
  const iconHref = (html.match(/<link\b[^>]*\brel="icon"[^>]*>/i) ?? [""])[0].match(/\bhref="([^"]*)"/i);
  if (!iconHref) {
    fail(`§38: index.html declares no <link rel="icon">, so the tab and every bookmark fall back to a blank page glyph.`);
  } else {
    const rel = iconHref[1].replace(/^\.?\//, "");
    const iconPath = join(ROOT, "public", rel);
    if (!existsSync(iconPath)) {
      fail(
        `§38: index.html's icon href is \`${iconHref[1]}\` but public/${rel} does not exist, so the ` +
          `built site links an icon it does not serve.`,
      );
    } else if (rel.endsWith(".svg")) {
      // Existence is not enough, and this is not a hypothetical: the first
      // version of public/icon.svg shipped a CSS custom-property name inside
      // an XML comment, which is a `--` inside `<!-- -->` and therefore a
      // parse error. It served with HTTP 200 and the right content type, and
      // rendered as a browser XML error page — so the network-level check that
      // a run would naturally reach for said "fine". An icon has no console
      // error and no layout to disturb, so nothing else would ever report it.
      const svg = readFileSync(iconPath, "utf8");
      const body = svg.replace(/<!--[\s\S]*?-->/g, "");
      const problems = [];
      for (const c of svg.matchAll(/<!--([\s\S]*?)-->/g)) {
        if (c[1].includes("--")) problems.push(`a comment contains "--", which ends it early and makes the file unparseable`);
      }
      const opens = (svg.match(/<!--/g) ?? []).length;
      const closes = (svg.match(/-->/g) ?? []).length;
      if (opens !== closes) problems.push(`${opens} "<!--" against ${closes} "-->" — an unterminated comment`);
      if (!/^\s*<svg\b/.test(body)) problems.push(`the document does not start with an <svg> element`);
      if (!/\bxmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(body)) problems.push(`no xmlns — a standalone SVG document needs it`);
      const tags = [...body.matchAll(/<(\/?)([a-zA-Z][\w:-]*)[^>]*?(\/?)>/g)];
      const stack = [];
      for (const [, close, name, selfClose] of tags) {
        if (close) {
          if (stack.pop() !== name) { problems.push(`</${name}> does not close the element it follows`); break; }
        } else if (!selfClose) stack.push(name);
      }
      if (stack.length) problems.push(`${stack.length} unclosed element(s): ${stack.join(", ")}`);
      for (const problem of problems) {
        fail(
          `§38: public/${rel} is not well-formed XML — ${problem}. A malformed SVG still serves with ` +
            `HTTP 200 and the right content type, and renders as nothing.`,
        );
      }
    }
  }

  // theme-color is per-palette here because the app follows the system scheme
  // by default; one unqualified tag would paint the wrong chrome in one of them.
  const themeColors = metas.filter((t) => /\bname="theme-color"/i.test(t));
  if (themeColors.length < 2) {
    fail(
      `§38: index.html has ${themeColors.length} <meta name="theme-color"> tag(s); expected one per ` +
        `palette, each with a prefers-color-scheme media attribute. The app ships light and dark.`,
    );
  }
  for (const tag of themeColors) {
    if (!/\bmedia="\(prefers-color-scheme:\s*(?:light|dark)\)"/i.test(tag)) {
      fail(`§38: a theme-color tag carries no prefers-color-scheme media query: \`${tag}\`.`);
    }
  }

  // The one-name rule. `en` is the reference because it is the language the
  // static <head> is written in (og:locale says so, and is checked against it).
  const expectedTitle = `${TR.en.appTitle} — ${TR.en.appSub}`;
  const staticTitle = (html.match(/<title>([\s\S]*?)<\/title>/i) ?? [])[1];
  if (staticTitle === undefined) {
    fail(`§38: index.html has no <title>. It is the name every unfurler and every crawler reads.`);
  } else if (staticTitle.trim() !== expectedTitle) {
    fail(
      `§38: index.html's <title> is \`${staticTitle.trim()}\` but en's appTitle/appSub compose to ` +
        `\`${expectedTitle}\`. These are the shared-link name and the in-app name for one product; ` +
        `change them together, in src/locales/en.js and index.html.`,
    );
  }
  for (const key of ["og:title", "twitter:title"]) {
    const value = metaValue(key);
    if (value !== null && value !== expectedTitle) {
      fail(`§38: index.html's \`${key}\` is \`${value}\`, which is not the app's name (\`${expectedTitle}\`).`);
    }
  }
  // Same rule for the description, which is written three times because the
  // three consumers do not reliably fall back to one another. Three copies of
  // one sentence is a drift surface, and the drift is invisible: each client
  // reads only its own tag, so an edit to one of them changes the preview in
  // some apps and not others, with nothing anywhere reporting a difference.
  const descriptions = ["description", "og:description", "twitter:description"]
    .map((key) => [key, metaValue(key)])
    .filter(([, value]) => value !== null);
  const distinct = [...new Set(descriptions.map(([, value]) => value))];
  if (distinct.length > 1) {
    fail(
      `§38: index.html's description tags disagree — ` +
        descriptions.map(([key, value]) => `${key}: "${value.slice(0, 40)}…"`).join(" / ") +
        `. They are one sentence for one product; each client reads only its own, so a drift here ` +
        `shows a different preview in different apps and nothing reports it.`,
    );
  }

  const ogLocale = metaValue("og:locale");
  if (ogLocale !== null && ogLocale.split(/[-_]/)[0] !== "en") {
    fail(
      `§38: index.html declares og:locale \`${ogLocale}\` while its title and description are en. ` +
        `The static head is English on purpose — an unfurler never runs the language picker.`,
    );
  }

  // The source half: something under src/ still has to rewrite the title after
  // mount, or four of the five languages get an English tab for the session.
  // Matched per LINE and required to read a locale key, per §36's injection
  // lesson — a file merely *mentioning* `TR` satisfies far too much.
  const walkModules = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walkModules(full);
      return e.isFile() && /\.(js|jsx)$/.test(e.name) ? [full] : [];
    });
  const srcModules = walkModules(join(ROOT, "src"));
  const titleAssigns = [];
  for (const path of srcModules) {
    const src = readFileSync(path, "utf8");
    for (const line of src.split("\n")) {
      if (/\bdocument\.title\s*=[^=]/.test(line)) titleAssigns.push({ path: relative(ROOT, path), line });
    }
  }
  if (titleAssigns.length === 0) {
    fail(
      `§38: nothing under src/ assigns document.title, so index.html's English title is the tab for ` +
        `all five languages. Restore the assignment in src/lib/useAppState.js's lang effect.`,
    );
  }
  for (const { path, line } of titleAssigns) {
    if (!/\bappTitle\b/.test(line) || !/\bappSub\b/.test(line)) {
      fail(
        `§38: ${path} sets document.title without composing it from appTitle and appSub: ` +
          `\`${line.trim()}\`. A literal here is a second definition of the app's name and drifts ` +
          `from index.html silently.`,
      );
    }
  }

  // Floors, for the reason §32/§33/§34/§35/§36/§37 have them.
  if (srcModules.length < 20) {
    fail(
      `§38: the src/ walk found only ${srcModules.length} module(s) (expected at least 20), so ` +
        `"nothing sets document.title" and "the scan saw no files" report the same green result.`,
    );
  }
  if (metas.length < 8) {
    fail(
      `§38: found only ${metas.length} <meta> tag(s) in index.html (expected at least 8). The tag ` +
        `matcher is not seeing the head it is supposed to police.`,
    );
  }

  console.log(
    `  §38 link preview: ${presentRequired}/${REQUIRED.length} required <meta> present, ${metas.length} <meta> total in index.html, ` +
      `${themeColors.length} theme-color(s), ${descriptions.length} description tag(s) in agreement, icon ${iconHref ? iconHref[1] : "—"}, ` +
      `title pinned to en appTitle/appSub, ${titleAssigns.length} runtime title assignment(s) under src/. ` +
      `(Static check — a rendered unfurl needs a public URL, which is owner action O-1.)`,
  );
}

// §39. A chunk that never arrived and a chunk that arrived and threw get
// different copy, and they are told apart by a tag rather than by a string.
//
// WHY THIS EXISTS. §37 shipped with this exact gap named in its own "what is
// deliberately not checked": `AsyncScreen` had one fallback, `LoadFailure`, so
// a render bug inside a lazy screen told the reader "This content couldn't be
// downloaded. Check your connection." Reproduced live 2026-08-24 with a throw
// injected into `Practice`: the probe executed — so the chunk had plainly
// downloaded — and the connection message appeared anyway.
//
// WHAT IS CHECKED, AND WHY EACH PART.
//   (a) BEHAVIORAL. `chunkError.js` is pure JS, so the predicate can be run
//       here instead of being read. The load-bearing case is a `TypeError`
//       carrying the browser's real "Failed to fetch dynamically imported
//       module" text: it must NOT be recognized, because recognizing it would
//       mean someone had reintroduced message matching, which is the method
//       this item rejected. A textual check alone cannot see that.
//   (b) every `lazy()` in App.jsx routes its loader through `chunk()`. An
//       untagged screen degrades to the render-crash copy — safe, but wrong
//       for the redeploy-404 case item 96 built `LoadFailure` for, and silent.
//   (c) `AsyncScreen` still chooses between the two. A fallback that names
//       only one of them is the original defect returning.
//   (d) `ErrorBoundary` still hands the caught error to a function fallback.
//       Reverting it to a bare node is a one-line change that makes (c) a
//       no-op while leaving every string in place.
//   (e) the two bodies stay distinct in all five languages. If a translation
//       ever copies one into the other, the discrimination still runs and
//       still shows the wrong sentence.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not the rendered result — the two-sided
// live proof (render throw → "Something went wrong", 404'd chunk → "Didn't
// load", clean control → neither) is in the run log for 2026-08-24. Not
// whether a non-English body *means* the right thing; that needs a reader,
// not a script, and item 94 already tracks the review share.
{
  const { ChunkLoadError, chunk, isChunkLoadError } = await import("../src/lib/chunkError.js");

  // (a) Behavioral.
  const tagged = await chunk(() => Promise.reject(new TypeError("Failed to fetch dynamically imported module: /assets/Practice-abc123.js")))()
    .then(() => null, (e) => e);
  const tagRecognised = isChunkLoadError(tagged);
  if (!tagRecognised) {
    fail(`§39: chunk() did not tag a rejected loader — isChunkLoadError() returned false for what it produced.`);
  }
  if (!(tagged instanceof ChunkLoadError) || tagged?.cause === undefined) {
    fail(
      `§39: chunk()'s error drops its \`cause\`. The underlying failure is what a bug report needs; ` +
        `the tag is meant to add a fact, not replace one.`,
    );
  }
  const passthrough = await chunk(() => Promise.resolve({ default: "screen" }))();
  if (passthrough?.default !== "screen") {
    fail(`§39: chunk() altered a RESOLVED module. It must be transparent on the success path.`);
  }
  const mustNotMatch = [
    ["a plain Error", new Error("boom")],
    ["the browser's own module-fetch TypeError", new TypeError("Failed to fetch dynamically imported module: /assets/Practice-abc123.js")],
    ["an Error whose message names a chunk", new Error("ChunkLoadError: Loading chunk 3 failed.")],
    ["a thrown string", "Failed to fetch dynamically imported module"],
    ["null", null],
    ["undefined", undefined],
  ];
  let falsePositives = 0;
  for (const [label, value] of mustNotMatch) {
    if (isChunkLoadError(value)) {
      falsePositives += 1;
      fail(
        `§39: isChunkLoadError() returned true for ${label}. Only chunk()'s own tag may match — a ` +
          `predicate that reads error text is the brittle method this check exists to forbid.`,
      );
    }
  }

  const chunkSrc = readFileSync(join(ROOT, "src/lib/chunkError.js"), "utf8");
  const messageReads = chunkSrc
    .split("\n")
    .filter((l) => !l.trim().startsWith("//"))
    .filter((l) => /\.message\b|\.test\(|\.includes\(|\.match\(/.test(l));
  for (const line of messageReads) {
    fail(
      `§39: src/lib/chunkError.js inspects error text — \`${line.trim()}\`. Those strings belong to ` +
        `the browser and the bundler and change without notice; the tag exists so this file never has ` +
        `to read one.`,
    );
  }

  // (b)–(c) App.jsx wiring.
  const appSrc39 = readFileSync(join(ROOT, "src/App.jsx"), "utf8");
  const lazyCalls = [...appSrc39.matchAll(/const\s+(\w+)\s*=\s*lazy\(([^\n]*)/g)];
  if (lazyCalls.length < 3) {
    fail(
      `§39: found ${lazyCalls.length} lazy() screen(s) in src/App.jsx (expected at least 3), so ` +
        `"every lazy screen is tagged" and "the matcher sees no lazy screens" report the same green.`,
    );
  }
  let taggedLazy = 0;
  for (const [, name, rest] of lazyCalls) {
    if (/\bchunk\(/.test(rest)) taggedLazy += 1;
    if (!/\bchunk\(/.test(rest)) {
      fail(
        `§39: src/App.jsx loads \`${name}\` with a bare lazy() — \`${rest.trim()}\`. Without chunk(), ` +
          `a 404 on its chunk after a redeploy is indistinguishable from a render bug and falls back ` +
          `to the generic crash copy instead of the download one (items 96, 100).`,
      );
    }
  }
  if (!/import\s*\{[^}]*\bchunk\b[^}]*\}\s*from\s*"\.\/lib\/chunkError\.js"/.test(appSrc39)) {
    fail(`§39: src/App.jsx does not import chunk() from ./lib/chunkError.js.`);
  }

  const asyncStart = appSrc39.indexOf("function AsyncScreen(");
  const asyncEnd = asyncStart === -1 ? -1 : appSrc39.indexOf("\n}", asyncStart);
  if (asyncStart === -1 || asyncEnd === -1) {
    fail(`§39: could not find AsyncScreen's body in src/App.jsx. This check is pointed at the wrong shape.`);
  } else {
    const body = appSrc39.slice(asyncStart, asyncEnd);
    for (const needle of ["isChunkLoadError", "LoadFailure", "AppError"]) {
      if (!body.includes(needle)) {
        fail(
          `§39: AsyncScreen's fallback does not reference \`${needle}\`. It has to pick between the ` +
            `download message and the render-crash message, which means naming both and the predicate ` +
            `that separates them — one fallback for both events is the item-100 defect.`,
        );
      }
    }
  }

  // (d) The boundary has to hand the error over for (c) to mean anything.
  const ebSrc = readFileSync(join(ROOT, "src/components/ErrorBoundary.jsx"), "utf8");
  if (!/static\s+getDerivedStateFromError\s*\(\s*error\s*\)/.test(ebSrc) || !/\{\s*failed:\s*true,\s*error\s*\}/.test(ebSrc)) {
    fail(
      `§39: ErrorBoundary no longer captures the caught error into state, so a fallback cannot see ` +
        `what failed and AsyncScreen's discrimination silently picks one branch forever.`,
    );
  }
  if (!/typeof\s+fallback\s*===\s*"function"/.test(ebSrc)) {
    fail(
      `§39: ErrorBoundary does not support a function \`fallback\`. Reverting it to a bare node leaves ` +
        `every string in place and makes AsyncScreen's two-message logic dead code.`,
    );
  }

  // (e) The two bodies must stay different sentences in every language.
  let distinctPairs = 0;
  for (const lang of Object.keys(TR)) {
    const load = TR[lang]?.loadFailedBody;
    const crash = TR[lang]?.appErrorBody;
    if (!load || !crash) {
      fail(`§39: TR.${lang} is missing loadFailedBody or appErrorBody; the two-message split needs both.`);
      continue;
    }
    if (load.trim() === crash.trim()) {
      fail(
        `§39: TR.${lang}'s loadFailedBody and appErrorBody are the same sentence. Telling the two ` +
          `failures apart is pointless if they say the same thing.`,
      );
      continue;
    }
    distinctPairs += 1;
  }
  if (/\bdownload|\bconnection/i.test(TR.en.appErrorBody)) {
    fail(
      `§39: TR.en.appErrorBody talks about a download or a connection — \`${TR.en.appErrorBody}\`. ` +
        `That is the render-crash copy; the code downloaded fine and then threw.`,
    );
  }

  // Every figure below is counted, never asserted. §38 shipped a summary that
  // printed "9 required present" from a constant and so read as green beside
  // its own failure; the words "by tag" here are derived from the behavioral
  // result and the text scan, so this line cannot say the check held when it
  // did not.
  const method =
    tagRecognised && falsePositives === 0 && messageReads.length === 0
      ? "by tag, not by message"
      : "BY SOMETHING OTHER THAN THE TAG — see the failures above";
  console.log(
    `  §39 failure copy: ${taggedLazy}/${lazyCalls.length} lazy screen(s) tagged via chunk(); AsyncScreen picks ` +
      `LoadFailure vs AppError ${method}; ${falsePositives} false positive(s) across ${mustNotMatch.length} untagged ` +
      `error shape(s), ${messageReads.length} error-text read(s) in chunkError.js; ` +
      `${distinctPairs}/${Object.keys(TR).length} language(s) with two distinct bodies. ` +
      `(Static + behavioral — the rendered two-sided proof is in the run log.)`,
  );
}

// §40. The shell keeps its landmarks, and no tab points at a panel that is not
// there.
//
// WHY THIS EXISTS. Found 2026-08-25 by a live DOM sweep of the built app, in
// the one control a reader touches on every screen. Two defects, one cause —
// an explicit `role` REPLACES an element's implicit role rather than adding to
// it, so:
//   * `<main role="tabpanel">`  exposed NO `main` landmark, and
//   * `<nav role="tablist">`    exposed NO `navigation` landmark.
// Landmark jumping (VoiceOver's rotor, NVDA's `D`) is how a screen-reader user
// skips the sticky header, and there was nothing to jump to on any of the 40
// lessons. Proved in the accessibility tree, not reasoned about: re-applying
// the two roles to the live DOM collapsed `main` + `navigation` back to
// `tabpanel` + `tablist`, and removing them restored both.
//
// The second defect rode on the same element. `<main>`'s id is `panel-${tab}`,
// so only the ACTIVE tab's panel exists — but all three tabs carried
// `aria-controls={`panel-${item.key}`}` unconditionally, leaving the two
// inactive tabs pointing at ids no element had. A dangling IDREF is an
// authoring error (axe's `aria-valid-attr-value`), and it is the exact shape
// five other tablists in this app carry a comment about avoiding. Their answer
// — render the panel and `hidden` it — is unavailable in the shell, because
// these three screens are separate lazy chunks and mounting all three would
// download all three on open. So the reference is scoped to the selected tab
// instead, which is truthful: activation follows focus, so a tab can never be
// focused while inactive.
//
// WHAT IS CHECKED, AND WHY EACH PART.
//   (a) GENERAL, and the reason this is a rule rather than a patch: no element
//       with an implicit landmark role carries an explicit `role` anywhere
//       under src/. The specific fix is one file; the mistake is available in
//       every file.
//   (b) the shell still forms real tabs — a `tabpanel` inside <main> and a
//       `tablist` inside <nav>. Without this, (a) passes by deleting the tab
//       pattern outright.
//   (c) no `aria-controls` in App.jsx's tab row is unconditional. This is the
//       dangling-IDREF regression, and it is one character to reintroduce.
//   (d) floors under (a) and (c), so a rename cannot turn this section into a
//       silent no-op — the failure mode §32-§39 all print a count to avoid.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not the rendered accessibility tree: that
// needs a browser, and the two-sided live proof (landmarks present, then absent
// under an injected role, then present again) is in the run log for 2026-08-25.
// Not whether OTHER dangling IDREFs exist elsewhere in src/ — the ids that
// matter here are produced by template literals a static scan cannot resolve,
// and claiming that coverage would be the vacuous pass (d) exists to prevent.
{
  const SHELL = "src/App.jsx";
  const shellSrc = readFileSync(join(ROOT, SHELL), "utf8");

  // Comments first, and this is load-bearing rather than tidy: App.jsx's own
  // JSX comments spell out `<main role="tabpanel">` as the thing NOT to do, so
  // a scan that reads comments flags the documentation of the fix as the bug.
  const stripComments = (s) =>
    s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

  // The five HTML elements whose implicit role IS a landmark. <section> and
  // <form> are deliberately absent: theirs are conditional on an accessible
  // name, so a bare `role` on them is not automatically a loss.
  const LANDMARK_ELEMENTS = ["main", "nav", "header", "footer", "aside"];

  const jsxFiles = [];
  const walkJsx = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walkJsx(full);
      else if (e.name.endsWith(".jsx")) jsxFiles.push(full);
    }
  };
  walkJsx(join(ROOT, "src"));

  // (a) An explicit role on a landmark element, anywhere under src/.
  let landmarkTagsScanned = 0;
  const overridden = [];
  for (const file of jsxFiles) {
    const code = stripComments(readFileSync(file, "utf8"));
    for (const el of LANDMARK_ELEMENTS) {
      // Opening tag through its first `>`; App.jsx's are multi-line, so `[^>]`
      // has to cross newlines, and a self-closing tag is fine to include.
      const re = new RegExp(`<${el}(\\s[^>]*?)?>`, "g");
      for (const m of code.matchAll(re)) {
        landmarkTagsScanned += 1;
        const attrs = m[1] ?? "";
        const role = attrs.match(/\brole\s*=\s*(?:"([^"]*)"|\{([^}]*)\})/);
        if (role) {
          overridden.push({ file: relative(ROOT, file), el, role: (role[1] ?? role[2] ?? "").trim() });
        }
      }
    }
  }
  for (const o of overridden) {
    fail(
      `§40: ${o.file} has \`<${o.el} role="${o.role}">\`. An explicit role REPLACES the implicit one, ` +
        `so this element no longer exposes its \`${o.el === "nav" ? "navigation" : o.el === "header" ? "banner" : o.el === "footer" ? "contentinfo" : o.el === "aside" ? "complementary" : "main"}\` landmark ` +
        `and landmark navigation has nothing to jump to. Put the role on a child element instead.`,
    );
  }

  // (b) The tab pattern still exists, nested inside the two landmarks.
  const shellNoComments = stripComments(shellSrc);
  const mainBlock = shellNoComments.match(/<main(?:\s[^>]*?)?>([\s\S]*?)<\/main>/);
  const navBlock = shellNoComments.match(/<nav(?:\s[^>]*?)?>([\s\S]*?)<\/nav>/);
  if (!mainBlock) {
    fail(`§40: could not find a <main>…</main> in ${SHELL}. This check is pointed at the wrong shape.`);
  } else if (!/role="tabpanel"/.test(mainBlock[1])) {
    fail(
      `§40: ${SHELL}'s <main> contains no \`role="tabpanel"\`. The panel has to stay inside the main ` +
        `landmark — moving the role back onto <main> is what §40 exists to stop, and deleting it ` +
        `severs the bottom nav's tabs from the screen they switch.`,
    );
  }
  if (!navBlock) {
    fail(`§40: could not find a <nav>…</nav> in ${SHELL}. This check is pointed at the wrong shape.`);
  } else if (!/role="tablist"/.test(navBlock[1])) {
    fail(
      `§40: ${SHELL}'s <nav> contains no \`role="tablist"\`. Same rule as <main>: the tablist belongs ` +
        `on a child, so the navigation landmark and the tab pattern can coexist.`,
    );
  }

  // (c) No unconditional `aria-controls` in the shell. The panel id is built
  // from the ACTIVE tab, so an unguarded reference is dangling for every tab
  // that is not selected — which is two of the three, on every screen.
  const controlsAttrs = [...shellNoComments.matchAll(/aria-controls=\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g)].map((m) => m[1]);
  const unguarded = controlsAttrs.filter((expr) => !/\?/.test(expr));
  for (const expr of unguarded) {
    fail(
      `§40: ${SHELL} has an unconditional \`aria-controls={${expr.trim()}}\`. Only the selected tab's ` +
        `panel is rendered, so every other tab's reference resolves to nothing. Guard it on the ` +
        `active tab (\`active ? … : undefined\`).`,
    );
  }
  const tabButtons = (shellNoComments.match(/role="tab"/g) ?? []).length;

  // (d) Floors. Each of these numbers going to zero would make a section above
  // pass by finding nothing, which is the one result a check must never report
  // as green.
  if (landmarkTagsScanned < 3) {
    fail(
      `§40: the src/ walk found only ${landmarkTagsScanned} landmark element(s) across ${jsxFiles.length} ` +
        `.jsx file(s) (expected at least 3 — the shell alone has <header>, <main> and <nav>). The scan ` +
        `is not reaching the markup, so (a) proves nothing.`,
    );
  }
  if (controlsAttrs.length < 1 || tabButtons < 1) {
    fail(
      `§40: found ${controlsAttrs.length} aria-controls and ${tabButtons} role="tab" in ${SHELL} ` +
        `(expected at least one of each). With neither present, (c) is vacuous.`,
    );
  }

  // Derived from the scan, never asserted — §38 printed a green summary from a
  // constant while its own checks were failing, and §39 was written to avoid
  // repeating it.
  const landmarkVerdict = overridden.length === 0 ? "0 overridden" : `${overridden.length} OVERRIDDEN — see failures above`;
  const controlsVerdict = unguarded.length === 0 ? "all guarded" : `${unguarded.length} UNGUARDED — see failures above`;
  console.log(
    `  §40 shell landmarks: ${landmarkTagsScanned} landmark element(s) scanned across ${jsxFiles.length} .jsx file(s), ` +
      `${landmarkVerdict}; ${SHELL} nests tabpanel in <main> and tablist in <nav>; ` +
      `${controlsAttrs.length} aria-controls in the shell, ${controlsVerdict} (${tabButtons} role="tab"). ` +
      `(Static — the rendered landmark proof is in the run log.)`,
  );
}

// §41. The skip link stays a skip link — first in the tab order, and never an
// <a href="#…">.
//
// WHY THIS EXISTS. Added 2026-08-25 with the skip link itself (backlog item
// 103). Two things about it are one edit away from silently breaking, and
// neither shows up as an error anywhere.
//
//   (1) THE HREF TRAP, and it is this repo's own shape rather than a general
//       worry. `lib/deepLink.js` owns `location.hash` — it listens for
//       `hashchange`, hands the hash to `resolveRoute`, and anything outside
//       the four-route grammar (#/learn, #/practice, #/reference, #/lesson/N)
//       falls back to the lesson path. So the TEXTBOOK skip link,
//       `<a href="#nav">`, is not merely inert here: it navigates. Measured in
//       the live app before the fix was written — an injected `<a href=
//       "#probe-nav">` clicked from lesson 29 moved the hash to `#/learn` and
//       swapped the reader's <h1> from "Transactions" to "Welcome to Economic
//       Cycles", while focus never reached the nav at all. The control was the
//       same click with the hash untouched: route unchanged. Hence a <button>
//       that focuses the target directly.
//
//   (2) THE POSITION. A skip link that is not the FIRST focusable thing in the
//       document is decoration — the reader has already tabbed past whatever
//       it was going to save them. In this shell "first" is a source-order
//       fact: the control is rendered before <header>, with no tabindex
//       anywhere to reorder things, so DOM order is tab order.
//
// WHY IT SKIPS TO THE NAV RATHER THAN TO THE CONTENT, since that is the part a
// future reader will think is a mistake: measured live, the header holds
// exactly ONE tab stop (the language <select>; the title is a plain <span>),
// and focus is already moved into <main> on every route change — so
// "skip to main content" would add a tab stop to save one. The distance is all
// in the other direction, because <nav> is last in the DOM: 38 tab stops from
// the top of the Glossary to the bottom nav, 14 inside a lesson, 6 on Learn.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not the five translations — §1 already
// enforces that every locale carries en's full key set, so `skipToNav` is
// covered there and duplicating it here would rot in two places. Not the
// rendered tab order: that needs a browser, and the live proof (first Tab press
// on a cold load lands on the link, in es at the 1.3x font scale) is in the run
// log for 2026-08-25.
{
  const SHELL = "src/App.jsx";
  const shellSrc = readFileSync(join(ROOT, SHELL), "utf8");

  // Same reason as §40, and the same trap: App.jsx's comment for this control
  // spells out `<a href="#id">` as the thing NOT to do, so a scan that reads
  // comments flags the documentation of the fix as the bug.
  const stripComments = (s) =>
    s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

  const jsxFiles = [];
  const walkJsx = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walkJsx(full);
      else if (e.name.endsWith(".jsx")) jsxFiles.push(full);
    }
  };
  walkJsx(join(ROOT, "src"));

  // (a) GENERAL: no anchor anywhere under src/ may carry a bare-fragment href.
  // The rule is not "the skip link must not be an anchor" — the collision is
  // with the router, so it applies to every in-page anchor anyone adds later.
  let anchorsScanned = 0;
  const fragmentAnchors = [];
  for (const file of jsxFiles) {
    const code = stripComments(readFileSync(file, "utf8"));
    for (const m of code.matchAll(/<a(\s[^>]*?)?>/g)) {
      anchorsScanned += 1;
      const attrs = m[1] ?? "";
      const href = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/);
      const value = href ? (href[1] ?? href[2] ?? href[3] ?? "") : null;
      if (value !== null && value.startsWith("#")) {
        fragmentAnchors.push({ file: relative(ROOT, file), href: value });
      }
    }
  }
  for (const a of fragmentAnchors) {
    fail(
      `§41: ${a.file} has \`<a href="${a.href}">\`. lib/deepLink.js owns location.hash — a fragment ` +
        `link fires hashchange, resolveRoute does not recognize it, and the reader is navigated off ` +
        `the screen they were on. Use a <button> that focuses the target instead.`,
    );
  }

  // (b) The skip control still exists, and still comes before the header.
  const shellNoComments = stripComments(shellSrc);
  const skipAt = shellNoComments.indexOf("t.skipToNav");
  const headerAt = shellNoComments.search(/<header[\s>]/);
  if (skipAt === -1) {
    fail(
      `§41: ${SHELL} no longer renders \`t.skipToNav\`. The skip link is the only way a sighted ` +
        `keyboard user reaches the bottom nav without tabbing the whole screen (38 stops on the ` +
        `Glossary).`,
    );
  } else if (headerAt === -1) {
    fail(`§41: could not find a <header> in ${SHELL}. This check is pointed at the wrong shape.`);
  } else if (skipAt > headerAt) {
    fail(
      `§41: ${SHELL} renders \`t.skipToNav\` AFTER <header>. Nothing in this shell sets tabindex, so ` +
        `DOM order is tab order — a skip link the reader reaches second has already been skipped ` +
        `past by the control it exists to bypass.`,
    );
  }

  // (c) Floor. With no anchors found at all, (a) passes by finding nothing —
  // the vacuous green §40(d) exists to prevent, one section over.
  if (jsxFiles.length < 5) {
    fail(
      `§41: the src/ walk found only ${jsxFiles.length} .jsx file(s) (expected at least 5). The scan ` +
        `is not reaching the markup, so (a) proves nothing.`,
    );
  }

  const anchorVerdict = fragmentAnchors.length === 0 ? "0 fragment href(s)" : `${fragmentAnchors.length} FRAGMENT HREF(S) — see failures above`;
  console.log(
    `  §41 skip link: ${anchorsScanned} anchor(s) scanned across ${jsxFiles.length} .jsx file(s), ` +
      `${anchorVerdict}; ${SHELL} renders t.skipToNav before <header>. ` +
      `(Static — the rendered tab-order proof is in the run log.)`,
  );
}


// §42. The Sector list is ordered by the number it prints.
//
// WHY THIS EXISTS. Added 2026-08-25 with the fix (backlog item 104). The screen
// renders eleven rows, each carrying TWO numbers: a relative-strength rank
// ("#3 of 11", from the owner's WJ_Sector_Comparison measure) and a raw return
// for the selected 1M/3M/6M tab. From the day the screen shipped it sorted by
// the RETURN and labeled by the RANK, so the badges came out of order — measured
// against the shipped public/data/market.json (asOf 2026-08-24), the default 3M
// tab read 1, 3, 4, 2, 7, 5, 6, 10, 8, 9, 11 and the 6M tab opened on #10.
//
// Nothing failed. Every value was individually correct, `npm test` was green,
// and the only artifact was a list of numbers that did not count. That is why a
// check is worth the lines: this defect has no error state to catch it, and its
// two halves live 70 lines apart in one file, so either can be edited alone.
//
// WHAT IS CHECKED, and it is deliberately the RELATIONSHIP rather than either
// half. (a) the comparator sorts on `relativeStrength`, (b) it does NOT sort on
// `change[...]`, (c) the row still renders `rs.rank` — because a future edit
// that drops the badge makes (a) pointless rather than wrong, and this section
// would otherwise stay green while the thing it protects was gone.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not the rendered order — that needs a
// browser and the live proof is in the run log for 2026-08-25. Not
// `t.sectorsSortNote`'s five translations: §1 already enforces en's full key set
// across every locale, and duplicating it here would rot in two places.
{
  const SCREEN = "src/screens/reference/Sectors.jsx";
  const src = readFileSync(join(ROOT, SCREEN), "utf8");

  // Same trap as §40 and §41, and here it is sharper than in either: the
  // comments in this file QUOTE the old broken comparator (`change[window]`)
  // as the thing not to do, so a scan that reads comments flags the
  // documentation of the fix as the bug.
  const code = src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[ \t]*\/\/.*$/gm, "");

  const sortMatch = code.match(/const\s+ranked\s*=\s*\[\s*\.\.\.sectors\s*\][\s\S]*?\.sort\(([\s\S]*?)\);/);
  if (!sortMatch) {
    fail(
      `§42: could not find the \`const ranked = [...sectors].sort(…)\` comparator in ${SCREEN}. ` +
        `This check is pointed at a shape that no longer exists — repoint it or remove it, but do ` +
        `not leave it passing vacuously.`,
    );
  } else {
    const comparator = sortMatch[1];
    // (a) it sorts on the rank. The helper may be hoisted above the .sort(),
    // so the window is the comparator plus everything from `const ranked`
    // back to the start of the render body.
    const sortRegion = code.slice(Math.max(0, code.indexOf("const bySymbol")), sortMatch.index + sortMatch[0].length);
    if (!/relativeStrength/.test(sortRegion)) {
      fail(
        `§42: ${SCREEN} sorts \`ranked\` without reading \`relativeStrength\`. Every row prints ` +
          `"#N of M" from that measure, so a list ordered by anything else renders its own badges ` +
          `out of order (item 104).`,
      );
    }
    // (b) and not on the window's return, which is the specific regression.
    if (/\bchange\s*\??\.?\s*\[/.test(sortRegion)) {
      fail(
        `§42: ${SCREEN} sorts \`ranked\` on \`change[…]\` — the raw return for the selected ` +
          `1M/3M/6M tab. That is exactly the item-104 defect: the WJ rank is computed across ` +
          `WJ_PERIODS and has no window, so the two orderings disagree and the badges come out ` +
          `1, 3, 4, 2, 7, 5.`,
      );
    }
    // (c) floor. (a) and (b) protect a badge; if the badge goes, they are
    // guarding nothing and must say so rather than stay green.
    if (!/\brs\s*\??\.\s*rank\b/.test(code)) {
      fail(
        `§42: ${SCREEN} no longer renders \`rs.rank\`. (a) and (b) exist to keep the list's order ` +
          `and its printed rank in agreement — with no printed rank there is nothing to agree with, ` +
          `so this section is now vacuous. Re-scope it deliberately.`,
      );
    }
    console.log(
      `  §42 sector ordering: comparator found (${comparator.trim().split("\n")[0].slice(0, 48)}…), ` +
        `sorts on relativeStrength, does not sort on change[window], row renders rs.rank. ` +
        `(Static — the rendered-order proof is in the run log.)`,
    );
  }
}


// §43. The live accessibility sweep keeps the properties that make it an
// instrument rather than a script that prints zeros.
//
// WHY THIS EXISTS. Added 2026-08-25 with scripts/a11y-sweep.js (backlog item
// 105). Every other section in this file reads source text, and that is exactly
// the gap the sweep fills: items 102 and 103 were COMPOSITION defects, where
// each attribute was individually correct and the browser's computed tree was
// still wrong. Nothing here can see a computed tree.
//
// The sweep cannot join `npm test` — it needs a browser, and adding a headless
// one is item 12's port-cost rule territory. So it is a file a run pastes into
// the preview tool. That makes it exactly the kind of artifact that rots
// unnoticed: nothing runs it on a schedule, and a well-meaning edit that drops
// its capability gate would leave a script that still returns clean-looking JSON
// while measuring nothing. This section guards the THREE properties that make
// its zeros mean something, and nothing about its findings.
//
// (a) it parses — a syntax error in a pasted script surfaces as a confusing
//     harness error rather than a test failure, and no run would look here;
// (b) the hard layout gate and the VACUOUS accounting are both still present —
//     these are what stop a lying zero, and they are the whole design;
// (c) selftest() still plants a control for every probe it claims to cover, so
//     the probe list and the expectation list cannot drift apart.
//
// (d) the focus capability is MEASURED, not inferred from `document.hasFocus()`
//     — added 2026-08-26 with backlog item 108, which is the defect this
//     guards against recurring. The sweep used to gate its focus probe on
//     hasFocus(), a proxy; on 2026-08-25 the proxy read true on a session
//     where a native listener recorded zero focus events, which flips the
//     probe from UNAVAILABLE to VACUOUS and would mark a blind probe
//     available. A proxy signal fails green and a planted control fails
//     loud, so the proxy must not come back as a gate.
//
// WHAT IS DELIBERATELY NOT CHECKED. Not whether the app passes the sweep: that
// needs a browser and belongs in the run log, where the counts convention lives.
// Not focus behavior itself — whether focus events fire and whether :focus
// matches are properties of the harness, measured live by the sweep every run
// (three separate signals; see its header note 2). This section checks only
// that the sweep still measures them rather than assuming them.
{
  const SWEEP = "scripts/a11y-sweep.js";
  const src = readFileSync(join(ROOT, SWEEP), "utf8");

  // (a) It parses. `new Function` compiles without executing, which is what we
  // want — the file's body touches `window` and `document` and would throw here.
  try {
    new Function(src);
  } catch (err) {
    fail(`§43: ${SWEEP} does not parse (${err.message}). It is pasted into a browser verbatim, so a syntax error here is only ever found by a run that has already wasted its verification budget.`);
  }

  // (b) The gate and the vacuous accounting.
  // `sectionOk` exists because the first run of this section printed its
  // reassuring summary line even while its own gate check was FAILING one line
  // above — the exact vacuous-green shape §40(d) and §42(c) were written to
  // prevent, reproduced inside the section that guards against it. Caught
  // 2026-08-25 by deliberately breaking the gate to prove this check could fail.
  let sectionOk = true;
  for (const [needle, why] of [
    ["layout: window.innerWidth > 0", "the hard layout gate — without it every geometry probe returns zero findings on a pane whose layout is not live yet, which reads exactly like a clean result"],
    ['"REFUSED', "the refusal branch — the gate is only worth having if failing it stops the report"],
    ['"VACUOUS"', "the vacuous accounting — a probe that scanned nothing must not be counted as a pass"],
    ['"UNAVAILABLE"', "the per-capability opt-out — focus events do not fire in this harness and must report unavailable rather than clean"],
    ["function measureFocus()", "the planted focus control (item 108) — without it the focus capability goes back to being inferred from a proxy, and a proxy is what marked a blind probe available on 2026-08-25"],
    ["focusSelectors: f.focusSelectors", "the second focus capability — `:focus` matching fails independently of focus events, and it is the one a :focus-visible probe actually needs"],
  ]) {
    if (!src.includes(needle)) {
      sectionOk = false;
      fail(`§43: ${SWEEP} no longer contains \`${needle}\` — ${why}.`);
    }
  }

  // (d) The proxy must not creep back. `hasFocus()` is fine as recorded evidence
  // — the sweep still reports it, and that is how a future divergence becomes
  // visible — but it must not be what a capability is assigned FROM.
  for (const m of src.matchAll(/(focusEvents|focusSelectors)\s*:\s*([^,\n]+)/g)) {
    const rhs = m[2].trim();
    if (/hasFocus\s*\(/.test(rhs) || /visibilityState/.test(rhs)) {
      sectionOk = false;
      fail(`§43(d): ${SWEEP} assigns capability \`${m[1]}\` from \`${rhs}\` — that is the item-108 proxy returning. document.hasFocus() is a PROXY for "do focus events fire", and on 2026-08-25 it read true on a session where a native listener recorded zero. Measure the capability with a planted control (measureFocus()) and keep hasFocus() as evidence only.`);
    }
  }

  // (c) Every probe the sweep advertises is either covered by a planted control
  // in selftest(), or is explicitly gated on a capability this harness lacks.
  // A probe in neither set is one whose zeros nobody has ever proven meaningful.
  const probeNames = [...src.matchAll(/^\s{4}(\w+):\s*\{\s*needs:\s*"(\w+)"/gm)].map((m) => ({ name: m[1], needs: m[2] }));
  const selftestBlock = src.slice(src.indexOf("var expect = {"), src.indexOf("var caps = capabilities(), results"));
  if (probeNames.length === 0 || !selftestBlock) {
    fail(`§43: could not find the probe table or the selftest expectation block in ${SWEEP}. This check is pointed at a shape that no longer exists — repoint it rather than leaving it green.`);
  } else {
    const uncovered = probeNames.filter((p) => p.needs === "layout" && !new RegExp(`\\b${p.name}\\s*:`).test(selftestBlock));
    if (uncovered.length > 0) {
      sectionOk = false;
      fail(`§43: ${SWEEP} declares probe(s) ${uncovered.map((p) => p.name).join(", ")} with no planted control in selftest(). Every layout-capable probe must prove it can FAIL before its zero is worth reading — that is the one property separating this file from a script that prints reassuring numbers.`);
    }
    console.log(
      sectionOk
        ? `  §43 a11y sweep: ${SWEEP} parses, layout gate + REFUSED/VACUOUS/UNAVAILABLE accounting present, ` +
          `${probeNames.length} probe(s) declared (${probeNames.filter((p) => p.needs === "layout").length} layout-gated, all with planted controls). ` +
          `(Static — the sweep's own live counts belong in the run log.)`
        : `  §43 a11y sweep: FAILED above — the summary is withheld deliberately rather than printed alongside its own failure.`,
    );
  }
}


// §44. Every <section> in src/ is a NAMED region.
//
// WHY THIS IS A CHECK AND NOT A STYLE PREFERENCE. Per HTML-AAM a <section> maps
// to the `region` landmark only once it has an accessible name; unnamed, it is
// either not a landmark at all or an anonymous "region" in a rotor, and neither
// helps anyone. Item 82 set the convention on the Learn path — point
// aria-labelledby at the <h2> the section already contains, rather than
// duplicating the label into an aria-label that then has to be kept in sync —
// and 2026-08-25 found the lesson body and Practice still bare, five days and
// ~130 commits later, because nothing enforced it. That is what this section is
// for: the convention now costs a failing test to break.
//
// WHY IT CANNOT BE VERIFIED IN A BROWSER, which is the trap here. The `read_page`
// accessibility tree available to runs prints EVERY <section> as `region`
// whether it is named or not, and does not surface aria-labelledby names at all
// (calibrated in item 82; re-confirmed 2026-08-25 by planting a named and an
// unnamed <section> side by side — the aria-LABEL plant printed its name, the
// unnamed one printed a bare `region` indistinguishable from the app's). So a
// run that "verifies" this by seeing `region` in that tree has verified nothing.
// Verify live at the DOM level instead: attribute present, getElementById
// resolves, and the target is the section's own heading.
{
  const walkJsx = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = join(dir, e.name);
      if (e.isDirectory()) return walkJsx(full);
      return e.isFile() && e.name.endsWith(".jsx") ? [full] : [];
    });

  // Comments first, or the check reads the PROSE about <section> in Learn.jsx's
  // own convention comment as three more unnamed tags. JSX `{/* */}` and plain
  // `/* */` reduce to the same block form.
  const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

  // A regex cannot read these attributes: the values are template literals
  // containing `${...}`, so `[^}\s]+` stops at the first `}` and silently
  // captures half an expression. Scan with brace depth instead. (Written after
  // the regex version did exactly that on `lesson-section-${sectionIndex}-title`.)
  const attrValueAt = (s, i) => {
    if (s[i] === '"' || s[i] === "'") {
      const end = s.indexOf(s[i], i + 1);
      return end === -1 ? null : s.slice(i + 1, end);
    }
    if (s[i] === "{") {
      let depth = 0;
      for (let j = i; j < s.length; j++) {
        if (s[j] === "{") depth++;
        else if (s[j] === "}" && --depth === 0) return s.slice(i + 1, j);
      }
    }
    return null;
  };
  // The end of an opening tag is the first `>` at brace depth 0 — a `>` inside
  // an expression (`{a > b && ...}`) does not close the tag.
  const tagEnd = (s, from) => {
    let depth = 0;
    for (let j = from; j < s.length; j++) {
      if (s[j] === "{") depth++;
      else if (s[j] === "}") depth--;
      else if (s[j] === ">" && depth === 0) return j;
    }
    return -1;
  };

  let sectionsSeen = 0;
  const unnamed = [];
  const dangling = [];

  for (const jsxPath of walkJsx(join(ROOT, "src"))) {
    const rel = jsxPath.slice(ROOT.length + 1);
    const src = stripComments(readFileSync(jsxPath, "utf8"));

    // Every id this file defines, read with the same scanner, so the two sides
    // are compared on equal terms.
    const idsHere = new Set();
    for (const m of src.matchAll(/\bid=/g)) {
      const v = attrValueAt(src, m.index + m[0].length);
      if (v !== null) idsHere.add(v.trim());
    }

    for (const m of src.matchAll(/<section(?=[\s>])/g)) {
      const end = tagEnd(src, m.index);
      if (end === -1) continue;
      sectionsSeen++;
      const tag = src.slice(m.index, end);
      const at = tag.indexOf("aria-labelledby=");
      if (at === -1) {
        unnamed.push(rel);
        continue;
      }
      const ref = attrValueAt(tag, at + "aria-labelledby=".length);
      if (ref === null || !idsHere.has(ref.trim())) {
        dangling.push(`${rel} -> ${ref === null ? "(unparseable)" : ref.trim()}`);
      }
    }
  }

  // Vacuity guard, the §40(d)/§42(c) shape: zero sections means the scanner is
  // pointed at markup that no longer exists, not that the app is clean.
  if (sectionsSeen === 0) {
    fail("§44: found no <section> tags anywhere in src/. This check is pointed at a shape that no longer exists — repoint it rather than leaving it green.");
  } else if (unnamed.length > 0) {
    fail(`§44: ${unnamed.length} bare <section> tag(s) with no aria-labelledby, in ${[...new Set(unnamed)].join(", ")}. An unnamed <section> is not a landmark (HTML-AAM) — point aria-labelledby at the heading the section already contains, per the convention in src/screens/Learn.jsx.`);
  } else if (dangling.length > 0) {
    fail(`§44: ${dangling.length} <section aria-labelledby> reference(s) with no matching id= in the same file: ${dangling.join(", ")}. A landmark named by a reference that resolves to nothing is worse than an unnamed one — it reviews as correct. This is item 102's shape.`);
  } else {
    console.log(`  §44 named regions: ${sectionsSeen} <section> tag(s) across src/, all named by an aria-labelledby that resolves to an id defined in the same file. (Static — read_page cannot see this difference; verify live at the DOM level.)`);
  }
}


// §45. The lesson reader's hook and check blocks are titled by a real <h2>.
//
// WHY THIS IS A CHECK AND NOT A STYLE PREFERENCE. <Question> renders its
// question text as an <h3> (src/components/Question.jsx). In the lesson reader
// the first <Question> is the pre-lesson hook, which sits ABOVE the first body
// <h2> — so with the hook's own label rendered as a styled <p>, the document
// went <h1> straight to <h3> and skipped a level (WCAG 1.3.1; item 106,
// measured live on all 40 lessons on 2026-08-25). The fix was not to promote
// the question — that would make a pre-quiz item a sibling of the body sections
// — but to mark up the label the block already had. This section keeps it
// marked up: the convention now costs a failing test to break.
//
// WHY THE SKIP IS INVISIBLE TO A COMPLETED-LESSON SWEEP, which is the trap here.
// The hook renders only while the lesson is UNFINISHED. Seed localStorage with
// every lesson complete — the obvious way to unlock all 40 for a sweep — and
// every hook disappears, so the reader measures clean on precisely the state
// that carries the defect. Unlock by completing the PREVIOUS lesson only.
//
// WHAT THIS CANNOT SEE: it checks the two labels, not the rendered order. A
// third <Question> added above the body with no <h2> of its own would reproduce
// the defect and pass here. scripts/a11y-sweep.js's `headingOrder` probe is the
// instrument for that, and it has to be pointed at an unfinished lesson.
{
  const file = "src/screens/LessonReader.jsx";
  const src = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")          // comments first: this section's own
    .replace(/^\s*\/\/.*$/gm, "");             // prose names both tokens

  // (a) Each label must be rendered by a <Text> whose opening tag says as="h2".
  //     Searching BACKWARDS from the token to the nearest "<Text" is what makes
  //     this robust to attribute order and reformatting; the span cap is what
  //     stops it from silently binding to some unrelated <Text> far above if the
  //     markup is restructured.
  const SPAN_CAP = 400;
  let missing = [], unbound = [], seen = 0;
  for (const token of ["{t.hookTitle}", "{t.checkTitle}"]) {
    const at = src.indexOf(token);
    if (at === -1) continue;
    seen++;
    const open = src.lastIndexOf("<Text", at);
    if (open === -1 || at - open > SPAN_CAP) { unbound.push(token); continue; }
    if (!/\bas=("h2"|{"h2"})/.test(src.slice(open, at))) missing.push(token);
  }

  // (b) Vacuity guard, the §44 shape — and here it is load-bearing twice over.
  //     Zero labels means the scanner is pointed at markup that no longer
  //     exists. And if <Question> ever stops rendering an <h3>, this section is
  //     guarding a level relationship that no longer exists either: say so
  //     rather than staying green on a premise that has moved.
  //     Since item 109 (2026-08-25) the level is a PROP — <Question> renders
  //     as={headingLevel}, defaulting to "h3" — because the review runner needs
  //     the same component at <h1>. So the premise this section depends on is no
  //     longer "the file contains as=\"h3\"" but the conjunction below: the
  //     default is still h3, AND the lesson reader still takes that default
  //     rather than overriding it. Either half alone can go green while the
  //     reader's outline is wrong.
  const questionSrc = readFileSync("src/components/Question.jsx", "utf8");
  const questionDefaultsToH3 = /headingLevel\s*=\s*"h3"/.test(questionSrc) &&
    /\bas={headingLevel}/.test(questionSrc);
  const readerOverrides = /<Question\b[^>]*\bheadingLevel=/.test(src);
  const questionIsH3 = questionDefaultsToH3 && !readerOverrides;

  if (seen === 0) {
    fail("§45: found neither {t.hookTitle} nor {t.checkTitle} in " + file + ". This check is pointed at markup that no longer exists — repoint it rather than leaving it green.");
  } else if (seen < 2) {
    fail(`§45: found only ${seen} of the 2 expected lesson-reader block labels in ${file}. One of the hook/check blocks has been renamed or removed; repoint this check rather than leaving it half-green.`);
  } else if (unbound.length > 0) {
    fail(`§45: ${unbound.join(", ")} is not inside a <Text> opening tag within ${SPAN_CAP} chars. The markup was restructured — re-read this section's reasoning and repoint it; do not widen the cap to make it pass.`);
  } else if (missing.length > 0) {
    fail(`§45: ${missing.join(", ")} is rendered without as="h2". <Question> renders an <h3>, so an untitled hook block makes the lesson read <h1> -> <h3> and skip a level (WCAG 1.3.1, item 106). Add as="h2" to the <Text> that renders the label — <Text> sets margin:0 and explicit font metrics, so it costs nothing visually.`);
  } else if (!questionIsH3) {
    fail('§45: <Question> no longer resolves to an <h3> in the lesson reader — either src/components/Question.jsx stopped defaulting headingLevel to "h3" (or stopped passing it to as=), or ' + file + ' now overrides headingLevel on a <Question>. This section exists to give that <h3> a parent heading, so its premise has moved — re-derive the reader\'s heading order and update this check rather than leaving it green.');
  } else {
    console.log(`  §45 lesson-reader heading order: both block labels ({t.hookTitle}, {t.checkTitle}) render as <h2>, above <Question>'s <h3>. (Static — it checks the labels, not the rendered order; a11y-sweep.js's headingOrder probe on an UNFINISHED lesson is the instrument for that.)`);
  }
}

// §46. The review runner's question is the screen's <h1>.
//
// WHY. Practice has four rendering branches. Three of them (queue overview,
// batch pause, session complete) open with {t.reviewTitle} as an <h1> and read
// "12". The fourth — the running quiz — deliberately has no title: the design
// is a close control, a counter, a progress bar, then the question. So before
// item 109 the entire screen's heading outline was ONE <h3>, with no <h1>
// anywhere on the page (WCAG 1.3.1 / 2.4.6; measured live 2026-08-25 in both
// the unanswered and answered runner states, both reading sequence "3").
//
// WHY IT IS A CHECK. The fix is one prop, and one prop is exactly what a later
// refactor drops without noticing — <Question> still renders, the screen still
// looks identical, and the only symptom is invisible to everyone who is not
// using a screen reader. It also cannot be fixed the "obvious" way (adding a
// visible "Review" <h1>), so a future run that deletes the prop is unlikely to
// replace it with anything.
//
// WHAT THIS CANNOT SEE: it reads source, so it cannot prove the RENDERED order.
// a11y-sweep.js's headingOrder probe is that instrument — and note that until
// this same commit it could not have caught this defect either: it compared each
// heading only with its predecessor, so a page starting at <h3> scored "ok".
{
  const file = "src/screens/Practice.jsx";
  const src = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")          // this section's own reasoning is quoted
    .replace(/^\s*\/\/.*$/gm, "")              // in Practice.jsx's comments
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");     // JSX comments name the prop too

  const tags = src.match(/<Question\b[\s\S]*?\/>/g) || [];
  const atH1 = tags.filter((tag) => /\bheadingLevel="h1"/.test(tag));

  // Vacuity guards, the §44/§45 shape. Zero <Question> tags means this is
  // pointed at markup that no longer exists; and if <Question> stopped taking a
  // headingLevel prop at all, the mechanism this section guards is gone rather
  // than satisfied.
  const questionSrc = readFileSync("src/components/Question.jsx", "utf8");
  const propExists = /headingLevel\s*=\s*"h3"/.test(questionSrc) &&
    /\bas={headingLevel}/.test(questionSrc);

  if (tags.length === 0) {
    fail(`§46: found no <Question ... /> in ${file}. This check is pointed at markup that no longer exists — repoint it rather than leaving it green.`);
  } else if (!propExists) {
    fail('§46: src/components/Question.jsx no longer takes a headingLevel prop defaulting to "h3" and passing it to as=. The runner cannot raise its question to <h1> through a prop that is gone, so this section is guarding a mechanism that has moved — re-derive it rather than leaving it green.');
  } else if (atH1.length !== 1) {
    fail(`§46: expected exactly 1 <Question> carrying headingLevel="h1" in ${file}, found ${atH1.length} of ${tags.length} total. The review runner's question is the only heading on that screen, so without it the page has no <h1> at all and its outline starts at <h3> (WCAG 1.3.1, item 109). Do not fix this by adding a visible "Review" <h1> above the counter — that is the title the runner design removes on purpose.`);
  } else {
    console.log(`  §46 review-runner heading order: the running quiz's <Question> carries headingLevel="h1" (${tags.length} <Question> tag(s) in ${file}). (Static — a11y-sweep.js's headingOrder probe, pointed at a STARTED session, is the instrument for the rendered order.)`);
  }
}


// §47. While the first-run dialog is open, the dialog IS the document.
//
// WHY. `aria-modal="true"` on FirstRunNotice only PROMISES assistive tech that
// everything outside the dialog is unavailable. Nothing in the DOM made that
// promise true, so on the first screen anyone ever sees — the one screen with
// 100% reach — the real state was: an <h2> dialog title first in document
// order, then the whole Learn screen still exposed behind it (its <h1> and
// three track <h2>s), sequence "21222", first heading h2 (WCAG 1.3.1 / 2.4.6).
// Measured live 2026-08-25 (item 110), and measured again with the pre-fix
// markup recreated on the fixed build to prove the reading was the markup's.
//
// TWO HALVES, AND EITHER ONE ALONE STILL LEAVES A DEFECT — which is why this
// section fails on either:
//   (a) the background is inert + aria-hidden, so the promise is real; without
//       it, a reader that ignores aria-modal browses a screen it cannot reach.
//   (b) the dialog title is the <h1>; without it, the now-correctly-isolated
//       document's outline starts at <h2> with no <h1> anywhere — exactly the
//       item 109 shape. Fixing (a) alone makes (b) MORE severe, not less.
//
// The pairing of inert with aria-hidden is only safe because FirstRunNotice
// traps Tab. aria-hidden content that is still keyboard-reachable is a worse
// defect than the one being fixed, so if that trap is ever removed, this
// section's premise is gone — hence the focus-trap vacuity guard below.
//
// WHAT THIS CANNOT SEE: it reads source, so it cannot prove the RENDERED
// result. a11y-sweep.js's headingOrder probe, pointed at a cleared
// localStorage so the dialog is actually up, is that instrument.
{
  const file = "src/App.jsx";
  const src = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")          // this section's reasoning is quoted
    .replace(/^\s*\/\/.*$/gm, "")              // in App.jsx's own comments, which
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");     // name every string matched here

  // Vacuity guards first: is the mechanism this section describes still there?
  const hasDialog = /role="dialog"/.test(src) && /aria-modal="true"/.test(src);
  const hasTrap = /e\.key === "Tab"/.test(src) && /preventDefault\(\)/.test(src);
  const defined = /const behindDialog = showDisclaimer\s*\?\s*\{[^}]*\binert:/.test(src) &&
    /const behindDialog = showDisclaimer\s*\?\s*\{[^}]*"aria-hidden":/.test(src);

  // (b) the dialog's own title element.
  const titleIsH1 = /<Text as="h1" id="first-run-title"/.test(src);

  // (a) every sibling of the dialog inside the shell carries the spread. The
  // list is explicit rather than counted, because "4 spreads somewhere" would
  // stay green if one moved off <nav> and onto something already covered.
  const SHELL = ["button", "header", "main", "nav"];
  const missing = SHELL.filter((tag) => !new RegExp(`<${tag}\\s*\\n\\s*\\{\\.\\.\\.behindDialog\\}`).test(src));
  const spreads = (src.match(/\{\.\.\.behindDialog\}/g) || []).length;

  if (!hasDialog) {
    fail(`§47: found no role="dialog" with aria-modal="true" in ${file}. The first-run notice this section guards is gone or restructured — re-derive it rather than leaving this green.`);
  } else if (!hasTrap) {
    fail(`§47: FirstRunNotice in ${file} no longer traps Tab. This section's whole safety argument for pairing aria-hidden with inert on the background was that focus cannot get there anyway — without the trap, aria-hidden background content becomes keyboard-reachable-but-unannounced, which is worse than the defect being fixed.`);
  } else if (!defined) {
    fail(`§47: ${file} no longer defines \`behindDialog\` as a showDisclaimer-gated object carrying BOTH inert and aria-hidden. The mechanism has moved rather than been satisfied — re-derive it.`);
  } else if (!titleIsH1) {
    fail(`§47: the first-run dialog's title in ${file} is not <Text as="h1" id="first-run-title">. With the background inert, this dialog is the entire document, so an <h2> title leaves the first screen anyone ever sees with no <h1> at all and an outline starting one level deep (WCAG 1.3.1, item 110).`);
  } else if (missing.length > 0) {
    fail(`§47: <${missing.join(">, <")}> in ${file} ${missing.length === 1 ? "does" : "do"} not carry {...behindDialog} (found ${spreads} spread(s) across the shell, expected ${SHELL.length}). Anything behind the dialog that is not inert stays focusable and in the accessibility tree, so aria-modal's promise is false for exactly that element.`);
  } else {
    console.log(`  §47 first-run dialog isolation: title is <h1> and all ${SHELL.length} shell siblings (<${SHELL.join(">, <")}>) carry {...behindDialog} = inert + aria-hidden. (Static — a11y-sweep.js's headingOrder probe against a CLEARED localStorage is the instrument for the rendered outline.)`);
  }
}

// §48. The a11y state matrix keeps its contract, and its one cross-file premise.
//
// WHY. scripts/a11y-states.js drives the app into each state a sweep cannot reach by loading a
// URL. Three shipped fixes (items 106, 109, 110) live ONLY in such states — the lesson reader
// while unfinished, the review runner mid-quiz, the first-run dialog from cleared storage — and
// before that file existed, each was found by a human driving the app by hand exactly once.
//
// WHAT CAN GO WRONG SILENTLY, which is the only reason this is a check:
//
//   (a) A state loses its `arrived` assertion. That assertion is the file's whole anti-lying-zero
//       contract: without it a recipe whose click missed sweeps whatever screen it is actually on,
//       finds it clean, and reports a zero. On this file's FIRST run, nine of thirteen recipes
//       were reaching the wrong screen — every one of those would have been a false clean.
//   (b) A regression state is deleted. Nothing else in the repo re-checks items 106/109/110 in
//       the rendered DOM, so dropping one of these names silently retires a shipped fix's only
//       live coverage. check-data.mjs §45/§46/§47 guard the SOURCE of those fixes; this guards
//       that someone still looks at the rendered result.
//   (c) BATCH_SIZE moves. `practice-batch-pause` answers a fixed number of questions to reach the
//       pause. If Practice.jsx's BATCH_SIZE changes, the recipe sails past (or never reaches) the
//       pause. That failure is at least honest — the arrival assertion reports MISSED rather than
//       a clean sweep of the wrong screen — but a static check is cheaper than discovering it live.
//
// WHAT THIS CANNOT SEE: it reads source. It cannot tell whether a recipe still ARRIVES — only the
// file's own `A11yStates.runAll()`, whose `missed` count is reported separately from `clean`, can.
{
  const file = "scripts/a11y-states.js";
  const raw = readFileSync(file, "utf8");
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, "")          // this section's reasoning is quoted in that
    .replace(/^\s*\/\/.*$/gm, "");             // file's header and its per-state comments

  const start = src.indexOf("var STATES = [");
  const matrix = start === -1 ? "" : src.slice(start, src.indexOf("\n  ];", start));

  // `[^"]+`, not `[a-z0-9-]+`. The narrow class was written first and an injection test caught it:
  // renaming a state to `practice-runnerX` made the regex match NOTHING for that entry, so the
  // count fell to 18 and this section reported a MISSING ASSERTION for a file whose assertions
  // were all intact. The check still failed — but for the wrong reason, which sends the next
  // reader to the wrong place. A name is whatever is between the quotes.
  const names = (matrix.match(/name:\s*"([^"]+)"/g) || [])
    .map((m) => m.replace(/name:\s*"/, "").replace(/"$/, ""));
  const arrivedCount = (matrix.match(/arrived:\s*\{/g) || []).length;

  // The states that are the only live coverage of a shipped fix.
  const REGRESSION_STATES = {
    "first-run-modal": "item 110 (the dialog isolates the app behind it)",
    "lesson-unfinished": "item 106 (the hook block's heading level)",
    "practice-runner": "item 109 (the runner's question is the screen's <h1>)"
  };
  const missingStates = Object.keys(REGRESSION_STATES).filter((n) => names.indexOf(n) === -1);

  // (c) the cross-file premise.
  const practiceSrc = readFileSync("src/screens/Practice.jsx", "utf8");
  const batchMatch = practiceSrc.match(/const BATCH_SIZE\s*=\s*(\d+)/);
  const pauseMatch = matrix.match(/name:\s*"practice-batch-pause"[\s\S]*?\{\s*answer:\s*(\d+)\s*\}/);

  // (d) the no-reload set stays SIDE-EFFECT-FREE (item 118, added 2026-08-26).
  //
  // runAll() and sweepLangs() run every no-reload state in ONE page session, in order, and
  // sweepLangs runs the whole set once per language. So a no-reload recipe that writes persistent
  // learner state does not just affect itself — it changes the screen every state after it sweeps,
  // including the same state in the next language. MEASURED before this guard existed: from
  // cleared storage `practice-landing` shows the never-started card; after `practice-all-questions`
  // answered one check question (`{ radio: 4 }` → recordReview → ecycles_review), the identical
  // recipe showed the caught-up card. Both reported `ok, findings: 0`, so the five-language row
  // "every state reached, 0 findings" was comparing en's card against four languages' other card.
  //
  // `answer` and `radio` are the two verbs that commit an answer. A state that needs them must
  // carry `reload: true` (with `clear`/`seed`), which puts it behind begin()/finish() and out of
  // the shared session — that is what makes the `requires: COLD` preconditions hold for a whole
  // sweep instead of only until the first mutating recipe runs.
  const mutatingVerb = /\{\s*(?:answer|radio)\s*:/;
  const entrySplit = matrix.split(/\n\s*\{\s*name:\s*"/).slice(1);
  const leakyStates = entrySplit
    .map((chunk) => ({ name: chunk.slice(0, chunk.indexOf('"')), body: chunk }))
    .filter((s) => mutatingVerb.test(s.body) && !/reload:\s*true/.test(s.body))
    .map((s) => s.name);

  // (e) the storage audit's fixture still covers the app's whole persisted surface
  //     (item 119, added 2026-08-26).
  //
  //     A11yStates.auditBegin/auditFinish decide which states need a `requires` declaration by
  //     diffing each screen cold against a WARM_FIXTURE. That verdict is only as wide as the
  //     fixture: a key the app persists but the fixture never sets is a key no state can be
  //     measured against, so every screen that reads it comes back "provably storage-independent"
  //     — the same lying zero one level up, and this time in the instrument that exists to find
  //     lying zeros. `requires` is opt-in, so nothing else would ever notice.
  //
  //     This cannot check that a screen VARIES — only a browser can, which is what the audit is
  //     for. It checks the strictly weaker and entirely static thing: every key in
  //     src/lib/storage.js's KEYS is either IN the fixture or NAMED in FIXTURE_EXCLUDES. Adding a
  //     key to the app therefore forces a decision about it here, rather than silently narrowing
  //     the next audit. Excluding is allowed — the three presentation preferences (lang, theme,
  //     font scale) restyle every screen and are swept as their own axes — but it is explicit.
  const storageSrc = readFileSync("src/lib/storage.js", "utf8");
  const keysBlock = storageSrc.slice(storageSrc.indexOf("export const KEYS = {"));
  const appKeys = (keysBlock.slice(0, keysBlock.indexOf("};")).match(/"(ecycles_[a-z_]+)"/g) || [])
    .map((m) => m.replace(/"/g, ""));
  // Read from `raw`, not `src`: the fixture's keys sit in an object literal, but FIXTURE_EXCLUDES
  // is a short array whose entries the comment-stripper leaves alone either way. Using raw keeps
  // this independent of how that stripping evolves.
  const fixtureBlock = raw.slice(raw.indexOf("var WARM_FIXTURE = {"), raw.indexOf("var FIXTURE_EXCLUDES"));
  // Bounded at the array's own `];`, NOT by a fixed character window. A 300-char window was
  // written first and miscounted: it ran past the array into the `fixtureHolds` function below,
  // which names ecycles_analytics_log, so a key the fixture SETS was reported as excluded. The
  // total was still 12 and the check still passed — the split, 8/4 instead of 9/3, was the only
  // thing that said so. A summary line that adds up is not a summary line that is right.
  const excludesStart = raw.indexOf("var FIXTURE_EXCLUDES");
  const excludesBlock = raw.slice(excludesStart, raw.indexOf("];", excludesStart));
  const covered = new Set([
    ...(fixtureBlock.match(/ecycles_[a-z_]+/g) || []),
    ...(excludesBlock.match(/ecycles_[a-z_]+/g) || [])
  ]);
  const uncoveredKeys = appKeys.filter((k) => !covered.has(k));
  const excludedSet = new Set(excludesBlock.match(/ecycles_[a-z_]+/g) || []);
  const excludedCount = appKeys.filter((k) => excludedSet.has(k)).length;

  if (!matrix || names.length === 0) {
    fail(`§48: could not find a populated \`var STATES = [\` array in ${file}. This section is pointed at a structure that no longer exists — repoint it rather than leaving it green.`);
  } else if (arrivedCount !== names.length) {
    fail(`§48: ${file} defines ${names.length} state(s) but only ${arrivedCount} \`arrived\` assertion(s). A state without one sweeps whatever screen it happens to land on and reports that as a clean result — the exact lying zero this file exists to prevent.`);
  } else if (missingStates.length > 0) {
    fail(`§48: ${file} no longer defines the state(s) ${missingStates.map((n) => `"${n}" — ${REGRESSION_STATES[n]}`).join("; ")}. That state is the only place a shipped a11y fix is checked in the RENDERED DOM; §45/§46/§47 only check its source. Removing it retires live coverage silently.`);
  } else if (!batchMatch) {
    fail("§48: could not read BATCH_SIZE from src/screens/Practice.jsx, so the practice-batch-pause recipe's question count cannot be checked against it. Repoint this check rather than leaving it green.");
  } else if (!pauseMatch) {
    fail(`§48: the "practice-batch-pause" state in ${file} no longer carries an { answer: N } step, so nothing drives it to the pause. Re-derive the recipe rather than leaving this green.`);
  } else if (pauseMatch[1] !== batchMatch[1]) {
    fail(`§48: "practice-batch-pause" answers ${pauseMatch[1]} question(s) but src/screens/Practice.jsx sets BATCH_SIZE = ${batchMatch[1]}. The recipe will miss the pause it exists to reach — it reports MISSED rather than a false clean, but fix the number.`);
  } else if (leakyStates.length > 0) {
    fail(`§48: the no-reload state(s) ${leakyStates.map((n) => `"${n}"`).join(", ")} answer a question ({ answer: N } or { radio: N }), which writes ecycles_review. runAll() and sweepLangs() run the no-reload set in ONE page session — sweepLangs runs it once per language — so this changes the screen every LATER state sweeps, and the same state in every later language, while every row still reports "ok". Mark it \`reload: true\` (with \`clear\`) so it runs behind begin()/finish() instead of in the shared session.`);
  } else if (appKeys.length === 0 || covered.size === 0) {
    fail("§48(e): could not read src/lib/storage.js's KEYS or a11y-states.js's WARM_FIXTURE/FIXTURE_EXCLUDES. This check is pointed at a structure that no longer exists — repoint it rather than leaving it green.");
  } else if (uncoveredKeys.length > 0) {
    fail(`§48(e): src/lib/storage.js persists ${uncoveredKeys.join(", ")}, which A11yStates' WARM_FIXTURE does not set and FIXTURE_EXCLUDES does not name. The storage audit decides which states need a \`requires\` declaration by diffing each screen cold against that fixture, so a key it never sets is a key no screen is measured against — every screen reading it comes back "provably storage-independent". Add it to WARM_FIXTURE (with a shape its reader in storage.js actually accepts), or name it in FIXTURE_EXCLUDES with why.`);
  } else {
    console.log(`  §48 a11y state matrix: ${names.length} state(s), each with an \`arrived\` assertion; the ${Object.keys(REGRESSION_STATES).length} regression states are present, practice-batch-pause answers ${pauseMatch[1]} to Practice.jsx's BATCH_SIZE = ${batchMatch[1]}, ${entrySplit.length - leakyStates.length} of ${entrySplit.length} state(s) keep the no-reload set side-effect-free, and all ${appKeys.length} persisted key(s) are covered by the storage audit's fixture (${appKeys.length - excludedCount} set, ${excludedCount} explicitly excluded). (Static — only A11yStates.runAll()'s \`missed\`/\`preconditionFailed\` counts and auditFinish()'s \`gaps\` can say whether a recipe still arrives, in the storage it declares.)`);
  }
}

// §49. No recipe in the a11y state matrix selects or asserts on hardcoded English (item 113).
//
// WHY THIS IS A CHECK AND NOT A STYLE NOTE. scripts/a11y-states.js is swept in five languages.
// Its first version matched every control and every assertion by its ENGLISH display text —
// "Glossary", "Market Dashboard", "Kids", "About", "Practice all questions" — and item 112
// measured what that costs the moment the language axis is switched on: 12 of 13 states became
// unreachable in `es`, and the same 12 in `ko`. Nothing errored. A text-matched recipe is a
// monolingual recipe, and the four non-English rows of a sweep are exactly where nobody is
// looking when the numbers come back clean.
//
// The states were rescued only because each carries an arrival assertion, which turned 48 wrong
// sweeps into 48 honest MISSEDs instead of "5 languages, 65 states, all clean". That is a second
// line of defense, not a first: a state added tomorrow WITHOUT an assertion (which §48 catches)
// and WITH an English selector (which nothing catches) reports a clean zero for a screen it never
// reached. This section is the first line — it catches the English string at commit time rather
// than at sweep time.
//
// THE LEGITIMATE SELECTORS, and this is the whole list: element ids (`clickId`, getElementById),
// structural position (`menuItem`, `firstButton`, `lastButton`, `termRow`, `radio`), ARIA roles
// and states, numerals (`aria-label="130%"` — digits do not translate), and labels READ FROM THE
// APP at runtime (`h1IsLastLabel`, `headingIsLastLabel`, which compare the sub-screen's <h1>
// against the row's own text, so both sides are in whatever language is loaded). `dismissDialog`
// takes no label at all. What is banned is a literal string of DISPLAY TEXT.
//
// WHAT IS DELIBERATELY NOT BANNED: `name`, `note` and `says` are English prose in every state and
// must stay that way — they are what a human reads in the run log, and none of them is fed to a
// selector. So this section cannot be "no English in the matrix"; it is pointed at the call sites
// where a string becomes a SELECTOR.
//
// WHAT THIS CANNOT SEE: it reads source. It cannot tell whether a recipe still ARRIVES — only
// A11yStates.runAll()'s `missed` count can — and it cannot see a label built at runtime out of
// English fragments. It catches the shape that actually shipped and had to be fixed.
{
  const file = "scripts/a11y-states.js";
  const raw = readFileSync(file, "utf8");
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, "")          // the header and this section's own reasoning
    .replace(/^\s*\/\/.*$/gm, "");             // quote English control names on purpose

  // The three ways a string can become a selector in this file. Each carries a SAMPLE it must
  // match — see the fixture control below.
  const DETECTORS = [
    {
      what: "a text-matching step",
      re: /\b(click|clickExact|clickIfPresent)\s*:\s*(["'])((?:\\.|(?!\2).)*)\2/g,
      sample: 'steps: [{ click: "Glossary" }]',
    },
    {
      what: "a text-matching assertion",
      re: /\b(hasHeading|byText)\s*\(\s*(["'])((?:\\.|(?!\2).)*)\2/g,
      sample: 'is: function () { return hasHeading("Market Dashboard"); }',
    },
    {
      what: "a comparison against rendered text",
      re: /(mainText\(\)|innerText|textContent)\s*(?:\.\s*(?:indexOf|includes|search|match|startsWith|endsWith)\s*\(\s*|[!=]==?\s*)(["'])((?:\\.|(?!\2).)*)\2/g,
      sample: 'return mainText().indexOf("Start Quiz") !== -1;',
    },
  ];

  // Digits, percent signs and separators are language-independent — `clickExact: "130%"` is a
  // legitimate selector and the font-scale controls are labeled exactly that way.
  const isNumeric = (s) => /^[\d\s.,%/:-]+$/.test(s);

  // A hit is exempt when it belongs to one of the two `__selftest_*` states, which reference
  // strings that exist in no language on purpose (they prove the MISSED path fires). Ownership is
  // the nearest preceding `name:` — the same local rule §48 uses to slice this file.
  const ownerOf = (i) => {
    const j = src.lastIndexOf("name:", i);
    if (j === -1) return null;
    const m = src.slice(j, j + 120).match(/name:\s*"([^"]*)"/);
    return m ? m[1] : null;
  };

  const scan = (re, text) => [...text.matchAll(new RegExp(re.source, re.flags))];

  // Fixture control, the §44 shape: a detector whose regex an edit has quietly broken finds
  // nothing and reports a clean file. Each one must first fire on its own sample.
  const blind = DETECTORS.filter((d) => scan(d.re, d.sample).length === 0).map((d) => d.what);

  const offenders = [];
  let exempted = 0;
  for (const d of DETECTORS) {
    for (const m of scan(d.re, src)) {
      const literal = m[3];
      const owner = ownerOf(m.index);
      if (owner && owner.startsWith("__selftest_")) { exempted += 1; continue; }
      if (isNumeric(literal)) continue;
      offenders.push(`${d.what} ${JSON.stringify(literal)} in state "${owner || "(outside any state)"}"`);
    }
  }

  const hasStates = /var STATES = \[\s*\{/.test(src);
  const hasSweepLangs = /\bsweepLangs\s*:/.test(src);

  if (!hasStates) {
    fail(`§49: could not find a populated \`var STATES = [\` array in ${file}. This section is pointed at a structure that no longer exists — repoint it rather than leaving it green.`);
  } else if (!hasSweepLangs) {
    fail(`§49: ${file} no longer exposes \`sweepLangs\`, so nothing sweeps the matrix in more than one language. This section exists to protect the four non-English rows of that sweep; with the language axis gone it is guarding nothing, and a green result here would say the opposite. Re-derive it rather than leaving it green.`);
  } else if (blind.length > 0) {
    fail(`§49: ${blind.length} of ${DETECTORS.length} detector(s) did not match their own sample — ${blind.join("; ")}. The regex has been broken by an edit, so a clean result from this section means nothing. Fix the detector before trusting the zero.`);
  } else if (exempted < 2) {
    fail(`§49: found ${exempted} exempt hit(s) in the \`__selftest_*\` states, expected 2 (\`__selftest_badstep\`'s { click: "ZZ_NO_SUCH_CONTROL_ZZ" } and \`__selftest_unreachable\`'s hasHeading("ZZ_NO_SUCH_HEADING_ZZ")). Those two are this section's live control: they are the only text-matching call sites the file is allowed to contain, and if the scan cannot see them it cannot see a real one either. Either the selftest was changed — in which case update this count and say why — or the scan is not reaching the file.`);
  } else if (offenders.length > 0) {
    fail(`§49: ${offenders.length} recipe(s) in ${file} select or assert on hardcoded display text — ${offenders.join("; ")}. A text-matched recipe is a monolingual recipe: item 112 measured this exact shape making 12 of 13 states unreachable in \`es\` and again in \`ko\`, and only the arrival assertions kept it from reporting 48 false cleans. Select by id, position, ARIA, numerals, or a label read from the app at runtime (h1IsLastLabel / headingIsLastLabel) instead.`);
  } else {
    console.log(`  §49 a11y recipes are language-independent: ${DETECTORS.length} detectors, each proven against its own sample, find 0 hardcoded-text selectors in ${file} outside the ${exempted} deliberate \`__selftest_*\` ones. (Static — it reads the call sites, not the sweep; only A11yStates.sweepLangs()'s per-language \`missed\` count can say a recipe still arrives in every language.)`);
  }
}

// 50. src/content/moneyVisuals.js — lesson 23's preference-flip figure
//     (backlog item 27, added 2026-08-27). Like §21 above, this checks the
//     CLAIM THE DIAGRAM MAKES, not that the numbers parse.
//
//     What makes this figure different from the other four, and why it needs
//     its own section: the others compare two quantities, and a broken one
//     draws a wrong comparison. This one plots a REVERSAL, so a broken one
//     draws no reversal at all — two curves that never cross, under a caption
//     and a dashed marker that both still say "the answer flips". That failure
//     is invisible by inspection at the sizes this renders at, because the
//     curves are near-coincident for four fifths of the span by construction.
//
//     The crossing is also SOLVED in closed form rather than read off the
//     sampled points, and the first version of that algebra shipped wrong in
//     the same session — it put the marker at month 6.67 when the sampled
//     values bracket the reversal between months 9 and 10. Nothing on screen
//     would have said so. So the solved value is checked against the sampled
//     curves here, which is a genuinely independent path to the same number.
{
  const mv = moneyVisualsContent;
  const need = [
    "flipRewards", "flipDiscountK", "flipMonths", "flipValue", "flipSeries", "flipCrossing",
    "flipTitle", "flipSeriesLabels", "flipAxisLabels", "flipZoneLabels", "flipMarkerLabel",
    "flipCaption", "flipDescription", "flipYNorm",
  ];
  const missing = need.filter((k) => mv[k] === undefined);
  if (missing.length > 0) {
    fail(`§50: src/content/moneyVisuals.js no longer exports ${missing.join(", ")}. This section is pointed at a structure that no longer exists — repoint it rather than leaving it green.`);
  } else {
    const { sooner: s, later: l } = mv.flipRewards;
    const k = mv.flipDiscountK;
    const gap = l.month - s.month;
    const V = mv.flipValue;

    // (a) The figure must still be the lesson's own worked example. Lesson 23
    //     states $50-vs-$65 one month apart; a figure with different numbers
    //     gives the reader a second lesson to reconcile (the rule the whole
    //     file's header sets out).
    if (s.amount !== 50 || l.amount !== 65) {
      fail(`§50: flipRewards is ${s.amount}/${l.amount}; lesson 23's body works through $50 and $65. Change the lesson and the figure together or not at all.`);
    }
    if (gap !== 1) {
      fail(`§50: the two rewards are ${gap} month(s) apart; lesson 23's entire point is that the SAME one extra month of waiting gets two different answers.`);
    }
    if (!(l.amount > s.amount && l.month > s.month)) {
      fail(`§50: the "later" reward must be both larger and later (${l.amount} at month ${l.month} vs ${s.amount} at month ${s.month}) — otherwise there is no trade-off to reverse.`);
    }

    // (b) The discount rate must clear the bound the lesson's OWN first
    //     scenario implies. Preferring $50 now over $65 in a month means
    //     50 > 65/(1+k*gap), i.e. k > (65-50)/(50*gap) = 0.3. Below it the
    //     curves never cross and the lesson's opening paragraph describes
    //     something this chart says cannot happen.
    const kMin = (l.amount - s.amount) / (s.amount * gap);
    if (!(k > kMin)) {
      fail(`§50: flipDiscountK is ${k}, at or below the ${kMin} that lesson 23's first scenario requires. At this rate the preference never reverses, so the figure's marker, its two tinted zones and its caption would all be describing a crossing that is not in the data.`);
    }

    // (c) Both of the lesson's stated preferences, read straight off the curve
    //     the chart draws. These are the two paragraphs of the lesson, and they
    //     are the two ends of the x-axis.
    const farS = V(s.amount, s.month, 0);
    const farL = V(l.amount, l.month, 0);
    if (!(farL > farS)) {
      fail(`§50: at the left edge (both rewards a year out) the figure makes the $${s.amount} feel worth ${farS.toFixed(2)} against the $${l.amount}'s ${farL.toFixed(2)}. Lesson 23 says people pick the $${l.amount} here.`);
    }
    const nearS = V(s.amount, s.month, s.month);
    const nearL = V(l.amount, l.month, s.month);
    if (!(nearS > nearL)) {
      fail(`§50: at the right edge (the $${s.amount} available today) the figure makes it feel worth ${nearS.toFixed(2)} against the $${l.amount}'s ${nearL.toFixed(2)}. Lesson 23 says people pick the $${s.amount} here.`);
    }

    // (d) EXACTLY ONE reversal across the span. Two crossings would put the
    //     single dashed marker on one of them and silently disown the other.
    const STEPS = 480;
    let sign = null;
    let flips = 0;
    let sampledCrossing = null;
    for (let i = 0; i <= STEPS; i += 1) {
      const t = (i / STEPS) * s.month;
      const d = V(l.amount, l.month, t) - V(s.amount, s.month, t);
      const cur = Math.sign(d);
      if (cur === 0) continue;
      if (sign !== null && cur !== sign) { flips += 1; sampledCrossing = t; }
      sign = cur;
    }
    if (flips !== 1) {
      fail(`§50: the two perceived-value curves change order ${flips} time(s) across the plotted span, not once. The figure draws one dashed marker and two tinted zones, which can only describe a single reversal.`);
    }

    // (e) The SOLVED crossing agrees with the SAMPLED one, and the two
    //     perceived values really are equal there. This is the check that would
    //     have caught the wrong closed form: the sampling never touches
    //     flipCrossing()'s algebra, so agreeing to within one sample step is
    //     independent evidence and not a restatement.
    const solved = mv.flipCrossing();
    const tol = s.month / STEPS;
    if (sampledCrossing === null || Math.abs(solved - sampledCrossing) > tol * 2) {
      fail(`§50: flipCrossing() returns month ${Number(solved).toFixed(3)}, but sampling the curves puts the reversal at month ${sampledCrossing === null ? "(none found)" : sampledCrossing.toFixed(3)}. The dashed marker and the boundary between the two tinted zones are both drawn from the solved value, so they would sit where nothing happens.`);
    }
    const eqS = V(s.amount, s.month, solved);
    const eqL = V(l.amount, l.month, solved);
    if (Math.abs(eqS - eqL) > 1e-9) {
      fail(`§50: at the solved crossing (month ${Number(solved).toFixed(3)}) the two options are worth ${eqS.toFixed(6)} and ${eqL.toFixed(6)}. The crossing is defined as the point where they are equal.`);
    }

    // (f) The crossing has to be DRAWABLE. It is late by construction — these
    //     amounts cap it at gap*l.amount/(l.amount-s.amount) months before the
    //     sooner reward, about 4.3 here — but if an edit pushes it against
    //     either edge the marker label collides with the axis label and one
    //     tinted zone becomes a sliver the zone key still names.
    const frac = solved / s.month;
    if (!(frac > 0.05 && frac < 0.95)) {
      fail(`§50: the crossing sits ${(frac * 100).toFixed(1)}% along the x-axis. Below 5% or above 95% the dashed marker and one of the two tinted zones cannot be read at the width this renders at.`);
    }

    // (g) The sampled polylines must visibly cross — the reversal has to fall
    //     between two plotted months, not between the last point and the edge.
    const months = mv.flipMonths;
    if (months[0] !== 0 || months[months.length - 1] !== s.month) {
      fail(`§50: flipMonths runs ${months[0]}..${months[months.length - 1]}; it must run 0..${s.month} so the two ends of the axis are lesson 23's two scenarios.`);
    }
    if (!months.every((m, i) => i === 0 || m > months[i - 1])) {
      fail(`§50: flipMonths must ascend — the polyline is drawn in array order and would fold back on itself.`);
    }
    const series = mv.flipSeries();
    const before = months.findIndex((m) => m > solved);
    if (before <= 0) {
      fail(`§50: no sampled month sits after the crossing at ${Number(solved).toFixed(3)}, so the drawn polylines cannot show the reversal the marker points at.`);
    } else {
      const iLo = before - 1;
      const iHi = before;
      const lowerOk = series[1].values[iLo] > series[0].values[iLo];
      const upperOk = series[0].values[iHi] > series[1].values[iHi];
      if (!lowerOk || !upperOk) {
        fail(`§50: the sampled months bracketing the crossing (${months[iLo]} and ${months[iHi]}) do not show the $${l.amount} curve on top and then the $${s.amount} curve on top. Whatever the marker says, the drawn lines do not cross there.`);
      }
    }

    // (i) THE Y-SCALE HAS TO SEPARATE THE TWO CURVES WHERE THE CAPTION SPEAKS.
    //     (g) above proves the ORDER at the samples bracketing the crossing.
    //     That is not the same question as whether a reader can SEE the order,
    //     and for four days it did not: on the linear axis this figure shipped
    //     with, the left edge put the curves 1.64px apart under a 2.58px
    //     stroke, so the two strokes overlapped and the picture showed one
    //     line across the whole stretch the caption calls "the $65 is simply
    //     the better deal" (backlog item 137, found by `a11y-sweep.js`'s
    //     `preferenceFlip` claim in a live render).
    //
    //     What is asserted, and why in these units. `flipYNorm` returns a 0..1
    //     position within the plot, so the separation below is a FRACTION OF
    //     PLOT HEIGHT and this check needs none of the component's pixels.
    //     `PreferenceFlip` draws a plot 100 user units tall with a 2.5-unit
    //     stroke, i.e. the stroke is exactly 2.5% of plot height at every
    //     scale the figure is ever drawn at — both scale with the viewBox — so
    //     the 5% floor here is two stroke widths, and the live probe's own
    //     one-stroke-width rule cannot fail while this passes.
    //
    //     ONLY THE TWO EDGES, deliberately. They are lesson 23's own two
    //     scenarios, named on the axis, and they are where the caption's claim
    //     is strongest. Nothing is asserted near the crossing, where the
    //     curves MUST converge — a blanket "always separated" rule would
    //     contradict the figure's entire point.
    const MIN_EDGE_SEP = 0.05;
    if (typeof mv.flipYNorm !== "function") {
      fail(`§50: flipYNorm is not a function. The component maps values to pixels through it, so without it the figure has no y-scale.`);
    } else {
      const seriesY = mv.flipSeries();
      const edges = [[0, "left", "both rewards a year out", 1], [months.length - 1, "right", "the $" + s.amount + " available today", 0]];
      for (const [idx, side, scenario, higher] of edges) {
        const sep = Math.abs(mv.flipYNorm(seriesY[0].values[idx]) - mv.flipYNorm(seriesY[1].values[idx]));
        if (!(sep >= MIN_EDGE_SEP)) {
          fail(`§50: at the ${side} edge (${scenario}) the y-scale puts the two curves ${(sep * 100).toFixed(2)}% of the plot height apart, under the ${(MIN_EDGE_SEP * 100).toFixed(0)}% floor. The stroke is 2.5% of plot height, so at this separation the two strokes overlap and the figure draws one line where the caption says the $${higher === 1 ? l.amount : s.amount} is the better deal.`);
        }
      }
      // The scale must not reorder anything (g) proved: a y-scale is allowed to
      // stretch this figure, never to change which curve is on top. Checked at
      // every sampled month rather than at the edges, because a non-monotone
      // transform can invert in the middle and leave both ends correct.
      for (let i = 0; i < months.length; i++) {
        const rawOrder = Math.sign(seriesY[1].values[i] - seriesY[0].values[i]);
        const drawnOrder = Math.sign(mv.flipYNorm(seriesY[1].values[i]) - mv.flipYNorm(seriesY[0].values[i]));
        if (rawOrder !== drawnOrder) {
          fail(`§50: at month ${months[i]} the y-scale draws the two curves in the opposite order to the arithmetic. A y-scale may stretch this figure; it may not decide which option is worth more.`);
        }
      }
    }

    // (h) Five-language parity for every label the figure renders, including
    //     the text alternative — the `role="img"` container makes `description`
    //     the only thing a screen-reader user gets (§22's rule).
    for (const key of ["flipTitle", "flipSeriesLabels", "flipAxisLabels", "flipZoneLabels", "flipMarkerLabel", "flipCaption", "flipDescription"]) {
      for (const lang of LANGS) {
        const v = mv[key][lang];
        const empty = v === undefined || v === null || (Array.isArray(v) ? v.length !== 2 || v.some((x) => !String(x).trim()) : !String(v).trim());
        if (empty) fail(`§50: ${key}.${lang} is missing or incomplete. Every one of these renders on screen in that language, and flipDescription is the figure's only text alternative.`);
      }
    }

    if (failures === 0) {
      console.log(`  §50 lesson 23's preference flip holds: $${s.amount}@${s.month}mo vs $${l.amount}@${l.month}mo at k=${k} (> the ${kMin} the lesson requires) reverses exactly once, at month ${Number(solved).toFixed(3)} — solved and sampled agree, both options worth $${eqS.toFixed(2)} there — and both of the lesson's stated choices fall out of the curve.`);
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 51. `--line-*` USED AS A GRAPHIC — the class §28 and §28b both exclude.
//
//     Backlog item 123. §28 pairs `--ink-*`/`--fill-*` against the surfaces;
//     §28b pairs `--graph-*` against them at 1.4.11's 3:1. Both filter by
//     prefix, so `--line-*` is checked by NEITHER, on the stated grounds that
//     a line "is not text" — which is true, and is not the same as "is not a
//     graphic". A line that carries meaning owes 3:1 exactly as a chart series
//     does, and until this section existed nothing in `npm test` would have
//     said so, while `DECISIONS.md` advertised "zero exemptions" over a set
//     that never included it.
//
//     TWO REAL INSTANCES WERE SHIPPING when this was written, both found by
//     measurement rather than suspicion, both fixed in the same commit:
//     `AsymmetryChart`'s shared zero line (the bars ARE their distance from
//     it) and `CycleChart`'s long-run trend line (`trendLabel` is drawn
//     beneath it and names it). Both were `line.strong` — 1.71:1 light,
//     1.62:1 dark on `surface.card` — and both are now `graph.neutral`.
//     A third, lesson 23's crossing marker, was caught live a run earlier.
//
//     51a is the PREMISE and 51b is the RULE, and 51a exists so the rule
//     cannot outlive its own justification: no `--line-*` token clears 3:1
//     against ANY surface in either palette today, so a meaningful use is a
//     defect BY CONSTRUCTION and no shade of the token could fix it. If a
//     future palette edit darkens them, 51a fails and tells whoever did it to
//     re-decide 51b rather than leaving a prohibition nobody can re-derive.
//
//     ⛔ WHAT 51b CANNOT SEE, stated because a guard's blind spot is exactly
//     what the next run will assume it covers. It matches SVG paint attributes
//     (`stroke={line.x}` / `fill={line.x}`). `AsymmetryChart`'s zero line was
//     NOT one of those — it is a `borderTop` on a positioned `<div>`, which is
//     lexically identical to the card borders that are correctly decorative.
//     That instance was found by reading the file, and a future one drawn the
//     same way would be found the same way. Distinguishing "a border that
//     frames a box" from "a border that IS the plot's datum line" needs layout
//     context this scanner does not have; widening the pattern to `border*`
//     would fail on ~50 correct card and separator borders. The register below
//     is therefore complete for painted SVG only.
// ─────────────────────────────────────────────────────────────────────────────
{
  const cssPath = join(ROOT, "src", "index.css");
  const cssSrc = readFileSync(cssPath, "utf8");
  const GRAPHIC_MIN = 3;

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

  // SELF-TEST. 51a asserts that numbers are SMALL, which is the opposite
  // direction from §28/§28b — so a broken luminance formula that collapses
  // everything toward 1:1 would read as a pass on every pair at once here,
  // just as one that inflated everything would there. Both bounds are pinned.
  const selfTests = [
    ["#000000", "#ffffff", 21],
    ["#777777", "#ffffff", 4.48],
    ["#ffffff", "#ffffff", 1],
  ];
  for (const [a, b, expected] of selfTests) {
    const got = contrast(a, b);
    if (Math.abs(got - expected) > 0.02) {
      fail(
        `§51: the contrast function failed its own self-test — ${a} on ${b} computed as ` +
          `${got.toFixed(2)}:1, but WCAG 2.1 puts it at ${expected}:1. Every figure below is wrong; fix ` +
          `the formula before reading any of them.`,
      );
    }
  }

  const parsePalette = (block) => {
    const out = {};
    for (const m of block.matchAll(/(--(?:line|surface)-[a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2].toLowerCase();
    return out;
  };
  const lightBlock = cssSrc.slice(cssSrc.indexOf(":root {"), cssSrc.indexOf("@media (prefers-color-scheme: dark)"));
  const darkStart = cssSrc.indexOf(':root[data-theme="dark"]');
  const darkBlock = cssSrc.slice(darkStart, cssSrc.indexOf("}", cssSrc.indexOf("--shadow-lifted", darkStart)));

  let premisePairs = 0;
  let worstLine = { ratio: 0 };
  for (const [label, block] of [["light", lightBlock], ["dark", darkBlock]]) {
    const palette = parsePalette(block);
    const lines = Object.keys(palette).filter((k) => k.startsWith("--line-"));
    const surfaces = Object.keys(palette).filter((k) => k.startsWith("--surface-"));

    // The scan must be proven to have found something. A regex broken by a
    // palette edit yields zero pairs, and "no line token clears 3:1" is
    // trivially true of the empty set — the exact shape of silent pass this
    // repo has been bitten by before.
    if (lines.length < 2 || surfaces.length < 7) {
      fail(
        `§51a: parsed only ${lines.length} line token(s) and ${surfaces.length} surface(s) from the ` +
          `${label} palette in src/index.css (expected at least 2 and 7). The scan matched almost ` +
          `nothing, so its "all below ${GRAPHIC_MIN}:1" result is about the empty set, not about the palette.`,
      );
      continue;
    }

    for (const l of lines) {
      for (const s of surfaces) {
        const r = contrast(palette[l], palette[s]);
        premisePairs++;
        if (r > worstLine.ratio) worstLine = { ratio: r, label, l, s };
        if (r >= GRAPHIC_MIN) {
          fail(
            `§51a: ${label} ${l} (${palette[l]}) on ${s} (${palette[s]}) is now ${r.toFixed(2)}:1 and ` +
              `clears WCAG 1.4.11's ${GRAPHIC_MIN}:1. That is not a failure of the palette — it invalidates ` +
              `the PREMISE of §51b, which forbids painting a meaningful graphic with a line token on the ` +
              `grounds that no shade of one can ever be visible enough. Re-decide the rule (a line token ` +
              `that clears 3:1 may legitimately draw a datum line) and update this section's header, ` +
              `rather than deleting the check.`,
          );
        }
      }
    }
  }

  // ── 51b: the call-site register ──
  // Every SVG paint of a `line.*` token in src/ must appear here with a reason
  // it is decorative under 1.4.11. This is a COMPLETE enumeration, not an
  // exemption list: an unregistered use fails, so adding a line to a chart is
  // a deliberate act rather than a default. `anchor` is matched as a substring
  // of the source line, and an entry matching nothing fails as stale — the
  // same staleness contract §28b's GRAPH_EXEMPT carries.
  const LINE_SVG_DECORATIVE = [
    [
      "src/components/charts.jsx",
      'x1="10" y1="70" x2="130" y2="70"',
      "YieldCurve's x-axis. The figure plots no scale — the message is the curve's SHAPE, and the three maturities are given as text (2Y/10Y/30Y). Removing the rule loses nothing readable.",
    ],
    [
      "src/components/charts.jsx",
      'x1="10" y1="5" x2="10" y2="70"',
      "YieldCurve's y-axis. Same figure, same argument: no value scale is drawn against it, so it frames the plot rather than measuring it.",
    ],
    [
      "src/components/charts.jsx",
      "x1={CURVE_PAD.left} y1={py(0)}",
      "GrowthCurve's baseline. What the figure claims is that one curve pulls away from the OTHER; the comparison is series-to-series and the two endpoint values are printed as text. The curves never approach the baseline, so it is a frame, not the reference being read.",
    ],
    [
      "src/components/charts.jsx",
      'strokeWidth="0.5" strokeDasharray="3"',
      "GrowthCurve's interior gridlines. Supporting rules behind the data; every value they would help estimate is either an endpoint dot or printed as text.",
    ],
    [
      "src/components/charts.jsx",
      "x1={FLIP_PAD.left} y1={floorY}",
      "PreferenceFlip's baseline. The figure's message is the CROSSING, which is carried by the ink.muted marker and the two zone bands — deliberately not by this line. See the measured note at that marker. (Repointed 2026-08-28 with item 137's log y-scale: the line is drawn at the same pixel, but `py(0)` is undefined on that scale, so it is now the plot floor by name. This entry catching the move is what it is for.)",
    ],
  ];

  const svgPaintRe = /(?:stroke|fill)=\{line\.[a-zA-Z]+\}/;
  const scanRoots = [join(ROOT, "src")];
  const jsxFiles = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".jsx") || e.name.endsWith(".js")) jsxFiles.push(p);
    }
  };
  for (const r of scanRoots) walk(r);

  // Control: the scanner must be able to see the uses that ARE there. If the
  // regex stops matching, `found` is empty, every register entry reads as
  // stale AND no unregistered use is reported — a double-negative that looks
  // like a clean sweep. Assert a floor derived from the register itself.
  const found = [];
  for (const f of jsxFiles) {
    const rel = f.slice(ROOT.length + 1);
    readFileSync(f, "utf8").split("\n").forEach((text, i) => {
      if (svgPaintRe.test(text)) found.push({ rel, lineNo: i + 1, text });
    });
  }
  if (found.length < LINE_SVG_DECORATIVE.length) {
    fail(
      `§51b: the scanner found ${found.length} SVG paint(s) of a line token across ${jsxFiles.length} ` +
        `file(s), fewer than the ${LINE_SVG_DECORATIVE.length} the register already accounts for. Either the ` +
        `regex no longer matches the code, or entries were removed without deleting them here. A zero ` +
        `here is not a clean result — it is a blind scanner.`,
    );
  }

  const usedEntries = new Set();
  for (const use of found) {
    const idx = LINE_SVG_DECORATIVE.findIndex(([file, anchor]) => file === use.rel && use.text.includes(anchor));
    if (idx === -1) {
      fail(
        `§51b: ${use.rel}:${use.lineNo} paints an SVG element with a \`line.*\` token and is not in ` +
          `LINE_SVG_DECORATIVE. No line token clears ${GRAPHIC_MIN}:1 against any surface (worst case ` +
          `${worstLine.ratio.toFixed(2)}:1, §51a), so if this line carries meaning — a datum, a reference the ` +
          `caption names, anything the reader has to FIND — it fails WCAG 1.4.11 and no shade of the token ` +
          `fixes it; use \`graph.*\`, which §28b holds to 3:1. If it is genuinely decoration, add it here ` +
          `with the reason.\n      ${use.text.trim()}`,
      );
    } else {
      usedEntries.add(idx);
    }
  }
  for (let i = 0; i < LINE_SVG_DECORATIVE.length; i++) {
    if (!usedEntries.has(i)) {
      const [file, anchor] = LINE_SVG_DECORATIVE[i];
      fail(
        `§51b: LINE_SVG_DECORATIVE entry ${i} (${file}, "${anchor}") matches nothing in the tree. The code ` +
          `moved and the classification did not. Delete the entry or repoint it — a stale register makes the ` +
          `next real use look accounted for.`,
      );
    }
  }

  if (failures === 0) {
    console.log(
      `  §51 line-token graphics: ${premisePairs} line x surface pairs all below ${GRAPHIC_MIN}:1 ` +
        `(worst ${worstLine.ratio.toFixed(2)}:1, ${worstLine.label} ${worstLine.l} on ${worstLine.s}), so ` +
        `${found.length} SVG line-token paint(s) are each classified decorative in LINE_SVG_DECORATIVE`,
    );
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// §52. A palette hex quoted in LIVING text must match the token it names.
//
// Filed as item 125. On 2026-08-27 a run computed its predicted contrast
// figures from `#7c8494`, taken from backlog item 63's headline rather than
// from src/index.css, and wrote them into two shipped charts.jsx comments. The
// palette was right all along; the 2026-08-23 warm repaint had moved the
// token four days earlier and nobody re-read the headline. A live DOM
// measurement caught it. This section is so the next one is caught by
// `npm test` instead of by luck. (The current value is deliberately not
// quoted here either — that is the whole point. Read src/index.css.)
//
// THE RULE: a hex quoted in this repo's living prose is a dated observation,
// not the palette. Where the prose also names the token, the two must agree.
//
// WHAT "LIVING" MEANS, and why the run log is deliberately out of scope.
// AGENT_LOG.md's run log and AGENT_LOG.archive.md are dated records; §31 and
// item 91 both hold that rewriting a dated record falsifies it, and an entry
// that says "measured 3.76:1 at #7c8494" was *true when written*. Those are
// history. What this section guards is the text a future run READS TO ORIENT
// — the App summary, the backlog, the Environment note, the standing docs,
// and every comment in src/. Item 125's defect was in a backlog headline,
// which is exactly the half that has to be current.
//
// scripts/ IS ALSO OUT OF SCOPE, and this is a judgment worth stating. The
// only palette attributions there live in THIS file, and they are probe data
// and failure-message templates rather than claims about the palette — the
// positive control below must literally contain the stale hex to prove the
// scanner fires. Policing them would take four or five register entries for a
// file that is the checker. Measured before deciding: extending the scan to
// scripts/ finds exactly two other lines, both the "other side of the pair"
// false positive already registered below. THE COST OF THIS BOUNDARY: a stale
// attribution written into a scripts/ comment is invisible. This section's own
// first draft did exactly that, and the step-5 self-check caught it; the fix
// was to stop quoting the value, not to widen the net.
//
// SCOPE HONESTY: this catches a hex that shares a LINE with the token it
// misattributes. A hex whose token is named a paragraph away, or referred to
// only as "the amber", is invisible to it. That is a narrower net than item
// 125 imagined and it is stated rather than implied — the sweep that filed
// this section found exactly ONE real defect across all of living text (and
// three false positives, of which two are registered below and the third was
// item 125's own text, since rewritten). The register is small because the
// corpus is clean, not because the net is loose. Residual: item 126.
// ─────────────────────────────────────────────────────────────────────────────
{
  const cssSrc = readFileSync(join(ROOT, "src", "index.css"), "utf8");

  // Same slicing as §51 rather than a mode-tracking regex. This is not a style
  // preference: the dark block's selector is `:root:not([data-theme="light"])`,
  // so a scanner that flips mode on `[data-theme="light"]` reads the dark
  // values into the light palette and every downstream comparison is wrong
  // while looking completely normal. That happened while this section was
  // being written; §52a below is the assertion that would have caught it.
  const sliceBlock = (start, end) => cssSrc.slice(start, end);
  const lightBlock = sliceBlock(cssSrc.indexOf(":root {"), cssSrc.indexOf("@media (prefers-color-scheme: dark)"));
  const darkStart = cssSrc.indexOf(':root[data-theme="dark"]');
  const darkBlock = sliceBlock(darkStart, cssSrc.indexOf("}", cssSrc.indexOf("--shadow-lifted", darkStart)));
  const parseAll = (block) => {
    const out = new Map();
    for (const m of block.matchAll(/^\s*(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/gm)) out.set(m[1], m[2].toLowerCase());
    return out;
  };
  const lightPalette = parseAll(lightBlock);
  const darkPalette = parseAll(darkBlock);

  // §52a — THE PARSE CONTROL. Everything below is a comparison against these
  // two maps, so a mis-sliced palette makes every result meaningless in a way
  // that reads as a clean pass. Two independent assertions: the maps are the
  // expected size, and they are DIFFERENT from each other. The second is the
  // one that matters — the real failure mode was light silently holding the
  // dark values, which a size check passes with flying colors.
  const MIN_TOKENS = 20;
  let identical = 0;
  for (const [t, v] of lightPalette) if (darkPalette.get(t) === v) identical++;
  if (lightPalette.size < MIN_TOKENS || darkPalette.size < MIN_TOKENS) {
    fail(
      `§52a: parsed ${lightPalette.size} light and ${darkPalette.size} dark token(s) from src/index.css ` +
        `(expected at least ${MIN_TOKENS} each). The palette slicing matched almost nothing, so every ` +
        `attribution checked below is being compared against an empty map and would pass regardless.`,
    );
  } else if (identical > 2) {
    fail(
      `§52a: ${identical} token(s) hold the SAME value in the light and dark palettes. The two blocks are a ` +
        `light/dark pair; this means the slicing read one block twice — almost certainly the dark block into ` +
        `both, since its selector is \`:root:not([data-theme="light"])\`. Fix the slicing before trusting §52b.`,
    );
  }

  // The complete register of token x hex co-occurrences in living text that
  // are CORRECT despite not matching. Anchored by text, never by line number
  // (item 73's standing method: LAUNCH_PLAN.md:529 was line 549 a day later).
  // An entry is [file, anchor substring, reason].
  const HEX_ATTRIBUTION_OK = [
    [
      "AGENT_LOG.md",
      "manufactures a 1.0:1",
      "The hex belongs to `--ink-on-fill` (named on the line above); `--surface-canvas` is the OTHER " +
        "side of the pair being argued about. `--ink-on-fill` really is #ffffff in light mode.",
    ],
    [
      "src/content/lessons.js",
      "is not a stale copy of",
      "The comment exists to argue that lesson 32's decorative accent is NOT this token — item 75 " +
        "assumed it was. It is flagged precisely because it says the two differ, which is its point.",
    ],
  ];

  const logLines = readFileSync(join(ROOT, "AGENT_LOG.md"), "utf8").split("\n");
  const runLogAt = logLines.findIndex((l) => /^## Run log\s*$/.test(l));
  if (runLogAt === -1) {
    fail(
      `§52b: could not find the "## Run log" heading in AGENT_LOG.md. That heading is what separates the ` +
        `living backlog from the dated entries; without it this section would either scan nothing or scan ` +
        `the entire history. Restore the heading rather than loosening the match.`,
    );
  }

  const livingDocs = [
    ["AGENT_LOG.md", (n) => runLogAt === -1 || n <= runLogAt],
    ["DECISIONS.md", null],
    ["LAUNCH_PLAN.md", null],
    ["LAUNCH_READINESS.md", null],
    ["CLAIMS.md", null],
    ["README.md", null],
  ].filter(([f]) => existsSync(join(ROOT, f)));

  const srcFiles = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(jsx?|css)$/.test(e.name)) srcFiles.push([relative(ROOT, p), null]);
    }
  })(join(ROOT, "src"));

  const TOKEN_RE = /--[a-z0-9-]+/g;
  const HEX_RE = /#[0-9a-fA-F]{6}\b/g;

  // Scanning one line: returns a misattribution or null. Kept as a function so
  // the two controls below run through the IDENTICAL code path as the corpus —
  // a control that exercises a copy of the logic proves nothing about the copy
  // that runs.
  const misattribution = (rel, text) => {
    if (rel === "src/index.css" && /^\s*--[a-z0-9-]+:\s*#/.test(text)) return null; // the definitions ARE the truth
    const tokens = [...new Set([...text.matchAll(TOKEN_RE)].map((m) => m[0]))];
    const hexes = [...new Set([...text.matchAll(HEX_RE)].map((m) => m[0].toLowerCase()))];
    if (!tokens.length || !hexes.length) return null;
    for (const t of tokens) {
      if (!lightPalette.has(t)) continue;
      const l = lightPalette.get(t);
      const d = darkPalette.get(t);
      if (hexes.some((h) => h === l || h === d)) continue;
      return { token: t, light: l, dark: d, quoted: hexes };
    }
    return null;
  };

  // §52b CONTROLS. The corpus yields very few pairs, so a count floor would be
  // a weak guard. Instead both directions are proven on synthetic lines fed
  // through `misattribution` itself: one that MUST fire and one that MUST NOT.
  // A scanner broken to match nothing fails the first; one broken to flag
  // everything fails the second.
  const probeToken = "--graph-neutral";
  const probeLive = lightPalette.get(probeToken);
  const positiveProbe = misattribution("probe.md", `light \`${probeToken}\` is \`#7c8494\``);
  const negativeProbe = misattribution("probe.md", `light \`${probeToken}\` is \`${probeLive}\``);
  if (!positiveProbe) {
    fail(
      `§52b: the scanner did not flag a known-wrong attribution ("${probeToken} is #7c8494", the exact ` +
        `defect item 125 was filed for). It is blind — a zero result from the real corpus below would mean ` +
        `nothing. Fix the scanner before reading its output.`,
    );
  }
  if (negativeProbe) {
    fail(
      `§52b: the scanner flagged a CORRECT attribution ("${probeToken} is ${probeLive}", read straight out ` +
        `of src/index.css). It flags everything, so its findings carry no information.`,
    );
  }

  const usedAnchors = new Set();
  let scanned = 0;
  for (const [rel, filter] of [...livingDocs, ...srcFiles]) {
    const lines = readFileSync(join(ROOT, rel), "utf8").split("\n");
    lines.forEach((text, i) => {
      const lineNo = i + 1;
      if (filter && !filter(lineNo)) return;
      scanned++;
      const m = misattribution(rel, text);
      if (!m) return;
      const idx = HEX_ATTRIBUTION_OK.findIndex(([f, anchor]) => f === rel && text.includes(anchor));
      if (idx !== -1) {
        usedAnchors.add(idx);
        return;
      }
      fail(
        `§52b: ${rel}:${lineNo} says \`${m.token}\` alongside ${m.quoted.join(", ")}, but that token is ` +
          `${m.light} (light) / ${m.dark} (dark) in src/index.css. A hex quoted in prose is a dated ` +
          `observation, not the palette (item 125). Either correct the figure — reading it out of ` +
          `src/index.css, not out of another entry in this log — or, if the mismatch is deliberate, add ` +
          `it to HEX_ATTRIBUTION_OK with the reason it is correct.\n      | ${text.trim().slice(0, 160)}`,
      );
    });
  }

  for (let i = 0; i < HEX_ATTRIBUTION_OK.length; i++) {
    if (usedAnchors.has(i)) continue;
    const [file, anchor] = HEX_ATTRIBUTION_OK[i];
    fail(
      `§52b: HEX_ATTRIBUTION_OK entry ${i} (${file}, "${anchor}") matches nothing that the scan flagged. ` +
        `Either the text moved, or the mismatch it excused was fixed. Delete the entry or repoint it — a ` +
        `stale exemption makes the next real misattribution look accounted for.`,
    );
  }

  if (failures === 0) {
    console.log(
      `  §52 palette figures in living text: ${scanned} line(s) across ${livingDocs.length} doc(s) and ` +
        `${srcFiles.length} source file(s) scanned against ${lightPalette.size} light / ${darkPalette.size} ` +
        `dark tokens; ${HEX_ATTRIBUTION_OK.length} deliberate mismatch(es) registered, both scanner ` +
        `directions proven live`,
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 53. src/content/moneyVisuals.js — lesson 17's earnings-gap figure (backlog
//     item 27, added 2026-08-27). Like §21 and §50, this checks the CLAIM THE
//     DIAGRAM MAKES, not that the numbers parse.
//
//     WHAT MAKES THIS ONE FAIL SILENTLY, and why it needs its own section.
//     Every other figure in this app draws a DIFFERENCE, so a broken one draws
//     the wrong difference and something on screen looks off. This one draws an
//     IDENTITY — the whole lesson is that a $50,000/$45,000 earner and a
//     $120,000/$115,000 earner have the same $5,000 gap — and a broken identity
//     renders as two bands of slightly different height under a rule and a
//     caption that both still say "exactly the same". At 4% of the plot height
//     the difference between $5,000 and $5,400 is under a pixel. Nothing on
//     screen would say so, and the figure would then be arguing the reader's
//     misconception rather than the lesson's correction.
//
//     THE SECOND SILENT FAILURE IS GEOMETRIC. `GapColumns` positions the rule
//     against the plot box at `gap / max`, while each band is sized inside its
//     own column and floored at `minHeight: 4`. Those two agree only while the
//     floor does not bind. Shrink the gap far enough and the bands stop moving
//     while the rule keeps falling — the figure's one assertion, drawn as a
//     line through empty space. (d) is what keeps the floor slack.
{
  const mv = moneyVisualsContent;
  const need = [
    "gapEarners", "gapOf", "gapTitle", "gapSegmentLabels", "gapRuleLabel",
    "gapAxisLabel", "gapCaption", "gapDescription",
  ];
  const missing = need.filter((k) => mv[k] === undefined);
  if (missing.length > 0) {
    fail(`§53: src/content/moneyVisuals.js no longer exports ${missing.join(", ")}. This section is pointed at a structure that no longer exists — repoint it rather than leaving it green.`);
  } else {
    const earners = mv.gapEarners;
    const gapOf = mv.gapOf;

    // (a) Two columns, because the figure is a comparison and `GapColumns`
    //     reads the rule's height off `columns[0]`. A third column would be
    //     drawn but silently excluded from the one line that carries the claim.
    if (!Array.isArray(earners) || earners.length !== 2) {
      fail(`§53: gapEarners holds ${Array.isArray(earners) ? earners.length : "not an array"}; the figure draws two columns and takes the shared rule's height from the first of them, so a third would be drawn under a line that does not describe it.`);
    } else {
      const [lo, hi] = earners;

      // (b) Both gaps positive, or the column has a band below its own baseline.
      for (const e of earners) {
        if (!(e.spends < e.earns)) {
          fail(`§53: the "${e.key}" earner spends ${e.spends} against ${e.earns}. Both columns must have a positive gap — lesson 17's figure is about how large the gap is, and a zero or negative one has no band to draw.`);
        }
      }

      // (c) THE CLAIM. The two gaps are the same number. Everything else in the
      //     figure — the shared scale, the bottom-anchored bands, the rule
      //     across both columns, the caption's "exactly the same height" — is
      //     built to show this one equality, and none of it degrades visibly if
      //     it stops being true.
      if (gapOf(lo) !== gapOf(hi)) {
        fail(`§53: the two gaps are ${gapOf(lo)} and ${gapOf(hi)}. Lesson 17's second section states both as the same figure, and the figure draws ONE rule across both columns to say so — unequal gaps would put that line above one band and below the other, under a caption claiming they match.`);
      }

      // (d) The gap must be thin enough to be the lesson's point and thick
      //     enough to draw. The floor is `minHeight: 4` over the 170px plot in
      //     GapColumns; below it the bands stop tracking the rule (see above).
      const max = Math.max(...earners.map((e) => e.earns));
      const frac = gapOf(lo) / max;
      if (!(frac >= 4 / 170)) {
        fail(`§53: the gap is ${(frac * 100).toFixed(2)}% of the taller column, below the ${((4 / 170) * 100).toFixed(2)}% at which GapColumns' minHeight:4 floor starts holding the bands up while the shared rule keeps dropping. The line would no longer sit on top of either band.`);
      }
      if (!(frac <= 0.25)) {
        fail(`§53: the gap is ${(frac * 100).toFixed(2)}% of the taller column. Above about a quarter the figure stops being surprising — the lesson's point is that the quantity that decides everything is a sliver next to the one people watch.`);
      }

      // (e) The incomes must be far enough apart that the equal gaps read as a
      //     result rather than a coincidence. Lesson 17 says "more than twice
      //     as much" in all five languages.
      if (!(hi.earns >= 2 * lo.earns)) {
        fail(`§53: the two incomes are ${lo.earns} and ${hi.earns}, a ratio of ${(hi.earns / lo.earns).toFixed(2)}. Lesson 17's prose says the second earner makes "more than twice as much"; below 2x the two columns look similar and the equal gaps are no longer counterintuitive.`);
      }

      // (f) THE FIGURES ARE THE LESSON'S OWN, checked against the lesson's own
      //     body text rather than against this file. This is the check that
      //     catches the figure and the prose drifting apart — the failure mode
      //     the header of moneyVisuals.js warns about and that §21 already had
      //     to guard once on lesson 7.
      //
      //     CONTROL, and it is not decorative: this scan looks for `en`
      //     thousands-separated numerals in one lesson's body, and a lesson
      //     whose text moved would return "not found" for every figure —
      //     indistinguishable from the figures being wrong. So a numeral known
      //     to be in the text must be found, and one known NOT to be must not.
      const body17 = (lessonContent["17"]?.sections ?? []).map((s) => s.body?.en ?? "").join("\n");
      const usd = (n) => n.toLocaleString("en-US");
      const CONTROL_PRESENT = 1450;   // Priya's after-tax monthly raise
      const CONTROL_ABSENT = 987654;  // a numeral no lesson body contains
      if (!body17.includes(usd(CONTROL_PRESENT)) || body17.includes(usd(CONTROL_ABSENT))) {
        fail(`§53: the lesson-17 body scan failed its own control — $${usd(CONTROL_PRESENT)} ${body17.includes(usd(CONTROL_PRESENT)) ? "found" : "NOT FOUND"} (must be found), $${usd(CONTROL_ABSENT)} ${body17.includes(usd(CONTROL_ABSENT)) ? "FOUND" : "not found"} (must not be). It is reading the wrong text or no text, so a clean result below would mean nothing.`);
      } else {
        for (const e of earners) {
          for (const [what, n] of [["earns", e.earns], ["spends", e.spends], ["gap", gapOf(e)]]) {
            if (!body17.includes(usd(n))) {
              fail(`§53: the figure's "${e.key}" earner ${what} $${usd(n)}, which lesson 17's own body never states. Every number in this figure is the lesson's — a reader who reads one set and sees another has been given two lessons. Change the lesson and the figure together or not at all.`);
            }
          }
        }
      }

      // (g) Five-language parity for every label the figure renders, including
      //     the text alternative — the `role="img"` container makes
      //     `gapDescription` the only thing a screen-reader user gets (§22).
      for (const key of ["gapTitle", "gapSegmentLabels", "gapRuleLabel", "gapAxisLabel", "gapCaption", "gapDescription"]) {
        for (const lang of LANGS) {
          const v = mv[key][lang];
          const empty = v === undefined || v === null
            || (Array.isArray(v) ? v.length !== 2 || v.some((x) => !String(x).trim()) : !String(v).trim());
          if (empty) fail(`§53: ${key}.${lang} is missing or incomplete. Every one of these renders on screen in that language, and gapDescription is the figure's only text alternative.`);
        }
      }

      if (failures === 0) {
        console.log(`  §53 lesson 17's earnings gap holds: $${usd(lo.earns)}/$${usd(lo.spends)} and $${usd(hi.earns)}/$${usd(hi.spends)} — both gaps exactly $${usd(gapOf(lo))} at ${(frac * 100).toFixed(2)}% of the taller column (${(hi.earns / lo.earns).toFixed(1)}x the income), every one of the six figures found in the lesson's own body, control proven both directions.`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 54. src/content/moneyVisuals.js — lesson 44's income trade-off plot (backlog
//     item 27, added 2026-08-27). Like §21, §50 and §53 this checks the CLAIM
//     THE DIAGRAM MAKES. What is different here, and what shapes every
//     assertion below, is that this figure plots RANKS rather than quantities.
//
//     WHY THAT NEEDS ITS OWN SECTION. Every other figure in this app is drawn
//     from numbers its lesson states, so §53's question — "is this number in
//     the body?" — is answerable. Lesson 44 states no numbers at all. It states
//     an ORDER ("Labor income is the most tightly coupled ... Investment
//     income is barely coupled to your time at all"), a TENDENCY ("as income
//     gets less coupled to your hours, it generally demands more of something
//     else up front"), and exactly one absolute claim about one item ("the only
//     one of the four you can begin with nothing but yourself"). The figure is
//     allowed to draw precisely those three things and nothing more.
//
//     SO THE FAILURE THIS SECTION EXISTS TO CATCH IS A WELL-MEANING ONE: a
//     future run sourcing real capital requirements and "improving" the
//     vertical axis into a measured one. That would render beautifully and
//     would be a different figure, making a claim lesson 44 explicitly declines
//     to make — the lesson's own conclusion is "Neither column is the smart
//     one." (d) is what keeps the axis ordinal, and (f)/(g) are what keep the
//     order tied to the sentences it was read off.
{
  const mv = moneyVisualsContent;
  const need = [
    "incomeKinds", "tradeTitle", "tradeKindLabels", "tradeEndLabels",
    "tradeUpfrontLabel", "tradeCaption", "tradeDescription",
  ];
  const missing = need.filter((k) => mv[k] === undefined);
  if (missing.length > 0) {
    fail(`§54: src/content/moneyVisuals.js no longer exports ${missing.join(", ")}. This section is pointed at a structure that no longer exists — repoint it rather than leaving it green.`);
  } else {
    const kinds = mv.incomeKinds;
    const EXPECTED_KEYS = ["labor", "business", "passive", "investment"];

    // (a) Four items in the order lesson 43 ranks them. `LessonVisual.jsx`
    //     hands this array to the plot positionally, so ARRAY ORDER IS THE
    //     HORIZONTAL AXIS: reordering it here silently redraws the lesson's
    //     ranking, and reordering it without also reordering `tradeKindLabels`
    //     would put every label on the wrong dot.
    if (!Array.isArray(kinds) || kinds.length !== EXPECTED_KEYS.length
        || kinds.some((k, i) => k.key !== EXPECTED_KEYS[i])) {
      fail(`§54: incomeKinds is [${(kinds ?? []).map((k) => k?.key).join(", ")}]; the figure is lesson 43's four categories in its stated coupling order [${EXPECTED_KEYS.join(", ")}]. The array's order is the plot's horizontal axis and the index into tradeKindLabels, so this is two claims at once.`);
    } else {
      // (b) `detach` must agree with array position. It is the same fact twice
      //     on purpose — the array carries the order and `detach` names it —
      //     so a partial edit that moves one and not the other is caught here
      //     rather than rendering a plot that disagrees with its own data.
      for (const [i, k] of kinds.entries()) {
        if (k.detach !== i) {
          fail(`§54: incomeKinds[${i}] ("${k.key}") has detach=${k.detach}. detach must equal the array index — it is the horizontal rank, and the plot reads position from the index, so a disagreement means one of the two is wrong and nothing on screen would say which.`);
        }
      }

      // (c) THE ORDINAL AXIS. Three assertions, each tied to a sentence:
      //       • labor is exactly 0 — lesson 44 says it is "the only one of the
      //         four you can begin with nothing but yourself", and 0 is what
      //         puts its dot ON the rail. Any positive value silently draws the
      //         lesson's one absolute claim as false.
      //       • every other item is strictly above it — the same sentence, in
      //         its "only one" half.
      //       • the sequence is NON-DECREASING, never asserted as strictly
      //         increasing. The lesson's word is "generally", and it never ranks
      //         a business against a rental against shares. A strict assertion
      //         here would be this section enforcing a claim the lesson does not
      //         make, which is the same defect as drawing it.
      const labor = kinds[0];
      if (labor.upfront !== 0) {
        fail(`§54: incomeKinds[0] ("labor") has upfront=${labor.upfront}, not 0. Lesson 44's one absolute claim on this axis is that labor income is "the only one of the four you can begin with nothing but yourself"; 0 is what seats its dot on the rail, and any other value draws that sentence as false while the caption still asserts it.`);
      }
      for (const k of kinds.slice(1)) {
        if (!(k.upfront > labor.upfront)) {
          fail(`§54: "${k.key}" has upfront=${k.upfront}, not above labor's ${labor.upfront}. Lesson 44 says every one of the other three demands something first — capital, years, specialized skill, or a tolerance for it not working — so a dot level with labor on the rail contradicts the section it is drawn from.`);
        }
      }
      for (let i = 1; i < kinds.length; i += 1) {
        if (kinds[i].upfront < kinds[i - 1].upfront) {
          fail(`§54: upfront falls from ${kinds[i - 1].upfront} ("${kinds[i - 1].key}") to ${kinds[i].upfront} ("${kinds[i].key}"). Lesson 44's tendency runs the other way — "as income gets less coupled to your hours, it generally demands more of something else up front" — and a dip draws the opposite of the sentence.`);
        }
      }

      // (d) GEOMETRY, and it is the silent one. `TradeoffPlot` seats a dot of
      //     radius 5 at `railY - (upfront / max) * plotH`. The figure's whole
      //     left-hand claim is that labor's dot is ON the rail and the others
      //     are OFF it — so if the smallest lift is under a dot diameter, the
      //     second dot overlaps the rail and reads as sitting on it too. The
      //     plot still renders, the caption still says "only labor income sits
      //     on the line", and nothing fails.
      const TRADE_PLOT_H = 150 - 26 - 30;  // TRADE_H − pad.top − pad.bottom
      const TRADE_DOT_R = 5;
      const maxUpfront = Math.max(...kinds.map((k) => k.upfront));
      const smallestLift = (Math.min(...kinds.slice(1).map((k) => k.upfront)) / maxUpfront) * TRADE_PLOT_H;
      if (smallestLift <= TRADE_DOT_R * 2) {
        fail(`§54: the lowest lifted dot clears the rail by ${smallestLift.toFixed(1)} plot units, no more than one ${TRADE_DOT_R * 2}-unit dot diameter. It would touch or overlap the rail and read as sitting on it, which is exactly the distinction the figure exists to draw. Widen the gap between labor's 0 and the next value, or re-check TRADE_H/TRADE_PAD in charts.jsx if the plot box changed.`);
      }

      // (e) FIVE-LANGUAGE PROSE ANCHOR — the legend uses each language's own
      //     word for each category, checked against lesson 42, which is where
      //     all four names are defined ("Roughly, the four are these...").
      //
      //     THIS IS DELIBERATELY NOT en-ONLY, and that is the point of doing it
      //     this way. Backlog item 127 filed the opposite shape as a residual:
      //     §53 checks lesson 17's figures against the `en` body alone, so a
      //     translated numeral could drift unseen. Here the check runs per
      //     language against that language's own body, so a translation that
      //     renames a category is caught in the language it happened in. It
      //     also sidesteps item 127's instrument trap entirely — these are
      //     words, not numerals, so no CJK myriad-grouping normalizer is
      //     needed. It cost two real corrections on the way in: `es` and `zh`
      //     labels were first written as plausible translations rather than
      //     the lessons' own terms ("ingresos del trabajo" for the prose's
      //     "ingreso laboral", "事业收入" for "经营收入") and this check is
      //     what found them.
      //
      //     CONTROL, per language and both directions: a body that failed to
      //     load returns "not found" for all four labels, which is
      //     indistinguishable from four renamed categories.
      const CONTROL_ABSENT = "qzx-no-lesson-says-this";
      for (const lang of LANGS) {
        const body42 = (lessonContent["42"]?.sections ?? []).map((s) => s.body?.[lang] ?? "").join("\n").toLowerCase();
        if (body42.trim().length === 0 || body42.includes(CONTROL_ABSENT)) {
          fail(`§54: the lesson-42 body scan failed its control in "${lang}" — ${body42.trim().length === 0 ? "the body is empty" : "an absent probe was found"}. It is reading the wrong text or no text, so a clean result for this language would mean nothing.`);
          continue;
        }
        const labels = mv.tradeKindLabels[lang] ?? [];
        for (const [i, label] of labels.entries()) {
          if (!body42.includes(String(label).toLowerCase())) {
            fail(`§54: the legend calls incomeKinds[${i}] "${label}" in "${lang}", but lesson 42 — the lesson that defines all four names — never uses that term in that language. The figure would label a dot with a word its own lesson does not use. Take the label from the lesson's prose rather than translating the English label.`);
          }
        }
      }

      // (f) THE ORDERING SENTENCE, in `en` only and openly so. Lesson 43 states
      //     the full four-way rank in four clauses; this asserts they are all
      //     present AND still in that relative order, because the order is the
      //     figure's horizontal axis. There is no five-language version of this
      //     one: the translations render the rank in their own syntax (`es` and
      //     `zh` do not even use the legend's noun for every category in lesson
      //     43 — it says "rent and royalties" there, not "passive income"),
      //     so a clause match would report a confident failure about grammar.
      //     (e) is what covers the other four languages.
      const body43en = (lessonContent["43"]?.sections ?? []).map((s) => s.body?.en ?? "").join("\n");
      const RANK_CLAUSES = [
        "Labor income is the most tightly coupled",
        "Business income is partly coupled",
        "Rent and royalties are loosely coupled",
        "Investment income is barely coupled",
      ];
      const at = RANK_CLAUSES.map((c) => body43en.indexOf(c));
      if (at.some((i) => i < 0)) {
        fail(`§54: lesson 43's en body no longer contains ${RANK_CLAUSES.filter((_, i) => at[i] < 0).map((c) => `"${c}"`).join(" and ")}. That sentence IS the figure's horizontal axis — incomeKinds' order was read off it. If the lesson was reworded, re-read the new ranking and re-derive the order rather than repointing this string.`);
      } else if (at.some((v, i) => i > 0 && v < at[i - 1])) {
        fail(`§54: lesson 43's en body states the four coupling ranks in a different order than incomeKinds draws them (found at ${at.join(", ")}). The plot's left-to-right order would contradict the lesson it sits two screens after.`);
      }

      // (g) THE TWO SENTENCES THE FIGURE IS AN ANSWER TO. The tendency and the
      //     ladder/trade conclusion are the reason this diagram exists at all
      //     (see charts.jsx's TradeoffPlot header). If either leaves lesson 44,
      //     the figure is answering a question the lesson stopped asking.
      const body44en = (lessonContent["44"]?.sections ?? []).map((s) => s.body?.en ?? "").join("\n");
      const CLAIMS_44 = [
        ["the second axis", "second axis running the other way"],
        ["the tendency", "generally demands more of something else up front"],
        ["labor's uniqueness", "the only one of the four you can begin with nothing but yourself"],
        ["the conclusion", "stops being a ladder and becomes a set of trades"],
      ];
      for (const [what, phrase] of CLAIMS_44) {
        if (!body44en.includes(phrase)) {
          fail(`§54: lesson 44's en body no longer says "${phrase}" (${what}). The figure draws exactly that claim and its caption restates it; if the lesson moved, the figure has to move with it or come out.`);
        }
      }

      // (h) Five-language parity for everything the figure renders, including
      //     the text alternative — the plot is a single `role="img"`, so
      //     `tradeDescription` is all a screen-reader user gets of it (§22).
      for (const key of ["tradeTitle", "tradeUpfrontLabel", "tradeCaption", "tradeDescription"]) {
        for (const lang of LANGS) {
          if (!String(mv[key][lang] ?? "").trim()) {
            fail(`§54: ${key}.${lang} is missing or empty. Every one of these renders on screen in that language, and tradeDescription is the figure's only text alternative.`);
          }
        }
      }
      for (const [key, len] of [["tradeKindLabels", 4], ["tradeEndLabels", 2]]) {
        for (const lang of LANGS) {
          const v = mv[key][lang];
          if (!Array.isArray(v) || v.length !== len || v.some((x) => !String(x ?? "").trim())) {
            fail(`§54: ${key}.${lang} must be ${len} non-empty strings; got ${Array.isArray(v) ? `${v.length} entries` : typeof v}. The plot indexes it positionally against incomeKinds, so a short array renders an unlabeled dot rather than throwing.`);
          }
        }
      }

      if (failures === 0) {
        console.log(
          `  §54 lesson 44's income trade-off holds: 4 categories in lesson 43's stated coupling order, ` +
            `upfront ranks ${kinds.map((k) => k.upfront).join("/")} (labor alone on the rail, non-decreasing, no scale drawn), ` +
            `smallest lift ${smallestLift.toFixed(1)}u against a ${TRADE_DOT_R * 2}u dot; all 4 legend terms found in lesson 42's own body ` +
            `in all ${LANGS.length} languages (control both directions per language), 4 rank clauses in order in lesson 43 and 4 claims present in lesson 44.`,
        );
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// §55. US-ENGLISH HOUSE STYLE, over learner-visible English strings only.
//
//   WHY THIS EXISTS. The owner set US English as the house style on
//   2026-08-21 (item 91), and that sweep fixed 123 lines across 32 files —
//   but it shipped as a one-off pass with no instrument behind it, and its
//   own closing claim ("the final whole-repo scan returns exactly the 10
//   intended exclusions and nothing else") was not true even on the day it
//   was written. Re-measured 2026-08-27 against the tree at item 91's own
//   commit: nine British spellings sat outside its exclusion list right
//   then, including a `colour` in a file the item lists as swept. By
//   2026-08-27 the count had grown to 36, because lessons 42-44 shipped
//   "Labour income" — the term lesson 42 DEFINES — into learner-visible
//   prose, a legend label, a caption and a screen-reader description.
//
//   A style rule with no instrument is a claim, not a property. This makes
//   it a property.
//
//   SCOPE, and why it is narrow ON PURPOSE. Item 91's own closing advice was
//   "if a guard is ever wanted, the honest scope is learner-visible strings
//   only", and that is exactly this scope: string VALUES reachable under an
//   `en` key in the content and locale modules. It deliberately does NOT
//   read source text, which is what keeps three whole classes of false
//   positive out of it:
//     * `aria-labelledby`, a real ARIA attribute name, appears 12 times in
//       src/ and 5 more in scripts/. A source-text net flags every one.
//     * Non-English content. "cheque de pago" is correct Spanish and
//       item 91 nearly wrote "check de pago" into a lesson body with a blind
//       replace; walking only `en`-keyed values makes that unreachable.
//     * Verbatim quotations of deleted text, which MUST keep their original
//       spelling — see the us-english:allow note at §31's duplicate-title
//       check above, where a quoted "colour" is correct and load-bearing.
//   Comments and dev scripts are therefore NOT guarded. They were swept by
//   hand in this run; keeping them swept is a residual, not a check.
//
//   EXTENDING THE NET. Add stems, not suffixes. A generic `-ise` rule flags
//   "exercise", "compromise", "expertise" and "otherwise"; a generic `-re`
//   rule flags "genre" and "mediocre"; `analys[ei]s` flags the correct US
//   nouns "analysis" and "analyses", which is precisely how item 91's own
//   headline count came out wrong in both directions. Every entry below is
//   an explicit stem, and CONTROL C exists to catch the day someone
//   forgets that.
{
  // §55's own controls gate §55's scan, NOT the global failure count. The
  // first draft gated on `failures === 0`, which meant any unrelated failure
  // earlier in this file silently skipped the whole style sweep — a check
  // that disappears exactly when the build is already unhappy.
  const before55 = failures;
  const BRITISH = [
    [/\b(labour|colour|behaviour|favour|honour|neighbour|rumour|humour|endeavour|flavour|savour|harbour|vapour|armour|valour|odour|parlour|splendour)\w*/gi, "drop the u (labour → labor)"],
    [/\b(organis|realis|recognis|specialis|minimis|maximis|prioritis|normalis|summaris|apologis|criticis|utilis|capitalis|localis|stylis|tokenis|standardis|memoris|categoris|penalis|sterilis)\w*/gi, "-ise/-isation → -ize/-ization"],
    // "analyses" is deliberately ABSENT: it is the correct US plural of
    // "analysis" AND the British third-person verb, spelled identically. It
    // cannot be classified without reading the sentence, and CONTROL C below
    // failed on exactly this when the pattern was first written with `es` in
    // it. Flagging the two unambiguous verb forms is the honest coverage.
    [/\banalys(e|ed|ing)\b/gi, "analyse → analyze (the nouns analysis/analyses are correct US; \"analyses\" is ambiguous and is deliberately not flagged)"],
    [/\bemphasis(e|ed|es|ing)\b/gi, "emphasise → emphasize (the noun emphasis is correct US)"],
    [/\b(centre|calibre|spectre|lustre|sombre|meagre|theatre)s?\b/gi, "-re → -er"],
    [/\b\w*(metre|litre|fibre)s?\b/gi, "-re → -er (metre → meter, and the same for kilometre etc.)"],
    [/\b(defence|offence|licence|pretence)s?\b/gi, "-ce → -se"],
    [/\bpractis(e|ed|es|ing)\b/gi, "practise → practice (US uses practice for both noun and verb)"],
    [/\b(travell|cancell|modell|labell|fuell|signall|marvell|counsell|jewell|levell)\w*/gi, "single the l (cancelled → canceled)"],
    [/\bprogramme\b/gi, "programme → program"],
    [/\bcheques?\b/gi, "cheque → check"],
    [/\b(whilst|amongst)\b/gi, "whilst → while, amongst → among"],
    [/\b(enrol|instalment|skilful|fulfil)(?!l)\w*/gi, "double the l (enrol → enroll, fulfil → fulfill)"],
    [/\bjudgement\w*/gi, "judgement → judgment"],
    [/\bcatalogue\w*/gi, "catalogue → catalog"],
    [/\b(ageing|storey|sceptic\w*|moustache|aluminium|sulphur|kerb|tyres?)\b/gi, "assorted British forms"],
  ];

  // The corpus: every string VALUE sitting under a key named `en`, across the
  // modules that render text. Path-based rather than module-based, so a new
  // five-language key is covered the day it is added and a translation never is.
  const EN_SOURCES = [
    ["locales", TR], ["lessons", lessons], ["lessonContent", lessonContent],
    ["quizData", quizData], ["glossary", glossary], ["lessonTerms", lessonTerms],
    ["kidsContent", kidsContent], ["markets", marketsContent],
    ["moneyVisuals", moneyVisualsContent], ["economicSignals", economicSignals],
    ["policyScenarios", policyScenarios], ["sectors", sectors],
  ];

  const corpus = [];
  function collectEn(node, path, underEn) {
    if (typeof node === "string") {
      if (underEn) corpus.push({ path, text: node });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((v, i) => collectEn(v, `${path}[${i}]`, underEn));
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        collectEn(v, `${path}.${k}`, underEn || k === "en");
      }
    }
  }
  for (const [name, mod] of EN_SOURCES) collectEn(mod, name, false);

  function scan(text) {
    const found = [];
    for (const [re, advice] of BRITISH) {
      re.lastIndex = 0;
      const m = text.match(re);
      if (m) found.push({ words: [...new Set(m)], advice });
    }
    return found;
  }

  // ── CONTROLS, all three mandatory. A style net that silently reads nothing
  //    looks exactly like a style net over clean content.
  //
  //    (A) THE CORPUS IS REAL. A floor plus a known sentence. The floor is
  //        well under the live count so ordinary content edits never trip it;
  //        it exists to catch the corpus collapsing to a handful of keys,
  //        which is what a renamed `en` key or a changed module shape does.
  const KNOWN_PRESENT = "money paid for your time and skill";
  if (corpus.length < 800) {
    fail(`§55: the English corpus collected only ${corpus.length} strings. Item 91 counted 1,316 in 2026-08 and this check is scoped the same way, so a number this low means the walk is reading the wrong shape — every clean result below would be meaningless. Check that the content modules still key English under \`en\`.`);
  } else if (!corpus.some((c) => c.text.includes(KNOWN_PRESENT))) {
    fail(`§55: the corpus does not contain lesson 42's phrase "${KNOWN_PRESENT}", so it is not reading lesson bodies even though it collected ${corpus.length} strings. A clean result would be about the wrong text.`);
  } else {
    //  (B) THE NET FIRES. Every pattern is exercised against a form it must
    //      catch. This is per-pattern rather than one specimen sentence: item
    //      91 lost three passes to a net that was clean only because it had
    //      no rule for the family it was missing.
    const MUST_CATCH = [
      "labour", "colour", "behaviour", "favour", "honoured", "neighbouring",
      "organised", "capitalisation", "specialised", "analyse", "emphasised",
      "centre", "theatre", "kilometre", "fibre", "defence", "licence",
      "practising", "cancelled", "labelled", "programme", "cheque", "whilst",
      "enrol", "fulfil", "judgement", "catalogue", "ageing", "sceptical",
    ];
    const missed = MUST_CATCH.filter((w) => scan(w).length === 0);
    if (missed.length) {
      fail(`§55 CONTROL B: the net does not flag ${missed.map((w) => `"${w}"`).join(", ")}. Every one is a British form this repo has actually shipped or is one keystroke from shipping, so a clean sweep proves nothing while any of them is invisible.`);
    }

    //  (C) THE NET IS SILENT ON CORRECT US FORMS. The expensive half. Item 91
    //      shipped a net whose lookbehind matched US "colored", and item 91's
    //      predecessor over-counted by flagging "analysis" and "analyses".
    //      Both would have been caught here.
    const MUST_NOT_CATCH = [
      "labor", "color", "colored", "behavior", "favor", "honored", "neighboring",
      "organized", "analysis", "analyses", "emphasis", "center", "theater",
      "meter", "fiber", "defense", "license", "practice", "practices",
      "canceled", "labeled", "program", "check", "while", "among", "enroll",
      "fulfill", "judgment", "catalog", "aging", "skeptical", "exercise",
      "compromise", "expertise", "otherwise", "surprise", "franchise",
      "genre", "mediocre", "acre", "four", "hour", "your", "flour",
    ];
    const falsePositives = MUST_NOT_CATCH.filter((w) => scan(w).length > 0);
    if (falsePositives.length) {
      fail(`§55 CONTROL C: the net flags the correct US spellings ${falsePositives.map((w) => `"${w}"`).join(", ")}. A pattern was widened into a suffix rule — add explicit stems instead. Every failure §55 reports is untrustworthy until this passes.`);
    }

    if (failures === before55) {
      const hits = [];
      for (const { path, text } of corpus) {
        for (const { words, advice } of scan(text)) hits.push({ path, words, advice });
      }
      for (const h of hits.slice(0, 12)) {
        fail(`§55: ${h.path} uses the British spelling ${h.words.map((w) => `"${w}"`).join(", ")} — ${h.advice}. The owner set US English as the house style on 2026-08-21 (item 91); this string is learner-visible. If it is a verbatim quotation, it does not belong in shipped content — reword it.`);
      }
      if (hits.length > 12) {
        fail(`§55: ${hits.length - 12} further British spelling(s) not listed above.`);
      }
      if (hits.length === 0) {
        console.log(
          `  §55 US-English house style holds across ${corpus.length} learner-visible English strings ` +
            `(${BRITISH.length} pattern families; control A the corpus reaches lesson bodies, ` +
            `control B all ${MUST_CATCH.length} British specimens flagged, control C all ${MUST_NOT_CATCH.length} US forms silent).`,
        );
      }
    }
  }
}

// §56. QUOTATION-MARK REPERTOIRE, per language, over learner-visible strings.
//
//   WHY THIS EXISTS. Two typographic drifts were found by hand on two
//   consecutive days in 2026-08-27, both by a translation review that
//   happened to be reading that lesson, and neither visible to anything in
//   `npm test`: `ja` lesson 30 wrote a lesson title in 「」 where 75 other
//   references used 『』, and `zh` lessons 3 and 37 quoted inline terms with
//   ASCII U+0022 where 120 others used U+201C/U+201D. Item 128's lesson
//   applies unchanged — a style rule with no instrument is a claim, not a
//   property — and item 130's bar for building one ("wait until the
//   hand-swept surface has drifted again") had been met twice over.
//
//   ⛔ WHAT THE FIRST DESIGN GOT WRONG, because it is the interesting part
//   and a future run must not re-derive it. Backlog item 134 specified a
//   check that classifies each quoted span as lesson-title-or-not by joining
//   against `lessons.js`, and called that join "the load-bearing part". It is
//   not: it is the main FALSE-POSITIVE source. Several lesson-title heads are
//   ordinary common nouns, so `locales.ja.heroInsight` — 「取引」, quoting the
//   concept the way the English says a plain "transactions" — would have been
//   flagged as a mis-bracketed title reference. Lesson 44's own title
//   (`The Part the Word “Passive” Leaves Out`) would have been flagged too,
//   for containing quotes inside a title. Both are correct prose.
//
//   SO THIS CHECK DELIBERATELY DOES NOT READ ROLE, ONLY REPERTOIRE: which
//   quotation marks each language is allowed to use at all. That is decidable
//   from the character alone, needs no sentence understanding, and has no
//   false-positive class. The honest cost is stated plainly: it would NOT
//   have caught the `ja` title drift, which needs context to distinguish a
//   title reference from an ordinary quotation and is therefore left to
//   review. It WOULD have caught the `zh` one, and it caught 33 more spans of
//   the same family that the hand review missed because it was only looking
//   where it was reading.
//
//   THE SETS ARE MEASURED, NOT IMPOSED. Each language's allowed set is the
//   one its own corpus already uses consistently (counts taken 2026-08-27
//   over all five languages of the twelve modules below):
//     en / es  ASCII " and ', plus curly “ ” for the lesson-title references
//              item 84 introduced. 64/57 title references, 0 CJK marks.
//     ko       ASCII " and ' for inline quotation (48 spans) and 「」 for
//              lesson titles (59). Korean takes both; the corpus is
//              internally consistent, so ASCII is NOT flagged here.
//     zh       “ ” for quotation (152 spans) and 《》 for titles and work
//              names (64). NOT 「」 (a Traditional/Japanese mark — the app
//              ships lang="zh-Hans") and NOT ASCII quotes.
//     ja       「」 for quotation (191) and 『』 for titles and coined labels
//              (66). No Western quotes anywhere in the Japanese corpus.
//   `zh` was the only language that contradicted its own convention, in 33
//   spans across 15 strings and 5 modules; all 33 were repaired in the same
//   commit that added this check.
//
//   ⚠️ DO NOT tighten `ja` to "『』 means title". Measured: `ja` also uses
//   『』 for seven coined labels and slogans (『今回は違う』 in lessons 33 and
//   36, 『美しい/醜いデレバレッジング』 in lesson 34). That is a coherent
//   Japanese convention, not drift, and a checker that flagged it would be
//   turned off within a week.
//
//   SCOPE is §55's, for §55's reasons: string VALUES under a language key in
//   the twelve content and locale modules. Source text, comments and dev
//   scripts are out, which is what keeps `aria-labelledby` and quoted
//   verbatim prose from reaching it.
{
  const before56 = failures;

  const QUOTE_MARKS = "\"'“”‘’「」『』《》〈〉";
  const ALLOWED = {
    en: "\"'“”‘’",
    es: "\"'“”‘’",
    ko: "\"'“”‘’「」『』",
    zh: "“”‘’《》〈〉",
    ja: "「」『』",
  };
  const NAME = {
    '"': "ASCII double quote U+0022", "'": "ASCII apostrophe U+0027",
    "“": "U+201C", "”": "U+201D", "‘": "U+2018", "’": "U+2019",
    "「": "「 corner bracket", "」": "」 corner bracket",
    "『": "『 white corner bracket", "』": "』 white corner bracket",
    "《": "《 double angle bracket", "》": "》 double angle bracket",
    "〈": "〈 angle bracket", "〉": "〉 angle bracket",
  };
  const ADVICE = {
    zh: "the Chinese corpus quotes with “ ” and names works with 《 》; ASCII quotes are halfwidth glyphs in a fullwidth context and 「 」 is a Traditional/Japanese mark, while this app ships lang=\"zh-Hans\"",
    ja: "the Japanese corpus quotes with 「 」 and marks titles and coined labels with 『 』; Western quotes do not appear in it",
    en: "English strings quote with ASCII marks; the curly pair is reserved for the lesson-title references item 84 introduced, and CJK brackets do not belong in English",
    es: "Spanish strings follow the English convention here; CJK brackets do not belong in Spanish",
    ko: "the Korean corpus quotes with ASCII marks and names lessons with 「 」",
  };

  // The same twelve modules §55 walks, listed again rather than shared: §55's
  // copy is block-scoped, and a check that silently inherited another check's
  // scope would change meaning the day that one was re-scoped.
  const QUOTE_SOURCES = [
    ["locales", TR], ["lessons", lessons], ["lessonContent", lessonContent],
    ["quizData", quizData], ["glossary", glossary], ["lessonTerms", lessonTerms],
    ["kidsContent", kidsContent], ["markets", marketsContent],
    ["moneyVisuals", moneyVisualsContent], ["economicSignals", economicSignals],
    ["policyScenarios", policyScenarios], ["sectors", sectors],
  ];

  const quoteCorpus = {};
  for (const lang of LANGS) {
    const out = [];
    const walk = (node, path, under) => {
      if (typeof node === "string") { if (under) out.push({ path, text: node }); return; }
      if (Array.isArray(node)) { node.forEach((v, i) => walk(v, `${path}[${i}]`, under)); return; }
      if (node && typeof node === "object")
        for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`, under || k === lang);
    };
    for (const [name, mod] of QUOTE_SOURCES) walk(mod, name, false);
    quoteCorpus[lang] = out;
  }

  const offenders = (text, lang) =>
    [...new Set([...text].filter((c) => QUOTE_MARKS.includes(c) && !ALLOWED[lang].includes(c)))];

  // ── CONTROLS. A repertoire net that reads nothing looks exactly like a
  //    repertoire net over clean content, and this one is a pure absence
  //    assertion — the shape most able to pass by reading the wrong thing.
  //
  //    (A) THE CORPORA ARE REAL, in every language, with a known sentence per
  //        language so a collapsed walk cannot look clean.
  const KNOWN = {
    en: "Think of the economy as a machine",
    es: "Piensa en la economía como una máquina",
    ko: "경제를 몇 가지 단순한 부분으로",
    zh: "把经济想象成由几个简单部分",
    ja: "経済を、いくつかの単純な部品",
  };
  for (const lang of LANGS) {
    const n = quoteCorpus[lang].length;
    if (n < 800) {
      fail(`§56 CONTROL A: the "${lang}" corpus collected only ${n} strings. §55 counts ~1,145 per language over the same modules, so a number this low means the walk is reading the wrong shape and every clean result below would be meaningless.`);
    } else if (!quoteCorpus[lang].some((c) => c.text.includes(KNOWN[lang]))) {
      fail(`§56 CONTROL A: the "${lang}" corpus does not contain that language's own heroInsight opening, so it is not reading rendered copy even though it collected ${n} strings.`);
    }
  }

  //    (B) THE NET FIRES. One planted specimen per language, each a mark that
  //        language genuinely must not use. Without this, an ALLOWED set
  //        widened by accident to every mark reports a clean sweep forever.
  const MUST_CATCH = {
    en: "the 「取引」 case", es: "el caso 「取引」",
    ko: "《사례》 검토", zh: "这是\"财富效应\"的例子",
    ja: "これは“金利”の例",
  };
  const missed = LANGS.filter((lang) => offenders(MUST_CATCH[lang], lang).length === 0);
  if (missed.length) {
    fail(`§56 CONTROL B: the net does not flag a planted out-of-repertoire mark in ${missed.map((l) => `"${l}"`).join(", ")}. Every clean result below is meaningless while any language's net is inert.`);
  }

  //    (C) THE NET IS SILENT ON CORRECT COPY. Each language's own sanctioned
  //        marks, including the two that look wrong to a neighbouring
  //        language: `ja` 『』 around a coined label, and `zh` 《》 around a
  //        work name that is not a lesson.
  const MUST_NOT_CATCH = {
    en: "the word “Passive” and a plain 'later' and a \"quote\"",
    es: "la palabra “Pasivo” y un 'luego' y una \"cita\"",
    ko: "「금리」와 '부의 효과'와 \"인용\"",
    zh: "《利率》和“财富效应”和《经济周期》",
    ja: "『金利』と「お金」と『今回は違う』",
  };
  const falsePositives = LANGS.filter((lang) => offenders(MUST_NOT_CATCH[lang], lang).length > 0);
  if (falsePositives.length) {
    fail(`§56 CONTROL C: the net flags correct copy in ${falsePositives.map((l) => `"${l}"`).join(", ")} — an ALLOWED set has lost a mark that language legitimately uses. Every §56 failure is untrustworthy until this passes.`);
  }

  if (failures === before56) {
    const hits = [];
    for (const lang of LANGS) {
      for (const { path, text } of quoteCorpus[lang]) {
        const bad = offenders(text, lang);
        if (bad.length) hits.push({ lang, path, bad });
      }
    }
    for (const h of hits.slice(0, 12)) {
      fail(`§56: ${h.path} uses ${h.bad.map((c) => NAME[c] ?? c).join(", ")}, which is outside the "${h.lang}" quotation repertoire — ${ADVICE[h.lang]}.`);
    }
    if (hits.length > 12) fail(`§56: ${hits.length - 12} further out-of-repertoire string(s) not listed above.`);
    if (hits.length === 0) {
      console.log(
        `  §56 quotation repertoire holds across ${LANGS.map((l) => `${l}=${quoteCorpus[l].length}`).join(", ")} learner-visible strings ` +
          `(control A every language's corpus reaches rendered copy, control B all ${LANGS.length} planted marks flagged, control C all ${LANGS.length} sanctioned sets silent). ` +
          `Repertoire only — it cannot tell a title reference from an ordinary quotation; see the header.`,
      );
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// §57. src/content/moneyVisuals.js — lesson 28's outcome/process grid (backlog
//      item 27, added 2026-08-28). The third KIND of figure this file guards,
//      and the kind decides the assertions:
//
//        §21/§50/§53 — the figure plots arithmetic its lesson states. The
//          question is "is this number in the body?".
//        §54        — the figure plots RANKS read off two sentences. The
//          question is "is this order still what the sentence says?".
//        §57 (here) — the figure plots a PARTITION and carries no magnitude at
//          all. There is no number to check, so the question becomes "are the
//          two axes still the two things the lesson crosses, and has anyone
//          started drawing a quantity that the lesson does not have?".
//
//      THE FAILURE THIS SECTION EXISTS TO CATCH IS THE WELL-MEANING ONE, and
//      it is a different well-meaning edit from §54's. §54 guards against a
//      future run sourcing real capital requirements to "improve" an ordinal
//      axis. Here the tempting improvement is WEIGHTING THE CELLS — making the
//      lucky-win cell bigger, or shading it, or adding a base rate, because a
//      2x2 of four equal boxes looks like it is missing information. It is not
//      missing information; the absence IS the lesson. Lesson 28 says all four
//      cases occur and says nothing whatever about how often ("very weak
//      evidence", never "usually luck"), and its own conclusion refuses to
//      rank: the useful question is whether the decision "would hold up if I
//      made it a hundred times", which is exactly the quantity nobody has. A
//      weighted grid would answer that question on the lesson's behalf and
//      would read as guidance about how far to trust a result — §10.1 drawn
//      rather than written. (e) is what keeps the cells equal, and it checks
//      the RENDERED geometry, not the data, because the data has no sizes in
//      it to get wrong.
{
  const mv = moneyVisualsContent;
  const before57 = failures;
  const need = [
    "outcomeCells", "outcomeTitle", "outcomeColumnLabels", "outcomeRowLabels",
    "outcomeSpanLabel", "outcomeHereLabel", "outcomeCaption", "outcomeDescription",
  ];
  const missing = need.filter((k) => mv[k] === undefined);
  if (missing.length > 0) {
    fail(`§57: src/content/moneyVisuals.js no longer exports ${missing.join(", ")}. This section is pointed at a structure that no longer exists — repoint it rather than leaving it green.`);
  } else {
    const cells = mv.outcomeCells;

    // (a) THE PARTITION IS COMPLETE. Four cells, one per (row, col) of a 2x2,
    //     no duplicates and no gaps. This is the figure's entire claim as data:
    //     a missing cell would render an empty box that reads as "this cannot
    //     happen", which is the opposite of what the lesson says, and the grid
    //     would still lay out perfectly.
    const seen = new Set();
    let shapeOk = Array.isArray(cells) && cells.length === 4;
    if (shapeOk) {
      for (const c of cells) {
        if (![0, 1].includes(c.row) || ![0, 1].includes(c.col)) shapeOk = false;
        else seen.add(`${c.row},${c.col}`);
      }
      if (seen.size !== 4) shapeOk = false;
    }
    if (!shapeOk) {
      fail(`§57: outcomeCells must be the complete 2x2 partition — four cells covering (0,0) (0,1) (1,0) (1,1) exactly once. Got ${Array.isArray(cells) ? `${cells.length} cell(s) at ${cells.map((c) => `(${c.row},${c.col})`).join(" ")}` : typeof cells}. A missing cell renders an empty box, which draws "this cannot happen" — the opposite of the lesson's claim that all four occur; a duplicated one leaves a different cell missing and reads the same way on screen.`);
    } else {
      // (b) EXACTLY ONE marked cell, and it is the lucky win. Maria's case is
      //     the lesson's own opening: a hunch (bad-or-lucky decision, row 1)
      //     that rose 40% (it won, col 1). Marking a second cell, or moving
      //     this one, would put the lesson's worked example somewhere the
      //     lesson does not put it — and the caption names her cell in prose,
      //     so the two would silently disagree.
      const here = cells.filter((c) => c.here);
      if (here.length !== 1) {
        fail(`§57: ${here.length} cell(s) carry \`here\`. Exactly one does — Maria's case, which the figure's caption and description both name in prose, so a second mark or none makes the picture and its own caption disagree.`);
      } else if (here[0].row !== 1 || here[0].col !== 1) {
        fail(`§57: the marked cell is at (${here[0].row},${here[0].col}); Maria's case is the bad-or-lucky decision (row 1) that won (col 1). Lesson 28 opens with a hunch that rose 40% and the whole figure turns on her sitting in the row she did not think she was in.`);
      }

      // (c) FIVE-LANGUAGE PROSE ANCHOR for the ROW labels — the axis the
      //     reader cannot see from the outcome, and the one worth checking in
      //     every language rather than `en` alone (backlog item 127's residual,
      //     answered here the way §54 (e) answers it). Each row label is lifted
      //     from that language's own "two different things" sentence, so a
      //     translation that reworded the lesson would leave the figure
      //     labelled with a phrase its own lesson never uses.
      //
      //     CONTROL, per language and both directions: a body that failed to
      //     load returns "not found" for both labels, which is
      //     indistinguishable from two renamed rows.
      const CONTROL_ABSENT = "qzx-no-lesson-says-this";
      for (const lang of LANGS) {
        const body28 = (lessonContent["28"]?.sections ?? []).map((s) => s.body?.[lang] ?? "").join("\n").toLowerCase();
        if (body28.trim().length === 0 || body28.includes(CONTROL_ABSENT)) {
          fail(`§57: the lesson-28 body scan failed its control in "${lang}" — ${body28.trim().length === 0 ? "the body is empty" : "an absent probe was found"}. It is reading the wrong text or no text, so a clean result for this language would mean nothing.`);
          continue;
        }
        const labels = mv.outcomeRowLabels[lang] ?? [];
        for (const [i, label] of labels.entries()) {
          if (!body28.includes(String(label).toLowerCase())) {
            fail(`§57: the grid's row ${i} reads "${label}" in "${lang}", but lesson 28 never uses that phrase in that language. Both rows are lifted from the lesson's own "outcome and process are two different things" sentence — take the label from the prose rather than translating the English one.`);
          }
        }
      }

      // (d) THE TWO CLAUSES THE FIGURE IS A PICTURE OF, in `en` and openly so.
      //     These are the two cells of the won/lost columns that the lesson
      //     states outright, and they are the reason the grid is a grid. There
      //     is no five-language version for the same reason §54 (f) has none:
      //     the translations render the pair in their own syntax, so a clause
      //     match would report a confident failure about grammar. (c) is what
      //     covers the other four languages.
      const body28en = (lessonContent["28"]?.sections ?? []).map((s) => s.body?.en ?? "").join("\n");
      const CLAIMS_28 = [
        ["the two axes", "outcome and process are two different things"],
        ["the good-decision cell", "a good decision can still lose"],
        ["the lucky-win cell", "a bad or lucky decision can still win"],
      ];
      for (const [what, phrase] of CLAIMS_28) {
        if (!body28en.includes(phrase)) {
          fail(`§57: lesson 28's en body no longer says "${phrase}" (${what}). The grid draws exactly that crossing and its caption restates it; if the lesson moved, the figure has to move with it or come out.`);
        }
      }

      // (e) THE CELLS ARE EQUAL, checked on the RENDERED grid rather than on
      //     the data — this is the silent one, and it is why this assertion
      //     reads charts.jsx instead of moneyVisuals.js. `outcomeCells` has no
      //     size field, so nothing in the data could ever encode a weighting;
      //     the weighting would arrive as CSS. `OutcomeGrid` lays the columns
      //     out with `gridTemplateColumns` and gives every cell one shared
      //     `minHeight` and one shared dot size, so equality is currently a
      //     property of three literals. If a future edit gives the columns
      //     different fractions, or the marked cell its own height or dot,
      //     the figure starts asserting a frequency the lesson does not have
      //     and every other assertion here still passes.
      const chartsSrc = readFileSync(join(ROOT, "src/components/charts.jsx"), "utf8");
      const gridStart = chartsSrc.indexOf("export function OutcomeGrid(");
      if (gridStart < 0) {
        fail("§57: charts.jsx no longer exports OutcomeGrid. The figure's geometry is asserted by reading that function, so this check is pointed at nothing.");
      } else {
        const nextExport = chartsSrc.indexOf("\nexport function ", gridStart + 1);
        const gridSrc = chartsSrc.slice(gridStart, nextExport === -1 ? chartsSrc.length : nextExport);

        // CONTROL: the slice must actually contain the grid's own layout, or
        // an empty slice would pass every assertion below by matching nothing.
        if (!gridSrc.includes("gridTemplateColumns") || !gridSrc.includes("minHeight")) {
          fail("§57 CONTROL: the OutcomeGrid slice does not contain `gridTemplateColumns` and `minHeight`, so it is not the layout this section thinks it is reading. Every geometry result below would be vacuous.");
        } else {
          const tmpl = gridSrc.match(/gridTemplateColumns:\s*"([^"]*)"/);
          const fractions = [...(tmpl?.[1] ?? "").matchAll(/([\d.]+)fr/g)].map((m) => Number(m[1]));
          // The label gutter is column 1 and is allowed to differ; the two
          // DATA columns are 2 and 3 and must be equal, or one outcome would
          // be drawn as the wider possibility.
          if (fractions.length !== 3) {
            fail(`§57 (e): OutcomeGrid's gridTemplateColumns is "${tmpl?.[1] ?? "(unreadable)"}" — this section expects three fr-based tracks (a label gutter and the two outcome columns) so it can compare the data columns. Re-derive the check if the layout genuinely changed shape.`);
          } else if (fractions[1] !== fractions[2]) {
            fail(`§57 (e): the two outcome columns are ${fractions[1]}fr and ${fractions[2]}fr. They must be equal — lesson 28 says all four cases occur and says nothing about how often, so a wider column draws a frequency the lesson does not state and edges into telling the reader how much to trust a result (§10.1).`);
          }
          // The cell box is one FIXED height shared by all four, taken from a
          // named constant. `minHeight` is not good enough and this assertion
          // says so on purpose: with a minimum, CSS grid still stretches the
          // row whose ROW LABEL wraps to more lines, which drew the bottom row
          // at 65px against the top row's 52px — measured live, with every
          // style literal in the file still correct. A fixed height is safe
          // here only because (e2) below keeps the cell free of text.
          const cellH = [...gridSrc.matchAll(/\bheight:\s*GRID_CELL_H\b/g)].length;
          const minH = [...gridSrc.matchAll(/\bminHeight:/g)].length;
          if (cellH !== 1 || minH !== 0) {
            fail(`§57 (e): the cell box declares ${cellH} \`height: GRID_CELL_H\` and ${minH} \`minHeight\`; it must be exactly one fixed shared height and no minimum. A minimum lets the row whose label wraps to more lines stretch its cells taller than the other row's, which draws one row as the larger case — measured live at 65px against 52px before this was pinned.`);
          }
          // Every dot in the figure — the four cell marks and the key's swatch
          // — takes both dimensions from the one shared constant. No literal
          // size anywhere is what keeps the marked cell from being drawn as
          // the larger case.
          //
          // ⚠️ THE FIRST VERSION OF THIS ASSERTION WAS A FALSE POSITIVE and it
          // failed the build on correct code, which is worth leaving written
          // down: it also grepped the dot's JSX for `r=` on the theory that an
          // SVG radius would mean someone had reintroduced a per-dot size.
          // `r=` matches inside `variant="caption"`. A substring is not a
          // token, and a check that fires on correct prose is worse than no
          // check — the same class as item 134's title/non-title join.
          const dotW = [...gridSrc.matchAll(/\bwidth:\s*GRID_DOT\b/g)].length;
          const dotH = [...gridSrc.matchAll(/\bheight:\s*GRID_DOT\b/g)].length;
          if (dotW < 1 || dotW !== dotH) {
            fail(`§57 (e): the figure declares ${dotW} width and ${dotH} height reference(s) to the shared GRID_DOT constant; every dot must take both dimensions from it. A literal size on either axis is a per-cell dot waiting to happen.`);
          }

          // ⚠️ (e2) THE CELL IS A DOT AND NOTHING ELSE — the invariant that
          //     actually holds the four cells equal, and the one this section
          //     did NOT have when it was first written.
          //
          //     WHY IT IS HERE. The checks above guard the two places a
          //     weighting could be *declared*: unequal column fractions and a
          //     per-cell height. The first version of this figure had neither
          //     defect and still rendered the bottom row half again as tall as
          //     the top one — 82px against 52px, measured in a live browser —
          //     because Maria's label sat inside her cell and CSS grid sizes a
          //     row to its tallest item. Nothing was declared unequal; the
          //     inequality arrived through CONTENT, which a source check
          //     reading style literals cannot see. That is the composition
          //     class §43 exists for, in a figure whose whole argument is that
          //     the four cells are the same.
          //
          //     So the invariant is structural rather than stylistic: text
          //     goes in the key below the grid, never in a cell. Assert it on
          //     the cell's own JSX rather than on the whole component, or the
          //     key's label would satisfy it.
          const cellStart = gridSrc.indexOf("const cell = cellAt(row, col);");
          const cellEnd = gridSrc.indexOf("          }),", cellStart);
          if (cellStart < 0 || cellEnd < 0) {
            fail("§57 CONTROL (e2): the per-cell JSX could not be located in OutcomeGrid, so the no-text-in-a-cell assertion below would pass by matching nothing.");
          } else {
            const cellJsx = gridSrc.slice(cellStart, cellEnd);
            const textInCell = [...cellJsx.matchAll(/<Text\b/g)].length;
            if (textInCell > 0) {
              fail(`§57 (e2): a cell renders ${textInCell} <Text> element(s). A cell must contain the dot and nothing else — CSS grid sizes a row to its tallest item, so text in one cell grows that whole row and draws it as the larger case, which is exactly the weighting this figure must not assert. Put the label in the key below the grid, where it can wrap and translate without touching a cell. (This is not hypothetical: it is how the first version of this figure rendered, at 82px against 52px.)`);
            }
          }
        }
      }

      // (f) Maria's figure is the lesson's own. The label prints "40%" and
      //     lesson 28's opening is where that comes from; §2.3's standing rule
      //     is that every number on screen is the lesson's teaching example
      //     rather than a reading of anything.
      if (!body28en.includes("up 40%")) {
        fail('§57 (f): lesson 28\'s en body no longer contains "up 40%", but the figure prints 40% as Maria\'s result. Re-read the lesson and take the figure\'s number from it rather than leaving a figure that quotes a number its lesson stopped stating.');
      }

      // (g) Five-language parity for everything the figure renders, including
      //     the text alternative — the grid is a single `role="img"`, so
      //     `outcomeDescription` is all a screen-reader user gets of it (§22).
      for (const key of ["outcomeTitle", "outcomeSpanLabel", "outcomeHereLabel", "outcomeCaption", "outcomeDescription"]) {
        for (const lang of LANGS) {
          if (!String(mv[key][lang] ?? "").trim()) {
            fail(`§57: ${key}.${lang} is missing or empty. Every one of these renders on screen in that language, and outcomeDescription is the figure's only text alternative.`);
          }
        }
      }
      for (const key of ["outcomeColumnLabels", "outcomeRowLabels"]) {
        for (const lang of LANGS) {
          const v = mv[key][lang];
          if (!Array.isArray(v) || v.length !== 2 || v.some((x) => !String(x ?? "").trim())) {
            fail(`§57: ${key}.${lang} must be 2 non-empty strings; got ${Array.isArray(v) ? `${v.length} entries` : typeof v}. The grid indexes it positionally, so a short array renders an unlabeled axis rather than throwing.`);
          }
        }
      }
    }

    if (failures === before57) {
      console.log(
        `  §57 lesson 28's outcome grid holds: the 2x2 partition is complete with one marked cell at (1,1), ` +
          `both row labels found in lesson 28's own body in all ${LANGS.length} languages (control both directions per language), ` +
          `3 claim clauses and the 40% present in the en body, and the rendered geometry carries no weighting ` +
          `(equal outcome columns, one shared fixed cell height and no minimum, one shared dot size, and no text inside any cell).`,
      );
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// §58. EVERY CROSS-REFERENCE SURVIVES TRANSLATION (backlog item 138).
//
// THE FAILURE THIS EXISTS FOR, with a date on it. Item 84 (2026-08-20,
// `7046854`) converted every cross-reference from a number to a lesson TITLE
// and, in the same commit, gave lessons 1 and 4 a new pointer each. Neither
// pointer was carried into any translation. That state — 32 of 40 cross-track
// reference instances present — stood for EIGHT DAYS and `npm test` was green
// the whole time, because nothing in this file checked that a translation
// carries a reference AT ALL. Verified from history rather than remembered:
// `git archive 7046854` shows both English sentences present and all four
// translations missing both target titles, with a control proving the same
// grep finds titles that WERE there on that date.
//
// §33 DID NOT COVER IT EITHER, and the reason is worth keeping. Adding an
// English sentence without translating it lowers that pair's ratio, which is
// exactly what §33 watches — so §33 looks like it should have caught this. It
// could not: §33 and `translation-completeness-baseline.json` did not exist on
// 2026-08-20 (verified — the baseline file was first added 2026-08-21 by
// `e455663`). It arrived one day AFTER the defect and recorded the already-
// degraded ratio as the norm, so it had nothing to fail against. A baseline
// taken after a defect makes the defect the baseline.
//
// WHY §16b CANNOT SEE IT, which is the whole reason this is a separate check.
// §16b asserts the ABSENCE of numeric "Lesson N" prose. It succeeds by finding
// nothing, and it succeeds just as loudly when a translation contains no
// reference of any kind. §16's per-reference consistency checks run over the
// numeric form too, so after item 84 they count zero and are vacuous by
// construction. Absence checks cannot detect absence of the thing that
// replaced what they removed.
//
// WHAT IS ASSERTED. The reference set is derived from ENGLISH: every span
// wrapped in English's title marks whose head exactly matches a lesson title
// head. For each such reference, every other language must carry that target
// lesson's own title head, wrapped in THAT language's title marks.
//
// SCOPE is lesson prose AND quizData's `explain` fields — the same two
// surfaces §16 covered in the numeric era, so the title era does not silently
// cover less. An `explain` field is scoped per quiz item, not pooled per
// lesson, for the reason §16's header already gives: an explain has no sibling
// field a translation could legitimately move the reference into, so pooling
// would re-open the hole.
//
// WHY A HARD FAILURE RATHER THAN A WARNING, given that §16's own header says
// "translations legitimately condense and drop references, so a lower count
// than English is normal". That was written about a COUNT tripwire over the
// numeric forms, and it does not describe this corpus's title references.
// Measured: every one of the 176 instances survives, including in the most
// heavily abridged translations in the catalog — lesson 6's `zh` keeps its
// reference at a 0.125x ratio, dropping seven eighths of the English and the
// reference anyway; lesson 10 `zh` 0.164x and lesson 9 `zh` 0.173x likewise.
// Dropping a title reference is not something this corpus does when it
// condenses, so a warning would only be ignored — and a warning is what the
// eight days above already amounted to.
//
// TWO DESIGN DECISIONS, both measured rather than assumed:
//
// (a) MATCH THE SPAN EXACTLY; NEVER `includes("<opening mark><head>")`.
//     "Credit" is a prefix of both "Credit Scores" and "Credit Reports vs.
//     Credit Scores" (the check prints this probe), so a prefix match would
//     silently count a quotation of the longer title as a reference to the
//     shorter lesson. Extracting spans and comparing heads for equality
//     removes that class instead of ordering around it.
//
// (b) REQUIRE THE TARGET TO BE MARKED AS A TITLE, not merely mentioned.
//     Fourteen lesson heads are ordinary common nouns — "Credit", "Taxes",
//     "Insurance", "Transactions", "Budgeting" — so a bare substring test
//     would accept the ordinary word and call a dropped reference present.
//     Requiring the per-language title marks (§56's repertoire: en/es “”,
//     ko 「」, zh 《》, ja 『』) is what makes the assertion mean something.
//     It also closes the gap §56's own header records as out of its reach:
//     §56 reads REPERTOIRE and "cannot tell a title reference from an
//     ordinary quotation". This check knows which spans are title references,
//     because English says so — so it can require the target be marked as a
//     title, which §56 has no context to do.
//
// The two failure modes are reported separately on purpose: MISSING (the
// translation dropped the reference — the item-138 defect) and UNMARKED (the
// title is there as bare prose — the §56 title-drift class). They have
// different fixes.
{
  const before58 = failures;
  // §56's per-language TITLE marks. Note the head split accepts BOTH colons:
  // an ASCII-only split makes every zh/ja head the entire title and reports
  // correct references as missing — that error produced a wrong count of 15
  // against a true 8 while item 138 was being written.
  const TITLE_MARKS = { en: ["“", "”"], es: ["“", "”"], ko: ["「", "」"], zh: ["《", "》"], ja: ["『", "』"] };
  const refHead = (t) => String(t).split(/[:：]/)[0].trim();
  const titleSpans = (txt, lang) => {
    const [open, close] = TITLE_MARKS[lang];
    const out = [];
    let i = 0;
    while ((i = txt.indexOf(open, i)) !== -1) {
      const j = txt.indexOf(close, i + open.length);
      if (j === -1) break;
      out.push(txt.slice(i + open.length, j));
      i = j + close.length;
    }
    return out;
  };
  const proseOf = (entry, lang) =>
    [...entry.sections.map((sec) => sec.body), ...entry.sections.map((sec) => sec.heading), entry.takeaway, entry.thinkAbout]
      .filter(Boolean)
      .map((f) => f?.[lang] ?? "")
      .join("\n");

  const byLessonId = new Map(lessons.map((l) => [l.id, l]));
  const enHeadToId = new Map(lessons.map((l) => [refHead(l.title.en), l.id]));

  // Derive the references from English, over both surfaces. A lesson-prose
  // reference is keyed by (lesson, target) — one carrier per lesson is enough,
  // and English itself writes several of them twice. A quiz reference is keyed
  // by (item index, target), per the scope note above.
  const references = new Map();
  const addRef = (scope, key, label, texts, targetOf) => {
    for (const span of titleSpans(texts.en, "en")) {
      const targetId = enHeadToId.get(refHead(span));
      if (targetId == null || targetId === targetOf) continue;
      references.set(`${scope}:${key}->${targetId}`, { scope, key, label, texts, to: targetId });
    }
  };
  for (const l of lessons) {
    const entry = lessonContent[String(l.id)];
    if (!entry) continue;
    const texts = Object.fromEntries(LANGS.map((lang) => [lang, proseOf(entry, lang)]));
    addRef("lesson", l.id, `lesson ${l.id}`, texts, l.id);
  }
  quizData.forEach((item, index) => {
    if (!item.explain) return;
    const texts = Object.fromEntries(LANGS.map((lang) => [lang, item.explain[lang] ?? ""]));
    addRef("quiz", index, `quiz item ${index} (lesson ${item.lesson})`, texts, item.lesson);
  });
  const refs = [...references.values()];
  const lessonRefs = refs.filter((r) => r.scope === "lesson").length;

  // CONTROL A — coverage tripwire. A pattern that matches nothing presents as
  // a clean pass, which is the failure mode this file has shipped twice (§16's
  // dead surface-form patterns, §55's missing .mjs extension). 44 references
  // stood when this was written; anything near zero means the extractor broke.
  if (refs.length < 30) {
    fail(
      `§58 CONTROL A: only ${refs.length} title cross-references were extracted from English; 44 stood when this check was written. ` +
        `A count this low means the span extractor or the head match is broken, and every clean result below is meaningless.`,
    );
  }

  // CONTROL B/C — the matcher must accept a real marked title and reject both
  // a bare mention and the wrong language's marks. Specimens are literals, so
  // these fire even if the corpus is empty.
  const marked = (txt, head, lang) => titleSpans(txt, lang).some((sp) => refHead(sp) === head);
  if (!marked("《税收》解释过", "税收", "zh")) {
    fail("§58 CONTROL B: the matcher cannot find a zh title inside zh's own title marks, so every 'present' verdict below is unreliable.");
  }
  if (marked("税收上升", "税收", "zh")) {
    fail("§58 CONTROL C1: the matcher counts a BARE mention as a marked title, which is exactly the common-noun false positive it exists to avoid.");
  }
  if (marked("『税收』", "税收", "zh")) {
    fail("§58 CONTROL C2: the matcher accepts ja's title marks as zh's, so it cannot detect a per-language marking error.");
  }

  let missing = 0;
  let unmarked = 0;
  for (const ref of refs) {
    const targetTitle = byLessonId.get(ref.to).title;
    for (const lang of LANGS) {
      if (lang === "en") continue;
      const head = refHead(targetTitle[lang]);
      const prose = ref.texts[lang] ?? "";
      if (marked(prose, head, lang)) continue;
      const [open, close] = TITLE_MARKS[lang];
      if (prose.includes(head)) {
        unmarked++;
        fail(
          `§58: ${ref.label} [${lang}] mentions "${head}" but not as a title — English refers to lesson ${ref.to} ` +
            `("${refHead(targetTitle.en)}") as a quoted title there. Wrap it in ${lang}'s title marks ${open}${close} (§56's repertoire), ` +
            `so a reader can tell the reference from an ordinary use of the words.`,
        );
      } else {
        missing++;
        fail(
          `§58: ${ref.label} [${lang}] does not reference lesson ${ref.to} ("${refHead(targetTitle[lang])}") at all, ` +
            `but the English does, as a quoted title. This is the item-138 defect: a translation that silently drops a ` +
            `cross-reference leaves a non-English reader with no thread to the lesson the English points them at. ` +
            `Add the reference using that lesson's own ${lang} title from lessons.js.`,
        );
      }
    }
  }

  if (failures === before58) {
    console.log(
      `  §58 cross-references survive translation: ${refs.length} English title references ` +
        `(${lessonRefs} in lesson prose, ${refs.length - lessonRefs} in quiz explanations), ` +
        `${refs.length * (LANGS.length - 1)} translated instances, 0 dropped and 0 present-but-unmarked ` +
        `(control A ${refs.length} refs extracted, control B a marked title is found, control C a bare mention and ` +
        `the wrong language's marks are both rejected). Matches spans exactly, so "Credit" cannot match "Credit Scores".`,
    );
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s), ${warnings} warning(s).`);
process.exit(failures === 0 ? 0 : 1);
