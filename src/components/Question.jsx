// ═══════════════════════════════════════════════════════════════════════════
// QUESTION
//
// One multiple-choice question with immediate feedback. Shared by the
// end-of-lesson check and the spaced-review queue so a question looks and
// behaves identically wherever it appears — and so both routes record their
// result into the same schedule.
//
// The explanation is the point: a wrong answer teaches rather than scoring.
//
// `question` arrives with its text already resolved to one language — plain
// strings, not { en, es, … } maps. Since the 2026-08-17 quiz split (item 48)
// the words live in a per-language module the screens load, so the language
// is chosen before this component sees the question rather than by indexing
// a map here. `lang` is still taken because the caller passes it, but nothing
// below needs it.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import Icon from "./Icon.jsx";
import { Note, Text } from "./ui.jsx";
import { fill, ink, line, MIN_TAP, radius, space, surface } from "../theme.js";

export default function Question({ question, t, onAnswered, autoFocusHeading = false, reveal = true }) {
  const [choice, setChoice] = useState(null);
  const answered = choice !== null;
  // Answering and being told the answer are two different things. The
  // pre-lesson hook (`reveal={false}`) takes a guess and deliberately withholds
  // the verdict: disclosing it there would answer the question the lesson is
  // about to answer, and would leave the end-of-lesson check re-asking
  // something the reader was just told. See LessonReader's HOOK block.
  const disclosed = answered && reveal;
  const correct = choice === question.answer;

  const choose = (i) => {
    if (answered) return;                 // one answer per question
    setChoice(i);
    onAnswered?.(i === question.answer, i);
  };

  return (
    <div>
      <Text
        as="h3"
        variant="heading"
        color={ink.strong}
        tabIndex={autoFocusHeading ? -1 : undefined}
        style={{ marginBottom: space["3"], outline: "none" }}
      >
        {question.q}
      </Text>

      <div role="radiogroup" aria-label={question.q}>
        {question.opts.map((option, i) => {
          const isRight = i === question.answer;
          const picked = i === choice;

          // Three states, not two. Unanswered: neutral. Answered-and-disclosed:
          // mark the right answer and the learner's wrong pick, leaving the
          // others neutral so attention goes to the two that matter.
          // Answered-but-withheld (the hook): mark only what they picked, in
          // accent rather than ok/bad — the color must not leak a verdict.
          const border = !answered
            ? line.strong
            : !disclosed
              ? (picked ? fill.accent : line.hairline)
              : isRight ? fill.ok : picked ? fill.bad : line.hairline;
          const bg = !answered
            ? surface.card
            : !disclosed
              ? (picked ? surface.accentWash : surface.card)
              : isRight ? surface.okWash : picked ? surface.badWash : surface.card;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={picked}
              disabled={answered}
              onClick={() => choose(i)}
              style={{
                display: "flex", alignItems: "center", gap: space["3"],
                width: "100%", textAlign: "left",
                padding: `${space["3"]}px ${space["4"]}px`,
                // Already cleared 44 on this padding alone. Stated rather than
                // left to coincidence: a later padding change should not be
                // able to drop the answer options under the floor in silence.
                minHeight: MIN_TAP,
                marginBottom: space["2"],
                borderRadius: radius.md,
                border: `1.5px solid ${border}`,
                background: bg,
                color: ink.body,
                fontSize: "1rem",
                fontWeight: disclosed && isRight ? 600 : 400,
                cursor: answered ? "default" : "pointer",
              }}
            >
              <span style={{ flex: 1 }}>{option}</span>
              {/* Withheld mode marks the pick without judging it, so the row
                  still reads as "this is what you chose" to a screen reader. */}
              {answered && !disclosed && picked && (
                <span style={{ color: ink.accent, fontSize: "0.8125rem", fontWeight: 600 }}>
                  {t.hookYourGuess}
                </span>
              )}
              {disclosed && isRight && (
                <span style={{ color: ink.ok, display: "flex" }}>
                  <Icon name="check" size="1.1em" strokeWidth={2.5} />
                </span>
              )}
              {/* The learner's own wrong pick gets an equally explicit marker,
                  not just a color shift — so "what I picked" and "what was
                  right" are both legible at a glance, not one marked and one
                  merely tinted. */}
              {disclosed && !isRight && picked && (
                <span style={{ color: ink.bad, display: "flex" }}>
                  <Icon name="x" size="1.1em" strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div aria-live="polite" style={{ marginTop: space["3"] }}>
          {disclosed ? (
            <Note
              tone={correct ? "ok" : "bad"}
              label={correct ? t.quizCorrect : t.quizWrong}
              icon={correct ? "check" : "info"}
            >
              {question.explain}
            </Note>
          ) : (
            // The curiosity gap, held open on purpose. No verdict, and
            // explicitly no `question.explain` — that string names the answer.
            <Note tone="accent" label={t.hookHeldLabel} icon="info">
              {t.hookHeldBody}
            </Note>
          )}
        </div>
      )}
    </div>
  );
}
