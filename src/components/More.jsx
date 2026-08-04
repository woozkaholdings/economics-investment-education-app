import { useState } from "react";
import { quizData } from "../content/quizData.js";
import { glossary } from "../content/glossary.js";
import { kidsContent } from "../content/kidsContent.js";

export default function More({ t, lang }) {
  const [moreSection, setMoreSection] = useState("quiz");
  const [qIdx, setQIdx] = useState(0);
  const [qStarted, setQStarted] = useState(false);
  const [qAnswer, setQAnswer] = useState(null);
  const [qScore, setQScore] = useState(0);
  const [qDone, setQDone] = useState(false);
  const [kidsAge, setKidsAge] = useState("5-8");
  const [glossSearch, setGlossSearch] = useState("");

  const resetQuiz = () => { setQIdx(0); setQStarted(false); setQAnswer(null); setQScore(0); setQDone(false); };

  return (
    <div>
      {/* Sub-nav for More */}
      <div role="tablist" aria-label={t.tabMore} style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {[
          { k: "quiz", l: "🧠 " + t.quizTabLabel },
          { k: "kids", l: "👨‍👩‍👧 " + t.kidsTabLabel },
          { k: "glossary", l: "📚 " + t.glossTitle },
          { k: "about", l: "ℹ️ " + t.aboutTabLabel },
        ].map(s => (
          <button key={s.k} id={`more-tab-${s.k}`} role="tab" aria-selected={moreSection === s.k} aria-controls={`more-tabpanel-${s.k}`} onClick={() => setMoreSection(s.k)}
            style={{ flex: 1, padding: "8px 6px", border: moreSection === s.k ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 8, background: moreSection === s.k ? "#eff6ff" : "#fff", color: moreSection === s.k ? "#2563eb" : "#6b7280", fontWeight: moreSection === s.k ? 700 : 500, fontSize: 10, cursor: "pointer" }}>
            {s.l}
          </button>
        ))}
      </div>

      {/* Quiz Section */}
      {moreSection === "quiz" && (
        <div role="tabpanel" id="more-tabpanel-quiz" aria-labelledby="more-tab-quiz">
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
              <h3 id="quiz-question" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "#1f2937" }}>{quizData[qIdx].q[lang]}</h3>
              <div role="radiogroup" aria-labelledby="quiz-question">
                {quizData[qIdx].opts[lang].map((opt, i) => (
                  <button key={i} role="radio" aria-checked={qAnswer === i} onClick={() => { if (qAnswer === null) { setQAnswer(i); if (i === quizData[qIdx].answer) setQScore(s => s + 1); } }}
                    style={{ display: "block", width: "100%", padding: "10px 12px", marginBottom: 6, borderRadius: 8, textAlign: "left", fontSize: 12, cursor: qAnswer === null ? "pointer" : "default",
                      border: qAnswer === null ? "1px solid #d1d5db" : i === quizData[qIdx].answer ? "2px solid #059669" : i === qAnswer ? "2px solid #dc2626" : "1px solid #d1d5db",
                      background: qAnswer === null ? "#fff" : i === quizData[qIdx].answer ? "#ecfdf5" : i === qAnswer ? "#fef2f2" : "#fff",
                      color: "#1f2937", fontWeight: qAnswer !== null && i === quizData[qIdx].answer ? 700 : 400 }}>
                    {opt}
                  </button>
                ))}
              </div>
              {qAnswer !== null && (
                <div aria-live="polite" style={{ marginTop: 8 }}>
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
        <div role="tabpanel" id="more-tabpanel-kids" aria-labelledby="more-tab-kids">
          <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>👨‍👩‍👧‍👦 {t.kidsTitle}</h2>
          </div>
          <div style={{ fontSize: 11, color: "#78350f", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: 8, marginBottom: 10, lineHeight: 1.5 }}>
            {t.kidsParentIntro}
          </div>
          <div role="tablist" aria-label={t.kidsAgeGroupLabel} style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {["5-8", "9-12", "13-17"].map(age => (
              <button key={age} id={`kids-age-tab-${age}`} role="tab" aria-selected={kidsAge === age} aria-controls="kids-age-tabpanel" onClick={() => setKidsAge(age)}
                style={{ flex: 1, padding: "8px 6px", borderRadius: 8, border: kidsAge === age ? "2px solid #f97316" : "1px solid #d1d5db", background: kidsAge === age ? "#fff7ed" : "#fff", color: kidsAge === age ? "#ea580c" : "#6b7280", fontWeight: kidsAge === age ? 700 : 500, fontSize: 11, cursor: "pointer" }}>
                {age === "5-8" ? t.kidsAges58 : age === "9-12" ? t.kidsAges912 : t.kidsAges1317}
              </button>
            ))}
          </div>
          <div role="tabpanel" id="kids-age-tabpanel" aria-labelledby={`kids-age-tab-${kidsAge}`} style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e5e7eb" }}>
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
        <div role="tabpanel" id="more-tabpanel-glossary" aria-labelledby="more-tab-glossary">
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
        <div role="tabpanel" id="more-tabpanel-about" aria-labelledby="more-tab-about">
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
  );
}
