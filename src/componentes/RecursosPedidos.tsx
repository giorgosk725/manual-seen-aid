/* «Abrir …»: cuando la búsqueda nombra un recurso de la app (un caso, una herramienta, la
   sección de un sistema), ese recurso va el primero, encima de los pasajes (buscador.ts,
   recursosPedidos). Los tres buscadores lo usan. */
import { ArrowRight, ExternalLink } from "lucide-react";
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
            className="flex min-h-11 items-center gap-2 rounded-lg border-2 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#8E254E" }}
          >
            <ExternalLink
              size={15}
              className="shrink-0"
              style={{ color: "#8E254E" }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span
                className="block text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "#8E254E" }}
              >
                Abrir
              </span>
              {r.entrada.titulo}
            </span>
            <ArrowRight size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
