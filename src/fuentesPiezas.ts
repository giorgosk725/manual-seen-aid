/* La procedencia de las piezas del capítulo («Tabla 2, p. 10», «Apartado 8, p. 12»), con su
   sitio exacto en el capítulo, para la línea de fuente al pie de cada bloque de las
   herramientas. */
import { APARTADOS, TABLAS, idDeBloque, rutaDeTabla } from "./contenido";
import { frasesDe, listaDe, type Pieza } from "./inicio";
import { paginasDe } from "./paginas";

/* La procedencia de una pieza, en una línea («Tabla 2, p. 10»), con su sitio en el capítulo. */
export const numeroApartado = (slug: string) => APARTADOS.find((a) => a.slug === slug)?.n ?? "";
export function fuentesDePieza(p: Pieza): { texto: string; ruta: string }[] {
  switch (p.t) {
    case "fila":
    case "casilla": {
      // Sin página por fila, el intervalo entero de la tabla (A11): una fila de la Tabla 1 puede
      // estar en la p. 4 aunque la tabla empiece en la 3.
      const t = TABLAS[p.tabla];
      // 0.84.1 (octava ronda, senior): la Tabla 4 no cabe en la columna de lectura del capítulo
      // (se cortaba Omnipod 5): su fuente lleva a la tabla en Tablas, que cabe entera.
      const r = p.tabla === "T4" ? "#/consultar/tablas/T4" : rutaDeTabla(p.tabla);
      return r
        ? [{ texto: `Tabla ${t.numero}, ${paginasDe(t.paginas[0], t.paginas[1])}`, ruta: r }]
        : [];
    }
    case "inicializacion": {
      const r = rutaDeTabla("T2");
      return r
        ? [{ texto: `Tabla 2, ${paginasDe(TABLAS.T2.paginas[0], TABLAS.T2.paginas[1])}`, ruta: r }]
        : [];
    }
    case "frase":
    case "hito": {
      const f = frasesDe(p.apartado, p.bloque, p.k, p.t === "frase" ? p.trozo : undefined);
      return [
        {
          texto: `Apartado ${numeroApartado(p.apartado)},\u00a0${paginasDe(f.pagina, f.pagina2)}`,
          ruta: f.ruta,
        },
      ];
    }
    case "lista": {
      const l = listaDe(p.apartado, p.bloque);
      return [{ texto: `Apartado ${numeroApartado(p.apartado)}, p. ${l.pagina}`, ruta: l.ruta }];
    }
    default:
      return [];
  }
}
/* El título en negrita con que empieza un párrafo («Hipoglucemia nocturna»), por su ruta. */
function entradillaDe(ruta: string): string | undefined {
  const [, , slug, ancla] = ruta.split("/");
  const a = APARTADOS.find((x) => x.slug === slug);
  const b = a?.bloques.find((x, i) => idDeBloque(x, i) === ancla);
  return b?.t === "p" ? b.lead?.replace(/[.:]$/, "") : undefined;
}
/* Las fuentes de unas piezas, sin repetir. 0.82.1 (sexta ronda, senior): sin repetir el sitio
   (antes, el texto: dos párrafos de la misma página daban una sola fuente, que llevaba al otro);
   si dos sitios se escriben igual, cada uno con la entradilla de su párrafo. */
export function fuentesDePiezas(piezas: Pieza[]): { texto: string; ruta: string }[] {
  const vistas = new Set<string>();
  const unicas = piezas
    .flatMap(fuentesDePieza)
    .filter((f) => !vistas.has(f.ruta) && !!vistas.add(f.ruta));
  const veces = new Map<string, number>();
  for (const f of unicas) veces.set(f.texto, (veces.get(f.texto) ?? 0) + 1);
  return unicas.map((f) => {
    const e = (veces.get(f.texto) ?? 0) > 1 ? entradillaDe(f.ruta) : undefined;
    // 0.83.1 (séptima ronda, senior y R3): entre paréntesis (con «·» parecía otra fuente).
    return e ? { ...f, texto: `${f.texto} (${e})` } : f;
  });
}
