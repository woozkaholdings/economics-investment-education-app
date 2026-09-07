// ═══════════════════════════════════════════════════════════════════════════
// SPACED REVIEW
//
// A Leitner box scheduler. Answer a question correctly and it moves up a box
// and comes back later; get it wrong and it drops to box 1 and comes back
// tomorrow. This is the mechanic with the strongest evidence behind it in the
// learning-science literature (spacing effect + retrieval practice), and the
// app previously had none of it — Practice was a one-shot test that never
// resurfaced anything.
//
// Pure functions plus a thin persistence layer, so the schedule can be reasoned
// about (and tested) without a browser.
//
// State shape, keyed by the question's STABLE `id` (see quizMeta.js):
//   { "q003": { box: 2, due: "2026-08-06", seen: 4, wrong: 1 } }
//
// WHY AN ID AND NOT THE ARRAY INDEX, which is what this keyed on until
// 2026-09-01. The index is a position in `quizMeta`, and a position is not a
// question: insert, delete or reorder one entry and every key from that point
// on names a different question than it did when it was written. The whole
// suite passes while that happens — a two-question reorder across all six quiz
// files was injected and `npm test` exited 0 — so the only thing standing
// between a content edit and a corrupted schedule was a comment asking authors
// to append. Failures of that kind land on a device, after the edit ships, and
// look like the app asking about material the learner has never seen while
// treating a question they keep missing as mastered.
// ═══════════════════════════════════════════════════════════════════════════

import { KEYS, readJSON, writeJSON } from "./storage.js";
import { todayStr, dayDiff } from "../utils/date.js";

// Days until a question in each box comes back. Box 1 returns the next day;
// the intervals roughly double so well-known items stop taking up attention.
export const BOX_INTERVALS = [1, 2, 4, 8, 16];
export const MAX_BOX = BOX_INTERVALS.length;

function addDays(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}

// `idsByIndex` is quizMeta's id list in array order, passed in rather than
// imported so this module stays free of content. It is only used to migrate a
// pre-2026-09-01 state object, whose keys are numeric indices into that same
// array — so index i means exactly idsByIndex[i], and the mapping is correct
// for every device that wrote its state before the id landed.
export function loadReview(idsByIndex = []) {
  const raw = readJSON(KEYS.review, {});
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return migrateIndexKeys(raw, idsByIndex);
}

// Numeric keys are the old shape. A key past the end of `idsByIndex` names a
// question that no longer exists and is dropped: the alternative is inventing
// an id for it, which would put a phantom entry in the schedule forever.
export function migrateIndexKeys(state, idsByIndex) {
  if (!Object.keys(state).some((k) => /^\d+$/.test(k))) return state;
  const out = {};
  for (const [key, value] of Object.entries(state)) {
    if (!/^\d+$/.test(key)) { out[key] = value; continue; }
    const id = idsByIndex[Number(key)];
    if (id !== undefined && out[id] === undefined) out[id] = value;
  }
  return out;
}

export function saveReview(state) {
  writeJSON(KEYS.review, state);
}

// Applies one answer and returns the updated state. Correct → up a box (capped);
// wrong → back to box 1, because a missed item deserves the shortest interval
// regardless of how well it was known before.
export function recordAnswer(state, questionId, wasCorrect, today = todayStr()) {
  const key = String(questionId);
  const prev = state[key] || { box: 0, seen: 0, wrong: 0 };
  const box = wasCorrect ? Math.min(prev.box + 1, MAX_BOX) : 1;
  return {
    ...state,
    [key]: {
      box,
      due: addDays(today, BOX_INTERVALS[box - 1]),
      seen: (prev.seen || 0) + 1,
      wrong: (prev.wrong || 0) + (wasCorrect ? 0 : 1),
    },
  };
}

// Whether an answer to this question should move the schedule at all.
//
// True when the question has never been answered, or when its interval has
// elapsed and it is due — deliberately the SAME rule `dueQuestions` filters
// on, so the end-of-lesson check accepts an answer exactly when review would
// have served the question.
//
// This exists because `Question`'s "one answer per question" lock is component
// state, so it lasts as long as the mount and not as long as the answer. The
// lesson check re-mounts on any ordinary navigation — switching language,
// leaving the lesson and coming back — and every re-mount re-armed it, so a
// second answer to the same question landed in the schedule as if it were a
// new one. Measured live 2026-09-07 on the built app: answer lesson 1's check
// wrong (`q001` box 1, seen 1, due tomorrow), switch to Chinese, answer it
// again — box 2, seen 2, due a day further out. The question the learner had
// just missed was PROMOTED, and re-opening the lesson did the same thing.
//
// The rule is the scheduler's own, not a lock, which is what makes the other
// direction still work: come back after the interval and the check records
// normally, because by then the question really is due.
//
// Practice deliberately does NOT use this — practicing more than the schedule
// asks is one of that screen's stated design choices, and its "all questions"
// pool exists precisely to re-drill things that are not due.
export function acceptsScheduleUpdate(state, questionId, today = todayStr()) {
  const entry = (state || {})[String(questionId)];
  if (!entry || !entry.due) return true;
  return dayDiff(entry.due, today) >= 0;
}

// Questions waiting to be reviewed today: anything already seen whose due date
// has arrived. Never-seen questions are NOT included — they belong to their
// lesson's own check, not to review; surfacing them here would ask about
// material the learner hasn't reached yet.
// `index` is still carried on every returned item, because it is how the
// caller merges in the words from the loaded quizText.<lang> module. It is a
// position for text lookup and nothing else — the schedule is read and written
// by `question.id`.
export function dueQuestions(state, allQuestions, today = todayStr()) {
  return allQuestions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => {
      const entry = state[question.id];
      if (!entry || !entry.due) return false;
      return dayDiff(entry.due, today) >= 0;   // due today or overdue
    })
    // Most-overdue first, then weakest box, so the shakiest material leads.
    .sort((a, b) => {
      const ea = state[a.question.id];
      const eb = state[b.question.id];
      const overdue = dayDiff(eb.due, today) - dayDiff(ea.due, today);
      return overdue !== 0 ? overdue : (ea.box || 0) - (eb.box || 0);
    });
}

// Everything the learner has answered at least once, for the "all practice"
// fallback when nothing is due.
export function seenCount(state) {
  return Object.keys(state).length;
}

// Questions belonging to one lesson, with their global indices preserved so
// answers recorded from a lesson check land in the same schedule as review.
export function questionsForLesson(allQuestions, lessonId) {
  return allQuestions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.lesson === lessonId);
}

// How many questions sit in each Leitner box, index 0 = box 1. Feeds the
// Review screen's distribution strip, which is the only place the schedule's
// SHAPE is visible — everything else on that screen reports what is due today,
// so a learner could use review for weeks without ever seeing that the boxes
// exist or that their material is moving up them.
//
// Entries whose box is outside 1..MAX_BOX are DROPPED rather than clamped.
// `recordAnswer` above can only ever write 1..MAX_BOX, so an out-of-range box
// came from a corrupted or a future state object; folding it into box 1 or box
// MAX_BOX would put a question on the strip in a box the schedule does not
// actually hold it in, and the strip would then disagree with the queue that
// `dueQuestions` builds from the same state. Dropping means the counts always
// sum to something the scheduler would recognize — which is why the caller
// gates on this function's own total and not on `seenCount`.
export function boxDistribution(state) {
  const counts = new Array(MAX_BOX).fill(0);
  for (const entry of Object.values(state || {})) {
    const box = entry && entry.box;
    if (!Number.isInteger(box) || box < 1 || box > MAX_BOX) continue;
    counts[box - 1] += 1;
  }
  return counts;
}
