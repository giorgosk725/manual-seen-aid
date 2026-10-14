/* El mapa de consulta (14-10-2026, segunda vuelta de la portada): cuatro tarjetas, cada una con
   la pregunta que responde, una línea de qué contiene y sus entradas en filas. La lectura
   («Leer y comprender») va debajo, en una tarjeta con la misma forma (Portada.tsx). Es la portada
   misma: no hay otra pantalla «Consultar». */
import { ArrowRight, HeartHandshake, LifeBuoy, PlayCircle, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { CATEGORIA_HEX, SISTEMA_HEX, TRAMO_HEX } from "../tokens";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";

/* El icono de cada bloque (0.70.0: sin la línea de resumen). */
const BLOQUE: Record<string, { icono: LucideIcon }> = {
  sistemas: { icono: SlidersHorizontal },
  situaciones: { icono: LifeBuoy },
  "en-consulta": { icono: PlayCircle },
  pacientes: { icono: HeartHandshake },
};

/* Tarjeta de la portada: cabecera con icono, título y resumen; debajo, sus filas. */
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
      <header className="flex items-center gap-3 px-4 pb-2 pt-2.5 sm:items-start sm:pb-3 sm:pt-4">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl"
          style={{ background: hex.soft, color: hex.strong }}
        >
          <Icono size={20} />
        </span>
        <div className="min-w-0">
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

/* Los cuatro sistemas, con su foto, a un toque de su ficha (14-10-2026), dentro de la tarjeta
   de sistemas (la cabecera de la portada no lleva enlaces). */
function SistemasDeUnVistazo() {
  return (
    <nav
      aria-label="Los cuatro sistemas"
      className="flex flex-1 items-center border-b px-2 py-2 sm:px-3"
      style={{ borderColor: "#eef0f2" }}
    >
      <ul className="grid w-full grid-cols-4 gap-1">
        {ORDEN_SISTEMAS.map((id, c) => (
          <li key={id} className="min-w-0">
            <a
              href={href("sistemas", id)}
              className="flex min-h-11 flex-col items-center gap-1 rounded-lg p-1 text-center transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              <img
                src={FOTO_SISTEMA[id]}
                alt=""
                width={44}
                height={44}
                className="h-10 w-10 shrink-0 rounded-lg border bg-white object-cover sm:h-11 sm:w-11 lg:h-14 lg:w-14"
                style={{ borderColor: "#e6e6e6" }}
              />
              <span
                className="min-w-0 text-[11px] font-bold leading-tight sm:text-xs"
                style={{ color: SISTEMA_HEX[c].ink }}
              >
                {CORTO_SISTEMA[c]}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* Las tres situaciones de urgencia (0.72.0): tarjetas con el tono de su riesgo, a un toque. */
const URGENTES = ["figura-3", "hipoglucemia", "interrupcion"];
const TONO_URGENTE: Record<string, { soft: string; strong: string; ink: string }> = {
  "figura-3": TRAMO_HEX.naranja,
  hipoglucemia: TRAMO_HEX.rojo,
  interrupcion: TRAMO_HEX.amarillo,
};
function SituacionesUrgentes({ ids }: { ids: string[] }) {
  return (
    <ul
      // En la tablet y el portátil, la tarjeta es estrecha: una fila por urgencia (0.72.0).
      className="grid grid-cols-3 gap-1.5 border-b p-2 sm:gap-2 sm:p-3 md:grid-cols-1 xl:grid-cols-3"
      style={{ borderColor: "#eef0f2" }}
    >
      {ids.map((id) => {
        const d = DESTINOS.find((x) => x.id === id)!;
        const I = d.icono;
        const t = TONO_URGENTE[id];
        return (
          <li key={id} className="min-w-0">
            <a
              href={d.href}
              className="flex h-full min-h-20 flex-col gap-1.5 rounded-xl border p-2 text-[13px] font-bold leading-tight transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:p-2.5 sm:text-sm md:min-h-11 md:flex-row md:items-center md:gap-2.5 xl:min-h-20 xl:flex-col xl:items-start xl:gap-1.5"
              style={{ borderColor: "#e6e6e6", background: t.soft, color: t.ink }}
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                style={{ background: t.strong }}
              >
                <I size={17} />
              </span>
              <span className="min-w-0 [hyphens:auto]">{d.etiqueta}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function MapaConsulta() {
  return (
    <section aria-labelledby="mapa-consulta">
      {/* Cada tarjeta dice ya qué ofrece: el título del mapa, solo para lectores de pantalla. */}
      <h2 id="mapa-consulta" tabIndex={-1} className="sr-only scroll-mt-4">
        Consultar
      </h2>
      {/* Dos columnas desde la tablet (0.72.0: la barra lateral sale desde 1024 px). */}
      <div className="grid gap-2 sm:gap-3 md:grid-cols-2">
        {MAPA_CONSULTA.map((b) => (
          <TarjetaPortada
            key={b.id}
            id={`mapa-${b.id}`}
            titulo={b.titulo}
            resumen=""
            icono={BLOQUE[b.id]?.icono ?? SlidersHorizontal}
            hex={b.id === "pacientes" ? CATEGORIA_HEX.pacientes : CATEGORIA_HEX.consultar}
          >
            {b.id === "sistemas" && <SistemasDeUnVistazo />}
            {b.id === "situaciones" && <SituacionesUrgentes ids={URGENTES} />}
            <ul className="divide-y" style={{ borderColor: "#eef0f2" }}>
              {b.ids
                .filter((id) => b.id !== "situaciones" || !URGENTES.includes(id))
                .map((id) => (
                  <li key={id}>
                    <FilaDestino id={id} etiqueta={b.etiquetas?.[id]} />
                  </li>
                ))}
            </ul>
          </TarjetaPortada>
        ))}
      </div>
    </section>
  );
}
