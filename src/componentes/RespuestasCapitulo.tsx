/* «Pasajes relacionados»: lo que devuelve la búsqueda en el capítulo (respuestas.ts), arriba de
   los resultados de la búsqueda. Todo es texto literal del capítulo con su página; lo único de
   la app son los rótulos. Se usa en la paleta (compacta), en «¿Qué necesitas?» de la portada
   (compacta) y en la pantalla Buscar (con las otras respuestas). */
import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE } from "../notas-complementarias";
import { TABLAS } from "../contenido";
import { useId, useState, type ReactNode } from "react";
import { ArrowRight, MessageCircleQuestion, Quote } from "lucide-react";
import { marcar, type Respuesta } from "../busqueda";
import type { RespuestaFrecuente } from "../respuestas";
import type { Frecuente } from "../frecuentes";
import { FIGURA3, LISTA_TABLAS, type TablaId } from "../contenido";
import { ComoInterpretar } from "./ComoInterpretar";
import { CON_INTERPRETACIONES } from "../edicion";
import { ESCALA_CETONEMIA } from "../contenido/diagramas";
import { href } from "../rutas";
import { Texto } from "../texto";
import { ponerConsulta } from "../consultaBuscar";

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

/* La sección de Sistemas que enseña una tabla por sistema («Los cuatro en la Tabla N»). */
const SECCION_DE_TABLA: Record<string, string> = {
  T1: "esencial",
  T3: "parametros",
};

/* Un texto con una línea por sistema («MiniMed 780G: …», «Control-IQ: …»): con el sistema de la
   consulta conocido, su línea va primero y las demás, plegadas en «Ver los cuatro». Solo cuando
   la estructura lo permite (tres o más líneas de sistemas distintos); un párrafo corrido no se
   trocea. */
const PREFIJO_SISTEMA: RegExp[] = [
  /^(MiniMed 780G|780G)\b/,
  /^(Tandem Control-IQ|Control-IQ)\b/,
  /^(myLoop CamAPS|CamAPS)/,
  /^Omnipod 5\b/,
];
function lineasPorSistema(texto: string): { linea: string; sistema: number }[] | null {
  const lineas = texto.split("\n").filter((l) => l.trim());
  const marcadas = lineas.map((l) => ({
    linea: l,
    sistema: PREFIJO_SISTEMA.findIndex((re) => re.test(l.trim())),
  }));
  const distintos = new Set(marcadas.filter((m) => m.sistema >= 0).map((m) => m.sistema));
  return distintos.size >= 3 ? marcadas : null;
}
function LineasSistema({ texto, q, sistema }: { texto: string; q: string; sistema: number }) {
  const lineas = lineasPorSistema(texto);
  const propia = lineas?.find((l) => l.sistema === sistema);
  if (!lineas || !propia)
    return (
      <span className="whitespace-pre-line">
        <Marcado texto={texto} q={q} />
      </span>
    );
  return (
    <>
      <span className="block rounded-md px-2 py-1" style={{ background: "#f7eff3" }}>
        <Marcado texto={propia.linea} q={q} />
      </span>
      <details className="mt-1">
        <summary className="min-h-11 cursor-pointer text-xs font-semibold text-slate-600 sm:min-h-6">
          Ver los cuatro
        </summary>
        <span className="mt-1 block whitespace-pre-line">
          <Marcado texto={texto} q={q} />
        </span>
      </details>
    </>
  );
}

/* La tabla y la fila de una respuesta que es una fila de tabla («T3/1»). */
const tablaDe = (id: string): TablaId | null => {
  const m = /^T([1-6])\//.exec(id);
  return m ? (`T${m[1]}` as TablaId) : null;
};
const filaDe = (id: string): number | undefined => {
  const m = /^T[1-6]\/(\d+)$/.exec(id);
  return m ? Number(m[1]) : undefined;
};
/* Un texto que nombra tres o más sistemas: en una pregunta sobre un sistema, es ampliación. */
const NOMBRES_SISTEMA = ["MiniMed 780G", "Control-IQ", "CamAPS", "Omnipod 5"];
const nombraVarios = (t: string) => NOMBRES_SISTEMA.filter((n) => t.includes(n)).length >= 3;

/* Contenido a la vista o, plegado, tras un rótulo. */
function Plegable({
  abierto,
  rotulo,
  children,
}: {
  abierto: boolean;
  rotulo: string;
  children: ReactNode;
}) {
  if (abierto) return <div className="mt-1">{children}</div>;
  return (
    <details className="mt-1">
      <summary className="min-h-11 cursor-pointer text-xs font-semibold text-slate-600 sm:min-h-6">
        {rotulo}
      </summary>
      {children}
    </details>
  );
}

/* Enlaces de acción según de dónde sale la respuesta (además de «Ver en…»). */
function accionesDe(r: Respuesta, punto?: string): { texto: string; ruta: string }[] {
  const out: { texto: string; ruta: string }[] = [];
  const tabla = r.id.split("/")[0];
  if (/^T[1-6]$/.test(tabla))
    out.push(
      SECCION_DE_TABLA[tabla]
        ? {
            texto: `Los cuatro en la Tabla ${tabla.slice(1)}`,
            ruta: href("sistemas", "todos", SECCION_DE_TABLA[tabla]),
          }
        : { texto: `Tabla ${tabla.slice(1)} completa`, ruta: href("consultar", "tablas", tabla) },
    );
  // De una lista solo cuenta el punto que responde (no toda la lista).
  const todo = `${r.titulo} ${r.texto} ${punto ?? ""}`;
  if (r.id.startsWith("F3/") || /cetonemia|cetosis|β-OHB|cetoacidosis/i.test(todo))
    out.push({
      texto: "Hoja para el paciente: cetonas",
      ruta: href("pacientes", "hoja", "cetonas"),
    });
  if (tabla === "T6" || /resonancia|cirug[ií]a|exploraci[oó]n/i.test(r.titulo))
    out.push({
      texto: "Hoja para el paciente: pruebas y cirugía",
      ruta: href("pacientes", "hoja", "pruebas-cirugia"),
    });
  return out;
}

/* Fragmentos de seguridad (Figura 3 y resolución de incidencias: hiperglucemia persistente,
   cetonemia, corrección con pluma): siempre enteros, sin destacar un punto ni recortar la lista,
   para que ninguna condición, nota o excepción quede plegada (A01). */
const esSeguridad = (id: string) =>
  /^(F3\/|l\/09-descarga\/b17$|t\/09-descarga\/b(16|19)\/)/.test(id);

/* El punto de una lista que más se parece a la búsqueda: va primero; el resto, plegado. */
function puntoClave(items: string[] | undefined, q: string): number {
  if (!items || items.length < 3) return -1;
  let mejor = -1;
  let hits = 0;
  items.forEach((it, i) => {
    const n = marcar(it, q).filter((t) => t.hit).length;
    if (n > hits) {
      hits = n;
      mejor = i;
    }
  });
  return mejor;
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`tap-44 inline-flex min-h-8 items-center rounded-md border px-2.5 text-xs font-semibold transition ${on ? "text-white" : "bg-white text-slate-700 hover:border-slate-500"}`}
      style={on ? { background: "#8E254E", borderColor: "#8E254E" } : { borderColor: "#d4d4d4" }}
    >
      {children}
    </button>
  );
}

function Tarjeta({
  r: inicial,
  q,
  principal,
  compacta,
  onIr,
  sinNota = false,
  porId,
  contexto,
  sistemaConsulta,
}: {
  r: Respuesta;
  q: string;
  principal?: boolean;
  compacta?: boolean;
  onIr?: () => void;
  /* La nota del asterisco ya se ha enseñado en un pasaje anterior del mismo bloque. */
  sinNota?: boolean;
  /* El sistema que nombra la consulta (columna): su línea, primero, en textos por sistema. */
  sistemaConsulta?: number;
  /* Otra respuesta por su id (cambiar de tramo de la Figura 3 sin salir). */
  porId?: (id: string) => Respuesta | null;
  /* La frase anterior y la siguiente del mismo párrafo («Ver en contexto»). */
  contexto?: (id: string) => { antes?: string; despues?: string };
}) {
  // Tramo de la Figura 3 elegido con los chips (sustituye a la respuesta inicial).
  const [tramo, setTramo] = useState<Respuesta | null>(null);
  const r = tramo ?? inicial;
  // Casilla de la fila por sistema elegida con los chips.
  const casillas = r.casillas ?? r.porSistema;
  const [sel, setSel] = useState<number | null>(() =>
    r.sistema && casillas ? casillas.findIndex((c) => c.nombre === r.sistema) : null,
  );
  const [verContexto, setVerContexto] = useState(false);
  // Si la persona tocó los chips, se quedan a la vista; si el sistema viene de la consulta, los
  // demás van plegados.
  const [tocado, setTocado] = useState(false);
  const titulo = r.tipo === "texto" ? "" : r.titulo;
  const asterisco = notaAsterisco(r);
  const seguridad = esSeguridad(r.id);
  const items =
    compacta && !seguridad && r.items && r.items.length > 5 ? r.items.slice(0, 5) : r.items;
  const clave = principal && !seguridad ? puntoClave(r.items, q) : -1;
  const casilla = casillas && sel !== null && sel >= 0 ? casillas[sel] : null;
  const ruta = casilla ? casilla.ruta : r.ruta;
  const ctx = verContexto && contexto ? contexto(r.id) : null;
  const acciones = principal ? accionesDe(r, clave >= 0 ? r.items![clave] : undefined) : [];
  const enlace =
    "inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline sm:min-h-8";
  return (
    <div
      className={principal ? "" : "rounded-lg border bg-white p-3"}
      style={principal ? undefined : { borderColor: "#e6e6e6" }}
    >
      {casilla && (
        <p className="text-xs">
          <span className="rounded-full border border-slate-300 px-1.5 font-semibold text-slate-700">
            {casilla.nombre}
          </span>
        </p>
      )}
      {titulo && (
        <p className={`mt-1 font-bold text-slate-900 ${principal ? "text-base" : "text-sm"}`}>
          <Marcado texto={titulo} q={q} />
        </p>
      )}
      {r.id.startsWith("F3/") && porId && principal && (
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Tramo de β-OHB">
          {ESCALA_CETONEMIA.tramos.map((t) => (
            <Chip
              key={t.clave}
              on={r.id === `F3/${t.clave}`}
              onClick={() => setTramo(porId(`F3/${t.clave}`))}
            >
              {t.etiqueta.split(" · ")[0]}
            </Chip>
          ))}
        </div>
      )}
      {casillas && !compacta && (
        /* Con un sistema elegido, los demás van plegados: menos selectores repetidos. */
        <Plegable abierto={!casilla || tocado} rotulo="Ver otros sistemas">
          <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label="Sistema">
            {casillas.map((c, i) => (
              <Chip
                key={c.nombre}
                on={sel === i}
                onClick={() => {
                  setTocado(true);
                  setSel(sel === i ? null : i);
                }}
              >
                {c.nombre}
              </Chip>
            ))}
          </div>
        </Plegable>
      )}
      {ctx?.antes && (
        <p className="mt-2 text-sm text-slate-500">
          <Texto>{ctx.antes}</Texto>
        </p>
      )}
      {r.contexto && !ctx && (
        <p className="mt-1 text-sm text-slate-600">
          <Marcado texto={r.contexto} q={q} />
        </p>
      )}
      {casilla ? (
        <p className="literal mt-1 whitespace-pre-line text-[15px] leading-relaxed text-slate-900">
          <Marcado texto={casilla.texto} q={q} />
        </p>
      ) : (
        r.texto && (
          <p
            className={`literal mt-1 whitespace-pre-line text-slate-900 ${principal ? "text-[15px] leading-relaxed" : "text-sm"}`}
          >
            {sistemaConsulta !== undefined && sistemaConsulta >= 0 ? (
              <LineasSistema texto={r.texto} q={q} sistema={sistemaConsulta} />
            ) : (
              <Marcado texto={r.texto} q={q} />
            )}
          </p>
        )
      )}
      {ctx?.despues && (
        <p className="mt-1 text-sm text-slate-500">
          <Texto>{ctx.despues}</Texto>
        </p>
      )}
      {items && items.length > 0 && clave >= 0 ? (
        <>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-900">
            <Marcado texto={items[clave]} q={q} />
          </p>
          <details className="mt-1">
            <summary className="min-h-11 cursor-pointer text-xs font-semibold text-slate-600 sm:min-h-6">
              Ver la lista entera ({r.items!.length} puntos)
            </summary>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-900">
              {r.items!.map((it, i) => (
                <li key={i}>
                  <Marcado texto={it} q={q} />
                </li>
              ))}
            </ul>
          </details>
        </>
      ) : (
        items &&
        items.length > 0 && (
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-900">
            {items.map((it, i) => (
              <li key={i}>
                <Marcado texto={it} q={q} />
              </li>
            ))}
            {items !== r.items && <li className="list-none text-slate-500">…</li>}
          </ul>
        )
      )}
      {/* 0.72.1 (decisión del responsable): sin el recuadro de urgencia junto a los pasajes de la
          Figura 3; los tramos del pasaje llevan a la rama roja. */}
      {r.partes && (
        <dl className="mt-1 space-y-1 text-sm">
          {r.partes.map((p) => (
            <div key={p.etiqueta}>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {p.etiqueta}
              </dt>
              <dd className="whitespace-pre-line text-slate-900">
                {sistemaConsulta !== undefined && sistemaConsulta >= 0 ? (
                  <LineasSistema texto={p.texto} q={q} sistema={sistemaConsulta} />
                ) : (
                  <Marcado texto={p.texto} q={q} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {casillas && !casilla && (
        <dl className="mt-1 grid gap-1 text-sm sm:grid-cols-2">
          {casillas.map((s) => (
            <div key={s.nombre} className="rounded-md bg-slate-50 px-2 py-1">
              <dt className="text-xs font-bold text-slate-600">{s.nombre}</dt>
              <dd className="whitespace-pre-line text-slate-900">
                <Marcado texto={s.texto} q={q} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {asterisco && !sinNota && <p className="mt-1 text-xs text-slate-600">{asterisco.nota}</p>}
      {/* Una decisión registrada que ayuda a leer el pasaje (V54-11), rotulada aparte. */}
      {NOTAS_POR_PASAJE[r.id] &&
        (!r.sistema ||
          COLUMNA_DE_NOTA[r.id] === undefined ||
          r.sistema === TABLAS.T1.columnas[COLUMNA_DE_NOTA[r.id]]) && (
          <p className="mt-1.5 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600">
            {NOTAS_POR_PASAJE[r.id]}
          </p>
        )}
      {/* 0.71.0: la procedencia y el enlace, en uno: dice de dónde es y lleva allí. 0.72.0: con el
          peso de una línea de fuente, no el del texto. */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0">
        <a
          href={ruta}
          onClick={onIr}
          aria-label={`${
            r.tipo === "tabla" && casilla
              ? "Ver en la ficha del sistema"
              : r.tipo === "tabla" && ruta.includes("/situacion/")
                ? "Ver esta situación"
                : r.tipo === "figura"
                  ? "Ver la figura"
                  : r.tipo === "tabla"
                    ? "Ver la tabla"
                    : "Ver en el apartado"
          }: ${r.fuente.replace(/^(Tabla \d+)\..*$/s, "$1")}, ${paginas(r)}`}
          className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-slate-600 hover:underline sm:min-h-8"
        >
          {r.fuente.replace(/^(Tabla \d+)\..*$/s, "$1")}, {paginas(r)}
          {r.tipo === "tabla" && casilla ? " · ficha del sistema" : ""}
          {r.tipo === "tabla" && !casilla && ruta.includes("/situacion/")
            ? " · situación"
            : ""}{" "}
          <ArrowRight size={14} aria-hidden="true" />
        </a>
        {principal && r.tipo === "texto" && contexto && (
          <button
            type="button"
            onClick={() => setVerContexto((v) => !v)}
            aria-pressed={verContexto}
            className={`${enlace} text-slate-600`}
          >
            {verContexto ? "Ocultar el contexto" : "Ver en contexto"}
          </button>
        )}
        {acciones.map((a) => (
          <a key={a.ruta} href={a.ruta} onClick={onIr} className={`${enlace} text-slate-600`}>
            {a.texto} <ArrowRight size={13} aria-hidden="true" />
          </a>
        ))}
      </div>
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
  sistema,
}: {
  frecuente: RespuestaFrecuente;
  q: string;
  onIr?: () => void;
  H: "h2" | "h3";
  /* En la pantalla de la pregunta, el título ya es la pregunta. */
  sinPregunta?: boolean;
  sistema?: number;
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
      {/* En la pantalla de la pregunta, el rótulo solo para lectores de pantalla (0.70.0). */}
      <H
        id={id}
        className={
          sinPregunta
            ? "sr-only"
            : "mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
        }
        style={{ color: "#8E254E" }}
      >
        <MessageCircleQuestion size={14} aria-hidden="true" /> Pregunta frecuente
      </H>
      {!sinPregunta && (
        <p className="mb-2 text-base font-bold text-slate-900">{frecuente.pregunta}</p>
      )}
      {(() => {
        // En una pregunta sobre un sistema, el párrafo que enumera los cuatro va como ampliación.
        const esAmpliacion = (r: Respuesta) =>
          frecuente.sistema !== undefined && r.tipo === "texto" && nombraVarios(r.texto);
        const principales = frecuente.respuestas.filter((r) => !esAmpliacion(r));
        const ampliacion = frecuente.respuestas.filter(esAmpliacion);
        const tarjeta = (r: Respuesta) => {
          const nota = notaAsterisco(r)?.nota;
          const repetida = !!nota && notasVistas.has(nota);
          if (nota) notasVistas.add(nota);
          return (
            <Tarjeta
              key={r.id}
              r={r}
              q={q}
              onIr={onIr}
              sinNota={repetida}
              sistemaConsulta={sistema ?? frecuente.sistema}
            />
          );
        };
        return (
          <>
            <div className="space-y-2">{principales.map(tarjeta)}</div>
            {ampliacion.length > 0 && (
              <details className="mt-2">
                <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
                  Todos los sistemas
                </summary>
                <div className="mt-2 space-y-2">{ampliacion.map(tarjeta)}</div>
              </details>
            )}
          </>
        );
      })()}
      {frecuente.siguiente && (
        <p className="mt-2">
          <a
            href={frecuente.siguiente.ruta}
            onClick={onIr}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline sm:min-h-8"
          >
            Véase también: {frecuente.siguiente.texto} <ArrowRight size={13} aria-hidden="true" />
          </a>
        </p>
      )}
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
  porId,
  contexto,
  relacionadas,
  sistema,
  continuacion,
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
  porId?: (id: string) => Respuesta | null;
  contexto?: (id: string) => { antes?: string; despues?: string };
  /* Preguntas frecuentes relacionadas con lo respondido (al pie, en la pantalla Buscar). */
  relacionadas?: Frecuente[];
  /* El sistema que nombra la consulta (columna de la Tabla 1), si lo hay. */
  sistema?: number;
  /* Una continuación operativa para la respuesta principal (Buscar). */
  continuacion?: { texto: string; ruta: string } | null;
}) {
  const id = useId();
  const H = `h${nivel}` as "h2" | "h3";
  // Con pregunta frecuente, el motor añade solo lo que ella no enseña.
  const yaVistos = new Set(frecuente?.respuestas.map((x) => x.id) ?? []);
  const resto = frecuente ? respuestas.filter((x) => !yaVistos.has(x.id)) : respuestas;
  const Relacionadas =
    !compacta && relacionadas && relacionadas.length > 0 ? (
      <nav aria-label="Preguntas relacionadas" className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Preguntas relacionadas
        </p>
        <ul className="mt-1 space-y-0.5">
          {relacionadas.map((f) => (
            <li key={f.id}>
              <a
                href={href("preguntas", f.id)}
                onClick={onIr}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
              >
                {f.pregunta} <ArrowRight size={13} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    ) : null;
  // Lo que no responde de entrada va plegado: el lector decide si lo abre.
  const masPasajes = (lista: Respuesta[]) =>
    lista.length > 0 && (
      <details className="mt-3">
        <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
          Más pasajes del capítulo ({lista.length})
        </summary>
        <div className="mt-2 space-y-2">
          {lista.map((o) => (
            <Tarjeta key={o.id} r={o} q={q} onIr={onIr} />
          ))}
        </div>
      </details>
    );
  if (frecuente)
    return (
      <>
        <BloqueFrecuente
          frecuente={frecuente}
          q={q}
          onIr={onIr}
          H={H}
          sinPregunta={sinPregunta}
          sistema={sistema}
        />
        {compacta ? (
          <a
            href={href("buscar")}
            onClick={() => {
              ponerConsulta(q);
              onIr?.();
            }}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-600 hover:underline"
          >
            Más pasajes y todos los resultados
          </a>
        ) : (
          masPasajes(resto)
        )}
        {Relacionadas}
      </>
    );
  if (!resto.length) return null;
  const [r, ...otras] = resto;
  const cercana = !!r.aproximada;
  // Recuperación libre (A09): pasajes relacionados con lo buscado, no una respuesta validada.
  const varias = cercana && r.duda === "varias";
  const titulo = !cercana
    ? "Pasajes relacionados"
    : varias
      ? "Pasajes del capítulo"
      : "Coincidencia parcial en el capítulo";
  return (
    <>
      <section
        aria-labelledby={id}
        className={`mt-3 rounded-xl bg-white p-3 sm:p-4 ${cercana ? "border" : "border-2"}`}
        style={{ borderColor: cercana ? "#94a3b8" : "#3f6e9f" }}
      >
        <H
          id={id}
          className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
          style={{ color: cercana ? "#475569" : "#2f5680" }}
        >
          <Quote size={14} aria-hidden="true" /> {titulo}
        </H>
        <Tarjeta
          r={r}
          q={q}
          principal
          compacta={compacta}
          onIr={onIr}
          porId={porId}
          contexto={contexto}
          sistemaConsulta={sistema}
        />
        {/* La explicación aprobada de esa tabla y una continuación, junto al dato. */}
        {CON_INTERPRETACIONES && !compacta && tablaDe(r.id) && (
          <ComoInterpretar tabla={tablaDe(r.id)!} fila={filaDe(r.id)} />
        )}
        {!compacta && continuacion && (
          <p className="mt-2">
            <a
              href={continuacion.ruta}
              onClick={onIr}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline sm:min-h-8"
            >
              Véase también: {continuacion.texto} <ArrowRight size={13} aria-hidden="true" />
            </a>
          </p>
        )}
        {compacta ? (
          <a
            href={href("buscar")}
            onClick={() => {
              ponerConsulta(q);
              onIr?.();
            }}
            className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-600 hover:underline"
          >
            {otras.length > 0
              ? `${otras.length === 1 ? "Otro pasaje" : `Otros ${otras.length} pasajes`} y todos los resultados`
              : "Todos los resultados"}
          </a>
        ) : (
          masPasajes(otras)
        )}
      </section>
      {Relacionadas}
    </>
  );
}
