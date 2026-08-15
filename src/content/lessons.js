// ═══════════════════════════════════════════════════════════════════════════
// TRACKS
//
// The catalogue is two independent curricula, not one path. Until 2026-08-07
// they were a single sequential chain, which meant someone who installed a
// financial-literacy app to learn budgeting had to finish the long-term debt
// cycle, deleveraging, the yield curve and QE/QT first — ~24 minutes of macro
// theory before the first practical money lesson. That ordering was an
// artifact of build order (the macro lessons came from the original
// prototype; the money lessons were appended one per run chasing the §4.3
// lesson-count gate), never a teaching decision.
//
// `money` leads because it is the product (LAUNCH_PLAN.md §0: "how the
// economy works is the *vehicle*, not the product"). `economy` is optional
// context. Lessons unlock sequentially WITHIN a track and not across them.
//
// Order here is display order. Every lesson must declare a `track` matching
// one of these keys — `npm test` fails otherwise, so a future run adding a
// lesson can't silently leave it out of both tracks.
// ═══════════════════════════════════════════════════════════════════════════
export const TRACKS = [
  { key: "money", labelKey: "trackMoney", blurbKey: "trackMoneyBlurb" },
  { key: "economy", labelKey: "trackEconomy", blurbKey: "trackEconomyBlurb" },
];

/** Lessons belonging to `trackKey`, in id order. */
export function lessonsInTrack(trackKey, all = lessons) {
  return all.filter((l) => l.track === trackKey);
}

/**
 * Every lesson, reordered so whole tracks run in TRACKS order (money first).
 * The app uses this as its lesson list, so a lesson's position in it is also
 * its position on the Learn path.
 *
 * Ids were renumbered 2026-08-14 (backlog item 22) to match this order: money
 * is 1-28, economy is 29-40 — previously economy held 1-12 and money 13-40,
 * an artifact of build order (see the TRACKS comment above) that made a new
 * learner's first lesson display as "Lesson 13". The remap was scripted
 * (`.renumber-id-map.json`-style old→new table, not hand-edited) and covers
 * every place an id is stored or cited: this file's `id` field, `quizData.js`'s
 * `lesson` field, both `lessonContent.*.js` files' top-level keys,
 * `LessonVisual.jsx`'s `LESSON_VISUALS` map, every in-prose "Lesson N"
 * cross-reference in lesson body text (English only — the other four
 * languages don't carry these references), and
 * `scripts/translation-review-ledger.json`'s keys. A one-time client-side
 * migration (`src/lib/storage.js`) remaps any already-installed user's
 * persisted `ecycles_completed_lessons` ids on first load after this change,
 * so existing progress and unlock state survive the renumbering.
 */
export function lessonsByTrack(all = lessons) {
  return TRACKS.flatMap((tr) => lessonsInTrack(tr.key, all));
}

// ═══════════════════════════════════════════════════════════════════════════
// LESSON METADATA
//
// Split out of this file on 2026-08-07 (backlog item 23, chunk-size
// regression): this array now holds only what Learn/App need to render the
// path — id, track, icon, color, title, subtitle, and a precomputed `minutes`
// reading-time estimate. The actual lesson body (sections, takeaway,
// thinkAbout — the bulk of the old ~260KB file) moved to
// content/lessonContent.js, imported only by the lazy-loaded LessonReader
// screen. `minutes` is a snapshot of what estimateMinutes() used to compute
// live from that body text; scripts/check-data.mjs recomputes it from
// lessonContent.js and fails if the two drift, so a future run editing a
// lesson's body can't leave a stale estimate on the Learn list.
// ═══════════════════════════════════════════════════════════════════════════
export const lessons = [
  {
    id: 29, track: "economy", icon: "🔄", color: "#2563eb", minutes: 2,
    title: {"en":"Transactions: The Building Block","es":"Transacciones: El Pilar Fundamental","ko":"거래: 경제의 기본 단위","zh":"交易：经济的基石","ja":"取引：経済の基本単位"},
    subtitle: {"en":"Every time you buy something, you create a transaction","es":"Cada vez que compras algo, creas una transacción","ko":"무언가를 살 때마다 거래가 만들어집니다","zh":"每次购买都创造一笔交易","ja":"何かを買うたびに取引が生まれる"},
  },
  {
    id: 30, track: "economy", icon: "💳", color: "#7c3aed", minutes: 3,
    title: {"en":"Credit: The Most Important Part","es":"Crédito: La Parte Más Importante","ko":"신용: 가장 중요한 부분","zh":"信贷：最重要的部分","ja":"信用：最も重要な部分"},
    subtitle: {"en":"Credit is the biggest and most volatile part of the economy","es":"El crédito es la parte más grande y volátil de la economía","ko":"신용은 경제에서 가장 크고 변동성이 큰 부분입니다","zh":"信贷是经济中最大且最不稳定的部分","ja":"信用は経済で最大かつ最も変動が大きい部分"},
  },
  {
    id: 31, track: "economy", icon: "📈", color: "#059669", minutes: 2,
    title: {"en":"Productivity Growth: The Long-Run Driver","es":"Crecimiento de Productividad","ko":"생산성 성장: 장기 동력","zh":"生产力增长：长期驱动力","ja":"生産性成長：長期的な推進力"},
    subtitle: {"en":"What really matters in the long run","es":"Lo que realmente importa a largo plazo","ko":"장기적으로 정말 중요한 것","zh":"长期来看真正重要的是什么","ja":"長期的に本当に重要なこと"},
  },
  {
    id: 32, track: "economy", icon: "🔁", color: "#d97706", minutes: 3,
    title: {"en":"The Short-Term Debt Cycle","es":"El Ciclo de Deuda a Corto Plazo","ko":"단기 부채 순환","zh":"短期债务周期","ja":"短期債務サイクル"},
    subtitle: {"en":"5-8 years — the business cycle most people know","es":"5-8 años — el ciclo que la mayoría conoce","ko":"5-8년 — 대부분의 사람들이 아는 경기 순환","zh":"5-8年——大多数人熟知的经济周期","ja":"5-8年 — ほとんどの人が知る景気循環"},
  },
  {
    id: 33, track: "economy", icon: "🌊", color: "#dc2626", minutes: 3,
    title: {"en":"The Long-Term Debt Cycle","es":"El Ciclo de Deuda a Largo Plazo","ko":"장기 부채 순환","zh":"长期债务周期","ja":"長期債務サイクル"},
    subtitle: {"en":"75-100 years — the big wave underneath","es":"75-100 años — la gran ola debajo","ko":"75-100년 — 밑에 깔린 큰 파도","zh":"75-100年——潜藏的大浪","ja":"75-100年 — 底に潜む大きな波"},
  },
  {
    id: 34, track: "economy", icon: "🏗️", color: "#4f46e5", minutes: 3,
    title: {"en":"Deleveraging: The 4 Tools","es":"Desapalancamiento: Las 4 Herramientas","ko":"디레버리징: 4가지 도구","zh":"去杠杆：4大工具","ja":"デレバレッジング：4つの手段"},
    subtitle: {"en":"How economies deal with too much debt","es":"Cómo las economías manejan demasiada deuda","ko":"경제가 과다 부채를 다루는 방법","zh":"经济如何应对过多债务","ja":"経済が過大な借金にどう対処するか"},
  },
  {
    id: 35, track: "economy", icon: "💹", color: "#1e40af", minutes: 3,
    title: {"en":"Interest Rates: The Master Signal","es":"Tasas de Interés: La Señal Maestra","ko":"금리: 마스터 신호","zh":"利率：主导信号","ja":"金利：マスターシグナル"},
    subtitle: {"en":"How the Fed steers the economy","es":"Cómo el Fed dirige la economía","ko":"연준이 경제를 조종하는 방법","zh":"美联储如何引导经济","ja":"FRBが経済を舵取りする方法"},
  },
  {
    id: 36, track: "economy", icon: "📐", color: "#9333ea", minutes: 2,
    title: {"en":"The Yield Curve: Crystal Ball","es":"La Curva de Rendimiento: Bola de Cristal","ko":"수익률 곡선: 수정 구슬","zh":"收益率曲线：水晶球","ja":"イールドカーブ：水晶玉"},
    subtitle: {"en":"A historically reliable recession predictor since 1955","es":"Un predictor de recesión históricamente fiable desde 1955","ko":"1955년 이후 역사적으로 신뢰할 수 있는 경기침체 예측 지표","zh":"自1955年以来历史上较为可靠的衰退预测指标","ja":"1955年以来、歴史的に信頼性の高い景気後退予測指標"},
  },
  {
    id: 37, track: "economy", icon: "🏦", color: "#be185d", minutes: 3,
    title: {"en":"QE & QT: The Fed's Power Tools","es":"QE y QT: Las Herramientas del Fed","ko":"QE & QT: 연준의 강력한 도구","zh":"QE与QT：美联储的强力工具","ja":"QE & QT：FRBのパワーツール"},
    subtitle: {"en":"When rates at 0% aren't enough","es":"Cuando las tasas en 0% no son suficientes","ko":"0% 금리로도 충분하지 않을 때","zh":"当利率降到0%还不够时","ja":"金利0%でも不十分な時"},
  },
  {
    id: 38, track: "economy", icon: "🔄", color: "#059669", minutes: 3,
    title: {"en":"The 4 Phases of Economic Cycles","es":"Las 4 Fases del Ciclo Económico","ko":"경제 순환의 4단계","zh":"经济周期的4个阶段","ja":"経済サイクルの4つの局面"},
    subtitle: {"en":"Expansion → Peak → Contraction → Trough","es":"Expansión → Pico → Contracción → Valle","ko":"확장 → 정점 → 수축 → 저점","zh":"扩张 → 顶峰 → 收缩 → 低谷","ja":"拡大 → ピーク → 収縮 → 底"},
  },
  {
    id: 39, track: "economy", icon: "📊", color: "#b45309", minutes: 3,
    title: {"en":"Reading Economic Indicators","es":"Leyendo Indicadores Económicos","ko":"경제 지표 읽기","zh":"解读经济指标","ja":"経済指標を読む"},
    subtitle: {"en":"The dashboard of the economic machine","es":"El tablero de la máquina económica","ko":"경제 기계의 대시보드","zh":"经济机器的仪表板","ja":"経済マシンのダッシュボード"},
  },
  {
    id: 40, track: "economy", icon: "🎯", color: "#15803d", minutes: 2,
    title: {"en":"Three Rules of Thumb","es":"Tres Reglas de Oro","ko":"세 가지 경험 법칙","zh":"三条经验法则","ja":"3つの経験則"},
    subtitle: {"en":"A classic summary — simple but powerful","es":"Un resumen clásico — simple pero poderoso","ko":"고전적인 요약 — 간단하지만 강력합니다","zh":"经典总结——简单但强大","ja":"古典的な要約 — シンプルだが強力"},
  },
  {
    id: 1, track: "money", icon: "💵", color: "#0891b2", minutes: 3,
    title: {"en":"Budgeting: Know Where Your Money Goes","es":"Presupuesto: Sabe A Dónde Va Tu Dinero","ko":"예산 관리: 돈이 어디로 가는지 알기","zh":"预算：知道钱花去了哪里","ja":"予算管理：お金の流れを知る"},
    subtitle: {"en":"The foundation everything else builds on","es":"La base sobre la que se construye todo lo demás","ko":"다른 모든 것의 토대가 되는 기초","zh":"一切的基础","ja":"他のすべての土台となるもの"},
  },
  {
    id: 2, track: "money", icon: "🐷", color: "#ca8a04", minutes: 2,
    title: {"en":"Emergency Funds: Your Financial Shock Absorber","es":"Fondo de Emergencia: Tu Amortiguador Financiero","ko":"비상금: 재정적 충격 완화 장치","zh":"应急基金：你的财务缓冲垫","ja":"緊急資金：あなたの経済的ショック吸収装置"},
    subtitle: {"en":"Why 'save some money' isn't specific enough","es":"Por qué 'ahorra algo de dinero' no es suficientemente específico","ko":"'돈을 좀 모아라'가 왜 충분히 구체적이지 않은가","zh":"为什么“存点钱”这个建议还不够具体","ja":"「お金を貯めよう」だけでは不十分な理由"},
  },
  {
    id: 3, track: "money", icon: "🌱", color: "#16a34a", minutes: 3,
    title: {"en":"Compound Interest: Money That Makes Money","es":"Interés Compuesto: Dinero Que Genera Dinero","ko":"복리: 돈이 돈을 버는 원리","zh":"复利：让钱生钱","ja":"複利：お金がお金を生む仕組み"},
    subtitle: {"en":"Why starting early matters more than starting big","es":"Por qué empezar temprano importa más que empezar en grande","ko":"크게 시작하는 것보다 일찍 시작하는 것이 왜 더 중요한가","zh":"为什么早开始比多投入更重要","ja":"早く始めることが、大きく始めることより重要な理由"},
  },
  {
    id: 4, track: "money", icon: "🪪", color: "#ea580c", minutes: 3,
    title: {"en":"Credit Scores: Your Financial Reputation","es":"Puntaje de Crédito: Tu Reputación Financiera","ko":"신용점수: 당신의 금융 신용도","zh":"信用分数：你的财务信誉","ja":"クレジットスコア：あなたの金融上の信用"},
    subtitle: {"en":"A number that follows you into almost every big purchase","es":"Un número que te acompaña en casi cada compra grande","ko":"거의 모든 큰 구매를 따라다니는 숫자","zh":"几乎跟随你每一次大额购买的数字","ja":"ほぼすべての大きな買い物についてくる数字"},
  },
  {
    id: 5, track: "money", icon: "🧺", color: "#6d28d9", minutes: 3,
    title: {"en":"Stocks, Bonds & Diversification","es":"Acciones, Bonos y Diversificación","ko":"주식, 채권, 그리고 분산투자","zh":"股票、债券与分散投资","ja":"株式・債券・分散投資"},
    subtitle: {"en":"The building blocks of a portfolio, in plain language","es":"Los bloques básicos de una cartera, en lenguaje sencillo","ko":"쉬운 말로 풀어본 포트폴리오의 기본 구성 요소","zh":"用简单的话讲清楚投资组合的基本构件","ja":"ポートフォリオの基本要素を、わかりやすく"},
  },
  {
    id: 6, track: "money", icon: "🏖️", color: "#0d9488", minutes: 3,
    title: {"en":"Retirement Accounts: 401(k) and IRA Basics","es":"Cuentas de Jubilación: Fundamentos del 401(k) y el IRA","ko":"은퇴 계좌: 401(k)와 IRA 기초","zh":"退休账户：401(k)与IRA基础","ja":"退職口座：401(k)とIRAの基本"},
    subtitle: {"en":"Ordinary accounts with an unusual perk: the tax rules","es":"Cuentas comunes con una ventaja poco común: las reglas fiscales","ko":"특별한 혜택이 있는 평범한 계좌: 세금 규칙","zh":"普通账户里藏着不普通的福利：税收规则","ja":"普通の口座に隠された特典：税制優遇"},
  },
  {
    id: 7, track: "money", icon: "🧾", color: "#57534e", minutes: 3,
    title: {"en":"Taxes: How Your Paycheck Is Actually Taxed","es":"Impuestos: Cómo Se Grava Realmente Tu Sueldo","ko":"세금: 급여가 실제로 과세되는 방식","zh":"税收：你的薪水究竟是怎么被征税的","ja":"税金：あなたの給料は実際どう課税されるか"},
    subtitle: {"en":"Why a raise can never shrink your take-home pay","es":"Por qué un aumento nunca puede reducir tu sueldo neto","ko":"왜 급여 인상이 실수령액을 줄일 수 없는가","zh":"为什么加薪永远不会让到手工资变少","ja":"昇給が手取りを減らすことは絶対にない理由"},
  },
  {
    id: 8, track: "money", icon: "🛡️", color: "#0369a1", minutes: 3,
    title: {"en":"Insurance: Trading a Small Certain Cost for Protection from a Large Uncertain One","es":"Seguros: Cambiar un Costo Pequeño y Seguro por Protección Ante uno Grande e Incierto","ko":"보험: 작고 확실한 비용으로 크고 불확실한 손실을 막다","zh":"保险：用小额确定成本换取对大额不确定损失的保护","ja":"保険：小さく確実な費用で、大きく不確実な損失から身を守る"},
    subtitle: {"en":"Why paying a little every month can make sense even if you never file a claim","es":"Por qué pagar un poco cada mes puede tener sentido aunque nunca hagas un reclamo","ko":"한 번도 보험금을 청구하지 않아도 매달 조금씩 내는 것이 합리적인 이유","zh":"为什么即使从不理赔，每月支付一点钱也可能是合理的","ja":"一度も保険金を請求しなくても、毎月少し払う意味がある理由"},
  },
  {
    id: 9, track: "money", icon: "🛒", color: "#a21caf", minutes: 2,
    title: {"en":"Inflation and Your Money: Why a Growing Balance Isn't Always Growing Wealth","es":"La Inflación y Tu Dinero: Por Qué un Saldo Creciente No Siempre Es Más Riqueza","ko":"인플레이션과 내 돈: 잔고가 늘어도 부가 늘지 않을 수 있는 이유","zh":"通胀与你的钱：余额增长不一定等于财富增长","ja":"インフレとあなたのお金：残高が増えても富が増えるとは限らない理由"},
    subtitle: {"en":"The difference between the number in your account and what it can actually buy","es":"La diferencia entre el número en tu cuenta y lo que realmente puede comprar","ko":"계좌의 숫자와 그것이 실제로 살 수 있는 것의 차이","zh":"账户里的数字和它实际能买到的东西之间的差别","ja":"口座の数字と、それが実際に買えるものとの違い"},
  },
  {
    id: 10, track: "money", icon: "📋", color: "#78350f", minutes: 2,
    title: {"en":"W-2 vs. 1099: Why Your Tax Bill Changes With How You're Paid","es":"W-2 vs. 1099: Por Qué Tu Factura de Impuestos Cambia Según Cómo Te Pagan","ko":"W-2 vs. 1099: 받는 방식에 따라 세금 부담이 달라지는 이유","zh":"W-2与1099：为什么你的纳税方式取决于你如何被支付","ja":"W-2対1099：支払われ方によって税金が変わる理由"},
    subtitle: {"en":"The same income can owe very different taxes depending on whether you're an employee or a contractor","es":"El mismo ingreso puede deber impuestos muy distintos según seas empleado o contratista","ko":"같은 소득이라도 직원인지 계약자인지에 따라 세금 부담이 크게 달라질 수 있습니다","zh":"同样的收入，作为雇员和作为承包商所欠的税可能大不相同","ja":"同じ収入でも、従業員か契約者かによって税額は大きく変わり得る"},
  },
  {
    id: 11, track: "money", icon: "💸", color: "#be123c", minutes: 3,
    title: {"en":"Investment Fees: The Cost You Don't See on a Bill","es":"Comisiones de Inversión: El Costo Que No Ves en una Factura","ko":"투자 수수료: 청구서에 안 보이는 비용","zh":"投资费用：账单上看不到的成本","ja":"投資手数料：請求書に現れないコスト"},
    subtitle: {"en":"A 1% annual fee sounds tiny, but it compounds against you the same way interest compounds for you","es":"Una comisión anual del 1% suena pequeña, pero se compone en tu contra igual que el interés se compone a tu favor","ko":"연 1% 수수료는 작아 보이지만, 이자가 당신에게 유리하게 복리로 쌓이듯 수수료도 당신에게 불리하게 복리로 쌓입니다","zh":"年化1%的费用听起来很小，但它会像复利那样不利地累积，正如利息会像复利那样对你有利地累积","ja":"年1%の手数料は小さく聞こえますが、利息があなたに有利に複利で積み上がるのと同じように、手数料もあなたに不利に複利で積み上がります"},
  },
  {
    id: 12, track: "money", icon: "🏠", color: "#334155", minutes: 3,
    title: {"en":"Renting vs. Buying: The Real Trade-offs of a Home","es":"Alquilar vs. Comprar: Las Verdaderas Disyuntivas de una Vivienda","ko":"임대 vs. 매수: 주택의 진짜 트레이드오프","zh":"租房与购房：住房的真实权衡","ja":"賃貸か購入か：住宅の本当のトレードオフ"},
    subtitle: {"en":"A mortgage payment and a rent payment look similar, but they buy very different things","es":"Un pago de hipoteca y un pago de alquiler parecen similares, pero compran cosas muy distintas","ko":"주택담보대출 상환금과 월세는 비슷해 보이지만, 사는 것은 완전히 다릅니다","zh":"房贷月供和房租看起来相似，但它们买到的东西却大不相同","ja":"住宅ローンの返済と家賃の支払いは似ているようで、買っているものはまったく違います"},
  },
  {
    id: 13, track: "money", icon: "💼", color: "#0e7490", minutes: 4,
    title: {"en":"Brokerage Accounts: How Investing Actually Works Mechanically","es":"Cuentas de Corretaje: Cómo Funciona Realmente Invertir","ko":"증권 계좌: 투자가 실제로 작동하는 방식","zh":"券商账户：投资到底是如何运作的","ja":"証券口座：投資は実際どう機能するのか"},
    subtitle: {"en":"A brokerage account is a container, not an investment by itself","es":"Una cuenta de corretaje es un contenedor, no una inversión en sí misma","ko":"증권 계좌는 그 자체로 투자가 아니라 담는 그릇일 뿐입니다","zh":"券商账户只是一个容器，本身并不是投资","ja":"証券口座はそれ自体が投資ではなく、あくまで入れ物です"},
  },
  {
    id: 14, track: "money", icon: "📜", color: "#4c1d95", minutes: 3,
    title: {"en":"Estate Planning Basics: Wills and Beneficiary Designations","es":"Fundamentos de Planificación Patrimonial: Testamentos y Designaciones de Beneficiario","ko":"상속 계획의 기초: 유언장과 수익자 지정","zh":"遗产规划基础：遗嘱与受益人指定","ja":"遺産計画の基本：遺言書と受取人指定"},
    subtitle: {"en":"A will decides less than most people think — beneficiary forms often decide more","es":"Un testamento decide menos de lo que la mayoría piensa — los formularios de beneficiario suelen decidir más","ko":"유언장이 결정하는 것은 생각보다 적고, 수익자 양식이 더 많이 결정합니다","zh":"遗嘱能决定的比大多数人想的要少——受益人表格往往决定得更多","ja":"遺言書が決めることは多くの人が思うより少なく、受取人フォームの方が決めることが多い"},
  },
  {
    id: 15, track: "money", icon: "📇", color: "#7c2d12", minutes: 3,
    title: {"en":"Credit Reports vs. Credit Scores: What's the Difference?","es":"Informes de Crédito vs. Puntajes de Crédito: ¿Cuál es la Diferencia?","ko":"신용 보고서와 신용 점수: 무엇이 다른가?","zh":"信用报告与信用评分：有什么区别？","ja":"信用報告書と信用スコア：その違いとは？"},
    subtitle: {"en":"A report is a record; a score is a number calculated from it — and that means everyone has more than one score","es":"Un informe es un registro; un puntaje es un número calculado a partir de él — lo que significa que todos tienen más de un puntaje","ko":"보고서는 기록이고 점수는 그것으로 계산된 숫자입니다 — 즉 누구나 하나 이상의 점수를 가집니다","zh":"报告是记录，评分是根据记录计算出的数字——这意味着每个人都不止一个信用评分","ja":"報告書は記録であり、スコアはそこから計算される数字です——つまり誰もが複数のスコアを持っています"},
  },
  {
    id: 16, track: "money", icon: "🧭", color: "#15803d", minutes: 4,
    title: {"en":"Does It Put Money In Your Pocket, or Take It Out?","es":"¿Te Mete Dinero en el Bolsillo, o Te lo Saca?","ko":"내 주머니에 돈을 넣어주는가, 빼가는가?","zh":"它是把钱放进你的口袋，还是拿走？","ja":"それは財布にお金を入れるのか、持ち出すのか？"},
    subtitle: {"en":"Two purchases can feel identical at the register and turn out to be opposites years later","es":"Dos compras pueden sentirse idénticas al pagar y ser opuestas años después","ko":"계산대에서는 똑같이 느껴진 두 소비가 몇 년 뒤에는 정반대일 수 있습니다","zh":"两笔在收银台感觉完全一样的消费，几年后可能截然相反","ja":"レジでは同じに感じた2つの買い物が、数年後には正反対になることがあります"},
  },
  {
    id: 17, track: "money", icon: "📈", color: "#b45309", minutes: 4,
    title: {"en":"Where Did the Raise Go?","es":"¿A Dónde Se Fue el Aumento?","ko":"오른 월급은 어디로 갔을까?","zh":"加的薪水去哪儿了？","ja":"昇給はどこへ消えたのか？"},
    subtitle: {"en":"Why earning more so often doesn't feel like more — and what the gap between earning and spending actually decides","es":"Por qué ganar más tantas veces no se siente como más — y qué decide realmente la brecha entre ganar y gastar","ko":"더 버는데도 더 번 것 같지 않은 이유 — 그리고 버는 것과 쓰는 것의 격차가 실제로 결정하는 것","zh":"为什么赚得更多却常常感觉不到——以及赚与花之间的差额究竟决定了什么","ja":"収入が増えても増えた気がしない理由 — そして稼ぎと支出の差が実際に決めていること"},
  },
  {
    id: 18, track: "money", icon: "⚖️", color: "#0f766e", minutes: 4,
    title: {"en":"What Did That Really Cost You?","es":"¿Qué Te Costó Eso Realmente?","ko":"그건 정말로 얼마짜리였을까?","zh":"那真的花了你多少？","ja":"それは本当は、いくらだったのか？"},
    subtitle: {"en":"The price tag only shows half of what a choice costs — the other half is invisible until later","es":"La etiqueta de precio solo muestra la mitad de lo que cuesta una elección — la otra mitad es invisible hasta después","ko":"가격표는 선택의 절반만 보여줍니다 — 나머지 절반은 나중에야 보입니다","zh":"价签只显示了一个选择的一半代价——另一半要等到以后才看得见","ja":"値札は選択のコストの半分しか見せてくれません——残りの半分は後になるまで見えません"},
  },
  {
    id: 19, track: "money", icon: "🕳️", color: "#9f1239", minutes: 4,
    title: {"en":"Throwing Good Money After Bad","es":"Tirar Dinero Bueno Detrás del Malo","ko":"밑 빠진 독에 물 붓기","zh":"往坏钱里再砸好钱","ja":"悪いお金の後を良いお金で追いかける"},
    subtitle: {"en":"Money already spent is gone either way — the only real question is what to do next","es":"El dinero ya gastado se fue de cualquier forma — la única pregunta real es qué hacer ahora","ko":"이미 쓴 돈은 어차피 돌아오지 않습니다 — 진짜 질문은 지금부터 무엇을 할 것인가입니다","zh":"钱已经花了，无论如何都拿不回来了——真正的问题是接下来该怎么办","ja":"すでに使ったお金はどのみち戻ってきません——本当の問いは、これからどうするかです"},
  },
  {
    id: 20, track: "money", icon: "🐑", color: "#c2410c", minutes: 4,
    title: {"en":"Everyone Can't Be Wrong — Can They?","es":"Tanta Gente No Puede Estar Equivocada, ¿Verdad?","ko":"다들 하는데, 설마 틀렸을까?","zh":"大家都在买，难道会错吗？","ja":"みんなが買っているなら、間違っているはずがない？"},
    subtitle: {"en":"The fear of missing out feels like information. Usually, it's just a crowd moving together.","es":"El miedo a quedarte fuera se siente como información. Casi siempre, es solo una multitud moviéndose junta.","ko":"놓칠까 봐 두려운 마음은 정보처럼 느껴지지만, 대개는 그저 무리가 함께 움직이는 것일 뿐입니다.","zh":"害怕错过的感觉像是一种信息，但它通常只是人群在一起行动。","ja":"取り残される恐怖は情報のように感じられますが、たいていはただ群衆が一緒に動いているだけです。"},
  },
  {
    id: 21, track: "money", icon: "⚓", color: "#5b21b6", minutes: 3,
    title: {"en":"Was That Really a Bargain?","es":"¿De Verdad Era una Ganga?","ko":"그거, 정말 싸게 산 거였을까?","zh":"那真的是个划算的价格吗？","ja":"それは本当にお得だったのか？"},
    subtitle: {"en":"The number crossed out above the price you paid does more to shape what feels fair than the price itself.","es":"El número tachado arriba del precio que pagaste hace más para definir lo que se siente justo que el precio en sí.","ko":"가격 위에 그어진 원래 가격 숫자가, 실제로 낸 가격보다 더 크게 '적정하다'는 느낌을 만들어냅니다.","zh":"价格上方那个被划掉的数字，比你实际付的价格更能左右你觉得“公平”的感觉。","ja":"価格の上に線を引かれた数字は、実際に支払った価格そのものよりも、何が「妥当」に感じられるかを左右します。"},
  },
  {
    id: 22, track: "money", icon: "🔍", color: "#0c4a6e", minutes: 3,
    title: {"en":"Are You Checking, or Just Confirming?","es":"¿Estás Comprobando, o Solo Confirmando?","ko":"확인하고 있나요, 아니면 그냥 확인받고 있나요?","zh":"你是在核实，还是只是在确认？","ja":"確かめているのか、それとも確認しているだけなのか？"},
    subtitle: {"en":"Once you've made a decision, your mind gets much better at finding reasons you were right than at noticing reasons you might be wrong.","es":"Una vez que has tomado una decisión, tu mente se vuelve mucho mejor para encontrar razones de que tenías razón que para notar razones de que podrías estar equivocado.","ko":"일단 결정을 내리고 나면, 우리 마음은 자신이 틀렸을 수도 있다는 이유를 알아차리는 것보다 자신이 옳았다는 이유를 찾아내는 데 훨씬 능숙해집니다.","zh":"一旦你做出了决定，比起注意到自己可能错了的理由，你的大脑会更擅长找到证明自己是对的的理由。","ja":"一度決断を下すと、あなたの心は、自分が間違っているかもしれない理由に気づくことよりも、自分が正しかった理由を見つけることの方がずっと得意になります。"},
  },
  {
    id: 23, track: "money", icon: "⏳", color: "#4338ca", minutes: 3,
    title: {"en":"Why 'Later' Never Feels as Real as 'Now'","es":"Por Qué 'Luego' Nunca Se Siente Tan Real Como 'Ahora'","ko":"왜 '나중'은 '지금'만큼 실감 나지 않을까?","zh":"为什么“以后”从来不像“现在”那样真实？","ja":"なぜ「あとで」は「今」ほど現実に感じられないのか"},
    subtitle: {"en":"The same choice can flip depending on whether the reward is available today or has to wait — even when the math never changes.","es":"La misma elección puede cambiar según si la recompensa está disponible hoy o tiene que esperar — incluso cuando las matemáticas nunca cambian.","ko":"수학은 전혀 달라지지 않는데도, 보상이 오늘 당장인지 나중에 받아야 하는지에 따라 같은 선택이 뒤집힐 수 있습니다.","zh":"即便数字从未改变，同一个选择也会因为奖励是今天就能拿到、还是要等，而发生反转。","ja":"報酬が今すぐ手に入るか、待たなければならないかによって、計算は何も変わらないのに同じ選択がひっくり返ることがあります。"},
  },
  {
    id: 24, track: "money", icon: "🛍️", color: "#a16207", minutes: 2,
    title: {"en":"Is That a Need — Or Just a Want Wearing a Disguise?","es":"¿Eso Es una Necesidad — o Solo un Deseo Disfrazado?","ko":"그건 필요일까, 아니면 필요로 위장한 욕구일까?","zh":"那是需要，还是披着需要外衣的想要？","ja":"それは必要なのか、それとも必要という仮面をかぶった欲しいものなのか？"},
    subtitle: {"en":"The label doesn't change what happens to your money when you say yes — but it changes whether you ever ask the question at all.","es":"La etiqueta no cambia lo que le pasa a tu dinero cuando dices que sí — pero cambia si alguna vez te haces la pregunta.","ko":"이름표가 바뀐다고 해서 '예'라고 답했을 때 돈에 일어나는 일이 달라지진 않습니다 — 다만 애초에 그 질문을 던지는지 여부가 달라질 뿐입니다.","zh":"标签的改变不会改变你说“好”之后钱包发生的事——但它会决定你到底有没有问过自己那个问题。","ja":"ラベルが変わっても、「はい」と答えたときにお金に起こることは変わりません——変わるのは、そもそもその問いを自分に投げかけるかどうかです。"},
  },
  {
    id: 25, track: "money", icon: "🌉", color: "#065f46", minutes: 3,
    title: {"en":"Does This Money Need to Be There Tomorrow, or Can It Wait Ten Years?","es":"¿Este Dinero Debe Estar Disponible Mañana, o Puede Esperar Diez Años?","ko":"이 돈은 내일 필요한가요, 아니면 10년을 기다릴 수 있나요?","zh":"这笔钱是明天就要用，还是能等上十年？","ja":"このお金は明日必要なのか、それとも十年待てるのか？"},
    subtitle: {"en":"Saving and investing aren't rivals fighting over the same dollar — the judgment call is figuring out which job a given dollar actually has, before deciding where it goes.","es":"Ahorrar e invertir no compiten por el mismo dólar — el criterio está en descubrir qué trabajo tiene realmente ese dólar antes de decidir dónde ponerlo.","ko":"저축과 투자는 같은 돈을 두고 경쟁하는 관계가 아닙니다 — 판단은 그 돈이 어디로 갈지 정하기 전에, 그 돈이 실제로 어떤 역할을 맡고 있는지 알아내는 것입니다.","zh":"储蓄和投资并不是在争夺同一笔钱——真正的判断，是在决定钱放在哪之前，先弄清楚这笔钱到底该干什么活。","ja":"貯めることと投資することは、同じ1ドルを取り合うライバルではありません——判断とは、そのお金をどこに置くか決める前に、そのお金が実際にどんな役目を持っているのかを見極めることです。"},
  },
  {
    id: 26, track: "money", icon: "🏷️", color: "#be185d", minutes: 3,
    title: {"en":"Is 'Found' Money Worth Less Than Money You Earned?","es":"¿Vale Menos el Dinero 'Encontrado' que el Dinero que Ganaste Trabajando?","ko":"'공돈'은 일해서 번 돈보다 가치가 덜할까?","zh":"“意外之财”真的不如“辛苦赚来的钱”值钱吗？","ja":"「棚から落ちてきたお金」は、働いて稼いだお金より価値が低いのか？"},
    subtitle: {"en":"A dollar buys the same thing no matter where it came from — but the story you tell about where it came from quietly changes what you do with it.","es":"Un dólar compra lo mismo sin importar de dónde vino — pero la historia que te cuentas sobre su origen cambia en silencio lo que haces con él.","ko":"돈이 어디서 왔든 1달러는 똑같은 것을 살 수 있지만, 그 돈이 어디서 왔는지에 대해 스스로에게 하는 이야기는 조용히 당신이 그 돈으로 무엇을 하는지를 바꿉니다.","zh":"不管钱从哪儿来，一块钱能买到的东西都一样——但你对它来源讲的那个故事，会悄悄改变你如何花它。","ja":"お金がどこから来たとしても、1ドルは同じものを買えます——けれど、その出どころについて自分に語る物語が、静かにそのお金の使い道を変えてしまいます。"},
  },
  {
    id: 27, track: "money", icon: "💔", color: "#b91c1c", minutes: 3,
    title: {"en":"Why Does Losing $50 Hurt More Than Finding $50 Feels Good?","es":"¿Por Qué Perder $50 Duele Más Que Encontrar $50 se Siente Bien?","ko":"왜 50달러를 잃는 것이 50달러를 줍는 것보다 더 아플까?","zh":"为什么损失50美元比捡到50美元更让人难受？","ja":"なぜ50ドルを失うことは、50ドルを拾うことよりも辛いのか？"},
    subtitle: {"en":"The pain of a loss and the pleasure of an equal gain aren't mirror images of each other — and that lopsided math quietly shapes decisions where the dollar amounts are supposed to be the only thing that matters.","es":"El dolor de una pérdida y el placer de una ganancia equivalente no son imágenes especulares el uno del otro — y esa aritmética desigual moldea en silencio decisiones en las que se supone que solo importan las cifras.","ko":"손실의 고통과 그와 같은 크기의 이득이 주는 기쁨은 서로 거울처럼 대칭을 이루지 않습니다 — 그리고 이 기울어진 셈법은 오직 금액만이 중요해야 할 결정들을 조용히 좌우합니다.","zh":"同样大小的损失带来的痛苦和收益带来的快乐并不是彼此的镜像——而这种不对称的算法，正悄悄左右着那些本该只看金额大小的决定。","ja":"同じ大きさの損失がもたらす痛みと利益がもたらす喜びは、互いの鏡像ではありません——そしてこの偏った計算が、本来なら金額だけが問題であるはずの決断を、静かに左右しています。"},
  },
  {
    id: 28, track: "money", icon: "🎰", color: "#7e22ce", minutes: 3,
    title: {"en":"Does One Lucky Win Prove You Have a System?","es":"¿Una Sola Victoria de Suerte Demuestra que Tienes un Sistema?","ko":"한 번의 운 좋은 승리가 '체계'가 있다는 증거가 될까?","zh":"一次幸运的成功，能证明你真的有一套方法吗？","ja":"一度の幸運な成功は、あなたに「システム」があることの証拠になるのか？"},
    subtitle: {"en":"A win that came mostly from luck feels identical, in the moment, to a win that came from skill — and that felt-the-same quality is exactly what makes people mistake the first for the second.","es":"Una victoria que vino principalmente de la suerte se siente idéntica, en el momento, a una victoria que vino de la habilidad — y esa cualidad de sentirse igual es exactamente lo que hace que la gente confunda la primera con la segunda.","ko":"주로 운에서 비롯된 승리는 그 순간에는 실력에서 비롯된 승리와 똑같이 느껴집니다 — 그리고 바로 그 '똑같이 느껴지는' 성질 때문에 사람들은 전자를 후자로 착각하게 됩니다.","zh":"在当下，一次主要靠运气得来的成功，感觉起来和一次靠实力得来的成功一模一样——正是这种“感觉一样”的特质，让人把前者误认成了后者。","ja":"主に運によってもたらされた成功は、その瞬間には、実力によってもたらされた成功とまったく同じように感じられます——そして、この「同じように感じられる」という性質こそが、人々に前者を後者と勘違いさせるのです。"},
  },
];
