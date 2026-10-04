/* «Iniciar un sistema»: el apartado 8 (pp. 10-12) en sus cuatro fases, con lo que piden los
   apartados 6, 7 y 9 en cada una. No hay texto escrito aquí: cada pieza apunta a un párrafo
   (y a sus frases), a una lista, a una fila de tabla o a la casilla de un sistema, y se pinta
   tal cual con su página. Los nombres de las fases son los del propio capítulo (p. 10).
   Lo único de la app: los rótulos cortos de la navegación y de los hitos del seguimiento. */
import { APARTADOS, TABLAS, idDeBloque, type Bloque, type TablaId } from "./contenido";
import { plano } from "./marcado";
import { frases } from "./frases";
import { href } from "./rutas";

export type Pieza =
  /* Frases `k` (en orden) de un párrafo. */
  | { t: "frase"; apartado: string; bloque: string; k: number[] }
  /* Una lista entera, con su introducción. */
  | { t: "lista"; apartado: string; bloque: string }
  /* Fila de una tabla que no va por sistema (Tabla 2), con sus columnas. */
  | { t: "fila"; tabla: TablaId; fila: number }
  /* Fila de una tabla por sistema (Tabla 1): la casilla del sistema elegido o las cuatro. */
  | { t: "casilla"; tabla: TablaId; fila: number }
  /* Tabla 2, «Inicialización del modo automático (por sistema)»: la línea del sistema. */
  | { t: "inicializacion" }
  /* Un hito del seguimiento: rótulo corto y la frase del capítulo que lo dice. */
  | { t: "hito"; rotulo: string; apartado: string; bloque: string; k: number[] }
  /* Fragmentos de la versión extendida (fuera del capítulo, rotulados). */
  | { t: "extendida"; ids: string[] }
  | { t: "enlace"; texto: string; ruta: string };

export interface Fase {
  id: string;
  /* Nombre de la fase tal como lo da el capítulo (p. 10). */
  nombre: string;
  /* Rótulo corto para la navegación (de la app). */
  corto: string;
  paginas: string;
  piezas: Pieza[];
}

export const FASES: Fase[] = [
  {
    id: "preparacion",
    nombre: "Selección individualizada y preparación",
    corto: "Preparación",
    paginas: "pp. 5-7",
    piezas: [
      { t: "frase", apartado: "06-indicaciones", bloque: "b3", k: [0, 1] },
      { t: "casilla", tabla: "T1", fila: 7 },
      { t: "frase", apartado: "06-indicaciones", bloque: "b5", k: [0] },
      { t: "frase", apartado: "06-indicaciones", bloque: "b5", k: [2] },
      { t: "enlace", texto: "Elección compartida (Figura 2)", ruta: href("visual", "eleccion") },
      { t: "frase", apartado: "07-educacion", bloque: "b1", k: [2] },
      { t: "lista", apartado: "07-educacion", bloque: "b4" },
    ],
  },
  {
    id: "inicio",
    nombre: "Inicio del sistema",
    corto: "Inicio",
    paginas: "pp. 10-12",
    piezas: [
      { t: "fila", tabla: "T2", fila: 0 },
      { t: "inicializacion" },
      { t: "frase", apartado: "08-iniciacion", bloque: "b6", k: [0, 1] },
      { t: "fila", tabla: "T2", fila: 2 },
      { t: "fila", tabla: "T2", fila: 3 },
      { t: "frase", apartado: "08-iniciacion", bloque: "b8", k: [2, 3] },
      { t: "fila", tabla: "T2", fila: 4 },
      { t: "fila", tabla: "T2", fila: 5 },
      { t: "fila", tabla: "T2", fila: 6 },
      { t: "fila", tabla: "T2", fila: 7 },
      { t: "casilla", tabla: "T1", fila: 6 },
      { t: "casilla", tabla: "T1", fila: 10 },
      { t: "frase", apartado: "08-iniciacion", bloque: "b7", k: [1] },
      { t: "fila", tabla: "T2", fila: 8 },
      { t: "extendida", ids: ["E17", "E18"] },
      { t: "enlace", texto: "Transición desde MDI (diagrama)", ruta: href("visual", "transicion") },
      { t: "enlace", texto: "Tabla 2 completa", ruta: href("consultar", "tablas", "T2") },
    ],
  },
  {
    id: "primeros-meses",
    nombre: "Seguimiento estrecho durante los primeros 3 meses",
    corto: "3 primeros meses",
    paginas: "pp. 12-13",
    piezas: [
      { t: "frase", apartado: "08-iniciacion", bloque: "b9", k: [0] },
      {
        t: "hito",
        rotulo: "72 h y 1 semana · contacto remoto",
        apartado: "08-iniciacion",
        bloque: "b9",
        k: [1],
      },
      {
        t: "hito",
        rotulo: "2-4 semanas · revisión presencial",
        apartado: "08-iniciacion",
        bloque: "b9",
        k: [2],
      },
      {
        t: "hito",
        rotulo: "3 meses · visita con HbA1c",
        apartado: "08-iniciacion",
        bloque: "b9",
        k: [3],
      },
      { t: "frase", apartado: "09-descarga", bloque: "b2", k: [0, 1] },
      {
        t: "enlace",
        texto: "Revisar la descarga (Tabla 5, ocho pasos)",
        ruta: href("consultar", "descarga", "1"),
      },
    ],
  },
  {
    id: "mantenido",
    nombre: "Seguimiento mantenido a largo plazo",
    corto: "Largo plazo",
    paginas: "p. 12",
    piezas: [
      { t: "frase", apartado: "08-iniciacion", bloque: "b11", k: [0, 2, 3] },
      { t: "frase", apartado: "08-iniciacion", bloque: "b12", k: [0, 1, 2, 3] },
      { t: "enlace", texto: "Seguimiento (diagrama)", ruta: href("visual", "seguimiento") },
    ],
  },
];

/* Cómo empieza cada línea de la casilla de inicialización (Tabla 2), en el orden de los
   sistemas de las Tablas 1, 3 y 4. */
const INICIO_DE_LINEA = ["MiniMed 780G:", "Control-IQ:", "CamAPS FX:", "Omnipod 5:"];

function bloqueDe(apartado: string, bloque: string): { b: Bloque; ruta: string } {
  const a = APARTADOS.find((x) => x.slug === apartado);
  const i = a ? a.bloques.findIndex((b, k) => idDeBloque(b, k) === bloque) : -1;
  if (!a || i < 0) throw new Error(`inicio.ts: no existe ${apartado}/${bloque}`);
  return { b: a.bloques[i], ruta: href("capitulo", apartado, bloque) };
}

/* Las frases pedidas de un párrafo, con su página, su entradilla y dónde leerlo. */
export function frasesDe(apartado: string, bloque: string, k: number[]) {
  const { b, ruta } = bloqueDe(apartado, bloque);
  if (b.t !== "p") throw new Error(`inicio.ts: ${apartado}/${bloque} no es un párrafo`);
  const fs = frases(plano(b.texto));
  const elegidas = k.map((n) => fs[n]);
  if (elegidas.some((f) => !f))
    throw new Error(`inicio.ts: faltan frases en ${apartado}/${bloque}`);
  return {
    // La entradilla («Configuración inicial (v. Tabla 2).») solo con la primera frase.
    lead: k[0] === 0 && b.lead ? plano(b.lead) : "",
    frases: elegidas,
    pagina: b.p,
    ruta,
  };
}

export function listaDe(apartado: string, bloque: string) {
  const { b, ruta } = bloqueDe(apartado, bloque);
  if (b.t !== "lista") throw new Error(`inicio.ts: ${apartado}/${bloque} no es una lista`);
  return { intro: b.intro ? plano(b.intro) : "", items: b.items.map(plano), pagina: b.p, ruta };
}

/* Línea de la Tabla 2 con la inicialización de un sistema (índice de columna 0-3), o todas. */
export function lineasInicializacion(sis?: number): string[] {
  const lineas = plano(TABLAS.T2.filas[1].celdas[0]).split("\n");
  if (sis === undefined) return lineas;
  const l = lineas.find((x) => x.startsWith(INICIO_DE_LINEA[sis]));
  if (!l) throw new Error(`inicio.ts: sin línea de inicialización para ${INICIO_DE_LINEA[sis]}`);
  return [l];
}

/* Hoja de comprobación para imprimir: lo que debe quedar hecho antes de activar el modo
   automático y las citas de los primeros 3 meses, todo con el texto del capítulo. */
export function hojaDeComprobacion(sis?: number) {
  const plan = listaDe("07-educacion", "b4");
  const nucleo = frasesDe("08-iniciacion", "b6", [0]);
  const seguimiento = frasesDe("08-iniciacion", "b9", [0]);
  return {
    // El plan de seguridad (p. 7) ya empieza por la pauta de respaldo: la fila «Plan de
    // respaldo» de la Tabla 2 lo repetiría (sigue en la fase «Inicio»).
    antes: [
      ...plan.items.map((texto) => ({ texto, pagina: plan.pagina })),
      { texto: nucleo.frases[0], pagina: nucleo.pagina },
      ...lineasInicializacion(sis).map((texto) => ({ texto, pagina: 10 })),
      { texto: plano(TABLAS.T2.filas[8].celdas[0]), pagina: 10 },
    ],
    planIntro: plan.intro,
    seguimiento: { texto: seguimiento.frases[0], pagina: seguimiento.pagina },
    // Con sistema: lo que se programa ese día según la Tabla 1 (pp. 3-4), con su nota.
    sistema:
      sis === undefined
        ? null
        : {
            objetivo: {
              etiqueta: plano(TABLAS.T1.filas[6].etiqueta),
              texto: plano(TABLAS.T1.filas[6].celdas[sis]),
            },
            parametros: {
              etiqueta: plano(TABLAS.T1.filas[10].etiqueta),
              texto: plano(TABLAS.T1.filas[10].celdas[sis]),
            },
            nota: plano(TABLAS.T1.notas.find((n) => n.startsWith("*")) ?? ""),
          },
    // Rótulos de la app para marcar en papel; la frase del capítulo va encima.
    citas: [
      "Primeras 72 h · contacto remoto",
      "1 semana · contacto remoto",
      "2-4 semanas · revisión presencial",
      "3 meses · visita con HbA1c y descarga",
    ],
  };
}
