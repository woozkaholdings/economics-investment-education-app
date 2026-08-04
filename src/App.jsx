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

import { useCallback, useEffect, useRef, useState } from "react";
import { lessons } from "./content/lessons.js";
import { useAppState } from "./lib/useAppState.js";
import Icon from "./components/Icon.jsx";
import { Button, Card, Text } from "./components/ui.jsx";
import { APP_MAX_WIDTH, fill, ink, line, radius, shadow, space, surface } from "./theme.js";
import Learn from "./screens/Learn.jsx";
import LessonReader from "./screens/LessonReader.jsx";
import Practice from "./screens/Practice.jsx";
import Reference from "./screens/Reference.jsx";

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

  const [tab, setTab] = useState("learn");
  // null = showing the path; a number = reading that lesson. A first-time
  // visitor opens straight into lesson 1 (LAUNCH_PLAN §3.2).
  const [reading, setReading] = useState(() => (isFirstVisit ? 0 : null));

  const scrollTop = useCallback(() => {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* older browsers */ }
  }, []);

  // Lessons unlock in order: the first is always open, the rest need the one
  // before them completed.
  const isUnlocked = useCallback(
    (index) => index === 0 || completedLessons.includes(lessons[index - 1].id),
    [completedLessons]
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
          <LessonReader
            t={t} lang={lang} lessons={lessons} index={reading}
            completedLessons={completedLessons} completeLesson={completeLesson}
            recordReview={recordReview}
            onBack={closeLesson} onNavigate={setReading}
          />
        )}
        {tab === "practice" && (
          <Practice t={t} lang={lang} review={review} recordReview={recordReview} />
        )}
        {tab === "reference" && (
          <Reference
            t={t} lang={lang}
            fontScale={fontScale} setFontScale={setFontScale}
            themeMode={themeMode} setThemeMode={setThemeMode}
          />
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
        {tabs.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`tab-${item.key}`}
              aria-selected={active}
              aria-controls={`panel-${item.key}`}
              onClick={() => goToTab(item.key)}
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
