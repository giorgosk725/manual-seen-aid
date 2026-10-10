/* «Lo último que consultaste» (portada): el título de la pantalla no basta cuando dos visitas
   comparten título («Cetonemia paso a paso» con dos tramos). De la ruta sale un contexto breve:
   tramo, paso, fase y sistema, situación, sección de la ficha. Solo texto de interfaz. */
import { FIGURA3 } from "./contenido";
import { SIS_IDS, SITUACIONES } from "./situaciones";
import type { Ruta } from "./rutas";

const NOMBRE_SIS: Record<string, string> = {
  "minimed-780g": "MiniMed 780G",
  "control-iq": "Control-IQ",
  camaps: "CamAPS",
  "omnipod-5": "Omnipod 5",
};
const FASE: Record<string, string> = {
  preparacion: "Preparación",
  inicio: "Inicio",
  "primeros-meses": "3 primeros meses",
  mantenido: "Largo plazo",
  hoja: "Hoja de comprobación",
};
const SECCION: Record<string, string> = {
  esencial: "Lo esencial",
  funciona: "Cómo funciona",
  parametros: "Parámetros",
  situaciones: "Situaciones",
  ampliacion: "Ampliación técnica",
  completa: "Ficha completa",
};
const corto = (s: string, n = 38) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const conSistema = (base: string, sis?: string) =>
  sis && NOMBRE_SIS[sis] ? `${base} · ${NOMBRE_SIS[sis]}` : base;

export function contextoDeRuta(ruta: Ruta): string | undefined {
  const [detalle, sis] = (ruta.detalle ?? "").split(":");
  if (ruta.seccion === "consultar") {
    if (ruta.sub === "figura-3" && detalle)
      return FIGURA3.tramos.find((t) => t.clave === detalle)?.rango;
    if (ruta.sub === "descarga" && /^\d$/.test(detalle)) return `Paso ${detalle}`;
    if (ruta.sub === "inicio" && detalle) return conSistema(FASE[detalle] ?? detalle, sis);
    if (ruta.sub === "situacion" && detalle) {
      const st = SITUACIONES.find((x) => x.id === detalle);
      return st
        ? conSistema(corto(st.etiqueta), SIS_IDS.includes(sis) ? sis : undefined)
        : undefined;
    }
    if (ruta.sub === "interrupcion" && detalle)
      return detalle.charAt(0).toUpperCase() + detalle.slice(1);
    return undefined;
  }
  if (ruta.seccion === "sistemas" && ruta.detalle) return SECCION[ruta.detalle];
  if (ruta.seccion === "casos" && /^\d+$/.test(detalle)) return `Paso ${detalle}`;
  return undefined;
}
