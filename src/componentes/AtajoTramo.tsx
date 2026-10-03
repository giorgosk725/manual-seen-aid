/* Atajo de la búsqueda: si se escribe una cifra de β-OHB («β-OHB 1,2», «cetonemia 0,8»),
   se ofrece ir directamente a su tramo de la Figura 3. */
import { ArrowRight, Droplets } from "lucide-react";
import { tramoDeConsulta } from "../busqueda";
import { ESCALA_CETONEMIA } from "../contenido/diagramas";
import { href } from "../rutas";

/* Clases con equivalente nocturno (index.css), en el color de cada tramo. */
const CLASES: Record<string, string> = {
  verde: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amarillo: "border-amber-200 bg-amber-50 text-amber-900",
  naranja: "border-orange-200 bg-orange-50 text-orange-900",
  rojo: "border-red-200 bg-red-50 text-red-900",
};

export function AtajoTramo({ consulta }: { consulta: string }) {
  const t = tramoDeConsulta(consulta);
  if (!t) return null;
  const tramo = ESCALA_CETONEMIA.tramos.find((x) => x.clave === t.clave);
  return (
    <a
      href={href("consultar", "figura-3", t.clave)}
      className={`mt-2 flex items-center gap-3 rounded-md border p-3 text-sm transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 ${CLASES[t.clave]}`}
    >
      <Droplets size={18} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block font-bold">
          β-OHB {String(t.valor).replace(".", ",")} mmol/l: ir a su tramo de la Figura 3
        </span>
        {tramo && <span className="block text-xs">{tramo.etiqueta}</span>}
      </span>
      <ArrowRight size={15} className="shrink-0" aria-hidden="true" />
    </a>
  );
}
