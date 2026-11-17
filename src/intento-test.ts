/* El intento de la autoevaluación vive en la memoria de la aplicación (auditoría de la 1.0.28, A02):
   al abrir el apartado citado y volver, se conservan las respuestas, el recuento y las
   explicaciones. Una sola fuente de estado: la opción elegida en cada pregunta; los aciertos se
   derivan de ella. Nada va a localStorage, sessionStorage, la URL ni el historial: al recargar la
   aplicación el intento empieza de cero, y «Volver a empezar» lo reinicia a mano. */
import { useSyncExternalStore } from "react";

export interface IntentoTest {
  /** Número del intento (cambia al volver a empezar: monta preguntas nuevas). */
  n: number;
  /** Opción elegida por pregunta (índice), solo las respondidas. */
  elegidas: Readonly<Record<string, number>>;
}

let actual: IntentoTest = { n: 0, elegidas: {} };
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

export function suscribirIntento(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}
export const intentoActual = () => actual;

/** Responde una pregunta; la primera respuesta es la que cuenta. */
export function responderPregunta(id: string, opcion: number) {
  if (id in actual.elegidas) return;
  actual = { ...actual, elegidas: { ...actual.elegidas, [id]: opcion } };
  avisar();
}

let anterior: IntentoTest | null = null;

export function volverAEmpezar() {
  anterior = Object.keys(actual.elegidas).length ? actual : null;
  actual = { n: actual.n + 1, elegidas: {} };
  avisar();
}

/** Deshace el último «Volver a empezar» si aún no se ha respondido nada en el intento nuevo. */
export function deshacerReinicio(): boolean {
  if (!anterior || Object.keys(actual.elegidas).length) return false;
  actual = { n: actual.n + 1, elegidas: anterior.elegidas };
  anterior = null;
  avisar();
  return true;
}

export const useIntentoTest = () =>
  useSyncExternalStore(suscribirIntento, intentoActual, intentoActual);
