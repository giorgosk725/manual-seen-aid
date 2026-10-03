/* Datos de la ampliación del autor que no coinciden con el capítulo (auditorías del 2-10-2026,
   §3, y del 3-10-2026). Hasta que el autor decida, la ficha los muestra con la marca «Difiere
   del capítulo» y la frase literal del capítulo con su página: manda el capítulo. Cuando el
   autor corrija la ampliación o el capítulo, se quita la entrada. */
import type { SistemaId } from "./tipos";

export interface Discrepancia {
  /* Frase literal del capítulo (o su nota) y dónde está. */
  capitulo: string;
  donde: string;
  p: number;
  /* Aclaración de la interfaz (no es texto del capítulo). */
  nota?: string;
}

const RATIO: Discrepancia = {
  capitulo:
    "*Parámetro con efecto directo sobre el algoritmo en modo automático; el resto interviene sobre todo en los bolos administrados por el paciente o en el modo manual.",
  donde: "Tabla 1, nota",
  p: 4,
  nota: "En la Tabla 1, las ratios I/HC no llevan asterisco en ningún sistema.",
};

/* Por campo de la ficha (clave de `detail`). */
export const DIFIERE_CAMPO: Partial<Record<SistemaId, Record<string, Discrepancia>>> = {
  mm780: {
    bolosCorr: {
      capitulo: "Sí; hasta uno cada 5 min si se predice > 120 mg/dl.",
      donde: "Tabla 1, bolos automáticos de corrección",
      p: 4,
    },
  },
  ciq: {
    estrategia: {
      capitulo:
        "Control-IQ: algoritmo de tipo MPC, que ajusta la administración cada 5 min a partir de una predicción a 30 min.",
      donde: "Tabla 1, lógica del algoritmo",
      p: 3,
    },
  },
};

/* Por parámetro (nombre en `params`). */
export const DIFIERE_PARAM: Partial<Record<SistemaId, Record<string, Discrepancia>>> = {
  mm780: { "Ratio insulina/HC": RATIO },
  ciq: { "Ratio insulina/HC": RATIO },
  camaps: { "Ratio insulina/HC": RATIO },
  op5: { "Ratio insulina/HC": RATIO },
};
