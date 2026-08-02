export default function Learn({ t, lang, lessons, completedLessons, currentLesson, isLessonUnlocked, setCurrentLesson, markLessonComplete, scrollTop }) {
  const lesson = lessons[currentLesson];
  return (
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
  );
}
