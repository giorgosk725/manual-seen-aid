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
    etiqueta: "Sueño / período nocturno",
    tabla: "T4",
    fila: 2,
    leer: [
      {
        slug: "09-descarga",
        ancla: "patrones",
        titulo: "Hipoglucemia nocturna · Hiperglucemia matutina",
      },
    ],
  },
  {
    id: "necesidad-transitoria",
    etiqueta: "Enfermedad leve, menstruación o estrés, sin sospecha de fallo",
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
    etiqueta: "Hiperglucemia puntual sin sospecha de fallo",
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
    etiqueta: "Hiperglucemia persistente o inexplicada (sospecha de fallo)",
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
}
const S = "10-situaciones";
const E = "07-educacion";
const EJERCICIO_COMUN: Momento[] = [{ rotulo: "Antes de empezar", apartado: S, bloque: "b20" }];
const EJERCICIO_FINAL: Momento[] = [
  {
    rotulo: "Hidratos y tratamiento de la hipoglucemia con asa cerrada",
    apartado: E,
    bloque: "b6",
  },
  {
    rotulo: "Hipoglucemia leve cuando el algoritmo ya ha reducido la insulina",
    apartado: E,
    bloque: "b7",
  },
  { rotulo: "Deportes de contacto, agua y desconexión", apartado: S, bloque: "b24" },
  { rotulo: "Después del ejercicio: hipoglucemia diferida y noche", apartado: S, bloque: "b25" },
];
const EXPLORACION: Momento[] = [
  { rotulo: "Bomba y sensor, por separado", apartado: S, bloque: "b41" },
  { rotulo: "Lecturas del sensor tras la prueba", apartado: S, bloque: "b42" },
];
const CIRUGIA: Momento[] = [
  { rotulo: "Período perioperatorio", apartado: S, bloque: "b39" },
  { rotulo: "Cuándo no continuar y cómo pasar a pauta subcutánea", apartado: S, bloque: "b36" },
  { rotulo: "Basal programada antes de retirar el dispositivo", apartado: E, bloque: "b14" },
];
/* Los momentos de cada situación de las Tablas 4 y 6 (los que los tienen). */
export const GUION: Record<string, Momento[]> = {
  "ejercicio-aerobico": [
    ...EJERCICIO_COMUN,
    { rotulo: "Actividad planificada con descenso esperado", apartado: S, bloque: "b22" },
    { rotulo: "Actividad no planificada", apartado: S, bloque: "b23" },
    ...EJERCICIO_FINAL,
  ],
  "ejercicio-anaerobico": [
    ...EJERCICIO_COMUN,
    { rotulo: "Esfuerzo breve de alta intensidad o anaeróbico", apartado: S, bloque: "b23" },
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
    fuente: "pp. 20-21",
    pagina: 20,
    guion: [
      { rotulo: "Marco y a quién se aplica", apartado: S, bloque: "b33" },
      { rotulo: "Mantener la MCG, la bomba o el AID", apartado: S, bloque: "b34" },
      { rotulo: "Objetivos de glucosa en el hospital", apartado: S, bloque: "b35" },
      { rotulo: "Cuándo no continuar y cómo pasar a pauta subcutánea", apartado: S, bloque: "b36" },
      { rotulo: "Dosis suplementarias y datos compartidos", apartado: S, bloque: "b37" },
      { rotulo: "Leer la MCG en el hospital", apartado: S, bloque: "b38" },
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
    fuente: "pp. 17-18",
    pagina: 17,
    guion: [
      { rotulo: "Qué sistema: autorización y evidencia", apartado: S, bloque: "b3" },
      { rotulo: "Objetivos de HbA1c y de MCG", apartado: S, bloque: "b4" },
      { rotulo: "Lo que mostraron AiDAPT, CRISTAL y CIRCUIT", apartado: S, bloque: "b5" },
      { rotulo: "Seguimiento y objetivo del algoritmo", apartado: S, bloque: "b6" },
      { rotulo: "CamAPS FX", apartado: S, bloque: "b7" },
      { rotulo: "MiniMed 780G", apartado: S, bloque: "b8" },
      { rotulo: "Control-IQ+", apartado: S, bloque: "b9" },
      { rotulo: "Cetoacidosis: vigilancia", apartado: S, bloque: "b10" },
      { rotulo: "Parto y posparto", apartado: S, bloque: "b11" },
    ],
    enlaces: [
      { texto: "Objetivos de la gestación (figura)", ruta: "#/visual/objetivos-mcg/gestacion" },
      { texto: "Objetivo del calculador en gestación (Tabla 2)", ruta: "#/consultar/tablas/T2" },
      { texto: "Criterios de elección", ruta: "#/sistemas/elegir" },
    ],
  },
];
export const situacionGuia = (id?: string) => SITUACIONES_GUIA.find((x) => x.id === id);
