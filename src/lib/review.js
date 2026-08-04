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
// State shape, keyed by the question's index in `quizData`:
//   { "3": { box: 2, due: "2026-08-06", seen: 4, wrong: 1 } }
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

export function loadReview() {
  const raw = readJSON(KEYS.review, {});
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
}

export function saveReview(state) {
  writeJSON(KEYS.review, state);
}

// Applies one answer and returns the updated state. Correct → up a box (capped);
// wrong → back to box 1, because a missed item deserves the shortest interval
// regardless of how well it was known before.
export function recordAnswer(state, questionIndex, wasCorrect, today = todayStr()) {
  const key = String(questionIndex);
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

// Questions waiting to be reviewed today: anything already seen whose due date
// has arrived. Never-seen questions are NOT included — they belong to their
// lesson's own check, not to review; surfacing them here would ask about
// material the learner hasn't reached yet.
export function dueQuestions(state, allQuestions, today = todayStr()) {
  return allQuestions
    .map((question, index) => ({ question, index }))
    .filter(({ index }) => {
      const entry = state[String(index)];
      if (!entry || !entry.due) return false;
      return dayDiff(entry.due, today) >= 0;   // due today or overdue
    })
    // Most-overdue first, then weakest box, so the shakiest material leads.
    .sort((a, b) => {
      const ea = state[String(a.index)];
      const eb = state[String(b.index)];
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
