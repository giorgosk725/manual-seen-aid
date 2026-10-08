/* Buscar, Bibliografía, Qué ha cambiado, Sobre esta versión, Autoevaluación y «Más» (móvil). */
import { guardarReciente } from "../prefs";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink, Moon, Sun, XCircle } from "lucide-react";
import { BIBLIOGRAFIA, CAPITULO, apartadoPorSlug } from "../contenido";
import { CAMBIOS, PENDIENTES, VERSION_APP } from "../contenido/cambios";
import { PREGUNTAS } from "../contenido/test";
import { DESTINOS } from "../nav";
import { href } from "../rutas";
import { Badge, CabeceraEditorial, Revelar, ToneCard } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import { fueraDelCapitulo, marcar, paginaDe, type Busqueda, type Resultado } from "../busqueda";
import { useBuscador } from "../useBuscador";
import { AvisosBusqueda } from "../componentes/AvisosBusqueda";
import { RespuestasCapitulo } from "../componentes/RespuestasCapitulo";
import { SugerenciasBusqueda } from "../componentes/SugerenciasBusqueda";
import { SinResultados } from "../componentes/SinResultados";
import { GuiaDeUso } from "../componentes/Bienvenida";
import { useNocturno } from "../prefs";

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
  extendida: "Versión extendida",
  ampliacion: "Ampliación",
  pacientes: "Para el paciente",
  test: "Autoevaluación",
  atajo: "Ir a",
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
      if (window.location.hash !== destino) window.location.replace(destino);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);
  // Pocos resultados al principio (los mejores); el resto, con «Ver más resultados».
  const [tope, setTope] = useState(12);
  useEffect(() => setTope(12), [q]);
  // El índice llega en su trozo (useBuscador): estas pantallas no lo cargan si no se busca.
  const { motor, estado, reintentar } = useBuscador(true);
  const busqueda: Busqueda = useMemo(
    () =>
      motor && q.trim().length >= 2
        ? motor.buscarConTotales(q, tope, Math.round(tope / 3))
        : { resultados: [], totalCapitulo: 0, totalFuera: 0 },
    [motor, q, tope],
  );
  const res = busqueda.resultados;
  const respuestas = useMemo(
    () => (motor && q.trim().length >= 2 ? motor.responder(q) : []),
    [motor, q],
  );
  const dentro = res.filter((r) => !fueraDelCapitulo(r.entrada));
  const fueraRes = res.filter((r) => fueraDelCapitulo(r.entrada));
  const hayMas = dentro.length < busqueda.totalCapitulo || fueraRes.length < busqueda.totalFuera;
  return (
    <div>
      <CabeceraEditorial titulo="Buscar en el capítulo" hex={CATEGORIA_HEX.consultar} level={1}>
        <p className="text-sm text-slate-600">
          Busca con tus palabras: arriba, el pasaje del capítulo que mejor encaja, con su página;
          debajo, los demás resultados.
        </p>
        <details className="mt-1 text-sm text-slate-600">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-slate-700 sm:min-h-8">
            Cómo funciona
          </summary>
          <p className="mt-1">
            Por ejemplo «cetonas 1,2», «modo ejercicio en Control-IQ» o «cuánto tiempo puedo estar
            desconectado». Arriba, la frase, la fila de tabla o el tramo de la Figura 3 que mejor
            encaja, literal y con su página; si solo coincide en parte, se rotula «coincidencia
            parcial». Debajo, los primeros sitios donde salen esas palabras (el resto, con «Ver más
            resultados») y, aparte, lo que no es del capítulo (versión extendida, ampliación
            técnica, hojas para el paciente y test). El pasaje se elige por coincidencia de
            palabras: comprueba siempre que responde a lo que buscas.
          </p>
        </details>
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
      <div
        onClickCapture={(e) => {
          if ((e.target as HTMLElement).closest("a")) guardarReciente(q);
        }}
      >
        <AvisosBusqueda q={q} parcial={busqueda.parcial} primera={respuestas[0]}>
          <RespuestasCapitulo respuestas={respuestas} q={q} />
        </AvisosBusqueda>
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
        {q.trim().length >= 2 && estado !== "error" && (
          <p className="mt-2 text-xs text-slate-500" aria-live="polite">
            {estado !== "listo"
              ? "Cargando el índice…"
              : res.length === 0
                ? ""
                : `${busqueda.totalCapitulo} en el capítulo${dentro.length < busqueda.totalCapitulo ? ` (se ven ${dentro.length})` : ""} · ${busqueda.totalFuera} fuera del capítulo${fueraRes.length < busqueda.totalFuera ? ` (se ven ${fueraRes.length})` : ""}`}
          </p>
        )}
        {estado === "listo" && q.trim().length >= 2 && res.length === 0 && !respuestas.length && (
          <SinResultados />
        )}
        <ListaResultados res={dentro} q={q} />
        {fueraRes.length > 0 && (
          <section aria-labelledby="fuera" className="mt-6">
            <h2 id="fuera" className="text-sm font-bold text-amber-900">
              Fuera del capítulo · versión extendida, ampliación técnica, hojas para el paciente y
              test
            </h2>
            <p className="text-xs text-slate-600">
              No es el texto del capítulo: material complementario, cada capa con su rótulo (versión
              extendida en ámbar, ampliación en violeta, hojas para el paciente y test en gris).
            </p>
            <ListaResultados res={fueraRes} q={q} fuera />
          </section>
        )}
      </div>
      {hayMas && (
        <button
          type="button"
          onClick={() => setTope((t) => t + 48)}
          className="mt-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          Ver más resultados
        </button>
      )}
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
                    className="mt-1 inline-flex min-h-6 items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    doi.org/{r.doi} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-6 max-w-full items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
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

/* ---------- Qué ha cambiado ---------- */
/* Línea de tiempo de cambios (capítulo o app). */
function LineaCambios({ cambios }: { cambios: typeof CAMBIOS }) {
  return (
    <ol className="relative space-y-4 border-l-2 pl-5" style={{ borderColor: "#e6e6e6" }}>
      {cambios.map((c, i) => (
        <Revelar as="li" key={i} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white"
            style={{
              background:
                c.ambito === "capitulo" ? CATEGORIA_HEX.leer.strong : CATEGORIA_HEX.confiar.strong,
            }}
          />
          <div className="rounded-[4px] border bg-white p-3" style={{ borderColor: "#e6e6e6" }}>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <Badge tone={c.ambito === "capitulo" ? "sky" : "emerald"}>
                {c.ambito === "capitulo" ? "Capítulo" : "App"}
              </Badge>
              <time dateTime={c.fecha}>{fecha(c.fecha)}</time>
            </div>
            <h3 className="mt-1 text-sm font-bold text-slate-900">{c.titulo}</h3>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {c.detalle.map((d, j) => (
                <li key={j}>{d}</li>
              ))}
            </ul>
          </div>
        </Revelar>
      ))}
    </ol>
  );
}

/* Primero lo clínico (cambios del capítulo) y lo pendiente; después, las versiones de la app. */
export function Cambios() {
  const delCapitulo = CAMBIOS.filter((c) => c.ambito === "capitulo");
  const deLaApp = CAMBIOS.filter((c) => c.ambito !== "capitulo");
  return (
    <div>
      <CabeceraEditorial titulo="Qué ha cambiado" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Primero, los cambios del texto del capítulo y lo que aún está pendiente; después, cada
          versión de la app, con su fecha.
        </p>
      </CabeceraEditorial>
      <section aria-labelledby="cambios-capitulo">
        <h2
          id="cambios-capitulo"
          className="mb-3 font-display text-base font-medium uppercase tracking-[0.04em] text-slate-800"
        >
          Cambios del capítulo
        </h2>
        <LineaCambios cambios={delCapitulo} />
        <ToneCard tone="amber" title="Pendiente" className="mt-3">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
            {PENDIENTES.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </ToneCard>
      </section>
      <section aria-labelledby="cambios-app" className="mt-8">
        <h2
          id="cambios-app"
          className="mb-3 font-display text-base font-medium uppercase tracking-[0.04em] text-slate-800"
        >
          Versiones de la app
        </h2>
        <LineaCambios cambios={deLaApp.slice(0, 3)} />
        {deLaApp.length > 3 && (
          <details className="mt-4">
            <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-slate-700">
              Versiones anteriores ({deLaApp.length - 3})
            </summary>
            <div className="mt-3">
              <LineaCambios cambios={deLaApp.slice(3)} />
            </div>
          </details>
        )}
      </section>
    </div>
  );
}

/* ---------- Sobre esta versión ---------- */
/* Anotadas en la maquetación del 5-10-2026; la editorial aún no las ha pasado. */
const CORRECCIONES_FINALES = [
  "Final 1/3 (p. 4, Tabla 1, Control-IQ+): «peso 9–200 kg, DTD 5–200 UI/día».",
  "Final 2/3 (p. 15, Resolución de incidencias): con iSGLT2 ya no se rebaja el umbral a 200 mg/dl; «debe mantenerse una alta sospecha de cetoacidosis y medirse la cetonemia ante síntomas o situaciones de riesgo, con independencia del nivel de glucemia».",
  "Final 3/3 (p. 25, bibliografía): «doi:10.2337/dci26-0122» al final de la referencia 6.",
];

/* Las 11 del 30-9-2026: la maquetación del 5-10-2026 ya las trae. */
const CORRECCIONES = [
  "1/11 (p. 3): «control predictivo basado en modelo (MPC) y lógica difusa».",
  "2/11 (pp. 3–4): «Sistemas AID comercializados en España» en el texto y en el título de la Tabla 1.",
  "3/11 (p. 4, Tabla 1): indicación de Omnipod 5 «≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día».",
  "4/11 (p. 5): sin guion tras «Omnipod 5».",
  "5/11 (p. 8, Figura 3): cabecera de la columna amarilla «β-OHB 0,6-0,9 mmol/l»; nota al pie de las dosis con asterisco; «Precisan atención urgente» en negrita; «iSGLT2»; acentos y «β-OHB» unificado.",
  "6/11 (p. 11, Tabla 3): modo ejercicio «140–160 mg/dl».",
  "7/11 (p. 11, Tabla 4): fila «Ejercicio anaeróbico o de alta intensidad» reconstruida como fila normal con una celda común a los cuatro sistemas.",
  "8/11 (p. 21, Tabla 6): «Tomografía computarizada (TC)».",
  "9/11 (p. 24, infografía): «En modalidades híbridas»; «Requieren anuncio de comidas y bolo prandial»; «DM1»; «Mejora consistente del control glucémico con buen perfil de seguridad»; «Bomba de insulina o pod»; «Iniciar».",
  "10/11 (pp. 24–25, bibliografía): referencia 6 completa (Holt RIG et al., Diabetes Care 2026); el DOI es la corrección final 3/3.",
  "11/11 (encabezado gráfico de todas las páginas): no afecta al texto; no aplica a la app.",
];

export function Sobre() {
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Sobre esta versión" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Manual SEEN · AID {VERSION_APP}. Qué es, de dónde sale el texto y qué incluye.
        </p>
      </CabeceraEditorial>
      <section
        className="rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="s-uso"
      >
        <h2 id="s-uso" className="mb-3 text-base font-extrabold text-slate-900">
          Guía rápida
        </h2>
        <GuiaDeUso />
      </section>
      <section
        className="prosa rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="s-que"
      >
        <h2 id="s-que" className="text-base font-extrabold text-slate-900">
          Qué es
        </h2>
        <p className="mt-2 text-sm">
          Una versión de consulta del capítulo «{CAPITULO.titulo}» ({CAPITULO.autor},{" "}
          {CAPITULO.obra}): sus tablas, algoritmos y situaciones clínicas organizados para el día a
          día —por sistema, por situación o con el buscador—, con el texto completo para leerlo y la
          página de cada dato. Se instala como una aplicación y funciona sin conexión.
        </p>
        <h2 className="mt-5 text-base font-extrabold text-slate-900">De dónde sale el texto</h2>
        <p className="mt-2 text-sm">
          El texto es el del capítulo, literal, de la maquetación final del {CAPITULO.fechaFuente} (
          {CAPITULO.editorial}, {CAPITULO.paginas} páginas), con sus 3 correcciones finales
          aplicadas. Cada bloque lleva su página. Las figuras, que en el PDF son imágenes, están
          transcritas caja a caja.
        </p>
        <h2 className="mt-5 text-base font-extrabold text-slate-900">
          El capítulo y, aparte, lo que no es del capítulo
        </h2>
        <p className="mt-2 text-sm">
          Todo lo que viene del capítulo se muestra como texto literal con su página. Lo demás va
          siempre rotulado y separado, nunca mezclado con él; si algo difiriera, se sigue el
          capítulo:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Versión extendida · no publicada en el Manual</strong> (ámbar, plegada):
            fragmentos de los borradores de mayo de 2026 que no cupieron en el capítulo, revisados
            uno a uno, con su borrador y su fecha.
          </li>
          <li>
            <strong>Ampliación técnica · fuera del capítulo</strong> (violeta): la ficha técnica de
            cada sistema, con sus fuentes y su fecha de verificación.
          </li>
          <li>
            <strong>Para el paciente</strong>: la información para pacientes y el resumen del
            capítulo, literales, tal como los maqueta la editorial; y el plan de seguridad de cada
            sistema, hecho solo con texto del capítulo.
          </li>
          <li>
            <strong>Autoevaluación</strong>: diez preguntas con su explicación y las frases del
            capítulo que la respaldan, rotuladas «pendiente de validación» hasta su revisión final.
          </li>
          <li>
            <strong>Tarjetas de repaso</strong>: las cifras de cada apartado y las siglas del
            glosario, tal como las da el capítulo y con su página; no añaden texto. El avance se
            guarda solo en este dispositivo.
          </li>
        </ul>
        <h2 className="mt-5 text-base font-extrabold text-slate-900">Alcance y datos</h2>
        <p className="mt-2 text-sm">
          Pensada para profesionales, con hojas para entregar al paciente. No contiene calculadoras,
          no pide ni guarda datos de pacientes y no sustituye la ficha técnica de cada sistema, los
          protocolos del centro ni el juicio clínico. Lo único que guarda el navegador son
          preferencias de lectura: modo nocturno, tamaño de letra, por dónde se iba leyendo, los
          apartados leídos, los favoritos, el avance de las tarjetas y las últimas búsquedas (se
          borran con «Borrar»); todo se queda en este dispositivo. El plan de seguridad se rellena a
          mano, en papel.
        </p>
      </section>
      <section
        className="rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        aria-labelledby="s-corr"
      >
        <h2 id="s-corr" className="text-base font-extrabold text-slate-900">
          Correcciones editoriales aplicadas
        </h2>
        <h3 className="mt-3 text-sm font-bold text-slate-900">
          Las 3 correcciones finales (maquetación del 5-10-2026)
        </h3>
        <ol className="mt-2 space-y-1 text-sm text-slate-700">
          {CORRECCIONES_FINALES.map((c, i) => (
            <li key={i} className="flex gap-2">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <span>{c}</span>
            </li>
          ))}
        </ol>
        <h3 className="mt-4 text-sm font-bold text-slate-900">
          Las 11 del 30-9-2026, que la maquetación del 5-10-2026 ya incorpora
        </h3>
        <ol className="mt-2 space-y-1 text-sm text-slate-700">
          {CORRECCIONES.map((c, i) => (
            <li key={i} className="flex gap-2">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </section>
      <ToneCard tone="amber" title="Pendiente (no se ha inventado nada para rellenarlo)">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
          {PENDIENTES.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </ToneCard>
      <section
        className="rounded-2xl border bg-white p-4 text-sm text-slate-700 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
      >
        <h2 className="text-base font-extrabold text-slate-900">Tecnología</h2>
        <p className="mt-2">
          Vite, React y TypeScript; PWA con uso sin conexión; sin servidor ni analítica. Código en
          el repositorio público <code>manual-seen-aid</code>. Castellano de España; unidades mg/dl
          y mmol/l; siglas DM1/DM2; «duración de la insulina activa».
        </p>
      </section>
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
          Diez preguntas. Al responder se ve su explicación y las frases del capítulo que la
          respaldan, con su página. Para memorizar las cifras y las siglas,{" "}
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

/* ---------- Más (móvil): el resto de destinos y las preferencias ---------- */
export function Mas() {
  const [night, toggle] = useNocturno();
  const ids = ["pacientes", "bibliografia", "cambios", "sobre", "test", "repaso"];
  return (
    <div>
      <CabeceraEditorial titulo="Más" hex={CATEGORIA_HEX.confiar} level={1} />
      <ul className="space-y-2">
        {ids.map((id) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          const I = d.icono;
          return (
            <li key={id}>
              <a
                href={d.href}
                className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e6e6e6" }}
              >
                <I
                  size={18}
                  className="shrink-0"
                  style={{ color: CATEGORIA_HEX[d.cat].strong }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900">{d.etiqueta}</span>
                  <span className="block text-xs text-slate-500">{d.descripcion}</span>
                </span>
              </a>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={night}
            className="flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e6e6e6" }}
          >
            {night ? (
              <Sun size={18} className="shrink-0" aria-hidden="true" />
            ) : (
              <Moon size={18} className="shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm font-bold text-slate-900">
              {night ? "Modo día" : "Modo nocturno"}
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}
