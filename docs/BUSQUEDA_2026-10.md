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
