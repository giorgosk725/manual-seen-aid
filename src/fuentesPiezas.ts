/* La procedencia de las piezas del capítulo («Tabla 2, p. 10», «Apartado 8, p. 12»), con su
   sitio exacto en el capítulo, para la línea de fuente al pie de cada bloque de las
   herramientas. */
import { APARTADOS, TABLAS, rutaDeTabla } from "./contenido";
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
      const r = rutaDeTabla(p.tabla);
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
      return [{ texto: `Apartado ${numeroApartado(p.apartado)}, p. ${f.pagina}`, ruta: f.ruta }];
    }
    case "lista": {
      const l = listaDe(p.apartado, p.bloque);
      return [{ texto: `Apartado ${numeroApartado(p.apartado)}, p. ${l.pagina}`, ruta: l.ruta }];
    }
    default:
      return [];
  }
}
/* Las fuentes de unas piezas, sin repetir. */
export function fuentesDePiezas(piezas: Pieza[]): { texto: string; ruta: string }[] {
  const vistas = new Set<string>();
  return piezas
    .flatMap(fuentesDePieza)
    .filter((f) => !vistas.has(f.texto) && !!vistas.add(f.texto));
}
