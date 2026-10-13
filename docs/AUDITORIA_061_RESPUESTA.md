# Respuesta a la auditoría de la 0.61.0 (0.63.0, 13-10-2026)

Auditoría: `Auditoria_detallada_v0.61.0.md` y su brief. Se trabajó sobre la 0.62.0 (que ya añadía
los grupos de parámetros por importancia, los modos de las Tablas 3 y 4 y el material de cada
sistema). Cambios locales, con pruebas; sin publicar.

## Entrega 1 · calculadora

| Hallazgo                    | Reproducido                                                                        | Cambio                                                                                                                                                                                                                               | Prueba                                                      |
| --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| I61-01 entradas             | Sí: basal 20 y rápida vacía daba cifras; `abc`, `-5` y `1e2` se leían como 0 o 100 | `leerCifra`: vacío / válido / inválido, una sola lectura para el campo, el cálculo y los avisos; el 0 escrito vale, el vacío no                                                                                                      | `calculadora.test.ts` (I61-01); `e2e/auditoria-061.spec.ts` |
| I61-09 dominio y redondeo   | Sí: DTD 0,001 daba ratio 450 000                                                   | La ayuda admite DTD de 1 a 400 UI/día (límite de software); los valores se guardan sin redondear; la tasa horaria va con «≈» y la cuenta dice «redondeado»                                                                           | `calculadora.test.ts` (I61-09)                              |
| I61-02 bomba que funcionaba | Sí: sin campo DTD en CamAPS FX y Control-IQ; el peso dejaba de avisarse            | La DTD y el peso se piden si el sistema arranca con ellos, aunque se traslade la programación; la comparación con la Tabla 1 no depende de que se calcule; el objetivo manual se traslada («el de la bomba actual»)                  | unit + e2e                                                  |
| I61-03 límites y propuesta  | Sí: peso 8 kg en CamAPS FX con propuesta                                           | Fuera de la indicación de todas las variantes: aviso arriba y sin propuesta (cifras y «Qué programar» sin valores); dentro de una sola variante (Control-IQ / Control-IQ+): pendiente de confirmar; alcance escrito: solo DTD y peso | unit + e2e                                                  |
| I61-05 alcance              | Sí                                                                                 | Sobre describe la ayuda real (sin atribuirla al Manual SEEN); AGENTS.md actualizado; registro «calculadora» en `materiales.ts` con su revisión pendiente                                                                             | —                                                           |

## Entrega 2 · inicio

| Hallazgo | Cambio                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I61-04   | La ficha dice «Preparar e iniciar» y abre la preparación con el sistema (no el paso 5). La calculadora lleva arriba «El resto del inicio»: preparación, plan de respaldo, activar el automático y calendario                                                                                                                                                     |
| I61-06   | Un solo trabajo en memoria (`src/trabajo-inicio.ts`) para la calculadora, los pasos y la hoja; la pauta previa es la misma en la calculadora y en el paso 1; «Nuevo inicio (vaciar datos)» lo vacía todo; abrir una fuente y volver lo conserva. Lo cambiado a mano (reducción, regla, objetivo) se marca «modificado» y no se pisa al cambiar el control previo |
| I61-07   | Cinco rutas: MDI con o sin ratio y factor propios, bomba con o sin referencia y otro sistema AID (con enlace a comparar los parámetros)                                                                                                                                                                                                                          |
| I61-08   | En el móvil, «Ir al paso» con el título completo                                                                                                                                                                                                                                                                                                                 |
| I61-10   | Los botones del objetivo manual dicen cifra, unidad y contexto (general, preconcepcional/gestación, riesgo elevado de hipoglucemia)                                                                                                                                                                                                                              |

## Entrega 3 · situaciones

| Hallazgo | Cambio                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S61-01   | En ejercicio, «Antes de actuar» (el párrafo literal de la p. 19) va antes de la conducta de cada sistema; al elegir sistema se lleva la vista ahí                            |
| S61-02   | Filtro con alias (TAC/TC, RM, ECG, corticoides, renal, embarazo…); las siglas de hasta 3 letras solo casan como palabra entera; recuento y «Borrar el filtro» sin resultados |
| S61-05   | Cada entrada va en su tema por su id; diálisis, en poblaciones                                                                                                               |
| S61-03   | Guías por momentos (frases literales) para enfermedad intercurrente, glucocorticoides, mayores, diálisis y adolescencia                                                      |
| S61-04   | Grupo «Incidencias del día a día»: hipoglucemia en asa cerrada, bolo omitido, lectura baja por compresión, pérdida de señal y viajes, a su pasaje exacto                     |
| S61-06   | Desde exploraciones y ejercicio, «Interrupción del sistema» y el plan de seguridad del sistema; la Figura 3, desde cualquier duración, con la frase de la p. 9               |

## Entrega 4 · sistemas

| Hallazgo | Cambio                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| M61-01   | Junto al Sí/No de los bolos, su condición (p. ej., «no actúa en modo Sueño»; «sin bolos de corrección diferenciados»)   |
| M61-02   | «Cómo funciona» comparado con «Hacia qué objetivo» (Tabla 1, fila 6)                                                    |
| M61-03   | La nota registrada de Liberty también en las piezas por referencia (guía de CamAPS)                                     |
| M61-04   | En cada sistema, el papel de la tasa basal programada (Tabla 3, celda entera); en «Qué programar», el grupo de arranque |

## Decisiones clínicas que siguen abiertas

1. Revisar el contrato de la calculadora de la 0.63.0 (lectura de entradas, límite 1–400 UI/día, cinco rutas, reglas del 450 y del 1700 sobre la DTD de inicio).
2. Lo del asistente AID que el capítulo no tiene (`borradores/inicio-asistente-aid_2026-10-13.md`).
3. Uso real con profesionales: encontrar el respaldo, elegir paso, interpretar límites, retomar y empezar otro trabajo.

## No hecho, a propósito

- No se cambiaron fórmulas, denominadores ni puntos de partida registrados.
- No se añadieron campos clínicos (edad, gestación) a la calculadora ni un veredicto de aptitud.
- No se generó una colección de PDF impresos de todos los estados del inicio.
