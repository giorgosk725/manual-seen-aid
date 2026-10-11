/* Recorrido «Iniciar un sistema» (#/consultar/inicio/<fase>[:<sistema>][:<tarea>]): el apartado 8
   en sus cuatro fases, cada una como una lista corta de tareas desplegables (inicio.ts, TAREAS),
   con el sistema elegido o los cuatro, y la hoja de comprobación como herramienta del recorrido.
   El contenido sale de inicio.ts (referencias al texto literal); aquí solo se pinta. */
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Printer,
} from "lucide-react";
import { PASOS_GUIA } from "../guia-inicio";
import { APARTADOS, GLOSARIO, TABLAS, rutaDeTabla } from "../contenido";
import { ORDEN_SISTEMAS } from "../ampliacion/ids";
import { SIS_IDS } from "../situaciones";
import { elegirRuta, href } from "../rutas";
import { imprimirRegion } from "../imprimir";
import { CabeceraEditorial } from "../ui";
import { useIrAlCambiar } from "../irAlCambiar";
import { CAPITULO } from "../contenido";
import { VERSION_APP } from "../contenido/cambios";
import { Lineas } from "../texto";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { ComoInterpretar } from "../componentes/ComoInterpretar";
import { PiezaVista } from "../componentes/Piezas";
import { siglasEn } from "../siglas";
import { CATEGORIA_HEX } from "../tokens";
import {
  FASES,
  frasesDe,
  hojaDeComprobacion,
  listaDe,
  piezasSueltas,
  tareaDePieza,
  tareasDe,
  textosDePieza,
  type Fase,
  type Pieza,
  type Tarea,
} from "../inicio";

const hex = CATEGORIA_HEX.consultar;
const NOMBRES = TABLAS.T1.columnas;
/* En los botones, el nombre corto (el largo se cortaba en el móvil). */
const CORTOS = ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"];
const HOJA = "hoja";
const GUIA = "guia";

/* La procedencia de una pieza, en una línea («Tabla 2, p. 10»), con su sitio en el capítulo. */
const numeroApartado = (slug: string) => APARTADOS.find((a) => a.slug === slug)?.n ?? "";
function fuentesDePieza(p: Pieza): { texto: string; ruta: string }[] {
  switch (p.t) {
    case "fila":
    case "casilla": {
      const t = TABLAS[p.tabla];
      const r = rutaDeTabla(p.tabla);
      return r ? [{ texto: `Tabla ${t.numero}, p. ${t.paginas[0]}`, ruta: r }] : [];
    }
    case "inicializacion": {
      const r = rutaDeTabla("T2");
      return r ? [{ texto: `Tabla 2, p. ${TABLAS.T2.paginas[0]}`, ruta: r }] : [];
    }
    case "frase":
    case "hito": {
      const f = frasesDe(p.apartado, p.bloque, p.k, p.t === "frase" ? p.trozo : undefined);
      return [{ texto: `Apartado ${numeroApartado(p.apartado)}, p. ${f.pagina}`, ruta: f.ruta }];
    }
    case "lista": {
      const l = listaDe(p.apartado, p.bloque);
      return [{ texto: `Apartado ${numeroApartado(p.apartado)}, p. ${l.pagina}`, ruta: l.ruta }];
    }
    default:
      return [];
  }
}
/* Las fuentes de unas piezas, sin repetir. */
function fuentesDePiezas(piezas: Pieza[]): { texto: string; ruta: string }[] {
  const vistas = new Set<string>();
  return piezas
    .flatMap(fuentesDePieza)
    .filter((f) => !vistas.has(f.texto) && !!vistas.add(f.texto));
}
const fuentesDeTarea = (fase: Fase, t: Tarea) =>
  fuentesDePiezas(t.piezas.map((i) => fase.piezas[i]));
/* Las siglas del glosario, pulsables la primera vez que salen en el bloque: a cada pieza le
   llegan las que no han salido en las anteriores. */
function siglasPorPiezas(piezas: Pieza[], sis?: number): Set<string>[] {
  const vistas = new Set<string>();
  return piezas.map((p) => {
    const pend = new Set(GLOSARIO.map((g) => g.sigla).filter((x) => !vistas.has(x)));
    for (const t of textosDePieza(p, sis)) for (const x of siglasEn(t)) vistas.add(x);
    return pend;
  });
}

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const esDeTabla2 = (p: Pieza) => (p.t === "fila" && p.tabla === "T2") || p.t === "inicializacion";

/* Hoja de comprobación: una cara A4, casillas para marcar en papel (en pantalla se pueden
   marcar, pero no se guarda nada: ni datos del paciente ni de la consulta). */
function Hoja({ sis }: { sis?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const h = hojaDeComprobacion(sis);
  const sistema = sis !== undefined ? NOMBRES[sis] : "";
  const titulo = `Inicio de un sistema de asa cerrada${sistema ? ` · ${sistema}` : ""}`;
  return (
    <div>
      <div className="no-imprimir mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => imprimirRegion(() => ref.current)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <Printer size={15} aria-hidden="true" /> Imprimir la hoja
        </button>
        {sis !== undefined && (
          <a
            href={href("pacientes", "plan", ORDEN_SISTEMAS[sis])}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-500"
          >
            Plan de seguridad para entregar <ArrowRight size={13} aria-hidden="true" />
          </a>
        )}
        <span className="text-xs text-slate-600">
          Una cara A4. {sistema ? "" : "Elige el sistema para que salga solo su línea de inicio."}
        </span>
      </div>
      <div
        ref={ref}
        className="hoja-inicio imprimible rounded-2xl border bg-white p-4 shadow-soft sm:p-6"
        style={{ borderColor: "#e6e6e6" }}
      >
        <h2 className="text-base font-extrabold text-slate-900">{titulo}</h2>
        <p className="text-xs text-slate-600">
          Hoja de comprobación con el texto del capítulo del Manual SEEN sobre la automatización de
          la insulinoterapia (pp. 7-12). No sustituye al juicio clínico.
        </p>
        <h3 className="mt-3 text-sm font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          Antes de activar el modo automático
        </h3>
        <ul className="mt-1 space-y-1">
          {h.antes.map((it) => (
            <li key={it.texto}>
              <label className="flex gap-2 text-sm text-slate-800">
                <input type="checkbox" className="h-7 w-7 shrink-0 accent-slate-700" />
                <span>
                  {it.texto}{" "}
                  <span className="whitespace-nowrap text-xs text-slate-500">p. {it.pagina}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        {h.sistema && (
          <>
            <h3
              className="mt-3 text-sm font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              Qué se programa en {sistema} · Tabla 1, pp. 3-4
            </h3>
            <dl className="mt-1 grid gap-2 sm:grid-cols-2">
              {[h.sistema.objetivo, h.sistema.parametros].map((x) => (
                <div key={x.etiqueta} className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-xs font-bold text-slate-600">{x.etiqueta}</dt>
                  <dd className="text-sm text-slate-800">
                    <Lineas>{x.texto}</Lineas>
                  </dd>
                </div>
              ))}
            </dl>
            {h.sistema.parametros.texto.includes("*") && (
              <p className="mt-1 text-xs text-slate-600">{h.sistema.nota}</p>
            )}
          </>
        )}
        <h3 className="mt-3 text-sm font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          Seguimiento de los primeros 3 meses
        </h3>
        <p className="mt-1 text-sm text-slate-800">
          {h.seguimiento.texto}{" "}
          <span className="whitespace-nowrap text-xs text-slate-500">
            p. {h.seguimiento.pagina}
          </span>
        </p>
        <ul className="mt-1 grid gap-1 sm:grid-cols-2">
          {h.citas.map((c) => (
            <li key={c}>
              <label className="flex gap-2 text-sm text-slate-800">
                <input type="checkbox" className="h-7 w-7 shrink-0 accent-slate-700" />
                <span>{c}</span>
              </label>
            </li>
          ))}
        </ul>
        <p
          className="mt-3 border-t pt-2 text-[11px] text-slate-500"
          style={{ borderColor: "#e6e6e6" }}
        >
          Manual SEEN · AID {VERSION_APP}. Texto literal del capítulo (texto final del{" "}
          {CAPITULO.fechaFuente}) con su página; los rótulos de las citas son de la app.
        </p>
      </div>
    </div>
  );
}

/* Ruta: #/consultar/inicio/<fase>[:<sistema>][:<tarea>]. La tarea va en la ruta para que
   sobreviva a «Ver en el capítulo» y Atrás, y para poder enlazarla. Los enlaces antiguos con
   aspecto («a3») abren la tarea que contiene esa pieza. */
const detalleDe = (f: string, s: number | undefined, t: string | null) =>
  [f, s !== undefined ? SIS_IDS[s] : "", t ?? ""].join(":").replace(/:+$/, "");

/* Una tarea: título que expresa la necesidad; dentro, sus piezas, la procedencia una sola vez,
   la explicación de la app si la hay y, como mucho, una continuación. */
function TareaVista({
  fase,
  tarea,
  sis,
  abierta,
  onToggle,
}: {
  fase: Fase;
  tarea: Tarea;
  sis?: number;
  abierta: boolean;
  onToggle: () => void;
}) {
  const id = `tarea-${tarea.id}`;
  const fuentes = fuentesDeTarea(fase, tarea);
  const siglasDe = siglasPorPiezas(
    tarea.piezas.map((i) => fase.piezas[i]),
    sis,
  );
  const siguiente = tarea.siguiente?.(sis) ?? null;
  return (
    <section className="border-t" style={{ borderColor: "#e6e6e6" }} aria-labelledby={`${id}-t`}>
      <h3 id={`${id}-t`}>
        <button
          type="button"
          aria-expanded={abierta}
          aria-controls={id}
          onClick={onToggle}
          className="flex min-h-12 w-full items-center justify-between gap-3 py-2 text-left text-[15px] font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <span>{tarea.titulo}</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`shrink-0 text-slate-500 transition ${abierta ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      {abierta && (
        <div id={id} className="pb-4">
          <div className="divide-y" style={{ borderColor: "#eeeeee" }}>
            {tarea.piezas.map((i, k) => (
              <div key={i} id={`pieza-${i}`} className="py-2.5 first:pt-0">
                <PiezaVista pieza={fase.piezas[i]} sis={sis} compacta siglas={siglasDe[k]} />
              </div>
            ))}
          </div>
          <LineaFuente fuentes={fuentes} />
          {tarea.piezas.some((i) => esDeTabla2(fase.piezas[i])) && <ComoInterpretar tabla="T2" />}
          {siguiente && (
            <p className="mt-2">
              <a
                href={siguiente.ruta}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline sm:min-h-8"
              >
                Seguir en: {siguiente.texto} <ArrowRight size={13} aria-hidden="true" />
              </a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* Fuente de un bloque de piezas, en una línea. */
function LineaFuente({ fuentes }: { fuentes: { texto: string; ruta: string }[] }) {
  if (!fuentes.length) return null;
  return (
    <p className="mt-1 text-[13px] text-slate-500">
      Fuente:{" "}
      {fuentes.map((f, k) => (
        <span key={f.texto}>
          {k > 0 && " · "}
          <a href={f.ruta} className="font-semibold text-slate-600 hover:underline">
            {f.texto}
          </a>
        </span>
      ))}{" "}
      · <span className="whitespace-nowrap">texto literal del capítulo</span>
    </p>
  );
}

/* Guía paso a paso, con un paciente delante: seis pasos; las preguntas eligen qué texto del
   capítulo se enseña y las casillas se marcan durante la consulta. No se guarda nada (ni las
   respuestas ni lo marcado): sin datos del paciente. */
function GuiaInicio({ sis, paso }: { sis?: number; paso: number }) {
  const n = Math.min(PASOS_GUIA.length, Math.max(1, paso));
  const p = PASOS_GUIA[n - 1];
  const [resp, setResp] = useState<Record<string, string>>({});
  const [hechos, setHechos] = useState<Set<string>>(new Set());
  const ir = (k: number) => elegirRuta("consultar", "inicio", detalleDe(GUIA, sis, String(k)));
  const alPaso = useIrAlCambiar(String(n), "paso-guia");
  const elegidas = (p.preguntas ?? []).flatMap(
    (q) => q.opciones.find((o) => o.id === resp[q.id])?.piezas ?? [],
  );
  const piezas = [...p.piezas, ...elegidas];
  const siglas = siglasPorPiezas(piezas, sis);
  const hoja = hojaDeComprobacion(sis);
  const lista =
    p.comprobar === "antes"
      ? hoja.antes.map((x) => x.texto)
      : p.comprobar === "citas"
        ? hoja.citas
        : [];
  const enlace = p.enlace?.(sis) ?? null;
  const marcar = (k: string) =>
    setHechos((prev) => {
      const s = new Set(prev);
      if (s.has(k)) s.delete(k);
      else s.add(k);
      return s;
    });
  const boton = (on: boolean) =>
    `inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-9 ${on ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`;
  return (
    <section
      id="paso-guia"
      className="pantalla-in scroll-mt-24 rounded-2xl border bg-white px-4 pb-3 pt-4"
      style={{ borderColor: "#e6e6e6" }}
      aria-labelledby="guia-titulo"
    >
      <ol className="mb-3 flex flex-wrap gap-1.5" aria-label="Pasos de la guía">
        {PASOS_GUIA.map((x, i) => {
          const on = i === n - 1;
          return (
            <li key={x.id}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => {
                  alPaso();
                  ir(i + 1);
                }}
                className={boton(on).replace("min-h-11", "min-h-9").replace("px-3", "px-2.5")}
                style={
                  on
                    ? { background: hex.strong, borderColor: hex.strong }
                    : { borderColor: "#e6e6e6" }
                }
              >
                <span className="tabular-nums">{i + 1}</span>
                <span className="hidden sm:inline">{x.titulo}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Paso {n} de {PASOS_GUIA.length}
      </p>
      <h2 id="guia-titulo" className="text-lg font-extrabold text-slate-900">
        {p.titulo}
      </h2>
      {p.intro && <p className="mt-1 text-sm text-slate-600">{p.intro}</p>}
      {(p.preguntas ?? []).map((q) => (
        <div key={q.id} className="mt-3">
          <div className="mb-1 text-sm font-semibold text-slate-800">{q.rotulo}</div>
          <div role="group" aria-label={q.rotulo} className="flex flex-wrap gap-1.5">
            {q.opciones.map((o) => {
              const on = resp[q.id] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setResp({ ...resp, [q.id]: on ? "" : o.id })}
                  className={boton(on)}
                  style={
                    on
                      ? { background: "#334155", borderColor: "#334155" }
                      : { borderColor: "#d4d4d4" }
                  }
                >
                  {o.texto}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {piezas.length > 0 && (
        <div className="mt-3 divide-y" style={{ borderColor: "#eeeeee" }}>
          {piezas.map((pz, k) => (
            <div key={k} className="py-2.5 first:pt-0">
              <PiezaVista pieza={pz} sis={sis} compacta siglas={siglas[k]} />
            </div>
          ))}
        </div>
      )}
      <LineaFuente fuentes={fuentesDePiezas(piezas)} />
      {piezas.some(esDeTabla2) && <ComoInterpretar tabla="T2" />}
      {lista.length > 0 && (
        <ul className="mt-3 space-y-1" aria-label="Para marcar en la consulta">
          {lista.map((x) => (
            <li key={x}>
              <label className="flex gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={hechos.has(x)}
                  onChange={() => marcar(x)}
                  className="h-6 w-6 shrink-0 accent-slate-700"
                />
                <span>{x}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {enlace && (
        <p className="mt-2">
          <a
            href={enlace.ruta}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline sm:min-h-8"
          >
            Seguir en: {enlace.texto} <ArrowRight size={13} aria-hidden="true" />
          </a>
        </p>
      )}
      <div className="no-imprimir mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={n === 1}
          onClick={() => {
            alPaso();
            ir(n - 1);
          }}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
        >
          <ChevronLeft size={14} aria-hidden="true" /> Anterior
        </button>
        <button
          type="button"
          onClick={() => {
            alPaso();
            if (n === PASOS_GUIA.length)
              elegirRuta("consultar", "inicio", detalleDe(HOJA, sis, null) || undefined);
            else ir(n + 1);
          }}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-white"
          style={{ background: hex.strong }}
        >
          {n === PASOS_GUIA.length ? "Hoja de comprobación" : "Siguiente"}{" "}
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        No se guarda nada: ni las respuestas ni lo marcado. El texto es el del capítulo, con su
        página.
      </p>
    </section>
  );
}

export function IniciarSistema({ detalle }: { detalle?: string }) {
  const [faseId, sisId, tareaId] = (detalle ?? "").split(":");
  const sisIdx = sisId ? SIS_IDS.indexOf(sisId) : -1;
  const sis = sisIdx >= 0 ? sisIdx : undefined;
  const actual = FASES.some((f) => f.id === faseId)
    ? faseId
    : faseId === HOJA || faseId === GUIA
      ? faseId
      : FASES[0].id;
  const n = FASES.findIndex((f) => f.id === actual);
  const fase = FASES.find((f) => f.id === actual);
  const tareas = fase ? tareasDe(fase.id) : [];
  // Tarea pedida en la ruta: por su id o por el aspecto antiguo («a3» = la tarea de esa pieza).
  const pedida =
    tareaId && /^a\d+$/.test(tareaId)
      ? (tareaDePieza(actual, Number(tareaId.slice(1)))?.id ?? null)
      : tareas.some((t) => t.id === tareaId)
        ? tareaId
        : null;
  const ir = (f: string, s = sis, t: string | null = null) =>
    elegirRuta("consultar", "inicio", detalleDe(f, s, t) || undefined);
  const alPaso = useIrAlCambiar(actual, "paso-inicio");
  // Abiertas: la pedida (o la primera); «Fase completa» las abre todas.
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());
  const [completa, setCompleta] = useState(false);
  useEffect(() => {
    const lista = tareasDe(actual);
    setAbiertas(
      new Set(
        completa
          ? lista.map((t) => t.id)
          : [pedida ?? lista[0]?.id].filter((x): x is string => !!x),
      ),
    );
  }, [actual, pedida, completa]);
  const alternar = (id: string) => {
    const abrir = !abiertas.has(id);
    setCompleta(false);
    setAbiertas((prev) => {
      const s = new Set(prev);
      if (abrir) s.add(id);
      else s.delete(id);
      return s;
    });
    ir(actual, sis, abrir ? id : null);
  };
  return (
    <div>
      <CabeceraEditorial titulo="Iniciar un sistema" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Preparación, puesta en marcha y seguimiento, por sistema.
        </p>
      </CabeceraEditorial>

      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        Sistema (sus indicaciones y los criterios comunes)
      </div>
      <div className="mb-4">
        <CasillasSistema
          seleccion={sis !== undefined ? [sis] : []}
          onToggle={(c) =>
            ir(actual, sis === c ? undefined : c, actual === GUIA ? tareaId || null : pedida)
          }
          nombres={CORTOS}
        />
      </div>

      {/* Las cuatro fases en su fila; la hoja, aparte (en el móvil, debajo). */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start">
        <ol className="grid w-full grid-cols-2 gap-1.5 sm:flex-1 sm:grid-cols-4" aria-label="Fases">
          {FASES.map((f, i) => {
            const on = f.id === actual;
            return (
              <li key={f.id} className="min-w-0">
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => ir(f.id)}
                  className={`flex min-h-11 w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
                  style={
                    on
                      ? { background: hex.strong, borderColor: hex.strong }
                      : { borderColor: "#e6e6e6" }
                  }
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${on ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">{f.corto}</span>
                </button>
              </li>
            );
          })}
        </ol>
        {/* La guía y la hoja son herramientas del recorrido, no fases. */}
        <button
          type="button"
          aria-current={actual === GUIA ? "page" : undefined}
          onClick={() => ir(GUIA, sis, "1")}
          className={`inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${actual === GUIA ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
          style={
            actual === GUIA
              ? { background: "#334155", borderColor: "#334155" }
              : { borderColor: "#e6e6e6" }
          }
        >
          <ListChecks size={14} aria-hidden="true" /> Guía paso a paso
        </button>
        <button
          type="button"
          aria-current={actual === HOJA ? "page" : undefined}
          onClick={() => ir(HOJA)}
          className={`inline-flex min-h-11 items-center gap-1.5 self-start rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${actual === HOJA ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
          style={
            actual === HOJA
              ? { background: "#334155", borderColor: "#334155" }
              : { borderColor: "#e6e6e6" }
          }
        >
          <Check size={14} aria-hidden="true" /> Hoja de comprobación
        </button>
      </div>

      <div id="paso-inicio" tabIndex={-1} className="scroll-mt-24 focus:outline-none">
        {fase ? (
          <section
            key={actual}
            className="pantalla-in rounded-2xl border bg-white px-4 pb-3 pt-4"
            style={{ borderColor: "#e6e6e6" }}
            aria-labelledby="fase-titulo"
          >
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <h2 id="fase-titulo" className="text-lg font-extrabold text-slate-900">
                <span className="mr-2 tabular-nums" style={{ color: hex.strong }}>
                  {n + 1}.
                </span>
                {capitalizar(fase.nombre)}
              </h2>
              <button
                type="button"
                aria-pressed={completa}
                onClick={() => {
                  setCompleta(!completa);
                  if (completa) ir(actual, sis, null);
                }}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline underline-offset-2 sm:min-h-8"
              >
                {completa ? "Plegar las tareas" : "Fase completa"}
              </button>
            </div>
            <div aria-live="polite">
              {tareas.map((t) => (
                <TareaVista
                  key={t.id}
                  fase={fase}
                  tarea={t}
                  sis={sis}
                  abierta={abiertas.has(t.id)}
                  onToggle={() => alternar(t.id)}
                />
              ))}
            </div>
            {piezasSueltas(fase).length > 0 && (
              <p
                className="mt-2 flex flex-wrap gap-x-4 border-t pt-2 text-sm"
                style={{ borderColor: "#e6e6e6" }}
              >
                {piezasSueltas(fase).map((i) => (
                  <PiezaVista key={i} pieza={fase.piezas[i]} sis={sis} compacta />
                ))}
              </p>
            )}
            <p className="mt-2 text-[13px] text-slate-500">
              Apartado 8 del capítulo, {fase.paginas}.
            </p>
          </section>
        ) : actual === GUIA ? (
          <GuiaInicio sis={sis} paso={Number(tareaId) || 1} />
        ) : (
          <Hoja sis={sis} />
        )}
      </div>

      {fase && (
        <div className="no-imprimir mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={n === 0}
            onClick={() => {
              alPaso();
              ir(FASES[n - 1].id);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Fase anterior
          </button>
          <button
            type="button"
            onClick={() => {
              alPaso();
              ir(n === FASES.length - 1 ? HOJA : FASES[n + 1].id);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-white"
            style={{ background: hex.strong }}
          >
            {n === FASES.length - 1 ? "Hoja de comprobación" : "Siguiente"}{" "}
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">
        <a
          href={href("capitulo", "08-iniciacion")}
          className="inline-flex min-h-11 items-center font-semibold underline"
        >
          Leer el apartado 8 completo
        </a>
      </p>
    </div>
  );
}
