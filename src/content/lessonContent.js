// ═══════════════════════════════════════════════════════════════════════════
// LESSON CONTENT (merged — every track, every language)
//
// NOT FOR THE BROWSER. Importing this pulls in all ten per-language content
// files at once, which is precisely what the 2026-08-17 split (backlog item
// 45) exists to avoid. Its only consumers are node-side and never bundled:
//   • scripts/check-data.mjs        — data-shape and 5-language parity checks
//   • scripts/translation-review.mjs — coverage and English-source hashes
// Both genuinely need every language side by side, which is the one job the
// split files cannot do on their own.
//
// HISTORY. Content was one file until 2026-08-14, when item 25 split it per
// track so LessonReader could load only the track being read. That fixed the
// code chunk but left a subtler waste in place: each per-track file still
// carried all five languages, so lessonContent.money.js shipped 480 kB of
// body text to a reader who could read at most ~97 kB of it. Measured
// 2026-08-16: en 97 kB, es 90, ko 102, zh 79, ja 112 — four fifths of the
// app's largest asset was text that particular device would never display.
// Item 45 split the second axis, and LessonReader now imports exactly one
// (track, language) file.
//
// The reassembly below is the inverse of that split, and it is deliberately
// tolerant rather than defensive: it builds each language map from whatever
// the ten files actually contain, so a lesson missing from one language, or a
// section count that disagrees across languages, surfaces as a normal
// check-data.mjs parity failure naming the exact field — not as a crash here,
// and not as a silently dropped language. The checks that already exist are a
// better error message than anything this file could throw.
// ═══════════════════════════════════════════════════════════════════════════

import { lessonContent as economyEn } from "./lessonContent.economy.en.js";
import { lessonContent as economyEs } from "./lessonContent.economy.es.js";
import { lessonContent as economyKo } from "./lessonContent.economy.ko.js";
import { lessonContent as economyZh } from "./lessonContent.economy.zh.js";
import { lessonContent as economyJa } from "./lessonContent.economy.ja.js";
import { lessonContent as moneyEn } from "./lessonContent.money.en.js";
import { lessonContent as moneyEs } from "./lessonContent.money.es.js";
import { lessonContent as moneyKo } from "./lessonContent.money.ko.js";
import { lessonContent as moneyZh } from "./lessonContent.money.zh.js";
import { lessonContent as moneyJa } from "./lessonContent.money.ja.js";

const BY_LANG = {
  en: { ...economyEn, ...moneyEn },
  es: { ...economyEs, ...moneyEs },
  ko: { ...economyKo, ...moneyKo },
  zh: { ...economyZh, ...moneyZh },
  ja: { ...economyJa, ...moneyJa },
};

const LANGS = Object.keys(BY_LANG);

/** { en: "…", es: "…", … } for one field, across whatever languages have it. */
function langMap(pick) {
  const out = {};
  for (const lang of LANGS) {
    const value = pick(BY_LANG[lang]);
    if (value !== undefined) out[lang] = value;
  }
  return out;
}

// Lesson ids and section counts come from the union across languages, not from
// English alone. Taking English as the spine would hide the opposite failure —
// a lesson or section present in a translation but missing from English — by
// silently never looking at it.
const ids = [...new Set(LANGS.flatMap((l) => Object.keys(BY_LANG[l])))];

export const lessonContent = Object.fromEntries(
  ids.map((id) => {
    const sectionCount = Math.max(
      ...LANGS.map((l) => BY_LANG[l][id]?.sections?.length ?? 0),
    );
    return [
      id,
      {
        sections: Array.from({ length: sectionCount }, (_, i) => ({
          heading: langMap((c) => c[id]?.sections?.[i]?.heading),
          body: langMap((c) => c[id]?.sections?.[i]?.body),
        })),
        takeaway: langMap((c) => c[id]?.takeaway),
        thinkAbout: langMap((c) => c[id]?.thinkAbout),
      },
    ];
  }),
);
