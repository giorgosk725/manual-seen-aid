# Preguntas frecuentes del buscador

Capa «Pregunta frecuente» (0.13.0): cuando una búsqueda se parece de verdad a una de estas preguntas, la app
enseña primero sus pasajes del capítulo, literales y con su página, elegidos y revisados de antemano; debajo siguen
los pasajes que elige el motor y todos los resultados.

- Datos: `src/frecuentes.ts` (id, tema, pregunta, variantes = otras formas de preguntarlo, pasajes = ids de los
  átomos de `src/respuestas.ts`). Emparejador: `preguntaFrecuente` / `mejorFrecuente` en `src/respuestas.ts`.
- Revisión: las 50 del borrador se aprobaron el 8-10-2026 en la página de revisión
  <https://claude.ai/artifact/Y1gSDm7UhFaYhn2e2fFt4V> (base de datos: colección `frecuentes`, una ficha por id).
- Para cambiar una: editar `src/frecuentes.ts`, pasar la revisión y medir con un banco ciego nuevo.

## Estado en la edición editorial (12-10-2026, A04)

Cada pregunta lleva estado y registro de revisión (`revisionDe` en `src/frecuentes.ts`). Solo las
**aprobadas** salen en la edición: `FRECUENTES` las filtra y todo lo demás (emparejador, página
`#/preguntas`, sugerencias, relacionadas, índice de búsqueda) usa esa lista. `FRECUENTES_TODAS`
conserva las demás.

| Ids      | Estado   | Fecha      | Registro                                                                       |
| -------- | -------- | ---------- | ------------------------------------------------------------------------------ |
| f01–f50  | aprobada | 2026-10-08 | Revisión una a una del autor en la página de revisión (colección «frecuentes») |
| f51–f61  | aprobada | 2026-10-11 | Visto bueno editorial del autor, revisión de la 0.38 (abajo)                   |
| f62–f103 | aprobada | 2026-10-13 | Revisión pregunta por pregunta delegada por el autor (abajo)                   |

**Aprobación ligada al contenido (0.52.0).** Cada aprobación guarda la huella de lo aprobado en
`src/frecuentes.aprobadas.json`: pregunta, variantes, pasajes, sistema, continuación y SHA-256 del
PDF fuente. Si cambia cualquiera, la pregunta vuelve a borrador y sale de la edición hasta una
aprobación nueva: `npm run aprobar:frecuentes -- f12 f37` (o `--todas`), solo tras la revisión.

f11 y f37 vuelven a sus pasajes aprobados del 8-10. Los añadidos del 12-10 (T1/8 en f11 y
t/07-educacion/b6/1 en f37) quedan como borrador para el autor. En la edición salen 61 preguntas.
El tema «Trucos de uso» se renombra «Uso en el día a día» y el rótulo «Por sistema: curiosidades y
trucos», «Preguntas por sistema» (solo afecta a borradores).

### Revisión de f62–f103 (13-10-2026, delegada por el autor)

Revisión pregunta por pregunta, con el criterio de siempre: cada pregunta la contestan sus pasajes,
literales y con su página, sin añadir una regla que el capítulo no da; en las de un sistema, su casilla.
Resultado: las 42 aprobadas. Cambios: f63 limitada a los sistemas híbridos; f69 con el umbral de
aproximadamente 1 h y la pauta individual; f87 añade t/10-situaciones/b9/3 (la estrategia del modo
sueño en CIRCUIT y las recomendaciones de Tandem). Observación sin cambio: f83 y f94 juntan dos
situaciones en una pregunta; las casillas responden a las dos. f11 aplica su propuesta (CamAPS FX y
Liberty primero; filas de indicación y gestación de la Tabla 1). Edad de Liberty: decidida por el autor el
13-10-2026, manda la Tabla 1 («Liberty: > 13 años»); f11 deja fuera la frase del apartado 3 («no se
recomienda en menores de 13 años») y queda con `t/03-algoritmos/b3/1`, `T1/7` y `T1/8`.

### Decisiones del autor del 13-10-2026

- **f37:** se mantienen los pasajes aprobados (condicionantes, cantidades y reevaluación juntos). Se
  descarta poner delante «suele requerir menos hidratos» (t/07-educacion/b6/1): no es una regla universal.
- **f11:** propuesta para revisión en `PROPUESTAS` (src/frecuentes.ts): primero los pasajes de CamAPS
  FX/Liberty y las filas de indicación y gestación de la Tabla 1, con los otros sistemas plegados. Para
  la edad: manda la Tabla 1 («Liberty: > 13 años»), decisión del autor del 13-10-2026. Aplicada en la 0.52.0.
- **f63** (pendiente): la pregunta se limita a los sistemas híbridos y añade t/09-descarga/b2/3 y la nota
  de la Tabla 5 sobre asa cerrada completa.
- **f69** (pendiente): añade el umbral de aproximadamente 1 h sin administración (b11/4), las
  interrupciones muy breves (b11/1) y la pauta de respaldo individualizada (b12/2).
- Las 42 pendientes no se aprueban en bloque: cada una necesita su decisión.

## Cómo se empareja

Con las mismas palabras, raíces, léxico y expresiones que el resto del motor. Responde la pregunta cuyo texto (o
una de sus variantes) cubre al menos el 70 % del peso de la búsqueda y la búsqueda, al menos el 60 % del de la
pregunta. No salta: con una cifra de β-OHB (manda la rama de la Figura 3); cuando la búsqueda nombra un sistema y
ningún pasaje de la pregunta dice algo propio de ese sistema (responde el motor con su casilla); ni cuando la
búsqueda niega lo que la pregunta pide («sin embarazo»).

## Medición

Banco ciego nuevo `src/bancos/ciego5.json` (80 preguntas de residentes, adjuntos y enfermería; 10 sin respuesta en
el capítulo), escrito por otro agente que solo leyó el contenido del capítulo y medido una vez con el motor cerrado:

|                         | Sin preguntas frecuentes | Con ellas |
| ----------------------- | ------------------------ | --------- |
| Pasaje bueno el primero | 55,0 %                   | 57,5 %    |
| Bueno entre los tres    | 66,3 %                   | 67,5 %    |
| Directas equivocadas    | 18,8 %                   | 17,5 %    |

Saltan en 3 de las 80 preguntas, las 3 con pasajes aceptables. En los bancos ya usados (ciego1-4, 590 preguntas)
saltan 45 veces y aciertan 41. Lectura: la capa es fiable cuando salta, pero cubre poco de un banco que recorre
todo el capítulo con formas de preguntar muy variadas; su valor está en las preguntas de verdad frecuentes. Para
que salte más sin perder fiabilidad haría falta reconocer la pregunta por el sentido (embeddings), no solo por
las palabras.

## Las 50 preguntas

| Id  | Tema                          | Pregunta                                                                     | Pasajes                                                                                              |
| --- | ----------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| f01 | Selección e indicación        | ¿Hace falta una HbA1c alta o un umbral concreto para indicar un sistema AID? | `t/06-indicaciones/b2/3` (p. 5); `t/06-indicaciones/b1/1` (p. 5)                                     |
| f02 | Selección e indicación        | ¿A quién priorizar cuando no hay sistemas para todos?                        | `t/06-indicaciones/b2/0` (p. 5); `t/06-indicaciones/b2/1` (p. 5); `t/06-indicaciones/b2/2` (p. 5)    |
| f03 | Selección e indicación        | ¿Hace falta experiencia previa con bomba o sensor para empezar?              | `t/06-indicaciones/b3/0` (p. 5); `t/06-indicaciones/b3/1` (p. 5)                                     |
| f04 | Selección e indicación        | ¿Cuándo hay que tener precaución al indicar un AID?                          | `t/06-indicaciones/b3/2` (p. 5)                                                                      |
| f05 | Sistemas y parámetros         | ¿Qué sistemas AID hay en España?                                             | `t/04-sistemas/b1/0` (p. 3); `t/04-sistemas/b1/2` (p. 3)                                             |
| f06 | Sistemas y parámetros         | ¿Desde qué edad, peso y dosis se puede usar cada sistema?                    | `T1/7` (p. 3)                                                                                        |
| f07 | Sistemas y parámetros         | ¿Qué parámetros influyen en el modo automático de cada sistema?              | `T1/10` (p. 3); `T1/nota/0/0` (p. 3)                                                                 |
| f08 | Sistemas y parámetros         | ¿Qué objetivo de glucosa se puede programar en cada sistema?                 | `T1/6` (p. 3); `T3/0` (p. 11)                                                                        |
| f09 | Sistemas y parámetros         | ¿Qué sistemas hacen autocorrecciones?                                        | `T1/5` (p. 3)                                                                                        |
| f10 | Sistemas y parámetros         | ¿Por qué hay que seguir anunciando las comidas en un sistema híbrido?        | `t/03-algoritmos/b2/0` (p. 3); `t/03-algoritmos/b2/1` (p. 3); `t/03-algoritmos/b2/2` (p. 3)          |
| f11 | Sistemas y parámetros         | ¿Qué es Liberty y quién puede usarlo?                                        | `t/03-algoritmos/b3/1` (p. 3); `T1/7`, `T1/8` (Tabla 1)                                              |
| f12 | Sistemas y parámetros         | ¿Qué sistemas están autorizados en la gestación?                             | `T1/8` (p. 3); `t/10-situaciones/b3/2` (p. 17); `t/10-situaciones/b3/3` (p. 17)                      |
| f13 | Inicio del sistema            | ¿Qué hay que tener listo antes de iniciar el sistema?                        | `T2/0` (p. 10); `l/07-educacion/b4` (p. 7)                                                           |
| f14 | Inicio del sistema            | ¿Cuánto reducir la dosis al pasar de MDI a un sistema AID?                   | `T2/2` (p. 10); `t/08-iniciacion/b7/0` (p. 12)                                                       |
| f15 | Inicio del sistema            | ¿Cómo calcular la ratio y el factor de sensibilidad iniciales?               | `T2/4` (p. 10); `T2/5` (p. 10); `t/08-iniciacion/b6/1` (p. 12)                                       |
| f16 | Inicio del sistema            | ¿Qué basal inicial programar si no hay un patrón previo?                     | `T2/3` (p. 10); `t/08-iniciacion/b8/1` (p. 12)                                                       |
| f17 | Inicio del sistema            | ¿Qué hacer con la glargina U-300 o la degludec al iniciar el sistema?        | `T2/8` (p. 10); `t/08-iniciacion/b7/1` (p. 12)                                                       |
| f18 | Inicio del sistema            | ¿Cada cuánto revisar al paciente tras iniciar el sistema?                    | `t/08-iniciacion/b9/0` (p. 12); `t/08-iniciacion/b9/1` (p. 12)                                       |
| f19 | Educación y plan de seguridad | ¿Qué contenidos debe tener la educación del paciente?                        | `l/07-educacion/b3` (p. 6)                                                                           |
| f20 | Educación y plan de seguridad | ¿Qué debe incluir el plan de seguridad?                                      | `l/07-educacion/b4` (p. 7)                                                                           |
| f21 | Descarga y seguimiento        | ¿Cómo revisar una descarga de forma ordenada?                                | `t/09-descarga/b1/2` (p. 13); `T5/nota/1/2` (p. 13)                                                  |
| f22 | Descarga y seguimiento        | ¿Cuánto uso del sensor hace falta para interpretar la descarga?              | `T5/0` (p. 13)                                                                                       |
| f23 | Descarga y seguimiento        | ¿Qué objetivos de TIR, TBR y TAR hay que buscar?                             | `t/05-resultados/b2/0` (p. 4); `t/05-resultados/b2/1` (p. 4); `t/05-resultados/b2/2` (p. 4)          |
| f24 | Descarga y seguimiento        | ¿Cuánto se pueden cambiar los parámetros de una vez?                         | `t/09-descarga/b2/0` (p. 13); `t/09-descarga/b2/1` (p. 13)                                           |
| f25 | Descarga y seguimiento        | Hay hipoglucemias en la descarga: ¿qué revisar antes de intensificar?        | `t/09-descarga/b10/0` (p. 15); `t/09-descarga/b10/1` (p. 15); `t/05-resultados/b7/1` (p. 5)          |
| f26 | Descarga y seguimiento        | ¿Qué significa un exceso de autocorrecciones?                                | `t/09-descarga/b11/0` (p. 15); `t/09-descarga/b11/1` (p. 15)                                         |
| f27 | Descarga y seguimiento        | El paciente sale a menudo del modo automático: ¿qué hacer?                   | `t/09-descarga/b12/0` (p. 15); `t/09-descarga/b22/1` (p. 16); `T5/0` (p. 13)                         |
| f28 | Descarga y seguimiento        | ¿Qué revisar ante hipoglucemias nocturnas repetidas?                         | `t/09-descarga/b7/0` (p. 14); `t/09-descarga/b7/1` (p. 14)                                           |
| f29 | Descarga y seguimiento        | ¿Qué son los hidratos fantasma y qué hacer si se detectan?                   | `t/09-descarga/b21/0` (p. 16); `t/09-descarga/b21/1` (p. 16); `t/09-descarga/b21/2` (p. 16)          |
| f30 | Descarga y seguimiento        | ¿Cómo manejar un bolo olvidado o retrasado?                                  | `t/09-descarga/b20/1` (p. 16); `t/09-descarga/b20/2` (p. 16)                                         |
| f31 | Incidencias y cetonemia       | ¿Cuándo sospechar un fallo del set de infusión?                              | `t/09-descarga/b16/0` (p. 15); `t/09-descarga/b16/2` (p. 15); `t/09-descarga/b16/4` (p. 15)          |
| f32 | Incidencias y cetonemia       | ¿Qué hacer según la cifra de cetonemia?                                      | `l/09-descarga/b17` (p. 15)                                                                          |
| f33 | Incidencias y cetonemia       | ¿Qué dosis de insulina con pluma si no hay un plan específico?               | `t/09-descarga/b19/0` (p. 15); `F3/naranja` (p. 8); `F3/nota` (p. 8)                                 |
| f34 | Incidencias y cetonemia       | ¿El sistema cuenta la insulina puesta con pluma?                             | `F3/pie/0` (p. 8); `t/09-descarga/b19/2` (p. 15)                                                     |
| f35 | Incidencias y cetonemia       | ¿Cuándo hay que ir a urgencias por cetonas?                                  | `F3/rojo` (p. 8)                                                                                     |
| f36 | Incidencias y cetonemia       | ¿Qué vigilar en una persona tratada con iSGLT2?                              | `t/09-descarga/b16/1` (p. 15); `F3/pie/1` (p. 8)                                                     |
| f37 | Incidencias y cetonemia       | ¿Cuántos hidratos dar en una hipoglucemia leve con un sistema AID?           | `t/07-educacion/b7/0` (p. 8); `t/07-educacion/b7/1` (p. 8)                                           |
| f38 | Interrupción del sistema      | ¿Cuánto tiempo puede estar desconectado el sistema?                          | `t/07-educacion/b11/4` (p. 9); `t/07-educacion/b11/1` (p. 9)                                         |
| f39 | Interrupción del sistema      | ¿Qué dosis basal poner en la pauta alternativa con plumas?                   | `t/07-educacion/b13/0` (p. 9); `t/07-educacion/b13/1` (p. 9)                                         |
| f40 | Incidencias y cetonemia       | ¿Qué pasa con las lecturas bajas al dormir sobre el sensor?                  | `t/09-descarga/b23/0` (p. 16); `t/09-descarga/b23/1` (p. 16)                                         |
| f41 | Situaciones especiales        | ¿Cómo preparar el ejercicio con un sistema AID?                              | `t/10-situaciones/b20/1` (p. 19); `t/10-situaciones/b22/0` (p. 19); `t/10-situaciones/b22/1` (p. 19) |
| f42 | Situaciones especiales        | ¿Se puede hacer ejercicio con la glucosa alta?                               | `t/10-situaciones/b20/2` (p. 19); `t/10-situaciones/b20/3` (p. 19)                                   |
| f43 | Situaciones especiales        | ¿Qué hacer con la bomba o el sensor en una resonancia o un TC?               | `T6/0` (p. 21); `T6/1` (p. 21); `t/10-situaciones/b41/2` (p. 21)                                     |
| f44 | Situaciones especiales        | ¿Se puede mantener el sistema en una cirugía?                                | `T6/6` (p. 21); `T6/7` (p. 21)                                                                       |
| f45 | Situaciones especiales        | ¿Se puede mantener el sistema durante un ingreso?                            | `t/10-situaciones/b34/0` (p. 20); `t/10-situaciones/b34/3` (p. 20); `t/10-situaciones/b36/0` (p. 20) |
| f46 | Situaciones especiales        | ¿Qué objetivos glucémicos hay en la gestación?                               | `t/10-situaciones/b4/1` (p. 17); `t/10-situaciones/b4/2` (p. 17); `t/10-situaciones/b4/3` (p. 17)    |
| f47 | Situaciones especiales        | Con cetosis y glucemia normal en una enfermedad, ¿se suspende la insulina?   | `t/10-situaciones/b27/2` (p. 20); `t/10-situaciones/b27/1` (p. 20)                                   |
| f48 | Situaciones especiales        | ¿Qué hacer si un paciente usa un sistema DIY?                                | `t/11-diy/b3/0` (p. 22); `t/11-diy/b3/1` (p. 22)                                                     |
| f49 | Situaciones especiales        | ¿Qué recomendar sobre el alcohol con un sistema AID?                         | `t/10-situaciones/b14/2` (p. 18)                                                                     |
| f50 | Situaciones especiales        | ¿Se puede mantener el sistema con glucocorticoides?                          | `t/10-situaciones/b29/0` (p. 20); `t/10-situaciones/b29/1` (p. 20); `t/10-situaciones/b29/2` (p. 20) |

## Las once añadidas en 2026-10 (f51–f61), estado actual

Salen de las consultas sin pregunta frecuente de las pruebas simuladas (f51–f60) y de la revisión de la 0.34 (f61).
Pregunta y variantes son texto de la app; los pasajes, literales. Títulos y pasajes ajustados el 11-10-2026 tras la
revisión de la 0.37 (f54, f55, f56 acotada a la pluma, f58, f59 sin pasaje repetido, f61 con el bolo extendido y la
columna de Tandem primero; f51 y f60 con una continuación).

| Id  | Tema                          | Pregunta                                                                         | Pasajes                                                                      |
| --- | ----------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| f51 | Educación y plan de seguridad | ¿Qué hacer si la bomba falla o se queda sin insulina?                            | `t/07-educacion/b11/0`; `t/07-educacion/b11/4`; `t/07-educacion/b13/0`       |
| f52 | Educación y plan de seguridad | ¿Cuándo confirmar la glucosa con glucemia capilar?                               | `t/02-componentes/b4/1`; `t/10-situaciones/b38/2`                            |
| f53 | Incidencias y cetonemia       | El sensor pierde la señal: ¿qué hacer?                                           | `t/09-descarga/b22/0`; `t/09-descarga/b22/1`; `t/02-componentes/b4/2`        |
| f54 | Incidencias y cetonemia       | ¿Qué revisar ante irritación de la piel por sensores o sistemas de infusión?     | `t/09-descarga/b24/2`; `t/09-descarga/b24/1`; `t/09-descarga/b24/4`          |
| f55 | Incidencias y cetonemia       | ¿Qué revisar ante fallos repetidos de infusión?                                  | `t/09-descarga/b25/0`; `t/09-descarga/b25/1`                                 |
| f56 | Incidencias y cetonemia       | Tras una corrección con pluma, ¿qué precauciones hay antes de volver a corregir? | `F3/pie/0`; `l/09-descarga/b28/0`                                            |
| f57 | Descarga y seguimiento        | ¿Cómo manejar una comida rica en grasa o proteína?                               | `T4/5`; `t/09-descarga/b6/0`; `t/09-descarga/b6/1`; `t/09-descarga/b6/2`     |
| f58 | Situaciones especiales        | ¿Qué precauciones tomar con el sistema en el control del aeropuerto?             | `t/10-situaciones/b43/0`                                                     |
| f59 | Incidencias y cetonemia       | Demasiadas alarmas: ¿qué hacer con la fatiga por alarmas?                        | `t/09-descarga/b26/1`                                                        |
| f60 | Situaciones especiales        | ¿Qué hacer ante una enfermedad intercurrente (gripe, fiebre)?                    | `t/10-situaciones/b27/0`; `t/10-situaciones/b27/1`; `t/10-situaciones/b27/3` |
| f61 | Sistemas y parámetros         | ¿Qué diferencia hay entre Control-IQ y Control-IQ+?                              | `T1/7`; `T1/8`; `T3/1`; `T4/5`; `t/09-descarga/b6/1`; `t/04-sistemas/b4/1`   |

### Estado de revisión

- **Comprobación técnica** (Claude, 11-10-2026): cada pasaje existe, cada pregunta encuentra su ficha y sus variantes la
  encuentran (pruebas unitarias). Hecha para las once.
- **Aprobación editorial** (autor): visto bueno editorial a la correspondencia pregunta–pasajes dado el 11-10-2026 para
  las once (revisión de la 0.38). Cualquier cambio posterior de título o pasajes vuelve a pasar por aquí.

## Revisión de la 0.48.0 (12-10-2026)

**Revisión de las 61 anteriores.** Todos los pasajes existen y responden a su pregunta. Cambios: f11 (Liberty) pasa al tema «myLoop CamAPS» y añade la fila de gestación de la Tabla 1; f61 (Control-IQ frente a Control-IQ+) pasa a «Tandem Control-IQ»; f37 (hipoglucemia leve) añade delante la primera regla operativa del plan de seguridad (p. 8).

**Nuevas (f62-f103), pendientes de la revisión del autor.** Preguntas de la app; respuestas, texto literal del capítulo con su página. Las de un sistema llevan su casilla delante y solo responden cuando la búsqueda nombra ese sistema o algo exclusivo de él (Boost, Liberty, el pod…).

| id   | Tema                   | Pregunta                                                                          | Pasajes                                                                                        |
| ---- | ---------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| f62  | Trucos de uso          | En el ejercicio, ¿se anuncian al sistema los hidratos para evitar la bajada?      | t/10-situaciones/b22/2, t/10-situaciones/b22/3, t/10-situaciones/b22/4                         |
| f63  | Trucos de uso          | ¿Cuándo hay que poner el bolo de la comida?                                       | l/07-educacion/b3/3, t/09-descarga/b5/1                                                        |
| f64  | Trucos de uso          | La glucosa sube en la primera hora después de comer: ¿qué revisar?                | t/09-descarga/b5/0, t/09-descarga/b5/1                                                         |
| f65  | Trucos de uso          | Glucosa alta al despertar: ¿qué revisar?                                          | t/09-descarga/b8/0, t/09-descarga/b8/1                                                         |
| f66  | Trucos de uso          | El TIR está bien pero la glucosa oscila mucho: ¿qué mirar?                        | t/09-descarga/b9/0, t/09-descarga/b9/1                                                         |
| f67  | Trucos de uso          | Ejercicio de fuerza o muy intenso: ¿se sube el objetivo?                          | T4/1, t/10-situaciones/b23/1                                                                   |
| f68  | Trucos de uso          | Después del ejercicio, ¿hasta cuándo mantener el objetivo alto?                   | t/10-situaciones/b25/0, t/10-situaciones/b25/1                                                 |
| f69  | Trucos de uso          | Desconexión breve (ducha, deporte, una prueba): ¿qué hacer con la insulina?       | t/07-educacion/b11/2, t/07-educacion/b11/3, t/07-educacion/b12/1, t/07-educacion/b12/3         |
| f70  | Trucos de uso          | Tras una resonancia con el sensor puesto, ¿son fiables las lecturas?              | t/10-situaciones/b42/0, t/10-situaciones/b42/1                                                 |
| f71  | Trucos de uso          | ¿Qué errores conviene evitar al revisar una descarga?                             | l/09-descarga/b28/0, l/09-descarga/b28/1, l/09-descarga/b28/2                                  |
| f72  | Situaciones especiales | Persona mayor con deterioro cognitivo: ¿qué tener en cuenta?                      | t/10-situaciones/b17/1, t/10-situaciones/b17/3, t/10-situaciones/b17/4                         |
| f73  | Situaciones especiales | En diálisis, ¿se puede mantener el sistema?                                       | t/10-situaciones/b31/1, t/10-situaciones/b31/2, t/10-situaciones/b31/3, t/10-situaciones/b31/5 |
| f74  | Situaciones especiales | Adolescente: ¿cómo plantear el seguimiento remoto de los padres?                  | t/10-situaciones/b15/0, t/10-situaciones/b15/1                                                 |
| f75  | Descarga y seguimiento | ¿Cuándo reconsiderar el tratamiento con asa cerrada?                              | t/08-iniciacion/b12/2, t/08-iniciacion/b12/3                                                   |
| f76  | Descarga y seguimiento | Con buen control, ¿cada cuánto revisar?                                           | t/08-iniciacion/b11/0, t/08-iniciacion/b11/2                                                   |
| f77  | MiniMed 780G           | MiniMed 780G: ¿cómo decide y cómo se adapta?                                      | T1/3, T1/4                                                                                     |
| f78  | MiniMed 780G           | MiniMed 780G: ¿qué objetivo poner y para qué sirve el objetivo temporal?          | T1/6, T3/0, T4/0                                                                               |
| f79  | MiniMed 780G           | MiniMed 780G: ¿qué ajustes mueven de verdad el modo automático?                   | T1/10, T3/4, T3/1, T3/3                                                                        |
| f80  | MiniMed 780G           | MiniMed 780G: muchas autocorrecciones, ¿es buena señal?                           | T1/5, t/09-descarga/b11/0, t/09-descarga/b11/1                                                 |
| f81  | MiniMed 780G           | MiniMed 780G en la gestación: ¿qué limitación tiene?                              | T1/8, t/10-situaciones/b8/0, t/10-situaciones/b8/1                                             |
| f82  | MiniMed 780G           | MiniMed 780G: ¿cómo se inicia el modo automático?                                 | T2/1                                                                                           |
| f83  | MiniMed 780G           | MiniMed 780G: ¿qué hacer ante enfermedad leve o una comida grasa?                 | T4/3, T4/5                                                                                     |
| f84  | Tandem Control-IQ      | Control-IQ: ¿por qué hay que afinar la basal y el factor de sensibilidad?         | T1/3, T3/1, T3/3                                                                               |
| f85  | Tandem Control-IQ      | Control-IQ: ¿cómo usar los modos sueño y ejercicio?                               | T1/6, T4/2, T4/0                                                                               |
| f86  | Tandem Control-IQ      | Control-IQ: ¿cuándo pone bolos automáticos de corrección?                         | T1/5                                                                                           |
| f87  | Tandem Control-IQ      | Control-IQ+ en la gestación: ¿cómo se intensifica?                                | t/10-situaciones/b9/0, t/10-situaciones/b9/1, t/10-situaciones/b9/2, t/10-situaciones/b9/4     |
| f88  | Tandem Control-IQ      | Control-IQ: ¿cómo se inicia el modo automático?                                   | T2/1                                                                                           |
| f89  | Tandem Control-IQ      | Control-IQ: ¿qué hacer ante enfermedad leve o una hiperglucemia puntual?          | T4/3, T4/4                                                                                     |
| f90  | myLoop CamAPS          | CamAPS FX: ¿dónde está el algoritmo y cómo se adapta?                             | T1/2, T1/3, T1/1                                                                               |
| f91  | myLoop CamAPS          | CamAPS FX: ¿para qué sirven Boost y Ease-off?                                     | T3/0, t/10-situaciones/b7/1, T4/3                                                              |
| f92  | myLoop CamAPS          | CamAPS FX: ¿cuentan el factor de sensibilidad y la insulina activa en automático? | t/10-situaciones/b7/0, T3/3, T3/4                                                              |
| f93  | myLoop CamAPS          | CamAPS FX en la gestación: ¿qué objetivo poner?                                   | T1/8, t/10-situaciones/b6/2, t/10-situaciones/b6/3, t/10-situaciones/b6/4                      |
| f94  | myLoop CamAPS          | CamAPS FX: ¿qué hacer con una comida grasa o un ejercicio intenso?                | T4/5, T4/1                                                                                     |
| f95  | myLoop CamAPS          | CamAPS FX: ¿cómo se inicia el modo automático?                                    | T2/1                                                                                           |
| f96  | Omnipod 5              | Omnipod 5: ¿qué es la basal adaptativa y por qué cambia con cada pod?             | T1/3, T1/4, T3/2                                                                               |
| f97  | Omnipod 5              | Omnipod 5: ¿para qué sirve la basal programada?                                   | T3/1, T2/1                                                                                     |
| f98  | Omnipod 5              | Omnipod 5: ¿hace autocorrecciones?                                                | T1/5, T3/3                                                                                     |
| f99  | Omnipod 5              | Omnipod 5: ¿cuándo usar la Función Actividad?                                     | T3/0, T4/0                                                                                     |
| f100 | Omnipod 5              | Omnipod 5: ¿se puede nadar con el pod?                                            | t/10-situaciones/b24/1, t/10-situaciones/b24/2                                                 |
| f101 | Omnipod 5              | Omnipod 5: ¿qué hacer si el pod se despega o falla?                               | t/07-educacion/b11/1, t/07-educacion/b11/4                                                     |
| f102 | Omnipod 5              | Omnipod 5: ¿se puede usar en la gestación?                                        | T1/8, t/10-situaciones/b3/3                                                                    |
| f103 | Omnipod 5              | Omnipod 5: ¿qué hacer con una comida grasa?                                       | T4/5                                                                                           |

### Revisión del 22-10-2026 (0.99.0)

Decisión del autor en la sesión del 22-10-2026 sobre la propuesta de la 17.ª ronda de auditorías
(R3, P3), registrada con `npm run aprobar:frecuentes` (src/frecuentes.aprobadas.json):

- **f83** (MiniMed 780G): solo la enfermedad leve («¿qué hacer ante una enfermedad leve?»,
  T4/3). Antes juntaba enfermedad leve y comida grasa y esta se quedaba en «sin función
  específica».
- **f104** (nueva, MiniMed 780G): «¿qué hacer con una comida grasa?»: T4/5 y el apartado 9
  (b6, frases 0 y 2: ascenso a las 3–5 h; individualizar), los mismos pasajes que la ficha.
- **f103** (Omnipod 5): añade esos dos pasajes del apartado 9.

Solo pasajes literales que ya estaban en la app; ningún texto nuevo.

### Revisión del 22-10-2026 (1.0.1)

Decisión del autor en la sesión del 22-10-2026 («sí, separa f94»), como f83/f104 en la 0.99.0:

- **f94** (CamAPS FX): solo el ejercicio intenso («¿qué hacer con un ejercicio intenso?», T4/1).
- **f105** (nueva, CamAPS FX): «¿qué hacer con una comida grasa?»: T4/5 y el apartado 9 (b6, frases
  0 y 1), los mismos pasajes que la ficha de CamAPS FX.

Solo pasajes literales que ya estaban en la app; ningún texto nuevo.
