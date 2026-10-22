/* «Pasajes relacionados»: lo que devuelve la búsqueda en el capítulo (respuestas.ts), arriba de
   los resultados de la búsqueda. Todo es texto literal del capítulo con su página; lo único de
   la app son los rótulos. Se usa en la paleta (compacta), en «¿Qué necesitas?» de la portada
   (compacta) y en la pantalla Buscar (con las otras respuestas). */
import { sinCortes } from "../sinCortes";
import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE } from "../notas-complementarias";
import { TABLAS } from "../contenido";
import { useId, useState, type ReactNode } from "react";
import { ArrowRight, MessageCircleQuestion, Quote } from "lucide-react";
import { marcar, type Respuesta } from "../busqueda";
import type { RespuestaFrecuente } from "../respuestas";
import type { Frecuente } from "../frecuentes";
import { FIGURA3, LISTA_TABLAS, type TablaId } from "../contenido";
import { ComoInterpretar } from "./ComoInterpretar";
import { VeaseTambien } from "./VeaseTambien";
import { CON_INTERPRETACIONES } from "../edicion";
import { ESCALA_CETONEMIA } from "../contenido/diagramas";
import { href } from "../rutas";
import { SinPartir, Texto } from "../texto";
import { ponerConsulta } from "../consultaBuscar";
import { SISTEMA_HEX } from "../tokens";
import { CORTO_SISTEMA } from "../ampliacion/ids";

function Marcado({ texto, q }: { texto: string; q: string }) {
  return (
    <>
      {marcar(texto, q).map((t, i) =>
        t.hit ? (
          <mark key={i} className="resaltado">
            {t.t}
          </mark>
        ) : (
          // 0.96.0 (16.ª ronda, visual): los intervalos sin partir («DTD 10–100 UI/día»).
          <span key={i}>
            <SinPartir t={t.t} />
          </span>
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
        <Marcado texto={sinCortes(texto)} q={q} />
      </span>
    );
  return (
    <>
      <span className="block rounded-md px-2 py-1" style={{ background: "#f7eff3" }}>
        <Marcado texto={sinCortes(propia.linea)} q={q} />
      </span>
      <details className="mt-1">
        <summary className="con-chevron min-h-11 cursor-pointer text-xs font-semibold text-slate-600 sm:min-h-6">
          Ver los cuatro
        </summary>
        <span className="mt-1 block whitespace-pre-line">
          <Marcado texto={sinCortes(texto)} q={q} />
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

/* 0.92.0 (revisión de tarjetas, ★3): el chip de la app (.chip); con `sis`, el punto del color del
   sistema delante (el filtro de las casillas de sistema, que van debajo con la misma pleca). */
function Chip({
  on,
  onClick,
  sis,
  children,
}: {
  on: boolean;
  onClick: () => void;
  sis?: number;
  children: ReactNode;
}) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="chip tap-44 text-xs">
      {sis !== undefined && sis >= 0 && (
        <span
          aria-hidden="true"
          className="punto-sistema h-2 w-2 shrink-0 rounded-full"
          style={{ ["--sis" as string]: SISTEMA_HEX[sis].strong, background: "var(--sis)" }}
        />
      )}
      {children}
    </button>
  );
}
/* La columna (0-3) de una casilla por su nombre de sistema («MiniMed 780G», «Omnipod 5»…). */
const columnaDe = (nombre: string) => PREFIJO_SISTEMA.findIndex((re) => re.test(nombre.trim()));
/* 0.96.0 (16.ª ronda, adjunto, visual y R5): en chips y casillas, el nombre corto de toda la app
   («Control-IQ / Control-IQ+», «CamAPS FX»), no la cabecera de la tabla («Tandem Control-IQ»,
   «myLoop CamAPS»); lo que no es un sistema, tal cual. */
const nombreDeCasilla = (nombre: string) => {
  const c = columnaDe(nombre);
  return c >= 0 ? CORTO_SISTEMA[c] : nombre;
};

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
  fijo = false,
  previo,
  enCaja,
}: {
  /* 0.92.0 (revisión de tarjetas): dentro de la tarjeta de la pregunta o de los pasajes, sin marco
     propio (marco dentro de marco); desde la segunda, separada de la anterior por una línea. */
  enCaja?: "primera" | "siguiente";
  /* 0.80.1 (cuarta ronda): en una pregunta frecuente de un solo sistema, sin etiqueta ni botones
     de sistema en cada tarjeta. */
  fijo?: boolean;
  /* El texto de la tarjeta anterior: su contexto no se repite debajo. */
  previo?: string;
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
      className={
        principal
          ? ""
          : enCaja === "siguiente"
            ? "separador border-t pt-3"
            : enCaja
              ? ""
              : "tarjeta p-3"
      }
    >
      {casilla && !fijo && (
        <p className="text-xs">
          <span className="insignia">{nombreDeCasilla(casilla.nombre)}</span>
        </p>
      )}
      {titulo && (
        <p className={`mt-1 font-bold text-slate-900 ${principal ? "text-base" : "text-sm"}`}>
          <Marcado texto={titulo} q={q} />
        </p>
      )}
      {/* 0.96.1 (revisión de Codex, V95-12): de qué parte del capítulo es el pasaje, antes de
          leerlo («Gestación»: el uso continuado del modo sueño es de la gestación). La fuente
          entera sigue al pie. */}
      {!titulo && ambitoDe(r.fuente) && (
        <p className="mt-0.5 text-[13px] font-semibold leading-snug text-slate-600">
          {ambitoDe(r.fuente)}
        </p>
      )}
      {/* 0.77.1 (auditoría del adjunto): la segunda línea del rótulo de la fila (Tabla 4: «Activar
          la función temporal 1–2 h antes…»), también cuando se enseña la casilla de un sistema. */}
      {casilla && r.porSistema && r.texto && (
        <p className="mt-0.5 text-sm text-slate-600">
          <Marcado texto={sinCortes(r.texto)} q={q} />
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
      {casillas && !compacta && !fijo && (
        /* 0.77.1 (auditoría del adjunto; nada útil plegado): los sistemas, siempre a la vista. */
        <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label="Sistema">
          {casillas.map((c, i) => (
            <Chip
              key={c.nombre}
              on={sel === i}
              sis={columnaDe(c.nombre)}
              onClick={() => setSel(sel === i ? null : i)}
            >
              {nombreDeCasilla(c.nombre)}
            </Chip>
          ))}
        </div>
      )}
      {ctx?.antes && (
        <p className="mt-2 text-sm text-slate-500">
          <Texto>{ctx.antes}</Texto>
        </p>
      )}
      {r.contexto && !ctx && !(previo && previo.includes(r.contexto.trim())) && (
        <p className="mt-1 text-sm text-slate-600">
          <Marcado texto={r.contexto} q={q} />
        </p>
      )}
      {casilla ? (
        <p className="literal mt-1 whitespace-pre-line text-[15px] leading-relaxed text-slate-900">
          <Marcado texto={sinCortes(casilla.texto)} q={q} />
        </p>
      ) : (
        r.texto && (
          <p
            className={`literal mt-1 whitespace-pre-line text-slate-900 ${principal ? "text-[15px] leading-relaxed" : "text-sm"}`}
          >
            {sistemaConsulta !== undefined && sistemaConsulta >= 0 ? (
              <LineasSistema texto={r.texto} q={q} sistema={sistemaConsulta} />
            ) : (
              <Marcado texto={sinCortes(r.texto)} q={q} />
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
            <Marcado texto={sinCortes(items[clave])} q={q} />
          </p>
          <details className="mt-1">
            <summary className="con-chevron min-h-11 cursor-pointer text-xs font-semibold text-slate-600 sm:min-h-6">
              Ver la lista entera ({r.items!.length} puntos)
            </summary>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-900">
              {r.items!.map((it, i) => (
                <li key={i}>
                  <Marcado texto={sinCortes(it)} q={q} />
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
                <Marcado texto={sinCortes(it)} q={q} />
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
              <dt className="rotulo text-slate-500">{p.etiqueta}</dt>
              <dd className="whitespace-pre-line text-slate-900">
                {sistemaConsulta !== undefined && sistemaConsulta >= 0 ? (
                  <LineasSistema texto={p.texto} q={q} sistema={sistemaConsulta} />
                ) : (
                  <Marcado texto={sinCortes(p.texto)} q={q} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {casillas && !casilla && (
        // 0.92.0 (revisión de tarjetas, ★3): las casillas de sistema de la app (gris, pleca y
        // nombre en el color del sistema), como en Situaciones y la ficha.
        <dl className="mt-1.5 grid gap-1.5 text-sm sm:grid-cols-2">
          {casillas.map((s) => {
            const c = columnaDe(s.nombre);
            return (
              <div
                key={s.nombre}
                className={`casilla px-2.5 py-1.5 ${c >= 0 ? "casilla-sistema" : ""}`}
                style={c >= 0 ? { ["--sis" as string]: SISTEMA_HEX[c].strong } : undefined}
              >
                {/* 0.96.0 (16.ª ronda): el nombre con su grafía, en la tinta del sistema (antes, en
                    MAYÚSCULAS). */}
                <dt
                  className={c >= 0 ? "rotulo-sistema text-[13px]" : "rotulo"}
                  style={c >= 0 ? { color: SISTEMA_HEX[c].ink } : undefined}
                >
                  {nombreDeCasilla(s.nombre)}
                </dt>
                <dd className="mt-0.5 whitespace-pre-line text-slate-900">
                  <Marcado texto={sinCortes(s.texto)} q={q} />
                </dd>
              </div>
            );
          })}
        </dl>
      )}
      {/* 0.82.1 (sexta ronda, R3): no debajo de la propia nota (salía dos veces). */}
      {asterisco &&
        !sinNota &&
        !(r.texto ?? "").includes(asterisco.nota.replace(/^\*\s*/, "").slice(0, 40)) && (
          <p className="mt-1 text-xs text-slate-600">{asterisco.nota}</p>
        )}
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
            r.tipo === "tabla" && casilla && !ruta.includes("/situacion/")
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
          {/* 0.97.1 (17.ª ronda, visual): con el ámbito ya encima del pasaje, al pie solo el
              apartado y la página («Apartado 10, p. 18»). */}
          {!titulo && ambitoDe(r.fuente)
            ? r.fuente.replace(/ · .*$/s, "")
            : r.fuente.replace(/^(Tabla \d+)\..*$/s, "$1")}
          , {paginas(r)}
          {/* 0.83.1 (séptima ronda, R3): el rótulo dice adónde lleva (una casilla de la Tabla 4
              lleva a su situación, no a la ficha). */}
          {r.tipo === "tabla" && casilla && !ruta.includes("/situacion/")
            ? " · ficha del sistema"
            : ""}
          {r.tipo === "tabla" && ruta.includes("/situacion/") ? " · situación" : ""}{" "}
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

/* El ámbito de un pasaje del texto: lo que sigue a «Apartado N · » en su fuente. */
const ambitoDe = (fuente: string) => /^Apartado \d+ · (.+)$/s.exec(fuente)?.[1]?.trim() ?? "";

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
    // 0.92.0 (revisión de tarjetas, ★3): una tarjeta como las demás, con el rótulo en burdeos; el
    // borde de 2 px burdeos queda solo para el foco de la caja de búsqueda.
    <section aria-labelledby={id} className="tarjeta mt-3 p-3 sm:p-4">
      {/* En la pantalla de la pregunta, el rótulo solo para lectores de pantalla (0.70.0). */}
      <H
        id={id}
        className={sinPregunta ? "sr-only" : "mb-1 flex items-center gap-1.5 rotulo"}
        style={{ color: "var(--acento-texto)" }}
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
        // Sin la misma frase dos veces (cuarta ronda, R3: f87 repetía dos frases).
        const vistos = new Set<string>();
        const principales = frecuente.respuestas.filter((r) => {
          if (esAmpliacion(r)) return false;
          const t = (r.texto ?? "").trim();
          if (!t || r.porSistema || r.casillas) return true;
          if (vistos.has(t)) return false;
          vistos.add(t);
          return true;
        });
        const ampliacion = frecuente.respuestas.filter(esAmpliacion);
        // 0.81.1 (quinta ronda, R3): la tarjeta «Nota de…» no se repite si la nota ya va con el
        // pasaje que la lleva; y las frases seguidas del mismo párrafo, en una sola tarjeta con
        // una sola fuente (no una tarjeta y una fuente por frase).
        const notas = principales.map((r) => notaAsterisco(r)?.nota).filter(Boolean) as string[];
        // 0.82.1 (sexta ronda, R3): también la nota de la Figura 3 («F3/nota»), y comparando el
        // texto sin el asterisco.
        const sinAst = (x: string) => x.replace(/^\*\s*/, "").trim();
        const sinNotasRepetidas = principales.filter(
          (r) =>
            !(
              /\/nota(\/|$)/.test(r.id) &&
              notas.some((n) => sinAst(n).includes(sinAst(r.texto ?? "").slice(0, 60)))
            ),
        );
        // Frases («t/…/k») e incisos de lista («l/…/k») seguidos del mismo bloque, juntos: hasta
        // ahora solo se unían de dos en dos (se miraba el id ya unido).
        const PIEZA = /^([tl])\/([^/]+\/[^/]+)\/(\d+)$/;
        const ultima = (r: Respuesta) => r.id.split("+").pop()!;
        const suelta = (r: Respuesta) =>
          r.tipo === "texto" && PIEZA.test(ultima(r)) && !r.casillas && !r.porSistema;
        const juntas: Respuesta[] = [];
        for (const r of sinNotasRepetidas) {
          const ant = juntas[juntas.length - 1];
          const a = ant && suelta(ant) ? PIEZA.exec(ultima(ant)) : null;
          const b = suelta(r) && !r.items ? PIEZA.exec(r.id) : null;
          if (a && b && a[1] === b[1] && a[2] === b[2]) {
            const seguida = Number(b[3]) === Number(a[3]) + 1;
            juntas[juntas.length - 1] =
              b[1] === "l"
                ? {
                    ...ant,
                    id: `${ant.id}+${r.id}`,
                    texto: "",
                    items: [...(ant.items ?? [ant.texto ?? ""]), r.texto ?? ""],
                  }
                : {
                    ...ant,
                    id: `${ant.id}+${r.id}`,
                    texto: `${ant.texto}${seguida ? " " : " […] "}${r.texto}`,
                  };
          } else juntas.push(r);
        }
        const tarjeta = (r: Respuesta, k: number, lista: Respuesta[]) => {
          const nota = notaAsterisco(r)?.nota;
          const repetida = !!nota && notasVistas.has(nota);
          if (nota) notasVistas.add(nota);
          return (
            <Tarjeta
              key={`${r.id}|${r.sistema ?? ""}`}
              r={r}
              q={q}
              onIr={onIr}
              sinNota={repetida}
              sistemaConsulta={sistema ?? frecuente.sistema}
              fijo={frecuente.sistema !== undefined}
              enCaja={k > 0 ? "siguiente" : "primera"}
              previo={
                k > 0
                  ? lista
                      .slice(0, k)
                      .map((x) => `${x.contexto ?? ""} ${x.texto ?? ""}`)
                      .join(" ")
                  : undefined
              }
            />
          );
        };
        return (
          <>
            <div className="space-y-3">{juntas.map(tarjeta)}</div>
            {ampliacion.length > 0 && (
              <details className="mt-2" open>
                <summary className="con-chevron min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
                  Todos los sistemas
                </summary>
                <div className="mt-2 space-y-3">{ampliacion.map(tarjeta)}</div>
              </details>
            )}
          </>
        );
      })()}
      {/* 0.92.0 (revisión de tarjetas, ★1): la misma lista de «Véase también» que en el resto. */}
      {frecuente.siguiente && (
        <VeaseTambien
          enCaja
          nivel={H === "h2" ? 3 : 4}
          onIr={onIr}
          filas={[{ href: frecuente.siguiente.ruta, t: frecuente.siguiente.texto }]}
        />
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
  // 0.77.1 (auditoría R5): tampoco el mismo texto dos veces (un pasaje citado por la pregunta y
  // por el motor con otro identificador salía repetido, con su fuente).
  const textos = new Set(
    (frecuente?.respuestas ?? []).map((x) => (x.texto ?? "").trim()).filter(Boolean),
  );
  const resto = respuestas.filter((x) => {
    if (yaVistos.has(x.id)) return false;
    const t = (x.texto ?? "").trim();
    if (!t || x.porSistema) return true;
    if (textos.has(t)) return false;
    textos.add(t);
    return true;
  });
  // 0.96.0 (16.ª ronda, R1 y visual): sin la pregunta frecuente que ya se enseña arriba.
  const relacionadasOtras = (relacionadas ?? []).filter((f) => f.id !== frecuente?.id);
  const Relacionadas =
    !compacta && relacionadasOtras.length > 0 ? (
      // 0.92.1 (segunda revisión de tarjetas): la misma lista que «Véase también» (antes, otra
      // forma: rótulo y enlaces sueltos).
      <VeaseTambien
        titulo="Preguntas relacionadas"
        enCaja
        nivel={3}
        onIr={onIr}
        filas={relacionadasOtras.map((f) => ({ href: href("preguntas", f.id), t: f.pregunta }))}
      />
    ) : null;
  // 0.74.2 (nada útil plegado): hasta tres pasajes más, abiertos; si son más, plegados.
  const masPasajes = (lista: Respuesta[], enCaja = false) =>
    lista.length > 0 && (
      <details className="mt-3" open={lista.length <= 3}>
        <summary className="con-chevron min-h-11 cursor-pointer text-sm font-semibold text-slate-700 sm:min-h-8">
          Más pasajes del capítulo ({lista.length})
        </summary>
        {/* 0.92.1 (segunda revisión de tarjetas): al ancho de su texto (75ch), sin media tarjeta vacía. */}
        <div className={`mt-2 max-w-3xl ${enCaja ? "space-y-3" : "space-y-2"}`}>
          {lista.map((o, k) => (
            <Tarjeta
              key={`${o.id}|${o.sistema ?? ""}`}
              r={o}
              q={q}
              onIr={onIr}
              enCaja={enCaja ? (k > 0 ? "siguiente" : "primera") : undefined}
            />
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
      {/* 0.92.0 (revisión de tarjetas, ★3): la misma tarjeta que la pregunta frecuente y «Abrir»
          (antes, borde de 2 px azul o de 1 px gris pizarra); lo que la distingue es su rótulo. */}
      <section aria-labelledby={id} className="tarjeta mt-3 p-3 sm:p-4">
        <H
          id={id}
          className="mb-1 flex items-center gap-1.5 rotulo"
          style={{ color: "var(--acento-texto)" }}
        >
          <Quote size={14} aria-hidden="true" /> {titulo}
        </H>
        <Tarjeta
          // 0.83.1 (séptima ronda, R3): otra respuesta u otro sistema, otra tarjeta (el sistema
          // marcado se decide al montarla; al escribir, la tarjeta se reutilizaba sin marcarlo).
          key={`${r.id}|${r.sistema ?? ""}`}
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
          <VeaseTambien
            enCaja
            nivel={nivel === 2 ? 3 : 4}
            onIr={onIr}
            filas={[{ href: continuacion.ruta, t: continuacion.texto }]}
          />
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
          masPasajes(otras, true)
        )}
      </section>
      {Relacionadas}
    </>
  );
}
