/* Sistemas: una sola pantalla para uno o varios. Uno = su ficha, la misma para entender y para
   consultar, en secciones con ruta propia (#/sistemas/<id>/<seccion>): Características (Tabla 1),
   Cómo funciona, Parámetros (Tablas 1 y 3), Situaciones (Tabla 4), literales, con la fuente al
   pie de cada bloque (componentes/FuentePie), y
   aparte la Ampliación técnica, fuera del capítulo y con sus fuentes. Varios o todos
   (#/sistemas/<a+b|todos>/<seccion>) = la misma sección, un sistema junto a otro: eso son
   «Comparar sistemas» y «Parámetros por sistema». */
import { sinCortes } from "../sinCortes";
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, ExternalLink, Minus, X } from "lucide-react";
import { APARTADOS, TABLAS, idDeBloque, type Bloque, type Tabla } from "../contenido";
import type { TablaId } from "../contenido/tipos";
import type { Pieza } from "../inicio";
import { fuentesDePiezas } from "../fuentesPiezas";
import {
  COMPAT_INSULINA,
  CRITERIOS,
  DIFIERE_CAMPO,
  DIFIERE_PARAM,
  FICHA_FILAS,
  FOTO_SISTEMA,
  FUENTES,
  INSULINAS_RAPIDAS,
  ORDEN_SISTEMAS,
  SETS_INFUSION,
  SISTEMAS_AMPLIACION,
  WEB_SISTEMA,
  columnaDeSistema,
  sistemaPorId,
  type Sistema,
} from "../ampliacion";
import { elegirRuta, href, fueNavegacionNueva, navegar } from "../rutas";
import { BotonImprimir, CabeceraEditorial, ColofonImpreso, Foldable } from "../ui";
import { pestanaALaVista } from "../disposicion";
import { AbrirEnVisor } from "../componentes/Visor";
import { Lineas, Texto } from "../texto";
import { CATEGORIA_HEX, SEEN, SISTEMA_HEX } from "../tokens";
import { plano } from "../marcado";
import { frases } from "../frases";
import type { SistemaId } from "../ampliacion/tipos";
import { TablaVista } from "../componentes/TablaVista";
import { CasillasSistema } from "../componentes/CasillasSistema";
import { NivelTitulo } from "../nivel-contexto";
import { CON_AMPLIACION, retirado } from "../edicion";
import { CATALOGO_SISTEMAS, CORTO_SISTEMA, sistemaDelCatalogo } from "../ampliacion/ids";
import { Elegir } from "./Elegir";

export { Elegir };
import { recordarSistema } from "../sistemaReciente";
import { FRECUENTES } from "../frecuentes";
import { NombreSistema } from "../componentes/NombreSistema";
import { useImprimirConTeclado } from "../imprimirConTeclado";
import {
  ALGORITMO,
  tipoBajoNombre,
  INDICACION,
  MODOS,
  PARAMETROS,
  RESUMEN,
  VARIANTE_RESUMEN,
  ASPECTOS_PARAMETRO,
  fuentesDeDatos,
  slugDato,
} from "../fichaOperativa";
import {
  AspectoEntreSistemas,
  CasillasDatos,
  FilasDatos,
  GruposDatos,
} from "../componentes/FichaOperativa";
import { literalDe } from "../fuentesPiezas";
import { SinCortes } from "../componentes/SinCortes";
import { ComoFuncionaOperativo } from "../componentes/ComoFuncionaOperativo";
import { FuentePie } from "../componentes/FuentePie";

const hex = CATEGORIA_HEX.consultar;

/* Palabras con las que el capítulo nombra cada sistema (para encontrar sus párrafos). */
const ALIAS: Record<string, RegExp> = {
  mm780: /MiniMed 780G|SmartGuard|MiniMed\b/,
  ciq: /Control-IQ|Tandem|t:slim/,
  camaps: /CamAPS|myLoop|Liberty|Boost|Ease-off|YpsoPump/,
  op5: /Omnipod|SmartAdjust|Función Actividad/,
};

function parrafosDelSistema(id: string) {
  const re = ALIAS[id];
  const out: {
    slug: string;
    titulo: string;
    sub: string;
    ancla: string;
    b: Extract<Bloque, { t: "p" }>;
    /* 0.78.1: el número del párrafo dentro del subapartado (`np`), que se enseña (`n`) si hay
       varias menciones en él. */
    np: number;
    n?: number;
  }[] = [];
  // 0.77.1 (auditoría R3): con su subapartado, para distinguir las menciones de un mismo apartado
  // («Situaciones especiales · Gestación», «… · Ejercicio físico»).
  for (const a of APARTADOS) {
    let sub = "";
    let np = 0;
    a.bloques.forEach((b, i) => {
      if (b.t === "h3") {
        sub = b.texto;
        np = 0;
      }
      if (b.t === "p") np++;
      if (b.t === "p" && re.test(plano(b.texto)))
        out.push({ slug: a.slug, titulo: a.titulo, sub, ancla: idDeBloque(b, i), b, np });
    });
  }
  // Sin entradilla, varias menciones del mismo subapartado se distinguen por su número de párrafo.
  const clave = (x: (typeof out)[number]) => `${x.slug}·${x.sub}`;
  const cuantas = new Map<string, number>();
  for (const x of out) if (!x.b.lead) cuantas.set(clave(x), (cuantas.get(clave(x)) ?? 0) + 1);
  for (const x of out)
    if (!x.b.lead && (cuantas.get(clave(x)) ?? 0) > 1) {
      x.n = x.np;
    }
  return out;
}

function Estado({ v }: { v: "yes" | "partial" | "no" }) {
  if (v === "yes") return <Check size={14} className="text-emerald-700" aria-label="Sí" />;
  if (v === "partial") return <Minus size={14} className="text-amber-700" aria-label="Parcial" />;
  return <X size={14} className="text-red-700" aria-label="No" />;
}

const NIVEL: Record<string, { etiqueta: string; color: string }> = {
  directo: { etiqueta: "Influye en automático", color: "#10b981" },
  indirecto: { etiqueta: "Influye indirectamente", color: "#f59e0b" },
  manual: { etiqueta: "Solo en manual o calculador", color: "#d4d4d4" },
  fijo: { etiqueta: "Fijo en automático", color: "#94a3b8" },
};

/* Marca de un dato de la ampliación que no coincide con el capítulo: manda el capítulo. */
function Ampliacion({ s }: { s: Sistema }) {
  const sets = SETS_INFUSION[s.id] || [];
  const fuentes = s.sources.map((id) => ({ id, f: FUENTES[id] })).filter((x) => x.f);
  return (
    <section aria-labelledby="ampliacion" className="mt-8">
      <div className="mb-3 rounded-xl border border-violet-200 bg-violet-50 p-3">
        <h2 id="ampliacion" className="text-base font-extrabold text-violet-900">
          Ampliación técnica · fuera del capítulo
        </h2>
        <p className="mt-1 text-sm text-violet-900">
          Ficha técnica con sus fuentes al pie (última verificación: {s.verified}). No forma parte
          del texto del Manual SEEN. La disponibilidad y las condiciones pueden cambiar: confirmar
          siempre en la ficha técnica vigente.
        </p>
      </div>
      <div className="space-y-3">
        {FICHA_FILAS.map((g) => (
          <Foldable key={g.g} title={g.g} open={g.g === "Indicación y objetivo"}>
            <dl className="divide-y">
              {g.rows.map((r) => {
                let valor: React.ReactNode = null;
                // Donde la ampliación no coincide con el capítulo, se enseña la frase del capítulo.
                const dif = r.f ? DIFIERE_CAMPO[s.id]?.[r.f] : undefined;
                if (dif)
                  valor = (
                    <>
                      <Lineas>{dif.capitulo}</Lineas>{" "}
                      <span className="pagina-badge">
                        {dif.donde}, p. {dif.p}
                      </span>
                    </>
                  );
                else if (r.f) valor = <Lineas>{s.detail[r.f] || "—"}</Lineas>;
                else if (r.crit) {
                  const c = CRITERIOS.find((x) => x.id === r.crit);
                  const cel = c?.s[s.id];
                  valor = cel ? (
                    <span className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">
                        <Estado v={cel.v} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <Lineas>{cel.t}</Lineas>
                      </span>
                    </span>
                  ) : null;
                }
                return (
                  <div key={r.k} className="grid gap-1 py-2.5 sm:grid-cols-[13rem_1fr] sm:gap-4">
                    <dt className="rotulo text-slate-500">{r.k}</dt>
                    <dd className="text-sm text-slate-800">{valor}</dd>
                  </div>
                );
              })}
            </dl>
          </Foldable>
        ))}
        <Foldable
          title="Parámetros: cuáles mueven el modo automático"
          subtitle={`Resumen de la ampliación: ${s.takeaway}`}
        >
          <ul className="space-y-2">
            {s.params.map((p) => {
              const n = NIVEL[p.level];
              return (
                <li
                  key={p.name}
                  className="rounded-lg border-l-4 bg-white py-1.5 pl-3 pr-2"
                  style={{ borderColor: n.color }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{p.name}</span>
                    {/* Si el capítulo no le da efecto directo (sin asterisco en la Tabla 1), sin etiqueta de nivel. */}
                    {!DIFIERE_PARAM[s.id]?.[p.name] && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {n.etiqueta}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-700">{p.note}</p>
                  {p.modes && (
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {p.modes.map((m) => (
                        <li key={m.name}>
                          <span className="font-semibold">{m.name}:</span> {m.desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </Foldable>
        <Foldable title="Sets de infusión" count={sets.length || undefined}>
          {sets.length === 0 ? (
            <p className="text-sm text-slate-700">
              Pod sin tubo: cánula integrada, inserción automática; no hay set externo que elegir.
              Rotación de zonas y adhesión, claves.
            </p>
          ) : (
            <div
              className="linea tabla-scroll rounded-xl border"
              tabIndex={0}
              role="region"
              aria-label="Sets de infusión, desplazable"
            >
              <table className="tabla-capitulo w-full text-sm">
                <thead>
                  <tr>
                    {[
                      "Set",
                      "Material",
                      "Ángulo",
                      "Cánula (mm)",
                      "Tubo (cm)",
                      "Inserción",
                      "Cambio (días)",
                    ].map((c) => (
                      <th key={c} scope="col" className="px-2 py-1.5 text-left rotulo">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sets.map((x) => (
                    <tr key={x.name}>
                      <th
                        scope="row"
                        className="separador border-t px-2 py-1.5 text-left text-xs font-bold text-slate-800"
                      >
                        {x.name}
                      </th>
                      <td className="separador border-t px-2 py-1.5 text-slate-700">
                        {x.material}
                      </td>
                      <td className="separador border-t px-2 py-1.5 text-slate-700">{x.angle}</td>
                      <td className="separador border-t px-2 py-1.5 text-slate-700">
                        {x.cannula.join(" / ")}
                      </td>
                      <td className="separador border-t px-2 py-1.5 text-slate-700">
                        {x.tubing.join(" / ")}
                      </td>
                      <td className="separador border-t px-2 py-1.5 text-slate-700">
                        {x.insertion}
                      </td>
                      <td className="separador border-t px-2 py-1.5 text-slate-700">{x.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Foldable>
        <Foldable title="Insulinas rápidas compatibles">
          <ul className="space-y-1.5">
            {INSULINAS_RAPIDAS.map((ins) => {
              const c = COMPAT_INSULINA[ins.id]?.[s.id];
              if (!c) return null;
              const tono = c.status === "ok" ? "emerald" : c.status === "evitar" ? "red" : "amber";
              return (
                <li key={ins.id} className="flex items-start gap-2 text-sm text-slate-800">
                  <span
                    className={`mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${tono === "emerald" ? "bg-emerald-100 text-emerald-800" : tono === "red" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}
                  >
                    {c.status === "ok" ? "Sí" : c.status === "evitar" ? "Evitar" : "Verificar"}
                  </span>
                  <span>
                    <span className="font-semibold">{ins.name}</span>
                    {c.note && <span className="text-slate-600"> — {c.note}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </Foldable>
        <Foldable title="Fuentes de la ampliación" count={fuentes.length}>
          <ol className="space-y-1.5 text-xs text-slate-700">
            {fuentes.map(({ id, f }) => (
              <li key={id}>
                <span className="font-semibold text-slate-900">{f.label}.</span> {f.ref}
                {f.url && (
                  <>
                    {" "}
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-0.5 font-semibold text-sky-800 hover:underline sm:min-h-7"
                    >
                      enlace <ExternalLink size={10} aria-hidden="true" />
                    </a>
                  </>
                )}
                <span className="text-slate-500"> · verificado: {f.checked}</span>
              </li>
            ))}
          </ol>
        </Foldable>
      </div>
    </section>
  );
}

/* Identificador de cada sistema en las rutas de tablas, situaciones e inicio (orden de la
   Tabla 1). */
const SLUG_TABLA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
const SLUG_CORTO = ["MiniMed 780G", "Control-IQ / Control-IQ+", "CamAPS FX", "Omnipod 5"];

/* En la ficha, la pregunta sin el nombre del sistema delante («MiniMed 780G: ¿cómo…?» →
   «¿Cómo…?»); si el nombre lleva algo más («… en la gestación: ¿…?»), se deja entera. */
const sinNombreDelSistema = (q: string) =>
  q.replace(
    /^(MiniMed 780G|Control-IQ\+?|CamAPS FX|Omnipod 5): ¿(.)/,
    (_m, _n, l: string) => `¿${l.toUpperCase()}`,
  );

/* Enlace de acceso en la cabecera de la ficha: texto con subrayado fino. */
// 0.92.0 (revisión de tarjetas, sistemas): 13 px y gris medio, para que no se lean como otra fila
// de pestañas.
// 0.94.0 (rediseño): sin subrayado en reposo y separados por «·» desde sm, como los accesos de las
// tarjetas del Resumen (subrayados, se leían como una segunda fila de pestañas).
const accesoFicha =
  "tap-44 inline-flex min-h-11 items-center px-0.5 text-[13px] font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline sm:min-h-9";
/* «Ficha entera», junto a Imprimir: enlace suelto, con su subrayado fino. */
const accesoSuelto =
  "tap-44 inline-flex min-h-11 items-center px-0.5 text-[13px] font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700 sm:min-h-9";

/* 0.92.0 (revisión de tarjetas, sistemas): las menciones del capítulo, agrupadas por apartado
   (y subapartado), en el orden en que aparecen. */
function gruposDeMenciones<T extends { titulo: string; sub?: string }>(xs: T[]) {
  const grupos: { clave: string; titulo: string; sub?: string; items: T[] }[] = [];
  for (const x of xs) {
    const clave = `${x.titulo}|${x.sub ?? ""}`;
    const g = grupos.find((y) => y.clave === clave);
    if (g) g.items.push(x);
    else grupos.push({ clave, titulo: x.titulo, sub: x.sub, items: [x] });
  }
  return grupos;
}

/* Los parámetros en el orden de las filas de la Tabla 3 (objetivo, basal, ratio, factor, insulina
   activa); lo que no está en ella, al final y en su orden. */
const ORDEN_T3 = [
  "Objetivo glucémico",
  "Tasa basal programada",
  "Ratio I/HC",
  "Factor de sensibilidad",
  "Duración de la insulina activa",
];
const enOrdenDeTabla3 = <T extends { r: string }>(xs: T[]) =>
  [...xs].sort((a, b) => (ORDEN_T3.indexOf(a.r) + 1 || 99) - (ORDEN_T3.indexOf(b.r) + 1 || 99));

/* Los accesos de cada tarjeta de la entrada: botones en el móvil, enlaces de texto desde sm. */
// 0.92.0 (revisión de tarjetas, sistemas): enlaces de texto también en el móvil (la rejilla de
// botones ocupaba 119 px por tarjeta).
const accesoTarjeta =
  "tap-44 inline-flex min-h-11 items-center px-0.5 text-[13px] font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline sm:min-h-9 sm:text-sm";

/* Secciones de la ficha, cada una con su ruta (#/sistemas/<id>/<seccion>). */
const TODAS_LAS_SECCIONES = [
  { id: "funciona", t: "Cómo funciona", corto: "Funciona" },
  { id: "esencial", t: "Indicación y material", corto: "Indicación" },
  { id: "parametros", t: "Parámetros" },
  // 0.73.0: las herramientas del sistema ante cada situación (Tabla 4), en la ficha.
  { id: "modos", t: "Modos y funciones", corto: "Modos" },
  // 0.72.2: las dudas de cada sistema, con sus preguntas frecuentes revisadas.
  { id: "preguntas", t: "Preguntas" },
  { id: "ampliacion", t: "Ampliación técnica" },
] as const;
/* La comparación (0.70.0): la Tabla 1 y la Tabla 3, sin «Cómo funciona» comparado (repetía la
   Tabla 1). */
const SECCIONES_COMPARACION = [
  { id: "esencial", t: "Características", corto: "Características" },
  { id: "parametros", t: "Parámetros" },
  // 0.78.1 (segunda ronda, adjunto): «Los cuatro» desde Modos se queda en Modos (la Tabla 4).
  { id: "modos", t: "Modos y funciones", corto: "Modos" },
] as const;
/* La ampliación técnica no va en la edición editorial (A06): ni pestaña ni sección. */
const SECCIONES_FICHA = TODAS_LAS_SECCIONES.filter((x) => !retirado(x.id));

/* La columna de un sistema en una tabla del capítulo: filas literales, notas y página. */

/* Solo en papel: los pasajes literales de una pregunta frecuente, bajo la pregunta. Cada
   identificador se resuelve a su frase exacta (t/apartado/bloque/frase, como en el buscador:
   `frases(plano(texto))`), a su punto de lista (l/…/punto) o a su fila o nota de tabla; las
   frases contiguas de un mismo párrafo se juntan en un párrafo y nada se imprime dos veces
   (séptima vuelta: un mismo párrafo citado por cuatro frases salía cuatro veces). */
/* El texto de una fila de tabla tal como se imprime: las líneas de cada casilla separadas por «; »
   (antes se fundían en un párrafo) y las casillas de una fila unida, por « · ». */
const textoDeFila = (t: Tabla, fila: number, c: number) => {
  const f = t.filas[fila];
  if (!f) return "";
  const casilla = (x: string) =>
    x
      .split("\n")
      .map((l) => plano(l).trim())
      .filter(Boolean)
      .join("; ");
  return `${f.etiqueta.split("\n")[0]}: ${
    f.unida || !t.porSistema ? f.celdas.map(casilla).join(" · ") : casilla(f.celdas[c])
  }`;
};
/* 0.77.0: las secciones de la ficha ya no imprimen casillas literales (son datos operativos):
   bajo las preguntas solo se evita repetir un pasaje ya impreso bajo una pregunta anterior. */
type TrozoImpreso = { bloque: string; tipo: "p" | "li"; texto: string };
/* Cálculo puro (sin efectos al pintar): los pasajes de cada pregunta, sin repetir lo ya impreso
   en la ficha ni lo de las preguntas anteriores. */
function respuestasImpresas(
  preguntas: (typeof FRECUENTES)[number][],
  c: number,
): Map<string, TrozoImpreso[]> {
  const vistos = new Set<string>();
  return new Map(preguntas.map((f) => [f.id, trozosDe(f, c, vistos)]));
}
/* 0.81.1 (quinta ronda, R3 y visual): una pregunta que se responde con filas de las Tablas 1–4
   no se imprime (sin ellas, «¿Qué diferencia hay entre Control-IQ y Control-IQ+?» salía sin las
   diferencias; con ellas, la ficha pasaba de 4 a 5 caras): esas filas ya van en las tarjetas. */
function trozosDe(f: (typeof FRECUENTES)[number], c: number, vistos: Set<string>): TrozoImpreso[] {
  const trozos: TrozoImpreso[] = [];
  let conTabla = false;
  const poner = (bloque: string, tipo: "p" | "li", texto: string) => {
    if (!texto || vistos.has(texto) || trozos.some((t) => t.texto === texto)) return;
    trozos.push({ bloque, tipo, texto });
  };
  for (const id of f.pasajes) {
    const p = id.split("/");
    if (p[0] === "t" || p[0] === "l") {
      const a = APARTADOS.find((x) => x.slug === p[1]);
      const i = a?.bloques.findIndex((b, k) => idDeBloque(b, k) === p[2]) ?? -1;
      const b = i >= 0 ? a!.bloques[i] : undefined;
      const k = p[3] !== undefined ? Number(p[3]) : -1;
      const bloque = `${p[1]}/${p[2]}`;
      if (b?.t === "p") {
        const todo = plano(b.texto);
        poner(bloque, "p", k >= 0 ? (frases(todo)[k] ?? todo) : todo);
      } else if (b?.t === "lista") {
        if (k >= 0) poner(bloque, "li", plano(b.items[k] ?? ""));
        else b.items.forEach((x) => poner(bloque, "li", plano(x)));
      }
    } else if (/^T[1-4]$/.test(p[0])) {
      conTabla = true;
    } else if (/^T\d+$/.test(p[0])) {
      const t = TABLAS[p[0] as keyof typeof TABLAS];
      if (!t) continue;
      if (p[1] === "nota") poner(id, "p", plano(t.notas[Number(p[2])] ?? ""));
      else poner(`${p[0]}/${p[1]}`, "p", textoDeFila(t, Number(p[1]), c));
    }
  }
  if (conTabla) return [];
  trozos.forEach((t) => vistos.add(t.texto));
  return trozos;
}
/* El pasaje de una pregunta frecuente («t/09-descarga/b6/0», «T5/2») como pieza, para su fuente. */
function piezaDePasaje(id: string): Pieza | null {
  const p = id.split("/");
  if (p[0] === "t" || p[0] === "l")
    return p[0] === "l"
      ? { t: "lista", apartado: p[1], bloque: p[2] }
      : { t: "frase", apartado: p[1], bloque: p[2], k: p[3] !== undefined ? [Number(p[3])] : [0] };
  if (/^T[5-9]$/.test(p[0]) && /^\d+$/.test(p[1] ?? ""))
    return { t: "fila", tabla: p[0] as TablaId, fila: Number(p[1]) };
  return null;
}
function RespuestaImpresa({ trozos }: { trozos: TrozoImpreso[] }) {
  if (!trozos.length) return null;
  // Trozos seguidos del mismo bloque y tipo, juntos (un párrafo; una lista).
  const grupos: (typeof trozos)[] = [];
  for (const t of trozos) {
    const g = grupos[grupos.length - 1];
    if (g && g[0].bloque === t.bloque && g[0].tipo === t.tipo) g.push(t);
    else grupos.push([t]);
  }
  return (
    <div className="hidden space-y-1 px-4 pb-3 text-[14px] leading-snug text-slate-800 print:block">
      {grupos.map((g, n) =>
        g[0].tipo === "li" ? (
          <ul key={n} className="list-disc pl-5">
            {g.map((t) => (
              <li key={t.texto}>
                <Texto>{t.texto}</Texto>
              </li>
            ))}
          </ul>
        ) : (
          <p key={n}>
            <Texto>{g.map((t) => t.texto).join(" ")}</Texto>
          </p>
        ),
      )}
    </div>
  );
}

/* Título de sección con el sistema al lado: al entrar por un enlace directo, la cabecera de la
   ficha queda arriba y fuera de la vista. */
function TituloSeccion({
  id,
  sistema,
  color,
  visible = false,
  children,
}: {
  id: string;
  sistema: string;
  color: string;
  /* En la ficha entera no hay pestaña que lo diga: a la vista (0.77.1, auditoría R3). */
  visible?: boolean;
  children: ReactNode;
}) {
  return (
    // En pantalla, la pestaña activa ya lo dice (sería un título repetido): solo para el lector
    // de pantalla; en papel, visible.
    <h2
      id={id}
      className={`titulo-seccion mb-2 scroll-mt-2 ${visible ? "" : "sr-only print:not-sr-only"}`}
    >
      {/* El sistema ya está en el título y en la barra: solo para el lector de pantalla. */}
      {children}{" "}
      <span className="sr-only" style={{ color }}>
        · {sistema}
      </span>
    </h2>
  );
}

export function FichaSistema({
  id,
  seccion,
  fila,
}: {
  id?: string;
  seccion?: string;
  fila?: string;
}) {
  const s = sistemaDelCatalogo(id);
  const ref = useRef<HTMLDivElement>(null);
  // 0.85.1 (novena ronda, R3): Ctrl+P imprime la ficha igual que «Imprimir la ficha».
  useImprimirConTeclado(ref);
  // 1.0.0 (18.ª ronda, senior): en papel, cada cara dice de qué sistema es (en el margen de
  // arriba, con @page; suelta del grapado, la cara 2 o 3 no lo decía).
  const nombreImpreso = s?.name.replace(/"/g, "") ?? "";
  useEffect(() => {
    if (!nombreImpreso) return undefined;
    const st = document.createElement("style");
    st.dataset.cabeceraImpresa = "";
    const nombre = nombreImpreso;
    st.textContent = `@page { @top-left { content: "${nombre} · Ficha del sistema"; font: 8pt "Open Sans Variable", "Open Sans", sans-serif; color: #6b6b6b; vertical-align: bottom; padding-bottom: 3mm; } @top-right { content: "Página " counter(page) " de " counter(pages); font: 8pt "Open Sans Variable", "Open Sans", sans-serif; color: #6b6b6b; vertical-align: bottom; padding-bottom: 3mm; } }`;
    document.head.append(st);
    return () => st.remove();
  }, [nombreImpreso]);
  // 0.82.1 (sexta ronda, guardia): con una fila pedida, marcada y justo bajo la barra pegada.
  useEffect(() => {
    if (!fila) return;
    let n = 0;
    let marco = 0;
    const buscar = () => {
      const el = ref.current?.querySelector<HTMLElement>(`[data-dato^="${fila}"]`);
      if (!el) {
        if (n++ < 40) marco = requestAnimationFrame(buscar);
        return;
      }
      ref.current
        ?.querySelectorAll(".fila-resaltada")
        .forEach((x) => x.classList.remove("fila-resaltada"));
      el.classList.add("fila-resaltada");
      const barra = document.querySelector(".barra-pegada")?.getBoundingClientRect().bottom ?? 0;
      window.scrollTo({
        top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - barra - 12),
      });
    };
    marco = requestAnimationFrame(buscar);
    return () => cancelAnimationFrame(marco);
  }, [fila, id]);
  const parrafos = useMemo(() => (s ? parrafosDelSistema(s.id) : []), [s]);
  const completa = seccion === "completa";
  // 0.76: en el móvil, el selector de sistemas se abre desde la cabecera (la barra pegada solo
  // lleva las pestañas).
  const [abrirSelector, setAbrirSelector] = useState(0);
  // Enlace a una sección concreta (#/sistemas/<id>/parametros): se abre en ella; la barra con
  // el sistema y la sección queda pegada arriba (scroll-mt de la sección deja sitio).
  const montada = useRef(false);
  useEffect(() => {
    const primera = !montada.current;
    montada.current = true;
    if (!seccion || completa) return;
    // Al volver atrás (Ver en el capítulo → Atrás), la Shell restaura la posición: no se salta.
    if (primera && !fueNavegacionNueva()) return;
    // 0.78.1 (segunda ronda): solo si la sección ha quedado por encima (se había bajado y se
    // cambia de pestaña); al entrar, la ficha se queda arriba, con su cabecera a la vista (antes
    // bajaba unos 100 px y dejaba la fila de accesos medio tapada).
    const el = document.getElementById(seccion);
    const barra = document.querySelector(".barra-pegada")?.getBoundingClientRect().bottom ?? 0;
    const arriba = el?.getBoundingClientRect().top ?? 0;
    // 0.79.1 (tercera ronda): con la barra pegada, la sección empieza justo debajo de ella (con
    // scrollIntoView quedaba tapada por la barra).
    if (el && arriba < barra)
      window.scrollTo({ top: Math.max(0, window.scrollY + arriba - barra - 8) });
  }, [seccion, id, completa]);
  if (!s) return <Comparacion ids={[]} />;
  const c = columnaDeSistema(s.id);
  recordarSistema(c);
  const h = SISTEMA_HEX[c];
  const slug = SLUG_TABLA[c];
  // Las preguntas frecuentes del sistema (columna de la Tabla 1). 0.77.1 (auditorías senior y R3):
  // todas, como en Preguntas frecuentes (antes se quitaban las que solo citaban casillas).
  const preguntas = FRECUENTES.filter((f) => f.sistema === c);
  // En papel, bajo cada pregunta, sus pasajes enteros (0.80.1, cuarta ronda, R3: filtrar las frases
  // que nombran el sistema dejaba respuestas a medias).
  const impresas = respuestasImpresas(preguntas, c);
  // Una sola página (0.70.0): la sección de la ruta es solo adónde se salta.
  const sec = completa ? undefined : seccion;
  // 0.73.0 (auditoría de uso): cada pestaña enseña solo su sección (la ficha entera medía casi
  // cinco pantallas en el móvil); «completa» las enseña todas.
  const vista = sec && SECCIONES_FICHA.some((x) => x.id === sec) ? sec : "funciona";
  const ver = (id: string) => completa || vista === id;
  // En papel se imprime la ficha entera: las secciones de otras pestañas van ocultas en pantalla.
  // 0.84.1 (octava ronda, visual y R3): en papel, el mismo aire sobre cada sección, también sobre
  // la de la pestaña desde la que se imprime (antes, 6–11 pt).
  const papel = (id: string) =>
    `${ver(id) ? "" : "hidden print:block"} ${id === "funciona" ? "" : "print:mt-7"}`;
  const mt = completa ? "mt-7" : "";
  return (
    <div ref={ref} className="imprimible">
      <div className="no-imprimir mb-2 hidden items-center gap-2 text-xs text-slate-500 sm:flex">
        <a
          href={href("sistemas")}
          className="inline-flex min-h-11 items-center font-semibold hover:underline"
        >
          Sistemas AID
        </a>
        <span aria-hidden="true">›</span>
        <span>{s.name}</span>
      </div>
      {/* En el móvil, los enlaces van a lo ancho debajo de la foto (dos filas en vez de tres). */}
      <header className="mb-2 grid grid-cols-[auto_1fr] items-center gap-x-3 sm:mb-3 sm:items-start sm:gap-x-4">
        <AbrirEnVisor
          imagen={{ src: FOTO_SISTEMA[s.id], alt: `Foto oficial de ${s.name}`, titulo: s.name }}
          className="tarjeta h-14 w-14 shrink-0 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 sm:row-span-2 sm:h-16 sm:w-16"
          etiqueta={`Ampliar la foto de ${s.name}`}
        >
          <img
            src={FOTO_SISTEMA[s.id]}
            alt={`Foto oficial de ${s.name}`}
            className="foto-sistema h-full w-full object-cover"
          />
        </AbrirEnVisor>
        <div className="min-w-0">
          {/* Imprimir, junto al título (A09): la única acción secundaria de la cabecera. */}
          <div className="flex items-start justify-between gap-2">
            <h1
              className="min-w-0 font-display text-xl font-medium uppercase leading-tight tracking-[0.04em]"
              style={{ color: h.ink }}
            >
              {/* 0.84.1 (octava ronda, visual): sin partir «Control-IQ+» por el guion en el móvil.
                  0.85.1 (novena ronda, todos): parte entre palabras (sin partir, «Tandem
                  Control-IQ» y «myLoop CamAPS FX» quedaban bajo el botón de imprimir). */}
              <NombreSistema n={s.name} porPalabra />
            </h1>
            <div className="no-imprimir flex shrink-0 items-center gap-3">
              {/* 0.78.1 (segunda ronda, R3): la ficha entera en una página, en el ordenador. */}
              {!completa && (
                <a
                  href={href("sistemas", s.id, "completa")}
                  className={`${accesoSuelto} hidden lg:inline-flex`}
                >
                  Ficha entera
                </a>
              )}
              {/* 0.85.1 (novena ronda, visual): en el móvil, solo el icono (44 px, con nombre). */}
              <BotonImprimir objetivo={ref} compacto titulo="Imprimir la ficha">
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Imprimir la ficha
                </span>
              </BotonImprimir>
            </div>
          </div>
        </div>
        {/* Sistema visual: los tres accesos como enlaces de texto en una fila (en el móvil eran tres
            botones apilados antes del contenido). */}
        <div className="no-imprimir col-span-2 mt-0.5 flex flex-wrap gap-x-3 gap-y-0 max-sm:[&>*]:px-0 sm:col-span-1 sm:col-start-2 sm:mt-0 sm:gap-x-2">
          <a
            // I61-04: al principio del recorrido (preparación), con el sistema; no al paso 5.
            href={href("consultar", "inicio", `preparacion:${slug}`)}
            className={accesoFicha}
          >
            <span className="sm:hidden">Iniciación</span>
            <span className="hidden sm:inline">Iniciación del sistema</span>
          </a>
          <span aria-hidden="true" className="hidden self-center text-slate-300 sm:inline">
            ·
          </span>
          {/* 0.88.1 (duodécima ronda, R5): el cálculo de parámetros iniciales del sistema, directo
              (Iniciación abre las fases). */}
          <a href={href("consultar", "inicio", `calculadora:${slug}`)} className={accesoFicha}>
            Cálculo
          </a>
          <span aria-hidden="true" className="hidden self-center text-slate-300 sm:inline">
            ·
          </span>
          <a href={href("pacientes", "plan", s.id)} className={accesoFicha}>
            {/* Rótulo corto en el móvil; el nombre accesible, siempre el completo. */}
            <span className="sm:hidden" aria-hidden="true">
              Plan
            </span>
            <span className="sr-only sm:not-sr-only">Plan de seguridad</span>
          </a>
          <span aria-hidden="true" className="hidden self-center text-slate-300 sm:inline">
            ·
          </span>
          <a href={href("consultar", "situacion", `:${slug}`)} className={accesoFicha}>
            Situaciones
          </a>
          <span aria-hidden="true" className="hidden self-center text-slate-300 sm:inline">
            ·
          </span>
          <a
            href={href("consultar", "descarga")}
            className={`${accesoFicha} hidden sm:inline-flex`}
          >
            Descarga
          </a>
          <button
            type="button"
            onClick={() => {
              setAbrirSelector((n) => n + 1);
              window.scrollTo({ top: 0 });
            }}
            // 0.89.1 (13.ª ronda, guardia): «Cambiar», como en la barra plegada; las cinco en una
            // línea a 360 px (antes, «Otro sistema» sola en una segunda línea).
            aria-label="Cambiar de sistema o comparar"
            className={`${accesoFicha} gap-0.5 sm:hidden`}
          >
            {/* 0.91.3 (14.ª ronda, guardia): con su flecha, que despliega el selector. */}
            Cambiar
            <ChevronDown size={14} aria-hidden="true" className="shrink-0" />
          </button>
        </div>
      </header>
      {/* 0.94.0 (rediseño): la regla de las cabeceras de pantalla (tramo del color del sistema y
          línea fina), como en CabeceraEditorial. 0.96.0 (16.ª ronda, senior): también en el móvil
          (no se veía: toda cabecera de pantalla lleva su regla), bajo los accesos. */}
      <div aria-hidden="true" className="regla-seccion mb-1 mt-2 flex h-px w-full sm:mt-0">
        <span
          className="tramo-regla w-12"
          style={{ ["--sis" as string]: h.strong, background: "var(--sis)" }}
        />
        <span className="flex-1" />
      </div>

      <BarraSistemas ids={[s.id]} seccion={sec} abrir={abrirSelector} completa={completa} />
      {/* 0.70.0: la ficha es una sola página; las pestañas llevan a cada sección. */}
      <section aria-labelledby="funciona" className={`scroll-mt-2 ${papel("funciona")}`}>
        <TituloSeccion id="funciona" sistema={s.name} color={h.ink} visible={completa}>
          Cómo funciona
        </TituloSeccion>
        <ComoFuncionaOperativo c={c} />
      </section>

      {
        <section aria-labelledby="esencial" className={`${mt} scroll-mt-2 ${papel("esencial")}`}>
          <TituloSeccion id="esencial" sistema={s.name} color={h.ink} visible={completa}>
            Indicación y material
          </TituloSeccion>
          {/* 0.77.0: datos operativos (src/fichaOperativa.ts); el texto literal, en la fuente. */}
          <GruposDatos c={c} grupos={INDICACION[c]} />
          <a
            href={WEB_SISTEMA[s.id]}
            target="_blank"
            rel="noopener noreferrer"
            className="fuente-pie no-imprimir inline-flex min-h-11 items-center gap-1 font-semibold sm:min-h-8"
          >
            Web oficial <ExternalLink size={12} aria-hidden="true" />
          </a>
        </section>
      }

      {
        <section
          aria-labelledby="parametros"
          className={`${mt} scroll-mt-2 ${papel("parametros")}`}
        >
          <TituloSeccion id="parametros" sistema={s.name} color={h.ink} visible={completa}>
            Parámetros
          </TituloSeccion>
          {/* 0.77.0: cada parámetro con lo que hace en automático y cómo se usa, en una fila
              (Tablas 1 y 3; src/fichaOperativa.ts). */}
          {/* 0.92.2 (decisión delegada, 21-10-2026): en el orden de la Tabla 3 en los cuatro
              sistemas (cada parámetro en el mismo sitio de una ficha a otra); la insignia marca
              lo que actúa en automático. */}
          <FilasDatos c={c} datos={enOrdenDeTabla3(PARAMETROS[c])} titulo="Parámetros" />
        </section>
      }

      {
        <section aria-labelledby="modos" className={`${mt} scroll-mt-2 ${papel("modos")}`}>
          <TituloSeccion id="modos" sistema={s.name} color={h.ink} visible={completa}>
            Modos y funciones
          </TituloSeccion>
          <FilasDatos c={c} datos={MODOS[c]} titulo="Modos y funciones" />
        </section>
      }

      {preguntas.length > 0 && (
        <section
          aria-labelledby="preguntas"
          // 0.82.1 (sexta ronda, R3 y visual): en papel, sin la sección si no queda ninguna.
          className={`${mt} scroll-mt-2 print:mt-8 ${papel("preguntas")} ${preguntas.every((f) => !impresas.get(f.id)?.length) ? "print:hidden" : ""}`}
        >
          <TituloSeccion id="preguntas" sistema={s.name} color={h.ink} visible={completa}>
            Preguntas frecuentes
          </TituloSeccion>
          <ul
            className="filas tarjeta tarjeta-sistema overflow-hidden"
            style={{ ["--sis" as string]: h.strong }}
          >
            {/* 0.78.1 (segunda ronda): en papel, sin las preguntas cuya respuesta ya imprime la
                ficha (antes, «En las secciones anteriores de esta ficha» cinco veces). */}
            {preguntas.map((f) => (
              <li key={f.id} className={impresas.get(f.id)?.length ? "" : "print:hidden"}>
                <a
                  href={href("preguntas", f.id)}
                  className="fila pl-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
                >
                  <span className="min-w-0 flex-1">{sinNombreDelSistema(f.pregunta)}</span>
                </a>
                <RespuestaImpresa trozos={impresas.get(f.id) ?? []} />
              </li>
            ))}
          </ul>
          {/* 0.96.0 (16.ª ronda, visual): sin «Las demás preguntas de esta ficha se responden con
              sus tarjetas» en papel (sobraba: las tarjetas van impresas encima). */}
          <FuentePie
            className="mt-1 hidden print:block"
            fuentes={fuentesDePiezas(
              preguntas
                .filter((f) => impresas.get(f.id)?.length)
                .flatMap((f) => f.pasajes)
                .map(piezaDePasaje)
                .filter((x): x is Pieza => !!x),
            )}
          />
        </section>
      )}

      {/* En papel, sin los párrafos (0.72.0: la ficha impresa salía en cinco caras). */}
      {ver("funciona") && (
        <section aria-label="Más del capítulo sobre este sistema" className="no-imprimir mt-7">
          <Foldable title="Menciones en el capítulo" count={parrafos.length} open>
            {/* 0.73.0: enlaces a cada párrafo (antes, los párrafos enteros: repetían el
                capítulo dentro de la ficha). */}
            {/* 0.92.0 (revisión de tarjetas, sistemas): por apartado, con el apartado una sola vez
                y sus párrafos en línea, sin páginas (antes, 9–13 filas con la miga repetida y
                «p. N» en cada una). */}
            <ul className="filas">
              {gruposDeMenciones(parrafos).map((g) => (
                <li key={g.clave} className="py-2 text-sm leading-relaxed text-slate-800">
                  {g.items.length === 1 && !g.items[0].b.lead ? (
                    // 0.92.1 (segunda revisión de tarjetas): un solo párrafo sin entradilla: el
                    // enlace es el propio apartado (antes, «…: párrafo»).
                    <a
                      href={href("capitulo", g.items[0].slug, g.items[0].ancla)}
                      className="tap-44 inline py-1 font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700"
                    >
                      <span>
                        {g.titulo}
                        {g.sub && ` · ${g.sub}`}
                      </span>
                    </a>
                  ) : (
                    <>
                      <span className="font-semibold">{g.titulo}</span>
                      {g.sub && <span className="font-semibold"> · {g.sub}</span>}
                      <span className="text-slate-600">: </span>
                    </>
                  )}
                  {(g.items.length === 1 && !g.items[0].b.lead ? [] : g.items).map((p, k) => (
                    <span key={p.slug + p.ancla}>
                      {k > 0 && <span aria-hidden="true">{"\u00a0· "}</span>}
                      <a
                        href={href("capitulo", p.slug, p.ancla)}
                        className="tap-44 inline py-1 text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700"
                      >
                        <span>
                          {p.b.lead
                            ? p.b.lead.replace(/[.:]$/, "")
                            : p.n
                              ? `párrafo\u00a0${p.n}`
                              : "párrafo"}
                        </span>
                      </a>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </Foldable>
        </section>
      )}

      {CON_AMPLIACION && <Ampliacion s={sistemaPorId(s.id)!} />}
      {/* En papel, de dónde sale la hoja (0.78.1, auditoría R3). */}
      <ColofonImpreso />
    </div>
  );
}

/* ---------- Sistemas: un solo espacio para uno (su ficha) o varios (comparados) ---------- */
/* La selección vive en la ruta: #/sistemas (entrada), #/sistemas/<id>[/seccion] (ficha por
   secciones; /completa, entera), #/sistemas/<a+b>/<seccion> (dos o tres comparados) y
   #/sistemas/todos/<seccion> (los cuatro). «Comparar sistemas» y «Parámetros por sistema» son
   esta pantalla con los cuatro y la sección elegida. El selector es el mismo en todas las
   vistas: marcar añade, desmarcar quita; con uno, se ve su ficha. */
const IDS_SISTEMA = ORDEN_SISTEMAS as readonly string[];

function leerSeleccion(sel?: string): string[] {
  if (!sel || sel === "todos") return [];
  // 0.75.1: también con el identificador de Situaciones e Iniciar («minimed-780g», «control-iq»…).
  const partes = sel.split("+").map((x) => {
    const i = SLUG_TABLA.indexOf(x);
    return i >= 0 ? IDS_SISTEMA[i] : x;
  });
  return IDS_SISTEMA.filter((id) => partes.includes(id));
}

/* «Situaciones» ya no es una sección de Sistemas: la dirección antigua lleva a Situaciones,
   con el sistema elegido si era uno. */
function AsituacionesConSistema({ ids }: { ids: string[] }) {
  useEffect(() => {
    elegirRuta(
      "consultar",
      "situacion",
      ids.length === 1 ? `:${SLUG_TABLA[columnaDeSistema(ids[0] as SistemaId)]}` : undefined,
    );
  }, [ids]);
  return null;
}

export function Sistemas({ sel, seccion: pedida }: { sel?: string; seccion?: string }) {
  // 0.82.1 (sexta ronda): «modos:agua» = la sección y la fila que se marca.
  const [base, filaPedida] = (pedida ?? "").split(":");
  const seccion = base || undefined;
  if (sel === "elegir") return <Elegir antigua={!!seccion} />;
  const ids = sel === undefined ? [] : leerSeleccion(sel);
  if (seccion === "situaciones") return <AsituacionesConSistema ids={ids} />;
  // Dirección antigua de la ampliación técnica: aviso de alcance y la ficha del capítulo.
  if (seccion === "ampliacion" && retirado("ampliacion")) return <AmpliacionRetirada ids={ids} />;
  if (sel !== undefined && sel !== "todos" && !ids.length) return <Comparacion ids={[]} />;
  const sec = SECCIONES_FICHA.some((x) => x.id === seccion)
    ? seccion
    : seccion === "completa"
      ? "completa"
      : undefined;
  if (ids.length === 1)
    return <FichaSistema id={ids[0]} seccion={sec} fila={filaPedida || undefined} />;
  return (
    <Comparacion
      ids={ids}
      seccion={sec === "completa" ? "esencial" : sec}
      fila={filaPedida || undefined}
    />
  );
}

function AmpliacionRetirada({ ids }: { ids: string[] }) {
  const destino = ids.length === 1 ? href("sistemas", ids[0], "esencial") : href("sistemas");
  return (
    <div className="tarjeta p-4 text-sm text-slate-700">
      <h1 className="titulo-seccion">La ampliación técnica no está en esta edición</h1>
      <p className="mt-1">
        Este complemento recoge solo lo que dice el capítulo 89. Los datos de ficha técnica de cada
        sistema quedan para una edición posterior.
      </p>
      <a href={destino} className="mt-2 inline-flex min-h-11 items-center font-semibold underline">
        {ids.length === 1 ? "Ir a lo esencial del sistema" : "Ir a Sistemas AID"}
      </a>
    </div>
  );
}

/* Selector de sistemas y pestañas de sección, pegados arriba al desplazarse: el sistema y la
   sección que se consultan quedan siempre a mano. */
/* 0.88.1 (duodécima ronda, R5): en el móvil, el selector abierto sigue abierto tras marcar o
   desmarcar (cada cambio es otra ruta y la barra se montaba de nuevo, plegada). */
let seguirAbierta = 0;
/* 0.89.1 (13.ª ronda, R5): «cambiar uno por otro» quitando primero: al quedar uno, la ficha con el
   selector abierto; al marcar el otro, de vuelta a la pestaña de la comparación de la que se venía
   (antes, a «Cómo funciona» con el selector cerrado y luego a Características). */
let deComparacion: { sec: string; t: number } | null = null;
function BarraSistemas({
  ids,
  seccion,
  abrir = 0,
  completa = false,
  marcadosEntrada,
}: {
  ids: string[];
  seccion?: string;
  /* 0.91.2 (petición del responsable, 21-10-2026): en la entrada, lo marcado lo comparte la
     pantalla (las tarjetas del Resumen se quedan solo con lo marcado). */
  marcadosEntrada?: [string[], Dispatch<SetStateAction<string[]>>];
  /* La ficha entera (#/sistemas/<id>/completa): ninguna pestaña marcada. */
  completa?: boolean;
  /* Cada cambio abre el selector (desde «Otro sistema o comparación» de la cabecera). */
  abrir?: number;
}) {
  const sec = seccion;
  const secciones = ids.length === 1 ? SECCIONES_FICHA : SECCIONES_COMPARACION;
  // En la ficha, sin sección en la ruta se ve «Cómo funciona» (0.73.0).
  const activa = completa
    ? undefined
    : ids.length === 1 && !(sec && secciones.some((x) => x.id === sec))
      ? "funciona"
      : sec;
  // 0.85.1 (novena ronda, adjunto): desde el Resumen de una comparación, se sigue en el Resumen
  // (antes, marcar o desmarcar llevaba a Características; «Los cuatro», a la Tabla 1).
  const rutaCon = (nuevos: string[]) =>
    nuevos.length === 1
      ? href("sistemas", nuevos[0], sec ?? "funciona")
      : !sec && ids.length > 1
        ? nuevos.length
          ? href("sistemas", nuevos.join("+"))
          : href("sistemas")
        : href(
            "sistemas",
            nuevos.length ? nuevos.join("+") : "todos",
            !sec || sec === "funciona" ? "esencial" : sec,
          );
  // En la entrada (los cuatro), las casillas se van marcando sin cambiar de pantalla; con dos
  // o más, «Comparar» (0.72.0: la primera casilla llevaba a la ficha).
  // 1.0.4 (20.ª ronda, senior): también en «Los cuatro» de una sección (Parámetros, Modos…): marcar
  // uno lo deja marcado en la misma pestaña, con «Ver la ficha» al lado; con dos o más, su
  // comparación en esa sección (antes, el primero llevaba a su ficha y no se podía comparar dos).
  const entrada = ids.length === 0;
  const propios = useState<string[]>([]);
  const [marcados, setMarcados] = marcadosEntrada ?? propios;
  // 0.81.1 (quinta ronda, R5): en la entrada, las pestañas llevan lo ya marcado (antes, «Los
  // cuatro» aunque se hubieran marcado dos).
  const selStr = ids.length ? ids.join("+") : marcados.length ? marcados.join("+") : "todos";
  const alternar = (id: string) => {
    if (entrada) {
      const nuevos = marcados.includes(id)
        ? marcados.filter((x) => x !== id)
        : IDS_SISTEMA.filter((x) => marcados.includes(x) || x === id);
      // 0.92.3 (15.ª ronda, adjunto): con dos o más, la comparación en la ruta (el mismo Resumen,
      // filtrado): sobrevive a Atrás y a recargar, y sin «Comparar (n)», que no añadía nada.
      if (nuevos.length >= 2) {
        if (abierta) seguirAbierta = Date.now();
        setMarcados([]);
        window.location.replace(
          sec ? href("sistemas", nuevos.join("+"), sec) : href("sistemas", nuevos.join("+")),
        );
        return;
      }
      setMarcados(nuevos);
      return;
    }
    // 0.99.0 (17.ª ronda, R1; decisión del autor del 22-10-2026): en la ficha de un sistema, otro
    // sistema abre su ficha en la misma pestaña (antes se sumaba a una comparación y hacían falta
    // cuatro toques); comparar es la acción de al lado («Comparar»).
    // Salvo justo después de quitar uno de una comparación («cambiar uno por otro», 0.89.1): ahí,
    // el que se marca vuelve a la comparación.
    const recienDeComparacion = !!deComparacion && Date.now() - deComparacion.t < 120000;
    if (ids.length === 1 && id !== ids[0] && !recienDeComparacion) {
      navegar("sistemas", id, completa ? "completa" : (sec ?? "funciona"));
      return;
    }
    const nuevos = ids.includes(id)
      ? ids.filter((x) => x !== id)
      : IDS_SISTEMA.filter((x) => ids.includes(x) || x === id);
    if (abierta && nuevos.length > 1) seguirAbierta = Date.now();
    const vuelta =
      ids.length === 1 &&
      nuevos.length > 1 &&
      deComparacion &&
      Date.now() - deComparacion.t < 120000
        ? deComparacion.sec
        : null;
    deComparacion = null;
    if (ids.length > 1 && nuevos.length === 1) {
      deComparacion = { sec: sec ?? "", t: Date.now() };
      seguirAbierta = Date.now();
    }
    window.location.replace(
      vuelta === null
        ? rutaCon(nuevos)
        : vuelta
          ? href("sistemas", nuevos.join("+"), vuelta)
          : href("sistemas", nuevos.join("+")),
    );
    // De la ficha a la comparación (o al revés), arriba: es otra pantalla (0.72.0).
    if ((ids.length === 1) !== (nuevos.length === 1)) window.scrollTo({ top: 0 });
  };
  // 0.71.0: en escritorio la barra no se pliega (hay sitio). En el móvil, al bajar se pliega a
  // una línea («Control-IQ + Omnipod 5 · Cambiar») y, en la ficha de un sistema, empieza plegada:
  // el contenido queda en la primera pantalla. «Cambiar» la abre hasta el siguiente desplazamiento.
  // 0.96.1 (revisión de Codex, V95-03): el ancho, suscrito (antes se leía al montar: de 393 a
  // 768 px sin recargar, la barra se quedaba plegada sin botones de sistema).
  const [movil, setMovil] = useState(
    () => window.matchMedia?.("(max-width: 639px)").matches ?? false,
  );
  useEffect(() => {
    const mq = window.matchMedia?.("(max-width: 639px)");
    if (!mq) return;
    const alCambiar = () => setMovil(mq.matches);
    mq.addEventListener?.("change", alCambiar);
    return () => mq.removeEventListener?.("change", alCambiar);
  }, []);
  // Plegada de entrada en la ficha de un sistema y en la lista (las tarjetas ya eligen).
  const deEntrada = ids.length === 1 || (ids.length === 0 && !seccion);
  const [plegada, setPlegada] = useState(movil && deEntrada);
  // Al pasar al ordenador, desplegada (la barra plegada es solo del móvil).
  useEffect(() => {
    if (!movil) setPlegada(false);
  }, [movil]);
  const [abierta, setAbierta] = useState(() => Date.now() - seguirAbierta < 1500);
  // 0.81.1 (quinta ronda, visual): tras cambiar de pestaña en la comparación del móvil, la barra
  // sigue plegada (al desplegarse después de colocar la sección, la tapaba 100 px).
  const trasPestana = useRef(false);
  // Desde dónde se abrió la barra plegada (0.92.3): se cierra al alejarse de ahí.
  const abiertaEn = useRef(-1000);
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (movil && ids.length !== 1) {
      trasPestana.current = true;
      setPlegada(true);
    }
  }, [sec]); // eslint-disable-line react-hooks/exhaustive-deps
  // El nombre corto sobre las pestañas, solo cuando el título de la ficha ya no se ve.
  const [bajada, setBajada] = useState(false);
  const barra = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!movil) return;
    const onScroll = () => {
      setBajada(window.scrollY > 90);
      if (window.scrollY < 8) trasPestana.current = false;
      const lejos = window.scrollY > 220 || deEntrada || trasPestana.current;
      setPlegada((p) => (p !== lejos ? lejos : p));
      if (
        window.scrollY > 220 &&
        Date.now() - seguirAbierta > 1500 &&
        Math.abs(window.scrollY - abiertaEn.current) > 240
      )
        setAbierta(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [movil, deEntrada]);
  useEffect(() => {
    if (abrir > 0) setAbierta(true);
  }, [abrir]);
  // Pestañas en una fila: con más a la derecha, un desvanecido lo dice; la activa, a la vista.
  const pestanas = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = pestanas.current;
    if (!el) return;
    const medir = () =>
      el.setAttribute("data-mas", el.scrollLeft + el.clientWidth < el.scrollWidth - 2 ? "1" : "0");
    // 0.96.0 (16.ª ronda, R5): solo a lo ancho de la tira (scrollIntoView movía también la
    // página: al marcar o desmarcar un sistema en el móvil, la lectura subía cientos de px).
    const activa = el.querySelector<HTMLElement>("[aria-current]");
    if (activa) {
      const izq = activa.offsetLeft - el.offsetLeft;
      if (izq < el.scrollLeft || izq + activa.offsetWidth > el.scrollLeft + el.clientWidth)
        el.scrollLeft = izq - (el.clientWidth - activa.offsetWidth) / 2;
    }
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [ids, sec]);
  const compacta = plegada && !abierta;
  const resumen = ids.length
    ? ids.map((id) => SLUG_CORTO[columnaDeSistema(id as SistemaId)]).join(" · ")
    : "Los cuatro sistemas";
  return (
    <div
      ref={barra}
      // En la comparación del ordenador, la barra no se pega: lo que queda arriba al bajar es la
      // cabecera de la tabla, con los nombres de los sistemas (0.72.0).
      // 0.94.0 (rediseño): sin caja desde sm (borde y esquinas la hacían parecer un formulario):
      // las casillas y, debajo, la tira de pestañas apoyada en una línea a todo lo ancho, como en el
      // móvil.
      className={`barra-pegada separador no-imprimir sticky top-14 z-10 -mx-3 mb-4 border-b px-3 sm:mx-0 sm:px-0 sm:pt-2.5 ${ids.length === 1 ? "" : "md:static"} ${compacta && ids.length === 1 ? "" : "pt-2"}`}
    >
      {compacta && ids.length === 1 ? null : compacta ? (
        <button
          type="button"
          onClick={() => {
            // 0.92.3 (15.ª ronda, R5): con la página bajada, abrir la barra movía la página y el
            // desplazamiento la volvía a cerrar: se queda abierta hasta que se desplace de verdad.
            abiertaEn.current = window.scrollY;
            seguirAbierta = Date.now();
            setAbierta(true);
            // El foco, a la primera casilla (2.4.3: el botón desaparece al abrirse), sin desplazar.
            requestAnimationFrame(() =>
              barra.current
                ?.querySelector<HTMLElement>('[role="group"] button, [role="radiogroup"] button')
                ?.focus({ preventScroll: true }),
            );
          }}
          className="flex min-h-11 w-full items-center gap-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          aria-expanded={false}
        >
          {/* En la ficha, el nombre ya está en la cabecera y en cada sección (0.72.0). */}
          <span className="min-w-0 flex-1 truncate font-semibold text-slate-900">
            {ids.length === 1 ? "" : resumen}
          </span>
          <span className="shrink-0 text-sm font-semibold" style={{ color: SEEN.burdeos }}>
            {ids.length === 1
              ? "Otro sistema o comparación"
              : ids.length === 0 && !seccion
                ? "Comparar"
                : "Cambiar"}
          </span>
        </button>
      ) : (
        <CasillasSistema
          etiqueta="Sistemas"
          // En la ficha, uno solo (botón de opción): tocar otro cambia de ficha.
          unico={ids.length === 1}
          seleccion={(entrada ? marcados : ids).map((id) => columnaDeSistema(id as SistemaId))}
          onToggle={(c) => alternar(IDS_SISTEMA[c])}
          extra={
            entrada ? (
              marcados.length === 0 ? (
                // 0.83.1 (séptima ronda, adjunto): en el Resumen de los cuatro, «Los cuatro» también,
                // marcado (es lo que se ve), como en las demás pestañas.
                <button
                  type="button"
                  aria-pressed
                  className="chip tap-44 shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  Los cuatro
                </button>
              ) : (
                <a
                  // 0.84.1 (octava ronda, adjunto): desde el Resumen, al Resumen de los marcados
                  // (antes, a Características).
                  href={
                    marcados.length > 1
                      ? href("sistemas", marcados.join("+"), sec)
                      : rutaCon(marcados)
                  }
                  onClick={() => window.scrollTo({ top: 0 })}
                  className="tap-44 inline-flex min-h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-3 py-1 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  style={{ background: SEEN.burdeos }}
                >
                  {marcados.length === 1 ? "Ver la ficha" : `Comparar (${marcados.length})`}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              )
            ) : sec === "preguntas" ? (
              // 0.84.1 (octava ronda, visual y R3): el hueco de «Los cuatro», para que las
              // pestañas no salten al llegar a Preguntas.
              <span aria-hidden="true" className="chip invisible shrink-0">
                Los cuatro
              </span>
            ) : (
              // 0.79.1 (tercera ronda, adjunto): sin «Los cuatro» en Preguntas (no hay vista de
              // los cuatro: llevaba al Resumen).
              <button
                type="button"
                aria-pressed={ids.length === 0}
                onClick={() =>
                  ids.length === 1
                    ? navegar("sistemas", "todos", !sec || sec === "funciona" ? "esencial" : sec)
                    : window.location.replace(rutaCon([]))
                }
                className="chip tap-44 shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                {/* 0.99.0: en la ficha, la acción aparte de comparar (los cuatro, en la misma
                    sección); en la comparación, «Los cuatro». */}
                {ids.length === 1 ? "Comparar" : "Los cuatro"}
              </button>
            )
          }
        />
      )}
      {/* 0.77.1 (auditoría visual): en el móvil, con la barra plegada en la ficha, el nombre del
          sistema encima de las pestañas (la cabecera con el título queda fuera de la vista). */}
      {compacta && bajada && ids.length === 1 && (
        <p
          className="pt-1.5 text-[13px] font-bold leading-tight sm:hidden"
          style={{ color: SISTEMA_HEX[columnaDeSistema(ids[0] as SistemaId)].ink }}
        >
          {SLUG_CORTO[columnaDeSistema(ids[0] as SistemaId)]}
        </p>
      )}
      <nav
        ref={pestanas}
        aria-label="Sección"
        // 0.86.1 (décima ronda, visual y R1): a 360 px caben las cinco pestañas (sin hueco y con
        // 3 px de relleno: «Preguntas» quedaba cortada bajo el desvanecido).
        className="pestanas -mx-3 gap-0 px-3 sm:mx-0 sm:mt-1 sm:gap-1 sm:px-0 justify-between sm:justify-start"
      >
        {/* 0.72.1: las tarjetas son una vista más, al lado de las dos tablas: así se vuelve a
            ellas desde la comparación (antes solo con «Sistemas» abajo o Atrás). */}
        {ids.length !== 1 && (
          // 0.82.1 (sexta ronda, R5): con dos o más marcados, el Resumen de esos (antes, volvía a
          // los cuatro sin nada marcado).
          <a
            href={selStr.includes("+") ? href("sistemas", selStr) : href("sistemas")}
            aria-current={entrada || (ids.length > 1 && !sec) ? "location" : undefined}
            onFocus={pestanaALaVista}
            className="pestana tap-44 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Resumen
          </a>
        )}
        {secciones.map((x) => (
          <a
            key={x.id}
            href={href("sistemas", selStr, x.id)}
            aria-current={activa === x.id ? "location" : undefined}
            onFocus={pestanaALaVista}
            className="pestana tap-44 px-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:px-2"
          >
            {/* 0.73.0: en el móvil, el rótulo corto (las cinco pestañas caben a la vista). */}
            {"corto" in x && x.corto ? (
              <>
                <span className="sm:hidden">{x.corto}</span>
                <span className="hidden sm:inline">{x.t}</span>
              </>
            ) : (
              x.t
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* Entrada de Sistemas (#/sistemas): los cuatro con su foto y su algoritmo (Tabla 1), los
   criterios de elección y la comparación de los cuatro por sección. */
/* 0.77.0: cada sistema en una tarjeta operativa (src/fichaOperativa.ts): el algoritmo en la
   cabecera, tres datos, lo que añade su variante y los accesos a cada sección de su ficha. El
   texto literal, en la fuente al pie. */
function EntradaSistemas({ ids = [] }: { ids?: string[] }) {
  // 0.75.1 (auditoría): con sistemas marcados, solo sus tarjetas (como las otras pestañas).
  const visibles = CATALOGO_SISTEMAS.map((s, c) => ({ s, c })).filter(
    ({ s }) => !ids.length || ids.includes(s.id),
  );
  const datosDe = (c: number) =>
    RESUMEN.map((r) => ALGORITMO[c].find((d) => d.r === r)!).filter(Boolean);
  const todos = visibles.flatMap(({ c }) => [
    ALGORITMO[c][0],
    ...datosDe(c),
    ...(VARIANTE_RESUMEN[c] ? [VARIANTE_RESUMEN[c]!] : []),
  ]);
  return (
    <div className="space-y-4">
      {/* 0.77.1 (auditoría del adjunto): en pantallas anchas, 2 × 2, para ver los cuatro
          objetivos sin desplazarse. */}
      {/* 0.88.1 (duodécima ronda, adjunto): desde xl, las filas de las tarjetas vecinas a la misma
          altura (subgrid: cabecera, tres datos, variante y accesos). */}
      <ul className="grid gap-3 xl:grid-cols-2 xl:gap-y-0">
        {visibles.map(({ s, c }) => {
          const h = SISTEMA_HEX[c];
          const variante = VARIANTE_RESUMEN[c];
          const slug = SLUG_TABLA[c];
          // [rótulo, rótulo corto del móvil, ruta]
          const accesos: [string, string, string][] = [
            ["Indicación y material", "Indicación", href("sistemas", s.id, "esencial")],
            ["Parámetros", "Parámetros", href("sistemas", s.id, "parametros")],
            ["Modos y funciones", "Modos", href("sistemas", s.id, "modos")],
            ["Iniciación", "Iniciación", href("consultar", "inicio", `preparacion:${slug}`)],
            ["Plan de seguridad", "Plan", href("pacientes", "plan", s.id)],
          ];
          return (
            <li key={s.id} className="min-w-0 xl:row-span-6 xl:mb-3 xl:grid xl:grid-rows-subgrid">
              <article
                aria-label={s.name}
                className="tarjeta tarjeta-sistema flex h-full flex-col overflow-hidden xl:row-span-6 xl:grid xl:grid-rows-subgrid xl:gap-y-0"
                style={{ ["--sis" as string]: h.strong }}
              >
                <a
                  href={href("sistemas", s.id)}
                  // 0.90.1 (14.ª ronda, adjunto): desde xl, cabecera algo más baja: a 1366 × 768
                  // los cuatro objetivos entran enteros en la primera pantalla.
                  className="separador group flex items-center gap-3 border-b px-4 py-2.5 focus:outline-none xl:py-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-600"
                >
                  <img
                    src={FOTO_SISTEMA[s.id]}
                    alt=""
                    className="foto-sistema h-12 w-12 shrink-0 rounded-md bg-white object-cover xl:h-10 xl:w-10"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-lg font-extrabold leading-tight group-hover:underline"
                      style={{ color: h.ink }}
                    >
                      <NombreSistema n={s.name} />
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-slate-700">
                      {/* 0.96.0 (16.ª ronda): sin repetir el nombre de encima («Control-IQ · …»). */}
                      {sinCortes(tipoBajoNombre(c, s.name))}
                    </span>
                  </span>
                </a>
                <div className="flex-1 px-4 py-2.5 xl:row-span-4 xl:grid xl:grid-rows-subgrid xl:gap-y-1.5 xl:py-2">
                  <CasillasDatos c={c} datos={datosDe(c)} modo="resumen" />
                  {variante && (
                    <p className="mt-3 grid grid-cols-[auto_1fr] items-baseline gap-x-2 text-sm leading-snug text-slate-800">
                      <span className="insignia" style={{ background: h.soft, color: h.ink }}>
                        {variante.r}
                      </span>
                      <span className="min-w-0">{sinCortes(variante.v)}</span>
                    </p>
                  )}
                </div>
                {/* En el móvil, los accesos en una rejilla de 3 × 2 (antes, tres filas de enlaces
                    sueltos); desde sm, en una fila de enlaces de texto. */}
                <nav
                  aria-label={`Ficha de ${s.name}`}
                  // 0.89.1 (13.ª ronda, adjunto): desde xl (dos columnas), con los rótulos cortos en
                  // una línea: a 1366 × 768 los cuatro objetivos entran sin desplazarse.
                  className="separador flex flex-wrap justify-between gap-x-2 gap-y-0 border-t px-4 py-1 sm:justify-start sm:gap-x-2.5 xl:py-0.5"
                >
                  {accesos.map(([t, corto, ruta], k) => (
                    <Fragment key={t}>
                      {k > 0 && (
                        <span
                          aria-hidden="true"
                          className="hidden self-center text-slate-300 sm:inline"
                        >
                          ·
                        </span>
                      )}
                      <a href={ruta} className={accesoTarjeta}>
                        <span className="sm:hidden xl:inline" aria-hidden="true">
                          {corto}
                        </span>
                        <span className="sr-only sm:not-sr-only xl:sr-only">{t}</span>
                      </a>
                    </Fragment>
                  ))}
                </nav>
              </article>
            </li>
          );
        })}
      </ul>
      <a
        href={href("sistemas", "elegir")}
        // 0.92.0 (revisión de tarjetas, sistemas): un enlace con su flecha (como caja-fila suelta
        // parecía un panel plegado).
        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700"
      >
        Elección del sistema por características
        <ArrowRight size={14} aria-hidden="true" />
      </a>
      <FuentePie fuentes={fuentesDeDatos(todos)} />
    </div>
  );
}

/* 0.92.3 (15.ª ronda, adjunto): lo que las fichas añaden a la Tabla 4 (agua, alcohol y
   desconexión, de los apartados 7 y 10), comparado: la natación o la desconexión se eligen sin
   abrir las cuatro fichas. Los mismos datos que la pestaña Modos de cada ficha. */
/* 0.96.0 (16.ª ronda, senior): el rótulo, el de las fichas. El del agua no es el mismo en todas
   («Agua y deportes de contacto» en las tres bombas con catéter, «Agua» en Omnipod 5): con varios,
   el que abarca a los dos. */
const OTRAS_SITUACIONES = [
  { re: /^Alcohol/ },
  { re: /^Agua/, varios: "Agua y deportes de contacto" },
  { re: /^Desconexión/ },
];
function OtrasSituaciones({ cols, aLaVista }: { cols: number[]; aLaVista?: boolean }) {
  // 0.96.0 (16.ª ronda, adjunto): «modos:otras» (desde Elección) = este bloque, bajo la barra.
  const caja = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!aLaVista || !caja.current) return;
    const colocar = () => {
      if (!caja.current) return;
      // La barra solo cuenta si está pegada arriba (en el ordenador se va con la página).
      const barra = Math.max(
        0,
        document.querySelector(".barra-pegada")?.getBoundingClientRect().bottom ?? 0,
      );
      const arriba = caja.current.getBoundingClientRect().top - barra - 12;
      if (Math.abs(arriba) > 4) window.scrollTo({ top: Math.max(0, window.scrollY + arriba) });
    };
    colocar();
    // 0.97.1 (17.ª ronda, adjunto): otra vez cuando la tabla de encima ya ha terminado de medirse
    // (a 1366 × 768 el título quedaba 45 px bajo la barra).
    const t1 = setTimeout(colocar, 250);
    const t2 = setTimeout(colocar, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [aLaVista]);
  // Sin repeticiones: los sistemas que dicen lo mismo, juntos, con el texto una vez. 0.96.0 (16.ª
  // ronda, senior): la nota que es la misma en todos (la prudencia con los bolos en el alcohol, el
  // umbral de 1 h en la desconexión), una sola vez al final de la fila, sin rótulo de sistema
  // (antes, una vez por grupo: tres y dos veces).
  const filas = OTRAS_SITUACIONES.map((g) => {
    const datos = cols
      .map((c) => ({ c, d: MODOS[c].find((x) => g.re.test(x.r)) }))
      .filter((x): x is { c: number; d: (typeof MODOS)[number][number] } => !!x.d);
    const nota = datos[0]?.d.n;
    const notaComun = datos.length > 1 && !!nota && datos.every((x) => x.d.n === nota);
    const grupos: { cs: number[]; d: (typeof MODOS)[number][number] }[] = [];
    for (const { c, d } of datos) {
      const igual = grupos.find((x) => x.d.v === d.v && (notaComun || x.d.n === d.n));
      if (igual) igual.cs.push(c);
      else grupos.push({ cs: [c], d });
    }
    const rotulos = [...new Set(datos.map((x) => x.d.r))];
    const rotulo = rotulos.length > 1 && g.varios ? g.varios : rotulos[0];
    return { rotulo, grupos, nota: notaComun ? nota : undefined };
  }).filter((f) => f.grupos.length);
  if (!filas.length) return null;
  return (
    <section
      ref={caja}
      aria-labelledby="otras-situaciones"
      className="tarjeta mt-5 overflow-hidden"
    >
      <h2 id="otras-situaciones" className="titulo-tarjeta px-4 pb-1 pt-3">
        Agua, alcohol y desconexión
      </h2>
      <dl className="divide-y divide-[var(--linea-suave)]">
        {filas.map((f) => (
          <div
            key={f.rotulo}
            className="grid gap-x-5 gap-y-1 px-4 py-3 sm:grid-cols-[minmax(9rem,12rem)_1fr]"
          >
            {/* 0.96.0 (16.ª ronda, senior): el rótulo lleva al literal, como en las fichas (la
                primera fuente del primer sistema; el resto, en la línea de fuentes del pie). */}
            <dt className="min-w-0">
              {(() => {
                const ruta = literalDe(f.grupos[0].d.f[0], f.grupos[0].cs[0]);
                return ruta ? (
                  <a
                    href={ruta}
                    className="tap-44 inline-block min-h-6 py-0.5 text-[15px] font-semibold leading-snug text-slate-900 underline decoration-[var(--linea-fuerte)] decoration-dotted decoration-1 underline-offset-4 hover:decoration-solid hover:decoration-slate-700"
                    title="Texto del capítulo"
                  >
                    {f.rotulo}
                  </a>
                ) : (
                  <span className="text-[15px] font-semibold leading-snug text-slate-900">
                    {f.rotulo}
                  </span>
                );
              })()}
            </dt>
            <dd className="min-w-0 max-w-[72ch] space-y-2 text-[15px] leading-snug text-slate-800">
              {f.grupos.map(({ cs, d }) => (
                <div key={cs.join("-")}>
                  {f.grupos.length > 1 || cs.length < cols.length ? (
                    <span className="mb-0.5 flex flex-wrap gap-x-3 text-[13px] font-semibold">
                      {cs.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1"
                          style={{ color: SISTEMA_HEX[c].ink }}
                        >
                          <span
                            aria-hidden="true"
                            className="punto-sistema h-2 w-2 rounded-full"
                            style={{
                              ["--sis" as string]: SISTEMA_HEX[c].strong,
                              background: "var(--sis)",
                            }}
                          />
                          {CORTO_SISTEMA[c]}
                        </span>
                      ))}
                    </span>
                  ) : null}
                  {/* 0.96.0 (16.ª ronda, visual): intervalos sin partir («12–24 h»). */}
                  <span className="block">
                    <SinCortes texto={d.v} />
                  </span>
                  {/* 1.0.1 (19.ª ronda, senior): las notas llevan umbrales y riesgos («más de 1 h…»):
                      14 px y texto oscuro (antes, 13 px en gris, como una fuente). */}
                  {d.n && !f.nota && (
                    <span className="mt-0.5 block text-sm text-slate-700">
                      <SinCortes texto={d.n} />
                    </span>
                  )}
                </div>
              ))}
              {f.nota && (
                <p className="text-sm text-slate-700">
                  <SinCortes texto={f.nota} />
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <FuentePie
        className="separador border-t px-4 py-2"
        fuentes={fuentesDeDatos(filas.flatMap((f) => f.grupos.map((g) => g.d)))}
      />
    </section>
  );
}

/* Tarjeta de un sistema dentro de la comparación, para lo que no cabe en columnas
   («Cómo funciona» y la ampliación técnica se leen sistema a sistema). */
function TarjetaSistema({
  c,
  seccion,
  texto,
  enlace,
}: {
  c: number;
  seccion: string;
  texto: ReactNode;
  enlace: string;
}) {
  // Solo el nombre de la Tabla 1 y lo que dice el capítulo (`texto`): sin el resumen ni los
  // rasgos de la ampliación técnica (edición editorial, A06).
  const id = ORDEN_SISTEMAS[c];
  const nombre = TABLAS.T1.columnas[c];
  const h = SISTEMA_HEX[c];
  return (
    <li
      className="tarjeta tarjeta-sistema flex gap-3 p-3"
      style={{ ["--sis" as string]: h.strong }}
    >
      <img
        src={FOTO_SISTEMA[id]}
        alt=""
        className="h-16 w-16 shrink-0 rounded-md object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="text-base font-extrabold" style={{ color: h.ink }}>
          {nombre}
        </div>
        <div className="mt-1 text-sm text-slate-700">{texto}</div>
        <a
          href={href("sistemas", id, seccion)}
          className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
        >
          {enlace} <ArrowRight size={13} aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

function Comparacion({
  ids,
  seccion: pedida,
  fila,
}: {
  ids: string[];
  seccion?: string;
  fila?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useImprimirConTeclado(ref);
  const marcadosEntrada = useState<string[]>([]);
  const cols = ids.length ? ids.map((id) => columnaDeSistema(id as SistemaId)) : [0, 1, 2, 3];
  // «Cómo funciona» comparado ya no está (0.70.0): esa dirección lleva a la Tabla 1.
  // «Cómo funciona» comparado lleva a la Tabla 1; una sección sin vista de varios (Modos,
  // Preguntas) vuelve al Resumen (0.77.1: antes, la pantalla quedaba vacía).
  const enComparacion = (x?: string) => SECCIONES_COMPARACION.some((y) => y.id === x);
  const seccion = pedida === "funciona" ? "esencial" : enComparacion(pedida) ? pedida : undefined;
  // 0.96.1 (revisión de Codex, V95-07): por debajo de xl, Parámetros empieza por un parámetro en
  // los sistemas elegidos («parametros:basal», enlazable); «Por sistema», las tarjetas de siempre.
  const [porSistema, setPorSistema] = useState(false);
  const aspecto = Math.max(
    0,
    ASPECTOS_PARAMETRO.findIndex((x) => x.id === fila),
  );
  const tabla3 = useRef<HTMLDivElement>(null);
  // Un conmutador ligero (texto subrayado): la elección fuerte es la del parámetro.
  const conmutador = (on: boolean) =>
    `tap-44 inline-flex min-h-11 items-center px-1 text-[14px] underline-offset-[6px] ${on ? "font-semibold text-slate-900 underline decoration-2" : "text-slate-600 hover:text-slate-900"}`;
  // 0.80.1 (cuarta ronda, visual): como en la ficha, al cambiar de pestaña desde abajo la sección
  // empieza justo bajo la barra pegada.
  useEffect(() => {
    // 0.86.1 (décima ronda, R5): con una fila pedida («esencial:8»), manda la fila (la tabla ya
    // la pone a la vista; esto la devolvía al principio de la sección).
    if (fila) return;
    const el = ref.current?.querySelector<HTMLElement>("section.pantalla-in");
    const barra = document.querySelector(".barra-pegada")?.getBoundingClientRect().bottom ?? 0;
    const arriba = el?.getBoundingClientRect().top ?? 0;
    if (el && arriba < barra)
      window.scrollTo({ top: Math.max(0, window.scrollY + arriba - barra - 8) });
  }, [seccion, fila]);
  return (
    <div ref={ref} className="imprimible">
      <CabeceraEditorial
        titulo="Sistemas AID"
        hex={hex}
        level={1}
        // 0.83.1 (séptima ronda, adjunto): la misma cabecera en las cuatro pestañas (en el Resumen
        // faltaba «Imprimir» y las pestañas saltaban 16 px).
        accion={
          <BotonImprimir objetivo={ref} compacto>
            Imprimir
          </BotonImprimir>
        }
      />
      <BarraSistemas ids={ids} seccion={seccion} marcadosEntrada={marcadosEntrada} />
      {!seccion ? (
        <EntradaSistemas ids={ids.length ? ids : marcadosEntrada[0]} />
      ) : (
        <section
          key={seccion}
          className="pantalla-in"
          aria-label={SECCIONES_COMPARACION.find((x) => x.id === seccion)?.t}
        >
          {seccion === "esencial" && (
            <NivelTitulo.Provider value={2}>
              <TablaVista
                tabla={TABLAS.T1}
                columnasFijas={cols}
                herramienta
                // 0.85.1 (novena ronda, R5): «esencial:8» = la fila de la gestación marcada.
                resaltarFila={fila !== undefined && /^\d+$/.test(fila) ? Number(fila) : undefined}
              />
            </NivelTitulo.Provider>
          )}
          {seccion === "parametros" && (
            <>
              {/* 0.77.0: qué parámetros actúan en automático en cada sistema, en una tarjeta
                  por sistema (Tablas 1 y 3; src/fichaOperativa.ts); debajo, la Tabla 3. */}
              <div className="no-imprimir mb-4 xl:hidden">
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  <div role="group" aria-label="Ver los parámetros" className="flex gap-3">
                    <button
                      type="button"
                      aria-pressed={!porSistema}
                      onClick={() => setPorSistema(false)}
                      className={conmutador(!porSistema)}
                    >
                      Por parámetro
                    </button>
                    <button
                      type="button"
                      aria-pressed={porSistema}
                      onClick={() => setPorSistema(true)}
                      className={conmutador(porSistema)}
                    >
                      Por sistema
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      tabla3.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="tap-44 ml-auto inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    Tabla 3 completa
                    <ArrowDown size={14} aria-hidden="true" />
                  </button>
                </div>
                {!porSistema && (
                  <AspectoEntreSistemas
                    cols={cols}
                    datos={PARAMETROS}
                    nombre={(c) => <NombreSistema n={CORTO_SISTEMA[c]} />}
                    ficha={(c, d) =>
                      href("sistemas", ORDEN_SISTEMAS[c], `parametros:${slugDato(d.r)}`)
                    }
                    aspecto={aspecto}
                    onAspecto={(i) =>
                      elegirRuta(
                        "sistemas",
                        ids.length ? ids.join("+") : "todos",
                        `parametros:${ASPECTOS_PARAMETRO[i].id}`,
                      )
                    }
                  />
                )}
              </div>
              {/* 0.87.1 (undécima ronda, adjunto): con dos sistemas, dos columnas (antes, media fila vacía). */}
              <ul
                className={`mb-4 gap-3 sm:grid-cols-2 ${cols.length > 2 ? "xl:grid-cols-4" : ""} ${porSistema ? "grid" : "hidden xl:grid print:grid"}`}
              >
                {cols.map((c) => {
                  const h = SISTEMA_HEX[c];
                  // 0.78.1 (segunda ronda, senior): lo que solo cuenta al inicio y lo que no se
                  // configura, en su propia línea (antes, en «Bolos o modo manual» o en ninguna).
                  const de = (a: "si" | "no" | "inicio" | "fijo" | "manual") =>
                    PARAMETROS[c].filter((d) => d.auto === a).map((d) => d.r);
                  const grupos = [
                    { r: "Actúan en automático", xs: de("si"), fuerte: true },
                    { r: "Sobre todo en bolos o manual", xs: de("no"), fuerte: false },
                    { r: "Solo al inicio y en manual", xs: de("inicio"), fuerte: false },
                    { r: "Solo en manual o de respaldo", xs: de("manual"), fuerte: false },
                    { r: "No configurable", xs: de("fijo"), fuerte: false },
                  ].filter((g) => g.xs.length);
                  return (
                    <li
                      key={c}
                      className="tarjeta tarjeta-sistema min-w-0 p-3"
                      style={{ ["--sis" as string]: h.strong }}
                    >
                      <a
                        href={href("sistemas", ORDEN_SISTEMAS[c], "parametros")}
                        // 0.92.0 (revisión de tarjetas): en cuatro columnas, dos líneas de alto
                        // para todos (el de Tandem, en dos, bajaba su tarjeta 18 px).
                        className={`titulo-tarjeta tap-44 inline-block min-h-6 hover:underline ${cols.length > 2 ? "xl:min-h-10" : ""}`}
                        style={{ color: h.ink }}
                      >
                        {/* 0.96.0 (16.ª ronda, R5): nombre corto en las tarjetas de la comparación. */}
                        <NombreSistema n={CORTO_SISTEMA[c]} />
                      </a>
                      {/* 0.94.0 (rediseño): cada grupo abre con su línea capilar, como los datos
                          de las fichas. */}
                      {/* 0.94.1 (petición del responsable: «los fonts y las líneas no se ven
                          bien»): cada grupo con la etiqueta de la ficha (en el color del sistema
                          lo que actúa en automático) y un parámetro por línea (antes, rótulos en
                          mayúsculas partidos en dos líneas y los parámetros unidos por «·»). */}
                      <dl className="mt-2.5 space-y-3">
                        {grupos.map((g) => (
                          <div key={g.r} className="border-t border-[var(--linea-suave)] pt-2.5">
                            <dt>
                              <span
                                className="insignia"
                                style={g.fuerte ? { background: h.soft, color: h.ink } : undefined}
                              >
                                {g.r}
                              </span>
                            </dt>
                            <dd className="mt-1.5">
                              <ul
                                className={`space-y-0.5 text-[15px] leading-snug ${g.fuerte ? "font-semibold text-slate-900" : "text-slate-800"}`}
                              >
                                {g.xs.map((x) => (
                                  <li key={x}>{x}</li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  );
                })}
              </ul>
              <FuentePie
                className="-mt-2 mb-4"
                fuentes={fuentesDeDatos(cols.flatMap((c) => PARAMETROS[c]))}
              />
              <div ref={tabla3} id="tabla-3-comparada" className="scroll-mt-36">
                <NivelTitulo.Provider value={2}>
                  <TablaVista tabla={TABLAS.T3} columnasFijas={cols} herramienta />
                </NivelTitulo.Provider>
              </div>
            </>
          )}
          {seccion === "modos" && (
            <>
              <NivelTitulo.Provider value={2}>
                <TablaVista tabla={TABLAS.T4} columnasFijas={cols} herramienta />
              </NivelTitulo.Provider>
              <OtrasSituaciones cols={cols} aLaVista={fila === "otras"} />
            </>
          )}
          {seccion === "ampliacion" && CON_AMPLIACION && (
            <>
              <p className="mb-3 text-sm text-slate-600">
                Ficha técnica de cada sistema con sus fuentes, fuera del capítulo; se consulta
                sistema a sistema.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {cols.map((c) => (
                  <TarjetaSistema
                    key={c}
                    c={c}
                    seccion="ampliacion"
                    texto={`Última verificación: ${SISTEMAS_AMPLIACION[c].verified}.`}
                    enlace="Ampliación técnica"
                  />
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      {/* 0.96.0 (16.ª ronda, visual): en papel, el mismo pie que la ficha. */}
      <ColofonImpreso />
    </div>
  );
}
