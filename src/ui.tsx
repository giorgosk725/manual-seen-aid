/* Primitivas de interfaz, heredadas del sistema de diseño de asistente-aid (Modal, Badge,
   ToneCard, Segmented, Foldable, ErrorBoundary, BotonImprimir) y ampliadas con lo que
   pide un manual de lectura (Revelar, PaginaBadge, CabeceraEditorial, Enlace). */
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { restablecerPreferencias } from "./prefs";
import { esFalloDeTrozo, recargarUnaVez } from "./recarga";
import { createPortal } from "react-dom";
import { AlertTriangle, ChevronDown, Printer, RotateCcw, X, type LucideIcon } from "lucide-react";
import { imprimirRegion } from "./imprimir";

/* Enlace de ruta hash: un <a> normal (accesible, abre en pestaña nueva con Ctrl). */
export function Enlace({
  href,
  className = "",
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

/* Modal accesible: portal, foco atrapado, Escape y clic fuera cierran, devuelve el foco. */
export function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  icon: Icon,
  children,
  maxW = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  icon?: LucideIcon;
  children: ReactNode;
  maxW?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<Element | null>(null);
  // Atrás (gesto de Android, botón del navegador) cierra el diálogo en vez de cambiar la
  // página de debajo: al abrir se añade una entrada al historial con la misma dirección.
  const cerrar = useRef(onClose);
  cerrar.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
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
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    prevFocus.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) || [],
      );
    const t = setTimeout(() => {
      const f = focusables();
      (f[0] || panel)?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) {
          e.preventDefault();
          panel?.focus();
          return;
        }
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      (prevFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
    >
      <button
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 -z-10 cursor-default"
        style={{ backgroundColor: "rgba(15,23,42,0.45)" }}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`w-full ${maxW} rounded-2xl border border-slate-200 bg-white shadow-xl focus:outline-none`}
      >
        {title && (
          <div className="flex items-center gap-2 rounded-t-2xl bg-slate-100 px-4 py-3 text-slate-800">
            {Icon && <Icon size={18} className="shrink-0" />}
            <h2 className="flex-1 text-sm font-bold">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="shrink-0 rounded p-1 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function Badge({
  tone = "slate",
  children,
}: {
  tone?: "slate" | "emerald" | "amber" | "red" | "sky" | "violet";
  children: ReactNode;
}) {
  const m = {
    slate: "bg-slate-100 text-slate-800",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    sky: "bg-sky-100 text-sky-800",
    violet: "bg-violet-50 text-violet-900",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${m[tone]}`}>
      {children}
    </span>
  );
}

/* Aviso semántico (receta 9): squircle degradado + lavado tinte→blanco. El tono es
   señalización, no decoración. */
export function ToneCard({
  tone = "slate",
  icon: Icon,
  title,
  children,
  className = "",
}: {
  tone?: "emerald" | "amber" | "red" | "sky" | "slate";
  icon?: LucideIcon;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const T = {
    emerald: {
      border: "#a7f3d0",
      wash: "linear-gradient(160deg, #ecfdf5, #ffffff 65%)",
      from: "#059669",
      to: "#047857",
      ink: "#065f46",
    },
    amber: {
      border: "#fde68a",
      wash: "linear-gradient(160deg, #fffbeb, #ffffff 65%)",
      from: "#d97706",
      to: "#b45309",
      ink: "#92400e",
    },
    red: {
      border: "#fecaca",
      wash: "linear-gradient(160deg, #fef2f2, #ffffff 65%)",
      from: "#dc2626",
      to: "#b91c1c",
      ink: "#991b1b",
    },
    sky: {
      border: "#bae6fd",
      wash: "linear-gradient(160deg, #f0f9ff, #ffffff 65%)",
      from: "#0284c7",
      to: "#0369a1",
      ink: "#075985",
    },
    slate: {
      border: "#e2e8f0",
      wash: "linear-gradient(160deg, #f8fafc, #ffffff 65%)",
      from: "#475569",
      to: "#334155",
      ink: "#334155",
    },
  }[tone];
  return (
    <div
      className={`rounded-2xl border p-4 shadow-soft ${className}`}
      style={{ background: T.wash, borderColor: T.border }}
    >
      {title && (
        <div className="mb-2 flex items-center gap-2 text-sm font-bold" style={{ color: T.ink }}>
          {Icon && (
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${T.from}, ${T.to})` }}
            >
              <Icon size={15} />
            </span>
          )}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/* Selector segmentado en píldora: activo en degradado, inactivos en gris. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  wrap = false,
  label,
}: {
  options: { id: T; label: string; shortLabel?: string; gradient?: string; icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
  wrap?: boolean;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`${wrap ? "flex flex-wrap" : "flex overflow-x-auto"} gap-1 rounded-xl border p-1 shadow-soft`}
      style={{ borderColor: "#e6e6e6", background: "#ffffff" }}
    >
      {options.map((o) => {
        const on = value === o.id;
        const I = o.icon;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            className={`flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition sm:min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${wrap ? "" : "flex-1"} ${on ? "text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            style={
              on
                ? { background: o.gradient || "linear-gradient(135deg, #3f6e9f, #2f5680)" }
                : undefined
            }
          >
            {I && <I size={15} aria-hidden="true" />}
            {o.shortLabel ? (
              <>
                <span className="lg:hidden">{o.shortLabel}</span>
                <span className="hidden lg:inline">{o.label}</span>
              </>
            ) : (
              o.label
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Plegable <details> (convención de inventarios plegados). */
export function Foldable({
  id,
  title,
  subtitle,
  count,
  icon: Icon,
  open = false,
  children,
  className = "",
}: {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  count?: number;
  icon?: LucideIcon;
  open?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details
      id={id}
      open={open || undefined}
      className={`group scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-soft ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-xl px-4 py-3 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
        {Icon && (
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--cat-soft, #f1f5f9)", color: "var(--cat-ink, #334155)" }}
          >
            <Icon size={16} />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
            {title}
            {count != null && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">
                {count}
              </span>
            )}
          </span>
          {subtitle && <span className="block text-xs text-slate-500">{subtitle}</span>}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="shrink-0 text-slate-500 transition group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-slate-100 px-4 pb-4 pt-3">{children}</div>
    </details>
  );
}

/* Red de seguridad: un fallo en una pantalla no deja la app en blanco. */
export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Fallo en una pantalla:", error);
    // Un trozo de código que no llegó: recargar una vez lo arregla (Reintentar no basta).
    if (esFalloDeTrozo(error)) recargarUnaVez();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-8 text-center"
        >
          <AlertTriangle size={24} className="mb-2 text-amber-600" />
          <p className="text-sm font-semibold text-slate-800">Algo ha fallado en esta pantalla.</p>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Puedes reintentar o recargar la página. La app no guarda nada en ningún servidor; si el
            fallo se repite, restablece las preferencias de lectura de este navegador (modo
            nocturno, letra, favoritos y apartados leídos).
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <RotateCcw size={14} /> Reintentar
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Recargar la página
            </button>
            <button
              type="button"
              onClick={() => {
                restablecerPreferencias();
                window.location.reload();
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Restablecer preferencias
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function BotonImprimir({
  objetivo,
  children = "Imprimir",
  titulo,
  compacto,
}: {
  objetivo: React.RefObject<HTMLElement | null>;
  children?: ReactNode;
  titulo?: string;
  compacto?: boolean;
}) {
  return (
    <button
      type="button"
      title={titulo}
      onClick={() => imprimirRegion(() => objetivo.current || null)}
      className={
        compacto
          ? "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
          : "flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      }
    >
      <Printer size={compacto ? 14 : 15} aria-hidden="true" />
      {children}
    </button>
  );
}

/* Aparece al entrar en pantalla (IntersectionObserver); sin movimiento, se ve siempre. */
export function Revelar({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visto) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisto(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisto(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    // Red de seguridad: si el observador no dispara (captura de página completa, contenedor
    // con scroll propio, impresión), el contenido aparece igualmente al poco de montarse.
    const t = setTimeout(() => setVisto(true), 900);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [visto]);
  const T = Tag as React.ElementType;
  return (
    <T ref={ref} id={id} className={`revelar ${visto ? "visto" : ""} ${className}`}>
      {children}
    </T>
  );
}

/* Insignia de página de origen del capítulo. */
export function PaginaBadge({ p, p2 }: { p: number; p2?: number }) {
  const txt = p2 && p2 !== p ? `pp. ${p}–${p2}` : `p. ${p}`;
  return (
    <span
      className="pagina-badge"
      title={`Página ${p2 && p2 !== p ? `${p} a ${p2}` : p} del capítulo`}
    >
      {txt}
    </span>
  );
}

/* Cabecera de sección al modo del Manual SEEN: cuadro de color con el número, título en
   mayúsculas condensadas y una regla fina con un tramo del color de la sección. */
export function CabeceraEditorial({
  numero,
  titulo,
  hex,
  level = 2,
  children,
}: {
  numero?: string | number;
  titulo: ReactNode;
  hex: { strong: string; ink: string };
  level?: 1 | 2 | 3;
  children?: ReactNode;
}) {
  const H = `h${level}` as "h1" | "h2" | "h3";
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-7 min-w-[1.75rem] shrink-0 items-center justify-center rounded-[3px] px-1 font-display text-sm font-medium tabular-nums text-white"
          style={{ background: hex.strong }}
        >
          {numero ?? ""}
        </span>
        <H
          className="font-display text-lg font-medium uppercase leading-tight tracking-[0.04em]"
          style={{ color: hex.ink }}
        >
          {titulo}
        </H>
      </div>
      {children && <div className="mt-1">{children}</div>}
      <div aria-hidden="true" className="regla-seccion mt-2 flex h-px w-full">
        <span className="w-12" style={{ background: hex.strong }} />
        <span className="flex-1" />
      </div>
    </div>
  );
}
