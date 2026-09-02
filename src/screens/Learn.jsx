// ═══════════════════════════════════════════════════════════════════════════
// LEARN — the path
//
// The spine of the app, and the only place the lesson list lives. The
// prototype showed it on two tabs, so "where do I continue?" had two answers;
// here there is one. A lesson opens as a pushed reader (see LessonReader),
// not as another tab.
//
// Redesigned 2026-08-21 against the owner's UIUX/ references. Three changes
// worth naming, because two of them are corrections rather than styling:
//
//   1. LOCKED ROWS NO LONGER USE `opacity`. The old row set `opacity: 0.55`
//      on the whole button, which composites the text against the canvas and
//      drops it to **2.82:1 (ink.body) and 2.31:1 (ink.muted)** in the light
//      palette, 4.27:1 and 2.98:1 in dark — all four below WCAG AA's 4.5:1
//      for body text. check-data.mjs §28 asserts AA on every token PAIR and
//      cannot see an opacity applied on top of one, so the suite passed while
//      the rendered text failed. Locked rows now carry `ink.muted` at full
//      strength (5.79:1 light / 7.25:1 dark) and read as locked through a
//      dashed border and the lock marker instead.
//   2. Completed markers stay `fill.ok`, NOT the accent. The redesign
//      artboard drew them in blue; that contradicts theme.js's rule 2 (blue
//      means "interactive or current", green means success), and the shipped
//      code was right. Kept as-is deliberately.
//   3. Tracks other than the one you are in collapse. Forty rows on one
//      screen buried the current lesson; the active track opens by default
//      and the rest are one summary row each, with a per-track progress bar
//      that was previously only a "3 / 12" text pair.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { TRACKS } from "../content/lessons.js";
import Icon from "../components/Icon.jsx";
import { Disclaimer, ProgressBar, ResumeCard, SrOnly, Text } from "../components/ui.jsx";
import { fill, font, ink, line, MIN_TAP, radius, shadow, space, surface } from "../theme.js";

export default function Learn({ t, lang, lessons, completedLessons, isUnlocked, streak, openLesson, goToReview }) {
  const done = completedLessons.length;
  const total = lessons.length;

  // Resume where the learner actually is: the first lesson they haven't
  // finished IN THE TRACK THEY LAST FINISHED ONE IN, falling back to the first
  // unfinished lesson in the flat path.
  //
  // ⚠️ THE TRACK CLAUSE IS NOT DECORATION — without it this pointer sends
  // every learner who did not start in `economy` back to lesson 1 of the app.
  // Measured live on 2026-09-02, before the fix, with
  // `ecycles_completed_lessons = [16,17,18]` (three lessons into "Thinking
  // About Money", the track the product is named for): the card read
  // "Pick up where you left off — NEXT UP: Transactions: The Building Block",
  // the FIRST lesson of a track that learner had never opened, "Continue
  // Learning" opened it, and the accordion expanded the 0/12 track while
  // collapsing the 3/17 one. Control, same session: `[29]` gave "Credit: The
  // Most Important Part" with `economy` expanded, so the probe was reading the
  // pointer and not a constant.
  // The three tracks are INDEPENDENT and gate only within themselves
  // (`App.isUnlocked`), so "first unfinished in the flat list" is not "where
  // you left off" for anyone outside `economy` — for them it is *always*
  // lesson 1, which is exactly what the paragraph below says this pointer
  // exists to avoid.
  //
  // `completedLessons` is append-ordered (`useAppState.completeLesson` pushes,
  // and the one-time id migration `.map`s, so both preserve it), which is what
  // makes its last entry a usable "where were you" without persisting a second
  // key. A learner with nothing completed has no last entry and falls through
  // to the flat pointer, so a new install still opens on `economy`'s first
  // lesson — see the initialRoute comment in App.jsx, which is the record for
  // that invariant.
  //
  // `lessons` is `lessonsByTrack()`, so it arrives ECONOMY-track-first
  // (economy → money → essentials) after the 2026-08-18 reversal — see
  // DECISIONS.md's two-tracks section, which is the record if this comment and
  // that document ever disagree. `essentials` is optional and gates nothing,
  // so it sits last here exactly as it does on the page, and the FALLBACK
  // pointer reaches it only once the other two tracks are finished.
  //
  // Index-based on purpose: ids are deliberately NOT aligned to display order,
  // so "the next lesson" is a position in this list and never a lowest-id.
  //
  // ⚠️ -1 IS KEPT AS -1. `findIndex` returns -1 once every lesson is
  // complete, and this line used to wrap it in `Math.max(0, …)`, which turned
  // "there is no next lesson" into "the next lesson is the first one".
  // Measured live at 44/44 on 2026-09-02, before the fix: the card read
  // "NEXT UP — Transactions: The Building Block … Progress: 44/44 …
  // Continue Learning", and lesson 1's row carried BOTH the "Completed" and
  // the "Current lesson" screen-reader markers, because `isNext` compares
  // against this index. The app had no finished state; it looped.
  // -1 is now the app's only "path is done" signal, and both consumers below
  // (`nextLesson`, and `isNext` on each row) read it as one.
  const flatNextIndex = lessons.findIndex((l) => !completedLessons.includes(l.id));
  // The track of the last lesson finished, and the first unfinished lesson in
  // it. -1 when nothing is completed, when the stored id is not a lesson any
  // more, or when that track is itself finished — all three fall back.
  const lastFinishedTrack = lessons.find(
    (l) => l.id === completedLessons[completedLessons.length - 1]
  )?.track;
  const trackNextIndex = lastFinishedTrack === undefined
    ? -1
    : lessons.findIndex((l) => l.track === lastFinishedTrack && !completedLessons.includes(l.id));
  const nextIndex = trackNextIndex === -1 ? flatNextIndex : trackNextIndex;
  const nextLesson = nextIndex === -1 ? null : lessons[nextIndex];
  // Deliberately the FLAT pointer: "the path is done" is a statement about all
  // 44 lessons, and must not become true because one track ran out.
  const pathComplete = total > 0 && flatNextIndex === -1;
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

  // Only the track you are actually in is open on arrival. Deliberately seeded
  // from `nextLesson` rather than defaulting to the first track: after the
  // economy track is finished the learner's next lesson is in `money`, and
  // opening `economy` would hide the one row they came back for.
  const [openTrack, setOpenTrack] = useState(nextLesson?.track ?? groupedTracks[0]?.key);

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
          {pathComplete ? t.pathDoneSub : started ? t.returningSub : t.welcomeSub}
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

      {/* The finished state. Same card, because a learner who has read all
          three tracks is still being told "here is where you are and here is
          the one thing to do next" — only the next thing is no longer a
          lesson. It points at Review rather than at nothing: the check
          questions are already in that queue, and spacing them out is the
          part of the product that outlives the path. */}
      {pathComplete && (
        <ResumeCard
          eyebrow={t.pathDoneEyebrow}
          title={t.pathDoneTitle}
          meta={t.pathDoneBody}
          progressValue={done}
          progressMax={total}
          progressLabel={`${t.progressLabel}: ${done}/${total}`}
          action={t.pathDoneAction}
          onAction={goToReview}
        />
      )}

      {/* The path, one section per track. Two independent curricula rather
          than one chain — see the TRACKS comment in content/lessons.js. */}
      {/* Each track is a NAMED region, not a bare <section> (backlog item 82).
          Each already contained the <h2> that names it; `aria-labelledby`
          points at that same heading rather than adding a second copy of the
          label to keep in sync. Id shape follows the convention already in use
          for `age-band-${band}` and `sector-window-${window}`: a literal
          prefix plus a stable key.

          Per HTML-AAM a <section> maps to `region` only once it has an
          accessible name, so naming these is what makes them landmarks — but
          note that the exact before/after is NOT observable with the
          `read_page` tool available here, which prints every <section> as
          `region` regardless and does not render `aria-labelledby` names at
          all (see the Environment note in AGENT_LOG.md). Verify changes here
          at the DOM level: attribute present, `getElementById` resolves, target
          carries the expected text. */}
      {groupedTracks.map((tr) => {
        const expanded = openTrack === tr.key;
        const panelId = `track-${tr.key}-panel`;

        return (
          <section key={tr.key} aria-labelledby={`track-${tr.key}-title`} style={{ marginTop: space["5"] }}>
            {/* ARIA APG accordion shape: the heading holds the button, so the
                track name is both the landmark's accessible name and the
                control's. No new locale key is needed for the toggle — the
                label already exists and `aria-expanded` carries the state. */}
            <Text as="h2" id={`track-${tr.key}-title`} variant="heading" color={ink.strong} style={{ margin: 0 }}>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenTrack(expanded ? null : tr.key)}
                style={{
                  display: "flex", alignItems: "center", gap: space["2"],
                  width: "100%", minHeight: MIN_TAP, padding: 0,
                  background: "transparent", border: "none", cursor: "pointer",
                  font: "inherit", color: "inherit", textAlign: "left",
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>{t[tr.labelKey]}</span>
                <Text as="span" variant="caption" color={ink.muted} style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {tr.doneCount} / {tr.items.length}
                </Text>
                <span
                  aria-hidden="true"
                  style={{
                    display: "flex", color: ink.muted,
                    transform: expanded ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <Icon name="chevronRight" size="1.1em" strokeWidth={2} />
                </span>
              </button>
            </Text>

            <Text variant="caption" color={ink.muted} style={{ marginBottom: space["2"] }}>
              {t[tr.blurbKey]}
            </Text>

            {/* Per-track progress. The pair of numbers above says how many;
                this says how far, which is the thing a path screen is for. */}
            <div style={{ marginBottom: space["3"] }}>
              <ProgressBar
                value={tr.doneCount}
                max={tr.items.length}
                label={`${t[tr.labelKey]} — ${t.progressLabel}: ${tr.doneCount}/${tr.items.length}`}
              />
            </div>

            {/* Genuinely an <ol>: lessons unlock in sequence, so the order is the
                feature. `role="list"` per check-data.mjs §20.
                `hidden` rather than unmounting, so `aria-controls` always
                resolves and the collapsed panel leaves the a11y tree. */}
            <ol id={panelId} hidden={!expanded} role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {tr.items.map(({ lesson, i }, posInTrack) => {
                const isDone = completedLessons.includes(lesson.id);
                const unlocked = isUnlocked(i);
                const isNext = i === nextIndex && unlocked;

                return (
                  <li key={lesson.id} style={{ position: "relative", paddingLeft: 48, paddingBottom: space["3"] }}>
                    {/* Connector line, stopping at the end of this track */}
                    {posInTrack < tr.items.length - 1 && (
                      <span aria-hidden="true" style={{ position: "absolute", left: 17, top: 34, bottom: 0, width: 2, background: isDone ? fill.ok : line.hairline }} />
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
                        position: "absolute", left: 0, top: 2,
                        width: 36, height: 36, borderRadius: radius.full,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isDone ? fill.ok : isNext ? fill.accent : unlocked ? surface.card : surface.sunken,
                        border: isDone || isNext ? "none" : `2px solid ${line.hairline}`,
                        boxShadow: isNext ? shadow.lifted : "none",
                        color: isDone || isNext ? ink.onFill : ink.muted,
                        fontSize: font.small, fontWeight: 700,
                      }}
                    >
                      {isDone ? <Icon name="check" size="1.15em" strokeWidth={2.5} /> : unlocked ? posInTrack + 1 : <Icon name="lock" size="1em" />}
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
                        literal, and this design system has none by policy.

                        LOCKED rows carry a dashed hairline and full-strength
                        `ink.muted` rather than `opacity: 0.55` — see this
                        file's header for the four contrast ratios that change
                        made, and why the suite could not catch the old one. */}
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => openLesson(i)}
                      style={{
                        display: "flex", alignItems: "center", gap: space["3"], width: "100%", textAlign: "left",
                        minHeight: MIN_TAP,
                        background: isNext ? surface.card : "transparent",
                        border: unlocked
                          ? `${isNext ? 2 : 1}px solid ${isNext ? fill.accent : "transparent"}`
                          : `1px dashed ${line.hairline}`,
                        borderRadius: radius.md,
                        boxShadow: isNext ? shadow.raised : "none",
                        padding: isNext ? `${space["3"]}px ${space["3"]}px` : `${space["2"]}px ${space["3"]}px`,
                        cursor: unlocked ? "pointer" : "default",
                        fontFamily: "inherit",
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          variant="small"
                          color={!unlocked ? ink.muted : isNext ? ink.strong : isDone ? ink.muted : ink.body}
                          style={{ fontWeight: isNext ? 700 : 600 }}
                        >
                          {lesson.title[lang]}
                        </Text>
                        <Text variant="caption" color={isNext ? ink.accent : ink.muted} style={{ marginTop: 2, fontWeight: isNext ? 700 : 400 }}>
                          {unlocked ? t.estMinTemplate.replace("{n}", lesson.minutes) : t.locked}
                        </Text>
                      </span>
                      {/* DONE and CURRENT are the two states this screen
                          exists to communicate, and until 2026-08-31 neither
                          had any non-visual channel. Both were carried only by
                          the step marker — which is `aria-hidden` on the whole
                          span — plus a fill color and a font weight. Measured
                          live against the built app with two lessons complete:
                          a completed row's accessible name was "Transactions:
                          The Building Block≈2 min" and the current row's was
                          "Productivity Growth: The Long-Run Driver≈2 min" —
                          identical in shape, so a screen-reader learner could
                          not tell finished from unfinished anywhere on the
                          path. LOCKED was already fine: `t.locked` replaces the
                          minutes as visible text, which is why it is not
                          repeated here.

                          Appended after the title, like Question.jsx's answer
                          markers, so the visible lesson title stays the start
                          of the accessible name (WCAG 2.5.3 — voice control
                          keeps working). `isNext` is deliberately not treated
                          as redundant with the resume card above: that card
                          names one lesson out of context, and this is the row
                          a learner lands on while reading down the path. */}
                      {isDone && <SrOnly>{t.lessonStateDone}</SrOnly>}
                      {isNext && <SrOnly>{t.lessonStateCurrent}</SrOnly>}
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
        );
      })}

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
