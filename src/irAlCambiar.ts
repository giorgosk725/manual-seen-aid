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
