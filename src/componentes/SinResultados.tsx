/* Cuando no hay nada con esas palabras (portada, paleta y Buscar): en vez de un callejón sin
   salida, las puertas de «¿Qué necesitas?». */
import { href } from "../rutas";

const PUERTAS = [
  { t: "Cetonemia (Figura 3)", ruta: href("consultar", "figura-3") },
  { t: "Situación y sistema", ruta: href("consultar", "situacion") },
  { t: "Interrupción del sistema", ruta: href("consultar", "interrupcion") },
  { t: "Iniciar un sistema", ruta: href("consultar", "inicio") },
  { t: "Revisar la descarga", ruta: href("consultar", "descarga", "1") },
  { t: "Comparar sistemas (Tabla 1)", ruta: href("consultar", "tablas", "T1") },
  { t: "Glosario de siglas", ruta: href("consultar", "glosario") },
];

export function SinResultados({ onIr }: { onIr?: () => void }) {
  return (
    <div
      role="status"
      className="mt-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
    >
      <p>
        No hay resultados en el capítulo con esas palabras. Prueba con otras («sueño», «cetonemia»,
        «TBR») o entra por una situación:
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {PUERTAS.map((p) => (
          <li key={p.t}>
            <a
              href={p.ruta}
              onClick={onIr}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-3 text-sm text-slate-800 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-9"
            >
              {p.t}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
