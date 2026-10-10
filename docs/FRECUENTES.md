# Preguntas frecuentes del buscador

Capa «Pregunta frecuente» (0.13.0): cuando una búsqueda se parece de verdad a una de estas preguntas, la app
enseña primero sus pasajes del capítulo, literales y con su página, elegidos y revisados de antemano; debajo siguen
los pasajes que elige el motor y todos los resultados.

- Datos: `src/frecuentes.ts` (id, tema, pregunta, variantes = otras formas de preguntarlo, pasajes = ids de los
  átomos de `src/respuestas.ts`). Emparejador: `preguntaFrecuente` / `mejorFrecuente` en `src/respuestas.ts`.
- Revisión: las 50 del borrador se aprobaron el 8-10-2026 en la página de revisión
  <https://claude.ai/artifact/Y1gSDm7UhFaYhn2e2fFt4V> (base de datos: colección `frecuentes`, una ficha por id).
- Para cambiar una: editar `src/frecuentes.ts`, pasar la revisión y medir con un banco ciego nuevo.

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
| f11 | Sistemas y parámetros         | ¿Qué es Liberty y quién puede usarlo?                                        | `t/03-algoritmos/b3/1` (p. 3); `t/03-algoritmos/b3/2` (p. 3)                                         |
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

## Diez más (0.31.0, 10-10-2026)

Salen de las consultas sin pregunta frecuente de las dos pruebas simuladas (`docs/PRUEBA_SIMULADA_2026-10-10.md`).
Pregunta y variantes son texto de la app; los pasajes, literales. Pendientes de la revisión del autor como las 50
primeras.

| Id  | Tema                          | Pregunta                                                      | Pasajes                                                                      |
| --- | ----------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| f51 | Educación y plan de seguridad | ¿Qué hacer si la bomba falla o se queda sin insulina?         | `t/07-educacion/b11/0`; `t/07-educacion/b11/4`; `t/07-educacion/b13/0`       |
| f52 | Educación y plan de seguridad | ¿Cuándo confirmar la glucosa con glucemia capilar?            | `t/02-componentes/b4/1`; `t/10-situaciones/b38/2`                            |
| f53 | Incidencias y cetonemia       | El sensor pierde la señal: ¿qué hacer?                        | `t/09-descarga/b22/0`; `t/09-descarga/b22/1`; `t/02-componentes/b4/2`        |
| f54 | Incidencias y cetonemia       | ¿Qué hacer si el adhesivo se despega o irrita la piel?        | `t/09-descarga/b24/2`; `t/09-descarga/b24/1`; `t/09-descarga/b24/4`          |
| f55 | Incidencias y cetonemia       | Fallos de infusión repetidos: ¿qué revisar y qué cánula usar? | `t/09-descarga/b25/0`; `t/09-descarga/b25/1`                                 |
| f56 | Incidencias y cetonemia       | ¿Cuánto esperar antes de volver a corregir?                   | `F3/pie/0`; `l/09-descarga/b28/0`                                            |
| f57 | Descarga y seguimiento        | ¿Cómo manejar una comida rica en grasa o proteína?            | `T4/5`; `t/09-descarga/b6/0`; `t/09-descarga/b6/1`; `t/09-descarga/b6/2`     |
| f58 | Situaciones especiales        | ¿Qué hacer en un viaje o en el control del aeropuerto?        | `t/10-situaciones/b43/0`; `l/07-educacion/b3/4`                              |
| f59 | Incidencias y cetonemia       | Demasiadas alarmas: ¿qué hacer con la fatiga por alarmas?     | `t/09-descarga/b26/0`; `t/09-descarga/b26/1`                                 |
| f60 | Situaciones especiales        | ¿Qué hacer ante una enfermedad intercurrente (gripe, fiebre)? | `t/10-situaciones/b27/0`; `t/10-situaciones/b27/1`; `t/10-situaciones/b27/3` |
