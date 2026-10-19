/* Nota de una corrección posterior a la publicación (docs/CORRECCIONES.md): a la vista que la
   hay y qué dice el capítulo publicado, con el detalle a un toque (0.72.0: la nota entera, de
   nueve líneas, se repetía en medio de las tarjetas). */

export function NotaCorreccion({ nota }: { nota: string }) {
  const k = nota.indexOf(": ");
  const titulo = k > 0 ? nota.slice(0, k) : "Nota";
  const resto = k > 0 ? nota.slice(k + 2) : nota;
  // 0.78.1: tras «…: » el texto seguía en minúscula; al pintarlo aparte, inicial en mayúscula.
  const cuerpo = resto.charAt(0).toLocaleUpperCase("es") + resto.slice(1);
  // 0.74.2 (petición del responsable: nada útil plegado): la nota, a la vista.
  return (
    <p className="mt-1.5 rounded-md border border-dashed border-slate-300 px-2 py-1.5 text-xs font-normal text-slate-600">
      <span className="block font-semibold text-slate-700">{titulo}</span>
      {cuerpo}
    </p>
  );
}
