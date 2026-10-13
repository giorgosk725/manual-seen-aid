/* «Para el paciente»: información para pacientes (V5 = la publicada el 8-10-2026) y
   resumen (maquetación de la editorial), literales; y la hoja «Plan de seguridad» de cada sistema, hecha SOLO con texto
   del capítulo (pp. 7-9, Figura 3 y Tabla 4) y huecos para rellenar a mano. Cada hoja se imprime
   con letra grande (una columna, 12 pt, a doble cara: dos o tres caras según el material; ver
   docs/IMPRESION_2026-10.md). La app no guarda nada de lo que se escribe:
   no hay campos, solo líneas en blanco para el papel. */
import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  Backpack,
  Droplet,
  FileDown,
  FileText,
  Plane,
  Printer,
  ScanLine,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
/* Un icono por hoja, para encontrarla de un vistazo. */
const ICONO_HOJA: Record<string, LucideIcon> = {
  cetonas: Droplet,
  "pruebas-cirugia": ScanLine,
  glucosa: TrendingUp,
  "ejercicio-viajes": Plane,
  material: Backpack,
};
import { UrgenciaF3 } from "../componentes/UrgenciaF3";
import { CAPITULO, FIGURA3, TABLAS, apartadoPorSlug, idDeBloque } from "../contenido";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import type { SistemaId } from "../ampliacion/tipos";
import {
  AUTOR_PACIENTES,
  INFORMACION_PACIENTES,
  RESUMEN_CAPITULO,
  TITULO_CAPITULO_PACIENTES,
} from "../pacientes/textos";
import { elegirRuta, href } from "../rutas";
import { CabeceraEditorial, ToneCard } from "../ui";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { HOJAS_EXTRA, hojaExtraPorId } from "../hojas";
import { Texto } from "../texto";
import { abrirPlegables, imprimirRegion } from "../imprimir";
import { VERSION_APP } from "../version";
import { fechaCorta, material, materialListo } from "../materiales";

const hex = CATEGORIA_HEX.pacientes;

/* ---------- Barra de acciones de una hoja: formato e imprimir ---------- */
/* Edición editorial (A12): las hojas se imprimen solo con letra grande, 12 pt, una columna. La
   opción compacta de 7 pt (una cara, dos columnas) queda fuera de esta edición. */
function Acciones({
  hoja,
  materialId,
}: {
  hoja: React.RefObject<HTMLElement | null>;
  /* Material del registro: si no está aprobado, no se imprime para entregar (V50-02). */
  materialId?: string;
}) {
  const imprimir = "Imprimir con letra grande";
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
    <div className="no-imprimir mb-3 space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => imprimirRegion(() => hoja.current)}
          aria-label={imprimir}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:min-h-0 sm:py-2"
        >
          <Printer size={15} aria-hidden="true" />
          <span className="sm:hidden">Imprimir</span>
          <span className="hidden sm:inline">{imprimir}</span>
        </button>
      </div>
      <p className="text-xs text-slate-600">
        Una columna, letra de 12 pt: dos o tres caras A4, mejor a doble cara.
      </p>
    </div>
  );
}

/* ---------- Hoja A4 (en pantalla, una hoja; en papel, 12 pt a una columna) ---------- */
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

function Hoja({
  hojaRef,
  rotulo,
  titulo,
  subtitulo,
  pie,
  children,
  holgada = false,
  complementaria = false,
  materialId,
}: {
  /* Material del registro (src/materiales.ts): su revisión sale en el pie. */
  materialId?: string;
  holgada?: boolean;
  /* Hoja o plantilla de este complemento (no una publicación del Manual SEEN): se dice en la
     cabecera y en el pie, en pantalla y en papel (A12). */
  complementaria?: boolean;
  hojaRef: React.RefObject<HTMLDivElement>;
  rotulo: string;
  titulo: string;
  subtitulo?: ReactNode;
  pie: ReactNode;
  children: ReactNode;
}) {
  useImprimirConTeclado(hojaRef);
  const grande = true;
  return (
    <div
      ref={hojaRef}
      className={`hoja-a4 imprimible rounded-2xl border bg-white p-4 shadow-soft sm:p-6 ${holgada ? "holgada" : ""} ${grande ? "grande" : ""}`}
      style={{ borderColor: "#e6e6e6" }}
    >
      {materialId && !materialListo(materialId) && (
        <p className="mb-3 rounded-md border-2 border-amber-400 px-3 py-2 text-sm font-bold text-amber-900">
          Borrador en revisión: no entregar.
        </p>
      )}
      <header className="hoja-cabecera mb-3 border-b pb-3" style={{ borderColor: "#e6e6e6" }}>
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: hex.ink }}>
          {complementaria ? `Material complementario · ${rotulo}` : rotulo}
        </div>
        <h1 className="mt-0.5 text-balance text-xl font-black leading-tight text-slate-900">
          {titulo}
        </h1>
        {subtitulo && <div className="mt-1 text-sm text-slate-600">{subtitulo}</div>}
      </header>
      <div className="hoja-cuerpo">{children}</div>
      <footer
        className="hoja-pie mt-4 border-t pt-3 text-xs text-slate-600"
        style={{ borderColor: "#e6e6e6" }}
      >
        {pie}{" "}
        {complementaria
          ? `Hoja complementaria del complemento interactivo del capítulo 89 (versión ${VERSION_APP}), hecha con texto del capítulo publicado el ${CAPITULO.fechaFuente}; no es una publicación del Manual SEEN.`
          : `Versión en pantalla del complemento ${VERSION_APP}; capítulo publicado el ${CAPITULO.fechaFuente}.`}
        {materialId && <RevisionMaterial id={materialId} />}
      </footer>
    </div>
  );
}

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

/* La revisión registrada de un material (src/materiales.ts), en una línea del pie. */
function RevisionMaterial({ id }: { id: string }) {
  const m = material(id);
  if (!m) return null;
  const aprobada = m.fecha
    ? `Revisión: aprobada el ${fechaCorta(m.fecha)}${m.version !== "—" ? ` (versión ${m.version})` : ""}.`
    : "Revisión: pendiente.";
  return (
    <span className="mt-1 block">
      {aprobada}
      {m.pendiente ? ` ${m.pendiente}.` : ""}
    </span>
  );
}

/* ---------- Hub ---------- */
/* Una hoja como fila: título, para qué sirve y la flecha; toda la fila abre. */
/* La primera frase de una entradilla («Esta hoja resume qué hacer según las cetonas…»). */
const primeraFrase = (t?: string) => (t ? (t.match(/^[^.]+\./)?.[0] ?? t) : "");

function FilaHoja({
  href: destino,
  titulo,
  detalle,
  borrador = false,
  descarga = false,
  icono: I,
}: {
  href: string;
  titulo: string;
  detalle: string;
  borrador?: boolean;
  /* El icono de la fila (si no, el de descarga en el PDF). */
  icono?: LucideIcon;
  /* Un archivo que se descarga (PDF), no una pantalla. */
  descarga?: boolean;
}) {
  return (
    <a
      href={destino}
      download={descarga ? "" : undefined}
      className="flex min-h-11 items-center gap-3 px-3 py-2 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
    >
      {(descarga || I) && (
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: hex.soft }}
        >
          {I ? (
            <I size={18} style={{ color: hex.strong }} />
          ) : (
            <FileDown size={18} style={{ color: hex.strong }} />
          )}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">{titulo}</span>
        {/* En el móvil, la descripción en dos líneas como mucho: la hoja lo dice entero. */}
        <span className="line-clamp-2 text-xs text-slate-600 sm:line-clamp-none">{detalle}</span>
        {borrador && (
          <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 text-[11px] font-semibold text-amber-900">
            Borrador en revisión
          </span>
        )}
      </span>
      <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
    </a>
  );
}
/* El PDF oficial de «Información para pacientes» tal como lo publica el Manual SEEN
   (public/pdf; entra en la precarga: se descarga también sin conexión). */
const PDF_PACIENTES = `${import.meta.env.BASE_URL}pdf/manual-seen-aid-pacientes.pdf`;

export function HubPacientes() {
  const tarjetas = [
    {
      href: href("pacientes", "informacion"),
      icono: FileText,
      t: "Información para pacientes · en pantalla",
      s: "El mismo texto del PDF, para leer o imprimir desde aquí: qué es el sistema, qué material llevar, qué hacer si la glucosa baja o sube, ejercicio, viajes y pruebas.",
    },
  ];
  return (
    <div>
      <CabeceraEditorial titulo="Para el paciente" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          El recurso principal es la Información para pacientes publicada por el Manual SEEN.
          Debajo, material complementario de este complemento, para imprimir con letra grande.
        </p>
      </CabeceraEditorial>
      <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        Recurso principal
      </h2>
      <ul className="divide-y rounded-xl border bg-white" style={{ borderColor: "#e6e6e6" }}>
        <li>
          <FilaHoja
            href={PDF_PACIENTES}
            titulo="Información para pacientes · PDF publicado por el Manual SEEN"
            detalle={`Doce preguntas y respuestas y un mensaje final, maquetados por el Manual SEEN (PDF de 3 páginas, 83 KB, ${CAPITULO.fechaPdfPacientes}). Disponible también sin conexión.`}
            descarga
          />
        </li>
        {tarjetas.map((c) => (
          <li key={c.t}>
            <FilaHoja href={c.href} titulo={c.t} detalle={c.s} icono={c.icono} />
          </li>
        ))}
      </ul>
      <h2 className="mb-1 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">
        Material complementario
      </h2>
      <p className="text-sm text-slate-600">
        Hojas y plantillas de este complemento, hechas con texto del capítulo. No son una
        publicación del Manual SEEN.
      </p>
      <section aria-labelledby="hojas-breves" className="mt-3">
        <h3 id="hojas-breves" className="text-base font-extrabold text-slate-900">
          Hojas breves por situación
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Según lo que haga falta ese día: cetonas, pruebas y cirugía, y tres extractos de la
          Información para pacientes.
        </p>
        <ul className="mt-3 divide-y rounded-xl border bg-white" style={{ borderColor: "#e6e6e6" }}>
          {HOJAS_EXTRA.map((h) => (
            <li key={h.id}>
              <FilaHoja
                href={href("pacientes", "hoja", h.id)}
                titulo={h.titulo}
                detalle={`${h.rotulo.replace(/ para el paciente$/i, "")} para entregar · ${primeraFrase(h.intro) || h.fuente}`}
                borrador={h.estado === "borrador" || !materialListo(`hoja-${h.id}`)}
                icono={ICONO_HOJA[h.id] ?? FileText}
              />
            </li>
          ))}
          {HOJAS_BREVES.map((h) => (
            <li key={h.id}>
              <FilaHoja
                href={href("pacientes", "hoja", h.id)}
                titulo={h.titulo}
                detalle={h.preguntas.map((q) => q.replace(/^¿|\?$/g, "")).join(" · ")}
                icono={ICONO_HOJA[h.id] ?? FileText}
              />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="planes" className="mt-6">
        <h3 id="planes" className="flex items-center gap-2 text-base font-extrabold text-slate-900">
          <ShieldCheck size={18} style={{ color: hex.strong }} aria-hidden="true" /> Plantilla de
          plan de seguridad, por sistema
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Lo que el capítulo pide que contenga el plan, qué hacer según las cetonas y las
          herramientas de ese sistema en cada situación, con huecos para rellenar a mano.
        </p>
        {!materialListo("planes") && (
          <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
            En revisión: todavía no están listas para entregar.
          </p>
        )}
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
  return (
    <div>
      <Volver actual="Información para pacientes" />
      <Acciones hoja={ref} />
      <Hoja
        hojaRef={ref}
        rotulo={INFORMACION_PACIENTES.rotulo}
        titulo={TITULO_CAPITULO_PACIENTES}
        subtitulo={AUTOR_PACIENTES}
        pie={
          <>
            Manual SEEN · Información para pacientes; PDF publicado el {CAPITULO.fechaPdfPacientes}.
          </>
        }
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

/* ---------- Hojas breves por situación (#/pacientes/hoja/<id>) ----------
   Extractos de la Información para pacientes: las mismas preguntas y respuestas, tal cual, en
   hojas cortas para entregar según lo que haga falta ese día. Sin texto nuevo. */
const HOJAS_BREVES: { id: string; titulo: string; preguntas: string[] }[] = [
  {
    id: "glucosa",
    titulo: "Si la glucosa baja, o sube y no baja",
    preguntas: [
      "¿Qué hacer si se tiene hipoglucemia?",
      "¿Qué hacer si la glucosa está alta y no baja?",
      "¿Cuándo se debe acudir a urgencias?",
    ],
  },
  {
    id: "ejercicio-viajes",
    titulo: "Ejercicio, viajes y pruebas médicas",
    preguntas: [
      "¿Qué se debe tener en cuenta con el ejercicio?",
      "¿Qué pasa si se viaja o se tiene una prueba médica?",
    ],
  },
  {
    id: "material",
    titulo: "Qué tener siempre a mano y qué hacer si el sistema falla",
    preguntas: [
      "¿Qué material se debe tener siempre disponible?",
      "¿Qué hacer si hay que interrumpir el sistema o si falla?",
    ],
  },
];

export function HojaPacientes({ id }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const h = HOJAS_BREVES.find((x) => x.id === id);
  const extra = hojaExtraPorId(id);
  if (!h && extra) return <HojaExtraVista hoja={extra} hojaRef={ref} />;
  if (!h) return <HubPacientes />;
  const secciones = h.preguntas
    .map((q) => INFORMACION_PACIENTES.secciones.find((x) => x.pregunta === q))
    .filter((x): x is (typeof INFORMACION_PACIENTES.secciones)[number] => !!x);
  return (
    <div>
      <Volver actual={h.titulo} />
      <Acciones hoja={ref} materialId="extractos" />
      <Hoja
        hojaRef={ref}
        rotulo={`${INFORMACION_PACIENTES.rotulo} · extracto`}
        titulo={h.titulo}
        subtitulo={`${TITULO_CAPITULO_PACIENTES} · ${AUTOR_PACIENTES}`}
        pie={
          <>
            Extracto literal de la Información para pacientes del Manual SEEN (PDF publicado el{" "}
            {CAPITULO.fechaPdfPacientes}).
          </>
        }
        holgada
        complementaria
        materialId="extractos"
      >
        {secciones.map((sec) => (
          <section key={sec.pregunta} className="hoja-seccion mb-3">
            <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
              {sec.pregunta}
            </h2>
            {sec.parrafos.map((par, i) => (
              <p key={i} className="mt-1 text-[15px] leading-relaxed text-slate-800">
                {par}
              </p>
            ))}
          </section>
        ))}
      </Hoja>
    </div>
  );
}

/* Una hoja escrita por la app (hojas.ts): secciones con puntos, huecos para el papel y su
   fuente; en borrador, con el aviso de que aún no está aprobada. */
function HojaExtraVista({
  hoja,
  hojaRef,
}: {
  hoja: (typeof HOJAS_EXTRA)[number];
  hojaRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div>
      <Volver actual={hoja.titulo} />
      {hoja.estado === "borrador" && (
        <ToneCard tone="amber" title="Borrador en revisión" className="mb-3">
          <p className="text-sm text-slate-800">
            Texto preparado a partir del capítulo y pendiente de aprobación: no entregar todavía.
          </p>
        </ToneCard>
      )}
      <Acciones hoja={hojaRef} materialId={`hoja-${hoja.id}`} />
      <Hoja
        hojaRef={hojaRef}
        rotulo={hoja.estado === "borrador" ? `${hoja.rotulo} · borrador` : hoja.rotulo}
        titulo={hoja.titulo}
        // Arriba, título y propósito; el título completo del capítulo y la autoría, al pie
        // (V54-09): así la alarma queda en la primera pantalla y en la primera cara.
        pie={
          <>
            Fuente: {hoja.fuente}. {TITULO_CAPITULO_PACIENTES} · {AUTOR_PACIENTES}
          </>
        }
        holgada
        complementaria
        materialId={`hoja-${hoja.id}`}
      >
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
            <h2
              className="text-base font-extrabold"
              style={{ color: sec.urgente ? "#991b1b" : hex.ink }}
            >
              {sec.titulo}
            </h2>
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
      </Hoja>
    </div>
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
          Leer y comprender ›
        </a>
      </nav>
      <Acciones hoja={ref} />
      <Hoja
        hojaRef={ref}
        rotulo={RESUMEN_CAPITULO.rotulo}
        titulo={TITULO_CAPITULO_PACIENTES}
        subtitulo={AUTOR_PACIENTES}
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

/* Migas de una hoja, en una línea como las de Sistemas y Tablas: vuelve a «Para el paciente»
   (donde están todas las hojas) y dice cuál se está viendo. */
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
        <Volver actual="Plan de seguridad" />
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
      <Volver actual="Plan de seguridad" />
      {/* Los cuatro sistemas en una fila también en el móvil (nombre corto). */}
      <div
        className="no-imprimir mb-3 grid grid-cols-4 gap-1 sm:flex sm:flex-wrap sm:gap-1.5"
        role="group"
        aria-label="Sistema"
      >
        {ORDEN_SISTEMAS.map((id, k) => (
          <button
            key={id}
            type="button"
            onClick={() => elegirRuta("pacientes", "plan", id)}
            aria-pressed={id === s.id}
            className="min-h-11 rounded-lg border px-1 py-1 text-xs font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-0 sm:rounded-full sm:px-3 sm:py-1.5"
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
            <span className="sm:hidden">{CORTO_SISTEMA[k]}</span>
            <span className="hidden sm:inline">{TABLAS.T1.columnas[k]}</span>
          </button>
        ))}
      </div>
      <Acciones hoja={ref} materialId="planes" />
      <Hoja
        hojaRef={ref}
        rotulo="Plantilla de plan de seguridad"
        complementaria
        materialId="planes"
        // Arriba, el título operativo y el propósito; el título del capítulo, al pie (V54-09).
        titulo={`Plan de seguridad · ${nombre}`}
        subtitulo={
          <>Hecha solo con el texto del capítulo. Para rellenar a mano; no se guarda nada.</>
        }
        pie={
          <>
            Fuente: plan de seguridad (p. {plan?.p ?? 7}), dos reglas operativas (pp. 8-9), Figura 3
            (p. {FIGURA3.pagina}) y Tabla 4 (pp. 11-12); texto literal del capítulo «
            {CAPITULO.titulo}».
          </>
        }
      >
        {/* La urgencia y los signos de gravedad de la Figura 3, literales, en la primera cara;
            sin dosis (la de la rama roja va con su nota, en la figura). La figura entera sigue en
            su sitio (V54-09). */}
        <UrgenciaF3 className="hoja-seccion hoja-urgente mb-3" donde="al principio del plan" />
        <div className="hoja-seccion mb-3 flex flex-wrap gap-x-4 gap-y-2">
          <Hueco etiqueta="Nombre:" ancho="min-w-[12rem] flex-[2]" />
          <Hueco etiqueta="Fecha:" ancho="min-w-[8rem] flex-1" />
        </div>
        {plan && plan.t === "lista" && (
          <section className="hoja-seccion mb-3">
            <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
              {plan.intro}
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
            Dos reglas operativas
          </h2>
          <ul className="mt-1 space-y-1 text-sm text-slate-800">
            {reglas.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section className="hoja-seccion plan-figura3 mb-3">
          <h2 className="text-base font-extrabold" style={{ color: hex.ink }}>
            {FIGURA3.cabecera}
          </h2>
          <p className="mt-1 text-sm text-slate-800">
            <strong>{FIGURA3.sospechar.titulo}</strong> {FIGURA3.sospechar.items.join(" ")}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{FIGURA3.confirmar}</p>
          {/* En papel, la figura puede partirse entre caras, pero no una rama, y las ramas con
              dosis con asterisco (naranja y roja) van juntas con su nota de población (V54-09). */}
          {[
            FIGURA3.tramos.filter((t) => !JSON.stringify(t.pasos).includes("*")),
            FIGURA3.tramos.filter((t) => JSON.stringify(t.pasos).includes("*")),
          ].map((grupo, g) => (
            <div key={g} className={g === 1 ? "plan-f3-dosis mt-1.5" : "mt-1.5"}>
              <ul className="space-y-1.5">
                {grupo.map((t) => (
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
              {/* La nota de las dosis con asterisco, justo debajo de las ramas que las dan (A12). */}
              {g === 1 && (
                <p className="mt-1 text-xs text-slate-700">
                  <Texto>{FIGURA3.notaAsterisco}</Texto>
                </p>
              )}
            </div>
          ))}
          {FIGURA3.pie.map((p) => (
            <p key={p.titulo} className="mt-1.5 text-[13px] text-slate-800">
              <strong>{p.titulo}</strong> <Texto>{p.texto}</Texto>
            </p>
          ))}
          <p className="mt-1 text-[13px] font-semibold text-slate-900">
            <Texto>{FIGURA3.reglaDeOro}</Texto>
          </p>
          <p className="mt-1 text-xs text-slate-600">
            <Texto>{FIGURA3.abreviaturas}</Texto>
          </p>
        </section>
        <section className="hoja-seccion mb-1">
          <h2 className="text-base font-extrabold" style={{ color: SISTEMA_HEX[c].ink }}>
            {nombre}: {t4.titulo.toLowerCase()}
          </h2>
          <dl className="plan-t4 mt-1 space-y-1.5 text-sm">
            {t4.filas.map((f) => (
              <div key={f.etiqueta}>
                <dt className="font-bold text-slate-900">{f.etiqueta.replace(/\n/g, " ")}</dt>
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
      </Hoja>
      <p className="no-imprimir mt-3 text-xs text-slate-500">
        La conducta de las demás situaciones y sistemas está en{" "}
        <a href={href("consultar", "situacion")} className="font-semibold underline">
          Situación y sistema
        </a>
        ; y lo que dice el capítulo de este sistema, en su{" "}
        <a href={href("sistemas", s.id)} className="font-semibold underline">
          ficha
        </a>
        .
      </p>
    </div>
  );
}
