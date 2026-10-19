/* Sistemas: una sola pantalla para uno o varios. Uno = su ficha, la misma para entender y para
   consultar, en secciones con ruta propia (#/sistemas/<id>/<seccion>): Características (Tabla 1),
   Cómo funciona, Parámetros (Tablas 1 y 3), Situaciones (Tabla 4), literales, con la fuente al
   pie de cada bloque (componentes/FuentePie), y
   aparte la Ampliación técnica, fuera del capítulo y con sus fuentes. Varios o todos
   (#/sistemas/<a+b|todos>/<seccion>) = la misma sección, un sistema junto a otro: eso son
   «Comparar sistemas» y «Parámetros por sistema». */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, ExternalLink, Minus, X } from "lucide-react";
import { APARTADOS, TABLAS, idDeBloque, type Bloque, type Tabla } from "../contenido";
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
import { elegirRuta, href, fueNavegacionNueva } from "../rutas";
import { BotonImprimir, CabeceraEditorial, Foldable } from "../ui";
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
import { CATALOGO_SISTEMAS, sistemaDelCatalogo } from "../ampliacion/ids";
import { Elegir } from "./Elegir";

export { Elegir };
import { FRECUENTES } from "../frecuentes";
import { NombreSistema } from "../componentes/NombreSistema";
import {
  ALGORITMO,
  INDICACION,
  MODOS,
  PARAMETROS,
  RESUMEN,
  VARIANTE_RESUMEN,
  fuentesDeDatos,
} from "../fichaOperativa";
import { CasillasDatos, FilasDatos, GruposDatos } from "../componentes/FichaOperativa";
import { ComoFuncionaOperativo } from "../componentes/ComoFuncionaOperativo";
import { FuentePie } from "../componentes/FuentePie";
import { paginasDe } from "../paginas";

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
  }[] = [];
  // 0.77.1 (auditoría R3): con su subapartado, para distinguir las menciones de un mismo apartado
  // («Situaciones especiales · Gestación», «… · Ejercicio físico»).
  for (const a of APARTADOS) {
    let sub = "";
    a.bloques.forEach((b, i) => {
      if (b.t === "h3") sub = b.texto;
      if (b.t === "p" && re.test(plano(b.texto)))
        out.push({ slug: a.slug, titulo: a.titulo, sub, ancla: idDeBloque(b, i), b });
    });
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
const accesoFicha =
  "tap-44 inline-flex min-h-11 items-center px-0.5 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700 sm:min-h-9";

/* Los accesos de cada tarjeta de la entrada: botones en el móvil, enlaces de texto desde sm. */
const accesoTarjeta =
  "flex min-h-11 items-center justify-center rounded-md border border-[var(--linea)] px-1 text-center text-[13px] font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900 sm:border-0 sm:inline-flex sm:min-h-9 sm:justify-start sm:rounded-none sm:bg-transparent sm:px-0.5 sm:text-sm sm:text-slate-700 sm:underline sm:decoration-slate-300 sm:underline-offset-4 sm:hover:text-slate-900 sm:hover:decoration-slate-700";

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
  { id: "esencial", t: "Características" },
  { id: "parametros", t: "Parámetros" },
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
function trozosDe(f: (typeof FRECUENTES)[number], c: number, vistos: Set<string>): TrozoImpreso[] {
  const trozos: TrozoImpreso[] = [];
  const poner = (bloque: string, tipo: "p" | "li", texto: string) => {
    if (!texto || vistos.has(texto)) return;
    vistos.add(texto);
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
      // 0.77.1 (auditoría R3): las filas de las Tablas 1–4 ya las resumen las tarjetas de la ficha
      // impresa; en papel, bajo la pregunta, solo los párrafos y las demás tablas.
      continue;
    } else if (/^T\d+$/.test(p[0])) {
      const t = TABLAS[p[0] as keyof typeof TABLAS];
      if (!t) continue;
      if (p[1] === "nota") poner(id, "p", plano(t.notas[Number(p[2])] ?? ""));
      else poner(`${p[0]}/${p[1]}`, "p", textoDeFila(t, Number(p[1]), c));
    }
  }
  return trozos;
}
function RespuestaImpresa({ trozos }: { trozos: TrozoImpreso[] }) {
  if (!trozos.length)
    return (
      <p className="hidden px-4 pb-3 text-[13px] text-slate-600 print:block">
        En las secciones anteriores de esta ficha.
      </p>
    );
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

export function FichaSistema({ id, seccion }: { id?: string; seccion?: string }) {
  const s = sistemaDelCatalogo(id);
  const ref = useRef<HTMLDivElement>(null);
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
    document.getElementById(seccion)?.scrollIntoView?.({ block: "start" });
  }, [seccion, id, completa]);
  if (!s) return <Comparacion ids={[]} />;
  const c = columnaDeSistema(s.id);
  const h = SISTEMA_HEX[c];
  const slug = SLUG_TABLA[c];
  // Las preguntas frecuentes del sistema (columna de la Tabla 1). 0.77.1 (auditorías senior y R3):
  // todas, como en Preguntas frecuentes (antes se quitaban las que solo citaban casillas).
  const preguntas = FRECUENTES.filter((f) => f.sistema === c);
  const impresas = respuestasImpresas(preguntas, c);
  // Una sola página (0.70.0): la sección de la ruta es solo adónde se salta.
  const sec = completa ? undefined : seccion;
  // 0.73.0 (auditoría de uso): cada pestaña enseña solo su sección (la ficha entera medía casi
  // cinco pantallas en el móvil); «completa» las enseña todas.
  const vista = sec && SECCIONES_FICHA.some((x) => x.id === sec) ? sec : "funciona";
  const ver = (id: string) => completa || vista === id;
  // En papel se imprime la ficha entera: las secciones de otras pestañas van ocultas en pantalla.
  const papel = (id: string) => (ver(id) ? "" : "hidden print:block print:mt-7");
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
      <header className="mb-2 grid grid-cols-[auto_1fr] items-center gap-x-3 sm:mb-4 sm:items-start sm:gap-x-4">
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
              {s.name}
            </h1>
            <div className="no-imprimir shrink-0">
              <BotonImprimir objetivo={ref} compacto>
                Imprimir la ficha
              </BotonImprimir>
            </div>
          </div>
        </div>
        {/* Sistema visual: los tres accesos como enlaces de texto en una fila (en el móvil eran tres
            botones apilados antes del contenido). */}
        <div className="no-imprimir col-span-2 mt-0.5 flex flex-wrap gap-x-3 gap-y-0 sm:col-span-1 sm:col-start-2 sm:mt-0 sm:gap-x-4">
          <a
            // I61-04: al principio del recorrido (preparación), con el sistema; no al paso 5.
            href={href("consultar", "inicio", `preparacion:${slug}`)}
            className={accesoFicha}
          >
            <span className="sm:hidden">Iniciación</span>
            <span className="hidden sm:inline">Iniciación del sistema</span>
          </a>
          <a href={href("pacientes", "plan", s.id)} className={accesoFicha}>
            {/* Rótulo corto en el móvil; el nombre accesible, siempre el completo. */}
            <span className="sm:hidden" aria-hidden="true">
              Plan
            </span>
            <span className="sr-only sm:not-sr-only">Plan de seguridad</span>
          </a>
          <a href={href("consultar", "situacion", `:${slug}`)} className={accesoFicha}>
            Situaciones
          </a>
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
            className={`${accesoFicha} sm:hidden`}
          >
            Otro sistema
          </button>
        </div>
      </header>

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
          <FilasDatos c={c} datos={PARAMETROS[c]} titulo="Parámetros" />
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
          className={`${mt} scroll-mt-2 print:mt-8 ${papel("preguntas")}`}
        >
          <TituloSeccion id="preguntas" sistema={s.name} color={h.ink} visible={completa}>
            Preguntas frecuentes
          </TituloSeccion>
          <ul
            className="filas tarjeta tarjeta-sistema overflow-hidden"
            style={{ ["--sis" as string]: h.strong }}
          >
            {preguntas.map((f) => (
              <li key={f.id}>
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
        </section>
      )}

      {/* En papel, sin los párrafos (0.72.0: la ficha impresa salía en cinco caras). */}
      {ver("funciona") && (
        <section aria-label="Más del capítulo sobre este sistema" className="no-imprimir mt-7">
          <Foldable title="Menciones en el capítulo" count={parrafos.length}>
            {/* 0.73.0: enlaces a cada párrafo (antes, los párrafos enteros: repetían el
                capítulo dentro de la ficha). */}
            <ul className="filas">
              {parrafos.map((p) => (
                <li key={p.slug + p.ancla}>
                  <a
                    href={href("capitulo", p.slug, p.ancla)}
                    className="flex min-h-11 items-center gap-2 py-1.5 text-sm text-slate-800 hover:underline"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="font-semibold">{p.titulo}</span>
                      {p.sub && <span className="font-semibold"> · {p.sub}</span>}
                      {p.b.lead && <span className="text-slate-600"> · {p.b.lead}</span>}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">
                      {paginasDe(p.b.p, p.b.p2)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Foldable>
        </section>
      )}

      {CON_AMPLIACION && <Ampliacion s={sistemaPorId(s.id)!} />}
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

export function Sistemas({ sel, seccion }: { sel?: string; seccion?: string }) {
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
  if (ids.length === 1) return <FichaSistema id={ids[0]} seccion={sec} />;
  return <Comparacion ids={ids} seccion={sec === "completa" ? "esencial" : sec} />;
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
function BarraSistemas({
  ids,
  seccion,
  abrir = 0,
  completa = false,
}: {
  ids: string[];
  seccion?: string;
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
  const selStr = ids.length ? ids.join("+") : "todos";
  const rutaCon = (nuevos: string[]) =>
    nuevos.length === 1
      ? href("sistemas", nuevos[0], sec ?? "funciona")
      : href(
          "sistemas",
          nuevos.length ? nuevos.join("+") : "todos",
          !sec || sec === "funciona" ? "esencial" : sec,
        );
  // En la entrada (los cuatro), las casillas se van marcando sin cambiar de pantalla; con dos
  // o más, «Comparar» (0.72.0: la primera casilla llevaba a la ficha).
  const entrada = ids.length === 0 && !sec;
  const [marcados, setMarcados] = useState<string[]>([]);
  const alternar = (id: string) => {
    if (entrada) {
      setMarcados((m) =>
        m.includes(id)
          ? m.filter((x) => x !== id)
          : IDS_SISTEMA.filter((x) => m.includes(x) || x === id),
      );
      return;
    }
    const nuevos = ids.includes(id)
      ? ids.filter((x) => x !== id)
      : IDS_SISTEMA.filter((x) => ids.includes(x) || x === id);
    window.location.replace(rutaCon(nuevos));
    // De la ficha a la comparación (o al revés), arriba: es otra pantalla (0.72.0).
    if ((ids.length === 1) !== (nuevos.length === 1)) window.scrollTo({ top: 0 });
  };
  // 0.71.0: en escritorio la barra no se pliega (hay sitio). En el móvil, al bajar se pliega a
  // una línea («Control-IQ + Omnipod 5 · Cambiar») y, en la ficha de un sistema, empieza plegada:
  // el contenido queda en la primera pantalla. «Cambiar» la abre hasta el siguiente desplazamiento.
  const [movil] = useState(() => window.matchMedia?.("(max-width: 639px)").matches ?? false);
  // Plegada de entrada en la ficha de un sistema y en la lista (las tarjetas ya eligen).
  const deEntrada = ids.length === 1 || (ids.length === 0 && !seccion);
  const [plegada, setPlegada] = useState(movil && deEntrada);
  const [abierta, setAbierta] = useState(false);
  const barra = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!movil) return;
    const onScroll = () => {
      const lejos = window.scrollY > 220 || deEntrada;
      setPlegada((p) => (p !== lejos ? lejos : p));
      if (window.scrollY > 220) setAbierta(false);
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
    el.querySelector<HTMLElement>("[aria-current]")?.scrollIntoView?.({
      block: "nearest",
      inline: "nearest",
    });
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
    ? ids.map((id) => SLUG_CORTO[columnaDeSistema(id as SistemaId)]).join(" + ")
    : "Los cuatro sistemas";
  return (
    <div
      ref={barra}
      // En la comparación del ordenador, la barra no se pega: lo que queda arriba al bajar es la
      // cabecera de la tabla, con los nombres de los sistemas (0.72.0).
      className={`barra-pegada separador no-imprimir sticky top-14 z-10 -mx-3 mb-4 border-b px-3 sm:mx-0 sm:rounded-lg sm:border sm:px-3 sm:pt-2 ${ids.length === 1 ? "" : "lg:static"} ${compacta && ids.length === 1 ? "" : "pt-2"}`}
    >
      {compacta && ids.length === 1 ? null : compacta ? (
        <button
          type="button"
          onClick={() => {
            setAbierta(true);
            // El foco, a la primera casilla (2.4.3: el botón desaparece al abrirse).
            requestAnimationFrame(() =>
              barra.current?.querySelector<HTMLElement>('[role="group"] button')?.focus(),
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
          seleccion={(entrada ? marcados : ids).map((id) => columnaDeSistema(id as SistemaId))}
          onToggle={(c) => alternar(IDS_SISTEMA[c])}
          extra={
            entrada ? (
              marcados.length > 0 && (
                <a
                  href={rutaCon(marcados)}
                  onClick={() => window.scrollTo({ top: 0 })}
                  className="tap-44 inline-flex min-h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-3 py-1 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  style={{ background: SEEN.burdeos }}
                >
                  {marcados.length === 1 ? "Ver la ficha" : `Comparar (${marcados.length})`}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              )
            ) : (
              <button
                type="button"
                aria-pressed={ids.length === 0}
                onClick={() => window.location.replace(rutaCon([]))}
                className="chip tap-44 shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Los cuatro
              </button>
            )
          }
        />
      )}
      {/* 0.77.1 (auditoría visual): en el móvil, con la barra plegada en la ficha, el nombre del
          sistema encima de las pestañas (la cabecera con el título queda fuera de la vista). */}
      {compacta && ids.length === 1 && (
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
        className="pestanas -mx-3 px-3 sm:mx-0 sm:mt-1 sm:gap-1 sm:px-0"
      >
        {/* 0.72.1: las tarjetas son una vista más, al lado de las dos tablas: así se vuelve a
            ellas desde la comparación (antes solo con «Sistemas» abajo o Atrás). */}
        {ids.length !== 1 && (
          <a
            href={href("sistemas")}
            aria-current={entrada ? "location" : undefined}
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
            className="pestana tap-44 px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:px-2"
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
      <ul className="grid gap-3 xl:grid-cols-2">
        {visibles.map(({ s, c }) => {
          const h = SISTEMA_HEX[c];
          const variante = VARIANTE_RESUMEN[c];
          const slug = SLUG_TABLA[c];
          // [rótulo, rótulo corto del móvil, ruta]
          const accesos: [string, string, string][] = [
            ["Cómo funciona", "Funciona", href("sistemas", s.id, "funciona")],
            ["Indicación y material", "Indicación", href("sistemas", s.id, "esencial")],
            ["Parámetros", "Parámetros", href("sistemas", s.id, "parametros")],
            ["Modos y funciones", "Modos", href("sistemas", s.id, "modos")],
            ["Iniciación", "Iniciación", href("consultar", "inicio", `preparacion:${slug}`)],
            ["Plan de seguridad", "Plan", href("pacientes", "plan", s.id)],
          ];
          return (
            <li key={s.id} className="min-w-0">
              <article
                aria-label={s.name}
                className="tarjeta tarjeta-sistema flex h-full flex-col overflow-hidden"
                style={{ ["--sis" as string]: h.strong }}
              >
                <a
                  href={href("sistemas", s.id)}
                  className="separador group flex items-center gap-3 border-b px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-600"
                >
                  <img
                    src={FOTO_SISTEMA[s.id]}
                    alt=""
                    className="foto-sistema h-14 w-14 shrink-0 rounded-md bg-white object-cover"
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
                      {ALGORITMO[c][0].v}
                    </span>
                  </span>
                </a>
                <div className="flex-1 px-4 py-3">
                  <CasillasDatos c={c} datos={datosDe(c)} modo="resumen" />
                  {variante && (
                    <p className="mt-3 grid grid-cols-[auto_1fr] items-baseline gap-x-2 text-sm leading-snug text-slate-800">
                      <span className="insignia" style={{ background: h.soft, color: h.ink }}>
                        {variante.r}
                      </span>
                      <span className="min-w-0">{variante.v}</span>
                    </p>
                  )}
                </div>
                {/* En el móvil, los accesos en una rejilla de 3 × 2 (antes, tres filas de enlaces
                    sueltos); desde sm, en una fila de enlaces de texto. */}
                <nav
                  aria-label={`Ficha de ${s.name}`}
                  className="separador grid grid-cols-3 gap-1.5 border-t p-3 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-0 sm:px-4 sm:py-1"
                >
                  {accesos.map(([t, corto, ruta]) => (
                    <a key={t} href={ruta} className={accesoTarjeta}>
                      <span className="sm:hidden" aria-hidden="true">
                        {corto}
                      </span>
                      <span className="sr-only sm:not-sr-only">{t}</span>
                    </a>
                  ))}
                </nav>
              </article>
            </li>
          );
        })}
      </ul>
      <a
        href={href("sistemas", "elegir")}
        className="tarjeta fila focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
      >
        <span className="min-w-0 flex-1">Elección del sistema</span>
      </a>
      <FuentePie fuentes={fuentesDeDatos(todos)} />
    </div>
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

function Comparacion({ ids, seccion: pedida }: { ids: string[]; seccion?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const cols = ids.length ? ids.map((id) => columnaDeSistema(id as SistemaId)) : [0, 1, 2, 3];
  // «Cómo funciona» comparado ya no está (0.70.0): esa dirección lleva a la Tabla 1.
  // «Cómo funciona» comparado lleva a la Tabla 1; una sección sin vista de varios (Modos,
  // Preguntas) vuelve al Resumen (0.77.1: antes, la pantalla quedaba vacía).
  const enComparacion = (x?: string) => SECCIONES_COMPARACION.some((y) => y.id === x);
  const seccion = pedida === "funciona" ? "esencial" : enComparacion(pedida) ? pedida : undefined;
  return (
    <div ref={ref} className="imprimible">
      <CabeceraEditorial
        titulo="Sistemas AID"
        hex={hex}
        level={1}
        accion={
          seccion && (
            <BotonImprimir objetivo={ref} compacto>
              Imprimir
            </BotonImprimir>
          )
        }
      />
      <BarraSistemas ids={ids} seccion={seccion} />
      {!seccion ? (
        <EntradaSistemas ids={ids} />
      ) : (
        <section
          key={seccion}
          className="pantalla-in"
          aria-label={SECCIONES_COMPARACION.find((x) => x.id === seccion)?.t}
        >
          {seccion === "esencial" && (
            <NivelTitulo.Provider value={2}>
              <TablaVista tabla={TABLAS.T1} columnasFijas={cols} herramienta />
            </NivelTitulo.Provider>
          )}
          {seccion === "parametros" && (
            <>
              {/* 0.77.0: qué parámetros actúan en automático en cada sistema, en una tarjeta
                  por sistema (Tablas 1 y 3; src/fichaOperativa.ts); debajo, la Tabla 3. */}
              <ul className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {cols.map((c) => {
                  const h = SISTEMA_HEX[c];
                  const de = (a: boolean) =>
                    PARAMETROS[c]
                      .filter((d) => (a ? d.auto === "si" : d.auto === "no" || d.auto === "inicio"))
                      .map((d) => d.r);
                  return (
                    <li
                      key={c}
                      className="tarjeta tarjeta-sistema min-w-0 p-3"
                      style={{ ["--sis" as string]: h.strong }}
                    >
                      <a
                        href={href("sistemas", ORDEN_SISTEMAS[c], "parametros")}
                        className="titulo-tarjeta hover:underline"
                        style={{ color: h.ink }}
                      >
                        <NombreSistema n={CATALOGO_SISTEMAS[c].name} />
                      </a>
                      <dl className="mt-2 space-y-2 text-sm leading-snug">
                        <div>
                          <dt className="rotulo">Actúan en automático</dt>
                          <dd className="mt-0.5 font-semibold text-slate-900">
                            {de(true).join(" · ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="rotulo">Bolos o modo manual</dt>
                          <dd className="mt-0.5 text-slate-800">{de(false).join(" · ")}</dd>
                        </div>
                      </dl>
                    </li>
                  );
                })}
              </ul>
              <FuentePie
                className="-mt-2 mb-4"
                fuentes={fuentesDeDatos(cols.flatMap((c) => PARAMETROS[c]))}
              />
              <NivelTitulo.Provider value={2}>
                <TablaVista tabla={TABLAS.T3} columnasFijas={cols} herramienta />
              </NivelTitulo.Provider>
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
    </div>
  );
}
