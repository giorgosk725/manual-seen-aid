/* 0.94.0 (rediseño, fase 2): el algoritmo de cada sistema («Cómo funciona»), en un módulo sin más
   dependencias que los tipos: la portada enseña su «Tipo» sin arrastrar al arranque el resto de las
   fichas ni las fuentes. Los datos no cambian: se han movido tal cual desde fichaOperativa.ts, que
   los reexporta. */
import type { Pieza } from "./inicio";

/* Si un parámetro actúa en el modo automático (Tabla 1, fila de parámetros, y Tabla 3). */
export type EnAutomatico = "si" | "no" | "inicio" | "fijo" | "manual";

export interface Dato {
  r: string;
  v: string;
  /* El detalle, en una segunda línea más discreta. */
  n?: string;
  /* La condición de la fila (Tabla 4), bajo el rótulo. */
  cond?: string;
  /* Lo que el capítulo manda hacer antes (activar 1–2 h antes, revisar…), con el mismo peso que
     la respuesta, antes de ella. */
  antes?: string;
  /* Lo que cambia con la variante del sistema (Control-IQ+, Liberty). */
  variante?: { nombre: string; v: string };
  auto?: EnAutomatico;
  /* 0.87.1 (undécima ronda, visual): un dato con varias partes («·»), una por línea y a dos
     columnas en la rejilla (Control-IQ+ «Qué cambia»). */
  partes?: boolean;
  /* Adónde seguir en la app (otra herramienta), sin texto nuevo. */
  enlace?: { texto: string; ruta: string };
  f: Pieza[];
}
export interface GrupoFicha {
  titulo: string;
  datos: Dato[];
}

const t1 = (fila: number): Pieza => ({ t: "casilla", tabla: "T1", fila });
const t3 = (fila: number): Pieza => ({ t: "casilla", tabla: "T3", fila });

/* ---------- Cómo funciona: el algoritmo ---------- */
export const ALGORITMO: Dato[][] = [
  [
    { r: "Tipo", v: "SmartGuard · PID + lógica difusa", f: [t1(3)] },
    { r: "Funciona en", v: "La bomba", f: [t1(2)] },
    { r: "Administra", v: "Microbolos cada 5 min", f: [t1(4)] },
    { r: "Objetivo", v: "100, 110 o 120 mg/dl", f: [t1(6)] },
    {
      r: "Bolos automáticos de corrección",
      v: "Sí, hasta uno cada 5 min si predice > 120 mg/dl",
      n: "Safe Bolus reduce la dosis si se predice hipoglucemia",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
      v: "Basal automática cada medianoche",
      n: "Con la DTD de los últimos 2–6 días",
      f: [t1(3)],
    },
  ],
  [
    { r: "Tipo", v: "Control-IQ · MPC, predicción a 30 min", f: [t1(3)] },
    { r: "Funciona en", v: "La bomba", f: [t1(2)] },
    {
      r: "Administra",
      v: "Modula la basal programada cada 5 min",
      n: "La aumenta, la reduce o la suspende",
      f: [t1(4)],
    },
    {
      r: "Objetivo",
      // 0.84.1 (octava ronda, senior): «fijo» junto a un intervalo podía leerse mal.
      v: "112,5–160 mg/dl; no configurable",
      n: "Modo sueño 112,5–120 mg/dl · modo ejercicio 140–160 mg/dl",
      f: [t1(6), t3(0)],
    },
    {
      r: "Bolos automáticos de corrección",
      v: "Sí, máx. uno por hora si predice > 180 mg/dl a 30 min",
      n: "Administra el 60 % de la dosis para un objetivo de 110 mg/dl; no actúa en modo sueño",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
      v: "No incorpora autoaprendizaje",
      n: "Su rendimiento depende de mantener optimizados la basal y el factor de sensibilidad",
      f: [t1(3)],
    },
  ],
  [
    { r: "Tipo", v: "CamAPS FX · MPC adaptativo, predicción a 2,5–4 h", f: [t1(3), t1(4)] },
    { r: "Funciona en", v: "La app del smartphone", f: [t1(2)] },
    { r: "Administra", v: "Bolos extendidos cada 8–12 min", f: [t1(4)] },
    {
      r: "Objetivo",
      v: "80–198 mg/dl, por tramos",
      n: "Bloques de hasta cada 30 min · de fábrica, 104 mg/dl",
      f: [t1(6)],
    },
    {
      r: "Bolos automáticos de corrección",
      v: "No, sin bolos diferenciados",
      n: "Modula la administración continua",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
      v: "Multinivel, cada 24 h",
      n: "DTD, variaciones diurnas y patrones posprandiales",
      f: [t1(3)],
    },
  ],
  [
    { r: "Tipo", v: "SmartAdjust · MPC, predicción a 60 min", f: [t1(3), t1(4)] },
    {
      r: "Funciona en",
      v: "El pod",
      n: "Control mediante el controlador (Europa) o la app del smartphone (EE. UU.)",
      f: [t1(2)],
    },
    {
      r: "Administra",
      v: "Microbolos cada 5 min",
      n: "Con su basal adaptativa, que sustituye al perfil basal",
      f: [t1(4)],
    },
    {
      r: "Objetivo",
      v: "110, 120, 130, 140 o 150 mg/dl",
      n: "Hasta 8 tramos/día",
      f: [t1(6)],
    },
    {
      r: "Bolos automáticos de corrección",
      v: "No, sin bolos automáticos",
      n: "Incrementa la basal adaptativa hasta un 400 %",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
      v: "Adapta la basal por pod",
      n: "La recalcula con cada cambio de pod a partir del historial de administración, ponderando los pods más recientes",
      f: [t1(3)],
    },
  ],
];
