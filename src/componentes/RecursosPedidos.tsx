/* «Abrir …»: cuando la búsqueda nombra un recurso de la app (un caso, una herramienta, la
   sección de un sistema), ese recurso va el primero, encima de los pasajes (buscador.ts,
   recursosPedidos). Los tres buscadores lo usan. 0.92.0 (revisión de tarjetas, ★3): una tarjeta
   como la pregunta frecuente y los pasajes, con su rótulo en burdeos (antes, borde de 2 px
   burdeos e icono de enlace externo, aunque lleva a otra pantalla de la app). */
import type { Resultado } from "../busqueda";

/* 1.0.6 (21.ª ronda, R1): `linea`, la respuesta corta del destino bajo su título (la fila de una
   ficha: «Alcohol · Modos y funciones de Omnipod 5» salía sin texto). Solo la da Buscar. */
export function RecursosPedidos({
  items,
  onIr,
  linea,
}: {
  items: Resultado[];
  onIr?: () => void;
  linea?: (ruta: string) => { v: string; n?: string; cond?: string; antes?: string } | undefined;
}) {
  if (!items.length) return null;
  return (
    <ul className="mt-2 space-y-1" aria-label="Abrir">
      {items.map((r) => (
        <li key={r.entrada.id}>
          <a
            href={r.entrada.ruta}
            onClick={onIr}
            className="tarjeta hover-lift block min-h-11 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
          >
            <span className="rotulo block" style={{ color: "var(--acento-texto)" }}>
              Abrir
            </span>
            {r.entrada.titulo}
            {(() => {
              // 1.0.9 (revisión externa D108-03): el dato con lo que lo acompaña en la ficha (la
              // condición, lo previo y la nota), no solo la respuesta.
              const d = linea?.(r.entrada.ruta);
              if (!d) return null;
              return (
                <span className="mt-0.5 block font-normal leading-snug text-slate-700">
                  {d.cond && <span className="block italic text-slate-600">{d.cond}</span>}
                  <span className="block">
                    {d.antes ? `${d.antes}. ` : ""}
                    {d.v}
                  </span>
                  {d.n && <span className="mt-0.5 block text-[13px] text-slate-600">{d.n}</span>}
                </span>
              );
            })()}
          </a>
        </li>
      ))}
    </ul>
  );
}
