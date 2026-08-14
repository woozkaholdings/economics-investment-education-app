// ═══════════════════════════════════════════════════════════════════════════
// LESSON CONTENT (merged, all tracks)
//
// Split into per-track files on 2026-08-14 (backlog item 25, the real fix
// for the LessonReader chunk-size warning first raised 2026-08-09 and only
// mitigated — via a raised vite.config.js threshold — on 2026-08-12): the
// actual per-lesson body text now lives in lessonContent.economy.js and
// lessonContent.money.js, and LessonReader.jsx dynamically import()s only
// the track of the lesson being opened instead of pulling in every lesson's
// body up front. This file remains as a merged re-export for the two
// consumers that genuinely need every lesson regardless of track —
// scripts/check-data.mjs (data-shape and drift validation) and
// scripts/translation-review.mjs (coverage/hash checks) — neither of which
// is part of the client bundle, so merging here costs nothing in the app.
//
// lessons.js keeps the lightweight metadata (id, track, icon, color, title,
// subtitle, minutes) that Learn/App need to render the path itself. Every
// lesson id in the two per-track files must have a matching id in
// lessons.js and vice versa — scripts/check-data.mjs enforces that, plus
// that the `minutes` field in lessons.js still matches a fresh word count
// of this merged content, so the files can't silently drift apart.
// ═══════════════════════════════════════════════════════════════════════════

import { lessonContent as economyContent } from "./lessonContent.economy.js";
import { lessonContent as moneyContent } from "./lessonContent.money.js";

export const lessonContent = { ...economyContent, ...moneyContent };
