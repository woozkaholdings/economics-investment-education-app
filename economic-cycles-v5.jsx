import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ECONOMIC CYCLES v5 — Step-by-Step Lessons + Bottom Tabs
// Inspired by principles popularized by economists and investors
// ═══════════════════════════════════════════════════════════════

// ─── TRANSLATIONS (5 Languages) ───
const TR = {
  en: {
    appTitle: "Economic Cycles", appSub: "Master the Economy",
    langLabel: "Language",
    // Bottom tabs
    tabHome: "Home", tabLearn: "Learn", tabMarkets: "Markets", tabMore: "More",
    // Home
    welcomeTitle: "Welcome to Economic Cycles",
    welcomeSub: "Learn how the economy really works — step by step",
    continueLesson: "Continue Learning", startLesson: "Start Learning",
    lessonsCompleted: "Lessons Completed", totalLessons: "Total Lessons",
    featuredInsight: "Featured Insight",
    heroInsight: "Think of the economy as a machine built from a few simple parts: transactions. Millions of them, repeating every day, add up to booms, busts, and everything in between.",
    disclaimer: "Educational content only — not personalized investment, legal, or tax advice. Markets carry risk; past patterns don't guarantee future results.",
    // Learn
    lessonLabel: "Lesson", ofLabel: "of", completeLabel: "Complete!",
    nextLesson: "Next Lesson", prevLesson: "Previous", markComplete: "Mark Complete",
    keyTakeaway: "Key Takeaway", tryThinking: "Think About This",
    locked: "Complete previous lessons first",
    // Markets
    marketsTitle: "Market Dashboard", currentState: "Illustrative Scenario",
    scenarioNote: "For teaching purposes — not live market data", rateTitle: "Interest Rates",
    rateHow: "How Rate Changes Affect Assets",
    ratesRising: "Rates ↑", ratesFalling: "Rates ↓",
    yieldCurveLabel: "Yield Curve Shapes",
    curveNormal: "Normal (Healthy)", curveFlat: "Flat (Warning)",
    curveInverted: "Inverted (Danger)", curveSteep: "Steep (Recovery)",
    // More
    quizTitle: "Test Your Knowledge", quizStart: "Start Quiz", quizNext: "Next",
    quizFinish: "See Results", quizCorrect: "Correct!", quizWrong: "Not quite.",
    quizScore: "Your Score", quizTryAgain: "Try Again", quizExplain: "Explanation",
    kidsTitle: "Teach Your Kids About Money", kidsAges58: "Ages 5-8", kidsAges912: "Ages 9-12",
    kidsAges1317: "Ages 13-17", kidsParentTip: "Parent Tip", kidsActivity: "Try This Activity",
    kidsParentIntro: "A parent's guide — pick your child's age band, then read and share these explanations together.",
    glossTitle: "Glossary", glossSearch: "Search terms...",
    expansion: "Expansion", peak: "Peak", contraction: "Contraction", trough: "Trough",
    expDesc: "Economy grows. GDP rises, jobs created, confidence builds.",
    peakDesc: "Maximum output. Growth stalling, inflation at highs.",
    contDesc: "Economy shrinks. GDP falls, unemployment rises.",
    troughDesc: "Economy bottoms. Seeds of next recovery planted.",
    indicators: "Key Indicators", bestInvest: "Best Investments", avoidInvest: "Avoid",
    psychology: "Psychology", why: "Why This Works",
    balanceSheet: "Fed Balance Sheet",
    qeLabel: "Quantitative Easing (QE)", qtLabel: "Quantitative Tightening (QT)",
    ratePrinciples: "Key Principles",
    kidsTabLabel: "Kids", quizTabLabel: "Quiz", questionsLabel: "questions",
    viewAllLessonsTemplate: "View all {n} lessons →",
    qeNarrative: "Fed BUYS bonds → money in → yields ↓ → stocks ↑↑ → USD ↓",
    qtNarrative: "Fed STOPS buying → money out → yields ↑ → stocks ↓ → USD ↑",
    aboutTabLabel: "About", aboutTitle: "About This App",
    aboutBody: "Economic Cycles teaches how economic cycles, interest rates, and market phases work, using historical patterns and principles popularized by economists and investors. It is an educational tool only — it doesn't collect accounts or personal data, and nothing in it is personalized investment, legal, or tax advice.",
    firstLaunchTitle: "Welcome to Economic Cycles", firstLaunchOk: "Got it, let's start",
  },
  es: {
    appTitle: "Ciclos Económicos", appSub: "Domina la Economía",
    langLabel: "Idioma",
    tabHome: "Inicio", tabLearn: "Aprender", tabMarkets: "Mercados", tabMore: "Más",
    welcomeTitle: "Bienvenido a Ciclos Económicos",
    welcomeSub: "Aprende cómo funciona la economía — paso a paso",
    continueLesson: "Continuar", startLesson: "Empezar",
    lessonsCompleted: "Lecciones Completadas", totalLessons: "Total",
    featuredInsight: "Idea Destacada",
    heroInsight: "Piensa en la economía como una máquina hecha de pocas partes simples: transacciones. Millones de ellas, repitiéndose cada día, forman los auges y las caídas.",
    disclaimer: "Solo contenido educativo — no es asesoría de inversión, legal ni fiscal personalizada. Los mercados conllevan riesgo; los patrones pasados no garantizan resultados futuros.",
    lessonLabel: "Lección", ofLabel: "de", completeLabel: "¡Completo!",
    nextLesson: "Siguiente", prevLesson: "Anterior", markComplete: "Completar",
    keyTakeaway: "Punto Clave", tryThinking: "Piensa en Esto",
    locked: "Completa las lecciones anteriores primero",
    marketsTitle: "Panel de Mercados", currentState: "Escenario Ilustrativo",
    scenarioNote: "Con fines educativos — no son datos de mercado en vivo", rateTitle: "Tasas de Interés",
    rateHow: "Cómo los Cambios Afectan los Activos",
    ratesRising: "Tasas ↑", ratesFalling: "Tasas ↓",
    yieldCurveLabel: "Formas de la Curva",
    curveNormal: "Normal (Saludable)", curveFlat: "Plana (Advertencia)",
    curveInverted: "Invertida (Peligro)", curveSteep: "Empinada (Recuperación)",
    quizTitle: "Pon a Prueba tu Conocimiento", quizStart: "Iniciar", quizNext: "Siguiente",
    quizFinish: "Ver Resultados", quizCorrect: "¡Correcto!", quizWrong: "No exactamente.",
    quizScore: "Tu Puntuación", quizTryAgain: "Intentar de Nuevo", quizExplain: "Explicación",
    kidsTitle: "Enseña Economía a tus Hijos", kidsAges58: "5-8 años", kidsAges912: "9-12 años",
    kidsAges1317: "13-17 años", kidsParentTip: "Consejo para Padres", kidsActivity: "Prueba Esta Actividad",
    kidsParentIntro: "Una guía para padres — elige la banda de edad de tu hijo y lean juntos estas explicaciones.",
    glossTitle: "Glosario", glossSearch: "Buscar términos...",
    expansion: "Expansión", peak: "Pico", contraction: "Contracción", trough: "Valle",
    expDesc: "La economía crece. El PIB sube, se crean empleos.",
    peakDesc: "Producción máxima. Crecimiento estancado, inflación alta.",
    contDesc: "La economía se contrae. El PIB baja, sube el desempleo.",
    troughDesc: "La economía toca fondo. Se plantan semillas de recuperación.",
    indicators: "Indicadores Clave", bestInvest: "Mejores Inversiones", avoidInvest: "Evitar",
    psychology: "Psicología", why: "Por Qué Funciona",
    balanceSheet: "Balance del Fed",
    qeLabel: "Flexibilización Cuantitativa (QE)", qtLabel: "Ajuste Cuantitativo (QT)",
    ratePrinciples: "Principios Clave",
    kidsTabLabel: "Niños", quizTabLabel: "Cuestionario", questionsLabel: "preguntas",
    viewAllLessonsTemplate: "Ver las {n} lecciones →",
    qeNarrative: "El Fed COMPRA bonos → entra dinero → rendimientos ↓ → acciones ↑↑ → USD ↓",
    qtNarrative: "El Fed DEJA de comprar → sale dinero → rendimientos ↑ → acciones ↓ → USD ↑",
    aboutTabLabel: "Acerca de", aboutTitle: "Acerca de esta App",
    aboutBody: "Ciclos Económicos enseña cómo funcionan los ciclos económicos, las tasas de interés y las fases del mercado, usando patrones históricos y principios popularizados por economistas e inversores. Es solo una herramienta educativa — no recopila cuentas ni datos personales, y nada en ella es asesoría de inversión, legal o fiscal personalizada.",
    firstLaunchTitle: "Bienvenido a Ciclos Económicos", firstLaunchOk: "Entendido, empecemos",
  },
  ko: {
    appTitle: "경제 순환", appSub: "경제를 마스터하세요",
    langLabel: "언어",
    tabHome: "홈", tabLearn: "학습", tabMarkets: "시장", tabMore: "더보기",
    welcomeTitle: "경제 순환에 오신 것을 환영합니다",
    welcomeSub: "경제가 실제로 어떻게 작동하는지 단계별로 배우세요",
    continueLesson: "학습 계속하기", startLesson: "학습 시작",
    lessonsCompleted: "완료한 레슨", totalLessons: "전체 레슨",
    featuredInsight: "주요 인사이트",
    heroInsight: "경제를 몇 가지 단순한 부분으로 이루어진 기계라고 생각해보세요: 바로 거래입니다. 매일 반복되는 수백만 건의 거래가 호황과 불황을 만들어냅니다.",
    disclaimer: "교육용 콘텐츠입니다 — 개인 맞춤형 투자·법률·세무 조언이 아닙니다. 시장에는 위험이 따르며 과거 패턴이 미래 결과를 보장하지 않습니다.",
    lessonLabel: "레슨", ofLabel: "/", completeLabel: "완료!",
    nextLesson: "다음 레슨", prevLesson: "이전", markComplete: "완료하기",
    keyTakeaway: "핵심 포인트", tryThinking: "생각해보세요",
    locked: "이전 레슨을 먼저 완료하세요",
    marketsTitle: "시장 대시보드", currentState: "예시 시나리오",
    scenarioNote: "교육 목적입니다 — 실시간 시장 데이터가 아닙니다", rateTitle: "금리",
    rateHow: "금리 변동이 자산에 미치는 영향",
    ratesRising: "금리 ↑", ratesFalling: "금리 ↓",
    yieldCurveLabel: "수익률 곡선 형태",
    curveNormal: "정상 (건강)", curveFlat: "평탄 (경고)",
    curveInverted: "역전 (위험)", curveSteep: "가파름 (회복)",
    quizTitle: "지식을 테스트하세요", quizStart: "퀴즈 시작", quizNext: "다음",
    quizFinish: "결과 보기", quizCorrect: "정답!", quizWrong: "아쉽네요.",
    quizScore: "당신의 점수", quizTryAgain: "다시 시도", quizExplain: "설명",
    kidsTitle: "자녀에게 경제 가르치기", kidsAges58: "5-8세", kidsAges912: "9-12세",
    kidsAges1317: "13-17세", kidsParentTip: "부모 팁", kidsActivity: "이 활동을 해보세요",
    kidsParentIntro: "부모를 위한 가이드입니다 — 자녀의 연령대를 선택한 후, 이 설명을 함께 읽어보세요.",
    glossTitle: "용어집", glossSearch: "용어 검색...",
    expansion: "확장기", peak: "정점", contraction: "수축기", trough: "저점",
    expDesc: "경제가 성장합니다. GDP 상승, 일자리 창출, 신뢰 형성.",
    peakDesc: "최대 생산량. 성장 둔화, 높은 인플레이션.",
    contDesc: "경제가 수축합니다. GDP 하락, 실업률 상승.",
    troughDesc: "경제가 바닥을 칩니다. 다음 회복의 씨앗이 뿌려집니다.",
    indicators: "핵심 지표", bestInvest: "최적 투자", avoidInvest: "피할 것",
    psychology: "심리", why: "이 전략이 효과적인 이유",
    balanceSheet: "연준 대차대조표",
    qeLabel: "양적완화 (QE)", qtLabel: "양적긴축 (QT)",
    ratePrinciples: "핵심 원칙",
    kidsTabLabel: "키즈", quizTabLabel: "퀴즈", questionsLabel: "문항",
    viewAllLessonsTemplate: "{n}개 레슨 모두 보기 →",
    qeNarrative: "연준 채권 매입 → 자금 유입 → 수익률 ↓ → 주식 ↑↑ → 달러 ↓",
    qtNarrative: "연준 매입 중단 → 자금 유출 → 수익률 ↑ → 주식 ↓ → 달러 ↑",
    aboutTabLabel: "정보", aboutTitle: "앱 정보",
    aboutBody: "경제 순환은 경제학자와 투자자들이 널리 알린 원칙과 역사적 패턴을 바탕으로 경제 순환, 금리, 시장 단계가 어떻게 작동하는지 가르치는 교육용 앱입니다. 계정이나 개인 데이터를 수집하지 않으며, 이 앱의 어떤 내용도 개인 맞춤형 투자·법률·세무 조언이 아닙니다.",
    firstLaunchTitle: "경제 순환에 오신 것을 환영합니다", firstLaunchOk: "확인했어요, 시작할게요",
  },
  zh: {
    appTitle: "经济周期", appSub: "掌握经济运行",
    langLabel: "语言",
    tabHome: "首页", tabLearn: "学习", tabMarkets: "市场", tabMore: "更多",
    welcomeTitle: "欢迎来到经济周期",
    welcomeSub: "一步步学习经济如何运作",
    continueLesson: "继续学习", startLesson: "开始学习",
    lessonsCompleted: "已完成课程", totalLessons: "总课程",
    featuredInsight: "精选见解",
    heroInsight: "把经济想象成由几个简单部分构成的机器：交易。每天重复发生的数百万笔交易，造就了繁荣与衰退。",
    disclaimer: "仅供教育用途 — 不构成个性化投资、法律或税务建议。市场存在风险，过去的规律不保证未来的结果。",
    lessonLabel: "课程", ofLabel: "/", completeLabel: "完成！",
    nextLesson: "下一课", prevLesson: "上一课", markComplete: "标记完成",
    keyTakeaway: "关键要点", tryThinking: "想一想",
    locked: "请先完成之前的课程",
    marketsTitle: "市场仪表板", currentState: "示例场景",
    scenarioNote: "仅供教学用途——非实时市场数据", rateTitle: "利率",
    rateHow: "利率变化如何影响资产",
    ratesRising: "利率 ↑", ratesFalling: "利率 ↓",
    yieldCurveLabel: "收益率曲线形态",
    curveNormal: "正常（健康）", curveFlat: "平坦（警告）",
    curveInverted: "倒挂（危险）", curveSteep: "陡峭（复苏）",
    quizTitle: "测试你的知识", quizStart: "开始", quizNext: "下一题",
    quizFinish: "查看结果", quizCorrect: "正确！", quizWrong: "不太对。",
    quizScore: "你的分数", quizTryAgain: "再试一次", quizExplain: "解释",
    kidsTitle: "教孩子学经济", kidsAges58: "5-8岁", kidsAges912: "9-12岁",
    kidsAges1317: "13-17岁", kidsParentTip: "家长提示", kidsActivity: "试试这个活动",
    kidsParentIntro: "家长指南——选择孩子的年龄段，然后一起阅读这些讲解。",
    glossTitle: "术语表", glossSearch: "搜索术语...",
    expansion: "扩张期", peak: "顶峰", contraction: "收缩期", trough: "低谷",
    expDesc: "经济增长。GDP上升，就业增加，信心增强。",
    peakDesc: "产出最大化。增长停滞，通胀高位。",
    contDesc: "经济收缩。GDP下降，失业率上升。",
    troughDesc: "经济触底。播下下一轮复苏的种子。",
    indicators: "关键指标", bestInvest: "最佳投资", avoidInvest: "避免",
    psychology: "心理", why: "为什么有效",
    balanceSheet: "美联储资产负债表",
    qeLabel: "量化宽松（QE）", qtLabel: "量化紧缩（QT）",
    ratePrinciples: "核心原则",
    kidsTabLabel: "儿童", quizTabLabel: "测验", questionsLabel: "题",
    viewAllLessonsTemplate: "查看全部{n}节课 →",
    qeNarrative: "美联储购债 → 资金流入 → 收益率↓ → 股票↑↑ → 美元↓",
    qtNarrative: "美联储停止购债 → 资金流出 → 收益率↑ → 股票↓ → 美元↑",
    aboutTabLabel: "关于", aboutTitle: "关于本应用",
    aboutBody: "《经济周期》利用历史规律和经济学家、投资者广泛传播的原则，讲解经济周期、利率和市场阶段的运作方式。这只是一个教育工具——不收集账户或个人数据，其中任何内容都不构成个性化的投资、法律或税务建议。",
    firstLaunchTitle: "欢迎使用经济周期", firstLaunchOk: "知道了，开始学习",
  },
  ja: {
    appTitle: "経済サイクル", appSub: "経済をマスターしよう",
    langLabel: "言語",
    tabHome: "ホーム", tabLearn: "学習", tabMarkets: "市場", tabMore: "その他",
    welcomeTitle: "経済サイクルへようこそ",
    welcomeSub: "経済の仕組みをステップバイステップで学ぼう",
    continueLesson: "学習を続ける", startLesson: "学習を始める",
    lessonsCompleted: "完了レッスン", totalLessons: "全レッスン",
    featuredInsight: "注目のインサイト",
    heroInsight: "経済を、いくつかの単純な部品でできた機械だと考えてみましょう。それは「取引」です。毎日繰り返される何百万もの取引が、好況と不況を生み出します。",
    disclaimer: "教育目的のコンテンツです — 個別の投資・法律・税務アドバイスではありません。市場にはリスクが伴い、過去のパターンが将来の結果を保証するものではありません。",
    lessonLabel: "レッスン", ofLabel: "/", completeLabel: "完了！",
    nextLesson: "次のレッスン", prevLesson: "前へ", markComplete: "完了にする",
    keyTakeaway: "重要ポイント", tryThinking: "考えてみよう",
    locked: "前のレッスンを先に完了してください",
    marketsTitle: "マーケットダッシュボード", currentState: "例示シナリオ",
    scenarioNote: "教育目的の例です — リアルタイムの市場データではありません", rateTitle: "金利",
    rateHow: "金利変動が資産に与える影響",
    ratesRising: "金利 ↑", ratesFalling: "金利 ↓",
    yieldCurveLabel: "イールドカーブの形状",
    curveNormal: "正常（健全）", curveFlat: "フラット（警告）",
    curveInverted: "逆イールド（危険）", curveSteep: "急勾配（回復）",
    quizTitle: "知識をテストしよう", quizStart: "開始", quizNext: "次へ",
    quizFinish: "結果を見る", quizCorrect: "正解！", quizWrong: "惜しい。",
    quizScore: "あなたのスコア", quizTryAgain: "もう一度", quizExplain: "解説",
    kidsTitle: "子どもにお金の話を", kidsAges58: "5-8歳", kidsAges912: "9-12歳",
    kidsAges1317: "13-17歳", kidsParentTip: "保護者のヒント", kidsActivity: "このアクティビティを試そう",
    kidsParentIntro: "保護者向けガイドです — お子さんの年齢帯を選び、この説明を一緒に読んでみましょう。",
    glossTitle: "用語集", glossSearch: "用語を検索...",
    expansion: "拡大期", peak: "ピーク", contraction: "収縮期", trough: "底",
    expDesc: "経済が成長。GDPが上昇し、雇用が創出される。",
    peakDesc: "最大産出量。成長が鈍化し、インフレが高水準。",
    contDesc: "経済が縮小。GDPが低下し、失業率が上昇。",
    troughDesc: "経済が底を打つ。次の回復の種が蒔かれる。",
    indicators: "主要指標", bestInvest: "最適な投資", avoidInvest: "避けるべき",
    psychology: "心理", why: "なぜ効果的か",
    balanceSheet: "FRBのバランスシート",
    qeLabel: "量的緩和（QE）", qtLabel: "量的引き締め（QT）",
    ratePrinciples: "重要な原則",
    kidsTabLabel: "キッズ", quizTabLabel: "クイズ", questionsLabel: "問",
    viewAllLessonsTemplate: "全{n}レッスンを見る →",
    qeNarrative: "FRBが債券購入 → 資金流入 → 利回り↓ → 株↑↑ → ドル↓",
    qtNarrative: "FRBが購入停止 → 資金流出 → 利回り↑ → 株↓ → ドル↑",
    aboutTabLabel: "概要", aboutTitle: "このアプリについて",
    aboutBody: "経済サイクルは、経済学者や投資家によって広く知られている原則と歴史的パターンを用いて、経済サイクル・金利・市場の局面がどのように機能するかを教える教育ツールです。アカウントや個人データは収集せず、内容はいずれも個別の投資・法律・税務アドバイスではありません。",
    firstLaunchTitle: "経済サイクルへようこそ", firstLaunchOk: "了解、始めよう",
  },
};

const langFlags = { en: "🇺🇸", es: "🇪🇸", ko: "🇰🇷", zh: "🇨🇳", ja: "🇯🇵" };
const langNames = { en: "English", es: "Español", ko: "한국어", zh: "中文", ja: "日本語" };

// ═══════════════════════════════════════════════════════════════
// STEP-BY-STEP LESSONS (inspired by principles popularized by economists and investors)
// Sequential learning — each lesson builds on the previous
// ═══════════════════════════════════════════════════════════════
const lessons = [
  {
    id: 1, icon: "🔄", color: "#2563eb",
    title: { en: "Transactions: The Building Block", es: "Transacciones: El Pilar Fundamental", ko: "거래: 경제의 기본 단위", zh: "交易：经济的基石", ja: "取引：経済の基本単位" },
    subtitle: { en: "Every time you buy something, you create a transaction", es: "Cada vez que compras algo, creas una transacción", ko: "무언가를 살 때마다 거래가 만들어집니다", zh: "每次购买都创造一笔交易", ja: "何かを買うたびに取引が生まれる" },
    sections: [
      {
        heading: { en: "What is a Transaction?", es: "¿Qué es una Transacción?", ko: "거래란 무엇인가?", zh: "什么是交易？", ja: "取引とは？" },
        body: {
          en: "An economy is simply the sum of all transactions. Each transaction is a buyer exchanging money or credit with a seller for goods, services, or financial assets.\n\nCredit spends just like money. So: Total Spending = Money Spent + Credit Spent.\n\nTotal spending drives the economy. If you divide the amount spent by the quantity sold, you get the price. That's it — that's a transaction.",
          es: "Una economía es simplemente la suma de todas las transacciones. Cada transacción es un comprador intercambiando dinero o crédito con un vendedor por bienes, servicios o activos financieros.\n\nEl crédito se gasta igual que el dinero. Gasto Total = Dinero + Crédito.\n\nEl gasto total impulsa la economía.",
          ko: "경제는 모든 거래의 합입니다. 각 거래는 구매자가 돈이나 신용을 판매자에게 상품, 서비스, 금융자산과 교환하는 것입니다.\n\n신용은 돈처럼 사용됩니다. 총 지출 = 돈 지출 + 신용 지출.\n\n총 지출이 경제를 움직입니다.",
          zh: "经济就是所有交易的总和。每笔交易都是买方用货币或信贷与卖方交换商品、服务或金融资产。\n\n信贷和货币一样可以消费。总支出 = 货币支出 + 信贷支出。\n\n总支出驱动经济。",
          ja: "経済は全ての取引の合計です。各取引は、買い手がお金や信用を売り手に支払い、商品やサービスを得ること。\n\n信用はお金と同じように使えます。総支出 = お金 + 信用。\n\n総支出が経済を動かします。",
        },
      },
      {
        heading: { en: "Markets and the Economy", es: "Mercados y la Economía", ko: "시장과 경제", zh: "市场与经济", ja: "市場と経済" },
        body: {
          en: "A market is all buyers and sellers making transactions for the same thing — wheat, cars, stocks. An economy consists of all transactions in all markets.\n\nPeople, businesses, banks, and governments all engage in transactions. The biggest buyer and seller is the government, which has two parts:\n\n• Central Government — collects taxes, spends money\n• Central Bank — controls money and credit by influencing interest rates and printing new money",
          es: "Un mercado son todos los compradores y vendedores haciendo transacciones por lo mismo. Una economía consiste en todas las transacciones en todos los mercados.\n\nEl gobierno es el mayor comprador y vendedor, con dos partes:\n• Gobierno Central — recauda impuestos, gasta\n• Banco Central — controla dinero y crédito",
          ko: "시장은 같은 것을 거래하는 모든 구매자와 판매자입니다. 경제는 모든 시장의 모든 거래로 구성됩니다.\n\n정부가 가장 큰 구매자이자 판매자입니다:\n• 중앙정부 — 세금 징수, 지출\n• 중앙은행 — 금리와 화폐 발행으로 돈과 신용 통제",
          zh: "市场就是所有买卖同一种东西的人。经济由所有市场的所有交易组成。\n\n政府是最大的买卖方：\n• 中央政府——收税、支出\n• 中央银行——通过利率和印钞控制货币信贷",
          ja: "市場は同じものを取引する全ての売り手と買い手。経済は全市場の全取引で構成。\n\n政府が最大の買い手かつ売り手：\n• 中央政府：税を集め支出\n• 中央銀行：金利と紙幣印刷でお金と信用を管理",
        },
      },
    ],
    takeaway: {
      en: "If we can understand transactions, we can understand the whole economy. Everything starts here.",
      es: "Si entendemos las transacciones, entendemos toda la economía.",
      ko: "거래를 이해하면 경제 전체를 이해할 수 있습니다. 모든 것은 여기서 시작됩니다.",
      zh: "理解了交易，就理解了整个经济。一切从这里开始。",
      ja: "取引を理解すれば、経済全体を理解できます。",
    },
    thinkAbout: {
      en: "Think of your last purchase. You exchanged money (or credit) for something. That transaction became someone else's income. Can you trace the chain?",
      es: "Piensa en tu última compra. Intercambiaste dinero por algo. Esa transacción se convirtió en el ingreso de alguien más.",
      ko: "마지막 구매를 생각해보세요. 돈(또는 신용)을 무언가와 교환했습니다. 그 거래는 다른 사람의 소득이 되었습니다.",
      zh: "想想你上次的购买。你用钱（或信贷）换了某样东西。那笔交易成了别人的收入。",
      ja: "最後の買い物を思い出してください。お金（または信用）を何かと交換しました。その取引は誰かの収入になりました。",
    },
  },
  {
    id: 2, icon: "💳", color: "#7c3aed",
    title: { en: "Credit: The Most Important Part", es: "Crédito: La Parte Más Importante", ko: "신용: 가장 중요한 부분", zh: "信贷：最重要的部分", ja: "信用：最も重要な部分" },
    subtitle: { en: "Credit is the biggest and most volatile part of the economy", es: "El crédito es la parte más grande y volátil de la economía", ko: "신용은 경제에서 가장 크고 변동성이 큰 부분입니다", zh: "信贷是经济中最大且最不稳定的部分", ja: "信用は経済で最大かつ最も変動が大きい部分" },
    sections: [
      {
        heading: { en: "How Credit Works", es: "Cómo Funciona el Crédito", ko: "신용의 작동 원리", zh: "信贷如何运作", ja: "信用の仕組み" },
        body: {
          en: "Lenders want to turn their money into more money. Borrowers want to buy something they can't afford now — a house, car, or business.\n\nWhen borrowers promise to repay (principal + interest) and lenders believe them, credit is created out of thin air!\n\nWhen interest rates are high → less borrowing (expensive)\nWhen interest rates are low → more borrowing (cheap)\n\nAs soon as credit is created, it turns into debt. Debt is an asset to the lender and a liability to the borrower.",
          es: "Los prestamistas quieren más dinero. Los prestatarios quieren comprar algo que no pueden pagar ahora.\n\nCuando los prestatarios prometen pagar y los prestamistas les creen, ¡el crédito se crea de la nada!\n\nTasas altas → menos préstamos\nTasas bajas → más préstamos",
          ko: "대출자는 돈을 더 많은 돈으로 만들고 싶어합니다. 차입자는 지금 살 수 없는 것을 사고 싶어합니다.\n\n차입자가 상환을 약속하고 대출자가 이를 믿으면, 신용이 무에서 만들어집니다!\n\n금리가 높으면 → 차입 감소\n금리가 낮으면 → 차입 증가",
          zh: "放贷者想让钱生更多钱。借款者想买现在买不起的东西。\n\n当借款者承诺还款，放贷者相信时，信贷就凭空创造了！\n\n利率高 → 借贷减少\n利率低 → 借贷增加",
          ja: "貸し手はお金を増やしたい。借り手は今買えないものを買いたい。\n\n借り手が返済を約束し貸し手が信じると、信用が無から生まれます！\n\n金利が高い → 借入減少\n金利が低い → 借入増加",
        },
      },
      {
        heading: { en: "Credit vs Money", es: "Crédito vs Dinero", ko: "신용 vs 돈", zh: "信贷 vs 货币", ja: "信用 vs お金" },
        body: {
          en: "Money settles transactions immediately. When you buy a beer with cash — done.\n\nCredit is like a bar tab. You promise to pay later. You and the bartender just created an asset and a liability — out of thin air.\n\nHere's the stunning reality: most of what people call \"money\" is actually credit. In the US, total credit is about $50 trillion while actual money is only about $3 trillion.",
          es: "El dinero cierra transacciones inmediatamente. El crédito es como una cuenta de bar — prometes pagar después.\n\nLa realidad: la mayoría del \"dinero\" es crédito. En EE.UU., el crédito total es ~$50T y el dinero real solo ~$3T.",
          ko: "돈은 거래를 즉시 완결합니다. 신용은 바 탭과 같습니다 — 나중에 지불하겠다는 약속입니다.\n\n놀라운 현실: 사람들이 \"돈\"이라고 부르는 것의 대부분은 사실 신용입니다. 미국의 총 신용은 약 $50조이고 실제 돈은 약 $3조에 불과합니다.",
          zh: "货币立即结算交易。信贷像酒吧记账——你承诺以后付。\n\n惊人的现实：人们所说的\"钱\"大部分实际是信贷。美国总信贷约50万亿美元，实际货币只有约3万亿。",
          ja: "お金は取引を即座に決済。信用はバーのツケ。後で払うと約束する。\n\n驚くべき現実：人々が「お金」と呼ぶものの大半は実は信用です。米国の総信用は約50兆ドル、実際のお金はわずか約3兆ドル。",
        },
      },
      {
        heading: { en: "The Spending Chain", es: "La Cadena de Gasto", ko: "지출의 연쇄", zh: "支出链条", ja: "支出の連鎖" },
        body: {
          en: "Why is credit so important? Because when you get credit, you can spend more. And one person's spending is another person's income.\n\nEvery dollar you spend, someone else earns. Every dollar you earn, someone else spent.\n\nSo: More spending → more income → more creditworthy → more borrowing → more spending → and so on. This self-reinforcing pattern is why we have economic cycles.",
          es: "¿Por qué importa el crédito? Porque cuando gastas más, alguien gana más.\n\nMás gasto → más ingreso → más crédito → más préstamos → más gasto. Este patrón auto-reforzante crea los ciclos económicos.",
          ko: "신용이 왜 중요할까요? 신용으로 더 많이 쓸 수 있고, 한 사람의 지출은 다른 사람의 소득이기 때문입니다.\n\n더 많은 지출 → 더 많은 소득 → 더 높은 신용도 → 더 많은 차입 → 더 많은 지출. 이 자기 강화 패턴이 경제 순환을 만듭니다.",
          zh: "为什么信贷如此重要？因为有了信贷你就能花更多，而一个人的支出就是另一个人的收入。\n\n更多支出 → 更多收入 → 更高信用 → 更多借贷 → 更多支出。这个自我强化的模式就是经济周期的原因。",
          ja: "なぜ信用が重要か？信用で支出が増え、誰かの支出は別の誰かの収入だから。\n\n支出増 → 収入増 → 信用力向上 → 借入増 → 支出増。この自己強化パターンが経済サイクルを生みます。",
        },
      },
    ],
    takeaway: {
      en: "Credit creates self-reinforcing cycles in BOTH directions — booms AND busts. One person's spending = another's income.",
      es: "El crédito crea ciclos auto-reforzantes en AMBAS direcciones — auges Y caídas.",
      ko: "신용은 양 방향으로 자기 강화 순환을 만듭니다 — 호황과 불황 모두.",
      zh: "信贷在两个方向都创造自我强化的周期——繁荣和衰退。",
      ja: "信用は両方向に自己強化サイクルを作る — 好景気も不景気も。",
    },
    thinkAbout: {
      en: "If you borrow $10,000 and spend it, that becomes someone's income. They can now borrow more too. Can you see how credit creates growth?",
      es: "Si pides prestado $10,000 y los gastas, eso se convierte en ingreso de alguien. ¿Ves cómo el crédito crea crecimiento?",
      ko: "$10,000을 빌려 쓰면 그것은 누군가의 소득이 됩니다. 그들도 이제 더 빌릴 수 있습니다. 신용이 어떻게 성장을 만드는지 보이시나요?",
      zh: "如果你借了10,000美元并花掉，那就成了别人的收入。他们现在也能借更多。你能看到信贷如何创造增长吗？",
      ja: "1万ドル借りて使えば、それは誰かの収入になります。その人も借入できる。信用が成長を生む仕組みが見えますか？",
    },
  },
  {
    id: 3, icon: "📈", color: "#059669",
    title: { en: "Productivity Growth: The Long-Run Driver", es: "Crecimiento de Productividad", ko: "생산성 성장: 장기 동력", zh: "生产力增长：长期驱动力", ja: "生産性成長：長期的な推進力" },
    subtitle: { en: "What really matters in the long run", es: "Lo que realmente importa a largo plazo", ko: "장기적으로 정말 중요한 것", zh: "长期来看真正重要的是什么", ja: "長期的に本当に重要なこと" },
    sections: [
      {
        heading: { en: "Productivity vs Credit", es: "Productividad vs Crédito", ko: "생산성 vs 신용", zh: "生产力 vs 信贷", ja: "生産性 vs 信用" },
        body: {
          en: "Over time, what we learn and our accumulated knowledge raises our living standards. This is productivity growth.\n\nProductivity matters most in the long run, but credit matters most in the short run.\n\nWhy? Productivity growth doesn't fluctuate much — it's a steady upward line. But debt swings wildly because it lets us consume MORE than we produce when we borrow, and LESS than we produce when we pay it back.\n\nWithout credit, the only way to grow is to be more productive. With credit, we get cycles.",
          es: "La productividad importa más a largo plazo, pero el crédito importa más a corto plazo.\n\nLa productividad crece de forma estable. El crédito fluctúa salvajemente, creando ciclos.",
          ko: "생산성은 장기적으로 가장 중요하지만, 신용은 단기적으로 가장 중요합니다.\n\n생산성 성장은 크게 변동하지 않습니다. 하지만 부채는 크게 흔들립니다 — 빌릴 때 생산 이상으로 소비하고, 갚을 때 생산 이하로 소비하기 때문입니다.",
          zh: "生产力长期最重要，但信贷短期最重要。\n\n生产力增长不会大幅波动。但债务剧烈波动——借债时消费超过生产，还债时消费低于生产。",
          ja: "生産性は長期的に最も重要で、信用は短期的に最も重要。\n\n生産性成長は大きく変動しない。しかし債務は大きく揺れる — 借りる時は生産以上に消費し、返す時は以下になる。",
        },
      },
      {
        heading: { en: "Good Debt vs Bad Debt", es: "Deuda Buena vs Deuda Mala", ko: "좋은 부채 vs 나쁜 부채", zh: "好债 vs 坏债", ja: "良い借金 vs 悪い借金" },
        body: {
          en: "Credit isn't necessarily bad. It depends on how it's used:\n\nBAD: Borrowing for a big TV. It doesn't generate income to pay back the debt.\n\nGOOD: Borrowing for a tractor that helps you harvest more crops, earn more money, and pay back the debt while improving your living standards.\n\nThe question is always: does the borrowed money create enough income to pay itself back?",
          es: "El crédito no es necesariamente malo. Depende de cómo se use:\n\nMALO: Pedir prestado para un TV grande.\nBUENO: Pedir prestado para un tractor que te ayude a ganar más.",
          ko: "신용은 반드시 나쁜 것이 아닙니다. 사용 방법에 따라 다릅니다:\n\n나쁨: 큰 TV를 사기 위한 대출 — 소득을 만들지 못합니다.\n좋음: 트랙터를 사기 위한 대출 — 더 많은 작물을 수확하고 부채를 갚을 수 있습니다.",
          zh: "信贷不一定是坏事，取决于怎么用：\n\n坏的：借钱买大电视——不能产生收入还债。\n好的：借钱买拖拉机——能收获更多庄稼、赚更多钱、还清债务。",
          ja: "信用は必ずしも悪くない。使い方次第：\n\n悪い：大きなTVのための借金 — 収入を生まない。\n良い：トラクターのための借金 — 作物を増やし収入を生む。",
        },
      },
    ],
    takeaway: {
      en: "Borrowing is pulling spending forward from your future self. Every time you borrow, you create a cycle. This is true for individuals AND the whole economy.",
      es: "Pedir prestado es adelantar gasto de tu futuro. Cada vez que pides prestado, creas un ciclo.",
      ko: "차입은 미래의 자신에게서 지출을 앞당기는 것입니다. 빌릴 때마다 순환이 만들어집니다.",
      zh: "借钱就是从未来的自己那里提前支出。每次借钱都创造一个周期。",
      ja: "借金は未来の自分から支出を前借りすること。借りるたびにサイクルが生まれる。",
    },
    thinkAbout: {
      en: "Think about it: if you borrow from your future self to spend now, there MUST be a time when you spend less. That's why credit creates cycles — up, then down.",
      es: "Si pides prestado de tu futuro, DEBE haber un momento en que gastes menos.",
      ko: "지금 쓰기 위해 미래에서 빌리면, 반드시 덜 쓰는 시기가 옵니다. 그래서 신용이 순환을 만듭니다.",
      zh: "如果从未来借来花，必然有一天要少花。这就是信贷创造周期的原因。",
      ja: "未来の自分から借りて今使うなら、必ず少なく使う時期が来る。だから信用はサイクルを作る。",
    },
  },
  {
    id: 4, icon: "🔁", color: "#d97706",
    title: { en: "The Short-Term Debt Cycle", es: "El Ciclo de Deuda a Corto Plazo", ko: "단기 부채 순환", zh: "短期债务周期", ja: "短期債務サイクル" },
    subtitle: { en: "5-8 years — the business cycle most people know", es: "5-8 años — el ciclo que la mayoría conoce", ko: "5-8년 — 대부분의 사람들이 아는 경기 순환", zh: "5-8年——大多数人熟知的经济周期", ja: "5-8年 — ほとんどの人が知る景気循環" },
    sections: [
      {
        heading: { en: "Expansion Phase", es: "Fase de Expansión", ko: "확장 국면", zh: "扩张阶段", ja: "拡大局面" },
        body: {
          en: "As economic activity increases, we see expansion. Spending increases, prices start to rise.\n\nThis happens because spending is fueled by credit — which can be created instantly out of thin air.\n\nWhen spending and incomes grow faster than production → prices rise → that's inflation.\n\nThe Central Bank doesn't want too much inflation, so it raises interest rates. Higher rates mean fewer people borrow, existing debts cost more, less money to spend.",
          es: "La actividad económica aumenta. El gasto sube, los precios suben. El banco central sube tasas para controlar la inflación.",
          ko: "경제 활동이 증가하면 확장기가 시작됩니다. 지출이 늘고 가격이 오릅니다.\n\n지출과 소득이 생산보다 빠르게 증가하면 → 가격 상승 → 이것이 인플레이션입니다.\n\n중앙은행은 과도한 인플레이션을 원하지 않아 금리를 올립니다.",
          zh: "经济活动增加时出现扩张。支出增加，价格上涨。\n\n当支出增长快于生产 → 价格上涨 → 这就是通胀。\n\n央行不想通胀太高，所以加息。",
          ja: "経済活動が増加すると拡大期。支出が増え、価格が上がる。\n\n支出の伸びが生産を上回ると → 物価上昇 → インフレ。\n\n中央銀行は過度なインフレを防ぐため金利を上げる。",
        },
      },
      {
        heading: { en: "Contraction & Recession", es: "Contracción y Recesión", ko: "수축과 경기침체", zh: "收缩与衰退", ja: "収縮と景気後退" },
        body: {
          en: "With higher rates → people borrow less → spend less → one person's spending is another's income → incomes drop → spending drops more.\n\nWhen people spend less, prices go down. That's deflation. Economic activity decreases → recession.\n\nIf the recession gets too severe, the central bank lowers interest rates again. Lower rates → cheaper borrowing → more spending → another expansion.\n\nThis cycle repeats every 5-8 years, controlled primarily by the central bank.",
          es: "Tasas más altas → menos préstamos → menos gasto → menos ingresos → recesión.\n\nSi es grave, el banco central baja tasas. Tasas bajas → más gasto → otra expansión. El ciclo se repite cada 5-8 años.",
          ko: "높은 금리 → 차입 감소 → 지출 감소 → 소득 감소 → 경기침체.\n\n심각해지면 중앙은행이 금리를 다시 낮춥니다. 낮은 금리 → 더 많은 지출 → 다시 확장. 이 순환은 5-8년마다 반복됩니다.",
          zh: "利率升高 → 借贷减少 → 支出减少 → 收入下降 → 衰退。\n\n如果衰退太严重，央行降息。低利率 → 更多支出 → 新的扩张。这个周期每5-8年重复一次。",
          ja: "金利上昇 → 借入減 → 支出減 → 収入減 → 景気後退。\n\n深刻なら中央銀行が利下げ。低金利 → 支出増 → 新たな拡大。5-8年ごとに繰り返す。",
        },
      },
    ],
    takeaway: {
      en: "The economy works like a machine. When credit is easy → expansion. When credit tightens → recession. The central bank controls the cycle by raising and lowering rates.",
      es: "La economía funciona como una máquina. Crédito fácil → expansión. Crédito restringido → recesión.",
      ko: "경제는 기계처럼 작동합니다. 신용이 쉬우면 → 확장. 신용이 조여지면 → 경기침체. 중앙은행이 금리로 순환을 통제합니다.",
      zh: "经济像机器一样运转。信贷宽松 → 扩张。信贷收紧 → 衰退。央行通过调整利率控制周期。",
      ja: "経済は機械のように動く。信用が簡単 → 拡大。信用が引き締まる → 後退。中央銀行が金利で制御。",
    },
    thinkAbout: {
      en: "Notice how each cycle's bottom and top finish with MORE growth and MORE debt than the previous one. People tend to borrow and spend more over time — it's human nature. What do you think happens when this accumulates over decades?",
      es: "Nota cómo cada ciclo termina con MÁS deuda que el anterior. ¿Qué pasa cuando esto se acumula durante décadas?",
      ko: "각 순환의 바닥과 꼭대기가 이전보다 더 많은 성장과 더 많은 부채로 끝난다는 점에 주목하세요. 이것이 수십 년 동안 누적되면 어떻게 될까요?",
      zh: "注意每个周期的底部和顶部都比上一个有更多增长和更多债务。当这种情况持续几十年会怎样？",
      ja: "各サイクルの底と頂上が前回より多くの成長と多くの借金で終わることに注目。数十年蓄積するとどうなると思いますか？",
    },
  },
  {
    id: 5, icon: "🌊", color: "#dc2626",
    title: { en: "The Long-Term Debt Cycle", es: "El Ciclo de Deuda a Largo Plazo", ko: "장기 부채 순환", zh: "长期债务周期", ja: "長期債務サイクル" },
    subtitle: { en: "75-100 years — the big wave underneath", es: "75-100 años — la gran ola debajo", ko: "75-100년 — 밑에 깔린 큰 파도", zh: "75-100年——潜藏的大浪", ja: "75-100年 — 底に潜む大きな波" },
    sections: [
      {
        heading: { en: "How Debt Accumulates", es: "Cómo se Acumula la Deuda", ko: "부채가 축적되는 방식", zh: "债务如何累积", ja: "借金の蓄積" },
        body: {
          en: "Over many short-term cycles, debts rise faster than incomes. Why? Human nature — people prefer to borrow and spend more instead of paying back debt.\n\nDespite growing debt, lenders keep lending freely. Why? Everyone thinks things are going great! Incomes are rising, asset values are up, the stock market roars!\n\nWhen people borrow heavily to buy assets as investments, pushing prices higher and higher — that's a bubble.\n\nThe debt burden (debt-to-income ratio) stays manageable as long as incomes keep rising. But this can't continue forever.",
          es: "A lo largo de muchos ciclos cortos, la deuda crece más rápido que los ingresos. La gente prefiere gastar que pagar deuda.\n\nCuando la gente pide mucho prestado para comprar activos como inversión, eso es una burbuja.",
          ko: "여러 단기 순환을 거치면서 부채가 소득보다 빠르게 증가합니다. 사람들이 부채를 갚기보다 더 빌리고 쓰는 것을 선호하기 때문입니다.\n\n사람들이 투자로 자산을 사기 위해 많이 빌리면 — 그것이 버블입니다. 하지만 이것은 영원히 계속될 수 없습니다.",
          zh: "经过许多短期周期，债务增长快于收入。人们更愿意借钱消费而非还债。\n\n当人们大量借钱购买资产投资，推动价格越来越高——这就是泡沫。但这不可能永远持续。",
          ja: "多くの短期サイクルの中で、債務は所得より速く増加。人は返済より借入・消費を好むから。\n\n資産を買うために大量に借りる時 — それがバブル。しかし永遠には続かない。",
        },
      },
      {
        heading: { en: "The Peak & Deleveraging", es: "El Pico y Desapalancamiento", ko: "정점과 디레버리징", zh: "顶峰与去杠杆", ja: "ピークとデレバレッジング" },
        body: {
          en: "Eventually, debt repayments grow faster than incomes. People cut spending → incomes fall → less creditworthy → less borrowing → the cycle reverses. This is the long-term debt peak.\n\nThis happened in the US in 2008, Japan in 1989, and the US in 1929.\n\nIn a deleveraging: spending falls, credit disappears, asset prices drop, banks get squeezed, the stock market crashes, social tensions rise.\n\nThe key difference from a recession: interest rates can't save you because they're already at 0%.",
          es: "Eventualmente, los pagos de deuda crecen más rápido que los ingresos. Esto pasó en EE.UU. en 2008, Japón en 1989 y EE.UU. en 1929.\n\nEn un desapalancamiento, las tasas de interés no pueden salvar la situación porque ya están en 0%.",
          ko: "결국 부채 상환이 소득보다 빠르게 증가합니다. 미국 2008년, 일본 1989년, 미국 1929년에 발생했습니다.\n\n디레버리징에서는 금리가 이미 0%이기 때문에 금리 인하로는 해결할 수 없습니다.",
          zh: "最终，还债增长快于收入。美国2008年、日本1989年、美国1929年都发生过。\n\n去杠杆时，利率已经是0%，无法通过降息解决。",
          ja: "最終的に債務返済が所得より速く増加。米国2008年、日本1989年、米国1929年に起きた。\n\nデレバレッジでは金利がすでに0%なので利下げでは解決できない。",
        },
      },
    ],
    takeaway: {
      en: "The long-term debt cycle builds over 75-100 years. When it peaks, normal rate cuts can't fix it. This is fundamentally different from a regular recession.",
      es: "El ciclo largo se construye en 75-100 años. Cuando alcanza su pico, los recortes de tasas normales no funcionan.",
      ko: "장기 부채 순환은 75-100년에 걸쳐 형성됩니다. 정점에 도달하면 일반적인 금리 인하로는 해결할 수 없습니다.",
      zh: "长期债务周期在75-100年间积累。到达顶峰时，普通降息无法解决。",
      ja: "長期債務サイクルは75-100年かけて形成。ピーク時は通常の利下げでは解決できない。",
    },
    thinkAbout: {
      en: "The US debt-to-GDP ratio is about 120% in 2026. People feel wealthy because assets keep going up. Does this sound like the late stage of a long-term debt cycle to you?",
      es: "La ratio deuda/PIB de EE.UU. es ~120% en 2026. ¿Suena como la etapa tardía de un ciclo largo?",
      ko: "2026년 미국의 GDP 대비 부채 비율은 약 120%입니다. 이것이 장기 부채 순환의 후기 단계처럼 들리시나요?",
      zh: "2026年美国债务/GDP比率约120%。这听起来像长期债务周期的后期阶段吗？",
      ja: "2026年の米国債務/GDP比率は約120%。長期債務サイクルの後期段階に聞こえますか？",
    },
  },
  {
    id: 6, icon: "🏗️", color: "#4f46e5",
    title: { en: "Deleveraging: The 4 Tools", es: "Desapalancamiento: Las 4 Herramientas", ko: "디레버리징: 4가지 도구", zh: "去杠杆：4大工具", ja: "デレバレッジング：4つの手段" },
    subtitle: { en: "How economies deal with too much debt", es: "Cómo las economías manejan demasiada deuda", ko: "경제가 과다 부채를 다루는 방법", zh: "经济如何应对过多债务", ja: "経済が過大な借金にどう対処するか" },
    sections: [
      {
        heading: { en: "The 4 Ways to Reduce Debt Burden", es: "Las 4 Formas de Reducir la Carga de Deuda", ko: "부채 부담을 줄이는 4가지 방법", zh: "减轻债务负担的4种方式", ja: "債務負担を軽減する4つの方法" },
        body: {
          en: "When debt is too high, there are only 4 things that can happen:\n\n1. CUT SPENDING (Austerity) — Painful, deflationary. Incomes fall faster than debts are repaid, so the burden actually gets WORSE.\n\n2. REDUCE DEBTS (Defaults & Restructuring) — Borrowers can't pay, banks get squeezed, people rush to withdraw money. This is a depression.\n\n3. REDISTRIBUTE WEALTH — Governments raise taxes on the wealthy. Social tensions rise between \"haves\" and \"have-nots.\"\n\n4. PRINT MONEY — The Central Bank prints new money to buy financial assets and government bonds. This is inflationary and stimulative — the opposite of the first three.",
          es: "1. RECORTAR GASTO (Austeridad)\n2. REDUCIR DEUDAS (Impagos)\n3. REDISTRIBUIR RIQUEZA (Impuestos)\n4. IMPRIMIR DINERO (QE)",
          ko: "1. 지출 삭감 (긴축) — 고통스럽고 디플레이션적\n2. 부채 감소 (채무불이행 & 구조조정)\n3. 부의 재분배 (부자 증세)\n4. 화폐 발행 — 인플레이션적이고 부양적 — 처음 세 가지의 반대",
          zh: "1. 削减支出（紧缩）——痛苦、通缩\n2. 减少债务（违约和重组）\n3. 重新分配财富（向富人征税）\n4. 印钞——通胀性和刺激性——与前三种相反",
          ja: "1. 支出削減（緊縮） — 苦痛でデフレ的\n2. 債務削減（デフォルト・再編）\n3. 富の再分配（富裕層への増税）\n4. 紙幣印刷 — インフレ的で刺激的 — 最初の3つと逆",
        },
      },
      {
        heading: { en: "Beautiful vs Ugly Deleveraging", es: "Desapalancamiento Hermoso vs Feo", ko: "아름다운 vs 추한 디레버리징", zh: "漂亮 vs 丑陋的去杠杆", ja: "美しいvs醜いデレバレッジング" },
        body: {
          en: "The key is BALANCE. The deflationary ways (cutting, defaulting, taxing) must balance with the inflationary way (printing money).\n\nA beautiful deleveraging: debts decline relative to income, growth stays positive, inflation stays manageable. The 2008-2015 US recovery was an example.\n\nAn ugly deleveraging: too much of one tool. Germany in the 1920s printed too much money → hyperinflation. The 1930s US used too much austerity → Great Depression.\n\nRecovery takes roughly a decade — the \"lost decade.\"",
          es: "La clave es el EQUILIBRIO. Un desapalancamiento hermoso equilibra las 4 herramientas. La recuperación tarda aproximadamente una década.",
          ko: "핵심은 균형입니다. 디플레이션적 방법과 인플레이션적 방법의 균형.\n\n아름다운 디레버리징: 소득 대비 부채 감소, 성장 유지. 2008-2015 미국이 예시.\n\n추한 디레버리징: 한 도구를 너무 많이 사용. 회복에는 약 10년 — \"잃어버린 10년.\"",
          zh: "关键是平衡。通缩手段和通胀手段必须平衡。\n\n漂亮的去杠杆：债务下降、增长为正。2008-2015美国是例子。\n\n丑陋的去杠杆：过度使用某一工具。恢复大约需要十年——\"失去的十年\"。",
          ja: "鍵はバランス。デフレ的手段とインフレ的手段のバランス。\n\n美しいデレバレッジ：債務が所得比で低下、成長維持。2008-2015年の米国が例。\n\n醜いデレバレッジ：一つの手段を使いすぎる。回復には約10年 — 「失われた10年」。",
        },
      },
    ],
    takeaway: {
      en: "Income needs to grow faster than debt. Print enough money to offset deflation, but not so much you cause hyperinflation. Balance is everything.",
      es: "Los ingresos deben crecer más rápido que la deuda. Imprimir suficiente pero no demasiado. El equilibrio es todo.",
      ko: "소득이 부채보다 빠르게 성장해야 합니다. 디플레이션을 상쇄할 만큼 충분히 발행하되 과도한 인플레이션은 피해야 합니다.",
      zh: "收入增长必须快于债务。印够钱抵消通缩，但不能太多导致恶性通胀。平衡就是一切。",
      ja: "所得は債務より速く成長しなければならない。デフレを相殺するだけ印刷し、過度なインフレは避ける。バランスが全て。",
    },
    thinkAbout: {
      en: "If printing money offsets falling credit, total spending stays the same. So printing money doesn't cause inflation IF credit is disappearing at the same rate. Does that change how you think about money printing?",
      es: "Si imprimir dinero compensa el crédito que desaparece, el gasto total se mantiene. ¿Cambia eso tu perspectiva?",
      ko: "화폐 발행이 사라지는 신용을 상쇄하면 총 지출은 같습니다. 이것이 화폐 발행에 대한 당신의 생각을 바꾸나요?",
      zh: "如果印钞抵消了消失的信贷，总支出不变。这改变了你对印钞的看法吗？",
      ja: "紙幣印刷が消える信用を相殺すれば、総支出は同じ。これは紙幣印刷への見方を変えますか？",
    },
  },
  {
    id: 7, icon: "💹", color: "#1e40af",
    title: { en: "Interest Rates: The Master Signal", es: "Tasas de Interés: La Señal Maestra", ko: "금리: 마스터 신호", zh: "利率：主导信号", ja: "金利：マスターシグナル" },
    subtitle: { en: "How the Fed steers the economy", es: "Cómo el Fed dirige la economía", ko: "연준이 경제를 조종하는 방법", zh: "美联储如何引导经济", ja: "FRBが経済を舵取りする方法" },
    sections: [
      {
        heading: { en: "The Fed Funds Rate", es: "La Tasa de Fondos Federales", ko: "연방기금금리", zh: "联邦基金利率", ja: "フェデラルファンド金利" },
        body: {
          en: "The Federal Funds Rate is THE key rate that influences ALL other rates — mortgages, savings, credit cards.\n\nRaising rates → slows the economy (expensive to borrow)\nCutting rates → stimulates the economy (cheap to borrow)\n\nThis is the Fed's primary tool for managing the short-term debt cycle. But remember: policy works with a 12-24 month lag. The Fed often overshoots because they can't see the full effect in real-time.",
          es: "La tasa de fondos federales influye en TODAS las demás tasas.\n\nSubir tasas → frena la economía\nBajar tasas → estimula la economía\n\nLa política funciona con retraso de 12-24 meses.",
          ko: "연방기금금리는 모기지, 저축, 신용카드 등 모든 금리에 영향을 미치는 핵심 금리입니다.\n\n금리 인상 → 경제 둔화\n금리 인하 → 경제 부양\n\n정책 효과는 12-24개월의 시차가 있습니다.",
          zh: "联邦基金利率是影响所有其他利率的关键利率。\n\n加息 → 经济减速\n降息 → 经济刺激\n\n政策效果有12-24个月的滞后。",
          ja: "FF金利は住宅ローン、貯蓄、クレジットカードなど全ての金利に影響する最重要金利。\n\n利上げ → 経済減速\n利下げ → 経済刺激\n\n効果には12-24ヶ月の遅れがある。",
        },
      },
      {
        heading: { en: "How Rates Affect Everything", es: "Cómo las Tasas Afectan Todo", ko: "금리가 모든 것에 미치는 영향", zh: "利率如何影响一切", ja: "金利がすべてに与える影響" },
        body: {
          en: "When rates RISE: Stocks fall (especially growth stocks), bond prices fall, real estate slows (6-12 month lag), cash yields become competitive, USD strengthens.\n\nWhen rates FALL: Stocks rise, bond prices rise, real estate recovers, gold rises, USD weakens.\n\nThe golden rule investors cite: \"Don't fight the Fed.\" Historically, Fed easing (rate cuts) has coincided with rising asset prices, while Fed tightening (rate hikes) has coincided with more cautious market conditions.",
          es: "Tasas SUBEN: acciones bajan, bonos bajan, inmuebles se frenan.\nTasas BAJAN: acciones suben, bonos suben, inmuebles se recuperan.\n\nRegla de oro: \"No luches contra el Fed.\"",
          ko: "금리 상승: 주식 하락, 채권 가격 하락, 부동산 둔화, 현금 수익률 경쟁력.\n금리 하락: 주식 상승, 채권 가격 상승, 부동산 회복.\n\n황금률: \"연준에 맞서지 마라.\"",
          zh: "利率上升：股票下跌、债券价格下跌、房地产放缓。\n利率下降：股票上涨、债券价格上涨、房地产复苏。\n\n黄金法则：\"不要和美联储作对。\"",
          ja: "金利上昇：株下落、債券価格下落、不動産減速。\n金利下降：株上昇、債券価格上昇、不動産回復。\n\n黄金ルール：「FRBに逆らうな。」",
        },
      },
    ],
    takeaway: {
      en: "Rate changes are the Fed's primary tool for managing the short-term debt cycle. But when rates hit 0%, the Fed needs unconventional tools — that's where QE comes in.",
      es: "Los cambios de tasas son la herramienta principal del Fed. Cuando llegan a 0%, necesita herramientas no convencionales — QE.",
      ko: "금리 변경은 연준의 주요 도구입니다. 금리가 0%에 도달하면 비전통적 도구가 필요합니다 — 바로 QE입니다.",
      zh: "利率变化是美联储的主要工具。当利率降至0%，需要非常规工具——这就是QE。",
      ja: "金利変更はFRBの主要ツール。0%に達すると非従来型ツールが必要 — QEの出番。",
    },
    thinkAbout: {
      en: "The Fed raised rates to 5.25-5.50% in 2022-23 to fight inflation. It takes 12-24 months to feel the full effect. How might this still be rippling through the economy in 2026?",
      es: "El Fed subió tasas a 5.25-5.50% en 2022-23. ¿Cómo podría seguir afectando la economía en 2026?",
      ko: "연준은 2022-23년에 인플레이션과 싸우기 위해 5.25-5.50%까지 금리를 올렸습니다. 이것이 2026년 경제에 어떤 영향을 미칠 수 있을까요?",
      zh: "美联储在2022-23年将利率提高到5.25-5.50%以对抗通胀。这在2026年可能还在产生什么影响？",
      ja: "FRBは2022-23年にインフレ対策で5.25-5.50%まで利上げしました。2026年にもどんな影響があり得るでしょう？",
    },
  },
  {
    id: 8, icon: "📐", color: "#9333ea",
    title: { en: "The Yield Curve: Crystal Ball", es: "La Curva de Rendimiento: Bola de Cristal", ko: "수익률 곡선: 수정 구슬", zh: "收益率曲线：水晶球", ja: "イールドカーブ：水晶玉" },
    subtitle: { en: "The most reliable recession predictor since 1955", es: "El predictor de recesión más fiable desde 1955", ko: "1955년 이후 가장 신뢰할 수 있는 경기침체 예측 지표", zh: "自1955年以来最可靠的衰退预测指标", ja: "1955年以来最も信頼性の高い景気後退予測指標" },
    sections: [
      {
        heading: { en: "What is the Yield Curve?", es: "¿Qué es la Curva?", ko: "수익률 곡선이란?", zh: "什么是收益率曲线？", ja: "イールドカーブとは？" },
        body: {
          en: "A graph of interest rates on government bonds at different maturities (2-year, 10-year, 30-year).\n\nNORMAL (upward slope) — Healthy economy. Longer lending = more risk = higher rates.\n\nFLAT — Warning signal. The market expects slowdown.\n\nINVERTED (short rates above long rates) — DANGER! The most reliable recession predictor. Lead time: 12-18 months. Has predicted EVERY US recession since 1955.\n\nSTEEP — Recovery signal. Often seen after the Fed starts cutting rates.",
          es: "Un gráfico de tasas de interés de bonos a diferentes plazos.\n\nNormal = saludable. Invertida = peligro — ha predicho CADA recesión de EE.UU. desde 1955.",
          ko: "다른 만기의 국채 금리 그래프입니다.\n\n정상(우상향) = 건강한 경제\n역전(단기>장기) = 위험! 1955년 이후 모든 미국 경기침체를 예측했습니다.",
          zh: "不同期限国债利率的图表。\n\n正常（向上倾斜）= 健康经济\n倒挂（短期>长期）= 危险！自1955年以来预测了美国的每一次衰退。",
          ja: "異なる満期の国債金利のグラフ。\n\n正常（右肩上がり）= 健全な経済\n逆転（短期>長期）= 危険！1955年以来全ての景気後退を予測。",
        },
      },
    ],
    takeaway: {
      en: "When the yield curve inverts, pay attention. It's the bond market screaming that rate cuts are coming — and that means economic weakness ahead.",
      es: "Cuando la curva se invierte, presta atención. El mercado de bonos grita que vienen recortes.",
      ko: "수익률 곡선이 역전되면 주목하세요. 채권 시장이 금리 인하가 올 것이라고 외치는 것입니다.",
      zh: "当收益率曲线倒挂时要注意。债券市场在告诉你降息即将到来——经济疲软在前方。",
      ja: "イールドカーブが逆転したら注目。債券市場が利下げが来ると叫んでいる。",
    },
    thinkAbout: {
      en: "The yield curve inverted in 2022. Historical pattern says recession within 12-18 months. Some say 'this time is different.' What do you think?",
      es: "La curva se invirtió en 2022. El patrón dice recesión en 12-18 meses. ¿Será diferente esta vez?",
      ko: "2022년에 수익률 곡선이 역전되었습니다. 역사적 패턴은 12-18개월 내 경기침체를 말합니다. 이번에는 다를까요?",
      zh: "2022年收益率曲线倒挂了。历史规律说12-18个月内衰退。你怎么看？",
      ja: "2022年にイールドカーブが逆転。歴史的パターンでは12-18ヶ月以内に景気後退。今回は違うと思いますか？",
    },
  },
  {
    id: 9, icon: "🏦", color: "#be185d",
    title: { en: "QE & QT: The Fed's Power Tools", es: "QE y QT: Las Herramientas del Fed", ko: "QE & QT: 연준의 강력한 도구", zh: "QE与QT：美联储的强力工具", ja: "QE & QT：FRBのパワーツール" },
    subtitle: { en: "When rates at 0% aren't enough", es: "Cuando las tasas en 0% no son suficientes", ko: "0% 금리로도 충분하지 않을 때", zh: "当利率降到0%还不够时", ja: "金利0%でも不十分な時" },
    sections: [
      {
        heading: { en: "Quantitative Easing (QE)", es: "Flexibilización Cuantitativa (QE)", ko: "양적완화 (QE)", zh: "量化宽松（QE）", ja: "量的緩和（QE）" },
        body: {
          en: "When rates hit 0% and the economy still needs help, the Central Bank PRINTS money electronically and uses it to buy government bonds and mortgage-backed securities.\n\nThis pushes bond prices up (yields down), makes borrowing cheaper, and forces investors into riskier assets like stocks.\n\nQE1 (2008): $1.75 trillion\nQE2 (2010): $600 billion\nQE3 (2012): $85B/month\nCOVID QE (2020): Unlimited\n\nThe Fed balance sheet grew from ~$900B pre-2008 to ~$9 trillion peak in 2022.",
          es: "Cuando las tasas llegan a 0%, el banco central imprime dinero electrónicamente y compra bonos.\n\nEl balance del Fed creció de ~$900B antes de 2008 a ~$9T pico en 2022.",
          ko: "금리가 0%에 도달하면 중앙은행이 전자적으로 돈을 발행하여 국채와 MBS를 매입합니다.\n\n연준 대차대조표: 2008년 이전 ~$9000억 → 2022년 정점 ~$9조.",
          zh: "当利率降至0%时，央行电子印钞购买国债和抵押贷款支持证券。\n\n美联储资产负债表：2008年前约9000亿 → 2022年峰值约9万亿。",
          ja: "金利が0%に達すると中央銀行が電子的に紙幣を印刷し国債やMBSを購入。\n\nFRBバランスシート：2008年前約9000億ドル → 2022年ピーク約9兆ドル。",
        },
      },
      {
        heading: { en: "Quantitative Tightening (QT)", es: "Ajuste Cuantitativo (QT)", ko: "양적긴축 (QT)", zh: "量化紧缩（QT）", ja: "量的引き締め（QT）" },
        body: {
          en: "The reverse of QE. The Fed SHRINKS its balance sheet by letting bonds mature without reinvesting.\n\nThis drains money from the financial system, pushes yields UP, and tightens conditions.\n\nQT is like slowly letting air out of a balloon — quiet but can cause turbulence.\n\nThe Fed ran QT at $95B/month from 2022, slowed to $60B in 2024. As of 2026: ~$6.7 trillion (down from $9T peak).",
          es: "Lo opuesto al QE. El Fed reduce su balance dejando que los bonos venzan sin reinvertir.\n\nFunciona a $95B/mes desde 2022, reducido a $60B en 2024. 2026: ~$6.7T.",
          ko: "QE의 반대. 연준이 채권을 재투자 없이 만기시켜 대차대조표를 축소합니다.\n\n2022년부터 월 $950억, 2024년 $600억으로 축소. 2026년: ~$6.7조.",
          zh: "QE的反面。美联储让债券到期不再投资来缩减资产负债表。\n\n2022年起每月950亿，2024年放缓至600亿。2026年：约6.7万亿。",
          ja: "QEの逆。FRBが債券を再投資せず満期にしバランスシートを縮小。\n\n2022年から月950億ドル、2024年に600億に減速。2026年：約6.7兆ドル。",
        },
      },
    ],
    takeaway: {
      en: "QE injects money (inflationary, helps assets). QT drains money (deflationary, pressures assets). The Fed balance sheet is the scoreboard.",
      es: "QE inyecta dinero. QT drena dinero. El balance del Fed es el marcador.",
      ko: "QE는 돈을 공급합니다(인플레이션, 자산 지원). QT는 돈을 회수합니다(디플레이션, 자산 압박). 연준 대차대조표가 점수판입니다.",
      zh: "QE注入资金（通胀，利好资产）。QT抽走资金（通缩，压制资产）。美联储资产负债表是计分板。",
      ja: "QEは資金注入（インフレ、資産に有利）。QTは資金吸収（デフレ、資産に不利）。FRBバランスシートがスコアボード。",
    },
    thinkAbout: {
      en: "The Fed printed $2+ trillion in 2008 and unlimited in 2020. Who benefits most from QE? Those who own financial assets. Does this help explain growing wealth inequality?",
      es: "El Fed imprimió $2T+ en 2008 e ilimitado en 2020. ¿Quién se beneficia más? Los que poseen activos financieros.",
      ko: "연준은 2008년에 $2조 이상, 2020년에 무제한으로 발행했습니다. QE의 최대 수혜자는? 금융 자산을 소유한 사람들입니다.",
      zh: "美联储2008年印了2万亿+，2020年无限量。谁从QE中受益最多？持有金融资产的人。这有助于解释财富不平等吗？",
      ja: "FRBは2008年に2兆ドル以上、2020年は無制限に印刷。QEの最大受益者は？金融資産所有者です。",
    },
  },
  {
    id: 10, icon: "🔄", color: "#059669",
    title: { en: "The 4 Phases of Economic Cycles", es: "Las 4 Fases del Ciclo Económico", ko: "경제 순환의 4단계", zh: "经济周期的4个阶段", ja: "経済サイクルの4つの局面" },
    subtitle: { en: "Expansion → Peak → Contraction → Trough", es: "Expansión → Pico → Contracción → Valle", ko: "확장 → 정점 → 수축 → 저점", zh: "扩张 → 顶峰 → 收缩 → 低谷", ja: "拡大 → ピーク → 収縮 → 底" },
    sections: [
      {
        heading: { en: "Expansion & Peak", es: "Expansión y Pico", ko: "확장기와 정점", zh: "扩张与顶峰", ja: "拡大期とピーク" },
        body: {
          en: "EXPANSION: Credit flows freely. GDP rises, jobs are created, confidence builds. People borrow more, spend more, feel wealthier. S&P 500 avg return: +14-28%.\n\nHistorically favored in this phase: growth stocks, cyclical stocks, real estate.\n\nPEAK: Maximum output. Inflation at highs, Fed raising rates. Growth stalling. The seeds of contraction are planted here.\n\nHistorically favored in this phase: value stocks, commodities, short-duration bonds.",
          es: "EXPANSIÓN: El crédito fluye. PIB sube, empleo crece. Históricamente favorecidas en esta fase: acciones de crecimiento.\n\nPICO: Producción máxima. Inflación alta, Fed subiendo tasas.",
          ko: "확장기: 신용이 자유롭게 흐릅니다. GDP 상승, 일자리 창출. 역사적으로 이 시기에 강세를 보인 자산: 성장주, 경기순환주.\n\n정점: 최대 생산량. 인플레이션 고점, 연준 금리 인상.",
          zh: "扩张期：信贷自由流动。GDP上升、就业增加。历史上此阶段表现较强的资产：成长股、周期股。\n\n顶峰：最大产出。通胀高位、美联储加息。",
          ja: "拡大期：信用が自由に流れる。GDP上昇、雇用創出。歴史的にこの局面で強かった資産：グロース株、景気循環株。\n\nピーク：最大産出。インフレ高水準、FRB利上げ。",
        },
      },
      {
        heading: { en: "Contraction & Trough", es: "Contracción y Valle", ko: "수축기와 저점", zh: "收缩与低谷", ja: "収縮期と底" },
        body: {
          en: "CONTRACTION: Credit contracts, spending falls, unemployment rises. The Fed starts cutting rates. S&P 500 avg decline: -22-35%.\n\nHistorically favored in this phase: Treasury bonds, gold, defensive stocks (utilities, healthcare), cash.\n\nTROUGH: Maximum pessimism. But this is historically where the strongest rebounds have started. S&P 500 avg return in first year after bottom: +38-50%.\n\nHistorically favored in this phase: beaten-down quality stocks, high-yield bonds, real estate at distressed prices.",
          es: "CONTRACCIÓN: Crédito se contrae, desempleo sube, Fed recorta tasas.\n\nVALLE: Máximo pesimismo, pero históricamente aquí han comenzado los rebotes más fuertes. S&P 500: +38-50% el primer año después del fondo.",
          ko: "수축기: 신용 수축, 실업률 상승, 연준 금리 인하 시작.\n\n저점: 최대 비관론이지만, 역사적으로 이 시점에서 가장 강한 반등이 시작되었습니다. S&P 500 바닥 후 첫해 평균: +38-50%.",
          zh: "收缩期：信贷收缩、失业率上升、美联储开始降息。\n\n低谷：情绪最悲观，但历史上最强的反弹往往从这里开始。标普500触底后第一年平均回报+38-50%。",
          ja: "収縮期：信用収縮、失業率上昇、FRB利下げ開始。\n\n底：悲観が最大化する時期だが、歴史的に最も強い反発がここから始まっている。S&P500底打ち後1年目：+38-50%。",
        },
      },
    ],
    takeaway: {
      en: "Every great fortune was made buying when others were panicking at the trough. The cycle ALWAYS turns. Understanding where you are in the cycle is the most valuable financial knowledge.",
      es: "Las grandes fortunas se hicieron comprando cuando otros entraban en pánico. El ciclo SIEMPRE gira.",
      ko: "모든 큰 재산은 다른 사람들이 저점에서 패닉할 때 매수하여 만들어졌습니다. 순환은 항상 돌아갑니다.",
      zh: "每一笔巨额财富都是在低谷别人恐慌时买入获得的。周期总会转变。",
      ja: "全ての大きな財産は底で他の人がパニックしている時に買って築かれた。サイクルは必ず転換する。",
    },
    thinkAbout: {
      en: "Warren Buffett says \"Be fearful when others are greedy, and greedy when others are fearful.\" How does this connect to what you've learned about cycles?",
      es: "Warren Buffett dice \"Ten miedo cuando otros son codiciosos, y sé codicioso cuando otros tienen miedo.\"",
      ko: "워렌 버핏은 \"다른 사람들이 탐욕스러울 때 두려워하고, 두려워할 때 탐욕스러워라\"고 말합니다.",
      zh: "巴菲特说\"别人贪婪时恐惧，别人恐惧时贪婪。\"这与你学到的周期知识有什么联系？",
      ja: "バフェットは「他人が貪欲な時に恐れ、恐れている時に貪欲になれ」と言います。",
    },
  },
  {
    id: 11, icon: "📊", color: "#b45309",
    title: { en: "Reading Economic Indicators", es: "Leyendo Indicadores Económicos", ko: "경제 지표 읽기", zh: "解读经济指标", ja: "経済指標を読む" },
    subtitle: { en: "The dashboard of the economic machine", es: "El tablero de la máquina económica", ko: "경제 기계의 대시보드", zh: "经济机器的仪表板", ja: "経済マシンのダッシュボード" },
    sections: [
      {
        heading: { en: "Key Indicators", es: "Indicadores Clave", ko: "핵심 지표", zh: "关键指标", ja: "主要指標" },
        body: {
          en: "GDP — Total value of everything produced. Rising = expansion. Falling 2+ quarters = recession.\n\nCPI — Consumer Price Index. Measures inflation. Fed targets ~2%.\n\nPMI — Purchasing Managers' Index. Above 50 = expansion. Below 50 = contraction. A LEADING indicator.\n\nVIX — The 'Fear Gauge.' Below 15 = calm. Above 40 = extreme panic. Contrarians buy when VIX spikes.\n\nCredit Spreads — Difference between corporate and gov bond yields. Narrow = confidence. Wide = fear.",
          es: "PIB, IPC, PMI, VIX, Spreads de Crédito — los indicadores clave para leer el estado de la economía.",
          ko: "GDP, CPI, PMI, VIX, 신용 스프레드 — 경제 상태를 읽는 핵심 지표들.",
          zh: "GDP、CPI、PMI、VIX、信用利差——读懂经济状态的关键指标。",
          ja: "GDP、CPI、PMI、VIX、クレジットスプレッド — 経済の状態を読む重要指標。",
        },
      },
    ],
    takeaway: {
      en: "No single indicator tells the whole story. Watch multiple indicators together to understand where you are in the cycle.",
      es: "Ningún indicador cuenta toda la historia. Observa múltiples indicadores juntos.",
      ko: "어떤 단일 지표도 전체 이야기를 말하지 않습니다. 여러 지표를 함께 관찰하세요.",
      zh: "没有单一指标能说明全部。同时观察多个指标来理解你在周期的哪个位置。",
      ja: "一つの指標だけでは全体像は分からない。複数の指標を合わせて見よう。",
    },
    thinkAbout: {
      en: "Imagine an economy where: GDP is growing but slowing, inflation is running above target, the central bank is divided on which way to move rates, and tariffs are pushing costs to a multi-generational high. What phase do you think it's in?",
      es: "Imagina una economía donde: el PIB crece pero se desacelera, la inflación supera el objetivo, el banco central está dividido sobre la dirección de las tasas, y los aranceles empujan los costos a un máximo de varias generaciones. ¿En qué fase crees que está?",
      ko: "다음과 같은 경제를 상상해보세요: GDP는 성장하지만 둔화되고, 인플레이션은 목표치를 웃돌며, 중앙은행은 금리 방향에 대해 의견이 갈리고, 관세는 비용을 수십 년 만의 최고 수준으로 밀어올립니다. 어떤 단계라고 생각하시나요?",
      zh: "想象一个这样的经济体：GDP增长但放缓，通胀高于目标，央行对利率方向存在分歧，关税将成本推高至几十年来的最高水平。你认为这处于哪个阶段？",
      ja: "次のような経済を想像してください：GDP成長は鈍化し、インフレは目標を上回り、中央銀行は金利の方向性で意見が分かれ、関税がコストを数十年ぶりの高水準に押し上げています。どの局面だと思いますか？",
    },
  },
  {
    id: 12, icon: "🎯", color: "#15803d",
    title: { en: "Three Rules of Thumb", es: "Tres Reglas de Oro", ko: "세 가지 경험 법칙", zh: "三条经验法则", ja: "3つの経験則" },
    subtitle: { en: "A classic summary — simple but powerful", es: "Un resumen clásico — simple pero poderoso", ko: "고전적인 요약 — 간단하지만 강력합니다", zh: "经典总结——简单但强大", ja: "古典的な要約 — シンプルだが強力" },
    sections: [
      {
        heading: { en: "The Three Rules", es: "Las Tres Reglas", ko: "세 가지 법칙", zh: "三条法则", ja: "3つのルール" },
        body: {
          en: "RULE 1: Don't have debt rise faster than income. Because your debt burdens will eventually crush you.\n\nRULE 2: Don't have income rise faster than productivity. Because you will eventually become uncompetitive.\n\nRULE 3: Do all that you can to raise your productivity. Because in the long run, that's what matters most.\n\nThis is simple advice for you AND for policy makers. Most people — including most policy makers — don't pay enough attention to this.",
          es: "REGLA 1: No dejes que la deuda crezca más rápido que los ingresos.\nREGLA 2: No dejes que los ingresos crezcan más rápido que la productividad.\nREGLA 3: Haz todo lo posible por aumentar tu productividad.",
          ko: "법칙 1: 부채가 소득보다 빠르게 증가하지 않게 하라.\n법칙 2: 소득이 생산성보다 빠르게 증가하지 않게 하라.\n법칙 3: 생산성을 높이기 위해 할 수 있는 모든 것을 하라.",
          zh: "法则1：不要让债务增长快于收入。\n法则2：不要让收入增长快于生产力。\n法则3：尽一切努力提高生产力。",
          ja: "ルール1：債務が所得より速く増えないようにする。\nルール2：所得が生産性より速く増えないようにする。\nルール3：生産性を上げるためにあらゆることをする。",
        },
      },
      {
        heading: { en: "Putting It All Together", es: "Uniéndolo Todo", ko: "모든 것을 합치기", zh: "总结", ja: "まとめ" },
        body: {
          en: "Now you have the template:\n\nLayering the short-term debt cycle on top of the long-term debt cycle, and both on top of productivity growth gives you a map for understanding where we've been, where we are now, and where we're probably headed.\n\nThe economy isn't random. It's a machine driven by transactions, credit, and human nature. Once you see the patterns, you can make better decisions — as an investor, a business owner, or just someone trying to understand the world around them.",
          es: "Ahora tienes la plantilla: superponer el ciclo corto sobre el largo sobre la línea de productividad te da un mapa para entender la economía.",
          ko: "이제 템플릿이 있습니다: 단기 부채 순환을 장기 부채 순환 위에, 둘 다 생산성 성장 위에 겹치면 경제를 이해하는 지도가 됩니다.",
          zh: "现在你有了模板：将短期债务周期叠加在长期债务周期上，再叠加在生产力增长线上，就是理解经济的地图。",
          ja: "これでテンプレートが揃いました。短期債務サイクルを長期の上に、両方を生産性成長の上に重ねれば、経済を理解する地図になります。",
        },
      },
    ],
    takeaway: {
      en: "The economy is a machine. Transactions, credit, and human nature drive it. Once you see the patterns, you can make better decisions about your money, career, and life.",
      es: "La economía es una máquina. Transacciones, crédito y naturaleza humana la impulsan.",
      ko: "경제는 기계입니다. 거래, 신용, 인간 본성이 그것을 움직입니다. 패턴을 보면 더 나은 결정을 할 수 있습니다.",
      zh: "经济是一台机器。交易、信贷和人性驱动它。看到规律后，你就能做出更好的决策。",
      ja: "経済は機械です。取引、信用、人間の本性が動かす。パターンが見えれば、より良い判断ができます。",
    },
    thinkAbout: {
      en: "You now understand more about how the economy works than most people. How will you apply these three rules to your own financial decisions?",
      es: "Ahora entiendes más sobre economía que la mayoría. ¿Cómo aplicarás estas reglas a tus decisiones financieras?",
      ko: "이제 대부분의 사람들보다 경제가 어떻게 작동하는지 더 잘 이해합니다. 이 세 가지 법칙을 어떻게 적용하시겠습니까?",
      zh: "你现在比大多数人更了解经济运作。你将如何把这三条法则应用到自己的财务决策中？",
      ja: "あなたは今、ほとんどの人より経済の仕組みを理解しています。この3つのルールをどう活かしますか？",
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ DATA (aligned with lesson order)
// ═══════════════════════════════════════════════════════════════
const quizData = [
  { q: { en: "What drives the economy?", es: "¿Qué impulsa la economía?", ko: "경제를 움직이는 것은?", zh: "什么驱动经济？", ja: "経済を動かすものは？" },
    opts: { en: ["Total spending (money + credit)", "Only government spending", "Gold reserves", "Stock prices"], es: ["Gasto total (dinero + crédito)", "Solo gasto del gobierno", "Reservas de oro", "Precios de acciones"], ko: ["총 지출 (돈 + 신용)", "정부 지출만", "금 보유량", "주가"], zh: ["总支出（货币+信贷）", "仅政府支出", "黄金储备", "股票价格"], ja: ["総支出（お金+信用）", "政府支出のみ", "金準備", "株価"] },
    answer: 0, explain: { en: "Total spending drives the economy. Spending = money + credit. Every dollar spent becomes someone else's income.", es: "El gasto total impulsa la economía.", ko: "총 지출이 경제를 움직입니다.", zh: "总支出驱动经济。", ja: "総支出が経済を動かします。" } },
  { q: { en: "What is the most important part of the economy?", es: "¿Cuál es la parte más importante?", ko: "경제에서 가장 중요한 부분은?", zh: "经济中最重要的部分是什么？", ja: "経済で最も重要な部分は？" },
    opts: { en: ["Credit", "Gold", "Government", "Technology"], es: ["Crédito", "Oro", "Gobierno", "Tecnología"], ko: ["신용", "금", "정부", "기술"], zh: ["信贷", "黄金", "政府", "技术"], ja: ["信用", "金", "政府", "技術"] },
    answer: 0, explain: { en: "Credit is the most important and most volatile part of the economy. US credit: ~$50T vs actual money: ~$3T.", es: "El crédito es la parte más importante y volátil.", ko: "신용은 경제에서 가장 중요하고 변동성이 큰 부분입니다.", zh: "信贷是经济中最重要、最不稳定的部分。", ja: "信用は経済で最も重要かつ最も変動が大きい部分。" } },
  { q: { en: "How long is the short-term debt cycle?", es: "¿Cuánto dura el ciclo corto?", ko: "단기 부채 순환의 기간은?", zh: "短期债务周期多长？", ja: "短期債務サイクルの期間は？" },
    opts: { en: ["5-8 years", "1-2 years", "20-30 years", "75-100 years"], es: ["5-8 años", "1-2 años", "20-30 años", "75-100 años"], ko: ["5-8년", "1-2년", "20-30년", "75-100년"], zh: ["5-8年", "1-2年", "20-30年", "75-100年"], ja: ["5-8年", "1-2年", "20-30年", "75-100年"] },
    answer: 0, explain: { en: "The short-term debt cycle lasts 5-8 years. It's the business cycle controlled primarily by the central bank through interest rates.", es: "El ciclo corto dura 5-8 años.", ko: "단기 부채 순환은 5-8년입니다.", zh: "短期债务周期持续5-8年。", ja: "短期債務サイクルは5-8年。" } },
  { q: { en: "What causes inflation?", es: "¿Qué causa la inflación?", ko: "인플레이션의 원인은?", zh: "什么导致通胀？", ja: "インフレの原因は？" },
    opts: { en: ["Spending growing faster than production", "Too little government spending", "Low interest rates alone", "Stock market crashes"], es: ["Gasto creciendo más rápido que producción", "Poco gasto del gobierno", "Tasas bajas solas", "Caídas bursátiles"], ko: ["지출이 생산보다 빠르게 증가", "정부 지출 부족", "낮은 금리만으로", "주식시장 폭락"], zh: ["支出增长快于生产", "政府支出太少", "仅低利率", "股市崩盘"], ja: ["支出が生産より速く増加", "政府支出不足", "低金利だけ", "株式市場暴落"] },
    answer: 0, explain: { en: "When spending and incomes grow faster than the production of goods, prices rise. That's inflation.", es: "Cuando el gasto crece más rápido que la producción, los precios suben.", ko: "지출과 소득이 생산보다 빠르게 증가하면 가격이 오릅니다.", zh: "当支出增长快于商品生产时价格上涨。", ja: "支出が生産より速く増えると物価が上がる。" } },
  { q: { en: "What happens during deleveraging that's different from recession?", es: "¿Qué pasa en un desapalancamiento diferente de recesión?", ko: "디레버리징이 경기침체와 다른 점은?", zh: "去杠杆与衰退有什么不同？", ja: "デレバレッジングが景気後退と違う点は？" },
    opts: { en: ["Interest rates are already at 0% — can't cut more", "Stock market goes up", "Government stops spending", "Banks have too much money"], es: ["Tasas ya en 0% — no se pueden bajar más", "La bolsa sube", "El gobierno deja de gastar", "Bancos tienen demasiado"], ko: ["금리가 이미 0% — 더 인하할 수 없음", "주식시장 상승", "정부 지출 중단", "은행에 돈이 너무 많음"], zh: ["利率已经是0%——无法再降", "股市上涨", "政府停止支出", "银行钱太多"], ja: ["金利がすでに0% — これ以上下げられない", "株式市場上昇", "政府が支出停止", "銀行の資金過多"] },
    answer: 0, explain: { en: "In a deleveraging, rates are already at 0%, so the Fed's normal tool (cutting rates) doesn't work. That's why QE and the other tools are needed.", es: "En un desapalancamiento, las tasas ya están en 0%.", ko: "디레버리징에서는 금리가 이미 0%이므로 일반적인 금리 인하가 작동하지 않습니다.", zh: "去杠杆时利率已是0%，普通降息无效。", ja: "デレバレッジでは金利がすでに0%で通常の利下げが機能しない。" } },
  { q: { en: "An inverted yield curve predicts:", es: "Una curva invertida predice:", ko: "수익률 곡선 역전은 무엇을 예측하나요?", zh: "收益率曲线倒挂预示着：", ja: "逆イールドカーブが予測するのは：" },
    opts: { en: ["Recession within 12-18 months", "Immediate stock rally", "Low inflation", "Strong GDP growth"], es: ["Recesión en 12-18 meses", "Alza inmediata", "Inflación baja", "PIB fuerte"], ko: ["12-18개월 내 경기침체", "즉각적 주가 상승", "낮은 인플레이션", "강한 GDP 성장"], zh: ["12-18个月内衰退", "股市立即上涨", "低通胀", "强GDP增长"], ja: ["12-18ヶ月以内の景気後退", "即座の株価上昇", "低インフレ", "強いGDP成長"] },
    answer: 0, explain: { en: "Inverted yield curves have predicted every US recession since 1955. When short rates exceed long rates, it signals economic weakness ahead.", es: "Las curvas invertidas han predicho cada recesión de EE.UU. desde 1955.", ko: "역전된 수익률 곡선은 1955년 이후 모든 미국 경기침체를 예측했습니다.", zh: "倒挂的收益率曲线预测了1955年以来的每一次美国衰退。", ja: "逆イールドは1955年以来全ての米国景気後退を予測。" } },
  { q: { en: "What is QE (Quantitative Easing)?", es: "¿Qué es QE?", ko: "양적완화(QE)란?", zh: "什么是QE？", ja: "QEとは？" },
    opts: { en: ["Central bank buys bonds to inject money when rates are at 0%", "Government raises taxes", "Banks stop lending", "Prices frozen by law"], es: ["Banco central compra bonos cuando tasas están en 0%", "Gobierno sube impuestos", "Bancos dejan de prestar", "Precios congelados"], ko: ["금리가 0%일 때 중앙은행이 채권 매입으로 자금 공급", "정부 세금 인상", "은행 대출 중단", "법으로 물가 동결"], zh: ["利率为0%时央行买债券注入资金", "政府加税", "银行停贷", "法律冻结价格"], ja: ["金利0%時に中央銀行が債券購入で資金注入", "政府が増税", "銀行が融資停止", "法律で物価凍結"] },
    answer: 0, explain: { en: "QE is the Fed's emergency tool. When rates are at 0%, it prints money to buy bonds, injecting liquidity into the system.", es: "QE es la herramienta de emergencia del Fed.", ko: "QE는 연준의 비상 도구입니다.", zh: "QE是美联储的紧急工具。", ja: "QEはFRBの緊急ツール。" } },
  { q: { en: "The first rule of thumb for managing debt is:", es: "La primera regla general para manejar la deuda es:", ko: "부채 관리의 첫 번째 경험 법칙은:", zh: "管理债务的第一条经验法则是：", ja: "債務管理における最初の経験則は：" },
    opts: { en: ["Don't have debt rise faster than income", "Always buy stocks", "Never borrow money", "Save 50% of income"], es: ["No dejes que la deuda crezca más rápido que los ingresos", "Siempre comprar acciones", "Nunca pedir prestado", "Ahorrar 50%"], ko: ["부채가 소득보다 빠르게 증가하지 않게 하라", "항상 주식을 사라", "절대 빌리지 마라", "소득의 50%를 저축하라"], zh: ["不要让债务增长快于收入", "总是买股票", "永不借钱", "存收入的50%"], ja: ["債務が所得より速く増えないようにする", "常に株を買う", "決して借金しない", "収入の50%を貯蓄"] },
    answer: 0, explain: { en: "If debt rises faster than income, your debt burdens will eventually crush you. This applies to individuals AND nations.", es: "Si la deuda crece más rápido que los ingresos, te aplastará.", ko: "부채가 소득보다 빠르게 증가하면 결국 부채 부담에 짓눌립니다.", zh: "如果债务增长快于收入，债务负担最终会压垮你。", ja: "債務が所得より速く増えると、債務負担に押しつぶされる。" } },
  { q: { en: "What matters most for economic growth in the long run?", es: "¿Qué es lo más importante para el crecimiento económico a largo plazo?", ko: "장기적으로 경제 성장에 가장 중요한 것은?", zh: "从长期来看，什么对经济增长最重要？", ja: "長期的に経済成長にとって最も重要なものは？" },
    opts: { en: ["Productivity growth", "Credit expansion", "Government stimulus", "Stock market gains"], es: ["Crecimiento de la productividad", "Expansión del crédito", "Estímulo gubernamental", "Ganancias del mercado bursátil"], ko: ["생산성 성장", "신용 확장", "정부 부양책", "주식시장 상승"], zh: ["生产力增长", "信贷扩张", "政府刺激", "股市收益"], ja: ["生産性成長", "信用拡大", "政府の景気刺激策", "株式市場の上昇"] },
    answer: 0, explain: { en: "Productivity growth is what raises living standards over the long run. Credit matters most in the short run and creates the cycles — but it can't create real, lasting growth on its own.", es: "El crecimiento de la productividad es lo que eleva el nivel de vida a largo plazo. El crédito importa más a corto plazo y crea los ciclos, pero no puede generar crecimiento real por sí solo.", ko: "생산성 성장이 장기적으로 생활 수준을 높입니다. 신용은 단기적으로 가장 중요하며 순환을 만들지만, 그 자체로는 실질적이고 지속적인 성장을 만들 수 없습니다.", zh: "生产力增长才是长期提升生活水平的因素。信贷在短期最重要，会制造周期——但它自身无法创造真实、持久的增长。", ja: "生産性成長こそが長期的に生活水準を高めるもの。信用は短期的に最も重要でサイクルを生みますが、それ自体では本当の持続的成長は生み出せません。" } },
  { q: { en: "Which of these is NOT one of the 4 tools for reducing a debt burden?", es: "¿Cuál de estas NO es una de las 4 herramientas para reducir la carga de deuda?", ko: "다음 중 부채 부담을 줄이는 4가지 도구가 아닌 것은?", zh: "以下哪一项不是减轻债务负担的4种工具之一？", ja: "次のうち、債務負担を軽減する4つの手段に含まれないものは？" },
    opts: { en: ["Austerity (cutting spending)", "Debt restructuring or default", "Printing money (QE)", "Raising interest rates further"], es: ["Austeridad (recortar gasto)", "Reestructuración o impago de deuda", "Imprimir dinero (QE)", "Subir aún más las tasas de interés"], ko: ["긴축 (지출 삭감)", "부채 구조조정 또는 채무불이행", "화폐 발행 (QE)", "금리를 더 인상하는 것"], zh: ["紧缩（削减支出）", "债务重组或违约", "印钞（QE）", "进一步加息"], ja: ["緊縮（支出削減）", "債務再編またはデフォルト", "紙幣印刷（QE）", "さらなる利上げ"] },
    answer: 3, explain: { en: "The 4 tools are austerity, debt restructuring/default, wealth redistribution (taxes), and printing money. Raising rates further isn't one of them — in a deleveraging, rates are usually already near 0%.", es: "Las 4 herramientas son austeridad, reestructuración/impago, redistribución de riqueza e impresión de dinero. Subir más las tasas no es una de ellas.", ko: "4가지 도구는 긴축, 부채 구조조정/채무불이행, 부의 재분배(증세), 화폐 발행입니다. 금리를 더 올리는 것은 포함되지 않습니다.", zh: "这4种工具是紧缩、债务重组/违约、财富再分配（增税）和印钞。进一步加息不在其中。", ja: "4つの手段は緊縮、債務再編/デフォルト、富の再分配（増税）、紙幣印刷です。さらなる利上げは含まれません。" } },
  { q: { en: "What is the Fed Funds Rate?", es: "¿Qué es la Tasa de Fondos Federales?", ko: "연방기금금리(Fed Funds Rate)란 무엇인가요?", zh: "什么是联邦基金利率？", ja: "FF金利（フェデラルファンド金利）とは何ですか？" },
    opts: { en: ["The key rate that influences nearly all other interest rates", "A tax rate on capital gains", "The interest rate on 30-year Treasury bonds only", "A rate set directly by Congress"], es: ["La tasa clave que influye en casi todas las demás tasas de interés", "Una tasa de impuesto sobre ganancias de capital", "La tasa de interés solo de los bonos del Tesoro a 30 años", "Una tasa fijada directamente por el Congreso"], ko: ["거의 모든 다른 금리에 영향을 미치는 핵심 금리", "자본이득에 대한 세율", "30년 국채에만 적용되는 금리", "의회가 직접 정하는 금리"], zh: ["影响几乎所有其他利率的关键利率", "资本利得税率", "仅适用于30年期国债的利率", "由国会直接设定的利率"], ja: ["ほぼ全ての他の金利に影響を与える基準金利", "キャピタルゲインへの税率", "30年国債にのみ適用される金利", "議会が直接定める金利"] },
    answer: 0, explain: { en: "The Fed Funds Rate is the rate banks charge each other overnight, set by the Federal Reserve. It's the master signal that ripples out to mortgages, savings accounts, and credit cards.", es: "Es la tasa que los bancos se cobran entre sí de un día para otro, fijada por la Reserva Federal.", ko: "연방기금금리는 연방준비제도가 정하는, 은행 간 익일 대출 금리입니다.", zh: "联邦基金利率是银行间隔夜拆借利率，由美联储设定。", ja: "FF金利は連邦準備制度が設定する銀行間のオーバーナイト金利。" } },
  { q: { en: "During the 'Trough' phase of the economic cycle, historically:", es: "Durante la fase de 'Valle' del ciclo económico, históricamente:", ko: "경제 순환의 '저점' 국면에서 역사적으로:", zh: "在经济周期的'低谷'阶段，历史上：", ja: "経済サイクルの「底」局面では、歴史的に：" },
    opts: { en: ["Pessimism is at its worst, but it has often been a strong time to find investment opportunities", "Interest rates are typically at their highest point", "Inflation is usually at its peak", "Stocks have historically continued falling for years afterward"], es: ["El pesimismo está en su peor momento, pero a menudo ha sido un buen momento para encontrar oportunidades", "Las tasas de interés suelen estar en su punto más alto", "La inflación suele estar en su punto máximo", "Las acciones históricamente han seguido cayendo durante años"], ko: ["비관론이 최악이지만, 종종 투자 기회를 찾기 좋은 시기였습니다", "금리가 보통 최고점에 있습니다", "인플레이션이 보통 정점에 있습니다", "주식은 역사적으로 이후 몇 년간 계속 하락했습니다"], zh: ["悲观情绪最严重，但这往往是寻找投资机会的好时机", "利率通常处于最高点", "通胀通常处于顶峰", "股票历史上此后会继续下跌数年"], ja: ["悲観が最悪の状態だが、しばしば投資機会を見つけるのに適した時期だった", "金利が通常最も高い", "インフレが通常ピークにある", "株価は歴史的にその後何年も下落し続けた"] },
    answer: 0, explain: { en: "At the trough, sentiment is at its most negative — but historically, the year following a market bottom has shown some of the strongest average returns, since expansion begins again from there. This is a historical pattern, not a guarantee for any specific future trough.", es: "En el valle, el sentimiento es el más negativo, pero históricamente el año siguiente ha mostrado retornos fuertes. Esto es un patrón histórico, no una garantía.", ko: "저점에서는 심리가 가장 부정적이지만, 역사적으로 시장 바닥 이후 1년은 평균적으로 가장 강한 수익률을 보였습니다. 이는 역사적 패턴이며 보장이 아닙니다.", zh: "在低谷时情绪最负面，但历史上市场触底后一年往往显示最强的平均回报。这是历史规律，不是保证。", ja: "底では心理が最も悲観的になりますが、歴史的に見ると底打ち後の1年は平均リターンが最も強い時期の一つでした。これは歴史的パターンであり保証ではありません。" } },
  { q: { en: "Which economic indicator is often called the 'Fear Gauge'?", es: "¿Qué indicador económico se conoce a menudo como el 'Índice del Miedo'?", ko: "'공포지수'라고 자주 불리는 경제 지표는?", zh: "哪个经济指标常被称为'恐慌指数'？", ja: "「恐怖指数」としばしば呼ばれる経済指標は？" },
    opts: { en: ["VIX (Volatility Index)", "GDP", "CPI", "PMI"], es: ["VIX (Índice de Volatilidad)", "PIB", "IPC", "PMI"], ko: ["VIX (변동성지수)", "GDP", "CPI", "PMI"], zh: ["VIX（波动率指数）", "GDP", "CPI", "PMI"], ja: ["VIX（ボラティリティ指数）", "GDP", "CPI", "PMI"] },
    answer: 0, explain: { en: "The VIX measures expected market volatility. Below 15 signals calm markets; above 40 signals extreme panic. Contrarian investors watch for spikes as potential buying opportunities.", es: "El VIX mide la volatilidad esperada. Por debajo de 15 señala calma; por encima de 40, pánico extremo.", ko: "VIX는 시장의 예상 변동성을 측정합니다. 15 미만은 안정, 40 이상은 극단적 공포를 나타냅니다.", zh: "VIX衡量市场预期波动率。低于15表示平静，高于40表示极度恐慌。", ja: "VIXは市場の予想変動率を測定。15未満は落ち着き、40以上は極度のパニックを示す。" } },
];

// ═══════════════════════════════════════════════════════════════
// GLOSSARY (compact — English primary with translations)
// ═══════════════════════════════════════════════════════════════
const glossary = {
  "GDP": { en: { s: "Gross Domestic Product", f: "Total value of all goods/services produced. Rising = expansion. Falling 2+ quarters = recession." }, ko: { s: "국내총생산", f: "생산된 모든 재화와 서비스의 총 가치." }, es: { s: "Producto Interno Bruto", f: "Valor total de bienes y servicios producidos." }, zh: { s: "国内生产总值", f: "所有商品和服务的总价值。" }, ja: { s: "国内総生産", f: "全ての財・サービスの総額。" } },
  "CPI": { en: { s: "Consumer Price Index", f: "Measures average price changes. Main inflation gauge. Fed targets ~2%." }, ko: { s: "소비자물가지수", f: "평균 가격 변동 측정. 연준 목표: ~2%." }, es: { s: "Índice de Precios al Consumidor", f: "Mide cambios de precios. Meta del Fed: ~2%." }, zh: { s: "消费者价格指数", f: "衡量价格变化。美联储目标约2%。" }, ja: { s: "消費者物価指数", f: "価格変動を測定。FRB目標：約2%。" } },
  "Fed Funds Rate": { en: { s: "Federal Funds Rate", f: "The rate banks charge each other overnight. Set by the Fed. THE key rate that influences ALL other rates." }, ko: { s: "연방기금금리", f: "은행 간 야간 대출 금리. 모든 금리에 영향." }, es: { s: "Tasa de Fondos Federales", f: "Tasa entre bancos. La tasa clave." }, zh: { s: "联邦基金利率", f: "银行间隔夜拆借利率。影响所有利率。" }, ja: { s: "FF金利", f: "銀行間のオーバーナイト金利。全金利に影響。" } },
  "Yield Curve": { en: { s: "Yield Curve", f: "Graph of gov bond rates at different maturities. Inverted = recession signal within 12-18 months." }, ko: { s: "수익률 곡선", f: "다른 만기의 국채 금리 그래프. 역전 = 경기침체 신호." }, es: { s: "Curva de Rendimiento", f: "Gráfico de tasas de bonos. Invertida = señal de recesión." }, zh: { s: "收益率曲线", f: "不同期限国债利率图。倒挂=衰退信号。" }, ja: { s: "イールドカーブ", f: "異なる満期の国債金利グラフ。逆転=景気後退シグナル。" } },
  "QE": { en: { s: "Quantitative Easing", f: "Fed buys bonds to inject money when rates are at 0%. Inflationary, stimulative." }, ko: { s: "양적완화", f: "금리 0%시 연준의 채권 매입. 인플레이션적, 부양적." }, es: { s: "Flexibilización Cuantitativa", f: "Fed compra bonos cuando tasas en 0%." }, zh: { s: "量化宽松", f: "利率为0%时央行购债注入资金。" }, ja: { s: "量的緩和", f: "金利0%時にFRBが債券購入。" } },
  "QT": { en: { s: "Quantitative Tightening", f: "Fed shrinks balance sheet by letting bonds mature. Drains money, deflationary." }, ko: { s: "양적긴축", f: "연준 대차대조표 축소. 자금 회수, 디플레이션적." }, es: { s: "Ajuste Cuantitativo", f: "Fed reduce balance dejando bonos vencer." }, zh: { s: "量化紧缩", f: "美联储缩表。抽走资金。" }, ja: { s: "量的引き締め", f: "FRBバランスシート縮小。資金吸収。" } },
  "Deleveraging": { en: { s: "Deleveraging", f: "When debt is too large. 4 tools: (1) Austerity, (2) Debt restructuring, (3) Wealth redistribution, (4) Money printing." }, ko: { s: "디레버리징", f: "부채가 과도할 때. 4가지 도구: 긴축, 구조조정, 부의 재분배, 화폐 발행." }, es: { s: "Desapalancamiento", f: "Cuando la deuda es excesiva. 4 herramientas." }, zh: { s: "去杠杆", f: "债务过大时。4个工具。" }, ja: { s: "デレバレッジ", f: "債務が大きすぎる時。4つの手段。" } },
  "Credit Spread": { en: { s: "Credit Spread", f: "Gap between corporate and gov bond yields. Narrow = confidence. Wide = fear/crisis." }, ko: { s: "신용 스프레드", f: "회사채와 국채의 금리 차. 축소=신뢰, 확대=공포." }, es: { s: "Diferencial de Crédito", f: "Diferencia entre bonos corporativos y gubernamentales." }, zh: { s: "信用利差", f: "企业债与国债收益率之差。" }, ja: { s: "クレジットスプレッド", f: "社債と国債の利回り差。" } },
  "PMI": { en: { s: "Purchasing Managers' Index", f: "Monthly survey. Above 50 = expansion. Below 50 = contraction. Leading indicator." }, ko: { s: "구매관리자지수", f: "50 이상=확장, 50 미만=수축. 선행 지표." }, es: { s: "Índice de Gerentes de Compras", f: "Más de 50=expansión. Menos de 50=contracción." }, zh: { s: "采购经理人指数", f: "50以上=扩张，50以下=收缩。" }, ja: { s: "PMI", f: "50以上=拡大、50以下=縮小。" } },
  "VIX": { en: { s: "Volatility Index (Fear Gauge)", f: "Below 15 = calm. 25-35 = fear. Above 40 = extreme panic." }, ko: { s: "변동성지수 (공포지수)", f: "15 미만=안정, 40 이상=극단적 공포." }, es: { s: "Índice de Volatilidad", f: "Menos de 15=calma. Más de 40=pánico." }, zh: { s: "波动率指数", f: "低于15=平静，高于40=极度恐慌。" }, ja: { s: "恐怖指数", f: "15以下=平穏、40以上=パニック。" } },
  "Inflation": { en: { s: "Inflation", f: "When prices rise because spending grows faster than production. Fed targets ~2%." }, ko: { s: "인플레이션", f: "지출이 생산보다 빠르게 증가할 때 가격 상승." }, es: { s: "Inflación", f: "Cuando los precios suben." }, zh: { s: "通货膨胀", f: "支出增长快于生产时价格上涨。" }, ja: { s: "インフレ", f: "支出が生産より速く伸びて物価上昇。" } },
  "Deflation": { en: { s: "Deflation", f: "When prices fall because spending decreases. Signals economic weakness." }, ko: { s: "디플레이션", f: "지출 감소로 가격 하락." }, es: { s: "Deflación", f: "Cuando los precios bajan." }, zh: { s: "通货紧缩", f: "支出减少导致价格下降。" }, ja: { s: "デフレ", f: "支出減少で物価下落。" } },
  "Recession": { en: { s: "Recession", f: "2+ consecutive quarters of declining GDP. Central bank can fix with rate cuts." }, ko: { s: "경기침체", f: "GDP가 2분기 이상 연속 하락." }, es: { s: "Recesión", f: "2+ trimestres de PIB cayendo." }, zh: { s: "经济衰退", f: "GDP连续两季度下降。" }, ja: { s: "景気後退", f: "GDP2四半期以上連続低下。" } },
  "Bubble": { en: { s: "Bubble", f: "When people borrow heavily to buy assets, pushing prices far above fair value." }, ko: { s: "버블", f: "사람들이 자산을 사기 위해 과도하게 빌릴 때." }, es: { s: "Burbuja", f: "Cuando la gente pide mucho prestado para comprar activos." }, zh: { s: "泡沫", f: "人们大量借钱购买资产推高价格。" }, ja: { s: "バブル", f: "人々が資産を買うために大量に借りる時。" } },
  "Credit": { en: { s: "Credit", f: "Money borrowed that must be repaid with interest. Spends just like money and is the most volatile part of the economy — in the US, total credit (~$50T) vastly exceeds actual money (~$3T)." }, ko: { s: "신용", f: "이자와 함께 상환해야 하는 차입금. 돈처럼 사용되며 경제에서 가장 변동성이 큰 부분." }, es: { s: "Crédito", f: "Dinero prestado que debe devolverse con interés. Se gasta igual que el dinero y es la parte más volátil de la economía." }, zh: { s: "信贷", f: "必须连本带息偿还的借款。花费方式与货币相同，是经济中最不稳定的部分。" }, ja: { s: "信用", f: "利息とともに返済しなければならない借入金。お金と同じように使われ、経済で最も変動が大きい部分。" } },
  "Productivity Growth": { en: { s: "Productivity Growth", f: "The steady, long-run increase in output per worker from accumulated knowledge and skill. Unlike credit, it doesn't swing wildly — it's the true long-run driver of higher living standards." }, ko: { s: "생산성 성장", f: "축적된 지식과 기술로 인한 근로자 1인당 생산량의 꾸준한 장기 증가. 생활 수준 향상의 진정한 장기 동력." }, es: { s: "Crecimiento de la Productividad", f: "El aumento constante y a largo plazo de la producción por trabajador. Es el verdadero motor a largo plazo de un mayor nivel de vida." }, zh: { s: "生产力增长", f: "由积累的知识和技能带来的每位工人产出的稳定长期增长。是提高生活水平的真正长期驱动力。" }, ja: { s: "生産性成長", f: "蓄積された知識と技術による労働者一人当たり生産量の着実な長期的増加。生活水準向上の真の長期的推進力。" } },
  "Debt-to-GDP Ratio": { en: { s: "Debt-to-GDP Ratio", f: "Total debt divided by a country's total economic output (GDP), used as a rough gauge of how large a debt burden is relative to the size of the economy." }, ko: { s: "GDP 대비 부채 비율", f: "총 부채를 국가의 총 경제 생산(GDP)으로 나눈 값. 부채 부담의 상대적 크기를 가늠하는 대략적인 지표." }, es: { s: "Ratio Deuda/PIB", f: "Deuda total dividida por la producción económica total (PIB) de un país. Mide cuán grande es la carga de deuda en relación al tamaño de la economía." }, zh: { s: "债务与GDP比率", f: "总债务除以一个国家的总经济产出（GDP），用作衡量债务负担相对规模的粗略指标。" }, ja: { s: "債務対GDP比率", f: "総債務を国の総経済生産（GDP）で割った値。債務負担が経済規模に対してどれほど大きいかを大まかに測る指標。" } },
};

// ═══════════════════════════════════════════════════════════════
// KIDS CONTENT
// ═══════════════════════════════════════════════════════════════
const kidsContent = {
  "5-8": {
    title: { en: "Money Adventures!", es: "¡Aventuras con Dinero!", ko: "돈의 모험!", zh: "金钱冒险！", ja: "お金の冒険！" },
    lessons: [
      { en: "When you trade your toy for a friend's toy, that's a TRANSACTION! The economy is just millions of trades like this.", es: "Cuando cambias tu juguete por el de un amigo, ¡eso es una TRANSACCIÓN!", ko: "장난감을 친구의 장난감과 교환하면, 그것이 거래입니다!", zh: "当你用玩具换朋友的玩具时，这就是交易！", ja: "おもちゃを友達のと交換したら、それが取引！" },
      { en: "If everyone wants the same toy but there aren't many, the price goes UP. That's like inflation!", es: "Si todos quieren el mismo juguete pero hay pocos, ¡el precio sube!", ko: "모두가 같은 장난감을 원하지만 적으면, 가격이 올라갑니다!", zh: "如果大家都想要同一个玩具但数量很少，价格就会上涨！", ja: "みんなが同じおもちゃを欲しがって数が少ないと値段が上がる！" },
      { en: "A piggy bank is like a little BANK. Money goes in (saving) and comes out (spending). The economy needs both!", es: "Una alcancía es como un BANCO pequeño. El dinero entra y sale.", ko: "돼지 저금통은 작은 은행과 같습니다. 돈이 들어가고(저축) 나옵니다(지출).", zh: "存钱罐就像一个小银行。钱进去（储蓄）又出来（消费）。", ja: "ブタの貯金箱は小さな銀行。お金が入って（貯蓄）出る（消費）。" },
    ],
    activity: { en: "Set up a pretend store! Price items, buy and sell with play money. See how prices change when things are popular!", es: "¡Monta una tienda de juego! Pon precios, compra y vende.", ko: "놀이 가게를 열어보세요! 가격을 매기고, 놀이 돈으로 사고 팔아보세요.", zh: "开一个假装商店！给物品定价，用玩具钱买卖。", ja: "お店ごっこをしよう！値段をつけて、おもちゃのお金で売り買い。" },
    parentTip: { en: "Use allowance as a teaching tool: help them divide money into 'Spend,' 'Save,' and 'Give' jars.", es: "Usa la mesada como herramienta de enseñanza.", ko: "용돈을 교육 도구로 활용하세요: '쓰기', '저축', '나누기' 통으로 나누기.", zh: "用零花钱作为教学工具：分成'花费'、'储蓄'、'捐赠'三个罐子。", ja: "お小遣いを教育ツールに：「使う」「貯める」「あげる」の瓶に分けよう。" },
  },
  "9-12": {
    title: { en: "How Money Moves", es: "Cómo se Mueve el Dinero", ko: "돈의 움직임", zh: "钱如何流动", ja: "お金の動き" },
    lessons: [
      { en: "When your parents borrow money for a house (mortgage), they're using CREDIT. They pay it back over years with INTEREST — that's the cost of borrowing.", es: "Cuando tus padres piden un préstamo para una casa, usan CRÉDITO.", ko: "부모님이 집을 위해 돈을 빌리면 (모기지), 신용을 사용하는 것입니다.", zh: "父母借钱买房（按揭）就是在用信贷。他们多年还款加上利息。", ja: "親が家のためにお金を借りる（住宅ローン）時、それが信用。" },
      { en: "The economy goes through seasons like nature: Growth (spring) → Peak (summer) → Slowdown (fall) → Bottom (winter) → Growth again!", es: "La economía tiene estaciones como la naturaleza: Crecimiento → Pico → Desaceleración → Fondo → ¡Crecimiento otra vez!", ko: "경제도 자연처럼 계절이 있습니다: 성장(봄) → 정점(여름) → 둔화(가을) → 바닥(겨울) → 다시 성장!", zh: "经济像自然一样有四季：增长（春）→ 顶峰（夏）→ 放缓（秋）→ 低谷（冬）→ 再次增长！", ja: "経済にも自然のような季節がある：成長（春）→ ピーク（夏）→ 減速（秋）→ 底（冬）→ また成長！" },
      { en: "When your lemonade stand does well, you might borrow money to buy a bigger stand. If you earn more than the loan costs, that's GOOD debt!", es: "Si tu puesto de limonada va bien y pides prestado para uno más grande, ¡eso es deuda BUENA!", ko: "레모네이드 가판대가 잘 되면 더 큰 것을 사기 위해 빌릴 수 있습니다. 대출 비용보다 더 많이 벌면 좋은 부채입니다!", zh: "如果你的柠檬水摊生意好，借钱买更大的摊位，赚的比借的多，这就是好的债务！", ja: "レモネードスタンドが好調なら、大きな店を買うために借金。ローンより多く稼げば良い借金！" },
    ],
    activity: { en: "Track prices of 5 items at the grocery store for a month. Did they go up or down? You're measuring inflation!", es: "Rastrea precios de 5 artículos del super por un mes. ¡Estás midiendo la inflación!", ko: "한 달 동안 마트에서 5가지 품목의 가격을 추적해보세요. 인플레이션을 측정하고 있는 겁니다!", zh: "跟踪超市5件商品一个月的价格变化。你在测量通胀！", ja: "スーパーで5品目の価格を1ヶ月追跡。インフレを測定してるよ！" },
    parentTip: { en: "Open a savings account together. Show them interest earned — that's the bank paying to use their money!", es: "Abran una cuenta de ahorro juntos.", ko: "함께 저축 계좌를 개설하세요. 이자가 붙는 것을 보여주세요!", zh: "一起开个储蓄账户。让他们看到利息——银行付费使用他们的钱！", ja: "一緒に貯蓄口座を開こう。利息を見せて — 銀行がお金を借りた対価！" },
  },
  "13-17": {
    title: { en: "Real-World Economics", es: "Economía del Mundo Real", ko: "현실 세계의 경제학", zh: "现实世界经济学", ja: "実社会の経済学" },
    lessons: [
      { en: "Economists have a saying: every dollar you spend is someone else's income. When you buy a coffee, you pay the barista, who pays rent, whose landlord pays a mortgage. It's all connected!", es: "Los economistas tienen un dicho: cada dólar que gastas es el ingreso de alguien más. ¡Todo está conectado!", ko: "경제학자들이 흔히 하는 말이 있습니다: 당신이 쓰는 모든 달러는 다른 사람의 소득입니다. 커피를 사면 바리스타에게 돈이 가고, 그 사람이 월세를 내고, 집주인이 모기지를 갚습니다. 모두 연결되어 있습니다!", zh: "经济学家常说：你花的每一美元都是别人的收入。买咖啡时，你付钱给咖啡师，咖啡师付房租，房东付按揭。全都连在一起！", ja: "経済学者たちはこう言います：使った1ドルは誰かの収入になる。コーヒーを買えばバリスタに、バリスタは家賃を、大家はローンを。全部つながっている！" },
      { en: "The Fed is like a thermostat for the economy. Too hot (inflation)? Raise rates to cool it. Too cold (recession)? Lower rates to warm it up. But it takes 12-24 months to feel the change!", es: "El Fed es como un termostato económico. ¿Muy caliente? Sube tasas. ¿Muy frío? Baja tasas. ¡Tarda 12-24 meses en sentirse!", ko: "연준은 경제의 온도 조절 장치와 같습니다. 너무 뜨거우면(인플레이션)? 금리를 올려 식힙니다. 너무 차가우면(경기침체)? 금리를 내려 따뜻하게 합니다.", zh: "美联储就像经济的恒温器。太热（通胀）？加息降温。太冷（衰退）？降息升温。但需要12-24个月才能感受到变化！", ja: "FRBは経済のサーモスタット。熱すぎ（インフレ）？利上げで冷ます。寒すぎ（後退）？利下げで温める。でも効果は12-24ヶ月後！" },
      { en: "In 2008, banks lent too much to people who couldn't pay back. When the bubble burst, it created a deleveraging — the first in 75 years. The Fed printed $2+ trillion to stop the collapse.", es: "En 2008, los bancos prestaron demasiado a quienes no podían pagar. Cuando la burbuja estalló, el Fed imprimió $2T+.", ko: "2008년, 은행들이 갚을 수 없는 사람들에게 너무 많이 빌려줬습니다. 버블이 터지자 75년 만의 디레버리징이 발생했고, 연준은 $2조 이상을 발행했습니다.", zh: "2008年，银行向无力还款的人大量放贷。泡沫破裂时产生了75年来首次去杠杆。美联储印了2万亿+美元阻止崩溃。", ja: "2008年、銀行が返済できない人に貸しすぎた。バブル崩壊で75年ぶりのデレバレッジ。FRBは2兆ドル以上を印刷。" },
    ],
    activity: { en: "Pick a stock and track it for 3 months. Compare its movement to what the Fed does with rates. Can you see the connection?", es: "Elige una acción y síguala 3 meses. Compara con lo que hace el Fed.", ko: "주식 하나를 골라 3개월 동안 추적하세요. 연준의 금리 조치와 비교해보세요.", zh: "选一只股票追踪3个月。与美联储利率决策对比。能看到联系吗？", ja: "株を1つ選んで3ヶ月追跡。FRBの金利決定と比べてみよう。" },
    parentTip: { en: "Set up a practice investment account. Real-time experience is the best teacher for understanding market psychology.", es: "Configura una cuenta de inversión de práctica.", ko: "연습용 투자 계좌를 개설하세요. 실시간 경험이 시장 심리를 이해하는 최고의 교사입니다.", zh: "开设模拟投资账户。实时体验是理解市场心理的最佳老师。", ja: "練習用の投資口座を開設。リアルタイムの経験が市場心理を理解する最良の教師。" },
  },
};

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
            {Object.keys(langFlags).map(l => <option key={l} value={l} style={{ color: "#000" }}>{langFlags[l]} {langNames[l]}</option>)}
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
