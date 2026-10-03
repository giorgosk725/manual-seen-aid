/* Destino de las remisiones internas del capítulo (ver componentes/Remisiones.tsx). */
import { APARTADOS, idDeBloque } from "./contenido";
import { href } from "./rutas";

export const PATRON_REMISION = /(v\. «[^»]+»|[Tt]abla [1-6]\b|[Ff]igura [1-3]\b)/;

/* Destino de una remisión dentro del capítulo, o null si no se encuentra. */
export function destinoDeRemision(remision: string): string | null {
  const m = remision.match(/^[Tt]abla ([1-6])$/) ?? remision.match(/^[Ff]igura ([1-3])$/);
  if (m) {
    const id = `${remision[0].toUpperCase() === "T" ? "T" : "F"}${m[1]}`;
    for (const a of APARTADOS) {
      const i = a.bloques.findIndex((b) => (b.t === "tabla" || b.t === "figura") && b.id === id);
      if (i >= 0) return href("capitulo", a.slug, idDeBloque(a.bloques[i], i));
    }
    return null;
  }
  const t = remision.match(/^v\. «([^»]+)»$/);
  if (t) {
    const buscado = t[1].toLowerCase();
    for (const a of APARTADOS)
      for (const b of a.bloques)
        if (b.t === "h3" && b.texto.toLowerCase() === buscado)
          return href("capitulo", a.slug, b.id);
  }
  return null;
}
