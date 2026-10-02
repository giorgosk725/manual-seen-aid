/* Portada: «parece el manual, no una app genérica». Hero con el título del capítulo, el
   autor y la SEEN; debajo, el mapa del capítulo (los cuatro bloques de la infografía como
   entradas), los accesos de consulta en dos toques y la fecha de revisión. */
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Droplets,
  LayoutGrid,
  ListChecks,
  Route,
  Search,
  SpellCheck,
  Table2,
} from "lucide-react";
import { FOTO_SISTEMA, ORDEN_SISTEMAS, SISTEMAS_AMPLIACION } from "../ampliacion";
import { APARTADOS, CAPITULO, INFO, algoritmoDelCapitulo } from "../contenido";
import { CAMBIOS, PENDIENTES, VERSION_APP } from "../contenido/cambios";
import { href } from "../rutas";
import { Revelar } from "../ui";
import { CATEGORIA_HEX, HERO_GRADIENT, SISTEMA_HEX } from "../tokens";
import { Texto } from "../texto";

/* Cada bloque de la infografía lleva al apartado que lo desarrolla. */
const ENTRADAS = [
  { caja: 0, slug: "05-resultados", n: 5 },
  { caja: 1, slug: "02-componentes", n: 2 },
  { caja: 2, slug: "06-indicaciones", n: 6 },
  { caja: 3, slug: "08-iniciacion", n: 8 },
];

const fecha = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function Portada() {
  const ultimoCap = CAMBIOS.find((c) => c.ambito === "capitulo")!;
  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-3xl px-5 py-8 text-white shadow-soft sm:px-8 sm:py-10 lg:px-12 lg:py-14"
        style={{ background: HERO_GRADIENT }}
        aria-labelledby="titulo-capitulo"
      >
        <div
          aria-hidden="true"
          className="aurora pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(56,189,248,0.35), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="aurora pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgba(139,92,246,0.28), transparent)",
            animationDelay: "-6s",
          }}
        />
        <div aria-hidden="true" className="trama pointer-events-none absolute inset-0" />
        <div className="relative max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-200/90">
            <span>{CAPITULO.obra}</span>
            <span aria-hidden="true">·</span>
            <span>{CAPITULO.sociedad.replace(/ \(SEEN\)$/, "")}</span>
          </div>
          <h1
            id="titulo-capitulo"
            className="text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            style={{
              backgroundImage: "linear-gradient(90deg, #ffffff, #7dd3fc)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {CAPITULO.titulo}
          </h1>
          <p className="mt-4 text-base text-white/90 sm:text-lg">
            <span className="font-bold text-white">{CAPITULO.autor}.</span> {CAPITULO.filiacion}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={href("capitulo", APARTADOS[0].slug)}
              className="hover-lift ease-brand inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
            >
              <BookOpen size={16} aria-hidden="true" /> Leer el capítulo
            </a>
            <a
              href={href("capitulo")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Índice <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a
              href={href("consultar")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Consultar en dos toques
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="mapa">
        <div className="mb-3 flex items-end gap-3">
          <span
            aria-hidden="true"
            className="pointer-events-none text-3xl font-black leading-none"
            style={{ color: `${CATEGORIA_HEX.leer.strong}2e` }}
          >
            01
          </span>
          <div className="flex-1">
            <h2
              id="mapa"
              className="text-base font-extrabold tracking-tight"
              style={{ color: CATEGORIA_HEX.leer.ink }}
            >
              El capítulo en cuatro bloques
            </h2>
            <p className="text-xs text-slate-500">
              La infografía del capítulo (p. 24) como mapa de entrada: cada bloque lleva a su
              apartado.
            </p>
            <div
              aria-hidden="true"
              className="mt-1.5 h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${CATEGORIA_HEX.leer.strong}30, transparent)`,
              }}
            />
          </div>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {ENTRADAS.map((e, i) => {
            const caja = INFO.cajas[e.caja];
            const ap = APARTADOS.find((a) => a.slug === e.slug)!;
            return (
              <Revelar as="li" key={e.slug}>
                <a
                  href={href("capitulo", e.slug)}
                  className="hover-lift ease-brand relative block h-full overflow-hidden rounded-2xl border bg-white p-4 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{
                    borderColor: "#e5ebf1",
                    background: "linear-gradient(160deg, #eef3f8, #ffffff 60%)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-3 text-6xl font-black"
                    style={{ color: "#1f4e790f" }}
                  >
                    {i + 1}
                  </span>
                  <div className="text-sm font-extrabold" style={{ color: CATEGORIA_HEX.leer.ink }}>
                    {caja.titulo?.replace(/^\d+\.\s*/, "")}
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {caja.items
                      .slice(0, 6)
                      .filter((it) => !it.startsWith("Gráfico"))
                      .map((it, j) => (
                        <li
                          key={j}
                          className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-700 shadow-sm"
                        >
                          <Texto>{it.replace(/\*\*/g, "").split(":")[0].split(".")[0]}</Texto>
                        </li>
                      ))}
                  </ul>
                  <div
                    className="mt-3 flex items-center gap-1 text-xs font-semibold"
                    style={{ color: CATEGORIA_HEX.leer.strong }}
                  >
                    Apartado {ap.n} · {ap.titulo} <ArrowRight size={13} aria-hidden="true" />
                  </div>
                </a>
              </Revelar>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="sistemas-portada">
        <div className="mb-3 flex items-end gap-3">
          <span
            aria-hidden="true"
            className="pointer-events-none text-3xl font-black leading-none"
            style={{ color: `${CATEGORIA_HEX.consultar.strong}2e` }}
          >
            02
          </span>
          <div className="flex-1">
            <h2
              id="sistemas-portada"
              className="text-base font-extrabold tracking-tight"
              style={{ color: CATEGORIA_HEX.consultar.ink }}
            >
              Los cuatro sistemas
            </h2>
            <p className="text-xs text-slate-500">
              Lo que dice el capítulo de cada uno y, aparte, la ficha ampliada del autor.
            </p>
            <div
              aria-hidden="true"
              className="mt-1.5 h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${CATEGORIA_HEX.consultar.strong}30, transparent)`,
              }}
            />
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {ORDEN_SISTEMAS.map((id, c) => {
            const s = SISTEMAS_AMPLIACION[c];
            const h = SISTEMA_HEX[c];
            return (
              <li key={id}>
                <a
                  href={href("sistemas", id)}
                  className="hover-lift ease-brand flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e5ebf1" }}
                >
                  <span className="block aspect-[4/3] w-full overflow-hidden bg-white">
                    <img
                      src={FOTO_SISTEMA[id]}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="block border-t px-3 py-2" style={{ borderColor: "#e5ebf1" }}>
                    <span className="block text-sm font-extrabold" style={{ color: h.ink }}>
                      {s.name}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500">
                      {algoritmoDelCapitulo(c)}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="consulta">
        <div className="mb-3 flex items-end gap-3">
          <span
            aria-hidden="true"
            className="pointer-events-none text-3xl font-black leading-none"
            style={{ color: `${CATEGORIA_HEX.consultar.strong}2e` }}
          >
            03
          </span>
          <div className="flex-1">
            <h2
              id="consulta"
              className="text-base font-extrabold tracking-tight"
              style={{ color: CATEGORIA_HEX.consultar.ink }}
            >
              En consulta, en dos toques
            </h2>
            <div
              aria-hidden="true"
              className="mt-1.5 h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${CATEGORIA_HEX.consultar.strong}30, transparent)`,
              }}
            />
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {[
            {
              href: href("consultar", "situacion"),
              icono: Route,
              t: "Situación y sistema",
              s: "Qué hacer, Tablas 4 y 6",
            },
            {
              href: href("consultar", "figura-3"),
              icono: Droplets,
              t: "Cetonemia",
              s: "Figura 3 paso a paso",
            },
            {
              href: href("consultar", "descarga", "1"),
              icono: ListChecks,
              t: "Revisar la descarga",
              s: "Tabla 5 en ocho pasos",
            },
            {
              href: href("consultar", "interrupcion"),
              icono: Clock3,
              t: "Interrupción",
              s: "Cuánto dura y qué hacer",
            },
            {
              href: href("consultar", "tablas", "T1"),
              icono: Table2,
              t: "Tablas",
              s: "Las seis, filtrables",
            },
            {
              href: href("consultar", "tablas", "T6"),
              icono: LayoutGrid,
              t: "Exploraciones",
              s: "Tabla 6 por procedimiento",
            },
            {
              href: href("consultar", "glosario"),
              icono: SpellCheck,
              t: "Siglas",
              s: "Glosario del capítulo",
            },
            { href: href("buscar"), icono: Search, t: "Buscar", s: "En el texto literal" },
          ].map((c) => {
            const I = c.icono;
            return (
              <li key={c.t}>
                <a
                  href={c.href}
                  className="hover-lift ease-brand flex h-full items-center gap-2.5 rounded-xl border bg-white p-3 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e5ebf1" }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{
                      background: `linear-gradient(135deg, ${CATEGORIA_HEX.consultar.strong}, ${CATEGORIA_HEX.consultar.strong2})`,
                    }}
                    aria-hidden="true"
                  >
                    <I size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900">{c.t}</span>
                    <span className="block truncate text-xs text-slate-500">{c.s}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="revision" className="grid gap-3 md:grid-cols-2">
        <div
          className="rounded-2xl border bg-white p-4 shadow-soft"
          style={{ borderColor: "#e5ebf1" }}
        >
          <h2
            id="revision"
            className="text-sm font-extrabold"
            style={{ color: CATEGORIA_HEX.confiar.ink }}
          >
            Última revisión
          </h2>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3" style={{ background: CATEGORIA_HEX.confiar.soft }}>
              <dt className="text-xs text-slate-600">Capítulo</dt>
              <dd
                className="text-sm font-extrabold tabular-nums"
                style={{ color: CATEGORIA_HEX.confiar.ink }}
              >
                {fecha(ultimoCap.fecha)}
              </dd>
            </div>
            <div className="rounded-xl p-3" style={{ background: CATEGORIA_HEX.confiar.soft }}>
              <dt className="text-xs text-slate-600">App</dt>
              <dd
                className="text-sm font-extrabold tabular-nums"
                style={{ color: CATEGORIA_HEX.confiar.ink }}
              >
                {VERSION_APP} · {fecha(CAMBIOS[0].fecha)}
              </dd>
            </div>
          </dl>
          <a
            href={href("cambios")}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Qué ha cambiado <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-extrabold text-amber-900">Pendiente (visible a propósito)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {PENDIENTES.slice(0, 3).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
