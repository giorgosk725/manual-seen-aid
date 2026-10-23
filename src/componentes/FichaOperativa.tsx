/* Las tarjetas operativas de cada sistema (src/fichaOperativa.ts): datos cortos con su rótulo,
   lo de la variante (Control-IQ+, Liberty) junto al dato y la fuente al pie, que lleva al texto
   literal del capítulo. Dos formas: casillas (datos cortos, en rejilla) y filas (parámetros y
   modos, con el rótulo a la izquierda). */
import { ArrowRight, BookOpen } from "lucide-react";
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
import { literalDe, literalesDe } from "../fuentesPiezas";
import { ASPECTOS_PARAMETRO } from "../fichaOperativa";

/* 0.96.1 (revisión de Codex, V95-10): señal a la vista (también en el móvil, sin «title») de que
   el rótulo abre el texto del capítulo. 0.99.1 (petición del responsable): la única señal (antes,
   además, el subrayado de puntos: dos marcas por rótulo y tres trazos por fila con la línea fina). */
const SenalLiteral = () => (
  <BookOpen
    size={12}
    aria-hidden="true"
    className="ml-1 inline-block shrink-0 align-[-1px] text-slate-500 print:hidden"
  />
);
/* 0.97.1 (17.ª ronda, adjunto y visual): el libro, unido a la última palabra del rótulo (solo en
   su línea parecía otro elemento). */
function RotuloConSenal({ t }: { t: string }) {
  const i = t.lastIndexOf(" ");
  return (
    <>
      {t.slice(0, i + 1)}
      <span className="whitespace-nowrap">
        {t.slice(i + 1)}
        <SenalLiteral />
      </span>
    </>
  );
}

/* 0.96.1 (revisión de Codex, V95-11): un dato de varios sitios del capítulo, con cada uno a mano
   (el rótulo lleva al primero). En papel, la fuente al pie de la tarjeta. */
function EnElCapitulo({ c, d, comun }: { c: number; d: Dato; comun?: string }) {
  const sitios = literalesDe(d.f, c);
  if (!sitios.length) return null;
  // 1.0.0 (18.ª ronda, adjunto, visual y R3): si la tarjeta cita lo mismo en casi todas sus filas
  // («Tabla 1 · Tabla 3» en Parámetros), la línea sobra: ya lo dice la fuente al pie.
  if (comun && firmaDe(sitios) === comun) return null;
  const vistos = new Set<string>();
  const unicos = sitios
    .map((x) => ({ ...x, texto: corto(x.texto) }))
    .filter((x) => !vistos.has(x.texto) && !!vistos.add(x.texto));
  return (
    <span className="fuente-pie mt-1 block print:hidden">
      En el capítulo:{" "}
      {unicos.map((x, k) => (
        <span key={x.ruta}>
          {k > 0 && "\u00a0· "}
          <a href={x.ruta} className="tap-44 inline py-1">
            <span>{x.texto}</span>
          </a>
        </span>
      ))}
    </span>
  );
}
/* Nombres cortos, sin páginas (las páginas, en la fuente al pie): la tabla, o el título del
   párrafo («Hipoglucemia nocturna»), o el apartado. */
const corto = (t: string) =>
  t.startsWith("Tabla") ? t : (/\(([^()]+)\)$/.exec(t)?.[1] ?? /^Apartado\s\d+/.exec(t)?.[0] ?? t);
const firmaDe = (sitios: { texto: string }[]) => sitios.map((x) => corto(x.texto)).join("|");
/* La combinación de sitios más repetida en una tarjeta, si la repiten dos o más filas. */
function firmaComun(c: number, datos: Dato[]): string | undefined {
  const veces = new Map<string, number>();
  for (const d of datos) {
    const s = literalesDe(d.f, c);
    if (s.length) veces.set(firmaDe(s), (veces.get(firmaDe(s)) ?? 0) + 1);
  }
  const [firma, n] = [...veces.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  return n !== undefined && n >= 2 ? firma : undefined;
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
  // 0.94.1 (petición del responsable: «este estilo sigue sin convencerme»): en las fichas, el
  // mismo estilo de filas que Modos y Parámetros (rótulo a la izquierda, en minúscula y negrita;
  // el dato a la derecha; una línea fina entre filas), en vez de la rejilla con rótulos en
  // versalitas.
  rejilla: {
    dl: "divide-y divide-[var(--linea-suave)]",
    // 1.0.13 (25.ª ronda, visual): la columna de rótulos, la de Parámetros y Modos (16/19 rem):
    // al cambiar de pestaña, los valores saltaban 64 px.
    fila: "grid min-w-0 gap-x-6 gap-y-1 py-3 first:pt-1 last:pb-0 sm:grid-cols-[minmax(11rem,16rem)_1fr] lg:grid-cols-[minmax(11rem,19rem)_1fr] print:gap-y-0 print:py-0.5",
    dt: "",
    dd: "",
  },
  // 0.96.0 (16.ª ronda, visual): en el Resumen, el rótulo de la ficha (minúscula y negrita, 14 px)
  // y la línea fina entre datos también en el móvil (antes, MAYÚSCULAS grises de 12 px); desde xl,
  // la misma subrejilla entre tarjetas vecinas.
  // 1.0.9 (petición del autor del 22-10-2026, «mejorar las tarjetas visualmente»): desde xl, el
  // rótulo también encima del dato (a la izquierda en 9,25 rem, «Localización del algoritmo» y
  // «Bolos automáticos de corrección» iban en dos líneas) y sin la subrejilla entre tarjetas
  // vecinas, que abría huecos dentro de la más corta; los accesos siguen alineados al pie.
  resumen: {
    dl: "grid gap-y-2.5 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-1 xl:gap-y-2",
    fila: "min-w-0 border-t border-[var(--linea-suave)] pt-2.5 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0 xl:border-t xl:pt-2 xl:first:border-t-0 xl:first:pt-0",
    dt: "text-slate-600",
    dd: "mt-0.5",
  },
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
  const comun = firmaComun(c, datos);
  return (
    <dl className={m.dl}>
      {datos.map((d) => {
        // 0.81.1 (quinta ronda, senior): como en Parámetros y Modos, el rótulo lleva al texto
        // literal con la fila marcada (no en las tarjetas de la entrada, que llevan a la ficha).
        const ruta = modo === "rejilla" ? literalDe(d.f[0], c) : undefined;
        return (
          <div
            key={d.r}
            className={`${m.fila} ${modo === "resumen" && d.partes ? "sm:col-span-2" : ""}`}
          >
            <dt
              className={
                modo === "rejilla"
                  ? "text-[15px] font-semibold leading-snug text-slate-900"
                  : `text-sm font-semibold leading-snug ${m.dt || "text-slate-900"}`
              }
            >
              {ruta ? (
                <a
                  href={ruta}
                  className="tap-44 inline-block min-h-6 py-0.5 underline-offset-4 hover:underline hover:decoration-slate-700"
                  title="Texto del capítulo"
                >
                  <RotuloConSenal t={d.r} />
                </a>
              ) : (
                d.r
              )}
            </dt>
            <dd className={`min-w-0 ${m.dd}`}>
              <span
                className={`block text-[15px] leading-snug ${modo === "rejilla" ? "text-slate-800" : "font-semibold text-slate-900"}`}
              >
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
                <span className="mt-0.5 block text-[14px] leading-snug text-slate-700">
                  <SinCortes texto={d.n} />
                </span>
              )}
              {/* 0.92.3 (15.ª ronda, guardia): en las fichas, la variante con el cuerpo del dato
                  (Control-IQ+ parecía secundario en letra menor); en el Resumen, discreta. */}
              <span
                className={`block leading-snug ${modo === "rejilla" ? "text-[15px] text-slate-800" : "text-[13px] text-slate-800"}`}
              >
                <Variante c={c} d={d} />
              </span>
              {modo === "rejilla" && <EnElCapitulo c={c} d={d} comun={comun} />}
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
  const comun = firmaComun(c, datos);
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
                      className="tap-44 inline-block min-h-6 py-0.5 text-[15px] font-semibold leading-snug text-slate-900 underline-offset-4 hover:underline hover:decoration-slate-700"
                      title="Texto del capítulo"
                    >
                      <RotuloConSenal t={d.r} />
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
                    <span className="mb-0.5 block text-[14px] italic leading-snug text-slate-700">
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
                    <span className="mt-0.5 block text-[14px] text-slate-700">
                      <SinCortes texto={d.n} />
                    </span>
                  )}
                  <span className="block text-[14px]">
                    <Variante c={c} d={d} />
                  </span>
                  <EnElCapitulo c={c} d={d} comun={comun} />
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

/* 0.96.1 (revisión de Codex, V95-07): un parámetro, en los sistemas elegidos, uno debajo de otro
   (en el móvil, las cuatro tarjetas por sistema obligaban a recordar un dato de cada una). Los
   mismos datos de la ficha (fichaOperativa.ts), sin resumir nada; cada sistema, con su nombre, su
   color y el enlace a su fila de la ficha. */
export function AspectoEntreSistemas({
  cols,
  datos,
  nombre,
  ficha,
  aspecto,
  onAspecto,
}: {
  cols: number[];
  datos: Dato[][];
  nombre: (c: number) => ReactNode;
  ficha: (c: number, d: Dato) => string;
  aspecto: number;
  onAspecto: (i: number) => void;
}) {
  const a = ASPECTOS_PARAMETRO[aspecto] ?? ASPECTOS_PARAMETRO[0];
  return (
    <div>
      <div role="group" aria-label="Parámetro que se compara" className="flex flex-wrap gap-1.5">
        {ASPECTOS_PARAMETRO.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={i === aspecto}
            onClick={() => onAspecto(i)}
            className="chip tap-44"
          >
            {x.corto}
          </button>
        ))}
      </div>
      <h2 className="titulo-tarjeta mt-3">{a.t}</h2>
      <dl className="mt-2 space-y-2.5" aria-label={a.t}>
        {cols.map((c) => {
          const d = datos[c].find((x) => a.re.test(x.r));
          if (!d) return null;
          const h = SISTEMA_HEX[c];
          return (
            <div
              key={c}
              className="tarjeta tarjeta-sistema min-w-0 px-4 py-3"
              style={{ ["--sis" as string]: h.strong }}
            >
              <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {/* 1.0.10 (23.ª ronda, R3): que se vea que lleva a la ficha (antes, sin subrayado
                    ni flecha) y con zona de toque de 44 px. */}
                <a
                  href={ficha(c, d)}
                  className="titulo-tarjeta tap-44 inline-flex min-h-11 items-center gap-1 underline decoration-[var(--linea-fuerte)] decoration-dotted underline-offset-4 hover:decoration-solid"
                  style={{ color: h.ink }}
                >
                  {nombre(c)}
                  <span aria-hidden="true" className="no-underline">
                    ›
                  </span>
                </a>
                {d.auto && (
                  <span
                    className="insignia"
                    style={d.auto === "si" ? { background: h.soft, color: h.ink } : undefined}
                  >
                    {EN_AUTOMATICO[d.auto]}
                  </span>
                )}
              </dt>
              <dd className="mt-1 min-w-0 text-[15px] leading-snug text-slate-800">
                {d.cond && (
                  <span className="mb-0.5 block text-[14px] italic leading-snug text-slate-700">
                    <SinCortes texto={d.cond} />
                  </span>
                )}
                {d.antes && (
                  <span className="mb-1.5 block">
                    <SinCortes texto={d.antes} />
                  </span>
                )}
                <span className={d.antes ? "block font-semibold text-slate-900" : "block"}>
                  <SinCortes texto={d.v} />
                </span>
                {d.n && (
                  <span className="mt-0.5 block text-[14px] text-slate-700">
                    <SinCortes texto={d.n} />
                  </span>
                )}
                <span className="block text-[14px]">
                  <Variante c={c} d={d} />
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
