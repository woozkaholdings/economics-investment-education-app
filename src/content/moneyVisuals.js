// ═══════════════════════════════════════════════════════════════════════════
// MONEY-TRACK LESSON VISUALS — labels and figures
//
// Backlog item 27. Until 2026-08-16 every diagram in the app sat on the
// economy track (5 of 12 lessons); the money track — 28 of the 40 lessons,
// and the thing LAUNCH_PLAN.md §0 calls the product rather than the vehicle —
// had none at all. A new install opens on money lesson 1, so the first screen
// a learner saw was the one arguing against §3.0.4's "show, don't only tell."
//
// Three lessons get a diagram here, chosen on §3.0.4's own test — the visual
// must *be* the explanation, not decorate it:
//   1  Budgeting        — a plan is a division of one number; show the division.
//   3  Compound Interest— the concept is literally the shape of the curve.
//   27 Loss Aversion    — the asymmetry is the lesson, and prose labours at it.
// Anything else stays prose until it passes the same test.
//
// STANDING RULES that apply here:
//   §2.3 — nothing may read as live market data. Every figure below is a
//     teaching example lifted from its own lesson's body text, not a reading.
//   §10.1 — no advice adjacency. These illustrate arithmetic and a documented
//     behavioural finding. The 6% in lesson 3 is that lesson's own teaching
//     rate for demonstrating how compounding differs from simple interest; it
//     is not a return anyone should expect, which is what `illustrationNote`
//     says under every one of these figures.
//
// Figures are the lessons' own, deliberately — a learner who reads "$1,000 at
// 6%" and then sees a chart of different numbers has been given two lessons.
// ═══════════════════════════════════════════════════════════════════════════

// ── Lesson 1: Budgeting ───────────────────────────────────────────────────
// Maria's $3,000 take-home month, split 50/30/20. Both halves come straight
// from the lesson: the body states her $600 savings, and the end-of-lesson
// check's correct answer is the 50/30/20 split. 1500 + 900 + 600 = 3000.
export const budgetSegments = [
  { key: "needs", value: 1500 },
  { key: "wants", value: 900 },
  { key: "savings", value: 600 },
];

export const budgetTitle = {
  en: "Maria's $3,000 month",
  es: "El mes de $3,000 de María",
  ko: "마리아의 한 달 $3,000",
  zh: "玛丽亚的 $3,000 一个月",
  ja: "マリアの1か月 $3,000",
};

export const budgetLabels = {
  en: ["Needs", "Wants", "Savings"],
  es: ["Necesidades", "Deseos", "Ahorro"],
  ko: ["필수 지출", "여윳돈 지출", "저축"],
  zh: ["必要开支", "非必要开支", "储蓄"],
  ja: ["必要な支出", "欲しいもの", "貯蓄"],
};

export const budgetCaption = {
  en: "Maria's plan splits her take-home pay 50/30/20 — $1,500 needs, $900 wants, and $600 set aside before the month starts rather than whatever survives it.",
  es: "El plan de María reparte su sueldo neto 50/30/20: $1,500 en necesidades, $900 en deseos y $600 apartados antes de que empiece el mes, no lo que sobre al final.",
  ko: "마리아의 계획은 실수령액을 50/30/20으로 나눕니다 — 필수 $1,500, 여윳돈 $900, 그리고 달이 끝나고 남는 돈이 아니라 시작 전에 먼저 떼어두는 저축 $600.",
  zh: "玛丽亚的计划把税后收入按 50/30/20 分配——必要开支 $1,500，非必要开支 $900，以及月初就先存下的 $600，而不是月底剩下的钱。",
  ja: "マリアの計画は手取りを50/30/20に分けます — 必要な支出$1,500、欲しいもの$900、そして月末に残った分ではなく月の初めに先取りする貯蓄$600。",
};

export const budgetDescription = {
  en: "A single bar divided into three parts: needs take half, wants just under a third, savings a fifth.",
  es: "Una barra dividida en tres partes: las necesidades ocupan la mitad, los deseos algo menos de un tercio y el ahorro una quinta parte.",
  ko: "하나의 막대가 세 부분으로 나뉩니다: 필수 지출이 절반, 여윳돈이 3분의 1보다 조금 적고, 저축이 5분의 1입니다.",
  zh: "一根横条分成三段：必要开支占一半，非必要开支略少于三分之一，储蓄占五分之一。",
  ja: "1本の棒が3つに分かれています：必要な支出が半分、欲しいものが3分の1弱、貯蓄が5分の1です。",
};

// ── Lesson 3: Compound Interest ───────────────────────────────────────────
// The lesson's own worked example: $1,000 at 6%, simple vs compound. Sampled
// every 5 years so the divergence is visible rather than implied.
//   simple   = 1000 + 60t
//   compound = 1000 * 1.06^t   (rounded to whole dollars)
export const compoundYears = [0, 5, 10, 15, 20, 25, 30];
export const compoundSeries = [
  { key: "compound", values: [1000, 1338, 1791, 2397, 3207, 4292, 5743] },
  { key: "simple", values: [1000, 1300, 1600, 1900, 2200, 2500, 2800] },
];

export const compoundTitle = {
  en: "$1,000 at 6%, over 30 years",
  es: "$1,000 al 6%, durante 30 años",
  ko: "$1,000, 연 6%, 30년",
  zh: "$1,000，年利率 6%，30 年",
  ja: "$1,000を年6%で30年",
};

export const compoundLabels = {
  en: ["Compound interest", "Simple interest"],
  es: ["Interés compuesto", "Interés simple"],
  ko: ["복리", "단리"],
  zh: ["复利", "单利"],
  ja: ["複利", "単利"],
};

export const compoundCaption = {
  en: "The same $1,000 at the same 6%. Simple interest adds $60 a year forever; compound interest earns on the interest too, so the gap widens every year — and by year 30 it is more than twice as wide.",
  es: "Los mismos $1,000 al mismo 6%. El interés simple suma $60 cada año para siempre; el compuesto también gana intereses sobre los intereses, así que la diferencia crece cada año — y en el año 30 es más del doble.",
  ko: "같은 $1,000, 같은 6%입니다. 단리는 매년 $60씩만 더하지만, 복리는 이자에도 이자가 붙어 격차가 해마다 벌어지고 30년째에는 두 배가 넘습니다.",
  zh: "同样的 $1,000，同样的 6%。单利每年只加 $60；复利让利息也生利息，差距逐年拉大——到第 30 年已超过两倍。",
  ja: "同じ$1,000、同じ6%です。単利は毎年$60を加えるだけですが、複利は利息にも利息がつくため差は年々広がり、30年目には2倍以上になります。",
};

export const compoundDescription = {
  en: "Two lines rising from the same starting point: simple interest climbs in a straight line to about $2,800, while compound interest curves upward and ends above $5,700.",
  es: "Dos líneas que suben desde el mismo punto: el interés simple asciende en línea recta hasta unos $2,800, mientras que el compuesto se curva hacia arriba y termina por encima de $5,700.",
  ko: "같은 지점에서 시작하는 두 선: 단리는 직선으로 약 $2,800까지 오르고, 복리는 위로 휘어지며 $5,700 이상에서 끝납니다.",
  zh: "两条从同一点上升的线：单利呈直线升到约 $2,800，复利则向上弯曲，最终超过 $5,700。",
  ja: "同じ点から伸びる2本の線：単利は直線的に約$2,800まで上がり、複利は上向きに曲がって$5,700を超えて終わります。",
};

// ── Lesson 27: Loss Aversion ──────────────────────────────────────────────
// Equal money, unequal weight. The 2x figure is the lesson's own ("a loss
// typically hurts roughly twice as much as an equivalent gain feels good"),
// which is the standard finding in the literature, not a number invented here.
export const lossFelt = { gain: 1, loss: -2 };

export const lossTitle = {
  en: "The same $50, felt twice over",
  es: "Los mismos $50, sentidos el doble",
  ko: "같은 $50, 두 배로 느껴지는 무게",
  zh: "同样的 $50，感受却是两倍",
  ja: "同じ$50、重さは2倍",
};

export const lossLabels = {
  en: ["Finding $50", "Losing $50"],
  es: ["Encontrar $50", "Perder $50"],
  ko: ["$50을 주웠을 때", "$50을 잃었을 때"],
  zh: ["捡到 $50", "丢了 $50"],
  ja: ["$50を拾う", "$50をなくす"],
};

export const lossAxisLabel = {
  en: "How strongly it registers",
  es: "Con cuánta fuerza se siente",
  ko: "체감되는 크기",
  zh: "感受的强烈程度",
  ja: "感じられる強さ",
};

export const lossCaption = {
  en: "The money is identical in size and the effect on the balance is identical too. The loss simply registers about twice as strongly — and it is that gap, not the $50, that ends up driving the decision.",
  es: "La cantidad es idéntica y el efecto sobre el saldo también. Lo que cambia es que la pérdida se siente unas dos veces más fuerte — y es esa diferencia, no los $50, la que acaba decidiendo.",
  ko: "금액도 같고 잔고에 미치는 영향도 같습니다. 다만 손실이 약 두 배로 크게 느껴질 뿐이며, 결정을 좌우하는 것은 $50이 아니라 바로 그 차이입니다.",
  zh: "金额完全相同，对余额的影响也相同。区别只在于损失的感受约为两倍——真正左右决定的是这个差距，而不是这 $50。",
  ja: "金額は同じで、残高への影響も同じです。違うのは損失がおよそ2倍強く感じられることだけで、決断を左右するのはその差であって$50ではありません。",
};

export const lossDescription = {
  en: "Two bars from a centre line: the gain rises one step above it, the loss drops about twice as far below.",
  es: "Dos barras desde una línea central: la ganancia sube un paso por encima y la pérdida baja aproximadamente el doble.",
  ko: "중앙선을 기준으로 한 두 막대: 이득은 한 칸 위로 올라가고, 손실은 그 약 두 배만큼 아래로 내려갑니다.",
  zh: "以中线为基准的两根柱：收益向上一格，损失向下约两倍。",
  ja: "中心線から伸びる2本の棒：利益は1目盛り上に、損失はその約2倍下に伸びます。",
};
