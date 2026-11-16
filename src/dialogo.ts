/* Contrato común de los diálogos (Modal y Visor de figuras). Auditoría de la 1.0.28, V01: el visor
   declaraba aria-modal pero dejaba que Mayús+Tab saliera a la página cubierta y Atrás abandonaba la
   pantalla. Un solo comportamiento para los dos:
   - Historial: al abrir se añade una entrada con la misma dirección; Atrás cierra solo el diálogo y
     el siguiente Atrás navega como siempre. Cerrado de otro modo (Esc, X, clic fuera), se retira esa
     entrada, salvo que ya se haya navegado desde dentro (entonces no se toca: sin doble Atrás).
   - Foco: al abrir, al control inicial (o al primero); Tab y Mayús+Tab no salen del panel; Esc
     cierra; al cerrar vuelve al control que lo abrió.
   `onClose` se lee por referencia: los efectos corren solo al abrir y cerrar (si se repitieran en
   cada render con el diálogo abierto, «dónde estaba el foco» pasaría a ser un control del propio
   diálogo y al cerrar el foco se perdería). */
import { useEffect, useRef, type RefObject } from "react";
import { registrarAbridor } from "./rutas";

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialogo(
  abierto: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
  focoInicial?: RefObject<HTMLElement | null>,
) {
  const cerrar = useRef(onClose);
  useEffect(() => {
    cerrar.current = onClose;
  });

  // Historial.
  useEffect(() => {
    if (!abierto) return undefined;
    const marca = Date.now();
    window.history.pushState({ mseenDialogo: marca }, "");
    const onPop = (e: PopStateEvent) => {
      // Solo si se ha vuelto por debajo de un diálogo (no a la entrada de otro).
      if (!(e.state && "mseenDialogo" in e.state)) cerrar.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Cerrado con Esc, el botón o un clic fuera: se retira la entrada añadida. Se mira un
      // instante después: si se cerró por pulsar un enlace del diálogo, para entonces ya se
      // ha navegado (la entrada de arriba es otra) y no se toca el historial.
      window.setTimeout(() => {
        if (window.history.state?.mseenDialogo === marca) window.history.back();
      }, 0);
    };
  }, [abierto]);

  // Foco.
  useEffect(() => {
    if (!abierto) return undefined;
    const previo = document.activeElement;
    registrarAbridor(previo instanceof HTMLElement && previo !== document.body ? previo : null);
    const enfocables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(ENFOCABLES) || []).filter(
        (el) => el.getClientRects().length > 0,
      );
    const t = setTimeout(() => {
      const inicial = focoInicial?.current;
      if (inicial) inicial.focus();
      else (enfocables()[0] || panelRef.current)?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cerrar.current();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      const f = enfocables();
      if (!f.length) {
        e.preventDefault();
        panel?.focus();
        return;
      }
      const primero = f[0];
      const ultimo = f[f.length - 1];
      const dentro = !!panel && panel.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === primero || !dentro)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (document.activeElement === ultimo || !dentro)) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      (previo as HTMLElement | null)?.focus?.();
    };
    // panelRef y focoInicial son referencias estables.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);
}
