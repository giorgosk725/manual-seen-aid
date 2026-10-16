/* «Figuras y diagramas» (#/visual, 0.70.0): una sola pantalla, las figuras originales con visor y
   zoom arriba y los diagramas hechos con el texto del capítulo debajo, por temas. Sin los tres que
   redibujaban una tabla o una figura (diagramasRetirados.ts). */
import { Maximize2 } from "lucide-react";
import { diagramaEnEdicion, rutaDeDiagrama } from "../diagramasRetirados";
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
  { fig: INFO_F3, extra: { href: href("consultar", "figura-3"), texto: "Algoritmo por tramos" } },
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
    titulo: "Seguridad en el uso habitual",
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
    <div className="grid items-start gap-3 lg:grid-cols-3">
      {GRUPOS.map((g) => (
        <section
          key={g.id}
          aria-labelledby={`diag-${g.id}`}
          className="tarjeta tarjeta-sistema overflow-hidden"
          style={{ ["--sis" as string]: g.color }}
        >
          <h2
            id={`diag-${g.id}`}
            className="titulo-tarjeta px-4 pb-1.5 pt-3"
            style={{ color: g.color }}
          >
            {g.titulo}
          </h2>
          <ul className="filas">
            {g.ids.filter(diagramaEnEdicion).map((id) => {
              const d = DIAGRAMAS.find((x) => x.id === id)!;
              return (
                <li key={d.id}>
                  <a
                    // Con un solo hogar en consulta, la galería lleva allí (0.72.2-0.73.0).
                    href={rutaDeDiagrama(d.id)}
                    className="fila pl-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-600"
                  >
                    <span className="min-w-0 flex-1">{d.titulo}</span>
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
        <h2 id="figuras" className="titulo-seccion mb-2">
          Figuras del capítulo
        </h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FIGURAS_GALERIA.map(({ fig, extra }) => {
            const ap = apartadoDeFigura(fig.id);
            const img = fig.imagen!;
            return (
              <li key={fig.id} className="tarjeta flex flex-col overflow-hidden">
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
                    className="foto-figura block aspect-[4/3] w-full bg-white object-contain p-2"
                  />
                  <span className="chip absolute right-2 top-2 min-h-8 text-xs">
                    <Maximize2 size={12} aria-hidden="true" /> Ampliar
                  </span>
                </AbrirEnVisor>
                <div className="separador flex flex-1 flex-col border-t p-3">
                  <div className="text-sm font-bold leading-snug text-slate-900">
                    {fig.titulo.replace(/\.$/, "")}
                  </div>
                  {extra && (
                    <a
                      href={extra.href}
                      className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 sm:min-h-8"
                    >
                      {extra.texto}
                    </a>
                  )}
                  {ap && (
                    <p className="fuente-pie mt-auto pt-1">
                      Fuente:{" "}
                      <a
                        href={rutaDeFigura(fig.id) ?? href("capitulo", ap.slug)}
                        className="tap-44 inline-block py-1"
                      >
                        Apartado {ap.n}, p. {fig.pagina}
                      </a>
                    </p>
                  )}
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
          Figuras y diagramas
        </a>
      </div>
      <h1 className="sr-only">{d.titulo}</h1>
      <DiagramaVista id={d.id} opcion={opcion} />
    </div>
  );
}
