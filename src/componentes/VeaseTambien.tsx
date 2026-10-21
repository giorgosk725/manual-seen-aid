/* 0.92.0 (revisión de tarjetas, ★1): «Véase también», una sola forma en toda la app: la tarjeta de
   lista (título de tarjeta y filas sin flecha), como «Para seguir» en Situaciones. Antes había
   tres: esta tarjeta, un rótulo con chips con flecha y una línea «Véase también: X →».
   `enCaja`: dentro de otra tarjeta (una tarea, un paso, una respuesta), sin el marco propio
   (marco dentro de marco): la misma lista, separada por una línea y alineada con el texto de la
   caja. `nivel`: el del título, por debajo del de la caja que lo contiene. */
export interface Destino {
  href: string;
  t: string;
}

export function VeaseTambien({
  filas,
  enCaja = false,
  nivel = 2,
  onIr,
  className = "",
}: {
  filas: Destino[];
  enCaja?: boolean;
  nivel?: 2 | 3 | 4;
  onIr?: () => void;
  className?: string;
}) {
  if (!filas.length) return null;
  const H = `h${nivel}` as "h2" | "h3" | "h4";
  return (
    <section
      aria-label="Véase también"
      className={`${enCaja ? "separador mt-3 border-t" : "tarjeta overflow-hidden"} ${className}`}
    >
      <H className={`titulo-tarjeta pb-1.5 pt-3 ${enCaja ? "" : "px-3"}`}>Véase también</H>
      <ul className={`filas ${enCaja ? "-mx-3" : ""}`}>
        {filas.map((f) => (
          <li key={f.href}>
            <a href={f.href} onClick={onIr} className="fila">
              <span className="min-w-0 flex-1">{f.t}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
