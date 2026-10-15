/* Pantalla de lectura de un apartado, con la cabecera de los capítulos del Manual SEEN
   (área, título en mayúsculas finas, ficha de color con el número), índice «En este
   apartado», barra de progreso, columna de lectura, paginación en círculos,
   anterior/siguiente e impresión. */
import { diagramaEnEdicion } from "../diagramasRetirados";
import { useEffect, useRef, useState } from "react";
import { guardarUltimo } from "../prefs";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Image as ImageIcon,
  Table2,
} from "lucide-react";
import {
  APARTADOS,
  DIAGRAMAS,
  FIGURAS,
  TABLAS,
  idDeBloque,
  subapartados,
  type Apartado as TApartado,
} from "../contenido";
import { ICONO_APARTADO, ICONO_DIAGRAMA } from "../nav";
import { href } from "../rutas";
import { BotonImprimir } from "../ui";
import { CATEGORIA_HEX, SEEN, colorApartado } from "../tokens";
import { Bloques } from "../componentes/Bloques";

/* Recorridos de consulta que desarrollan cada apartado (los mismos de «Consultar»). */
const RECORRIDOS: Record<string, { texto: string; ruta: string }[]> = {
  "07-educacion": [
    { texto: "Hiperglucemia y cetonemia", ruta: href("consultar", "figura-3") },
    { texto: "Interrupción del sistema", ruta: href("consultar", "interrupcion") },
  ],
  "08-iniciacion": [
    { texto: "Iniciación del sistema paso a paso", ruta: href("consultar", "inicio") },
  ],
  "09-descarga": [
    {
      texto: "Interpretación de la descarga en ocho pasos",
      ruta: href("consultar", "descarga", "1"),
    },
  ],
  "10-situaciones": [
    { texto: "Situación y sistema (Tablas 4 y 6)", ruta: href("consultar", "situacion") },
  ],
};

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

export function Apartado({ apartado, destacado }: { apartado: TApartado; destacado?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  useProgreso(ref, barra);
  // «Seguir leyendo» (portada): solo la ruta del apartado, sin ancla ni nada de la consulta.
  useEffect(() => {
    guardarUltimo({
      ruta: href("capitulo", apartado.slug),
      titulo: `${apartado.n}. ${apartado.corto}`,
      slug: apartado.slug,
    });
  }, [apartado.slug, apartado.n, apartado.corto]);
  const i = APARTADOS.findIndex((a) => a.slug === apartado.slug);
  const prev = APARTADOS[i - 1];
  const next = APARTADOS[i + 1];
  const subs = subapartados(apartado);
  // Lo mismo para «En este apartado» (subapartados y recursos).
  const [localAbierto, setLocalAbierto] = useState(
    () => !window.matchMedia?.("(max-width: 767px)").matches,
  );
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
      if (!diagramaEnEdicion(b.id)) return [];
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
        className="no-imprimir fixed left-0 right-0 top-14 z-20 h-0.5 bg-transparent md:left-64 lg:top-0"
      >
        <div
          ref={barra}
          className="progreso h-full origin-left"
          style={{ background: hex.strong, transform: "scaleX(0)" }}
        />
      </div>
      <header className="mb-4 sm:mb-6">
        <div className="no-imprimir mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:mb-3">
          <a
            href={href("capitulo")}
            className="inline-flex min-h-11 min-w-11 items-center font-semibold text-slate-600 hover:underline"
          >
            Índice
          </a>
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
              <span className="pagina-badge">
                {apartado.paginas[0] === apartado.paginas[1]
                  ? `p. ${apartado.paginas[0]}`
                  : `pp. ${apartado.paginas[0]}–${apartado.paginas[1]}`}
                {/* En el móvil, solo las páginas: así cabe Imprimir en la misma fila. */}
                <span className="hidden sm:inline"> del capítulo</span>
              </span>
              <span className="no-imprimir flex flex-wrap items-center gap-1.5">
                <BotonImprimir
                  objetivo={ref}
                  compacto
                  titulo="Imprimir este apartado o guardarlo en PDF"
                >
                  Imprimir / PDF
                </BotonImprimir>
              </span>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="regla-seccion mt-3 flex h-px w-full sm:mt-4">
          <span className="w-16" style={{ background: colorApartado(apartado.n) }} />
          <span className="flex-1" />
        </div>
        {(subs.length > 0 || recursos.length > 0) && (
          <details
            className="group no-imprimir mt-3"
            open={localAbierto}
            onToggle={(e) => setLocalAbierto(e.currentTarget.open)}
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 rotulo text-slate-500 sm:min-h-8 [&::-webkit-details-marker]:hidden">
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="shrink-0 -rotate-90 transition group-open:rotate-0"
              />
              {/* Un solo bloque de texto: en el móvil se parte como una frase, no en columnas. */}
              <span className="min-w-0">
                En este apartado
                <span className="font-normal normal-case tracking-normal">
                  {" "}
                  ·{" "}
                  {[
                    subs.length && `${subs.length} subapartados`,
                    recursos.length &&
                      (recursos.length === 1
                        ? `1 ${recursos[0].tipo.toLowerCase()}`
                        : `${recursos.length} tablas, figuras o diagramas`),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
            </summary>
            <div className="mt-2 space-y-2">
              {subs.length > 0 && (
                <nav aria-label="Subapartados" className="flex flex-wrap items-center gap-1.5">
                  {subs.map((s) => (
                    <a
                      key={s.id}
                      href={href("capitulo", apartado.slug, s.id)}
                      className="chip tap-44 min-h-9 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:min-h-8"
                    >
                      {s.texto}
                    </a>
                  ))}
                </nav>
              )}
              {recursos.length > 0 && (
                <nav aria-label="Recursos visuales del apartado">
                  <ul className="flex flex-wrap gap-2">
                    {recursos.map((r) => {
                      const I = r.icono;
                      return (
                        <li key={r.ancla}>
                          <a
                            href={href("capitulo", apartado.slug, r.ancla)}
                            className="linea chip tap-44 min-h-9 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:min-h-8"
                          >
                            <I size={14} aria-hidden="true" style={{ color: SEEN.azulOsc }} />
                            <span className="text-slate-500">{r.tipo}</span> {r.texto}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
            </div>
          </details>
        )}
      </header>

      {(RECORRIDOS[apartado.slug] ?? []).length > 0 && (
        <nav
          aria-label="Recorridos de este apartado"
          className="no-imprimir mb-4 flex flex-wrap gap-2"
        >
          {RECORRIDOS[apartado.slug].map((r) => (
            <a
              key={r.ruta}
              href={r.ruta}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
              style={{ background: CATEGORIA_HEX.consultar.strong }}
            >
              {r.texto} <ArrowRight size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
        <div className="lg:pr-16">
          <Bloques apartado={apartado} destacado={destacado} />
        </div>
        {subs.length > 0 && (
          <aside aria-label="Índice lateral del apartado" className="no-imprimir hidden xl:block">
            <nav aria-label="Índice del apartado" className="sticky top-6">
              <div className="mb-2 rotulo text-slate-500">En este apartado</div>
              <ol className="linea space-y-1 border-l-2 pl-3">
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

      <nav
        aria-label="Apartado anterior y siguiente"
        className="separador no-imprimir mt-10 grid gap-2 border-t pt-4 sm:grid-cols-2"
      >
        {prev ? (
          <a
            href={href("capitulo", prev.slug)}
            className="linea hover-lift ease-brand flex min-w-0 items-center gap-2 overflow-hidden rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
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
            className="linea hover-lift ease-brand flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-[4px] border bg-white p-3 text-right transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
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
            className="linea hover-lift ease-brand flex min-w-0 items-center justify-end gap-2 overflow-hidden rounded-[4px] border bg-white p-3 text-right transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
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
