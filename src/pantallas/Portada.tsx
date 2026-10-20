/* Portada: el título del capítulo tal cual, en negrita, con la firma (0.72.2: sin subtítulo, la
   cabecera compacta para que la consulta empiece en la primera pantalla); el mapa de consulta
   (componentes/MapaConsulta),
   «Leer y comprender» con la misma forma (14-10-2026) y el capítulo publicado
   (decisiones del autor del 13-10-2026: sin las dos puertas). El buscador vive en la barra lateral
   (escritorio) y en la barra de abajo (móvil): la portada no lo repite. */
import { ArrowRight, ExternalLink } from "lucide-react";
import { CAPITULO } from "../contenido";
import { MapaConsulta } from "../componentes/MapaConsulta";
import { VERSION_APP } from "../version";
import { href } from "../rutas";
import { SEEN } from "../tokens";

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

export function Portada() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <section
        className="cabecera-manual tarjeta relative overflow-hidden rounded-[4px]"
        aria-labelledby="titulo-capitulo"
      >
        <Franja />
        <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-7">
          <div className="min-w-0">
            <div
              className="etiqueta-area flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
              style={{ color: SEEN.diabetesOsc }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5"
                style={{ background: SEEN.diabetes }}
              />
              {/* 0.91.2 (petición del responsable, 21-10-2026): en el ordenador, que la tarjeta es
                  el complemento interactivo del capítulo, no el capítulo. */}
              <span className="hidden lg:inline">
                Complemento interactivo<span aria-hidden="true">&nbsp;·</span>
              </span>
              <span>
                Capítulo {CAPITULO.numero} del Manual SEEN<span aria-hidden="true">&nbsp;·</span>
              </span>
              <span>{CAPITULO.area}</span>
            </div>
            <h1
              id="titulo-capitulo"
              className="titulo-manual titulo-portada mt-1.5 text-balance text-[1.05rem] leading-[1.15] sm:mt-2 sm:text-[1.35rem] lg:text-[1.5rem] xl:text-[1.7rem]"
            >
              {CAPITULO.titulo}
            </h1>
            {/* Firma como en el Manual: nombre y afiliación, en letra discreta. */}
            <p className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-700 sm:mt-2 sm:text-sm">
              {CAPITULO.autor}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-slate-500">{CAPITULO.filiacion}</p>
          </div>
        </div>
      </section>

      {/* Primero la consulta (cuatro preguntas) y, con la misma forma, la lectura. */}
      <div className="space-y-2 sm:space-y-3">
        <MapaConsulta />
      </div>

      <footer className="separador flex flex-col gap-1 border-t pt-4 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
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
