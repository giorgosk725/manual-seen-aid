/* Elegir un sistema (#/sistemas/elegir[/criterios]): los criterios del apartado 6 contrastados
   con la Tabla 1. Cada sistema enseña, criterio a criterio, la celda literal de la tabla con un
   veredicto («cumple», «fuera», «no consta»); nada se calcula fuera de lo que la tabla dice
   (eleccion.ts). Los criterios viven en la ruta para poder enlazarlos. */
import { useEffect, useState } from "react";
import { ArrowRight, Check, HelpCircle, X } from "lucide-react";
import { APARTADOS, TABLAS, rutaDeTabla } from "../contenido";
import { ORDEN_SISTEMAS } from "../ampliacion/ids";
import {
  CLAVES_CRITERIO,
  ETIQUETA_CRITERIO,
  FILA_CRITERIO,
  SENSORES,
  VARIANTES,
  celdaT1,
  escribirCriterios,
  evaluar,
  hayCriterios,
  leerCriterios,
  veredictos,
  type Criterios,
  type Estado,
} from "../eleccion";
import { elegirRuta, href } from "../rutas";
import { CabeceraEditorial, PaginaBadge, Segmented } from "../ui";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";

const hex = CATEGORIA_HEX.consultar;
const campo =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-10 sm:text-sm";
const casilla = "h-6 w-6 shrink-0 rounded border-slate-400 text-slate-800 focus:ring-slate-500";

const TONO: Record<Estado, { texto: string; color: string; fondo: string; Icono: typeof Check }> = {
  cumple: { texto: "Cumple", color: "#166534", fondo: "#f0fdf4", Icono: Check },
  fuera: { texto: "Fuera", color: "#991b1b", fondo: "#fef2f2", Icono: X },
  "no-consta": { texto: "No consta", color: "#475569", fondo: "#f8fafc", Icono: HelpCircle },
};

function Numero({
  id,
  etiqueta,
  unidad,
  valor,
  onChange,
}: {
  id: string;
  etiqueta: string;
  unidad: string;
  valor?: number;
  onChange: (v?: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-slate-800">
        {etiqueta} <span className="font-normal text-slate-500">({unidad})</span>
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        className={campo}
        value={valor ?? ""}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          onChange(Number.isFinite(n) && n >= 0 ? n : undefined);
        }}
      />
    </label>
  );
}

function Veredicto({ estado, nombre }: { estado: Estado; nombre?: string }) {
  const t = TONO[estado];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ color: t.color, background: t.fondo }}
    >
      <t.Icono size={12} aria-hidden="true" />
      {nombre ? `${nombre}: ${t.texto.toLowerCase()}` : t.texto}
    </span>
  );
}

export function Elegir({ q }: { q?: string }) {
  // Los criterios viven en la ruta; la copia local responde al instante y la ruta la sigue.
  const [c, setC] = useState<Criterios>(() => leerCriterios(q));
  useEffect(() => setC(leerCriterios(q)), [q]);
  const poner = (cambio: Partial<Criterios>) => {
    const nuevo = { ...c, ...cambio };
    setC(nuevo);
    elegirRuta("sistemas", "elegir", escribirCriterios(nuevo));
  };
  const activos = CLAVES_CRITERIO.filter(
    (k) => c[k] !== undefined && c[k] !== false && c[k] !== "",
  );
  const a6 = APARTADOS.find((a) => a.slug === "06-indicaciones")!;
  const b5 = a6.bloques[4];
  const resultados = hayCriterios(c) ? veredictos(c) : null;
  return (
    <div>
      <div className="no-imprimir mb-2 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("sistemas")}
          className="inline-flex min-h-11 items-center font-semibold hover:underline"
        >
          Sistemas
        </a>
        <span aria-hidden="true">›</span>
        <span>Elegir un sistema</span>
      </div>
      <CabeceraEditorial titulo="Elegir un sistema" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Los factores que el capítulo pide integrar (apartado 6, p. 6), contrastados con la Tabla 1
          (pp. 3–4). Cada sistema enseña la celda literal de la tabla; lo que la tabla no dice queda
          como «no consta». Orienta la decisión compartida: no la sustituye.
        </p>
      </CabeceraEditorial>

      <form
        className="no-imprimir rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        onSubmit={(e) => e.preventDefault()}
        aria-label="Criterios"
      >
        <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          Factores clínicos
        </h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <Numero
            id="edad"
            etiqueta="Edad"
            unidad="años"
            valor={c.edad}
            onChange={(v) => poner({ edad: v })}
          />
          <Numero
            id="peso"
            etiqueta="Peso"
            unidad="kg"
            valor={c.peso}
            onChange={(v) => poner({ peso: v })}
          />
          <Numero
            id="dtd"
            etiqueta="Dosis total diaria"
            unidad="UI/día"
            valor={c.dtd}
            onChange={(v) => poner({ dtd: v })}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <label className="inline-flex min-h-11 items-center gap-2 sm:min-h-8">
            <input
              type="checkbox"
              className={casilla}
              checked={!!c.gestacion}
              onChange={(e) => poner({ gestacion: e.target.checked || undefined })}
            />
            Gestación o planificación gestacional
          </label>
          <label className="inline-flex min-h-11 items-center gap-2 sm:min-h-8">
            <input
              type="checkbox"
              className={casilla}
              checked={!!c.dm2}
              onChange={(e) => poner({ dm2: e.target.checked || undefined })}
            />
            Diabetes tipo 2
          </label>
        </div>
        <h2 className="mt-5 text-xs font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          Factores personales
        </h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="text-sm">
            <span className="mb-1 block font-semibold text-slate-800">Formato</span>
            <Segmented
              label="Formato"
              wrap
              options={[
                { id: "cualquiera", label: "Cualquiera" },
                { id: "cateter", label: "Bomba con catéter" },
                { id: "pod", label: "Pod sin tubo" },
              ]}
              value={c.formato ?? "cualquiera"}
              onChange={(v) =>
                poner({ formato: v === "cualquiera" ? undefined : (v as "cateter" | "pod") })
              }
            />
          </div>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-slate-800">
              Sensor que usa o prefiere
            </span>
            <select
              className={campo}
              value={c.sensor ?? ""}
              onChange={(e) => poner({ sensor: e.target.value || undefined })}
            >
              <option value="">Cualquiera</option>
              {SENSORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="inline-flex min-h-11 items-center gap-2 sm:min-h-8">
            <input
              type="checkbox"
              className={casilla}
              checked={!!c.movil}
              onChange={(e) => poner({ movil: e.target.checked || undefined })}
            />
            Control desde el móvil (algoritmo en la app del smartphone)
          </label>
          {hayCriterios(c) && (
            <button
              type="button"
              onClick={() => elegirRuta("sistemas", "elegir")}
              className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-500 sm:min-h-9"
            >
              Borrar criterios
            </button>
          )}
        </div>
      </form>

      {resultados ? (
        <section aria-label="Resultado por sistema" className="mt-5" aria-live="polite">
          <p className="mb-2 text-sm text-slate-600">
            {activos.length === 1 ? "Criterio marcado" : "Criterios marcados"}:{" "}
            {activos.map((k) => ETIQUETA_CRITERIO[k].toLowerCase()).join(", ")}. Primero los
            sistemas cuya fila de la Tabla 1 los cumple.
          </p>
          <ul className="grid gap-3 lg:grid-cols-2">
            {resultados.map((r) => {
              const col = ORDEN_SISTEMAS.indexOf(r.id);
              const h = SISTEMA_HEX[col];
              const variantes = VARIANTES[r.id];
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border bg-white p-4"
                  style={{ borderColor: "#e6e6e6", boxShadow: `inset 0 3px 0 0 ${h.strong}` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold" style={{ color: h.ink }}>
                      {r.nombre}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {r.variantes.map((v) => (
                        <Veredicto key={v.nombre ?? "unica"} estado={v.estado} nombre={v.nombre} />
                      ))}
                    </div>
                  </div>
                  <dl className="mt-3 space-y-3">
                    {activos.map((k) => {
                      const fila = FILA_CRITERIO[k];
                      const texto = celdaT1(fila, col);
                      const estados = variantes.map((v) => ({
                        nombre: v.nombre,
                        e: evaluar(r.id, v, k, c),
                      }));
                      return (
                        <div key={k}>
                          <dt className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                            {ETIQUETA_CRITERIO[k]}
                            <span className="font-normal normal-case tracking-normal">
                              · Tabla 1, {fila.toLowerCase()}
                            </span>
                          </dt>
                          <dd className="mt-1 flex flex-wrap items-start gap-2">
                            <span className="min-w-0 flex-1 text-sm text-slate-800">
                              <Lineas>{texto}</Lineas>
                            </span>
                            <span className="flex shrink-0 flex-wrap gap-1">
                              {estados.map(
                                (x) =>
                                  x.e && (
                                    <Veredicto
                                      key={x.nombre ?? "unica"}
                                      estado={x.e}
                                      nombre={variantes.length > 1 ? x.nombre : undefined}
                                    />
                                  ),
                              )}
                            </span>
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={href("sistemas", r.id)}
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
                    >
                      Ficha de {r.nombre} <ArrowRight size={13} aria-hidden="true" />
                    </a>
                    <PaginaBadge p={TABLAS.T1.paginas[0]} p2={TABLAS.T1.paginas[1]} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          Marca uno o varios criterios: cada sistema enseñará la celda de la Tabla 1 que responde a
          ese criterio y si la cumple.
        </p>
      )}

      <section
        aria-label="Lo que dice el capítulo sobre la elección"
        className="prosa mt-6 rounded-2xl border bg-white p-4"
        style={{ borderColor: "#e6e6e6" }}
      >
        <p className="text-sm">{b5.t === "p" && <Texto>{b5.texto}</Texto>}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <PaginaBadge p={6} />
          <a
            href={href("capitulo", a6.slug, "b5")}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
          >
            Leer en el apartado 6 <ArrowRight size={13} aria-hidden="true" />
          </a>
          <a
            href={href("visual", "eleccion")}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
          >
            Figura 2: elección compartida <ArrowRight size={13} aria-hidden="true" />
          </a>
          {rutaDeTabla("T1") && (
            <a
              href={rutaDeTabla("T1")!}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
            >
              Tabla 1 en el capítulo <ArrowRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
