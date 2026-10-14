/* Sistemas: una sola pantalla para uno o varios. Uno = su ficha, la misma para entender y para
   consultar, en secciones con ruta propia (#/sistemas/<id>/<seccion>): Lo esencial (Tabla 1),
   Cómo funciona, Parámetros (Tablas 1 y 3), Situaciones (Tabla 4), literales, con la fuente al
   pie de cada bloque (componentes/FuentePie), y
   aparte la Ampliación técnica, fuera del capítulo y con sus fuentes. Varios o todos
   (#/sistemas/<a+b|todos>/<seccion>) = la misma sección, un sistema junto a otro: eso son
   «Comparar sistemas» y «Parámetros por sistema». */
import { NotaCorreccion } from "../componentes/NotaCorreccion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Baby,
  BarChart3,
  Box,
  Brain,
  ChevronDown,
  Check,
  Cpu,
  ExternalLink,
  Handshake,
  Minus,
  Radio,
  SlidersHorizontal,
  Syringe,
  Target,
  Timer,
  TrendingDown,
  Users,
  Utensils,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { CLAVE_ALGORITMO } from "../contenido/diagramas";
import {
  APARTADOS,
  TABLAS,
  algoritmoDelCapitulo,
  rutaDeTabla,
  idDeBloque,
  type Bloque,
  type Tabla,
} from "../contenido";
import {
  COMPAT_INSULINA,
  CRITERIOS,
  DIFIERE_CAMPO,
  DIFIERE_PARAM,
  FICHA_FILAS,
  FOTO_SISTEMA,
  FUENTES,
  INSULINAS_RAPIDAS,
  ORDEN_SISTEMAS,
  SETS_INFUSION,
  SISTEMAS_AMPLIACION,
  WEB_SISTEMA,
  columnaDeSistema,
  sistemaPorId,
  type Sistema,
} from "../ampliacion";
import { elegirRuta, href, fueNavegacionNueva } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Foldable, PaginaBadge } from "../ui";
import { AbrirEnVisor } from "../componentes/Visor";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SEEN, SISTEMA_HEX } from "../tokens";
import { plano } from "../marcado";
import type { SistemaId } from "../ampliacion/tipos";
import { TablaVista } from "../componentes/TablaVista";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { NivelTitulo } from "../nivel-contexto";
import { CON_AMPLIACION, retirado } from "../edicion";
import { CATALOGO_SISTEMAS, sistemaDelCatalogo } from "../ampliacion/ids";
import { Elegir } from "./Elegir";

export { Elegir };
import { comoFunciona } from "../guias";
import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE } from "../notas-complementarias";
import { PiezaVista } from "../componentes/Piezas";
import { FuentePie } from "../componentes/FuentePie";
import { paginasDe } from "../paginas";
import { fuentesDePiezas } from "../fuentesPiezas";

const hex = CATEGORIA_HEX.consultar;

/* Palabras con las que el capítulo nombra cada sistema (para encontrar sus párrafos). */
const ALIAS: Record<string, RegExp> = {
  mm780: /MiniMed 780G|SmartGuard|MiniMed\b/,
  ciq: /Control-IQ|Tandem|t:slim/,
  camaps: /CamAPS|myLoop|Liberty|Boost|Ease-off|YpsoPump/,
  op5: /Omnipod|SmartAdjust|Función Actividad/,
};

function parrafosDelSistema(id: string) {
  const re = ALIAS[id];
  const out: { slug: string; titulo: string; ancla: string; b: Extract<Bloque, { t: "p" }> }[] = [];
  for (const a of APARTADOS)
    a.bloques.forEach((b, i) => {
      if (b.t === "p" && re.test(plano(b.texto)))
        out.push({ slug: a.slug, titulo: a.titulo, ancla: idDeBloque(b, i), b });
    });
  return out;
}

const PARAMETROS_AUTO = TABLAS.T1.filas.find(
  (f) => f.etiqueta === "Parámetros configurables en modo automático",
);

/* La casilla del sistema en «Parámetros configurables en modo automático» (Tabla 1, p. 4),
   separada como dice su nota: los marcados con asterisco tienen efecto directo sobre el
   algoritmo; el resto interviene sobre todo en los bolos o en el modo manual. Los nombres son
   literales; la agrupación y sus rótulos son de la app. */
function ParametrosConfigurables({ c, ink }: { c: number; ink: string }) {
  const lineas = (PARAMETROS_AUTO?.celdas[c] ?? "").split("\n").map((l) => l.trim());
  const grupos = [
    {
      rotulo: "Efecto directo en el modo automático (*)",
      items: lineas.filter((l) => l.endsWith("*")),
    },
    {
      rotulo: "Sobre todo en los bolos y el modo manual",
      items: lineas.filter((l) => l && !l.endsWith("*")),
    },
  ].filter((g) => g.items.length);
  return (
    <span className="mt-1 block space-y-1">
      {grupos.map((g) => (
        <span key={g.rotulo} className="block">
          <span className="block text-[11px] font-semibold" style={{ color: ink }}>
            {g.rotulo}
          </span>
          <span className="block text-slate-900">{g.items.join(" · ")}</span>
        </span>
      ))}
    </span>
  );
}

function Estado({ v }: { v: "yes" | "partial" | "no" }) {
  if (v === "yes") return <Check size={14} className="text-emerald-700" aria-label="Sí" />;
  if (v === "partial") return <Minus size={14} className="text-amber-700" aria-label="Parcial" />;
  return <X size={14} className="text-red-700" aria-label="No" />;
}

const NIVEL: Record<string, { etiqueta: string; color: string }> = {
  directo: { etiqueta: "Influye en automático", color: "#10b981" },
  indirecto: { etiqueta: "Influye indirectamente", color: "#f59e0b" },
  manual: { etiqueta: "Solo en manual o calculador", color: "#d4d4d4" },
  fijo: { etiqueta: "Fijo en automático", color: "#94a3b8" },
};

/* Marca de un dato de la ampliación que no coincide con el capítulo: manda el capítulo. */
function Ampliacion({ s }: { s: Sistema }) {
  const sets = SETS_INFUSION[s.id] || [];
  const fuentes = s.sources.map((id) => ({ id, f: FUENTES[id] })).filter((x) => x.f);
  return (
    <section aria-labelledby="ampliacion" className="mt-8">
      <div className="mb-3 rounded-2xl border border-violet-200 bg-violet-50 p-3">
        <h2 id="ampliacion" className="text-base font-extrabold text-violet-900">
          Ampliación técnica · fuera del capítulo
        </h2>
        <p className="mt-1 text-sm text-violet-900">
          Ficha técnica con sus fuentes al pie (última verificación: {s.verified}). No forma parte
          del texto del Manual SEEN. La disponibilidad y las condiciones pueden cambiar: confirmar
          siempre en la ficha técnica vigente.
        </p>
      </div>
      <div className="space-y-3">
        {FICHA_FILAS.map((g) => (
          <Foldable key={g.g} title={g.g} open={g.g === "Indicación y objetivo"}>
            <dl className="divide-y" style={{ borderColor: "#e6e6e6" }}>
              {g.rows.map((r) => {
                let valor: React.ReactNode = null;
                // Donde la ampliación no coincide con el capítulo, se enseña la frase del capítulo.
                const dif = r.f ? DIFIERE_CAMPO[s.id]?.[r.f] : undefined;
                if (dif)
                  valor = (
                    <>
                      <Lineas>{dif.capitulo}</Lineas>{" "}
                      <span className="pagina-badge">
                        {dif.donde}, p. {dif.p}
                      </span>
                    </>
                  );
                else if (r.f) valor = <Lineas>{s.detail[r.f] || "—"}</Lineas>;
                else if (r.crit) {
                  const c = CRITERIOS.find((x) => x.id === r.crit);
                  const cel = c?.s[s.id];
                  valor = cel ? (
                    <span className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">
                        <Estado v={cel.v} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <Lineas>{cel.t}</Lineas>
                      </span>
                    </span>
                  ) : null;
                }
                return (
                  <div key={r.k} className="grid gap-1 py-2.5 sm:grid-cols-[13rem_1fr] sm:gap-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {r.k}
                    </dt>
                    <dd className="text-sm text-slate-800">{valor}</dd>
                  </div>
                );
              })}
            </dl>
          </Foldable>
        ))}
        <Foldable
          title="Parámetros: cuáles mueven el modo automático"
          subtitle={`Resumen de la ampliación: ${s.takeaway}`}
        >
          <ul className="space-y-2">
            {s.params.map((p) => {
              const n = NIVEL[p.level];
              return (
                <li
                  key={p.name}
                  className="rounded-lg border-l-4 bg-white py-1.5 pl-3 pr-2"
                  style={{ borderColor: n.color }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{p.name}</span>
                    {/* Si el capítulo no le da efecto directo (sin asterisco en la Tabla 1), sin etiqueta de nivel. */}
                    {!DIFIERE_PARAM[s.id]?.[p.name] && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {n.etiqueta}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-700">{p.note}</p>
                  {p.modes && (
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {p.modes.map((m) => (
                        <li key={m.name}>
                          <span className="font-semibold">{m.name}:</span> {m.desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </Foldable>
        <Foldable title="Sets de infusión" count={sets.length || undefined}>
          {sets.length === 0 ? (
            <p className="text-sm text-slate-700">
              Pod sin tubo: cánula integrada, inserción automática; no hay set externo que elegir.
              Rotación de zonas y adhesión, claves.
            </p>
          ) : (
            <div
              className="tabla-scroll rounded-xl border"
              style={{ borderColor: "#e6e6e6" }}
              tabIndex={0}
              role="region"
              aria-label="Sets de infusión, desplazable"
            >
              <table className="tabla-capitulo w-full text-sm">
                <thead>
                  <tr>
                    {[
                      "Set",
                      "Material",
                      "Ángulo",
                      "Cánula (mm)",
                      "Tubo (cm)",
                      "Inserción",
                      "Cambio (días)",
                    ].map((c) => (
                      <th
                        key={c}
                        scope="col"
                        className="px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wide"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sets.map((x) => (
                    <tr key={x.name}>
                      <th
                        scope="row"
                        className="border-t px-2 py-1.5 text-left text-xs font-bold text-slate-800"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.name}
                      </th>
                      <td
                        className="border-t px-2 py-1.5 text-slate-700"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.material}
                      </td>
                      <td
                        className="border-t px-2 py-1.5 text-slate-700"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.angle}
                      </td>
                      <td
                        className="border-t px-2 py-1.5 text-slate-700"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.cannula.join(" / ")}
                      </td>
                      <td
                        className="border-t px-2 py-1.5 text-slate-700"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.tubing.join(" / ")}
                      </td>
                      <td
                        className="border-t px-2 py-1.5 text-slate-700"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.insertion}
                      </td>
                      <td
                        className="border-t px-2 py-1.5 text-slate-700"
                        style={{ borderColor: "#e6e6e6" }}
                      >
                        {x.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Foldable>
        <Foldable title="Insulinas rápidas compatibles">
          <ul className="space-y-1.5">
            {INSULINAS_RAPIDAS.map((ins) => {
              const c = COMPAT_INSULINA[ins.id]?.[s.id];
              if (!c) return null;
              const tono = c.status === "ok" ? "emerald" : c.status === "evitar" ? "red" : "amber";
              return (
                <li key={ins.id} className="flex items-start gap-2 text-sm text-slate-800">
                  <span
                    className={`mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${tono === "emerald" ? "bg-emerald-100 text-emerald-800" : tono === "red" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}
                  >
                    {c.status === "ok" ? "Sí" : c.status === "evitar" ? "Evitar" : "Verificar"}
                  </span>
                  <span>
                    <span className="font-semibold">{ins.name}</span>
                    {c.note && <span className="text-slate-600"> — {c.note}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </Foldable>
        <Foldable title="Fuentes de la ampliación" count={fuentes.length}>
          <ol className="space-y-1.5 text-xs text-slate-700">
            {fuentes.map(({ id, f }) => (
              <li key={id}>
                <span className="font-semibold text-slate-900">{f.label}.</span> {f.ref}
                {f.url && (
                  <>
                    {" "}
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-0.5 font-semibold text-sky-800 hover:underline sm:min-h-7"
                    >
                      enlace <ExternalLink size={10} aria-hidden="true" />
                    </a>
                  </>
                )}
                <span className="text-slate-500"> · verificado: {f.checked}</span>
              </li>
            ))}
          </ol>
        </Foldable>
      </div>
    </section>
  );
}

/* «Parámetros configurables en modo automático»: la fila literal de la Tabla 1 para este
   sistema, agrupada según la nota del asterisco y con la nota al lado. Arriba de la ficha, porque
   es la consulta más frecuente sobre un sistema. */
function ParametrosAutomatico({
  c,
  hexSistema,
  fuente = true,
}: {
  c: number;
  hexSistema: { soft: string; ink: string; strong: string };
  /* La línea de fuente al pie (en la comparación va una sola, debajo de todos). */
  fuente?: boolean;
}) {
  const fila = TABLAS.T1.filas.find(
    (f) => f.etiqueta === "Parámetros configurables en modo automático",
  );
  if (!fila) return null;
  return (
    <div
      className="mt-3 rounded-xl border-l-4 bg-white p-3"
      style={{ borderLeftColor: hexSistema.strong }}
    >
      <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
        Parámetros configurables en modo automático
      </div>
      <div className="mt-1 text-sm font-semibold">
        <ParametrosConfigurables c={c} ink={hexSistema.ink} />
      </div>
      <p className="mt-1 text-xs text-slate-600">
        <Texto>{TABLAS.T1.notas[0]}</Texto>
      </p>
      {fuente && <FuentePie fuentes={[fuenteT1(4)]} className="mt-1" />}
    </div>
  );
}

/* La Tabla 1 como fuente: con una página dada si la fila está en ella; si no, el intervalo
   entero de la tabla (A11). */
const fuenteT1 = (p?: number) => ({
  texto: `Tabla 1, ${p ? `p. ${p}` : paginasDe(TABLAS.T1.paginas[0], TABLAS.T1.paginas[1])}`,
  ruta: rutaDeTabla("T1"),
});

/* Identificador de cada sistema en las rutas de tablas, situaciones e inicio (orden de la
   Tabla 1). */
const SLUG_TABLA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
const SLUG_CORTO = ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"];

/* Secciones de la ficha, cada una con su ruta (#/sistemas/<id>/<seccion>). */
const TODAS_LAS_SECCIONES = [
  { id: "funciona", t: "Cómo funciona" },
  { id: "esencial", t: "Indicación y material" },
  { id: "parametros", t: "Parámetros" },
  { id: "ampliacion", t: "Ampliación técnica" },
] as const;
/* La comparación (0.70.0): la Tabla 1 y la Tabla 3, sin «Cómo funciona» comparado (repetía la
   Tabla 1). */
const SECCIONES_COMPARACION = [
  { id: "esencial", t: "Lo esencial" },
  { id: "parametros", t: "Parámetros" },
] as const;
/* La ampliación técnica no va en la edición editorial (A06): ni pestaña ni sección. */
const SECCIONES_FICHA = TODAS_LAS_SECCIONES.filter((x) => !retirado(x.id));

/* La tabla en su sitio del capítulo (para comprobar la fuente y volver). */
function rutaEnCapitulo(t: Tabla): string | null {
  return rutaDeTabla(t.id) ?? null;
}

/* La columna de un sistema en una tabla del capítulo: filas literales, notas y página. */
/* Iconos de las filas de las Tablas 1 y 3 (por índice de fila). */
const ICONO_FILA: Record<string, Record<number, LucideIcon>> = {
  T1: {
    0: Box,
    1: Radio,
    2: Cpu,
    3: Brain,
    4: Syringe,
    5: Zap,
    6: Target,
    7: Users,
    8: Baby,
    9: BarChart3,
    10: SlidersHorizontal,
  },
  T3: { 0: Target, 1: Activity, 2: Utensils, 3: TrendingDown, 4: Timer },
};
const iconoDeFila = (tabla: string, i: number) => {
  const I = ICONO_FILA[tabla]?.[i];
  return I ? <I size={15} aria-hidden="true" className="shrink-0 text-slate-500" /> : null;
};

/* Las filas de una tabla para un sistema, como tarjetas con icono (rótulo de la fila y su
   casilla literal), con las notas que tocan y la fuente al pie. */
function ColumnaTabla({
  t,
  c,
  filas,
  pie,
  insignia,
  destacar,
  notaExtra,
  fuentesExtra = [],
}: {
  t: Tabla;
  c: number;
  filas?: (etiqueta: string, j: number) => boolean;
  pie?: ReactNode;
  insignia?: (j: number) => ReactNode;
  /* Tarjetas que se destacan con el borde del sistema (efecto directo en automático). */
  destacar?: (j: number) => boolean;
  notaExtra?: string;
  fuentesExtra?: { texto: string; ruta?: string }[];
}) {
  const hexS = SISTEMA_HEX[c];
  // La nota del asterisco solo si alguna celda mostrada lo lleva; la lista de siglas, plegada.
  const vistas = t.filas.filter((f, j) => !filas || filas(f.etiqueta, j));
  const hayAsterisco = vistas.some((f) => (f.unida ? f.celdas[0] : f.celdas[c]).includes("*"));
  const esAsterisco = (n: string) => n.trimStart().startsWith("*");
  const esSiglas = (n: string) => /^[A-ZÁÉÍÓÚ/]{2,}: /.test(n.trim());
  const notas = t.notas.filter((n) => (esAsterisco(n) ? hayAsterisco : !esSiglas(n)));
  const siglas = t.notas.filter(esSiglas);
  return (
    // 0.72.0: sin la caja de fuera (tarjetas dentro de una tarjeta).
    <div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {t.filas.map((f, j) => {
          if (filas && !filas(f.etiqueta, j)) return null;
          const I = ICONO_FILA[t.id]?.[j];
          return (
            <div
              key={j}
              className="rounded-xl p-3"
              style={{
                background: hexS.soft,
                boxShadow: destacar?.(j)
                  ? `inset 0 0 0 2px ${hexS.strong}`
                  : `inset 3px 0 0 0 ${hexS.strong}`,
              }}
            >
              <dt
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide"
                style={{ color: hexS.ink }}
              >
                {I && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
                    <I size={15} aria-hidden="true" />
                  </span>
                )}
                <span className="min-w-0">
                  <Lineas>{f.etiqueta}</Lineas>
                </span>
              </dt>
              <dd className="mt-1.5 text-[15px] text-slate-800">
                {/* La insignia, dentro del dd: en un <dl> solo caben dt y dd. */}
                {insignia?.(j) && <span className="-mt-0.5 mb-1 block">{insignia(j)}</span>}
                <Lineas>{f.unida ? f.celdas[0] : f.celdas[c]}</Lineas>
              </dd>
            </div>
          );
        })}
      </dl>
      {(notas.length > 0 || notaExtra) && (
        <div
          className="mt-2 space-y-1 border-t pt-2 text-xs text-slate-600"
          style={{ borderColor: "#e6e6e6" }}
        >
          {[...(notaExtra ? [notaExtra] : []), ...notas].map((n, k) => (
            <p key={k}>
              <Texto>{n}</Texto>
            </p>
          ))}
        </div>
      )}
      {siglas.length > 0 && (
        <details className="mt-2 text-xs text-slate-600">
          <summary className="min-h-11 cursor-pointer font-semibold text-slate-700 sm:min-h-6">
            Siglas de la tabla
          </summary>
          {siglas.map((n, k) => (
            <p key={k} className="mt-1">
              <Texto>{n}</Texto>
            </p>
          ))}
        </details>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <FuentePie
          className=""
          nota=""
          fuentes={[
            {
              texto: `Tabla ${t.numero}, ${paginasDe(t.paginas[0], t.paginas[1])}`,
              ruta: rutaEnCapitulo(t) ?? undefined,
            },
            ...fuentesExtra,
          ]}
        />
        {pie}
      </div>
    </div>
  );
}

/* Título de sección con el sistema al lado: al entrar por un enlace directo, la cabecera de la
   ficha queda arriba y fuera de la vista. */
function TituloSeccion({
  id,
  sistema,
  color,
  children,
}: {
  id: string;
  sistema: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className="mb-2 scroll-mt-2 text-base font-extrabold text-slate-900">
      {children} <span style={{ color }}>· {sistema}</span>
    </h2>
  );
}

export function FichaSistema({ id, seccion }: { id?: string; seccion?: string }) {
  const s = sistemaDelCatalogo(id);
  const ref = useRef<HTMLDivElement>(null);
  const parrafos = useMemo(() => (s ? parrafosDelSistema(s.id) : []), [s]);
  const completa = seccion === "completa";
  // Enlace a una sección concreta (#/sistemas/<id>/parametros): se abre en ella; la barra con
  // el sistema y la sección queda pegada arriba (scroll-mt de la sección deja sitio).
  const montada = useRef(false);
  useEffect(() => {
    const primera = !montada.current;
    montada.current = true;
    if (!seccion || completa) return;
    // Al volver atrás (Ver en el capítulo → Atrás), la Shell restaura la posición: no se salta.
    if (primera && !fueNavegacionNueva()) return;
    document.getElementById(seccion)?.scrollIntoView?.({ block: "start" });
  }, [seccion, id, completa]);
  if (!s) return <Comparacion ids={[]} />;
  const c = columnaDeSistema(s.id);
  const h = SISTEMA_HEX[c];
  const slug = SLUG_TABLA[c];
  // Una sola página (0.70.0): la sección de la ruta es solo adónde se salta.
  const sec = completa ? undefined : seccion;
  return (
    <div ref={ref} className="imprimible">
      <div className="no-imprimir mb-2 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("sistemas")}
          className="inline-flex min-h-11 items-center font-semibold hover:underline"
        >
          Sistemas AID
        </a>
        <span aria-hidden="true">›</span>
        <span>{s.name}</span>
      </div>
      {/* En el móvil, los enlaces van a lo ancho debajo de la foto (dos filas en vez de tres). */}
      <header className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-4">
        <AbrirEnVisor
          imagen={{ src: FOTO_SISTEMA[s.id], alt: `Foto oficial de ${s.name}`, titulo: s.name }}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:row-span-2 sm:h-32 sm:w-32"
          etiqueta={`Ampliar la foto de ${s.name}`}
        >
          <img
            src={FOTO_SISTEMA[s.id]}
            alt={`Foto oficial de ${s.name}`}
            className="h-full w-full object-cover"
          />
        </AbrirEnVisor>
        <div className="min-w-0">
          {/* Imprimir, junto al título (A09): la única acción secundaria de la cabecera. */}
          <div className="flex items-start justify-between gap-2">
            <h1
              className="min-w-0 text-2xl font-black tracking-tight sm:text-3xl"
              style={{ color: h.ink }}
            >
              {s.name}
            </h1>
            <div className="no-imprimir shrink-0">
              <BotonImprimir objetivo={ref} compacto>
                Imprimir
              </BotonImprimir>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-600">{algoritmoDelCapitulo(c)}</p>
        </div>
        {/* En el móvil, tres botones iguales en una fila; en pantalla ancha, enlaces (0.53.0). */}
        <div className="no-imprimir col-span-2 mt-2 grid grid-cols-3 gap-2 sm:col-span-1 sm:col-start-2 sm:flex sm:flex-wrap sm:gap-x-3 sm:gap-y-1">
          <a
            // I61-04: al principio del recorrido (preparación), con el sistema; no al paso 5.
            href={href("consultar", "inicio", `preparacion:${slug}`)}
            className="flex min-h-11 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-1.5 text-center text-sm font-semibold leading-tight hover:underline sm:inline-flex sm:min-h-8 sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 sm:text-left"
            style={{ color: h.ink }}
          >
            <span className="sm:hidden">Preparar e iniciar</span>
            <span className="hidden sm:inline">Preparar e iniciar este sistema</span>
            <ArrowRight size={13} aria-hidden="true" className="hidden sm:block" />
          </a>
          <a
            href={href("pacientes", "plan", s.id)}
            className="flex min-h-11 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-1.5 text-center text-sm font-semibold leading-tight hover:underline sm:inline-flex sm:min-h-8 sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 sm:text-left"
            style={{ color: h.ink }}
          >
            <span className="sm:hidden">Plan de seguridad</span>
            <span className="hidden sm:inline">Plan de seguridad para entregar</span>
            <ArrowRight size={13} aria-hidden="true" className="hidden sm:block" />
          </a>
          <a
            href={href("consultar", "situacion", `:${slug}`)}
            className="flex min-h-11 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-1.5 text-center text-sm font-semibold leading-tight hover:underline sm:inline-flex sm:min-h-8 sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 sm:text-left"
            style={{ color: h.ink }}
          >
            Situaciones <ArrowRight size={13} aria-hidden="true" className="hidden sm:block" />
          </a>
        </div>
      </header>

      <BarraSistemas ids={[s.id]} seccion={sec} />
      {/* 0.70.0: la ficha es una sola página; las pestañas llevan a cada sección. */}
      <section aria-labelledby="funciona" className="scroll-mt-2">
        <TituloSeccion id="funciona" sistema={s.name} color={h.ink}>
          Cómo funciona
        </TituloSeccion>
        <ComoFuncionaSistema c={c} id={s.id as SistemaId} />
      </section>

      <section aria-labelledby="esencial" className="mt-7 scroll-mt-2">
        <TituloSeccion id="esencial" sistema={s.name} color={h.ink}>
          Indicación y material
        </TituloSeccion>
        <ColumnaTabla
          t={TABLAS.T1}
          c={c}
          filas={(_e, j) => [0, 7, 8, 9].includes(j)}
          pie={
            <a
              href={WEB_SISTEMA[s.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="no-imprimir inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
            >
              Web oficial <ExternalLink size={12} aria-hidden="true" />
            </a>
          }
        />
      </section>

      <section aria-labelledby="parametros" className="mt-7 scroll-mt-2">
        <TituloSeccion id="parametros" sistema={s.name} color={h.ink}>
          Parámetros
        </TituloSeccion>
        {/* 0.72.0: lo que cuenta en automático, como insignia en cada tarjeta de la Tabla 3
            (según la fila «Parámetros configurables en modo automático» de la Tabla 1 y su nota),
            en vez de un recuadro aparte que repetía los nombres. */}
        <ColumnaTabla
          t={TABLAS.T3}
          c={c}
          insignia={(j) => insigniaParametro(c, j)}
          destacar={(j) => esDirecto(c, j)}
          notaExtra={TABLAS.T1.notas[0]}
          fuentesExtra={[fuenteT1(4)]}
        />
      </section>

      {/* En papel, sin los párrafos (0.72.0: la ficha impresa salía en cinco caras). */}
      <section aria-label="Más del capítulo sobre este sistema" className="no-imprimir mt-7">
        <Foldable title="Párrafos del capítulo que lo nombran" count={parrafos.length}>
          <ol className="space-y-3">
            {parrafos.map((p) => (
              <li key={p.slug + p.ancla} className="text-sm text-slate-800">
                <p>
                  {p.b.lead && <strong>{p.b.lead} </strong>}
                  <Texto>{p.b.texto}</Texto>
                </p>
                <a
                  href={href("capitulo", p.slug, p.ancla)}
                  className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-600 hover:underline sm:min-h-6"
                >
                  {p.titulo} · <PaginaBadge p={p.b.p} p2={p.b.p2} />{" "}
                  <ArrowRight size={11} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </Foldable>
      </section>

      {CON_AMPLIACION && <Ampliacion s={sistemaPorId(s.id)!} />}
    </div>
  );
}

/* ---------- Sistemas: un solo espacio para uno (su ficha) o varios (comparados) ---------- */
/* La selección vive en la ruta: #/sistemas (entrada), #/sistemas/<id>[/seccion] (ficha por
   secciones; /completa, entera), #/sistemas/<a+b>/<seccion> (dos o tres comparados) y
   #/sistemas/todos/<seccion> (los cuatro). «Comparar sistemas» y «Parámetros por sistema» son
   esta pantalla con los cuatro y la sección elegida. El selector es el mismo en todas las
   vistas: marcar añade, desmarcar quita; con uno, se ve su ficha. */
const IDS_SISTEMA = ORDEN_SISTEMAS as readonly string[];

function leerSeleccion(sel?: string): string[] {
  if (!sel || sel === "todos") return [];
  return IDS_SISTEMA.filter((id) => sel.split("+").includes(id));
}

/* «Situaciones» ya no es una sección de Sistemas: la dirección antigua lleva a Situaciones,
   con el sistema elegido si era uno. */
function AsituacionesConSistema({ ids }: { ids: string[] }) {
  useEffect(() => {
    elegirRuta(
      "consultar",
      "situacion",
      ids.length === 1 ? `:${SLUG_TABLA[columnaDeSistema(ids[0] as SistemaId)]}` : undefined,
    );
  }, [ids]);
  return null;
}

export function Sistemas({ sel, seccion }: { sel?: string; seccion?: string }) {
  if (sel === "elegir") return <Elegir antigua={!!seccion} />;
  const ids = sel === undefined ? [] : leerSeleccion(sel);
  if (seccion === "situaciones") return <AsituacionesConSistema ids={ids} />;
  // Dirección antigua de la ampliación técnica: aviso de alcance y la ficha del capítulo.
  if (seccion === "ampliacion" && retirado("ampliacion")) return <AmpliacionRetirada ids={ids} />;
  if (sel !== undefined && sel !== "todos" && !ids.length) return <Comparacion ids={[]} />;
  const sec = SECCIONES_FICHA.some((x) => x.id === seccion)
    ? seccion
    : seccion === "completa"
      ? "completa"
      : undefined;
  if (ids.length === 1) return <FichaSistema id={ids[0]} seccion={sec} />;
  return <Comparacion ids={ids} seccion={sec === "completa" ? "esencial" : sec} />;
}

function AmpliacionRetirada({ ids }: { ids: string[] }) {
  const destino = ids.length === 1 ? href("sistemas", ids[0], "esencial") : href("sistemas");
  return (
    <div
      className="rounded-xl border bg-white p-4 text-sm text-slate-700"
      style={{ borderColor: "#e6e6e6" }}
    >
      <h1 className="text-lg font-extrabold text-slate-900">
        La ampliación técnica no está en esta edición
      </h1>
      <p className="mt-1">
        Este complemento recoge solo lo que dice el capítulo 89. Los datos de ficha técnica de cada
        sistema quedan para una edición posterior.
      </p>
      <a href={destino} className="mt-2 inline-flex min-h-11 items-center font-semibold underline">
        {ids.length === 1 ? "Ir a lo esencial del sistema" : "Ir a Sistemas AID"}
      </a>
    </div>
  );
}

/* Selector de sistemas y pestañas de sección, pegados arriba al desplazarse: el sistema y la
   sección que se consultan quedan siempre a mano. */
function BarraSistemas({ ids, seccion }: { ids: string[]; seccion?: string }) {
  const sec = seccion;
  const secciones = ids.length === 1 ? SECCIONES_FICHA : SECCIONES_COMPARACION;
  const selStr = ids.length ? ids.join("+") : "todos";
  const rutaCon = (nuevos: string[]) =>
    nuevos.length === 1
      ? href("sistemas", nuevos[0], sec ?? "funciona")
      : href(
          "sistemas",
          nuevos.length ? nuevos.join("+") : "todos",
          !sec || sec === "funciona" ? "esencial" : sec,
        );
  // En la entrada (los cuatro), las casillas se van marcando sin cambiar de pantalla; con dos
  // o más, «Comparar» (0.72.0: la primera casilla llevaba a la ficha).
  const entrada = ids.length === 0 && !sec;
  const [marcados, setMarcados] = useState<string[]>([]);
  const alternar = (id: string) => {
    if (entrada) {
      setMarcados((m) =>
        m.includes(id)
          ? m.filter((x) => x !== id)
          : IDS_SISTEMA.filter((x) => m.includes(x) || x === id),
      );
      return;
    }
    const nuevos = ids.includes(id)
      ? ids.filter((x) => x !== id)
      : IDS_SISTEMA.filter((x) => ids.includes(x) || x === id);
    window.location.replace(rutaCon(nuevos));
    // De la ficha a la comparación (o al revés), arriba: es otra pantalla (0.72.0).
    if ((ids.length === 1) !== (nuevos.length === 1)) window.scrollTo({ top: 0 });
  };
  // 0.71.0: en escritorio la barra no se pliega (hay sitio). En el móvil, al bajar se pliega a
  // una línea («Control-IQ + Omnipod 5 · Cambiar») y, en la ficha de un sistema, empieza plegada:
  // el contenido queda en la primera pantalla. «Cambiar» la abre hasta el siguiente desplazamiento.
  const [movil] = useState(() => window.matchMedia?.("(max-width: 639px)").matches ?? false);
  // Plegada de entrada en la ficha de un sistema y en la lista (las tarjetas ya eligen).
  const deEntrada = ids.length === 1 || (ids.length === 0 && !seccion);
  const [plegada, setPlegada] = useState(movil && deEntrada);
  const [abierta, setAbierta] = useState(false);
  const barra = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!movil) return;
    const onScroll = () => {
      const lejos = window.scrollY > 220 || deEntrada;
      setPlegada((p) => (p !== lejos ? lejos : p));
      if (window.scrollY > 220) setAbierta(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [movil, deEntrada]);
  const compacta = plegada && !abierta;
  const resumen = ids.length
    ? ids.map((id) => SLUG_CORTO[columnaDeSistema(id as SistemaId)]).join(" + ")
    : "Los cuatro sistemas";
  return (
    <div
      ref={barra}
      // En la comparación del ordenador, la barra no se pega: lo que queda arriba al bajar es la
      // cabecera de la tabla, con los nombres de los sistemas (0.72.0).
      className={`barra-pegada no-imprimir sticky top-14 z-10 -mx-3 mb-4 border-b px-3 pt-2 sm:mx-0 sm:rounded-lg sm:border sm:px-3 ${ids.length === 1 ? "" : "lg:static"}`}
      style={{ borderColor: "#e6e6e6" }}
    >
      {compacta ? (
        <button
          type="button"
          onClick={() => {
            setAbierta(true);
            // El foco, a la primera casilla (2.4.3: el botón desaparece al abrirse).
            requestAnimationFrame(() =>
              barra.current?.querySelector<HTMLElement>('[role="group"] button')?.focus(),
            );
          }}
          className="flex min-h-11 w-full items-center gap-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          aria-expanded={false}
        >
          {/* En la ficha, el nombre ya está en la cabecera y en cada sección (0.72.0). */}
          <span className="min-w-0 flex-1 truncate font-semibold text-slate-900">
            {ids.length === 1 ? "" : resumen}
          </span>
          <span className="shrink-0 text-xs font-semibold" style={{ color: SEEN.burdeos }}>
            {ids.length === 1
              ? "Cambiar o comparar"
              : ids.length === 0 && !seccion
                ? "Elegir para comparar"
                : "Cambiar"}
          </span>
        </button>
      ) : (
        <CasillasSistema
          etiqueta="Sistemas"
          seleccion={(entrada ? marcados : ids).map((id) => columnaDeSistema(id as SistemaId))}
          onToggle={(c) => alternar(IDS_SISTEMA[c])}
          extra={
            entrada ? (
              marcados.length > 0 && (
                <a
                  href={rutaCon(marcados)}
                  onClick={() => window.scrollTo({ top: 0 })}
                  className="tap-44 inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-3 py-1 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  style={{ background: SEEN.burdeos }}
                >
                  {marcados.length === 1 ? "Ver la ficha" : `Comparar (${marcados.length})`}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              )
            ) : (
              <button
                type="button"
                aria-pressed={ids.length === 0}
                onClick={() => window.location.replace(rutaCon([]))}
                className="tap-44 inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2.5 py-1 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                style={
                  ids.length === 0
                    ? { borderColor: SEEN.burdeos, background: "#f7eff3", color: "#1e293b" }
                    : { borderColor: "#d4d4d4", background: "#fff", color: "#334155" }
                }
              >
                Los cuatro
              </button>
            )
          }
        />
      )}
      <nav
        aria-label="Sección"
        className="-mx-3 mt-1 flex items-center gap-1 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {ids.length === 0 && !sec && (
          <span className="shrink-0 pl-1 pr-1 text-xs font-semibold text-slate-500">
            Comparar los cuatro:
          </span>
        )}
        {secciones.map((x) => (
          <a
            key={x.id}
            href={href("sistemas", selStr, x.id)}
            aria-current={sec === x.id ? "location" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center border-b-2 px-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${sec === x.id ? "font-bold" : "border-transparent font-semibold text-slate-600 hover:text-slate-900"}`}
            style={sec === x.id ? { borderColor: SEEN.burdeos, color: SEEN.burdeos } : undefined}
          >
            {x.t}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* Entrada de Sistemas (#/sistemas): los cuatro con su foto y su algoritmo (Tabla 1), los
   criterios de elección y la comparación de los cuatro por sección. */
function EntradaSistemas() {
  return (
    <div className="space-y-4">
      {/* 13-10-2026: cada tarjeta con lo esencial de la Tabla 1 (fragmentos literales,
          CLAVE_ALGORITMO) para distinguirlos antes de entrar. */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {CATALOGO_SISTEMAS.map((s, c) => {
          const h = SISTEMA_HEX[c];
          const k = CLAVE_ALGORITMO[c];
          const [nombreAlg, tipo] = algoritmoDelCapitulo(c).split(": algoritmo de tipo ");
          const sensores = TABLAS.T1.filas.find((f) => f.etiqueta === "Sensores compatibles")!
            .celdas[c];
          // El formato, hasta la primera pausa de su casilla («Bomba con catéter», «Pod
          // desechable, sin tubo externo»): fragmento literal de la Tabla 1.
          const formato = TABLAS.T1.filas[0].celdas[c].split(/;| \(/)[0].replace(/\.$/, "");
          const datos: [typeof Cpu, string, string][] = [
            [Box, "Formato", formato],
            [Cpu, "Algoritmo", k.donde.join(" · ")],
            [Timer, "Actúa", k.actua.join(" · ")],
            [Target, "Objetivo", k.objetivo.join(" · ")],
            [Radio, "Sensores", sensores],
          ];
          return (
            <li key={s.id}>
              <a
                href={href("sistemas", s.id)}
                className="hover-lift ease-brand block h-full overflow-hidden rounded-xl border border-t-4 bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e6e6e6", borderTopColor: h.strong }}
              >
                <span
                  className="flex items-center gap-3 px-3 py-2.5"
                  style={{ background: h.soft }}
                >
                  <img
                    src={FOTO_SISTEMA[s.id]}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg border bg-white object-cover"
                    style={{ borderColor: "#e6e6e6" }}
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-lg font-extrabold leading-tight"
                      style={{ color: h.ink }}
                    >
                      {s.name}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
                      <span className="font-semibold">{nombreAlg}</span>
                      {tipo && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                          style={{ background: h.ink }}
                        >
                          {tipo}
                        </span>
                      )}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className="shrink-0"
                    style={{ color: h.ink }}
                    aria-hidden="true"
                  />
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-3 py-2.5">
                  {datos.map(([I, t, v]) => (
                    <span key={t} className="flex min-w-0 gap-1.5">
                      <I
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: h.strong }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {t}
                        </span>
                        <span className="block text-xs font-semibold leading-snug text-slate-900">
                          {v}
                        </span>
                      </span>
                    </span>
                  ))}
                  <span className="col-span-2 flex items-center gap-1.5 text-xs text-slate-700">
                    <Syringe
                      size={14}
                      className="shrink-0"
                      style={{ color: h.strong }}
                      aria-hidden="true"
                    />
                    <span className="font-semibold">Bolos automáticos de corrección:</span>
                    <span
                      className="rounded px-1.5 text-[11px] font-extrabold"
                      style={
                        k.correccion.si
                          ? { background: h.ink, color: "#fff" }
                          : { background: "#e2e8f0", color: "#334155" }
                      }
                    >
                      {k.correccion.si ? "Sí" : "No"}
                    </span>
                  </span>
                  {/* M61-01: la condición, junto al Sí/No (fragmentos literales de la Tabla 1). */}
                  <span className="col-span-2 -mt-1 block pl-5 text-xs leading-snug text-slate-600">
                    {k.correccion.texto.join(" · ")}
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href={href("sistemas", "elegir")}
        className="flex min-h-11 items-center gap-3 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        style={{ borderColor: "#e6e6e6" }}
      >
        <Handshake
          size={18}
          className="shrink-0"
          style={{ color: hex.strong }}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">Cómo elegir un sistema</span>
        <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
      </a>
      <FuentePie fuentes={[fuenteT1()]} />
    </div>
  );
}

/* Los parámetros de la Tabla 1 en dos grupos, como dice su nota: los de efecto directo en el
   modo automático (con asterisco) y el resto, que interviene sobre todo en los bolos o en el
   modo manual (13-10-2026). */
const FILA_PARAMETROS = 10;
/* Insignia de una fila de la Tabla 3 según la Tabla 1 (fila «Parámetros configurables en modo
   automático»): con asterisco, efecto directo en automático; sin él, sobre todo en bolos. */
const CLAVE_FILA_T3 = [/objetivo/i, /basal/i, /ratio/i, /sensibilidad/i, /insulina activa/i];
const esDirecto = (c: number, j: number) =>
  !!CLAVE_FILA_T3[j] && parametrosDe(c).directos.some((x) => CLAVE_FILA_T3[j].test(x));
function insigniaParametro(c: number, j: number): ReactNode {
  const { directos, resto } = parametrosDe(c);
  const re = CLAVE_FILA_T3[j];
  if (!re) return null;
  const h = SISTEMA_HEX[c];
  if (directos.some((x) => re.test(x)))
    return (
      <span
        className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
        style={{ background: h.ink }}
      >
        Efecto directo en el modo automático (*)
      </span>
    );
  if (resto.some((x) => re.test(x)))
    return (
      <span className="inline-block rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
        Sobre todo en los bolos y el modo manual
      </span>
    );
  return null;
}
function parametrosDe(c: number) {
  const xs = TABLAS.T1.filas[FILA_PARAMETROS].celdas[c]
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  return {
    directos: xs.filter((x) => x.endsWith("*")).map((x) => x.replace(/\*$/, "")),
    resto: xs.filter((x) => !x.endsWith("*")),
  };
}
function ParametrosAuto({ c, compacto = false }: { c: number; compacto?: boolean }) {
  const h = SISTEMA_HEX[c];
  const { directos, resto } = parametrosDe(c);
  const grupo = (titulo: string, xs: string[], directo: boolean) =>
    xs.length > 0 && (
      <div>
        <div
          className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
          style={{ color: directo ? h.ink : "#64748b" }}
        >
          {directo ? (
            <Zap size={12} aria-hidden="true" />
          ) : (
            <SlidersHorizontal size={12} aria-hidden="true" />
          )}
          {titulo}
        </div>
        <ul className="flex flex-wrap gap-1">
          {xs.map((x) => (
            <li
              key={x}
              className={`rounded-md border px-1.5 py-0.5 text-xs leading-snug ${directo ? "font-bold" : "text-slate-700"}`}
              style={
                directo
                  ? { borderColor: h.strong, background: h.soft, color: h.ink }
                  : { borderColor: "#e2e8f0", background: "#f8fafc" }
              }
            >
              {x}
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div className={compacto ? "space-y-1.5" : "space-y-2"}>
      {grupo("Efecto directo en el modo automático", directos, true)}
      {grupo("Sobre todo en los bolos y el modo manual", resto, false)}
      {/* M61-04: el papel de la basal programada en cada sistema (Tabla 3, celda entera): en
          Omnipod 5, por ejemplo, cuenta para el primer pod y luego no. */}
      <p className="text-xs leading-snug text-slate-600">
        <span className="block font-semibold text-slate-700">Tasa basal programada</span>
        {TABLAS.T3.filas.find((f) => f.etiqueta === "Tasa basal programada")!.celdas[c]}
      </p>
    </div>
  );
}

/* Lo esencial de cada celda de «Cómo funciona», arriba y en negrita (fragmentos literales de
   CLAVE_ALGORITMO); la celda entera, debajo. */
function claveDeCelda(fila: number, c: number): ReactNode {
  const k = CLAVE_ALGORITMO[c];
  const h = SISTEMA_HEX[c];
  if (fila === 3) {
    const tipo = algoritmoDelCapitulo(c).split(": algoritmo de tipo ")[1];
    return (
      <>
        {tipo && (
          <span
            className="mr-1.5 inline-block rounded-full px-2 text-[11px] font-bold text-white"
            style={{ background: h.ink }}
          >
            {tipo}
          </span>
        )}
        {k.aprendizaje.join(" · ")}
      </>
    );
  }
  if (fila === 4) return [...k.actua, ...k.prediccion.map((x) => `predicción ${x}`)].join(" · ");
  if (fila === 5)
    return (
      <>
        <span
          className="mb-0.5 block w-fit rounded px-1.5 text-[11px] font-extrabold"
          style={
            k.correccion.si
              ? { background: h.ink, color: "#fff" }
              : { background: "#e2e8f0", color: "#334155" }
          }
        >
          {k.correccion.si ? "Sí" : "No"}
        </span>
        <span className="block">{k.correccion.texto.join(" · ")}</span>
      </>
    );
  return null;
}

/* Una celda de «Cómo funciona»: la clave arriba (si la hay) y la celda entera debajo; la de los
   parámetros, en sus dos grupos. */
function CeldaFunciona({ fila, c }: { fila: number; c: number }) {
  if (fila === FILA_PARAMETROS) return <ParametrosAuto c={c} compacto />;
  const clave = claveDeCelda(fila, c);
  const celda = TABLAS.T1.filas[fila].celdas[c];
  const nota = COLUMNA_DE_NOTA[`T1/${fila}`] === c ? NOTAS_POR_PASAJE[`T1/${fila}`] : null;
  return clave ? (
    <>
      <span className="block font-bold leading-snug text-slate-900">{clave}</span>
      {/* 0.72.0: la casilla entera, a un toque (repetía la clave de encima). */}
      <details className="group mt-1 text-[13px] leading-snug text-slate-600">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 sm:min-h-8 text-xs font-semibold text-slate-500 hover:text-slate-800 [&::-webkit-details-marker]:hidden">
          <ChevronDown size={12} aria-hidden="true" className="transition group-open:rotate-180" />
          Texto completo
        </summary>
        <span className="mt-0.5 block">
          <Lineas>{celda}</Lineas>
        </span>
      </details>
      {nota && fila === 3 && <NotaCorreccion nota={nota} />}
    </>
  ) : (
    <span className="font-semibold text-slate-900">
      <Lineas>{celda}</Lineas>
    </span>
  );
}
/* «Cómo funciona» de un sistema (14-10-2026): de un vistazo. Arriba, el recorrido de la
   decisión (mide → decide → administra → hacia qué objetivo) con lo esencial de este sistema en
   negrita (casillas literales de la Tabla 1 y CLAVE_ALGORITMO); debajo, cómo se adapta, los bolos
   de corrección y los parámetros que cuentan en automático; luego, en tarjetas, lo que queda en
   manos de la persona y del profesional, lo que lo distingue y lo que devuelve. Las frases
   generales de los apartados 2 y 3 (las mismas para los cuatro), plegadas al final. Las piezas
   salen de la guía comoFunciona (guias/index.ts), así que siguen comprobadas frase a frase. */
const RECORRIDO: { rotulo: string; icono: LucideIcon; fila: number }[] = [
  { rotulo: "Mide", icono: Radio, fila: 1 },
  { rotulo: "Decide", icono: Cpu, fila: 2 },
  { rotulo: "Administra", icono: Syringe, fila: 4 },
  { rotulo: "Hacia el objetivo", icono: Target, fila: 6 },
];
function ClaveRecorrido({ fila, c }: { fila: number; c: number }) {
  const h = SISTEMA_HEX[c];
  const celda = TABLAS.T1.filas[fila].celdas[c];
  if (fila === 1)
    return (
      <ul className="flex flex-wrap gap-1">
        {celda.split(";").map((x) => (
          <li
            key={x}
            className="rounded-md px-1.5 py-0.5 text-sm font-bold"
            style={{ background: h.soft, color: h.ink }}
          >
            {x.trim()}
          </li>
        ))}
      </ul>
    );
  if (fila === 2) {
    const tipo = algoritmoDelCapitulo(c).split(": algoritmo de tipo ")[1];
    return (
      <>
        <span className="block font-bold leading-snug text-slate-900">{celda}</span>
        {tipo && (
          <span
            className="mt-1 inline-block rounded-full px-2 text-[11px] font-bold text-white"
            style={{ background: h.ink }}
          >
            {tipo}
          </span>
        )}
      </>
    );
  }
  if (fila === 4) return <CeldaFunciona fila={4} c={c} />;
  return (
    <span className="block font-bold leading-snug text-slate-900">
      <Lineas>{celda}</Lineas>
    </span>
  );
}
function TarjetaFunciona({
  titulo,
  icono: Icono,
  color,
  children,
}: {
  titulo: string;
  icono: LucideIcon;
  color: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={titulo}
      className="min-w-0 rounded-xl border bg-white p-3"
      style={{ borderColor: "#e6e6e6" }}
    >
      <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
        <Icono size={15} aria-hidden="true" style={{ color }} />
        {titulo}
      </h3>
      <div className="space-y-2 text-sm text-slate-800">{children}</div>
    </section>
  );
}
function ComoFuncionaSistema({ c, id }: { c: number; id: SistemaId }) {
  const h = SISTEMA_HEX[c];
  const guia = comoFunciona(c, id);
  const distingue = (
    guia.pasos.find((x) => x.rotulo === "Qué lo distingue en la práctica")?.piezas ?? []
  ).filter((p) => p.t === "frase");
  // CamAPS FX: la modalidad Liberty de asa cerrada completa (apartado 3), propia de este sistema.
  const liberty = (
    guia.pasos.find((x) => x.rotulo === "Qué sigue haciendo la persona")?.piezas ?? []
  ).filter((p) => p.t === "frase" && p.apartado === "03-algoritmos" && p.bloque === "b3");
  return (
    <div className="space-y-3">
      {distingue.map((p, j) => (
        <div key={j} className="text-[15px] leading-snug text-slate-800">
          <PiezaVista pieza={p} sis={c} compacta />
        </div>
      ))}
      {/* El recorrido de la decisión: cuatro pasos seguidos; en el móvil, uno debajo de otro. */}
      <ol
        aria-label="Recorrido de la decisión"
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {RECORRIDO.map(({ rotulo, icono: Icono, fila }, k) => (
          <li
            key={fila}
            className="min-w-0 rounded-xl border bg-white p-3"
            style={{ borderColor: "#e6e6e6", borderTop: `4px solid ${h.strong}` }}
          >
            <div
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"
              style={{ color: h.ink }}
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white"
                style={{ background: h.strong }}
              >
                {k + 1}
              </span>
              <Icono size={14} aria-hidden="true" />
              {rotulo}
            </div>
            <div className="mt-1.5 text-sm">
              <ClaveRecorrido fila={fila} c={c} />
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-2 sm:grid-cols-2">
        <TarjetaFunciona titulo="Cómo decide y se adapta" icono={Brain} color={h.ink}>
          <CeldaFunciona fila={3} c={c} />
        </TarjetaFunciona>
        <TarjetaFunciona titulo="Bolos automáticos de corrección" icono={Activity} color={h.ink}>
          <CeldaFunciona fila={5} c={c} />
        </TarjetaFunciona>
      </div>
      {liberty.length > 0 && (
        <TarjetaFunciona
          titulo="Modalidad Liberty (asa cerrada completa)"
          icono={Brain}
          color={h.ink}
        >
          {liberty.map((p, j) => (
            <PiezaVista key={j} pieza={p} sis={c} compacta />
          ))}
        </TarjetaFunciona>
      )}
      <FuentePie fuentes={[fuenteT1(), ...fuentesDePiezas([...distingue, ...liberty])]} />
    </div>
  );
}

/* Tarjeta de un sistema dentro de la comparación, para lo que no cabe en columnas
   («Cómo funciona» y la ampliación técnica se leen sistema a sistema). */
function TarjetaSistema({
  c,
  seccion,
  texto,
  enlace,
}: {
  c: number;
  seccion: string;
  texto: ReactNode;
  enlace: string;
}) {
  // Solo el nombre de la Tabla 1 y lo que dice el capítulo (`texto`): sin el resumen ni los
  // rasgos de la ampliación técnica (edición editorial, A06).
  const id = ORDEN_SISTEMAS[c];
  const nombre = TABLAS.T1.columnas[c];
  const h = SISTEMA_HEX[c];
  return (
    <li
      className="flex gap-3 rounded-xl border bg-white p-3"
      style={{ borderColor: "#e6e6e6", boxShadow: `inset 0 3px 0 0 ${h.strong}` }}
    >
      <img
        src={FOTO_SISTEMA[id]}
        alt=""
        className="h-16 w-16 shrink-0 rounded-lg border object-cover"
        style={{ borderColor: "#e6e6e6" }}
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="text-base font-extrabold" style={{ color: h.ink }}>
          {nombre}
        </div>
        <div className="mt-1 text-sm text-slate-700">{texto}</div>
        <a
          href={href("sistemas", id, seccion)}
          className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
        >
          {enlace} <ArrowRight size={13} aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

function Comparacion({ ids, seccion: pedida }: { ids: string[]; seccion?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const cols = ids.length ? ids.map((id) => columnaDeSistema(id as SistemaId)) : [0, 1, 2, 3];
  // «Cómo funciona» comparado ya no está (0.70.0): esa dirección lleva a la Tabla 1.
  const seccion = pedida === "funciona" ? "esencial" : pedida;
  return (
    <div ref={ref} className="imprimible">
      <CabeceraEditorial
        titulo="Sistemas AID"
        hex={hex}
        level={1}
        accion={
          seccion && (
            <BotonImprimir objetivo={ref} compacto>
              Imprimir
            </BotonImprimir>
          )
        }
      />
      <BarraSistemas ids={ids} seccion={seccion} />
      {!seccion ? (
        <EntradaSistemas />
      ) : (
        <section
          key={seccion}
          className="pantalla-in"
          aria-label={SECCIONES_COMPARACION.find((x) => x.id === seccion)?.t}
        >
          {seccion === "esencial" && (
            <NivelTitulo.Provider value={2}>
              <TablaVista
                tabla={TABLAS.T1}
                columnasFijas={cols}
                herramienta
                iconoFila={(i) => iconoDeFila("T1", i)}
              />
            </NivelTitulo.Provider>
          )}
          {seccion === "parametros" && (
            <>
              <details className="mb-3">
                <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
                  Qué se configura en modo automático
                </summary>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {cols.map((c) => (
                    <div key={c}>
                      <div
                        className="mb-1 text-sm font-extrabold"
                        style={{ color: SISTEMA_HEX[c].ink }}
                      >
                        {TABLAS.T1.columnas[c]}
                      </div>
                      <ParametrosAutomatico c={c} hexSistema={SISTEMA_HEX[c]} fuente={false} />
                    </div>
                  ))}
                </div>
                <FuentePie fuentes={[fuenteT1(4)]} />
              </details>
              <NivelTitulo.Provider value={2}>
                <TablaVista
                  tabla={TABLAS.T3}
                  columnasFijas={cols}
                  herramienta
                  iconoFila={(i) => iconoDeFila("T3", i)}
                />
              </NivelTitulo.Provider>
            </>
          )}
          {seccion === "ampliacion" && CON_AMPLIACION && (
            <>
              <p className="mb-3 text-sm text-slate-600">
                Ficha técnica de cada sistema con sus fuentes, fuera del capítulo; se consulta
                sistema a sistema.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {cols.map((c) => (
                  <TarjetaSistema
                    key={c}
                    c={c}
                    seccion="ampliacion"
                    texto={`Última verificación: ${SISTEMAS_AMPLIACION[c].verified}.`}
                    enlace="Ampliación técnica"
                  />
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}
