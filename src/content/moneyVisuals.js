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
// (5633b79) re-tracked lessons 1-15 without renumbering them. Of the seven
// lessons below, 1/3/7 are `essentials` today and 17/23/27/44 are `money` — so
// these are personal-finance figures, not one track's. The module keeps its
// `moneyVisuals.js` filename because renaming it churns every import for a
// comment's sake; the name is historical, the header is not.
//
// Seven lessons get a diagram here, chosen on §3.0.4's own test — the visual
// must *be* the explanation, not decorate it:
//   1  Budgeting        — a plan is a division of one number; show the division.
//   3  Compound Interest— the concept is literally the shape of the curve.
//   7  Marginal Tax     — the prose already asks the reader to picture a stack.
//   17 Lifestyle Infl.  — two gaps the prose can only assert are equal.
//   23 Present Bias     — a reversal; prose cannot draw a crossing.
//   27 Loss Aversion    — the asymmetry is the lesson, and prose labors at it.
//   44 Passive Income   — the lesson's own claim is that the picture has a
//                         SECOND axis, and prose cannot hold two at once.
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

// WHERE THE Y-AXIS COMES FROM, and why it is logarithmic (backlog item 137,
// 2026-08-28). This axis was linear and anchored at 0 until it was measured in
// rendered pixels: the right-hand spike sets the top of the scale (the $50 is
// worth its full 50 the moment it is available, against a maximum of 32.5 for
// the $65), so the left three quarters of the plot were squeezed into the
// bottom sixth. At the left edge — which is the lesson's own second scenario,
// named on the axis as "Both a year away" — the two curves came out 1.64px
// apart under a 2.58px stroke. The two strokes overlapped, so the figure
// rendered as ONE line exactly where the caption says "the $65 is simply the
// better deal". The claim was true in the arithmetic and absent from the
// picture.
//
// Geometry cannot fix that and neither can `k`. Separation and stroke both
// scale with the viewBox, so a taller chart moves neither; raising `k` pushes
// both curves toward zero, and lowering it walks the crossing into the right
// edge that the `k = 1.0` note above exists to avoid. The y-scale is the only
// lever, and a monotone one changes nothing the figure asserts: the ordering at
// every vantage point, the single reversal, and the month it happens in are all
// preserved exactly, which is why the crossing marker and §50 are untouched.
//
// WHAT IT COSTS, stated because it is a real cost. The late upturn of the $50
// is the figure's visual punch, and a log axis mutes it: measured in rendered
// px/month, the last segment was 9.68x the mean of the earlier ones and is now
// 3.48x. (The left edge goes the other way: 1.64px apart becomes 7.00px, which
// is 2.72x the stroke instead of 0.64x.) The upturn survives — it is still by far the steepest stretch, still
// crosses, and still finishes 15.6% of the plot height clear (was 35.0%) — so
// every clause of `flipDescription` ("turns sharply upward, crosses above ...,
// and finishes well above it") stays true in all five languages and none of
// them needed rewriting. That was checked clause by clause, not assumed.
//
// The absolute scale carries no information to spend: there is no axis label,
// no gridline and no printed value, deliberately (see the comment in
// `PreferenceFlip` — the quantity is "how much it feels worth", and a dollar
// figure would overstate it). What the reader can read off this axis is order
// and shape, and a log transform preserves the first exactly and the second in
// the direction that matters.
//
// Returns a 0..1 position, 0 at the plot floor and 1 at the plot top, so the
// component owns the pixels and `check-data.mjs` §50 can assert the separation
// without knowing any of them. `FLIP_Y_FLOOR_MARGIN` keeps the lowest point off
// the baseline rule; without it the $50-at-a-year-out sits exactly on the axis
// and reads as zero, which is the one thing this quantity is never.
export const FLIP_Y_FLOOR_MARGIN = 0.08;

export function flipYNorm(v) {
  const all = flipSeries().flatMap((s) => s.values);
  const hi = Math.log(Math.max(...all));
  const span = hi - Math.log(Math.min(...all));
  const lo = hi - span * (1 + FLIP_Y_FLOOR_MARGIN);
  return (Math.log(v) - lo) / (hi - lo);
}

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
  zh: "两笔钱都没有变，多等的那一个月在这条线的每一点上也都是同样的一个月。变的只是观察的时点。一年里的大部分时间，$65 就是更划算的选择；等到这 $50 靠得够近，“现在”的拉力就会盖过它，同一个人便给出相反的答案。",
  ja: "どちらの報酬も変わらず、1か月余分に待つという条件もこの線上のどの点でも同じです。動くのは見ている時点だけです。1年の大半は$65が単純に有利ですが、$50が十分に近づくと「今」の引力がそれを追い越し、同じ人が逆の答えを出します。",
};

export const flipDescription = {
  en: "Two rising curves on one chart. For most of the span the $65 curve sits slightly above the $50 curve, and the panel behind them is tinted to mark that as the wait-for-the-$65 stretch. Near the right-hand end the $50 curve turns sharply upward, crosses above the $65 curve, and finishes well above it; the panel behind that last stretch is tinted differently and a dashed vertical line marks the crossing.",
  es: "Dos curvas ascendentes en un mismo gráfico. Durante casi todo el recorrido la curva de $65 queda algo por encima de la de $50, y el fondo de ese tramo está tintado para señalar que ahí se espera a los $65. Cerca del extremo derecho la curva de $50 se dispara hacia arriba, cruza por encima de la de $65 y termina muy por encima; ese último tramo tiene otro tinte y una línea vertical discontinua marca el cruce.",
  ko: "한 그래프 위의 두 상승 곡선. 구간 대부분에서 $65 곡선이 $50 곡선보다 조금 위에 있고, 그 뒤 배경은 $65을 기다리는 구간임을 나타내는 색으로 칠해져 있습니다. 오른쪽 끝 가까이에서 $50 곡선이 가파르게 솟아 $65 곡선 위로 교차한 뒤 훨씬 높은 곳에서 끝나며, 그 마지막 구간의 배경은 다른 색이고 점선 세로선이 교차 지점을 표시합니다.",
  zh: "同一张图上的两条上升曲线。在大部分区间里，$65 的曲线略高于 $50 的曲线，其后的底色标示出这是等待 $65 的区段。接近右端时，$50 的曲线急剧上扬，越过 $65 的曲线，并在明显更高处结束；最后这一段的底色不同，一条竖直虚线标出交叉点。",
  ja: "1つのグラフ上の2本の上昇曲線。大半の区間では$65の曲線が$50の曲線をわずかに上回り、その背景はここが$65を待つ区間であることを示す色で塗られています。右端近くで$50の曲線が急に立ち上がって$65の曲線を越え、はるかに高い位置で終わります。その最後の区間の背景は別の色で、破線の縦線が交差点を示します。",
};

// ── Lesson 17: Lifestyle Inflation ────────────────────────────────────────
// The sixth figure, added 2026-08-27 (backlog item 27). The item named this
// lesson as "where the gap between two rising lines is the lesson", and that
// framing does not survive contact with the text: the lesson gives Priya's
// income at both ends ($50,000 six years ago, $75,000 today) but never states
// her SPENDING or her gap at either end, and puts the four upgrades "at
// various points". Two lines over six years would therefore have had to invent
// the starting gap — which is the one quantity the whole claim is about.
//
// What the lesson does state, exactly and in all five languages, is the gap at
// LEVELS, in its second section: $50,000 earned against $45,000 spent is a gap
// of $5,000, and $120,000 against $115,000 is also a gap of $5,000. Six
// numbers, all verbatim, carrying the lesson's own flagged counterintuitive
// result — "the second person has a materially nicer life, and is exactly as
// far from every goal the gap funds."
//
// That is what the prose cannot do. It states the two gaps are equal and asks
// the reader to subtract twice and take the result on trust; on one shared
// scale the equality is *seen*, at the same moment as the 2.4x difference in
// height that makes it surprising. Both comparisons at once is the figure.
//
// WHY THE GAP SITS AT THE BOTTOM OF EACH COLUMN and not on top, which is the
// conventional order: two segments of equal length at different vertical
// offsets are the one thing a stacked bar cannot be read for, and equality is
// this figure's entire claim. On a shared baseline the two bands are directly
// comparable, and the rule drawn across their tops turns the claim into one
// straight line. Ordering it the conventional way would have drawn the right
// answer in the one arrangement that hides it.
export const gapEarners = [
  { key: "modest", earns: 50000, spends: 45000 },
  { key: "high", earns: 120000, spends: 115000 },
];

export const gapOf = (e) => e.earns - e.spends;

export const gapTitle = {
  en: "Two very different incomes, the same gap",
  es: "Dos ingresos muy distintos, la misma brecha",
  ko: "아주 다른 두 소득, 똑같은 격차",
  zh: "两份差距悬殊的收入，同样的差额",
  ja: "大きく異なる2つの収入、同じ差",
};

export const gapSegmentLabels = {
  en: ["Spent", "The gap"],
  es: ["Gastado", "La brecha"],
  ko: ["쓴 돈", "격차"],
  zh: ["花掉的", "差额"],
  ja: ["使った分", "差"],
};

export const gapRuleLabel = {
  en: "The same gap either way",
  es: "La misma brecha en ambos casos",
  ko: "어느 쪽이든 격차는 같습니다",
  zh: "两边的差额一样",
  ja: "どちらも同じ差",
};

export const gapAxisLabel = {
  en: "Annual income — both columns on one scale",
  es: "Ingreso anual — ambas columnas en la misma escala",
  ko: "연 소득 — 두 기둥 모두 같은 척도",
  zh: "年收入——两根柱使用同一刻度",
  ja: "年収 — 2本の柱は同じ目盛り",
};

export const gapCaption = {
  en: "The right-hand column earns more than twice as much and lives a materially nicer life. The band at the base of each column — the gap — is what funds an emergency fund, money invested early, eventually the option to work less. It is exactly the same height in both. The distance to every one of those goals is measured in that band, not in the column above it.",
  es: "La columna de la derecha gana más del doble y lleva una vida materialmente mejor. La franja en la base de cada columna — la brecha — es lo que financia un fondo de emergencia, el dinero invertido pronto y, con el tiempo, la opción de trabajar menos. Tiene exactamente la misma altura en las dos. La distancia hasta cada una de esas metas se mide en esa franja, no en la columna que tiene encima.",
  ko: "오른쪽 기둥은 두 배 넘게 벌고 물질적으로 더 나은 생활을 합니다. 각 기둥 맨 아래의 띠 — 격차 — 가 비상금과 일찍 투자한 돈, 나아가 덜 일할 선택지를 만들어 주는 부분이며, 두 기둥에서 높이가 정확히 같습니다. 그 목표들까지의 거리는 위에 쌓인 기둥이 아니라 바로 이 띠로 잽니다.",
  zh: "右边这根柱赚的钱是左边的两倍多，生活也确实更宽裕。每根柱底部的那一条——差额——才是应急金、早早投出去的钱，乃至日后少工作一些的选择所依靠的部分，而它在两根柱上的高度完全一样。到这些目标的距离，量的是这一条，不是它上面的柱身。",
  ja: "右の柱は2倍以上稼ぎ、実際に物質的に豊かな暮らしをしています。それぞれの柱の底にある帯 — 差 — こそが、緊急資金や早めに投じたお金、やがては働く量を減らす選択肢を支える部分で、その高さは2本でまったく同じです。それらの目標までの距離を測るのはこの帯であって、その上に積まれた柱ではありません。",
};

export const gapDescription = {
  en: "Two columns on one shared dollar scale. The right-hand column is well over twice the height of the left. At the base of each sits a thin band marking the gap between earning and spending, and a horizontal line runs across both columns at the top of those bands, at the same height on each.",
  es: "Dos columnas en una única escala de dólares. La columna de la derecha mide bastante más del doble que la de la izquierda. En la base de cada una hay una franja fina que marca la brecha entre lo que se gana y lo que se gasta, y una línea horizontal cruza ambas columnas por encima de esas franjas, a la misma altura en las dos.",
  ko: "하나의 달러 척도를 함께 쓰는 두 기둥. 오른쪽 기둥은 왼쪽 기둥의 두 배를 훌쩍 넘는 높이입니다. 각 기둥의 맨 아래에는 버는 것과 쓰는 것의 격차를 나타내는 얇은 띠가 있고, 그 띠 위쪽을 가로지르는 수평선이 두 기둥에 같은 높이로 그어져 있습니다.",
  zh: "两根柱共用同一个美元刻度。右边那根的高度远超左边的两倍。每根柱的底部都有一条细带，标示赚与花之间的差额，一条水平线横跨两根柱，落在这两条细带的顶端，在两根柱上高度相同。",
  ja: "同じドル目盛りを共有する2本の柱。右の柱は左の2倍をかなり超える高さです。それぞれの柱の底には稼ぎと支出の差を示す細い帯があり、水平線が2本の柱を横切って、その帯の上端に同じ高さで引かれています。",
};

// ── Lesson 44: the two axes the word "passive" collapses ───────────────────
//
// ⚠️ ORDINAL, NOT MEASURED — this is the one constant in this file that is not
// a number lifted from its lesson's body, and the difference matters. Every
// other figure here plots the lesson's own arithmetic; these are RANKS read
// off two sentences, and `check-data.mjs` §54 asserts them against those
// sentences rather than against any quantity.
//
//   `detach` — how loosely the income is coupled to your hours. Lesson 43
//   states this ordering exactly and completely: labor "is the only one of
//   the four that reliably becomes zero when you stop", business "is partly
//   coupled, in a ratio you can actually estimate", rent and royalties are
//   "loosely coupled", and investment income is "barely coupled to your time
//   at all". Four items, one stated order, no gaps — so 0/1/2/3 is a faithful
//   rendering and not an invention.
//
//   `upfront` — what it demands before it pays anything. Lesson 44 gives ONE
//   exact claim and ONE tendency, and the numbers below encode exactly that
//   much. The exact claim is about a single item: labor is "the only one of
//   the four you can begin with nothing but yourself", which is why labor is
//   0 and sits on the rail while the other three are lifted clear of it in one
//   step. The tendency is "as income gets less coupled to your hours, it
//   generally demands more of something else up front" — the word is
//   *generally*, so the 2/3/4 that follow encode "rising" and nothing finer.
//   **The lesson never ranks a business against a rental against shares, and
//   neither does this figure**: no tick, gridline or number is drawn on that
//   axis, so the three lifted dots assert only that they are off the rail and
//   trending. A future run must not "improve" this by sourcing real capital
//   requirements — that would be a different figure making a claim lesson 44
//   deliberately does not make.
export const incomeKinds = [
  { key: "labor", detach: 0, upfront: 0 },
  { key: "business", detach: 1, upfront: 2 },
  { key: "passive", detach: 2, upfront: 3 },
  { key: "investment", detach: 3, upfront: 4 },
];

export const tradeTitle = {
  en: "The same four, with the second axis drawn in",
  es: "Los mismos cuatro, con el segundo eje dibujado",
  ko: "같은 네 가지, 두 번째 축까지 그린 그림",
  zh: "还是这四种，只是把第二条轴画了出来",
  ja: "同じ4つ、そこに第2の軸を描き入れる",
};

// The four names lesson 42 defines, in the order lesson 43 ranks them.
export const tradeKindLabels = {
  en: ["Labor income", "Business income", "Passive income", "Investment income"],
  es: ["Ingreso laboral", "Ingreso empresarial", "Ingreso pasivo", "Ingreso de inversión"],
  ko: ["노동소득", "사업소득", "수동소득", "투자소득"],
  zh: ["劳动收入", "经营收入", "被动收入", "投资收入"],
  ja: ["労働所得", "事業所得", "不労所得", "投資所得"],
};

// Both ends are the lessons' own sentences about the axis, not a restatement.
export const tradeEndLabels = {
  en: ["← Stops the day you do", "Doesn't notice you stopped →"],
  es: ["← Se detiene el día que tú te detienes", "Ni se entera de que paraste →"],
  ko: ["← 당신이 멈추는 날 함께 멈춥니다", "당신이 멈춘 줄도 모릅니다 →"],
  zh: ["← 你一停，它就停", "你停了它都不知道 →"],
  ja: ["← あなたが止まった日に止まる", "あなたが止まったことに気づかない →"],
};

export const tradeUpfrontLabel = {
  en: "↑ What it wants first, before it gives anything back",
  es: "↑ Lo que pide primero, antes de devolver nada",
  ko: "↑ 무언가를 돌려주기 전에 먼저 요구하는 것",
  zh: "↑ 它在回报你之前，先要你付出的东西",
  ja: "↑ 何かを返す前に、まず求めてくるもの",
};

export const tradeCaption = {
  en: "Read the bottom line on its own and the four look like rungs — which is the ladder people reach for. The height is what each step to the right asks for first: years of saved wages, a deposit and a mortgage, a stretch of unpaid work with no guarantee. Only labor income sits on the line, because it is the one you can start with nothing but yourself. Positions show the order the lessons state, not measured amounts, and neither end of the line is the smart one to be at.",
  es: "Lee solo la línea inferior y los cuatro parecen peldaños: esa es la escalera a la que la gente recurre. La altura es lo que pide primero cada paso hacia la derecha: años de sueldo ahorrado, una entrada y una hipoteca, una temporada de trabajo sin cobrar y sin garantías. Solo el ingreso laboral se apoya en la línea, porque es el único que puedes empezar sin más que tú mismo. Las posiciones muestran el orden que enuncian las lecciones, no cantidades medidas, y ningún extremo de la línea es el lugar inteligente donde estar.",
  ko: "아래 선만 따로 읽으면 넷은 사다리의 가로대처럼 보입니다 — 사람들이 흔히 떠올리는 그 사다리입니다. 높이는 오른쪽으로 한 칸 갈 때마다 먼저 요구되는 것입니다. 몇 년치 모은 임금, 보증금과 대출, 아무 보장 없이 일해야 하는 기간 같은 것들이죠. 선 위에 놓인 것은 노동소득뿐인데, 오직 자기 자신만 가지고 시작할 수 있는 유일한 것이기 때문입니다. 위치는 수업이 말한 순서를 나타낼 뿐 측정된 양이 아니며, 선의 어느 쪽 끝도 더 똑똑한 자리가 아닙니다.",
  zh: "单看底下那条线，这四种就像梯子的四级横档——这正是人们习惯想到的那架梯子。高度是每向右一步，它先要你付出的东西：攒了好几年的工资、一笔首付和一笔房贷、一段没有任何保证的无薪投入。只有劳动收入落在线上，因为它是唯一一种仅凭你自己就能开始的收入。这些位置表示的是课程讲到的先后次序，不是量出来的数值；而且这条线的两端，没有哪一端是更聪明的位置。",
  ja: "下の線だけを読むと、4つは梯子の段のように見えます——人々が思い浮かべる、あの梯子です。高さは、右へ一歩進むごとに先に求められるものです。何年分もの貯めた賃金、頭金と住宅ローン、保証のないまま働き続ける期間。線の上に乗っているのは労働所得だけで、それが自分自身以外に何も持たずに始められる唯一のものだからです。位置は各回が述べた順序を示すもので、測られた量ではありません。そして線のどちらの端も、賢い居場所というわけではありません。",
};

export const tradeDescription = {
  en: "A plot with four dots. Left to right they are labor income, business income, passive income and investment income — the order in which the lessons rank how tightly each is tied to your hours. A horizontal line runs along the bottom. The labor income dot sits directly on that line; the other three are lifted above it by dashed stems that get taller from left to right, showing what each asks for before it pays anything. Height marks rank, not an amount, and the axis carries no scale.",
  es: "Un gráfico con cuatro puntos. De izquierda a derecha son ingreso laboral, ingreso empresarial, ingreso pasivo e ingreso de inversión: el orden en que las lecciones clasifican lo atados que están a tus horas. Una línea horizontal recorre la base. El punto del ingreso laboral se apoya justo en esa línea; los otros tres se elevan sobre ella mediante tallos discontinuos cada vez más altos hacia la derecha, que muestran lo que cada uno pide antes de devolver nada. La altura marca un orden, no una cantidad, y el eje no lleva escala.",
  ko: "점 네 개가 찍힌 그림입니다. 왼쪽에서 오른쪽으로 노동소득, 사업소득, 수동소득, 투자소득이며, 각각이 당신의 근무 시간에 얼마나 단단히 묶여 있는지를 수업이 매긴 순서입니다. 아래쪽에는 수평선이 그어져 있습니다. 노동소득 점은 그 선 위에 바로 놓여 있고, 나머지 셋은 점선 줄기에 의해 선 위로 들려 있으며 그 줄기는 오른쪽으로 갈수록 길어져 각각이 돌려주기 전에 먼저 요구하는 것을 나타냅니다. 높이는 양이 아니라 순서를 나타내며, 축에는 눈금이 없습니다.",
  zh: "一幅有四个圆点的图。从左到右依次是劳动收入、经营收入、被动收入和投资收入，这是课程按照各自与你工时绑定紧密程度排出的次序。底部有一条水平线。劳动收入的点正好落在这条线上；另外三个由虚线支柱托起在线的上方，支柱自左向右越来越高，表示每一种在回报你之前先要你付出的东西。高度表示的是次序而非数量，这条轴上没有刻度。",
  ja: "点が4つある図です。左から右へ、労働所得、事業所得、不労所得、投資所得——各回が、それぞれをあなたの労働時間にどれだけ強く結びついているかで並べた順序です。下部には水平線が引かれています。労働所得の点はその線の上に直接乗っており、他の3つは破線の支柱によって線の上に持ち上げられ、その支柱は右へ行くほど高くなって、それぞれが何かを返す前に求めてくるものを表しています。高さは量ではなく順序を示し、この軸に目盛りはありません。",
};

// ── Lesson 28: the two axes a win collapses into one ───────────────────────
//
// ⚠️ CATEGORICAL, NOT ORDINAL AND NOT MEASURED — a third kind of figure for
// this file, and the distinction is what keeps it honest. §21/§50/§53 plot
// arithmetic their lessons state; §54 plots ranks read off two sentences.
// This one plots neither. It is a PARTITION: two binary axes lesson 28 names
// in one sentence — "the result and the process are two different things" —
// crossed to give four cells, all four of which the lesson says occur.
//
// WHY IT EARNS A DIAGRAM (backlog item 27's bar, and the reason is geometric
// rather than aesthetic). The lesson's claim is that knowing the outcome
// locates you in a COLUMN, not in a CELL. Prose is sequential: it delivers
// "a good decision can still lose" and "a bad or lucky decision can still win"
// as two clauses of one sentence and then asks the reader to hold the
// cross-product in memory and notice that one column contains both of them.
// The grid is that cross-product, already built. A column containing two cells
// is a shape, and prose cannot draw it — it can only assert it twice and hope.
//
// WHAT THIS FIGURE DELIBERATELY DOES NOT DRAW, because the lesson does not
// state it: any frequency, probability, base rate or area. The cells are the
// same size and carry the same mark. Lesson 28 says all four happen and says
// nothing whatever about how often — "one win ... is very weak evidence", not
// "a win is usually luck". A future run must not "improve" this by weighting
// the cells or resizing them: that would answer the question the lesson leaves
// open, and it would read as advice about how much to trust a result, which is
// §10.1's line. `check-data.mjs` §57 (e) is what holds the four cells equal.
//
// The two labeled axes are the lesson's own words in each language, taken from
// its body rather than translated from the English label — §54 (e) is the
// precedent, and it caught two real defects on the way in.
export const outcomeCells = [
  { key: "goodLost", row: 0, col: 0 },
  { key: "goodWon", row: 0, col: 1 },
  { key: "luckyLost", row: 1, col: 0 },
  { key: "luckyWon", row: 1, col: 1, here: true },
];

export const outcomeTitle = {
  en: "What a win narrows down, and what it doesn't",
  es: "Lo que una victoria acota, y lo que no",
  ko: "승리가 좁혀주는 것과 좁혀주지 못하는 것",
  zh: "一次成功能缩小什么，又缩小不了什么",
  ja: "勝利が絞り込めるもの、絞り込めないもの",
};

// The columns: the outcome, which is the half you can see. Lesson 28's own
// verbs for it — `zh` says 亏钱/赚钱 and `ja` 負けた/勝った in the body.
export const outcomeColumnLabels = {
  en: ["It lost", "It won"],
  es: ["Perdió", "Ganó"],
  ko: ["졌다", "이겼다"],
  zh: ["亏钱了", "赚钱了"],
  ja: ["負けた", "勝った"],
};

// The rows: the decision behind it, which is the half you cannot see from the
// outcome. Each is lifted verbatim from the lesson's "two different things"
// sentence in that language.
export const outcomeRowLabels = {
  en: ["A good decision", "A bad or lucky decision"],
  es: ["Una buena decisión", "Una decisión mala o afortunada"],
  ko: ["좋은 결정", "나쁘거나 운이 좋았던 결정"],
  zh: ["好的决策", "糟糕的或纯属侥幸的决策"],
  ja: ["良い決断", "悪い、あるいは運が良かっただけの決断"],
};

// The bracket over the right-hand column. This is the figure's whole argument
// in four words, so it is the string most worth getting right per language.
export const outcomeSpanLabel = {
  en: "All a win tells you",
  es: "Todo lo que te dice una victoria",
  ko: "승리가 말해주는 전부",
  zh: "一次成功能告诉你的全部",
  ja: "勝利が教えてくれるすべて",
};

// Maria's case, from the lesson's opening paragraph. The 40% is the lesson's
// own figure and §57 (f) asserts it is still in the body.
export const outcomeHereLabel = {
  en: "Maria's hunch — up 40%",
  es: "La corazonada de María: subió un 40%",
  ko: "마리아의 직감 — 40% 상승",
  zh: "玛丽亚的直觉——上涨40%",
  ja: "マリアの直感——40%上昇",
};

export const outcomeCaption = {
  en: "The outcome is the column; the decision behind it is the row. A win puts you somewhere in the right-hand column and stops there, because both of its cells are real — a good decision can still lose, and a bad or lucky decision can still win. Maria read a row off a column: the price moved, so she filed her hunch under the top one. The grid says nothing about how often each cell happens, because the lesson doesn't either.",
  es: "El resultado es la columna; la decisión que hay detrás es la fila. Una victoria te sitúa en algún punto de la columna derecha y ahí se detiene, porque sus dos celdas son reales: una buena decisión puede aun así perder, y una decisión mala o afortunada puede aun así ganar. María leyó una fila a partir de una columna: el precio se movió, así que archivó su corazonada en la de arriba. La cuadrícula no dice nada sobre con qué frecuencia ocurre cada celda, porque la lección tampoco lo dice.",
  ko: "결과는 열이고, 그 뒤에 있는 결정은 행입니다. 승리는 당신을 오른쪽 열 어딘가에 놓아둘 뿐 거기서 멈춥니다. 그 열의 두 칸이 모두 실재하기 때문입니다 — 좋은 결정도 질 수 있고, 나쁘거나 운이 좋았던 결정도 이길 수 있습니다. 마리아는 열을 보고 행을 읽어냈습니다. 가격이 올랐으니 자신의 직감을 위쪽 칸에 넣어버린 것입니다. 이 표는 각 칸이 얼마나 자주 일어나는지에 대해서는 아무 말도 하지 않는데, 수업도 그렇게 하지 않기 때문입니다.",
  zh: "结果是列，结果背后的决策是行。一次成功只把你放在右边这一列的某个位置，然后就到此为止了，因为这一列的两个格子都是真实存在的——一个好的决策仍然可能亏钱，一个糟糕的或纯属侥幸的决策也仍然可能赚钱。玛丽亚是从一列反推出一行的：价格涨了，于是她就把自己的直觉归进了上面那一格。这张表完全没有说每个格子发生得有多频繁，因为这一课本身也没有说。",
  ja: "結果は列であり、その背後にある決断は行です。勝利はあなたを右の列のどこかに置くだけで、そこで止まります。その列の2つのマスはどちらも現実に起こるからです——良い決断でも負けることはあり、悪い、あるいは運が良かっただけの決断でも勝つことはあります。マリアは列から行を読み取りました。価格が動いたので、自分の直感を上のマスに分類したのです。この図は、それぞれのマスがどのくらいの頻度で起こるかについては何も述べていません。この回自体が述べていないからです。",
};

export const outcomeDescription = {
  en: "A two-by-two grid. The columns are the outcome: it lost on the left, it won on the right. The rows are the decision behind it: a good decision on top, a bad or lucky decision below. All four cells are the same size and carry the same mark, because the lesson says all four happen and says nothing about how often. A bracket spans the right-hand column and is labeled as everything a win tells you — it narrows the answer to that column of two cells and no further. A highlighted mark sits in the lower right cell, Maria's hunch that rose 40 percent.",
  es: "Una cuadrícula de dos por dos. Las columnas son el resultado: perdió a la izquierda, ganó a la derecha. Las filas son la decisión que hay detrás: una buena decisión arriba, una decisión mala o afortunada abajo. Las cuatro celdas tienen el mismo tamaño y llevan la misma marca, porque la lección dice que las cuatro ocurren y no dice nada sobre con qué frecuencia. Un corchete abarca la columna derecha y está etiquetado como todo lo que te dice una victoria: acota la respuesta a esa columna de dos celdas y no más. Una marca destacada se sitúa en la celda inferior derecha, la corazonada de María que subió un 40 por ciento.",
  ko: "가로 2칸, 세로 2칸의 표입니다. 열은 결과로, 왼쪽이 졌다, 오른쪽이 이겼다입니다. 행은 그 뒤에 있는 결정으로, 위가 좋은 결정, 아래가 나쁘거나 운이 좋았던 결정입니다. 네 칸은 모두 같은 크기이고 같은 표시를 달고 있는데, 수업이 네 경우 모두 일어난다고 말할 뿐 얼마나 자주인지는 말하지 않기 때문입니다. 오른쪽 열 위에는 괄호가 걸쳐져 있고 승리가 말해주는 전부라고 적혀 있습니다. 그것은 답을 두 칸짜리 그 열까지만 좁혀줄 뿐 그 이상은 좁혀주지 못합니다. 오른쪽 아래 칸에는 강조된 표시가 있는데, 40퍼센트 오른 마리아의 직감입니다.",
  zh: "一张二乘二的表格。列表示结果：左边是亏钱了，右边是赚钱了。行表示背后的决策：上面是好的决策，下面是糟糕的或纯属侥幸的决策。四个格子大小相同、标记相同，因为这一课只说这四种情况都会发生，并没有说各自有多频繁。右边这一列上方有一个括号，标注为一次成功能告诉你的全部——它只能把答案缩小到这个包含两个格子的列，再往下就缩不动了。右下角的格子里有一个突出显示的标记，那是玛丽亚上涨了40%的直觉。",
  ja: "2行2列の図です。列は結果を表し、左が負けた、右が勝ったです。行はその背後にある決断を表し、上が良い決断、下が悪い、あるいは運が良かっただけの決断です。4つのマスはすべて同じ大きさで同じ印がついています。この回は4つとも起こると述べるだけで、どのくらいの頻度かについては何も述べていないからです。右の列の上には括弧がかかっており、勝利が教えてくれるすべて、と記されています。それは答えを2マスからなるその列までしか絞り込めません。右下のマスには強調された印があり、40%上昇したマリアの直感です。",
};

// ── Lesson 12: the split that inverts while the total does not ─────────────
// Backlog item 27, added 2026-09-03. Section 2, "What a Mortgage Payment Is
// Actually Made Of". See charts.jsx's `SplitBand` header for why this lesson
// clears item 27's bar and why the band is the loan part of the payment only.
//
// ⛔ THE CURVE IS DERIVED FROM THE ONE FACT THE LESSON STATES, NOT DRAWN BY
// EYE, and that is the only reason it is allowed to have a shape at all.
// Lesson 12 gives no payment amount and no interest rate, so a curve chosen
// for looks would be inventing the rate — item 27's standing rule (does the
// prose state every quantity the shape needs?) rejected lessons 16, 18 and 21
// for exactly that. What the lesson DOES state is where the two shares cross:
// "roughly two-thirds of the way through its term".
//
// For any fixed-payment loan the interest share of a payment is
//
//     s(t) = 1 - (1+r)^(t-N)        (t periods in, N periods total)
//
// which is where the amortization identity lands once the payment and the
// principal cancel: the interest due is r x the outstanding balance, the
// balance is P[(1+r)^N - (1+r)^t]/[(1+r)^N - 1], and the level payment is
// P r (1+r)^N/[(1+r)^N - 1]. Neither P nor the payment survives the division,
// which is what makes this drawable without either of them.
//
// Write it in fractions of the term, f = t/N, and set s(crossing) = 1/2:
//
//     s(f) = 1 - k^(f-1),  k = (1+r)^N,  and  k^(crossing-1) = 1/2
//         => k = 2^(1/(1-crossing)) = 2^3 = 8   for crossing = 2/3
//
// So the whole curve follows from the lesson's own "two-thirds" and nothing
// else — no rate is chosen here, and none is rendered. (For the record, and
// only for it: k = 8 over 360 monthly periods is an annual nominal rate of
// about 6.9%, which is why the shape looks like a mortgage. Nothing in the
// figure or its labels says so, and nothing should — see §10.1.)
//
// ⚠️ A FUTURE RUN MUST NOT PIN THE ENDS. s(0) = 7/8 falls out of k = 8; it is
// derived, not stated, and the lesson says only "mostly". That is precisely
// why the vertical axis carries no scale: the shape is honest about the
// ordering and the crossing, and silent about the amounts, because the lesson
// is. Adding a tick, a percentage, or a real payment schedule would make the
// figure state what the prose declines to.
export const splitTermYears = 30;
export const splitCrossing = 2 / 3;

// One sample per year of the term, as a fraction of it. Sampling by year
// rather than by pixel keeps the boundary's shape a property of the data.
export const splitSamples = Array.from({ length: splitTermYears + 1 }, (_, i) => i / splitTermYears);

const SPLIT_K = Math.pow(2, 1 / (1 - splitCrossing));

/** Interest's share of the loan part of one payment, `f` of the way through the term. */
export const splitInterestShare = (f) => 1 - Math.pow(SPLIT_K, f - 1);

// The lesson's own name for what the figure draws, lifted from the first
// clause of the sentence that introduces the pattern.
export const splitTitle = {
  en: "The principal-and-interest split",
  es: "La división entre capital e interés",
  ko: "원금과 이자의 비율",
  zh: "本金与利息的比例",
  ja: "元金と利息の割合",
};

// [top region, bottom region] — the lesson's own parenthetical definitions of
// the only two components it gives a share for. They are the definitions and
// not the bare words on purpose: the bare words would leave a reader to assume
// the band is the whole payment, which lesson 12 says it is not.
export const splitSegmentLabels = {
  en: ["interest (the lender's charge for the loan)", "principal (paying down the amount borrowed)"],
  es: ["interés (el cargo del prestamista por el préstamo)", "capital (reducir el monto prestado)"],
  ko: ["이자(대출에 대한 대출기관의 청구)", "원금(빌린 금액을 갚아나가는 것)"],
  zh: ["利息（贷方对贷款收取的费用）", "本金（偿还所借金额）"],
  ja: ["利息（融資に対する貸し手の請求）", "元金（借りた金額を減らす部分）"],
};

// The crossing, in the lesson's own hedged words. The hedge is kept ("roughly",
// "often") because the figure pins the marker at exactly 2/3 and the label is
// the only thing that says the lesson did not.
export const splitMarkerLabel = {
  en: "roughly two-thirds of the way through its term",
  es: "aproximadamente dos tercios de su plazo",
  ko: "대출 기간의 약 3분의 2 지점",
  zh: "贷款期限约三分之二处",
  ja: "返済期間のおよそ3分の2",
};

// [left, right]. The left end is the moment the lesson names as the one where
// the balance — and so the interest portion — is largest. The right end names
// the axis's extent rather than a point on it; the lesson has no phrase for
// "the last payment", and inventing one would be four languages of new prose
// for an axis tick.
export const splitEndLabels = {
  en: ["right after buying", "A 30-year loan"],
  es: ["justo después de comprar", "Un préstamo a 30 años"],
  ko: ["매수 직후", "30년 대출"],
  zh: ["刚购房之后", "30年期贷款"],
  ja: ["購入直後", "30年ローン"],
};

// Lifted from the section BODY, not from the takeaway — LessonReader draws the
// KEY TAKEAWAY card a couple of inches below the figure, and lesson 12's
// takeaway ends on this same claim, so a caption taken from there would print
// the sentence twice on one screen. §69 (g) caught that shape once already.
export const splitCaption = {
  en: "early payments are mostly interest, and later payments are mostly principal",
  es: "los primeros pagos son sobre todo interés, y los últimos son sobre todo capital",
  ko: "초기 상환금은 대부분 이자이고, 후기 상환금은 대부분 원금입니다",
  zh: "早期还款大部分是利息，后期还款大部分是本金",
  ja: "初期の返済はほとんどが利息で、後期の返済はほとんどが元金です",
};

// The one string here that is not lifted. The band is a role="img", so nothing
// inside it is announced on its own: whatever this omits does not exist for a
// screen-reader learner, and the figure's whole content is the two regions,
// which one is larger at each end, and where they trade places.
export const splitDescription = {
  en: "A band of constant height running left to right across a 30-year loan term, split into two regions by a single line. The upper region is interest and the lower one is principal; together they are the loan part of one monthly payment, so as one grows the other shrinks by the same amount. At the left, right after buying, the dividing line sits low and interest fills most of the band. The line rises steadily to the right until, at a dashed marker about two-thirds of the way along, the two regions are the same size. From there to the end of the term principal is the larger of the two, and the band finishes almost entirely principal. Neither axis carries a scale or a number.",
  es: "Una banda de altura constante que recorre de izquierda a derecha el plazo de un préstamo a 30 años, dividida en dos regiones por una sola línea. La región superior es el interés y la inferior el capital; juntas son la parte del préstamo de un pago mensual, así que cuando una crece la otra se reduce en la misma medida. A la izquierda, justo después de comprar, la línea divisoria está baja y el interés ocupa la mayor parte de la banda. La línea sube de forma sostenida hacia la derecha hasta que, en un marcador discontinuo situado aproximadamente a dos tercios del recorrido, las dos regiones son del mismo tamaño. Desde ahí hasta el final del plazo el capital es la mayor de las dos, y la banda termina siendo casi todo capital. Ninguno de los dos ejes lleva escala ni cifras.",
  ko: "30년 대출 기간을 왼쪽에서 오른쪽으로 가로지르는, 높이가 일정한 띠입니다. 선 하나가 이 띠를 두 영역으로 나눕니다. 위쪽 영역은 이자, 아래쪽 영역은 원금이며, 둘을 합치면 월 상환금 가운데 대출 자체에 해당하는 부분입니다. 그래서 한쪽이 커지면 다른 쪽은 그만큼 작아집니다. 매수 직후인 왼쪽 끝에서는 경계선이 아래쪽에 있어 이자가 띠의 대부분을 차지합니다. 선은 오른쪽으로 가면서 꾸준히 올라가고, 전체의 약 3분의 2 지점에 있는 점선 표시에서 두 영역의 크기가 같아집니다. 거기서부터 기간이 끝날 때까지는 원금이 더 크며, 띠의 끝은 거의 전부 원금입니다. 두 축 모두 눈금이나 숫자가 없습니다.",
  zh: "一条高度始终不变的横带，自左向右贯穿30年期贷款的整个期限，被一条线分成上下两个区域。上方区域是利息，下方区域是本金；两者合起来是每月月供中属于贷款本身的部分，所以一方变大，另一方就会等量变小。在最左端、也就是刚购房之后，这条分界线位置很低，利息占据了横带的大部分。这条线一路向右稳步上升，到大约三分之二处的一个虚线标记时，两个区域大小相等。从那里到期限结束，本金都是两者中较大的一方，横带的末端几乎全是本金。两条轴上都没有刻度和数字。",
  ja: "30年ローンの返済期間を左から右へ横切る、高さが一定の帯です。1本の線がこの帯を2つの領域に分けています。上の領域が利息、下の領域が元金で、合わせて毎月の返済額のうちローンそのものにあたる部分です。したがって一方が大きくなれば、もう一方は同じだけ小さくなります。左端、購入直後では境界線は低い位置にあり、利息が帯の大部分を占めています。線は右へ向かって着実に上がっていき、およそ3分の2の位置にある破線の目印のところで、2つの領域は同じ大きさになります。そこから期間の終わりまでは元金のほうが大きく、帯の終わりはほぼすべてが元金です。どちらの軸にも目盛りや数値はありません。",
};
