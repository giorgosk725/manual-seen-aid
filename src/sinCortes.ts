/* Espacios duros entre cifra y unidad (componentes/SinCortes.tsx): la función de texto, aparte
   para pasarla a <Lineas> o <Texto> (que ya llevan su marcado y sus siglas). */
const NBSP = "\u00a0";
const UNIDADES =
  "mg\\/dl|mg\\/dL|mmol\\/l|minutos|min|horas|hora|h|UI\\/kg\\/día|UI\\/kg\\/h|UI\\/kg|UI\\/día|UI\\/h|UI|años|año|kg|g|%|semanas|semana|días|día|meses|mes|tramos\\/día|tramos";
const RE_UNIDAD = new RegExp(`(\\d) (${UNIDADES})(?![\\p{L}])`, "gu");
/* Intervalo («112,5–160», «2-3», «13-10-2026»), con su signo y su unidad si los lleva. */
export const RE_INTERVALO = new RegExp(
  `((?:[<>≤≥]${NBSP}?)?\\d+(?:,\\d+)?(?:[–-]\\d+(?:,\\d+)?)+(?:${NBSP}(?:${UNIDADES})(?![\\p{L}]))?)`,
  "u",
);
/* Piezas que <SinCortes> pinta sin partir: los intervalos y las palabras que no deben cortarse por
   su guion («β-OHB»; 0.79.1). El guion no se cambia por U+2011 (Open Sans no lo trae y saldría con
   otra letra) ni se le añade un carácter invisible (cambiaría el texto que se copia o se busca). */
const PALABRAS_CON_GUION = "β-OHB";
export const RE_PIEZA = new RegExp(
  `(${PALABRAS_CON_GUION}|${RE_INTERVALO.source.slice(1, -1)})`,
  "u",
);

/* El texto con sus espacios duros, sin piezas: para pasarlo a <Lineas> o <Texto>, que ya llevan
   su marcado y sus siglas. Solo cambia el espacio; las palabras y las cifras son las mismas. */
export function sinCortes(texto: string): string {
  return texto
    .replace(RE_UNIDAD, `$1${NBSP}$2`)
    .replace(/([<>≤≥]) (\d)/g, `$1${NBSP}$2`)
    .replace(/EE\. UU\./g, `EE.${NBSP}UU.`)
    .replace(/tipo (\d)/g, `tipo${NBSP}$1`)
    .replace(/ratios? I\/HC/g, (m) => m.replace(" ", NBSP))
    .replace(/(\d) (a|o) (\d)/g, `$1${NBSP}$2${NBSP}$3`);
}
