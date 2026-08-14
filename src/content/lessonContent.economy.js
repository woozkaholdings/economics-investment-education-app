// ═══════════════════════════════════════════════════════════════════════════
// LESSON CONTENT — economy track
//
// Split out of the former single content/lessonContent.js on 2026-08-14
// (backlog item 25, the real fix for the LessonReader chunk-size warning):
// holds only the economy-track lessons' body text (sections, takeaway,
// thinkAbout), keyed by lesson id. LessonReader.jsx dynamically import()s
// this file (or lessonContent.money.js for the other track) so opening a
// lesson only ever downloads its own track's content, not both.
// content/lessonContent.js still exists as a merged re-export of this file
// + lessonContent.money.js, imported only by scripts/check-data.mjs and
// scripts/translation-review.mjs, which need every lesson regardless of
// track and aren't part of the client bundle.
// ═══════════════════════════════════════════════════════════════════════════

export const lessonContent = {
  29: {
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
  30: {
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
          "en": "Say you want to buy a $20,000 car but only have $5,000 saved. A lender — a bank, a credit union, or the dealership itself — offers you a loan: they hand you $15,000 now, and you promise to pay it back over time, plus interest as their fee for taking the risk.\n\nThe moment you sign that promise, and the lender believes you'll keep it, $15,000 of brand-new credit is created out of thin air — nobody had to save it first. You drive off with the car; the lender now holds an asset (you owe them money), and you hold a liability (you owe it).\n\nInterest rates decide how expensive that promise is. When rates are high → borrowing costs more → fewer people take out loans. When rates are low → borrowing is cheap → more people do. That's exactly the lever the Federal Reserve uses to speed up or slow down the whole economy (more on that in Lesson 35).",
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
          "zh": "货币立即结算交易。信贷像酒吧记账——你承诺以后付。\n\n惊人的现实：人们所说的“钱”大部分实际是信贷。美国总信贷规模是基础货币供应量的许多倍，且随着经济增长这一差距不断扩大。",
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
  31: {
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
  32: {
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
          "en": "Imagine a town where a new factory opens and hires hundreds of workers. Those workers now have paychecks to spend — at restaurants, on cars, at the hardware store. Restaurant owners hire more staff to keep up; the car dealer orders more inventory. This is expansion: spending increases, and because credit can be created instantly (Lesson 30), people borrow to spend even more than their paychecks alone would allow.\n\nBut there's a limit to how many meals a town's restaurants can actually cook in a day. When spending and incomes grow faster than the town can really produce, businesses respond by raising prices instead of magically producing more — that's inflation.\n\nThe Central Bank doesn't want inflation running too hot, so it raises interest rates. Higher rates mean the factory worker's car loan gets pricier, fewer people take out new loans, and existing variable-rate debts cost more to service — all of which cools spending back down.",
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
      },
      {
        "heading": {
          "en": "Why This Fix Has a Limit",
          "es": "Por Qué Este Arreglo Tiene un Límite",
          "ko": "이 해결책에 한계가 있는 이유",
          "zh": "为什么这个方案有限度",
          "ja": "この解決策に限界がある理由"
        },
        "body": {
          "en": "There's a hidden assumption behind the fix in the last section: the central bank has room to cut rates. Each time the short-term cycle turns down, cutting rates works because the previous expansion pushed rates up first — there's slack to give back. But look again at the question at the end of this lesson: if each cycle's peak carries more debt than the one before it, rates don't always return to where they started. Debt payments compete with new borrowing for a household's or a business's income, so lenders and central banks tend to keep rates a little lower on average, cycle after cycle, just to keep debt serviceable.\n\nRun that pattern across many 5-8 year cycles — decades, not years — and the room to cut keeps shrinking. Eventually rates approach zero, and the tool that ended every previous recession in this lesson (lower rates → cheaper borrowing → renewed spending) runs out of room to use. That's not hypothetical: it's the situation Lesson 37 describes, where central banks turned to buying bonds directly (quantitative easing) because cutting rates further wasn't possible.\n\nThis is the seam between the two debt cycles: the short-term cycle in this lesson resolves through nothing more than a rate cut, roughly every 5-8 years. The long-term cycle — the subject of the next lesson — is what happens when decades of these small cycles compound into a debt burden that a rate cut alone can no longer fix, and a different, harder kind of adjustment becomes necessary instead.",
          "es": "Este arreglo depende de que el banco central tenga margen para bajar tasas. Cada ciclo corto se resuelve con un recorte — pero si cada pico acumula más deuda que el anterior, ese margen se reduce con el tiempo.\n\nEventualmente las tasas se acercan a cero y el recorte ya no basta (como en la Lección 9, que llevó a la compra directa de bonos).\n\nEsta es la diferencia entre el ciclo corto — resuelto con un recorte de tasas cada 5-8 años — y el ciclo largo, que aparece cuando décadas de estos ciclos acumulan una deuda que un simple recorte ya no puede arreglar.",
          "ko": "이 해결책은 중앙은행이 금리를 낮출 여력이 있다는 전제에 달려 있습니다. 매 단기 순환은 금리 인하로 해결되지만, 매번 정점의 부채가 이전보다 크다면 그 여력은 점점 줄어듭니다.\n\n결국 금리가 0%에 가까워지면 인하만으로는 부족해집니다 (레슨 9에서 다룬, 채권을 직접 매입하게 된 상황).\n\n이것이 5-8년마다 금리 인하로 풀리는 단기 순환과, 수십 년간 쌓인 부채를 금리 인하만으로 해결할 수 없을 때 나타나는 장기 순환의 차이입니다.",
          "zh": "这个方案的前提是央行有降息的空间。每个短期周期都靠降息化解——但如果每次高峰的债务都比上一次更多，这个空间会逐渐缩小。\n\n最终利率接近零，降息不再够用（如第9课所述，央行转向直接购买债券）。\n\n这就是短期周期（每5-8年靠降息化解）与长期周期（数十年积累的债务无法仅靠降息解决时出现）之间的区别。",
          "ja": "この解決策は、中央銀行に金利を下げる余地があることが前提です。短期サイクルはそれぞれ利下げで解決されますが、毎回のピークで前回より多くの債務を抱えていれば、その余地は次第に縮小します。\n\nやがて金利がゼロに近づくと、利下げだけでは不十分になります（レッスン9で扱った、債券を直接購入するようになった状況）。\n\nこれが、5-8年ごとに利下げで解決する短期サイクルと、数十年にわたる蓄積が利下げだけでは解決できない負債になったときに現れる長期サイクルとの違いです。"
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
  33: {
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
          "en": "Picture a neighborhood where home prices have risen every year for a decade. A family buys a house not just to live in, but because they're confident it'll be worth more next year — so they stretch their budget and take out the biggest mortgage a bank will approve. Across many short-term cycles like the one in Lesson 32, this happens over and over: debts rise faster than incomes, because human nature favors borrowing and spending more today over paying down debt.\n\nLenders keep lending freely through all of this, because everyone can see the evidence with their own eyes — incomes are rising, home values are up, the stock market is roaring. Confidence feeds on itself.\n\nWhen enough people borrow heavily to buy an asset — houses, stocks, anything — purely because they expect the price to keep rising, that pushes prices higher still. That's a bubble.\n\nAs long as incomes keep rising too, the debt burden (the ratio of what's owed to what's earned) looks manageable. But nothing rises forever, and that's exactly the problem.",
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
          "es": "Eventualmente, los pagos de deuda crecen más rápido que los ingresos. Esto pasó en EE.UU. en 2008, Japón en 1989 y EE.UU. en 1929.\n\nEn un desapalancamiento, las tasas de interés no pueden salvar la situación, porque en este punto suelen estar ya cerca del 0%.",
          "ko": "결국 부채 상환이 소득보다 빠르게 증가합니다. 미국 2008년, 일본 1989년, 미국 1929년에 발생했습니다.\n\n디레버리징에서는 이 시점에 금리가 이미 0%에 가까운 경우가 많아, 금리 인하로는 해결할 수 없습니다.",
          "zh": "最终，还债增长快于收入。美国2008年、日本1989年、美国1929年都发生过。\n\n去杠杆时，利率往往已经接近0%，难以再靠降息来解决。",
          "ja": "最終的に債務返済が所得より速く増加。米国2008年、日本1989年、米国1929年に起きた。\n\nデレバレッジではこの時点で金利はすでに0%近くまで下がっていることが多く、利下げでは解決できない。"
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
  34: {
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
          "zh": "关键是平衡。通缩手段和通胀手段必须平衡。\n\n漂亮的去杠杆：债务下降、增长为正。2008-2015美国是例子。\n\n丑陋的去杠杆：过度使用某一工具。恢复大约需要十年——“失去的十年”。",
          "ja": "鍵はバランス。デフレ的手段とインフレ的手段のバランス。\n\n美しいデレバレッジ：債務が所得比で低下、成長維持。2008-2015年の米国が例。\n\n醜いデレバレッジ：一つの手段を使いすぎる。回復には約10年 — 「失われた10年」。"
        }
      },
      {
        "heading": {
          "en": "Why Tool #4 Isn't Available to Everyone",
          "es": "Por Qué la Herramienta #4 No Está Disponible para Todos",
          "ko": "왜 4번 도구는 모두에게 열려 있지 않은가",
          "zh": "为什么第4种工具并非人人可用",
          "ja": "なぜ4番目の手段は誰にでも使えるわけではないのか"
        },
        "body": {
          "en": "All four tools assume one thing that isn't actually true everywhere: that the debt is owed in a currency the borrower's own central bank can create.\n\nWhen a country's debt is denominated in its own currency, printing money is a real option — painful and inflationary, but it converts an unpayable debt into a payable one, because the central bank can literally create the units needed to pay it. A country whose debt is denominated in a foreign currency it cannot print doesn't have that fourth lever at all. If the money runs out, there is no press to run — only tool 1 (austerity) and tool 2 (default) are actually on the table, however painful.\n\nThis single fact — whose currency the debt is in — is a big part of why debt crises hit very differently depending on where they happen. Countries that borrowed heavily in a foreign currency during the 1980s Latin American debt crisis had no printing option when foreign lenders pulled back, and mostly went through default and restructuring instead. Japan, by contrast, carries one of the highest government-debt-to-GDP ratios in the world, but because that debt is almost entirely yen-denominated and owed largely to its own citizens and institutions, its central bank has been able to lean on tool 4 for decades without a default.\n\nSo before asking whether a country's deleveraging will be 'beautiful' or 'ugly,' the more basic question is whether tool 4 is even on the menu.",
          "es": "Los 4 herramientas asumen que la deuda está en la moneda propia del banco central. Si la deuda está en moneda extranjera, no se puede imprimir para pagarla — solo quedan la austeridad y el impago. Esto explica por qué las crisis de deuda de los 1980 en América Latina (deuda en dólares) terminaron en impago, mientras Japón, con deuda casi toda en yenes, ha podido usar la herramienta 4 durante décadas sin impago.",
          "ko": "네 가지 도구는 모두 부채가 자국 중앙은행이 발행할 수 있는 통화로 표시되어 있다고 가정합니다. 부채가 외국 통화로 표시되어 있다면 화폐를 찍어 갚을 수 없고, 긴축과 채무불이행만 남습니다. 1980년대 중남미 부채 위기(달러 표시 부채)가 대부분 채무불이행으로 끝난 이유이자, 거의 전부 엔화 표시인 일본이 수십 년간 채무불이행 없이 4번 도구를 써온 이유입니다.",
          "zh": "这四种工具都假设债务以本国央行能够发行的货币计价。如果债务以外币计价，就无法靠印钞偿还——只剩紧缩和违约。这解释了为什么1980年代拉美债务危机（美元计价债务）大多以违约收场，而债务几乎全部以日元计价的日本，几十年来一直能靠第4种工具而不违约。",
          "ja": "4つの手段はすべて、債務が自国中央銀行が発行できる通貨建てであることを前提としています。債務が外貨建てなら紙幣を刷って返済することはできず、緊縮とデフォルトしか残りません。1980年代のラテンアメリカ債務危機（ドル建て債務）の多くがデフォルトに終わった理由であり、ほぼ全て円建てである日本が数十年間デフォルトなしに4番目の手段を使えてきた理由です。"
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
  35: {
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
          "en": "Think of the Federal Funds Rate as the master dial in the economy's control room. When the Fed turns it, nearly every other rate in your financial life follows — the rate on a new mortgage, what your savings account pays you, the APR on your credit card.\n\nRaise the dial → borrowing gets more expensive → the economy slows down.\nLower the dial → borrowing gets cheaper → the economy speeds up.\n\nThis is the Fed's primary tool for managing the short-term debt cycle from Lesson 32. But here's the catch: turning the dial doesn't change anything instantly. It typically takes 12-24 months for a rate change to fully work its way through mortgages, business loans, and hiring decisions — which is part of why the Fed sometimes turns the dial too far in one direction before the earlier turn has fully kicked in.",
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
          "zh": "利率上升：股票下跌、债券价格下跌、房地产放缓。\n利率下降：股票上涨、债券价格上涨、房地产复苏。\n\n黄金法则：“不要和美联储作对。”",
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
  36: {
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
      },
      {
        "heading": {
          "en": "Why the Signal Works — and Where It Can Mislead",
          "es": "Por Qué Funciona la Señal — y Dónde Puede Engañar",
          "ko": "이 신호가 작동하는 이유 — 그리고 오해할 수 있는 지점",
          "zh": "为什么这个信号有效——以及它可能误导的地方",
          "ja": "このシグナルが機能する理由——そして誤解を招きうる点"
        },
        "body": {
          "en": "The mechanism behind the signal is expectations, not magic. A long-term yield is, roughly, a market bet on where short-term rates will average out over that whole stretch of time. If the market expects the central bank to cut rates sharply because a slowdown is coming, that expectation pulls the 10-year yield down today — even while the 2-year yield still reflects today's higher short-term rate. That gap flipping negative is the market pricing in future weakness before it shows up in jobs or GDP data.\n\nThe specific spread economists cite most often is '2s10s' — the 2-year Treasury yield minus the 10-year. It inverted in mid-2022 and stayed inverted for roughly two years, the longest stretch on record, before turning positive again in 2024, well past the 'typical' 12-18 month lead time.\n\nThat gap between the signal and the outcome is the real limit to keep in mind: it says a slowdown is more likely, not when, and not how severe. The 1966 inversion preceded a sharp growth slowdown but no official recession. Reading the curve well means weighing it alongside employment, inflation, and credit data — one input, not a standalone forecast.",
          "es": "El mecanismo es de expectativas, no magia. El rendimiento a largo plazo refleja dónde el mercado espera que estén las tasas de corto plazo, en promedio, durante ese período. El diferencial más citado es '2s10s' (2 años menos 10 años) — se invirtió a mediados de 2022 y se mantuvo invertido casi dos años, el período más largo registrado, antes de volver a positivo en 2024, mucho después del plazo 'típico' de 12-18 meses. La señal indica que una desaceleración es más probable, no cuándo ni qué tan severa será: en 1966 una inversión precedió una fuerte desaceleración sin llegar a ser recesión oficial.",
          "ko": "이 신호의 원리는 마법이 아니라 기대심리입니다. 장기 금리는 대체로 그 기간 동안 단기 금리가 평균적으로 어디에 있을지에 대한 시장의 베팅을 반영합니다. 가장 많이 인용되는 스프레드는 '2s10s'(2년물-10년물)로, 2022년 중반에 역전되어 약 2년간(사상 최장) 지속되다 '전형적인' 12-18개월보다 훨씬 늦은 2024년에야 다시 플러스로 전환되었습니다. 이 신호는 둔화 가능성이 높다는 것만 말해줄 뿐 시점이나 심각도는 알려주지 않습니다 — 1966년의 역전은 공식 경기침체 없이 급격한 성장 둔화만 초래했습니다.",
          "zh": "这个信号的原理是预期，而非魔法。长期收益率大致反映了市场对该期间短期利率平均水平的押注。最常被引用的利差是「2s10s」（2年期减10年期）——它在2022年年中出现倒挂，并持续了近两年（历史最长），直到远超「典型」12-18个月周期的2024年才转为正值。这个信号只能说明放缓的可能性更高，而不能说明具体时间或严重程度——1966年的一次倒挂之后经济大幅放缓，但并未演变成官方认定的衰退。",
          "ja": "このシグナルの仕組みは魔法ではなく期待です。長期利回りは、その期間中の短期金利の平均がどこに落ち着くかについての市場の見立てをおおよそ反映しています。最もよく引用されるスプレッドは「2s10s」（2年物マイナス10年物）で、2022年半ばに逆転し、過去最長となる約2年間逆転が続いた後、「典型的」とされる12-18ヶ月をはるかに超えた2024年にようやくプラスに戻りました。このシグナルが示すのは減速の可能性が高いということだけで、時期や深刻さまでは示しません——1966年の逆転は公式の景気後退には至らず、急激な成長減速にとどまりました。"
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
  37: {
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
          "en": "Normally the Fed's master dial (Lesson 35) is interest rates. But once that dial is already turned all the way down to 0%, it can't go any lower — and if the economy still needs help, the Fed reaches for a different tool entirely.\n\nQuantitative Easing works like this: the Fed creates new money electronically (no printing press involved, just entries in a ledger) and uses it to buy up government bonds and mortgage-backed securities from banks and investors — stepping into the bond market as an enormous buyer, competing for the same bonds everyone else wants.\n\nThat buying pressure pushes bond prices up (and yields, meaning the return on those bonds, down), makes borrowing cheaper across the economy, and — because bonds now pay less — nudges investors who want a decent return toward riskier assets like stocks instead.\n\nQE1 (2008): $1.75 trillion\nQE2 (2010): $600 billion\nQE3 (2012): $85B/month\nCOVID QE (2020): Unlimited\n\nThe scale of this tool shows up on the Fed's own balance sheet, which grew from roughly $900 billion before 2008 to a peak of about $9 trillion in 2022 — a stack of bonds nine times the size of the entire pre-2008 institution.",
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
      },
      {
        "heading": {
          "en": "From the Bond Market to Your Mortgage Rate",
          "es": "Del Mercado de Bonos a tu Tasa Hipotecaria",
          "ko": "채권 시장에서 모기지 금리까지",
          "zh": "从债券市场到房贷利率",
          "ja": "債券市場から住宅ローン金利まで"
        },
        "body": {
          "en": "Buying government bonds is a strange way to help a small business get a loan or a family buy a house — the Fed never lends to either one directly. The connection runs through a chain of linked prices. A 30-year mortgage rate is priced as a spread on top of the 10-year Treasury yield, so when QE's buying pushes that yield down, mortgage rates tend to fall with it. Corporate bonds work the same way, so cheaper government borrowing tends to cheapen business borrowing too, encouraging investment and hiring. There's a second channel: as bond yields fall, investors chasing a decent return keep rotating into stocks and other assets, which raises the value of what people already own — a \"wealth effect\" that can make people feel richer and spend more, even if they never bought a single bond. Both channels take time, and neither reaches everyone equally: cheaper borrowing helps most whoever is already creditworthy enough to qualify for a loan, and the wealth effect only reaches people who already own financial assets or a home.",
          "es": "Un bono del Tesoro a 10 años fija el precio de las hipotecas a 30 años, así que cuando el QE baja ese rendimiento, las hipotecas también bajan — igual con los bonos corporativos. Además, al caer los rendimientos, los inversores rotan hacia acciones, elevando su valor: un 'efecto riqueza' que hace gastar más a quienes ya poseen activos. Ninguno de los dos canales llega por igual a todos.",
          "ko": "10년물 국채 금리가 30년 모기지 금리의 기준이 되므로, QE로 그 금리가 내려가면 모기지 금리도 함께 내려갑니다 — 회사채도 마찬가지입니다. 또한 채권 수익률이 낮아지면 투자자들이 주식 등으로 옮겨가며 자산 가치가 오르는 '부의 효과'가 생기는데, 이는 이미 자산을 가진 사람에게만 해당됩니다.",
          "zh": "10年期国债收益率是30年期房贷利率的定价基准，QE压低该收益率时，房贷利率也随之下降——公司债同理。此外，债券收益率下降促使投资者转向股票等资产，推高资产价值，形成让已持有资产者更愿意消费的\"财富效应\"。这两条渠道都无法惠及所有人。",
          "ja": "10年国債利回りは30年住宅ローン金利の基準となるため、QEでその利回りが下がると住宅ローン金利も下がります——社債も同様です。さらに債券利回りの低下で投資家が株式などへ資金を移し資産価格が上昇、既に資産を持つ人の消費を促す「資産効果」が生まれますが、これは資産を持つ人にしか及びません。"
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
  38: {
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
          "en": "Picture the same factory town from Lesson 32, a few years into its boom. EXPANSION: credit flows freely, GDP rises, new jobs keep appearing, and confidence builds. People borrow more, spend more, and feel wealthier — the town adds a second restaurant, then a third. Historically, this phase has coincided with S&P 500 average returns of roughly +14-28%, and assets like growth stocks, cyclical stocks, and real estate have historically been favored in it.\n\nPEAK: the town's output is now about as high as it can go — every worker is employed, every restaurant full. Inflation is running at highs, and the Fed is raising rates to cool things down. Growth stalls, even though the mood hasn't caught up yet. This is where the seeds of the next contraction are quietly planted.\n\nHistorically favored in this phase: value stocks, commodities, and short-duration bonds.",
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
      },
      {
        "heading": {
          "en": "Why These Assets, in This Phase",
          "es": "Por Qué Estos Activos, en Esta Fase",
          "ko": "왜 이 국면에 이 자산인가",
          "zh": "为何这些资产适合这个阶段",
          "ja": "なぜこの局面でこれらの資産なのか"
        },
        "body": {
          "en": "None of the asset patterns above are random — each one falls out of the same rate-transmission mechanism from Lesson 35. In Expansion, rates are still low to moderate and profits look likely to keep growing, so growth stocks — priced mostly on profits still years away — get a bigger lift from cheap money than a company already earning steady profits today; real estate and cyclical businesses ride the same wave of easy credit and rising incomes.\n\nAt the Peak, the Fed is actively raising rates to cool the boom, and that same mechanism now runs in reverse on the assets priced furthest into the future — growth stocks lose their edge first — while value stocks (companies profitable today, not counting on tomorrow) and short-duration bonds (less exposed than a 30-year bond to further hikes) tend to hold up better; commodities often keep climbing on the inflation the rate hikes are trying to tame.\n\nIn Contraction, rates are falling and investors grow less willing to hold anything that could default or keep falling in price — money moves toward Treasury bonds (the safest income there is), gold (no company behind it that can go bankrupt), and defensive stocks selling things people buy regardless of the economy, like medicine or electricity.\n\nBy the Trough, prices for the same beaten-down companies and high-yield bonds have already fallen so far that even a small improvement in the outlook makes them look cheap relative to what they still earn — the mechanical reason the strongest rebounds have historically started exactly when the headlines felt worst.",
          "es": "Estos patrones no son aleatorios — vienen del mismo mecanismo de tasas de la Lección 7. En Expansión, el dinero barato impulsa más a las acciones de crecimiento. En el Pico, ese mecanismo se invierte: las acciones de valor y bonos de corto plazo resisten mejor. En Contracción, el dinero busca refugio en bonos del Tesoro y oro. En el Valle, los precios ya cayeron tanto que hasta una pequeña mejora los hace ver baratos.",
          "ko": "이 패턴들은 무작위가 아니라 7강의 금리 전달 메커니즘에서 나옵니다. 확장기에는 저렴한 자금이 성장주를 더 밀어올립니다. 정점에서는 그 메커니즘이 반대로 작동해 가치주와 단기 채권이 더 잘 버팁니다. 수축기에는 자금이 국채와 금으로 몰립니다. 저점에서는 가격이 이미 너무 떨어져서 작은 개선만으로도 저렴해 보입니다.",
          "zh": "这些模式并非随意——都源自第7课的利率传导机制。扩张期，廉价资金更能推动成长股。顶峰期，机制反转，价值股和短期债券更抗跌。收缩期，资金流向美国国债和黄金避险。低谷期，价格已跌至谷底，哪怕一点好转也显得便宜。",
          "ja": "これらのパターンは無作為ではなく、第7課の金利伝達メカニズムから生じる。拡大期は安いお金がグロース株を押し上げる。ピークではそのメカニズムが逆転し、バリュー株と短期債が持ちこたえやすい。収縮期は資金が米国債と金に向かう。底では価格が下がり切り、小さな改善でも割安に見える。"
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
      "zh": "巴菲特说“别人贪婪时恐惧，别人恐惧时贪婪。”这与你学到的周期知识有什么联系？",
      "ja": "バフェットは「他人が貪欲な時に恐れ、恐れている時に貪欲になれ」と言います。"
    }
  },
  39: {
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
      },
      {
        "heading": {
          "en": "From Gauges to a Diagnosis: Matching Indicators to Phase",
          "es": "De Indicadores a un Diagnóstico: Cómo Encajan con Cada Fase",
          "ko": "지표에서 진단으로: 국면과 지표 맞춰보기",
          "zh": "从指标到诊断：将指标与阶段对应",
          "ja": "指標から診断へ：指標と局面を対応させる"
        },
        "body": {
          "en": "Knowing what each gauge measures is only half the job — the other half is knowing what a normal reading looks like in each phase from Lesson 38, so an unusual one stands out.\n\nIn Expansion, the gauges tend to point the same direction: GDP rising steadily, CPI near the Fed's target, PMI above 50 and climbing, VIX low, and credit spreads narrow — lenders confident and growth broad-based.\n\nAt Peak, the gauges start to disagree, which is itself the signal: GDP growth is still positive but decelerating, CPI has drifted above target, PMI hovers near 50 and starts slipping, VIX ticks up from its lows, and credit spreads begin to widen even while headlines still sound upbeat.\n\nIn Contraction, the gauges realign in the other direction: GDP falling, CPI cooling as weaker demand pulls prices down, PMI below 50, VIX elevated or spiking, and credit spreads wide as lenders demand extra compensation for rising default risk.\n\nAt Trough, the gauges are still weak in level but starting to turn: GDP near its low point, CPI low, PMI below 50 but stabilizing or ticking up, VIX easing back from its extremes, and credit spreads beginning to narrow. The earliest signs of a turn tend to show up in the leading indicators (PMI, VIX, credit spreads) before GDP itself confirms it, since GDP only measures activity that already happened.\n\nThat lag is exactly why watching several gauges together, instead of waiting for GDP alone to confirm a turn, is what lets you read the cycle rather than just react to it after the fact.",
          "es": "Cada fase tiene una firma típica de indicadores: en Expansión todos apuntan igual (PIB subiendo, PMI >50, VIX bajo, spreads estrechos); en Pico empiezan a discrepar (PIB desacelera, PMI ronda 50, VIX y spreads suben) — eso es la señal. En Contracción todos se alinean a la baja; en Valle los indicadores líderes (PMI, VIX, spreads) giran antes que el PIB, que siempre confirma tarde.",
          "ko": "각 국면마다 지표들의 전형적인 조합이 있습니다: 확장기에는 모두 같은 방향(GDP 상승, PMI 50 이상, VIX 낮음, 스프레드 좁음)을 가리키고, 정점에서는 지표들이 서로 어긋나기 시작합니다(GDP 둔화, PMI 50 근처, VIX·스프레드 상승) — 그 어긋남 자체가 신호입니다. 수축기에는 모두 하락 쪽으로 정렬되고, 저점에서는 선행 지표(PMI, VIX, 스프레드)가 항상 뒤늦게 확인되는 GDP보다 먼저 방향을 바꿉니다.",
          "zh": "每个阶段都有典型的指标组合：扩张期所有指标同向（GDP上升、PMI高于50、VIX低、利差窄）；顶峰时指标开始分歧（GDP放缓、PMI接近50、VIX和利差上升）——分歧本身就是信号。收缩期所有指标一致走弱；触底期领先指标（PMI、VIX、利差）会先于总是滞后确认的GDP转向。",
          "ja": "各局面には指標の典型的な組み合わせがある。拡大期は全指標が同じ方向（GDP上昇、PMIは50超、VIXは低い、スプレッドは狭い）を示す。ピークでは指標が食い違い始める（GDP鈍化、PMIは50付近、VIXとスプレッドが上昇）——その食い違い自体がシグナル。収縮期は全指標が下向きに揃い、底では先行指標（PMI、VIX、スプレッド）が、常に遅れて確認されるGDPより先に転換する。"
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
  40: {
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
          "en": "RULE 1: Don't let debt rise faster than income. Remember the family from Lesson 33 whose mortgage payment kept eating a bigger share of their paycheck? That's Rule 1 being broken in slow motion — eventually the debt burden crushes you, whether you're a household or a country.\n\nRULE 2: Don't let income rise faster than productivity. If a factory worker's wage keeps climbing but they're not producing any more per hour than before, the factory eventually can't compete with one elsewhere that pays less for the same output — jobs move, or prices rise until customers walk away.\n\nRULE 3: Do everything you can to raise your own productivity — learn a new skill, adopt a better tool or process, like the farmer's tractor from Lesson 31. In the long run, this is what actually matters most, because it's the only one of the three that isn't just moving numbers around.\n\nThis is simple advice for you AND for policy makers alike. Most people — including most policy makers — don't pay nearly enough attention to it.",
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
          "en": "Now you have the whole template, built lesson by lesson: a slow, steady line of productivity growth (Lesson 31) running underneath everything; a 75-100 year long-term debt cycle (Lesson 33) rising and falling on top of that; and a faster 5-8 year short-term debt cycle (Lesson 32) bouncing on top of both. Layer all three together, and you get a map for understanding where an economy has been, where it is now, and where it's probably headed.\n\nThe economy isn't random noise — it's a machine driven by transactions (Lesson 29), credit (Lesson 30), and human nature repeating the same patterns generation after generation. Once you can see those patterns, whether you're an investor, a small business owner, or just someone trying to make sense of the news, you're equipped to make better decisions than someone reacting to headlines one at a time.",
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
  }
};
