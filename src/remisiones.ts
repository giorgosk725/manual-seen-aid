/* Destino de las remisiones internas del capítulo (ver componentes/Remisiones.tsx): tablas,
   figuras y subapartados, y las obras que el texto nombra (enlazan a su referencia de la
   bibliografía). */
import { APARTADOS, idDeBloque } from "./contenido";
import { href } from "./rutas";

/* Obras que el capítulo nombra en el texto, con su número en la bibliografía (pp. 24-25). Solo
   menciones inequívocas; la frase es literal del capítulo (lo comprueba auditoria.test.tsx). */
export const OBRAS_NOMBRADAS: { frase: string; ref: number }[] = [
  { frase: "Guía SED de Sistemas de Asa Cerrada 2026", ref: 2 },
  { frase: "Guía de Uso de Sistemas de Asa Cerrada de la Sociedad Española de Diabetes", ref: 2 },
  { frase: "AIDE T1D", ref: 5 },
  { frase: "documento de posicionamiento conjunto", ref: 7 },
  { frase: "posicionamiento internacional de 2026", ref: 8 },
];

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const PATRON_REMISION = new RegExp(
  `(v\\. «[^»]+»|[Tt]abla [1-6]\\b|[Ff]igura [1-3]\\b|${OBRAS_NOMBRADAS.map((o) => escapar(o.frase)).join("|")})`,
);

/* Destino de una remisión dentro del capítulo, o null si no se encuentra. */
export function destinoDeRemision(remision: string): string | null {
  const obra = OBRAS_NOMBRADAS.find((o) => o.frase === remision);
  if (obra) return href("bibliografia", `ref-${obra.ref}`);
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
