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
    <p className={`fuente-pie ${className}`}>
      Fuente:{" "}
      {unicas.map((f, k) => (
        <span key={f.texto}>
          {/* 0.82.1 (sexta ronda, visual): espacio duro antes del punto: si la línea se parte, el
              «·» se queda al final (como en el resto de la app). */}
          {k > 0 && "\u00a0· "}
          {f.ruta ? (
            <a
              href={f.ruta}
              // 0.75.1 (auditoría): en línea, con el área táctil de 44 px por `tap-44` (antes,
              // inline-flex de 44 px de alto: en el móvil cada fuente caía a su propia línea).
              // 0.84.1 (octava ronda): `inline` (no inline-block): con inline-block, el espacio duro
              // no impedía que el «·» abriera línea; el relleno vertical mantiene los 24 px.
              className="tap-44 inline py-1"
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
