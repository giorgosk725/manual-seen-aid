/* «Leer y comprender» (#/capitulo): el índice de los trece apartados con sus páginas, nada más
   empezar; debajo, lo que ayuda a comprender y repasar. Y el «capítulo entero» para imprimir
   de una vez. */
import { useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Cpu,
  ExternalLink,
  Images,
  MessageCircleQuestion,
  Printer,
  Workflow,
} from "lucide-react";
import { ICONO_APARTADO } from "../nav";
import { BIBLIOGRAFIA, APARTADOS, CAPITULO, subapartados } from "../contenido";
import { href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Revelar } from "../ui";
import { CATEGORIA_HEX, colorApartado } from "../tokens";
import { Bloques } from "../componentes/Bloques";

function IconoApartado({ slug }: { slug: string }) {
  const I = ICONO_APARTADO[slug] ?? BookOpen;
  return <I size={20} strokeWidth={1.5} />;
}

export function IndiceCapitulo() {
  const hex = CATEGORIA_HEX.leer;
  return (
    <div>
      <CabeceraEditorial titulo="Leer y comprender" hex={hex} level={1}>
        {/* En el móvil, una línea: el título y la firma ya están en la portada. */}
        <p className="text-sm text-slate-600">
          <span className="hidden sm:inline">
            {CAPITULO.titulo}. {CAPITULO.autor}.{" "}
          </span>
          Capítulo {CAPITULO.numero} del Manual SEEN, publicado el {CAPITULO.fechaFuente}.
        </p>
      </CabeceraEditorial>
      {/* Para comprender, a mano desde el principio (V50-05) y una sola vez (V54-07: sin el
          bloque repetido de abajo). Las preguntas frecuentes tienen aquí su hogar. */}
      <nav
        aria-label="Para comprender"
        className="no-imprimir mb-4 overflow-hidden rounded-md border bg-white"
        style={{ borderColor: "#e6e6e6" }}
      >
        <div
          className="px-3 pb-0.5 pt-2 text-xs font-bold uppercase tracking-wide"
          style={{ color: hex.ink }}
        >
          Para comprender
        </div>
        <ul
          className="divide-y sm:grid sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5"
          style={{ borderColor: "#eeeeee" }}
        >
          {[
            { t: "Cómo funciona cada sistema", r: href("sistemas", "todos", "funciona"), I: Cpu },
            { t: "Figuras", r: href("visual", "figuras"), I: Images },
            { t: "Diagramas", r: href("visual"), I: Workflow },
            { t: "Preguntas frecuentes", r: href("preguntas"), I: MessageCircleQuestion },
            { t: "Autoevaluación", r: href("test"), I: ClipboardCheck },
          ].map((x) => (
            <li key={x.t}>
              <a
                href={x.r}
                className="flex min-h-11 items-center gap-3 px-3 py-1.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
              >
                <x.I
                  size={16}
                  className="shrink-0"
                  style={{ color: hex.strong }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 font-semibold text-slate-900">{x.t}</span>
                <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <section aria-labelledby="indice-apartados">
        <h2
          id="indice-apartados"
          className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 text-sm font-bold uppercase tracking-wide"
          style={{ color: hex.ink }}
        >
          Índice del capítulo
        </h2>
        <ol className="space-y-2">
          {APARTADOS.map((a) => {
            const subs = subapartados(a);
            return (
              <Revelar as="li" key={a.slug}>
                <a
                  href={href("capitulo", a.slug)}
                  className="hover-lift ease-brand flex items-start gap-3 rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:p-4"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] text-white"
                    style={{ background: colorApartado(a.n) }}
                  >
                    <IconoApartado slug={a.slug} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold uppercase leading-snug tracking-wide text-slate-900">
                      <span className="tabular-nums text-slate-500">{a.n}</span> {a.titulo}
                    </span>
                    {subs.length > 0 && (
                      <span className="mt-1 block text-xs text-slate-600">
                        {subs.map((s) => s.texto).join(" · ")}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1 pt-1">
                    <span className="pagina-badge">
                      {a.paginas[0] === a.paginas[1]
                        ? `p. ${a.paginas[0]}`
                        : `pp. ${a.paginas[0]}–${a.paginas[1]}`}
                    </span>
                  </span>
                </a>
              </Revelar>
            );
          })}
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={href("bibliografia")}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Bibliografía (pp. 24–25) <ArrowRight size={14} aria-hidden="true" />
        </a>
        <a
          href={href("capitulo", "todo")}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          <Printer size={14} aria-hidden="true" /> Capítulo entero (para imprimir)
        </a>
        <a
          href={href("capitulo", "resumen")}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Resumen del capítulo <ArrowRight size={14} aria-hidden="true" />
        </a>
        <a
          href={CAPITULO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Ver el capítulo en el Manual SEEN <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function CapituloEntero() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="imprimible">
      <div className="no-imprimir mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Capítulo entero</h1>
          <p className="text-sm text-slate-600">
            Los 13 apartados seguidos y la bibliografía, para imprimir de una vez.
          </p>
        </div>
        <BotonImprimir objetivo={ref}>Imprimir el capítulo</BotonImprimir>
      </div>
      <div className="solo-impresion mb-6">
        <h1 className="text-2xl font-black">{CAPITULO.titulo}</h1>
        <p className="text-sm">
          {CAPITULO.autor}. {CAPITULO.filiacion}
        </p>
        <p className="text-xs">
          {CAPITULO.obra} · capítulo {CAPITULO.numero}, publicado el {CAPITULO.fechaFuente}. ISBN{" "}
          {CAPITULO.isbn}.
        </p>
      </div>
      <div className="space-y-12">
        {APARTADOS.map((a) => (
          <article key={a.slug} id={`todo-${a.slug}`} className="bloque-papel">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-900">
              <span className="mr-2 tabular-nums text-slate-500">{a.n}.</span>
              {a.titulo}
            </h2>
            <div className="lg:pr-16">
              <Bloques apartado={a} prefijo={a.slug} nivelSub={3} />
            </div>
          </article>
        ))}
        {/* La bibliografía publicada (pp. 24-25), al final, como en el PDF (V50-03). Sin la
            autoevaluación: es complementaria, no del texto publicado. */}
        <article id="todo-bibliografia" className="bloque-papel">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-slate-900">Bibliografía</h2>
          <ol className="space-y-2 text-sm text-slate-800">
            {BIBLIOGRAFIA.map((r) => (
              <li key={r.n} className="flex gap-2">
                <span className="w-6 shrink-0 text-right font-bold tabular-nums">{r.n}.</span>
                <span className="min-w-0 flex-1">
                  {r.cita}
                  {r.doi ? ` doi: ${r.doi}` : r.url ? ` ${r.url}` : ""}
                </span>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </div>
  );
}
