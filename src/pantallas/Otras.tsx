/* Buscar, Bibliografía, Sobre esta app, Autoevaluación y Preguntas frecuentes. */
import { Anuncio } from "../componentes/Anuncio";
import { guardarReciente } from "../prefs";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, ExternalLink, XCircle } from "lucide-react";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { FRECUENTES } from "../frecuentes";
import { BIBLIOGRAFIA, CAPITULO, apartadoPorSlug } from "../contenido";
import { BUILD } from "../build";
import { PREGUNTAS } from "../contenido/test";
import { elegirRuta, href } from "../rutas";
import { alCambiarConsulta, consultaBuscar, ponerConsulta } from "../consultaBuscar";
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
import { useRegistroSinRespuesta } from "../consultas";
import { AvisosBusqueda } from "../componentes/AvisosBusqueda";
import { RespuestasCapitulo } from "../componentes/RespuestasCapitulo";
import { RecursosPedidos } from "../componentes/RecursosPedidos";
import { Autocompletar } from "../componentes/Autocompletar";
import { SugerenciasBusqueda } from "../componentes/SugerenciasBusqueda";
import { SinResultados } from "../componentes/SinResultados";

const TIPO: Record<string, string> = {
  diagrama: "Diagrama",
  texto: "Texto",
  tabla: "Tabla",
  figura: "Figura",
  referencia: "Bibliografía",
  sigla: "Sigla",
  ampliacion: "Ampliación",
  pacientes: "Material para el paciente",
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
            className={`tarjeta block p-3 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 ${!fuera ? "" : r.entrada.tipo === "ampliacion" ? "border-violet-200 bg-violet-50" : r.entrada.tipo === "extendida" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}
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
            {/* En los accesos, solo el destino: su texto es el del índice (0.72.2). */}
            {!(fuera && (r.entrada.tipo === "atajo" || r.entrada.tipo === "diagrama")) && (
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
            )}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function Buscar({ inicial }: { inicial?: string }) {
  // Lo escrito vive en memoria (consultaBuscar.ts), no en la URL: al volver con Atrás desde un
  // resultado, la búsqueda sigue ahí, pero no queda en el historial ni en enlaces guardados.
  const [q, setQ] = useState(() => inicial ?? consultaBuscar());
  // Dirección antigua con el texto (#/buscar/<texto>): se toma una vez y se quita de la URL.
  useEffect(() => {
    if (inicial == null) return;
    ponerConsulta(inicial);
    setQ(inicial);
    elegirRuta("buscar");
  }, [inicial]);
  useEffect(() => alCambiarConsulta(() => setQ(consultaBuscar())), []);
  useEffect(() => ponerConsulta(q), [q]);
  // Pocos resultados al principio (los mejores); el resto, con «Ver más resultados».
  const [tope, setTope] = useState(12);
  useEffect(() => setTope(12), [q]);
  // El índice llega en su trozo (useBuscador): estas pantallas no lo cargan si no se busca.
  const { motor, estado, reintentar } = useBuscador(true);
  // «y en Omnipod 5» hereda el tema de la búsqueda anterior (seguimiento).
  const qEf = (motor && motor.consultaEfectiva(q)) || q;
  // 0.83.1 (séptima ronda, guardia): el seguimiento («y en Omnipod 5») vale dentro de una tanda de
  // búsquedas; al salir de Buscar se olvida el tema (antes duraba toda la sesión).
  useEffect(() => () => motor?.olvidarTema(), [motor]);
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
  // 0.80.1 (cuarta ronda, adjunto y R5): con un atajo de cambio de sistema o de objetivos de los
  // cuatro, sin las coincidencias parciales, los pasos de la descarga ni la pregunta frecuente que
  // solo casaban por «paso», «pasar» o «cuatro».
  const atajos = useMemo(
    () => (motor && qEf.trim().length >= 2 ? motor.recursosPedidos(qEf, res) : []),
    [motor, qEf, res],
  );
  const intencionClara = atajos.some((a) =>
    /^recurso\/(cambio|cambio-aid|objetivos|actua-automatico|frecuente)/.test(a.entrada.id),
  );
  const respuestas = useMemo(() => {
    const todos = motor && qEf.trim().length >= 2 ? motor.fusionar(qEf, parecidos) : [];
    const rs = intencionClara
      ? todos.filter((r) => !r.aproximada && !r.id.startsWith("T5/"))
      : todos;
    // 0.72.0: una sigla del glosario no va de pasaje principal si la consulta no la nombra
    // («cetonas» daba «β-OHB: β-hidroxibutirato»); pasa detrás. Solo cambia el orden.
    const nq = normalizar(qEf);
    if (rs.length > 1 && rs[0].tipo === "sigla" && !nq.includes(normalizar(rs[0].titulo)))
      return [...rs.slice(1), rs[0]];
    return rs;
  }, [motor, qEf, parecidos, intencionClara]);
  // 0.82.1 (sexta ronda, guardia): si un atajo pide una pregunta frecuente («ciq+»), se enseña
  // ya contestada (y el atajo, que la repetiría, no).
  const frecuente = useMemo(() => {
    if (!motor || qEf.trim().length < 2) return null;
    const pedida = atajos.find((a) => a.entrada.id.startsWith("recurso/frecuente/"));
    if (pedida) return motor.preguntaFrecuente(pedida.entrada.titulo);
    return intencionClara ? null : motor.preguntaFrecuente(qEf);
  }, [motor, qEf, intencionClara, atajos]);
  useEffect(() => {
    if (motor && (respuestas.length || frecuente)) motor.recordarTema(qEf);
    else if (motor && qEf === q && q.trim().length >= 3) motor.olvidarTema();
  }, [motor, q, qEf, respuestas, frecuente]);
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
        if (!mejor || mejor.duda === "parcial" || vistos.has(mejor.id))
          return { parte, respuestas: [] };
        return { parte, respuestas: rs.filter((r) => !vistos.has(r.id)).slice(0, 2) };
      })
      .filter((x) => x.respuestas.length > 0);
  }, [motor, qEf, todas]);
  // Respuesta parcial: lo que el capítulo no trata de la consulta («sauna» en «sauna con la
  // bomba»), dicho junto a lo que sí responde.
  const ajenas =
    motor && qEf.trim().length >= 2 && (respuestas.length || frecuente)
      ? motor.coberturaDe(qEf).ajenas
      : [];
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
  const sistemaQ = motor ? motor.sistemaNombrado(qEf) : -1;
  const relacionadas = motor
    ? motor.frecuentesRelacionadas(
        [...(frecuente?.respuestas ?? []), ...respuestas].map((r) => r.id),
        frecuente?.id,
        3,
        sistemaQ >= 0 ? sistemaQ : undefined,
      )
    : [];
  // Una respuesta de las Tablas 2 o 3 sigue en la tarea de Iniciar que la trabaja (si la
  // pregunta frecuente ya trae su continuación, esa manda).
  const continuacion =
    motor && respuestas[0] && !frecuente?.siguiente
      ? motor.continuacionDe(respuestas[0].id, sistemaQ)
      : null;
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
  const total = Math.max(res.length, busqueda.totalCapitulo + busqueda.totalFuera);
  return (
    <div>
      <CabeceraEditorial titulo="Buscar en el capítulo" hex={CATEGORIA_HEX.consultar} level={1} />
      <label className="sr-only" htmlFor="buscar-q">
        Texto a buscar
      </label>
      <input
        id="buscar-q"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar: cetonas, modo sueño, TBR…"
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E254E]"
        autoComplete="off"
      />
      {/* 0.72.0 (4.1.3): lo que ha encontrado, dicho al lector cuando se deja de escribir. */}
      <Anuncio
        texto={
          qEf.trim().length < 2 || estado !== "listo"
            ? ""
            : // 0.82.1 (sexta ronda, adjunto): la misma cifra que «Todos los resultados (N)».
              hayRespuesta
              ? total
                ? `Hay respuesta del capítulo y ${total} ${total === 1 ? "resultado más" : "resultados más"}.`
                : "Hay respuesta del capítulo."
              : total
                ? `${total} ${total === 1 ? "resultado" : "resultados"}.`
                : "Sin resultados."
        }
      />
      {q.trim().length < 2 && <SugerenciasBusqueda onElegir={setQ} />}
      {!frecuente && <Autocompletar items={sugerencias} onElegir={setQ} />}
      {/* 0.82.1 (sexta ronda, guardia): «ciq+» leído como «control-iq+» no es un seguimiento. */}
      {qEf !== q && qEf !== motor?.reescribir(q) && (
        <p className="mt-2 text-xs text-slate-600" role="status">
          Buscado junto con la consulta anterior: «{qEf}».{" "}
          <button
            type="button"
            onClick={() => {
              motor?.olvidarTema();
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
          <RecursosPedidos
            items={atajos.filter(
              (a) => !(frecuente && a.entrada.id === `recurso/frecuente/${frecuente.id}`),
            )}
          />
        )}
        {noCubierto && (
          <div
            role="status"
            className="tarjeta mt-3 border-2 px-3 py-2 text-sm text-slate-900"
            style={{ borderColor: "#8E254E" }}
          >
            <p className="font-semibold">El capítulo no trata {noCubierto}.</p>
            <p className="mt-1 text-slate-700">
              Sin información específica del sistema; texto general del capítulo que puede servir;
              no lo apliques como específico de {noCubierto}.
            </p>
          </div>
        )}
        {ajenas.length > 0 && !noCubierto && (
          <p role="status" className="tarjeta mt-3 px-3 py-2 text-sm text-slate-800">
            El capítulo no trata {ajenas.map((a) => `«${a}»`).join(", ")}. Lo que sigue responde al
            resto de la consulta.
          </p>
        )}
        {dato && (
          <p role="status" className="casilla mt-3 px-3 py-2 text-sm text-slate-900">
            <span className="font-semibold">
              {dato.sistema} · {dato.titulo}:
            </span>{" "}
            {dato.texto}{" "}
            <a href={dato.ruta} className="font-semibold underline underline-offset-2">
              Ver en la tabla
            </a>
          </p>
        )}
        <AvisosBusqueda
          q={qEf}
          parcial={busqueda.parcial && !intencionClara}
          primera={respuestas[0]}
        >
          <RespuestasCapitulo
            respuestas={respuestas}
            q={qEf}
            frecuente={frecuente}
            porId={motor?.respuestaPorId}
            contexto={motor?.contextoDe}
            relacionadas={relacionadas}
            sistema={sistemaQ >= 0 ? sistemaQ : undefined}
            continuacion={continuacion}
          />
        </AvisosBusqueda>
        {extras.map((x) => (
          <section key={x.parte} className="mt-3" aria-label={`También sobre ${x.parte}`}>
            <h2 className="rotulo">También sobre «{x.parte}»</h2>
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
            key={`${qEf}|${hayRespuesta}|${intencionClara}`}
            className="mt-4"
            // 0.81.1 (quinta ronda, adjunto): bajo un atajo de cambio de sistema o de objetivos,
            // la lista, plegada (casaba sobre todo por el nombre del sistema o por «pasar»).
            open={!hayRespuesta && !intencionClara}
            data-testid="todos-los-resultados"
          >
            <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-9">
              Todos los resultados (
              {Math.max(res.length, busqueda.totalCapitulo + busqueda.totalFuera)})
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
                  { id: "fuera", label: `Otros recursos (${fueraRes.length})` },
                ]}
              />
            </div>
            {activa === "texto" && <ListaResultados res={textoRes} q={qEf} />}
            {activa === "tablas" && <ListaResultados res={tablasRes} q={qEf} />}
            {activa === "fuera" && fueraRes.length > 0 && (
              <section aria-labelledby="fuera" className="mt-3">
                <h2 id="fuera" className="sr-only">
                  Otros recursos
                </h2>
                <ListaResultados res={fueraRes} q={q} fuera />
              </section>
            )}
            {hayMas && (
              <button
                type="button"
                onClick={() => setTope((t) => t + 48)}
                className="chip mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
      <CabeceraEditorial titulo="Bibliografía" hex={CATEGORIA_HEX.confiar} level={1} />
      <ol className="space-y-2">
        {BIBLIOGRAFIA.map((r) => (
          <Revelar
            as="li"
            key={r.n}
            id={`ref-${r.n}`}
            className={`tarjeta scroll-mt-4 p-3 ${destacada === `ref-${r.n}` ? "ring-2 ring-sky-300" : ""}`}
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
                    className="mt-1 inline-flex min-h-11 sm:min-h-7 items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    doi.org/{r.doi} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 sm:min-h-7 max-w-full items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    <span className="min-w-0 break-all">{r.url.replace(/^https?:\/\//, "")}</span>{" "}
                    <ExternalLink size={12} aria-hidden="true" />
                    <span className="font-normal text-slate-500">
                      (enlace añadido por el complemento)
                    </span>
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

/* ---------- Sobre este complemento: un párrafo (decisión del autor, 13-10-2026) y, plegados, los
   datos de esta versión y de cada material (trazabilidad) ---------- */
export function Sobre() {
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Sobre este complemento" hex={CATEGORIA_HEX.confiar} level={1} />
      <div className="prosa tarjeta p-4">
        {/* 13-10-2026 (0.64.0): más operativo, a petición del responsable: qué se puede hacer,
            con un enlace a cada tarea, y cómo está hecho en cuatro frases. El responsable, con su
            afiliación, en «Fuentes y revisión» (en la portada ya van su nombre y su afiliación). */}
        <div className="space-y-3 text-[15px] leading-relaxed">
          <p>
            Complemento interactivo del capítulo {CAPITULO.numero} del Manual SEEN sobre
            automatización de la insulinoterapia, para su uso en consulta.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              El contenido clínico es el texto del capítulo, con su página. Las preguntas
              frecuentes, la autoevaluación y las hojas adaptadas son materiales complementarios
              basados en él.
            </li>
            <li>
              La búsqueda funciona en el propio dispositivo: no se envía ni se guarda nada. Se puede
              consultar sin conexión una vez cargado.
            </li>
            <li>
              La ayuda de cálculo de «Iniciación del sistema» aplica las reglas de la Tabla 2 y del
              apartado 8 y unos puntos de partida del responsable de este complemento (no del Manual
              SEEN). Da un punto de partida para revisión profesional, no una pauta, y no guarda ni
              envía las cifras. No deben introducirse datos que identifiquen a una persona.
            </li>
            <li>
              No sustituye las instrucciones de cada sistema, los protocolos del centro ni el juicio
              clínico.
            </li>
          </ul>
          <p>
            <a
              href={CAPITULO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-slate-800 underline underline-offset-2 sm:min-h-8"
            >
              Ver el capítulo en el Manual SEEN
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </p>
        </div>
        {/* Fuentes y revisión, para el lector; las huellas completas, los commits y el registro
            de publicación están en la documentación técnica (docs/PUBLICACIONES.md) (V54-10). */}
        <details className="mt-3 text-sm" open>
          <summary className="min-h-11 cursor-pointer font-semibold text-slate-700 sm:min-h-8">
            Fuentes y revisión
          </summary>
          <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[12rem_1fr]">
            <dt className="font-semibold text-slate-700">Capítulo</dt>
            <dd>
              Publicado en el Manual SEEN el {BUILD.fuente.fecha} · ISBN {BUILD.fuente.isbn}
            </dd>
            <dt className="font-semibold text-slate-700">Información para pacientes</dt>
            <dd>PDF publicado, fechado el {BUILD.pacientes.fecha}</dd>
            <dt className="font-semibold text-slate-700">Responsable del complemento</dt>
            <dd>
              {CAPITULO.autor} · {CAPITULO.filiacion}
            </dd>
          </dl>
        </details>
        <p className="mt-3 text-xs text-slate-500">
          Versión {BUILD.version} · {BUILD.fecha || "—"} · id.{" "}
          <span className="font-mono">{BUILD.sha.slice(0, 12)}</span>
        </p>
      </div>
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
  // Al responder, la explicación a la vista (0.72.0: en el móvil quedaba debajo, fuera).
  const explicacion = useRef<HTMLDivElement>(null);
  return (
    <li className="tarjeta p-4">
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
                  requestAnimationFrame(() =>
                    explicacion.current?.scrollIntoView?.({ block: "nearest" }),
                  );
                }}
                // aria-disabled (no «disabled»): el botón pulsado conserva el foco al responder.
                aria-disabled={resuelta || undefined}
                aria-pressed={marcada}
                className={`flex min-h-11 w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 aria-disabled:cursor-default ${estilo}`}
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
      <div aria-live="polite" ref={explicacion} className="scroll-mb-24">
        {elegida != null && (
          <div className="animate-in mt-3 space-y-2">
            <div className="casilla p-3 text-sm">
              <p className="font-bold text-slate-900">
                {elegida === p.correcta ? "Correcto." : "Respuesta incorrecta."} Explicación:
              </p>
              <p className="mt-1 text-slate-800">{p.explicacion}</p>
            </div>
            <div className="tarjeta p-3 text-sm">
              <p className="rotulo text-slate-500">Lo que dice el capítulo</p>
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
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
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
      <CabeceraEditorial
        titulo="Autoevaluación complementaria basada en el capítulo"
        hex={CATEGORIA_HEX.aprender}
        level={1}
      />
      {pendientes > 0 && (
        <ToneCard tone="amber" title="Pendiente de validación" className="mb-4">
          <p className="text-sm text-slate-800">
            Las preguntas se escribieron en mayo de 2026 y se han comprobado contra el texto final
            del capítulo; falta su validación final. Si algo difiriera, se sigue el capítulo.
          </p>
        </ToneCard>
      )}
      {/* 0.72.0: el avance, pegado bajo la cabecera mientras se baja por las preguntas. */}
      <div className="separador barra-pegada sticky top-14 z-10 -mx-3 mb-3 border-b px-3 py-2 sm:mx-0 sm:rounded-lg sm:border lg:top-0">
        <p className="text-xs font-semibold text-slate-700" aria-live="polite">
          Respondidas {n} de {PREGUNTAS.length}
          {n > 0 ? ` · ${aciertos} ${aciertos === 1 ? "acierto" : "aciertos"}` : ""}
        </p>
        <div aria-hidden="true" className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(n / PREGUNTAS.length) * 100}%`,
              background: CATEGORIA_HEX.aprender.strong,
            }}
          />
        </div>
      </div>
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
          className="tarjeta mt-4 border-2 p-4"
          style={{ borderColor: CATEGORIA_HEX.aprender.strong }}
        >
          <h2 id="test-resultado" className="titulo-seccion">
            Resultado: {aciertos} de {PREGUNTAS.length}
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Revisar las respuestas incorrectas, con su explicación y su página.
          </p>
          <button
            type="button"
            onClick={empezarDeNuevo}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md px-4 text-sm font-bold text-white"
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
/* Los temas en su orden: los generales, «Uso habitual» y, al final, uno por sistema.
   Solo las preguntas aprobadas (FRECUENTES); las pendientes no salen. */
const TEMAS_SISTEMA = [
  "MiniMed 780G",
  "Tandem Control-IQ / Control-IQ+",
  "myLoop CamAPS FX",
  "Omnipod 5",
];
const TEMAS = [
  ...[...new Set(FRECUENTES.map((f) => f.tema))].filter(
    (t) => t !== "Uso habitual" && !TEMAS_SISTEMA.includes(t),
  ),
  "Uso habitual",
  ...TEMAS_SISTEMA,
].filter((t) => FRECUENTES.some((f) => f.tema === t));
const PRIMER_TEMA_SISTEMA = TEMAS.find((t) => TEMAS_SISTEMA.includes(t));

function IconoTema({ tema }: { tema: string }) {
  const k = TEMAS_SISTEMA.indexOf(tema);
  if (k >= 0)
    return (
      <img
        src={FOTO_SISTEMA[ORDEN_SISTEMAS[k]]}
        alt=""
        width={32}
        height={32}
        className="foto-sistema my-1.5 h-8 w-8 shrink-0 rounded-md bg-white object-cover"
      />
    );
  return null;
}

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
            <button type="button" onClick={reintentar} className="chip text-xs">
              Reintentar
            </button>
          </p>
        )}
        {/* En su pantalla, sin resaltar palabras (0.70.0). */}
        {r && <RespuestasCapitulo respuestas={[]} q="" frecuente={r} sinPregunta />}
        {hermanas.length > 0 && (
          <section aria-labelledby="mismo-tema" className="mt-6">
            <h2 id="mismo-tema" className="rotulo mb-2" style={{ color: hex.ink }}>
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
      <CabeceraEditorial titulo="Preguntas frecuentes" hex={hex} level={1} />
      {id && (
        <p role="status" className="mb-3 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          Esa pregunta no existe o no está en esta edición. Abajo, las preguntas revisadas.
        </p>
      )}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          aria-label="Filtrar preguntas"
          placeholder="Filtrar: cetonas, gestación, descarga…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E254E] sm:min-h-10 sm:max-w-md"
        />
        <button
          type="button"
          onClick={() => setTodas((v) => !v)}
          aria-pressed={todas}
          className="chip"
        >
          {todas ? "Plegar los temas" : "Ver todas las preguntas"}
        </button>
      </div>
      {filtradas && (
        <ul className="tarjeta filas" aria-label="Preguntas que coinciden">
          {filtradas.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-600">Ninguna pregunta contiene eso.</li>
          )}
          {filtradas.map((x) => (
            <li key={x.id}>
              <a
                href={href("preguntas", x.id)}
                className="fila font-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <span className="flex-1">{x.pregunta}</span>
                <span className="shrink-0 text-xs text-slate-500">{x.tema}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {/* 0.72.0: un icono por tema (la foto en los de sistema) y, en el ordenador, dos columnas. */}
      <div
        className={
          filtradas
            ? "hidden"
            : "grid gap-2 lg:block lg:columns-2 lg:gap-3 lg:[&>*]:mb-2 [&>*]:break-inside-avoid"
        }
      >
        {TEMAS.map((tema) => (
          <div key={tema}>
            {tema === PRIMER_TEMA_SISTEMA && (
              <h2 className="titulo-tarjeta mb-1.5 mt-4 lg:mt-0">Preguntas por sistema</h2>
            )}
            <details open={todas || undefined} className="tarjeta group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
                <IconoTema tema={tema} />
                <span className="flex-1">{tema}</span>
                <span className="insignia tabular-nums">
                  {FRECUENTES.filter((x) => x.tema === tema).length}
                </span>
                <ChevronDown
                  size={15}
                  className="text-slate-400 transition group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <ul className="filas separador border-t">
                {FRECUENTES.filter((x) => x.tema === tema).map((x) => (
                  <li key={x.id}>
                    <a
                      href={href("preguntas", x.id)}
                      className="fila font-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                      <span className="flex-1">{x.pregunta}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
