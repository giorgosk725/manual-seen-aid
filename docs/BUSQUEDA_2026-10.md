# Búsqueda · calibración de la 0.53.0 (13-10-2026)

## Qué se quería mejorar

En la 0.52.0 el buscador acertaba a la primera entre el 43 % y el 74 % según el banco, pero
presentaba como «la respuesta» una que no lo era entre el 16 % y el 24 % de las veces. Lo segundo
es lo que más daño hace: el usuario confía en una respuesta directa equivocada.

## Método

1. **Banco nuevo y ciego.** Otro agente, sin ver el motor ni los bancos anteriores, escribió
   `src/bancos/ciego7.json`: 120 preguntas (45 de residente, 30 de adjunto, 30 de enfermería y 15
   de guardia), 15 sin respuesta en el capítulo, con 137 fragmentos literales comprobados. Se
   congeló en un commit propio (52c0a95) antes de tocar el motor y se midió una vez al principio y
   otra al final. No se usó para afinar.
2. **Diagnóstico en los bancos 1-6** (770 preguntas): de los 288 fallos a la primera fuera de las
   preguntas frecuentes, 119 tenían la buena entre los candidatos directos y 90 entre los flojos.
3. **Reordenación probada y descartada.** Una combinación lineal de rasgos (puntuación,
   cobertura, título, tipo, longitud) ajustada en los bancos 1-6 no generalizó con validación
   cruzada (+0 y +2 aciertos en la mitad no vista). No se aplicó.
4. **Calibración aplicada.** Qué se presenta como «la respuesta» y qué como «lo más cercano»:
   directa solo si casa al menos dos tercios de las palabras útiles, puntúa ≥ 4 y saca ≥ 1,5 a la
   siguiente de otro bloque; o si casa todas, alguna en el título, puntúa ≥ 8 y saca ≥ 0,5; o si es
   la entrada de la Figura 3 ante una cifra de β-OHB (A01). Con validación cruzada (entrenar en
   1-3-5, medir en 2-4-6 y al revés), las directas equivocadas bajaron de 72 a 23 y de 97 a 25.
   El orden de los resultados no cambia.
5. **Léxico.** Nombres comerciales y palabras de la calle que el capítulo dice de otra manera
   (Jardiance → iSGLT2, bisturí → electrocirugía, rugby → contacto, chorritos → microbolos…).
6. **Pantalla.** Si no es directa, se dice por qué: «Coincidencia parcial» (cubre parte de la
   búsqueda) o «Pasajes posibles» (varios responden casi igual de bien).

## Resultado

| Banco                       | 0.52.0: primera / tres / directas equivocadas | 0.53.0                |
| --------------------------- | --------------------------------------------- | --------------------- |
| Ciego 1 (240)               | 74,2 / 87,9 / 22,1                            | 75,0 / 88,8 / 8,8     |
| Ciego 2 (150)               | 50,0 / 56,0 / 24,0                            | 52,7 / 58,7 / 9,3     |
| Ciego 3 (120)               | 43,3 / 55,0 / 18,3                            | 48,3 / 60,8 / 3,3     |
| Ciego 4 (80)                | 57,5 / 72,5 / 20,0                            | 62,5 / 77,5 / 5,0     |
| Ciego 5 (80)                | 60,0 / 70,0 / 16,3                            | 62,5 / 71,3 / 10,0    |
| Ciego 6 (100)               | 64,0 / 75,0 / 17,0                            | 65,0 / 76,0 / 6,0     |
| **Ciego 7 (120, no visto)** | **67,5 / 77,5 / 21,7**                        | **68,3 / 78,3 / 5,8** |

En el ciego 7, las respuestas presentadas como directas pasan del 75,8 % de las preguntas (con
precisión del 68,1 %) al 48,3 % (con precisión del 84,5 %). Es el precio: menos respuestas
«seguras», pero mucho más fiables; las demás siguen en el mismo sitio, rotuladas.

## Límites

- El acierto a la primera apenas cambia: lo que falla es sobre todo paráfrasis que un motor de
  palabras no ve. La búsqueda por el sentido existe (docs/SEMANTICA.md) pero está fuera de esta
  edición porque envía la consulta a un servidor.
- Con una cifra de cetonas, la rama no se elige sola (A01): cuenta como fallo en los bancos.
- Los umbrales se fijaron con 770 preguntas; conviene revisarlos con consultas reales.

## 0.55.0 · intención de las preguntas frecuentes y métricas con denominadores (V54-01, V54-06)

**Definiciones** (`desglose` en `src/respuestas.bancos.ts`). «Directa» es lo que la pantalla
presenta como respuesta: una pregunta frecuente que salta, o un primer pasaje que no va como
«lo más cercano». Contestables y ajenas: preguntas con o sin fragmento aceptable. Las directas
que no aciertan se separan en errores de recuperación, discrepancias deliberadas por la regla de
cetonas (cifra de β-OHB: no se elige rama y la pantalla enseña la urgencia) y respuestas a
preguntas ajenas. Abstención: «lo más cercano» en lugar de directa. Son medidas de
recuperación documental, no tasas de error clínico.

El contador histórico `equivocadas` solo cuenta contestables: en el banco 7 con la 0.54.0 da
7/120 = 5,8 %; con las dos ajenas respondidas como directas, 9/120 = 7,5 %. Precisión de las
directas: 49/58 = 84,5 %.

**Cambio de la 0.55.0.** Una frecuente solo se antepone si trata la misma cuestión que la
búsqueda (objetivo, descarga, hospital, material, retirar o reconsiderar, seguimiento); una de
hospital no responde a una búsqueda que no lo nombra. «plantear» ya no casa con «planta».
Las tres consultas de la auditoría y sus paráfrasis son regresiones conocidas
(`respuestas.intencion.test.ts`).

**Medida.** El banco 7 ya se había usado para medir la 0.53: sirve de regresión, no para afirmar
mejoras. Para la afirmación se encargó el **banco 8** (120 preguntas, otro agente sin ver el
motor, 15 ajenas, 125 fragmentos comprobados) con el motor ya cerrado; se congeló (ce80781) y se
midió una vez la 0.54.0 publicada y la 0.55.0.

| Banco 8 (n = 120; 105 contestables, 15 ajenas)              | 0.54.0      | 0.55.0      |
| ----------------------------------------------------------- | ----------- | ----------- |
| Primera (contestables acertadas + ajenas sin directa, /120) | 69,2 %      | 70,0 %      |
| Entre las tres                                              | 82,5 %      | 82,5 %      |
| Directas                                                    | 67          | 68          |
| Directas que aciertan (precisión)                           | 51 (76,1 %) | 53 (77,9 %) |
| Directas que no aciertan: recuperación                      | 12          | 11          |
| Directas que no aciertan: regla de cetonas (deliberadas)    | 2           | 2           |
| Directas en preguntas ajenas                                | 2           | 2           |
| Abstención en contestables / ajenas                         | 40 / 13     | 39 / 13     |
| Contador histórico `equivocadas`                            | 11,7 %      | 10,8 %      |

Banco 7 (regresión): 0.54.0, directas 58, precisión 84,5 %, recuperación 5, cetonas 2, ajenas
2; 0.55.0, directas 57, precisión 89,5 %, recuperación 2, cetonas 2, ajenas 2.

**Lectura honesta.** La mejora es pequeña. En un banco nuevo la precisión de las directas es
del 76–78 %, menor que la del banco 7: aquella cifra sobrestimaba. Lo que más falla son
paráfrasis que un motor de palabras no ve.
