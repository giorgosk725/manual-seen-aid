/* Bloque plegado «Cómo interpretar este dato»: explicación de la app con su fuente, separada del
   texto literal. Solo aparece donde hay una interpretación (interpretaciones.ts). */
import type { TablaId } from "../contenido";
import { interpretacionesDe } from "../interpretaciones";

export function ComoInterpretar({ tabla, fila }: { tabla: TablaId; fila?: number }) {
  const items = interpretacionesDe(tabla, fila);
  if (!items.length) return null;
  return (
    <details
      className="no-imprimir mt-2 rounded-lg border px-3 py-1"
      style={{ borderColor: "#e3c7d3" }}
    >
      <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-800 sm:min-h-8">
        Cómo interpretar este dato
      </summary>
      <div className="space-y-2 pb-2 text-sm text-slate-800">
        {items.map((x) => (
          <div key={x.id}>
            <p>{x.texto}</p>
            <p className="mt-1 text-xs text-slate-600">
              Explicación de la app, no texto del capítulo
              {x.estado === "borrador" ? " · borrador pendiente de revisión" : ""} · Fuente:{" "}
              {x.fuente}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}
