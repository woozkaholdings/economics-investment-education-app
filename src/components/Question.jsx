// ═══════════════════════════════════════════════════════════════════════════
// QUESTION
//
// One multiple-choice question with immediate feedback. Shared by the
// end-of-lesson check and the spaced-review queue so a question looks and
// behaves identically wherever it appears — and so both routes record their
// result into the same schedule.
//
// The explanation is the point: a wrong answer teaches rather than scoring.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import Icon from "./Icon.jsx";
import { Note, Text } from "./ui.jsx";
import { fill, ink, line, radius, space, surface } from "../theme.js";

export default function Question({ question, lang, t, onAnswered, autoFocusHeading = false }) {
  const [choice, setChoice] = useState(null);
  const revealed = choice !== null;
  const correct = choice === question.answer;

  const choose = (i) => {
    if (revealed) return;                 // one answer per question
    setChoice(i);
    onAnswered?.(i === question.answer);
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
        {question.q[lang]}
      </Text>

      <div role="radiogroup" aria-label={question.q[lang]}>
        {question.opts[lang].map((option, i) => {
          const isRight = i === question.answer;
          const picked = i === choice;

          // Once revealed, mark the right answer and the learner's wrong pick;
          // leave the others neutral so attention goes to the two that matter.
          const border = !revealed ? line.strong : isRight ? fill.ok : picked ? fill.bad : line.hairline;
          const bg = !revealed ? surface.card : isRight ? surface.okWash : picked ? surface.badWash : surface.card;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={picked}
              disabled={revealed}
              onClick={() => choose(i)}
              style={{
                display: "flex", alignItems: "center", gap: space["3"],
                width: "100%", textAlign: "left",
                padding: `${space["3"]}px ${space["4"]}px`,
                marginBottom: space["2"],
                borderRadius: radius.md,
                border: `1.5px solid ${border}`,
                background: bg,
                color: ink.body,
                fontSize: "1rem",
                fontWeight: revealed && isRight ? 600 : 400,
                cursor: revealed ? "default" : "pointer",
              }}
            >
              <span style={{ flex: 1 }}>{option}</span>
              {revealed && isRight && (
                <span style={{ color: ink.ok, display: "flex" }}>
                  <Icon name="check" size="1.1em" strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div aria-live="polite" style={{ marginTop: space["3"] }}>
          <Note
            tone={correct ? "ok" : "bad"}
            label={correct ? t.quizCorrect : t.quizWrong}
            icon={correct ? "check" : "info"}
          >
            {question.explain[lang]}
          </Note>
        </div>
      )}
    </div>
  );
}
