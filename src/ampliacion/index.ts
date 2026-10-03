/* Ampliación del autor (fuera del capítulo): punto de entrada. Lo ligero (identificadores,
   fotos, webs) vive en ids.ts para que las pantallas de entrada no carguen los datos. */
import { SISTEMAS_AMPLIACION } from "./datos";

export * from "./tipos";
export * from "./datos";
export * from "./ids";
export { FUENTES } from "./fuentes";
export { DIFIERE_CAMPO, DIFIERE_PARAM, type Discrepancia } from "./difiere";

export const sistemaPorId = (id: string | undefined) =>
  SISTEMAS_AMPLIACION.find((s) => s.id === id);
