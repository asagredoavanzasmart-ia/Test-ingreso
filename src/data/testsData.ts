export type TestId = 'clickup' | 'core_values' | 'sales' | 'work_methodology';

export interface Question {
  question: string;
  options: string[];
  answer: number;
  category: string;
  recommendation: string;
}

export interface TestMetadata {
  id: TestId;
  title: string;
  shortTitle: string;
  badge: string;
  tagline: string;
  description: string;
  colorGradient: string;
  accentColor: string;
  estimatedTime: string;
  questionsCount: number;
}

export const testsMetadata: Record<TestId, TestMetadata> = {
  clickup: {
    id: 'clickup',
    title: 'Test Diagnóstico Metodología de Trabajo en ClickUp',
    shortTitle: 'Metodología ClickUp',
    badge: 'Cultura Operativa & Gestión',
    tagline: 'Inbox diario, Modo Yo, regla del 50%, "Empuja la tarea" y entregables',
    description: 'Evalúa tu asimilación de la metodología operativa diaria de la agencia: gestión de tareas, Backlog intocable, duración estimada con colchón, actualización proactiva y nomenclatura de entregables.',
    colorGradient: 'linear-gradient(160deg, #ff851d 20%, #f34551 60%, #ef375c 100%)',
    accentColor: '#f34551',
    estimatedTime: '~5 min',
    questionsCount: 10
  },
  core_values: {
    id: 'core_values',
    title: 'Test Diagnóstico Valores Medulares de la Agencia',
    shortTitle: 'Valores Medulares',
    badge: 'Cultura, Agilidad & IA',
    tagline: 'Iteración acelerada, agilidad, uso crítico de IA y enfoque en la solución',
    description: 'Mide tu alineación con los valores de la agencia: "mejor hecho que perfecto", mentalidad MVP, capacidad de reacción, prevención de trampas con IA y resolución centrada en el dolor del cliente.',
    colorGradient: 'linear-gradient(135deg, #f34551 0%, #ef375c 100%)',
    accentColor: '#ef375c',
    estimatedTime: '~5 min',
    questionsCount: 10
  },
  sales: {
    id: 'sales',
    title: 'Test Diagnóstico Ventas por WhatsApp',
    shortTitle: 'Ventas por WhatsApp',
    badge: 'Comercial & Conversión',
    tagline: 'Psicología de ventas, cierres, objeciones y persuasión táctica',
    description: 'Evalúa tus habilidades comerciales, el uso estratégico de guiones, seguimiento no invasivo, cierres por alternativa y manejo de objeciones por chat.',
    colorGradient: 'linear-gradient(135deg, #ff851d 0%, #ef375c 100%)',
    accentColor: '#ff851d',
    estimatedTime: '~5 min',
    questionsCount: 10
  },
  work_methodology: {
    id: 'work_methodology',
    title: 'Test Diagnóstico Metodología de Trabajo',
    shortTitle: 'Forma de Trabajo',
    badge: 'Cultura & Equipo',
    tagline: 'Comunicación efectiva, Scrum-Ban, compromiso y comportamiento en equipo',
    description: 'Evalúa tu comprensión de las reglas del juego: cómo comunicarte, gestionar tus tarjetas, entregar con calidad y desenvolverte con proactividad dentro del equipo.',
    colorGradient: 'linear-gradient(135deg, #6366f1 0%, #ef375c 100%)',
    accentColor: '#6366f1',
    estimatedTime: '~5 min',
    questionsCount: 10
  }
};

// ==========================================
// TEST 1: METODOLOGÍA CLICKUP (Basado en uso clicup.txt)
// ==========================================
export const questionsClickUp: Question[] = [
  {
    question: "¿Cuál es la rutina obligatoria que debe realizar todo colaborador al iniciar su jornada en ClickUp?",
    options: [
      "Ingresar a Inicio / Bandeja de Entrada para revisar lo asignado hoy, menciones y mensajes pendientes.",
      "Revisar directamente el Backlog general para seleccionar libremente tareas que le llamen la atención.",
      "Crear un reporte manual en un documento de notas y enviarlo por correo al supervisor.",
      "Esperar a que el asistente de coordinación le asigne tareas verbalmente por videollamada."
    ],
    answer: 0,
    category: "Rutina e Inbox",
    recommendation: "Al iniciar la mañana o requerir saber qué ocurre, la primera parada obligatoria es Inicio / Bandeja de Entrada: allí verás lo asignado para hoy, comentarios, menciones y chats activos."
  },
  {
    question: "¿Cómo debe configurar un colaborador sus vistas (Tablero, Lista o Tabla) para no dispersarse con el trabajo de todo el equipo?",
    options: [
      "Activar el 'Modo Yo' (Me Mode), filtrar por fecha 'Hoy' y ordenar por orden de prioridad.",
      "Ocultar todas las tarjetas de los demás compañeros borrándolas de la vista del sprint.",
      "Crear un espacio privado paralelo desconectado del sprint del equipo.",
      "Trabajar únicamente desde la vista de Carga de Trabajo sin revisar el tablero del día."
    ],
    answer: 0,
    category: "Vistas y Modo Yo",
    recommendation: "El 'Modo Yo' filtra de golpe para mostrar exclusivamente tus tareas asignadas. Al combinarlo con el filtro de fecha 'Hoy' y orden por prioridad (urgente, alta, etc.), tu tablero se vuelve 100% focalizado y operativo."
  },
  {
    question: "¿Qué representa el estado 'Backlog' (en gris) en la lista del sprint y cuál es la regla metodológica sobre él?",
    options: [
      "Es trabajo almacenado a la espera que NO se toca ni se considera como pendiente en la jornada activa.",
      "Son las tareas que deben realizarse primero antes de pasar a las tarjetas de 'Doing'.",
      "Es un archivo de tareas descartadas que deben ser eliminadas al final de la semana.",
      "Son tareas de emergencia que cualquiera puede tomar sin consultar si se queda sin trabajo."
    ],
    answer: 0,
    category: "Gestión de Sprint",
    recommendation: "El Backlog almacena lo que queda a la espera y no está por hacer en este momento. La regla de la agencia es estricta: no considerar ni mover lo que está en Backlog en gris."
  },
  {
    question: "¿Qué criterio de estimación utiliza la agencia en ClickUp y para qué sirve el tiempo asignado a una tarea?",
    options: [
      "No se usan puntos de sprint; se usa la 'Duración Estimada', la cual incluye un colchón de tiempo para absorber cambios y transiciones.",
      "Se usan puntos Fibonacci estrictos y un cronómetro en tiempo real para auditar cada minuto trabajado.",
      "El tiempo estimado es solo referencial y no importa si una tarea tarda días adicionales en completarse.",
      "Se mide únicamente por la cantidad de notas y comentarios que el colaborador escriba en el día."
    ],
    answer: 0,
    category: "Estimación y Tiempos",
    recommendation: "La agencia no usa puntos de sprint ni cronómetro manual; define una Duración Estimada que ya contempla un colchón de tiempo para absorber factores de producción y cambios de contexto entre actividades."
  },
  {
    question: "Si estás ejecutando una tarea programada y te percatas de que demorará más de un 50% del tiempo estimado, ¿qué acción exige el procedimiento?",
    options: [
      "Mover la tarjeta inmediatamente al estado 'Detenido' y activar la comunicación para resolver el bloqueo.",
      "Dejarla en 'Doing' y continuar trabajando en silencio hasta que alguien pregunte qué ocurrió.",
      "Borrar la duración estimada de la tarjeta para que el sistema no marque retraso.",
      "Cerrarla en 'Done' y abrir una nueva tarjeta duplicada sin avisar al equipo."
    ],
    answer: 0,
    category: "Control de Flujo y Alertas",
    recommendation: "Si una tarea demora más de un 50% del tiempo estimado programado, debe pasar de inmediato a 'Detenido'. Esto alerta a la coordinación y permite destrabar el obstáculo a tiempo."
  },
  {
    question: "¿En qué consiste la filosofía de 'Empuja la tarea' cuando surge un impedimento o falta de información?",
    options: [
      "Ser proactivo: contactar a los compañeros, pedir accesos, hacer preguntas y buscar soluciones sin abandonar la tarjeta.",
      "Dejar la tarjeta tirada y esperar a que el supervisor descubra el problema al final de la semana.",
      "Presionar al cliente con reclamos agresivos para que envíe los materiales de inmediato.",
      "Delegar la tarea a cualquier compañero sin explicarle el contexto del proyecto."
    ],
    answer: 0,
    category: "Cultura Operativa",
    recommendation: "'Empujar la tarea' significa asumir la responsabilidad activa de que el trabajo salga adelante. Ante cualquier traba (un acceso, una duda, un archivo), debes moverte y consultar proactivamente en lugar de abandonarla."
  },
  {
    question: "¿Por qué es responsabilidad de cada colaborador mantener actualizada su tarjeta (Doing, Detenido, Done) en todo momento?",
    options: [
      "Para que los coordinadores conozcan el estado del proyecto sin tener que interrumpir o preguntar; el sistema debe cobrar vida propia.",
      "Porque ClickUp penaliza con descuentos automáticos si una tarjeta no se mueve cada dos horas.",
      "Únicamente para que el cliente externo reciba correos automáticos cada vez que cambias de columna.",
      "No es necesario si avisas informalmente por WhatsApp personal a un compañero."
    ],
    answer: 0,
    category: "Comunicación en Equipo",
    recommendation: "El tablero cobra vida por sí solo cuando cada persona actualiza su tarjeta. Quien vigila el panel debe saber con certeza qué está pasando sin tener que perseguir a nadie para averiguarlo."
  },
  {
    question: "Al finalizar una tarea, ¿cuál es el requisito indispensable sobre la entrega antes de moverla a 'Done'?",
    options: [
      "Proveer un acceso directo e inequívoco (link funcional o captura) en los comentarios etiquetando (@) al revisor.",
      "Dar por sentado que el revisor buscará por su cuenta en Google Drive o carpetas dónde quedó el archivo.",
      "Mover la tarjeta a 'Done' sin comentarios ni enlaces para no saturar el registro de actividad.",
      "Enviar un mensaje de voz por WhatsApp personal avisando que la tarea ya está lista."
    ],
    answer: 0,
    category: "Estándar de Entrega",
    recommendation: "Un entregable debe ser transparente y accesible de inmediato. Quien revisa no debe adivinar ni rastrear carpetas; debe encontrar el enlace o captura clara en la actividad de la tarjeta etiquetando (@) a quien revisa."
  },
  {
    question: "¿Cuál es la regla de nomenclatura obligatoria para titular cualquier tarjeta dentro de ClickUp?",
    options: [
      "Usar siempre el formato '[Cliente] - [Nombre de la tarea]' o 'Avanza - [Nombre de la tarea]' si es interna.",
      "Nombrar la tarjeta únicamente con el nombre de pila del colaborador asignado.",
      "Escribir solamente verbos genéricos como 'Diseño', 'Revisión' o 'Programar' sin especificar cliente.",
      "Usar únicamente el código numérico automático que genera ClickUp sin texto descriptivo."
    ],
    answer: 0,
    category: "Estandarización y Nomenclatura",
    recommendation: "La nomenclatura estándar es obligatoria: '[Cliente] - [Nombre de la tarea]' (ej. 'Contraplaga - Landing page'). Si es de la agencia, se titula 'Avanza - [Tarea]'. Esto garantiza orden para todo el equipo."
  },
  {
    question: "¿Qué advertencia específica se hace sobre trabajar y detener tarjetas fuera del horario laboral habitual?",
    options: [
      "Si trabajas de noche y se te detiene una tarjeta, el equipo no estará disponible para apoyarte y la tarea quedará bloqueada.",
      "No hay ningún problema: puedes trabajar de noche porque tienes autonomía para resolver bloqueos por tu cuenta.",
      "Trabajar de noche es más eficiente porque nadie interrumpe y avanzas mejor en silencio.",
      "La metodología sugiere avisar solo si el bloqueo supera las 24 horas sin resolverse."
    ],
    answer: 0,
    category: "Cultura Operativa",
    recommendation: "Trabajar muy tarde tiene el riesgo de que si una tarjeta se frena por falta de accesos o dudas, no habrá compañeros conectados para destrabarla y la tarea se quedará irremediablemente detenida."
  }
];

// ==========================================
// TEST 2: VALORES MEDULARES (Sin niveles ni escenarios)
// ==========================================
export const questionsCoreValues: Question[] = [
  {
    question: "¿Cuál es el primer valor medular de la agencia y qué principio operativo lo resume mejor?",
    options: [
      "Iteración acelerada: basarse en 'mejor hecho que perfecto' y trabajar sobre productos mínimos viables que sirvan.",
      "Perfeccionismo técnico: nunca publicar nada hasta que esté 100% pulido sin importar el tiempo transcurrido.",
      "Planificación exhaustiva: redactar manuales de más de 50 páginas antes de comenzar cualquier diseño o tarea.",
      "Velocidad ciega: entregar tareas incompletas o rotas con tal de cumplir la fecha límite sin importar la calidad."
    ],
    answer: 0,
    category: "Iteración Acelerada",
    recommendation: "La iteración acelerada implica no paralizarse ante los problemas. Como decía Zuckerberg: 'Mejor hecho que perfecto'. Se trabaja sobre productos mínimos viables (completos y funcionales, pero esenciales) para ajustar sobre la marcha."
  },
  {
    question: "¿Qué significa realmente un 'Producto Mínimo Viable' (MVP) en la metodología de trabajo de la agencia?",
    options: [
      "No es algo incompleto o roto, sino algo que está completo y sirve para cumplir el objetivo principal.",
      "Un borrador a medias sin funcionalidad real que se le envía al cliente para ganar tiempo.",
      "Cualquier tarea que se termine en menos de 15 minutos sin revisar la calidad.",
      "Una maqueta estática que nunca se llega a implementar en producción."
    ],
    answer: 0,
    category: "Iteración Acelerada",
    recommendation: "Un MVP no es un trabajo mediocre o a medio hacer. Es una solución que, con lo justo y necesario, resuelve de forma completa y funcional el problema inmediato para aprender y seguir iterando."
  },
  {
    question: "¿Cómo se manifiesta el valor de la 'Agilidad' en la gestión de proyectos de la agencia?",
    options: [
      "En la flexibilidad para hacer enroques de tareas y responder oportunamente cuando surgen problemas o cambios del cliente.",
      "En trabajar horas extras de madrugada sin avisar a nadie.",
      "En cambiar de estrategia todos los días según el estado de ánimo del equipo.",
      "En no tener ninguna planificación y hacer lo que sea más fácil en cada momento."
    ],
    answer: 0,
    category: "Agilidad Operativa",
    recommendation: "La agilidad se demuestra en la capacidad de reaccionar. Trabajar con tareas modulares permite hacer enroques rápidos de fechas y prioridades para responder a contingencias de clientes sin romper el cronograma."
  },
  {
    question: "¿Qué criterio no negociable aplica la agencia en la selección de nuevos integrantes respecto a los valores?",
    options: [
      "Los valores son un filtro eliminatorio: alguien sin match cultural no entra al equipo, aunque tenga excelentes habilidades técnicas.",
      "Solo se evalúa el talento técnico; los valores corporativos son decorativos y no importan en la práctica.",
      "Se contrata primero por simpatía personal y después se verifica si sabe realizar el trabajo técnico.",
      "Cualquier persona puede integrarse si promete memorizar la misión y visión de la empresa."
    ],
    answer: 0,
    category: "Cultura de Selección",
    recommendation: "A diferencia de empresas donde los valores quedan en el papel, en la agencia los valores son el filtro principal. Un 'súper genio' técnico que no encaja con la colaboración, iteración o agilidad no ingresa al equipo."
  },
  {
    question: "¿Cuál es el principal riesgo identificado en la agencia sobre el mal uso de la Inteligencia Artificial?",
    options: [
      "Usarla ciegamente creyendo que es mágica y aceptar respuestas superficiales o alucinaciones sin aplicar criterio crítico.",
      "Que la IA reemplace a todos los diseñadores y programadores en menos de tres meses.",
      "Que los clientes descubran que se usa IA y cancelen sus contratos de inmediato.",
      "Que la IA aumente los costos de software de la agencia más allá del presupuesto."
    ],
    answer: 0,
    category: "Uso Crítico de IA",
    recommendation: "La IA no es mágica. El peligro es caer en la pereza mental de aceptar respuestas genéricas, errores lógicos o textos vacíos sin contrastarlos con la realidad y las directrices reales del proyecto."
  },
  {
    question: "¿Qué diferencia a un profesional que usa la IA con criterio frente a quien la usa de manera amateur?",
    options: [
      "El profesional la usa como herramienta de apoyo, contrasta las respuestas con la realidad y aporta su propio criterio experto.",
      "El profesional copia y pega directamente el primer resultado generado por el prompt.",
      "El profesional no usa IA porque considera que todo debe hacerse 100% de manera manual.",
      "El profesional utiliza únicamente los modelos de pago más caros sin importar la calidad del contenido."
    ],
    answer: 0,
    category: "Uso Crítico de IA",
    recommendation: "El profesional no delega su pensamiento crítico a la IA. La utiliza para acelerar procesos, pero audita el resultado, verifica coherencia y refina el entregable con su experiencia humana."
  },
  {
    question: "¿Qué significa tener 'enfoque en el problema' en contraposición al 'enfoque en la solución'?",
    options: [
      "Entender a fondo la necesidad y dolor real del cliente antes de enamorarse de una herramienta o propuesta técnica.",
      "Pasar semanas quejándose de los problemas sin proponer ninguna alternativa de acción.",
      "Buscar un culpable dentro del equipo cada vez que una métrica no cumple las expectativas.",
      "Ignorar las metas comerciales del cliente y centrarse exclusivamente en la estética visual."
    ],
    answer: 0,
    category: "Enfoque en Problema vs Solución",
    recommendation: "Muchos cometen el error de enamorarse de una solución técnica (un bot complejo, una tecnología de moda) sin haber diagnosticado el dolor real del cliente. Primero se diagnostica el problema; la solución es una consecuencia."
  },
  {
    question: "¿Cómo se define el valor del 'Crecimiento Constante' en el ADN de la agencia?",
    options: [
      "Ser autodidacta, capacitarse continuamente y compartir aprendizajes con los compañeros del equipo.",
      "Exigir aumentos salariales mensuales basados únicamente en la antigüedad.",
      "Aprender únicamente cuando la empresa obliga formalmente a tomar un curso certificado.",
      "Guardarse los conocimientos para convertirse en una pieza imprescindible e irremplazable."
    ],
    answer: 0,
    category: "Crecimiento y Aprendizaje",
    recommendation: "El crecimiento constante no es pasivo: implica curiosidad, actitud autodidacta, ganas de capacitarse y generosidad para compartir los descubrimientos con el resto de la agencia."
  },
  {
    question: "Un cliente reporta que sus resultados no son los esperados. ¿Cuál es la reacción que refleja los valores de la agencia?",
    options: [
      "Activar la capacidad de reacción del equipo, revisar los datos y proponer ajustes ágiles sin esconderse del cliente.",
      "Esperar a que el cliente se calme solo antes de responderle para no generar más tensión.",
      "Culpar a los algoritmos de las plataformas y explicarle que no depende de la agencia.",
      "Reconocer el problema pero posponer los ajustes hasta el siguiente sprint semanal."
    ],
    answer: 0,
    category: "Enfoque en Problema vs Solución",
    recommendation: "Nuestro mayor valor ante el cliente es la capacidad de reacción. Cuando algo no anda bien, se da la cara con proactividad, se analizan los datos y se iteran los anuncios o procesos de inmediato."
  },
  {
    question: "¿Qué distingue a un colaborador con mentalidad de 'Crecimiento Constante' dentro de la agencia?",
    options: [
      "Aprende de forma autodidacta, aplica lo aprendido en su trabajo y comparte los hallazgos con el equipo.",
      "Solo se capacita cuando la agencia lo obliga formalmente con un curso o certificación obligatoria.",
      "Acumula conocimientos sin compartirlos para mantener una ventaja sobre sus compañeros.",
      "Espera a que su líder le indique exactamente qué aprender y cuándo hacerlo."
    ],
    answer: 0,
    category: "Crecimiento y Aprendizaje",
    recommendation: "El crecimiento constante no es pasivo: implica curiosidad, actitud autodidacta, ganas de capacitarse y generosidad para compartir los descubrimientos con el resto de la agencia."
  }
];

// ==========================================
// TEST 3: VENTAS POR WHATSAPP (10 preguntas directas)
// ==========================================
export const questionsSales: Question[] = [
  {
    question: "¿Qué acciones definen mejor el proceso de ventas según el curso?",
    options: [
      "Ayudar, persuadir, convencer, maquillar para que suene bien, hacer tomar una decisión, decir lo adecuado en el momento adecuado, seducir.",
      "Presionar, rogar, insistir hasta el cansancio, ocultar información, forzar una firma.",
      "Informar características, esperar a que el cliente decida, enviar catálogos, no molestar.",
      "Manipular, engañar, prometer cosas imposibles, ignorar las necesidades del cliente."
    ],
    answer: 0,
    category: "Proceso de Ventas",
    recommendation: "Recuerda que vender es ayudar al cliente a tomar una decisión que sea buena para él, diciendo ciertas palabras de cierta manera en el momento indicado, sin manipular ni presionar."
  },
  {
    question: "¿Por qué no deberías sentirte mal al hacer seguimiento?",
    options: [
      "Porque es un rol, además la persona está interesada y no te ha dicho que no.",
      "Porque el cliente siempre tiene la obligación de responderte rápido.",
      "Porque si no insistes, tu jefe te va a regañar por no cumplir la cuota.",
      "Porque a la gente le gusta que le insistan constantemente todos los días."
    ],
    answer: 0,
    category: "Seguimiento y Nurturing",
    recommendation: "El prospecto que llega a tu WhatsApp ya mostró interés previo. Tu rol es ayudarle a tomar una decisión. Si no ha dicho que no, debes seguir contactándolo porque los prospectos se enfrían rápidamente y se distraen."
  },
  {
    question: "¿En qué caso debes dejar de insistir para retomar un contacto?",
    options: [
      "Cuando dice que no lo quiere o no le sirve.",
      "Cuando tu intuición te dice que estás siendo demasiado insistente.",
      "Luego de dos o tres veces que no responda.",
      "Luego de dos o tres días consecutivos."
    ],
    answer: 0,
    category: "Seguimiento y Nurturing",
    recommendation: "El seguimiento profesional debe continuar mientras no exista una negativa explícita. Solo debes dejar de insistir cuando el cliente declare claramente que no lo quiere o no le sirve."
  },
  {
    question: "¿De qué forma puedo facilitar y mejorar la conversación?",
    options: [
      "Terminar todos los mensajes con una pregunta.",
      "Con mucha simpatía y siendo entretenido con emojis y signos de exclamación.",
      "Manteniendo siempre la amabilidad y buen servicio en todo momento.",
      "Esperar a que el prospecto sea quien formule todas las preguntas."
    ],
    answer: 0,
    category: "Habilidades de Comunicación",
    recommendation: "Terminar cada mensaje con una pregunta es el recurso táctico más efectivo: mantiene abierta la conversación, transfiere la iniciativa al prospecto y evita respuestas muertas."
  },
  {
    question: "¿Qué puedo decir para mejorar la tasa de asistencia a reuniones agendadas?",
    options: [
      "Una persona estará esperando por ti, por favor te pido agendar en tu calendario la fecha. En caso de no poder venir te pido que puedas avisarnos. ¿Puedo contar contigo, verdad?",
      "Te espero a la hora acordada, no llegues tarde porque mi tiempo vale.",
      "Ahí te mandé el link, conéctate si tienes tiempo libre.",
      "Recuerda nuestra reunión. Si no asistes, perderás esta gran oportunidad para siempre."
    ],
    answer: 0,
    category: "Compromiso y Cierre",
    recommendation: "Aplica el 'sesgo de coherencia'. Las personas sienten la necesidad psicológica de cumplir lo que afirman. Terminar con '¿Puedo contar contigo, verdad?' genera un compromiso moral que eleva la tasa de asistencia."
  },
  {
    question: "Para manejar las objeciones, la fórmula correcta es:",
    options: [
      "Concordar, manejar la objeción, cierre.",
      "Discutir, demostrar que el cliente se equivoca, exigir la compra.",
      "Ignorar la objeción, cambiar de tema, presionar el cierre.",
      "Aceptar la objeción, rendirse y despedirse amablemente."
    ],
    answer: 0,
    category: "Objeciones y Cierre",
    recommendation: "La fórmula infalible es: 1) Concordar (empatizar y validar la objeción para desarmar la resistencia), 2) Manejar la objeción con un conector y argumento sólido, y 3) Cierre por alternativa inmediato."
  },
  {
    question: "Un cierre por alternativa correcto sería:",
    options: [
      "¿Tienes alguna duda o quieres agendar?",
      "¿Prefieres que agendemos la hora o mejor no?",
      "¿Vas a comprar hoy o lo vas a pensar más tiempo?",
      "¿Te envío el contrato o ya no te interesa?"
    ],
    answer: 0,
    category: "Objeciones y Cierre",
    recommendation: "El cierre por alternativa debe ofrecer dos opciones cuyas respuestas sean positivas para ti. Evita preguntas abiertas de sí o no que inviten al rechazo o a la procrastinación."
  },
  {
    question: "Afirmación: El nombre siempre debe consultarse al inicio para dirigirte correctamente a la persona.",
    options: [
      "Falso: no sirve de nada tener el nombre de alguien que no te va a comprar, alargando la conversación inútilmente y arriesgando perder el contacto.",
      "Verdadero: siempre debes saber con quién hablas antes de decir cualquier otra palabra.",
      "Verdadero: es una regla de oro de la etiqueta en ventas que jamás debe romperse.",
      "Falso: se debe pedir nombre completo, cédula y dirección en el primer mensaje."
    ],
    answer: 0,
    category: "Rapport",
    recommendation: "No agregues fricción innecesaria al inicio pidiendo datos antes de entregar valor. Pide el nombre cuando la conversación avance hacia la confirmación o reserva."
  },
  {
    question: "¿Qué principios de persuasión puedo utilizar para presentar la oferta comercial?",
    options: [
      "Prueba social, urgencia, escasez, autoridad.",
      "Lástima, ruego, insistencia, desesperación.",
      "Simpatía excesiva, regalos costosos, promesas exageradas.",
      "Intimidación, superioridad, arrogancia, indiferencia."
    ],
    answer: 0,
    category: "Persuasión",
    recommendation: "Utiliza los principios de persuasión probados: Prueba social (testimonios y casos de éxito), Urgencia (tiempo limitado), Escasez (cupos reducidos) y Autoridad (respaldo técnico y experiencia)."
  },
  {
    question: "¿Es necesario utilizar un guión de ventas o es mejor una conversación natural?",
    options: [
      "Para vender se debe seguir siempre un guión para decir siempre lo mismo de la misma forma para no improvisar y cambiar cada vez.",
      "Vender no puede ser rígido, debe ser una conversación 100% improvisada para sonar natural.",
      "El guión solo sirve para la primera semana, luego debes confiar exclusivamente en la memoria.",
      "Se debe leer el guión de corrido sin escuchar lo que el prospecto escribe."
    ],
    answer: 0,
    category: "Uso del Guión",
    recommendation: "Vender profesionalmente requiere dominar una estructura predecible. Usar guiones probados (respuestas rápidas) garantiza consistencia, elimina la improvisación perjudicial y asegura altos ratios de conversión."
  }
];

// ==========================================
// TEST 4: METODOLOGÍA DE TRABAJO (Basado en Proceso de inducción 2)
// ==========================================
export const questionsWorkMethodology: Question[] = [
  {
    question: "Según la regla de 'Saludo + Mensaje', ¿cuál es la forma correcta de iniciar una conversación por WhatsApp con un compañero?",
    options: [
      "Enviar el saludo y el mensaje completo en un solo texto para no hacer esperar al receptor.",
      "Primero enviar 'Hola', esperar respuesta, luego preguntar '¿Cómo estás?', esperar, y recién después enviar el pedido.",
      "Enviar solo el mensaje sin saludo para ser más eficiente y no perder tiempo.",
      "Llamar siempre por teléfono en lugar de escribir para evitar malentendidos."
    ],
    answer: 0,
    category: "Comunicación Efectiva",
    recommendation: "La regla es clara: saludo y mensaje van juntos en un solo texto. La comunicación fragmentada ('Hola' → esperar → '¿Cómo estás?' → esperar → pedido) hace perder tiempo a todos. Un solo mensaje completo es más respetuoso y eficiente."
  },
  {
    question: "Según el modelo de 'Fuentes de Error', ¿cuántas posibilidades de no entenderse existen en una comunicación?",
    options: [
      "9 posibilidades, entre lo que pienso, quiero decir, creo decir, digo, quieres oír, oyes, crees entender, quieres entender y entiendes.",
      "3 posibilidades: emisor, mensaje y receptor.",
      "2 posibilidades: lo que se dice y lo que se entiende.",
      "6 posibilidades, una por cada canal de comunicación disponible en la agencia."
    ],
    answer: 0,
    category: "Comunicación Efectiva",
    recommendation: "Existen 9 posibilidades de no entenderse: entre lo que pienso, lo que quiero decir, lo que creo decir, lo que digo, lo que quieres oír, lo que oyes, lo que crees entender, lo que quieres entender y lo que finalmente entiendes. Por eso la claridad es fundamental."
  },
  {
    question: "Recibes un mensaje de WhatsApp de Andrés que dice solo 'ok'. Según la metodología, ¿qué debes hacer?",
    options: [
      "Si tienes dudas sobre la intención, preguntar directamente en lugar de interpretar el tono o el significado por tu cuenta.",
      "Asumir que está molesto contigo y disculparte inmediatamente para evitar conflictos.",
      "Ignorar el mensaje porque los mensajes cortos no requieren respuesta.",
      "Reenviar el mensaje al canal general del equipo para que alguien más lo interprete."
    ],
    answer: 0,
    category: "Comunicación Efectiva",
    recommendation: "La regla es 'Revela tu intención y NO interpretes'. Los emojis, el tono y los mensajes cortos por WhatsApp se prestan a múltiples lecturas. Ante la duda, pregunta directamente. No supongas intenciones."
  },
  {
    question: "Una tarea tuya lleva más tiempo del esperado y no puedes avanzar porque falta un acceso de un cliente. ¿Cuál es la acción correcta según la metodología Scrum-Ban?",
    options: [
      "Mover la tarjeta a estado 'Detenido' y enviar un mensaje al equipo para destrabarla de inmediato.",
      "Dejar la tarjeta en 'Doing' y esperar en silencio a que alguien pregunte qué pasó.",
      "Eliminar la tarjeta y crear una nueva con fecha posterior sin avisar.",
      "Continuar con otra tarea del Backlog sin actualizar el estado de la tarjeta bloqueada."
    ],
    answer: 0,
    category: "Scrum-Ban y Tarjetas",
    recommendation: "Cuando una tarea no puede avanzar, debes moverla a 'Detenido' y activar la comunicación para destrabarla. Dejar una tarjeta en 'Doing' sin poder avanzar engaña al equipo sobre el estado real del trabajo."
  },
  {
    question: "¿Cuál de las siguientes actitudes es lo que SÍ se espera de un colaborador en AvanzaSmart?",
    options: [
      "Plantear inquietudes y resolver los problemas en equipo manteniendo la transparencia.",
      "Tomar decisiones por cuenta propia cuando no estás de acuerdo con la tarea asignada.",
      "Ocultarle un problema al equipo mientras intentas resolverlo solo para no molestar.",
      "Usar la flexibilidad de tiempo aunque las tareas se retrasen."
    ],
    answer: 0,
    category: "Cultura de Equipo",
    recommendation: "Se espera transparencia y trabajo en equipo. Ocultar problemas o tomar decisiones unilaterales va en contra de la cultura de la agencia. Las dificultades se resuelven comunicándolas, no escondiéndolas."
  },
  {
    question: "Según el pilar de CALIDAD, ¿cuál es la responsabilidad del colaborador antes de entregar una tarea?",
    options: [
      "Leer lo que entregas y usar IA para revisar; no entregar asumiendo que otro compañero lo arreglará.",
      "Entregar lo más rápido posible sin revisar, ya que la velocidad es lo más importante.",
      "Esperar a que el product owner revise antes de marcar la tarea como entregada.",
      "Entregar solo cuando el cliente dé su aprobación explícita en el chat."
    ],
    answer: 0,
    category: "Compromiso y Calidad",
    recommendation: "La calidad es responsabilidad propia: leer lo que entregas, apoyarte en IA para revisar errores y no asumir que otro lo corregirá. Cada entrega debe tener nivel de 'entrega final', no de borrador."
  },
  {
    question: "¿Qué significa el pilar de PROACTIVIDAD en la metodología de trabajo de la agencia?",
    options: [
      "Empujar la tarjeta: pedir lo que te falta, actualizarla constantemente y comentar el avance.",
      "Esperar instrucciones detalladas antes de comenzar cualquier tarea para evitar errores.",
      "Proponer nuevas ideas de trabajo sin consultar con el equipo para demostrar iniciativa.",
      "Terminar primero las tareas del Backlog antes de las asignadas en el sprint activo."
    ],
    answer: 0,
    category: "Compromiso y Calidad",
    recommendation: "Ser proactivo significa comprometerte con la tarjeta: empújala, pide lo que te falta, actualiza su estado y deja comentarios. No esperes a que el trabajo llegue solo; muévelo tú."
  },
  {
    question: "Al finalizar una tarea y moverla al estado 'Done', ¿qué es indispensable incluir según el checklist de entrega?",
    options: [
      "Dejar el link de visualización o una captura de pantalla en los comentarios de la tarjeta.",
      "Enviar un mensaje de voz por WhatsApp personal al supervisor avisando que terminaste.",
      "Mover la tarjeta sin comentarios para no saturar el registro de actividad del sprint.",
      "Esperar a que el coordinador revise y sea él quien marque la tarea como Done."
    ],
    answer: 0,
    category: "Scrum-Ban y Tarjetas",
    recommendation: "El checklist de entrega exige: actualizar la tarjeta, completar el checklist, comentar con la entrega y dejar el link o captura visible. Quien revisa no debe buscar el trabajo; debe encontrarlo en la tarjeta."
  },
  {
    question: "¿Qué representa el pilar de COOPERACIÓN en la metodología de trabajo?",
    options: [
      "Dejar los accesos visibles, abrir los permisos y facilitar el trabajo de los demás compañeros.",
      "Ayudar a un compañero solo cuando no tienes tareas propias pendientes en el sprint.",
      "Compartir tus contraseñas personales con todo el equipo para agilizar los accesos.",
      "Resolver los problemas de otros antes que los propios para demostrar disposición."
    ],
    answer: 0,
    category: "Cultura de Equipo",
    recommendation: "Cooperación significa facilitar la vida del equipo: deja accesos visibles, abre permisos a tiempo y no esperes a que alguien te pida lo que ya sabes que necesita. El trabajo de todos fluye mejor cuando cada uno cuida su parte."
  },
  {
    question: "Según el enfoque esperado por la agencia, ¿en qué debe centrarse un colaborador al ejecutar sus tareas?",
    options: [
      "En los resultados: terminar lo que se le pide en el tiempo asignado con la calidad esperada.",
      "En el esfuerzo y las horas invertidas, ya que demuestran compromiso aunque no se termine.",
      "En el aspecto estético y la perfección, aunque esto signifique entregar fuera de plazo.",
      "En el pensamiento mágico: confiar en que si la intención es buena, el resultado será positivo."
    ],
    answer: 0,
    category: "Cultura de Equipo",
    recommendation: "La agencia premia resultados, no esfuerzo. Enfocarse en el esfuerzo, lo estético o la perfección en lugar de lo importante es una de las actitudes que expresamente NO se esperan de los colaboradores."
  }
];

// Helper to get questions for any test
export const getQuestionsForTest = (testId: TestId): Question[] => {
  switch (testId) {
    case 'clickup':
      return questionsClickUp;
    case 'core_values':
      return questionsCoreValues;
    case 'sales':
      return questionsSales;
    case 'work_methodology':
      return questionsWorkMethodology;
    default:
      return questionsClickUp;
  }
};

// General fallback recommendations dictionary
export const categoryRecommendations: Record<string, string> = {
  // ClickUp
  "Rutina e Inbox": "Prioriza siempre ingresar a Inicio / Bandeja de Entrada al arrancar el día para revisar menciones, comentarios y tareas asignadas para hoy.",
  "Vistas y Modo Yo": "En el tablero o listas, activa siempre el 'Modo Yo' (Me Mode) con filtro de fecha 'Hoy' y orden por prioridad para trabajar sin dispersión.",
  "Gestión de Sprint": "Respeta el Backlog como zona intocable de espera. Enfócate exclusivamente en las tarjetas activas de tu sprint diario.",
  "Estimación y Tiempos": "Recuerda que la Duración Estimada ya contiene un colchón para absorber imprevistos. No utilices puntos de sprint ni cronómetros manuales.",
  "Control de Flujo y Alertas": "Si una tarea sobrepasa el 50% de su duración estimada, pásala de inmediato a 'Detenido' y activa las alertas con tus compañeros.",
  "Cultura Operativa": "Aplica siempre 'Empuja la tarea': nunca abandones una tarea ni digas 'no se puede'. Busca accesos, pregunta proactivamente y evita frenar tarjetas de noche.",
  "Comunicación en Equipo": "Mantén actualizadas tus tarjetas en 'Doing' o 'Detenido' en tiempo real para que los coordinadores conozcan el estado sin tener que perseguirte.",
  "Estándar de Entrega": "Antes de pasar a 'Done', adjunta siempre el link directo o captura en los comentarios etiquetando (@) al revisor. La entrega debe ser inmediata y visible.",
  "Estandarización y Nomenclatura": "Aplica estrictamente el formato '[Cliente] - [Nombre de la tarea]' o 'Avanza - [Nombre de la tarea]' para que todo el equipo identifique el contexto al instante.",
  
  // Valores Medulares
  "Iteración Acelerada": "Refuerza la premisa 'mejor hecho que perfecto'. Enfócate en productos mínimos viables funcionales y ajusta en iteraciones rápidas.",
  "Agilidad Operativa": "Fomenta la flexibilidad ante imprevistos. Mantén reuniones de máximo un minuto por aporte y sé ágil para reubicar tareas según la necesidad del cliente.",
  "Cultura de Selección": "Ten siempre presente que los valores de colaboración, agilidad y proactividad son el filtro principal por sobre cualquier habilidad técnica aislada.",
  "Uso Crítico de IA": "Utiliza la inteligencia artificial con rigor: audita sus respuestas, detecta sesgos y valida los hechos con criterio humano antes de usarlos.",
  "Enfoque en Problema vs Solución": "No te apresures a proponer herramientas de moda. Comprende primero a fondo el dolor y la necesidad comercial del cliente.",
  "Crecimiento y Aprendizaje": "Mantén una mentalidad curiosa y autodidacta: aprende activamente y comparte tus hallazgos con el equipo.",

  // Ventas por WhatsApp
  "Proceso de Ventas": "Recuerda que vender es ayudar al cliente a tomar una decisión positiva para él mediante comunicación persuasiva y empática.",
  "Seguimiento y Nurturing": "El seguimiento constante y estratégico es la clave del cierre. No te sientas mal por insistir mientras el cliente no te diga explícitamente que no le interesa.",
  "Habilidades de Comunicación": "Termina siempre tus mensajes con una pregunta. Esto facilita la respuesta del prospecto y mantiene viva la interacción.",
  "Compromiso y Cierre": "Aplica el sesgo de coherencia. Busca el compromiso del prospecto ('¿Puedo contar contigo, verdad?') para elevar la asistencia.",
  "Objeciones y Cierre": "Sigue la fórmula: concordar (empatizar), manejar con un conector y cerrar inmediatamente por alternativa.",
  "Rapport": "No pidas datos personales de forma prematura; hazlo en el momento de la confirmación explicando su utilidad.",
  "Persuasión": "Integra principios de persuasión como prueba social, urgencia legítima y escasez para acelerar la toma de decisiones.",
  "Uso del Guión": "Apóyate en guiones probados para mantener consistencia y evitar la improvisación que diluye las ventas.",

  // Metodología de Trabajo
  "Comunicación Efectiva": "Aplica siempre Saludo + Mensaje en un solo texto, revela tu intención y no interpretes, mantén informado al equipo y sobrecomunica pero sintetiza.",
  "Scrum-Ban y Tarjetas": "Actualiza tu tarjeta en tiempo real (Doing → Detenido → Done), empuja la tarea ante cualquier bloqueo y siempre deja el link de entrega en los comentarios.",
  "Cultura de Equipo": "La agencia espera transparencia, trabajo colaborativo y enfoque en resultados. Ocultar problemas, tomar decisiones solas o centrarse en el esfuerzo en lugar del resultado va en contra de la cultura.",
  "Compromiso y Calidad": "Lee lo que entregas, usa IA para revisar y empuja proactivamente tus tarjetas. La calidad y la proactividad son responsabilidad tuya, no del revisor."
};
