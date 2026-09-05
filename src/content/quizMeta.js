// ═══════════════════════════════════════════════════════════════════════════
// QUIZ METADATA — language-independent, one entry per question, in order
//
// Split out of quizData.js 2026-08-17 (backlog item 48) when the question
// TEXT was split per language. These fields are the same in every language,
// so they live once rather than five times: duplicating an answer key across
// five files is exactly the drift this project keeps paying for.
//
// `id` IS THE ONE FIELD THAT MUST NEVER CHANGE OR BE REUSED (2026-09-01).
// src/lib/review.js keys every learner's persisted Leitner state by it. The
// ids are opaque and sequential only because they were assigned in one pass;
// they carry no meaning, and in particular they do NOT track the lesson a
// question belongs to — this repo renumbers lessons, and an id that followed
// a lesson number would be a rename waiting to happen. When adding a question
// use the next unused number wherever the entry sits; when deleting one,
// retire its id rather than handing it to a different question. A reused id
// silently inherits a real learner's review history.
//
// UNTIL 2026-09-01 THAT KEY WAS THE ARRAY INDEX, and this header said "ORDER
// IS LOAD-BEARING AND MUST NOT CHANGE … append only". It was an unenforced
// comment: a reorder of two questions across all six quiz files passes the
// entire suite (measured by injection, exit 0). Keying by id removes the
// hazard instead of guarding it.
//
// ORDER IS STILL LOAD-BEARING FOR A SECOND, NARROWER REASON: entry i here is
// entry i of every quizText.<lang>.js, which is how the words are merged in.
// That alignment is a build-time invariant — check-data.mjs §3 fails on a
// half-added question — and a misalignment shows up as visibly wrong text,
// not as silently corrupted state on someone's device. Reordering now means
// reordering all six files together, and nothing is lost if you do.
//
// NOTE ON ANSWER POSITIONS: the correct option is deliberately spread across
// indices so the quiz cannot be beaten by always tapping the same position.
// Before that was fixed, 12 of 13 answers were index 0 — tap-the-first scored
// 92%. `check-data.mjs` §3 recomputes the distribution on every `npm test` and
// warns when any single index holds more than half the answers again. When
// adding a question, pick a position that keeps the spread even; when editing
// options, move the whole option string and update `answer` to match — never
// leave `answer` pointing at a position by habit.
//
// This note used to quote the split as "roughly 3/3/4/3 over 0/1/2/3". That
// was true of a 13-question corpus and was then retyped here, unchecked, until
// 2026-09-04 — by which date it named neither the count nor the spread of the
// live file. It quotes no number now, on purpose: §3 derives the distribution
// from this array on every run, and a figure a script prints is the only kind
// that cannot rot in a header comment.
// ═══════════════════════════════════════════════════════════════════════════

export const quizMeta = [
  {
    "id": "q001",
    "lesson": 29,
    "answer": 2
  },
  {
    "id": "q002",
    "lesson": 30,
    "answer": 0
  },
  {
    "id": "q003",
    "lesson": 32,
    "answer": 3
  },
  {
    "id": "q004",
    "lesson": 32,
    "answer": 1
  },
  {
    "id": "q005",
    "lesson": 34,
    "answer": 3
  },
  {
    "id": "q006",
    "lesson": 36,
    "answer": 2
  },
  {
    "id": "q007",
    "lesson": 37,
    "answer": 0
  },
  {
    "id": "q008",
    "lesson": 40,
    "answer": 3
  },
  {
    "id": "q009",
    "lesson": 31,
    "answer": 1
  },
  {
    "id": "q010",
    "lesson": 34,
    "answer": 2
  },
  {
    "id": "q011",
    "lesson": 35,
    "answer": 0
  },
  {
    "id": "q012",
    "lesson": 38,
    "answer": 1
  },
  {
    "id": "q013",
    "lesson": 39,
    "answer": 2
  },
  {
    "id": "q014",
    "lesson": 33,
    "answer": 1
  },
  {
    "id": "q015",
    "lesson": 1,
    "answer": 3
  },
  {
    "id": "q016",
    "lesson": 2,
    "answer": 0
  },
  {
    "id": "q017",
    "lesson": 3,
    "answer": 2
  },
  {
    "id": "q018",
    "lesson": 4,
    "answer": 1
  },
  {
    "id": "q019",
    "lesson": 5,
    "answer": 3
  },
  {
    "id": "q020",
    "lesson": 6,
    "answer": 0
  },
  {
    "id": "q021",
    "lesson": 7,
    "answer": 2
  },
  {
    "id": "q022",
    "lesson": 8,
    "answer": 1
  },
  {
    "id": "q023",
    "lesson": 9,
    "answer": 0
  },
  {
    "id": "q024",
    "lesson": 10,
    "answer": 3
  },
  {
    "id": "q025",
    "lesson": 11,
    "answer": 1
  },
  {
    "id": "q026",
    "lesson": 12,
    "answer": 2
  },
  {
    "id": "q027",
    "lesson": 13,
    "answer": 3
  },
  {
    "id": "q028",
    "lesson": 14,
    "answer": 0
  },
  {
    "id": "q029",
    "lesson": 15,
    "answer": 2
  },
  {
    "id": "q030",
    "lesson": 16,
    "answer": 1
  },
  {
    "id": "q031",
    "lesson": 17,
    "answer": 3
  },
  {
    "id": "q032",
    "lesson": 18,
    "answer": 0
  },
  {
    "id": "q033",
    "lesson": 19,
    "answer": 0
  },
  {
    "id": "q034",
    "lesson": 20,
    "answer": 3
  },
  {
    "id": "q035",
    "lesson": 21,
    "answer": 2
  },
  {
    "id": "q036",
    "lesson": 22,
    "answer": 1
  },
  {
    "id": "q037",
    "lesson": 23,
    "answer": 1
  },
  {
    "id": "q038",
    "lesson": 24,
    "answer": 2
  },
  {
    "id": "q039",
    "lesson": 25,
    "answer": 3
  },
  {
    "id": "q040",
    "lesson": 26,
    "answer": 0
  },
  {
    "id": "q041",
    "lesson": 27,
    "answer": 1
  },
  {
    "id": "q042",
    "lesson": 28,
    "answer": 2
  },
  {
    "id": "q043",
    "lesson": 41,
    "answer": 1
  },
  {
    "id": "q044",
    "lesson": 42,
    "answer": 2
  },
  {
    "id": "q045",
    "lesson": 43,
    "answer": 2
  },
  {
    "id": "q046",
    "lesson": 44,
    "answer": 1
  }
];
