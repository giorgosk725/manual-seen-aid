/* La imagen de la Figura 3 (capítulo publicado el 8-10-2026), como `Figura` mínima para reutilizar
   el plegable «Ver la figura original». La transcripción vive en src/contenido/figura3.ts. */
import type { Figura } from "../contenido";
import { FIGURA3 } from "../contenido";

export const INFO_F3: Figura = {
  id: "F3",
  numero: 3,
  titulo: FIGURA3.titulo,
  pagina: FIGURA3.pagina,
  cajas: [],
  imagen: {
    src: "figuras/figura-3.webp",
    alt: "Figura 3 del capítulo: algoritmo en cuatro columnas según la cetonemia (verde, amarilla, naranja y roja), con los avisos de sospecha y comprobación arriba y la regla de oro abajo.",
    nota: "Imagen del capítulo publicado en el Manual SEEN (8-10-2026).",
  },
};
