// ═══════════════════════════════════════════════════════════════════════════
// PERSONAL-FINANCE LESSON VISUALS — labels and figures
//
// Backlog item 27. Until 2026-08-16 every diagram in the app sat on the
// economy track (5 of 12 lessons); the then-28-lesson money track — which
// LAUNCH_PLAN.md §0 called the product rather than the vehicle at the time —
// had none at all, and a new install opened on its lesson 1, so the first
// screen a learner saw argued against §3.0.4's "show, don't only tell."
//
// BOTH of those framings have since been overtaken, and the file name has not
// caught up: the 2026-08-18 reordering made ECONOMY the lead track (a new
// install now opens on lesson 29), and the 2026-08-19 essentials split
// (5633b79) re-tracked lessons 1-15 without renumbering them. Of the four
// lessons below, 1/3/7 are `essentials` today and only 27 is `money` — so
// these are personal-finance figures, not one track's. The module keeps its
// `moneyVisuals.js` filename because renaming it churns every import for a
// comment's sake; the name is historical, the header is not.
//
// Four lessons get a diagram here, chosen on §3.0.4's own test — the visual
// must *be* the explanation, not decorate it:
//   1  Budgeting        — a plan is a division of one number; show the division.
//   3  Compound Interest— the concept is literally the shape of the curve.
//   7  Marginal Tax     — the prose already asks the reader to picture a stack.
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
// **Lesson 7 is the one deliberate exception, and the reason matters.** That
// lesson carries no rates or thresholds at all: it says "the first bucket might
// tax the first slice at a low rate," on purpose, because real brackets are
// re-indexed every year and jurisdiction-specific. Copying real ones in would
// put a figure in the app that silently goes stale — precisely the class §2.3
// exists to stop. So lesson 7's bands below are round, obviously-stylised
// numbers (10/20/30% at $20k/$50k), the title says "example rates" in all five
// languages, and `illustrationNote` renders beneath as it does for the others.
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

// ── Lesson 7: Marginal Tax Brackets ───────────────────────────────────────
// The lesson's first sentence is "Imagine income tax as a stack of buckets,
// each with its own rate, and money fills them from the bottom up." It was
// asking the reader to picture something the app declined to draw, and then
// spending three paragraphs on the misconception ("a raise can push you into a
// higher bracket and leave you with less") that one picture settles.
//
// The rates and thresholds are stylised, not real — see the header for why.
// $44,000 sits inside the middle band and $54,000 crosses into the top one, so
// the raise splits across two bands, which is the part prose handles worst:
// only the slice that overflowed is taxed higher, not the whole raise and
// certainly not the income underneath it.
//
// The $10,000 raise is sized from the *rendered* figure, not chosen on paper.
// An earlier draft used $48,000 → $54,000, and in a live browser at 375px the
// $2,000 of that raise still taxed at 20% came out 6.5px tall — so the diagram
// read as "the raise is the top band, taxed at 30%," which is the misconception
// the lesson exists to correct. At $44,000 the same slice is $6,000 and visibly
// the larger part of the raise. Keep any future edit above that bar: the split
// has to be legible, or the picture argues against its own caption.
export const bracketTiers = [
  { rate: 10, upTo: 20000 },
  { rate: 20, upTo: 50000 },
  { rate: 30, upTo: Infinity },
];

export const bracketIncomes = { before: 44000, after: 54000 };

// Slice `income` into the bands it fills, bottom-up. Everything at or above
// `raiseFrom` is flagged `isRaise`, splitting a band in two where the old
// income line falls inside one — which is exactly what happens here, and what
// makes "only the overflow is taxed higher" visible rather than asserted.
//
// Derived rather than written out as literals on purpose: the diagram's whole
// claim is that the lower layers are *identical* before and after, and two
// hand-typed arrays can drift apart while still looking right. Computing both
// from one function makes that claim structural, and `check-data.mjs` §21
// asserts it holds.
export function bracketBands(income, raiseFrom = income) {
  const bands = [];
  let lower = 0;
  for (const [tier, { rate, upTo }] of bracketTiers.entries()) {
    const top = Math.min(income, upTo);
    if (top <= lower) break;
    const cuts = raiseFrom > lower && raiseFrom < top ? [lower, raiseFrom, top] : [lower, top];
    for (let i = 0; i < cuts.length - 1; i++) {
      bands.push({ tier, rate, amount: cuts[i + 1] - cuts[i], isRaise: cuts[i] >= raiseFrom });
    }
    lower = top;
  }
  return bands;
}

export const bracketTax = (bands) => bands.reduce((sum, b) => sum + (b.amount * b.rate) / 100, 0);

export const bracketTitle = {
  en: "$44,000 → $54,000, at example rates",
  es: "$44,000 → $54,000, con tasas de ejemplo",
  ko: "$44,000 → $54,000, 예시 세율 기준",
  zh: "$44,000 → $54,000，示例税率",
  ja: "$44,000 → $54,000、例示の税率で",
};

export const bracketColumnLabels = {
  en: ["Before the raise", "After the raise"],
  es: ["Antes del aumento", "Después del aumento"],
  ko: ["인상 전", "인상 후"],
  zh: ["加薪前", "加薪后"],
  ja: ["昇給前", "昇給後"],
};

export const bracketTierLabels = {
  en: ["10% on the first $20,000", "20% from $20,000 to $50,000", "30% above $50,000"],
  es: ["10% sobre los primeros $20,000", "20% de $20,000 a $50,000", "30% por encima de $50,000"],
  ko: ["처음 $20,000에 10%", "$20,000~$50,000 구간에 20%", "$50,000 초과분에 30%"],
  zh: ["前 $20,000 按 10%", "$20,000 至 $50,000 按 20%", "超过 $50,000 的部分按 30%"],
  ja: ["最初の$20,000に10%", "$20,000〜$50,000に20%", "$50,000を超える分に30%"],
};

export const bracketRaiseLabel = {
  en: "The raise",
  es: "El aumento",
  ko: "인상분",
  zh: "加薪部分",
  ja: "昇給分",
};

export const bracketSummaryLabels = {
  en: ["Take-home pay", "Kept from the raise"],
  es: ["Sueldo neto", "Del aumento te quedas"],
  ko: ["실수령액", "인상분 중 남는 돈"],
  zh: ["到手工资", "加薪中留下的部分"],
  ja: ["手取り", "昇給のうち手元に残る額"],
};

export const bracketCaption = {
  en: "Below the old income line the two stacks are identical — a raise cannot reach back and re-tax what was already there. Only the top $10,000 is new, and only the $4,000 of it above $50,000 reaches the 30% band; the other $6,000 is still taxed at 20%. Extra tax on the whole raise: $2,400, so $7,600 of it lands in the paycheck.",
  es: "Por debajo de la línea del ingreso anterior las dos columnas son idénticas: un aumento no puede volver atrás y gravar de nuevo lo que ya estaba ahí. Solo los $10,000 de arriba son nuevos, y solo los $4,000 que superan los $50,000 llegan al tramo del 30%; los otros $6,000 siguen tributando al 20%. Impuesto adicional por todo el aumento: $2,400, así que $7,600 llegan al sueldo.",
  ko: "이전 소득선 아래에서 두 기둥은 완전히 똑같습니다 — 인상은 이미 있던 소득으로 되돌아가 다시 과세할 수 없습니다. 새로 생긴 것은 맨 위 $10,000뿐이고, 그중 $50,000를 넘는 $4,000만 30% 구간에 들어가며 나머지 $6,000은 여전히 20%로 과세됩니다. 인상분 전체에 붙는 추가 세금은 $2,400이므로 $7,600이 급여로 들어옵니다.",
  zh: "在原收入线以下，两根柱子完全相同——加薪无法回头对已经存在的收入重新征税。新增的只有最上面的 $10,000，其中只有超过 $50,000 的那 $4,000 进入 30% 的区间，另外 $6,000 仍按 20% 征税。整笔加薪多缴的税是 $2,400，因此有 $7,600 进入工资。",
  ja: "以前の収入の線より下では、2本の柱はまったく同じです — 昇給がさかのぼって、すでにあった収入に課税し直すことはできません。新しいのは一番上の$10,000だけで、そのうち$50,000を超える$4,000だけが30%の帯に入り、残りの$6,000は依然として20%で課税されます。昇給全体にかかる追加の税は$2,400なので、$7,600が給料に入ります。",
};

export const bracketDescription = {
  en: "Two stacked columns on the same baseline. Both share identical lower layers — a 10% layer and a 20% layer — and the second column adds two more on top: a larger one still at 20%, and a smaller one at 30%.",
  es: "Dos columnas apiladas sobre la misma base. Ambas comparten capas inferiores idénticas — una del 10% y otra del 20% — y la segunda añade encima dos más: una mayor todavía al 20% y otra menor al 30%.",
  ko: "같은 바닥선에 놓인 두 개의 층 기둥. 두 기둥의 아래층인 10% 층과 20% 층은 완전히 같고, 두 번째 기둥은 그 위에 두 층을 더합니다 — 여전히 20%인 더 큰 층과 30%인 더 작은 층입니다.",
  zh: "两根位于同一基线上的分层柱。两者的下层完全相同——一层 10%、一层 20%——第二根柱在顶部多出两层：较大的一层仍按 20%，较小的一层按 30%。",
  ja: "同じ基準線に立つ2本の積み上げ柱。下の層である10%の層と20%の層は両方まったく同じで、2本目は上にさらに2つ足します — まだ20%の大きい層と、30%の小さい層です。",
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
  en: "Two bars from a center line: the gain rises one step above it, the loss drops about twice as far below.",
  es: "Dos barras desde una línea central: la ganancia sube un paso por encima y la pérdida baja aproximadamente el doble.",
  ko: "중앙선을 기준으로 한 두 막대: 이득은 한 칸 위로 올라가고, 손실은 그 약 두 배만큼 아래로 내려갑니다.",
  zh: "以中线为基准的两根柱：收益向上一格，损失向下约两倍。",
  ja: "中心線から伸びる2本の棒：利益は1目盛り上に、損失はその約2倍下に伸びます。",
};
