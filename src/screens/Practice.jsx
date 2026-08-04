// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE
//
// Promoted to a top-level destination. In the prototype the quiz sat inside a
// "More" drawer, which said it was a leftover; checking what you understood is
// a distinct intent from reading, and it is how a learner discovers what did
// not land (LAUNCH_PLAN §3.1).
//
// The explanation after each answer is the point — a wrong answer is never a
// dead end. Correct-answer positions are spread deliberately; see the header
// comment in `content/quizData.js` before editing questions.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { quizData } from "../content/quizData.js";
import Icon from "../components/Icon.jsx";
import { Button, Card, Disclaimer, Note, ProgressBar, Text } from "../components/ui.jsx";
import { fill, ink, line, radius, space, surface } from "../theme.js";

const STRONG = 0.7;
const FAIR = 0.4;

export default function Practice({ t, lang }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const reset = () => { setStarted(false); setIndex(0); setAnswer(null); setScore(0); setFinished(false); };

  const question = quizData[index];
  const correct = answer === question?.answer;

  const choose = (i) => {
    if (answer !== null) return;              // one answer per question
    setAnswer(i);
    if (i === question.answer) setScore((s) => s + 1);
  };

  const advance = () => {
    if (index < quizData.length - 1) { setIndex(index + 1); setAnswer(null); }
    else setFinished(true);
  };

  // ── intro ───────────────────────────────────────────────────────────────
  if (!started && !finished) {
    return (
      <div>
        <Text as="h1" variant="display" color={ink.strong}>{t.quizTitle}</Text>
        <Card style={{ marginTop: space["5"], textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", color: ink.accent, marginBottom: space["3"] }}>
            <Icon name="target" size="2rem" />
          </div>
          <Text variant="small" color={ink.muted}>{quizData.length} {t.questionsLabel}</Text>
          <Button full onClick={() => setStarted(true)} style={{ marginTop: space["4"] }}>
            {t.quizStart}
          </Button>
        </Card>
        <Disclaimer text={t.disclaimer} />
      </div>
    );
  }

  // ── result ──────────────────────────────────────────────────────────────
  if (finished) {
    const ratio = score / quizData.length;
    return (
      <div>
        <Text as="h1" variant="display" color={ink.strong}>{t.quizTitle}</Text>
        <Card style={{ marginTop: space["5"], textAlign: "center" }}>
          <Text variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {t.quizScore}
          </Text>
          <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1.1, color: ratio >= STRONG ? ink.ok : ratio >= FAIR ? ink.warn : ink.bad, margin: `${space["2"]}px 0` }}>
            {score}<span style={{ color: ink.muted, fontSize: "1.5rem" }}> / {quizData.length}</span>
          </div>
          <Text variant="small" color={ink.muted}>{Math.round(ratio * 100)}%</Text>
          <Button full variant="outline" onClick={reset} style={{ marginTop: space["4"] }}>
            {t.quizTryAgain}
          </Button>
        </Card>
        <Disclaimer text={t.disclaimer} />
      </div>
    );
  }

  // ── question ────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: space["4"] }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: space["2"] }}>
          <Text variant="caption" color={ink.muted} style={{ fontWeight: 700 }}>
            {index + 1} / {quizData.length}
          </Text>
        </div>
        <ProgressBar value={index + (answer !== null ? 1 : 0)} max={quizData.length} label={`${index + 1} / ${quizData.length}`} />
      </div>

      <Text as="h1" id="question" variant="title" color={ink.strong} style={{ marginBottom: space["4"] }}>
        {question.q[lang]}
      </Text>

      <div role="radiogroup" aria-labelledby="question">
        {question.opts[lang].map((option, i) => {
          const revealed = answer !== null;
          const isRight = i === question.answer;
          const picked = i === answer;

          // Once revealed, mark the right answer and the learner's wrong pick;
          // leave the rest neutral so the eye goes to the two that matter.
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
                display: "flex", alignItems: "center", gap: space["3"], width: "100%", textAlign: "left",
                padding: `${space["3"]}px ${space["4"]}px`, marginBottom: space["2"],
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
              {revealed && isRight && <span style={{ color: ink.ok }}><Icon name="check" size="1.1em" strokeWidth={2.5} /></span>}
            </button>
          );
        })}
      </div>

      {answer !== null && (
        <div aria-live="polite" style={{ marginTop: space["3"] }}>
          <Note tone={correct ? "ok" : "bad"} label={correct ? t.quizCorrect : t.quizWrong} icon={correct ? "check" : "info"}>
            {question.explain[lang]}
          </Note>
          <Button full onClick={advance} iconRight="arrowRight" style={{ marginTop: space["3"] }}>
            {index < quizData.length - 1 ? t.quizNext : t.quizFinish}
          </Button>
        </div>
      )}
    </div>
  );
}
