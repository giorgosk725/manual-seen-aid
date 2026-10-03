/* imprimir.js — Imprimir UNA región de la pantalla (la hoja de una página, la tabla
   comparativa, el inventario de alarmas, la ficha de un sistema).

   Cómo funciona: se marca la región con la clase `imprimible`, se pone `imprimiendo` en
   <html> y el @media print de index.css oculta todo lo demás. Al terminar se quita, así que
   imprimir cualquier otra pantalla sigue saliendo como siempre (Ctrl+P normal).

   Los plegables (`<details>`) que estén cerrados dentro de la región se ABREN antes de
   imprimir y se devuelven a su estado después: en pantalla interesa el índice plegado, pero
   en papel se quiere el contenido. No se puede hacer con CSS —`details` cerrado no pinta su
   contenido— así que se toca el atributo `open` y se restaura.

   Sin React a propósito: es lógica de navegador y así se puede probar sola. */

/** Abre los `<details>` cerrados de la región y devuelve cómo dejarlos como estaban. */
export function abrirPlegables(region) {
  if (!region || typeof region.querySelectorAll !== "function") return () => {};
  const cerrados = [...region.querySelectorAll("details")].filter((d) => !d.open);
  cerrados.forEach((d) => {
    d.open = true;
  });
  return () => cerrados.forEach((d) => (d.open = false));
}

/**
 * Imprime la región que devuelva `getRegion()` (o `document` entero si no hay).
 * Devuelve una función de limpieza por si hace falta cancelar a mano.
 *
 * @param {() => Element | null} getRegion  la región marcada con `.imprimible`
 * @param {Window} win  ventana (inyectable en las pruebas)
 */
export function imprimirRegion(getRegion, win = typeof window !== "undefined" ? window : null) {
  if (!win || typeof win.print !== "function") return () => {};
  const doc = win.document;
  const region = typeof getRegion === "function" ? getRegion() : getRegion;
  const restaurarPlegables = abrirPlegables(region);
  doc.documentElement.classList.add("imprimiendo");
  let limpio = false;
  let quitarOyente = () => {};
  const limpiar = () => {
    if (limpio) return;
    limpio = true;
    doc.documentElement.classList.remove("imprimiendo");
    restaurarPlegables();
    quitarOyente();
  };
  // `afterprint` es lo correcto, pero no todos los navegadores lo lanzan al cancelar: el
  // temporizador es la red de seguridad para no dejar la pantalla en modo impresión.
  win.addEventListener("afterprint", limpiar, { once: true });
  try {
    win.print();
  } catch {
    /* el navegador puede bloquearlo (iframe, permisos): se limpia igual */
  }
  // Algunos navegadores (móviles) no bloquean en print() ni lanzan afterprint: se limpia al
  // salir del modo impresión o, como red de seguridad, en la siguiente interacción. Un
  // temporizador fijo cortaba la vista previa a la mitad.
  const mq = typeof win.matchMedia === "function" ? win.matchMedia("print") : null;
  const alCambiar = (e) => {
    if (!e.matches) limpiar();
  };
  mq?.addEventListener?.("change", alCambiar);
  quitarOyente = () => mq?.removeEventListener?.("change", alCambiar);
  win.setTimeout(() => {
    win.addEventListener("pointerdown", limpiar, { once: true });
    win.addEventListener("focus", limpiar, { once: true });
  }, 500);
  return limpiar;
}
