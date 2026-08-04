import { useState, useEffect } from "react";
import { estimateMinutes } from "../content/lessons.js";

function ProgressRing({ pct, size = 64, stroke = 7, color = "#2563eb", track = "#bfdbfe" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
}

export default function Home({ t, lang, completedLessons, lessons, isLessonUnlocked, setCurrentLesson, setTab, scrollTop, streak }) {
  const pct = lessons.length > 0 ? completedLessons.length / lessons.length : 0;
  // Ring starts at 0 and animates up to pct on mount/update, so returning to Home
  // after completing a lesson shows the ring visibly fill in rather than snapping.
  const [ringPct, setRingPct] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRingPct(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);
  return (
    <div>
      <div style={{ textAlign: "center", padding: "20px 10px" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏛️</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: "#1e3a5f" }}>{t.welcomeTitle}</h2>
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{t.welcomeSub}</p>
      </div>

      {/* Progress Card */}
      <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe", borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 64, height: 64 }} role="img" aria-label={`${t.progressLabel}: ${Math.round(pct * 100)}%`}>
            <ProgressRing pct={ringPct} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#1e40af" }}>
              {Math.round(pct * 100)}%
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1e40af" }}>{completedLessons.length}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>{t.lessonsCompleted}</div>
            </div>
            <div style={{ width: 1, background: "#bfdbfe" }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1e40af" }}>{lessons.length}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>{t.totalLessons}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Badge */}
      {streak > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff7ed", border: "1px solid #fdba74", borderRadius: 10, padding: "6px 10px", marginBottom: 12, fontSize: 11, fontWeight: 700, color: "#c2410c" }}>
          <span>🔥</span> {t.streakTemplate.replace("{n}", streak)}
        </div>
      )}

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
                <div style={{ fontSize: 11, fontWeight: 700, color: done ? "#047857" : "#1f2937" }}>{t.lessonLabel} {l.id}: {l.title[lang]}</div>
                <div style={{ fontSize: 9, color: "#9ca3af" }}>{l.subtitle[lang]}</div>
                <div style={{ fontSize: 8, color: "#9ca3af", marginTop: 2 }}>{t.estMinTemplate.replace("{n}", estimateMinutes(l))}</div>
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
  );
}
