/* La búsqueda en curso vive en memoria (edición editorial, A03): no va en la URL ni se guarda.
   Al abrir una fuente y volver con Atrás, Buscar la recupera de aquí; al recargar o cerrar la
   pestaña se pierde. Las direcciones antiguas «#/buscar/<texto>» se leen una vez y se sustituyen
   por «#/buscar». */
import { navegar } from "./rutas";

const EVENTO = "mseen:consulta";
let actual = "";

export const consultaBuscar = () => actual;

export function ponerConsulta(q: string) {
  if (q === actual) return;
  actual = q;
  window.dispatchEvent(new Event(EVENTO));
}

/* Abrir Buscar con una consulta (paleta, barra lateral, «Todos los resultados»). */
export function irABuscar(q: string) {
  ponerConsulta(q.trim());
  if (!window.location.hash.startsWith("#/buscar")) navegar("buscar");
}

/* 1.0.7 (revisión R105-01): para Atrás y Adelante dentro de Buscar, el historial del navegador
   lleva solo un identificador opaco; el texto se queda en esta memoria (algunos navegadores
   guardan `history.state` al restaurar la sesión). Tras recargar, el identificador ya no tiene
   texto y Buscar se abre vacío. Sin almacenamiento local ni de sesión. */
const enMemoria = new Map<string, string>();
const sesion = Math.random().toString(36).slice(2, 8);
let siguiente = 0;
export function marcaDeConsulta(q: string): string {
  const id = `${sesion}-${++siguiente}`;
  enMemoria.set(id, q);
  return id;
}
export const consultaDeMarca = (id: unknown): string | undefined =>
  typeof id === "string" ? enMemoria.get(id) : undefined;
/* Una copia del estado del historial sin el texto que guardaban versiones anteriores
   (`mseenConsulta`): no se propaga al escribir estados nuevos. */
export function estadoSinConsulta(estado: unknown): Record<string, unknown> {
  if (!estado || typeof estado !== "object") return {};
  const { mseenConsulta: _fuera, ...resto } = estado as Record<string, unknown>;
  void _fuera;
  return resto;
}

export function alCambiarConsulta(fn: () => void) {
  window.addEventListener(EVENTO, fn);
  return () => window.removeEventListener(EVENTO, fn);
}
