/* Una sigla pulsable dentro del texto del capítulo: el botón es la propia sigla (subrayado de
   puntos, como las remisiones) y abre un panel breve con su desarrollo literal, la página y
   Teclado: Intro o espacio abre, Esc cierra y devuelve el foco a la sigla;
   un toque fuera cierra. En el móvil, el panel es una hoja al pie, sobre la barra inferior; en
   pantallas grandes, junto a la sigla. No apila historial (es una ayuda rápida, no un diálogo). */
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { desarrolloDe } from "../siglas";

const ANCHO_PANEL = 320;
/* Pantalla grande (desde 640 px): el panel va junto a la sigla. Sin matchMedia (jsdom), móvil. */
const pantallaGrande = () => window.matchMedia?.("(min-width: 640px)").matches ?? false;

export function SiglaPulsable({ sigla }: { sigla: string }) {
  const g = desarrolloDe(sigla);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; arriba: boolean } | null>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const cerrar = useCallback((devolverFoco = true) => {
    setOpen(false);
    if (devolverFoco) boton.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrar();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !boton.current?.contains(t)) cerrar(false);
    };
    const onHash = () => cerrar(false);
    // En pantallas grandes el panel está junto a la sigla: si la página se desplaza de verdad
    // (no el resto de un desplazamiento suave), se cierra; en el móvil es una hoja al pie.
    const inicial = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - inicial) > 60) cerrar(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("hashchange", onHash);
    if (pantallaGrande()) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, cerrar]);

  useLayoutEffect(() => {
    if (!open) return;
    const r = boton.current?.getBoundingClientRect();
    if (r && pantallaGrande()) {
      const arriba = r.bottom + 170 > window.innerHeight;
      setPos({
        top: arriba ? r.top - 6 : r.bottom + 6,
        left: Math.max(8, Math.min(r.left, window.innerWidth - ANCHO_PANEL - 8)),
        arriba,
      });
    } else setPos(null);
    panel.current?.focus({ preventScroll: true });
  }, [open]);

  if (!g) return <>{sigla}</>;
  return (
    <>
      <button
        type="button"
        ref={boton}
        className="sigla"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        title={open ? undefined : `${g.desarrollo} (p. ${g.pagina})`}
        onClick={() => setOpen((o) => !o)}
      >
        {sigla}
      </button>
      {open &&
        createPortal(
          <div
            ref={panel}
            id={id}
            role="dialog"
            aria-label={`Sigla ${sigla}`}
            tabIndex={-1}
            className="sigla-panel no-imprimir fixed z-40 rounded-t-2xl border bg-white p-4 text-slate-800 shadow-xl focus:outline-none sm:rounded-xl sm:p-3"
            style={
              pos
                ? {
                    top: pos.top,
                    left: pos.left,
                    width: ANCHO_PANEL,
                    transform: pos.arriba ? "translateY(-100%)" : undefined,
                    borderColor: "#d4d4d4",
                  }
                : { borderColor: "#d4d4d4" }
            }
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-extrabold text-slate-900">
                {sigla}
              </span>
              <button
                type="button"
                onClick={() => cerrar()}
                aria-label="Cerrar"
                className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:h-8 sm:w-8"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1.5 text-[15px] leading-snug sm:text-sm">
              {g.desarrollo} <span className="pagina-badge ml-1">p. {g.pagina}</span>
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
