/* Índice del capítulo (lista de apartados con sus páginas) y «capítulo entero» para
   imprimir de una vez. */
import { useRef } from "react";
import { ArrowRight, CircleCheck, Printer } from "lucide-react";
import { APARTADOS, AUTOEVALUACION, CAPITULO, subapartados } from "../contenido";
import { href } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Revelar } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import { Bloques } from "../componentes/Bloques";
import { useLeidos } from "../prefs";

export function IndiceCapitulo() {
  const leidos = useLeidos();
  return (
    <div>
      <CabeceraEditorial titulo="Índice del capítulo" hex={CATEGORIA_HEX.leer} level={1}>
        <p className="text-sm text-slate-600">
          {CAPITULO.titulo}. {CAPITULO.autor}.
        </p>
      </CabeceraEditorial>
      <ol className="space-y-2">
        {APARTADOS.map((a) => {
          const subs = subapartados(a);
          return (
            <Revelar as="li" key={a.slug}>
              <a
                href={href("capitulo", a.slug)}
                className="hover-lift ease-brand flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e5ebf1" }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none w-8 shrink-0 text-2xl font-black leading-none tabular-nums"
                  style={{ color: `${CATEGORIA_HEX.leer.strong}55` }}
                >
                  {String(a.n).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-snug text-slate-900">
                    {a.titulo}
                  </span>
                  {subs.length > 0 && (
                    <span className="mt-1 block text-xs text-slate-500">
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
        <li>
          <a
            href={href("test")}
            className="flex items-start gap-3 rounded-2xl border border-dashed bg-white p-4 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#cbd5e1" }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none w-8 shrink-0 text-2xl font-black leading-none tabular-nums"
              style={{ color: `${CATEGORIA_HEX.aprender.strong}55` }}
            >
              14
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-slate-900">
                {AUTOEVALUACION.titulo}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Diez casos del autor con respuesta razonada y la página del capítulo (pendientes de
                su validación).
              </span>
            </span>
            <span className="pagina-badge shrink-0 pt-1">p. {AUTOEVALUACION.pagina}</span>
          </a>
        </li>
      </ol>
      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={href("bibliografia")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          Bibliografía (pp. 24–25) <ArrowRight size={14} aria-hidden="true" />
        </a>
        <a
          href={href("capitulo", "todo")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          <Printer size={14} aria-hidden="true" /> Capítulo entero (para imprimir)
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
          Manual SEEN · texto de la maquetación del {CAPITULO.fechaFuente}, con las correcciones
          editoriales aplicadas.
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
