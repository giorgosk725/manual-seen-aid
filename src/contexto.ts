/* «Lo último que consultaste» (portada): el título de la pantalla no basta cuando dos visitas
   comparten título («Cetonemia paso a paso» con dos tramos). De la ruta sale un contexto breve:
   tramo, paso, fase y sistema, situación, sección de la ficha. Solo texto de interfaz. */
import { FIGURA3 } from "./contenido";
import { SIS_IDS, SITUACIONES } from "./situaciones";
import { tareaDePieza, tituloDeTarea } from "./inicio";
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
const NOMBRE_ID: Record<string, string> = {
  mm780: "MiniMed 780G",
  ciq: "Control-IQ",
  camaps: "CamAPS",
  op5: "Omnipod 5",
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
  const [detalle, sis, asp] = (ruta.detalle ?? "").split(":");
  if (ruta.seccion === "consultar") {
    if (ruta.sub === "figura-3" && detalle)
      return FIGURA3.tramos.find((t) => t.clave === detalle)?.rango;
    if (ruta.sub === "descarga" && /^\d$/.test(detalle)) return `Paso ${detalle}`;
    if (ruta.sub === "inicio" && detalle) {
      const base = conSistema(FASE[detalle] ?? detalle, sis);
      const rotulo = !asp
        ? null
        : /^a\d+$/.test(asp)
          ? (tareaDePieza(detalle, Number(asp.slice(1)))?.titulo ?? null)
          : tituloDeTarea(detalle, asp);
      return rotulo ? `${base} · ${corto(rotulo, 32)}` : base;
    }
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
  if (ruta.seccion === "sistemas" && ruta.detalle) {
    const seccion = SECCION[ruta.detalle];
    const ids = (ruta.sub ?? "").split("+").filter((x) => NOMBRE_ID[x]);
    // Con un solo sistema el título ya es su nombre; con varios, se nombran.
    if (ids.length >= 2)
      return [ids.map((x) => NOMBRE_ID[x]).join(" + "), seccion].filter(Boolean).join(" · ");
    if (ruta.sub === "todos") return ["Los cuatro", seccion].filter(Boolean).join(" · ");
    return seccion;
  }
  if (ruta.seccion === "casos" && /^\d+$/.test(detalle)) return `Paso ${detalle}`;
  return undefined;
}
