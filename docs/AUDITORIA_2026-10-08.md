# Auditoría externa del 6-10-2026 (Codex) sobre la 0.11.0 → 0.12.0

Fuente: `Auditoria_completa_complemento_Capitulo_SEEN_AID_2026-10-06.md` (Descargas del autor), revisión
experta de producto y presentación editorial de la versión pública 0.11.0. Valoración orientativa del
auditor: 6,5/10 como complemento (organización 8; tablas 7,5; lenguaje 6,5; aprendizaje 6; búsqueda 5).
No es una prueba con usuarios ni una validación clínica.

Este documento recoge qué se aplicó en la 0.12.0, qué no y por qué. Todo lo aplicado es interfaz,
selección de resultados o presentación: **no cambia ni una palabra del texto del capítulo**.

## 1. Aplicado en la 0.12.0

| Hallazgo                            | Qué se hizo                                                                                                                                                                                                                                                                                                                                                                 | Dónde                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 5.1 Promesa del buscador            | «Respuesta del capítulo» → «Pasaje del capítulo»; «Lo más cercano» → «Coincidencia parcial»; «Otras respuestas» → «Otros pasajes relacionados»; el enlace dice su destino («Ver en el apartado / la tabla / la figura / en la ficha del sistema»); textos de Buscar, bienvenida y sin resultados sin prometer «la respuesta»; nota «comprueba que responde a lo que buscas» | `RespuestasCapitulo.tsx`, `Otras.tsx`, `Bienvenida.tsx`, `SinResultados.tsx`, `AvisosBusqueda.tsx` |
| 5.1 Demasiados resultados           | 12 al principio (y 4 de fuera del capítulo); el resto con «Ver más resultados» (+48)                                                                                                                                                                                                                                                                                        | `Otras.tsx`                                                                                        |
| 5.1 Las tres preguntas que fallaban | Causas generales, no la pregunta: (a) sin cifra de β-OHB, una rama de la Figura 3 solo responde si se la nombra por lo que la distingue («leve», «cetoacidosis»…); (b) expresiones «glucosa normal», «sale(n) del automático», «qué parámetros cambian/mueven el automático», «antes de tocar los parámetros»; (c) adverbios de relleno («realmente») como genéricos        | `respuestas.ts` (`propiasDeTramo`, `FRASES`, `GENERICAS`)                                          |
| 5.3 Condiciones junto a la cifra    | Átomo nuevo con la nota del asterisco de la Figura 3 (adultos; pediatría y gestación, su protocolo); en el recorrido, al abrir una rama, debajo van la nota de las dosis y los tres pies comunes; «Actuar» → «Rama de la figura»                                                                                                                                            | `respuestas.ts`, `Figura3Vista.tsx`                                                                |
| 5.2 «Qué mueve el modo automático»  | → «Parámetros configurables en modo automático» (rótulo literal de la Tabla 1), agrupados según su nota: efecto directo (*) / sobre todo en bolos o modo manual                                                                                                                                                                                                             | `Sistemas.tsx`, `Portada.tsx`                                                                      |
| 5.4 Hojas para el paciente          | Letra grande por defecto (la preferencia guardada se respeta); una cara = «Compacta»; al pie: «lo que se escriba a mano en el papel no aparece en la web», versión de la hoja y fecha del capítulo                                                                                                                                                                          | `Pacientes.tsx`, `prefs.ts`                                                                        |
| 5.6 Lectura continua                | En el móvil (< 768 px) las cifras del apartado empiezan plegadas; abiertas en escritorio y al imprimir                                                                                                                                                                                                                                                                      | `Apartado.tsx`                                                                                     |
| 5.10 Cita                           | «Cita provisional» sobre la cita (faltan ISBN y fecha)                                                                                                                                                                                                                                                                                                                      | `Lectura.tsx`                                                                                      |
| 8 D Enlaces a la edición educativa  | Ejercicio → `#/situaciones/ejercicio`; comida grasa → `#/optimizar/comidas`; cirugía → `#/situaciones/especiales` (antes, todos al catálogo general)                                                                                                                                                                                                                        | `enlaces.ts`                                                                                       |
| 9 Tablas 1, 3 y 4                   | Una frase en «Tablas del capítulo» con la pregunta que responde cada tabla                                                                                                                                                                                                                                                                                                  | `Consultar.tsx`                                                                                    |
| 9 «pp. 10–10»                       | Una sola página se escribe «p. 10»                                                                                                                                                                                                                                                                                                                                          | `Visual.tsx`                                                                                       |
| 6 Lenguaje                          | «Cómo sacarle partido» → «Cómo usar esta app»; «ve solo tu rama», «solo lo suyo», «en dos toques», «Todo lo visual en un sitio», «La Figura 2 dibujada», «por estrenar», «en la ronda de hoy», «¿Te acordabas?», «aprendidas» → formas precisas; «Difiere del capítulo; manda el capítulo» → «la app sigue el capítulo mientras el autor lo revisa»                         | varios                                                                                             |

## 2. Medición honesta del buscador

Banco nuevo `src/bancos/ciego4.json`: 80 preguntas (34 residentes, 34 adjuntos, 12 enfermería; 10 sin
respuesta en el capítulo) escritas por otro agente que solo leyó el contenido exportado del capítulo,
sin ver el motor. Medido **una vez**, con el motor de la 0.12.0 ya cerrado, y con el de la 0.11.0:

|                                      | 0.11.0 | 0.12.0 |
| ------------------------------------ | ------ | ------ |
| Pasaje bueno el primero              | 60,0 % | 60,0 % |
| Pasaje bueno entre los tres primeros | 72,5 % | 73,8 % |
| Directas equivocadas                 | 17,5 % | 17,5 % |
| Sin respuesta: no da pasaje directo  | 7/10   | 7/10   |

Por perfil (0.12.0, primero / entre tres): residentes 50/71 %, adjuntos 79/85 %, enfermería 33/50 %.
Los bancos ciegos anteriores quedan igual (ciego 1: 164/207 de 240; ciego 2: 76→77/150; ciego 3: 50/120).

Lectura: los cambios arreglan las tres preguntas de la auditoría (ahora en `respuestas.test.ts`) y no
empeoran nada, pero **no mueven la cifra general**. La meta del auditor (90 % el primero, 95 % entre
tres) queda lejos con este motor de coincidencia de palabras; acercarse exigiría preguntas revisadas
por el autor (§7 del informe) o un cambio de enfoque. `ciego4` ya está usado: no sirve para otra
medida honesta.

## 3. No aplicado, y por qué

- **5.5 Portada Leer/Consultar.** Rediseño de la entrada: es decisión de diseño del autor y cambia la
  navegación que validaron las auditorías de uso del 3 y el 4-10 (SUS 82–87). Pendiente de que el
  autor lo pida.
- **5.7 Diferencias entre capas.** Resolverlas una a una es decisión editorial del autor (están en
  «Notas para el autor»). Solo se ha suavizado el rótulo.
- **5.8 Test.** Validar las diez preguntas (y el matiz de la 3, «deben ofrecerse» frente a «pueden
  considerarse») es del autor.
- **5.9 y §8 Ayudas docentes, conceptos al pulsar, casos nuevos.** Contenido nuevo del autor: necesita
  redacción y revisión antes de publicarse (regla de la app: nada sin aprobación).
- **«Qué ha cambiado» → «Actualizaciones».** Ya separa capítulo y app por entrada; se deja el nombre.
- **§13 Pruebas con usuarios** (3 residentes y 3 adjuntos; hojas con enfermería y pacientes): fuera
  del alcance de una sesión de código.
- **§10 Mensaje de Optimizar en la edición educativa** (pide pegar un informe con los campos
  bloqueados): es de la otra app (asistente-aid).
