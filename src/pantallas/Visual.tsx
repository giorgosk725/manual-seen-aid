/* «Figuras y diagramas»: todo lo visual del capítulo en un solo sitio, con filtros. Diagramas
   (a partir del texto), figuras originales (con visor y zoom), tablas y fotos de los sistemas. */
import { useState } from "react";
import { ArrowLeft, ArrowRight, Images, Maximize2, Table2 } from "lucide-react";
import { ICONO_DIAGRAMA } from "../nav";
import { DIAGRAMAS } from "../contenido/diagramas";
import {
  F1,
  F2,
  INFO,
  LISTA_TABLAS,
  TABLAS,
  apartadoDeFigura,
  apartadoDeTabla,
} from "../contenido";
import { INFO_F3 } from "../componentes/figura3-imagen";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { DiagramaVista } from "../componentes/Diagramas";
import { AbrirEnVisor } from "../componentes/Visor";
import { href } from "../rutas";
import { BotonFavorito } from "../componentes/Lectura";
import { CabeceraEditorial, Revelar, Segmented } from "../ui";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";

const hex = CATEGORIA_HEX.consultar;

type Filtro = "todo" | "diagramas" | "figuras" | "tablas" | "sistemas";

const FIGURAS_GALERIA = [
  { fig: F1, extra: null as null | { href: string; texto: string } },
  { fig: F2, extra: null },
  { fig: INFO_F3, extra: { href: href("consultar", "figura-3"), texto: "Recorrido paso a paso" } },
  { fig: INFO, extra: { href: href("consultar", "infografia"), texto: "Infografía como mapa" } },
];

function Titulo({ children, n }: { children: string; n: number }) {
  return (
    <h2 className="mb-3 mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600 first:mt-0">
      {children}
      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">{n}</span>
    </h2>
  );
}

export function Visual() {
  const [filtro, setFiltro] = useState<Filtro>("todo");
  const ver = (f: Filtro) => filtro === "todo" || filtro === f;
  return (
    <div>
      <CabeceraEditorial titulo="Figuras y diagramas" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Todo lo visual del capítulo en un sitio: diagramas hechos a partir de su texto, las
          figuras originales con zoom, las tablas y los sistemas.
        </p>
      </CabeceraEditorial>
      <div className="no-imprimir mb-4">
        <Segmented
          label="Filtrar"
          wrap
          value={filtro}
          onChange={setFiltro}
          options={[
            { id: "todo", label: "Todo" },
            { id: "diagramas", label: `Diagramas (${DIAGRAMAS.length})` },
            { id: "figuras", label: "Figuras (4)" },
            { id: "tablas", label: `Tablas (${LISTA_TABLAS.length})` },
            { id: "sistemas", label: "Sistemas (4)" },
          ]}
        />
      </div>

      {ver("diagramas") && (
        <section aria-label="Diagramas">
          <Titulo n={DIAGRAMAS.length}>Diagramas a partir del texto</Titulo>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DIAGRAMAS.map((d) => {
              const I = ICONO_DIAGRAMA[d.id];
              return (
                <Revelar as="li" key={d.id}>
                  <a
                    href={href("visual", d.id)}
                    className="hover-lift ease-brand flex h-full gap-3 rounded-2xl border bg-white p-4 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                    style={{
                      borderColor: "#e6e6e6",
                      background: `linear-gradient(160deg, ${hex.soft}, #ffffff 60%)`,
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${hex.strong}, ${hex.strong2})`,
                      }}
                      aria-hidden="true"
                    >
                      <I size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-bold text-slate-900">{d.titulo}</span>
                      <span className="mt-0.5 block text-sm text-slate-600">{d.resumen}</span>
                      <span className="pagina-badge mt-1 block">
                        {d.paginas.length === 1 ? "p." : "pp."} {d.paginas.join(", ")}
                      </span>
                    </span>
                  </a>
                </Revelar>
              );
            })}
          </ul>
        </section>
      )}

      {ver("figuras") && (
        <section aria-label="Figuras del capítulo">
          <Titulo n={FIGURAS_GALERIA.length}>Figuras originales del capítulo</Titulo>
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
                          href={href("capitulo", ap.slug)}
                          className="inline-flex min-h-6 items-center rounded-full border border-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:border-slate-400"
                        >
                          Transcripción en {ap.n}. {ap.corto}
                        </a>
                      )}
                      {extra && (
                        <a
                          href={extra.href}
                          className="inline-flex min-h-6 items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white"
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
            Imágenes de la maquetación del 5-10-2026, que ya llevan las correcciones editoriales
            (provisionales, a falta de los archivos fuente).
          </p>
        </section>
      )}

      {ver("tablas") && (
        <section aria-label="Tablas">
          <Titulo n={LISTA_TABLAS.length}>Tablas</Titulo>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {LISTA_TABLAS.map((t) => {
              const ap = apartadoDeTabla(t.id);
              return (
                <li key={t.id}>
                  <a
                    href={href("consultar", "tablas", t.id)}
                    className="hover-lift ease-brand flex h-full gap-2 rounded-xl border bg-white p-3 shadow-soft transition"
                    style={{ borderColor: "#e6e6e6" }}
                  >
                    <Table2
                      size={18}
                      className="mt-0.5 shrink-0"
                      style={{ color: hex.strong }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span
                        className="block text-xs font-bold uppercase tracking-wide"
                        style={{ color: hex.ink }}
                      >
                        Tabla {t.numero} · {t.filas.length} filas
                      </span>
                      <span className="block text-sm text-slate-800">{t.titulo}</span>
                      <span className="pagina-badge mt-1 block">
                        pp. {t.paginas[0]}–{t.paginas[1]}
                        {ap ? ` · ${ap.n}. ${ap.corto}` : ""}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {ver("sistemas") && (
        <section aria-label="Sistemas">
          <Titulo n={4}>Sistemas</Titulo>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ORDEN_SISTEMAS.map((id, c) => {
              const s = { name: TABLAS.T1.columnas[c] };
              const h = SISTEMA_HEX[c];
              return (
                <li
                  key={id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-soft"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <AbrirEnVisor
                    imagen={{
                      src: FOTO_SISTEMA[id],
                      alt: `Foto oficial de ${s.name}`,
                      titulo: s.name,
                    }}
                    className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                    etiqueta={`Ampliar la foto de ${s.name}`}
                  >
                    <img
                      src={FOTO_SISTEMA[id]}
                      alt=""
                      loading="lazy"
                      className="block aspect-square w-full object-cover"
                    />
                  </AbrirEnVisor>
                  <a
                    href={href("sistemas", id)}
                    className="flex items-center justify-between border-t px-3 py-2 text-sm font-bold"
                    style={{ borderColor: "#e6e6e6", color: h.ink }}
                  >
                    {s.name} <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Fotos oficiales de producto (Medtronic, Tandem/Novalab, mylife/Ypsomed e Insulet).
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
          <Images size={12} aria-hidden="true" /> Figuras y diagramas
        </a>
        <span aria-hidden="true">›</span>
        <span>
          Diagrama {i + 1} de {DIAGRAMAS.length}
        </span>
        <span className="ml-auto">
          <BotonFavorito ruta={href("visual", DIAGRAMAS[i].id)} titulo={DIAGRAMAS[i].titulo} />
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
