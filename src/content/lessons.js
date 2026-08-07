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
 * its position on the Learn path. Lesson `id` is deliberately NOT renumbered:
 * ids are persisted in localStorage, keyed by `quizData`, drive the review
 * scheduler, and are cited by 142 in-prose cross-references ("Lesson 15"),
 * all of which resolve against the id the reader displays.
 */
export function lessonsByTrack(all = lessons) {
  return TRACKS.flatMap((tr) => lessonsInTrack(tr.key, all));
}

export const lessons = [
  {
    id: 1, track: "economy", icon: "🔄", color: "#2563eb",
    title: { en: "Transactions: The Building Block", es: "Transacciones: El Pilar Fundamental", ko: "거래: 경제의 기본 단위", zh: "交易：经济的基石", ja: "取引：経済の基本単位" },
    subtitle: { en: "Every time you buy something, you create a transaction", es: "Cada vez que compras algo, creas una transacción", ko: "무언가를 살 때마다 거래가 만들어집니다", zh: "每次购买都创造一笔交易", ja: "何かを買うたびに取引が生まれる" },
    sections: [
      {
        heading: { en: "What is a Transaction?", es: "¿Qué es una Transacción?", ko: "거래란 무엇인가?", zh: "什么是交易？", ja: "取引とは？" },
        body: {
          en: "Picture the last coffee you bought. You handed over money — or tapped a card — and got a cup of coffee in return. That's a transaction: a buyer exchanging money or credit with a seller for something of value. Zoom out, and an entire economy is nothing more mysterious than millions of trades like that happening at once: someone buying groceries, a company buying office chairs, a city buying asphalt to repave a road.\n\nHere's the part that trips people up: you didn't need actual cash for that coffee. Tap a credit card instead, and you've still bought it — you just paid with credit instead of money, and the barista's employer got paid all the same. That's why credit spends exactly like money: Total Spending = Money Spent + Credit Spent.\n\nTotal spending is what drives the whole economy, and there's a simple, almost mechanical way prices come from it: divide the total amount spent on something by how much of it was sold. If shoppers spend $500 on 100 loaves of bread at the same bakery, the price per loaf is $5. That's it — that's a transaction, repeated billions of times a day, adding up to an entire economy.",
          es: "Una economía es simplemente la suma de todas las transacciones. Cada transacción es un comprador intercambiando dinero o crédito con un vendedor por bienes, servicios o activos financieros.\n\nEl crédito se gasta igual que el dinero. Gasto Total = Dinero + Crédito.\n\nEl gasto total impulsa la economía.",
          ko: "경제는 모든 거래의 합입니다. 각 거래는 구매자가 돈이나 신용을 판매자에게 상품, 서비스, 금융자산과 교환하는 것입니다.\n\n신용은 돈처럼 사용됩니다. 총 지출 = 돈 지출 + 신용 지출.\n\n총 지출이 경제를 움직입니다.",
          zh: "经济就是所有交易的总和。每笔交易都是买方用货币或信贷与卖方交换商品、服务或金融资产。\n\n信贷和货币一样可以消费。总支出 = 货币支出 + 信贷支出。\n\n总支出驱动经济。",
          ja: "経済は全ての取引の合計です。各取引は、買い手がお金や信用を売り手に支払い、商品やサービスを得ること。\n\n信用はお金と同じように使えます。総支出 = お金 + 信用。\n\n総支出が経済を動かします。",
        },
      },
      {
        heading: { en: "Markets and the Economy", es: "Mercados y la Economía", ko: "시장과 경제", zh: "市场与经济", ja: "市場と経済" },
        body: {
          en: "A market is just all the buyers and sellers trading the same thing — everyone buying and selling wheat forms the wheat market; everyone trading a company's stock forms the market for that stock. Put every market together — food, cars, houses, stocks, labor, everything — and you have the whole economy.\n\nHouseholds, businesses, and banks all take part, but the biggest buyer and seller of all is the government, which plays two very different roles:\n\n• Central Government — collects taxes and decides how to spend them, on things like roads, schools, and defense\n• Central Bank — doesn't tax or spend directly. Instead it controls money and credit, mainly by setting interest rates and, in extreme situations, by creating new money",
          es: "Un mercado son todos los compradores y vendedores haciendo transacciones por lo mismo. Una economía consiste en todas las transacciones en todos los mercados.\n\nEl gobierno es el mayor comprador y vendedor, con dos partes:\n• Gobierno Central — recauda impuestos, gasta\n• Banco Central — controla dinero y crédito",
          ko: "시장은 같은 것을 거래하는 모든 구매자와 판매자입니다. 경제는 모든 시장의 모든 거래로 구성됩니다.\n\n정부가 가장 큰 구매자이자 판매자입니다:\n• 중앙정부 — 세금 징수, 지출\n• 중앙은행 — 금리와 화폐 발행으로 돈과 신용 통제",
          zh: "市场就是所有买卖同一种东西的人。经济由所有市场的所有交易组成。\n\n政府是最大的买卖方：\n• 中央政府——收税、支出\n• 中央银行——通过利率和印钞控制货币信贷",
          ja: "市場は同じものを取引する全ての売り手と買い手。経済は全市場の全取引で構成。\n\n政府が最大の買い手かつ売り手：\n• 中央政府：税を集め支出\n• 中央銀行：金利と紙幣印刷でお金と信用を管理",
        },
      },
    ],
    takeaway: {
      en: "If you can understand a single transaction — one buyer, one seller, money or credit changing hands — you already hold the seed of the whole economy. Everything in this course is just that same idea, repeated at a bigger and bigger scale.",
      es: "Si entendemos las transacciones, entendemos toda la economía.",
      ko: "거래를 이해하면 경제 전체를 이해할 수 있습니다. 모든 것은 여기서 시작됩니다.",
      zh: "理解了交易，就理解了整个经济。一切从这里开始。",
      ja: "取引を理解すれば、経済全体を理解できます。",
    },
    thinkAbout: {
      en: "Think about the last thing you bought, even something small like a snack. You exchanged money or credit for it, and that payment became someone else's income — the cashier's wage, the store's revenue, the supplier who stocked the shelf. Can you trace where your money went next?",
      es: "Piensa en tu última compra. Intercambiaste dinero por algo. Esa transacción se convirtió en el ingreso de alguien más.",
      ko: "마지막 구매를 생각해보세요. 돈(또는 신용)을 무언가와 교환했습니다. 그 거래는 다른 사람의 소득이 되었습니다.",
      zh: "想想你上次的购买。你用钱（或信贷）换了某样东西。那笔交易成了别人的收入。",
      ja: "最後の買い物を思い出してください。お金（または信用）を何かと交換しました。その取引は誰かの収入になりました。",
    },
  },
  {
    id: 2, track: "economy", icon: "💳", color: "#7c3aed",
    title: { en: "Credit: The Most Important Part", es: "Crédito: La Parte Más Importante", ko: "신용: 가장 중요한 부분", zh: "信贷：最重要的部分", ja: "信用：最も重要な部分" },
    subtitle: { en: "Credit is the biggest and most volatile part of the economy", es: "El crédito es la parte más grande y volátil de la economía", ko: "신용은 경제에서 가장 크고 변동성이 큰 부분입니다", zh: "信贷是经济中最大且最不稳定的部分", ja: "信用は経済で最大かつ最も変動が大きい部分" },
    sections: [
      {
        heading: { en: "How Credit Works", es: "Cómo Funciona el Crédito", ko: "신용의 작동 원리", zh: "信贷如何运作", ja: "信用の仕組み" },
        body: {
          en: "Say you want to buy a $20,000 car but only have $5,000 saved. A lender — a bank, a credit union, or the dealership itself — offers you a loan: they hand you $15,000 now, and you promise to pay it back over time, plus interest as their fee for taking the risk.\n\nThe moment you sign that promise, and the lender believes you'll keep it, $15,000 of brand-new credit is created out of thin air — nobody had to save it first. You drive off with the car; the lender now holds an asset (you owe them money), and you hold a liability (you owe it).\n\nInterest rates decide how expensive that promise is. When rates are high → borrowing costs more → fewer people take out loans. When rates are low → borrowing is cheap → more people do. That's exactly the lever the Federal Reserve uses to speed up or slow down the whole economy (more on that in Lesson 7).",
          es: "Los prestamistas quieren más dinero. Los prestatarios quieren comprar algo que no pueden pagar ahora.\n\nCuando los prestatarios prometen pagar y los prestamistas les creen, ¡el crédito se crea de la nada!\n\nTasas altas → menos préstamos\nTasas bajas → más préstamos",
          ko: "대출자는 돈을 더 많은 돈으로 만들고 싶어합니다. 차입자는 지금 살 수 없는 것을 사고 싶어합니다.\n\n차입자가 상환을 약속하고 대출자가 이를 믿으면, 신용이 무에서 만들어집니다!\n\n금리가 높으면 → 차입 감소\n금리가 낮으면 → 차입 증가",
          zh: "放贷者想让钱生更多钱。借款者想买现在买不起的东西。\n\n当借款者承诺还款，放贷者相信时，信贷就凭空创造了！\n\n利率高 → 借贷减少\n利率低 → 借贷增加",
          ja: "貸し手はお金を増やしたい。借り手は今買えないものを買いたい。\n\n借り手が返済を約束し貸し手が信じると、信用が無から生まれます！\n\n金利が高い → 借入減少\n金利が低い → 借入増加",
        },
      },
      {
        heading: { en: "Credit vs Money", es: "Crédito vs Dinero", ko: "신용 vs 돈", zh: "信贷 vs 货币", ja: "信用 vs お金" },
        body: {
          en: "Money settles a transaction on the spot. Hand a bartender $8 cash for a beer, and the deal is completely done — nobody owes anybody anything.\n\nCredit works differently. It's like running a tab at that same bar: you drink now and promise to pay when you close out later. The moment the bartender agrees to that tab, an asset and a liability were just created out of thin air — the bar is owed money, you owe the bar money — even though no cash changed hands yet.\n\nNow multiply that bar tab by every mortgage, car loan, credit card balance, and business loan in the country, and you reach a surprising reality: most of what people casually call \"money\" is actually credit. In the US, total credit outstanding is many times larger than the base money supply — a gap that has only widened over time as the economy has grown.",
          es: "El dinero cierra transacciones inmediatamente. El crédito es como una cuenta de bar — prometes pagar después.\n\nLa realidad: la mayoría del \"dinero\" es crédito. En EE.UU., el crédito total supera muchas veces la oferta de dinero base, una brecha que ha crecido con el tiempo.",
          ko: "돈은 거래를 즉시 완결합니다. 신용은 바 탭과 같습니다 — 나중에 지불하겠다는 약속입니다.\n\n놀라운 현실: 사람들이 \"돈\"이라고 부르는 것의 대부분은 사실 신용입니다. 미국의 총 신용은 기초 통화량보다 훨씬 크며, 이 격차는 경제가 성장하며 계속 커져왔습니다.",
          zh: "货币立即结算交易。信贷像酒吧记账——你承诺以后付。\n\n惊人的现实：人们所说的\"钱\"大部分实际是信贷。美国总信贷规模是基础货币供应量的许多倍，且随着经济增长这一差距不断扩大。",
          ja: "お金は取引を即座に決済。信用はバーのツケ。後で払うと約束する。\n\n驚くべき現実：人々が「お金」と呼ぶものの大半は実は信用です。米国の総信用残高は基礎マネーサプライの何倍にも達し、経済成長とともにその差は広がり続けています。",
        },
      },
      {
        heading: { en: "The Spending Chain", es: "La Cadena de Gasto", ko: "지출의 연쇄", zh: "支出链条", ja: "支出の連鎖" },
        body: {
          en: "Why does credit matter so much? Because borrowing lets you spend more than your income alone would allow — and one person's spending is always someone else's income.\n\nSay a homeowner borrows to renovate a kitchen. That money becomes the contractor's income. The contractor, now earning more, looks more creditworthy to a lender and borrows to buy a new work truck. That purchase becomes the truck dealer's income — and the chain keeps going.\n\nMore spending → more income → more creditworthy borrowers → more borrowing → more spending, and so on. This self-reinforcing loop runs in both directions — it's exactly why economies move in booms and busts instead of growing in a straight line.",
          es: "¿Por qué importa el crédito? Porque cuando gastas más, alguien gana más.\n\nMás gasto → más ingreso → más crédito → más préstamos → más gasto. Este patrón auto-reforzante crea los ciclos económicos.",
          ko: "신용이 왜 중요할까요? 신용으로 더 많이 쓸 수 있고, 한 사람의 지출은 다른 사람의 소득이기 때문입니다.\n\n더 많은 지출 → 더 많은 소득 → 더 높은 신용도 → 더 많은 차입 → 더 많은 지출. 이 자기 강화 패턴이 경제 순환을 만듭니다.",
          zh: "为什么信贷如此重要？因为有了信贷你就能花更多，而一个人的支出就是另一个人的收入。\n\n更多支出 → 更多收入 → 更高信用 → 更多借贷 → 更多支出。这个自我强化的模式就是经济周期的原因。",
          ja: "なぜ信用が重要か？信用で支出が増え、誰かの支出は別の誰かの収入だから。\n\n支出増 → 収入増 → 信用力向上 → 借入増 → 支出増。この自己強化パターンが経済サイクルを生みます。",
        },
      },
    ],
    takeaway: {
      en: "Credit creates a self-reinforcing loop in BOTH directions — one person's borrowing fuels another's income, which fuels more borrowing, all the way up in a boom and all the way down in a bust.",
      es: "El crédito crea ciclos auto-reforzantes en AMBAS direcciones — auges Y caídas.",
      ko: "신용은 양 방향으로 자기 강화 순환을 만듭니다 — 호황과 불황 모두.",
      zh: "信贷在两个方向都创造自我强化的周期——繁荣和衰退。",
      ja: "信用は両方向に自己強化サイクルを作る — 好景気も不景気も。",
    },
    thinkAbout: {
      en: "Imagine you borrow $10,000 to start a small business and spend it on equipment and a first month's rent. That money becomes the equipment seller's and the landlord's income — and now they can spend or borrow more too. Can you trace how that single loan ripples outward into growth for other people?",
      es: "Si pides prestado $10,000 y los gastas, eso se convierte en ingreso de alguien. ¿Ves cómo el crédito crea crecimiento?",
      ko: "$10,000을 빌려 쓰면 그것은 누군가의 소득이 됩니다. 그들도 이제 더 빌릴 수 있습니다. 신용이 어떻게 성장을 만드는지 보이시나요?",
      zh: "如果你借了10,000美元并花掉，那就成了别人的收入。他们现在也能借更多。你能看到信贷如何创造增长吗？",
      ja: "1万ドル借りて使えば、それは誰かの収入になります。その人も借入できる。信用が成長を生む仕組みが見えますか？",
    },
  },
  {
    id: 3, track: "economy", icon: "📈", color: "#059669",
    title: { en: "Productivity Growth: The Long-Run Driver", es: "Crecimiento de Productividad", ko: "생산성 성장: 장기 동력", zh: "生产力增长：长期驱动力", ja: "生産性成長：長期的な推進力" },
    subtitle: { en: "What really matters in the long run", es: "Lo que realmente importa a largo plazo", ko: "장기적으로 정말 중요한 것", zh: "长期来看真正重要的是什么", ja: "長期的に本当に重要なこと" },
    sections: [
      {
        heading: { en: "Productivity vs Credit", es: "Productividad vs Crédito", ko: "생산성 vs 신용", zh: "生产力 vs 信贷", ja: "生産性 vs 信用" },
        body: {
          en: "Think about a farmer who learns a better crop rotation, or a factory that adopts a machine that lets one worker do the work of three. Each small improvement in know-how and technology raises how much value people can create with the same time and effort. Multiply that across a whole economy over decades, and you get productivity growth — the slow, steady climb in living standards.\n\nProductivity matters most in the long run, but credit matters most in the short run. Here's why: productivity grows in a fairly straight, gentle line — a farmer doesn't get twice as skilled overnight. But borrowing swings wildly, because credit lets people consume MORE than they produce today (when they borrow) and LESS than they produce later (when they pay it back).\n\nWithout credit, the only way an economy grows is by becoming more productive — slow and steady. Add credit to the mix, and you get cycles: bursts of borrowing-fueled growth followed by periods of paying it back.",
          es: "La productividad importa más a largo plazo, pero el crédito importa más a corto plazo.\n\nLa productividad crece de forma estable. El crédito fluctúa salvajemente, creando ciclos.",
          ko: "생산성은 장기적으로 가장 중요하지만, 신용은 단기적으로 가장 중요합니다.\n\n생산성 성장은 크게 변동하지 않습니다. 하지만 부채는 크게 흔들립니다 — 빌릴 때 생산 이상으로 소비하고, 갚을 때 생산 이하로 소비하기 때문입니다.",
          zh: "生产力长期最重要，但信贷短期最重要。\n\n生产力增长不会大幅波动。但债务剧烈波动——借债时消费超过生产，还债时消费低于生产。",
          ja: "生産性は長期的に最も重要で、信用は短期的に最も重要。\n\n生産性成長は大きく変動しない。しかし債務は大きく揺れる — 借りる時は生産以上に消費し、返す時は以下になる。",
        },
      },
      {
        heading: { en: "Good Debt vs Bad Debt", es: "Deuda Buena vs Deuda Mala", ko: "좋은 부채 vs 나쁜 부채", zh: "好债 vs 坏债", ja: "良い借金 vs 悪い借金" },
        body: {
          en: "Credit isn't inherently good or bad — it depends entirely on what the money is used for.\n\nTake two people who each borrow $15,000. One spends it on a lavish vacation and a new television. It was fun for a while, but it created no new income — the debt has to be repaid entirely out of whatever they were already earning, now stretched thinner.\n\nThe other borrows the same amount for a tractor on their small farm. The tractor lets them harvest more crops, sell more at market, and earn more income — enough, over time, to pay back the loan AND come out ahead. Same size loan, opposite outcome.\n\nThe question to ask about any debt — a car loan, a business loan, a student loan — is always the same: will the borrowed money generate enough extra income to pay itself back? If yes, it's productive debt. If no, it's just borrowing from your future self for something that doesn't pay you back.",
          es: "El crédito no es necesariamente malo. Depende de cómo se use:\n\nMALO: Pedir prestado para un TV grande.\nBUENO: Pedir prestado para un tractor que te ayude a ganar más.",
          ko: "신용은 반드시 나쁜 것이 아닙니다. 사용 방법에 따라 다릅니다:\n\n나쁨: 큰 TV를 사기 위한 대출 — 소득을 만들지 못합니다.\n좋음: 트랙터를 사기 위한 대출 — 더 많은 작물을 수확하고 부채를 갚을 수 있습니다.",
          zh: "信贷不一定是坏事，取决于怎么用：\n\n坏的：借钱买大电视——不能产生收入还债。\n好的：借钱买拖拉机——能收获更多庄稼、赚更多钱、还清债务。",
          ja: "信用は必ずしも悪くない。使い方次第：\n\n悪い：大きなTVのための借金 — 収入を生まない。\n良い：トラクターのための借金 — 作物を増やし収入を生む。",
        },
      },
    ],
    takeaway: {
      en: "Borrowing is pulling spending forward from your future self — like the farmer's tractor loan repaid out of next season's harvest. Every time you borrow, you create a cycle, and that's true whether you're one household or an entire economy.",
      es: "Pedir prestado es adelantar gasto de tu futuro. Cada vez que pides prestado, creas un ciclo.",
      ko: "차입은 미래의 자신에게서 지출을 앞당기는 것입니다. 빌릴 때마다 순환이 만들어집니다.",
      zh: "借钱就是从未来的自己那里提前支出。每次借钱都创造一个周期。",
      ja: "借金は未来の自分から支出を前借りすること。借りるたびにサイクルが生まれる。",
    },
    thinkAbout: {
      en: "If you borrow from your future self to spend more today, there MUST come a time when you have less left over to spend — that's simple arithmetic. Now imagine millions of people and businesses all doing this on their own schedules. That's why credit creates cycles across an entire economy — up, then down.",
      es: "Si pides prestado de tu futuro, DEBE haber un momento en que gastes menos.",
      ko: "지금 쓰기 위해 미래에서 빌리면, 반드시 덜 쓰는 시기가 옵니다. 그래서 신용이 순환을 만듭니다.",
      zh: "如果从未来借来花，必然有一天要少花。这就是信贷创造周期的原因。",
      ja: "未来の自分から借りて今使うなら、必ず少なく使う時期が来る。だから信用はサイクルを作る。",
    },
  },
  {
    id: 4, track: "economy", icon: "🔁", color: "#d97706",
    title: { en: "The Short-Term Debt Cycle", es: "El Ciclo de Deuda a Corto Plazo", ko: "단기 부채 순환", zh: "短期债务周期", ja: "短期債務サイクル" },
    subtitle: { en: "5-8 years — the business cycle most people know", es: "5-8 años — el ciclo que la mayoría conoce", ko: "5-8년 — 대부분의 사람들이 아는 경기 순환", zh: "5-8年——大多数人熟知的经济周期", ja: "5-8年 — ほとんどの人が知る景気循環" },
    sections: [
      {
        heading: { en: "Expansion Phase", es: "Fase de Expansión", ko: "확장 국면", zh: "扩张阶段", ja: "拡大局面" },
        body: {
          en: "Imagine a town where a new factory opens and hires hundreds of workers. Those workers now have paychecks to spend — at restaurants, on cars, at the hardware store. Restaurant owners hire more staff to keep up; the car dealer orders more inventory. This is expansion: spending increases, and because credit can be created instantly (Lesson 2), people borrow to spend even more than their paychecks alone would allow.\n\nBut there's a limit to how many meals a town's restaurants can actually cook in a day. When spending and incomes grow faster than the town can really produce, businesses respond by raising prices instead of magically producing more — that's inflation.\n\nThe Central Bank doesn't want inflation running too hot, so it raises interest rates. Higher rates mean the factory worker's car loan gets pricier, fewer people take out new loans, and existing variable-rate debts cost more to service — all of which cools spending back down.",
          es: "La actividad económica aumenta. El gasto sube, los precios suben. El banco central sube tasas para controlar la inflación.",
          ko: "경제 활동이 증가하면 확장기가 시작됩니다. 지출이 늘고 가격이 오릅니다.\n\n지출과 소득이 생산보다 빠르게 증가하면 → 가격 상승 → 이것이 인플레이션입니다.\n\n중앙은행은 과도한 인플레이션을 원하지 않아 금리를 올립니다.",
          zh: "经济活动增加时出现扩张。支出增加，价格上涨。\n\n当支出增长快于生产 → 价格上涨 → 这就是通胀。\n\n央行不想通胀太高，所以加息。",
          ja: "経済活動が増加すると拡大期。支出が増え、価格が上がる。\n\n支出の伸びが生産を上回ると → 物価上昇 → インフレ。\n\n中央銀行は過度なインフレを防ぐため金利を上げる。",
        },
      },
      {
        heading: { en: "Contraction & Recession", es: "Contracción y Recesión", ko: "수축과 경기침체", zh: "收缩与衰退", ja: "収縮と景気後退" },
        body: {
          en: "Back in that same town, higher rates mean the factory worker skips the car loan and cuts back on eating out. The restaurant, seeing fewer customers, cuts a server's hours — and that server now has less to spend at the hardware store. Because one person's spending is another's income, this pullback ripples outward: incomes drop, and spending drops even further in response.\n\nWhen enough people across the economy spend less, businesses start cutting prices to attract customers — that's deflation — and overall economic activity shrinks. That's a recession.\n\nIf things get bad enough, the central bank reverses course and lowers interest rates again. Cheaper borrowing brings the factory worker back to the car lot, spending picks up, and a new expansion begins. This up-and-down cycle repeats roughly every 5-8 years, steered mostly by the central bank's interest-rate decisions.",
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
    id: 5, track: "economy", icon: "🌊", color: "#dc2626",
    title: { en: "The Long-Term Debt Cycle", es: "El Ciclo de Deuda a Largo Plazo", ko: "장기 부채 순환", zh: "长期债务周期", ja: "長期債務サイクル" },
    subtitle: { en: "75-100 years — the big wave underneath", es: "75-100 años — la gran ola debajo", ko: "75-100년 — 밑에 깔린 큰 파도", zh: "75-100年——潜藏的大浪", ja: "75-100年 — 底に潜む大きな波" },
    sections: [
      {
        heading: { en: "How Debt Accumulates", es: "Cómo se Acumula la Deuda", ko: "부채가 축적되는 방식", zh: "债务如何累积", ja: "借金の蓄積" },
        body: {
          en: "Picture a neighborhood where home prices have risen every year for a decade. A family buys a house not just to live in, but because they're confident it'll be worth more next year — so they stretch their budget and take out the biggest mortgage a bank will approve. Across many short-term cycles like the one in Lesson 4, this happens over and over: debts rise faster than incomes, because human nature favors borrowing and spending more today over paying down debt.\n\nLenders keep lending freely through all of this, because everyone can see the evidence with their own eyes — incomes are rising, home values are up, the stock market is roaring. Confidence feeds on itself.\n\nWhen enough people borrow heavily to buy an asset — houses, stocks, anything — purely because they expect the price to keep rising, that pushes prices higher still. That's a bubble.\n\nAs long as incomes keep rising too, the debt burden (the ratio of what's owed to what's earned) looks manageable. But nothing rises forever, and that's exactly the problem.",
          es: "A lo largo de muchos ciclos cortos, la deuda crece más rápido que los ingresos. La gente prefiere gastar que pagar deuda.\n\nCuando la gente pide mucho prestado para comprar activos como inversión, eso es una burbuja.",
          ko: "여러 단기 순환을 거치면서 부채가 소득보다 빠르게 증가합니다. 사람들이 부채를 갚기보다 더 빌리고 쓰는 것을 선호하기 때문입니다.\n\n사람들이 투자로 자산을 사기 위해 많이 빌리면 — 그것이 버블입니다. 하지만 이것은 영원히 계속될 수 없습니다.",
          zh: "经过许多短期周期，债务增长快于收入。人们更愿意借钱消费而非还债。\n\n当人们大量借钱购买资产投资，推动价格越来越高——这就是泡沫。但这不可能永远持续。",
          ja: "多くの短期サイクルの中で、債務は所得より速く増加。人は返済より借入・消費を好むから。\n\n資産を買うために大量に借りる時 — それがバブル。しかし永遠には続かない。",
        },
      },
      {
        heading: { en: "The Peak & Deleveraging", es: "El Pico y Desapalancamiento", ko: "정점과 디레버리징", zh: "顶峰与去杠杆", ja: "ピークとデレバレッジング" },
        body: {
          en: "Eventually, the family from our example finds their mortgage payment eating up more of their paycheck every year, while their home's value stops climbing. They cut back on other spending to keep up. Multiply that family by millions, and incomes across the economy fall, people look less creditworthy to lenders, borrowing dries up, and the whole cycle reverses. This is the long-term debt peak.\n\nThis is the pattern behind some of history's most painful downturns: the US in 2008, Japan in 1989, and the US in 1929.\n\nIn a deleveraging, spending falls, credit disappears, asset prices — including that family's house — drop, banks get squeezed as borrowers can't repay, the stock market crashes, and social tensions rise.\n\nThe key difference from an ordinary recession: interest rates can't ride to the rescue, because by this point they're often already close to 0%.",
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
      en: "The US debt-to-GDP ratio has climbed well past 100% in recent decades. People feel wealthy because assets keep going up. Does this sound like the late stage of a long-term debt cycle to you?",
      es: "La ratio deuda/PIB de EE.UU. ha superado el 100% en las últimas décadas. ¿Suena como la etapa tardía de un ciclo largo?",
      ko: "최근 수십 년간 미국의 GDP 대비 부채 비율은 100%를 훌쩍 넘어섰습니다. 이것이 장기 부채 순환의 후기 단계처럼 들리시나요?",
      zh: "近几十年美国债务/GDP比率已远超100%。这听起来像长期债务周期的后期阶段吗？",
      ja: "近年、米国の債務/GDP比率は100%を大きく超えています。長期債務サイクルの後期段階に聞こえますか？",
    },
  },
  {
    id: 6, track: "economy", icon: "🏗️", color: "#4f46e5",
    title: { en: "Deleveraging: The 4 Tools", es: "Desapalancamiento: Las 4 Herramientas", ko: "디레버리징: 4가지 도구", zh: "去杠杆：4大工具", ja: "デレバレッジング：4つの手段" },
    subtitle: { en: "How economies deal with too much debt", es: "Cómo las economías manejan demasiada deuda", ko: "경제가 과다 부채를 다루는 방법", zh: "经济如何应对过多债务", ja: "経済が過大な借金にどう対処するか" },
    sections: [
      {
        heading: { en: "The 4 Ways to Reduce Debt Burden", es: "Las 4 Formas de Reducir la Carga de Deuda", ko: "부채 부담을 줄이는 4가지 방법", zh: "减轻债务负担的4种方式", ja: "債務負担を軽減する4つの方法" },
        body: {
          en: "When a household — or an entire country — has taken on too much debt, there are really only four levers anyone can pull:\n\n1. CUT SPENDING (Austerity). Think of a city government facing a budget shortfall that lays off workers and cancels contracts to save money. It's painful, and it can backfire: when the city stops paying those workers, they spend less at local businesses, incomes fall citywide, and the debt burden relative to income can actually get WORSE, not better.\n\n2. REDUCE DEBTS (Defaults & Restructuring). Picture a bank calling in loans it knows won't be repaid, writing some of them off. Borrowers can't pay, banks get squeezed, and people rush to withdraw their savings before more banks fail. This is what a depression looks like.\n\n3. REDISTRIBUTE WEALTH. A government raises taxes on higher earners to fund support for everyone else. It can ease the burden, but it also tends to raise social tension between those paying more and those receiving more.\n\n4. PRINT MONEY. When rates are already near 0%, the central bank creates new money to buy government bonds and other financial assets — effectively refilling the well that austerity and defaults just drained. This is inflationary and stimulative, the opposite of the first three tools.",
          es: "1. RECORTAR GASTO (Austeridad)\n2. REDUCIR DEUDAS (Impagos)\n3. REDISTRIBUIR RIQUEZA (Impuestos)\n4. IMPRIMIR DINERO (QE)",
          ko: "1. 지출 삭감 (긴축) — 고통스럽고 디플레이션적\n2. 부채 감소 (채무불이행 & 구조조정)\n3. 부의 재분배 (부자 증세)\n4. 화폐 발행 — 인플레이션적이고 부양적 — 처음 세 가지의 반대",
          zh: "1. 削减支出（紧缩）——痛苦、通缩\n2. 减少债务（违约和重组）\n3. 重新分配财富（向富人征税）\n4. 印钞——通胀性和刺激性——与前三种相反",
          ja: "1. 支出削減（緊縮） — 苦痛でデフレ的\n2. 債務削減（デフォルト・再編）\n3. 富の再分配（富裕層への増税）\n4. 紙幣印刷 — インフレ的で刺激的 — 最初の3つと逆",
        },
      },
      {
        heading: { en: "Beautiful vs Ugly Deleveraging", es: "Desapalancamiento Hermoso vs Feo", ko: "아름다운 vs 추한 디레버리징", zh: "漂亮 vs 丑陋的去杠杆", ja: "美しいvs醜いデレバレッジング" },
        body: {
          en: "The key is BALANCE — like a chef adjusting seasoning: too much of the deflationary tools (cutting, defaulting, taxing) without enough of the inflationary one (printing money), and the result turns out bitter and depressive. Too much of the inflationary tool alone, and it turns into an inflated mess instead.\n\nGet the mix right, and you get a 'beautiful deleveraging': debts decline relative to income, growth stays positive, and inflation stays manageable. Many economists point to the US recovery from 2008 through roughly 2015 as an example of that balance working reasonably well.\n\nGet the mix wrong, and you get an 'ugly deleveraging.' Germany in the 1920s leaned almost entirely on printing money, and the result was hyperinflation so severe that people famously carried wheelbarrows of cash just to buy bread. The US in the 1930s leaned almost entirely on austerity, and the result was the Great Depression.\n\nEither way, recovery from a long-term debt peak tends to take roughly a decade — often called the 'lost decade.'",
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
    id: 7, track: "economy", icon: "💹", color: "#1e40af",
    title: { en: "Interest Rates: The Master Signal", es: "Tasas de Interés: La Señal Maestra", ko: "금리: 마스터 신호", zh: "利率：主导信号", ja: "金利：マスターシグナル" },
    subtitle: { en: "How the Fed steers the economy", es: "Cómo el Fed dirige la economía", ko: "연준이 경제를 조종하는 방법", zh: "美联储如何引导经济", ja: "FRBが経済を舵取りする方法" },
    sections: [
      {
        heading: { en: "The Fed Funds Rate", es: "La Tasa de Fondos Federales", ko: "연방기금금리", zh: "联邦基金利率", ja: "フェデラルファンド金利" },
        body: {
          en: "Think of the Federal Funds Rate as the master dial in the economy's control room. When the Fed turns it, nearly every other rate in your financial life follows — the rate on a new mortgage, what your savings account pays you, the APR on your credit card.\n\nRaise the dial → borrowing gets more expensive → the economy slows down.\nLower the dial → borrowing gets cheaper → the economy speeds up.\n\nThis is the Fed's primary tool for managing the short-term debt cycle from Lesson 4. But here's the catch: turning the dial doesn't change anything instantly. It typically takes 12-24 months for a rate change to fully work its way through mortgages, business loans, and hiring decisions — which is part of why the Fed sometimes turns the dial too far in one direction before the earlier turn has fully kicked in.",
          es: "La tasa de fondos federales influye en TODAS las demás tasas.\n\nSubir tasas → frena la economía\nBajar tasas → estimula la economía\n\nLa política funciona con retraso de 12-24 meses.",
          ko: "연방기금금리는 모기지, 저축, 신용카드 등 모든 금리에 영향을 미치는 핵심 금리입니다.\n\n금리 인상 → 경제 둔화\n금리 인하 → 경제 부양\n\n정책 효과는 12-24개월의 시차가 있습니다.",
          zh: "联邦基金利率是影响所有其他利率的关键利率。\n\n加息 → 经济减速\n降息 → 经济刺激\n\n政策效果有12-24个月的滞后。",
          ja: "FF金利は住宅ローン、貯蓄、クレジットカードなど全ての金利に影響する最重要金利。\n\n利上げ → 経済減速\n利下げ → 経済刺激\n\n効果には12-24ヶ月の遅れがある。",
        },
      },
      {
        heading: { en: "How Rates Affect Everything", es: "Cómo las Tasas Afectan Todo", ko: "금리가 모든 것에 미치는 영향", zh: "利率如何影响一切", ja: "金利がすべてに与える影響" },
        body: {
          en: "Here's why that one dial reaches so far. Say the Fed raises rates. A young tech company that was borrowing cheaply to fund years of growth now faces a much higher cost of capital, and its stock — priced on years of future profits — tends to fall harder than a stable utility company's. Existing bonds paying a lower fixed rate become less attractive next to new bonds paying the higher current rate, so bond prices fall too. A family shopping for a house finds the mortgage payment on that same home is suddenly hundreds of dollars more per month, and home sales cool over the following 6-12 months. Meanwhile, a plain savings account or money-market fund starts paying a genuinely competitive yield again, and the US dollar tends to strengthen as savers worldwide chase that yield.\n\nCut rates, and the sequence tends to run in reverse: stocks rise, bond prices rise, real estate recovers, gold often rises, and the dollar tends to weaken.\n\nThe informal rule investors cite for all of this: \"Don't fight the Fed.\" Historically, Fed easing (rate cuts) has coincided with rising asset prices, while Fed tightening (rate hikes) has coincided with more cautious market conditions.",
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
      en: "The Fed raised rates to 5.25-5.50% in 2022-23 to fight inflation. Since policy takes 12-24 months to fully show up, look up today's Fed funds rate — how much of that move do you think has already rippled through the economy?",
      es: "El Fed subió tasas a 5.25-5.50% en 2022-23. La política tarda 12-24 meses en manifestarse del todo — busca la tasa actual del Fed. ¿Cuánto de ese efecto crees que ya se ha sentido?",
      ko: "연준은 2022-23년에 인플레이션과 싸우기 위해 5.25-5.50%까지 금리를 올렸습니다. 정책 효과는 12-24개월이 걸리므로, 현재 연준 금리를 찾아보세요 — 그 영향이 얼마나 경제에 퍼졌다고 생각하시나요?",
      zh: "美联储在2022-23年将利率提高到5.25-5.50%以对抗通胀。政策效果需要12-24个月才能完全显现——查一下目前的联邦基金利率，你认为这次加息的影响已经在经济中体现了多少？",
      ja: "FRBは2022-23年にインフレ対策で5.25-5.50%まで利上げしました。政策効果が完全に表れるには12-24ヶ月かかります——現在のFF金利を調べてみましょう。この影響はどれくらい経済に波及したと思いますか？",
    },
  },
  {
    id: 8, track: "economy", icon: "📐", color: "#9333ea",
    title: { en: "The Yield Curve: Crystal Ball", es: "La Curva de Rendimiento: Bola de Cristal", ko: "수익률 곡선: 수정 구슬", zh: "收益率曲线：水晶球", ja: "イールドカーブ：水晶玉" },
    subtitle: { en: "A historically reliable recession predictor since 1955", es: "Un predictor de recesión históricamente fiable desde 1955", ko: "1955년 이후 역사적으로 신뢰할 수 있는 경기침체 예측 지표", zh: "自1955年以来历史上较为可靠的衰退预测指标", ja: "1955年以来、歴史的に信頼性の高い景気後退予測指標" },
    sections: [
      {
        heading: { en: "What is the Yield Curve?", es: "¿Qué es la Curva?", ko: "수익률 곡선이란?", zh: "什么是收益率曲线？", ja: "イールドカーブとは？" },
        body: {
          en: "Imagine lending money to a friend. If they'll pay you back next week, you might not even ask for interest. If they won't pay you back for 10 years, you'd want a lot more in return — more can go wrong over a longer stretch. That's the basic logic behind the yield curve: a graph of the interest rate the government pays to borrow money for different lengths of time (2 years, 10 years, 30 years).\n\nNORMAL (upward slope) — Longer loans pay higher rates than shorter ones, exactly like the friend example. This is the healthy, default shape.\n\nFLAT — Short and long rates converge. It's the bond market's way of shrugging: a warning that a slowdown may be coming.\n\nINVERTED (short rates above long rates) — This is strange enough to be a real warning sign: it means lenders are willing to accept LESS to lock in money for 10 years than for 2, which usually means they expect the economy to weaken and rates to fall substantially in the meantime. Historically one of the most reliable recession signals, with a typical lead time of 12-18 months. Every US recession since 1955 was preceded by an inversion — though not every inversion has been followed by a recession, so it's a strong signal, not a certainty.\n\nSTEEP — The gap widens back out, often seen after the Fed starts cutting short-term rates. A shape frequently associated with recovery.",
          es: "Un gráfico de tasas de interés de bonos a diferentes plazos.\n\nNormal = saludable. Invertida = peligro — cada recesión de EE.UU. desde 1955 estuvo precedida por una inversión, aunque no toda inversión ha sido seguida de recesión.",
          ko: "다른 만기의 국채 금리 그래프입니다.\n\n정상(우상향) = 건강한 경제\n역전(단기>장기) = 위험! 1955년 이후 모든 미국 경기침체 전에 역전이 있었지만, 모든 역전이 경기침체로 이어진 것은 아닙니다.",
          zh: "不同期限国债利率的图表。\n\n正常（向上倾斜）= 健康经济\n倒挂（短期>长期）= 危险！自1955年以来，每次美国衰退前都出现过收益率曲线倒挂，但并非每次倒挂后都发生了衰退。",
          ja: "異なる満期の国債金利のグラフ。\n\n正常（右肩上がり）= 健全な経済\n逆転（短期>長期）= 危険！1955年以来、全ての米国景気後退の前に逆イールドが発生していますが、逆イールドの後に必ず景気後退が起きるとは限りません。",
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
    id: 9, track: "economy", icon: "🏦", color: "#be185d",
    title: { en: "QE & QT: The Fed's Power Tools", es: "QE y QT: Las Herramientas del Fed", ko: "QE & QT: 연준의 강력한 도구", zh: "QE与QT：美联储的强力工具", ja: "QE & QT：FRBのパワーツール" },
    subtitle: { en: "When rates at 0% aren't enough", es: "Cuando las tasas en 0% no son suficientes", ko: "0% 금리로도 충분하지 않을 때", zh: "当利率降到0%还不够时", ja: "金利0%でも不十分な時" },
    sections: [
      {
        heading: { en: "Quantitative Easing (QE)", es: "Flexibilización Cuantitativa (QE)", ko: "양적완화 (QE)", zh: "量化宽松（QE）", ja: "量的緩和（QE）" },
        body: {
          en: "Normally the Fed's master dial (Lesson 7) is interest rates. But once that dial is already turned all the way down to 0%, it can't go any lower — and if the economy still needs help, the Fed reaches for a different tool entirely.\n\nQuantitative Easing works like this: the Fed creates new money electronically (no printing press involved, just entries in a ledger) and uses it to buy up government bonds and mortgage-backed securities from banks and investors — stepping into the bond market as an enormous buyer, competing for the same bonds everyone else wants.\n\nThat buying pressure pushes bond prices up (and yields, meaning the return on those bonds, down), makes borrowing cheaper across the economy, and — because bonds now pay less — nudges investors who want a decent return toward riskier assets like stocks instead.\n\nQE1 (2008): $1.75 trillion\nQE2 (2010): $600 billion\nQE3 (2012): $85B/month\nCOVID QE (2020): Unlimited\n\nThe scale of this tool shows up on the Fed's own balance sheet, which grew from roughly $900 billion before 2008 to a peak of about $9 trillion in 2022 — a stack of bonds nine times the size of the entire pre-2008 institution.",
          es: "Cuando las tasas llegan a 0%, el banco central imprime dinero electrónicamente y compra bonos.\n\nEl balance del Fed creció de ~$900B antes de 2008 a ~$9T pico en 2022.",
          ko: "금리가 0%에 도달하면 중앙은행이 전자적으로 돈을 발행하여 국채와 MBS를 매입합니다.\n\n연준 대차대조표: 2008년 이전 ~$9000억 → 2022년 정점 ~$9조.",
          zh: "当利率降至0%时，央行电子印钞购买国债和抵押贷款支持证券。\n\n美联储资产负债表：2008年前约9000亿 → 2022年峰值约9万亿。",
          ja: "金利が0%に達すると中央銀行が電子的に紙幣を印刷し国債やMBSを購入。\n\nFRBバランスシート：2008年前約9000億ドル → 2022年ピーク約9兆ドル。",
        },
      },
      {
        heading: { en: "Quantitative Tightening (QT)", es: "Ajuste Cuantitativo (QT)", ko: "양적긴축 (QT)", zh: "量化紧缩（QT）", ja: "量的引き締め（QT）" },
        body: {
          en: "QT is the reverse of QE — instead of buying more bonds, the Fed simply lets the bonds it already owns mature and doesn't reinvest the proceeds into new ones. No dramatic selling, just letting existing holdings quietly run off.\n\nThis drains money from the financial system, pushes bond yields back UP, and tightens financial conditions overall — the mirror image of everything QE did.\n\nQT is like slowly letting air out of a balloon rather than popping it: quiet and gradual, but it can still cause turbulence if done too fast, since it removes some of the same buying support that had been propping up bond prices.\n\nThe Fed ran QT at $95 billion a month starting in 2022, slowing the pace in 2024 as the balance sheet worked its way down from its $9 trillion peak.",
          es: "Lo opuesto al QE. El Fed reduce su balance dejando que los bonos venzan sin reinvertir.\n\nFunciona a $95B/mes desde 2022, con el ritmo reducido en 2024 mientras el balance baja desde su pico de $9T.",
          ko: "QE의 반대. 연준이 채권을 재투자 없이 만기시켜 대차대조표를 축소합니다.\n\n2022년부터 월 $950억 규모로 시행, 2024년에는 속도를 늦추며 대차대조표가 $9조 정점에서 축소되었습니다.",
          zh: "QE的反面。美联储让债券到期不再投资来缩减资产负债表。\n\n2022年起每月950亿美元的速度实施，2024年放缓节奏，资产负债表从9万亿美元的峰值持续下降。",
          ja: "QEの逆。FRBが債券を再投資せず満期にしバランスシートを縮小。\n\n2022年から月950億ドルのペースで実施し、2024年には速度を緩めながら、バランスシートは9兆ドルのピークから縮小しています。",
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
    id: 10, track: "economy", icon: "🔄", color: "#059669",
    title: { en: "The 4 Phases of Economic Cycles", es: "Las 4 Fases del Ciclo Económico", ko: "경제 순환의 4단계", zh: "经济周期的4个阶段", ja: "経済サイクルの4つの局面" },
    subtitle: { en: "Expansion → Peak → Contraction → Trough", es: "Expansión → Pico → Contracción → Valle", ko: "확장 → 정점 → 수축 → 저점", zh: "扩张 → 顶峰 → 收缩 → 低谷", ja: "拡大 → ピーク → 収縮 → 底" },
    sections: [
      {
        heading: { en: "Expansion & Peak", es: "Expansión y Pico", ko: "확장기와 정점", zh: "扩张与顶峰", ja: "拡大期とピーク" },
        body: {
          en: "Picture the same factory town from Lesson 4, a few years into its boom. EXPANSION: credit flows freely, GDP rises, new jobs keep appearing, and confidence builds. People borrow more, spend more, and feel wealthier — the town adds a second restaurant, then a third. Historically, this phase has coincided with S&P 500 average returns of roughly +14-28%, and assets like growth stocks, cyclical stocks, and real estate have historically been favored in it.\n\nPEAK: the town's output is now about as high as it can go — every worker is employed, every restaurant full. Inflation is running at highs, and the Fed is raising rates to cool things down. Growth stalls, even though the mood hasn't caught up yet. This is where the seeds of the next contraction are quietly planted.\n\nHistorically favored in this phase: value stocks, commodities, and short-duration bonds.",
          es: "EXPANSIÓN: El crédito fluye. PIB sube, empleo crece. Históricamente favorecidas en esta fase: acciones de crecimiento.\n\nPICO: Producción máxima. Inflación alta, Fed subiendo tasas.",
          ko: "확장기: 신용이 자유롭게 흐릅니다. GDP 상승, 일자리 창출. 역사적으로 이 시기에 강세를 보인 자산: 성장주, 경기순환주.\n\n정점: 최대 생산량. 인플레이션 고점, 연준 금리 인상.",
          zh: "扩张期：信贷自由流动。GDP上升、就业增加。历史上此阶段表现较强的资产：成长股、周期股。\n\n顶峰：最大产出。通胀高位、美联储加息。",
          ja: "拡大期：信用が自由に流れる。GDP上昇、雇用創出。歴史的にこの局面で強かった資産：グロース株、景気循環株。\n\nピーク：最大産出。インフレ高水準、FRB利上げ。",
        },
      },
      {
        heading: { en: "Contraction & Trough", es: "Contracción y Valle", ko: "수축기와 저점", zh: "收缩与低谷", ja: "収縮期と底" },
        body: {
          en: "CONTRACTION: back in the town, credit contracts, spending falls, and the third restaurant lays off staff, then closes. Unemployment rises across the whole town, and the Fed starts cutting rates to try to stop the slide. Historically, this phase has coincided with S&P 500 average declines of roughly -22-35%, and assets like Treasury bonds, gold, defensive stocks (utilities, healthcare), and plain cash have historically held up better in it.\n\nTROUGH: this is the point of maximum pessimism — boarded-up storefronts, gloomy headlines, nobody wanting to be the one to buy. But historically, this is also where the strongest rebounds have started, precisely because prices have already fallen so far that even modest good news looks meaningful. S&P 500 average return in the first year after a bottom has historically been around +38-50%.\n\nHistorically favored in this phase: beaten-down quality stocks, high-yield bonds, and real estate at distressed prices.",
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
    id: 11, track: "economy", icon: "📊", color: "#b45309",
    title: { en: "Reading Economic Indicators", es: "Leyendo Indicadores Económicos", ko: "경제 지표 읽기", zh: "解读经济指标", ja: "経済指標を読む" },
    subtitle: { en: "The dashboard of the economic machine", es: "El tablero de la máquina económica", ko: "경제 기계의 대시보드", zh: "经济机器的仪表板", ja: "経済マシンのダッシュボード" },
    sections: [
      {
        heading: { en: "Key Indicators", es: "Indicadores Clave", ko: "핵심 지표", zh: "关键指标", ja: "主要指標" },
        body: {
          en: "Just like a doctor doesn't diagnose you from a single vital sign, economists watch a handful of indicators together to read the health of the whole economy. Think of these as dashboard gauges:\n\nGDP is the speedometer — the total value of everything the economy produced. Rising = expansion. A common rule of thumb calls two straight quarters of decline a recession — but in the US, recessions are officially dated by the NBER using broader criteria (employment, income, spending), not GDP alone.\n\nCPI (Consumer Price Index) is the fuel-price gauge — it tracks how fast the prices of everyday goods, like groceries and rent, are rising. The Fed targets roughly 2% inflation as healthy.\n\nPMI (Purchasing Managers' Index) is like an early-warning light — it surveys factory and service managers about their own orders and hiring plans before those show up in GDP. Above 50 = expansion expected. Below 50 = contraction expected. It's a LEADING indicator, meaning it tends to move before the broader economy does.\n\nVIX, nicknamed the 'Fear Gauge,' measures how much turbulence investors expect in the stock market over the next month. Below 15 = calm seas. Above 40 = extreme panic. Some contrarian investors specifically look to buy when the VIX spikes, on the theory that panic is often overdone.\n\nCredit Spreads are the difference between what a riskier company has to pay to borrow versus what the (safer) government pays. Narrow = lenders feel confident. Wide = lenders are demanding extra pay for extra fear.",
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
    id: 12, track: "economy", icon: "🎯", color: "#15803d",
    title: { en: "Three Rules of Thumb", es: "Tres Reglas de Oro", ko: "세 가지 경험 법칙", zh: "三条经验法则", ja: "3つの経験則" },
    subtitle: { en: "A classic summary — simple but powerful", es: "Un resumen clásico — simple pero poderoso", ko: "고전적인 요약 — 간단하지만 강력합니다", zh: "经典总结——简单但强大", ja: "古典的な要約 — シンプルだが強力" },
    sections: [
      {
        heading: { en: "The Three Rules", es: "Las Tres Reglas", ko: "세 가지 법칙", zh: "三条法则", ja: "3つのルール" },
        body: {
          en: "RULE 1: Don't let debt rise faster than income. Remember the family from Lesson 5 whose mortgage payment kept eating a bigger share of their paycheck? That's Rule 1 being broken in slow motion — eventually the debt burden crushes you, whether you're a household or a country.\n\nRULE 2: Don't let income rise faster than productivity. If a factory worker's wage keeps climbing but they're not producing any more per hour than before, the factory eventually can't compete with one elsewhere that pays less for the same output — jobs move, or prices rise until customers walk away.\n\nRULE 3: Do everything you can to raise your own productivity — learn a new skill, adopt a better tool or process, like the farmer's tractor from Lesson 3. In the long run, this is what actually matters most, because it's the only one of the three that isn't just moving numbers around.\n\nThis is simple advice for you AND for policy makers alike. Most people — including most policy makers — don't pay nearly enough attention to it.",
          es: "REGLA 1: No dejes que la deuda crezca más rápido que los ingresos.\nREGLA 2: No dejes que los ingresos crezcan más rápido que la productividad.\nREGLA 3: Haz todo lo posible por aumentar tu productividad.",
          ko: "법칙 1: 부채가 소득보다 빠르게 증가하지 않게 하라.\n법칙 2: 소득이 생산성보다 빠르게 증가하지 않게 하라.\n법칙 3: 생산성을 높이기 위해 할 수 있는 모든 것을 하라.",
          zh: "法则1：不要让债务增长快于收入。\n法则2：不要让收入增长快于生产力。\n法则3：尽一切努力提高生产力。",
          ja: "ルール1：債務が所得より速く増えないようにする。\nルール2：所得が生産性より速く増えないようにする。\nルール3：生産性を上げるためにあらゆることをする。",
        },
      },
      {
        heading: { en: "Putting It All Together", es: "Uniéndolo Todo", ko: "모든 것을 합치기", zh: "总结", ja: "まとめ" },
        body: {
          en: "Now you have the whole template, built lesson by lesson: a slow, steady line of productivity growth (Lesson 3) running underneath everything; a 75-100 year long-term debt cycle (Lesson 5) rising and falling on top of that; and a faster 5-8 year short-term debt cycle (Lesson 4) bouncing on top of both. Layer all three together, and you get a map for understanding where an economy has been, where it is now, and where it's probably headed.\n\nThe economy isn't random noise — it's a machine driven by transactions (Lesson 1), credit (Lesson 2), and human nature repeating the same patterns generation after generation. Once you can see those patterns, whether you're an investor, a small business owner, or just someone trying to make sense of the news, you're equipped to make better decisions than someone reacting to headlines one at a time.",
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
  {
    id: 13, track: "money", icon: "💵", color: "#0891b2",
    title: { en: "Budgeting: Know Where Your Money Goes", es: "Presupuesto: Sabe A Dónde Va Tu Dinero", ko: "예산 관리: 돈이 어디로 가는지 알기", zh: "预算：知道钱花去了哪里", ja: "予算管理：お金の流れを知る" },
    subtitle: { en: "The foundation everything else builds on", es: "La base sobre la que se construye todo lo demás", ko: "다른 모든 것의 토대가 되는 기초", zh: "一切的基础", ja: "他のすべての土台となるもの" },
    sections: [
      {
        heading: { en: "Income vs. Expenses", es: "Ingresos vs. Gastos", ko: "소득 대 지출", zh: "收入与支出", ja: "収入と支出" },
        body: {
          en: "Meet Maria, who just started her first job making $3,000 a month after taxes. A budget is simply her plan for that money: how much comes in (her paycheck) and how much goes out (rent, food, fun, savings).\n\nSome of Maria's expenses are fixed — her $1,200 rent and $50 phone bill show up at basically the same amount every month, whether she likes it or not. Others are variable — what she spends on groceries or going out with friends can swing a lot depending on the month.\n\nA simple starting split many people use: about 50% needs, 30% wants, 20% savings or debt payoff. For Maria's $3,000, that's roughly $1,500 for needs (rent, groceries, utilities), $900 for wants (eating out, hobbies, streaming), and $600 toward savings or paying down debt. That's a rule of thumb, not a rule — Maria's rent alone eats 40% of her pay, so she'll need to adjust the split to fit her real numbers, not force her numbers to fit the split.",
          es: "Un presupuesto es un plan para tu dinero: cuánto entra (ingresos) y cuánto sale (gastos).\n\nLos gastos fijos (alquiler, teléfono) se mantienen similares cada mes. Los variables (comida, ocio) cambian.\n\nUna división simple que muchos usan: 50% necesidades, 30% deseos, 20% ahorro o deudas. Es una guía, no una regla.",
          ko: "예산은 단순히 돈에 대한 계획입니다: 얼마가 들어오고(소득) 얼마가 나가는지(지출).\n\n고정 지출(임대료, 통신비)은 매달 비슷합니다. 가변 지출(식비, 오락)은 달라집니다.\n\n많은 사람이 쓰는 간단한 출발점: 필요 50%, 원함 30%, 저축·부채상환 20%. 이는 경험 법칙일 뿐 절대적인 규칙은 아닙니다.",
          zh: "预算就是给你的钱做一个计划：收入多少，支出多少。\n\n固定支出（房租、话费）每月大致相同。可变支出（食品、娱乐）会变化。\n\n许多人使用的简单起点：需求50%，欲望30%，储蓄或还债20%。这只是经验法则，不是硬性规定。",
          ja: "予算とは、お金の計画のこと：いくら入り（収入）、いくら出るか（支出）。\n\n固定費（家賃、電話代）は毎月ほぼ同じ。変動費（食費、娯楽）は変わります。\n\n多くの人が使う簡単な出発点：必要50%、欲しいもの30%、貯蓄・借金返済20%。これは目安であり絶対的な規則ではありません。",
        },
      },
      {
        heading: { en: "Tracking Before Trimming", es: "Registrar Antes de Recortar", ko: "줄이기 전에 추적하기", zh: "先记录，后削减", ja: "減らす前に記録する" },
        body: {
          en: "Before Maria cuts anything, it helps to simply track where her money already goes for one full month — every coffee, every subscription, no judgment yet, just data.\n\nYou can't manage what you don't measure. When Maria adds it up, she's surprised to find she's signed up for four different streaming services she barely watches — $12, $15, $9, and $18 a month. That's $54 a month, or $648 a year, quietly leaving her account for entertainment she'd mostly forgotten she was paying for.\n\nMost people find one or two categories like this, where spending drifted up without them really noticing — that's usually the easiest place to start trimming, not the hardest.",
          es: "Antes de recortar, ayuda registrar durante un mes a dónde va tu dinero — cada café, cada suscripción.\n\nNo puedes gestionar lo que no mides. Los gastos pequeños recurrentes suman: una suscripción de $12 al mes son $144 al año.",
          ko: "무언가를 줄이기 전에, 한 달 동안 돈이 실제로 어디로 가는지 추적해보는 것이 도움이 됩니다 — 커피 한 잔까지.\n\n측정하지 않으면 관리할 수 없습니다. 작은 반복 비용도 쌓입니다: 월 12달러 구독료는 연 144달러입니다.",
          zh: "在削减任何支出之前，先花一个月记录钱实际花在哪里会很有帮助——每一杯咖啡、每一项订阅。\n\n不衡量就无法管理。小额的重复支出会累积：每月12美元的订阅一年就是144美元。",
          ja: "何かを減らす前に、まず1ヶ月お金の実際の流れを記録すると役立ちます——コーヒー一杯まで。\n\n測らなければ管理できません。小さな定期支出も積み重なります：月12ドルの定期購入は年144ドルになります。",
        },
      },
    ],
    takeaway: {
      en: "A budget isn't about restriction — it's about knowing where your money goes so you can decide, on purpose, where it should go instead.",
      es: "Un presupuesto no es restricción — es saber a dónde va tu dinero para decidir, a propósito, a dónde debería ir.",
      ko: "예산은 제약이 아니라, 돈이 어디로 가는지 알아서 어디로 가야 할지 스스로 정하는 것입니다.",
      zh: "预算不是限制，而是知道钱去了哪里，从而主动决定它该去哪里。",
      ja: "予算は制限ではなく、お金の流れを知り、意図的にどこへ向かわせるか決めること。",
    },
    thinkAbout: {
      en: "Pick one week and write down every purchase, no matter how small. Most people are surprised by at least one category. What do you think yours will be?",
      es: "Elige una semana y anota cada compra, sin importar cuán pequeña. La mayoría se sorprende de al menos una categoría.",
      ko: "일주일을 정해 아무리 작아도 모든 구매를 적어보세요. 대부분 적어도 한 항목에서 놀랍니다. 당신은 어떤 항목일 것 같나요?",
      zh: "选一周记录每一笔消费，无论多小。大多数人至少会对一个类别感到惊讶。你觉得会是哪一类？",
      ja: "1週間を選び、どんなに小さくても全ての購入を記録してみましょう。多くの人が少なくとも一つのカテゴリーに驚きます。あなたはどれだと思いますか？",
    },
  },
  {
    id: 14, track: "money", icon: "🐷", color: "#ca8a04",
    title: { en: "Emergency Funds: Your Financial Shock Absorber", es: "Fondo de Emergencia: Tu Amortiguador Financiero", ko: "비상금: 재정적 충격 완화 장치", zh: "应急基金：你的财务缓冲垫", ja: "緊急資金：あなたの経済的ショック吸収装置" },
    subtitle: { en: "Why 'save some money' isn't specific enough", es: "Por qué 'ahorra algo de dinero' no es suficientemente específico", ko: "'돈을 좀 모아라'가 왜 충분히 구체적이지 않은가", zh: "为什么“存点钱”这个建议还不够具体", ja: "「お金を貯めよう」だけでは不十分な理由" },
    sections: [
      {
        heading: { en: "What Counts as an Emergency", es: "Qué Cuenta Como Emergencia", ko: "무엇이 비상상황인가", zh: "什么才算紧急情况", ja: "何が「緊急」にあたるか" },
        body: {
          en: "Imagine James's car breaks down on the way to work — a $600 repair he didn't see coming. Without savings set aside, that $600 goes straight onto a credit card, often at a high interest rate, turning one bad week into months of extra payments. An emergency fund is money set aside specifically for moments like this — a job loss, a medical bill, a car repair you can't skip. Not a sale, not a vacation.\n\nA common guideline is 3-6 months of essential expenses, though people with less predictable income (freelancers, commission-based jobs) sometimes aim higher.\n\nBuilding it doesn't have to happen all at once. If James starts by setting aside just $50 a week, he'd have covered that $600 repair within three months — and even a small starter fund, some suggest $500-1,000 to begin, already covers many common surprises like his.",
          es: "Un fondo de emergencia es dinero reservado solo para sorpresas genuinas — perder el empleo, una factura médica, una reparación del auto. No una oferta, no unas vacaciones.\n\nUna guía común: 3-6 meses de gastos esenciales. No tiene que lograrse de golpe — incluso $500-1,000 iniciales ya cubren muchas sorpresas comunes.",
          ko: "비상금은 오직 진짜 예상치 못한 일을 위한 돈입니다 — 실직, 병원비, 차 수리비. 세일이나 휴가가 아닙니다.\n\n흔한 기준은 필수 생활비의 3-6개월치입니다. 한 번에 다 모을 필요는 없습니다 — 500-1,000달러 정도의 시작 기금만으로도 흔한 위기 상당수를 감당할 수 있습니다.",
          zh: "应急基金是专为真正的意外情况准备的钱——失业、医疗账单、绕不开的汽车维修。不是促销，也不是旅行。\n\n常见标准是3-6个月的基本生活费。不必一次性存够——即使从500-1000美元的启动基金开始，也能应对许多常见意外。",
          ja: "緊急資金は本当に予期しない事態のためだけに取っておくお金です——失業、医療費、避けられない車の修理。セールや旅行のためではありません。\n\nよくある目安は生活必需費の3〜6ヶ月分。一度に貯める必要はなく、500〜1,000ドル程度の最初の基金でも多くの一般的な不意の出費に対応できます。",
        },
      },
      {
        heading: { en: "Where to Keep It", es: "Dónde Guardarlo", ko: "어디에 보관할까", zh: "放在哪里", ja: "どこに置くべきか" },
        body: {
          en: "The goal for emergency savings is safety and access, not growth. If James had put his emergency money into stocks instead, and the market happened to be down 15% the week his car broke down, he'd be forced to sell at a loss just to cover the repair. That's why the goal is a savings account he can reach within a day or two — not something tied up long-term (like a retirement account) or something that swings in value day to day (like stocks).\n\nThis is a different job than investing. An emergency fund's job is to be there when everything else in your life is not going according to plan, not to grow as fast as possible.",
          es: "El objetivo del fondo de emergencia es seguridad y acceso, no crecimiento. Suele ser una cuenta de ahorros accesible en un día o dos — no algo bloqueado (como una cuenta de jubilación) ni algo que fluctúa (como acciones).\n\nEs un trabajo distinto al de invertir: estar disponible cuando todo lo demás no va según el plan.",
          ko: "비상금의 목표는 성장이 아니라 안전과 접근성입니다. 보통 하루 이틀 안에 찾을 수 있는 저축 계좌를 의미합니다 — 은퇴 계좌처럼 묶여있거나 주식처럼 매일 값이 변하는 것이 아닙니다.\n\n이는 투자와는 다른 역할입니다. 비상금의 역할은 삶의 다른 모든 것이 계획대로 되지 않을 때 그 자리에 있는 것입니다.",
          zh: "应急储蓄的目标是安全和可取用性，而不是增值。通常意味着一两天内就能取出的储蓄账户——不是像退休账户那样被锁住，也不是像股票那样天天波动。\n\n这和投资是不同的任务：应急基金的任务是在生活中其他一切都不顺时依然在那里。",
          ja: "緊急資金の目的は成長ではなく、安全性とすぐに使えることです。通常は1〜2日で引き出せる普通預金口座を指します——退職口座のように固定されたものや、株式のように日々値動きするものではありません。\n\nこれは投資とは別の役割です。緊急資金の役割は、人生の他のことが計画通りに進まないときにそこにあることです。",
        },
      },
    ],
    takeaway: {
      en: "An emergency fund's whole purpose is to turn a crisis into an inconvenience.",
      es: "El propósito del fondo de emergencia es convertir una crisis en una molestia.",
      ko: "비상금의 존재 이유는 위기를 단순한 불편함으로 바꾸는 것입니다.",
      zh: "应急基金存在的全部意义，就是把危机变成不便。",
      ja: "緊急資金の目的は、危機を単なる不便に変えること。",
    },
    thinkAbout: {
      en: "If your income stopped tomorrow, how many months could you cover your essential expenses with what you have saved right now?",
      es: "Si tu ingreso se detuviera mañana, ¿cuántos meses podrías cubrir tus gastos esenciales con lo que tienes ahorrado?",
      ko: "내일 소득이 끊긴다면, 지금 저축으로 필수 생활비를 몇 달이나 감당할 수 있나요?",
      zh: "如果明天你的收入停止，用现在的存款你能覆盖几个月的基本生活费？",
      ja: "もし明日から収入が止まったら、今の貯蓄で必需費を何ヶ月カバーできますか？",
    },
  },
  {
    id: 15, track: "money", icon: "🌱", color: "#16a34a",
    title: { en: "Compound Interest: Money That Makes Money", es: "Interés Compuesto: Dinero Que Genera Dinero", ko: "복리: 돈이 돈을 버는 원리", zh: "复利：让钱生钱", ja: "複利：お金がお金を生む仕組み" },
    subtitle: { en: "Why starting early matters more than starting big", es: "Por qué empezar temprano importa más que empezar en grande", ko: "크게 시작하는 것보다 일찍 시작하는 것이 왜 더 중요한가", zh: "为什么早开始比多投入更重要", ja: "早く始めることが、大きく始めることより重要な理由" },
    sections: [
      {
        heading: { en: "Interest on Interest", es: "Interés Sobre Interés", ko: "이자에 붙는 이자", zh: "利息生利息", ja: "利息に付く利息" },
        body: {
          en: "Imagine you put $1,000 into an account earning 6% a year. With simple interest, you'd earn $60 every single year, forever, always calculated on that original $1,000. With compound interest, year one still earns $60 — but now your balance is $1,060, so year two's 6% is calculated on $1,060, earning $63.60. Year three is calculated on $1,123.60. The growth itself starts growing.\n\nIt looks small at first, but a rough shortcut called the Rule of 72 shows why it matters: divide 72 by an annual growth rate to estimate how many years it takes money to double. At 6% a year, that's about 12 years; at 9%, about 8 years. So that same $1,000 becomes roughly $2,000 in about 12 years, $4,000 in 24, and $8,000 in 36 — without adding another dollar. This is an approximation, not a precise formula, but it captures the idea well.",
          es: "El interés simple se gana solo sobre el monto original. El interés compuesto se gana sobre el monto original MÁS todo el interés ya generado — el crecimiento mismo empieza a crecer.\n\nUn atajo llamado Regla del 72: divide 72 entre la tasa anual para estimar en cuántos años se duplica el dinero. Al 6% son unos 12 años; al 9%, unos 8. Es una aproximación, no una fórmula exacta.",
          ko: "단리는 원금에만 이자가 붙습니다. 복리는 원금뿐 아니라 이미 붙은 이자에도 이자가 붙습니다 — 성장 자체가 성장하기 시작하는 것입니다.\n\n72의 법칙이라는 간단한 방법: 72를 연간 성장률로 나누면 돈이 두 배가 되는 데 걸리는 대략적인 연수를 알 수 있습니다. 연 6%면 약 12년, 9%면 약 8년입니다. 이는 근사치이며 정확한 공식은 아닙니다.",
          zh: "单利只按本金计算利息。复利则是本金加上已经产生的所有利息一起计息——增长本身开始增长。\n\n一个简单的估算方法叫72法则：用72除以年增长率，可估算钱翻倍所需的大致年数。年化6%大约需要12年，9%大约8年。这只是近似估算，不是精确公式。",
          ja: "単利は元本にのみ利息がつきます。複利は元本に加え、すでに得た利息にも利息がつきます——成長そのものが成長し始めるのです。\n\n72の法則という簡単な目安があります：72を年間成長率で割ると、お金が2倍になるおおよその年数がわかります。年6%なら約12年、9%なら約8年。これは近似であり厳密な式ではありません。",
        },
      },
      {
        heading: { en: "Time Beats Timing", es: "El Tiempo Vence a la Sincronización", ko: "시간이 타이밍을 이긴다", zh: "时间胜过时机", ja: "タイミングより時間" },
        body: {
          en: "Because compounding builds on itself, TIME matters enormously — often more than the amount you start with.\n\nSay Priya starts saving $200 a month at age 25, while her friend Tom waits until 35 and saves $400 a month — twice as much, every month, for the rest of their working lives. Even though Tom is putting in more money each month, Priya's extra decade of compounding often lets her end up ahead by retirement, purely because compounding had more years to work on her side.\n\nThe same math works against you with debt: interest you don't pay off compounds too, which is why carrying a credit card balance at a high interest rate for years can end up costing far more in interest than whatever you originally charged to the card.",
          es: "Porque el interés compuesto se construye sobre sí mismo, el TIEMPO importa enormemente — a menudo más que el monto inicial.\n\nAlguien que ahorra poco desde sus 20 años puede terminar con más que alguien que ahorra el doble pero empieza una década después, solo porque el interés compuesto tuvo más años para trabajar.\n\nLa misma matemática funciona en tu contra con las deudas: el interés que no pagas también se compone.",
          ko: "복리는 스스로 위에 쌓이기 때문에 시간이 엄청나게 중요합니다 — 종종 시작 금액보다 더 중요합니다.\n\n20대에 적은 금액을 저축하기 시작한 사람이, 10년 늦게 두 배를 저축한 사람보다 더 많은 돈을 갖게 될 수 있습니다 — 단지 복리가 작동할 시간이 더 많았기 때문입니다.\n\n같은 수학이 부채에서는 당신에게 불리하게 작동합니다: 갚지 않은 이자에도 이자가 붙습니다.",
          zh: "因为复利是建立在自身之上的，所以时间非常重要——往往比起始金额更重要。\n\n从20多岁就开始存少量钱的人，最终可能比十年后才开始存两倍金额的人拥有更多财富——仅仅因为复利有更多年份来发挥作用。\n\n同样的数学在债务上对你不利：没还清的利息也会产生复利，这就是为什么背负高息债务多年可能远超原始借款金额。",
          ja: "複利は自らの上に積み重なるため、時間が非常に重要です——多くの場合、始める金額よりも重要です。\n\n20代からわずかな額を貯め始めた人は、10年後に2倍の額を貯め始めた人より最終的に多くを持つことがあります——単に複利が働く年数が長かったからです。\n\n同じ数学が借金では不利に働きます：払っていない利息にも利息がつくため、高金利の借金を何年も抱えると元の借入額をはるかに超えるコストになります。",
        },
      },
    ],
    takeaway: {
      en: "Compounding rewards time above almost everything else — which makes today the earliest day you'll ever be able to start.",
      es: "El interés compuesto premia el tiempo por encima de casi todo — lo que hace que hoy sea el día más temprano que tendrás para empezar.",
      ko: "복리는 거의 모든 것보다 시간을 우선시합니다 — 그래서 오늘이 당신이 시작할 수 있는 가장 빠른 날입니다.",
      zh: "复利几乎重视时间胜过一切——这意味着今天就是你能开始的最早的一天。",
      ja: "複利はほぼ何よりも時間を重視します——だから今日が、あなたが始められる最も早い日なのです。",
    },
    thinkAbout: {
      en: "Using the Rule of 72, roughly how many years would it take money to double at a 4% annual rate? At 12%?",
      es: "Usando la Regla del 72, ¿aproximadamente cuántos años tardaría el dinero en duplicarse a una tasa anual del 4%? ¿Y al 12%?",
      ko: "72의 법칙을 사용하면, 연 4% 성장률에서 돈이 두 배가 되는 데 대략 몇 년이 걸릴까요? 12%에서는?",
      zh: "用72法则估算，年增长率为4%时钱翻倍大约需要多少年？12%时呢？",
      ja: "72の法則を使うと、年4%の成長率でお金が2倍になるのにおおよそ何年かかりますか？12%では？",
    },
  },
  {
    id: 16, track: "money", icon: "🪪", color: "#ea580c",
    title: { en: "Credit Scores: Your Financial Reputation", es: "Puntaje de Crédito: Tu Reputación Financiera", ko: "신용점수: 당신의 금융 신용도", zh: "信用分数：你的财务信誉", ja: "クレジットスコア：あなたの金融上の信用" },
    subtitle: { en: "A number that follows you into almost every big purchase", es: "Un número que te acompaña en casi cada compra grande", ko: "거의 모든 큰 구매를 따라다니는 숫자", zh: "几乎跟随你每一次大额购买的数字", ja: "ほぼすべての大きな買い物についてくる数字" },
    sections: [
      {
        heading: { en: "What Goes Into a Score", es: "Qué Compone el Puntaje", ko: "점수를 구성하는 요소", zh: "分数由什么构成", ja: "スコアを構成する要素" },
        body: {
          en: "Imagine two people, both with a $5,000 credit limit. Elena pays her balance in full every month and never carries more than $500 at a time — 10% of her available credit. David regularly carries a $4,000 balance — 80% of his limit — and has missed a couple of payments over the years. Even if both make the same income, Elena's credit score will typically be significantly higher, because a credit score is a number — in the US, commonly 300-850 — that summarizes how reliably you've repaid debt in the past, used by lenders to judge risk.\n\nThe biggest factors are usually payment history (do you pay on time, like Elena?) and credit utilization (how much of your available credit you're using, like David's 80%). Length of credit history, types of credit, and recent applications matter too, but less.\n\nLesson 3 talked about good debt vs. bad debt for the economy; a credit score is asking a similar question about you personally: can you handle what you've borrowed?",
          es: "El puntaje de crédito es un número — en EE.UU. suele ir de 300 a 850 — que resume qué tan confiablemente has pagado tus deudas, usado por prestamistas para evaluar el riesgo.\n\nLos factores más grandes suelen ser el historial de pagos y el uso del crédito disponible. La duración del historial, los tipos de crédito y las solicitudes recientes también importan, pero menos.",
          ko: "신용점수는 숫자입니다 — 미국에서는 보통 300-850점 — 과거에 부채를 얼마나 신뢰성 있게 상환했는지를 요약하며, 대출기관이 위험을 평가하는 데 사용합니다.\n\n가장 큰 요소는 보통 상환 이력(제때 갚는가)과 신용 이용률(사용 가능한 신용 중 얼마를 쓰고 있는가)입니다. 신용 기록 기간, 신용 종류, 최근 신청도 영향을 주지만 비중은 적습니다.",
          zh: "信用分数是一个数字——在美国通常是300到850——它概括了你过去偿还债务的可靠程度，被贷方用来评估风险。\n\n最重要的因素通常是还款记录（是否按时还款）和信用使用率（正在使用的信用额度占比）。信用历史长度、信用类型和近期申请也有影响，但影响较小。",
          ja: "クレジットスコアとは数字です——米国では通常300〜850——過去にどれだけ確実に借金を返済してきたかを示し、貸し手がリスクを判断するために使います。\n\n最も大きな要素は通常、支払い履歴（期限内に払っているか）と信用利用率（利用可能な信用のうちどれだけ使っているか）です。信用履歴の長さ、信用の種類、最近の申請も影響しますが、比重は小さめです。",
        },
      },
      {
        heading: { en: "Why It Follows You", es: "Por Qué Te Acompaña", ko: "왜 당신을 따라다니는가", zh: "为什么它会跟着你", ja: "なぜついてくるのか" },
        body: {
          en: "When Elena and David each apply for a $20,000 car loan, the bank might offer Elena 6% interest and David 14% for the exact same car — over a 5-year loan, that gap alone can add up to well over $2,000 in extra interest for David. A credit score can also affect whether an apartment will rent to you, and — depending on where you live — sometimes even job applications or insurance rates.\n\nBuilding a score like Elena's is mostly unglamorous: pay on time, every time; keep balances low relative to your limits; and let accounts age instead of closing them the moment they're paid off. There's no shortcut that replaces consistency over time.",
          es: "El puntaje de crédito puede afectar la tasa de interés en un préstamo para auto o hipoteca, si un apartamento te alquilará, y a veces incluso solicitudes de empleo o tarifas de seguro.\n\nConstruirlo es poco glamuroso: paga a tiempo siempre; mantén saldos bajos; deja que las cuentas envejezcan en vez de cerrarlas.",
          ko: "신용점수는 자동차 대출이나 모기지의 이자율, 아파트 임대 여부, 그리고 지역에 따라 취업이나 보험료에까지 영향을 줄 수 있습니다.\n\n점수를 쌓는 것은 대체로 화려하지 않습니다: 항상 제때 갚고, 한도 대비 잔액을 낮게 유지하며, 계정을 다 갚았다고 바로 닫지 말고 오래 유지하세요. 시간에 걸친 일관성을 대체할 지름길은 없습니다.",
          zh: "信用分数会影响车贷或房贷的利率、房东是否愿意把公寓租给你，在某些地区甚至会影响求职或保险费率。\n\n提升信用分数并不炫酷：始终按时还款；让余额保持在额度较低的比例；账户还完也别急着关闭，让它继续留存。没有捷径能替代长期的一致性。",
          ja: "クレジットスコアは自動車ローンや住宅ローンの金利、アパートを貸してもらえるかどうか、居住地によっては就職や保険料にまで影響することがあります。\n\nスコアを築くのは地味な作業です：常に期限内に支払う、上限に対して残高を低く保つ、完済してもすぐに口座を閉じずに残す。長年の一貫性に代わる近道はありません。",
        },
      },
    ],
    takeaway: {
      en: "A credit score rewards boring, consistent behavior over years — there's no clever trick that substitutes for paying on time.",
      es: "El puntaje de crédito premia el comportamiento aburrido y constante durante años — no hay truco que sustituya pagar a tiempo.",
      ko: "신용점수는 수년에 걸친 지루하고 일관된 행동에 보상을 줍니다 — 제때 갚는 것을 대신할 요령은 없습니다.",
      zh: "信用分数奖励的是多年如一日的乏味但一贯的行为——没有任何技巧能替代按时还款。",
      ja: "クレジットスコアは何年にもわたる地味で一貫した行動に報酬を与えます——期限内の支払いに代わる巧妙な手はありません。",
    },
    thinkAbout: {
      en: "Of the factors above, which one do you think would be easiest for you to improve first?",
      es: "De los factores anteriores, ¿cuál crees que sería el más fácil de mejorar primero?",
      ko: "위 요소들 중 당신이 가장 먼저 개선하기 쉬운 것은 무엇일까요?",
      zh: "在上述因素中，你觉得哪一个对你来说最容易先改善？",
      ja: "上記の要素の中で、あなたが最初に改善しやすいのはどれだと思いますか？",
    },
  },
  {
    id: 17, track: "money", icon: "🧺", color: "#6d28d9",
    title: { en: "Stocks, Bonds & Diversification", es: "Acciones, Bonos y Diversificación", ko: "주식, 채권, 그리고 분산투자", zh: "股票、债券与分散投资", ja: "株式・債券・分散投資" },
    subtitle: { en: "The building blocks of a portfolio, in plain language", es: "Los bloques básicos de una cartera, en lenguaje sencillo", ko: "쉬운 말로 풀어본 포트폴리오의 기본 구성 요소", zh: "用简单的话讲清楚投资组合的基本构件", ja: "ポートフォリオの基本要素を、わかりやすく" },
    sections: [
      {
        heading: { en: "Two Basic Building Blocks", es: "Dos Bloques Básicos", ko: "두 가지 기본 구성 요소", zh: "两个基本构件", ja: "2つの基本要素" },
        body: {
          en: "Imagine your favorite local coffee shop decides to expand into a national chain and sells small ownership slices to raise money — that's a stock. If you buy one, you now own a tiny sliver of that company. If the chain grows and becomes more valuable, your slice has historically tended to become more valuable too, though it can also lose value, including sharply, if the company struggles.\n\nA bond is closer to a loan: instead of buying a slice of the coffee chain, you lend it money directly, and it promises to pay you back with interest by a set date — like an IOU with predictable terms. Bonds have historically been less volatile than stocks, but they generally offer lower long-run average returns.\n\nNeither is inherently 'better' — a stock and a bond behave differently in the same conditions, which is exactly why people combine them.",
          es: "Una acción es una pequeña porción de propiedad de una empresa — si la empresa crece en valor, la acción históricamente ha tendido a valer más también, aunque también puede perder valor, incluso de forma brusca.\n\nUn bono se parece más a un préstamo: prestas dinero a una empresa o gobierno, que promete devolverlo con interés en una fecha fijada. Los bonos han sido históricamente menos volátiles que las acciones, pero suelen ofrecer retornos promedio más bajos a largo plazo.",
          ko: "주식은 회사의 작은 소유권 조각입니다 — 회사 가치가 오르면 주식도 역사적으로 함께 오르는 경향이 있었지만, 급격히 가치를 잃을 수도 있습니다.\n\n채권은 대출에 더 가깝습니다: 회사나 정부에 돈을 빌려주고, 정해진 날짜에 이자와 함께 갚겠다는 약속을 받습니다. 채권은 역사적으로 주식보다 변동성이 낮았지만, 장기 평균 수익률은 대체로 더 낮습니다.",
          zh: "股票是公司所有权的一小部分——如果公司价值增长，股票历史上也往往随之增值，但也可能大幅贬值。\n\n债券更接近于借款：你把钱借给公司或政府，对方承诺在约定日期按约定利息还款。债券历史上的波动性比股票低，但长期平均回报通常也较低。",
          ja: "株式は会社の小さな所有権の一部です——会社の価値が上がれば、株式も歴史的にはそれに伴って価値が上がる傾向がありましたが、大きく値を下げることもあります。\n\n債券はむしろ融資に近いものです：企業や政府にお金を貸し、決められた期日に利息付きで返してもらう約束をします。債券は歴史的に株式より変動が小さい一方、長期的な平均リターンは概して低めです。",
        },
      },
      {
        heading: { en: "Why Diversification Exists", es: "Por Qué Existe la Diversificación", ko: "분산투자가 존재하는 이유", zh: "分散投资存在的原因", ja: "分散投資が存在する理由" },
        body: {
          en: "Imagine putting your entire life savings into that one coffee chain's stock. If a competitor opens next door and steals half its customers, your entire savings takes the hit at once. Diversification means not putting all your money into one company, sector, or asset type — if one holding falls sharply, the rest can cushion the impact.\n\nLesson 10 showed how different asset classes have historically performed differently across cycle phases — that pattern is part of why spreading investments across many holdings, rather than concentrating in a few (like that one coffee chain), has been a long-standing approach to managing risk.\n\nA fund that holds hundreds or thousands of companies at once — instead of just the one coffee chain — is one common way people diversify without picking individual stocks themselves.",
          es: "Diversificar significa no poner todo el dinero en una empresa, sector o tipo de activo. Si una inversión cae bruscamente, el resto puede amortiguar el impacto.\n\nLa lección 10 mostró cómo distintas clases de activos se han comportado diferente según la fase del ciclo — ese patrón es parte de por qué repartir inversiones en muchas posiciones, en vez de concentrarse en pocas, ha sido un enfoque duradero para gestionar el riesgo.",
          ko: "분산투자는 모든 돈을 하나의 회사, 산업, 자산 유형에 넣지 않는 것을 의미합니다. 하나가 크게 떨어져도 나머지가 충격을 완화할 수 있습니다.\n\n10강에서 서로 다른 자산군이 순환의 각 국면마다 역사적으로 다르게 움직였음을 보았습니다 — 그 패턴이 몇 개에 집중하기보다 많은 자산에 나누어 투자하는 것이 오랫동안 위험 관리 방법으로 쓰여온 이유 중 하나입니다.",
          zh: "分散投资意味着不把所有钱都投入一家公司、一个行业或一种资产类型。如果其中一项大幅下跌，其余部分可以缓冲冲击。\n\n第10课展示了不同资产类别在周期各阶段历史上表现不同——这一规律正是为何把投资分散到多个持仓，而不是集中在少数几个上，长期以来被用作管理风险的方法。",
          ja: "分散投資とは、すべてのお金を一つの会社、業種、資産タイプに入れないことを意味します。一つが大きく下落しても、他が影響を和らげてくれます。\n\n第10課では、異なる資産クラスがサイクルの局面ごとに歴史的に異なる動きをしてきたことを見ました——このパターンこそ、少数に集中するより多くの資産に分散する方が、長年リスク管理の手法とされてきた理由の一部です。",
        },
      },
    ],
    takeaway: {
      en: "Stocks and bonds tend to respond differently to the same economic conditions — which is the whole point of holding both, not a coincidence.",
      es: "Las acciones y los bonos tienden a responder distinto a las mismas condiciones económicas — ese es el punto de tener ambos, no una coincidencia.",
      ko: "주식과 채권은 같은 경제 상황에도 다르게 반응하는 경향이 있습니다 — 둘 다 보유하는 이유이며, 우연이 아닙니다.",
      zh: "股票和债券在相同经济环境下往往反应不同——这正是同时持有两者的意义所在，而非巧合。",
      ja: "株式と債券は同じ経済状況にも異なる反応をする傾向があります——それが両方を持つ意味であり、偶然ではありません。",
    },
    thinkAbout: {
      en: "Think back to lesson 10's four cycle phases. Why might holding both stocks and bonds smooth out the ride compared to holding just one?",
      es: "Piensa en las cuatro fases del ciclo de la lección 10. ¿Por qué tener acciones y bonos juntos podría suavizar el camino comparado con tener solo uno?",
      ko: "10강의 네 가지 순환 국면을 떠올려보세요. 주식과 채권을 함께 보유하면 하나만 보유할 때보다 왜 더 안정적일 수 있을까요?",
      zh: "回想第10课的四个周期阶段。为什么同时持有股票和债券，比只持有一种，可能让过程更平稳？",
      ja: "第10課の4つのサイクル局面を思い出してください。株式と債券の両方を持つことが、一方だけを持つより値動きを穏やかにするのはなぜでしょうか？",
    },
  },
  {
    id: 18, track: "money", icon: "🏖️", color: "#0d9488",
    title: { en: "Retirement Accounts: 401(k) and IRA Basics", es: "Cuentas de Jubilación: Fundamentos del 401(k) y el IRA", ko: "은퇴 계좌: 401(k)와 IRA 기초", zh: "退休账户：401(k)与IRA基础", ja: "退職口座：401(k)とIRAの基本" },
    subtitle: { en: "Ordinary accounts with an unusual perk: the tax rules", es: "Cuentas comunes con una ventaja poco común: las reglas fiscales", ko: "특별한 혜택이 있는 평범한 계좌: 세금 규칙", zh: "普通账户里藏着不普通的福利：税收规则", ja: "普通の口座に隠された特典：税制優遇" },
    sections: [
      {
        heading: { en: "Why These Accounts Exist", es: "Por Qué Existen Estas Cuentas", ko: "이 계좌들이 존재하는 이유", zh: "这些账户为何存在", ja: "これらの口座が存在する理由" },
        body: {
          en: "Picture two coworkers who each set aside $200 a month for 30 years and earn the same return on it. One puts the money in an ordinary brokerage account; the other puts it in a workplace 401(k). Every year, the brokerage saver owes tax on the dividends and gains their investments produce, even though they never touched the money. The 401(k) saver owes nothing on that same growth until they actually withdraw it decades later — letting the full amount, tax included, keep compounding in the meantime (see Lesson 15 on why compounding rewards time above almost everything else).\n\nA 401(k) is a retirement account offered through an employer; an IRA (Individual Retirement Account) is the equivalent that anyone can open on their own through a bank or brokerage, employer or not. Both exist for the same reason: the government designed them to encourage long-term saving by changing the tax treatment, not by changing what you're allowed to invest in — a 401(k) or IRA can hold many of the same stocks, bonds, or funds an ordinary brokerage account can.\n\nMany employers that offer a 401(k) also add a 'match' — contributing some additional money of their own whenever an employee contributes, up to a set limit. That match is usually subject to a vesting schedule (you may need to stay employed a certain number of years before it's fully yours), a detail worth checking rather than assuming.",
          es: "Un 401(k) es una cuenta de jubilación ofrecida por un empleador; un IRA es su equivalente que cualquiera puede abrir por su cuenta.\n\nAmbos retrasan o eliminan el impuesto sobre las ganancias de inversión hasta que retiras el dinero, a diferencia de una cuenta de corretaje ordinaria que se grava cada año.\n\nMuchos empleadores añaden un 'match' — dinero adicional cuando contribuyes — a menudo sujeto a un período de adquisición de derechos.",
          ko: "401(k)는 고용주가 제공하는 은퇴 계좌이고, IRA는 누구나 직접 개설할 수 있는 동등한 계좌입니다.\n\n둘 다 일반 증권 계좌와 달리 인출할 때까지 투자 수익에 대한 세금을 늦추거나 없애줍니다.\n\n많은 고용주가 기여할 때마다 추가 자금을 매칭해주며, 이는 보통 일정 근속 기간이 필요한 베스팅 조건이 붙습니다.",
          zh: "401(k)是雇主提供的退休账户；IRA是任何人都可以自行开设的对等账户。\n\n两者都会推迟或免除投资收益的税，直到你真正取款为止，这与每年都要缴税的普通券商账户不同。\n\n许多雇主还会提供\"匹配\"——你每缴纳一笔，雇主额外追加一笔资金——通常附带归属期限制。",
          ja: "401(k)は雇用主が提供する退職口座で、IRAは誰でも自分で開設できる同等の口座です。\n\nどちらも、毎年課税される通常の証券口座と違い、実際に引き出すまで投資収益への課税を遅らせるか免除します。\n\n多くの雇用主は拠出額に応じて追加拠出する「マッチング」を提供しますが、通常は一定の勤続年数を要するベスティング条件が伴います。",
        },
      },
      {
        heading: { en: "Traditional vs Roth: Pay Tax Now or Later", es: "Traditional vs Roth: Pagar Impuestos Ahora o Después", ko: "Traditional vs Roth: 지금 세금을 내느냐, 나중에 내느냐", zh: "Traditional 与 Roth：现在缴税还是以后缴税", ja: "TraditionalとRoth：税金を今払うか後で払うか" },
        body: {
          en: "Both the 401(k) and the IRA come in two versions that differ in exactly one place: when the tax bill comes due.\n\nA Traditional account is funded with money that hasn't been taxed yet — it lowers the saver's taxable income the year they contribute — but withdrawals in retirement are taxed as ordinary income. A Roth account works in reverse: it's funded with money that's already been taxed, so contributions don't reduce that year's taxable income, but qualified withdrawals in retirement are entirely tax-free, growth included.\n\nNeither version is universally better — it depends on a comparison nobody can make with certainty: is the saver's tax rate today higher or lower than it's likely to be decades from now, in retirement? A worker early in their career, likely earning less now than they will later, is often described as a candidate for Roth; a worker at peak career earnings, likely to have lower income in retirement, is often described as a candidate for Traditional. Both are simplifications of a genuinely individual, forward-looking tax question — not a rule that fits everyone, and not something this lesson can answer for any specific person.",
          es: "Traditional se financia con dinero sin gravar (reduce el impuesto de este año), pero los retiros en la jubilación se gravan como ingreso normal.\n\nRoth se financia con dinero ya gravado, pero los retiros calificados en la jubilación son completamente libres de impuestos.\n\nCuál conviene depende de una comparación que nadie puede saber con certeza: la tasa de impuestos de hoy frente a la de dentro de décadas.",
          ko: "Traditional은 아직 세금을 내지 않은 돈으로 채워져 올해 세금을 줄여주지만, 은퇴 후 인출 시 일반 소득으로 과세됩니다.\n\nRoth는 이미 세금을 낸 돈으로 채워지지만, 은퇴 후 적격 인출은 완전히 비과세입니다.\n\n어느 쪽이 유리한지는 아무도 확실히 알 수 없는 비교, 즉 오늘의 세율과 수십 년 후의 세율에 달려 있습니다.",
          zh: "Traditional账户用尚未缴税的钱存入（能降低当年应税收入），但退休后取款要按普通收入缴税。\n\nRoth账户用已缴税的钱存入，但退休后符合条件的取款完全免税。\n\n哪种更合适取决于一个没人能确定的比较：今天的税率与几十年后的税率。",
          ja: "Traditionalはまだ課税されていないお金で拠出し（その年の課税所得を減らせる）、退職後の引き出しは通常所得として課税されます。\n\nRothはすでに課税済みのお金で拠出しますが、退職後の適格な引き出しは完全に非課税です。\n\nどちらが有利かは、誰にも確実にはわからない比較——今日の税率と数十年後の税率——次第です。",
        },
      },
    ],
    takeaway: {
      en: "The account type doesn't change what you can invest in — it changes when the tax bill comes due. That single difference, compounded over decades, is why these accounts exist at all.",
      es: "El tipo de cuenta no cambia en qué puedes invertir — cambia cuándo llega el impuesto. Esa diferencia, compuesta durante décadas, es la razón de ser de estas cuentas.",
      ko: "계좌 종류는 무엇에 투자할 수 있는지를 바꾸지 않습니다 — 세금이 언제 부과되는지를 바꿀 뿐입니다. 이 한 가지 차이가 수십 년간 복리로 쌓이는 것이 바로 이 계좌들이 존재하는 이유입니다.",
      zh: "账户类型不会改变你能投资什么——它改变的是税什么时候缴。这一个差异，经过几十年复利，正是这些账户存在的原因。",
      ja: "口座の種類は投資できるものを変えません——変わるのは税金がいつ発生するかだけです。この一つの違いが数十年かけて複利で積み重なることこそ、これらの口座が存在する理由です。",
    },
    thinkAbout: {
      en: "Lesson 15 showed that starting early matters more than starting big, because compounding needs time above all else. A tax-advantaged account doesn't add extra return by itself — it just lets more of the growth compound undisturbed. Why might that matter more the earlier someone starts?",
      es: "La lección 15 mostró que empezar temprano importa más que empezar en grande, porque la capitalización necesita tiempo sobre todo. ¿Por qué importaría más cuanto antes empieza alguien?",
      ko: "15강에서는 복리가 무엇보다 시간을 필요로 하기 때문에 크게 시작하는 것보다 일찍 시작하는 것이 더 중요하다는 것을 보여주었습니다. 일찍 시작할수록 이것이 왜 더 중요할까요?",
      zh: "第15课说明了早开始比多投入更重要，因为复利最需要的是时间。为什么开始得越早，这一点就越重要？",
      ja: "第15課では、複利は何よりも時間を必要とするため、大きく始めるより早く始める方が重要だと示しました。早く始めるほど、なぜこれがより重要になるのでしょうか？",
    },
  },
  {
    id: 19, track: "money", icon: "🧾", color: "#57534e",
    title: { en: "Taxes: How Your Paycheck Is Actually Taxed", es: "Impuestos: Cómo Se Grava Realmente Tu Sueldo", ko: "세금: 급여가 실제로 과세되는 방식", zh: "税收：你的薪水究竟是怎么被征税的", ja: "税金：あなたの給料は実際どう課税されるか" },
    subtitle: { en: "Why a raise can never shrink your take-home pay", es: "Por qué un aumento nunca puede reducir tu sueldo neto", ko: "왜 급여 인상이 실수령액을 줄일 수 없는가", zh: "为什么加薪永远不会让到手工资变少", ja: "昇給が手取りを減らすことは絶対にない理由" },
    sections: [
      {
        heading: { en: "Tax Brackets Are Layers, Not a Single Rate", es: "Los Tramos Fiscales Son Capas, No una Tasa Única", ko: "세율 구간은 층이지 단일 세율이 아니다", zh: "税级是分层的，不是单一税率", ja: "税率区分は層であり、単一税率ではない" },
        body: {
          en: "Imagine income tax as a stack of buckets, each with its own rate, and money fills them from the bottom up. The first bucket might tax the first slice of income at a low rate; once that bucket is full, the next slice spills into a bucket taxed at a higher rate — but only that slice, not everything below it.\n\nThis is why a raise can never make your take-home pay go down, even if it pushes you into a new bracket. Say a worker's income grows enough to spill into a higher bucket. Only the new, additional slice of income — the part that overflowed into that higher bucket — gets taxed at the higher rate. Every dollar in the lower buckets keeps being taxed exactly as before.\n\nA common and costly misconception is thinking a raise, or a bonus, can leave you with less money overall by 'pushing you into a higher bracket.' It can't — it can only mean the marginal (extra) dollars are taxed a bit more, never that already-earned income gets taxed retroactively at the new, higher rate.",
          es: "El impuesto sobre la renta funciona como una pila de cubos, cada uno con su propia tasa; el dinero los llena de abajo hacia arriba. Solo la porción que rebosa a un cubo superior se grava a la tasa más alta — no todo el ingreso.\n\nPor eso un aumento nunca puede reducir tu sueldo neto, aunque te empuje a un tramo superior. Es un error común y costoso pensar lo contrario.",
          ko: "소득세는 각기 다른 세율을 가진 양동이가 쌓여 있는 것과 같습니다. 돈은 아래부터 채워집니다. 위 양동이로 넘친 부분만 더 높은 세율로 과세됩니다 — 전체 소득이 아닙니다.\n\n그래서 급여 인상이 더 높은 세율 구간으로 밀어 넣더라도 실수령액이 줄어드는 일은 절대 없습니다. 반대로 생각하는 것은 흔하지만 비용이 큰 오해입니다.",
          zh: "所得税就像一叠水桶，每个水桶税率不同，钱从下往上填满。只有溢出到上层水桶的那部分才按更高税率征税——不是全部收入。\n\n所以加薪即使把你推入更高的税级，也绝不会让到手工资变少。认为相反是常见但代价不小的误解。",
          ja: "所得税は、それぞれ異なる税率を持つバケツが積み重なっているようなものです。お金は下から満たされます。上のバケツにあふれた部分だけがより高い税率で課税されます——収入全体ではありません。\n\nだから昇給でより高い税率区分に押し上げられても、手取りが減ることは絶対にありません。逆だと考えるのはよくある、しかし代償の大きい誤解です。",
        },
      },
      {
        heading: { en: "Gross Pay, Net Pay, and Where the Difference Goes", es: "Sueldo Bruto, Sueldo Neto y A Dónde Va la Diferencia", ko: "총급여, 실수령액, 그리고 그 차이가 어디로 가는가", zh: "税前工资、税后工资，以及差额去了哪里", ja: "総支給額、手取り額、その差はどこへ行くのか" },
        body: {
          en: "Look at any pay stub and two numbers stand out: gross pay (everything earned before anything is taken out) and net pay (what actually lands in the bank account). The gap between them is usually more than just income tax.\n\nIn the US, a paycheck typically also has separate payroll taxes withheld — funding programs like Social Security and Medicare — plus, depending on the state, a state income tax on top of the federal one. All of it is usually withheld automatically by the employer before the money ever reaches the worker, which is why most people never have to hand over a lump sum at tax time — most of it was already collected paycheck by paycheck.\n\nThis connects directly to Lesson 18: a Traditional 401(k) or IRA contribution is subtracted from income before it's taxed, which is exactly why it lowers the taxable income shown on that pay stub in the first place — not a separate mechanism, but this same withholding process working on a smaller number.",
          es: "En un recibo de sueldo destacan dos cifras: sueldo bruto y sueldo neto. La diferencia suele incluir más que solo el impuesto sobre la renta — en EE.UU., también hay impuestos de nómina (Seguro Social, Medicare) y, según el estado, impuesto estatal.\n\nEsto conecta con la Lección 18: una aportación a un 401(k) Traditional se resta del ingreso antes de calcular el impuesto, por eso reduce el ingreso gravable.",
          ko: "급여명세서에는 총급여와 실수령액 두 숫자가 눈에 띕니다. 그 차이는 보통 소득세만이 아닙니다 — 미국에서는 사회보장세, 메디케어 같은 별도의 급여세와, 주에 따라 주소득세도 포함됩니다.\n\n이는 18강과 직접 연결됩니다: Traditional 401(k) 기여금은 과세 전 소득에서 공제되므로 과세 대상 소득이 줄어드는 것입니다.",
          zh: "工资单上有两个数字很显眼：税前工资和税后工资。两者的差额通常不只是所得税——在美国还包括社保、医疗保险等单独的工资税，以及视州而定的州所得税。\n\n这与第18课直接相关：Traditional 401(k)的缴款是在计税前从收入中扣除的，这正是它降低应税收入的原因。",
          ja: "給与明細には総支給額と手取り額という2つの数字が目立ちます。その差は通常、所得税だけではありません——米国では社会保障やメディケアなどの別の給与税、そして州によっては州所得税も含まれます。\n\nこれは第18課と直接つながっています：Traditional 401(k)の拠出は課税前の収入から差し引かれるため、課税対象の所得が下がるのです。",
        },
      },
    ],
    takeaway: {
      en: "Marginal tax brackets tax layers of income, not your whole income at one rate. A raise, a bonus, or extra freelance income can only ever add to your take-home pay, never subtract from it.",
      es: "Los tramos fiscales gravan capas de ingreso, no todo el ingreso a una sola tasa. Un aumento nunca puede restar de tu sueldo neto, solo sumar.",
      ko: "누진세 구간은 소득의 층을 과세하는 것이지, 전체 소득을 하나의 세율로 과세하는 것이 아닙니다. 급여 인상은 실수령액을 늘릴 뿐 절대 줄이지 않습니다.",
      zh: "累进税级只对分层的收入征税，而不是用同一税率对全部收入征税。加薪只会增加你的到手工资，绝不会减少它。",
      ja: "累進課税は所得の層に課税するのであり、所得全体を単一税率で課税するのではありません。昇給は手取りを増やすだけで、決して減らすことはありません。",
    },
    thinkAbout: {
      en: "Now that you understand how marginal brackets work, look back at Lesson 18's Traditional-vs-Roth question. A Traditional contribution reduces taxable income at today's marginal rate. Does that change how you'd think about the 'higher tax rate now vs. later' comparison that lesson described?",
      es: "Ahora que entiendes los tramos marginales, piensa en la pregunta Traditional vs Roth de la Lección 18. Una aportación Traditional reduce el ingreso gravable a la tasa marginal de hoy. ¿Cambia eso tu forma de pensar la comparación?",
      ko: "이제 한계세율 구간의 작동 방식을 이해했으니, 18강의 Traditional vs Roth 질문을 다시 생각해보세요. Traditional 기여금은 오늘의 한계세율로 과세 대상 소득을 줄입니다. 이것이 그 비교를 생각하는 방식을 바꾸나요?",
      zh: "现在你已经理解了边际税级的运作方式，回想一下第18课的Traditional与Roth问题。Traditional缴款是按今天的边际税率减少应税收入的。这是否改变了你对那个比较的看法？",
      ja: "限界税率区分の仕組みを理解した今、第18課のTraditional対Rothの問いを振り返ってみましょう。Traditionalの拠出は今日の限界税率で課税所得を減らします。これはその比較についての考え方を変えますか？",
    },
  },
  {
    id: 20, track: "money", icon: "🛡️", color: "#0369a1",
    title: { en: "Insurance: Trading a Small Certain Cost for Protection from a Large Uncertain One", es: "Seguros: Cambiar un Costo Pequeño y Seguro por Protección Ante uno Grande e Incierto", ko: "보험: 작고 확실한 비용으로 크고 불확실한 손실을 막다", zh: "保险：用小额确定成本换取对大额不确定损失的保护", ja: "保険：小さく確実な費用で、大きく不確実な損失から身を守る" },
    subtitle: { en: "Why paying a little every month can make sense even if you never file a claim", es: "Por qué pagar un poco cada mes puede tener sentido aunque nunca hagas un reclamo", ko: "한 번도 보험금을 청구하지 않아도 매달 조금씩 내는 것이 합리적인 이유", zh: "为什么即使从不理赔，每月支付一点钱也可能是合理的", ja: "一度も保険金を請求しなくても、毎月少し払う意味がある理由" },
    sections: [
      {
        heading: { en: "Insurance Pools Risk Across Many People", es: "El Seguro Agrupa el Riesgo Entre Muchas Personas", ko: "보험은 많은 사람들 사이에 위험을 분산시킨다", zh: "保险将风险分摊到许多人身上", ja: "保険は多くの人にリスクを分散させる" },
        body: {
          en: "Picture a neighborhood of a thousand homes. In any given year, maybe two or three will have a serious fire, but nobody knows in advance which ones. If each homeowner had to cover a fire's full cost alone, a handful of unlucky families would face a devastating loss while everyone else paid nothing.\n\nInsurance changes that math. Every homeowner pays a relatively small amount — the premium — into a shared pool. The insurer uses that pool to pay the full cost for the few homes that do have a fire that year. Nobody knows in advance whether they'll be one of the unlucky few, so everyone trades a small, certain cost (the premium) for protection against a large, uncertain one (rebuilding a house from nothing).\n\nThis is the same underlying idea across every type of insurance — health, auto, home or renters, life — just applied to a different kind of risk: a large group of people facing the same category of unpredictable loss, pooling small contributions so the few who actually experience it aren't left to cover it alone.",
          es: "Imagina un vecindario de mil casas. En un año dado, quizás dos o tres tendrán un incendio grave, pero nadie sabe cuáles de antemano. El seguro agrupa el riesgo: cada propietario paga una prima relativamente pequeña a un fondo compartido, y ese fondo cubre el costo total para las pocas casas que sí tienen un incendio.\n\nNadie sabe de antemano si será de los pocos desafortunados, así que todos cambian un costo pequeño y seguro (la prima) por protección ante uno grande e incierto. Es la misma idea detrás de cualquier tipo de seguro — salud, auto, hogar, vida — aplicada a un tipo distinto de riesgo.",
          ko: "천 채의 집이 있는 동네를 상상해 보세요. 어느 해든 두세 채 정도는 심각한 화재를 겪지만, 누가 그럴지는 아무도 미리 알 수 없습니다. 보험은 이 계산을 바꿉니다: 모든 집주인이 비교적 적은 금액인 보험료를 공동 기금에 냅니다. 그 기금은 그해 실제로 화재를 겪은 소수의 집에 전체 비용을 지급합니다.\n\n누구도 자신이 그 불운한 소수가 될지 미리 알 수 없기 때문에, 모두가 작고 확실한 비용(보험료)을 크고 불확실한 비용(집을 처음부터 다시 짓는 것)에 대한 보호와 맞바꿉니다. 건강, 자동차, 주택, 생명 등 어떤 보험이든 같은 원리가 다른 종류의 위험에 적용될 뿐입니다.",
          zh: "想象一个有一千户人家的社区。在任何一年里，也许只有两三户会遭遇严重火灾，但事先没人知道会是哪几户。保险改变了这个算法：每个房主向共同基金支付相对较小的一笔钱——保费，而这个基金会为当年真正发生火灾的少数房屋支付全部损失。\n\n由于没人能事先知道自己会不会是那不幸的少数，所有人都是在用一笔小额且确定的支出（保费）换取对一笔巨额且不确定的损失（从零开始重建房屋）的保护。健康险、车险、房屋险、寿险背后都是同一个原理，只是应用在不同类型的风险上。",
          ja: "千戸の住宅がある地域を想像してください。ある年、深刻な火災に遭うのはおそらく2、3戸ですが、それがどの家かは誰も事前にわかりません。保険はこの計算を変えます：すべての住宅所有者が比較的少額の保険料を共同の基金に払い込み、その基金がその年実際に火災に遭った少数の住宅に全額を支払います。\n\n自分がその不運な少数になるかどうかは誰にも事前にわからないため、全員が小さく確実な費用（保険料）を、大きく不確実な費用（家をゼロから建て直すこと）への備えと交換しているのです。医療保険、自動車保険、住宅保険、生命保険——どれも同じ原理が異なる種類のリスクに適用されているだけです。",
        },
      },
      {
        heading: { en: "Premiums, Deductibles, and Coverage Limits", es: "Primas, Deducibles y Límites de Cobertura", ko: "보험료, 자기부담금, 보장 한도", zh: "保费、免赔额与保额上限", ja: "保険料、自己負担額、補償上限" },
        body: {
          en: "Three numbers shape almost every insurance policy. The premium is the recurring amount paid to keep the coverage active, whether or not a claim is ever filed. The deductible is the amount the policyholder pays out of pocket before the insurer starts paying anything on a claim. The coverage limit is the maximum the insurer will pay out, even if the actual loss is larger.\n\nThese three interact directly. A policy with a higher deductible generally carries a lower premium, because the policyholder is agreeing to absorb more of the smaller, more common losses themselves — the insurer only steps in once things get more expensive. A policy with a lower deductible generally carries a higher premium, since the insurer is taking on more of the cost from the very first dollar.\n\nThat trade-off — a bit more paid every month versus a bit more paid out of pocket if something goes wrong — depends on an individual's own finances, risk tolerance, and circumstances, not a rule this lesson can hand out. The goal here is understanding how the pieces fit together, not which combination is right for any specific person.",
          es: "Tres cifras dan forma a casi toda póliza. La prima es el pago recurrente para mantener la cobertura activa. El deducible es lo que el asegurado paga de su bolsillo antes de que el asegurador empiece a pagar un reclamo. El límite de cobertura es el máximo que el asegurador pagará.\n\nUn deducible más alto generalmente implica una prima más baja, y viceversa. Ese balance depende de las finanzas y circunstancias de cada persona, no de una regla que esta lección pueda dar.",
          ko: "거의 모든 보험 상품은 세 가지 숫자로 구성됩니다. 보험료는 보장을 유지하기 위해 정기적으로 내는 금액입니다. 자기부담금은 보험사가 보험금을 지급하기 전에 가입자가 먼저 부담하는 금액입니다. 보장 한도는 보험사가 지급하는 최대 금액입니다.\n\n자기부담금이 높을수록 보통 보험료는 낮아지고, 그 반대도 마찬가지입니다. 이 균형은 특정한 규칙이 아니라 개인의 재정 상황과 위험 감수 성향에 따라 달라집니다.",
          zh: "几乎每份保单都由三个数字决定。保费是为维持保障而定期支付的金额。免赔额是保险公司开始理赔前，投保人自己先承担的金额。保额上限是保险公司最多会赔付的金额。\n\n免赔额越高，保费通常越低，反之亦然。这种权衡取决于每个人自身的财务状况和风险承受能力，而不是本课能给出的固定规则。",
          ja: "ほとんどの保険契約は3つの数字で決まります。保険料は補償を維持するために定期的に支払う金額です。自己負担額は、保険会社が保険金を支払う前に契約者が自分で負担する金額です。補償上限は保険会社が支払う最大金額です。\n\n自己負担額が高いほど、通常は保険料が低くなり、その逆もまた同じです。この兼ね合いは、個人の財政状況やリスク許容度によって決まるものであり、この講で答えを出せる規則ではありません。",
        },
      },
    ],
    takeaway: {
      en: "Insurance doesn't eliminate risk — it pools it across many people so that a rare, large loss for one person becomes a small, predictable cost for everyone. Premiums, deductibles, and coverage limits are the three levers that shape that trade-off.",
      es: "El seguro no elimina el riesgo — lo agrupa entre muchas personas para que una pérdida grande y rara se convierta en un costo pequeño y predecible para todos. Prima, deducible y límite de cobertura son las tres palancas de ese balance.",
      ko: "보험은 위험을 없애는 것이 아니라 여러 사람에게 분산시켜, 한 사람에게 드물게 발생하는 큰 손실을 모두에게 작고 예측 가능한 비용으로 바꿉니다. 보험료, 자기부담금, 보장 한도가 이 균형을 결정하는 세 가지 요소입니다.",
      zh: "保险并不能消除风险——它把风险分摊到许多人身上，让一个人身上罕见的巨大损失，变成所有人都可预期的小额成本。保费、免赔额和保额上限是决定这一权衡的三个关键因素。",
      ja: "保険はリスクをなくすものではなく、多くの人に分散させることで、一人に稀に起こる大きな損失を、全員にとって予測可能な小さな費用に変えるものです。保険料、自己負担額、補償上限がこの兼ね合いを形作る3つの要素です。",
    },
    thinkAbout: {
      en: "Lesson 14 covered building an emergency fund for unexpected expenses. Insurance and an emergency fund solve related but different problems — one pools risk across many people for losses too large for most individual budgets, the other is money set aside by one person for smaller, more everyday surprises. Can you think of a loss each one would be better suited to cover?",
      es: "La Lección 14 trató sobre construir un fondo de emergencia. El seguro y un fondo de emergencia resuelven problemas relacionados pero distintos. ¿Puedes pensar en una pérdida que cada uno cubriría mejor?",
      ko: "14강에서는 비상금 마련을 다뤘습니다. 보험과 비상금은 관련이 있지만 서로 다른 문제를 해결합니다. 각각이 더 잘 대응할 수 있는 손실을 생각해볼 수 있나요?",
      zh: "第14课讲过建立应急基金。保险和应急基金解决的是相关但不同的问题。你能想到哪种损失更适合由哪一种来应对吗？",
      ja: "第14課では緊急資金の準備について学びました。保険と緊急資金は関連していますが、異なる問題を解決します。それぞれがより適切に対応できる損失を考えてみてください。",
    },
  },
  {
    id: 21, track: "money", icon: "🛒", color: "#a21caf",
    title: { en: "Inflation and Your Money: Why a Growing Balance Isn't Always Growing Wealth", es: "La Inflación y Tu Dinero: Por Qué un Saldo Creciente No Siempre Es Más Riqueza", ko: "인플레이션과 내 돈: 잔고가 늘어도 부가 늘지 않을 수 있는 이유", zh: "通胀与你的钱：余额增长不一定等于财富增长", ja: "インフレとあなたのお金：残高が増えても富が増えるとは限らない理由" },
    subtitle: { en: "The difference between the number in your account and what it can actually buy", es: "La diferencia entre el número en tu cuenta y lo que realmente puede comprar", ko: "계좌의 숫자와 그것이 실제로 살 수 있는 것의 차이", zh: "账户里的数字和它实际能买到的东西之间的差别", ja: "口座の数字と、それが実際に買えるものとの違い" },
    sections: [
      {
        heading: { en: "Why a Dollar Buys Less Over Time", es: "Por Qué un Dólar Compra Menos Con el Tiempo", ko: "시간이 지나면 돈의 구매력이 줄어드는 이유", zh: "为什么一美元随时间贬值", ja: "なぜ時間とともにお金の価値は下がるのか" },
        body: {
          en: "Ask a grandparent what a movie ticket or a loaf of bread cost when they were young, and the number will sound tiny. That's not because those things got more valuable — it's the flip side of Lesson 4's definition of inflation: when spending and incomes across an economy grow faster than the goods and services actually produced, prices rise. Repeated year after year, that steady rise means the same dollar buys a little less each year than it did before.\n\nThis matters most for money that just sits still. Picture $1,000 in cash kept in a drawer for twenty years, never touched. The number printed on those bills never changes — it's still $1,000. But the groceries, gas, and rent that $1,000 could have covered on day one would cost noticeably more twenty years later, meaning that same stack of bills now covers less of ordinary life than it used to.\n\nThis isn't a flaw unique to cash in a drawer — it's what inflation does to purchasing power generally, whether the money is in a drawer, a low-interest savings account, or anywhere else that doesn't grow fast enough to keep up.",
          es: "Pregúntale a un abuelo cuánto costaba una entrada de cine cuando era joven — sonará minúsculo. No es que esas cosas se volvieran más valiosas; es el reverso de la inflación (Lección 4): cuando el gasto crece más rápido que lo que se produce, los precios suben, año tras año.\n\nEsto importa más para el dinero que no se mueve. $1,000 guardados en un cajón durante veinte años siguen siendo $1,000 en el papel, pero compran menos vida cotidiana que antes.",
          ko: "할아버지, 할머니께 젊었을 때 영화표 가격을 물어보면 아주 작게 들릴 것입니다. 그것들이 더 가치 있어져서가 아니라, 4강에서 배운 인플레이션의 반대편입니다: 지출과 소득이 생산보다 빠르게 늘면 가격이 오릅니다. 이것이 해마다 반복되면 같은 돈으로 살 수 있는 것이 조금씩 줄어듭니다.\n\n이는 가만히 있는 돈에 가장 크게 적용됩니다. 서랍 속 1,000달러는 20년이 지나도 여전히 1,000달러지만, 그때 살 수 있었던 만큼의 생필품을 이제는 살 수 없습니다.",
          zh: "问问祖父母年轻时一张电影票多少钱，那个数字听起来会小得惊人。这不是因为那些东西变得更值钱了，而是第4课通胀定义的另一面：当支出和收入的增长快于实际生产的商品和服务时，价格就会上涨。年复一年，同样的钱能买到的东西就会一点点变少。\n\n这对静止不动的钱影响最大。抽屉里放二十年的1000美元，票面数字始终是1000，但能买到的日常用品却比当初少了。",
          ja: "祖父母に、若い頃の映画のチケット代を聞いてみてください。とても小さな金額に聞こえるはずです。それらの価値が上がったからではなく、第4課で学んだインフレの裏返しです：支出と所得が実際に生産される財やサービスより速く増えると、物価が上がります。これが毎年繰り返されると、同じお金で買えるものが少しずつ減っていきます。\n\nこれは動かないお金に最も大きく影響します。引き出しに20年間しまわれた1,000ドルは紙の上では今も1,000ドルですが、当時買えた日用品の量はもう買えません。",
        },
      },
      {
        heading: { en: "Real Return vs Nominal Return", es: "Rendimiento Real vs Rendimiento Nominal", ko: "실질 수익률 vs 명목 수익률", zh: "实际回报率 vs 名义回报率", ja: "実質リターン vs 名目リターン" },
        body: {
          en: "A savings account that pays interest sounds like it's protecting against this problem — the balance grows every year, after all. But the number on the statement is the nominal return: growth measured in plain dollars, without asking what those dollars can actually buy.\n\nThe real return strips inflation back out: roughly, real return ≈ nominal return − inflation rate. If an account grows by a modest percentage in a year where prices across the economy rose by a similar or larger percentage, the balance is bigger in dollar terms but roughly flat — or even shrinking — in terms of what it can actually purchase. A bigger number on the screen doesn't automatically mean more real wealth.\n\nThis is exactly why Lesson 15's point about compounding matters so much: compounding needs to outpace inflation, not just be positive, for an account's growth to translate into growing purchasing power rather than merely growing numbers.",
          es: "Una cuenta de ahorros con interés parece proteger contra esto — el saldo crece cada año. Pero ese número es el rendimiento nominal: crecimiento en dólares simples, sin preguntar qué pueden comprar esos dólares.\n\nEl rendimiento real resta la inflación: rendimiento real ≈ rendimiento nominal − inflación. Un saldo mayor en dólares no siempre significa más riqueza real.",
          ko: "이자를 주는 저축 계좌는 이 문제를 막아주는 것처럼 보입니다 — 잔고가 매년 늘어나니까요. 하지만 그 숫자는 명목 수익률입니다: 단순히 달러로 측정한 성장일 뿐, 그 달러로 무엇을 살 수 있는지는 묻지 않습니다.\n\n실질 수익률은 인플레이션을 뺀 것입니다: 대략 실질 수익률 ≈ 명목 수익률 − 인플레이션율. 화면 속 더 큰 숫자가 항상 더 많은 실질 부를 의미하지는 않습니다.",
          zh: "有利息的储蓄账户看起来能防止这个问题——毕竟余额每年都在增长。但那个数字是名义回报率：只是用美元衡量的增长，并没有问这些美元实际能买到什么。\n\n实际回报率则把通胀去掉：大致是 实际回报率 ≈ 名义回报率 − 通胀率。屏幕上更大的数字不一定意味着更多的实际财富。",
          ja: "利息の付く預金口座は、この問題を防いでくれるように見えます——残高が毎年増えるのですから。しかしその数字は名目リターンです：単にドルで測った増加であり、そのドルで実際に何が買えるかは問いません。\n\n実質リターンはインフレを差し引いたものです：おおよそ 実質リターン ≈ 名目リターン − インフレ率。画面上の大きな数字が、必ずしもより多くの実質的な富を意味するわけではありません。",
        },
      },
    ],
    takeaway: {
      en: "A growing account balance isn't the same as growing wealth. What matters is the real return — nominal growth minus inflation — because that's what determines whether your money's actual purchasing power is rising or falling.",
      es: "Un saldo creciente no es lo mismo que riqueza creciente. Lo que importa es el rendimiento real — crecimiento nominal menos inflación.",
      ko: "잔고가 느는 것이 부가 느는 것과 같지는 않습니다. 중요한 것은 실질 수익률 — 명목 성장에서 인플레이션을 뺀 것 — 입니다.",
      zh: "余额增长不等于财富增长。重要的是实际回报率——名义增长减去通胀。",
      ja: "残高が増えることは富が増えることと同じではありません。重要なのは実質リターン——名目成長からインフレを引いたもの——です。",
    },
    thinkAbout: {
      en: "Lesson 15 showed how compounding rewards time above almost everything else. Now add inflation to that picture: money that sits still, even in an account with a small positive interest rate, can still lose real purchasing power every year inflation outpaces it. Does that change how you think about the difference between saving and simply not spending?",
      es: "La Lección 15 mostró que la capitalización premia el tiempo sobre casi todo lo demás. Ahora añade la inflación: el dinero quieto, incluso con un poco de interés, puede perder poder adquisitivo real cada año que la inflación lo supere. ¿Cambia eso tu forma de pensar sobre ahorrar frente a simplemente no gastar?",
      ko: "15강에서는 복리가 거의 모든 것보다 시간을 우대한다는 것을 보여주었습니다. 이제 인플레이션을 더해보세요: 작은 양의 이자가 붙어도 가만히 있는 돈은 인플레이션이 앞지르는 해마다 실질 구매력을 잃을 수 있습니다. 이것이 저축과 단순히 쓰지 않는 것의 차이를 생각하는 방식을 바꾸나요?",
      zh: "第15课说明了复利几乎比其他任何因素都更重视时间。现在把通胀也加进来看：即使有一点正利息，静止不动的钱也会在通胀超过它的每一年损失实际购买力。这是否改变了你对\"储蓄\"和\"仅仅不花钱\"之间区别的看法？",
      ja: "第15課では、複利がほぼ何よりも時間を重視することを示しました。ここにインフレを加えてみましょう：わずかなプラスの利息がついていても、動かないお金はインフレがそれを上回る年ごとに実質的な購買力を失う可能性があります。これは、貯蓄と単に使わないことの違いについての考え方を変えますか？",
    },
  },
  {
    id: 22, track: "money", icon: "📋", color: "#78350f",
    title: { en: "W-2 vs. 1099: Why Your Tax Bill Changes With How You're Paid", es: "W-2 vs. 1099: Por Qué Tu Factura de Impuestos Cambia Según Cómo Te Pagan", ko: "W-2 vs. 1099: 받는 방식에 따라 세금 부담이 달라지는 이유", zh: "W-2与1099：为什么你的纳税方式取决于你如何被支付", ja: "W-2対1099：支払われ方によって税金が変わる理由" },
    subtitle: { en: "The same income can owe very different taxes depending on whether you're an employee or a contractor", es: "El mismo ingreso puede deber impuestos muy distintos según seas empleado o contratista", ko: "같은 소득이라도 직원인지 계약자인지에 따라 세금 부담이 크게 달라질 수 있습니다", zh: "同样的收入，作为雇员和作为承包商所欠的税可能大不相同", ja: "同じ収入でも、従業員か契約者かによって税額は大きく変わり得る" },
    sections: [
      {
        heading: { en: "Employee (W-2) or Independent Contractor (1099)?", es: "¿Empleado (W-2) o Contratista Independiente (1099)?", ko: "직원(W-2)인가, 독립계약자(1099)인가?", zh: "雇员（W-2）还是独立承包商（1099）？", ja: "従業員（W-2）か独立契約者（1099）か？" },
        body: {
          en: "A W-2 and a 1099 are both tax forms a worker receives each January summarizing the previous year's pay — but which one you get depends on your working relationship, not your job title. A W-2 means you're an employee: your employer directs how, when, and where the work gets done, and — as Lesson 19 covered — automatically withholds income tax and payroll taxes from every paycheck. A 1099 means you were paid as an independent contractor: a business or client paid you for a service, but nothing was withheld, and no employer relationship existed.\n\nThe same kind of work can show up either way. A graphic designer on staff at an agency, with set hours and a manager, gets a W-2. A graphic designer who takes freelance projects for different clients, sets her own hours, and uses her own equipment gets a 1099 from each client who paid her over a threshold. The distinction isn't about what work was done — it's about who controls how it gets done, and it changes what happens with taxes.",
          es: "Un W-2 y un 1099 son formularios fiscales que resumen tus ingresos del año anterior. El W-2 significa que eres empleado: el empleador retiene automáticamente impuestos de cada cheque (Lección 19). El 1099 significa que trabajaste como contratista independiente: nadie retuvo nada. La diferencia no es el tipo de trabajo, sino quién controla cómo se hace — y eso cambia todo en materia de impuestos.",
          ko: "W-2와 1099는 전년도 소득을 요약하는 세금 서류입니다. W-2는 직원임을 의미하며, 고용주가 매 급여에서 자동으로 세금을 원천징수합니다(19강 참고). 1099는 독립계약자로 일했음을 의미하며, 아무것도 원천징수되지 않습니다. 차이는 어떤 일을 했느냐가 아니라 누가 일하는 방식을 통제하느냐이며, 이는 세금 처리 방식을 완전히 바꿉니다.",
          zh: "W-2和1099都是总结上一年收入的报税表。W-2意味着你是雇员：雇主会自动从每次薪水中代扣税款（见第19课）。1099意味着你是以独立承包商身份获得报酬：没有任何代扣。区别不在于做了什么工作，而在于谁掌控工作方式——这彻底改变了税务处理方式。",
          ja: "W-2と1099はどちらも前年の所得をまとめた税務書類です。W-2は従業員であることを意味し、雇用主が毎回の給料から自動的に税金を源泉徴収します（第19課参照）。1099は独立契約者として報酬を受け取ったことを意味し、何も源泉徴収されません。違いはどんな仕事をしたかではなく、誰が仕事のやり方を管理するかであり、それが税金の扱いを大きく変えます。",
        },
      },
      {
        heading: { en: "The Self-Employment Tax: Paying Both Halves", es: "El Impuesto de Trabajo por Cuenta Propia: Pagando Ambas Mitades", ko: "자영업세: 양쪽 절반을 모두 부담하기", zh: "自雇税：承担两份负担", ja: "自営業税：両方の半分を自分で払う" },
        body: {
          en: "Lesson 19 explained that a paycheck's gap between gross and net includes payroll taxes funding Social Security and Medicare — and that an employer normally withholds and pays part of that automatically. What that lesson didn't say: the employer isn't paying that payroll tax alone. It's split roughly in half between employer and employee, with the employer's half never even appearing on the employee's pay stub.\n\nA 1099 contractor has no employer to cover that other half — so a self-employed person owes both halves themselves, a combined self-employment tax on top of ordinary income tax. Because nothing is automatically withheld from a 1099 payment the way it is from a W-2 paycheck, the responsibility shifts entirely onto the worker: setting money aside from every payment, and — depending on how much is owed — sending estimated tax payments to the IRS quarterly throughout the year rather than paying everything at once the following spring.\n\nThis is exactly why freelancers, gig workers, and small-business owners are consistently told to set aside roughly a quarter to a third of what they earn before it ever reaches their checking account: on a W-2, that setting-aside already happened automatically, paycheck by paycheck.",
          es: "La Lección 19 explicó que parte de la diferencia entre el sueldo bruto y el neto son los impuestos de nómina (Seguro Social, Medicare), divididos aproximadamente a la mitad entre empleador y empleado. Un contratista 1099 no tiene empleador que pague esa otra mitad — así que debe pagar ambas mitades él mismo, el llamado impuesto de trabajo por cuenta propia, además del impuesto sobre la renta normal. Como nada se retiene automáticamente, el trabajador independiente debe apartar dinero de cada pago y a menudo enviar pagos de impuestos estimados trimestralmente al IRS.",
          ko: "19강에서는 총급여와 실수령액의 차이 중 일부가 사회보장세·메디케어 같은 급여세이며, 이는 고용주와 직원이 대략 절반씩 부담한다고 설명했습니다. 1099 계약자에게는 그 절반을 대신 내줄 고용주가 없으므로, 본인이 양쪽 절반을 모두 부담하는 '자영업세'를 일반 소득세에 더해 내야 합니다. 자동으로 원천징수되는 것이 없기 때문에, 프리랜서는 매 지급액에서 스스로 돈을 떼어 놓고 IRS에 분기별로 추정세를 납부해야 하는 경우가 많습니다.",
          zh: "第19课解释过，税前和税后工资之间的差额部分是社保、医疗保险等工资税，大约由雇主和雇员各承担一半。1099承包商没有雇主替自己承担另一半，所以自雇者要自己承担两半，即在普通所得税之外还要缴纳自雇税。由于没有任何自动代扣，独立工作者必须自己从每笔收入中留出税款，通常还需要每季度向IRS缴纳预估税款。",
          ja: "第19課では、総支給額と手取り額の差の一部が社会保障やメディケアなどの給与税であり、それが雇用主と従業員でおおよそ半分ずつ負担されると説明しました。1099の契約者にはその半分を負担してくれる雇用主がいないため、自営業者は両方の半分を自分で負担する「自営業税」を通常の所得税に加えて払う必要があります。自動的に源泉徴収されるものが何もないため、フリーランスは各支払いから自分でお金を取り分け、四半期ごとにIRSへ見積納税を行うことが多くなります。",
        },
      },
    ],
    takeaway: {
      en: "The same work can arrive as a W-2 or a 1099, and that single distinction decides whether taxes are withheld automatically or become the worker's own responsibility to set aside and pay — including a self-employment tax that covers the half an employer would otherwise pay.",
      es: "El mismo trabajo puede llegar como W-2 o 1099, y esa distinción decide si los impuestos se retienen automáticamente o si el trabajador debe apartarlos y pagarlos él mismo — incluido un impuesto de trabajo por cuenta propia que cubre la mitad que normalmente paga el empleador.",
      ko: "같은 일이라도 W-2로 받느냐 1099로 받느냐에 따라 세금이 자동으로 원천징수되는지, 아니면 근로자 본인이 직접 떼어 내고 납부해야 하는지가 결정됩니다 — 여기에는 고용주가 원래 부담했을 절반을 대신 내는 자영업세도 포함됩니다.",
      zh: "同样的工作可能以W-2或1099的形式到来，这一区别决定了税款是自动代扣，还是需要工作者自己留出并缴纳——包括覆盖雇主本应承担那一半的自雇税。",
      ja: "同じ仕事でもW-2として来るか1099として来るかで、税金が自動的に源泉徴収されるか、それとも働く本人が自分で取り分けて納めなければならないかが決まります——本来雇用主が負担するはずの半分をカバーする自営業税も含めてです。",
    },
    thinkAbout: {
      en: "Lesson 19 showed that a raise can never shrink your take-home pay because payroll withholding just takes a slightly bigger automatic slice. Now picture that same raise arriving as 1099 income instead — with nothing withheld at all. Does thinking through what you'd need to set aside yourself change how you'd size up a freelance opportunity against a salaried one paying the same headline number?",
      es: "La Lección 19 mostró que un aumento nunca reduce tu sueldo neto, porque la retención automática solo toma una porción algo mayor. Ahora imagina ese mismo aumento llegando como ingreso 1099 — sin nada retenido. ¿Cambia eso cómo evaluarías una oportunidad freelance frente a un salario con el mismo número nominal?",
      ko: "19강에서는 급여 인상이 실수령액을 절대 줄이지 않는다는 것을 보여주었습니다. 자동 원천징수가 그저 조금 더 큰 몫을 가져갈 뿐이기 때문입니다. 이제 같은 인상분이 1099 소득으로 들어온다고 상상해보세요 — 아무것도 원천징수되지 않습니다. 스스로 떼어 놓아야 할 금액을 계산해보는 것이, 같은 명목 금액의 정규직 급여와 프리랜서 기회를 비교하는 방식을 바꾸나요?",
      zh: "第19课说明了加薪永远不会让到手工资变少，因为自动代扣只是多拿走了稍大的一部分。现在设想同样的加薪以1099收入的形式到来——完全没有任何代扣。想清楚自己需要留出多少钱，是否会改变你比较自由职业机会和相同名义数字的受薪工作时的看法？",
      ja: "第19課では、昇給が手取りを減らすことは絶対にないと示しました。自動源泉徴収がやや大きめの分を取るだけだからです。今度は同じ昇給が1099所得として、何も源泉徴収されずに入ってくると想像してください。自分で取り分けるべき金額を考えることは、同じ額面の給与職と比べてフリーランスの機会をどう評価するかを変えますか？",
    },
  },
  {
    id: 23, track: "money", icon: "💸", color: "#be123c",
    title: { en: "Investment Fees: The Cost You Don't See on a Bill", es: "Comisiones de Inversión: El Costo Que No Ves en una Factura", ko: "투자 수수료: 청구서에 안 보이는 비용", zh: "投资费用：账单上看不到的成本", ja: "投資手数料：請求書に現れないコスト" },
    subtitle: { en: "A 1% annual fee sounds tiny, but it compounds against you the same way interest compounds for you", es: "Una comisión anual del 1% suena pequeña, pero se compone en tu contra igual que el interés se compone a tu favor", ko: "연 1% 수수료는 작아 보이지만, 이자가 당신에게 유리하게 복리로 쌓이듯 수수료도 당신에게 불리하게 복리로 쌓입니다", zh: "年化1%的费用听起来很小，但它会像复利那样不利地累积，正如利息会像复利那样对你有利地累积", ja: "年1%の手数料は小さく聞こえますが、利息があなたに有利に複利で積み上がるのと同じように、手数料もあなたに不利に複利で積み上がります" },
    sections: [
      {
        heading: { en: "The Expense Ratio: A Fee You Never Get a Bill For", es: "El Ratio de Gastos: Una Comisión Que Nunca Te Facturan", ko: "운용보수: 청구서가 오지 않는 수수료", zh: "费用率：一笔从不给你开账单的费用", ja: "経費率：請求書が来ない手数料" },
        body: {
          en: "Mutual funds and ETFs charge an annual fee called an expense ratio, expressed as a percentage of the money invested — for example, 0.05% or 1.00% per year. Unlike a phone bill or a subscription, nothing arrives in the mail asking to be paid: the fund simply deducts a small slice of the fund's total assets continuously, so the balance an investor sees has already had the fee taken out. That invisibility is exactly what makes it easy to ignore — there's no moment where the cost becomes obvious.\n\nExpense ratios vary enormously for reasons that have nothing to do with quality. A fund that simply tracks a market index (Lesson 17's diversification idea, done automatically) needs little human decision-making to run, so index funds commonly charge 0.03%-0.20% a year. A fund where a manager actively picks investments, trying to beat the market, costs more to run and commonly charges 0.5%-1.5% a year — and Lesson 17's own point about diversification applies here too: most actively managed funds don't reliably beat a comparable index fund after fees, over long periods.",
          es: "Los fondos mutuos y ETFs cobran una comisión anual llamada ratio de gastos, expresada como porcentaje del dinero invertido. A diferencia de una factura de teléfono, nada llega pidiendo ser pagado: el fondo simplemente deduce continuamente una pequeña porción de los activos totales, así que el saldo que ve el inversionista ya tiene la comisión descontada. Esa invisibilidad es justo lo que la hace fácil de ignorar.\n\nLos ratios de gastos varían enormemente. Un fondo que simplemente sigue un índice de mercado suele cobrar 0.03%-0.20% al año. Un fondo con un gestor que elige activamente las inversiones suele cobrar 0.5%-1.5% al año — y la mayoría de los fondos gestionados activamente no superan de forma confiable a un fondo índice comparable después de comisiones, a largo plazo.",
          ko: "뮤추얼펀드와 ETF는 운용보수라는 연간 수수료를 투자 금액의 비율로 부과합니다. 휴대폰 요금처럼 청구서가 오는 게 아니라, 펀드가 총자산에서 조금씩 계속 떼어가기 때문에 투자자가 보는 잔고에는 이미 수수료가 빠져 있습니다. 이렇게 보이지 않는다는 점이 바로 무시하기 쉽게 만드는 이유입니다.\n\n운용보수는 크게 차이가 납니다. 시장 지수를 그대로 추종하는 펀드는 보통 연 0.03%~0.20%를 부과합니다. 매니저가 적극적으로 투자를 고르는 펀드는 보통 연 0.5%~1.5%를 부과합니다 — 그리고 대부분의 액티브 펀드는 장기적으로 수수료를 뺀 후에는 비교 가능한 인덱스 펀드를 꾸준히 이기지 못합니다.",
          zh: "共同基金和ETF会收取一种叫做费用率的年费，以投资金额的百分比表示。和电话账单不同，没有任何账单寄来要求付款：基金只是持续从总资产中扣除一小部分，所以投资者看到的余额已经是扣除费用之后的了。这种看不见正是它容易被忽视的原因。\n\n费用率差异很大。单纯跟踪市场指数的基金通常每年收取0.03%-0.20%。由基金经理主动挑选投资的基金通常每年收取0.5%-1.5%——而且从长期看，大多数主动管理型基金在扣除费用后并不能可靠地跑赢可比的指数基金。",
          ja: "投資信託やETFは、投資額に対する割合で表される経費率という年間手数料を課します。電話料金と違い、支払いを求める請求書が届くことはありません。ファンドは総資産から少しずつ継続的に差し引くため、投資家が目にする残高にはすでに手数料が引かれています。この見えなさこそが、無視されやすい理由です。\n\n経費率は大きく異なります。市場指数にただ連動するファンドは通常年0.03%〜0.20%を課します。運用者が積極的に投資先を選ぶファンドは通常年0.5%〜1.5%を課します——そして長期で見ると、ほとんどのアクティブ運用ファンドは手数料差し引き後、比較可能なインデックスファンドに確実には勝てません。",
        },
      },
      {
        heading: { en: "Why a Small Fee Becomes a Large One", es: "Por Qué Una Comisión Pequeña Se Vuelve Grande", ko: "작은 수수료가 큰 수수료가 되는 이유", zh: "为什么小额费用会变成大额费用", ja: "小さな手数料が大きくなる理由" },
        body: {
          en: "Lesson 15 showed that money grows fastest when compounding has the most years to work — and that the same math works against you with debt, where unpaid interest compounds too. A fee works exactly like that unpaid interest: it's subtracted every single year, including from the growth the fee took in prior years, so its cost compounds right alongside the investment's returns.\n\nSay $10,000 is invested for 30 years at a 7% annual return. In a fund charging 0.05%, fees are barely noticeable and the balance grows to roughly $76,000. In a fund charging 1.05% — a difference of exactly one percentage point — the effective annual growth rate drops to about 6%, and the balance reaches only around $57,000. That one-point difference, compounded over 30 years, consumed roughly a quarter of the total balance — not because the fee was charged once, but because it was charged every year on money that would otherwise have kept compounding.\n\nThis doesn't mean the cheapest fund is always the right choice, or that every fee is unjustified — some strategies genuinely cost more to run. But because a fee is guaranteed and compounds for as long as the money is invested, while a fund's future performance is not guaranteed, checking a fund's expense ratio before investing is one of the few things an investor can know for certain in advance.",
          es: "La Lección 15 mostró que el dinero crece más rápido cuando el interés compuesto tiene más años para trabajar — y que la misma matemática funciona en tu contra con deudas, donde el interés no pagado también se compone. Una comisión funciona igual: se resta cada año, incluso sobre el crecimiento que la comisión ya se llevó en años anteriores.\n\nCon $10,000 invertidos 30 años a un 7% anual: con una comisión de 0.05%, el saldo llega a unos $76,000. Con una comisión de 1.05% — solo un punto porcentual de diferencia — el saldo llega a apenas unos $57,000. Esa diferencia de un punto, compuesta durante 30 años, se llevó aproximadamente una cuarta parte del saldo total.\n\nEsto no significa que el fondo más barato siempre sea la mejor opción. Pero como la comisión es segura y se compone mientras el dinero esté invertido, mientras que el desempeño futuro no lo es, revisar el ratio de gastos antes de invertir es algo que un inversionista puede saber con certeza de antemano.",
          ko: "15강에서는 복리가 작동할 시간이 많을수록 돈이 더 빨리 불어나며, 갚지 않은 이자에도 이자가 붙어 부채에서는 같은 수학이 불리하게 작동한다고 설명했습니다. 수수료도 똑같이 작동합니다: 수수료는 매년 공제되며, 심지어 이전 연도에 수수료가 이미 떼어간 성장분에서도 다시 공제됩니다.\n\n$10,000를 연 7% 수익률로 30년간 투자한다고 하면, 수수료 0.05%인 펀드는 잔고가 약 $76,000까지 자랍니다. 수수료 1.05%인 펀드는 — 단 1%포인트 차이인데 — 잔고가 약 $57,000에 그칩니다. 이 1%포인트 차이가 30년간 복리로 쌓여 전체 잔고의 약 4분의 1을 가져간 것입니다.\n\n이것이 가장 저렴한 펀드가 항상 최선이라는 뜻은 아닙니다. 하지만 수수료는 확실하고 투자 기간 내내 복리로 쌓이는 반면, 펀드의 미래 성과는 확실하지 않으므로, 투자 전에 운용보수를 확인하는 것은 투자자가 미리 확실히 알 수 있는 몇 안 되는 것 중 하나입니다.",
          zh: "第15课说明，复利运作的年数越多，钱增长得越快——同样的数学在债务上对你不利，因为未偿还的利息也会产生复利。费用的运作方式与此完全相同：它每年都会被扣除，甚至会从费用在前几年已经拿走的增长部分中再次扣除。\n\n假设10,000美元以7%的年回报率投资30年：在收费0.05%的基金中，余额会增长到约76,000美元。在收费1.05%的基金中——仅相差一个百分点——余额只能达到约57,000美元。这一个百分点的差异，经过30年的复利累积，吞掉了总余额的大约四分之一。\n\n这并不意味着最便宜的基金总是最佳选择。但由于费用是确定的，并且只要资金还在投资中就会持续复利累积，而基金未来的表现并不确定，因此在投资前查看基金的费用率是投资者事先能够确定知道的少数事情之一。",
          ja: "第15課では、複利が働く年数が多いほどお金は速く増えること、そして未払いの利息にも利息がつくため、借金では同じ数学が不利に働くことを示しました。手数料もまったく同じように働きます：手数料は毎年差し引かれ、しかも前年までに手数料がすでに奪った成長分からも再び差し引かれます。\n\n10,000ドルを年7%の利回りで30年間投資したとします。手数料0.05%のファンドでは、残高は約76,000ドルまで増えます。手数料1.05%のファンドでは——わずか1パーセントポイントの差なのに——残高は約57,000ドルにしかなりません。この1ポイントの差が30年間複利で積み重なり、総残高のおよそ4分の1を奪ったことになります。\n\nこれは最も安いファンドが常に最善だという意味ではありません。しかし手数料は確実であり、投資している限り複利で積み重なる一方、ファンドの将来の成績は確実ではないため、投資前に経費率を確認することは、投資家が事前に確実に知ることができる数少ない事柄の一つです。",
        },
      },
    ],
    takeaway: {
      en: "A fee never sends a bill, but it compounds every year exactly like the interest in Lesson 15 — just working against the balance instead of for it, which is why even a fee under 1% is worth checking before investing.",
      es: "Una comisión nunca envía una factura, pero se compone cada año igual que el interés de la Lección 15 — solo que en contra del saldo en vez de a favor, por eso vale la pena revisarla antes de invertir aunque sea menor al 1%.",
      ko: "수수료는 청구서를 보내지 않지만, 15강의 이자처럼 매년 복리로 쌓입니다 — 다만 잔고에 유리하게가 아니라 불리하게 작동할 뿐이므로, 1% 미만의 수수료라도 투자 전에 확인할 가치가 있습니다.",
      zh: "费用从不寄账单，但它每年都像第15课的利息一样复利累积——只是方向相反、不利于余额，这正是为什么即使不到1%的费用也值得在投资前查看。",
      ja: "手数料は請求書を送ってきませんが、第15課の利息とまったく同じように毎年複利で積み重なります——ただし残高に有利にではなく不利に働くだけなので、1%未満の手数料でも投資前に確認する価値があります。",
    },
    thinkAbout: {
      en: "Two funds track the same market index and hold virtually identical investments, but one charges 0.05% and the other charges 0.75% a year. Since Lesson 17 showed that diversification, not stock-picking skill, is what an index fund already provides, what would justify paying the higher fee for the same underlying holdings?",
      es: "Dos fondos siguen el mismo índice y tienen inversiones casi idénticas, pero uno cobra 0.05% y el otro 0.75% al año. Como la Lección 17 mostró que la diversificación, no la habilidad para elegir acciones, es lo que ya ofrece un fondo índice, ¿qué justificaría pagar la comisión más alta por las mismas inversiones subyacentes?",
      ko: "두 펀드가 같은 시장 지수를 추종하며 거의 동일한 투자 자산을 보유하고 있지만, 하나는 연 0.05%를, 다른 하나는 연 0.75%를 부과합니다. 17강에서 인덱스 펀드가 이미 제공하는 것은 주식 선택 실력이 아니라 분산투자라고 설명했는데, 같은 기초 자산에 더 높은 수수료를 내는 것을 정당화할 이유가 있을까요?",
      zh: "两只基金追踪同一个市场指数，持仓几乎完全相同，但一只每年收费0.05%，另一只收费0.75%。既然第17课说明了指数基金已经提供的是分散投资而不是选股能力，那么为相同的底层持仓支付更高的费用有什么理由呢？",
      ja: "2つのファンドが同じ市場指数に連動し、ほぼ同一の投資対象を保有していますが、一方は年0.05%、もう一方は年0.75%を課しています。第17課で、インデックスファンドがすでに提供しているのは銘柄選択の腕前ではなく分散投資だと示されたことを踏まえると、同じ原資産に対してより高い手数料を払う理由は何でしょうか？",
    },
  },
  {
    id: 24, track: "money", icon: "🏠", color: "#334155",
    title: { en: "Renting vs. Buying: The Real Trade-offs of a Home", es: "Alquilar vs. Comprar: Las Verdaderas Disyuntivas de una Vivienda", ko: "임대 vs. 매수: 주택의 진짜 트레이드오프", zh: "租房与购房：住房的真实权衡", ja: "賃貸か購入か：住宅の本当のトレードオフ" },
    subtitle: { en: "A mortgage payment and a rent payment look similar, but they buy very different things", es: "Un pago de hipoteca y un pago de alquiler parecen similares, pero compran cosas muy distintas", ko: "주택담보대출 상환금과 월세는 비슷해 보이지만, 사는 것은 완전히 다릅니다", zh: "房贷月供和房租看起来相似，但它们买到的东西却大不相同", ja: "住宅ローンの返済と家賃の支払いは似ているようで、買っているものはまったく違います" },
    sections: [
      {
        heading: { en: "Renting vs. Buying: What Each Path Actually Costs", es: "Alquilar vs. Comprar: Lo Que Cada Camino Realmente Cuesta", ko: "임대 vs. 매수: 각 선택이 실제로 드는 비용", zh: "租房与购房：每条路径的真实成本", ja: "賃貸か購入か：それぞれの道が実際にかかる費用" },
        body: {
          en: "Rent and a mortgage payment look like the same kind of expense — a check written every month for housing — but they buy very different things. Rent buys the right to live somewhere for a fixed period, with no long-term claim on the property; when the lease ends, the renter walks away with nothing added to their own balance sheet. In exchange, a landlord absorbs the surprise costs of ownership — a broken water heater, a new roof, rising property taxes — and a renter can typically move with a month or two of notice.\n\nBuying trades that flexibility for something else: some of each mortgage payment builds equity, meaning a stake in the home the buyer keeps or gets back later. But buying also front-loads costs a renter never sees. A down payment plus closing costs — fees for the loan, title search, inspection, and more — commonly run 2%-5% of the purchase price, and selling later usually costs another 5%-6% in agent commissions. A homeowner is also on the hook for the exact surprise costs a landlord absorbed: property taxes, homeowner's insurance (Lesson 20's trade-a-small-cost-for-protection idea, now mandatory for anyone with a mortgage), and repairs. None of this means buying is a mistake or renting is 'wasting money' — it means the two options bundle cost, risk, and flexibility differently, and which bundle fits depends on how long someone expects to stay and what they'd do with the money otherwise.",
          es: "El alquiler y el pago de una hipoteca parecen el mismo tipo de gasto: un cheque que se escribe cada mes por la vivienda, pero compran cosas muy distintas. El alquiler compra el derecho a vivir en un lugar durante un período fijo, sin ningún derecho a largo plazo sobre la propiedad; cuando termina el contrato, el inquilino se va sin haber sumado nada a su propio patrimonio. A cambio, el propietario absorbe los costos sorpresa de la propiedad —un calentador de agua roto, un techo nuevo, impuestos a la propiedad en aumento— y el inquilino normalmente puede mudarse con uno o dos meses de aviso.\n\nComprar cambia esa flexibilidad por otra cosa: una parte de cada pago de hipoteca construye capital (equity), es decir, una participación en la vivienda que el comprador conserva o recupera más adelante. Pero comprar también adelanta costos que un inquilino nunca ve. Un pago inicial más los costos de cierre —comisiones por el préstamo, búsqueda de título, inspección, y más— suelen sumar entre 2% y 5% del precio de compra, y venderla después normalmente cuesta otro 5%-6% en comisiones de agente. Un propietario también carga con los mismos costos sorpresa que antes absorbía el arrendador: impuestos a la propiedad, seguro de vivienda (la idea de la Lección 20 de cambiar un costo pequeño por protección, ahora obligatorio para quien tiene una hipoteca), y reparaciones. Nada de esto significa que comprar sea un error o que alquilar sea 'tirar el dinero' — significa que las dos opciones combinan costo, riesgo y flexibilidad de manera distinta, y qué combinación conviene depende de cuánto tiempo alguien planea quedarse y qué haría con el dinero de otra manera.",
          ko: "월세와 주택담보대출 상환금은 매달 주거비로 나가는 같은 종류의 지출처럼 보이지만, 실제로 사는 것은 전혀 다릅니다. 월세는 정해진 기간 동안 어딘가에 살 권리를 사는 것이며, 그 부동산에 대한 장기적인 권리는 없습니다. 계약이 끝나면 세입자는 자신의 자산에 아무것도 더하지 못한 채 떠납니다. 그 대신 집주인이 온수기 고장, 지붕 교체, 오르는 재산세 같은 예상치 못한 비용을 부담하며, 세입자는 보통 한두 달 전 통보만으로 이사할 수 있습니다.\n\n매수는 그 유연성을 다른 것과 맞바꿉니다: 대출 상환금의 일부는 지분(equity), 즉 나중에 매도자가 유지하거나 돌려받는 주택에 대한 지분을 쌓습니다. 하지만 매수는 세입자가 절대 보지 못하는 비용을 미리 지불하게 합니다. 계약금에 클로징 비용—대출 수수료, 등기 조사, 검사 등—을 더하면 보통 매매가의 2%~5%에 달하고, 나중에 매도할 때도 중개 수수료로 5%~6%가 또 듭니다. 집주인은 이전에 임대인이 부담했던 바로 그 예상치 못한 비용, 즉 재산세, 주택보험(20강의 '작은 확실한 비용으로 보호를 사는' 개념이며, 대출이 있으면 이제 의무입니다), 그리고 수리비를 떠안게 됩니다. 이것이 매수가 실수이거나 임대가 '돈 낭비'라는 뜻은 아닙니다 — 두 선택지가 비용, 위험, 유연성을 서로 다르게 묶어 놓았을 뿐이며, 어떤 조합이 맞는지는 얼마나 오래 머물 계획인지, 그리고 그 돈으로 달리 무엇을 할지에 달려 있습니다.",
          zh: "房租和房贷月供看起来是同一种支出——每月为住房开出一张支票——但它们买到的东西却大不相同。房租买的是在固定期限内居住某处的权利，对该房产没有任何长期的所有权；租约到期后，租客离开时自己的资产负债表上不会多出任何东西。作为交换，房东承担了拥有房产带来的意外成本——热水器坏了、屋顶要换、房产税上涨——而租客通常只需提前一两个月通知就能搬走。\n\n购房则是用这种灵活性换取别的东西：每期房贷月供中的一部分会积累成净值（equity），也就是买家保留或日后收回的对房屋的权益。但购房也会预先产生租客从未见过的成本。首付款加上交易成交费用——贷款手续费、产权调查、验房等——通常合计为购房价的2%-5%，而日后出售房屋通常还要再付5%-6%的中介佣金。房主还要承担此前由房东承担的那些意外成本：房产税、房屋保险（正是第20课'用小额确定成本换取保护'的理念，现在对任何有房贷的人来说都是强制性的），以及维修费用。这并不意味着购房是个错误，也不意味着租房是'把钱扔掉'——这意味着两种选择以不同方式组合了成本、风险和灵活性，哪种组合更合适取决于一个人计划住多久，以及如果不买房这笔钱会用来做什么。",
          ja: "家賃と住宅ローンの返済は、毎月住居のために切る小切手という同じ種類の支出に見えますが、実際に買っているものはまったく異なります。家賃は決まった期間その場所に住む権利を買うものであり、その不動産に対する長期的な権利は一切ありません。契約が終われば、借主は自分の資産に何も加わらないまま出て行きます。その代わり、給湯器の故障、屋根の張り替え、上昇する固定資産税といった予期せぬ費用は大家が負担し、借主は通常一、二ヶ月前の通知だけで引っ越せます。\n\n購入はその柔軟性を別のものと引き換えます：住宅ローンの返済の一部は持分（エクイティ）、つまり買主が保持するか、後で取り戻す住宅への権利を積み上げます。しかし購入は、借主が決して目にすることのない費用を前払いさせます。頭金に加えてクロージングコスト——ローン手数料、権利調査、検査など——は通常購入価格の2%〜5%にのぼり、後で売却する際にもさらに仲介手数料として5%〜6%かかります。持ち家の所有者は、以前は大家が吸収していたのとまったく同じ予期せぬ費用、すなわち固定資産税、住宅保険（第20課の「小さく確実な費用で保護を買う」考え方で、住宅ローンがある人には今や必須）、そして修繕費を負担することになります。これは購入が間違いだとか、賃貸が「お金の無駄」だという意味ではありません——二つの選択肢がコスト、リスク、柔軟性を異なる形で組み合わせているだけであり、どちらの組み合わせが合うかは、どれくらいの期間住むつもりか、そしてそのお金を他に何に使うかによって決まります。",
        },
      },
      {
        heading: { en: "What a Mortgage Payment Is Actually Made Of", es: "De Qué Está Hecho en Realidad un Pago de Hipoteca", ko: "주택담보대출 상환금은 실제로 무엇으로 이루어져 있나", zh: "房贷月供究竟由什么构成", ja: "住宅ローンの返済は実際に何でできているのか" },
        body: {
          en: "A mortgage is a loan that uses the home itself as collateral: if payments stop, the lender can foreclose and take the home to recover what's owed, which is why lenders can offer lower interest rates on a mortgage than on an unsecured loan like a credit card. A typical monthly payment bundles four things — principal (paying down the amount borrowed), interest (the lender's charge for the loan), property taxes, and homeowner's insurance — even though only the first two make up the loan itself.\n\nThe principal-and-interest split moves over the life of the loan in a pattern many buyers don't expect: early payments are mostly interest, and later payments are mostly principal. This is the same compounding math from Lesson 15, running against the borrower instead of for them — interest is charged on the full remaining balance, so when the balance is largest (right after buying), the interest portion is largest too. A 30-year loan often doesn't cross the halfway point between interest and principal until roughly two-thirds of the way through its term.\n\nA down payment below 20% of the purchase price usually adds one more cost: private mortgage insurance (PMI), which protects the lender — not the buyer — if the loan defaults, and typically cancels automatically once enough equity has built up. A larger down payment lowers the loan amount, the monthly payment, and often skips PMI entirely, which is part of why the size of a down payment is one of the most-discussed numbers in buying a home.",
          es: "Una hipoteca es un préstamo que usa la propia vivienda como garantía: si los pagos se detienen, el prestamista puede ejecutar la hipoteca y quedarse con la vivienda para recuperar lo adeudado, razón por la cual los prestamistas pueden ofrecer tasas de interés más bajas en una hipoteca que en un préstamo sin garantía como una tarjeta de crédito. Un pago mensual típico agrupa cuatro elementos —capital (reducir el monto prestado), interés (el cargo del prestamista por el préstamo), impuestos a la propiedad y seguro de vivienda— aunque solo los dos primeros forman parte del préstamo en sí.\n\nLa división entre capital e interés cambia a lo largo de la vida del préstamo de una forma que muchos compradores no esperan: los primeros pagos son sobre todo interés, y los últimos son sobre todo capital. Es la misma matemática del interés compuesto de la Lección 15, funcionando en contra del prestatario en lugar de a su favor —el interés se cobra sobre todo el saldo restante, así que cuando el saldo es más grande (justo después de comprar), la porción de interés también lo es. Un préstamo a 30 años a menudo no cruza el punto medio entre interés y capital hasta aproximadamente dos tercios de su plazo.\n\nUn pago inicial menor al 20% del precio de compra suele añadir un costo más: el seguro hipotecario privado (PMI), que protege al prestamista —no al comprador— si el préstamo entra en impago, y que normalmente se cancela automáticamente una vez que se ha acumulado suficiente capital. Un pago inicial más grande reduce el monto del préstamo, el pago mensual, y a menudo evita el PMI por completo, lo cual es parte de por qué el tamaño del pago inicial es una de las cifras más discutidas al comprar una vivienda.",
          ko: "주택담보대출(모기지)은 주택 자체를 담보로 하는 대출입니다: 상환이 중단되면 대출기관은 압류하여 주택을 가져가 미상환액을 회수할 수 있으며, 바로 이 때문에 대출기관은 신용카드 같은 무담보 대출보다 모기지에 더 낮은 금리를 제시할 수 있습니다. 일반적인 월 상환금은 원금(빌린 금액을 갚아나가는 것), 이자(대출에 대한 대출기관의 청구), 재산세, 주택보험이라는 네 가지 요소로 묶여 있지만, 대출 자체를 구성하는 것은 앞의 두 가지뿐입니다.\n\n원금과 이자의 비율은 대출 기간 동안 많은 구매자가 예상하지 못한 패턴으로 변합니다: 초기 상환금은 대부분 이자이고, 후기 상환금은 대부분 원금입니다. 이는 15강의 복리 수학과 동일하지만, 차용인에게 유리하게가 아니라 불리하게 작동합니다 — 이자는 남은 전체 잔액에 대해 부과되므로, 잔액이 가장 클 때(매수 직후) 이자 비중도 가장 큽니다. 30년 대출은 대개 대출 기간의 약 3분의 2 지점이 되어서야 이자와 원금의 비중이 역전됩니다.\n\n계약금이 매매가의 20% 미만이면 보통 비용이 하나 더 추가됩니다: 개인 모기지보험(PMI)으로, 이는 구매자가 아니라 대출기관을 대출 부도 시 보호하기 위한 것이며, 충분한 지분이 쌓이면 보통 자동으로 해지됩니다. 계약금이 클수록 대출 금액과 월 상환금이 줄어들고, 흔히 PMI를 아예 피할 수 있는데, 이것이 계약금 규모가 주택 구매에서 가장 많이 논의되는 숫자 중 하나인 이유의 일부입니다.",
          zh: "房贷是一种以房屋本身作为抵押品的贷款：如果停止还款，贷方可以取消抵押品赎回权并收回房屋以弥补欠款，这也是为什么贷方能够为房贷提供比信用卡这类无抵押贷款更低利率的原因。典型的月供包含四个部分——本金（偿还所借金额）、利息（贷方对贷款收取的费用）、房产税和房屋保险——尽管只有前两项才真正构成贷款本身。\n\n本金与利息的比例在贷款存续期内会以许多购房者意想不到的方式变化：早期还款大部分是利息，后期还款大部分是本金。这与第15课的复利数学原理相同，只是方向相反、不利于借款人——利息是按剩余全部余额计算的，所以当余额最大时（刚购房之后），利息部分也最大。一笔30年期贷款往往要到贷款期限约三分之二处，利息和本金的比例才会发生逆转。\n\n首付低于购房价20%通常还会增加一项成本：私人抵押贷款保险（PMI），它保护的是贷方而不是买方，用于贷款违约时的赔付，通常在积累了足够的净值后会自动取消。更大的首付会降低贷款金额和月供，也往往能完全避免PMI，这也是首付金额成为购房中最常被讨论的数字之一的部分原因。",
          ja: "住宅ローンは、住宅そのものを担保とする融資です：返済が止まれば、貸し手は差し押さえを行い、住宅を取得して未払い分を回収できます。だからこそ貸し手は、クレジットカードのような無担保ローンよりも住宅ローンに低い金利を提示できるのです。典型的な毎月の返済額は、元金（借りた金額を減らす部分）、利息（融資に対する貸し手の請求）、固定資産税、住宅保険という4つの要素をまとめたものですが、ローンそのものを構成するのは最初の2つだけです。\n\n元金と利息の割合は、ローン期間を通じて多くの購入者が予想しない形で変化します：初期の返済はほとんどが利息で、後期の返済はほとんどが元金です。これは第15課の複利の数学とまったく同じですが、借り手に有利にではなく不利に働きます——利息は残っている残高全体に対して課されるため、残高が最も大きいとき（購入直後）に利息の割合も最も大きくなります。30年ローンでは、利息と元金の割合が逆転するのは、返済期間のおよそ3分の2が経過してからということも珍しくありません。\n\n頭金が購入価格の20%未満だと、通常もう一つ費用が加わります：民間住宅ローン保険（PMI）です。これは買主ではなく貸し手を、ローンが債務不履行になった場合に保護するもので、十分な持分が積み上がると通常自動的に解約されます。頭金が大きいほどローン額と毎月の返済額が下がり、多くの場合PMIを完全に回避できます。これが、頭金の額が住宅購入において最もよく議論される数字の一つである理由の一部です。",
        },
      },
    ],
    takeaway: {
      en: "Renting and buying aren't a 'right' and 'wrong' choice — they trade flexibility and predictable costs for equity and upfront risk in different amounts, and a mortgage payment itself splits into principal, interest, taxes, and insurance, with the interest share largest in the loan's early years.",
      es: "Alquilar y comprar no son una opción 'correcta' y otra 'incorrecta' — intercambian flexibilidad y costos predecibles por capital y riesgo inicial en distintas proporciones, y el propio pago de la hipoteca se divide en capital, interés, impuestos y seguro, con la mayor parte de interés en los primeros años del préstamo.",
      ko: "임대와 매수는 '옳고 그른' 선택이 아닙니다 — 유연성과 예측 가능한 비용을 지분과 초기 위험과 서로 다른 비율로 맞바꾸는 것이며, 대출 상환금 자체도 원금, 이자, 세금, 보험으로 나뉘는데 대출 초기에는 이자 비중이 가장 큽니다.",
      zh: "租房和购房并非'对'与'错'的选择——它们以不同的比例，用灵活性和可预测的成本换取净值和前期风险，而房贷月供本身也分为本金、利息、税费和保险，其中利息占比在贷款早期最大。",
      ja: "賃貸と購入は「正しい」「間違っている」の選択ではありません——柔軟性と予測可能な費用を、持分と初期リスクとそれぞれ異なる割合で交換しているのです。住宅ローンの返済自体も元金、利息、税金、保険に分かれており、利息の割合はローンの初期が最も大きくなります。",
    },
    thinkAbout: {
      en: "Someone is comparing an apartment renting for $1,800/month to a home where the mortgage, taxes, and insurance would total $1,900/month — almost the same. Given that buying also requires a down payment plus 2%-5% in closing costs upfront, and selling later costs another 5%-6% in commissions, what else would matter before concluding the two options cost 'about the same'?",
      es: "Alguien está comparando un apartamento que se alquila por $1,800/mes con una vivienda donde la hipoteca, los impuestos y el seguro sumarían $1,900/mes — casi lo mismo. Dado que comprar también requiere un pago inicial más 2%-5% en costos de cierre por adelantado, y que vender después cuesta otro 5%-6% en comisiones, ¿qué más importaría antes de concluir que las dos opciones cuestan 'casi lo mismo'?",
      ko: "어떤 사람이 월 $1,800짜리 아파트 임대와, 대출상환금·세금·보험을 합쳐 월 $1,900이 드는 주택을 비교하고 있습니다 — 거의 비슷합니다. 매수에는 계약금에 더해 2%~5%의 클로징 비용이 선불로 들고, 나중에 매도할 때도 5%~6%의 수수료가 든다는 점을 고려하면, 두 선택지의 비용이 '거의 비슷하다'고 결론짓기 전에 또 무엇을 따져봐야 할까요?",
      zh: "有人正在比较一套月租1800美元的公寓，和一套月供、税费、保险合计约1900美元的房子——几乎一样。考虑到购房还需要预先支付首付款以及2%-5%的交易成交费用，而日后出售时还要再付5%-6%的佣金，在得出两种选择'费用差不多'的结论之前，还有什么因素需要考虑？",
      ja: "ある人が、月1,800ドルの賃貸アパートと、ローン・税金・保険を合わせて月1,900ドルになる住宅を比較しています——ほぼ同じです。購入には頭金に加えて前払いで2%〜5%のクロージングコストがかかり、後で売却する際にもさらに5%〜6%の手数料がかかることを踏まえると、二つの選択肢が「ほぼ同じ費用」だと結論づける前に、他に何を考慮すべきでしょうか？",
    },
  },
  {
    id: 25, track: "money", icon: "💼", color: "#0e7490",
    title: { en: "Brokerage Accounts: How Investing Actually Works Mechanically", es: "Cuentas de Corretaje: Cómo Funciona Realmente Invertir", ko: "증권 계좌: 투자가 실제로 작동하는 방식", zh: "券商账户：投资到底是如何运作的", ja: "証券口座：投資は実際どう機能するのか" },
    subtitle: { en: "A brokerage account is a container, not an investment by itself", es: "Una cuenta de corretaje es un contenedor, no una inversión en sí misma", ko: "증권 계좌는 그 자체로 투자가 아니라 담는 그릇일 뿐입니다", zh: "券商账户只是一个容器，本身并不是投资", ja: "証券口座はそれ自体が投資ではなく、あくまで入れ物です" },
    sections: [
      {
        heading: { en: "What a Brokerage Account Is (and Isn't)", es: "Qué Es (y Qué No Es) una Cuenta de Corretaje", ko: "증권 계좌란 무엇이고 무엇이 아닌가", zh: "券商账户是什么，又不是什么", ja: "証券口座とは何か、そして何でないか" },
        body: {
          en: "A brokerage account is just a container — a place to hold investments, not an investment itself. Opening one is normally free and doesn't commit any money on its own; the account only starts working once money is deposited and then used to buy something inside it, like the stocks, bonds, or funds Lesson 17 covered.\n\nThat's easy to miss with cash sitting inside the account. Deposited money that hasn't been used to buy anything generally just sits there — a brokerage account isn't a savings account, so uninvested cash usually doesn't earn much, if anything, on its own. Buying an actual investment is a separate, deliberate step, not something that happens automatically just because money arrived.\n\nA taxable brokerage account is also a different animal from the 401(k) and IRA accounts Lesson 18 covered. There's no contribution limit and no penalty for withdrawing money early, but gains are taxed as they're realized — when an investment is sold for a profit — rather than getting the tax-deferred or tax-free treatment a retirement account provides. Many people end up using both kinds of accounts for different goals: tax-advantaged accounts for retirement, and a taxable brokerage account for money that might be needed sooner.",
          es: "Una cuenta de corretaje es solo un contenedor: un lugar para guardar inversiones, no una inversión en sí misma. Abrir una suele ser gratis y no compromete dinero por sí sola; la cuenta solo empieza a funcionar cuando se deposita dinero y luego se usa para comprar algo dentro de ella, como las acciones, bonos o fondos de la Lección 17.\n\nEso es fácil de pasar por alto con el efectivo dentro de la cuenta. El dinero depositado que no se ha usado para comprar nada normalmente se queda ahí sin más — una cuenta de corretaje no es una cuenta de ahorros, así que el efectivo sin invertir suele generar poco o nada por sí solo. Comprar una inversión real es un paso separado y deliberado, no algo automático.\n\nUna cuenta de corretaje sujeta a impuestos también es distinta de las cuentas 401(k) e IRA de la Lección 18. No tiene límite de aportación ni penalización por retirar dinero antes, pero las ganancias se gravan al realizarse — cuando se vende una inversión con ganancia — en vez del trato diferido o libre de impuestos de una cuenta de jubilación. Muchas personas terminan usando ambos tipos de cuenta para metas distintas.",
          ko: "증권 계좌는 그저 담는 그릇일 뿐입니다 — 투자를 보관하는 곳이지, 그 자체가 투자는 아닙니다. 계좌를 여는 것은 보통 무료이며 그 자체로는 돈을 어디에도 쓰지 않습니다. 계좌는 돈이 입금되고 그 돈으로 17강에서 다룬 주식, 채권, 펀드 같은 것을 실제로 매수할 때 비로소 작동하기 시작합니다.\n\n계좌 안의 현금은 놓치기 쉬운 부분입니다. 아무것도 사는 데 쓰이지 않은 입금액은 보통 그냥 그대로 머물러 있습니다 — 증권 계좌는 저축 계좌가 아니므로, 투자되지 않은 현금은 대개 스스로 거의 또는 전혀 불어나지 않습니다. 실제 투자를 매수하는 것은 별도의, 의도적인 단계입니다.\n\n과세 대상 증권 계좌는 18강에서 다룬 401(k)나 IRA와도 완전히 다릅니다. 납입 한도도 없고 조기 인출 벌금도 없지만, 투자를 이익을 남기고 매도할 때 이익이 실현되는 시점에 과세되며, 은퇴 계좌가 제공하는 세금 이연 또는 비과세 혜택은 없습니다. 많은 사람이 서로 다른 목적을 위해 두 계좌 유형을 함께 사용합니다.",
          zh: "券商账户只是一个容器——一个存放投资的地方，而不是投资本身。开户通常是免费的，本身也不涉及任何资金投入；账户只有在存入资金并用这些资金买入第17课讲过的股票、债券或基金等标的后，才真正开始发挥作用。\n\n账户里的现金很容易被忽视。存入后没有用来购买任何东西的资金，通常就只是原地不动——券商账户不是储蓄账户，所以未投资的现金通常自己几乎不会增值。买入真正的投资是一个独立、需要主动去做的步骤，不会因为钱到账就自动发生。\n\n应税券商账户和第18课讲过的401(k)、IRA也完全不同。它没有缴款上限，提前取出也没有罚金，但收益会在实现时——也就是投资卖出获利时——被征税，而不像退休账户那样享受递延或免税待遇。很多人会同时使用这两类账户来满足不同的目标。",
          ja: "証券口座は単なる入れ物です——投資を保管する場所であって、それ自体が投資ではありません。口座を開くことは通常無料で、それ自体では資金を何にも投入しません。口座は、資金が入金され、その資金で第17課の株式・債券・ファンドのようなものを実際に買って初めて機能し始めます。\n\n口座内の現金は見落としやすい部分です。何かを買うために使われていない入金は、通常そのまま何もせずに置かれます——証券口座は貯蓄口座ではないため、投資されていない現金は通常それ自体ではほとんど、あるいは全く増えません。実際の投資を買うことは、自動的に起こることではなく、別個の意図的なステップです。\n\n課税対象の証券口座は、第18課で扱った401(k)やIRAとも全く異なります。拠出限度額も早期引き出しの罰則もありませんが、利益は実現時——投資を利益を出して売却したとき——に課税され、退職口座が提供する課税繰延べや非課税の扱いはありません。多くの人が異なる目的のために両方の口座を使い分けています。",
        },
      },
      {
        heading: { en: "Placing an Order: Market vs. Limit", es: "Colocar una Orden: Mercado vs. Límite", ko: "주문 넣기: 시장가 vs. 지정가", zh: "下单：市价单与限价单", ja: "注文を出す：成行と指値" },
        body: {
          en: "Once money is in the account, buying or selling something requires placing an order, and the two most common types work differently. A market order says 'buy (or sell) right now, at whatever the best available price is' — it executes almost immediately, but the exact price isn't guaranteed down to the cent, especially if the price is moving fast. A limit order instead sets a specific price: 'only buy at this price or lower' (or 'only sell at this price or higher') — the price is guaranteed if the order executes, but there's no guarantee it executes at all, since the market might never reach that price.\n\nMost brokerages also let investors buy fractional shares — a slice of one share, like $50 worth of a stock trading at $500 — instead of requiring a purchase in whole-share amounts, which makes Lesson 17's diversification easier to build with a smaller amount of money. And a completed trade doesn't finish instantly behind the scenes: shares typically 'settle' — officially change ownership — one business day after the trade, a detail that mostly only matters for quickly using the proceeds of a sale to buy something else.",
          es: "Una vez que hay dinero en la cuenta, comprar o vender algo requiere colocar una orden, y los dos tipos más comunes funcionan de forma distinta. Una orden de mercado dice 'compra (o vende) ahora mismo, al mejor precio disponible' — se ejecuta casi de inmediato, pero el precio exacto no está garantizado, sobre todo si el precio se mueve rápido. Una orden límite en cambio fija un precio específico: 'solo compra a este precio o menos' — el precio está garantizado si la orden se ejecuta, pero no hay garantía de que se ejecute, ya que el mercado podría no llegar nunca a ese precio.\n\nLa mayoría de las plataformas también permiten comprar acciones fraccionarias — una parte de una acción — en vez de exigir la compra de acciones completas, lo que facilita construir la diversificación de la Lección 17 con menos dinero. Y una operación completada no termina al instante: las acciones suelen 'liquidarse' oficialmente un día hábil después.",
          ko: "계좌에 돈이 들어 있으면 무언가를 사고파는 데는 주문을 넣어야 하며, 가장 흔한 두 가지 유형은 서로 다르게 작동합니다. 시장가 주문은 '지금 당장, 구할 수 있는 최선의 가격에 사거나(또는 팔라)'는 것으로, 거의 즉시 체결되지만 정확한 가격이 소수점까지 보장되지는 않습니다. 지정가 주문은 대신 특정 가격을 정합니다: '이 가격 이하로만 사라'(또는 '이 가격 이상으로만 팔라') — 체결되면 가격은 보장되지만, 시장이 그 가격에 결코 도달하지 않을 수도 있으므로 체결 자체는 보장되지 않습니다.\n\n대부분의 증권사는 소수점 단위 주식(fractional share) 매수도 허용합니다 — 완전한 한 주가 아니라 주식의 일부만 사는 것으로, 17강의 분산투자를 더 적은 돈으로도 쉽게 구성할 수 있게 해줍니다. 그리고 체결된 거래는 즉시 완전히 끝나는 것이 아니라, 보통 거래 후 하루 영업일 뒤에 공식적으로 소유권이 '결제(settle)'됩니다.",
          zh: "账户里有了资金后，买卖任何标的都需要下单，而两种最常见的订单类型运作方式不同。市价单意味着'现在就以能拿到的最好价格买入（或卖出）'——几乎立即成交，但确切成交价格不能精确到每一分钱，尤其是在价格快速波动时。限价单则设定一个具体价格：'只以这个价格或更低买入'（或'只以这个价格或更高卖出'）——如果订单成交，价格是有保证的，但不保证一定能成交，因为市场可能永远达不到那个价格。\n\n大多数券商还允许投资者购买碎股——也就是一股中的一小部分，比如用50美元买入一只每股500美元的股票——而不要求整股购买，这让第17课的分散投资用较少的钱也更容易实现。而且成交并不会在幕后瞬间彻底完成：股票通常在交易后的下一个工作日才正式'结算'（完成所有权转移）。",
          ja: "口座に資金が入ったら、何かを売買するには注文を出す必要があり、最も一般的な2つの種類は動き方が異なります。成行注文は「今すぐ、入手可能な最良の価格で買う（または売る）」というもので、ほぼ即座に約定しますが、正確な価格が1セント単位まで保証されるわけではありません。指値注文は代わりに具体的な価格を設定します：「この価格以下でのみ買う」（または「この価格以上でのみ売る」）——約定すれば価格は保証されますが、市場がその価格に決して届かない可能性もあるため、約定そのものは保証されません。\n\nほとんどの証券会社では端株（1株の一部、例えば1株500ドルの株を50ドル分だけ）の購入も認めており、1株単位での購入を求められないため、第17課の分散投資をより少ない資金で組みやすくなります。また、成立した取引は舞台裏で即座に完了するわけではなく、株式は通常、取引の1営業日後に正式に所有権が「決済」されます。",
        },
      },
    ],
    takeaway: {
      en: "A brokerage account is a container, not an investment — opening one is free, but money inside it only grows once it's used to buy something. Market orders trade certainty of execution for uncertainty of price; limit orders do the opposite.",
      es: "Una cuenta de corretaje es un contenedor, no una inversión — abrirla es gratis, pero el dinero dentro solo crece una vez que se usa para comprar algo. Las órdenes de mercado cambian certeza de ejecución por incertidumbre de precio; las órdenes límite hacen lo contrario.",
      ko: "증권 계좌는 투자가 아니라 그릇입니다 — 계좌를 여는 것은 무료지만, 안에 있는 돈은 무언가를 사는 데 쓰여야 비로소 불어납니다. 시장가 주문은 체결의 확실성을 얻는 대신 가격의 불확실성을 감수하고, 지정가 주문은 그 반대입니다.",
      zh: "券商账户是容器，而不是投资本身——开户免费，但账户里的钱只有在被用来买东西之后才会增长。市价单是用价格的不确定性换取成交的确定性；限价单则相反。",
      ja: "証券口座は入れ物であって投資そのものではありません——開設は無料ですが、中の資金は何かを買うために使われて初めて増えます。成行注文は約定の確実性と引き換えに価格の不確実性を受け入れ、指値注文はその逆です。",
    },
    thinkAbout: {
      en: "Someone places a limit order to buy a stock 5% below its current price, hoping to get a better deal, but the price never drops that far and the order never executes. Compared to using a market order instead, what did they trade away — and what did they avoid risking?",
      es: "Alguien coloca una orden límite para comprar una acción 5% por debajo de su precio actual, esperando un mejor trato, pero el precio nunca baja tanto y la orden nunca se ejecuta. Comparado con usar una orden de mercado, ¿qué sacrificó — y qué riesgo evitó?",
      ko: "누군가 더 좋은 가격을 노리고 현재가보다 5% 낮은 지정가 매수 주문을 넣었지만, 가격이 그만큼 떨어지지 않아 주문이 체결되지 않았습니다. 시장가 주문을 썼을 경우와 비교하면, 이 사람은 무엇을 포기했고 어떤 위험을 피했을까요?",
      zh: "有人下了一个限价单，想以比当前价格低5%的价格买入某只股票，希望能买到更划算的价格，但价格始终没有跌到那个水平，订单也就一直没有成交。与直接使用市价单相比，这个人放弃了什么，又避免了什么风险？",
      ja: "ある人が、より良い価格を狙って現在価格より5%低い指値注文を出しましたが、価格がそこまで下がらず、注文は約定しませんでした。代わりに成行注文を使った場合と比べて、この人は何を犠牲にし、どんなリスクを避けたのでしょうか？",
    },
  },
  {
    id: 26, track: "money", icon: "📜", color: "#4c1d95",
    title: { en: "Estate Planning Basics: Wills and Beneficiary Designations", es: "Fundamentos de Planificación Patrimonial: Testamentos y Designaciones de Beneficiario", ko: "상속 계획의 기초: 유언장과 수익자 지정", zh: "遗产规划基础：遗嘱与受益人指定", ja: "遺産計画の基本：遺言書と受取人指定" },
    subtitle: { en: "A will decides less than most people think — beneficiary forms often decide more", es: "Un testamento decide menos de lo que la mayoría piensa — los formularios de beneficiario suelen decidir más", ko: "유언장이 결정하는 것은 생각보다 적고, 수익자 양식이 더 많이 결정합니다", zh: "遗嘱能决定的比大多数人想的要少——受益人表格往往决定得更多", ja: "遺言書が決めることは多くの人が思うより少なく、受取人フォームの方が決めることが多い" },
    sections: [
      {
        heading: { en: "A Will Isn't Just for the Wealthy", es: "Un Testamento No Es Solo para los Ricos", ko: "유언장은 부자만을 위한 것이 아니다", zh: "遗嘱不只是为富人准备的", ja: "遺言書は富裕層のためだけのものではない" },
        body: {
          en: "A will is a legal document that says who gets a person's belongings, money, and property after they die, and — for anyone with minor children — who would raise them. It's easy to assume a will only matters for someone with a large estate, but its real job is simpler: it lets a person's own wishes, not a default formula, decide what happens to what they leave behind.\n\nWithout a will, state law decides instead, through a process called intestate succession — a fixed formula (often splitting assets among a spouse and children in preset shares, or moving to more distant relatives if there's no immediate family) that applies the same way regardless of what the person would have actually wanted. It doesn't ask whether a couple was unmarried but together for decades, whether one child needed more support than another, or who the deceased would have actually chosen to raise their kids — it just follows the formula.\n\nA will doesn't have to be complicated to do its core job, and creating one is generally far less involved than most people assume — but the details (state-specific rules, notarization, witness requirements) are exactly the kind of thing that varies by location and situation, which is why this lesson explains what a will does rather than how to write one.",
          es: "Un testamento es un documento legal que indica quién recibe las pertenencias, el dinero y las propiedades de una persona después de morir, y — para quienes tienen hijos menores — quién los criaría. Es fácil suponer que un testamento solo importa para alguien con un patrimonio grande, pero su función real es más simple: deja que los deseos de la persona, no una fórmula predeterminada, decidan qué pasa con lo que deja atrás.\n\nSin testamento, la ley estatal decide en su lugar, mediante un proceso llamado sucesión intestada — una fórmula fija que se aplica de la misma manera sin importar lo que la persona realmente hubiera querido.\n\nUn testamento no tiene que ser complicado para cumplir su función principal, y crear uno suele ser mucho menos complejo de lo que la mayoría supone — pero los detalles varían según el lugar y la situación.",
          ko: "유언장은 사람이 죽은 후 그의 소지품, 돈, 재산을 누가 받을지, 그리고 미성년 자녀가 있다면 누가 그들을 양육할지를 정하는 법적 문서입니다. 유언장이 재산이 많은 사람에게만 중요하다고 생각하기 쉽지만, 실제 역할은 더 단순합니다: 정해진 공식이 아니라 본인의 뜻이 남긴 것을 어떻게 할지 결정하게 해주는 것입니다.\n\n유언장이 없으면 대신 주(州)법이 무유언 상속(intestate succession)이라는 절차를 통해 결정합니다 — 그 사람이 실제로 무엇을 원했는지와 상관없이 동일하게 적용되는 고정된 공식입니다.\n\n유언장이 핵심 역할을 하기 위해 복잡할 필요는 없으며, 작성하는 것은 대부분의 사람이 생각하는 것보다 훨씬 덜 복잡합니다 — 다만 세부 사항은 지역과 상황에 따라 다릅니다.",
          zh: "遗嘱是一份法律文件，规定一个人去世后其财物、金钱和财产由谁继承，以及——对于有未成年子女的人来说——由谁来抚养他们。人们很容易以为遗嘱只对拥有大量财产的人才重要，但它真正的作用更简单：让本人的意愿，而不是一套默认公式，来决定身后事的归属。\n\n如果没有遗嘱，州法律会通过一个叫做无遗嘱继承（intestate succession）的程序来代为决定——这是一套固定的公式，无论本人实际想要什么，都会以同样的方式适用。\n\n遗嘱要发挥其核心作用并不需要多复杂，立遗嘱通常也远比大多数人想象的简单——但具体细节因地区和情况而异。",
          ja: "遺言書とは、人が亡くなった後にその所持品、お金、財産を誰が受け取るか、そして未成年の子どもがいる場合は誰がその子を育てるかを定める法的文書です。遺言書は大きな財産を持つ人にだけ重要だと思われがちですが、その本当の役割はもっとシンプルです：既定の計算式ではなく、本人の意思が、残したものの行方を決めるようにすることです。\n\n遺言書がない場合、代わりに州法が「無遺言相続（intestate succession）」という手続きを通じて決定します——本人が実際に何を望んでいたかに関係なく、同じように適用される固定の計算式です。\n\n遺言書はその中心的な役割を果たすために複雑である必要はなく、作成すること自体は多くの人が思うよりもはるかに簡単です——ただし詳細は地域や状況によって異なります。",
        },
      },
      {
        heading: { en: "Beneficiary Designations Can Override a Will", es: "Las Designaciones de Beneficiario Pueden Anular un Testamento", ko: "수익자 지정이 유언장보다 우선할 수 있다", zh: "受益人指定可能凌驾于遗嘱之上", ja: "受取人指定は遺言書より優先されることがある" },
        body: {
          en: "Here's a detail that surprises a lot of people: a will doesn't control everything. Certain accounts — including the 401(k) and IRA accounts from Lesson 18 and the life insurance policies from Lesson 20 — pass directly to whoever is named as their beneficiary, regardless of what a will says. The account's own beneficiary designation wins, every time, even over a more recently written will that says something different.\n\nThis creates a specific, common, and entirely avoidable mistake: someone updates their will after a major life change — a divorce, a new child, a remarriage — but forgets that an old 401(k) or life insurance policy still lists an ex-spouse or an outdated beneficiary from years earlier. When that person dies, the account goes to whoever's name is on the beneficiary form, not whoever the will names or whoever the person would have actually wanted.\n\nThe practical takeaway isn't a specific instruction on what any one person's beneficiaries should be — that depends entirely on someone's own relationships and circumstances — but the mechanism itself: beneficiary forms are a separate, active decision from a will, and they don't update themselves just because life changed or a will was rewritten.",
          es: "Aquí hay un detalle que sorprende a muchos: un testamento no lo controla todo. Ciertas cuentas — incluidas las cuentas 401(k) e IRA de la Lección 18 y las pólizas de seguro de vida de la Lección 20 — pasan directamente a quien esté designado como beneficiario, sin importar lo que diga el testamento. La designación de beneficiario de la cuenta siempre gana, incluso sobre un testamento más reciente que diga algo distinto.\n\nEsto crea un error común y evitable: alguien actualiza su testamento tras un cambio importante — un divorcio, un nuevo hijo, un nuevo matrimonio — pero olvida que un 401(k) o seguro de vida antiguo todavía tiene como beneficiario a un ex-cónyuge.\n\nLa conclusión práctica no es una instrucción específica sobre quién debería ser el beneficiario de nadie — eso depende de las relaciones y circunstancias de cada persona — sino el mecanismo en sí: los formularios de beneficiario son una decisión separada y activa de un testamento, y no se actualizan solos.",
          ko: "많은 사람이 놀라는 부분이 있습니다: 유언장이 모든 것을 통제하지는 않는다는 점입니다. 18강의 401(k)와 IRA, 20강의 생명보험 같은 특정 계좌는 유언장의 내용과 상관없이 지정된 수익자에게 직접 전달됩니다. 계좌 자체의 수익자 지정이 항상 이깁니다, 심지어 다른 내용을 담은 더 최근의 유언장보다도요.\n\n이는 흔하고 충분히 피할 수 있는 실수를 만듭니다: 이혼, 새 자녀, 재혼 같은 큰 변화 이후 유언장은 업데이트했지만, 오래된 401(k)나 생명보험에는 여전히 전 배우자가 수익자로 남아 있는 경우입니다.\n\n실용적인 결론은 누구의 수익자가 누구여야 한다는 구체적인 지시가 아니라 — 그것은 각자의 관계와 상황에 달려 있습니다 — 그 메커니즘 자체입니다: 수익자 지정은 유언장과는 별개의, 능동적인 결정이며 삶이 바뀌었다고 저절로 업데이트되지 않습니다.",
          zh: "有一个细节会让很多人感到惊讶：遗嘱并不能控制一切。某些账户——包括第18课的401(k)和IRA账户，以及第20课的人寿保险单——会直接转给被指定的受益人，无论遗嘱怎么写。账户自身的受益人指定始终优先，哪怕遗嘱更晚写成、写的内容不同也是如此。\n\n这就造成了一个常见且完全可以避免的错误：有人在离婚、添丁或再婚等重大变化后更新了遗嘱，却忘了自己多年前开设的401(k)或人寿保险仍把前配偶列为受益人。\n\n这里的实用要点并不是告诉任何人该把谁设为受益人——那完全取决于每个人自己的关系和情况——而是这个机制本身：受益人表格是与遗嘱分开、需要主动去做的决定，不会因为生活发生变化或遗嘱重写而自动更新。",
          ja: "ここに多くの人が驚く点があります：遺言書がすべてを支配するわけではないということです。第18課の401(k)やIRA、第20課の生命保険といった特定の口座は、遺言書の内容に関係なく、指定された受取人に直接渡ります。口座自体の受取人指定は、たとえ異なる内容を記した、より新しい遺言書があっても、常に優先されます。\n\nこれは、よくある、そして十分避けられる間違いを生みます：離婚、新しい子ども、再婚といった大きな変化の後に遺言書を更新したものの、何年も前に加入した401(k)や生命保険には元配偶者が受取人として残ったままになっているというケースです。\n\nここでの実用的な結論は、誰の受取人を誰にすべきかという具体的な指示ではなく——それは各自の関係や状況によって完全に異なります——その仕組み自体です：受取人指定は遺言書とは別の、能動的な決定であり、人生が変わったり遺言書が書き直されたりしても自動的には更新されません。",
        },
      },
    ],
    takeaway: {
      en: "A will directs how someone's belongings and money are distributed and who raises their children — without one, a fixed legal formula decides instead. But retirement and insurance accounts bypass a will entirely: whoever is named on the account's own beneficiary form gets it, so an outdated beneficiary designation can override even a brand-new will.",
      es: "Un testamento dirige cómo se distribuyen las pertenencias y el dinero de alguien y quién cría a sus hijos — sin uno, una fórmula legal fija decide en su lugar. Pero las cuentas de jubilación y seguro pasan por alto el testamento por completo: quien esté designado en el formulario de beneficiario de la cuenta la recibe, así que una designación desactualizada puede anular incluso un testamento recién escrito.",
      ko: "유언장은 누군가의 소지품과 돈이 어떻게 분배되고 누가 자녀를 양육할지를 정합니다 — 없으면 고정된 법적 공식이 대신 결정합니다. 하지만 은퇴 계좌와 보험은 유언장을 완전히 건너뛰어, 계좌 자체의 수익자 지정에 이름이 있는 사람이 받습니다. 그래서 오래된 수익자 지정이 새로 쓴 유언장조차 무력화할 수 있습니다.",
      zh: "遗嘱决定一个人的财物和金钱如何分配、由谁抚养子女——没有遗嘱时，一套固定的法律公式会代为决定。但退休账户和保险会完全绕过遗嘱：账户自身受益人表格上填的是谁，谁就能获得，因此一个过时的受益人指定甚至可以推翻一份全新的遗嘱。",
      ja: "遺言書は、人の所持品やお金がどう分配され、誰が子どもを育てるかを定めます——それがない場合、固定の法的計算式が代わりに決定します。しかし退職口座や保険は遺言書を完全に迂回します：口座自体の受取人指定に名前がある人が受け取るため、古い受取人指定は新しく書かれた遺言書さえも上書きしてしまうことがあります。",
    },
    thinkAbout: {
      en: "Someone gets divorced, rewrites their will to leave everything to their new spouse, but never updates the beneficiary designation on the 401(k) they opened years earlier (Lesson 18) — it still lists their ex-spouse. Based on this lesson, who actually receives that 401(k) when they die?",
      es: "Alguien se divorcia, reescribe su testamento para dejarle todo a su nuevo cónyuge, pero nunca actualiza la designación de beneficiario del 401(k) que abrió años antes (Lección 18) — todavía figura su ex-cónyuge. Según esta lección, ¿quién recibe realmente ese 401(k) cuando esa persona muere?",
      ko: "누군가 이혼 후 새 배우자에게 모든 것을 남기도록 유언장을 다시 썼지만, 몇 년 전에 연 401(k)(18강)의 수익자 지정은 업데이트하지 않았습니다 — 여전히 전 배우자가 남아 있습니다. 이 강의에 따르면, 이 사람이 사망하면 그 401(k)는 실제로 누가 받게 될까요?",
      zh: "有人离婚后重写了遗嘱，把一切留给新配偶，但从未更新多年前开设的401(k)（第18课）上的受益人指定——上面仍然写着前配偶的名字。根据本课内容，这个人去世后，那笔401(k)实际上会归谁？",
      ja: "ある人が離婚後、新しい配偶者にすべてを残すよう遺言書を書き直しましたが、何年も前に開設した401(k)（第18課）の受取人指定は更新しませんでした——今も元配偶者のままです。この講の内容に基づくと、この人が亡くなったとき、実際にその401(k)を受け取るのは誰でしょうか？",
    },
  },
];

// Estimated reading time for a lesson, always based on the English body text
// regardless of the active UI language. Translation volume varies a lot by
// language (see the Beta-labelling note in AGENT_LOG.md — es/ko/zh/ja run
// 12-37% of English length as of the 2026-08-05 re-measurement), so
// per-language word counts would make the
// same lesson claim a wildly different "≈N min" depending on locale. Using
// English as the fixed yardstick keeps the estimate stable and comparable
// across lessons.
export function estimateMinutes(lesson) {
  const words = [
    ...lesson.sections.map((s) => s.body.en),
    lesson.takeaway.en,
    lesson.thinkAbout.en,
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
