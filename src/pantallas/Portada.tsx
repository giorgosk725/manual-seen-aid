/* Portada: el título del capítulo tal cual y, debajo, qué es esta versión (complemento
   interactivo del capítulo 89; decisión del autor, 13-10-2026); dos puertas del mismo nivel
   («Leer y comprender» y «Consultar») antes del mapa de consulta (componentes/MapaConsulta); y
   el capítulo publicado. El buscador vive en la barra lateral (escritorio) y en la cabecera
   (móvil): la portada no lo repite. */
import { ArrowDown, ArrowRight, BookOpen, Columns3, ExternalLink } from "lucide-react";
import { CAPITULO } from "../contenido";
import { MapaConsulta } from "../componentes/MapaConsulta";
import { CAMBIOS, VERSION_APP } from "../contenido/cambios";
import { href } from "../rutas";
import { CATEGORIA_HEX, SEEN } from "../tokens";
import { APARTADOS } from "../contenido";
import { useUltimo } from "../prefs";

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

const puerta =
  "hover-lift ease-brand flex h-full w-full flex-col gap-1 rounded-md border bg-white p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:p-4";

/* Las dos formas de uso, al mismo nivel. «Consultar» lleva al mapa de consulta de esta misma
   pantalla (no hay otra pantalla «Consultar»). */
function Puertas() {
  const leer = CATEGORIA_HEX.leer;
  const consultar = CATEGORIA_HEX.consultar;
  const irAlMapa = () => {
    const mapa = document.getElementById("mapa-consulta");
    mapa?.scrollIntoView({ block: "start", behavior: "smooth" });
    mapa?.focus({ preventScroll: true });
  };
  return (
    <nav aria-label="Dos formas de uso" className="grid grid-cols-2 gap-2 sm:gap-3">
      <a
        href={href("capitulo")}
        className={puerta}
        style={{ borderColor: "#e6e6e6", boxShadow: `inset 0 3px 0 0 ${leer.strong}` }}
      >
        <span className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
          <BookOpen size={18} aria-hidden="true" style={{ color: leer.strong }} />
          Leer y comprender
        </span>
        <span className="text-[13px] leading-snug text-slate-600 sm:text-sm">
          Recorre el capítulo, sus tablas, figuras y explicaciones
        </span>
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-semibold text-slate-700">
          Índice del capítulo <ArrowRight size={13} aria-hidden="true" />
        </span>
      </a>
      <button
        type="button"
        onClick={irAlMapa}
        className={puerta}
        style={{ borderColor: "#e6e6e6", boxShadow: `inset 0 3px 0 0 ${consultar.strong}` }}
      >
        <span className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
          <Columns3 size={18} aria-hidden="true" style={{ color: consultar.strong }} />
          Consultar
        </span>
        <span className="text-[13px] leading-snug text-slate-600 sm:text-sm">
          Accede a sistemas, parámetros y situaciones del capítulo
        </span>
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-semibold text-slate-700">
          Ver las entradas <ArrowDown size={13} aria-hidden="true" />
        </span>
      </button>
    </nav>
  );
}

/* El último apartado abierto: solo si su ruta es la canónica de un apartado del capítulo. */
function SeguirLeyendo() {
  const ultimo = useUltimo();
  const a = ultimo && APARTADOS.find((x) => x.slug === ultimo.slug);
  if (!a || ultimo!.ruta !== href("capitulo", a.slug)) return null;
  return (
    <a
      href={href("capitulo", a.slug)}
      className="-mt-1 flex min-h-11 items-center gap-2 rounded-md border bg-white px-3 text-sm text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:-mt-3"
      style={{ borderColor: "#e6e6e6" }}
    >
      <BookOpen size={15} aria-hidden="true" style={{ color: CATEGORIA_HEX.leer.strong }} />
      <span className="font-semibold">Seguir leyendo:</span>
      <span className="min-w-0 flex-1 truncate">
        {a.n}. {a.corto}
      </span>
      <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
    </a>
  );
}

export function Portada() {
  const ultimoCap = CAMBIOS.find((c) => c.ambito === "capitulo")!;
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
              className="titulo-manual mt-1.5 text-balance text-[1.05rem] leading-[1.15] sm:mt-3 sm:text-[2rem] lg:text-[2.3rem]"
            >
              {CAPITULO.titulo}
            </h1>
            <p className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-800 sm:mt-2 sm:text-base">
              Complemento interactivo del capítulo {CAPITULO.numero} del Manual SEEN. Facilita su
              lectura, comprensión y consulta.
            </p>
            {/* Firma como en el Manual: nombre y afiliación, en letra discreta. */}
            <p className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-700 sm:text-sm">
              {CAPITULO.autor}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-slate-500">{CAPITULO.filiacion}</p>
          </div>
        </div>
      </section>

      <Puertas />
      <SeguirLeyendo />

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
          Capítulo publicado en el Manual SEEN el {fecha(ultimoCap.fecha)}{" "}
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
