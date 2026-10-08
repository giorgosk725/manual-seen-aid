/* Los pasajes más parecidos por el sentido a un vector de búsqueda (similitud del coseno con los
   vectores cuantizados de _datos/vectores.ts). Lo usan la función /api/pasajes y los scripts de
   medida (scripts/semantica), para medir exactamente lo que se publica. */
import { DIM, ESCALAS, IDS, VECTORES } from "../_datos/vectores";

let MATRIZ: Int8Array | null = null;
function matriz(): Int8Array {
  if (MATRIZ) return MATRIZ;
  const bin = atob(VECTORES);
  const m = new Int8Array(bin.length);
  for (let i = 0; i < bin.length; i++) m[i] = (bin.charCodeAt(i) << 24) >> 24;
  return (MATRIZ = m);
}

export interface Parecido {
  id: string;
  s: number;
}

export function parecidos(v: number[], n = 10): Parecido[] {
  const m = matriz();
  const norma = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  const out: Parecido[] = [];
  for (let i = 0; i < IDS.length; i++) {
    let p = 0;
    const base = i * DIM;
    for (let k = 0; k < DIM; k++) p += v[k] * m[base + k];
    out.push({ id: IDS[i], s: (p * ESCALAS[i]) / norma });
  }
  return out
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => ({ id: x.id, s: Math.round(x.s * 1000) / 1000 }));
}
