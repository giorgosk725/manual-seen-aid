# Auditorías de uso de la 0.72.0 (14-15 de octubre de 2026)

Encargo del responsable (14-10-2026, noche): «una app más operativa, tarjetas más visuales»;
auditorías de usuarios y mejoras sucesivas. Sin publicar: todo en commits locales sobre `main`.

## Método

Auditorías simuladas por personas, con Playwright contra el servidor de desarrollo (capturas,
PDF de impresión, medidas de altura y de toques). Cada ronda se hizo sobre lo cambiado en la
anterior. Las propuestas respetan las reglas del proyecto: texto clínico literal, material
aprobado sin cambios de texto, sin frases de entrada ni avisos, fuente al pie, tono neutro, sin
librerías nuevas y dentro del presupuesto de tamaño.

| Persona                                  | Ronda 1 | Ronda 2                                                                  | Final |
| ---------------------------------------- | ------- | ------------------------------------------------------------------------ | ----- |
| Residente de guardia, móvil              | 6,2     | 6,6                                                                      | 7,3   |
| Adjunto en consulta, ordenador           | 6,6     | 7,7                                                                      | 8,0   |
| Enfermera educadora y R1, tablet y móvil | 6,9     | 7,0                                                                      | 7,2   |
| Diseño visual                            | 7,0     | 7,6                                                                      | 7,9   |
| Médico de urgencias no experto, móvil    | —       | 6,0                                                                      | 7,5   |
| Accesibilidad (WCAG 2.2 AA)              | —       | 0 infracciones de axe en 100 pasadas; 7 fallos que axe no ve, corregidos | —     |

## Lo aplicado

El detalle, en el registro de cambios de la app (`src/contenido/cambios.ts`, entrada 0.72.0) y en
los commits. En resumen: urgencias en tarjetas de color en la portada; Figura 3 con la cifra del
tramo en grande y la escala; Interrupción en tarjetas por caso; Hipoglucemia con las cantidades
primero; cifras con unidad en negrita en las pantallas de consulta; calculadora a dos columnas en
el ordenador y con barra fija de cifras en el móvil, «Calcular · Fases · Hoja» y la hoja con los
valores de partida; descarga con los ocho pasos a la vista; ficha de sistema sin cajas anidadas,
con las insignias de efecto directo en la Tabla 3 y la nota de corrección plegada; comparación
acumulando casillas; situaciones con color por tema e incidencias del apartado 9; gestación e
ingreso más operativos; búsqueda que abre la herramienta de la urgencia nombrada y que ya no
confunde lo que se está escribiendo con un seguimiento; tablet con barra inferior; accesibilidad
(foco no tapado, anillo con contraste, anuncios de un solo resumen, foco tras elegir).

Pruebas: 235 unitarias y 203 e2e (con `e2e/auditorias-072.spec.ts`, `src/cifras.test.tsx` y
`src/seguimiento.test.ts` nuevas).

## Decidido por el responsable (15-10-2026) y aplicado

- **Figura 3 (A01 revisada):** en las ramas que no son la roja, el recuadro de urgencia va después
  de los pasos de la rama (sigue junto a ella); la nota de las dosis con asterisco, antes.
- **Figura 3, recuadro de urgencia (15-10-2026, 0.72.1):** fuera encima del selector, junto a
  las ramas que no son la roja, junto a los pasajes de la figura en la búsqueda y con una cifra de
  cetonas: lo repetía la tarjeta «≥3,0 o signos de gravedad», a un toque (la app es para
  residentes y adjuntos que leen el capítulo). Se queda en el plan de seguridad del paciente.
- **Ejercicio (S61-01 revisada):** «Antes de actuar» sigue antes de la conducta, plegado con su
  título a la vista.
- **Preguntas frecuentes:** variantes «el sensor falla» (f53), «le quito la bomba» (f38) y «le
  quito la bomba en el hospital» (f45), registradas como revisión del 15-10-2026 en
  `src/frecuentes.aprobadas.json`.

## Pendiente de decisión del autor

1. **Plan de seguridad en 3 caras.** Hoy, al imprimir, la hoja de cetonas empieza en su propia
   cara (antes se partía), pero el plan ocupa 4 caras porque «qué función usar» no cabe en la
   primera a 12 pt. Propuesta: poner «qué función usar» después de la hoja de cetonas (cabe en la
   mitad libre de la última cara) → 3 caras. Cambia el orden de un material aprobado.
2. **Figura 3, ramas amarilla y naranja.** El recuadro de urgencia (≥ 3,0 o signos de gravedad)
   va antes de los pasos de la rama; varias personas proponen ponerlo después, junto a la rama
   (decisión A01).
3. **Búsqueda con una cifra de β-OHB.** Ahora salen la urgencia y, debajo, los cuatro tramos sin
   marcar ninguno. ¿Los tramos antes de la urgencia? (A01).
4. **Variantes de preguntas frecuentes** para «¿qué hago si el sensor falla?» (f53) y «¿le quito
   la bomba?». Requieren nueva aprobación.
5. **Ejercicio.** «Antes de actuar» ocupa la primera pantalla y la conducta queda debajo
   (decisión S61-01: las comprobaciones antes de la conducta).
6. **Hipoglucemia grave.** El capítulo apenas la trata; la app solo puede enlazar lo que hay.
7. **«Comparar los cuatro» desde la portada en el móvil**: lleva a la tabla entera (muy larga).
8. **Siglas pulsables en el resto de pantallas de consulta**: ya lo son en la lectura, en Iniciar y
   (desde esta versión) en las guías de situaciones; faltan Figura 3, Interrupción y las tarjetas.
9. **Ejercicio con el sistema en la ruta** («modo actividad» con 780G): no baja a la tarjeta de
   ese sistema, para no saltarse «Antes de actuar» (S61-01).

10. **«¿Qué es el modo automático?»** devuelve primero una fila de la Tabla 2; la definición está
    en el apartado 2 (p. 2). Tocar el motor pide medirlo antes con un banco ciego nuevo (el 11 ya
    se usó dos veces).

La nota de urgencias de la ronda final es la de las tres tareas repetidas; con las siete de su
ronda queda en 6,5. Lo que más resta ya es de decisión del autor (puntos 1, 2, 4 y 5).

## Revisión editorial contra lo divulgativo (15-10-2026, 0.72.2)

Aplicado: ver la entrada 0.72.2 de «Qué ha cambiado». Queda para el autor (toca material
aprobado o una decisión suya):

1. **Diagramas aprobados que repiten pantallas de consulta**: «Hospital: criterios para no
   continuar» (repite Ingreso), «Algoritmos de control de los cuatro sistemas» (repite Sistemas ›
   Resumen y Cómo funciona) y «Escala de cetonemia» (repite la Figura 3). ¿Retirarlos a
   `diagramasRetirados.ts` o que la galería lleve a la pantalla de consulta?
2. **Nota de Liberty** en cuatro sitios (ficha, Tabla 1, Iniciación, lectura del apartado 3; en la
   lectura choca con la regla 26). ¿Solo junto a la casilla de la Tabla 1, plegada?
3. **«Cómo interpretar este hallazgo»** (6 entradas, aprobadas el 11-10): texto de la app que
   vuelve a explicar las tablas, en tono docente. ¿Retirarlo de esta edición?
4. **Títulos de preguntas frecuentes coloquiales** (f-ids en `frecuentes.ts`: «muchas
   autocorrecciones, ¿es buena señal?», «¿qué ajustes mueven de verdad…?», «Demasiadas
   alarmas…», «¿Por qué hay que seguir anunciando…?», «¿Qué sistemas AID hay en España?»).
   Cambiarlos invalida su aprobación: hace falta revisarlos y volver a aprobarlos.
5. **Subtítulo de la portada** («Complemento interactivo del capítulo. Facilita su lectura,
   comprensión y consulta.»), de la edición editorial (0.49–0.51). ¿Quitarlo?
6. **Barra «Bandera roja» en Interpretación de la descarga** (A09): repite el paso 8.
7. **Hipoglucemia**: las dos cantidades en tarjeta y, debajo, la frase literal que las contiene.
   No se pliega: la frase trae las condiciones («cuando el algoritmo ya ha reducido o suspendido
   la infusión…») sin las que la cantidad no vale.
8. **Cómo funciona de cada sistema**: el fragmento con puntos suspensivos del apartado 4 bajo la
   cabecera hace de entradilla (pendiente de revisión en `materiales.ts`).

### Resuelto el 15-10-2026 (delegación del responsable: «haz todo lo que consideres para mejorar a esa dirección»)

- 1: diagramas de algoritmos, escala de cetonemia y hospital retirados (`src/diagramasRetirados.ts`).
- 2: nota de Liberty solo junto a la casilla de indicación de la Tabla 1, plegada.
- 3: «Cómo interpretar este hallazgo» fuera de esta edición (`CON_INTERPRETACIONES` en `src/edicion.ts`).
- 4: f05, f10, f59, f79 y f80 con título de manual; el anterior, como variante; revisión registrada.
- 5: portada sin subtítulo y rehecha como panel de consulta.
- 6: la barra de la bandera roja no se repite en el paso 8 (se mantiene en los demás, A09).
- 7: hipoglucemia sin cambios (la frase trae las condiciones de la cantidad).
- 8: sigue pendiente (fragmento de «Cómo funciona» de cada sistema, `materiales.ts`).
