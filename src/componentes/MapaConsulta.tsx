/* El mapa de consulta (0.72.2, cuarta vuelta de la portada, por indicación del responsable): se
   entra sobre todo por dudas de un sistema, para repasarlo o para iniciarlo. Por eso, primero los
   cuatro sistemas (ficha, parámetros, iniciación y sus preguntas); después iniciación y
   seguimiento, la lectura del capítulo y el material para el paciente; al final, las situaciones
   clínicas (hiperglucemia, hipoglucemia e interrupción, con su color, entre ellas). Sin
   entradillas: cada tarjeta, su título y sus accesos. */
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarClock,
  ClipboardList,
  HeartHandshake,
  LifeBuoy,
  ListOrdered,
  PlayCircle,
  Printer,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { APARTADOS, DIAGRAMAS, LISTA_TABLAS } from "../contenido";
import { diagramaEnEdicion } from "../diagramasRetirados";
import { CATEGORIA_HEX, SISTEMA_HEX, TRAMO_HEX } from "../tokens";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";

/* Tarjeta de la portada: cabecera con icono y título; debajo, sus filas. */
export function TarjetaPortada({
  id,
  titulo,
  icono: Icono,
  hex,
  nivel = 3,
  children,
}: {
  id: string;
  nivel?: 2 | 3;
  titulo: string;
  icono: LucideIcon;
  hex: { soft: string; strong: string; ink: string };
  children: ReactNode;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <section
      aria-labelledby={id}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white"
      style={{ borderColor: "#e6e6e6" }}
    >
      <header className="flex items-center gap-3 px-4 py-2.5">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: hex.soft, color: hex.strong }}
        >
          <Icono size={18} />
        </span>
        <Titulo id={id} className="min-w-0 text-base font-extrabold leading-snug text-slate-900">
          {titulo}
        </Titulo>
      </header>
      <div className="flex flex-1 flex-col border-t" style={{ borderColor: "#eef0f2" }}>
        {children}
      </div>
    </section>
  );
}

/* Una fila de entrada: icono, nombre, un dato breve a la derecha y flecha. */
function Fila({
  ruta,
  icono: I,
  color,
  texto,
  dato,
}: {
  ruta: string;
  icono: LucideIcon;
  color: string;
  texto: string;
  dato?: string;
}) {
  return (
    <a
      href={ruta}
      className="group flex min-h-11 items-center gap-3 px-4 py-1.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
    >
      <I size={16} className="shrink-0" style={{ color }} aria-hidden="true" />
      <span className="min-w-0 flex-1 font-semibold text-slate-900">{texto}</span>
      {dato && <span className="shrink-0 text-xs tabular-nums text-slate-500">{dato}</span>}
      <ArrowRight
        size={14}
        className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
        aria-hidden="true"
      />
    </a>
  );
}

/* Una fila que lleva a un destino de la navegación (nav.ts). */
export function FilaDestino({
  id,
  etiqueta,
  dato,
}: {
  id: string;
  etiqueta?: string;
  dato?: string;
}) {
  const d = DESTINOS.find((x) => x.id === id)!;
  return (
    <Fila
      ruta={d.href}
      icono={d.icono}
      color={CATEGORIA_HEX[d.cat].strong}
      texto={etiqueta ?? d.etiqueta}
      dato={dato}
    />
  );
}

function Filas({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y" style={{ borderColor: "#eef0f2" }}>
      {children}
    </ul>
  );
}

/* ---------- Sistemas ---------- */

/* El inicio de cada sistema (la fase de preparación, con el sistema ya elegido). */
const SLUG_INICIO = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

function Sistemas() {
  const b = MAPA_CONSULTA.find((x) => x.id === "sistemas")!;
  const enlace =
    "flex min-h-9 items-center justify-center px-1 text-slate-700 transition hover:bg-slate-50 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500";
  return (
    <TarjetaPortada
      id="mapa-sistemas"
      titulo={b.titulo}
      icono={SlidersHorizontal}
      hex={CATEGORIA_HEX.consultar}
    >
      <ul aria-label="Los cuatro sistemas" className="grid grid-cols-4 gap-1.5 p-2 sm:gap-2 sm:p-3">
        {ORDEN_SISTEMAS.map((id, c) => {
          const h = SISTEMA_HEX[c];
          return (
            <li
              key={id}
              className="flex min-w-0 flex-col overflow-hidden rounded-lg border"
              style={{ borderColor: "#e6e6e6", borderTop: `3px solid ${h.strong}` }}
            >
              <a
                href={href("sistemas", id)}
                className="flex min-h-11 flex-1 flex-col items-center gap-1 p-1.5 text-center transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500 sm:flex-row sm:gap-2.5 sm:p-2 sm:text-left"
              >
                <img
                  src={FOTO_SISTEMA[id]}
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 shrink-0 rounded-md bg-white object-cover sm:h-12 sm:w-12"
                />
                <span
                  className="min-w-0 text-[11px] font-extrabold leading-tight sm:text-sm"
                  style={{ color: h.ink }}
                >
                  {CORTO_SISTEMA[c]}
                </span>
              </a>
              {/* Desde la tablet, los accesos más usados de cada ficha (en el móvil, la ficha
                  los tiene en sus pestañas). */}
              <div
                className="hidden divide-x border-t text-[13px] font-semibold sm:grid sm:grid-cols-3"
                style={{ borderColor: "#eef0f2" }}
              >
                <a
                  href={href("sistemas", id, "parametros")}
                  aria-label={`Parámetros de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                  style={{ borderColor: "#eef0f2" }}
                >
                  Parámetros
                </a>
                <a
                  href={href("consultar", "inicio", `preparacion:${SLUG_INICIO[c]}`)}
                  aria-label={`Iniciación de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                  style={{ borderColor: "#eef0f2" }}
                >
                  Inicio
                </a>
                <a
                  href={href("sistemas", id, "preguntas")}
                  aria-label={`Preguntas frecuentes sobre ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                  style={{ borderColor: "#eef0f2" }}
                >
                  Dudas
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <ul
        className="grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        style={{ borderColor: "#eef0f2" }}
      >
        {["comparar", "parametros", "elegir"].map((x) => (
          <li key={x} style={{ borderColor: "#eef0f2" }}>
            <FilaDestino id={x} />
          </li>
        ))}
      </ul>
    </TarjetaPortada>
  );
}

/* ---------- Iniciación, lectura y paciente ---------- */

function Iniciacion() {
  const b = MAPA_CONSULTA.find((x) => x.id === "en-consulta")!;
  const color = CATEGORIA_HEX.consultar.strong;
  return (
    <TarjetaPortada
      id="mapa-en-consulta"
      titulo={b.titulo}
      icono={PlayCircle}
      hex={CATEGORIA_HEX.consultar}
    >
      <Filas>
        <li>
          <Fila
            ruta={href("consultar", "inicio", "calculadora")}
            icono={Calculator}
            color={color}
            texto="Cálculo de parámetros iniciales"
          />
        </li>
        <li>
          <Fila
            ruta={href("consultar", "inicio", "preparacion")}
            icono={ListOrdered}
            color={color}
            texto="Iniciación paso a paso"
          />
        </li>
        <li>
          <Fila
            ruta={href("consultar", "inicio", "primeros-meses")}
            icono={CalendarClock}
            color={color}
            texto="Calendario de revisiones"
          />
        </li>
        <li>
          <FilaDestino id="descarga" />
        </li>
      </Filas>
    </TarjetaPortada>
  );
}

function Lectura() {
  return (
    <TarjetaPortada
      id="portada-leer"
      titulo="Leer y comprender"
      icono={BookOpen}
      hex={CATEGORIA_HEX.leer}
    >
      <Filas>
        <li>
          <FilaDestino id="capitulo" dato={`${APARTADOS.length} apartados`} />
        </li>
        <li>
          <FilaDestino id="tablas" dato={`${LISTA_TABLAS.length} tablas`} />
        </li>
        <li>
          <FilaDestino
            id="visual"
            dato={`${DIAGRAMAS.filter((d) => diagramaEnEdicion(d.id)).length} diagramas`}
          />
        </li>
        <li>
          <FilaDestino id="preguntas" />
        </li>
      </Filas>
    </TarjetaPortada>
  );
}

function Paciente() {
  const b = MAPA_CONSULTA.find((x) => x.id === "pacientes")!;
  const color = CATEGORIA_HEX.pacientes.strong;
  return (
    <TarjetaPortada
      id="mapa-pacientes"
      titulo={b.titulo}
      icono={HeartHandshake}
      hex={CATEGORIA_HEX.pacientes}
    >
      <Filas>
        <li>
          <FilaDestino id="pacientes" etiqueta="Plan de seguridad de cada sistema" />
        </li>
        <li>
          <Fila
            ruta={href("pacientes", "hoja", "cetonas")}
            icono={Printer}
            color={color}
            texto="Hoja de cetonas"
          />
        </li>
        <li>
          <Fila
            ruta={href("pacientes", "hoja", "pruebas-cirugia")}
            icono={ClipboardList}
            color={color}
            texto="Hoja de pruebas y cirugía"
          />
        </li>
        <li>
          <FilaDestino id="pdf-pacientes" />
        </li>
      </Filas>
    </TarjetaPortada>
  );
}

/* ---------- Situaciones clínicas ---------- */

/* Las tres que tienen pantalla propia, con el color de su riesgo; después, las que más se
   consultan, por su nombre corto (la lista entera, en «Todas las situaciones»). */
const CON_COLOR: [string, { strong: string; soft: string; border: string; ink: string }][] = [
  ["figura-3", TRAMO_HEX.naranja],
  ["hipoglucemia", TRAMO_HEX.rojo],
  ["interrupcion", TRAMO_HEX.amarillo],
];
const SITUACIONES_PORTADA: [string, string][] = [
  ["ejercicio-aerobico", "Ejercicio"],
  ["enfermedad-intercurrente", "Enfermedad intercurrente"],
  ["hiperglucemia-persistente", "Sospecha de fallo de infusión"],
  ["rm", "Resonancia magnética"],
  ["cirugia-corta", "Cirugía"],
  ["ingreso-hospitalario", "Ingreso hospitalario"],
  ["gestacion", "Gestación"],
];
const chip =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-8";

function Situaciones() {
  const b = MAPA_CONSULTA.find((x) => x.id === "situaciones")!;
  return (
    <TarjetaPortada
      id="mapa-situaciones"
      titulo={b.titulo}
      icono={LifeBuoy}
      hex={CATEGORIA_HEX.consultar}
    >
      <ul className="flex flex-wrap gap-1.5 px-3 py-2.5">
        {CON_COLOR.map(([id, t]) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          const I = d.icono;
          return (
            <li key={id}>
              <a
                href={d.href}
                className={chip}
                style={{ borderColor: t.border, background: t.soft, color: t.ink }}
              >
                <I size={14} aria-hidden="true" style={{ color: t.strong }} />
                {d.etiqueta}
              </a>
            </li>
          );
        })}
        {/* En el móvil, solo las tres con pantalla propia: el resto, en «Todas» y en la barra
            inferior («Situaciones»). */}
        {SITUACIONES_PORTADA.map(([id, t]) => (
          <li key={id} className="hidden sm:block">
            <a
              href={href("consultar", "situacion", id)}
              className={`${chip} bg-white text-slate-800`}
              style={{ borderColor: "#d9dde3" }}
            >
              {t}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t" style={{ borderColor: "#eef0f2" }}>
        <FilaDestino id="situacion" etiqueta="Todas las situaciones" />
      </div>
    </TarjetaPortada>
  );
}

export function MapaConsulta() {
  return (
    <section aria-labelledby="mapa-consulta">
      {/* Cada bloque dice ya qué ofrece: el título del mapa, solo para lectores de pantalla. */}
      <h2 id="mapa-consulta" tabIndex={-1} className="sr-only scroll-mt-4">
        Consultar
      </h2>
      <div className="grid gap-2 sm:gap-3">
        <Sistemas />
        <div className="grid gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Iniciacion />
          <Lectura />
          <div className="md:col-span-2 xl:col-span-1">
            <Paciente />
          </div>
        </div>
        <Situaciones />
      </div>
    </section>
  );
}
