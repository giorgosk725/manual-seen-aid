/* «Leer y comprender» (#/capitulo): seguir leyendo, el índice de los trece apartados con sus
   páginas y, aparte, lo que ayuda a comprender y repasar. Y el «capítulo entero» para imprimir
   de una vez. */
import { useRef } from "react";
import { ArrowRight, BookOpen, CircleCheck, ExternalLink, Printer } from "lucide-react";
import { ICONO_APARTADO, destino } from "../nav";
import { APARTADOS, CAPITULO, subapartados } from "../contenido";
import { href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Revelar } from "../ui";
import { CATEGORIA_HEX, colorApartado, SEEN } from "../tokens";
import { Bloques } from "../componentes/Bloques";
import { useLeidos, useUltimo } from "../prefs";

function IconoApartado({ slug }: { slug: string }) {
  const I = ICONO_APARTADO[slug] ?? BookOpen;
  return <I size={20} strokeWidth={1.5} />;
}

/* Lo que ayuda a comprender y repasar; cada cosa tiene su hogar en otra pantalla. */
const COMPRENDER = [
  {
    id: "sistemas",
    t: "Cómo funciona cada sistema",
    s: "Lo que dice el capítulo de cada uno de los cuatro sistemas, con su ficha técnica aparte.",
  },
  {
    id: "visual",
    t: "Figuras y diagramas",
    s: "Las figuras con zoom y los diagramas hechos con frases del capítulo, con su página.",
  },
  {
    id: "repaso",
    t: "Tarjetas de repaso",
    s: "Las cifras y las siglas del capítulo, con repaso espaciado en este dispositivo.",
  },
  {
    id: "test",
    t: "Autoevaluación",
    s: "Diez preguntas con la respuesta razonada y su página (pendientes de validación).",
  },
];

export function IndiceCapitulo() {
  const leidos = useLeidos();
  const ultimo = useUltimo();
  const hex = CATEGORIA_HEX.leer;
  return (
    <div>
      <CabeceraEditorial titulo="Leer y comprender" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          {CAPITULO.titulo}. {CAPITULO.autor}. Capítulo {CAPITULO.numero} del Manual SEEN, publicado
          el {CAPITULO.fechaFuente}.
        </p>
      </CabeceraEditorial>
      {ultimo && (
        <a
          href={ultimo.ruta}
          className="mb-5 flex min-h-11 items-center gap-2 rounded-[3px] border-l-4 bg-white px-3 py-2 text-sm shadow-soft sm:max-w-md"
          style={{ borderLeftColor: SEEN.azulOsc }}
        >
          <BookOpen size={15} className="shrink-0 text-slate-600" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Seguir leyendo
            </span>
            <span className="block truncate font-semibold text-slate-900">{ultimo.titulo}</span>
          </span>
          <ArrowRight size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
        </a>
      )}
      <section aria-labelledby="indice-apartados">
        <h2
          id="indice-apartados"
          className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 text-sm font-bold uppercase tracking-wide"
          style={{ color: hex.ink }}
        >
          Índice del capítulo
          {leidos.length > 0 && (
            <span className="text-xs font-semibold normal-case tracking-normal text-slate-500">
              Has leído {leidos.length} de {APARTADOS.length}
            </span>
          )}
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
                    {leidos.includes(a.slug) && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CircleCheck size={13} aria-hidden="true" /> Leído
                      </span>
                    )}
                  </span>
                </a>
              </Revelar>
            );
          })}
        </ol>
      </section>
      <section aria-labelledby="comprender" className="mt-8">
        <h2
          id="comprender"
          className="mb-2 text-sm font-bold uppercase tracking-wide"
          style={{ color: CATEGORIA_HEX.aprender.ink }}
        >
          Comprender y repasar
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {COMPRENDER.map((c) => {
            const d = destino(c.id);
            const I = d.icono;
            return (
              <li key={c.id}>
                <a
                  href={d.href}
                  className="hover-lift ease-brand flex h-full items-start gap-3 rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <I
                    size={18}
                    className="mt-0.5 shrink-0"
                    style={{ color: CATEGORIA_HEX[d.cat].strong }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900">{c.t}</span>
                    <span className="block text-xs text-slate-600">{c.s}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
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
            Los 13 apartados seguidos, para imprimir de una vez.
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
      </div>
    </div>
  );
}
