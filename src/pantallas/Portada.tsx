/* Portada con la identidad del Manual SEEN: cabecera blanca con el título en mayúsculas
   finas, la franja de colores y el autor; «¿Qué necesitas?» con fichas de color; el índice
   del capítulo en mosaico (como las áreas de manual.seen.es); los cuatro bloques de la
   infografía, los diagramas, los sistemas y la fecha de revisión. */
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  CircleCheck,
  Clock3,
  Droplets,
  Footprints,
  GraduationCap,
  HeartHandshake,
  Layers,
  LayoutGrid,
  ListChecks,
  ListOrdered,
  Route,
  Search,
  SlidersHorizontal,
  Stethoscope,
  Star,
  Table2,
  Target,
} from "lucide-react";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { APARTADOS, CAPITULO, DIAGRAMAS, INFO, TABLAS, algoritmoDelCapitulo } from "../contenido";
import { ICONO_APARTADO, ICONO_DIAGRAMA } from "../nav";
import { CAMBIOS, VERSION_APP } from "../contenido/cambios";
import { href, navegar } from "../rutas";
import { marcar, paginaDe } from "../busqueda";
import { precargarBuscador, useBuscador } from "../useBuscador";
import { useParecidos } from "../semantica";
import { AvisosBusqueda } from "../componentes/AvisosBusqueda";
import { RespuestasCapitulo } from "../componentes/RespuestasCapitulo";
import { Bienvenida } from "../componentes/Bienvenida";
import { SinResultados } from "../componentes/SinResultados";
import { useFavoritos, useLeidos, useUltimo } from "../prefs";
import { CabeceraEditorial, Revelar } from "../ui";
import { CATEGORIA_HEX, COLOR_APARTADO, FICHA_AREA, SEEN, SISTEMA_HEX } from "../tokens";
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

/* «¿Qué necesitas?»: buscador y las consultas más probables, cada una a dos toques de la
   respuesta (atajo + elegir sistema, tramo o población). Debajo, seguir leyendo y favoritos
   (solo rutas de la app, guardadas en este navegador). */
const ATAJOS = [
  {
    href: href("consultar", "situacion", "ejercicio-aerobico"),
    icono: Footprints,
    color: FICHA_AREA.diabetes,
    t: "Ejercicio y sistema",
    s: "Qué hace cada sistema (Tabla 4)",
  },
  {
    href: href("consultar", "figura-3"),
    icono: Droplets,
    color: FICHA_AREA.azul,
    t: "Cetonemia (β-OHB)",
    s: "Qué hacer según el tramo",
  },
  {
    href: href("visual", "objetivos-mcg"),
    icono: Target,
    color: FICHA_AREA.lipidos,
    t: "Objetivos de MCG",
    s: "Adultos, gestación, hospital, fragilidad",
  },
  {
    href: href("consultar", "tablas", "T1"),
    icono: Table2,
    color: FICHA_AREA.pizarra,
    t: "Comparar sistemas",
    s: "Tabla 1, filtrable",
  },
  {
    href: href("consultar", "situacion"),
    icono: Route,
    color: FICHA_AREA.obesidad,
    t: "Otra situación",
    s: "Enfermedad, noche, comidas, exploraciones",
  },
  {
    href: href("consultar", "descarga", "1"),
    icono: ListChecks,
    color: FICHA_AREA.mineral,
    t: "Revisar la descarga",
    s: "Tabla 5 en ocho pasos",
  },
  {
    href: href("consultar", "interrupcion"),
    icono: Clock3,
    color: FICHA_AREA.lavanda,
    t: "Interrupción del sistema",
    s: "Cuánto dura y qué hacer",
  },
  {
    href: href("consultar", "inicio", "inicio"),
    icono: ListOrdered,
    color: FICHA_AREA.nutricion,
    t: "Iniciar un sistema",
    s: "Desde MDI: Tabla 2 y parámetros iniciales",
  },
  {
    href: href("sistemas"),
    icono: SlidersHorizontal,
    color: FICHA_AREA.pizarra,
    t: "Parámetros por sistema",
    s: "Configurables en automático (Tabla 1)",
  },
  {
    href: href("consultar", "situacion", "rm"),
    icono: Stethoscope,
    color: FICHA_AREA.rosa,
    t: "Exploraciones y cirugía",
    s: "RM, TC, PET, quirófano (Tabla 6)",
  },
];

function QueNecesitas() {
  const [q, setQ] = useState("");
  const { motor, estado, reintentar } = useBuscador(q.length > 0);
  const parecidos = useParecidos(q, q.length > 0);
  const busqueda = motor && q.trim().length >= 2 ? motor.buscarConTotales(q, 5, 2) : null;
  const res = busqueda?.resultados ?? [];
  const respuestas = motor && q.trim().length >= 2 ? motor.fusionar(q, parecidos) : [];
  const frecuente = motor && q.trim().length >= 2 ? motor.preguntaFrecuente(q) : null;
  const favoritos = useFavoritos();
  return (
    <section aria-labelledby="que-necesitas" className="scroll-mt-16 space-y-3">
      <h2
        id="que-necesitas"
        className="font-display text-xl font-medium uppercase tracking-[0.04em]"
        style={{ color: CATEGORIA_HEX.consultar.ink }}
      >
        ¿Qué necesitas?
      </h2>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) navegar("buscar", q.trim());
        }}
      >
        <label htmlFor="portada-q" className="sr-only">
          ¿Qué necesitas? Escribe lo que buscas
        </label>
        <div className="flex items-center gap-2 rounded-md border-2 border-slate-300 bg-white px-3 py-2.5 transition focus-within:border-slate-500">
          <Search size={17} className="shrink-0 text-slate-500" aria-hidden="true" />
          <input
            id="portada-q"
            onFocus={(e) => {
              void precargarBuscador();
              // En el móvil, el teclado tapa media pantalla: el campo sube arriba para que la
              // respuesta quede a la vista.
              const seccion = e.currentTarget.closest("section");
              if (window.innerWidth < 768 && seccion)
                window.setTimeout(() => seccion.scrollIntoView({ block: "start" }), 250);
            }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca: cetonas 1,2, modo sueño…"
            autoComplete="off"
            className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </form>
      <AvisosBusqueda q={q} parcial={busqueda?.parcial} primera={respuestas[0]}>
        <RespuestasCapitulo
          respuestas={respuestas}
          q={q}
          compacta
          nivel={3}
          frecuente={frecuente}
        />
      </AvisosBusqueda>
      {estado === "error" && q.trim().length >= 2 && (
        <p
          role="status"
          className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          No se pudo cargar el índice de búsqueda.
          <button
            type="button"
            onClick={reintentar}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold hover:border-slate-500"
          >
            Reintentar
          </button>
        </p>
      )}
      {motor && q.trim().length >= 2 && res.length === 0 && !respuestas.length && !frecuente && (
        <SinResultados />
      )}
      {res.length > 0 && (
        <ul
          className="divide-y rounded-xl border bg-white shadow-soft"
          style={{ borderColor: "#e6e6e6" }}
          aria-label="Resultados"
        >
          {res.map((r) => (
            <li key={r.entrada.id}>
              <a
                href={r.entrada.ruta}
                className="block px-3 py-2 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <span className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="truncate font-semibold">{r.entrada.titulo}</span>
                  {r.entrada.pagina === 0 && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-1.5 text-[11px] font-semibold text-amber-900">
                      Fuera del capítulo
                    </span>
                  )}
                  {r.entrada.pagina > 0 && (
                    <span className="pagina-badge">{paginaDe(r.entrada)}</span>
                  )}
                </span>
                <span className="mt-0.5 block text-slate-800">
                  {marcar(r.fragmento, q).map((t, i) =>
                    t.hit ? (
                      <mark key={i} className="resaltado">
                        {t.t}
                      </mark>
                    ) : (
                      <span key={i}>{t.t}</span>
                    ),
                  )}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={href("buscar", q)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:underline"
            >
              Ver todos los resultados
            </a>
          </li>
        </ul>
      )}
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-5" aria-label="Consultas frecuentes">
        {ATAJOS.map((c) => {
          const I = c.icono;
          return (
            <li key={c.t}>
              <a
                href={c.href}
                className="hover-lift ease-brand flex h-full min-h-[3.5rem] items-center gap-3 rounded-md border bg-white p-2 pr-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 lg:flex-col lg:items-start lg:gap-2 xl:flex-row xl:items-center xl:gap-3"
                style={{ borderColor: "#e6e6e6" }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] text-white sm:h-11 sm:w-11 lg:h-9 lg:w-9 xl:h-11 xl:w-11"
                  style={{ background: c.color }}
                  aria-hidden="true"
                >
                  <I size={19} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  <span className="block text-[13px] font-bold leading-snug text-slate-900 sm:text-sm">
                    {/* Lo que va entre paréntesis («(β-OHB)») no se parte. */}
                    {c.t.split(/(\([^)]*\))/).map((trozo, i) =>
                      i % 2 ? (
                        <span key={i} className="whitespace-nowrap">
                          {trozo}
                        </span>
                      ) : (
                        trozo
                      ),
                    )}
                  </span>
                  <span className="block text-xs leading-snug text-slate-500">{c.s}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {favoritos.length > 0 && (
        <div className="grid gap-2 md:grid-cols-2">
          {favoritos.length > 0 && (
            <div
              className="rounded-xl border bg-white p-3 shadow-soft"
              style={{ borderColor: "#e6e6e6" }}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Star size={13} className="fill-amber-400 text-amber-500" aria-hidden="true" /> Tus
                favoritos
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {favoritos.map((f) => (
                  <li key={f.ruta}>
                    <a
                      href={f.ruta}
                      className="inline-block rounded-full border px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400"
                      style={{ borderColor: "#d4d4d4" }}
                    >
                      {f.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <a
        href={href("pacientes")}
        className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
        style={{ borderColor: "#e6e6e6" }}
      >
        <HeartHandshake
          size={16}
          className="shrink-0"
          style={{ color: CATEGORIA_HEX.pacientes.strong }}
          aria-hidden="true"
        />
        <span className="flex-1">
          Para el paciente: información, resumen y plan de seguridad para imprimir o compartir
        </span>
        <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
      </a>
    </section>
  );
}

/* Colores del mosaico (los de los apartados 1-12). */
const MOSAICO = COLOR_APARTADO.slice(0, 12);

/* Franja de cuatro colores (azul, burdeos, mostaza y rosa del Manual). */
function Franja({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-1.5 ${className}`}>
      {[SEEN.azul, SEEN.burdeos, SEEN.mostaza, SEEN.diabetes].map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}

/* «Seguir leyendo» compacto en la cabecera: a la vista sin desplazar, en el móvil y en el
   escritorio (antes, en escritorio, quedaba bajo el pliegue). */
function SeguirLeyendo() {
  const ultimo = useUltimo();
  if (!ultimo) return null;
  return (
    <a
      href={ultimo.ruta}
      className="mt-3 flex min-h-11 items-center gap-2 rounded-[3px] border-l-4 bg-slate-50 px-3 py-2 text-sm sm:max-w-md"
      style={{ borderLeftColor: SEEN.azulOsc }}
    >
      <BookOpen size={15} className="shrink-0 text-slate-600" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Seguir leyendo
        </span>
        <span className="block truncate font-semibold text-slate-900">{ultimo.titulo}</span>
      </span>
      <ArrowRight size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
    </a>
  );
}

/* Índice del capítulo en mosaico: doce apartados en fichas de color y la infografía, que
   resume el capítulo en una página, a todo el ancho. */
function IndiceMosaico() {
  const leidos = useLeidos();
  const doce = APARTADOS.filter((a) => a.n <= 12);
  const info = APARTADOS.find((a) => a.n === 13)!;
  return (
    <section aria-labelledby="indice-mosaico">
      <CabeceraEditorial numero="3" titulo="El capítulo" hex={CATEGORIA_HEX.leer}>
        <p className="text-xs text-slate-500">
          Trece apartados del texto final, cada uno con su página.{" "}
          {leidos.length > 0 && (
            <span>
              Has leído {leidos.length} de {APARTADOS.length}.
            </span>
          )}
        </p>
      </CabeceraEditorial>
      <h2 id="indice-mosaico" className="sr-only">
        Índice del capítulo
      </h2>
      <ol className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 lg:grid-cols-6">
        {doce.map((a, i) => {
          const I = ICONO_APARTADO[a.slug] ?? BookOpen;
          const leido = leidos.includes(a.slug);
          return (
            <li key={a.slug}>
              <a
                href={href("capitulo", a.slug)}
                className="ficha-area group block rounded-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
              >
                <span
                  className="relative flex aspect-[3/2] w-full items-center justify-center rounded-[3px] text-white transition group-hover:brightness-95 lg:aspect-square"
                  style={{ background: MOSAICO[i] }}
                  aria-hidden="true"
                >
                  <I size={34} strokeWidth={1.5} className="transition group-hover:scale-110" />
                  {leido && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-white p-0.5 text-emerald-700">
                      <CircleCheck size={13} />
                    </span>
                  )}
                </span>
                <span className="mt-1.5 flex gap-1 text-[11px] font-semibold uppercase leading-tight text-slate-800 sm:text-xs sm:tracking-wide">
                  <span className="tabular-nums text-slate-500">{a.n}</span>
                  <span className="min-w-0 hyphens-auto [overflow-wrap:anywhere]">
                    {a.corto}
                    {leido && <span className="sr-only"> (leído)</span>}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <a
        href={href("capitulo", info.slug)}
        className="ficha-area group mt-3 flex items-center gap-3 overflow-hidden rounded-[3px] border bg-white pr-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
        style={{ borderColor: "#e6e6e6" }}
      >
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center text-white"
          style={{ background: SEEN.burdeos }}
          aria-hidden="true"
        >
          <LayoutGrid size={26} strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1 py-2">
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-800">
            <span className="tabular-nums text-slate-500">{info.n}</span> {info.corto}
          </span>
          <span className="block text-xs text-slate-500">
            El capítulo en una página (p. {INFO.pagina})
          </span>
        </span>
        <ArrowRight size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
      </a>
    </section>
  );
}

/* Aprender: las tarjetas de repaso y el test, a la vista desde la portada. */
function RepasarYAutoevaluarse() {
  const piezas = [
    {
      ruta: href("repaso"),
      icono: Layers,
      t: "Tarjetas de repaso",
      s: "Cifras y siglas del capítulo, con repaso espaciado",
    },
    {
      ruta: href("test"),
      icono: GraduationCap,
      t: "Autoevaluación",
      s: "Test con la respuesta razonada y su página",
    },
  ];
  return (
    <section aria-labelledby="aprender">
      <h2
        id="aprender"
        className="mb-2 text-xs font-bold uppercase tracking-wide"
        style={{ color: CATEGORIA_HEX.aprender.ink }}
      >
        Repasar y autoevaluarse
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {piezas.map((p) => {
          const I = p.icono;
          return (
            <li key={p.t}>
              <a
                href={p.ruta}
                className="hover-lift ease-brand flex h-full items-center gap-3 rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e6e6e6" }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] text-white"
                  style={{ background: CATEGORIA_HEX.aprender.strong }}
                  aria-hidden="true"
                >
                  <I size={19} strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">{p.t}</span>
                  <span className="block text-xs text-slate-600">{p.s}</span>
                </span>
                <ArrowRight
                  size={15}
                  className="ml-auto shrink-0 text-slate-500"
                  aria-hidden="true"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Portada() {
  const ultimoCap = CAMBIOS.find((c) => c.ambito === "capitulo")!;
  const nTablas = APARTADOS.flatMap((a) => a.bloques).filter((b) => b.t === "tabla").length;
  return (
    <div className="space-y-9">
      <section
        className="cabecera-manual relative overflow-hidden rounded-[4px] border bg-white"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="titulo-capitulo"
      >
        <Franja />
        <div className="grid items-center gap-8 px-4 py-4 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-10 lg:py-11">
          <div className="min-w-0">
            <div
              className="etiqueta-area flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs"
              style={{ color: SEEN.diabetesOsc }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5"
                style={{ background: SEEN.diabetes }}
              />
              <span>Manual SEEN</span>
              <span aria-hidden="true">·</span>
              <span>{CAPITULO.area}</span>
              <span aria-hidden="true">·</span>
              <span>Capítulo {CAPITULO.numero}</span>
            </div>
            <h1
              id="titulo-capitulo"
              className="titulo-manual mt-2 text-balance text-[1.22rem] leading-[1.18] sm:mt-3 sm:text-[2.1rem] sm:leading-[1.15] lg:text-[2.6rem]"
            >
              {CAPITULO.titulo}
            </h1>
            <p className="mt-2 text-sm text-slate-700 sm:mt-4 sm:text-base">
              <span className="font-bold text-slate-900">{CAPITULO.autor}</span>
              <span className="hidden sm:inline">. {CAPITULO.filiacion}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {CAPITULO.sociedad.replace(/ \(SEEN\)$/, "")}
            </p>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-700">
              Las tablas, los algoritmos y las situaciones clínicas del capítulo, preparados para
              consultarlos en el día a día, con el texto completo y la página de cada dato.{" "}
              <a
                href={href("sobre")}
                className="whitespace-nowrap font-semibold text-slate-800 underline underline-offset-2"
              >
                Más información →
              </a>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-5">
              <a
                href={href("consultar")}
                className="boton-seen inline-flex items-center gap-2 rounded-[3px] px-3.5 py-2 text-sm sm:px-4 sm:py-2.5 font-semibold uppercase tracking-wide text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
                style={{ background: SEEN.burdeos }}
              >
                <Table2 size={16} aria-hidden="true" /> Consultar
              </a>
              <a
                href={href("capitulo", APARTADOS[0].slug)}
                className="inline-flex items-center gap-2 rounded-[3px] border-2 border-slate-300 px-3.5 py-1.5 text-sm sm:px-4 sm:py-2 font-semibold uppercase tracking-wide text-slate-800 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
              >
                <BookOpen size={15} aria-hidden="true" /> Leer el capítulo
              </a>
              <a
                href={href("capitulo")}
                className="inline-flex min-h-11 items-center gap-1 px-1 text-sm font-semibold text-slate-700 underline-offset-2 hover:underline"
              >
                Índice <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a
                href={CAPITULO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 px-1 text-sm font-semibold text-slate-700 underline-offset-2 hover:underline"
              >
                En el Manual SEEN <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
            <SeguirLeyendo />
            <ul className="mt-5 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 sm:flex">
              <li>
                <span className="font-semibold tabular-nums text-slate-900">
                  {CAPITULO.paginas}
                </span>{" "}
                páginas
              </li>
              <li>
                <span className="font-semibold tabular-nums text-slate-900">{nTablas}</span> tablas
              </li>
              <li>
                <span className="font-semibold tabular-nums text-slate-900">3</span> figuras
              </li>
              <li>
                Publicado el{" "}
                <span className="font-semibold text-slate-900">{fecha(ultimoCap.fecha)}</span>
              </li>
            </ul>
          </div>
          <MosaicoDecorativo />
        </div>
      </section>

      <QueNecesitas />

      <Bienvenida />

      <section aria-labelledby="sistemas-portada">
        <CabeceraEditorial numero="1" titulo="Los cuatro sistemas" hex={CATEGORIA_HEX.consultar}>
          <p className="text-xs text-slate-500">
            Lo que dice el capítulo de cada uno y, aparte, su ficha técnica ampliada.
          </p>
        </CabeceraEditorial>
        <h2 id="sistemas-portada" className="sr-only">
          Los cuatro sistemas
        </h2>
        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {ORDEN_SISTEMAS.map((id, c) => {
            const nombre = TABLAS.T1.columnas[c];
            const h = SISTEMA_HEX[c];
            return (
              <li key={id}>
                <a
                  href={href("sistemas", id)}
                  className="hover-lift ease-brand flex h-full flex-col overflow-hidden rounded-[4px] border bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <span className="block aspect-[4/3] w-full overflow-hidden bg-white">
                    <img
                      src={FOTO_SISTEMA[id]}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-1 w-full"
                    style={{ background: h.strong }}
                  />
                  <span className="block px-3 py-2">
                    <span className="block text-sm font-extrabold" style={{ color: h.ink }}>
                      {nombre}
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

      <section aria-labelledby="vistazo">
        <CabeceraEditorial numero="2" titulo="De un vistazo" hex={CATEGORIA_HEX.consultar}>
          <p className="text-xs text-slate-500">
            Las cifras y los pasos más consultados del capítulo, en diagramas con su página.
          </p>
        </CabeceraEditorial>
        <h2 id="vistazo" className="sr-only">
          De un vistazo
        </h2>
        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {DIAGRAMAS.slice(0, 7).map((d, i) => {
            const I = ICONO_DIAGRAMA[d.id];
            return (
              <li key={d.id}>
                <a
                  href={href("visual", d.id)}
                  className="hover-lift ease-brand flex h-full flex-col gap-2 rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[3px] text-white"
                    style={{ background: MOSAICO[(i + 1) % MOSAICO.length] }}
                    aria-hidden="true"
                  >
                    <I size={19} strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-bold leading-snug text-slate-900">{d.titulo}</span>
                  <span className="pagina-badge mt-auto">
                    {d.paginas.length === 1 ? "p." : "pp."} {d.paginas.join(", ")}
                  </span>
                </a>
              </li>
            );
          })}
          <li>
            <a
              href={href("visual")}
              className="flex h-full flex-col justify-center gap-1 rounded-[4px] border border-dashed p-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
              style={{ borderColor: "#d4d4d4" }}
            >
              Todas las figuras y diagramas
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                figuras con zoom, tablas y sistemas <ArrowRight size={12} aria-hidden="true" />
              </span>
            </a>
          </li>
        </ul>
      </section>

      <IndiceMosaico />

      <RepasarYAutoevaluarse />

      <section aria-labelledby="mapa">
        <CabeceraEditorial numero="4" titulo="En cuatro bloques" hex={CATEGORIA_HEX.leer}>
          <p className="text-xs text-slate-500">
            La infografía del capítulo (p. 24) como mapa de entrada: cada bloque lleva a su
            apartado.
          </p>
        </CabeceraEditorial>
        <h2 id="mapa" className="sr-only">
          El capítulo en cuatro bloques
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {ENTRADAS.map((e, i) => {
            const caja = INFO.cajas[e.caja];
            const ap = APARTADOS.find((a) => a.slug === e.slug)!;
            const color = [SEEN.azulOsc, SEEN.burdeos, SEEN.mostazaOsc, SEEN.diabetesOsc][i];
            return (
              <Revelar as="li" key={e.slug}>
                <a
                  href={href("capitulo", e.slug)}
                  className="hover-lift ease-brand relative flex h-full overflow-hidden rounded-[4px] border bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <span
                    aria-hidden="true"
                    className="w-1.5 shrink-0"
                    style={{ background: color }}
                  />
                  <span className="block min-w-0 flex-1 p-4">
                    <span className="flex items-baseline gap-2">
                      <span
                        aria-hidden="true"
                        className="font-display text-2xl font-light leading-none"
                        style={{ color }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-wide text-slate-900">
                        {caja.titulo?.replace(/^\d+\.\s*/, "")}
                      </span>
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {caja.items
                        .slice(0, 6)
                        .filter((it) => !it.startsWith("Gráfico"))
                        .map((it, j) => (
                          <span
                            key={j}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
                          >
                            <Texto>{it.replace(/\*\*/g, "").split(":")[0].split(".")[0]}</Texto>
                          </span>
                        ))}
                    </span>
                    <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-700">
                      Apartado {ap.n} · {ap.titulo} <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </span>
                </a>
              </Revelar>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="revision">
        <div className="rounded-[4px] border bg-white p-4" style={{ borderColor: "#e6e6e6" }}>
          <h2
            id="revision"
            className="font-display text-base font-medium uppercase tracking-[0.04em]"
            style={{ color: CATEGORIA_HEX.confiar.ink }}
          >
            Última revisión
          </h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 md:max-w-xl">
            <div className="rounded-[3px] p-3" style={{ background: CATEGORIA_HEX.confiar.soft }}>
              <dt className="text-xs text-slate-600">Capítulo</dt>
              <dd
                className="text-sm font-extrabold tabular-nums"
                style={{ color: CATEGORIA_HEX.confiar.ink }}
              >
                {fecha(ultimoCap.fecha)}
              </dd>
            </div>
            <div className="rounded-[3px] p-3" style={{ background: CATEGORIA_HEX.confiar.soft }}>
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
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Qué ha cambiado y qué queda pendiente <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}

/* Composición decorativa de la cabecera (solo escritorio): fichas de color con iconos del
   capítulo, al modo del mosaico de áreas del Manual. */
function MosaicoDecorativo() {
  const piezas = [
    { c: FICHA_AREA.endocrino, I: Droplets },
    { c: FICHA_AREA.diabetes, I: Target },
    { c: FICHA_AREA.lipidos, I: null },
    { c: FICHA_AREA.mineral, I: null },
    { c: SEEN.burdeos, I: BookOpen },
    { c: FICHA_AREA.azul, I: Clock3 },
    { c: FICHA_AREA.lavanda, I: Footprints },
    { c: FICHA_AREA.obesidad, I: null },
    { c: FICHA_AREA.nutricion, I: ListChecks },
  ];
  return (
    <div aria-hidden="true" className="hidden grid-cols-3 gap-1.5 lg:grid">
      {piezas.map((p, i) => (
        <span
          key={i}
          className="mosaico-pieza flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[3px] text-white xl:h-20 xl:w-20"
          style={{ background: p.c, animationDelay: `${i * 60}ms` }}
        >
          {p.I && <p.I size={28} strokeWidth={1.5} />}
        </span>
      ))}
    </div>
  );
}
