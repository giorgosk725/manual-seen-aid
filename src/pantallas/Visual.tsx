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
import { CATEGORIA_HEX } from "../tokens";

const hex = CATEGORIA_HEX.consultar;

const FIGURAS_GALERIA = [
  { fig: F1, extra: null as null | { href: string; texto: string } },
  { fig: F2, extra: null },
  { fig: INFO_F3, extra: { href: href("consultar", "figura-3"), texto: "Algoritmo por tramos" } },
  { fig: INFO, extra: null },
];

/* La galería de diagramas por temas (13-10-2026). 0.92.0 (revisión de tarjetas, ★2): tarjetas de
   lista como las demás, sin la pleca ni el título en el color de un área (no son sistemas). */
const GRUPOS: { id: string; titulo: string; ids: DiagramaId[] }[] = [
  {
    id: "inicio",
    titulo: "Sistemas, inicio y seguimiento",
    ids: ["algoritmos", "seguimiento", "objetivos-mcg"],
  },
  {
    id: "seguridad",
    titulo: "Seguridad en el uso habitual",
    ids: ["cetonemia", "hipoglucemia", "interrupcion"],
  },
  {
    id: "situaciones",
    titulo: "Situaciones especiales",
    ids: ["ejercicio", "gestacion-sistemas", "hospital"],
  },
];

function GaleriaDiagramas() {
  return (
    // 0.78.1: las tres tarjetas de una fila, a la misma altura (antes 129, 139 y 129 px).
    <div className="grid gap-3 lg:grid-cols-3">
      {GRUPOS.map((g) => (
        <section key={g.id} aria-labelledby={`diag-${g.id}`} className="tarjeta overflow-hidden">
          <h2 id={`diag-${g.id}`} className="titulo-tarjeta px-3 pb-1.5 pt-3">
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
                    className="fila focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-600"
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
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FIGURAS_GALERIA.map(({ fig, extra }) => {
            const ap = apartadoDeFigura(fig.id);
            const img = fig.imagen!;
            return (
              <li key={fig.id} className="tarjeta flex overflow-hidden max-sm:flex-row sm:flex-col">
                <AbrirEnVisor
                  imagen={{
                    src: img.src,
                    alt: img.alt,
                    titulo: fig.titulo,
                    nota: `p. ${fig.pagina}`,
                  }}
                  className="group flex flex-col bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 max-sm:w-[7.5rem] max-sm:shrink-0 max-sm:justify-center sm:w-full"
                  etiqueta={`Ampliar ${fig.titulo}`}
                >
                  <span className="chip m-1.5 min-h-8 self-end text-xs max-sm:order-2 max-sm:self-center sm:m-2">
                    <Maximize2 size={12} aria-hidden="true" /> Ampliar
                  </span>
                  {/* Marco de alto fijo (4:3) y la imagen centrada dentro: las cuatro empiezan a
                      la misma altura y los títulos, debajo, quedan alineados. */}
                  <span className="flex items-center justify-center max-sm:flex-1 max-sm:px-2 max-sm:pb-2 max-sm:pt-2 sm:relative sm:aspect-[4/3]">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="foto-figura block w-full object-contain sm:absolute sm:inset-0 sm:h-full sm:px-2 sm:pb-2"
                    />
                  </span>
                </AbrirEnVisor>
                {/* 0.79.1: la línea de fuente, al pie de la tarjeta (a la misma altura en las cuatro). */}
                <div className="separador p-3 max-sm:min-w-0 max-sm:flex-1 max-sm:border-l sm:flex sm:flex-1 sm:flex-col sm:border-t">
                  {/* 0.92.0 (revisión de tarjetas, ★4): título de tarjeta (15/700). */}
                  <div className="titulo-tarjeta">{fig.titulo.replace(/\.$/, "")}</div>
                  {extra && (
                    <a
                      href={extra.href}
                      className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 sm:min-h-8 sm:self-start"
                    >
                      {extra.texto}
                    </a>
                  )}
                  {ap && (
                    <p className="fuente-pie mt-1 sm:mt-auto sm:pt-1">
                      Fuente:{" "}
                      <a
                        href={rutaDeFigura(fig.id) ?? href("capitulo", ap.slug)}
                        className="tap-44 inline-block whitespace-nowrap py-1"
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
      {/* 1.0.0 (18.ª ronda, R1): la hipoglucemia es una conducta de Situaciones, como la Figura 3
          y la Interrupción, que no llevan miga: tampoco ella (el lateral y la barra de abajo ya
          dicen dónde se está). Los demás diagramas, con la vuelta a Figuras y diagramas. */}
      {id !== "hipoglucemia" && (
        <div className="no-imprimir mb-3 flex items-center gap-2 text-xs text-slate-500">
          <a
            href={href("visual")}
            className="inline-flex min-h-11 items-center gap-1 font-semibold hover:underline"
          >
            Figuras y diagramas
          </a>
        </div>
      )}
      {/* 0.78.1: el título, con la cabecera editorial de todas las pantallas (antes, un h1 oculto
          y el título a 16 px dentro de la tarjeta). */}
      <CabeceraEditorial titulo={d.titulo} hex={hex} level={1} />
      {/* 0.92.3 (15.ª ronda, visual): en su pantalla, el cuerpo de lectura a 14 px (13 en la
          galería), como en Interrupción. */}
      <div className="diagrama-grande">
        <DiagramaVista id={d.id} opcion={opcion} tituloFuera />
      </div>
    </div>
  );
}
