/* Pantalla de lectura de un apartado: cabecera editorial con numeral, índice «En este
   apartado», barra de progreso, columna de lectura, anterior/siguiente e impresión. */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Image as ImageIcon, Table2 } from "lucide-react";
import {
  APARTADOS,
  DIAGRAMAS,
  FIGURAS,
  TABLAS,
  idDeBloque,
  subapartados,
  type Apartado as TApartado,
} from "../contenido";
import { ICONO_DIAGRAMA } from "../nav";
import { CIFRAS } from "../contenido/cifras";
import { href } from "../rutas";
import { BotonImprimir } from "../ui";
import { BotonFavorito, ComoCitar, Escuchar } from "../componentes/Lectura";
import { guardarUltimo, marcarLeido } from "../prefs";
import { CATEGORIA_HEX } from "../tokens";
import { Bloques } from "../componentes/Bloques";

function useProgreso(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const calc = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const alto = r.height - window.innerHeight;
      const leido = alto > 0 ? Math.min(1, Math.max(0, -r.top / alto)) : 1;
      setP(leido);
    };
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, [ref]);
  return p;
}

/* Seguir leyendo: guarda el bloque visible (solo la ruta) y marca el apartado como leído al
   llegar al final. */
function useMarcadorLectura(apartado: TApartado, progreso: number) {
  useEffect(() => {
    if (progreso >= 0.95) marcarLeido(apartado.slug);
  }, [progreso, apartado.slug]);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const titulo = `${apartado.n}. ${apartado.titulo}`;
    const guardar = () => {
      let ancla: string | undefined;
      apartado.bloques.forEach((b, i) => {
        const id = idDeBloque(b, i);
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) ancla = id;
      });
      guardarUltimo({ slug: apartado.slug, titulo, ruta: href("capitulo", apartado.slug, ancla) });
    };
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(guardar, 600);
    };
    guardar();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [apartado]);
}

export function Apartado({ apartado, destacado }: { apartado: TApartado; destacado?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const progreso = useProgreso(ref);
  useMarcadorLectura(apartado, progreso);
  const i = APARTADOS.findIndex((a) => a.slug === apartado.slug);
  const prev = APARTADOS[i - 1];
  const next = APARTADOS[i + 1];
  const subs = subapartados(apartado);
  const cifras = CIFRAS[apartado.slug] || [];
  // Recursos visuales del apartado (tablas, figuras, diagramas), en orden de lectura.
  const recursos = apartado.bloques.flatMap((b, i) => {
    const ancla = idDeBloque(b, i);
    if (b.t === "tabla")
      return [{ ancla, icono: Table2, texto: `Tabla ${TABLAS[b.id].numero}`, tipo: "Tabla" }];
    if (b.t === "figura")
      return [
        {
          ancla,
          icono: ImageIcon,
          texto: b.id === "INFO" ? "Infografía" : `Figura ${b.id.slice(1)}`,
          tipo: b.id === "F3" ? "Algoritmo" : "Figura",
          titulo: FIGURAS[b.id]?.titulo,
        },
      ];
    if (b.t === "diagrama") {
      const d = DIAGRAMAS.find((x) => x.id === b.id)!;
      return [{ ancla, icono: ICONO_DIAGRAMA[b.id], texto: d.titulo, tipo: "Diagrama" }];
    }
    return [];
  });
  const hex = CATEGORIA_HEX.leer;

  return (
    <div ref={ref} className="imprimible">
      <div
        aria-hidden="true"
        className="no-imprimir fixed left-0 right-0 top-14 z-20 h-0.5 bg-transparent md:left-64"
      >
        <div
          className="progreso h-full origin-left"
          style={{ background: hex.strong, transform: `scaleX(${progreso})` }}
        />
      </div>
      <header className="mb-6">
        <div className="no-imprimir mb-2 flex items-center gap-2 text-xs text-slate-500">
          <a href={href("capitulo")} className="font-semibold hover:underline">
            Capítulo
          </a>
          <span aria-hidden="true">›</span>
          <span>
            Apartado {apartado.n} de {APARTADOS.length}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="pointer-events-none text-5xl font-black leading-none tabular-nums sm:text-6xl"
            style={{ color: `${hex.strong}2e` }}
          >
            {String(apartado.n).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {apartado.titulo}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="pagina-badge rounded-full bg-slate-100 px-2 py-0.5">
                {apartado.paginas[0] === apartado.paginas[1]
                  ? `p. ${apartado.paginas[0]}`
                  : `pp. ${apartado.paginas[0]}–${apartado.paginas[1]}`}{" "}
                del capítulo
              </span>
              <span className="no-imprimir flex flex-wrap items-center gap-1.5">
                <BotonImprimir objetivo={ref} compacto titulo="Imprimir solo este apartado">
                  Imprimir
                </BotonImprimir>
                <BotonFavorito
                  ruta={href("capitulo", apartado.slug)}
                  titulo={`${apartado.n}. ${apartado.titulo}`}
                />
                <Escuchar apartado={apartado} />
                <ComoCitar apartado={apartado} />
              </span>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mt-3 h-px w-full"
          style={{ background: `linear-gradient(90deg, ${hex.strong}30, transparent)` }}
        />
        {subs.length > 0 && (
          <nav
            aria-label="En este apartado"
            className="no-imprimir mt-3 flex flex-wrap items-center gap-1.5"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              En este apartado
            </span>
            {subs.map((s) => (
              <a
                key={s.id}
                href={href("capitulo", apartado.slug, s.id)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                {s.texto}
              </a>
            ))}
          </nav>
        )}
        {recursos.length > 0 && (
          <nav aria-label="Recursos visuales del apartado" className="no-imprimir mt-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tablas, figuras y diagramas
            </div>
            <ul className="flex gap-2 overflow-x-auto pb-1">
              {recursos.map((r) => {
                const I = r.icono;
                return (
                  <li key={r.ancla} className="shrink-0">
                    <a
                      href={href("capitulo", apartado.slug, r.ancla)}
                      className="hover-lift ease-brand flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                      style={{ borderColor: "#e5ebf1" }}
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                        style={{ background: "linear-gradient(135deg, #514dbf, #4340a6)" }}
                        aria-hidden="true"
                      >
                        <I size={15} />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {r.tipo}
                        </span>
                        <span className="block whitespace-nowrap font-semibold text-slate-900">
                          {r.texto}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      {cifras.length > 0 && (
        <section aria-labelledby="cifras" className="mb-6">
          <h2 id="cifras" className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Cifras del apartado · tal como las da el capítulo
          </h2>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {cifras.map((c, i) => (
              <li key={i}>
                <a
                  href={href("capitulo", apartado.slug, c.ancla)}
                  className="hover-lift ease-brand flex h-full flex-col rounded-xl p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ background: hex.soft }}
                >
                  <span
                    className="text-lg font-extrabold leading-tight tabular-nums"
                    style={{ color: hex.ink }}
                  >
                    {c.valor}
                  </span>
                  <span className="mt-1 text-xs leading-snug text-slate-700">{c.etiqueta}</span>
                  <span className="pagina-badge mt-auto pt-1.5">p. {c.p}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
        <div className="lg:pr-16">
          <Bloques apartado={apartado} destacado={destacado} />
        </div>
        {subs.length > 0 && (
          <aside className="no-imprimir hidden xl:block">
            <nav aria-label="Índice del apartado" className="sticky top-20">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                En este apartado
              </div>
              <ol className="space-y-1 border-l-2 pl-3" style={{ borderColor: "#e5ebf1" }}>
                {subs.map((s) => (
                  <li key={s.id}>
                    <a
                      href={href("capitulo", apartado.slug, s.id)}
                      aria-current={destacado === s.id ? "location" : undefined}
                      className={`block rounded px-1 py-0.5 text-sm leading-snug hover:text-slate-900 ${destacado === s.id ? "font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      {s.texto}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      <nav
        aria-label="Apartado anterior y siguiente"
        className="no-imprimir mt-10 grid gap-2 border-t pt-4 sm:grid-cols-2"
        style={{ borderColor: "#e5ebf1" }}
      >
        {prev ? (
          <a
            href={href("capitulo", prev.slug)}
            className="hover-lift ease-brand flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border bg-white p-3 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e5ebf1" }}
          >
            <ArrowLeft size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">Anterior</span>
              <span className="block truncate text-sm font-semibold text-slate-900">
                {prev.n}. {prev.titulo}
              </span>
            </span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a
            href={href("capitulo", next.slug)}
            className="hover-lift ease-brand flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-xl border bg-white p-3 text-right shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e5ebf1" }}
          >
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">Siguiente</span>
              <span className="block truncate text-sm font-semibold text-slate-900">
                {next.n}. {next.titulo}
              </span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
          </a>
        ) : (
          <a
            href={href("bibliografia")}
            className="hover-lift ease-brand flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-xl border bg-white p-3 text-right shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e5ebf1" }}
          >
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">Siguiente</span>
              <span className="block truncate text-sm font-semibold text-slate-900">
                Bibliografía
              </span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
          </a>
        )}
      </nav>
    </div>
  );
}
