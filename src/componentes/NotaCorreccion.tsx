/* Nota de una corrección posterior a la publicación (docs/CORRECCIONES.md): a la vista que la
   hay y qué dice el capítulo publicado, con el detalle a un toque (0.72.0: la nota entera, de
   nueve líneas, se repetía en medio de las tarjetas). */
import { ChevronDown } from "lucide-react";

export function NotaCorreccion({ nota }: { nota: string }) {
  const k = nota.indexOf(": ");
  const titulo = k > 0 ? nota.slice(0, k) : "Nota";
  const cuerpo = k > 0 ? nota.slice(k + 2) : nota;
  return (
    <details className="group mt-1.5 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs font-normal text-slate-600">
      <summary className="flex min-h-11 cursor-pointer sm:min-h-8 list-none items-center gap-1 font-semibold text-slate-700 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={12}
          aria-hidden="true"
          className="shrink-0 transition group-open:rotate-180"
        />
        {titulo}
      </summary>
      <p className="pb-1">{cuerpo}</p>
    </details>
  );
}
