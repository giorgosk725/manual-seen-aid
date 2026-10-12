/* Bloque plegado «Cómo interpretar este dato»: explicación de la app con su fuente, separada del
   texto literal. Solo aparece donde hay una interpretación (interpretaciones.ts). */
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { TablaId } from "../contenido";
import {
  cargarInterpretaciones,
  interpretacionesDe,
  type Interpretacion,
} from "../interpretaciones";

export function ComoInterpretar({
  tabla,
  fila,
  general = false,
}: {
  tabla: TablaId;
  fila?: number;
  /* Si no hay explicación de la fila, la de la tabla (sin enseñar las dos juntas). */
  general?: boolean;
}) {
  const [lista, setLista] = useState<Interpretacion[] | null>(null);
  useEffect(() => {
    let vivo = true;
    cargarInterpretaciones().then((l) => {
      if (vivo) setLista(l);
    });
    return () => {
      vivo = false;
    };
  }, []);
  if (!lista) return null;
  const propias = interpretacionesDe(lista, tabla, fila);
  // Solo la explicación de un hallazgo concreto (fila); la de la tabla entera ya no se enseña.
  const items = general ? propias : propias.filter((x) => x.fila !== undefined);
  if (!items.length) return null;
  const titulo = "Cómo interpretar este hallazgo";
  return (
    <details
      className="no-imprimir mt-2 rounded-lg border px-3 py-1"
      style={{ borderColor: "#e3c7d3" }}
    >
      <summary className="min-h-11 cursor-pointer text-sm font-semibold text-slate-800 sm:min-h-8">
        {titulo}
      </summary>
      <div className="space-y-2 pb-2 text-sm text-slate-800">
        {items.map((x) => (
          <div key={x.id}>
            <p>{x.texto}</p>
            {x.enlace && (
              <a
                href={x.enlace.ruta}
                className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8"
              >
                {x.enlace.texto} <ArrowRight size={13} aria-hidden="true" />
              </a>
            )}
            <p className="mt-1 text-xs text-slate-600">
              Explicación complementaria, no es texto del capítulo
              {x.estado === "borrador" ? " · borrador pendiente de revisión" : ""} · Fuente:{" "}
              {x.fuente}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}
