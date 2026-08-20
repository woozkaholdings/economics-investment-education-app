// ═══════════════════════════════════════════════════════════════════════════
// LEARN — the path
//
// The spine of the app, and the only place the lesson list lives. The
// prototype showed it on two tabs, so "where do I continue?" had two answers;
// here there is one. A lesson opens as a pushed reader (see LessonReader),
// not as another tab.
// ═══════════════════════════════════════════════════════════════════════════

import { TRACKS } from "../content/lessons.js";
import Icon from "../components/Icon.jsx";
import { Disclaimer, ResumeCard, Text } from "../components/ui.jsx";
import { fill, font, ink, line, radius, shadow, space, surface } from "../theme.js";

export default function Learn({ t, lang, lessons, completedLessons, isUnlocked, streak, openLesson }) {
  const done = completedLessons.length;
  const total = lessons.length;

  // Resume where the learner actually is: the first lesson they haven't
  // finished, rather than always lesson 1 or the last one they tapped.
  // `lessons` arrives money-track-first, so this resumes into practical money
  // content before optional economics rather than by raw lesson id.
  const nextIndex = Math.max(0, lessons.findIndex((l) => !completedLessons.includes(l.id)));
  const nextLesson = lessons[nextIndex];
  const started = done > 0;

  // Each track with its lessons, keeping every lesson's index into `lessons`
  // so unlock/open still address the flat path the parent owns.
  const groupedTracks = TRACKS.map((tr) => {
    const items = lessons
      .map((lesson, i) => ({ lesson, i }))
      .filter(({ lesson }) => lesson.track === tr.key);
    return {
      ...tr,
      items,
      doneCount: items.filter(({ lesson }) => completedLessons.includes(lesson.id)).length,
    };
  }).filter((tr) => tr.items.length > 0);

  return (
    <div>
      {/* Where you are. `welcomeTitle` is a greeting, so it belongs only on a
          path nobody has started yet — showing it every visit meant a learner
          twenty lessons in was still being welcomed to the app. */}
      <div style={{ padding: `${space["2"]}px 0 ${space["5"]}px` }}>
        <Text as="h1" variant="display" color={ink.strong}>
          {started ? t.returningTitle : t.welcomeTitle}
        </Text>
        <Text variant="small" color={ink.muted} style={{ marginTop: space["2"] }}>
          {started ? t.returningSub : t.welcomeSub}
        </Text>
      </div>

      {/* Streak reads as a chip rather than a line inside the progress card:
          Quizlet gives the flame its own standing element, and inside the card
          it competed with the thing the card is now for — naming the lesson. */}
      {streak > 0 && (
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: space["2"],
            padding: `${space["1"]}px ${space["3"]}px`,
            marginBottom: space["3"],
            borderRadius: radius.full,
            background: surface.warnWash,
            color: ink.warn,
          }}
        >
          <Icon name="flame" size="1em" />
          <Text as="span" variant="caption" color={ink.warn} style={{ fontWeight: 700 }}>
            {t.streakTemplate.replace("{n}", streak)}
          </Text>
        </div>
      )}

      {/* Quizlet's "Jump back in" card, adapted — see ui.jsx's ResumeCard. The
          previous version of this card showed `4 / 40` and "Continue Learning"
          and never said WHICH lesson, so the one question a returning learner
          has was answered only by scrolling the path below it. */}
      {nextLesson && (
        <ResumeCard
          eyebrow={started ? t.resumeLabel : t.startHereLabel}
          title={nextLesson.title[lang]}
          meta={`${t[TRACKS.find((tr) => tr.key === nextLesson.track)?.labelKey] ?? ""} · ${t.estMinTemplate.replace("{n}", nextLesson.minutes)}`}
          progressValue={done}
          progressMax={total}
          progressLabel={`${t.progressLabel}: ${done}/${total}`}
          action={started ? t.continueLesson : t.startLesson}
          onAction={() => openLesson(nextIndex)}
        />
      )}

      {/* The path, one section per track. Two independent curricula rather
          than one chain — see the TRACKS comment in content/lessons.js. */}
      {groupedTracks.map((tr) => (
        <section key={tr.key}>
          <Text as="h2" variant="heading" color={ink.strong} style={{ margin: `${space["5"]}px 0 ${space["1"]}px` }}>
            {t[tr.labelKey]}
          </Text>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: space["3"], marginBottom: space["3"] }}>
            <Text variant="caption" color={ink.muted}>{t[tr.blurbKey]}</Text>
            <Text variant="caption" color={ink.muted} style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
              {tr.doneCount} / {tr.items.length}
            </Text>
          </div>

          {/* Genuinely an <ol>: lessons unlock in sequence, so the order is the
              feature. `role="list"` per check-data.mjs §20. */}
          <ol role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {tr.items.map(({ lesson, i }, posInTrack) => {
              const isDone = completedLessons.includes(lesson.id);
              const unlocked = isUnlocked(i);
              const isNext = i === nextIndex && unlocked;

              return (
                <li key={lesson.id} style={{ position: "relative", paddingLeft: 44, paddingBottom: space["3"] }}>
                  {/* Connector line, stopping at the end of this track */}
                  {posInTrack < tr.items.length - 1 && (
                    <span aria-hidden="true" style={{ position: "absolute", left: 15, top: 30, bottom: 0, width: 2, background: isDone ? fill.ok : line.hairline }} />
                  )}

                  {/* Step marker. Shows the lesson's position WITHIN this
                      track, not its id — matching LessonReader's "Lesson N of
                      M". Until 2026-08-18 this printed `lesson.id`, which was
                      only ever right because ids happened to be renumbered to
                      match display order; the three-track reorder broke that
                      and the economy track's first node read "29". Ids are
                      stable storage keys and are deliberately no longer
                      aligned to display order — see lessonsByTrack() in
                      content/lessons.js. */}
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
                    {isDone ? <Icon name="check" size="1.1em" strokeWidth={2.5} /> : unlocked ? posInTrack + 1 : <Icon name="lock" size="0.95em" />}
                  </span>

                  {/* The current lesson is the loudest thing on the path.
                      Duolingo's whole path design turns on one node being
                      unmistakably next; here every row had the same weight and
                      only a green tick separated done from to-do, so the eye
                      landed nowhere. Completed rows now recede instead.

                      This also fixes a border that never rendered: the old
                      value was `1px solid ${fill.accent}22`, and `fill.accent`
                      is the string `var(--fill-accent)` — so the declaration
                      read `var(--fill-accent)22`, which is invalid CSS and was
                      dropped. An 8-digit hex suffix only works on a hex
                      literal, and this design system has none by policy. */}
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => openLesson(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: space["3"], width: "100%", textAlign: "left",
                      background: isNext ? surface.card : "transparent",
                      border: `${isNext ? 2 : 1}px solid ${isNext ? fill.accent : "transparent"}`,
                      borderRadius: radius.md,
                      boxShadow: isNext ? shadow.raised : "none",
                      padding: isNext ? `${space["3"]}px ${space["3"]}px` : `${space["2"]}px ${space["3"]}px`,
                      cursor: unlocked ? "pointer" : "default",
                      opacity: unlocked ? 1 : 0.55,
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        variant="small"
                        color={isNext ? ink.strong : isDone ? ink.muted : ink.body}
                        style={{ fontWeight: isNext ? 700 : 600 }}
                      >
                        {lesson.title[lang]}
                      </Text>
                      <Text variant="caption" color={isNext ? ink.accent : ink.muted} style={{ marginTop: 2, fontWeight: isNext ? 700 : 400 }}>
                        {unlocked ? t.estMinTemplate.replace("{n}", lesson.minutes) : t.locked}
                      </Text>
                    </span>
                    {unlocked && (
                      <span style={{ color: isNext ? ink.accent : ink.muted, display: "flex" }}>
                        <Icon name="chevronRight" size="1.1em" strokeWidth={isNext ? 2.4 : 1.8} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
