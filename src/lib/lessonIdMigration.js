// ═══════════════════════════════════════════════════════════════════════════
// LESSON ID MIGRATION (one-time, backlog item 22, 2026-08-14)
//
// Lesson ids were renumbered to match track display order: economy held
// 1-12 and money held 13-40 (an artifact of build order — see the TRACKS
// comment in content/lessons.js); now money is 1-28 and economy is 29-40.
//
// `ecycles_completed_lessons` persists raw lesson ids and gates unlocking
// (App.jsx's isUnlocked checks `completedLessons.includes(prev.id)`), so an
// already-installed user's progress must be remapped or their unlock state
// silently points at the wrong lessons after this update ships. The Leitner
// review schedule (`ecycles_review`) does NOT need this — it's keyed by a
// question's array index in quizData, not by lesson id, and that array's
// order never changed.
//
// This table is a historical fact about this one renumbering, not a general
// mechanism — a future renumbering would need its own table and migration.
export const OLD_TO_NEW_LESSON_ID = {
  1: 29, 2: 30, 3: 31, 4: 32, 5: 33, 6: 34, 7: 35, 8: 36, 9: 37, 10: 38, 11: 39, 12: 40,
  13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7, 20: 8, 21: 9, 22: 10, 23: 11, 24: 12,
  25: 13, 26: 14, 27: 15, 28: 16, 29: 17, 30: 18, 31: 19, 32: 20, 33: 21, 34: 22, 35: 23,
  36: 24, 37: 25, 38: 26, 39: 27, 40: 28,
};

export function migrateLegacyLessonIds(ids) {
  return ids.map((id) => OLD_TO_NEW_LESSON_ID[id] ?? id);
}
