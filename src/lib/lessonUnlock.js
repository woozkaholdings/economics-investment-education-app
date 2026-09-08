// ═══════════════════════════════════════════════════════════════════════════
// LESSON UNLOCKING
//
// The one predicate that decides whether a lesson row on the path is open.
// It lived inline in `App.jsx` until 2026-09-08; it is here because it is pure
// logic that `check-data.mjs` §80 exercises directly, and a rule that gates
// the whole curriculum should be testable without rendering a screen.
//
// The rule, in two clauses:
//
//   1. A lesson the learner has ALREADY COMPLETED is always open.
//   2. Otherwise it opens when the previous lesson OF THE SAME TRACK is
//      completed. The first lesson of each track is always open.
//
// Clause 2 is the original rule and is the sequential bet in CLAIMS.md A1.
// Tracks gate independently — before 2026-08-07 this was a single global
// chain, which put the whole money curriculum behind twelve macro-theory
// lessons (see the TRACKS comment in content/lessons.js).
//
// ⚠️ Clause 1 was added 2026-09-08 (backlog item 171) and is not a softening
// of clause 2. Without it, `isUnlocked` never asked whether THIS lesson was
// finished, only whether the one in front of it was — so anything inserted at
// the FRONT of a track re-locked completed work. This repo does that: `b6c9bc9`
// (2026-08-25) prepended ids 41-44 to `money`, whose display order is now
// 41,42,43,44,16,17,…,28. Measured on the built app with completed `[16,17,18]`,
// the id-16 row rendered `disabled` under "Complete previous lessons first"
// while the SAME row announced "Completed" — the two labels are computed from
// different facts in `Learn.jsx` — and the learner could not reopen it.
//
// Clause 1 does not open anything the learner has not already been through, so
// it leaves A1 intact: A1 is a claim about gating UNSEEN lessons, and a lesson
// you have finished is not one of those.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Is the lesson at `index` in display order open to this learner?
 *
 * @param {Array<{id:number, track:string}>} lessons  lessons in DISPLAY order
 *   (`lessonsByTrack()`), because "the previous lesson" means the previous row
 *   on the path — ids are deliberately not aligned to display order.
 * @param {number} index  position in that array.
 * @param {number[]} completedLessons  completed lesson IDS, not indices.
 * @returns {boolean}
 */
export function isLessonUnlocked(lessons, index, completedLessons) {
  const lesson = lessons[index];
  if (!lesson) return false;

  // Clause 1 — finished work stays reachable, whatever moved in front of it.
  if (completedLessons.includes(lesson.id)) return true;

  // Clause 2 — the sequential chain, within this track only.
  const prev = lessons[index - 1];
  if (!prev || prev.track !== lesson.track) return true;   // first of its track
  return completedLessons.includes(prev.id);
}
