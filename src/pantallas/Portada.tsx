/* Portada = Consultar: identidad del Manual y título del capítulo, el mapa de consulta (cuatro bloques y «Leer el capítulo»)
   (componentes/MapaConsulta) y el capítulo publicado. El buscador vive en la barra lateral
   (escritorio) y en la cabecera (móvil): la portada no lo repite. */
import { ArrowRight, ExternalLink } from "lucide-react";
import { CAPITULO } from "../contenido";
import { MapaConsulta } from "../componentes/MapaConsulta";
import { CAMBIOS, VERSION_APP } from "../contenido/cambios";
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
  const ultimoCap = CAMBIOS.find((c) => c.ambito === "capitulo")!;
  return (
    <div className="space-y-5 sm:space-y-9">
      <section
        className="cabecera-manual relative overflow-hidden rounded-[4px] border bg-white"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="titulo-capitulo"
      >
        <Franja />
        <div className="px-4 py-3 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
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
              className="titulo-manual mt-1.5 text-balance text-[1.05rem] leading-[1.15] sm:mt-3 sm:text-[2rem] lg:text-[2.3rem]"
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

      <MapaConsulta />

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
