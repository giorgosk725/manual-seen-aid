/* La fase «Inicio del sistema» de Iniciar un sistema, como recorrido paso a paso
   (#/consultar/inicio/inicio[:sistema][:paso]): cinco pasos en el orden en que se trabaja con la
   persona delante (de qué pauta viene, programación, objetivos, respaldo y activación). Las
   preguntas eligen qué pasajes se enseñan (sin elegir, se enseñan todos); las casillas se marcan
   durante la consulta (no se guarda nada). Solo referencias al texto del capítulo (piezas de
   inicio.ts); los títulos son los de las tareas de la fase. */
import { tituloDeTarea, type Pieza } from "./inicio";
import { href } from "./rutas";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";

export interface OpcionGuia {
  id: string;
  texto: string;
  piezas: Pieza[];
}
export interface PreguntaGuia {
  id: string;
  rotulo: string;
  opciones: OpcionGuia[];
  /* Solo se hace si otra pregunta tiene esa respuesta (y su respuesta se borra si cambia). */
  si?: { pregunta: string; opcion: string };
}
export interface PasoGuia {
  id: string;
  titulo: string;
  intro?: string;
  preguntas?: PreguntaGuia[];
  piezas: Pieza[];
  /* Lista de la hoja de comprobación que se marca en este paso. */
  comprobar?: "antes" | "citas";
  enlace?: (sis?: number, resp?: Record<string, string>) => { texto: string; ruta: string } | null;
}

const I = "08-iniciacion";
const titulo = (id: string) => tituloDeTarea("inicio", id) ?? id;

export const PASOS_GUIA: PasoGuia[] = [
  {
    id: "transicion",
    titulo: titulo("transicion"),
    intro: "Elige de qué pauta viene para ver solo lo que le corresponde.",
    preguntas: [
      {
        id: "pauta",
        rotulo: "Pauta previa",
        opciones: [
          {
            id: "mdi",
            texto: "Múltiples dosis (plumas)",
            piezas: [
              { t: "frase", apartado: I, bloque: "b7", k: [0] },
              { t: "fila", tabla: "T2", fila: 2 },
            ],
          },
          {
            id: "isci",
            texto: "Bomba sin automatización",
            piezas: [{ t: "frase", apartado: I, bloque: "b8", k: [0, 1] }],
          },
          {
            id: "aid",
            texto: "Otro sistema de asa cerrada",
            piezas: [{ t: "casilla", tabla: "T1", fila: 10 }],
          },
        ],
      },
      {
        id: "basal",
        rotulo: "La basal que lleva",
        si: { pregunta: "pauta", opcion: "mdi" },
        opciones: [
          {
            id: "u100",
            texto: "Glargina U-100, detemir o NPH",
            piezas: [{ t: "frase", apartado: I, bloque: "b7", k: [1] }],
          },
          {
            id: "larga",
            texto: "Glargina U-300 o degludec",
            piezas: [{ t: "fila", tabla: "T2", fila: 8 }],
          },
        ],
      },
    ],
    piezas: [],
    enlace: (_sis, resp) =>
      resp?.pauta === "mdi" || !resp?.pauta
        ? { texto: "Transición desde MDI (diagrama)", ruta: href("visual", "transicion") }
        : { texto: "Criterios de elección del sistema", ruta: href("sistemas", "elegir") },
  },
  {
    id: "parametros",
    titulo: titulo("parametros"),
    piezas: [
      { t: "frase", apartado: I, bloque: "b6", k: [0, 1] },
      { t: "fila", tabla: "T2", fila: 3 },
      { t: "frase", apartado: I, bloque: "b8", k: [2, 3] },
      { t: "fila", tabla: "T2", fila: 4 },
      { t: "fila", tabla: "T2", fila: 5 },
      { t: "casilla", tabla: "T1", fila: 10 },
    ],
    enlace: (sis) =>
      sis !== undefined
        ? {
            texto: "Parámetros de este sistema (Tablas 1 y 3)",
            ruta: href("sistemas", ORDEN_SISTEMAS[sis], "parametros"),
          }
        : {
            texto: "Comparar los parámetros (Tabla 3)",
            ruta: href("sistemas", "todos", "parametros"),
          },
  },
  {
    id: "objetivos",
    titulo: titulo("objetivos"),
    piezas: [
      { t: "fila", tabla: "T2", fila: 6 },
      { t: "fila", tabla: "T2", fila: 7 },
      { t: "casilla", tabla: "T1", fila: 6 },
    ],
    enlace: () => ({
      texto: "Objetivos de MCG por población (figura)",
      ruta: href("visual", "objetivos-mcg"),
    }),
  },
  {
    id: "respaldo",
    titulo: titulo("respaldo"),
    intro: "Marca lo que ya está hecho o entregado.",
    piezas: [{ t: "fila", tabla: "T2", fila: 0 }],
    comprobar: "antes",
    enlace: (sis) =>
      sis !== undefined
        ? {
            texto: "Plan de seguridad para entregar",
            ruta: href("pacientes", "plan", ORDEN_SISTEMAS[sis]),
          }
        : { texto: "Planes de seguridad para entregar", ruta: href("pacientes") },
  },
  {
    id: "arranque",
    titulo: titulo("arranque"),
    piezas: [{ t: "inicializacion" }],
  },
];

/* El paso pedido en la ruta: su id, su número (1-5) o el de la guía antigua («pauta», 1-6). */
export function pasoDeRuta(x?: string): number {
  if (!x) return 0;
  if (/^\d+$/.test(x)) return Math.min(PASOS_GUIA.length, Math.max(1, Number(x))) - 1;
  const i = PASOS_GUIA.findIndex((p) => p.id === (x === "pauta" ? "transicion" : x));
  return i >= 0 ? i : 0;
}

/* Las preguntas que se hacen con las respuestas dadas, y las respuestas limpias (sin las de
   preguntas que ya no se hacen). Puro. */
export function preguntasActivas(paso: PasoGuia, resp: Record<string, string>): PreguntaGuia[] {
  return (paso.preguntas ?? []).filter((q) => !q.si || resp[q.si.pregunta] === q.si.opcion);
}
export function limpiarRespuestas(resp: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of PASOS_GUIA)
    for (const q of preguntasActivas(p, resp)) if (resp[q.id]) out[q.id] = resp[q.id];
  return out;
}
/* Los pasajes de un paso: los fijos y, de cada pregunta, los de la opción elegida o, si aún no
   se ha elegido, los de todas (sin elegir no se esconde nada). Puro y sin repetidos. */
export function piezasDePaso(paso: PasoGuia, resp: Record<string, string>): Pieza[] {
  const out: Pieza[] = [...paso.piezas];
  for (const q of paso.preguntas ?? []) {
    const activa = !q.si || resp[q.si.pregunta] === q.si.opcion;
    const padreSinElegir = !!q.si && !resp[q.si.pregunta];
    if (!activa && !padreSinElegir) continue;
    const o = q.opciones.find((x) => x.id === resp[q.id]);
    out.push(...(o ? o.piezas : q.opciones.flatMap((x) => x.piezas)));
  }
  const vistas = new Set<string>();
  return out.filter((pz) => {
    const k = JSON.stringify(pz);
    return !vistas.has(k) && !!vistas.add(k);
  });
}
