/* «Qué ha cambiado»: una entrada por revisión del capítulo y por versión de la app.
   Fechas absolutas. Lo que no se sabe se deja como pendiente, visible. */

export interface Cambio {
  fecha: string; // ISO
  ambito: "capitulo" | "app";
  titulo: string;
  detalle: string[];
}

import { VERSION_APP } from "../version";
export { VERSION_APP };

export const CAMBIOS: Cambio[] = [
  {
    fecha: "2026-10-16",
    ambito: "app",
    titulo: `Complemento interactivo ${VERSION_APP} — sistema en la dirección y ficha impresa sin repeticiones`,
    detalle: [
      "Situaciones con selector de sistema (gestación y las demás): el sistema de la dirección manda y la casilla elegida pasa a la dirección; un enlace compartido, Atrás y Adelante enseñan el sistema escrito.",
      "Ficha impresa: bajo cada pregunta frecuente, cada pasaje una sola vez (antes, algunos párrafos salían repetidos).",
      "Gestación sistema a sistema con los objetivos de inicio a todo lo ancho; columnas de la ficha más igualadas; Situaciones en el mismo orden en el móvil, el lateral y las dos columnas; foco de teclado visible en las tarjetas de la portada; cabecera de la Tabla 1 impresa sin partir los nombres.",
    ],
  },
  {
    fecha: "2026-10-16",
    ambito: "app",
    titulo: "Complemento interactivo 0.76.1 — rejillas sin huecos y ficha impresa completa",
    detalle: [
      "Tarjetas de una misma fila a la misma altura (Interrupción, Figura 3); en Parámetros y Modos, una sola rejilla en el orden de la tabla con lo añadido para cada sistema; la lista de Situaciones, en dos columnas equilibradas.",
      "«Control-IQ / Control-IQ+» solo se parte por la barra; Elección del sistema con las filas alineadas como una tabla; accesos de la portada con más aire; figuras apaisadas en el móvil.",
      "La ficha impresa lleva también las respuestas de sus preguntas frecuentes.",
    ],
  },
  {
    fecha: "2026-10-16",
    ambito: "app",
    titulo: "Complemento interactivo 0.76.0 — sistema visual único",
    detalle: [
      "Rediseño visual en cinco vueltas con auditorías independientes (diseño 8,0 → 8,8): una sola tarjeta (blanca con borde fino; la de cada sistema con su pleca de color), una escala de títulos y rótulos (nada por debajo de 12 px), el burdeos solo para lo que se pulsa y el color de cada sistema solo para identificarlo, sin iconos ni flechas por fila.",
      "Un solo selector de sistema y un solo estilo de pestañas en toda la app; un único foco de teclado en burdeos, también de noche; la barra lateral cabe en portátiles de 768 px de alto, con Bibliografía y Sobre al pie junto al modo nocturno; sin cabecera vacía en el ordenador.",
      "Fichas de sistema más compactas en el móvil (el contenido empieza antes), tarjetas repartidas en dos columnas sin huecos y en el orden de la tabla, la ficha entera en papel y la Tabla 1 en A4.",
      "Modo nocturno por variables: tintes de cada sistema, fotos atenuadas y contraste comprobado. Búsqueda: «sale del modo automático» lleva a su pregunta frecuente.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.75.1 — fuentes en una línea y comparación filtrada",
    detalle: [
      "La línea de fuente, en una sola línea también en el móvil (antes cada fuente caía a su propio renglón); en Situaciones, una sola fuente por tarjeta y los párrafos que la desarrollan aparte («Leer en el capítulo»).",
      "Comparación: «Parámetros configurables en modo automático», abierto; el Resumen enseña solo los sistemas marcados.",
      "Interrupción en el móvil: el enlace a la Figura 3, debajo del texto. Las direcciones de Sistemas aceptan también el identificador de Situaciones e Iniciar.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.75.0 — todo a la vista, Control-IQ+ y Liberty",
    detalle: [
      "Nada útil plegado (petición del responsable): los apartados de cada situación, las comprobaciones previas del ejercicio, las tareas de cada fase de la iniciación, el paso «Sospechar y comprobar» de la Figura 3 en el móvil, las notas (edad de Liberty; corrección de Omnipod 5) y «Fuentes y revisión», abiertos; en la búsqueda, hasta tres pasajes más, abiertos.",
      "Control-IQ+: Tandem se nombra «Control-IQ / Control-IQ+» (el capítulo: según el dispositivo y la versión de software; Mobi, con Control-IQ+). En las tarjetas del resumen, Control-IQ+ (indicación, gestación, basal temporal) y Liberty en CamAPS FX (la frase que la define, indicación y gestación). Elección del sistema con la indicación y la gestación de cada uno.",
      "Ejercicio: el efecto según el tipo de ejercicio (apartado 10), la desconexión programada por ejercicio (apartado 7: bolo previo y reducción), las frases de la actividad no planificada y del esfuerzo anaeróbico en su sitio, y enlaces al diagrama «Glucemia y ejercicio», a la interrupción y a la Tabla 4. Con Control-IQ, sus rangos de objetivo y modos.",
      "Interpretación de la descarga: en el paso de las funciones temporales, las herramientas por sistema (Tabla 4).",
      "Nombres de sistema iguales en selectores, tarjetas y categorías de preguntas (myLoop CamAPS FX; Tandem Control-IQ / Control-IQ+); las cabeceras de las tablas siguen literales.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.74.1 — sin plegar lo que se consulta",
    detalle: [
      "Cómo funciona: los rasgos distintivos de cada sistema (apartado 4), directamente, como una tarjeta más, sin plegar y sin puntos suspensivos (petición del responsable).",
      "Lo de cada sistema en las situaciones, sin puntos suspensivos en los recortes; la fuente al pie lleva a la frase entera.",
      "Interpretación de la descarga: los patrones relacionados, abiertos también en el móvil.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.74.0 — lo de cada sistema, a la vista",
    detalle: [
      "Hecha a partir de dos auditorías profundas (contenido por sistema; uso, ruido y registro).",
      "Lo que el capítulo dice de cada sistema, donde se busca y con su texto literal: gestación (con CamAPS FX, el objetivo por trimestres y tras el parto, qué parámetros cuentan en automático, Boost y Ease-off; con MiniMed 780G, el objetivo mínimo y la estrategia; con Control-IQ+, la intensificación y el modo sueño continuado), enfermedad intercurrente, glucocorticoides e ingreso hospitalario, con un selector de sistema arriba y lo común debajo.",
      "Situaciones de la Tabla 4 con un sistema elegido: debajo de su casilla, lo que añaden los apartados 9 y 10 (hipoglucemia nocturna, hiperglucemia tardía tras comidas grasas, Ease-off, actividad acuática con Omnipod 5, Boost, basal temporal de Control-IQ+).",
      "Ficha de cada sistema: las pestañas enseñan solo su sección; «Cómo funciona» con la casilla literal entera de la Tabla 1; Parámetros y Modos con lo que el texto añade a las tablas (peso de la basal programada, en CamAPS FX el factor de sensibilidad y la insulina activa, Boost y Ease-off, alcohol, desconexión); las menciones del capítulo, como enlaces.",
      "El texto literal del capítulo se reconoce por una pleca fina a la izquierda; el borde discontinuo queda para las notas que no son del capítulo.",
      "Menos ruido: situaciones sin iconos por fila ni puntos de color, menú sin las tres entradas repetidas, portada sin contadores, Fases sin «Paso n de N», rótulos de la Tabla 4 sin mayúsculas, sin instrucciones de uso.",
      "Registro de manual en los rótulos: «Comparación de sistemas», «Fases de la iniciación», «Algoritmo por tramos», «Plan de seguridad (hoja para el paciente)», «Hoja en blanco», «Cálculo», «Desplegar todo», «Uso habitual», entre otros.",
      "Fuentes corregidas: los objetivos de MCG de la gestación y del hospital citaban el apartado 9 (son del 10) y los de adultos el 4 (son del 5); un párrafo de dos páginas cita las dos.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.73.0 — portada por lo que más se consulta",
    detalle: [
      "Portada ordenada por el uso real (indicación del responsable): primero los cuatro sistemas, cada uno con su ficha y accesos a sus parámetros, su iniciación y sus dudas; «Comparar los cuatro», «Comparar los parámetros» y «Elección del sistema». Después, iniciación y seguimiento (cálculo de parámetros iniciales, iniciación paso a paso, calendario de revisiones, descarga), la lectura del capítulo y el material para el paciente (plan de seguridad, hoja de cetonas, hoja de pruebas y cirugía, PDF). Al final, las situaciones clínicas, con hiperglucemia y cetonemia, hipoglucemia e interrupción en su color.",
      "Ficha de cada sistema con sus preguntas frecuentes revisadas («Preguntas»), para las dudas del sistema.",
      "Hiperglucemia y cetonemia: la hoja de cetonas para entregar al paciente, arriba y a un toque.",
      "«Comparar los cuatro» abre las tarjetas lado a lado; las tablas, en sus pestañas. Ficha de sistema más compacta en el móvil. Al volver atrás desde el capítulo, la ficha vuelve a su sitio (antes podía ir al final).",
      "Tras una auditoría de uso: la ficha de cada sistema añade «Modos y funciones» (su columna de la Tabla 4) y empieza por las tarjetas (la frase del apartado 4, plegada debajo); sus preguntas son solo las que añaden algo a la ficha; pestañas cortas en el móvil; sin la nota del asterisco en Parámetros; «Ver casilla completa».",
      "Portada: cada sistema con «Parámetros · Iniciar · Preguntas» («Iniciar» abre el cálculo con el sistema elegido). Menú en el orden de uso, con el material para el paciente a la vista.",
      "Elección del sistema: si ninguno reúne lo marcado, se dice, y cada tarjeta que no coincide lo indica; «Comparar los cuatro» lleva siempre al mismo sitio.",
      "Iniciación: el material del sistema, plegado (repetía la ficha). Descarga: la bandera roja, al pie de cada paso en vez de una banda encima; las páginas de los patrones, en la línea de fuente.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.72.2 — elegir por características y rótulos de manual",
    detalle: [
      "Elección del sistema: por las características del dispositivo (formato, sensores compatibles, localización del algoritmo, bolos automáticos de corrección), con las casillas literales de la Tabla 1; sin datos de la persona ni puntuación, los cuatro en el orden de la tabla y lo que no coincide, en gris (petición del responsable).",
      "Cómo funciona: los rótulos de la Tabla 1 y en su orden («Sensores compatibles», «Localización del algoritmo», «Lógica del algoritmo y aprendizaje», «Estrategia de automatización», «Bolos automáticos de corrección», «Objetivo glucémico en modo automático») en lugar de «Mide · Decide · Administra · Hacia el objetivo».",
      "Rótulos de manual en toda la app: «Parámetros iniciales», «Programación inicial», «Pauta previa», «Véase también», «Comprobaciones previas», «Resolución de incidencias», «Conducta distinta según el sistema», «Efecto directo sobre el algoritmo», «Criterios para no continuar»; instrucciones en forma impersonal.",
      "Portada, menú y pestañas con nombres de manual: «Sistemas y ajuste de parámetros», «Situaciones clínicas», «Iniciación y seguimiento», «Material para el paciente», «Interpretación de la descarga», «Resumen» y «Características».",
      "Sin repeticiones: en Gestación, las tarjetas por sistema arriba y, debajo, solo los párrafos que añaden algo (sin los de CamAPS FX y MiniMed 780G, ya en las tarjetas, ni las filas «—»); en Ingreso, los objetivos de glucosa una sola vez; en la Figura 3, el título solo arriba; la interrupción, con un solo hogar (la galería lleva a la pantalla de consulta).",
      "Sin entradillas ni textos de uso: el índice de tablas con el título de cada tabla (sin la pregunta encima), la galería de diagramas sin resumen, la hoja de comprobación sin instrucciones, las tablas sin «Seleccionar uno…», Situaciones sin leyenda, el bloque de párrafos sin rótulo encima y la ficha de sistema sin subtítulo repetido.",
      "Fuente al pie: los diagramas y las tarjetas de gestación, sin páginas sueltas en cada línea; una sola línea «Fuente:» al pie. Elección del sistema sin la página a media pantalla.",
      "Rótulos de manual en los momentos («Necesidades de insulina», «Plan de seguridad», «Efecto sobre la glucemia», «Mantenimiento del sistema», «Evidencia», «Elección del sistema», «Bolos omitidos», «Revisión de la descarga») y en las tareas de Iniciación («Activación del modo automático», «Vigilancia en las primeras descargas», «Ajustes en las primeras descargas», «Contenido de cada visita», «Reconsideración del tratamiento»).",
      "Portada como panel de consulta: cabecera compacta sin subtítulo; arriba, hiperglucemia y cetonemia con la escala de β-OHB de la Figura 3 (cada tramo abre su rama), hipoglucemia e interrupción; los cuatro sistemas con accesos directos a sus parámetros y a su iniciación, «Comparar los cuatro» y «Elección del sistema»; las situaciones más consultadas a un toque; iniciación, material para el paciente y lectura debajo.",
      "Retirados de esta edición (sus datos se conservan): los diagramas que repetían una pantalla de consulta (algoritmos de los cuatro sistemas, escala de cetonemia y hospital) y «Cómo interpretar este hallazgo». La nota de la edad de Liberty, solo junto a la casilla de la Tabla 1 (no en la lectura del capítulo). La barra de la bandera roja de la descarga no se repite en el paso 8.",
      "Preguntas frecuentes con título de manual (f05, f10, f59, f79, f80; el título anterior queda como variante de búsqueda), revisadas de nuevo el 15-10-2026 por delegación del responsable.",
      "Búsqueda: ejemplos de consulta clínica; los diagramas retirados ya no salen en los resultados; en «Otros recursos», solo el destino de cada acceso. Una búsqueda sin respuesta ya no deja su tema a la siguiente («ejercicio control-iq», «precio del omnipod», «780G» daba «ejercicio 780g»), y «Buscar solo …» lo olvida de verdad.",
    ],
  },
  {
    fecha: "2026-10-15",
    ambito: "app",
    titulo: "Complemento interactivo 0.72.1 — volver a las tarjetas y Figura 3 más directa",
    detalle: [
      "Sistemas: «De un vistazo» (las tarjetas), «Lo esencial» y «Parámetros» como tres pestañas: desde la comparación se vuelve a las tarjetas con un toque.",
      "Figura 3: sin el recuadro de urgencia repetido (encima del selector, junto a las ramas que no son la roja y en la búsqueda con una cifra de cetonas): la tarjeta «≥3,0 o signos de gravedad» lleva a la rama roja, a un toque (decisión del responsable). El plan de seguridad del paciente lo conserva.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.72.0 — más operativa y más visual",
    detalle: [
      "Hecha a partir de cuatro auditorías de uso (residente de guardia en el móvil, adjunto en consulta en el ordenador, enfermera educadora y residente de primer año en la tablet, y diseño) y de una segunda ronda sobre lo cambiado.",
      "Urgencias: en la portada, hiperglucemia y cetonemia, hipoglucemia e interrupción en tres tarjetas con su color. Figura 3 con la cifra de cada tramo en grande y la escala de colores. Interrupción del sistema en tarjetas por caso, con el tiempo arriba y la basal de respaldo dentro del fallo definitivo. Hipoglucemia con las dos cantidades primero.",
      "En las pantallas de consulta, las cifras con unidad (1-2 h, ≥ 70 %, 0,1 UI/kg, 112,5–160 mg/dl) van en negrita; el texto es el mismo.",
      "Iniciar un sistema: «Calcular · Fases · Hoja» en un solo control; en el ordenador, los datos a la izquierda y los parámetros de partida a la derecha, siempre a la vista; la hoja de comprobación lleva esos valores (o líneas en blanco para escribirlos).",
      "Revisar la descarga: los ocho pasos a la vista (botones numerados en el móvil y la lista con sus títulos en el ordenador), con un icono por columna y los patrones abiertos en el ordenador.",
      "Sistemas: la ficha sin cajas dentro de cajas; en la Tabla 3, una insignia dice qué parámetro tiene efecto directo en el modo automático; la casilla entera de la Tabla 1 y la nota de corrección de Omnipod 5, a un toque; «Sí»/«No» de los bolos automáticos en su propia línea. «Cómo elegir» compara los sistemas que se valoran.",
      "Situaciones con un color por tema y cuatro puntos de color en las que cambian según el sistema; el filtro entiende «ducha», «pod», «catéter» o «alarma» y, si no encuentra nada, lleva a la búsqueda. Gestación y hospital enseñan sus objetivos de MCG arriba; el ingreso abre lo operativo.",
      "Búsqueda: «cetonas», «hipoglucemia» o «desconectar» abren su herramienta; «gestante» lleva a la gestación; «modo actividad» y «el pod falla, no tengo repuesto» llevan a su sitio. En la pantalla de búsqueda, una sola caja.",
      "Para el paciente: la hoja de cetonas también suelta; al imprimir el plan, la hoja de cetonas empieza en su propia cara.",
      "Sistemas: en la lista, las casillas se van marcando y «Comparar (2)» compara los marcados; de la ficha a la comparación, la pantalla empieza arriba y, en el ordenador, la cabecera de la tabla se queda pegada al bajar.",
      "Calculadora: hasta la pantalla ancha, una barra fija con las cifras de partida mientras no están a la vista; las cajas de los datos, alineadas.",
      "Situaciones: en «Incidencias del día a día», también la hipoglucemia nocturna, los tipos de catéter y cánula, los problemas cutáneos y la fatiga por alarmas (apartado 9). Gestación enseña arriba lo de cada sistema.",
      "Búsqueda con una cifra de cetonas: los cuatro tramos de la Figura 3 para elegir, sin marcar ninguno, y la urgencia una sola vez.",
      "Búsqueda: el nombre de un sistema o de su fabricante abre su ficha; «tabla 4 omnipod», «qué tocar en CamAPS», «camaps tc», «quitar la bomba» o «catéter» llevan a su sitio; lo que se está escribiendo ya no se toma como seguimiento de la consulta anterior.",
      "Ingreso hospitalario: abre «Mantener la MCG, la bomba o el AID» y «Cuándo no continuar», enlazado desde Interrupción y desde la rama roja de la Figura 3. Hipoglucemia lleva al plan de seguridad y a la hipoglucemia nocturna.",
      "Accesibilidad: lo enfocado no queda bajo la cabecera ni la barra de abajo; el anillo de foco contrasta también de noche; la calculadora y la búsqueda anuncian un solo resumen al dejar de escribir; el foco va al título de lo elegido.",
      "Siglas del glosario pulsables también en las guías de situaciones (la primera vez que salen en cada momento) y en todas las frases de Iniciar.",
      "Decisiones del responsable (15-10-2026): en la Figura 3, sin el recuadro de urgencia encima del selector (lo repetía la tarjeta «≥3,0 o signos de gravedad») y, en las ramas que no son la roja, después de sus pasos; en el ejercicio, «Antes de actuar» sigue antes de la conducta, plegado con su título; las preguntas frecuentes responden también a «el sensor falla» y a «¿le quito la bomba?».",
      "Tablet: la barra lateral sale desde 1024 px (por debajo, la barra inferior) y la portada va a dos columnas. Ordenador: tablas sin doble barra de desplazamiento y más ancho en monitores grandes. Preguntas frecuentes con un icono por tema y la foto en las de cada sistema; autoevaluación con el avance fijo arriba; Tabla 4 de un sistema con los rótulos legibles.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.71.0 — sistemas y repeticiones",
    detalle: [
      "Sistemas: en el ordenador, la barra de sistemas ya no se pliega al bajar; en el móvil, la ficha y la lista empiezan con la barra en una línea («Cambiar o comparar»). Las tarjetas de la lista dicen el formato (bomba con catéter o pod), y las pestañas de la lista, que comparan los cuatro.",
      "Sin el título de la Tabla 1 repetido encima de sus casillas, ni la miga de pan sobre las tablas.",
      "Búsqueda: un solo enlace por tarjeta, con la fuente y la página en el propio enlace.",
      "Hipoglucemia sin el párrafo de entrada; Situaciones a todo lo ancho mientras no se elige ninguna; el índice del capítulo ya no se repite en el menú lateral; Inicio sin el segundo enlace al apartado 8.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.70.0 — simplificación a fondo",
    detalle: [
      "Para el paciente: una pantalla con tres entradas (el PDF publicado, el plan de seguridad de cada sistema y la hoja de pruebas y cirugía); sin la información en pantalla ni los extractos. El plan, en una cara con lo esencial y la hoja de cetonas como segunda cara.",
      "Sin frases de entrada bajo los títulos, sin rótulos encima de los bloques, sin avisos explicativos y sin la fecha del capítulo en cada fuente (va en «Sobre»). La barra de arriba ya no repite el título.",
      "Navegación: la misma lista de consulta en la portada, el menú lateral y el móvil; en el móvil, la barra de abajo es Inicio · Sistemas · Situaciones · Buscar · Más.",
      "Sistemas: la ficha de cada sistema en una sola página (cómo funciona, indicación y material, parámetros); la comparación, con la Tabla 1 y la Tabla 3.",
      "Interrupción del sistema: los cinco casos de una vez. Figura 3: en el móvil, los tramos de β-OHB en la primera pantalla. Iniciar: «Calcular» y «Fases», y la hoja para imprimir.",
      "Lectura: sin «Cifras y objetivos», los diagramas como un enlace junto a su párrafo, la nota de las dosis de la Figura 3 una sola vez; «Figuras y diagramas» en una sola pantalla, sin los tres diagramas que repetían una tabla o una figura.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.68.1 — Omnipod 5: «Adapta la basal por pod»",
    detalle: [
      "Tabla 1, Omnipod 5: «Adapta la basal por pod» en vez de «Posee autoaprendizaje por pod» (corrección posterior a la publicación). Junto a la casilla, una nota dice qué pone el capítulo publicado.",
      "Portada sin «Seguir leyendo».",
      "Sin «¿Algo que comentar de esta pantalla?» al pie de las pantallas.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.67.0 — portada nueva y situaciones a la vista",
    detalle: [
      "Portada: las cuatro preguntas de consulta en tarjetas con icono y una línea de qué contienen; en la de sistemas, los cuatro con su foto a un toque de su ficha; «Leer y comprender» debajo, con la misma forma y lo que contiene cada acceso.",
      "Situaciones: al elegir una situación (también una de las últimas de la lista), la pantalla sube al principio de su texto. Lo mismo al elegir la duración en «Interrupción del sistema».",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.66.1 — calculadora: textos y sets de infusión",
    detalle: [
      "Calculadora de inicio: opciones y ayudas en tono de herramienta clínica («Con ratio y factor propios ya ajustados», «¿Es adecuada la programación…?», «No es adecuada o no hay programación previa», «Total diario (0 si no usa insulina rápida)»…), y «DTD» con mayúsculas en lo que falta por rellenar.",
      "Material de cada sistema: los sets de infusión, plegados bajo el formato, con material, ángulo, cánula, tubo, inserción y cambio. Es información complementaria de las fichas técnicas, no texto del capítulo.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.66.0 — comentar una pantalla",
    detalle: [
      "Al pie de cada pantalla, «¿Algo que comentar de esta pantalla?»: abre un correo con la pantalla, su dirección y la versión ya escritas, o copia esos datos. No se envía ni se guarda nada.",
      "El nombre corto de CamAPS es «CamAPS FX» en toda la app; los apartados 7 y 9, «Educación y plan de seguridad» y «Descarga y resolución de problemas».",
      "Autoevaluación, pregunta 1: opciones de longitud parecida.",
      "Bibliografía: las direcciones largas se parten en el móvil.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.65.3 — hojas para el paciente",
    detalle: [
      "Hoja «Pruebas y cirugía»: «Si hay que quitarse la bomba o el pod» y «TC (tomografía computarizada, escáner)», como en el resto de la app.",
      "Plan de seguridad: lo de registrar los hidratos como «tratamiento de hipoglucemia» va solo en el de CamAPS FX; en los otros tres, que no deben anunciarse como comida.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.65.2 — títulos de tres preguntas frecuentes",
    detalle: [
      "«MiniMed 780G: ¿cómo decide y cómo se adapta?» y «CamAPS FX: ¿dónde está el algoritmo y cómo se adapta?», en vez de «qué aprende».",
      "«Tras una resonancia con el sensor puesto, ¿son fiables las lecturas?». Los pasajes de las tres no cambian; aprobadas de nuevo el 14-10-2026.",
    ],
  },
  {
    fecha: "2026-10-14",
    ambito: "app",
    titulo: "Complemento interactivo 0.65.1 — «Cómo funciona» de un vistazo",
    detalle: [
      "«Cómo funciona» de cada sistema: arriba, el recorrido de la decisión (mide, decide, administra, hacia qué objetivo) con lo esencial del sistema; debajo, cómo decide y se adapta, los bolos automáticos de corrección y lo que puede ajustar el profesional, con los parámetros en sus dos grupos.",
      "Lo que sigue haciendo la persona, lo que distingue al sistema y lo que devuelve, en tarjetas; las frases generales del capítulo, iguales para los cuatro, plegadas al final.",
      "Omnipod 5: junto a la casilla de la Tabla 1 que dice «autoaprendizaje por pod», una nota complementaria rotulada: lo que hace es actualizar la basal adaptativa con la insulina administrada en cada cambio de pod (Brown et al., Diabetes Care 2021). Va en la ficha, la comparación, la Tabla 1, «Los cuatro algoritmos», la calculadora y la búsqueda; el texto de la tabla no cambia.",
      "Búsqueda: «se despega el sensor» ya no lleva a la pregunta del pod de Omnipod 5.",
      "El aviso de versión actualizada se cierra solo a los pocos segundos.",
      "Revisión previa al envío: las fuentes de los diagramas, agrupadas por apartado; los dos grupos de parámetros con el mismo nombre también en la pestaña Parámetros; la calculadora separa lo que cuenta en automático o para iniciarlo; las hojas dicen «Revisada el …» sin versión interna; sin «Tabla N» ni páginas dentro de las herramientas; textos de la búsqueda y de la calculadora más claros; el registro de «Fuentes y revisión» incluye lo nuevo, pendiente de revisión.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.65.0 — búsqueda",
    detalle: [
      "La búsqueda reconoce más formas de preguntar: cada pasaje lleva unas consultas escritas para el índice (cómo lo preguntaría un clínico o un paciente), que solo sirven para encontrarlo; lo que se enseña sigue siendo el texto literal del capítulo.",
      "Un segundo ordenador (BM25) reordena «lo más cercano» cuando no hay una respuesta segura.",
      "Las consultas del índice ordenan, pero no convierten un pasaje en «la respuesta»: eso lo sigue decidiendo el texto del capítulo.",
      "En un banco nuevo de 150 preguntas, congelado antes del cambio: la primera respuesta acierta en el 61 % (antes 49 %) y alguna de las tres en el 77 % (antes 62 %), con la misma precisión de las respuestas directas (75 %).",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.64.0 — «Sobre», portada y textos",
    detalle: [
      "«Sobre este complemento»: qué se puede hacer, con un enlace a cada tarea (en la consulta, para leer y comprender, para el paciente), y cómo está hecho en cuatro frases; el responsable, con su afiliación, en «Fuentes y revisión».",
      "Sin el aviso bajo los campos de búsqueda: la privacidad de la búsqueda se explica en «Sobre».",
      "«Cómo se adapta» y «Cómo decide y se adapta» en vez de «aprendizaje» en los rótulos de la app (el texto de la Tabla 1 no cambia).",
      "Portada: los cuatro bloques como la pregunta que responden y la hipoglucemia en asa cerrada entre las situaciones. Diagramas: resúmenes más directos y páginas seguidas como intervalo.",
      "Textos de la interfaz revisados: «del sistema actual» en la calculadora, rótulos más claros en Sistemas, Situaciones, Interrupción e Iniciar, y los dos grupos de parámetros con el mismo nombre en toda la app. Fuera un aviso que no se cumplía en esta edición («Esta consulta se anota»).",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.63.0 — revisión de Sistemas, Situaciones e Iniciar",
    detalle: [
      "Calculadora: sin datos completos y válidos no hay cifras; un vacío o un error no se leen como cero; fuera de la indicación de la Tabla 1 no hay propuesta, y dentro de una sola variante queda pendiente confirmarla.",
      "Desde bomba u otro sistema: se pide la DTD y el peso cuando el sistema arranca con ellos, aunque se traslade la programación. En MDI, ratio y factor propios o las reglas del 450 y del 1700.",
      "Un solo trabajo para la calculadora, los pasos y la hoja, con «Nuevo inicio»; lo cambiado a mano se marca; en el móvil, «Ir al paso». La ficha de cada sistema lleva a «Preparar e iniciar».",
      "Situaciones: en el ejercicio, las comprobaciones antes de la conducta; filtro con siglas y alias; guías por momentos para enfermedad intercurrente, glucocorticoides, mayores, diálisis y adolescencia; incidencias del día a día; interrupción y plan desde exploraciones y ejercicio.",
      "Sistemas: la condición junto al Sí/No de los bolos, «Hacia qué objetivo» en «Cómo funciona», el papel de la basal programada y la nota de Liberty también en la guía.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.62.0 — qué programar en cada sistema",
    detalle: [
      "Calculadora de inicio: qué programar ordenado por importancia: lo que cuenta en el modo automático (o lo que necesita para arrancar), los modos y funciones del sistema (en Control-IQ, el modo sueño y el de ejercicio; Boost y Ease-off en CamAPS FX; Actividad en Omnipod 5; objetivo temporal en MiniMed 780G), lo que interviene sobre todo en los bolos y el modo manual, y qué esperar del algoritmo.",
      "Cada parámetro, con la celda entera de la Tabla 3 (p. ej., en MiniMed 780G, que una insulina activa más corta intensifica las autocorrecciones).",
      "Material de cada sistema: formato, sensores, plataforma de descarga y recambios que hay que tener siempre.",
      "Iniciar un sistema: contenidos mínimos de la educación, a quién llamar, educación simplificada, material, pauta de respaldo, efecto residual de la basal previa, gestación y qué vigilar en las primeras descargas, con el texto del capítulo.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.61.0 — decisiones de la revisión",
    detalle: [
      "Calculadora de inicio: con buen control previo y glargina U–300 o degludec, la reducción parte del 20 %; bajo el deslizador se recuerda que es un punto de partida.",
      "Hoja de cetonas aprobada con su orden nuevo; en el tramo 0,6–0,9, los signos de alarma llevan a urgencias de inmediato, aparte de la subida de tramo; «hoja» en vez de «tarjeta».",
      "Planes de seguridad y diagramas: aprobada la composición revisada.",
      "Interrupción del sistema: en cada duración, la frase que responde va resaltada dentro del párrafo entero.",
      "Búsqueda: si el detalle que se pregunta está en otra frase del mismo párrafo, sale junto a la principal.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.60.0 — qué cuenta en automático",
    detalle: [
      "Tarjetas de los sistemas: los parámetros en dos grupos, como dice la nota de la Tabla 1: los de efecto directo en el modo automático y los que intervienen sobre todo en los bolos o en el modo manual.",
      "«Cómo funciona» comparado: lo esencial de cada celda arriba y en negrita (tipo de algoritmo, aprendizaje, cada cuánto actúa y con qué predicción, si corrige solo) y la celda entera debajo; y una fila nueva con los parámetros que cuentan en automático.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.59.0 — situaciones, tarjetas y búsqueda",
    detalle: [
      "Cada situación, con su icono y su nombre arriba una sola vez; lo común a los cuatro sistemas destacado, y la conducta de cada sistema en su tarjeta con foto.",
      "Los momentos de cada situación, como una línea de tiempo numerada; al final, «Para seguir» con la hoja para el paciente, el apartado y la tabla.",
      "Tablas del capítulo con la pregunta que responde cada una delante; «Para comprender» y las hojas para el paciente, con iconos.",
      "Búsqueda: más formas de preguntar que el capítulo dice de otra manera (darse la vuelta, a quién priorizar, dónde va el algoritmo, cada cuánto, ingreso en planta, niños…).",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.58.0 — calculadora de inicio",
    detalle: [
      "«Iniciar un sistema» empieza por una calculadora: de qué tratamiento viene (MDI o bomba), qué sistema y las dosis; salen la DTD de inicio, la tasa basal, la ratio I/HC y el factor de sensibilidad con las reglas de la Tabla 2, y qué programar en ese sistema.",
      "Avisa si la DTD o el peso quedan fuera de la indicación de la Tabla 1 y, con glargina U–300 o degludec, del solapamiento. Nada de lo escrito se guarda ni se envía.",
      "Las fases y la hoja de comprobación siguen a un toque, arriba.",
      "Situaciones por temas con icono, y la marca «Cambia según el sistema» donde la conducta depende de él.",
      "Las tarjetas de los cuatro sistemas, con lo esencial de la Tabla 1: dónde está el algoritmo, cómo actúa, objetivo, sensores y bolos automáticos de corrección.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.57.0 — los cuatro algoritmos, de un vistazo",
    detalle: [
      "«Los cuatro algoritmos»: una tarjeta por sistema con lo esencial de la Tabla 1 (dónde está el algoritmo, cómo actúa, predicción, objetivo, bolos de corrección, aprendizaje y parámetros), alineado entre los cuatro; las celdas completas, en cada tarjeta.",
      "Sin la barra del horizonte de predicción: la predicción es un dato más de cada tarjeta.",
      "Portada: «Leer y comprender» con el mismo formato que los bloques del mapa; «Información para pacientes», sin más.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.56.0 — diagramas revisados",
    detalle: [
      "Diagramas agrupados por temas, con apartado y páginas; la fuente, al pie de cada uno.",
      "Los doce, cotejados con el capítulo: vuelven las condiciones que se perdían al resumir, con texto literal.",
      "Escala de cetonemia con los signos de gravedad arriba; hipoglucemia y transición sin aspecto de protocolo.",
      "Exploraciones con el estado escrito en cada celda; interrupción, programada o no.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.55.0 — revisión de la edición 0.54",
    detalle: [
      "Búsqueda: una pregunta frecuente solo se antepone si trata la misma cuestión que lo buscado; si no, va como relacionada.",
      "Hoja de cetonas: los signos de alarma, lo primero; planes de seguridad con la urgencia en la primera cara.",
      "El enlace a una rama de la Figura 3 lleva a ella también al abrirlo en una pestaña nueva.",
      "Portada con «Leer y comprender» propio; índice sin accesos repetidos; tableta y escritorio más holgados.",
      "«Sobre este complemento» con enlaces y «Fuentes y revisión»; nota sobre la edad de Liberty donde salen las dos frases.",
      "No se imprime una versión incompleta mientras algo se carga; al actualizar, se confirma la versión.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.54.0 — «Sobre este complemento» nuevo",
    detalle: [
      "«Sobre este complemento»: qué ofrece cada parte, qué es del capítulo y qué es complementario, privacidad y límites; con el enlace al capítulo en el Manual SEEN.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.53.0 — búsqueda más fiable y móvil",
    detalle: [
      "Búsqueda: solo se presenta como respuesta lo que casa de verdad con la pregunta; lo demás, como «lo más cercano», diciendo por qué.",
      "Más palabras de la calle y nombres comerciales reconocidos (Jardiance, bisturí, rugby…).",
      "Móvil: todo lo que se toca mide al menos 44 px; sin lupa repetida en la cabecera.",
      "Ficha de cada sistema con sus tres accesos en una fila; «Hojas y planes para entregar» en la portada.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.52.0 — revisión de la edición",
    detalle: [
      "Liberty: la edad, la de la Tabla 1 («> 13 años»).",
      "Cada pregunta frecuente queda ligada a lo que se aprobó: si cambia, sale hasta revisarla de nuevo.",
      "Un material en revisión no se ofrece para imprimir; la nota de las dosis no se separa de ellas al imprimir.",
      "«Capítulo entero» con la bibliografía; Figura 3 sin la urgencia repetida; enlaces y fuentes más fáciles de tocar en el móvil.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo: "Complemento interactivo 0.51.0 — Consultar en la barra inferior",
    detalle: [
      "Móvil: «Consultar» en la barra inferior, con las tareas de consulta a dos toques.",
      "Portada sin las dos puertas, título en negrita; cabecera del Manual de Endocrinología y Nutrición.",
      "Las 103 preguntas frecuentes revisadas; hoja «Pruebas y cirugía» y plantillas de plan revisadas.",
      "«Sobre este complemento», en un párrafo.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo:
      "Automatización de la insulinoterapia 0.50.0 — autoevaluación completa, materiales con su revisión y navegación",
    detalle: [
      "Autoevaluación: vuelven las diez preguntas, con q02 (TAR 26,7 %) y q03 («pueden considerarse», como el capítulo) corregidas tras su revisión.",
      "«Sobre este complemento» lista cada material con su tipo (publicado, transcripción, hoja adaptada, plantilla, explicación complementaria), su fecha, su versión y la evidencia de su revisión; las hojas lo repiten al pie.",
      "Portada: «Seguir leyendo» lleva al último apartado abierto (solo su dirección, nada de lo consultado) y el PDF publicado para pacientes está a un toque. La lectura se llama igual en todas partes: «Leer y comprender».",
      "Cabecera con identidad propia («Cap. 89 · Complemento interactivo») mientras la SEEN no autorice el uso de su marca.",
      "Acciones principales de 44 px en el móvil y foco visible en modo nocturno. Un enlace a una frase del capítulo ya no se desplaza cuando terminan de cargar las figuras de antes.",
    ],
  },
  {
    fecha: "2026-10-13",
    ambito: "app",
    titulo:
      "Automatización de la insulinoterapia 0.49.1 — portada con el título del capítulo; Figuras y Diagramas aparte",
    detalle: [
      "Portada: el título del capítulo tal cual y, debajo, qué es esta versión: complemento interactivo del capítulo 89 del Manual SEEN, que facilita su lectura, comprensión y consulta. Sin el rótulo «En evaluación editorial».",
      "«Hiperglucemia y cetonemia», sin «· Figura 3», en el menú, el mapa y los títulos.",
      "«Figuras y diagramas» se divide en dos entradas: «Figuras» (las originales del capítulo y la infografía) y «Diagramas». Las tablas y los sistemas ya no se repiten ahí: tienen su propia entrada.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Automatización de la insulinoterapia 0.49.0 — edición editorial",
    detalle: [
      "Portada: «Automatización de la insulinoterapia», complemento interactivo del capítulo 89, en evaluación editorial; dos entradas del mismo nivel, «Leer y comprender» y «Consultar», antes del mapa. Menú en tres grupos: Consultar, Leer y comprender y Recursos.",
      "Cetonemia: una cifra de β-OHB escrita en la búsqueda ya no elige rama de la Figura 3. Delante va el texto de la figura sobre urgencia y signos de gravedad y el enlace a la figura completa; ese texto acompaña también a cada rama no roja. Los fragmentos de seguridad se enseñan enteros.",
      "«Explorar criterios de elección» sustituye al evaluador de criterios: factores del apartado 6 y la Figura 2 y las celdas literales de la Tabla 1, sin datos de la persona ni orden por compatibilidad.",
      "Privacidad: la búsqueda no sale del dispositivo, no va en la dirección y no se guarda; sin búsquedas recientes. Junto al campo: «Busca términos del capítulo; no introduzcas datos de pacientes».",
      "Solo las preguntas frecuentes revisadas (61) y ocho preguntas de autoevaluación; sin la ampliación técnica. Las tablas de varias páginas citan el intervalo entero.",
      "Para el paciente: el PDF publicado, primero y disponible sin conexión; hojas y plantillas rotuladas como material complementario; solo letra grande.",
      "«Sobre este complemento»: fuente, alcance, capa docente, estado de evaluación, qué se transmite y se guarda, uso sin conexión y la identificación de esta versión.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.48.2 — portada más directa",
    detalle: [
      "Portada: sin el título «Consultar» (cada bloque dice ya qué ofrece); «Para el paciente» lleva a lo que se entrega: la información para pacientes con su PDF, el plan de seguridad por sistema y todas las hojas. La barra de arriba ya no repite el título del capítulo.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.48.1 — portada sin botones repetidos",
    detalle: [
      "Portada: fuera los botones «Leer capítulo» y «Para el paciente» de la cabecera (repetían el mapa y el menú). El mapa de Consultar añade abajo, a todo lo ancho, «Leer el capítulo» con el índice, las tablas y las figuras.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.48.0 — preguntas por sistema y trucos de uso",
    detalle: [
      "Preguntas frecuentes: 42 nuevas (103 en total). «Trucos de uso» (hidratos en el ejercicio, cuándo poner el bolo, subida tras comer, glucosa alta al despertar, variabilidad, ejercicio de fuerza, después del ejercicio, desconexiones breves, sensor tras una resonancia, errores en la descarga) y, por sistema, curiosidades y trucos de MiniMed 780G, Tandem Control-IQ, myLoop CamAPS y Omnipod 5, con la casilla de ese sistema delante. También persona mayor, diálisis, seguimiento remoto en adolescentes, cuándo reconsiderar el tratamiento y visitas con buen control. Las respuestas son el texto del capítulo con su página.",
      "Esta edición no lleva casos guiados ni tarjetas de repaso (se guardan para una siguiente). «Sobre esta app» cuenta las herramientas actuales.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.47.0 — iniciar paso a paso, fichas visuales y Situaciones en un solo sitio",
    detalle: [
      "Iniciar un sistema · Inicio: cinco pasos en el orden en que se trabaja con la persona delante (pauta previa y transición, programación inicial de basal, ratio y factor de sensibilidad, objetivos, plan de respaldo y activación del automático). El primer paso pregunta de qué pauta viene y la basal que lleva, y enseña solo lo que le corresponde (sin elegir, todo). En cada fila de la Tabla 2, la recomendación va destacada y las notas debajo. La «Guía paso a paso» aparte deja de existir: es esta fase.",
      "Fuera «Cómo leer esta tabla» de tablas, tareas y buscador; solo queda «Cómo interpretar este hallazgo» donde explica un dato concreto (paso 7 de la descarga).",
      "Fichas de sistema: «Lo esencial» y «Parámetros» en tarjetas con icono (formato, sensores, algoritmo, indicación, gestación, plataforma; objetivo, basal, ratio, factor, insulina activa), sin repetir el nombre del sistema en cada casilla. Las comparaciones de los sistemas, con cada columna en el color de su sistema e icono en cada fila.",
      "Situaciones, en un solo sitio (Consultar › Situaciones): la pestaña de la ficha y «Comparar en las situaciones» desaparecen; desde la ficha, «Situaciones» abre la herramienta con ese sistema elegido. Las direcciones antiguas llevan allí.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.46.1 — el PDF oficial para pacientes y menos frases sobre la propia herramienta",
    detalle: [
      "Para el paciente: el PDF para descargar es la «Información para pacientes» maquetada por el Manual SEEN el 9-10-2026 (3 páginas, 83 KB); su texto coincide palabra por palabra con el de la pantalla.",
      "Fuera las frases que hablaban de la propia herramienta («los rótulos son de la app», «texto literal del capítulo» en cada pie). «Cómo funciona» de cada sistema empieza directamente por lo que trata. La explicación de las tablas se rotula «Explicación complementaria, no es texto del capítulo»; en Buscar, la pestaña se llama «Otros recursos».",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.46.0 — la fuente, al pie",
    detalle: [
      "En las herramientas (Sistemas y sus comparaciones, Situaciones, Criterios de elección, Revisar la descarga, Cetonemia paso a paso, Interrupción, Iniciar un sistema, Para el paciente y las tarjetas del buscador) ya no salen «Tabla N» ni páginas en títulos, filas, tarjetas o cabeceras: cada bloque lleva una sola línea «Fuente: Tabla 1, p. 3 · …» al pie, con el enlace al sitio exacto del capítulo.",
      "La lectura del capítulo, el índice de tablas y las citas de los casos guiados conservan su numeración y sus páginas. Las hojas para imprimir dicen la procedencia una vez, en su pie.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.45.0 — el móvil, más compacto (segunda tanda)",
    detalle: [
      "Selector de sistemas (Sistemas AID, Iniciar un sistema, tablas y situaciones): en el móvil, las cuatro casillas en una sola fila, con la marca y el punto de color arriba y el nombre debajo; «Los cuatro» y la pista, en la fila siguiente.",
      "Cetonemia paso a paso: los cuatro tramos de β-OHB en dos por dos. Revisar la descarga: «Paso n de 8» y el selector de paso en la misma fila.",
      "Apartados: las páginas e «Imprimir / PDF» comparten fila en el móvil. Sistemas comparados: «Imprimir» junto al título. Criterios de elección: edad y peso en una fila. Casos guiados: «Empezar» en la línea de los datos de cada caso.",
      "Entradillas más cortas en Interrupción del sistema, Criterios de elección, Figuras y diagramas, Revisar la descarga, Casos guiados, Autoevaluación, Buscar, Tarjetas de repaso y Hojas breves. En Para el paciente, la descripción de cada hoja ocupa como mucho dos líneas en el móvil.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.44.0 — el móvil, más compacto",
    detalle: [
      "Portada: «Leer capítulo» y «Para el paciente» en una sola fila también en el móvil y sin la frase de entrada del mapa de consulta. Bajo el nombre va la afiliación, los dos en letra más discreta (la afiliación ya no está al pie).",
      "Para el paciente: cada hoja empieza con una línea de migas («Para el paciente › …») en lugar de las pastillas; los cuatro sistemas del plan de seguridad caben en una fila, y el formato e «Imprimir» comparten fila, con la explicación debajo en una línea.",
      "Leer capítulo: el índice empieza nada más entrar. «Comprender y practicar» pasa debajo del índice, con «Cómo funciona cada sistema» (los cuatro comparados), los casos guiados, las tarjetas y el test.",
      "Ficha de cada sistema: en el móvil, los enlaces (iniciar paso a paso, plan de seguridad, ficha completa e imprimir) van a lo ancho en dos filas. Iniciar un sistema: «Guía paso a paso» y «Hoja de comprobación» en una fila.",
      "El navegador ya no invita a instalar la app; la web sigue funcionando sin conexión.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.43.2 — el momento consultado y la hoja que resume",
    detalle: [
      "Situaciones: el momento abierto (p. ej. «Después del ejercicio») sigue abierto al abrir su fuente y volver, y va en la dirección (…:m6), así que se puede enlazar y una búsqueda puede llevar a él. Cada momento abierto tiene una sola línea de fuente que lleva al párrafo exacto del capítulo.",
      "Iniciar un sistema: la hoja de comprobación resume lo marcado en la guía paso a paso de esta consulta (y al revés); «Vaciar las casillas» da la hoja en blanco. No se guarda nada. La nota de la guía queda en una frase.",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.43.1 — revisión de la 0.43: guía coherente, situaciones más cortas",
    detalle: [
      "Guía paso a paso: la basal solo se pregunta si viene de plumas y su respuesta se borra al cambiar de pauta; la continuación corresponde a la pauta elegida. Lo elegido y lo marcado se conserva mientras dura la consulta (también al abrir una fuente y volver) y se borra al cerrar la app o con «Reiniciar la guía». Con la guía abierta, las fases no compiten: cabecera compacta con sistema y paso, y «Consultar por fases». En el arranque queda a la vista el requisito previo.",
      "Situaciones: con una elegida, en el móvil el catálogo se pliega («Cambiar» lo abre); dentro, un índice breve de necesidades, el primer momento abierto y los demás plegables («Abrir todos»), los dos párrafos de hipoglucemia bajo un rótulo y la fuente una sola vez al pie. «Ingreso» se llama «Qué revisar durante el ingreso»; «Gestación» va por necesidades.",
      "Tarjetas de la ampliación: cada rasgo con su nombre («Control desde el móvil: no», «Sin tubo: sí»). Objetivos de MCG: el pie dice que el TAR > 180 mg/dl es un dato complementario del consenso de 2019, con enlace. Para el paciente: sin «Hoja para el paciente para entregar».",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.43.0 — buscador a la izquierda, situaciones por momentos, guía paso a paso",
    detalle: [
      "Portada sin la caja grande ni «Lo último que consultaste»: el buscador está arriba a la izquierda (barra lateral) y, en el móvil, en el icono de la cabecera, también en la portada.",
      "Sistemas: «Cómo funciona» comparado es una cuadrícula con la foto y el nombre de cada sistema una sola vez; las tarjetas de la ampliación técnica llevan foto, resumen y rasgos. En la ficha, «Situaciones» ya no repite las celdas: es un índice que abre cada situación con el sistema elegido.",
      "Situaciones: ejercicio, exploraciones y cirugía enseñan «Lo que dice el capítulo, por momentos» (antes, durante, hipoglucemia, desconexión, después…); nuevas situaciones «Ingreso hospitalario» y «Gestación, parto y posparto», con los párrafos literales del capítulo y sus enlaces.",
      "Iniciar un sistema: «Guía paso a paso» con un paciente delante, en seis pasos; las preguntas (pauta previa, basal que lleva) eligen qué texto del capítulo se enseña y las casillas se marcan durante la consulta, sin guardar nada.",
      "Para el paciente: se puede descargar el PDF oficial del Manual SEEN con las doce preguntas. Objetivos de MCG: el TAR > 180 mg/dl lleva su cifra (< 25 %, consenso internacional de 2019, que el capítulo no reproduce).",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.42.0 — respuestas pertinentes y siglas a mano",
    detalle: [
      "Buscar: las preguntas relacionadas respetan el sistema de la consulta (sobre Omnipod no sale Control-IQ frente a Control-IQ+) y no cuentan como relación compartir solo una fila por sistema. Una respuesta de las Tablas 2 o 3 sigue en su tarea de Iniciar («Seguir en: Iniciar un sistema · Basal, ratio y factor de sensibilidad») y enseña, plegada, la explicación aprobada de esa tabla.",
      "Tarjetas: con un sistema elegido, los demás van plegados en «Ver otros sistemas». En una pregunta sobre un sistema (Control-IQ frente a Control-IQ+), el párrafo que enumera los cuatro va como ampliación.",
      "Iniciar un sistema: dentro de cada tarea, la primera vez que sale una sigla (DTD, MDI, I/HC, MCG…) es pulsable y abre su definición sin salir. Para el paciente: cada hoja dice para qué sirve.",
      "Arranque más ligero: los diagramas del capítulo se cargan al abrirlos, no al arrancar la app (entrada 165 → 161 KB).",
    ],
  },
  {
    fecha: "2026-10-12",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.41.0 — Iniciar un sistema por tareas, con menos ruido",
    detalle: [
      "Iniciar un sistema: cada fase es una lista corta de tareas desplegables con título de necesidad (en Inicio: plan de respaldo, cómo inicia el modo automático, pauta previa y transición desde MDI, basal/ratio/factor de sensibilidad, objetivos de glucosa). La tarea abierta va en la ruta, se puede enlazar y sobrevive a «Ver en el capítulo» y Atrás; «Fase completa» las abre todas. La hoja de comprobación pasa a ser una herramienta del recorrido, no una quinta fase.",
      "Procedencia sin repetir: dentro de una tarea, las piezas van sin cabecera de tabla, sin badge de página y sin enlace junto a cada frase; la fuente se dice una vez al pie («Fuente: Tabla 2, p. 10 · Apartado 8, p. 12 · texto literal del capítulo»). Cada tarea ofrece, como mucho, una continuación (plan de seguridad, criterios de elección, parámetros del sistema, revisar la descarga). Las piezas, condiciones y citas son las mismas.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.40.0 — ejemplo comentado coherente",
    detalle: [
      "Pasos 5 y 6 del ejemplo: las opciones correctas y los comentarios de las incorrectas dicen lo mismo que el comentario en cuatro partes: las causas se mantienen como hipótesis, las noches bajas no se atribuyen de entrada al objetivo temporal y una cena grasa no descarta la ratio.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.39.0 — textos revisados del 11-10",
    detalle: [
      "«Cómo leer esta tabla» de la Tabla 3 precisa el factor de sensibilidad sistema a sistema: en MiniMed 780G se usa en el calculador de bolos fuera del modo automático y no modifica las autocorrecciones.",
      "Ejemplo comentado: los pasos 5 y 6 llevan el comentario en cuatro partes (qué observamos, qué puede explicarlo, qué falta comprobar, qué podemos concluir), con las hipótesis abiertas; los pasos 1 y 8 precisan que se habla de este ejemplo y de un episodio pasado.",
      "Preguntas frecuentes: «Pasajes del capítulo relacionados con esta pregunta». Las explicaciones de la app cargan con prioridad explícita entre lo aprobado y los borradores de la copia de revisión.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.38.0 — preguntas que responden a lo preguntado",
    detalle: [
      "Preguntas frecuentes: títulos ajustados a sus pasajes (irritación de la piel, fallos repetidos de infusión, corrección con pluma, control del aeropuerto), sin pasajes repetidos; la de Control-IQ frente a Control-IQ+ añade el bolo extendido y enseña primero la columna de Tandem; tras la respuesta, como mucho una continuación (Interrupción del sistema, Figura 3).",
      "Iniciar un sistema: en los aspectos de la Tabla 2 se puede abrir «Cómo leer esta tabla» (configuración inicial frente a funcionamiento posterior). Textos más cortos en la comparación de «Cómo funciona» y en el paso 7 del ejemplo.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.37.0 — comparar cómo funcionan, leer las tablas, el paso 7",
    detalle: [
      "Sistemas comparados, «Cómo funciona»: cuatro aspectos (dónde está el algoritmo, cómo decide y aprende, cómo administra la insulina, bolos automáticos de corrección) con la celda de la Tabla 1 de cada sistema elegido, hasta los cuatro, un bloque por aspecto en el móvil, la fuente en cada aspecto y las condiciones de la modalidad híbrida y de Liberty (CamAPS FX). «Comparar los parámetros» conserva la selección.",
      "«Cómo leer esta tabla», plegado y aparte del texto literal, en las Tablas 1 a 5, y «Cómo interpretar este hallazgo» en el paso 7 de la descarga: explicaciones de la app revisadas, con su fuente.",
      "Ejemplo comentado, paso 7: la opción correcta no da por identificada la causa; el comentario va en cuatro partes (qué observamos, qué puede explicarlo, qué falta comprobar, qué podemos concluir) y, para quien entra directo, una frase neutra con los datos de la cena del paso 6 plegados.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.36.0 — capítulo y herramientas conectados",
    detalle: [
      "Buscar: cuando el capítulo solo responde en parte, lo dice («El capítulo no trata «sauna». Lo que sigue responde al resto de la consulta»). Las transiciones y comparaciones se reconocen con más formas de decirlas («cambiar de bolis a Omnipod», «en qué se diferencian», «comparar 780G con CamAPS»).",
      "Al abrir el capítulo desde una herramienta (una ficha, una situación, Iniciar, una búsqueda, un caso), un botón «Volver a la consulta» devuelve al mismo punto y estado. Desde una tabla del capítulo se llega a su herramienta: Iniciar un sistema (Tabla 2), Situaciones (Tablas 4 y 6) y Revisar la descarga (Tabla 5), además de «Ver por sistema».",
      "Preparado el bloque opcional «Cómo interpretar este dato» en las tablas y en los pasos de la descarga, y el comentario desglosado de los casos (hallazgo, hipótesis, qué falta, conclusión). Su texto es de la app y entra solo cuando se aprueba; mientras, se ve en la copia de revisión como borrador.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.35.0 — precisión y continuidad (revisión de la 0.34)",
    detalle: [
      "Buscador: «¿qué diferencia hay entre Control-IQ y Control-IQ+?» es una sola pregunta (nueva frecuente con la indicación, la gestación y la basal temporal de las Tablas 1 y 3, y el párrafo del apartado 4); «780G frente a Omnipod 5» abre su comparación en la Tabla 1; «pasar de plumas a Omnipod» o «dejar las plumas» conservan el acceso a Iniciar. Con el sistema nombrado, en los textos con una línea por sistema (inicialización de la Tabla 2) su línea va primero y las demás, en «Ver los cuatro».",
      "Iniciar un sistema: el aspecto elegido va en la ruta (se puede enlazar y sobrevive a «Ver en el capítulo» y Atrás); con un aspecto abierto, el índice se pliega a «Aspecto: … · Cambiar»; cada aspecto enlaza su fuente exacta (la tabla en el capítulo o el párrafo); los botones dicen «Fase anterior» y «Fase siguiente».",
      "Portada: «Lo último que consultaste» nombra los sistemas comparados (Control-IQ + Omnipod 5 · Cómo funciona) y admite dos líneas; el buscador vuelve a «Pregunta al capítulo» con la ayuda «Encuentra pasajes, tablas y herramientas». Sistemas comparados: «Cómo funciona cada uno» en vez de «Comparando».",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.34.0 — navegación pulida (auditoría de la 0.31, entrega 3)",
    detalle: [
      "Portada más compacta en el móvil: cabecera con menos altura, la afiliación pasa al pie y el buscador queda antes. «Lo último que consultaste» añade el contexto (tramo de la Figura 3, paso de la descarga, fase y sistema de Iniciar, situación, sección de la ficha) para distinguir dos visitas con el mismo título.",
      "Sistemas: «Los cuatro» es un estado explícito del selector, marcado cuando no hay ninguno elegido. En la portada, «Comparar sistemas (lo esencial)» y «Comparar los parámetros» dicen que son el mismo espacio.",
      "Preguntas frecuentes en ocho grupos sin solape: las de «Descarga e incidencias» pasan a «Incidencias y cetonemia» o «Descarga y seguimiento».",
      "Expresiones: «Pregunta al capítulo · pasajes y recursos del capítulo»; «Ver esta situación» cuando la fila abre una situación; «Ver fuente» en los casos; «Sistema» en los chips de la tarjeta.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.33.0 — consulta breve (auditoría de la 0.31, entrega 2)",
    detalle: [
      "Buscar con una sola jerarquía: el acceso pedido, el pasaje principal con su contexto, y debajo, plegados, «Más pasajes del capítulo» y «Todos los resultados» (abiertos solo cuando no hay respuesta). Las pestañas separan texto del capítulo, tablas y figuras y recursos de la app (accesos, ampliación, hojas, casos, test). Con dos temas, «También sobre …» solo cuando la otra parte añade algo distinto de lo ya enseñado.",
      "Criterios de elección: sin «Coincide en X de Y»; cada sistema enseña por separado los factores clínicos y regulatorios y las preferencias o compatibilidades, estado a estado. El formulario sigue abierto mientras se marcan criterios; «Ver resultados» lo pliega.",
      "Iniciar un sistema: «En esta fase» abre solo el aspecto elegido (su recomendación, notas y fuente) y «Ver la fase completa» devuelve la lectura seguida. «Elige un sistema para ver sus indicaciones junto con los criterios comunes de inicio».",
      "Sistemas comparados: «Cómo funciona» dice que es lectura por sistema, no comparación por aspectos.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.32.0 — confianza y continuidad (auditoría de la 0.31, entrega 1)",
    detalle: [
      "Buscador: una consulta que nombra un sistema que el capítulo no trata (iLet, Diabeloop, Medtrum…) lo dice antes de dar nada general; «paso 7 de la descarga» abre un solo acceso y enseña ese paso como pasaje principal; «iniciar Omnipod 5 desde múltiples dosis» abre Iniciar para ese sistema y «múltiples dosis» se entiende como MDI.",
      "Volver desde «Ver en el capítulo» con Atrás devuelve al mismo punto de la ficha de sistema o de la Figura 3, en vez de al principio de la sección. Parámetros comparados y Revisar la descarga enlazan su fuente («Ver en el capítulo · Tabla 3, p. 11»; «Tabla 5, pp. 13–14»).",
      "Figura 3: la nota de que las dosis son orientativas para personas adultas se enseña junto al tramo que las lleva, además de en las notas comunes.",
      "Consultas sin respuesta: el texto se recorta a 80 caracteres, cada registro caduca a los seis meses, se anota también la que nombra un sistema no cubierto, y el aviso de «sin resultados» lo dice junto al buscador. «Sobre esta app» pide escribir las dudas sin datos del paciente.",
      "Se quita «Seguir leyendo» (portada, menú e índice del capítulo) y la marca de apartado «Leído»: la app es de consulta, no de lectura seguida.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.31.0 — diez preguntas frecuentes más, dos intenciones y consultas sin respuesta",
    detalle: [
      "Diez preguntas frecuentes nuevas (60 en total): fallo de la bomba o sin insulina, cuándo confirmar con glucemia capilar, pérdida de señal del sensor, adhesivo y piel, fallos de infusión y cánula, cuánto esperar antes de volver a corregir, comida rica en grasa o proteína, viaje y aeropuerto, fatiga por alarmas, enfermedad intercurrente.",
      "Una consulta con dos intenciones («hipoglucemia nocturna y comidas grasas con 780G») responde a las dos: debajo del pasaje principal, «También sobre …» con lo que añade la otra parte. Con una pregunta de cifra, la casilla breve de la tabla se enseña en una línea encima de los pasajes cuando no es ya la primera respuesta.",
      "Si una búsqueda se queda sin ningún pasaje ni pregunta frecuente, la app guarda solo su texto y cuántas veces se ha hecho, sin fecha exacta ni dato alguno de quién la hizo, para mejorar el buscador (se explica en «Sobre esta app»).",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.30.0 — el buscador entiende más lenguaje de consulta",
    detalle: [
      "Setenta consultas escritas como se dicen en la consulta, probadas contra el motor: «la bomba se ha quedado sin insulina» o «sin batería» llevan a la interrupción del sistema y la pluma; «la aguja se dobla» o «cánula doblada», a los acodamientos y las cánulas metálicas; «no me deja entrar en automático», a las salidas del modo automático; «se me cae el pod», al adhesivo; «bajar el objetivo», al objetivo glucémico y sus valores permitidos; «me quito la bomba para jugar al fútbol», «hb glicada» o «sensor en el brazo» encuentran su pasaje.",
      "Lo que el capítulo no trata (sauna, campamentos, menstruación) sigue sin respuesta forzada.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.29.3 — lo que enseñó la prueba simulada",
    detalle: [
      "Cincuenta consultas de diez perfiles (residentes, adjuntos y especialistas) sobre las tareas del guion: «paso 7 de la descarga» abre ese paso; «descarga comentada», «practicar descarga» o «caso práctico de la descarga» abren el ejemplo comentado; «qué puedo cambiar en Omnipod 5 en automático» abre sus parámetros. Los ocho pasos de la descarga entran en el buscador.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.29.2 — tablas con índice y expresiones afinadas",
    detalle: [
      "Tablas del capítulo abre con las seis en filas (número, título y la pregunta que responde cada una); dentro de una tabla, «Otra tabla» para cambiar y la miga para volver al índice. El selector de sistema de las tablas es el mismo de toda la app, con «Los cuatro» para volver a verlos todos.",
      "Expresiones: «¿Qué sistema y cómo se ajusta?» en la portada; «Marca uno (su ficha de lectura) o varios (compararlos)» en las tablas; «Ver por sistema» y «Abrir la tabla» en las tablas del texto; «Sistema (para ver solo el suyo)» en Iniciar; «Ver la situación con su texto» en la ficha; la entradilla de Buscar en una frase.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.29.1 — un solo buscador en la portada",
    detalle: [
      "En la portada solo hay un buscador: desaparece la caja de la barra superior (en escritorio) y la lupa (en el móvil) mientras se está en ella; en las demás pantallas siguen, y Ctrl K también.",
      "La portada dice mejor lo que hace: «Pregunta al capítulo» sobre la caja, con ejemplos de dudas en el hueco, y una línea bajo «Consultar» que explica los cuatro bloques; la cabecera dice «Capítulo 89 del Manual SEEN · Área II. Diabetes».",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.29.0 — listas y tarjetas",
    detalle: [
      "Buscar separa los resultados en pestañas: Texto · Tablas y figuras · Fuera del capítulo, con su cuenta.",
      "Situaciones y Preguntas frecuentes se filtran escribiendo («resonancia», «gestación»): la lista se acorta mientras se escribe.",
      "Un solo selector de sistema en toda la app (casillas con marca y punto de color), también en Situaciones y en Iniciar un sistema.",
      "Para el paciente: las hojas como filas (título, para qué sirve, flecha), sin tarjetas.",
      "Casos guiados: cada caso recuerda el paso alcanzado en este navegador («Paso 3 de 5 · Continuar»; «Hecho · Repetir»).",
      "Portada: «Lo último que consultaste», las cuatro últimas pantallas, para volver en un toque.",
    ],
  },
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.28.0 — buscar y responder con más mano",
    detalle: [
      "Sugerencias mientras se escribe: a partir de tres letras, preguntas frecuentes, situaciones, sistemas, herramientas, hojas y siglas que empiezan por lo escrito; una pregunta rellena la caja y lo demás abre su pantalla.",
      "La tarjeta de respuesta cambia: cuando responde una lista, el punto que coincide va primero y la lista entera queda plegada; en una fila por sistema, los cuatro sistemas se cambian con un toque dentro de la tarjeta (y vienen marcados si la búsqueda nombraba uno); en la Figura 3, el tramo se cambia igual; «Ver en contexto» despliega la frase anterior y la siguiente sin salir; y según de dónde sale la respuesta, enlaces a los cuatro sistemas en esa tabla o a la hoja para el paciente (cetonas; pruebas y cirugía).",
      "Seguimiento: «y en Omnipod 5» o «con Control-IQ» heredan el tema de la búsqueda anterior («Entendido como …», con la opción de buscar lo escrito tal cual).",
      "Al pie de cada respuesta, preguntas relacionadas; y cuando el capítulo no trata lo buscado, se dice y se ofrecen las preguntas más cercanas por el sentido.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.27.0 — superficies más tranquilas",
    detalle: [
      "Las tarjetas ya no flotan: las delimita el borde fino; la sombra queda para lo que de verdad flota (menús, diálogos) y para el hover de los enlaces.",
      "En las tablas por sistema del móvil y en Situaciones, cada sistema va con un filete de su color en vez de un fondo teñido, y el dato al tamaño de lectura (15 px), como en la ficha.",
      "En Parámetros comparados, la Tabla 3 va primero; lo que se configura en modo automático (Tabla 1) queda plegado encima.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.26.0 — cada control, una forma; un solo acento",
    detalle: [
      "Un único acento de interacción, el burdeos del Manual: botones, pestañas y selección activas se ven igual en toda la app; los colores de categoría quedan como acentos pequeños y desaparecen los degradados.",
      "En Sistemas AID, los sistemas se marcan como casillas (marca y punto de color) y las secciones son pestañas subrayadas; al desplazarse, la barra se pliega a una línea («Control-IQ + Omnipod 5 · Cambiar») con fondo opaco; Ficha completa e Imprimir pasan a la cabecera.",
      "En el menú de escritorio, Inicio solo se marca en la portada (antes salía marcado junto a Sistemas AID).",
      "Revisar la descarga: «Paso n de 8 · Cambiar paso» y Anterior/Siguiente al final; Qué mirar, Interpretación y Actuación en una sola superficie; los patrones relacionados, plegados.",
      "En los apartados, los subapartados y los recursos se ven completos, sin deslizar en horizontal. Fuera el mosaico decorativo de la portada de escritorio. Notas y fuentes a 13 px; transiciones más breves.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.25.5 — entradillas más cortas",
    detalle: [
      "Las frases de presentación de cada pantalla (Sistemas, Situaciones, Iniciar, Tablas, Casos, Preguntas, Repaso, Autoevaluación, Para el paciente) se quedan en una línea; fuera el plegable «Cómo funciona» de Buscar y el rótulo de área en la cabecera de cada apartado.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.25.4 — sin bloques repetidos",
    detalle: [
      "Fuera los bloques «Practicar con un caso» que enlazaban a la edición educativa de asistente-aid al pie de Situaciones, Revisar la descarga, Interrupción, Cetonemia e Iniciar un sistema; el enlace a asistente-aid sigue en la ampliación técnica de cada ficha.",
      "Fuera las tarjetas Anterior / Siguiente al pie de la ficha de sistema: el selector de arriba ya cambia de sistema conservando la sección.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.25.3 — menos texto de app",
    detalle: [
      "«Sobre esta app» se queda con qué es y qué hay además del capítulo; fuera el historial de versiones, las correcciones editoriales, lo pendiente y la nota técnica.",
      "En la ampliación técnica, donde un dato no coincidía con el capítulo se enseña directamente la frase del capítulo con su página, sin la marca «Difiere del capítulo»; la ratio insulina/HC pierde la etiqueta de nivel que el capítulo no le da.",
      "En el menú lateral, pulsar otra vez «Índice del capítulo» pliega el índice.",
      "Fuera la tarjeta repetida al pie de cada ficha y el texto largo de «Cómo funciona» del buscador.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.25.2 — portada más limpia",
    detalle: [
      "Las filas del mapa de consulta llevan solo el nombre; la tabla o el apartado de donde sale cada cosa se ve al entrar.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.25.1 — limpieza tras la revisión",
    detalle: [
      "Buscar ya no menciona la versión extendida (retirada en la 0.21.0) al explicar lo que queda fuera del capítulo.",
      "En «Lo esencial» de cada ficha, la nota del asterisco de la Tabla 1 solo sale si alguna celda lo lleva, y la lista de siglas de la tabla va plegada.",
      "«Para el paciente» describe bien las hojas breves: dos a partir de la Figura 3 y la Tabla 6 y tres de la Información para pacientes.",
      "Sin favoritos: se habían quitado de los apartados y seguían en las fichas, los diagramas y la portada; ahora no hay favoritos en ningún sitio (lo guardado en el navegador no se usa).",
      "El botón Imprimir de Sistemas solo aparece con una sección abierta.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.25.0 — terminar los recorridos: selección, contexto y buscador",
    detalle: [
      "Sistemas AID: el mismo selector en la ficha y en la comparación; marcar añade un sistema (dos = comparados en la misma sección), desmarcar lo quita; el sistema y la sección quedan pegados arriba al desplazarse; Anterior/Siguiente conservan la sección. La ficha abre por «Lo esencial»; la ficha completa es una opción para leer o imprimir. La entrada de Sistemas es ese mismo espacio, sin catálogo aparte.",
      "Portada en el móvil: el mapa de consulta entra en la primera pantalla; las sugerencias y las búsquedas recientes aparecen al tocar el buscador.",
      "Buscador: cuando la consulta nombra un recurso (el ejemplo comentado, los parámetros de un sistema, una situación), va el primero como «Abrir …», encima de los pasajes; sin aviso de «ninguna palabra» cuando ya hay una respuesta.",
      "Criterios de elección (antes «Elegir un sistema»): lo que se dice de cada criterio es lo que dice la celda («dentro del criterio», «sin autorización», «sensor compatible», «no consta en la tabla»), sin veredicto global; en cuántos criterios coincide cada sistema; formulario plegable, criterios aplicados a la vista y cada uno se quita con un toque.",
      "Menos repetición: la nota del asterisco una sola vez por bloque en las preguntas frecuentes y la pregunta no se repite; «Sensor y señal de glucosa» en «Cómo funciona»; en «Qué lo distingue», solo el trozo de la enumeración que habla de ese sistema.",
      "Enlaces a las hojas desde donde hacen falta: la hoja de pruebas y cirugía desde esas situaciones, la de cetonas desde la hiperglucemia y la Figura 3, el plan de seguridad desde la ficha y desde Iniciar un sistema.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.24.0 — Elegir un sistema: los criterios del capítulo, sistema a sistema",
    detalle: [
      "Nueva pantalla dentro de Sistemas: se marcan los factores que el apartado 6 pide integrar (edad, peso, dosis total diaria, gestación o planificación, diabetes tipo 2, formato de bomba, sensor, control desde el móvil) y cada sistema enseña la celda literal de la Tabla 1 que responde a cada uno, con «cumple», «fuera» o «no consta»; las variantes (Control-IQ y Control-IQ+, CamAPS FX y Liberty) se distinguen. Los criterios van en la dirección, para enlazarlos.",
      "Los umbrales están copiados de la Tabla 1 y una prueba comprueba que cada uno sigue en su celda. Lo que la tabla no dice queda como «no consta»: la pantalla orienta la decisión compartida, no la sustituye; debajo, el párrafo del capítulo sobre la elección (p. 6) y la Figura 2.",
      "Entrada en la portada (¿Qué sistema? · Elegir un sistema) y en Sistemas.",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.23.0 — una sola pantalla de Sistemas y un mapa de consulta",
    detalle: [
      "Sistemas, Comparar sistemas y Parámetros por sistema eran cuatro puertas al mismo material (las Tablas 1, 3 y 4 por sistema). Ahora son una pantalla: un sistema marcado es su ficha por secciones; dos o más, la misma sección con un sistema junto a otro; «Comparar» y «Parámetros» son esa pantalla con los cuatro. Las direcciones antiguas siguen funcionando.",
      "Cetonemia paso a paso (Figura 3) e Interrupción del sistema (p. 9) se encuentran también dentro de Situaciones, que agrupa por tema todo lo que responde a «¿qué hago en…?».",
      "La portada es el mapa de consulta: el buscador y cuatro bloques en filas (¿Qué sistema?, ¿Qué hago en esta situación?, En la consulta, Para el paciente); desaparece la pantalla «Consultar» intermedia y las tarjetas. Las Tablas y las Figuras pasan a «Leer capítulo».",
      "Barra del móvil con cuatro destinos (Inicio · Leer · Paciente · Buscar) y menú lateral con tres grupos (Consultar, Leer capítulo, Aprender) más «Sobre esta app»; desaparece «Más».",
    ],
  },
  {
    fecha: "2026-10-10",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.22.0 — hojas sin código QR; tarjetas sin frases",
    detalle: [
      "Las hojas para el paciente y la hoja de comprobación del inicio ya no llevan código QR ni «Compartir el enlace» / «Mostrar el QR»: la app es para quien atiende al paciente, no para el paciente; las hojas se imprimen y se entregan en papel.",
      "Las tarjetas de la portada y de Consultar llevan solo el nombre y de dónde sale (Tabla 1, Tabla 3, Figura 3…); desaparecen las frases de explicación, que repetían lo que ya dice el nombre.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.21.0 — más operativa: menos capas, el paciente a mano",
    detalle: [
      "«Para el paciente» pasa a primer plano: tercera entrada de la portada, tercera tarea de Consultar y en el menú.",
      "Se retira la versión extendida (los fragmentos del borrador largo que no entraron en el capítulo) de las fichas, las tablas y el buscador: la app muestra el capítulo publicado y, aparte y rotulada, la ampliación técnica de cada sistema, ahora con enlace a la ficha del mismo sistema en la edición educativa de asistente-aid para el detalle.",
      "Se retira el glosario como pantalla: las siglas siguen explicándose al pulsarlas en el texto, en las tarjetas de repaso y en el buscador, y llevan al apartado donde el capítulo las desarrolla.",
      "«Sobre esta versión» y «Qué ha cambiado» se unen en una sola pantalla corta, «Sobre esta app»: qué es, qué hay además del capítulo, datos, lo pendiente y, plegados, el historial de versiones y las correcciones editoriales.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.20.2 — autoevaluación confirmada",
    detalle: [
      "Las diez preguntas de la autoevaluación quedan confirmadas: desaparecen el rótulo «Pendiente de validación» y ese punto de la lista de pendientes. Son las preguntas del cuestionario del capítulo (mayo de 2026), comprobadas una a una contra el texto publicado.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.20.1 — el resumen del capítulo, con los profesionales",
    detalle: [
      "El resumen del capítulo (una página, maquetación de la editorial) sale de «Para el paciente», que queda solo con material para entregar, y pasa a «Leer capítulo» (#/capitulo/resumen); los enlaces antiguos siguen funcionando.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.20.0 — dos hojas más para el paciente",
    detalle: [
      "«Cetonas: qué hacer según el resultado», una tarjeta de bolsillo a partir de la Figura 3 y del plan de seguridad del capítulo, en lenguaje para el paciente: cuándo medir cetonas, qué comprobar primero y qué hacer en cada tramo; sin dosis, con un hueco para la que fije el equipo.",
      "«Antes de una prueba o una cirugía: qué hacer con la bomba y el sensor», la Tabla 6 en lenguaje para el paciente, bomba y sensor por separado, con la regla de la pauta alternativa si la bomba va a estar quitada más de una hora.",
      "Las dos, revisadas, con letra grande, código QR y su origen en el capítulo; en «Para el paciente».",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.19.0 — material para el paciente a mano y situaciones por tema",
    detalle: [
      "«Para el paciente» es una tarea más de Consultar y de la portada. Tres hojas breves nuevas para entregar según lo que haga falta ese día, hechas solo con las preguntas y respuestas ya publicadas de la Información para pacientes: «Si la glucosa baja, o sube y no baja», «Ejercicio, viajes y pruebas médicas» y «Qué tener siempre a mano y qué hacer si el sistema falla». Con letra grande y código QR, como las demás.",
      "Situación y sistema agrupa las situaciones por tema (ejercicio y comidas; noche, enfermedad e hiperglucemia; exploraciones, cirugía e ingreso; poblaciones y situaciones especiales), junten o no tabla, en vez de por la tabla de la que salen.",
      "Portada con la afiliación tal como figura en el capítulo. Texto de favoritos al día en Más.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.18.0 — tareas con nombre propio, fichas por sección y lectura más limpia",
    detalle: [
      "«Parámetros por sistema» y «Comparar sistemas» son ahora pantallas propias: la primera pide el sistema y enseña su Tabla 3; la segunda, dos o más sistemas en la Tabla 1. La tabla es la fuente, con «Ver en el capítulo» a la tabla en su sitio, no al principio del apartado.",
      "Consultar queda en siete tareas y una lista corta de recursos (sistemas, tablas, figuras, glosario, preguntas), sin destinos repetidos.",
      "La ficha de un sistema abierta por una sección (parámetros, cómo funciona, situaciones…) enseña solo esa sección, con el cambio de sistema al lado y «Ficha completa» a un toque; antes eran más de diez pantallas en el móvil.",
      "Buscar encuentra también los casos guiados y el ejemplo de descarga («ejemplo de descarga», «practicar con un caso»); las respuestas que llevan a una ficha abren la sección exacta; las citas de los casos llevan a la frase, resaltada.",
      "Lectura: la pantalla se llama «Leer capítulo»; «Comprender y practicar» va antes del índice (cómo funciona cada sistema, casos, tarjetas, test); en los apartados solo se muestra lo que hay en el capítulo publicado (la versión extendida sigue en las fichas y en las tablas, rotulada) y queda una sola acción, Imprimir / PDF. La infografía se ve como imagen, con su transcripción plegada.",
      "Portada con el título completo del capítulo y su firma. Preguntas frecuentes por temas plegados, con «Ver todas». En «Revisar la descarga», «Ir a un paso» por su nombre.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.17.0 — preguntas por temas, ejemplo de descarga y la fuente a un toque",
    detalle: [
      "Cuando la búsqueda con tus palabras no encuentra nada, hay un camino por temas: las 50 preguntas frecuentes revisadas, agrupadas (selección e indicación, sistemas y parámetros, inicio, descarga, incidencias, situaciones especiales…), cada una con los pasajes literales que la responden. Se ofrece desde «sin resultados», desde la caja de búsqueda vacía y desde Consultar.",
      "En la ficha de cada sistema, cada tabla lleva «Ver en el capítulo», que abre la tabla en su apartado; Atrás devuelve a la misma sección de la ficha.",
      "Un ejemplo de descarga comentado, «Una descarga de 14 días» (MiniMed 780G), en los casos guiados: ocho pasos, uno por fila de la Tabla 5, con datos ficticios coherentes; en cada paso se elige una opción y se ve el veredicto, el comentario y las frases literales del capítulo con su página. «Revisar la descarga» enlaza cada paso con el mismo paso del ejemplo, y el ejemplo devuelve al recorrido.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.16.0 — casos guiados",
    detalle: [
      "Tres casos guiados para practicar con el texto del capítulo, en «Leer y comprender» y en el menú: «Hiperglucemia que no baja» (Omnipod 5, Figura 3), «Salir a correr» (Control-IQ, Tabla 4 y ejercicio) e «Ingreso para una cirugía larga» (MiniMed 780G, Tabla 6 y hospitalización). En cada paso se elige una opción y se ve si es lo que indica el capítulo, con un comentario y las frases literales en las que se apoya, cada una con su página y su enlace; «Ver todo» enseña el caso entero.",
      "Los escenarios son ficticios, sin dosis calculadas ni datos reales; las 83 citas se comprueban contra el texto publicado en cada prueba del proyecto.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo:
      "Manual SEEN · AID 0.15.0 — navegación más clara, portada compacta, fichas por secciones y siglas pulsables",
    detalle: [
      "Portada compacta: el título breve, qué permite hacer, las dos entradas (Consultar y Leer y comprender), el buscador, seguir leyendo, seis consultas frecuentes y los favoritos. En el móvil pasa de casi siete pantallas a menos de dos; el índice, los diagramas, los sistemas y el repaso siguen en su sitio.",
      "Barra inferior del móvil: Inicio · Consultar · Leer · Buscar · Más, con el área de cada pantalla marcada desde un único sitio (las fichas de sistema y las figuras cuentan como Consultar; el repaso y el test, como Leer). La barra lateral del escritorio queda en Inicio y tres grupos (Consultar, Leer y comprender con «seguir leyendo», y Más recursos), y la búsqueda pasa a la cabecera. El botón de menú del móvil abre el mismo menú.",
      "«Leer y comprender» reúne seguir leyendo, el índice de los trece apartados y, aparte, cómo funciona cada sistema, las figuras y diagramas, las tarjetas de repaso y la autoevaluación.",
      "En el móvil, imprimir, favorito, escuchar y citar van juntos en «Opciones de lectura», y el índice y los recursos del apartado en una fila: el texto empieza en la primera pantalla.",
      "Ficha de cada sistema en secciones con enlace propio: Lo esencial (Tabla 1), Parámetros (los configurables en automático y cómo se ajusta cada uno, Tabla 3), Situaciones (Tabla 4, cada una abre con el sistema ya elegido) y Ampliación técnica. Un enlace como #/sistemas/ciq/parametros abre directamente esa sección.",
      "Tablas por la pregunta que responden («¿Qué características diferencian a los sistemas?», «¿Cómo se ajusta cada parámetro en cada sistema?»…), con el título del capítulo debajo. Al elegir sistemas se ve qué se está mirando («Tabla 1 · viendo MiniMed 780G y Omnipod 5») y la selección queda en el enlace para compartirla.",
      "En la búsqueda rápida (Ctrl K), Intro abre todos los resultados en vez de saltar al primer pasaje, que podía ser una coincidencia parcial; con las flechas se elige uno. La guía rápida deja de aparecer al entrar y sigue en «Sobre esta versión».",
      "Siglas pulsables en la lectura: la primera vez que aparece una sigla del glosario en cada apartado (TIR, β-OHB, MDI…) se puede pulsar y enseña su desarrollo, literal y con la página en la que el capítulo lo da, con enlace al glosario; con teclado (Intro abre, Esc cierra y devuelve el foco) y, en el móvil, como una hoja al pie. El texto del capítulo no cambia.",
      "«Cómo funciona» en la ficha de cada sistema (#/sistemas/<id>/funciona): lo que dice el capítulo del sistema en el orden en que se entiende (qué información utiliza, dónde está el algoritmo y cómo decide, cómo administra la insulina, hacia qué objetivo, qué sigue haciendo la persona, qué puede ajustar el profesional, qué lo distingue en la práctica y qué información devuelve), con las casillas de la Tabla 1 y frases de los apartados 2, 3 y 4, literales y con su página. Los rótulos de los pasos son de la app; no hay explicación nueva.",
    ],
  },
  {
    fecha: "2026-10-09",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.14.0 — búsqueda también por el sentido",
    detalle: [
      "Con conexión, el buscador compara además la búsqueda con los 480 pasajes del capítulo por su sentido (un modelo de lenguaje multilingüe de Cloudflare, bge-m3) y funde las dos listas: así encuentra pasajes que dicen lo mismo con otras palabras. Ayuda sobre todo con preguntas completas; con dos o tres palabras sueltas apenas cambia lo que ya da el buscador.",
      "Lo que solo propone el sentido, sin apoyo en las palabras, va rotulado «coincidencia parcial»; con una cifra de cetonemia sigue mandando la rama de la Figura 3, y las preguntas frecuentes se siguen activando solo por las palabras. Sin conexión, o si el servicio no responde en 3 segundos, se busca solo por palabras, como hasta ahora.",
      "Privacidad: solo se manda el texto de la búsqueda; la función que lo recibe no lo guarda ni lo registra, y la app sigue sin pedir ni guardar datos de pacientes.",
      "Medido con 100 preguntas nuevas de residentes, adjuntos y enfermería, escritas por otro agente sin ver el motor y medidas una sola vez: el pasaje bueno sale el primero en el 70 % (66 % solo por palabras) y entre los tres primeros en el 83 % (77 %); las respuestas equivocadas presentadas como directas bajan del 18 al 15 %, y de las 12 preguntas que el capítulo no trata, 11 siguen sin pasaje directo. El buscador sigue fallando en una de cada tres preguntas: comprueba siempre el pasaje.",
    ],
  },
  {
    fecha: "2026-10-08",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.13.0 — preguntas frecuentes en el buscador",
    detalle: [
      "50 preguntas frecuentes revisadas una a una (selección e indicación, sistemas y parámetros, inicio, educación y plan de seguridad, descarga, incidencias y cetonemia, interrupción y situaciones especiales). Cuando una búsqueda se parece de verdad a una de ellas, sale primero, rotulada «Pregunta frecuente», con los pasajes del capítulo elegidos de antemano, literales y con su página; debajo siguen los demás pasajes y todos los resultados.",
      "Si la búsqueda nombra un sistema, la pregunta frecuente enseña su casilla, o deja responder al buscador cuando no tiene nada propio de ese sistema; con una cifra de cetonemia manda la rama de la Figura 3; y lo que la búsqueda niega («sin embarazo») no la activa.",
      "Medido con 80 preguntas nuevas escritas por otro agente sin ver el motor ni las preguntas frecuentes: el pasaje bueno sale el primero en el 57,5 % (55 % sin ellas) y las respuestas equivocadas presentadas como directas bajan del 18,8 al 17,5 %. Cuando la pregunta frecuente salta, acierta casi siempre, pero salta pocas veces con formas de preguntar muy distintas de las previstas.",
    ],
  },
  {
    fecha: "2026-10-08",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.12.0 — primero la consulta, búsqueda más honesta y hojas legibles",
    detalle: [
      "El texto es ya el del capítulo publicado en el Manual SEEN el 8-10-2026 (capítulo 89), con enlace a su página oficial desde la portada, «Sobre esta versión» y «Cómo citar»; la cita lleva el ISBN y la fecha de publicación.",
      "Portada orientada a la consulta del día a día: «Consultar» va primero, seguido del buscador, los cuatro sistemas y los diagramas; el capítulo completo sigue a un toque («Leer el capítulo» e «Índice»). El rótulo de área es «Área II. Diabetes», como en el Manual.",
      "Textos de la interfaz en tono neutro: «Guía rápida», «Ampliación técnica», «Versión extendida» y «Pendiente de validación», sin avisos repetidos en cada pantalla. Las notas de trabajo sobre el contenido dejan de mostrarse en la web.",
      "Búsqueda: arriba sale el «pasaje del capítulo» que mejor encaja (ya no «la respuesta»), o una «coincidencia parcial» si solo coincide en parte; el enlace dice adónde lleva («Ver en el apartado», «Ver la tabla», «Ver la figura»). Al principio se ven los mejores resultados y el resto con «Ver más resultados».",
      "El buscador respeta el sistema que se nombra («qué parámetros cambian el automático de Omnipod 5» da su casilla de la Tabla 1), entiende «sale mucho del automático» y «glucosa normal», y sin una cifra de cetonemia ya no elige una rama de la Figura 3. La nota de las dosis de la figura (adultos; en pediatría y gestación, su protocolo) se encuentra al preguntar por ellas.",
      "Medido con 80 preguntas nuevas de residentes, adjuntos y enfermería escritas por otro agente sin ver el motor: el pasaje bueno sale el primero en el 60 % y entre los tres primeros en el 74 %; 7 de las 10 preguntas que el capítulo no trata no reciben pasaje directo. Las mejoras corrigen los casos de la auditoría sin cambiar esa cifra general: el buscador sigue fallando a menudo.",
      "Sistemas: «Qué mueve el modo automático» pasa a «Parámetros configurables en modo automático» (el rótulo de la Tabla 1), separando los de efecto directo sobre el algoritmo (*) de los que intervienen sobre todo en los bolos o en el modo manual.",
      "Figura 3: al abrir una rama, también por enlace directo, debajo van las notas comunes de la figura (insulina con pluma, situaciones especiales, registro) y a quién se refieren las dosis.",
      "Hojas para el paciente: letra grande por defecto; la de una cara queda como versión compacta. Al pie, que lo escrito a mano no aparece en la web, la versión de la hoja y la fecha del capítulo.",
      "Lectura: en el móvil, las cifras del apartado empiezan plegadas para que el texto aparezca antes. La página de tablas explica qué pregunta responde cada una. Los enlaces a la edición educativa de ejercicio, comidas y cirugía llevan a su apartado, no al catálogo general. Rótulos más precisos en tarjetas, consulta y sistemas.",
    ],
  },
  {
    fecha: "2026-10-08",
    ambito: "capitulo",
    titulo: "Capítulo publicado en el Manual SEEN (capítulo 89)",
    detalle: [
      "Publicado el 8 de octubre de 2026 en manual.seen.es, en el Área II (Diabetes), subsección Tratamiento, con ISBN 978-84-606-8570-8.",
      "Lleva las 3 correcciones finales del 5-10-2026 y añade «peso» también en la indicación de Control-IQ de la Tabla 1 («peso 25–140 kg»). El resto del texto, las tablas y las figuras son los de la maquetación del 5-10-2026.",
      "La información para pacientes y el resumen publicados son, palabra por palabra, los que muestra esta app.",
    ],
  },
  {
    fecha: "2026-10-06",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.11.0 — el capítulo de la maquetación del 5-10-2026",
    detalle: [
      "El texto pasa a la última maquetación de la editorial (5-10-2026), que ya incorpora las 11 correcciones del 30-9. La app aplica además las 3 correcciones finales anotadas en ella.",
      "Resolución de incidencias (p. 15): en personas tratadas con iSGLT2 ya no se habla de rebajar el umbral a 200 mg/dl; «debe mantenerse una alta sospecha de cetoacidosis y medirse la cetonemia ante síntomas o situaciones de riesgo, con independencia del nivel de glucemia». Esa cifra sale de «Cifras del apartado» y de las tarjetas.",
      "La Figura 3, la infografía y las Figuras 1 y 2 se ven ahora con la imagen de la nueva maquetación, más nítida y ya con las correcciones de la editorial (la columna amarilla de la cetonemia, la nota del asterisco de las dosis, «DM1», «En modalidades híbridas»…).",
      "Páginas al día con la nueva maquetación: el final del párrafo de la hipoglucemia pasa a la p. 9, «Capacitación del equipo asistencial» a la p. 10 y la Tabla 3 a la p. 11.",
      "La información para pacientes que maqueta la editorial el 5-10-2026 es ya, palabra por palabra, la versión V5 que mostraba la app.",
    ],
  },
  {
    fecha: "2026-10-05",
    ambito: "capitulo",
    titulo: "Capítulo: nueva maquetación con 3 correcciones finales",
    detalle: [
      "La editorial (ec-europe) entrega una nueva maquetación de 25 páginas con las 11 correcciones del 30-9 incorporadas en el texto, las tablas, la Figura 3 y la infografía.",
      "La maquetación lleva anotadas 3 correcciones finales, que esta app ya aplica: la indicación de Control-IQ+ en la Tabla 1 («peso 9–200 kg, DTD 5–200 UI/día»), la frase sobre los iSGLT2 de la p. 15 y el DOI de la referencia 6.",
      "La información para pacientes maquetada coincide con la versión V5.",
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
      "La portada dice qué es la app, enseña «Seguir leyendo» sin desplazar y lleva a las tarjetas y al test; «Aprender» sube en la barra lateral. Al enfocar la caja en el móvil, sube para que el teclado no tape la respuesta.",
      "Las 55 cifras de los apartados llevan a su frase. Tarjetas: «en la ronda de hoy» y «por estrenar». Test: resultado final y «Volver a empezar». «Qué ha cambiado» se acorta: pendientes en lenguaje llano y las versiones antiguas, plegadas. Páginas siempre como «pp. 3–4».",
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
      "La búsqueda encuentra también la información para pacientes, el resumen y las preguntas del test (en el grupo «fuera del capítulo»); la ampliación técnica se distingue en violeta y la versión extendida, en ámbar.",
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
      "La portada ya no muestra el recuadro «Pendiente»: lo pendiente sigue, completo, en «Qué ha cambiado» y en «Sobre esta versión».",
    ],
  },
  {
    fecha: "2026-10-03",
    ambito: "app",
    titulo: "Manual SEEN · AID 0.5.0 — con la identidad del Manual SEEN",
    detalle: [
      "Diseño nuevo con los colores y la tipografía del Manual SEEN: títulos en mayúsculas finas, rótulo «Área Diabetes», franja de cuatro colores, índice del capítulo en mosaico de fichas de color (como las áreas de manual.seen.es) y paginación en círculos al pie de cada apartado. Fuentes Open Sans y Oswald, alojadas en la app (licencia OFL).",
      "Auditoría extensa (contenido, técnica y uso con tres perfiles): enlaces a la Figura 3 que caían un párrafo después, páginas de relación de la versión extendida corregidas en el PDF, frases de los diagramas devueltas a su literal (regla del 1800, ejercicio anaeróbico, tramo amarillo de cetonemia completo) y calificadores recuperados en «Situación y sistema».",
      "En la ficha de cada sistema, los datos de la ampliación técnica que no coinciden con el capítulo llevan la marca «Difiere del capítulo; manda el capítulo», con la frase literal y su página; y las notas de las tablas (el asterisco de la Tabla 1) se ven junto a la columna del sistema.",
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
      "Versión extendida: 33 fragmentos de los borradores de mayo de 2026 que no cupieron en el capítulo, revisados uno a uno. Van plegados, en ámbar y con su borrador y fecha, al final del bloque al que pertenecen y en la ficha de cada sistema; nunca se mezclan con el texto publicado.",
      "Cinco diagramas nuevos con frases literales y su página: gestación sistema a sistema, cuándo no continuar el sistema en el hospital, la Tabla 6 como mapa de exploraciones, la Figura 2 dibujada y la interrupción del sistema según su duración.",
      "Para el paciente: información para pacientes (versión V5) y resumen del capítulo, cada uno en una cara A4 imprimible y con código QR; y un plan de seguridad por sistema, hecho solo con texto del capítulo, para rellenar a mano (la app no guarda nada).",
      "Autoevaluación: las diez preguntas, con su explicación y las frases del capítulo que la respaldan, rotuladas «pendiente de validación».",
      "Navegación: «¿Qué necesitas?» en la portada, con buscador y ocho atajos a dos toques; «Seguir leyendo»; favoritos y apartados leídos (solo en este navegador, nada clínico); «Volver arriba»; la barra lateral, agrupada en Sistemas, Situaciones y recorridos, Figuras y tablas, y Glosario.",
      "Cada apartado: «Cómo citar» y «Escuchar» (voz del propio dispositivo). La búsqueda encuentra también la versión extendida y la ampliación técnica, en un grupo aparte y rotulado. Enlaces a los casos prácticos de la edición educativa de asistente-aid desde las situaciones que los tienen.",
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
      "Las cabeceras de cada sistema (ficha, portada e índice) salen ahora de la Tabla 1 del capítulo; la ampliación técnica solo se ve dentro de su bloque rotulado.",
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
      "Sistemas: una ficha por sistema con su foto oficial; primero lo que dice el capítulo (sus columnas de las Tablas 1, 3 y 4 y los párrafos que lo nombran, con página) y, aparte y rotulada, la «Ampliación técnica» (ficha técnica, parámetros que mueven el automático, sets de infusión, insulinas compatibles) con sus fuentes.",
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
      "Además, la Tabla 1 lleva corregida la errata de Control-IQ+, pendiente de comunicar a la editorial: «peso 9–200 kg, DTD 5–200 UI/día».",
    ],
  },
];

/* Lo que todavía no se sabe. Se muestra tal cual; no se rellena con suposiciones. Solo lo que
   importa al lector, en pocas palabras y en tono neutro; las decisiones de detalle sobre el
   contenido van en docs/NOTAS_EDITORIALES.md, fuera de la web. */
export const PENDIENTES: string[] = [
  "La autorización de la SEEN y de la editorial (ec-europe) para esta versión web, y su alojamiento.",
];
