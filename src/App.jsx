// ═══════════════════════════════════════════════════════════════════════════
// APP SHELL
//
// Three destinations — Learn, Practice, Reference — plus a pushed lesson
// reader. See LAUNCH_PLAN §3.1 for why this replaced the prototype's four
// tabs: the lesson list appeared on two of them, and the quiz and glossary
// were filed under a generic "More".
//
// This app is authored here. `economic-cycles-v5.jsx` and `-v6.jsx` at the
// repository root are reference material and are deliberately not imported.
// ═══════════════════════════════════════════════════════════════════════════

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { lessonsByTrack } from "./content/lessons.js";
import { EVENTS, track } from "./lib/analytics.js";
import { chunk, isChunkLoadError } from "./lib/chunkError.js";
import { initialRoute, useDeepLink } from "./lib/deepLink.js";
import { useAppState } from "./lib/useAppState.js";
import Icon from "./components/Icon.jsx";
import { AppError, Button, Card, EmptyState, LoadFailure, Text } from "./components/ui.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { APP_MAX_WIDTH, fill, ink, line, MIN_TAP, radius, shadow, space, surface } from "./theme.js";
import Learn from "./screens/Learn.jsx";

// Practice and Reference (plus its five sub-screens and their content
// modules — glossary, kids guide, sectors, economic signals, market copy)
// are only needed once a reader taps past Learn, so they're split into their
// own chunks instead of riding in the bundle everyone downloads for lesson 1.
//
// LessonReader pulls in content/lessonContent.js — the ~250KB of actual
// lesson body text (sections/takeaway/thinkAbout) — plus quizData.js, so it
// gets the same treatment (backlog item 23, chunk-size regression): everyone
// downloads Learn's lightweight lesson list first, and only pays for a
// lesson's own text when they open it. Even a first-time visitor, who is
// routed straight into Lesson 1 (see `reading` below), sees the same brief
// ScreenFallback a Practice/Reference tap already produces.
const Practice = lazy(chunk(() => import("./screens/Practice.jsx")));
const Reference = lazy(chunk(() => import("./screens/Reference.jsx")));
const LessonReader = lazy(chunk(() => import("./screens/LessonReader.jsx")));

// Same loading affordance `Sectors.jsx` already uses for its own async
// content, so a lazy-chunk fetch doesn't look different from data the app
// was already used to waiting on.
function ScreenFallback({ t }) {
  return <EmptyState icon="path">{t.loadingLabel}</EmptyState>;
}

// Suspense catches a PENDING lazy() chunk; a REJECTED one re-throws during
// render and, with nothing above it, takes the whole tree down to a blank
// page (backlog item 96). Every lazy screen therefore gets both. The pairing
// is a component rather than four hand-written wrappers so a fifth screen
// cannot be added with only half of it.
//
// One boundary, two messages, because this boundary catches two different
// events. A chunk that never arrived is a download problem; a chunk that
// arrived and threw while rendering is a bug, and telling that reader to
// check their connection is a lie about a connection that is fine (item 100,
// reproduced live 2026-08-24). The two are told apart by a tag applied at the
// `lazy()` call site above, never by matching the error text — see
// `lib/chunkError.js` for why that method and not the other one, and for why
// an unrecognised error takes the render-crash copy rather than this one.
function AsyncScreen({ t, children }) {
  return (
    <ErrorBoundary fallback={(error) => (isChunkLoadError(error) ? <LoadFailure t={t} /> : <AppError t={t} />)}>
      <Suspense fallback={<ScreenFallback t={t} />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// The boundary for a STATIC screen that threw while rendering (backlog item
// 99). A lazy screen keeps its own AsyncScreen, which since item 100 shows
// this same render-crash copy for a throw and the download copy only for a
// chunk that never arrived. AsyncScreen only ever covered the three lazy screens;
// `Learn` is a static import, so it cannot 404 — but a render bug inside it
// still took the whole tree to a blank page, measured 2026-08-24 at `#root`
// 0 children / 0 bytes, the same signature item 96 found for a rejected chunk.
//
// It wraps the screen area rather than the whole app on purpose: the header
// and the bottom nav survive, so a reader whose Learn path crashed can still
// reach Practice. `key={tab}` is what makes that offer real — a boundary that
// has caught stays caught, so without remounting it per tab the nav would be
// visible and useless. Switching tabs is therefore also the recovery.
function ScreenBoundary({ t, children }) {
  return <ErrorBoundary fallback={<AppError t={t} />}>{children}</ErrorBoundary>;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
];

// ── First-run notice ──────────────────────────────────────────────────────
// Required before first use by LAUNCH_PLAN §10.1. One focusable control, so
// trapping focus means re-focusing it on Tab rather than tracking boundaries.
function FirstRunNotice({ t, onDismiss }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onDismiss();
      else if (e.key === "Tab") { e.preventDefault(); buttonRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-run-title"
      style={{ position: "fixed", inset: 0, background: "rgba(28,26,23,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: space["5"] }}
    >
      <Card style={{ maxWidth: 380, width: "100%", boxShadow: shadow.overlay }}>
        <Text as="h2" id="first-run-title" variant="heading" color={ink.strong}>
          {t.firstLaunchTitle}
        </Text>
        <Text variant="small" color={ink.muted} style={{ margin: `${space["3"]}px 0 ${space["4"]}px` }}>
          {t.disclaimer}
        </Text>
        <Button ref={buttonRef} full onClick={onDismiss}>{t.firstLaunchOk}</Button>
      </Card>
    </div>
  );
}

// ── Practice coach mark ─────────────────────────────────────────────────
// A one-time, non-modal pointer at the Practice tab (see useAppState.js).
// `role="status"` so it's announced to screen readers without stealing
// focus or trapping it the way FirstRunNotice's dialog does — the point is
// to introduce the next step, not to block on it.
function PracticeCoachMark({ t, onOpenPractice, onDismiss }) {
  return (
    <div
      role="status"
      style={{
        position: "fixed", zIndex: 150,
        // Clears the floating nav pill: its own 12px offset + the pill, plus a
        // 10px gap. The pill is 56px at the default text size and **73px at
        // the 1.3x scale** (measured in a live browser, not estimated), so the
        // figure below is the large one — at 56 the coach mark sat on top of
        // the nav for anyone using the largest text setting, which is the
        // reader least able to absorb an overlap.
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px + 76px + 10px)",
        left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: 320,
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "flex-start", gap: space["2"],
          background: surface.card, border: `1px solid ${line.strong}`,
          borderRadius: radius.md, boxShadow: shadow.overlay,
          padding: `${space["3"]}px ${space["3"]}px`,
        }}
      >
        <button
          type="button"
          onClick={onOpenPractice}
          style={{
            flex: 1, textAlign: "left", background: "none", border: "none",
            padding: 0, cursor: "pointer",
            // This whole line is the coach mark's primary action, so it is a
            // target, not a caption. One line of `caption` text rendered ~20px.
            display: "flex", alignItems: "center", minHeight: MIN_TAP,
          }}
        >
          <Text variant="small" color={ink.body}>{t.coachMarkPractice}</Text>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t.coachMarkDismissLabel}
          style={{
            flexShrink: 0, background: "none", border: "none", padding: 2,
            cursor: "pointer", color: ink.muted,
            // Was the smallest target in the app at 20x20 — a 1rem icon with
            // 2px of padding. Icon-only and textless, so both dimensions pin.
            display: "flex", alignItems: "center", justifyContent: "center",
            width: MIN_TAP, height: MIN_TAP,
          }}
        >
          <Icon name="x" size="1rem" />
        </button>
      </div>
      {/* Small pointer triangle, aimed at the Practice tab beneath it. */}
      <div
        aria-hidden="true"
        style={{
          width: 0, height: 0, margin: "0 auto",
          borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
          borderTop: `7px solid ${surface.card}`,
        }}
      />
    </div>
  );
}

export default function App() {
  const {
    lang, setLang, t,
    completedLessons, completeLesson,
    streak, fontScale, setFontScale, themeMode, setThemeMode,
    review, recordReview,
    isFirstVisit, showDisclaimer, dismissDisclaimer,
    showPracticeCoachMark, dismissPracticeCoachMark,
  } = useAppState();

  // Whole tracks in TRACKS order (money first), so a lesson's index here is
  // its position on the Learn path. Lesson `id` is unchanged by the reorder.
  const lessons = useMemo(() => lessonsByTrack(), []);

  // Lessons unlock in order WITHIN a track, not across tracks: the first
  // lesson of each track is always open, the rest need the previous lesson of
  // that same track completed. Before 2026-08-07 this was a single global
  // chain, which gated the whole money curriculum behind twelve macro-theory
  // lessons — see the TRACKS comment in content/lessons.js.
  //
  // Declared above the navigation state because the opening route consults
  // it: a deep link to a locked lesson lands on the path (see deepLink.js).
  const isUnlocked = useCallback(
    (index) => {
      const lesson = lessons[index];
      const prev = lessons[index - 1];
      if (!prev || prev.track !== lesson.track) return true;   // first of its track
      return completedLessons.includes(prev.id);
    },
    [completedLessons, lessons]
  );

  // Where this load starts. A `#/lesson/12` or `#/practice` link wins; with no
  // link, a first-time visitor opens straight into `lessons[0]` — which since
  // the 2026-08-18 reordering is the ECONOMY track's first lesson (id 29,
  // "Transactions: The Building Block"), not the money track's. This comment
  // said "the money track, which index 0 now is" until 2026-08-20; that was
  // true only before economy was moved to the front. Read once, from
  // a ref-stable initializer — after mount, `useDeepLink` owns the URL.
  const opening = useRef(null);
  if (opening.current === null) {
    opening.current = initialRoute(
      typeof window === "undefined" ? "" : window.location.hash,
      lessons, isUnlocked, isFirstVisit
    );
  }

  const [tab, setTab] = useState(opening.current.tab);
  // null = showing the path; a number = reading that lesson.
  const [reading, setReading] = useState(opening.current.reading);

  const scrollTop = useCallback(() => {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* older browsers */ }
  }, []);

  // Once per app load, not per tab switch — see LAUNCH_PLAN §9.2.
  useEffect(() => { track(EVENTS.APP_OPENED); }, []);

  // Keeps the address bar in step with `tab`/`reading` and handles Back,
  // Forward, and a pasted `#/lesson/12`. The whole web-routing surface is
  // this call plus `initialRoute` above — see deepLink.js for why it is hash
  // routing with no router (backlog items 31 and 12).
  const onRoute = useCallback((route) => {
    setTab(route.tab);
    setReading(route.reading);
  }, []);
  useDeepLink({ tab, reading, lessons, isUnlocked, onRoute });

  const openLesson = useCallback((index) => { setReading(index); setTab("learn"); }, []);
  const closeLesson = useCallback(() => { setReading(null); scrollTop(); }, [scrollTop]);

  const goToTab = useCallback((key) => {
    setTab(key);
    setReading(null);   // leaving Learn always exits the reader
    scrollTop();
    // Tapping Practice is the coach mark's own suggestion acted on, not a
    // dismissal of something unwanted — but it's the same "seen it" state.
    if (key === "practice" && showPracticeCoachMark) dismissPracticeCoachMark();
  }, [scrollTop, showPracticeCoachMark, dismissPracticeCoachMark]);

  const tabs = [
    { key: "learn", label: t.tabLearn, icon: "book" },
    { key: "practice", label: t.reviewTitle, icon: "target" },
    { key: "reference", label: t.tabReference, icon: "library" },
  ];

  // Roving tabindex (WAI-ARIA APG "tabs" pattern): arrow keys move focus
  // between tabs and activate them, Home/End jump to the first/last. Only the
  // active tab is Tab-stoppable; the rest are reached via arrow keys once the
  // tablist has focus, matching how a native OS tab strip behaves.
  const tabRefs = useRef([]);
  const onTabKeyDown = useCallback((e, currentIndex) => {
    let nextIndex = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    goToTab(tabs[nextIndex].key);
    tabRefs.current[nextIndex]?.focus();
  }, [goToTab, tabs]);

  return (
    <div style={{ maxWidth: APP_MAX_WIDTH, margin: "0 auto", minHeight: "100vh", background: surface.canvas, display: "flex", flexDirection: "column" }}>
      {showDisclaimer && <FirstRunNotice t={t} onDismiss={dismissDisclaimer} />}
      {!showDisclaimer && showPracticeCoachMark && tab === "learn" && reading === null && (
        <PracticeCoachMark t={t} onOpenPractice={() => goToTab("practice")} onDismiss={dismissPracticeCoachMark} />
      )}

      {/* Header — a quiet bar, not a colored banner. */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: space["3"],
          padding: `${space["3"]}px ${space["4"]}px`,
          background: surface.canvas,
          borderBottom: `1px solid ${line.hairline}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: space["2"], minWidth: 0 }}>
          <span style={{ color: ink.accent, display: "flex" }}><Icon name="path" size="1.15rem" /></span>
          <Text as="span" variant="small" color={ink.strong} style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t.appTitle}
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: space["3"], flexShrink: 0 }}>
          {/* Progress deliberately lives on the Learn screen only. Repeating it
              here squeezed the title into an ellipsis at 375px, and duplicating
              a number is exactly what §3.1 removed from the old Home/Learn
              split. Non-English stays marked beta until a native speaker
              reviews it (LAUNCH_PLAN §3.5 / §10.4). */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label={t.langLabel}
            style={{
              background: surface.card, color: ink.body,
              border: `1px solid ${line.strong}`, borderRadius: radius.sm,
              padding: `4px ${space["2"]}px`, fontSize: "0.75rem", cursor: "pointer",
              // 27px before this. The one control on every screen in the app,
              // and the only way to reach four of the five languages.
              minHeight: MIN_TAP,
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}{l.code !== "en" ? " (Beta)" : ""}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Screen */}
      <main
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        // Bottom padding clears the floating nav (12px offset + up to 73px of
        // pill at the 1.3x text scale) with room to spare, so the last row of
        // a screen is never parked under it.
        style={{ flex: 1, padding: `${space["4"]}px ${space["4"]}px 112px` }}
      >
        <ScreenBoundary t={t} key={tab}>
          {tab === "learn" && reading === null && (
            <Learn
              t={t} lang={lang} lessons={lessons} completedLessons={completedLessons}
              isUnlocked={isUnlocked} streak={streak} openLesson={openLesson}
            />
          )}
          {tab === "learn" && reading !== null && (
            <AsyncScreen t={t}>
              <LessonReader
                t={t} lang={lang} lessons={lessons} index={reading}
                completedLessons={completedLessons} completeLesson={completeLesson}
                recordReview={recordReview}
                onBack={closeLesson} onNavigate={setReading}
              />
            </AsyncScreen>
          )}
          {tab === "practice" && (
            <AsyncScreen t={t}>
              <Practice t={t} lang={lang} review={review} recordReview={recordReview} />
            </AsyncScreen>
          )}
          {tab === "reference" && (
            <AsyncScreen t={t}>
              <Reference
                t={t} lang={lang}
                fontScale={fontScale} setFontScale={setFontScale}
                themeMode={themeMode} setThemeMode={setThemeMode}
              />
            </AsyncScreen>
          )}
        </ScreenBoundary>
      </main>

      {/* Bottom navigation — a floating pill, from UIUX/ (Quizlet iOS home).
          Quizlet detaches the bar from the screen edge and rounds it, and puts
          a filled pill behind the active item rather than relying on color
          alone. Two reasons that is worth taking here: the edge-to-edge bar
          read as part of the page on a dark canvas (its only separator was one
          hairline against a near-identical fill), and the active state was
          accent color on a muted row — a distinction a color-blind user gets
          only from the icon's stroke weight.

          Adapted: Quizlet floats a 3-item pill *with* a partially visible page
          behind it. This keeps the full width the app already reserves so the
          three labels stay legible at the 1.3x font scale, and the safe-area
          inset is now added to the offset rather than used as padding, so the
          pill clears the home indicator instead of sitting on it. */}
      <nav
        role="tablist"
        aria-label={t.appTitle}
        style={{
          position: "fixed",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
          left: "50%", transform: "translateX(-50%)",
          width: `calc(100% - ${space["4"] * 2}px)`, maxWidth: APP_MAX_WIDTH - space["4"] * 2,
          display: "flex", zIndex: 100,
          background: surface.card,
          border: `1px solid ${line.hairline}`,
          borderRadius: radius.full,
          boxShadow: shadow.overlay,
          padding: space["1"],
        }}
      >
        {tabs.map((item, index) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              ref={(el) => { tabRefs.current[index] = el; }}
              type="button"
              role="tab"
              id={`tab-${item.key}`}
              aria-selected={active}
              aria-controls={`panel-${item.key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => goToTab(item.key)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: `${space["2"]}px 0`,
                border: "none", cursor: "pointer",
                borderRadius: radius.full,
                background: active ? surface.accentWash : "transparent",
                color: active ? ink.accent : ink.muted,
                fontFamily: "inherit",
              }}
            >
              <Icon name={item.icon} size="1.35rem" strokeWidth={active ? 2.2 : 1.7} />
              <span style={{ fontSize: "0.6875rem", fontWeight: active ? 700 : 500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
