# Preguntas al capítulo — 4-10-2026 (0.8.0)

El buscador de la app responde primero con el texto del capítulo que contesta la pregunta,
como «Preguntas» en el asistente. No usa inteligencia generativa: elige un fragmento LITERAL
(una frase, un punto de una lista, una fila de tabla con la casilla del sistema nombrado, un
tramo de la Figura 3 o una sigla del glosario) y enseña su página y «Leer en su sitio». Si el
capítulo no lo trata, no fuerza una respuesta.

- Motor: `src/respuestas.ts`. Componente: `src/componentes/RespuestasCapitulo.tsx` (paleta,
  «¿Qué necesitas?» de la portada y pantalla Buscar). Bancos: `src/respuestas.test.ts`.
- Debajo de la respuesta sigue la búsqueda literal de siempre (todos los sitios donde sale y,
  aparte, lo que no es del capítulo).

## Cómo lee la pregunta

Quita palabras vacías y verbos de relleno; reduce a raíz (plural y género); añade equivalentes
de la consulta diaria (`LEXICO`: cetonas → cetonemia, embarazo → gestación, piscina → acuáticas,
pica → irritación…) y de expresiones enteras (`FRASES`: «glucosa alta» → hiperglucemia
persistente, «cuánto tiempo puedo estar desconectado» → interrupción…); tolera una errata;
pesa más las palabras raras; exige que la respuesta cubra la parte de la pregunta que el
capítulo puede contestar. Con un sistema nombrado, la fila de tabla responde con su casilla.
Con una cifra de cetonemia, el tramo de la Figura 3. Con un valor de glucosa, comprueba los
umbrales del texto (80 cumple «<90 mg/dl»). Ante «qué hago», la conducta va antes que la sigla.

## Medición (honesta)

| Banco                               | Preguntas | Cómo se usó                              | Primera respuesta |  Entre las tres |
| ----------------------------------- | --------: | ---------------------------------------- | ----------------: | --------------: |
| Buscador anterior (solo lista)      |        15 | referencia                               |           3 de 15 |               — |
| Principal (escrito antes del motor) |        99 | para ajustar                             |              98 % |               — |
| Control                             |        34 | ajustado tras ver sus fallos             |       59 % → 91 % |               — |
| Ciego                               |        32 | medido a ciegas; luego ajustes generales |   **69 %** → 88 % |               — |
| Final                               |        20 | medido a ciegas; luego ajustes generales |   **65 %** → 90 % | **80 %** → 95 % |
| Quinto                              |        16 | a ciegas, con el motor ya cerrado        |          **50 %** |        **69 %** |

Las cifras en negrita son las únicas medidas a ciegas: **con preguntas nuevas, la primera
respuesta acierta entre la mitad y dos de cada tres veces, y la buena está entre las tres que
se enseñan en torno a tres de cada cuatro.** Cada banco nuevo destapa vocabulario que falta
(«me pica», «cuerpos cetónicos», «desayuno»…): el motor mejora con preguntas reales.

## Cómo seguir mejorándolo

1. Reunir preguntas reales (las que hagan el autor, residentes y educadoras al usarla).
2. Añadir el vocabulario que falte a `LEXICO` o `FRASES` (cambios generales, nunca para una
   pregunta concreta).
3. Medir con un banco NUEVO escrito antes de mirar los resultados, y no ajustar contra él.
   Los bancos de `respuestas.test.ts` vigilan que lo ya conseguido no se pierda.
