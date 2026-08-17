// ═══════════════════════════════════════════════════════════════════════════
// MARKETS TAB CONTENT
//
// Extracted from the screen so it can be translated and checked like every
// other content module. Most of this was previously English-only text embedded
// in JSX, which meant a Korean or Japanese reader saw an English asset table.
//
// STANDING RULE (LAUNCH_PLAN §2.3): nothing here may carry a date, a current
// rate, an index level, or any figure that reads as live market data. This tab
// teaches shapes and relationships, not readings. The historical balance-sheet
// figures below are explicitly labelled as history, which is why they are
// allowed — a reader cannot mistake "2008" for "today".
// ═══════════════════════════════════════════════════════════════════════════

export const phaseNames = {
  en: ["Expansion", "Peak", "Contraction", "Trough"],
  es: ["Expansión", "Pico", "Contracción", "Valle"],
  ko: ["확장기", "정점", "수축기", "저점"],
  zh: ["扩张", "顶峰", "收缩", "低谷"],
  ja: ["拡大", "ピーク", "収縮", "底"],
};

export const trendLabel = {
  en: "Long-run productivity trend",
  es: "Tendencia de productividad a largo plazo",
  ko: "장기 생산성 추세선",
  zh: "长期生产力趋势线",
  ja: "長期の生産性トレンド",
};

export const cycleChartDescription = {
  en: "A wave rising above and falling below a long-run productivity trend line, marked at expansion, peak, contraction and trough.",
  es: "Una onda que sube y baja alrededor de una línea de tendencia de productividad, marcada en expansión, pico, contracción y valle.",
  ko: "장기 생산성 추세선 위아래로 오르내리는 파동에 확장기·정점·수축기·저점이 표시된 그래프입니다.",
  zh: "一条围绕长期生产力趋势线上下波动的曲线，标注了扩张、顶峰、收缩和低谷。",
  ja: "長期の生産性トレンド線の上下に波打つ曲線で、拡大・ピーク・収縮・底が示されています。",
};

// The teaching scenario. Deliberately hypothetical and undated — it describes a
// *kind* of moment, not the present one.
export const scenario = {
  en: "A 'late expansion' scenario: GDP growing but slowing, inflation running above the central bank's target, the policy rate elevated with policymakers divided on the next move, and rising tariffs adding cost pressure. This mix of signals is the kind that has historically shown up late in an expansion, before growth clearly turns.",
  es: "Un escenario de 'expansión tardía': el PIB crece pero se desacelera, la inflación supera el objetivo del banco central, la tasa de política está elevada con los responsables divididos sobre el próximo paso, y los aranceles en aumento añaden presión de costos. Esta combinación de señales es la que históricamente aparece en la fase tardía de una expansión, antes de que el crecimiento cambie claramente de rumbo.",
  ko: "'확장 후기' 시나리오: GDP는 성장하지만 둔화되고, 인플레이션은 중앙은행 목표치를 웃돌며, 정책금리는 높은 수준에서 정책 당국자들 사이에 방향성 이견이 있고, 관세 인상이 비용 압박을 더합니다. 이런 혼합 신호는 역사적으로 확장기 후반, 즉 성장이 뚜렷하게 꺾이기 전에 나타나는 패턴입니다.",
  zh: "一个「扩张后期」情形：GDP增长但放缓，通胀高于央行目标，政策利率处于高位且决策者对下一步方向存在分歧，关税上升带来成本压力。这种信号组合历来出现在扩张后期，即增长明显转向之前。",
  ja: "「拡大後期」の状況：GDP成長は鈍化しつつあり、インフレは中央銀行の目標を上回り、政策金利は高水準で当局者の間で次の一手について意見が分かれ、関税の上昇がコスト圧力を高めています。こうした混在シグナルは、成長がはっきりと転換する前の拡大期後半に歴史的に見られるパターンです。",
};

// How asset classes have historically related to rate moves. Direction only —
// no figures, and framed as historical tendency rather than a recommendation
// (LAUNCH_PLAN §10.1: general and historical, never personal).
export const rateEffects = [
  {
    key: "stocks",
    name: { en: "Stocks", es: "Acciones", ko: "주식", zh: "股票", ja: "株式" },
    rising: "↓", falling: "↑",
    note: {
      en: "Growth names most sensitive",
      es: "Las de crecimiento, más sensibles",
      ko: "성장주가 가장 민감",
      zh: "成长股最敏感",
      ja: "グロース株が最も敏感",
    },
  },
  {
    key: "bonds",
    name: { en: "Bonds", es: "Bonos", ko: "채권", zh: "债券", ja: "債券" },
    rising: "↓", falling: "↑",
    note: {
      en: "Long maturities move most",
      es: "Los de largo plazo se mueven más",
      ko: "장기채가 가장 크게 움직임",
      zh: "长期债券波动最大",
      ja: "長期債の変動が最大",
    },
  },
  {
    key: "realEstate",
    name: { en: "Real Estate", es: "Bienes Raíces", ko: "부동산", zh: "房地产", ja: "不動産" },
    rising: "↓", falling: "↑",
    note: {
      en: "Responds with a lag",
      es: "Responde con rezago",
      ko: "시차를 두고 반응",
      zh: "滞后反应",
      ja: "遅れて反応",
    },
  },
  {
    key: "gold",
    name: { en: "Gold", es: "Oro", ko: "금", zh: "黄金", ja: "金" },
    rising: "↓", falling: "↑",
    note: {
      en: "Has also risen in crises",
      es: "También ha subido en crisis",
      ko: "위기 때도 상승한 사례",
      zh: "危机时也曾上涨",
      ja: "危機時にも上昇した例",
    },
  },
  {
    key: "cash",
    name: { en: "Cash", es: "Efectivo", ko: "현금", zh: "现金", ja: "現金" },
    rising: "↑", falling: "↓",
    note: {
      en: "Yield tracks the policy rate",
      es: "El rendimiento sigue la tasa de política",
      ko: "수익률이 정책금리를 따라감",
      zh: "收益率跟随政策利率",
      ja: "利回りは政策金利に追随",
    },
  },
  {
    key: "usd",
    name: { en: "US Dollar", es: "Dólar", ko: "달러", zh: "美元", ja: "米ドル" },
    rising: "↑", falling: "↓",
    note: {
      en: "Affects emerging markets",
      es: "Afecta a mercados emergentes",
      ko: "신흥국에 영향",
      zh: "影响新兴市场",
      ja: "新興国に影響",
    },
  },
];

// Historical US Federal Reserve balance sheet, in trillions of dollars. Labelled
// by era rather than by date so it reads unambiguously as history.
export const balanceSheetHistory = [
  { key: "pre08", value: 0.9, label: { en: "Before\n2008", es: "Antes de\n2008", ko: "2008년\n이전", zh: "2008年\n之前", ja: "2008年\n以前" } },
  { key: "qe123", value: 4.5, label: { en: "After\nQE1–3", es: "Tras\nQE1–3", ko: "QE1~3\n이후", zh: "QE1–3\n之后", ja: "QE1〜3\n後" } },
  { key: "qt1", value: 3.8, label: { en: "First\ntightening", es: "Primer\najuste", ko: "1차\n긴축", zh: "首次\n紧缩", ja: "第1次\n引き締め" } },
  { key: "covid", value: 9.0, label: { en: "Pandemic\nresponse", es: "Respuesta\npandemia", ko: "팬데믹\n대응", zh: "疫情\n应对", ja: "パンデミック\n対応" } },
  { key: "qt2", value: 6.7, label: { en: "Second\ntightening", es: "Segundo\najuste", ko: "2차\n긴축", zh: "第二次\n紧缩", ja: "第2次\n引き締め" } },
];

// The figure's text alternative (backlog item 41). The caption below explains
// what the shape *means*; this one says what is on screen, because a reader who
// cannot see the bars still needs the five values and their order before the
// caption's "the shape, not the exact level" has anything to refer to.
export const balanceSheetDescription = {
  en: "Five bars, in trillions of dollars: 0.9 before 2008, 4.5 after QE1–3, 3.8 after the first tightening, 9.0 after the pandemic response, 6.7 after the second tightening. Two large rises, each followed by a smaller fall.",
  es: "Cinco barras, en billones de dólares: 0,9 antes de 2008; 4,5 tras QE1–3; 3,8 tras el primer ajuste; 9,0 tras la respuesta a la pandemia; 6,7 tras el segundo ajuste. Dos grandes subidas, cada una seguida de una bajada menor.",
  ko: "막대 다섯 개, 단위는 조 달러: 2008년 이전 0.9, QE1~3 이후 4.5, 1차 긴축 이후 3.8, 팬데믹 대응 이후 9.0, 2차 긴축 이후 6.7. 크게 두 번 올라가고, 그때마다 그보다 작게 내려옵니다.",
  zh: "五根柱，单位为万亿美元：2008年之前0.9，QE1–3之后4.5，首次紧缩之后3.8，疫情应对之后9.0，第二次紧缩之后6.7。两次大幅上升，每次之后是一次较小的回落。",
  ja: "棒が5本、単位は兆ドル：2008年以前は0.9、QE1〜3後は4.5、第1次引き締め後は3.8、パンデミック対応後は9.0、第2次引き締め後は6.7。大きな上昇が2回あり、そのたびにより小さな下落が続きます。",
};

export const balanceSheetCaption = {
  en: "Each expansion came from buying bonds to support the economy; each decline came from letting them mature. The shape, not the exact level, is the point.",
  es: "Cada expansión vino de comprar bonos para apoyar la economía; cada caída, de dejarlos vencer. Lo importante es la forma, no el nivel exacto.",
  ko: "확대 구간은 경기 부양을 위해 채권을 매입한 결과이고, 축소 구간은 만기 도래분을 재투자하지 않은 결과입니다. 정확한 수치보다 전체적인 모양이 핵심입니다.",
  zh: "每一次扩张都源于购买债券以支持经济，每一次收缩都源于让债券到期。关键在于形状，而非确切数值。",
  ja: "拡大局面は景気を支えるための債券購入によるもので、縮小局面は償還分を再投資しなかった結果です。正確な水準よりも全体の形が重要です。",
};

// Durable principles, not calls to action. Item 5 is stated as an observed
// historical tendency rather than the common imperative phrasing, which would
// read as a directive (LAUNCH_PLAN §10.1).
export const ratePrinciples = [
  {
    en: "Policy changes work with lags — often a year or more.",
    es: "La política actúa con rezagos, a menudo de un año o más.",
    ko: "정책 변화는 흔히 1년 이상의 시차를 두고 효과가 나타납니다.",
    zh: "政策变化以滞后方式发挥作用，往往需要一年以上。",
    ja: "政策変更は多くの場合1年以上の遅れを伴って効いてきます。",
  },
  {
    en: "An inverted yield curve has preceded past recessions, though not every inversion was followed by one.",
    es: "Una curva invertida ha precedido a recesiones pasadas, aunque no toda inversión fue seguida por una.",
    ko: "수익률 곡선 역전은 과거 경기침체에 앞서 나타났지만, 역전이 항상 침체로 이어진 것은 아닙니다.",
    zh: "收益率曲线倒挂曾先于历次衰退出现，但并非每次倒挂之后都会发生衰退。",
    ja: "逆イールドは過去の景気後退に先行してきましたが、逆イールドが必ず後退につながったわけではありません。",
  },
  {
    en: "The speed of change often matters more than the level itself.",
    es: "La velocidad del cambio suele importar más que el nivel en sí.",
    ko: "금리의 절대 수준보다 변화의 속도가 더 중요한 경우가 많습니다.",
    zh: "变化的速度往往比水平本身更重要。",
    ja: "水準そのものより、変化のスピードが重要なことが多いです。",
  },
  {
    en: "Real rates — after inflation — say more than headline rates.",
    es: "Las tasas reales, descontada la inflación, dicen más que las nominales.",
    ko: "물가를 반영한 실질금리가 명목금리보다 더 많은 것을 말해 줍니다.",
    zh: "扣除通胀后的实际利率比名义利率更能说明问题。",
    ja: "インフレを差し引いた実質金利のほうが、名目金利より多くを語ります。",
  },
  {
    en: "Markets have historically struggled against sustained tightening.",
    es: "Históricamente los mercados han tenido dificultades ante un endurecimiento sostenido.",
    ko: "시장은 지속적인 긴축 기조에 역행하기 어려웠던 것이 역사적 경험입니다.",
    zh: "历史上，市场难以对抗持续的紧缩政策。",
    ja: "市場は持続的な引き締めに逆らうのが難しい、というのが歴史的な経験です。",
  },
  {
    en: "Where tightening stops shapes how gentle or harsh the slowdown is.",
    es: "Dónde se detiene el endurecimiento define qué tan suave o severa es la desaceleración.",
    ko: "긴축이 어디서 멈추는지가 경기 둔화의 강도를 좌우합니다.",
    zh: "紧缩在何处停止，决定了放缓是温和还是剧烈。",
    ja: "引き締めがどこで止まるかが、減速の穏やかさ・厳しさを左右します。",
  },
];
