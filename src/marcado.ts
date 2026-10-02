/* Marcado en línea mínimo del contenido: *cursiva*, **negrita** y «\*» para un asterisco
   literal. Funciones puras, sin React (así texto.tsx solo exporta componentes). */
export type Trozo = { t: string; b?: boolean; i?: boolean };

export function trocear(texto: string): Trozo[] {
  const out: Trozo[] = [];
  // Una negrita o cursiva puede contener «\*» (las dosis con asterisco de la Figura 3).
  const re = /\*\*((?:\\\*|[^*])+)\*\*|\*((?:\\\*|[^*\n])+)\*|\\\*/g;
  const literal = (s: string) => s.replace(/\\\*/g, "*");
  let ultimo = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto))) {
    if (m.index > ultimo) out.push({ t: texto.slice(ultimo, m.index) });
    if (m[0] === "\\*") out.push({ t: "*" });
    else if (m[1] !== undefined) out.push({ t: literal(m[1]), b: true });
    else out.push({ t: literal(m[2]), i: true });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) out.push({ t: texto.slice(ultimo) });
  return out;
}

/* Texto plano (sin marcas), para atributos y para el índice de búsqueda. */
export const plano = (s: string) =>
  trocear(s)
    .map((t) => t.t)
    .join("");
