/* Preguntas frecuentes del buscador: cada una lleva los pasajes del capítulo (ids de los átomos
   de respuestas.ts) que se enseñan primero, rotulados «Pregunta frecuente», cuando la búsqueda se
   le parece. Las 50 se revisaron y aprobaron una a una el 8-10-2026 (docs/FRECUENTES.md). La
   pregunta y sus «variantes» (otras formas de preguntarlo) son texto de la app; los pasajes, texto
   literal del capítulo. Para cambiar una, se edita aquí y se vuelve a pasar la revisión. */

export interface Frecuente {
  id: string;
  tema: string;
  pregunta: string;
  variantes: string[];
  pasajes: string[];
}

export const FRECUENTES: Frecuente[] = [
  {
    id: "f01",
    tema: "Selección e indicación",
    pregunta: "¿Hace falta una HbA1c alta o un umbral concreto para indicar un sistema AID?",
    variantes: [
      "umbral de HbA1c para poner un asa cerrada",
      "criterios para indicar un sistema AID",
      "con buena HbA1c se puede poner asa cerrada",
    ],
    pasajes: ["t/06-indicaciones/b2/3", "t/06-indicaciones/b1/1"],
  },
  {
    id: "f02",
    tema: "Selección e indicación",
    pregunta: "¿A quién priorizar cuando no hay sistemas para todos?",
    variantes: [
      "priorización del asa cerrada con recursos limitados",
      "a quién dar primero un sistema AID",
    ],
    pasajes: ["t/06-indicaciones/b2/0", "t/06-indicaciones/b2/1", "t/06-indicaciones/b2/2"],
  },
  {
    id: "f03",
    tema: "Selección e indicación",
    pregunta: "¿Hace falta experiencia previa con bomba o sensor para empezar?",
    variantes: [
      "requisitos previos para el asa cerrada",
      "puede empezar sin haber usado bomba",
      "sin experiencia en MCG se puede iniciar",
    ],
    pasajes: ["t/06-indicaciones/b3/0", "t/06-indicaciones/b3/1"],
  },
  {
    id: "f04",
    tema: "Selección e indicación",
    pregunta: "¿Cuándo hay que tener precaución al indicar un AID?",
    variantes: [
      "contraindicaciones del asa cerrada",
      "cuándo no poner un sistema AID",
      "situaciones de precaución",
    ],
    pasajes: ["t/06-indicaciones/b3/2"],
  },
  {
    id: "f05",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué sistemas AID hay en España?",
    variantes: [
      "sistemas comercializados en España",
      "qué bombas de asa cerrada hay",
      "qué sistemas automáticos existen",
    ],
    pasajes: ["t/04-sistemas/b1/0", "t/04-sistemas/b1/2"],
  },
  {
    id: "f06",
    tema: "Sistemas y parámetros",
    pregunta: "¿Desde qué edad, peso y dosis se puede usar cada sistema?",
    variantes: [
      "edad mínima de cada sistema",
      "indicación por edad y peso",
      "dosis total mínima para cada bomba",
    ],
    pasajes: ["T1/7"],
  },
  {
    id: "f07",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué parámetros influyen en el modo automático de cada sistema?",
    variantes: [
      "qué mueve el automático",
      "qué parámetros cambian el algoritmo",
      "qué se puede ajustar en modo automático",
    ],
    pasajes: ["T1/10", "T1/nota/0/0"],
  },
  {
    id: "f08",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué objetivo de glucosa se puede programar en cada sistema?",
    variantes: [
      "objetivo glucémico del algoritmo",
      "objetivo en modo automático de cada bomba",
      "target de cada sistema",
    ],
    pasajes: ["T1/6", "T3/0"],
  },
  {
    id: "f09",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué sistemas hacen autocorrecciones?",
    variantes: [
      "bolos automáticos de corrección",
      "qué bomba autocorrige",
      "hace correcciones solo el sistema",
    ],
    pasajes: ["T1/5"],
  },
  {
    id: "f10",
    tema: "Sistemas y parámetros",
    pregunta: "¿Por qué hay que seguir anunciando las comidas en un sistema híbrido?",
    variantes: [
      "hace falta el bolo de la comida en asa cerrada",
      "por qué el sistema no lo hace todo solo",
      "anuncio de comidas en sistemas híbridos",
    ],
    pasajes: ["t/03-algoritmos/b2/0", "t/03-algoritmos/b2/1", "t/03-algoritmos/b2/2"],
  },
  {
    id: "f11",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué es Liberty y quién puede usarlo?",
    variantes: ["asa cerrada completa", "sistema sin bolos para las comidas", "CamAPS Liberty"],
    pasajes: ["t/03-algoritmos/b3/1", "t/03-algoritmos/b3/2"],
  },
  {
    id: "f12",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué sistemas están autorizados en la gestación?",
    variantes: [
      "asa cerrada en el embarazo",
      "qué bomba usar en una embarazada",
      "autorización en gestación",
    ],
    pasajes: ["T1/8", "t/10-situaciones/b3/2", "t/10-situaciones/b3/3"],
  },
  {
    id: "f13",
    tema: "Inicio del sistema",
    pregunta: "¿Qué hay que tener listo antes de iniciar el sistema?",
    variantes: [
      "plan de respaldo antes de empezar",
      "preparación antes del inicio",
      "qué entregar antes de activar el automático",
    ],
    pasajes: ["T2/0", "l/07-educacion/b4"],
  },
  {
    id: "f14",
    tema: "Inicio del sistema",
    pregunta: "¿Cuánto reducir la dosis al pasar de MDI a un sistema AID?",
    variantes: [
      "reducción de la DTD al pasar de plumas a bomba",
      "transición desde MDI dosis inicial",
      "cuánto bajo la insulina al empezar con la bomba",
    ],
    pasajes: ["T2/2", "t/08-iniciacion/b7/0"],
  },
  {
    id: "f15",
    tema: "Inicio del sistema",
    pregunta: "¿Cómo calcular la ratio y el factor de sensibilidad iniciales?",
    variantes: [
      "regla del 450 y del 1700",
      "ratio inicial insulina hidratos",
      "factor de sensibilidad al inicio",
    ],
    pasajes: ["T2/4", "T2/5", "t/08-iniciacion/b6/1"],
  },
  {
    id: "f16",
    tema: "Inicio del sistema",
    pregunta: "¿Qué basal inicial programar si no hay un patrón previo?",
    variantes: ["tasa basal inicial", "perfil basal al empezar", "basal plana al inicio"],
    pasajes: ["T2/3", "t/08-iniciacion/b8/1"],
  },
  {
    id: "f17",
    tema: "Inicio del sistema",
    pregunta: "¿Qué hacer con la glargina U-300 o la degludec al iniciar el sistema?",
    variantes: [
      "solapamiento con basal ultralarga",
      "última dosis de degludec antes de la bomba",
      "efecto residual de la basal al empezar",
    ],
    pasajes: ["T2/8", "t/08-iniciacion/b7/1"],
  },
  {
    id: "f18",
    tema: "Inicio del sistema",
    pregunta: "¿Cada cuánto revisar al paciente tras iniciar el sistema?",
    variantes: [
      "seguimiento de los primeros 3 meses",
      "cuándo citar después del inicio",
      "primeras visitas tras empezar",
    ],
    pasajes: ["t/08-iniciacion/b9/0", "t/08-iniciacion/b9/1"],
  },
  {
    id: "f19",
    tema: "Educación y plan de seguridad",
    pregunta: "¿Qué contenidos debe tener la educación del paciente?",
    variantes: [
      "qué enseñar antes de empezar",
      "contenidos del programa educativo",
      "PEET contenidos mínimos",
    ],
    pasajes: ["l/07-educacion/b3"],
  },
  {
    id: "f20",
    tema: "Educación y plan de seguridad",
    pregunta: "¿Qué debe incluir el plan de seguridad?",
    variantes: [
      "qué lleva el plan de seguridad",
      "material de respaldo que debe tener el paciente",
      "plan de seguridad del asa cerrada",
    ],
    pasajes: ["l/07-educacion/b4"],
  },
  {
    id: "f21",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cómo revisar una descarga de forma ordenada?",
    variantes: [
      "pasos para leer la descarga",
      "análisis de la descarga en consulta",
      "por dónde empiezo a mirar la descarga",
    ],
    pasajes: ["t/09-descarga/b1/2", "T5/nota/1/2"],
  },
  {
    id: "f22",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cuánto uso del sensor hace falta para interpretar la descarga?",
    variantes: [
      "uso mínimo de MCG para valorar",
      "datos suficientes de sensor",
      "porcentaje de uso del sensor",
    ],
    pasajes: ["T5/0"],
  },
  {
    id: "f23",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué objetivos de TIR, TBR y TAR hay que buscar?",
    variantes: [
      "objetivos de MCG",
      "tiempo en rango objetivo",
      "cuánto tiempo por debajo del rango se acepta",
    ],
    pasajes: ["t/05-resultados/b2/0", "t/05-resultados/b2/1", "t/05-resultados/b2/2"],
  },
  {
    id: "f24",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cuánto se pueden cambiar los parámetros de una vez?",
    variantes: [
      "porcentaje de ajuste de ratio o basal",
      "cuánto modificar el factor de sensibilidad",
      "cada cuánto reevaluar un cambio",
    ],
    pasajes: ["t/09-descarga/b2/0", "t/09-descarga/b2/1"],
  },
  {
    id: "f25",
    tema: "Descarga y seguimiento",
    pregunta: "Hay hipoglucemias en la descarga: ¿qué revisar antes de intensificar?",
    variantes: [
      "TBR alto qué hacer",
      "tiempo por debajo del rango elevado",
      "antes de bajar el objetivo con hipoglucemias",
    ],
    pasajes: ["t/09-descarga/b10/0", "t/09-descarga/b10/1", "t/05-resultados/b7/1"],
  },
  {
    id: "f26",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué significa un exceso de autocorrecciones?",
    variantes: [
      "muchos bolos automáticos de corrección",
      "demasiadas autocorrecciones en la descarga",
    ],
    pasajes: ["t/09-descarga/b11/0", "t/09-descarga/b11/1"],
  },
  {
    id: "f27",
    tema: "Descarga y seguimiento",
    pregunta: "El paciente sale a menudo del modo automático: ¿qué hacer?",
    variantes: [
      "salidas repetidas del modo automático",
      "poco tiempo en automático",
      "se cae del automático",
    ],
    pasajes: ["t/09-descarga/b12/0", "t/09-descarga/b22/1", "T5/0"],
  },
  {
    id: "f28",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué revisar ante hipoglucemias nocturnas repetidas?",
    variantes: [
      "hipoglucemia nocturna en asa cerrada",
      "bajadas de madrugada",
      "hipos por la noche con la bomba",
    ],
    pasajes: ["t/09-descarga/b7/0", "t/09-descarga/b7/1"],
  },
  {
    id: "f29",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué son los hidratos fantasma y qué hacer si se detectan?",
    variantes: ["ghost carbs", "meter hidratos falsos para forzar un bolo", "hidratos de mentira"],
    pasajes: ["t/09-descarga/b21/0", "t/09-descarga/b21/1", "t/09-descarga/b21/2"],
  },
  {
    id: "f30",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cómo manejar un bolo olvidado o retrasado?",
    variantes: ["se olvidó el bolo de la comida", "bolo tarde qué hacer", "bolo omitido"],
    pasajes: ["t/09-descarga/b20/1", "t/09-descarga/b20/2"],
  },
  {
    id: "f31",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Cuándo sospechar un fallo del set de infusión?",
    variantes: [
      "signos de que el set no funciona",
      "hiperglucemia que no baja con la bomba",
      "sospecha de fallo de infusión",
    ],
    pasajes: ["t/09-descarga/b16/0", "t/09-descarga/b16/2", "t/09-descarga/b16/4"],
  },
  {
    id: "f32",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué hacer según la cifra de cetonemia?",
    variantes: [
      "tramos de cetonas",
      "cetonas en sangre qué hacer",
      "β-OHB qué significa cada cifra",
    ],
    pasajes: ["l/09-descarga/b17"],
  },
  {
    id: "f33",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué dosis de insulina con pluma si no hay un plan específico?",
    variantes: [
      "corrección con pluma en UI por kilo",
      "dosis de rescate con pluma",
      "cuánta insulina con pluma por cetonas",
    ],
    pasajes: ["t/09-descarga/b19/0", "F3/naranja", "F3/nota"],
  },
  {
    id: "f34",
    tema: "Incidencias y cetonemia",
    pregunta: "¿El sistema cuenta la insulina puesta con pluma?",
    variantes: [
      "la insulina de la pluma cuenta como activa",
      "riesgo de apilamiento con la pluma",
      "cuándo repetir la corrección con pluma",
    ],
    pasajes: ["F3/pie/0", "t/09-descarga/b19/2"],
  },
  {
    id: "f35",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Cuándo hay que ir a urgencias por cetonas?",
    variantes: ["signos de cetoacidosis", "cuándo derivar al hospital", "cetonas altas urgencias"],
    pasajes: ["F3/rojo"],
  },
  {
    id: "f36",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué vigilar en una persona tratada con iSGLT2?",
    variantes: [
      "gliflozinas y asa cerrada",
      "iSGLT2 cetoacidosis euglucémica",
      "toma dapagliflozina o empagliflozina",
    ],
    pasajes: ["t/09-descarga/b16/1", "F3/pie/1"],
  },
  {
    id: "f37",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Cuántos hidratos dar en una hipoglucemia leve con un sistema AID?",
    variantes: [
      "tratar una hipoglucemia con asa cerrada",
      "gramos de azúcar para una bajada",
      "regla de los 15 gramos en AID",
    ],
    pasajes: ["t/07-educacion/b7/0", "t/07-educacion/b7/1"],
  },
  {
    id: "f38",
    tema: "Interrupción del sistema",
    pregunta: "¿Cuánto tiempo puede estar desconectado el sistema?",
    variantes: [
      "desconectar la bomba un rato",
      "cuánto tiempo sin bomba",
      "interrupción breve del sistema",
    ],
    pasajes: ["t/07-educacion/b11/4", "t/07-educacion/b11/1"],
  },
  {
    id: "f39",
    tema: "Interrupción del sistema",
    pregunta: "¿Qué dosis basal poner en la pauta alternativa con plumas?",
    variantes: ["pasar a plumas si falla la bomba", "basal de respaldo", "pauta alternativa MDI"],
    pasajes: ["t/07-educacion/b13/0", "t/07-educacion/b13/1"],
  },
  {
    id: "f40",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué pasa con las lecturas bajas al dormir sobre el sensor?",
    variantes: [
      "compresión del sensor",
      "hipoglucemias falsas por la noche",
      "baja la glucosa al apoyarse en el sensor",
    ],
    pasajes: ["t/09-descarga/b23/0", "t/09-descarga/b23/1"],
  },
  {
    id: "f41",
    tema: "Situaciones especiales",
    pregunta: "¿Cómo preparar el ejercicio con un sistema AID?",
    variantes: [
      "modo ejercicio antes de entrenar",
      "ejercicio aeróbico con asa cerrada",
      "objetivo temporal para el deporte",
    ],
    pasajes: ["t/10-situaciones/b20/1", "t/10-situaciones/b22/0", "t/10-situaciones/b22/1"],
  },
  {
    id: "f42",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede hacer ejercicio con la glucosa alta?",
    variantes: [
      "ejercicio con hiperglucemia",
      "deporte con cetonas",
      "glucosa por encima de 270 y ejercicio",
    ],
    pasajes: ["t/10-situaciones/b20/2", "t/10-situaciones/b20/3"],
  },
  {
    id: "f43",
    tema: "Situaciones especiales",
    pregunta: "¿Qué hacer con la bomba o el sensor en una resonancia o un TC?",
    variantes: [
      "resonancia magnética con bomba",
      "TAC con el sensor puesto",
      "pruebas de imagen y asa cerrada",
    ],
    pasajes: ["T6/0", "T6/1", "t/10-situaciones/b41/2"],
  },
  {
    id: "f44",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede mantener el sistema en una cirugía?",
    variantes: ["operación con la bomba puesta", "cirugía y asa cerrada", "quirófano con AID"],
    pasajes: ["T6/6", "T6/7"],
  },
  {
    id: "f45",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede mantener el sistema durante un ingreso?",
    variantes: [
      "asa cerrada en el hospital",
      "ingreso hospitalario con bomba",
      "cuándo retirar el sistema en planta",
    ],
    pasajes: ["t/10-situaciones/b34/0", "t/10-situaciones/b34/3", "t/10-situaciones/b36/0"],
  },
  {
    id: "f46",
    tema: "Situaciones especiales",
    pregunta: "¿Qué objetivos glucémicos hay en la gestación?",
    variantes: ["HbA1c objetivo en el embarazo", "TIR en gestación", "objetivos preconcepcionales"],
    pasajes: ["t/10-situaciones/b4/1", "t/10-situaciones/b4/2", "t/10-situaciones/b4/3"],
  },
  {
    id: "f47",
    tema: "Situaciones especiales",
    pregunta: "Con cetosis y glucemia normal en una enfermedad, ¿se suspende la insulina?",
    variantes: [
      "vómitos y cetonas con glucosa normal",
      "enfermedad intercurrente con cetosis",
      "no come y tiene cetonas",
    ],
    pasajes: ["t/10-situaciones/b27/2", "t/10-situaciones/b27/1"],
  },
  {
    id: "f48",
    tema: "Situaciones especiales",
    pregunta: "¿Qué hacer si un paciente usa un sistema DIY?",
    variantes: [
      "AndroidAPS o Loop casero",
      "sistemas de código abierto en consulta",
      "paciente con asa cerrada hecha en casa",
    ],
    pasajes: ["t/11-diy/b3/0", "t/11-diy/b3/1"],
  },
  {
    id: "f49",
    tema: "Situaciones especiales",
    pregunta: "¿Qué recomendar sobre el alcohol con un sistema AID?",
    variantes: [
      "salir de fiesta con la bomba",
      "alcohol e hipoglucemia diferida",
      "beber alcohol con asa cerrada",
    ],
    pasajes: ["t/10-situaciones/b14/2"],
  },
  {
    id: "f50",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede mantener el sistema con glucocorticoides?",
    variantes: ["corticoides y asa cerrada", "dexametasona con la bomba", "Boost con corticoides"],
    pasajes: ["t/10-situaciones/b29/0", "t/10-situaciones/b29/1", "t/10-situaciones/b29/2"],
  },
];
