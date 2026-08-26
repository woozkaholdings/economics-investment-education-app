// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE — spaced review
//
// This used to be a one-shot thirteen-question test: you took it, got a score,
// and nothing ever came back. Nothing resurfaced what you got wrong, and
// nothing brought lesson 2 back while you were on lesson 7.
//
// Now the default is a review queue driven by `lib/review.js`. Questions you
// have answered return on a widening schedule, soonest-and-shakiest first; a
// miss drops back to the shortest interval. When nothing is due, everything the
// learner has REACHED is still available on purpose — "come back tomorrow"
// should be an invitation, not a locked door.
//
// That used to read "the full question set", which stopped being true on
// 2026-08-26 when `practicePool` below scoped the button to reached material;
// the invitation survived the change, its scope did not. And the invitation has
// a floor: a learner who has reached nothing gets neither a queue nor a door,
// so the card below must say that instead of congratulating them.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, quizScore, track } from "../lib/analytics.js";
import { lessonPlacement } from "../content/lessons.js";
import { quizMeta } from "../content/quizMeta.js";
import { dueQuestions, seenCount } from "../lib/review.js";
import Icon from "../components/Icon.jsx";
import Question from "../components/Question.jsx";
import { Button, Card, Disclaimer, LoadFailure, ProgressBar, Steps, Text } from "../components/ui.jsx";
import { ink, line, MIN_TAP, radius, space, surface } from "../theme.js";

// A straight-through 40-question "practice all" session has no natural stop.
// Pausing every BATCH_SIZE questions with an explicit "keep going or stop
// here" choice turns that into a series of small, exitable commitments —
// the review's "low-pressure interstitial" idea — instead of one long queue
// the learner has to either finish or abandon mid-question.
const BATCH_SIZE = 10;

// "Which lesson did this question come from?" — answered by the lesson's
// position within its track plus the track's name, never by its raw id.
//
// `question.lesson` is a stable storage key and is deliberately NOT aligned to
// display order (see lessonsByTrack() in content/lessons.js), so printing it
// announced "From lesson 29" for the lesson the reader calls "Lesson 1 of 12"
// and the path numbers "1" — backlog item 81. The Learn path and the reader
// were both fixed for this when the third track landed; this screen was the
// one that still showed the id.
//
// The track name is part of the label rather than a nicety: with three tracks
// there are three "Lesson 1"s, and a review queue interleaves them freely, so
// a bare position would be ambiguous in exactly the place the queue mixes.
// The number leads so that it survives truncation on a narrow header.
//
// Returns null for a question whose lesson is no longer in the catalog —
// quiz metadata is keyed by id and can outlive a lesson. Rendering nothing
// beats rendering a wrong number.
function lessonSourceLabel(t, lessonId) {
  const at = lessonPlacement(lessonId);
  if (!at) return null;
  return t.reviewFromLesson
    .replace("{n}", at.position)
    .replace("{track}", (at.labelKey && t[at.labelKey]) || "");
}

// Quiz text, one language per module (item 48). The schedule lives in
// quizMeta and is always available synchronously; only the words are fetched.
const QUIZ_TEXT_LOADERS = {
  en: () => import("../content/quizText.en.js"),
  es: () => import("../content/quizText.es.js"),
  ko: () => import("../content/quizText.ko.js"),
  zh: () => import("../content/quizText.zh.js"),
  ja: () => import("../content/quizText.ja.js"),
};

export default function Practice({ t, lang, completedLessons, review, recordReview }) {
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
  // Both review buttons are already `disabled={!quizText}`, so a rejected
  // fetch did not crash this screen — it left two dead buttons and no
  // explanation, forever (backlog item 96's milder sibling).
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    let canceled = false;
    // Deliberately NOT setQuizText(null) here. A review session renders from
    // this every frame, so blanking it mid-session left `question.opts`
    // undefined for one render and crashed the screen. Keeping the previous
    // language on screen until the new module resolves removes that window,
    // and removes a content flash on the way.
    setLoadFailed(false);
    QUIZ_TEXT_LOADERS[lang]()
      .then((mod) => {
        if (!canceled) setQuizText(mod.quizText);
      })
      .catch((error) => {
        if (canceled) return;
        console.error("[Practice] quiz text load failed", error);
        setLoadFailed(true);
      });
    return () => {
      canceled = true;
    };
  }, [lang]);

  // Merged at render, never stored in `session`. Storing merged text would
  // freeze a session in whichever language was loaded when it started — the
  // language picker changed the chrome around the question but not the
  // question, which is exactly the bug the first cut of this split shipped.
  const withText = ({ question, index }) => ({ ...question, ...quizText?.[index] });

  const due = useMemo(() => dueQuestions(review, quizMeta), [review]);
  const seen = seenCount(review);

  // What "Practice all questions" is allowed to ask about. Until 2026-08-26 it
  // was `quizMeta` entire, and that made this button a door around the whole
  // unlock model: measured live from cleared storage, a learner who had opened
  // nothing got a 46-question session that began at "Lesson 1", "Lesson 2",
  // "Lesson 3" of a path where 41 of 44 lessons render disabled with "Complete
  // previous lessons first" — and every answer wrote a Leitner entry, so
  // material they had never read then came back in the review queue the next
  // day. The Steps rail eight lines below says "Questions you have never seen
  // stay out of review"; review.js's `dueQuestions` enforces exactly that and
  // says why. This screen was the one place contradicting both.
  //
  // "Reached" is deliberately NOT "unlocked". An unlocked lesson is one the
  // learner MAY open, not one they have read, and asking about it is the same
  // defect one lesson later. It is two things instead:
  //   - the lesson is complete, or
  //   - the question is already in `review` — which is not redundant, because
  //     a lesson's check records answers as they are given while
  //     `completeLesson` only fires on the completion control (LessonReader),
  //     so a learner can genuinely have seen a question in a lesson they never
  //     marked done.
  // The invitation the header comment describes is unchanged; it is now an
  // invitation to practice more of what you have read, rather than a preview
  // of the syllabus.
  const practicePool = useMemo(
    () =>
      quizMeta
        .map((question, index) => ({ question, index }))
        .filter(({ question, index }) =>
          completedLessons.includes(question.lesson) || Boolean(review[String(index)])
        ),
    [completedLessons, review]
  );
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
              {results.map((r, i) => {
                const source = lessonSourceLabel(t, r.item.question.lesson);
                return (
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
                      {source && (
                        <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"] }}>
                          {source}
                        </Text>
                      )}
                    </div>
                  </div>
                );
              })}
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
        {/* Runner chrome from UIUX/ (Quizlet iOS Screens 4): a close control,
            the position counter centered between it and the lesson tag, and the
            progress bar directly under them. The close button is the part that
            matters — before this there was no way out of a started session
            except answering every remaining question or leaving the tab, which
            is the opposite of the "small, exitable commitments" the batch
            pause below was built for. */}
        <div style={{ marginBottom: space["4"] }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: space["3"], marginBottom: space["3"] }}>
            <button
              type="button"
              onClick={exit}
              aria-label={t.quizExit}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                // Icon-only. This is the only way out of a started session,
                // which is the argument for it being a full-size target rather
                // than the 32x32 disc it was.
                width: MIN_TAP, height: MIN_TAP, flexShrink: 0,
                borderRadius: radius.full,
                background: surface.sunken, border: "none",
                color: ink.muted, cursor: "pointer",
              }}
            >
              <Icon name="x" size="1.1em" strokeWidth={2.2} />
            </button>
            {/* Never the thing that gives way. The source caption beside it is
                now long enough to squeeze this, and at a 1.3x font scale that
                wrapped "1 / 1" onto two lines and made the whole row two rows
                tall. The caption truncates instead — it is the one with slack. */}
            <Text
              as="span"
              variant="caption"
              color={ink.strong}
              style={{ fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
            >
              {position + 1} / {session.length}
            </Text>
            {/* Shrinkable, unlike the counter beside it: the label now carries
                a track name and can be long in any language, and at a large
                font scale a `flexShrink: 0` caption pushes this row wider than
                the viewport. Truncating from the end is safe because the
                lesson number leads. */}
            <Text
              as="span"
              variant="caption"
              color={ink.muted}
              style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {lessonSourceLabel(t, item.question.lesson)}
            </Text>
          </div>
          <ProgressBar value={position} max={session.length} label={`${position + 1} / ${session.length}`} />
        </div>

        {/* Keyed so each question remounts with fresh state.

            `headingLevel="h1"` because this branch is the ONLY one of Practice's
            four that does not render {t.reviewTitle} as an <h1> — the runner is
            deliberately immersive (close control, counter, progress bar, then
            the question), so the question IS this screen's title, at every font
            scale and in every language. Before this the screen's entire heading
            outline was one <h3>: no <h1>, nothing above it. Measured live on
            2026-08-25 (item 109) in both runner states — unanswered and
            answered — as sequence "3", while the landing, batch-pause and
            complete branches all read "12".

            Do NOT "fix" this by adding a visible "Review" <h1> above the
            counter: that is the title this design removed on purpose. And do
            not assume a sweep would have caught it — headingOrder only compared
            each heading with the PREVIOUS one, so a document whose first
            heading is an <h3> scored 0 findings and status "ok". That blindness
            is fixed in the same commit; see a11y-sweep.js. */}
        <Question
          key={item.index}
          question={withText(item)}
          headingLevel="h1"
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
        // Nothing due is TWO states, not one, and until 2026-08-26 this card
        // told the same story for both. Measured live from cleared storage: a
        // learner who had opened nothing was shown a green check, "You're all
        // caught up", and "A quick question before you move on." — a
        // congratulation for work never done, under an icon that means done,
        // over a sentence borrowed from LessonReader's pre-question line
        // (`checkIntro`, still its only other call site) where there is no
        // question and nothing to move on from. It was the first thing a brand
        // new learner saw on one of three tabs.
        //
        // `seen` already discriminated the two — the body branched on it and
        // the title and icon did not, so the false half of the card was the
        // half that never branched. All three branch now.
        //
        // "Caught up" is kept for what it actually describes: answered
        // everything, next repetition not due yet. That is a real achievement
        // and still earns the check.
        <Card style={{ marginTop: space["5"], textAlign: "center" }}>
          <div
            style={{
              display: "flex", justifyContent: "center",
              color: seen > 0 ? ink.ok : ink.muted,
              marginBottom: space["3"],
            }}
          >
            <Icon name={seen > 0 ? "check" : "book"} size="2rem" strokeWidth={2.2} />
          </div>
          {/* The id is a test hook and is deliberately NOT tied to which of the
              two strings renders: it names the card, so the state matrix can
              assert "the nothing-due card is on screen" in any language
              (scripts/a11y-states.js, item 118). Same convention as
              `how-review-title` below and `track-<key>-title` on Learn. */}
          <Text id="review-empty-title" variant="heading" color={ink.strong}>
            {seen > 0 ? t.reviewEmptyTitle : t.reviewNotStartedTitle}
          </Text>
          <Text variant="small" color={ink.muted} style={{ marginTop: space["2"] }}>
            {seen > 0 ? t.reviewEmptyBody : t.reviewNotStartedBody}
          </Text>
        </Card>
      )}

      {/* Practicing more than the schedule asks is fine — practicing what you
          have not read is not, which is what `practicePool` above decides.
          Hidden rather than disabled when the pool is empty: a brand-new
          learner has nothing to practice yet, and the only honest label for a
          dead control here is the Steps rail directly below, which already
          says a check question joins the queue when you finish a lesson. */}
      {practicePool.length > 0 && (
        <Button
          full
          variant="outline"
          disabled={!quizText}
          onClick={() => start(practicePool)}
          style={{ marginTop: space["3"] }}
        >
          {t.practiceAll}
        </Button>
      )}

      {loadFailed && <LoadFailure t={t} />}

      {/* HOW REVIEW WORKS — adapted from UIUX/ (Vocabulary iOS 187 and Quizlet
          iOS "Choose your plan"), whose free-trial screens both explain what
          will happen and when, on a vertical rail, BEFORE the user commits.
          The pattern is worth more here than it is there: a paywall timeline
          tells you when you get charged, and this tells you why a question you
          answered today is going to reappear on Thursday — the single least
          visible thing in the app. `lib/review.js`'s box intervals are the
          source for the numbers in the copy (1, 2, 4, 8, 16 days).

          Adapted: no dates, because there is nothing to bill and the schedule
          is per-question rather than per-account. The first step marks itself
          done once the learner has answered anything, which is Vocabulary's
          struck-through "Install the app" step doing real work instead of
          decorating. */}
      {/* NAMED region, same convention as the Learn path (item 82) and the
          lesson body: the <h2> this section already carried is what names it. */}
      <section aria-labelledby="how-review-title" style={{ marginTop: space["6"] }}>
        <Text as="h2" id="how-review-title" variant="heading" color={ink.strong} style={{ marginBottom: space["4"] }}>
          {t.howReviewTitle}
        </Text>
        <Steps
          items={[
            { icon: "book", title: t.howReviewStep1, body: t.howReviewStep1Body, done: seen > 0 },
            { icon: "target", title: t.howReviewStep2, body: t.howReviewStep2Body },
            { icon: "check", title: t.howReviewStep3, body: t.howReviewStep3Body },
          ]}
        />
      </section>

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
