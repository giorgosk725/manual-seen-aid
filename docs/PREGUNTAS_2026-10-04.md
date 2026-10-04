# Preguntas al capítulo — 4-10-2026 (0.8.0 → 0.10.0)

El buscador de la app responde primero con el texto del capítulo que contesta la pregunta,
como «Preguntas» en el asistente. No usa inteligencia generativa: elige un fragmento LITERAL
(una frase —o dos del mismo párrafo—, un punto de una lista, una fila de tabla con la casilla
del sistema nombrado, un tramo de la Figura 3 o una sigla del glosario) y enseña su página y
«Leer en su sitio», que lleva a la frase y la resalta. Si nada responde de lleno, o la respuesta
es dudosa, lo rotula «Lo más cercano en el capítulo»; si el capítulo no lo trata, no responde.

- Motor: `src/respuestas.ts` (raíz de las palabras en `src/raiz.ts`, frases en `src/frases.ts`).
  Componente: `src/componentes/RespuestasCapitulo.tsx` (paleta, «¿Qué necesitas?» y Buscar).
  Frase citada: `src/fraseCitada.ts`. Bancos: `src/respuestas.bancos.ts` y `src/bancos/`.
- Debajo de la respuesta sigue la búsqueda literal de siempre.

## Cómo lee la pregunta

- Corrige faltas por cómo suenan («bomitos» → vómitos, «asucar» → azúcar) o a una errata.
- Quita palabras vacías; no exige las genéricas («quiero», «conviene», «bomba», «AID»,
  «aparato», verbos conjugados como «salgo» o «ponga»), aunque suman si están.
- Reduce cada palabra a su raíz (Snowball para español, con excepciones: «comunicación» no es
  «común», «fabricante» no es «fabrica»).
- Añade equivalentes de la consulta diaria (`LEXICO`, también por raíz: «olvidados»,
  «repuestos») y de expresiones enteras (`FRASES`: «me pita» → alarmas, «se me dispara» →
  hiperglucemia, «hidratos de mentira» → fantasma, «sin tener que ponerse bolos» → Liberty).
  «a|b» en una expresión es una sola palabra exigida que puede ser a o b.
- Siglas y desarrollos del glosario son la misma palabra («dosis total diaria» = DTD;
  «DIA» en mayúsculas = duración de la insulina activa).
- Edades («mi hijo de 1 año», «80 años»): la población (pediatría, mayores) y, en la infancia,
  los umbrales de edad del texto («≥ 1 año»). Cifras de glucosa: los umbrales del texto. Cifras
  de cetonemia (delante o detrás: «0,3 de cetonas»): el tramo de la Figura 3.
- Pesa más las palabras raras y exige que la respuesta cubra la pregunta; una palabra con
  contenido que el capítulo no tiene («semaglutida») pesa en contra.

## Medición honesta

Los bancos «ciegos» los escribió otro agente leyendo solo el capítulo, sin ver el motor: cada
pregunta lleva fragmentos LITERALES que tendría una respuesta correcta (o ninguno, si el
capítulo no lo trata). Un banco solo da una cifra honesta la PRIMERA vez que se mide; después
sirve para afinar y para vigilar regresiones (`respuestas.test.ts`). La versión publicada (0.9.0)
se midió con los mismos bancos para comparar.

| Banco                                     | Preguntas | 0.9.0 (1.ª / ×3) | 0.10.0, primera medida (1.ª / ×3) | 0.10.0 tras afinar |
| ----------------------------------------- | --------: | ---------------: | --------------------------------: | -----------------: |
| Ciego 1, mitad «prueba»                   |       121 |      49 % / 60 % |                   **55 % / 66 %** |        68 % / 84 % |
| Ciego 2 (detalles finos)                  |       150 |      37 % / 41 % |                   **43 % / 48 %** |        51 % / 56 % |
| Ciego 3 (mitad típicas, mitad de detalle) |       120 |      35 % / 38 % |                   **42 % / 53 %** |       (sin afinar) |

En el banco 3, medido con el motor ya cerrado:

| Perfil            | 0.9.0 (1.ª / ×3) | 0.10.0 (1.ª / ×3) |
| ----------------- | ---------------: | ----------------: |
| Endocrino         |      50 % / 53 % |       57 % / 63 % |
| Residente         |      32 % / 36 % |       40 % / 48 % |
| Enfermera         |      24 % / 24 % |       32 % / 60 % |
| Paciente          |       8 % / 12 % |       16 % / 28 % |
| Fuera (no trata)  |      73 % / 73 % |       73 % / 73 % |
| Consultas típicas |      38 % / 43 % |       43 % / 59 % |
| Detalles finos    |      32 % / 32 % |       41 % / 48 % |

Respuestas equivocadas presentadas como directas en el banco 3: **33 → 21 de 120**; las demás
dudosas salen como «Lo más cercano». En los bancos 1 y 2, las directas aciertan el 66 % (antes,
el 62 %): cuando la primera cubre poco de la pregunta y apenas saca ventaja a la siguiente,
acertaba el 41 %, y por eso se rotula como «lo más cercano».

**Lectura honesta.** Con preguntas nuevas escritas por otro, la primera respuesta acierta
cuatro o cinco de cada diez veces y la buena está entre las tres en la mitad o algo más; en
las preguntas de paciente, con su vocabulario, todavía poco. Las preguntas de mis propios
bancos (más cortas y cercanas al texto) aciertan en torno al 90 %. El límite es el de un
buscador sin inteligencia generativa: entiende palabras y expresiones, no el sentido de una
pregunta larga («¿por qué una bomba parada es peligrosa tan rápido?»).

## Cómo seguir mejorándolo

1. Reunir preguntas reales (las que hagan el autor, residentes, educadoras y pacientes).
2. Añadir el vocabulario que falte a `LEXICO`, `FRASES` o `GENERICAS` (reglas generales, nunca
   para una pregunta concreta).
3. Para una cifra nueva, un banco NUEVO escrito antes de mirar los resultados, medido una vez.
4. Si se quiere entender el sentido de preguntas largas, haría falta un modelo de lenguaje
   (aunque no genere texto): pesa decenas de megas y obligaría a replantear el uso sin conexión.
