import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ECONOMIC CYCLES v5 — Step-by-Step Lessons + Bottom Tabs
// Inspired by principles popularized by economists and investors
// ═══════════════════════════════════════════════════════════════

import { TR } from "./src/locales/index.js";
import { lessons } from "./src/content/lessons.js";
import { quizData } from "./src/content/quizData.js";
import { glossary } from "./src/content/glossary.js";
import { kidsContent } from "./src/content/kidsContent.js";
import Home from "./src/components/Home.jsx";
import Learn from "./src/components/Learn.jsx";
import Markets from "./src/components/Markets.jsx";

const langFlags = { en: "🇺🇸", es: "🇪🇸", ko: "🇰🇷", zh: "🇨🇳", ja: "🇯🇵" };
const langNames = { en: "English", es: "Español", ko: "한국어", zh: "中文", ja: "日本語" };

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  // Quiz
  const [qIdx, setQIdx] = useState(0);
  const [qStarted, setQStarted] = useState(false);
  const [qAnswer, setQAnswer] = useState(null);
  const [qScore, setQScore] = useState(0);
  const [qDone, setQDone] = useState(false);
  // Kids
  const [kidsAge, setKidsAge] = useState("5-8");
  // Glossary
  const [glossSearch, setGlossSearch] = useState("");
  // More sub-tab
  const [moreSection, setMoreSection] = useState("quiz");
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
  const resetQuiz = () => { setQIdx(0); setQStarted(false); setQAnswer(null); setQScore(0); setQDone(false); };

  const markLessonComplete = (id) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons(prev => [...prev, id]);
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
            isLessonUnlocked={isLessonUnlocked} setCurrentLesson={setCurrentLesson} setTab={setTab} scrollTop={scrollTop} />
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
        {tab === "more" && (
          <div>
            {/* Sub-nav for More */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {[
                { k: "quiz", l: "🧠 " + t.quizTabLabel },
                { k: "kids", l: "👨‍👩‍👧 " + t.kidsTabLabel },
                { k: "glossary", l: "📚 " + t.glossTitle },
                { k: "about", l: "ℹ️ " + t.aboutTabLabel },
              ].map(s => (
                <button key={s.k} onClick={() => setMoreSection(s.k)}
                  style={{ flex: 1, padding: "8px 6px", border: moreSection === s.k ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 8, background: moreSection === s.k ? "#eff6ff" : "#fff", color: moreSection === s.k ? "#2563eb" : "#6b7280", fontWeight: moreSection === s.k ? 700 : 500, fontSize: 10, cursor: "pointer" }}>
                  {s.l}
                </button>
              ))}
            </div>

            {/* Quiz Section */}
            {moreSection === "quiz" && (
              <div>
                <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 10 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>🧠 {t.quizTitle}</h2>
                </div>
                {!qStarted && !qDone && (
                  <div style={{ textAlign: "center", padding: 20 }}>
                    <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{quizData.length} {t.questionsLabel}</p>
                    <button onClick={() => setQStarted(true)} style={{ padding: "12px 30px", borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{t.quizStart}</button>
                  </div>
                )}
                {qStarted && !qDone && (
                  <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 9, color: "#9ca3af", marginBottom: 8 }}>{qIdx + 1} / {quizData.length}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "#1f2937" }}>{quizData[qIdx].q[lang]}</h3>
                    {quizData[qIdx].opts[lang].map((opt, i) => (
                      <button key={i} onClick={() => { if (qAnswer === null) { setQAnswer(i); if (i === quizData[qIdx].answer) setQScore(s => s + 1); } }}
                        style={{ display: "block", width: "100%", padding: "10px 12px", marginBottom: 6, borderRadius: 8, textAlign: "left", fontSize: 12, cursor: qAnswer === null ? "pointer" : "default",
                          border: qAnswer === null ? "1px solid #d1d5db" : i === quizData[qIdx].answer ? "2px solid #059669" : i === qAnswer ? "2px solid #dc2626" : "1px solid #d1d5db",
                          background: qAnswer === null ? "#fff" : i === quizData[qIdx].answer ? "#ecfdf5" : i === qAnswer ? "#fef2f2" : "#fff",
                          color: "#1f2937", fontWeight: qAnswer !== null && i === quizData[qIdx].answer ? 700 : 400 }}>
                        {opt}
                      </button>
                    ))}
                    {qAnswer !== null && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: qAnswer === quizData[qIdx].answer ? "#059669" : "#dc2626", marginBottom: 4 }}>
                          {qAnswer === quizData[qIdx].answer ? `✅ ${t.quizCorrect}` : `❌ ${t.quizWrong}`}
                        </div>
                        <div style={{ fontSize: 11, color: "#4b5563", background: "#f3f4f6", padding: 8, borderRadius: 6, lineHeight: 1.5 }}>
                          <strong>{t.quizExplain}:</strong> {quizData[qIdx].explain[lang]}
                        </div>
                        <button onClick={() => {
                          if (qIdx < quizData.length - 1) { setQIdx(qIdx + 1); setQAnswer(null); }
                          else setQDone(true);
                        }} style={{ marginTop: 8, padding: "10px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          {qIdx < quizData.length - 1 ? t.quizNext : t.quizFinish}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {qDone && (
                  <div style={{ textAlign: "center", padding: 20, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>{qScore >= quizData.length * 0.7 ? "🎉" : qScore >= quizData.length * 0.4 ? "👍" : "📚"}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1f2937" }}>{t.quizScore}: {qScore}/{quizData.length}</h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{Math.round(qScore / quizData.length * 100)}%</p>
                    <button onClick={resetQuiz} style={{ marginTop: 10, padding: "10px 24px", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t.quizTryAgain}</button>
                  </div>
                )}
              </div>
            )}

            {/* Kids Section */}
            {moreSection === "kids" && (
              <div>
                <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 6 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>👨‍👩‍👧‍👦 {t.kidsTitle}</h2>
                </div>
                <div style={{ fontSize: 11, color: "#78350f", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: 8, marginBottom: 10, lineHeight: 1.5 }}>
                  {t.kidsParentIntro}
                </div>
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {["5-8", "9-12", "13-17"].map(age => (
                    <button key={age} onClick={() => setKidsAge(age)}
                      style={{ flex: 1, padding: "8px 6px", borderRadius: 8, border: kidsAge === age ? "2px solid #f97316" : "1px solid #d1d5db", background: kidsAge === age ? "#fff7ed" : "#fff", color: kidsAge === age ? "#ea580c" : "#6b7280", fontWeight: kidsAge === age ? 700 : 500, fontSize: 11, cursor: "pointer" }}>
                      {age === "5-8" ? t.kidsAges58 : age === "9-12" ? t.kidsAges912 : t.kidsAges1317}
                    </button>
                  ))}
                </div>
                <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e5e7eb" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ea580c", margin: "0 0 10px" }}>{kidsContent[kidsAge].title[lang]}</h3>
                  {kidsContent[kidsAge].lessons.map((l, i) => (
                    <div key={i} style={{ background: "#fff7ed", borderRadius: 8, padding: 10, marginBottom: 6, fontSize: 12, lineHeight: 1.6, color: "#78350f" }}>
                      <strong>{i + 1}.</strong> {l[lang]}
                    </div>
                  ))}
                  <div style={{ background: "#ecfdf5", borderRadius: 8, padding: 10, marginTop: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 3 }}>🎮 {t.kidsActivity}</div>
                    <div style={{ fontSize: 11, color: "#065f46" }}>{kidsContent[kidsAge].activity[lang]}</div>
                  </div>
                  <div style={{ background: "#eff6ff", borderRadius: 8, padding: 10, marginTop: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", marginBottom: 3 }}>💡 {t.kidsParentTip}</div>
                    <div style={{ fontSize: 11, color: "#1e3a5f" }}>{kidsContent[kidsAge].parentTip[lang]}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Glossary Section */}
            {moreSection === "glossary" && (
              <div>
                <div style={{ background: "linear-gradient(135deg, #059669, #047857)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 10 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>📚 {t.glossTitle}</h2>
                </div>
                <input type="text" placeholder={t.glossSearch} value={glossSearch} onChange={e => setGlossSearch(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12, marginBottom: 10, boxSizing: "border-box" }} />
                {Object.entries(glossary)
                  .filter(([k]) => k.toLowerCase().includes(glossSearch.toLowerCase()))
                  .map(([k, v]) => {
                    const entry = v[lang] || v.en;
                    return (
                      <div key={k} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "#059669" }}>{entry.s || k}</div>
                        <div style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.5, marginTop: 2 }}>{entry.f}</div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* About Section */}
            {moreSection === "about" && (
              <div>
                <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 10 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>ℹ️ {t.aboutTitle}</h2>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.7 }}>{t.aboutBody}</div>
                </div>
                <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", padding: "10px 4px", lineHeight: 1.5 }}>
                  ℹ️ {t.disclaimer}
                </div>
              </div>
            )}
          </div>
        )}
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
