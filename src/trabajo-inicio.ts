/* El trabajo de un inicio (I61-06): lo que se escribe en la calculadora, lo elegido en los pasos
   y lo marcado en la hoja, en un solo sitio. Vive en memoria mientras la app está abierta: abrir
   una fuente y volver lo conserva; «Nuevo inicio» lo vacía todo a la vez. No se guarda, no se
   envía y no lleva nada que identifique a una persona. La pauta previa es la misma en la
   calculadora y en el paso 1 de la fase Inicio. */
import { useSyncExternalStore } from "react";
import type { Control, Origen } from "./calculadora";

export interface DatosCalculadora {
  origen: Origen;
  /* null: sin contestar (19-10-2026: no se preselecciona la respuesta). */
  referencia: boolean | null;
  /* Con «Otro sistema AID»: el sistema actual (índice de la Tabla 1), o null. */
  sistemaPrevio: number | null;
  basal: string;
  rapida: string;
  dtd: string;
  peso: string;
  control: Control;
  reduccion: number;
  basalPct: number;
  regla: 1700 | 1800;
  objetivo: number;
  ultralarga: boolean;
  /* Lo que el profesional ha cambiado a mano (no se pisa al cambiar el control previo). */
  tocado: { reduccion: boolean; regla: boolean; objetivo: boolean };
}

export const DATOS_INICIALES = (): DatosCalculadora => ({
  origen: "mdi",
  referencia: null,
  sistemaPrevio: null,
  basal: "",
  rapida: "",
  dtd: "",
  peso: "",
  control: "bueno",
  reduccion: 10,
  basalPct: 45,
  regla: 1700,
  objetivo: 100,
  ultralarga: false,
  tocado: { reduccion: false, regla: false, objetivo: false },
});

export const trabajo: {
  calc: DatosCalculadora;
  resp: Record<string, string>;
  hechos: Set<string>;
  version: number;
} = { calc: DATOS_INICIALES(), resp: {}, hechos: new Set(), version: 0 };

const oyentes = new Set<() => void>();
let instantanea = { ...trabajo };
const avisar = () => {
  instantanea = { ...trabajo };
  oyentes.forEach((f) => f());
};

/* Cambia los datos de la calculadora; la pauta previa se comparte con el paso 1. */
/* Con otra pauta previa, la pregunta de la referencia es otra: vuelve a quedar sin contestar. */
const conOrigen = (c: DatosCalculadora, origen: Origen): DatosCalculadora =>
  origen === c.origen ? c : { ...c, origen, referencia: null };
export function cambiarCalculadora(cambio: Partial<DatosCalculadora>) {
  const base = cambio.origen ? conOrigen(trabajo.calc, cambio.origen) : trabajo.calc;
  trabajo.calc = { ...base, ...cambio };
  if (cambio.origen) trabajo.resp = { ...trabajo.resp, pauta: cambio.origen };
  avisar();
}
/* Las respuestas de los pasos; la pauta elegida allí pasa a la calculadora. */
export function cambiarRespuestas(resp: Record<string, string>) {
  trabajo.resp = resp;
  const p = resp.pauta;
  if (p === "mdi" || p === "isci" || p === "aid") trabajo.calc = conOrigen(trabajo.calc, p);
  avisar();
}
export function cambiarHechos(hechos: Set<string>) {
  trabajo.hechos = hechos;
  avisar();
}
/* «Nuevo inicio»: calculadora, respuestas y casillas, vacías a la vez. */
export function nuevoTrabajo() {
  trabajo.calc = DATOS_INICIALES();
  trabajo.resp = {};
  trabajo.hechos = new Set();
  trabajo.version++;
  avisar();
}
/* ¿Hay algo escrito, elegido o marcado? (para enseñar «Nuevo inicio» solo cuando sirve). */
export const hayTrabajo = () => {
  const c = trabajo.calc;
  const d = DATOS_INICIALES();
  return (
    !!(c.basal || c.rapida || c.dtd || c.peso) ||
    c.origen !== d.origen ||
    c.referencia !== d.referencia ||
    c.sistemaPrevio !== d.sistemaPrevio ||
    Object.keys(trabajo.resp).length > 0 ||
    trabajo.hechos.size > 0
  );
};

const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => oyentes.delete(f);
};
/* El trabajo actual, para pintar (se vuelve a pintar al cambiar). */
export const useTrabajo = () => useSyncExternalStore(suscribir, () => instantanea);
/* 0.96.1 (revisión de Codex, V95-01): ¿hay trabajo?, suscrito al almacén (antes, «Nuevo inicio» se
   leía con hayTrabajo() en el padre, que no se volvía a pintar al escribir el primer dato). */
export const useHayTrabajo = () => useSyncExternalStore(suscribir, hayTrabajo);
