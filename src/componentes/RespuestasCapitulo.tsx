/* «Pasaje del capítulo»: lo que devuelve «Preguntas al capítulo» (respuestas.ts), arriba de
   los resultados de la búsqueda. Todo es texto literal del capítulo con su página; lo único de
   la app son los rótulos. Se usa en la paleta (compacta), en «¿Qué necesitas?» de la portada
   (compacta) y en la pantalla Buscar (con las otras respuestas). */
import { useId } from "react";
import { ArrowRight, MessageCircleQuestion, Quote } from "lucide-react";
import { marcar, type Respuesta } from "../busqueda";
import type { RespuestaFrecuente } from "../respuestas";
import { FIGURA3, LISTA_TABLAS } from "../contenido";
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
  r.pagina2 && r.pagina2 !== r.pagina ? `pp. ${r.pagina}–${r.pagina2}` : `p. ${r.pagina}`;

/* La nota del asterisco es la de donde sale la respuesta: la de su tabla (la Tabla 1 marca los
   parámetros que mueve el modo automático) o, en la Figura 3, la de las dosis. */
function notaAsterisco(r: Respuesta): { nota: string; donde: string } | null {
  const textos = [
    r.titulo,
    r.texto,
    ...(r.items ?? []),
    ...(r.partes ?? []).map((p) => p.texto),
    ...(r.porSistema ?? []).map((s) => s.texto),
  ];
  if (!textos.some((t) => t.includes("*"))) return null;
  if (r.id.startsWith("F3/")) return { nota: FIGURA3.notaAsterisco, donde: "Figura 3, p. 8" };
  const t = LISTA_TABLAS.find((x) => x.id === r.id.split("/")[0]);
  const nota = t?.notas.find((n) => n.trimStart().startsWith("*"));
  // Las notas van al final de la tabla: su página es la última.
  return t && nota ? { nota, donde: `Tabla ${t.numero}, p. ${t.paginas[1]}` } : null;
}

function Tarjeta({
  r,
  q,
  principal,
  compacta,
  onIr,
  sinNota = false,
}: {
  r: Respuesta;
  q: string;
  principal?: boolean;
  compacta?: boolean;
  onIr?: () => void;
  /* La nota del asterisco ya se ha enseñado en un pasaje anterior del mismo bloque. */
  sinNota?: boolean;
}) {
  // En una frase del texto, el título ya va en la fuente («Apartado 10 · Ejercicio físico»).
  const titulo = r.tipo === "texto" ? "" : r.titulo;
  const asterisco = notaAsterisco(r);
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
          className={`mt-1 whitespace-pre-line text-slate-900 ${principal ? "text-[15px] leading-relaxed" : "text-sm"}`}
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
              <dd className="whitespace-pre-line text-slate-900">
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
      {asterisco && !sinNota && (
        <p className="mt-1 text-xs text-slate-600">
          {asterisco.nota} <span className="pagina-badge">{asterisco.donde}</span>
        </p>
      )}
      <a
        href={r.ruta}
        onClick={onIr}
        className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline"
      >
        {r.tipo === "texto"
          ? "Ver en el apartado"
          : r.tipo === "figura"
            ? "Ver la figura"
            : r.tipo === "tabla"
              ? r.sistema
                ? "Ver en la ficha del sistema"
                : "Ver la tabla"
              : "Ver en el apartado"}{" "}
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}

/* «Pregunta frecuente»: la pregunta revisada que se parece a la búsqueda, con sus pasajes. */
function BloqueFrecuente({
  frecuente,
  q,
  onIr,
  H,
  sinPregunta = false,
}: {
  frecuente: RespuestaFrecuente;
  q: string;
  onIr?: () => void;
  H: "h2" | "h3";
  /* En la pantalla de la pregunta, el título ya es la pregunta. */
  sinPregunta?: boolean;
}) {
  const id = useId();
  // La misma nota (p. ej. la del asterisco de la Tabla 1) se enseña una vez por bloque.
  const notasVistas = new Set<string>();
  return (
    <section
      aria-labelledby={id}
      className="mt-3 rounded-xl border-2 bg-white p-3 sm:p-4"
      style={{ borderColor: "#8E254E" }}
    >
      <H
        id={id}
        className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
        style={{ color: "#8E254E" }}
      >
        <MessageCircleQuestion size={14} aria-hidden="true" /> Pregunta frecuente
      </H>
      {!sinPregunta && (
        <p className="mb-2 text-base font-bold text-slate-900">{frecuente.pregunta}</p>
      )}
      <div className="space-y-2">
        {frecuente.respuestas.map((r) => {
          const nota = notaAsterisco(r)?.nota;
          const repetida = !!nota && notasVistas.has(nota);
          if (nota) notasVistas.add(nota);
          return <Tarjeta key={r.id} r={r} q={q} onIr={onIr} sinNota={repetida} />;
        })}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Pasajes del capítulo elegidos y revisados de antemano para esta pregunta.
      </p>
    </section>
  );
}

export function RespuestasCapitulo({
  respuestas,
  q,
  compacta,
  onIr,
  nivel = 2,
  frecuente,
  sinPregunta,
}: {
  respuestas: Respuesta[];
  q: string;
  /* Paleta y portada: solo la primera, con enlace al resto en Buscar. */
  compacta?: boolean;
  onIr?: () => void;
  nivel?: 2 | 3;
  /* Pregunta frecuente que se parece a la búsqueda: va primero. */
  frecuente?: RespuestaFrecuente | null;
  sinPregunta?: boolean;
}) {
  const id = useId();
  const H = `h${nivel}` as "h2" | "h3";
  // Con pregunta frecuente, el motor añade solo lo que ella no enseña.
  const yaVistos = new Set(frecuente?.respuestas.map((x) => x.id) ?? []);
  const resto = frecuente ? respuestas.filter((x) => !yaVistos.has(x.id)) : respuestas;
  if (frecuente && (compacta || !resto.length))
    return (
      <>
        <BloqueFrecuente frecuente={frecuente} q={q} onIr={onIr} H={H} sinPregunta={sinPregunta} />
        {compacta && (
          <a
            href={href("buscar", q)}
            onClick={onIr}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-600 hover:underline"
          >
            Más pasajes y todos los resultados
          </a>
        )}
      </>
    );
  if (!resto.length) return null;
  const [r, ...otras] = resto;
  const cercana = !!r.aproximada;
  const titulo = frecuente
    ? "Otros pasajes relacionados"
    : cercana
      ? "Coincidencia parcial en el capítulo"
      : "Pasaje del capítulo";
  return (
    <>
      {frecuente && (
        <BloqueFrecuente frecuente={frecuente} q={q} onIr={onIr} H={H} sinPregunta={sinPregunta} />
      )}
      <section
        aria-labelledby={id}
        className={`mt-3 rounded-xl bg-white p-3 sm:p-4 ${cercana ? "border border-dashed" : "border-2"}`}
        style={{ borderColor: cercana ? "#94a3b8" : "#3f6e9f" }}
      >
        <H
          id={id}
          className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
          style={{ color: cercana ? "#475569" : "#2f5680" }}
        >
          <Quote size={14} aria-hidden="true" /> {titulo}
        </H>
        {cercana && !frecuente && (
          <p className="mb-2 text-xs text-slate-600">
            Coincide solo con parte de la búsqueda: revisa su contexto antes de usarlo.
          </p>
        )}
        <Tarjeta r={r} q={q} principal compacta={compacta} onIr={onIr} />
        {compacta ? (
          <a
            href={href("buscar", q)}
            onClick={onIr}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-600 hover:underline"
          >
            {otras.length > 0
              ? `${otras.length === 1 ? "Otro pasaje" : `Otros ${otras.length} pasajes`} y todos los resultados`
              : "Todos los resultados"}
          </a>
        ) : (
          otras.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Otros pasajes relacionados
              </p>
              {otras.map((o) => (
                <Tarjeta key={o.id} r={o} q={q} onIr={onIr} />
              ))}
            </div>
          )
        )}
        <p className="mt-2 text-[11px] text-slate-500">
          Elegido por coincidencia de palabras: comprueba que responde a lo que buscas. Debajo,
          todos los resultados.
        </p>
      </section>
    </>
  );
}
