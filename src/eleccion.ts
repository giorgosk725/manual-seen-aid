/* Elegir un sistema: los criterios que el capítulo pide integrar (apartado 6, p. 6: edad, peso,
   dosis total de insulina, situación reproductiva, indicaciones regulatorias; formato de bomba,
   control desde el móvil…) contrastados con la Tabla 1 (pp. 3–4). Sin React.

   Los umbrales de abajo están copiados de las celdas de la Tabla 1 y cada uno lleva el fragmento
   literal que lo justifica (`literal`); eleccion.test.ts comprueba que ese fragmento sigue en la
   celda, así los números no pueden separarse del capítulo. Lo que la tabla no dice queda como
   «no consta»: la pantalla orienta la decisión compartida, no la sustituye. */
import { TABLAS } from "./contenido";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";
import type { SistemaId } from "./ampliacion/tipos";

export interface Criterios {
  edad?: number;
  peso?: number;
  dtd?: number;
  gestacion?: boolean;
  dm2?: boolean;
  formato?: "cateter" | "pod";
  sensor?: string;
  movil?: boolean;
}

export type Estado = "cumple" | "fuera" | "no-consta";

/* Una variante autorizada dentro de un sistema (Control-IQ y Control-IQ+; CamAPS FX y Liberty).
   Sin nombre, el sistema solo tiene una. */
export interface Variante {
  nombre?: string;
  edadMin?: number;
  /* «> 13 años»: la edad mínima no está incluida. */
  edadExclusiva?: boolean;
  pesoMin?: number;
  pesoMax?: number;
  dtdMin?: number;
  dtdMax?: number;
  gestacion: Estado;
  dm2: Estado;
  /* Fragmentos literales de la Tabla 1 (filas «Indicación» y «Gestación») que justifican lo de arriba. */
  literal: string[];
}

export const VARIANTES: Record<SistemaId, Variante[]> = {
  mm780: [
    {
      edadMin: 2,
      dtdMin: 6,
      gestacion: "cumple",
      dm2: "cumple",
      literal: ["≥ 2 años; DTD ≥ 6 UI/día", "Autorización en diabetes tipo 2", "Autorizado (CE)"],
    },
  ],
  ciq: [
    {
      nombre: "Control-IQ",
      edadMin: 6,
      pesoMin: 25,
      pesoMax: 140,
      dtdMin: 10,
      dtdMax: 100,
      gestacion: "fuera",
      dm2: "no-consta",
      literal: [
        "Control-IQ: ≥ 6 años, peso 25–140 kg, DTD 10–100 UI/día",
        "Control-IQ: sin autorización",
      ],
    },
    {
      nombre: "Control-IQ+",
      edadMin: 2,
      pesoMin: 9,
      pesoMax: 200,
      dtdMin: 5,
      dtdMax: 200,
      gestacion: "cumple",
      dm2: "cumple",
      literal: [
        "Control-IQ+: ≥ 2 años, peso 9–200 kg, DTD 5–200 UI/día; autorización en diabetes tipo 2",
        "Control-IQ+: autorizado",
      ],
    },
  ],
  camaps: [
    {
      nombre: "CamAPS FX",
      edadMin: 1,
      pesoMin: 10,
      dtdMin: 5,
      dtdMax: 350,
      gestacion: "cumple",
      dm2: "no-consta",
      literal: ["≥ 1 año; peso ≥ 10 kg; DTD 5–350 UI/día", "CamAPS FX: autorizado (CE)"],
    },
    {
      // La Tabla 1 solo da la edad de Liberty: peso y dosis quedan como «no consta».
      nombre: "Liberty",
      edadMin: 13,
      edadExclusiva: true,
      gestacion: "fuera",
      dm2: "no-consta",
      literal: ["Liberty: > 13 años", "Liberty: no autorizado"],
    },
  ],
  op5: [
    {
      edadMin: 2,
      dtdMin: 5,
      gestacion: "fuera",
      dm2: "cumple",
      literal: [
        "≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día",
        "Autorización en diabetes tipo 2 (≥ 18 años)",
      ],
    },
  ],
};

/* Los sensores tal como los nombra la fila «Sensores compatibles» (para el selector). */
export const SENSORES = [
  "Guardian 4",
  "Simplera Sync",
  "Instinct",
  "Dexcom G6",
  "Dexcom G7",
  "FreeStyle Libre 3 Plus",
  "FreeStyle Libre 2 Plus",
] as const;

export const celdaT1 = (etiqueta: string, c: number) =>
  TABLAS.T1.filas.find((f) => f.etiqueta === etiqueta)?.celdas[c] ?? "";

const columna = (id: SistemaId) => ORDEN_SISTEMAS.indexOf(id);

export const CLAVES_CRITERIO = [
  "edad",
  "peso",
  "dtd",
  "gestacion",
  "dm2",
  "formato",
  "sensor",
  "movil",
] as const;
export type Clave = (typeof CLAVES_CRITERIO)[number];

export const ETIQUETA_CRITERIO: Record<Clave, string> = {
  edad: "Edad",
  peso: "Peso",
  dtd: "Dosis total diaria",
  gestacion: "Gestación o planificación",
  dm2: "Diabetes tipo 2",
  formato: "Formato",
  sensor: "Sensor",
  movil: "Control desde el móvil",
};

/* Lo que se dice de cada criterio, por criterio: nada de «cumple / fuera» globales. Para las
   preferencias (formato, sensor, móvil) es una coincidencia; para los umbrales, si el valor cae
   dentro de lo que la tabla da; para gestación y DM2, lo que dice la celda. */
const UMBRAL = {
  cumple: "Dentro del criterio",
  fuera: "Fuera del criterio",
  "no-consta": "No consta en la tabla",
};
export const ETIQUETA_ESTADO: Record<Clave, Record<Estado, string>> = {
  edad: UMBRAL,
  peso: UMBRAL,
  dtd: UMBRAL,
  gestacion: {
    cumple: "Autorizado",
    fuera: "Sin autorización",
    "no-consta": "No consta en la tabla",
  },
  dm2: {
    cumple: "Con autorización",
    fuera: "Sin autorización",
    "no-consta": "No consta en la tabla",
  },
  formato: {
    cumple: "Coincide con la preferencia",
    fuera: "Formato diferente",
    "no-consta": "No consta en la tabla",
  },
  sensor: {
    cumple: "Sensor compatible",
    fuera: "Sensor no listado",
    "no-consta": "No consta en la tabla",
  },
  movil: {
    cumple: "En la app del móvil",
    fuera: "En la bomba",
    "no-consta": "Según el país (ver la celda)",
  },
};

/* Fila de la Tabla 1 de la que sale cada criterio (lo que se enseña, literal). */
export const FILA_CRITERIO: Record<Clave, string> = {
  edad: "Indicación",
  peso: "Indicación",
  dtd: "Indicación",
  gestacion: "Gestación: autorización y evidencia",
  dm2: "Indicación",
  formato: "Formato",
  sensor: "Sensores compatibles",
  movil: "Localización del algoritmo",
};

const entre = (v: number, min?: number, max?: number, minExclusivo = false) => {
  if (min === undefined && max === undefined) return "no-consta" as const;
  if (min !== undefined && (minExclusivo ? v <= min : v < min)) return "fuera" as const;
  if (max !== undefined && v > max) return "fuera" as const;
  return "cumple" as const;
};

/* Qué dice la Tabla 1 de una variante para un criterio. */
export function evaluar(id: SistemaId, v: Variante, clave: Clave, c: Criterios): Estado | null {
  const col = columna(id);
  switch (clave) {
    case "edad":
      return c.edad === undefined ? null : entre(c.edad, v.edadMin, undefined, v.edadExclusiva);
    case "peso":
      return c.peso === undefined ? null : entre(c.peso, v.pesoMin, v.pesoMax);
    case "dtd":
      return c.dtd === undefined ? null : entre(c.dtd, v.dtdMin, v.dtdMax);
    case "gestacion":
      return c.gestacion ? v.gestacion : null;
    case "dm2":
      return c.dm2 ? v.dm2 : null;
    case "formato": {
      if (!c.formato) return null;
      const f = celdaT1("Formato", col);
      const pod = /^Pod/.test(f);
      return (c.formato === "pod") === pod ? "cumple" : "fuera";
    }
    case "sensor":
      return c.sensor
        ? celdaT1("Sensores compatibles", col).includes(c.sensor)
          ? "cumple"
          : "fuera"
        : null;
    case "movil": {
      if (!c.movil) return null;
      // «En la app del smartphone» cumple; «En la bomba» no; el resto (Omnipod 5: controlador
      // en Europa o app en EE. UU.) se deja leer tal cual.
      const l = celdaT1("Localización del algoritmo", col);
      return /^En la app del smartphone/.test(l)
        ? "cumple"
        : /^En la bomba/.test(l)
          ? "fuera"
          : "no-consta";
    }
  }
}

export interface Veredicto {
  id: SistemaId;
  nombre: string;
  variantes: { nombre?: string; estado: Estado; fuera: Clave[]; sinDato: Clave[] }[];
  /* El mejor estado entre sus variantes. */
  estado: Estado;
}

export const hayCriterios = (c: Criterios) =>
  CLAVES_CRITERIO.some((k) => c[k] !== undefined && c[k] !== false && c[k] !== "");

export function veredictos(c: Criterios): Veredicto[] {
  const orden: Estado[] = ["cumple", "no-consta", "fuera"];
  return ORDEN_SISTEMAS.map((id) => {
    const variantes = VARIANTES[id].map((v) => {
      const fuera: Clave[] = [];
      const sinDato: Clave[] = [];
      for (const k of CLAVES_CRITERIO) {
        const e = evaluar(id, v, k, c);
        if (e === "fuera") fuera.push(k);
        if (e === "no-consta") sinDato.push(k);
      }
      const estado: Estado = fuera.length ? "fuera" : sinDato.length ? "no-consta" : "cumple";
      return { nombre: v.nombre, estado, fuera, sinDato };
    });
    const estado = variantes
      .map((v) => v.estado)
      .sort((a, b) => orden.indexOf(a) - orden.indexOf(b))[0];
    return { id, nombre: TABLAS.T1.columnas[columna(id)], variantes, estado };
  }).sort((a, b) => orden.indexOf(a.estado) - orden.indexOf(b.estado));
}

/* Los criterios viajan en la ruta: #/sistemas/elegir/edad:4+peso:18+gestacion+sensor:Dexcom G7 */
export function leerCriterios(q?: string): Criterios {
  const c: Criterios = {};
  if (!q) return c;
  for (const parte of q.split("+")) {
    const [k, v] = parte.split(":");
    const n = Number(v);
    if (k === "edad" && Number.isFinite(n) && v) c.edad = n;
    else if (k === "peso" && Number.isFinite(n) && v) c.peso = n;
    else if (k === "dtd" && Number.isFinite(n) && v) c.dtd = n;
    else if (k === "gestacion") c.gestacion = true;
    else if (k === "dm2") c.dm2 = true;
    else if (k === "movil") c.movil = true;
    else if (k === "formato" && (v === "cateter" || v === "pod")) c.formato = v;
    else if (k === "sensor" && (SENSORES as readonly string[]).includes(v)) c.sensor = v;
  }
  return c;
}

export function escribirCriterios(c: Criterios): string | undefined {
  const partes: string[] = [];
  if (c.edad !== undefined) partes.push(`edad:${c.edad}`);
  if (c.peso !== undefined) partes.push(`peso:${c.peso}`);
  if (c.dtd !== undefined) partes.push(`dtd:${c.dtd}`);
  if (c.gestacion) partes.push("gestacion");
  if (c.dm2) partes.push("dm2");
  if (c.formato) partes.push(`formato:${c.formato}`);
  if (c.sensor) partes.push(`sensor:${c.sensor}`);
  if (c.movil) partes.push("movil");
  return partes.length ? partes.join("+") : undefined;
}
