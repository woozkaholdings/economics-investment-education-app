import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// ECONOMIC CYCLES v5 — Step-by-Step Lessons + Bottom Tabs
// Inspired by principles popularized by economists and investors
// ═══════════════════════════════════════════════════════════════

import { TR } from "./src/locales/index.js";
import { lessons } from "./src/content/lessons.js";

const langFlags = { en: "🇺🇸", es: "🇪🇸", ko: "🇰🇷", zh: "🇨🇳", ja: "🇯🇵" };
const langNames = { en: "English", es: "Español", ko: "한국어", zh: "中文", ja: "日本語" };

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
