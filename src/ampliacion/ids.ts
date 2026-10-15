/* Lo ligero de los sistemas: identificadores, orden de columnas, fotos y webs. Lo usan
   pantallas que se cargan al entrar (portada, diagramas y tablas de un apartado) sin
   arrastrar los datos de la ampliación del autor, que van en su propio trozo perezoso. */
import devMm780 from "../assets/devices/mm780.webp";
import devCiq from "../assets/devices/ciq.webp";
import devCamaps from "../assets/devices/camaps.webp";
import devOp5 from "../assets/devices/op5.webp";
import type { SistemaId } from "./tipos";

/* Fotos oficiales de producto (Medtronic, Tandem/Novalab, mylife/Ypsomed e Insulet), lienzo
   blanco 480 px, las mismas que usa asistente-aid. */
export const FOTO_SISTEMA: Record<SistemaId, string> = {
  mm780: devMm780,
  ciq: devCiq,
  camaps: devCamaps,
  op5: devOp5,
};

/* Orden de las columnas de las tablas por sistema del capítulo (Tabla 1, 3 y 4). */
export const ORDEN_SISTEMAS: SistemaId[] = ["mm780", "ciq", "camaps", "op5"];

/* Nombre corto de cada sistema (selectores en el móvil), en el orden de las columnas. */
/* 0.74.2: Tandem lleva Control-IQ o Control-IQ+ según el dispositivo y la versión de software
   (apartado 4; Mobi, con Control-IQ+): los dos nombres a la vista. */
export const CORTO_SISTEMA = ["MiniMed 780G", "Control-IQ / Control-IQ+", "CamAPS FX", "Omnipod 5"];
/* En las casillas estrechas del selector (cuatro en una fila en el móvil), el nombre breve. */
export const CORTO_CASILLA = ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"];

export const columnaDeSistema = (id: SistemaId) => ORDEN_SISTEMAS.indexOf(id);

/* Web oficial del fabricante o distribuidor en España. */
export const WEB_SISTEMA: Record<SistemaId, string> = {
  mm780: "https://www.medtronic-diabetes.com/es-ES",
  ciq: "https://www.novalab.es/bombas-insulina/sistema-asa-cerrada-control-iq",
  camaps: "https://www.mylife-diabetescare.com/es-ES",
  op5: "https://www.omnipod.com/es-es",
};

/* Catálogo mínimo de los cuatro sistemas (V54-12): id, nombre publicado y nombre corto. Lo usan
   Sistemas y el buscador para la identidad; los datos clínicos de la ampliación (retirada en
   esta edición) no entran en el paquete por eso. */
export interface SistemaCatalogo {
  id: SistemaId;
  name: string;
  short: string;
}
export const CATALOGO_SISTEMAS: SistemaCatalogo[] = [
  { id: "mm780", name: "MiniMed 780G", short: "780G" },
  { id: "ciq", name: "Tandem Control-IQ / Control-IQ+", short: "Control-IQ" },
  { id: "camaps", name: "myLoop CamAPS FX", short: "CamAPS" },
  { id: "op5", name: "Omnipod 5", short: "Omnipod 5" },
];
export const sistemaDelCatalogo = (id: string | undefined) =>
  CATALOGO_SISTEMAS.find((s) => s.id === id);
