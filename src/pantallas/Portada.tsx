/* Portada: el título del capítulo tal cual, en negrita, y debajo qué es esta versión;
   el mapa de consulta (componentes/MapaConsulta),
   «Leer y comprender» con la misma forma (14-10-2026) y el capítulo publicado
   (decisiones del autor del 13-10-2026: sin las dos puertas). El buscador vive en la barra lateral
   (escritorio) y en la barra de abajo (móvil): la portada no lo repite. */
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { CAPITULO } from "../contenido";
import { MapaConsulta, TarjetaPortada } from "../componentes/MapaConsulta";
import { VERSION_APP } from "../version";
import { href } from "../rutas";
import { CATEGORIA_HEX, SEEN } from "../tokens";
import { DESTINOS } from "../nav";
import { APARTADOS, DIAGRAMAS, LISTA_TABLAS } from "../contenido";

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

/* Leer y comprender (V54-07; 14-10-2026): una tarjeta con la misma forma que las del mapa, con
   sus cuatro accesos en una fila desde la pantalla ancha y lo que contiene cada uno. */
const LECTURA: { id: string; detalle: string }[] = [
  { id: "capitulo", detalle: `${APARTADOS.length} apartados` },
  { id: "tablas", detalle: `${LISTA_TABLAS.length} tablas` },
  { id: "figuras", detalle: "Originales e infografía" },
  { id: "visual", detalle: `${DIAGRAMAS.length} diagramas` },
];
function LeerYComprender() {
  const hex = CATEGORIA_HEX.leer;
  return (
    <TarjetaPortada
      id="portada-leer"
      nivel={2}
      titulo="Leer y comprender"
      resumen=""
      icono={BookOpen}
      hex={hex}
    >
      <ul className="grid grid-cols-2 xl:grid-cols-4" style={{ borderColor: "#eef0f2" }}>
        {LECTURA.map(({ id, detalle }) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          const I = d.icono;
          return (
            <li
              key={id}
              className="border-t [&:nth-child(-n+2)]:border-t-0 [&:nth-child(even)]:border-l xl:border-l xl:border-t-0 xl:first:border-l-0"
              style={{ borderColor: "#eef0f2" }}
            >
              <a
                href={d.href}
                className="group flex min-h-11 items-start gap-3 px-4 py-2.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
              >
                <I
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: hex.strong }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900">{d.etiqueta}</span>
                  <span className="hidden text-xs leading-snug text-slate-600 sm:block">
                    {detalle}
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  className="mt-0.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                  aria-hidden="true"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </TarjetaPortada>
  );
}

export function Portada() {
  return (
    <div className="space-y-4 sm:space-y-7">
      <section
        className="cabecera-manual relative overflow-hidden rounded-[4px] border bg-white"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="titulo-capitulo"
      >
        <Franja />
        <div className="px-4 py-3 sm:px-8 sm:py-7 lg:px-10">
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
              <span>Capítulo {CAPITULO.numero} del Manual SEEN</span>
              <span aria-hidden="true">·</span>
              <span>{CAPITULO.area}</span>
            </div>
            <h1
              id="titulo-capitulo"
              className="titulo-manual titulo-portada mt-1.5 text-balance text-[1.05rem] leading-[1.15] sm:mt-3 sm:text-[2rem] md:text-[1.55rem] lg:text-[1.95rem] xl:text-[2.3rem]"
            >
              {CAPITULO.titulo}
            </h1>
            <p className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-800 sm:mt-2 sm:text-base">
              Complemento interactivo del capítulo. Facilita su lectura, comprensión y consulta.
            </p>
            {/* Firma como en el Manual: nombre y afiliación, en letra discreta. */}
            <p className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-700 sm:text-sm">
              {CAPITULO.autor}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-slate-500">{CAPITULO.filiacion}</p>
          </div>
        </div>
      </section>

      {/* Primero la consulta (cuatro preguntas) y, con la misma forma, la lectura. */}
      <div className="space-y-2 sm:space-y-3">
        <MapaConsulta />
        <LeerYComprender />
      </div>

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
          Capítulo publicado en el Manual SEEN el {fecha(CAPITULO.fechaFuenteISO)}{" "}
          <ExternalLink size={13} aria-hidden="true" />
        </a>
        <a
          href={href("sobre")}
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-slate-700 hover:underline"
        >
          Versión {VERSION_APP} · Sobre este complemento <ArrowRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
