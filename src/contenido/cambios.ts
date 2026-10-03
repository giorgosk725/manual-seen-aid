/* «Qué ha cambiado»: una entrada por revisión del capítulo y por versión de la app.
   Fechas absolutas. Lo que no se sabe se deja como pendiente, visible. */

export interface Cambio {
  fecha: string; // ISO
  ambito: "capitulo" | "app";
  titulo: string;
  detalle: string[];
}

export const VERSION_APP = "0.4.0";

export const CAMBIOS: Cambio[] = [
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: `Manual SEEN · AID ${VERSION_APP} — lo que el PDF no puede dar`,
    detalle: [
      "Versión extendida del autor: 33 fragmentos de los borradores de mayo de 2026 que no cupieron en el capítulo, aprobados uno a uno por el autor. Van plegados, en ámbar y con su borrador y fecha, al final del bloque al que pertenecen y en la ficha de cada sistema; nunca se mezclan con el texto publicado.",
      "Cinco diagramas nuevos con frases literales y su página: gestación sistema a sistema, cuándo no continuar el sistema en el hospital, la Tabla 6 como mapa de exploraciones, la Figura 2 dibujada y la interrupción del sistema según su duración.",
      "Para el paciente: información para pacientes (versión corregida V5 del autor) y resumen del capítulo, cada uno en una cara A4 imprimible y con código QR; y un plan de seguridad por sistema, hecho solo con texto del capítulo, para rellenar a mano (la app no guarda nada).",
      "Autoevaluación: las diez preguntas del autor, con su explicación y las frases del capítulo que la respaldan, rotuladas «pendiente de validación del autor».",
      "Navegación: «¿Qué necesitas?» en la portada, con buscador y ocho atajos a dos toques; «Seguir leyendo»; favoritos y apartados leídos (solo en este navegador, nada clínico); «Volver arriba»; la barra lateral, agrupada en Sistemas, Situaciones y recorridos, Figuras y tablas, y Glosario.",
      "Cada apartado: «Cómo citar» y «Escuchar» (voz del propio dispositivo). La búsqueda encuentra también la versión extendida y la ampliación del autor, en un grupo aparte y rotulado. Enlaces a los casos prácticos de la edición educativa de asistente-aid desde las situaciones que los tienen.",
    ],
  },
  {
    fecha: "2026-10-02",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.3.0 — figuras y diagramas",
    detalle: [
      "Siete diagramas construidos con las cifras y frases del capítulo, cada una con su página: objetivos de MCG (adultos, gestación, hospital y fragilidad), escala de cetonemia, glucemia y ejercicio, calendario de seguimiento, los cuatro algoritmos, hipoglucemia en asa cerrada y transición desde MDI. Cada uno aparece en su apartado y a pantalla completa.",
      "Nueva sección «Figuras y diagramas»: todo lo visual en un sitio, con filtros (diagramas, figuras, tablas y sistemas).",
      "Visor a pantalla completa con zoom (botones, rueda, pellizco y doble toque) para las figuras originales y las fotos de los sistemas.",
      "Cada apartado abre con una tira de sus tablas, figuras y diagramas; la portada muestra «De un vistazo» y la búsqueda encuentra también los diagramas.",
    ],
  },
  {
    fecha: "2026-10-02",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.2.1 — auditoría extensa",
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
  "La validación por el autor de las diez preguntas del test (hoy rotuladas «pendiente de validación del autor»).",
  "La versión del capítulo con las 11 correcciones aplicadas por la editorial (la maquetación recibida el 3-10-2026 aún no las lleva; esta app ya las aplica).",
  "Que la editorial publique la información para pacientes en la versión corregida V5 del autor, que es la que muestra esta app.",
  "El ISBN y la fecha de publicación del capítulo en el Manual SEEN (para «Cómo citar»; los confirma la coordinación de la SEEN).",
  "Las diferencias entre el capítulo y la ampliación del autor (asistente-aid): ratio I/HC, tipo de algoritmo de Control-IQ, autocorrección de MiniMed 780G, fecha de verificación y otras (auditoría del 2-10-2026); manda el capítulo hasta que el autor decida.",
  "La edad de Liberty: la Tabla 1 dice «> 13 años» y el apartado 3, «menores de 13 años».",
  "Los archivos fuente de la infografía y de las figuras (hoy, imágenes de la maquetación; el texto de cada caja ya está transcrito).",
];
