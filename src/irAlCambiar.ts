import { useEffect, useRef } from "react";

/* Recorridos paso a paso: tras «Siguiente» (al pie de la página) se sube al principio del paso
   nuevo y el foco va a él; tras elegir sistema, su casilla se trae a la vista (sin mover el
   foco). Se llama a la función devuelta justo antes de cambiar de ruta. */
export function useIrAlCambiar(
  clave: string,
  id: string,
  { bloque = "start", enfocar = true }: { bloque?: ScrollLogicalPosition; enfocar?: boolean } = {},
) {
  const pendiente = useRef(false);
  useEffect(() => {
    if (!pendiente.current) return;
    pendiente.current = false;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: bloque });
    if (enfocar) el.focus({ preventScroll: true });
  }, [clave, id, bloque, enfocar]);
  return () => {
    pendiente.current = true;
  };
}

/* Enlace profundo a un bloque: lo mantiene arriba mientras termina de cargar lo que hay antes
   (figuras y diagramas perezosos hacen crecer la página y lo empujarían fuera de la vista).
   Se suelta en cuanto el lector toca la pantalla, la rueda o el teclado, o a los `ms`. */
export function mantenerEnVista(el: HTMLElement, ms = 2500): () => void {
  if (typeof ResizeObserver === "undefined") return () => {};
  let activo = true;
  const parar = () => {
    if (!activo) return;
    activo = false;
    obs.disconnect();
    clearTimeout(t);
    for (const e of ["wheel", "touchstart", "keydown", "pointerdown"] as const)
      window.removeEventListener(e, parar);
  };
  // Donde quedó tras el primer desplazamiento (con su margen bajo la cabecera pegada).
  const arriba = el.getBoundingClientRect().top;
  const obs = new ResizeObserver(() => {
    if (activo && Math.abs(el.getBoundingClientRect().top - arriba) > 2)
      el.scrollIntoView({ block: "start" });
  });
  obs.observe(document.body);
  for (const e of ["wheel", "touchstart", "keydown", "pointerdown"] as const)
    window.addEventListener(e, parar, { passive: true });
  const t = setTimeout(parar, ms);
  return parar;
}

/* Al elegir una opción dentro de una pantalla (una situación de la lista, un tramo, un paso…),
   el texto nuevo puede quedar fuera de la vista: en escritorio, si se elige una de las últimas de
   la lista, el texto empieza arriba y la pantalla parece vacía. Tras el cambio (no en la primera
   carga), si el principio del bloque no está a la vista, se sube a él (14-10-2026). */
export function useSubirAlElegir(clave: string, id: string) {
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const arriba = el.getBoundingClientRect().top;
    // Arriba de la vista, o tan abajo que apenas se ve el principio: se sube a él.
    if (arriba < 56 || arriba > window.innerHeight * 0.7) el.scrollIntoView({ block: "start" });
  }, [clave, id]);
}
