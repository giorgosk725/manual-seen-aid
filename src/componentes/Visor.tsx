/* Visor de imágenes a pantalla completa: zoom con botones, rueda y pellizco; arrastre para
   moverse; teclado (+, −, 0, Esc). Pensado para leer la infografía y la Figura 3 en un móvil. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDialogo } from "../dialogo";
import { Download, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN = 1;
const MAX = 6;

export interface ImagenVisor {
  src: string;
  alt: string;
  titulo: string;
  nota?: string;
}

export function Visor({ imagen, onClose }: { imagen: ImagenVisor | null; onClose: () => void }) {
  const [escala, setEscala] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const punteros = useRef(new Map<number, { x: number; y: number }>());
  const pellizco = useRef<{ d: number; escala: number } | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const limitar = (e: number) => Math.min(MAX, Math.max(MIN, e));
  const zoom = useCallback((f: number) => {
    setEscala((e) => {
      const n = limitar(e * f);
      if (n === 1) setPos({ x: 0, y: 0 });
      return n;
    });
  }, []);
  const reset = useCallback(() => {
    setEscala(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const src = imagen?.src;
  // Historial, foco atrapado, Esc y vuelta al abridor: el mismo contrato que Modal (dialogo.ts;
  // auditoría de la 1.0.28, V01: Mayús+Tab salía a la página cubierta y Atrás la abandonaba).
  useDialogo(!!src, onClose, panelRef, cerrarRef);
  useEffect(() => {
    if (!src) return undefined;
    reset();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+" || e.key === "=") zoom(1.4);
      else if (e.key === "-") zoom(1 / 1.4);
      else if (e.key === "0") reset();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [src, zoom, reset]);

  if (!imagen) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.current.size === 2) {
      const [a, b] = [...punteros.current.values()];
      pellizco.current = { d: Math.hypot(a.x - b.x, a.y - b.y), escala };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const antes = punteros.current.get(e.pointerId);
    if (!antes) return;
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.current.size === 2 && pellizco.current) {
      const [a, b] = [...punteros.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      setEscala(limitar((pellizco.current.escala * d) / pellizco.current.d));
    } else if (punteros.current.size === 1 && escala > 1) {
      setPos((p) => ({ x: p.x + e.clientX - antes.x, y: p.y + e.clientY - antes.y }));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    punteros.current.delete(e.pointerId);
    if (punteros.current.size < 2) pellizco.current = null;
  };

  const boton =
    "tap-44 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={imagen.titulo}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col focus:outline-none"
      // 1.0.31 (revisión de la 1.0.30): fondo opaco (al 94 % la página se traslucía tras los
      // controles) y, en el móvil, el título entero en su propia fila bajo los botones.
      style={{ background: "rgb(2, 6, 23)" }}
    >
      {/* 1.0.37: botones de 44 px; a menos de 360 px, con menos hueco para que sigan en una fila. */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-white max-[22.4375em]:gap-1">
        <p className="order-last min-w-0 basis-full text-sm font-semibold leading-snug sm:order-none sm:flex-1 sm:basis-0">
          {imagen.titulo}
        </p>
        <span className="flex-1 sm:hidden" aria-hidden="true" />
        <button type="button" className={boton} onClick={() => zoom(1 / 1.4)} aria-label="Alejar">
          <Minus size={18} />
        </button>
        <span className="w-12 text-center text-xs tabular-nums text-white/80" aria-live="polite">
          {Math.round(escala * 100)} %
        </span>
        <button type="button" className={boton} onClick={() => zoom(1.4)} aria-label="Acercar">
          <Plus size={18} />
        </button>
        <button type="button" className={boton} onClick={reset} aria-label="Tamaño original">
          <RotateCcw size={17} />
        </button>
        <a
          className={boton}
          href={imagen.src}
          download
          aria-label="Descargar la imagen"
          title="Descargar la imagen"
        >
          <Download size={17} />
        </a>
        <button
          ref={cerrarRef}
          type="button"
          className={boton}
          onClick={onClose}
          aria-label="Cerrar el visor"
        >
          <X size={18} />
        </button>
      </div>
      <div
        className="relative flex-1 overflow-hidden"
        style={{ touchAction: "none", cursor: escala > 1 ? "grab" : "zoom-in" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={(e) => zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15)}
        onDoubleClick={() => (escala > 1 ? reset() : zoom(2.5))}
      >
        <img
          src={imagen.src}
          alt={imagen.alt}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-h-full max-w-full select-none"
          style={{
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${escala})`,
            transformOrigin: "center",
          }}
        />
      </div>
      {/* 1.0.30: fondo opaco (sobre el translúcido se leía mal en el móvil) y trato de usted. */}
      <p className="bg-slate-950 px-3 py-2 text-center text-xs text-white/80">
        {imagen.nota ? `${imagen.nota} · ` : ""}Pellizque o use + y − para ampliar; arrastre para
        moverse; doble toque para alternar.
      </p>
    </div>,
    document.body,
  );
}

/* Miniatura o botón que abre una imagen en el visor. */
export function AbrirEnVisor({
  imagen,
  children,
  className = "",
  etiqueta,
}: {
  imagen: ImagenVisor;
  children?: ReactNode;
  className?: string;
  etiqueta?: string;
}) {
  const [abierta, setAbierta] = useState(false);
  const cerrar = useCallback(() => setAbierta(false), []);
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierta(true)}
        className={className}
        aria-label={etiqueta || `Ampliar: ${imagen.titulo}`}
      >
        {children ?? (
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 size={14} aria-hidden="true" /> Ampliar
          </span>
        )}
      </button>
      <Visor imagen={abierta ? imagen : null} onClose={cerrar} />
    </>
  );
}
