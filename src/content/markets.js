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
// figures below are explicitly labeled as history, which is why they are
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
  en: "A wave rising above and falling below an upward-sloping long-run productivity trend line, marked at expansion, peak, contraction and trough.",
  es: "Una onda que sube y baja alrededor de una línea de tendencia de productividad ascendente, marcada en expansión, pico, contracción y valle.",
  ko: "우상향하는 장기 생산성 추세선 위아래로 오르내리는 파동에 확장기·정점·수축기·저점이 표시된 그래프입니다.",
  zh: "一条围绕向上倾斜的长期生产力趋势线上下波动的曲线，标注了扩张、顶峰、收缩和低谷。",
  ja: "右肩上がりの長期の生産性トレンド線の上下に波打つ曲線で、拡大・ピーク・収縮・底が示されています。",
};

// ── Lesson 30's spending chain, drawn as a closed loop ─────────────────────
// Backlog item 27, added 2026-08-31. Rendered by `SpendingLoop` in
// charts.jsx, which carries the reasoning for the figure's shape.
//
// ⚠️ THE FOUR STEPS, THE TITLE AND THE CAPTION ARE VERBATIM SUBSTRINGS OF
// LESSON 30 in the same language — they are lifted, not translated. The
// lesson's third section writes its own claim as an arrow chain ("more
// spending → more income → more creditworthy borrowers → more borrowing →
// more spending, and so on"), so the figure's labels already exist, reviewed
// to exactly the degree the lesson beside them is. `check-data.mjs` §64 (a)
// asserts the containment per language, in both directions of failure: edit
// the lesson's wording without editing these and the check fails; edit these
// into a paraphrase and it fails too.
//
// This is also why the figure adds no new machine translation to four
// languages nobody on this project reads (AGENT_LOG.md, owner item O-3) —
// only `spendingLoopDescription` below is new prose, because a text
// alternative has to describe the SHAPE and there is no sentence in the
// lesson that does.
export const spendingLoopTitle = {
  en: "The Spending Chain",
  es: "La Cadena de Gasto",
  ko: "지출의 연쇄",
  zh: "支出链条",
  ja: "支出の連鎖",
};

// Clockwise from the top-left box. The fourth step's arrow returns to the
// first — the join the lesson's sentence cannot write, which is the whole
// reason this figure exists.
export const spendingLoopSteps = {
  en: ["more spending", "more income", "more creditworthy borrowers", "more borrowing"],
  es: ["más gasto", "más ingreso", "prestatarios más solventes", "más préstamos"],
  ko: ["더 많은 지출", "더 많은 소득", "신용도가 더 높아진 차입자", "더 많은 차입"],
  zh: ["更多支出", "更多收入", "借款人信用更好", "更多借贷"],
  ja: ["支出増", "収入増", "信用力の高い借り手が増える", "借入増"],
};

export const spendingLoopCaption = {
  en: "This self-reinforcing loop runs in both directions",
  es: "Este bucle que se refuerza a sí mismo funciona en ambas direcciones",
  ko: "이 자기 강화 고리는 양쪽 방향 모두로 작동합니다",
  zh: "这个自我强化的回路在两个方向上都会运转",
  ja: "この自己強化のループは両方向に働きます",
};

// The one string here that is not lifted from the lesson. It names the shape
// (a closed ring) and then walks it, because the closing is the only thing a
// sighted reader gets from the figure that the paragraph above it does not
// already say.
export const spendingLoopDescription = {
  en: "Four steps drawn as a closed ring: more spending leads to more income, which leads to more creditworthy borrowers, which leads to more borrowing, which leads back to more spending.",
  es: "Cuatro pasos dibujados como un anillo cerrado: más gasto lleva a más ingreso, que lleva a prestatarios más solventes, que lleva a más préstamos, que lleva de vuelta a más gasto.",
  ko: "닫힌 고리로 그려진 네 단계입니다. 더 많은 지출이 더 많은 소득으로, 더 많은 소득이 신용도가 더 높아진 차입자로, 다시 더 많은 차입으로, 그리고 다시 더 많은 지출로 이어집니다.",
  zh: "四个步骤画成一个闭合的环：更多支出带来更多收入，更多收入让借款人信用更好，进而带来更多借贷，又回到更多支出。",
  ja: "閉じた輪として描かれた4つのステップです。支出増が収入増につながり、そこから信用力の高い借り手が増える。それが借入増につながり、再び支出増へと戻ります。",
};

// The teaching scenario. Deliberately hypothetical and undated — it describes a
// *kind* of moment, not the present one.
export const scenario = {
  en: "A 'late expansion' scenario: GDP growing but slowing, inflation running above the central bank's target, the policy rate elevated with policymakers divided on the next move, and rising tariffs adding cost pressure. This mix of signals is the kind that has historically shown up late in an expansion, before growth clearly turns.",
  es: "Un escenario de 'expansión tardía': el PIB crece pero se desacelera, la inflación supera el objetivo del banco central, la tasa de política está elevada con los responsables divididos sobre el próximo paso, y los aranceles en aumento añaden presión de costos. Esta combinación de señales es la que históricamente aparece en la fase tardía de una expansión, antes de que el crecimiento cambie claramente de rumbo.",
  ko: "'확장 후기' 시나리오: GDP는 성장하지만 둔화되고, 인플레이션은 중앙은행 목표치를 웃돌며, 정책금리는 높은 수준에서 정책 당국자들 사이에 방향성 이견이 있고, 관세 인상이 비용 압박을 더합니다. 이런 혼합 신호는 역사적으로 확장기 후반, 즉 성장이 뚜렷하게 꺾이기 전에 나타나는 패턴입니다.",
  zh: "一个“扩张后期”情形：GDP增长但放缓，通胀高于央行目标，政策利率处于高位且决策者对下一步方向存在分歧，关税上升带来成本压力。这种信号组合历来出现在扩张后期，即增长明显转向之前。",
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

// Text alternatives for the four yield-curve figures (backlog item 42), keyed
// by the same curve types `CURVE_PATHS` draws. Each one describes the *shape* —
// which end of the curve sits higher — because that is what a sighted reader
// takes from the drawing; the verdict word ("Healthy", "Danger") is already in
// each figure's visible label, which stays in the figcaption beside it.
// Deliberately carries no yield numbers: the paths are stylized shapes, not a
// reading of any particular day's curve (§2.3).
export const yieldCurveDescriptions = {
  normal: {
    en: "A line rising from left to right: the 2-year yield sits lowest and the 30-year highest — the usual upward slope.",
    es: "Una línea que sube de izquierda a derecha: el rendimiento a 2 años queda más bajo y el de 30 años más alto, la pendiente ascendente habitual.",
    ko: "왼쪽에서 오른쪽으로 올라가는 선: 2년 금리가 가장 낮고 30년 금리가 가장 높은, 일반적인 우상향 모양입니다.",
    zh: "一条自左向右上行的曲线：2年期收益率最低，30年期最高，即通常的向上斜率。",
    ja: "左から右へ上がる線：2年物の利回りが最も低く、30年物が最も高い、通常の右肩上がりの形です。",
  },
  flat: {
    en: "An almost level line: the 2-year and 30-year yields sit at nearly the same height.",
    es: "Una línea casi horizontal: los rendimientos a 2 y a 30 años quedan casi a la misma altura.",
    ko: "거의 수평인 선: 2년 금리와 30년 금리가 거의 같은 높이에 있습니다.",
    zh: "一条几乎水平的曲线：2年期与30年期收益率几乎处于同一高度。",
    ja: "ほぼ水平な線：2年物と30年物の利回りがほぼ同じ高さにあります。",
  },
  inverted: {
    en: "A line falling from left to right: the 2-year yield sits above the 30-year — the usual slope reversed.",
    es: "Una línea que baja de izquierda a derecha: el rendimiento a 2 años queda por encima del de 30 años, la pendiente habitual invertida.",
    ko: "왼쪽에서 오른쪽으로 내려가는 선: 2년 금리가 30년 금리보다 높아, 평소의 우상향이 뒤집힌 모양입니다.",
    zh: "一条自左向右下行的曲线：2年期收益率高于30年期，通常的向上斜率被反转。",
    ja: "左から右へ下がる線：2年物の利回りが30年物を上回り、通常の右肩上がりが逆転した形です。",
  },
  steep: {
    en: "A line climbing sharply from left to right: the 30-year yield sits far above the 2-year.",
    es: "Una línea que sube con fuerza de izquierda a derecha: el rendimiento a 30 años queda muy por encima del de 2 años.",
    ko: "왼쪽에서 오른쪽으로 가파르게 올라가는 선: 30년 금리가 2년 금리보다 훨씬 높습니다.",
    zh: "一条自左向右陡峭上行的曲线：30年期收益率远高于2年期。",
    ja: "左から右へ急に上がる線：30年物の利回りが2年物を大きく上回っています。",
  },
};

// Historical US Federal Reserve balance sheet, in trillions of dollars. Labeled
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

// ── Money supply ───────────────────────────────────────────────────────────
// Added 2026-08-25. The app referred to "the base money supply" in three
// places (glossary "Credit", the economy-track credit lesson, and its quiz
// explanation) without ever defining it — the phrase was doing work no screen
// had taught. These three tiers are the definition, placed next to QE/QT
// because that is the mechanism that moves the narrowest one.
//
// §2.3 applies: no level, no growth rate, no date. The aggregates are taught
// as *composition* — what is inside each measure and who creates it — which
// is the part that does not go stale. The exact composition is set by each
// central bank and has been redefined over time; that caveat is in the copy
// rather than in this comment, because a reader comparing a long historical
// chart needs it and will never read this file.
//
// 2026-08-26: those three places no longer say "the base money supply" — they
// say "monetary base (M0)" and the matching term in each language, and the
// lesson now carries a §3.0.3 glossary chip to the M0 entry. The paragraph
// above is left as written because it is the record of why this block exists;
// this note is what makes it read correctly today. Two of the five languages
// (ko 본원통화, zh 基础货币) were already using the standard term and only
// gained the "(M0)" tag; es and ja were not (see AGENT_LOG.md item 114).
export const moneyAggregates = [
  {
    key: "m0",
    name: { en: "M0 — Monetary base", es: "M0 — Base monetaria", ko: "M0 — 본원통화", zh: "M0 — 基础货币", ja: "M0 — マネタリーベース" },
    contains: {
      en: "Cash in circulation + reserves banks hold at the central bank",
      es: "Efectivo en circulación + reservas de los bancos en el banco central",
      ko: "유통 중인 현금 + 은행이 중앙은행에 맡긴 지급준비금",
      zh: "流通中的现金 + 银行存放在央行的准备金",
      ja: "流通している現金 ＋ 銀行が中央銀行に預ける準備預金",
    },
    note: {
      en: "The only tier a central bank sets directly. QE expands it, QT shrinks it.",
      es: "El único nivel que el banco central fija directamente. La QE lo expande; la QT lo reduce.",
      ko: "중앙은행이 직접 조절하는 유일한 단계. 양적완화는 늘리고 양적긴축은 줄입니다.",
      zh: "唯一由央行直接决定的层级。量化宽松使其扩大，量化紧缩使其收缩。",
      ja: "中央銀行が直接決められる唯一の層。量的緩和で拡大し、量的引き締めで縮小します。",
    },
  },
  {
    key: "m1",
    name: { en: "M1 — Spendable today", es: "M1 — Gastable hoy", ko: "M1 — 오늘 쓸 수 있는 돈", zh: "M1 — 今天就能花的钱", ja: "M1 — 今日使えるお金" },
    contains: {
      en: "Cash held by the public + deposits available on demand",
      es: "Efectivo en manos del público + depósitos disponibles a la vista",
      ko: "민간이 보유한 현금 + 언제든 찾을 수 있는 예금",
      zh: "公众持有的现金 + 可随时支取的存款",
      ja: "民間が保有する現金 ＋ いつでも引き出せる預金",
    },
    note: {
      en: "Reserves are excluded — they cannot be spent in the real economy.",
      es: "Las reservas quedan excluidas: no pueden gastarse en la economía real.",
      ko: "지급준비금은 제외됩니다 — 실물 경제에서 쓸 수 없기 때문입니다.",
      zh: "不含准备金——它们无法在实体经济中支出。",
      ja: "準備預金は含みません——実体経済で使えないためです。",
    },
  },
  {
    key: "m2",
    name: { en: "M2 — M1 + near money", es: "M2 — M1 + cuasidinero", ko: "M2 — M1 + 준통화", zh: "M2 — M1 + 准货币", ja: "M2 — M1 ＋ 準通貨" },
    contains: {
      en: "M1 + small time deposits + retail money-market funds",
      es: "M1 + depósitos a plazo pequeños + fondos monetarios minoristas",
      ko: "M1 + 소액 정기예금 + 개인용 머니마켓펀드",
      zh: "M1 + 小额定期存款 + 零售货币市场基金",
      ja: "M1 ＋ 小口の定期預金 ＋ 個人向けMMF",
    },
    note: {
      en: "Mostly created when banks lend, not by the central bank.",
      es: "Se crea sobre todo cuando los bancos prestan, no por el banco central.",
      ko: "대부분 중앙은행이 아니라 은행이 대출할 때 만들어집니다.",
      zh: "其中大部分是银行放贷时创造的，而非央行创造。",
      ja: "その大部分は中央銀行ではなく、銀行が融資するときに生まれます。",
    },
  },
];

// The nesting is the part readers get wrong, so it is stated rather than
// implied by the layout: M1 sits inside M2, but the base does NOT sit inside
// either. Both contain physical cash; reserves belong only to the base. That
// asymmetry is why a central bank can expand the base a great deal without
// spendable money rising in step.
export const moneySupplyCaption = {
  en: "M1 sits inside M2. The base does not sit inside either — they share physical cash, but reserves count only in the base, which is why expanding it does not automatically add spendable money. Each central bank sets its own composition and has redefined it over time, so long historical comparisons need care.",
  es: "M1 está dentro de M2. La base no está dentro de ninguno de los dos: comparten el efectivo físico, pero las reservas solo cuentan en la base, y por eso expandirla no añade automáticamente dinero gastable. Cada banco central fija su propia composición y la ha redefinido con el tiempo, así que las comparaciones históricas largas requieren cuidado.",
  ko: "M1은 M2 안에 포함됩니다. 그러나 본원통화는 둘 중 어디에도 포함되지 않습니다 — 현금은 공유하지만 지급준비금은 본원통화에만 잡히기 때문입니다. 본원통화를 늘려도 쓸 수 있는 돈이 그만큼 늘지 않는 이유가 여기에 있습니다. 구성 항목은 중앙은행마다 다르고 시간이 지나며 재정의되어 왔으므로, 장기 비교에는 주의가 필요합니다.",
  zh: "M1包含在M2之内。基础货币则不属于两者中的任何一个——它们共有流通现金，但准备金只计入基础货币，这正是扩大基础货币并不会自动增加可花费货币的原因。各国央行对构成的界定不同，并随时间多次调整，因此长期历史比较需要谨慎。",
  ja: "M1はM2の中に含まれます。一方、マネタリーベースはそのどちらにも含まれません——現金は共通ですが、準備預金はベースにしか計上されないからです。ベースを拡大しても使えるお金が同じだけ増えるとは限らないのは、このためです。構成は中央銀行ごとに異なり、時代とともに再定義されてきたため、長期の比較には注意が必要です。",
};
