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
    | "test";
  titulo: string;
  texto: string;
  /* Página del capítulo (0 = fuera del capítulo) y, si ocupa dos, la última. */
  pagina: number;
  pagina2?: number;
  ruta: string;
}

/* Lo que no es texto del capítulo se muestra en un grupo aparte y rotulado. */
export const fueraDelCapitulo = (e: Entrada) =>
  e.tipo === "extendida" || e.tipo === "ampliacion" || e.tipo === "pacientes" || e.tipo === "test";

export const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export interface Resultado {
  entrada: Entrada;
  fragmento: string;
  puntos: number;
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
  const m = normalizar(consulta).match(
    /(?:b-?ohb|β-?ohb|beta-?hidroxibutirato|cetonemia|cetonas?)\s*(?:(?:de|en|a|:|=)\s*)?(\d+(?:[.,]\d+)?)(?!\s*(?:h\b|min|mg|g\b|%|\d|[.,]\d))/,
  );
  if (!m) return null;
  const valor = Number(m[1].replace(",", "."));
  if (!Number.isFinite(valor) || valor > 10) return null;
  const clave = valor < 0.6 ? "verde" : valor < 1 ? "amarillo" : valor < 3 ? "naranja" : "rojo";
  return { clave, valor };
}

/* Trozos del fragmento con los términos marcados (para <mark>). */
export function marcar(fragmento: string, consulta: string): { t: string; hit: boolean }[] {
  const terminos = normalizar(consulta)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (!terminos.length) return [{ t: fragmento, hit: false }];
  const n = normalizar(fragmento);
  // normalizar no cambia la longitud (NFD + quitar diacríticos deja un char por char base)
  const marcas = new Array<boolean>(fragmento.length).fill(false);
  for (const t of terminos) {
    let i = n.indexOf(t);
    while (i >= 0) {
      for (let k = i; k < i + t.length && k < marcas.length; k++) marcas[k] = true;
      i = n.indexOf(t, i + t.length);
    }
  }
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
