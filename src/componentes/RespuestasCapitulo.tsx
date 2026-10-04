/* «Respuesta del capítulo»: lo que devuelve «Preguntas al capítulo» (respuestas.ts), arriba de
   los resultados de la búsqueda. Todo es texto literal del capítulo con su página; lo único de
   la app son los rótulos. Se usa en la paleta (compacta), en «¿Qué necesitas?» de la portada
   (compacta) y en la pantalla Buscar (con las otras respuestas). */
import { useId } from "react";
import { ArrowRight, Quote } from "lucide-react";
import { marcar, type Respuesta } from "../busqueda";
import { FIGURA3 } from "../contenido";
import { href } from "../rutas";

function Marcado({ texto, q }: { texto: string; q: string }) {
  return (
    <>
      {marcar(texto, q).map((t, i) =>
        t.hit ? (
          <mark key={i} className="resaltado">
            {t.t}
          </mark>
        ) : (
          <span key={i}>{t.t}</span>
        ),
      )}
    </>
  );
}

const paginas = (r: Respuesta) =>
  r.pagina2 && r.pagina2 !== r.pagina ? `pp. ${r.pagina}-${r.pagina2}` : `p. ${r.pagina}`;

const conAsterisco = (r: Respuesta) =>
  [r.texto, ...(r.items ?? []), ...(r.porSistema ?? []).map((s) => s.texto)].some((t) =>
    t.includes("*"),
  );

function Tarjeta({
  r,
  q,
  principal,
  compacta,
  onIr,
}: {
  r: Respuesta;
  q: string;
  principal?: boolean;
  compacta?: boolean;
  onIr?: () => void;
}) {
  // En una frase del texto, el título ya va en la fuente («Apartado 10 · Ejercicio físico»).
  const titulo = r.tipo === "texto" ? "" : r.titulo;
  const items = compacta && r.items && r.items.length > 5 ? r.items.slice(0, 5) : r.items;
  return (
    <div
      className={principal ? "" : "rounded-lg border bg-white p-3"}
      style={principal ? undefined : { borderColor: "#e6e6e6" }}
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
        <span className="font-semibold">{r.fuente}</span>
        {r.sistema && (
          <span className="rounded-full border border-slate-300 px-1.5 font-semibold text-slate-700">
            {r.sistema}
          </span>
        )}
        <span className="pagina-badge">{paginas(r)}</span>
      </p>
      {titulo && (
        <p className={`mt-1 font-bold text-slate-900 ${principal ? "text-base" : "text-sm"}`}>
          <Marcado texto={titulo} q={q} />
        </p>
      )}
      {r.contexto && (
        <p className="mt-1 text-sm text-slate-600">
          <Marcado texto={r.contexto} q={q} />
        </p>
      )}
      {r.texto && (
        <p
          className={`mt-1 text-slate-900 ${principal ? "text-[15px] leading-relaxed" : "text-sm"}`}
        >
          <Marcado texto={r.texto} q={q} />
        </p>
      )}
      {items && items.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-900">
          {items.map((it, i) => (
            <li key={i}>
              <Marcado texto={it} q={q} />
            </li>
          ))}
          {items !== r.items && <li className="list-none text-slate-500">…</li>}
        </ul>
      )}
      {r.partes && (
        <dl className="mt-1 space-y-1 text-sm">
          {r.partes.map((p) => (
            <div key={p.etiqueta}>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {p.etiqueta}
              </dt>
              <dd className="text-slate-900">
                <Marcado texto={p.texto} q={q} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {r.porSistema && (
        <dl className="mt-1 grid gap-1 text-sm sm:grid-cols-2">
          {r.porSistema.map((s) => (
            <div key={s.nombre} className="rounded-md bg-slate-50 px-2 py-1">
              <dt className="text-xs font-bold text-slate-600">{s.nombre}</dt>
              <dd className="whitespace-pre-line text-slate-900">
                <Marcado texto={s.texto} q={q} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {conAsterisco(r) && (
        <p className="mt-1 text-xs text-slate-600">
          {FIGURA3.notaAsterisco} <span className="pagina-badge">Figura 3, p. 8</span>
        </p>
      )}
      <a
        href={r.ruta}
        onClick={onIr}
        className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline"
      >
        Leer en su sitio <ArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}

export function RespuestasCapitulo({
  respuestas,
  q,
  compacta,
  onIr,
  nivel = 2,
}: {
  respuestas: Respuesta[];
  q: string;
  /* Paleta y portada: solo la primera, con enlace al resto en Buscar. */
  compacta?: boolean;
  onIr?: () => void;
  nivel?: 2 | 3;
}) {
  const id = useId();
  if (!respuestas.length) return null;
  const [r, ...otras] = respuestas;
  const H = `h${nivel}` as "h2" | "h3";
  return (
    <section
      aria-labelledby={id}
      className="mt-3 rounded-xl border-2 bg-white p-3 sm:p-4"
      style={{ borderColor: "#3f6e9f" }}
    >
      <H
        id={id}
        className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
        style={{ color: "#2f5680" }}
      >
        <Quote size={14} aria-hidden="true" /> Respuesta del capítulo
      </H>
      <Tarjeta r={r} q={q} principal compacta={compacta} onIr={onIr} />
      {compacta ? (
        <a
          href={href("buscar", q)}
          onClick={onIr}
          className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-600 hover:underline"
        >
          {otras.length > 0
            ? `Otras ${otras.length === 1 ? "respuesta" : `${otras.length} respuestas`} y todos los resultados`
            : "Todos los resultados"}
        </a>
      ) : (
        otras.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Otras respuestas
            </p>
            {otras.map((o) => (
              <Tarjeta key={o.id} r={o} q={q} onIr={onIr} />
            ))}
          </div>
        )
      )}
      <p className="mt-2 text-[11px] text-slate-500">
        Texto literal del capítulo elegido por coincidencia de palabras, sin inteligencia
        generativa. Si no es lo que buscas, mira los resultados de abajo.
      </p>
    </section>
  );
}
