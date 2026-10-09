/* Hojas para el paciente escritas por la app (no son texto del capítulo): tarjetas y hojas por
   situación, en lenguaje para el paciente a partir de una figura o tabla del capítulo. Como los
   casos: hasta que el autor las apruebe viven en `borradores/hojas/` (fuera del repositorio) y
   solo entran en las copias de revisión (`src/hojas-borrador/`); aprobadas, pasan a
   `src/hojas/`. Sin archivos, no hay hojas extra y la app no las ofrece. */

export interface SeccionHoja {
  titulo: string;
  items?: string[];
  parrafos?: string[];
}

export interface HojaExtra {
  id: string;
  estado: "borrador" | "aprobada";
  titulo: string;
  /* Rótulo de la hoja («Tarjeta de bolsillo», «Hoja para el paciente»). */
  rotulo: string;
  /* De dónde sale (figura, tabla y páginas del capítulo). */
  fuente: string;
  intro?: string;
  secciones: SeccionHoja[];
  /* Líneas para rellenar a mano en el papel. */
  huecos?: string[];
  nota?: string;
}

const modulos = import.meta.glob<HojaExtra[]>(["./hojas/*.json", "./hojas-borrador/*.json"], {
  eager: true,
  import: "default",
});

export const HOJAS_EXTRA: HojaExtra[] = Object.keys(modulos)
  .sort()
  .flatMap((k) => modulos[k]);

export const hojaExtraPorId = (id?: string) => HOJAS_EXTRA.find((h) => h.id === id);
