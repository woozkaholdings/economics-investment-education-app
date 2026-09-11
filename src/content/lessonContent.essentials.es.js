// SPLIT 2026-08-18 (owner-directed): lessons 1-15, the mechanics half of the old
// money track, now the optional `essentials` track. Content is byte-identical to
// what lessonContent.money.*.js held — the split moved entries, it did not edit them,
// which is why translation-review's englishSourceHash values are unchanged.
// ═══════════════════════════════════════════════════════════════════════════
// LESSON CONTENT — essentials track, Spanish (es)
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
  "1": {
    "sections": [
      {
        "heading": "Ingresos vs. Gastos",
        "body": "María acaba de empezar su primer trabajo y gana $3,000 al mes después de impuestos. Un presupuesto es simplemente su plan para ese dinero: cuánto entra (ingresos) y cuánto sale (gastos).\n\nLos gastos fijos (alquiler, teléfono) se mantienen similares cada mes. Los variables (comida, ocio) cambian.\n\nUna división simple que muchos usan: 50% necesidades, 30% deseos, 20% ahorro o deudas. Es una guía, no una regla."
      },
      {
        "heading": "Registrar Antes de Recortar",
        "body": "Antes de recortar, ayuda registrar durante un mes a dónde va tu dinero — cada café, cada suscripción.\n\nNo puedes gestionar lo que no mides. Al sumarlo, María descubre que está suscrita a cuatro servicios de streaming que casi no usa — $12, $15, $9 y $18 al mes: $54 al mes, o $648 al año, saliendo de su cuenta sin que apenas se diera cuenta."
      },
      {
        "heading": "Automatiza el Ahorro, No Lo Decidas",
        "body": "El presupuesto de María destina $600 al mes al ahorro — pero solo funciona si ese dinero se aparta de verdad, en vez de quedar disuelto en lo que sobre en la cuenta a fin de mes.\n\nLa solución es invertir el orden: una transferencia automática mueve los $600 a ahorros el mismo día que llega el sueldo, antes de que haya oportunidad de gastarlos. El presupuesto no cambia, pero el ahorro ya no depende de la disciplina de María en la tercera semana del mes.\n\nEsto funciona por la misma razón que un hábito es más fácil de mantener que una decisión: elimina el momento en que se necesita fuerza de voluntad. “Por Qué 'Luego' Nunca Se Siente Tan Real Como 'Ahora'” (en Pensar sobre el dinero) explica por qué ese momento se pierde con tanta facilidad incluso en quienes de verdad piensan ahorrar — y la solución práctica aquí es sencillamente no programar ese momento."
      }
    ],
    "takeaway": "Un presupuesto no es restricción — es saber a dónde va tu dinero para decidir, a propósito, a dónde debería ir.",
    "thinkAbout": "Elige una semana y anota cada compra, sin importar cuán pequeña. La mayoría se sorprende de al menos una categoría."
  },
  "2": {
    "sections": [
      {
        "heading": "Qué Cuenta Como Emergencia",
        "body": "Un fondo de emergencia es dinero reservado solo para sorpresas genuinas — perder el empleo, una factura médica, una reparación del auto. No una oferta, no unas vacaciones.\n\nUna guía común: 3-6 meses de gastos esenciales. No tiene que lograrse de golpe — incluso $500-1,000 iniciales ya cubren muchas sorpresas comunes."
      },
      {
        "heading": "Dónde Guardarlo",
        "body": "El objetivo del fondo de emergencia es seguridad y acceso, no crecimiento. Suele ser una cuenta de ahorros accesible en un día o dos — no algo bloqueado (como una cuenta de jubilación) ni algo que fluctúa (como acciones).\n\nEs un trabajo distinto al de invertir: estar disponible cuando todo lo demás no va según el plan."
      },
      {
        "heading": "¿Emergencia, o Simplemente Irregular?",
        "body": "No toda factura sorpresa es realmente una emergencia. La reparación de un accidente es impredecible, pero la renovación de la placa, regalos navideños o un seguro anual son gastos previsibles que simplemente no ocurren cada mes. Usar el fondo de emergencia para esto deja menos disponible para una crisis real.\n\nUn fondo de reserva (sinking fund) maneja mejor estos casos: apartas un poco cada mes para un gasto que sabes que vendrá, así el dinero ya está listo cuando llega la factura.\n\nY cuando se usa el fondo de emergencia, reponerlo es la prioridad del mes siguiente, no algo opcional — un fondo que nunca se reconstruye solo protege una vez."
      }
    ],
    "takeaway": "El propósito del fondo de emergencia es convertir una crisis en una molestia.",
    "thinkAbout": "Si tu ingreso se detuviera mañana, ¿cuántos meses podrías cubrir tus gastos esenciales con lo que tienes ahorrado?"
  },
  "3": {
    "sections": [
      {
        "heading": "Interés Sobre Interés",
        "body": "El interés simple se gana solo sobre el monto original. El interés compuesto se gana sobre el monto original MÁS todo el interés ya generado — el crecimiento mismo empieza a crecer.\n\nUn atajo llamado Regla del 72: divide 72 entre la tasa anual para estimar en cuántos años se duplica el dinero. Al 6% son unos 12 años; al 9%, unos 8. Es una aproximación, no una fórmula exacta."
      },
      {
        "heading": "El Tiempo Vence a la Sincronización",
        "body": "Porque el interés compuesto se construye sobre sí mismo, el TIEMPO importa enormemente — a menudo más que el monto inicial.\n\nAhorrar $200 al mes desde los 25 años y ahorrar $400 al mes desde los 35 terminan casi iguales a los 65 con el 6% del ejemplo anterior: cerca de $400,000 cada uno, aunque quien empezó antes aportó $96,000 y quien empezó después, $144,000. Duplicar la cuota mensual fue justo lo necesario para compensar una ventaja de diez años.\n\nLa misma matemática funciona en tu contra con las deudas: el interés que no pagas también se compone."
      },
      {
        "heading": "El Interés Debe Reinvertirse",
        "body": "La matemática anterior solo funciona si dejas el interés — o los rendimientos de inversión — en la cuenta en vez de retirarlo. Si retiras el interés en efectivo cada año, vuelves al interés simple: los mismos $60 al año, siempre, sobre los $1,000 originales.\n\nPor eso las cuentas de ahorro, los fondos indexados y las acciones que pagan dividendos suelen tener una opción de \"reinvertir\" — comprar automáticamente más del mismo activo con el interés o los dividendos ganados, en vez de pagarlos en efectivo. Revisar si esa opción está activada puede ser la diferencia entre ver tu saldo componerse de verdad o verlo estancado."
      }
    ],
    "takeaway": "El interés compuesto premia el tiempo por encima de casi todo — lo que hace que hoy sea el día más temprano que tendrás para empezar.",
    "thinkAbout": "Usando la Regla del 72, ¿aproximadamente cuántos años tardaría el dinero en duplicarse a una tasa anual del 4%? ¿Y al 12%?"
  },
  "4": {
    "sections": [
      {
        "heading": "Qué Compone el Puntaje",
        "body": "El puntaje de crédito es un número — en EE.UU. suele ir de 300 a 850 — que resume qué tan confiablemente has pagado tus deudas, usado por prestamistas para evaluar el riesgo.\n\nLos factores más grandes suelen ser el historial de pagos y el uso del crédito disponible. La duración del historial, los tipos de crédito y las solicitudes recientes también importan, pero menos.\n\n“Crecimiento de Productividad” (en Cómo funciona la economía) habló de la deuda buena frente a la mala para la economía; un puntaje de crédito hace una pregunta parecida sobre ti: ¿puedes con lo que has pedido prestado?"
      },
      {
        "heading": "Por Qué Te Acompaña",
        "body": "El puntaje de crédito puede afectar la tasa de interés en un préstamo para auto o hipoteca, si un apartamento te alquilará, y a veces incluso solicitudes de empleo o tarifas de seguro.\n\nConstruirlo es poco glamuroso: paga a tiempo siempre; mantén saldos bajos; deja que las cuentas envejezcan en vez de cerrarlas."
      },
      {
        "heading": "Empezar Desde Cero",
        "body": "¿Qué pasa si no tienes historial crediticio — ni tarjetas, ni préstamos, nada de donde calcular un puntaje? Es el llamado catch-22 del crédito: los prestamistas quieren ver un historial antes de dar crédito, pero no puedes construir un historial sin antes obtener algún tipo de crédito.\n\nExisten puntos de partida comunes: una tarjeta de crédito garantizada requiere un depósito en efectivo (a menudo $200-$500) que se convierte en el límite de la tarjeta, cubriendo el riesgo del emisor con el depósito mismo; usada y pagada como una tarjeta normal, reporta a las agencias igual que una tarjeta sin garantía. Ser agregado como usuario autorizado en una tarjeta antigua y bien manejada de un familiar de confianza también puede sumar ese historial al tuyo propio. Un préstamo para construir crédito funciona casi al revés de un préstamo normal: el monto se guarda en una cuenta bloqueada mientras haces los pagos, y se te entrega solo después de pagarlo por completo — los pagos mismos son los que construyen el historial.\n\nCualquiera sea el punto de partida, los dos factores de la primera sección — pagar a tiempo y mantener bajo el uso del crédito — siguen haciendo casi todo el trabajo desde ahí."
      }
    ],
    "takeaway": "El puntaje de crédito premia el comportamiento aburrido y constante durante años — no hay truco que sustituya pagar a tiempo.",
    "thinkAbout": "De los factores anteriores, ¿cuál crees que sería el más fácil de mejorar primero?"
  },
  "5": {
    "sections": [
      {
        "heading": "Dos Bloques Básicos",
        "body": "Una acción es una pequeña porción de propiedad de una empresa — si la empresa crece en valor, la acción históricamente ha tendido a valer más también, aunque también puede perder valor, incluso de forma brusca.\n\nUn bono se parece más a un préstamo: prestas dinero a una empresa o gobierno, que promete devolverlo con interés en una fecha fijada. Los bonos han sido históricamente menos volátiles que las acciones, pero suelen ofrecer retornos promedio más bajos a largo plazo."
      },
      {
        "heading": "Por Qué Existe la Diversificación",
        "body": "Diversificar significa no poner todo el dinero en una empresa, sector o tipo de activo. Si una inversión cae bruscamente, el resto puede amortiguar el impacto.\n\nLa lección “Las 4 Fases del Ciclo Económico” (en Cómo funciona la economía) mostró cómo distintas clases de activos se han comportado diferente según la fase del ciclo — ese patrón es parte de por qué repartir inversiones en muchas posiciones, en vez de concentrarse en pocas, ha sido un enfoque duradero para gestionar el riesgo."
      },
      {
        "heading": "Lo Que la Diversificación No Puede Evitar",
        "body": "La diversificación elimina un tipo específico de riesgo: algo que le pasa a una sola empresa. Si el nuevo producto de la cadena de café fracasa, repartir tu dinero entre miles de otras empresas hace que ese fracaso apenas te afecte — esto se llama riesgo específico de la empresa, y es diversificable.\n\nPero hay un segundo tipo de riesgo que la diversificación dentro de las acciones no puede eliminar: algo que afecta a casi todo el mercado a la vez. Las cuatro fases de la lección “Las 4 Fases del Ciclo Económico” (en Cómo funciona la economía) mostraron que una contracción económica amplia tiende a arrastrar hacia abajo el precio de la mayoría de las acciones juntas, sin importar cuántas empresas tengas — esto se llama riesgo sistemático (o de mercado), y es la parte que diversificar solo entre acciones no puede eliminar.\n\nPor eso la sección anterior señalaba tener acciones y bonos, no solo muchas acciones distintas. Los bonos no evitan el riesgo de mercado por completo, pero históricamente han respondido de forma diferente a las mismas condiciones — eso es lo que realmente amortigua una cartera durante una caída que ninguna diversificación solo en acciones puede lograr."
      }
    ],
    "takeaway": "Las acciones y los bonos tienden a responder distinto a las mismas condiciones económicas — ese es el punto de tener ambos, no una coincidencia.",
    "thinkAbout": "Piensa en las cuatro fases del ciclo de la lección “Las 4 Fases del Ciclo Económico” (en Cómo funciona la economía). ¿Por qué tener acciones y bonos juntos podría suavizar el camino comparado con tener solo uno?"
  },
  "6": {
    "sections": [
      {
        "heading": "Por Qué Existen Estas Cuentas",
        "body": "Un 401(k) es una cuenta de jubilación ofrecida por un empleador; un IRA es su equivalente que cualquiera puede abrir por su cuenta.\n\nAmbos retrasan o eliminan el impuesto sobre las ganancias de inversión hasta que retiras el dinero, a diferencia de una cuenta de corretaje ordinaria, donde los dividendos se gravan cada año y las ganancias se gravan al venderlas.\n\nMuchos empleadores añaden un 'match' — dinero adicional cuando contribuyes — a menudo sujeto a un período de adquisición de derechos."
      },
      {
        "heading": "Traditional vs Roth: Pagar Impuestos Ahora o Después",
        "body": "Traditional se financia con dinero sin gravar (normalmente reduce el impuesto de este año), pero los retiros en la jubilación se gravan como ingreso normal.\n\nRoth se financia con dinero ya gravado, pero los retiros calificados en la jubilación son completamente libres de impuestos.\n\nCuál conviene depende de una comparación que nadie puede saber con certeza: la tasa de impuestos de hoy frente a la de dentro de décadas."
      }
    ],
    "takeaway": "El tipo de cuenta no cambia en qué puedes invertir — cambia cuándo llega el impuesto. Esa diferencia, compuesta durante décadas, es la razón de ser de estas cuentas.",
    "thinkAbout": "La lección “Interés Compuesto” mostró que empezar temprano importa más que empezar en grande, porque la capitalización necesita tiempo sobre todo. ¿Por qué importaría más cuanto antes empieza alguien?"
  },
  "7": {
    "sections": [
      {
        "heading": "Los Tramos Fiscales Son Capas, No una Tasa Única",
        "body": "El impuesto sobre la renta funciona como una pila de cubos, cada uno con su propia tasa; el dinero los llena de abajo hacia arriba. Solo la porción que rebosa a un cubo superior se grava a la tasa más alta — no todo el ingreso.\n\nPor eso un aumento nunca puede reducir tu sueldo neto, aunque te empuje a un tramo superior. Es un error común y costoso pensar lo contrario."
      },
      {
        "heading": "Sueldo Bruto, Sueldo Neto y A Dónde Va la Diferencia",
        "body": "En un recibo de sueldo destacan dos cifras: sueldo bruto y sueldo neto. La diferencia suele incluir más que solo el impuesto sobre la renta — en EE.UU., también hay impuestos de nómina (Seguro Social, Medicare) y, según el estado, impuesto estatal.\n\nEsto conecta con la lección “Cuentas de Jubilación”: una aportación a un 401(k) Traditional se resta del ingreso antes de calcular el impuesto federal sobre la renta, por eso reduce el ingreso gravable. Los impuestos de Seguro Social y Medicare se siguen reteniendo sobre ella."
      },
      {
        "heading": "Un Reembolso Grande No Es un Regalo — Es un Préstamo Sin Intereses",
        "body": "La retención de cada cheque de pago es solo una estimación del impuesto real del año, basada en las respuestas del Formulario W-4 que se completa al empezar un trabajo — estado civil, número de empleos, otros ingresos. El monto real no se calcula hasta presentar la declaración la primavera siguiente, meses después de que la mayoría de los pagos del año ya se cobraron.\n\nSi la estimación retuvo más de lo que resultó ser el impuesto real, la diferencia vuelve como un reembolso. Es fácil tratarlo como un bono, pero era dinero del trabajador todo el tiempo — entregado por adelantado, retenido sin intereses, y devuelto después al mismo valor. Un reembolso de $3,000 significa que $3,000 quedaron fuera de alcance durante meses, sin poder ir a una cuenta, una deuda o un ahorro en el momento en que realmente se ganaron.\n\nSi la estimación retuvo menos de lo real, el trabajador debe la diferencia al presentar la declaración, y una brecha suficientemente grande puede sumar una multa por pago insuficiente. Ningún resultado cambia cuánto impuesto se debía ese año — la retención solo controla cuándo cambia de manos ese dinero, no el tamaño de la factura.\n\nEl W-4 es la palanca para ajustar la estimación, y es el documento que la mayoría llena una sola vez, el primer día de trabajo, y nunca vuelve a revisar — ni tras un aumento, un segundo empleo, un matrimonio o un nuevo dependiente. Un reembolso o saldo adeudado que varía mucho de un año a otro suele reflejar un W-4 desactualizado, no un impuesto impredecible."
      }
    ],
    "takeaway": "Los tramos fiscales gravan capas de ingreso, no todo el ingreso a una sola tasa. Un aumento nunca puede restar de tu sueldo neto, solo sumar.",
    "thinkAbout": "Ahora que entiendes los tramos marginales, piensa en la pregunta Traditional vs Roth de la lección “Cuentas de Jubilación”. Una aportación Traditional normalmente reduce el ingreso gravable, y como esos dólares salen de la porción más alta del ingreso, el impuesto que ahorra se calcula sobre todo a la tasa marginal de hoy. ¿Cambia eso tu forma de pensar la comparación?"
  },
  "8": {
    "sections": [
      {
        "heading": "El Seguro Agrupa el Riesgo Entre Muchas Personas",
        "body": "Imagina un vecindario de mil casas. En un año dado, quizás dos o tres tendrán un incendio grave, pero nadie sabe cuáles de antemano. El seguro agrupa el riesgo: cada propietario paga una prima relativamente pequeña a un fondo compartido, y ese fondo cubre el costo total para las pocas casas que sí tienen un incendio.\n\nNadie sabe de antemano si será de los pocos desafortunados, así que todos cambian un costo pequeño y seguro (la prima) por protección ante uno grande e incierto. Es la misma idea detrás de cualquier tipo de seguro — salud, auto, hogar, vida — aplicada a un tipo distinto de riesgo."
      },
      {
        "heading": "Primas, Deducibles y Límites de Cobertura",
        "body": "Tres cifras dan forma a casi toda póliza. La prima es el pago recurrente para mantener la cobertura activa. El deducible es lo que el asegurado paga de su bolsillo antes de que el asegurador empiece a pagar un reclamo. El límite de cobertura es el máximo que el asegurador pagará.\n\nUn deducible más alto generalmente implica una prima más baja, y viceversa. Ese balance depende de las finanzas y circunstancias de cada persona, no de una regla que esta lección pueda dar."
      },
      {
        "heading": "Selección Adversa y Riesgo Moral: Por Qué los Aseguradores Preguntan Tanto",
        "body": "La sección 1 explicó que la agrupación de riesgo solo funciona porque nadie sabe de antemano quién será el desafortunado. Dos fuerzas pueden romper esa suposición.\n\nLa primera es la selección adversa: quienes ya saben que tienen mayor riesgo tienen más motivos para comprar seguro — un fumador quiere más un seguro de vida que un corredor de maratón. Si el asegurador cobrara la misma prima a todos, el fondo se llenaría de las personas con más probabilidad de reclamar. Por eso las solicitudes preguntan por el historial médico o de manejo antes de fijar el precio — clasificar a la gente en grupos de riesgo más precisos es lo que mantiene el fondo viable.\n\nLa segunda es el riesgo moral: una vez cubierta una pérdida, el comportamiento del asegurado puede cambiar porque ya no asume el costo completo. Los deducibles existen en parte por esto — dejan al asegurado con algo en juego.\n\nAlgunas pérdidas quedan fuera de lo que un seguro puede cubrir: algo que ya ocurrió, el desgaste normal, o un daño bajo el control total del asegurado. Ninguna implica la incertidumbre real de la que depende la agrupación."
      }
    ],
    "takeaway": "El seguro no elimina el riesgo — lo agrupa entre muchas personas para que una pérdida grande y rara se convierta en un costo pequeño y predecible para todos. Prima, deducible y límite de cobertura son las tres palancas de ese balance.",
    "thinkAbout": "La lección “Fondo de Emergencia” trató sobre construir un fondo de emergencia. El seguro y un fondo de emergencia resuelven problemas relacionados pero distintos. ¿Puedes pensar en una pérdida que cada uno cubriría mejor?"
  },
  "9": {
    "sections": [
      {
        "heading": "Por Qué un Dólar Compra Menos Con el Tiempo",
        "body": "Pregúntale a un abuelo cuánto costaba una entrada de cine cuando era joven — sonará minúsculo. No es que esas cosas se volvieran más valiosas; es el reverso de la inflación (lección “El Ciclo de Deuda a Corto Plazo” (en Cómo funciona la economía)): cuando el gasto y los ingresos de una economía crecen más rápido que lo que realmente se produce, los precios suben, año tras año.\n\nEsto importa más para el dinero que no se mueve. $1,000 guardados en un cajón durante veinte años siguen siendo $1,000 en el papel, pero compran menos vida cotidiana que antes."
      },
      {
        "heading": "Rendimiento Real vs Rendimiento Nominal",
        "body": "Una cuenta de ahorros con interés parece proteger contra esto — el saldo crece cada año. Pero ese número es el rendimiento nominal: crecimiento en dólares simples, sin preguntar qué pueden comprar esos dólares.\n\nEl rendimiento real resta la inflación: rendimiento real ≈ rendimiento nominal − inflación. Un saldo mayor en dólares no siempre significa más riqueza real."
      }
    ],
    "takeaway": "Un saldo creciente no es lo mismo que riqueza creciente. Lo que importa es el rendimiento real — crecimiento nominal menos inflación.",
    "thinkAbout": "La lección “Interés Compuesto” mostró que la capitalización premia el tiempo sobre casi todo lo demás. Ahora añade la inflación: el dinero quieto, incluso con un poco de interés, puede perder poder adquisitivo real cada año que la inflación lo supere. ¿Cambia eso tu forma de pensar sobre ahorrar frente a simplemente no gastar?"
  },
  "10": {
    "sections": [
      {
        "heading": "¿Empleado (W-2) o Contratista Independiente (1099)?",
        "body": "Un W-2 y un 1099 son formularios fiscales que resumen tus ingresos del año anterior. El W-2 significa que eres empleado: el empleador retiene automáticamente impuestos de cada cheque (lección “Impuestos”). El 1099 significa que trabajaste como contratista independiente: nadie retuvo nada. La diferencia no es el tipo de trabajo, sino quién controla cómo se hace — y eso cambia todo en materia de impuestos."
      },
      {
        "heading": "El Impuesto de Trabajo por Cuenta Propia: Pagando Ambas Mitades",
        "body": "La lección “Impuestos” explicó que parte de la diferencia entre el sueldo bruto y el neto son los impuestos de nómina (Seguro Social, Medicare), divididos aproximadamente a la mitad entre empleador y empleado. Un contratista 1099 no tiene empleador que pague esa otra mitad — así que debe pagar ambas mitades él mismo, el llamado impuesto de trabajo por cuenta propia, además del impuesto sobre la renta normal. Como nada se retiene automáticamente, el trabajador independiente debe apartar dinero de cada pago y a menudo enviar pagos de impuestos estimados trimestralmente al IRS."
      }
    ],
    "takeaway": "El mismo trabajo puede llegar como W-2 o 1099, y esa distinción decide si los impuestos se retienen automáticamente o si el trabajador debe apartarlos y pagarlos él mismo — incluido un impuesto de trabajo por cuenta propia que cubre la mitad que normalmente paga el empleador.",
    "thinkAbout": "La lección “Impuestos” mostró que un aumento nunca reduce tu sueldo neto, porque solo la porción que rebosa a un tramo superior se grava a la tasa más alta. Ahora imagina ese mismo aumento llegando como ingreso 1099 — sin nada retenido. ¿Cambia eso cómo evaluarías una oportunidad freelance frente a un salario con el mismo número nominal?"
  },
  "11": {
    "sections": [
      {
        "heading": "El Ratio de Gastos: Una Comisión Que Nunca Te Facturan",
        "body": "Los fondos mutuos y ETFs cobran una comisión anual llamada ratio de gastos, expresada como porcentaje del dinero invertido. A diferencia de una factura de teléfono, nada llega pidiendo ser pagado: el fondo simplemente deduce continuamente una pequeña porción de los activos totales, así que el saldo que ve el inversionista ya tiene la comisión descontada. Esa invisibilidad es justo lo que la hace fácil de ignorar.\n\nLos ratios de gastos varían enormemente. Un fondo que simplemente sigue un índice de mercado suele cobrar 0.03%-0.20% al año. Un fondo con un gestor que elige activamente las inversiones suele cobrar 0.5%-1.5% al año — y la mayoría de los fondos gestionados activamente no superan de forma confiable a un fondo índice comparable después de comisiones, a largo plazo."
      },
      {
        "heading": "Por Qué Una Comisión Pequeña Se Vuelve Grande",
        "body": "La lección “Interés Compuesto” mostró que el dinero crece más rápido cuando el interés compuesto tiene más años para trabajar — y que la misma matemática funciona en tu contra con deudas, donde el interés no pagado también se compone. Una comisión funciona igual: se resta cada año, incluso sobre el crecimiento que la comisión ya se llevó en años anteriores.\n\nCon $10,000 invertidos 30 años a un 7% anual: con una comisión de 0.05%, el saldo llega a unos $75,000. Con una comisión de 1.05% — solo un punto porcentual de diferencia — el saldo llega a apenas unos $57,000. Esa diferencia de un punto, compuesta durante 30 años, se llevó aproximadamente una cuarta parte del saldo total.\n\nEsto no significa que el fondo más barato siempre sea la mejor opción. Pero como la comisión es segura y se compone mientras el dinero esté invertido, mientras que el desempeño futuro no lo es, revisar el ratio de gastos antes de invertir es algo que un inversionista puede saber con certeza de antemano."
      }
    ],
    "takeaway": "Una comisión nunca envía una factura, pero se compone cada año igual que el interés de la lección “Interés Compuesto” — solo que en contra del saldo en vez de a favor, por eso vale la pena revisarla antes de invertir aunque sea menor al 1%.",
    "thinkAbout": "Dos fondos siguen el mismo índice y tienen inversiones casi idénticas, pero uno cobra 0.05% y el otro 0.75% al año. Como la lección “Acciones, Bonos y Diversificación” mostró que la diversificación, no la habilidad para elegir acciones, es lo que ya ofrece un fondo índice, ¿qué justificaría pagar la comisión más alta por las mismas inversiones subyacentes?"
  },
  "12": {
    "sections": [
      {
        "heading": "Alquilar vs. Comprar: Lo Que Cada Camino Realmente Cuesta",
        "body": "El alquiler y el pago de una hipoteca parecen el mismo tipo de gasto: un cheque que se escribe cada mes por la vivienda, pero compran cosas muy distintas. El alquiler compra el derecho a vivir en un lugar durante un período fijo, sin ningún derecho a largo plazo sobre la propiedad; cuando termina el contrato, el inquilino se va sin haber sumado nada a su propio patrimonio. A cambio, el propietario absorbe los costos sorpresa de la propiedad —un calentador de agua roto, un techo nuevo, impuestos a la propiedad en aumento— y el inquilino normalmente puede mudarse con uno o dos meses de aviso.\n\nComprar cambia esa flexibilidad por otra cosa: una parte de cada pago de hipoteca construye capital (equity), es decir, una participación en la vivienda que el comprador conserva o recupera más adelante. Pero comprar también adelanta costos que un inquilino nunca ve. Un pago inicial más los costos de cierre —comisiones por el préstamo, búsqueda de título, inspección, y más— suelen sumar entre 2% y 5% del precio de compra, y venderla después normalmente cuesta otro 5%-6% en comisiones de agente, una tarifa negociable y no fija. Un propietario también carga con los mismos costos sorpresa que antes absorbía el arrendador: impuestos a la propiedad, seguro de vivienda (la idea de la lección “Seguros” de cambiar un costo pequeño por protección, ahora obligatorio para quien tiene una hipoteca), y reparaciones. Nada de esto significa que comprar sea un error o que alquilar sea 'tirar el dinero' — significa que las dos opciones combinan costo, riesgo y flexibilidad de manera distinta, y qué combinación conviene depende de cuánto tiempo alguien planea quedarse y qué haría con el dinero de otra manera."
      },
      {
        "heading": "De Qué Está Hecho en Realidad un Pago de Hipoteca",
        "body": "Una hipoteca es un préstamo que usa la propia vivienda como garantía: si los pagos se detienen, el prestamista puede ejecutar la hipoteca y quedarse con la vivienda para recuperar lo adeudado, razón por la cual los prestamistas pueden ofrecer tasas de interés más bajas en una hipoteca que en un préstamo sin garantía como una tarjeta de crédito. Un pago mensual típico agrupa cuatro elementos —capital (reducir el monto prestado), interés (el cargo del prestamista por el préstamo), impuestos a la propiedad y seguro de vivienda— aunque solo los dos primeros forman parte del préstamo en sí.\n\nLa división entre capital e interés cambia a lo largo de la vida del préstamo de una forma que muchos compradores no esperan: los primeros pagos son sobre todo interés, y los últimos son sobre todo capital. Es la misma matemática del interés compuesto de la lección “Interés Compuesto”, funcionando en contra del prestatario en lugar de a su favor —el interés se cobra sobre todo el saldo restante, así que cuando el saldo es más grande (justo después de comprar), la porción de interés también lo es. Un préstamo a 30 años a menudo no cruza el punto medio entre interés y capital hasta aproximadamente dos tercios de su plazo.\n\nUn pago inicial menor al 20% del precio de compra suele añadir un costo más: el seguro hipotecario privado (PMI), que protege al prestamista —no al comprador— si el préstamo entra en impago, y que normalmente se cancela automáticamente una vez que se ha acumulado suficiente capital. Un pago inicial más grande reduce el monto del préstamo, el pago mensual, y a menudo evita el PMI por completo, lo cual es parte de por qué el tamaño del pago inicial es una de las cifras más discutidas al comprar una vivienda."
      }
    ],
    "takeaway": "Alquilar y comprar no son una opción 'correcta' y otra 'incorrecta' — intercambian flexibilidad y costos predecibles por capital y riesgo inicial en distintas proporciones, y el propio pago de la hipoteca se divide en capital, interés, impuestos y seguro, con la mayor parte de interés en los primeros años del préstamo.",
    "thinkAbout": "Alguien está comparando un apartamento que se alquila por $1,800/mes con una vivienda donde la hipoteca, los impuestos y el seguro sumarían $1,900/mes — casi lo mismo. Dado que comprar también requiere un pago inicial más 2%-5% en costos de cierre por adelantado, y que vender después cuesta otro 5%-6% en comisiones, ¿qué más importaría antes de concluir que las dos opciones cuestan 'casi lo mismo'?"
  },
  "13": {
    "sections": [
      {
        "heading": "Qué Es (y Qué No Es) una Cuenta de Corretaje",
        "body": "Una cuenta de corretaje es solo un contenedor: un lugar para guardar inversiones, no una inversión en sí misma. Abrir una suele ser gratis y no compromete dinero por sí sola; la cuenta solo empieza a funcionar cuando se deposita dinero y luego se usa para comprar algo dentro de ella, como las acciones, bonos o fondos de la lección “Acciones, Bonos y Diversificación”.\n\nEso es fácil de pasar por alto con el efectivo dentro de la cuenta. El dinero depositado que no se ha usado para comprar nada normalmente se queda ahí sin más — una cuenta de corretaje no es una cuenta de ahorros, así que el efectivo sin invertir suele generar poco o nada por sí solo. Comprar una inversión real es un paso separado y deliberado, no algo automático.\n\nUna cuenta de corretaje sujeta a impuestos también es distinta de las cuentas 401(k) e IRA de la lección “Cuentas de Jubilación”. No tiene límite de aportación ni penalización por retirar dinero antes, pero las ganancias se gravan al realizarse — cuando se vende una inversión con ganancia — en vez del trato diferido o libre de impuestos de una cuenta de jubilación. Muchas personas terminan usando ambos tipos de cuenta para metas distintas."
      },
      {
        "heading": "Colocar una Orden: Mercado vs. Límite",
        "body": "Una vez que hay dinero en la cuenta, comprar o vender algo requiere colocar una orden, y los dos tipos más comunes funcionan de forma distinta. Una orden de mercado dice 'compra (o vende) ahora mismo, al mejor precio disponible' — se ejecuta casi de inmediato, pero el precio exacto no está garantizado, sobre todo si el precio se mueve rápido. Una orden límite en cambio fija un precio específico: 'solo compra a este precio o menos' — el precio está garantizado si la orden se ejecuta, pero no hay garantía de que se ejecute, ya que el mercado podría no llegar nunca a ese precio.\n\nLa mayoría de las plataformas también permiten comprar acciones fraccionarias — una parte de una acción — en vez de exigir la compra de acciones completas, lo que facilita construir la diversificación de la lección “Acciones, Bonos y Diversificación” con menos dinero. Y una operación completada no termina al instante: las acciones suelen 'liquidarse' oficialmente un día hábil después."
      },
      {
        "heading": "Si las Operaciones Son Gratis, ¿Quién Paga Esto?",
        "body": "La mayoría de las plataformas de corretaje ya no cobran comisión por comprar o vender acciones — un cambio real respecto a hace unas décadas, cuando una sola operación podía costar entre $10 y $30 sin importar el monto. Pero una empresa sigue necesitando ingresos para operar, así que \"gratis\" describe lo que el inversor paga directamente, no lo que gana la plataforma.\n\nTres fuentes de ingresos cubren la mayor parte de esa diferencia. Interés: el efectivo que espera dentro de la cuenta para ser invertido — el mismo efectivo sin invertir descrito arriba — se agrupa entre todos los clientes, y la propia plataforma puede prestarlo o invertirlo de un día para otro, quedándose con el interés, la misma razón por la que un banco puede ofrecer cuentas corrientes \"gratis\". Pago por flujo de órdenes (payment for order flow): en lugar de enviar cada orden directamente a una bolsa pública, muchas plataformas la dirigen a un creador de mercado (market maker) — una firma que ejecuta la orden directamente y paga a la plataforma una pequeña comisión por ese derecho. El diferencial de compra-venta (bid-ask spread): en cualquier momento, una acción tiene un precio de compra ligeramente más alto (ask) que de venta (bid) — a menudo apenas uno o dos centavos — y el creador de mercado que ejecuta la orden se queda con esa diferencia.\n\nNada de esto es oculto ni ilegal — las plataformas deben divulgar públicamente sus prácticas de enrutamiento de órdenes, y la regulación exige que las operaciones obtengan \"la mejor ejecución\", un precio razonable según las condiciones del mercado en ese momento. Pero \"sin comisión\" no es lo mismo que \"la plataforma no tiene ningún interés en esta operación\". Vale la pena recordarlo la próxima vez que algo se anuncie como gratis: al menos una vez, conviene preguntarse de dónde viene realmente el ingreso."
      }
    ],
    "takeaway": "Una cuenta de corretaje es un contenedor, no una inversión — abrirla es gratis, pero el dinero dentro solo crece una vez que se usa para comprar algo. Las órdenes de mercado cambian certeza de ejecución por incertidumbre de precio; las órdenes límite hacen lo contrario.",
    "thinkAbout": "Alguien coloca una orden límite para comprar una acción 5% por debajo de su precio actual, esperando un mejor trato, pero el precio nunca baja tanto y la orden nunca se ejecuta. Comparado con usar una orden de mercado, ¿qué sacrificó — y qué riesgo evitó?"
  },
  "14": {
    "sections": [
      {
        "heading": "Un Testamento No Es Solo para los Ricos",
        "body": "Un testamento es un documento legal que indica quién recibe las pertenencias, el dinero y las propiedades de una persona después de morir, y — para quienes tienen hijos menores — quién los criaría. Es fácil suponer que un testamento solo importa para alguien con un patrimonio grande, pero su función real es más simple: deja que los deseos de la persona, no una fórmula predeterminada, decidan qué pasa con lo que deja atrás.\n\nSin testamento, la ley estatal decide en su lugar, mediante un proceso llamado sucesión intestada — una fórmula fija que se aplica de la misma manera sin importar lo que la persona realmente hubiera querido.\n\nUn testamento no tiene que ser complicado para cumplir su función principal, y crear uno suele ser mucho menos complejo de lo que la mayoría supone — pero los detalles varían según el lugar y la situación."
      },
      {
        "heading": "Las Designaciones de Beneficiario Pueden Anular un Testamento",
        "body": "Aquí hay un detalle que sorprende a muchos: un testamento no lo controla todo. Ciertas cuentas — incluidas las cuentas 401(k) e IRA de la lección “Cuentas de Jubilación” y las pólizas de seguro de vida de la lección “Seguros” — pasan directamente a quien esté designado como beneficiario, sin importar lo que diga el testamento. La designación de beneficiario de la cuenta siempre gana, incluso sobre un testamento más reciente que diga algo distinto.\n\nEsto crea un error común y evitable: alguien actualiza su testamento tras un cambio importante — un divorcio, un nuevo hijo, un nuevo matrimonio — pero olvida que un 401(k) o seguro de vida antiguo todavía tiene como beneficiario a un ex-cónyuge.\n\nLa conclusión práctica no es una instrucción específica sobre quién debería ser el beneficiario de nadie — eso depende de las relaciones y circunstancias de cada persona — sino el mecanismo en sí: los formularios de beneficiario son una decisión separada y activa de un testamento, y no se actualizan solos."
      }
    ],
    "takeaway": "Un testamento dirige cómo se distribuyen las pertenencias y el dinero de alguien y quién cría a sus hijos — sin uno, una fórmula legal fija decide en su lugar. Pero las cuentas de jubilación y seguro pasan por alto el testamento por completo: quien esté designado en el formulario de beneficiario de la cuenta la recibe, así que una designación desactualizada puede anular incluso un testamento recién escrito.",
    "thinkAbout": "Alguien se divorcia, reescribe su testamento para dejarle todo a su nuevo cónyuge, pero nunca actualiza la designación de beneficiario del 401(k) que abrió años antes (lección “Cuentas de Jubilación”) — todavía figura su ex-cónyuge. Según esta lección, ¿quién recibe realmente ese 401(k) cuando esa persona muere?"
  },
  "15": {
    "sections": [
      {
        "heading": "El Informe Es el Registro; el Puntaje Es un Número Calculado a Partir de Él",
        "body": "Un informe de crédito es un registro detallado del historial crediticio de una persona: qué tarjetas de crédito y préstamos ha abierto, cuánto debe, si los pagos llegaron a tiempo o tarde, cuánto tiempo lleva abierta cada cuenta, qué prestamistas han consultado recientemente el informe tras una solicitud de crédito (una \"consulta dura\"; que una persona revise su propio informe es una \"consulta blanda\" y no baja su puntaje), y cualquier registro público como bancarrotas. Lo compila una agencia de crédito — las tres principales en EE. UU. son Equifax, Experian y TransUnion — a partir de información que prestamistas, arrendadores y otros acreedores eligen reportar.\n\nUn puntaje de crédito es algo completamente distinto: un número de tres dígitos, generalmente entre 300 y 850, calculado a partir de lo que contiene un informe usando un modelo de puntuación como FICO o VantageScore. El puntaje no se guarda en el informe — se genera a partir de su contenido cuando se solicita, de la misma forma que un promedio académico se calcula a partir de una boleta de calificaciones en lugar de estar escrito directamente en ella.\n\nComo hay tres agencias y varios modelos de puntuación, una sola persona no tiene un puntaje de crédito — tiene varios, y pueden diferir. No todos los prestamistas reportan a las tres agencias, así que el archivo de Equifax sobre una persona puede no incluir una cuenta que sí aparece en el de Experian, y FICO y VantageScore pueden convertir el mismo informe en números ligeramente distintos. Ver dos puntajes diferentes en dos aplicaciones distintas no es un error — puede simplemente significar que las apps consultaron agencias diferentes o usaron modelos diferentes."
      },
      {
        "heading": "Porque un Informe Es un Registro, Puede Contener Errores — y Puede Corregirse",
        "body": "Como un informe de crédito lo compila un tercero a partir de datos de otras empresas, puede estar equivocado de las maneras habituales en que cualquier registro compilado de varias fuentes puede estarlo: un pago que fue puntual se registra como tardío, una cuenta que se cerró sigue apareciendo como abierta, o — más grave aún — información de otra persona con un nombre parecido o un caso de robo de identidad termina en el archivo equivocado. Cualquiera de estos errores puede bajar el puntaje calculado a partir de ese informe, por una razón que no tiene nada que ver con el comportamiento real de esa persona como prestataria.\n\nLa ley federal de EE. UU. da a todos el derecho a una copia gratuita de su informe de crédito de cada una de las tres agencias, disponible en AnnualCreditReport.com, y otorga a los consumidores el derecho a disputar formalmente información inexacta directamente ante la agencia que la reporta. Esto es una acción distinta a mejorar un puntaje: disputar un informe corrige información errónea; no convierte información exacta en algo más favorable.\n\nEsta distinción importa porque ambas cosas suelen confundirse. Si un informe muestra correctamente un historial de pagos tardíos o un saldo alto en relación con el crédito disponible, disputarlo no eliminará esa información — un puntaje calculado a partir de información exacta solo cambia cuando cambia el comportamiento subyacente, con el tiempo. Revisar un informe en busca de errores y mejorar los hábitos que refleja con exactitud son dos acciones distintas, y ambas valen la pena."
      }
    ],
    "takeaway": "Un informe de crédito es un registro detallado del historial crediticio de alguien, mantenido por separado por tres agencias distintas (Equifax, Experian, TransUnion). Un puntaje de crédito es un número de tres dígitos calculado a partir de ese informe mediante un modelo de puntuación (como FICO o VantageScore) — como hay tres agencias y varios modelos, una persona tiene varios puntajes, no uno. Como un informe se compila con datos de otras empresas, puede contener errores; la ley de EE. UU. da a todos el derecho a una copia gratuita de cada agencia y el derecho a disputar inexactitudes, pero disputar solo corrige información errónea — no cambia lo que se reporta con exactitud.",
    "thinkAbout": "Alguien revisa su puntaje de crédito en la app de su banco y ve 705, y luego revisa una app gratuita distinta el mismo día y ve 680. Según esta lección, ¿cuál es la explicación más probable — y alguno de los dos números tiene que estar necesariamente equivocado?"
  },
};
