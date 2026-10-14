/* Calculadora de parámetros iniciales (#/consultar/inicio/calculadora[:<sistema>]): de qué
   tratamiento viene, qué sistema, las dosis, y salen la DTD de inicio, la basal, la ratio, el
   factor y qué programar en ese sistema. Solo las reglas de la Tabla 2 y del apartado 8
   (calculadora.ts). 0.63.0 (auditoría de la 0.61): una sola lectura de cada campo; sin datos
   completos y válidos no hay cifras; la comparación con la Tabla 1 decide si hay propuesta; la
   pauta previa se comparte con los pasos (trabajo-inicio.ts) y «Nuevo inicio» lo vacía todo. */
import { Anuncio } from "./Anuncio";
import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE } from "../notas-complementarias";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Calculator,
  Moon,
  Pen,
  RefreshCw,
  Repeat,
  ShieldCheck,
  SlidersHorizontal,
  Syringe,
  Target,
  Utensils,
  Zap,
} from "lucide-react";
import { Lineas } from "../texto";
import {
  CONTROLES,
  DESDE_ISCI,
  INICIALIZACION,
  LIMITES,
  NUCLEO_COMUN,
  OBJETIVOS_CALCULADOR,
  RECAMBIOS,
  REGLAS,
  aprendizajeDe,
  coma,
  evaluar,
  gruposDeProgramar,
  indicacionDe,
  leerCifra,
  materialDe,
  modosDe,
  objetivoAlgoritmoDe,
  papelEnAutomatico,
  pidePesoYDtd,
  redondea,
  reduccionDePartida,
  type Clave,
  type Control,
  type Evaluacion,
  type Origen,
} from "../calculadora";
import { TABLAS, rutaDeTabla } from "../contenido";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { SETS_INFUSION } from "../ampliacion/datos";
import { SIS_IDS } from "../situaciones";
import { href } from "../rutas";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { FuentePie } from "./FuentePie";
import { cambiarCalculadora, useTrabajo } from "../trabajo-inicio";

const hex = CATEGORIA_HEX.consultar;
const CORTOS = ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"];
/* La pauta previa, por origen: lo que se traslada y lo que se calcula (apartado 8, p. 12). */
const PREVIA: Record<Origen, string> = {
  mdi: "de su pauta",
  isci: "de la bomba actual",
  aid: "del sistema actual",
};
const PARTIDA_MDI =
  "La fuente de partida es la pauta previa del paciente, trasladada al esquema del sistema elegido";

function Paso({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`calc-paso-${n}`} className="space-y-2">
      {/* 0.72.0: cabecera de paso ligera (círculo burdeos); el foco visual, en los resultados. */}
      <h2
        id={`calc-paso-${n}`}
        className="flex items-center gap-2 border-b pb-1.5 text-[15px] font-extrabold text-slate-900"
        style={{ borderColor: "#e6e6e6" }}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums text-white"
          style={{ background: "#8E254E" }}
        >
          {n}
        </span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Opciones<T extends string | number>({
  etiqueta,
  opciones,
  valor,
  onChange,
  marca,
}: {
  etiqueta: string;
  opciones: { v: T; t: ReactNode }[];
  valor: T;
  onChange: (v: T) => void;
  /* «punto de partida» / «modificado», junto al rótulo. */
  marca?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-800">
        {etiqueta}
        {marca}
      </div>
      <div role="group" aria-label={etiqueta} className="flex flex-wrap gap-1.5">
        {opciones.map((o) => {
          const on = o.v === valor;
          return (
            <button
              key={String(o.v)}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.v)}
              className={`inline-flex min-h-11 items-center rounded-full border px-3 text-left text-sm font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
              style={
                on ? { background: "#8E254E", borderColor: "#8E254E" } : { borderColor: "#d4d4d4" }
              }
            >
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Marca({ modificado, onRestablecer }: { modificado: boolean; onRestablecer?: () => void }) {
  return modificado ? (
    <span className="text-xs font-semibold text-amber-900">
      modificado
      {onRestablecer && (
        <button
          type="button"
          onClick={onRestablecer}
          className="ml-1.5 inline-flex min-h-11 items-center font-semibold text-slate-700 underline underline-offset-2 sm:min-h-6"
        >
          volver al punto de partida
        </button>
      )}
    </span>
  ) : (
    <span className="text-xs font-normal text-slate-500">punto de partida</span>
  );
}

function Campo({
  id,
  etiqueta,
  ayuda,
  unidad,
  valor,
  onChange,
  max,
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  unidad: string;
  valor: string;
  onChange: (v: string) => void;
  max: number;
}) {
  const l = leerCifra(valor, max);
  const error = l.estado === "invalido" ? l.motivo : null;
  return (
    // 0.72.0: la etiqueta ocupa lo que sobre y las cajas quedan alineadas en su fila aunque
    // unas lleven ayuda y otras no.
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 block flex-1 text-sm font-semibold text-slate-800">
        {etiqueta}
        {ayuda && <span className="block text-xs font-normal text-slate-500">{ayuda}</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="—"
          className="h-12 w-full min-w-0 rounded-lg border bg-white px-3 text-lg tabular-nums text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          style={{ borderColor: error ? "#b91c1c" : "#cbd5e1" }}
        />
        <span className="shrink-0 text-sm text-slate-600">{unidad}</span>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

function Cifra({
  titulo,
  valor,
  unidad,
  cuenta,
  regla,
  color,
}: {
  titulo: string;
  valor: string;
  unidad: string;
  cuenta: string;
  regla: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: "#e2e8f0" }}>
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{titulo}</div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tabular-nums" style={{ color }}>
          {valor}
        </span>
        <span className="text-sm font-semibold text-slate-600">{unidad}</span>
      </div>
      <div className="mt-0.5 text-xs tabular-nums text-slate-600">{cuenta}</div>
      <div className="mt-1 text-xs text-slate-500">{regla}</div>
    </div>
  );
}

const NOMBRE_CLAVE: Record<Clave, string> = {
  peso: "Peso",
  dtd: "DTD",
  basal: "Tasa basal",
  factor: "Factor de sensibilidad",
  ratio: "Ratio I/HC",
  objetivo: "Objetivo del calculador de bolos manual",
  objetivoAlg: "Objetivo glucémico del algoritmo",
  ia: "Duración de la insulina activa",
};

/* Lo que bloquea o deja pendiente la propuesta, siempre antes de las cifras (I61-03). */
function Estado({ ev, sis }: { ev: Evaluacion; sis?: number }) {
  return (
    // 0.72.0 (4.1.3): sin regiones vivas aquí; lo anuncia un solo resumen, con calma (Anuncio).
    <div className="space-y-2">
      {ev.indicacion.fuera.length > 0 && sis !== undefined && (
        <div
          role="group"
          aria-label="Fuera de la indicación"
          className="rounded-xl border-2 px-3 py-2 text-sm text-red-900"
          style={{ borderColor: "#fca5a5", background: "#fef2f2" }}
        >
          <p className="flex items-center gap-1.5 font-bold">
            <AlertTriangle size={16} aria-hidden="true" /> Fuera de la indicación: no hay propuesta
          </p>
          <ul className="mt-1 list-disc pl-5">
            {ev.indicacion.fuera.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs">
            Indicación de {CORTOS[sis]}: «{indicacionDe(sis).replace(/\n/g, " · ")}».
          </p>
        </div>
      )}
      {ev.errores.length > 0 && (
        <ul
          className="list-disc rounded-lg border px-3 py-2 pl-7 text-sm font-semibold text-red-900"
          style={{ borderColor: "#fca5a5", background: "#fef2f2" }}
        >
          {ev.errores.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {ev.faltan.length > 0 && (
        <p
          className="rounded-lg border border-dashed px-3 py-3 text-center text-sm text-slate-700"
          style={{ borderColor: "#cbd5e1" }}
        >
          <Calculator size={18} className="mx-auto mb-1 text-slate-400" aria-hidden="true" />
          Falta: {ev.faltan.map(enMinuscula).join(", ")}.
        </p>
      )}
      {ev.indicacion.variante && (
        <p
          role="note"
          className="flex gap-2 rounded-lg border px-3 py-2 text-sm text-amber-900"
          style={{ borderColor: "#f3d38a", background: "#fffbeb" }}
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {ev.indicacion.variante} Indicación: «{indicacionDe(sis!).replace(/\n/g, " · ")}».
          </span>
        </p>
      )}
    </div>
  );
}

export function CalculadoraInicio({
  sis,
  onSistema,
}: {
  sis?: number;
  onSistema: (c: number) => void;
}) {
  const { calc: d } = useTrabajo();
  const set = cambiarCalculadora;
  const mdi = d.origen === "mdi";
  const previa = PREVIA[d.origen];

  const elegirControl = (c: Control) => {
    const x = CONTROLES.find((k) => k.id === c)!;
    // Lo cambiado a mano se respeta; lo que sigue en su valor de partida acompaña al control.
    set({
      control: c,
      ...(d.tocado.reduccion ? {} : { reduccion: reduccionDePartida(c, d.ultralarga) }),
      ...(d.tocado.regla ? {} : { regla: x.regla }),
      ...(d.tocado.objetivo ? {} : { objetivo: c === "riesgo" ? 120 : 100 }),
    });
  };
  const ev = evaluar(sis, {
    origen: d.origen,
    referencia: d.referencia,
    basal: d.basal,
    rapida: d.rapida,
    dtd: d.dtd,
    peso: d.peso,
    reduccion: d.reduccion,
    basalPct: d.basalPct,
    regla: d.regla,
  });
  const h = sis !== undefined ? SISTEMA_HEX[sis] : null;
  const color = h?.ink ?? "#1f2f5c";
  const resultados = useRef<HTMLDivElement>(null);
  const [resultadosVisibles, setResultadosVisibles] = useState(true);
  useEffect(() => {
    const el = resultados.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setResultadosVisibles(e.isIntersecting), {
      rootMargin: "0px 0px -80px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const peso = leerCifra(d.peso, LIMITES.peso);
  const pideObjetivo = mdi || !d.referencia;
  const ruta = (fase: string, tarea = "") =>
    href(
      "consultar",
      "inicio",
      [fase, sis !== undefined ? SIS_IDS[sis] : "", tarea].join(":").replace(/:+$/, ""),
    );

  const valorDe = (k: Clave, c: number): ReactNode => {
    const traslado = (
      <span className="font-normal italic text-slate-600">
        {k === "basal" ? "la" : "el"} {previa}
      </span>
    );
    const sinPropuesta = <span className="font-normal text-slate-500">—</span>;
    switch (k) {
      case "peso":
        return peso.estado === "valido" ? (
          `${coma(peso.v)} kg`
        ) : (
          <span className="font-normal italic text-slate-600">falta el peso</span>
        );
      case "dtd":
        return ev.lista && ev.dtdInicio !== null
          ? `${coma(redondea(ev.dtdInicio, 1))} UI/día`
          : sinPropuesta;
      case "basal":
        if (!ev.calcula.basal) return traslado;
        return ev.lista && ev.basalHora !== null && ev.basalDia !== null
          ? `≈ ${coma(redondea(ev.basalHora, 2))} UI/h (basal plana; ${coma(redondea(ev.basalDia, 1))} UI/día)`
          : sinPropuesta;
      case "factor":
        if (!ev.calcula.ratioFactor) return mdi ? "el de su pauta" : traslado;
        return ev.lista && ev.factor !== null
          ? `1 UI por ${Math.round(ev.factor)} mg/dl`
          : sinPropuesta;
      case "ratio":
        if (!ev.calcula.ratioFactor) return mdi ? "la de su pauta" : traslado;
        return ev.lista && ev.ratio !== null
          ? `1 UI por ${coma(redondea(ev.ratio, 1))} g de HC`
          : sinPropuesta;
      case "objetivo":
        return pideObjetivo ? `${d.objetivo} mg/dl` : traslado;
      case "objetivoAlg":
        return <span className="font-normal">{objetivoAlgoritmoDe(c).replace(/\n/g, " · ")}</span>;
      case "ia":
        return <span className="font-normal">{papelEnAutomatico("ia", c)}</span>;
    }
  };

  const fuentes = [
    { texto: `Tabla 2, p. ${TABLAS.T2.paginas[0]}`, ruta: rutaDeTabla("T2") },
    { texto: "Apartado 8, p. 12", ruta: href("capitulo", "08-iniciacion") },
    { texto: "Tabla 1, pp. 3-4", ruta: rutaDeTabla("T1") },
    { texto: `Tabla 3, p. ${TABLAS.T3.paginas[0]}`, ruta: rutaDeTabla("T3") },
  ].map((f) => ({ texto: f.texto, ruta: f.ruta ?? undefined }));

  const resumen = [
    ev.lista && ev.dtdInicio !== null ? `DTD ${coma(redondea(ev.dtdInicio, 1))} UI/día` : null,
    ev.lista && ev.calcula.basal && ev.basalHora !== null
      ? `basal ≈ ${coma(redondea(ev.basalHora, 2))} UI/h`
      : null,
    ev.lista && ev.calcula.ratioFactor && ev.ratio !== null
      ? `I/HC ${coma(redondea(ev.ratio, 1))} g/UI`
      : null,
    ev.lista && ev.calcula.ratioFactor && ev.factor !== null
      ? `sensibilidad ${Math.round(ev.factor)} mg/dl/UI`
      : null,
  ].filter((x): x is string => !!x);

  return (
    <div className="space-y-5">
      {/* 0.72.0: hasta la pantalla ancha, mientras los parámetros de partida no están a la
          vista, una barra con sus cifras (las mismas); al tocarla, se va a ellos. */}
      {/* En un portal: la animación de entrada de la pantalla (transform) haría que «fixed» se
          quedara dentro de ella. */}
      {resumen.length > 0 &&
        !resultadosVisibles &&
        createPortal(
          <button
            type="button"
            onClick={() => resultados.current?.scrollIntoView({ block: "start" })}
            className="no-imprimir fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold tabular-nums text-white shadow-xl lg:bottom-4 lg:left-[17rem] xl:hidden"
            style={{ background: "#8E254E" }}
          >
            <span className="min-w-0 flex-1">{resumen.join(" · ")}</span>
            <ArrowDown size={14} aria-hidden="true" className="shrink-0" />
          </button>,
          document.body,
        )}
      {/* 0.72.0: en pantallas anchas, los datos a la izquierda y los parámetros de partida a la
          derecha, a la vista mientras se cambian los datos. */}
      <div className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-6 xl:space-y-0">
        <div className="min-w-0 space-y-5">
          <Paso n={1} titulo="¿De qué tratamiento viene?">
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { v: "mdi", t: "MDI", dd: "Plumas: basal y rápida", I: Pen },
                  { v: "isci", t: "Bomba de insulina", dd: "ISCI sin automatización", I: Syringe },
                  { v: "aid", t: "Otro sistema AID", dd: "Cambio de sistema", I: Repeat },
                ] as const
              ).map((o) => {
                const on = d.origen === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ origen: o.v })}
                    className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 px-1 py-3 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    style={
                      on
                        ? { borderColor: hex.strong, background: hex.soft }
                        : { borderColor: "#e2e8f0", background: "#fff" }
                    }
                  >
                    <o.I
                      size={22}
                      aria-hidden="true"
                      style={{ color: on ? hex.strong : "#64748b" }}
                    />
                    <span className="text-sm font-extrabold leading-tight text-slate-900 sm:text-base">
                      {o.t}
                    </span>
                    <span className="text-[11px] leading-tight text-slate-600 sm:text-xs">
                      {o.dd}
                    </span>
                  </button>
                );
              })}
            </div>
          </Paso>

          <Paso n={2} titulo="¿Qué sistema?">
            <div
              role="group"
              aria-label="Sistema"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {ORDEN_SISTEMAS.map((id, c) => {
                const on = sis === c;
                const hs = SISTEMA_HEX[c];
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onSistema(c)}
                    className="flex min-h-14 items-center gap-2 rounded-xl border-2 p-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    style={
                      on
                        ? { borderColor: hs.strong, background: hs.soft }
                        : { borderColor: "#e2e8f0", background: "#fff" }
                    }
                  >
                    <img
                      src={FOTO_SISTEMA[id]}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg bg-white object-cover"
                    />
                    {/* Sin color en línea si no está elegido: de noche, «#1e293b» era el fondo. */}
                    <span
                      className={`min-w-0 text-sm font-bold leading-tight ${on ? "" : "text-slate-900"}`}
                      style={on ? { color: hs.ink } : undefined}
                    >
                      {CORTOS[c]}
                    </span>
                  </button>
                );
              })}
            </div>
            {sis === 2 && (
              <p className="text-xs text-slate-600">
                Los pasos de inicio son los de CamAPS FX. Para la modalidad Liberty, el capítulo
                indica «&gt; 13 años».
              </p>
            )}
          </Paso>

          <Paso n={3} titulo={mdi ? "Dosis actuales y perfil" : "Programación actual"}>
            {mdi ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Campo
                    id="calc-basal"
                    etiqueta="Insulina basal"
                    unidad="UI/día"
                    valor={d.basal}
                    onChange={(v) => set({ basal: v })}
                    max={LIMITES.dosis}
                  />
                  <Campo
                    id="calc-rapida"
                    etiqueta="Insulina rápida"
                    ayuda="Total diario (0 si no usa insulina rápida)"
                    unidad="UI/día"
                    valor={d.rapida}
                    onChange={(v) => set({ rapida: v })}
                    max={LIMITES.dosis}
                  />
                  <Campo
                    id="calc-peso"
                    etiqueta="Peso"
                    ayuda={
                      pidePesoYDtd(sis)
                        ? `${CORTOS[sis!]} lo pide para iniciar el automático`
                        : "Para comprobar la indicación"
                    }
                    unidad="kg"
                    valor={d.peso}
                    onChange={(v) => set({ peso: v })}
                    max={LIMITES.peso}
                  />
                </div>
                <Opciones
                  etiqueta="Ratio y factor de sensibilidad"
                  opciones={[
                    { v: "no", t: "Sin ratio ni factor propios: reglas del 450 y del 1700" },
                    { v: "si", t: "Con ratio y factor propios ya ajustados" },
                  ]}
                  valor={d.referencia ? "si" : "no"}
                  onChange={(v) => set({ referencia: v === "si" })}
                />
                {d.referencia && <p className="text-xs text-slate-600">{PARTIDA_MDI}.</p>}
                <Opciones
                  etiqueta="Control previo"
                  opciones={CONTROLES.map((c) => ({ v: c.id, t: c.texto }))}
                  valor={d.control}
                  onChange={elegirControl}
                />
                <div>
                  <label
                    htmlFor="calc-reduccion"
                    className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-sm font-semibold text-slate-800"
                  >
                    <span>
                      Reducción de la DTD{" "}
                      <Marca
                        modificado={d.tocado.reduccion}
                        onRestablecer={() =>
                          set({
                            reduccion: reduccionDePartida(d.control, d.ultralarga),
                            tocado: { ...d.tocado, reduccion: false },
                          })
                        }
                      />
                    </span>
                    <span
                      className="text-lg font-extrabold tabular-nums"
                      style={{ color: hex.strong }}
                    >
                      {d.reduccion} %
                    </span>
                  </label>
                  <input
                    id="calc-reduccion"
                    type="range"
                    min={0}
                    max={20}
                    step={5}
                    value={d.reduccion}
                    onChange={(e) =>
                      set({
                        reduccion: Number(e.target.value),
                        tocado: { ...d.tocado, reduccion: true },
                      })
                    }
                    className="h-11 w-full"
                    style={{ accentColor: hex.strong }}
                  />
                  <div
                    className="flex justify-between text-[11px] tabular-nums text-slate-500"
                    aria-hidden="true"
                  >
                    <span>0 %</span>
                    <span>5 %</span>
                    <span>10 %</span>
                    <span>15 %</span>
                    <span>20 %</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{REGLAS.reduccion.texto}.</p>
                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    Punto de partida dentro del intervalo del capítulo; puede ajustarse.
                    {d.control === "bueno" &&
                      d.ultralarga &&
                      !d.tocado.reduccion &&
                      " Con glargina U-300 o degludec y buen control previo, se parte del 20 %, por el riesgo de hipoglucemia de los primeros días."}
                  </p>
                </div>
                <label className="flex min-h-11 items-center gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={d.ultralarga}
                    onChange={(e) =>
                      set({
                        ultralarga: e.target.checked,
                        ...(d.control === "bueno" && !d.tocado.reduccion
                          ? { reduccion: reduccionDePartida("bueno", e.target.checked) }
                          : {}),
                      })
                    }
                    className="h-6 w-6 shrink-0 accent-slate-700"
                  />
                  La basal previa es glargina U-300 o degludec
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <Opciones
                  etiqueta={`¿Es adecuada la programación ${previa}?`}
                  opciones={[
                    { v: "si", t: "Sí: se traslada tal cual" },
                    { v: "no", t: "No es adecuada o no hay programación previa" },
                  ]}
                  valor={d.referencia ? "si" : "no"}
                  onChange={(v) => set({ referencia: v === "si" })}
                />
                <p
                  className="rounded-lg px-3 py-2 text-sm text-slate-800"
                  style={{ background: "#f1f5f9" }}
                >
                  {d.referencia
                    ? `${DESDE_ISCI.trasladar.charAt(0).toUpperCase()}${DESDE_ISCI.trasladar.slice(1)}.`
                    : `${DESDE_ISCI.sinReferencia.charAt(0).toUpperCase()}${DESDE_ISCI.sinReferencia.slice(1)}. ${DESDE_ISCI.basalPlana}.`}
                </p>
                {d.origen === "aid" && (
                  <p className="text-xs text-slate-600">
                    Al cambiar de sistema, los parámetros que cuentan en automático no son los
                    mismos:{" "}
                    <a
                      href={href("sistemas", "todos", "parametros")}
                      className="font-semibold underline"
                    >
                      compara los parámetros
                    </a>
                    .
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Campo
                    id="calc-dtd"
                    etiqueta="DTD actual"
                    ayuda={
                      !d.referencia
                        ? "Para las reglas del 450 y del 1700"
                        : pidePesoYDtd(sis)
                          ? `${CORTOS[sis!]} la pide para iniciar el automático`
                          : "Para comprobar la indicación"
                    }
                    unidad="UI/día"
                    valor={d.dtd}
                    onChange={(v) => set({ dtd: v })}
                    max={LIMITES.dosis}
                  />
                  <Campo
                    id="calc-peso"
                    etiqueta="Peso"
                    ayuda={
                      pidePesoYDtd(sis)
                        ? `${CORTOS[sis!]} lo pide para iniciar el automático`
                        : "Para comprobar la indicación"
                    }
                    unidad="kg"
                    valor={d.peso}
                    onChange={(v) => set({ peso: v })}
                    max={LIMITES.peso}
                  />
                </div>
              </div>
            )}
            {(ev.calcula.basal || ev.calcula.ratioFactor || pideObjetivo) && (
              <div className="grid gap-3 sm:grid-cols-3">
                {ev.calcula.basal && (
                  <Opciones
                    etiqueta="Basal, % de la DTD"
                    opciones={[40, 45, 50].map((v) => ({ v, t: `${v} %` }))}
                    valor={d.basalPct}
                    onChange={(v) => set({ basalPct: v })}
                  />
                )}
                {ev.calcula.ratioFactor && (
                  <Opciones
                    etiqueta="Factor de sensibilidad"
                    marca={<Marca modificado={d.tocado.regla} />}
                    opciones={[
                      { v: 1700 as const, t: "Regla del 1700" },
                      { v: 1800 as const, t: "Regla del 1800" },
                    ]}
                    valor={d.regla}
                    onChange={(v) => set({ regla: v, tocado: { ...d.tocado, regla: true } })}
                  />
                )}
                {pideObjetivo && (
                  <Opciones
                    etiqueta="Objetivo del calculador de bolos manual"
                    marca={<Marca modificado={d.tocado.objetivo} />}
                    opciones={OBJETIVOS_CALCULADOR.map((o) => ({
                      v: o.mgdl,
                      t: (
                        <span>
                          {o.mgdl} mg/dl
                          <span className="block text-[11px] font-normal opacity-80">
                            {o.texto}
                          </span>
                        </span>
                      ),
                    }))}
                    valor={d.objetivo}
                    onChange={(v) => set({ objetivo: v, tocado: { ...d.tocado, objetivo: true } })}
                  />
                )}
              </div>
            )}
          </Paso>
        </div>
        <div
          ref={resultados}
          className="min-w-0 scroll-mt-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto"
        >
          <Paso n={4} titulo="Parámetros de partida">
            <Anuncio
              texto={
                ev.indicacion.fuera.length > 0 && sis !== undefined
                  ? "Fuera de la indicación: no hay propuesta."
                  : ev.errores.length
                    ? ev.errores.join(". ")
                    : resumen.length
                      ? `Parámetros de partida: ${resumen.join(", ")}.`
                      : ""
              }
            />
            <Estado ev={ev} sis={sis} />
            {ev.lista && (ev.calcula.basal || ev.calcula.ratioFactor) && (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-2">
                <Cifra
                  titulo="DTD de inicio"
                  valor={coma(redondea(ev.dtdInicio!, 1))}
                  unidad="UI/día"
                  cuenta={
                    mdi
                      ? `${coma(redondea(ev.dtdPrevia!, 1))} UI − ${d.reduccion} %`
                      : `${coma(redondea(ev.dtdPrevia!, 1))} UI (sin reducción)`
                  }
                  regla={mdi ? "Reducción respecto a MDI" : `DTD ${previa}`}
                  color={color}
                />
                {ev.calcula.basal && (
                  <Cifra
                    titulo="Tasa basal"
                    valor={`≈ ${coma(redondea(ev.basalHora!, 2))}`}
                    unidad="UI/h"
                    cuenta={`${d.basalPct} % = ${coma(redondea(ev.basalDia!, 1))} UI/día ÷ 24 h (redondeado)`}
                    regla="Basal plana; o individualizar según MCG"
                    color={color}
                  />
                )}
                {ev.calcula.ratioFactor && (
                  <>
                    <Cifra
                      titulo="Ratio I/HC"
                      valor={coma(redondea(ev.ratio!, 1))}
                      unidad="g por 1 UI"
                      cuenta={`450 ÷ ${coma(redondea(ev.dtdInicio!, 1))}`}
                      regla="Regla del 450"
                      color={color}
                    />
                    <Cifra
                      titulo="Factor de sensibilidad"
                      valor={String(Math.round(ev.factor!))}
                      unidad="mg/dl por 1 UI"
                      cuenta={`${d.regla} ÷ ${coma(redondea(ev.dtdInicio!, 1))}`}
                      regla={`Regla del ${d.regla}`}
                      color={color}
                    />
                  </>
                )}
              </div>
            )}
            {ev.lista && !ev.calcula.basal && !ev.calcula.ratioFactor && (
              <p
                className="rounded-lg px-3 py-2 text-sm text-slate-800"
                style={{ background: "#f1f5f9" }}
              >
                Se traslada la programación {previa}: no hay nada que calcular.
              </p>
            )}
            {ev.lista && ev.calcula.ratioFactor && (
              <p className="text-xs text-slate-600">
                Las reglas se aplican a la DTD de inicio, la misma con la que se calcula la basal.
              </p>
            )}
            <p className="text-xs text-slate-500">
              Solo se comparan la DTD y el peso con la indicación del sistema; la edad, la
              gestación, la variante del sistema y la experiencia previa, no.
            </p>
            {pideObjetivo && (
              <p className="text-xs text-slate-600">
                Objetivo del calculador de bolos manual: <strong>{d.objetivo} mg/dl</strong>.{" "}
                {REGLAS.objetivo.nota.replace(" (v. Tabla 1)", "")}.
              </p>
            )}
            {mdi && d.ultralarga && (
              <p
                role="note"
                className="flex gap-2 rounded-lg border px-3 py-2 text-sm text-amber-900"
                style={{ borderColor: "#f3d38a", background: "#fffbeb" }}
              >
                <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {REGLAS.solapamiento.texto}. {REGLAS.solapamiento.nota}.
                </span>
              </p>
            )}
          </Paso>
        </div>
      </div>
      <Paso n={5} titulo={sis !== undefined ? `Qué programar en ${CORTOS[sis]}` : "Qué programar"}>
        {sis === undefined ? (
          <p className="text-sm text-slate-600">Elige el sistema en el paso 2.</p>
        ) : (
          <div
            className="overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: "#e2e8f0", borderTopColor: h!.strong, borderTopWidth: 4 }}
          >
            <p
              className="px-3 py-2 text-sm font-semibold"
              style={{ background: h!.soft, color: h!.ink }}
            >
              {INICIALIZACION[sis].previo.charAt(0).toUpperCase() +
                INICIALIZACION[sis].previo.slice(1)}
              .
            </p>
            {!ev.lista && (
              <p
                className="border-t px-3 py-2 text-sm font-semibold text-slate-700"
                style={{ borderColor: "#eceff3", background: "#f8fafc" }}
              >
                {ev.indicacion.fuera.length
                  ? "Sin propuesta: hay un dato fuera de la indicación (paso 4)."
                  : "Sin cifras hasta completar los datos del paso 3."}{" "}
                Debajo, qué hace cada parámetro.
              </p>
            )}
            <Lista
              titulo="Lo que cuenta en el modo automático o para iniciarlo"
              nota="Efecto directo sobre el algoritmo, o lo que el sistema necesita para iniciar el modo automático"
              claves={gruposDeProgramar(sis).automatico}
              sis={sis}
              valorDe={valorDe}
              color={h!.strong}
              destacado
            />
            <div className="border-t" style={{ borderColor: "#eceff3" }}>
              <div
                className="flex items-center gap-1.5 px-3 pt-2 text-[11px] font-bold uppercase tracking-wide"
                style={{ color: h!.ink }}
              >
                <Moon size={13} aria-hidden="true" /> Modos y funciones de {CORTOS[sis]}
              </div>
              <ul className="divide-y" style={{ borderColor: "#eceff3" }}>
                {modosDe(sis).map((m, i) => {
                  const I = [Target, Activity, Moon, Utensils][i] ?? Moon;
                  return (
                    <li key={m.situacion} className="flex gap-2.5 px-3 py-2">
                      <I
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{ color: h!.strong }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-600">{m.situacion}</div>
                        <div className="text-sm text-slate-900">
                          <Lineas>{m.texto}</Lineas>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Lista
              titulo="Sobre todo en los bolos y el modo manual"
              claves={gruposDeProgramar(sis).manual}
              sis={sis}
              valorDe={valorDe}
              color="#94a3b8"
            />
            <div className="border-t px-3 py-2" style={{ borderColor: "#eceff3" }}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <RefreshCw size={13} aria-hidden="true" /> Qué esperar del algoritmo
              </div>
              <p className="mt-0.5 text-sm text-slate-800">{aprendizajeDe(sis)}</p>
              {sis === COLUMNA_DE_NOTA["T1/3"] && (
                <p className="mt-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600">
                  {NOTAS_POR_PASAJE["T1/3"]}
                </p>
              )}
            </div>
            <p
              className="border-t px-3 py-2 text-xs text-slate-600"
              style={{ borderColor: "#eceff3" }}
            >
              {NUCLEO_COMUN.texto}.{" "}
              <a
                href={href("sistemas", ORDEN_SISTEMAS[sis], "parametros")}
                className="font-semibold underline"
              >
                Qué hace cada parámetro en {CORTOS[sis]}
              </a>
            </p>
          </div>
        )}
      </Paso>

      {sis !== undefined && (
        <Paso n={6} titulo={`Material de ${CORTOS[sis]}`}>
          <dl
            className="divide-y overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: "#e2e8f0" }}
          >
            {materialDe(sis).map((m) => (
              <div key={m.rotulo} className="px-3 py-2">
                <dt className="text-xs font-semibold text-slate-600">{m.rotulo}</dt>
                <dd className="text-sm font-semibold text-slate-900">
                  <Lineas>{m.texto}</Lineas>
                  {m.rotulo === "Formato" && <SetsDeInfusion sis={sis} />}
                </dd>
              </div>
            ))}
            <div className="px-3 py-2">
              <dt className="text-xs font-semibold text-slate-600">
                Recambios que hay que tener siempre (plan de seguridad)
              </dt>
              <dd className="text-sm text-slate-900">{RECAMBIOS.plan}</dd>
            </div>
          </dl>
        </Paso>
      )}

      <div
        className="flex gap-2 rounded-xl border px-3 py-2.5 text-sm text-slate-800"
        style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
      >
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
        <span>
          <strong>Antes del inicio:</strong>{" "}
          {REGLAS.respaldo.texto.charAt(0).toLowerCase() + REGLAS.respaldo.texto.slice(1)}.{" "}
          <a href={ruta("inicio", "respaldo")} className="font-semibold underline">
            Plan de respaldo
          </a>
        </span>
      </div>
      <div className="space-y-1 text-xs text-slate-600">
        <p>{REGLAS.partida}</p>
        <p>
          Ayuda de cálculo orientativa: aplica a los datos introducidos las reglas del capítulo y
          unos puntos de partida decididos por el responsable del complemento; la pauta la decide el
          profesional. Nada de lo escrito se guarda ni se envía.
        </p>
      </div>
      <FuentePie fuentes={fuentes} />
    </div>
  );
}

function Lista({
  titulo,
  nota,
  claves,
  sis,
  valorDe,
  color,
  destacado = false,
}: {
  titulo: string;
  nota?: string;
  claves: Clave[];
  sis: number;
  valorDe: (k: Clave, c: number) => ReactNode;
  color: string;
  /* Lo que cuenta en automático: con el color del sistema y el rayo. */
  destacado?: boolean;
}) {
  return (
    <div className="border-t" style={{ borderColor: "#eceff3" }}>
      <div
        className="flex items-center gap-1.5 px-3 pt-2 text-[11px] font-bold uppercase tracking-wide"
        style={{ color: destacado ? color : "#64748b" }}
      >
        {destacado ? (
          <Zap size={13} aria-hidden="true" />
        ) : (
          <SlidersHorizontal size={13} aria-hidden="true" />
        )}
        {titulo}
      </div>
      {nota && <div className="px-3 text-xs text-slate-500">{nota}</div>}
      <ul className="divide-y" style={{ borderColor: "#eceff3" }}>
        {claves.map((k) => {
          const papel = k === "ia" || k === "objetivoAlg" ? null : papelEnAutomatico(k, sis);
          return (
            <li
              key={k}
              className="flex gap-2.5 px-3 py-2"
              style={destacado ? { boxShadow: `inset 3px 0 0 0 ${color}` } : undefined}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: color }}
              />
              <div className="min-w-0">
                <div className="text-sm text-slate-700">{NOMBRE_CLAVE[k]}</div>
                <div className="text-sm font-bold text-slate-900">{valorDe(k, sis)}</div>
                {papel && <div className="mt-0.5 text-xs text-slate-500">{papel}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* «Falta: DTD actual, peso»: en minúscula, salvo las siglas. */
const enMinuscula = (x: string) =>
  /^[A-ZÁÉÍÓÚ]{2}/.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1);

/* Sets de infusión de cada sistema (14-10-2026, a petición del responsable): plegados bajo el
   formato. NO es texto del capítulo: datos de ficha técnica de los fabricantes recogidos en el
   proyecto asistente-aid (ampliacion/datos.ts, 2-10-2026), rotulados como complementarios. */
const cifras = (xs: number[], u: string) =>
  `${xs
    .map((x) => String(x).replace(".", ","))
    .join(xs.length > 2 ? ", " : " o ")
    .replace(/, ([^,]*)$/, " o $1")} ${u}`;
function SetsDeInfusion({ sis }: { sis: number }) {
  const sets = SETS_INFUSION[ORDEN_SISTEMAS[sis]] ?? [];
  if (!sets.length) return null;
  return (
    <details
      className="mt-1.5 rounded-lg border bg-slate-50 font-normal"
      style={{ borderColor: "#e2e8f0" }}
    >
      <summary className="tap-44 flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-sm font-semibold text-slate-800">
        Sets de infusión ({sets.length})
      </summary>
      <ul className="space-y-1.5 border-t px-2.5 py-2" style={{ borderColor: "#e2e8f0" }}>
        {sets.map((x) => (
          <li key={x.name} className="text-sm">
            <span className="font-semibold text-slate-900">{x.name}</span>
            <span className="block text-xs leading-snug text-slate-600">
              {x.material} · {x.angle} · cánula de {cifras(x.cannula, "mm")} · tubo de{" "}
              {cifras(x.tubing, "cm")} · {x.insertion.toLowerCase()} ·{" "}
              {x.change >= 7 ? `hasta ${x.change} días` : `cambio habitual cada ${x.change} días`}
            </span>
          </li>
        ))}
      </ul>
      <p
        className="border-t px-2.5 py-1.5 text-xs text-slate-600"
        style={{ borderColor: "#e2e8f0" }}
      >
        Información complementaria (no es texto del capítulo): fichas técnicas de los fabricantes,
        recogidas el 2-10-2026. La oferta disponible depende del proveedor.
      </p>
    </details>
  );
}
