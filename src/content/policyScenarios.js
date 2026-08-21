// ═══════════════════════════════════════════════════════════════════════════
// POLICY SCENARIOS — "Be the Fed Chair"
//
// Backlog item 34 (the feature one). The lesson that hosts these — Interest
// Rates: The Master Signal — ends by saying the dual mandate has "no equation
// that resolves the trade-off — it's a judgment call the Fed's policy committee
// makes meeting by meeting." That sentence asks the reader to make a judgment
// and then gives them nothing to make it with. These scenarios are that
// missing half: a situation, a question, three levers, and an explanation of
// what each lever sets in motion.
//
// §3.0.4 is the reason it ranks: a diagram shows a mechanism, a simulator lets
// the learner drive one and watch it answer back — which is the "what a chat
// window cannot do" argument one step further.
//
// STANDING RULES that apply here, and how each is met:
//
//   §10.1 (advice adjacency) — this is *central-bank policy*, not a buy/sell
//     decision, which is what makes "what would you do" safe ground here when
//     it would not be in a personal-finance lesson. Nothing below tells a
//     reader what to do with their own money, and no outcome text predicts
//     what markets will do next. Keep it that way if you add a scenario.
//
//   §2.3 (nothing reads as live data) — every situation is hypothetical and
//     dateless by construction. The figures are round teaching numbers chosen
//     to make one trade-off legible, not readings from any particular period.
//     This file is in check-blindspot.mjs's §2.3 teaching-copy list.
//
//   NO SCORING. Picking a lever returns a consequence, never a verdict. A
//     scored version would have to assert a correct answer, and the lesson's
//     own point is that the committee's own members disagree at the same
//     meeting with the same data. The learner can try all three.
//
//   NO NUMBERED LESSON REFERENCES. The prose here names other lessons by
//     subject ("the QE and QT lesson"), never as "Lesson 37". Two renumberings
//     have already left stale numbers scattered across five languages, and
//     check-data.mjs §16 — the guard that now catches those — walks lesson
//     prose and quiz explanations, not this file. §19 fails the build if a
//     numbered reference appears here; either use the subject, or extend §16.
// ═══════════════════════════════════════════════════════════════════════════

export const policyScenarios = [
  {
    id: "overheating",
    lessonId: 35,
    situation: {
      en: "Inflation has been running near 7% a year for months. Unemployment is unusually low at 3.5%, and firms across the country say they cannot find enough people to hire.",
      es: "La inflación lleva meses cerca del 7% anual. El desempleo está inusualmente bajo, en 3.5%, y las empresas de todo el país dicen que no encuentran suficiente gente para contratar.",
      ko: "물가 상승률이 몇 달째 연 7% 가까이 유지되고 있습니다. 실업률은 3.5%로 이례적으로 낮고, 전국의 기업들은 채용할 사람을 구하지 못하겠다고 말합니다.",
      zh: "通胀已经连续几个月接近每年 7%。失业率低至 3.5%，处于异常低位，全国各地的企业都说招不到足够的人。",
      ja: "インフレ率は数か月にわたり年7%近くで推移しています。失業率は3.5%と異常に低く、各地の企業は採用したい人材が見つからないと言っています。",
    },
    question: {
      en: "You chair the policy committee. Which way do you turn the dial?",
      es: "Usted preside el comité de política monetaria. ¿Hacia dónde gira el dial?",
      ko: "당신이 통화정책 위원회 의장입니다. 다이얼을 어느 쪽으로 돌리시겠습니까?",
      zh: "你是货币政策委员会主席。这个旋钮，你要往哪边拧？",
      ja: "あなたが政策委員会の議長です。ダイヤルをどちらに回しますか。",
    },
    options: [
      {
        id: "hike",
        label: {
          en: "Raise the rate",
          es: "Subir la tasa",
          ko: "금리 인상",
          zh: "加息",
          ja: "利上げする",
        },
        outcome: {
          en: "Borrowing gets more expensive across the board — mortgages, car loans, business credit — so households buy less and firms build less, and the pressure pushing prices up eases. The cost lands on the other half of the mandate: pricier loans also mean less hiring, so unemployment usually drifts up. And none of it arrives at once. Most of the effect shows up 12–24 months later, which is why a committee can look like it is sitting still while an earlier move is still traveling through the economy.",
          es: "El crédito se encarece en todas partes — hipotecas, préstamos de auto, crédito empresarial —, así que los hogares compran menos y las empresas construyen menos, y cede la presión que empuja los precios hacia arriba. El costo cae sobre la otra mitad del mandato: préstamos más caros también significan menos contrataciones, así que el desempleo suele subir. Y nada de esto llega de golpe. La mayor parte del efecto aparece 12–24 meses después, y por eso un comité puede parecer quieto mientras una decisión anterior sigue abriéndose paso por la economía.",
          ko: "주택담보대출, 자동차 할부, 기업 대출까지 전반적으로 돈을 빌리는 비용이 올라갑니다. 가계는 덜 사고 기업은 덜 짓게 되어 물가를 밀어올리던 압력이 누그러집니다. 대가는 이중책무의 다른 한쪽에서 나옵니다. 대출이 비싸지면 채용도 줄어들기 때문에 실업률은 대개 올라갑니다. 게다가 이 모든 일은 한꺼번에 오지 않습니다. 효과의 대부분은 12~24개월 뒤에 나타나며, 그래서 위원회가 아무것도 하지 않는 것처럼 보이는 동안에도 이전 결정이 여전히 경제를 통과하고 있는 것입니다.",
          zh: "借钱的成本全面上升——房贷、车贷、企业信贷都变贵，于是家庭少买、企业少建，推高物价的压力随之缓解。代价落在双重使命的另一半上：贷款变贵也意味着招聘减少，失业率通常会往上走。而且这一切不会立刻到来。多数效果要 12–24 个月后才显现，所以委员会看起来按兵不动时，之前那次决定可能仍在经济中传导。",
          ja: "住宅ローン、自動車ローン、企業向け融資まで、借りるコストが一斉に上がります。家計は買い控え、企業は投資を抑えるため、物価を押し上げていた圧力はやわらぎます。代償はデュアルマンデートのもう一方に出ます。融資が高くつけば採用も減るので、失業率はたいてい上がります。しかもこれは一度に訪れません。効果の大半は12〜24か月後に表れるため、委員会が動いていないように見える間も、以前の決定がまだ経済の中を進んでいるのです。",
        },
      },
      {
        id: "cut",
        label: {
          en: "Cut the rate",
          es: "Bajar la tasa",
          ko: "금리 인하",
          zh: "降息",
          ja: "利下げする",
        },
        outcome: {
          en: "Cheaper credit adds demand to an economy that is already short of workers and short of goods. Spending rises faster than supply can follow it, so the likely result is inflation running hotter, not cooler. A committee that picked this in these conditions would be leaning hard on the employment half of the mandate and knowingly accepting more inflation to protect it — a defensible choice in some moments, but not a free one.",
          es: "El crédito más barato añade demanda a una economía a la que ya le faltan trabajadores y le faltan bienes. El gasto sube más rápido de lo que la oferta puede seguirlo, así que lo más probable es que la inflación se acelere en lugar de ceder. Un comité que eligiera esto en estas condiciones se estaría apoyando fuerte en la mitad del empleo del mandato y aceptando a sabiendas más inflación para protegerlo: una opción defendible en algunos momentos, pero nunca gratuita.",
          ko: "값싼 대출은 이미 일손도 물건도 부족한 경제에 수요를 더 얹습니다. 지출이 공급이 따라올 수 있는 속도보다 빨리 늘어나므로, 물가는 가라앉기보다 더 뜨거워질 가능성이 큽니다. 이런 상황에서 이 선택을 하는 위원회는 이중책무 중 고용 쪽에 크게 기대면서 그것을 지키려고 더 높은 물가를 감수하는 셈입니다. 어떤 국면에서는 충분히 변호할 수 있는 선택이지만, 공짜인 선택은 아닙니다.",
          zh: "更便宜的信贷，是在一个本来就缺人手、缺商品的经济里再加一份需求。支出上升的速度超过供给能跟上的速度，结果多半是通胀更热，而不是更凉。在这种情况下这样选的委员会，等于把重心押在使命中就业的那一半上，并且明知会换来更高的通胀。某些时刻这是站得住脚的选择，但绝不是免费的选择。",
          ja: "安い信用は、ただでさえ人手も物も足りない経済にさらに需要を積み増します。支出が供給の追いつく速さを超えて伸びるため、インフレは冷めるどころか強まる可能性が高くなります。この状況でこれを選ぶ委員会は、デュアルマンデートの雇用側に大きく寄りかかり、それを守るために高いインフレを承知で受け入れていることになります。局面によっては筋の通った選択ですが、代償のない選択ではありません。",
        },
      },
      {
        id: "hold",
        label: {
          en: "Hold steady",
          es: "Mantener",
          ko: "동결",
          zh: "按兵不动",
          ja: "据え置く",
        },
        outcome: {
          en: "Holding is a decision, not the absence of one. It leaves policy where it is and buys time to see how much of the last change has actually reached the economy — a real argument when the lag is 12–24 months and the previous move was recent. The risk sits on the other side: if high inflation keeps going, people start planning around it. Wages get negotiated and prices get set on the assumption it continues, and an expectation like that is harder to unwind than the original price increase was.",
          es: "Mantener es una decisión, no la ausencia de una. Deja la política donde está y da tiempo para ver cuánto del último cambio ha llegado de verdad a la economía: un argumento real cuando el rezago es de 12–24 meses y el movimiento anterior fue reciente. El riesgo está del otro lado: si la inflación alta se sostiene, la gente empieza a planificar contando con ella. Los salarios se negocian y los precios se fijan dando por hecho que sigue, y una expectativa así cuesta más de desarmar que la subida de precios original.",
          ko: "동결도 결정이지, 결정을 하지 않는 것이 아닙니다. 정책을 지금 자리에 두고, 지난번 변경이 실제로 경제에 얼마나 도달했는지 확인할 시간을 법니다. 시차가 12~24개월이고 직전 조치가 최근이었다면 이는 진지한 논거입니다. 위험은 반대편에 있습니다. 높은 물가가 계속되면 사람들이 그것을 전제로 계획을 세우기 시작합니다. 임금 협상과 가격 책정이 “계속 오를 것”이라는 가정 위에서 이뤄지고, 그렇게 자리 잡은 기대는 처음의 물가 상승보다 되돌리기가 더 어렵습니다.",
          zh: "按兵不动同样是一个决定，而不是没有决定。它把政策留在原处，换来时间去看上一次调整究竟有多少真正传导到了经济里——当时滞是 12–24 个月、上一步又刚落下时，这是个实在的理由。风险在另一边：如果高通胀持续下去，人们会开始照着它做打算。工资谈判和定价都以“还会继续涨”为前提，而这样形成的预期，比最初那轮涨价更难扭转。",
          ja: "据え置きもまた決定であり、決定しないことではありません。政策を今の位置に置いたまま、前回の変更がどれだけ実際に経済へ届いたかを見る時間を稼ぎます。時差が12〜24か月で直前の一手が最近なら、これは本物の論拠です。リスクは反対側にあります。高いインフレが続けば、人々はそれを前提に計画を立て始めます。賃金交渉も値付けも「この先も続く」という想定の上で行われ、そうして根づいた予想は、最初の物価上昇よりも巻き戻すのが難しくなります。",
        },
      },
    ],
  },
  {
    id: "contraction",
    lessonId: 35,
    situation: {
      en: "The picture flips. Output has been shrinking for two quarters, unemployment has climbed to 8%, inflation has fallen to 1%, and companies are shelving investment plans they had already budgeted for.",
      es: "El cuadro se invierte. La producción lleva dos trimestres cayendo, el desempleo ha subido a 8%, la inflación ha bajado a 1% y las empresas están archivando planes de inversión que ya tenían presupuestados.",
      ko: "상황이 뒤집힙니다. 생산이 두 분기 연속 줄었고, 실업률은 8%까지 올랐으며, 물가 상승률은 1%로 떨어졌습니다. 기업들은 이미 예산까지 잡아둔 투자 계획을 접고 있습니다.",
      zh: "画面反了过来。产出已经连续两个季度萎缩，失业率升到 8%，通胀降到 1%，企业正在把早已列入预算的投资计划搁置。",
      ja: "状況が反転します。生産は2四半期連続で縮小し、失業率は8%に上昇、インフレ率は1%まで低下し、企業はすでに予算化していた投資計画を棚上げしています。",
    },
    question: {
      en: "Same chair, a very different room. What do you do?",
      es: "La misma silla, una sala muy distinta. ¿Qué hace?",
      ko: "같은 의장석이지만 방 안의 공기는 완전히 다릅니다. 어떻게 하시겠습니까?",
      zh: "还是那个位子，房间里的气氛却完全不同。你怎么做？",
      ja: "同じ議長席、まるで違う空気。どうしますか。",
    },
    options: [
      {
        id: "cutToZero",
        label: {
          en: "Cut toward zero",
          es: "Bajar hacia cero",
          ko: "제로까지 인하",
          zh: "降息至接近零",
          ja: "ゼロに向けて下げる",
        },
        outcome: {
          en: "This is the conventional response, and it works the way the lesson describes: cheaper financing for a house, a car or a payroll supports hiring and investment — on the same 12–24 month lag, so it will not stop this quarter's job losses. Two limits are worth carrying forward. The dial stops at roughly zero, so a deep enough downturn exhausts it entirely, and that is exactly where the balance-sheet tools in the QE and QT lesson begin. And credit left cheap for long enough feeds the next expansion's inflation — the same tension, one turn of the cycle later.",
          es: "Es la respuesta convencional y funciona como describe la lección: financiar una casa, un auto o una nómina resulta más barato, lo que sostiene la contratación y la inversión, con el mismo rezago de 12–24 meses, así que no detendrá los despidos de este trimestre. Vale la pena llevarse dos límites. El dial se detiene cerca de cero, así que una recesión suficientemente profunda lo agota por completo, y justo ahí empiezan las herramientas de balance de la lección sobre QE y QT. Y el crédito barato mantenido el tiempo suficiente alimenta la inflación de la siguiente expansión: la misma tensión, una vuelta más del ciclo.",
          ko: "가장 일반적인 대응이며, 레슨이 설명한 그대로 작동합니다. 집, 자동차, 급여를 융통하는 비용이 싸지면서 채용과 투자를 떠받칩니다. 시차는 똑같이 12~24개월이라 이번 분기의 실직을 막아주지는 못합니다. 기억해둘 한계가 둘 있습니다. 다이얼은 대략 0에서 멈추기 때문에 충분히 깊은 침체는 이 수단을 완전히 소진시키며, 바로 거기서 QE와 QT 레슨의 대차대조표 수단이 시작됩니다. 그리고 값싼 신용을 오래 두면 다음 확장기의 물가 상승을 키웁니다. 같은 긴장이 사이클 한 바퀴 뒤에 다시 나타나는 것입니다.",
          zh: "这是常规做法，运作方式和课文说的一样：买房、买车、发工资的融资成本下降，支撑招聘和投资——时滞同样是 12–24 个月，所以它挡不住这个季度的裁员。有两个限制值得记住。旋钮大致到零就停了，足够深的衰退会把它彻底用尽，而那正是 QE 与 QT 那一课里资产负债表工具登场的地方。另外，信贷便宜得太久，会为下一轮扩张的通胀埋下伏笔——同一种张力，只是晚了一个周期。",
          ja: "これが標準的な対応で、レッスンの説明どおりに働きます。住宅、自動車、給与の資金繰りが安くなり、採用と投資を支えます。時差は同じく12〜24か月なので、今四半期の雇用喪失は止められません。持ち帰るべき限界が二つあります。ダイヤルはおよそゼロで止まるため、十分に深い不況はこの手段を使い切ってしまい、まさにそこからQEとQTのレッスンで扱うバランスシート手段が始まります。そして安い信用を長く置きすぎると、次の拡大局面のインフレを育てます。同じ緊張が、サイクルを一周して戻ってくるのです。",
        },
      },
      {
        id: "hike",
        label: {
          en: "Raise the rate",
          es: "Subir la tasa",
          ko: "금리 인상",
          zh: "加息",
          ja: "利上げする",
        },
        outcome: {
          en: "This tightens conditions into a downturn. Borrowing gets dearer exactly when firms are already cancelling projects, so unemployment climbs further and inflation — already at 1%, below the roughly 2% target — falls further away from it. Both halves of the mandate move the wrong way at once, which is what makes this the clearest illustration in the whole exercise of what the dial actually does. Central banks have tightened into weakness before, but for reasons outside the dual mandate: defending a currency that is collapsing, for instance.",
          es: "Esto endurece las condiciones dentro de una recesión. El crédito se encarece justo cuando las empresas ya están cancelando proyectos, así que el desempleo sube más y la inflación — ya en 1%, por debajo del objetivo de alrededor de 2% — se aleja todavía más. Las dos mitades del mandato se mueven en la dirección equivocada a la vez, y por eso esta es la ilustración más clara de todo el ejercicio sobre lo que hace el dial. Ha habido bancos centrales que endurecieron en plena debilidad, pero por razones ajenas al mandato dual: defender una moneda que se desploma, por ejemplo.",
          ko: "침체 속에서 여건을 더 조이는 선택입니다. 기업들이 이미 프로젝트를 취소하고 있는 바로 그 시점에 대출이 비싸지므로 실업률은 더 오르고, 이미 목표치인 약 2%를 밑도는 1%의 물가 상승률은 목표에서 더 멀어집니다. 이중책무의 두 축이 동시에 잘못된 방향으로 움직이며, 그래서 이 선택은 다이얼이 실제로 무슨 일을 하는지 이 연습 전체에서 가장 선명하게 보여줍니다. 중앙은행이 약세 국면에서 긴축한 사례가 없지는 않지만, 그것은 무너지는 통화를 방어하는 것처럼 이중책무 바깥의 이유 때문이었습니다.",
          zh: "这是在衰退中继续收紧。企业已经在砍项目，借钱却更贵了，于是失业率进一步上升，而本就只有 1%、低于约 2% 目标的通胀，离目标更远。使命的两半同时朝错误方向移动——正因如此，这是整个练习中关于旋钮到底在做什么的最清楚示范。央行确实曾在经济疲弱时收紧，但那是出于双重使命之外的理由，比如捍卫一种正在崩塌的货币。",
          ja: "これは不況のさなかに条件をさらに引き締める選択です。企業がすでに計画を取り消しているまさにその時に借入が高くつくため、失業率はさらに上がり、目標のおよそ2%を下回る1%のインフレ率は目標からいっそう遠ざかります。デュアルマンデートの両輪が同時に誤った方向へ動く——だからこそ、ダイヤルが実際に何をしているのかを、この演習の中で最もはっきり示す選択でもあります。中央銀行が弱さの中で引き締めた例はありますが、それは崩れゆく通貨を守るといった、デュアルマンデートの外側にある理由からでした。",
        },
      },
      {
        id: "qt",
        label: {
          en: "Start QT",
          es: "Iniciar QT",
          ko: "QT 시작",
          zh: "启动 QT",
          ja: "QTを始める",
        },
        outcome: {
          en: "QT is tightening by a different route. Selling bonds, or simply letting them mature without replacing them, drains money out of the system and pushes longer-term rates up on top of whatever the policy rate is doing — so in the situation described it pulls the same direction as a rate rise, and against what the economy needs. QT is normally the exit from a previous round of QE, run when the economy is strong enough to take it back; the QE and QT lesson covers both ends of that cycle.",
          es: "QT es endurecer por otra vía. Vender bonos, o simplemente dejar que venzan sin reemplazarlos, drena dinero del sistema y empuja hacia arriba las tasas de más largo plazo, además de lo que esté haciendo la tasa de política — así que en la situación descrita tira en la misma dirección que una subida de tasas, y en contra de lo que la economía necesita. El QT suele ser la salida de una ronda previa de QE, y se aplica cuando la economía está lo bastante fuerte para soportar la retirada; la lección sobre QE y QT cubre los dos extremos de ese ciclo.",
          ko: "QT는 다른 경로로 조이는 것입니다. 채권을 팔거나 만기가 와도 재투자하지 않으면 시스템에서 돈이 빠져나가고, 정책금리가 무엇을 하든 그 위에 장기금리를 밀어 올립니다. 그래서 지금 묘사된 상황에서는 금리 인상과 같은 방향으로, 즉 경제가 필요로 하는 것과 반대 방향으로 작용합니다. QT는 보통 앞선 QE의 출구이며, 경제가 그 회수를 감당할 만큼 튼튼할 때 시행합니다. QE와 QT 레슨이 이 사이클의 양쪽 끝을 함께 다룹니다.",
          zh: "QT 是从另一条路收紧。卖出债券，或者仅仅让它们到期而不再买入，都会把钱从体系里抽走，并在政策利率之外把长期利率往上推——所以在上面描述的情形里，它和加息同向发力，正好逆着经济的需要。QT 通常是上一轮 QE 的退出，在经济强到能承受回收时才启动；QE 与 QT 那一课把这个循环的两端讲在一起。",
          ja: "QTは別の経路からの引き締めです。債券を売る、あるいは満期が来ても買い替えないだけで、システムからお金が抜けていき、政策金利が何をしていようとその上に長期金利を押し上げます。したがってここで描かれた状況では、利上げと同じ方向に、つまり経済が必要としているものと逆向きに働きます。QTは通常、前回のQEからの出口であり、経済がその回収に耐えられるほど強いときに実施されます。QEとQTのレッスンが、この循環の両端をあわせて扱っています。",
        },
      },
    ],
  },
];

// One lookup, so the reader doesn't filter the array on every render.
const BY_LESSON = policyScenarios.reduce((acc, scenario) => {
  (acc[scenario.lessonId] ||= []).push(scenario);
  return acc;
}, {});

export function scenariosForLesson(lessonId) {
  return BY_LESSON[lessonId] || [];
}
