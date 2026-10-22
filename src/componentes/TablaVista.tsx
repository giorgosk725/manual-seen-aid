/* Una tabla del capítulo. Dos modos:
   - lectura: la tabla completa, cabecera pegada, scroll horizontal en móvil; por debajo de
     md cada fila se muestra como tarjeta (una tabla de 5 columnas no cabe en un teléfono).
   - interactiva: además, filtros. En las tablas por sistema se eligen uno o varios sistemas
     (1 = fichas grandes; 2–3 = columnas elegidas; todos = tabla completa). En las demás, un
     filtro por fila (p. ej. Tabla 6, por procedimiento). La selección viaja en la ruta
     (`T1:minimed-780g+omnipod-5`, `T6:3`) para poder compartirla. */
import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE, NOTAS_POR_TABLA } from "../notas-complementarias";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import type { Tabla, TablaId } from "../contenido";
import { Lineas, Texto } from "../texto";
import { Enlace, PaginaBadge } from "../ui";
import { BRAND_ACCENT, SISTEMA_HEX } from "../tokens";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";
import { CasillasSistema } from "./CasillasSistema";
import { NombreSistema } from "./NombreSistema";
import { TituloBloque } from "../nivel";
import { FuentePie } from "./FuentePie";
import { sinCortes } from "../sinCortes";
import { paginasDe } from "../paginas";
import { rutaDeTabla } from "../contenido";

const CORTOS = ["MiniMed 780G", "Control-IQ", "CamAPS", "Omnipod 5"];

/* La herramienta de la app que recorre cada tabla, desde la lectura del capítulo. */
const HERRAMIENTA_DE_TABLA: Record<string, { texto: string; ruta: string }> = {
  T2: { texto: "Iniciación del sistema por fases", ruta: href("consultar", "inicio") },
  T4: { texto: "Situaciones", ruta: href("consultar", "situacion") },
  T5: {
    texto: "Interpretación de la descarga por pasos",
    ruta: href("consultar", "descarga", "1"),
  },
  T6: { texto: "Situaciones", ruta: href("consultar", "situacion") },
};
const slugDe = (c: number) => CORTOS[c].toLowerCase().replace(/\s/g, "-");

/* 0.96.0 (16.ª ronda, adjunto, visual y R5): el nombre de la columna de un sistema. En las
   herramientas (comparación de Sistemas, Tablas con selector), el nombre corto de toda la app
   («MiniMed 780G», «Control-IQ / Control-IQ+», «CamAPS FX», «Omnipod 5»; el comercial completo
   va en la ficha y en el selector de Sistemas). En la tabla tal como va en la lectura del
   capítulo, la cabecera literal de la tabla publicada («Tandem Control-IQ», «myLoop CamAPS»): es
   texto de la tabla y allí se conserva. Regla en docs/DISENO_VISUAL.md, §18. */
const nombreColumna = (tabla: Tabla, c: number, literal: boolean) =>
  tabla.porSistema && !literal ? CORTO_SISTEMA[c] : tabla.columnas[c];
/* La columna de rótulos (0.95.1: más ancha en las tablas de rótulo largo, 3 y 4). */
/* 1.0.1 (19.ª ronda, visual): la de las Tablas 3 y 4, 10 rem por debajo de 1280 px
   (--ancho-rotulos-34, index.css): en la pantalla Tablas la columna mide 692 px. */
const anchoRotulos = (tabla: Tabla) =>
  tabla.id === "T4" || tabla.id === "T3"
    ? "var(--ancho-rotulos-34, 12rem)"
    : "var(--ancho-celda-tabla, 10rem)";

/* «Viendo: MiniMed 780G y Omnipod 5»: qué selección está activa, con palabras. */
const listaNombres = (n: string[]) =>
  n.length < 2 ? n.join("") : `${n.slice(0, -1).join(", ")} y ${n[n.length - 1]}`;

/* 0.91.2 (decisión del responsable, 21-10-2026: «lo que consideres mejor»): una celda común a los
   cuatro (Tabla 4, «Ejercicio anaeróbico…», corrección 7/11) se enseña entera con los cuatro; con
   una selección, sin la frase que empieza por «En <sistema>,» de un sistema que no está elegido
   (al comparar MiniMed 780G y Omnipod 5, sin «En CamAPS FX, no usar Boost…»). Solo se omite esa
   frase: el resto, literal. */
function celdaUnida(tabla: Tabla, texto: string, columnas: number[]): string {
  if (columnas.length >= tabla.columnas.length) return texto;
  const frases = texto.split(/(?<=\.) (?=En [A-ZÁÉÍÓÚ])/);
  const quedan = frases.filter((f) => {
    const m = /^En ([^,]+),/.exec(f);
    if (!m) return true;
    const nombre = m[1].split(" ")[0];
    const c = tabla.columnas.findIndex((x) => x.includes(nombre));
    return c < 0 || columnas.includes(c);
  });
  return quedan.length === frases.length ? texto : quedan.join(" ").replace(/\.$/, "");
}

export function CabeceraTabla({
  tabla,
  enlaceConsultar,
  herramienta = false,
}: {
  tabla: Tabla;
  enlaceConsultar?: boolean;
  /* Dentro de una herramienta: solo el título (la fuente va al pie). */
  herramienta?: boolean;
}) {
  if (herramienta)
    return (
      <div className="mb-2">
        <TituloBloque className="titulo-tarjeta text-slate-800">{tabla.titulo}</TituloBloque>
      </div>
    );
  return (
    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
      <div>
        <div className="rotulo" style={{ color: BRAND_ACCENT.ink }}>
          Tabla {tabla.numero}
        </div>
        <TituloBloque className="titulo-tarjeta text-slate-800">{tabla.titulo}</TituloBloque>
      </div>
      <div className="flex items-center gap-2">
        <PaginaBadge p={tabla.paginas[0]} p2={tabla.paginas[1]} />
        {enlaceConsultar && (
          <Enlace
            href={href("consultar", "tablas", tabla.id)}
            className="chip no-imprimir tap-44 min-h-9 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-8"
          >
            <ExternalLink size={12} aria-hidden="true" />
            {tabla.porSistema ? "Ver por sistema" : "Abrir la tabla"}
          </Enlace>
        )}
        {enlaceConsultar && HERRAMIENTA_DE_TABLA[tabla.id] && (
          <Enlace
            href={HERRAMIENTA_DE_TABLA[tabla.id].ruta}
            className="chip no-imprimir min-h-9 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-8"
          >
            <ExternalLink size={12} aria-hidden="true" />
            {HERRAMIENTA_DE_TABLA[tabla.id].texto}
          </Enlace>
        )}
      </div>
    </div>
  );
}

function Notas({ notas }: { notas: string[] }) {
  return (
    <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">
      {/* 0.79.1: a ≈ 75 caracteres por línea en pantalla (a 1920 llegaban a 190); en papel, a todo
          lo ancho. */}
      {notas.map((n, i) => (
        <p key={i} className="max-w-[75ch] print:max-w-none">
          <Texto>{sinCortes(n)}</Texto>
        </p>
      ))}
    </div>
  );
}

/* Tabla completa (o con las columnas elegidas). */
function TablaHTML({
  tabla,
  columnas,
  iconoFila,
  resaltar,
  literal,
}: {
  tabla: Tabla;
  columnas: number[];
  iconoFila?: (i: number) => ReactNode;
  /* 0.85.1 (novena ronda, R5): la fila pedida, marcada (comparación de varios sistemas). */
  resaltar?: number;
  /* La tabla en la lectura del capítulo: cabeceras literales. */
  literal: boolean;
}) {
  // 0.72.0: si la tabla cabe a lo ancho, sin caja de desplazamiento propia (clase «cabe»): la
  // cabecera se queda pegada al bajar por la página. Si no cabe, se desplaza a lo ancho.
  const caja = useRef<HTMLDivElement>(null);
  const [cabe, setCabe] = useState(false);
  useEffect(() => {
    const el = caja.current;
    const t = el?.querySelector("table");
    if (!el || !t || typeof ResizeObserver === "undefined") return;
    const medir = () => setCabe(t.offsetWidth <= el.clientWidth + 2);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [columnas.length]);
  return (
    <div
      ref={caja}
      className={`tabla-scroll fade-right-scroll tarjeta focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${cabe ? "cabe" : ""}`}
      tabIndex={0}
      role="region"
      aria-label={`Tabla ${tabla.numero}, desplazable`}
    >
      {/* 0.96.0 (16.ª ronda, adjunto, visual y R3): en las tablas por sistema, columnas de sistema
          iguales (`table-layout: fixed`, la de rótulos con su ancho), también con dos sistemas; el
          ancho mínimo hace que, si no cabe (1024 px), se desplace dentro de su caja como antes. */}
      <table
        className={`tabla-capitulo w-full border-collapse text-sm ${tabla.porSistema ? "tabla-iguales" : ""}`}
        style={
          tabla.porSistema
            ? // 1.0.0 (18.ª ronda, senior y visual): 8,25 rem por sistema (antes, 9,25): con los
              // cuatro, 720 px, que caben en la columna de las comparaciones (726 px) entre 768 y 1279 px (antes la de
              // Omnipod 5 quedaba cortada, sin pista de desplazamiento).
              { minWidth: `calc(${anchoRotulos(tabla)} + ${columnas.length} * 8.25rem)` }
            : undefined
        }
      >
        <caption className="sr-only">
          Tabla {tabla.numero}. {tabla.titulo}
        </caption>
        {tabla.porSistema && (
          <colgroup>
            <col style={{ width: anchoRotulos(tabla) }} />
            {columnas.map((c) => (
              <col key={c} />
            ))}
          </colgroup>
        )}
        <thead>
          <tr>
            <th scope="col" className="rotulo px-3 py-2 text-left align-middle">
              {tabla.cabeceraEtiqueta}
            </th>
            {/* 0.94.0 (rediseño): cabecera en el papel, no en marino; cada sistema con su filete
                superior de 3 px (`--sis`, que el nocturno aclara), su foto y su nombre con su
                grafía («myLoop CamAPS», no «MYLOOP CAMAPS»), en su tinta. */}
            {columnas.map((c) => (
              <th
                key={c}
                scope="col"
                className={
                  tabla.porSistema
                    ? "cabeza-sistema px-3 pb-2 pt-2.5 text-left"
                    : "rotulo px-3 py-2 text-left"
                }
                style={
                  tabla.porSistema ? { ["--sis" as string]: SISTEMA_HEX[c].strong } : undefined
                }
              >
                {tabla.porSistema ? (
                  <span className="flex items-center gap-2">
                    <img
                      src={FOTO_SISTEMA[ORDEN_SISTEMAS[c]]}
                      alt=""
                      className="foto-sistema h-7 w-7 shrink-0 rounded-md border border-[var(--linea-suave)] bg-white object-cover"
                    />
                    <span
                      className="text-sm font-bold leading-tight"
                      style={{ color: SISTEMA_HEX[c].ink }}
                    >
                      {/* Con el nombre corto, la línea solo cambia en la barra («Control-IQ / ⏎
                          Control-IQ+»). */}
                      {/* 1.0.0: por palabra también con el nombre corto: a 720 px de tabla,
                          «MiniMed 780G» con su foto no cabía en su columna. */}
                      <NombreSistema n={nombreColumna(tabla, c, literal)} porPalabra />
                    </span>
                  </span>
                ) : (
                  <NombreSistema n={tabla.columnas[c]} porPalabra />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((f, i) => (
            <tr
              key={i}
              data-fila={i}
              className={`align-top ${resaltar === i ? "fila-resaltada" : ""}`}
            >
              <th
                scope="row"
                className="separador border-t px-3 py-2 text-left text-xs font-bold text-slate-800"
                // 0.77.1 (auditorías R3 y senior): columnas algo más estrechas, para que la tabla de
                // los cuatro sistemas quepa entera en la columna de lectura (antes, 848 px en 734).
                // 0.80.1: en la Tabla 4, rótulos largos: columna más ancha (6–7 líneas a 1920).
                // 0.95.1: rótulos de fila más anchos en las tablas de rótulo largo (en la Tabla 3, «Objetivo
                // glucémico y funciones temporales…» iba en seis líneas).
                style={{ minWidth: anchoRotulos(tabla) }}
              >
                <span className="flex items-start gap-1.5">
                  {iconoFila?.(i)}
                  {/* En la Tabla 4, lo que sigue al nombre de la situación es la conducta común:
                      debajo y en gris, como en la vista de un sistema (0.72.0). */}
                  {tabla.id === "T4" ? (
                    <span>
                      {f.etiqueta.split("\n").map((l, k) => (
                        <span
                          key={k}
                          className={
                            k === 0
                              ? "block"
                              : "mt-1 block text-xs font-normal leading-snug text-slate-600"
                          }
                        >
                          <Texto>{sinCortes(l)}</Texto>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span>
                      <Lineas>{sinCortes(f.etiqueta)}</Lineas>
                    </span>
                  )}
                </span>
              </th>
              {f.unida ? (
                <td
                  colSpan={columnas.length}
                  className="separador border-l border-t px-3 py-2 text-slate-800"
                >
                  <Lineas>{sinCortes(celdaUnida(tabla, f.celdas[0], columnas))}</Lineas>
                </td>
              ) : (
                columnas.map((c) => (
                  // 0.94.0 (rediseño): celdas blancas con líneas capilares (antes, un mosaico de
                  // cajas tintadas con 2 px de blanco); la identidad, en la cabecera.
                  <td
                    key={c}
                    className="separador border-l border-t px-3 py-2 text-slate-800"
                    style={
                      tabla.porSistema ? undefined : { minWidth: "var(--ancho-celda-tabla, 10rem)" }
                    }
                  >
                    <Lineas>
                      {sinCortes(
                        f.celdas[c].replace(/configurable Objetivo:/, "configurable\nObjetivo:"),
                      )}
                    </Lineas>
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Fichas por fila (móvil, o tablas no comparativas). */
function Fichas({
  tabla,
  columnas,
  filas,
  resaltar,
  literal = false,
}: {
  tabla: Tabla;
  columnas: number[];
  filas?: number[];
  resaltar?: number;
  literal?: boolean;
}) {
  const idx = filas ?? tabla.filas.map((_, i) => i);
  return (
    <ol className="space-y-3">
      {idx.map((i) => {
        const f = tabla.filas[i];
        return (
          <li
            key={i}
            data-fila={i}
            className={`tarjeta p-3 ${resaltar === i ? "fila-resaltada" : ""}`}
          >
            <div className="titulo-tarjeta mb-2">
              {/* 0.81.1 (quinta ronda, visual): la conducta común que sigue al nombre, debajo y
                  en gris, como en la tabla del ordenador (antes, cuatro líneas en negrita). */}
              {tabla.id !== "T4" ? (
                <Lineas>
                  {sinCortes(
                    /^\d+$/.test(f.etiqueta)
                      ? `${tabla.cabeceraEtiqueta} ${f.etiqueta}`
                      : f.etiqueta,
                  )}
                </Lineas>
              ) : (
                f.etiqueta.split("\n").map((l, k) => (
                  <span
                    key={k}
                    className={
                      k === 0
                        ? "block"
                        : "mt-1 block text-[13px] font-normal leading-snug text-slate-600"
                    }
                  >
                    {sinCortes(l)}
                  </span>
                ))
              )}
            </div>
            <dl className="space-y-2">
              {(f.unida ? [columnas[0]] : columnas).map((c) => (
                <div
                  key={c}
                  className="border-l-[3px] py-0.5 pl-2.5"
                  // 0.78.1: el filete del sistema lee `--sis` (en nocturno, su tinta clara).
                  // 0.96.0 (16.ª ronda, visual): la fila común de la Tabla 4 (`unida`), con pleca
                  // y rótulo neutros (llevaba los de MiniMed 780G, la primera columna).
                  style={
                    tabla.porSistema && !f.unida
                      ? { ["--sis" as string]: SISTEMA_HEX[c].strong, borderColor: "var(--sis)" }
                      : { borderColor: "var(--linea-fuerte)" }
                  }
                >
                  {/* 0.96.0 (16.ª ronda, visual y adjunto): el nombre del sistema con su grafía y
                      en su tinta, 14/700 (antes, en MAYÚSCULAS grises de 12 px). */}
                  {f.unida ? (
                    <dt className="rotulo-sistema text-slate-600">Todos los sistemas</dt>
                  ) : tabla.porSistema ? (
                    <dt className="rotulo-sistema" style={{ color: SISTEMA_HEX[c].ink }}>
                      {nombreColumna(tabla, c, literal)}
                    </dt>
                  ) : (
                    <dt className="rotulo">{tabla.columnas[c]}</dt>
                  )}
                  <dd className="mt-0.5 text-[15px] text-slate-800">
                    <Lineas>
                      {sinCortes(
                        (f.unida ? celdaUnida(tabla, f.celdas[0], columnas) : f.celdas[c]).replace(
                          /configurable Objetivo:/,
                          "configurable\nObjetivo:",
                        ),
                      )}
                    </Lineas>
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        );
      })}
    </ol>
  );
}

/* Ficha de UN sistema: característica → valor, en una columna de lectura. */
function FichaSistema({ tabla, c, resaltar }: { tabla: Tabla; c: number; resaltar?: number }) {
  const hex = SISTEMA_HEX[c];
  // La fila de la que se viene, a la vista al abrir (una vez).
  useEffect(() => {
    if (resaltar === undefined) return;
    document.getElementById(`fila-${tabla.id}-${resaltar}`)?.scrollIntoView?.({ block: "center" });
  }, [resaltar, tabla.id]);
  return (
    <div className="tarjeta tarjeta-sistema" style={{ ["--sis" as string]: hex.strong }}>
      <div className="titulo-seccion px-4 pt-4" style={{ color: hex.ink }}>
        {nombreColumna(tabla, c, false)}
      </div>
      <dl className="divide-y px-4 pb-2">
        {tabla.filas.map((f, i) => (
          <div
            key={i}
            id={`fila-${tabla.id}-${i}`}
            className={`grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4 ${resaltar === i ? "fila-resaltada -mx-4 px-4" : ""}`}
            aria-current={resaltar === i ? "location" : undefined}
          >
            {/* 0.72.0: el nombre de la fila en minúscula y negrita (en versalitas de 11 px costaba
                leerlo); lo que sigue en su casilla —la conducta común—, debajo y en gris. */}
            <dt className="text-sm leading-snug">
              {f.etiqueta.split("\n").map((l, k) => (
                <span
                  key={k}
                  className={
                    k === 0
                      ? "block font-bold text-slate-900"
                      : "mt-1 block text-[13px] font-normal text-slate-600"
                  }
                >
                  <Texto>{sinCortes(l)}</Texto>
                </span>
              ))}
            </dt>
            <dd className="text-[15px] text-slate-800">
              <Lineas>
                {sinCortes(
                  (f.unida ? celdaUnida(tabla, f.celdas[0], [c]) : f.celdas[c]).replace(
                    /configurable Objetivo:/,
                    "configurable\nObjetivo:",
                  ),
                )}
              </Lineas>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function TablaVista({
  tabla,
  modo = "lectura",
  seleccionInicial,
  onSeleccion,
  ayuda,
  columnasFijas,
  herramienta = false,
  iconoFila,
  resaltarFila,
}: {
  tabla: Tabla;
  /* La fila de la que se viene (rótulo de una ficha operativa): marcada en la vista del sistema. */
  resaltarFila?: number;
  /* Dentro de una herramienta (comparación de Sistemas): la fuente al pie, no arriba. */
  herramienta?: boolean;
  /* Icono para el rótulo de cada fila (lo da quien la usa: Sistemas). */
  iconoFila?: (i: number) => ReactNode;
  modo?: "lectura" | "interactiva";
  seleccionInicial?: string;
  /* Columnas (sistemas) decididas fuera, sin selector propio (comparación de Sistemas). */
  columnasFijas?: number[];
  /* Rótulo del selector de sistemas, según la tarea («Sistema que quieres consultar»). */
  ayuda?: string;
  /* Al cambiar la selección: los sistemas («a+b») o la fila; undefined = todo. */
  onSeleccion?: (seleccion: string | undefined) => void;
}) {
  const todas = tabla.columnas.map((_, i) => i);
  // 0.85.1 (novena ronda, R5): en la comparación, la fila pedida a la vista, bajo la barra.
  const raiz = useRef<HTMLElement>(null);
  useEffect(() => {
    if (resaltarFila === undefined || !columnasFijas) return;
    const el = [
      ...(raiz.current?.querySelectorAll<HTMLElement>(`[data-fila="${resaltarFila}"]`) ?? []),
    ].find((x) => x.offsetParent !== null);
    if (!el) return;
    // 1.0.9 (22.ª ronda, adjunto y R3): también por debajo de «Volver a la consulta», que va
    // pegado arriba (tapaba la fila de destino y su rótulo).
    const bajoDe = (sel: string) =>
      document.querySelector(sel)?.getBoundingClientRect().bottom ?? 0;
    const barra = Math.max(bajoDe(".barra-pegada"), bajoDe(".volver-pegado"));
    window.scrollTo({
      top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - barra - 12),
    });
  }, [resaltarFila, columnasFijas]);
  const desdeRuta = (s?: string): number[] => {
    if (!tabla.porSistema || !s) return [];
    const ids = s.split("+");
    return CORTOS.map((_, c) => c).filter((c) => ids.includes(slugDe(c)));
  };
  const [sel, setSelInterna] = useState<number[]>(() =>
    columnasFijas ? columnasFijas : desdeRuta(seleccionInicial),
  );
  // 0.96.0 (16.ª ronda, R5): las columnas decididas fuera (la comparación de Sistemas), al día
  // cuando cambian sin cambiar de pantalla (marcar o desmarcar un sistema).
  const fijas = columnasFijas?.join("+");
  useEffect(() => {
    if (fijas === undefined) return;
    const n = fijas ? fijas.split("+").map(Number) : [];
    setSelInterna((p) => (p.join("+") === fijas ? p : n));
  }, [fijas]);
  // 0.72.0: con la pantalla ya abierta, la ruta manda (Atrás, un enlace a «T4:<sistema>»).
  useEffect(() => {
    if (columnasFijas) return;
    const n = desdeRuta(seleccionInicial);
    setSelInterna((p) => (p.join() === n.join() ? p : n));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionInicial]);
  const setSel = (f: (s: number[]) => number[]) => {
    const nueva = f(sel);
    setSelInterna(nueva);
    onSeleccion?.(nueva.length ? nueva.map(slugDe).join("+") : undefined);
  };
  const [fila, setFila] = useState<number | null>(() => {
    if (!tabla.porSistema && seleccionInicial) {
      const n = Number(seleccionInicial);
      return Number.isInteger(n) && n >= 0 && n < tabla.filas.length ? n : null;
    }
    return null;
  });
  const columnas = useMemo(() => (sel.length ? sel : todas), [sel, todas]);
  const toggle = (c: number) =>
    setSel((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c].sort()));

  const interactiva = modo === "interactiva";
  const literal = !interactiva && !columnasFijas && !herramienta;
  return (
    <section ref={raiz} aria-label={`Tabla ${tabla.numero}`} className="bloque-papel">
      <CabeceraTabla
        tabla={tabla}
        enlaceConsultar={!interactiva && !columnasFijas && !herramienta}
        herramienta={herramienta}
      />
      {interactiva && tabla.porSistema && !columnasFijas && (
        <div className="no-imprimir mb-3">
          {ayuda && <div className="mb-1 text-xs font-semibold text-slate-500">{ayuda}</div>}
          <CasillasSistema
            etiqueta="Filtrar por sistema"
            seleccion={sel}
            onToggle={toggle}
            extra={
              sel.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSel(() => [])}
                  className="chip tap-44 shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  Los cuatro
                </button>
              )
            }
          />
          <p className="mt-1.5 text-xs text-slate-600" aria-live="polite">
            {sel.length
              ? `Viendo ${listaNombres(sel.map((c) => nombreColumna(tabla, c, false)))}`
              : ""}
          </p>
        </div>
      )}
      {interactiva && !tabla.porSistema && (
        <div className="no-imprimir mb-3">
          <label
            className="mb-1 block text-xs font-semibold text-slate-500"
            htmlFor={`filtro-${tabla.id}`}
          >
            Ir a una fila ({tabla.cabeceraEtiqueta.toLowerCase()})
          </label>
          <select
            id={`filtro-${tabla.id}`}
            value={fila ?? ""}
            onChange={(e) => {
              const n = e.target.value === "" ? null : Number(e.target.value);
              setFila(n);
              onSeleccion?.(n == null ? undefined : String(n));
            }}
            className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <option value="">Todas las filas</option>
            {tabla.filas.map((f, i) => (
              <option key={i} value={i}>
                {f.etiqueta.split("\n")[0]}
              </option>
            ))}
          </select>
        </div>
      )}

      {interactiva && tabla.porSistema && sel.length === 1 ? (
        <FichaSistema tabla={tabla} c={sel[0]} resaltar={resaltarFila} />
      ) : interactiva && !tabla.porSistema && fila != null ? (
        <Fichas tabla={tabla} columnas={todas} filas={[fila]} />
      ) : (
        <>
          <div className="vista-tabla hidden md:block">
            <TablaHTML
              tabla={tabla}
              columnas={columnas}
              iconoFila={iconoFila}
              resaltar={resaltarFila}
              literal={literal}
            />
          </div>
          <div className="vista-fichas md:hidden">
            <Fichas tabla={tabla} columnas={columnas} resaltar={resaltarFila} literal={literal} />
          </div>
        </>
      )}
      <Notas notas={tabla.notas} />
      {/* 0.72.0: cada nota, solo si su sistema está a la vista (la de Liberty no va en una
          comparación sin CamAPS). */}
      {(NOTAS_POR_TABLA[tabla.id] ?? [])
        .filter((n) => {
          const k = Object.keys(NOTAS_POR_PASAJE).find(
            (x) => x.startsWith(`${tabla.id}/`) && NOTAS_POR_PASAJE[x] === n,
          );
          const col = k !== undefined ? COLUMNA_DE_NOTA[k] : undefined;
          return col === undefined || columnas.includes(col);
        })
        .map((n) => (
          <p
            key={n}
            className="mt-1.5 w-fit max-w-[calc(75ch+1rem)] rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600 print:max-w-none"
          >
            {sinCortes(n)}
          </p>
        ))}
      {herramienta && (
        <FuentePie
          fuentes={[
            {
              texto: `Tabla ${tabla.numero}, ${paginasDe(tabla.paginas[0], tabla.paginas[1])}`,
              ruta: rutaDeTabla(tabla.id as TablaId),
            },
          ]}
        />
      )}
    </section>
  );
}
