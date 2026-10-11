/* «Guía paso a paso» de Iniciar un sistema (#/consultar/inicio/guia[:sistema][:paso]): seis
   pasos para recorrer con un paciente delante. Las preguntas eligen qué texto del capítulo se
   enseña; las casillas son para ir marcando en la consulta (no se guarda nada). Solo
   referencias al texto literal (piezas de inicio.ts); aquí no hay texto clínico propio. */
import { FASES, tareasDe, type Pieza } from "./inicio";
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
const PM = FASES.find((f) => f.id === "primeros-meses")!;
const calendario = tareasDe("primeros-meses")[0].piezas.map((i) => PM.piezas[i]);

export const PASOS_GUIA: PasoGuia[] = [
  {
    id: "pauta",
    titulo: "De qué pauta viene",
    intro: "Elige las opciones: la guía muestra los pasajes del capítulo relacionados con ellas.",
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
      resp?.pauta === "mdi"
        ? { texto: "Transición desde MDI (diagrama)", ruta: href("visual", "transicion") }
        : resp?.pauta
          ? { texto: "Criterios de elección del sistema", ruta: href("sistemas", "elegir") }
          : null,
  },
  {
    id: "parametros",
    titulo: "Parámetros iniciales",
    piezas: [
      { t: "frase", apartado: I, bloque: "b6", k: [0, 1] },
      { t: "fila", tabla: "T2", fila: 3 },
      { t: "fila", tabla: "T2", fila: 4 },
      { t: "fila", tabla: "T2", fila: 5 },
      { t: "fila", tabla: "T2", fila: 6 },
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
    titulo: "Objetivos de glucosa",
    piezas: [
      { t: "casilla", tabla: "T1", fila: 6 },
      { t: "fila", tabla: "T2", fila: 7 },
    ],
    enlace: () => ({
      texto: "Objetivos de MCG por población (figura)",
      ruta: href("visual", "objetivos-mcg"),
    }),
  },
  {
    id: "respaldo",
    titulo: "Plan de respaldo y educación",
    piezas: [
      { t: "fila", tabla: "T2", fila: 0 },
      { t: "lista", apartado: "07-educacion", bloque: "b4" },
    ],
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
    titulo: "Arranque del modo automático",
    // El requisito previo (núcleo configurado y plan de respaldo) queda a la vista aunque se
    // entre directamente en este paso.
    piezas: [{ t: "frase", apartado: I, bloque: "b6", k: [0] }, { t: "inicializacion" }],
  },
  {
    id: "seguimiento",
    titulo: "Primeras 72 h y 3 meses",
    piezas: calendario,
    comprobar: "citas",
    enlace: () => ({
      texto: "Revisar la descarga, paso a paso",
      ruta: href("consultar", "descarga", "1"),
    }),
  },
];

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
