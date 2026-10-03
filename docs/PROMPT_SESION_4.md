Proyecto «Manual SEEN · AID» (sesión 4): de «el capítulo bien presentado» a «lo que el PDF no puede
dar». Lee primero tu memoria `manual-seen-aid.md`, luego `AGENTS.md`, `README.md` y
`docs/AUDITORIA_2026-10-02.md` del proyecto (C:\Users\giorg\OneDrive\Desktop\Projects\manual-seen-aid).
Estado de partida: versión 0.3.0 publicada en https://manual-seen-aid.pages.dev, repo
giorgosk725/manual-seen-aid, 7 diagramas, galería «Figuras y diagramas», visor con zoom, fichas de
sistemas con «Ampliación del autor», recorridos de consulta, auditoría de fidelidad 144/144 párrafos.

OBJETIVO
Que el lector (endocrino adjunto o sénior) encuentre en dos toques lo que necesita, vea MÁS imágenes,
infografías y diagramas, y acceda a lo que tuvimos que recortar del capítulo por espacio, siempre
sabiendo qué es texto publicado y qué es material del autor. Navegación sencilla, pensada para el móvil.

FUENTES NUEVAS (todas mías; léelas enteras antes de proponer nada)

- Versiones largas del capítulo (mayo de 2026), donde está lo recortado:
  C:\Users\giorg\OneDrive\Capitulo SEEN\Definitivo\Capitulo_SEEN_AID_V93_integrado.docx (11 959
  palabras, 6 tablas, 3 imágenes); también 30 mayo\Capitulo_SEEN_AID_V85_limpio.docx,
  Capitulo_SEEN_AID_V79_limpio.docx y 30 mayo\Tablas_SEEN_AID_V85_vertical.docx (tablas más largas).
  Versión maquetada intermedia: C:\Users\giorg\OneDrive\Documents\Capitulo SEEN AID\Tratamiento-
  insulínico-del-paciente-cono-Diabetes-Mellitus-tipo-1_-automatización-de-la-insulinoterapia_Completo.pdf
  (16-9-2026) y C:\Users\giorg\OneDrive\Desktop\Capitulo SEEN\Capitulo Completo Correcciones (3) NEW
  NEW NEW.pdf (24-9-2026).
- Cuestionario de autoevaluación ya escrito (10 preguntas con casos):
  C:\Users\giorg\OneDrive\Capitulo SEEN\30 mayo\Cuestionario_autoevaluacion_AID_SEEN_formato_manual_v2.docx
- ÚLTIMOS FICHEROS DE LA EDITORIAL (recibidos el 3-10-2026), en C:\Users\giorg\OneDrive\Desktop\:
  «Tratamiento-insulínico-…_Completo.pdf», «…_Resumen.pdf» y «…_Pacientes.pdf», maquetación del
  30-9-2026. OJO: los nombres usan acentos descompuestos (NFD); ábrelos con la ruta que devuelve
  os.listdir, no tecleándola.
  · Completo (25 págs): comprobado el 3-10-2026, es idéntico página a página al PDF anotado
  (C:\Users\giorg\Downloads\Capitulo_AID_SEEN_30-09-2026_ANOTADO_FINAL_11_OBSERVACIONES.pdf), pero sin
  las notas: la editorial AÚN NO ha aplicado las 11 correcciones. La app sigue mostrando el texto con
  las correcciones aplicadas (docs/CORRECCIONES.md); no cambies el capítulo por este fichero. Cuando
  llegue la versión con las correcciones aplicadas, pasa scripts/auditoria/fidelidad.py con ella y
  dime qué difiere.
  · Información para pacientes: la fuente para la app es MI versión corregida
  C:\Users\giorg\Downloads\Informacion_pacientes_AID_SEEN_version_definitiva_V5.docx (1432 palabras).
  El «…_Pacientes.pdf» maquetado (2 págs) es anterior a mis correcciones y difiere en unas 30 frases
  («tubo» en vez de «catéter», hipoglucemia, regla de 270 mg/dl en el ejercicio, «cetonas en
  sangre»…). Enséñame esa lista para que confirme que la V5 es lo que publicará la editorial (las
  correcciones enviadas están en C:\Users\giorg\OneDrive\Documents\Capitulo SEEN AID\Correcciones\Pacientes\).
  · Resumen (1 pág): el maquetado coincide con mi V6 salvo el título; usa el maquetado.
- Mis presentaciones de 2023 con imágenes propias: C:\Users\giorg\OneDrive\Hybrid Closed Loop\26 Octubre
  2023 Sistemas Hibridos De Asa Cerrada.pptx y C:\Users\giorg\OneDrive\Sistemas Hibridos De Asa Cerrada 2023.pptx
  (contenido de 2023: muchas cifras estarán superadas; sirven por las imágenes, no por el texto).
- Contexto: C:\Users\giorg\OneDrive\Desktop\NIE\asistente-aid\docs\PROPUESTA_capitulo_SEEN_2026.md y
  C:\Users\giorg\Downloads\Auditoria_automatizacion_insulinoterapia.docx.

QUÉ QUIERO (por orden de prioridad)

1. «Lo que no cupo en el capítulo». Compara V93, V85 y las tablas V85 con el texto final de la app
   (src/contenido) párrafo a párrafo y celda a celda. Clasifica cada diferencia: (a) recortado por
   espacio y sigue siendo válido; (b) cambiado después a propósito (dosis, umbrales, autorizaciones:
   manda el final, NO se recupera); (c) dudoso. Enséñame la lista ANTES de publicar nada (página o
   documento con casillas para aprobar cada fragmento). Lo aprobado se publica dentro de su apartado
   como capa plegable «Versión extendida del autor · no publicada en el Manual», con el borrador y la
   fecha de origen, separada del texto literal y sin contradecirlo nunca.
2. Más imágenes e infografías. Extrae las 3 imágenes de V93 y propónme candidatas de las
   presentaciones de 2023 (lista con miniatura y para qué apartado; solo se publican las que apruebe).
   Diagramas nuevos con texto literal y página, como los 7 actuales: gestación por sistema
   (pp. 17–18: autorización, ensayo, objetivo configurable y estrategia de cada uno), cuándo no
   continuar el sistema en el hospital y transición a pauta alternativa (pp. 20–21), Tabla 6 como
   mapa visual por exploración, Figura 2 dibujada (elección compartida) e interrupción del sistema
   como línea de tiempo. Todo entra en la galería, en su apartado y en la búsqueda.
3. Para el paciente. Información para pacientes (V5) y resumen (maquetado), literales, en una
   sección propia, imprimibles en una cara y con QR para compartir desde la consulta. Más una hoja
   «Plan de seguridad» por sistema hecha solo con texto del capítulo (p. 7, Figura 3 y Tabla 4), con
   campos en blanco para rellenar a mano (la app no guarda nada).
4. Autoevaluación real. Importa las 10 preguntas del cuestionario: DT1 → DM1 y demás convenciones;
   comprueba cada respuesta contra el texto FINAL y su página; marca las que el texto final ya no
   respalda (es de mayo; p. ej. la Figura 3 cambió) y déjamelas para revisar. Hasta que las apruebe,
   rótulo «pendiente de validación del autor». Quita las dos preguntas de ejemplo.
5. Navegación más sencilla. Hoy la barra lateral tiene diez entradas en «Consultar»: agrúpalas
   (p. ej. Sistemas · Situaciones y recorridos · Figuras y tablas · Glosario). Añade en la portada un
   buscador «¿Qué necesitas?» con atajos a las 8 consultas más probables; «seguir leyendo donde lo
   dejaste»; favoritos (solo en el navegador, nunca datos clínicos); apartados ya leídos en el índice;
   «volver arriba» en pantallas largas. Comprueba con tres tareas cronometradas en 393 px que cada
   una se resuelve en dos toques: conducta de Omnipod 5 en ejercicio aeróbico; qué hacer con β-OHB
   1,2 mmol/l; objetivos de MCG en gestación.
6. Que no caduque y se pueda usar. «Novedades desde la publicación»: prepara un BORRADOR con fuentes
   (Liberty a la venta en Alemania desde el 1-9-2026, Control-IQ+ con Libre 3 Plus fuera de España,
   app de Omnipod 5 no disponible en España, lo que encuentres verificado) para que yo lo revise; no
   se publica sin mi visto bueno. Además: «Cómo citar» cada apartado, «Enviar un comentario al autor»
   (mailto), «Escuchar el apartado» (Web Speech, sin conexión) y enlace a la edición educativa de
   asistente-aid desde las situaciones que tienen caso práctico allí.

REGLAS (las de siempre, en AGENTS.md)

- El capítulo final es la fuente única del texto publicado: literal, con página. Copia las palabras
  exactas (la auditoría cazó cambios de forma verbal en la sesión anterior).
- Todo lo que no es el texto final va en su capa rotulada (Ampliación del autor, Versión extendida,
  Para pacientes, Novedades) y nunca contradice el capítulo. Si hay conflicto, manda el capítulo y me
  lo listas.
- Nada sin mi aprobación: lo recortado, las imágenes de 2023, las preguntas y las novedades se
  publican solo cuando yo diga. Prepara la revisión para que me lleve pocos minutos.
- Educativo: sin calculadoras, sin datos de paciente. Castellano de España, DM1/DM2, mg/dl, mmol/l,
  «duración de la insulina activa».

PROCESO

- Primero el inventario y el mapa (qué hay en cada fuente, qué propones y dónde va). Lo apruebo y sigues.
- Verifica como siempre: typecheck, Vitest, lint, prettier, Playwright (escritorio, 393 px,
  nocturno con axe), `scripts/auditoria` (fidelidad ampliada a lo nuevo, rutas a 6 anchos, offline) y
  capturas de lo nuevo en móvil y escritorio, que me enseñas antes de dar nada por bueno.
- Publica en Cloudflare Pages (proyecto manual-seen-aid, `npx wrangler pages deploy dist
--project-name=manual-seen-aid --branch=main`), commit y push.
- Trucos conocidos: el dev server va en el puerto 5180; si Playwright dice «No tests found», OneDrive
  ha convertido los ficheros de e2e en punteros (recréalos con mv/cp); los DOI dan 403 al robot
  (comprueba con doi.org/api/handles/).

PENDIENTE DE MÍ (déjalo visible, no lo inventes)

- Permiso de la SEEN y de ec-europe y dónde se aloja.
- Diferencias entre el capítulo y asistente-aid (ratio I/HC, Control-IQ MPC, verificación «julio de
  2026»…) y Liberty «> 13 años» frente a «menores de 13 años» (docs/AUDITORIA_2026-10-02.md, §3 y §7).
- El secreto CLOUDFLARE_API_TOKEN en el repo para el despliegue automático.

Trabaja de forma autónoma, decide lo rutinario, pregunta solo lo que cambie el resultado y cierra con
un resumen que entienda alguien que no haya visto la conversación.
