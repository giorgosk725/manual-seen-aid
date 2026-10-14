/* La procedencia de un bloque de una herramienta, en una sola línea al pie: «Fuente: Tabla 1,
   p. 3 · Apartado 8, p. 12». La fecha del capítulo va en «Sobre» (0.70.0). Dentro de las herramientas no se
   repiten tablas ni páginas en títulos, filas o cabeceras: van aquí, con su enlace exacto.
   (La lectura del capítulo y el índice de tablas conservan su numeración.) */

export interface Fuente {
  texto: string;
  ruta?: string;
}

export function FuentePie({
  fuentes,
  nota = "",
  className = "mt-2",
}: {
  fuentes: Fuente[];
  /* Lo que se añade tras las fuentes; vacío para no añadir nada. */
  nota?: string;
  className?: string;
}) {
  const vistas = new Set<string>();
  const unicas = fuentes.filter((f) => !vistas.has(f.texto) && !!vistas.add(f.texto));
  if (!unicas.length) return null;
  return (
    <p className={`${className} text-[13px] text-slate-500`}>
      Fuente:{" "}
      {unicas.map((f, k) => (
        <span key={f.texto}>
          {k > 0 && " · "}
          {f.ruta ? (
            <a
              href={f.ruta}
              className="inline-flex min-h-11 items-center font-semibold text-slate-600 hover:underline sm:min-h-6"
            >
              {f.texto}
            </a>
          ) : (
            f.texto
          )}
        </span>
      ))}
      {nota && <> · {nota}</>}
    </p>
  );
}
