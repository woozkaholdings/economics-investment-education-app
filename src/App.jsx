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
import { useAppState } from "./lib/useAppState.js";
import Icon from "./components/Icon.jsx";
import { Button, Card, EmptyState, Text } from "./components/ui.jsx";
import { APP_MAX_WIDTH, fill, ink, line, radius, shadow, space, surface } from "./theme.js";
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
const Practice = lazy(() => import("./screens/Practice.jsx"));
const Reference = lazy(() => import("./screens/Reference.jsx"));
const LessonReader = lazy(() => import("./screens/LessonReader.jsx"));

// Same loading affordance `Sectors.jsx` already uses for its own async
// content, so a lazy-chunk fetch doesn't look different from data the app
// was already used to waiting on.
function ScreenFallback() {
  return <EmptyState icon="path">…</EmptyState>;
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
      style={{ position: "fixed", inset: 0, background: "rgba(9,11,15,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: space["5"] }}
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

export default function App() {
  const {
    lang, setLang, t,
    completedLessons, completeLesson,
    streak, fontScale, setFontScale, themeMode, setThemeMode,
    review, recordReview,
    isFirstVisit, showDisclaimer, dismissDisclaimer,
  } = useAppState();

  // Whole tracks in TRACKS order (money first), so a lesson's index here is
  // its position on the Learn path. Lesson `id` is unchanged by the reorder.
  const lessons = useMemo(() => lessonsByTrack(), []);

  const [tab, setTab] = useState("learn");
  // null = showing the path; a number = reading that lesson. A first-time
  // visitor opens straight into the first lesson of the money track, which
  // index 0 now is (LAUNCH_PLAN §3.2).
  const [reading, setReading] = useState(() => (isFirstVisit ? 0 : null));

  const scrollTop = useCallback(() => {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* older browsers */ }
  }, []);

  // Once per app load, not per tab switch — see LAUNCH_PLAN §9.2.
  useEffect(() => { track(EVENTS.APP_OPENED); }, []);

  // Lessons unlock in order WITHIN a track, not across tracks: the first
  // lesson of each track is always open, the rest need the previous lesson of
  // that same track completed. Before 2026-08-07 this was a single global
  // chain, which gated the whole money curriculum behind twelve macro-theory
  // lessons — see the TRACKS comment in content/lessons.js.
  const isUnlocked = useCallback(
    (index) => {
      const lesson = lessons[index];
      const prev = lessons[index - 1];
      if (!prev || prev.track !== lesson.track) return true;   // first of its track
      return completedLessons.includes(prev.id);
    },
    [completedLessons, lessons]
  );

  const openLesson = useCallback((index) => { setReading(index); setTab("learn"); }, []);
  const closeLesson = useCallback(() => { setReading(null); scrollTop(); }, [scrollTop]);

  const goToTab = useCallback((key) => {
    setTab(key);
    setReading(null);   // leaving Learn always exits the reader
    scrollTop();
  }, [scrollTop]);

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

      {/* Header — a quiet bar, not a coloured banner. */}
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
            style={{ background: surface.card, color: ink.body, border: `1px solid ${line.strong}`, borderRadius: radius.sm, padding: `4px ${space["2"]}px`, fontSize: "0.75rem", cursor: "pointer" }}
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
        style={{ flex: 1, padding: `${space["4"]}px ${space["4"]}px 96px` }}
      >
        {tab === "learn" && reading === null && (
          <Learn
            t={t} lang={lang} lessons={lessons} completedLessons={completedLessons}
            isUnlocked={isUnlocked} streak={streak} openLesson={openLesson}
          />
        )}
        {tab === "learn" && reading !== null && (
          <Suspense fallback={<ScreenFallback />}>
            <LessonReader
              t={t} lang={lang} lessons={lessons} index={reading}
              completedLessons={completedLessons} completeLesson={completeLesson}
              recordReview={recordReview}
              onBack={closeLesson} onNavigate={setReading}
            />
          </Suspense>
        )}
        {tab === "practice" && (
          <Suspense fallback={<ScreenFallback />}>
            <Practice t={t} lang={lang} review={review} recordReview={recordReview} />
          </Suspense>
        )}
        {tab === "reference" && (
          <Suspense fallback={<ScreenFallback />}>
            <Reference
              t={t} lang={lang}
              fontScale={fontScale} setFontScale={setFontScale}
              themeMode={themeMode} setThemeMode={setThemeMode}
            />
          </Suspense>
        )}
      </main>

      {/* Bottom navigation */}
      <nav
        role="tablist"
        aria-label={t.appTitle}
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: APP_MAX_WIDTH,
          display: "flex", zIndex: 100,
          background: surface.card,
          borderTop: `1px solid ${line.hairline}`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
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
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: space["1"],
                padding: `${space["2"]}px 0 ${space["3"]}px`,
                border: "none", background: "transparent", cursor: "pointer",
                color: active ? ink.accent : ink.muted,
              }}
            >
              <Icon name={item.icon} size="1.4rem" strokeWidth={active ? 2.1 : 1.7} />
              <span style={{ fontSize: "0.6875rem", fontWeight: active ? 700 : 500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
