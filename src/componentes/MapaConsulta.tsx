/* El mapa de consulta (0.72.2, cuarta vuelta de la portada, por indicación del responsable): se
   entra sobre todo por dudas de un sistema, para repasarlo o para iniciarlo. Por eso, primero los
   cuatro sistemas (ficha, parámetros, iniciación y sus preguntas); después iniciación y
   seguimiento, la lectura del capítulo y el material para el paciente; al final, las situaciones
   clínicas (hiperglucemia, hipoglucemia e interrupción, con su color, entre ellas). Sin
   entradillas: cada tarjeta, su título y sus accesos. sistema visual (docs/DISENO_VISUAL.md): una sola anatomía
   de tarjeta, filas sin icono ni flecha, un icono por bloque en el color del área. */
import { BookOpen, HeartHandshake, LifeBuoy, PlayCircle, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { CATEGORIA_HEX, SISTEMA_HEX, TRAMO_HEX } from "../tokens";
import { CORTO_CASILLA, CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";

const foco =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500";

/* Tarjeta de la portada: cabecera con un icono del área y el título; debajo, sus filas. */
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
    <section aria-labelledby={id} className="tarjeta flex h-full min-w-0 flex-col overflow-hidden">
      <header className="flex items-center gap-2.5 px-4 py-2.5">
        <Icono size={18} aria-hidden="true" className="shrink-0" style={{ color: hex.strong }} />
        <Titulo id={id} className="titulo-tarjeta min-w-0 text-base">
          {titulo}
        </Titulo>
      </header>
      <div className="separador flex flex-1 flex-col border-t">{children}</div>
    </section>
  );
}

/* Una fila de entrada: el nombre y, si lo hay, un dato breve a la derecha. */
function Fila({ ruta, texto, dato }: { ruta: string; texto: string; dato?: string }) {
  return (
    <a href={ruta} className={`fila ${foco}`}>
      <span className="min-w-0 flex-1">{texto}</span>
      {dato && (
        <span className="shrink-0 text-xs font-normal tabular-nums text-slate-500">{dato}</span>
      )}
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
  return <Fila ruta={d.href} texto={etiqueta ?? d.etiqueta} dato={dato} />;
}

function Filas({ children }: { children: ReactNode }) {
  return <ul className="filas">{children}</ul>;
}

/* ---------- Sistemas ---------- */

/* El inicio de cada sistema: la calculadora con el sistema ya elegido (0.73.0). */
const SLUG_INICIO = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

function Sistemas() {
  const b = MAPA_CONSULTA.find((x) => x.id === "sistemas")!;
  const enlace = `foco-dentro flex min-h-9 items-center justify-center px-2 text-[12px] xl:flex-auto font-semibold text-slate-700 transition hover:bg-slate-50 hover:underline ${foco}`;
  return (
    <TarjetaPortada
      id="mapa-sistemas"
      titulo={b.titulo}
      icono={SlidersHorizontal}
      hex={CATEGORIA_HEX.consultar}
    >
      <ul
        aria-label="Los cuatro sistemas"
        className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4 sm:p-3"
      >
        {ORDEN_SISTEMAS.map((id, c) => {
          const h = SISTEMA_HEX[c];
          return (
            <li
              key={id}
              className="tarjeta tarjeta-sistema flex min-w-0 flex-col overflow-hidden"
              style={{ ["--sis" as string]: h.strong }}
            >
              <a
                href={href("sistemas", id)}
                className={`foco-dentro flex min-h-11 flex-1 items-center gap-2 p-1.5 pl-2.5 text-left transition hover:bg-slate-50 sm:gap-2.5 sm:p-2 sm:pl-3 ${foco}`}
              >
                <img
                  src={FOTO_SISTEMA[id]}
                  decoding="async"
                  alt=""
                  width={48}
                  height={48}
                  className="foto-sistema h-10 w-10 shrink-0 rounded-md bg-white object-cover sm:h-12 sm:w-12"
                />
                {/* El nombre corto de la casilla («Control-IQ»): en una línea. */}
                <span
                  className="min-w-0 text-[13px] font-bold leading-tight sm:text-sm"
                  style={{ color: h.ink }}
                >
                  {CORTO_CASILLA[c]}
                </span>
              </a>
              {/* Desde la tablet, los accesos más usados de cada ficha (en el móvil, la ficha
                  los tiene en sus pestañas): en columna y, en pantalla ancha, en una fila. */}
              <div className="separador hidden border-t sm:flex sm:flex-col sm:divide-y xl:flex-row xl:divide-x xl:divide-y-0">
                <a
                  href={href("sistemas", id, "parametros")}
                  aria-label={`Parámetros de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                >
                  Parámetros
                </a>
                <a
                  href={href("consultar", "inicio", `calculadora:${SLUG_INICIO[c]}`)}
                  aria-label={`Iniciación de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                >
                  Iniciar
                </a>
                <a
                  href={href("sistemas", id, "preguntas")}
                  aria-label={`Preguntas frecuentes sobre ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                >
                  Preguntas
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="separador grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {["comparar", "parametros", "elegir"].map((x) => (
          <li key={x}>
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
            texto="Cálculo de parámetros iniciales"
          />
        </li>
        <li>
          <Fila ruta={href("consultar", "inicio", "preparacion")} texto="Fases de la iniciación" />
        </li>
        <li>
          <Fila
            ruta={href("consultar", "inicio", "primeros-meses")}
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
          <FilaDestino id="capitulo" />
        </li>
        <li>
          <FilaDestino id="tablas" />
        </li>
        <li>
          <FilaDestino id="visual" />
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
          <Fila ruta={href("pacientes", "hoja", "cetonas")} texto="Hoja de cetonas" />
        </li>
        <li>
          <Fila
            ruta={href("pacientes", "hoja", "pruebas-cirugia")}
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
const CON_COLOR: [string, { strong: string; soft: string; border: string; ink: string } | null][] =
  [
    ["figura-3", TRAMO_HEX.naranja],
    ["hipoglucemia", null],
    ["interrupcion", null],
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

function Situaciones() {
  const b = MAPA_CONSULTA.find((x) => x.id === "situaciones")!;
  return (
    <TarjetaPortada
      id="mapa-situaciones"
      titulo={b.titulo}
      icono={LifeBuoy}
      hex={CATEGORIA_HEX.consultar}
    >
      <ul className="flex flex-wrap gap-2 px-3 py-3">
        {CON_COLOR.map(([id, t]) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          return (
            <li key={id}>
              <a
                href={d.href}
                className="chip focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                style={t ? { borderColor: t.border, background: t.soft, color: t.ink } : undefined}
              >
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
              className="chip focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              {t}
            </a>
          </li>
        ))}
      </ul>
      <div className="separador mt-auto border-t">
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
      <div className="grid gap-3">
        <Sistemas />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
