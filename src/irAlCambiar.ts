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
