// ═══════════════════════════════════════════════════════════════════════════
// QUIZ METADATA — language-independent, one entry per question, in order
//
// Split out of quizData.js 2026-08-17 (backlog item 48) when the question
// TEXT was split per language. These two fields are the same in every
// language, so they live once rather than five times: duplicating an answer
// key across five files is exactly the drift this project keeps paying for.
//
// ORDER IS LOAD-BEARING AND MUST NOT CHANGE. src/lib/review.js keys every
// learner's Leitner state by a question's INDEX in this array, and that state
// is persisted in localStorage. Reordering, inserting anywhere but the end, or
// removing an entry silently re-points real users' review history at different
// questions. Append only.
//
// NOTE ON ANSWER POSITIONS: the correct option is deliberately spread across
// indices (roughly 3/3/4/3 over 0/1/2/3) so the quiz cannot be beaten by
// always tapping the same position. Before this was fixed, 12 of 13 answers
// were index 0 — tap-the-first scored 92%. `npm test` warns if any single
// index ever holds more than half the answers again. When adding a question,
// pick a position that keeps the spread even; when editing options, move the
// whole option string and update `answer` to match — never leave `answer`
// pointing at a position by habit.
// ═══════════════════════════════════════════════════════════════════════════

export const quizMeta = [
  {
    "lesson": 29,
    "answer": 2
  },
  {
    "lesson": 30,
    "answer": 0
  },
  {
    "lesson": 32,
    "answer": 3
  },
  {
    "lesson": 30,
    "answer": 1
  },
  {
    "lesson": 34,
    "answer": 3
  },
  {
    "lesson": 36,
    "answer": 2
  },
  {
    "lesson": 37,
    "answer": 0
  },
  {
    "lesson": 40,
    "answer": 3
  },
  {
    "lesson": 31,
    "answer": 1
  },
  {
    "lesson": 34,
    "answer": 2
  },
  {
    "lesson": 35,
    "answer": 0
  },
  {
    "lesson": 38,
    "answer": 1
  },
  {
    "lesson": 39,
    "answer": 2
  },
  {
    "lesson": 33,
    "answer": 1
  },
  {
    "lesson": 1,
    "answer": 3
  },
  {
    "lesson": 2,
    "answer": 0
  },
  {
    "lesson": 3,
    "answer": 2
  },
  {
    "lesson": 4,
    "answer": 1
  },
  {
    "lesson": 5,
    "answer": 3
  },
  {
    "lesson": 6,
    "answer": 0
  },
  {
    "lesson": 7,
    "answer": 2
  },
  {
    "lesson": 8,
    "answer": 1
  },
  {
    "lesson": 9,
    "answer": 0
  },
  {
    "lesson": 10,
    "answer": 3
  },
  {
    "lesson": 11,
    "answer": 1
  },
  {
    "lesson": 12,
    "answer": 2
  },
  {
    "lesson": 13,
    "answer": 3
  },
  {
    "lesson": 14,
    "answer": 0
  },
  {
    "lesson": 15,
    "answer": 2
  },
  {
    "lesson": 16,
    "answer": 1
  },
  {
    "lesson": 17,
    "answer": 3
  },
  {
    "lesson": 18,
    "answer": 0
  },
  {
    "lesson": 19,
    "answer": 0
  },
  {
    "lesson": 20,
    "answer": 3
  },
  {
    "lesson": 21,
    "answer": 2
  },
  {
    "lesson": 22,
    "answer": 1
  },
  {
    "lesson": 23,
    "answer": 1
  },
  {
    "lesson": 24,
    "answer": 2
  },
  {
    "lesson": 25,
    "answer": 3
  },
  {
    "lesson": 26,
    "answer": 0
  },
  {
    "lesson": 27,
    "answer": 1
  },
  {
    "lesson": 28,
    "answer": 2
  }
];
