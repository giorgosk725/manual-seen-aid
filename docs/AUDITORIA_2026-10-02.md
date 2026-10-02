# Auditoría de Manual SEEN · AID — 2 de octubre de 2026 (versión 0.2.1)

Auditoría extensa de la app tras la versión 0.2.0. Cinco frentes: fidelidad al capítulo, coherencia
entre el capítulo y la ampliación del autor, código, accesibilidad y diseño adaptable, y producción
(enlaces, PWA, tamaño). Los arreglos objetivos están aplicados en la 0.2.1; lo que depende del autor
queda en el apartado 7.

Los scripts para repetirla están en `scripts/auditoria/` (ver apartado 8).

## 1. Resumen

| Frente                                                      | Antes                                 | Después                                                   |
| ----------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| Párrafos, subtítulos y listas idénticos al PDF              | 135 de 144                            | 144 de 144                                                |
| Celdas y notas de tabla                                     | 216 de 216                            | 216 de 216                                                |
| Referencias                                                 | 10 de 10                              | 10 de 10                                                  |
| Cifras del apartado en su página                            | 49 de 49                              | 49 de 49                                                  |
| Siglas del glosario en la página indicada                   | 30 de 34                              | 32 de 34 (FSI e iSGLT2 están en la imagen de la Figura 3) |
| Contradicciones capítulo ↔ ampliación a la vista sin rótulo | 3 (cabecera de la ficha)              | 0                                                         |
| Defectos de código (revisión independiente)                 | 13                                    | 1 pendiente de decisión (cobertura del buscador)          |
| Violaciones axe (55 rutas × 2 anchos × día/nocturno)        | 48 (4 patrones)                       | 0 reales                                                  |
| Desbordes horizontales (55 rutas × 6 anchos, 360–1440 px)   | 2                                     | 0                                                         |
| Enlaces internos rotos (173)                                | 0                                     | 0                                                         |
| Enlaces externos (39)                                       | 21 con 200; 18 DOI con 403 del editor | los 18 DOI existen en doi.org                             |
| Sin conexión (usuario que vuelve)                           | —                                     | 5 de 5 pantallas, figuras y fotos cargan                  |
| Pruebas                                                     | Vitest 42, Playwright 15              | Vitest 43, Playwright 22                                  |

## 2. Fidelidad al capítulo

Método: se exporta todo el contenido de la app y se compara con el texto del PDF (PyMuPDF). Párrafos y
listas por coincidencia literal en su página; celdas de tabla y referencias por palabras y números en
las páginas de la tabla (el PDF intercala las columnas línea a línea). Las 11 correcciones editoriales
se detectan aparte y no cuentan como divergencia.

Hallazgos y arreglos:

1. **Lista de contenidos mínimos del PEET** (apartado 7): marcada como p. 6; sus ítems 2 a 8 están en la
   p. 7. Ahora dice «p. 6–7».
2. **Lista «Errores que conviene evitar»** (apartado 9): empieza en la p. 16 y termina en la 17. Ahora
   dice «p. 16–17».
3. **Glosario**: EASD e ISPAD situados en la p. 19, donde el capítulo solo da los nombres en castellano.
   Ahora apuntan a la bibliografía (pp. 24 y 25), que es donde aparecen las siglas con su desarrollo;
   el nombre en castellano de la p. 19 se conserva entre paréntesis.
4. Las figuras (1, 2, 3 e infografía) son imágenes en el PDF: su transcripción se revisó a mano frente a
   los renders a 300 ppp; el script no puede comprobarlas.

Inconsistencia **dentro del propio capítulo**, para el autor: la Tabla 1 dice «Liberty: > 13 años» y el
apartado 3 dice «no se recomienda en menores de 13 años». Las dos fórmulas difieren justo a los 13 años.

## 3. Coherencia entre el capítulo y la ampliación del autor

La ficha de cada sistema muestra el capítulo y, debajo, la ampliación (datos de asistente-aid). Se
compararon sistema por sistema.

**Arreglado en la app.** La cabecera de la ficha (subtítulo del algoritmo y tres casillas) y las
tarjetas de la portada y del índice de Sistemas salían de la ampliación, sin rótulo y por encima del
capítulo. Así, sobre la Tabla 1 («Control-IQ: algoritmo de tipo MPC») se leía «basado en predicciones»,
y la casilla «Control desde el móvil: No» de Tandem chocaba con Mobi. Ahora esas cabeceras salen de la
Tabla 1 del capítulo, con su página. La ampliación solo se ve dentro de su bloque ámbar.

**Para decidir el autor** (son diferencias entre sus dos obras; no se han tocado los datos):

| #   | Tema                                                 | Capítulo                                                             | Ampliación (asistente-aid)                                                      |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| A1  | Ratio I/HC                                           | Sin asterisco en la Tabla 1: no tiene efecto directo en automático   | Nivel «Influye en automático» en los cuatro sistemas                            |
| A2  | Tipo de algoritmo de Control-IQ                      | «algoritmo de tipo MPC» (Tabla 1)                                    | «planteamiento distinto al MPC (sin optimización)»                              |
| A3  | 780G, autocorrección                                 | «hasta uno cada 5 min si se predice > 120 mg/dl»                     | «cuando la basal automática alcanza su máximo y la glucosa supera 120 mg/dl»    |
| A4  | 780G, objetivo de corrección                         | No lo da                                                             | Dice a la vez «hacia el objetivo configurable» y «objetivo de corrección 120»   |
| A5  | Tandem, control desde el móvil                       | Mobi como formato                                                    | `tags.movil: "No"` frente a «Mobi… se maneja desde el móvil» (ya no se muestra) |
| A6  | Fecha de verificación                                | —                                                                    | «julio de 2026» en las cuatro fichas, con contenido de septiembre               |
| C1  | Omnipod 5, basal programada y factor de sensibilidad | «posteriormente, no influye»; «no modifica directamente SmartAdjust» | Nivel «Influye de forma indirecta» y «puede influir vía DTD»                    |
| C2  | Omnipod 5 y DM2                                      | «ya cuentan con autorización» (FDA)                                  | Criterio «Sin CE en DM2»                                                        |
| C3  | Control-IQ, gestación y DM2                          | Control-IQ clásico sin autorización                                  | Criterio con marca «Sí» (el texto aclara «Control-IQ+»)                         |
| C4  | Tandem Mobi                                          | Formato comercializado                                               | Una fuente dice «previsto en Europa en el segundo semestre de 2026»             |

Lo que coincide: edad, peso y DTD de los cuatro sistemas (incluida la errata corregida de Control-IQ+),
objetivos y modos, el 60 % y los 110 mg/dl de Control-IQ, las duraciones de la insulina activa,
plataformas, sensores y formatos. No aparece «DT1/DT2», «mg/dL», «mmol/L» ni «AIT» en texto visible.

## 4. Código (revisión independiente, solo lectura) — estado

| #   | Severidad | Hallazgo                                                                                                                 | Estado                                                                 |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | Alta      | Al imprimir un apartado o una ficha desaparecía el título (la regla de impresión ocultaba toda `<header>`)               | Arreglado: solo se oculta el cromo de la app                           |
| 2   | Alta      | En nocturno, el texto se imprimía gris claro casi invisible                                                              | Arreglado: los colores nocturnos solo en pantalla                      |
| 3   | Alta      | Elegir un tramo, paso o sistema subía al principio de la página y apilaba historial                                      | Arreglado: selecciones con `replace` y sin scroll                      |
| 4   | Media     | El enlace a una referencia (`#/bibliografia/ref-7`) no llegaba a ella                                                    | Arreglado                                                              |
| 5   | Media     | Interrupción y Glosario no seguían a la URL con Atrás                                                                    | Arreglado                                                              |
| 6   | Media     | Atrás perdía la posición y la búsqueda                                                                                   | Arreglado: posición guardada por pantalla; la búsqueda viaja en la URL |
| 7   | Media     | La limpieza de la impresión se disparaba a 1 s fijo                                                                      | Arreglado: `afterprint`, `matchMedia("print")` y siguiente interacción |
| 8   | Media     | La búsqueda desfiguraba «0,15 UI/kg\*» de la Figura 3                                                                    | Arreglado                                                              |
| 9   | Baja      | Un «%» mal formado en la URL rompía la app                                                                               | Arreglado                                                              |
| 10  | Baja      | Dos `@page` contradictorias; en papel las tablas salían como fichas                                                      | Arreglado: una sola regla y tablas como tabla                          |
| 11  | Baja      | Ctrl K con el índice abierto apilaba dos diálogos                                                                        | Arreglado                                                              |
| 12  | Baja      | `<p>` dentro de `<dl>`; niveles de título e ids repetidos en «Capítulo entero»; título de pestaña genérico en las fichas | Arreglado                                                              |
| 13  | Baja      | El buscador no indexa la ampliación del autor                                                                            | Pendiente de decisión (ver apartado 7)                                 |

Comprobado correcto: precache de figuras y fotos, `start_url`/`scope`, CSP, `rel="noopener noreferrer"`
en todos los enlaces externos, Figura 1 con movimiento reducido y tablas desplazables accesibles con
teclado.

## 5. Accesibilidad y diseño adaptable

- **axe** en las 55 rutas, a 393 y 1440 px, en día y en nocturno. Resultado final: 0 violaciones.
  Corregido por el camino:
  - Cuatro patrones de la primera pasada: la etiqueta «T4/T6» de Situación (gris claro), el número del
    paso en Revisar la descarga (color al 50 %), el resaltado de la búsqueda (sin contraste en nocturno)
    y el enlace largo de la Guía SED.
  - **Fallo heredado de asistente-aid** en el CSS nocturno: las reglas que aclaran colores en línea
    buscaban «color: rgb(…)» y casaban también dentro de «border-color: rgb(…)», así que un botón con
    borde de color perdía su texto blanco (3,3:1). Los 45 selectores quedan anclados a «color:» al
    principio del estilo o tras «; ». El mismo fallo sigue en asistente-aid.
  - El script de auditoría no limpiaba la preferencia nocturna entre visitas: las pasadas «de día» de
    algunas pantallas eran nocturnas. Corregido, salieron cuatro contrastes más, también arreglados: el
    número de apartado en «Capítulo entero», las etiquetas grises sobre fondo gris en Situación, el
    enlace «Ver ficha» y los botones de sistema o tramo seleccionados (texto blanco sobre el tono
    «fuerte» de CamAPS, Omnipod o el tramo amarillo; ahora sobre el tono oscuro de cada uno).
- **Desbordes** a 360, 393, 430, 768, 1024 y 1440 px: dos corregidos (la URL de la Guía SED a 360 px y
  las insignias de página en «Capítulo entero» a 1024 px).
- **Áreas táctiles**: los botones de paso de Revisar la descarga pasan de 36 a 44 px.

## 6. Producción

- **Enlaces internos**: 173 distintos; todos abren una pantalla existente y, si apuntan a un bloque, el
  ancla existe.
- **Enlaces externos**: 39. 21 responden 200. Los 18 restantes son DOI que el editor bloquea a los robots
  (403); los 18 existen según la API de doi.org.
- **Sin conexión**: build de producción, usuario que vuelve (página controlada por el service worker),
  red cortada y documentos nuevos. Las cinco pantallas probadas abren desde caché; la infografía carga a
  1440 px y las cuatro fotos de los sistemas a 480 px.
- **Tamaño**: JavaScript 463 kB sin comprimir (≈139 kB con gzip) en cuatro trozos; precache de 1,7 MB
  con las figuras. Sin errores de consola en ninguna ruta.

## 7. Decisiones pendientes del autor

1. Las diferencias A1 a A6 y C1 a C4 entre el capítulo y asistente-aid: corregir en asistente-aid y
   volver a extraer, o aceptarlas.
2. La edad de Liberty en el capítulo («> 13 años» frente a «menores de 13»).
3. Si la búsqueda debe incluir la ampliación del autor (sets, insulinas, fichas) como grupo aparte
   rotulado en ámbar.
4. Los pendientes de siempre: permiso de la SEEN y ec-europe, preguntas del test, archivos fuente de las
   figuras y fecha de publicación.

## 8. Cómo repetir la auditoría

```bash
npx vite-node scripts/auditoria/exportar-contenido.mjs
python scripts/auditoria/fidelidad.py            # ruta al PDF como argumento opcional
npm run dev -- --port 5180                        # en otra terminal
node scripts/auditoria/rutas.mjs
npm run build && npx vite preview --port 4185 --strictPort   # en otra terminal
node scripts/auditoria/offline.mjs
```

Los resultados se escriben en `_audit_*.json` (ignorados por git).
