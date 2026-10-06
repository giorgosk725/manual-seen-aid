/* «Qué ha cambiado»: una entrada por revisión del capítulo y por versión de la app.
   Fechas absolutas. Lo que no se sabe se deja como pendiente, visible. */

export interface Cambio {
  fecha: string; // ISO
  ambito: "capitulo" | "app";
  titulo: string;
  detalle: string[];
}

export const VERSION_APP = "0.11.0";

export const CAMBIOS: Cambio[] = [
  {
    fecha: "2026-10-06",
    ambito: "app",
    titulo: `Manual SEEN · AID ${VERSION_APP} — el capítulo de la maquetación del 5-10-2026`,
    detalle: [
      "El texto pasa a la última maquetación de la editorial (5-10-2026), que ya incorpora las 11 correcciones del 30-9. La app aplica además las 3 correcciones finales que el autor ha anotado en ella.",
      "Resolución de incidencias (p. 15): en personas tratadas con iSGLT2 ya no se habla de rebajar el umbral a 200 mg/dl; «debe mantenerse una alta sospecha de cetoacidosis y medirse la cetonemia ante síntomas o situaciones de riesgo, con independencia del nivel de glucemia». Esa cifra sale de «Cifras del apartado» y de las tarjetas.",
      "La Figura 3, la infografía y las Figuras 1 y 2 se ven ahora con la imagen de la nueva maquetación, más nítida y ya con las correcciones de la editorial (la columna amarilla de la cetonemia, la nota del asterisco de las dosis, «DM1», «En modalidades híbridas»…).",
      "Páginas al día con la nueva maquetación: el final del párrafo de la hipoglucemia pasa a la p. 9, «Capacitación del equipo asistencial» a la p. 10 y la Tabla 3 a la p. 11.",
      "La información para pacientes que maqueta la editorial el 5-10-2026 es ya, palabra por palabra, la versión V5 del autor que mostraba la app.",
    ],
  },
  {
    fecha: "2026-10-05",
    ambito: "capitulo",
    titulo: "Capítulo: nueva maquetación con 3 correcciones finales",
    detalle: [
      "La editorial (ec-europe) entrega una nueva maquetación de 25 páginas con las 11 correcciones del 30-9 incorporadas en el texto, las tablas, la Figura 3 y la infografía.",
      "El autor anota 3 correcciones finales, que esta app ya aplica: la indicación de Control-IQ+ en la Tabla 1 («peso 9–200 kg, DTD 5–200 UI/día»), la frase sobre los iSGLT2 de la p. 15 y el DOI de la referencia 6.",
      "La información para pacientes maquetada coincide con la versión V5 del autor.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.10.0 — más fácil de usar y un buscador que entiende mejor",
    detalle: [
      "El buscador entiende mejor la forma de preguntar: palabras de la calle («bajada», «me pita», «el parche», «bultos en la barriga», «hidratos de mentira»), faltas de ortografía («bomitos», «asucar»), verbos y edades («mi hijo de 1 año», «mi madre tiene 80 años»), siglas por su nombre («dosis total diaria» = DTD) y cifras de cetonemia escritas delante («0,3 de cetonas»).",
      "Si dos frases del mismo párrafo responden, salen juntas. Si nada responde de lleno, o la respuesta es dudosa, se rotula «Lo más cercano en el capítulo» en lugar de presentarla como la respuesta; y si no hay nada, propone las situaciones de «¿Qué necesitas?».",
      "«Leer en su sitio» lleva a la frase exacta y la resalta unos segundos. La nota del asterisco es la de cada tabla (en la Tabla 1, la de los parámetros del modo automático), las celdas de varias líneas se leen separadas y se resaltan palabras enteras.",
      "Medido con un banco de 120 preguntas nuevas escritas por otro agente sin ver el motor: la primera respuesta acierta el 42 % (antes, el 35 %), la buena está entre las tres en el 53 % (antes, el 38 %) y las respuestas equivocadas presentadas como directas bajan un tercio (docs/PREGUNTAS_2026-10-04.md). Con preguntas largas o muy coloquiales todavía falla a menudo.",
      "Paleta (Ctrl K): Intro abre la respuesta y ↓ ↑ recorren los resultados. «Saltar al contenido» con el primer Tab.",
      "Recorridos: «Siguiente» lleva al principio del paso nuevo; al elegir sistema, su casilla queda a la vista sobre la barra inferior; «Iniciar un sistema» tiene un índice «En esta fase» (p. ej., la reducción de la DTD al pasar de MDI) y nombres de sistema cortos.",
      "La hoja de comprobación del inicio lleva QR, dirección, fecha del capítulo y versión, y se comparte como las hojas para el paciente; sale en una cara A4 con letra de 11 pt.",
      "La portada dice qué es la app (material educativo; no es producto sanitario ni publicación oficial de la SEEN), enseña «Seguir leyendo» sin desplazar y lleva a las tarjetas y al test; «Aprender» sube en la barra lateral. Al enfocar la caja en el móvil, sube para que el teclado no tape la respuesta.",
      "Las 55 cifras de los apartados llevan a su frase. Tarjetas: «en la ronda de hoy» y «por estrenar». Test: resultado final y «Volver a empezar». «Qué ha cambiado» se acorta: pendientes en lenguaje llano y las notas para el autor y las versiones antiguas, plegadas. Páginas siempre como «pp. 3–4».",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.9.0 — iniciar un sistema, paso a paso",
    detalle: [
      "Nuevo recorrido «Iniciar un sistema» (Consultar): el apartado 8 en sus cuatro fases —selección y preparación, inicio del sistema, seguimiento estrecho de los primeros 3 meses y seguimiento mantenido—, con lo que piden los apartados 6, 7 y 9 en cada una. Todo es texto del capítulo con su página.",
      "Eliges el sistema y ves solo lo suyo: su línea de inicialización de la Tabla 2 (p. ej., «SmartGuard requiere 48 h previas en modo manual»), su objetivo en automático y los parámetros que mueven el automático (Tabla 1).",
      "Hoja de comprobación del inicio para imprimir en una cara A4: plan de respaldo, plan de seguridad, núcleo de la configuración, la línea del sistema, lo que se programa (Tabla 1) y las citas de los 3 primeros meses. Las casillas son para marcar en papel; no se guarda nada.",
      "Se llega desde el atajo «Iniciar un sistema» de la portada, desde el apartado 8 y desde la ficha de cada sistema. Los apartados 7, 8, 9 y 10 enlazan arriba a su recorrido.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.8.0 — el buscador responde",
    detalle: [
      "Preguntas al capítulo: la búsqueda (Ctrl K, «¿Qué necesitas?» y Buscar) responde primero con el texto LITERAL que contesta, con su página y «Leer en su sitio»: una frase, un punto de una lista, una fila de tabla (la casilla del sistema si lo nombras), un tramo de la Figura 3 o una sigla. Debajo siguen todos los sitios donde sale.",
      "Entiende la forma de preguntar («cetonas 1,2», «glucosa alta dos horas qué hago», «cuánto tiempo puedo estar desconectado», «ejercicio con glucosa 80»), equivalentes de la consulta diaria y una errata. Si el capítulo no lo trata («precio del Omnipod»), no responde: no se inventa nada.",
      "Medido con bancos de preguntas: con preguntas nuevas, la primera respuesta acierta entre la mitad y dos de cada tres veces, y la buena está entre las tres que se enseñan en torno a tres de cada cuatro (docs/PREGUNTAS_2026-10-04.md).",
      "La búsqueda literal ya no exige palabras vacías («de», «con», «en») ni las resalta.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.7.0 — tarjetas de repaso",
    detalle: [
      "Tarjetas de repaso (Aprender): las cifras de cada apartado y las siglas del glosario como tarjetas, tal como las da el capítulo y con su página. Pregunta, «Mostrar la respuesta» y «¿Te acordabas?»: lo que recuerdas vuelve al cabo de 1, 3, 7, 16 y 35 días; lo que no, en la misma ronda. Por mazo (cifras, siglas) o por apartado; desde las «Cifras del apartado», «Repasar estas cifras como tarjetas».",
      "Las dosis con asterisco de la Figura 3 llevan su nota también en la tarjeta. Las cifras con la misma etiqueta (TIR, TBR y TAR de «necesidad clínica no cubierta», p. 5) van juntas en una.",
      "El avance se guarda solo en este dispositivo y se puede borrar («Empezar de cero»). Teclado: espacio para ver la respuesta; 1 y 2 para responder.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.6.4 — enlaces directos más rápidos y objetivos táctiles",
    detalle: [
      "La primera vez que se abre un enlace directo (por ejemplo, el QR de una hoja para el paciente), su pantalla se pide a la vez que el resto de la app: en el móvil llega antes (información para el paciente, de 3,0 a 2,3 s en Lighthouse).",
      "La letra de la cabecera se pide desde el principio: no cambia al terminar de cargar.",
      "Enlaces pequeños ampliados a 24 px como mínimo: fuentes de las fichas de sistema, galería «Figuras y diagramas», «Leer en su apartado» (44 px), índice lateral del apartado y enlaces web de la bibliografía.",
      "Glosario: SED con la página en la que el capítulo la desarrolla (p. 4). Cifras del apartado 10: «primeras 24 h» tras la inserción de un nuevo sensor.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.6.3 — precarga sin estorbar al arranque",
    detalle: [
      "Las demás pantallas se precargan cuando la página ya ha terminado de cargar, no mientras se pinta la portada: en el móvil, la portada responde antes (bloqueo del hilo principal de 140 a 70 ms en Lighthouse).",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.6.2 — arranque más rápido en el móvil",
    detalle: [
      "El modo nocturno se pone antes del primer pintado sin pedir un archivo aparte: una petición menos antes de ver la portada en el móvil.",
      "«¿Qué necesitas?» en pantallas de 1024 a 1279 px: el icono va encima del texto y las palabras ya no se cortan.",
      "Las capturas del diálogo de instalación muestran la versión actual.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.6.1 — segunda auditoría aplicada",
    detalle: [
      "Búsqueda que lleva a la respuesta: «Ir a» las situaciones, las fichas de sistema, los objetivos por población y las herramientas (si se nombra un sistema, llega ya elegido); sinónimos de consulta (RM/resonancia, TC/escáner, quirófano/cirugía, beta/β-OHB, cetonas, embarazo); las siglas cortas solo como palabra entera; los tres buscadores con los mismos avisos; «Cargando el índice…» y «Reintentar» si falla.",
      "Contenido: las dosis con asterisco llevan su nota; 0,15 UI/kg con su «puede considerarse»; el plan de seguridad incluye reevaluar a los 15 min y no anunciar los hidratos como comida; el diagrama de ejercicio y el de seguimiento con sus frases literales completas; rótulos de cirugía y ejercicio con su calificador; la ampliación avisa de lo que difiere en el resumen de parámetros.",
      "Fichas de sistema: «Qué mueve el modo automático» (Tabla 1, p. 4) arriba. En «¿Qué necesitas?», «Parámetros por sistema» y «Exploraciones y cirugía».",
      "Hojas para el paciente: «Mostrar el QR» en grande y selector Información · Resumen · Plan arriba de cada hoja.",
      "Móvil: Atrás cierra la búsqueda o el índice en vez de cambiar la página de debajo; barra «Situación · Cambiar» en Situación y sistema; objetivos táctiles de 44 px en migas, logotipo y enlaces; «Volver arriba» se esconde solo.",
      "Robustez: una pantalla o el índice de búsqueda que no llegan se recuperan recargando una vez; una dirección escrita sin «#» (por ejemplo, la de una hoja impresa) lleva a su pantalla; modo nocturno único y sin destello al abrir; las pantallas se precargan en un momento libre.",
      "Accesibilidad: orden de encabezados correcto en tablas, figuras, diagramas y versión extendida (ahora se comprueba en las pruebas), puntos de referencia con nombre, contraste y nombres de botones corregidos.",
    ],
  },
  {
    fecha: "2026-10-04",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.6.0 — instalación, enlaces y consulta más directa",
    detalle: [
      "App instalable completa: identificador estable, capturas para el diálogo de instalación, accesos directos (índice, cetonemia, situación y sistema, para el paciente) e iconos nuevos con la identidad del Manual SEEN, también en versión adaptable («maskable»).",
      "Las obras que el texto nombra (Guía SED, ensayo AIDE T1D, posicionamientos EASD/ISPAD y hospitalario de 2026) enlazan a su referencia de la bibliografía.",
      "Cetonemia paso a paso: «¿Ya tienes el β-OHB? Ir a su rama» arriba del recorrido; al llegar con el tramo elegido (por ejemplo, buscando «β-OHB 1,2»), la pantalla va directa a «Actuar».",
      "Situación y sistema: rótulos «Tabla 4/6» y, debajo de la lista, las demás situaciones del capítulo (gestación, adolescencia, población mayor, enfermedad intercurrente, glucocorticoides, diálisis, hospital) con su página.",
      "Glosario: SED, TIRp, TBRp y TARp. Cifras: dosis de la Figura 3 (0,1 y 0,15 UI/kg), 50 %/50 % en el hospital y 24 h de glucemia capilar tras un sensor nuevo; todo comprobado frente al PDF.",
      "La búsqueda encuentra también la información para pacientes, el resumen y las preguntas del test (en el grupo «fuera del capítulo»); la ampliación del autor se distingue en violeta y la versión extendida, en ámbar.",
      "Móvil: «Seguir leyendo» visible en la cabecera de la portada, selectores y listas de 44 px y la «β» con la misma letra que el texto. Autoevaluación: el foco se queda en la respuesta.",
      "El código QR y «Cómo citar» llevan siempre la dirección pública (también si la hoja se imprime desde una copia de prueba), con la zona de silencio que pide la norma. Página «no encontrada» para direcciones que no existen. Publicar exige pasar también las pruebas de navegador.",
    ],
  },
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.5.3 — arranque más rápido",
    detalle: [
      "Al abrir la app solo se carga lo necesario para la portada, el índice y los apartados; el resto de pantallas (consultar, recorridos, sistemas, figuras y diagramas, para el paciente, búsqueda, bibliografía y test) llega la primera vez que se visita. El índice de búsqueda se pide al buscar por primera vez. El código que se descarga al arrancar baja de 196 a 150 kB comprimidos y la puntuación de rendimiento en el móvil sube de 89-92 a 94-95. Sin conexión todo sigue funcionando: la app instalada guarda todas las pantallas.",
    ],
  },
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.5.2 — figuras más ligeras",
    detalle: [
      "Las cuatro figuras originales (Figuras 1, 2 y 3 e infografía) pasan a WebP sin pérdida: los mismos píxeles, comprobados uno a uno, en la mitad de peso (de 1,16 MB a 0,61 MB). La app instalada descarga y guarda para usar sin conexión medio megabyte menos.",
    ],
  },
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.5.1 — hojas para el paciente con letra grande",
    detalle: [
      "Cada hoja para el paciente (información, resumen y plan de seguridad de cada sistema) se puede imprimir en dos formatos: una cara A4 con letra pequeña, como hasta ahora, o letra grande de 12 pt en una columna, a doble cara (el resumen ocupa dos caras; la información y los planes, tres). La elección se hace en la propia hoja y se recuerda en este navegador; también vale al imprimir con Ctrl+P.",
      "La portada ya no muestra el recuadro «Pendiente» (decisión del autor): lo pendiente sigue, completo, en «Qué ha cambiado» y en «Sobre esta versión».",
    ],
  },
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.5.0 — con la identidad del Manual SEEN",
    detalle: [
      "Diseño nuevo con los colores y la tipografía del Manual SEEN: títulos en mayúsculas finas, rótulo «Área Diabetes», franja de cuatro colores, índice del capítulo en mosaico de fichas de color (como las áreas de manual.seen.es) y paginación en círculos al pie de cada apartado. Fuentes Open Sans y Oswald, alojadas en la app (licencia OFL).",
      "Auditoría extensa (contenido, técnica y uso con tres perfiles): enlaces a la Figura 3 que caían un párrafo después, páginas de relación de la versión extendida corregidas en el PDF, frases de los diagramas devueltas a su literal (regla del 1800, ejercicio anaeróbico, tramo amarillo de cetonemia completo) y calificadores recuperados en «Situación y sistema».",
      "En la ficha de cada sistema, los datos de la ampliación del autor que no coinciden con el capítulo llevan la marca «Difiere del capítulo; manda el capítulo», con la frase literal y su página; y las notas de las tablas (el asterisco de la Tabla 1) se ven junto a la columna del sistema.",
      "Las remisiones del texto («v. Tabla 5», «Figura 3», «v. «Interrupción del sistema…»») son enlaces al sitio exacto del capítulo.",
      "Búsqueda: los resultados de fuera del capítulo ya no quedan ocultos tras los 60 primeros; si ninguna entrada tiene todas las palabras, busca con alguna y lo dice; una cifra de β-OHB («β-OHB 1,2») lleva a su tramo de la Figura 3.",
      "Correcciones: salir de un apartado abierto en un subapartado ya no hace saltar la pantalla siguiente ni falsea «Seguir leyendo»; unas preferencias guardadas con forma inesperada ya no dejan la app en blanco (y el aviso de fallo permite restablecerlas); imprimir con Ctrl+P ya no saca botones ni la versión extendida, y las hojas para el paciente salen igual que con su botón; «Escuchar» conserva el foco y no se queda colgado; el plan de seguridad abre en Safari antiguo.",
      "«Qué ha cambiado» pone primero los cambios del capítulo y lo pendiente; «Volver arriba» solo aparece al subir; el modo nocturno sigue al del sistema si no se ha elegido; botones y fichas táctiles más grandes.",
    ],
  },
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.4.0 — lo que el PDF no puede dar",
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

/* Lo que todavía no se sabe. Se muestra tal cual; no se rellena con suposiciones.
   PENDIENTES: lo que importa al lector, en pocas palabras. NOTAS_AUTOR: decisiones de detalle
   que quedan en manos del autor (se enseñan plegadas). */
export const PENDIENTES: string[] = [
  "El permiso de la SEEN y de la editorial (ec-europe) para esta versión web, y dónde se alojará.",
  "Que el autor valide las diez preguntas del test (hoy, «pendiente de validación del autor»).",
  "Que la editorial pase al capítulo las 3 correcciones finales del autor del 5-10-2026 (esta app ya las aplica).",
  "El ISBN y la fecha de publicación del capítulo en el Manual SEEN, para «Cómo citar».",
];

export const NOTAS_AUTOR: string[] = [
  "Dos detalles de la Figura 3 que pedía la corrección 5/11 y que la maquetación del 5-10-2026 no deja del todo: en la columna roja sigue «pauta especifica» sin tilde (la transcripción de la app la lleva) y las líneas que bajan a las columnas amarilla y naranja no tienen punta de flecha, a diferencia de las de los extremos.",
  "Las diferencias entre el capítulo y la ampliación del autor (asistente-aid): ratio I/HC, tipo de algoritmo de Control-IQ, autocorrección de MiniMed 780G, fecha de verificación y otras (auditoría del 2-10-2026). Llevan la marca «Difiere del capítulo» en la ficha la ratio I/HC, el tipo de algoritmo de Control-IQ y la autocorrección de la 780G; el resto, hasta que el autor decida, solo figura aquí.",
  "Tres matices de la versión extendida frente al capítulo, para que el autor decida si los deja, los precisa o los retira: E04 («ajustar si hay hiperglucemia persistente», cuando el capítulo pide descartar antes fallo de infusión), E28 («el objetivo se eleva antes de reducir el bolo, no en paralelo») y E07 (control desde el móvil, cuando en España es con el controlador).",
  "Dos frases de la información para pacientes V5 que el autor puede querer completar con el capítulo: los 5-10 g de hidratos en la hipoglucemia (sin la condición de 54-70 mg/dl y flecha estable) y la desconexión de la bomba con tubo (sin «suspender o pausar la administración»).",
  "La edad de Liberty: la Tabla 1 dice «> 13 años» y el apartado 3, «menores de 13 años».",
  "Los archivos fuente de la infografía y de las figuras (hoy, imágenes de la maquetación; el texto de cada caja ya está transcrito).",
];
