/* Páginas por apartado (14-10-2026): un diagrama que toma datos de varios apartados no los
   atribuye todos al suyo. «Apartado 7, p. 8 · Apartado 9, p. 15 · Apartado 10, p. 19»; si una
   página cae en el límite de dos apartados, cuenta para el propio. */
import { APARTADOS } from "./contenido";

/* Páginas seguidas, como intervalo: [3, 4] → «3-4»; [4, 5, 15, 17, 19, 20] → «4-5, 15, 17, 19-20». */
export const intervalos = (ps: number[]) => {
  const xs = [...new Set(ps)].sort((a, b) => a - b);
  const out: string[] = [];
  for (let k = 0; k < xs.length; k++) {
    let j = k;
    while (j + 1 < xs.length && xs[j + 1] === xs[j] + 1) j++;
    // 0.85.1 (novena ronda, R3): con raya corta, como en el resto de la app.
    out.push(j > k ? `${xs[k]}–${xs[j]}` : String(xs[k]));
    k = j;
  }
  return out.join(", ");
};

export function paginasPorApartado(ps: number[], propio?: number): string {
  const grupos = new Map<number, number[]>();
  for (const p of [...new Set(ps)].sort((a, b) => a - b)) {
    const cand = APARTADOS.filter((a) => p >= a.paginas[0] && p <= a.paginas[1]);
    const n = (cand.find((a) => a.n === propio) ?? cand[0])?.n ?? 0;
    grupos.set(n, [...(grupos.get(n) ?? []), p]);
  }
  return [...grupos]
    .map(
      ([n, xs]) =>
        `${n ? `Apartado ${n}, ` : ""}${xs.length === 1 ? "p." : "pp."} ${intervalos(xs)}`,
    )
    .join(" · ");
}
