# Prueba simulada con diez perfiles · 0.29.2 → 0.29.3

Simulación hecha por la app misma, no con personas: diez perfiles (cuatro residentes R1–R4, tres
adjuntos de endocrinología A1–A3 y tres especialistas en sistemas AID E1–E3) escribieron, cada
uno con su vocabulario, la consulta con la que resolverían cinco de las siete tareas del guion
(`docs/PRUEBA_USUARIOS_2026-10.md`); las otras dos (comparar desde la ficha; ir a la fuente y
volver) son de navegación y se comprobaron aparte. Cincuenta consultas contra el motor real, con
el sentido de producción (`/api/pasajes`).

Lo que mide: si la respuesta correcta (pasaje, pregunta frecuente o recurso «Abrir …») sale la
primera. Lo que no mide: tiempo, toques, comprensión ni lo que haría una persona de verdad al
ver la pantalla. Eso sigue necesitando la prueba con residentes y adjuntos.

## Resultado

| Tarea                                                        | Antes (0.29.2) | Después (0.29.3) |
| ------------------------------------------------------------ | -------------- | ---------------- |
| 1 · Parámetros de Omnipod 5 con efecto directo en automático | 9/10           | 10/10            |
| 4 · Encontrar el ejemplo comentado de una descarga           | 6/10           | 10/10            |
| 5 · CamAPS y ejercicio aeróbico                              | 10/10          | 10/10            |
| 6 · Paso de la descarga: respuesta automática y respaldo     | 7/10           | 9/10             |
| 7 · Resonancia: conducta con la bomba                        | 10/10          | 10/10            |
| **Total**                                                    | **42/50**      | **49/50**        |

Por perfil (después): residentes 19/20, adjuntos 15/15, especialistas 14/15.

## Lo que falló y cómo se arregló

- «descarga comentada», «practicar descarga», «caso práctico de la descarga», «ver un ejemplo de
  informe de descarga»: el recurso «Abrir … ejemplo comentado» exigía que las palabras escritas
  fueran prefijo exacto del título. Ahora casan por la raíz (seis letras) y, en los casos, cuenta
  también su descripción («practicar», «caso», «informe»).
- «paso 7 de la descarga»: el buscador no tenía los pasos de la Tabla 5 como entradas. Ahora los
  ocho pasos están en el índice y «paso N» abre ese paso.
- «qué puedo cambiar en Omnipod 5 en automático»: la intención «parámetros» solo se reconocía con
  esa palabra; ahora también con «configurar», «ajustar» y «cambiar».
- Queda sin resolver «autocorrecciones en la descarga paso» (E1): devuelve el párrafo del capítulo
  sobre el exceso de bolos automáticos y el ejemplo comentado, no el paso 7. Es una consulta
  ambigua (la autocorrección se trata en varios sitios); no se fuerza.

## Navegación (comprobado con las pruebas de navegador)

- Comparar Omnipod 5 con Control-IQ desde Parámetros: una casilla.
- «Ver en el capítulo» desde la Tabla 3 y Atrás devuelve a la comparación.
- Situaciones → Resonancia → «Hoja para entregar al paciente: pruebas y cirugía»: dos toques.
- Niña de 4 años, 18 kg, Libre 2 Plus: Criterios de elección da «dentro del criterio» / «fuera del
  criterio» / «no consta» por sistema y variante.

## Segunda ronda (0.30.0): setenta consultas en lenguaje de residente

Setenta consultas escritas como se dicen en la planta o en la consulta («se me ha despegado el
sensor», «me voy a correr», «vómitos y glucosa alta», «cada cuánto hay que cambiar el set»…),
contra el motor con el sentido de producción. Antes: 58/70. Fallaban por vocabulario, no por
contenido: «sin insulina» y «sin batería» (interrupción del sistema), «la aguja se dobla»
(acodamientos, cánulas metálicas), «no me deja entrar en automático» (salidas del modo
automático), «se me cae el pod» (adhesivo), «bajar el objetivo» (objetivo glucémico), «me quito la
bomba para jugar al fútbol», «hb glicada», «sensor en el brazo». Con las equivalencias añadidas:
67/70. Las tres que quedan no están en el capítulo (sauna, campamento, menstruación) y no se
fuerzan; «con la regla me sube la glucosa» acaba en la regla de oro de la hiperglucemia
persistente, que es la conducta que aplica.
