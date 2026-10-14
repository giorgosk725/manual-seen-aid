/* Recorridos de consulta construidos solo con el texto del capítulo:
   - Situaciones: eliges una situación (filas de las Tablas 4 y 6) y, si procede, un
     sistema, y ves la celda exacta más los párrafos del capítulo que la desarrollan.
   - Revisar la descarga: la Tabla 5 paso a paso (8 pasos), con el patrón relacionado.
   - Interrupción del sistema: el subapartado «Interrupción del sistema y pauta alternativa»
     como línea de tiempo (muy breve · hasta 2-3 h · prolongada), con los párrafos literales. */
import { ponerConsulta } from "../consultaBuscar";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Baby,
  BedDouble,
  Bike,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Eye,
  Lightbulb,
  Wrench,
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
import { INTERRUPCION_LINEA } from "../contenido/diagramas";
import {
  GestacionPorSistema,
  InterrupcionPantalla,
  ObjetivosDePoblacion,
} from "../componentes/Diagramas";
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
import { CabeceraEditorial } from "../ui";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { useIrAlCambiar, useSubirAlElegir } from "../irAlCambiar";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, FICHA_AREA, SISTEMA_HEX } from "../tokens";
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
        alias: ["cetonas", "cetonemia", "bohb", "set", "cateter", "infusion", "canula"],
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
        alias: ["hipo", "bajada", "hidratos", "alarma", "baja"],
      },
      {
        t: "Hipoglucemia nocturna",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b7"),
        alias: ["noche", "nocturna", "dormir", "madrugada"],
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
        t: "Tipos de catéter y cánula",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b25"),
        alias: ["cateter", "canula", "set", "infusion", "cambio"],
      },
      {
        t: "Problemas cutáneos",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b24"),
        alias: ["piel", "adhesivo", "irritacion", "alergia", "lipodistrofia"],
      },
      {
        t: "Fatiga por alarmas",
        fuente: "Apartado 9",
        ruta: href("capitulo", "09-descarga", "b26"),
        alias: ["alarma", "alarmas", "pitidos", "avisos"],
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
        alias: [
          "desconectar",
          "desconexion",
          "quitar",
          "retirar",
          "ducha",
          "bano",
          "pod",
          "bomba",
          "fallo",
          "repuesto",
        ],
      },
    ],
  },
  {
    t: "Poblaciones y situaciones especiales",
    ids: ["gestacion", "adolescencia", "mayores", "dialisis"],
  },
];

/* Un tono por tema (0.72.0): el cuadrado del icono, en el color de área del Manual con el
   icono blanco; así el color dice el tema. */
const TONO_TEMA: Record<string, string> = {
  "Ejercicio y comidas": FICHA_AREA.nutricion,
  "Noche, enfermedad e hiperglucemia": FICHA_AREA.lipidos,
  "Incidencias del día a día": FICHA_AREA.obesidad,
  "Exploraciones, cirugía e ingreso": FICHA_AREA.pizarra,
  "Interrupción del sistema": FICHA_AREA.mineral,
  "Poblaciones y situaciones especiales": FICHA_AREA.diabetes,
};
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
  /^hipoglucemia nocturna/i.test(t)
    ? Moon
    : /^hipoglucemia/i.test(t)
      ? TrendingDown
      : /catéter/i.test(t)
        ? Syringe
        : /cutáneos/i.test(t)
          ? ShieldCheck
          : /alarmas/i.test(t)
            ? Siren
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
/* En el ingreso, de entrada «Mantener la MCG, la bomba o el AID» y «Cuándo no continuar» (el
   marco, plegado). */
const MOMENTO_INICIAL: Record<string, number[]> = { "ingreso-hospitalario": [1, 3] };
function GuionVista({
  momentos,
  rotulo = "Lo que dice el capítulo, por momentos",
  clave,
  sistema,
  momento,
  desde = 0,
  inicial = [desde],
}: {
  /* El momento abierto de entrada (0.72.0: en el ingreso, el operativo y no el marco). */
  inicial?: number[];
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
    const abiertos = new Set(m?.abiertos ?? (valido !== null ? [valido] : inicial));
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
              className="relative scroll-mt-4 pb-1 pl-10"
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
                {i - desde + 1}
              </span>
              <h3>
                <button
                  type="button"
                  aria-expanded={abierto(i)}
                  onClick={() => alternar(i)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 py-1 text-left text-sm font-bold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <span>
                    <span className="sr-only">{i - desde + 1}. </span>
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
  etiqueta,
  onCambiar,
}: {
  id: string;
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
  if (!filas.length) return null;
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
  ancha = false,
}: {
  /* Sin situación elegida, a todo el ancho y en columnas (0.71.0). */
  ancha?: boolean;
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
    tono,
  }: {
    I: LucideIcon;
    texto: string;
    chip?: boolean;
    on?: boolean;
    tono: string;
  }) => (
    <>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: on ? "rgba(255,255,255,.18)" : tono }}
      >
        <I size={16} style={{ color: "#fff" }} />
      </span>
      <span className="min-w-0 flex-1 font-semibold leading-snug">{texto}</span>
      {/* «Cambia según el sistema»: cuatro puntos con el color de cada sistema. */}
      {chip && (
        <span
          className="flex shrink-0 gap-0.5"
          title="Cambia según el sistema"
          role="img"
          aria-label="Cambia según el sistema"
        >
          {SISTEMA_HEX.map((x, k) => (
            <span
              key={k}
              className="h-2 w-2 rounded-full"
              style={{ background: on ? "#fff" : x.strong, opacity: on ? 0.85 : 1 }}
            />
          ))}
        </span>
      )}
      {on ? (
        <Check size={15} className="shrink-0" aria-hidden="true" />
      ) : (
        <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
      )}
    </>
  );
  return (
    <div
      id="lista-situaciones"
      className={
        ancha
          ? "scroll-mt-4 gap-3 lg:columns-2 2xl:columns-3 [&>*]:mb-2 [&>*]:break-inside-avoid"
          : "scroll-mt-4 space-y-2"
      }
    >
      {f && (
        <p className="text-xs text-slate-600" aria-live="polite">
          {total === 1 ? "1 resultado" : `${total} resultados`}
        </p>
      )}
      {/* La leyenda de los puntos (en el móvil no hay «title» al pasar el ratón). */}
      {!f && (
        <p aria-hidden="true" className="flex items-center gap-1.5 px-1 text-xs text-slate-600">
          <span className="flex gap-0.5">
            {SISTEMA_HEX.map((x, k) => (
              <span key={k} className="h-2 w-2 rounded-full" style={{ background: x.strong }} />
            ))}
          </span>
          Cambia según el sistema
        </p>
      )}
      {f && total === 0 && (
        <div
          className="rounded-md border border-dashed px-3 py-3 text-sm text-slate-700"
          style={{ borderColor: "#d4d4d4" }}
        >
          Ninguna situación coincide con «{f}».{" "}
          {/* La consulta pasa en memoria (A03: no va en la URL). */}
          <a
            href={href("buscar")}
            onClick={() => ponerConsulta(f)}
            className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2 sm:min-h-6"
          >
            Buscarlo en el capítulo
          </a>{" "}
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
                        tono={TONO_TEMA[tema.t] ?? hex.strong}
                      />
                    </button>
                  </li>
                );
              })}
              {extras.map((x) => (
                <li key={x.ruta}>
                  <a href={x.ruta} className={`${fila} text-slate-900 hover:bg-slate-50`}>
                    <Fila
                      I={iconoDeTexto(x.t)}
                      texto={x.t}
                      tono={TONO_TEMA[tema.t] ?? hex.strong}
                    />
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
  // Elegida otra situación (sobre todo una de las últimas de la lista), al principio de su texto.
  useSubirAlElegir(situacion ?? "", "detalle-situacion");
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
      <CabeceraEditorial titulo="Situaciones" hex={hex} level={1} />
      {/* Sin situación elegida, la lista a todo el ancho; con una, lista a la izquierda (0.71.0). */}
      <div className={`grid gap-4 ${sit || guia ? "lg:grid-cols-[18rem_1fr]" : ""}`}>
        <div className={(sit || guia) && !verLista ? "hidden lg:block" : undefined}>
          <input
            type="search"
            aria-label="Filtrar situaciones"
            placeholder="Filtrar: resonancia, ejercicio, sueño…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className={`mb-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-10 ${!sit && !guia ? "lg:max-w-md" : ""}`}
          />
          <ListaSituaciones
            sit={sit}
            sistema={sistema}
            filtro={filtro}
            onLimpiar={() => setFiltro("")}
            ancha={!sit && !guia}
          />
        </div>
        <div
          id="detalle-situacion"
          className={`scroll-mt-4 ${sit || guia ? "order-first lg:order-none" : ""}`}
        >
          {guia && (
            <div key={guia.id} className="pantalla-in space-y-4">
              <CabeceraSituacion id={guia.id} etiqueta={guia.etiqueta} onCambiar={cambiar} />
              {/* 0.72.0: sin la frase de entrada (la regla de la 0.70.0; queda en la búsqueda). */}
              <div id="conducta-situacion" className="scroll-mb-28 scroll-mt-4" />
              {/* Los objetivos de MCG de esa población, a la vista (antes, un enlace al pie). */}
              {guia.enlaces
                .map((l) => /^#\/visual\/objetivos-mcg\/([a-z-]+)$/.exec(l.ruta)?.[1])
                .filter((x): x is string => !!x)
                .map((pob) => (
                  <section
                    key={pob}
                    aria-label="Objetivos de MCG"
                    className="rounded-2xl border bg-white p-4 shadow-soft"
                    style={{ borderColor: "#e6e6e6" }}
                  >
                    <ObjetivosDePoblacion id={pob} />
                  </section>
                ))}
              {guia.id === "gestacion" && (
                <section
                  aria-label="Gestación, sistema a sistema"
                  className="rounded-2xl border bg-white p-4 shadow-soft"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <GestacionPorSistema />
                </section>
              )}
              <GuionVista
                momentos={guia.guion}
                rotulo={guia.rotuloGuion}
                clave={guia.id}
                momento={momento}
                inicial={MOMENTO_INICIAL[guia.id] ?? [0]}
              />
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Seguir en
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {guia.enlaces
                    .filter((l) => !l.ruta.startsWith("#/visual/objetivos-mcg/"))
                    .map((l) => (
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
              <CabeceraSituacion id={sit.id} etiqueta={sit.etiqueta} onCambiar={cambiar} />
              {/* En el ejercicio, las comprobaciones antes de empezar van antes de la conducta de
                  cada sistema (S61-01): pueden obligar a retrasar o a no hacer el ejercicio. */}
              {ANTES_DE_ACTUAR.includes(sit.id) && GUION[sit.id] && (
                <section
                  id="antes-situacion"
                  aria-label="Antes de actuar"
                  className="scroll-mt-4 rounded-2xl border-2 p-4"
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
                className="scroll-mb-28 scroll-mt-4 space-y-3 rounded-2xl border bg-white p-4 shadow-soft"
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
                      Sistema
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
                  </>
                )}
                <FuentePie
                  className="mt-0"
                  fuentes={[
                    {
                      texto: `Tabla ${tabla.numero}, ${paginasDe(tabla.paginas[0], tabla.paginas[1])}`,
                      ruta: rutaDeTabla(sit.tabla),
                    },
                    ...sit.leer.map((l) => ({
                      texto: l.titulo,
                      ruta: href("capitulo", l.slug, l.ancla),
                    })),
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
              {/* 0.70.0: dos como mucho, la hoja para el paciente y su plan de seguridad. */}
              <ParaSeguir
                filas={[
                  ...(sit.tabla === "T6" || sit.id.startsWith("hiperglucemia")
                    ? [
                        {
                          href: href(
                            "pacientes",
                            sit.tabla === "T6" ? "hoja" : "plan",
                            sit.tabla === "T6"
                              ? "pruebas-cirugia"
                              : sisIdx >= 0
                                ? ORDEN_SISTEMAS[sisIdx]
                                : undefined,
                          ),
                          t:
                            sit.tabla === "T6"
                              ? "Hoja para el paciente: antes de una prueba o una cirugía"
                              : "Plan de seguridad y hoja de cetonas para el paciente",
                          I: HeartHandshake,
                          color: CATEGORIA_HEX.pacientes.strong,
                        },
                      ]
                    : []),
                  ...(sit.id.startsWith("ejercicio")
                    ? [
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
  // En el ordenador, los patrones del paso abiertos (hay sitio).
  const [ancha] = useState(() => window.matchMedia?.("(min-width: 1024px)").matches ?? false);
  return (
    <div>
      <CabeceraEditorial titulo="Revisar la descarga" hex={hex} level={1} />
      {/* 0.72.0: los ocho pasos a la vista. Hasta el ordenador ancho, ocho botones numerados
          con el avance; en él, la lista con sus títulos a la izquierda. */}
      <nav aria-label="Pasos de la descarga" className="no-imprimir mb-3 lg:hidden">
        <div className="mb-1.5 text-sm font-semibold text-slate-900">
          Paso {n} de {t.filas.length}
        </div>
        {/* 44 px por botón: a menos de 390 px de ancho, la fila se desplaza de lado. */}
        <ol className="-mx-1 flex gap-0.5 overflow-x-auto px-1 pb-0.5">
          {t.filas.map((f, i) => {
            const on = i + 1 === n;
            return (
              <li key={i} className="min-w-11 flex-1">
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  aria-label={`Paso ${i + 1}: ${f.celdas[0]}`}
                  title={f.celdas[0]}
                  onClick={() => ir(i + 1)}
                  className={`flex h-11 w-full items-center justify-center rounded-lg border text-sm font-bold tabular-nums transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-white" : i + 1 < n ? "bg-white text-slate-900" : "bg-white text-slate-500"}`}
                  style={
                    on
                      ? { background: "#8E254E", borderColor: "#8E254E" }
                      : { borderColor: i + 1 < n ? "#8E254E" : "#d4d4d4" }
                  }
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      {/* La bandera roja (paso 8) a mano desde cualquier paso, sin terminar los anteriores (A09). */}
      <a
        href={href("consultar", "figura-3")}
        className="no-imprimir mb-3 flex min-h-11 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
      >
        <Siren size={15} className="shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">Bandera roja: hiperglucemia persistente o cetonemia</span>
        <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
      </a>
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-4">
        <nav
          aria-label="Pasos de la descarga"
          className="no-imprimir hidden lg:sticky lg:top-20 lg:block"
        >
          <ol className="space-y-1">
            {t.filas.map((f, i) => {
              const on = i + 1 === n;
              return (
                <li key={i}>
                  <button
                    type="button"
                    aria-current={on ? "step" : undefined}
                    onClick={() => ir(i + 1)}
                    className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] leading-snug transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "bg-white font-semibold text-slate-900 shadow-soft" : "text-slate-700 hover:bg-white"}`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${on ? "text-white" : "bg-slate-100 text-slate-700"}`}
                      style={on ? { background: "#8E254E" } : undefined}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 pt-0.5">{f.celdas[0]}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <section
          key={n}
          id="paso-descarga"
          tabIndex={-1}
          className="pantalla-in scroll-mt-4 rounded-2xl border bg-white p-4 shadow-soft focus:outline-none"
          style={{ borderColor: "#e6e6e6" }}
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">{fila.celdas[0]}</h2>
          </div>
          <dl
            className="mt-3 divide-y md:grid md:grid-cols-3 md:gap-4 md:divide-y-0"
            style={{ borderColor: "#e6e6e6" }}
          >
            {t.columnas.slice(1).map((col, j) => {
              const I = [Eye, Lightbulb, Wrench][j] ?? Eye;
              return (
                <div key={col} className="py-2.5 md:py-0">
                  <dt
                    className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                    style={{ color: j === 2 ? hex.ink : "#475569" }}
                  >
                    <I size={14} aria-hidden="true" />
                    {col}
                  </dt>
                  <dd className="text-[15px] text-slate-800">
                    <Lineas>{fila.celdas[j + 1]}</Lineas>
                  </dd>
                </div>
              );
            })}
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
            <FuentePie
              className=""
              fuentes={[
                {
                  texto: `Tabla 5, ${paginasDe(t.paginas[0], t.paginas[1])}`,
                  ruta: rutaDeTabla("T5") ?? undefined,
                },
              ]}
            />
          </div>
          {patrones.length > 0 && (
            <details className="mt-4" open={ancha}>
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
            {/* 0.72.0: en el primer y el último paso, sin el botón que no lleva a ningún sitio. */}
            <button
              type="button"
              disabled={n === 1}
              hidden={n === 1}
              onClick={() => {
                alPaso();
                ir(n - 1);
              }}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft size={14} aria-hidden="true" /> Paso {n - 1 || 1}
            </button>
            <span aria-hidden="true" hidden={n !== 1} />
            <button
              type="button"
              disabled={n === 8}
              hidden={n === 8}
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
      </div>
      {/* La nota de la Tabla 5, una vez: en el primer paso (0.70.0). */}
      {n === 1 && (
        <p className="mt-3 text-xs text-slate-500">
          <Texto>{t.notas[1]}</Texto>
        </p>
      )}
    </div>
  );
}

/* ---------- Interrupción del sistema (0.70.0) ----------
   Los cinco casos de una vez (no programada: muy breve, hacia 1 h, prolongada; programada: pocas
   horas, glargina programada), pod y bomba, y la basal de respaldo: el esquema del apartado 7, en
   texto literal y a tamaño de lectura. Sustituye a las pestañas por duración. */
export function Interrupcion(_props: { tramo?: string }) {
  const a = APARTADOS.find((x) => x.slug === "07-educacion")!;
  return (
    <div>
      <CabeceraEditorial titulo="Interrupción del sistema" hex={hex} level={1} />
      <div className="interrupcion-grande">
        <InterrupcionPantalla />
      </div>
      <FuentePie
        className="mt-3"
        fuentes={[
          {
            texto: `Apartado ${a.n}, p. ${INTERRUPCION_LINEA.pagina}`,
            ruta: href("capitulo", a.slug, "interrupcion"),
          },
        ]}
      />
      {/* 0.72.0: «¿le quito la bomba?» en el hospital está en el ingreso (apartado 10). */}
      <div className="no-imprimir mt-4">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
          Seguir en
        </div>
        <a
          href={href("consultar", "situacion", "ingreso-hospitalario::m4")}
          className="inline-flex min-h-11 items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400 sm:min-h-8"
          style={{ borderColor: "#d4d4d4" }}
        >
          Ingreso hospitalario: cuándo no continuar y cómo pasar a pauta subcutánea{" "}
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
