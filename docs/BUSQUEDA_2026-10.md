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

## 0.59.0 · léxico de consulta (13-10-2026)

**Método.** Antes de tocar el motor, otro agente escribió el **banco 9** (120 preguntas, 15
ajenas, 162 fragmentos literales comprobados) sin ver el motor ni los bancos; se congeló en un
commit propio (570d7a5) y se midió la 0.58.0. Los bancos 7 y 8 pasaron a ser de **desarrollo**:
con sus fallos se añadieron formas de preguntar que el capítulo dice de otra manera (compresión
«al darse la vuelta», priorización «a quién se lo damos», localización del algoritmo, «cada
cuánto», ingreso en planta, carácter híbrido y bolo de las comidas, «niños» → menores…). El banco 9
se midió una sola vez al final.

| Banco 9 (n = 120)         | 0.58.0 | 0.59.0 |
| ------------------------- | ------ | ------ |
| Primera                   | 72,5 % | 72,5 % |
| Entre las tres            | 79,2 % | 80,0 % |
| Directas equivocadas      | 9,2 %  | 8,3 %  |
| Precisión de las directas | 82,8 % | 84,6 % |

En desarrollo, el banco 7 pasó de 70,8 a 76,7 % a la primera y el 8 de 70,0 a 72,5 %; en el banco
nuevo la mejora apenas se nota: los cambios de léxico arreglan las preguntas vistas, no las
nuevas. Para subir de verdad hace falta otra cosa (búsqueda por el sentido sin conexión, o
elegir la frase dentro del párrafo), y medirla con un banco 10 nuevo.

## 0.61.0 · la frase del detalle (13-10-2026)

**Cambio.** Como mucho sale una respuesta por párrafo; ahora, si otra frase del mismo párrafo
casa una palabra específica de la pregunta que la principal no casa (y puntúa al menos la mitad),
sale junto a ella: el plazo, la condición o la excepción suelen ir en otra frase.

**Medida.** Otro agente escribió el **banco 10** sin ver el motor (120 preguntas, 15 ajenas, 159
fragmentos; 84 de las 105 contestables preguntan por un detalle dentro de un párrafo). Se congeló
(a5eb6e6) y se midió una vez con el motor de la 0.60.0 y con el de la 0.61.0.

| Banco 10 (n = 120)        | 0.60.0 | 0.61.0 |
| ------------------------- | ------ | ------ |
| Primera                   | 74,2 % | 74,2 % |
| Entre las tres            | 85,0 % | 85,0 % |
| Directas equivocadas      | 5,8 %  | 5,8 %  |
| Precisión de las directas | 88,7 % | 88,7 % |

En desarrollo (bancos 1-9) sube algo (p. ej., banco 1 de 76,3 a 77,1 %; banco 7 de 76,7 a
77,5 %) y en el banco nuevo no cambia: se queda porque no empeora nada y enseña el detalle junto a
la frase principal. Lo que falla en los bancos nuevos es sobre todo encontrar el párrafo, no la
frase dentro de él.

## 0.65.0 · consultas del índice (doc2query) y BM25 (13-10-2026)

**Banco de prueba.** Otro agente escribió el **banco 11** sin ver el motor: 150 preguntas (20
ajenas, 179 fragmentos aceptables), siempre parafraseadas, sin copiar palabras del capítulo. Se
congeló (220a203) antes de tocar el motor. Los bancos 1-10 pasan a ser de desarrollo.

**1. BM25 por pasaje.** Un segundo ordenador (BM25, k1 = 1,2, b = 0,6; título ×2, claves ×0,7,
cuerpo ×1, resto del párrafo ×0,25), fundido por rango recíproco con el motor solo cuando no hay
respuesta segura; la primera del motor se mantiene y nunca entra un tramo de la Figura 3 (A01).
Sobre el banco 11, con el motor de la 0.64.0, no cambió nada (48,7 / 62,0 / 6,7). Se queda
porque, con las consultas del índice, sube «entre las tres» en desarrollo (83,1 → 85,8 %).

**2. Consultas del índice (doc2query).** Cuatro agentes escribieron, sin ver ningún banco, 5
consultas por pasaje (441 pasajes, 2.200 consultas: cómo lo preguntaría un clínico, un residente
o un paciente), con el texto literal delante. Se quitaron las que nombran marcas o fármacos que el
capítulo no trata (5; lista en `src/expansiones.test.ts`, que lo comprueba). Las consultas están
en `src/expansiones.consultas.json` y **no van en la app**: la app lleva solo sus raíces que el
pasaje no tiene ya (`src/expansiones.json`, 40 KB, ~11 KB comprimido), que regenera
`GENERAR=1 npx vitest run src/expansiones.test.ts`. Nunca se enseñan: lo que sale es el texto del
capítulo.

Reglas, decididas solo con los bancos de desarrollo:

- Casan con menos peso que el texto (0,8 frente a 1,8-2,2); probadas 0,5 / 0,8 / 1,1 / 1,5.
- No en los tramos de la Figura 3 (A01).
- No cambian el peso de las palabras con que se eligen las preguntas frecuentes.
- **Ordenan, pero no hacen «la respuesta»**: para presentar un pasaje como respuesta directa
  solo cuenta lo que casa el texto del capítulo. Sin esta regla, las directas equivocadas
  subían en desarrollo de 6,8 a 7,7 %; con ella, 5,8 %.
- Tampoco cuentan para el rótulo «Pasajes posibles» frente a «Coincidencia parcial»: si la
  pregunta solo la cubren las consultas, el capítulo la trata en parte.
- Probadas y descartadas: menos cobertura por lo que casan las consultas (0,5 y 0), excluir
  también las palabras del resto del párrafo, y decidir «lo más cercano» sin ellas.

| Banco 11 (n = 150, prueba) | 0.64.0 | 0.65.0 |
| -------------------------- | ------ | ------ |
| Primera                    | 48,7 % | 61,3 % |
| Entre las tres             | 62,0 % | 76,7 % |
| Directas equivocadas       | 6,7 %  | 7,3 %  |
| Directas (n)               | 41     | 44     |
| Precisión de las directas  | 75,6 % | 75,0 % |

| Bancos 1-10 (desarrollo) | 0.64.0 | 0.65.0 |
| ------------------------ | ------ | ------ |
| Primera                  | 68,3 % | 72,7 % |
| Entre las tres           | 81,9 % | 85,8 % |
| Directas equivocadas     | 6,8 %  | 5,8 %  |

**Honestidad de la medida.** El banco 11 se midió una vez con las consultas del índice
(62,0 / 76,0 / 7,3, peso 0,8). Después, ya decidido en desarrollo, se añadieron las tres reglas
de arriba (frecuentes, tramos y «no hacen la respuesta»), y se midió una segunda vez para
informar de la cifra final (61,3 / 76,7 / 7,3). No se ajustó nada mirando el banco 11. Las
directas equivocadas suben una (10 → 11 de 150) y las directas, tres; la precisión de las
directas queda igual.

**Coste.** El banco principal baja de 91 a 89 % a la primera (dos preguntas pasan a la segunda
posición): umbral 90 → 88 %. Los bancos 3 y 4 suben una directa equivocada cada uno (umbrales
0,04 → 0,05 y 0,05 → 0,07); el resto de umbrales se endurece. El trozo del buscador pasa de ~26 a 36 KB
comprimido (se carga al buscar, no al entrar): presupuesto propio de 40 KB.

**Siguiente.** Para afirmar mejoras posteriores hace falta un banco 12 nuevo.
