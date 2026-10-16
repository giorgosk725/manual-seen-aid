/* Ayudas de disposición del sistema visual (docs/DISENO_VISUAL.md §11): reparto en dos columnas
   equilibradas y pestañas a la vista. Sin componentes (así la recarga en caliente no se rompe). */

/* Dos columnas equilibradas (sistema visual, quinta vuelta): se parte la lista en dos tramos
   contiguos (el orden de lectura no cambia) por donde la altura estimada queda más igualada; en
   el móvil, un tramo tras otro. `peso` estima la altura de cada elemento (p. ej. líneas de texto). */
export function corteEquilibrado(pesos: number[]): number {
  if (pesos.length < 2) return pesos.length;
  const total = pesos.reduce((a, b) => a + b, 0);
  let mejor = 1;
  let dif = Infinity;
  let acumulado = 0;
  for (let i = 1; i < pesos.length; i++) {
    acumulado += pesos[i - 1];
    const d = Math.abs(acumulado - (total - acumulado));
    if (d < dif) {
      dif = d;
      mejor = i;
    }
  }
  return mejor;
}
export function dosColumnas<T>(items: T[], peso: (x: T) => number): [T[], T[]] {
  if (items.length < 2) return [items, []];
  const k = corteEquilibrado(items.map(peso));
  return [items.slice(0, k), items.slice(k)];
}

/* Reparto en dos columnas (0.76.0, tras la quinta auditoría): en dos tramos CONTIGUOS por donde
   las alturas quedan más igualadas, para que el orden sea siempre el de la tabla (izquierda y
   luego derecha) y cada parámetro esté en la misma secuencia en las cuatro fichas; el reparto no
   contiguo los colocaba distinto en cada sistema. Devuelve, por elemento, si va a la segunda. */
export function repartoEquilibrado(pesos: number[]): boolean[] {
  const k = corteEquilibrado(pesos);
  return pesos.map((_, i) => i >= k);
}

/* Líneas que ocupa un texto en una tarjeta de media anchura (unos 45 caracteres por línea). */
export const lineasDe = (texto: string, porLinea = 45) =>
  texto.split("\n").reduce((n, l) => n + Math.max(1, Math.ceil(l.length / porLinea)), 0);

/* Una pestaña que recibe el foco se trae a la vista dentro de su tira (en el móvil, la última
   quedaba bajo el desvanecido). */
export const pestanaALaVista = (e: { currentTarget: Element }) =>
  e.currentTarget.scrollIntoView?.({ inline: "nearest", block: "nearest" });
