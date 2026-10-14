/* «Figuras y diagramas» (#/visual, 0.70.0): una sola pantalla, las figuras originales con visor y
   zoom arriba y los diagramas hechos con el texto del capítulo debajo, por temas. Sin los tres que
   redibujaban una tabla o una figura (diagramasRetirados.ts). */
import { ArrowRight, Images, Maximize2 } from "lucide-react";
import { diagramaEnEdicion } from "../diagramasRetirados";
import { ICONO_DIAGRAMA } from "../nav";
import { DIAGRAMAS, type DiagramaId } from "../contenido/diagramas";
import { F1, F2, INFO, apartadoDeFigura, rutaDeFigura } from "../contenido";
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
  { fig: INFO, extra: null },
];

/* La galería de diagramas por temas (13-10-2026): cuatro grupos, cada uno con el color de la
   paleta del Manual; en cada tarjeta, el apartado y las páginas de donde sale. */
const GRUPOS: { id: string; titulo: string; color: string; tinte: string; ids: DiagramaId[] }[] = [
  {
    id: "inicio",
    titulo: "Sistemas, inicio y seguimiento",
    color: SEEN.azulOsc,
    tinte: "#eef3f9",
    ids: ["algoritmos", "seguimiento", "objetivos-mcg"],
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
    ids: ["ejercicio", "gestacion-sistemas", "hospital"],
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
            {g.ids.filter(diagramaEnEdicion).map((id) => {
              const d = DIAGRAMAS.find((x) => x.id === id)!;
              const I = ICONO_DIAGRAMA[d.id];
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

export function Visual(_props: { vista?: "diagramas" | "figuras" }) {
  return (
    <div>
      <CabeceraEditorial titulo="Figuras y diagramas" hex={hex} level={1} />
      <section aria-labelledby="figuras" className="mb-8">
        <h2
          id="figuras"
          className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600"
        >
          <Images size={14} aria-hidden="true" /> Figuras del capítulo
        </h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
                  <div className="text-sm font-bold leading-snug text-slate-900">
                    {fig.titulo.replace(/\.$/, "")}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ap && (
                      <a
                        href={rutaDeFigura(fig.id) ?? href("capitulo", ap.slug)}
                        className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:border-slate-400 sm:min-h-6"
                      >
                        Apartado {ap.n}, p. {fig.pagina}
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
      </section>
      <GaleriaDiagramas />
    </div>
  );
}

export function DiagramaPantalla({ id, opcion }: { id: string; opcion?: string }) {
  const d = DIAGRAMAS.find((x) => x.id === id);
  if (!d || !diagramaEnEdicion(d.id)) return <Visual />;
  return (
    <div>
      <div className="no-imprimir mb-3 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("visual")}
          className="inline-flex min-h-11 items-center gap-1 font-semibold hover:underline"
        >
          <Images size={12} aria-hidden="true" /> Figuras y diagramas
        </a>
      </div>
      <h1 className="sr-only">{d.titulo}</h1>
      <DiagramaVista id={d.id} opcion={opcion} />
    </div>
  );
}
