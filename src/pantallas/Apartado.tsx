/* Pantalla de lectura de un apartado, con la cabecera de los capítulos del Manual SEEN
   (área, título en mayúsculas finas, ficha de color con el número), índice «En este
   apartado», barra de progreso, columna de lectura, paginación en círculos,
   anterior/siguiente e impresión. */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Image as ImageIcon, Table2 } from "lucide-react";
import {
  APARTADOS,
  DIAGRAMAS,
  FIGURA3,
  FIGURAS,
  TABLAS,
  idDeBloque,
  subapartados,
  type Apartado as TApartado,
} from "../contenido";
import { ICONO_APARTADO, ICONO_DIAGRAMA } from "../nav";
import { CIFRAS } from "../contenido/cifras";
import { href } from "../rutas";
import { BotonImprimir } from "../ui";
import { BotonFavorito, ComoCitar, Escuchar } from "../componentes/Lectura";
import { guardarUltimo, marcarLeido } from "../prefs";
import { CATEGORIA_HEX, SEEN, colorApartado } from "../tokens";
import { Bloques } from "../componentes/Bloques";

/* Progreso de lectura: la barra se mueve escribiendo su «transform» (un fotograma por
   desplazamiento, sin volver a pintar el apartado); el estado solo cambia una vez, al llegar
   al final (para marcarlo como leído). */
function useProgreso(
  ref: React.RefObject<HTMLElement | null>,
  barra: React.RefObject<HTMLDivElement | null>,
) {
  const [alFinal, setAlFinal] = useState(false);
  useEffect(() => {
    let fotograma = 0;
    const calc = () => {
      fotograma = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const alto = r.height - window.innerHeight;
      const leido = alto > 0 ? Math.min(1, Math.max(0, -r.top / alto)) : 1;
      if (barra.current) barra.current.style.transform = `scaleX(${leido})`;
      if (leido >= 0.95) setAlFinal(true);
    };
    const pedir = () => {
      if (!fotograma) fotograma = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      cancelAnimationFrame(fotograma);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
    };
  }, [ref, barra]);
  return alFinal;
}

/* Seguir leyendo: guarda el bloque visible (solo la ruta) y marca el apartado como leído al
   llegar al final. */
function useMarcadorLectura(apartado: TApartado, alFinal: boolean) {
  useEffect(() => {
    if (alFinal) marcarLeido(apartado.slug);
  }, [alFinal, apartado.slug]);
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
  const barra = useRef<HTMLDivElement>(null);
  const alFinal = useProgreso(ref, barra);
  useMarcadorLectura(apartado, alFinal);
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
  const Icono = ICONO_APARTADO[apartado.slug] ?? BookOpen;

  return (
    <div ref={ref} className="imprimible">
      <div
        aria-hidden="true"
        className="no-imprimir fixed left-0 right-0 top-14 z-20 h-0.5 bg-transparent md:left-64"
      >
        <div
          ref={barra}
          className="progreso h-full origin-left"
          style={{ background: hex.strong, transform: "scaleX(0)" }}
        />
      </div>
      <header className="mb-6">
        <div className="no-imprimir mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="etiqueta-area" style={{ color: SEEN.diabetesOsc }}>
            Área Diabetes
          </span>
          <span aria-hidden="true" className="text-slate-400">
            ·
          </span>
          <a
            href={href("capitulo")}
            className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:underline"
          >
            Capítulo
          </a>
          <span aria-hidden="true" className="text-slate-400">
            ›
          </span>
          <span className="text-slate-500">
            Apartado {apartado.n} de {APARTADOS.length}
          </span>
        </div>
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="cabecera-ficha flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-[3px] text-white sm:h-20 sm:w-20"
            style={{ background: colorApartado(apartado.n) }}
          >
            <Icono size={22} strokeWidth={1.5} className="sm:hidden" />
            <Icono size={30} strokeWidth={1.5} className="hidden sm:block" />
            <span className="mt-1 rounded-sm bg-white px-1.5 font-display text-xs font-medium leading-tight tabular-nums text-slate-900 sm:text-sm">
              {apartado.n}
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="titulo-manual text-balance text-[1.45rem] leading-[1.15] sm:text-[2rem]">
              {apartado.titulo}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
        <div aria-hidden="true" className="regla-seccion mt-4 flex h-px w-full">
          <span className="w-16" style={{ background: colorApartado(apartado.n) }} />
          <span className="flex-1" />
        </div>
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
                className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
                      className="hover-lift ease-brand flex items-center gap-2 rounded-[4px] border bg-white px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                      style={{ borderColor: "#e6e6e6" }}
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-[3px] text-white"
                        style={{ background: SEEN.azulOsc }}
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
          <a
            href={href("repaso", apartado.slug)}
            className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Repasar estas cifras como tarjetas <ArrowRight size={14} aria-hidden="true" />
          </a>
          {/* Las dosis con asterisco (Figura 3) llevan siempre su nota. */}
          {cifras.some((c) => c.valor.includes("*")) && (
            <p className="mt-2 text-xs text-slate-600">
              {FIGURA3.notaAsterisco} <span className="pagina-badge">Figura 3, p. 8</span>
            </p>
          )}
        </section>
      )}

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
        <div className="lg:pr-16">
          <Bloques apartado={apartado} destacado={destacado} />
        </div>
        {subs.length > 0 && (
          <aside aria-label="Índice lateral del apartado" className="no-imprimir hidden xl:block">
            <nav aria-label="Índice del apartado" className="sticky top-20">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                En este apartado
              </div>
              <ol className="space-y-1 border-l-2 pl-3" style={{ borderColor: "#e6e6e6" }}>
                {subs.map((s) => (
                  <li key={s.id}>
                    <a
                      href={href("capitulo", apartado.slug, s.id)}
                      aria-current={destacado === s.id ? "location" : undefined}
                      className={`block min-h-6 rounded px-1 py-0.5 text-sm leading-snug hover:text-slate-900 ${destacado === s.id ? "font-semibold text-slate-900" : "text-slate-600"}`}
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

      <nav aria-label="Apartados del capítulo" className="paginacion no-imprimir mt-10">
        <ol className="flex flex-wrap justify-center gap-1.5">
          {APARTADOS.map((a) => (
            <li key={a.slug}>
              {a.slug === apartado.slug ? (
                <span
                  aria-current="page"
                  className="flex items-center justify-center rounded-full text-sm font-semibold tabular-nums text-white"
                  style={{ background: SEEN.azulOsc }}
                >
                  {a.n}
                </span>
              ) : (
                <a
                  href={href("capitulo", a.slug)}
                  title={`${a.n}. ${a.titulo}`}
                  aria-label={`Apartado ${a.n}: ${a.corto}`}
                  className="flex items-center justify-center rounded-full border-2 bg-white text-sm font-semibold tabular-nums transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#a9c3df", color: SEEN.azulOsc }}
                >
                  {a.n}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <nav
        aria-label="Apartado anterior y siguiente"
        className="no-imprimir mt-5 grid gap-2 border-t pt-4 sm:grid-cols-2"
        style={{ borderColor: "#e6e6e6" }}
      >
        {prev ? (
          <a
            href={href("capitulo", prev.slug)}
            className="hover-lift ease-brand flex min-w-0 items-center gap-2 overflow-hidden rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e6e6e6" }}
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
            className="hover-lift ease-brand flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-[4px] border bg-white p-3 text-right transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e6e6e6" }}
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
            className="hover-lift ease-brand flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-[4px] border bg-white p-3 text-right transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e6e6e6" }}
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
