/* «Cómo interpretar este dato»: explicaciones breves de la app (no texto del capítulo) para los
   puntos densos: qué parámetros mueven el automático, el papel distinto de un parámetro según
   el sistema, herramienta frente a interpretación, hallazgos de la descarga. Como los casos:
   viven en `borradores/interpretaciones/` hasta que el autor las apruebe; en las copias de
   revisión entran por `src/interpretaciones-borrador/`; aprobadas, en `src/interpretaciones/`.
   Sin archivos, no se enseña nada. */
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
}

const modulos = import.meta.glob<Interpretacion[]>(
  ["./interpretaciones/*.json", "./interpretaciones-borrador/*.json"],
  { eager: true, import: "default" },
);

export const INTERPRETACIONES: Interpretacion[] = Object.keys(modulos)
  .sort()
  .flatMap((k) => modulos[k]);

export const interpretacionesDe = (tabla: TablaId, fila?: number) =>
  INTERPRETACIONES.filter((x) => x.tabla === tabla && (x.fila ?? undefined) === fila);
