import { Bar, YieldCurve, CycleChart } from "./charts.jsx";

export default function Markets({ t, lang }) {
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: 10, padding: 14, color: "#fff", marginBottom: 10 }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 4px" }}>📊 {t.marketsTitle}</h2>
        <p style={{ fontSize: "0.6875rem", opacity: 0.9, margin: 0 }}>{t.scenarioNote}</p>
      </div>

      {/* Economic Cycle Visual */}
      <CycleChart lang={lang} />

      {/* Illustrative Scenario (not live data — see launch plan §2.3) */}
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 12, marginBottom: 10 }}>
        <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#92400e", margin: "0 0 6px" }}>🔍 {t.currentState}</h3>
        <div style={{ fontSize: "0.6875rem", color: "#78350f", lineHeight: 1.7 }}>
          {lang === "en" ? "A 'late expansion' scenario: GDP growing but slowing, inflation running above the central bank's target, the policy rate elevated with policymakers divided on the next move, and rising tariffs adding cost pressure. This mix of signals is the kind that has historically shown up late in an expansion, before growth clearly turns." :
           lang === "ko" ? "'확장 후기' 시나리오: GDP는 성장하지만 둔화되고, 인플레이션은 중앙은행 목표치를 웃돌며, 정책금리는 높은 수준에서 정책 당국자들 사이에 방향성 이견이 있고, 관세 인상이 비용 압박을 더합니다. 이런 혼합 신호는 역사적으로 확장기 후반, 즉 성장이 뚜렷하게 꺾이기 전에 나타나는 패턴입니다." :
           lang === "es" ? "Un escenario de 'expansión tardía': el PIB crece pero se desacelera, la inflación supera el objetivo del banco central, la tasa de política está elevada con los responsables divididos sobre el próximo paso, y los aranceles en aumento añaden presión de costos. Esta combinación de señales es la que históricamente aparece en la fase tardía de una expansión, antes de que el crecimiento cambie claramente de rumbo." :
           lang === "zh" ? "一个“扩张后期”情形：GDP增长但放缓，通胀高于央行目标，政策利率处于高位且决策者对下一步方向存在分歧，关税上升带来成本压力。这种信号组合历来出现在扩张后期，即增长明显转向之前。" :
           "「拡大後期」の状況：GDP成長は鈍化しつつあり、インフレは中央銀行の目標を上回り、政策金利は高水準で当局者の間で次の一手について意見が分かれ、関税の上昇がコスト圧力を高めています。こうした混在シグナルは、成長がはっきりと転換する前の拡大期後半に歴史的に見られるパターンです。"}
        </div>
      </div>

      {/* Rate Effects Grid */}
      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: 6 }}>💹 {t.rateHow}</h3>
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
            <div style={{ fontWeight: 700, fontSize: "0.625rem", marginBottom: 3 }}>{a.n}</div>
            <div style={{ fontSize: "0.5625rem", color: "#dc2626" }}>{t.ratesRising} {a.r}</div>
            <div style={{ fontSize: "0.5625rem", color: "#047857" }}>{t.ratesFalling} {a.f}</div>
            <div style={{ fontSize: "0.4375rem", color: "#9ca3af", marginTop: 1 }}>{a.note}</div>
          </div>
        ))}
      </div>

      {/* Yield Curves */}
      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: 6 }}>📐 {t.yieldCurveLabel}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[["normal", t.curveNormal], ["flat", t.curveFlat], ["inverted", t.curveInverted], ["steep", t.curveSteep]].map(([tp, lb]) => (
          <YieldCurve key={tp} type={tp} label={lb} />
        ))}
      </div>

      {/* QE/QT Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
        <div style={{ background: "#ecfdf5", border: "1px solid #059669", borderRadius: 8, padding: 8 }}>
          <div style={{ fontSize: "0.625rem", fontWeight: 800, color: "#047857", marginBottom: 3 }}>📈 {t.qeLabel}</div>
          <div style={{ fontSize: "0.5rem", color: "#065f46", lineHeight: 1.5 }}>
            {t.qeNarrative}
          </div>
        </div>
        <div style={{ background: "#fef2f2", border: "1px solid #dc2626", borderRadius: 8, padding: 8 }}>
          <div style={{ fontSize: "0.625rem", fontWeight: 800, color: "#dc2626", marginBottom: 3 }}>📉 {t.qtLabel}</div>
          <div style={{ fontSize: "0.5rem", color: "#991b1b", lineHeight: 1.5 }}>
            {t.qtNarrative}
          </div>
        </div>
      </div>

      {/* Balance Sheet Chart */}
      <Bar data={[
        { l: "Pre\n'08", v: 0.9 }, { l: "QE1-3\n'14", v: 4.5 }, { l: "QT1\n'19", v: 3.8 },
        { l: "COVID\nQE", v: 9.0 }, { l: "QT2\n'22-24", v: 6.7 },
      ]} title={`📊 ${t.balanceSheet} ($T)`} colors={["#94a3b8", "#047857", "#dc2626", "#047857", "#dc2626"]} h={90} />

      {/* Key Principles */}
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10, fontSize: "0.6875rem", color: "#78350f", lineHeight: 1.7, marginTop: 8 }}>
        <strong>{t.ratePrinciples}:</strong><br/>
        1. Policy works with 12-24 month lags<br/>
        2. Inverted yield curve = recession signal<br/>
        3. Rate of CHANGE matters more than level<br/>
        4. Real rates matter more than nominal<br/>
        5. Don't fight the Fed<br/>
        6. Terminal rate determines landing severity
      </div>

      {/* Disclaimer */}
      <div style={{ fontSize: "0.5625rem", color: "#9ca3af", textAlign: "center", padding: "10px 4px", lineHeight: 1.5, marginTop: 8 }}>
        ℹ️ {t.disclaimer}
      </div>
    </div>
  );
}
