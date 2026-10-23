# Guía de revisión editorial · Manual SEEN · AID 1.0.13

Edición que se revisa: **1.0.13**, publicada el 23-10-2026 en https://manual-seen-aid.pages.dev (el número y la fecha están en «Sobre este complemento» → «Esta versión»). Durante la revisión no se cambia el contenido de esta edición; las correcciones se reúnen y van en una versión siguiente.

## Qué es

Complemento interactivo del capítulo 89 del Manual SEEN («Tratamiento insulínico del paciente con diabetes mellitus tipo 1: automatización de la insulinoterapia»). Sirve para localizar contenido del capítulo, comparar los cuatro sistemas AID comercializados en España y consultar situaciones clínicas, siempre con acceso a la página de origen.

## Tres capas, que conviene revisar por separado

| Capa                        | Qué incluye                                                                                                                                                                                 | Qué se pide                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Texto del capítulo, literal | Lectura del capítulo, Tablas 1–6, Figura 3, pasajes citados en búsquedas y situaciones                                                                                                      | Que corresponda al capítulo publicado (hay un cotejo automático; las correcciones posteriores van señaladas en un recuadro)                  |
| Resumen operativo           | Fichas de cada sistema, comparación por parámetro y vistas adaptadas al sistema elegido (por ejemplo, en una exploración, solo lo de la bomba o lo del pod; los recambios según el formato) | Que cada dato corto conserve las condiciones del capítulo; cada bloque lleva su fuente al pie y el rótulo con el libro abre el texto literal |
| Complementario              | Preguntas frecuentes, autoevaluación, hojas adaptadas para el paciente, notas complementarias (Liberty, Omnipod 5, Tandem en la gestación) y la ayuda de cálculo de inicio                  | Encaje en el Manual y lugar de cada material; la ayuda de cálculo y el material para pacientes necesitan una lectura propia                  |

## Recorrido sugerido (unos 20 minutos)

1. Portada → ficha de un sistema → «Parámetros».
2. «Comparar los parámetros» (en el móvil, la vista «Por parámetro»), y la pestaña «Ajuste práctico» (Tabla 3).
3. Una situación con un sistema elegido (por ejemplo, Resonancia magnética con Omnipod 5).
4. Desde cualquier bloque, la línea «Fuente» o el libro: el texto del capítulo, y «Volver a la consulta».
5. «Iniciación del sistema»: la ayuda de cálculo con datos ficticios y la hoja de comprobación.
6. «Material para el paciente»: el plan de seguridad de un sistema, impreso.

## Lo que sigue pendiente de revisión (registro en `src/materiales.ts`)

- **Ayuda de cálculo:** revisión clínica del contrato de la 0.63.0 (lectura de entradas, límites 1–400 UI/día, rutas de pauta previa y reglas del 450 y del 1700); después, sin revisión propia, la comparación de lo que actúa en automático al cambiar de sistema y los recambios por formato del paso 4.
- **Plan de seguridad:** revisado el 14-10-2026; modificado el 22-10-2026 (recambios, regla de oro y cara de cetonas según el formato del sistema, por decisión del responsable). Falta revisar esa redacción adaptada.
- **Notas complementarias:** hay decisiones de contenido registradas; falta la aprobación registrada del texto que se enseña.
- **«Cómo funciona» de cada sistema, de un vistazo:** nueva disposición de piezas literales, sin revisión registrada.

Las preguntas frecuentes (105) y las hojas adaptadas tienen su aprobación registrada (`src/frecuentes.aprobadas.json`, `docs/FRECUENTES.md`).

## Qué se pide en la valoración

- Encaje como complemento del Manual y alcance de las fichas.
- Lugar de los materiales complementarios y de la ayuda de cálculo.
- Cualquier dato que no coincida con el capítulo (con la pantalla en la que aparece).
- Quién mantiene el complemento cuando cambie el capítulo o un sistema.

La revisión del complemento no supone la aprobación automática de todas sus capas: cada una se valora por separado.
