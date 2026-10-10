/* «Qué ha cambiado»: una entrada por revisión del capítulo y por versión de la app.
   Fechas absolutas. Lo que no se sabe se deja como pendiente, visible. */

export interface Cambio {
  fecha: string; // ISO
  ambito: "capitulo" | "app";
  titulo: string;
  detalle: string[];
}

export const VERSION_APP = "0.28.0";

export const CAMBIOS: Cambio[] = [
  {
    fecha: "2026-10-11",
    ambito: "app",
    titulo: `Manual SEEN · AID ${VERSION_APP} — buscar y responder con más mano`,
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
