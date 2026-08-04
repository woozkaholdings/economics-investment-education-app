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

import { useEffect, useRef, useState } from "react";
import { estimateMinutes } from "../content/lessons.js";
import { recordContinueChoice, wasContinuePromptShownToday } from "../lib/useAppState.js";
import Icon from "../components/Icon.jsx";
import { Button, Disclaimer, Note, Stack, Text } from "../components/ui.jsx";
import { fill, ink, line, radius, shadow, space, surface } from "../theme.js";

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

export default function LessonReader({ t, lang, lessons, index, completedLessons, completeLesson, onBack, onNavigate }) {
  const lesson = lessons[index];
  const [celebrating, setCelebrating] = useState(false);
  const [prompt, setPrompt] = useState(null); // null | "asking" | "confirmed"
  const headingRef = useRef(null);

  // Moving between lessons should feel like a new page: reset scroll and put
  // focus on the new title so screen-reader users hear where they landed.
  useEffect(() => {
    setPrompt(null);
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
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
          {t.estMinTemplate.replace("{n}", estimateMinutes(lesson))}
        </Text>
      </div>

      {/* Body — one idea per section */}
      <Stack gap={space["5"]}>
        {lesson.sections.map((section) => (
          <section key={section.heading.en}>
            <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["2"] }}>
              {section.heading[lang]}
            </Text>
            <Text variant="body" style={{ whiteSpace: "pre-line" }}>
              {section.body[lang]}
            </Text>
          </section>
        ))}
      </Stack>

      <Stack gap={space["3"]} style={{ marginTop: space["5"] }}>
        <Note tone="ok" label={t.keyTakeaway} icon="target">{lesson.takeaway[lang]}</Note>
        <Note tone="accent" label={t.tryThinking} icon="info">{lesson.thinkAbout[lang]}</Note>
      </Stack>

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
