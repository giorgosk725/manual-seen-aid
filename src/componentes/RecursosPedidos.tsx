/* «Abrir …»: cuando la búsqueda nombra un recurso de la app (un caso, una herramienta, la
   sección de un sistema), ese recurso va el primero, encima de los pasajes (buscador.ts,
   recursosPedidos). Los tres buscadores lo usan. 0.92.0 (revisión de tarjetas, ★3): una tarjeta
   como la pregunta frecuente y los pasajes, con su rótulo en burdeos (antes, borde de 2 px
   burdeos e icono de enlace externo, aunque lleva a otra pantalla de la app). */
import type { Resultado } from "../busqueda";

export function RecursosPedidos({ items, onIr }: { items: Resultado[]; onIr?: () => void }) {
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
          </a>
        </li>
      ))}
    </ul>
  );
}
