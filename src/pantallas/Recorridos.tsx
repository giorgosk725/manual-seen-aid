/* Recorridos de consulta construidos solo con el texto del capítulo:
   - Situaciones: eliges una situación (filas de las Tablas 4 y 6) y, si procede, un
     sistema, y ves la celda exacta más los párrafos del capítulo que la desarrollan.
   - Interpretación de la descarga: la Tabla 5 paso a paso (8 pasos), con el patrón relacionado.
   - Interrupción del sistema: el subapartado «Interrupción del sistema y pauta alternativa»
     como línea de tiempo (muy breve · hasta 2-3 h · prolongada), con los párrafos literales. */
import { ponerConsulta } from "../consultaBuscar";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Check, ChevronLeft, ChevronRight, Siren } from "lucide-react";
import { APARTADOS, TABLAS, idDeBloque, type Bloque, rutaDeTabla } from "../contenido";
import { INTERRUPCION_LINEA } from "../contenido/diagramas";
import { InterrupcionPantalla, ObjetivosDePoblacion } from "../componentes/Diagramas";
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
import { AnadidoDelSistema, BloquesPorSistema } from "../componentes/BloquesPorSistema";
import { DosColumnas } from "../componentes/DosColumnas";
import { NombreSistema } from "../componentes/NombreSistema";
import { GUIA_POR_SISTEMA, TABLA4_POR_SISTEMA } from "../porSistema";
import { CATALOGO_SISTEMAS, CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { kDe, siglasPorPiezas, type Pieza } from "../inicio";

import { elegirRuta, fueNavegacionNueva, href } from "../rutas";
import { ComoInterpretar } from "../componentes/ComoInterpretar";
import { casoPorId } from "../casos";
import { CabeceraEditorial } from "../ui";
import { recordarSistema, sistemaReciente } from "../sistemaReciente";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { useIrAlCambiar, useSubirAlElegir } from "../irAlCambiar";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { FuentePie } from "../componentes/FuentePie";
import { paginasPorApartado } from "../paginasApartado";
import { paginasDe } from "../paginas";
import { fuentesDePiezas } from "../fuentesPiezas";
import { CON_CASOS, CON_INTERPRETACIONES } from "../edicion";

const hex = CATEGORIA_HEX.consultar;

/* ---------- Situación y sistema ---------- */

/* Las situaciones, por tema (no por la tabla de la que salen): las filas de las Tablas 4 y 6 y
   los subapartados del apartado 10 que no tienen tabla, juntos. Los nombres de los temas son de
   la app; cada entrada conserva su rótulo del capítulo y su página o tabla. */
type Extra = { t: string; fuente: string; ruta: string; alias?: string[] };
/* 0.63.0: cada entrada va en su tema por su id (no por palabras de su título: «Diálisis y
   enfermedad renal» caía en «enfermedad»); los subapartados del apartado 10 tienen ya su guía. */
/* Séptima vuelta: el orden de los grupos es el que, partido en dos tramos contiguos, llena dos
   columnas parejas en pantalla ancha; así la lista se lee igual en el móvil, en el lateral y en
   las dos columnas. */
const TEMAS_SITUACION: { t: string; ids: string[]; extras?: Extra[] }[] = [
  // 0.78.1 (segunda ronda, guardia y senior): lo urgente, el primero; y una sola puerta para la
  // hiperglucemia con sospecha de fallo: la Figura 3 (la fila de la Tabla 4 remite a ella).
  // 0.79.1 (tercera ronda, guardia): las tres urgencias, juntas y las primeras.
  {
    t: "Urgencias",
    ids: [],
    extras: [
      {
        t: "Hiperglucemia persistente o inexplicada (sospecha de fallo de infusión)",
        fuente: "Figura 3",
        ruta: href("consultar", "figura-3"),
        alias: [
          "cetonas",
          "cetonemia",
          "bohb",
          "set",
          "cateter",
          "infusion",
          "canula",
          "persistente",
          "inexplicada",
          "fallo",
          "glucosa",
          "alta",
        ],
      },
      {
        t: "Hipoglucemia en asa cerrada",
        fuente: "Apartado 7",
        ruta: href("visual", "hipoglucemia"),
        alias: ["hipo", "bajada", "hidratos", "alarma", "baja"],
      },
      {
        t: "Interrupción del sistema y pauta alternativa",
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
    t: "Noche, enfermedad e hiperglucemia",
    ids: [
      "sueno",
      "necesidad-transitoria",
      "hiperglucemia-puntual",
      "enfermedad-intercurrente",
      "glucocorticoides",
    ],
  },
  {
    t: "Ejercicio y comidas",
    ids: ["ejercicio-aerobico", "ejercicio-anaerobico", "comida-grasa"],
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
    t: "Poblaciones y situaciones especiales",
    ids: ["gestacion", "adolescencia", "mayores", "dialisis"],
  },
  {
    t: "Resolución de incidencias",
    ids: [],
    extras: [
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
];

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
/* En el ingreso, de entrada «Mantenimiento de la MCG, la bomba o el AID» y «Criterios para no
   continuar» (el ámbito, plegado); en la gestación, todo plegado: las tarjetas por sistema van
   arriba. */
const MOMENTO_INICIAL: Record<string, number[]> = { "ingreso-hospitalario": [1, 2] };
function GuionVista({
  momentos,
  rotulo = "Texto del capítulo",
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
    // 0.74.2 (petición del responsable: nada útil plegado): todos los momentos abiertos de
    // entrada; cada uno se puede plegar.
    void inicial;
    const abiertos = new Set(m?.abiertos ?? momentos.map((_, i) => i));
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
    <section aria-label={rotulo} className="tarjeta p-4">
      {/* 0.72.2: sin rótulo visible encima (los títulos numerados ya dicen qué es). 0.74.2:
          sin «Desplegar todo» (ya van abiertos). */}
      <h2 className="sr-only">{rotulo}</h2>
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
                className={`num absolute left-0 top-2.5 ${abierto(i) ? "num-on" : ""}`}
              >
                {i - desde + 1}
              </span>
              <h3>
                <button
                  type="button"
                  aria-expanded={abierto(i)}
                  onClick={() => alternar(i)}
                  className="titulo-tarjeta flex min-h-11 w-full items-center justify-between gap-3 py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
                  {/* 0.72.0: las siglas, pulsables la primera vez que salen en el momento.
                      0.73.0: con la pleca del texto literal. */}
                  <div className="literal space-y-2">
                    {(() => {
                      const pz = piezasDe(m);
                      const sg = siglasPorPiezas(pz);
                      return pz.map((x, k) => (
                        <PiezaVista key={k} pieza={x} compacta siglas={sg[k]} />
                      ));
                    })()}
                  </div>
                  {/* Una sola línea de fuente por momento, al párrafo exacto. */}
                  <p className="fuente-pie">
                    Fuente:{" "}
                    {fuentesDeMomento(m).map((f, k) => (
                      <span key={f.texto}>
                        {k > 0 && " · "}
                        <a
                          href={f.ruta}
                          onClick={() => marcarEnRuta(i)}
                          className="tap-44 inline py-1"
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
  void id;
  return (
    <div className="tarjeta tarjeta-sistema flex items-center gap-3 p-3 pl-4">
      <div className="min-w-0 flex-1">
        <h2 className="titulo-seccion">{etiqueta}</h2>
      </div>
      <button type="button" onClick={onCambiar} className="chip shrink-0 lg:hidden">
        Cambiar
      </button>
    </div>
  );
}

/* «Para seguir»: la hoja para el paciente, los apartados y la tabla entera, en filas como las
   del mapa de la portada. */
function ParaSeguir({ filas }: { filas: { href: string; t: string; color?: string }[] }) {
  if (!filas.length) return null;
  return (
    <section aria-label="Véase también" className="tarjeta overflow-hidden">
      <h2 className="titulo-tarjeta px-3 pb-1.5 pt-3" style={{ color: hex.ink }}>
        Véase también
      </h2>
      <ul className="filas">
        {filas.map((f) => (
          <li key={f.href}>
            <a
              href={f.href}
              className="fila focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
            >
              <span className="min-w-0 flex-1">{f.t}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListaSituaciones({
  sit,
  activa,
  sistema,
  filtro = "",
  onLimpiar,
  ancha = false,
}: {
  /* Sin situación elegida, a todo el ancho y en columnas (0.71.0). */
  ancha?: boolean;
  sit: Situacion | null;
  /* La guía abierta (gestación, ingreso…), marcada como la situación de la Tabla 4. */
  activa?: string;
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
    "fila w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500";
  /* 0.73.0 (auditoría de uso): la fila, solo el nombre y la flecha (sin icono por fila ni los
     cuatro puntos de «conducta distinta»: el icono del tema basta). */
  const Fila = ({ texto, on, destino }: { texto: string; on?: boolean; destino?: string }) => (
    <>
      <span className="min-w-0 flex-1 leading-snug">{texto}</span>
      {/* 0.77.1 (auditoría R3): las que abren otra pantalla lo dicen (el capítulo, una figura). */}
      {destino && <span className="shrink-0 text-xs font-normal text-slate-500">{destino}</span>}
      {on && <Check size={15} className="shrink-0" aria-hidden="true" />}
    </>
  );
  // 0.80.1 (cuarta ronda, senior): un criterio: la Figura 3, un diagrama de la app o el capítulo.
  const destinoDe = (ruta: string) =>
    ruta.startsWith("#/capitulo")
      ? "Capítulo"
      : ruta.startsWith("#/consultar/figura-3")
        ? "Figura 3"
        : ruta.startsWith("#/visual")
          ? "Diagrama"
          : undefined;
  const conFilas = visibles.filter((g) => g.sits.length || g.extras.length);
  return (
    <div
      id="lista-situaciones"
      className={
        ancha ? "scroll-mt-4 grid gap-3 lg:grid-cols-2 lg:items-start" : "scroll-mt-4 space-y-3"
      }
    >
      {f && (
        <p className="text-xs text-slate-600 lg:col-span-2" aria-live="polite">
          {total === 1 ? "1 resultado" : `${total} resultados`}
        </p>
      )}
      {f && total === 0 && (
        <div className="rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-700 lg:col-span-2">
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
      {ancha ? (
        <DosColumnas
          etiqueta="div"
          desde="lg"
          items={conFilas}
          peso={({ sits, extras }) => 2 + sits.length + extras.length}
          render={grupo}
        />
      ) : (
        conFilas.map(grupo)
      )}
    </div>
  );
  /* Un grupo de situaciones (tarjeta con sus filas). */
  function grupo({ tema, sits, extras }: (typeof visibles)[number]) {
    return (
      <section key={tema.t} aria-label={tema.t} className="tarjeta overflow-hidden">
        <h2 className="titulo-tarjeta px-3 pb-1.5 pt-3" style={{ color: hex.ink }}>
          {tema.t}
        </h2>
        <ul className="filas" role="list">
          {sits.map((s) => {
            const on = sit?.id === s.id || activa === s.id;
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
                  className={`${fila} ${on ? "text-white hover:!bg-[var(--acento)]" : ""}`}
                  style={on ? { background: hex.strong } : undefined}
                >
                  <Fila texto={s.etiqueta} on={on} />
                </button>
              </li>
            );
          })}
          {extras.map((x) => (
            <li key={x.ruta}>
              <a href={x.ruta} className={fila}>
                <Fila texto={x.t} destino={destinoDe(x.ruta)} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
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
  if (sisIdx >= 0) recordarSistema(sisIdx);
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
            className="mb-3 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E254E] sm:min-h-10"
          />
          <ListaSituaciones
            sit={sit}
            activa={guia?.id}
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
              {/* 0.73.0: primero lo de cada sistema (frases literales, src/porSistema.ts);
                  después los objetivos y lo común. */}
              {GUIA_POR_SISTEMA[guia.id] && (
                <section aria-label="Sistema a sistema" className="tarjeta p-4">
                  {/* 0.80.1 (cuarta ronda, adjunto): sin sistema en la dirección, se dice cuál se
                      enseña y por qué. */}
                  {sisIdx < 0 && sistemaReciente() !== undefined && (
                    <p className="mb-2 text-xs text-slate-600">
                      Sistema elegido: el último consultado ({CORTO_SISTEMA[sistemaReciente()!]}).
                    </p>
                  )}
                  <BloquesPorSistema
                    key={guia.id}
                    bloques={GUIA_POR_SISTEMA[guia.id].bloques}
                    comun={GUIA_POR_SISTEMA[guia.id].comun}
                    complementos={GUIA_POR_SISTEMA[guia.id].complementos}
                    seleccion={sisIdx >= 0 ? sisIdx : (sistemaReciente() ?? -1)}
                    onElegir={(i) =>
                      elegirRuta("consultar", "situacion", `${guia.id}:${SIS_IDS[i]}`)
                    }
                  />
                </section>
              )}
              {/* Los objetivos de MCG de esa población, a la vista (antes, un enlace al pie). */}
              {guia.enlaces
                .map((l) => /^#\/visual\/objetivos-mcg\/([a-z-]+)$/.exec(l.ruta)?.[1])
                .filter((x): x is string => !!x)
                .map((pob) => (
                  <section key={pob} aria-label="Objetivos de MCG" className="tarjeta p-4">
                    <ObjetivosDePoblacion id={pob} />
                  </section>
                ))}
              <GuionVista
                momentos={guia.guion}
                clave={guia.id}
                momento={momento}
                inicial={MOMENTO_INICIAL[guia.id] ?? [0]}
              />
              <div>
                <div className="rotulo mb-1.5">Véase también</div>
                <ul className="flex flex-wrap gap-2">
                  {guia.enlaces
                    .filter((l) => !l.ruta.startsWith("#/visual/objetivos-mcg/"))
                    .map((l) => (
                      <li key={l.ruta}>
                        <a href={l.ruta} className="chip">
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
              {/* Decisión del responsable (15-10-2026, S61-01 revisada): sigue antes de la
                  conducta, pero plegado con su título a la vista, para que la conducta de cada
                  sistema quede en la primera pantalla. */}
              {ANTES_DE_ACTUAR.includes(sit.id) && GUION[sit.id] && (
                // 0.74.2 (petición del responsable: nada útil plegado): a la vista, sin plegar.
                <section
                  id="antes-situacion"
                  aria-labelledby="antes-situacion-titulo"
                  className="scroll-mt-4 rounded-xl border-2 px-4 py-3"
                  style={{ borderColor: "#f3d38a", background: "#fffbeb" }}
                >
                  <h2
                    id="antes-situacion-titulo"
                    className="titulo-tarjeta flex items-center gap-1.5 text-amber-900"
                  >
                    <AlertTriangle size={15} aria-hidden="true" className="shrink-0" />
                    {GUION[sit.id][0].rotulo.replace(
                      /^Antes de empezar: /,
                      "Comprobaciones previas: ",
                    )}
                  </h2>
                  <div className="mt-1.5 space-y-2">
                    {piezasDe(GUION[sit.id][0]).map((pz, k) => (
                      <PiezaVista key={k} pieza={pz} compacta />
                    ))}
                    <FuentePie fuentes={fuentesDeMomento(GUION[sit.id][0])} />
                  </div>
                </section>
              )}
              <section
                id="conducta-situacion"
                className="tarjeta scroll-mb-28 scroll-mt-4 space-y-3 p-4"
                aria-label="Conducta recomendada"
              >
                {/* El rótulo de la fila ya está en la cabecera; aquí, lo común a los cuatro si lo trae. */}
                {(() => {
                  const comun = fila.etiqueta.split("\n").slice(1);
                  return (
                    <>
                      {(comun.length > 0 || fila.unida) && (
                        <div className="casilla casilla-sistema px-3 py-2.5">
                          <span className="rotulo mb-0.5 block" style={{ color: hex.ink }}>
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
                {(porSistema || sit.tabla === "T6") && (
                  <div>
                    <div className="rotulo mb-1">Sistema</div>
                    <CasillasSistema
                      unico
                      nombres={CORTO_SISTEMA}
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
                  <div className={sisIdx >= 0 ? "" : "grid gap-3 sm:grid-cols-2"}>
                    {tabla.columnas.map((nombre, c) =>
                      sisIdx >= 0 && c !== sisIdx ? null : (
                        <div
                          key={c}
                          className="tarjeta tarjeta-sistema overflow-hidden"
                          style={{ ["--sis" as string]: SISTEMA_HEX[c].strong }}
                        >
                          <div className="separador flex items-center gap-2 border-b px-3 py-1.5 pl-4">
                            <img
                              src={FOTO_SISTEMA[ORDEN_SISTEMAS[c]]}
                              alt=""
                              className="foto-sistema h-7 w-7 shrink-0 rounded-md bg-white object-cover"
                            />
                            <span className="titulo-tarjeta" style={{ color: SISTEMA_HEX[c].ink }}>
                              <NombreSistema n={CATALOGO_SISTEMAS[c]?.name ?? nombre} />
                            </span>
                          </div>
                          <p
                            className={`px-4 py-2.5 text-slate-800 ${sisIdx >= 0 ? "text-base" : "text-[15px]"}`}
                          >
                            <Lineas>{fila.celdas[c]}</Lineas>
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                )}
                {/* 0.73.0: lo que los apartados 9 y 10 añaden para ese sistema. */}
                {porSistema && sisIdx >= 0 && TABLA4_POR_SISTEMA[sit.id] && (
                  <AnadidoDelSistema
                    c={sisIdx}
                    bloques={TABLA4_POR_SISTEMA[sit.id][sisIdx]}
                    sinFuente
                  />
                )}
                {porSistema && sisIdx >= 0 && (
                  <button
                    type="button"
                    onClick={() => elegirRuta("consultar", "situacion", sit.id)}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline underline-offset-2 sm:min-h-8"
                  >
                    Los cuatro
                  </button>
                )}
                {/* 0.77.1 (auditoría R5): en las pruebas y cirugías (Tabla 6), con un sistema en la
                    ruta, el sistema con su formato y sus sensores (Tabla 1): «retirar, salvo
                    autorización del modelo» se lee con el material que lleva. */}
                {sit.tabla === "T6" && sisIdx >= 0 && (
                  <div
                    className="tarjeta tarjeta-sistema p-3"
                    style={{ ["--sis" as string]: SISTEMA_HEX[sisIdx].strong }}
                  >
                    <div className="titulo-tarjeta" style={{ color: SISTEMA_HEX[sisIdx].ink }}>
                      <NombreSistema n={CATALOGO_SISTEMAS[sisIdx].name} />
                    </div>
                    <dl className="mt-1.5 grid gap-y-1 text-[15px] sm:grid-cols-[8rem_1fr]">
                      <dt className="rotulo pt-0.5">Formato</dt>
                      <dd>{TABLAS.T1.filas[0].celdas[sisIdx].split(/;| \(/)[0]}</dd>
                      <dt className="rotulo pt-0.5">Sensores</dt>
                      <dd>{TABLAS.T1.filas[1].celdas[sisIdx].replace(/;/g, " ·")}</dd>
                    </dl>
                  </div>
                )}
                {!porSistema && !fila.unida && (
                  <>
                    <dl className="sm:columns-2 sm:gap-3 [&>div]:mb-3 [&>div]:break-inside-avoid">
                      {tabla.columnas.map((nombre, c) => {
                        return (
                          <div key={c} className="tarjeta p-3">
                            <dt className="rotulo mb-1" style={{ color: hex.ink }}>
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
                {/* 0.80.1 (cuarta ronda, R5): la nota de la Tabla 6 sobre retiradas de más de 1 h,
                    con su herramienta; 0.81.1 (quinta ronda, R5): después de la conducta. */}
                {sit.tabla === "T6" && tabla.notas[0] && (
                  <p className="max-w-[75ch] text-sm leading-snug text-slate-700">
                    <Texto>{tabla.notas[0]}</Texto>{" "}
                    <a
                      href={href("consultar", "interrupcion")}
                      className="tap-44 inline-block min-h-6 py-0.5 font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4"
                    >
                      Interrupción del sistema y pauta alternativa
                    </a>
                  </p>
                )}
                {/* 0.77.1 (auditoría de guardia): la sospecha de fallo se resuelve con la Figura 3;
                    su algoritmo, a un toque (antes, «Figura 3» llevaba a la lectura). */}
                {sit.id === "hiperglucemia-persistente" && (
                  <a href={href("consultar", "figura-3")} className="boton-primario">
                    Hiperglucemia y cetonemia (Figura 3)
                  </a>
                )}
                {/* 0.75.1 (auditoría): una sola línea de fuente (la tabla y lo añadido para el
                    sistema); los párrafos que la desarrollan, aparte, como lectura. */}
                <FuentePie
                  className="mt-0"
                  fuentes={[
                    {
                      texto: `Tabla ${tabla.numero}, ${paginasDe(tabla.paginas[0], tabla.paginas[1])}`,
                      ruta: rutaDeTabla(sit.tabla),
                    },
                    ...(porSistema && sisIdx >= 0 && TABLA4_POR_SISTEMA[sit.id]
                      ? fuentesDePiezas(TABLA4_POR_SISTEMA[sit.id][sisIdx].flatMap((b) => b.piezas))
                      : []),
                    ...(sit.tabla === "T6" && sisIdx >= 0
                      ? fuentesDePiezas([{ t: "casilla", tabla: "T1", fila: 1 }])
                      : []),
                  ]}
                />
                {sit.leer.length > 0 && (
                  <p className="fuente-pie">
                    Leer en el capítulo:{" "}
                    {sit.leer.map((l, k) => (
                      <span key={l.slug + (l.ancla ?? "")}>
                        {/* 0.81.1 (quinta ronda, guardia): el «·» al final de la línea, nunca al
                            principio de la siguiente. */}
                        {k > 0 && <span aria-hidden="true">&nbsp;· </span>}
                        <a
                          href={href("capitulo", l.slug, l.ancla)}
                          // 0.81.1 (quinta ronda, visual): en línea (inline-block abría corte
                          // antes del «·»).
                          className="tap-44 inline py-1"
                        >
                          {l.titulo}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
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
                          color: CATEGORIA_HEX.pacientes.strong,
                        },
                      ]
                    : []),
                  // 0.79.1 (tercera ronda, R3): la actuación ante el patrón posprandial (Tabla 5).
                  ...(sit.id === "comida-grasa"
                    ? [
                        {
                          href: href("consultar", "descarga", "6"),
                          t: "Patrón posprandial: descarga, paso 6",
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
                          t: `Plan de seguridad${sisIdx >= 0 ? ` · ${CORTO_SISTEMA[sisIdx]}` : ""}`,
                        },
                        // 0.74.2 (auditoría): el diagrama, la interrupción y la Tabla 4.
                        {
                          href: href("visual", "ejercicio"),
                          t: "Glucemia y ejercicio",
                        },
                        {
                          href: href("consultar", "interrupcion"),
                          t: "Interrupción del sistema y pauta alternativa",
                        },
                        {
                          href: href("consultar", "tablas", "T4"),
                          t: "Herramientas del sistema ante situaciones clínicas",
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

/* ---------- Interpretación de la descarga (Tabla 5 paso a paso) ---------- */
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
  // El paso actual, a la vista en la fila de botones (a 360 px, el 8 quedaba fuera; 0.72.0).
  const filaPasos = useRef<HTMLElement>(null);
  useEffect(() => {
    const fila = filaPasos.current?.querySelector("ol");
    const b = fila?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!fila || !b) return;
    const izq = b.offsetLeft - fila.offsetLeft;
    if (izq < fila.scrollLeft || izq + b.offsetWidth > fila.scrollLeft + fila.clientWidth)
      fila.scrollLeft = izq - (fila.clientWidth - b.offsetWidth) / 2;
  }, [n]);
  return (
    <div>
      <CabeceraEditorial titulo="Interpretación de la descarga" hex={hex} level={1} />
      {/* 0.72.0: los ocho pasos a la vista. Hasta el ordenador ancho, ocho botones numerados
          con el avance; en él, la lista con sus títulos a la izquierda. */}
      <nav ref={filaPasos} aria-label="Pasos de la descarga" className="no-imprimir mb-3 lg:hidden">
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
                  className={`chip h-11 w-full justify-center px-0 tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "" : i + 1 < n ? "text-slate-900" : "text-slate-500"}`}
                  style={!on && i + 1 < n ? { borderColor: "#8E254E" } : undefined}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-4">
        <nav
          aria-label="Pasos de la descarga"
          className="no-imprimir hidden lg:sticky lg:top-6 lg:block"
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
                    className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-[13px] leading-snug transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "tarjeta font-semibold text-slate-900" : "text-slate-700 hover:bg-white"}`}
                  >
                    <span className={`num ${on ? "num-on" : ""}`}>{i + 1}</span>
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
          className="pantalla-in tarjeta scroll-mt-4 p-4 focus:outline-none"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="titulo-seccion">{fila.celdas[0]}</h2>
          </div>
          <dl className="mt-3 divide-y md:grid md:grid-cols-3 md:gap-4 md:divide-y-0">
            {t.columnas.slice(1).map((col, j) => {
              return (
                <div key={col} className="py-2.5 md:py-0">
                  <dt className="rotulo mb-1">{col}</dt>
                  <dd className="text-[15px] text-slate-800">
                    <Lineas>{fila.celdas[j + 1]}</Lineas>
                  </dd>
                </div>
              );
            })}
          </dl>
          {CON_INTERPRETACIONES && <ComoInterpretar tabla="T5" fila={n - 1} />}
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
            <details className="mt-4" open>
              <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
                Patrones relacionados ({patrones.length})
              </summary>
              <ul className="mt-2 space-y-2">
                {patrones.map((p) => (
                  <li key={p.ancla} className="literal py-1 text-sm text-slate-800">
                    <strong>{p.b.lead} </strong>
                    <Texto>{p.b.texto}</Texto>
                  </li>
                ))}
              </ul>
              {/* 0.73.0: la página, al pie (antes, «p. 14 →» dentro de cada patrón). */}
              <FuentePie
                fuentes={[
                  {
                    texto: paginasPorApartado(
                      patrones.map((p) => p.b.p),
                      9,
                    ),
                    ruta: href("capitulo", "09-descarga", patrones[0].ancla),
                  },
                ]}
              />
            </details>
          )}
          {/* La bandera roja (paso 8) a mano desde cualquier paso (A09); 0.73.0: al pie del paso,
              discreta, en vez de una banda encima de cada uno. */}
          {n !== 8 && (
            <a
              href={href("consultar", "figura-3")}
              className="no-imprimir mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-red-800 hover:underline sm:min-h-8"
            >
              <Siren size={14} className="shrink-0" aria-hidden="true" />
              {TABLAS.T5.filas[7].celdas[0]}
              <ArrowRight size={13} className="shrink-0" aria-hidden="true" />
            </a>
          )}
          {/* 0.74.2 (auditoría): en el paso de las funciones temporales, sus herramientas por
              sistema (Tabla 4). */}
          {n === 5 && (
            <a
              href={href("consultar", "tablas", "T4")}
              className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Herramientas del sistema ante situaciones clínicas{" "}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
          {n === 8 && (
            <a
              href={href("consultar", "figura-3")}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white"
              style={{ background: hex.strong }}
            >
              Algoritmo de la Figura 3 <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
          <div className="separador mt-4 flex items-center justify-between border-t pt-3">
            {/* 0.72.0: en el primer y el último paso, sin el botón que no lleva a ningún sitio. */}
            <button
              type="button"
              disabled={n === 1}
              onClick={() => {
                alPaso();
                ir(n - 1);
              }}
              // 0.81.1 (quinta ronda, R3): `hidden` no podía con el display de .chip.
              className={`chip disabled:opacity-40 ${n === 1 ? "invisible" : ""}`}
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
              className={`inline-flex min-h-11 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40 ${n === 8 ? "invisible" : ""}`}
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
        <div className="rotulo mb-1.5">Véase también</div>
        <a href={href("consultar", "situacion", "ingreso-hospitalario::m4")} className="chip">
          Ingreso hospitalario: criterios para no continuar y paso a pauta subcutánea{" "}
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
