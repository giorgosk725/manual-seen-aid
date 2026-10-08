/* «Ver en el apartado» desde un pasaje del capítulo: la ruta lleva el bloque y la frase
   («#/capitulo/07-educacion/b11~3»). Al llegar, la frase 3 del párrafo b11 (o el punto 3 de la
   lista) se trae a la vista y se resalta un rato con la API de resaltados de CSS; sin ella, solo
   se trae a la vista. Un párrafo largo ya no obliga a buscar la frase a ojo. */
import { idDeBloque, type Apartado } from "./contenido";
import { frases } from "./frases";
import { plano } from "./marcado";

/* «b11~3» → bloque «b11», frase 3. */
export function partirDestacado(destacado: string): { bloque: string; frase?: number } {
  const [bloque, n] = destacado.split("~");
  const frase = n !== undefined && /^\d+$/.test(n) ? Number(n) : undefined;
  return { bloque, frase };
}

/* El texto de la frase `k` del párrafo, o del punto `k` de la lista. */
export function textoCitado(apartado: Apartado, bloque: string, k: number): string | null {
  const i = apartado.bloques.findIndex((b, j) => idDeBloque(b, j) === bloque);
  const b = apartado.bloques[i];
  if (b?.t === "p") return frases(plano(b.texto))[k] ?? null;
  if (b?.t === "lista") return b.items[k] !== undefined ? plano(b.items[k]) : null;
  return null;
}

/* El rango del DOM que ocupa `texto` dentro de `el` (espacios aparte). */
export function rangoDe(el: HTMLElement, texto: string): Range | null {
  const nodos: { n: Text; ini: number }[] = [];
  let todo = "";
  const recorrido = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) {
    nodos.push({ n: n as Text, ini: todo.length });
    todo += n.nodeValue ?? "";
  }
  // Texto con los espacios juntos y, para cada letra, su posición en el original.
  let plano = "";
  const pos: number[] = [];
  for (let i = 0; i < todo.length; i++) {
    const esp = /\s/.test(todo[i]);
    if (esp && (plano.endsWith(" ") || !plano)) continue;
    plano += esp ? " " : todo[i];
    pos.push(i);
  }
  const buscado = texto.replace(/\s+/g, " ").trim();
  let ini = plano.indexOf(buscado);
  let largo = buscado.length;
  // Si el texto pintado difiere en algo (un enlace, un signo), basta con el principio.
  if (ini < 0) {
    largo = Math.min(60, buscado.length);
    ini = plano.indexOf(buscado.slice(0, largo));
  }
  if (ini < 0) return null;
  const nodoEn = (off: number) => {
    let k = nodos.length - 1;
    while (k > 0 && nodos[k].ini > off) k--;
    return { nodo: nodos[k].n, off: off - nodos[k].ini };
  };
  const a = nodoEn(pos[ini]);
  const b = nodoEn(pos[ini + largo - 1] + 1);
  const r = document.createRange();
  r.setStart(a.nodo, a.off);
  r.setEnd(b.nodo, Math.min(b.off, b.nodo.length));
  return r;
}

type Registro = { set: (n: string, h: unknown) => void; delete: (n: string) => void };

/* Trae la frase a la vista y la resalta; devuelve cómo quitar el resaltado (o null si no
   se encontró la frase: entonces vale el destello del bloque). */
export function resaltarFrase(el: HTMLElement, texto: string): (() => void) | null {
  const rango = rangoDe(el, texto);
  if (!rango) return null;
  const caja = rango.getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + caja.top - 120 });
  const registro = (globalThis.CSS as unknown as { highlights?: Registro } | undefined)?.highlights;
  const Resaltado = (globalThis as unknown as { Highlight?: new (r: Range) => unknown }).Highlight;
  if (!registro || !Resaltado) return () => {};
  registro.set("frase-citada", new Resaltado(rango));
  return () => registro.delete("frase-citada");
}
