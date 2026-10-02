/* Punto único de entrada al contenido del capítulo. Las pantallas importan de aquí. */
import type { Apartado, Bloque, FiguraId, TablaId } from "./tipos";
import { A01, A02, A03, A04, A05, A06 } from "./apartados/01-06";
import { A07, A08, A09 } from "./apartados/07-09";
import { A10, A11, A12, A13 } from "./apartados/10-13";

export * from "./tipos";
export { TABLAS, LISTA_TABLAS, SISTEMAS, type Sistema } from "./tablas";
export { FIGURAS, F1, F2, INFO } from "./figuras";
export { FIGURA3 } from "./figura3";
export { BIBLIOGRAFIA } from "./bibliografia";
export { GLOSARIO } from "./glosario";

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
  fechaFuente: "30 de septiembre de 2026",
  fechaFuenteISO: "2026-09-30",
  paginas: 25,
  /* El capítulo remite a esta guía para la profundización técnica (p. 1). */
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

/* Subapartados (h3) de un apartado, para el índice «En este apartado». */
export const subapartados = (a: Apartado) =>
  a.bloques.filter((b): b is Extract<Bloque, { t: "h3" }> => b.t === "h3");

/* Id estable de cada bloque dentro de su apartado (anclas de la búsqueda y del enlace
   «copiar enlace»): h3 usa su id; el resto, su posición. */
export const idDeBloque = (b: Bloque, i: number) => (b.t === "h3" ? b.id : `b${i + 1}`);

/* Página «Autoevaluación» del capítulo (índice de la p. 1; en el PDF el hueco está vacío). */
export const AUTOEVALUACION = { titulo: "Autoevaluación", pagina: 24 } as const;
