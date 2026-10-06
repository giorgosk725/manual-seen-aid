/* «Para el paciente»: información para pacientes (V5 del autor = maquetación del 5-10-2026) y
   resumen (maquetación de la editorial), literales; y la hoja «Plan de seguridad» de cada sistema, hecha SOLO con texto
   del capítulo (pp. 7-9, Figura 3 y Tabla 4) y huecos para rellenar a mano. Cada hoja se imprime
   en una cara A4 (letra pequeña, dos columnas) o, a elegir, con letra grande (una columna,
   12 pt, a doble cara: dos o tres caras), y lleva un QR para abrirla en el móvil. La app no guarda nada de lo que se escribe:
   no hay campos, solo líneas en blanco para el papel. */
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowRight, FileText, ListChecks, Printer, ShieldCheck } from "lucide-react";
import { CAPITULO, FIGURA3, TABLAS, apartadoPorSlug, idDeBloque } from "../contenido";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import type { SistemaId } from "../ampliacion/tipos";
import {
  AUTOR_PACIENTES,
  INFORMACION_PACIENTES,
  RESUMEN_CAPITULO,
  TITULO_CAPITULO_PACIENTES,
} from "../pacientes/textos";
import { elegirRuta, href } from "../rutas";
import { CabeceraEditorial, Segmented, ToneCard } from "../ui";
import { guardarFormatoHoja, useFormatoHoja, type FormatoHoja } from "../prefs";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { Texto } from "../texto";
import { abrirPlegables, imprimirRegion } from "../imprimir";
import { QR } from "../componentes/QR";
import { CompartirHoja } from "../componentes/CompartirHoja";
import { direccion } from "../compartir";

const hex = CATEGORIA_HEX.pacientes;

/* ---------- Barra de acciones de una hoja: formato, imprimir y compartir el enlace ---------- */
const FORMATOS: { id: FormatoHoja; label: string; shortLabel: string }[] = [
  { id: "una-cara", label: "Una cara · letra pequeña", shortLabel: "Una cara" },
  { id: "letra-grande", label: "Letra grande · doble cara", shortLabel: "Letra grande" },
];
function Acciones({
  hoja,
  ruta,
  titulo,
}: {
  hoja: React.RefObject<HTMLElement | null>;
  ruta: string;
  titulo: string;
}) {
  const formato = useFormatoHoja();
  return (
    <div className="no-imprimir mb-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Formato de impresión
        </span>
        <Segmented
          label="Formato de impresión"
          options={FORMATOS}
          value={formato}
          onChange={guardarFormatoHoja}
          wrap
        />
      </div>
      <p className="text-xs text-slate-600">
        {formato === "una-cara"
          ? "En papel: una cara A4, dos columnas, letra pequeña (7 pt)."
          : "En papel: una columna con letra de 12 pt; ocupa dos o tres caras A4. Mejor a doble cara."}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => imprimirRegion(() => hoja.current)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <Printer size={15} aria-hidden="true" />{" "}
          {formato === "una-cara" ? "Imprimir en una cara" : "Imprimir con letra grande"}
        </button>
        <CompartirHoja ruta={ruta} titulo={titulo} />
      </div>
    </div>
  );
}

/* ---------- Hoja A4 (en pantalla, una hoja; en papel, una cara a dos columnas) ---------- */
/* Imprimir desde el navegador (Ctrl+P o su menú) una pantalla con hoja: se marca igual que
   con el botón, para que salga solo la hoja en una cara A4. */
function useImprimirConTeclado(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const html = document.documentElement;
    let marcado = false;
    let restaurar = () => {};
    const antes = () => {
      if (html.classList.contains("imprimiendo")) return;
      marcado = true;
      html.classList.add("imprimiendo");
      restaurar = abrirPlegables(ref.current);
    };
    const despues = () => {
      if (!marcado) return;
      marcado = false;
      html.classList.remove("imprimiendo");
      restaurar();
    };
    window.addEventListener("beforeprint", antes);
    window.addEventListener("afterprint", despues);
    return () => {
      window.removeEventListener("beforeprint", antes);
      window.removeEventListener("afterprint", despues);
      despues();
    };
  }, [ref]);
}

function Hoja({
  hojaRef,
  rotulo,
  titulo,
  subtitulo,
  ruta,
  pie,
  children,
  holgada = false,
}: {
  holgada?: boolean;
  hojaRef: React.RefObject<HTMLDivElement>;
  rotulo: string;
  titulo: string;
  subtitulo?: ReactNode;
  ruta: string;
  pie: ReactNode;
  children: ReactNode;
}) {
  useImprimirConTeclado(hojaRef);
  const grande = useFormatoHoja() === "letra-grande";
  return (
    <div
      ref={hojaRef}
      className={`hoja-a4 imprimible rounded-2xl border bg-white p-4 shadow-soft sm:p-6 ${holgada ? "holgada" : ""} ${grande ? "grande" : ""}`}
      style={{ borderColor: "#e6e6e6" }}
    >
      <header className="hoja-cabecera mb-3 border-b pb-3" style={{ borderColor: "#e6e6e6" }}>
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: hex.ink }}>
          {rotulo}
        </div>
        <h1 className="mt-0.5 text-balance text-xl font-black leading-tight text-slate-900">
          {titulo}
        </h1>
        {subtitulo && <div className="mt-1 text-sm text-slate-600">{subtitulo}</div>}
      </header>
      <div className="hoja-cuerpo">{children}</div>
      <footer
        className="hoja-pie mt-4 flex items-center gap-3 border-t pt-3"
        style={{ borderColor: "#e6e6e6" }}
      >
        <QR texto={direccion(ruta)} titulo={`Código QR para abrir esta hoja: ${direccion(ruta)}`} />
        <div className="min-w-0 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">
            Abra esta hoja en el móvil con el código QR.
          </p>
          <p className="break-all">{direccion(ruta)}</p>
          <div className="mt-1">{pie}</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Hub ---------- */
export function HubPacientes() {
  const tarjetas = [
    {
      href: href("pacientes", "informacion"),
      icono: FileText,
      t: "Información para pacientes",
      s: "Doce preguntas y respuestas del autor y un mensaje final: qué es el sistema, qué material llevar, qué hacer si la glucosa baja o sube, ejercicio, viajes y pruebas.",
    },
    {
      href: href("pacientes", "resumen"),
      icono: ListChecks,
      t: "Resumen del capítulo",
      s: "El capítulo en una página, tal como lo maqueta la editorial.",
    },
  ];
  return (
    <div>
      <CabeceraEditorial titulo="Para el paciente" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Hojas para entregar o compartir en la consulta. Cada una cabe en una cara A4 o, con letra
          grande (12 pt), en dos o tres caras; y lleva un código QR para abrirla en el móvil. No son
          el texto del capítulo: van rotuladas con su origen.
        </p>
      </CabeceraEditorial>
      <ul className="grid gap-3 md:grid-cols-2">
        {tarjetas.map((c) => {
          const I = c.icono;
          return (
            <li key={c.t}>
              <a
                href={c.href}
                className="hover-lift ease-brand flex h-full gap-3 rounded-2xl border bg-white p-4 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e6e6e6" }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: `linear-gradient(135deg, ${hex.strong}, ${hex.strong2})` }}
                  aria-hidden="true"
                >
                  <I size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-extrabold text-slate-900">{c.t}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">{c.s}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <section aria-labelledby="planes" className="mt-6">
        <h2 id="planes" className="flex items-center gap-2 text-base font-extrabold text-slate-900">
          <ShieldCheck size={18} style={{ color: hex.strong }} aria-hidden="true" /> Plan de
          seguridad, por sistema
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Lo que el capítulo pide que contenga el plan (p. 7), el algoritmo de la Figura 3 y la
          conducta de la Tabla 4 para ese sistema, con huecos para rellenar a mano.
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {ORDEN_SISTEMAS.map((id, c) => (
            <li key={id}>
              <a
                href={href("pacientes", "plan", id)}
                className="hover-lift ease-brand flex h-full items-center gap-2 rounded-xl border bg-white p-2.5 shadow-soft transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e6e6e6" }}
              >
                <img src={FOTO_SISTEMA[id]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <span className="text-sm font-bold" style={{ color: SISTEMA_HEX[c].ink }}>
                  {TABLAS.T1.columnas[c]}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ---------- Información para pacientes (V5 del autor) ---------- */
export function InformacionPacientes() {
  const ref = useRef<HTMLDivElement>(null);
  const ruta = href("pacientes", "informacion");
  return (
    <div>
      <Volver />
      <Acciones hoja={ref} ruta={ruta} titulo="Información para pacientes" />
      <Hoja
        hojaRef={ref}
        rotulo={INFORMACION_PACIENTES.rotulo}
        titulo={TITULO_CAPITULO_PACIENTES}
        subtitulo={AUTOR_PACIENTES}
        ruta={ruta}
        pie={<>Manual SEEN · {INFORMACION_PACIENTES.fuente}.</>}
      >
        {INFORMACION_PACIENTES.secciones.map((s) => (
          <section key={s.pregunta} className="hoja-seccion mb-3">
            <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
              {s.pregunta}
            </h2>
            {s.parrafos.map((p, i) => (
              <p key={i} className="mt-1 text-[15px] leading-relaxed text-slate-800">
                {p}
              </p>
            ))}
          </section>
        ))}
      </Hoja>
    </div>
  );
}

/* ---------- Resumen (maquetación de la editorial) ---------- */
export function ResumenPacientes() {
  const ref = useRef<HTMLDivElement>(null);
  const ruta = href("pacientes", "resumen");
  return (
    <div>
      <Volver />
      <Acciones hoja={ref} ruta={ruta} titulo="Resumen del capítulo" />
      <Hoja
        hojaRef={ref}
        rotulo={RESUMEN_CAPITULO.rotulo}
        titulo={TITULO_CAPITULO_PACIENTES}
        subtitulo={AUTOR_PACIENTES}
        ruta={ruta}
        pie={<>Manual SEEN · {RESUMEN_CAPITULO.fuente}.</>}
        holgada
      >
        {RESUMEN_CAPITULO.parrafos.map((p, i) => (
          <p key={i} className="hoja-seccion mb-2.5 text-[15px] leading-relaxed text-slate-800">
            {p}
          </p>
        ))}
      </Hoja>
    </div>
  );
}

function Volver() {
  const ruta = typeof window === "undefined" ? "" : window.location.hash;
  const hojas = [
    { href: href("pacientes", "informacion"), t: "Información" },
    { href: href("pacientes", "resumen"), t: "Resumen" },
    { href: href("pacientes", "plan"), t: "Plan de seguridad" },
  ];
  return (
    <nav
      aria-label="Hojas para el paciente"
      className="no-imprimir mb-3 flex flex-wrap items-center gap-1.5"
    >
      <a
        href={href("pacientes")}
        className="inline-flex min-h-11 items-center pr-2 text-sm font-semibold text-slate-600 hover:underline"
      >
        Para el paciente ›
      </a>
      {hojas.map((h) => {
        const on = ruta.startsWith(h.href);
        return (
          <a
            key={h.href}
            href={h.href}
            aria-current={on ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "border-slate-700 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"}`}
          >
            {h.t}
          </a>
        );
      })}
    </nav>
  );
}

/* ---------- Plan de seguridad (solo texto del capítulo) ---------- */
const bloque = (slug: string, ancla: string) => {
  const a = apartadoPorSlug(slug)!;
  const i = a.bloques.findIndex((b, k) => idDeBloque(b, k) === ancla);
  return a.bloques[i];
};
const textoDe = (slug: string, ancla: string) => {
  const b = bloque(slug, ancla);
  return b && b.t === "p" ? b.texto : "";
};
/* Frase del bloque que contiene `clave` (literal, sin tocar). Se corta en «. » + mayúscula y
   se repone el punto; sin «lookbehind», que Safari anterior a 16.4 no admite. */
const fraseCon = (texto: string, clave: string) =>
  texto
    .split(/\. (?=[A-ZÁÉÍÓÚ])/)
    .map((f, i, todas) => (i < todas.length - 1 ? `${f}.` : f))
    .find((f) => f.includes(clave)) ?? "";

function Hueco({ etiqueta, ancho = "flex-1" }: { etiqueta: string; ancho?: string }) {
  return (
    <span className={`hueco flex min-w-0 items-end gap-1.5 ${ancho}`}>
      <span className="shrink-0 text-xs text-slate-600">{etiqueta}</span>
      <span
        aria-hidden="true"
        className="mb-1 h-0 flex-1 border-b border-dashed border-slate-400"
      />
    </span>
  );
}

function Casilla() {
  return (
    <span
      aria-hidden="true"
      className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm border border-slate-500"
    />
  );
}

export function PlanSeguridad({ sistema }: { sistema?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Solo el identificador y el nombre de la Tabla 1: el plan no depende de la ampliación.
  const col = ORDEN_SISTEMAS.indexOf(sistema as SistemaId);
  const s = col >= 0 ? { id: ORDEN_SISTEMAS[col], name: TABLAS.T1.columnas[col] } : undefined;
  if (!s)
    return (
      <div>
        <Volver />
        <ToneCard tone="slate" title="Elige el sistema">
          <ul className="grid grid-cols-2 gap-2">
            {ORDEN_SISTEMAS.map((id, c) => (
              <li key={id}>
                <a
                  href={href("pacientes", "plan", id)}
                  className="flex items-center gap-2 rounded-xl border bg-white p-2 text-sm font-semibold"
                  style={{ borderColor: "#e6e6e6", color: SISTEMA_HEX[c].ink }}
                >
                  {TABLAS.T1.columnas[c]} <ArrowRight size={13} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </ToneCard>
      </div>
    );
  const c = ORDEN_SISTEMAS.indexOf(s.id as SistemaId);
  const nombre = TABLAS.T1.columnas[c];
  const ruta = href("pacientes", "plan", s.id);
  const plan = bloque("07-educacion", "b4");
  const reglas = [
    fraseCon(textoDe("07-educacion", "b6"), "La primera es"),
    fraseCon(textoDe("07-educacion", "b7"), "como orientación"),
    fraseCon(textoDe("07-educacion", "b7"), "Debe reevaluarse con glucosa capilar"),
    fraseCon(textoDe("07-educacion", "b7"), "Los hidratos para tratar la hipoglucemia"),
    fraseCon(textoDe("07-educacion", "b9"), "La segunda regla"),
  ];
  const t4 = TABLAS.T4;
  return (
    <div>
      <Volver />
      <div className="no-imprimir mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Sistema">
        {ORDEN_SISTEMAS.map((id, k) => (
          <button
            key={id}
            type="button"
            onClick={() => elegirRuta("pacientes", "plan", id)}
            aria-pressed={id === s.id}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            style={
              id === s.id
                ? {
                    background: SISTEMA_HEX[k].ink,
                    borderColor: SISTEMA_HEX[k].ink,
                    color: "#ffffff",
                  }
                : { borderColor: "#d4d4d4", color: "#334155", background: "#ffffff" }
            }
          >
            {TABLAS.T1.columnas[k]}
          </button>
        ))}
      </div>
      <Acciones hoja={ref} ruta={ruta} titulo={`Plan de seguridad · ${nombre}`} />
      <Hoja
        hojaRef={ref}
        rotulo={`Plan de seguridad · ${nombre}`}
        titulo={CAPITULO.titulo}
        subtitulo={
          <>
            Hecha solo con el texto del capítulo (pp. 7-9, Figura 3 y Tabla 4). Para rellenar a
            mano; la app no guarda nada.
          </>
        }
        ruta={ruta}
        pie={<>Manual SEEN · {CAPITULO.autor}. Texto literal del capítulo con su página.</>}
      >
        <div className="hoja-seccion mb-3 flex flex-wrap gap-x-4 gap-y-2">
          <Hueco etiqueta="Nombre:" ancho="min-w-[12rem] flex-[2]" />
          <Hueco etiqueta="Fecha:" ancho="min-w-[8rem] flex-1" />
        </div>
        {plan && plan.t === "lista" && (
          <section className="hoja-seccion mb-3">
            <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
              {plan.intro} <span className="pagina-badge">p. {plan.p}</span>
            </h2>
            <ol className="mt-1.5 space-y-2 text-sm text-slate-800">
              {plan.items.map((it, i) => (
                <li key={i}>
                  <span className="flex gap-2">
                    <Casilla />
                    <span className="min-w-0 flex-1">
                      <Texto>{it}</Texto>
                    </span>
                  </span>
                  {i === 0 && (
                    <span className="mt-1.5 flex flex-col gap-2 pl-5">
                      <Hueco etiqueta="Insulina basal en pluma:" />
                      <Hueco etiqueta="Insulina rápida en pluma:" />
                      <span className="flex flex-wrap gap-x-4 gap-y-2">
                        <Hueco etiqueta="Ratio insulina/hidratos:" ancho="min-w-[10rem] flex-1" />
                        <Hueco etiqueta="Factor de sensibilidad:" ancho="min-w-[10rem] flex-1" />
                      </span>
                    </span>
                  )}
                  {i === 4 && (
                    <span className="mt-1.5 flex flex-col gap-2 pl-5">
                      <Hueco etiqueta="Equipo asistencial:" />
                      <Hueco etiqueta="Soporte técnico:" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
        <section className="hoja-seccion mb-3">
          <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
            Dos reglas operativas <span className="pagina-badge">pp. 8-9</span>
          </h2>
          <ul className="mt-1 space-y-1 text-sm text-slate-800">
            {reglas.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section className="hoja-seccion mb-3">
          <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
            {FIGURA3.cabecera} <span className="pagina-badge">Figura 3, p. {FIGURA3.pagina}</span>
          </h2>
          <p className="mt-1 text-sm text-slate-800">
            <strong>{FIGURA3.sospechar.titulo}</strong> {FIGURA3.sospechar.items.join(" ")}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{FIGURA3.confirmar}</p>
          <ul className="mt-1.5 space-y-1.5">
            {FIGURA3.tramos.map((t) => (
              <li
                key={t.clave}
                className={`tramo-plan tramo-${t.clave} rounded-lg border p-2 text-sm`}
              >
                <strong>{t.rango}</strong> · {t.titulo}
                <ul className="mt-0.5 space-y-0.5 text-[13px] text-slate-800">
                  {t.pasos.map((p, k) => (
                    <li key={k}>
                      <Texto>{p.texto}</Texto>
                      {p.detalle && (
                        <>
                          {" "}
                          {p.detalle.map((d, j) => (
                            <span key={j}>
                              <Texto>{d}</Texto>{" "}
                            </span>
                          ))}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {FIGURA3.pie.map((p) => (
            <p key={p.titulo} className="mt-1.5 text-[13px] text-slate-800">
              <strong>{p.titulo}</strong> <Texto>{p.texto}</Texto>
            </p>
          ))}
          <p className="mt-1 text-[13px] font-semibold text-slate-900">
            <Texto>{FIGURA3.reglaDeOro}</Texto>
          </p>
          <p className="mt-1 text-xs text-slate-600">
            <Texto>{FIGURA3.notaAsterisco}</Texto> <Texto>{FIGURA3.abreviaturas}</Texto>
          </p>
        </section>
        <section className="hoja-seccion mb-1">
          <h2 className="text-base font-extrabold" style={{ color: SISTEMA_HEX[c].ink }}>
            {nombre}: {t4.titulo.toLowerCase()}{" "}
            <span className="pagina-badge">Tabla 4, pp. 11-12</span>
          </h2>
          <dl className="plan-t4 mt-1 space-y-1.5 text-sm">
            {t4.filas.map((f) => (
              <div key={f.etiqueta}>
                <dt className="font-bold text-slate-900">{f.etiqueta.replace(/\n/g, " ")}</dt>
                <dd className="text-slate-800">
                  {(f.unida ? f.celdas[0] : f.celdas[c]).replace(/\n/g, " · ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Hoja>
      <p className="no-imprimir mt-3 text-xs text-slate-500">
        La conducta de las demás situaciones y sistemas está en{" "}
        <a href={href("consultar", "situacion")} className="font-semibold underline">
          Situación y sistema
        </a>
        . Fuera del capítulo hay más detalle en la ficha de{" "}
        <a href={href("sistemas", s.id)} className="font-semibold underline">
          {s.name}
        </a>
        .
      </p>
    </div>
  );
}
