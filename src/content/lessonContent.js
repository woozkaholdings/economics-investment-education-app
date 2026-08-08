// ═══════════════════════════════════════════════════════════════════════════
// LESSON CONTENT (heavy per-lesson body)
//
// Split out of content/lessons.js on 2026-08-07 (backlog item 23): this file
// holds the bulk of every lesson's text — the sections readers actually read,
// the takeaway, and the think-about-this prompt — keyed by lesson id. It is
// imported ONLY by the lazy-loaded LessonReader screen, so its ~250KB never
// rides in the main bundle everyone downloads before opening a lesson.
//
// lessons.js keeps the lightweight metadata (id, track, icon, color, title,
// subtitle, minutes) that Learn/App need to render the path itself. Every
// lesson id here must have a matching id in lessons.js and vice versa —
// scripts/check-data.mjs enforces that, plus that the `minutes` field in
// lessons.js still matches a fresh word count of this file's content, so the
// two files can't silently drift apart.
// ═══════════════════════════════════════════════════════════════════════════

export const lessonContent = {
  1: {
    "sections": [
      {
        "heading": {
          "en": "What is a Transaction?",
          "es": "¿Qué es una Transacción?",
          "ko": "거래란 무엇인가?",
          "zh": "什么是交易？",
          "ja": "取引とは？"
        },
        "body": {
          "en": "Picture the last coffee you bought. You handed over money — or tapped a card — and got a cup of coffee in return. That's a transaction: a buyer exchanging money or credit with a seller for something of value. Zoom out, and an entire economy is nothing more mysterious than millions of trades like that happening at once: someone buying groceries, a company buying office chairs, a city buying asphalt to repave a road.\n\nHere's the part that trips people up: you didn't need actual cash for that coffee. Tap a credit card instead, and you've still bought it — you just paid with credit instead of money, and the barista's employer got paid all the same. That's why credit spends exactly like money: Total Spending = Money Spent + Credit Spent.\n\nTotal spending is what drives the whole economy, and there's a simple, almost mechanical way prices come from it: divide the total amount spent on something by how much of it was sold. If shoppers spend $500 on 100 loaves of bread at the same bakery, the price per loaf is $5. That's it — that's a transaction, repeated billions of times a day, adding up to an entire economy.",
          "es": "Una economía es simplemente la suma de todas las transacciones. Cada transacción es un comprador intercambiando dinero o crédito con un vendedor por bienes, servicios o activos financieros.\n\nEl crédito se gasta igual que el dinero. Gasto Total = Dinero + Crédito.\n\nEl gasto total impulsa la economía.",
          "ko": "경제는 모든 거래의 합입니다. 각 거래는 구매자가 돈이나 신용을 판매자에게 상품, 서비스, 금융자산과 교환하는 것입니다.\n\n신용은 돈처럼 사용됩니다. 총 지출 = 돈 지출 + 신용 지출.\n\n총 지출이 경제를 움직입니다.",
          "zh": "经济就是所有交易的总和。每笔交易都是买方用货币或信贷与卖方交换商品、服务或金融资产。\n\n信贷和货币一样可以消费。总支出 = 货币支出 + 信贷支出。\n\n总支出驱动经济。",
          "ja": "経済は全ての取引の合計です。各取引は、買い手がお金や信用を売り手に支払い、商品やサービスを得ること。\n\n信用はお金と同じように使えます。総支出 = お金 + 信用。\n\n総支出が経済を動かします。"
        }
      },
      {
        "heading": {
          "en": "Markets and the Economy",
          "es": "Mercados y la Economía",
          "ko": "시장과 경제",
          "zh": "市场与经济",
          "ja": "市場と経済"
        },
        "body": {
          "en": "A market is just all the buyers and sellers trading the same thing — everyone buying and selling wheat forms the wheat market; everyone trading a company's stock forms the market for that stock. Put every market together — food, cars, houses, stocks, labor, everything — and you have the whole economy.\n\nHouseholds, businesses, and banks all take part, but the biggest buyer and seller of all is the government, which plays two very different roles:\n\n• Central Government — collects taxes and decides how to spend them, on things like roads, schools, and defense\n• Central Bank — doesn't tax or spend directly. Instead it controls money and credit, mainly by setting interest rates and, in extreme situations, by creating new money",
          "es": "Un mercado son todos los compradores y vendedores haciendo transacciones por lo mismo. Una economía consiste en todas las transacciones en todos los mercados.\n\nEl gobierno es el mayor comprador y vendedor, con dos partes:\n• Gobierno Central — recauda impuestos, gasta\n• Banco Central — controla dinero y crédito",
          "ko": "시장은 같은 것을 거래하는 모든 구매자와 판매자입니다. 경제는 모든 시장의 모든 거래로 구성됩니다.\n\n정부가 가장 큰 구매자이자 판매자입니다:\n• 중앙정부 — 세금 징수, 지출\n• 중앙은행 — 금리와 화폐 발행으로 돈과 신용 통제",
          "zh": "市场就是所有买卖同一种东西的人。经济由所有市场的所有交易组成。\n\n政府是最大的买卖方：\n• 中央政府——收税、支出\n• 中央银行——通过利率和印钞控制货币信贷",
          "ja": "市場は同じものを取引する全ての売り手と買い手。経済は全市場の全取引で構成。\n\n政府が最大の買い手かつ売り手：\n• 中央政府：税を集め支出\n• 中央銀行：金利と紙幣印刷でお金と信用を管理"
        }
      }
    ],
    "takeaway": {
      "en": "If you can understand a single transaction — one buyer, one seller, money or credit changing hands — you already hold the seed of the whole economy. Everything in this course is just that same idea, repeated at a bigger and bigger scale.",
      "es": "Si entendemos las transacciones, entendemos toda la economía.",
      "ko": "거래를 이해하면 경제 전체를 이해할 수 있습니다. 모든 것은 여기서 시작됩니다.",
      "zh": "理解了交易，就理解了整个经济。一切从这里开始。",
      "ja": "取引を理解すれば、経済全体を理解できます。"
    },
    "thinkAbout": {
      "en": "Think about the last thing you bought, even something small like a snack. You exchanged money or credit for it, and that payment became someone else's income — the cashier's wage, the store's revenue, the supplier who stocked the shelf. Can you trace where your money went next?",
      "es": "Piensa en tu última compra. Intercambiaste dinero por algo. Esa transacción se convirtió en el ingreso de alguien más.",
      "ko": "마지막 구매를 생각해보세요. 돈(또는 신용)을 무언가와 교환했습니다. 그 거래는 다른 사람의 소득이 되었습니다.",
      "zh": "想想你上次的购买。你用钱（或信贷）换了某样东西。那笔交易成了别人的收入。",
      "ja": "最後の買い物を思い出してください。お金（または信用）を何かと交換しました。その取引は誰かの収入になりました。"
    }
  },
  2: {
    "sections": [
      {
        "heading": {
          "en": "How Credit Works",
          "es": "Cómo Funciona el Crédito",
          "ko": "신용의 작동 원리",
          "zh": "信贷如何运作",
          "ja": "信用の仕組み"
        },
        "body": {
          "en": "Say you want to buy a $20,000 car but only have $5,000 saved. A lender — a bank, a credit union, or the dealership itself — offers you a loan: they hand you $15,000 now, and you promise to pay it back over time, plus interest as their fee for taking the risk.\n\nThe moment you sign that promise, and the lender believes you'll keep it, $15,000 of brand-new credit is created out of thin air — nobody had to save it first. You drive off with the car; the lender now holds an asset (you owe them money), and you hold a liability (you owe it).\n\nInterest rates decide how expensive that promise is. When rates are high → borrowing costs more → fewer people take out loans. When rates are low → borrowing is cheap → more people do. That's exactly the lever the Federal Reserve uses to speed up or slow down the whole economy (more on that in Lesson 7).",
          "es": "Los prestamistas quieren más dinero. Los prestatarios quieren comprar algo que no pueden pagar ahora.\n\nCuando los prestatarios prometen pagar y los prestamistas les creen, ¡el crédito se crea de la nada!\n\nTasas altas → menos préstamos\nTasas bajas → más préstamos",
          "ko": "대출자는 돈을 더 많은 돈으로 만들고 싶어합니다. 차입자는 지금 살 수 없는 것을 사고 싶어합니다.\n\n차입자가 상환을 약속하고 대출자가 이를 믿으면, 신용이 무에서 만들어집니다!\n\n금리가 높으면 → 차입 감소\n금리가 낮으면 → 차입 증가",
          "zh": "放贷者想让钱生更多钱。借款者想买现在买不起的东西。\n\n当借款者承诺还款，放贷者相信时，信贷就凭空创造了！\n\n利率高 → 借贷减少\n利率低 → 借贷增加",
          "ja": "貸し手はお金を増やしたい。借り手は今買えないものを買いたい。\n\n借り手が返済を約束し貸し手が信じると、信用が無から生まれます！\n\n金利が高い → 借入減少\n金利が低い → 借入増加"
        }
      },
      {
        "heading": {
          "en": "Credit vs Money",
          "es": "Crédito vs Dinero",
          "ko": "신용 vs 돈",
          "zh": "信贷 vs 货币",
          "ja": "信用 vs お金"
        },
        "body": {
          "en": "Money settles a transaction on the spot. Hand a bartender $8 cash for a beer, and the deal is completely done — nobody owes anybody anything.\n\nCredit works differently. It's like running a tab at that same bar: you drink now and promise to pay when you close out later. The moment the bartender agrees to that tab, an asset and a liability were just created out of thin air — the bar is owed money, you owe the bar money — even though no cash changed hands yet.\n\nNow multiply that bar tab by every mortgage, car loan, credit card balance, and business loan in the country, and you reach a surprising reality: most of what people casually call \"money\" is actually credit. In the US, total credit outstanding is many times larger than the base money supply — a gap that has only widened over time as the economy has grown.",
          "es": "El dinero cierra transacciones inmediatamente. El crédito es como una cuenta de bar — prometes pagar después.\n\nLa realidad: la mayoría del \"dinero\" es crédito. En EE.UU., el crédito total supera muchas veces la oferta de dinero base, una brecha que ha crecido con el tiempo.",
          "ko": "돈은 거래를 즉시 완결합니다. 신용은 바 탭과 같습니다 — 나중에 지불하겠다는 약속입니다.\n\n놀라운 현실: 사람들이 \"돈\"이라고 부르는 것의 대부분은 사실 신용입니다. 미국의 총 신용은 기초 통화량보다 훨씬 크며, 이 격차는 경제가 성장하며 계속 커져왔습니다.",
          "zh": "货币立即结算交易。信贷像酒吧记账——你承诺以后付。\n\n惊人的现实：人们所说的\"钱\"大部分实际是信贷。美国总信贷规模是基础货币供应量的许多倍，且随着经济增长这一差距不断扩大。",
          "ja": "お金は取引を即座に決済。信用はバーのツケ。後で払うと約束する。\n\n驚くべき現実：人々が「お金」と呼ぶものの大半は実は信用です。米国の総信用残高は基礎マネーサプライの何倍にも達し、経済成長とともにその差は広がり続けています。"
        }
      },
      {
        "heading": {
          "en": "The Spending Chain",
          "es": "La Cadena de Gasto",
          "ko": "지출의 연쇄",
          "zh": "支出链条",
          "ja": "支出の連鎖"
        },
        "body": {
          "en": "Why does credit matter so much? Because borrowing lets you spend more than your income alone would allow — and one person's spending is always someone else's income.\n\nSay a homeowner borrows to renovate a kitchen. That money becomes the contractor's income. The contractor, now earning more, looks more creditworthy to a lender and borrows to buy a new work truck. That purchase becomes the truck dealer's income — and the chain keeps going.\n\nMore spending → more income → more creditworthy borrowers → more borrowing → more spending, and so on. This self-reinforcing loop runs in both directions — it's exactly why economies move in booms and busts instead of growing in a straight line.",
          "es": "¿Por qué importa el crédito? Porque cuando gastas más, alguien gana más.\n\nMás gasto → más ingreso → más crédito → más préstamos → más gasto. Este patrón auto-reforzante crea los ciclos económicos.",
          "ko": "신용이 왜 중요할까요? 신용으로 더 많이 쓸 수 있고, 한 사람의 지출은 다른 사람의 소득이기 때문입니다.\n\n더 많은 지출 → 더 많은 소득 → 더 높은 신용도 → 더 많은 차입 → 더 많은 지출. 이 자기 강화 패턴이 경제 순환을 만듭니다.",
          "zh": "为什么信贷如此重要？因为有了信贷你就能花更多，而一个人的支出就是另一个人的收入。\n\n更多支出 → 更多收入 → 更高信用 → 更多借贷 → 更多支出。这个自我强化的模式就是经济周期的原因。",
          "ja": "なぜ信用が重要か？信用で支出が増え、誰かの支出は別の誰かの収入だから。\n\n支出増 → 収入増 → 信用力向上 → 借入増 → 支出増。この自己強化パターンが経済サイクルを生みます。"
        }
      }
    ],
    "takeaway": {
      "en": "Credit creates a self-reinforcing loop in BOTH directions — one person's borrowing fuels another's income, which fuels more borrowing, all the way up in a boom and all the way down in a bust.",
      "es": "El crédito crea ciclos auto-reforzantes en AMBAS direcciones — auges Y caídas.",
      "ko": "신용은 양 방향으로 자기 강화 순환을 만듭니다 — 호황과 불황 모두.",
      "zh": "信贷在两个方向都创造自我强化的周期——繁荣和衰退。",
      "ja": "信用は両方向に自己強化サイクルを作る — 好景気も不景気も。"
    },
    "thinkAbout": {
      "en": "Imagine you borrow $10,000 to start a small business and spend it on equipment and a first month's rent. That money becomes the equipment seller's and the landlord's income — and now they can spend or borrow more too. Can you trace how that single loan ripples outward into growth for other people?",
      "es": "Si pides prestado $10,000 y los gastas, eso se convierte en ingreso de alguien. ¿Ves cómo el crédito crea crecimiento?",
      "ko": "$10,000을 빌려 쓰면 그것은 누군가의 소득이 됩니다. 그들도 이제 더 빌릴 수 있습니다. 신용이 어떻게 성장을 만드는지 보이시나요?",
      "zh": "如果你借了10,000美元并花掉，那就成了别人的收入。他们现在也能借更多。你能看到信贷如何创造增长吗？",
      "ja": "1万ドル借りて使えば、それは誰かの収入になります。その人も借入できる。信用が成長を生む仕組みが見えますか？"
    }
  },
  3: {
    "sections": [
      {
        "heading": {
          "en": "Productivity vs Credit",
          "es": "Productividad vs Crédito",
          "ko": "생산성 vs 신용",
          "zh": "生产力 vs 信贷",
          "ja": "生産性 vs 信用"
        },
        "body": {
          "en": "Think about a farmer who learns a better crop rotation, or a factory that adopts a machine that lets one worker do the work of three. Each small improvement in know-how and technology raises how much value people can create with the same time and effort. Multiply that across a whole economy over decades, and you get productivity growth — the slow, steady climb in living standards.\n\nProductivity matters most in the long run, but credit matters most in the short run. Here's why: productivity grows in a fairly straight, gentle line — a farmer doesn't get twice as skilled overnight. But borrowing swings wildly, because credit lets people consume MORE than they produce today (when they borrow) and LESS than they produce later (when they pay it back).\n\nWithout credit, the only way an economy grows is by becoming more productive — slow and steady. Add credit to the mix, and you get cycles: bursts of borrowing-fueled growth followed by periods of paying it back.",
          "es": "La productividad importa más a largo plazo, pero el crédito importa más a corto plazo.\n\nLa productividad crece de forma estable. El crédito fluctúa salvajemente, creando ciclos.",
          "ko": "생산성은 장기적으로 가장 중요하지만, 신용은 단기적으로 가장 중요합니다.\n\n생산성 성장은 크게 변동하지 않습니다. 하지만 부채는 크게 흔들립니다 — 빌릴 때 생산 이상으로 소비하고, 갚을 때 생산 이하로 소비하기 때문입니다.",
          "zh": "生产力长期最重要，但信贷短期最重要。\n\n生产力增长不会大幅波动。但债务剧烈波动——借债时消费超过生产，还债时消费低于生产。",
          "ja": "生産性は長期的に最も重要で、信用は短期的に最も重要。\n\n生産性成長は大きく変動しない。しかし債務は大きく揺れる — 借りる時は生産以上に消費し、返す時は以下になる。"
        }
      },
      {
        "heading": {
          "en": "Good Debt vs Bad Debt",
          "es": "Deuda Buena vs Deuda Mala",
          "ko": "좋은 부채 vs 나쁜 부채",
          "zh": "好债 vs 坏债",
          "ja": "良い借金 vs 悪い借金"
        },
        "body": {
          "en": "Credit isn't inherently good or bad — it depends entirely on what the money is used for.\n\nTake two people who each borrow $15,000. One spends it on a lavish vacation and a new television. It was fun for a while, but it created no new income — the debt has to be repaid entirely out of whatever they were already earning, now stretched thinner.\n\nThe other borrows the same amount for a tractor on their small farm. The tractor lets them harvest more crops, sell more at market, and earn more income — enough, over time, to pay back the loan AND come out ahead. Same size loan, opposite outcome.\n\nThe question to ask about any debt — a car loan, a business loan, a student loan — is always the same: will the borrowed money generate enough extra income to pay itself back? If yes, it's productive debt. If no, it's just borrowing from your future self for something that doesn't pay you back.",
          "es": "El crédito no es necesariamente malo. Depende de cómo se use:\n\nMALO: Pedir prestado para un TV grande.\nBUENO: Pedir prestado para un tractor que te ayude a ganar más.",
          "ko": "신용은 반드시 나쁜 것이 아닙니다. 사용 방법에 따라 다릅니다:\n\n나쁨: 큰 TV를 사기 위한 대출 — 소득을 만들지 못합니다.\n좋음: 트랙터를 사기 위한 대출 — 더 많은 작물을 수확하고 부채를 갚을 수 있습니다.",
          "zh": "信贷不一定是坏事，取决于怎么用：\n\n坏的：借钱买大电视——不能产生收入还债。\n好的：借钱买拖拉机——能收获更多庄稼、赚更多钱、还清债务。",
          "ja": "信用は必ずしも悪くない。使い方次第：\n\n悪い：大きなTVのための借金 — 収入を生まない。\n良い：トラクターのための借金 — 作物を増やし収入を生む。"
        }
      }
    ],
    "takeaway": {
      "en": "Borrowing is pulling spending forward from your future self — like the farmer's tractor loan repaid out of next season's harvest. Every time you borrow, you create a cycle, and that's true whether you're one household or an entire economy.",
      "es": "Pedir prestado es adelantar gasto de tu futuro. Cada vez que pides prestado, creas un ciclo.",
      "ko": "차입은 미래의 자신에게서 지출을 앞당기는 것입니다. 빌릴 때마다 순환이 만들어집니다.",
      "zh": "借钱就是从未来的自己那里提前支出。每次借钱都创造一个周期。",
      "ja": "借金は未来の自分から支出を前借りすること。借りるたびにサイクルが生まれる。"
    },
    "thinkAbout": {
      "en": "If you borrow from your future self to spend more today, there MUST come a time when you have less left over to spend — that's simple arithmetic. Now imagine millions of people and businesses all doing this on their own schedules. That's why credit creates cycles across an entire economy — up, then down.",
      "es": "Si pides prestado de tu futuro, DEBE haber un momento en que gastes menos.",
      "ko": "지금 쓰기 위해 미래에서 빌리면, 반드시 덜 쓰는 시기가 옵니다. 그래서 신용이 순환을 만듭니다.",
      "zh": "如果从未来借来花，必然有一天要少花。这就是信贷创造周期的原因。",
      "ja": "未来の自分から借りて今使うなら、必ず少なく使う時期が来る。だから信用はサイクルを作る。"
    }
  },
  4: {
    "sections": [
      {
        "heading": {
          "en": "Expansion Phase",
          "es": "Fase de Expansión",
          "ko": "확장 국면",
          "zh": "扩张阶段",
          "ja": "拡大局面"
        },
        "body": {
          "en": "Imagine a town where a new factory opens and hires hundreds of workers. Those workers now have paychecks to spend — at restaurants, on cars, at the hardware store. Restaurant owners hire more staff to keep up; the car dealer orders more inventory. This is expansion: spending increases, and because credit can be created instantly (Lesson 2), people borrow to spend even more than their paychecks alone would allow.\n\nBut there's a limit to how many meals a town's restaurants can actually cook in a day. When spending and incomes grow faster than the town can really produce, businesses respond by raising prices instead of magically producing more — that's inflation.\n\nThe Central Bank doesn't want inflation running too hot, so it raises interest rates. Higher rates mean the factory worker's car loan gets pricier, fewer people take out new loans, and existing variable-rate debts cost more to service — all of which cools spending back down.",
          "es": "La actividad económica aumenta. El gasto sube, los precios suben. El banco central sube tasas para controlar la inflación.",
          "ko": "경제 활동이 증가하면 확장기가 시작됩니다. 지출이 늘고 가격이 오릅니다.\n\n지출과 소득이 생산보다 빠르게 증가하면 → 가격 상승 → 이것이 인플레이션입니다.\n\n중앙은행은 과도한 인플레이션을 원하지 않아 금리를 올립니다.",
          "zh": "经济活动增加时出现扩张。支出增加，价格上涨。\n\n当支出增长快于生产 → 价格上涨 → 这就是通胀。\n\n央行不想通胀太高，所以加息。",
          "ja": "経済活動が増加すると拡大期。支出が増え、価格が上がる。\n\n支出の伸びが生産を上回ると → 物価上昇 → インフレ。\n\n中央銀行は過度なインフレを防ぐため金利を上げる。"
        }
      },
      {
        "heading": {
          "en": "Contraction & Recession",
          "es": "Contracción y Recesión",
          "ko": "수축과 경기침체",
          "zh": "收缩与衰退",
          "ja": "収縮と景気後退"
        },
        "body": {
          "en": "Back in that same town, higher rates mean the factory worker skips the car loan and cuts back on eating out. The restaurant, seeing fewer customers, cuts a server's hours — and that server now has less to spend at the hardware store. Because one person's spending is another's income, this pullback ripples outward: incomes drop, and spending drops even further in response.\n\nWhen enough people across the economy spend less, businesses start cutting prices to attract customers — that's deflation — and overall economic activity shrinks. That's a recession.\n\nIf things get bad enough, the central bank reverses course and lowers interest rates again. Cheaper borrowing brings the factory worker back to the car lot, spending picks up, and a new expansion begins. This up-and-down cycle repeats roughly every 5-8 years, steered mostly by the central bank's interest-rate decisions.",
          "es": "Tasas más altas → menos préstamos → menos gasto → menos ingresos → recesión.\n\nSi es grave, el banco central baja tasas. Tasas bajas → más gasto → otra expansión. El ciclo se repite cada 5-8 años.",
          "ko": "높은 금리 → 차입 감소 → 지출 감소 → 소득 감소 → 경기침체.\n\n심각해지면 중앙은행이 금리를 다시 낮춥니다. 낮은 금리 → 더 많은 지출 → 다시 확장. 이 순환은 5-8년마다 반복됩니다.",
          "zh": "利率升高 → 借贷减少 → 支出减少 → 收入下降 → 衰退。\n\n如果衰退太严重，央行降息。低利率 → 更多支出 → 新的扩张。这个周期每5-8年重复一次。",
          "ja": "金利上昇 → 借入減 → 支出減 → 収入減 → 景気後退。\n\n深刻なら中央銀行が利下げ。低金利 → 支出増 → 新たな拡大。5-8年ごとに繰り返す。"
        }
      }
    ],
    "takeaway": {
      "en": "The economy works like a machine. When credit is easy → expansion. When credit tightens → recession. The central bank controls the cycle by raising and lowering rates.",
      "es": "La economía funciona como una máquina. Crédito fácil → expansión. Crédito restringido → recesión.",
      "ko": "경제는 기계처럼 작동합니다. 신용이 쉬우면 → 확장. 신용이 조여지면 → 경기침체. 중앙은행이 금리로 순환을 통제합니다.",
      "zh": "经济像机器一样运转。信贷宽松 → 扩张。信贷收紧 → 衰退。央行通过调整利率控制周期。",
      "ja": "経済は機械のように動く。信用が簡単 → 拡大。信用が引き締まる → 後退。中央銀行が金利で制御。"
    },
    "thinkAbout": {
      "en": "Notice how each cycle's bottom and top finish with MORE growth and MORE debt than the previous one. People tend to borrow and spend more over time — it's human nature. What do you think happens when this accumulates over decades?",
      "es": "Nota cómo cada ciclo termina con MÁS deuda que el anterior. ¿Qué pasa cuando esto se acumula durante décadas?",
      "ko": "각 순환의 바닥과 꼭대기가 이전보다 더 많은 성장과 더 많은 부채로 끝난다는 점에 주목하세요. 이것이 수십 년 동안 누적되면 어떻게 될까요?",
      "zh": "注意每个周期的底部和顶部都比上一个有更多增长和更多债务。当这种情况持续几十年会怎样？",
      "ja": "各サイクルの底と頂上が前回より多くの成長と多くの借金で終わることに注目。数十年蓄積するとどうなると思いますか？"
    }
  },
  5: {
    "sections": [
      {
        "heading": {
          "en": "How Debt Accumulates",
          "es": "Cómo se Acumula la Deuda",
          "ko": "부채가 축적되는 방식",
          "zh": "债务如何累积",
          "ja": "借金の蓄積"
        },
        "body": {
          "en": "Picture a neighborhood where home prices have risen every year for a decade. A family buys a house not just to live in, but because they're confident it'll be worth more next year — so they stretch their budget and take out the biggest mortgage a bank will approve. Across many short-term cycles like the one in Lesson 4, this happens over and over: debts rise faster than incomes, because human nature favors borrowing and spending more today over paying down debt.\n\nLenders keep lending freely through all of this, because everyone can see the evidence with their own eyes — incomes are rising, home values are up, the stock market is roaring. Confidence feeds on itself.\n\nWhen enough people borrow heavily to buy an asset — houses, stocks, anything — purely because they expect the price to keep rising, that pushes prices higher still. That's a bubble.\n\nAs long as incomes keep rising too, the debt burden (the ratio of what's owed to what's earned) looks manageable. But nothing rises forever, and that's exactly the problem.",
          "es": "A lo largo de muchos ciclos cortos, la deuda crece más rápido que los ingresos. La gente prefiere gastar que pagar deuda.\n\nCuando la gente pide mucho prestado para comprar activos como inversión, eso es una burbuja.",
          "ko": "여러 단기 순환을 거치면서 부채가 소득보다 빠르게 증가합니다. 사람들이 부채를 갚기보다 더 빌리고 쓰는 것을 선호하기 때문입니다.\n\n사람들이 투자로 자산을 사기 위해 많이 빌리면 — 그것이 버블입니다. 하지만 이것은 영원히 계속될 수 없습니다.",
          "zh": "经过许多短期周期，债务增长快于收入。人们更愿意借钱消费而非还债。\n\n当人们大量借钱购买资产投资，推动价格越来越高——这就是泡沫。但这不可能永远持续。",
          "ja": "多くの短期サイクルの中で、債務は所得より速く増加。人は返済より借入・消費を好むから。\n\n資産を買うために大量に借りる時 — それがバブル。しかし永遠には続かない。"
        }
      },
      {
        "heading": {
          "en": "The Peak & Deleveraging",
          "es": "El Pico y Desapalancamiento",
          "ko": "정점과 디레버리징",
          "zh": "顶峰与去杠杆",
          "ja": "ピークとデレバレッジング"
        },
        "body": {
          "en": "Eventually, the family from our example finds their mortgage payment eating up more of their paycheck every year, while their home's value stops climbing. They cut back on other spending to keep up. Multiply that family by millions, and incomes across the economy fall, people look less creditworthy to lenders, borrowing dries up, and the whole cycle reverses. This is the long-term debt peak.\n\nThis is the pattern behind some of history's most painful downturns: the US in 2008, Japan in 1989, and the US in 1929.\n\nIn a deleveraging, spending falls, credit disappears, asset prices — including that family's house — drop, banks get squeezed as borrowers can't repay, the stock market crashes, and social tensions rise.\n\nThe key difference from an ordinary recession: interest rates can't ride to the rescue, because by this point they're often already close to 0%.",
          "es": "Eventualmente, los pagos de deuda crecen más rápido que los ingresos. Esto pasó en EE.UU. en 2008, Japón en 1989 y EE.UU. en 1929.\n\nEn un desapalancamiento, las tasas de interés no pueden salvar la situación porque ya están en 0%.",
          "ko": "결국 부채 상환이 소득보다 빠르게 증가합니다. 미국 2008년, 일본 1989년, 미국 1929년에 발생했습니다.\n\n디레버리징에서는 금리가 이미 0%이기 때문에 금리 인하로는 해결할 수 없습니다.",
          "zh": "最终，还债增长快于收入。美国2008年、日本1989年、美国1929年都发生过。\n\n去杠杆时，利率已经是0%，无法通过降息解决。",
          "ja": "最終的に債務返済が所得より速く増加。米国2008年、日本1989年、米国1929年に起きた。\n\nデレバレッジでは金利がすでに0%なので利下げでは解決できない。"
        }
      }
    ],
    "takeaway": {
      "en": "The long-term debt cycle builds over 75-100 years. When it peaks, normal rate cuts can't fix it. This is fundamentally different from a regular recession.",
      "es": "El ciclo largo se construye en 75-100 años. Cuando alcanza su pico, los recortes de tasas normales no funcionan.",
      "ko": "장기 부채 순환은 75-100년에 걸쳐 형성됩니다. 정점에 도달하면 일반적인 금리 인하로는 해결할 수 없습니다.",
      "zh": "长期债务周期在75-100年间积累。到达顶峰时，普通降息无法解决。",
      "ja": "長期債務サイクルは75-100年かけて形成。ピーク時は通常の利下げでは解決できない。"
    },
    "thinkAbout": {
      "en": "The US debt-to-GDP ratio has climbed well past 100% in recent decades. People feel wealthy because assets keep going up. Does this sound like the late stage of a long-term debt cycle to you?",
      "es": "La ratio deuda/PIB de EE.UU. ha superado el 100% en las últimas décadas. ¿Suena como la etapa tardía de un ciclo largo?",
      "ko": "최근 수십 년간 미국의 GDP 대비 부채 비율은 100%를 훌쩍 넘어섰습니다. 이것이 장기 부채 순환의 후기 단계처럼 들리시나요?",
      "zh": "近几十年美国债务/GDP比率已远超100%。这听起来像长期债务周期的后期阶段吗？",
      "ja": "近年、米国の債務/GDP比率は100%を大きく超えています。長期債務サイクルの後期段階に聞こえますか？"
    }
  },
  6: {
    "sections": [
      {
        "heading": {
          "en": "The 4 Ways to Reduce Debt Burden",
          "es": "Las 4 Formas de Reducir la Carga de Deuda",
          "ko": "부채 부담을 줄이는 4가지 방법",
          "zh": "减轻债务负担的4种方式",
          "ja": "債務負担を軽減する4つの方法"
        },
        "body": {
          "en": "When a household — or an entire country — has taken on too much debt, there are really only four levers anyone can pull:\n\n1. CUT SPENDING (Austerity). Think of a city government facing a budget shortfall that lays off workers and cancels contracts to save money. It's painful, and it can backfire: when the city stops paying those workers, they spend less at local businesses, incomes fall citywide, and the debt burden relative to income can actually get WORSE, not better.\n\n2. REDUCE DEBTS (Defaults & Restructuring). Picture a bank calling in loans it knows won't be repaid, writing some of them off. Borrowers can't pay, banks get squeezed, and people rush to withdraw their savings before more banks fail. This is what a depression looks like.\n\n3. REDISTRIBUTE WEALTH. A government raises taxes on higher earners to fund support for everyone else. It can ease the burden, but it also tends to raise social tension between those paying more and those receiving more.\n\n4. PRINT MONEY. When rates are already near 0%, the central bank creates new money to buy government bonds and other financial assets — effectively refilling the well that austerity and defaults just drained. This is inflationary and stimulative, the opposite of the first three tools.",
          "es": "1. RECORTAR GASTO (Austeridad)\n2. REDUCIR DEUDAS (Impagos)\n3. REDISTRIBUIR RIQUEZA (Impuestos)\n4. IMPRIMIR DINERO (QE)",
          "ko": "1. 지출 삭감 (긴축) — 고통스럽고 디플레이션적\n2. 부채 감소 (채무불이행 & 구조조정)\n3. 부의 재분배 (부자 증세)\n4. 화폐 발행 — 인플레이션적이고 부양적 — 처음 세 가지의 반대",
          "zh": "1. 削减支出（紧缩）——痛苦、通缩\n2. 减少债务（违约和重组）\n3. 重新分配财富（向富人征税）\n4. 印钞——通胀性和刺激性——与前三种相反",
          "ja": "1. 支出削減（緊縮） — 苦痛でデフレ的\n2. 債務削減（デフォルト・再編）\n3. 富の再分配（富裕層への増税）\n4. 紙幣印刷 — インフレ的で刺激的 — 最初の3つと逆"
        }
      },
      {
        "heading": {
          "en": "Beautiful vs Ugly Deleveraging",
          "es": "Desapalancamiento Hermoso vs Feo",
          "ko": "아름다운 vs 추한 디레버리징",
          "zh": "漂亮 vs 丑陋的去杠杆",
          "ja": "美しいvs醜いデレバレッジング"
        },
        "body": {
          "en": "The key is BALANCE — like a chef adjusting seasoning: too much of the deflationary tools (cutting, defaulting, taxing) without enough of the inflationary one (printing money), and the result turns out bitter and depressive. Too much of the inflationary tool alone, and it turns into an inflated mess instead.\n\nGet the mix right, and you get a 'beautiful deleveraging': debts decline relative to income, growth stays positive, and inflation stays manageable. Many economists point to the US recovery from 2008 through roughly 2015 as an example of that balance working reasonably well.\n\nGet the mix wrong, and you get an 'ugly deleveraging.' Germany in the 1920s leaned almost entirely on printing money, and the result was hyperinflation so severe that people famously carried wheelbarrows of cash just to buy bread. The US in the 1930s leaned almost entirely on austerity, and the result was the Great Depression.\n\nEither way, recovery from a long-term debt peak tends to take roughly a decade — often called the 'lost decade.'",
          "es": "La clave es el EQUILIBRIO. Un desapalancamiento hermoso equilibra las 4 herramientas. La recuperación tarda aproximadamente una década.",
          "ko": "핵심은 균형입니다. 디플레이션적 방법과 인플레이션적 방법의 균형.\n\n아름다운 디레버리징: 소득 대비 부채 감소, 성장 유지. 2008-2015 미국이 예시.\n\n추한 디레버리징: 한 도구를 너무 많이 사용. 회복에는 약 10년 — \"잃어버린 10년.\"",
          "zh": "关键是平衡。通缩手段和通胀手段必须平衡。\n\n漂亮的去杠杆：债务下降、增长为正。2008-2015美国是例子。\n\n丑陋的去杠杆：过度使用某一工具。恢复大约需要十年——\"失去的十年\"。",
          "ja": "鍵はバランス。デフレ的手段とインフレ的手段のバランス。\n\n美しいデレバレッジ：債務が所得比で低下、成長維持。2008-2015年の米国が例。\n\n醜いデレバレッジ：一つの手段を使いすぎる。回復には約10年 — 「失われた10年」。"
        }
      }
    ],
    "takeaway": {
      "en": "Income needs to grow faster than debt. Print enough money to offset deflation, but not so much you cause hyperinflation. Balance is everything.",
      "es": "Los ingresos deben crecer más rápido que la deuda. Imprimir suficiente pero no demasiado. El equilibrio es todo.",
      "ko": "소득이 부채보다 빠르게 성장해야 합니다. 디플레이션을 상쇄할 만큼 충분히 발행하되 과도한 인플레이션은 피해야 합니다.",
      "zh": "收入增长必须快于债务。印够钱抵消通缩，但不能太多导致恶性通胀。平衡就是一切。",
      "ja": "所得は債務より速く成長しなければならない。デフレを相殺するだけ印刷し、過度なインフレは避ける。バランスが全て。"
    },
    "thinkAbout": {
      "en": "If printing money offsets falling credit, total spending stays the same. So printing money doesn't cause inflation IF credit is disappearing at the same rate. Does that change how you think about money printing?",
      "es": "Si imprimir dinero compensa el crédito que desaparece, el gasto total se mantiene. ¿Cambia eso tu perspectiva?",
      "ko": "화폐 발행이 사라지는 신용을 상쇄하면 총 지출은 같습니다. 이것이 화폐 발행에 대한 당신의 생각을 바꾸나요?",
      "zh": "如果印钞抵消了消失的信贷，总支出不变。这改变了你对印钞的看法吗？",
      "ja": "紙幣印刷が消える信用を相殺すれば、総支出は同じ。これは紙幣印刷への見方を変えますか？"
    }
  },
  7: {
    "sections": [
      {
        "heading": {
          "en": "The Fed Funds Rate",
          "es": "La Tasa de Fondos Federales",
          "ko": "연방기금금리",
          "zh": "联邦基金利率",
          "ja": "フェデラルファンド金利"
        },
        "body": {
          "en": "Think of the Federal Funds Rate as the master dial in the economy's control room. When the Fed turns it, nearly every other rate in your financial life follows — the rate on a new mortgage, what your savings account pays you, the APR on your credit card.\n\nRaise the dial → borrowing gets more expensive → the economy slows down.\nLower the dial → borrowing gets cheaper → the economy speeds up.\n\nThis is the Fed's primary tool for managing the short-term debt cycle from Lesson 4. But here's the catch: turning the dial doesn't change anything instantly. It typically takes 12-24 months for a rate change to fully work its way through mortgages, business loans, and hiring decisions — which is part of why the Fed sometimes turns the dial too far in one direction before the earlier turn has fully kicked in.",
          "es": "La tasa de fondos federales influye en TODAS las demás tasas.\n\nSubir tasas → frena la economía\nBajar tasas → estimula la economía\n\nLa política funciona con retraso de 12-24 meses.",
          "ko": "연방기금금리는 모기지, 저축, 신용카드 등 모든 금리에 영향을 미치는 핵심 금리입니다.\n\n금리 인상 → 경제 둔화\n금리 인하 → 경제 부양\n\n정책 효과는 12-24개월의 시차가 있습니다.",
          "zh": "联邦基金利率是影响所有其他利率的关键利率。\n\n加息 → 经济减速\n降息 → 经济刺激\n\n政策效果有12-24个月的滞后。",
          "ja": "FF金利は住宅ローン、貯蓄、クレジットカードなど全ての金利に影響する最重要金利。\n\n利上げ → 経済減速\n利下げ → 経済刺激\n\n効果には12-24ヶ月の遅れがある。"
        }
      },
      {
        "heading": {
          "en": "How Rates Affect Everything",
          "es": "Cómo las Tasas Afectan Todo",
          "ko": "금리가 모든 것에 미치는 영향",
          "zh": "利率如何影响一切",
          "ja": "金利がすべてに与える影響"
        },
        "body": {
          "en": "Here's why that one dial reaches so far. Say the Fed raises rates. A young tech company that was borrowing cheaply to fund years of growth now faces a much higher cost of capital, and its stock — priced on years of future profits — tends to fall harder than a stable utility company's. Existing bonds paying a lower fixed rate become less attractive next to new bonds paying the higher current rate, so bond prices fall too. A family shopping for a house finds the mortgage payment on that same home is suddenly hundreds of dollars more per month, and home sales cool over the following 6-12 months. Meanwhile, a plain savings account or money-market fund starts paying a genuinely competitive yield again, and the US dollar tends to strengthen as savers worldwide chase that yield.\n\nCut rates, and the sequence tends to run in reverse: stocks rise, bond prices rise, real estate recovers, gold often rises, and the dollar tends to weaken.\n\nThe informal rule investors cite for all of this: \"Don't fight the Fed.\" Historically, Fed easing (rate cuts) has coincided with rising asset prices, while Fed tightening (rate hikes) has coincided with more cautious market conditions.",
          "es": "Tasas SUBEN: acciones bajan, bonos bajan, inmuebles se frenan.\nTasas BAJAN: acciones suben, bonos suben, inmuebles se recuperan.\n\nRegla de oro: \"No luches contra el Fed.\"",
          "ko": "금리 상승: 주식 하락, 채권 가격 하락, 부동산 둔화, 현금 수익률 경쟁력.\n금리 하락: 주식 상승, 채권 가격 상승, 부동산 회복.\n\n황금률: \"연준에 맞서지 마라.\"",
          "zh": "利率上升：股票下跌、债券价格下跌、房地产放缓。\n利率下降：股票上涨、债券价格上涨、房地产复苏。\n\n黄金法则：\"不要和美联储作对。\"",
          "ja": "金利上昇：株下落、債券価格下落、不動産減速。\n金利下降：株上昇、債券価格上昇、不動産回復。\n\n黄金ルール：「FRBに逆らうな。」"
        }
      }
    ],
    "takeaway": {
      "en": "Rate changes are the Fed's primary tool for managing the short-term debt cycle. But when rates hit 0%, the Fed needs unconventional tools — that's where QE comes in.",
      "es": "Los cambios de tasas son la herramienta principal del Fed. Cuando llegan a 0%, necesita herramientas no convencionales — QE.",
      "ko": "금리 변경은 연준의 주요 도구입니다. 금리가 0%에 도달하면 비전통적 도구가 필요합니다 — 바로 QE입니다.",
      "zh": "利率变化是美联储的主要工具。当利率降至0%，需要非常规工具——这就是QE。",
      "ja": "金利変更はFRBの主要ツール。0%に達すると非従来型ツールが必要 — QEの出番。"
    },
    "thinkAbout": {
      "en": "The Fed raised rates to 5.25-5.50% in 2022-23 to fight inflation. Since policy takes 12-24 months to fully show up, look up today's Fed funds rate — how much of that move do you think has already rippled through the economy?",
      "es": "El Fed subió tasas a 5.25-5.50% en 2022-23. La política tarda 12-24 meses en manifestarse del todo — busca la tasa actual del Fed. ¿Cuánto de ese efecto crees que ya se ha sentido?",
      "ko": "연준은 2022-23년에 인플레이션과 싸우기 위해 5.25-5.50%까지 금리를 올렸습니다. 정책 효과는 12-24개월이 걸리므로, 현재 연준 금리를 찾아보세요 — 그 영향이 얼마나 경제에 퍼졌다고 생각하시나요?",
      "zh": "美联储在2022-23年将利率提高到5.25-5.50%以对抗通胀。政策效果需要12-24个月才能完全显现——查一下目前的联邦基金利率，你认为这次加息的影响已经在经济中体现了多少？",
      "ja": "FRBは2022-23年にインフレ対策で5.25-5.50%まで利上げしました。政策効果が完全に表れるには12-24ヶ月かかります——現在のFF金利を調べてみましょう。この影響はどれくらい経済に波及したと思いますか？"
    }
  },
  8: {
    "sections": [
      {
        "heading": {
          "en": "What is the Yield Curve?",
          "es": "¿Qué es la Curva?",
          "ko": "수익률 곡선이란?",
          "zh": "什么是收益率曲线？",
          "ja": "イールドカーブとは？"
        },
        "body": {
          "en": "Imagine lending money to a friend. If they'll pay you back next week, you might not even ask for interest. If they won't pay you back for 10 years, you'd want a lot more in return — more can go wrong over a longer stretch. That's the basic logic behind the yield curve: a graph of the interest rate the government pays to borrow money for different lengths of time (2 years, 10 years, 30 years).\n\nNORMAL (upward slope) — Longer loans pay higher rates than shorter ones, exactly like the friend example. This is the healthy, default shape.\n\nFLAT — Short and long rates converge. It's the bond market's way of shrugging: a warning that a slowdown may be coming.\n\nINVERTED (short rates above long rates) — This is strange enough to be a real warning sign: it means lenders are willing to accept LESS to lock in money for 10 years than for 2, which usually means they expect the economy to weaken and rates to fall substantially in the meantime. Historically one of the most reliable recession signals, with a typical lead time of 12-18 months. Every US recession since 1955 was preceded by an inversion — though not every inversion has been followed by a recession, so it's a strong signal, not a certainty.\n\nSTEEP — The gap widens back out, often seen after the Fed starts cutting short-term rates. A shape frequently associated with recovery.",
          "es": "Un gráfico de tasas de interés de bonos a diferentes plazos.\n\nNormal = saludable. Invertida = peligro — cada recesión de EE.UU. desde 1955 estuvo precedida por una inversión, aunque no toda inversión ha sido seguida de recesión.",
          "ko": "다른 만기의 국채 금리 그래프입니다.\n\n정상(우상향) = 건강한 경제\n역전(단기>장기) = 위험! 1955년 이후 모든 미국 경기침체 전에 역전이 있었지만, 모든 역전이 경기침체로 이어진 것은 아닙니다.",
          "zh": "不同期限国债利率的图表。\n\n正常（向上倾斜）= 健康经济\n倒挂（短期>长期）= 危险！自1955年以来，每次美国衰退前都出现过收益率曲线倒挂，但并非每次倒挂后都发生了衰退。",
          "ja": "異なる満期の国債金利のグラフ。\n\n正常（右肩上がり）= 健全な経済\n逆転（短期>長期）= 危険！1955年以来、全ての米国景気後退の前に逆イールドが発生していますが、逆イールドの後に必ず景気後退が起きるとは限りません。"
        }
      }
    ],
    "takeaway": {
      "en": "When the yield curve inverts, pay attention. It's the bond market screaming that rate cuts are coming — and that means economic weakness ahead.",
      "es": "Cuando la curva se invierte, presta atención. El mercado de bonos grita que vienen recortes.",
      "ko": "수익률 곡선이 역전되면 주목하세요. 채권 시장이 금리 인하가 올 것이라고 외치는 것입니다.",
      "zh": "当收益率曲线倒挂时要注意。债券市场在告诉你降息即将到来——经济疲软在前方。",
      "ja": "イールドカーブが逆転したら注目。債券市場が利下げが来ると叫んでいる。"
    },
    "thinkAbout": {
      "en": "The yield curve inverted in 2022. Historical pattern says recession within 12-18 months. Some say 'this time is different.' What do you think?",
      "es": "La curva se invirtió en 2022. El patrón dice recesión en 12-18 meses. ¿Será diferente esta vez?",
      "ko": "2022년에 수익률 곡선이 역전되었습니다. 역사적 패턴은 12-18개월 내 경기침체를 말합니다. 이번에는 다를까요?",
      "zh": "2022年收益率曲线倒挂了。历史规律说12-18个月内衰退。你怎么看？",
      "ja": "2022年にイールドカーブが逆転。歴史的パターンでは12-18ヶ月以内に景気後退。今回は違うと思いますか？"
    }
  },
  9: {
    "sections": [
      {
        "heading": {
          "en": "Quantitative Easing (QE)",
          "es": "Flexibilización Cuantitativa (QE)",
          "ko": "양적완화 (QE)",
          "zh": "量化宽松（QE）",
          "ja": "量的緩和（QE）"
        },
        "body": {
          "en": "Normally the Fed's master dial (Lesson 7) is interest rates. But once that dial is already turned all the way down to 0%, it can't go any lower — and if the economy still needs help, the Fed reaches for a different tool entirely.\n\nQuantitative Easing works like this: the Fed creates new money electronically (no printing press involved, just entries in a ledger) and uses it to buy up government bonds and mortgage-backed securities from banks and investors — stepping into the bond market as an enormous buyer, competing for the same bonds everyone else wants.\n\nThat buying pressure pushes bond prices up (and yields, meaning the return on those bonds, down), makes borrowing cheaper across the economy, and — because bonds now pay less — nudges investors who want a decent return toward riskier assets like stocks instead.\n\nQE1 (2008): $1.75 trillion\nQE2 (2010): $600 billion\nQE3 (2012): $85B/month\nCOVID QE (2020): Unlimited\n\nThe scale of this tool shows up on the Fed's own balance sheet, which grew from roughly $900 billion before 2008 to a peak of about $9 trillion in 2022 — a stack of bonds nine times the size of the entire pre-2008 institution.",
          "es": "Cuando las tasas llegan a 0%, el banco central imprime dinero electrónicamente y compra bonos.\n\nEl balance del Fed creció de ~$900B antes de 2008 a ~$9T pico en 2022.",
          "ko": "금리가 0%에 도달하면 중앙은행이 전자적으로 돈을 발행하여 국채와 MBS를 매입합니다.\n\n연준 대차대조표: 2008년 이전 ~$9000억 → 2022년 정점 ~$9조.",
          "zh": "当利率降至0%时，央行电子印钞购买国债和抵押贷款支持证券。\n\n美联储资产负债表：2008年前约9000亿 → 2022年峰值约9万亿。",
          "ja": "金利が0%に達すると中央銀行が電子的に紙幣を印刷し国債やMBSを購入。\n\nFRBバランスシート：2008年前約9000億ドル → 2022年ピーク約9兆ドル。"
        }
      },
      {
        "heading": {
          "en": "Quantitative Tightening (QT)",
          "es": "Ajuste Cuantitativo (QT)",
          "ko": "양적긴축 (QT)",
          "zh": "量化紧缩（QT）",
          "ja": "量的引き締め（QT）"
        },
        "body": {
          "en": "QT is the reverse of QE — instead of buying more bonds, the Fed simply lets the bonds it already owns mature and doesn't reinvest the proceeds into new ones. No dramatic selling, just letting existing holdings quietly run off.\n\nThis drains money from the financial system, pushes bond yields back UP, and tightens financial conditions overall — the mirror image of everything QE did.\n\nQT is like slowly letting air out of a balloon rather than popping it: quiet and gradual, but it can still cause turbulence if done too fast, since it removes some of the same buying support that had been propping up bond prices.\n\nThe Fed ran QT at $95 billion a month starting in 2022, slowing the pace in 2024 as the balance sheet worked its way down from its $9 trillion peak.",
          "es": "Lo opuesto al QE. El Fed reduce su balance dejando que los bonos venzan sin reinvertir.\n\nFunciona a $95B/mes desde 2022, con el ritmo reducido en 2024 mientras el balance baja desde su pico de $9T.",
          "ko": "QE의 반대. 연준이 채권을 재투자 없이 만기시켜 대차대조표를 축소합니다.\n\n2022년부터 월 $950억 규모로 시행, 2024년에는 속도를 늦추며 대차대조표가 $9조 정점에서 축소되었습니다.",
          "zh": "QE的反面。美联储让债券到期不再投资来缩减资产负债表。\n\n2022年起每月950亿美元的速度实施，2024年放缓节奏，资产负债表从9万亿美元的峰值持续下降。",
          "ja": "QEの逆。FRBが債券を再投資せず満期にしバランスシートを縮小。\n\n2022年から月950億ドルのペースで実施し、2024年には速度を緩めながら、バランスシートは9兆ドルのピークから縮小しています。"
        }
      }
    ],
    "takeaway": {
      "en": "QE injects money (inflationary, helps assets). QT drains money (deflationary, pressures assets). The Fed balance sheet is the scoreboard.",
      "es": "QE inyecta dinero. QT drena dinero. El balance del Fed es el marcador.",
      "ko": "QE는 돈을 공급합니다(인플레이션, 자산 지원). QT는 돈을 회수합니다(디플레이션, 자산 압박). 연준 대차대조표가 점수판입니다.",
      "zh": "QE注入资金（通胀，利好资产）。QT抽走资金（通缩，压制资产）。美联储资产负债表是计分板。",
      "ja": "QEは資金注入（インフレ、資産に有利）。QTは資金吸収（デフレ、資産に不利）。FRBバランスシートがスコアボード。"
    },
    "thinkAbout": {
      "en": "The Fed printed $2+ trillion in 2008 and unlimited in 2020. Who benefits most from QE? Those who own financial assets. Does this help explain growing wealth inequality?",
      "es": "El Fed imprimió $2T+ en 2008 e ilimitado en 2020. ¿Quién se beneficia más? Los que poseen activos financieros.",
      "ko": "연준은 2008년에 $2조 이상, 2020년에 무제한으로 발행했습니다. QE의 최대 수혜자는? 금융 자산을 소유한 사람들입니다.",
      "zh": "美联储2008年印了2万亿+，2020年无限量。谁从QE中受益最多？持有金融资产的人。这有助于解释财富不平等吗？",
      "ja": "FRBは2008年に2兆ドル以上、2020年は無制限に印刷。QEの最大受益者は？金融資産所有者です。"
    }
  },
  10: {
    "sections": [
      {
        "heading": {
          "en": "Expansion & Peak",
          "es": "Expansión y Pico",
          "ko": "확장기와 정점",
          "zh": "扩张与顶峰",
          "ja": "拡大期とピーク"
        },
        "body": {
          "en": "Picture the same factory town from Lesson 4, a few years into its boom. EXPANSION: credit flows freely, GDP rises, new jobs keep appearing, and confidence builds. People borrow more, spend more, and feel wealthier — the town adds a second restaurant, then a third. Historically, this phase has coincided with S&P 500 average returns of roughly +14-28%, and assets like growth stocks, cyclical stocks, and real estate have historically been favored in it.\n\nPEAK: the town's output is now about as high as it can go — every worker is employed, every restaurant full. Inflation is running at highs, and the Fed is raising rates to cool things down. Growth stalls, even though the mood hasn't caught up yet. This is where the seeds of the next contraction are quietly planted.\n\nHistorically favored in this phase: value stocks, commodities, and short-duration bonds.",
          "es": "EXPANSIÓN: El crédito fluye. PIB sube, empleo crece. Históricamente favorecidas en esta fase: acciones de crecimiento.\n\nPICO: Producción máxima. Inflación alta, Fed subiendo tasas.",
          "ko": "확장기: 신용이 자유롭게 흐릅니다. GDP 상승, 일자리 창출. 역사적으로 이 시기에 강세를 보인 자산: 성장주, 경기순환주.\n\n정점: 최대 생산량. 인플레이션 고점, 연준 금리 인상.",
          "zh": "扩张期：信贷自由流动。GDP上升、就业增加。历史上此阶段表现较强的资产：成长股、周期股。\n\n顶峰：最大产出。通胀高位、美联储加息。",
          "ja": "拡大期：信用が自由に流れる。GDP上昇、雇用創出。歴史的にこの局面で強かった資産：グロース株、景気循環株。\n\nピーク：最大産出。インフレ高水準、FRB利上げ。"
        }
      },
      {
        "heading": {
          "en": "Contraction & Trough",
          "es": "Contracción y Valle",
          "ko": "수축기와 저점",
          "zh": "收缩与低谷",
          "ja": "収縮期と底"
        },
        "body": {
          "en": "CONTRACTION: back in the town, credit contracts, spending falls, and the third restaurant lays off staff, then closes. Unemployment rises across the whole town, and the Fed starts cutting rates to try to stop the slide. Historically, this phase has coincided with S&P 500 average declines of roughly -22-35%, and assets like Treasury bonds, gold, defensive stocks (utilities, healthcare), and plain cash have historically held up better in it.\n\nTROUGH: this is the point of maximum pessimism — boarded-up storefronts, gloomy headlines, nobody wanting to be the one to buy. But historically, this is also where the strongest rebounds have started, precisely because prices have already fallen so far that even modest good news looks meaningful. S&P 500 average return in the first year after a bottom has historically been around +38-50%.\n\nHistorically favored in this phase: beaten-down quality stocks, high-yield bonds, and real estate at distressed prices.",
          "es": "CONTRACCIÓN: Crédito se contrae, desempleo sube, Fed recorta tasas.\n\nVALLE: Máximo pesimismo, pero históricamente aquí han comenzado los rebotes más fuertes. S&P 500: +38-50% el primer año después del fondo.",
          "ko": "수축기: 신용 수축, 실업률 상승, 연준 금리 인하 시작.\n\n저점: 최대 비관론이지만, 역사적으로 이 시점에서 가장 강한 반등이 시작되었습니다. S&P 500 바닥 후 첫해 평균: +38-50%.",
          "zh": "收缩期：信贷收缩、失业率上升、美联储开始降息。\n\n低谷：情绪最悲观，但历史上最强的反弹往往从这里开始。标普500触底后第一年平均回报+38-50%。",
          "ja": "収縮期：信用収縮、失業率上昇、FRB利下げ開始。\n\n底：悲観が最大化する時期だが、歴史的に最も強い反発がここから始まっている。S&P500底打ち後1年目：+38-50%。"
        }
      }
    ],
    "takeaway": {
      "en": "Every great fortune was made buying when others were panicking at the trough. The cycle ALWAYS turns. Understanding where you are in the cycle is the most valuable financial knowledge.",
      "es": "Las grandes fortunas se hicieron comprando cuando otros entraban en pánico. El ciclo SIEMPRE gira.",
      "ko": "모든 큰 재산은 다른 사람들이 저점에서 패닉할 때 매수하여 만들어졌습니다. 순환은 항상 돌아갑니다.",
      "zh": "每一笔巨额财富都是在低谷别人恐慌时买入获得的。周期总会转变。",
      "ja": "全ての大きな財産は底で他の人がパニックしている時に買って築かれた。サイクルは必ず転換する。"
    },
    "thinkAbout": {
      "en": "Warren Buffett says \"Be fearful when others are greedy, and greedy when others are fearful.\" How does this connect to what you've learned about cycles?",
      "es": "Warren Buffett dice \"Ten miedo cuando otros son codiciosos, y sé codicioso cuando otros tienen miedo.\"",
      "ko": "워렌 버핏은 \"다른 사람들이 탐욕스러울 때 두려워하고, 두려워할 때 탐욕스러워라\"고 말합니다.",
      "zh": "巴菲特说\"别人贪婪时恐惧，别人恐惧时贪婪。\"这与你学到的周期知识有什么联系？",
      "ja": "バフェットは「他人が貪欲な時に恐れ、恐れている時に貪欲になれ」と言います。"
    }
  },
  11: {
    "sections": [
      {
        "heading": {
          "en": "Key Indicators",
          "es": "Indicadores Clave",
          "ko": "핵심 지표",
          "zh": "关键指标",
          "ja": "主要指標"
        },
        "body": {
          "en": "Just like a doctor doesn't diagnose you from a single vital sign, economists watch a handful of indicators together to read the health of the whole economy. Think of these as dashboard gauges:\n\nGDP is the speedometer — the total value of everything the economy produced. Rising = expansion. A common rule of thumb calls two straight quarters of decline a recession — but in the US, recessions are officially dated by the NBER using broader criteria (employment, income, spending), not GDP alone.\n\nCPI (Consumer Price Index) is the fuel-price gauge — it tracks how fast the prices of everyday goods, like groceries and rent, are rising. The Fed targets roughly 2% inflation as healthy.\n\nPMI (Purchasing Managers' Index) is like an early-warning light — it surveys factory and service managers about their own orders and hiring plans before those show up in GDP. Above 50 = expansion expected. Below 50 = contraction expected. It's a LEADING indicator, meaning it tends to move before the broader economy does.\n\nVIX, nicknamed the 'Fear Gauge,' measures how much turbulence investors expect in the stock market over the next month. Below 15 = calm seas. Above 40 = extreme panic. Some contrarian investors specifically look to buy when the VIX spikes, on the theory that panic is often overdone.\n\nCredit Spreads are the difference between what a riskier company has to pay to borrow versus what the (safer) government pays. Narrow = lenders feel confident. Wide = lenders are demanding extra pay for extra fear.",
          "es": "PIB, IPC, PMI, VIX, Spreads de Crédito — los indicadores clave para leer el estado de la economía.",
          "ko": "GDP, CPI, PMI, VIX, 신용 스프레드 — 경제 상태를 읽는 핵심 지표들.",
          "zh": "GDP、CPI、PMI、VIX、信用利差——读懂经济状态的关键指标。",
          "ja": "GDP、CPI、PMI、VIX、クレジットスプレッド — 経済の状態を読む重要指標。"
        }
      }
    ],
    "takeaway": {
      "en": "No single indicator tells the whole story. Watch multiple indicators together to understand where you are in the cycle.",
      "es": "Ningún indicador cuenta toda la historia. Observa múltiples indicadores juntos.",
      "ko": "어떤 단일 지표도 전체 이야기를 말하지 않습니다. 여러 지표를 함께 관찰하세요.",
      "zh": "没有单一指标能说明全部。同时观察多个指标来理解你在周期的哪个位置。",
      "ja": "一つの指標だけでは全体像は分からない。複数の指標を合わせて見よう。"
    },
    "thinkAbout": {
      "en": "Imagine an economy where: GDP is growing but slowing, inflation is running above target, the central bank is divided on which way to move rates, and tariffs are pushing costs to a multi-generational high. What phase do you think it's in?",
      "es": "Imagina una economía donde: el PIB crece pero se desacelera, la inflación supera el objetivo, el banco central está dividido sobre la dirección de las tasas, y los aranceles empujan los costos a un máximo de varias generaciones. ¿En qué fase crees que está?",
      "ko": "다음과 같은 경제를 상상해보세요: GDP는 성장하지만 둔화되고, 인플레이션은 목표치를 웃돌며, 중앙은행은 금리 방향에 대해 의견이 갈리고, 관세는 비용을 수십 년 만의 최고 수준으로 밀어올립니다. 어떤 단계라고 생각하시나요?",
      "zh": "想象一个这样的经济体：GDP增长但放缓，通胀高于目标，央行对利率方向存在分歧，关税将成本推高至几十年来的最高水平。你认为这处于哪个阶段？",
      "ja": "次のような経済を想像してください：GDP成長は鈍化し、インフレは目標を上回り、中央銀行は金利の方向性で意見が分かれ、関税がコストを数十年ぶりの高水準に押し上げています。どの局面だと思いますか？"
    }
  },
  12: {
    "sections": [
      {
        "heading": {
          "en": "The Three Rules",
          "es": "Las Tres Reglas",
          "ko": "세 가지 법칙",
          "zh": "三条法则",
          "ja": "3つのルール"
        },
        "body": {
          "en": "RULE 1: Don't let debt rise faster than income. Remember the family from Lesson 5 whose mortgage payment kept eating a bigger share of their paycheck? That's Rule 1 being broken in slow motion — eventually the debt burden crushes you, whether you're a household or a country.\n\nRULE 2: Don't let income rise faster than productivity. If a factory worker's wage keeps climbing but they're not producing any more per hour than before, the factory eventually can't compete with one elsewhere that pays less for the same output — jobs move, or prices rise until customers walk away.\n\nRULE 3: Do everything you can to raise your own productivity — learn a new skill, adopt a better tool or process, like the farmer's tractor from Lesson 3. In the long run, this is what actually matters most, because it's the only one of the three that isn't just moving numbers around.\n\nThis is simple advice for you AND for policy makers alike. Most people — including most policy makers — don't pay nearly enough attention to it.",
          "es": "REGLA 1: No dejes que la deuda crezca más rápido que los ingresos.\nREGLA 2: No dejes que los ingresos crezcan más rápido que la productividad.\nREGLA 3: Haz todo lo posible por aumentar tu productividad.",
          "ko": "법칙 1: 부채가 소득보다 빠르게 증가하지 않게 하라.\n법칙 2: 소득이 생산성보다 빠르게 증가하지 않게 하라.\n법칙 3: 생산성을 높이기 위해 할 수 있는 모든 것을 하라.",
          "zh": "法则1：不要让债务增长快于收入。\n法则2：不要让收入增长快于生产力。\n法则3：尽一切努力提高生产力。",
          "ja": "ルール1：債務が所得より速く増えないようにする。\nルール2：所得が生産性より速く増えないようにする。\nルール3：生産性を上げるためにあらゆることをする。"
        }
      },
      {
        "heading": {
          "en": "Putting It All Together",
          "es": "Uniéndolo Todo",
          "ko": "모든 것을 합치기",
          "zh": "总结",
          "ja": "まとめ"
        },
        "body": {
          "en": "Now you have the whole template, built lesson by lesson: a slow, steady line of productivity growth (Lesson 3) running underneath everything; a 75-100 year long-term debt cycle (Lesson 5) rising and falling on top of that; and a faster 5-8 year short-term debt cycle (Lesson 4) bouncing on top of both. Layer all three together, and you get a map for understanding where an economy has been, where it is now, and where it's probably headed.\n\nThe economy isn't random noise — it's a machine driven by transactions (Lesson 1), credit (Lesson 2), and human nature repeating the same patterns generation after generation. Once you can see those patterns, whether you're an investor, a small business owner, or just someone trying to make sense of the news, you're equipped to make better decisions than someone reacting to headlines one at a time.",
          "es": "Ahora tienes la plantilla: superponer el ciclo corto sobre el largo sobre la línea de productividad te da un mapa para entender la economía.",
          "ko": "이제 템플릿이 있습니다: 단기 부채 순환을 장기 부채 순환 위에, 둘 다 생산성 성장 위에 겹치면 경제를 이해하는 지도가 됩니다.",
          "zh": "现在你有了模板：将短期债务周期叠加在长期债务周期上，再叠加在生产力增长线上，就是理解经济的地图。",
          "ja": "これでテンプレートが揃いました。短期債務サイクルを長期の上に、両方を生産性成長の上に重ねれば、経済を理解する地図になります。"
        }
      }
    ],
    "takeaway": {
      "en": "The economy is a machine. Transactions, credit, and human nature drive it. Once you see the patterns, you can make better decisions about your money, career, and life.",
      "es": "La economía es una máquina. Transacciones, crédito y naturaleza humana la impulsan.",
      "ko": "경제는 기계입니다. 거래, 신용, 인간 본성이 그것을 움직입니다. 패턴을 보면 더 나은 결정을 할 수 있습니다.",
      "zh": "经济是一台机器。交易、信贷和人性驱动它。看到规律后，你就能做出更好的决策。",
      "ja": "経済は機械です。取引、信用、人間の本性が動かす。パターンが見えれば、より良い判断ができます。"
    },
    "thinkAbout": {
      "en": "You now understand more about how the economy works than most people. How will you apply these three rules to your own financial decisions?",
      "es": "Ahora entiendes más sobre economía que la mayoría. ¿Cómo aplicarás estas reglas a tus decisiones financieras?",
      "ko": "이제 대부분의 사람들보다 경제가 어떻게 작동하는지 더 잘 이해합니다. 이 세 가지 법칙을 어떻게 적용하시겠습니까?",
      "zh": "你现在比大多数人更了解经济运作。你将如何把这三条法则应用到自己的财务决策中？",
      "ja": "あなたは今、ほとんどの人より経済の仕組みを理解しています。この3つのルールをどう活かしますか？"
    }
  },
  13: {
    "sections": [
      {
        "heading": {
          "en": "Income vs. Expenses",
          "es": "Ingresos vs. Gastos",
          "ko": "소득 대 지출",
          "zh": "收入与支出",
          "ja": "収入と支出"
        },
        "body": {
          "en": "Meet Maria, who just started her first job making $3,000 a month after taxes. A budget is simply her plan for that money: how much comes in (her paycheck) and how much goes out (rent, food, fun, savings).\n\nSome of Maria's expenses are fixed — her $1,200 rent and $50 phone bill show up at basically the same amount every month, whether she likes it or not. Others are variable — what she spends on groceries or going out with friends can swing a lot depending on the month.\n\nA simple starting split many people use: about 50% needs, 30% wants, 20% savings or debt payoff. For Maria's $3,000, that's roughly $1,500 for needs (rent, groceries, utilities), $900 for wants (eating out, hobbies, streaming), and $600 toward savings or paying down debt. That's a rule of thumb, not a rule — Maria's rent alone eats 40% of her pay, so she'll need to adjust the split to fit her real numbers, not force her numbers to fit the split.",
          "es": "Un presupuesto es un plan para tu dinero: cuánto entra (ingresos) y cuánto sale (gastos).\n\nLos gastos fijos (alquiler, teléfono) se mantienen similares cada mes. Los variables (comida, ocio) cambian.\n\nUna división simple que muchos usan: 50% necesidades, 30% deseos, 20% ahorro o deudas. Es una guía, no una regla.",
          "ko": "예산은 단순히 돈에 대한 계획입니다: 얼마가 들어오고(소득) 얼마가 나가는지(지출).\n\n고정 지출(임대료, 통신비)은 매달 비슷합니다. 가변 지출(식비, 오락)은 달라집니다.\n\n많은 사람이 쓰는 간단한 출발점: 필요 50%, 원함 30%, 저축·부채상환 20%. 이는 경험 법칙일 뿐 절대적인 규칙은 아닙니다.",
          "zh": "预算就是给你的钱做一个计划：收入多少，支出多少。\n\n固定支出（房租、话费）每月大致相同。可变支出（食品、娱乐）会变化。\n\n许多人使用的简单起点：需求50%，欲望30%，储蓄或还债20%。这只是经验法则，不是硬性规定。",
          "ja": "予算とは、お金の計画のこと：いくら入り（収入）、いくら出るか（支出）。\n\n固定費（家賃、電話代）は毎月ほぼ同じ。変動費（食費、娯楽）は変わります。\n\n多くの人が使う簡単な出発点：必要50%、欲しいもの30%、貯蓄・借金返済20%。これは目安であり絶対的な規則ではありません。"
        }
      },
      {
        "heading": {
          "en": "Tracking Before Trimming",
          "es": "Registrar Antes de Recortar",
          "ko": "줄이기 전에 추적하기",
          "zh": "先记录，后削减",
          "ja": "減らす前に記録する"
        },
        "body": {
          "en": "Before Maria cuts anything, it helps to simply track where her money already goes for one full month — every coffee, every subscription, no judgment yet, just data.\n\nYou can't manage what you don't measure. When Maria adds it up, she's surprised to find she's signed up for four different streaming services she barely watches — $12, $15, $9, and $18 a month. That's $54 a month, or $648 a year, quietly leaving her account for entertainment she'd mostly forgotten she was paying for.\n\nMost people find one or two categories like this, where spending drifted up without them really noticing — that's usually the easiest place to start trimming, not the hardest.",
          "es": "Antes de recortar, ayuda registrar durante un mes a dónde va tu dinero — cada café, cada suscripción.\n\nNo puedes gestionar lo que no mides. Los gastos pequeños recurrentes suman: una suscripción de $12 al mes son $144 al año.",
          "ko": "무언가를 줄이기 전에, 한 달 동안 돈이 실제로 어디로 가는지 추적해보는 것이 도움이 됩니다 — 커피 한 잔까지.\n\n측정하지 않으면 관리할 수 없습니다. 작은 반복 비용도 쌓입니다: 월 12달러 구독료는 연 144달러입니다.",
          "zh": "在削减任何支出之前，先花一个月记录钱实际花在哪里会很有帮助——每一杯咖啡、每一项订阅。\n\n不衡量就无法管理。小额的重复支出会累积：每月12美元的订阅一年就是144美元。",
          "ja": "何かを減らす前に、まず1ヶ月お金の実際の流れを記録すると役立ちます——コーヒー一杯まで。\n\n測らなければ管理できません。小さな定期支出も積み重なります：月12ドルの定期購入は年144ドルになります。"
        }
      }
    ],
    "takeaway": {
      "en": "A budget isn't about restriction — it's about knowing where your money goes so you can decide, on purpose, where it should go instead.",
      "es": "Un presupuesto no es restricción — es saber a dónde va tu dinero para decidir, a propósito, a dónde debería ir.",
      "ko": "예산은 제약이 아니라, 돈이 어디로 가는지 알아서 어디로 가야 할지 스스로 정하는 것입니다.",
      "zh": "预算不是限制，而是知道钱去了哪里，从而主动决定它该去哪里。",
      "ja": "予算は制限ではなく、お金の流れを知り、意図的にどこへ向かわせるか決めること。"
    },
    "thinkAbout": {
      "en": "Pick one week and write down every purchase, no matter how small. Most people are surprised by at least one category. What do you think yours will be?",
      "es": "Elige una semana y anota cada compra, sin importar cuán pequeña. La mayoría se sorprende de al menos una categoría.",
      "ko": "일주일을 정해 아무리 작아도 모든 구매를 적어보세요. 대부분 적어도 한 항목에서 놀랍니다. 당신은 어떤 항목일 것 같나요?",
      "zh": "选一周记录每一笔消费，无论多小。大多数人至少会对一个类别感到惊讶。你觉得会是哪一类？",
      "ja": "1週間を選び、どんなに小さくても全ての購入を記録してみましょう。多くの人が少なくとも一つのカテゴリーに驚きます。あなたはどれだと思いますか？"
    }
  },
  14: {
    "sections": [
      {
        "heading": {
          "en": "What Counts as an Emergency",
          "es": "Qué Cuenta Como Emergencia",
          "ko": "무엇이 비상상황인가",
          "zh": "什么才算紧急情况",
          "ja": "何が「緊急」にあたるか"
        },
        "body": {
          "en": "Imagine James's car breaks down on the way to work — a $600 repair he didn't see coming. Without savings set aside, that $600 goes straight onto a credit card, often at a high interest rate, turning one bad week into months of extra payments. An emergency fund is money set aside specifically for moments like this — a job loss, a medical bill, a car repair you can't skip. Not a sale, not a vacation.\n\nA common guideline is 3-6 months of essential expenses, though people with less predictable income (freelancers, commission-based jobs) sometimes aim higher.\n\nBuilding it doesn't have to happen all at once. If James starts by setting aside just $50 a week, he'd have covered that $600 repair within three months — and even a small starter fund, some suggest $500-1,000 to begin, already covers many common surprises like his.",
          "es": "Un fondo de emergencia es dinero reservado solo para sorpresas genuinas — perder el empleo, una factura médica, una reparación del auto. No una oferta, no unas vacaciones.\n\nUna guía común: 3-6 meses de gastos esenciales. No tiene que lograrse de golpe — incluso $500-1,000 iniciales ya cubren muchas sorpresas comunes.",
          "ko": "비상금은 오직 진짜 예상치 못한 일을 위한 돈입니다 — 실직, 병원비, 차 수리비. 세일이나 휴가가 아닙니다.\n\n흔한 기준은 필수 생활비의 3-6개월치입니다. 한 번에 다 모을 필요는 없습니다 — 500-1,000달러 정도의 시작 기금만으로도 흔한 위기 상당수를 감당할 수 있습니다.",
          "zh": "应急基金是专为真正的意外情况准备的钱——失业、医疗账单、绕不开的汽车维修。不是促销，也不是旅行。\n\n常见标准是3-6个月的基本生活费。不必一次性存够——即使从500-1000美元的启动基金开始，也能应对许多常见意外。",
          "ja": "緊急資金は本当に予期しない事態のためだけに取っておくお金です——失業、医療費、避けられない車の修理。セールや旅行のためではありません。\n\nよくある目安は生活必需費の3〜6ヶ月分。一度に貯める必要はなく、500〜1,000ドル程度の最初の基金でも多くの一般的な不意の出費に対応できます。"
        }
      },
      {
        "heading": {
          "en": "Where to Keep It",
          "es": "Dónde Guardarlo",
          "ko": "어디에 보관할까",
          "zh": "放在哪里",
          "ja": "どこに置くべきか"
        },
        "body": {
          "en": "The goal for emergency savings is safety and access, not growth. If James had put his emergency money into stocks instead, and the market happened to be down 15% the week his car broke down, he'd be forced to sell at a loss just to cover the repair. That's why the goal is a savings account he can reach within a day or two — not something tied up long-term (like a retirement account) or something that swings in value day to day (like stocks).\n\nThis is a different job than investing. An emergency fund's job is to be there when everything else in your life is not going according to plan, not to grow as fast as possible.",
          "es": "El objetivo del fondo de emergencia es seguridad y acceso, no crecimiento. Suele ser una cuenta de ahorros accesible en un día o dos — no algo bloqueado (como una cuenta de jubilación) ni algo que fluctúa (como acciones).\n\nEs un trabajo distinto al de invertir: estar disponible cuando todo lo demás no va según el plan.",
          "ko": "비상금의 목표는 성장이 아니라 안전과 접근성입니다. 보통 하루 이틀 안에 찾을 수 있는 저축 계좌를 의미합니다 — 은퇴 계좌처럼 묶여있거나 주식처럼 매일 값이 변하는 것이 아닙니다.\n\n이는 투자와는 다른 역할입니다. 비상금의 역할은 삶의 다른 모든 것이 계획대로 되지 않을 때 그 자리에 있는 것입니다.",
          "zh": "应急储蓄的目标是安全和可取用性，而不是增值。通常意味着一两天内就能取出的储蓄账户——不是像退休账户那样被锁住，也不是像股票那样天天波动。\n\n这和投资是不同的任务：应急基金的任务是在生活中其他一切都不顺时依然在那里。",
          "ja": "緊急資金の目的は成長ではなく、安全性とすぐに使えることです。通常は1〜2日で引き出せる普通預金口座を指します——退職口座のように固定されたものや、株式のように日々値動きするものではありません。\n\nこれは投資とは別の役割です。緊急資金の役割は、人生の他のことが計画通りに進まないときにそこにあることです。"
        }
      }
    ],
    "takeaway": {
      "en": "An emergency fund's whole purpose is to turn a crisis into an inconvenience.",
      "es": "El propósito del fondo de emergencia es convertir una crisis en una molestia.",
      "ko": "비상금의 존재 이유는 위기를 단순한 불편함으로 바꾸는 것입니다.",
      "zh": "应急基金存在的全部意义，就是把危机变成不便。",
      "ja": "緊急資金の目的は、危機を単なる不便に変えること。"
    },
    "thinkAbout": {
      "en": "If your income stopped tomorrow, how many months could you cover your essential expenses with what you have saved right now?",
      "es": "Si tu ingreso se detuviera mañana, ¿cuántos meses podrías cubrir tus gastos esenciales con lo que tienes ahorrado?",
      "ko": "내일 소득이 끊긴다면, 지금 저축으로 필수 생활비를 몇 달이나 감당할 수 있나요?",
      "zh": "如果明天你的收入停止，用现在的存款你能覆盖几个月的基本生活费？",
      "ja": "もし明日から収入が止まったら、今の貯蓄で必需費を何ヶ月カバーできますか？"
    }
  },
  15: {
    "sections": [
      {
        "heading": {
          "en": "Interest on Interest",
          "es": "Interés Sobre Interés",
          "ko": "이자에 붙는 이자",
          "zh": "利息生利息",
          "ja": "利息に付く利息"
        },
        "body": {
          "en": "Imagine you put $1,000 into an account earning 6% a year. With simple interest, you'd earn $60 every single year, forever, always calculated on that original $1,000. With compound interest, year one still earns $60 — but now your balance is $1,060, so year two's 6% is calculated on $1,060, earning $63.60. Year three is calculated on $1,123.60. The growth itself starts growing.\n\nIt looks small at first, but a rough shortcut called the Rule of 72 shows why it matters: divide 72 by an annual growth rate to estimate how many years it takes money to double. At 6% a year, that's about 12 years; at 9%, about 8 years. So that same $1,000 becomes roughly $2,000 in about 12 years, $4,000 in 24, and $8,000 in 36 — without adding another dollar. This is an approximation, not a precise formula, but it captures the idea well.",
          "es": "El interés simple se gana solo sobre el monto original. El interés compuesto se gana sobre el monto original MÁS todo el interés ya generado — el crecimiento mismo empieza a crecer.\n\nUn atajo llamado Regla del 72: divide 72 entre la tasa anual para estimar en cuántos años se duplica el dinero. Al 6% son unos 12 años; al 9%, unos 8. Es una aproximación, no una fórmula exacta.",
          "ko": "단리는 원금에만 이자가 붙습니다. 복리는 원금뿐 아니라 이미 붙은 이자에도 이자가 붙습니다 — 성장 자체가 성장하기 시작하는 것입니다.\n\n72의 법칙이라는 간단한 방법: 72를 연간 성장률로 나누면 돈이 두 배가 되는 데 걸리는 대략적인 연수를 알 수 있습니다. 연 6%면 약 12년, 9%면 약 8년입니다. 이는 근사치이며 정확한 공식은 아닙니다.",
          "zh": "单利只按本金计算利息。复利则是本金加上已经产生的所有利息一起计息——增长本身开始增长。\n\n一个简单的估算方法叫72法则：用72除以年增长率，可估算钱翻倍所需的大致年数。年化6%大约需要12年，9%大约8年。这只是近似估算，不是精确公式。",
          "ja": "単利は元本にのみ利息がつきます。複利は元本に加え、すでに得た利息にも利息がつきます——成長そのものが成長し始めるのです。\n\n72の法則という簡単な目安があります：72を年間成長率で割ると、お金が2倍になるおおよその年数がわかります。年6%なら約12年、9%なら約8年。これは近似であり厳密な式ではありません。"
        }
      },
      {
        "heading": {
          "en": "Time Beats Timing",
          "es": "El Tiempo Vence a la Sincronización",
          "ko": "시간이 타이밍을 이긴다",
          "zh": "时间胜过时机",
          "ja": "タイミングより時間"
        },
        "body": {
          "en": "Because compounding builds on itself, TIME matters enormously — often more than the amount you start with.\n\nSay Priya starts saving $200 a month at age 25, while her friend Tom waits until 35 and saves $400 a month — twice as much, every month, for the rest of their working lives. Even though Tom is putting in more money each month, Priya's extra decade of compounding often lets her end up ahead by retirement, purely because compounding had more years to work on her side.\n\nThe same math works against you with debt: interest you don't pay off compounds too, which is why carrying a credit card balance at a high interest rate for years can end up costing far more in interest than whatever you originally charged to the card.",
          "es": "Porque el interés compuesto se construye sobre sí mismo, el TIEMPO importa enormemente — a menudo más que el monto inicial.\n\nAlguien que ahorra poco desde sus 20 años puede terminar con más que alguien que ahorra el doble pero empieza una década después, solo porque el interés compuesto tuvo más años para trabajar.\n\nLa misma matemática funciona en tu contra con las deudas: el interés que no pagas también se compone.",
          "ko": "복리는 스스로 위에 쌓이기 때문에 시간이 엄청나게 중요합니다 — 종종 시작 금액보다 더 중요합니다.\n\n20대에 적은 금액을 저축하기 시작한 사람이, 10년 늦게 두 배를 저축한 사람보다 더 많은 돈을 갖게 될 수 있습니다 — 단지 복리가 작동할 시간이 더 많았기 때문입니다.\n\n같은 수학이 부채에서는 당신에게 불리하게 작동합니다: 갚지 않은 이자에도 이자가 붙습니다.",
          "zh": "因为复利是建立在自身之上的，所以时间非常重要——往往比起始金额更重要。\n\n从20多岁就开始存少量钱的人，最终可能比十年后才开始存两倍金额的人拥有更多财富——仅仅因为复利有更多年份来发挥作用。\n\n同样的数学在债务上对你不利：没还清的利息也会产生复利，这就是为什么背负高息债务多年可能远超原始借款金额。",
          "ja": "複利は自らの上に積み重なるため、時間が非常に重要です——多くの場合、始める金額よりも重要です。\n\n20代からわずかな額を貯め始めた人は、10年後に2倍の額を貯め始めた人より最終的に多くを持つことがあります——単に複利が働く年数が長かったからです。\n\n同じ数学が借金では不利に働きます：払っていない利息にも利息がつくため、高金利の借金を何年も抱えると元の借入額をはるかに超えるコストになります。"
        }
      }
    ],
    "takeaway": {
      "en": "Compounding rewards time above almost everything else — which makes today the earliest day you'll ever be able to start.",
      "es": "El interés compuesto premia el tiempo por encima de casi todo — lo que hace que hoy sea el día más temprano que tendrás para empezar.",
      "ko": "복리는 거의 모든 것보다 시간을 우선시합니다 — 그래서 오늘이 당신이 시작할 수 있는 가장 빠른 날입니다.",
      "zh": "复利几乎重视时间胜过一切——这意味着今天就是你能开始的最早的一天。",
      "ja": "複利はほぼ何よりも時間を重視します——だから今日が、あなたが始められる最も早い日なのです。"
    },
    "thinkAbout": {
      "en": "Using the Rule of 72, roughly how many years would it take money to double at a 4% annual rate? At 12%?",
      "es": "Usando la Regla del 72, ¿aproximadamente cuántos años tardaría el dinero en duplicarse a una tasa anual del 4%? ¿Y al 12%?",
      "ko": "72의 법칙을 사용하면, 연 4% 성장률에서 돈이 두 배가 되는 데 대략 몇 년이 걸릴까요? 12%에서는?",
      "zh": "用72法则估算，年增长率为4%时钱翻倍大约需要多少年？12%时呢？",
      "ja": "72の法則を使うと、年4%の成長率でお金が2倍になるのにおおよそ何年かかりますか？12%では？"
    }
  },
  16: {
    "sections": [
      {
        "heading": {
          "en": "What Goes Into a Score",
          "es": "Qué Compone el Puntaje",
          "ko": "점수를 구성하는 요소",
          "zh": "分数由什么构成",
          "ja": "スコアを構成する要素"
        },
        "body": {
          "en": "Imagine two people, both with a $5,000 credit limit. Elena pays her balance in full every month and never carries more than $500 at a time — 10% of her available credit. David regularly carries a $4,000 balance — 80% of his limit — and has missed a couple of payments over the years. Even if both make the same income, Elena's credit score will typically be significantly higher, because a credit score is a number — in the US, commonly 300-850 — that summarizes how reliably you've repaid debt in the past, used by lenders to judge risk.\n\nThe biggest factors are usually payment history (do you pay on time, like Elena?) and credit utilization (how much of your available credit you're using, like David's 80%). Length of credit history, types of credit, and recent applications matter too, but less.\n\nLesson 3 talked about good debt vs. bad debt for the economy; a credit score is asking a similar question about you personally: can you handle what you've borrowed?",
          "es": "El puntaje de crédito es un número — en EE.UU. suele ir de 300 a 850 — que resume qué tan confiablemente has pagado tus deudas, usado por prestamistas para evaluar el riesgo.\n\nLos factores más grandes suelen ser el historial de pagos y el uso del crédito disponible. La duración del historial, los tipos de crédito y las solicitudes recientes también importan, pero menos.",
          "ko": "신용점수는 숫자입니다 — 미국에서는 보통 300-850점 — 과거에 부채를 얼마나 신뢰성 있게 상환했는지를 요약하며, 대출기관이 위험을 평가하는 데 사용합니다.\n\n가장 큰 요소는 보통 상환 이력(제때 갚는가)과 신용 이용률(사용 가능한 신용 중 얼마를 쓰고 있는가)입니다. 신용 기록 기간, 신용 종류, 최근 신청도 영향을 주지만 비중은 적습니다.",
          "zh": "信用分数是一个数字——在美国通常是300到850——它概括了你过去偿还债务的可靠程度，被贷方用来评估风险。\n\n最重要的因素通常是还款记录（是否按时还款）和信用使用率（正在使用的信用额度占比）。信用历史长度、信用类型和近期申请也有影响，但影响较小。",
          "ja": "クレジットスコアとは数字です——米国では通常300〜850——過去にどれだけ確実に借金を返済してきたかを示し、貸し手がリスクを判断するために使います。\n\n最も大きな要素は通常、支払い履歴（期限内に払っているか）と信用利用率（利用可能な信用のうちどれだけ使っているか）です。信用履歴の長さ、信用の種類、最近の申請も影響しますが、比重は小さめです。"
        }
      },
      {
        "heading": {
          "en": "Why It Follows You",
          "es": "Por Qué Te Acompaña",
          "ko": "왜 당신을 따라다니는가",
          "zh": "为什么它会跟着你",
          "ja": "なぜついてくるのか"
        },
        "body": {
          "en": "When Elena and David each apply for a $20,000 car loan, the bank might offer Elena 6% interest and David 14% for the exact same car — over a 5-year loan, that gap alone can add up to well over $2,000 in extra interest for David. A credit score can also affect whether an apartment will rent to you, and — depending on where you live — sometimes even job applications or insurance rates.\n\nBuilding a score like Elena's is mostly unglamorous: pay on time, every time; keep balances low relative to your limits; and let accounts age instead of closing them the moment they're paid off. There's no shortcut that replaces consistency over time.",
          "es": "El puntaje de crédito puede afectar la tasa de interés en un préstamo para auto o hipoteca, si un apartamento te alquilará, y a veces incluso solicitudes de empleo o tarifas de seguro.\n\nConstruirlo es poco glamuroso: paga a tiempo siempre; mantén saldos bajos; deja que las cuentas envejezcan en vez de cerrarlas.",
          "ko": "신용점수는 자동차 대출이나 모기지의 이자율, 아파트 임대 여부, 그리고 지역에 따라 취업이나 보험료에까지 영향을 줄 수 있습니다.\n\n점수를 쌓는 것은 대체로 화려하지 않습니다: 항상 제때 갚고, 한도 대비 잔액을 낮게 유지하며, 계정을 다 갚았다고 바로 닫지 말고 오래 유지하세요. 시간에 걸친 일관성을 대체할 지름길은 없습니다.",
          "zh": "信用分数会影响车贷或房贷的利率、房东是否愿意把公寓租给你，在某些地区甚至会影响求职或保险费率。\n\n提升信用分数并不炫酷：始终按时还款；让余额保持在额度较低的比例；账户还完也别急着关闭，让它继续留存。没有捷径能替代长期的一致性。",
          "ja": "クレジットスコアは自動車ローンや住宅ローンの金利、アパートを貸してもらえるかどうか、居住地によっては就職や保険料にまで影響することがあります。\n\nスコアを築くのは地味な作業です：常に期限内に支払う、上限に対して残高を低く保つ、完済してもすぐに口座を閉じずに残す。長年の一貫性に代わる近道はありません。"
        }
      }
    ],
    "takeaway": {
      "en": "A credit score rewards boring, consistent behavior over years — there's no clever trick that substitutes for paying on time.",
      "es": "El puntaje de crédito premia el comportamiento aburrido y constante durante años — no hay truco que sustituya pagar a tiempo.",
      "ko": "신용점수는 수년에 걸친 지루하고 일관된 행동에 보상을 줍니다 — 제때 갚는 것을 대신할 요령은 없습니다.",
      "zh": "信用分数奖励的是多年如一日的乏味但一贯的行为——没有任何技巧能替代按时还款。",
      "ja": "クレジットスコアは何年にもわたる地味で一貫した行動に報酬を与えます——期限内の支払いに代わる巧妙な手はありません。"
    },
    "thinkAbout": {
      "en": "Of the factors above, which one do you think would be easiest for you to improve first?",
      "es": "De los factores anteriores, ¿cuál crees que sería el más fácil de mejorar primero?",
      "ko": "위 요소들 중 당신이 가장 먼저 개선하기 쉬운 것은 무엇일까요?",
      "zh": "在上述因素中，你觉得哪一个对你来说最容易先改善？",
      "ja": "上記の要素の中で、あなたが最初に改善しやすいのはどれだと思いますか？"
    }
  },
  17: {
    "sections": [
      {
        "heading": {
          "en": "Two Basic Building Blocks",
          "es": "Dos Bloques Básicos",
          "ko": "두 가지 기본 구성 요소",
          "zh": "两个基本构件",
          "ja": "2つの基本要素"
        },
        "body": {
          "en": "Imagine your favorite local coffee shop decides to expand into a national chain and sells small ownership slices to raise money — that's a stock. If you buy one, you now own a tiny sliver of that company. If the chain grows and becomes more valuable, your slice has historically tended to become more valuable too, though it can also lose value, including sharply, if the company struggles.\n\nA bond is closer to a loan: instead of buying a slice of the coffee chain, you lend it money directly, and it promises to pay you back with interest by a set date — like an IOU with predictable terms. Bonds have historically been less volatile than stocks, but they generally offer lower long-run average returns.\n\nNeither is inherently 'better' — a stock and a bond behave differently in the same conditions, which is exactly why people combine them.",
          "es": "Una acción es una pequeña porción de propiedad de una empresa — si la empresa crece en valor, la acción históricamente ha tendido a valer más también, aunque también puede perder valor, incluso de forma brusca.\n\nUn bono se parece más a un préstamo: prestas dinero a una empresa o gobierno, que promete devolverlo con interés en una fecha fijada. Los bonos han sido históricamente menos volátiles que las acciones, pero suelen ofrecer retornos promedio más bajos a largo plazo.",
          "ko": "주식은 회사의 작은 소유권 조각입니다 — 회사 가치가 오르면 주식도 역사적으로 함께 오르는 경향이 있었지만, 급격히 가치를 잃을 수도 있습니다.\n\n채권은 대출에 더 가깝습니다: 회사나 정부에 돈을 빌려주고, 정해진 날짜에 이자와 함께 갚겠다는 약속을 받습니다. 채권은 역사적으로 주식보다 변동성이 낮았지만, 장기 평균 수익률은 대체로 더 낮습니다.",
          "zh": "股票是公司所有权的一小部分——如果公司价值增长，股票历史上也往往随之增值，但也可能大幅贬值。\n\n债券更接近于借款：你把钱借给公司或政府，对方承诺在约定日期按约定利息还款。债券历史上的波动性比股票低，但长期平均回报通常也较低。",
          "ja": "株式は会社の小さな所有権の一部です——会社の価値が上がれば、株式も歴史的にはそれに伴って価値が上がる傾向がありましたが、大きく値を下げることもあります。\n\n債券はむしろ融資に近いものです：企業や政府にお金を貸し、決められた期日に利息付きで返してもらう約束をします。債券は歴史的に株式より変動が小さい一方、長期的な平均リターンは概して低めです。"
        }
      },
      {
        "heading": {
          "en": "Why Diversification Exists",
          "es": "Por Qué Existe la Diversificación",
          "ko": "분산투자가 존재하는 이유",
          "zh": "分散投资存在的原因",
          "ja": "分散投資が存在する理由"
        },
        "body": {
          "en": "Imagine putting your entire life savings into that one coffee chain's stock. If a competitor opens next door and steals half its customers, your entire savings takes the hit at once. Diversification means not putting all your money into one company, sector, or asset type — if one holding falls sharply, the rest can cushion the impact.\n\nLesson 10 showed how different asset classes have historically performed differently across cycle phases — that pattern is part of why spreading investments across many holdings, rather than concentrating in a few (like that one coffee chain), has been a long-standing approach to managing risk.\n\nA fund that holds hundreds or thousands of companies at once — instead of just the one coffee chain — is one common way people diversify without picking individual stocks themselves.",
          "es": "Diversificar significa no poner todo el dinero en una empresa, sector o tipo de activo. Si una inversión cae bruscamente, el resto puede amortiguar el impacto.\n\nLa lección 10 mostró cómo distintas clases de activos se han comportado diferente según la fase del ciclo — ese patrón es parte de por qué repartir inversiones en muchas posiciones, en vez de concentrarse en pocas, ha sido un enfoque duradero para gestionar el riesgo.",
          "ko": "분산투자는 모든 돈을 하나의 회사, 산업, 자산 유형에 넣지 않는 것을 의미합니다. 하나가 크게 떨어져도 나머지가 충격을 완화할 수 있습니다.\n\n10강에서 서로 다른 자산군이 순환의 각 국면마다 역사적으로 다르게 움직였음을 보았습니다 — 그 패턴이 몇 개에 집중하기보다 많은 자산에 나누어 투자하는 것이 오랫동안 위험 관리 방법으로 쓰여온 이유 중 하나입니다.",
          "zh": "分散投资意味着不把所有钱都投入一家公司、一个行业或一种资产类型。如果其中一项大幅下跌，其余部分可以缓冲冲击。\n\n第10课展示了不同资产类别在周期各阶段历史上表现不同——这一规律正是为何把投资分散到多个持仓，而不是集中在少数几个上，长期以来被用作管理风险的方法。",
          "ja": "分散投資とは、すべてのお金を一つの会社、業種、資産タイプに入れないことを意味します。一つが大きく下落しても、他が影響を和らげてくれます。\n\n第10課では、異なる資産クラスがサイクルの局面ごとに歴史的に異なる動きをしてきたことを見ました——このパターンこそ、少数に集中するより多くの資産に分散する方が、長年リスク管理の手法とされてきた理由の一部です。"
        }
      }
    ],
    "takeaway": {
      "en": "Stocks and bonds tend to respond differently to the same economic conditions — which is the whole point of holding both, not a coincidence.",
      "es": "Las acciones y los bonos tienden a responder distinto a las mismas condiciones económicas — ese es el punto de tener ambos, no una coincidencia.",
      "ko": "주식과 채권은 같은 경제 상황에도 다르게 반응하는 경향이 있습니다 — 둘 다 보유하는 이유이며, 우연이 아닙니다.",
      "zh": "股票和债券在相同经济环境下往往反应不同——这正是同时持有两者的意义所在，而非巧合。",
      "ja": "株式と債券は同じ経済状況にも異なる反応をする傾向があります——それが両方を持つ意味であり、偶然ではありません。"
    },
    "thinkAbout": {
      "en": "Think back to lesson 10's four cycle phases. Why might holding both stocks and bonds smooth out the ride compared to holding just one?",
      "es": "Piensa en las cuatro fases del ciclo de la lección 10. ¿Por qué tener acciones y bonos juntos podría suavizar el camino comparado con tener solo uno?",
      "ko": "10강의 네 가지 순환 국면을 떠올려보세요. 주식과 채권을 함께 보유하면 하나만 보유할 때보다 왜 더 안정적일 수 있을까요?",
      "zh": "回想第10课的四个周期阶段。为什么同时持有股票和债券，比只持有一种，可能让过程更平稳？",
      "ja": "第10課の4つのサイクル局面を思い出してください。株式と債券の両方を持つことが、一方だけを持つより値動きを穏やかにするのはなぜでしょうか？"
    }
  },
  18: {
    "sections": [
      {
        "heading": {
          "en": "Why These Accounts Exist",
          "es": "Por Qué Existen Estas Cuentas",
          "ko": "이 계좌들이 존재하는 이유",
          "zh": "这些账户为何存在",
          "ja": "これらの口座が存在する理由"
        },
        "body": {
          "en": "Picture two coworkers who each set aside $200 a month for 30 years and earn the same return on it. One puts the money in an ordinary brokerage account; the other puts it in a workplace 401(k). Every year, the brokerage saver owes tax on the dividends and gains their investments produce, even though they never touched the money. The 401(k) saver owes nothing on that same growth until they actually withdraw it decades later — letting the full amount, tax included, keep compounding in the meantime (see Lesson 15 on why compounding rewards time above almost everything else).\n\nA 401(k) is a retirement account offered through an employer; an IRA (Individual Retirement Account) is the equivalent that anyone can open on their own through a bank or brokerage, employer or not. Both exist for the same reason: the government designed them to encourage long-term saving by changing the tax treatment, not by changing what you're allowed to invest in — a 401(k) or IRA can hold many of the same stocks, bonds, or funds an ordinary brokerage account can.\n\nMany employers that offer a 401(k) also add a 'match' — contributing some additional money of their own whenever an employee contributes, up to a set limit. That match is usually subject to a vesting schedule (you may need to stay employed a certain number of years before it's fully yours), a detail worth checking rather than assuming.",
          "es": "Un 401(k) es una cuenta de jubilación ofrecida por un empleador; un IRA es su equivalente que cualquiera puede abrir por su cuenta.\n\nAmbos retrasan o eliminan el impuesto sobre las ganancias de inversión hasta que retiras el dinero, a diferencia de una cuenta de corretaje ordinaria que se grava cada año.\n\nMuchos empleadores añaden un 'match' — dinero adicional cuando contribuyes — a menudo sujeto a un período de adquisición de derechos.",
          "ko": "401(k)는 고용주가 제공하는 은퇴 계좌이고, IRA는 누구나 직접 개설할 수 있는 동등한 계좌입니다.\n\n둘 다 일반 증권 계좌와 달리 인출할 때까지 투자 수익에 대한 세금을 늦추거나 없애줍니다.\n\n많은 고용주가 기여할 때마다 추가 자금을 매칭해주며, 이는 보통 일정 근속 기간이 필요한 베스팅 조건이 붙습니다.",
          "zh": "401(k)是雇主提供的退休账户；IRA是任何人都可以自行开设的对等账户。\n\n两者都会推迟或免除投资收益的税，直到你真正取款为止，这与每年都要缴税的普通券商账户不同。\n\n许多雇主还会提供\"匹配\"——你每缴纳一笔，雇主额外追加一笔资金——通常附带归属期限制。",
          "ja": "401(k)は雇用主が提供する退職口座で、IRAは誰でも自分で開設できる同等の口座です。\n\nどちらも、毎年課税される通常の証券口座と違い、実際に引き出すまで投資収益への課税を遅らせるか免除します。\n\n多くの雇用主は拠出額に応じて追加拠出する「マッチング」を提供しますが、通常は一定の勤続年数を要するベスティング条件が伴います。"
        }
      },
      {
        "heading": {
          "en": "Traditional vs Roth: Pay Tax Now or Later",
          "es": "Traditional vs Roth: Pagar Impuestos Ahora o Después",
          "ko": "Traditional vs Roth: 지금 세금을 내느냐, 나중에 내느냐",
          "zh": "Traditional 与 Roth：现在缴税还是以后缴税",
          "ja": "TraditionalとRoth：税金を今払うか後で払うか"
        },
        "body": {
          "en": "Both the 401(k) and the IRA come in two versions that differ in exactly one place: when the tax bill comes due.\n\nA Traditional account is funded with money that hasn't been taxed yet — it lowers the saver's taxable income the year they contribute — but withdrawals in retirement are taxed as ordinary income. A Roth account works in reverse: it's funded with money that's already been taxed, so contributions don't reduce that year's taxable income, but qualified withdrawals in retirement are entirely tax-free, growth included.\n\nNeither version is universally better — it depends on a comparison nobody can make with certainty: is the saver's tax rate today higher or lower than it's likely to be decades from now, in retirement? A worker early in their career, likely earning less now than they will later, is often described as a candidate for Roth; a worker at peak career earnings, likely to have lower income in retirement, is often described as a candidate for Traditional. Both are simplifications of a genuinely individual, forward-looking tax question — not a rule that fits everyone, and not something this lesson can answer for any specific person.",
          "es": "Traditional se financia con dinero sin gravar (reduce el impuesto de este año), pero los retiros en la jubilación se gravan como ingreso normal.\n\nRoth se financia con dinero ya gravado, pero los retiros calificados en la jubilación son completamente libres de impuestos.\n\nCuál conviene depende de una comparación que nadie puede saber con certeza: la tasa de impuestos de hoy frente a la de dentro de décadas.",
          "ko": "Traditional은 아직 세금을 내지 않은 돈으로 채워져 올해 세금을 줄여주지만, 은퇴 후 인출 시 일반 소득으로 과세됩니다.\n\nRoth는 이미 세금을 낸 돈으로 채워지지만, 은퇴 후 적격 인출은 완전히 비과세입니다.\n\n어느 쪽이 유리한지는 아무도 확실히 알 수 없는 비교, 즉 오늘의 세율과 수십 년 후의 세율에 달려 있습니다.",
          "zh": "Traditional账户用尚未缴税的钱存入（能降低当年应税收入），但退休后取款要按普通收入缴税。\n\nRoth账户用已缴税的钱存入，但退休后符合条件的取款完全免税。\n\n哪种更合适取决于一个没人能确定的比较：今天的税率与几十年后的税率。",
          "ja": "Traditionalはまだ課税されていないお金で拠出し（その年の課税所得を減らせる）、退職後の引き出しは通常所得として課税されます。\n\nRothはすでに課税済みのお金で拠出しますが、退職後の適格な引き出しは完全に非課税です。\n\nどちらが有利かは、誰にも確実にはわからない比較——今日の税率と数十年後の税率——次第です。"
        }
      }
    ],
    "takeaway": {
      "en": "The account type doesn't change what you can invest in — it changes when the tax bill comes due. That single difference, compounded over decades, is why these accounts exist at all.",
      "es": "El tipo de cuenta no cambia en qué puedes invertir — cambia cuándo llega el impuesto. Esa diferencia, compuesta durante décadas, es la razón de ser de estas cuentas.",
      "ko": "계좌 종류는 무엇에 투자할 수 있는지를 바꾸지 않습니다 — 세금이 언제 부과되는지를 바꿀 뿐입니다. 이 한 가지 차이가 수십 년간 복리로 쌓이는 것이 바로 이 계좌들이 존재하는 이유입니다.",
      "zh": "账户类型不会改变你能投资什么——它改变的是税什么时候缴。这一个差异，经过几十年复利，正是这些账户存在的原因。",
      "ja": "口座の種類は投資できるものを変えません——変わるのは税金がいつ発生するかだけです。この一つの違いが数十年かけて複利で積み重なることこそ、これらの口座が存在する理由です。"
    },
    "thinkAbout": {
      "en": "Lesson 15 showed that starting early matters more than starting big, because compounding needs time above all else. A tax-advantaged account doesn't add extra return by itself — it just lets more of the growth compound undisturbed. Why might that matter more the earlier someone starts?",
      "es": "La lección 15 mostró que empezar temprano importa más que empezar en grande, porque la capitalización necesita tiempo sobre todo. ¿Por qué importaría más cuanto antes empieza alguien?",
      "ko": "15강에서는 복리가 무엇보다 시간을 필요로 하기 때문에 크게 시작하는 것보다 일찍 시작하는 것이 더 중요하다는 것을 보여주었습니다. 일찍 시작할수록 이것이 왜 더 중요할까요?",
      "zh": "第15课说明了早开始比多投入更重要，因为复利最需要的是时间。为什么开始得越早，这一点就越重要？",
      "ja": "第15課では、複利は何よりも時間を必要とするため、大きく始めるより早く始める方が重要だと示しました。早く始めるほど、なぜこれがより重要になるのでしょうか？"
    }
  },
  19: {
    "sections": [
      {
        "heading": {
          "en": "Tax Brackets Are Layers, Not a Single Rate",
          "es": "Los Tramos Fiscales Son Capas, No una Tasa Única",
          "ko": "세율 구간은 층이지 단일 세율이 아니다",
          "zh": "税级是分层的，不是单一税率",
          "ja": "税率区分は層であり、単一税率ではない"
        },
        "body": {
          "en": "Imagine income tax as a stack of buckets, each with its own rate, and money fills them from the bottom up. The first bucket might tax the first slice of income at a low rate; once that bucket is full, the next slice spills into a bucket taxed at a higher rate — but only that slice, not everything below it.\n\nThis is why a raise can never make your take-home pay go down, even if it pushes you into a new bracket. Say a worker's income grows enough to spill into a higher bucket. Only the new, additional slice of income — the part that overflowed into that higher bucket — gets taxed at the higher rate. Every dollar in the lower buckets keeps being taxed exactly as before.\n\nA common and costly misconception is thinking a raise, or a bonus, can leave you with less money overall by 'pushing you into a higher bracket.' It can't — it can only mean the marginal (extra) dollars are taxed a bit more, never that already-earned income gets taxed retroactively at the new, higher rate.",
          "es": "El impuesto sobre la renta funciona como una pila de cubos, cada uno con su propia tasa; el dinero los llena de abajo hacia arriba. Solo la porción que rebosa a un cubo superior se grava a la tasa más alta — no todo el ingreso.\n\nPor eso un aumento nunca puede reducir tu sueldo neto, aunque te empuje a un tramo superior. Es un error común y costoso pensar lo contrario.",
          "ko": "소득세는 각기 다른 세율을 가진 양동이가 쌓여 있는 것과 같습니다. 돈은 아래부터 채워집니다. 위 양동이로 넘친 부분만 더 높은 세율로 과세됩니다 — 전체 소득이 아닙니다.\n\n그래서 급여 인상이 더 높은 세율 구간으로 밀어 넣더라도 실수령액이 줄어드는 일은 절대 없습니다. 반대로 생각하는 것은 흔하지만 비용이 큰 오해입니다.",
          "zh": "所得税就像一叠水桶，每个水桶税率不同，钱从下往上填满。只有溢出到上层水桶的那部分才按更高税率征税——不是全部收入。\n\n所以加薪即使把你推入更高的税级，也绝不会让到手工资变少。认为相反是常见但代价不小的误解。",
          "ja": "所得税は、それぞれ異なる税率を持つバケツが積み重なっているようなものです。お金は下から満たされます。上のバケツにあふれた部分だけがより高い税率で課税されます——収入全体ではありません。\n\nだから昇給でより高い税率区分に押し上げられても、手取りが減ることは絶対にありません。逆だと考えるのはよくある、しかし代償の大きい誤解です。"
        }
      },
      {
        "heading": {
          "en": "Gross Pay, Net Pay, and Where the Difference Goes",
          "es": "Sueldo Bruto, Sueldo Neto y A Dónde Va la Diferencia",
          "ko": "총급여, 실수령액, 그리고 그 차이가 어디로 가는가",
          "zh": "税前工资、税后工资，以及差额去了哪里",
          "ja": "総支給額、手取り額、その差はどこへ行くのか"
        },
        "body": {
          "en": "Look at any pay stub and two numbers stand out: gross pay (everything earned before anything is taken out) and net pay (what actually lands in the bank account). The gap between them is usually more than just income tax.\n\nIn the US, a paycheck typically also has separate payroll taxes withheld — funding programs like Social Security and Medicare — plus, depending on the state, a state income tax on top of the federal one. All of it is usually withheld automatically by the employer before the money ever reaches the worker, which is why most people never have to hand over a lump sum at tax time — most of it was already collected paycheck by paycheck.\n\nThis connects directly to Lesson 18: a Traditional 401(k) or IRA contribution is subtracted from income before it's taxed, which is exactly why it lowers the taxable income shown on that pay stub in the first place — not a separate mechanism, but this same withholding process working on a smaller number.",
          "es": "En un recibo de sueldo destacan dos cifras: sueldo bruto y sueldo neto. La diferencia suele incluir más que solo el impuesto sobre la renta — en EE.UU., también hay impuestos de nómina (Seguro Social, Medicare) y, según el estado, impuesto estatal.\n\nEsto conecta con la Lección 18: una aportación a un 401(k) Traditional se resta del ingreso antes de calcular el impuesto, por eso reduce el ingreso gravable.",
          "ko": "급여명세서에는 총급여와 실수령액 두 숫자가 눈에 띕니다. 그 차이는 보통 소득세만이 아닙니다 — 미국에서는 사회보장세, 메디케어 같은 별도의 급여세와, 주에 따라 주소득세도 포함됩니다.\n\n이는 18강과 직접 연결됩니다: Traditional 401(k) 기여금은 과세 전 소득에서 공제되므로 과세 대상 소득이 줄어드는 것입니다.",
          "zh": "工资单上有两个数字很显眼：税前工资和税后工资。两者的差额通常不只是所得税——在美国还包括社保、医疗保险等单独的工资税，以及视州而定的州所得税。\n\n这与第18课直接相关：Traditional 401(k)的缴款是在计税前从收入中扣除的，这正是它降低应税收入的原因。",
          "ja": "給与明細には総支給額と手取り額という2つの数字が目立ちます。その差は通常、所得税だけではありません——米国では社会保障やメディケアなどの別の給与税、そして州によっては州所得税も含まれます。\n\nこれは第18課と直接つながっています：Traditional 401(k)の拠出は課税前の収入から差し引かれるため、課税対象の所得が下がるのです。"
        }
      }
    ],
    "takeaway": {
      "en": "Marginal tax brackets tax layers of income, not your whole income at one rate. A raise, a bonus, or extra freelance income can only ever add to your take-home pay, never subtract from it.",
      "es": "Los tramos fiscales gravan capas de ingreso, no todo el ingreso a una sola tasa. Un aumento nunca puede restar de tu sueldo neto, solo sumar.",
      "ko": "누진세 구간은 소득의 층을 과세하는 것이지, 전체 소득을 하나의 세율로 과세하는 것이 아닙니다. 급여 인상은 실수령액을 늘릴 뿐 절대 줄이지 않습니다.",
      "zh": "累进税级只对分层的收入征税，而不是用同一税率对全部收入征税。加薪只会增加你的到手工资，绝不会减少它。",
      "ja": "累進課税は所得の層に課税するのであり、所得全体を単一税率で課税するのではありません。昇給は手取りを増やすだけで、決して減らすことはありません。"
    },
    "thinkAbout": {
      "en": "Now that you understand how marginal brackets work, look back at Lesson 18's Traditional-vs-Roth question. A Traditional contribution reduces taxable income at today's marginal rate. Does that change how you'd think about the 'higher tax rate now vs. later' comparison that lesson described?",
      "es": "Ahora que entiendes los tramos marginales, piensa en la pregunta Traditional vs Roth de la Lección 18. Una aportación Traditional reduce el ingreso gravable a la tasa marginal de hoy. ¿Cambia eso tu forma de pensar la comparación?",
      "ko": "이제 한계세율 구간의 작동 방식을 이해했으니, 18강의 Traditional vs Roth 질문을 다시 생각해보세요. Traditional 기여금은 오늘의 한계세율로 과세 대상 소득을 줄입니다. 이것이 그 비교를 생각하는 방식을 바꾸나요?",
      "zh": "现在你已经理解了边际税级的运作方式，回想一下第18课的Traditional与Roth问题。Traditional缴款是按今天的边际税率减少应税收入的。这是否改变了你对那个比较的看法？",
      "ja": "限界税率区分の仕組みを理解した今、第18課のTraditional対Rothの問いを振り返ってみましょう。Traditionalの拠出は今日の限界税率で課税所得を減らします。これはその比較についての考え方を変えますか？"
    }
  },
  20: {
    "sections": [
      {
        "heading": {
          "en": "Insurance Pools Risk Across Many People",
          "es": "El Seguro Agrupa el Riesgo Entre Muchas Personas",
          "ko": "보험은 많은 사람들 사이에 위험을 분산시킨다",
          "zh": "保险将风险分摊到许多人身上",
          "ja": "保険は多くの人にリスクを分散させる"
        },
        "body": {
          "en": "Picture a neighborhood of a thousand homes. In any given year, maybe two or three will have a serious fire, but nobody knows in advance which ones. If each homeowner had to cover a fire's full cost alone, a handful of unlucky families would face a devastating loss while everyone else paid nothing.\n\nInsurance changes that math. Every homeowner pays a relatively small amount — the premium — into a shared pool. The insurer uses that pool to pay the full cost for the few homes that do have a fire that year. Nobody knows in advance whether they'll be one of the unlucky few, so everyone trades a small, certain cost (the premium) for protection against a large, uncertain one (rebuilding a house from nothing).\n\nThis is the same underlying idea across every type of insurance — health, auto, home or renters, life — just applied to a different kind of risk: a large group of people facing the same category of unpredictable loss, pooling small contributions so the few who actually experience it aren't left to cover it alone.",
          "es": "Imagina un vecindario de mil casas. En un año dado, quizás dos o tres tendrán un incendio grave, pero nadie sabe cuáles de antemano. El seguro agrupa el riesgo: cada propietario paga una prima relativamente pequeña a un fondo compartido, y ese fondo cubre el costo total para las pocas casas que sí tienen un incendio.\n\nNadie sabe de antemano si será de los pocos desafortunados, así que todos cambian un costo pequeño y seguro (la prima) por protección ante uno grande e incierto. Es la misma idea detrás de cualquier tipo de seguro — salud, auto, hogar, vida — aplicada a un tipo distinto de riesgo.",
          "ko": "천 채의 집이 있는 동네를 상상해 보세요. 어느 해든 두세 채 정도는 심각한 화재를 겪지만, 누가 그럴지는 아무도 미리 알 수 없습니다. 보험은 이 계산을 바꿉니다: 모든 집주인이 비교적 적은 금액인 보험료를 공동 기금에 냅니다. 그 기금은 그해 실제로 화재를 겪은 소수의 집에 전체 비용을 지급합니다.\n\n누구도 자신이 그 불운한 소수가 될지 미리 알 수 없기 때문에, 모두가 작고 확실한 비용(보험료)을 크고 불확실한 비용(집을 처음부터 다시 짓는 것)에 대한 보호와 맞바꿉니다. 건강, 자동차, 주택, 생명 등 어떤 보험이든 같은 원리가 다른 종류의 위험에 적용될 뿐입니다.",
          "zh": "想象一个有一千户人家的社区。在任何一年里，也许只有两三户会遭遇严重火灾，但事先没人知道会是哪几户。保险改变了这个算法：每个房主向共同基金支付相对较小的一笔钱——保费，而这个基金会为当年真正发生火灾的少数房屋支付全部损失。\n\n由于没人能事先知道自己会不会是那不幸的少数，所有人都是在用一笔小额且确定的支出（保费）换取对一笔巨额且不确定的损失（从零开始重建房屋）的保护。健康险、车险、房屋险、寿险背后都是同一个原理，只是应用在不同类型的风险上。",
          "ja": "千戸の住宅がある地域を想像してください。ある年、深刻な火災に遭うのはおそらく2、3戸ですが、それがどの家かは誰も事前にわかりません。保険はこの計算を変えます：すべての住宅所有者が比較的少額の保険料を共同の基金に払い込み、その基金がその年実際に火災に遭った少数の住宅に全額を支払います。\n\n自分がその不運な少数になるかどうかは誰にも事前にわからないため、全員が小さく確実な費用（保険料）を、大きく不確実な費用（家をゼロから建て直すこと）への備えと交換しているのです。医療保険、自動車保険、住宅保険、生命保険——どれも同じ原理が異なる種類のリスクに適用されているだけです。"
        }
      },
      {
        "heading": {
          "en": "Premiums, Deductibles, and Coverage Limits",
          "es": "Primas, Deducibles y Límites de Cobertura",
          "ko": "보험료, 자기부담금, 보장 한도",
          "zh": "保费、免赔额与保额上限",
          "ja": "保険料、自己負担額、補償上限"
        },
        "body": {
          "en": "Three numbers shape almost every insurance policy. The premium is the recurring amount paid to keep the coverage active, whether or not a claim is ever filed. The deductible is the amount the policyholder pays out of pocket before the insurer starts paying anything on a claim. The coverage limit is the maximum the insurer will pay out, even if the actual loss is larger.\n\nThese three interact directly. A policy with a higher deductible generally carries a lower premium, because the policyholder is agreeing to absorb more of the smaller, more common losses themselves — the insurer only steps in once things get more expensive. A policy with a lower deductible generally carries a higher premium, since the insurer is taking on more of the cost from the very first dollar.\n\nThat trade-off — a bit more paid every month versus a bit more paid out of pocket if something goes wrong — depends on an individual's own finances, risk tolerance, and circumstances, not a rule this lesson can hand out. The goal here is understanding how the pieces fit together, not which combination is right for any specific person.",
          "es": "Tres cifras dan forma a casi toda póliza. La prima es el pago recurrente para mantener la cobertura activa. El deducible es lo que el asegurado paga de su bolsillo antes de que el asegurador empiece a pagar un reclamo. El límite de cobertura es el máximo que el asegurador pagará.\n\nUn deducible más alto generalmente implica una prima más baja, y viceversa. Ese balance depende de las finanzas y circunstancias de cada persona, no de una regla que esta lección pueda dar.",
          "ko": "거의 모든 보험 상품은 세 가지 숫자로 구성됩니다. 보험료는 보장을 유지하기 위해 정기적으로 내는 금액입니다. 자기부담금은 보험사가 보험금을 지급하기 전에 가입자가 먼저 부담하는 금액입니다. 보장 한도는 보험사가 지급하는 최대 금액입니다.\n\n자기부담금이 높을수록 보통 보험료는 낮아지고, 그 반대도 마찬가지입니다. 이 균형은 특정한 규칙이 아니라 개인의 재정 상황과 위험 감수 성향에 따라 달라집니다.",
          "zh": "几乎每份保单都由三个数字决定。保费是为维持保障而定期支付的金额。免赔额是保险公司开始理赔前，投保人自己先承担的金额。保额上限是保险公司最多会赔付的金额。\n\n免赔额越高，保费通常越低，反之亦然。这种权衡取决于每个人自身的财务状况和风险承受能力，而不是本课能给出的固定规则。",
          "ja": "ほとんどの保険契約は3つの数字で決まります。保険料は補償を維持するために定期的に支払う金額です。自己負担額は、保険会社が保険金を支払う前に契約者が自分で負担する金額です。補償上限は保険会社が支払う最大金額です。\n\n自己負担額が高いほど、通常は保険料が低くなり、その逆もまた同じです。この兼ね合いは、個人の財政状況やリスク許容度によって決まるものであり、この講で答えを出せる規則ではありません。"
        }
      }
    ],
    "takeaway": {
      "en": "Insurance doesn't eliminate risk — it pools it across many people so that a rare, large loss for one person becomes a small, predictable cost for everyone. Premiums, deductibles, and coverage limits are the three levers that shape that trade-off.",
      "es": "El seguro no elimina el riesgo — lo agrupa entre muchas personas para que una pérdida grande y rara se convierta en un costo pequeño y predecible para todos. Prima, deducible y límite de cobertura son las tres palancas de ese balance.",
      "ko": "보험은 위험을 없애는 것이 아니라 여러 사람에게 분산시켜, 한 사람에게 드물게 발생하는 큰 손실을 모두에게 작고 예측 가능한 비용으로 바꿉니다. 보험료, 자기부담금, 보장 한도가 이 균형을 결정하는 세 가지 요소입니다.",
      "zh": "保险并不能消除风险——它把风险分摊到许多人身上，让一个人身上罕见的巨大损失，变成所有人都可预期的小额成本。保费、免赔额和保额上限是决定这一权衡的三个关键因素。",
      "ja": "保険はリスクをなくすものではなく、多くの人に分散させることで、一人に稀に起こる大きな損失を、全員にとって予測可能な小さな費用に変えるものです。保険料、自己負担額、補償上限がこの兼ね合いを形作る3つの要素です。"
    },
    "thinkAbout": {
      "en": "Lesson 14 covered building an emergency fund for unexpected expenses. Insurance and an emergency fund solve related but different problems — one pools risk across many people for losses too large for most individual budgets, the other is money set aside by one person for smaller, more everyday surprises. Can you think of a loss each one would be better suited to cover?",
      "es": "La Lección 14 trató sobre construir un fondo de emergencia. El seguro y un fondo de emergencia resuelven problemas relacionados pero distintos. ¿Puedes pensar en una pérdida que cada uno cubriría mejor?",
      "ko": "14강에서는 비상금 마련을 다뤘습니다. 보험과 비상금은 관련이 있지만 서로 다른 문제를 해결합니다. 각각이 더 잘 대응할 수 있는 손실을 생각해볼 수 있나요?",
      "zh": "第14课讲过建立应急基金。保险和应急基金解决的是相关但不同的问题。你能想到哪种损失更适合由哪一种来应对吗？",
      "ja": "第14課では緊急資金の準備について学びました。保険と緊急資金は関連していますが、異なる問題を解決します。それぞれがより適切に対応できる損失を考えてみてください。"
    }
  },
  21: {
    "sections": [
      {
        "heading": {
          "en": "Why a Dollar Buys Less Over Time",
          "es": "Por Qué un Dólar Compra Menos Con el Tiempo",
          "ko": "시간이 지나면 돈의 구매력이 줄어드는 이유",
          "zh": "为什么一美元随时间贬值",
          "ja": "なぜ時間とともにお金の価値は下がるのか"
        },
        "body": {
          "en": "Ask a grandparent what a movie ticket or a loaf of bread cost when they were young, and the number will sound tiny. That's not because those things got more valuable — it's the flip side of Lesson 4's definition of inflation: when spending and incomes across an economy grow faster than the goods and services actually produced, prices rise. Repeated year after year, that steady rise means the same dollar buys a little less each year than it did before.\n\nThis matters most for money that just sits still. Picture $1,000 in cash kept in a drawer for twenty years, never touched. The number printed on those bills never changes — it's still $1,000. But the groceries, gas, and rent that $1,000 could have covered on day one would cost noticeably more twenty years later, meaning that same stack of bills now covers less of ordinary life than it used to.\n\nThis isn't a flaw unique to cash in a drawer — it's what inflation does to purchasing power generally, whether the money is in a drawer, a low-interest savings account, or anywhere else that doesn't grow fast enough to keep up.",
          "es": "Pregúntale a un abuelo cuánto costaba una entrada de cine cuando era joven — sonará minúsculo. No es que esas cosas se volvieran más valiosas; es el reverso de la inflación (Lección 4): cuando el gasto crece más rápido que lo que se produce, los precios suben, año tras año.\n\nEsto importa más para el dinero que no se mueve. $1,000 guardados en un cajón durante veinte años siguen siendo $1,000 en el papel, pero compran menos vida cotidiana que antes.",
          "ko": "할아버지, 할머니께 젊었을 때 영화표 가격을 물어보면 아주 작게 들릴 것입니다. 그것들이 더 가치 있어져서가 아니라, 4강에서 배운 인플레이션의 반대편입니다: 지출과 소득이 생산보다 빠르게 늘면 가격이 오릅니다. 이것이 해마다 반복되면 같은 돈으로 살 수 있는 것이 조금씩 줄어듭니다.\n\n이는 가만히 있는 돈에 가장 크게 적용됩니다. 서랍 속 1,000달러는 20년이 지나도 여전히 1,000달러지만, 그때 살 수 있었던 만큼의 생필품을 이제는 살 수 없습니다.",
          "zh": "问问祖父母年轻时一张电影票多少钱，那个数字听起来会小得惊人。这不是因为那些东西变得更值钱了，而是第4课通胀定义的另一面：当支出和收入的增长快于实际生产的商品和服务时，价格就会上涨。年复一年，同样的钱能买到的东西就会一点点变少。\n\n这对静止不动的钱影响最大。抽屉里放二十年的1000美元，票面数字始终是1000，但能买到的日常用品却比当初少了。",
          "ja": "祖父母に、若い頃の映画のチケット代を聞いてみてください。とても小さな金額に聞こえるはずです。それらの価値が上がったからではなく、第4課で学んだインフレの裏返しです：支出と所得が実際に生産される財やサービスより速く増えると、物価が上がります。これが毎年繰り返されると、同じお金で買えるものが少しずつ減っていきます。\n\nこれは動かないお金に最も大きく影響します。引き出しに20年間しまわれた1,000ドルは紙の上では今も1,000ドルですが、当時買えた日用品の量はもう買えません。"
        }
      },
      {
        "heading": {
          "en": "Real Return vs Nominal Return",
          "es": "Rendimiento Real vs Rendimiento Nominal",
          "ko": "실질 수익률 vs 명목 수익률",
          "zh": "实际回报率 vs 名义回报率",
          "ja": "実質リターン vs 名目リターン"
        },
        "body": {
          "en": "A savings account that pays interest sounds like it's protecting against this problem — the balance grows every year, after all. But the number on the statement is the nominal return: growth measured in plain dollars, without asking what those dollars can actually buy.\n\nThe real return strips inflation back out: roughly, real return ≈ nominal return − inflation rate. If an account grows by a modest percentage in a year where prices across the economy rose by a similar or larger percentage, the balance is bigger in dollar terms but roughly flat — or even shrinking — in terms of what it can actually purchase. A bigger number on the screen doesn't automatically mean more real wealth.\n\nThis is exactly why Lesson 15's point about compounding matters so much: compounding needs to outpace inflation, not just be positive, for an account's growth to translate into growing purchasing power rather than merely growing numbers.",
          "es": "Una cuenta de ahorros con interés parece proteger contra esto — el saldo crece cada año. Pero ese número es el rendimiento nominal: crecimiento en dólares simples, sin preguntar qué pueden comprar esos dólares.\n\nEl rendimiento real resta la inflación: rendimiento real ≈ rendimiento nominal − inflación. Un saldo mayor en dólares no siempre significa más riqueza real.",
          "ko": "이자를 주는 저축 계좌는 이 문제를 막아주는 것처럼 보입니다 — 잔고가 매년 늘어나니까요. 하지만 그 숫자는 명목 수익률입니다: 단순히 달러로 측정한 성장일 뿐, 그 달러로 무엇을 살 수 있는지는 묻지 않습니다.\n\n실질 수익률은 인플레이션을 뺀 것입니다: 대략 실질 수익률 ≈ 명목 수익률 − 인플레이션율. 화면 속 더 큰 숫자가 항상 더 많은 실질 부를 의미하지는 않습니다.",
          "zh": "有利息的储蓄账户看起来能防止这个问题——毕竟余额每年都在增长。但那个数字是名义回报率：只是用美元衡量的增长，并没有问这些美元实际能买到什么。\n\n实际回报率则把通胀去掉：大致是 实际回报率 ≈ 名义回报率 − 通胀率。屏幕上更大的数字不一定意味着更多的实际财富。",
          "ja": "利息の付く預金口座は、この問題を防いでくれるように見えます——残高が毎年増えるのですから。しかしその数字は名目リターンです：単にドルで測った増加であり、そのドルで実際に何が買えるかは問いません。\n\n実質リターンはインフレを差し引いたものです：おおよそ 実質リターン ≈ 名目リターン − インフレ率。画面上の大きな数字が、必ずしもより多くの実質的な富を意味するわけではありません。"
        }
      }
    ],
    "takeaway": {
      "en": "A growing account balance isn't the same as growing wealth. What matters is the real return — nominal growth minus inflation — because that's what determines whether your money's actual purchasing power is rising or falling.",
      "es": "Un saldo creciente no es lo mismo que riqueza creciente. Lo que importa es el rendimiento real — crecimiento nominal menos inflación.",
      "ko": "잔고가 느는 것이 부가 느는 것과 같지는 않습니다. 중요한 것은 실질 수익률 — 명목 성장에서 인플레이션을 뺀 것 — 입니다.",
      "zh": "余额增长不等于财富增长。重要的是实际回报率——名义增长减去通胀。",
      "ja": "残高が増えることは富が増えることと同じではありません。重要なのは実質リターン——名目成長からインフレを引いたもの——です。"
    },
    "thinkAbout": {
      "en": "Lesson 15 showed how compounding rewards time above almost everything else. Now add inflation to that picture: money that sits still, even in an account with a small positive interest rate, can still lose real purchasing power every year inflation outpaces it. Does that change how you think about the difference between saving and simply not spending?",
      "es": "La Lección 15 mostró que la capitalización premia el tiempo sobre casi todo lo demás. Ahora añade la inflación: el dinero quieto, incluso con un poco de interés, puede perder poder adquisitivo real cada año que la inflación lo supere. ¿Cambia eso tu forma de pensar sobre ahorrar frente a simplemente no gastar?",
      "ko": "15강에서는 복리가 거의 모든 것보다 시간을 우대한다는 것을 보여주었습니다. 이제 인플레이션을 더해보세요: 작은 양의 이자가 붙어도 가만히 있는 돈은 인플레이션이 앞지르는 해마다 실질 구매력을 잃을 수 있습니다. 이것이 저축과 단순히 쓰지 않는 것의 차이를 생각하는 방식을 바꾸나요?",
      "zh": "第15课说明了复利几乎比其他任何因素都更重视时间。现在把通胀也加进来看：即使有一点正利息，静止不动的钱也会在通胀超过它的每一年损失实际购买力。这是否改变了你对\"储蓄\"和\"仅仅不花钱\"之间区别的看法？",
      "ja": "第15課では、複利がほぼ何よりも時間を重視することを示しました。ここにインフレを加えてみましょう：わずかなプラスの利息がついていても、動かないお金はインフレがそれを上回る年ごとに実質的な購買力を失う可能性があります。これは、貯蓄と単に使わないことの違いについての考え方を変えますか？"
    }
  },
  22: {
    "sections": [
      {
        "heading": {
          "en": "Employee (W-2) or Independent Contractor (1099)?",
          "es": "¿Empleado (W-2) o Contratista Independiente (1099)?",
          "ko": "직원(W-2)인가, 독립계약자(1099)인가?",
          "zh": "雇员（W-2）还是独立承包商（1099）？",
          "ja": "従業員（W-2）か独立契約者（1099）か？"
        },
        "body": {
          "en": "A W-2 and a 1099 are both tax forms a worker receives each January summarizing the previous year's pay — but which one you get depends on your working relationship, not your job title. A W-2 means you're an employee: your employer directs how, when, and where the work gets done, and — as Lesson 19 covered — automatically withholds income tax and payroll taxes from every paycheck. A 1099 means you were paid as an independent contractor: a business or client paid you for a service, but nothing was withheld, and no employer relationship existed.\n\nThe same kind of work can show up either way. A graphic designer on staff at an agency, with set hours and a manager, gets a W-2. A graphic designer who takes freelance projects for different clients, sets her own hours, and uses her own equipment gets a 1099 from each client who paid her over a threshold. The distinction isn't about what work was done — it's about who controls how it gets done, and it changes what happens with taxes.",
          "es": "Un W-2 y un 1099 son formularios fiscales que resumen tus ingresos del año anterior. El W-2 significa que eres empleado: el empleador retiene automáticamente impuestos de cada cheque (Lección 19). El 1099 significa que trabajaste como contratista independiente: nadie retuvo nada. La diferencia no es el tipo de trabajo, sino quién controla cómo se hace — y eso cambia todo en materia de impuestos.",
          "ko": "W-2와 1099는 전년도 소득을 요약하는 세금 서류입니다. W-2는 직원임을 의미하며, 고용주가 매 급여에서 자동으로 세금을 원천징수합니다(19강 참고). 1099는 독립계약자로 일했음을 의미하며, 아무것도 원천징수되지 않습니다. 차이는 어떤 일을 했느냐가 아니라 누가 일하는 방식을 통제하느냐이며, 이는 세금 처리 방식을 완전히 바꿉니다.",
          "zh": "W-2和1099都是总结上一年收入的报税表。W-2意味着你是雇员：雇主会自动从每次薪水中代扣税款（见第19课）。1099意味着你是以独立承包商身份获得报酬：没有任何代扣。区别不在于做了什么工作，而在于谁掌控工作方式——这彻底改变了税务处理方式。",
          "ja": "W-2と1099はどちらも前年の所得をまとめた税務書類です。W-2は従業員であることを意味し、雇用主が毎回の給料から自動的に税金を源泉徴収します（第19課参照）。1099は独立契約者として報酬を受け取ったことを意味し、何も源泉徴収されません。違いはどんな仕事をしたかではなく、誰が仕事のやり方を管理するかであり、それが税金の扱いを大きく変えます。"
        }
      },
      {
        "heading": {
          "en": "The Self-Employment Tax: Paying Both Halves",
          "es": "El Impuesto de Trabajo por Cuenta Propia: Pagando Ambas Mitades",
          "ko": "자영업세: 양쪽 절반을 모두 부담하기",
          "zh": "自雇税：承担两份负担",
          "ja": "自営業税：両方の半分を自分で払う"
        },
        "body": {
          "en": "Lesson 19 explained that a paycheck's gap between gross and net includes payroll taxes funding Social Security and Medicare — and that an employer normally withholds and pays part of that automatically. What that lesson didn't say: the employer isn't paying that payroll tax alone. It's split roughly in half between employer and employee, with the employer's half never even appearing on the employee's pay stub.\n\nA 1099 contractor has no employer to cover that other half — so a self-employed person owes both halves themselves, a combined self-employment tax on top of ordinary income tax. Because nothing is automatically withheld from a 1099 payment the way it is from a W-2 paycheck, the responsibility shifts entirely onto the worker: setting money aside from every payment, and — depending on how much is owed — sending estimated tax payments to the IRS quarterly throughout the year rather than paying everything at once the following spring.\n\nThis is exactly why freelancers, gig workers, and small-business owners are consistently told to set aside roughly a quarter to a third of what they earn before it ever reaches their checking account: on a W-2, that setting-aside already happened automatically, paycheck by paycheck.",
          "es": "La Lección 19 explicó que parte de la diferencia entre el sueldo bruto y el neto son los impuestos de nómina (Seguro Social, Medicare), divididos aproximadamente a la mitad entre empleador y empleado. Un contratista 1099 no tiene empleador que pague esa otra mitad — así que debe pagar ambas mitades él mismo, el llamado impuesto de trabajo por cuenta propia, además del impuesto sobre la renta normal. Como nada se retiene automáticamente, el trabajador independiente debe apartar dinero de cada pago y a menudo enviar pagos de impuestos estimados trimestralmente al IRS.",
          "ko": "19강에서는 총급여와 실수령액의 차이 중 일부가 사회보장세·메디케어 같은 급여세이며, 이는 고용주와 직원이 대략 절반씩 부담한다고 설명했습니다. 1099 계약자에게는 그 절반을 대신 내줄 고용주가 없으므로, 본인이 양쪽 절반을 모두 부담하는 '자영업세'를 일반 소득세에 더해 내야 합니다. 자동으로 원천징수되는 것이 없기 때문에, 프리랜서는 매 지급액에서 스스로 돈을 떼어 놓고 IRS에 분기별로 추정세를 납부해야 하는 경우가 많습니다.",
          "zh": "第19课解释过，税前和税后工资之间的差额部分是社保、医疗保险等工资税，大约由雇主和雇员各承担一半。1099承包商没有雇主替自己承担另一半，所以自雇者要自己承担两半，即在普通所得税之外还要缴纳自雇税。由于没有任何自动代扣，独立工作者必须自己从每笔收入中留出税款，通常还需要每季度向IRS缴纳预估税款。",
          "ja": "第19課では、総支給額と手取り額の差の一部が社会保障やメディケアなどの給与税であり、それが雇用主と従業員でおおよそ半分ずつ負担されると説明しました。1099の契約者にはその半分を負担してくれる雇用主がいないため、自営業者は両方の半分を自分で負担する「自営業税」を通常の所得税に加えて払う必要があります。自動的に源泉徴収されるものが何もないため、フリーランスは各支払いから自分でお金を取り分け、四半期ごとにIRSへ見積納税を行うことが多くなります。"
        }
      }
    ],
    "takeaway": {
      "en": "The same work can arrive as a W-2 or a 1099, and that single distinction decides whether taxes are withheld automatically or become the worker's own responsibility to set aside and pay — including a self-employment tax that covers the half an employer would otherwise pay.",
      "es": "El mismo trabajo puede llegar como W-2 o 1099, y esa distinción decide si los impuestos se retienen automáticamente o si el trabajador debe apartarlos y pagarlos él mismo — incluido un impuesto de trabajo por cuenta propia que cubre la mitad que normalmente paga el empleador.",
      "ko": "같은 일이라도 W-2로 받느냐 1099로 받느냐에 따라 세금이 자동으로 원천징수되는지, 아니면 근로자 본인이 직접 떼어 내고 납부해야 하는지가 결정됩니다 — 여기에는 고용주가 원래 부담했을 절반을 대신 내는 자영업세도 포함됩니다.",
      "zh": "同样的工作可能以W-2或1099的形式到来，这一区别决定了税款是自动代扣，还是需要工作者自己留出并缴纳——包括覆盖雇主本应承担那一半的自雇税。",
      "ja": "同じ仕事でもW-2として来るか1099として来るかで、税金が自動的に源泉徴収されるか、それとも働く本人が自分で取り分けて納めなければならないかが決まります——本来雇用主が負担するはずの半分をカバーする自営業税も含めてです。"
    },
    "thinkAbout": {
      "en": "Lesson 19 showed that a raise can never shrink your take-home pay because payroll withholding just takes a slightly bigger automatic slice. Now picture that same raise arriving as 1099 income instead — with nothing withheld at all. Does thinking through what you'd need to set aside yourself change how you'd size up a freelance opportunity against a salaried one paying the same headline number?",
      "es": "La Lección 19 mostró que un aumento nunca reduce tu sueldo neto, porque la retención automática solo toma una porción algo mayor. Ahora imagina ese mismo aumento llegando como ingreso 1099 — sin nada retenido. ¿Cambia eso cómo evaluarías una oportunidad freelance frente a un salario con el mismo número nominal?",
      "ko": "19강에서는 급여 인상이 실수령액을 절대 줄이지 않는다는 것을 보여주었습니다. 자동 원천징수가 그저 조금 더 큰 몫을 가져갈 뿐이기 때문입니다. 이제 같은 인상분이 1099 소득으로 들어온다고 상상해보세요 — 아무것도 원천징수되지 않습니다. 스스로 떼어 놓아야 할 금액을 계산해보는 것이, 같은 명목 금액의 정규직 급여와 프리랜서 기회를 비교하는 방식을 바꾸나요?",
      "zh": "第19课说明了加薪永远不会让到手工资变少，因为自动代扣只是多拿走了稍大的一部分。现在设想同样的加薪以1099收入的形式到来——完全没有任何代扣。想清楚自己需要留出多少钱，是否会改变你比较自由职业机会和相同名义数字的受薪工作时的看法？",
      "ja": "第19課では、昇給が手取りを減らすことは絶対にないと示しました。自動源泉徴収がやや大きめの分を取るだけだからです。今度は同じ昇給が1099所得として、何も源泉徴収されずに入ってくると想像してください。自分で取り分けるべき金額を考えることは、同じ額面の給与職と比べてフリーランスの機会をどう評価するかを変えますか？"
    }
  },
  23: {
    "sections": [
      {
        "heading": {
          "en": "The Expense Ratio: A Fee You Never Get a Bill For",
          "es": "El Ratio de Gastos: Una Comisión Que Nunca Te Facturan",
          "ko": "운용보수: 청구서가 오지 않는 수수료",
          "zh": "费用率：一笔从不给你开账单的费用",
          "ja": "経費率：請求書が来ない手数料"
        },
        "body": {
          "en": "Mutual funds and ETFs charge an annual fee called an expense ratio, expressed as a percentage of the money invested — for example, 0.05% or 1.00% per year. Unlike a phone bill or a subscription, nothing arrives in the mail asking to be paid: the fund simply deducts a small slice of the fund's total assets continuously, so the balance an investor sees has already had the fee taken out. That invisibility is exactly what makes it easy to ignore — there's no moment where the cost becomes obvious.\n\nExpense ratios vary enormously for reasons that have nothing to do with quality. A fund that simply tracks a market index (Lesson 17's diversification idea, done automatically) needs little human decision-making to run, so index funds commonly charge 0.03%-0.20% a year. A fund where a manager actively picks investments, trying to beat the market, costs more to run and commonly charges 0.5%-1.5% a year — and Lesson 17's own point about diversification applies here too: most actively managed funds don't reliably beat a comparable index fund after fees, over long periods.",
          "es": "Los fondos mutuos y ETFs cobran una comisión anual llamada ratio de gastos, expresada como porcentaje del dinero invertido. A diferencia de una factura de teléfono, nada llega pidiendo ser pagado: el fondo simplemente deduce continuamente una pequeña porción de los activos totales, así que el saldo que ve el inversionista ya tiene la comisión descontada. Esa invisibilidad es justo lo que la hace fácil de ignorar.\n\nLos ratios de gastos varían enormemente. Un fondo que simplemente sigue un índice de mercado suele cobrar 0.03%-0.20% al año. Un fondo con un gestor que elige activamente las inversiones suele cobrar 0.5%-1.5% al año — y la mayoría de los fondos gestionados activamente no superan de forma confiable a un fondo índice comparable después de comisiones, a largo plazo.",
          "ko": "뮤추얼펀드와 ETF는 운용보수라는 연간 수수료를 투자 금액의 비율로 부과합니다. 휴대폰 요금처럼 청구서가 오는 게 아니라, 펀드가 총자산에서 조금씩 계속 떼어가기 때문에 투자자가 보는 잔고에는 이미 수수료가 빠져 있습니다. 이렇게 보이지 않는다는 점이 바로 무시하기 쉽게 만드는 이유입니다.\n\n운용보수는 크게 차이가 납니다. 시장 지수를 그대로 추종하는 펀드는 보통 연 0.03%~0.20%를 부과합니다. 매니저가 적극적으로 투자를 고르는 펀드는 보통 연 0.5%~1.5%를 부과합니다 — 그리고 대부분의 액티브 펀드는 장기적으로 수수료를 뺀 후에는 비교 가능한 인덱스 펀드를 꾸준히 이기지 못합니다.",
          "zh": "共同基金和ETF会收取一种叫做费用率的年费，以投资金额的百分比表示。和电话账单不同，没有任何账单寄来要求付款：基金只是持续从总资产中扣除一小部分，所以投资者看到的余额已经是扣除费用之后的了。这种看不见正是它容易被忽视的原因。\n\n费用率差异很大。单纯跟踪市场指数的基金通常每年收取0.03%-0.20%。由基金经理主动挑选投资的基金通常每年收取0.5%-1.5%——而且从长期看，大多数主动管理型基金在扣除费用后并不能可靠地跑赢可比的指数基金。",
          "ja": "投資信託やETFは、投資額に対する割合で表される経費率という年間手数料を課します。電話料金と違い、支払いを求める請求書が届くことはありません。ファンドは総資産から少しずつ継続的に差し引くため、投資家が目にする残高にはすでに手数料が引かれています。この見えなさこそが、無視されやすい理由です。\n\n経費率は大きく異なります。市場指数にただ連動するファンドは通常年0.03%〜0.20%を課します。運用者が積極的に投資先を選ぶファンドは通常年0.5%〜1.5%を課します——そして長期で見ると、ほとんどのアクティブ運用ファンドは手数料差し引き後、比較可能なインデックスファンドに確実には勝てません。"
        }
      },
      {
        "heading": {
          "en": "Why a Small Fee Becomes a Large One",
          "es": "Por Qué Una Comisión Pequeña Se Vuelve Grande",
          "ko": "작은 수수료가 큰 수수료가 되는 이유",
          "zh": "为什么小额费用会变成大额费用",
          "ja": "小さな手数料が大きくなる理由"
        },
        "body": {
          "en": "Lesson 15 showed that money grows fastest when compounding has the most years to work — and that the same math works against you with debt, where unpaid interest compounds too. A fee works exactly like that unpaid interest: it's subtracted every single year, including from the growth the fee took in prior years, so its cost compounds right alongside the investment's returns.\n\nSay $10,000 is invested for 30 years at a 7% annual return. In a fund charging 0.05%, fees are barely noticeable and the balance grows to roughly $76,000. In a fund charging 1.05% — a difference of exactly one percentage point — the effective annual growth rate drops to about 6%, and the balance reaches only around $57,000. That one-point difference, compounded over 30 years, consumed roughly a quarter of the total balance — not because the fee was charged once, but because it was charged every year on money that would otherwise have kept compounding.\n\nThis doesn't mean the cheapest fund is always the right choice, or that every fee is unjustified — some strategies genuinely cost more to run. But because a fee is guaranteed and compounds for as long as the money is invested, while a fund's future performance is not guaranteed, checking a fund's expense ratio before investing is one of the few things an investor can know for certain in advance.",
          "es": "La Lección 15 mostró que el dinero crece más rápido cuando el interés compuesto tiene más años para trabajar — y que la misma matemática funciona en tu contra con deudas, donde el interés no pagado también se compone. Una comisión funciona igual: se resta cada año, incluso sobre el crecimiento que la comisión ya se llevó en años anteriores.\n\nCon $10,000 invertidos 30 años a un 7% anual: con una comisión de 0.05%, el saldo llega a unos $76,000. Con una comisión de 1.05% — solo un punto porcentual de diferencia — el saldo llega a apenas unos $57,000. Esa diferencia de un punto, compuesta durante 30 años, se llevó aproximadamente una cuarta parte del saldo total.\n\nEsto no significa que el fondo más barato siempre sea la mejor opción. Pero como la comisión es segura y se compone mientras el dinero esté invertido, mientras que el desempeño futuro no lo es, revisar el ratio de gastos antes de invertir es algo que un inversionista puede saber con certeza de antemano.",
          "ko": "15강에서는 복리가 작동할 시간이 많을수록 돈이 더 빨리 불어나며, 갚지 않은 이자에도 이자가 붙어 부채에서는 같은 수학이 불리하게 작동한다고 설명했습니다. 수수료도 똑같이 작동합니다: 수수료는 매년 공제되며, 심지어 이전 연도에 수수료가 이미 떼어간 성장분에서도 다시 공제됩니다.\n\n$10,000를 연 7% 수익률로 30년간 투자한다고 하면, 수수료 0.05%인 펀드는 잔고가 약 $76,000까지 자랍니다. 수수료 1.05%인 펀드는 — 단 1%포인트 차이인데 — 잔고가 약 $57,000에 그칩니다. 이 1%포인트 차이가 30년간 복리로 쌓여 전체 잔고의 약 4분의 1을 가져간 것입니다.\n\n이것이 가장 저렴한 펀드가 항상 최선이라는 뜻은 아닙니다. 하지만 수수료는 확실하고 투자 기간 내내 복리로 쌓이는 반면, 펀드의 미래 성과는 확실하지 않으므로, 투자 전에 운용보수를 확인하는 것은 투자자가 미리 확실히 알 수 있는 몇 안 되는 것 중 하나입니다.",
          "zh": "第15课说明，复利运作的年数越多，钱增长得越快——同样的数学在债务上对你不利，因为未偿还的利息也会产生复利。费用的运作方式与此完全相同：它每年都会被扣除，甚至会从费用在前几年已经拿走的增长部分中再次扣除。\n\n假设10,000美元以7%的年回报率投资30年：在收费0.05%的基金中，余额会增长到约76,000美元。在收费1.05%的基金中——仅相差一个百分点——余额只能达到约57,000美元。这一个百分点的差异，经过30年的复利累积，吞掉了总余额的大约四分之一。\n\n这并不意味着最便宜的基金总是最佳选择。但由于费用是确定的，并且只要资金还在投资中就会持续复利累积，而基金未来的表现并不确定，因此在投资前查看基金的费用率是投资者事先能够确定知道的少数事情之一。",
          "ja": "第15課では、複利が働く年数が多いほどお金は速く増えること、そして未払いの利息にも利息がつくため、借金では同じ数学が不利に働くことを示しました。手数料もまったく同じように働きます：手数料は毎年差し引かれ、しかも前年までに手数料がすでに奪った成長分からも再び差し引かれます。\n\n10,000ドルを年7%の利回りで30年間投資したとします。手数料0.05%のファンドでは、残高は約76,000ドルまで増えます。手数料1.05%のファンドでは——わずか1パーセントポイントの差なのに——残高は約57,000ドルにしかなりません。この1ポイントの差が30年間複利で積み重なり、総残高のおよそ4分の1を奪ったことになります。\n\nこれは最も安いファンドが常に最善だという意味ではありません。しかし手数料は確実であり、投資している限り複利で積み重なる一方、ファンドの将来の成績は確実ではないため、投資前に経費率を確認することは、投資家が事前に確実に知ることができる数少ない事柄の一つです。"
        }
      }
    ],
    "takeaway": {
      "en": "A fee never sends a bill, but it compounds every year exactly like the interest in Lesson 15 — just working against the balance instead of for it, which is why even a fee under 1% is worth checking before investing.",
      "es": "Una comisión nunca envía una factura, pero se compone cada año igual que el interés de la Lección 15 — solo que en contra del saldo en vez de a favor, por eso vale la pena revisarla antes de invertir aunque sea menor al 1%.",
      "ko": "수수료는 청구서를 보내지 않지만, 15강의 이자처럼 매년 복리로 쌓입니다 — 다만 잔고에 유리하게가 아니라 불리하게 작동할 뿐이므로, 1% 미만의 수수료라도 투자 전에 확인할 가치가 있습니다.",
      "zh": "费用从不寄账单，但它每年都像第15课的利息一样复利累积——只是方向相反、不利于余额，这正是为什么即使不到1%的费用也值得在投资前查看。",
      "ja": "手数料は請求書を送ってきませんが、第15課の利息とまったく同じように毎年複利で積み重なります——ただし残高に有利にではなく不利に働くだけなので、1%未満の手数料でも投資前に確認する価値があります。"
    },
    "thinkAbout": {
      "en": "Two funds track the same market index and hold virtually identical investments, but one charges 0.05% and the other charges 0.75% a year. Since Lesson 17 showed that diversification, not stock-picking skill, is what an index fund already provides, what would justify paying the higher fee for the same underlying holdings?",
      "es": "Dos fondos siguen el mismo índice y tienen inversiones casi idénticas, pero uno cobra 0.05% y el otro 0.75% al año. Como la Lección 17 mostró que la diversificación, no la habilidad para elegir acciones, es lo que ya ofrece un fondo índice, ¿qué justificaría pagar la comisión más alta por las mismas inversiones subyacentes?",
      "ko": "두 펀드가 같은 시장 지수를 추종하며 거의 동일한 투자 자산을 보유하고 있지만, 하나는 연 0.05%를, 다른 하나는 연 0.75%를 부과합니다. 17강에서 인덱스 펀드가 이미 제공하는 것은 주식 선택 실력이 아니라 분산투자라고 설명했는데, 같은 기초 자산에 더 높은 수수료를 내는 것을 정당화할 이유가 있을까요?",
      "zh": "两只基金追踪同一个市场指数，持仓几乎完全相同，但一只每年收费0.05%，另一只收费0.75%。既然第17课说明了指数基金已经提供的是分散投资而不是选股能力，那么为相同的底层持仓支付更高的费用有什么理由呢？",
      "ja": "2つのファンドが同じ市場指数に連動し、ほぼ同一の投資対象を保有していますが、一方は年0.05%、もう一方は年0.75%を課しています。第17課で、インデックスファンドがすでに提供しているのは銘柄選択の腕前ではなく分散投資だと示されたことを踏まえると、同じ原資産に対してより高い手数料を払う理由は何でしょうか？"
    }
  },
  24: {
    "sections": [
      {
        "heading": {
          "en": "Renting vs. Buying: What Each Path Actually Costs",
          "es": "Alquilar vs. Comprar: Lo Que Cada Camino Realmente Cuesta",
          "ko": "임대 vs. 매수: 각 선택이 실제로 드는 비용",
          "zh": "租房与购房：每条路径的真实成本",
          "ja": "賃貸か購入か：それぞれの道が実際にかかる費用"
        },
        "body": {
          "en": "Rent and a mortgage payment look like the same kind of expense — a check written every month for housing — but they buy very different things. Rent buys the right to live somewhere for a fixed period, with no long-term claim on the property; when the lease ends, the renter walks away with nothing added to their own balance sheet. In exchange, a landlord absorbs the surprise costs of ownership — a broken water heater, a new roof, rising property taxes — and a renter can typically move with a month or two of notice.\n\nBuying trades that flexibility for something else: some of each mortgage payment builds equity, meaning a stake in the home the buyer keeps or gets back later. But buying also front-loads costs a renter never sees. A down payment plus closing costs — fees for the loan, title search, inspection, and more — commonly run 2%-5% of the purchase price, and selling later usually costs another 5%-6% in agent commissions. A homeowner is also on the hook for the exact surprise costs a landlord absorbed: property taxes, homeowner's insurance (Lesson 20's trade-a-small-cost-for-protection idea, now mandatory for anyone with a mortgage), and repairs. None of this means buying is a mistake or renting is 'wasting money' — it means the two options bundle cost, risk, and flexibility differently, and which bundle fits depends on how long someone expects to stay and what they'd do with the money otherwise.",
          "es": "El alquiler y el pago de una hipoteca parecen el mismo tipo de gasto: un cheque que se escribe cada mes por la vivienda, pero compran cosas muy distintas. El alquiler compra el derecho a vivir en un lugar durante un período fijo, sin ningún derecho a largo plazo sobre la propiedad; cuando termina el contrato, el inquilino se va sin haber sumado nada a su propio patrimonio. A cambio, el propietario absorbe los costos sorpresa de la propiedad —un calentador de agua roto, un techo nuevo, impuestos a la propiedad en aumento— y el inquilino normalmente puede mudarse con uno o dos meses de aviso.\n\nComprar cambia esa flexibilidad por otra cosa: una parte de cada pago de hipoteca construye capital (equity), es decir, una participación en la vivienda que el comprador conserva o recupera más adelante. Pero comprar también adelanta costos que un inquilino nunca ve. Un pago inicial más los costos de cierre —comisiones por el préstamo, búsqueda de título, inspección, y más— suelen sumar entre 2% y 5% del precio de compra, y venderla después normalmente cuesta otro 5%-6% en comisiones de agente. Un propietario también carga con los mismos costos sorpresa que antes absorbía el arrendador: impuestos a la propiedad, seguro de vivienda (la idea de la Lección 20 de cambiar un costo pequeño por protección, ahora obligatorio para quien tiene una hipoteca), y reparaciones. Nada de esto significa que comprar sea un error o que alquilar sea 'tirar el dinero' — significa que las dos opciones combinan costo, riesgo y flexibilidad de manera distinta, y qué combinación conviene depende de cuánto tiempo alguien planea quedarse y qué haría con el dinero de otra manera.",
          "ko": "월세와 주택담보대출 상환금은 매달 주거비로 나가는 같은 종류의 지출처럼 보이지만, 실제로 사는 것은 전혀 다릅니다. 월세는 정해진 기간 동안 어딘가에 살 권리를 사는 것이며, 그 부동산에 대한 장기적인 권리는 없습니다. 계약이 끝나면 세입자는 자신의 자산에 아무것도 더하지 못한 채 떠납니다. 그 대신 집주인이 온수기 고장, 지붕 교체, 오르는 재산세 같은 예상치 못한 비용을 부담하며, 세입자는 보통 한두 달 전 통보만으로 이사할 수 있습니다.\n\n매수는 그 유연성을 다른 것과 맞바꿉니다: 대출 상환금의 일부는 지분(equity), 즉 나중에 매도자가 유지하거나 돌려받는 주택에 대한 지분을 쌓습니다. 하지만 매수는 세입자가 절대 보지 못하는 비용을 미리 지불하게 합니다. 계약금에 클로징 비용—대출 수수료, 등기 조사, 검사 등—을 더하면 보통 매매가의 2%~5%에 달하고, 나중에 매도할 때도 중개 수수료로 5%~6%가 또 듭니다. 집주인은 이전에 임대인이 부담했던 바로 그 예상치 못한 비용, 즉 재산세, 주택보험(20강의 '작은 확실한 비용으로 보호를 사는' 개념이며, 대출이 있으면 이제 의무입니다), 그리고 수리비를 떠안게 됩니다. 이것이 매수가 실수이거나 임대가 '돈 낭비'라는 뜻은 아닙니다 — 두 선택지가 비용, 위험, 유연성을 서로 다르게 묶어 놓았을 뿐이며, 어떤 조합이 맞는지는 얼마나 오래 머물 계획인지, 그리고 그 돈으로 달리 무엇을 할지에 달려 있습니다.",
          "zh": "房租和房贷月供看起来是同一种支出——每月为住房开出一张支票——但它们买到的东西却大不相同。房租买的是在固定期限内居住某处的权利，对该房产没有任何长期的所有权；租约到期后，租客离开时自己的资产负债表上不会多出任何东西。作为交换，房东承担了拥有房产带来的意外成本——热水器坏了、屋顶要换、房产税上涨——而租客通常只需提前一两个月通知就能搬走。\n\n购房则是用这种灵活性换取别的东西：每期房贷月供中的一部分会积累成净值（equity），也就是买家保留或日后收回的对房屋的权益。但购房也会预先产生租客从未见过的成本。首付款加上交易成交费用——贷款手续费、产权调查、验房等——通常合计为购房价的2%-5%，而日后出售房屋通常还要再付5%-6%的中介佣金。房主还要承担此前由房东承担的那些意外成本：房产税、房屋保险（正是第20课'用小额确定成本换取保护'的理念，现在对任何有房贷的人来说都是强制性的），以及维修费用。这并不意味着购房是个错误，也不意味着租房是'把钱扔掉'——这意味着两种选择以不同方式组合了成本、风险和灵活性，哪种组合更合适取决于一个人计划住多久，以及如果不买房这笔钱会用来做什么。",
          "ja": "家賃と住宅ローンの返済は、毎月住居のために切る小切手という同じ種類の支出に見えますが、実際に買っているものはまったく異なります。家賃は決まった期間その場所に住む権利を買うものであり、その不動産に対する長期的な権利は一切ありません。契約が終われば、借主は自分の資産に何も加わらないまま出て行きます。その代わり、給湯器の故障、屋根の張り替え、上昇する固定資産税といった予期せぬ費用は大家が負担し、借主は通常一、二ヶ月前の通知だけで引っ越せます。\n\n購入はその柔軟性を別のものと引き換えます：住宅ローンの返済の一部は持分（エクイティ）、つまり買主が保持するか、後で取り戻す住宅への権利を積み上げます。しかし購入は、借主が決して目にすることのない費用を前払いさせます。頭金に加えてクロージングコスト——ローン手数料、権利調査、検査など——は通常購入価格の2%〜5%にのぼり、後で売却する際にもさらに仲介手数料として5%〜6%かかります。持ち家の所有者は、以前は大家が吸収していたのとまったく同じ予期せぬ費用、すなわち固定資産税、住宅保険（第20課の「小さく確実な費用で保護を買う」考え方で、住宅ローンがある人には今や必須）、そして修繕費を負担することになります。これは購入が間違いだとか、賃貸が「お金の無駄」だという意味ではありません——二つの選択肢がコスト、リスク、柔軟性を異なる形で組み合わせているだけであり、どちらの組み合わせが合うかは、どれくらいの期間住むつもりか、そしてそのお金を他に何に使うかによって決まります。"
        }
      },
      {
        "heading": {
          "en": "What a Mortgage Payment Is Actually Made Of",
          "es": "De Qué Está Hecho en Realidad un Pago de Hipoteca",
          "ko": "주택담보대출 상환금은 실제로 무엇으로 이루어져 있나",
          "zh": "房贷月供究竟由什么构成",
          "ja": "住宅ローンの返済は実際に何でできているのか"
        },
        "body": {
          "en": "A mortgage is a loan that uses the home itself as collateral: if payments stop, the lender can foreclose and take the home to recover what's owed, which is why lenders can offer lower interest rates on a mortgage than on an unsecured loan like a credit card. A typical monthly payment bundles four things — principal (paying down the amount borrowed), interest (the lender's charge for the loan), property taxes, and homeowner's insurance — even though only the first two make up the loan itself.\n\nThe principal-and-interest split moves over the life of the loan in a pattern many buyers don't expect: early payments are mostly interest, and later payments are mostly principal. This is the same compounding math from Lesson 15, running against the borrower instead of for them — interest is charged on the full remaining balance, so when the balance is largest (right after buying), the interest portion is largest too. A 30-year loan often doesn't cross the halfway point between interest and principal until roughly two-thirds of the way through its term.\n\nA down payment below 20% of the purchase price usually adds one more cost: private mortgage insurance (PMI), which protects the lender — not the buyer — if the loan defaults, and typically cancels automatically once enough equity has built up. A larger down payment lowers the loan amount, the monthly payment, and often skips PMI entirely, which is part of why the size of a down payment is one of the most-discussed numbers in buying a home.",
          "es": "Una hipoteca es un préstamo que usa la propia vivienda como garantía: si los pagos se detienen, el prestamista puede ejecutar la hipoteca y quedarse con la vivienda para recuperar lo adeudado, razón por la cual los prestamistas pueden ofrecer tasas de interés más bajas en una hipoteca que en un préstamo sin garantía como una tarjeta de crédito. Un pago mensual típico agrupa cuatro elementos —capital (reducir el monto prestado), interés (el cargo del prestamista por el préstamo), impuestos a la propiedad y seguro de vivienda— aunque solo los dos primeros forman parte del préstamo en sí.\n\nLa división entre capital e interés cambia a lo largo de la vida del préstamo de una forma que muchos compradores no esperan: los primeros pagos son sobre todo interés, y los últimos son sobre todo capital. Es la misma matemática del interés compuesto de la Lección 15, funcionando en contra del prestatario en lugar de a su favor —el interés se cobra sobre todo el saldo restante, así que cuando el saldo es más grande (justo después de comprar), la porción de interés también lo es. Un préstamo a 30 años a menudo no cruza el punto medio entre interés y capital hasta aproximadamente dos tercios de su plazo.\n\nUn pago inicial menor al 20% del precio de compra suele añadir un costo más: el seguro hipotecario privado (PMI), que protege al prestamista —no al comprador— si el préstamo entra en impago, y que normalmente se cancela automáticamente una vez que se ha acumulado suficiente capital. Un pago inicial más grande reduce el monto del préstamo, el pago mensual, y a menudo evita el PMI por completo, lo cual es parte de por qué el tamaño del pago inicial es una de las cifras más discutidas al comprar una vivienda.",
          "ko": "주택담보대출(모기지)은 주택 자체를 담보로 하는 대출입니다: 상환이 중단되면 대출기관은 압류하여 주택을 가져가 미상환액을 회수할 수 있으며, 바로 이 때문에 대출기관은 신용카드 같은 무담보 대출보다 모기지에 더 낮은 금리를 제시할 수 있습니다. 일반적인 월 상환금은 원금(빌린 금액을 갚아나가는 것), 이자(대출에 대한 대출기관의 청구), 재산세, 주택보험이라는 네 가지 요소로 묶여 있지만, 대출 자체를 구성하는 것은 앞의 두 가지뿐입니다.\n\n원금과 이자의 비율은 대출 기간 동안 많은 구매자가 예상하지 못한 패턴으로 변합니다: 초기 상환금은 대부분 이자이고, 후기 상환금은 대부분 원금입니다. 이는 15강의 복리 수학과 동일하지만, 차용인에게 유리하게가 아니라 불리하게 작동합니다 — 이자는 남은 전체 잔액에 대해 부과되므로, 잔액이 가장 클 때(매수 직후) 이자 비중도 가장 큽니다. 30년 대출은 대개 대출 기간의 약 3분의 2 지점이 되어서야 이자와 원금의 비중이 역전됩니다.\n\n계약금이 매매가의 20% 미만이면 보통 비용이 하나 더 추가됩니다: 개인 모기지보험(PMI)으로, 이는 구매자가 아니라 대출기관을 대출 부도 시 보호하기 위한 것이며, 충분한 지분이 쌓이면 보통 자동으로 해지됩니다. 계약금이 클수록 대출 금액과 월 상환금이 줄어들고, 흔히 PMI를 아예 피할 수 있는데, 이것이 계약금 규모가 주택 구매에서 가장 많이 논의되는 숫자 중 하나인 이유의 일부입니다.",
          "zh": "房贷是一种以房屋本身作为抵押品的贷款：如果停止还款，贷方可以取消抵押品赎回权并收回房屋以弥补欠款，这也是为什么贷方能够为房贷提供比信用卡这类无抵押贷款更低利率的原因。典型的月供包含四个部分——本金（偿还所借金额）、利息（贷方对贷款收取的费用）、房产税和房屋保险——尽管只有前两项才真正构成贷款本身。\n\n本金与利息的比例在贷款存续期内会以许多购房者意想不到的方式变化：早期还款大部分是利息，后期还款大部分是本金。这与第15课的复利数学原理相同，只是方向相反、不利于借款人——利息是按剩余全部余额计算的，所以当余额最大时（刚购房之后），利息部分也最大。一笔30年期贷款往往要到贷款期限约三分之二处，利息和本金的比例才会发生逆转。\n\n首付低于购房价20%通常还会增加一项成本：私人抵押贷款保险（PMI），它保护的是贷方而不是买方，用于贷款违约时的赔付，通常在积累了足够的净值后会自动取消。更大的首付会降低贷款金额和月供，也往往能完全避免PMI，这也是首付金额成为购房中最常被讨论的数字之一的部分原因。",
          "ja": "住宅ローンは、住宅そのものを担保とする融資です：返済が止まれば、貸し手は差し押さえを行い、住宅を取得して未払い分を回収できます。だからこそ貸し手は、クレジットカードのような無担保ローンよりも住宅ローンに低い金利を提示できるのです。典型的な毎月の返済額は、元金（借りた金額を減らす部分）、利息（融資に対する貸し手の請求）、固定資産税、住宅保険という4つの要素をまとめたものですが、ローンそのものを構成するのは最初の2つだけです。\n\n元金と利息の割合は、ローン期間を通じて多くの購入者が予想しない形で変化します：初期の返済はほとんどが利息で、後期の返済はほとんどが元金です。これは第15課の複利の数学とまったく同じですが、借り手に有利にではなく不利に働きます——利息は残っている残高全体に対して課されるため、残高が最も大きいとき（購入直後）に利息の割合も最も大きくなります。30年ローンでは、利息と元金の割合が逆転するのは、返済期間のおよそ3分の2が経過してからということも珍しくありません。\n\n頭金が購入価格の20%未満だと、通常もう一つ費用が加わります：民間住宅ローン保険（PMI）です。これは買主ではなく貸し手を、ローンが債務不履行になった場合に保護するもので、十分な持分が積み上がると通常自動的に解約されます。頭金が大きいほどローン額と毎月の返済額が下がり、多くの場合PMIを完全に回避できます。これが、頭金の額が住宅購入において最もよく議論される数字の一つである理由の一部です。"
        }
      }
    ],
    "takeaway": {
      "en": "Renting and buying aren't a 'right' and 'wrong' choice — they trade flexibility and predictable costs for equity and upfront risk in different amounts, and a mortgage payment itself splits into principal, interest, taxes, and insurance, with the interest share largest in the loan's early years.",
      "es": "Alquilar y comprar no son una opción 'correcta' y otra 'incorrecta' — intercambian flexibilidad y costos predecibles por capital y riesgo inicial en distintas proporciones, y el propio pago de la hipoteca se divide en capital, interés, impuestos y seguro, con la mayor parte de interés en los primeros años del préstamo.",
      "ko": "임대와 매수는 '옳고 그른' 선택이 아닙니다 — 유연성과 예측 가능한 비용을 지분과 초기 위험과 서로 다른 비율로 맞바꾸는 것이며, 대출 상환금 자체도 원금, 이자, 세금, 보험으로 나뉘는데 대출 초기에는 이자 비중이 가장 큽니다.",
      "zh": "租房和购房并非'对'与'错'的选择——它们以不同的比例，用灵活性和可预测的成本换取净值和前期风险，而房贷月供本身也分为本金、利息、税费和保险，其中利息占比在贷款早期最大。",
      "ja": "賃貸と購入は「正しい」「間違っている」の選択ではありません——柔軟性と予測可能な費用を、持分と初期リスクとそれぞれ異なる割合で交換しているのです。住宅ローンの返済自体も元金、利息、税金、保険に分かれており、利息の割合はローンの初期が最も大きくなります。"
    },
    "thinkAbout": {
      "en": "Someone is comparing an apartment renting for $1,800/month to a home where the mortgage, taxes, and insurance would total $1,900/month — almost the same. Given that buying also requires a down payment plus 2%-5% in closing costs upfront, and selling later costs another 5%-6% in commissions, what else would matter before concluding the two options cost 'about the same'?",
      "es": "Alguien está comparando un apartamento que se alquila por $1,800/mes con una vivienda donde la hipoteca, los impuestos y el seguro sumarían $1,900/mes — casi lo mismo. Dado que comprar también requiere un pago inicial más 2%-5% en costos de cierre por adelantado, y que vender después cuesta otro 5%-6% en comisiones, ¿qué más importaría antes de concluir que las dos opciones cuestan 'casi lo mismo'?",
      "ko": "어떤 사람이 월 $1,800짜리 아파트 임대와, 대출상환금·세금·보험을 합쳐 월 $1,900이 드는 주택을 비교하고 있습니다 — 거의 비슷합니다. 매수에는 계약금에 더해 2%~5%의 클로징 비용이 선불로 들고, 나중에 매도할 때도 5%~6%의 수수료가 든다는 점을 고려하면, 두 선택지의 비용이 '거의 비슷하다'고 결론짓기 전에 또 무엇을 따져봐야 할까요?",
      "zh": "有人正在比较一套月租1800美元的公寓，和一套月供、税费、保险合计约1900美元的房子——几乎一样。考虑到购房还需要预先支付首付款以及2%-5%的交易成交费用，而日后出售时还要再付5%-6%的佣金，在得出两种选择'费用差不多'的结论之前，还有什么因素需要考虑？",
      "ja": "ある人が、月1,800ドルの賃貸アパートと、ローン・税金・保険を合わせて月1,900ドルになる住宅を比較しています——ほぼ同じです。購入には頭金に加えて前払いで2%〜5%のクロージングコストがかかり、後で売却する際にもさらに5%〜6%の手数料がかかることを踏まえると、二つの選択肢が「ほぼ同じ費用」だと結論づける前に、他に何を考慮すべきでしょうか？"
    }
  },
  25: {
    "sections": [
      {
        "heading": {
          "en": "What a Brokerage Account Is (and Isn't)",
          "es": "Qué Es (y Qué No Es) una Cuenta de Corretaje",
          "ko": "증권 계좌란 무엇이고 무엇이 아닌가",
          "zh": "券商账户是什么，又不是什么",
          "ja": "証券口座とは何か、そして何でないか"
        },
        "body": {
          "en": "A brokerage account is just a container — a place to hold investments, not an investment itself. Opening one is normally free and doesn't commit any money on its own; the account only starts working once money is deposited and then used to buy something inside it, like the stocks, bonds, or funds Lesson 17 covered.\n\nThat's easy to miss with cash sitting inside the account. Deposited money that hasn't been used to buy anything generally just sits there — a brokerage account isn't a savings account, so uninvested cash usually doesn't earn much, if anything, on its own. Buying an actual investment is a separate, deliberate step, not something that happens automatically just because money arrived.\n\nA taxable brokerage account is also a different animal from the 401(k) and IRA accounts Lesson 18 covered. There's no contribution limit and no penalty for withdrawing money early, but gains are taxed as they're realized — when an investment is sold for a profit — rather than getting the tax-deferred or tax-free treatment a retirement account provides. Many people end up using both kinds of accounts for different goals: tax-advantaged accounts for retirement, and a taxable brokerage account for money that might be needed sooner.",
          "es": "Una cuenta de corretaje es solo un contenedor: un lugar para guardar inversiones, no una inversión en sí misma. Abrir una suele ser gratis y no compromete dinero por sí sola; la cuenta solo empieza a funcionar cuando se deposita dinero y luego se usa para comprar algo dentro de ella, como las acciones, bonos o fondos de la Lección 17.\n\nEso es fácil de pasar por alto con el efectivo dentro de la cuenta. El dinero depositado que no se ha usado para comprar nada normalmente se queda ahí sin más — una cuenta de corretaje no es una cuenta de ahorros, así que el efectivo sin invertir suele generar poco o nada por sí solo. Comprar una inversión real es un paso separado y deliberado, no algo automático.\n\nUna cuenta de corretaje sujeta a impuestos también es distinta de las cuentas 401(k) e IRA de la Lección 18. No tiene límite de aportación ni penalización por retirar dinero antes, pero las ganancias se gravan al realizarse — cuando se vende una inversión con ganancia — en vez del trato diferido o libre de impuestos de una cuenta de jubilación. Muchas personas terminan usando ambos tipos de cuenta para metas distintas.",
          "ko": "증권 계좌는 그저 담는 그릇일 뿐입니다 — 투자를 보관하는 곳이지, 그 자체가 투자는 아닙니다. 계좌를 여는 것은 보통 무료이며 그 자체로는 돈을 어디에도 쓰지 않습니다. 계좌는 돈이 입금되고 그 돈으로 17강에서 다룬 주식, 채권, 펀드 같은 것을 실제로 매수할 때 비로소 작동하기 시작합니다.\n\n계좌 안의 현금은 놓치기 쉬운 부분입니다. 아무것도 사는 데 쓰이지 않은 입금액은 보통 그냥 그대로 머물러 있습니다 — 증권 계좌는 저축 계좌가 아니므로, 투자되지 않은 현금은 대개 스스로 거의 또는 전혀 불어나지 않습니다. 실제 투자를 매수하는 것은 별도의, 의도적인 단계입니다.\n\n과세 대상 증권 계좌는 18강에서 다룬 401(k)나 IRA와도 완전히 다릅니다. 납입 한도도 없고 조기 인출 벌금도 없지만, 투자를 이익을 남기고 매도할 때 이익이 실현되는 시점에 과세되며, 은퇴 계좌가 제공하는 세금 이연 또는 비과세 혜택은 없습니다. 많은 사람이 서로 다른 목적을 위해 두 계좌 유형을 함께 사용합니다.",
          "zh": "券商账户只是一个容器——一个存放投资的地方，而不是投资本身。开户通常是免费的，本身也不涉及任何资金投入；账户只有在存入资金并用这些资金买入第17课讲过的股票、债券或基金等标的后，才真正开始发挥作用。\n\n账户里的现金很容易被忽视。存入后没有用来购买任何东西的资金，通常就只是原地不动——券商账户不是储蓄账户，所以未投资的现金通常自己几乎不会增值。买入真正的投资是一个独立、需要主动去做的步骤，不会因为钱到账就自动发生。\n\n应税券商账户和第18课讲过的401(k)、IRA也完全不同。它没有缴款上限，提前取出也没有罚金，但收益会在实现时——也就是投资卖出获利时——被征税，而不像退休账户那样享受递延或免税待遇。很多人会同时使用这两类账户来满足不同的目标。",
          "ja": "証券口座は単なる入れ物です——投資を保管する場所であって、それ自体が投資ではありません。口座を開くことは通常無料で、それ自体では資金を何にも投入しません。口座は、資金が入金され、その資金で第17課の株式・債券・ファンドのようなものを実際に買って初めて機能し始めます。\n\n口座内の現金は見落としやすい部分です。何かを買うために使われていない入金は、通常そのまま何もせずに置かれます——証券口座は貯蓄口座ではないため、投資されていない現金は通常それ自体ではほとんど、あるいは全く増えません。実際の投資を買うことは、自動的に起こることではなく、別個の意図的なステップです。\n\n課税対象の証券口座は、第18課で扱った401(k)やIRAとも全く異なります。拠出限度額も早期引き出しの罰則もありませんが、利益は実現時——投資を利益を出して売却したとき——に課税され、退職口座が提供する課税繰延べや非課税の扱いはありません。多くの人が異なる目的のために両方の口座を使い分けています。"
        }
      },
      {
        "heading": {
          "en": "Placing an Order: Market vs. Limit",
          "es": "Colocar una Orden: Mercado vs. Límite",
          "ko": "주문 넣기: 시장가 vs. 지정가",
          "zh": "下单：市价单与限价单",
          "ja": "注文を出す：成行と指値"
        },
        "body": {
          "en": "Once money is in the account, buying or selling something requires placing an order, and the two most common types work differently. A market order says 'buy (or sell) right now, at whatever the best available price is' — it executes almost immediately, but the exact price isn't guaranteed down to the cent, especially if the price is moving fast. A limit order instead sets a specific price: 'only buy at this price or lower' (or 'only sell at this price or higher') — the price is guaranteed if the order executes, but there's no guarantee it executes at all, since the market might never reach that price.\n\nMost brokerages also let investors buy fractional shares — a slice of one share, like $50 worth of a stock trading at $500 — instead of requiring a purchase in whole-share amounts, which makes Lesson 17's diversification easier to build with a smaller amount of money. And a completed trade doesn't finish instantly behind the scenes: shares typically 'settle' — officially change ownership — one business day after the trade, a detail that mostly only matters for quickly using the proceeds of a sale to buy something else.",
          "es": "Una vez que hay dinero en la cuenta, comprar o vender algo requiere colocar una orden, y los dos tipos más comunes funcionan de forma distinta. Una orden de mercado dice 'compra (o vende) ahora mismo, al mejor precio disponible' — se ejecuta casi de inmediato, pero el precio exacto no está garantizado, sobre todo si el precio se mueve rápido. Una orden límite en cambio fija un precio específico: 'solo compra a este precio o menos' — el precio está garantizado si la orden se ejecuta, pero no hay garantía de que se ejecute, ya que el mercado podría no llegar nunca a ese precio.\n\nLa mayoría de las plataformas también permiten comprar acciones fraccionarias — una parte de una acción — en vez de exigir la compra de acciones completas, lo que facilita construir la diversificación de la Lección 17 con menos dinero. Y una operación completada no termina al instante: las acciones suelen 'liquidarse' oficialmente un día hábil después.",
          "ko": "계좌에 돈이 들어 있으면 무언가를 사고파는 데는 주문을 넣어야 하며, 가장 흔한 두 가지 유형은 서로 다르게 작동합니다. 시장가 주문은 '지금 당장, 구할 수 있는 최선의 가격에 사거나(또는 팔라)'는 것으로, 거의 즉시 체결되지만 정확한 가격이 소수점까지 보장되지는 않습니다. 지정가 주문은 대신 특정 가격을 정합니다: '이 가격 이하로만 사라'(또는 '이 가격 이상으로만 팔라') — 체결되면 가격은 보장되지만, 시장이 그 가격에 결코 도달하지 않을 수도 있으므로 체결 자체는 보장되지 않습니다.\n\n대부분의 증권사는 소수점 단위 주식(fractional share) 매수도 허용합니다 — 완전한 한 주가 아니라 주식의 일부만 사는 것으로, 17강의 분산투자를 더 적은 돈으로도 쉽게 구성할 수 있게 해줍니다. 그리고 체결된 거래는 즉시 완전히 끝나는 것이 아니라, 보통 거래 후 하루 영업일 뒤에 공식적으로 소유권이 '결제(settle)'됩니다.",
          "zh": "账户里有了资金后，买卖任何标的都需要下单，而两种最常见的订单类型运作方式不同。市价单意味着'现在就以能拿到的最好价格买入（或卖出）'——几乎立即成交，但确切成交价格不能精确到每一分钱，尤其是在价格快速波动时。限价单则设定一个具体价格：'只以这个价格或更低买入'（或'只以这个价格或更高卖出'）——如果订单成交，价格是有保证的，但不保证一定能成交，因为市场可能永远达不到那个价格。\n\n大多数券商还允许投资者购买碎股——也就是一股中的一小部分，比如用50美元买入一只每股500美元的股票——而不要求整股购买，这让第17课的分散投资用较少的钱也更容易实现。而且成交并不会在幕后瞬间彻底完成：股票通常在交易后的下一个工作日才正式'结算'（完成所有权转移）。",
          "ja": "口座に資金が入ったら、何かを売買するには注文を出す必要があり、最も一般的な2つの種類は動き方が異なります。成行注文は「今すぐ、入手可能な最良の価格で買う（または売る）」というもので、ほぼ即座に約定しますが、正確な価格が1セント単位まで保証されるわけではありません。指値注文は代わりに具体的な価格を設定します：「この価格以下でのみ買う」（または「この価格以上でのみ売る」）——約定すれば価格は保証されますが、市場がその価格に決して届かない可能性もあるため、約定そのものは保証されません。\n\nほとんどの証券会社では端株（1株の一部、例えば1株500ドルの株を50ドル分だけ）の購入も認めており、1株単位での購入を求められないため、第17課の分散投資をより少ない資金で組みやすくなります。また、成立した取引は舞台裏で即座に完了するわけではなく、株式は通常、取引の1営業日後に正式に所有権が「決済」されます。"
        }
      }
    ],
    "takeaway": {
      "en": "A brokerage account is a container, not an investment — opening one is free, but money inside it only grows once it's used to buy something. Market orders trade certainty of execution for uncertainty of price; limit orders do the opposite.",
      "es": "Una cuenta de corretaje es un contenedor, no una inversión — abrirla es gratis, pero el dinero dentro solo crece una vez que se usa para comprar algo. Las órdenes de mercado cambian certeza de ejecución por incertidumbre de precio; las órdenes límite hacen lo contrario.",
      "ko": "증권 계좌는 투자가 아니라 그릇입니다 — 계좌를 여는 것은 무료지만, 안에 있는 돈은 무언가를 사는 데 쓰여야 비로소 불어납니다. 시장가 주문은 체결의 확실성을 얻는 대신 가격의 불확실성을 감수하고, 지정가 주문은 그 반대입니다.",
      "zh": "券商账户是容器，而不是投资本身——开户免费，但账户里的钱只有在被用来买东西之后才会增长。市价单是用价格的不确定性换取成交的确定性；限价单则相反。",
      "ja": "証券口座は入れ物であって投資そのものではありません——開設は無料ですが、中の資金は何かを買うために使われて初めて増えます。成行注文は約定の確実性と引き換えに価格の不確実性を受け入れ、指値注文はその逆です。"
    },
    "thinkAbout": {
      "en": "Someone places a limit order to buy a stock 5% below its current price, hoping to get a better deal, but the price never drops that far and the order never executes. Compared to using a market order instead, what did they trade away — and what did they avoid risking?",
      "es": "Alguien coloca una orden límite para comprar una acción 5% por debajo de su precio actual, esperando un mejor trato, pero el precio nunca baja tanto y la orden nunca se ejecuta. Comparado con usar una orden de mercado, ¿qué sacrificó — y qué riesgo evitó?",
      "ko": "누군가 더 좋은 가격을 노리고 현재가보다 5% 낮은 지정가 매수 주문을 넣었지만, 가격이 그만큼 떨어지지 않아 주문이 체결되지 않았습니다. 시장가 주문을 썼을 경우와 비교하면, 이 사람은 무엇을 포기했고 어떤 위험을 피했을까요?",
      "zh": "有人下了一个限价单，想以比当前价格低5%的价格买入某只股票，希望能买到更划算的价格，但价格始终没有跌到那个水平，订单也就一直没有成交。与直接使用市价单相比，这个人放弃了什么，又避免了什么风险？",
      "ja": "ある人が、より良い価格を狙って現在価格より5%低い指値注文を出しましたが、価格がそこまで下がらず、注文は約定しませんでした。代わりに成行注文を使った場合と比べて、この人は何を犠牲にし、どんなリスクを避けたのでしょうか？"
    }
  },
  26: {
    "sections": [
      {
        "heading": {
          "en": "A Will Isn't Just for the Wealthy",
          "es": "Un Testamento No Es Solo para los Ricos",
          "ko": "유언장은 부자만을 위한 것이 아니다",
          "zh": "遗嘱不只是为富人准备的",
          "ja": "遺言書は富裕層のためだけのものではない"
        },
        "body": {
          "en": "A will is a legal document that says who gets a person's belongings, money, and property after they die, and — for anyone with minor children — who would raise them. It's easy to assume a will only matters for someone with a large estate, but its real job is simpler: it lets a person's own wishes, not a default formula, decide what happens to what they leave behind.\n\nWithout a will, state law decides instead, through a process called intestate succession — a fixed formula (often splitting assets among a spouse and children in preset shares, or moving to more distant relatives if there's no immediate family) that applies the same way regardless of what the person would have actually wanted. It doesn't ask whether a couple was unmarried but together for decades, whether one child needed more support than another, or who the deceased would have actually chosen to raise their kids — it just follows the formula.\n\nA will doesn't have to be complicated to do its core job, and creating one is generally far less involved than most people assume — but the details (state-specific rules, notarization, witness requirements) are exactly the kind of thing that varies by location and situation, which is why this lesson explains what a will does rather than how to write one.",
          "es": "Un testamento es un documento legal que indica quién recibe las pertenencias, el dinero y las propiedades de una persona después de morir, y — para quienes tienen hijos menores — quién los criaría. Es fácil suponer que un testamento solo importa para alguien con un patrimonio grande, pero su función real es más simple: deja que los deseos de la persona, no una fórmula predeterminada, decidan qué pasa con lo que deja atrás.\n\nSin testamento, la ley estatal decide en su lugar, mediante un proceso llamado sucesión intestada — una fórmula fija que se aplica de la misma manera sin importar lo que la persona realmente hubiera querido.\n\nUn testamento no tiene que ser complicado para cumplir su función principal, y crear uno suele ser mucho menos complejo de lo que la mayoría supone — pero los detalles varían según el lugar y la situación.",
          "ko": "유언장은 사람이 죽은 후 그의 소지품, 돈, 재산을 누가 받을지, 그리고 미성년 자녀가 있다면 누가 그들을 양육할지를 정하는 법적 문서입니다. 유언장이 재산이 많은 사람에게만 중요하다고 생각하기 쉽지만, 실제 역할은 더 단순합니다: 정해진 공식이 아니라 본인의 뜻이 남긴 것을 어떻게 할지 결정하게 해주는 것입니다.\n\n유언장이 없으면 대신 주(州)법이 무유언 상속(intestate succession)이라는 절차를 통해 결정합니다 — 그 사람이 실제로 무엇을 원했는지와 상관없이 동일하게 적용되는 고정된 공식입니다.\n\n유언장이 핵심 역할을 하기 위해 복잡할 필요는 없으며, 작성하는 것은 대부분의 사람이 생각하는 것보다 훨씬 덜 복잡합니다 — 다만 세부 사항은 지역과 상황에 따라 다릅니다.",
          "zh": "遗嘱是一份法律文件，规定一个人去世后其财物、金钱和财产由谁继承，以及——对于有未成年子女的人来说——由谁来抚养他们。人们很容易以为遗嘱只对拥有大量财产的人才重要，但它真正的作用更简单：让本人的意愿，而不是一套默认公式，来决定身后事的归属。\n\n如果没有遗嘱，州法律会通过一个叫做无遗嘱继承（intestate succession）的程序来代为决定——这是一套固定的公式，无论本人实际想要什么，都会以同样的方式适用。\n\n遗嘱要发挥其核心作用并不需要多复杂，立遗嘱通常也远比大多数人想象的简单——但具体细节因地区和情况而异。",
          "ja": "遺言書とは、人が亡くなった後にその所持品、お金、財産を誰が受け取るか、そして未成年の子どもがいる場合は誰がその子を育てるかを定める法的文書です。遺言書は大きな財産を持つ人にだけ重要だと思われがちですが、その本当の役割はもっとシンプルです：既定の計算式ではなく、本人の意思が、残したものの行方を決めるようにすることです。\n\n遺言書がない場合、代わりに州法が「無遺言相続（intestate succession）」という手続きを通じて決定します——本人が実際に何を望んでいたかに関係なく、同じように適用される固定の計算式です。\n\n遺言書はその中心的な役割を果たすために複雑である必要はなく、作成すること自体は多くの人が思うよりもはるかに簡単です——ただし詳細は地域や状況によって異なります。"
        }
      },
      {
        "heading": {
          "en": "Beneficiary Designations Can Override a Will",
          "es": "Las Designaciones de Beneficiario Pueden Anular un Testamento",
          "ko": "수익자 지정이 유언장보다 우선할 수 있다",
          "zh": "受益人指定可能凌驾于遗嘱之上",
          "ja": "受取人指定は遺言書より優先されることがある"
        },
        "body": {
          "en": "Here's a detail that surprises a lot of people: a will doesn't control everything. Certain accounts — including the 401(k) and IRA accounts from Lesson 18 and the life insurance policies from Lesson 20 — pass directly to whoever is named as their beneficiary, regardless of what a will says. The account's own beneficiary designation wins, every time, even over a more recently written will that says something different.\n\nThis creates a specific, common, and entirely avoidable mistake: someone updates their will after a major life change — a divorce, a new child, a remarriage — but forgets that an old 401(k) or life insurance policy still lists an ex-spouse or an outdated beneficiary from years earlier. When that person dies, the account goes to whoever's name is on the beneficiary form, not whoever the will names or whoever the person would have actually wanted.\n\nThe practical takeaway isn't a specific instruction on what any one person's beneficiaries should be — that depends entirely on someone's own relationships and circumstances — but the mechanism itself: beneficiary forms are a separate, active decision from a will, and they don't update themselves just because life changed or a will was rewritten.",
          "es": "Aquí hay un detalle que sorprende a muchos: un testamento no lo controla todo. Ciertas cuentas — incluidas las cuentas 401(k) e IRA de la Lección 18 y las pólizas de seguro de vida de la Lección 20 — pasan directamente a quien esté designado como beneficiario, sin importar lo que diga el testamento. La designación de beneficiario de la cuenta siempre gana, incluso sobre un testamento más reciente que diga algo distinto.\n\nEsto crea un error común y evitable: alguien actualiza su testamento tras un cambio importante — un divorcio, un nuevo hijo, un nuevo matrimonio — pero olvida que un 401(k) o seguro de vida antiguo todavía tiene como beneficiario a un ex-cónyuge.\n\nLa conclusión práctica no es una instrucción específica sobre quién debería ser el beneficiario de nadie — eso depende de las relaciones y circunstancias de cada persona — sino el mecanismo en sí: los formularios de beneficiario son una decisión separada y activa de un testamento, y no se actualizan solos.",
          "ko": "많은 사람이 놀라는 부분이 있습니다: 유언장이 모든 것을 통제하지는 않는다는 점입니다. 18강의 401(k)와 IRA, 20강의 생명보험 같은 특정 계좌는 유언장의 내용과 상관없이 지정된 수익자에게 직접 전달됩니다. 계좌 자체의 수익자 지정이 항상 이깁니다, 심지어 다른 내용을 담은 더 최근의 유언장보다도요.\n\n이는 흔하고 충분히 피할 수 있는 실수를 만듭니다: 이혼, 새 자녀, 재혼 같은 큰 변화 이후 유언장은 업데이트했지만, 오래된 401(k)나 생명보험에는 여전히 전 배우자가 수익자로 남아 있는 경우입니다.\n\n실용적인 결론은 누구의 수익자가 누구여야 한다는 구체적인 지시가 아니라 — 그것은 각자의 관계와 상황에 달려 있습니다 — 그 메커니즘 자체입니다: 수익자 지정은 유언장과는 별개의, 능동적인 결정이며 삶이 바뀌었다고 저절로 업데이트되지 않습니다.",
          "zh": "有一个细节会让很多人感到惊讶：遗嘱并不能控制一切。某些账户——包括第18课的401(k)和IRA账户，以及第20课的人寿保险单——会直接转给被指定的受益人，无论遗嘱怎么写。账户自身的受益人指定始终优先，哪怕遗嘱更晚写成、写的内容不同也是如此。\n\n这就造成了一个常见且完全可以避免的错误：有人在离婚、添丁或再婚等重大变化后更新了遗嘱，却忘了自己多年前开设的401(k)或人寿保险仍把前配偶列为受益人。\n\n这里的实用要点并不是告诉任何人该把谁设为受益人——那完全取决于每个人自己的关系和情况——而是这个机制本身：受益人表格是与遗嘱分开、需要主动去做的决定，不会因为生活发生变化或遗嘱重写而自动更新。",
          "ja": "ここに多くの人が驚く点があります：遺言書がすべてを支配するわけではないということです。第18課の401(k)やIRA、第20課の生命保険といった特定の口座は、遺言書の内容に関係なく、指定された受取人に直接渡ります。口座自体の受取人指定は、たとえ異なる内容を記した、より新しい遺言書があっても、常に優先されます。\n\nこれは、よくある、そして十分避けられる間違いを生みます：離婚、新しい子ども、再婚といった大きな変化の後に遺言書を更新したものの、何年も前に加入した401(k)や生命保険には元配偶者が受取人として残ったままになっているというケースです。\n\nここでの実用的な結論は、誰の受取人を誰にすべきかという具体的な指示ではなく——それは各自の関係や状況によって完全に異なります——その仕組み自体です：受取人指定は遺言書とは別の、能動的な決定であり、人生が変わったり遺言書が書き直されたりしても自動的には更新されません。"
        }
      }
    ],
    "takeaway": {
      "en": "A will directs how someone's belongings and money are distributed and who raises their children — without one, a fixed legal formula decides instead. But retirement and insurance accounts bypass a will entirely: whoever is named on the account's own beneficiary form gets it, so an outdated beneficiary designation can override even a brand-new will.",
      "es": "Un testamento dirige cómo se distribuyen las pertenencias y el dinero de alguien y quién cría a sus hijos — sin uno, una fórmula legal fija decide en su lugar. Pero las cuentas de jubilación y seguro pasan por alto el testamento por completo: quien esté designado en el formulario de beneficiario de la cuenta la recibe, así que una designación desactualizada puede anular incluso un testamento recién escrito.",
      "ko": "유언장은 누군가의 소지품과 돈이 어떻게 분배되고 누가 자녀를 양육할지를 정합니다 — 없으면 고정된 법적 공식이 대신 결정합니다. 하지만 은퇴 계좌와 보험은 유언장을 완전히 건너뛰어, 계좌 자체의 수익자 지정에 이름이 있는 사람이 받습니다. 그래서 오래된 수익자 지정이 새로 쓴 유언장조차 무력화할 수 있습니다.",
      "zh": "遗嘱决定一个人的财物和金钱如何分配、由谁抚养子女——没有遗嘱时，一套固定的法律公式会代为决定。但退休账户和保险会完全绕过遗嘱：账户自身受益人表格上填的是谁，谁就能获得，因此一个过时的受益人指定甚至可以推翻一份全新的遗嘱。",
      "ja": "遺言書は、人の所持品やお金がどう分配され、誰が子どもを育てるかを定めます——それがない場合、固定の法的計算式が代わりに決定します。しかし退職口座や保険は遺言書を完全に迂回します：口座自体の受取人指定に名前がある人が受け取るため、古い受取人指定は新しく書かれた遺言書さえも上書きしてしまうことがあります。"
    },
    "thinkAbout": {
      "en": "Someone gets divorced, rewrites their will to leave everything to their new spouse, but never updates the beneficiary designation on the 401(k) they opened years earlier (Lesson 18) — it still lists their ex-spouse. Based on this lesson, who actually receives that 401(k) when they die?",
      "es": "Alguien se divorcia, reescribe su testamento para dejarle todo a su nuevo cónyuge, pero nunca actualiza la designación de beneficiario del 401(k) que abrió años antes (Lección 18) — todavía figura su ex-cónyuge. Según esta lección, ¿quién recibe realmente ese 401(k) cuando esa persona muere?",
      "ko": "누군가 이혼 후 새 배우자에게 모든 것을 남기도록 유언장을 다시 썼지만, 몇 년 전에 연 401(k)(18강)의 수익자 지정은 업데이트하지 않았습니다 — 여전히 전 배우자가 남아 있습니다. 이 강의에 따르면, 이 사람이 사망하면 그 401(k)는 실제로 누가 받게 될까요?",
      "zh": "有人离婚后重写了遗嘱，把一切留给新配偶，但从未更新多年前开设的401(k)（第18课）上的受益人指定——上面仍然写着前配偶的名字。根据本课内容，这个人去世后，那笔401(k)实际上会归谁？",
      "ja": "ある人が離婚後、新しい配偶者にすべてを残すよう遺言書を書き直しましたが、何年も前に開設した401(k)（第18課）の受取人指定は更新しませんでした——今も元配偶者のままです。この講の内容に基づくと、この人が亡くなったとき、実際にその401(k)を受け取るのは誰でしょうか？"
    }
  },
  27: {
    "sections": [
      {
        "heading": {
          "en": "The Report Is the Record; the Score Is a Number Calculated From It",
          "es": "El Informe Es el Registro; el Puntaje Es un Número Calculado a Partir de Él",
          "ko": "보고서는 기록이고, 점수는 그것으로 계산된 숫자다",
          "zh": "报告是记录，评分是由此计算出的数字",
          "ja": "報告書は記録であり、スコアはそこから計算された数字である"
        },
        "body": {
          "en": "A credit report is a detailed record of a person's borrowing history: which credit cards and loans they've opened, how much they owe, whether payments arrived on time or late, how long each account has existed, who has recently checked the report (a \"hard inquiry\"), and any public records like bankruptcies. It's compiled by a credit bureau — the three major ones in the U.S. are Equifax, Experian, and TransUnion — from information that lenders, landlords, and other creditors choose to report.\n\nA credit score is a different thing entirely: a three-digit number, typically ranging from 300 to 850, calculated from what's in a report using a scoring model such as FICO or VantageScore. The score isn't stored in the report — it's generated from the report's contents on demand, the way a GPA is calculated from a transcript rather than being written on it directly.\n\nBecause there are three bureaus and multiple scoring models, a single person doesn't have one credit score — they have several, and they can differ. Not every lender reports to all three bureaus, so Equifax's file on a person can be missing an account that shows up on Experian's, and FICO and VantageScore can each turn the same report into a slightly different number. Seeing two different scores in two different apps isn't a mistake — it can just mean the apps pulled from different bureaus or used different models.",
          "es": "Un informe de crédito es un registro detallado del historial crediticio de una persona: qué tarjetas de crédito y préstamos ha abierto, cuánto debe, si los pagos llegaron a tiempo o tarde, cuánto tiempo lleva abierta cada cuenta, quién ha consultado recientemente el informe (una \"consulta dura\"), y cualquier registro público como bancarrotas. Lo compila una agencia de crédito — las tres principales en EE. UU. son Equifax, Experian y TransUnion — a partir de información que prestamistas, arrendadores y otros acreedores eligen reportar.\n\nUn puntaje de crédito es algo completamente distinto: un número de tres dígitos, generalmente entre 300 y 850, calculado a partir de lo que contiene un informe usando un modelo de puntuación como FICO o VantageScore. El puntaje no se guarda en el informe — se genera a partir de su contenido cuando se solicita, de la misma forma que un promedio académico se calcula a partir de una boleta de calificaciones en lugar de estar escrito directamente en ella.\n\nComo hay tres agencias y varios modelos de puntuación, una sola persona no tiene un puntaje de crédito — tiene varios, y pueden diferir. No todos los prestamistas reportan a las tres agencias, así que el archivo de Equifax sobre una persona puede no incluir una cuenta que sí aparece en el de Experian, y FICO y VantageScore pueden convertir el mismo informe en números ligeramente distintos. Ver dos puntajes diferentes en dos aplicaciones distintas no es un error — puede simplemente significar que las apps consultaron agencias diferentes o usaron modelos diferentes.",
          "ko": "신용 보고서는 한 사람의 대출 이력을 상세히 기록한 것입니다: 어떤 신용카드와 대출을 개설했는지, 얼마를 빚지고 있는지, 상환이 제때 이루어졌는지 연체되었는지, 각 계좌가 얼마나 오래 존재했는지, 최근에 누가 보고서를 조회했는지(\"엄격 조회\"), 그리고 파산 같은 공공 기록까지 포함합니다. 이는 신용평가기관이 작성하며 — 미국의 3대 기관은 Equifax, Experian, TransUnion입니다 — 대출기관, 임대인, 기타 채권자가 보고하기로 선택한 정보를 바탕으로 합니다.\n\n신용 점수는 완전히 다른 것입니다: 일반적으로 300에서 850 사이의 세 자리 숫자로, FICO나 VantageScore 같은 채점 모델을 이용해 보고서 내용으로부터 계산됩니다. 점수는 보고서에 저장되어 있는 것이 아니라 필요할 때 보고서 내용으로부터 생성됩니다 — 성적표에 평점이 직접 적혀 있는 것이 아니라 성적표 내용으로부터 평점(GPA)이 계산되는 것과 같습니다.\n\n3개 기관과 여러 채점 모델이 존재하기 때문에, 한 사람은 하나의 신용 점수를 갖는 것이 아니라 여러 개를 가지며, 이들은 서로 다를 수 있습니다. 모든 대출기관이 3개 기관 모두에 보고하는 것은 아니므로, Equifax의 파일에는 Experian에는 있는 계좌가 빠져 있을 수 있고, FICO와 VantageScore는 같은 보고서를 서로 조금 다른 숫자로 만들어낼 수 있습니다. 두 개의 다른 앱에서 서로 다른 점수를 보는 것은 오류가 아니라, 단지 앱들이 서로 다른 기관에서 정보를 가져왔거나 다른 모델을 사용했음을 의미할 수 있습니다.",
          "zh": "信用报告是对一个人借贷历史的详细记录：开立过哪些信用卡和贷款、欠款多少、还款是按时还是逾期、每个账户存在了多久、最近谁查询过该报告（\"硬查询\"），以及破产等任何公共记录。它由信用机构编制——美国三大机构是Equifax、Experian和TransUnion——依据贷款机构、房东及其他债权人选择上报的信息汇总而成。\n\n信用评分则完全是另一回事：通常是300到850之间的三位数字，使用FICO或VantageScore等评分模型根据报告内容计算得出。评分并不存储在报告里——而是在需要时根据报告内容生成，就像GPA是根据成绩单计算出来的，而不是直接写在成绩单上一样。\n\n由于存在三家机构和多种评分模型，一个人并非只有一个信用评分——而是有好几个，而且它们可能不同。并非每个贷款机构都会向三家机构全部上报，所以Equifax上某人的档案可能缺少一个在Experian档案中出现的账户，而FICO和VantageScore也可能把同一份报告算出略有不同的数字。在两个不同的应用里看到两个不同的评分并不是错误——这可能只是意味着这些应用调取了不同的机构数据，或使用了不同的模型。",
          "ja": "信用報告書とは、ある人の借入履歴を詳細に記録したものです：どのクレジットカードやローンを開設したか、いくら借りているか、支払いが期日通りだったか延滞したか、各口座がどれくらいの期間存在しているか、最近誰が報告書を照会したか（「ハードインクワイアリー」）、そして破産などの公的記録も含まれます。これは信用情報機関によって作成されます——米国の主要3社はEquifax、Experian、TransUnionです——貸し手や大家、その他の債権者が報告することを選んだ情報に基づいています。\n\n信用スコアはまったく別のものです：通常300から850の間の3桁の数字で、FICOやVantageScoreのようなスコアリングモデルを使って報告書の内容から計算されます。スコアは報告書に保存されているのではなく、必要に応じて報告書の内容から生成されます——ちょうどGPAが成績証明書に直接書かれているのではなく、そこから計算されるのと同じです。\n\n3つの機関と複数のスコアリングモデルが存在するため、一人の人が持つ信用スコアは1つではなく複数あり、それらは異なることがあります。すべての貸し手が3機関すべてに報告するわけではないため、Equifaxのファイルにはあるが、Experianのファイルには載っていない口座があったり、FICOとVantageScoreが同じ報告書からそれぞれわずかに異なる数字を導き出したりします。2つの異なるアプリで異なるスコアを見ても、それは間違いではありません——単にアプリが異なる機関から情報を取得したか、異なるモデルを使用しただけかもしれません。"
        }
      },
      {
        "heading": {
          "en": "Because a Report Is a Record, It Can Contain Errors — and Can Be Corrected",
          "es": "Porque un Informe Es un Registro, Puede Contener Errores — y Puede Corregirse",
          "ko": "보고서는 기록이기 때문에 오류가 있을 수 있고, 정정할 수도 있다",
          "zh": "因为报告是一种记录，它可能包含错误——也可以被更正",
          "ja": "報告書は記録であるため、誤りが含まれることがあり——訂正することもできる"
        },
        "body": {
          "en": "Because a credit report is compiled by a third party from other companies' data, it can be wrong in the ordinary ways any record compiled from multiple sources can be wrong: a payment that was on time gets logged as late, an account that was closed still shows as open, or — more seriously — information belonging to someone else with a similar name or a shared identity-theft situation ends up on the wrong file. Any of these can lower the score calculated from that report, for a reason that has nothing to do with the person's actual borrowing behavior.\n\nU.S. federal law entitles everyone to a free copy of their credit report from each of the three bureaus, available at AnnualCreditReport.com, and gives consumers the right to formally dispute inaccurate information directly with the bureau reporting it. This is a distinct action from improving a score: disputing a report fixes wrong information; it doesn't change accurate information into something more favorable.\n\nThat distinction matters because the two are often confused. If a report accurately shows a history of late payments or a high amount owed relative to available credit, disputing it won't remove that information — a score calculated from accurate information changes only as the underlying behavior does, over time. Checking a report for errors and improving the habits it accurately reflects are two different, both worthwhile, things to do.",
          "es": "Como un informe de crédito lo compila un tercero a partir de datos de otras empresas, puede estar equivocado de las maneras habituales en que cualquier registro compilado de varias fuentes puede estarlo: un pago que fue puntual se registra como tardío, una cuenta que se cerró sigue apareciendo como abierta, o — más grave aún — información de otra persona con un nombre parecido o un caso de robo de identidad termina en el archivo equivocado. Cualquiera de estos errores puede bajar el puntaje calculado a partir de ese informe, por una razón que no tiene nada que ver con el comportamiento real de esa persona como prestataria.\n\nLa ley federal de EE. UU. da a todos el derecho a una copia gratuita de su informe de crédito de cada una de las tres agencias, disponible en AnnualCreditReport.com, y otorga a los consumidores el derecho a disputar formalmente información inexacta directamente ante la agencia que la reporta. Esto es una acción distinta a mejorar un puntaje: disputar un informe corrige información errónea; no convierte información exacta en algo más favorable.\n\nEsta distinción importa porque ambas cosas suelen confundirse. Si un informe muestra correctamente un historial de pagos tardíos o un saldo alto en relación con el crédito disponible, disputarlo no eliminará esa información — un puntaje calculado a partir de información exacta solo cambia cuando cambia el comportamiento subyacente, con el tiempo. Revisar un informe en busca de errores y mejorar los hábitos que refleja con exactitud son dos acciones distintas, y ambas valen la pena.",
          "ko": "신용 보고서는 다른 회사들의 데이터를 바탕으로 제3자가 작성하기 때문에, 여러 출처에서 취합된 어떤 기록이든 흔히 겪을 수 있는 방식으로 틀릴 수 있습니다: 제때 낸 상환이 연체로 기록되거나, 이미 닫힌 계좌가 여전히 열려 있는 것으로 나오거나, 더 심각하게는 이름이 비슷한 다른 사람의 정보나 신원 도용 사건의 정보가 잘못된 파일에 들어가는 경우입니다. 이런 오류들은 그 사람의 실제 대출 행동과 아무 상관 없는 이유로 그 보고서에서 계산된 점수를 낮출 수 있습니다.\n\n미국 연방법은 모든 사람에게 AnnualCreditReport.com에서 3개 기관 각각으로부터 무료로 신용 보고서 사본을 받을 권리를 부여하며, 소비자가 부정확한 정보를 보고한 기관에 직접 공식적으로 이의를 제기할 권리도 부여합니다. 이는 점수를 개선하는 것과는 별개의 행동입니다: 보고서에 이의를 제기하는 것은 잘못된 정보를 바로잡는 것이지, 정확한 정보를 더 유리하게 바꾸는 것이 아닙니다.\n\n이 구분은 두 가지가 자주 혼동되기 때문에 중요합니다. 만약 보고서가 연체 이력이나 사용 가능한 신용 대비 높은 사용 금액을 정확하게 보여준다면, 이의를 제기해도 그 정보는 사라지지 않습니다 — 정확한 정보로 계산된 점수는 시간이 지나며 실제 행동이 바뀔 때만 변합니다. 오류를 확인하기 위해 보고서를 점검하는 것과, 보고서가 정확히 반영하는 습관을 개선하는 것은 서로 다른, 둘 다 가치 있는 일입니다.",
          "zh": "由于信用报告是第三方根据其他公司的数据汇编而成，它可能会以任何多来源汇编记录都常见的方式出错：本来按时的还款被记成逾期，已经关闭的账户仍显示为开通状态，或者更严重的是——同名者或身份盗用案件中属于别人的信息被计入了错误的档案。这些错误都可能压低根据该报告计算出的评分，而原因和本人实际的借贷行为毫无关系。\n\n美国联邦法律规定，每个人都有权从三大机构各自免费获取一份信用报告（可在AnnualCreditReport.com获取），并赋予消费者直接向报告不准确信息的机构提出正式异议的权利。这与提升评分是两码事：对报告提出异议是纠正错误信息，而不是把准确的信息变得更有利。\n\n这个区别很重要，因为两者经常被混淆。如果报告准确地显示了逾期还款的记录，或相对于可用信用额度而言欠款较高，提出异议并不会移除这些信息——根据准确信息计算出的评分，只会随着背后行为随时间发生变化而变化。检查报告中的错误，和改善报告准确反映出的习惯，是两件不同但都值得做的事。",
          "ja": "信用報告書は第三者が他社のデータをもとに作成するため、複数の情報源から集約された記録が一般的に抱えうる誤りを含むことがあります：期日通りだった支払いが延滞として記録される、解約済みの口座がまだ開いていると表示される、あるいはさらに深刻なケースとして、似た名前の他人や身元盗用事件に関連する情報が誤ったファイルに紛れ込むことなどです。これらはいずれも、本人の実際の借入行動とは無関係な理由で、その報告書から計算されるスコアを下げてしまう可能性があります。\n\n米国連邦法は、すべての人にAnnualCreditReport.comを通じて3機関それぞれから無料で信用報告書のコピーを受け取る権利を与えており、消費者には不正確な情報について、それを報告した機関に直接正式に異議を申し立てる権利もあります。これはスコアを改善することとは別の行為です：報告書に異議を申し立てることは誤った情報を修正することであり、正確な情報をより有利なものに変えることではありません。\n\nこの区別は、両者がしばしば混同されるため重要です。もし報告書が延滞の履歴や、利用可能な与信枠に対して高い利用額を正確に示している場合、それに異議を申し立ててもその情報は消えません——正確な情報から計算されたスコアは、時間の経過とともに実際の行動が変わったときにのみ変化します。報告書の誤りを確認することと、報告書が正確に反映している習慣を改善することは、どちらも価値のある、別々の行為です。"
        }
      }
    ],
    "takeaway": {
      "en": "A credit report is a detailed record of someone's borrowing history, kept separately by three different bureaus (Equifax, Experian, TransUnion). A credit score is a three-digit number calculated from that report by a scoring model (like FICO or VantageScore) — since there are three bureaus and multiple models, one person has several scores, not one. Because a report is compiled from other companies' data, it can contain errors; U.S. law entitles everyone to a free copy from each bureau and the right to dispute inaccuracies, but disputing only fixes wrong information — it doesn't change what's accurately reported.",
      "es": "Un informe de crédito es un registro detallado del historial crediticio de alguien, mantenido por separado por tres agencias distintas (Equifax, Experian, TransUnion). Un puntaje de crédito es un número de tres dígitos calculado a partir de ese informe mediante un modelo de puntuación (como FICO o VantageScore) — como hay tres agencias y varios modelos, una persona tiene varios puntajes, no uno. Como un informe se compila con datos de otras empresas, puede contener errores; la ley de EE. UU. da a todos el derecho a una copia gratuita de cada agencia y el derecho a disputar inexactitudes, pero disputar solo corrige información errónea — no cambia lo que se reporta con exactitud.",
      "ko": "신용 보고서는 세 개의 서로 다른 기관(Equifax, Experian, TransUnion)이 각각 별도로 관리하는, 누군가의 대출 이력을 상세히 기록한 것입니다. 신용 점수는 채점 모델(FICO나 VantageScore 등)이 그 보고서로부터 계산한 세 자리 숫자입니다 — 3개 기관과 여러 모델이 존재하므로 한 사람은 하나가 아니라 여러 점수를 가집니다. 보고서는 다른 회사의 데이터로 작성되므로 오류를 포함할 수 있습니다; 미국 법은 모든 사람에게 각 기관으로부터 무료 사본을 받을 권리와 부정확한 정보에 이의를 제기할 권리를 주지만, 이의 제기는 잘못된 정보만 바로잡을 뿐 정확하게 보고된 내용을 바꾸지는 않습니다.",
      "zh": "信用报告是对某人借贷历史的详细记录，由三家不同机构（Equifax、Experian、TransUnion）分别单独保存。信用评分是评分模型（如FICO或VantageScore）根据该报告计算出的三位数字——由于存在三家机构和多种模型，一个人拥有的是好几个评分，而不是一个。由于报告是根据其他公司的数据汇编而成，它可能包含错误；美国法律赋予每个人从各机构获取免费副本以及对不准确信息提出异议的权利，但提出异议只能纠正错误信息——不会改变准确报告的内容。",
      "ja": "信用報告書とは、3つの異なる機関（Equifax、Experian、TransUnion）がそれぞれ別々に保管している、ある人の借入履歴を詳細に記録したものです。信用スコアは、スコアリングモデル（FICOやVantageScoreなど）がその報告書から計算した3桁の数字です——3つの機関と複数のモデルが存在するため、一人の人は1つではなく複数のスコアを持ちます。報告書は他社のデータをもとに編集されるため、誤りを含むことがあります。米国法はすべての人に各機関からの無料コピーを受け取る権利と、不正確な情報に異議を申し立てる権利を与えていますが、異議申し立てが修正するのは誤った情報だけであり、正確に報告されている内容を変えるものではありません。"
    },
    "thinkAbout": {
      "en": "Someone checks their credit score on their bank's app and sees 705, then checks a different free app the same day and sees 680. Based on this lesson, what's the most likely explanation — and is one of the two numbers necessarily wrong?",
      "es": "Alguien revisa su puntaje de crédito en la app de su banco y ve 705, y luego revisa una app gratuita distinta el mismo día y ve 680. Según esta lección, ¿cuál es la explicación más probable — y alguno de los dos números tiene que estar necesariamente equivocado?",
      "ko": "누군가 은행 앱에서 신용 점수를 확인하니 705였는데, 같은 날 다른 무료 앱에서 확인하니 680이었습니다. 이 강의에 따르면 가장 가능성 있는 설명은 무엇이며, 두 숫자 중 하나가 반드시 틀린 것일까요?",
      "zh": "有人在银行的应用中查看信用评分显示为705，同一天在另一个免费应用中查看却显示为680。根据本课内容，最可能的解释是什么——这两个数字中是否一定有一个是错的？",
      "ja": "ある人が銀行のアプリで信用スコアを確認すると705でしたが、同じ日に別の無料アプリで確認すると680でした。この講の内容に基づくと、最も可能性の高い説明は何でしょうか——そして、この2つの数字のどちらかが必ず間違っているのでしょうか？"
    }
  },
  28: {
    "sections": [
      {
        "heading": {
          "en": "Two Purchases That Feel Exactly the Same",
          "es": "Dos Compras Que Se Sienten Idénticas",
          "ko": "똑같이 느껴지는 두 가지 소비",
          "zh": "两笔感觉完全相同的消费",
          "ja": "まったく同じに感じる2つの買い物"
        },
        "body": {
          "en": "Maya and Dan work at the same company and both get a $4,000 raise in the same year.\n\nMaya trades up to a nicer car — a $300 monthly payment she didn't have before. Dan spends $1,200 on a set of tools that lets him take paid repair work on weekends, and leaves the rest in a savings account earning interest.\n\nAt the moment of purchase these felt like the same kind of decision: a person with a bit more money buying something they wanted. Three years later they are not the same at all. Maya's car has taken about $10,800 out of her pocket and is worth less than she paid for it. Dan's tools paid for themselves in the first few months and have been adding to his income ever since, and his savings have grown a little on their own.\n\nThat difference has a name that turns up in nearly every book written about money. An asset is something that puts money into your pocket over time. A liability is something that takes money out. Notice what the test is not about: it isn't about price, and it isn't about whether something is nice or deserved. It's about which direction the money flows after you buy.\n\nReal life is messier than two clean columns, and it's worth being honest about that rather than pretending otherwise. A car that gets you to a job you couldn't otherwise reach is doing real work for you. A home does both things at once — it builds equity while costing you every single month in interest, taxes, insurance and repairs, which is exactly the trade-off Lesson 24 works through in detail. The point of the question isn't to sort the world into good purchases and bad ones. It's that most people never ask it at all, and you can't make a deliberate choice about something you haven't noticed you're choosing.",
          "es": "Maya y Dan trabajan en la misma empresa y ambos reciben un aumento de $4,000 el mismo año.\n\nMaya cambia a un auto mejor — un pago mensual de $300 que antes no tenía. Dan gasta $1,200 en herramientas que le permiten aceptar trabajos de reparación los fines de semana, y deja el resto en una cuenta de ahorro que genera intereses.\n\nEn el momento de comprar, ambas decisiones se sintieron iguales. Tres años después no lo son: el auto de Maya le ha sacado unos $10,800 del bolsillo y vale menos de lo que pagó; las herramientas de Dan se pagaron solas en los primeros meses y siguen sumando a sus ingresos.\n\nEsa diferencia tiene nombre. Un activo es algo que mete dinero en tu bolsillo con el tiempo; un pasivo es algo que lo saca. La prueba no es el precio, ni si algo es lindo o merecido: es hacia dónde fluye el dinero después de comprar.\n\nLa vida real es más desordenada que dos columnas limpias. Un auto que te lleva a un trabajo al que no podrías llegar de otro modo está haciendo un trabajo real por ti. Una vivienda hace ambas cosas a la vez — genera patrimonio mientras te cuesta cada mes en intereses, impuestos, seguro y reparaciones, exactamente la disyuntiva que la Lección 24 desarrolla en detalle. El objetivo de la pregunta no es clasificar el mundo en compras buenas y malas, sino que la mayoría nunca la hace — y no puedes elegir deliberadamente algo que no has notado que estás eligiendo.",
          "ko": "마야와 댄은 같은 회사에 다니고, 같은 해에 둘 다 4,000달러의 연봉 인상을 받았습니다.\n\n마야는 더 좋은 차로 바꿨습니다 — 전에는 없던 월 300달러의 할부금이 생겼습니다. 댄은 1,200달러로 공구 세트를 사서 주말에 수리 일을 받기 시작했고, 나머지는 이자가 붙는 저축 계좌에 두었습니다.\n\n구매하는 순간에는 두 결정이 똑같이 느껴졌습니다. 3년 뒤에는 전혀 같지 않습니다. 마야의 차는 주머니에서 약 10,800달러를 가져갔고 산 가격보다 가치가 떨어졌습니다. 댄의 공구는 몇 달 만에 본전을 뽑았고 그 뒤로 계속 소득을 더해주고 있습니다.\n\n이 차이에는 이름이 있습니다. 자산은 시간이 지나면서 내 주머니에 돈을 넣어주는 것이고, 부채는 돈을 빼가는 것입니다. 기준은 가격이 아니고, 그것이 좋은 물건인지 내가 누릴 자격이 있는지도 아닙니다. 산 뒤에 돈이 어느 방향으로 흐르는가입니다.\n\n현실은 두 칸으로 깔끔하게 나뉘지 않습니다. 그 차가 없으면 다닐 수 없는 직장에 데려다주는 차는 실제로 일을 하고 있는 것입니다. 집은 두 가지를 동시에 합니다 — 자산을 쌓아가면서도 매달 이자, 세금, 보험, 수리비를 가져갑니다. 24강이 바로 그 트레이드오프를 자세히 다룹니다. 이 질문의 목적은 세상을 좋은 소비와 나쁜 소비로 나누는 것이 아닙니다. 대부분의 사람이 이 질문을 아예 하지 않는다는 것, 그리고 자신이 선택하고 있다는 사실조차 모르는 일에 대해서는 의식적인 선택을 할 수 없다는 것입니다.",
          "zh": "玛雅和丹在同一家公司工作，同一年都获得了4,000美元的加薪。\n\n玛雅换了一辆更好的车——多了一笔以前没有的每月300美元的车贷。丹花1,200美元买了一套工具，让他周末能接付费维修活，剩下的钱存进了有利息的储蓄账户。\n\n在购买的那一刻，这两个决定感觉完全一样。三年后却完全不同：玛雅的车从她口袋里拿走了约10,800美元，而且价值低于她买时的价格；丹的工具在头几个月就回本了，此后一直在为他增加收入。\n\n这个差别有个名字。资产是随着时间把钱放进你口袋的东西，负债则是把钱拿走的东西。判断标准不是价格，也不是这东西是否好、是否值得——而是买了之后钱往哪个方向流。\n\n现实比两个整齐的分类更复杂。一辆让你能去原本到不了的工作地点的车，是在为你做实事。房子则同时具备两种性质——它积累净值，同时每个月都在利息、税费、保险和维修上花掉你的钱，这正是第24课详细讨论的权衡。这个问题的意义不是把世界分成好消费和坏消费，而是大多数人根本不问——而你无法对一件自己都没意识到在做选择的事做出深思熟虑的选择。",
          "ja": "マヤとダンは同じ会社で働いていて、同じ年に二人とも4,000ドルの昇給を受けました。\n\nマヤはより良い車に買い替えました——それまでなかった月300ドルの支払いが増えました。ダンは1,200ドルで工具一式を買い、週末に有料の修理仕事を受けられるようにし、残りは利息のつく貯蓄口座に入れました。\n\n買った瞬間、この2つは同じ種類の決断に感じられました。3年後、まったく同じではありません。マヤの車は約10,800ドルを彼女の財布から持ち出し、買った時より価値が下がっています。ダンの工具は数ヶ月で元を取り、それ以来ずっと収入を増やし続けています。\n\nこの違いには名前があります。資産とは時間とともにあなたの財布にお金を入れてくれるもの、負債とはお金を持ち出すものです。判断基準は値段ではなく、それが素敵かどうかでもありません。買った後にお金がどちらの方向へ流れるか、です。\n\n現実は2つのきれいな列より複雑です。それがなければ通えない職場へ運んでくれる車は、実際に働いてくれています。住宅は両方を同時に行います——資産を積み上げつつ、毎月利息・税金・保険・修繕費を持ち出します。まさにそのトレードオフを第24講が詳しく扱っています。この問いの目的は世界を良い買い物と悪い買い物に分けることではありません。ほとんどの人がそもそも問わないということ、そして自分が選んでいると気づいていないことについては意識的な選択ができない、ということです。"
        }
      },
      {
        "heading": {
          "en": "Knowing This Isn't the Hard Part",
          "es": "Saberlo No Es lo Difícil",
          "ko": "아는 것은 어려운 부분이 아니다",
          "zh": "知道这一点并不是难的部分",
          "ja": "知っていることは難しい部分ではない"
        },
        "body": {
          "en": "Here is the strange thing about the idea above: almost nobody argues with it once they hear it. And yet people who can explain it perfectly still end up with a garage full of things that take money out.\n\nThat's because the two halves of the decision happen at completely different speeds. The wanting is fast — seconds, driven by the part of the mind that reacts rather than reasons. The cost is slow, arriving in small monthly pieces for years, long after the feeling that caused it has faded. So you are never actually comparing a purchase against its real price. You're comparing a vivid feeling now against an abstraction later, and the vivid feeling wins nearly every time.\n\nAn entire industry is built inside that gap. One-tap checkout exists to remove the pause. 'Only 2 left' and countdown timers exist to make the fast part of your mind decide before the slow part shows up. None of it works particularly well on someone who has already decided in advance how they want to spend.\n\nThis is also how a raise quietly disappears. Income goes up, and spending drifts up to meet it — a slightly nicer apartment, a bigger phone plan, three more subscriptions — until a larger salary feels exactly as tight as the smaller one did. Almost nobody chooses that. It is what happens when nobody is choosing at all.\n\nThe methods people use against this are unglamorous, and they all do the same one thing: put time between wanting and buying. Some wait 24 hours on anything above a set amount, and 30 days above a larger one, then check whether they still want it — a surprising share of the time, the want has simply evaporated. Some translate the price into hours of their own work, because a $200 purchase at $25 an hour is a full working day of your life, and hours are much harder to lie to yourself about than dollars. Some keep a written list of what they're saving toward, so that a new want has to compete against something specific instead of against nothing at all.\n\nNone of this is about never enjoying your money. Buying something purely because it will make you happy is a perfectly good reason. The difference is whether that was the reason you chose, or just what happened to you at 11pm on your phone.",
          "es": "Lo curioso de la idea anterior es que casi nadie la discute al escucharla. Y aun así, gente que puede explicarla perfectamente termina con un garaje lleno de cosas que sacan dinero.\n\nEso pasa porque las dos mitades de la decisión ocurren a velocidades distintas. El deseo es rápido — segundos, impulsado por la parte de la mente que reacciona en vez de razonar. El costo es lento: llega en cuotas mensuales durante años, mucho después de que el sentimiento se apagó. Nunca comparas la compra contra su precio real; comparas un sentimiento vívido ahora contra una abstracción después, y el sentimiento gana casi siempre.\n\nUna industria entera está construida dentro de esa brecha. El pago con un toque existe para eliminar la pausa. 'Solo quedan 2' y los contadores existen para que la parte rápida de tu mente decida antes de que llegue la lenta.\n\nAsí también desaparece un aumento. El ingreso sube y el gasto sube a su encuentro — un departamento un poco mejor, un plan más grande, tres suscripciones más — hasta que un sueldo mayor se siente igual de ajustado. Casi nadie elige eso: es lo que pasa cuando nadie está eligiendo.\n\nLos métodos que la gente usa contra esto no son glamorosos y todos hacen lo mismo: poner tiempo entre querer y comprar. Algunos esperan 24 horas por encima de cierto monto, y 30 días por encima de otro mayor, y luego revisan si todavía lo quieren. Algunos traducen el precio a horas de su propio trabajo, porque $200 a $25 la hora es un día laboral completo de tu vida, y las horas son más difíciles de auto-engañar que los dólares. Algunos mantienen una lista escrita de sus metas de ahorro, para que un deseo nuevo compita contra algo concreto.\n\nNada de esto se trata de nunca disfrutar tu dinero. Comprar algo solo porque te hará feliz es una razón perfectamente válida. La diferencia está en si esa fue la razón que elegiste, o simplemente lo que te pasó a las 11 de la noche con el teléfono en la mano.",
          "ko": "위 개념의 이상한 점은, 듣고 나서 반박하는 사람이 거의 없다는 것입니다. 그런데도 그것을 완벽하게 설명할 수 있는 사람들이 여전히 돈을 빼가는 물건으로 가득한 창고를 갖게 됩니다.\n\n결정의 두 부분이 완전히 다른 속도로 일어나기 때문입니다. 원하는 마음은 빠릅니다 — 몇 초, 이성이 아니라 반응하는 뇌 부위가 움직입니다. 비용은 느립니다. 그 감정이 사라진 한참 뒤에, 몇 년에 걸쳐 매달 조금씩 도착합니다. 그래서 우리는 실제로 물건을 진짜 가격과 비교하는 것이 아닙니다. 지금의 생생한 감정과 나중의 추상적인 숫자를 비교하고 있고, 거의 항상 생생한 감정이 이깁니다.\n\n하나의 산업 전체가 그 틈 안에 지어져 있습니다. 원터치 결제는 멈춤을 없애기 위해 존재합니다. '2개 남음'과 카운트다운 타이머는 느린 쪽이 도착하기 전에 빠른 쪽이 결정하게 만들기 위해 존재합니다.\n\n연봉 인상이 조용히 사라지는 방식도 이것입니다. 소득이 오르면 지출이 따라 올라갑니다 — 조금 더 좋은 집, 더 큰 요금제, 구독 서비스 세 개 추가 — 결국 더 큰 월급이 예전 월급만큼 빠듯하게 느껴집니다. 아무도 그걸 선택하지 않습니다. 아무도 선택하지 않을 때 벌어지는 일입니다.\n\n사람들이 쓰는 방법은 화려하지 않고, 모두 같은 한 가지를 합니다: 원하는 것과 사는 것 사이에 시간을 넣는 것. 일정 금액 이상은 24시간, 더 큰 금액은 30일을 기다린 뒤 여전히 원하는지 확인하는 사람들이 있습니다. 가격을 자기 노동 시간으로 바꿔보는 사람들도 있습니다 — 시급 25달러에 200달러짜리 물건은 인생의 꼬박 하루이고, 시간은 돈보다 스스로를 속이기 어렵기 때문입니다. 저축 목표를 적어두는 사람들도 있습니다. 새로운 욕구가 아무것도 아닌 것이 아니라 구체적인 무언가와 경쟁하게 만들기 위해서입니다.\n\n이것은 돈을 절대 즐기지 말라는 이야기가 아닙니다. 행복해질 것 같아서 산다는 것은 충분히 좋은 이유입니다. 차이는 그것이 내가 고른 이유였는지, 아니면 밤 11시에 휴대폰을 보다가 나에게 벌어진 일이었는지입니다.",
          "zh": "上面这个想法有个奇怪之处：几乎没人在听完后会反对它。然而能把它讲得头头是道的人，最后车库里依然堆满了往外掏钱的东西。\n\n这是因为决定的两半以完全不同的速度发生。想要是快的——几秒钟，由大脑中负责反应而非推理的部分驱动。成本是慢的：它在往后数年里以每月一小笔的方式到来，远在那份冲动消退之后。所以你从来不是在拿这笔消费和它的真实价格作比较，而是在拿此刻鲜活的感受和以后一个抽象的数字作比较——鲜活的感受几乎每次都赢。\n\n一整个行业就建在这道缝隙里。一键结账的存在就是为了消除那个停顿。'仅剩2件'和倒计时的存在，就是为了让你大脑中快的那部分在慢的那部分到场之前做出决定。\n\n加薪也是这样悄悄消失的。收入涨了，支出跟着涨上来——稍好一点的公寓、更大的套餐、多三个订阅——直到更高的薪水感觉和原来一样紧。几乎没人主动选择这样。这是没有人在做选择时发生的事。\n\n人们用来对付这件事的方法都不花哨，而且都只做同一件事：在想要和购买之间放进时间。有人对超过某个金额的东西等24小时，超过更大金额的等30天，然后再看自己是否还想要。有人把价格换算成自己的工作小时数，因为时薪25美元时，200美元的东西就是你生命中完整的一个工作日，而小时比美元更难自欺。有人写下自己正在存钱的目标，好让新冒出来的欲望必须和某个具体的东西竞争，而不是和空气竞争。\n\n这一切都不是说永远不要享受你的钱。仅仅因为某样东西会让你开心而买它，是完全正当的理由。区别在于，那究竟是你选择的理由，还是晚上11点你盯着手机时发生在你身上的事。",
          "ja": "上の考えの奇妙な点は、聞いてから反対する人がほとんどいないことです。それでも、それを完璧に説明できる人が、お金を持ち出すもので埋まったガレージを持つことになります。\n\n決断の2つの半分がまったく違う速度で起きるからです。欲しいという気持ちは速い——数秒、理性ではなく反応する脳の部分が動かします。費用は遅い。その気持ちが消えたずっと後に、何年もかけて毎月少しずつ届きます。だから私たちは買い物を本当の値段と比べているのではありません。今の鮮やかな感情と、後の抽象的な数字を比べていて、鮮やかな感情がほぼ毎回勝ちます。\n\n業界まるごとがその隙間の中に建てられています。ワンタップ決済は「間」をなくすために存在します。「残り2点」やカウントダウンタイマーは、遅い方が到着する前に速い方に決めさせるために存在します。\n\n昇給が静かに消えるのもこの仕組みです。収入が上がると支出もそれに合わせて上がる——少し良いアパート、大きなプラン、サブスク3つ追加——やがて高い給料が以前とまったく同じくらい厳しく感じられます。誰もそれを選んでいません。誰も選んでいないときに起きることです。\n\n人々が使う方法は地味で、どれも同じ1つのことをします：欲しいと買うの間に時間を入れる。ある金額以上は24時間、もっと大きい額は30日待ってから、まだ欲しいか確かめる人がいます。値段を自分の労働時間に換算する人もいます——時給25ドルなら200ドルの買い物は人生の丸一日分で、時間はドルより自分を騙しにくいからです。貯金の目標を書き出しておく人もいます。新しい欲求が、何もないものではなく具体的な何かと競争するようにするためです。\n\nこれはお金を決して楽しむなという話ではありません。幸せになれるからという理由だけで買うのは、まったく正当な理由です。違いは、それが自分で選んだ理由だったのか、それとも夜11時にスマホを見ていて自分に起きたことだったのか、です。"
        }
      }
    ],
    "takeaway": {
      "en": "An asset puts money into your pocket over time; a liability takes it out — and that difference is almost never visible at the moment you pay. What separates wise spending from impulsive spending isn't income, and it isn't even knowing the difference: it's whether the decision was made deliberately, or made for you by a fast feeling and a slow bill.",
      "es": "Un activo mete dinero en tu bolsillo con el tiempo; un pasivo lo saca — y esa diferencia casi nunca es visible en el momento de pagar. Lo que separa el gasto sabio del impulsivo no es el ingreso, ni siquiera conocer la diferencia: es si la decisión se tomó deliberadamente, o si la tomaron por ti un sentimiento rápido y una factura lenta.",
      "ko": "자산은 시간이 지나면서 내 주머니에 돈을 넣어주고, 부채는 빼갑니다 — 그리고 그 차이는 돈을 내는 순간에는 거의 보이지 않습니다. 현명한 소비와 충동적인 소비를 가르는 것은 소득도 아니고, 그 차이를 아는 것조차 아닙니다. 그 결정을 내가 의식적으로 내렸는가, 아니면 빠른 감정과 느린 청구서가 나 대신 내렸는가입니다.",
      "zh": "资产随时间把钱放进你的口袋，负债则把钱拿走——而这个差别在你付款的那一刻几乎从不可见。区分明智消费与冲动消费的，不是收入，甚至不是知不知道这个差别，而是这个决定究竟是你深思熟虑做出的，还是由一份快速的情绪和一张缓慢的账单替你做出的。",
      "ja": "資産は時間とともにあなたの財布にお金を入れ、負債は持ち出します——そしてその違いは支払う瞬間にはほとんど見えません。賢い支出と衝動的な支出を分けるのは収入ではなく、その違いを知っているかどうかですらありません。その決断を自分で意識的に下したのか、それとも速い感情と遅い請求書に代わりに下されたのか、です。"
    },
    "thinkAbout": {
      "en": "Look at the last three things you bought that weren't groceries or a bill. For each one, ask two questions: did money go out with nothing coming back, and would you make the same call again today? You're not looking for guilt — you're looking for how many of the three you actually decided on.",
      "es": "Mira las últimas tres cosas que compraste que no fueran comida ni una factura. Para cada una, pregunta: ¿salió dinero sin que volviera nada, y tomarías la misma decisión hoy? No busques culpa — busca cuántas de las tres realmente decidiste.",
      "ko": "식료품이나 공과금이 아닌, 최근에 산 세 가지를 떠올려 보세요. 각각에 대해 두 가지를 물어보세요: 돈이 나가기만 하고 돌아온 것은 없었는가, 그리고 오늘 다시 같은 결정을 내리겠는가? 죄책감을 찾는 것이 아닙니다 — 셋 중 몇 개를 내가 실제로 '결정'했는지를 보는 것입니다.",
      "zh": "回想你最近买的三样不是食品杂货、也不是账单的东西。对每一样问两个问题：钱出去了却没有任何东西回来吗？今天你还会做同样的决定吗？你不是在找愧疚感——你是在看这三样里有几样是你真正决定的。",
      "ja": "食料品でも請求書でもない、最近買った3つのものを思い出してください。それぞれについて2つ問いかけます：お金は出ていくだけで、返ってくるものはなかったか。そして今日もう一度、同じ判断をするか。罪悪感を探すのではありません——3つのうちいくつを自分が本当に「決めた」のかを見るのです。"
    }
  },
  29: {
    "sections": [
      {
        "heading": {
          "en": "A Ratchet, Not a Decision",
          "es": "Un Trinquete, No una Decisión",
          "ko": "결정이 아니라 톱니바퀴",
          "zh": "这是棘轮，不是决定",
          "ja": "決断ではなく、ラチェット"
        },
        "body": {
          "en": "Six years ago Priya earned $50,000. Today she earns $75,000 — a real, substantial raise. She also has almost exactly as little left at the end of the month as she did back then, and she could not tell you where the difference went.\n\nHere is where it went. A better apartment, closer to work: about $400 more a month. Trading up the car when the old one needed repairs anyway: about $300. A bigger phone plan, and three streaming services added at various points: about $100. More takeout, because she's busier now and it feels earned: about $250. That's roughly $1,050 a month of new recurring cost, against a raise worth around $1,450 a month after tax. Four hundred dollars survived.\n\nNo single one of those was a mistake. Each was affordable when she made it. Each was defensible. That's precisely why this is hard to see: lifestyle inflation isn't a bad decision, it's a series of individually reasonable ones with no moment where anyone would obviously say no.\n\nWhat makes it a ratchet is that the upgrades go one way easily and the other way painfully. Within about three months, the better apartment stops registering as better — it's simply where she lives now, the new baseline against which everything else is measured. The pleasure faded; the $400 didn't. And moving back would not feel like returning to normal, it would feel like a loss, which is a far stronger sensation than the mild satisfaction the upgrade produced in the first place.\n\nOne thing worth ruling out, because people often blame it: this is not taxes. Lesson 19 covers why a raise can never actually reduce your take-home pay — brackets tax layers of income, so more earned is always more kept. Priya's raise reached her bank account exactly as expected. It was absorbed after it arrived, not before.",
          "es": "Hace seis años Priya ganaba $50,000. Hoy gana $75,000 — un aumento real y sustancial. Y le queda casi tan poco a fin de mes como entonces, sin poder decir a dónde se fue la diferencia.\n\nAquí se fue. Un departamento mejor, más cerca del trabajo: unos $400 más al mes. Cambiar el auto cuando el viejo necesitaba reparaciones de todos modos: unos $300. Un plan de teléfono más grande y tres servicios de streaming añadidos en distintos momentos: unos $100. Más comida a domicilio, porque ahora está más ocupada y siente que se lo ganó: unos $250. Eso es cerca de $1,050 al mes de costo recurrente nuevo, contra un aumento que vale unos $1,450 mensuales después de impuestos. Sobrevivieron cuatrocientos dólares.\n\nNinguna de esas decisiones fue un error. Cada una era asequible cuando la tomó. Cada una era defendible. Por eso mismo es difícil de ver: la inflación del estilo de vida no es una mala decisión, es una serie de decisiones individualmente razonables sin ningún momento en que alguien diría claramente que no.\n\nLo que la convierte en un trinquete es que las mejoras suben con facilidad y bajan con dolor. En unos tres meses, el mejor departamento deja de registrarse como mejor — simplemente es donde vive ahora, la nueva base con la que se mide todo lo demás. El placer se desvaneció; los $400 no. Y volver atrás no se sentiría como regresar a lo normal, se sentiría como una pérdida, una sensación mucho más fuerte que la leve satisfacción que produjo la mejora.\n\nVale la pena descartar algo que la gente suele culpar: esto no son los impuestos. La Lección 19 explica por qué un aumento nunca puede reducir tu sueldo neto — los tramos gravan capas de ingreso, así que ganar más siempre es quedarse con más. El aumento de Priya llegó a su cuenta exactamente como se esperaba. Fue absorbido después de llegar, no antes.",
          "ko": "6년 전 프리야의 연봉은 5만 달러였습니다. 지금은 7만 5천 달러입니다 — 실질적이고 상당한 인상입니다. 그런데 월말에 남는 돈은 그때와 거의 똑같이 적고, 그 차액이 어디로 갔는지 그녀는 설명하지 못합니다.\n\n어디로 갔는지 보겠습니다. 직장에서 더 가까운 좋은 집: 월 약 400달러 추가. 어차피 수리가 필요했던 차를 바꾼 것: 약 300달러. 더 큰 요금제와 여기저기서 추가한 스트리밍 서비스 세 개: 약 100달러. 더 바빠졌고 그럴 자격이 있다고 느껴서 늘어난 배달 음식: 약 250달러. 새로 생긴 고정 지출이 월 1,050달러가량인데, 인상분은 세후 월 1,450달러 정도였습니다. 400달러가 살아남았습니다.\n\n그중 어느 하나도 잘못된 선택이 아니었습니다. 결정할 당시에는 모두 감당할 수 있었고, 모두 나름의 이유가 있었습니다. 바로 그래서 알아차리기 어렵습니다. 생활수준 인플레이션은 나쁜 결정이 아니라, 누구라도 명백히 '아니오'라고 말할 만한 순간이 하나도 없는, 개별적으로는 합리적인 결정들의 연속입니다.\n\n이것을 톱니바퀴로 만드는 것은, 올라가기는 쉽고 내려오기는 고통스럽다는 점입니다. 약 세 달이면 더 좋은 집은 더 이상 '좋은' 집으로 느껴지지 않습니다. 그저 지금 사는 곳이 되고, 다른 모든 것을 재는 새로운 기준선이 됩니다. 즐거움은 사라졌지만 400달러는 사라지지 않았습니다. 그리고 되돌아가는 것은 정상으로 돌아가는 느낌이 아니라 상실처럼 느껴집니다 — 그 업그레이드가 처음 준 옅은 만족감보다 훨씬 강한 감각입니다.\n\n사람들이 흔히 탓하는 것 하나는 짚고 넘어가야 합니다. 이것은 세금 때문이 아닙니다. 19강이 왜 급여 인상이 실수령액을 줄일 수 없는지 다룹니다 — 세율 구간은 소득을 층별로 과세하므로 더 벌면 항상 더 남습니다. 프리야의 인상분은 예상대로 정확히 통장에 들어왔습니다. 도착하기 전이 아니라 도착한 뒤에 흡수된 것입니다.",
          "zh": "六年前，普里娅年收入5万美元。如今是7万5千美元——一次实实在在的大幅加薪。而她月底剩下的钱，几乎和当年一样少，而且她说不出那笔差额去了哪里。\n\n它去了这些地方。一套离公司更近的更好的公寓：每月多约400美元。旧车反正也要修，于是换了车：约300美元。更大的手机套餐，以及先后添加的三项流媒体服务：约100美元。更多外卖，因为她现在更忙，也觉得自己配得上：约250美元。这就是每月约1,050美元的新增固定支出，而那次加薪税后约合每月1,450美元。活下来的是四百美元。\n\n这里面没有哪一项是错误的决定。做决定时每一项都负担得起，每一项都说得通。这恰恰是它难以察觉的原因：生活方式膨胀不是一个坏决定，而是一连串单看都合理的决定，其中没有任何一个时刻会让人明显地说“不”。\n\n让它成为棘轮的，是升级上去很容易、退回来很痛苦。大约三个月后，那套更好的公寓就不再被感知为“更好”——它只是她现在住的地方，是衡量其他一切的新基准。愉悦感消失了，那400美元却没有。而退回去并不会感觉像回到正常，而会感觉像失去——这种感受远比升级最初带来的那点满足感强烈得多。\n\n有一件人们常怪罪的事值得排除：这不是税的问题。第19课讲了为什么加薪永远不会真的减少你的到手工资——税率分档是对收入的每一层分别征税，所以挣得越多留下的总是越多。普里娅的加薪如数进了银行账户。它是在到账之后被吸收掉的，不是之前。",
          "ja": "6年前、プリヤの年収は5万ドルでした。今は7万5千ドル——本物の、大幅な昇給です。それでも月末に残るお金は当時とほとんど同じくらい少なく、その差額がどこへ行ったのか彼女には説明できません。\n\nどこへ行ったかを見てみましょう。職場に近い、より良いアパート：月約400ドル増。どのみち修理が必要だった車の買い替え：約300ドル。大きな携帯プランと、あちこちで追加した3つの動画サービス：約100ドル。忙しくなったし自分へのご褒美だと感じて増えたデリバリー：約250ドル。新しい固定費が月およそ1,050ドル、対する昇給は税引後で月およそ1,450ドル。生き残ったのは400ドルでした。\n\nどれ一つとして間違った選択ではありません。決めた時点ではどれも支払える額で、どれにも理由がありました。だからこそ見えにくいのです。ライフスタイルインフレは悪い決断ではなく、誰が見ても明らかに「ノー」と言うべき瞬間が一度もない、個別には妥当な決断の連続です。\n\nこれをラチェットにしているのは、上がるのは簡単で、下がるのは苦しいという点です。3ヶ月ほどで、より良いアパートは「より良い」と感じられなくなります。単に今住んでいる場所になり、他のすべてを測る新しい基準線になります。喜びは薄れましたが、400ドルは薄れません。そして元に戻すことは、普通に戻る感覚ではなく、失う感覚になります——アップグレードが最初に与えた淡い満足より、はるかに強い感覚です。\n\n人がよく犯人扱いするものを一つ除外しておきます。これは税金のせいではありません。第19講が、なぜ昇給が手取りを減らすことはあり得ないかを扱っています——税率区分は所得を層ごとに課税するので、多く稼げば必ず多く残ります。プリヤの昇給は予定どおり口座に届きました。届く前ではなく、届いた後に吸収されたのです。"
        }
      },
      {
        "heading": {
          "en": "The Number That Actually Moves",
          "es": "El Número Que Realmente Se Mueve",
          "ko": "실제로 움직이는 숫자",
          "zh": "真正在变化的那个数字",
          "ja": "実際に動く数字"
        },
        "body": {
          "en": "There's a reason lifestyle inflation matters more than it first appears, and it has nothing to do with disapproving of nice apartments.\n\nAlmost everything people want money to do — an emergency fund that turns a crisis into an inconvenience (Lesson 14), money invested early enough for compounding to do the heavy lifting (Lesson 15), eventually the option to work less or differently — is funded by one thing: the gap between what you earn and what you spend. Not income. The gap.\n\nThat distinction produces a genuinely counterintuitive result. Someone earning $50,000 and spending $45,000 has a gap of $5,000. Someone earning $120,000 and spending $115,000 also has a gap of $5,000. The second person has a materially nicer life — and is exactly as far from every goal the gap funds. This is why high earners can and regularly do live paycheck to paycheck, and why 'I'll start once I earn more' so often doesn't survive contact with actually earning more. Lifestyle inflation is precisely the mechanism that keeps the gap flat while the top line rises.\n\nNotice too that the gap moves from both ends at once. Holding spending steady while income rises doesn't just add to what you keep — it also lowers the amount you'd need to sustain your life, which shortens the distance to any goal measured in years of expenses. Raising your spending does the reverse, twice over. That's arithmetic, not a rule about how much anyone ought to save; people weigh that trade-off very differently and reasonably so.\n\nThe practical counter people use is simple, and it works because of the timing rather than the willpower: decide what a raise is for before it arrives. Splitting it in advance — this share to living better, this share to the gap — is a far easier decision than trying to claw money back after it has quietly become part of what normal costs. Some people also re-run the exercise once a year by listing their recurring costs and asking which ones they'd sign up for again today, which catches the subscriptions and upgrades that survived only by never being reconsidered.\n\nAnd none of this argues for refusing to ever improve your life. A raise spent deliberately on something that genuinely matters to you is a raise doing its job. The failure mode is narrower than that, and it's the same one Lesson 28 described: the upgrade that happened without anyone deciding it should.",
          "es": "Hay una razón por la que la inflación del estilo de vida importa más de lo que parece, y no tiene nada que ver con desaprobar los departamentos bonitos.\n\nCasi todo lo que la gente quiere que el dinero haga — un fondo de emergencia que convierte una crisis en un inconveniente (Lección 14), dinero invertido lo bastante temprano para que el interés compuesto haga el trabajo pesado (Lección 15), y con el tiempo la opción de trabajar menos o de otra forma — se financia con una sola cosa: la brecha entre lo que ganas y lo que gastas. No el ingreso. La brecha.\n\nEsa distinción produce un resultado genuinamente contraintuitivo. Alguien que gana $50,000 y gasta $45,000 tiene una brecha de $5,000. Alguien que gana $120,000 y gasta $115,000 también tiene una brecha de $5,000. La segunda persona tiene una vida materialmente mejor — y está exactamente igual de lejos de cada meta que la brecha financia. Por eso quienes ganan mucho pueden vivir, y a menudo viven, de sueldo en sueldo, y por eso 'empiezo cuando gane más' tantas veces no sobrevive al hecho de ganar más. La inflación del estilo de vida es justamente el mecanismo que mantiene la brecha plana mientras la cifra de arriba sube.\n\nNota además que la brecha se mueve por ambos extremos a la vez. Mantener el gasto estable mientras sube el ingreso no solo suma a lo que conservas — también baja lo que necesitarías para sostener tu vida, lo que acorta la distancia a cualquier meta medida en años de gastos. Subir el gasto hace lo contrario, por partida doble. Eso es aritmética, no una regla sobre cuánto debería ahorrar nadie; la gente pondera ese intercambio de formas muy distintas, y con razón.\n\nEl contrapeso práctico que usa la gente es simple, y funciona por el momento en que se aplica más que por la fuerza de voluntad: decidir para qué es un aumento antes de que llegue. Repartirlo por adelantado — esta parte a vivir mejor, esta parte a la brecha — es una decisión mucho más fácil que intentar recuperar dinero después de que se volvió parte de lo que cuesta lo normal. Algunos repiten el ejercicio una vez al año listando sus costos recurrentes y preguntándose cuáles contratarían de nuevo hoy, lo que atrapa las suscripciones y mejoras que sobrevivieron solo por no haber sido reconsideradas.\n\nY nada de esto es un argumento para no mejorar nunca tu vida. Un aumento gastado deliberadamente en algo que de verdad te importa es un aumento haciendo su trabajo. El modo de fallo es más estrecho, y es el mismo que describió la Lección 28: la mejora que ocurrió sin que nadie decidiera que debía ocurrir.",
          "ko": "생활수준 인플레이션이 처음 보이는 것보다 중요한 이유가 있고, 그것은 좋은 집을 못마땅해하는 것과는 아무 상관이 없습니다.\n\n사람들이 돈으로 하고 싶어 하는 거의 모든 것 — 위기를 불편함으로 바꿔주는 비상금(14강), 복리가 일하도록 충분히 일찍 투자한 돈(15강), 그리고 언젠가 덜 일하거나 다르게 일할 수 있는 선택지 — 은 단 하나로 조달됩니다. 버는 것과 쓰는 것 사이의 격차입니다. 소득이 아니라 격차입니다.\n\n이 구분은 정말로 직관에 반하는 결과를 낳습니다. 5만 달러를 벌고 4만 5천 달러를 쓰는 사람의 격차는 5천 달러입니다. 12만 달러를 벌고 11만 5천 달러를 쓰는 사람의 격차도 5천 달러입니다. 두 번째 사람은 확실히 더 나은 생활을 하지만, 그 격차가 조달하는 모든 목표로부터 정확히 같은 거리에 있습니다. 고소득자가 월급날에서 월급날로 살아갈 수 있고 실제로 흔히 그러한 이유이며, '더 벌면 그때 시작하지'가 실제로 더 벌게 되었을 때 자주 살아남지 못하는 이유입니다. 생활수준 인플레이션은 맨 윗줄이 올라가는 동안 격차를 평평하게 유지시키는 바로 그 메커니즘입니다.\n\n격차가 양쪽 끝에서 동시에 움직인다는 점도 눈여겨보세요. 소득이 오르는 동안 지출을 유지하면 남기는 돈이 늘어날 뿐 아니라, 생활을 유지하는 데 필요한 금액 자체가 낮아집니다. 그러면 '몇 년치 생활비'로 측정되는 모든 목표까지의 거리가 짧아집니다. 지출을 올리면 정반대가 두 배로 일어납니다. 이것은 누가 얼마를 저축해야 한다는 규칙이 아니라 산수입니다. 사람마다 이 트레이드오프를 매우 다르게 판단하며, 그럴 만합니다.\n\n사람들이 쓰는 실용적인 대응은 단순하고, 의지력보다 타이밍 덕분에 작동합니다: 인상분이 무엇을 위한 것인지 도착하기 전에 정해두는 것입니다. 미리 나누는 것 — 이만큼은 더 나은 생활에, 이만큼은 격차에 — 은 돈이 이미 조용히 '정상적인 생활비'의 일부가 된 뒤에 되찾으려는 것보다 훨씬 쉬운 결정입니다. 일 년에 한 번 고정 지출 목록을 적어놓고 '오늘 다시 가입하겠는가'를 묻는 사람들도 있습니다. 재검토된 적이 없다는 이유만으로 살아남은 구독과 업그레이드가 여기서 걸립니다.\n\n그리고 이 중 어느 것도 삶을 절대 개선하지 말라는 주장이 아닙니다. 자신에게 진짜 중요한 것에 의식적으로 쓴 인상분은 제 역할을 하고 있는 것입니다. 실패는 그보다 좁고, 28강이 말한 것과 같습니다: 아무도 그래야 한다고 결정하지 않았는데 일어난 업그레이드입니다.",
          "zh": "生活方式膨胀之所以比乍看之下更重要，是有原因的，而这与看不惯好房子毫无关系。\n\n人们希望钱去做的几乎每一件事——把危机变成小麻烦的应急基金（第14课）、投得足够早以便复利来挑大梁的钱（第15课）、以及最终少工作或换种方式工作的选择权——都由同一件东西来提供资金：你所赚与所花之间的差额。不是收入，是差额。\n\n这个区分会产生一个真正反直觉的结果。年入5万、花掉4.5万的人，差额是5千。年入12万、花掉11.5万的人，差额也是5千。第二个人的生活明显更好——而他距离这个差额所能实现的每一个目标，恰好一样远。这就是为什么高收入者也可能、而且常常真的在月光，也是为什么“等我赚得多了再开始”往往在真的赚得更多之后并没有兑现。生活方式膨胀正是那个让顶端数字上升、差额却保持不动的机制。\n\n还要注意，差额是从两头同时移动的。收入上升时保持支出不变，不只是让你留下的更多——它同时降低了维持你生活所需的金额，从而缩短了以“多少年的开销”来衡量的任何目标的距离。提高支出则会反过来，而且是双倍地反过来。这是算术，不是关于任何人应该存多少钱的规则；人们对这个取舍的权衡差别很大，而且合情合理。\n\n人们采用的实际对策很简单，它起作用靠的是时机而不是意志力：在加薪到账之前就决定它是干什么用的。提前分配——这部分用来把生活过得更好，这部分归入差额——远比等钱已经悄悄变成“正常开销”的一部分之后再想收回来容易得多。也有人每年做一次这个练习：列出所有固定支出，问问自己今天还会不会重新订一遍，这样就能抓出那些仅仅因为从未被重新审视而活下来的订阅和升级。\n\n这一切都不是在主张永远不要改善自己的生活。一笔被有意识地花在对你真正重要的事情上的加薪，正是加薪在发挥作用。真正的失败模式要窄得多，也正是第28课描述的那一种：没有任何人决定它该发生，它却发生了的那种升级。",
          "ja": "ライフスタイルインフレが最初に見えるより重要なのには理由があり、それは良いアパートを否定することとは何の関係もありません。\n\n人がお金にしてほしいことのほとんど——危機を不便に変えてくれる緊急資金（第14講）、複利が力仕事をしてくれるだけ早く投じたお金（第15講）、そしていずれ働く量や働き方を選べるという選択肢——は、たった一つのもので賄われます。稼ぐ額と使う額の差です。収入ではありません。差です。\n\nこの区別は、本当に直感に反する結果を生みます。5万ドル稼いで4万5千ドル使う人の差は5千ドル。12万ドル稼いで11万5千ドル使う人の差も5千ドルです。後者は明らかに物質的に良い生活をしていて——その差が賄うあらゆる目標から、まったく同じだけ離れています。高所得者が給料日から給料日へと暮らすことがあり、実際によくあるのはこのためで、「もっと稼げるようになったら始める」が実際に稼げるようになっても果たされないことが多いのもこのためです。ライフスタイルインフレは、一番上の数字が上がる間、差を平らなまま保つ、まさにその仕組みです。\n\n差が両端から同時に動くことにも注目してください。収入が上がる間に支出を据え置けば、手元に残る額が増えるだけでなく、生活を維持するのに必要な額そのものが下がります。すると「何年分の生活費」で測るあらゆる目標までの距離が縮まります。支出を上げれば、その逆が二重に起きます。これは誰がいくら貯めるべきかという規則ではなく、算数です。人によってこのトレードオフの重みづけは大きく違い、それは当然のことです。\n\n人々が使う実際的な対策は単純で、意志力ではなくタイミングによって効きます：昇給が届く前に、それが何のためのものかを決めておくことです。あらかじめ分けておく——この分は生活を良くするために、この分は差に——というのは、お金が静かに「普通の生活費」の一部になった後で取り返そうとするより、はるかに簡単な決断です。年に一度、固定費を書き出して「今日もう一度申し込むか」を問う人もいます。見直されなかったという理由だけで生き延びたサブスクやアップグレードは、ここで引っかかります。\n\nそしてこのどれも、生活を決して良くするなという主張ではありません。自分にとって本当に大切なものに意識的に使われた昇給は、昇給が役目を果たしているということです。失敗のパターンはもっと狭く、第28講が述べたものと同じです：誰もそうすべきだと決めていないのに起きたアップグレードです。"
        }
      }
    ],
    "takeaway": {
      "en": "Lifestyle inflation isn't overspending — it's a series of individually reasonable upgrades that quietly reset what 'normal' costs, and it's hard to see because the pleasure of each one fades while its cost doesn't. What actually determines the trajectory is the gap between earning and spending, not the earning alone, which is why a raise only widens that gap if something decides in advance that it should.",
      "es": "La inflación del estilo de vida no es gastar de más — es una serie de mejoras individualmente razonables que en silencio redefinen lo que cuesta 'lo normal', y cuesta verla porque el placer de cada una se desvanece mientras su costo no. Lo que realmente determina la trayectoria es la brecha entre ganar y gastar, no lo que se gana, y por eso un aumento solo amplía esa brecha si algo decide de antemano que debe hacerlo.",
      "ko": "생활수준 인플레이션은 과소비가 아닙니다 — 개별적으로는 합리적인 업그레이드들이 '정상'의 비용을 조용히 재설정하는 것이며, 각각의 즐거움은 사라지는데 비용은 사라지지 않기 때문에 알아차리기 어렵습니다. 실제로 궤도를 결정하는 것은 버는 것과 쓰는 것 사이의 격차이지 소득 자체가 아닙니다. 그래서 급여 인상은 무언가가 미리 그렇게 하기로 정했을 때만 그 격차를 넓힙니다.",
      "zh": "生活方式膨胀不是乱花钱——它是一连串单看都合理的升级，悄悄重设了“正常”的花费标准；它难以察觉，是因为每一次升级的愉悦都会消退，而成本不会。真正决定轨迹的是赚与花之间的差额，而不是赚多少本身——所以一次加薪只有在事先有人决定它该如此时，才会把这个差额拉大。",
      "ja": "ライフスタイルインフレは使いすぎではありません——個別には妥当なアップグレードの連続が、「普通」にかかる費用を静かに置き換えていくことであり、一つひとつの喜びは薄れるのに費用は薄れないため、見えにくいのです。軌道を実際に決めるのは稼ぎそのものではなく、稼ぎと支出の差です。だから昇給がその差を広げるのは、あらかじめ何かがそう決めたときだけです。"
    },
    "thinkAbout": {
      "en": "Think back to what you earned three years ago. If it's higher now, try to name where the difference goes each month. Most people can account for one or two changes and then run out — and that isn't a memory problem, it's the ratchet: the upgrades that stopped being noticeable are exactly the ones still being paid for.",
      "es": "Piensa en lo que ganabas hace tres años. Si hoy ganas más, intenta nombrar a dónde va la diferencia cada mes. La mayoría puede explicar uno o dos cambios y luego se queda sin respuestas — y eso no es un problema de memoria, es el trinquete: las mejoras que dejaron de notarse son exactamente las que se siguen pagando.",
      "ko": "3년 전 소득을 떠올려 보세요. 지금이 더 높다면, 그 차액이 매달 어디로 가는지 이름을 붙여보세요. 대부분은 한두 가지를 대고 나면 더 이상 떠오르지 않습니다 — 그것은 기억력 문제가 아니라 톱니바퀴입니다. 더 이상 눈에 띄지 않게 된 업그레이드가 바로 지금도 계속 돈을 내고 있는 것들입니다.",
      "zh": "回想一下你三年前的收入。如果现在更高了，试着说出这笔差额每个月都去了哪里。大多数人能说出一两项变化，然后就说不下去了——这不是记性问题，而是棘轮：那些已经不再被注意到的升级，恰恰就是你仍在为之付钱的东西。",
      "ja": "3年前の自分の収入を思い出してください。今の方が高いなら、その差額が毎月どこへ行っているかを挙げてみてください。多くの人は1つか2つ挙げたところで止まります——これは記憶力の問題ではなく、ラチェットです。気に留まらなくなったアップグレードこそが、今も払い続けているものなのです。"
    }
  },
  30: {
    "sections": [
      {
        "heading": {
          "en": "The Real Price Includes What You Gave Up",
          "es": "El Precio Real Incluye Lo Que Sacrificaste",
          "ko": "진짜 가격에는 포기한 것도 포함된다",
          "zh": "真正的价格，包含了你放弃的东西",
          "ja": "本当の値段には、諦めたものも含まれる"
        },
        "body": {
          "en": "Jordan and Alex each got a $2,000 year-end bonus from the same job. Jordan spent his on a home theater system — a big screen, a soundbar, and a comfortable chair for the living room. Alex left hers in an account earning compound interest at 6% a year, the same example Lesson 15 walked through, and didn't touch it.\n\nTen years later, Jordan's home theater has given him plenty of movie nights, but used electronics lose value fast — it's worth maybe a couple hundred dollars now, if he bothered to sell it. Alex's $2,000 has grown to roughly $3,580, without her adding another dollar.\n\nHere's the part that's easy to miss. In the everyday sense, Jordan spent $2,000. But the number that actually reflects what the choice cost him is closer to $3,580 — the $2,000 plus everything it would have become had he chosen differently. Economists have a name for this: the real cost of anything isn't only what you paid for it, it's the value of the next-best alternative you gave up to get it. That's opportunity cost, and it applies even where no money changes hands at all — an evening spent scrolling has an opportunity cost measured in whatever else that evening could have been. A price tag only ever shows half the picture.\n\nNone of this makes Jordan's purchase a mistake. Ten years of movie nights with friends is a real thing he has and Alex doesn't. The point isn't that saving always wins — it's that comparing '$2,000 now' against '$0 now' is the wrong comparison. The honest one is '$2,000 of enjoyment now' against 'roughly $3,580 later, or whatever else that $2,000 could have become.' Only one of those framings actually lets you decide.",
          "es": "Jordan y Alex recibieron cada uno un bono de fin de año de $2,000 en el mismo trabajo. Jordan gastó el suyo en un sistema de cine en casa — una pantalla grande, una barra de sonido y un sillón cómodo para la sala. Alex dejó el suyo en una cuenta que gana interés compuesto al 6% anual, el mismo ejemplo que recorrió la Lección 15, y no lo tocó.\n\nDiez años después, el cine en casa de Jordan le ha dado muchas noches de películas, pero los aparatos electrónicos usados pierden valor rápido — hoy vale quizás un par de cientos de dólares, si se molestara en venderlo. Los $2,000 de Alex han crecido a unos $3,580, sin que ella agregara ni un dólar más.\n\nAquí está la parte fácil de pasar por alto. En el sentido cotidiano, Jordan gastó $2,000. Pero el número que realmente refleja lo que le costó esa decisión es más cercano a $3,580 — los $2,000 más todo lo que se habría convertido si hubiera elegido distinto. Los economistas tienen un nombre para esto: el costo real de algo no es solo lo que pagaste por ello, es el valor de la mejor alternativa a la que renunciaste para conseguirlo. Eso es el costo de oportunidad, y aplica incluso donde no cambia de manos ni un dólar — una tarde pasada viendo el teléfono tiene un costo de oportunidad medido en cualquier otra cosa que esa tarde pudo haber sido. Una etiqueta de precio solo muestra la mitad de la historia.\n\nNada de esto hace que la compra de Jordan sea un error. Diez años de noches de películas con amigos es algo real que él tiene y Alex no. El punto no es que ahorrar siempre gane — es que comparar '$2,000 ahora' contra '$0 ahora' es la comparación equivocada. La honesta es '$2,000 de disfrute ahora' contra 'unos $3,580 después, o lo que sea que esos $2,000 pudieran haberse convertido'. Solo uno de esos marcos te deja realmente decidir.",
          "ko": "조던과 알렉스는 같은 직장에서 각각 2,000달러의 연말 보너스를 받았습니다. 조던은 그 돈을 홈시어터 시스템에 썼습니다 — 큰 화면, 사운드바, 거실에 둘 편안한 의자까지. 알렉스는 그 돈을 연 6% 복리 이자가 붙는 계좌에 그대로 두었습니다 — 15강이 다룬 것과 같은 예시입니다 — 그리고 건드리지 않았습니다.\n\n10년 뒤, 조던의 홈시어터는 많은 영화의 밤을 선사했지만, 중고 전자제품은 가치가 빠르게 떨어집니다 — 지금 팔려고 하면 아마 몇백 달러밖에 안 될 것입니다. 알렉스의 2,000달러는 한 푼도 더 넣지 않았는데도 약 3,580달러로 불어났습니다.\n\n여기서 놓치기 쉬운 부분이 있습니다. 일상적인 의미에서 조던은 2,000달러를 썼습니다. 하지만 그 선택이 실제로 그에게 치르게 한 비용을 제대로 반영하는 숫자는 3,580달러에 더 가깝습니다 — 2,000달러에, 다르게 선택했다면 그 돈이 되었을 모든 것을 더한 값입니다. 경제학자들은 이것에 이름을 붙였습니다. 무언가의 진짜 비용은 그것을 위해 지불한 금액만이 아니라, 그것을 얻기 위해 포기한 차선의 대안이 지닌 가치입니다. 이것이 기회비용이며, 돈이 전혀 오가지 않는 곳에서도 적용됩니다 — 휴대폰을 들여다보며 보낸 저녁 시간에도, 그 시간이 될 수 있었던 다른 무언가만큼의 기회비용이 있습니다. 가격표는 언제나 절반의 그림만 보여줍니다.\n\n그렇다고 조던의 구매가 잘못되었다는 뜻은 아닙니다. 친구들과 보낸 10년치 영화의 밤은 그가 가졌고 알렉스는 갖지 못한 실재하는 것입니다. 핵심은 저축이 항상 이긴다는 것이 아니라, '지금의 2,000달러'와 '지금의 0달러'를 비교하는 것 자체가 잘못된 비교라는 것입니다. 정직한 비교는 '지금의 2,000달러어치 즐거움'과 '나중의 약 3,580달러, 혹은 그 2,000달러가 될 수 있었던 다른 무엇'입니다. 오직 이 비교여야만 실제로 결정을 내릴 수 있습니다.",
          "zh": "乔丹和艾莉克丝在同一家公司各拿到了2,000美元的年终奖金。乔丹把钱花在了一套家庭影院系统上——大屏幕、音响条，还有客厅里一张舒适的椅子。艾莉克丝把钱留在一个年利率6%的复利账户里——就是第15课讲过的那个例子——一直没有动过。\n\n十年后，乔丹的家庭影院给了他不少电影之夜，但二手电子产品贬值很快——现在如果他愿意卖掉，大概只值几百美元。艾莉克丝的2,000美元在她一分钱都没再加的情况下，已经涨到了大约3,580美元。\n\n这里有个容易被忽略的地方。从日常的意义上说，乔丹花掉了2,000美元。但真正反映这个选择让他付出多少代价的数字，其实更接近3,580美元——2,000美元，加上如果他做出不同选择，这笔钱本可以变成的一切。经济学家给这个现象起了个名字：任何东西的真实成本，不只是你为它付出的钱，还包括你为了得到它而放弃的次优选择的价值。这就是机会成本，即使根本没有钱易手，它也同样适用——一个晚上花在刷手机上，也有机会成本，衡量标准是那个晚上本可以变成的其他任何事情。价格标签永远只显示了故事的一半。\n\n这一切并不代表乔丹的这笔消费是个错误。和朋友一起度过的十年电影之夜，是他拥有而艾莉克丝没有的真实东西。重点不是储蓄永远赢，而是拿'现在的2,000美元'去和'现在的0美元'比较，本身就是错误的比较。诚实的比较应该是'现在2,000美元带来的享受'对'以后大约3,580美元，或者那2,000美元本可以变成的任何其他东西'。只有这后一种比较，才能真正让你做出决定。",
          "ja": "ジョーダンとアレックスは同じ会社で、それぞれ2,000ドルの年末ボーナスを受け取りました。ジョーダンはそれをホームシアターシステムに使いました——大画面、サウンドバー、リビング用の座り心地の良い椅子。アレックスは年利6%の複利で増える口座にそのまま入れておきました——第15講で扱ったのと同じ例です——そして一切手をつけませんでした。\n\n10年後、ジョーダンのホームシアターは数えきれないほどの映画の夜を彼に与えてくれましたが、中古の電化製品は価値がすぐに下がります——今売ろうと思えば、おそらく数百ドルにしかなりません。アレックスの2,000ドルは、彼女が一ドルも追加しないまま、約3,580ドルにまで増えました。\n\nここに見落としやすい点があります。日常的な意味では、ジョーダンは2,000ドルを使いました。しかしその選択が実際に彼に払わせた代償を正しく表す数字は、3,580ドルに近いものです——2,000ドルに、もし違う選択をしていたらそのお金がなっていたはずのすべてを足したものです。経済学者はこれに名前を付けています。何かの本当のコストとは、それに支払った金額だけでなく、それを手に入れるために諦めた次善の選択肢が持っていた価値のことです。これが機会費用であり、お金がまったく動かない場面にも当てはまります——スマホを眺めて過ごした夜にも、その夜がなり得た他の何かの分だけ、機会費用があります。値札はいつも物語の半分しか見せてくれません。\n\nだからといって、ジョーダンの買い物が間違いだったわけではありません。友人たちと過ごした10年分の映画の夜は、彼が手にしていてアレックスが手にしていない、本物のものです。要点は貯蓄が常に勝つということではなく、「今の2,000ドル」と「今の0ドル」を比べること自体が間違った比較だということです。正直な比較は「今の2,000ドル分の楽しみ」と「後の約3,580ドル、あるいはその2,000ドルがなり得た他の何か」です。この比較だけが、実際に決断させてくれます。"
        }
      },
      {
        "heading": {
          "en": "Why Later Loses to Now (and How to Change the Math)",
          "es": "Por Qué el Después Pierde Contra el Ahora (y Cómo Cambiar la Ecuación)",
          "ko": "왜 '나중'은 '지금'에게 지는가 (그리고 그 계산을 바꾸는 법)",
          "zh": "为什么'以后'总是输给'现在'（以及如何改变这道算式）",
          "ja": "なぜ「後で」は「今」に負けるのか（そして、その計算を変える方法）"
        },
        "body": {
          "en": "There's a reason opportunity cost is easy to understand and hard to act on: the alternative you're giving up is invisible right now. The home theater is sitting right there in the store. The roughly $3,580 Alex ends up with is ten years away and, until it exists, entirely imaginary. Comparing something vivid and present against something abstract and future is not a fair fight, and the future usually loses — a pattern researchers call temporal discounting: the further away a reward is, the smaller it feels, even though its actual value hasn't changed at all.\n\nA well-known set of experiments starting in the 1960s tested this directly with children and a single marshmallow: eat it now, or wait alone in a room for several minutes to get a second one. Later research complicated the original story — how well a child does at waiting turns out to depend heavily on things outside their control, like whether their household has taught them that promises about 'later' are usually kept. That complication doesn't erase the core finding, it sharpens it: delaying gratification isn't a fixed trait some people have and others don't, it's a skill that gets easier to practice when the environment makes waiting feel safe.\n\nWhich points at something more useful than raw willpower. Trying to out-willpower a vivid, present temptation every single time is exhausting, and research on self-control consistently finds it unreliable — willpower runs low over the course of a day the way a muscle gets tired. The alternative is to change the choice itself so it doesn't need a fresh fight each time. Moving money into savings automatically on payday, before it ever sits in a spendable account, is one way people do this — the decision gets made once, in advance, instead of resisted daily. Some do the same thing with time: blocking a recurring slot on the calendar for something that matters to their future self, so it competes with nothing else for that hour instead of needing to be chosen fresh every day.\n\nPut together, these two ideas do different jobs. Opportunity cost tells you honestly what a choice actually costs, including the part with no price tag on it. Delayed gratification is what lets you act on that information when the tempting option is right in front of you and the better one is ten years, or even just ten minutes, away.",
          "es": "Hay una razón por la que el costo de oportunidad es fácil de entender y difícil de aplicar: la alternativa a la que renuncias es invisible en este momento. El cine en casa está ahí mismo, en la tienda. Los aproximadamente $3,580 que Alex termina teniendo están a diez años de distancia y, hasta que existan, son puramente imaginarios. Comparar algo vívido y presente contra algo abstracto y futuro no es una pelea justa, y el futuro suele perder — un patrón que los investigadores llaman descuento temporal: cuanto más lejos está una recompensa, más pequeña se siente, aunque su valor real no haya cambiado en absoluto.\n\nUna conocida serie de experimentos que comenzó en los años 1960 puso esto a prueba directamente con niños y un solo malvavisco: comerlo ahora, o esperar solo en una habitación durante varios minutos para conseguir un segundo. Investigaciones posteriores complicaron la historia original — qué tan bien le va a un niño esperando resulta depender mucho de cosas fuera de su control, como si su hogar le ha enseñado que las promesas sobre 'después' normalmente se cumplen. Esa complicación no borra el hallazgo central, lo afina: retrasar la gratificación no es un rasgo fijo que unos tienen y otros no, es una habilidad que se vuelve más fácil de practicar cuando el entorno hace que esperar se sienta seguro.\n\nEso apunta a algo más útil que la pura fuerza de voluntad. Intentar vencer con fuerza de voluntad una tentación vívida y presente cada vez es agotador, y la investigación sobre el autocontrol encuentra consistentemente que no es confiable — la fuerza de voluntad se agota a lo largo del día como se cansa un músculo. La alternativa es cambiar la elección misma para que no necesite una pelea nueva cada vez. Mover dinero al ahorro automáticamente el día de pago, antes de que llegue siquiera a una cuenta de la que se pueda gastar, es una forma en que la gente hace esto — la decisión se toma una sola vez, de antemano, en vez de resistirse a diario. Algunos hacen lo mismo con el tiempo: bloquear un horario recurrente en el calendario para algo que le importa a su yo futuro, de modo que no compita con nada más por esa hora, en vez de tener que elegirse de nuevo cada día.\n\nJuntas, estas dos ideas cumplen funciones distintas. El costo de oportunidad te dice honestamente cuánto cuesta realmente una elección, incluida la parte sin etiqueta de precio. La gratificación retrasada es lo que te permite actuar con esa información cuando la opción tentadora está justo enfrente y la mejor está a diez años, o incluso a solo diez minutos, de distancia.",
          "ko": "기회비용이 이해하기는 쉬운데 실행하기는 어려운 데는 이유가 있습니다. 지금 포기하는 대안이 눈에 보이지 않기 때문입니다. 홈시어터는 바로 저기 매장에 있습니다. 알렉스가 결국 갖게 될 약 3,580달러는 10년 뒤에나 존재하며, 존재하기 전까지는 순전히 상상 속의 것입니다. 생생하고 눈앞에 있는 것과 추상적이고 미래에 있는 것을 비교하는 것은 공정한 대결이 아니고, 대개 미래가 집니다 — 연구자들이 시간 할인이라고 부르는 패턴입니다. 보상의 실제 가치는 그대로인데도, 멀리 있을수록 더 작게 느껴지는 것입니다.\n\n1960년대에 시작된 유명한 일련의 실험은 이것을 아이들과 마시멜로 하나로 직접 실험했습니다. 지금 먹거나, 방에 혼자 몇 분간 기다려서 하나를 더 받거나. 이후 연구는 원래의 이야기를 더 복잡하게 만들었습니다 — 아이가 얼마나 잘 기다리는지는, '나중'이라는 약속이 대체로 지켜진다고 그 가정이 가르쳐 왔는지처럼, 아이가 통제할 수 없는 요인에 크게 좌우되는 것으로 드러났습니다. 이 복잡한 사정이 핵심 발견을 지우는 것은 아니고, 오히려 더 다듬어 줍니다. 만족을 미루는 것은 어떤 사람은 타고났고 다른 사람은 아닌 고정된 특성이 아니라, 환경이 기다림을 안전하게 느끼게 해줄 때 더 쉽게 연습할 수 있는 기술입니다.\n\n이것은 순수한 의지력보다 더 쓸모 있는 무언가를 가리킵니다. 생생하고 눈앞에 있는 유혹을 매번 의지력만으로 이기려는 것은 지치는 일이고, 자기통제에 관한 연구는 그것이 신뢰할 수 없다는 것을 꾸준히 보여줍니다 — 의지력은 근육이 지치듯 하루가 지나면서 소진됩니다. 대안은 선택 자체를 바꿔서 매번 새로 싸우지 않아도 되게 만드는 것입니다. 월급날에 돈을 쓸 수 있는 계좌에 들어가기도 전에 자동으로 저축으로 옮기는 것이 사람들이 이렇게 하는 한 가지 방법입니다 — 결정을 매일 저항하는 대신 미리 한 번만 내리는 것입니다. 어떤 사람들은 시간에도 같은 방법을 씁니다. 미래의 자신에게 중요한 무언가를 위해 달력에 반복되는 시간대를 미리 막아두어서, 그 시간이 매일 새로 선택되어야 하는 대신 다른 어떤 것과도 경쟁하지 않게 만드는 것입니다.\n\n이 두 개념을 합치면 서로 다른 역할을 합니다. 기회비용은 가격표가 없는 부분까지 포함해서 어떤 선택이 실제로 얼마나 드는지 정직하게 알려줍니다. 지연된 만족은 유혹적인 선택지가 바로 눈앞에 있고 더 나은 선택지는 10년, 혹은 단 10분 떨어져 있을 때, 그 정보를 바탕으로 실제로 행동할 수 있게 해주는 것입니다.",
          "zh": "机会成本容易理解却难以践行，是有原因的：你放弃的那个选项，此刻是看不见的。家庭影院就摆在商店里，看得见摸得着。而艾莉克丝最终得到的那大约3,580美元，还在十年之后，在它真正存在之前，纯粹只是想象。拿一个鲜活、就在眼前的东西，去和一个抽象、还在未来的东西比较，这本身就不是一场公平的较量，而未来通常会输——研究者称这种模式为时间贴现：一份回报离现在越远，即便它的实际价值完全没变，感觉上也会越小。\n\n一系列始于1960年代的著名实验，用孩子和一块棉花糖直接检验了这一点：现在就吃掉，或者独自在房间里等几分钟，换取第二块。后来的研究让这个原本的故事变得更复杂——一个孩子能不能等下去，很大程度上取决于他们无法控制的因素，比如他们的家庭是否教会了他们，关于'以后'的承诺通常会兑现。这个复杂之处并没有抹去核心发现，反而让它更精细：延迟满足不是有些人天生具备、有些人天生缺乏的固定特质，而是一种技能——当环境让等待感觉安全时，这种技能会更容易练习。\n\n这指向了一件比单靠意志力更有用的事。每一次都想靠意志力硬扛住一个鲜活、就在眼前的诱惑，是很累人的，而关于自制力的研究也一贯发现这并不可靠——意志力会像肌肉一样，随着一天过去而逐渐疲乏。另一种办法，是改变选择本身，让它不需要每次都重新打一场硬仗。在发薪日就自动把钱转入储蓄账户，在它还没进入可以随手花掉的账户之前——这是人们常用的一种方式，决定只需提前做一次，而不是每天都要重新抵抗。也有人对时间做同样的事：在日历上固定留出一段对未来的自己重要的时间，让这段时间不与任何别的事竞争，而不是每天都要重新去选择它。\n\n把这两个概念合在一起，它们各自承担不同的角色。机会成本诚实地告诉你一个选择究竟要付出多少代价，包括那部分没有价格标签的代价。延迟满足则是让你在诱人的选项就在眼前、而更好的选项还有十年——甚至只是十分钟——之遥时，依然能依据这份信息去行动的能力。",
          "ja": "機会費用が理解しやすいのに実行しにくいのには理由があります。今あなたが諦めている選択肢は、今この瞬間には見えないからです。ホームシアターはお店にちゃんと存在しています。アレックスが最終的に手にする約3,580ドルは10年先のことで、それが実際に存在するまでは、まったくの想像上のものです。鮮やかで目の前にあるものと、抽象的で未来にあるものを比べるのは公平な勝負ではなく、たいてい未来の方が負けます——研究者たちがこれを時間割引と呼ぶ現象です。実際の価値はまったく変わっていないのに、報酬が遠くにあるほど小さく感じられるのです。\n\n1960年代に始まった有名な一連の実験は、子どもとマシュマロ1個でこれを直接検証しました。今すぐ食べるか、部屋に一人で数分間待って2個目をもらうか。その後の研究は、元の話をより複雑にしました——子どもがどれだけうまく待てるかは、「後で」という約束が普段はちゃんと守られると家庭で教わってきたかどうかなど、その子には制御できない要因に大きく左右されることがわかったのです。この複雑さは中心的な発見を消すものではなく、むしろそれを研ぎ澄ますものです。満足を先延ばしにする力は、一部の人だけが生まれ持ち他の人は持たない固定的な特性ではなく、待つことが安全だと感じられる環境があれば、より練習しやすくなる技能なのです。\n\nこのことは、純粋な意志力よりも役に立つものを示しています。鮮やかで目の前にある誘惑に、毎回意志力だけで打ち勝とうとするのは疲れる作業であり、自己抑制に関する研究も一貫してそれが当てにならないことを示しています——意志力は筋肉が疲れるのと同じように、一日のうちに目減りしていきます。代わりにできるのは、選択そのものを変えて、毎回新たに戦わなくて済むようにすることです。給料日に、使えるお金として口座に入る前に自動的に貯蓄へ移す——これは人々がよく使う方法の一つで、決断は日々抵抗するのではなく、あらかじめ一度だけ下されます。時間についても同じことをする人がいます。未来の自分にとって大切な何かのために、カレンダーに繰り返しの時間枠をあらかじめ確保しておき、その時間を毎日改めて選び直す必要がないようにするのです。\n\nこの2つの考え方は合わさって、それぞれ違う役割を果たします。機会費用は、値札のない部分も含めて、ある選択が実際にどれだけの代償を伴うのかを正直に教えてくれます。満足の先延ばしは、魅力的な選択肢が目の前にあり、より良い選択肢が10年先、あるいはたった10分先にあるときに、その情報をもとに実際に行動することを可能にしてくれるものです。"
        }
      }
    ],
    "takeaway": {
      "en": "The real cost of a choice is not what you paid — it's what you gave up by not choosing the next-best alternative, whether that's money, time, or something else. That cost is easy to ignore because the alternative is invisible and the temptation is not; making the future concrete — or automatic — is what lets you weigh the two honestly instead of just picking whichever one is standing in front of you.",
      "es": "El costo real de una elección no es lo que pagaste — es lo que dejaste de tener por no elegir la mejor alternativa, ya sea dinero, tiempo, u otra cosa. Ese costo es fácil de ignorar porque la alternativa es invisible y la tentación no lo es; hacer el futuro concreto — o automático — es lo que te permite sopesar ambos con honestidad, en vez de simplemente elegir lo que tienes enfrente.",
      "ko": "선택의 진짜 비용은 지불한 금액이 아니라, 차선의 대안을 선택하지 않아서 놓친 것입니다 — 돈이든 시간이든 다른 무엇이든요. 그 비용은 눈에 보이지 않고 유혹은 눈에 보이기 때문에 무시하기 쉽습니다. 미래를 구체적으로, 혹은 자동으로 만드는 것이 바로 눈앞에 있는 것을 그냥 고르는 대신 둘을 정직하게 저울질할 수 있게 해줍니다.",
      "zh": "一个选择的真实成本不是你付出的钱，而是因为没有选择那个次优替代方案而失去的东西——无论是钱、时间还是别的什么。这份成本很容易被忽视，因为替代方案是看不见的，而诱惑却看得见；让未来变得具体——或者变得自动化——才能让你诚实地权衡两者，而不是只挑眼前摆着的那个。",
      "ja": "選択の本当のコストは、支払った金額ではなく、次善の選択肢を選ばなかったことで失ったもの——お金であれ、時間であれ、他の何かであれ——です。そのコストは目に見えず、誘惑は目に見えるため、見過ごされがちです。未来を具体的に、あるいは自動的にすることこそが、目の前にあるものをただ選ぶのではなく、両者を正直に天秤にかけられるようにしてくれます。"
    },
    "thinkAbout": {
      "en": "Think of one thing you're planning to buy or do this week that isn't a necessity. Name its opportunity cost specifically — not 'giving something up' in the abstract, but the actual next-best alternative use of that money or time. Then decide, now that it has a name, whether you'd still choose it.",
      "es": "Piensa en algo que planeas comprar o hacer esta semana que no sea una necesidad. Nombra su costo de oportunidad específicamente — no 'renunciar a algo' en abstracto, sino el uso alternativo real y concreto de ese dinero o tiempo. Luego decide, ahora que tiene nombre, si todavía lo elegirías.",
      "ko": "이번 주에 사거나 하려고 계획 중인, 꼭 필요하지는 않은 무언가 하나를 떠올려 보세요. 그것의 기회비용을 구체적으로 이름 붙여 보세요 — 막연히 '무언가를 포기한다'가 아니라, 그 돈이나 시간의 실제 차선책이 무엇인지를요. 그렇게 이름을 붙이고 나서, 여전히 그것을 선택할지 결정해 보세요.",
      "zh": "想一想你这周计划买或做的、并非必需的一件事。具体说出它的机会成本——不是抽象地说'放弃了什么'，而是那笔钱或那段时间真正的次优替代用途是什么。然后，在它有了具体名字之后，再决定你是否仍然会这样选择。",
      "ja": "今週、必需品ではないのに買ったりしたりしようと思っていることを一つ思い浮かべてください。その機会費用を具体的に名づけてみましょう——漠然と「何かを諦める」ではなく、そのお金や時間の実際の次善の使い道を、です。名前がついた今、それでもまだそれを選ぶかどうかを決めてみてください。"
    }
  },
  31: {
    "sections": [
      {
        "heading": {
          "en": "The Money's Already Gone",
          "es": "El Dinero Ya Se Fue",
          "ko": "그 돈은 이미 사라졌다",
          "zh": "钱已经花掉了",
          "ja": "そのお金は、もう戻ってこない"
        },
        "body": {
          "en": "Priya bought a $120 concert ticket two months in advance. The night before the show, she comes down with a bad cold — sore throat, no energy, the kind of night where standing in a crowd for three hours sounds miserable. She goes anyway. \"I already paid for it,\" she tells herself, \"I'd be wasting the money if I stayed home.\"\n\nHere's the problem with that reasoning: the $120 is gone either way. It left her account the moment she bought the ticket, weeks before she ever got sick, and no decision she makes tonight can bring it back — not going to the show, not staying home, nothing. Economists call this a sunk cost: money, time, or effort already spent that cannot be recovered no matter what happens next. A cost that can't be changed by any future choice has no business being weighed in that choice. Once Priya takes the $120 out of the decision — because it's gone regardless of what she does tonight — what's actually left to compare is a miserable night out against a restful night in. Framed that way, the answer is obvious. Framed around \"not wasting the ticket,\" it isn't.\n\nThe trap shows up anywhere money, time, or effort was already spent and can't be undone: a gym membership nobody uses but keeps renewing because of what it already cost, a home renovation pushed to completion past the point it still makes sense because of the money already poured into it, a college major kept out of a feeling of obligation to the years already spent rather than interest in where it leads next. In every case the same shape repeats — a past cost that's fixed no matter what happens next, pulling on a decision that should only be about what happens from here.",
          "es": "Priya compró una entrada de concierto de $120 con dos meses de anticipación. La noche antes del show, le da un resfriado fuerte — dolor de garganta, sin energía, el tipo de noche en la que pasar tres horas de pie entre una multitud suena horrible. Va de todas formas. 'Ya lo pagué', se dice a sí misma, 'estaría desperdiciando el dinero si me quedo en casa'.\n\nAquí está el problema con ese razonamiento: los $120 se fueron de cualquier forma. Salieron de su cuenta en el momento en que compró la entrada, semanas antes de enfermarse, y ninguna decisión que tome esta noche puede traerlos de vuelta — ni ir al show, ni quedarse en casa, nada. Los economistas llaman a esto un costo hundido: dinero, tiempo o esfuerzo ya gastado que no se puede recuperar sin importar lo que pase después. Un costo que ninguna decisión futura puede cambiar no debería pesar en esa decisión. Una vez que Priya saca los $120 de la ecuación — porque ya se fueron sin importar lo que haga esta noche — lo que realmente queda por comparar es una noche miserable afuera contra una noche tranquila en casa. Visto así, la respuesta es obvia. Visto como 'no desperdiciar la entrada', no lo es.\n\nLa trampa aparece en cualquier lugar donde ya se gastó dinero, tiempo o esfuerzo y no se puede deshacer: una membresía de gimnasio que nadie usa pero se sigue renovando por lo que ya costó, una remodelación de la casa que se termina más allá del punto en que todavía tiene sentido por el dinero ya invertido en ella, una carrera universitaria que se mantiene por un sentido de obligación hacia los años ya invertidos y no por interés en hacia dónde lleva. En todos los casos se repite la misma forma — un costo pasado que es fijo pase lo que pase, jalando una decisión que solo debería depender de lo que viene de aquí en adelante.",
          "ko": "프리야는 두 달 전에 120달러짜리 콘서트 티켓을 샀습니다. 공연 전날 밤, 그녀는 심한 감기에 걸립니다 — 목이 아프고 기운이 없어서, 세 시간 동안 사람들 틈에 서 있는 것만 생각해도 끔찍한 그런 밤입니다. 그래도 그녀는 갑니다. '이미 돈을 냈잖아,' 그녀는 스스로에게 말합니다. '집에 있으면 그 돈을 낭비하는 거야.'\n\n이 추론의 문제는 이렇습니다. 120달러는 어느 쪽이든 이미 사라졌습니다. 그 돈은 그녀가 아프기 몇 주 전, 티켓을 산 순간 이미 계좌에서 빠져나갔고, 오늘 밤 그녀가 어떤 결정을 내리든 그 돈을 되돌릴 수는 없습니다 — 공연에 가도, 집에 있어도, 아무것도 그 돈을 되찾아주지 않습니다. 경제학자들은 이것을 매몰 비용이라고 부릅니다. 앞으로 무슨 일이 일어나든 되찾을 수 없는, 이미 쓴 돈이나 시간, 노력을 뜻합니다. 어떤 미래의 선택으로도 바꿀 수 없는 비용이라면, 그 선택에 영향을 미칠 이유가 없습니다. 프리야가 120달러를 결정에서 빼고 나면 — 오늘 밤 무엇을 하든 그 돈은 어차피 사라졌으니까요 — 실제로 남는 비교는 끔찍한 외출과 편안한 저녁 중 하나를 고르는 것뿐입니다. 이렇게 보면 답은 명백합니다. '티켓을 낭비하지 않기'로 보면, 그렇지 않습니다.\n\n이 함정은 돈이나 시간, 노력을 이미 썼고 되돌릴 수 없는 곳이라면 어디서든 나타납니다. 아무도 쓰지 않는데 이미 낸 돈이 아까워서 계속 갱신하는 헬스장 회원권, 이미 쏟아부은 돈 때문에 더는 의미가 없는 지점을 지나서까지 밀어붙이는 집 리모델링, 앞으로 어디로 이어질지에 대한 관심보다 이미 쏟은 시간에 대한 의무감 때문에 유지하는 전공. 모든 경우에서 같은 모양이 반복됩니다 — 앞으로 무슨 일이 있든 이미 정해진 과거의 비용이, 오직 지금부터 벌어질 일에만 관련이 있어야 할 결정을 잡아당기는 것입니다.",
          "zh": "普丽雅提前两个月买了一张120美元的演唱会门票。演出前一晚，她得了重感冒——喉咙痛、没力气，那种在人群里站三个小时都会觉得很惨的夜晚。她还是去了。“我已经付钱了，”她对自己说，“不去的话这笔钱就白花了。”\n\n这个推理的问题在于：这120美元无论如何都已经花掉了。钱在她买票的那一刻就离开了账户，比她生病早了好几个星期，而今晚她做出的任何决定都无法把它拿回来——不管去不去演唱会，什么都改变不了这一点。经济学家把这种情况称为沉没成本：已经花掉、无论接下来发生什么都无法收回的钱、时间或精力。一项无法被任何未来决定改变的成本，本来就不该被纳入那个决定的权衡之中。一旦普丽雅把这120美元从决定中拿掉——因为不管她今晚做什么，这笔钱都已经没了——真正需要比较的，是一个难受的外出夜晚，对上一个安静休息的夜晚。这样一比，答案很明显。而如果围绕着“别浪费门票”来想，答案就不明显了。\n\n这个陷阱会出现在任何已经花了钱、时间或精力、又无法挽回的地方：没人用却因为已经付过钱而不断续费的健身房会员卡，因为已经投入的钱而硬撑着做完、早就不再合理的房屋装修项目，因为对已经投入的岁月有种责任感、而不是因为对未来方向感兴趣而继续读下去的大学专业。每一个例子都在重复同样的模式——一笔无论接下来发生什么都已经固定的过去成本，牵动着一个本应只关乎'从现在起会发生什么'的决定。",
          "ja": "プリヤは2か月前に120ドルのコンサートチケットを買いました。公演前夜、彼女はひどい風邪をひきます——喉が痛く、気力もなく、三時間も人混みの中で立っているのが苦痛に思えるような夜です。それでも彼女は行きます。「もうお金を払ったんだから」と彼女は自分に言い聞かせます。「家にいたら、そのお金を無駄にすることになる」。\n\nこの考え方の問題はこうです。120ドルはどちらにしても、もう戻ってきません。そのお金は、彼女が風邪をひく何週間も前、チケットを買った瞬間に口座を離れており、今夜彼女がどんな決断をしても取り戻すことはできません——公演に行っても、家にいても、何も変わりません。経済学者はこれをサンクコスト（埋没費用）と呼びます。この先何が起ころうと取り戻すことのできない、すでに使ってしまったお金や時間、労力のことです。今後のどんな決断によっても変えられないコストは、その決断に影響を与えるべきではありません。プリヤが120ドルを決断から取り除いてみると——今夜何をしても、そのお金はどのみち戻ってこないのですから——実際に比べるべきなのは、つらい外出の夜と、ゆったりした家での夜のどちらかです。そう捉えれば、答えは明らかです。「チケットを無駄にしない」という捉え方をすると、そうではなくなります。\n\nこの罠は、お金や時間、労力がすでに使われ、取り消せない場所ならどこにでも現れます。誰も使っていないのに、すでに払った分がもったいなくて更新し続けるジムの会員権。もう意味をなさなくなった地点を過ぎても、すでに注ぎ込んだお金のせいで完成まで押し進められる自宅のリフォーム。この先どこにつながるかへの関心よりも、すでに費やした年月への義理から続けられる大学の専攻。どの場合も同じ形が繰り返されます——この先何が起ころうと変わらない過去のコストが、本来はこれから先のことだけで決めるべき判断を引っ張っているのです。"
        }
      },
      {
        "heading": {
          "en": "Why 'Cut Your Losses' Is Hard to Actually Do",
          "es": "Por Qué 'Cortar las Pérdidas' Es Difícil de Hacer en la Práctica",
          "ko": "'손절'이 실제로는 왜 이렇게 어려운가",
          "zh": "为什么“及时止损”说起来容易做起来难",
          "ja": "「損切り」が実際には難しい理由"
        },
        "body": {
          "en": "If sunk costs are irrelevant by definition, why do they change so many decisions? Partly it's loss aversion — research on decision-making finds that losing something feels roughly twice as painful as gaining the same amount feels good, so admitting a sunk cost is gone can feel like taking a second loss on top of the first one, even though no new money is actually lost by admitting it. Partly it's that walking away can feel like declaring the original decision a mistake, and continuing lets a person avoid that feeling a little longer. The more that was already spent, or the more public the original choice was, the stronger the pull tends to be — which is exactly backwards, since the amount already spent is the one number in the whole decision that should carry zero weight.\n\nThe same pattern isn't only personal — organizations fall into it too, sometimes called escalation of commitment: a project over budget and behind schedule keeps getting funded specifically because so much has already gone into it, even when a fresh look at the plan going forward wouldn't choose to start it today. A useful reset, for a person or a team, is to ask a specific question: \"If I were deciding this fresh today, knowing what I know now, and ignoring what's already been spent — would I choose this?\" If the honest answer is no, the amount already spent doesn't change that answer; it only makes the answer harder to hear. Sunk costs aren't a reason to always quit, either — sometimes the honest fresh look still says continue. The point isn't which answer is right; it's that money already spent shouldn't be what tips the scale either way.",
          "es": "Si los costos hundidos son irrelevantes por definición, ¿por qué cambian tantas decisiones? En parte es la aversión a la pérdida — la investigación sobre toma de decisiones encuentra que perder algo se siente aproximadamente el doble de doloroso de lo que ganar la misma cantidad se siente bien, así que admitir que un costo hundido ya se fue puede sentirse como sufrir una segunda pérdida encima de la primera, aunque admitirlo no haga perder ni un dólar más. En parte es que alejarse puede sentirse como declarar que la decisión original fue un error, y seguir adelante le permite a una persona evitar esa sensación un poco más. Cuanto más se gastó ya, o cuanto más pública fue la decisión original, más fuerte tiende a ser el tirón — lo cual es exactamente al revés, ya que la cantidad ya gastada es el único número de toda la decisión que debería pesar cero.\n\nEl mismo patrón no es solo personal — las organizaciones también caen en él, a veces llamado escalada del compromiso: un proyecto que va sobre presupuesto y atrasado sigue recibiendo fondos precisamente por todo lo que ya se invirtió en él, incluso cuando una mirada nueva al plan hacia adelante no elegiría empezarlo hoy. Un reinicio útil, para una persona o un equipo, es hacerse una pregunta específica: '¿Si estuviera decidiendo esto de cero hoy, sabiendo lo que sé ahora, e ignorando lo que ya se gastó — elegiría esto?'. Si la respuesta honesta es no, la cantidad ya gastada no cambia esa respuesta; solo hace que sea más difícil de escuchar. Los costos hundidos tampoco son una razón para siempre abandonar — a veces la mirada honesta y nueva sigue diciendo que hay que continuar. El punto no es cuál respuesta es la correcta; es que el dinero ya gastado no debería ser lo que incline la balanza en ningún sentido.",
          "ko": "매몰 비용이 정의상 무관하다면, 왜 그렇게 많은 결정을 바꿔놓을까요? 부분적으로는 손실 회피 때문입니다 — 의사결정 연구에 따르면 무언가를 잃는 고통은 같은 양을 얻는 기쁨보다 대략 두 배 더 크게 느껴집니다. 그래서 매몰 비용이 사라졌다는 것을 인정하는 일은, 새로 돈을 잃는 것이 아닌데도 첫 번째 손실 위에 두 번째 손실을 얹는 것처럼 느껴질 수 있습니다. 또 부분적으로는, 그만두는 것이 원래 결정이 잘못되었다고 스스로 인정하는 것처럼 느껴지고, 계속하면 그 감정을 조금 더 미룰 수 있기 때문입니다. 이미 쓴 돈이 많을수록, 원래 선택이 더 공개적이었을수록, 그 끌림은 대체로 더 강해지는 경향이 있습니다 — 이는 정반대여야 맞습니다. 이미 쓴 금액이야말로 이 결정 전체에서 무게가 전혀 없어야 할 유일한 숫자이기 때문입니다.\n\n이 패턴은 개인에게만 나타나는 것이 아닙니다 — 조직도 여기에 빠지며, 때로는 몰입 상승이라고 불립니다. 예산을 초과하고 일정보다 늦어진 프로젝트가 계속 자금을 받는 이유는, 바로 이미 그만큼 투입되었기 때문입니다. 앞으로의 계획을 새로 들여다본다면 오늘 다시 시작하지는 않을 텐데도 말입니다. 개인이든 팀이든 유용한 재설정 방법은 구체적인 질문을 던지는 것입니다. '지금 알고 있는 것을 바탕으로, 이미 쓴 것은 무시하고, 오늘 처음부터 결정한다면 — 이걸 선택할까?' 정직한 답이 '아니오'라면, 이미 쓴 금액은 그 답을 바꾸지 못합니다. 다만 그 답을 듣기 더 어렵게 만들 뿐입니다. 매몰 비용이 항상 그만둬야 한다는 이유도 아닙니다 — 때로는 정직하게 새로 봐도 여전히 계속하라는 답이 나옵니다. 핵심은 어느 쪽 답이 맞느냐가 아니라, 이미 쓴 돈이 어느 쪽으로도 저울을 기울여서는 안 된다는 것입니다.",
          "zh": "如果沉没成本按定义就是无关紧要的，为什么它还能左右这么多决定？部分原因是损失厌恶——关于决策的研究发现，失去某样东西带来的痛苦，大约是获得同样数量所带来的快乐的两倍，所以承认一笔沉没成本已经没了，感觉就像在第一笔损失之上又承受了第二笔损失，尽管承认这一点并不会真的再损失一分钱。部分原因是，放弃可能感觉像是在宣布最初的决定是个错误，而继续下去能让人再多躲避这种感觉一会儿。已经花掉的越多，或者最初的选择越是公开，这种拉力往往就越强——而这恰恰是反过来的：已经花掉的金额，本该是整个决定中唯一不该有任何分量的那个数字。\n\n这种模式不只发生在个人身上——组织也会陷进去，有时被称为承诺升级：一个超预算又拖延的项目之所以能不断获得资金，恰恰是因为已经投入了那么多，即便重新审视接下来的计划，今天根本不会选择启动它。对个人或团队来说，一个有用的重新出发的方法，是问自己一个具体的问题：“如果我是今天从零开始决定，基于现在知道的一切，并且忽略已经花掉的钱——我还会选择这个吗？”如果诚实的答案是不会，那么已经花掉的金额并不会改变这个答案，它只会让人更难听进去这个答案。沉没成本也不是永远该放弃的理由——有时候诚实地重新审视，答案依然是继续。重点不在于哪个答案才对，而在于已经花掉的钱不应该成为让天平往任何一边倾斜的理由。",
          "ja": "サンクコストが定義上、無関係なものだとしたら、なぜそれがこれほど多くの決断を左右するのでしょうか。一つには損失回避があります——意思決定に関する研究によれば、何かを失う痛みは、同じ量を得る喜びのおよそ二倍に感じられます。だからサンクコストがもう戻らないと認めることは、新たにお金を失うわけではないのに、最初の損失の上にもう一つ損失を重ねるように感じられてしまいます。もう一つには、手を引くことが最初の決断を間違いだったと認めることのように感じられ、続けることでその感覚を少し先延ばしにできるという理由があります。すでに使った額が多いほど、あるいは最初の選択が公になっていたほど、この引力は強くなる傾向があります——これはまさに逆です。すでに使った金額こそ、この決断全体の中で本来まったく重みを持つべきではない、唯一の数字だからです。\n\nこの傾向は個人だけのものではありません——組織も同じ罠に陥ります。エスカレーション・オブ・コミットメント（関与のエスカレーション）と呼ばれることもあります。予算を超過し、遅延しているプロジェクトが資金を受け続けるのは、まさにすでにそれだけ注ぎ込まれているからであり、この先の計画を改めて見直せば、今日それを始めることは選ばないはずです。個人にとってもチームにとっても役に立つリセットの方法は、具体的な問いを立てることです。「今知っていることを踏まえ、すでに使ったものは無視して、今日ゼロから決めるとしたら——これを選ぶだろうか？」正直な答えが「いいえ」であれば、すでに使った金額はその答えを変えません。ただ、その答えを受け入れにくくするだけです。サンクコストは、常にやめるべき理由でもありません——正直に見直しても、続けるという答えになることもあります。重要なのはどちらの答えが正しいかではなく、すでに使ったお金がどちらの方向にも天秤を傾けるべきではない、ということです。"
        }
      }
    ],
    "takeaway": {
      "en": "A sunk cost is money, time, or effort already spent that no future decision can get back — which means it should carry zero weight in that decision, even though it rarely feels that way. The question worth asking isn't \"what have I already put into this?\" but \"knowing what I know now, would I still choose this going forward?\"",
      "es": "Un costo hundido es dinero, tiempo o esfuerzo ya gastado que ninguna decisión futura puede recuperar — lo que significa que debería pesar cero en esa decisión, aunque casi nunca se sienta así. La pregunta que vale la pena hacerse no es '¿qué he invertido ya en esto?' sino '¿sabiendo lo que sé ahora, seguiría eligiendo esto de aquí en adelante?'.",
      "ko": "매몰 비용이란 앞으로 어떤 결정을 내리든 되찾을 수 없는, 이미 쓴 돈이나 시간, 노력을 말합니다 — 즉 그 결정에서 무게가 전혀 없어야 하지만, 실제로는 좀처럼 그렇게 느껴지지 않습니다. 물어볼 가치가 있는 질문은 '내가 여기에 이미 얼마나 쏟아부었나'가 아니라 '지금 아는 것을 바탕으로, 앞으로도 여전히 이것을 선택할 것인가'입니다.",
      "zh": "沉没成本是指已经花掉、无论未来做出什么决定都无法收回的钱、时间或精力——这意味着它在那个决定中本该没有任何分量，尽管几乎从来不会感觉如此。值得问的问题不是“我已经在这上面投入了多少”，而是“基于我现在知道的一切，我今后还会选择这个吗”。",
      "ja": "サンクコストとは、この先どんな決断をしても取り戻すことのできない、すでに使ってしまったお金や時間、労力のことです——つまりその決断において重みはゼロであるべきなのですが、実際にはそう感じられることはほとんどありません。問う価値があるのは「これまでどれだけ注ぎ込んだか」ではなく、「今知っていることを踏まえて、この先も同じ選択をするか」です。"
    },
    "thinkAbout": {
      "en": "Think of something you're continuing — a subscription, a project, a plan — partly because of what you've already put into it. Ask the fresh-look question: if you were deciding today with no history attached, would you still choose it? Notice whether the honest answer matches what you're actually doing.",
      "es": "Piensa en algo que sigues haciendo — una suscripción, un proyecto, un plan — en parte por lo que ya has invertido en ello. Hazte la pregunta de la mirada nueva: si estuvieras decidiendo hoy sin ese historial de por medio, ¿seguirías eligiéndolo? Fíjate si la respuesta honesta coincide con lo que realmente estás haciendo.",
      "ko": "구독, 프로젝트, 계획처럼 이미 쏟아부은 것 때문에 계속 이어가고 있는 무언가를 떠올려 보세요. 새로 보는 질문을 던져 보세요. 그동안의 이력 없이 오늘 처음 결정한다면 여전히 그것을 선택할까요? 정직한 답이 지금 실제로 하고 있는 것과 일치하는지 살펴보세요.",
      "zh": "想一想你正在继续做的某件事——一项订阅、一个项目、一个计划——部分原因是你已经在上面投入了很多。问问自己这个重新审视的问题：如果今天从零开始决定，不带着这段历史，你还会选择它吗？看看诚实的答案，是否和你实际在做的事情一致。",
      "ja": "サブスクリプションやプロジェクト、計画など、すでに注ぎ込んだものがあるからという理由で続けていることを一つ思い浮かべてください。改めて問うてみましょう——これまでの経緯なしに、今日ゼロから決めるとしたら、それでもそれを選びますか？正直な答えが、実際にあなたがしていることと一致しているかどうか確かめてみてください。"
    }
  },
  32: {
    "sections": [
      {
        "heading": {
          "en": "Why a Crowd Feels Like Evidence",
          "es": "Por Qué una Multitud Se Siente Como Evidencia",
          "ko": "왜 무리가 증거처럼 느껴지는가",
          "zh": "为什么人群感觉像是证据",
          "ja": "なぜ群衆が証拠のように感じられるのか"
        },
        "body": {
          "en": "Marcus keeps hearing about it at work: a coworker mentions an investment that's tripled in the last few months, then another, then a cousin at a family dinner. Marcus didn't buy when the price was a third of what it is now, and each new person who mentions it makes him feel a little more certain he's missing something everyone else already figured out. He buys in, not because he researched the underlying asset, but because so many people around him already had.\n\nThis is an informational cascade. It starts reasonably enough: watching what other people do is often a shortcut for information you don't have yourself — a restaurant with a line out the door is probably better than the empty one next door, and copying that judgment saves you from evaluating every menu yourself. But a market price is not a restaurant line. Once enough people have already bought an asset because other people bought it, its price has already moved to reflect that buying — and a rising price on its own does not mean the asset is a better value than it was before; it can just as easily mean the opposite, since the same future gains are now being paid for at a higher price. As a cascade builds, each new buyer is responding less to the original reason the asset started moving and more to the simple fact that a crowd has already formed. The crowd becomes its own evidence, disconnected from whether the reasoning that started it was ever sound — close to the mechanism Lesson 5 described from the lending side: confidence feeding on itself as people watch each other bid an asset's price higher.",
          "es": "Marcus sigue escuchando sobre esto en el trabajo: un compañero menciona una inversión que se triplicó en los últimos meses, luego otro, luego un primo en una cena familiar. Marcus no compró cuando el precio era un tercio de lo que es ahora, y cada nueva persona que lo menciona lo hace sentir un poco más seguro de que se está perdiendo algo que todos los demás ya descubrieron. Compra, no porque investigó el activo subyacente, sino porque tanta gente a su alrededor ya lo había hecho.\n\nEsto es una cascada informacional. Empieza de forma razonable: observar lo que hace otra gente suele ser un atajo para información que tú mismo no tienes — un restaurante con fila en la puerta probablemente sea mejor que el vacío de al lado, y copiar ese juicio te ahorra evaluar cada menú por ti mismo. Pero el precio de un mercado no es una fila de restaurante. Una vez que suficiente gente ya compró un activo porque otra gente lo compró, su precio ya se movió para reflejar esa compra — y un precio que sube por sí solo no significa que el activo sea mejor valor que antes; puede significar exactamente lo contrario, ya que las mismas ganancias futuras ahora se están pagando a un precio más alto. A medida que la cascada crece, cada nuevo comprador responde menos a la razón original por la que el activo empezó a moverse y más al simple hecho de que ya se formó una multitud. La multitud se convierte en su propia evidencia, desconectada de si el razonamiento que la inició alguna vez fue sólido — algo cercano al mecanismo que describió la Lección 5 desde el lado de los préstamos: la confianza alimentándose a sí misma mientras la gente se observa mutuamente pujar el precio de un activo hacia arriba.",
          "ko": "마커스는 직장에서 계속 그 이야기를 듣습니다. 동료 한 명이 최근 몇 달 사이 세 배로 오른 어떤 투자 상품을 언급하고, 또 다른 동료가, 그다음엔 가족 저녁 식사 자리에서 사촌이 언급합니다. 마커스는 가격이 지금의 3분의 1이었을 때 사지 않았고, 그것을 언급하는 사람이 늘어날 때마다 자신이 다른 모두가 이미 알아챈 무언가를 놓치고 있다는 확신이 조금씩 더 강해집니다. 그는 결국 삽니다 — 기초 자산을 조사해서가 아니라, 주변의 그토록 많은 사람이 이미 그렇게 했기 때문에.\n\n이것은 정보 폭포 현상입니다. 시작은 꽤 합리적입니다. 다른 사람들이 하는 행동을 지켜보는 것은 종종 자신에게 없는 정보를 대신하는 지름길입니다 — 문 앞에 줄이 늘어선 식당은 옆의 텅 빈 식당보다 대체로 낫고, 그 판단을 따라 하면 메뉴 하나하나를 직접 평가하는 수고를 덜 수 있습니다. 하지만 시장 가격은 식당 줄이 아닙니다. 이미 많은 사람이 다른 사람들이 샀다는 이유만으로 어떤 자산을 사고 나면, 그 가격은 이미 그 매수를 반영해 움직인 상태입니다 — 그리고 가격이 오른다는 사실 자체는 그 자산이 예전보다 더 좋은 가치라는 뜻이 아닙니다. 오히려 정반대일 수도 있습니다. 같은 미래 수익에 대해 지금은 더 높은 가격을 치르고 있는 것이기 때문입니다. 정보 폭포가 커질수록, 새로 들어오는 매수자는 자산이 처음 움직이기 시작한 원래 이유보다는 이미 무리가 형성되었다는 단순한 사실에 더 반응하게 됩니다. 무리는 그 자체로 증거가 되어버리고, 그것을 시작한 논리가 애초에 타당했는지와는 무관해집니다 — 이것은 5강이 대출 쪽에서 설명한 메커니즘과 비슷합니다. 사람들이 서로가 자산 가격을 더 높이 부르는 것을 지켜보면서 자신감이 스스로를 먹이로 삼아 부풀어 오르는 것입니다.",
          "zh": "马库斯在公司一直听到这件事：一个同事提到某项投资在过去几个月里涨了三倍，然后是另一个同事，接着是家庭聚餐上的一个表亲。马库斯没有在价格只有现在三分之一的时候买入，而每一个提起这件事的人，都让他更加确信自己错过了别人早已发现的东西。他最终买了——不是因为他研究了这项资产本身，而是因为身边太多人已经买了。\n\n这是一种信息瀑布。它一开始相当合理：观察别人的行为，往往是替代你自己没有的信息的一条捷径——门口排着长队的餐厅大概率比隔壁空荡荡的那家更好，照着这个判断走能省下自己评估每一份菜单的功夫。但市场价格不是餐厅门口的队伍。一旦足够多的人仅仅因为别人买了而买入某项资产，它的价格就已经因这些购买而变动过了——价格上涨这件事本身，并不意味着这项资产比之前更划算；恰恰相反的情况同样可能发生，因为同样的未来收益，现在要用更高的价格去买。随着这种瀑布不断壮大，每一个新买家的反应，会越来越少地基于这项资产最初开始上涨的原因，而越来越多地基于人群已经形成这一简单事实。人群变成了它自己的证据，与最初推动它的那套逻辑是否站得住脚彻底脱节——这与第5课从借贷一方描述的机制颇为相似：人们看着彼此不断把资产价格越抬越高，信心便靠自身不断膨胀。",
          "ja": "マーカスは職場でその話をずっと耳にしています。同僚の一人が、ここ数か月で3倍になった投資の話をし、次は別の同僚、そして家族の夕食の席ではいとこが話します。マーカスは価格が今の3分の1だったときには買いませんでした。そして話す人が増えるたびに、他のみんなはすでに気づいている何かを自分だけが逃しているという確信が、少しずつ強まっていきます。彼は結局買います——その資産そのものを調べたからではなく、周りのあまりに多くの人がすでにそうしていたからです。\n\nこれは情報カスケードです。始まりはかなり合理的です。他の人がすることを見るのは、自分が持っていない情報の代わりになる近道であることが多いものです——店の外まで行列ができているレストランは、おそらく隣の空いている店より良く、その判断をまねすることで、自分でメニューを一つ一つ評価する手間が省けます。しかし市場価格は、レストランの行列ではありません。すでに十分な数の人が、他の人が買ったからという理由だけである資産を買うと、その価格はすでにその買いを反映して動いてしまっています——そして価格が上がっているという事実そのものは、その資産が以前より良い価値であることを意味しません。むしろ正反対のこともあり得ます。同じ将来の利益に対して、今はより高い価格を払っていることになるからです。カスケードが大きくなるにつれ、新しく参加する買い手は、その資産が最初に動き始めた本来の理由よりも、すでに群衆ができあがっているという単純な事実に反応するようになっていきます。群衆はそれ自体が証拠となり、それを始めた論理がそもそも妥当だったかどうかとは切り離されてしまいます——これは第5講が貸し手側から説明した仕組みに近いものです。人々が互いに資産の価格をより高く吊り上げていく様子を見ながら、自信がそれ自体を糧にして膨らんでいくのです。"
        }
      },
      {
        "heading": {
          "en": "FOMO Pulls You In; the Same Instinct Pushes You Out",
          "es": "El FOMO Te Empuja a Entrar; El Mismo Instinto Te Empuja a Salir",
          "ko": "FOMO는 안으로 끌어당기고, 같은 본능이 밖으로 밀어낸다",
          "zh": "FOMO把你拉进去，同一种本能又把你推出来",
          "ja": "FOMOは人を引き込み、同じ本能が人を押し出す"
        },
        "body": {
          "en": "The feeling that pulls Marcus in has a name: FOMO, the fear of missing out. It's especially sharp with a rising price because the cost of missing out feels concrete and countable — \"I could have made $X\" — while the risk of buying late stays invisible until after the fact. That asymmetry pushes people toward action long before any new analysis has actually happened; the trigger isn't new information about the asset, it's watching other people already holding it.\n\nThe same instinct runs in reverse. When a crowd starts selling, watching it happen creates its own pressure to sell too — not because anything about the asset's underlying value necessarily changed, but out of fear of being the one left holding it while everyone else gets out. Herd behavior isn't a force that only pushes prices up; it's the same psychological gear engaging in both directions, which is part of why sharp rises and sharp falls in a crowded asset often happen close together in time.\n\nNone of this means a crowd is always wrong — sometimes widespread buying does reflect real, shared information. The problem is that crowd size and enthusiasm are not themselves that information; they're just evidence that a lot of people are doing the same thing, for reasons that may or may not still apply to a new buyer. A useful separation to make before acting is the same kind of question Lesson 31 asked about a sunk cost: if you had never seen anyone else buying or selling this, based only on what you actually know, would you make the same choice? If the honest answer depends entirely on how many other people are already in, that's the feeling worth noticing — not because it means you're wrong, but because it means the crowd, not your own reasoning, is doing the deciding.",
          "es": "El sentimiento que atrae a Marcus tiene un nombre: FOMO, el miedo a quedarse fuera (por sus siglas en inglés). Es especialmente agudo con un precio que sube porque el costo de quedarse fuera se siente concreto y contable — 'podría haber ganado $X' — mientras que el riesgo de comprar tarde permanece invisible hasta después de los hechos. Esa asimetría empuja a la gente hacia la acción mucho antes de que en realidad haya ocurrido algún análisis nuevo; el gatillo no es información nueva sobre el activo, es ver a otra gente que ya lo tiene.\n\nEl mismo instinto funciona al revés. Cuando una multitud empieza a vender, verlo ocurrir crea su propia presión para vender también — no porque algo sobre el valor subyacente del activo necesariamente haya cambiado, sino por miedo a ser quien se quede con él mientras todos los demás salen. El comportamiento de manada no es una fuerza que solo empuja los precios hacia arriba; es el mismo engranaje psicológico funcionando en ambas direcciones, lo cual es parte de por qué las subidas y caídas bruscas en un activo concurrido suelen ocurrir cerca en el tiempo.\n\nNada de esto significa que una multitud siempre esté equivocada — a veces la compra generalizada sí refleja información real y compartida. El problema es que el tamaño y el entusiasmo de la multitud no son en sí mismos esa información; solo son evidencia de que mucha gente está haciendo lo mismo, por razones que pueden o no seguir aplicando a un nuevo comprador. Una separación útil de hacer antes de actuar es el mismo tipo de pregunta que la Lección 31 hizo sobre un costo hundido: si nunca hubieras visto a nadie más comprando o vendiendo esto, basándote solo en lo que realmente sabes, ¿tomarías la misma decisión? Si la respuesta honesta depende por completo de cuánta otra gente ya está adentro, eso es lo que vale la pena notar — no porque signifique que estás equivocado, sino porque significa que la multitud, no tu propio razonamiento, es quien está decidiendo.",
          "ko": "마커스를 끌어당긴 그 감정에는 이름이 있습니다. FOMO, 즉 놓칠까 봐 두려운 마음입니다. 가격이 오를 때 특히 날카롭게 느껴지는 이유는, 놓친 비용은 구체적이고 셀 수 있게 느껴지기 때문입니다 — '내가 X달러를 벌 수 있었는데' — 반면 늦게 사는 위험은 일이 벌어진 뒤에야 눈에 보입니다. 이 비대칭성은 실제로는 아무런 새로운 분석도 이루어지지 않은 상태에서 사람들을 행동으로 떠밉니다. 방아쇠는 그 자산에 대한 새로운 정보가 아니라, 다른 사람들이 이미 그것을 들고 있는 모습을 지켜보는 것입니다.\n\n같은 본능이 거꾸로도 작동합니다. 무리가 팔기 시작하면, 그것을 지켜보는 것만으로도 팔아야 한다는 압박이 생깁니다 — 자산의 근본 가치에 실제로 어떤 변화가 있어서가 아니라, 모두가 빠져나가는 동안 자신만 그것을 들고 남을까 봐 두려워서입니다. 무리 행동은 가격을 오직 위로만 미는 힘이 아닙니다. 양방향으로 작동하는 같은 심리적 기어이며, 이것이 붐비는 자산에서 급등과 급락이 시간적으로 가까이 붙어 일어나는 이유의 일부입니다.\n\n이 모든 것이 무리가 항상 틀렸다는 뜻은 아닙니다 — 때로는 광범위한 매수가 실제로 공유된 정보를 반영하기도 합니다. 문제는 무리의 규모와 열기 그 자체가 그 정보는 아니라는 점입니다. 그것은 그저 많은 사람이 같은 일을 하고 있다는 증거일 뿐이며, 그 이유가 새로운 매수자에게도 여전히 적용되는지는 별개입니다. 행동하기 전에 해볼 만한 유용한 구분은 31강이 매몰 비용에 대해 던진 것과 같은 종류의 질문입니다. 다른 사람이 이것을 사거나 파는 것을 한 번도 본 적이 없다고 가정하고, 오직 자신이 실제로 아는 것만을 바탕으로 한다면, 같은 선택을 할까요? 정직한 답이 전적으로 이미 얼마나 많은 사람이 들어와 있는지에 달려 있다면, 그것이 바로 눈여겨봐야 할 감정입니다 — 그것이 당신이 틀렸다는 뜻이어서가 아니라, 당신 자신의 판단이 아니라 무리가 결정을 내리고 있다는 뜻이기 때문입니다.",
          "zh": "把马库斯吸引进去的那种感觉，有一个名字：FOMO，即害怕错过。它在价格上涨时尤其尖锐，因为错过的代价感觉具体又可以计算——“我本来可以赚到X美元”——而买晚了的风险要等到事后才看得见。这种不对称，会在还没有真正进行任何新的分析之前，就把人推向行动；触发它的不是关于这项资产的新信息，而是看到别人已经持有它。\n\n同样的本能也会反向运作。当人群开始抛售时，眼看着这一幕本身就会带来抛售的压力——不是因为这项资产的内在价值真的发生了什么变化，而是害怕在所有人都离场时，自己成了那个还捏在手里的人。羊群效应并不是只把价格往上推的力量；它是同一套心理齿轮在两个方向上运转，这也是为什么一项拥挤的资产，急涨和急跌常常在时间上靠得很近。\n\n这一切并不意味着人群永远是错的——有时候广泛的买入确实反映了真实的、共享的信息。问题在于，人群的规模和热情本身并不是那个信息；它们只是证明有很多人在做同一件事，而这些理由是否依然适用于一个新买家，是另一回事。在行动之前，有一个有用的区分方法，和第31课针对沉没成本提出的那种问题类似：如果你从未见过任何人买入或卖出它，仅凭你实际知道的东西，你还会做出同样的选择吗？如果诚实的答案完全取决于已经有多少人入场，那正是值得留意的感觉——不是因为这意味着你错了，而是因为这意味着，做决定的是人群，而不是你自己的判断。",
          "ja": "マーカスを引き込んだその感情には名前があります。FOMO、取り残される恐怖です。価格が上がっているときに特に鋭く感じられるのは、逃した代償が具体的で数えられるものに感じられるからです——「Xドル儲けられたはずなのに」——一方で、遅く買うリスクは事が起きるまで目に見えません。この非対称性は、実際にはまだ何の新しい分析も行われていないうちから、人を行動へと駆り立てます。引き金になっているのは、その資産についての新しい情報ではなく、他の人がすでにそれを持っている姿を見ることです。\n\n同じ本能は逆方向にも働きます。群衆が売り始めると、それを見ていること自体が、自分も売らなければという圧力を生みます——その資産の本来の価値に実際に何か変化があったからではなく、みんなが抜け出す中で自分だけがそれを抱えたまま取り残されることを恐れてです。群衆行動は価格を上げる方向にだけ働く力ではありません。両方向に働く同じ心理的な歯車であり、これが、混み合った資産で急騰と急落が時間的に近接して起こりやすい理由の一部です。\n\nこれは群衆が常に間違っているという意味ではありません——広範な買いが本当に共有された情報を反映していることもあります。問題は、群衆の規模や熱狂それ自体はその情報ではないということです。それは単に、多くの人が同じことをしているという証拠にすぎず、その理由が新しい買い手にも今なお当てはまるかどうかは別問題です。行動する前にしておくと役立つ区別は、第31講がサンクコストについて投げかけたのと同じ種類の問いです。もし他の誰かがこれを買ったり売ったりするのを一度も見たことがなく、自分が実際に知っていることだけを根拠にするとしたら、それでも同じ選択をするでしょうか。正直な答えが、すでにどれだけの人が参加しているかに完全に左右されるなら、それこそ注目すべき感覚です——それがあなたが間違っているという意味だからではなく、あなた自身の判断ではなく群衆が決めているという意味だからです。"
        }
      }
    ],
    "takeaway": {
      "en": "FOMO is the fear of missing a gain other people already seem to be getting; herd behavior is following the crowd's action instead of your own reasoning to relieve that fear. A rising price and a crowd of buyers are evidence that other people are buying — not evidence that something is a good value. The question worth asking is whether you would still make the same choice if you had never seen anyone else make it first.",
      "es": "El FOMO es el miedo a perderte una ganancia que otra gente ya parece estar obteniendo; el comportamiento de manada es seguir la acción de la multitud en vez de tu propio razonamiento para aliviar ese miedo. Un precio que sube y una multitud de compradores son evidencia de que otra gente está comprando — no evidencia de que algo sea una buena inversión. La pregunta que vale la pena hacerse es si aún tomarías la misma decisión si nunca hubieras visto a nadie más tomarla primero.",
      "ko": "FOMO는 다른 사람들이 이미 얻고 있는 것처럼 보이는 이익을 놓칠까 봐 두려운 마음이고, 무리 행동은 그 두려움을 덜기 위해 자신의 판단 대신 무리의 행동을 따르는 것입니다. 오르는 가격과 매수자 무리는 다른 사람들이 사고 있다는 증거일 뿐, 그것이 좋은 가치라는 증거는 아닙니다. 물어볼 가치가 있는 질문은, 다른 누군가가 먼저 그렇게 하는 것을 한 번도 보지 못했더라도 여전히 같은 선택을 할 것인가입니다.",
      "zh": "FOMO是害怕错过别人似乎已经获得的收益；羊群效应则是为了缓解这种恐惧，跟随人群的行动而不是自己的判断。上涨的价格和一群买家，只能证明其他人在买——并不能证明这是一笔好的价值投资。值得问自己的问题是：如果你从未见过任何人先这样做，你是否仍然会做出同样的选择。",
      "ja": "FOMOとは、他の人がすでに得ているように見える利益を逃す恐怖であり、群衆行動とは、その恐怖を和らげるために自分自身の判断ではなく群衆の行動に従うことです。上がっている価格と買い手の群衆は、他の人が買っているという証拠にすぎず、それが良い価値であるという証拠ではありません。問う価値がある問いは、他の誰かが先にそうするのを一度も見たことがなくても、それでも同じ選択をするかどうかです。"
    },
    "thinkAbout": {
      "en": "Think of a time you wanted to buy, sell, or join something largely because it felt like everyone else already had. Separate the two questions involved: what do you actually know about it, and how many other people are doing it? Notice how much of your reasoning leaned on the second question instead of the first.",
      "es": "Piensa en un momento en que quisiste comprar, vender o sumarte a algo en gran parte porque sentías que todos los demás ya lo habían hecho. Separa las dos preguntas involucradas: ¿qué sabes realmente sobre eso?, y ¿cuánta otra gente lo está haciendo? Fíjate cuánto de tu razonamiento se apoyó en la segunda pregunta en vez de en la primera.",
      "ko": "이미 모두가 하고 있는 것처럼 느껴진다는 이유로 무언가를 사거나 팔거나 함께하고 싶었던 순간을 떠올려 보세요. 여기에 얽힌 두 가지 질문을 분리해 보세요. 그것에 대해 실제로 무엇을 알고 있는가, 그리고 얼마나 많은 다른 사람이 그렇게 하고 있는가. 자신의 판단이 첫 번째 질문보다 두 번째 질문에 얼마나 기대고 있었는지 살펴보세요.",
      "zh": "想一想有没有这样的时刻：你想买入、卖出或加入某件事，很大程度上是因为感觉好像所有人都已经这么做了。把其中涉及的两个问题分开来看：你对这件事实际知道什么，以及有多少其他人正在这么做。看看你的判断有多少依赖的是第二个问题，而不是第一个。",
      "ja": "みんながすでにそうしているように感じられるという理由で、何かを買ったり、売ったり、参加したりしたいと思った瞬間を思い浮かべてください。そこに含まれる2つの問いを分けてみましょう——それについて実際に何を知っているか、そして他に何人がそれをしているか。自分の判断がどれだけ、1つ目の問いよりも2つ目の問いに寄りかかっていたかに注目してください。"
    }
  },
  33: {
    "sections": [
      {
        "heading": {
          "en": "The Number That Sets the Frame",
          "es": "El Número Que Define el Marco",
          "ko": "기준을 정하는 숫자",
          "zh": "设定基准的数字",
          "ja": "枠組みを決める数字"
        },
        "body": {
          "en": "Priya is shopping for a jacket. The tag reads: $220, now $89. She buys it, feeling like she got a real deal — $89 for something originally priced at $220 seems like an obvious win. She never stops to ask what the jacket would be worth to her if she'd walked in and seen only one number: $89, with no $220 crossed out above it.\n\nThis is anchoring: once a number enters your head, it becomes the reference point that later judgments get measured against, even when the number itself carries no real information. The $220 on Priya's tag might reflect what the jacket actually used to sell for — or it might be a price almost nobody ever paid, printed mainly to make $89 look small by comparison. Either way, the effect on Priya's judgment is the same: $89 now feels cheap, not because she compared it to what similar jackets cost elsewhere, but because she compared it to a number the store chose to put next to it.",
          "es": "Priya está comprando una chaqueta. La etiqueta dice: $220, ahora $89. La compra sintiendo que consiguió una verdadera ganga — $89 por algo que originalmente costaba $220 parece una victoria obvia. Nunca se detiene a preguntarse cuánto valdría la chaqueta para ella si hubiera entrado y visto solo un número: $89, sin el $220 tachado arriba.\n\nEsto es el anclaje: una vez que un número entra en tu cabeza, se convierte en el punto de referencia con el que se miden los juicios posteriores, incluso cuando ese número no lleva ninguna información real. El $220 de la etiqueta de Priya podría reflejar lo que la chaqueta realmente costaba antes — o podría ser un precio que casi nadie pagó jamás, impreso principalmente para hacer que el $89 parezca pequeño en comparación. De cualquier forma, el efecto en el juicio de Priya es el mismo: ahora el $89 se siente barato, no porque lo haya comparado con lo que cuestan chaquetas similares en otro lugar, sino porque lo comparó con un número que la tienda eligió poner al lado.",
          "ko": "프리야는 재킷을 사러 갔습니다. 가격표에는 이렇게 적혀 있습니다: $220, 지금은 $89. 그녀는 진짜 좋은 거래를 했다고 느끼며 삽니다 — 원래 $220이었던 것을 $89에 사는 건 명백한 이득처럼 보입니다. 그녀는 만약 매장에 들어가서 지워진 $220 없이 오직 $89라는 숫자 하나만 봤다면 그 재킷이 자신에게 얼마의 가치였을지 한 번도 물어보지 않습니다.\n\n이것이 바로 앵커링(기준점 편향)입니다. 어떤 숫자가 일단 머릿속에 들어오면, 그 숫자 자체가 아무런 실제 정보를 담고 있지 않더라도 이후의 판단을 재는 기준점이 됩니다. 프리야의 가격표에 적힌 $220은 실제로 그 재킷이 예전에 팔리던 가격을 반영한 것일 수도 있고, 혹은 거의 아무도 낸 적 없는 가격이지만 $89를 상대적으로 작아 보이게 하려고 주로 인쇄된 숫자일 수도 있습니다. 어느 쪽이든 프리야의 판단에 미치는 효과는 같습니다 — 이제 $89는 싸게 느껴집니다. 다른 곳에서 비슷한 재킷이 얼마인지 비교해서가 아니라, 매장이 옆에 붙이기로 선택한 숫자와 비교했기 때문입니다.",
          "zh": "普里娅在买一件夹克。标签上写着：原价220美元，现价89美元。她买下了，觉得自己捡了大便宜——原价220美元的东西现在只要89美元，看起来明摆着划算。她从没停下来想过，如果她走进店里只看到一个数字——89美元，上面没有被划掉的220美元——这件夹克对她来说值多少钱。\n\n这就是锚定效应：一旦一个数字进入你的脑海，它就会成为之后判断所依据的参照点，即使这个数字本身并不包含任何真实信息。普里娅标签上的220美元，可能确实是这件夹克以前的实际售价，也可能几乎没有人真正付过这个价，印上去主要是为了让89美元相比之下显得便宜。无论哪种情况，对普里娅判断的影响都是一样的：现在89美元感觉很便宜，不是因为她把它和别处类似夹克的价格做了比较，而是因为她把它和商店选择贴在旁边的那个数字做了比较。",
          "ja": "プリヤはジャケットを買おうとしています。値札にはこう書かれています：220ドル、今なら89ドル。彼女は本当にお得だと感じて買います——元々220ドルだったものが89ドルというのは、明らかな得のように見えます。彼女は一度も立ち止まって考えません。もし店に入って、線を引かれた220ドルなしに89ドルという数字だけを見ていたら、そのジャケットに自分はいくらの価値を感じただろうか、と。\n\nこれがアンカリングです。ある数字がいったん頭に入ると、その数字自体が実際には何の情報も持っていなくても、それ以降の判断を測る基準点になります。プリヤの値札にある220ドルは、実際にそのジャケットが以前売られていた価格を反映しているかもしれませんし、あるいは、ほとんど誰も払ったことのない価格で、主に89ドルを相対的に小さく見せるために印刷されたものかもしれません。どちらであっても、プリヤの判断への影響は同じです——今、89ドルは安く感じられます。他の場所で似たジャケットがいくらするかと比較したからではなく、店が隣に置くことを選んだ数字と比較したからです。"
        }
      },
      {
        "heading": {
          "en": "Anchors Are Often Someone Else's Tool",
          "es": "Las Anclas Suelen Ser Herramienta de Otra Persona",
          "ko": "닻은 흔히 다른 사람의 도구입니다",
          "zh": "锚点常常是别人的工具",
          "ja": "アンカーはしばしば他人の道具"
        },
        "body": {
          "en": "Anchors show up anywhere a number gets named first. A home listed at $450,000 shapes every offer that follows, even from buyers who never independently priced the neighborhood — offers cluster near the anchor instead of near the home's actual worth. In a salary negotiation, whoever names a figure first pulls the eventual number toward theirs, which is exactly why the advice 'let the other side name a number first' shows up so often in negotiation guides: the anchor is a tool, and tools work better in the hand that placed them.\n\nNone of this means every listed price or first offer is dishonest — sometimes $220 was the real prior price, and a first salary offer can be a fair one. The problem is that an anchor's size tells you almost nothing about whether it's fair; it only tells you what number someone else, often with their own interest in the outcome, decided to put in front of you first. The same reframing question earlier lessons in this track have used works here too: what would this be worth to me if this were the only number I'd ever seen attached to it — no crossed-out price, no opening offer, no first figure setting the frame? Judging a number against independent information you actually gathered — what comparable items cost, what your own budget or research says — is different from judging it against whatever was placed next to it.",
          "es": "Las anclas aparecen en cualquier lugar donde se nombre un número primero. Una casa listada en $450,000 define cada oferta que sigue, incluso de compradores que nunca calcularon el precio del vecindario por su cuenta — las ofertas se agrupan cerca del ancla en vez de cerca del valor real de la casa. En una negociación salarial, quien nombra una cifra primero atrae el número final hacia la suya, que es exactamente por qué el consejo 'deja que la otra parte diga un número primero' aparece tan seguido en las guías de negociación: el ancla es una herramienta, y las herramientas funcionan mejor en la mano de quien las colocó.\n\nNada de esto significa que cada precio listado o primera oferta sea deshonesta — a veces $220 fue el precio real anterior, y una primera oferta salarial puede ser justa. El problema es que el tamaño de un ancla casi no te dice nada sobre si es justa; solo te dice qué número decidió alguien más — a menudo con su propio interés en el resultado — poner frente a ti primero. La misma pregunta de replanteo que lecciones anteriores de esta serie han usado también funciona aquí: ¿cuánto valdría esto para mí si este fuera el único número que alguna vez hubiera visto asociado a ello — sin precio tachado, sin oferta inicial, sin una primera cifra definiendo el marco? Juzgar un número contra información independiente que tú mismo reuniste — lo que cuestan artículos comparables, lo que dice tu propio presupuesto o investigación — es distinto de juzgarlo contra lo que pusieron a su lado.",
          "ko": "닻은 어떤 숫자든 먼저 언급되는 곳이면 어디에나 나타납니다. $450,000에 매물로 나온 집은 그 동네 시세를 스스로 조사해본 적 없는 구매자들에게서조차, 이후에 이어지는 모든 제안의 기준이 됩니다 — 제안들은 집의 실제 가치가 아니라 그 닻 근처에 몰립니다. 연봉 협상에서는 먼저 숫자를 말하는 사람이 최종 숫자를 자신 쪽으로 끌어당깁니다. '상대방이 먼저 숫자를 말하게 하라'는 조언이 협상 안내서에 그토록 자주 등장하는 이유가 바로 이것입니다. 닻은 도구이고, 도구는 그것을 놓은 사람의 손에서 더 잘 작동합니다.\n\n그렇다고 모든 정가나 첫 제안이 다 정직하지 않다는 뜻은 아닙니다 — 때로는 $220이 실제 이전 가격이었을 수도 있고, 첫 연봉 제안이 공정할 수도 있습니다. 문제는 닻의 크기가 그것이 공정한지에 대해 거의 아무것도 말해주지 않는다는 점입니다. 그것은 그저 다른 누군가가 — 흔히 결과에 자신의 이해관계를 가진 채로 — 당신 앞에 먼저 어떤 숫자를 놓기로 결정했는지를 말해줄 뿐입니다. 이 트랙의 이전 강의들이 사용한 것과 같은 재구성 질문이 여기서도 통합니다. 만약 지워진 가격도, 시작 제안도, 기준을 정하는 첫 숫자도 없이 이것에 붙은 숫자를 오직 하나만 봤다면, 나에게 이것은 얼마의 가치일까? 자신이 직접 모은 독립적인 정보 — 비슷한 물건들의 가격, 자신의 예산이나 조사 결과 — 를 기준으로 숫자를 판단하는 것은, 옆에 붙어 있던 것을 기준으로 판단하는 것과는 다릅니다.",
          "zh": "只要有一个数字被率先说出来，锚点就会出现。一套挂牌价45万美元的房子，会左右之后所有的报价，哪怕这些买家从未独立核实过这个街区的实际行情——报价会聚集在锚点附近，而不是聚集在房子的真实价值附近。在薪资谈判中，谁先报出一个数字，最终的数字就会被拉向谁那一边，这正是为什么“让对方先报数字”这条建议在谈判指南里如此常见：锚点是一种工具，而工具在放置它的人手中效果更好。\n\n这并不意味着每一个标价或第一次报价都不诚实——有时220美元确实是真实的原价，第一次薪资报价也可能是公平的。问题在于，锚点的大小几乎不能告诉你它是否公平；它只能告诉你，别人——往往在结果上有自己的利益——决定先在你面前放上哪个数字。这个赛道之前几课用过的那种重新框定的问题，在这里同样适用：如果这是我唯一见过与之关联的数字——没有被划掉的价格，没有起始报价，没有先设定基准的第一个数字——这东西对我来说值多少钱？用你自己收集的独立信息——同类物品的价格、你自己的预算或调研结果——去判断一个数字，和用别人摆在它旁边的东西去判断，是两回事。",
          "ja": "アンカーは、数字が最初に示される場所ならどこにでも現れます。45万ドルで売り出された家は、その地域の相場を自分で調べたことのない買い手からでさえ、その後に続くすべての提示価格を左右します——提示価格は家の実際の価値の近くではなく、アンカーの近くに集まります。給与交渉では、最初に数字を口にした側に最終的な数字が引き寄せられます。「相手に先に数字を言わせろ」というアドバイスが交渉指南書にあれほど頻繁に登場するのは、まさにこのためです。アンカーは道具であり、道具はそれを置いた側の手の中でよりうまく機能します。\n\nだからといって、すべての表示価格や最初の提示が不誠実だというわけではありません——220ドルが本当に以前の価格だったこともありますし、最初の給与提示が公正なこともあります。問題は、アンカーの大きさがそれが公正かどうかについてほとんど何も教えてくれないということです。それはただ、他の誰かが——しばしば結果に自分自身の利害を持ちながら——最初にあなたの前にどの数字を置くことに決めたかを教えてくれるだけです。このトラックの以前の講で使われたのと同じ、視点を変える問いがここでも役立ちます。もし線を引かれた価格も、最初の提示も、枠組みを決める最初の数字もなく、これに結びついた数字を一つだけ見たとしたら、これは自分にとっていくらの価値があるだろうか？ 自分自身で集めた独立した情報——同等の品物の値段、自分の予算や調査結果——を基準に数字を判断することは、隣に置かれていたものを基準に判断することとは違います。"
        }
      }
    ],
    "takeaway": {
      "en": "Anchoring is when an early number — even an arbitrary or self-interested one — becomes the reference point your later judgment gets measured against, making that number feel more 'normal' than it actually is. The number itself carries no information about value; treat it as a starting offer, not a fact, and check it against independent information.",
      "es": "El anclaje ocurre cuando un número temprano — incluso uno arbitrario o interesado — se convierte en el punto de referencia con el que se mide tu juicio posterior, haciendo que ese número se sienta más 'normal' de lo que realmente es. El número en sí no lleva información sobre el valor; trátalo como una oferta inicial, no como un hecho, y compáralo con información independiente.",
      "ko": "앵커링은 이른 시점에 나온 숫자 — 임의적이거나 상대방에게 유리한 숫자일지라도 — 가 이후 판단의 기준점이 되어, 그 숫자를 실제보다 더 '정상적으로' 느끼게 만드는 현상입니다. 그 숫자 자체는 가치에 대한 정보를 담고 있지 않습니다. 그것을 사실이 아니라 시작 제안으로 취급하고, 독립적인 정보와 비교해 보세요.",
      "zh": "锚定效应是指一个较早出现的数字——即使是任意设定的，或是对方出于自身利益设定的——成为你之后判断所依据的参照点，让这个数字显得比它实际上更“正常”。这个数字本身并不包含关于价值的信息；把它当作一个起始报价，而不是事实，并用独立信息去核对它。",
      "ja": "アンカリングとは、たとえ恣意的であったり相手に都合の良いものであったりしても、早い段階で示された数字が、それ以降の判断を測る基準点となり、その数字を実際以上に「普通」に感じさせてしまうことです。その数字自体は価値についての情報を何も持っていません。それを事実としてではなく最初の提示として扱い、独立した情報と照らし合わせましょう。"
    },
    "thinkAbout": {
      "en": "Recall a 'was/now' price, a listing price, or a first offer that shaped what felt fair to you. What would you have judged it to be worth if you'd never seen that number at all?",
      "es": "Piensa en un precio 'antes/ahora', un precio de lista, o una primera oferta que haya definido lo que te pareció justo. ¿Cuánto habrías juzgado que valía si nunca hubieras visto ese número en absoluto?",
      "ko": "'이전/현재' 가격, 매물 시세, 혹은 첫 제안이 무엇이 공정하다고 느껴지는지를 정했던 순간을 떠올려 보세요. 그 숫자를 전혀 본 적이 없었다면 그것의 가치를 얼마로 판단했을까요?",
      "zh": "回想一次“原价/现价”的标示、一个挂牌价，或一次首次报价，曾经左右了你觉得什么是公平的。如果你从未见过那个数字，你会判断它值多少钱？",
      "ja": "「以前/今」の価格表示、売り出し価格、あるいは最初の提示が、何が公正に感じられるかを決めてしまった瞬間を思い出してください。もしその数字を一度も見ていなかったら、それにいくらの価値があると判断していたでしょうか。"
    }
  },
  34: {
    "sections": [
      {
        "heading": {
          "en": "The Search That Already Knows What It Wants to Find",
          "es": "La Búsqueda Que Ya Sabe Qué Quiere Encontrar",
          "ko": "이미 무엇을 찾고 싶은지 알고 있는 검색",
          "zh": "早已知道自己想找到什么的搜索",
          "ja": "何を見つけたいか、すでに分かっている検索"
        },
        "body": {
          "en": "Tomás puts money into a company after a friend tells him it's \"about to take off.\" That night he searches for the company online. He clicks the article headlined \"Why analysts are bullish,\" reads it closely, and comes away more confident. He skims past the one titled \"Three risks investors are ignoring\" and closes the tab within seconds, telling himself it's probably just clickbait.\n\nTomás isn't lying to himself, and he isn't careless — he's doing what most people do after they've already decided something: looking for information that confirms the decision, and looking past information that would complicate it. This is confirmation bias. It doesn't feel like avoiding evidence; it feels like doing research. The search returned both headlines either way — what changed was which one felt worth Tomás's time.",
          "es": "Tomás invierte dinero en una empresa después de que un amigo le dice que \"está a punto de despegar\". Esa noche busca la empresa en internet. Hace clic en el artículo titulado \"Por qué los analistas son optimistas\", lo lee con atención, y termina más confiado. Pasa por encima del artículo titulado \"Tres riesgos que los inversionistas están ignorando\" y cierra la pestaña en segundos, diciéndose que probablemente sea solo clickbait.\n\nTomás no se está mintiendo a sí mismo, y no es descuidado — está haciendo lo que la mayoría de la gente hace después de haber decidido algo: buscar información que confirme la decisión, y pasar por alto la información que la complicaría. Esto es el sesgo de confirmación. No se siente como evitar evidencia; se siente como hacer una investigación. La búsqueda arrojó los dos titulares de todos modos — lo que cambió fue cuál de ellos le pareció que valía la pena su tiempo.",
          "ko": "토마스는 친구가 '곧 뜰 것 같다'고 말한 회사에 돈을 넣습니다. 그날 밤 그는 그 회사를 인터넷에서 검색합니다. '왜 애널리스트들이 낙관적인가'라는 제목의 기사를 클릭해 꼼꼼히 읽고 더 자신감을 얻습니다. '투자자들이 무시하고 있는 세 가지 위험'이라는 제목의 기사는 대충 훑어보고는 몇 초 만에 탭을 닫으며, 아마 그냥 낚시성 기사일 거라고 스스로에게 말합니다.\n\n토마스는 자신에게 거짓말을 하는 것도, 부주의한 것도 아닙니다 — 그는 이미 무언가를 결정한 뒤 대부분의 사람들이 하는 일을 하고 있을 뿐입니다: 그 결정을 확인해주는 정보를 찾고, 그것을 복잡하게 만들 정보는 지나치는 것입니다. 이것이 확증 편향입니다. 증거를 회피하는 것처럼 느껴지지 않습니다 — 조사를 하고 있는 것처럼 느껴집니다. 검색은 어느 쪽이든 두 제목을 모두 보여주었습니다 — 달라진 것은 어느 쪽이 토마스의 시간을 쓸 가치가 있다고 느껴졌는가였습니다.",
          "zh": "托马斯听朋友说某家公司“即将起飞”，于是把钱投了进去。当晚他在网上搜索这家公司。他点开了标题为《为什么分析师看好》的文章，仔细读完，变得更有信心。他一眼扫过标题为《投资者正在忽视的三个风险》的那篇，几秒钟内就关掉了标签页，告诉自己那大概只是标题党。\n\n托马斯并没有对自己撒谎，他也不粗心——他只是在做大多数人做过决定之后会做的事：寻找能证实这个决定的信息，略过会让它变复杂的信息。这就是确认偏误。它感觉不像是在回避证据，而像是在做研究。无论如何，搜索结果都同时给出了这两个标题——变化的只是哪一个让托马斯觉得值得花时间。",
          "ja": "トマスは、友人から「これから伸びる」と言われた会社にお金を入れます。その夜、彼はその会社をネットで検索します。「アナリストが強気な理由」という見出しの記事をクリックし、じっくり読んで、より自信を深めます。「投資家が見落としている3つのリスク」という見出しの記事はざっと目を通しただけで、数秒でタブを閉じ、おそらくただの釣り記事だろうと自分に言い聞かせます。\n\nトマスは自分に嘘をついているわけでも、不注意なわけでもありません——彼はすでに何かを決めた後、ほとんどの人がすることをしているだけです。決断を裏付ける情報を探し、それを複雑にする情報から目をそらすことです。これが確証バイアスです。証拠を避けているようには感じられません——調査をしているように感じられます。検索結果はどちらにしても両方の見出しを返していました——変わったのは、どちらがトマスの時間を使う価値があると感じられたかだけです。"
        }
      },
      {
        "heading": {
          "en": "The Bias Gets Stronger the More You've Already Committed",
          "es": "El Sesgo Se Vuelve Más Fuerte Cuanto Más Ya Te Has Comprometido",
          "ko": "이미 몰입할수록 편향은 더 강해집니다",
          "zh": "投入越多，偏见就越强",
          "ja": "すでに関わってしまうほど、バイアスは強くなる"
        },
        "body": {
          "en": "Confirmation bias doesn't only shape which articles someone clicks — it shapes what they remember afterward. A source that supports what Tomás already believes lodges in memory as \"the one that proved it\"; a source that contradicts it gets waved off as biased, outdated, or written by someone who \"doesn't get it,\" and fades. Over time, someone can feel more and more certain about a decision while actually taking in less and less of the information that would have challenged it — certainty and accuracy quietly pulling apart.\n\nThis isn't only about money — the same pattern shows up defending a choice of school, a diet, a political opinion, or a job already taken. The reframe worth trying: before treating a piece of information as support, ask whether you went looking for it, or whether you'd have given equal attention to the version that said the opposite. A quick honest test: name one thing that would change your mind about the decision, then notice whether you've actually gone looking for it — or only for the headlines that don't.",
          "es": "El sesgo de confirmación no solo determina qué artículos hace clic alguien — también determina qué recuerda después. Una fuente que apoya lo que Tomás ya cree se aloja en la memoria como \"la que lo demostró\"; una fuente que la contradice se descarta como sesgada, desactualizada, o escrita por alguien que \"no lo entiende\", y se desvanece. Con el tiempo, alguien puede sentirse cada vez más seguro de una decisión mientras en realidad absorbe cada vez menos de la información que la habría desafiado — la certeza y la precisión se van separando en silencio.\n\nEsto no se trata solo de dinero — el mismo patrón aparece al defender la elección de una escuela, una dieta, una opinión política, o un trabajo ya aceptado. El replanteamiento que vale la pena intentar: antes de tratar una información como respaldo, pregúntate si la buscaste tú, o si le habrías dado la misma atención a la versión que dijera lo contrario. Una prueba rápida y honesta: nombra algo que te haría cambiar de opinión sobre la decisión, y luego fíjate si realmente has buscado eso — o solo los titulares que no lo hacen.",
          "ko": "확증 편향은 사람이 어떤 기사를 클릭하는지만 결정하는 것이 아니라 — 나중에 무엇을 기억하는지도 결정합니다. 토마스가 이미 믿고 있는 것을 뒷받침하는 자료는 '그것을 증명해준 것'으로 기억에 자리 잡습니다. 반대되는 자료는 편향되었다거나, 시대에 뒤떨어졌다거나, '이해를 못 하는' 사람이 썼다며 치워지고 흐릿해집니다. 시간이 지나면서 누군가는 결정에 대해 점점 더 확신하게 되지만, 실제로는 그 결정에 도전했을 정보를 점점 덜 받아들이게 됩니다 — 확신과 정확성이 조용히 서로 멀어지는 것입니다.\n\n이것은 돈에 관한 것만이 아닙니다 — 같은 패턴이 학교 선택, 식단, 정치적 견해, 이미 받아들인 직장을 옹호할 때도 나타납니다. 시도해볼 만한 재구성 방법은 이렇습니다: 어떤 정보를 근거로 삼기 전에, 내가 그것을 일부러 찾아본 것인지, 아니면 반대되는 버전에도 똑같은 관심을 기울였을지 스스로에게 물어보는 것입니다. 빠르고 정직한 테스트: 그 결정에 대한 내 마음을 바꿀 만한 것 한 가지를 말해보고, 실제로 그것을 찾아본 적이 있는지 — 아니면 그렇지 않은 제목들만 찾아봤는지 확인해보세요.",
          "zh": "确认偏误不仅左右一个人会点开哪些文章——它还左右他们之后会记住什么。支持托马斯已有信念的信息，会作为“证明了这一点的那篇”留在记忆里；与之相悖的信息则被当作有偏见、过时，或者是“不懂行”的人写的，从而被打发掉、渐渐淡忘。久而久之，一个人可能对某个决定越来越有把握，实际上却吸收了越来越少本该挑战这个决定的信息——确信程度和准确程度悄悄地分道扬镳。\n\n这不仅仅关乎金钱——同样的模式也出现在为一个学校的选择、一种饮食方式、一个政治观点，或一份已经接受的工作辩护时。值得一试的重新框定方式是：在把一条信息当作支持依据之前，先问问自己，是主动去找的它，还是对相反的说法也会给予同样的关注。一个快速而诚实的测试：说出一件会让你改变对这个决定看法的事，然后留意自己是否真的去找过它——还是只找了那些不会改变你想法的标题。",
          "ja": "確証バイアスは、人がどの記事をクリックするかだけでなく——その後何を覚えているかも左右します。トマスがすでに信じていることを裏付ける情報源は「それを証明したもの」として記憶に残ります。それに反する情報源は、偏っている、時代遅れだ、あるいは「分かっていない」人が書いたものだと片付けられ、薄れていきます。時間が経つにつれ、ある決断についてますます確信が強まる一方で、実際にはその決断に異を唱えるはずだった情報をますます取り入れなくなっていきます——確信と正確さが、静かに離れていくのです。\n\nこれはお金だけの話ではありません——同じパターンは、学校の選択、食事法、政治的な意見、すでに受け入れた仕事を擁護するときにも現れます。試す価値のある捉え直し方はこうです。ある情報を裏付けとして扱う前に、自分がそれを探しに行ったのか、それとも反対のことを言うバージョンにも同じだけ注意を払っただろうかと自問すること。手早く正直にできるテスト：その決断について自分の考えを変えさせるものを一つ挙げてみて、実際にそれを探しに行ったことがあるか——それとも、そうならない見出しばかり探していたか、確かめてみてください。"
        }
      }
    ],
    "takeaway": {
      "en": "Confirmation bias is the tendency to seek out, favor, and remember information that supports a decision you've already made (or a belief you already hold), while dismissing or forgetting what contradicts it — so certainty grows even when accuracy doesn't. Before treating something as evidence you were right, ask whether you'd have given the opposite version the same attention.",
      "es": "El sesgo de confirmación es la tendencia a buscar, favorecer y recordar información que respalda una decisión que ya tomaste (o una creencia que ya tienes), mientras descartas u olvidas lo que la contradice — así que la certeza crece incluso cuando la precisión no lo hace. Antes de tratar algo como evidencia de que tenías razón, pregúntate si le habrías dado la misma atención a la versión contraria.",
      "ko": "확증 편향은 이미 내린 결정(또는 이미 가진 믿음)을 뒷받침하는 정보를 찾고, 선호하고, 기억하는 반면 그것에 반하는 정보는 무시하거나 잊어버리는 경향입니다 — 그래서 정확성은 그대로여도 확신은 커집니다. 무언가를 자신이 옳았다는 증거로 여기기 전에, 반대되는 버전에도 똑같은 관심을 기울였을지 자문해 보세요.",
      "zh": "确认偏误是指人们倾向于寻找、偏爱并记住那些支持自己已做决定（或已有信念）的信息，同时忽视或忘记与之相悖的信息——于是确信程度在增长，即使准确程度并没有。在把某件事当作自己是对的证据之前，先问问自己是否会对相反的说法给予同样的关注。",
      "ja": "確証バイアスとは、すでに下した決断（またはすでに持っている考え）を裏付ける情報を探し、好み、記憶する一方で、それに反する情報は退けたり忘れたりする傾向です——そのため、正確さが増えていなくても確信は増えていきます。何かを自分が正しかった証拠として扱う前に、反対のバージョンにも同じだけ注意を払っただろうかと自問してください。"
    },
    "thinkAbout": {
      "en": "Think of a decision you've already made — a purchase, an investment, an opinion. Have you actually looked for information that could prove you wrong, or only skimmed past it?",
      "es": "Piensa en una decisión que ya hayas tomado — una compra, una inversión, una opinión. ¿Has buscado realmente información que pudiera demostrar que estabas equivocado, o solo la has pasado por alto?",
      "ko": "이미 내린 결정을 하나 떠올려 보세요 — 구매, 투자, 의견. 자신이 틀렸을 수도 있다는 것을 보여줄 정보를 실제로 찾아본 적이 있나요, 아니면 그냥 지나쳤나요?",
      "zh": "想一个你已经做过的决定——一次购买、一项投资、一个观点。你是否真的去找过能证明自己错了的信息，还是只是一带而过？",
      "ja": "すでに下した決断を一つ思い浮かべてください——買い物、投資、意見など。自分が間違っている可能性を示す情報を実際に探しに行ったことがありますか、それともただ素通りしてきましたか。"
    }
  },
};
