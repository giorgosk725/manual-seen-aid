# Banco nuevo de consultas (cerrado el 12-10-2026, sin usar para afinar el motor)

**Para qué:** medir la 0.4x con preguntas que el motor no ha visto. Ochenta responden con el capítulo; veinte están cubiertas solo en parte o no están en el capítulo (el buscador debe decirlo, no inventar). Escritas como las dicen residentes y adjuntos: abreviaturas, comparaciones, dos partes, tareas.

**Regla de uso:** no se tocan el léxico, las frases ni las preguntas frecuentes para que estas consultas acierten. Se miden una vez con el motor cerrado (`npx vitest run` con un banco `src/bancos/ciego7.json` que se rellenará con los pasajes aceptables de cada pregunta antes de medir, sin mirar lo que responde el motor). Las preguntas de los residentes de la prueba real se añaden como tanda aparte.

**Cómo se mide:** acierto a la primera, entre las tres primeras, directas equivocadas, y para las 20 de alcance limitado, si el aviso de alcance aparece. Numeradores y denominadores, y el tipo de fallo (vocabulario, sistema equivocado, variante, alcance no dicho, continuación ajena).

## A. Cubiertas por el capítulo (80)

### Sistemas y parámetros (16)

1. qué bomba tiene el algoritmo en el móvil
2. en qué sistema se puede poner objetivo 100
3. cuántos tramos de objetivo admite omnipod 5
4. control iq modula la basal o pone microbolos
5. camaps aprende de la dtd
6. qué sistema no hace autocorrecciones
7. safe bolus qué es
8. el pod recalcula la basal con cada cambio
9. duración de insulina activa en 780g rango
10. factor de sensibilidad interviene en automático en qué sistema
11. basal programada sirve para algo en omnipod en automático
12. qué sensores van con camaps
13. mobi o t:slim diferencia para el algoritmo
14. control iq+ desde qué peso
15. omnipod 5 autorizado en dm2
16. qué plataforma descarga la 780g

### Inicio del sistema (14)

17. empiezo omnipod desde pluma qué dosis pongo de basal
18. cuánto bajo la dtd al pasar de mdi si tiene hba1c de 9
19. regla del 450 para qué sirve
20. regla del 1700
21. objetivo del calculador manual al inicio
22. la glargina de anoche interfiere al empezar la bomba
23. degludec cuántos días de efecto al iniciar
24. 780g necesita 48 h en manual antes del automático
25. camaps empieza en automático directamente
26. qué hay que dejar por escrito antes de activar el automático
27. hoja de comprobación del inicio
28. cuándo llamo al paciente después de empezar
29. visita a los 3 meses qué se mira
30. ratio de 1:10 cómo se convierte a g por unidad

### Educación, seguridad e interrupción (10)

31. plan de seguridad qué tiene que llevar
32. cuánto tiempo puede estar sin bomba en la ducha
33. si lo desconecta 4 horas para un partido qué insulina pone
34. la pluma la cuenta el sistema como insulina activa
35. se le ha roto el sensor y no tiene otro qué hace con la bomba
36. basal de respaldo cuánta
37. vuelve a conectar la bomba después de pluma cuándo
38. la bomba se ha quedado sin pila a medianoche
39. hipo leve con la bomba parada cuántos hidratos
40. cuándo pinchar en dedo si el sensor dice 60

### Descarga e incidencias (16)

41. tir objetivo adulto
42. tbr por debajo de 54 cuánto es aceptable
43. cv 40 qué significa
44. gmi y hba1c no coinciden
45. salidas del automático muchas por la noche
46. uso del sensor 60 por ciento se puede interpretar
47. autocorrecciones 35 por ciento de la insulina es mucho
48. subida después de cenar pizza 3 horas tarde
49. hipoglucemias después de corregir a mano
50. hidratos fantasma qué son
51. cuántos cambios hago en una descarga
52. cada cuánto cito tras un cambio de parámetros
53. paso de la descarga donde se mira la seguridad
54. alarmas que el paciente ignora
55. la cánula se acoda mucho qué set le pongo
56. le pica el adhesivo del sensor

### Cetonemia e hiperglucemia (10)

57. glucosa 280 dos horas y no baja con corrección
58. cetonas 0,7 con bomba qué hago
59. cetonas 2,5 vomita
60. segunda dosis de pluma a qué hora
61. cuándo mandar a urgencias por cetonas
62. isglt2 con bomba cetonas con glucosa normal
63. beber agua o zumo con cetonas y glucosa 300
64. cambio el pod o pongo pluma primero
65. gripe con fiebre y glucosa 250
66. cetonas normales y glucosa alta persistente

### Situaciones especiales (14)

67. embarazada con control iq se puede
68. objetivo de hba1c antes del embarazo con bomba
69. camaps en gestación objetivo 100
70. niño de 3 años con 15 kg qué sistema
71. adolescente que no pone bolos qué sistema le conviene
72. anciano con deterioro cognitivo y bomba
73. corticoides 3 días con 780g qué hago
74. ejercicio de fuerza sube la glucosa qué hago con el objetivo
75. nadar con omnipod
76. resonancia con omnipod se quita
77. tac con sensor
78. cirugía de 4 horas con bomba
79. en planta con bomba quién maneja la bomba
80. diálisis y asa cerrada

## B. Alcance limitado o no cubierto (20)

El buscador debe decir qué no trata el capítulo; si responde con lo general, debe marcarlo como general.

81. sauna con la bomba
82. ilet se vende en españa
83. medtrum nano comparado con omnipod
84. diabeloop en gestación
85. bomba de parche sin algoritmo cuál es mejor
86. precio de omnipod 5 financiación en madrid
87. cómo se programa el objetivo en el menú de la 780g (pasos del menú)
88. tandem mobi se moja
89. dexcom g7 cuántos días dura
90. libre 3 plus con omnipod 5
91. metformina con bomba en dm1
92. semaglutida y asa cerrada
93. campamento de verano con bomba
94. menstruación y subidas de glucosa con 780g
95. alcohol cuántas copas con camaps
96. bomba en el avión en la cabina presurizada
97. qué hacer si el sensor se queda sin pilas (sensor de un solo uso)
98. cuándo cambia la normativa de financiación
99. control iq en diabetes tipo 2 en españa
100.  la app del móvil se cuelga qué hago

## Cómo seguir

- Antes de medir: rellenar para cada pregunta de A los pasajes aceptables (ids de átomos) sin consultar el motor; para B, el aviso esperado («no trata», «general», «sistema no cubierto»).
- Guardar como `src/bancos/ciego7.json` y añadirlo al test de bancos con umbrales = lo medido la primera vez.
- Después de la prueba real: añadir las preguntas que formulen los residentes y adjuntos como tanda C, con el mismo procedimiento.
