/* Recorridos de consulta construidos solo con el texto del capítulo:
   - Situaciones: eliges una situación (filas de las Tablas 4 y 6) y, si procede, un
     sistema, y ves la celda exacta más los párrafos del capítulo que la desarrollan.
   - Interpretación de la descarga: la Tabla 5 paso a paso (8 pasos), con el patrón relacionado.
   - Interrupción del sistema: el subapartado «Interrupción del sistema y pauta alternativa»
     como línea de tiempo (muy breve · hasta 2-3 h · prolongada), con los párrafos literales. */
import { OtraSituacion } from "../componentes/OtraSituacion";
import { ponerConsulta } from "../consultaBuscar";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Check, ChevronLeft, ChevronRight, Siren } from "lucide-react";
import { APARTADOS, TABLAS, idDeBloque, type Bloque, rutaDeTabla } from "../contenido";
import { INTERRUPCION_LINEA } from "../contenido/diagramas";
import { InterrupcionPantalla, ObjetivosDePoblacion } from "../componentes/Diagramas";
import { franjasEnTexto } from "../contenido/diagramas";
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
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { kDe, siglasPorPiezas, textosDePieza, type Pieza } from "../inicio";

import { anularNavegacionNueva, elegirRuta, fueNavegacionNueva, href, navegar } from "../rutas";

/* Abre una situación desde la lista con su propia entrada en el historial, sin la marca de
   navegación nueva (la pantalla es la misma: la Shell no debe moverla). */
let posicionLista = 0;
const apilarSituacion = (seccion: string, sub?: string, detalle?: string) => {
  posicionLista = window.scrollY;
  navegar(seccion, sub, detalle);
  anularNavegacionNueva();
};
import { ComoInterpretar } from "../componentes/ComoInterpretar";
import { casoPorId } from "../casos";
import { BotonImprimir, CabeceraEditorial, ColofonImpreso } from "../ui";
import { useImprimirConTeclado } from "../imprimirConTeclado";
import { recordarSistema, sistemaReciente } from "../sistemaReciente";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { useIrAlCambiar, useSubirAlElegir } from "../irAlCambiar";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { FuentePie } from "../componentes/FuentePie";
import { VeaseTambien } from "../componentes/VeaseTambien";
import { paginasPorApartado } from "../paginasApartado";
import { paginasDe } from "../paginas";
import { fuentesDePieza, fuentesDePiezas } from "../fuentesPiezas";
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
    // 0.83.1 (séptima ronda, R3): la hipoglucemia nocturna, en su grupo y con el sistema elegido
    // (antes, en «Resolución de incidencias» y al párrafo del capítulo con los cuatro).
    extras: [
      {
        t: "Hipoglucemia nocturna",
        fuente: "Tabla 4 · Apartado 9",
        ruta: href("consultar", "situacion", "sueno"),
        alias: ["noche", "nocturna", "dormir", "madrugada", "hipoglucemia"],
      },
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
      {/* 0.94.0 (rediseño, fase 2): sin el margen de arriba (el título va solo para el lector). */}
      <ol aria-label="Momentos">
        {momentos.map((m, i) =>
          i < desde ? null : (
            <li
              key={`${m.bloque}-${i}`}
              id={`momento-${i}`}
              // 0.97.1 (17.ª ronda, visual): en el móvil, sin la sangría de 40 px (el texto iba en
              // ~31 caracteres por línea a 360 px); el número, en la línea del título.
              className="relative scroll-mt-4 pb-1 pl-10 max-sm:pl-0"
            >
              {i < momentos.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[13px] top-8 w-0.5 max-sm:hidden"
                  style={{ background: "#e6dfe3" }}
                />
              )}
              {/* 0.92.0 (revisión de tarjetas, ★8): el número, en gris (en burdeos solo el paso
                  activo de un recorrido, como en la descarga); aquí van todos abiertos. */}
              <span aria-hidden="true" className="num absolute left-0 top-2.5 max-sm:hidden">
                {i - desde + 1}
              </span>
              <h3>
                <button
                  type="button"
                  aria-expanded={abierto(i)}
                  onClick={() => alternar(i)}
                  className="titulo-tarjeta flex min-h-11 w-full items-center justify-between gap-3 py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  {/* Sin el chevrón: cada momento va abierto de entrada (0.74.2); el título sigue
                      plegándolo. */}
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="num sm:hidden">
                      {i - desde + 1}
                    </span>
                    <span>
                      <span className="sr-only">{i - desde + 1}. </span>
                      {m.rotulo}
                    </span>
                  </span>
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
                  {/* 0.87.1 (undécima ronda, visual): con FuentePie, como el resto (orden del
                      capítulo, «Apartado 7» sin partir). */}
                  <FuentePie
                    className="mt-0"
                    fuentes={fuentesDeMomento(m)}
                    onIr={() => marcarEnRuta(i)}
                  />
                </div>
              )}
            </li>
          ),
        )}
      </ol>
    </section>
  );
}

/* 1.0.5 (21.ª ronda, R1; decisión del autor del 22-10-2026, «solo lo que aplica al sistema»): en
   la Tabla 6, con un sistema elegido, la columna de la bomba o el pod dice solo lo de su formato
   (Omnipod 5, pod; los otros tres, bomba con catéter): se quita la alternativa que no aplica
   («set o pod», «con bomba con catéter, …»). Sin sistema, la casilla tal cual. */
function segunFormato(tabla: string, c: number, sis: number, nombre: string, texto: string) {
  if (tabla !== "T6" || c !== 0 || sis < 0) return { nombre, texto };
  const pod = sis === 3;
  return {
    nombre: pod ? "Pod" : "Bomba",
    texto: pod
      ? texto
          .replace(/; con bomba con catéter, retirar también el set si la cánula es metálica/, "")
          .replace(/reconectar o colocar un set o pod nuevo/, "colocar un pod nuevo")
      : texto
          .replace(/con bomba con catéter, retirar también/, "retirar también")
          .replace(/set o pod nuevo/, "set nuevo"),
  };
}

/* La situación elegida, arriba y una sola vez: su icono, su nombre y «Cambiar» (en el móvil). */
function CabeceraSituacion({
  id,
  etiqueta,
  sistema,
}: {
  id: string;
  etiqueta: string;
  sistema?: string;
}) {
  void id;
  return (
    // 0.92.0 (revisión de tarjetas, ★2 y ★4): sin pleca (no es un sistema).
    // 0.94.0 (rediseño, fase 2): el asunto de la columna, como título de sección (17/700) sobre una
    // línea fina y sin caja: lo que sigue (la conducta) es lo que va en tarjetas.
    <div className="separador flex min-h-11 items-center gap-3 border-b pb-2">
      <div className="min-w-0 flex-1">
        <h2 className="titulo-seccion">{etiqueta}</h2>
      </div>
      {/* 1.0.5 (21.ª ronda, R1): «Otra situación», a la lista con el sistema elegido (antes,
          «Cambiar», que se confundía con cambiar de sistema y abría la lista debajo del detalle). */}
      <a
        href={href("consultar", "situacion", sistema ? `:${sistema}` : undefined)}
        className="chip shrink-0 lg:hidden"
      >
        ‹ Otra situación
      </a>
    </div>
  );
}

/* 0.96.0 (16.ª ronda, adjunto): un «Véase también» que lleva a la situación cuya fila de tabla ya
   enseña arriba la herramienta del sistema (en la enfermedad intercurrente, «Enfermedad leve, sin
   sospecha de fallo (Tabla 4)»), sobra mientras haya un sistema elegido. */
function yaArriba(guia: SituacionGuia, ruta: string, sis: number | undefined): boolean {
  if (sis === undefined || sis < 0) return false;
  const id = /^#\/consultar\/situacion\/([a-z0-9-]+)$/.exec(ruta)?.[1];
  const s = id && SITUACIONES.find((x) => x.id === id);
  if (!s) return false;
  return (GUIA_POR_SISTEMA[guia.id]?.bloques[sis] ?? []).some((b) =>
    b.piezas.some((p) => p.t === "casilla" && p.tabla === s.tabla && p.fila === s.fila),
  );
}

/* «Para seguir»: la hoja para el paciente, los apartados y la tabla entera. 0.92.0 (revisión de
   tarjetas, ★1): con VeaseTambien, la misma forma que en el resto de la app. */
const ParaSeguir = ({ filas }: { filas: { href: string; t: string }[] }) => (
  <VeaseTambien filas={filas} />
);

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
      {destino && <span className="shrink-0 text-xs font-normal text-slate-600">{destino}</span>}
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
          : // 0.96.0 (16.ª ronda, adjunto y R1): sin «Situación» (todas lo son en esta lista).
            undefined;
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
        {/* 0.92.0 (revisión de tarjetas, ★2): tarjeta de lista, título en tinta (sin color de área). */}
        <h2 className="titulo-tarjeta px-3 pb-1.5 pt-3">{tema.t}</h2>
        <ul className="filas" role="list">
          {sits.map((s) => {
            const on = sit?.id === s.id || activa === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    // 0.97.1 (17.ª ronda, R1): de la lista a una situación, una entrada nueva del
                    // historial (Atrás vuelve a la lista; antes, a la pantalla anterior a ella);
                    // de una situación a otra, sin apilar.
                    (sit ? elegirRuta : apilarSituacion)(
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
          {extras.map((x) => {
            // 0.96.0 (16.ª ronda, R3): «Hipoglucemia nocturna» lleva a «Sueño/período nocturno»:
            // con esa situación abierta, las dos filas se marcan como elegidas (es la misma). Las
            // dos se quedan: cada una es el nombre con el que se busca.
            const on = !!sit && x.ruta === href("consultar", "situacion", sit.id);
            return (
              <li key={x.ruta}>
                <a
                  href={
                    sistema && x.ruta.startsWith(href("consultar", "situacion"))
                      ? `${x.ruta}:${sistema}`
                      : x.ruta
                  }
                  aria-current={on ? "true" : undefined}
                  className={`${fila} ${on ? "text-white hover:!bg-[var(--acento)]" : ""}`}
                  style={on ? { background: hex.strong } : undefined}
                >
                  <Fila texto={x.t} destino={destinoDe(x.ruta)} on={on} />
                </a>
              </li>
            );
          })}
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
  const [cambiarSistema, setCambiarSistema] = useState(false);
  const sit = SITUACIONES.find((s) => s.id === situacion) || null;
  const guia = SITUACIONES_GUIA.find((s) => s.id === situacion) || null;
  // En el móvil, con una situación elegida el catálogo se pliega; «Otra situación» lleva a él.
  // Elegida otra situación (sobre todo una de las últimas de la lista), al principio de su texto.
  useSubirAlElegir(situacion ?? "", "detalle-situacion");
  // 0.97.1 (17.ª ronda, R1): con Atrás desde una situación, la lista donde se dejó (desde la barra
  // o el lateral, la Shell la abre arriba).
  const situacionPrevia = useRef(situacion);
  useEffect(() => {
    const antes = situacionPrevia.current;
    situacionPrevia.current = situacion;
    if (antes && !situacion && !fueNavegacionNueva()) window.scrollTo({ top: posicionLista });
  }, [situacion]);
  const sisIdx = sistema ? SIS_IDS.indexOf(sistema) : -1;
  // 0.87.1 (undécima ronda, guardia): el sistema de la situación, el último consultado (la
  // Figura 3 ofrece su plan de seguridad).
  useEffect(() => {
    if (sisIdx >= 0) recordarSistema(sisIdx);
  }, [sisIdx]);
  if (sisIdx >= 0) recordarSistema(sisIdx);
  const tabla = sit ? TABLAS[sit.tabla] : null;
  const fila = sit && tabla ? tabla.filas[sit.fila] : null;
  const porSistema = !!tabla?.porSistema && !fila?.unida;
  // 0.92.3 (15.ª ronda, guardia): lo que los apartados 9 y 10 añaden a la casilla, también con
  // los cuatro (antes, solo con un sistema elegido: «Hipoglucemia nocturna» no salía sin elegir):
  // lo de cada sistema en su tarjeta y lo común a los cuatro una vez, debajo.
  const anadido = (() => {
    const xs = sit ? TABLA4_POR_SISTEMA[sit.id] : undefined;
    if (!xs || !porSistema) return null;
    if (sisIdx >= 0) return { propios: xs.map((bs, c) => (c === sisIdx ? bs : [])), comun: [] };
    const clave = (p: Pieza) => JSON.stringify(p, (_, v) => (v instanceof RegExp ? String(v) : v));
    const enTodos = (p: Pieza) =>
      xs.every((bs) => bs.some((b) => b.piezas.some((q) => clave(q) === clave(p))));
    const comunes = (xs[0][0]?.piezas ?? []).filter(enTodos);
    // 0.96.0 (16.ª ronda, R3): lo que dicen igual dos o tres sistemas (en la comida grasa, «la
    // estrategia debe individualizarse…», de MiniMed 780G y Omnipod 5), también una vez, rotulado
    // con sus sistemas (antes, en cada tarjeta).
    const quien = new Map<string, { p: Pieza; cs: number[]; rotulo: string }>();
    xs.forEach((bs, c) =>
      bs.forEach((b) =>
        b.piezas.forEach((p) => {
          const k = clave(p);
          const q = quien.get(k);
          if (q) q.cs.push(c);
          else quien.set(k, { p, cs: [c], rotulo: b.rotulo });
        }),
      ),
    );
    const compartidas = [...quien.values()].filter((q) => q.cs.length > 1 && !enTodos(q.p));
    const ks = new Set([...comunes, ...compartidas.map((q) => q.p)].map(clave));
    const nombres = (cs: number[]) =>
      cs.length < 2
        ? CORTO_SISTEMA[cs[0]]
        : `${cs
            .slice(0, -1)
            .map((c) => CORTO_SISTEMA[c])
            .join(", ")} y ${CORTO_SISTEMA[cs[cs.length - 1]]}`;
    return {
      propios: xs.map((bs) =>
        bs
          .map((b) => ({ ...b, piezas: b.piezas.filter((p) => !ks.has(clave(p))) }))
          .filter((b) => b.piezas.length),
      ),
      comun: [
        ...(comunes.length
          ? [{ rotulo: `${xs[0][0].rotulo} · todos los sistemas`, piezas: comunes }]
          : []),
        ...compartidas.map((q) => ({ rotulo: `${q.rotulo} · ${nombres(q.cs)}`, piezas: [q.p] })),
      ],
    };
  })();
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
        <div className={sit || guia ? "hidden lg:block" : undefined}>
          {/* 0.96.0 (16.ª ronda, R3): desde la ficha de un sistema (#/consultar/situacion/:camaps),
              qué sistema va ya elegido en las situaciones que se abran, y cómo cambiarlo. */}
          {!sit && !guia && sisIdx >= 0 && (
            <div className="mb-3 text-sm text-slate-700">
              <p className="flex flex-wrap items-center gap-x-1.5">
                <span>
                  Sistema: <span className="font-semibold">{CORTO_SISTEMA[sisIdx]}</span>
                </span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  aria-expanded={cambiarSistema}
                  onClick={() => setCambiarSistema((x) => !x)}
                  className="tap-44 inline-flex min-h-11 items-center font-semibold underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 sm:min-h-6"
                >
                  cambiar
                </button>
              </p>
              {cambiarSistema && (
                <div className="mt-1.5">
                  <CasillasSistema
                    unico
                    etiqueta="Sistema"
                    nombres={CORTO_SISTEMA}
                    seleccion={[sisIdx]}
                    onToggle={(c) => {
                      setCambiarSistema(false);
                      elegirRuta(
                        "consultar",
                        "situacion",
                        c === sisIdx ? undefined : `:${SIS_IDS[c]}`,
                      );
                    }}
                  />
                </div>
              )}
            </div>
          )}
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
              <CabeceraSituacion id={guia.id} etiqueta={guia.etiqueta} sistema={sistema} />
              {/* 0.72.0: sin la frase de entrada (la regla de la 0.70.0; queda en la búsqueda). */}
              <div id="conducta-situacion" className="scroll-mb-28 scroll-mt-4" />
              {/* 0.73.0: primero lo de cada sistema (frases literales, src/porSistema.ts);
                  después los objetivos y lo común. */}
              {GUIA_POR_SISTEMA[guia.id] && (
                // 0.92.0 (revisión de tarjetas, ★11): en el móvil, 12 px (marco dentro de marco).
                // 0.94.0 (rediseño, fase 2): sin marco alrededor (el selector y la tarjeta del
                // sistema iban dentro de otra tarjeta).
                <section aria-label="Sistema a sistema">
                  {/* 0.80.1 (cuarta ronda, adjunto): sin sistema en la dirección, se dice cuál se
                      enseña y por qué. */}
                  {sisIdx < 0 && sistemaReciente() !== undefined && (
                    <p className="mb-2 text-xs text-slate-600">
                      Sistema elegido: el último consultado ({CORTO_SISTEMA[sistemaReciente()!]}).
                    </p>
                  )}
                  {/* 0.97.1 (17.ª ronda, senior): sin sistema elegido, qué sistemas tienen
                      autorización y evidencia en la gestación (Tabla 1, literal): antes había que
                      pulsar los cuatro. */}
                  {guia.id === "gestacion" && sisIdx < 0 && sistemaReciente() === undefined && (
                    <div className="mb-3">
                      <h2 className="titulo-tarjeta mb-2">{TABLAS.T1.filas[8].etiqueta}</h2>
                      <dl className="grid gap-2 sm:grid-cols-2">
                        {CORTO_SISTEMA.map((n, c) => (
                          <div
                            key={c}
                            className="casilla casilla-sistema px-3 py-2"
                            style={{ ["--sis" as string]: SISTEMA_HEX[c].strong }}
                          >
                            <dt
                              className="rotulo-sistema text-[13px]"
                              style={{ color: SISTEMA_HEX[c].ink }}
                            >
                              {n}
                            </dt>
                            <dd className="mt-0.5 whitespace-pre-line text-sm text-slate-800">
                              <Lineas>{TABLAS.T1.filas[8].celdas[c]}</Lineas>
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <FuentePie
                        className="mt-2"
                        fuentes={fuentesDePieza({ t: "casilla", tabla: "T1", fila: 8 })}
                      />
                    </div>
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
              {(() => {
                // Sin espacios ni mayúsculas para comparar («> 70 %» = «>70 %»).
                const plano = (t: string) => t.toLowerCase().replace(/\s+/g, "");
                const literal = plano(
                  guia.guion
                    .flatMap((m) => piezasDe(m).flatMap((pz) => textosDePieza(pz)))
                    .join(" "),
                );
                const yaEnTexto = (t: string) => literal.includes(plano(t.replace(/\.$/, "")));
                return guia.enlaces
                  .map((l) => /^#\/visual\/objetivos-mcg\/([a-z-]+)$/.exec(l.ruta)?.[1])
                  .filter((x): x is string => !!x && !franjasEnTexto(x, yaEnTexto))
                  .map((pob) => (
                    <section key={pob} aria-label="Objetivos de MCG" className="tarjeta p-4">
                      <ObjetivosDePoblacion id={pob} yaEnTexto={yaEnTexto} />
                    </section>
                  ));
              })()}
              <GuionVista
                momentos={guia.guion}
                clave={guia.id}
                momento={momento}
                inicial={MOMENTO_INICIAL[guia.id] ?? [0]}
              />
              {/* 0.92.0 (revisión de tarjetas, ★1): tarjeta de lista, no chips con flecha. */}
              <ParaSeguir
                filas={guia.enlaces
                  .filter((l) => !l.ruta.startsWith("#/visual/objetivos-mcg/"))
                  .filter((l) => !yaArriba(guia, l.ruta, sisIdx >= 0 ? sisIdx : sistemaReciente()))
                  .map((l) => ({ href: l.ruta, t: l.texto }))}
              />
            </div>
          )}
          {sit && tabla && fila && (
            <div key={sit.id} className="pantalla-in space-y-4">
              <CabeceraSituacion id={sit.id} etiqueta={sit.etiqueta} sistema={sistema} />
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
                  // 0.92.0 (revisión de tarjetas): la receta del aviso ámbar de la app (borde de
                  // 1 px y esquinas de 6 px, como en la calculadora), no un borde de 2 px.
                  className="scroll-mt-4 rounded-md border px-4 py-3"
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
                // 0.94.0 (rediseño, fase 2): sin marco alrededor: el selector, la tarjeta del
                // sistema y la casilla común van sobre el papel (antes, tarjeta dentro de tarjeta).
                className="scroll-mb-28 scroll-mt-4 space-y-3"
                aria-label="Conducta recomendada"
              >
                {(porSistema || sit.tabla === "T6") && (
                  <div>
                    {/* 0.91.3 (14.ª ronda, adjunto): «Los cuatro», junto al selector (antes,
                        suelto entre la tarjeta y la fuente). */}
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="rotulo">Sistema</span>
                      {porSistema && sisIdx >= 0 && (
                        <button
                          type="button"
                          onClick={() => elegirRuta("consultar", "situacion", sit.id)}
                          // 0.96.0 (16.ª ronda, visual): 44 px de alto también a la vista en el
                          // móvil (no solo la zona ampliada).
                          className="tap-44 inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700 sm:min-h-0"
                        >
                          Los cuatro
                        </button>
                      )}
                    </div>
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
                              {/* 0.96.0 (16.ª ronda, R5): el nombre corto de toda la app en
                                  tarjetas y casillas; el comercial, en la ficha y el selector de
                                  Sistemas. */}
                              <NombreSistema n={CORTO_SISTEMA[c] ?? nombre} />
                            </span>
                          </div>
                          <p className="px-4 py-2.5 text-[15px] text-slate-800">
                            <Lineas>
                              {fila.celdas[c].replace(
                                /configurable Objetivo:/,
                                "configurable\nObjetivo:",
                              )}
                            </Lineas>
                          </p>
                          {/* 0.73.0: lo que los apartados 9 y 10 añaden para ese sistema. 0.92.0
                              (revisión de tarjetas, ★10): dentro de su tarjeta, en casillas grises
                              (antes, otra tarjeta con la misma pleca debajo). */}
                          {anadido && anadido.propios[c].length > 0 && (
                            <div className="px-4 pb-3">
                              <AnadidoDelSistema c={c} bloques={anadido.propios[c]} sinFuente />
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
                {anadido && anadido.comun.length > 0 && (
                  <AnadidoDelSistema c={0} bloques={anadido.comun} sinFuente />
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
                      <NombreSistema n={CORTO_SISTEMA[sisIdx]} />
                    </div>
                    <dl className="mt-1.5 grid gap-y-1 text-[15px] sm:grid-cols-[8rem_1fr]">
                      <dt className="rotulo pt-0.5">Formato</dt>
                      <dd>{TABLAS.T1.filas[0].celdas[sisIdx].split(/;| \(/)[0]}</dd>
                      <dt className="rotulo pt-0.5">Sensores</dt>
                      <dd>{TABLAS.T1.filas[1].celdas[sisIdx].replace(/;/g, " ·")}</dd>
                    </dl>
                  </div>
                )}
                {/* El rótulo de la fila ya está en la cabecera; aquí, lo común a los cuatro si lo trae.
                    0.92.0 (revisión de tarjetas, ★10): siempre en el mismo sitio, después del
                    selector y de la tarjeta del sistema, y en casilla gris sin pleca (no es de un
                    sistema). */}
                {(() => {
                  const comun = fila.etiqueta.split("\n").slice(1);
                  return (
                    <>
                      {(comun.length > 0 || fila.unida) && (
                        <div className="casilla px-3 py-2.5">
                          <span className="rotulo mb-0.5 block">Todos los sistemas</span>
                          <span className="block text-[15px] font-semibold leading-snug text-slate-900">
                            <Lineas>{fila.unida ? fila.celdas[0] : comun.join("\n")}</Lineas>
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
                {!porSistema && !fila.unida && (
                  <>
                    <dl className="sm:columns-2 sm:gap-3 [&>div]:mb-3 [&>div]:break-inside-avoid">
                      {tabla.columnas.map((nombre, c) => {
                        const f = segunFormato(sit.tabla, c, sisIdx, nombre, fila.celdas[c]);
                        return (
                          <div key={c} className="tarjeta p-3">
                            <dt className="rotulo mb-1" style={{ color: hex.ink }}>
                              {f.nombre}
                            </dt>
                            <dd className="text-base text-slate-800">
                              <Lineas>
                                {f.texto.replace(
                                  /configurable Objetivo:/,
                                  "configurable\nObjetivo:",
                                )}
                              </Lineas>
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </>
                )}
                {/* 0.80.1 (cuarta ronda, R5): la nota de la Tabla 6 sobre retiradas de más de 1 h,
                    con su herramienta; 0.81.1 (quinta ronda, R5): después de la conducta. */}
                {/* 1.0.3 (19.ª ronda, R1; decisión del autor del 22-10-2026): la frase del umbral
                    («más de aproximadamente 1 h»), en su propia línea, con su herramienta; el resto
                    de la nota, debajo. Texto literal, solo separado. */}
                {sit.tabla === "T6" &&
                  tabla.notas[0] &&
                  (() => {
                    const frases = tabla.notas[0].split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚ])/);
                    const umbral = frases.find((f) => /aproximadamente 1\s?h\b/.test(f));
                    const resto = frases.filter((f) => f !== umbral).join(" ");
                    const enlace = (
                      <a
                        href={href("consultar", "interrupcion")}
                        className="tap-44 inline-block min-h-6 py-0.5 font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4"
                      >
                        Interrupción del sistema y pauta alternativa
                      </a>
                    );
                    return (
                      <>
                        {umbral && (
                          <p className="max-w-[75ch] border-l-2 border-[var(--linea-fuerte)] pl-3 text-[15px] font-semibold leading-snug text-slate-900">
                            <Texto>{umbral}</Texto> {enlace}
                          </p>
                        )}
                        {/* 1.0.7 (revisión R105-06): el resto de la nota, rotulado como lo que es
                            (general de la tabla, no de esta prueba), en el mismo sitio y con su
                            texto; sin el «Nota:» inicial, que dice el rótulo. */}
                        <div className="separador max-w-[75ch] border-t pt-2">
                          <span className="rotulo mb-0.5 block">Nota general de la Tabla 6</span>
                          <p className="text-sm leading-snug text-slate-700">
                            <Texto>
                              {resto.replace(/^Nota:\s*/, "").replace(/^./, (x) => x.toUpperCase())}
                            </Texto>
                            {!umbral && <> {enlace}</>}
                          </p>
                        </div>
                      </>
                    );
                  })()}
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
                    ...(porSistema && anadido
                      ? fuentesDePiezas(
                          [...anadido.propios.flat(), ...anadido.comun].flatMap((b) => b.piezas),
                        )
                      : []),
                    ...(sit.tabla === "T6" && sisIdx >= 0
                      ? fuentesDePiezas([{ t: "casilla", tabla: "T1", fila: 1 }])
                      : []),
                  ]}
                />
                {/* 1.0.9 (22.ª ronda, visual): con la letra y el peso de las otras pantallas (antes,
                    gris de 13 px como la fuente). */}
                {sit.leer.length > 0 && (
                  <p className="text-sm font-semibold text-slate-700">
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
                          {/* 0.90.1 (14.ª ronda, visual): en su span, por encima del área
                              ampliada del enlace de la línea de abajo (.fuente-pie a > span). */}
                          <span>{l.titulo}</span>
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
                        },
                      ]
                    : []),
                  // 0.92.3 (15.ª ronda, R3): y el nocturno, desde el sueño.
                  ...(sit.id === "sueno"
                    ? [
                        // 0.95.1 (16.ª ronda, guardia): el tratamiento de la hipoglucemia, a mano.
                        { href: href("visual", "hipoglucemia"), t: "Hipoglucemia en asa cerrada" },
                        {
                          href: href("consultar", "descarga", "5"),
                          t: "Patrón nocturno: descarga, paso 5",
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
  // 0.96.1 (revisión de Codex, V95-04): un entero del 1 al 8; cualquier otra cosa («4.5», «x»,
  // «-2», «12»), el paso 1 (antes, «4.5» rompía la pantalla).
  const pedido = Number(paso);
  const n = Number.isInteger(pedido) && pedido >= 1 && pedido <= 8 ? pedido : 1;
  const fila = t.filas[n - 1];
  const patrones = parrafosConLead(PATRON_DEL_PASO[n] || []);
  const ir = (k: number) => elegirRuta("consultar", "descarga", String(k));
  const alPaso = useIrAlCambiar(String(n), "paso-descarga");
  // 0.89.1 (13.ª ronda, R3): el paso, con su botón de imprimir (y Ctrl+P, igual).
  const raiz = useRef<HTMLDivElement>(null);
  useImprimirConTeclado(raiz);
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
    // 0.90.1 (14.ª ronda, R3 y visual): la región que se imprime (sin la clase, la hoja salía en
    // blanco: con `imprimiendo`, todo lo que no es `.imprimible` se oculta).
    <div ref={raiz} className="imprimible">
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
              <li key={i} className="min-w-10 flex-1 min-[380px]:min-w-11">
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
        {/* 0.87.1 (undécima ronda, R3): en papel, el orden de los 8 pasos (con el que se imprime
            marcado) delante del paso; en pantalla ya está en la columna de la izquierda. */}
        <ol className="mb-3 hidden list-decimal gap-x-8 pl-5 text-sm print:block print:columns-2">
          {t.filas.map((f, i) => (
            <li key={i} className={i + 1 === n ? "font-bold" : ""}>
              {f.celdas[0]}
            </li>
          ))}
        </ol>
        <section
          key={n}
          id="paso-descarga"
          tabIndex={-1}
          className="pantalla-in tarjeta scroll-mt-4 p-4 focus:outline-none"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="titulo-seccion">{fila.celdas[0]}</h2>
            <span className="no-imprimir">
              <BotonImprimir objetivo={raiz} compacto titulo="Imprimir este paso">
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Imprimir este paso
                </span>
              </BotonImprimir>
            </span>
          </div>
          <dl className="mt-3 md:grid md:grid-cols-3 md:gap-4 print:grid print:grid-cols-3 print:gap-4">
            {t.columnas.slice(1).map((col, j) => {
              return (
                // 0.94.0 (rediseño, fase 2): desde md, cada columna abre con su línea capilar, como
                // los datos de las fichas. 0.96.0 (16.ª ronda, visual y R3): las tres (el
                // `md:divide-y-0` de la lista quitaba la de la segunda y la tercera); en el móvil,
                // una línea entre ellas.
                <div
                  key={col}
                  className="border-t border-[var(--linea-suave)] py-2.5 first:border-t-0 md:pb-0 md:pt-2.5 md:first:border-t print:first:border-t"
                >
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
              <summary className="con-chevron min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
                Patrones relacionados ({patrones.length})
              </summary>
              {/* 0.89.1 (13.ª ronda, R3): en papel, algo más compactos (el paso 4 dejaba una
                  segunda hoja con tres líneas y la fuente). */}
              <ul className="mt-2 space-y-2 print:space-y-1">
                {patrones.map((p) => (
                  <li
                    key={p.ancla}
                    className="literal py-1 text-sm text-slate-800 print:text-[12.5px] print:leading-snug"
                  >
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
              // 0.88.1 (duodécima ronda, R3): sin el enlace en papel (pasaba solo a otra cara).
              className="no-imprimir mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Herramientas del sistema ante situaciones clínicas{" "}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
          {/* 1.0.0 (18.ª ronda, R3): en los pasos que piden ajustar «según el sistema» (2) o
              remiten a la Tabla 3 (5), el ajuste de cada sistema, a un toque. */}
          {(n === 2 || n === 5) && (
            <a
              href={href("sistemas", "todos", "parametros")}
              className="no-imprimir mt-2 flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
            >
              Ajuste de los parámetros por sistema (Tabla 3)
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
          {/* 0.86.1 (décima ronda, R3): sin los botones de paso en papel. */}
          <div className="separador no-imprimir mt-4 flex items-center justify-between border-t pt-3">
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
              // 0.96.0 (16.ª ronda, visual): a la altura del chip de «‹ Paso N» (44 px en el móvil, 36 desde sm).
              className={`inline-flex min-h-11 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40 sm:min-h-9 ${n === 8 ? "invisible" : ""}`}
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
      {/* 0.92.3 (15.ª ronda, R3): en papel, de dónde sale la hoja (como en la ficha). */}
      <ColofonImpreso />
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
      <OtraSituacion />
      {/* 0.94.0 (rediseño, fase 2): «pantalla-interrupcion» pone el cuerpo a la letra de consulta. */}
      <div className="diagrama-grande pantalla-interrupcion">
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
      <VeaseTambien
        className="no-imprimir mt-4"
        filas={[
          {
            href: href("consultar", "situacion", "ingreso-hospitalario::m4"),
            t: "Ingreso hospitalario: criterios para no continuar y paso a pauta subcutánea",
          },
        ]}
      />
    </div>
  );
}
