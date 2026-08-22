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
        "body": "Piensa en el último café que compraste. Entregaste dinero —o acercaste una tarjeta al lector— y recibiste una taza de café a cambio. Eso es una transacción: un comprador que intercambia dinero o crédito con un vendedor por algo de valor. Si te alejas y miras el conjunto, una economía entera no es nada más misterioso que millones de intercambios como ese ocurriendo a la vez: alguien comprando la despensa, una empresa comprando sillas de oficina, una ciudad comprando asfalto para repavimentar una calle.\n\nAquí está la parte que confunde a mucha gente: no necesitabas efectivo para ese café. Si pagas con tarjeta de crédito, lo compraste igual; simplemente pagaste con crédito en lugar de dinero, y el empleador del barista cobró exactamente igual. Por eso el crédito se gasta igual que el dinero: Gasto Total = Dinero Gastado + Crédito Gastado.\n\nEl gasto total es lo que impulsa toda la economía, y de él salen los precios de una forma sencilla, casi mecánica: divide la cantidad total gastada en algo entre la cantidad que se vendió. Si los compradores gastan $500 en 100 barras de pan en la misma panadería, el precio por barra es de $5. Eso es todo: eso es una transacción, repetida miles de millones de veces al día, hasta sumar una economía entera."
      },
      {
        "heading": "Mercados y la Economía",
        "body": "Un mercado es sencillamente el conjunto de todos los compradores y vendedores que negocian lo mismo: quienes compran y venden trigo forman el mercado del trigo; quienes negocian las acciones de una empresa forman el mercado de esa acción. Junta todos los mercados —alimentos, autos, viviendas, acciones, trabajo, todo— y tienes la economía completa.\n\nLos hogares, las empresas y los bancos participan en ella, pero el mayor comprador y vendedor de todos es el gobierno, que cumple dos papeles muy distintos:\n\n• Gobierno Central — recauda impuestos y decide cómo gastarlos, en cosas como carreteras, escuelas y defensa\n• Banco Central — no cobra impuestos ni gasta directamente. En cambio, controla el dinero y el crédito, sobre todo fijando las tasas de interés y, en situaciones extremas, creando dinero nuevo"
      }
    ],
    "takeaway": "Si logras entender una sola transacción —un comprador, un vendedor, dinero o crédito cambiando de manos— ya tienes la semilla de toda la economía. Todo lo que viene en este curso es esa misma idea, repetida a una escala cada vez mayor.",
    "thinkAbout": "Piensa en lo último que compraste, aunque sea algo pequeño como un refrigerio. Intercambiaste dinero o crédito por ello, y ese pago se convirtió en el ingreso de otra persona: el sueldo del cajero, los ingresos de la tienda, el proveedor que surtió el estante. ¿Puedes seguir el rastro de a dónde fue tu dinero después?"
  },
  "30": {
    "sections": [
      {
        "heading": "Cómo Funciona el Crédito",
        "body": "Supongamos que quieres comprar un auto de $20,000 pero solo tienes $5,000 ahorrados. Un prestamista —un banco, una cooperativa de crédito o el propio concesionario— te ofrece un préstamo: te entrega $15,000 ahora, y tú prometes devolverlos con el tiempo, más los intereses como pago por el riesgo que asumen.\n\nEn el momento en que firmas esa promesa, y el prestamista cree que la vas a cumplir, se crean de la nada $15,000 de crédito totalmente nuevo: nadie tuvo que ahorrarlos antes. Tú te llevas el auto; el prestamista pasa a tener un activo (le debes dinero) y tú pasas a tener un pasivo (se lo debes).\n\nLas tasas de interés determinan qué tan cara es esa promesa. Cuando las tasas son altas → pedir prestado cuesta más → menos gente pide préstamos. Cuando las tasas son bajas → pedir prestado es barato → más gente lo hace. Esa es exactamente la palanca que usa la Reserva Federal para acelerar o frenar toda la economía (más sobre esto en “Tasas de Interés”)."
      },
      {
        "heading": "Crédito vs Dinero",
        "body": "El dinero liquida una transacción en el acto. Le das $8 en efectivo al barman por una cerveza y el trato queda cerrado por completo: nadie le debe nada a nadie.\n\nEl crédito funciona distinto. Es como abrir una cuenta en ese mismo bar: bebes ahora y prometes pagar cuando cierres la cuenta más tarde. En el momento en que el barman acepta abrirte esa cuenta, acaban de crearse de la nada un activo y un pasivo —al bar le deben dinero, tú le debes dinero al bar— aunque todavía no haya cambiado de manos ni un billete.\n\nAhora multiplica esa cuenta del bar por cada hipoteca, cada préstamo de auto, cada saldo de tarjeta de crédito y cada préstamo empresarial del país, y llegas a una realidad sorprendente: la mayor parte de lo que la gente llama despreocupadamente \"dinero\" es en realidad crédito. En EE.UU., el crédito total pendiente es muchas veces mayor que la oferta de dinero base, una brecha que solo se ha ampliado con el tiempo a medida que la economía ha crecido."
      },
      {
        "heading": "La Cadena de Gasto",
        "body": "¿Por qué importa tanto el crédito? Porque pedir prestado permite gastar más de lo que el ingreso por sí solo permitiría, y el gasto de una persona siempre es el ingreso de otra.\n\nSupongamos que un propietario pide prestado para renovar su cocina. Ese dinero se convierte en el ingreso del contratista. El contratista, que ahora gana más, le parece más solvente a un prestamista y pide prestado para comprar una nueva camioneta de trabajo. Esa compra se convierte en el ingreso del vendedor de camionetas, y la cadena sigue.\n\nMás gasto → más ingreso → prestatarios más solventes → más préstamos → más gasto, y así sucesivamente. Este bucle que se refuerza a sí mismo funciona en ambas direcciones, y es exactamente por eso que las economías se mueven en auges y caídas en lugar de crecer en línea recta."
      }
    ],
    "takeaway": "El crédito crea un bucle que se refuerza a sí mismo en AMBAS direcciones: lo que una persona pide prestado alimenta el ingreso de otra, que a su vez alimenta más préstamos, todo el camino hacia arriba en un auge y todo el camino hacia abajo en una caída.",
    "thinkAbout": "Imagina que pides prestados $10,000 para abrir un pequeño negocio y los gastas en equipo y en el primer mes de alquiler. Ese dinero se convierte en el ingreso del vendedor de equipo y del arrendador, y ahora ellos también pueden gastar o pedir prestado más. ¿Puedes seguir cómo ese único préstamo se propaga hacia afuera y se convierte en crecimiento para otras personas?"
  },
  "31": {
    "sections": [
      {
        "heading": "Productividad vs Crédito",
        "body": "Piensa en un agricultor que aprende una mejor rotación de cultivos, o en una fábrica que adopta una máquina que permite a un solo trabajador hacer el trabajo de tres. Cada pequeña mejora en conocimiento y tecnología aumenta cuánto valor puede crear la gente con el mismo tiempo y el mismo esfuerzo. Multiplica eso por toda una economía a lo largo de décadas y obtienes el crecimiento de la productividad: el ascenso lento y constante del nivel de vida.\n\nLa productividad importa más a largo plazo, pero el crédito importa más a corto plazo. La razón es esta: la productividad crece en una línea bastante recta y suave —un agricultor no se vuelve el doble de hábil de la noche a la mañana—. En cambio, el endeudamiento fluctúa salvajemente, porque el crédito permite a la gente consumir MÁS de lo que produce hoy (cuando pide prestado) y MENOS de lo que produce después (cuando lo devuelve).\n\nSin crédito, la única forma en que una economía crece es volviéndose más productiva: lento y constante. Añade el crédito a la mezcla y aparecen los ciclos: estallidos de crecimiento impulsado por el endeudamiento, seguidos de periodos dedicados a pagarlo."
      },
      {
        "heading": "Deuda Buena vs Deuda Mala",
        "body": "El crédito no es bueno ni malo por naturaleza: depende por completo de en qué se use el dinero.\n\nToma a dos personas que piden prestados $15,000 cada una. Una lo gasta en unas vacaciones de lujo y un televisor nuevo. Fue divertido por un tiempo, pero no creó ningún ingreso nuevo: la deuda tendrá que pagarse íntegramente con lo que ya ganaba, ahora repartido entre más cosas.\n\nLa otra pide prestada la misma cantidad para comprar un tractor en su pequeña granja. El tractor le permite cosechar más, vender más en el mercado y ganar más ingresos; con el tiempo, lo suficiente para pagar el préstamo Y quedar por delante. El mismo préstamo, el resultado opuesto.\n\nLa pregunta que hay que hacerse ante cualquier deuda —un préstamo de auto, uno de negocio, uno estudiantil— es siempre la misma: ¿generará el dinero prestado suficientes ingresos adicionales como para pagarse a sí mismo? Si la respuesta es sí, es deuda productiva. Si es no, solo le estás pidiendo prestado a tu yo del futuro para algo que no te devuelve nada."
      }
    ],
    "takeaway": "Pedir prestado es adelantar gasto de tu yo del futuro, como el préstamo del tractor que el agricultor paga con la cosecha de la próxima temporada. Cada vez que pides prestado, creas un ciclo, y eso vale igual si eres un solo hogar o una economía entera.",
    "thinkAbout": "Si le pides prestado a tu yo del futuro para gastar más hoy, TIENE que llegar un momento en que te quede menos para gastar: es aritmética simple. Ahora imagina a millones de personas y empresas haciendo esto, cada una en su propio calendario. Por eso el crédito crea ciclos en toda una economía: primero hacia arriba, luego hacia abajo."
  },
  "32": {
    "sections": [
      {
        "heading": "Fase de Expansión",
        "body": "Imagina un pueblo donde abre una fábrica nueva y contrata a cientos de trabajadores. Esos trabajadores ahora tienen sueldos que gastar: en restaurantes, en autos, en la ferretería. Los dueños de los restaurantes contratan más personal para dar abasto; el concesionario de autos pide más inventario. Eso es la expansión: el gasto aumenta y, como el crédito puede crearse al instante (“Crédito”), la gente pide prestado para gastar todavía más de lo que sus sueldos por sí solos permitirían.\n\nPero hay un límite a cuántas comidas pueden preparar realmente los restaurantes de un pueblo en un día. Cuando el gasto y los ingresos crecen más rápido de lo que el pueblo puede producir de verdad, las empresas responden subiendo los precios en lugar de producir más por arte de magia: eso es la inflación.\n\nEl banco central no quiere que la inflación se caliente demasiado, así que sube las tasas de interés. Tasas más altas significan que el préstamo del auto del trabajador de la fábrica se encarece, que menos gente pide préstamos nuevos y que las deudas existentes a tasa variable cuestan más de mantener; todo eso enfría el gasto otra vez."
      },
      {
        "heading": "Contracción y Recesión",
        "body": "De vuelta en ese mismo pueblo, las tasas más altas hacen que el trabajador de la fábrica renuncie al préstamo del auto y salga menos a comer. El restaurante, al ver menos clientes, le recorta horas a un mesero, y ese mesero ahora tiene menos para gastar en la ferretería. Como el gasto de una persona es el ingreso de otra, este repliegue se propaga hacia afuera: los ingresos caen y el gasto cae todavía más en respuesta.\n\nCuando suficientes personas en toda la economía gastan menos, las empresas empiezan a bajar los precios para atraer clientes —eso es la deflación— y la actividad económica en conjunto se encoge. Eso es una recesión.\n\nSi la cosa se pone lo bastante mal, el banco central da marcha atrás y vuelve a bajar las tasas de interés. Pedir prestado se abarata, el trabajador de la fábrica regresa al concesionario, el gasto repunta y comienza una nueva expansión. Este ciclo de subidas y bajadas se repite aproximadamente cada 5 a 8 años, guiado sobre todo por las decisiones de tasas de interés del banco central."
      },
      {
        "heading": "Por Qué Este Arreglo Tiene un Límite",
        "body": "Detrás del arreglo de la sección anterior hay un supuesto oculto: que el banco central tiene margen para bajar las tasas. Cada vez que el ciclo corto se da vuelta, recortar tasas funciona porque la expansión previa las había subido primero: hay holgura que devolver. Pero mira otra vez la pregunta del final de esta lección: si el pico de cada ciclo carga más deuda que el anterior, las tasas no siempre vuelven a donde empezaron. Los pagos de la deuda compiten con el nuevo endeudamiento por el ingreso de un hogar o de una empresa, así que los prestamistas y los bancos centrales tienden a mantener las tasas un poco más bajas en promedio, ciclo tras ciclo, solo para que la deuda siga siendo pagable.\n\nRepite ese patrón a lo largo de muchos ciclos de 5 a 8 años —décadas, no años— y el margen para recortar se sigue encogiendo. Con el tiempo las tasas se acercan a cero, y la herramienta que terminó todas las recesiones anteriores de esta lección (bajar tasas → crédito más barato → gasto renovado) se queda sin espacio para usarse. Eso no es hipotético: es la situación que describe “QE y QT”, donde los bancos centrales pasaron a comprar bonos directamente (expansión cuantitativa) porque ya no era posible seguir bajando las tasas.\n\nEsta es la costura entre los dos ciclos de deuda: el ciclo corto de esta lección se resuelve con nada más que un recorte de tasas, aproximadamente cada 5 a 8 años. El ciclo largo —el tema de la próxima lección— es lo que pasa cuando décadas de estos ciclos pequeños se acumulan en una carga de deuda que un recorte de tasas ya no puede arreglar por sí solo, y en cambio se vuelve necesario un ajuste distinto y más duro."
      }
    ],
    "takeaway": "La economía funciona como una máquina. Cuando el crédito es fácil → expansión. Cuando el crédito se restringe → recesión. El banco central controla el ciclo subiendo y bajando las tasas.",
    "thinkAbout": "Fíjate en que el fondo y el pico de cada ciclo terminan con MÁS crecimiento y MÁS deuda que los del ciclo anterior. Con el tiempo, la gente tiende a pedir prestado y a gastar más: es la naturaleza humana. ¿Qué crees que pasa cuando esto se acumula durante décadas?"
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
