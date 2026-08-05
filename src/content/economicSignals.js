// ═══════════════════════════════════════════════════════════════════════════
// ECONOMIC SIGNALS
//
// Plain-language labels for the FRED readings the daily job publishes
// (src/lib/marketData/fred.js). Mirrors src/content/sectors.js: the label and
// one-sentence description lead, the underlying series id stays an
// implementation detail the reader never needs to see.
//
// Order matches FRED_SERIES in fred.js — not load-bearing, just easier to
// diff the two side by side.
// ═══════════════════════════════════════════════════════════════════════════

export const economicSignals = [
  {
    key: "policyRate",
    name: { en: "Fed funds rate", es: "Tasa de fondos federales", ko: "연방기금금리", zh: "联邦基金利率", ja: "FF金利" },
    what: {
      en: "The overnight rate the Fed sets — the lever behind most other borrowing costs.",
      es: "La tasa a un día que fija la Fed, la palanca detrás de la mayoría de las demás tasas.",
      ko: "연준이 정하는 익일물 금리 — 다른 대부분의 금리에 영향을 주는 지표.",
      zh: "美联储设定的隔夜利率——影响其他多数借贷成本的关键杠杆。",
      ja: "FRBが定める翌日物金利 — 他の多くの金利に影響する基準。",
    },
  },
  {
    key: "yield2y",
    name: { en: "2-year Treasury yield", es: "Rendimiento del bono a 2 años", ko: "2년물 국채 수익률", zh: "2年期美债收益率", ja: "2年債利回り" },
    what: {
      en: "What the government pays to borrow for two years.",
      es: "Lo que paga el gobierno por pedir prestado a dos años.",
      ko: "정부가 2년간 돈을 빌릴 때 지불하는 금리.",
      zh: "政府借款两年需支付的利率。",
      ja: "政府が2年間借りるときに払う利率。",
    },
  },
  {
    key: "yield10y",
    name: { en: "10-year Treasury yield", es: "Rendimiento del bono a 10 años", ko: "10년물 국채 수익률", zh: "10年期美债收益率", ja: "10年債利回り" },
    what: {
      en: "What the government pays to borrow for ten years — a benchmark for mortgages.",
      es: "Lo que paga el gobierno por pedir prestado a diez años, referencia para hipotecas.",
      ko: "정부가 10년간 돈을 빌릴 때 지불하는 금리 — 모기지의 기준.",
      zh: "政府借款十年需支付的利率——房贷利率的基准。",
      ja: "政府が10年間借りるときに払う利率 — 住宅ローンなどの基準。",
    },
  },
  {
    key: "curveSpread",
    name: { en: "10-year minus 2-year", es: "10 años menos 2 años", ko: "10년물 - 2년물", zh: "10年期减2年期", ja: "10年-2年スプレッド" },
    what: {
      en: "Negative has preceded past recessions, though not every inversion was followed by one.",
      es: "Negativo ha precedido a recesiones pasadas, aunque no toda inversión fue seguida de una.",
      ko: "음수는 과거 경기침체에 앞서 나타났지만, 모든 역전이 침체로 이어진 것은 아닙니다.",
      zh: "为负值时曾先于以往衰退出现，但并非每次倒挂都伴随衰退。",
      ja: "マイナスは過去の景気後退に先行してきましたが、逆転が必ず後退につながるわけではありません。",
    },
  },
  {
    key: "cpiIndex",
    name: { en: "Consumer prices (CPI)", es: "Precios al consumidor (IPC)", ko: "소비자물가(CPI)", zh: "消费者价格(CPI)", ja: "消費者物価(CPI)" },
    what: {
      en: "An index of average prices — the basis for the inflation rate.",
      es: "Un índice de precios promedio, la base de la tasa de inflación.",
      ko: "평균 물가 수준을 나타내는 지수 — 인플레이션율의 기준.",
      zh: "反映平均价格水平的指数——通胀率的基础。",
      ja: "平均的な物価水準を示す指数 — インフレ率の基礎。",
    },
  },
  {
    key: "unemployment",
    name: { en: "Unemployment rate", es: "Tasa de desempleo", ko: "실업률", zh: "失业率", ja: "失業率" },
    what: {
      en: "Share of the labor force without a job and looking for one.",
      es: "Porcentaje de la fuerza laboral sin empleo y buscando uno.",
      ko: "일자리가 없고 구직 중인 노동인구의 비율.",
      zh: "劳动力中失业并正在求职的比例。",
      ja: "労働力人口のうち、失業して職を探している人の割合。",
    },
  },
];
