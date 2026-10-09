/* Con la caja de búsqueda vacía: preguntas de ejemplo y las búsquedas recientes del lector
   (paleta Ctrl K y pantalla Buscar). */
import { Clock3, Sparkles } from "lucide-react";
import { EJEMPLOS_PREGUNTA } from "../busqueda";
import { href } from "../rutas";
import { borrarRecientes, useRecientes } from "../prefs";

function Chip({ texto, onElegir }: { texto: string; onElegir: (q: string) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onElegir(texto)}
        className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-3 text-left text-sm text-slate-800 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-9"
      >
        {texto}
      </button>
    </li>
  );
}

export function SugerenciasBusqueda({ onElegir }: { onElegir: (q: string) => void }) {
  const recientes = useRecientes();
  return (
    <div className="mt-3 space-y-3">
      {recientes.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Clock3 size={13} aria-hidden="true" /> Tus búsquedas recientes
            </p>
            <button
              type="button"
              onClick={borrarRecientes}
              className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-600 hover:underline sm:min-h-6"
            >
              Borrar
            </button>
          </div>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {recientes.map((r) => (
              <Chip key={r} texto={r} onElegir={onElegir} />
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Sparkles size={13} aria-hidden="true" /> Prueba a preguntar
        </p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {EJEMPLOS_PREGUNTA.map((e) => (
            <Chip key={e} texto={e} onElegir={onElegir} />
          ))}
        </ul>
        <a
          href={href("preguntas")}
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
        >
          Todas las preguntas frecuentes, por temas →
        </a>
      </div>
    </div>
  );
}
