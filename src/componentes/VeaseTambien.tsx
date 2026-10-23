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
  titulo = "Véase también",
  sinSangrar = false,
}: {
  /* 0.92.1: la misma lista para «Preguntas relacionadas» del buscador. */
  titulo?: string;
  filas: Destino[];
  enCaja?: boolean;
  nivel?: 2 | 3 | 4;
  onIr?: () => void;
  className?: string;
  /* 1.0.12 (24.ª ronda, visual): fuera de una caja con relleno (al pie de un diagrama), las filas
     a lo ancho del título y de su línea (con -mx-3 sobresalían 12 px por la izquierda). */
  sinSangrar?: boolean;
}) {
  if (!filas.length) return null;
  const H = `h${nivel}` as "h2" | "h3" | "h4";
  return (
    <section
      aria-label={titulo}
      className={`${enCaja ? "separador mt-3 border-t" : "tarjeta overflow-hidden"} ${className}`}
    >
      {/* 0.92.1 (segunda revisión de tarjetas): dentro de una caja, el título como rótulo (a
          15/700, sobre filas a 14/600, se leían dos títulos seguidos). */}
      <H className={enCaja ? "rotulo pb-1 pt-3" : "titulo-tarjeta px-3 pb-1.5 pt-3"}>{titulo}</H>
      <ul className={`filas ${enCaja ? (sinSangrar ? "[&_.fila]:px-0" : "-mx-3") : ""}`}>
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
