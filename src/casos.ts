/* Casos guiados: datos y tipos. Los casos (escenario ficticio, pasos con opciones, comentario
   y citas literales del capítulo con su página) viven en `src/casos/*.json`: los tres del
   4-10-2026 y el ejemplo de descarga, aprobados el 9-10-2026 (casos.test.tsx comprueba que cada cita es literal y está
   en su página). Un caso nuevo es contenido escrito por la app: va en `src/casos-borrador/`
   (fuera del repositorio) y solo en copias de revisión hasta que se apruebe (AGENTS 28). */

export interface CitaCaso {
  /* Texto literal del capítulo. */
  t: string;
  p: number;
  /* De dónde sale: «Texto», «Tabla 4», «Figura 3». */
  f: string;
}

export interface OpcionCaso {
  texto: string;
  /* «si» = lo que indica el capítulo; «no» = no lo es; «matiz» = no es un error, pero el
     capítulo no lo pide en ese punto. */
  tipo: "si" | "no" | "matiz";
  /* Comentario de la app (borrador hasta su aprobación). */
  comentario: string;
  citas: CitaCaso[];
  /* La respuesta cita una dosis con asterisco de la Figura 3: va con su nota. */
  asterisco?: boolean;
}

export interface PasoCaso {
  situacion: string;
  pregunta: string;
  opciones: OpcionCaso[];
}

export interface Caso {
  id: string;
  titulo: string;
  sistema: string;
  temas: string;
  paginas: string;
  escenario: string;
  pasos: PasoCaso[];
  cierre: { texto: string; citas: CitaCaso[] };
}

const modulos = import.meta.glob<Caso[]>(["./casos/*.json", "./casos-borrador/*.json"], {
  eager: true,
  import: "default",
});

export const CASOS: Caso[] = Object.keys(modulos)
  .sort()
  .flatMap((k) => modulos[k]);

export const casoPorId = (id?: string) => CASOS.find((c) => c.id === id);
