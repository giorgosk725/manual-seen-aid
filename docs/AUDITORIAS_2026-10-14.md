# Auditorías de uso de la 0.72.0 (14-15 de octubre de 2026)

Encargo del responsable (14-10-2026, noche): «una app más operativa, tarjetas más visuales»;
auditorías de usuarios y mejoras sucesivas. Sin publicar: todo en commits locales sobre `main`.

## Método

Auditorías simuladas por personas, con Playwright contra el servidor de desarrollo (capturas,
PDF de impresión, medidas de altura y de toques). Cada ronda se hizo sobre lo cambiado en la
anterior. Las propuestas respetan las reglas del proyecto: texto clínico literal, material
aprobado sin cambios de texto, sin frases de entrada ni avisos, fuente al pie, tono neutro, sin
librerías nuevas y dentro del presupuesto de tamaño.

| Persona                                  | Ronda 1 | Ronda 2                                                                  | Final       |
| ---------------------------------------- | ------- | ------------------------------------------------------------------------ | ----------- |
| Residente de guardia, móvil              | 6,2     | 6,6                                                                      | (pendiente) |
| Adjunto en consulta, ordenador           | 6,6     | 7,7                                                                      | (pendiente) |
| Enfermera educadora y R1, tablet y móvil | 6,9     | 7,0                                                                      | (pendiente) |
| Diseño visual                            | 7,0     | 7,6                                                                      | (pendiente) |
| Médico de urgencias no experto, móvil    | —       | 6,0                                                                      | (pendiente) |
| Accesibilidad (WCAG 2.2 AA)              | —       | 0 infracciones de axe en 100 pasadas; 7 fallos que axe no ve, corregidos | —           |

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
8. **Siglas pulsables en las pantallas de consulta** (hoy solo en la lectura del capítulo).
