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

/* Reparto en dos columnas que más iguala sus alturas: cada elemento va a una u otra conservando
   el orden dentro de cada columna (se lee la izquierda de arriba abajo y luego la derecha).
   Hasta 12 elementos se prueban todos los repartos; con más, el siguiente va a la más corta.
   Devuelve, por elemento, si va a la segunda columna. */
export function repartoEquilibrado(pesos: number[]): boolean[] {
  const n = pesos.length;
  if (n < 2) return pesos.map(() => false);
  if (n > 12) {
    let a = 0;
    let b = 0;
    return pesos.map((p) => {
      const segunda = b < a;
      if (segunda) b += p;
      else a += p;
      return segunda;
    });
  }
  const total = pesos.reduce((x, y) => x + y, 0);
  let mejor = 0;
  let dif = Infinity;
  // El primero siempre en la primera columna (bit 0 a cero): la mitad de las combinaciones.
  for (let m = 0; m < 1 << n; m += 2) {
    let s = 0;
    for (let i = 0; i < n; i++) if (m & (1 << i)) s += pesos[i];
    const d = Math.abs(total - 2 * s);
    if (d < dif) {
      dif = d;
      mejor = m;
    }
  }
  return pesos.map((_, i) => !!(mejor & (1 << i)));
}

/* Líneas que ocupa un texto en una tarjeta de media anchura (unos 45 caracteres por línea). */
export const lineasDe = (texto: string, porLinea = 45) =>
  texto.split("\n").reduce((n, l) => n + Math.max(1, Math.ceil(l.length / porLinea)), 0);

/* Una pestaña que recibe el foco se trae a la vista dentro de su tira (en el móvil, la última
   quedaba bajo el desvanecido). */
export const pestanaALaVista = (e: { currentTarget: Element }) =>
  e.currentTarget.scrollIntoView?.({ inline: "nearest", block: "nearest" });
