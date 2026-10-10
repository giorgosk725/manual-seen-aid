/* Portada = Consultar: identidad del Manual y título del capítulo, las dos entradas (Leer
   capítulo y Para el paciente), el buscador, seguir leyendo, el mapa de consulta en cuatro
   bloques (componentes/MapaConsulta), hasta tres favoritos y el capítulo publicado. */
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Droplets,
  ExternalLink,
  Footprints,
  HeartHandshake,
  ListChecks,
  Search,
  Star,
  Target,
} from "lucide-react";
import { CAPITULO } from "../contenido";
import { MapaConsulta } from "../componentes/MapaConsulta";
import { CAMBIOS, VERSION_APP } from "../contenido/cambios";
import { href, navegar } from "../rutas";
import { marcar, paginaDe } from "../busqueda";
import { precargarBuscador, useBuscador } from "../useBuscador";
import { useParecidos } from "../semantica";
import { AvisosBusqueda } from "../componentes/AvisosBusqueda";
import { RespuestasCapitulo } from "../componentes/RespuestasCapitulo";
import { SinResultados } from "../componentes/SinResultados";
import { SugerenciasBusqueda } from "../componentes/SugerenciasBusqueda";
import { useFavoritos, useUltimo } from "../prefs";
import { CATEGORIA_HEX, FICHA_AREA, SEEN } from "../tokens";

const fecha = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* Franja de cuatro colores (azul, burdeos, mostaza y rosa del Manual). */
function Franja() {
  return (
    <div aria-hidden="true" className="flex h-1.5">
      {[SEEN.azul, SEEN.burdeos, SEEN.mostaza, SEEN.diabetes].map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}

function SeguirLeyendo() {
  const ultimo = useUltimo();
  if (!ultimo) return null;
  return (
    <a
      href={ultimo.ruta}
      className="mt-4 flex min-h-11 items-center gap-2 rounded-[3px] border-l-4 bg-slate-50 px-3 py-2 text-sm sm:max-w-md"
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

/* El buscador transversal: el mismo motor que la paleta y la pantalla Buscar. */
function Buscador() {
  const [q, setQ] = useState("");
  const { motor, estado, reintentar } = useBuscador(q.length > 0);
  const parecidos = useParecidos(q, q.length > 0);
  const busqueda = motor && q.trim().length >= 2 ? motor.buscarConTotales(q, 5, 2) : null;
  const res = busqueda?.resultados ?? [];
  const respuestas = motor && q.trim().length >= 2 ? motor.fusionar(q, parecidos) : [];
  const frecuente = motor && q.trim().length >= 2 ? motor.preguntaFrecuente(q) : null;
  return (
    <section aria-labelledby="portada-buscar" className="scroll-mt-16 space-y-3">
      <h2
        id="portada-buscar"
        className="font-display text-lg font-medium uppercase tracking-[0.04em] sm:text-xl"
        style={{ color: CATEGORIA_HEX.consultar.ink }}
      >
        ¿Qué quieres entender o consultar?
      </h2>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) navegar("buscar", q.trim());
        }}
      >
        <label htmlFor="portada-q" className="sr-only">
          Busca un tema, un sistema o una pregunta
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
            placeholder="Tema, sistema o pregunta…"
            autoComplete="off"
            className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </form>
      {q.trim().length < 2 && <SugerenciasBusqueda onElegir={setQ} />}
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
          No se ha podido cargar el índice de búsqueda.
          <button
            type="button"
            onClick={reintentar}
            className="inline-flex min-h-9 items-center rounded-md border border-slate-300 px-2 text-xs font-semibold hover:border-slate-500"
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
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-slate-700 hover:underline"
            >
              Ver todos los resultados
            </a>
          </li>
        </ul>
      )}
    </section>
  );
}

function Favoritos() {
  const favoritos = useFavoritos();
  if (!favoritos.length) return null;
  return (
    <section aria-labelledby="favoritos-portada">
      <h2
        id="favoritos-portada"
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600"
      >
        <Star size={13} className="fill-amber-400 text-amber-500" aria-hidden="true" /> Tus
        favoritos
      </h2>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {favoritos.slice(0, 3).map((f) => (
          <li key={f.ruta}>
            <a
              href={f.ruta}
              className="inline-flex min-h-11 items-center rounded-full border bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-400 sm:min-h-9"
              style={{ borderColor: "#d4d4d4" }}
            >
              {f.titulo}
            </a>
          </li>
        ))}
        {favoritos.length > 3 && (
          <li>
            <a
              href={href("mas")}
              className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-slate-700 hover:underline sm:min-h-9"
            >
              Todos los favoritos ({favoritos.length}) <ArrowRight size={14} aria-hidden="true" />
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}

export function Portada() {
  const ultimoCap = CAMBIOS.find((c) => c.ambito === "capitulo")!;
  return (
    <div className="space-y-7 sm:space-y-9">
      <section
        className="cabecera-manual relative overflow-hidden rounded-[4px] border bg-white"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="titulo-capitulo"
      >
        <Franja />
        <div className="grid items-center gap-8 px-4 py-4 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-10 lg:py-10">
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
              className="titulo-manual mt-2 text-balance text-[1.35rem] leading-[1.15] sm:mt-3 sm:text-[2rem] lg:text-[2.3rem]"
            >
              {CAPITULO.titulo}
            </h1>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{CAPITULO.autor}</span>
            </p>
            <p className="mt-0.5 text-xs leading-snug text-slate-600">{CAPITULO.filiacion}</p>
            <div className="mt-4 grid gap-2 min-[400px]:flex min-[400px]:flex-wrap min-[400px]:items-center">
              <a
                href={href("capitulo")}
                className="boton-seen inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] px-4 text-sm font-semibold uppercase tracking-wide text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
                style={{ background: SEEN.burdeos }}
              >
                <BookOpen size={15} aria-hidden="true" /> Leer capítulo
              </a>
              <a
                href={href("pacientes")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[3px] border-2 px-4 text-sm font-semibold uppercase tracking-wide transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: FICHA_AREA.rosa, color: SEEN.diabetesOsc }}
              >
                <HeartHandshake size={15} aria-hidden="true" /> Para el paciente
              </a>
            </div>
            <SeguirLeyendo />
          </div>
          <MosaicoDecorativo />
        </div>
      </section>

      <Buscador />

      <MapaConsulta />

      <Favoritos />

      <footer
        className="flex flex-col gap-1 border-t pt-4 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5"
        style={{ borderColor: "#e6e6e6" }}
      >
        <a
          href={CAPITULO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-slate-700 hover:underline"
        >
          Publicado en el Manual SEEN el {fecha(ultimoCap.fecha)}{" "}
          <ExternalLink size={13} aria-hidden="true" />
        </a>
        <a
          href={href("sobre")}
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-slate-700 hover:underline"
        >
          App {VERSION_APP} · Sobre esta app <ArrowRight size={14} aria-hidden="true" />
        </a>
      </footer>
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
