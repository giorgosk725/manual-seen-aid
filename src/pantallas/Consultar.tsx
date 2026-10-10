/* Consultar: tablas (filtrables), Figura 3 (recorrido) e infografía (mapa). El hub es la portada; «Comparar» y «Parámetros» viven en Sistemas. */
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  INFO,
  LISTA_TABLAS,
  TABLAS,
  apartadoDeTabla,
  rutaDeTabla,
  type TablaId,
} from "../contenido";
import { PREGUNTA_TABLA } from "../nav";
import { elegirRuta, href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Revelar, Segmented } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import { TablaVista } from "../componentes/TablaVista";
import { Figura3Recorrido } from "../componentes/Figura3Vista";
import { ImagenFigura } from "../componentes/FiguraVista";
import { Texto } from "../texto";
import { NivelTitulo } from "../nivel-contexto";

const hex = CATEGORIA_HEX.consultar;

export function Tablas({ id, seleccion }: { id?: string; seleccion?: string }) {
  const tid = (id && id in TABLAS ? id : "T1") as TablaId;
  const tabla = TABLAS[tid];
  const ap = apartadoDeTabla(tid);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      <CabeceraEditorial titulo="Tablas del capítulo" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Las seis tablas, literales y con su página. Las de sistemas se filtran por sistema, y la
          selección queda en el enlace para compartirla.
        </p>
      </CabeceraEditorial>
      <div className="no-imprimir mb-4 overflow-x-auto">
        <Segmented
          label="Elegir tabla"
          options={LISTA_TABLAS.map((t) => ({
            id: t.id,
            label: `Tabla ${t.numero}`,
            shortLabel: `T${t.numero}`,
          }))}
          value={tid}
          onChange={(v) => {
            window.location.hash = href("consultar", "tablas", v);
          }}
        />
        {/* La pregunta que responde la tabla elegida (las tres por sistema se parecen). */}
        <p className="mt-2 text-base font-semibold text-slate-900">{PREGUNTA_TABLA[tid]}</p>
      </div>
      <div
        ref={ref}
        className="imprimible rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        key={tid}
      >
        <NivelTitulo.Provider value={2}>
          <TablaVista
            tabla={tabla}
            modo="interactiva"
            seleccionInicial={seleccion}
            onSeleccion={(x) => elegirRuta("consultar", "tablas", x ? `${tid}:${x}` : tid)}
          />
        </NivelTitulo.Provider>
        <div
          className="no-imprimir mt-4 flex flex-wrap items-center gap-2 border-t pt-3"
          style={{ borderColor: "#e6e6e6" }}
        >
          <BotonImprimir objetivo={ref} compacto>
            Imprimir la tabla
          </BotonImprimir>
          {ap && (
            <a
              href={rutaDeTabla(tid) ?? href("capitulo", ap.slug)}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Ver en el capítulo: {ap.n}. {ap.titulo} <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Figura3Pantalla({ tramo }: { tramo?: string }) {
  return (
    <div>
      <CabeceraEditorial titulo="Cetonemia paso a paso" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          La Figura 3 del capítulo (p. 8), como recorrido. El color de cada tramo es el de la
          figura.
        </p>
      </CabeceraEditorial>
      <div
        className="rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
      >
        <NivelTitulo.Provider value={2}>
          <Figura3Recorrido tramoInicial={tramo} />
        </NivelTitulo.Provider>
        <div className="no-imprimir mt-4 border-t pt-3" style={{ borderColor: "#e6e6e6" }}>
          <a
            href={href("capitulo", "07-educacion", "b5")}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Leer en su apartado: 7. Educación terapéutica y plan de seguridad{" "}
            <ArrowRight size={14} aria-hidden="true" />
          </a>
          <a
            href={href("pacientes", "hoja", "cetonas")}
            className="ml-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Hoja para entregar al paciente: cetonas <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* Infografía como mapa de entrada: cada bloque enlaza al apartado que lo desarrolla. */
const DESTINO_INFO: Record<number, { slug: string; detalle?: string; etiqueta: string }[]> = {
  0: [{ slug: "05-resultados", etiqueta: "5. Resultados clínicos" }],
  1: [
    { slug: "02-componentes", etiqueta: "2. Componentes" },
    { slug: "03-algoritmos", etiqueta: "3. Algoritmos" },
  ],
  2: [{ slug: "06-indicaciones", etiqueta: "6. Indicaciones" }],
  3: [{ slug: "08-iniciacion", etiqueta: "8. Iniciación y seguimiento" }],
  4: [
    { slug: "07-educacion", etiqueta: "7. Educación y plan de seguridad" },
    { slug: "09-descarga", detalle: "incidencias", etiqueta: "9. Resolución de incidencias" },
  ],
  5: [{ slug: "12-horizonte", etiqueta: "12. Implementación y horizonte" }],
};

export function Infografia() {
  return (
    <div>
      <CabeceraEditorial titulo="Infografía" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          {INFO.cabecera} (p. {INFO.pagina}). Cada bloque lleva al apartado que lo desarrolla.
        </p>
      </CabeceraEditorial>
      <ol className="grid gap-3 md:grid-cols-2">
        {INFO.cajas.map((c, i) => {
          const dest = DESTINO_INFO[i] || [];
          const esPlan = i === 4;
          return (
            <Revelar as="li" key={i} className={i >= 4 ? "md:col-span-2" : ""}>
              <section
                className="h-full rounded-2xl border p-4 shadow-soft"
                style={{
                  borderColor: "#e6e6e6",
                  background: esPlan ? "linear-gradient(160deg, #eef3f8, #ffffff 60%)" : "#ffffff",
                  boxShadow: `inset 0 3px 0 0 ${hex.strong}, 0 8px 24px rgba(15,23,42,0.05)`,
                }}
                aria-labelledby={`info-${i}`}
              >
                <h2
                  id={`info-${i}`}
                  className="text-base font-extrabold"
                  style={{ color: hex.ink }}
                >
                  <Texto>{c.titulo || ""}</Texto>
                </h2>
                <ul
                  className={`mt-2 ${i === 0 ? "grid grid-cols-2 gap-1.5 sm:grid-cols-4" : "space-y-1.5"} text-sm text-slate-700`}
                >
                  {c.items.map((it, j) =>
                    i === 0 && !it.startsWith("Gráfico") && j < 9 ? (
                      <li
                        key={j}
                        className="rounded-lg px-2 py-1.5 text-center text-xs font-semibold"
                        style={{ background: hex.soft, color: hex.ink }}
                      >
                        {it}
                      </li>
                    ) : (
                      <li
                        key={j}
                        className={`flex gap-2 ${i === 0 ? "col-span-2 sm:col-span-4" : ""}`}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: hex.strong }}
                        />
                        <span>
                          <Texto>{it}</Texto>
                        </span>
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dest.map((d) => (
                    <a
                      key={d.slug + (d.detalle || "")}
                      href={href("capitulo", d.slug, d.detalle)}
                      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                      style={{ borderColor: `${hex.strong}40`, color: hex.ink }}
                    >
                      {d.etiqueta} <ArrowRight size={12} aria-hidden="true" />
                    </a>
                  ))}
                  {esPlan && (
                    <a
                      href={href("consultar", "figura-3")}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                      style={{ background: hex.strong }}
                    >
                      Figura 3 paso a paso <ArrowRight size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </section>
            </Revelar>
          );
        })}
      </ol>
      <p className="mt-3 text-xs italic text-slate-500">
        Infografía del capítulo (apartado 13), p. {INFO.pagina}.
      </p>
      <ImagenFigura figura={INFO} />
    </div>
  );
}
