// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE — spaced review
//
// This used to be a one-shot thirteen-question test: you took it, got a score,
// and nothing ever came back. Nothing resurfaced what you got wrong, and
// nothing brought lesson 2 back while you were on lesson 7.
//
// Now the default is a review queue driven by `lib/review.js`. Questions you
// have answered return on a widening schedule, soonest-and-shakiest first; a
// miss drops back to the shortest interval. When nothing is due, the full
// question set is still available on purpose — "come back tomorrow" should be
// an invitation, not a locked door.
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { quizData } from "../content/quizData.js";
import { dueQuestions, seenCount } from "../lib/review.js";
import Icon from "../components/Icon.jsx";
import Question from "../components/Question.jsx";
import { Button, Card, Disclaimer, ProgressBar, Text } from "../components/ui.jsx";
import { ink, space } from "../theme.js";

export default function Practice({ t, lang, review, recordReview }) {
  // Frozen when a session starts: answering mutates `review`, and a live queue
  // would drop the current question out from under the learner mid-answer.
  const [session, setSession] = useState(null);
  const [position, setPosition] = useState(0);
  const [answered, setAnswered] = useState(false);

  const due = useMemo(() => dueQuestions(review, quizData), [review]);
  const seen = seenCount(review);

  const start = (items) => { setSession(items); setPosition(0); setAnswered(false); };
  const exit = () => { setSession(null); setPosition(0); setAnswered(false); };
  const advance = (to) => { setPosition(to); setAnswered(false); };

  // ── in a session ────────────────────────────────────────────────────────
  if (session) {
    const item = session[position];
    const last = position === session.length - 1;

    if (!item) {
      return (
        <div>
          <Text as="h1" variant="display" color={ink.strong}>{t.reviewTitle}</Text>
          <Card style={{ marginTop: space["5"], textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", color: ink.ok, marginBottom: space["3"] }}>
              <Icon name="check" size="2rem" strokeWidth={2.2} />
            </div>
            <Text variant="heading" color={ink.strong}>{t.reviewCompleteTitle}</Text>
            <Button full variant="outline" onClick={exit} style={{ marginTop: space["4"] }}>
              {t.doneLabel}
            </Button>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: space["4"] }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: space["2"] }}>
            <Text as="span" variant="caption" color={ink.muted} style={{ fontWeight: 700 }}>
              {position + 1} / {session.length}
            </Text>
            <Text as="span" variant="caption" color={ink.muted}>
              {t.reviewFromLesson.replace("{n}", item.question.lesson)}
            </Text>
          </div>
          <ProgressBar value={position} max={session.length} label={`${position + 1} / ${session.length}`} />
        </div>

        {/* Keyed so each question remounts with fresh state. */}
        <Question
          key={item.index}
          question={item.question}
          lang={lang}
          t={t}
          onAnswered={(wasCorrect) => { recordReview(item.index, wasCorrect); setAnswered(true); }}
        />

        {/* Only after answering. Offering "Next" up front invites tapping past
            the question, which is exactly the retrieval step that makes review
            work — and a skipped question would silently stay due forever. */}
        {answered && (
          <Button
            full
            iconRight={last ? undefined : "arrowRight"}
            onClick={() => advance(last ? session.length : position + 1)}
            style={{ marginTop: space["4"] }}
          >
            {last ? t.quizFinish : t.quizNext}
          </Button>
        )}
      </div>
    );
  }

  // ── queue overview ──────────────────────────────────────────────────────
  return (
    <div>
      <Text as="h1" variant="display" color={ink.strong}>{t.reviewTitle}</Text>

      {due.length > 0 ? (
        <Card style={{ marginTop: space["5"] }}>
          <div style={{ display: "flex", alignItems: "center", gap: space["3"], marginBottom: space["4"] }}>
            <span style={{ color: ink.accent, display: "flex" }}><Icon name="target" size="1.75rem" /></span>
            <Text variant="heading" color={ink.strong}>
              {t.reviewDueTemplate.replace("{n}", due.length)}
            </Text>
          </div>
          <Button full onClick={() => start(due)} iconRight="arrowRight">{t.quizStart}</Button>
        </Card>
      ) : (
        <Card style={{ marginTop: space["5"], textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", color: ink.ok, marginBottom: space["3"] }}>
            <Icon name="check" size="2rem" strokeWidth={2.2} />
          </div>
          <Text variant="heading" color={ink.strong}>{t.reviewEmptyTitle}</Text>
          <Text variant="small" color={ink.muted} style={{ marginTop: space["2"] }}>
            {seen > 0 ? t.reviewEmptyBody : t.checkIntro}
          </Text>
        </Card>
      )}

      {/* Always available — practising more than the schedule asks is fine. */}
      <Button
        full
        variant="outline"
        onClick={() => start(quizData.map((question, index) => ({ question, index })))}
        style={{ marginTop: space["3"] }}
      >
        {t.practiceAll}
      </Button>

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
