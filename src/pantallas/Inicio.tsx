/* Recorrido «Iniciación del sistema» (#/consultar/inicio/<fase>[:<sistema>][:<tarea>]): el apartado 8
   en sus cuatro fases, cada una como una lista corta de tareas desplegables (inicio.ts, TAREAS),
   con el sistema elegido o los cuatro, y la hoja de comprobación como herramienta del recorrido.
   El contenido sale de inicio.ts (referencias al texto literal); aquí solo se pinta. */
import { useEffect, useRef, useState } from "react";
import { useImprimirConTeclado } from "../imprimirConTeclado";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Printer,
  RotateCcw,
} from "lucide-react";
import { CalculadoraInicio, CambioDeSistema } from "../componentes/CalculadoraInicio";
import {
  cambiarCalculadora,
  cambiarHechos,
  cambiarRespuestas,
  useHayTrabajo,
  nuevoTrabajo,
  useTrabajo,
} from "../trabajo-inicio";
import {
  PASOS_GUIA,
  limpiarRespuestas,
  pasoDeRuta,
  pasoPropioDe,
  piezasDePaso,
  preguntasActivas,
  seEnsenaEnPaso,
  sinObjetivoRepetido,
} from "../guia-inicio";
import { SistemaDelRecorrido } from "../componentes/piezasContexto";
import { TABLAS } from "../contenido";
import { CORTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { SIS_IDS } from "../situaciones";
import { elegirRuta, href } from "../rutas";
import { imprimirRegion } from "../imprimir";
import { CabeceraEditorial } from "../ui";
import { pestanaALaVista } from "../disposicion";
import { useIrAlCambiar } from "../irAlCambiar";
import { CAPITULO } from "../contenido";
import { VERSION_APP } from "../version";
import { Lineas } from "../texto";
import { NOMBRE_CLAVE, coma, evaluar, gruposDeProgramar, redondea } from "../calculadora";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { PiezaVista } from "../componentes/Piezas";
import { CATEGORIA_HEX } from "../tokens";
import {
  FASES,
  hojaDeComprobacion,
  piezasSueltas,
  tareaDePieza,
  tareasDe,
  siglasPorPiezas,
  type Fase,
  type Pieza,
  type Tarea,
} from "../inicio";
import { fuentesDePiezas } from "../fuentesPiezas";
import { FuentePie } from "../componentes/FuentePie";
import { PARAMETROS } from "../fichaOperativa";
import { VeaseTambien } from "../componentes/VeaseTambien";

const hex = CATEGORIA_HEX.consultar;
/* 1.0.14 (25.ª ronda, R5): el nombre de la app («Control-IQ / Control-IQ+»), como la calculadora y
   el plan (antes, «Tandem Control-IQ», el de la Tabla 1). */
const NOMBRES = CORTO_SISTEMA;
/* En los botones, el nombre corto (el largo se cortaba en el móvil). */
const CORTOS = ["MiniMed 780G", "Control-IQ / Control-IQ+", "CamAPS FX", "Omnipod 5"];
/* Rótulo corto de cada paso de una fase, bajo su número en el móvil (1.0.13). */
const CORTO_PASO: Record<string, string> = {
  transicion: "Pauta",
  parametros: "Parámetros",
  objetivos: "Objetivos",
  respaldo: "Respaldo",
  arranque: "Activación",
};
const HOJA = "hoja";
const GUIA = "guia";
/* La calculadora de parámetros iniciales: lo primero al entrar (13-10-2026). */
const CALC = "calculadora";

const fuentesDeTarea = (fase: Fase, t: Tarea) =>
  fuentesDePiezas(t.piezas.map((i) => fase.piezas[i]));
const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* Lo elegido y lo marcado vive en el trabajo del inicio (trabajo-inicio.ts), con la
   calculadora: sobrevive a abrir una fuente y volver, y se va con «Nuevo inicio» o al recargar.
   No se guarda nada. */
/* Hoja de comprobación: una cara A4, casillas para marcar en papel (en pantalla se pueden
   marcar, pero no se guarda nada: ni datos del paciente ni de la consulta). */
/* La primera línea de la Tabla 3 («Objetivo glucémico y funciones temporales…») si dice que el
   objetivo no se configura. */
const objetivoFijo = (sis: number) => {
  const l = (TABLAS.T3.filas[0].celdas[sis] ?? "").split("\n")[0].trim();
  return /no configurable/i.test(l) ? l : null;
};

function Hoja({ sis }: { sis?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0.97.1 (17.ª ronda, visual): con Ctrl+P, la misma hoja de una cara que con el botón (antes, sin
  // marcar la región, salía la pantalla entera en dos caras).
  useImprimirConTeclado(ref);
  // Las casillas son las mismas que las de la guía: lo marcado allí sale marcado aquí (y al
  // revés), mientras dura la consulta. No se guarda nada.
  const { hechos, calc } = useTrabajo();
  // 0.72.0: las cifras de «Calcular» pasan a la hoja (las mismas, sin recalcular nada nuevo); sin
  // datos, líneas en blanco para escribirlas a mano. No se guarda nada.
  const ev = evaluar(sis, {
    origen: calc.origen,
    referencia: calc.referencia,
    basal: calc.basal,
    rapida: calc.rapida,
    dtd: calc.dtd,
    peso: calc.peso,
    reduccion: calc.reduccion,
    basalPct: calc.basalPct,
    regla: calc.regla,
  });
  const cifra = (v: number | null, d: number, unidad: string, previo = "") =>
    ev.lista && v !== null ? `${previo}${coma(redondea(v, d))} ${unidad}` : null;
  // 19-10-2026: también los datos de partida que ya están en la calculadora (pauta previa con la
  // reducción aplicada, peso y objetivo del calculador de bolos), con las mismas condiciones que
  // las cifras: solo con la propuesta lista.
  const mdi = calc.origen === "mdi";
  const pauta = !ev.lista
    ? null
    : mdi
      ? // 1.0.1 (19.ª ronda, R5): con la basal ultralarga, dicho (antes solo «MDI»).
        `MDI${calc.ultralarga ? " con glargina U-300 o degludec" : ""}, ${coma(redondea(ev.dtdPrevia!, 1))} UI/día; reducción del ${calc.reduccion} %`
      : [
          calc.origen === "isci"
            ? "Bomba de insulina"
            : `Otro sistema AID${calc.sistemaPrevio !== null ? ` (${CORTOS[calc.sistemaPrevio]})` : ""}`,
          ev.dtdPrevia !== null ? `, ${coma(redondea(ev.dtdPrevia, 1))} UI/día` : "",
          calc.referencia ? "; se traslada su programación" : "; programación no adecuada",
        ].join("");
  const peso = ev.lista && calc.peso.trim() ? `${calc.peso.trim().replace(".", ",")} kg` : null;
  const objetivo = !ev.lista
    ? null
    : mdi || calc.referencia === false
      ? `${calc.objetivo} mg/dl`
      : calc.origen === "isci"
        ? "El de la bomba actual"
        : "El del sistema actual";
  const datosPartida: [string, string | null][] = [
    ["Pauta previa", pauta],
    ["Peso", peso],
    ["Objetivo del calculador de bolos manual", objetivo],
  ];
  // 1.0.13 (25.ª ronda, R5): lo que se traslada, como en la calculadora («la del sistema actual»,
  // con «Revisar antes de trasladar» si en el actual no actúa en automático y en el de destino sí);
  // antes, «por rellenar» y sin el aviso.
  const deActual = calc.origen === "isci" ? "de la bomba actual" : "del sistema actual";
  const revisar = (r: string) => {
    if (calc.origen !== "aid" || calc.sistemaPrevio === null || sis === undefined) return "";
    const enDestino = PARAMETROS[sis].find((x) => x.r === r)?.auto;
    const enActual = PARAMETROS[calc.sistemaPrevio].find((x) => x.r === r)?.auto;
    return enDestino === "si" && !["si", "fijo"].includes(enActual ?? "")
      ? `. Revisar antes de trasladar: en ${CORTOS[calc.sistemaPrevio]} no actúa en automático`
      : "";
  };
  const trasladado = (articulo: "La" | "El", r: string) =>
    ev.lista ? `${articulo} ${deActual}${revisar(r)}` : null;
  const partida: [string, string | null][] = [
    ["DTD de inicio", cifra(ev.dtdInicio, 1, "UI/día")],
    [
      "Tasa basal",
      ev.calcula.basal
        ? cifra(ev.basalHora, 2, "UI/h", "≈ ")
        : trasladado("La", "Tasa basal programada"),
    ],
    [
      "Ratio I/HC",
      ev.calcula.ratioFactor
        ? cifra(ev.ratio, 1, "g por 1 UI")
        : mdi
          ? ev.lista
            ? "El de su pauta"
            : null
          : trasladado("El", "Ratio I/HC"),
    ],
    [
      "Factor de sensibilidad",
      ev.calcula.ratioFactor && ev.factor !== null && ev.lista
        ? `${Math.round(ev.factor)} mg/dl por 1 UI`
        : ev.calcula.ratioFactor
          ? null
          : mdi
            ? ev.lista
              ? "El de su pauta"
              : null
            : trasladado("El", "Factor de sensibilidad"),
    ],
  ];
  const marcar = (k: string) => {
    const s = new Set(hechos);
    if (s.has(k)) s.delete(k);
    else s.add(k);
    cambiarHechos(s);
  };
  const vaciar = () => cambiarHechos(new Set());
  const h = hojaDeComprobacion(sis);
  const sistema = sis !== undefined ? NOMBRES[sis] : "";
  const titulo = `Inicio de un sistema de asa cerrada${sistema ? ` · ${sistema}` : ""}`;
  return (
    <div>
      <div className="no-imprimir mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => imprimirRegion(() => ref.current)}
          className="boton-primario focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
        >
          <Printer size={15} aria-hidden="true" /> Imprimir la hoja
        </button>
        {sis !== undefined && (
          <a href={href("pacientes", "plan", ORDEN_SISTEMAS[sis])} className="chip">
            Plan de seguridad (hoja para el paciente) <ArrowRight size={13} aria-hidden="true" />
          </a>
        )}
        {hechos.size > 0 && (
          <button
            type="button"
            onClick={vaciar}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-700 underline underline-offset-2 sm:min-h-8"
          >
            Hoja en blanco
          </button>
        )}
      </div>
      <div ref={ref} className="hoja-inicio imprimible tarjeta p-4 sm:p-6">
        <h2 className="titulo-seccion">{titulo}</h2>
        <h3 className="rotulo mt-4" style={{ color: hex.ink }}>
          Antes de activar el modo automático
        </h3>
        <ul className="mt-1 space-y-1">
          {/* 1.0.1 (19.ª ronda, R5): la casilla de las basales ultralargas, solo si aplica (con la
              U-300 marcada, o sin datos en la calculadora: la hoja en blanco lleva todo). */}
          {h.antes
            .filter(
              (it) =>
                !(it.pieza?.t === "fila" && it.pieza.fila === 8) ||
                !ev.lista ||
                (mdi && calc.ultralarga),
            )
            .map((it) => (
              <li key={it.texto}>
                <label className="flex gap-2 text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={hechos.has(it.texto)}
                    onChange={() => marcar(it.texto)}
                    className="h-7 w-7 shrink-0 accent-[#8E254E]"
                  />
                  <span>{it.texto}</span>
                </label>
              </li>
            ))}
        </ul>
        {h.sistema && (
          <>
            <h3 className="rotulo mt-4" style={{ color: hex.ink }}>
              Qué se programa en {sistema}
            </h3>
            {/* 19-10-2026: los parámetros, con la misma separación que la calculadora (efecto
                directo / bolos o manual) en vez de la celda de la Tabla 1 con asteriscos. */}
            <dl className="mt-1 grid gap-2 sm:grid-cols-3">
              <div className="casilla p-2">
                <dt className="text-xs font-semibold text-slate-600">
                  {h.sistema.objetivo.etiqueta}
                </dt>
                <dd className="text-sm text-slate-800">
                  {/* 1.0.0 (18.ª ronda, R5): si la Tabla 3 dice que no se configura (Control-IQ),
                      aquí también (bajo «Qué se programa» parecía programable). 1.0.4 (20.ª
                      ronda, R5): primero, antes del rango. */}
                  {objetivoFijo(sis!) && (
                    <span className="mb-0.5 block font-semibold">{objetivoFijo(sis!)}</span>
                  )}
                  <Lineas>{h.sistema.objetivo.texto}</Lineas>
                </dd>
              </div>
              {(
                [
                  [
                    "Con efecto directo sobre el algoritmo o necesario para iniciar el modo automático",
                    gruposDeProgramar(sis!).automatico,
                  ],
                  ["Efecto principal en bolos o modo manual", gruposDeProgramar(sis!).manual],
                ] as const
              ).map(([etiqueta, claves]) => (
                <div key={etiqueta} className="casilla p-2">
                  <dt className="text-xs font-semibold text-slate-600">{etiqueta}</dt>
                  <dd className="text-sm text-slate-800">
                    {claves.map((k) => NOMBRE_CLAVE[k]).join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <h3 className="rotulo mt-4" style={{ color: hex.ink }}>
          Parámetros iniciales
        </h3>
        <dl className="mt-1 grid gap-2 sm:grid-cols-3">
          {datosPartida.map(([k, v]) => (
            <div key={k} className="casilla p-2">
              <dt className="text-xs font-semibold text-slate-600">{k}</dt>
              <dd className="mt-0.5 min-h-6 text-sm font-bold tabular-nums text-slate-900">
                {v ?? (
                  <span className="block h-5 border-b border-dashed border-slate-400">
                    <span className="sr-only">por rellenar</span>
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {partida.map(([k, v]) => (
            <div key={k} className="casilla p-2">
              <dt className="text-xs font-semibold text-slate-600">{k}</dt>
              <dd className="mt-0.5 min-h-6 text-sm font-bold tabular-nums text-slate-900">
                {v ?? (
                  <span className="block h-5 border-b border-dashed border-slate-400">
                    <span className="sr-only">por rellenar</span>
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <h3 className="rotulo mt-4" style={{ color: hex.ink }}>
          Seguimiento de los primeros 3 meses
        </h3>
        <p className="mt-1 text-sm text-slate-800">{h.seguimiento.texto}</p>
        <ul className="mt-1 grid gap-1 sm:grid-cols-2">
          {h.citas.map((c) => (
            <li key={c}>
              <label className="flex gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={hechos.has(c)}
                  onChange={() => marcar(c)}
                  className="h-7 w-7 shrink-0 accent-[#8E254E]"
                />
                <span>{c}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="fuente-pie separador mt-4 border-t pt-2">
          Hoja de comprobación del complemento interactivo del capítulo {CAPITULO.numero} (versión{" "}
          {VERSION_APP}); no es una publicación del Manual SEEN. Fuente: capítulo publicado el{" "}
          {CAPITULO.fechaFuente}, pp.{" "}
          {[...new Set([...h.antes.map((x) => x.pagina), h.seguimiento.pagina])]
            .sort((a, b) => a - b)
            .join(", ")}
          {h.sistema ? ", Tabla 1, pp. 3–4, y Tabla 3, p. 11" : ""}.
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

/* La lista del plan de seguridad (apartado 7, p. 7). */
const esPlanDeSeguridad = (p: Pieza) =>
  p.t === "lista" && p.apartado === "07-educacion" && p.bloque === "b4";
/* El rótulo de una pieza que se enlaza en vez de enseñarse: el de su fila de tabla (literal). */
const rotuloDePieza = (p: Pieza) =>
  p.t === "casilla" || p.t === "fila"
    ? TABLAS[p.tabla].filas[p.fila].etiqueta.split("\n")[0]
    : "Este pasaje";

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
    <section className="separador border-t" aria-labelledby={`${id}-t`}>
      <h3 id={`${id}-t`}>
        <button
          type="button"
          aria-expanded={abierta}
          aria-controls={id}
          onClick={onToggle}
          className="titulo-tarjeta flex min-h-12 w-full items-center justify-between gap-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
          <SistemaDelRecorrido.Provider value={sis}>
            <div className="divide-y">
              {tarea.piezas.map((i, k) => (
                <div key={i} id={`pieza-${i}`} className="py-2.5 first:pt-0 empty:hidden">
                  {fase.id === "preparacion" && esPlanDeSeguridad(fase.piezas[i]) ? (
                    // 0.96.0 (16.ª ronda, R5): la lista del plan de seguridad, una vez: en el paso
                    // de la fase Inicio en el que se entrega y se marca (antes de activar el modo
                    // automático); aquí, un enlace a él.
                    <a
                      href={href("consultar", "inicio", detalleDe("inicio", sis, "respaldo"))}
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
                    >
                      Contenido del plan de seguridad: en la fase Inicio, paso 4
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <PiezaVista pieza={fase.piezas[i]} sis={sis} compacta siglas={siglasDe[k]} />
                  )}
                </div>
              ))}
            </div>
          </SistemaDelRecorrido.Provider>
          <LineaFuente fuentes={fuentes} />
          {/* 0.92.0 (revisión de tarjetas, ★1): la misma lista de «Véase también» que en el resto. */}
          {siguiente && (
            <VeaseTambien enCaja nivel={4} filas={[{ href: siguiente.ruta, t: siguiente.texto }]} />
          )}
        </div>
      )}
    </section>
  );
}

/* Fuente de un bloque de piezas, en una línea. */
function LineaFuente({ fuentes }: { fuentes: { texto: string; ruta: string }[] }) {
  return <FuentePie fuentes={fuentes} className="mt-1" />;
}

/* La fase «Inicio del sistema», paso a paso y con la persona delante: cinco pasos en el orden en
   que se trabaja. Las preguntas eligen qué pasajes se enseñan; las casillas se marcan durante la
   consulta. Lo elegido y lo marcado vive en memoria mientras la app está abierta (guiaMemoria). */
function PasosInicio({
  sis,
  paso,
  onAntesDelPrimero,
  onTrasElUltimo,
}: {
  sis?: number;
  /* Índice del paso (0-4). */
  paso: number;
  onAntesDelPrimero: () => void;
  onTrasElUltimo: () => void;
}) {
  const n = Math.min(PASOS_GUIA.length, Math.max(1, paso + 1));
  const p = PASOS_GUIA[n - 1];
  const { resp, hechos, calc } = useTrabajo();
  const setResp = (r: Record<string, string>) => cambiarRespuestas(limpiarRespuestas(r));
  const setHechos = (f: (prev: Set<string>) => Set<string>) => cambiarHechos(f(hechos));
  const ir = (k: number) =>
    elegirRuta("consultar", "inicio", detalleDe("inicio", sis, PASOS_GUIA[k - 1].id));
  const alPaso = useIrAlCambiar(String(n), "paso-guia");
  const preguntas = preguntasActivas(p, resp);
  const piezas = sinObjetivoRepetido(piezasDePaso(p, resp), sis);
  const siglas = siglasPorPiezas(piezas, sis);
  const hoja = hojaDeComprobacion(sis);
  // 0.96.0 (16.ª ronda, R5): en el paso 4, lo que ya enseña otro paso (el núcleo común, la línea
  // de inicialización, el solapamiento con las basales ultralargas) no se repite: un enlace a su
  // paso. La hoja impresa («Hoja») sigue con todo.
  const enOtro = (x: (typeof hoja.antes)[number]) => {
    if (!x.pieza) return -1;
    const pieza = x.pieza;
    return PASOS_GUIA.findIndex((_, k) => k !== n - 1 && seEnsenaEnPaso(pieza, k, resp));
  };
  const lista =
    p.comprobar === "antes"
      ? hoja.antes.filter((x) => enOtro(x) < 0).map((x) => x.texto)
      : p.comprobar === "citas"
        ? hoja.citas
        : [];
  const pasosConElResto =
    p.comprobar === "antes"
      ? [...new Set(hoja.antes.map(enOtro).filter((k) => k >= 0))].sort((a, b) => a - b)
      : [];
  const enlace = p.enlace?.(sis, resp) ?? null;
  const enlaces = [...(p.masEnlaces?.(sis, resp) ?? []), ...(enlace ? [enlace] : [])];
  const marcar = (k: string) =>
    setHechos((prev) => {
      const s = new Set(prev);
      if (s.has(k)) s.delete(k);
      else s.add(k);
      return s;
    });
  return (
    <div id="paso-guia" className="scroll-mt-4">
      {/* En el móvil solo se ve el paso activo, con su título entero; una fila de números lleva a
          cualquier otro. 0.92.3 (15.ª ronda, R5): antes, un desplegable que repetía el paso activo
          recortado con «…». 0.96.0 (16.ª ronda, visual): la fila de números, primero y como las
          pestañas (subrayado sobre una línea capilar), no cinco cajas con la activa rellena. */}
      <ol
        className="separador no-imprimir mb-2 flex gap-1 border-b sm:hidden"
        aria-label="Ir al paso"
      >
        {PASOS_GUIA.map((x, i) => {
          const on = i === n - 1;
          return (
            <li key={x.id} className="min-w-11 flex-1">
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                aria-label={`Paso ${i + 1}: ${x.titulo}`}
                onClick={() => {
                  alPaso();
                  ir(i + 1);
                }}
                // 1.0.13 (25.ª ronda, R5): con un rótulo corto bajo el número (antes, solo «1 2 3 4 5»:
                // había que tocar para saber qué era cada paso).
                className="pestana -mb-px min-h-11 w-full flex-col justify-center gap-0 py-1 tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <span className="text-[15px] leading-tight">{i + 1}</span>
                <span aria-hidden="true" className="text-[11px] font-normal leading-tight">
                  {CORTO_PASO[x.id] ?? ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {/* 0.96.0 (16.ª ronda, visual): el paso activo, sin banda rellena: en el ordenador, subrayado
          como una pestaña; en el móvil, su título como texto (paso-tab, index.css). Menos burdeos
          apilado: la fase sigue marcada, el paso y su número ya no van rellenos. */}
      <ol
        className="mb-1 grid gap-1.5 sm:mb-3 sm:grid-cols-5 sm:gap-1 sm:border-b sm:border-[var(--linea)]"
        aria-label="Pasos de la fase"
      >
        {PASOS_GUIA.map((x, i) => {
          const on = i === n - 1;
          return (
            // 0.97.1 (17.ª ronda, visual y R5): en el móvil, el paso que no se ve, fuera de la rejilla
            // (con el botón oculto, el «li» vacío sumaba sus huecos: 54 px en blanco).
            <li key={x.id} className={`min-w-0 ${on ? "" : "max-sm:hidden"}`}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                aria-label={`${i + 1}. ${x.titulo}`}
                onClick={() => {
                  alPaso();
                  ir(i + 1);
                }}
                className={`chip paso-tab h-full w-full items-start px-2.5 py-1.5 text-[13px] leading-snug focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "" : "max-sm:hidden"}`}
              >
                <span className="num max-sm:hidden">{i + 1}</span>
                <span className="min-w-0">{x.titulo}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {/* 0.73.0: sin «Paso n de N» (lo dicen el selector y el número del título). 0.92.0
          (revisión de tarjetas, ★4 y ★7): el título del paso, solo para el lector de pantalla:
          repetía el paso marcado encima y su «2.» se confundía con el de la fase. */}
      <h3 id="guia-titulo" className="sr-only">
        {n}. {p.titulo}
      </h3>
      {p.intro && <p className="text-sm text-slate-600">{p.intro}</p>}
      {preguntas.map((q) => (
        <div key={q.id} className="preguntas-guia mt-3">
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
                  className="chip focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  {o.texto}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {/* 1.0.5 (21.ª ronda, R5): desde otro sistema de asa cerrada, el paso 1 quedaba casi vacío
          (lo demás va en el paso 2): el sistema actual y lo que cuenta en automático en uno y otro,
          como en la calculadora (el mismo dato compartido). */}
      {p.id === "transicion" && resp.pauta === "aid" && sis !== undefined && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="mb-1 text-sm font-semibold text-slate-800">Sistema actual</div>
            <CasillasSistema
              unico
              etiqueta="Sistema actual"
              seleccion={calc.sistemaPrevio !== null ? [calc.sistemaPrevio] : []}
              onToggle={(v) => cambiarCalculadora({ sistemaPrevio: v })}
              nombres={CORTOS}
              desactivado={sis}
            />
          </div>
          {calc.sistemaPrevio !== null && calc.sistemaPrevio !== sis && (
            // 1.0.10 (23.ª ronda, R5): solo el cuadro (la frase de debajo lo repetía; en la
            // calculadora se queda, junto a la pregunta de la programación: decisión del autor).
            <CambioDeSistema actual={calc.sistemaPrevio} destino={sis} />
          )}
        </div>
      )}
      {piezas.length > 0 && (
        <SistemaDelRecorrido.Provider value={sis}>
          <div className="mt-3 divide-y">
            {piezas.map((pz, k) => {
              // 0.96.0 (16.ª ronda, R5): la pieza que es propia de otro paso, como enlace a él.
              const otro = pasoPropioDe(pz, n - 1);
              return (
                <div key={k} className="py-3 first:pt-0 empty:hidden">
                  {otro ? (
                    <a
                      href={href(
                        "consultar",
                        "inicio",
                        detalleDe("inicio", sis, PASOS_GUIA[otro - 1].id),
                      )}
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
                    >
                      {rotuloDePieza(pz)}: en el paso {otro}
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <PiezaVista pieza={pz} sis={sis} compacta siglas={siglas[k]} />
                  )}
                </div>
              );
            })}
          </div>
        </SistemaDelRecorrido.Provider>
      )}
      {lista.length > 0 && (
        <ul className="casilla mt-3 space-y-1.5 p-3" aria-label="Para marcar en la consulta">
          {lista.map((x) => (
            <li key={x}>
              <label className="flex gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={hechos.has(x)}
                  onChange={() => marcar(x)}
                  className="h-6 w-6 shrink-0 accent-[#8E254E]"
                />
                <span>{x}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {pasosConElResto.length > 0 && (
        <p className="mt-2 text-sm text-slate-600">
          El resto de lo que debe quedar hecho antes de activar el modo automático, en su paso:{" "}
          {pasosConElResto.map((k, i) => (
            <span key={k}>
              {i > 0 && <span aria-hidden="true">{"\u00a0· "}</span>}
              <a
                href={href("consultar", "inicio", detalleDe("inicio", sis, PASOS_GUIA[k].id))}
                className="tap-44 inline-block min-h-6 py-0.5 font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
              >
                paso {k + 1}
              </a>
            </span>
          ))}
          .
        </p>
      )}
      <LineaFuente
        fuentes={[
          ...fuentesDePiezas(piezas.filter((pz) => !pasoPropioDe(pz, n - 1))),
          ...(p.comprobar === "antes"
            ? hoja.fuentesAntes
            : p.comprobar === "citas"
              ? hoja.fuentesCitas
              : []),
        ]}
      />
      {enlaces.length > 0 && (
        <VeaseTambien enCaja nivel={4} filas={enlaces.map((x) => ({ href: x.ruta, t: x.texto }))} />
      )}
      <div className="no-imprimir mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            alPaso();
            if (n === 1) onAntesDelPrimero();
            else ir(n - 1);
          }}
          className="chip focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <ChevronLeft size={14} aria-hidden="true" />
          {n === 1 ? "Fase anterior" : "Paso anterior"}
        </button>
        <button
          type="button"
          onClick={() => {
            alPaso();
            if (n === PASOS_GUIA.length) onTrasElUltimo();
            else ir(n + 1);
          }}
          className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          style={{ background: hex.strong }}
        >
          {n === PASOS_GUIA.length ? "Siguiente fase: 3 primeros meses" : "Siguiente paso"}{" "}
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function IniciarSistema({ detalle }: { detalle?: string }) {
  const conTrabajo = useHayTrabajo();
  const [faseId, sisId, tareaId] = (detalle ?? "").split(":");
  const sisIdx = sisId ? SIS_IDS.indexOf(sisId) : -1;
  const sis = sisIdx >= 0 ? sisIdx : undefined;
  // «guia» (la guía paso a paso de antes) es ahora la fase Inicio.
  const actual = FASES.some((f) => f.id === faseId)
    ? faseId
    : faseId === GUIA
      ? "inicio"
      : faseId === HOJA
        ? faseId
        : CALC;
  const enFases = FASES.some((f) => f.id === actual);
  // En la fase Inicio, el paso: por id, por número o por el aspecto antiguo («a3»).
  const pasoInicio =
    tareaId && /^a\d+$/.test(tareaId)
      ? pasoDeRuta(tareaDePieza("inicio", Number(tareaId.slice(1)))?.id)
      : pasoDeRuta(tareaId);
  // 0.80.1 (cuarta ronda, adjunto y R5): «calculadora:<destino>:desde-<origen>» (atajo del
  // buscador «de 780G a Control-IQ») deja marcados «Otro sistema AID» y el sistema actual.
  const desde =
    actual === CALC && tareaId?.startsWith("desde-") ? SIS_IDS.indexOf(tareaId.slice(6)) : -1;
  const desdeAid = actual === CALC && tareaId === "desde-aid";
  useEffect(() => {
    if (desde >= 0) cambiarCalculadora({ origen: "aid", sistemaPrevio: desde });
    else if (desdeAid) cambiarCalculadora({ origen: "aid" });
  }, [desde, desdeAid]);
  useEffect(() => {
    // La dirección antigua de la guía se reescribe a la de la fase.
    if (faseId === GUIA)
      elegirRuta(
        "consultar",
        "inicio",
        detalleDe("inicio", sis, PASOS_GUIA[pasoInicio].id) || undefined,
      );
  }, [faseId, sis, pasoInicio]);
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
  // 0.74.2 (petición del responsable: nada útil plegado): la fase entera, abierta de entrada.
  const [completa, setCompleta] = useState(true);
  useEffect(() => {
    const lista = tareasDe(actual);
    setAbiertas(
      new Set(
        completa
          ? lista.map((t) => t.id)
          : [pedida ?? lista[0]?.id].filter((x): x is string => !!x),
      ),
    );
    // Solo al cambiar de fase o con «Fase completa»/«Plegar»: abrir o cerrar una tarea (que
    // cambia `pedida` en la ruta) no vuelve a abrir ni cerrar las demás.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actual, completa]);
  const alternar = (id: string) => {
    const abrir = !abiertas.has(id);
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
      <CabeceraEditorial titulo="Iniciación del sistema" hex={hex} level={1} />

      {/* 0.72.0: las tres vistas en un solo control (la calculadora, las fases y la hoja para
          imprimir). */}
      <div className="no-imprimir mb-3 flex items-center justify-between gap-3">
        <div role="group" aria-label="Herramienta" className="pestanas gap-1">
          {(
            [
              { id: CALC, t: "Cálculo", on: actual === CALC },
              { id: FASES[0].id, t: "Fases", on: enFases },
              { id: HOJA, t: "Hoja", on: actual === HOJA },
            ] as const
          ).map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={x.on}
              aria-label={x.id === HOJA ? "Hoja de comprobación para imprimir" : undefined}
              onClick={() => (x.id === FASES[0].id && enFases ? undefined : ir(x.id))}
              onFocus={pestanaALaVista}
              className="pestana tap-44 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              {x.t}
            </button>
          ))}
        </div>
        {/* «Nuevo inicio» en la misma fila: aparece al escribir el primer dato sin mover nada. */}
        {conTrabajo && (
          <button
            type="button"
            onClick={() => {
              nuevoTrabajo();
              // 0.97.1 (17.ª ronda, R5): el foco, al primer paso (el botón desaparece al vaciar).
              setTimeout(() => {
                const h = document.getElementById("calc-paso-1");
                h?.focus({ preventScroll: true });
              }, 0);
            }}
            // 1.0.9 (22.ª ronda, R5; decisión del autor del 22-10-2026): vacía los datos y deja el
            // sistema elegido (otro paciente con el mismo sistema es lo habitual); se dice.
            aria-label="Nuevo inicio: vaciar los datos; el sistema elegido se mantiene"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-slate-700 hover:underline"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Nuevo inicio (vaciar datos, mismo sistema)</span>
            <span className="sm:hidden">Nuevo inicio</span>
          </button>
        )}
      </div>

      {actual !== CALC && (
        <div className="no-imprimir">
          <div className="rotulo mb-1">Sistema</div>
          <div className="mb-4">
            {/* 0.96.0 (16.ª ronda, visual): en el móvil, las cuatro en una fila (el texto del paso
                empieza antes). */}
            <CasillasSistema
              unico
              enFila
              cortoEnMovil
              seleccion={sis !== undefined ? [sis] : []}
              onToggle={(c) =>
                ir(
                  actual,
                  sis === c ? undefined : c,
                  actual === "inicio" ? PASOS_GUIA[pasoInicio].id : pedida,
                )
              }
              nombres={CORTOS}
            />
          </div>
        </div>
      )}

      {/* Las cuatro fases en su fila (la hoja y la calculadora van arriba, como herramientas). */}
      {enFases && (
        <div className="no-imprimir mb-4 flex flex-col gap-2 sm:flex-row sm:items-start">
          <ol
            // 0.97.1 (17.ª ronda, visual): la fase activa con borde y fondo suave (no rellena): el
            // burdeos lleno se apilaba con el selector de sistema y la fila de pasos.
            className="opciones-ligeras grid w-full grid-cols-2 gap-1.5 sm:flex-1 sm:grid-cols-4"
            aria-label="Fases"
          >
            {FASES.map((f, i) => {
              const on = f.id === actual;
              return (
                <li key={f.id} className="min-w-0">
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    onClick={() => ir(f.id)}
                    className="chip w-full px-2.5 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    <span className={`num ${on ? "num-on" : ""}`}>{i + 1}</span>
                    <span className="min-w-0">{f.corto}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* 0.92.3 (15.ª ronda, R5): en el móvil, bajo la cabecera pegada (el título de la fase nueva
          quedaba fuera de la pantalla). */}
      <div
        id="paso-inicio"
        tabIndex={-1}
        className="scroll-mt-20 focus:outline-none lg:scroll-mt-4"
      >
        {actual === CALC ? (
          <CalculadoraInicio sis={sis} onSistema={(c) => ir(CALC, sis === c ? undefined : c)} />
        ) : fase ? (
          <section
            key={actual}
            className="pantalla-in tarjeta px-4 pb-3 pt-4"
            aria-labelledby="fase-titulo"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 id="fase-titulo" className="titulo-seccion min-w-0 flex-1">
                {/* 1.0.4 (20.ª ronda, visual): el número, en gris (repite el de la fase marcada
                    encima; en burdeos se sumaba a las demás marcas). */}
                <span className="mr-2 tabular-nums text-slate-500">{n + 1}.</span>
                {capitalizar(fase.nombre)}
              </h2>
              {fase.id !== "inicio" && (
                <button
                  type="button"
                  aria-pressed={completa}
                  onClick={() => {
                    setCompleta(!completa);
                    if (completa) ir(actual, sis, null);
                  }}
                  className="no-imprimir inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-slate-700 underline underline-offset-2 sm:min-h-8"
                >
                  {completa ? "Plegar" : "Fase completa"}
                </button>
              )}
            </div>
            {fase.id === "inicio" && (
              <PasosInicio
                sis={sis}
                paso={pasoInicio}
                // 0.92.3 (15.ª ronda, R5): al cambiar de fase desde un paso, a su título.
                onAntesDelPrimero={() => {
                  alPaso();
                  ir(FASES[n - 1].id);
                }}
                onTrasElUltimo={() => {
                  alPaso();
                  ir(FASES[n + 1].id);
                }}
              />
            )}
            {fase.id !== "inicio" && (
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
            )}
            {fase.id !== "inicio" && piezasSueltas(fase).length > 0 && (
              <p className="separador mt-2 flex flex-wrap gap-x-4 border-t pt-2 text-sm">
                {piezasSueltas(fase).map((i) => (
                  <PiezaVista key={i} pieza={fase.piezas[i]} sis={sis} compacta />
                ))}
              </p>
            )}
          </section>
        ) : (
          <Hoja sis={sis} />
        )}
      </div>

      {fase && fase.id !== "inicio" && (
        <div className="no-imprimir mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={n === 0}
            onClick={() => {
              alPaso();
              ir(FASES[n - 1].id);
            }}
            className="chip disabled:opacity-40"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Fase anterior
          </button>
          <button
            type="button"
            onClick={() => {
              alPaso();
              ir(n === FASES.length - 1 ? HOJA : FASES[n + 1].id);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            style={{ background: hex.strong }}
          >
            {n === FASES.length - 1
              ? "Hoja de comprobación"
              : `Siguiente fase: ${FASES[n + 1].corto}`}{" "}
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
