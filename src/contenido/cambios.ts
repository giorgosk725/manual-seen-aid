/* «Qué ha cambiado»: una entrada por revisión del capítulo y por versión de la app.
   Fechas absolutas. Lo que no se sabe se deja como pendiente, visible. */

export interface Cambio {
  fecha: string; // ISO
  ambito: "capitulo" | "app";
  titulo: string;
  detalle: string[];
}

export const VERSION_APP = "0.2.1";

export const CAMBIOS: Cambio[] = [
  {
    fecha: "2026-10-02",
    ambito: "app",
    titulo: `Manual SEEN · AID ${VERSION_APP} — auditoría extensa`,
    detalle: [
      "Fidelidad comprobada frente al PDF: 144 de 144 párrafos y listas, 216 de 216 celdas de tabla, las 10 referencias y las 49 cifras por apartado. Corregidas las páginas de dos listas que saltan de página y las de EASD e ISPAD en el glosario.",
      "Las cabeceras de cada sistema (ficha, portada e índice) salen ahora de la Tabla 1 del capítulo; la ampliación del autor solo se ve dentro de su bloque rotulado.",
      "Impresión: el título del apartado y la cabecera de la ficha ya salen en papel, el modo nocturno se imprime en negro y las tablas salen como tabla.",
      "Navegación: elegir un tramo, paso o sistema ya no sube al principio ni llena el historial; Atrás conserva la posición y la búsqueda; los enlaces a una referencia llegan a ella.",
      "Accesibilidad y móvil: contraste corregido en cuatro elementos, sin desbordes de 360 a 1440 px y botones de paso de 44 px.",
    ],
  },
  {
    fecha: "2026-10-02",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.2.0 — el capítulo, más manejable",
    detalle: [
      "Sistemas: una ficha por sistema con su foto oficial; primero lo que dice el capítulo (sus columnas de las Tablas 1, 3 y 4 y los párrafos que lo nombran, con página) y, aparte y rotulada, la «Ampliación del autor» (ficha técnica, parámetros que mueven el automático, sets de infusión, insulinas compatibles) con sus fuentes.",
      "Recorridos de consulta construidos solo con el texto del capítulo: «Situación y sistema» (Tablas 4 y 6), «Revisar la descarga» (Tabla 5 en ocho pasos) e «Interrupción del sistema» (línea de tiempo).",
      "«Cifras del apartado»: los umbrales y tiempos que da cada apartado, de un vistazo y con su página; índice lateral fijo en pantallas grandes.",
      "Figura 1 como diagrama animado; fotos de los sistemas en las cabeceras de las tablas comparativas.",
    ],
  },
  {
    fecha: "2026-10-02",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.1.0 — primera versión",
    detalle: [
      "Capítulo completo transcrito y navegable por apartados, con la página de origen en cada bloque.",
      "Tabla 1 (sistemas), Tabla 3 (parámetros) y Tabla 4 (situaciones) filtrables por sistema; Tabla 6 (exploraciones) filtrable por procedimiento.",
      "Figura 3 (cetonemia) como recorrido paso a paso: se elige el tramo de β-OHB y se ve solo esa rama.",
      "Infografía como mapa de entrada, glosario de siglas, búsqueda literal sobre el texto y bibliografía con DOI enlazado.",
      "Modo nocturno, impresión de un apartado o del capítulo, uso sin conexión e instalación como app.",
      "Test de autoevaluación con la estructura lista y dos preguntas de ejemplo marcadas como provisionales.",
    ],
  },
  {
    fecha: "2026-09-30",
    ambito: "capitulo",
    titulo: "Capítulo: maquetación final con 11 correcciones editoriales",
    detalle: [
      "Versión maquetada por ec-europe (25 páginas) con 11 observaciones editoriales anotadas, ya decididas; esta app las aplica en el texto.",
      "Además, la Tabla 1 lleva corregida la errata de Control-IQ+ que el autor comunicará a la editorial: «peso 9–200 kg, DTD 5–200 UI/día».",
    ],
  },
];

/* Lo que todavía no se sabe. Se muestra tal cual; no se rellena con suposiciones. */
export const PENDIENTES: string[] = [
  "Permiso escrito de la SEEN y de ec-europe para la versión web, y dónde se aloja (enlace o alojamiento junto al capítulo).",
  "Las preguntas definitivas del test de autoevaluación (las escribirá el autor; las dos actuales son ejemplos provisionales).",
  "Los archivos fuente de la infografía y de las figuras (hoy solo imágenes de la maquetación; el texto de cada caja ya está transcrito).",
  "La fecha de publicación del capítulo en el Manual SEEN.",
];
