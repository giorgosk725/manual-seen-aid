/* Explorar criterios de elección (#/sistemas/elegir): una consulta descriptiva, no un evaluador
   (edición editorial, A02). Enseña los factores de la elección del apartado 6 y la Figura 2 y,
   para cada sistema en el orden fijo de la Tabla 1, sus celdas literales de indicación,
   gestación, formato, sensores y localización del algoritmo. No hay datos de la persona (edad,
   peso, dosis), ni recuento, ni orden por compatibilidad, ni etiquetas de aptitud: las
   condiciones por variante y ámbito (CE, FDA, Europa, EE. UU.) quedan en sus celdas, tal cual.
   El explorador anterior por criterios (eleccion.ts) se conserva fuera de esta edición; una
   dirección antigua con criterios abre esta consulta y no reutiliza ni guarda sus valores. */
import { useEffect, useState } from "react";
import { CATALOGO_SISTEMAS, CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { ArrowRight, Check, X } from "lucide-react";
import { SISTEMA_HEX } from "../tokens";
import { APARTADOS, F2, TABLAS, rutaDeTabla } from "../contenido";
import { elegirRuta, href } from "../rutas";
import { CabeceraEditorial } from "../ui";
import { NombreSistema } from "../componentes/NombreSistema";
import { Texto } from "../texto";
import { CATEGORIA_HEX } from "../tokens";
import { FuentePie } from "../componentes/FuentePie";
import { SinCortes } from "../componentes/SinCortes";
import { paginasDe } from "../paginas";

const hex = CATEGORIA_HEX.consultar;

const enlace =
  "inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8";

/* 0.72.2 (petición del autor, 15-10-2026; A02 revisada): elegir por las características
   diferenciales del DISPOSITIVO, con las casillas literales de la Tabla 1. Sin datos de la
   persona (edad, peso, dosis, gestación), sin puntuación ni orden: los cuatro en el orden de la
   tabla; lo que no reúne lo marcado va en gris, con la casilla que no coincide marcada. Dentro de un
   grupo vale cualquiera de lo marcado; entre grupos, todo. */
type Criterio = {
  id: string;
  fila: number;
  opciones: { t: string; casa: (c: string) => boolean }[];
};
const SENSORES = [
  "Guardian 4",
  "Simplera Sync",
  "Instinct",
  "Dexcom G6",
  "Dexcom G7",
  "FreeStyle Libre 2 Plus",
  "FreeStyle Libre 3 Plus",
];
const CRITERIOS: Criterio[] = [
  {
    id: "formato",
    fila: 0,
    opciones: ["Bomba con catéter", "Pod desechable, sin tubo externo"].map((t) => ({
      t,
      casa: (c) => c.startsWith(t),
    })),
  },
  {
    id: "sensor",
    fila: 1,
    opciones: SENSORES.map((t) => ({
      t,
      // «Dexcom G6, G7» (Control-IQ) lleva los dos.
      casa: (c) => (t === "Dexcom G7" ? /Dexcom (G6, )?G7/.test(c) : c.includes(t)),
    })),
  },
  {
    id: "algoritmo",
    fila: 2,
    opciones: ["En la bomba", "En la app del smartphone", "En el pod"].map((t) => ({
      t,
      casa: (c) => c.startsWith(t),
    })),
  },
  {
    id: "bolos",
    fila: 5,
    opciones: ["Sí", "No"].map((t) => ({ t, casa: (c) => c.startsWith(t) })),
  },
];

function PorCaracteristicas() {
  const T1 = TABLAS.T1;
  const [marcado, setMarcado] = useState<Record<string, string[]>>({});
  const alternar = (id: string, t: string) =>
    setMarcado((m) => {
      const ya = m[id] ?? [];
      return { ...m, [id]: ya.includes(t) ? ya.filter((x) => x !== t) : [...ya, t] };
    });
  const casa = (cr: Criterio, c: number) => {
    const sel = marcado[cr.id] ?? [];
    if (!sel.length) return null;
    const celda = T1.filas[cr.fila].celdas[c];
    return cr.opciones.some((o) => sel.includes(o.t) && o.casa(celda));
  };
  const hayAlgo = CRITERIOS.some((cr) => (marcado[cr.id] ?? []).length > 0);
  const reunen = ORDEN_SISTEMAS.map((_, c) => c).filter((c) =>
    CRITERIOS.every((cr) => casa(cr, c) !== false),
  );
  const destino =
    hayAlgo && reunen.length === 1
      ? href("sistemas", ORDEN_SISTEMAS[reunen[0]])
      : hayAlgo && reunen.length >= 2
        ? href("sistemas", reunen.map((c) => ORDEN_SISTEMAS[c]).join("+"), "esencial")
        : href("sistemas");
  const rotulo =
    hayAlgo && reunen.length === 1
      ? `Ver la ficha de ${CATALOGO_SISTEMAS[reunen[0]].name}`
      : hayAlgo && reunen.length >= 2
        ? `Comparar los ${reunen.length}`
        : "Resumen de los cuatro sistemas";
  return (
    <section aria-labelledby="por-caracteristicas" className="no-imprimir tarjeta p-4">
      <h2 id="por-caracteristicas" className="titulo-seccion">
        Por las características del sistema
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {CRITERIOS.map((cr) => (
          <div
            key={cr.id}
            role="group"
            aria-label={T1.filas[cr.fila].etiqueta}
            className={cr.id === "sensor" ? "md:col-span-2" : undefined}
          >
            <div className="mb-1 rotulo text-slate-500">{T1.filas[cr.fila].etiqueta}</div>
            <div className="flex flex-wrap gap-1.5">
              {cr.opciones.map((o) => {
                const on = (marcado[cr.id] ?? []).includes(o.t);
                return (
                  <button
                    key={o.t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => alternar(cr.id, o.t)}
                    className="chip min-w-11 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    {o.t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* 0.79.1 (auditoría R3): el botón, justo debajo de lo que se marca (antes, tras las cuatro
          tarjetas, que miden más de una pantalla). */}
      {/* 0.73.0: si ninguno reúne lo marcado, se dice (antes el botón volvía a los cuatro). */}
      {hayAlgo && reunen.length === 0 && (
        <p role="status" className="mt-3 text-sm font-semibold text-slate-700">
          Ningún sistema reúne todo lo marcado.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={destino}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-4 text-sm font-bold text-white"
          style={{ background: hex.strong }}
        >
          {rotulo}
          <ArrowRight size={14} aria-hidden="true" />
        </a>
        {hayAlgo && (
          <button
            type="button"
            onClick={() => setMarcado({})}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-600 underline underline-offset-2 sm:min-h-8"
          >
            Quitar lo marcado
          </button>
        )}
      </div>
      {/* 0.97.1 (17.ª ronda, adjunto): se anuncia un resumen corto (antes, la lista entera de las
          cuatro tarjetas era la región que se leía con cada casilla). */}
      <p role="status" className="sr-only">
        {hayAlgo && reunen.length > 0
          ? `Reúnen lo marcado: ${reunen.map((c) => CORTO_SISTEMA[c]).join(", ")}.`
          : ""}
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ORDEN_SISTEMAS.map((id, c) => {
          const h = SISTEMA_HEX[c];
          const fuera = hayAlgo && !reunen.includes(c);
          return (
            <li
              key={id}
              className={`tarjeta flex min-w-0 flex-col p-3 transition sm:row-[span_15/span_15] sm:grid sm:grid-rows-subgrid ${fuera ? "border-dashed opacity-80" : "tarjeta-sistema"}`}
              style={{ ["--sis" as string]: h.strong }}
            >
              <div>
                <a
                  href={href("sistemas", id)}
                  className="flex min-h-11 items-center gap-2 font-extrabold hover:underline"
                  style={{ color: h.ink }}
                >
                  <img
                    src={FOTO_SISTEMA[id]}
                    alt=""
                    width={32}
                    height={32}
                    className="foto-sistema h-8 w-8 shrink-0 rounded-md bg-white object-cover"
                  />
                  {/* 0.96.0 (16.ª ronda, R5): nombre corto en las tarjetas (el comercial, en la ficha). */}
                  <NombreSistema n={CORTO_SISTEMA[c]} />
                </a>
                {fuera && (
                  <span className="insignia mt-0.5 inline-flex w-fit items-center gap-1">
                    <X size={12} aria-hidden="true" /> No reúne lo marcado
                  </span>
                )}
                {/* 0.79.1: el que sí lo reúne lo dice también (antes, solo el borde). */}
                {hayAlgo && !fuera && (
                  <span className="insignia mt-0.5 inline-flex w-fit items-center gap-1">
                    <Check size={12} aria-hidden="true" /> Reúne lo marcado
                  </span>
                )}
              </div>
              {/* 0.97.1 (17.ª ronda, senior): 14 px (antes, 13). */}
              <dl className="mt-1 space-y-1.5 text-sm sm:contents">
                {CRITERIOS.map((cr) => {
                  const r = casa(cr, c);
                  return (
                    <div key={cr.id} className="sm:contents">
                      <dt className={ROTULO_DATO}>
                        {T1.filas[cr.fila].etiqueta}
                        <span className="sr-only">
                          {r === true ? " (coincide)" : r === false ? " (no coincide)" : ""}
                        </span>
                      </dt>
                      <dd
                        className={`${DATO_PEGADO} ${r === true ? "font-semibold text-slate-900" : "text-slate-700"}`}
                      >
                        {r === true && (
                          <Check
                            size={14}
                            aria-hidden="true"
                            className="mr-1 inline-block align-[-2px] text-emerald-700"
                          />
                        )}
                        {r === false && (
                          <X
                            size={14}
                            aria-hidden="true"
                            className="mr-1 inline-block align-[-2px] text-slate-400"
                          />
                        )}
                        <SinCortes texto={T1.filas[cr.fila].celdas[c]} />
                      </dd>
                    </div>
                  );
                })}
                {/* 0.74.2 (auditoría): la indicación y la gestación (Tabla 1), con las variantes
                    Control-IQ+ y Liberty, a la vista en cada tarjeta. */}
                {[7, 8].map((fila) => (
                  <div key={fila} className="sm:contents">
                    <dt className={ROTULO_DATO}>{T1.filas[fila].etiqueta}</dt>
                    <dd className={`${DATO_PEGADO} whitespace-pre-line text-slate-700`}>
                      <SinCortes texto={T1.filas[fila].celdas[c]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>
      {/* 0.96.0 (16.ª ronda, adjunto): lo que la Tabla 1 no compara y también decide (nadar, el
          alcohol, desconectar), a un toque: el bloque de Los cuatro · Modos. */}
      <a
        href={href("sistemas", "todos", "modos:otras")}
        className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700"
      >
        Agua, alcohol y desconexión de los cuatro
        <ArrowRight size={14} aria-hidden="true" />
      </a>
      {/* 1.0.0 (18.ª ronda, senior y adjunto): la gestación, a un toque (la fila de la Tabla 1 va
          al final de cada tarjeta; la situación la da para los cuatro arriba). Sin filtro por
          datos de la persona (A02, decisión del autor del 15-10-2026). */}
      <a
        href={href("consultar", "situacion", "gestacion")}
        className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 underline sm:ml-4 decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700"
      >
        Gestación, parto y posparto
        <ArrowRight size={14} aria-hidden="true" />
      </a>
      {/* 1.0.1 (19.ª ronda, adjunto): el deportista, a los modos temporales de los cuatro. */}
      <a
        href={href("sistemas", "todos", "modos")}
        className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 hover:decoration-slate-700 sm:ml-4"
      >
        Ejercicio y modos temporales de los cuatro
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </section>
  );
}

/* 0.96.0 (16.ª ronda, visual): el rótulo de un dato, como en las fichas (minúscula y negrita, sobre
   una línea fina), no en MAYÚSCULAS grises. */
const ROTULO_DATO =
  "separador mt-1.5 border-t pt-1.5 text-sm font-semibold leading-snug text-slate-900 sm:mt-0";
/* En la subrejilla (desde sm) el dato va en la fila siguiente: sin el hueco de la rejilla. */
const DATO_PEGADO = "sm:-mt-2";

export function Elegir({ antigua = false }: { antigua?: boolean }) {
  // Dirección antigua con criterios (#/sistemas/elegir/edad=…): se sustituye por la de la
  // consulta, sin los valores, y no se guardan.
  useEffect(() => {
    if (antigua) elegirRuta("sistemas", "elegir");
  }, [antigua]);
  const a6 = APARTADOS.find((a) => a.slug === "06-indicaciones")!;
  const b5 = a6.bloques[4];
  const T1 = TABLAS.T1;
  const pT1 = paginasDe(T1.paginas[0], T1.paginas[1]);
  const perfil = F2.cajas[0];
  const sistema = F2.cajas[2];
  return (
    <div>
      <div className="no-imprimir mb-2 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("sistemas")}
          className="inline-flex min-h-11 items-center font-semibold hover:underline"
        >
          Sistemas AID
        </a>
        <span aria-hidden="true">›</span>
        <span>Elección del sistema</span>
      </div>
      <CabeceraEditorial titulo="Elección del sistema" hex={hex} level={1} />

      <PorCaracteristicas />

      <section
        aria-label="Elección compartida: texto del capítulo"
        className="prosa tarjeta mt-4 w-fit p-4"
        style={{ maxWidth: "none" }}
      >
        {/* 0.79.1: a ≈ 75 caracteres por línea (a 1920 llegaba a 184), con la caja a su medida. */}
        <p className="literal max-w-[75ch] text-sm">{b5.t === "p" && <Texto>{b5.texto}</Texto>}</p>
        <a href={href("capitulo", a6.slug, "b5")} className={enlace}>
          Leer en el capítulo <ArrowRight size={13} aria-hidden="true" />
        </a>
      </section>

      <section aria-labelledby="factores-f2" className="mt-4">
        <h2 id="factores-f2" className="titulo-seccion">
          Factores de la Figura 2
        </h2>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {[perfil, sistema].map((caja) => (
            <div key={caja.titulo} className="tarjeta p-3">
              <h3 className="titulo-tarjeta">{caja.titulo}</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                {caja.items.map((it) => (
                  <li key={it}>
                    <Texto>{it}</Texto>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-2">
        <FuentePie
          fuentes={[
            { texto: `Tabla 1, ${pT1}`, ruta: rutaDeTabla("T1") ?? href("tablas", "T1") },
            { texto: "Apartado 6, p. 6", ruta: href("capitulo", "06-indicaciones") },
            { texto: `Figura 2, p. ${F2.pagina}`, ruta: href("visual", "figuras") },
          ]}
        />
      </section>
    </div>
  );
}
