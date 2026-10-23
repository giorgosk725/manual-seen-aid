/* La procedencia de las piezas del capítulo («Tabla 2, p. 10», «Apartado 8, p. 12»), con su
   sitio exacto en el capítulo, para la línea de fuente al pie de cada bloque de las
   herramientas. */
import { APARTADOS, TABLAS, idDeBloque, rutaDeTabla } from "./contenido";
import { frasesDe, listaDe, type Pieza } from "./inicio";
import { paginasDe } from "./paginas";
import { href } from "./rutas";

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
      const f = frasesDe(
        p.apartado,
        p.bloque,
        p.k,
        p.t === "frase" ? p.trozo : undefined,
        p.t === "frase" ? p.quitar : undefined,
      );
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
/* 0.90.1 (decisión del responsable, 21-10-2026): el contexto de un párrafo sin entradilla cuyo
   dato se aplica fuera de él (el alcohol, en el párrafo de adolescencia y transición). */
const CONTEXTO: Record<string, string> = {
  "10-situaciones/b14": "Adolescencia y transición",
};
const contextoDe = (ruta: string) => {
  const [, , slug, ancla] = ruta.split("/");
  return CONTEXTO[`${slug}/${ancla}`];
};
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
  // 0.92.0 (revisión de tarjetas, ★6): la entradilla distingue dos sitios que se escriben igual
  // solo si todos la tienen; si a alguno le falta, «Apartado 8, p. 12 (Configuración inicial) ·
  // Apartado 8, p. 12» repetía la referencia: queda una sola (FuentePie no repite un texto), que
  // lleva al primero. Sin paréntesis dentro del paréntesis: la entradilla, sin su remisión final
  // («Configuración inicial (v. Tabla 2)» → «Configuración inicial»).
  const entradilla = (ruta: string) => entradillaDe(ruta)?.replace(/\s*\([^()]*\)$/, "");
  const todasCon = (texto: string) =>
    unicas.filter((x) => x.texto === texto).every((x) => !!entradilla(x.ruta));
  return unicas.map((f) => {
    const e =
      ((veces.get(f.texto) ?? 0) > 1 && todasCon(f.texto) ? entradilla(f.ruta) : undefined) ??
      contextoDe(f.ruta);
    // 0.83.1 (séptima ronda, senior y R3): entre paréntesis (con «·» parecía otra fuente).
    return e ? { ...f, texto: `${f.texto} (${e})` } : f;
  });
}

/* Identificador del sistema en la vista de tablas (orden de la Tabla 1). */
const SLUG_TABLA = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
/* 0.96.0: aquí (antes en componentes/FichaOperativa) para usarla también en Sistemas.
   Adónde lleva el rótulo de una fila: la tabla con la columna del sistema (casilla literal) o el
   párrafo del capítulo, resaltado (0.77.1, auditoría R3: del dato al literal en un toque). */
export function literalDe(p: Pieza | undefined, c: number): string | undefined {
  if (!p) return undefined;
  if (p.t === "casilla")
    return href("consultar", "tablas", `${p.tabla}:${SLUG_TABLA[c]}:${p.fila}`);
  // 1.0.4 (20.ª ronda, R3): la inicialización, a su fila de la Tabla 2, resaltada.
  if (p.t === "inicializacion") return href("consultar", "tablas", "T2::1");
  return fuentesDePieza(p)[0]?.ruta;
}

/* 0.96.1 (revisión de Codex, V95-11): cada sitio del capítulo de un dato que sale de varios
   (el rótulo lleva al primero). En el orden del dato y sin repetir destino; la casilla, con la
   columna del sistema y, si hay dos de la misma tabla, con el rótulo de su fila. Vacía si el dato
   tiene un solo destino. */
export function literalesDe(fs: Pieza[], c: number): { texto: string; ruta: string }[] {
  const deTabla = (p: Pieza) => (p.t === "casilla" || p.t === "fila" ? p.tabla : null);
  const veces = new Map<string, number>();
  for (const p of fs) {
    const t = deTabla(p);
    if (t) veces.set(t, (veces.get(t) ?? 0) + 1);
  }
  // Las del texto, con la entradilla que las distingue si dos se escriben igual.
  const textoDe = new Map(
    fuentesDePiezas(fs.filter((p) => !deTabla(p))).map((f) => [f.ruta, f.texto]),
  );
  const vistas = new Set<string>();
  const out: { texto: string; ruta: string }[] = [];
  for (const p of fs) {
    const ruta = literalDe(p, c);
    if (!ruta || vistas.has(ruta)) continue;
    vistas.add(ruta);
    const t = deTabla(p);
    if (t && (p.t === "casilla" || p.t === "fila")) {
      const fila = TABLAS[t].filas[p.fila].etiqueta.split(/[:\n.]/)[0].trim();
      out.push({
        texto: `Tabla\u00a0${TABLAS[t].numero}${(veces.get(t) ?? 0) > 1 ? ` (${fila})` : ""}`,
        ruta,
      });
    } else out.push({ texto: textoDe.get(ruta) ?? fuentesDePieza(p)[0]?.texto ?? "", ruta });
  }
  return out.length > 1 ? out : [];
}
