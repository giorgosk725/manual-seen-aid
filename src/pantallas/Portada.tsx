/* Portada: el título del capítulo tal cual, en negrita, y debajo qué es esta versión;
   «Seguir leyendo»; el mapa de consulta (componentes/MapaConsulta) y el capítulo publicado
   (decisiones del autor del 13-10-2026: sin las dos puertas). El buscador vive en la barra lateral
   (escritorio) y en la barra de abajo (móvil): la portada no lo repite. */
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { CAPITULO } from "../contenido";
import { MapaConsulta } from "../componentes/MapaConsulta";
import { VERSION_APP } from "../version";
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

/* El último apartado abierto: solo si su ruta es la canónica de un apartado del capítulo. */
function SeguirLeyendo() {
  const ultimo = useUltimo();
  const a = ultimo && APARTADOS.find((x) => x.slug === ultimo.slug);
  if (!a || ultimo!.ruta !== href("capitulo", a.slug)) return null;
  return (
    <a
      href={href("capitulo", a.slug)}
      className="flex min-h-11 items-center gap-2 rounded-md border bg-white px-3 text-sm text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
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

/* Leer y comprender (V54-07): región propia, hermana de Consultar y antes de ella, en una fila
   breve; las dos formas de uso del mismo capítulo, sin volver a las tarjetas grandes. */
const LECTURA = [
  { t: "Índice del capítulo", r: href("capitulo") },
  { t: "Tablas", r: href("consultar", "tablas") },
  { t: "Figuras", r: href("visual", "figuras") },
  { t: "Diagramas", r: href("visual") },
];
function LeerYComprender() {
  const hex = CATEGORIA_HEX.leer;
  return (
    <section
      aria-labelledby="portada-leer"
      className="rounded-md border bg-white px-3 py-2"
      style={{ borderColor: "#e6e6e6" }}
    >
      <h2
        id="portada-leer"
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
        style={{ color: hex.ink }}
      >
        <BookOpen size={14} aria-hidden="true" style={{ color: hex.strong }} />
        Leer y comprender
      </h2>
      <ul className="mt-1 grid grid-cols-2 gap-x-3 sm:flex sm:flex-wrap sm:gap-x-5">
        {LECTURA.map((x, i) => (
          <li key={x.t}>
            <a
              href={x.r}
              className={`inline-flex min-h-11 items-center gap-1 text-sm hover:underline sm:min-h-9 ${i === 0 ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}
            >
              {x.t}
              {i === 0 && <ArrowRight size={13} aria-hidden="true" />}
            </a>
          </li>
        ))}
      </ul>
    </section>
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

      <SeguirLeyendo />

      <LeerYComprender />

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
