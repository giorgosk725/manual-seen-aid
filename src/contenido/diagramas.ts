/* Diagramas construidos a partir del texto del capítulo. No añaden contenido: reorganizan en
   forma visual cifras y frases LITERALES del capítulo, cada una con su página. La auditoría de
   fidelidad (scripts/auditoria) comprueba que cada cifra está en la página indicada. */
import type { Tramo } from "./tipos";

export type DiagramaId =
  | "objetivos-mcg"
  | "cetonemia"
  | "ejercicio"
  | "seguimiento"
  | "algoritmos"
  | "hipoglucemia"
  | "transicion"
  | "gestacion-sistemas"
  | "hospital"
  | "exploraciones"
  | "eleccion"
  | "interrupcion";

export interface DiagramaMeta {
  id: DiagramaId;
  titulo: string;
  /* Qué enseña, en una línea (interfaz). */
  resumen: string;
  paginas: number[];
  /* Apartado donde se inserta (slug). */
  apartado: string;
  /* Diagramas añadidos después de la 0.3.0: no ocupan un bloque del apartado (así no cambian
     las anclas b1, b2…) y se muestran tras esta ancla: id de tabla o figura (después de ella),
     id de subapartado (al final de ese subapartado) o id de bloque «bN» (después de él). */
  ancla?: string;
}

export const DIAGRAMAS: DiagramaMeta[] = [
  {
    id: "objetivos-mcg",
    titulo: "Objetivos de MCG",
    resumen:
      "Las franjas de glucosa y su objetivo de tiempo en adultos, gestación, hospital y fragilidad.",
    paginas: [4, 17, 19, 20],
    apartado: "05-resultados",
  },
  {
    id: "cetonemia",
    titulo: "Escala de cetonemia (β-OHB)",
    resumen: "Los cuatro tramos operativos a escala, con los umbrales de ejercicio y de rescate.",
    paginas: [8, 15, 19],
    apartado: "09-descarga",
  },
  {
    id: "ejercicio",
    titulo: "Glucemia y ejercicio",
    resumen: "Cuándo empezar, cuándo retrasar y cuándo medir cetonemia; antes, durante y después.",
    paginas: [19],
    apartado: "10-situaciones",
  },
  {
    id: "seguimiento",
    titulo: "Calendario de seguimiento",
    resumen: "De las primeras 72 h a la reevaluación anual: qué se hace en cada contacto.",
    paginas: [12],
    apartado: "08-iniciacion",
  },
  {
    id: "algoritmos",
    titulo: "Los cuatro algoritmos de un vistazo",
    resumen: "Dónde vive el algoritmo, cada cuánto actúa, hasta dónde predice y si autocorrige.",
    paginas: [3, 4],
    apartado: "04-sistemas",
  },
  {
    id: "hipoglucemia",
    titulo: "Hipoglucemia en asa cerrada",
    resumen: "Cuántos hidratos según glucemia, flecha e insulina activa, y cómo reevaluar.",
    paginas: [8],
    apartado: "07-educacion",
  },
  {
    id: "transicion",
    titulo: "Transición desde MDI",
    resumen:
      "Los pasos de la Tabla 2 en orden: respaldo, DTD, basal, ratio, sensibilidad, solapamiento.",
    paginas: [10],
    apartado: "08-iniciacion",
  },
  {
    id: "gestacion-sistemas",
    titulo: "Gestación, sistema a sistema",
    resumen:
      "Autorización, ensayo, objetivo configurable y estrategia de intensificación de cada sistema.",
    paginas: [4, 17, 18],
    apartado: "10-situaciones",
    ancla: "gestacion",
  },
  {
    id: "hospital",
    titulo: "Hospital: cuándo no continuar el sistema",
    resumen:
      "Cuándo mantenerlo, cuándo no es apropiado y cómo pasar a la pauta alternativa y volver.",
    paginas: [20, 21, 22],
    apartado: "10-situaciones",
    ancla: "b36",
  },
  {
    id: "exploraciones",
    titulo: "Exploraciones: bomba o pod y sensor",
    resumen: "La Tabla 6 como mapa: qué se retira, qué depende del modelo y qué se mantiene.",
    paginas: [21, 22],
    apartado: "10-situaciones",
    ancla: "T6",
  },
  {
    id: "eleccion",
    titulo: "Elección compartida del sistema",
    resumen:
      "La Figura 2 dibujada: perfil de la persona, características del sistema y contexto asistencial.",
    paginas: [6],
    apartado: "06-indicaciones",
    ancla: "F2",
  },
  {
    id: "interrupcion",
    titulo: "Interrupción del sistema, según su duración",
    resumen: "De la interrupción muy breve a la prolongada: qué hacer en cada tramo de tiempo.",
    paginas: [9],
    apartado: "07-educacion",
    ancla: "interrupcion",
  },
];

/* ---------- Objetivos de MCG (escalera tipo AGP, de la franja alta a la baja) ---------- */
export type TonoFranja = "muy-alto" | "alto" | "rango" | "estrecho" | "bajo" | "muy-bajo";

export interface FranjaObjetivo {
  franja: string; // «> 250 mg/dl»
  objetivo: string; // «< 5 %»
  nota?: string; // «TAR de nivel 2»
  tono: TonoFranja;
}

export interface PoblacionObjetivos {
  id: string;
  nombre: string;
  pagina: number;
  franjas: FranjaObjetivo[];
  extras: string[];
  aviso?: string;
}

export const OBJETIVOS_MCG: PoblacionObjetivos[] = [
  {
    id: "general",
    nombre: "Adultos no gestantes",
    pagina: 4,
    franjas: [
      { franja: "> 250 mg/dl", objetivo: "< 5 %", nota: "TAR de nivel 2", tono: "muy-alto" },
      { franja: "> 180 mg/dl", objetivo: "—", nota: "TAR: complementa al TIR", tono: "alto" },
      {
        franja: "70-180 mg/dl",
        objetivo: "> 70 %",
        nota: "TIR: métrica principal de control global",
        tono: "rango",
      },
      {
        franja: "< 70 mg/dl",
        objetivo: "< 4 %",
        nota: "TBR: indicador prioritario de seguridad",
        tono: "bajo",
      },
      { franja: "< 54 mg/dl", objetivo: "< 1 %", nota: "TBR", tono: "muy-bajo" },
    ],
    extras: [
      "Coeficiente de variación ≤ 36 %",
      "TITR 70-140 mg/dl: métrica complementaria de optimización, individualizada y acordada con la persona (p. 5)",
    ],
  },
  {
    id: "gestacion",
    nombre: "Gestación",
    pagina: 17,
    franjas: [
      { franja: "> 140 mg/dl", objetivo: "< 25 %", nota: "TARp", tono: "alto" },
      { franja: "63–140 mg/dl", objetivo: ">70 %", nota: "TIRp", tono: "rango" },
      { franja: "< 63 mg/dl", objetivo: "<4 %", nota: "TBRp", tono: "bajo" },
      { franja: "< 54 mg/dl", objetivo: "<1 %", nota: "TBRp", tono: "muy-bajo" },
    ],
    extras: [
      "Coeficiente de variación ≤36 %",
      "HbA1c preconcepcional <6,5 %; durante la gestación <6,0 % (hasta <7,0 % para evitar hipoglucemia significativa)",
    ],
  },
  {
    id: "hospital",
    nombre: "Hospital (adultos no críticos)",
    pagina: 20,
    franjas: [
      { franja: "> 250 mg/dl", objetivo: "<5 %", nota: "TAR", tono: "muy-alto" },
      { franja: "> 180 mg/dl", objetivo: "<25 %", nota: "TAR", tono: "alto" },
      { franja: "70–180 mg/dl", objetivo: ">60 %", nota: "TIR", tono: "rango" },
      {
        franja: "70–100 mg/dl",
        objetivo: "<15 %",
        nota: "tiempo próximo a hipoglucemia",
        tono: "estrecho",
      },
      { franja: "< 70 mg/dl", objetivo: "0 %", nota: "TBR", tono: "bajo" },
    ],
    extras: ["Objetivos orientativos, fundamentalmente a partir de consenso de expertos"],
    aviso: "No deben extrapolarse directamente a población pediátrica.",
  },
  {
    id: "fragilidad",
    nombre: "Mayores con fragilidad",
    pagina: 19,
    franjas: [{ franja: "< 70 mg/dl", objetivo: "<1%", nota: "objetivo primario", tono: "bajo" }],
    extras: [
      "Con autonomía conservada, objetivos equivalentes a la población general",
      "En fragilidad o expectativa de vida limitada se relajan, priorizando evitar la hipoglucemia y limitar la carga terapéutica",
    ],
  },
];

/* ---------- Escala de cetonemia ---------- */
export interface TramoEscala {
  clave: Tramo;
  desde: number; // mmol/l
  hasta: number; // mmol/l (el último, tope visual)
  etiqueta: string;
  accion: string;
  p: number;
}

export const ESCALA_CETONEMIA: {
  tramos: TramoEscala[];
  marcas: { valor: number; texto: string; p: number }[];
  tope: number;
} = {
  tope: 4,
  tramos: [
    {
      clave: "verde",
      desde: 0,
      hasta: 0.6,
      etiqueta: "<0,6 · sin cetosis significativa",
      accion:
        "Si la hiperglucemia persiste o no responde a una corrección, mantener la sospecha de fallo de infusión, administrar la corrección con pluma y recambiar el set/pod según el plan de seguridad.",
      p: 15,
    },
    {
      clave: "amarillo",
      desde: 0.6,
      hasta: 1.0,
      etiqueta: "0,6–0,9 · cetonemia leve",
      accion:
        "Vigilancia estrecha, revisión del sistema y reevaluación de glucemia y cetonemia en 1–2 h. Si la hiperglucemia no responde o existe sospecha de fallo de infusión, administrar la corrección con pluma y recambiar el set/pod. Si β-OHB aumenta a ≥1,0 mmol/l, seguir las recomendaciones del tramo siguiente.",
      p: 15,
    },
    {
      clave: "naranja",
      desde: 1.0,
      hasta: 3.0,
      etiqueta: "1,0–2,9 · cetosis significativa / probable fallo de infusión",
      accion:
        "Administrar la corrección con pluma y recambiar el set/pod según el plan de seguridad.",
      p: 15,
    },
    {
      clave: "rojo",
      desde: 3.0,
      hasta: 4,
      etiqueta: "≥3,0 o signos de gravedad · posible cetoacidosis diabética",
      accion: "Valoración hospitalaria urgente.",
      p: 15,
    },
  ],
  marcas: [
    {
      valor: 1.0,
      texto:
        "≥1,0 mmol/l en contexto de hiperglucemia persistente o sospecha de fallo de infusión: debe aplicarse previamente el algoritmo de la figura 3 (antes del ejercicio)",
      p: 19,
    },
    {
      valor: 1.5,
      texto: "≥1,5 mmol/l: evitar el ejercicio, con independencia de la glucemia",
      p: 19,
    },
    {
      valor: 1.5,
      texto: "β-OHB ≥1,5 mmol/l: puede considerarse 0,15 UI/kg* como dosis total de rescate",
      p: 8,
    },
  ],
};

/* ---------- Glucemia y ejercicio ---------- */
export const EJERCICIO = {
  pagina: 19,
  escala: { min: 40, max: 320 },
  zonas: [
    {
      desde: 40,
      hasta: 90,
      etiqueta: "<90 mg/dl",
      texto: "deben administrarse hidratos de carbono y retrasar el inicio",
      tono: "bajo" as TonoFranja,
    },
    {
      desde: 126,
      hasta: 180,
      etiqueta: "126–180 mg/dl",
      texto: "se recomienda iniciar el ejercicio con una glucemia de 126–180 mg/dl",
      tono: "rango" as TonoFranja,
    },
    {
      desde: 270,
      hasta: 320,
      etiqueta: "> 270 mg/dl",
      texto: "debe medirse la cetonemia y descartarse un fallo de infusión",
      tono: "muy-alto" as TonoFranja,
    },
  ],
  marca: {
    valor: 126,
    texto:
      "Durante: si la glucosa baja de unos 126 mg/dl, hidratos rápidos (orientativamente 10-20 g), sin anunciarlos al sistema. Estas cantidades se refieren a la prevención del descenso glucémico durante la actividad y no sustituyen el tratamiento de una hipoglucemia ya establecida.",
  },
  fases: [
    {
      titulo: "Antes",
      items: [
        "Valorar la glucemia de partida, su tendencia y la insulina activa: un bolo reciente o una flecha descendente aumentan el riesgo de hipoglucemia.",
        "Actividad planificada con descenso esperado: elevar el objetivo glucémico, iniciado 1-2 h antes de la actividad.",
        "Solo de forma complementaria, si el ejercicio se realiza en las 2 h siguientes a una comida rica en hidratos, se reduce además el bolo prandial en un 25-33 %.",
        "Si la β-OHB es ≥1,0 mmol/l en contexto de hiperglucemia persistente o sospecha de fallo de infusión, debe aplicarse previamente el algoritmo de la figura 3.",
        "Evitar el ejercicio con cetonemia ≥1,5 mmol/l, con independencia de la glucemia.",
      ],
    },
    {
      titulo: "Durante",
      items: [
        "Vigilar las lecturas y las flechas de tendencia.",
        "Comprobar la glucosa del sensor a los 20–30 min y repetir la ingesta si es necesario.",
        "Esfuerzo breve y de alta intensidad o anaeróbico: suele preferirse mantener el objetivo habitual y evitar sobrecorregir la hiperglucemia reactiva.",
        "Desconexiones superiores a 1 h: pueden aumentar el riesgo de hiperglucemia y cetosis.",
      ],
    },
    {
      titulo: "Después",
      items: [
        "Mantener el objetivo más alto o el modo de ejercicio durante un tiempo y vigilar la noche siguiente.",
        "Superada esa ventana, debe desactivarse para no perpetuar una hiperglucemia por un objetivo elevado mantenido de más.",
      ],
    },
  ],
};

/* ---------- Calendario de seguimiento ---------- */
export const SEGUIMIENTO = {
  pagina: 12,
  hitos: [
    {
      cuando: "Primeras 72 h",
      tipo: "Contacto remoto",
      que: "Resolución de dudas, revisión de alarmas e identificación de salidas a modo manual.",
    },
    {
      cuando: "1 semana",
      tipo: "Contacto remoto",
      que: "Resolución de dudas, revisión de alarmas e identificación de salidas a modo manual.",
    },
    {
      cuando: "2-4 semanas",
      tipo: "Revisión presencial",
      que: "Ajustes finos (ratios y objetivos configurables), incorporación de modos temporales, revisión del patrón posprandial, los bolos omitidos o tardíos y la frecuencia de correcciones automáticas.",
    },
    {
      cuando: "3 meses",
      tipo: "Visita",
      que: "HbA1c y análisis estructurado de la descarga (v. Tabla 5).",
    },
    {
      cuando: "3-6 meses el primer año",
      tipo: "Seguimiento mantenido",
      que: "HbA1c, análisis estructurado de la descarga, revisión de ajustes y valoración del uso sostenido; revisión analítica periódica y cribado de complicaciones crónicas.",
    },
    { cuando: "Anual", tipo: "Reevaluación", que: "Idoneidad del sistema y satisfacción." },
  ],
  nota: "Con buen control, uso sostenido y sin incidencias, las visitas pueden espaciarse (orientativamente a 3-6 meses el primer año, y más una vez consolidada la estabilidad), reservando el seguimiento frecuente para quien lo necesita.",
};

/* ---------- Los cuatro algoritmos ---------- */
export interface AlgoritmoResumen {
  cadencia: string;
  /* Horizonte de predicción en horas para la barra (null = el capítulo no lo indica). */
  prediccionH: [number, number] | null;
  prediccion: string;
  autocorreccion: string;
  aprendizaje: string;
}

/* Fragmentos literales de la Tabla 1 (pp. 3–4), en el orden de las columnas. */
export const ALGORITMOS: AlgoritmoResumen[] = [
  {
    cadencia: "microbolos cada 5 min",
    prediccionH: null,
    prediccion: "no se indica en la Tabla 1",
    autocorreccion: "Sí; hasta uno cada 5 min si se predice > 120 mg/dl",
    aprendizaje:
      "actualiza el valor basal automático cada medianoche (DTD de los últimos 2–6 días)",
  },
  {
    cadencia: "modula la basal programada cada 5 min",
    prediccionH: [0.5, 0.5],
    prediccion: "predicción a 30 min",
    autocorreccion: "Sí; máx. uno por hora si se predice > 180 mg/dl a 30 min",
    aprendizaje: "No incorpora autoaprendizaje",
  },
  {
    cadencia: "bolos extendidos cada 8–12 min",
    prediccionH: [2.5, 4],
    prediccion: "predicción a largo plazo de 2,5 a 4 h",
    autocorreccion: "No; modula la administración continua de insulina",
    aprendizaje:
      "aprendizaje multinivel (DTD, variaciones diurnas y patrones posprandiales) que se actualiza cada 24 h",
  },
  {
    cadencia: "microbolos cada 5 min",
    prediccionH: [1, 1],
    prediccion: "predicción a 60 min",
    autocorreccion: "No; no utiliza bolos automáticos",
    aprendizaje: "«basal adaptativa» que se recalcula con cada cambio de pod",
  },
];

/* ---------- Hipoglucemia en asa cerrada ---------- */
export const HIPOGLUCEMIA = {
  pagina: 8,
  ramas: [
    {
      condicion: "Glucemia 54-70 mg/dl con flecha estable o ascendente",
      cantidad: "5-10 g",
      tono: "bajo" as TonoFranja,
    },
    {
      condicion: "Glucemia < 54 mg/dl, doble flecha descendente o insulina activa significativa",
      cantidad: "en torno a 15 g",
      tono: "muy-bajo" as TonoFranja,
    },
  ],
  despues: [
    "Debe reevaluarse con glucosa capilar a los 15 min y evitarse el sobretratamiento.",
    "Los hidratos para tratar la hipoglucemia no deben anunciarse como comida; en CamAPS FX existe la opción de registrarlos como “tratamiento de hipoglucemia”.",
  ],
  porque:
    "En asa cerrada suele requerir menos hidratos que en MDI o ISCI no automatizada, porque el sistema ya ha reducido o suspendido la insulina.",
  aviso: "La evidencia específica en AID es aún limitada, por lo que conviene individualizar.",
};

/* ---------- Transición desde MDI (Tabla 2) ---------- */
export const TRANSICION = {
  pagina: 10,
  pasos: [
    {
      titulo: "Plan de respaldo antes del inicio",
      texto:
        "Pauta escrita con basal y rápida en pluma, el cálculo de corrección, material para medir cetonemia y un contacto asistencial ante fallo del sistema.",
    },
    {
      titulo: "Reducción de la DTD al pasar de MDI",
      texto:
        "Orientativamente del 10-20 % en casos de buen control previo o riesgo de hipoglucemia; poco o nada si el control era deficiente (HbA1c > 8 %).",
    },
    {
      titulo: "Distribución basal/bolo inicial",
      texto: "Ritmo basal inicial = ~40-50 % de la DTD reducida/24 h; o individualizar según MCG.",
    },
    { titulo: "Ratio I/HC inicial", texto: "Regla del 450: g de HC por unidad = 450/DTD." },
    {
      titulo: "Factor de sensibilidad inicial",
      texto:
        "Regla del 1700: mg/dl por unidad = 1700/DTD. Puede valorarse la regla del 1800 en personas con riesgo elevado de hipoglucemia.",
    },
    {
      titulo: "Solapamiento con glargina U–300 o degludec",
      texto:
        "Coordinar la última dosis y el inicio del sistema; vigilar estrechamente, sobre todo las primeras 48 h.",
    },
  ],
  nota: "Los parámetros iniciales son solo el valor de partida; el algoritmo de cada sistema los modula según su propia lógica.",
};

/* ---------- Gestación, sistema a sistema (pp. 17-18; autorización: Tabla 1, p. 4) ----------
   La fila «Gestación: autorización y evidencia» se toma de la Tabla 1 (TABLAS.T1); aquí, las
   frases de las pp. 17-18 que nombran cada sistema, en el orden de las columnas. «—»: el
   capítulo no lo da para ese sistema. */
export type TemaGestacion = "Autorización" | "Ensayo" | "Objetivo" | "Estrategia";

export const GESTACION_SISTEMAS: { tema: TemaGestacion; texto: string; p: number }[][] = [
  [
    {
      tema: "Autorización",
      texto:
        "MiniMed 780G dispone asimismo de marcado CE para gestación y cuenta con evidencia específica procedente del ensayo CRISTAL",
      p: 17,
    },
    {
      tema: "Ensayo",
      texto:
        "CRISTAL evidenció con MiniMed 780G una mejoría principalmente nocturna y una reducción del tiempo por debajo del rango, sin diferencia significativa en el tiempo en rango global",
      p: 17,
    },
    {
      tema: "Objetivo",
      texto:
        "su objetivo mínimo configurable, de 100 mg/dl, permanece por encima de los objetivos glucémicos específicos del embarazo",
      p: 18,
    },
    {
      tema: "Estrategia",
      texto:
        "evitando estrategias no estandarizadas —como los hidratos fantasma— para forzar una mayor administración de insulina y priorizando el ajuste supervisado de los parámetros disponibles y del bolo prandial",
      p: 18,
    },
  ],
  [
    {
      tema: "Autorización",
      texto:
        "Control-IQ+ dispone de marcado CE para su uso durante la gestación en la DM1 desde junio de 2026, indicación respaldada por los resultados del ensayo CIRCUIT",
      p: 18,
    },
    {
      tema: "Ensayo",
      texto:
        "CIRCUIT mostró con Control-IQ una mejoría significativa del tiempo en rango específico de gestación, junto con una reducción del tiempo por encima y por debajo del rango",
      p: 17,
    },
    {
      tema: "Objetivo",
      texto:
        "No incorpora un objetivo gestacional específico configurable. Puede utilizarse el modo sueño de forma continuada para emplear el rango de tratamiento más bajo disponible, de 112,5–120 mg/dl, reservando un rango más alto para el ejercicio",
      p: 18,
    },
    {
      tema: "Estrategia",
      texto:
        "la estrategia de intensificación se basa en optimizar la tasa basal, la ratio insulina/hidratos de carbono y el factor de sensibilidad",
      p: 18,
    },
  ],
  [
    {
      tema: "Autorización",
      texto:
        "CamAPS FX dispone de marcado CE para su uso durante la gestación y de evidencia aleatorizada específica, principalmente del ensayo AiDAPT, además de permitir objetivos glucémicos suficientemente bajos; su modalidad Liberty, en cambio, no está autorizada durante la gestación",
      p: 17,
    },
    {
      tema: "Ensayo",
      texto:
        "AiDAPT mostró con CamAPS FX un mayor tiempo en rango específico de gestación y menor ganancia ponderal materna, además de señales favorables en algunos desenlaces maternos",
      p: 17,
    },
    {
      tema: "Objetivo",
      texto:
        "alrededor de 100 mg/dl en el primer trimestre y 80–90 mg/dl a partir del segundo, pudiendo individualizarse aproximadamente a 81 mg/dl durante la noche si el TBR lo permite. Tras el parto debe elevarse nuevamente el objetivo",
      p: 17,
    },
    {
      tema: "Estrategia",
      texto:
        "Boost puede utilizarse transitoriamente cuando aumentan las necesidades de insulina —por ejemplo, ante hiperglucemia posprandial, enfermedad leve sin cetosis o glucocorticoides antenatales—, mientras que Ease-off puede ser útil ante ejercicio o situaciones de mayor sensibilidad a la insulina, incluido el periodo periparto y el posparto inmediato",
      p: 18,
    },
  ],
  [
    {
      tema: "Autorización",
      texto:
        "Omnipod 5 no dispone actualmente de autorización específica para su uso durante la gestación",
      p: 17,
    },
    { tema: "Ensayo", texto: "—", p: 17 },
    { tema: "Objetivo", texto: "—", p: 17 },
    { tema: "Estrategia", texto: "—", p: 17 },
  ],
];

/* Lo común a todos los sistemas en la gestación (pp. 17-18). */
export const GESTACION_COMUN: { texto: string; p: number }[] = [
  {
    texto:
      "anticipando el bolo prandial, habitualmente 10–15 min y, en fases avanzadas, hasta 30–45 min según la respuesta individual",
    p: 17,
  },
  {
    texto:
      "Durante la gestación debe extremarse la vigilancia de la cetoacidosis, que puede aparecer con glucemias menos elevadas que fuera del embarazo y comporta un riesgo importante para el feto.",
    p: 18,
  },
  {
    texto:
      "Tras el parto, el aumento brusco de la sensibilidad a la insulina suele exigir una reducción importante de las necesidades de insulina y la adaptación de los ajustes del sistema.",
    p: 18,
  },
];

/* ---------- Hospital: cuándo no continuar el sistema (pp. 20-22) ---------- */
export const HOSPITAL = {
  mantener: {
    texto:
      "La MCG, la bomba de insulina y los sistemas AID pueden mantenerse cuando la persona puede utilizarlos de forma segura y el centro dispone de personal, procedimientos y recursos que permitan su supervisión.",
    p: 20,
  },
  noApropiada: {
    intro: "La continuación del sistema no es apropiada cuando",
    items: [
      "la persona o el equipo asistencial no pueden manejarlo con seguridad",
      "existe alteración del nivel de conciencia que impide el autocuidado —excluida la anestesia—",
      "cetoacidosis diabética o estado hiperosmolar",
      "falta de material necesario",
      "determinadas exploraciones incompatibles",
      "situaciones que comprometan la precisión de la MCG",
    ],
    p: 20,
  },
  entonces: {
    texto:
      "En estos casos debe establecerse una pauta alternativa sin interrupción de la cobertura insulínica.",
    p: 20,
  },
  pasos: [
    {
      cuando: "2 h antes",
      texto:
        "Si la transición desde bomba/AID a una pauta subcutánea está programada, la insulina basal debe administrarse aproximadamente 2 h antes de suspender la bomba.",
      p: 20,
    },
    {
      cuando: "Pauta alternativa",
      texto:
        "Cuando el sistema no proporciona un perfil basal detallado —como puede ocurrir con Omnipod 5—, la pauta de respaldo puede estimarse a partir de la dosis total diaria; en el ámbito hospitalario, una distribución inicial aproximada del 50 % basal y 50 % prandial puede utilizarse como punto de partida, individualizándola según la ingesta y la situación clínica.",
      p: 20,
    },
    {
      cuando: "Unas 22 h",
      texto:
        "La bomba o el AID pueden reanudarse cuando hayan desaparecido las contraindicaciones y el efecto de la insulina basal administrada haya disminuido suficientemente; como orientación, unas 22 h tras la última dosis de una basal de duración cercana a 24 h, individualizando según el preparado utilizado.",
      p: 20,
      p2: 21,
    },
  ],
  mientras: {
    texto:
      "Mientras se mantiene la bomba o el AID, las dosis suplementarias de insulina deben administrarse preferentemente a través de la propia bomba, salvo que exista una razón clínica para utilizar una pauta alternativa.",
    p: 21,
  },
  desdeIV: {
    texto:
      "Para volver al sistema desde insulina intravenosa, una vez recuperada la estabilidad clínica, reanudar el sistema y mantener ambas vías en paralelo aproximadamente 60 min antes de suspender la perfusión, de acuerdo con el protocolo de transición utilizado.",
    p: 22,
  },
};

/* ---------- Exploraciones (Tabla 6 como mapa) ----------
   Clasificación visual de cada celda de la Tabla 6 (interfaz); lo que se lee es la celda
   literal de la tabla. Filas en el orden de la Tabla 6; columnas: bomba o pod, sensor. */
export type EstadoExploracion = "retirar" | "depende" | "mantener";
export const EXPLORACIONES_ESTADO: [EstadoExploracion, EstadoExploracion][] = [
  ["retirar", "retirar"],
  ["retirar", "depende"],
  ["depende", "depende"],
  ["depende", "depende"],
  ["depende", "depende"],
  ["mantener", "mantener"],
  ["mantener", "mantener"],
  ["retirar", "depende"],
];

/* ---------- Interrupción del sistema según su duración (p. 9) ---------- */
export const INTERRUPCION_LINEA = {
  pagina: 9,
  tramos: [
    {
      cuando: "Muy breve",
      texto:
        "Las interrupciones muy breves, con reanudación o sustitución inmediata, no suelen requerir medidas adicionales",
    },
    {
      cuando: "Aproximadamente 1 h",
      texto:
        "a partir de aproximadamente 1 h sin administración de insulina debe actuarse —glucemia capilar, valoración de cetonemia según el contexto y reposición de la insulina no administrada— por el riesgo de hiperglucemia y cetosis",
    },
    {
      cuando: "Hasta 2-3 h, programadas",
      texto:
        "puede valorarse, si no existe riesgo de hipoglucemia, administrar antes de la desconexión un bolo de acción rápida o ultrarrápida para cubrir la insulina basal prevista durante ese período",
    },
    {
      cuando: "Prolongadas",
      texto:
        "se pasa a múltiples dosis con pluma: insulina basal —preferentemente glargina U-100 si se busca facilitar el retorno posterior al sistema— y análogo ultrarrápido para comidas y correcciones",
    },
  ],
  detalles: [
    {
      cuando: "Basal de respaldo sin estimación fiable",
      texto: "puede orientarse en torno al 40-50 % de la DTD reciente",
    },
    {
      cuando: "Glargina programada ante una interrupción prolongada",
      texto:
        "puede adelantarse aproximadamente dos horas antes de la retirada del dispositivo para evitar un vacío de insulinización",
    },
    {
      cuando: "Cetonemia o sospecha de fallo",
      texto:
        "Si existe cetonemia, hiperglucemia persistente o sospecha de fallo de infusión, se seguirá el algoritmo de la figura 3.",
    },
  ],
  formatos: {
    pod: "el pod no se desconecta —si falla, se despega o debe retirarse, se sustituye por uno nuevo—",
    bomba: "la bomba con catéter puede desconectarse y reconectarse a través del set de infusión",
  },
  nota: "Estas pautas son orientativas y se apoyan en la farmacocinética de las insulinas más que en ensayos específicos en asa cerrada, por lo que deben individualizarse.",
};
