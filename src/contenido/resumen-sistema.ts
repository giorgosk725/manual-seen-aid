/* Resumen de un sistema sacado SOLO del capítulo (Tabla 1, pp. 3–4), para cabeceras y tarjetas:
   así lo primero que se lee de cada sistema es texto del capítulo, nunca la ampliación. */
import { TABLAS } from "./tablas";

const celda = (etiqueta: string, c: number) =>
  TABLAS.T1.filas.find((f) => f.etiqueta === etiqueta)?.celdas[c] ?? "";

/* «SmartGuard: algoritmo de tipo PID + lógica difusa», «Control-IQ: algoritmo de tipo MPC»… */
export const algoritmoDelCapitulo = (c: number) =>
  celda("Lógica del algoritmo y aprendizaje", c).split(/[.,]/)[0].trim();

export const fichasDelCapitulo = (c: number) => [
  { k: "Algoritmo", v: celda("Localización del algoritmo", c) },
  { k: "Sensores", v: celda("Sensores compatibles", c) },
  { k: "Plataforma", v: celda("Plataforma de descarga", c) },
];
