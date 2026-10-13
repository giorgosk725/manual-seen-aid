# Impresión de los materiales · 0.55.0 (13-10-2026)

PDF generados con Chromium (A4, 12 pt, una columna, sin fondos, como sale al imprimir) y
revisados cara a cara (V54-09).

| Material                                     | Caras | Primera cara                                                                    | Comprobado                                                                                                  |
| -------------------------------------------- | ----- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Plan de seguridad · MiniMed 780G             | 4     | Título operativo y recuadro literal de urgencia y signos de gravedad (Figura 3) | Ninguna rama partida; naranja y roja (las de dosis con asterisco) en la misma cara que su nota de población |
| Plan de seguridad · Tandem Control-IQ        | 4     | Igual                                                                           | Igual                                                                                                       |
| Plan de seguridad · myLoop CamAPS            | 4     | Igual                                                                           | Igual                                                                                                       |
| Plan de seguridad · Omnipod 5                | 4     | Igual                                                                           | Igual                                                                                                       |
| Hoja «Cetonas: qué hacer según el resultado» | 2     | Bloque de alarma (≥ 3,0 o signos) con marco rojo, antes de los tramos           | Texto idéntico al aprobado; pie con fuente, capítulo y autoría                                              |
| Hoja «Pruebas y cirugía»                     | 2     | Título y «Antes de ir»                                                          | Sin bloque de urgencia propio (no lo tiene)                                                                 |
| Resumen del capítulo                         | 2     | —                                                                               | Rótulo sin «una página» (el origen es una página; la salida a 12 pt, dos caras)                             |

**Por qué 4 caras en los planes.** La Figura 3 ocupa casi una cara. Para que ninguna rama se
parta y las ramas con dosis no se separen de su nota, la figura empieza en la cara 3 y deja la
segunda a medias. Probado lo contrario (dejar partir): la rama naranja quedaba entre dos caras,
con la dosis lejos de su nota. Se prefiere una cara más.

**Impresión durante la carga.** Si una figura o diagrama sigue cargándose a los 4 s, no se
imprime: aparece un aviso con «Reintentar» y «Cancelar» (`src/imprimir.js`).

Cambios de composición pendientes de revisión: `borradores/hoja-cetonas-orden_2026-10-13.md`,
`borradores/planes-primera-cara_2026-10-13.md`.
