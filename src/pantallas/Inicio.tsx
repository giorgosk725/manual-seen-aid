/* Recorrido «Iniciar un sistema» (#/consultar/inicio/<fase>[:<sistema>]): el apartado 8 en sus
   cuatro fases, con el sistema elegido o los cuatro, y la hoja de comprobación para imprimir.
   El contenido sale de inicio.ts (referencias al texto literal); aquí solo se pinta. */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { TABLAS, rutaDeTabla } from "../contenido";
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
import { PiezaVista } from "../componentes/Piezas";
import { CATEGORIA_HEX } from "../tokens";
import { FASES, entradasDeFase, hojaDeComprobacion, type Pieza } from "../inicio";

const hex = CATEGORIA_HEX.consultar;
const NOMBRES = TABLAS.T1.columnas;
/* En los botones, el nombre corto (el largo se cortaba en el móvil). */
const CORTOS = ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"];
const HOJA = "hoja";

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* «En esta fase»: índice de los aspectos (filas de tabla e hitos). Elegir uno abre solo ese
   aspecto, con su recomendación, notas y fuente; con uno abierto el índice se pliega a una
   línea («Aspecto: … · Cambiar»). «Fase completa» devuelve la lectura seguida. */
function EnEstaFase({
  piezas,
  activo,
  onElegir,
}: {
  piezas: Pieza[];
  activo: number | null;
  onElegir: (i: number | null) => void;
}) {
  const entradas = entradasDeFase(piezas);
  // Con un aspecto abierto, una línea; «Cambiar» vuelve a enseñar la lista hasta elegir.
  const [cambiando, setCambiando] = useState(false);
  useEffect(() => setCambiando(false), [activo]);
  if (entradas.length < 4) return null;
  const actual = entradas.find((e) => e.i === activo);
  if (actual && !cambiando)
    return (
      <nav
        aria-label="En esta fase"
        className="no-imprimir mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
      >
        <span className="text-slate-700">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Aspecto:{" "}
          </span>
          <span className="font-semibold text-slate-900">{actual.rotulo}</span>
        </span>
        <button
          type="button"
          aria-expanded={false}
          onClick={() => setCambiando(true)}
          className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2 sm:min-h-8"
          style={{ color: hex.ink }}
        >
          Cambiar
        </button>
        <button
          type="button"
          onClick={() => onElegir(null)}
          className="inline-flex min-h-11 items-center font-semibold text-slate-700 underline underline-offset-2 sm:min-h-8"
        >
          Fase completa
        </button>
      </nav>
    );
  const chip = (on: boolean) =>
    `inline-flex min-h-11 items-center whitespace-nowrap rounded-full border px-2.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-8 ${on ? "text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"}`;
  return (
    <nav aria-label="En esta fase" className="no-imprimir mb-3">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        En esta fase · elige un aspecto o lee la fase entera
      </div>
      {/* En el móvil, una fila que se desliza (no una pantalla de botones); en grande, en varias. */}
      <ul className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        <li className="shrink-0">
          <button
            type="button"
            aria-pressed={activo === null}
            onClick={() => onElegir(null)}
            className={chip(activo === null)}
            style={
              activo === null ? { background: hex.strong, borderColor: hex.strong } : undefined
            }
          >
            Fase completa
          </button>
        </li>
        {entradas.map((e) => (
          <li key={e.i} className="shrink-0">
            <button
              type="button"
              aria-pressed={activo === e.i}
              onClick={() => onElegir(activo === e.i ? null : e.i)}
              className={chip(activo === e.i)}
              style={
                activo === e.i ? { background: hex.strong, borderColor: hex.strong } : undefined
              }
            >
              {e.rotulo}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* La fuente exacta del aspecto abierto: la tabla en su sitio del capítulo o el párrafo. */
function FuenteDePieza({ pieza }: { pieza: Pieza }) {
  const ruta =
    pieza.t === "fila" || pieza.t === "casilla"
      ? rutaDeTabla(pieza.tabla)
      : pieza.t === "inicializacion"
        ? rutaDeTabla("T2")
        : pieza.t === "frase" || pieza.t === "lista" || pieza.t === "hito"
          ? href("capitulo", pieza.apartado, pieza.bloque)
          : undefined;
  if (!ruta) return null;
  const texto =
    pieza.t === "fila" || pieza.t === "casilla"
      ? `Ver en el capítulo · Tabla ${TABLAS[pieza.tabla].numero}`
      : pieza.t === "inicializacion"
        ? "Ver en el capítulo · Tabla 2"
        : "Ver en el apartado";
  return (
    <a
      href={ruta}
      className="mt-1.5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
    >
      {texto} <ArrowRight size={13} aria-hidden="true" />
    </a>
  );
}

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

/* Ruta: #/consultar/inicio/<fase>[:<sistema>][:a<aspecto>]. El aspecto va en la ruta para que
   sobreviva a «Ver en el capítulo» y Atrás, y para poder enlazarlo. */
const detalleDe = (f: string, s: number | undefined, a: number | null) =>
  [f, s !== undefined ? SIS_IDS[s] : "", a !== null ? `a${a}` : ""].join(":").replace(/:+$/, "");

export function IniciarSistema({ detalle }: { detalle?: string }) {
  const [faseId, sisId, aspId] = (detalle ?? "").split(":");
  const sisIdx = sisId ? SIS_IDS.indexOf(sisId) : -1;
  const sis = sisIdx >= 0 ? sisIdx : undefined;
  const pasos = [...FASES.map((f) => f.id), HOJA];
  const actual = pasos.includes(faseId) ? faseId : FASES[0].id;
  const n = pasos.indexOf(actual);
  const fase = FASES.find((f) => f.id === actual);
  const ir = (f: string, s = sis, a: number | null = null) =>
    elegirRuta("consultar", "inicio", detalleDe(f, s, a) || undefined);
  const alPaso = useIrAlCambiar(actual, "paso-inicio");
  // Aspecto elegido dentro de la fase (índice de pieza), leído de la ruta.
  const pedido = /^a\d+$/.test(aspId ?? "") ? Number(aspId.slice(1)) : null;
  const aspecto = fase && pedido !== null && fase.piezas[pedido] ? pedido : null;
  const setAspecto = (a: number | null) => ir(actual, sis, a);
  const piezasVisibles = fase && aspecto !== null ? [aspecto] : fase?.piezas.map((_, i) => i);
  return (
    <div>
      <CabeceraEditorial titulo="Iniciar un sistema" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          El apartado 8 (pp. 10-12) en cuatro fases, con lo que piden los apartados 6, 7 y 9. Elige
          un sistema para ver sus indicaciones junto con los criterios comunes de inicio.
        </p>
      </CabeceraEditorial>

      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        Sistema (sus indicaciones y los criterios comunes)
      </div>
      <div className="mb-4">
        <CasillasSistema
          seleccion={sis !== undefined ? [sis] : []}
          onToggle={(c) => ir(actual, sis === c ? undefined : c, aspecto)}
          nombres={CORTOS}
        />
      </div>

      <ol
        className="mb-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-5"
        aria-label="Fases"
      >
        {pasos.map((id, i) => {
          const on = id === actual;
          const rotulo = id === HOJA ? "Hoja de comprobación" : FASES[i].corto;
          return (
            <li key={id} className={`min-w-0 ${id === HOJA ? "col-span-2 sm:col-span-1" : ""}`}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => ir(id)}
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
                  {id === HOJA ? <Check size={13} aria-hidden="true" /> : i + 1}
                </span>
                <span className="min-w-0">{rotulo}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div id="paso-inicio" tabIndex={-1} className="scroll-mt-24 focus:outline-none">
        {fase ? (
          <section
            key={actual}
            className="pantalla-in rounded-2xl border bg-white p-4 shadow-soft"
            style={{ borderColor: "#e6e6e6" }}
            aria-labelledby="fase-titulo"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <h2 id="fase-titulo" className="text-lg font-extrabold text-slate-900">
                <span className="mr-2 tabular-nums" style={{ color: hex.strong }}>
                  {n + 1}.
                </span>
                {capitalizar(fase.nombre)}
              </h2>
              <span className="pagina-badge">{fase.paginas}</span>
            </div>
            <EnEstaFase piezas={fase.piezas} activo={aspecto} onElegir={setAspecto} />
            <div className="space-y-3" aria-live="polite">
              {(piezasVisibles ?? []).map((i) => (
                <div
                  key={i}
                  id={`pieza-${i}`}
                  tabIndex={-1}
                  className="scroll-mt-24 focus:outline-none"
                >
                  <PiezaVista pieza={fase.piezas[i]} sis={sis} />
                  {aspecto !== null && <FuenteDePieza pieza={fase.piezas[i]} />}
                </div>
              ))}
            </div>
            {aspecto !== null && (
              <button
                type="button"
                onClick={() => setAspecto(null)}
                className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:border-slate-500"
              >
                Ver la fase completa <ArrowRight size={13} aria-hidden="true" />
              </button>
            )}
          </section>
        ) : (
          <Hoja sis={sis} />
        )}
      </div>

      <div className="no-imprimir mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={n === 0}
          onClick={() => {
            alPaso();
            ir(pasos[n - 1]);
          }}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
        >
          <ChevronLeft size={14} aria-hidden="true" />{" "}
          {aspecto !== null ? "Fase anterior" : "Anterior"}
        </button>
        <button
          type="button"
          disabled={n === pasos.length - 1}
          onClick={() => {
            alPaso();
            ir(pasos[n + 1]);
          }}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: hex.strong }}
        >
          {n === pasos.length - 2
            ? "Hoja de comprobación"
            : aspecto !== null
              ? "Fase siguiente"
              : "Siguiente"}{" "}
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
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
