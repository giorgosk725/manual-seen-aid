/* Figura 3 (cetonemia). Modo «lectura»: las cuatro ramas completas, en el orden de la figura.
   Modo «recorrido»: sospechar → comprobar → confirmar y medir → elegir el tramo de β-OHB →
   solo esa rama, paso a paso, con los pies de la figura. El color de cada tramo es
   señalización clínica (la misma de la figura). */
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Ambulance,
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
import { elegirRuta, href, fueNavegacionNueva } from "../rutas";
import { mantenerEnVista } from "../irAlCambiar";
import { ImagenFigura } from "./FiguraVista";
import { INFO_F3 } from "./figura3-imagen";
import { TituloBloque } from "../nivel";
import { FuentePie } from "./FuentePie";
import { UrgenciaF3 } from "./UrgenciaF3";

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

function Rama({
  tramo,
  completa,
  aviso,
  nota = true,
}: {
  tramo: TramoFigura3;
  completa?: boolean;
  aviso?: boolean;
  /* La nota de las dosis con asterisco en la rama (en la lectura, una sola vez al pie). */
  nota?: boolean;
}) {
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
      {/* Junto a una rama no roja abierta sola, la urgencia y los signos de gravedad de la figura. */}
      {aviso && tramo.clave !== "rojo" && (
        <UrgenciaF3 className="mb-3" donde={`junto a la rama ${tramo.rango}`} />
      )}
      {nota && JSON.stringify(tramo.pasos).includes("*") && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          {FIGURA3.notaAsterisco}
        </p>
      )}
      <ol className={`space-y-3 ${completa ? "" : ""}`}>
        {tramo.pasos.map((p, i) => (
          <Paso key={i} paso={p} hex={hex} i={i} />
        ))}
      </ol>
    </section>
  );
}

/* «β-OHB 1,0-2,9 mmol/l» → «β-OHB» pequeño, «1,0-2,9» grande y «mmol/l» pequeño; el resto
   («o signos de gravedad»), debajo. Mismo texto, mismos espacios. */
function RangoTramo({ rango, on }: { rango: string; on: boolean }) {
  const m = /^(β-OHB) (\S+) (mmol\/l)(.*)$/.exec(rango);
  if (!m)
    return (
      <div className="flex items-center gap-1.5 text-sm font-extrabold leading-tight">
        <Droplets size={15} aria-hidden="true" /> {rango}
      </div>
    );
  return (
    <div className="leading-none">
      <span className="flex items-center justify-between gap-1 text-[11px] font-bold">
        <span className="inline-flex items-center gap-1">
          <Droplets size={13} aria-hidden="true" />
          {m[1]}
        </span>
        <ChevronRight
          size={15}
          aria-hidden="true"
          className={`shrink-0 transition ${on ? "rotate-90" : ""}`}
        />
      </span>{" "}
      <span className="mt-1 inline-block whitespace-nowrap">
        <span className="text-2xl font-extrabold tabular-nums">{m[2]}</span>{" "}
        <span className="text-xs font-bold">{m[3]}</span>
      </span>
      {m[4] && " "}
      {m[4] && <span className="mt-0.5 block text-xs font-bold leading-tight">{m[4].trim()}</span>}
    </div>
  );
}

/* En los rótulos en mayúsculas, la β sigue siendo β (en mayúscula se lee como una B). */
function BetaMinuscula({ t }: { t: string }) {
  const partes = t.split("β");
  // Un solo elemento: dentro de una fila flex, cada trozo sería una columna.
  return (
    <span>
      {partes.map((x, i) => (
        <span key={i}>
          {i > 0 && <span className="normal-case">β</span>}
          {x}
        </span>
      ))}
    </span>
  );
}

function NotasDelPie() {
  return (
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
  );
}

/* Con una rama abierta (también por enlace directo), lo que la figura dice para todas las ramas
   va pegado a ella: la insulina con pluma, las situaciones especiales, el registro y a quién se
   refieren las dosis con asterisco. */
function NotasComunes({ conAsterisco = true }: { conAsterisco?: boolean }) {
  return (
    <section aria-label="Notas comunes de la Figura 3" className="mt-3 space-y-2">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Notas de la figura para todas las ramas
      </div>
      {/* Si la rama ya lleva la nota de las dosis con asterisco, no se repite aquí. */}
      {conAsterisco && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          {FIGURA3.notaAsterisco}
        </p>
      )}
      <NotasDelPie />
    </section>
  );
}

function Pies({ sinNotas }: { sinNotas?: boolean }) {
  return (
    <div className="mt-4 space-y-3">
      {!sinNotas && <NotasDelPie />}
      <div
        className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
        style={{ background: "linear-gradient(130deg, #15324f, #1f4e79)" }}
      >
        <Star size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{FIGURA3.reglaDeOro}</span>
      </div>
      {!sinNotas && (
        <p className="text-xs leading-relaxed text-slate-600">{FIGURA3.notaAsterisco}</p>
      )}
      <p className="text-xs text-slate-500">Abreviaturas: {FIGURA3.abreviaturas}</p>
      <p className="text-xs italic text-slate-500">{FIGURA3.titulo}</p>
    </div>
  );
}

function Cabecera({ herramienta = false }: { herramienta?: boolean }) {
  if (herramienta)
    return (
      <div className="mb-3">
        <TituloBloque className="text-sm font-semibold text-slate-800">
          {FIGURA3.cabecera}
        </TituloBloque>
      </div>
    );
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
        <BetaMinuscula t={FIGURA3.confirmar} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {FIGURA3.tramos.map((t) => (
          <Rama key={t.clave} tramo={t} completa nota={false} />
        ))}
      </div>
      <Pies />
      <div className="no-imprimir mt-3">
        <a
          href={href("consultar", "figura-3")}
          className="tap-44 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
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
  // A la rama («Rama de la figura»), con su aviso y la nota de población antes de las dosis; y
  // se mantiene arriba mientras termina de cargar lo de encima (la página crece y la empujaría).
  const irARama = () => {
    const el = actuar.current;
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    mantenerEnVista(el);
  };
  // Entrar con un tramo ya elegido (pestaña nueva, enlace compartido o de la app, atajo de
  // búsqueda): directo a su rama, ya pintada. Al volver con Atrás, la Shell restaura (V54-03).
  useEffect(() => {
    if (!valido || !fueNavegacionNueva()) return;
    const id = requestAnimationFrame(irARama);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Atajo: con la cetonemia ya medida, ir directo a su rama. */
  const irATramo = (t: Tramo) => {
    elegir(t);
    requestAnimationFrame(irARama);
  };
  const [paso1Abierto] = useState(() => window.matchMedia?.("(min-width: 640px)").matches ?? true);
  return (
    <section aria-label="Figura 3, recorrido paso a paso">
      <Cabecera herramienta />
      {/* Sin rama elegida: la urgencia y los signos de gravedad, tal cual en la figura, antes del
          selector. Con una rama abierta van pegados a ella (o son la rama roja): no se repiten. */}
      {!actual && <UrgenciaF3 className="mb-3" />}
      <ol className="space-y-4">
        <li>
          {/* En el móvil, plegado (0.70.0): así los tramos de β-OHB quedan en la primera pantalla. */}
          <details open={paso1Abierto} className="group">
            <summary className="mb-2 flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 sm:min-h-0">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white">
                1
              </span>{" "}
              Sospechar y comprobar
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="transition group-open:rotate-180"
              />
            </summary>
            <SospecharComprobar />
          </details>
        </li>
        <li>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white">
              2
            </span>{" "}
            <BetaMinuscula t={FIGURA3.confirmar} />
          </div>
          {/* La escala de la figura, de menos a más (decorativa: los botones la dicen). */}
          <div aria-hidden="true" className="mb-2 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
            {TRAMOS.map((k) => (
              <span
                key={k}
                className="flex-1 transition"
                style={{
                  background: TRAMO_HEX[k].strong,
                  opacity: !tramo || tramo === k ? 1 : 0.3,
                }}
              />
            ))}
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
                  onClick={() => (on ? elegir(null) : irATramo(t.clave))}
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
                  {/* 0.72.0: la cifra del tramo, protagonista (el rótulo literal, partido en
                      sus piezas y con sus espacios: el nombre accesible no cambia). */}
                  <RangoTramo rango={t.rango} on={on} />
                  <div className={`mt-1 text-xs font-semibold ${on ? "text-white/90" : ""}`}>
                    {t.titulo}
                  </div>
                </button>
              );
            })}
          </div>
        </li>
        <li ref={actuar} aria-live="polite" className="scroll-mt-20">
          {/* La rama, solo cuando hay un tramo elegido (0.70.0: sin el recuadro vacío). */}
          {actual && (
            <div key={actual.clave} className="pantalla-in">
              <Rama tramo={actual} aviso />
              <NotasComunes conAsterisco={!JSON.stringify(actual.pasos).includes("*")} />
            </div>
          )}
        </li>
      </ol>
      <Pies sinNotas={!!actual} />
      <FuentePie
        fuentes={[{ texto: `Figura 3, p. ${FIGURA3.pagina}`, ruta: "#/capitulo/07-educacion/b5" }]}
      />
      <ImagenFigura figura={INFO_F3} />
    </section>
  );
}
