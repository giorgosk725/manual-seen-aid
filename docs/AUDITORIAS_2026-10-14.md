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
- **Figura 3, sin rama elegida (15-10-2026):** sin el recuadro de urgencia encima del
  selector: lo repetía la tarjeta «≥3,0 o signos de gravedad» (la app es para residentes y
  adjuntos que leen el capítulo).
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
