/* Las tarjetas operativas de cada sistema (src/fichaOperativa.ts): datos cortos con su rótulo,
   lo de la variante (Control-IQ+, Liberty) junto al dato y la fuente al pie, que lleva al texto
   literal del capítulo. Dos formas: casillas (datos cortos, en rejilla) y filas (parámetros y
   modos, con el rótulo a la izquierda). */
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { FuentePie } from "./FuentePie";
import { SinCortes } from "./SinCortes";
import {
  fuentesDeDatos,
  slugDato,
  type Dato,
  type EnAutomatico,
  type GrupoFicha,
} from "../fichaOperativa";
import { SISTEMA_HEX } from "../tokens";
import { fuentesDePieza } from "../fuentesPiezas";
import { href } from "../rutas";
import type { Pieza } from "../inicio";

/* Identificador del sistema en la vista de tablas (orden de la Tabla 1). */
const SLUG_TABLA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
/* Adónde lleva el rótulo de una fila: la tabla con la columna del sistema (casilla literal) o el
   párrafo del capítulo, resaltado (0.77.1, auditoría R3: del dato al literal en un toque). */
function literalDe(p: Pieza | undefined, c: number): string | undefined {
  if (!p) return undefined;
  if (p.t === "casilla")
    return href("consultar", "tablas", `${p.tabla}:${SLUG_TABLA[c]}:${p.fila}`);
  return fuentesDePieza(p)[0]?.ruta;
}

/* La variante, siempre igual: la insignia a la izquierda y su texto al lado, aunque ocupe dos
   líneas (0.77.1, auditoría visual: con flex-wrap la insignia quedaba sola en su línea). */
function Variante({ c, d }: { c: number; d: Dato }) {
  if (!d.variante) return null;
  const h = SISTEMA_HEX[c];
  return (
    <span className="mt-1 grid grid-cols-[auto_1fr] items-baseline gap-x-2">
      <span className="insignia" style={{ background: h.soft, color: h.ink }}>
        {d.variante.nombre}
      </span>
      <span className="min-w-0">
        <SinCortes texto={d.variante.v} />
      </span>
    </span>
  );
}

/* Datos cortos: en el móvil, filas con el rótulo a la izquierda; desde sm, casillas en rejilla
   con el rótulo encima. El dato, en negrita; su detalle, debajo y más discreto. */
/* `resumen` (tarjetas de la entrada de Sistemas AID): filas en el móvil, tres casillas en una
   fila desde sm y, a dos tarjetas por fila (xl), otra vez filas. */
const MODO = {
  // 0.92.0 (revisión de tarjetas, sistemas): el rótulo encima del valor y en una línea (en el
  // móvil, a la izquierda en 6,5 rem, bajaba a 3–5 líneas y el valor se quedaba en 216 px); en el
  // Resumen desde xl, a la izquierda en 9,25 rem (dos líneas como mucho) por la alineación entre
  // tarjetas vecinas.
  // 0.94.0 (rediseño): cada dato abre con una línea capilar a todo su ancho: las filas de la
  // rejilla quedan alineadas, como en una hoja técnica (antes, casillas sueltas).
  rejilla: {
    // En papel, más juntas (la ficha de CamAPS no pasa de tres caras).
    dl: "grid gap-y-3 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 print:gap-y-1.5",
    fila: "min-w-0 border-t border-[var(--linea-suave)] pt-2.5 print:pt-1",
    dt: "",
    dd: "mt-1",
  },
  resumen: {
    dl: "grid gap-y-3 sm:grid-cols-3 sm:gap-x-5 xl:row-span-3 xl:grid-cols-1 xl:grid-rows-subgrid xl:gap-y-2",
    fila: "min-w-0 xl:grid xl:grid-cols-[9.25rem_1fr] xl:gap-x-3 xl:border-t xl:border-[var(--linea-suave)] xl:pt-2 xl:first:border-t-0 xl:first:pt-0",
    dt: "xl:pt-0.5",
    dd: "mt-1 xl:mt-0",
  },
};
/* 0.92.0 (revisión de tarjetas, sistemas): rejillas sin huecos: la última casilla ocupa lo que
   queda de su fila (en «Paso a modo automático», dos casillas en una rejilla de tres). Solo
   cuando ninguna casilla ocupa ya dos columnas. */
const resto = (k: number, datos: Dato[]) => {
  if (k !== datos.length - 1 || datos.some((d) => d.partes)) return "";
  const n = datos.length;
  return [
    n % 2 ? "sm:col-span-2" : "",
    n % 3 === 1 ? "lg:col-span-3" : n % 3 === 2 ? "lg:col-span-2" : "lg:col-span-1",
  ]
    .filter(Boolean)
    .join(" ");
};
export function CasillasDatos({
  c,
  datos,
  modo = "rejilla",
}: {
  c: number;
  datos: Dato[];
  modo?: keyof typeof MODO;
}) {
  const m = MODO[modo];
  return (
    <dl className={m.dl}>
      {datos.map((d, k) => {
        // 0.81.1 (quinta ronda, senior): como en Parámetros y Modos, el rótulo lleva al texto
        // literal con la fila marcada (no en las tarjetas de la entrada, que llevan a la ficha).
        const ruta = modo === "rejilla" ? literalDe(d.f[0], c) : undefined;
        return (
          <div
            key={d.r}
            className={`${m.fila} ${d.partes ? "sm:col-span-2" : ""} ${modo === "rejilla" ? resto(k, datos) : ""}`}
          >
            <dt className={`rotulo pt-0.5 leading-tight ${m.dt}`}>
              {ruta ? (
                <a
                  href={ruta}
                  className="tap-44 -my-[5px] inline-block py-[5px] underline decoration-slate-300 decoration-dotted decoration-1 underline-offset-[3px] hover:decoration-solid hover:decoration-slate-700"
                  title="Texto del capítulo"
                >
                  {d.r}
                </a>
              ) : (
                d.r
              )}
            </dt>
            <dd className={`min-w-0 ${m.dd}`}>
              <span className="block text-[15px] font-semibold leading-snug text-slate-900">
                {d.partes ? (
                  d.v.split(" · ").map((x) => (
                    <span key={x} className="block">
                      {/* 0.88.1 (duodécima ronda, senior): cada línea con mayúscula inicial. */}
                      <SinCortes texto={x.charAt(0).toUpperCase() + x.slice(1)} />
                    </span>
                  ))
                ) : (
                  <SinCortes texto={d.v} />
                )}
              </span>
              {d.n && (
                <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">
                  <SinCortes texto={d.n} />
                </span>
              )}
              {/* 0.92.3 (15.ª ronda, guardia): en las fichas, la variante con el cuerpo del dato
                  (Control-IQ+ parecía secundario en letra menor); en el Resumen, discreta. */}
              <span
                className={`block leading-snug ${modo === "rejilla" ? "text-[15px] font-semibold text-slate-900" : "text-[13px] text-slate-800"}`}
              >
                <Variante c={c} d={d} />
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function TarjetaDatos({
  c,
  titulo,
  children,
  pie,
}: {
  c: number;
  titulo: string;
  children: ReactNode;
  /* 0.87.1 (undécima ronda, visual): la fuente que, en papel, va dentro de la tarjeta (como en
     Parámetros y Modos: fuera, Chromium podía dejarla sola al principio de una cara). */
  pie?: ReactNode;
}) {
  const h = SISTEMA_HEX[c];
  return (
    <section
      aria-label={titulo}
      className="tarjeta tarjeta-sistema tarjeta-datos min-w-0 p-4"
      style={{ ["--sis" as string]: h.strong }}
    >
      <h3 className="titulo-tarjeta mb-3" style={{ color: h.ink }}>
        {titulo}
      </h3>
      {children}
      {pie && <div className="hidden print:block">{pie}</div>}
    </section>
  );
}

/* Varias tarjetas de casillas, una debajo de otra, con una sola línea de fuente. */
export function GruposDatos({ c, grupos }: { c: number; grupos: GrupoFicha[] }) {
  return (
    <div className="space-y-3">
      {grupos.map((g, k) => (
        <TarjetaDatos
          key={g.titulo}
          c={c}
          titulo={g.titulo}
          pie={
            k === grupos.length - 1 && (
              <FuentePie fuentes={fuentesDeDatos(grupos.flatMap((x) => x.datos))} />
            )
          }
        >
          <CasillasDatos c={c} datos={g.datos} />
        </TarjetaDatos>
      ))}
      <FuentePie
        className="mt-2 print:hidden"
        fuentes={fuentesDeDatos(grupos.flatMap((g) => g.datos))}
      />
    </div>
  );
}

const EN_AUTOMATICO: Record<EnAutomatico, string> = {
  si: "Actúa en automático",
  // 0.83.1 (séptima ronda, senior): con la palabra de la nota de la Tabla 1 («sobre todo»).
  no: "Sobre todo en bolos o manual",
  inicio: "Solo al inicio y en manual",
  fijo: "No configurable",
  manual: "Solo en manual o de respaldo",
};

/* Filas con el rótulo a la izquierda (parámetros, modos): una tarjeta, una fila por dato. El
   rótulo lleva al texto literal; la condición de la fila (Tabla 4), en la columna del dato, como
   primera línea (0.77.1, auditoría visual: en la del rótulo dejaba huecos de 200 px). */
export function FilasDatos({ c, datos, titulo }: { c: number; datos: Dato[]; titulo: string }) {
  const h = SISTEMA_HEX[c];
  return (
    <div className="space-y-3">
      <section
        aria-label={titulo}
        className="tarjeta tarjeta-sistema overflow-hidden"
        style={{ ["--sis" as string]: h.strong }}
      >
        <dl className="filas-datos divide-y divide-[var(--linea-suave)]">
          {datos.map((d, k) => {
            const ruta = literalDe(d.f[0], c);
            return (
              <div
                key={d.r}
                // 0.82.1 (sexta ronda, guardia): la fila a la que lleva un atajo («modos:agua»).
                data-dato={slugDato(d.r)}
                // 0.92.0 (revisión de tarjetas): desde lg, rótulo en 20 rem (en 16, los de Modos
                // iban a 3–4 líneas); el valor sigue limitado a 72ch.
                // 0.93.1 (petición del responsable: «mejorar estas tarjetas»): más aire por fila.
                className="grid gap-x-6 gap-y-1 px-4 py-3.5 sm:grid-cols-[minmax(11rem,16rem)_1fr] lg:grid-cols-[minmax(11rem,19rem)_1fr]"
              >
                <dt className="min-w-0">
                  {ruta ? (
                    <a
                      href={ruta}
                      // 0.78.1 (segunda ronda): zona táctil de 24 px como mínimo (tap-44 la amplía).
                      // 0.93.1: subrayado de puntos, como las remisiones del capítulo (los
                      // subrayados continuos de todas las filas hacían ruido).
                      className="tap-44 inline-block min-h-6 py-0.5 text-[15px] font-semibold leading-snug text-slate-900 underline decoration-slate-300 decoration-dotted decoration-1 underline-offset-4 hover:decoration-solid hover:decoration-slate-700"
                      title="Texto del capítulo"
                    >
                      {d.r}
                    </a>
                  ) : (
                    <span className="text-[15px] font-semibold leading-snug text-slate-900">
                      {d.r}
                    </span>
                  )}
                  {d.auto && (
                    <span
                      className="insignia mt-1 block w-fit"
                      style={d.auto === "si" ? { background: h.soft, color: h.ink } : undefined}
                    >
                      {EN_AUTOMATICO[d.auto]}
                    </span>
                  )}
                </dt>
                <dd className="min-w-0 max-w-[72ch] text-[15px] leading-snug text-slate-800">
                  {d.cond && (
                    <span className="mb-0.5 block text-[13px] italic leading-snug text-slate-600">
                      <SinCortes texto={d.cond} />
                    </span>
                  )}
                  {/* 0.80.1 (cuarta ronda, senior): lo que el capítulo manda hacer antes, con el
                      mismo peso que la respuesta (antes iba en la línea pequeña). */}
                  {/* 0.82.1 (sexta ronda, senior y visual): lo que se hace antes, con su peso; la
                      respuesta del sistema, en seminegrita, para que no se confundan. */}
                  {d.antes && (
                    <span className="mb-1.5 block">
                      <SinCortes texto={d.antes} />
                    </span>
                  )}
                  {d.antes ? (
                    <span className="block font-semibold text-slate-900">
                      <SinCortes texto={d.v} />
                    </span>
                  ) : (
                    <SinCortes texto={d.v} />
                  )}
                  {d.n && (
                    <span className="mt-0.5 block text-[13px] text-slate-600">
                      <SinCortes texto={d.n} />
                    </span>
                  )}
                  <span className="block text-[14px]">
                    <Variante c={c} d={d} />
                  </span>
                  {d.enlace && (
                    <a
                      href={d.enlace.ruta}
                      className="tap-44 mt-1.5 inline-flex min-h-6 items-center gap-1 py-0.5 text-[13px] font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline print:hidden"
                    >
                      {d.enlace.texto}
                      <ArrowRight size={13} aria-hidden="true" className="shrink-0" />
                    </a>
                  )}
                </dd>
                {/* 0.83.1 (séptima ronda, R3 y visual): en papel, la fuente dentro de la última fila
                    (que no se parte): fuera, Chromium la dejaba sola al principio de una cara.
                    0.84.1: en su propia celda, a lo ancho (en la columna del dato parecía la fuente
                    de esa fila). */}
                {k === datos.length - 1 && (
                  <dd className="col-span-full hidden print:block">
                    <FuentePie className="mt-1" fuentes={fuentesDeDatos(datos)} />
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </section>
      <FuentePie className="mt-2 print:hidden" fuentes={fuentesDeDatos(datos)} />
    </div>
  );
}
