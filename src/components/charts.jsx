export function Bar({ data, title, colors, h = 140 }) {
  const mx = Math.max(...data.map(d => Math.abs(d.v)));
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, marginBottom: 8 }}>
      {title && <div style={{ fontSize: "0.6875rem", fontWeight: 700, marginBottom: 6 }}>{title}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: h }}>
        {data.map((d, i) => {
          const pct = Math.abs(d.v) / mx * 100;
          return (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div style={{ fontSize: "0.5rem", fontWeight: 700, marginBottom: 2, color: colors[i] }}>{typeof d.v === 'number' && d.v > 1 ? d.v.toFixed(1) : d.v}</div>
            <div style={{ width: "80%", height: `${pct}%`, background: colors[i], borderRadius: 3, minHeight: 2, transition: "height 0.5s" }} />
            <div style={{ fontSize: "0.4375rem", color: "#6b7280", marginTop: 2, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.2 }}>{d.l}</div>
          </div>);
        })}
      </div>
    </div>
  );
}

export function YieldCurve({ type, label }) {
  const pts = { normal: "M10,60 Q40,50 70,35 T130,15", flat: "M10,38 Q40,37 70,36 T130,34", inverted: "M10,15 Q40,25 70,35 T130,55", steep: "M10,70 Q40,55 70,30 T130,5" };
  const cols = { normal: "#059669", flat: "#d97706", inverted: "#dc2626", steep: "#2563eb" };
  // Darker -700 shades for text: cols' green/amber fall below the 4.5:1 WCAG AA
  // ratio for small text on white (measured ~3.8:1 / ~3.2:1); these clear ~5:1+.
  const textCols = { normal: "#047857", flat: "#b45309", inverted: "#dc2626", steep: "#2563eb" };
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
      <div style={{ fontSize: "0.5625rem", fontWeight: 700, color: textCols[type], marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function CycleChart({ lang }) {
  const phaseNames = { en: ["Expansion", "Peak", "Contraction", "Trough"], ko: ["확장기", "정점", "수축기", "저점"], es: ["Expansión", "Pico", "Contracción", "Valle"], zh: ["扩张", "顶峰", "收缩", "低谷"], ja: ["拡大", "ピーク", "収縮", "底"] };
  const names = phaseNames[lang] || phaseNames.en;
  const colors = ["#059669", "#d97706", "#dc2626", "#2563eb"];
  // Same -700-shade swap as YieldCurve above, for the phase-name text labels only —
  // the dot markers keep the brighter palette since they're non-text (3:1 suffices).
  const textColors = ["#047857", "#b45309", "#dc2626", "#2563eb"];
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
            <text x={p.x} y={p.y - 8} textAnchor="middle" fill={textColors[p.i]} fontSize="7" fontWeight="bold">{names[p.i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
