import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ECONOMIC CYCLES v5 — Step-by-Step Lessons + Bottom Tabs
// Inspired by principles popularized by economists and investors
// ═══════════════════════════════════════════════════════════════

import { TR } from "./src/locales/index.js";
import { lessons } from "./src/content/lessons.js";
import Home from "./src/components/Home.jsx";
import Learn from "./src/components/Learn.jsx";
import Markets from "./src/components/Markets.jsx";
import More from "./src/components/More.jsx";

const langFlags = { en: "🇺🇸", es: "🇪🇸", ko: "🇰🇷", zh: "🇨🇳", ja: "🇯🇵" };
const langNames = { en: "English", es: "Español", ko: "한국어", zh: "中文", ja: "日本語" };

// ═══════════════════════════════════════════════════════════════
// STREAK COUNTER — localStorage-backed, one increment per calendar day
// on which the user completes at least one lesson.
// ═══════════════════════════════════════════════════════════════
const STREAK_KEY = "ecycles_streak";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayDiff(a, b) {
  const toUTC = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((toUTC(b) - toUTC(a)) / 86400000);
}

// Reads the stored streak without recording new activity — used on mount so a
// streak that's already broken (gap > 1 day since last activity) shows as 0
// rather than a stale count.
function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 0;
    const { count, lastDate } = JSON.parse(raw);
    if (!lastDate) return 0;
    return dayDiff(lastDate, todayStr()) <= 1 ? (count || 0) : 0;
  } catch (e) {
    return 0;
  }
}

// Call once per genuine lesson-completion event. No-ops (same count) if
// today was already recorded; extends the streak if the last activity was
// yesterday; otherwise starts a new streak at 1.
function recordStreakActivity() {
  try {
    const today = todayStr();
    const raw = localStorage.getItem(STREAK_KEY);
    let count = 0, lastDate = null;
    if (raw) {
      const parsed = JSON.parse(raw);
      count = parsed.count || 0;
      lastDate = parsed.lastDate || null;
    }
    if (lastDate === today) {
      // already recorded today — count unchanged
    } else if (lastDate && dayDiff(lastDate, today) === 1) {
      count += 1;
    } else {
      count = 1;
    }
    localStorage.setItem(STREAK_KEY, JSON.stringify({ count, lastDate: today }));
    return count;
  } catch (e) {
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState("en");
  // completedLessons isn't persisted across sessions, so ecycles_seen_disclaimer
  // (the only durable per-device flag the app has) doubles as the "has this
  // device used the app before" signal: first open lands in lesson 1, not Home.
  const [tab, setTab] = useState(() => {
    try {
      return localStorage.getItem("ecycles_seen_disclaimer") ? "home" : "learn";
    } catch (e) {
      return "home";
    }
  });
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [streak, setStreak] = useState(0);
  useEffect(() => { setStreak(loadStreak()); }, []);
  // First-launch disclaimer notice
  const [showFirstLaunch, setShowFirstLaunch] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("ecycles_seen_disclaimer")) setShowFirstLaunch(true);
    } catch (e) { /* localStorage unavailable (e.g. private mode) — skip the notice */ }
  }, []);
  const dismissFirstLaunch = () => {
    try { localStorage.setItem("ecycles_seen_disclaimer", "1"); } catch (e) {}
    setShowFirstLaunch(false);
  };

  const topRef = useRef(null);
  const scrollTop = () => {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch(e) {}
  };

  const t = TR[lang];

  const markLessonComplete = (id) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons(prev => [...prev, id]);
      setStreak(recordStreakActivity());
    }
  };

  const isLessonUnlocked = (idx) => {
    if (idx === 0) return true;
    return completedLessons.includes(lessons[idx - 1].id);
  };

  // Bottom tab config
  const bottomTabs = [
    { key: "home", label: t.tabHome, icon: "🏠" },
    { key: "learn", label: t.tabLearn, icon: "📖" },
    { key: "markets", label: t.tabMarkets, icon: "📊" },
    { key: "more", label: t.tabMore, icon: "⋯" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", maxWidth: 480, margin: "0 auto", color: "#1f2937", fontSize: 13, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <div ref={topRef} />

      {/* ─── FIRST-LAUNCH DISCLAIMER NOTICE ─── */}
      {showFirstLaunch && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, maxWidth: 400, width: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px", color: "#1e3a5f" }}>👋 {t.firstLaunchTitle}</h2>
            <p style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6, margin: "0 0 14px" }}>ℹ️ {t.disclaimer}</p>
            <button onClick={dismissFirstLaunch} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {t.firstLaunchOk}
            </button>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #4f46e5 100%)", padding: "14px 16px", color: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{t.appTitle}</h1>
            <p style={{ fontSize: 10, opacity: 0.8, margin: "2px 0 0" }}>{t.appSub}</p>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 6px", fontSize: 11, cursor: "pointer" }}>
            {Object.keys(langFlags).map(l => <option key={l} value={l} style={{ color: "#000" }}>{langFlags[l]} {langNames[l]}{l !== "en" ? " (Beta)" : ""}</option>)}
          </select>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 8, background: "rgba(255,255,255,0.15)", borderRadius: 6, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(completedLessons.length / lessons.length) * 100}%`, background: "linear-gradient(90deg, #fbbf24, #34d399)", borderRadius: 6, transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 9, opacity: 0.7, marginTop: 3, textAlign: "right" }}>{completedLessons.length}/{lessons.length} {t.lessonLabel}s</div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ flex: 1, overflow: "auto", padding: "10px 12px", paddingBottom: 80 }}>

        {/* ═══ HOME TAB ═══ */}
        {tab === "home" && (
          <Home t={t} lang={lang} completedLessons={completedLessons} lessons={lessons}
            isLessonUnlocked={isLessonUnlocked} setCurrentLesson={setCurrentLesson} setTab={setTab} scrollTop={scrollTop} streak={streak} />
        )}

        {/* ═══ LEARN TAB ═══ */}
        {tab === "learn" && (
          <Learn t={t} lang={lang} lessons={lessons} completedLessons={completedLessons}
            currentLesson={currentLesson} isLessonUnlocked={isLessonUnlocked}
            setCurrentLesson={setCurrentLesson} markLessonComplete={markLessonComplete} scrollTop={scrollTop} />
        )}

        {/* ═══ MARKETS TAB ═══ */}
        {tab === "markets" && <Markets t={t} lang={lang} />}

        {/* ═══ MORE TAB ═══ */}
        {tab === "more" && <More t={t} lang={lang} />}
      </div>

      {/* ─── BOTTOM TAB BAR ─── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", zIndex: 100, boxShadow: "0 -2px 10px rgba(0,0,0,0.06)" }}>
        {bottomTabs.map(bt => (
          <button key={bt.key} onClick={() => { setTab(bt.key); scrollTop(); }}
            style={{ flex: 1, padding: "8px 0 6px", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: tab === bt.key ? "#2563eb" : "#9ca3af", transition: "color 0.2s" }}>
            <span style={{ fontSize: 18 }}>{bt.icon}</span>
            <span style={{ fontSize: 9, fontWeight: tab === bt.key ? 700 : 500 }}>{bt.label}</span>
            {tab === bt.key && <div style={{ width: 20, height: 2, background: "#2563eb", borderRadius: 1, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
