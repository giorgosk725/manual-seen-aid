/* Una tabla del capítulo. Dos modos:
   - lectura: la tabla completa, cabecera pegada, scroll horizontal en móvil; por debajo de
     md cada fila se muestra como tarjeta (una tabla de 5 columnas no cabe en un teléfono).
   - interactiva: además, filtros. En las tablas por sistema se eligen uno o varios sistemas
     (1 = fichas grandes; 2–3 = columnas elegidas; todos = tabla completa). En las demás, un
     filtro por fila (p. ej. Tabla 6, por procedimiento). La selección viaja en la ruta
     (`T1:minimed-780g+omnipod-5`, `T6:3`) para poder compartirla. */
import { useMemo, useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import type { Tabla } from "../contenido";
import { Lineas, Texto } from "../texto";
import { Enlace, PaginaBadge } from "../ui";
import { BRAND_ACCENT, SISTEMA_HEX } from "../tokens";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";
import { TituloBloque } from "../nivel";

const CORTOS = ["MiniMed 780G", "Control-IQ", "CamAPS", "Omnipod 5"];
const slugDe = (c: number) => CORTOS[c].toLowerCase().replace(/\s/g, "-");

/* «Viendo: MiniMed 780G y Omnipod 5»: qué selección está activa, con palabras. */
const listaNombres = (n: string[]) =>
  n.length < 2 ? n.join("") : `${n.slice(0, -1).join(", ")} y ${n[n.length - 1]}`;

export function CabeceraTabla({
  tabla,
  enlaceConsultar,
}: {
  tabla: Tabla;
  enlaceConsultar?: boolean;
}) {
  return (
    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
      <div>
        <div
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: BRAND_ACCENT.ink }}
        >
          Tabla {tabla.numero}
        </div>
        <TituloBloque className="text-sm font-semibold text-slate-800">{tabla.titulo}</TituloBloque>
      </div>
      <div className="flex items-center gap-2">
        <PaginaBadge p={tabla.paginas[0]} p2={tabla.paginas[1]} />
        {enlaceConsultar && (
          <Enlace
            href={href("consultar", "tablas", tabla.id)}
            className="no-imprimir inline-flex items-center gap-1 rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <ExternalLink size={12} aria-hidden="true" />
            {tabla.porSistema ? "Filtrar por sistema" : "Abrir en Consultar"}
          </Enlace>
        )}
      </div>
    </div>
  );
}

function Notas({ notas }: { notas: string[] }) {
  return (
    <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">
      {notas.map((n, i) => (
        <p key={i}>
          <Texto>{n}</Texto>
        </p>
      ))}
    </div>
  );
}

/* Tabla completa (o con las columnas elegidas). */
function TablaHTML({ tabla, columnas }: { tabla: Tabla; columnas: number[] }) {
  return (
    <div
      className="tabla-scroll fade-right-scroll rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      style={{ borderColor: "#e6e6e6" }}
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
            <th
              scope="col"
              className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide"
            >
              {tabla.cabeceraEtiqueta}
            </th>
            {columnas.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide"
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
                      className="h-7 w-7 rounded-md bg-white object-cover"
                    />
                    {tabla.columnas[c]}
                  </span>
                ) : (
                  tabla.columnas[c]
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
                className="border-t px-3 py-2 text-left text-xs font-bold text-slate-800"
                style={{ borderColor: "#e6e6e6", minWidth: "9rem" }}
              >
                <Lineas>{f.etiqueta}</Lineas>
              </th>
              {f.unida ? (
                <td
                  colSpan={columnas.length}
                  className="border-t px-3 py-2 text-slate-700"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <Lineas>{f.celdas[0]}</Lineas>
                </td>
              ) : (
                columnas.map((c) => (
                  <td
                    key={c}
                    className="border-t px-3 py-2 text-slate-700"
                    style={{
                      borderColor: "#e6e6e6",
                      minWidth: tabla.porSistema ? "11rem" : "10rem",
                    }}
                  >
                    <Lineas>{f.celdas[c]}</Lineas>
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
          <li key={i} className="rounded-xl border bg-white p-3" style={{ borderColor: "#e6e6e6" }}>
            <div className="mb-2 text-[15px] font-bold text-slate-900">
              <Lineas>
                {/^\d+$/.test(f.etiqueta) ? `${tabla.cabeceraEtiqueta} ${f.etiqueta}` : f.etiqueta}
              </Lineas>
            </div>
            <dl className="space-y-2">
              {(f.unida ? [columnas[0]] : columnas).map((c) => (
                <div
                  key={c}
                  className="border-l-[3px] py-0.5 pl-2.5"
                  style={{ borderColor: tabla.porSistema ? SISTEMA_HEX[c].strong : "#cbd5e1" }}
                >
                  <dt
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: tabla.porSistema ? SISTEMA_HEX[c].ink : "#334155" }}
                  >
                    {f.unida ? "Todos los sistemas" : tabla.columnas[c]}
                  </dt>
                  <dd className="mt-0.5 text-[15px] text-slate-800">
                    <Lineas>{f.unida ? f.celdas[0] : f.celdas[c]}</Lineas>
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
    <div
      className="rounded-2xl border bg-white"
      style={{ borderColor: "#e6e6e6", boxShadow: `inset 0 3px 0 0 ${hex.strong}` }}
    >
      <div className="px-4 pt-4 text-base font-extrabold" style={{ color: hex.ink }}>
        {tabla.columnas[c]}
      </div>
      <dl className="divide-y px-4 pb-2" style={{ borderColor: "#e6e6e6" }}>
        {tabla.filas.map((f, i) => (
          <div key={i} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
              <Lineas>{f.etiqueta}</Lineas>
            </dt>
            <dd className="text-[15px] text-slate-800">
              <Lineas>{f.unida ? f.celdas[0] : f.celdas[c]}</Lineas>
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
}: {
  tabla: Tabla;
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
  const [sel, setSelInterna] = useState<number[]>(() => {
    if (columnasFijas) return columnasFijas;
    if (tabla.porSistema && seleccionInicial) {
      const ids = seleccionInicial.split("+");
      const cs = CORTOS.map((_, c) => c).filter((c) => ids.includes(slugDe(c)));
      if (cs.length) return cs;
    }
    return [];
  });
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
      <CabeceraTabla tabla={tabla} enlaceConsultar={!interactiva && !columnasFijas} />
      {interactiva && tabla.porSistema && !columnasFijas && (
        <div className="no-imprimir mb-3">
          <div className="mb-1 text-xs font-semibold text-slate-500">
            {ayuda ?? "Elige uno o varios sistemas (uno solo = ficha de lectura)"}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por sistema">
            {tabla.columnas.map((nombre, c) => {
              const on = sel.includes(c);
              const hex = SISTEMA_HEX[c];
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(c)}
                  className="tap-44 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ease-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  style={
                    on
                      ? { background: hex.ink, borderColor: hex.ink, color: "#fff" }
                      : { background: hex.soft, borderColor: `${hex.strong}40`, color: hex.ink }
                  }
                >
                  {on && <Check size={14} aria-hidden="true" />}
                  <span className="sm:hidden">{CORTOS[c]}</span>
                  <span className="hidden sm:inline">{nombre}</span>
                </button>
              );
            })}
            {sel.length > 0 && (
              <button
                type="button"
                onClick={() => setSel(() => [])}
                className="tap-44 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Ver todos
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-600" aria-live="polite">
            {sel.length
              ? `Tabla ${tabla.numero} · viendo ${listaNombres(sel.map((c) => tabla.columnas[c]))}`
              : `Tabla ${tabla.numero} · los cuatro sistemas`}
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
            className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
            <TablaHTML tabla={tabla} columnas={columnas} />
          </div>
          <div className="vista-fichas md:hidden">
            <Fichas tabla={tabla} columnas={columnas} />
          </div>
        </>
      )}
      <Notas notas={tabla.notas} />
    </section>
  );
}
