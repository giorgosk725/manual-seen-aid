/* La fase «Inicio del sistema» de Iniciación del sistema, como recorrido paso a paso
   (#/consultar/inicio/inicio[:sistema][:paso]): cinco pasos en el orden en que se trabaja con la
   persona delante (de qué pauta viene, programación, objetivos, respaldo y activación). Las
   preguntas eligen qué pasajes se enseñan (sin elegir, se enseñan todos); las casillas se marcan
   durante la consulta (no se guarda nada). Solo referencias al texto del capítulo (piezas de
   inicio.ts); los títulos son los de las tareas de la fase. */
import { tituloDeTarea, type Pieza } from "./inicio";
import { href } from "./rutas";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";
import { materialListo } from "./materiales";
/* Solo «para entregar» si las plantillas del plan están aprobadas (V50-02). */
const TEXTO_PLAN = materialListo("planes")
  ? "Plan de seguridad (hoja para el paciente)"
  : "Plantilla del plan de seguridad (en revisión)";

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
  /* 0.96.0 (16.ª ronda, R5): otras continuaciones, según lo elegido (el cambio desde otro AID). */
  masEnlaces?: (sis?: number, resp?: Record<string, string>) => { texto: string; ruta: string }[];
}
/* El sistema en la ruta de la calculadora (como en situaciones.ts, SIS_IDS). */
const SLUG_CALCULADORA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

const I = "08-iniciacion";
const titulo = (id: string) => tituloDeTarea("inicio", id) ?? id;

export const PASOS_GUIA: PasoGuia[] = [
  {
    id: "transicion",
    titulo: titulo("transicion"),
    intro: "",
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
              // El efecto residual de la basal previa, menor con glargina U-100 (p. 9).
              { t: "frase", apartado: "07-educacion", bloque: "b14", k: [1] },
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
        rotulo: "Basal previa",
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
        ? { texto: "Transición desde MDI (Tabla 2)", ruta: href("consultar", "tablas", "T2") }
        : { texto: "Explorar criterios de elección", ruta: href("sistemas", "elegir") },
    // Desde otro sistema de asa cerrada: el cálculo en modo cambio (la pauta previa elegida aquí
    // pasa a la calculadora) y los parámetros de los cuatro, lado a lado.
    masEnlaces: (sis, resp) =>
      resp?.pauta === "aid"
        ? [
            {
              texto: "Cálculo de parámetros iniciales: cambio desde otro sistema AID",
              ruta: href(
                "consultar",
                "inicio",
                sis !== undefined ? `calculadora:${SLUG_CALCULADORA[sis]}` : "calculadora",
              ),
            },
            {
              texto: "Comparar los parámetros (Tabla 3)",
              ruta: href("sistemas", "todos", "parametros"),
            },
          ]
        : [],
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
      { t: "frase", apartado: I, bloque: "b6", k: [2] },
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
      // Modos y funciones temporales de cada sistema (Tabla 3) y la gestación (p. 17). 0.96.0
      // (16.ª ronda, R5): la gestación entre las dos casillas del objetivo (Tabla 1 y Tabla 3, dos
      // tablas literales distintas que se conservan): seguidas, con el mismo aspecto y las mismas
      // cifras, se leían como una fila repetida.
      { t: "frase", apartado: "10-situaciones", bloque: "b6", k: [0, 2] },
      { t: "casilla", tabla: "T3", fila: 0 },
    ],
    enlace: () => ({
      texto: "Objetivos de MCG por población (figura)",
      ruta: href("visual", "objetivos-mcg"),
    }),
  },
  {
    id: "respaldo",
    titulo: titulo("respaldo"),
    intro: "",
    piezas: [
      { t: "fila", tabla: "T2", fila: 0 },
      // La dosis basal de la pauta de respaldo (p. 9).
      { t: "frase", apartado: "07-educacion", bloque: "b13", k: [0, 1] },
    ],
    comprobar: "antes",
    enlace: (sis) =>
      sis !== undefined
        ? {
            texto: TEXTO_PLAN,
            ruta: href("pacientes", "plan", ORDEN_SISTEMAS[sis]),
          }
        : { texto: "Planes de seguridad (hojas para el paciente)", ruta: href("pacientes") },
  },
  {
    id: "arranque",
    titulo: titulo("arranque"),
    // Y qué esperar de cada algoritmo (Tabla 1, «Lógica del algoritmo y aprendizaje»).
    piezas: [{ t: "inicializacion" }, { t: "casilla", tabla: "T1", fila: 3 }],
  },
];

/* 0.96.0 (16.ª ronda, R5): cada pieza, una vez en el recorrido. Una pieza que un paso enseña por
   una de sus preguntas y que otro paso tiene como propia (fija) va en ese otro paso; aquí, un
   enlace a él. Devuelve el número (1-5) de ese paso o null. */
const clavePieza = (p: Pieza) => JSON.stringify(p, (_, v) => (v instanceof RegExp ? String(v) : v));
export function pasoPropioDe(pieza: Pieza, paso: number): number | null {
  if (PASOS_GUIA[paso].piezas.some((x) => clavePieza(x) === clavePieza(pieza))) return null;
  const k = PASOS_GUIA.findIndex(
    (x, i) => i !== paso && x.piezas.some((y) => clavePieza(y) === clavePieza(pieza)),
  );
  return k >= 0 ? k + 1 : null;
}
/* Si la pieza (o una que la contiene: las frases de un mismo párrafo) se enseña en el paso `k`
   con esas respuestas. */
export function seEnsenaEnPaso(pieza: Pieza, k: number, resp: Record<string, string>): boolean {
  return piezasDePaso(PASOS_GUIA[k], resp).some((x) =>
    x.t === "frase" && pieza.t === "frase"
      ? x.apartado === pieza.apartado &&
        x.bloque === pieza.bloque &&
        pieza.k.every((i) => x.k.includes(i))
      : clavePieza(x) === clavePieza(pieza),
  );
}

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
