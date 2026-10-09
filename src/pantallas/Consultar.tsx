/* Consultar: hub + tablas (filtrables) + Figura 3 (recorrido) + infografía (mapa) + glosario. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  GLOSARIO,
  INFO,
  LISTA_TABLAS,
  TABLAS,
  apartadoDeTabla,
  rutaDeTabla,
  type TablaId,
} from "../contenido";
import { DESTINOS, GRUPOS_CONSULTAR, PREGUNTA_TABLA } from "../nav";
import { elegirRuta, href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Revelar, Segmented } from "../ui";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { TablaVista } from "../componentes/TablaVista";
import { Figura3Recorrido } from "../componentes/Figura3Vista";
import { ImagenFigura } from "../componentes/FiguraVista";
import { Texto } from "../texto";
import { normalizar } from "../busqueda";
import { VersionExtendida } from "../componentes/VersionExtendida";
import { EnlaceEducativa } from "../componentes/Lectura";
import { extendidosDeTabla } from "../extendida";
import { NivelTitulo } from "../nivel-contexto";

const hex = CATEGORIA_HEX.consultar;

export function HubConsultar() {
  const tarjeta = (id: string) => {
    const d = DESTINOS.find((x) => x.id === id)!;
    const I = d.icono;
    return (
      <Revelar as="li" key={id}>
        <a
          href={d.href}
          className="hover-lift ease-brand flex h-full items-start gap-3 rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
          style={{ borderColor: "#e6e6e6" }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] text-white"
            style={{ background: hex.strong }}
            aria-hidden="true"
          >
            <I size={18} />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-bold leading-snug text-slate-900">
              {d.etiqueta}
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-600">
              {d.descripcion}
            </span>
          </span>
        </a>
      </Revelar>
    );
  };
  const tareas = GRUPOS_CONSULTAR.find((g) => g.id === "tareas")!;
  const recursos = GRUPOS_CONSULTAR.find((g) => g.id === "recursos")!;
  return (
    <div>
      <CabeceraEditorial titulo="Consultar" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Las tareas del día a día con el capítulo. El texto va literal y con su página; lo que no
          es del capítulo va rotulado aparte.
        </p>
      </CabeceraEditorial>
      <section aria-labelledby="grupo-tareas">
        <h2 id="grupo-tareas" className="sr-only">
          {tareas.titulo}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{tareas.ids.map(tarjeta)}</ul>
      </section>
      <section aria-labelledby="grupo-recursos" className="mt-6">
        <h2
          id="grupo-recursos"
          className="mb-2 text-sm font-bold uppercase tracking-wide"
          style={{ color: hex.ink }}
        >
          {recursos.titulo}
        </h2>
        <ul className="divide-y rounded-xl border bg-white" style={{ borderColor: "#e6e6e6" }}>
          {recursos.ids.map((id) => {
            const d = DESTINOS.find((x) => x.id === id)!;
            const I = d.icono;
            return (
              <li key={id}>
                <a
                  href={d.href}
                  className="flex min-h-11 items-center gap-3 px-3 py-2 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  <I
                    size={16}
                    className="shrink-0"
                    style={{ color: hex.strong }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">{d.etiqueta}</span>
                    <span className="block text-xs text-slate-600">{d.descripcion}</span>
                  </span>
                  <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* Tareas con nombre propio sobre las tablas por sistema: «Parámetros por sistema» (Tabla 3,
   un sistema) y «Comparar sistemas» (Tabla 1, dos o más). La tabla es la fuente, no el título. */
const SLUGS = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
const IDS_SIS = ["mm780", "ciq", "camaps", "op5"];

export function TareaTabla({
  tarea,
  seleccion,
}: {
  tarea: "parametros" | "comparar";
  seleccion?: string;
}) {
  const parametros = tarea === "parametros";
  const tid: TablaId = parametros ? "T3" : "T1";
  const tabla = TABLAS[tid];
  const sis = parametros ? SLUGS.indexOf(seleccion ?? "") : -1;
  const enlace =
    "inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline";
  return (
    <div>
      <CabeceraEditorial
        titulo={parametros ? "Parámetros por sistema" : "Comparar sistemas"}
        hex={hex}
        level={1}
      >
        <p className="text-sm text-slate-600">
          {parametros
            ? "Cómo se ajusta cada parámetro clásico en el sistema que elijas. "
            : "La misma característica, sistema junto a sistema. "}
          Fuente: Tabla {tabla.numero},{" "}
          {tabla.paginas[0] === tabla.paginas[1]
            ? `p. ${tabla.paginas[0]}`
            : `pp. ${tabla.paginas[0]}–${tabla.paginas[1]}`}
          .
        </p>
      </CabeceraEditorial>
      {parametros && sis < 0 ? (
        <section
          aria-labelledby="elige-sistema"
          className="rounded-xl border bg-white p-4"
          style={{ borderColor: "#e6e6e6" }}
        >
          <h2 id="elige-sistema" className="text-base font-bold text-slate-900">
            Elige el sistema que quieres consultar
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {tabla.columnas.map((nombre, c) => (
              <li key={nombre}>
                <a
                  href={href("consultar", "parametros", SLUGS[c])}
                  className="flex min-h-11 items-center gap-2 rounded-lg border-2 px-3 text-sm font-bold transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  style={{ borderColor: SISTEMA_HEX[c].strong, color: SISTEMA_HEX[c].ink }}
                >
                  {nombre} <ArrowRight size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a href={href("consultar", "tablas", "T3")} className={`mt-3 ${enlace}`}>
            Ver la Tabla 3 completa, los cuatro sistemas <ArrowRight size={14} aria-hidden="true" />
          </a>
        </section>
      ) : (
        <div
          className="rounded-2xl border bg-white p-4 shadow-soft"
          style={{ borderColor: "#e6e6e6" }}
        >
          <NivelTitulo.Provider value={2}>
            <TablaVista
              tabla={tabla}
              modo="interactiva"
              seleccionInicial={seleccion}
              ayuda={
                parametros
                  ? "Sistema que quieres consultar (varios, para compararlos)"
                  : "Elige dos o más sistemas para compararlos; uno solo, para consultarlo"
              }
              onSeleccion={(x) => elegirRuta("consultar", tarea, x)}
            />
          </NivelTitulo.Provider>
          <div
            className="no-imprimir mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t pt-3"
            style={{ borderColor: "#e6e6e6" }}
          >
            {rutaDeTabla(tid) && (
              <a href={rutaDeTabla(tid)} className={enlace}>
                Ver en el capítulo <ArrowRight size={14} aria-hidden="true" />
              </a>
            )}
            {sis >= 0 && (
              <a href={href("sistemas", IDS_SIS[sis], "parametros")} className={enlace}>
                Ficha de {tabla.columnas[sis]} <ArrowRight size={14} aria-hidden="true" />
              </a>
            )}
            <a href={href("consultar", parametros ? "comparar" : "parametros")} className={enlace}>
              {parametros ? "Comparar sistemas" : "Parámetros por sistema"}{" "}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
            <a href={href("consultar", "tablas", tid)} className={enlace}>
              Todas las tablas <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

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
        <div className="mt-4">
          <VersionExtendida fragmentos={extendidosDeTabla(tid)} />
        </div>
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
        </div>
      </div>
      <div className="mt-3">
        <EnlaceEducativa clave="cetonemia" />
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

export function Glosario({ sigla }: { sigla?: string }) {
  const [q, setQ] = useState(sigla ?? "");
  // La sigla de la URL (desde la búsqueda o con Atrás) manda sobre el filtro.
  useEffect(() => setQ(sigla ?? ""), [sigla]);
  const lista = useMemo(() => {
    const n = normalizar(q.trim());
    if (!n) return GLOSARIO;
    return GLOSARIO.filter(
      (g) => normalizar(g.sigla).includes(n) || normalizar(g.desarrollo).includes(n),
    );
  }, [q]);
  return (
    <div>
      <CabeceraEditorial titulo="Glosario de siglas" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Las siglas del capítulo, con el desarrollo que da el propio capítulo y la página en la que
          lo hace.
        </p>
      </CabeceraEditorial>
      <label className="sr-only" htmlFor="glos-q">
        Filtrar siglas
      </label>
      <input
        id="glos-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filtrar (p. ej. TBR, β-OHB…)"
        className="mb-3 w-full max-w-md rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      />
      <dl className="grid gap-2 sm:grid-cols-2">
        {lista.map((g) => (
          <div
            key={g.sigla}
            id={`sigla-${g.sigla}`}
            className="flex items-start gap-3 rounded-xl border bg-white p-3 shadow-soft"
            style={{ borderColor: "#e6e6e6" }}
          >
            <dt
              className="shrink-0 rounded-lg px-2 py-1 text-sm font-extrabold"
              style={{ background: hex.soft, color: hex.ink }}
            >
              {g.sigla}
            </dt>
            <dd className="min-w-0 flex-1 text-sm text-slate-800">
              {g.desarrollo}
              <span className="pagina-badge ml-2">p. {g.pagina}</span>
            </dd>
          </div>
        ))}
      </dl>
      {lista.length === 0 && (
        <p className="text-sm text-slate-600">Ninguna sigla del capítulo coincide.</p>
      )}
    </div>
  );
}
