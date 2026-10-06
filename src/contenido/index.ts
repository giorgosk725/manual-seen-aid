/* Punto único de entrada al contenido del capítulo. Las pantallas importan de aquí. */
import type { Apartado, Bloque, FiguraId, TablaId } from "./tipos";
import { DIAGRAMAS } from "./diagramas";
import { A01, A02, A03, A04, A05, A06 } from "./apartados/01-06";
import { A07, A08, A09 } from "./apartados/07-09";
import { A10, A11, A12, A13 } from "./apartados/10-13";

export * from "./tipos";
export { TABLAS, LISTA_TABLAS, SISTEMAS, type Sistema } from "./tablas";
export { FIGURAS, F1, F2, INFO } from "./figuras";
export { FIGURA3 } from "./figura3";
export { BIBLIOGRAFIA } from "./bibliografia";
export { GLOSARIO } from "./glosario";
export { algoritmoDelCapitulo, fichasDelCapitulo } from "./resumen-sistema";
export { DIAGRAMAS, type DiagramaId, type DiagramaMeta } from "./diagramas";

/* Datos de la obra (portada de la app y «Sobre esta versión»). */
export const CAPITULO = {
  titulo:
    "Tratamiento insulínico del paciente con diabetes mellitus tipo 1: automatización de la insulinoterapia",
  tituloCorto: "Automatización de la insulinoterapia",
  autor: "Georgios Kyriakos",
  filiacion:
    "Servicio de Endocrinología y Nutrición. Hospital General Universitario Santa Lucía. Cartagena. Murcia.",
  obra: "Manual SEEN · Actualización SEEN",
  sociedad: "Sociedad Española de Endocrinología y Nutrición (SEEN)",
  editorial: "ec-europe",
  /* Fecha de la maquetación final que sirve de fuente única a esta app. */
  fechaFuente: "5 de octubre de 2026",
  fechaFuenteISO: "2026-10-05",
  paginas: 25,
  /* Capítulo del Manual SEEN que precede a este (MDI), al que remite la introducción (p. 1). */
  continuaA: "Tratamiento insulínico del paciente con diabetes tipo 1: múltiples dosis de insulina",
} as const;

export const APARTADOS: Apartado[] = [
  A01,
  A02,
  A03,
  A04,
  A05,
  A06,
  A07,
  A08,
  A09,
  A10,
  A11,
  A12,
  A13,
];

export const apartadoPorSlug = (slug: string | undefined): Apartado | undefined =>
  APARTADOS.find((a) => a.slug === slug);

export const apartadoDeTabla = (id: TablaId): Apartado | undefined =>
  APARTADOS.find((a) => a.bloques.some((b) => b.t === "tabla" && b.id === id));

export const apartadoDeFigura = (id: FiguraId): Apartado | undefined =>
  APARTADOS.find((a) => a.bloques.some((b) => b.t === "figura" && b.id === id));

/* Índice del bloque tras el que se muestra algo anclado a `ancla` dentro de un apartado:
   - sin ancla: al final del apartado;
   - id de tabla o de figura (T3, F2): justo después de ese bloque;
   - id de subapartado (gestacion): al final de ese subapartado, antes del siguiente;
   - id de bloque (b36): justo después de él.
   Devuelve -1 si el ancla no existe (el test de contenido lo vigila). */
export function posicionDeAncla(a: Apartado, ancla?: string): number {
  const ultimo = a.bloques.length - 1;
  if (!ancla) return ultimo;
  const i = a.bloques.findIndex(
    (b, k) =>
      ((b.t === "tabla" || b.t === "figura") && b.id === ancla) || idDeBloque(b, k) === ancla,
  );
  if (i < 0) return -1;
  if (a.bloques[i].t !== "h3") return i;
  const sig = a.bloques.findIndex((b, k) => k > i && b.t === "h3");
  return sig < 0 ? ultimo : sig - 1;
}

/* Dónde se inserta cada diagrama (apartado y ancla del bloque). Los de la 0.3.0 son bloques
   del apartado; los posteriores se muestran tras su ancla con id «d-<id>». */
export const ubicacionDeDiagrama = (id: string) => {
  for (const a of APARTADOS) {
    const i = a.bloques.findIndex((b) => b.t === "diagrama" && b.id === id);
    if (i >= 0) return { apartado: a, ancla: idDeBloque(a.bloques[i], i) };
  }
  const meta = DIAGRAMAS.find((d) => d.id === id);
  const a = meta && apartadoPorSlug(meta.apartado);
  if (meta?.ancla && a) return { apartado: a, ancla: `d-${id}` };
  return null;
};

/* Diagramas posteriores a la 0.3.0 que se muestran tras el bloque `i` de un apartado. */
export const diagramasTrasBloque = (a: Apartado, i: number) =>
  DIAGRAMAS.filter((d) => d.ancla && d.apartado === a.slug && posicionDeAncla(a, d.ancla) === i);

/* Subapartados (h3) de un apartado, para el índice «En este apartado». */
export const subapartados = (a: Apartado) =>
  a.bloques.filter((b): b is Extract<Bloque, { t: "h3" }> => b.t === "h3");

/* Id estable de cada bloque dentro de su apartado (anclas de la búsqueda y del enlace
   «copiar enlace»): h3 usa su id; el resto, su posición. */
export const idDeBloque = (b: Bloque, i: number) => (b.t === "h3" ? b.id : `b${i + 1}`);

/* Página «Autoevaluación» del capítulo (índice de la p. 1; en el PDF el hueco está vacío). */
export const AUTOEVALUACION = { titulo: "Autoevaluación", pagina: 24 } as const;
