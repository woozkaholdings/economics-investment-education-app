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
import { useDismissOnBack } from "../lib/deepLink.js";
import { BOX_INTERVALS, boxDistribution, dueQuestions, seenCount } from "../lib/review.js";
import Icon from "../components/Icon.jsx";
import { Bar } from "../components/charts.jsx";
import Question from "../components/Question.jsx";
import { Button, Card, Disclaimer, LoadFailure, ProgressBar, SrOnly, Steps, Text } from "../components/ui.jsx";
import { graph, ink, line, MIN_TAP, radius, space, surface } from "../theme.js";

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
  // dueQuestions reads only `id` and `lesson`, both of which live in quizMeta,
  // so the queue is computed from meta and the words are merged in afterwards
  // by index. Deriving the schedule from the loaded language file instead
  // would make a learner's review order depend on which module had finished
  // downloading.
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

  // Questions per Leitner box, for the distribution strip below. Gated on this
  // total rather than on `seen` because boxDistribution() drops out-of-range
  // boxes: the two numbers can legitimately disagree on a corrupted state
  // object, and the strip must not render a chart whose bars sum to zero —
  // `Bar` divides by max(|value|), so an all-zero series would emit
  // `--ec-bar-pct: NaN%` into five fills.
  const boxes = useMemo(() => boxDistribution(review), [review]);
  const boxTotal = boxes.reduce((sum, n) => sum + n, 0);

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
        .filter(({ question }) =>
          completedLessons.includes(question.lesson) || Boolean(review[question.id])
        ),
    [completedLessons, review]
  );
  const item = session ? session[position] : null;

  const start = (items) => { setSession(items); setPosition(0); setAnswered(false); setResults([]); setAtBatchPause(false); };
  const exit = () => { setSession(null); setPosition(0); setAnswered(false); setResults([]); setAtBatchPause(false); };
  const advance = (to) => { setPosition(to); setAnswered(false); };

  // A session is a pushed view with no hash of its own, so without this Back
  // would leave the Review tab entirely and drop the session the learner is
  // in the middle of (lib/deepLink.js, "pushed views that are not routes").
  // It runs `exit`, the same path as the on-screen exit button: answers
  // already given are already scheduled, so nothing is lost by closing.
  useDismissOnBack(session !== null, exit);

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

    // ⚠️ THE HEADER ICON AND THE BATCH HEADLINE BOTH BRANCH ON `anyLanded`, and
    // this is the whole of backlog item 163(a) plus the half of it the item did
    // not name. Until 2026-09-02 both recap screens rendered an unconditional
    // `check` in `ink.ok` at 2rem. Measured live, dark palette, by driving ten
    // real answers through this runner:
    //   * 0 of 10 correct → green tick (`#6ede9f`, path `m5 12.5 4.5 4.5L19 7.5`)
    //     over "10 done — nice work", and on the complete screen the same tick
    //     over "0 of 10 correct" with TEN red `ink.bad` crosses an inch below.
    //   * 3 of 3 correct (control) → the identical path, the identical color,
    //     the identical size. The icon was the same pixels at 0% and at 100%,
    //     so it carried no information while reading as a verdict in the exact
    //     vocabulary the rows beneath it use to mean one.
    // `Icon` is `aria-hidden`, so this was a sighted-reader defect only; the
    // score line a screen reader gets was always honest.
    //
    // Two different problems, deliberately fixed differently:
    //   * The tick is a SIGNAL, and green is this app's success token — so it
    //     goes neutral (`info`/`ink.muted`) when nothing landed, the same
    //     two-state shape the landing card below already uses for `seen > 0`.
    //     It is NOT turned red: the session was completed, and a miss is a
    //     productive event in a Leitner scheduler, not a failure.
    //   * "nice work" is a CLAIM, and over "0 of 10 correct" it is false. It is
    //     replaced with what actually happened to those questions — every one
    //     went to box 1 and is due in a day — which is what the "How review
    //     works" rail on this screen already promises.
    // `reviewCompleteTitle` ("Review complete") stays unconditional on purpose:
    // unlike "nice work" it is true at every score.
    if (atBatchPause) {
      const correctCount = results.filter((r) => r.correct).length;
      const anyLanded = correctCount > 0;
      return (
        <div>
          <Text as="h1" variant="display" color={ink.strong}>{t.reviewTitle}</Text>
          <Card style={{ marginTop: space["5"], textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", color: anyLanded ? ink.ok : ink.muted, marginBottom: space["3"] }}>
              <Icon name={anyLanded ? "check" : "info"} size="2rem" strokeWidth={2.2} />
            </div>
            <h2 ref={resultHeadingRef} tabIndex={-1} style={{ margin: 0, outline: "none" }}>
              <Text as="span" variant="heading" color={ink.strong}>
                {(anyLanded ? t.reviewBatchTitle : t.reviewBatchTitleNoneRight).replace("{n}", results.length)}
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
      const anyLanded = correctCount > 0;
      return (
        <div>
          <Text as="h1" variant="display" color={ink.strong}>{t.reviewTitle}</Text>
          <Card style={{ marginTop: space["5"], textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", color: anyLanded ? ink.ok : ink.muted, marginBottom: space["3"] }}>
              <Icon name={anyLanded ? "check" : "info"} size="2rem" strokeWidth={2.2} />
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
                    {/* The tick and the cross ARE the recap — they are the only
                        thing on the row that says whether this one landed. `Icon`
                        is `aria-hidden`, so without this label every row reads
                        identically to assistive technology and the screen that
                        exists to say WHICH one was missed says only "3 of 4
                        correct". Measured live 2026-09-06 off the accessibility
                        tree, with the disclosed-option markers in Question.jsx as
                        the positive control — the same idiom, added there
                        2026-08-30, in the sibling half of this same flow.
                        Its two keys are deliberately NOT reused: they label an
                        OPTION ("Correct answer", "Your answer, incorrect") and
                        this labels a verdict on an attempt. */}
                    <span style={{ color: r.correct ? ink.ok : ink.bad, display: "flex", marginTop: 2, flexShrink: 0 }}>
                      <SrOnly>{r.correct ? t.reviewResultCorrect : t.reviewResultWrong}</SrOnly>
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
            recordReview(item.question.id, wasCorrect);
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
          says a check question joins the queue when you ANSWER it. (That rail
          said "when you finish a lesson" until 2026-09-02; completing a lesson
          has never enrolled anything — `completeLesson` does not touch the
          schedule and `recordReview` is only reachable from an answer.)

          "All" is a different number for almost every learner, so the label
          says which one. Measured: 46 questions over 44 lessons (42 lessons
          own one, 2 own two), so the pool is 1 the moment the first lesson is
          completed and takes 44 distinct values along the path. The due card
          above has always stated its size (`reviewDueTemplate`); this button
          was the one review control that did not.

          The count is a per-language TEMPLATE and not a ` (N)` appended here,
          which is the cheaper thing and would have been wrong in four of five
          languages. Two reasons, both measured rather than assumed:
            - Plural agreement. `en` and `es` break at n = 1 if the number sits
              inside the noun phrase ("Practice all 1 questions"), and n = 1 is
              the FIRST state a learner reaches. Both therefore park the count
              outside it, in parentheses. `ko`/`zh`/`ja` have no plural
              agreement and read better with the number inline, exactly as
              their own `reviewDueTemplate` already writes it ("복습할 문제
              {n}개", "{n} 题待复习", "復習する問題 {n} 問").
            - Spacing is language-specific too, and this file cannot know it:
              `zh` writes "{n} 题待复习" with spaces and "约{n}分钟"
              (`estMinTemplate`) without. Appending here would impose the
              English shape on all five.
          Every other count in a SENTENCE in this app is a locale template (13
          keys carry {placeholders}); the only counts built in JSX are bare
          numeric ratios ("3 / 12"). This is a sentence.

          Both citations above were re-anchored 2026-09-01: they used to rest
          partly on `viewAllLessonsTemplate`, which was defined in all five
          languages and rendered by nothing — a relic of the pre-rebuild
          monolith that shipped in every bundle for four weeks. It survived the
          2026-08-30 dead-key sweep because that sweep read src/ as raw text and
          THIS COMMENT was its only mention, so the key vouched for itself.
          Cite live strings here, never a key whose only reader is a comment. */}
      {practicePool.length > 0 && (
        <Button
          full
          variant="outline"
          disabled={!quizText}
          onClick={() => start(practicePool)}
          style={{ marginTop: space["3"] }}
        >
          {t.practiceAllTemplate.replace("{n}", practicePool.length)}
        </Button>
      )}

      {loadFailed && <LoadFailure t={t} />}

      {/* THE LEITNER BOX STRIP — adapted from UIUX/ (Vocabulary iOS 120, "Word
          stats"), the reference set's one screen that reports a learner's own
          accumulated state back to them rather than driving an action.
          Owner-directed 2026-09-02; it was the last unbuilt item from the
          2026-08-21 design canvas and had been offered back three times, held
          open on the cost recorded below.

          WHAT IT SHOWS AND WHY IT IS NOT DECORATION. Everything else on this
          screen reports what is due TODAY — the due card counts it, the
          practice-all button counts what is reachable. None of them shows that
          the boxes exist, or that material is climbing them. `review.js`'s
          whole mechanic is the widening gap, and until now the only place a
          learner could meet it was the prose of the Steps rail below.

          REUSED, NOT BUILT. This is `charts.jsx`'s `Bar` at a fifth call
          site, so it inherits the geometry that block in `index.css` earned:
          the sub-375px switch from columns to rows, and the `rem` box height
          that stopped bar tracks rendering 9px tall at 130% root font. A
          hand-rolled strip here would have re-opened both. `scripts/` gains
          nothing; the build gains a 23 kB `charts` chunk that Rollup split out
          on its own, and `markets` DROPPED 124 kB -> 101 kB as a result.

          NO <h2>, AND THE PLACEMENT IS THE POINT. A figure's label belongs in
          its figcaption, which `Bar`'s `title` prop renders — the same call made on
          the Fed balance-sheet figure on 2026-09-02. That leaves the strip
          owned by this screen's <h1>, which is correct for content between the
          h1 and the first h2. It sits BEFORE the how-review section for
          exactly that reason: below it, the heading rotor would announce the
          strip as content of "How review works", which is the defect that same
          day's Market Dashboard fix removed.

          COLOR IS RULE 2, NOT A GRADIENT. `theme.js` rule 2 reserves
          green/amber/red for success/caution/error, so the boxes are NOT
          painted as a red-to-green ramp: a question in box 1 is not an error,
          it is one a learner answered correctly for the first time today. Blue
          for the four working boxes, green for the last — reaching a 16-day
          interval is the one state here that is unambiguously success. Both
          tokens clear 3:1 on every surface (check-data.mjs section 28b).

          THE DESCRIPTION CARRIES THE NUMBERS, because `Bar`'s role="img"
          hides the per-column values and labels from a screen reader. A
          lead-in plus one concatenated sentence per box; each per-box string
          ends with its OWN punctuation and trailing space so nothing here
          imposes an English list separator on zh/ja, the same reasoning
          practiceAllTemplate records above.

          THE ENGLISH AND SPANISH PLURAL TRAP, AND IT BIT TWICE. Box 1's
          interval is always 1, so "After {days} days" would render "After 1
          days" on every device, in the first box, forever. English parks that
          in an attributive compound ("The 1-day box", which never pluralizes);
          Spanish uses the invariable unit symbol ("Casilla de 1 d"). ko/zh/ja
          have no agreement to break.
          The second instance is the one worth recording, because the rule
          above was already written when it shipped: reviewBoxesDescription
          read "Your {n} questions", and n = 1 is not an edge case here — it is
          the FIRST state every learner reaches, one answered check question.
          It rendered "Your 1 questions" and was caught by seeding a
          single-entry state in a live browser, not by re-reading the string.
          Both halves now park the count outside the noun phrase, which is the
          same fix practiceAllTemplate records above. A plural rule applied to
          one template in a file is not applied to the file. */}
      {boxTotal > 0 && (
        <div style={{ marginTop: space["6"] }}>
          <Bar
            title={t.reviewBoxesTitle}
            unit={t.reviewBoxesUnit}
            data={boxes.map((count, i) => ({
              label: t.reviewBoxDayTemplate.replace("{n}", BOX_INTERVALS[i]),
              value: count,
            }))}
            colors={[graph.blue, graph.blue, graph.blue, graph.blue, graph.green]}
            height={90}
            description={
              t.reviewBoxesDescription.replace("{n}", boxTotal) +
              boxes
                .map((count, i) =>
                  t.reviewBoxAriaTemplate
                    .replace("{days}", BOX_INTERVALS[i])
                    .replace("{n}", count)
                )
                .join("")
            }
          />
        </div>
      )}

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
          doneLabel={t.howReviewStepDone}
        />
      </section>

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
