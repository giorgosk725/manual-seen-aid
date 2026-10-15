/* El mapa de consulta (0.72.2, tercera vuelta de la portada): lo que más se consulta, primero y
   a un toque. Arriba, las tres urgencias, con la escala de β-OHB de la Figura 3 (cada tramo lleva
   a su rama). Debajo, los cuatro sistemas con su ficha, sus parámetros y su inicio; después,
   situaciones, iniciación y material para el paciente. La lectura («Leer y comprender») va al
   final (Portada.tsx). Sin entradillas: cada tarjeta, su título y sus accesos. */
import { ArrowRight, HeartHandshake, LifeBuoy, PlayCircle, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { FIGURA3 } from "../contenido";
import { CATEGORIA_HEX, SISTEMA_HEX, TRAMO_HEX } from "../tokens";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";

/* El icono de cada bloque. */
const BLOQUE: Record<string, { icono: LucideIcon }> = {
  sistemas: { icono: SlidersHorizontal },
  situaciones: { icono: LifeBuoy },
  "en-consulta": { icono: PlayCircle },
  pacientes: { icono: HeartHandshake },
};

/* Tarjeta de la portada: cabecera con icono y título; debajo, sus filas. */
export function TarjetaPortada({
  id,
  titulo,
  resumen,
  icono: Icono,
  hex,
  nivel = 3,
  children,
}: {
  id: string;
  nivel?: 2 | 3;
  titulo: string;
  resumen: string;
  icono: LucideIcon;
  hex: { soft: string; strong: string; ink: string };
  children: ReactNode;
}) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  return (
    <section
      aria-labelledby={id}
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white"
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
        <div className="min-w-0 flex-1">
          <Titulo id={id} className="text-base font-extrabold leading-snug text-slate-900">
            {titulo}
          </Titulo>
          {resumen && <p className="mt-0.5 text-sm leading-snug text-slate-600">{resumen}</p>}
        </div>
      </header>
      <div className="flex flex-1 flex-col border-t" style={{ borderColor: "#eef0f2" }}>
        {children}
      </div>
    </section>
  );
}

/* Una fila de entrada: icono, nombre y flecha. */
export function FilaDestino({ id, etiqueta }: { id: string; etiqueta?: string }) {
  const d = DESTINOS.find((x) => x.id === id)!;
  const I = d.icono;
  return (
    <a
      href={d.href}
      className="group flex min-h-11 items-center gap-3 px-4 py-1.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
    >
      <I
        size={16}
        className="shrink-0"
        style={{ color: CATEGORIA_HEX[d.cat].strong }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 font-semibold text-slate-900">{etiqueta ?? d.etiqueta}</span>
      <ArrowRight
        size={14}
        className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
        aria-hidden="true"
      />
    </a>
  );
}

/* ---------- Urgencias ---------- */

/* «β-OHB 1,0-2,9 mmol/l» → cifra «1,0-2,9»; «β-OHB ≥3,0 mmol/l o signos de gravedad» → cifra
   «≥3,0» y resto «o signos de gravedad». Literal: solo se quitan la sigla y la unidad, que van
   una vez encima de la escala. */
function partesDeRango(rango: string) {
  const r = rango.replace(/^β-OHB\s*/, "").replace(/\s*mmol\/l/, "");
  const i = r.indexOf(" ");
  return i < 0 ? { cifra: r, resto: "" } : { cifra: r.slice(0, i), resto: r.slice(i + 1) };
}

function EscalaCetonemia() {
  const d = DESTINOS.find((x) => x.id === "figura-3")!;
  const I = d.icono;
  const t = TRAMO_HEX.naranja;
  return (
    <div
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white"
      style={{ borderColor: "#e6e6e6", borderTop: `4px solid ${t.strong}` }}
    >
      <a
        href={d.href}
        className="group flex min-h-11 items-center gap-2.5 px-3 pb-1 pt-2 text-[15px] font-extrabold leading-tight transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500 sm:text-base"
        style={{ color: t.ink }}
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: t.strong }}
        >
          <I size={17} />
        </span>
        <span className="min-w-0 flex-1">{d.etiqueta}</span>
        <ArrowRight
          size={15}
          className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
      <div className="px-3 pb-3 pt-1">
        {/* Sin mayúsculas: «β» pasaría a «B». */}
        <div className="mb-1 text-xs font-bold text-slate-500">β-OHB (mmol/l)</div>
        <ul aria-label="Tramos de la Figura 3" className="grid grid-cols-4 gap-1 sm:gap-1.5">
          {FIGURA3.tramos.map((x) => {
            const h = TRAMO_HEX[x.clave];
            const { cifra, resto } = partesDeRango(x.rango);
            return (
              <li key={x.clave} className="min-w-0">
                <a
                  href={href("consultar", "figura-3", x.clave)}
                  aria-label={`${x.rango}: ${x.titulo}`}
                  className="flex h-full min-h-14 flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-center transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  style={{ borderColor: h.border, background: h.soft, color: h.ink }}
                >
                  <span className="text-[15px] font-extrabold tabular-nums leading-none sm:text-lg">
                    {cifra}
                  </span>
                  {resto && (
                    <span className="mt-0.5 text-[10px] font-semibold leading-tight sm:text-[11px]">
                      {resto}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const TONO_URGENTE: Record<string, { soft: string; strong: string; ink: string }> = {
  hipoglucemia: TRAMO_HEX.rojo,
  interrupcion: TRAMO_HEX.amarillo,
};
function Urgente({ id }: { id: string }) {
  const d = DESTINOS.find((x) => x.id === id)!;
  const I = d.icono;
  const t = TONO_URGENTE[id];
  return (
    <a
      href={d.href}
      className="group flex h-full min-h-16 items-center gap-2.5 rounded-xl border px-3 py-2 text-[14px] font-extrabold leading-tight transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:text-base"
      style={{
        borderColor: "#e6e6e6",
        borderLeft: `4px solid ${t.strong}`,
        background: t.soft,
        color: t.ink,
      }}
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
        style={{ background: t.strong }}
      >
        <I size={17} />
      </span>
      <span className="min-w-0 flex-1 [hyphens:auto]">{d.etiqueta}</span>
      <ArrowRight
        size={15}
        className="hidden shrink-0 opacity-60 transition group-hover:translate-x-0.5 sm:block"
        aria-hidden="true"
      />
    </a>
  );
}

function Urgencias() {
  return (
    <section aria-labelledby="mapa-urgencias">
      <h2 id="mapa-urgencias" className="sr-only">
        Urgencias
      </h2>
      {/* La Figura 3 a la izquierda; hipoglucemia e interrupción, apiladas a la derecha (en el
          móvil, una al lado de la otra, debajo). */}
      <div className="grid gap-2 sm:gap-3 md:grid-cols-[3fr_2fr]">
        <EscalaCetonemia />
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-1">
          <Urgente id="hipoglucemia" />
          <Urgente id="interrupcion" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Sistemas ---------- */

/* El inicio de cada sistema (la fase de preparación, con el sistema ya elegido). */
const SLUG_INICIO = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

function Sistemas() {
  const b = MAPA_CONSULTA.find((x) => x.id === "sistemas")!;
  return (
    <TarjetaPortada
      id="mapa-sistemas"
      titulo={b.titulo}
      resumen=""
      icono={BLOQUE.sistemas.icono}
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
              {/* Desde la tablet, los dos accesos más usados de cada ficha. */}
              <div
                className="hidden border-t text-[13px] font-semibold sm:grid sm:grid-cols-2"
                style={{ borderColor: "#eef0f2" }}
              >
                <a
                  href={href("sistemas", id, "parametros")}
                  aria-label={`Parámetros de ${CORTO_SISTEMA[c]}`}
                  className="flex min-h-9 items-center justify-center px-1 text-slate-700 transition hover:bg-slate-50 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
                >
                  Parámetros
                </a>
                <a
                  href={href("consultar", "inicio", `preparacion:${SLUG_INICIO[c]}`)}
                  aria-label={`Iniciación de ${CORTO_SISTEMA[c]}`}
                  className="flex min-h-9 items-center justify-center border-l px-1 text-slate-700 transition hover:bg-slate-50 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500"
                  style={{ borderColor: "#eef0f2" }}
                >
                  Iniciación
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="grid border-t sm:grid-cols-2" style={{ borderColor: "#eef0f2" }}>
        <li>
          <FilaDestino id="comparar" />
        </li>
        <li className="border-t sm:border-l sm:border-t-0" style={{ borderColor: "#eef0f2" }}>
          <FilaDestino id="elegir" />
        </li>
      </ul>
    </TarjetaPortada>
  );
}

/* ---------- Situaciones, iniciación y paciente ---------- */

/* Las situaciones que más se consultan, por su nombre corto (la lista entera, en «Todas»). */
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
      resumen=""
      icono={BLOQUE.situaciones.icono}
      hex={CATEGORIA_HEX.consultar}
    >
      <ul className="flex flex-wrap gap-1.5 px-3 py-2.5">
        {SITUACIONES_PORTADA.map(([id, t]) => (
          <li key={id}>
            <a
              href={href("consultar", "situacion", id)}
              className="inline-flex min-h-11 items-center rounded-full border bg-white px-3 text-[13px] font-semibold text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-8"
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

function Bloque({ id }: { id: string }) {
  const b = MAPA_CONSULTA.find((x) => x.id === id)!;
  return (
    <TarjetaPortada
      id={`mapa-${b.id}`}
      titulo={b.titulo}
      resumen=""
      icono={BLOQUE[b.id]?.icono ?? SlidersHorizontal}
      hex={b.id === "pacientes" ? CATEGORIA_HEX.pacientes : CATEGORIA_HEX.consultar}
    >
      <ul className="divide-y" style={{ borderColor: "#eef0f2" }}>
        {b.ids.map((x) => (
          <li key={x}>
            <FilaDestino id={x} etiqueta={b.etiquetas?.[x]} />
          </li>
        ))}
      </ul>
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
        <Urgencias />
        <Sistemas />
        <div className="grid gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="grid md:col-span-2 xl:col-span-1">
            <Situaciones />
          </div>
          <Bloque id="en-consulta" />
          <Bloque id="pacientes" />
        </div>
      </div>
    </section>
  );
}
