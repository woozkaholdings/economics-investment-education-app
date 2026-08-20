// ═══════════════════════════════════════════════════════════════════════════
// LESSON CONTENT — economy track, Spanish (es)
//
// One track, one language. Split this way 2026-08-17 (backlog item 45): the
// previous per-track files carried all five languages together, so
// lessonContent.money.js shipped 480 kB of body text to every reader while
// any one reader could read only their own ~97 kB of it. Four fifths of the
// largest asset in the app was text nobody on that device would ever see,
// and the chunk sat under Vite's 500 kB warning by less than a kilobyte.
//
// LessonReader.jsx dynamically import()s exactly one of these ten files —
// the open lesson's track, in the reader's active language.
//
// Fields are plain strings here, not { en, es, ... } maps. The language is
// the file. lessonContent.js re-assembles the language-map shape for the two
// node-only consumers that need every language at once (check-data.mjs's
// parity checks and translation-review.mjs's coverage hashes); nothing in
// the browser bundle imports that merged view.
//
// Generated mechanically from the pre-split files, byte-for-byte — see that
// commit for the equality proof. Edit this file directly from now on; it is
// source, not a build artifact, and there is no generator to re-run.
// ═══════════════════════════════════════════════════════════════════════════

export const lessonContent = {
  "29": {
    "sections": [
      {
        "heading": "¿Qué es una Transacción?",
        "body": "Una economía es simplemente la suma de todas las transacciones. Cada transacción es un comprador intercambiando dinero o crédito con un vendedor por bienes, servicios o activos financieros.\n\nEl crédito se gasta igual que el dinero. Gasto Total = Dinero + Crédito.\n\nEl gasto total impulsa la economía."
      },
      {
        "heading": "Mercados y la Economía",
        "body": "Un mercado son todos los compradores y vendedores haciendo transacciones por lo mismo. Una economía consiste en todas las transacciones en todos los mercados.\n\nEl gobierno es el mayor comprador y vendedor, con dos partes:\n• Gobierno Central — recauda impuestos, gasta\n• Banco Central — controla dinero y crédito"
      }
    ],
    "takeaway": "Si entendemos las transacciones, entendemos toda la economía.",
    "thinkAbout": "Piensa en tu última compra. Intercambiaste dinero por algo. Esa transacción se convirtió en el ingreso de alguien más."
  },
  "30": {
    "sections": [
      {
        "heading": "Cómo Funciona el Crédito",
        "body": "Los prestamistas quieren más dinero. Los prestatarios quieren comprar algo que no pueden pagar ahora.\n\nCuando los prestatarios prometen pagar y los prestamistas les creen, ¡el crédito se crea de la nada!\n\nTasas altas → menos préstamos\nTasas bajas → más préstamos"
      },
      {
        "heading": "Crédito vs Dinero",
        "body": "El dinero cierra transacciones inmediatamente. El crédito es como una cuenta de bar — prometes pagar después.\n\nLa realidad: la mayoría del \"dinero\" es crédito. En EE.UU., el crédito total supera muchas veces la oferta de dinero base, una brecha que ha crecido con el tiempo."
      },
      {
        "heading": "La Cadena de Gasto",
        "body": "¿Por qué importa el crédito? Porque cuando gastas más, alguien gana más.\n\nMás gasto → más ingreso → más crédito → más préstamos → más gasto. Este patrón auto-reforzante crea los ciclos económicos."
      }
    ],
    "takeaway": "El crédito crea ciclos auto-reforzantes en AMBAS direcciones — auges Y caídas.",
    "thinkAbout": "Si pides prestado $10,000 y los gastas, eso se convierte en ingreso de alguien. ¿Ves cómo el crédito crea crecimiento?"
  },
  "31": {
    "sections": [
      {
        "heading": "Productividad vs Crédito",
        "body": "La productividad importa más a largo plazo, pero el crédito importa más a corto plazo.\n\nLa productividad crece de forma estable. El crédito fluctúa salvajemente, creando ciclos."
      },
      {
        "heading": "Deuda Buena vs Deuda Mala",
        "body": "El crédito no es necesariamente malo. Depende de cómo se use:\n\nMALO: Pedir prestado para un TV grande.\nBUENO: Pedir prestado para un tractor que te ayude a ganar más."
      }
    ],
    "takeaway": "Pedir prestado es adelantar gasto de tu futuro. Cada vez que pides prestado, creas un ciclo.",
    "thinkAbout": "Si pides prestado de tu futuro, DEBE haber un momento en que gastes menos."
  },
  "32": {
    "sections": [
      {
        "heading": "Fase de Expansión",
        "body": "La actividad económica aumenta. El gasto sube, los precios suben. El banco central sube tasas para controlar la inflación."
      },
      {
        "heading": "Contracción y Recesión",
        "body": "Tasas más altas → menos préstamos → menos gasto → menos ingresos → recesión.\n\nSi es grave, el banco central baja tasas. Tasas bajas → más gasto → otra expansión. El ciclo se repite cada 5-8 años."
      },
      {
        "heading": "Por Qué Este Arreglo Tiene un Límite",
        "body": "Este arreglo depende de que el banco central tenga margen para bajar tasas. Cada ciclo corto se resuelve con un recorte — pero si cada pico acumula más deuda que el anterior, ese margen se reduce con el tiempo.\n\nEventualmente las tasas se acercan a cero y el recorte ya no basta (como en la lección “QE y QT”, que llevó a la compra directa de bonos).\n\nEsta es la diferencia entre el ciclo corto — resuelto con un recorte de tasas cada 5-8 años — y el ciclo largo, que aparece cuando décadas de estos ciclos acumulan una deuda que un simple recorte ya no puede arreglar."
      }
    ],
    "takeaway": "La economía funciona como una máquina. Crédito fácil → expansión. Crédito restringido → recesión.",
    "thinkAbout": "Nota cómo cada ciclo termina con MÁS deuda que el anterior. ¿Qué pasa cuando esto se acumula durante décadas?"
  },
  "33": {
    "sections": [
      {
        "heading": "Cómo se Acumula la Deuda",
        "body": "A lo largo de muchos ciclos cortos, la deuda crece más rápido que los ingresos. La gente prefiere gastar que pagar deuda.\n\nCuando la gente pide mucho prestado para comprar activos como inversión, eso es una burbuja."
      },
      {
        "heading": "El Pico y Desapalancamiento",
        "body": "Eventualmente, los pagos de deuda crecen más rápido que los ingresos. Esto pasó en EE.UU. en 2008, Japón en 1989 y EE.UU. en 1929.\n\nEn un desapalancamiento, las tasas de interés no pueden salvar la situación, porque en este punto suelen estar ya cerca del 0%."
      },
      {
        "heading": "Por Qué Es Difícil Verlo Desde Dentro",
        "body": "Los ciclos cortos se repiten cada 5-8 años, así que la mayoría los recuerda. El ciclo largo dura 75-100 años — casi nadie vivo recuerda el último pico (1929). La generación que vivió la Depresión aprendió cautela de primera mano, pero esa generación ya no está, y la lección no se transmite igual solo leyéndola. Por eso 'esta vez es diferente' se repite justo antes de cada pico — no por tontería, sino porque no queda memoria viva para comprobarlo."
      }
    ],
    "takeaway": "El ciclo largo se construye en 75-100 años. Cuando alcanza su pico, los recortes de tasas normales no funcionan.",
    "thinkAbout": "La ratio deuda/PIB de EE.UU. ha superado el 100% en las últimas décadas. ¿Suena como la etapa tardía de un ciclo largo?"
  },
  "34": {
    "sections": [
      {
        "heading": "Las 4 Formas de Reducir la Carga de Deuda",
        "body": "1. RECORTAR GASTO (Austeridad)\n2. REDUCIR DEUDAS (Impagos)\n3. REDISTRIBUIR RIQUEZA (Impuestos)\n4. IMPRIMIR DINERO (QE)"
      },
      {
        "heading": "Desapalancamiento Hermoso vs Feo",
        "body": "La clave es el EQUILIBRIO. Un desapalancamiento hermoso equilibra las 4 herramientas. La recuperación tarda aproximadamente una década."
      },
      {
        "heading": "Por Qué la Herramienta #4 No Está Disponible para Todos",
        "body": "Los 4 herramientas asumen que la deuda está en la moneda propia del banco central. Si la deuda está en moneda extranjera, no se puede imprimir para pagarla — solo quedan la austeridad y el impago. Esto explica por qué las crisis de deuda de los 1980 en América Latina (deuda en dólares) terminaron en impago, mientras Japón, con deuda casi toda en yenes, ha podido usar la herramienta 4 durante décadas sin impago."
      }
    ],
    "takeaway": "Los ingresos deben crecer más rápido que la deuda. Imprimir suficiente pero no demasiado. El equilibrio es todo.",
    "thinkAbout": "Si imprimir dinero compensa el crédito que desaparece, el gasto total se mantiene. ¿Cambia eso tu perspectiva?"
  },
  "35": {
    "sections": [
      {
        "heading": "La Tasa de Fondos Federales",
        "body": "La tasa de fondos federales influye en TODAS las demás tasas.\n\nSubir tasas → frena la economía\nBajar tasas → estimula la economía\n\nLa política funciona con retraso de 12-24 meses."
      },
      {
        "heading": "Cómo las Tasas Afectan Todo",
        "body": "Tasas SUBEN: acciones bajan, bonos bajan, inmuebles se frenan.\nTasas BAJAN: acciones suben, bonos suben, inmuebles se recuperan.\n\nRegla de oro: \"No luches contra el Fed.\""
      },
      {
        "heading": "El Doble Mandato del Fed: Dos Objetivos Que Pueden Chocar",
        "body": "El Fed tiene un doble mandato: precios estables (~2% de inflación, el mismo objetivo de la lección “Leyendo Indicadores Económicos”) y máximo empleo. Ambos objetivos suelen coincidir, pero a veces chocan — subir tasas frena la inflación pero también el empleo; bajar tasas protege empleos pero puede recalentar la inflación. No hay fórmula que resuelva esto: es una decisión de juicio que el comité de política del Fed toma reunión a reunión."
      }
    ],
    "takeaway": "Los cambios de tasas son la herramienta principal del Fed. Cuando llegan a 0%, necesita herramientas no convencionales — QE.",
    "thinkAbout": "El Fed subió tasas a 5.25-5.50% en 2022-23. La política tarda 12-24 meses en manifestarse del todo — busca la tasa actual del Fed. ¿Cuánto de ese efecto crees que ya se ha sentido?"
  },
  "36": {
    "sections": [
      {
        "heading": "¿Qué es la Curva?",
        "body": "Un gráfico de tasas de interés de bonos a diferentes plazos.\n\nNormal = saludable. Invertida = peligro — cada recesión de EE.UU. desde 1955 estuvo precedida por una inversión, aunque no toda inversión ha sido seguida de recesión."
      },
      {
        "heading": "Por Qué Funciona la Señal — y Dónde Puede Engañar",
        "body": "El mecanismo es de expectativas, no magia. El rendimiento a largo plazo refleja dónde el mercado espera que estén las tasas de corto plazo, en promedio, durante ese período. El diferencial más citado es '2s10s' (2 años menos 10 años) — se invirtió a mediados de 2022 y se mantuvo invertido casi dos años, el período más largo registrado, antes de volver a positivo en 2024, mucho después del plazo 'típico' de 12-18 meses. La señal indica que una desaceleración es más probable, no cuándo ni qué tan severa será: en 1966 una inversión precedió una fuerte desaceleración sin llegar a ser recesión oficial."
      },
      {
        "heading": "La Prima por Plazo: Por Qué los Rendimientos No Son Solo Expectativas de Tasas",
        "body": "El rendimiento a largo plazo no es solo la expectativa de tasas — también incluye una 'prima por plazo': compensación extra por el riesgo de inmovilizar dinero más tiempo (inflación inesperada, volatilidad de precio). La prima por plazo ha bajado desde los años 80 y a veces se vuelve negativa, lo que puede empujar la curva hacia la inversión incluso sin un gran recorte de tasas esperado — una razón más por la que la señal no es infalible."
      }
    ],
    "takeaway": "Cuando la curva se invierte, presta atención. El mercado de bonos grita que vienen recortes.",
    "thinkAbout": "La curva se invirtió en 2022. El patrón dice recesión en 12-18 meses. ¿Será diferente esta vez?"
  },
  "37": {
    "sections": [
      {
        "heading": "Flexibilización Cuantitativa (QE)",
        "body": "Cuando las tasas llegan a 0%, el banco central imprime dinero electrónicamente y compra bonos.\n\nEl balance del Fed creció de ~$900B antes de 2008 a ~$9T pico en 2022."
      },
      {
        "heading": "Ajuste Cuantitativo (QT)",
        "body": "Lo opuesto al QE. El Fed reduce su balance dejando que los bonos venzan sin reinvertir.\n\nFunciona a $95B/mes desde 2022, con el ritmo reducido en 2024 mientras el balance baja desde su pico de $9T."
      },
      {
        "heading": "Del Mercado de Bonos a tu Tasa Hipotecaria",
        "body": "Un bono del Tesoro a 10 años fija el precio de las hipotecas a 30 años, así que cuando el QE baja ese rendimiento, las hipotecas también bajan — igual con los bonos corporativos. Además, al caer los rendimientos, los inversores rotan hacia acciones, elevando su valor: un 'efecto riqueza' que hace gastar más a quienes ya poseen activos. Ninguno de los dos canales llega por igual a todos."
      }
    ],
    "takeaway": "QE inyecta dinero. QT drena dinero. El balance del Fed es el marcador.",
    "thinkAbout": "El Fed imprimió $2T+ en 2008 e ilimitado en 2020. ¿Quién se beneficia más? Los que poseen activos financieros."
  },
  "38": {
    "sections": [
      {
        "heading": "Expansión y Pico",
        "body": "EXPANSIÓN: El crédito fluye. PIB sube, empleo crece. Históricamente favorecidas en esta fase: acciones de crecimiento.\n\nPICO: Producción máxima. Inflación alta, Fed subiendo tasas."
      },
      {
        "heading": "Contracción y Valle",
        "body": "CONTRACCIÓN: Crédito se contrae, desempleo sube, Fed recorta tasas.\n\nVALLE: Máximo pesimismo, pero históricamente aquí han comenzado los rebotes más fuertes. S&P 500: +38-50% el primer año después del fondo."
      },
      {
        "heading": "Por Qué Estos Activos, en Esta Fase",
        "body": "Estos patrones no son aleatorios — vienen del mismo mecanismo de tasas de la lección “Tasas de Interés”. En Expansión, el dinero barato impulsa más a las acciones de crecimiento. En el Pico, ese mecanismo se invierte: las acciones de valor y bonos de corto plazo resisten mejor. En Contracción, el dinero busca refugio en bonos del Tesoro y oro. En el Valle, los precios ya cayeron tanto que hasta una pequeña mejora los hace ver baratos."
      }
    ],
    "takeaway": "Las grandes fortunas se hicieron comprando cuando otros entraban en pánico. El ciclo SIEMPRE gira.",
    "thinkAbout": "Warren Buffett dice \"Ten miedo cuando otros son codiciosos, y sé codicioso cuando otros tienen miedo.\""
  },
  "39": {
    "sections": [
      {
        "heading": "Indicadores Clave",
        "body": "PIB, IPC, PMI, VIX, Spreads de Crédito — los indicadores clave para leer el estado de la economía."
      },
      {
        "heading": "De Indicadores a un Diagnóstico: Cómo Encajan con Cada Fase",
        "body": "Cada fase tiene una firma típica de indicadores: en Expansión todos apuntan igual (PIB subiendo, PMI >50, VIX bajo, spreads estrechos); en Pico empiezan a discrepar (PIB desacelera, PMI ronda 50, VIX y spreads suben) — eso es la señal. En Contracción todos se alinean a la baja; en Valle los indicadores líderes (PMI, VIX, spreads) giran antes que el PIB, que siempre confirma tarde."
      }
    ],
    "takeaway": "Ningún indicador cuenta toda la historia. Observa múltiples indicadores juntos.",
    "thinkAbout": "Imagina una economía donde: el PIB crece pero se desacelera, la inflación supera el objetivo, el banco central está dividido sobre la dirección de las tasas, y los aranceles empujan los costos a un máximo de varias generaciones. ¿En qué fase crees que está?"
  },
  "40": {
    "sections": [
      {
        "heading": "Las Tres Reglas",
        "body": "REGLA 1: No dejes que la deuda crezca más rápido que los ingresos.\nREGLA 2: No dejes que los ingresos crezcan más rápido que la productividad.\nREGLA 3: Haz todo lo posible por aumentar tu productividad."
      },
      {
        "heading": "Uniéndolo Todo",
        "body": "Ahora tienes la plantilla: superponer el ciclo corto sobre el largo sobre la línea de productividad te da un mapa para entender la economía."
      }
    ],
    "takeaway": "La economía es una máquina. Transacciones, crédito y naturaleza humana la impulsan.",
    "thinkAbout": "Ahora entiendes más sobre economía que la mayoría. ¿Cómo aplicarás estas reglas a tus decisiones financieras?"
  }
};
