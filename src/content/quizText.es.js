// ═══════════════════════════════════════════════════════════════════════════
// QUIZ TEXT — Spanish (es)
//
// One language. Split this way 2026-08-17 (backlog item 48), the same second
// axis item 45 applied to lesson content: quizData.js carried all five
// languages together (128 kB of text, of which any one reader could read
// ~25 kB), and it was statically imported by both Practice and LessonReader.
//
// Index-aligned with quizMeta.js — entry i here is entry i there. That
// alignment is what keeps every learner's persisted review schedule valid;
// see quizMeta.js for why the order must not change.
//
// The language-independent `lesson` and `answer` fields are NOT here on
// purpose. They live once, in quizMeta.js.
// ═══════════════════════════════════════════════════════════════════════════

export const quizText = [
  {
    "q": "¿Qué impulsa la economía?",
    "opts": [
      "Solo gasto del gobierno",
      "Reservas de oro",
      "Gasto total (dinero + crédito)",
      "Precios de acciones"
    ],
    "explain": "El gasto total impulsa la economía."
  },
  {
    "q": "¿Cuál es la parte más importante?",
    "opts": [
      "Crédito",
      "Oro",
      "Gobierno",
      "Tecnología"
    ],
    "explain": "El crédito es la parte más importante y volátil."
  },
  {
    "q": "¿Cuánto dura el ciclo corto?",
    "opts": [
      "1-2 años",
      "20-30 años",
      "75-100 años",
      "5-8 años"
    ],
    "explain": "El ciclo corto dura 5-8 años."
  },
  {
    "q": "¿Qué causa la inflación?",
    "opts": [
      "Poco gasto del gobierno",
      "Gasto creciendo más rápido que producción",
      "Tasas bajas solas",
      "Caídas bursátiles"
    ],
    "explain": "Cuando el gasto crece más rápido que la producción, los precios suben."
  },
  {
    "q": "¿Qué pasa en un desapalancamiento diferente de recesión?",
    "opts": [
      "La bolsa sube",
      "El gobierno deja de gastar",
      "Bancos tienen demasiado",
      "Tasas ya en 0% — no se pueden bajar más"
    ],
    "explain": "En un desapalancamiento, las tasas ya están en 0%."
  },
  {
    "q": "Una curva invertida predice:",
    "opts": [
      "Alza inmediata",
      "Inflación baja",
      "Recesión en 12-18 meses",
      "PIB fuerte"
    ],
    "explain": "Las curvas invertidas han precedido a cada recesión de EE.UU. desde 1955, aunque no toda inversión termina en recesión."
  },
  {
    "q": "¿Qué es QE?",
    "opts": [
      "Banco central compra bonos cuando tasas están en 0%",
      "Gobierno sube impuestos",
      "Bancos dejan de prestar",
      "Precios congelados"
    ],
    "explain": "QE es la herramienta de emergencia del Fed."
  },
  {
    "q": "La primera regla general para manejar la deuda es:",
    "opts": [
      "Siempre comprar acciones",
      "Nunca pedir prestado",
      "Ahorrar 50%",
      "No dejes que la deuda crezca más rápido que los ingresos"
    ],
    "explain": "Si la deuda crece más rápido que los ingresos, te aplastará."
  },
  {
    "q": "¿Qué es lo más importante para el crecimiento económico a largo plazo?",
    "opts": [
      "Expansión del crédito",
      "Crecimiento de la productividad",
      "Estímulo gubernamental",
      "Ganancias del mercado bursátil"
    ],
    "explain": "El crecimiento de la productividad es lo que eleva el nivel de vida a largo plazo. El crédito importa más a corto plazo y crea los ciclos, pero no puede generar crecimiento real por sí solo."
  },
  {
    "q": "¿Cuál de estas NO es una de las 4 herramientas para reducir la carga de deuda?",
    "opts": [
      "Austeridad (recortar gasto)",
      "Reestructuración o impago de deuda",
      "Subir aún más las tasas de interés",
      "Imprimir dinero (QE)"
    ],
    "explain": "Las 4 herramientas son austeridad, reestructuración/impago, redistribución de riqueza e impresión de dinero. Subir más las tasas no es una de ellas."
  },
  {
    "q": "¿Qué es la Tasa de Fondos Federales?",
    "opts": [
      "La tasa clave que influye en casi todas las demás tasas de interés",
      "Una tasa de impuesto sobre ganancias de capital",
      "La tasa de interés solo de los bonos del Tesoro a 30 años",
      "Una tasa fijada directamente por el Congreso"
    ],
    "explain": "Es la tasa que los bancos se cobran entre sí de un día para otro, fijada por la Reserva Federal."
  },
  {
    "q": "Durante la fase de 'Valle' del ciclo económico, históricamente:",
    "opts": [
      "Las tasas de interés suelen estar en su punto más alto",
      "El pesimismo está en su peor momento, pero a menudo ha sido un buen momento para encontrar oportunidades",
      "La inflación suele estar en su punto máximo",
      "Las acciones históricamente han seguido cayendo durante años"
    ],
    "explain": "En el valle, el sentimiento es el más negativo, pero históricamente el año siguiente ha mostrado retornos fuertes. Esto es un patrón histórico, no una garantía."
  },
  {
    "q": "¿Qué indicador económico se conoce a menudo como el 'Índice del Miedo'?",
    "opts": [
      "PIB",
      "IPC",
      "VIX (Índice de Volatilidad)",
      "PMI"
    ],
    "explain": "El VIX mide la volatilidad esperada. Por debajo de 15 señala calma; por encima de 40, pánico extremo."
  },
  {
    "q": "¿Por qué el ciclo de deuda a largo plazo tiene que girar eventualmente?",
    "opts": [
      "Porque los gobiernos limitan legalmente el endeudamiento",
      "Porque las deudas acaban creciendo más rápido que los ingresos necesarios para pagarlas",
      "Porque las tasas de interés se fijan por ley",
      "Porque la productividad deja de crecer por completo"
    ],
    "explain": "Durante décadas, las deudas pueden crecer más rápido que los ingresos que las sostienen. Eso no puede continuar indefinidamente, así que el ciclo pasa a una fase de desapalancamiento."
  },
  {
    "q": "¿Cuál es una guía inicial comúnmente citada para dividir el ingreso entre necesidades, deseos y ahorro?",
    "opts": [
      "70% necesidades / 20% deseos / 10% ahorro",
      "20% necesidades / 50% deseos / 30% ahorro",
      "90% necesidades / 5% deseos / 5% ahorro",
      "50% necesidades / 30% deseos / 20% ahorro o deudas"
    ],
    "explain": "Una división inicial común es 50% necesidades, 30% deseos, 20% ahorro o deudas — una guía a ajustar, no una regla estricta."
  },
  {
    "q": "¿Cuál es una guía comúnmente citada para el tamaño de un fondo de emergencia?",
    "opts": [
      "3-6 meses de gastos esenciales",
      "Una semana de gastos",
      "Un monto fijo de $100, sin importar el ingreso",
      "Todo lo que puedas meter en acciones"
    ],
    "explain": "Una guía común es 3-6 meses de gastos esenciales, guardados en un lugar seguro y de acceso rápido — no invertido para crecer."
  },
  {
    "q": "Usando la Regla del 72, ¿aproximadamente cuántos años tarda el dinero en duplicarse a un crecimiento anual del 9%?",
    "opts": [
      "3 años",
      "24 años",
      "8 años",
      "72 años"
    ],
    "explain": "72 ÷ 9 ≈ 8. La Regla del 72 es una aproximación rápida, no una fórmula exacta."
  },
  {
    "q": "¿Qué dos factores suelen importar más para el puntaje de crédito?",
    "opts": [
      "Solo tu puesto de trabajo y salario",
      "Historial de pagos y uso del crédito",
      "Cuántas sucursales bancarias has visitado",
      "Tu edad y código postal"
    ],
    "explain": "El historial de pagos y el uso del crédito disponible suelen ser los factores más grandes."
  },
  {
    "q": "¿Cuál es la idea principal detrás de la diversificación?",
    "opts": [
      "Comprar solo la acción con mejor desempeño",
      "Evitar los bonos por completo por ser 'aburridos'",
      "Cronometrar el mercado para comprar justo en el fondo",
      "Repartir el dinero en muchas inversiones para que ninguna hunda toda la cartera"
    ],
    "explain": "La diversificación reparte el riesgo en muchas inversiones, para que una caída fuerte no hunda toda la cartera."
  },
  {
    "q": "¿Cuál es la diferencia clave entre una cuenta Traditional y una Roth?",
    "opts": [
      "Traditional se grava al retirar en la jubilación; Roth se grava al contribuir ahora",
      "Traditional se grava al contribuir; Roth se grava al retirar",
      "Ambas se gravan exactamente igual, solo en bancos distintos",
      "Ninguna se grava nunca"
    ],
    "explain": "Traditional pospone el impuesto y lo paga al retirar; Roth paga el impuesto antes de aportar, por lo que los retiros calificados son libres de impuestos."
  },
  {
    "q": "Si un aumento empuja parte de tu ingreso a un tramo fiscal más alto, ¿qué pasa realmente?",
    "opts": [
      "Todo tu ingreso se grava a la nueva tasa más alta",
      "Terminas con menos dinero en total que antes del aumento",
      "Solo la porción que cayó en el nuevo tramo se grava a la tasa más alta — el resto no cambia",
      "El gobierno se queda con todo el aumento como impuesto"
    ],
    "explain": "Los tramos fiscales marginales solo gravan la porción de ingreso que cae en cada tramo, no todo el ingreso a esa tasa. Un aumento nunca puede reducir tu sueldo neto."
  },
  {
    "q": "Si la Póliza A tiene un deducible más alto que la Póliza B, con el mismo límite de cobertura, ¿qué esperarías según el balance que describe esta lección?",
    "opts": [
      "La Póliza A tiene una prima más alta que la Póliza B",
      "La Póliza A tiene una prima más baja que la Póliza B, ya que su asegurado absorbe más de las pérdidas pequeñas",
      "La Póliza A y la Póliza B tienen exactamente la misma prima",
      "El deducible no tiene relación con la prima"
    ],
    "explain": "Un deducible más alto generalmente implica una prima más baja, porque el asegurado acepta absorber más de las pérdidas pequeñas y frecuentes él mismo."
  },
  {
    "q": "Una cuenta de ahorros crece 3% en un año donde los precios suben 5%. ¿Qué pasó con su poder adquisitivo real?",
    "opts": [
      "Se redujo — el rendimiento real fue aproximadamente -2%, aunque el saldo creció",
      "Creció 3%, igual que el rendimiento nominal",
      "Creció 8%, combinando ambas tasas",
      "Se mantuvo exactamente igual sin importar la inflación"
    ],
    "explain": "Rendimiento real ≈ rendimiento nominal − inflación: 3% − 5% ≈ -2%. El saldo creció en dólares, pero ahora compra menos que hace un año."
  },
  {
    "q": "Un freelancer recibe ingresos 1099 en lugar de un sueldo W-2. ¿Cuál es la diferencia clave en impuestos?",
    "opts": [
      "Nada cambia — los impuestos funcionan igual en ambos casos",
      "El freelancer paga impuesto sobre la renta pero no debe impuestos de nómina/Seguro Social",
      "El IRS retiene automáticamente los impuestos de los pagos 1099, igual que en un W-2",
      "No se retiene nada automáticamente, y el freelancer debe ambas mitades del impuesto de nómina (impuesto de trabajo por cuenta propia)"
    ],
    "explain": "Al ingreso 1099 no se le retiene nada automáticamente, y como no hay empleador que pague su mitad del Seguro Social/Medicare, el trabajador independiente debe ambas mitades — el impuesto de trabajo por cuenta propia — además del impuesto sobre la renta normal."
  },
  {
    "q": "Dos fondos tienen las mismas inversiones, pero el Fondo A cobra 0.05% anual y el Fondo B cobra 1.05%. Invertidos 30 años con el mismo rendimiento subyacente, ¿qué pasa?",
    "opts": [
      "Casi nada — una diferencia de 1 punto es demasiado pequeña en décadas",
      "La comisión del Fondo B, compuesta cada año, consume aproximadamente una cuarta parte del saldo final frente al Fondo A",
      "El Fondo B rinde más automáticamente porque comisiones más altas financian mejor investigación",
      "La comisión solo aplica una vez, al comprar, así que no afecta los resultados a largo plazo"
    ],
    "explain": "Como la comisión se deduce cada año — incluso sobre el crecimiento que ya se llevó en años anteriores — se compone en contra del saldo igual que el interés de la lección “Interés Compuesto” se compone a favor. Una diferencia de 1 punto porcentual, sostenida 30 años, consume aproximadamente una cuarta parte del saldo final."
  },
  {
    "q": "Un propietario lleva 3 años de una hipoteca a 30 años. ¿Qué describe mejor la división de su pago mensual entre capital e interés?",
    "opts": [
      "Sobre todo capital, ya que la mayor parte del préstamo ya debería estar pagada",
      "Dividido en partes iguales entre capital e interés",
      "Sobre todo interés, porque el interés se cobra sobre el gran saldo restante al inicio del préstamo",
      "Totalmente interés, ya que no se paga capital hasta refinanciar el préstamo"
    ],
    "explain": "El interés se cobra sobre el saldo restante, que es mayor al inicio del préstamo, así que los primeros pagos son sobre todo interés — la misma matemática del interés compuesto de la lección “Interés Compuesto”, funcionando en contra del prestatario. La parte de capital solo supera a la de interés alrededor de dos tercios del plazo de un préstamo típico a 30 años."
  },
  {
    "q": "Una cuenta de corretaje tiene $500 en efectivo sin invertir recién depositado. ¿Qué pasa generalmente con ese dinero si el dueño no hace nada más?",
    "opts": [
      "Crece automáticamente con el interés compuesto de la propia cuenta, igual que una cuenta de ahorros",
      "El corretaje lo invierte automáticamente en un fondo indexado diversificado",
      "El corretaje toma una parte como comisión de mantenimiento mensual",
      "Se queda ahí sin más y generalmente no crece — comprar una inversión real es un paso separado y deliberado"
    ],
    "explain": "Una cuenta de corretaje es un contenedor, no una inversión en sí misma. El efectivo sin invertir dentro de ella generalmente no crece por sí solo — comprar acciones, bonos o fondos es un paso separado que el dueño debe tomar deliberadamente."
  },
  {
    "q": "Alguien reescribe su testamento después de un divorcio para dejarle todo a su nuevo cónyuge, pero nunca actualiza el formulario de beneficiario de un 401(k) que abrió años antes — todavía figura su ex-cónyuge. ¿Quién recibe realmente ese 401(k) cuando esa persona muere?",
    "opts": [
      "El ex-cónyuge, porque la designación de beneficiario de la cuenta anula lo que dice el testamento",
      "El nuevo cónyuge, porque el testamento se escribió más recientemente",
      "El dinero se divide automáticamente en partes iguales entre el ex-cónyuge y el nuevo cónyuge",
      "El proveedor del 401(k) decide según quién contribuyó más"
    ],
    "explain": "Un testamento no controla cuentas con su propia designación de beneficiario, como un 401(k) o un seguro de vida de las lecciones “Cuentas de Jubilación” y “Seguros”. Quien esté nombrado en el formulario de beneficiario de esa cuenta la recibe directamente, sin importar lo que diga un testamento más reciente."
  },
  {
    "q": "Una persona ve un puntaje de crédito de 705 en una app y 680 en otra app distinta el mismo día. Según esta lección, ¿cuál es la explicación más probable?",
    "opts": [
      "Una de las apps cometió un error de cálculo y debería reportarse",
      "Los puntajes de crédito se actualizan en tiempo real, así que la diferencia refleja una transacción hecha entre ambas consultas",
      "Es probable que las dos apps hayan consultado agencias de crédito distintas o usado modelos de puntuación diferentes, ya que una persona tiene más de un puntaje",
      "Solo el puntaje más alto es correcto; un puntaje nunca puede ser legítimamente más bajo que el puntaje \"real\" de una persona"
    ],
    "explain": "Un informe de crédito lo mantienen por separado tres agencias, y varios modelos de puntuación (como FICO y VantageScore) pueden convertir el mismo informe en números distintos — así que una sola persona tiene varios puntajes de crédito en lugar de uno, y dos apps pueden discrepar legítimamente sin que ninguna esté equivocada."
  },
  {
    "q": "Según esta lección, ¿qué hace que algo sea un activo y no un pasivo?",
    "opts": [
      "Si fue lo bastante caro como para valer la pena financiarlo",
      "Hacia dónde fluye el dinero después de comprarlo — hacia dentro con el tiempo, o hacia fuera",
      "Si pagaste en efectivo en lugar de a crédito",
      "Si otras personas considerarían responsable esa compra"
    ],
    "explain": "La prueba es la dirección del dinero con el tiempo, no el precio, el método de pago ni cómo se ve la compra ante los demás. Muchas compras reales están en medio — una vivienda genera patrimonio a la vez que cuesta dinero cada mes — y por eso la lección la trata como una pregunta que vale la pena hacerse deliberadamente, no como una forma de clasificar compras en buenas y malas."
  },
  {
    "q": "Dos personas tienen cada una una brecha de $5,000 al año entre lo que ganan y lo que gastan, pero una gana $50,000 y la otra $120,000. Según esta lección, ¿qué te dice eso?",
    "opts": [
      "Quien gana más está necesariamente mejor, porque un ingreso mayor siempre se compone más rápido",
      "Quien gana menos debe estar presupuestando mal, ya que la misma brecha con menos ingreso es improbable",
      "Nada útil — una brecha solo tiene sentido cuando sabes en qué la invierte cada persona",
      "Están a la misma distancia de cualquier meta que financie la brecha, aunque una tenga una vida materialmente mejor"
    ],
    "explain": "Lo que financia un fondo de emergencia, el ahorro invertido o la eventual opción de trabajar menos es la brecha entre ganar y gastar — no el ingreso por sí solo. Dos brechas idénticas están igual de lejos de esas metas, y por eso quienes ganan mucho pueden vivir de sueldo en sueldo: la inflación del estilo de vida es justamente el mecanismo que mantiene la brecha plana mientras la cifra de arriba sube."
  },
  {
    "q": "Jordan gasta un bono de $2,000 en un cine en casa. Alex deja los mismos $2,000 en una cuenta que gana 6% anual y no los toca. Diez años después, ¿cuál es, según la lección, el costo real de la compra de Jordan?",
    "opts": [
      "Los $2,000 que pagó, más unos $1,580 adicionales — lo que ese dinero habría llegado a ser si hubiera elegido diferente",
      "Exactamente $2,000, porque ese fue el precio que pagó",
      "Nada, porque ya obtuvo el uso y disfrute completo de él",
      "Lo que el cine en casa se pudiera revender hoy"
    ],
    "explain": "El costo de oportunidad significa que el costo real de una elección incluye el valor de la mejor alternativa a la que renunciaste, no solo el precio de etiqueta. Los $2,000 de Jordan también dejaron de ser $2,000 creciendo al 6% anual, así que la comparación honesta es el disfrute que obtuvo frente a los aproximadamente $3,580 en que ese dinero se habría convertido — no frente a los $2,000 del precio por sí solos."
  },
  {
    "q": "La noche antes de un concierto por el que ya pagó $120, a Priya le da un fuerte resfriado. Según la lección, ¿qué peso deberían tener esos $120 ya gastados al decidir si ir o no?",
    "opts": [
      "Ninguno — se fueron de cualquier forma y no deberían influir en la decisión",
      "Los $120 completos, porque ir honra lo que pagó",
      "La mitad, ya que está enferma",
      "Deberían hacer que se quede más en casa, para proteger el valor de la entrada"
    ],
    "explain": "Un costo hundido — dinero ya gastado que ninguna decisión futura puede recuperar — debería pesar cero en la decisión. Una vez que se sacan los $120 de la comparación, la elección real es entre una noche miserable afuera y una noche tranquila en casa, no entre 'desperdiciar' o 'no desperdiciar' la entrada."
  },
  {
    "q": "Marcus compra una inversión sobre todo porque tres personas distintas mencionaron que su precio se triplicó recientemente. Según la lección, ¿de qué es realmente evidencia la multitud de compradores a su alrededor?",
    "opts": [
      "De que el precio seguirá triplicándose",
      "De que Marcus investigó lo suficiente para comprar con confianza",
      "De que los fundamentos del activo deben haber mejorado",
      "De que otra gente lo está comprando — no de que sea una buena inversión"
    ],
    "explain": "El tamaño y el entusiasmo de una multitud son evidencia de que mucha gente está haciendo lo mismo — no evidencia sobre el valor real del activo. Un precio que sube puede significar igual de fácil que las mismas ganancias futuras ahora cuestan más, ya que refleja a todos los que ya compraron, no lo que aún está por venir."
  },
  {
    "q": "Priya compra una chaqueta marcada como '$220, ahora $89' y siente que consiguió una ganga, sin compararla con lo que cuestan chaquetas similares en otro lugar. Según la lección, ¿qué le dice en realidad el $220 tachado sobre si $89 es un precio justo?",
    "opts": [
      "Que $89 definitivamente es un precio justo, ya que la chaqueta costaba más antes",
      "Que debería haber negociado un precio aún más bajo antes de comprar",
      "Casi nada — es un punto de referencia, no evidencia del valor real de la chaqueta",
      "Que las chaquetas en general se están abaratando con el tiempo"
    ],
    "explain": "El tamaño de un ancla — como un precio 'antes' tachado — no te dice si el precio resultante es realmente justo. Solo te dice qué número eligió otra persona poner al lado, a menudo porque hace que el segundo número parezca más pequeño en comparación. Juzgar un precio contra información independiente (lo que realmente cuestan artículos comparables) es distinto de juzgarlo contra el número que pusieron a su lado."
  },
  {
    "q": "Tomás invierte en una empresa tras el consejo de un amigo, y luego lee con atención el artículo titulado 'Por qué los analistas son optimistas', pero pasa por encima del titulado 'Tres riesgos que los inversionistas están ignorando', diciéndose que probablemente sea clickbait. ¿Cómo llama la lección a este patrón?",
    "opts": [
      "Diversificación — repartir la investigación entre muchas fuentes independientes",
      "Sesgo de confirmación — buscar y favorecer información que respalda una decisión ya tomada",
      "Anclaje — juzgar el precio de la empresa contra un número de referencia arbitrario",
      "Aversión a la pérdida — sentir las pérdidas con más fuerza que ganancias equivalentes"
    ],
    "explain": "El sesgo de confirmación es buscar, favorecer y recordar información que respalda una decisión ya tomada, mientras se descarta o se pasa por alto lo que la contradice. La búsqueda de Tomás arrojó ambos artículos — lo que cambió fue a cuál le dio su atención, y a cuál descartó como clickbait sin leerlo."
  },
  {
    "q": "Priya dice que preferiría tener $50 hoy en vez de $65 en un mes, pero cuando le piden elegir entre $50 en doce meses y $65 en trece meses, elige los $65. Ambas elecciones implican esperar un mes extra por $15 más. ¿Cómo llama la lección a este patrón?",
    "opts": [
      "Anclaje — Priya está juzgando los $65 contra el punto de referencia equivocado",
      "Sesgo del presente (descuento hiperbólico) — una recompensa inmediata pesa mucho más que la misma recompensa apenas retrasada",
      "Aversión a la pérdida — Priya siente los $15 como una pérdida en vez de una ganancia",
      "Diversificación — Priya está repartiendo su elección entre dos períodos de tiempo distintos"
    ],
    "explain": "El sesgo del presente significa que una recompensa inmediata pesa de forma desproporcionada respecto a cuánto tiempo realmente la separa de una recompensa retrasada. La espera de un mes y la diferencia de $15 son idénticas en ambas elecciones, pero solo la primera tiene 'hoy' como opción — y eso es lo que cambia la respuesta de Priya, no una diferencia en las matemáticas de fondo."
  },
  {
    "q": "El teléfono de Jordan todavía funciona — tiene una pequeña grieta en la esquina, pero cada aplicación abre sin problema. En algún momento durante el pago, 'quiero un teléfono nuevo' se convirtió en silencio en 'necesito un teléfono nuevo'. ¿Qué está haciendo realmente ese cambio de nombre?",
    "opts": [
      "Hacer que el teléfono nuevo sea más barato",
      "Demostrar que el teléfono nuevo es una mala compra",
      "Saltarse la evaluación que un deseo debería recibir, ya que una 'necesidad' no requiere justificación",
      "Arreglar la pantalla agrietada sin pagar por un teléfono nuevo"
    ],
    "explain": "Llamar 'necesidad' a un deseo no cambia el teléfono, la grieta ni el precio — cambia si la compra llega a sopesarse en algún momento. Una necesidad real no tiene que justificarse a sí misma, así que renombrar algo como necesidad es un atajo para evitar la única pregunta que un deseo debe enfrentar: si vale la pena, a este precio, ahora mismo."
  },
  {
    "q": "Marcus tiene $3,000 que no necesitará por al menos quince años — su fondo de emergencia y los gastos de este año ya están cubiertos en otro lugar — y ese dinero está actualmente en una cuenta de ahorros que rinde menos que la inflación. Según la lección, ¿qué le está costando realmente ese arreglo?",
    "opts": [
      "Nada — una cuenta de ahorros siempre es el lugar más seguro para cualquier cantidad de dinero, sin importar cuánto tiempo permanezca ahí",
      "Los $3,000 pierden su seguro de depósito una vez que se mantienen por más de un año",
      "La baja tasa de interés de la cuenta garantiza que los $3,000 se reducirán en términos de dólares sin importar cuánto tiempo permanezcan ahí",
      "Está pagando por una estabilidad que este dinero en particular no necesita ahora mismo, ya que su largo horizonte de tiempo le daría margen para recuperarse de una caída temporal antes de que él llegue a retirarlo"
    ],
    "explain": "La estabilidad tiene valor cuando el dinero podría necesitarse con poco aviso y no puedes permitirte que esté bajo ese día — ese es el trabajo que una cuenta de ahorros hace bien. Los $3,000 de Marcus no tienen ninguna necesidad a corto plazo, así que su horizonte de quince años le da tiempo para recuperarse de cualquier mal período mucho antes de que él llegue a retirarlo. La protección que ofrece una cuenta de ahorros se está pagando (en crecimiento perdido) aunque este dólar en particular no sea el que necesita esa protección ahora mismo."
  },
  {
    "q": "Elena recibe un reembolso de impuestos de $600 y lo gasta en un viaje de fin de semana espontáneo que nunca habría reservado con $600 de su sueldo — dinero que presupuesta cuidadosamente cada mes. ¿Cómo llama la lección a este patrón de tratar el reembolso de forma distinta al dinero del sueldo por la misma cantidad?",
    "opts": [
      "Contabilidad mental — dividir el dinero en compartimentos mentales y aplicar una regla más laxa al dinero que se siente 'encontrado' en vez de ganado",
      "Diversificación — repartir el gasto entre varias compras distintas en vez de una sola",
      "Sesgo del presente — valorar mucho más una recompensa disponible hoy que la misma recompensa retrasada",
      "Anclaje — juzgar el precio del viaje contra un número de referencia arbitrario"
    ],
    "explain": "La contabilidad mental es tratar el dinero de forma distinta según su origen o la etiqueta que se le pone, aunque un dólar compra lo mismo sin importar de dónde vino. Los $600 del reembolso de Elena y los $600 de su sueldo son financieramente idénticos; solo difiere la regla mental asociada a cada uno — 'dinero encontrado' frente a 'dinero ganado' — y esa regla, no el dinero en sí, es lo que cambió su decisión."
  },
  {
    "q": "Marcos compró una acción que desde entonces ha bajado un 20%. Se niega a venderla, aunque tiene un mejor uso para ese dinero, porque 'esperaré hasta que vuelva a lo que pagué por ella.' Otra acción que compró en cambio subió un 20%, y la vendió en una semana para 'asegurar la ganancia.' ¿Qué patrón dice la lección que está llevando a Marcos a tratar estas dos situaciones de forma tan distinta, aunque las cantidades de dinero involucradas sean las mismas?",
    "opts": [
      "Costo hundido — está contando el dinero que ya gastó en la acción que baja como razón para seguir invirtiendo más en ella",
      "Aversión a la pérdida — el dolor de asegurar la pérdida al vender se siente mucho más pesado que el placer de asegurar una ganancia equivalente, así que evita la sensación de pérdida en vez de evaluar el mejor uso del dinero",
      "Anclaje — está juzgando el precio actual de la acción contra un número de referencia arbitrario",
      "Diversificación — repartir el dinero entre más de una inversión en vez de concentrarlo en una sola"
    ],
    "explain": "La aversión a la pérdida es la tendencia a que una pérdida se sienta aproximadamente el doble de dolorosa de lo que una ganancia equivalente se siente placentera, lo cual empuja a la gente a evitar hacer oficial una pérdida incluso cuando el dinero se usaría mejor en otro lugar. El costo hundido (opción 0) es un patrón relacionado pero distinto sobre dejarse influir por el dinero ya gastado; aquí, lo que decide es el dolor asimétrico de admitir que la pérdida es real, no la cantidad ya invertida."
  },
  {
    "q": "Después de que María elige una acción por corazonada y esta sube un 40% en dos meses, empieza a hacer tres veces más operaciones, cada una con menos investigación que antes, porque ahora siente que tiene un don para elegir acciones. ¿Qué patrón explica mejor su comportamiento?",
    "opts": [
      "Costo hundido — sigue invirtiendo porque ya ha puesto dinero",
      "FOMO — está copiando lo que hacen otros inversores exitosos a su alrededor",
      "Sobreconfianza tras un resultado afortunado — atribuye la victoria a su propia habilidad en vez de considerar cuánta suerte hubo, y como resultado aumenta su toma de riesgos",
      "Aversión a la pérdida — está tratando de evitar el dolor de admitir una pérdida"
    ],
    "explain": "Esto es sobreconfianza tras un resultado afortunado (sesgo de autoatribución): atribuir una victoria a la propia habilidad y aumentar la toma de riesgos como resultado, sin sopesar cuánto del resultado fue en realidad suerte. El FOMO (opción 1, “Tanta Gente No Puede Estar Equivocada, ¿Verdad?”) trata de copiar lo que hacen otras personas, que no es lo que está impulsando a María aquí — no se menciona el comportamiento de nadie más. El costo hundido (opción 0) trata de dejarse influir por dinero ya gastado, y la aversión a la pérdida (opción 3, “¿Por Qué Perder $50 Duele Más Que Encontrar $50 se Siente Bien?”) trata del dolor asimétrico de una pérdida — ninguna encaja con una historia sobre una sola victoria que impulsa más toma de riesgos."
  }
];
