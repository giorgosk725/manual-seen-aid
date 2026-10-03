/* Consultar: hub + tablas (filtrables) + Figura 3 (recorrido) + infografía (mapa) + glosario. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Table2 } from "lucide-react";
import { GLOSARIO, INFO, LISTA_TABLAS, TABLAS, apartadoDeTabla, type TablaId } from "../contenido";
import { DESTINOS, GRUPOS_CONSULTAR } from "../nav";
import { href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Revelar, Segmented } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
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
          className="hover-lift ease-brand flex h-full gap-3 rounded-2xl border bg-white p-4 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
          style={{
            borderColor: "#e6e6e6",
            background: `linear-gradient(160deg, ${hex.soft}, #ffffff 60%)`,
          }}
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${hex.strong}, ${hex.strong2})` }}
            aria-hidden="true"
          >
            <I size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-bold text-slate-900">{d.etiqueta}</span>
            <span className="mt-0.5 block text-sm text-slate-600">{d.descripcion}</span>
          </span>
        </a>
      </Revelar>
    );
  };
  return (
    <div>
      <CabeceraEditorial titulo="Consultar" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Lo que se busca en consulta, en dos toques. El texto del capítulo va literal y con su
          página; lo que no es del capítulo va rotulado aparte.
        </p>
      </CabeceraEditorial>
      <div className="space-y-6">
        {GRUPOS_CONSULTAR.map((g) => (
          <section key={g.id} aria-labelledby={`grupo-${g.id}`}>
            <h2
              id={`grupo-${g.id}`}
              className="mb-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              {g.titulo}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">{g.ids.map(tarjeta)}</ul>
          </section>
        ))}
        <section aria-labelledby="grupo-pacientes">
          <h2
            id="grupo-pacientes"
            className="mb-2 text-sm font-bold uppercase tracking-wide"
            style={{ color: hex.ink }}
          >
            Para el paciente
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">{tarjeta("pacientes")}</ul>
        </section>
      </div>
      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-500">
        Las seis tablas
      </h2>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {LISTA_TABLAS.map((t) => (
          <li key={t.id}>
            <a
              href={href("consultar", "tablas", t.id)}
              className="flex h-full items-start gap-2 rounded-xl border bg-white p-3 shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
              style={{ borderColor: "#e6e6e6" }}
            >
              <Table2
                size={16}
                className="mt-0.5 shrink-0"
                style={{ color: hex.strong }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span
                  className="block text-xs font-bold uppercase tracking-wide"
                  style={{ color: hex.ink }}
                >
                  Tabla {t.numero} ·{" "}
                  {t.porSistema ? "por sistema" : t.id === "T6" ? "por procedimiento" : "lectura"}
                </span>
                <span className="block text-sm text-slate-800">{t.titulo}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
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
      <CabeceraEditorial titulo="Tablas del capítulo" hex={hex} level={1} />
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
      </div>
      <div
        ref={ref}
        className="imprimible rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        key={tid}
      >
        <NivelTitulo.Provider value={2}>
          <TablaVista tabla={tabla} modo="interactiva" seleccionInicial={seleccion} />
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
              href={href("capitulo", ap.slug)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Leer en su apartado: {ap.n}. {ap.titulo} <ArrowRight size={14} aria-hidden="true" />
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
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
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
