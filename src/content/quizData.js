// ═══════════════════════════════════════════════════════════════════════════
// QUIZ DATA (merged — every language)
//
// NOT FOR THE BROWSER. Importing this pulls in all five quizText files, which
// is what the 2026-08-17 split (backlog item 48) exists to avoid. Its only
// consumer is scripts/check-data.mjs, which genuinely needs every language
// side by side for its 5-language parity checks, its answer-spread warning,
// and §16's cross-reference comparison.
//
// The app does NOT import this. Practice.jsx and LessonReader.jsx take
// quizMeta.js statically — it is 3.5 kB and carries the `lesson`/`answer`
// fields that scheduling and grading need synchronously — and dynamically
// import one quizText.<lang>.js for the words.
//
// WHY. quizData.js used to hold questions and all five languages in one array,
// statically imported by both screens, so 128 kB of question text shipped to
// every reader when any one reader could read ~25 kB of it: en 25 kB, es 25,
// ko 28, zh 21, ja 30. Same shape of waste item 45 removed from lesson bodies,
// and the same fix applied one file later.
//
// The reassembly below is index-wise: entry i of quizMeta is entry i of every
// quizText. That alignment is the invariant the whole split rests on. It is a
// build-time one: check-data.mjs §3 fails on a half-added question, and a
// misalignment surfaces as visibly wrong words under a question rather than
// as silent damage on a device. Persisted Leitner state is keyed by the
// question's `id`, not by this position — see quizMeta.js's header for why
// that changed on 2026-09-01.
// ═══════════════════════════════════════════════════════════════════════════

import { quizMeta } from "./quizMeta.js";
import { quizText as en } from "./quizText.en.js";
import { quizText as es } from "./quizText.es.js";
import { quizText as ko } from "./quizText.ko.js";
import { quizText as zh } from "./quizText.zh.js";
import { quizText as ja } from "./quizText.ja.js";

const BY_LANG = { en, es, ko, zh, ja };
const LANGS = Object.keys(BY_LANG);

/** { en: …, es: … } for one field at one index, across the languages that have it. */
function langMap(index, pick) {
  const out = {};
  for (const lang of LANGS) {
    const value = pick(BY_LANG[lang][index]);
    if (value !== undefined) out[lang] = value;
  }
  return out;
}

// Length comes from the longest input, not from quizMeta, so a question added
// to one language but not to meta still surfaces to the parity checks instead
// of being silently dropped off the end.
const count = Math.max(quizMeta.length, ...LANGS.map((l) => BY_LANG[l].length));

export const quizData = Array.from({ length: count }, (_, i) => ({
  ...quizMeta[i],
  q: langMap(i, (t) => t?.q),
  opts: langMap(i, (t) => t?.opts),
  explain: langMap(i, (t) => t?.explain),
}));
