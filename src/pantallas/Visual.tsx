/* «Diagramas» (#/visual) y «Figuras» (#/visual/figuras), por separado (13-10-2026): los
   diagramas hechos con el texto y las figuras originales con visor y zoom. Las tablas y los
   sistemas tienen su propia entrada (Tablas, Sistemas AID): aquí no se repiten. */
import { paginasPorApartado } from "../paginasApartado";
import { ArrowLeft, ArrowRight, Images, Maximize2 } from "lucide-react";
import { ICONO_DIAGRAMA } from "../nav";
import { DIAGRAMAS, type DiagramaId } from "../contenido/diagramas";
import { F1, F2, INFO, apartadoDeFigura, apartadoPorSlug, rutaDeFigura } from "../contenido";
import { INFO_F3 } from "../componentes/figura3-imagen";
import { DiagramaVista } from "../componentes/Diagramas";
import { AbrirEnVisor } from "../componentes/Visor";
import { href } from "../rutas";
import { CabeceraEditorial } from "../ui";
import { CATEGORIA_HEX, SEEN } from "../tokens";

const hex = CATEGORIA_HEX.consultar;

const FIGURAS_GALERIA = [
  { fig: F1, extra: null as null | { href: string; texto: string } },
  { fig: F2, extra: null },
  { fig: INFO_F3, extra: { href: href("consultar", "figura-3"), texto: "Recorrido paso a paso" } },
  { fig: INFO, extra: { href: href("consultar", "infografia"), texto: "Infografía como mapa" } },
];

/* La galería de diagramas por temas (13-10-2026): cuatro grupos, cada uno con el color de la
   paleta del Manual; en cada tarjeta, el apartado y las páginas de donde sale. */
const GRUPOS: { id: string; titulo: string; color: string; tinte: string; ids: DiagramaId[] }[] = [
  {
    id: "sistemas",
    titulo: "Sistemas y elección",
    color: SEEN.azulOsc,
    tinte: "#eef3f9",
    ids: ["algoritmos", "eleccion"],
  },
  {
    id: "inicio",
    titulo: "Inicio y seguimiento",
    color: SEEN.mostazaOsc,
    tinte: "#fbf4e6",
    ids: ["transicion", "seguimiento", "objetivos-mcg"],
  },
  {
    id: "seguridad",
    titulo: "Seguridad en el día a día",
    color: SEEN.burdeos,
    tinte: "#f7eff3",
    ids: ["cetonemia", "hipoglucemia", "interrupcion"],
  },
  {
    id: "situaciones",
    titulo: "Situaciones especiales",
    color: CATEGORIA_HEX.confiar.ink,
    tinte: CATEGORIA_HEX.confiar.soft,
    ids: ["ejercicio", "gestacion-sistemas", "hospital", "exploraciones"],
  },
];

function GaleriaDiagramas() {
  return (
    <div className="space-y-6">
      {GRUPOS.map((g) => (
        <section key={g.id} aria-labelledby={`diag-${g.id}`}>
          <h2
            id={`diag-${g.id}`}
            className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide"
            style={{ color: g.color }}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: g.color }}
            />
            {g.titulo}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.ids.map((id) => {
              const d = DIAGRAMAS.find((x) => x.id === id)!;
              const I = ICONO_DIAGRAMA[d.id];
              const ap = apartadoPorSlug(d.apartado);
              return (
                <li key={d.id}>
                  <a
                    href={href("visual", d.id)}
                    className="group flex h-full gap-3 rounded-lg border bg-white p-3 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                    style={{ borderColor: "#e6e6e6", borderLeft: `4px solid ${g.color}` }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: g.tinte, color: g.color }}
                      aria-hidden="true"
                    >
                      <I size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-[15px] font-bold leading-snug text-slate-900">
                          {d.titulo}
                        </span>
                        <ArrowRight
                          size={15}
                          className="mt-0.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-600">
                        {d.resumen}
                      </span>
                      <span className="mt-1.5 block text-xs text-slate-500">
                        {paginasPorApartado(d.paginas, ap?.n)}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function Visual({ vista = "diagramas" }: { vista?: "diagramas" | "figuras" }) {
  const ver = (f: "diagramas" | "figuras") => vista === f;
  return (
    <div>
      {vista === "figuras" ? (
        <CabeceraEditorial titulo="Figuras del capítulo" hex={hex} level={1}>
          <p className="text-sm text-slate-600">
            Las figuras originales y la infografía del capítulo, con zoom.
          </p>
        </CabeceraEditorial>
      ) : (
        <CabeceraEditorial titulo="Diagramas" hex={hex} level={1}>
          <p className="text-sm text-slate-600">
            {DIAGRAMAS.length} diagramas que presentan de forma visual el texto del capítulo. Cada
            dato lleva su página.
          </p>
        </CabeceraEditorial>
      )}

      {ver("diagramas") && <GaleriaDiagramas />}

      {ver("figuras") && (
        <section aria-label="Figuras del capítulo">
          <ul className="grid gap-3 sm:grid-cols-2">
            {FIGURAS_GALERIA.map(({ fig, extra }) => {
              const ap = apartadoDeFigura(fig.id);
              const img = fig.imagen!;
              return (
                <li
                  key={fig.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-soft"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <AbrirEnVisor
                    imagen={{
                      src: img.src,
                      alt: img.alt,
                      titulo: fig.titulo,
                      nota: `p. ${fig.pagina}`,
                    }}
                    className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                    etiqueta={`Ampliar ${fig.titulo}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="block aspect-[4/3] w-full bg-white object-contain p-2"
                    />
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white">
                      <Maximize2 size={12} aria-hidden="true" /> Ampliar
                    </span>
                  </AbrirEnVisor>
                  <div className="border-t p-3" style={{ borderColor: "#e6e6e6" }}>
                    <div className="text-sm font-bold text-slate-900">
                      {fig.titulo.replace(/\.$/, "")}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className="pagina-badge">p. {fig.pagina}</span>
                      {ap && (
                        <a
                          href={rutaDeFigura(fig.id) ?? href("capitulo", ap.slug)}
                          className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:border-slate-400 sm:min-h-6"
                        >
                          Texto en el apartado {ap.n}
                        </a>
                      )}
                      {extra && (
                        <a
                          href={extra.href}
                          className="inline-flex min-h-11 items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white sm:min-h-6"
                          style={{ background: hex.strong }}
                        >
                          {extra.texto}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Imágenes del capítulo publicado en el Manual SEEN (8-10-2026).
          </p>
        </section>
      )}
    </div>
  );
}

export function DiagramaPantalla({ id, opcion }: { id: string; opcion?: string }) {
  const i = DIAGRAMAS.findIndex((d) => d.id === id);
  if (i < 0) return <Visual />;
  const prev = DIAGRAMAS[i - 1];
  const next = DIAGRAMAS[i + 1];
  return (
    <div>
      <div className="no-imprimir mb-3 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("visual")}
          className="inline-flex min-h-11 items-center gap-1 font-semibold hover:underline"
        >
          <Images size={12} aria-hidden="true" /> Diagramas
        </a>
        <span aria-hidden="true">›</span>
        <span>
          Diagrama {i + 1} de {DIAGRAMAS.length}
        </span>
      </div>
      <h1 className="sr-only">{DIAGRAMAS[i].titulo}</h1>
      <DiagramaVista id={DIAGRAMAS[i].id} opcion={opcion} />
      <nav
        aria-label="Diagrama anterior y siguiente"
        className="no-imprimir mt-4 grid gap-2 sm:grid-cols-2"
      >
        {prev ? (
          <a
            href={href("visual", prev.id)}
            className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border bg-white p-3 shadow-soft"
            style={{ borderColor: "#e6e6e6" }}
          >
            <ArrowLeft size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
            <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
              {prev.titulo}
            </span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a
            href={href("visual", next.id)}
            className="flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-xl border bg-white p-3 text-right shadow-soft"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
              {next.titulo}
            </span>
            <ArrowRight size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
          </a>
        )}
      </nav>
    </div>
  );
}
