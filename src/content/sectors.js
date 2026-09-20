// ═══════════════════════════════════════════════════════════════════════════
// SECTORS
//
// The eleven S&P sectors, identified by their SPDR Select Sector ETF — the
// conventional proxy for sector performance — plus the benchmark everything is
// measured against.
//
// Tickers live here, but note the app never *shows* a ticker as a headline:
// this is a financial-literacy product for beginners through adults, and
// "Technology" is the useful label while "XLK" is an implementation detail.
// The plain-language `what` line matters more than the symbol.
//
// ⚠️ The `what` line must name where the sector's WEIGHT actually is, not the
// industries that come to mind first. Checked 2026-09-20 against each fund's
// published Fund Industry Allocation (sectorspdrs.com, as of 17-Sep-2026) and
// its daily holdings file; 8 of 11 already named their largest industry and were
// left alone. The four that did not were corrected that day:
//   XLI  named Airlines (2.01% - the SMALLEST industry in the sector) and not
//        aerospace and defense (24.98% - the largest). "builders" also went: the
//        four big US homebuilders (DHI, LEN, PHM, NVR) are all in XLY, not here.
//   XLY  omitted retail entirely - Broadline 26.06% + Specialty 20.10% is more
//        of the sector than cars and restaurants put together.
//   XLF  omitted Capital Markets (25.53%).
//   XLP  omitted Beverages (20.49%).
// These weights drift. Re-measure before trusting them; do not retype them.
// ═══════════════════════════════════════════════════════════════════════════

export const BENCHMARK = { symbol: "SPY", name: "S&P 500" };

export const sectors = [
  {
    symbol: "XLK",
    name: { en: "Technology", es: "Tecnología", ko: "기술", zh: "科技", ja: "テクノロジー" },
    what: {
      en: "Software, chips and computers.",
      es: "Software, chips y computadoras.",
      ko: "소프트웨어, 반도체, 컴퓨터.",
      zh: "软件、芯片和电脑。",
      ja: "ソフトウェア、半導体、コンピューター。",
    },
  },
  {
    symbol: "XLF",
    name: { en: "Financials", es: "Finanzas", ko: "금융", zh: "金融", ja: "金融" },
    what: {
      en: "Banks, insurers, investment firms and payment companies.",
      es: "Bancos, aseguradoras, firmas de inversión y empresas de pagos.",
      ko: "은행, 보험사, 투자회사, 결제 회사.",
      zh: "银行、保险、投资公司和支付公司。",
      ja: "銀行、保険、投資会社、決済会社。",
    },
  },
  {
    symbol: "XLV",
    name: { en: "Health Care", es: "Salud", ko: "헬스케어", zh: "医疗保健", ja: "ヘルスケア" },
    what: {
      en: "Drugmakers, hospitals and medical devices.",
      es: "Farmacéuticas, hospitales y equipos médicos.",
      ko: "제약사, 병원, 의료기기.",
      zh: "制药、医院和医疗器械。",
      ja: "製薬、病院、医療機器。",
    },
  },
  {
    symbol: "XLY",
    name: { en: "Consumer Discretionary", es: "Consumo Discrecional", ko: "임의소비재", zh: "非必需消费", ja: "一般消費財" },
    what: {
      en: "Things people buy when they feel well off — shopping, cars, restaurants and travel.",
      es: "Lo que la gente compra cuando le va bien: compras, autos, restaurantes y viajes.",
      ko: "여유가 있을 때 사는 것들 — 쇼핑, 자동차, 외식, 여행.",
      zh: "手头宽裕时才买的东西——购物、汽车、餐饮和旅行。",
      ja: "余裕があるときに買うもの — 買い物、車、外食、旅行。",
    },
  },
  {
    symbol: "XLP",
    name: { en: "Consumer Staples", es: "Consumo Básico", ko: "필수소비재", zh: "必需消费", ja: "生活必需品" },
    what: {
      en: "Things people buy no matter what — food, drinks, soap, toothpaste.",
      es: "Lo que la gente compra pase lo que pase: comida, bebidas, jabón, pasta de dientes.",
      ko: "형편과 상관없이 사는 것들 — 식품, 음료, 비누, 치약.",
      zh: "无论如何都要买的东西——食品、饮料、肥皂、牙膏。",
      ja: "何があっても買うもの — 食品、飲料、石けん、歯みがき。",
    },
  },
  {
    symbol: "XLE",
    name: { en: "Energy", es: "Energía", ko: "에너지", zh: "能源", ja: "エネルギー" },
    what: {
      en: "Oil and gas producers and refiners.",
      es: "Productores y refinadores de petróleo y gas.",
      ko: "석유·가스 생산 및 정제.",
      zh: "石油和天然气生产与炼化。",
      ja: "石油・ガスの生産と精製。",
    },
  },
  {
    symbol: "XLI",
    name: { en: "Industrials", es: "Industriales", ko: "산업재", zh: "工业", ja: "資本財" },
    what: {
      en: "Aircraft, defense, machinery and railroads.",
      es: "Aviones, defensa, maquinaria y ferrocarriles.",
      ko: "항공기, 방위산업, 기계, 철도.",
      zh: "飞机、国防、机械和铁路。",
      ja: "航空機、防衛、機械、鉄道。",
    },
  },
  {
    symbol: "XLB",
    name: { en: "Materials", es: "Materiales", ko: "소재", zh: "原材料", ja: "素材" },
    what: {
      en: "Chemicals, metals, mining and packaging.",
      es: "Químicos, metales, minería y envases.",
      ko: "화학, 금속, 광업, 포장재.",
      zh: "化工、金属、采矿和包装。",
      ja: "化学、金属、鉱業、包装。",
    },
  },
  {
    symbol: "XLRE",
    name: { en: "Real Estate", es: "Bienes Raíces", ko: "부동산", zh: "房地产", ja: "不動産" },
    what: {
      en: "Property owners and landlords, mostly via REITs.",
      es: "Propietarios y arrendadores, sobre todo mediante REITs.",
      ko: "부동산 보유·임대, 주로 리츠(REIT).",
      zh: "物业持有与出租，主要通过REITs。",
      ja: "不動産の保有・賃貸、主にREIT。",
    },
  },
  {
    symbol: "XLU",
    name: { en: "Utilities", es: "Servicios Públicos", ko: "유틸리티", zh: "公用事业", ja: "公益事業" },
    what: {
      en: "Electricity, gas and water companies.",
      es: "Empresas de electricidad, gas y agua.",
      ko: "전기, 가스, 수도 회사.",
      zh: "电力、燃气和水务公司。",
      ja: "電力、ガス、水道の会社。",
    },
  },
  {
    symbol: "XLC",
    name: { en: "Communication Services", es: "Servicios de Comunicación", ko: "커뮤니케이션", zh: "通信服务", ja: "通信サービス" },
    what: {
      en: "Telecom, media, streaming and social platforms.",
      es: "Telecomunicaciones, medios, streaming y redes sociales.",
      ko: "통신, 미디어, 스트리밍, 소셜 플랫폼.",
      zh: "电信、媒体、流媒体和社交平台。",
      ja: "通信、メディア、配信、SNS。",
    },
  },
];

export const SECTOR_SYMBOLS = sectors.map((s) => s.symbol);
