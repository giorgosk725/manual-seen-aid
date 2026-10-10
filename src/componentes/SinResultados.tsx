/* Cuando no hay nada con esas palabras (portada, paleta y Buscar): en vez de un callejón sin
   salida, las consultas más frecuentes. */
import { href } from "../rutas";
import type { Frecuente } from "../frecuentes";

const PUERTAS = [
  { t: "Cetonemia (Figura 3)", ruta: href("consultar", "figura-3") },
  { t: "Situaciones", ruta: href("consultar", "situacion") },
  { t: "Interrupción del sistema", ruta: href("consultar", "interrupcion") },
  { t: "Iniciar un sistema", ruta: href("consultar", "inicio") },
  { t: "Revisar la descarga", ruta: href("consultar", "descarga", "1") },
  { t: "Comparar sistemas (Tabla 1)", ruta: href("sistemas", "todos", "esencial") },
];

export function SinResultados({
  onIr,
  q,
  cercanas = [],
}: {
  onIr?: () => void;
  q?: string;
  /* Preguntas frecuentes cercanas por el sentido (faqsCercanas), si las hay. */
  cercanas?: Frecuente[];
}) {
  return (
    <div
      role="status"
      className="mt-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
    >
      <p>
        {q
          ? `El capítulo no parece tratar «${q}».`
          : "No se han encontrado resultados en el capítulo."}{" "}
        {cercanas.length
          ? "Quizá buscabas:"
          : "Prueba con otras palabras («sueño», «cetonemia», «TBR») o entra por una consulta:"}
      </p>
      {cercanas.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {cercanas.map((f) => (
            <li key={f.id}>
              <a
                href={href("preguntas", f.id)}
                onClick={onIr}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 underline underline-offset-2 sm:min-h-8"
              >
                {f.pregunta}
              </a>
            </li>
          ))}
        </ul>
      )}
      <a
        href={href("preguntas")}
        onClick={onIr}
        className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 underline underline-offset-2 sm:min-h-9"
      >
        Explorar las preguntas frecuentes por temas →
      </a>
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
