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
import { tipoBajoNombre } from "../fichaAlgoritmo";

const foco =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500";

/* Tarjeta de la portada: cabecera con un icono del área y el título; debajo, sus filas. */
export function TarjetaPortada({
  id,
  titulo,
  icono: Icono,
  hex,
  nivel = 3,
  grande = false,
  ajustada = false,
  children,
}: {
  /* 0.96.0 (16.ª ronda, visual): a la altura de lo que lleva, no a la de su vecina. */
  ajustada?: boolean;
  id: string;
  nivel?: 2 | 3;
  /* 0.94.0 (rediseño, fase 2): el bloque de los sistemas, con el título a 17 px (primer nivel). */
  grande?: boolean;
  titulo: string;
  icono: LucideIcon;
  hex: { soft: string; strong: string; ink: string };
  children: ReactNode;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <section
      aria-labelledby={id}
      className={`tarjeta flex min-w-0 flex-col overflow-hidden ${ajustada ? "" : "h-full"}`}
    >
      <header className={`flex items-center gap-2.5 px-4 ${grande ? "py-3" : "py-2.5"}`}>
        <Icono size={18} aria-hidden="true" className="shrink-0" style={{ color: hex.strong }} />
        {/* 0.92.0 (revisión de tarjetas, ★4): 15/700 como todo título de tarjeta (antes, 16). */}
        <Titulo id={id} className={`${grande ? "titulo-seccion" : "titulo-tarjeta"} min-w-0`}>
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
  // 0.94.0 (rediseño, fase 2): accesos al pie de cada tarjeta, en una fila de tres tercios.
  const enlace = `foco-dentro flex min-h-10 flex-1 items-center justify-center px-1.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 hover:underline ${foco}`;
  return (
    <TarjetaPortada
      id="mapa-sistemas"
      titulo={b.titulo}
      icono={SlidersHorizontal}
      hex={CATEGORIA_HEX.consultar}
      grande
    >
      {/* 0.94.0 (rediseño, fase 2): el bloque más usado, con más presencia: foto mayor, el nombre
          a 16/800 y, desde sm, el dato que identifica cada sistema (su algoritmo, el mismo de la
          tarjeta del Resumen). */}
      <ul
        aria-label="Los cuatro sistemas"
        className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3 2xl:grid-cols-4"
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
                className={`foco-dentro group flex min-h-11 flex-1 items-center gap-2 p-1.5 pl-2.5 text-left transition hover:bg-slate-50 sm:gap-3 sm:p-3 sm:pl-4 ${foco}`}
              >
                <img
                  src={FOTO_SISTEMA[id]}
                  decoding="async"
                  alt=""
                  width={64}
                  height={64}
                  className="foto-sistema h-10 w-10 shrink-0 rounded-md border border-[var(--linea-suave)] bg-white object-cover sm:h-16 sm:w-16"
                />
                <span className="min-w-0">
                  {/* El nombre corto de la casilla («Control-IQ»): en una línea. */}
                  <span
                    className="block text-[13px] font-bold leading-tight group-hover:underline sm:text-base sm:font-extrabold"
                    style={{ color: h.ink }}
                  >
                    {CORTO_CASILLA[c]}
                  </span>
                  <span className="mt-1 hidden text-[13px] font-semibold leading-snug text-slate-600 sm:block">
                    {tipoBajoNombre(c, CORTO_CASILLA[c])}
                  </span>
                </span>
              </a>
              {/* Desde la tablet, los accesos más usados de cada ficha (en el móvil, la ficha
                  los tiene en sus pestañas). 0.96.0 (16.ª ronda, adjunto): también Modos, en
                  cuartos; con las cuatro tarjetas en una fila (2xl) o en la tablet estrecha, 2 × 2. */}
              <div className="separador hidden border-t sm:grid sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-2 [&>a]:border-[var(--linea-suave)] [&>a:not(:first-child)]:border-l max-md:[&>a:nth-child(3)]:border-l-0 max-md:[&>a:nth-child(n+3)]:border-t 2xl:[&>a:nth-child(3)]:border-l-0 2xl:[&>a:nth-child(n+3)]:border-t">
                <a
                  href={href("sistemas", id, "parametros")}
                  aria-label={`Parámetros de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                >
                  Parámetros
                </a>
                <a
                  href={href("sistemas", id, "modos")}
                  aria-label={`Modos y funciones de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                >
                  Modos
                </a>
                <a
                  href={href("consultar", "inicio", `calculadora:${SLUG_INICIO[c]}`)}
                  // 0.78.1 (segunda ronda, R5): abre la calculadora; «Iniciación» de la ficha abre la
                  // preparación. Un rótulo por destino.
                  aria-label={`Cálculo de parámetros iniciales de ${CORTO_SISTEMA[c]}`}
                  className={enlace}
                >
                  {/* 0.97.1 (17.ª ronda, senior): «Cálculo» solo no decía de qué. */}
                  Cálculo inicial
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
      ajustada
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
/* 0.77.1 (auditoría del perfil senior): sin «Sospecha de fallo de infusión», que es la misma
   decisión que «Hiperglucemia y cetonemia» (Figura 3); la situación sigue en Situaciones. */
const SITUACIONES_PORTADA: [string, string][] = [
  ["ejercicio-aerobico", "Ejercicio"],
  ["enfermedad-intercurrente", "Enfermedad intercurrente"],
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
      {/* 0.92.0 (revisión de tarjetas, ★14): en el móvil, las tres con pantalla propia como filas a
          todo lo ancho (antes, chips que se partían en dos líneas); desde sm, chips con las demás. */}
      <ul className="filas sm:hidden">
        {CON_COLOR.map(([id, t]) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          return (
            <li key={id}>
              <a
                href={d.href}
                className={`fila ${foco}`}
                style={t ? { background: t.soft, color: t.ink } : undefined}
              >
                {d.etiqueta}
              </a>
            </li>
          );
        })}
      </ul>
      <ul className="hidden flex-wrap gap-2 px-3 py-3 sm:flex">
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
        {SITUACIONES_PORTADA.map(([id, t]) => (
          <li key={id}>
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
      {/* 0.94.0 (rediseño, fase 2): tres niveles. Primero los sistemas (lo más usado); después la
          consulta (iniciación y situaciones, a la par); al final, la lectura y el paciente. */}
      <div className="grid gap-3 sm:gap-4">
        <Sistemas />
        {/* 0.96.0 (16.ª ronda, visual): cada tarjeta a su altura (la de Iniciación, estirada a la de
            Situaciones, dejaba 60 px en blanco al pie a 1366). */}
        <div className="grid items-start gap-3 md:grid-cols-2">
          <Iniciacion />
          <Situaciones />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Lectura />
          <Paciente />
        </div>
      </div>
    </section>
  );
}
