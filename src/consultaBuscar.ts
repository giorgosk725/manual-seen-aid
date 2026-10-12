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

export function alCambiarConsulta(fn: () => void) {
  window.addEventListener(EVENTO, fn);
  return () => window.removeEventListener(EVENTO, fn);
}

/* Junto a cada campo de búsqueda. */
export const AVISO_BUSQUEDA = "Busca términos del capítulo; no introduzcas datos de pacientes.";
