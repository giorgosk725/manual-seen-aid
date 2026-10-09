/* Guías de lectura por REFERENCIAS (entrega 3, docs/PLAN_2026-10-09.md). No llevan ninguna
   explicación propia: cada paso tiene un rótulo corto de la app (la estructura) y piezas que
   apuntan a texto literal del capítulo con su página, las mismas piezas que «Iniciar un
   sistema» (inicio.ts). Si una referencia deja de existir, falla guias.test.tsx, no la app.

   «Cómo funciona» un sistema: las filas de la Tabla 1 sobre el algoritmo, en el orden en que
   se entiende un sistema (qué mide, dónde decide, cómo administra, hacia qué objetivo, qué
   sigue haciendo la persona, qué ajusta el profesional, qué lo distingue, qué devuelve), con
   las frases generales de los apartados 2, 3 y 4. */
import { TABLAS } from "../contenido";
import type { SistemaId } from "../ampliacion/tipos";
import { href } from "../rutas";
import type { Pieza } from "../inicio";

export interface PasoGuia {
  /* Rótulo de la app (estructura), no del capítulo. */
  rotulo: string;
  piezas: Pieza[];
}

export interface Guia {
  id: string;
  titulo: string;
  pasos: PasoGuia[];
}

/* Identificador de cada sistema en las rutas de tablas (orden de la Tabla 1). */
const SLUG_TABLA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

/* Índice de una fila de la Tabla 1 por su rótulo: si el capítulo cambia, falla aquí y lo
   recoge la prueba, no se cita otra fila en silencio. */
export function filaT1(etiqueta: string): number {
  const i = TABLAS.T1.filas.findIndex((f) => f.etiqueta === etiqueta);
  if (i < 0) throw new Error(`guias: la Tabla 1 no tiene la fila «${etiqueta}»`);
  return i;
}

const casilla = (etiqueta: string): Pieza => ({
  t: "casilla",
  tabla: "T1",
  fila: filaT1(etiqueta),
});
const frase = (apartado: string, bloque: string, k: number[]): Pieza => ({
  t: "frase",
  apartado,
  bloque,
  k,
});

export function comoFunciona(c: number, id: SistemaId): Guia {
  const slug = SLUG_TABLA[c];
  return {
    id: `funciona-${id}`,
    titulo: "Cómo funciona",
    pasos: [
      {
        rotulo: "Qué información utiliza",
        piezas: [casilla("Sensores compatibles"), frase("02-componentes", "b4", [2])],
      },
      {
        rotulo: "Dónde está el algoritmo y cómo decide",
        piezas: [
          casilla("Localización del algoritmo"),
          casilla("Lógica del algoritmo y aprendizaje"),
          frase("03-algoritmos", "b1", [0]),
        ],
      },
      {
        rotulo: "Cómo administra la insulina",
        piezas: [
          frase("02-componentes", "b3", [1]),
          casilla("Estrategia de automatización"),
          casilla("Bolos automáticos de corrección"),
        ],
      },
      { rotulo: "Hacia qué objetivo", piezas: [casilla("Objetivo glucémico en modo automático")] },
      {
        rotulo: "Qué sigue haciendo la persona",
        piezas: [
          frase("03-algoritmos", "b2", [0]),
          // CamAPS: la modalidad Liberty de asa cerrada completa (p. 3).
          ...(id === "camaps" ? [frase("03-algoritmos", "b3", [1, 2])] : []),
        ],
      },
      {
        rotulo: "Qué puede ajustar el profesional",
        piezas: [
          frase("02-componentes", "b5", [1]),
          {
            t: "enlace",
            texto: "Parámetros de este sistema (Tablas 1 y 3)",
            ruta: href("sistemas", id, "parametros"),
          },
        ],
      },
      {
        rotulo: "Qué lo distingue en la práctica",
        piezas: [
          frase("04-sistemas", "b4", [1]),
          {
            t: "enlace",
            texto: "Comparar con otros sistemas (Tabla 1)",
            ruta: href("consultar", "tablas", `T1:${slug}`),
          },
        ],
      },
      {
        rotulo: "Qué información devuelve",
        piezas: [
          casilla("Plataforma de descarga"),
          {
            t: "enlace",
            texto: "Revisar la descarga en ocho pasos",
            ruta: href("consultar", "descarga", "1"),
          },
        ],
      },
    ],
  };
}
