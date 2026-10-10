/* El selector de sistema de toda la app (Sistemas AID, Situaciones, Iniciar un sistema): una
   casilla por sistema (cuadro con marca y punto de su color). Uno o varios según quien lo use;
   el nombre corto en el móvil y el completo en pantallas grandes, salvo que se den nombres. */
import { Check } from "lucide-react";
import { TABLAS } from "../contenido";
import { SEEN, SISTEMA_HEX } from "../tokens";

const CORTO_SISTEMA = ["MiniMed 780G", "Control-IQ", "CamAPS", "Omnipod 5"];

export function CasillasSistema({
  seleccion,
  onToggle,
  etiqueta = "Sistema",
  nombres,
  pista,
}: {
  /* Columnas (0-3, orden de la Tabla 1) marcadas. */
  seleccion: number[];
  onToggle: (c: number) => void;
  etiqueta?: string;
  /* Nombres fijos (en vez de corto en el móvil y completo en escritorio). */
  nombres?: string[];
  /* Texto breve al lado («Marca otro para compararlos»). */
  pista?: string;
}) {
  return (
    <div role="group" aria-label={etiqueta} className="flex flex-wrap items-center gap-1.5">
      {TABLAS.T1.columnas.map((nombre, c) => {
        const on = seleccion.includes(c);
        const h = SISTEMA_HEX[c];
        return (
          <button
            key={nombre}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(c)}
            className="tap-44 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-semibold text-slate-800 transition ease-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            style={
              on
                ? { borderColor: SEEN.burdeos, background: "#f7eff3" }
                : { borderColor: "#d4d4d4", background: "#fff" }
            }
          >
            <span
              aria-hidden="true"
              className="grid h-4 w-4 shrink-0 place-items-center rounded-sm border"
              style={
                on
                  ? { background: SEEN.burdeos, borderColor: SEEN.burdeos }
                  : { background: "#fff", borderColor: "#9ca3af" }
              }
            >
              {on && <Check size={12} color="#fff" />}
            </span>
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: h.strong }}
            />
            {nombres ? (
              <span>{nombres[c]}</span>
            ) : (
              <>
                <span className="sm:hidden">{CORTO_SISTEMA[c]}</span>
                <span className="hidden sm:inline">{nombre}</span>
              </>
            )}
          </button>
        );
      })}
      {pista && <span className="text-xs text-slate-500">{pista}</span>}
    </div>
  );
}
