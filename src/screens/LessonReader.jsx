// ═══════════════════════════════════════════════════════════════════════════
// LESSON READER
//
// A pushed, full-screen view rather than a tab: reading is the one thing in
// this app that deserves undivided attention (LAUNCH_PLAN §3.1).
//
// Layout follows the clarity standard — one idea per section, generous
// measure, and the takeaway and reflection prompt visually distinct from the
// body without being another stack of coloured boxes.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, elapsedSeconds, monotonicNow, quizScore, track } from "../lib/analytics.js";
import { quizData } from "../content/quizData.js";
import { recordContinueChoice, wasContinuePromptShownToday } from "../lib/useAppState.js";
import { questionsForLesson } from "../lib/review.js";
import { termsForSection } from "../content/lessonTerms.js";
import GlossaryTerms from "../components/GlossaryTerms.jsx";
import Icon from "../components/Icon.jsx";
import LessonVisual from "../components/LessonVisual.jsx";
import PolicySim from "../components/PolicySim.jsx";
import Question from "../components/Question.jsx";
import { Button, Card, Disclaimer, EmptyState, Note, Stack, Text } from "../components/ui.jsx";
import { fill, ink, line, radius, shadow, space, surface } from "../theme.js";

// Each lesson's body text now lives in a per-track file (backlog item 25 —
// content/lessonContent.js used to hold every lesson and was the single
// biggest contributor to this screen's lazy chunk). Loading only the track
// being read halves what a lesson-open has to download.
const TRACK_CONTENT_LOADERS = {
  economy: () => import("../content/lessonContent.economy.js"),
  money: () => import("../content/lessonContent.money.js"),
};

function Toast({ label }) {
  return (
    <div
      role="status"
      style={{
        position: "fixed", top: "12%", left: "50%", zIndex: 300,
        display: "flex", alignItems: "center", gap: space["2"],
        background: fill.ok, color: ink.onFill,
        borderRadius: radius.full, padding: `${space["3"]}px ${space["5"]}px`,
        boxShadow: shadow.overlay, fontSize: "1rem", fontWeight: 600,
        animation: "ec-toast-in 0.32s cubic-bezier(0.2,0.9,0.3,1), ec-toast-out 1.6s ease forwards",
        pointerEvents: "none",
      }}
    >
      <Icon name="check" size="1.15em" strokeWidth={2.5} />
      {label}
    </div>
  );
}

export default function LessonReader({ t, lang, lessons, index, completedLessons, completeLesson, recordReview, onBack, onNavigate }) {
  const lesson = lessons[index];
  const [content, setContent] = useState(null);
  const [celebrating, setCelebrating] = useState(false);
  const [prompt, setPrompt] = useState(null); // null | "asking" | "confirmed"
  const headingRef = useRef(null);

  // §9.2 payload state. Refs, not state, on purpose: none of this is rendered,
  // and re-rendering the reader every time a check question is answered would
  // be a real cost on a screen this long.
  //   `startedAt`   — when this lesson was opened, for lesson_completed's duration.
  //   `checkAnswers`— one entry per check question answered, for quiz_taken's score.
  //   `quizFired`   — quiz_taken is once per lesson-open, not once per answer.
  const startedAtRef = useRef(null);
  const checkAnswersRef = useRef([]);
  const quizFiredRef = useRef(false);

  // This lesson's own retrieval check. Answers feed the same spaced schedule
  // the Review tab drives, so a question missed here comes back tomorrow.
  const check = useMemo(() => questionsForLesson(quizData, lesson.id), [lesson.id]);

  // Fetch just this lesson's track content — see TRACK_CONTENT_LOADERS above.
  useEffect(() => {
    let cancelled = false;
    setContent(null);
    TRACK_CONTENT_LOADERS[lesson.track]().then((mod) => {
      if (!cancelled) setContent(mod.lessonContent[lesson.id]);
    });
    return () => {
      cancelled = true;
    };
  }, [lesson.id, lesson.track]);

  // Moving between lessons should feel like a new page: reset scroll and put
  // focus on the new title so screen-reader users hear where they landed.
  useEffect(() => {
    setPrompt(null);
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
    // Reset the §9.2 counters with the rest of the per-lesson state: a
    // duration or a score carried over from the previous lesson would be
    // worse than none at all.
    startedAtRef.current = monotonicNow();
    checkAnswersRef.current = [];
    quizFiredRef.current = false;
    track(EVENTS.LESSON_STARTED, { lessonId: lesson.id });
  }, [index]);

  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrating(false), 1700);
    return () => clearTimeout(timer);
  }, [celebrating]);

  const done = completedLessons.includes(lesson.id);
  const hasNext = index < lessons.length - 1;

  const handleComplete = () => {
    completeLesson(lesson.id);
    // §9.2's "lesson completed (with duration)" — time on this lesson since it
    // was opened. It measures the reader being open, not attention: a
    // backgrounded tab still accrues. That is a known limit of a client-side
    // timer, and the §4.3 gate it feeds ("finishing lesson 1") cares about
    // completion, not about a precise minutes figure.
    track(EVENTS.LESSON_COMPLETED, {
      lessonId: lesson.id,
      durationSec: elapsedSeconds(startedAtRef.current),
    });
    setCelebrating(true);
    if (!wasContinuePromptShownToday()) {
      recordContinueChoice(null); // records "asked today"; the answer follows
      setPrompt("asking");
    }
  };

  const answerPrompt = (optedIn) => {
    recordContinueChoice(optedIn);
    setPrompt(optedIn ? "confirmed" : null);
  };

  return (
    <div>
      {celebrating && <Toast label={t.completeLabel} />}

      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: space["2"],
          background: "none", border: "none", padding: `${space["2"]}px 0`,
          color: ink.muted, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
        }}
      >
        <Icon name="arrowLeft" size="1.1em" /> {t.backLabel}
      </button>

      {/* Title block — the lesson's own emoji is content, so it stays. */}
      <div style={{ padding: `${space["3"]}px 0 ${space["5"]}px`, borderBottom: `1px solid ${line.hairline}`, marginBottom: space["5"] }}>
        <Text variant="caption" color={ink.accent} style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {t.lessonLabel} {lesson.id} {t.ofLabel} {lessons.length}
        </Text>
        <h1
          ref={headingRef}
          tabIndex={-1}
          style={{
            margin: `${space["2"]}px 0 0`, fontSize: "1.75rem", fontWeight: 700,
            lineHeight: 1.25, letterSpacing: "-0.02em", color: ink.strong, outline: "none",
          }}
        >
          <span aria-hidden="true" style={{ marginRight: space["2"] }}>{lesson.icon}</span>
          {lesson.title[lang]}
        </h1>
        <Text variant="body" color={ink.muted} style={{ marginTop: space["2"] }}>
          {lesson.subtitle[lang]}
        </Text>
        <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"] }}>
          {t.estMinTemplate.replace("{n}", lesson.minutes)}
        </Text>
      </div>

      {/* Body — one idea per section. `content` is fetched per-track (see
          TRACK_CONTENT_LOADERS above) and briefly null right after opening a
          lesson or crossing a track boundary via prev/next. */}
      {content ? (
        <>
          <Stack gap={space["5"]}>
            {content.sections.map((section, sectionIndex) => (
              <section key={section.heading.en}>
                <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["2"] }}>
                  {section.heading[lang]}
                </Text>
                <Text variant="body" style={{ whiteSpace: "pre-line" }}>
                  {section.body[lang]}
                </Text>
                {/* §3.0.3's "or links to the glossary" — the jargon this
                    section uses, definable without leaving the lesson. */}
                <GlossaryTerms terms={termsForSection(lesson.id, sectionIndex)} t={t} lang={lang} />
              </section>
            ))}
          </Stack>

          {/* The diagram for lessons whose subject is a diagram. */}
          <LessonVisual lessonId={lesson.id} t={t} lang={lang} />

          {/* The policy simulator, for the lesson whose subject is a decision.
              Sits with the body rather than after the takeaway: it is an
              exercise on what was just read, and the takeaway/reflection pair
              should still be what closes every lesson. Renders nothing for the
              39 lessons that host no scenario. */}
          <PolicySim lessonId={lesson.id} t={t} lang={lang} />

          <Stack gap={space["3"]} style={{ marginTop: space["5"] }}>
            <Note tone="ok" label={t.keyTakeaway} icon="target">{content.takeaway[lang]}</Note>
            <Note tone="accent" label={t.tryThinking} icon="info">{content.thinkAbout[lang]}</Note>
          </Stack>
        </>
      ) : (
        <EmptyState icon="path">…</EmptyState>
      )}

      {/* Retrieval check — answering is what makes the reading stick. */}
      {check.length > 0 && (
        <Card style={{ marginTop: space["5"] }}>
          <Text variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {t.checkTitle}
          </Text>
          <Text variant="small" color={ink.muted} style={{ margin: `${space["1"]}px 0 ${space["4"]}px` }}>
            {t.checkIntro}
          </Text>
          <Stack gap={space["5"]}>
            {check.map(({ question, index: qIndex }) => (
              <Question
                key={qIndex}
                question={question}
                lang={lang}
                t={t}
                onAnswered={(wasCorrect) => {
                  recordReview(qIndex, wasCorrect);
                  track(EVENTS.QUIZ_ANSWERED, { lessonId: lesson.id, source: "lesson_check", correct: wasCorrect });
                  // The check has no "finish" button — every question is on
                  // screen at once — so the quiz is "taken" when the last one
                  // is answered. `Question` allows one answer per question,
                  // and `quizFiredRef` guards the rest.
                  const answers = checkAnswersRef.current;
                  if (!answers.some((a) => a.qIndex === qIndex)) answers.push({ qIndex, correct: wasCorrect });
                  if (!quizFiredRef.current && answers.length === check.length) {
                    quizFiredRef.current = true;
                    track(EVENTS.QUIZ_TAKEN, {
                      lessonId: lesson.id,
                      source: "lesson_check",
                      ...quizScore(answers.filter((a) => a.correct).length, answers.length),
                    });
                  }
                }}
              />
            ))}
          </Stack>
        </Card>
      )}

      {/* Continue-tomorrow prompt — local only, schedules no real notification */}
      {prompt === "asking" && (
        <div style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], marginTop: space["4"], textAlign: "center", boxShadow: shadow.raised }}>
          <Text variant="small" color={ink.strong} style={{ fontWeight: 700 }}>{t.continueTomorrowTitle}</Text>
          <Text variant="small" color={ink.muted} style={{ margin: `${space["2"]}px 0 ${space["3"]}px` }}>
            {t.continueTomorrowBody}
          </Text>
          <Button onClick={() => answerPrompt(true)}>{t.continueTomorrowCta}</Button>
          <div>
            <Button variant="quiet" onClick={() => answerPrompt(false)} style={{ marginTop: space["2"], fontSize: "0.75rem", textDecoration: "underline" }}>
              {t.continueTomorrowDismiss}
            </Button>
          </div>
        </div>
      )}
      {prompt === "confirmed" && (
        <Note tone="ok" style={{ marginTop: space["4"], textAlign: "center" }}>{t.continueTomorrowConfirmed}</Note>
      )}

      <Disclaimer text={t.disclaimer} />

      {/* Actions */}
      <div style={{ display: "flex", gap: space["2"], marginTop: space["2"] }}>
        {index > 0 && (
          <Button variant="outline" iconLeft="arrowLeft" onClick={() => onNavigate(index - 1)} style={{ flex: 1 }}>
            {t.prevLesson}
          </Button>
        )}
        {!done && (
          <Button iconLeft="check" onClick={handleComplete} style={{ flex: 2 }}>
            {t.markComplete}
          </Button>
        )}
        {/* Unlocks exactly when this lesson is finished, so there is no dead end. */}
        {hasNext && done && (
          <Button iconRight="arrowRight" onClick={() => onNavigate(index + 1)} style={{ flex: 2 }}>
            {t.nextLesson}
          </Button>
        )}
      </div>
    </div>
  );
}
