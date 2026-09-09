// ═══════════════════════════════════════════════════════════════════════════
// LESSON READER
//
// A pushed, full-screen view rather than a tab: reading is the one thing in
// this app that deserves undivided attention (LAUNCH_PLAN §3.1).
//
// Layout follows the clarity standard — one idea per section, generous
// measure, and the takeaway and reflection prompt visually distinct from the
// body without being another stack of colored boxes.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, elapsedSeconds, monotonicNow, quizScore, track } from "../lib/analytics.js";
import { lessonPlacement } from "../content/lessons.js";
import { quizMeta } from "../content/quizMeta.js";
import { recordContinueChoice, wasContinuePromptShownToday } from "../lib/useAppState.js";
import { questionsForLesson } from "../lib/review.js";
import { TAIL, termsForSection } from "../content/lessonTerms.js";
import GlossaryTerms from "../components/GlossaryTerms.jsx";
import Icon from "../components/Icon.jsx";
import LessonVisual from "../components/LessonVisual.jsx";
import PolicySim from "../components/PolicySim.jsx";
import Question from "../components/Question.jsx";
import { Announcer, Button, Card, Disclaimer, EmptyState, LoadFailure, Note, Stack, Text } from "../components/ui.jsx";
import { family, fill, ink, line, MIN_TAP, radius, shadow, space, surface } from "../theme.js";

// Lesson body text is split two ways: by track (item 25, 2026-08-14) and by
// language (item 45, 2026-08-17). This screen loads exactly one of the ten
// resulting files — the open lesson's track, in the reader's language.
//
// The second axis was the bigger win. Per-track files still carried all five
// languages, so lessonContent.money.js was 480 kB of body text of which any
// one reader could read ~97 kB: en 97, es 90, ko 102, zh 79, ja 112. Four
// fifths of the app's largest asset was text that device would never show.
//
// Vite needs literal specifiers to statically analyze a dynamic import, so
// this is a flat map rather than a computed path — the ten entries are what
// make ten separate chunks instead of one bundle of everything.
const CONTENT_LOADERS = {
  "economy:en": () => import("../content/lessonContent.economy.en.js"),
  "economy:es": () => import("../content/lessonContent.economy.es.js"),
  "economy:ko": () => import("../content/lessonContent.economy.ko.js"),
  "economy:zh": () => import("../content/lessonContent.economy.zh.js"),
  "economy:ja": () => import("../content/lessonContent.economy.ja.js"),
  "money:en": () => import("../content/lessonContent.money.en.js"),
  "money:es": () => import("../content/lessonContent.money.es.js"),
  "money:ko": () => import("../content/lessonContent.money.ko.js"),
  "money:zh": () => import("../content/lessonContent.money.zh.js"),
  "money:ja": () => import("../content/lessonContent.money.ja.js"),
  // `essentials` (lessons 1-15) split out of `money` 2026-08-18 — fifteen
  // entries a reader on the main path now never downloads.
  "essentials:en": () => import("../content/lessonContent.essentials.en.js"),
  "essentials:es": () => import("../content/lessonContent.essentials.es.js"),
  "essentials:ko": () => import("../content/lessonContent.essentials.ko.js"),
  "essentials:zh": () => import("../content/lessonContent.essentials.zh.js"),
  "essentials:ja": () => import("../content/lessonContent.essentials.ja.js"),
};

// Quiz text is split per language too (item 48) and loaded alongside the
// lesson body, since a lesson and its check are always read together.
const QUIZ_TEXT_LOADERS = {
  en: () => import("../content/quizText.en.js"),
  es: () => import("../content/quizText.es.js"),
  ko: () => import("../content/quizText.ko.js"),
  zh: () => import("../content/quizText.zh.js"),
  ja: () => import("../content/quizText.ja.js"),
};

function Toast({ label }) {
  return (
    // `aria-hidden` rather than `role="status"`: this node is inserted with its
    // text already inside it, which is the one shape a live region cannot
    // announce (see `Announcer`). It carries no focusable content and is
    // already `pointerEvents: none`, so hiding it costs a reader nothing — the
    // announcement is made by the persistent `Announcer` below instead.
    <div
      aria-hidden="true"
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
  // `content === null` used to mean two different things — still downloading,
  // and will never arrive — and the screen rendered the same "…" for both
  // (item 96). This separates them, because only one of them may keep the
  // Mark Complete button on screen.
  const [loadFailed, setLoadFailed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [prompt, setPrompt] = useState(null); // null | "asking" | "confirmed"
  // The pre-lesson hook's guess, as an option index, or null if not yet
  // guessed. State rather than a ref because the end-of-lesson check renders
  // it back to the reader — that recall is the whole point of asking early.
  const [hookChoice, setHookChoice] = useState(null);
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
  // Questions come from quizMeta, never from the loaded text: the `id` that
  // keys the schedule and the `answer` that grades it both live there, so
  // neither depends on which language module happens to be loaded. The index
  // is used for one thing — merging in that module's words.
  const [quizText, setQuizText] = useState(null);
  const check = useMemo(
    () =>
      quizText
        ? questionsForLesson(quizMeta, lesson.id).map(({ question, index }) => ({
            question: { ...question, ...quizText[index] },
            index,
          }))
        : [],
    [lesson.id, quizText],
  );

  // ── The pre-lesson hook ───────────────────────────────────────────────────
  // One question, asked BEFORE the body, drawn from the lesson's own check
  // rather than from new content — every one of the 40 lessons already has at
  // least one question, so this needs no authoring and no fifth-language
  // translation to reach full coverage.
  //
  // Why the first question and not all of them: this is a hook, not a pre-test.
  // Two lessons carry two questions; asking both here would front-load the
  // lesson with a quiz and blunt the one thing a hook does, which is make the
  // reader curious about a single specific claim.
  //
  // Why only when the lesson is unfinished: the effect this is built on (a
  // guess before instruction improves later recall, even when the guess is
  // wrong) is about first exposure. On a revisit the reader already knows the
  // answer, so the hook would be a quiz question with the lesson printed
  // underneath — noise, and a spoiler for the check below.
  // (Derived below, next to `done`, which it depends on.)

  // Fetch just this lesson's track content, in this reader's language — see
  // CONTENT_LOADERS above. `lang` is in the dependency list because switching
  // language now changes which file holds the text, not just which field is
  // read out of it: the picker has to trigger a fetch, where before it was a
  // pure re-render.
  //
  // Both loaders carry a `.catch`. Without one, a 404 on a content chunk —
  // the ordinary consequence of a redeploy while a tab is open, since `dist/`
  // ships content-hashed chunks — left the promise rejected, `content` null
  // forever, and the reader showing a lesson with no body and a working Mark
  // Complete button (item 96, measured at a 77% content loss).
  useEffect(() => {
    let canceled = false;
    setContent(null);
    setQuizText(null);
    setLoadFailed(false);
    const fail = (error) => {
      if (canceled) return;
      console.error("[LessonReader] content load failed", error);
      setLoadFailed(true);
    };
    CONTENT_LOADERS[`${lesson.track}:${lang}`]()
      .then((mod) => {
        if (!canceled) setContent(mod.lessonContent[lesson.id]);
      })
      .catch(fail);
    QUIZ_TEXT_LOADERS[lang]()
      .then((mod) => {
        if (!canceled) setQuizText(mod.quizText);
      })
      .catch(fail);
    return () => {
      canceled = true;
    };
  }, [lesson.id, lesson.track, lang]);

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
    setHookChoice(null);
    track(EVENTS.LESSON_STARTED, { lessonId: lesson.id });
  }, [index]);

  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => setCelebrating(false), 1700);
    return () => clearTimeout(timer);
  }, [celebrating]);

  const done = completedLessons.includes(lesson.id);
  // `!loadFailed` is not belt-and-braces: the two loaders are independent, so
  // the body can 404 while the quiz text arrives — which would ask for a guess
  // about a lesson the reader is about to be shown none of.
  const hook = !done && !loadFailed && check.length > 0 ? check[0] : null;

  // Position and track label, from `lessonPlacement` — the shared helper
  // `Practice.jsx` already uses, passed THIS screen's `lessons` prop so the
  // position is still derived from the same flat, track-ordered list the path
  // renders and the two can't disagree. (The helper defaults to the raw
  // catalog order; passing the prop is what keeps the original guarantee.)
  // Only `labelKey` comes from TRACKS, which is where the label lives — the
  // ORDERING is still never re-derived here.
  //
  // This was three inline lines doing `lessonPlacement`'s position/total
  // arithmetic a second time. Item 81 made the same call on Practice — "a
  // shared helper rather than a third inline derivation, because this is the
  // third surface to ask the question and the second to get it wrong."
  //
  // `lesson` is `lessons[index]`, so the lookup cannot miss and there is no
  // not-found branch to write here. Practice needs one because it resolves a
  // stored quiz id that can outlive its lesson; this screen does not.
  const placement = lessonPlacement(lesson.id, lessons);
  const trackPosition = placement.position;
  const trackTotal = placement.total;
  const trackName = (placement.labelKey && t[placement.labelKey]) || "";
  const hasNext = index < lessons.length - 1;

  // Previous stops at the track boundary, and that is a lock, not a nicety
  // (backlog item 80). It used to be gated on `index > 0` alone and stepped
  // through the FLAT, track-ordered list, so from the first lesson of a track
  // it walked into the previous track's LAST lesson. Since every track's first
  // lesson is unlocked from install, a brand-new user could open essentials
  // lesson 1 and press Previous back through all thirteen money lessons into
  // the final economy lesson, with nothing completed — reading the whole
  // curriculum past a gate the Learn path (`disabled` rows) and the deep-link
  // router (a locked `#/lesson/N` redirects to the path) both enforce.
  //
  // Within a track this is safe by construction and stays as it was: you can
  // only be reading a lesson that is unlocked, and `App.isUnlocked` unlocks it
  // only once the previous lesson IN THE SAME TRACK is complete — so the
  // lesson behind it is always one you have finished.
  //
  // `hasNext` deliberately keeps no such test, because forward motion cannot
  // reach a locked lesson: Next only renders once THIS lesson is `done`, and
  // index+1 is then either the next lesson in this track (unlocked by that
  // completion) or the first lesson of the next track (never gated).
  const hasPrev = index > 0 && lessons[index - 1].track === lesson.track;

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
      {/* Always mounted and empty until there is something to say, so that the
          region pre-exists its own content. The toast beside it is the visual
          half of the same message and is `aria-hidden`. */}
      <Announcer message={celebrating ? t.completeLabel : ""} />
      {celebrating && <Toast label={t.completeLabel} />}

      <button
        type="button"
        onClick={onBack}
        aria-label={t.backLabel}
        title={t.backLabel}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          // Icon-only: no label to grow, so both dimensions pin to the floor.
          // Was 40x40 — the 2026-08-23 chip change sized it to the visual disc
          // rather than to the target.
          width: MIN_TAP, height: MIN_TAP, flexShrink: 0,
          background: surface.card, border: `1px solid ${line.hairline}`,
          borderRadius: radius.full, boxShadow: shadow.raised,
          color: ink.body, cursor: "pointer",
        }}
      >
        <Icon name="arrowLeft" size="1.1em" />
      </button>

      {/* Title block — the lesson's own emoji is content, so it stays. */}
      <div style={{ padding: `${space["3"]}px 0 ${space["5"]}px`, borderBottom: `1px solid ${line.hairline}`, marginBottom: space["5"] }}>
        {/* Position WITHIN the track, not the raw id. The catalog is three
            independent curricula, so a global "Lesson 29 of 40" numbered a
            sequence nobody reads in that order — and after the 2026-08-18
            reordering it would open the app on "Lesson 29 of 40". Ids stay
            stable for storage and deep links; this is the display.

            AND THE TRACK NAME, because a position alone is ambiguous three
            ways. Item 81 settled this exact question on the review queue —
            "with three tracks there are three 'Lesson 1's" — and named the
            reader as the surface that already showed a position rather than
            an id. It did not carry the track half back here, so the reader
            spent the interval saying "LESSON 1 OF 12" with nothing on screen
            naming which curriculum that is. Measured on the built app: the
            two places the learner most needs it are the two track boundaries,
            where "Next Lesson" walks from economy 12/12 into money 1/17 and
            from money 17/17 into essentials 1/15 — a different curriculum,
            the second one the app itself labels "(Optional)", with the
            counter resetting as the only cue.

            Shape matches `reviewFromLesson` ("Lesson {n} · {track}") rather
            than inventing a second one: NUMBER FIRST, so the number is what
            survives truncation. No new locale key — the three track labels
            already exist in all five languages and the separator is
            punctuation. */}
        <Text variant="caption" color={ink.accent} style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {t.lessonLabel} {trackPosition} {t.ofLabel} {trackTotal}
          {trackName ? ` · ${trackName}` : ""}
        </Text>
        <h1
          ref={headingRef}
          tabIndex={-1}
          style={{
            margin: `${space["2"]}px 0 0`, fontFamily: family.display, fontSize: "1.75rem", fontWeight: 700,
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

      {/* HOOK — the guess that comes before the reading. Deliberately withholds
          the verdict (`reveal={false}`): the lesson is the answer, and the
          check at the bottom is where it lands. Nothing here touches the
          spaced-repetition schedule — see `recordReview`'s absence below. */}
      {hook && (
        <Card style={{ marginBottom: space["5"] }}>
          {/* An <h2>, not a styled <p> — and the fix for item 106's h1 -> h3 skip.
              This label was always the hook block's title; it just was not marked
              up as one, so the only heading between the lesson <h1> and the first
              body <h2> was the QUESTION's <h3> inside <Question>. Promoting the
              question instead would have made a pre-quiz item a sibling of the
              body sections, which is a worse description of the document; naming
              the block it already belongs to fixes the order AND gives the block
              a rotor entry it never had. Nothing moves visually: <Text> sets
              margin:0 plus explicit font metrics, so the UA's h2 defaults are all
              overridden and this renders pixel-identically to the <p> it replaces
              (verified live, computed styles compared before and after). */}
          <Text as="h2" variant="caption" color={ink.accent} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {t.hookTitle}
          </Text>
          <Text variant="small" color={ink.muted} style={{ margin: `${space["1"]}px 0 ${space["4"]}px` }}>
            {t.hookIntro}
          </Text>
          <Question
            question={hook.question}
            lang={lang}
            t={t}
            reveal={false}
            onAnswered={(_wasCorrect, choiceIndex) => {
              setHookChoice(choiceIndex);
              // NOT recordReview: a guess made before the lesson is not
              // retrieval, and feeding it to the Leitner schedule would push a
              // question the reader has never been taught into "seen and
              // failed" — scheduling review of material that was never
              // presented. The check below is the graded attempt.
              track(EVENTS.QUIZ_ANSWERED, {
                lessonId: lesson.id,
                source: "lesson_hook",
                correct: _wasCorrect,
              });
            }}
          />
        </Card>
      )}

      {/* Body — one idea per section. `content` is fetched per-track (see
          TRACK_CONTENT_LOADERS above) and briefly null right after opening a
          lesson or crossing a track boundary via prev/next. */}
      {content ? (
        <>
          <Stack gap={space["5"]}>
            {/* Keyed by index, not by heading text: the loaded module is now
                language-specific, so a heading is no longer stable across a
                language switch and keying on it would remount every section. */}
            {/* A NAMED region, per the convention item 82 set on the Learn path:
                the <section> already contained the <h2> that names it, so
                aria-labelledby points at that same heading rather than adding a
                second copy of the label to keep in sync. Id shape is the one
                already in use here — a literal prefix plus a stable key — and
                sectionIndex is that key for the same reason it is the React key.
                Verify at the DOM level (attribute present, getElementById
                resolves, target carries the heading text): read_page surfaces
                aria-label names but NOT aria-labelledby names, so seeing
                `region` in its tree proves nothing either way. */}
            {content.sections.map((section, sectionIndex) => (
              <section key={sectionIndex} aria-labelledby={`lesson-section-${sectionIndex}-title`}>
                <Text as="h2" id={`lesson-section-${sectionIndex}-title`} variant="heading" color={ink.strong} style={{ marginBottom: space["2"] }}>
                  {section.heading}
                </Text>
                <Text variant="body" style={{ whiteSpace: "pre-line" }}>
                  {section.body}
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
              43 lessons that host no scenario. */}
          <PolicySim lessonId={lesson.id} t={t} lang={lang} />

          <Stack gap={space["3"]} style={{ marginTop: space["5"] }}>
            <Note tone="ok" label={t.keyTakeaway} icon="target">{content.takeaway}</Note>
            <Note tone="accent" label={t.tryThinking} icon="info">{content.thinkAbout}</Note>
            {/* §3.0.3 for the closing pair. Nine glossary terms across seven
                lessons have their only use in these two boxes — "debt-to-GDP
                ratio" opens 33's reflection prompt, 35's takeaway is where QE
                is first named — and until this row existed a learner met them
                with nothing to tap. Own label, because "Terms in this section"
                would be pointing at two Notes that are not a section. */}
            <GlossaryTerms terms={termsForSection(lesson.id, TAIL)} t={t} lang={lang} label={t.lessonTermsClosingLabel} />
          </Stack>
        </>
      ) : loadFailed ? (
        <LoadFailure t={t} />
      ) : (
        <EmptyState icon="path">{t.loadingLabel}</EmptyState>
      )}

      {/* Retrieval check — answering is what makes the reading stick. It is
          withheld on a load failure for the same reason the hook is: it
          feeds the Leitner schedule, and grading recall of a body that never
          rendered would put a never-taught question into the review queue. */}
      {!loadFailed && check.length > 0 && (
        <Card style={{ marginTop: space["5"] }}>
          {/* An <h2> for the same reason as the hook's, above. The check card's
              questions are <h3>s too, so without this the last body section's
              <h2> was silently acting as their parent — legal, but it named the
              wrong thing: a reader arriving by heading heard the final section's
              title where the retrieval check begins. */}
          <Text as="h2" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {t.checkTitle}
          </Text>
          <Text variant="small" color={ink.muted} style={{ margin: `${space["1"]}px 0 ${space["4"]}px` }}>
            {/* Two lessons carry two check questions, and this line said "A
                quick question" over both of them — "una pregunta", "一个小问题"
                — until 2026-09-06. Two keys rather than one count template:
                §68 exists because a {n} parked inside a noun phrase renders
                "1 preguntas" the moment the count reaches its first state,
                and the branch this needs already exists in check.length. */}
            {check.length > 1 ? t.checkIntroPlural : t.checkIntro}
          </Text>
          <Stack gap={space["5"]}>
            {check.map(({ question, index: qIndex }) => (
              <div key={qIndex}>
                {/* Close the loop the hook opened: name the guess back to the
                    reader before they answer for real, so the comparison is
                    theirs to make. Only on the question the hook actually
                    asked — the second question in a two-question lesson was
                    never guessed at. */}
                {hook?.index === qIndex && hookChoice !== null && (
                  <Text variant="small" color={ink.accent} style={{ marginBottom: space["2"], fontWeight: 600 }}>
                    {t.hookRecallTemplate.replace("{answer}", question.opts[hookChoice])}
                  </Text>
                )}
              <Question
                question={question}
                lang={lang}
                t={t}
                onAnswered={(wasCorrect) => {
                  // `onlyWhenDue`: this block re-mounts on any ordinary
                  // navigation — a language switch, or leaving the lesson and
                  // coming back — and a re-mount resets `Question`'s own
                  // one-answer lock, which is component state. Without this
                  // flag the second answer landed in the schedule as a new
                  // one, promoting a question the learner had just missed.
                  // See `acceptsScheduleUpdate` in lib/review.js.
                  recordReview(question.id, wasCorrect, { onlyWhenDue: true });
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
              </div>
            ))}
          </Stack>
        </Card>
      )}

      {/* Continue-tomorrow prompt — local only, schedules no real notification.
          The CTA is therefore a commitment the LEARNER makes ("I'll be back
          tomorrow"), never one the app makes. It read "Remind me tomorrow" in all
          five languages from 2026-08-03 to 2026-08-31 — ko and zh said "notify me"
          outright — while nothing anywhere in this build has ever sent a
          notification. Do not reword this toward a promise until a reminder
          actually ships; that needs the held platform decision (LAUNCH_PLAN §2.1). */}
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
      {/* `flexWrap` is the whole fix for a horizontal overflow that shipped for
          weeks, and it is here rather than on `Button` because the defect is a
          property of the ROW, not of any button. Measured 2026-09-03 on the
          built app at 320px: the two buttons cannot shrink below their
          min-content width (a flex item's `min-width` is `auto`), so at the
          app's own 1.3 font scale "Anterior" (142.3px) + "Completar" (163px) +
          the 8px gap needed 313.3px of a 288px row and the primary action ran
          9.3px past the viewport — `es` AND `en` ("Mark Complete", 326.6px);
          ko/zh/ja were clean because CJK breaks between characters. Browser
          text zoom goes past the app's ceiling, and at 200% the same row
          reached 447px.
          Wrapping is the correct condition and not a threshold: a flex line
          breaks on the items' min-content widths, which is exactly when they
          stop fitting — so nothing changes at any size where they do fit
          (verified identical geometry at scale 1.0), and no breakpoint has to
          be guessed for a future label. `min-width: 0` was rejected for the
          reason index.css records for `.ec-bar-row`: it silences the geometry
          probe and leaves the text overflowing its own button. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: space["2"], marginTop: space["2"] }}>
        {hasPrev && (
          <Button variant="outline" iconLeft="arrowLeft" onClick={() => onNavigate(index - 1)} style={{ flex: 1 }}>
            {t.prevLesson}
          </Button>
        )}
        {/* The whole point of item 96: a lesson whose body did not arrive must
            not be completable. Completion feeds the streak AND the spaced-review
            queue, so a stray tap here fabricates both. */}
        {!done && !loadFailed && (
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
