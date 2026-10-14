/* «Para el paciente» (0.70.0, simplificación del 14-10-2026): una pantalla con tres entradas
   — la Información para pacientes publicada por el Manual SEEN (PDF), el plan de seguridad de cada
   sistema y la hoja «Antes de una prueba o una cirugía» —. Sin transcripciones en pantalla del
   PDF. El plan cabe en una cara (lo que hay que tener y rellenar, y qué función usar del sistema)
   y lleva como segunda cara la hoja de cetonas. Las hojas se imprimen con letra grande (12 pt);
   la app no guarda nada: solo líneas en blanco para el papel. */
import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  Droplets,
  FileDown,
  Printer,
  ScanLine,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { UrgenciaF3 } from "../componentes/UrgenciaF3";
import { CAPITULO, FIGURA3, TABLAS, apartadoPorSlug, idDeBloque } from "../contenido";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import type { SistemaId } from "../ampliacion/tipos";
import { AUTOR_PACIENTES, RESUMEN_CAPITULO, TITULO_CAPITULO_PACIENTES } from "../pacientes/textos";
import { elegirRuta, href } from "../rutas";
import { CabeceraEditorial, ToneCard } from "../ui";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { hojaExtraPorId, type HojaExtra } from "../hojas";
import { Texto } from "../texto";
import { abrirPlegables, imprimirRegion } from "../imprimir";
import { VERSION_APP } from "../version";
import { fechaCorta, material, materialListo } from "../materiales";

const hex = CATEGORIA_HEX.pacientes;

/* ---------- Imprimir ---------- */
/* Un solo botón; las hojas se imprimen con letra grande, 12 pt, a una columna (A12). */
function Acciones({
  hoja,
  materialId,
}: {
  hoja: React.RefObject<HTMLElement | null>;
  /* Material del registro: si no está aprobado, no se imprime para entregar (V50-02). */
  materialId?: string;
}) {
  if (materialId && !materialListo(materialId))
    return (
      <p
        role="status"
        className="no-imprimir mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
      >
        Material en revisión: todavía no está listo para entregar ni imprimir.
      </p>
    );
  return (
    <div className="no-imprimir mb-3">
      <button
        type="button"
        onClick={() => imprimirRegion(() => hoja.current)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:min-h-0 sm:py-2"
      >
        <Printer size={15} aria-hidden="true" /> Imprimir
      </button>
    </div>
  );
}

/* Imprimir desde el navegador (Ctrl+P o su menú) una pantalla con hoja: se marca igual que
   con el botón, para que salga solo la hoja. */
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

/* ---------- Hoja A4 (en pantalla, una hoja; en papel, 12 pt a una columna) ---------- */
/* Arriba, solo el título; abajo, una línea: fuente, que es un complemento (no una publicación del
   Manual SEEN), versión y revisión. */
function Hoja({
  hojaRef,
  titulo,
  subtitulo,
  fuente,
  children,
  holgada = false,
  complementaria = false,
  materialId,
}: {
  materialId?: string;
  holgada?: boolean;
  complementaria?: boolean;
  hojaRef: React.RefObject<HTMLDivElement>;
  titulo: string;
  subtitulo?: ReactNode;
  fuente: ReactNode;
  children: ReactNode;
}) {
  useImprimirConTeclado(hojaRef);
  const m = materialId ? material(materialId) : undefined;
  return (
    <div
      ref={hojaRef}
      className={`hoja-a4 imprimible grande rounded-2xl border bg-white p-4 shadow-soft sm:p-6 ${holgada ? "holgada" : ""}`}
      style={{ borderColor: "#e6e6e6" }}
    >
      {materialId && !materialListo(materialId) && (
        <p className="mb-3 rounded-md border-2 border-amber-400 px-3 py-2 text-sm font-bold text-amber-900">
          Borrador en revisión: no entregar.
        </p>
      )}
      <header className="hoja-cabecera mb-3 border-b pb-3" style={{ borderColor: "#e6e6e6" }}>
        <h1 className="text-balance text-xl font-black leading-tight text-slate-900">{titulo}</h1>
        {subtitulo && <div className="mt-1 text-sm text-slate-600">{subtitulo}</div>}
      </header>
      <div className="hoja-cuerpo">{children}</div>
      <footer
        className="hoja-pie mt-4 border-t pt-2 text-xs text-slate-600"
        style={{ borderColor: "#e6e6e6" }}
      >
        Fuente: {fuente}
        {complementaria
          ? ` · Complemento del capítulo ${CAPITULO.numero} (no es una publicación del Manual SEEN) · v${VERSION_APP}`
          : ""}
        {m?.fecha ? ` · Revisada el ${fechaCorta(m.fecha)}` : ""}.
      </footer>
    </div>
  );
}

/* ---------- La pantalla ---------- */
/* El PDF oficial de «Información para pacientes» tal como lo publica el Manual SEEN
   (public/pdf; entra en la precarga: también sin conexión). */
const PDF_PACIENTES = `${import.meta.env.BASE_URL}pdf/manual-seen-aid-pacientes.pdf`;

function Fila({
  href: destino,
  titulo,
  detalle,
  icono: I,
  externo = false,
}: {
  href: string;
  titulo: string;
  detalle: string;
  icono: LucideIcon;
  externo?: boolean;
}) {
  return (
    <a
      href={destino}
      target={externo ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      className="group flex min-h-11 items-center gap-3 px-4 py-3 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: hex.soft, color: hex.strong }}
      >
        <I size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-slate-900">{titulo}</span>
        <span className="block text-xs text-slate-600">{detalle}</span>
      </span>
      <ArrowRight
        size={15}
        className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}

export function HubPacientes() {
  const pruebas = hojaExtraPorId("pruebas-cirugia");
  // 0.72.0: la hoja de cetonas, también suelta (va de cara 2 en el plan; costaba encontrarla).
  const cetonas = hojaExtraPorId("cetonas");
  return (
    <div>
      <CabeceraEditorial titulo="Para el paciente" hex={hex} level={1} />
      <div
        className="overflow-hidden rounded-xl border bg-white"
        style={{ borderColor: "#e6e6e6" }}
      >
        <Fila
          href={PDF_PACIENTES}
          externo
          icono={FileDown}
          titulo="Información para pacientes"
          detalle={`PDF del Manual SEEN · 3 páginas · ${CAPITULO.fechaPdfPacientes}`}
        />
        <section
          aria-labelledby="planes"
          className="border-t px-4 py-3"
          style={{ borderColor: "#eef0f2" }}
        >
          <h2 id="planes" className="flex items-center gap-3 text-base font-bold text-slate-900">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: hex.soft, color: hex.strong }}
            >
              <ShieldCheck size={20} />
            </span>
            Plan de seguridad
          </h2>
          {!materialListo("planes") && (
            <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              En revisión: todavía no están listos para entregar.
            </p>
          )}
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:pl-[3.25rem] lg:grid-cols-4">
            {ORDEN_SISTEMAS.map((id, c) => (
              <li key={id}>
                <a
                  href={href("pacientes", "plan", id)}
                  className="hover-lift ease-brand flex h-full items-center gap-2 rounded-xl border bg-white p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <img
                    src={FOTO_SISTEMA[id]}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                  />
                  <span className="text-sm font-bold" style={{ color: SISTEMA_HEX[c].ink }}>
                    {CORTO_SISTEMA[c]}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        {cetonas && (
          <div className="border-t" style={{ borderColor: "#eef0f2" }}>
            <Fila
              href={href("pacientes", "hoja", cetonas.id)}
              icono={Droplets}
              titulo={cetonas.titulo}
              detalle="Va también con el plan de seguridad, en hoja aparte"
            />
          </div>
        )}
        {pruebas && (
          <div className="border-t" style={{ borderColor: "#eef0f2" }}>
            <Fila
              href={href("pacientes", "hoja", pruebas.id)}
              icono={ScanLine}
              titulo={pruebas.titulo}
              detalle="Resonancia, TC, radiografía, ecografía y cirugía"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Hojas (#/pacientes/hoja/<id>) ---------- */
/* Lo que queda de las rutas antiguas (información en pantalla y extractos), a la pantalla. */
export function HojaPacientes({ id }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const extra = hojaExtraPorId(id);
  if (!extra) return <HubPacientes />;
  return (
    <div>
      <Volver actual={extra.titulo} />
      {extra.estado === "borrador" && (
        <ToneCard tone="amber" title="Borrador en revisión" className="mb-3">
          <p className="text-sm text-slate-800">Pendiente de aprobación: no entregar todavía.</p>
        </ToneCard>
      )}
      <Acciones hoja={ref} materialId={`hoja-${extra.id}`} />
      <Hoja
        hojaRef={ref}
        titulo={extra.titulo}
        fuente={extra.fuente}
        holgada
        complementaria
        materialId={`hoja-${extra.id}`}
      >
        <CuerpoHoja hoja={extra} />
      </Hoja>
    </div>
  );
}

/* El cuerpo de una hoja escrita por la app (hojas.ts): secciones con puntos y huecos. */
function CuerpoHoja({ hoja, titulo = false }: { hoja: HojaExtra; titulo?: boolean }) {
  return (
    <>
      {titulo && (
        <h2 className="mb-2 text-lg font-black leading-tight text-slate-900">{hoja.titulo}</h2>
      )}
      {hoja.intro && (
        <p className="mb-3 text-[15px] leading-relaxed text-slate-800">{hoja.intro}</p>
      )}
      {hoja.secciones.map((sec) => (
        <section
          key={sec.titulo}
          aria-label={sec.urgente ? `Urgente: ${sec.titulo}` : undefined}
          className={`hoja-seccion mb-3 ${sec.urgente ? "hoja-urgente rounded-lg border-2 px-3 py-2" : ""}`}
          style={sec.urgente ? { borderColor: "#b91c1c", background: "#fef2f2" } : undefined}
        >
          <h3
            className="text-base font-extrabold"
            style={{ color: sec.urgente ? "#991b1b" : hex.ink }}
          >
            {sec.titulo}
          </h3>
          {sec.parrafos?.map((par, i) => (
            <p key={i} className="mt-1 text-[15px] leading-relaxed text-slate-800">
              {par}
            </p>
          ))}
          {sec.items && (
            <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-800">
              {sec.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {hoja.huecos?.map((etiqueta) => (
        <div
          key={etiqueta}
          className="hoja-seccion mb-2 flex items-end gap-2 text-sm text-slate-800"
        >
          <Hueco etiqueta={etiqueta} />
        </div>
      ))}
      {hoja.nota && <p className="mt-3 text-xs text-slate-600">{hoja.nota}</p>}
    </>
  );
}

/* ---------- Resumen del capítulo (maquetación de la editorial): para profesionales, en
   «Leer y comprender» (#/capitulo/resumen); no es material para el paciente. ---------- */
export function ResumenPacientes() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      <nav aria-label="Volver" className="no-imprimir mb-3 text-sm">
        <a
          href={href("capitulo")}
          className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:underline"
        >
          Índice del capítulo ›
        </a>
      </nav>
      <Acciones hoja={ref} />
      <Hoja
        hojaRef={ref}
        titulo={TITULO_CAPITULO_PACIENTES}
        subtitulo={AUTOR_PACIENTES}
        fuente={<>Manual SEEN · {RESUMEN_CAPITULO.fuente}</>}
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

/* Migas de una hoja, en una línea: vuelve a «Para el paciente» y dice cuál se está viendo. */
function Volver({ actual }: { actual: string }) {
  return (
    <nav
      aria-label="Hojas para el paciente"
      className="no-imprimir mb-2 flex min-w-0 items-center gap-2 text-xs text-slate-500"
    >
      <a
        href={href("pacientes")}
        className="inline-flex min-h-11 shrink-0 items-center font-semibold hover:underline"
      >
        Para el paciente
      </a>
      <span aria-hidden="true">›</span>
      <span aria-current="page" className="min-w-0 truncate">
        {actual}
      </span>
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

/* Fila unida de la Tabla 4 en el plan de un sistema: sin la frase que empieza nombrando otro
   sistema («En CamAPS FX, no usar Boost…» no va en el plan de MiniMed 780G). El resto, literal. */
const NOMBRE_SISTEMA = [/MiniMed|780G/, /Control-IQ/, /CamAPS/, /Omnipod/];
function celdaUnidaDelSistema(texto: string, c: number): string {
  return texto
    .split(/(?<=\.)\s+(?=En )/)
    .filter((frase) => {
      const otro = NOMBRE_SISTEMA.findIndex((re) => /^En /.test(frase) && re.test(frase));
      return otro < 0 || otro === c;
    })
    .join(" ");
}
/* Filas de la Tabla 4 que van en el plan (0.70.0): las que dicen qué función del sistema usar.
   Fuera el sueño (lo programa el equipo) y la hiperglucemia persistente (la regla de oro y la
   cara de las cetonas). */
const FUERA_DEL_PLAN = [/^Sueño/, /^Hiperglucemia persistente/];

function Hueco({ etiqueta, ancho = "flex-1" }: { etiqueta: string; ancho?: string }) {
  return (
    <span className={`hueco flex min-w-0 items-end gap-1.5 ${ancho}`}>
      {/* La etiqueta se parte si no cabe (320 px); la línea, al menos 3 rem. */}
      <span className="min-w-0 text-xs text-slate-600">{etiqueta}</span>
      <span
        aria-hidden="true"
        className="mb-1 h-0 min-w-[3rem] flex-1 border-b border-dashed border-slate-400"
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
  const c = ORDEN_SISTEMAS.indexOf(sistema as SistemaId);
  if (c < 0) return <HubPacientes />;
  const id = ORDEN_SISTEMAS[c];
  const nombre = TABLAS.T1.columnas[c];
  const plan = bloque("07-educacion", "b4");
  // Lo que hay que tener (sin el último punto, la Figura 3: va en la segunda cara).
  const items = plan && plan.t === "lista" ? plan.items.filter((x) => !/Figura 3/.test(x)) : [];
  const hipo = [
    fraseCon(textoDe("07-educacion", "b7"), "como orientación"),
    fraseCon(textoDe("07-educacion", "b7"), "Debe reevaluarse con glucosa capilar"),
    // 14-10-2026 (decisión del responsable): lo de registrarlos en CamAPS FX, solo en su plan; en
    // los otros tres, la primera parte de la frase («…no deben anunciarse como comida»).
    c === 2
      ? fraseCon(textoDe("07-educacion", "b7"), "Los hidratos para tratar la hipoglucemia")
      : `${fraseCon(textoDe("07-educacion", "b7"), "Los hidratos para tratar la hipoglucemia").split(";")[0]}…`,
  ];
  const t4 = TABLAS.T4.filas.filter((f) => !FUERA_DEL_PLAN.some((re) => re.test(f.etiqueta)));
  const cetonas = hojaExtraPorId("cetonas");
  return (
    <div>
      <Volver actual={`Plan de seguridad · ${CORTO_SISTEMA[c]}`} />
      <div
        className="no-imprimir mb-3 grid grid-cols-4 gap-1 sm:flex sm:flex-wrap sm:gap-1.5"
        role="group"
        aria-label="Sistema"
      >
        {ORDEN_SISTEMAS.map((sid, k) => (
          <button
            key={sid}
            type="button"
            onClick={() => elegirRuta("pacientes", "plan", sid)}
            aria-pressed={sid === id}
            className="min-h-11 rounded-lg border px-1 py-1 text-xs font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-0 sm:rounded-full sm:px-3 sm:py-1.5"
            style={
              sid === id
                ? {
                    background: SISTEMA_HEX[k].ink,
                    borderColor: SISTEMA_HEX[k].ink,
                    color: "#ffffff",
                  }
                : { borderColor: "#d4d4d4", color: "#334155", background: "#ffffff" }
            }
          >
            {CORTO_SISTEMA[k]}
          </button>
        ))}
      </div>
      <Acciones hoja={ref} materialId="planes" />
      <Hoja
        hojaRef={ref}
        complementaria
        materialId="planes"
        titulo={`Plan de seguridad · ${nombre}`}
        fuente={
          <>
            plan de seguridad (p. {plan?.p ?? 7}), hipoglucemia (pp. 8-9), Figura 3 (p.{" "}
            {FIGURA3.pagina}) y Tabla 4 (pp. 11-12) del capítulo
          </>
        }
      >
        <UrgenciaF3 className="hoja-seccion hoja-urgente mb-3" donde="al principio del plan" />
        <div className="hoja-seccion mb-3 flex flex-wrap gap-x-4 gap-y-2">
          <Hueco etiqueta="Nombre:" ancho="min-w-[12rem] flex-[2]" />
          <Hueco etiqueta="Fecha:" ancho="min-w-[8rem] flex-1" />
        </div>
        <section className="hoja-seccion mb-3">
          <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
            Mi plan
          </h2>
          <ol className="mt-1.5 space-y-2 text-sm text-slate-800">
            {items.map((it, i) => (
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
                {/Contactos/.test(it) && (
                  <span className="mt-1.5 flex flex-col gap-2 pl-5">
                    <Hueco etiqueta="Equipo asistencial:" />
                    <Hueco etiqueta="Soporte técnico:" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
        <section className="hoja-seccion mb-3">
          <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
            Hipoglucemia
          </h2>
          <ul className="mt-1 space-y-1 text-sm text-slate-800">
            {hipo.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <p className="hoja-seccion mb-3 text-sm font-semibold text-slate-900">
          <Texto>{FIGURA3.reglaDeOro}</Texto>
        </p>
        <section className="hoja-seccion mb-1">
          <h2 className="text-base font-extrabold" style={{ color: SISTEMA_HEX[c].ink }}>
            {nombre}: qué función usar
          </h2>
          <dl className="plan-t4 mt-1 space-y-1.5 text-sm">
            {t4.map((f) => (
              <div key={f.etiqueta}>
                {/* Sin el punto final: en papel va seguido de «: » (0.72.0: salía «.:»). */}
                <dt className="font-bold text-slate-900">
                  {f.etiqueta.split("\n")[0].replace(/\.$/, "")}
                </dt>
                <dd className="text-slate-800">
                  {(f.unida ? celdaUnidaDelSistema(f.celdas[0], c) : f.celdas[c]).replace(
                    /\n/g,
                    " · ",
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        {/* Segunda cara: la hoja de cetonas (aprobada), entera. */}
        {cetonas && materialListo("hoja-cetonas") && (
          <div className="cara-2 mt-5 border-t-2 pt-4" style={{ borderColor: "#e6e6e6" }}>
            <CuerpoHoja hoja={cetonas} titulo />
          </div>
        )}
      </Hoja>
    </div>
  );
}
