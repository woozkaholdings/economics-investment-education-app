// ═══════════════════════════════════════════════════════════════════════════
// LEARN — the path
//
// The spine of the app, and the only place the lesson list lives. The
// prototype showed it on two tabs, so "where do I continue?" had two answers;
// here there is one. A lesson opens as a pushed reader (see LessonReader),
// not as another tab.
// ═══════════════════════════════════════════════════════════════════════════

import { estimateMinutes } from "../content/lessons.js";
import Icon from "../components/Icon.jsx";
import { Button, Card, Disclaimer, ProgressBar, Text } from "../components/ui.jsx";
import { fill, font, ink, line, radius, space, surface } from "../theme.js";

export default function Learn({ t, lang, lessons, completedLessons, isUnlocked, streak, openLesson }) {
  const done = completedLessons.length;
  const total = lessons.length;

  // Resume where the learner actually is: the first lesson they haven't
  // finished, rather than always lesson 1 or the last one they tapped.
  const nextIndex = Math.max(0, lessons.findIndex((l) => !completedLessons.includes(l.id)));
  const nextLesson = lessons[nextIndex];
  const started = done > 0;

  return (
    <div>
      {/* Where you are */}
      <div style={{ padding: `${space["2"]}px 0 ${space["5"]}px` }}>
        <Text as="h1" variant="display" color={ink.strong}>{t.welcomeTitle}</Text>
        <Text variant="small" color={ink.muted} style={{ marginTop: space["2"] }}>{t.welcomeSub}</Text>
      </div>

      <Card style={{ marginBottom: space["4"] }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: space["3"] }}>
          <Text variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {t.progressLabel}
          </Text>
          <Text variant="small" color={ink.strong} style={{ fontWeight: 700 }}>
            {done} / {total}
          </Text>
        </div>
        <ProgressBar value={done} max={total} label={`${t.progressLabel}: ${done}/${total}`} />

        {streak > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: space["2"], marginTop: space["3"], color: ink.warn }}>
            <Icon name="flame" size="1.1em" />
            <Text variant="small" color={ink.warn} style={{ fontWeight: 600 }}>
              {t.streakTemplate.replace("{n}", streak)}
            </Text>
          </div>
        )}

        {nextLesson && (
          <Button
            full
            iconRight="arrowRight"
            onClick={() => openLesson(nextIndex)}
            style={{ marginTop: space["4"] }}
          >
            {started ? t.continueLesson : t.startLesson}
          </Button>
        )}
      </Card>

      {/* The path */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ margin: `${space["5"]}px 0 ${space["3"]}px` }}>
        {t.tabLearn}
      </Text>

      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {lessons.map((lesson, i) => {
          const isDone = completedLessons.includes(lesson.id);
          const unlocked = isUnlocked(i);
          const isNext = i === nextIndex && unlocked;

          return (
            <li key={lesson.id} style={{ position: "relative", paddingLeft: 44, paddingBottom: space["3"] }}>
              {/* Connector line down the path */}
              {i < lessons.length - 1 && (
                <span aria-hidden="true" style={{ position: "absolute", left: 15, top: 30, bottom: 0, width: 2, background: isDone ? fill.ok : line.hairline }} />
              )}

              {/* Step marker */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute", left: 0, top: 4,
                  width: 32, height: 32, borderRadius: radius.full,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDone ? fill.ok : isNext ? fill.accent : surface.card,
                  border: isDone || isNext ? "none" : `2px solid ${line.hairline}`,
                  color: isDone || isNext ? ink.onFill : ink.muted,
                  fontSize: font.small, fontWeight: 700,
                }}
              >
                {isDone ? <Icon name="check" size="1.1em" strokeWidth={2.5} /> : unlocked ? lesson.id : <Icon name="lock" size="0.95em" />}
              </span>

              <button
                type="button"
                disabled={!unlocked}
                onClick={() => openLesson(i)}
                style={{
                  display: "flex", alignItems: "center", gap: space["3"], width: "100%", textAlign: "left",
                  background: isNext ? surface.accentWash : "transparent",
                  border: isNext ? `1px solid ${fill.accent}22` : "1px solid transparent",
                  borderRadius: radius.md,
                  padding: `${space["2"]}px ${space["3"]}px`,
                  cursor: unlocked ? "pointer" : "default",
                  opacity: unlocked ? 1 : 0.55,
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="small" color={isDone ? ink.muted : ink.strong} style={{ fontWeight: 600 }}>
                    {lesson.title[lang]}
                  </Text>
                  <Text variant="caption" color={ink.muted} style={{ marginTop: 2 }}>
                    {unlocked ? t.estMinTemplate.replace("{n}", estimateMinutes(lesson)) : t.locked}
                  </Text>
                </span>
                {unlocked && (
                  <span style={{ color: ink.muted }}><Icon name="chevronRight" size="1.1em" /></span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
