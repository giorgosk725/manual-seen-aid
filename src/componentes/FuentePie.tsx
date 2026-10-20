/* La procedencia de un bloque de una herramienta, en una sola línea al pie: «Fuente: Tabla 1,
   p. 3 · Apartado 8, p. 12». La fecha del capítulo va en «Sobre» (0.70.0). Dentro de las herramientas no se
   repiten tablas ni páginas en títulos, filas o cabeceras: van aquí, con su enlace exacto.
   (La lectura del capítulo y el índice de tablas conservan su numeración.) */

export interface Fuente {
  texto: string;
  ruta?: string;
}

/* 0.87.1 (undécima ronda, senior y visual): cada referencia («Apartado 10, p. 19») de una pieza,
   sin partir; solo la entradilla entre paréntesis puede pasar de línea. */
function Referencia({ t }: { t: string }) {
  const i = t.indexOf(" (");
  const ref = i < 0 ? t : t.slice(0, i);
  // 0.88.1 (duodécima ronda, visual): una cadena con varias referencias («Apartado 5, pp. 4–5 ·
  // Apartado 9, pp. 15, 17») se parte entre ellas, no dentro (antes, un solo tramo sin partir
  // desbordaba en el móvil).
  const partes = ref.split(/\s·\s/);
  return (
    <>
      {partes.map((x, k) => (
        <span key={k}>
          {k > 0 && "\u00a0· "}
          <span className="whitespace-nowrap">{x}</span>
        </span>
      ))}
      {i < 0 ? null : <span>{t.slice(i)}</span>}
    </>
  );
}

export function FuentePie({
  fuentes,
  nota = "",
  className = "mt-2",
  onIr,
}: {
  /* Al seguir una fuente (p. ej. marcar el paso del guion en la ruta). */
  onIr?: () => void;
  fuentes: Fuente[];
  /* Lo que se añade tras las fuentes; vacío para no añadir nada. */
  nota?: string;
  className?: string;
}) {
  const vistas = new Set<string>();
  // 0.86.1 (décima ronda, senior, R3 y visual): sin partir «Apartado 10» ni «Tabla 4» (espacio
  // duro tras la palabra) y en el orden del capítulo: tablas, figuras y apartados por número y
  // página (antes, en el de los datos: «Apartado 9 · Apartado 10 · Apartado 7»).
  const orden = (t: string) => {
    const m = /^(Tabla|Figura|Apartado)\s(\d+)/.exec(t);
    const pag = Number(/p+\.\s?(\d+)/.exec(t)?.[1] ?? 0);
    return m ? ["Tabla", "Figura", "Apartado"].indexOf(m[1]) * 1e6 + Number(m[2]) * 1e3 + pag : 4e6;
  };
  const unicas = fuentes
    .filter((f) => !vistas.has(f.texto) && !!vistas.add(f.texto))
    .map((f) => ({ ...f, texto: f.texto.replace(/\b(Apartado|Tabla|Figura) /g, "$1\u00a0") }))
    .sort((a, b) => orden(a.texto) - orden(b.texto));
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
              onClick={onIr}
              // 0.75.1 (auditoría): en línea, con el área táctil de 44 px por `tap-44` (antes,
              // inline-flex de 44 px de alto: en el móvil cada fuente caía a su propia línea).
              // 0.84.1 (octava ronda): `inline` (no inline-block): con inline-block, el espacio duro
              // no impedía que el «·» abriera línea; el relleno vertical mantiene los 24 px.
              className="tap-44 inline py-1"
            >
              <Referencia t={f.texto} />
            </a>
          ) : (
            <Referencia t={f.texto} />
          )}
        </span>
      ))}
      {nota && <> · {nota}</>}
    </p>
  );
}
