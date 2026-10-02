/* La imagen de la Figura 3 (maquetación 30-9-2026), como `Figura` mínima para reutilizar
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
    src: "figuras/figura-3.png",
    alt: "Figura 3 del capítulo: algoritmo en cuatro columnas según la cetonemia (verde, amarilla, naranja y roja), con los avisos de sospecha y comprobación arriba y la regla de oro abajo.",
    nota: "Imagen de la maquetación del 30-9-2026 (provisional, a falta del archivo fuente). Las correcciones de la anotación 5/11 están aplicadas en el recorrido, no en la imagen.",
  },
};
