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

const langFlags = { en: "🇺🇸", es: "🇪🇸", ko: "🇰🇷", zh: "🇨🇳", ja: "🇯🇵" };
const langNames = { en: "English", es: "Español", ko: "한국어", zh: "中文", ja: "日本語" };

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Bar({ data, title, colors, h = 140 }) {
  const mx = Math.max(...data.map(d => Math.abs(d.v)));
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, marginBottom: 8 }}>
      {title && <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{title}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: h }}>
        {data.map((d, i) => {
          const pct = Math.abs(d.v) / mx * 100;
          return (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ fontSize: 8, fontWeight: 700, marginBottom: 2, color: colors[i] }}>{typeof d.v === 'number' && d.v > 1 ? d.v.toFixed(1) : d.v}</div>
            <div style={{ width: "80%", height: `${pct}%`, background: colors[i], borderRadius: 3, minHeight: 2, transition: "height 0.5s" }} />
            <div style={{ fontSize: 7, color: "#6b7280", marginTop: 2, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.2 }}>{d.l}</div>
          </div>);
        })}
      </div>
    </div>
  );
}

function YieldCurve({ type, label }) {
  const pts = { normal: "M10,60 Q40,50 70,35 T130,15", flat: "M10,38 Q40,37 70,36 T130,34", inverted: "M10,15 Q40,25 70,35 T130,55", steep: "M10,70 Q40,55 70,30 T130,5" };
  const cols = { normal: "#059669", flat: "#d97706", inverted: "#dc2626", steep: "#2563eb" };
  return (
    <div style={{ background: "#fff", border: `2px solid ${cols[type]}30`, borderRadius: 8, padding: 8, textAlign: "center" }}>
      <svg viewBox="0 0 140 75" style={{ width: "100%", maxHeight: 60 }}>
        <line x1="10" y1="70" x2="130" y2="70" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="10" y1="5" x2="10" y2="70" stroke="#e5e7eb" strokeWidth="1" />
        <text x="15" y="69" fill="#9ca3af" fontSize="6">2Y</text>
        <text x="60" y="69" fill="#9ca3af" fontSize="6">10Y</text>
        <text x="115" y="69" fill="#9ca3af" fontSize="6">30Y</text>
        <path d={pts[type]} fill="none" stroke={cols[type]} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div style={{ fontSize: 9, fontWeight: 700, color: cols[type], marginTop: 2 }}>{label}</div>
    </div>
  );
}

function CycleChart({ lang }) {
  const phaseNames = { en: ["Expansion", "Peak", "Contraction", "Trough"], ko: ["확장기", "정점", "수축기", "저점"], es: ["Expansión", "Pico", "Contracción", "Valle"], zh: ["扩张", "顶峰", "收缩", "低谷"], ja: ["拡大", "ピーク", "収縮", "底"] };
  const names = phaseNames[lang] || phaseNames.en;
  const colors = ["#059669", "#d97706", "#dc2626", "#2563eb"];
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <svg viewBox="0 0 300 100" style={{ width: "100%", height: 80 }}>
        <line x1="0" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeDasharray="4" />
        <text x="150" y="97" textAnchor="middle" fill="#9ca3af" fontSize="7">{lang === "en" ? "Productivity Growth Line" : lang === "ko" ? "생산성 성장선" : lang === "es" ? "Línea de Productividad" : lang === "zh" ? "生产力增长线" : "生産性成長線"}</text>
        <path d="M0,50 Q37,50 75,15 Q112,50 150,50 Q187,50 225,85 Q262,50 300,50" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.3" />
        <path d="M0,50 Q37,45 75,20 T150,50 Q187,55 225,80 T300,50" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" />
        {[{x:37,y:32,i:0},{x:75,y:15,i:1},{x:187,y:68,i:2},{x:225,y:82,i:3}].map(p => (
          <g key={p.i}>
            <circle cx={p.x} cy={p.y} r="3" fill={colors[p.i]} />
            <text x={p.x} y={p.y - 8} textAnchor="middle" fill={colors[p.i]} fontSize="7" fontWeight="bold">{names[p.i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

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

  const lesson = lessons[currentLesson];

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
          <div>
            <div style={{ textAlign: "center", padding: "20px 10px" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🏛️</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: "#1e3a5f" }}>{t.welcomeTitle}</h2>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{t.welcomeSub}</p>
            </div>

            {/* Progress Card */}
            <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe", borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#1e40af" }}>{completedLessons.length}</div>
                  <div style={{ fontSize: 9, color: "#6b7280" }}>{t.lessonsCompleted}</div>
                </div>
                <div style={{ width: 1, background: "#bfdbfe" }} />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#1e40af" }}>{lessons.length}</div>
                  <div style={{ fontSize: 9, color: "#6b7280" }}>{t.totalLessons}</div>
                </div>
              </div>
            </div>

            {/* Continue / Start Button */}
            <button onClick={() => { setTab("learn"); scrollTop(); }} style={{ width: "100%", padding: "14px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16, boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
              {completedLessons.length > 0 ? `${t.continueLesson} →` : `${t.startLesson} →`}
            </button>

            {/* Featured Insight */}
            <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: 12, padding: 14, color: "#fff" }}>
              <div style={{ fontSize: 9, color: "#a5b4fc", fontWeight: 600, marginBottom: 6 }}>💡 {t.featuredInsight}</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0, color: "#e0e7ff", fontStyle: "italic" }}>
                "{t.heroInsight}"
              </p>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", padding: "10px 4px", lineHeight: 1.5 }}>
              ℹ️ {t.disclaimer}
            </div>

            {/* Lesson Cards Preview */}
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#374151" }}>📚 {t.tabLearn}</h3>
              {lessons.slice(0, 4).map((l, i) => {
                const done = completedLessons.includes(l.id);
                const unlocked = isLessonUnlocked(i);
                return (
                  <div key={l.id} onClick={() => { if (unlocked) { setCurrentLesson(i); setTab("learn"); scrollTop(); } }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: done ? "#ecfdf5" : unlocked ? "#fff" : "#f3f4f6", border: `1px solid ${done ? "#059669" : unlocked ? "#e5e7eb" : "#d1d5db"}`, borderRadius: 10, marginBottom: 6, cursor: unlocked ? "pointer" : "default", opacity: unlocked ? 1 : 0.5 }}>
                    <div style={{ fontSize: 22, width: 36, textAlign: "center" }}>{done ? "✅" : l.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: done ? "#059669" : "#1f2937" }}>{t.lessonLabel} {l.id}: {l.title[lang]}</div>
                      <div style={{ fontSize: 9, color: "#9ca3af" }}>{l.subtitle[lang]}</div>
                    </div>
                    <div style={{ fontSize: 14, color: unlocked ? "#2563eb" : "#d1d5db" }}>{unlocked ? "›" : "🔒"}</div>
                  </div>
                );
              })}
              {lessons.length > 4 && (
                <button onClick={() => { setTab("learn"); scrollTop(); }} style={{ width: "100%", padding: 8, border: "1px dashed #d1d5db", borderRadius: 8, background: "transparent", color: "#6b7280", fontSize: 11, cursor: "pointer" }}>
                  {t.viewAllLessonsTemplate.replace("{n}", lessons.length)}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ LEARN TAB ═══ */}
        {tab === "learn" && (
          <div>
            {/* Lesson List */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 12 }}>
                {lessons.map((l, i) => {
                  const done = completedLessons.includes(l.id);
                  const unlocked = isLessonUnlocked(i);
                  const active = currentLesson === i;
                  return (
                    <button key={l.id} onClick={() => { if (unlocked) setCurrentLesson(i); }}
                      style={{ width: 28, height: 28, borderRadius: "50%", border: active ? `2px solid ${l.color}` : "1px solid #d1d5db", background: done ? "#059669" : active ? l.color + "20" : unlocked ? "#fff" : "#f3f4f6", color: done ? "#fff" : active ? l.color : unlocked ? "#374151" : "#9ca3af", fontSize: 9, fontWeight: 700, cursor: unlocked ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", opacity: unlocked ? 1 : 0.4 }}>
                      {done ? "✓" : l.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Lesson */}
            {isLessonUnlocked(currentLesson) ? (
              <div>
                {/* Lesson Header */}
                <div style={{ background: `linear-gradient(135deg, ${lesson.color}15, ${lesson.color}08)`, border: `2px solid ${lesson.color}30`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: lesson.color, fontWeight: 600, marginBottom: 4 }}>{t.lessonLabel} {lesson.id} {t.ofLabel} {lessons.length}</div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: lesson.color, margin: "0 0 4px" }}>{lesson.icon} {lesson.title[lang]}</h2>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{lesson.subtitle[lang]}</p>
                </div>

                {/* Lesson Sections */}
                {lesson.sections.map((sec, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", margin: "0 0 8px" }}>{sec.heading[lang]}</h3>
                    <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.7, whiteSpace: "pre-line" }}>{sec.body[lang]}</div>
                  </div>
                ))}

                {/* Key Takeaway */}
                <div style={{ background: "#ecfdf5", border: "1px solid #059669", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 4 }}>🎯 {t.keyTakeaway}</div>
                  <div style={{ fontSize: 12, color: "#065f46", lineHeight: 1.6 }}>{lesson.takeaway[lang]}</div>
                </div>

                {/* Think About */}
                <div style={{ background: "#faf5ff", border: "1px solid #9333ea", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>🧠 {t.tryThinking}</div>
                  <div style={{ fontSize: 12, color: "#581c87", lineHeight: 1.6, fontStyle: "italic" }}>{lesson.thinkAbout[lang]}</div>
                </div>

                {/* Disclaimer */}
                <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", padding: "2px 4px 10px", lineHeight: 1.5 }}>
                  ℹ️ {t.disclaimer}
                </div>

                {/* Navigation */}
                <div style={{ display: "flex", gap: 8 }}>
                  {currentLesson > 0 && (
                    <button onClick={() => { setCurrentLesson(currentLesson - 1); scrollTop(); }}
                      style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      ← {t.prevLesson}
                    </button>
                  )}
                  {!completedLessons.includes(lesson.id) && (
                    <button onClick={() => markLessonComplete(lesson.id)}
                      style={{ flex: 2, padding: "10px 12px", borderRadius: 10, border: "none", background: lesson.color, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      ✅ {t.markComplete}
                    </button>
                  )}
                  {currentLesson < lessons.length - 1 && isLessonUnlocked(currentLesson + 1) && (
                    <button onClick={() => { setCurrentLesson(currentLesson + 1); scrollTop(); }}
                      style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {t.nextLesson} →
                    </button>
                  )}
                  {currentLesson < lessons.length - 1 && !isLessonUnlocked(currentLesson + 1) && completedLessons.includes(lesson.id) && (
                    <button onClick={() => { setCurrentLesson(currentLesson + 1); scrollTop(); }}
                      style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {t.nextLesson} →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 30, color: "#9ca3af" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
                <p>{t.locked}</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ MARKETS TAB ═══ */}
        {tab === "markets" && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>📊 {t.marketsTitle}</h2>
              <p style={{ fontSize: 11, opacity: 0.9, margin: 0 }}>{t.scenarioNote}</p>
            </div>

            {/* Economic Cycle Visual */}
            <CycleChart lang={lang} />

            {/* Illustrative Scenario (not live data — see launch plan §2.3) */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#92400e", margin: "0 0 6px" }}>🔍 {t.currentState}</h3>
              <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.7 }}>
                {lang === "en" ? "A 'late expansion' scenario: GDP growing but slowing, inflation running above the central bank's target, the policy rate elevated with policymakers divided on the next move, and rising tariffs adding cost pressure. This mix of signals is the kind that has historically shown up late in an expansion, before growth clearly turns." :
                 lang === "ko" ? "'확장 후기' 시나리오: GDP는 성장하지만 둔화되고, 인플레이션은 중앙은행 목표치를 웃돌며, 정책금리는 높은 수준에서 정책 당국자들 사이에 방향성 이견이 있고, 관세 인상이 비용 압박을 더합니다. 이런 혼합 신호는 역사적으로 확장기 후반, 즉 성장이 뚜렷하게 꺾이기 전에 나타나는 패턴입니다." :
                 lang === "es" ? "Un escenario de 'expansión tardía': el PIB crece pero se desacelera, la inflación supera el objetivo del banco central, la tasa de política está elevada con los responsables divididos sobre el próximo paso, y los aranceles en aumento añaden presión de costos. Esta combinación de señales es la que históricamente aparece en la fase tardía de una expansión, antes de que el crecimiento cambie claramente de rumbo." :
                 lang === "zh" ? "一个“扩张后期”情形：GDP增长但放缓，通胀高于央行目标，政策利率处于高位且决策者对下一步方向存在分歧，关税上升带来成本压力。这种信号组合历来出现在扩张后期，即增长明显转向之前。" :
                 "「拡大後期」の状況：GDP成長は鈍化しつつあり、インフレは中央銀行の目標を上回り、政策金利は高水準で当局者の間で次の一手について意見が分かれ、関税の上昇がコスト圧力を高めています。こうした混在シグナルは、成長がはっきりと転換する前の拡大期後半に歴史的に見られるパターンです。"}
              </div>
            </div>

            {/* Rate Effects Grid */}
            <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>💹 {t.rateHow}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, marginBottom: 12 }}>
              {[
                { n: "Stocks", r: "↓", f: "↑", note: "Growth most sensitive" },
                { n: "Bonds", r: "↓ prices", f: "↑ prices", note: "Long bonds move most" },
                { n: "Real Estate", r: "↓", f: "↑", note: "6-12 month lag" },
                { n: "Gold", r: "↓", f: "↑", note: "Also ↑ in crises" },
                { n: "Cash", r: "↑ yields", f: "↓ yields", note: "5% = competitive" },
                { n: "USD", r: "↑", f: "↓", note: "Impacts EM" },
              ].map((a, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: 7, textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 3 }}>{a.n}</div>
                  <div style={{ fontSize: 9, color: "#dc2626" }}>{t.ratesRising} {a.r}</div>
                  <div style={{ fontSize: 9, color: "#059669" }}>{t.ratesFalling} {a.f}</div>
                  <div style={{ fontSize: 7, color: "#9ca3af", marginTop: 1 }}>{a.note}</div>
                </div>
              ))}
            </div>

            {/* Yield Curves */}
            <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📐 {t.yieldCurveLabel}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
              {[["normal", t.curveNormal], ["flat", t.curveFlat], ["inverted", t.curveInverted], ["steep", t.curveSteep]].map(([tp, lb]) => (
                <YieldCurve key={tp} type={tp} label={lb} />
              ))}
            </div>

            {/* QE/QT Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
              <div style={{ background: "#ecfdf5", border: "1px solid #059669", borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#059669", marginBottom: 3 }}>📈 {t.qeLabel}</div>
                <div style={{ fontSize: 8, color: "#065f46", lineHeight: 1.5 }}>
                  {t.qeNarrative}
                </div>
              </div>
              <div style={{ background: "#fef2f2", border: "1px solid #dc2626", borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#dc2626", marginBottom: 3 }}>📉 {t.qtLabel}</div>
                <div style={{ fontSize: 8, color: "#991b1b", lineHeight: 1.5 }}>
                  {t.qtNarrative}
                </div>
              </div>
            </div>

            {/* Balance Sheet Chart */}
            <Bar data={[
              { l: "Pre\n'08", v: 0.9 }, { l: "QE1-3\n'14", v: 4.5 }, { l: "QT1\n'19", v: 3.8 },
              { l: "COVID\nQE", v: 9.0 }, { l: "QT2\n'22-24", v: 6.7 },
            ]} title={`📊 ${t.balanceSheet} ($T)`} colors={["#94a3b8", "#059669", "#dc2626", "#059669", "#dc2626"]} h={90} />

            {/* Key Principles */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10, fontSize: 11, color: "#78350f", lineHeight: 1.7, marginTop: 8 }}>
              <strong>{t.ratePrinciples}:</strong><br/>
              1. Policy works with 12-24 month lags<br/>
              2. Inverted yield curve = recession signal<br/>
              3. Rate of CHANGE matters more than level<br/>
              4. Real rates matter more than nominal<br/>
              5. Don't fight the Fed<br/>
              6. Terminal rate determines landing severity
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", padding: "10px 4px", lineHeight: 1.5, marginTop: 8 }}>
              ℹ️ {t.disclaimer}
            </div>
          </div>
        )}

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
