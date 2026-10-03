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
