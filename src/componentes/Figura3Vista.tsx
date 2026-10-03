/* Figura 3 (cetonemia). Modo «lectura»: las cuatro ramas completas, en el orden de la figura.
   Modo «recorrido»: sospechar → comprobar → confirmar y medir → elegir el tramo de β-OHB →
   solo esa rama, paso a paso, con los pies de la figura. El color de cada tramo es
   señalización clínica (la misma de la figura). */
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Ambulance,
  ArrowDown,
  Check,
  Clock3,
  Droplets,
  Eye,
  GlassWater,
  RefreshCw,
  Search,
  Siren,
  Star,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { FIGURA3, type PasoTramo, type Tramo, type TramoFigura3 } from "../contenido";
import { Texto } from "../texto";
import { PaginaBadge } from "../ui";
import { TRAMO_HEX } from "../tokens";
import { elegirRuta, href } from "../rutas";
import { ImagenFigura } from "./FiguraVista";
import { INFO_F3 } from "./figura3-imagen";
import { TituloBloque } from "../nivel";

const ICONOS: Record<PasoTramo["icono"], LucideIcon> = {
  pluma: Syringe,
  ojo: Eye,
  agua: GlassWater,
  reloj: Clock3,
  aviso: AlertTriangle,
  recambio: RefreshCw,
  ambulancia: Ambulance,
  urgente: Siren,
};

const TRAMOS: Tramo[] = ["verde", "amarillo", "naranja", "rojo"];

function Paso({ paso, hex, i }: { paso: PasoTramo; hex: (typeof TRAMO_HEX)[Tramo]; i: number }) {
  const I = ICONOS[paso.icono];
  return (
    <li className="paso-in flex gap-3" style={{ ["--i" as string]: i }}>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
        style={{ background: hex.strong }}
        aria-hidden="true"
      >
        <I size={17} />
      </span>
      <div className="min-w-0 flex-1 pt-1.5 text-sm text-slate-800">
        <p>
          <Texto>{paso.texto}</Texto>
        </p>
        {paso.detalle && (
          <ul
            className="mt-1 space-y-1 border-l-2 pl-3 text-slate-700"
            style={{ borderColor: hex.border }}
          >
            {paso.detalle.map((d, j) => (
              <li key={j}>
                <Texto>{d}</Texto>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

function Rama({ tramo, completa }: { tramo: TramoFigura3; completa?: boolean }) {
  const hex = TRAMO_HEX[tramo.clave];
  return (
    <section
      aria-label={`${tramo.rango}: ${tramo.titulo}`}
      className="rounded-2xl border p-4 shadow-soft"
      style={{
        borderColor: hex.border,
        background: `linear-gradient(160deg, ${hex.soft}, #ffffff 65%)`,
      }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: hex.strong }}
          aria-hidden="true"
        >
          <Droplets size={18} />
        </span>
        <div>
          <div className="text-base font-extrabold leading-tight" style={{ color: hex.ink }}>
            {tramo.rango}
          </div>
          <div className="text-sm font-semibold" style={{ color: hex.ink }}>
            {tramo.titulo}
          </div>
        </div>
      </div>
      <ol className={`space-y-3 ${completa ? "" : ""}`}>
        {tramo.pasos.map((p, i) => (
          <Paso key={i} paso={p} hex={hex} i={i} />
        ))}
      </ol>
    </section>
  );
}

function Pies() {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {FIGURA3.pie.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-3 text-sm text-slate-700"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span className="font-bold text-slate-900">{p.titulo}</span> <Texto>{p.texto}</Texto>
          </div>
        ))}
      </div>
      <div
        className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(130deg, #15324f, #1f4e79)" }}
      >
        <Star size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{FIGURA3.reglaDeOro}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-600">{FIGURA3.notaAsterisco}</p>
      <p className="text-xs text-slate-500">Abreviaturas: {FIGURA3.abreviaturas}</p>
      <p className="text-xs italic text-slate-500">{FIGURA3.titulo}</p>
    </div>
  );
}

function Cabecera() {
  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
      <div>
        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "#15324f" }}>
          Figura 3
        </div>
        <TituloBloque className="text-sm font-semibold text-slate-800">
          {FIGURA3.cabecera}
        </TituloBloque>
      </div>
      <PaginaBadge p={FIGURA3.pagina} />
    </div>
  );
}

function SospecharComprobar() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border bg-white p-3" style={{ borderColor: "#e6e6e6" }}>
        <div
          className="mb-1.5 flex items-center gap-2 text-sm font-bold"
          style={{ color: "#15324f" }}
        >
          <AlertTriangle size={16} aria-hidden="true" /> {FIGURA3.sospechar.titulo}
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {FIGURA3.sospechar.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border bg-white p-3" style={{ borderColor: "#e6e6e6" }}>
        <div
          className="mb-1.5 flex items-center gap-2 text-sm font-bold"
          style={{ color: "#15324f" }}
        >
          <Search size={16} aria-hidden="true" /> {FIGURA3.comprobar.titulo}
        </div>
        <ul className="space-y-1 text-sm text-slate-700">
          {FIGURA3.comprobar.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-700" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Figura3Lectura() {
  return (
    <section aria-label="Figura 3" className="bloque-papel">
      <Cabecera />
      <SospecharComprobar />
      <div
        className="my-3 rounded-xl px-4 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-white"
        style={{ background: "#4b73b0" }}
      >
        {FIGURA3.confirmar}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {FIGURA3.tramos.map((t) => (
          <Rama key={t.clave} tramo={t} completa />
        ))}
      </div>
      <Pies />
      <div className="no-imprimir mt-3">
        <a
          href={href("consultar", "figura-3")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          style={{ background: "linear-gradient(135deg, #3f6e9f, #2f5680)" }}
        >
          <Droplets size={15} aria-hidden="true" /> Recorrer paso a paso
        </a>
      </div>
      <ImagenFigura figura={INFO_F3} />
    </section>
  );
}

export function Figura3Recorrido({ tramoInicial }: { tramoInicial?: string }) {
  const valido = TRAMOS.includes(tramoInicial as Tramo) ? (tramoInicial as Tramo) : null;
  const [tramo, setTramo] = useState<Tramo | null>(valido);
  useEffect(() => setTramo(valido), [valido]);
  const elegir = (t: Tramo | null) => {
    setTramo(t);
    elegirRuta("consultar", "figura-3", t ?? undefined);
  };
  const actual = tramo ? FIGURA3.tramos.find((t) => t.clave === tramo)! : null;
  const actuar = useRef<HTMLLIElement>(null);
  // Entrar con un tramo ya elegido (enlace profundo, atajo de búsqueda): directo a su rama.
  useEffect(() => {
    if (valido) actuar.current?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Atajo: con la cetonemia ya medida, ir directo a su rama («Actuar»). */
  const irATramo = (t: Tramo) => {
    elegir(t);
    requestAnimationFrame(() => actuar.current?.scrollIntoView({ block: "start" }));
  };
  return (
    <section aria-label="Figura 3, recorrido paso a paso">
      <Cabecera />
      <nav
        aria-label="Ir directamente al tramo"
        className="no-imprimir mb-4 rounded-xl border bg-slate-50 p-2.5"
        style={{ borderColor: "#e6e6e6" }}
      >
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <ArrowDown size={13} aria-hidden="true" /> ¿Ya tienes el β-OHB? Ir a su rama:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FIGURA3.tramos.map((t) => {
            const hex = TRAMO_HEX[t.clave];
            return (
              <button
                key={t.clave}
                type="button"
                onClick={() => irATramo(t.clave)}
                aria-label={`Ir a la rama: ${t.rango}`}
                className="inline-flex min-h-9 items-center rounded-full border bg-white px-3 text-xs font-bold transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: hex.border, color: hex.ink }}
              >
                {t.rango}
              </button>
            );
          })}
        </div>
      </nav>
      <ol className="space-y-4">
        <li>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white">
              1
            </span>{" "}
            Sospechar y comprobar
          </div>
          <SospecharComprobar />
        </li>
        <li>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white">
              2
            </span>{" "}
            {FIGURA3.confirmar}
          </div>
          <div className="mb-2 text-sm text-slate-700">
            ¿Cuál es la cetonemia (β-OHB)? Elige el tramo y verás solo esa rama.
          </div>
          <div
            className="grid grid-cols-2 gap-2 lg:grid-cols-4"
            role="group"
            aria-label="Tramo de cetonemia"
          >
            {FIGURA3.tramos.map((t) => {
              const hex = TRAMO_HEX[t.clave];
              const on = tramo === t.clave;
              return (
                <button
                  key={t.clave}
                  type="button"
                  aria-pressed={on}
                  onClick={() => elegir(on ? null : t.clave)}
                  className={`hover-lift ease-brand rounded-2xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 ${on ? "text-white" : ""}`}
                  style={
                    on
                      ? {
                          background: hex.ink,
                          borderColor: hex.strong,
                        }
                      : {
                          background: `linear-gradient(160deg, ${hex.soft}, #ffffff 70%)`,
                          borderColor: hex.border,
                          color: hex.ink,
                        }
                  }
                >
                  <div className="flex items-center gap-1.5 text-sm font-extrabold leading-tight">
                    <Droplets size={15} aria-hidden="true" /> {t.rango}
                  </div>
                  <div className={`mt-1 text-xs font-semibold ${on ? "text-white/90" : ""}`}>
                    {t.titulo}
                  </div>
                </button>
              );
            })}
          </div>
        </li>
        <li ref={actuar} aria-live="polite" className="scroll-mt-20">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white">
              3
            </span>{" "}
            Actuar
          </div>
          {actual ? (
            <div key={actual.clave} className="pantalla-in">
              <Rama tramo={actual} />
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-slate-600"
              style={{ borderColor: "#d4d4d4", background: "#f8fafc" }}
            >
              Elige un tramo de β-OHB arriba para ver la rama correspondiente de la figura.
            </div>
          )}
        </li>
      </ol>
      <Pies />
      <ImagenFigura figura={INFO_F3} />
    </section>
  );
}
