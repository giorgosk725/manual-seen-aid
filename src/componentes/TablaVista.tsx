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
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
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

/* «Viendo: MiniMed 780G y Omnipod 5»: qué selección está activa, con palabras. */
const listaNombres = (n: string[]) =>
  n.length < 2 ? n.join("") : `${n.slice(0, -1).join(", ")} y ${n[n.length - 1]}`;

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
        <TituloBloque className="text-sm font-semibold text-slate-800">{tabla.titulo}</TituloBloque>
      </div>
    );
  return (
    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
      <div>
        <div className="rotulo" style={{ color: BRAND_ACCENT.ink }}>
          Tabla {tabla.numero}
        </div>
        <TituloBloque className="text-sm font-semibold text-slate-800">{tabla.titulo}</TituloBloque>
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
}: {
  tabla: Tabla;
  columnas: number[];
  iconoFila?: (i: number) => ReactNode;
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
      <table className="tabla-capitulo w-full border-collapse text-sm">
        <caption className="sr-only">
          Tabla {tabla.numero}. {tabla.titulo}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="rotulo px-3 py-2 text-left text-white">
              {tabla.cabeceraEtiqueta}
            </th>
            {columnas.map((c) => (
              <th
                key={c}
                scope="col"
                className="rotulo px-3 py-2 text-left text-white"
                style={
                  tabla.porSistema
                    ? { boxShadow: `inset 0 -3px 0 0 ${SISTEMA_HEX[c].strong}` }
                    : undefined
                }
              >
                {tabla.porSistema ? (
                  <span className="flex items-center gap-2">
                    <img
                      src={FOTO_SISTEMA[ORDEN_SISTEMAS[c]]}
                      alt=""
                      className="foto-sistema h-7 w-7 rounded-md bg-white object-cover"
                    />
                    <NombreSistema n={tabla.columnas[c]} porPalabra />
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
            <tr key={i} className="align-top">
              <th
                scope="row"
                className="separador border-t px-3 py-2 text-left text-xs font-bold text-slate-800"
                // 0.77.1 (auditorías R3 y senior): columnas algo más estrechas, para que la tabla de
                // los cuatro sistemas quepa entera en la columna de lectura (antes, 848 px en 734).
                style={{ minWidth: "8rem" }}
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
                  className="separador border-t px-3 py-2 text-slate-700"
                >
                  <Lineas>{sinCortes(f.celdas[0])}</Lineas>
                </td>
              ) : (
                columnas.map((c) => (
                  <td
                    key={c}
                    className="separador border-t px-3 py-2 text-slate-700"
                    style={{
                      minWidth: tabla.porSistema ? "9.25rem" : "10rem",
                      ...(tabla.porSistema
                        ? { background: SISTEMA_HEX[c].soft, boxShadow: "inset 0 0 0 2px #fff" }
                        : {}),
                    }}
                  >
                    <Lineas>{sinCortes(f.celdas[c])}</Lineas>
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
}: {
  tabla: Tabla;
  columnas: number[];
  filas?: number[];
}) {
  const idx = filas ?? tabla.filas.map((_, i) => i);
  return (
    <ol className="space-y-3">
      {idx.map((i) => {
        const f = tabla.filas[i];
        return (
          <li key={i} className="tarjeta p-3">
            <div className="titulo-tarjeta mb-2">
              <Lineas>
                {sinCortes(
                  /^\d+$/.test(f.etiqueta) ? `${tabla.cabeceraEtiqueta} ${f.etiqueta}` : f.etiqueta,
                )}
              </Lineas>
            </div>
            <dl className="space-y-2">
              {(f.unida ? [columnas[0]] : columnas).map((c) => (
                <div
                  key={c}
                  className="border-l-[3px] py-0.5 pl-2.5"
                  // 0.78.1: el filete del sistema lee `--sis` (en nocturno, su tinta clara).
                  style={
                    tabla.porSistema
                      ? { ["--sis" as string]: SISTEMA_HEX[c].strong, borderColor: "var(--sis)" }
                      : { borderColor: "#cbd5e1" }
                  }
                >
                  <dt
                    className="rotulo"
                    style={tabla.porSistema ? { color: SISTEMA_HEX[c].ink } : undefined}
                  >
                    {f.unida ? "Todos los sistemas" : tabla.columnas[c]}
                  </dt>
                  <dd className="mt-0.5 text-[15px] text-slate-800">
                    <Lineas>{sinCortes(f.unida ? f.celdas[0] : f.celdas[c])}</Lineas>
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
function FichaSistema({ tabla, c }: { tabla: Tabla; c: number }) {
  const hex = SISTEMA_HEX[c];
  return (
    <div className="tarjeta tarjeta-sistema" style={{ ["--sis" as string]: hex.strong }}>
      <div className="titulo-seccion px-4 pt-4" style={{ color: hex.ink }}>
        {tabla.columnas[c]}
      </div>
      <dl className="divide-y px-4 pb-2">
        {tabla.filas.map((f, i) => (
          <div key={i} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
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
              <Lineas>{sinCortes(f.unida ? f.celdas[0] : f.celdas[c])}</Lineas>
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
}: {
  tabla: Tabla;
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
  const desdeRuta = (s?: string): number[] => {
    if (!tabla.porSistema || !s) return [];
    const ids = s.split("+");
    return CORTOS.map((_, c) => c).filter((c) => ids.includes(slugDe(c)));
  };
  const [sel, setSelInterna] = useState<number[]>(() =>
    columnasFijas ? columnasFijas : desdeRuta(seleccionInicial),
  );
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
  return (
    <section aria-label={`Tabla ${tabla.numero}`} className="bloque-papel">
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
            {sel.length ? `Viendo ${listaNombres(sel.map((c) => tabla.columnas[c]))}` : ""}
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
        <FichaSistema tabla={tabla} c={sel[0]} />
      ) : interactiva && !tabla.porSistema && fila != null ? (
        <Fichas tabla={tabla} columnas={todas} filas={[fila]} />
      ) : (
        <>
          <div className="vista-tabla hidden md:block">
            <TablaHTML tabla={tabla} columnas={columnas} iconoFila={iconoFila} />
          </div>
          <div className="vista-fichas md:hidden">
            <Fichas tabla={tabla} columnas={columnas} />
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
