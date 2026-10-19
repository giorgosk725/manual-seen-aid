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
    paginas: [4, 5, 15, 17, 19, 20],
    apartado: "05-resultados",
  },
  {
    id: "cetonemia",
    titulo: "Escala de cetonemia (β-OHB)",
    resumen:
      "Los cuatro tramos de β-OHB a escala, con los signos de gravedad y los umbrales de ejercicio y de rescate.",
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
    resumen:
      "Seguimiento estrecho en los primeros 3 meses y mantenido después: qué se hace en cada contacto.",
    paginas: [10, 12, 16],
    apartado: "08-iniciacion",
  },
  {
    id: "algoritmos",
    titulo: "Algoritmos de control de los cuatro sistemas",
    resumen:
      "Dónde está el algoritmo de cada sistema, cómo actúa, si corrige solo, hacia qué objetivo y qué parámetros cuentan.",
    paginas: [3, 4],
    apartado: "04-sistemas",
  },
  {
    id: "hipoglucemia",
    titulo: "Hipoglucemia en asa cerrada",
    resumen:
      "La hipoglucemia leve en asa cerrada según el plan de seguridad: cuántos hidratos de carbono (orientativo) y cuándo reevaluar.",
    paginas: [8, 9, 16],
    apartado: "07-educacion",
  },
  {
    id: "transicion",
    titulo: "Transición desde MDI",
    resumen:
      "La Tabla 2 entera: recomendaciones orientativas para el inicio desde MDI, con sus notas.",
    paginas: [10, 12],
    apartado: "08-iniciacion",
  },
  {
    id: "gestacion-sistemas",
    titulo: "Gestación, sistema a sistema",
    resumen:
      "Autorización, ensayo, objetivo configurable y cómo se intensifica cada sistema en la gestación.",
    paginas: [4, 17, 18],
    apartado: "10-situaciones",
    ancla: "gestacion",
  },
  {
    id: "hospital",
    titulo: "Hospital: criterios para no continuar el sistema",
    resumen:
      "Adultos no críticos: cuándo mantener el sistema y cuándo no, la pauta alternativa, la perfusión intravenosa y la vuelta al sistema.",
    paginas: [20, 21, 22],
    apartado: "10-situaciones",
    ancla: "b36",
  },
  {
    id: "exploraciones",
    titulo: "Exploraciones, procedimientos y cirugía",
    resumen:
      "La Tabla 6 como mapa: bomba o pod y sensor por separado, qué se retira, qué depende del modelo y qué puede mantenerse.",
    paginas: [21, 22],
    apartado: "10-situaciones",
    ancla: "T6",
  },
  {
    id: "eleccion",
    titulo: "Elección compartida del sistema",
    resumen:
      "La Figura 2 como diagrama: perfil de la persona, características del sistema y contexto asistencial.",
    paginas: [6],
    apartado: "06-indicaciones",
    ancla: "F2",
  },
  {
    id: "interrupcion",
    titulo: "Interrupción del sistema, según su duración",
    resumen:
      "Programada o no, breve o prolongada: cómo reponer la insulina y cómo volver al sistema.",
    paginas: [9],
    apartado: "07-educacion",
    ancla: "b15",
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
  /* Frases literales; `p` si son de otra página que la de la población. */
  extras: { texto: string; p?: number }[];
  aviso?: string;
}

/* Revisión del 13-10-2026: frases literales completas, con sus condiciones; sin el dato del
   consenso de 2019 (A07): el TAR > 180 de adultos va sin cifra, como en el capítulo (p. 4). */
export const OBJETIVOS_MCG: PoblacionObjetivos[] = [
  {
    id: "general",
    nombre: "Adultos no gestantes",
    pagina: 4,
    franjas: [
      {
        franja: "> 250 mg/dl",
        objetivo: "< 5 %",
        nota: "TAR de nivel 2: ayuda a detectar hiperglucemia mantenida o fallo de infusión",
        tono: "muy-alto",
      },
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
      { texto: "Coeficiente de variación ≤ 36 %" },
      {
        texto:
          "El TITR —tiempo en rango estrecho, 70-140 mg/dl— refleja la proporción de tiempo en valores más próximos al rango fisiológico y puede aportar información adicional cuando el TBR es seguro y el TIR ya es adecuado.",
      },
      {
        texto:
          "Por ello, el TITR puede utilizarse como métrica complementaria de optimización, individualizada y acordada con la persona, sin sustituir al TIR ni al TBR ni considerarse todavía un objetivo clínico primario universal.",
      },
      { texto: "Solo con un TBR aceptable se buscan más TITR u objetivos más estrictos.", p: 15 },
    ],
  },
  {
    id: "gestacion",
    nombre: "Gestación",
    pagina: 17,
    franjas: [
      { franja: "> 140 mg/dl", objetivo: "< 25 %", nota: "TARp", tono: "alto" },
      { franja: "63–140 mg/dl", objetivo: "> 70 %", nota: "TIRp", tono: "rango" },
      { franja: "< 63 mg/dl", objetivo: "< 4 %", nota: "TBRp", tono: "bajo" },
      { franja: "< 54 mg/dl", objetivo: "< 1 %", nota: "TBRp", tono: "muy-bajo" },
    ],
    extras: [
      { texto: "Coeficiente de variación ≤36 %" },
      {
        texto:
          "En la planificación preconcepcional se recomienda una HbA1c <6,5 %, tan próxima a la normalidad como sea posible sin hipoglucemia significativa.",
      },
      {
        texto:
          "Durante la gestación, el objetivo ideal es una HbA1c <6,0 % si puede alcanzarse con seguridad, pudiendo individualizarse hasta <7,0 % cuando sea necesario para evitar hipoglucemia significativa.",
      },
    ],
  },
  {
    id: "hospital",
    nombre: "Hospital (adultos no críticos)",
    pagina: 20,
    franjas: [
      { franja: "> 250 mg/dl", objetivo: "< 5 %", nota: "TAR", tono: "muy-alto" },
      { franja: "> 180 mg/dl", objetivo: "< 25 %", nota: "TAR", tono: "alto" },
      { franja: "70–180 mg/dl", objetivo: "> 60 %", nota: "TIR", tono: "rango" },
      {
        franja: "70–100 mg/dl",
        objetivo: "< 15 %",
        nota: "tiempo próximo a hipoglucemia",
        tono: "estrecho",
      },
      { franja: "< 70 mg/dl", objetivo: "0 %", nota: "TBR", tono: "bajo" },
    ],
    extras: [
      {
        texto:
          "En personas hospitalizadas que mantienen la MCG, este posicionamiento propone, fundamentalmente a partir de consenso de expertos, objetivos orientativos de TIR 70–180 mg/dl >60 %, TAR >180 mg/dl <25 %, TAR >250 mg/dl <5 % y TBR <70 mg/dl 0 %.",
      },
      {
        texto:
          "Introduce además el tiempo próximo a hipoglucemia (70–100 mg/dl), que debería mantenerse <15 %, priorizando en el hospital la prevención de hipoglucemia y de complicaciones agudas frente a objetivos ambulatorios más estrictos.",
      },
    ],
    aviso: "No deben extrapolarse directamente a población pediátrica.",
  },
  {
    id: "fragilidad",
    nombre: "Fragilidad o expectativa de vida limitada",
    pagina: 19,
    franjas: [{ franja: "< 70 mg/dl", objetivo: "< 1 %", nota: "objetivo primario", tono: "bajo" }],
    extras: [
      {
        texto:
          "Los objetivos se individualizan según estado funcional, cognitivo y comorbilidad: con autonomía conservada, equivalentes a la población general; en fragilidad o expectativa de vida limitada, se relajan, priorizando evitar la hipoglucemia (tiempo con glucosa <70 mg/dl, <1% como objetivo primario) y limitar la carga terapéutica.",
      },
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

/* Revisión del 13-10-2026: texto literal completo (p. 15, p. 19 y Figura 3); los signos de
   gravedad arriba, para todos los tramos: la cifra sola no elige la conducta (A01). */
export const ESCALA_CETONEMIA: {
  tramos: TramoEscala[];
  tope: number;
  gravedad: { texto: string; p: number };
  pediatria: { texto: string; p: number };
  ejercicio: { texto: string; p: number };
  apilamiento: { texto: string; p: number };
} = {
  tope: 4,
  gravedad: {
    texto:
      "β-OHB ≥3,0 mmol/l o presencia de signos de gravedad —vómitos persistentes, dolor abdominal, respiración rápida o profunda, somnolencia, confusión, deshidratación, imposibilidad para beber o deterioro del estado general—: posible cetoacidosis diabética; valoración hospitalaria urgente.",
    p: 15,
  },
  pediatria: { texto: "En pediatría, los umbrales se modifican según el protocolo local.", p: 16 },
  ejercicio: {
    texto:
      "Si la β-OHB es ≥1,0 mmol/l en contexto de hiperglucemia persistente o sospecha de fallo de infusión, debe aplicarse previamente el algoritmo de la figura 3; en cualquier caso, el ejercicio debe evitarse con cetonemia ≥1,5 mmol/l, con independencia de la glucemia, hasta corregir la cetosis y reevaluar la situación clínica.",
    p: 19,
  },
  apilamiento: {
    texto:
      "Tras una corrección con pluma, el sistema no contabiliza esa insulina como activa, por lo que debe extremarse la vigilancia para evitar la superposición de dosis (apilamiento) y seguir el plan individual para la reanudación segura de la automatización.",
    p: 16,
  },
  tramos: [
    {
      clave: "verde",
      desde: 0,
      hasta: 0.6,
      etiqueta: "<0,6 · sin cetosis significativa",
      accion:
        "si la hiperglucemia persiste o no responde a una corrección, mantener la sospecha de fallo de infusión, administrar la corrección con pluma y recambiar el set/pod según el plan de seguridad.",
      p: 15,
    },
    {
      clave: "amarillo",
      desde: 0.6,
      hasta: 1.0,
      etiqueta: "0,6–0,9 · cetonemia leve",
      accion:
        "vigilancia estrecha, revisión del sistema y reevaluación de glucemia y cetonemia en 1–2 h. Si la hiperglucemia no responde o existe sospecha de fallo de infusión, administrar la corrección con pluma y recambiar el set/pod. Si β-OHB aumenta a ≥1,0 mmol/l, seguir las recomendaciones del tramo siguiente.",
      p: 15,
    },
    {
      clave: "naranja",
      desde: 1.0,
      hasta: 3.0,
      etiqueta: "1,0–2,9 · cetosis significativa / probable fallo de infusión",
      accion:
        "administrar la corrección con pluma y recambiar el set/pod según el plan de seguridad.",
      p: 15,
    },
    {
      clave: "rojo",
      desde: 3.0,
      hasta: 4,
      etiqueta: "≥3,0 o signos de gravedad · posible cetoacidosis diabética",
      accion: "valoración hospitalaria urgente.",
      p: 15,
    },
  ],
};

/* ---------- Glucemia y ejercicio ---------- */
/* Revisión del 13-10-2026: frases literales completas de la p. 19 (con «Como referencia»), la
   actividad no planificada aparte y el tipo de ejercicio; la β-OHB, también junto a > 270. */
export const EJERCICIO = {
  pagina: 19,
  escala: { min: 40, max: 320 },
  zonas: [
    {
      desde: 40,
      hasta: 90,
      etiqueta: "<90 mg/dl",
      texto: "con cifras <90 mg/dl deben administrarse hidratos de carbono y retrasar el inicio",
      tono: "bajo" as TonoFranja,
    },
    {
      desde: 126,
      hasta: 180,
      etiqueta: "126–180 mg/dl",
      texto:
        "Como referencia, se recomienda iniciar el ejercicio con una glucemia de 126–180 mg/dl",
      tono: "rango" as TonoFranja,
    },
    {
      desde: 270,
      hasta: 320,
      etiqueta: "> 270 mg/dl",
      texto:
        "Si la glucemia supera 270 mg/dl, debe medirse la cetonemia y descartarse un fallo de infusión.",
      tono: "muy-alto" as TonoFranja,
    },
  ],
  marca: {
    valor: 126,
    texto:
      "Durante la actividad conviene vigilar las lecturas y las flechas de tendencia y tomar pequeñas cantidades de hidratos rápidos (orientativamente 10-20 g) si la glucosa baja de unos 126 mg/dl, sin anunciarlos al sistema y habitualmente en menor cantidad que sin AID porque el algoritmo ya ha reducido la insulina. Estas cantidades se refieren a la prevención del descenso glucémico durante la actividad y no sustituyen el tratamiento de una hipoglucemia ya establecida.",
  },
  cetonemia:
    "Si la β-OHB es ≥1,0 mmol/l en contexto de hiperglucemia persistente o sospecha de fallo de infusión, debe aplicarse previamente el algoritmo de la figura 3; en cualquier caso, el ejercicio debe evitarse con cetonemia ≥1,5 mmol/l, con independencia de la glucemia, hasta corregir la cetosis y reevaluar la situación clínica.",
  fases: [
    {
      titulo: "Antes",
      items: [
        "Antes de empezar conviene valorar la glucemia de partida, su tendencia y la insulina activa: un bolo reciente o una flecha descendente aumentan el riesgo de hipoglucemia.",
        "En la actividad planificada con descenso esperado, la primera medida es elevar el objetivo glucémico mediante el modo o el objetivo temporal del sistema, iniciado 1-2 h antes de la actividad.",
        "Solo de forma complementaria, si el ejercicio se realiza en las 2 h siguientes a una comida rica en hidratos, se reduce además el bolo prandial en un 25-33 %.",
        "En la actividad no planificada, si se prevé un descenso o una estabilidad de la glucosa, el objetivo debe elevarse de inmediato al iniciar el esfuerzo, tomando hidratos rápidos si la glucosa está baja.",
      ],
    },
    {
      titulo: "Durante",
      items: [
        "Conviene comprobar la glucosa del sensor a los 20–30 min y repetir la ingesta si es necesario.",
        "Cuando sea necesario interrumpir la administración de insulina, deben evitarse desconexiones prolongadas: las superiores a 1 h pueden aumentar el riesgo de hiperglucemia y cetosis, por lo que conviene planificar la reconexión y, cuando proceda, la corrección de insulina.",
      ],
    },
    {
      titulo: "Después",
      items: [
        "El riesgo de hipoglucemia diferida persiste durante varias horas tras el ejercicio, en especial por la noche.",
        "Por ello conviene mantener el objetivo más alto o el modo de ejercicio durante un tiempo después de la actividad y vigilar la noche siguiente; superada esa ventana, debe desactivarse para no perpetuar una hiperglucemia por un objetivo elevado mantenido de más.",
      ],
    },
  ],
  tipo: [
    "El ejercicio aeróbico tiende a bajar la glucosa; el anaeróbico o de fuerza puede elevarla transitoriamente, y el mixto combina ambos efectos.",
    "En cambio, ante un esfuerzo breve y de alta intensidad o anaeróbico, que tiende a elevar la glucosa, suele preferirse mantener el objetivo habitual y evitar sobrecorregir la hiperglucemia reactiva, ya que la corrección puede desencadenar una hipoglucemia posterior inducida por el sistema; en general, conviene dejar actuar al algoritmo.",
  ],
  herramientas:
    "Las herramientas específicas por sistema —objetivo temporal de MiniMed, modo ejercicio de Tandem, Función Actividad de Omnipod (objetivo 150 mg/dl) y Ease-off de CamAPS FX— y su anticipación se sintetizan en la tabla 4; en el ejercicio prolongado o repetido, el ajuste se individualiza según la respuesta observada en las descargas.",
};

/* ---------- Calendario de seguimiento ---------- */
/* Revisión del 13-10-2026: las dos fases del capítulo (p. 10), los contactos con su frase
   literal (p. 12) y el espaciado de visitas como lo que es: una opción con condiciones. */
export const SEGUIMIENTO = {
  pagina: 12,
  fases: [
    {
      titulo: "Seguimiento estrecho durante los primeros 3 meses",
      hitos: [
        {
          cuando: "Primeras 72 h y a la semana",
          tipo: "Contacto remoto",
          que: "El contacto remoto inicial se centra en resolución de dudas, revisión de alarmas e identificación de salidas a modo manual.",
        },
        {
          cuando: "2-4 semanas",
          tipo: "Revisión presencial",
          que: "La revisión presencial a las 2-4 semanas permite ajustes finos (ratios y objetivos configurables) e incorporación de modos temporales, revisión del patrón posprandial, los bolos omitidos o tardíos y la frecuencia de correcciones automáticas.",
        },
        {
          cuando: "3 meses",
          tipo: "Visita",
          que: "La visita a los 3 meses incorpora la HbA1c y el análisis estructurado de la descarga.",
        },
      ],
    },
    {
      titulo: "Seguimiento mantenido a largo plazo",
      hitos: [
        {
          cuando: "Después",
          tipo: "Según la estabilidad",
          que: "Superada la fase inicial, la intensidad del seguimiento se ajusta a la estabilidad alcanzada: con buen control, uso sostenido y sin incidencias, las visitas pueden espaciarse (orientativamente a 3-6 meses el primer año, y más una vez consolidada la estabilidad), reservando el seguimiento frecuente para quien lo necesita.",
          condicional: true,
        },
        {
          cuando: "Anual",
          tipo: "Reevaluación",
          que: "La reevaluación anual añade la idoneidad del sistema y la satisfacción.",
        },
      ],
    },
  ],
  fasesP: 10,
  notas: [
    {
      texto:
        "La lipohipertrofia puede explicar hipoglucemias y variabilidad glucémica inexplicadas, por lo que debe explorarse al menos una vez al año mediante inspección y palpación.",
      p: 16,
    },
  ],
};

/* ---------- Los cuatro algoritmos ---------- */
/* 13-10-2026 (0.57): lo esencial de cada sistema de un vistazo. Cada valor es un fragmento
   literal de su celda de la Tabla 1 (el test lo comprueba); las celdas enteras siguen debajo.
   Sin la barra del horizonte de predicción: la predicción va como un dato más de la tarjeta.
   Orden de ORDEN_SISTEMAS / columnas de la Tabla 1. Lista vacía = el capítulo no lo indica. */
export type ClaveAlgoritmo = {
  donde: string[]; // «Localización del algoritmo»
  actua: string[]; // «Estrategia de automatización»
  prediccion: string[]; // «Estrategia de automatización»
  objetivo: string[]; // «Objetivo glucémico en modo automático»
  correccion: { si: boolean; texto: string[] }; // «Bolos automáticos de corrección»
  aprendizaje: string[]; // «Lógica del algoritmo y aprendizaje»
};
export const CLAVE_ALGORITMO: ClaveAlgoritmo[] = [
  {
    donde: ["En la bomba"],
    actua: ["microbolos cada 5 min"],
    prediccion: [],
    objetivo: ["100, 110 o 120 mg/dl"],
    correccion: { si: true, texto: ["hasta uno cada 5 min si se predice > 120 mg/dl"] },
    aprendizaje: ["actualiza el valor basal automático cada medianoche"],
  },
  {
    donde: ["En la bomba"],
    actua: ["Modula (aumenta, reduce o suspende) la basal programada cada 5 min"],
    prediccion: ["a 30 min"],
    objetivo: ["112,5–160 mg/dl"],
    correccion: {
      si: true,
      texto: ["máx. uno por hora si se predice > 180 mg/dl a 30 min", "no actúa en modo Sueño"],
    },
    aprendizaje: ["No incorpora autoaprendizaje"],
  },
  {
    donde: ["En la app del smartphone"],
    actua: ["bolos extendidos cada 8–12 min"],
    prediccion: ["de 2,5 a 4 h"],
    objetivo: ["80–198 mg/dl", "De fábrica: 104 mg/dl"],
    correccion: {
      si: false,
      texto: [
        "modula la administración continua de insulina, sin bolos de corrección diferenciados",
      ],
    },
    aprendizaje: ["aprendizaje multinivel", "se actualiza cada 24 h"],
  },
  {
    donde: ["En el pod"],
    actua: ["microbolos cada 5 min"],
    prediccion: ["a 60 min"],
    objetivo: ["110, 120, 130, 140 o 150 mg/dl"],
    correccion: {
      si: false,
      texto: ["en su lugar, incrementa la tasa basal adaptativa hasta un 400 %"],
    },
    aprendizaje: ["se recalcula con cada cambio de pod"],
  },
];
export const RECORDATORIO_HIBRIDO = {
  texto:
    "En las modalidades híbridas el anuncio de las comidas y el bolo prandial siguen siendo necesarios para optimizar el control.",
  p: 3,
};

/* ---------- Hipoglucemia en asa cerrada ---------- */
/* Revisión del 13-10-2026: la frase de la p. 8 entera, con sus condiciones («hipoglucemia
   leve», «no existe insulina activa relevante», «como orientación»), con el mismo peso que las
   cifras; sin flechas de árbol: no cubre todos los casos. */
export const HIPOGLUCEMIA = {
  pagina: 8,
  regla: "Dos reglas operativas merecen mención específica dentro del plan de seguridad.",
  porque:
    "La primera es el tratamiento de la hipoglucemia, que en asa cerrada suele requerir menos hidratos que en MDI o ISCI no automatizada, porque el sistema ya ha reducido o suspendido la insulina.",
  orientacion:
    "En determinados episodios de hipoglucemia leve, sobre todo cuando el algoritmo ya ha reducido o suspendido la infusión y no existe insulina activa relevante, pueden bastar cantidades menores que la regla clásica de 15 g: como orientación, 5-10 g ante glucemia 54-70 mg/dl con flecha estable o ascendente, reservando cantidades en torno a 15 g para glucemia < 54 mg/dl, doble flecha descendente o insulina activa significativa.",
  ramas: [
    {
      condicion: "glucemia 54-70 mg/dl con flecha estable o ascendente",
      cantidad: "5-10 g",
      tono: "bajo" as TonoFranja,
    },
    {
      condicion: "glucemia < 54 mg/dl, doble flecha descendente o insulina activa significativa",
      cantidad: "en torno a 15 g",
      tono: "muy-bajo" as TonoFranja,
    },
  ],
  despues: [
    {
      texto:
        "Debe reevaluarse con glucosa capilar a los 15 min y evitarse el sobretratamiento; la evidencia específica en AID es aún limitada, por lo que conviene individualizar.",
      p: 8,
    },
    {
      texto:
        "Los hidratos para tratar la hipoglucemia no deben anunciarse como comida; en CamAPS FX existe la opción de registrarlos como “tratamiento de hipoglucemia”, que los documenta y suaviza la entrega de insulina sin contabilizarlos como ingesta.",
      p: 8,
      p2: 9,
    },
    {
      texto:
        "Es sugestiva una caída brusca de la glucosa seguida de la recuperación rápida al cambiar de postura; ante la duda, confirmar con glucemia capilar y evitar el sobretratamiento.",
      p: 16,
      tema: "Lecturas falsamente bajas por compresión",
    },
  ],
};

/* ---------- Transición desde MDI (Tabla 2) ---------- */
/* Revisión del 13-10-2026: la Tabla 2 entera (sus nueve filas y sus notas, desde TABLAS.T2),
   sin numerar: son recomendaciones orientativas, no pasos; y de dónde se parte (p. 12). */
export const TRANSICION = {
  pagina: 10,
  partida:
    "La fuente de partida es la pauta previa del paciente, trasladada al esquema del sistema elegido; cuando no se dispone de referencia, las reglas del 450 y del 1700 sobre la DTD orientan la ratio y el factor de sensibilidad iniciales.",
  partidaP: 12,
};

/* ---------- Gestación, sistema a sistema (pp. 17-18; autorización: Tabla 1, p. 4) ----------
   La fila «Gestación: autorización y evidencia» se toma de la Tabla 1 (TABLAS.T1); aquí, las
   frases de las pp. 17-18 que nombran cada sistema, en el orden de las columnas. «—»: el
   capítulo no lo da para ese sistema. */
export type TemaGestacion = "Autorización" | "Ensayo" | "Objetivo" | "Estrategia";

export const GESTACION_SISTEMAS: {
  tema: TemaGestacion;
  texto: string;
  p: number;
  p2?: number;
}[][] = [
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
        "Una limitación práctica de MiniMed 780G durante la gestación es que su objetivo mínimo configurable, de 100 mg/dl, permanece por encima de los objetivos glucémicos específicos del embarazo.",
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
        "No incorpora un objetivo gestacional específico configurable. Puede utilizarse el modo sueño de forma continuada para emplear el rango de tratamiento más bajo disponible, de 112,5–120 mg/dl, reservando un rango más alto para el ejercicio. Durante este modo se intensifica la modulación basal, pero no se administran bolos automáticos de corrección, por lo que resultan especialmente importantes la revisión frecuente de los parámetros y la correcta administración del bolo prandial.",
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
        "Con CamAPS FX, el objetivo del algoritmo puede reducirse progresivamente: como orientación, alrededor de 100 mg/dl en el primer trimestre y 80–90 mg/dl a partir del segundo, pudiendo individualizarse aproximadamente a 81 mg/dl durante la noche si el TBR lo permite. Son objetivos exigentes, que requieren utilizar los valores más bajos configurables y una supervisión estrecha.",
      p: 17,
    },
    {
      tema: "Estrategia",
      texto:
        "En CamAPS FX, el factor de sensibilidad y la duración de la insulina activa configurados se utilizan en el calculador de bolos y no determinan directamente la administración automatizada; en modo automático adquieren especial relevancia el objetivo glucémico, la ratio insulina/hidratos de carbono y la correcta administración del bolo prandial.",
      p: 17,
      p2: 18,
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

/* El aviso del capítulo antes de leer los ensayos lado a lado (p. 17). */
export const GESTACION_ENSAYOS = {
  texto:
    "Los tres ensayos difieren en diseño, población, tratamiento comparador y control glucémico de partida, y no tuvieron potencia suficiente para establecer diferencias concluyentes en los principales desenlaces obstétricos o neonatales, por lo que sus resultados no deben compararse directamente.",
  p: 17,
};
/* Rótulo de la columna de Tandem en este diagrama: las filas son de la variante autorizada. */
export const GESTACION_ROTULO_TANDEM = "Tandem Control-IQ+";

/* Lo común a todos los sistemas en la gestación (pp. 17-18). */
export const GESTACION_COMUN: { texto: string; p: number }[] = [
  {
    texto:
      "La elección debe considerar además la capacidad del sistema para alcanzar los objetivos glucémicos de la gestación, la experiencia del equipo y la situación clínica individual.",
    p: 17,
  },
  {
    texto:
      "El seguimiento debe intensificarse durante la gestación, ajustando de forma progresiva la ratio insulina/hidratos de carbono, el factor de sensibilidad y los objetivos glucémicos conforme cambian las necesidades de insulina, y anticipando el bolo prandial, habitualmente 10–15 min y, en fases avanzadas, hasta 30–45 min según la respuesta individual.",
    p: 17,
  },
  {
    texto:
      "Debe disponerse de medición de cetonemia y reforzar su determinación ante hiperglucemia persistente, enfermedad intercurrente, vómitos o síntomas compatibles, además de llevar siempre material de recambio e insulina alternativa en pluma.",
    p: 18,
  },
  {
    texto:
      "El sistema puede mantenerse durante el parto y el posparto inmediato en personas entrenadas y clínicamente estables, cuando puedan manejarlo con seguridad y exista un plan acordado con el equipo asistencial.",
    p: 18,
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
  ambito: {
    texto:
      "Las recomendaciones siguientes se refieren a adultos hospitalizados no críticos y no deben extrapolarse directamente a población pediátrica.",
    p: 20,
  },
  condiciones: [
    {
      texto:
        "La capacidad de autocuidado debe reevaluarse durante el ingreso —idealmente en cada contacto asistencial—, ya que puede cambiar con la evolución clínica.",
      p: 20,
    },
    {
      texto:
        "Cuando no existen contraindicaciones, puede mantenerse el modo automático del AID; en personas en ayunas o con mayor riesgo de hipoglucemia puede valorarse temporalmente un objetivo glucémico más alto o un modo menos intensivo, según las posibilidades del sistema y el protocolo institucional.",
      p: 20,
    },
  ],
  mcg: [
    {
      texto:
        "Ante discrepancias entre MCG y glucemia capilar, debe utilizarse el valor más bajo para orientar las decisiones clínicas y minimizar el riesgo de hipoglucemia; si las discrepancias clínicamente relevantes persisten, debe plantearse la sustitución o suspensión del sensor.",
      p: 21,
    },
    {
      texto:
        "Debe confirmarse con glucemia capilar durante las primeras 24 h tras la inserción de un nuevo sensor y cuando exista discordancia con la situación clínica, valores extremos o sospecha de interferencia.",
      p: 21,
    },
  ],
  haciaIV: {
    texto:
      "En intervenciones más prolongadas o complejas, con riesgo de prolongación del procedimiento, debe realizarse transición a perfusión intravenosa de insulina",
    p: 21,
  },
  contingencia: {
    texto:
      "La hospitalización debe contemplar además un plan de contingencia ante la retirada inesperada del sistema y su reintroducción una vez recuperadas las condiciones de seguridad, siempre que sea posible antes del alta.",
    p: 21,
  },
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
      cuando: "Si está programada: aprox. 2 h antes",
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
      cuando: "Vuelta al sistema: como orientación, unas 22 h",
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
export const EXPLORACIONES_TEXTO = {
  porSeparado:
    "Ante una exploración, la bomba o el pod y el sensor/transmisor deben valorarse por separado, ya que la compatibilidad de un componente no implica la del sistema completo.",
  notas: [
    "Si un sensor autorizado permanece colocado durante una RM, sus lecturas pueden alterarse transitoriamente y suelen normalizarse en aproximadamente 1 h; con la diatermia se ha descrito un comportamiento similar, aunque con menor evidencia.",
    "En la PET con fluorodesoxiglucosa (FDG) deben seguirse además las indicaciones de Medicina Nuclear sobre ayuno, glucemia e insulinoterapia previa.",
    "Si se mantiene el sistema, debe comprobarse que dispone de insulina y material suficientes, situar el set de infusión fuera del campo quirúrgico —preferentemente renovado el día previo cuando proceda— y garantizar que el anestesista tenga acceso a la bomba para poder suspenderla o desconectarla si fuera necesario.",
  ],
  p: 21,
};
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
  premisa:
    "Toda interrupción del sistema —fallo, retirada programada o cese de la administración de insulina— exige valorar el tiempo previsto sin infusión, porque los sistemas con bomba o pod administran únicamente acción rápida o ultrarrápida y carecen de depósito basal.",
  tramos: [
    {
      cuando: "Muy breve",
      texto:
        "Las interrupciones muy breves, con reanudación o sustitución inmediata, no suelen requerir medidas adicionales",
      condicion:
        "Tras la reconexión, debe reanudarse la administración y el sistema vuelve a ajustar la infusión, siempre que la interrupción haya sido breve y no exista hiperglucemia o cetonemia.",
    },
    {
      cuando: "A partir de aproximadamente 1 h",
      texto:
        // 0.77.1 (auditoría del perfil senior): la frase desde su principio (antes empezaba en
        // minúscula, a media frase).
        "Como umbral operativo, a partir de aproximadamente 1 h sin administración de insulina debe actuarse —glucemia capilar, valoración de cetonemia según el contexto y reposición de la insulina no administrada— por el riesgo de hiperglucemia y cetosis.",
    },
    {
      cuando: "Prolongadas, con el sistema indisponible o ante un fallo definitivo",
      texto:
        "En interrupciones prolongadas, con el sistema indisponible o ante un fallo definitivo, se pasa a múltiples dosis con pluma: insulina basal —preferentemente glargina U-100 si se busca facilitar el retorno posterior al sistema— y análogo ultrarrápido para comidas y correcciones, según la ratio insulina/hidratos y el factor de sensibilidad de la pauta de respaldo.",
    },
  ],
  programadas: [
    {
      cuando: "Programadas y de pocas horas (orientativamente hasta 2-3 h)",
      texto:
        "En interrupciones programadas y de pocas horas —orientativamente hasta 2-3 h, como en deporte, baño o algunas exploraciones— puede valorarse, si no existe riesgo de hipoglucemia, administrar antes de la desconexión un bolo de acción rápida o ultrarrápida para cubrir la insulina basal prevista durante ese período.",
      mas: [
        "Esta estimación debe basarse en la administración basal o automática reciente, o en la pauta de respaldo individualizada.",
        "En desconexiones por ejercicio debe aplicarse además la reducción correspondiente según el tipo de actividad, la glucemia, la tendencia y la insulina activa.",
      ],
    },
    {
      cuando: "Prolongada prevista, con glargina programada",
      texto:
        "Cuando se prevea una interrupción prolongada o no sea posible reanudar el sistema —por ejemplo, cirugía, ingreso o exploraciones prolongadas— y se decida administrar glargina de forma programada, puede adelantarse aproximadamente dos horas antes de la retirada del dispositivo para evitar un vacío de insulinización.",
      mas: [],
    },
  ],
  detalles: [
    {
      cuando: "Basal de respaldo",
      texto:
        "La dosis basal de respaldo debe aproximarse a la basal diaria realmente necesaria o a la administración basal/automática reciente del sistema; si no se dispone de una estimación fiable, puede orientarse en torno al 40-50 % de la DTD reciente, individualizando según el control previo, riesgo de hipoglucemia, ejercicio, enfermedad intercurrente y cetonemia.",
    },
    {
      cuando: "Al reiniciar el sistema",
      texto:
        "Al reiniciar el sistema debe tenerse en cuenta el efecto residual de la basal administrada —menor y más predecible con glargina U-100 que con basales ultralargas— para evitar la superposición de insulina basal.",
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
    pausa:
      "Cuando la bomba con catéter se desconecta físicamente del cuerpo, debe suspenderse o pausarse la administración según las instrucciones del fabricante, para evitar que el sistema registre como administrada una insulina que no se ha infundido realmente.",
  },
  nota: "Estas pautas son orientativas y se apoyan en la farmacocinética de las insulinas más que en ensayos específicos en asa cerrada, por lo que deben individualizarse.",
};

/* ---------- Elección compartida: lo que el apartado 6 añade a la Figura 2 (p. 6) ---------- */
export const ELECCION_TEXTO = {
  factores:
    "La elección integra factores clínicos —edad, peso, dosis total de insulina, situación reproductiva e indicaciones regulatorias aprobadas— y factores personales —formato de bomba, control desde el móvil, destreza manual, agudeza visual, capacidad cognitiva, apoyo familiar o del cuidador, acceso a un equipo con experiencia en el sistema y disposición al anuncio de comidas—.",
  noJerarquia:
    "No puede basarse solo en la eficacia media de los ensayos ni en una jerarquía tecnológica rígida.",
  p: 6,
};
