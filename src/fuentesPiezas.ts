/* La procedencia de las piezas del capítulo («Tabla 2, p. 10», «Apartado 8, p. 12»), con su
   sitio exacto en el capítulo, para la línea de fuente al pie de cada bloque de las
   herramientas. */
import { APARTADOS, TABLAS, rutaDeTabla } from "./contenido";
import { frasesDe, listaDe, type Pieza } from "./inicio";

/* La procedencia de una pieza, en una línea («Tabla 2, p. 10»), con su sitio en el capítulo. */
export const numeroApartado = (slug: string) => APARTADOS.find((a) => a.slug === slug)?.n ?? "";
export function fuentesDePieza(p: Pieza): { texto: string; ruta: string }[] {
  switch (p.t) {
    case "fila":
    case "casilla": {
      const t = TABLAS[p.tabla];
      const r = rutaDeTabla(p.tabla);
      return r ? [{ texto: `Tabla ${t.numero}, p. ${t.paginas[0]}`, ruta: r }] : [];
    }
    case "inicializacion": {
      const r = rutaDeTabla("T2");
      return r ? [{ texto: `Tabla 2, p. ${TABLAS.T2.paginas[0]}`, ruta: r }] : [];
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
