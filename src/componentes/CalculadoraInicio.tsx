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
import { AlertTriangle, ArrowDown, Calculator } from "lucide-react";
import { Lineas } from "../texto";
import {
  RECAMBIOS,
  CONTROLES,
  DESDE_ISCI,
  INICIALIZACION,
  LIMITES,
  NOMBRE_CLAVE,
  NUCLEO_COMUN,
  OBJETIVOS_CALCULADOR,
  REGLAS,
  aprendizajeDe,
  coma,
  evaluar,
  gruposDeProgramar,
  indicacionDe,
  leerCifra,
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
import { ORDEN_SISTEMAS } from "../ampliacion/ids";
import { PARAMETROS, fuentesDeDatos } from "../fichaOperativa";
import { SETS_INFUSION } from "../ampliacion/datos";
import { SIS_IDS } from "../situaciones";
import { href } from "../rutas";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { FuentePie } from "./FuentePie";
import { CasillasSistema } from "./CasillasSistema";
import { sinCortes } from "../sinCortes";
import { cambiarCalculadora, useTrabajo } from "../trabajo-inicio";

const hex = CATEGORIA_HEX.consultar;
const CORTOS = ["MiniMed 780G", "Control-IQ / Control-IQ+", "CamAPS FX", "Omnipod 5"];
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
        className="titulo-seccion separador flex items-center gap-2 border-b pb-1.5"
      >
        <span className="num num-on">{n}</span>
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
  /* null: ninguna elegida. */
  valor: T | null;
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
              className="chip focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
          className="h-12 w-full min-w-0 rounded-md border bg-white px-3 text-lg tabular-nums text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
    <div className="tarjeta p-3">
      <div className="rotulo">{titulo}</div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tabular-nums" style={{ color }}>
          {valor}
        </span>
        <span className="text-sm font-semibold text-slate-600">{unidad}</span>
      </div>
      <div className="mt-0.5 text-xs tabular-nums text-slate-600">{sinCortes(cuenta)}</div>
      <div className="mt-1 text-xs text-slate-500">{regla}</div>
    </div>
  );
}

/* Lo que bloquea o deja pendiente la propuesta, siempre antes de las cifras (I61-03). */
function Estado({
  ev,
  sis,
  previos = [],
}: {
  ev: Evaluacion;
  sis?: number;
  /* 0.85.1 (novena ronda, R5): lo que falta elegir antes de las cifras (sistemas). */
  previos?: string[];
}) {
  const faltan = [...previos, ...ev.faltan];
  return (
    // 0.72.0 (4.1.3): sin regiones vivas aquí; lo anuncia un solo resumen, con calma (Anuncio).
    <div className="space-y-2">
      {ev.indicacion.fuera.length > 0 && sis !== undefined && (
        <div
          role="group"
          aria-label="Fuera de la indicación"
          className="rounded-md border-2 px-3 py-2 text-sm text-red-900"
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
          className="list-disc rounded-md border px-3 py-2 pl-7 text-sm font-semibold text-red-900"
          style={{ borderColor: "#fca5a5", background: "#fef2f2" }}
        >
          {ev.errores.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {faltan.length > 0 && (
        <p
          className="rounded-md border border-dashed px-3 py-3 text-center text-sm text-slate-700"
          style={{ borderColor: "#cbd5e1" }}
        >
          <Calculator size={18} className="mx-auto mb-1 text-slate-400" aria-hidden="true" />
          {faltan.length > 1 ? "Faltan" : "Falta"}: {faltan.map(enMinuscula).join(", ")}.
        </p>
      )}
      {ev.indicacion.variante && (
        <p
          role="note"
          className="flex gap-2 rounded-md border px-3 py-2 text-sm text-amber-900"
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
  // 0.90.1 (14.ª ronda, R5): si el destino pasa a ser el sistema actual, el actual queda sin
  // elegir (antes, marcado y desactivado a la vez, y la comparación desaparecía sin aviso).
  useEffect(() => {
    if (sis !== undefined && d.sistemaPrevio === sis) set({ sistemaPrevio: null });
  }, [sis, d.sistemaPrevio, set]);
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
  // 0.90.1 (14.ª ronda, R5 y visual): con el enlace al resultado a la vista, sin la barra
  // flotante (las mismas cifras dos veces, y la barra lo tapaba).
  const [enlaceVisible, setEnlaceVisible] = useState(false);
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
  const pideObjetivo = mdi || d.referencia === false;
  // Bomba u otro AID sin contestar si la programación previa es adecuada: nada se traslada ni se
  // calcula todavía.
  const pendiente = !mdi && d.referencia === null;
  // 19-10-2026: con un campo del formulario en uso, sin la barra flotante (en el móvil, con el
  // teclado abierto, tapaba el campo que se estaba escribiendo).
  const [editando, setEditando] = useState(false);
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
    if (pendiente && (k === "basal" || k === "factor" || k === "ratio" || k === "objetivo"))
      return sinPropuesta;
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
    { texto: "Tabla 1, pp. 3–4", ruta: rutaDeTabla("T1") },
    { texto: `Tabla 3, p. ${TABLAS.T3.paginas[0]}`, ruta: rutaDeTabla("T3") },
    // Los modos y funciones del paso 5 salen de la Tabla 4.
    {
      texto: `Tabla 4, pp. ${TABLAS.T4.paginas[0]}–${TABLAS.T4.paginas[1]}`,
      ruta: rutaDeTabla("T4"),
    },
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
    <div
      className="space-y-5"
      onFocus={(e) => setEditando(e.target.matches("input, select, textarea"))}
      onBlur={() => setEditando(false)}
    >
      {/* 0.72.0: hasta la pantalla ancha, mientras los parámetros de partida no están a la
          vista, una barra con sus cifras (las mismas); al tocarla, se va a ellos. */}
      {/* En un portal: la animación de entrada de la pantalla (transform) haría que «fixed» se
          quedara dentro de ella. */}
      {resumen.length > 0 &&
        !resultadosVisibles &&
        !enlaceVisible &&
        !editando &&
        createPortal(
          <button
            type="button"
            onClick={() => resultados.current?.scrollIntoView({ block: "start" })}
            className="resumen-calc no-imprimir fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold tabular-nums text-white shadow-xl lg:bottom-4 lg:left-[17rem] xl:hidden"
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
          <Paso n={1} titulo="Pauta previa">
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { v: "mdi", t: "MDI", dd: "Plumas: basal y rápida" },
                  { v: "isci", t: "Bomba de insulina", dd: "ISCI sin automatización" },
                  { v: "aid", t: "Otro sistema AID", dd: "Cambio de sistema" },
                ] as const
              ).map((o) => {
                const on = d.origen === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ origen: o.v })}
                    className="tarjeta flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 py-2.5 text-center transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    style={
                      on
                        ? { borderColor: hex.strong, boxShadow: `inset 0 0 0 1px ${hex.strong}` }
                        : undefined
                    }
                  >
                    <span className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                      {o.t}
                    </span>
                    <span className="text-xs leading-tight text-slate-600">{o.dd}</span>
                  </button>
                );
              })}
            </div>
          </Paso>

          {/* 0.84.1 (octava ronda, R5): desde otro AID, «Sistema de destino» (como en la caja
              que los compara): eran dos filas iguales y fáciles de confundir. */}
          <Paso n={2} titulo={d.origen === "aid" ? "Sistema de destino" : "Sistema"}>
            {/* 0.76: el mismo selector de sistema de toda la app. */}
            <CasillasSistema
              unico
              seleccion={sis !== undefined ? [sis] : []}
              onToggle={onSistema}
              nombres={CORTOS}
            />
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
                        : "Comprobación de la indicación"
                    }
                    unidad="kg"
                    valor={d.peso}
                    onChange={(v) => set({ peso: v })}
                    max={LIMITES.peso}
                  />
                </div>
                {/* 0.88.1 (duodécima ronda, R5): en el móvil, con los datos completos, el resultado a un
                    toque desde aquí (queda unos 950 px más abajo). */}
                {resumen.length > 0 && (
                  <IrAResultado
                    texto={`Parámetros iniciales: ${resumen.join(" · ")}`}
                    onIr={() => resultados.current?.scrollIntoView({ block: "start" })}
                    onVisible={setEnlaceVisible}
                  />
                )}
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
                    className="flex justify-between text-xs tabular-nums text-slate-500"
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
                    className="h-6 w-6 shrink-0 accent-[#8E254E]"
                  />
                  La basal previa es glargina U-300 o degludec
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {d.origen === "aid" && (
                  <>
                    {/* 0.83.1 (séptima ronda, adjunto y R5): el mismo selector que el del paso 2. */}
                    <div>
                      <div className="mb-1 text-sm font-semibold text-slate-800">
                        Sistema actual
                      </div>
                      <CasillasSistema
                        unico
                        etiqueta="Sistema actual"
                        seleccion={d.sistemaPrevio !== null ? [d.sistemaPrevio] : []}
                        onToggle={(v) => set({ sistemaPrevio: v })}
                        nombres={CORTOS}
                        desactivado={sis}
                      />
                    </div>
                    {d.sistemaPrevio !== null && sis !== undefined && d.sistemaPrevio !== sis ? (
                      <CambioDeSistema actual={d.sistemaPrevio} destino={sis} />
                    ) : (
                      <p className="text-xs text-slate-600">
                        Al cambiar de sistema, los parámetros que cuentan en automático no son los
                        mismos:{" "}
                        <a
                          href={href("sistemas", "todos", "parametros")}
                          className="font-semibold underline"
                        >
                          comparación de parámetros
                        </a>
                        .
                      </p>
                    )}
                  </>
                )}
                {d.origen === "aid" &&
                  d.sistemaPrevio !== null &&
                  sis !== undefined &&
                  d.sistemaPrevio !== sis && (
                    <PasanAAutomatico actual={d.sistemaPrevio} destino={sis} />
                  )}
                <Opciones
                  etiqueta={`¿Es adecuada la programación ${previa}?`}
                  opciones={[
                    { v: "si", t: "Sí: se traslada tal cual" },
                    { v: "no", t: "No es adecuada o no hay programación previa" },
                  ]}
                  valor={d.referencia === null ? null : d.referencia ? "si" : "no"}
                  onChange={(v) => set({ referencia: v === "si" })}
                />
                {d.referencia !== null && (
                  <p className="casilla px-3 py-2 text-sm text-slate-800">
                    {d.referencia
                      ? `${DESDE_ISCI.trasladar.charAt(0).toUpperCase()}${DESDE_ISCI.trasladar.slice(1)}.`
                      : `${DESDE_ISCI.sinReferencia.charAt(0).toUpperCase()}${DESDE_ISCI.sinReferencia.slice(1)}. ${DESDE_ISCI.basalPlana}.`}
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Campo
                    id="calc-dtd"
                    etiqueta="DTD actual"
                    ayuda={
                      d.referencia === false
                        ? "Para las reglas del 450 y del 1700"
                        : pidePesoYDtd(sis)
                          ? `${CORTOS[sis!]} la pide para iniciar el automático`
                          : "Comprobación de la indicación"
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
                        : "Comprobación de la indicación"
                    }
                    unidad="kg"
                    valor={d.peso}
                    onChange={(v) => set({ peso: v })}
                    max={LIMITES.peso}
                  />
                </div>
                {/* 0.88.1 (duodécima ronda, R5): en el móvil, con los datos completos, el resultado a un
                    toque desde aquí (queda unos 950 px más abajo). */}
                {resumen.length > 0 && (
                  <IrAResultado
                    texto={`Parámetros iniciales: ${resumen.join(" · ")}`}
                    onIr={() => resultados.current?.scrollIntoView({ block: "start" })}
                    onVisible={setEnlaceVisible}
                  />
                )}
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
                          <span className="block text-xs font-normal opacity-80">{o.texto}</span>
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
          className="min-w-0 scroll-mt-4 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto"
        >
          <Paso n={4} titulo="Parámetros iniciales">
            <Anuncio
              texto={
                ev.indicacion.fuera.length > 0 && sis !== undefined
                  ? "Fuera de la indicación: no hay propuesta."
                  : ev.errores.length
                    ? ev.errores.join(". ")
                    : resumen.length
                      ? `Parámetros iniciales: ${resumen.join(", ")}.`
                      : ""
              }
            />
            <Estado
              ev={ev}
              sis={sis}
              previos={[
                ...(sis === undefined
                  ? [d.origen === "aid" ? "Sistema de destino" : "Sistema"]
                  : []),
                ...(d.origen === "aid" && d.sistemaPrevio === null ? ["Sistema actual"] : []),
              ]}
            />
            {ev.lista && (ev.calcula.basal || ev.calcula.ratioFactor) && (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-2">
                <Cifra
                  titulo="DTD de inicio"
                  valor={coma(redondea(ev.dtdInicio!, 1))}
                  unidad="UI/día"
                  cuenta={
                    mdi
                      ? `${coma(redondea(ev.dtdPrevia!, 1))} UI − ${d.reduccion} %`
                      : `${coma(redondea(ev.dtdPrevia!, 1))} UI, DTD ${previa}`
                  }
                  // 0.91.1 (decisión del responsable, 21-10-2026): desde ISCI u otro AID, la DTD
                  // sin reducir, y por qué (la frase literal de la basal dice «DTD reducida»).
                  regla={
                    mdi
                      ? "Reducción respecto a MDI"
                      : "Sin reducción: el capítulo da la reducción del 10–20 % solo para el paso desde MDI"
                  }
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
              <p className="casilla px-3 py-2 text-sm text-slate-800">
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
                className="flex gap-2 rounded-md border px-3 py-2 text-sm text-amber-900"
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
      <Paso
        n={5}
        titulo={
          sis !== undefined ? `Programación inicial en ${CORTOS[sis]}` : "Programación inicial"
        }
      >
        {sis === undefined ? (
          <p className="text-sm text-slate-600">Sistema no seleccionado (paso 2).</p>
        ) : (
          <div
            className="tarjeta tarjeta-sistema overflow-hidden"
            style={{ ["--sis" as string]: h!.strong }}
          >
            <p className="px-3 py-2 text-sm font-semibold" style={{ color: h!.ink }}>
              {INICIALIZACION[sis].previo.charAt(0).toUpperCase() +
                INICIALIZACION[sis].previo.slice(1)}
              .
            </p>
            {!ev.lista && (
              <p className="separador border-t px-3 py-2 text-sm font-semibold text-slate-700">
                {ev.indicacion.fuera.length
                  ? "Sin propuesta: hay un dato fuera de la indicación (paso 4)."
                  : "Sin cifras hasta completar los datos del paso 3."}
              </p>
            )}
            <Lista
              titulo="Con efecto directo sobre el algoritmo o necesario para iniciar el modo automático"
              claves={gruposDeProgramar(sis).automatico}
              sis={sis}
              valorDe={valorDe}
              color={h!.strong}
              destacado
            />
            <div className="separador border-t">
              <div className="rotulo px-3 pt-2" style={{ color: h!.ink }}>
                Modos y funciones de {CORTOS[sis]}
              </div>
              <ul className="divide-y">
                {modosDe(sis).map((m) => {
                  return (
                    <li key={m.situacion} className="flex gap-2.5 px-3 py-2">
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
              titulo="Efecto principal en bolos o modo manual"
              claves={gruposDeProgramar(sis).manual}
              sis={sis}
              valorDe={valorDe}
              color="#94a3b8"
            />
            <div className="separador border-t px-3 py-2">
              <div className="rotulo">Adaptación posterior del algoritmo</div>
              <p className="mt-0.5 text-sm text-slate-800">{aprendizajeDe(sis)}</p>
              {sis === COLUMNA_DE_NOTA["T1/3"] && (
                <p className="mt-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600">
                  {NOTAS_POR_PASAJE["T1/3"]}
                </p>
              )}
            </div>
            <p className="separador border-t px-3 py-2 text-xs text-slate-600">
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

      {/* 0.77.1: el formato, los sensores y la plataforma ya están en Fases → Preparación; aquí,
          a la vista, solo los sets de infusión (petición del responsable del 14-10-2026) y los
          recambios del plan de seguridad. */}
      {sis !== undefined && (
        <Paso n={6} titulo={`Sets de infusión y recambios de ${CORTOS[sis]}`}>
          <div className="space-y-2">
            <SetsDeInfusion sis={sis} />
            <p className="text-sm text-slate-900">
              {/* 0.83.1 (séptima ronda, R5): sin «Recambios… Recambios». */}
              <span className="font-semibold">Tener siempre: </span>
              {RECAMBIOS.plan}
            </p>
          </div>
        </Paso>
      )}
      <div className="casilla flex gap-2 px-3 py-2.5 text-sm text-slate-800">
        <span>
          <strong>Requisitos previos al inicio:</strong>{" "}
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
      {/* Sitio para la barra de cifras: la última línea no queda debajo de ella. */}
      {resumen.length > 0 && <div aria-hidden="true" className="h-14 xl:hidden" />}
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
    <div className="separador border-t">
      <div className="rotulo px-3 pt-2" style={destacado ? { color } : undefined}>
        {titulo}
      </div>
      {nota && <div className="px-3 text-xs text-slate-500">{nota}</div>}
      <ul className="divide-y">
        {claves.map((k) => {
          const papel = k === "ia" || k === "objetivoAlg" ? null : papelEnAutomatico(k, sis);
          return (
            <li key={k} className="flex gap-2.5 px-3 py-2">
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

/* Cambio de sistema (19-10-2026): qué parámetros actúan en el modo automático en el sistema
   actual y en el de destino, de las fichas operativas (fichaOperativa.ts, Tablas 1 y 3). */
/* 0.91.1 (decisión del responsable, 21-10-2026): al cambiar de AID, los parámetros que no actúan
   en automático en el sistema actual y sí en el de destino (Tabla 1, asterisco): al trasladar la
   programación, pasan a usarse en automático. Solo el hecho, sin instrucción. */
const CON_ARTICULO: Record<string, string> = {
  "Objetivo glucémico": "el objetivo glucémico",
  "Tasa basal programada": "la tasa basal",
  "Ratio I/HC": "la ratio I/HC",
  "Factor de sensibilidad": "el factor de sensibilidad",
  "Duración de la insulina activa": "la duración de la insulina activa",
};
function PasanAAutomatico({ actual, destino }: { actual: number; destino: number }) {
  const nuevos = PARAMETROS[destino].filter(
    (d) => d.auto === "si" && PARAMETROS[actual].find((x) => x.r === d.r)?.auto !== "si",
  );
  if (!nuevos.length) return null;
  const nombres = nuevos.map((d) => CON_ARTICULO[d.r] ?? d.r.toLowerCase());
  const lista =
    nombres.length > 1
      ? `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
      : nombres[0];
  return (
    <p className="text-sm leading-snug text-slate-800">
      {sinCortes(
        `En ${CORTOS[actual]}, ${lista} no ${nuevos.length > 1 ? "actúan" : "actúa"} en automático; en ${CORTOS[destino]}, sí.`,
      )}
    </p>
  );
}

function CambioDeSistema({ actual, destino }: { actual: number; destino: number }) {
  const columnas = [
    { c: actual, rotulo: "Sistema actual" },
    { c: destino, rotulo: "Sistema de destino" },
  ].map((x) => ({ ...x, datos: PARAMETROS[x.c].filter((d) => d.auto === "si") }));
  return (
    <section aria-labelledby="calc-cambio" className="tarjeta overflow-hidden">
      <h3 id="calc-cambio" className="rotulo px-3 pt-2">
        Parámetros que actúan en el modo automático
      </h3>
      <div className="grid grid-cols-2">
        {columnas.map(({ c, rotulo, datos }, i) => (
          <div key={rotulo} className={`min-w-0 px-3 py-2 ${i ? "separador border-l" : ""}`}>
            <div className="text-xs text-slate-600">{rotulo}</div>
            <div className="text-sm font-bold" style={{ color: SISTEMA_HEX[c].ink }}>
              {CORTOS[c]}
            </div>
            <ul className="mt-1 space-y-1.5">
              {datos.map((d) => (
                <li key={d.r} className="text-sm">
                  <span className="block font-semibold text-slate-900">{d.r}</span>
                  <span className="block text-xs text-slate-600">{d.v}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <FuentePie
        fuentes={fuentesDeDatos(columnas.flatMap((x) => x.datos))}
        className="separador max-w-none border-t px-3 py-1.5"
      />
    </section>
  );
}

/* Sets de infusión de cada sistema (14-10-2026, a petición del responsable). NO es texto del
   capítulo: datos de ficha técnica de los fabricantes recogidos en el proyecto asistente-aid
   (ampliacion/datos.ts, 2-10-2026), rotulados como complementarios. 0.77.1: a la vista. */
const cifras = (xs: number[], u: string) =>
  `${xs
    .map((x) => String(x).replace(".", ","))
    .join(xs.length > 2 ? ", " : " o ")
    .replace(/, ([^,]*)$/, " o $1")} ${u}`;
function SetsDeInfusion({ sis }: { sis: number }) {
  const sets = SETS_INFUSION[ORDEN_SISTEMAS[sis]] ?? [];
  if (!sets.length) return null;
  return (
    <div className="casilla font-normal">
      <ul className="space-y-1.5 px-2.5 py-2">
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
      <p className="separador border-t px-2.5 py-1.5 text-xs text-slate-600">
        Información complementaria (no es texto del capítulo): fichas técnicas de los fabricantes,
        recogidas el 2-10-2026. La oferta disponible depende del proveedor.
      </p>
    </div>
  );
}

/* 0.88.1 (duodécima ronda, R5): en el móvil, con los datos completos, el resultado a un toque
   desde los campos (queda unos 950 px más abajo). 0.89.1 (13.ª ronda, R5): al aparecer, a la vista
   por encima de la barra inferior (si el campo del peso quedaba abajo, el enlace caía debajo). */
function IrAResultado({
  texto,
  onIr,
  onVisible,
}: {
  texto: string;
  onIr: () => void;
  onVisible: (v: boolean) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia?.("(max-width: 1279px)").matches) return;
    // Con el teclado abierto, el alto visible (visualViewport), no el de la ventana.
    const alto = window.visualViewport?.height ?? window.innerHeight;
    const libre = alto - 96;
    const abajo = el.getBoundingClientRect().bottom;
    if (abajo > libre) window.scrollBy({ top: abajo - libre + 8 });
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => onVisible(e.isIntersecting), {
      rootMargin: "0px 0px -80px 0px",
    });
    io.observe(el);
    return () => {
      io.disconnect();
      onVisible(false);
    };
  }, [onVisible]);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onIr}
      className="no-imprimir inline-flex min-h-11 items-center gap-1.5 text-left text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 xl:hidden"
    >
      {texto}
      <ArrowDown size={14} aria-hidden="true" className="shrink-0" />
    </button>
  );
}
