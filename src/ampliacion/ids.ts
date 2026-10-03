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

export const columnaDeSistema = (id: SistemaId) => ORDEN_SISTEMAS.indexOf(id);

/* Web oficial del fabricante o distribuidor en España. */
export const WEB_SISTEMA: Record<SistemaId, string> = {
  mm780: "https://www.medtronic-diabetes.com/es-ES",
  ciq: "https://www.novalab.es/bombas-insulina/sistema-asa-cerrada-control-iq",
  camaps: "https://www.mylife-diabetescare.com/es-ES",
  op5: "https://www.omnipod.com/es-es",
};
