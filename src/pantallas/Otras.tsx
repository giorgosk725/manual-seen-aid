/* Buscar, Bibliografía, Sobre esta app, Autoevaluación y Preguntas frecuentes. */
import { guardarReciente } from "../prefs";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageCircleQuestion,
  XCircle,
} from "lucide-react";
import { FRECUENTES } from "../frecuentes";
import { BIBLIOGRAFIA, CAPITULO, apartadoPorSlug } from "../contenido";
import { CAMBIOS, VERSION_APP } from "../contenido/cambios";
import { PREGUNTAS } from "../contenido/test";
import { href } from "../rutas";
import { Badge, CabeceraEditorial, Revelar, Segmented, ToneCard } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import {
  fueraDelCapitulo,
  marcar,
  normalizar,
  paginaDe,
  type Busqueda,
  type Resultado,
} from "../busqueda";
import { useBuscador } from "../useBuscador";
import { useParecidos } from "../semantica";
import { URL_SIN_RESPUESTA, useRegistroSinRespuesta } from "../consultas";
import { AvisosBusqueda } from "../componentes/AvisosBusqueda";
import { RespuestasCapitulo } from "../componentes/RespuestasCapitulo";
import { RecursosPedidos } from "../componentes/RecursosPedidos";
import { Autocompletar } from "../componentes/Autocompletar";
import { SugerenciasBusqueda } from "../componentes/SugerenciasBusqueda";
import { SinResultados } from "../componentes/SinResultados";

const fecha = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const TIPO: Record<string, string> = {
  diagrama: "Diagrama",
  texto: "Texto",
  tabla: "Tabla",
  figura: "Figura",
  referencia: "Bibliografía",
  sigla: "Sigla",
  ampliacion: "Ampliación",
  pacientes: "Para el paciente",
  resumen: "Resumen del capítulo",
  test: "Autoevaluación",
  atajo: "Ir a",
  caso: "Caso guiado",
};

/* ---------- Buscar ---------- */

function ListaResultados({ res, q, fuera }: { res: Resultado[]; q: string; fuera?: boolean }) {
  return (
    <ol className="mt-3 space-y-2">
      {res.map((r) => (
        <li key={r.entrada.id}>
          <a
            href={r.entrada.ruta}
            className={`block rounded-xl border p-3 shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 ${!fuera ? "bg-white" : r.entrada.tipo === "ampliacion" ? "border-violet-200 bg-violet-50" : r.entrada.tipo === "extendida" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
            style={fuera ? undefined : { borderColor: "#e6e6e6" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <Badge
                  tone={
                    !fuera
                      ? "sky"
                      : r.entrada.tipo === "ampliacion"
                        ? "violet"
                        : r.entrada.tipo === "extendida"
                          ? "amber"
                          : "slate"
                  }
                >
                  {TIPO[r.entrada.tipo]}
                </Badge>
                <span className="font-semibold">{r.entrada.titulo}</span>
              </span>
              {r.entrada.pagina > 0 && <span className="pagina-badge">{paginaDe(r.entrada)}</span>}
            </div>
            <p className="mt-1 text-sm text-slate-800">
              {marcar(r.fragmento, q).map((t, i) =>
                t.hit ? (
                  <mark key={i} className="resaltado">
                    {t.t}
                  </mark>
                ) : (
                  <span key={i}>{t.t}</span>
                ),
              )}
            </p>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function Buscar({ inicial }: { inicial?: string }) {
  const [q, setQ] = useState(inicial ?? "");
  useEffect(() => {
    if (inicial != null) setQ(inicial);
  }, [inicial]);
  // Lo escrito se guarda en la URL (sin apilar historial): al volver con Atrás desde un
  // resultado, la búsqueda sigue ahí y el enlace se puede compartir.
  useEffect(() => {
    const t = setTimeout(() => {
      const destino = href("buscar", q || undefined);
      // Solo si se sigue en Buscar: si el lector ya ha abierto un resultado, no se le trae de vuelta.
      if (window.location.hash.startsWith("#/buscar") && window.location.hash !== destino)
        window.location.replace(destino);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);
  // Pocos resultados al principio (los mejores); el resto, con «Ver más resultados».
  const [tope, setTope] = useState(12);
  useEffect(() => setTope(12), [q]);
  // El índice llega en su trozo (useBuscador): estas pantallas no lo cargan si no se busca.
  const { motor, estado, reintentar } = useBuscador(true);
  // «y en Omnipod 5» hereda el tema de la búsqueda anterior (seguimiento).
  const qEf = (motor && motor.consultaEfectiva(q)) || q;
  // Con conexión, los pasajes parecidos por el sentido se funden con los de las palabras.
  const parecidos = useParecidos(qEf);
  const busqueda: Busqueda = useMemo(
    () =>
      motor && qEf.trim().length >= 2
        ? motor.buscarConTotales(qEf, tope, Math.round(tope / 3))
        : { resultados: [], totalCapitulo: 0, totalFuera: 0 },
    [motor, qEf, tope],
  );
  const res = busqueda.resultados;
  const respuestas = useMemo(
    () => (motor && qEf.trim().length >= 2 ? motor.fusionar(qEf, parecidos) : []),
    [motor, qEf, parecidos],
  );
  const frecuente = useMemo(
    () => (motor && qEf.trim().length >= 2 ? motor.preguntaFrecuente(qEf) : null),
    [motor, qEf],
  );
  useEffect(() => {
    if (motor && (respuestas.length || frecuente)) motor.recordarTema(qEf);
  }, [motor, qEf, respuestas, frecuente]);
  const todas = useMemo(
    () => [...(frecuente?.respuestas ?? []), ...respuestas],
    [frecuente, respuestas],
  );
  // Pregunta de cifra: la casilla breve de la tabla, en una línea encima de los pasajes.
  const dato = motor && todas.length ? motor.datoCorto(qEf, todas) : null;
  // Dos intenciones («hipoglucemia nocturna y comidas grasas»): lo que la segunda añade.
  const extras = useMemo(() => {
    const partes = motor && qEf.trim().length >= 2 ? motor.partesDe(qEf) : null;
    if (!motor || !partes) return [];
    const vistos = new Set(todas.map((r) => r.id));
    // Solo la parte cuya mejor respuesta no está ya arriba: si la principal ya la cubre, no se
    // repite el tema con otro párrafo.
    return partes
      .map((parte) => {
        const rs = motor.responder(parte).filter((r) => r.tipo !== "sigla");
        const mejor = rs[0];
        if (!mejor || mejor.aproximada || vistos.has(mejor.id)) return { parte, respuestas: [] };
        return { parte, respuestas: rs.filter((r) => !vistos.has(r.id)).slice(0, 2) };
      })
      .filter((x) => x.respuestas.length > 0);
  }, [motor, qEf, todas]);
  // Un sistema que el capítulo no trata (iLet, Diabeloop…): se dice antes de dar nada general.
  const noCubierto = motor && qEf.trim().length >= 2 ? motor.sistemaNoCubierto(qEf) : null;
  // Sin ningún pasaje ni pregunta frecuente (o sin respuesta específica): se registra (solo el
  // texto, consultas.ts).
  useRegistroSinRespuesta(
    qEf,
    estado === "listo" &&
      q.trim().length >= 4 &&
      (!!noCubierto || (!respuestas.length && !frecuente && !extras.length)),
    res.length > 0,
  );
  const sugerencias = motor && q.trim().length >= 3 ? motor.sugerir(q) : [];
  const relacionadas = motor
    ? motor.frecuentesRelacionadas(
        [...(frecuente?.respuestas ?? []), ...respuestas].map((r) => r.id),
        frecuente?.id,
      )
    : [];
  const cercanas = motor && !respuestas.length && !frecuente ? motor.faqsCercanas(parecidos) : [];
  // Recursos de la app (ampliación, hojas, casos, test, accesos): aparte del texto del capítulo.
  const esRecurso = (r: Resultado) =>
    fueraDelCapitulo(r.entrada) || r.entrada.tipo === "atajo" || r.entrada.tipo === "caso";
  const dentro = res.filter((r) => !esRecurso(r));
  const fueraRes = res.filter(esRecurso);
  // Pestañas por tipo de fuente: texto del capítulo · tablas y figuras · recursos de la app.
  const esTabla = (r: Resultado) =>
    ["tabla", "figura", "diagrama", "referencia"].includes(r.entrada.tipo);
  const textoRes = dentro.filter((r) => !esTabla(r));
  const tablasRes = dentro.filter(esTabla);
  const [pestana, setPestana] = useState<"texto" | "tablas" | "fuera">("texto");
  useEffect(() => setPestana("texto"), [q]);
  const activa =
    pestana === "texto" && !textoRes.length ? (tablasRes.length ? "tablas" : "fuera") : pestana;
  const hayMas = dentro.length < busqueda.totalCapitulo || fueraRes.length < busqueda.totalFuera;
  const hayRespuesta = !!frecuente || respuestas.length > 0 || extras.length > 0;
  return (
    <div>
      <CabeceraEditorial titulo="Buscar en el capítulo" hex={CATEGORIA_HEX.consultar} level={1}>
        <p className="text-sm text-slate-600">
          Escribe una duda con tus palabras: arriba, el pasaje que mejor la responde, con su página;
          debajo, el resto.
        </p>
      </CabeceraEditorial>
      <label className="sr-only" htmlFor="buscar-q">
        Texto a buscar
      </label>
      <input
        id="buscar-q"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca: cetonas 1,2, modo sueño, TBR…"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-soft placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        autoComplete="off"
      />
      {q.trim().length < 2 && <SugerenciasBusqueda onElegir={setQ} />}
      {!frecuente && <Autocompletar items={sugerencias} onElegir={setQ} />}
      {qEf !== q && (
        <p className="mt-2 text-xs text-slate-600" role="status">
          Entendido como «{qEf}».{" "}
          <button
            type="button"
            onClick={() => {
              motor?.recordarTema("");
              setQ(q + " ");
            }}
            className="font-semibold underline underline-offset-2"
          >
            Buscar solo «{q}»
          </button>
        </p>
      )}
      <div
        onClickCapture={(e) => {
          if ((e.target as HTMLElement).closest("a")) guardarReciente(q);
        }}
      >
        {motor && qEf.trim().length >= 2 && (
          <RecursosPedidos items={motor.recursosPedidos(qEf, res)} />
        )}
        {noCubierto && (
          <div
            role="status"
            className="mt-3 rounded-lg border-2 px-3 py-2 text-sm text-slate-900"
            style={{ borderColor: "#8E254E", background: "#fff" }}
          >
            <p className="font-semibold">El capítulo no trata {noCubierto}.</p>
            <p className="mt-1 text-slate-700">
              No hay información específica de ese sistema. Lo que sigue es lo general del capítulo
              que puede servir; no lo tomes como propio de {noCubierto}.
            </p>
          </div>
        )}
        {dato && (
          <p
            role="status"
            className="mt-3 rounded-lg border px-3 py-2 text-sm text-slate-900"
            style={{ borderColor: "#e3c7d3", background: "#f7eff3" }}
          >
            <span className="font-semibold">
              {dato.sistema} · {dato.titulo}:
            </span>{" "}
            {dato.texto}{" "}
            <a href={dato.ruta} className="font-semibold underline underline-offset-2">
              Ver en la tabla
            </a>
          </p>
        )}
        <AvisosBusqueda q={qEf} parcial={busqueda.parcial} primera={respuestas[0]}>
          <RespuestasCapitulo
            respuestas={respuestas}
            q={qEf}
            frecuente={frecuente}
            porId={motor?.respuestaPorId}
            contexto={motor?.contextoDe}
            relacionadas={relacionadas}
          />
        </AvisosBusqueda>
        {extras.map((x) => (
          <section key={x.parte} className="mt-3" aria-label={`También sobre ${x.parte}`}>
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">
              También sobre «{x.parte}»
            </h2>
            <RespuestasCapitulo
              respuestas={x.respuestas}
              q={x.parte}
              nivel={3}
              porId={motor?.respuestaPorId}
              contexto={motor?.contextoDe}
            />
          </section>
        ))}
        {estado === "error" && (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-700">
            No se pudo cargar el índice de búsqueda.
            <button
              type="button"
              onClick={reintentar}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold hover:border-slate-500"
            >
              Reintentar
            </button>
          </p>
        )}
        {q.trim().length >= 2 && estado !== "error" && estado !== "listo" && (
          <p className="mt-2 text-xs text-slate-500" aria-live="polite">
            Cargando el índice…
          </p>
        )}
        {estado === "listo" &&
          q.trim().length >= 2 &&
          res.length === 0 &&
          !respuestas.length &&
          !frecuente && <SinResultados q={q} cercanas={cercanas} />}
        {res.length > 0 && (
          /* Todos los resultados, plegados cuando ya hay una respuesta arriba (la clave hace que
             el pliegue se decida de nuevo con cada búsqueda). */
          <details
            key={`${qEf}|${hayRespuesta}`}
            className="mt-4"
            open={!hayRespuesta}
            data-testid="todos-los-resultados"
          >
            <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-9">
              Todos los resultados ({res.length}
              {hayMas ? ` de ${busqueda.totalCapitulo + busqueda.totalFuera}` : ""})
            </summary>
            <div className="mt-2">
              <Segmented
                label="Tipo de resultado"
                wrap
                value={activa}
                onChange={(v) => setPestana(v)}
                options={[
                  { id: "texto", label: `Texto del capítulo (${textoRes.length})` },
                  { id: "tablas", label: `Tablas y figuras (${tablasRes.length})` },
                  { id: "fuera", label: `Recursos de la app (${fueraRes.length})` },
                ]}
              />
            </div>
            {activa === "texto" && <ListaResultados res={textoRes} q={qEf} />}
            {activa === "tablas" && <ListaResultados res={tablasRes} q={qEf} />}
            {activa === "fuera" && fueraRes.length > 0 && (
              <section aria-labelledby="fuera" className="mt-3">
                <h2 id="fuera" className="sr-only">
                  Recursos de la app
                </h2>
                <p className="text-xs text-slate-600">
                  No es el texto del capítulo: accesos, ampliación técnica (en violeta), hojas para
                  el paciente, casos y test (en gris), cada entrada con su rótulo.
                </p>
                <ListaResultados res={fueraRes} q={q} fuera />
              </section>
            )}
            {hayMas && (
              <button
                type="button"
                onClick={() => setTope((t) => t + 48)}
                className="mt-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Ver más resultados
              </button>
            )}
          </details>
        )}
      </div>
    </div>
  );
}

/* ---------- Bibliografía ---------- */
export function Bibliografia({ destacada }: { destacada?: string }) {
  useEffect(() => {
    if (!destacada) return;
    document.getElementById(destacada)?.scrollIntoView({ block: "center" });
  }, [destacada]);
  return (
    <div>
      <CabeceraEditorial titulo="Bibliografía" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Las diez referencias del capítulo (pp. 24–25), tal como aparecen, con el DOI enlazado
          cuando lo tienen (y, si no, su dirección web).
        </p>
      </CabeceraEditorial>
      <ol className="space-y-2">
        {BIBLIOGRAFIA.map((r) => (
          <Revelar
            as="li"
            key={r.n}
            id={`ref-${r.n}`}
            className={`scroll-mt-24 rounded-xl border bg-white p-3 shadow-soft ${destacada === `ref-${r.n}` ? "ring-2 ring-sky-300" : ""}`}
          >
            <div className="flex gap-3">
              <span
                className="w-6 shrink-0 text-right text-sm font-extrabold tabular-nums"
                style={{ color: CATEGORIA_HEX.confiar.ink }}
              >
                {r.n}.
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{r.cita}</p>
                {r.doi ? (
                  <a
                    href={`https://doi.org/${r.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-7 items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    doi.org/{r.doi} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-7 max-w-full items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    <span className="min-w-0 break-all">{r.url.replace(/^https?:\/\//, "")}</span>{" "}
                    <ExternalLink size={12} aria-hidden="true" />
                    <span className="font-normal text-slate-500">(enlace añadido)</span>
                  </a>
                ) : (
                  <span className="mt-1 block text-xs text-slate-500">Sin DOI ni enlace.</span>
                )}
              </div>
            </div>
          </Revelar>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Sobre esta app: qué es y qué hay además del capítulo ---------- */
export function Sobre() {
  const ultimoCap = CAMBIOS.find((c) => c.ambito === "capitulo")!;
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Sobre esta app" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Versión {VERSION_APP} · capítulo publicado el {fecha(ultimoCap.fecha)}.
        </p>
      </CabeceraEditorial>
      <section
        className="prosa rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="s-que"
      >
        <h2 id="s-que" className="text-base font-extrabold text-slate-900">
          Qué es
        </h2>
        <p className="mt-2 text-sm">
          El capítulo «{CAPITULO.titulo}» ({CAPITULO.obra}, capítulo {CAPITULO.numero}), preparado
          para consultarlo en el día a día: por sistema, por situación o con el buscador, con el
          texto completo y la página de cada dato. Se instala como aplicación y funciona sin
          conexión.{" "}
          <a
            href={CAPITULO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-800 underline underline-offset-2"
          >
            Ver el capítulo en el Manual SEEN
          </a>
          .
        </p>
        <h2 className="mt-4 text-base font-extrabold text-slate-900">
          Qué hay además del capítulo
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Ampliación técnica</strong>, en cada ficha de sistema: datos de ficha técnica
            con sus fuentes y su fecha, rotulada «fuera del capítulo».
          </li>
          <li>
            <strong>Para el paciente</strong>: la información publicada, hojas breves, el plan de
            seguridad de cada sistema y hojas a partir de la Figura 3 y la Tabla 6.
          </li>
          <li>
            <strong>Casos guiados, preguntas frecuentes y autoevaluación</strong>: material de la
            app, revisado, que cita siempre la frase literal del capítulo con su página.
          </li>
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          No pide datos de pacientes: escribe las dudas sin ellos. Si una búsqueda se queda sin
          respuesta, se guarda su texto (recortado a 80 caracteres, sin correos, direcciones ni
          cifras largas) y cuántas veces se ha hecho, durante seis meses, sin fecha exacta ni ningún
          dato de quién la hizo, para mejorar el buscador. No sustituye la ficha técnica de cada
          sistema, los protocolos del centro ni el juicio clínico.
        </p>
      </section>
    </div>
  );
}

/* ---------- Consultas sin respuesta (#/sobre/consultas): la lista, con la clave ---------- */
interface ConsultaRegistrada {
  q: string;
  n: number;
  i: number;
  m: string;
}
export function ConsultasSinRespuesta() {
  const [clave, setClave] = useState(() => {
    try {
      return localStorage.getItem("mseen:clave") ?? "";
    } catch {
      return "";
    }
  });
  const [estado, setEstado] = useState<"inicial" | "cargando" | "error" | "listo">("inicial");
  const [filas, setFilas] = useState<ConsultaRegistrada[]>([]);
  const cargar = async () => {
    setEstado("cargando");
    try {
      localStorage.setItem("mseen:clave", clave);
    } catch {
      /* sin almacenamiento */
    }
    try {
      const r = await fetch(URL_SIN_RESPUESTA, { headers: { "X-Clave": clave } });
      if (!r.ok) throw new Error(String(r.status));
      const d = (await r.json()) as { consultas?: unknown };
      setFilas(Array.isArray(d.consultas) ? (d.consultas as ConsultaRegistrada[]) : []);
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  };
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Consultas sin respuesta" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Lo que se ha buscado sin encontrar ningún pasaje ni pregunta frecuente: el texto y las
          veces. Sirve para añadir equivalencias y preguntas frecuentes.
        </p>
      </CabeceraEditorial>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void cargar();
        }}
      >
        <label className="flex flex-col text-sm">
          <span className="text-xs font-semibold text-slate-600">Clave de lectura</span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="off"
            className="min-h-11 rounded-md border border-slate-300 px-3 text-base"
          />
        </label>
        <button
          type="submit"
          disabled={clave.length < 16 || estado === "cargando"}
          className="tap-44 rounded-md border border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50"
        >
          {estado === "cargando" ? "Cargando…" : "Ver la lista"}
        </button>
      </form>
      {estado === "error" && (
        <p role="alert" className="text-sm text-slate-700">
          No se pudo cargar: clave incorrecta o sin conexión.
        </p>
      )}
      {estado === "listo" && filas.length === 0 && (
        <p className="text-sm text-slate-700">Todavía no hay consultas registradas.</p>
      )}
      {filas.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-600">
              <th className="py-1 pr-2 font-semibold">Consulta</th>
              <th className="py-1 pr-2 text-right font-semibold">Veces</th>
              <th className="py-1 pr-2 text-right font-semibold">Con resultados</th>
              <th className="py-1 font-semibold">Último mes</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.q} className="border-t" style={{ borderColor: "#e6e6e6" }}>
                <td className="py-1.5 pr-2">
                  <a href={href("buscar", f.q)} className="underline underline-offset-2">
                    {f.q}
                  </a>
                </td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{f.n}</td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{f.i}</td>
                <td className="py-1.5 tabular-nums">{f.m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------- Autoevaluación ---------- */
function Pregunta({
  p,
  n,
  onResponder,
}: {
  p: (typeof PREGUNTAS)[number];
  n: number;
  onResponder: (acierto: boolean) => void;
}) {
  const [elegida, setElegida] = useState<number | null>(null);
  const ap = apartadoPorSlug(p.apartado);
  return (
    <li className="rounded-2xl border bg-white p-4 shadow-soft" style={{ borderColor: "#e6e6e6" }}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-bold">Pregunta {n}</span>
        {!p.validada && <Badge tone="amber">Pendiente de validación</Badge>}
      </div>
      <p className="mt-1 text-base font-semibold text-slate-900">{p.enunciado}</p>
      <ol className="mt-3 space-y-1.5">
        {p.opciones.map((o, i) => {
          const esCorrecta = i === p.correcta;
          const marcada = elegida === i;
          const resuelta = elegida != null;
          let estilo = "border-slate-300 bg-white hover:border-slate-400";
          if (resuelta && esCorrecta) estilo = "border-emerald-400 bg-emerald-50";
          else if (resuelta && marcada) estilo = "border-red-400 bg-red-50";
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  if (resuelta) return;
                  setElegida(i);
                  onResponder(esCorrecta);
                }}
                // aria-disabled (no «disabled»): el botón pulsado conserva el foco al responder.
                aria-disabled={resuelta || undefined}
                aria-pressed={marcada}
                className={`flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 aria-disabled:cursor-default ${estilo}`}
              >
                <span className="w-5 shrink-0 font-bold text-slate-500">
                  {String.fromCharCode(97 + i)})
                </span>
                <span className="flex-1">{o}</span>
                {resuelta && esCorrecta && (
                  <CheckCircle2 size={16} className="text-emerald-700" aria-label="Correcta" />
                )}
                {resuelta && marcada && !esCorrecta && (
                  <XCircle size={16} className="text-red-700" aria-label="Incorrecta" />
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {/* Región viva montada desde el principio: así se anuncia la explicación al responder. */}
      <div aria-live="polite">
        {elegida != null && (
          <div className="animate-in mt-3 space-y-2">
            <div className="rounded-xl p-3 text-sm" style={{ background: "#eef3f8" }}>
              <p className="font-bold text-slate-900">
                {elegida === p.correcta ? "Correcto." : "Respuesta incorrecta."} Explicación:
              </p>
              <p className="mt-1 text-slate-800">{p.explicacion}</p>
            </div>
            <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "#e6e6e6" }}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Lo que dice el capítulo
              </p>
              <ul className="mt-1.5 space-y-1.5">
                {p.citas.map((c, i) => (
                  <li key={i} className="text-slate-800">
                    «{c.texto}»{" "}
                    <a
                      href={href("capitulo", c.apartado, c.ancla)}
                      className="pagina-badge whitespace-nowrap hover:underline"
                    >
                      p. {c.p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={href("capitulo", p.apartado, p.ancla)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Leer en el apartado {ap?.n}: {ap?.titulo} (p. {p.pagina}){" "}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </li>
  );
}

export function Test() {
  const pendientes = PREGUNTAS.filter((p) => !p.validada).length;
  // Cada intento es un juego nuevo de preguntas (clave), con su recuento de aciertos.
  const [intento, setIntento] = useState(0);
  const [hechas, setHechas] = useState<Record<string, boolean>>({});
  const n = Object.keys(hechas).length;
  const aciertos = Object.values(hechas).filter(Boolean).length;
  const empezarDeNuevo = () => {
    setHechas({});
    setIntento((x) => x + 1);
    window.scrollTo({ top: 0 });
  };
  return (
    <div>
      <CabeceraEditorial titulo="Autoevaluación" hex={CATEGORIA_HEX.aprender} level={1}>
        <p className="text-sm text-slate-600">
          Diez preguntas; al responder, la explicación y las frases del capítulo que la respaldan.
          Para las cifras y las siglas,{" "}
          <a href={href("repaso")} className="font-semibold text-slate-800 underline">
            tarjetas de repaso
          </a>
          .
        </p>
      </CabeceraEditorial>
      {pendientes > 0 && (
        <ToneCard tone="amber" title="Pendiente de validación" className="mb-4">
          <p className="text-sm text-slate-800">
            Las preguntas se escribieron en mayo de 2026 y se han comprobado contra el texto final
            del capítulo; falta su validación final. Si algo difiriera, se sigue el capítulo.
          </p>
        </ToneCard>
      )}
      <p className="mb-2 text-xs text-slate-600" aria-live="polite">
        Respondidas {n} de {PREGUNTAS.length}
        {n > 0 ? ` · ${aciertos} ${aciertos === 1 ? "acierto" : "aciertos"}` : ""}
      </p>
      <ol className="space-y-3" key={intento}>
        {PREGUNTAS.map((p, i) => (
          <Pregunta
            key={p.id}
            p={p}
            n={i + 1}
            onResponder={(acierto) => setHechas((h) => ({ ...h, [p.id]: acierto }))}
          />
        ))}
      </ol>
      {n === PREGUNTAS.length && (
        <section
          aria-labelledby="test-resultado"
          className="mt-4 rounded-2xl border-2 bg-white p-4"
          style={{ borderColor: CATEGORIA_HEX.aprender.strong }}
        >
          <h2 id="test-resultado" className="text-base font-extrabold text-slate-900">
            Resultado: {aciertos} de {PREGUNTAS.length}
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Repasa las que fallaste con su explicación y su página; las cifras y las siglas se
            afianzan mejor con las{" "}
            <a href={href("repaso")} className="font-semibold text-slate-800 underline">
              tarjetas de repaso
            </a>
            .
          </p>
          <button
            type="button"
            onClick={empezarDeNuevo}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-4 text-sm font-bold text-white"
            style={{ background: CATEGORIA_HEX.aprender.strong }}
          >
            Volver a empezar
          </button>
        </section>
      )}
    </div>
  );
}

/* ---------- Preguntas frecuentes por temas (#/preguntas[/<id>]) ----------
   El camino cuando la búsqueda libre no da nada: las preguntas revisadas, agrupadas por tema;
   cada una abre sus pasajes literales con el mismo bloque que en la búsqueda. */
const TEMAS = [...new Set(FRECUENTES.map((f) => f.tema))];

export function Preguntas({ id }: { id?: string }) {
  const { motor, estado, reintentar } = useBuscador(true);
  const [todas, setTodas] = useState(false);
  const [filtro, setFiltro] = useState("");
  const nf = normalizar(filtro).trim();
  const filtradas =
    nf.length >= 2
      ? FRECUENTES.filter((x) =>
          [x.pregunta, ...x.variantes].some((t) => normalizar(t).includes(nf)),
        )
      : null;
  const f = FRECUENTES.find((x) => x.id === id);
  const hex = CATEGORIA_HEX.consultar;
  if (f) {
    const r = motor?.respuestaDeFrecuente(f.id) ?? null;
    const hermanas = FRECUENTES.filter((x) => x.tema === f.tema && x.id !== f.id);
    return (
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <a
            href={href("preguntas")}
            className="inline-flex min-h-11 items-center font-semibold hover:underline"
          >
            Preguntas frecuentes
          </a>
          <span aria-hidden="true">›</span>
          <span>{f.tema}</span>
        </div>
        <CabeceraEditorial titulo={f.pregunta} hex={hex} level={1} />
        {estado === "cargando" && <p className="text-sm text-slate-600">Cargando los pasajes…</p>}
        {estado === "error" && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            No se han podido cargar los pasajes.
            <button
              type="button"
              onClick={reintentar}
              className="inline-flex min-h-9 items-center rounded-md border border-slate-300 px-2 text-xs font-semibold hover:border-slate-500"
            >
              Reintentar
            </button>
          </p>
        )}
        {r && <RespuestasCapitulo respuestas={[]} q={f.pregunta} frecuente={r} sinPregunta />}
        {hermanas.length > 0 && (
          <section aria-labelledby="mismo-tema" className="mt-6">
            <h2
              id="mismo-tema"
              className="mb-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              Del mismo tema
            </h2>
            <ul className="space-y-1">
              {hermanas.map((x) => (
                <li key={x.id}>
                  <a
                    href={href("preguntas", x.id)}
                    className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
                  >
                    {x.pregunta}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }
  return (
    <div>
      <CabeceraEditorial titulo="Preguntas frecuentes" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          {FRECUENTES.length} preguntas, por temas; cada una abre los pasajes del capítulo que la
          responden.
        </p>
      </CabeceraEditorial>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          aria-label="Filtrar preguntas"
          placeholder="Filtrar: cetonas, gestación, descarga…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-10 sm:max-w-md"
        />
        <button
          type="button"
          onClick={() => setTodas((v) => !v)}
          aria-pressed={todas}
          className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-500 sm:min-h-9"
        >
          {todas ? "Plegar los temas" : "Ver todas las preguntas"}
        </button>
      </div>
      {filtradas && (
        <ul
          className="divide-y rounded-xl border bg-white"
          style={{ borderColor: "#e6e6e6" }}
          aria-label="Preguntas que coinciden"
        >
          {filtradas.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-600">Ninguna pregunta contiene eso.</li>
          )}
          {filtradas.map((x) => (
            <li key={x.id}>
              <a
                href={href("preguntas", x.id)}
                className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <span className="flex-1">{x.pregunta}</span>
                <span className="shrink-0 text-xs text-slate-500">{x.tema}</span>
                <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className={filtradas ? "hidden" : "space-y-2"}>
        {TEMAS.map((tema) => (
          <details
            key={tema}
            open={todas || undefined}
            className="group rounded-xl border bg-white"
            style={{ borderColor: "#e6e6e6" }}
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
              <MessageCircleQuestion size={15} aria-hidden="true" style={{ color: hex.strong }} />
              <span className="flex-1">{tema}</span>
              <span className="text-xs font-semibold text-slate-500">
                {FRECUENTES.filter((x) => x.tema === tema).length}
              </span>
              <ArrowRight
                size={14}
                className="text-slate-400 transition group-open:rotate-90"
                aria-hidden="true"
              />
            </summary>
            <ul className="divide-y border-t" style={{ borderColor: "#e6e6e6" }}>
              {FRECUENTES.filter((x) => x.tema === tema).map((x) => (
                <li key={x.id}>
                  <a
                    href={href("preguntas", x.id)}
                    className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    <span className="flex-1">{x.pregunta}</span>
                    <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
