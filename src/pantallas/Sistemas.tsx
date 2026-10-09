/* Sistemas: hub con las fotos oficiales y una ficha por sistema, la misma para entender y
   para consultar, en secciones con ruta propia (#/sistemas/<id>/<seccion>): Lo esencial
   (Tabla 1), Parámetros (Tablas 1 y 3), Situaciones (Tabla 4), literales y con página, y
   aparte la Ampliación técnica (ficha técnica, sets, insulinas), fuera del capítulo y con sus
   fuentes, con enlace a la ficha del mismo sistema en asistente-aid para el detalle. */
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { ArrowRight, Check, ExternalLink, Minus, X } from "lucide-react";
import {
  APARTADOS,
  TABLAS,
  algoritmoDelCapitulo,
  rutaDeTabla,
  fichasDelCapitulo,
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
  type Discrepancia,
  type Sistema,
} from "../ampliacion";
import { href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Foldable, PaginaBadge, Revelar, ToneCard } from "../ui";
import { AbrirEnVisor } from "../componentes/Visor";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { plano } from "../marcado";
import { BotonFavorito } from "../componentes/Lectura";
import { SITUACIONES } from "../situaciones";
import { FICHA_SISTEMA_EDUCATIVA } from "../enlaces";
import { comoFunciona } from "../guias";
import { PiezaVista } from "../componentes/Piezas";

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
      rotulo: "Efecto directo sobre el algoritmo (*)",
      items: lineas.filter((l) => l.endsWith("*")),
    },
    {
      rotulo: "Sobre todo en los bolos o en el modo manual",
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

export function HubSistemas() {
  return (
    <div>
      <CabeceraEditorial titulo="Sistemas" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Los cuatro sistemas AID comercializados en España: lo que dice el capítulo de cada uno y,
          aparte, su ficha técnica ampliada.
        </p>
      </CabeceraEditorial>
      <ul className="grid gap-3 sm:grid-cols-2">
        {SISTEMAS_AMPLIACION.map((s) => {
          const c = columnaDeSistema(s.id);
          const h = SISTEMA_HEX[c];
          return (
            <Revelar as="li" key={s.id}>
              <a
                href={href("sistemas", s.id)}
                className="hover-lift ease-brand flex h-full gap-3 rounded-2xl border bg-white p-3 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{
                  borderColor: "#e6e6e6",
                  boxShadow: `inset 0 3px 0 0 ${h.strong}, 0 8px 24px rgba(15,23,42,0.05)`,
                }}
              >
                <span
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-white"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <img
                    src={FOTO_SISTEMA[s.id]}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-extrabold" style={{ color: h.ink }}>
                    {s.name}
                  </span>
                  <span className="block text-xs text-slate-500">{algoritmoDelCapitulo(c)}</span>
                  <span className="mt-1.5 block text-sm text-slate-700">
                    <Lineas>{TABLAS.T1.filas[0].celdas[c]}</Lineas>
                  </span>
                  {/* Lo que más se consulta de un sistema, ya en la lista (Tabla 1, p. 4). */}
                  <span
                    className="mt-2 block rounded-lg px-2 py-1.5 text-xs"
                    style={{ background: h.soft }}
                  >
                    <span
                      className="block font-bold uppercase tracking-wide"
                      style={{ color: h.ink }}
                    >
                      Parámetros configurables en modo automático
                    </span>
                    <ParametrosConfigurables c={c} ink={h.ink} />
                  </span>
                  <span
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: h.ink }}
                  >
                    Ver ficha <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </span>
              </a>
            </Revelar>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-600">
        <Texto>{TABLAS.T1.notas[0]}</Texto> <PaginaBadge p={4} />
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Fotos oficiales de producto (Medtronic, Tandem/Novalab, mylife/Ypsomed e Insulet).
      </p>
    </div>
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
function Difiere({ d }: { d: Discrepancia }) {
  return (
    <span className="mt-1.5 block rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-900">
      <span className="font-bold">Difiere del capítulo; aquí se sigue el capítulo.</span> {d.donde},
      p. {d.p}: <q className="italic">{d.capitulo}</q>
      {d.nota && <span className="mt-0.5 block text-red-800">{d.nota}</span>}
    </span>
  );
}

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
          siempre en la ficha técnica vigente.{" "}
          <a
            href={FICHA_SISTEMA_EDUCATIVA[s.id]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            Más detalle en la edición educativa de asistente-aid
          </a>
          .
        </p>
      </div>
      <div className="space-y-3">
        {FICHA_FILAS.map((g) => (
          <Foldable key={g.g} title={g.g} open={g.g === "Indicación y objetivo"}>
            <dl className="divide-y" style={{ borderColor: "#e6e6e6" }}>
              {g.rows.map((r) => {
                let valor: React.ReactNode = null;
                const dif = r.f ? DIFIERE_CAMPO[s.id]?.[r.f] : undefined;
                if (r.f)
                  valor = (
                    <>
                      <Lineas>{s.detail[r.f] || "—"}</Lineas>
                      {dif && <Difiere d={dif} />}
                    </>
                  );
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
          subtitle={`Resumen de la ampliación: ${s.takeaway}${
            DIFIERE_PARAM[s.id]
              ? ` · Difiere del capítulo: ${Object.keys(DIFIERE_PARAM[s.id]!).join(", ")} (Tabla 1, p. 4)`
              : ""
          }`}
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
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {n.etiqueta}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-700">{p.note}</p>
                  {DIFIERE_PARAM[s.id]?.[p.name] && <Difiere d={DIFIERE_PARAM[s.id]![p.name]} />}
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
                      className="inline-flex min-h-7 items-center gap-0.5 font-semibold text-sky-800 hover:underline"
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
}: {
  c: number;
  hexSistema: { soft: string; ink: string; strong: string };
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
        Parámetros configurables en modo automático <PaginaBadge p={4} />
      </div>
      <div className="mt-1 text-sm font-semibold">
        <ParametrosConfigurables c={c} ink={hexSistema.ink} />
      </div>
      <p className="mt-1 text-xs text-slate-600">
        <Texto>{TABLAS.T1.notas[0]}</Texto>
      </p>
    </div>
  );
}

/* Identificador de cada sistema en las rutas de tablas, situaciones e inicio (orden de la
   Tabla 1). */
const SLUG_TABLA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
const SLUG_CORTO = ["MiniMed 780G", "Control-IQ", "CamAPS", "Omnipod 5"];

/* Secciones de la ficha, cada una con su ruta (#/sistemas/<id>/<seccion>). */
const SECCIONES_FICHA = [
  { id: "esencial", t: "Lo esencial" },
  { id: "funciona", t: "Cómo funciona" },
  { id: "parametros", t: "Parámetros" },
  { id: "situaciones", t: "Situaciones" },
  { id: "ampliacion", t: "Ampliación técnica" },
] as const;

/* La tabla en su sitio del capítulo (para comprobar la fuente y volver). */
function rutaEnCapitulo(t: Tabla): string | null {
  return rutaDeTabla(t.id) ?? null;
}

/* La columna de un sistema en una tabla del capítulo: filas literales, notas y página. */
function ColumnaTabla({
  t,
  c,
  filas,
  pie,
}: {
  t: Tabla;
  c: number;
  filas?: (etiqueta: string, j: number) => boolean;
  pie?: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-3 sm:p-4" style={{ borderColor: "#e6e6e6" }}>
      <div className="text-xs font-semibold text-slate-600">
        Tabla {t.numero} · {t.titulo}
      </div>
      <dl className="mt-1 divide-y" style={{ borderColor: "#e6e6e6" }}>
        {t.filas.map((f, j) =>
          filas && !filas(f.etiqueta, j) ? null : (
            <div key={j} className="grid gap-1 py-2.5 sm:grid-cols-[13rem_1fr] sm:gap-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                <Lineas>{f.etiqueta}</Lineas>
              </dt>
              <dd className="text-sm text-slate-800">
                <Lineas>{f.unida ? f.celdas[0] : f.celdas[c]}</Lineas>
              </dd>
            </div>
          ),
        )}
      </dl>
      {t.notas.length > 0 && (
        <div
          className="mt-2 space-y-1 border-t pt-2 text-xs text-slate-600"
          style={{ borderColor: "#e6e6e6" }}
        >
          {t.notas.map((n, k) => (
            <p key={k}>
              <Texto>{n}</Texto>
            </p>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="flex flex-wrap gap-x-4">
          {rutaEnCapitulo(t) && <EnlacePie ruta={rutaEnCapitulo(t)!}>Ver en el capítulo</EnlacePie>}
          {pie}
        </span>
        <PaginaBadge p={t.paginas[0]} p2={t.paginas[1]} />
      </div>
    </div>
  );
}

function EnlacePie({ ruta, children }: { ruta: string; children: ReactNode }) {
  return (
    <a
      href={ruta}
      className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
    >
      {children} <ArrowRight size={13} aria-hidden="true" />
    </a>
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
    <h2 id={id} className="mb-2 scroll-mt-20 text-base font-extrabold text-slate-900">
      {children} <span style={{ color }}>· {sistema}</span>
    </h2>
  );
}

export function FichaSistema({ id, seccion }: { id?: string; seccion?: string }) {
  const s = sistemaPorId(id);
  const ref = useRef<HTMLDivElement>(null);
  const parrafos = useMemo(() => (s ? parrafosDelSistema(s.id) : []), [s]);
  // Enlace a una sección (#/sistemas/<id>/parametros): se abre en ella, sin recorrer la ficha.
  useEffect(() => {
    if (!seccion) return;
    const el = document.getElementById(seccion);
    el?.scrollIntoView?.({ block: "start" });
  }, [seccion, id]);
  if (!s) return <HubSistemas />;
  const c = columnaDeSistema(s.id);
  const h = SISTEMA_HEX[c];
  const slug = SLUG_TABLA[c];
  const i = ORDEN_SISTEMAS.indexOf(s.id);
  const prev = SISTEMAS_AMPLIACION[i - 1];
  const next = SISTEMAS_AMPLIACION[i + 1];
  const situacionesT4 = SITUACIONES.filter((x) => x.tabla === "T4");
  // Con una sección en la ruta se enseña solo esa (la ficha entera son más de diez pantallas
  // en el móvil); sin sección, la ficha completa.
  const ver = (id: string) => !seccion || seccion === id;
  return (
    <div ref={ref} className="imprimible">
      <div className="no-imprimir mb-2 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("sistemas")}
          className="inline-flex min-h-11 items-center font-semibold hover:underline"
        >
          Sistemas
        </a>
        <span aria-hidden="true">›</span>
        <span>{s.name}</span>
      </div>
      <header className="mb-4 flex gap-3 sm:gap-4">
        <AbrirEnVisor
          imagen={{ src: FOTO_SISTEMA[s.id], alt: `Foto oficial de ${s.name}`, titulo: s.name }}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:h-32 sm:w-32"
          etiqueta={`Ampliar la foto de ${s.name}`}
        >
          <img
            src={FOTO_SISTEMA[s.id]}
            alt={`Foto oficial de ${s.name}`}
            className="h-full w-full object-cover"
          />
        </AbrirEnVisor>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl" style={{ color: h.ink }}>
            {s.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {algoritmoDelCapitulo(c)} <span className="pagina-badge">· Tabla 1, p. 3</span>
          </p>
          <div className="no-imprimir mt-2 flex flex-wrap gap-x-3 gap-y-1">
            <a
              href={href("consultar", "comparar", slug)}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold hover:underline sm:min-h-8"
              style={{ color: h.ink }}
            >
              Comparar con otros sistemas <ArrowRight size={13} aria-hidden="true" />
            </a>
            <a
              href={href("consultar", "inicio", `inicio:${slug}`)}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold hover:underline sm:min-h-8"
              style={{ color: h.ink }}
            >
              Iniciar este sistema paso a paso <ArrowRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <nav
        aria-label="En esta ficha"
        className="no-imprimir -mx-3 mb-5 flex gap-1.5 overflow-x-auto border-y px-3 py-2 sm:mx-0 sm:flex-wrap sm:rounded-lg sm:border sm:px-2"
        style={{ borderColor: "#e6e6e6" }}
      >
        {SECCIONES_FICHA.map((x) => (
          <a
            key={x.id}
            href={href("sistemas", s.id, x.id)}
            aria-current={seccion === x.id ? "location" : undefined}
            className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${seccion === x.id ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
            style={
              seccion === x.id
                ? { background: h.strong, borderColor: h.strong }
                : { borderColor: "#d4d4d4" }
            }
          >
            {x.t}
          </a>
        ))}
        {seccion && (
          <a
            href={href("sistemas", s.id)}
            className="inline-flex min-h-9 shrink-0 items-center rounded-full border border-dashed px-3 text-sm font-semibold text-slate-600 hover:border-slate-500"
            style={{ borderColor: "#d4d4d4" }}
          >
            Ficha completa
          </a>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          <BotonImprimir objetivo={ref} compacto>
            Imprimir la ficha
          </BotonImprimir>
          <BotonFavorito ruta={href("sistemas", s.id)} titulo={s.name} />
        </span>
      </nav>

      {seccion && (
        <nav
          aria-label="Otro sistema, misma sección"
          className="no-imprimir mb-4 flex flex-wrap gap-1.5"
        >
          {SISTEMAS_AMPLIACION.map((x, c) => (
            <a
              key={x.id}
              href={href("sistemas", x.id, seccion)}
              aria-current={x.id === s.id ? "page" : undefined}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-bold transition ${x.id === s.id ? "text-white" : "bg-white hover:border-slate-500"}`}
              style={
                x.id === s.id
                  ? { background: SISTEMA_HEX[c].ink, borderColor: SISTEMA_HEX[c].ink }
                  : { borderColor: `${SISTEMA_HEX[c].strong}80`, color: SISTEMA_HEX[c].ink }
              }
            >
              {SLUG_CORTO[c]}
            </a>
          ))}
        </nav>
      )}
      <section aria-labelledby="esencial" className="scroll-mt-20" hidden={!ver("esencial")}>
        <TituloSeccion id="esencial" sistema={s.name} color={h.ink}>
          Lo esencial
        </TituloSeccion>
        <dl className="mb-3 grid grid-cols-3 gap-2">
          {fichasDelCapitulo(c).map(({ k, v }) => (
            <div key={k} className="rounded-xl p-2.5" style={{ background: h.soft }}>
              <dt className="text-[11px] text-slate-600">{k}</dt>
              <dd className="text-sm font-bold leading-snug" style={{ color: h.ink }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
        {/* Qué es y para quién; el algoritmo va en «Cómo funciona» y lo configurable, en «Parámetros». */}
        <ColumnaTabla
          t={TABLAS.T1}
          c={c}
          filas={(e) =>
            ["Formato", "Indicación", "Gestación: autorización y evidencia"].includes(e)
          }
          pie={
            <>
              <EnlacePie ruta={href("consultar", "comparar", slug)}>Comparar sistemas</EnlacePie>
              <a
                href={WEB_SISTEMA[s.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="no-imprimir inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
              >
                Web oficial <ExternalLink size={12} aria-hidden="true" />
              </a>
            </>
          }
        />
      </section>

      <section aria-labelledby="funciona" className="mt-7 scroll-mt-20" hidden={!ver("funciona")}>
        <TituloSeccion id="funciona" sistema={s.name} color={h.ink}>
          Cómo funciona
        </TituloSeccion>
        <p className="mb-3 text-sm text-slate-600">
          Lo que dice el capítulo de este sistema, en el orden en que se entiende: qué mide, dónde
          decide, cómo administra la insulina, hacia qué objetivo y qué queda en manos de la persona
          y del profesional. Los rótulos de los pasos son de la app; el texto, literal y con su
          página.
        </p>
        <ol className="space-y-4">
          {comoFunciona(c, s.id).pasos.map((paso, i) => (
            <li key={paso.rotulo} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-medium text-white"
                style={{ background: h.strong }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900">{paso.rotulo}</h3>
                <div className="mt-1.5 space-y-2">
                  {paso.piezas.map((p, j) => (
                    <PiezaVista key={j} pieza={p} sis={c} />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="parametros"
        className="mt-7 scroll-mt-20"
        hidden={!ver("parametros")}
      >
        <TituloSeccion id="parametros" sistema={s.name} color={h.ink}>
          Parámetros
        </TituloSeccion>
        <p className="mb-2 text-sm text-slate-600">
          Cuáles se pueden configurar en modo automático (Tabla 1) y cómo se ajusta cada uno en este
          sistema (Tabla 3).
        </p>
        <ParametrosAutomatico c={c} hexSistema={h} />
        <div className="mt-3">
          <ColumnaTabla
            t={TABLAS.T3}
            c={c}
            pie={
              <EnlacePie ruta={href("consultar", "tablas", `T3:${slug}`)}>
                Comparar estos parámetros entre sistemas
              </EnlacePie>
            }
          />
        </div>
      </section>

      <section
        aria-labelledby="situaciones"
        className="mt-7 scroll-mt-20"
        hidden={!ver("situaciones")}
      >
        <TituloSeccion id="situaciones" sistema={s.name} color={h.ink}>
          Situaciones
        </TituloSeccion>
        <p className="mb-2 text-sm text-slate-600">
          Qué herramienta del sistema usar en cada situación frecuente (Tabla 4). Cada una se abre
          con este sistema ya elegido.
        </p>
        <ul className="space-y-2">
          {situacionesT4.map((x) => {
            const f = TABLAS.T4.filas[x.fila];
            return (
              <li
                key={x.id}
                className="rounded-xl border bg-white p-3"
                style={{ borderColor: "#e6e6e6" }}
              >
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Lineas>{f.etiqueta}</Lineas>
                </div>
                <div className="mt-1 text-sm text-slate-800">
                  <Lineas>{f.unida ? f.celdas[0] : f.celdas[c]}</Lineas>
                </div>
                <a
                  href={href("consultar", "situacion", `${x.id}:${slug}`)}
                  className="no-imprimir mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
                >
                  Abrir con el texto que la explica <ArrowRight size={13} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="flex flex-wrap gap-x-4">
            {rutaEnCapitulo(TABLAS.T4) && (
              <EnlacePie ruta={rutaEnCapitulo(TABLAS.T4)!}>Ver en el capítulo</EnlacePie>
            )}
            <EnlacePie ruta={href("consultar", "tablas", `T4:${slug}`)}>
              Comparar en la Tabla 4
            </EnlacePie>
            <EnlacePie ruta={href("consultar", "situacion", `rm:${slug}`)}>
              Exploraciones y cirugía (Tabla 6)
            </EnlacePie>
          </span>
          <PaginaBadge p={TABLAS.T4.paginas[0]} p2={TABLAS.T4.paginas[1]} />
        </div>
        {TABLAS.T4.notas.length > 0 && (
          <div className="mt-1 space-y-1 text-xs text-slate-600">
            {TABLAS.T4.notas.map((n, k) => (
              <p key={k}>
                <Texto>{n}</Texto>
              </p>
            ))}
          </div>
        )}
      </section>

      <section
        aria-label="Más del capítulo sobre este sistema"
        className="mt-7 space-y-3"
        hidden={!!seccion}
      >
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
                  className="mt-1 inline-flex min-h-6 items-center gap-1 text-xs font-semibold text-slate-600 hover:underline"
                >
                  {p.titulo} · <PaginaBadge p={p.b.p} p2={p.b.p2} />{" "}
                  <ArrowRight size={11} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </Foldable>
      </section>

      {ver("ampliacion") && <Ampliacion s={s} />}

      <ToneCard tone="slate" className="mt-6">
        <p className="text-xs text-slate-600">
          «Lo esencial», «Parámetros» y «Situaciones» son texto literal del Manual SEEN con su
          página. La «Ampliación técnica» es material complementario, fuera del capítulo, con sus
          fuentes; no sustituye la ficha técnica vigente de cada sistema.
        </p>
      </ToneCard>

      <nav aria-label="Otro sistema" className="no-imprimir mt-6 grid gap-2 sm:grid-cols-2">
        {prev ? (
          <a
            href={href("sistemas", prev.id)}
            className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border bg-white p-3 shadow-soft"
            style={{ borderColor: "#e6e6e6" }}
          >
            <img src={FOTO_SISTEMA[prev.id]} alt="" className="h-10 w-10 rounded-lg object-cover" />
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">Anterior</span>
              <span className="block truncate text-sm font-semibold text-slate-900">
                {prev.name}
              </span>
            </span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a
            href={href("sistemas", next.id)}
            className="flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-xl border bg-white p-3 text-right shadow-soft"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">Siguiente</span>
              <span className="block truncate text-sm font-semibold text-slate-900">
                {next.name}
              </span>
            </span>
            <img src={FOTO_SISTEMA[next.id]} alt="" className="h-10 w-10 rounded-lg object-cover" />
          </a>
        )}
      </nav>
    </div>
  );
}
