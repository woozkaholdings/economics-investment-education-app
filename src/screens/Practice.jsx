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

import { useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, quizScore, track } from "../lib/analytics.js";
import { quizMeta } from "../content/quizMeta.js";
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

// Quiz text, one language per module (item 48). The schedule lives in
// quizMeta and is always available synchronously; only the words are fetched.
const QUIZ_TEXT_LOADERS = {
  en: () => import("../content/quizText.en.js"),
  es: () => import("../content/quizText.es.js"),
  ko: () => import("../content/quizText.ko.js"),
  zh: () => import("../content/quizText.zh.js"),
  ja: () => import("../content/quizText.ja.js"),
};

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

  // Question TEXT is a per-language module (item 48); the schedule is not.
  // dueQuestions reads only indices and `lesson`, both of which live in
  // quizMeta, so the queue is computed from meta and the words are merged in
  // afterwards by index. Deriving the schedule from the loaded language file
  // instead would make a learner's review order depend on which module had
  // finished downloading.
  const [quizText, setQuizText] = useState(null);
  useEffect(() => {
    let cancelled = false;
    // Deliberately NOT setQuizText(null) here. A review session renders from
    // this every frame, so blanking it mid-session left `question.opts`
    // undefined for one render and crashed the screen. Keeping the previous
    // language on screen until the new module resolves removes that window,
    // and removes a content flash on the way.
    QUIZ_TEXT_LOADERS[lang]().then((mod) => {
      if (!cancelled) setQuizText(mod.quizText);
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Merged at render, never stored in `session`. Storing merged text would
  // freeze a session in whichever language was loaded when it started — the
  // language picker changed the chrome around the question but not the
  // question, which is exactly the bug the first cut of this split shipped.
  const withText = ({ question, index }) => ({ ...question, ...quizText?.[index] });

  const due = useMemo(() => dueQuestions(review, quizMeta), [review]);
  const seen = seenCount(review);
  const item = session ? session[position] : null;

  const start = (items) => { setSession(items); setPosition(0); setAnswered(false); setResults([]); setAtBatchPause(false); };
  const exit = () => { setSession(null); setPosition(0); setAnswered(false); setResults([]); setAtBatchPause(false); };
  const advance = (to) => { setPosition(to); setAnswered(false); };

  // The batch-pause and session-complete screens replace the question in
  // place (no route change), so nothing would otherwise tell a screen-reader
  // user the content just changed, and sighted keyboard users' focus would
  // be left on a button that no longer exists. Same "new page" pattern as
  // LessonReader/TermDetail: move focus to the result heading when one of
  // these two screens appears.
  const resultPhase = atBatchPause ? "batchPause" : session && !item ? "complete" : null;
  const resultHeadingRef = useRef(null);
  useEffect(() => {
    if (!resultPhase) return;
    window.scrollTo({ top: 0 });
    resultHeadingRef.current?.focus();
    // §9.2's "quiz taken (with score)". The complete screen is a review
    // session's single terminal state — both "answered the last question" and
    // "stop here" at a batch pause land on it — so firing here counts each
    // session exactly once, with the same score the recap above shows. A
    // batch pause is deliberately not a quiz taken: the session continues.
    if (resultPhase === "complete" && results.length > 0) {
      track(EVENTS.QUIZ_TAKEN, {
        source: "review_queue",
        ...quizScore(results.filter((r) => r.correct).length, results.length),
      });
    }
  }, [resultPhase]);

  // ── in a session ────────────────────────────────────────────────────────
  if (session) {
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
            <h2 ref={resultHeadingRef} tabIndex={-1} style={{ margin: 0, outline: "none" }}>
              <Text as="span" variant="heading" color={ink.strong}>
                {t.reviewBatchTitle.replace("{n}", results.length)}
              </Text>
            </h2>
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
            <h2 ref={resultHeadingRef} tabIndex={-1} style={{ margin: 0, outline: "none" }}>
              <Text as="span" variant="heading" color={ink.strong}>{t.reviewCompleteTitle}</Text>
            </h2>
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
                    <Text variant="small" color={ink.body}>{withText(r.item).q}</Text>
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
          question={withText(item)}
          lang={lang}
          t={t}
          onAnswered={(wasCorrect) => {
            recordReview(item.index, wasCorrect);
            track(EVENTS.QUIZ_ANSWERED, { lessonId: item.question.lesson, source: "review_queue", correct: wasCorrect });
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
          <Button full disabled={!quizText} onClick={() => start(due)} iconRight="arrowRight">{t.quizStart}</Button>
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
        disabled={!quizText}
        onClick={() => start(quizMeta.map((question, index) => ({ question, index })))}
        style={{ marginTop: space["3"] }}
      >
        {t.practiceAll}
      </Button>

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
