/* Lo que el capítulo dice de cada sistema en la gestación (apartado 10, pp. 17-18, y la
   casilla de la Tabla 1 no se repite: las frases la dicen entera), en orden práctico. Solo referencias: el texto sale literal del
   capítulo (inicio.ts). Lo pinta componentes/GestacionSistema.tsx. */
import type { Pieza } from "./inicio";

const S = "10-situaciones";
const f = (bloque: string, k: number[], trozo?: RegExp): Pieza => ({
  t: "frase",
  apartado: S,
  bloque,
  k,
  trozo,
});

/* Por sistema, en el orden de la Tabla 1 (MiniMed 780G, Control-IQ, CamAPS FX, Omnipod 5). */
export const GESTACION_POR_SISTEMA: { rotulo: string; piezas: Pieza[] }[][] = [
  [
    {
      rotulo: "Autorización y evidencia",
      piezas: [f("b3", [3], /MiniMed 780G dispone asimismo[^;]*/), f("b5", [1])],
    },
    { rotulo: "Objetivo del algoritmo", piezas: [f("b8", [0])] },
    { rotulo: "Estrategia de ajuste", piezas: [f("b8", [1])] },
  ],
  [
    { rotulo: "Autorización y evidencia", piezas: [f("b9", [0]), f("b5", [2])] },
    { rotulo: "Estrategia de intensificación", piezas: [f("b9", [1])] },
    { rotulo: "Modo sueño continuado", piezas: [f("b9", [2, 3, 4])] },
  ],
  [
    { rotulo: "Autorización y evidencia", piezas: [f("b3", [2]), f("b5", [0])] },
    { rotulo: "Objetivo del algoritmo", piezas: [f("b6", [2, 3, 4])] },
    { rotulo: "Parámetros en modo automático", piezas: [f("b7", [0])] },
    { rotulo: "Boost y Ease-off", piezas: [f("b7", [1])] },
  ],
  [
    {
      rotulo: "Autorización",
      piezas: [f("b3", [3], /Omnipod 5 no dispone actualmente[^.]*\./)],
    },
  ],
];
