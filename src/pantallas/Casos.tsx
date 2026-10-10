/* Casos guiados (#/casos[/<id>]): practicar con el texto del capítulo, como pide el propio
   capítulo («practicarse con casos», p. 9). Cada caso: un escenario ficticio y varios pasos;
   en cada paso se elige una opción y se ve si es lo que indica el capítulo, con un comentario
   y las frases literales en las que se apoya, cada una con su página y su enlace. «Ver todo»
   muestra el caso entero de una vez (para revisarlo). Los datos vienen de casos.ts. */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { APARTADOS, FIGURA3, idDeBloque, rutaDeTabla, type TablaId } from "../contenido";
import { plano } from "../marcado";
import { frases } from "../frases";
import { CASOS, casoPorId, type Caso, type CitaCaso, type OpcionCaso } from "../casos";
import { href } from "../rutas";
import { CabeceraEditorial, PaginaBadge } from "../ui";
import { CATEGORIA_HEX } from "../tokens";

const hex = CATEGORIA_HEX.aprender;

const VEREDICTO: Record<OpcionCaso["tipo"], string> = {
  si: "Es lo que indica el capítulo.",
  no: "No es lo que indica el capítulo.",
  matiz: "Matiz: no es un error, pero no es lo que el capítulo pide en este punto.",
};
const COLOR: Record<OpcionCaso["tipo"], { borde: string; texto: string }> = {
  si: { borde: "#2f6b45", texto: "text-emerald-700" },
  no: { borde: "#a2412f", texto: "text-red-700" },
  matiz: { borde: "#8a5e10", texto: "text-amber-900" },
};
const letra = (i: number) => String.fromCharCode(97 + i) + ")";

/* Adónde lleva una cita: la frase exacta del capítulo (resaltada), la tabla en su sitio del
   capítulo o la Figura 3; si no se encuentra, el apartado de esa página. */
const limpio = (x: string) => x.replace(/\s+/g, " ").trim();
function destinoCita(c: CitaCaso): string | null {
  const tabla = /^Tabla (\d)/.exec(c.f);
  if (tabla)
    return rutaDeTabla(`T${tabla[1]}` as TablaId) ?? href("consultar", "tablas", `T${tabla[1]}`);
  if (c.f === "Figura 3") return href("consultar", "figura-3");
  const t = limpio(c.t);
  for (const a of APARTADOS)
    for (let i = 0; i < a.bloques.length; i++) {
      const b = a.bloques[i];
      if (b.t === "p") {
        const fs = frases(plano(b.texto));
        const k = fs.findIndex((f) => limpio(f).includes(t));
        if (k >= 0) return href("capitulo", a.slug, `${idDeBloque(b, i)}~${k}`);
        if (limpio(plano(b.texto)).includes(t)) return href("capitulo", a.slug, idDeBloque(b, i));
      } else if (b.t === "lista") {
        const k = b.items.findIndex((it) => limpio(plano(it)).includes(t));
        if (k >= 0) return href("capitulo", a.slug, `${idDeBloque(b, i)}~${k}`);
        if (b.intro && limpio(plano(b.intro)).includes(t))
          return href("capitulo", a.slug, idDeBloque(b, i));
      }
    }
  const a = APARTADOS.find((x) => c.p >= x.paginas[0] && c.p <= x.paginas[1]);
  return a ? href("capitulo", a.slug) : null;
}

function Citas({ citas, asterisco }: { citas: CitaCaso[]; asterisco?: boolean }) {
  if (!citas.length) return null;
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        Lo que dice el capítulo
      </p>
      <ul className="mt-1 space-y-1.5">
        {citas.map((c, i) => {
          const destino = destinoCita(c);
          return (
            <li
              key={i}
              className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-800"
              style={{ borderColor: "#e6e6e6" }}
            >
              <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                {c.f}
              </span>
              «{c.t}» <PaginaBadge p={c.p} />
              {destino && (
                <a
                  href={destino}
                  className="ml-2 inline-flex min-h-11 items-center gap-0.5 text-xs font-semibold text-slate-600 hover:underline sm:min-h-6"
                >
                  Ver <ArrowRight size={11} aria-hidden="true" />
                </a>
              )}
            </li>
          );
        })}
      </ul>
      {asterisco && (
        <p className="mt-1.5 text-xs text-slate-600">
          {FIGURA3.notaAsterisco} <PaginaBadge p={8} />
        </p>
      )}
    </div>
  );
}

function Respuesta({ o, id }: { o: OpcionCaso; id?: string }) {
  return (
    <div
      id={id}
      tabIndex={-1}
      className="rounded-xl border-l-4 bg-white p-3 shadow-soft focus:outline-none"
      style={{ borderLeftColor: COLOR[o.tipo].borde }}
    >
      <p className={`text-sm font-extrabold ${COLOR[o.tipo].texto}`}>{VEREDICTO[o.tipo]}</p>
      <p className="mt-1 text-sm text-slate-800">
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Comentario ·{" "}
        </span>
        {o.comentario}
      </p>
      <div className="mt-2">
        <Citas citas={o.citas} asterisco={o.asterisco} />
      </div>
    </div>
  );
}

function Escenario({ caso }: { caso: Caso }) {
  return (
    <section
      aria-labelledby="escenario"
      className="rounded-xl border bg-white p-4"
      style={{ borderColor: "#e6e6e6" }}
    >
      <h2
        id="escenario"
        className="text-[11px] font-bold uppercase tracking-wide"
        style={{ color: hex.ink }}
      >
        Escenario
      </h2>
      <p className="mt-1 text-[15px] leading-relaxed text-slate-800">{caso.escenario}</p>
    </section>
  );
}

/* Un caso, paso a paso (o entero con «Ver todo»). */
export function CasoVista({ caso, inicial = 0 }: { caso: Caso; inicial?: number }) {
  const [modo, setModo] = useState<"jugar" | "todo">("jugar");
  const [paso, setPaso] = useState(Math.min(Math.max(0, inicial), caso.pasos.length - 1));
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const pregunta = useRef<HTMLHeadingElement>(null);
  const final = useRef<HTMLHeadingElement>(null);
  const empezar = () => {
    setPaso(0);
    setElegida(null);
    setAciertos(0);
    setFin(false);
  };
  // El foco sigue el recorrido: a la respuesta al elegir, a la pregunta al pasar, al final.
  useEffect(() => {
    if (elegida !== null) document.getElementById("respuesta-caso")?.focus();
  }, [elegida]);
  useEffect(() => {
    if (paso > 0 && elegida === null) pregunta.current?.focus();
  }, [paso, elegida]);
  useEffect(() => {
    if (fin) final.current?.focus();
  }, [fin]);
  const p = caso.pasos[paso];
  const n = caso.pasos.length;
  return (
    <div className="space-y-4">
      <div
        className="inline-flex rounded-lg border bg-white p-1"
        role="group"
        aria-label="Modo"
        style={{ borderColor: "#e6e6e6" }}
      >
        {(
          [
            ["jugar", "Paso a paso"],
            ["todo", "Ver todo"],
          ] as const
        ).map(([m, t]) => (
          <button
            key={m}
            type="button"
            aria-pressed={modo === m}
            onClick={() => setModo(m)}
            className={`min-h-9 rounded-md px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${modo === m ? "text-white" : "text-slate-700"}`}
            style={modo === m ? { background: hex.strong } : undefined}
          >
            {t}
          </button>
        ))}
      </div>
      <Escenario caso={caso} />
      {modo === "todo" ? (
        <ol className="space-y-4">
          {caso.pasos.map((x, k) => (
            <li
              key={k}
              className="rounded-xl border bg-white p-4"
              style={{ borderColor: "#e6e6e6" }}
            >
              <p className="text-xs font-bold tabular-nums text-slate-500">
                Paso {k + 1} de {n}
              </p>
              {x.situacion && (
                <p
                  className="mt-1 rounded-lg px-3 py-2 text-sm text-slate-800"
                  style={{ background: hex.soft }}
                >
                  {x.situacion}
                </p>
              )}
              <h3 className="mt-2 text-base font-bold text-slate-900">{x.pregunta}</h3>
              <div className="mt-2 space-y-3">
                {x.opciones.map((o, i) => (
                  <div key={i}>
                    <p className="mb-1 text-sm text-slate-900">
                      <strong>{letra(i)}</strong> {o.texto}
                    </p>
                    <Respuesta o={o} />
                  </div>
                ))}
              </div>
            </li>
          ))}
          <li>
            <Cierre caso={caso} />
          </li>
        </ol>
      ) : fin ? (
        <section
          aria-labelledby="fin-caso"
          className="rounded-xl p-4"
          style={{ background: hex.soft }}
        >
          <h2
            id="fin-caso"
            ref={final}
            tabIndex={-1}
            className="text-base font-extrabold text-slate-900 focus:outline-none"
          >
            Fin del caso
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {aciertos} de {n} pasos a la primera.
          </p>
          <div className="mt-3">
            <Cierre caso={caso} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={empezar}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:border-slate-500"
            >
              <RotateCcw size={14} aria-hidden="true" /> Volver a empezar
            </button>
            <a
              href={href("casos")}
              className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-slate-700 hover:underline"
            >
              Otros casos <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : (
        <section
          aria-labelledby="pregunta-caso"
          className="rounded-xl border bg-white p-4"
          style={{ borderColor: "#e6e6e6" }}
        >
          <p className="text-xs font-bold tabular-nums text-slate-500">
            Paso {paso + 1} de {n}
          </p>
          {caso.id === "ejemplo-descarga" && (
            <a
              href={href("consultar", "descarga", String(paso + 1))}
              className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-600 hover:underline sm:min-h-6"
            >
              Este paso en «Revisar la descarga» <ArrowRight size={12} aria-hidden="true" />
            </a>
          )}
          {p.situacion && (
            <p
              className="mt-1 rounded-lg px-3 py-2 text-sm text-slate-800"
              style={{ background: hex.soft }}
            >
              {p.situacion}
            </p>
          )}
          <h2
            id="pregunta-caso"
            ref={pregunta}
            tabIndex={-1}
            className="mt-2 text-base font-bold text-slate-900 focus:outline-none"
          >
            {p.pregunta}
          </h2>
          <ol className="mt-2 space-y-2">
            {p.opciones.map((o, i) => {
              const mostrada = elegida !== null && (i === elegida || o.tipo === "si");
              return (
                <li key={i}>
                  <button
                    type="button"
                    aria-pressed={i === elegida}
                    onClick={() => {
                      if (elegida === null && o.tipo === "si") setAciertos((a) => a + 1);
                      setElegida(i);
                    }}
                    className="flex min-h-11 w-full items-start gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm text-slate-900 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    style={{
                      borderColor: mostrada ? COLOR[o.tipo].borde : "#d4d4d4",
                      borderWidth: mostrada ? 2 : 1,
                    }}
                  >
                    <span className="font-extrabold text-slate-500">{letra(i)}</span>
                    <span className="flex-1">{o.texto}</span>
                    {mostrada && o.tipo === "si" && (
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-700"
                        aria-label="Es lo que indica el capítulo"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          {elegida !== null && (
            <div className="mt-3 space-y-3">
              <Respuesta o={p.opciones[elegida]} id="respuesta-caso" />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (paso + 1 < n) {
                      setPaso(paso + 1);
                      setElegida(null);
                    } else setFin(true);
                  }}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white"
                  style={{ background: hex.strong }}
                >
                  {paso + 1 < n ? "Siguiente paso" : "Terminar el caso"}{" "}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
                <span className="text-xs text-slate-600">
                  Puedes tocar otra opción para ver su respuesta.
                </span>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Cierre({ caso }: { caso: Caso }) {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: "#e6e6e6" }}>
      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
        Para recordar
      </p>
      <p className="mt-1 text-sm text-slate-800">{caso.cierre.texto}</p>
      <div className="mt-2">
        <Citas citas={caso.cierre.citas} />
      </div>
    </div>
  );
}

function Nota() {
  return (
    <p className="text-xs text-slate-600">
      Personas ficticias y sin dosis calculadas. Cada respuesta se apoya en frases literales del
      capítulo, con su página; los escenarios y los comentarios son de la app.
    </p>
  );
}

export function Casos({ id, paso }: { id?: string; paso?: string }) {
  const caso = casoPorId(id);
  if (!CASOS.length)
    return (
      <div>
        <CabeceraEditorial titulo="Casos guiados" hex={hex} level={1} />
        <p className="text-sm text-slate-700">No hay casos guiados en esta edición.</p>
        <a
          href={href("capitulo")}
          className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
        >
          Leer capítulo <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
    );
  if (caso)
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <a
            href={href("casos")}
            className="inline-flex min-h-11 items-center font-semibold hover:underline"
          >
            Casos guiados
          </a>
          <span aria-hidden="true">›</span>
          <span>{caso.titulo}</span>
        </div>
        <CabeceraEditorial titulo={caso.titulo} hex={hex} level={1}>
          <p className="text-sm text-slate-600">
            {caso.sistema} · {caso.temas} · {caso.paginas}
          </p>
        </CabeceraEditorial>
        <Nota />
        <CasoVista key={`${caso.id}/${paso ?? ""}`} caso={caso} inicial={Number(paso) - 1 || 0} />
      </div>
    );
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Casos guiados" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          En cada paso se elige una opción y se ve lo que indica el capítulo, con sus frases
          literales. Personas ficticias, sin dosis calculadas.
        </p>
      </CabeceraEditorial>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CASOS.map((c) => (
          <li key={c.id}>
            <a
              href={href("casos", c.id)}
              className="hover-lift ease-brand flex h-full flex-col rounded-[4px] border bg-white p-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
              style={{ borderColor: "#e6e6e6" }}
            >
              <span className="text-[15px] font-bold leading-snug text-slate-900">{c.titulo}</span>
              <span className="mt-1 text-xs text-slate-600">
                {c.sistema} · {c.pasos.length} pasos · {c.paginas}
              </span>
              <span className="mt-2 text-xs text-slate-600">{c.temas}</span>
              <span
                className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold"
                style={{ color: hex.ink }}
              >
                Empezar <ArrowRight size={13} aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
