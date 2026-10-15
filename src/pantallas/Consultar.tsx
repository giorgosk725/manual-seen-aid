/* Consultar: tablas (filtrables), Figura 3 (recorrido) e infografía (mapa). El hub es la portada; «Comparar» y «Parámetros» viven en Sistemas. */
import { useRef } from "react";
import { ArrowRight, Printer } from "lucide-react";
import {
  INFO,
  LISTA_TABLAS,
  TABLAS,
  apartadoDeTabla,
  rutaDeTabla,
  type TablaId,
} from "../contenido";
import { elegirRuta, href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, PaginaBadge, Revelar, Segmented } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import { TablaVista } from "../componentes/TablaVista";
import { Figura3Recorrido } from "../componentes/Figura3Vista";
import { ImagenFigura } from "../componentes/FiguraVista";
import { Texto } from "../texto";
import { NivelTitulo } from "../nivel-contexto";

const hex = CATEGORIA_HEX.consultar;

/* Las seis tablas como filas: número, título y la pregunta que responde cada una. */
function IndiceTablas() {
  return (
    <div>
      <CabeceraEditorial titulo="Tablas del capítulo" hex={hex} level={1} />
      {/* 13-10-2026: la pregunta que responde cada tabla, delante y en negrita; el título del
          capítulo debajo, como referencia. Un icono por tabla. */}
      <ul className="grid gap-2 sm:grid-cols-2">
        {LISTA_TABLAS.map((t) => {
          return (
            <li key={t.id}>
              <a
                href={href("consultar", "tablas", t.id)}
                className="hover-lift ease-brand flex h-full gap-3 tarjeta p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="rotulo" style={{ color: hex.ink }}>
                      Tabla {t.numero}
                    </span>
                    <PaginaBadge p={t.paginas[0]} p2={t.paginas[1]} />
                  </span>
                  <span className="titulo-tarjeta mt-0.5 block">{t.titulo}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Tablas({ id, seleccion }: { id?: string; seleccion?: string }) {
  const tid = (id && id in TABLAS ? id : null) as TablaId | null;
  if (!tid) return <IndiceTablas />;
  return <TablaPantalla tid={tid} seleccion={seleccion} />;
}

function TablaPantalla({ tid, seleccion }: { tid: TablaId; seleccion?: string }) {
  const tabla = TABLAS[tid];
  const ap = apartadoDeTabla(tid);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      {/* 0.71.0: «Tabla N» una vez (pestaña y cabecera de la tabla); sin migas: las pestañas
          llevan a las demás. */}
      <CabeceraEditorial titulo="Tablas del capítulo" hex={hex} level={1} />
      <div className="no-imprimir mb-4 overflow-x-auto">
        <Segmented
          label="Otra tabla"
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
      </div>
      <div ref={ref} className="imprimible tarjeta p-4" key={tid}>
        <NivelTitulo.Provider value={2}>
          <TablaVista
            tabla={tabla}
            modo="interactiva"
            seleccionInicial={seleccion}
            onSeleccion={(x) => elegirRuta("consultar", "tablas", x ? `${tid}:${x}` : tid)}
          />
        </NivelTitulo.Provider>
        <div className="separador no-imprimir mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
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
      <CabeceraEditorial titulo="Hiperglucemia y cetonemia" hex={hex} level={1} />
      {/* 0.72.2: lo que más se busca aquí es la hoja para entregar: arriba, a un toque. */}
      <a
        href={href("pacientes", "hoja", "cetonas")}
        className="no-imprimir mb-3 inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-bold text-white"
        style={{ background: hex.strong }}
      >
        <Printer size={16} aria-hidden="true" /> Hoja para el paciente: cetonas
      </a>
      <div className="tarjeta p-4">
        <NivelTitulo.Provider value={2}>
          <Figura3Recorrido tramoInicial={tramo} />
        </NivelTitulo.Provider>
        <div className="separador no-imprimir mt-4 border-t pt-3">
          <a
            href={href("capitulo", "07-educacion", "b5")}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Leer en su apartado: 7. Educación terapéutica y plan de seguridad{" "}
            <ArrowRight size={14} aria-hidden="true" />
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
      <CabeceraEditorial titulo="Infografía" hex={hex} level={1} />
      <ol className="grid gap-3 md:grid-cols-2">
        {INFO.cajas.map((c, i) => {
          const dest = DESTINO_INFO[i] || [];
          const esPlan = i === 4;
          return (
            <Revelar as="li" key={i} className={i >= 4 ? "md:col-span-2" : ""}>
              <section
                className="h-full rounded-xl border p-4"
                style={{ ["--sis" as string]: hex.strong }}
                aria-labelledby={`info-${i}`}
              >
                <h2 id={`info-${i}`} className="titulo-seccion" style={{ color: hex.ink }}>
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
                      className="chip text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                      style={{ borderColor: `${hex.strong}40`, color: hex.ink }}
                    >
                      {d.etiqueta} <ArrowRight size={12} aria-hidden="true" />
                    </a>
                  ))}
                  {esPlan && (
                    <a
                      href={href("consultar", "figura-3")}
                      className="chip border-transparent text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
