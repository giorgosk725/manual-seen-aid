/* Lo ligero de la búsqueda: tipos, normalización, resaltado y el atajo por cifra de β-OHB.
   Sin datos: lo usan la portada y la paleta antes de que se cargue el índice (buscador.ts),
   que va en su propio trozo y se pide la primera vez que alguien escribe. */

export interface Entrada {
  id: string;
  tipo:
    | "texto"
    | "tabla"
    | "figura"
    | "diagrama"
    | "referencia"
    | "sigla"
    | "extendida"
    | "ampliacion"
    | "pacientes"
    | "test"
    | "atajo"
    | "caso"
    | "resumen";
  titulo: string;
  texto: string;
  /* Página del capítulo (0 = fuera del capítulo) y, si ocupa dos, la última. */
  pagina: number;
  pagina2?: number;
  ruta: string;
}

/* Lo que no es texto del capítulo se muestra en un grupo aparte y rotulado. */
export const fueraDelCapitulo = (e: Entrada) =>
  e.tipo === "extendida" ||
  e.tipo === "ampliacion" ||
  e.tipo === "pacientes" ||
  e.tipo === "test" ||
  e.tipo === "resumen";

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/* Respuesta de «Preguntas al capítulo» (respuestas.ts): texto LITERAL del capítulo con su
   página y el enlace a donde está. Aquí solo el tipo, para que la interfaz no cargue el motor. */
export interface Respuesta {
  id: string;
  tipo: "texto" | "tabla" | "figura" | "sigla";
  /* «Apartado 10 · Ejercicio físico», «Tabla 4. …», «Figura 3», «Glosario de siglas». */
  fuente: string;
  titulo: string;
  texto: string;
  /* Frase anterior, cuando la respuesta empieza por un conector («Por ello…»). */
  contexto?: string;
  /* Puntos de una lista, pasos de un tramo o cajas de una figura. */
  items?: string[];
  /* Columnas de una fila de las Tablas 2, 5 y 6, con su cabecera. */
  partes?: { etiqueta: string; texto: string }[];
  /* Fila de una tabla por sistema, sin sistema nombrado: las cuatro casillas. */
  porSistema?: { nombre: string; texto: string; ruta: string }[];
  /* Sistema de la casilla, si la pregunta lo nombra. */
  sistema?: string;
  /* Las cuatro casillas, aunque se haya elegido una (para cambiar de sistema en la tarjeta). */
  casillas?: { nombre: string; texto: string; ruta: string }[];
  pagina: number;
  pagina2?: number;
  ruta: string;
  score: number;
  /* Nada responde de lleno: es de lo más parecido que tiene el capítulo («lo más cercano»). */
  aproximada?: boolean;
}

/* Preguntas de ejemplo (todas con respuesta: lo comprueba respuestas.test.ts). */
export const EJEMPLOS_PREGUNTA = [
  "cetonas 1,2",
  "modo ejercicio en Control-IQ",
  "resonancia con 780G",
  "cuánto tiempo puedo estar desconectado",
  "hipoglucemia leve cuántos hidratos",
  "qué es el TBR",
];

export interface Resultado {
  entrada: Entrada;
  fragmento: string;
  puntos: number;
  /* Palabras de la consulta que aparecen (para ordenar cuando se busca con «alguna»). */
  aciertos?: number;
}

/* Resultados con el total de cada grupo. El límite se aplica POR GRUPO (capítulo y fuera del
   capítulo): si se cortara después de ordenar, los de fuera no aparecerían nunca en las
   búsquedas frecuentes («insulina», «sistema»). */
export interface Busqueda {
  resultados: Resultado[];
  totalCapitulo: number;
  totalFuera: number;
  /* Sin coincidencias con todas las palabras: resultados con alguna de ellas. */
  parcial?: boolean;
}

/* Atajo por cifra: «β-OHB 1,2», «cetonemia 0,8», «cetonas 3» llevan al tramo de la Figura 3. */
export function tramoDeConsulta(consulta: string): { clave: string; valor: number } | null {
  // La cifra va pegada a la palabra (como mucho «de», «en», «:» o «=» en medio) y no es una
  // hora, una glucemia ni un porcentaje: «cetonas y glucemia 250» o «cetonas 2 h» no cuentan.
  // También con la cifra delante: «0,3 de cetonas», «1,2 mmol/l de β-OHB».
  const q = normalizar(consulta);
  const m =
    q.match(
      /(?:b-?ohb|β-?ohb|beta-?hidroxibutirato|cetonemia|cetonas?)\s*(?:(?:de|en|a|:|=)\s*)?(\d+(?:[.,]\d+)?)(?!\s*(?:h\b|min|mg|g\b|%|\d|[.,]\d))/,
    ) ??
    q.match(
      /(?<![\d.,])(\d+(?:[.,]\d+)?)\s*(?:mmol(?:\/l)?\s*)?(?:de\s+)?(?:b-?ohb|β-?ohb|beta-?hidroxibutirato|cetonemia|cetonas?)\b/,
    );
  if (!m) return null;
  const valor = Number(m[1].replace(",", "."));
  if (!Number.isFinite(valor) || valor > 10) return null;
  const clave = valor < 0.6 ? "verde" : valor < 1 ? "amarillo" : valor < 3 ? "naranja" : "rojo";
  return { clave, valor };
}

/* Sinónimos de la consulta diaria: cada palabra buscada vale por cualquiera de sus variantes
   (en el texto del capítulo se busca la forma que usa el capítulo). */
const SINONIMOS: [RegExp, string[]][] = [
  [/^(beta|beta-?hidroxibutirato|b-?ohb|bohb)$/, ["β-ohb", "β-hidroxibutirato"]],
  [/^(cetonas?|cetonemia|cetosis)$/, ["ceton", "cetosis", "β-ohb"]],
  [/^(cetoacidosis|cad)$/, ["cetoacidosis"]],
  [/^(resonancia|rm|rmn)$/, ["resonancia", "rm"]],
  [/^(tc|tac|escaner|tomografia)$/, ["tomografia", "tc"]],
  [/^(quirofano|operacion|intervencion|cirugia)$/, ["cirugia", "quirurgic", "intervencion"]],
  [/^(embarazo|embarazada|gestante|gestacion)$/, ["gestacion", "gestante", "embaraz"]],
  [/^(deporte|ejercicio)$/, ["ejercicio", "actividad", "deport"]],
  [/^(hipo|hipoglucemias?)$/, ["hipoglucemi"]],
];

/* Palabras vacías: no se exigen al buscar ni se resaltan («resonancia con 780G»). «no» y «sin»
   sí cuentan («líquidos sin hidratos»). */
const VACIAS = new Set(
  "de del la las el los lo en con por para al un una unos unas que se le les su sus mi me te es son como cual cuando donde hay muy mas ya si y o u a".split(
    " ",
  ),
);

/* Palabras de la consulta, cada una con sus variantes (la propia palabra primero). */
export function terminosDe(consulta: string): string[][] {
  return normalizar(consulta)
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !VACIAS.has(t))
    .map((t) => {
      const sin = SINONIMOS.find(([re]) => re.test(t));
      return sin ? [t, ...sin[1].filter((v) => v !== t)] : [t];
    });
}

/* Posiciones de `v` en el texto normalizado `n`. Las variantes cortas (siglas de 2-3 letras,
   como «rm» o «tc») solo cuentan como palabra entera: «rm» no está en «forma». */
export function posiciones(n: string, v: string): number[] {
  const out: number[] = [];
  if (v.length <= 3 && /^[a-z0-9]+$/.test(v)) {
    const re = new RegExp(`(^|[^a-z0-9])${v}(?![a-z0-9])`, "g");
    for (let m = re.exec(n); m; m = re.exec(n)) out.push(m.index + m[1].length);
    return out;
  }
  for (let i = n.indexOf(v); i >= 0; i = n.indexOf(v, i + v.length)) out.push(i);
  return out;
}

/* Trozos del fragmento con los términos marcados (para <mark>). */
export function marcar(fragmento: string, consulta: string): { t: string; hit: boolean }[] {
  const variantes = terminosDe(consulta).flat();
  if (!variantes.length) return [{ t: fragmento, hit: false }];
  const n = normalizar(fragmento);
  // normalizar no cambia la longitud (NFD + quitar diacríticos deja un char por char base)
  const marcas = new Array<boolean>(fragmento.length).fill(false);
  for (const v of variantes)
    for (const i of posiciones(n, v))
      for (let k = i; k < i + v.length && k < marcas.length; k++) marcas[k] = true;
  // La palabra entera: se extiende la marca hasta sus bordes, y un guion o una barra entre
  // dos partes marcadas («Control-IQ», «set/pod») también se marca.
  const letra = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c);
  for (let k = 1; k < marcas.length; k++)
    if (marcas[k - 1] && !marcas[k] && letra(fragmento[k]) && letra(fragmento[k - 1]))
      marcas[k] = true;
  for (let k = marcas.length - 2; k >= 0; k--)
    if (marcas[k + 1] && !marcas[k] && letra(fragmento[k]) && letra(fragmento[k + 1]))
      marcas[k] = true;
  for (let k = 1; k + 1 < marcas.length; k++)
    if (!marcas[k] && /[-/]/.test(fragmento[k]) && marcas[k - 1] && marcas[k + 1]) marcas[k] = true;
  const out: { t: string; hit: boolean }[] = [];
  let actual = "";
  let estado = marcas[0] ?? false;
  for (let k = 0; k < fragmento.length; k++) {
    if (marcas[k] !== estado) {
      out.push({ t: actual, hit: estado });
      actual = "";
      estado = marcas[k];
    }
    actual += fragmento[k];
  }
  if (actual) out.push({ t: actual, hit: estado });
  return out;
}

/* Página de un resultado: «p. 11» o, si ocupa dos, «pp. 11–12». */
export const paginaDe = (e: Entrada) =>
  e.pagina2 && e.pagina2 !== e.pagina ? `pp. ${e.pagina}–${e.pagina2}` : `p. ${e.pagina}`;
