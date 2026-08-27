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
//     behavioral finding. The 6% in lesson 3 is that lesson's own teaching
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
// exists to stop. So lesson 7's bands below are round, obviously-stylized
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
// The rates and thresholds are stylized, not real — see the header for why.
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

// ── Lesson 23: Present Bias ───────────────────────────────────────────────
// The one figure here that plots a *reversal* rather than a comparison, which
// is the whole reason it earned a slot (backlog item 27's bar: name the thing
// the prose cannot do). Lesson 23's own heading is "The Preference That Flips
// When 'Later' Becomes 'Now'", and its body states the flip as two separate
// snapshots — $50 today beats $65 in a month, but $50 in twelve months loses to
// $65 in thirteen. Prose has to assert that the gap is identical in both; two
// curves that cross show *when* the answer changes, which the lesson never says
// because prose has no way to say it.
//
// Both rewards are the lesson's own and are FIXED in time: the $50 lands at
// month 12, the $65 at month 13. What moves along the x-axis is the vantage
// point — the left edge is the lesson's second scenario (both rewards a year
// out), the right edge is its first (the $50 available today). So the two ends
// of this chart are literally the two paragraphs above it.
//
// Hyperbolic discounting: perceived value = amount / (1 + k * months of wait).
//
// WHERE k COMES FROM, because a stylized constant in a teaching figure needs a
// reason. It is not picked to make the picture pretty — the lesson's own two
// choices bound it. Preferring $50-now over $65-in-a-month requires
// 50 > 65/(1+k), i.e. k > 0.3; below that the curves never cross and the
// lesson's first scenario cannot happen. Any k above 0.3 reproduces BOTH of the
// lesson's stated preferences, so the value is under-determined by the text and
// 1.0 is chosen inside that range for legibility (a smaller k puts the crossing
// so close to the right edge that it cannot be drawn). §50 asserts the bound
// and the two preferences rather than the constant, which is the part the
// lesson actually claims.
export const flipRewards = {
  sooner: { amount: 50, month: 12 },
  later: { amount: 65, month: 13 },
};
export const flipDiscountK = 1.0;
export const flipMonths = [0, 2, 4, 6, 8, 9, 10, 11, 12];

// Perceived value of `amount`, due at `month`, seen from month `now`.
export const flipValue = (amount, month, now) =>
  amount / (1 + flipDiscountK * (month - now));

export const flipSeries = () =>
  [flipRewards.sooner, flipRewards.later].map((r) => ({
    values: flipMonths.map((m) => flipValue(r.amount, r.month, m)),
  }));

// The vantage point where the two perceived values are equal. Solved rather
// than eyeballed off the sampled points: with s/l the amounts and ds/dl their
// waits from `now`, equality gives the closed form below. Returned in months
// from the left edge so the chart and the checks share one number.
export function flipCrossing() {
  const { sooner: s, later: l } = flipRewards;
  const k = flipDiscountK;
  // Equality of the two perceived values, solved for the sooner reward's
  // remaining wait `w`:
  //   s/(1+k*w) = l/(1+k*(w+gap))  →  w = (s + s*k*gap - l) / (k*(l - s))
  const gap = l.month - s.month;
  const wait = (s.amount + s.amount * k * gap - l.amount) / (k * (l.amount - s.amount));
  return s.month - wait;
}

export const flipTitle = {
  en: "What each option feels worth, as the $50 gets closer",
  es: "Cuánto parece valer cada opción a medida que se acercan los $50",
  ko: "$50이 가까워질수록 각 선택지가 얼마나 가치 있게 느껴지는가",
  zh: "随着这 $50 越来越近，两个选项各自感觉值多少",
  ja: "$50が近づくにつれて、それぞれの選択肢がどれだけの価値に感じられるか",
};

export const flipSeriesLabels = {
  en: ["$50, sooner", "$65, a month later"],
  es: ["$50, antes", "$65, un mes después"],
  ko: ["$50, 더 이른 쪽", "$65, 한 달 뒤"],
  zh: ["$50，更早", "$65，晚一个月"],
  ja: ["$50（早いほう）", "$65（1か月後）"],
};

export const flipAxisLabels = {
  en: ["Both a year away", "The $50 is available today"],
  es: ["Ambos a un año vista", "Los $50 están disponibles hoy"],
  ko: ["둘 다 1년 뒤", "$50을 오늘 받을 수 있음"],
  zh: ["两者都在一年后", "这 $50 今天就能拿到"],
  ja: ["どちらも1年先", "$50は今日受け取れる"],
};

export const flipZoneLabels = {
  en: ["Here, most people wait for the $65", "Here, most people take the $50"],
  es: ["Aquí, la mayoría espera los $65", "Aquí, la mayoría toma los $50"],
  ko: ["이 구간에서는 대부분 $65을 기다립니다", "이 구간에서는 대부분 $50을 택합니다"],
  zh: ["在这一段，多数人会等那 $65", "在这一段，多数人会拿走这 $50"],
  ja: ["この区間では、多くの人が$65を待ちます", "この区間では、多くの人が$50を選びます"],
};

export const flipMarkerLabel = {
  en: "the answer flips",
  es: "la respuesta cambia",
  ko: "답이 뒤집히는 지점",
  zh: "答案在此翻转",
  ja: "答えが逆転する点",
};

export const flipCaption = {
  en: "Neither reward changes, and the extra month of waiting is the same extra month at every point on this line. Only the vantage point moves. For most of the year the $65 is simply the better deal — then the $50 comes close enough that the pull of 'now' overtakes it, and the same person answers the opposite way.",
  es: "Ninguna recompensa cambia, y el mes extra de espera es el mismo mes extra en cada punto de la línea. Lo único que se mueve es el punto de vista. Durante casi todo el año los $65 son sencillamente la mejor opción; luego los $50 se acercan lo suficiente como para que el tirón del «ahora» los supere, y la misma persona responde al revés.",
  ko: "두 보상은 그대로이고, 한 달을 더 기다린다는 조건도 이 선 위의 모든 지점에서 똑같습니다. 움직이는 것은 바라보는 시점뿐입니다. 한 해의 대부분 동안은 $65이 그냥 더 나은 조건이지만, $50이 충분히 가까워지면 '지금'의 끌어당김이 그것을 앞지르고, 같은 사람이 반대로 답하게 됩니다.",
  zh: "两笔钱都没有变，多等的那一个月在这条线的每一点上也都是同样的一个月。变的只是观察的时点。一年里的大部分时间，$65 就是更划算的选择；等到这 $50 靠得够近，「现在」的拉力就会盖过它，同一个人便给出相反的答案。",
  ja: "どちらの報酬も変わらず、1か月余分に待つという条件もこの線上のどの点でも同じです。動くのは見ている時点だけです。1年の大半は$65が単純に有利ですが、$50が十分に近づくと「今」の引力がそれを追い越し、同じ人が逆の答えを出します。",
};

export const flipDescription = {
  en: "Two rising curves on one chart. For most of the span the $65 curve sits slightly above the $50 curve, and the panel behind them is tinted to mark that as the wait-for-the-$65 stretch. Near the right-hand end the $50 curve turns sharply upward, crosses above the $65 curve, and finishes well above it; the panel behind that last stretch is tinted differently and a dashed vertical line marks the crossing.",
  es: "Dos curvas ascendentes en un mismo gráfico. Durante casi todo el recorrido la curva de $65 queda algo por encima de la de $50, y el fondo de ese tramo está tintado para señalar que ahí se espera a los $65. Cerca del extremo derecho la curva de $50 se dispara hacia arriba, cruza por encima de la de $65 y termina muy por encima; ese último tramo tiene otro tinte y una línea vertical discontinua marca el cruce.",
  ko: "한 그래프 위의 두 상승 곡선. 구간 대부분에서 $65 곡선이 $50 곡선보다 조금 위에 있고, 그 뒤 배경은 $65을 기다리는 구간임을 나타내는 색으로 칠해져 있습니다. 오른쪽 끝 가까이에서 $50 곡선이 가파르게 솟아 $65 곡선 위로 교차한 뒤 훨씬 높은 곳에서 끝나며, 그 마지막 구간의 배경은 다른 색이고 점선 세로선이 교차 지점을 표시합니다.",
  zh: "同一张图上的两条上升曲线。在大部分区间里，$65 的曲线略高于 $50 的曲线，其后的底色标示出这是等待 $65 的区段。接近右端时，$50 的曲线急剧上扬，越过 $65 的曲线，并在明显更高处结束；最后这一段的底色不同，一条竖直虚线标出交叉点。",
  ja: "1つのグラフ上の2本の上昇曲線。大半の区間では$65の曲線が$50の曲線をわずかに上回り、その背景はここが$65を待つ区間であることを示す色で塗られています。右端近くで$50の曲線が急に立ち上がって$65の曲線を越え、はるかに高い位置で終わります。その最後の区間の背景は別の色で、破線の縦線が交差点を示します。",
};
