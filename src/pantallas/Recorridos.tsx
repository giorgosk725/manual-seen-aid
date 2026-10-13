/* Recorridos de consulta construidos solo con el texto del capítulo:
   - Situaciones: eliges una situación (filas de las Tablas 4 y 6) y, si procede, un
     sistema, y ves la celda exacta más los párrafos del capítulo que la desarrollan.
   - Revisar la descarga: la Tabla 5 paso a paso (8 pasos), con el patrón relacionado.
   - Interrupción del sistema: el subapartado «Interrupción del sistema y pauta alternativa»
     como línea de tiempo (muy breve · hasta 2-3 h · prolongada), con los párrafos literales. */
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Baby,
  BedDouble,
  Bike,
  BookOpen,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Dumbbell,
  HeartHandshake,
  Hospital,
  Magnet,
  Moon,
  Pill,
  Plane,
  Radiation,
  Radio,
  Scan,
  ScanLine,
  Scissors,
  ShieldCheck,
  Siren,
  Syringe,
  Table2,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Unplug,
  Users,
  UtensilsCrossed,
  WifiOff,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { APARTADOS, TABLAS, idDeBloque, type Bloque, rutaDeTabla } from "../contenido";
import {
  GUION,
  SIS_IDS,
  SITUACIONES,
  SITUACIONES_GUIA,
  ALIAS,
  casaFiltro,
  type Momento,
  type Situacion,
  type SituacionGuia,
} from "../situaciones";
import { PiezaVista } from "../componentes/Piezas";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { kDe, type Pieza } from "../inicio";

import { elegirRuta, fueNavegacionNueva, href } from "../rutas";
import { ComoInterpretar } from "../componentes/ComoInterpretar";
import { casoPorId } from "../casos";
import { CabeceraEditorial, Segmented } from "../ui";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { useIrAlCambiar } from "../irAlCambiar";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { FuentePie } from "../componentes/FuentePie";
import { paginasDe } from "../paginas";
import { fuentesDePiezas } from "../fuentesPiezas";
import { CON_CASOS } from "../edicion";

const hex = CATEGORIA_HEX.consultar;

/* ---------- Situación y sistema ---------- */

/* Las situaciones, por tema (no por la tabla de la que salen): las filas de las Tablas 4 y 6 y
   los subapartados del apartado 10 que no tienen tabla, juntos. Los nombres de los temas son de
   la app; cada entrada conserva su rótulo del capítulo y su página o tabla. */
type Extra = { t: string; fuente: string; ruta: string; alias?: string[] };
/* 0.63.0: cada entrada va en su tema por su id (no por palabras de su título: «Diálisis y
   enfermedad renal» caía en «enfermedad»); los subapartados del apartado 10 tienen ya su guía. */
const TEMAS_SITUACION: { t: string; ids: string[]; extras?: Extra[] }[] = [
  {
    t: "Ejercicio y comidas",
    ids: ["ejercicio-aerobico", "ejercicio-anaerobico", "comida-grasa"],
  },
  {
    t: "Noche, enfermedad e hiperglucemia",
    ids: [
      "sueno",
      "necesidad-transitoria",
      "hiperglucemia-puntual",
      "hiperglucemia-persistente",
      "enfermedad-intercurrente",
      "glucocorticoides",
    ],
    extras: [
      {
        t: "Hiperglucemia y cetonemia",
        fuente: "Figura 3",
        ruta: href("consultar", "figura-3"),
        alias: ["cetonas", "cetonemia", "bohb"],
      },
    ],
  },
  {
    t: "Incidencias del día a día",
    ids: [],
    extras: [
      {
        t: "Hipoglucemia en asa cerrada",
        fuente: "Apartado 7",
        ruta: href("visual", "hipoglucemia"),
        alias: ["hipo", "bajada", "hidratos"],
      },
      {
        t: "Bolo omitido o retrasado",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b20"),
        alias: ["olvido", "olvidado", "bolo"],
      },
      {
        t: "Lectura baja al dormir sobre el sensor (compresión)",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b23"),
        alias: ["falsa", "sensor", "discordancia", "compresion"],
      },
      {
        t: "Pérdida de señal y salidas del modo automático",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b22"),
        alias: ["bluetooth", "senal", "manual"],
      },
      {
        t: "Viajes y controles del aeropuerto",
        fuente: "Apartado 10",
        ruta: href("capitulo", "10-situaciones", "b43"),
        alias: ["viaje", "avion", "aeropuerto"],
      },
    ],
  },
  {
    t: "Exploraciones, cirugía e ingreso",
    ids: [
      "rm",
      "tc",
      "rx",
      "pet",
      "diatermia",
      "eco",
      "cirugia-corta",
      "cirugia-larga",
      "ingreso-hospitalario",
    ],
  },
  {
    t: "Interrupción del sistema",
    ids: [],
    extras: [
      {
        t: "Cuánto va a durar la interrupción y qué hacer",
        fuente: "p. 9",
        ruta: href("consultar", "interrupcion"),
        alias: ["desconectar", "desconexion", "quitar", "retirar"],
      },
    ],
  },
  {
    t: "Poblaciones y situaciones especiales",
    ids: ["gestacion", "adolescencia", "mayores", "dialisis"],
  },
];

/* Un icono por tema y por situación (13-10-2026): la lista se recorre de un vistazo. */
const ICONO_TEMA: Record<string, LucideIcon> = {
  "Ejercicio y comidas": Dumbbell,
  "Noche, enfermedad e hiperglucemia": Moon,
  "Exploraciones, cirugía e ingreso": Hospital,
  "Interrupción del sistema": Unplug,
  "Incidencias del día a día": AlertTriangle,
  "Poblaciones y situaciones especiales": Users,
};
const ICONO_SITUACION: Record<string, LucideIcon> = {
  "ejercicio-aerobico": Bike,
  "ejercicio-anaerobico": Dumbbell,
  "comida-grasa": UtensilsCrossed,
  sueno: Moon,
  "necesidad-transitoria": Thermometer,
  "hiperglucemia-puntual": TrendingUp,
  "hiperglucemia-persistente": AlertTriangle,
  rm: Magnet,
  tc: ScanLine,
  rx: Scan,
  pet: Radiation,
  diatermia: Zap,
  eco: Activity,
  "cirugia-corta": Scissors,
  "cirugia-larga": Scissors,
  "ingreso-hospitalario": BedDouble,
  gestacion: Baby,
  "enfermedad-intercurrente": Thermometer,
  glucocorticoides: Pill,
  dialisis: Activity,
  mayores: Users,
  adolescencia: Users,
};
const iconoDeTexto = (t: string): LucideIcon =>
  /^hipoglucemia/i.test(t)
    ? TrendingDown
    : /bolo omitido/i.test(t)
      ? Syringe
      : /compresión/i.test(t)
        ? BedDouble
        : /señal/i.test(t)
          ? WifiOff
          : /viajes/i.test(t)
            ? Plane
            : /cetonemia/i.test(t)
              ? Droplet
              : /enfermedad intercurrente/i.test(t)
                ? Thermometer
                : /glucocorticoide/i.test(t)
                  ? Pill
                  : /diálisis/i.test(t)
                    ? Activity
                    : /interrupción/i.test(t)
                      ? Unplug
                      : /adolescencia/i.test(t)
                        ? Users
                        : /mayor/i.test(t)
                          ? Users
                          : ArrowRight;

type SituacionLista = Situacion | SituacionGuia;
/* Situaciones con comprobaciones previas (su primer momento) antes de la conducta. */
const ANTES_DE_ACTUAR = ["ejercicio-aerobico", "ejercicio-anaerobico"];
const TODAS: SituacionLista[] = [...SITUACIONES, ...SITUACIONES_GUIA];

/* Los momentos de una situación: párrafos literales del capítulo. Un índice breve arriba, el
   primero abierto y los demás plegados («Abrir todos» para leer seguido), y la fuente una sola
   vez al pie, con sus enlaces exactos. */
const piezasDe = (m: Momento): Pieza[] =>
  [m, ...(m.mas ?? [])].map((x) => ({
    t: "frase",
    apartado: x.apartado,
    bloque: x.bloque,
    k: x.k ?? kDe(x.apartado, x.bloque),
  }));
/* La fuente de un momento: apartado y página de cada párrafo, con el enlace a ese párrafo. */
const fuentesDeMomento = (m: Momento) => fuentesDePiezas(piezasDe(m));
/* Los momentos abiertos de cada situación, en memoria mientras la app está abierta: abrir la
   fuente de un momento y volver lo encuentra abierto. No se guarda nada. */
const momentosMemoria = new Map<string, { abiertos: Set<number>; todos: boolean }>();
/* «m6» → 5 (índice); cualquier otra cosa, null. */
const indiceDeMomento = (m?: string) => {
  const n = m && /^m\d+$/.test(m) ? Number(m.slice(1)) - 1 : NaN;
  return Number.isInteger(n) && n >= 0 ? n : null;
};
function GuionVista({
  momentos,
  rotulo = "Lo que dice el capítulo, por momentos",
  clave,
  sistema,
  momento,
  desde = 0,
}: {
  momentos: Momento[];
  rotulo?: string;
  /* Los primeros momentos que ya van arriba (p. ej., las comprobaciones antes del ejercicio). */
  desde?: number;
  /* La situación: los momentos abiertos se recuerdan por situación. */
  clave: string;
  sistema?: string;
  /* Momento pedido en la ruta («m6»): se abre y, si se llega de nuevas, se lleva a la vista. */
  momento?: string;
}) {
  const pedido = indiceDeMomento(momento);
  const valido = pedido !== null && pedido < momentos.length ? pedido : null;
  const [estado, setEstado] = useState(() => {
    const m = momentosMemoria.get(clave);
    const abiertos = new Set(m?.abiertos ?? [valido ?? desde]);
    if (valido !== null) abiertos.add(valido);
    return { abiertos, todos: m?.todos ?? false };
  });
  const guardar = (e: { abiertos: Set<number>; todos: boolean }) => {
    momentosMemoria.set(clave, e);
    setEstado(e);
  };
  useEffect(() => {
    momentosMemoria.set(clave, estado);
    // Enlace o búsqueda que pide un momento: a la vista. Al volver atrás manda la Shell.
    if (valido !== null && fueNavegacionNueva())
      window.setTimeout(
        () => document.getElementById(`momento-${valido}`)?.scrollIntoView({ block: "start" }),
        60,
      );
    // Solo al montar: después, el momento lo cambia la propia persona.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // El momento consultado va en la ruta (sin apilar historial): sobrevive a la fuente y Atrás.
  const marcarEnRuta = (i: number | null) =>
    elegirRuta(
      "consultar",
      "situacion",
      [clave, sistema ?? "", i !== null ? `m${i + 1}` : ""].join(":").replace(/:+$/, ""),
    );
  const abierto = (i: number) => estado.todos || estado.abiertos.has(i);
  const alternar = (i: number) => {
    const abiertos = new Set(estado.abiertos);
    const abrir = !abierto(i);
    if (abrir) abiertos.add(i);
    else abiertos.delete(i);
    guardar({ abiertos, todos: estado.todos && abrir });
    marcarEnRuta(abrir ? i : null);
  };
  return (
    <section
      aria-label={rotulo}
      className="rounded-2xl border bg-white p-4"
      style={{ borderColor: "#e6e6e6" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          {rotulo}
        </h2>
        <button
          type="button"
          onClick={() => guardar({ abiertos: estado.abiertos, todos: !estado.todos })}
          className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-700 underline underline-offset-2 sm:min-h-6"
        >
          {estado.todos ? "Plegar" : "Abrir todos"}
        </button>
      </div>
      {/* Los momentos en orden, como una línea de tiempo: el número en su círculo y una raya
          que los une; el título abre el párrafo literal (13-10-2026: sin el índice repetido). */}
      <ol className="mt-2" aria-label="Momentos">
        {momentos.map((m, i) =>
          i < desde ? null : (
            <li
              key={`${m.bloque}-${i}`}
              id={`momento-${i}`}
              className="relative scroll-mt-24 pb-1 pl-10"
            >
              {i < momentos.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[13px] top-8 w-0.5"
                  style={{ background: "#e6dfe3" }}
                />
              )}
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold tabular-nums"
                style={
                  abierto(i)
                    ? { background: hex.strong, color: "#fff" }
                    : { background: hex.soft, color: hex.ink }
                }
              >
                {i + 1}
              </span>
              <h3>
                <button
                  type="button"
                  aria-expanded={abierto(i)}
                  onClick={() => alternar(i)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 py-1 text-left text-sm font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <span>
                    <span className="sr-only">{i + 1}. </span>
                    {m.rotulo}
                  </span>
                  <ChevronRight
                    size={15}
                    aria-hidden="true"
                    className={`shrink-0 text-slate-500 transition ${abierto(i) ? "rotate-90" : ""}`}
                  />
                </button>
              </h3>
              {abierto(i) && (
                <div className="space-y-2 pb-2">
                  {piezasDe(m).map((pz, k) => (
                    <PiezaVista key={k} pieza={pz} compacta />
                  ))}
                  {/* Una sola línea de fuente por momento, al párrafo exacto. */}
                  <p className="text-[13px] text-slate-500">
                    Fuente:{" "}
                    {fuentesDeMomento(m).map((f, k) => (
                      <span key={f.texto}>
                        {k > 0 && " · "}
                        <a
                          href={f.ruta}
                          onClick={() => marcarEnRuta(i)}
                          className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:underline sm:min-h-6"
                        >
                          {f.texto}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </li>
          ),
        )}
      </ol>
    </section>
  );
}

/* La situación elegida, arriba y una sola vez: su icono, su nombre y «Cambiar» (en el móvil). */
function CabeceraSituacion({
  id,
  rotulo,
  etiqueta,
  onCambiar,
}: {
  id: string;
  rotulo: string;
  etiqueta: string;
  onCambiar: () => void;
}) {
  const I = ICONO_SITUACION[id] ?? iconoDeTexto(etiqueta);
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border bg-white p-3"
      style={{ borderColor: "#e6e6e6", boxShadow: `inset 4px 0 0 0 ${hex.strong}` }}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: hex.soft }}
      >
        <I size={22} style={{ color: hex.strong }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          {rotulo}
        </div>
        <h2 className="text-base font-extrabold leading-snug text-slate-900 sm:text-lg">
          {etiqueta}
        </h2>
      </div>
      <button
        type="button"
        onClick={onCambiar}
        className="min-h-11 shrink-0 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-500 lg:hidden"
      >
        Cambiar
      </button>
    </div>
  );
}

/* «Para seguir»: la hoja para el paciente, los apartados y la tabla entera, en filas como las
   del mapa de la portada. */
function ParaSeguir({
  filas,
}: {
  filas: { href: string; t: string; I: LucideIcon; color?: string }[];
}) {
  return (
    <section
      aria-label="Para seguir"
      className="overflow-hidden rounded-md border bg-white"
      style={{ borderColor: "#e6e6e6" }}
    >
      <h2
        className="px-3 pb-0.5 pt-2 text-xs font-bold uppercase tracking-wide"
        style={{ color: hex.ink }}
      >
        Para seguir
      </h2>
      <ul className="divide-y" style={{ borderColor: "#eeeeee" }}>
        {filas.map((f) => (
          <li key={f.href}>
            <a
              href={f.href}
              className="flex min-h-11 items-center gap-3 px-3 py-1.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
            >
              <f.I
                size={16}
                className="shrink-0"
                style={{ color: f.color ?? hex.strong }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 font-semibold text-slate-900">{f.t}</span>
              <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListaSituaciones({
  sit,
  sistema,
  filtro = "",
  onLimpiar,
}: {
  sit: Situacion | null;
  sistema?: string;
  /* Texto escrito en «Filtrar»: las entradas cuyo nombre o alias casan (casaFiltro). */
  filtro?: string;
  onLimpiar?: () => void;
}) {
  const f = filtro.trim();
  const visibles = TEMAS_SITUACION.map((tema) => ({
    tema,
    sits: tema.ids
      .map((id) => TODAS.find((x) => x.id === id))
      .filter(
        (x): x is SituacionLista => !!x && casaFiltro(f, [x.etiqueta, ...(ALIAS[x.id] ?? [])]),
      ),
    extras: (tema.extras ?? []).filter((x) => casaFiltro(f, [x.t, ...(x.alias ?? [])])),
  }));
  const total = visibles.reduce((n, v) => n + v.sits.length + v.extras.length, 0);
  const fila =
    "flex min-h-12 w-full items-center gap-3 px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500";
  const Fila = ({
    I,
    texto,
    chip,
    on,
  }: {
    I: LucideIcon;
    texto: string;
    chip?: boolean;
    on?: boolean;
  }) => (
    <>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={on ? { background: "rgba(255,255,255,.18)" } : { background: hex.soft }}
      >
        <I size={16} style={{ color: on ? "#fff" : hex.strong }} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug">{texto}</span>
        {chip && (
          <span
            className={`mt-0.5 inline-block rounded-full px-1.5 text-[11px] font-bold ${on ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            Cambia según el sistema
          </span>
        )}
      </span>
      {on ? (
        <Check size={15} className="shrink-0" aria-hidden="true" />
      ) : (
        <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
      )}
    </>
  );
  return (
    <div id="lista-situaciones" className="scroll-mt-20 space-y-2">
      {f && (
        <p className="text-xs text-slate-600" aria-live="polite">
          {total === 1 ? "1 resultado" : `${total} resultados`}
        </p>
      )}
      {f && total === 0 && (
        <div
          className="rounded-md border border-dashed px-3 py-3 text-sm text-slate-700"
          style={{ borderColor: "#d4d4d4" }}
        >
          Ninguna situación coincide con «{f}».{" "}
          {onLimpiar && (
            <button
              type="button"
              onClick={onLimpiar}
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2 sm:min-h-6"
            >
              Borrar el filtro
            </button>
          )}
        </div>
      )}
      {visibles.map(({ tema, sits, extras }) => {
        if (!sits.length && !extras.length) return null;
        const IT = ICONO_TEMA[tema.t] ?? ArrowRight;
        return (
          <section
            key={tema.t}
            aria-label={tema.t}
            className="overflow-hidden rounded-md border bg-white"
            style={{ borderColor: "#e6e6e6" }}
          >
            <h2
              className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              <IT size={14} aria-hidden="true" />
              {tema.t}
            </h2>
            <ul className="divide-y" style={{ borderColor: "#eeeeee" }} role="list">
              {sits.map((s) => {
                const on = sit?.id === s.id;
                const porSis =
                  "tabla" in s &&
                  TABLAS[s.tabla].porSistema &&
                  !TABLAS[s.tabla].filas[s.fila]?.unida;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        elegirRuta(
                          "consultar",
                          "situacion",
                          on ? undefined : s.id + (sistema ? ":" + sistema : ""),
                        )
                      }
                      className={`${fila} ${on ? "text-white" : "text-slate-900 hover:bg-slate-50"}`}
                      style={on ? { background: hex.strong } : undefined}
                    >
                      <Fila
                        I={ICONO_SITUACION[s.id] ?? ArrowRight}
                        texto={s.etiqueta}
                        chip={porSis}
                        on={on}
                      />
                    </button>
                  </li>
                );
              })}
              {extras.map((x) => (
                <li key={x.ruta}>
                  <a href={x.ruta} className={`${fila} text-slate-900 hover:bg-slate-50`}>
                    <Fila I={iconoDeTexto(x.t)} texto={x.t} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function SituacionSistema({
  situacion,
  sistema,
  momento,
}: {
  situacion?: string;
  sistema?: string;
  momento?: string;
}) {
  const [filtro, setFiltro] = useState("");
  const sit = SITUACIONES.find((s) => s.id === situacion) || null;
  const guia = SITUACIONES_GUIA.find((s) => s.id === situacion) || null;
  // En el móvil, con una situación elegida el catálogo se pliega; «Cambiar» lo vuelve a abrir.
  const [verLista, setVerLista] = useState(false);
  useEffect(() => setVerLista(false), [situacion]);
  const cambiar = () => {
    setVerLista(true);
    window.setTimeout(
      () => document.getElementById("lista-situaciones")?.scrollIntoView({ block: "start" }),
      0,
    );
  };
  const sisIdx = sistema ? SIS_IDS.indexOf(sistema) : -1;
  const tabla = sit ? TABLAS[sit.tabla] : null;
  const fila = sit && tabla ? tabla.filas[sit.fila] : null;
  const porSistema = !!tabla?.porSistema && !fila?.unida;
  // Al elegir el sistema, su casilla a la vista (en el móvil quedaba bajo la barra inferior).
  // Con comprobaciones previas (ejercicio), al elegir el sistema se va a ellas, no a la conducta.
  const aLaCasilla = useIrAlCambiar(
    `${situacion}:${sistema}`,
    ANTES_DE_ACTUAR.includes(situacion ?? "") ? "antes-situacion" : "conducta-situacion",
    {
      bloque: "nearest",
      enfocar: false,
    },
  );
  return (
    <div>
      <CabeceraEditorial titulo="Situaciones" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Elige la situación; si la conducta cambia según el sistema, elige también el sistema.
        </p>
      </CabeceraEditorial>
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <div className={(sit || guia) && !verLista ? "hidden lg:block" : undefined}>
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            1 · Situación
          </div>
          <input
            type="search"
            aria-label="Filtrar situaciones"
            placeholder="Filtrar: resonancia, ejercicio, sueño…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mb-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-10"
          />
          <ListaSituaciones
            sit={sit}
            sistema={sistema}
            filtro={filtro}
            onLimpiar={() => setFiltro("")}
          />
        </div>
        <div aria-live="polite" className={sit || guia ? "order-first lg:order-none" : undefined}>
          {!sit && !guia && (
            <div
              className="hidden rounded-xl border lg:block border-dashed px-4 py-8 text-center text-sm text-slate-600"
              style={{ borderColor: "#d4d4d4", background: "#f8fafc" }}
            >
              Elige una situación de la lista.
            </div>
          )}
          {guia && (
            <div key={guia.id} className="pantalla-in space-y-4">
              <CabeceraSituacion
                id={guia.id}
                rotulo="Situación"
                etiqueta={guia.etiqueta}
                onCambiar={cambiar}
              />
              <p
                id="conducta-situacion"
                className="scroll-mb-28 scroll-mt-24 px-1 text-sm text-slate-700"
              >
                {guia.intro}
              </p>
              <GuionVista
                momentos={guia.guion}
                rotulo={guia.rotuloGuion}
                clave={guia.id}
                momento={momento}
              />
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Seguir en
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {guia.enlaces.map((l) => (
                    <li key={l.ruta}>
                      <a
                        href={l.ruta}
                        className="inline-flex min-h-11 items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400 sm:min-h-8"
                        style={{ borderColor: "#d4d4d4" }}
                      >
                        {l.texto} <ArrowRight size={12} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {sit && tabla && fila && (
            <div key={sit.id} className="pantalla-in space-y-4">
              <CabeceraSituacion
                id={sit.id}
                rotulo={tabla.cabeceraEtiqueta}
                etiqueta={sit.etiqueta}
                onCambiar={cambiar}
              />
              {/* En el ejercicio, las comprobaciones antes de empezar van antes de la conducta de
                  cada sistema (S61-01): pueden obligar a retrasar o a no hacer el ejercicio. */}
              {ANTES_DE_ACTUAR.includes(sit.id) && GUION[sit.id] && (
                <section
                  id="antes-situacion"
                  aria-label="Antes de actuar"
                  className="scroll-mt-24 rounded-2xl border-2 p-4"
                  style={{ borderColor: "#f3d38a", background: "#fffbeb" }}
                >
                  <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-900">
                    <AlertTriangle size={14} aria-hidden="true" /> Antes de actuar ·{" "}
                    {GUION[sit.id][0].rotulo}
                  </h2>
                  <div className="mt-2 space-y-2">
                    {piezasDe(GUION[sit.id][0]).map((pz, k) => (
                      <PiezaVista key={k} pieza={pz} compacta />
                    ))}
                  </div>
                  <FuentePie fuentes={fuentesDeMomento(GUION[sit.id][0])} />
                </section>
              )}
              <section
                id="conducta-situacion"
                className="scroll-mb-28 scroll-mt-24 space-y-3 rounded-2xl border bg-white p-4 shadow-soft"
                style={{ borderColor: "#e6e6e6" }}
                aria-label="Conducta recomendada"
              >
                {/* El rótulo de la fila ya está en la cabecera; aquí, lo común a los cuatro si lo trae. */}
                {(() => {
                  const comun = fila.etiqueta.split("\n").slice(1);
                  return (
                    <>
                      {(comun.length > 0 || fila.unida) && (
                        <div
                          className="rounded-xl border-l-4 px-3 py-2.5"
                          style={{ borderColor: hex.strong, background: hex.soft }}
                        >
                          <span
                            className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide"
                            style={{ color: hex.ink }}
                          >
                            Todos los sistemas
                          </span>
                          <span className="block text-[15px] font-semibold leading-snug text-slate-900">
                            <Lineas>{fila.unida ? fila.celdas[0] : comun.join("\n")}</Lineas>
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
                {porSistema && (
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {sisIdx >= 0 ? "Sistema" : "Por sistema · elige uno para ver solo el suyo"}
                    </div>
                    <CasillasSistema
                      seleccion={sisIdx >= 0 ? [sisIdx] : []}
                      onToggle={(c) => {
                        aLaCasilla();
                        elegirRuta(
                          "consultar",
                          "situacion",
                          sit.id + (sisIdx === c ? "" : ":" + SIS_IDS[c]),
                        );
                      }}
                    />
                  </div>
                )}
                {porSistema && (
                  <div className={sisIdx >= 0 ? "" : "grid gap-2 sm:grid-cols-2"}>
                    {tabla.columnas.map((nombre, c) =>
                      sisIdx >= 0 && c !== sisIdx ? null : (
                        <div
                          key={c}
                          className="overflow-hidden rounded-xl border border-t-4 bg-white"
                          style={{ borderColor: "#e6e6e6", borderTopColor: SISTEMA_HEX[c].strong }}
                        >
                          <div
                            className="flex items-center gap-2 px-3 py-1.5"
                            style={{ background: SISTEMA_HEX[c].soft }}
                          >
                            <img
                              src={FOTO_SISTEMA[ORDEN_SISTEMAS[c]]}
                              alt=""
                              className="h-7 w-7 shrink-0 rounded-md bg-white object-cover"
                            />
                            <span
                              className="text-sm font-extrabold"
                              style={{ color: SISTEMA_HEX[c].ink }}
                            >
                              {nombre}
                            </span>
                          </div>
                          <p
                            className={`px-3 py-2 text-slate-800 ${sisIdx >= 0 ? "text-base" : "text-[15px]"}`}
                          >
                            <Lineas>{fila.celdas[c]}</Lineas>
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                )}
                {porSistema && sisIdx >= 0 && (
                  <button
                    type="button"
                    onClick={() => elegirRuta("consultar", "situacion", sit.id)}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline underline-offset-2 sm:min-h-8"
                  >
                    Ver los cuatro sistemas
                  </button>
                )}
                {!porSistema && !fila.unida && (
                  <>
                    <dl className="grid gap-2 sm:grid-cols-2">
                      {tabla.columnas.map((nombre, c) => {
                        const I = c === 0 ? Box : Radio;
                        return (
                          <div
                            key={c}
                            className="rounded-xl border bg-white p-3"
                            style={{ borderColor: "#e6e6e6" }}
                          >
                            <dt
                              className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                              style={{ color: hex.ink }}
                            >
                              <I size={15} aria-hidden="true" style={{ color: hex.strong }} />
                              {nombre}
                            </dt>
                            <dd className="text-base text-slate-800">
                              <Lineas>{fila.celdas[c]}</Lineas>
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                    <p className="text-xs text-slate-600">
                      Conducta común a los cuatro sistemas: el capítulo no distingue entre sistemas.
                      Lo propio de cada uno está en su ficha de{" "}
                      <a href={href("sistemas")} className="font-semibold underline">
                        Sistemas
                      </a>
                      .
                    </p>
                  </>
                )}
                <FuentePie
                  className="mt-0"
                  fuentes={[
                    {
                      texto: `Tabla ${tabla.numero}, ${paginasDe(tabla.paginas[0], tabla.paginas[1])}`,
                      ruta: rutaDeTabla(sit.tabla),
                    },
                  ]}
                />
              </section>
              {GUION[sit.id] && (
                <GuionVista
                  momentos={GUION[sit.id]}
                  clave={sit.id}
                  sistema={sistema}
                  momento={momento}
                  desde={ANTES_DE_ACTUAR.includes(sit.id) ? 1 : 0}
                />
              )}
              <ParaSeguir
                filas={[
                  ...(sit.tabla === "T6" || sit.id.startsWith("hiperglucemia")
                    ? [
                        {
                          href: href(
                            "pacientes",
                            "hoja",
                            sit.tabla === "T6" ? "pruebas-cirugia" : "cetonas",
                          ),
                          t: `Hoja para entregar al paciente: ${sit.tabla === "T6" ? "pruebas y cirugía" : "cetonas"}`,
                          I: HeartHandshake,
                          color: CATEGORIA_HEX.pacientes.strong,
                        },
                      ]
                    : []),
                  ...sit.leer.map((l) => ({
                    href: href("capitulo", l.slug, l.ancla),
                    t: `En el capítulo: ${l.titulo}`,
                    I: BookOpen,
                    color: CATEGORIA_HEX.leer.strong,
                  })),
                  ...(sit.tabla === "T6" || sit.id.startsWith("ejercicio")
                    ? [
                        {
                          href: href("consultar", "interrupcion"),
                          t: "Interrupción del sistema: cuánto dura y qué hacer con la insulina",
                          I: Unplug,
                        },
                        {
                          href: href(
                            "pacientes",
                            "plan",
                            sisIdx >= 0 ? ORDEN_SISTEMAS[sisIdx] : undefined,
                          ),
                          t: `Plan de seguridad${sisIdx >= 0 ? ` · ${TABLAS.T1.columnas[sisIdx]}` : ""}`,
                          I: ShieldCheck,
                        },
                      ]
                    : []),
                  {
                    href: href("consultar", "tablas", sit.tabla),
                    t: `Tabla ${tabla.numero} completa`,
                    I: Table2,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Revisar la descarga (Tabla 5 paso a paso) ---------- */
const PATRON_DEL_PASO: Record<number, string[]> = {
  1: ["Salidas repetidas del modo automático.", "Pérdidas de señal y salidas del modo automático."],
  2: ["Tiempo por debajo del rango elevado.", "Hipoglucemia nocturna."],
  3: ["Variabilidad elevada con TIR aceptable."],
  4: [
    "Bolos omitidos o retrasados.",
    "Hidratos de carbono fantasma (ghost carbs).",
    "Exceso de autocorrecciones.",
  ],
  5: ["Hipoglucemia nocturna.", "Hiperglucemia matutina."],
  6: ["Hiperglucemia posprandial precoz.", "Hiperglucemia tardía tras comidas grasas o proteicas."],
  7: ["Exceso de autocorrecciones."],
  8: ["Hiperglucemia persistente y sospecha de fallo de infusión."],
};

function parrafosConLead(leads: string[]) {
  const a = APARTADOS.find((x) => x.slug === "09-descarga")!;
  const out: { ancla: string; b: Extract<Bloque, { t: "p" }> }[] = [];
  a.bloques.forEach((b, i) => {
    if (b.t === "p" && b.lead && leads.includes(b.lead)) out.push({ ancla: idDeBloque(b, i), b });
  });
  return out;
}

export function RevisarDescarga({ paso }: { paso?: string }) {
  const t = TABLAS.T5;
  const n = Math.min(8, Math.max(1, Number(paso) || 1));
  const fila = t.filas[n - 1];
  const patrones = parrafosConLead(PATRON_DEL_PASO[n] || []);
  const ir = (k: number) => elegirRuta("consultar", "descarga", String(k));
  const alPaso = useIrAlCambiar(String(n), "paso-descarga");
  return (
    <div>
      <CabeceraEditorial titulo="Revisar la descarga" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Ocho pasos: de la visión global a la causa y al plan de cambios.
        </p>
      </CabeceraEditorial>
      {/* «Paso n de 8» y el selector en una sola fila (en el móvil, sin el rótulo visible). */}
      <div className="no-imprimir mb-3 flex items-center gap-x-3 text-sm">
        <span className="shrink-0 font-semibold text-slate-900">
          Paso {n} de {t.filas.length}
        </span>
        <label className="inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 sm:min-h-9 sm:flex-none">
          <span
            className="sr-only text-xs font-semibold sm:not-sr-only"
            style={{ color: hex.strong }}
          >
            Cambiar paso
          </span>
          <select
            aria-label="Cambiar paso"
            value={n}
            onChange={(e) => ir(Number(e.target.value))}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 sm:min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:max-w-md"
          >
            {t.filas.map((f, i) => (
              <option key={i} value={i + 1}>
                {i + 1}. {f.celdas[0]}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* La bandera roja (paso 8) a mano desde cualquier paso, sin terminar los anteriores (A09). */}
      <a
        href={href("consultar", "figura-3")}
        className="no-imprimir mb-3 flex min-h-11 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
      >
        <Siren size={15} className="shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">Bandera roja: hiperglucemia persistente o cetonemia</span>
        <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
      </a>
      <section
        key={n}
        id="paso-descarga"
        tabIndex={-1}
        className="pantalla-in scroll-mt-24 rounded-2xl border bg-white p-4 shadow-soft focus:outline-none"
        style={{ borderColor: "#e6e6e6" }}
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-extrabold text-slate-900">
            <span className="mr-2 tabular-nums" style={{ color: hex.strong }}>
              {n}.
            </span>
            {fila.celdas[0]}
          </h2>
        </div>
        <dl
          className="mt-3 divide-y md:grid md:grid-cols-3 md:gap-4 md:divide-y-0"
          style={{ borderColor: "#e6e6e6" }}
        >
          {t.columnas.slice(1).map((col, j) => (
            <div key={col} className="py-2.5 md:py-0">
              <dt
                className="mb-1 text-xs font-bold uppercase tracking-wide"
                style={{ color: j === 2 ? hex.ink : "#475569" }}
              >
                {col}
              </dt>
              <dd className="text-[15px] text-slate-800">
                <Lineas>{fila.celdas[j + 1]}</Lineas>
              </dd>
            </div>
          ))}
        </dl>
        <ComoInterpretar tabla="T5" fila={n - 1} />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {CON_CASOS && casoPorId("ejemplo-descarga") && (
            <a
              href={href("casos", "ejemplo-descarga", String(n))}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:border-slate-500"
            >
              Ver este paso en el ejemplo comentado <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
          {rutaDeTabla("T5") && (
            <a
              href={rutaDeTabla("T5")}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Fuente: Tabla 5, {paginasDe(t.paginas[0], t.paginas[1])} · Ver en el capítulo{" "}
              <ArrowRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
        {patrones.length > 0 && (
          <details className="mt-4">
            <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
              Patrones relacionados del capítulo ({patrones.length})
            </summary>
            <ul className="mt-2 space-y-2">
              {patrones.map((p) => (
                <li
                  key={p.ancla}
                  className="rounded-xl border p-3 text-sm text-slate-800"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <strong>{p.b.lead} </strong>
                  <Texto>{p.b.texto}</Texto>
                  <a
                    href={href("capitulo", "09-descarga", p.ancla)}
                    className="tap-44 ml-1 inline-flex items-center gap-0.5 text-xs font-semibold text-slate-600 hover:underline"
                  >
                    p. {p.b.p} <ArrowRight size={11} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}
        {n === 8 && (
          <a
            href={href("consultar", "figura-3")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
            style={{ background: hex.strong }}
          >
            Aplicar la Figura 3 paso a paso <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
        <div
          className="mt-4 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "#e6e6e6" }}
        >
          <button
            type="button"
            disabled={n === 1}
            onClick={() => {
              alPaso();
              ir(n - 1);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Paso {n - 1 || 1}
          </button>
          <button
            type="button"
            disabled={n === 8}
            onClick={() => {
              alPaso();
              ir(n + 1);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: hex.strong }}
          >
            Paso {Math.min(8, n + 1)} <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">
        <Texto>{t.notas[1]}</Texto>
      </p>
    </div>
  );
}

/* ---------- Interrupción del sistema (línea de tiempo) ---------- */
const FIGURA3_SI =
  "Si existe cetonemia, hiperglucemia persistente o sospecha de fallo de infusión, se seguirá el algoritmo de la figura 3.";
/* «clave»: las frases del párrafo que responden a ese tramo (índices), resaltadas dentro del
   párrafo entero, que sigue a la vista (13-10-2026: el de «Muy breve» se leía como un bloque). */
const TRAMOS_INTERRUPCION = [
  {
    id: "breve",
    titulo: "Muy breve",
    sub: "reanudación o sustitución inmediata",
    parrafo: 0,
    clave: [1, 2, 3],
  },
  {
    id: "una-hora",
    titulo: "Alrededor de 1 h",
    sub: "hay que actuar",
    parrafo: 0,
    clave: [4],
  },
  {
    id: "pocas-horas",
    titulo: "Programada, hasta 2-3 h",
    sub: "deporte, baño, exploraciones",
    parrafo: 1,
    clave: [1],
  },
  {
    id: "prolongada",
    titulo: "Prolongada o fallo definitivo",
    sub: "pasar a plumas",
    parrafo: 2,
    clave: [0],
  },
  {
    id: "programada",
    titulo: "Cirugía, ingreso o exploración larga",
    sub: "glargina programada y reinicio",
    parrafo: 3,
    clave: [0, 1],
  },
];
/* Las frases de un párrafo: corte tras punto y espacio, antes de mayúscula. */
const frasesDeParrafo = (t: string) => t.split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ¿«])/);

export function Interrupcion({ tramo }: { tramo?: string }) {
  const a = APARTADOS.find((x) => x.slug === "07-educacion")!;
  const inicio = a.bloques.findIndex((b) => b.t === "h3" && b.id === "interrupcion");
  const fin = a.bloques.findIndex((b, i) => i > inicio && b.t === "h3");
  const parrafos = a.bloques
    .slice(inicio + 1, fin)
    .map((b, k) => ({ b, ancla: idDeBloque(b, inicio + 1 + k) }))
    .filter((x) => x.b.t === "p") as { b: Extract<Bloque, { t: "p" }>; ancla: string }[];
  // El tramo vive en la URL (Atrás/Adelante y enlaces lo respetan).
  const sel = tramo && TRAMOS_INTERRUPCION.some((t) => t.id === tramo) ? tramo : "breve";
  const actual = TRAMOS_INTERRUPCION.find((t) => t.id === sel)!;
  const p = parrafos[actual.parrafo];
  return (
    <div>
      <CabeceraEditorial titulo="Interrupción del sistema" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          «Interrupción del sistema y pauta alternativa»: elige cuánto va a durar y lee su párrafo.
        </p>
      </CabeceraEditorial>
      <div className="no-imprimir mb-4">
        <Segmented
          label="Duración de la interrupción"
          wrap
          value={sel}
          onChange={(v) => {
            elegirRuta("consultar", "interrupcion", v);
          }}
          options={TRAMOS_INTERRUPCION.map((t) => ({ id: t.id, label: t.titulo }))}
        />
      </div>
      <ol className="relative mb-4 grid grid-cols-5 gap-1" aria-hidden="true">
        {TRAMOS_INTERRUPCION.map((t, i) => (
          <li key={t.id} className="text-center">
            <div
              className="mx-auto h-2 rounded-full"
              style={{
                background:
                  i <= TRAMOS_INTERRUPCION.findIndex((x) => x.id === sel) ? hex.strong : "#e6e6e6",
              }}
            />
            <div className="mt-1 hidden text-[11px] text-slate-500 sm:block">{t.sub}</div>
          </li>
        ))}
      </ol>
      <section
        key={sel}
        className="pantalla-in rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        aria-live="polite"
      >
        <h2 className="text-lg font-extrabold text-slate-900">{actual.titulo}</h2>
        <p className="text-sm text-slate-500">{actual.sub}</p>
        {p && (
          <>
            <p
              className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: hex.soft, boxShadow: `inset 0 0 0 1px ${hex.strong}` }}
              />
              Lo que responde a este caso, resaltado en el párrafo
            </p>
            <p className="prosa mt-1">
              {frasesDeParrafo(p.b.texto).map((f, k) => (
                <span key={k}>
                  {k > 0 && " "}
                  {actual.clave.includes(k) ? (
                    <mark
                      className="rounded px-0.5 font-semibold text-slate-900"
                      style={{ background: hex.soft, boxShadow: `inset 0 -2px 0 0 ${hex.strong}` }}
                    >
                      <Texto>{f}</Texto>
                    </mark>
                  ) : (
                    <span className="text-slate-600">
                      <Texto>{f}</Texto>
                    </span>
                  )}
                </span>
              ))}
            </p>
          </>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={href("capitulo", "07-educacion", "interrupcion")}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-600 hover:underline sm:min-h-6"
          >
            {p ? `Fuente: Apartado 7, p. ${p.b.p} · ` : ""}Leer el subapartado completo{" "}
            <ArrowRight size={11} aria-hidden="true" />
          </a>
          {/* Desde cualquier duración (S61-06), con la frase del capítulo (p. 9). */}
          <a
            href={href("consultar", "figura-3")}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-600 hover:underline sm:min-h-6"
          >
            {FIGURA3_SI} <ArrowRight size={11} aria-hidden="true" />
          </a>
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">
        <Texto>{parrafos[4]?.b.texto ?? ""}</Texto>
      </p>
    </div>
  );
}
