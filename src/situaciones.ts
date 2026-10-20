import { normalizar } from "./busqueda";
/* Situaciones de «Situación y sistema» (filas de las Tablas 4 y 6) y los identificadores de
   sistema en la dirección. Datos de interfaz, sin texto propio: la conducta es la celda
   literal de la tabla. Los usa la pantalla (Recorridos.tsx) y el índice de búsqueda (para
   llevar cada fila a su recorrido). */

export interface Situacion {
  id: string;
  etiqueta: string;
  tabla: "T4" | "T6";
  fila: number;
  /* Párrafos del capítulo que la desarrollan: apartado + ancla. */
  leer: { slug: string; ancla?: string; titulo: string }[];
}

export const SITUACIONES: Situacion[] = [
  {
    id: "ejercicio-aerobico",
    etiqueta:
      "Ejercicio aeróbico planificado o situación previsible de mayor riesgo de hipoglucemia",
    tabla: "T4",
    fila: 0,
    leer: [{ slug: "10-situaciones", ancla: "ejercicio", titulo: "Ejercicio físico" }],
  },
  {
    id: "ejercicio-anaerobico",
    etiqueta: "Ejercicio anaeróbico o de alta intensidad",
    tabla: "T4",
    fila: 1,
    leer: [{ slug: "10-situaciones", ancla: "ejercicio", titulo: "Ejercicio físico" }],
  },
  {
    id: "sueno",
    etiqueta: "Sueño/período nocturno",
    tabla: "T4",
    fila: 2,
    // 0.72.0: un enlace por párrafo (el de «patrones» caía cuatro párrafos antes).
    leer: [
      { slug: "09-descarga", ancla: "b7", titulo: "Hipoglucemia nocturna" },
      { slug: "09-descarga", ancla: "b8", titulo: "Hiperglucemia matutina" },
    ],
  },
  {
    id: "necesidad-transitoria",
    etiqueta:
      "Mayor necesidad transitoria leve sin sospecha de fallo de infusión (enfermedad leve, menstruación o estrés)",
    tabla: "T4",
    fila: 3,
    leer: [
      {
        slug: "10-situaciones",
        ancla: "enfermedad",
        titulo: "Enfermedad intercurrente y riesgo de cetosis",
      },
    ],
  },
  {
    id: "hiperglucemia-puntual",
    etiqueta: "Hiperglucemia puntual sin sospecha de fallo de infusión",
    tabla: "T4",
    fila: 4,
    leer: [{ slug: "09-descarga", ancla: "incidencias", titulo: "Resolución de incidencias" }],
  },
  {
    id: "comida-grasa",
    etiqueta: "Comida rica en grasa o proteína",
    tabla: "T4",
    fila: 5,
    leer: [
      {
        slug: "09-descarga",
        ancla: "patrones",
        titulo: "Hiperglucemia tardía tras comidas grasas o proteicas",
      },
    ],
  },
  {
    id: "hiperglucemia-persistente",
    etiqueta: "Hiperglucemia persistente o inexplicada (sospecha de fallo de infusión)",
    tabla: "T4",
    fila: 6,
    leer: [
      {
        slug: "09-descarga",
        ancla: "incidencias",
        titulo: "Hiperglucemia persistente y sospecha de fallo de infusión",
      },
      { slug: "07-educacion", ancla: "b5", titulo: "Figura 3" },
    ],
  },
  {
    id: "rm",
    etiqueta: "Resonancia magnética",
    tabla: "T6",
    fila: 0,
    leer: [
      { slug: "10-situaciones", ancla: "exploraciones", titulo: "Exploraciones diagnósticas" },
    ],
  },
  {
    id: "tc",
    etiqueta: "Tomografía computarizada",
    tabla: "T6",
    fila: 1,
    leer: [
      { slug: "10-situaciones", ancla: "exploraciones", titulo: "Exploraciones diagnósticas" },
    ],
  },
  {
    id: "rx",
    etiqueta: "Radiografía o DEXA",
    tabla: "T6",
    fila: 2,
    leer: [
      { slug: "10-situaciones", ancla: "exploraciones", titulo: "Exploraciones diagnósticas" },
    ],
  },
  {
    id: "pet",
    etiqueta: "PET, medicina nuclear o radioterapia",
    tabla: "T6",
    fila: 3,
    leer: [
      { slug: "10-situaciones", ancla: "exploraciones", titulo: "Exploraciones diagnósticas" },
    ],
  },
  {
    id: "diatermia",
    etiqueta: "Diatermia o electrocirugía",
    tabla: "T6",
    fila: 4,
    leer: [
      { slug: "10-situaciones", ancla: "exploraciones", titulo: "Exploraciones diagnósticas" },
    ],
  },
  {
    id: "eco",
    etiqueta: "Ecografía, ECG o endoscopia sin electrocirugía",
    tabla: "T6",
    fila: 5,
    leer: [
      { slug: "10-situaciones", ancla: "exploraciones", titulo: "Exploraciones diagnósticas" },
    ],
  },
  {
    id: "cirugia-corta",
    etiqueta: "Cirugía corta (≤ 1 comida omitida), persona estable",
    tabla: "T6",
    fila: 6,
    leer: [
      {
        slug: "10-situaciones",
        ancla: "ingreso",
        titulo: "Ingreso hospitalario (período perioperatorio)",
      },
    ],
  },
  {
    id: "cirugia-larga",
    etiqueta: "Cirugía prolongada o compleja, o inestabilidad clínica",
    tabla: "T6",
    fila: 7,
    leer: [
      {
        slug: "10-situaciones",
        ancla: "ingreso",
        titulo: "Ingreso hospitalario (período perioperatorio)",
      },
    ],
  },
];

/* Sistema en la dirección (#/consultar/situacion/<situación>:<sistema>), en el orden de las
   columnas de las tablas. */
export const SIS_IDS = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

/* Un momento de una situación: rótulo de la app y párrafo literal del capítulo (apartado y
   bloque; si no es entero, las frases). La pantalla lo pinta con su página. */
export interface Momento {
  rotulo: string;
  apartado: string;
  bloque: string;
  k?: number[];
  /* Otros párrafos que van bajo el mismo rótulo. */
  mas?: { apartado: string; bloque: string; k?: number[] }[];
}
const S = "10-situaciones";
const E = "07-educacion";
const EJERCICIO_COMUN: Momento[] = [
  {
    rotulo: "Antes de empezar: glucosa, tendencia, insulina activa y cetonas",
    apartado: S,
    bloque: "b20",
  },
  // 0.74.2 (auditoría): por qué cambia la conducta según el tipo de ejercicio.
  { rotulo: "Efecto según el tipo de ejercicio", apartado: S, bloque: "b19", k: [1] },
];
const EJERCICIO_FINAL: Momento[] = [
  {
    rotulo: "Hipoglucemia: hidratos de carbono y conducta en asa cerrada",
    apartado: E,
    bloque: "b6",
    mas: [{ apartado: E, bloque: "b7" }],
  },
  {
    rotulo: "Deportes de contacto, acuáticos y desconexión",
    apartado: S,
    bloque: "b24",
    // 0.74.2: la desconexión programada por ejercicio (apartado 7: bolo previo y reducción).
    mas: [{ apartado: E, bloque: "b12", k: [1, 2, 3] }],
  },
  { rotulo: "Después del ejercicio: hipoglucemia diferida y noche", apartado: S, bloque: "b25" },
];
const EXPLORACION: Momento[] = [
  { rotulo: "Bomba y sensor, por separado", apartado: S, bloque: "b41" },
  { rotulo: "Lecturas del sensor tras la prueba", apartado: S, bloque: "b42" },
];
const CIRUGIA: Momento[] = [
  { rotulo: "Período perioperatorio", apartado: S, bloque: "b39" },
  { rotulo: "Criterios para no continuar y paso a pauta subcutánea", apartado: S, bloque: "b36" },
  { rotulo: "Basal programada antes de retirar el dispositivo", apartado: E, bloque: "b14" },
];
/* Los momentos de cada situación de las Tablas 4 y 6 (los que los tienen). */
export const GUION: Record<string, Momento[]> = {
  "ejercicio-aerobico": [
    ...EJERCICIO_COMUN,
    {
      rotulo: "Actividad planificada con descenso esperado: antes y durante",
      apartado: S,
      bloque: "b22",
    },
    { rotulo: "Actividad no planificada: al empezar", apartado: S, bloque: "b23", k: [0] },
    ...EJERCICIO_FINAL,
  ],
  "ejercicio-anaerobico": [
    ...EJERCICIO_COMUN,
    {
      rotulo: "Esfuerzo breve de alta intensidad o anaeróbico",
      apartado: S,
      bloque: "b23",
      k: [1],
    },
    ...EJERCICIO_FINAL,
  ],
  rm: EXPLORACION,
  tc: EXPLORACION,
  rx: EXPLORACION,
  pet: EXPLORACION,
  diatermia: EXPLORACION,
  eco: EXPLORACION,
  "cirugia-corta": CIRUGIA,
  "cirugia-larga": CIRUGIA,
};

/* Situaciones que no son una fila de tabla: se consultan por los momentos del capítulo. */
export interface SituacionGuia {
  id: string;
  etiqueta: string;
  intro: string;
  fuente: string;
  pagina: number;
  guion: Momento[];
  enlaces: { texto: string; ruta: string }[];
}
export const SITUACIONES_GUIA: SituacionGuia[] = [
  {
    id: "ingreso-hospitalario",
    etiqueta: "Ingreso hospitalario (planta, persona adulta no crítica)",
    intro:
      "Qué mantener, cuándo no y cómo pasar a una pauta subcutánea: lo que recoge el capítulo del posicionamiento internacional de 2026.",
    fuente: "pp. 20–21",
    pagina: 20,
    guion: [
      { rotulo: "Ámbito de aplicación", apartado: S, bloque: "b33" },
      { rotulo: "Mantenimiento de la MCG, la bomba o el AID", apartado: S, bloque: "b34" },
      {
        rotulo: "Criterios para no continuar y paso a pauta subcutánea",
        apartado: S,
        bloque: "b36",
      },
      { rotulo: "Dosis suplementarias y datos compartidos", apartado: S, bloque: "b37" },
      { rotulo: "Interpretación de la MCG en el hospital", apartado: S, bloque: "b38" },
      { rotulo: "Período perioperatorio", apartado: S, bloque: "b39" },
    ],
    enlaces: [
      { texto: "Objetivos en el hospital (figura)", ruta: "#/visual/objetivos-mcg/hospital" },
      { texto: "Exploraciones y cirugía (Tabla 6)", ruta: "#/consultar/tablas/T6" },
      { texto: "Interrupción del sistema y pauta alternativa", ruta: "#/consultar/interrupcion" },
      {
        texto: "Hoja para el paciente: pruebas y cirugía",
        ruta: "#/pacientes/hoja/pruebas-cirugia",
      },
    ],
  },
  {
    id: "gestacion",
    etiqueta: "Gestación, parto y posparto",
    intro:
      "Qué sistemas tienen autorización y evidencia, los objetivos de la gestación y cómo se ajusta cada sistema.",
    fuente: "pp. 17–18",
    pagina: 17,
    guion: [
      // 0.73.0: lo de cada sistema va arriba (GestacionSistema); aquí, lo común a los cuatro.
      { rotulo: "Elección del sistema", apartado: S, bloque: "b3", k: [0, 1] },
      { rotulo: "Objetivos de HbA1c y de MCG", apartado: S, bloque: "b4" },
      { rotulo: "Comparación de los ensayos", apartado: S, bloque: "b5", k: [3] },
      { rotulo: "Inicio y seguimiento", apartado: S, bloque: "b6", k: [0, 1] },
      { rotulo: "Cetoacidosis: vigilancia", apartado: S, bloque: "b10" },
      { rotulo: "Parto y posparto", apartado: S, bloque: "b11" },
    ],
    enlaces: [
      { texto: "Objetivos de la gestación (figura)", ruta: "#/visual/objetivos-mcg/gestacion" },
      {
        texto: "Objetivo del calculador de bolos en la gestación (Tabla 2)",
        ruta: "#/consultar/tablas/T2",
      },
      { texto: "Explorar criterios de elección", ruta: "#/sistemas/elegir" },
    ],
  },
  // 0.63.0 (auditoría de la 0.61, S61-03): los temas del apartado 10 que solo enlazaban al
  // capítulo, por momentos. Cada momento son frases literales de su párrafo; los rótulos son de
  // la app. Sin texto clínico nuevo.
  {
    id: "enfermedad-intercurrente",
    etiqueta: "Enfermedad intercurrente y riesgo de cetosis",
    intro:
      "Qué cambia con la enfermedad, qué hacer si hay cetosis con glucosa normal o baja y cuándo pasar a la Figura 3. La enfermedad leve sin sospecha de fallo, sistema a sistema, está en la Tabla 4.",
    fuente: "p. 20",
    pagina: 20,
    guion: [
      { rotulo: "Necesidades de insulina", apartado: S, bloque: "b27", k: [0] },
      { rotulo: "Plan de seguridad", apartado: S, bloque: "b27", k: [1] },
      {
        rotulo: "Cetosis con glucosa normal o baja: no suspender la insulina",
        apartado: S,
        bloque: "b27",
        k: [2],
      },
      {
        rotulo: "Hiperglucemia persistente o sospecha de cetosis",
        apartado: S,
        bloque: "b27",
        k: [3],
      },
    ],
    enlaces: [
      { texto: "Hiperglucemia y cetonemia (Figura 3)", ruta: "#/consultar/figura-3" },
      {
        texto: "Enfermedad leve, sin sospecha de fallo (Tabla 4)",
        ruta: "#/consultar/situacion/necesidad-transitoria",
      },
      { texto: "Hoja para el paciente: cetonas", ruta: "#/pacientes/hoja/cetonas" },
    ],
  },
  {
    id: "glucocorticoides",
    etiqueta: "Glucocorticoides sistémicos",
    intro:
      "Qué cambian, cuándo puede mantenerse el sistema y cuándo usar las funciones que intensifican la administración.",
    fuente: "p. 20",
    pagina: 20,
    guion: [
      { rotulo: "Efecto sobre la glucemia", apartado: S, bloque: "b29", k: [0] },
      { rotulo: "Mantenimiento del sistema", apartado: S, bloque: "b29", k: [1] },
      {
        rotulo: "Funciones que intensifican la administración",
        apartado: S,
        bloque: "b29",
        k: [2],
      },
    ],
    enlaces: [
      {
        texto: "Sospecha de fallo de infusión (Tabla 4)",
        ruta: "#/consultar/situacion/hiperglucemia-persistente",
      },
      { texto: "Hiperglucemia y cetonemia (Figura 3)", ruta: "#/consultar/figura-3" },
    ],
  },
  {
    id: "mayores",
    etiqueta: "Población mayor con DM1",
    intro:
      "Qué muestran los datos, a quién incluyó la evidencia, cómo se individualizan los objetivos y qué valorar al elegir y al seguir.",
    fuente: "p. 19",
    pagina: 19,
    guion: [
      { rotulo: "Evidencia", apartado: S, bloque: "b17", k: [0] },
      {
        rotulo: "Deterioro cognitivo: a quién incluyó la evidencia",
        apartado: S,
        bloque: "b17",
        k: [1],
      },
      { rotulo: "Objetivos según el estado funcional", apartado: S, bloque: "b17", k: [2] },
      { rotulo: "Elección del sistema", apartado: S, bloque: "b17", k: [3] },
      { rotulo: "Deterioro progresivo: reevaluar", apartado: S, bloque: "b17", k: [4] },
    ],
    enlaces: [
      { texto: "Objetivos de MCG por población (figura)", ruta: "#/visual/objetivos-mcg" },
      { texto: "Explorar criterios de elección", ruta: "#/sistemas/elegir" },
    ],
  },
  {
    id: "dialisis",
    etiqueta: "Diálisis y enfermedad renal avanzada",
    intro:
      "Qué cambia, cuándo puede mantenerse el sistema y qué ocurre en hemodiálisis y en diálisis peritoneal. La evidencia específica es limitada.",
    fuente: "p. 20",
    pagina: 20,
    guion: [
      { rotulo: "Necesidades de insulina", apartado: S, bloque: "b31", k: [0] },
      { rotulo: "Mantenimiento del sistema", apartado: S, bloque: "b31", k: [1] },
      { rotulo: "Hemodiálisis", apartado: S, bloque: "b31", k: [2] },
      { rotulo: "Diálisis peritoneal", apartado: S, bloque: "b31", k: [3] },
      { rotulo: "Evidencia y seguridad", apartado: S, bloque: "b31", k: [4, 5] },
    ],
    enlaces: [
      { texto: "Parámetros de cada sistema (Tabla 3)", ruta: "#/sistemas/todos/parametros" },
    ],
  },
  {
    id: "adolescencia",
    etiqueta: "Adolescencia y transición",
    intro:
      "Bolos omitidos, banderas rojas, alcohol, seguimiento compartido con la familia y el traspaso de pediatría a adultos.",
    fuente: "p. 18",
    pagina: 18,
    guion: [
      { rotulo: "Bolos omitidos", apartado: S, bloque: "b13" },
      {
        rotulo: "Banderas rojas: conducta alimentaria y diabulimia",
        apartado: S,
        bloque: "b14",
        k: [0, 1],
      },
      { rotulo: "Alcohol", apartado: S, bloque: "b14", k: [2] },
      {
        rotulo: "Seguimiento compartido con la familia",
        apartado: S,
        bloque: "b15",
        k: [0, 1],
      },
      { rotulo: "Transición a adultos: el traspaso", apartado: S, bloque: "b15", k: [2, 3] },
      { rotulo: "Revisión de la descarga", apartado: S, bloque: "b15", k: [4] },
    ],
    enlaces: [
      { texto: "Bolos omitidos o retrasados (apartado 9)", ruta: "#/capitulo/09-descarga/b20" },
    ],
  },
];
export const situacionGuia = (id?: string) => SITUACIONES_GUIA.find((x) => x.id === id);

/* Otros nombres con los que se busca cada situación (S61-02): siglas y palabras de la consulta.
   Las siglas cortas (hasta 3 letras) solo casan con una palabra entera: «tac» no es «gestación». */
export const ALIAS: Record<string, string[]> = {
  rm: ["rm", "rmn", "resonancia"],
  tc: ["tc", "tac", "tomografia", "escaner", "scanner"],
  rx: ["rx", "radiografia", "dexa", "densitometria"],
  pet: ["pet", "radioterapia", "medicina nuclear", "gammagrafia"],
  diatermia: ["bisturi", "electrocirugia", "diatermia"],
  eco: [
    "eco",
    "ecografia",
    "ecg",
    "electrocardiograma",
    "endoscopia",
    "colonoscopia",
    "gastroscopia",
  ],
  "cirugia-corta": ["cirugia", "quirofano", "operacion", "intervencion"],
  "cirugia-larga": ["cirugia", "quirofano", "operacion", "intervencion"],
  "ingreso-hospitalario": ["ingreso", "hospital", "planta", "hospitalizado"],
  sueno: ["noche", "nocturno", "dormir", "sueno"],
  "comida-grasa": ["grasa", "proteina", "pizza"],
  "ejercicio-aerobico": ["deporte", "correr", "ejercicio", "aerobico"],
  "ejercicio-anaerobico": ["deporte", "pesas", "ejercicio", "anaerobico", "intensidad"],
  "necesidad-transitoria": ["menstruacion", "regla", "estres", "catarro", "enfermedad leve"],
  "hiperglucemia-persistente": ["fallo", "set", "infusion", "cetonas"],
  gestacion: ["embarazo", "embarazada", "parto", "posparto", "gestante"],
  "enfermedad-intercurrente": ["enfermedad", "fiebre", "vomitos", "gripe", "cetosis", "cetonas"],
  glucocorticoides: ["corticoides", "prednisona", "dexametasona", "esteroides"],
  dialisis: ["dialisis", "hemodialisis", "renal", "rinon"],
  mayores: ["mayores", "ancianos", "anciano", "edad avanzada", "fragilidad"],
  adolescencia: ["adolescente", "adolescentes", "jovenes", "transicion", "alcohol", "diabulimia"],
};

/* ¿Casa el filtro con estos textos? Cada palabra escrita debe casar; las de hasta 3 letras
   (siglas: RM, TC, ECG) solo como palabra entera, para que «tac» no sea «gestación». */
export function casaFiltro(filtro: string, textos: string[]): boolean {
  const ps = normalizar(filtro).trim().split(/\s+/).filter(Boolean);
  if (!ps.length) return true;
  const ns = textos.map((t) => normalizar(t));
  return ps.every((w) =>
    w.length <= 3
      ? ns.some((t) => t.split(/[^a-z0-9ñ]+/).includes(w))
      : ns.some((t) => t.includes(w)),
  );
}
