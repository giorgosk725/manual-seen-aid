/* Las tarjetas operativas de cada sistema (src/fichaOperativa.ts): datos cortos con su rótulo,
   lo de la variante (Control-IQ+, Liberty) junto al dato y la fuente al pie, que lleva al texto
   literal del capítulo. Dos formas: casillas (datos cortos, en rejilla) y filas (parámetros y
   modos, con el rótulo a la izquierda). */
import type { ReactNode } from "react";
import { FuentePie } from "./FuentePie";
import { fuentesDeDatos, type Dato, type EnAutomatico, type GrupoFicha } from "../fichaOperativa";
import { SISTEMA_HEX } from "../tokens";

function Variante({ c, d }: { c: number; d: Dato }) {
  if (!d.variante) return null;
  const h = SISTEMA_HEX[c];
  return (
    <span className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="insignia" style={{ background: h.soft, color: h.ink }}>
        {d.variante.nombre}
      </span>
      <span>{d.variante.v}</span>
    </span>
  );
}

/* Datos cortos: en el móvil, filas con el rótulo a la izquierda; desde sm, casillas en rejilla
   con el rótulo encima. El dato, en negrita; su detalle, debajo y más discreto. */
export function CasillasDatos({
  c,
  datos,
  className = "",
}: {
  c: number;
  datos: Dato[];
  className?: string;
}) {
  return (
    <dl
      className={`grid gap-y-2.5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3 lg:grid-cols-3 ${className}`}
    >
      {datos.map((d) => (
        <div key={d.r} className="grid min-w-0 grid-cols-[6.5rem_1fr] gap-x-3 sm:block">
          <dt className="rotulo pt-0.5 leading-tight sm:pt-0">{d.r}</dt>
          <dd className="min-w-0 sm:mt-0.5">
            <span className="block text-[15px] font-semibold leading-snug text-slate-900">
              {d.v}
            </span>
            {d.n && (
              <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{d.n}</span>
            )}
            <span className="block text-[13px] leading-snug text-slate-800">
              <Variante c={c} d={d} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function TarjetaDatos({
  c,
  titulo,
  children,
}: {
  c: number;
  titulo: string;
  children: ReactNode;
}) {
  const h = SISTEMA_HEX[c];
  return (
    <section
      aria-label={titulo}
      className="tarjeta tarjeta-sistema min-w-0 p-4"
      style={{ ["--sis" as string]: h.strong }}
    >
      <h3 className="titulo-tarjeta mb-2.5" style={{ color: h.ink }}>
        {titulo}
      </h3>
      {children}
    </section>
  );
}

/* Varias tarjetas de casillas, una debajo de otra, con una sola línea de fuente. */
export function GruposDatos({ c, grupos }: { c: number; grupos: GrupoFicha[] }) {
  return (
    <div className="space-y-3">
      {grupos.map((g) => (
        <TarjetaDatos key={g.titulo} c={c} titulo={g.titulo}>
          <CasillasDatos c={c} datos={g.datos} />
        </TarjetaDatos>
      ))}
      <FuentePie fuentes={fuentesDeDatos(grupos.flatMap((g) => g.datos))} />
    </div>
  );
}

const EN_AUTOMATICO: Record<EnAutomatico, string> = {
  si: "Actúa en automático",
  no: "Bolos o modo manual",
  inicio: "Solo al inicio y en manual",
  fijo: "No configurable",
};

/* Filas con el rótulo a la izquierda (parámetros, modos): una tarjeta, una fila por dato. */
export function FilasDatos({ c, datos, titulo }: { c: number; datos: Dato[]; titulo: string }) {
  const h = SISTEMA_HEX[c];
  return (
    <div className="space-y-3">
      <section
        aria-label={titulo}
        className="tarjeta tarjeta-sistema overflow-hidden"
        style={{ ["--sis" as string]: h.strong }}
      >
        <dl className="divide-y divide-[var(--linea-suave)]">
          {datos.map((d) => (
            <div
              key={d.r}
              className="grid gap-x-5 gap-y-1 px-4 py-3 sm:grid-cols-[minmax(10rem,14rem)_1fr]"
            >
              <dt className="min-w-0">
                <span className="block text-[15px] font-bold leading-snug text-slate-900">
                  {d.r}
                </span>
                {d.auto && (
                  <span
                    className="insignia mt-1"
                    style={d.auto === "si" ? { background: h.soft, color: h.ink } : undefined}
                  >
                    {EN_AUTOMATICO[d.auto]}
                  </span>
                )}
              </dt>
              <dd className="min-w-0 text-[15px] leading-snug text-slate-800">
                {d.v}
                {d.n && <span className="mt-0.5 block text-[13px] text-slate-600">{d.n}</span>}
                <Variante c={c} d={d} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <FuentePie fuentes={fuentesDeDatos(datos)} />
    </div>
  );
}
