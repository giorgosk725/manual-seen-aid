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
  | "transicion";

export interface DiagramaMeta {
  id: DiagramaId;
  titulo: string;
  /* Qué enseña, en una línea (interfaz). */
  resumen: string;
  paginas: number[];
  /* Apartado donde se inserta (slug). */
  apartado: string;
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
        "Vigilancia estrecha, revisión del sistema y reevaluación de glucemia y cetonemia en 1–2 h.",
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
      "Durante: si la glucosa baja de unos 126 mg/dl, 10-20 g de hidratos rápidos, sin anunciarlos al sistema",
  },
  fases: [
    {
      titulo: "Antes",
      items: [
        "Valorar la glucemia de partida, su tendencia y la insulina activa: un bolo reciente o una flecha descendente aumentan el riesgo de hipoglucemia.",
        "Actividad planificada con descenso esperado: elevar el objetivo glucémico, iniciado 1-2 h antes de la actividad.",
        "Solo de forma complementaria, si el ejercicio se realiza en las 2 h siguientes a una comida rica en hidratos, se reduce además el bolo prandial en un 25-33 %.",
        "Evitar el ejercicio con cetonemia ≥1,5 mmol/l, con independencia de la glucemia.",
      ],
    },
    {
      titulo: "Durante",
      items: [
        "Vigilar las lecturas y las flechas de tendencia.",
        "Comprobar la glucosa del sensor a los 20–30 min y repetir la ingesta si es necesario.",
        "Esfuerzo breve y de alta intensidad o anaeróbico: mantener el objetivo habitual y evitar sobrecorregir la hiperglucemia reactiva.",
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
  nota: "Con buen control, uso sostenido y sin incidencias, las visitas pueden espaciarse; el seguimiento frecuente se reserva para quien lo necesita.",
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
        "Regla del 1700: mg/dl por unidad = 1700/DTD (regla del 1800 si riesgo elevado de hipoglucemia).",
    },
    {
      titulo: "Solapamiento con glargina U–300 o degludec",
      texto:
        "Coordinar la última dosis y el inicio del sistema; vigilar estrechamente, sobre todo las primeras 48 h.",
    },
  ],
  nota: "Los parámetros iniciales son solo el valor de partida; el algoritmo de cada sistema los modula según su propia lógica.",
};
