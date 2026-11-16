/* Grado de cobertura de una búsqueda: una sola fuente para el rótulo visible del primer bloque y
   para el anuncio al lector de pantalla (auditoría de la 1.0.28, B04: «insulina semanal» se rotulaba
   «Coincidencia parcial» y se anunciaba «Hay respuesta del capítulo»). */
import type { Respuesta } from "./busqueda";

export type Cobertura = "especifica" | "relacionados" | "varios" | "parcial" | "ninguna";

/** `frecuente`: hay pregunta frecuente que responde; `primera`: el primer pasaje del motor. */
export function coberturaDe(frecuente: boolean, primera?: Respuesta): Cobertura {
  if (frecuente) return "especifica";
  if (!primera) return "ninguna";
  if (!primera.aproximada) return "relacionados";
  return primera.duda === "varias" ? "varios" : "parcial";
}

/** Rótulo del primer bloque de pasajes (sin pregunta frecuente). */
export const TITULO_COBERTURA: Record<Exclude<Cobertura, "especifica" | "ninguna">, string> = {
  relacionados: "Pasajes relacionados",
  varios: "Pasajes del capítulo",
  parcial: "Coincidencia parcial en el capítulo",
};

/** Anuncio para el lector de pantalla, con la misma cifra que «Todos los resultados (N)». */
export function anuncioCobertura(c: Cobertura, total: number, hayOtros: boolean): string {
  const mas = (n: number) => `${n} ${n === 1 ? "resultado más" : "resultados más"}`;
  const de = (base: string) => (total ? `${base} y ${mas(total)}.` : `${base}.`);
  switch (c) {
    case "especifica":
      return de("Hay respuesta del capítulo");
    case "relacionados":
      return de("Hay pasajes relacionados del capítulo");
    case "varios":
      return de("Hay varios pasajes del capítulo sobre la búsqueda");
    case "parcial":
      return `Solo hay coincidencias parciales: el capítulo puede no responder a esta consulta.${
        total ? ` ${total} ${total === 1 ? "resultado" : "resultados"}.` : ""
      }`;
    default:
      if (hayOtros) return de("Hay pasajes del capítulo sobre una parte de la búsqueda");
      return total ? `${total} ${total === 1 ? "resultado" : "resultados"}.` : "Sin resultados.";
  }
}
