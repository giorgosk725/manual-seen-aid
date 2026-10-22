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
  // Los de una zona que no se imprime (.no-imprimir) se quedan como están.
  const cerrados = [...region.querySelectorAll("details")].filter(
    (d) => !d.open && !d.closest(".no-imprimir"),
  );
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
/* Imprime cuando la región ya no tiene nada cargándose (figuras y diagramas perezosos, que
   enseñan un hueco con aria-busy mientras llegan; V50-03). Si a los 4 s sigue cargando, NO
   imprime una versión incompleta: lo dice y deja reintentar o cancelar (V54-09). */
export function imprimirRegion(getRegion, win = typeof window !== "undefined" ? window : null) {
  if (!win || typeof win.print !== "function") return () => {};
  const region = typeof getRegion === "function" ? getRegion() : getRegion;
  // 0.96.1 (revisión de Codex, N96-01): también mientras se carga la letra. Con la de reserva
  // (más ancha), la hoja de comprobación de Omnipod 5 salía a veces en dos caras.
  const ocupada = () =>
    !!region?.querySelector?.('[aria-busy="true"]') || win.document?.fonts?.status === "loading";
  if (!ocupada()) return imprimirYa(region, win);
  let cancelado = false;
  let aviso = null;
  const quitarAviso = () => {
    aviso?.remove();
    aviso = null;
  };
  const esperar = (inicio) => {
    if (cancelado) return;
    if (!ocupada()) {
      quitarAviso();
      imprimirYa(region, win);
    } else if (Date.now() - inicio < 4000) win.setTimeout(() => esperar(inicio), 100);
    else avisar();
  };
  const avisar = () => {
    const doc = win.document;
    quitarAviso();
    aviso = doc.createElement("div");
    aviso.setAttribute("role", "alertdialog");
    aviso.setAttribute("aria-label", "Impresión pendiente");
    aviso.className =
      "aviso-impresion no-imprimir fixed inset-x-3 bottom-32 z-50 mx-auto max-w-md rounded-xl border border-amber-400 bg-white p-3 text-sm text-slate-800 shadow-xl md:bottom-4";
    const p = doc.createElement("p");
    p.textContent =
      "Todavía se está cargando parte del contenido (letra, figuras o diagramas). Si se imprime ahora, saldría incompleto.";
    const fila = doc.createElement("div");
    fila.className = "mt-2 flex gap-2";
    const boton = (texto, accion, clase) => {
      const b = doc.createElement("button");
      b.type = "button";
      b.textContent = texto;
      b.className = clase;
      b.addEventListener("click", accion);
      return b;
    };
    const reintentar = boton(
      "Reintentar",
      () => {
        quitarAviso();
        esperar(Date.now());
      },
      "min-h-11 rounded-lg bg-slate-800 px-3 text-sm font-semibold text-white",
    );
    fila.append(
      reintentar,
      boton(
        "Cancelar",
        () => {
          cancelado = true;
          quitarAviso();
        },
        "min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700",
      ),
    );
    aviso.append(p, fila);
    doc.body.append(aviso);
    reintentar.focus();
  };
  win.setTimeout(() => esperar(Date.now()), 100);
  return () => {
    cancelado = true;
    quitarAviso();
  };
}

function imprimirYa(getRegion, win) {
  if (!win || typeof win.print !== "function") return () => {};
  const doc = win.document;
  const region = typeof getRegion === "function" ? getRegion() : getRegion;
  const restaurarPlegables = abrirPlegables(region);
  doc.documentElement.classList.add("imprimiendo");
  // 0.90.1 (14.ª ronda, R5): en papel, sin el modo nocturno (se devuelve al limpiar).
  const noche = doc.documentElement.classList.contains("night");
  doc.documentElement.classList.remove("night");
  let limpio = false;
  let quitarOyente = () => {};
  const limpiar = () => {
    if (limpio) return;
    limpio = true;
    doc.documentElement.classList.remove("imprimiendo");
    if (noche) doc.documentElement.classList.add("night");
    restaurarPlegables();
    quitarOyente();
    win.removeEventListener("pointerdown", limpiar);
    win.removeEventListener("focus", limpiar);
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
