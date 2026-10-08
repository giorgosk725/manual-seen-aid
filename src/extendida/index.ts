/* Versión extendida del autor (fuera del capítulo): acceso por apartado, tabla y sistema. */
import { posicionDeAncla, type Apartado } from "../contenido";
import type { SistemaId } from "../ampliacion/tipos";
import { FRAGMENTOS_EXTENDIDOS, type FragmentoExtendido } from "./fragmentos";

export * from "./fragmentos";

export const ROTULO_EXTENDIDA = "Versión extendida · no publicada en el Manual";

/* Fragmentos que se muestran tras el bloque `i` del apartado. */
export const extendidosTrasBloque = (a: Apartado, i: number): FragmentoExtendido[] =>
  FRAGMENTOS_EXTENDIDOS.filter(
    (f) => f.donde.apartado === a.slug && posicionDeAncla(a, f.donde.ancla) === i,
  );

export const extendidosDeTabla = (tablaId: string): FragmentoExtendido[] =>
  FRAGMENTOS_EXTENDIDOS.filter((f) => f.donde.ancla === tablaId);

export const extendidosDeSistema = (id: SistemaId): FragmentoExtendido[] =>
  FRAGMENTOS_EXTENDIDOS.filter((f) => f.sistemas.includes(id));

/* Texto plano de un fragmento (búsqueda, lectura en voz alta). */
export const textoDeFragmento = (f: FragmentoExtendido) =>
  f.partes.map((p) => (p ? p.texto : "[…]")).join(" ");
