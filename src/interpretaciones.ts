/* «Cómo leer esta tabla» / «Cómo interpretar este hallazgo»: explicaciones breves de la app (no
   texto del capítulo) para los puntos densos, aprobadas por el autor el 11-10-2026. Como los
   casos: las nuevas viven en `borradores/interpretaciones/` hasta que se aprueben; en las copias
   de revisión entran por `src/interpretaciones-borrador/`; aprobadas, en `src/interpretaciones/`.
   Se cargan aparte (no van en el trozo de entrada). */
import type { TablaId } from "./contenido";

export interface Interpretacion {
  id: string;
  estado: "borrador" | "aprobada";
  /* Dónde se enseña: una tabla entera o una fila (p. ej. T5, fila 6 = paso 7). */
  tabla: TablaId;
  fila?: number;
  texto: string;
  /* De dónde sale lo que explica («Tabla 1, nota, p. 4»). */
  fuente: string;
  /* Un enlace al contexto pertinente del capítulo, si lo hay. */
  enlace?: { texto: string; ruta: string };
}

const modulos = import.meta.glob<Interpretacion[]>(
  ["./interpretaciones/*.json", "./interpretaciones-borrador/*.json"],
  { import: "default" },
);

let todas: Promise<Interpretacion[]> | null = null;
export function cargarInterpretaciones(): Promise<Interpretacion[]> {
  todas ??= Promise.all(
    Object.keys(modulos)
      .sort()
      .map((k) => modulos[k]()),
  ).then((listas) => listas.flat());
  return todas;
}

export const interpretacionesDe = (lista: Interpretacion[], tabla: TablaId, fila?: number) =>
  lista.filter((x) => x.tabla === tabla && (x.fila ?? undefined) === fila);
