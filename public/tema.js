/* Pone el modo nocturno antes del primer pintado (sin destello claro). Misma regla que
   src/prefs.ts: lo elegido por el lector o, si no eligió, lo del sistema. */
(function () {
  try {
    var g = localStorage.getItem("mseen:night");
    var noche = g !== null ? g === "1" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (noche) document.documentElement.classList.add("night");
  } catch {
    /* sin almacenamiento: modo claro */
  }
})();
