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
import { EVENTS, track } from "../lib/analytics.js";
import { quizData } from "../content/quizData.js";
import { dueQuestions, seenCount } from "../lib/review.js";
import Icon from "../components/Icon.jsx";
import Question from "../components/Question.jsx";
import { Button, Card, Disclaimer, ProgressBar, Text } from "../components/ui.jsx";
import { ink, line, space } from "../theme.js";

// A straight-through 40-question "practice all" session has no natural stop.
// Pausing every BATCH_SIZE questions with an explicit "keep going or stop
// here" choice turns that into a series of small, exitable commitments —
// the review's "low-pressure interstitial" idea — instead of one long queue
// the learner has to either finish or abandon mid-question.
const BATCH_SIZE = 10;

export default function Practice({ t, lang, review, recordReview }) {
  // Frozen when a session starts: answering mutates `review`, and a live queue
  // would drop the current question out from under the learner mid-answer.
  const [session, setSession] = useState(null);
  const [position, setPosition] = useState(0);
  const [answered, setAnswered] = useState(false);
  // One entry per question answered this session, in order — the "See
  // Results" button (t.quizFinish) has always promised a results view; this
  // is what it now shows instead of a bare checkmark.
  const [results, setResults] = useState([]);
  // True right after finishing a batch of BATCH_SIZE questions, before the
  // learner has chosen whether to continue.
  const [atBatchPause, setAtBatchPause] = useState(false);

  const due = useMemo(() => dueQuestions(review, quizData), [review]);
  const seen = seenCount(review);

  const start = (items) => { setSession(items); setPosition(0); setAnswered(false); setResults([]); setAtBatchPause(false); };
  const exit = () => { setSession(null); setPosition(0); setAnswered(false); setResults([]); setAtBatchPause(false); };
  const advance = (to) => { setPosition(to); setAnswered(false); };

  // ── in a session ────────────────────────────────────────────────────────
  if (session) {
    const item = session[position];
    const last = position === session.length - 1;

    if (atBatchPause) {
      const correctCount = results.filter((r) => r.correct).length;
      return (
        <div>
          <Text as="h1" variant="display" color={ink.strong}>{t.reviewTitle}</Text>
          <Card style={{ marginTop: space["5"], textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", color: ink.ok, marginBottom: space["3"] }}>
              <Icon name="check" size="2rem" strokeWidth={2.2} />
            </div>
            <Text variant="heading" color={ink.strong}>
              {t.reviewBatchTitle.replace("{n}", results.length)}
            </Text>
            <Text variant="small" color={ink.muted} style={{ marginTop: space["1"] }}>
              {t.reviewScoreTemplate.replace("{correct}", correctCount).replace("{total}", results.length)}
            </Text>
          </Card>

          <Button
            full
            iconRight="arrowRight"
            onClick={() => { setAtBatchPause(false); advance(position + 1); }}
            style={{ marginTop: space["4"] }}
          >
            {t.reviewKeepGoing}
          </Button>
          <Button
            full
            variant="outline"
            onClick={() => { setAtBatchPause(false); setPosition(session.length); }}
            style={{ marginTop: space["3"] }}
          >
            {t.reviewStopHere}
          </Button>
        </div>
      );
    }

    if (!item) {
      const correctCount = results.filter((r) => r.correct).length;
      return (
        <div>
          <Text as="h1" variant="display" color={ink.strong}>{t.reviewTitle}</Text>
          <Card style={{ marginTop: space["5"], textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", color: ink.ok, marginBottom: space["3"] }}>
              <Icon name="check" size="2rem" strokeWidth={2.2} />
            </div>
            <Text variant="heading" color={ink.strong}>{t.reviewCompleteTitle}</Text>
            {results.length > 0 && (
              <Text variant="small" color={ink.muted} style={{ marginTop: space["1"] }}>
                {t.reviewScoreTemplate.replace("{correct}", correctCount).replace("{total}", results.length)}
              </Text>
            )}
          </Card>

          {/* The retrieval attempt is the point, not the grade — so this
              recap lists what came up and whether it landed, the same
              explain-not-score spirit as Question's per-answer feedback,
              rather than leading with a percentage. */}
          {results.length > 0 && (
            <Card style={{ marginTop: space["3"] }} padded={false}>
              {results.map((r, i) => (
                <div
                  key={r.item.index}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: space["3"],
                    padding: `${space["3"]}px ${space["4"]}px`,
                    borderBottom: i < results.length - 1 ? `1px solid ${line.hairline}` : "none",
                  }}
                >
                  <span style={{ color: r.correct ? ink.ok : ink.bad, display: "flex", marginTop: 2, flexShrink: 0 }}>
                    <Icon name={r.correct ? "check" : "x"} size="1.1em" strokeWidth={2.5} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="small" color={ink.body}>{r.item.question.q[lang]}</Text>
                    <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"] }}>
                      {t.reviewFromLesson.replace("{n}", r.item.question.lesson)}
                    </Text>
                  </div>
                </div>
              ))}
            </Card>
          )}

          <Button full variant="outline" onClick={exit} style={{ marginTop: space["4"] }}>
            {t.doneLabel}
          </Button>
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
          onAnswered={(wasCorrect) => {
            recordReview(item.index, wasCorrect);
            track(EVENTS.QUIZ_TAKEN, { lessonId: item.question.lesson, source: "review_queue", correct: wasCorrect });
            setResults((prev) => [...prev, { item, correct: wasCorrect }]);
            setAnswered(true);
          }}
        />

        {/* Only after answering. Offering "Next" up front invites tapping past
            the question, which is exactly the retrieval step that makes review
            work — and a skipped question would silently stay due forever. */}
        {answered && (
          <Button
            full
            iconRight={last ? undefined : "arrowRight"}
            onClick={() => {
              if (last) { advance(session.length); return; }
              // Pause between batches only when there's a next batch left to
              // pause before — never on the very last question of a session.
              if ((position + 1) % BATCH_SIZE === 0) { setAtBatchPause(true); return; }
              advance(position + 1);
            }}
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
