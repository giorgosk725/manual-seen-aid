# Edición editorial · estado actual (13-10-2026)

> **Lee esto primero.** Lo de debajo de «Historia» es el registro de la 0.49.0 y no describe
> la edición vigente.

| Qué                        | Estado                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versión                    | En producción: 0.54.0 (3fad3486eae1). En preparación: 0.55.0 (auditoría de la 0.54, local). Lo publicado, con commit, build y versión de recuperación: `docs/PUBLICACIONES.md`.                                                                                                                                                                                                                                           |
| Preguntas frecuentes       | f01–f103 con revisión registrada y huella de lo aprobado (`src/frecuentes.aprobadas.json`). Desde la 0.55.0, una frecuente solo se antepone si trata la misma cuestión que la búsqueda (objetivo, descarga, hospital, material, retirar, seguimiento); si no, va como relacionada (V54-01). f11: la edad de Liberty se toma de la Tabla 1 («> 13 años»).                                                                  |
| Autoevaluación             | 10 preguntas (q02 y q03 confirmadas el 13-10).                                                                                                                                                                                                                                                                                                                                                                            |
| Materiales                 | Registro en `src/materiales.ts` (estado, fecha, versión, evidencia). Solo un material «aprobado» se ofrece para entregar e imprimir (`materialListo`). Hoja de cetonas: alarma al principio (0.55.0), orden pendiente de revisión (`borradores/hoja-cetonas-orden_2026-10-13.md`).                                                                                                                                        |
| Retirados                  | Fuera del build público (`src/edicion.ts`): casos guiados y tarjetas de repaso (`CON_CASOS`, `CON_REPASO`), ampliación técnica y sus datos (`CON_AMPLIACION`; Sistemas y el buscador usan `CATALOGO_SISTEMAS`) y la pantalla administrativa de consultas sin respuesta (`CON_CONSULTAS_ADMIN`). Los datos siguen en el repositorio. Los datos históricos del KV de consultas los decide su responsable; no se han tocado. |
| Privacidad                 | Sin envíos: `/api/pasajes` y `/api/sin-respuesta` responden 410. Sin recientes ni visitas.                                                                                                                                                                                                                                                                                                                                |
| Pendiente fuera del código | Prueba con tres profesionales (`docs/PRUEBA_TRES_PROFESIONALES_2026-10.md`); revisar el orden de la hoja de cetonas y la primera cara de los planes (`borradores/`); secreto de Cloudflare en GitHub, si se quiere publicar desde allí; las 17 alertas de dependencias de desarrollo (0 de ejecución), en una actualización de herramientas aparte y probada.                                                             |

## Circuito de publicación

**Circuito efectivo (único que publica hoy):** local, con la sesión de wrangler de quien
publica, y solo tras la orden «publica».

1. Cambios confirmados en `main` y subidos (`git push`): se publica un commit que está en GitHub.
2. `npm run publicar` (producción) o `npm run publicar -- prueba` (copia de prueba). El script
   (`scripts/publicar.mjs`) exige árbol limpio y HEAD = origin/main; pasa todas las puertas
   sobre ese commit (lint, formato, tipos, tests sin excepciones, build, presupuesto, e2e);
   construye un `dist` nuevo; despliega con `--commit-hash` y `--commit-dirty=false`; comprueba
   que la web sirve ese `index-*.js` y esa versión y que las dos API antiguas responden 410; y
   anota en `docs/PUBLICACIONES.md` fecha, canal, versión, commit, build y versión de
   recuperación. Después se confirma y se sube ese registro.
3. Recuperar una versión: `git checkout <commit de PUBLICACIONES.md>` y `npm run publicar`, o
   «Rollback» al deployment anterior en Cloudflare Pages.

**GitHub:** la CI (`ci.yml`) corre en cada push; tiene que estar en verde antes de publicar. El
flujo `deploy-cloudflare.yml` solo se lanza a mano y no publica sin el secreto
`CLOUDFLARE_API_TOKEN`; cuando exista, publica el SHA exacto tras pasar las mismas puertas.

## Historia

### Edición editorial 0.49.0 (12-10-2026)

Propuesta revisable del complemento del capítulo 89, preparada desde la auditoría de la 0.48.2
(`Auditoria_SEEN_AID_v0.48.2.md`) y su brief. Rama local `edicion-editorial`, desde `e02caf9`.
Desplegada solo en la copia de prueba; sin push, sin merge y sin producción.

## Cambios por lote

| Lote | Hallazgo           | Qué se hizo                                                                                                                                                                                                                                                                               |
| ---- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | A01 cetonemia      | La cifra de β-OHB no elige rama (motor y búsqueda). `UrgenciaF3` cita la urgencia y los signos de gravedad de la rama roja antes del selector, junto a cada rama no roja, en las tarjetas F3 y con cifra en la búsqueda. Fragmentos de seguridad enteros, sin punto destacado ni recorte. |
| 1    | A02 elección       | «Explorar criterios de elección»: apartado 6, Figura 2 y celdas literales de la Tabla 1 en orden fijo. Sin entradas de perfil, ranking ni veredictos. Rutas antiguas con criterios se limpian. `eleccion.ts` fuera de la edición con el error registrado (`it.fails`).                    |
| 1    | A03 privacidad     | `EDICION` en `src/edicion.ts`. Sin `/api/pasajes`, sin registro de consultas, sin recientes ni visitas. Búsqueda en memoria, no en la URL. Migración local de claves. Functions con POST 410. Aviso junto a cada campo de búsqueda.                                                       |
| 2    | A04 frecuentes     | Estado y registro por pregunta (`revisionDe`). Solo aprobadas: f01–f61. f11 y f37 con sus pasajes aprobados. Rótulos neutros.                                                                                                                                                             |
| 2    | A05 autoevaluación | q02 y q03 fuera (`PENDIENTES_EDICION`), `validada` sin tocar. «Autoevaluación complementaria basada en el capítulo».                                                                                                                                                                      |
| 2    | A06 ampliación     | Retirada: sin pestaña, sección, tarjetas, búsqueda ni enlaces a asistente-aid. Tarjetas sin `takeaway` ni `tags`. Rutas antiguas con aviso de alcance.                                                                                                                                    |
| 2    | A07 TAR 2019       | El TAR > 180 < 25 % del consenso de 2019 no sale. El dato queda marcado `complementario`.                                                                                                                                                                                                 |
| 2    | A11 páginas        | Filas y casillas de tablas multipágina citan el intervalo entero.                                                                                                                                                                                                                         |
| 2    | A12 hojas          | PDF publicado de pacientes como recurso principal (pie 09/10/2026). Hojas, extractos y plantillas rotulados «Material complementario» en pantalla y papel. Solo letra de 12 pt. Nota de dosis junto a las ramas con dosis.                                                                |
| 3    | A08 portada        | Identidad «Automatización de la insulinoterapia», «Complemento interactivo del capítulo 89», «En evaluación editorial». Dos puertas iguales antes del mapa. Una sola entrada a pacientes.                                                                                                 |
| 3    | A09 navegación     | Menú Consultar / Leer y comprender / Recursos. «Buscar en el capítulo», «Pasajes relacionados», «Sobre este complemento», «Hiperglucemia y cetonemia · Figura 3», «Comparar lo esencial». Ficha: Imprimir junto al título. Bandera roja en todos los pasos de la descarga.                |
| 3    | A13 Sobre          | Fuente, alcance, capa docente, estado y autorización pendientes, responsable y circuito, datos transmitidos y guardados, uso sin conexión.                                                                                                                                                |
| 4    | A10 trazabilidad   | `src/build.ts`: versión, SHA del código, fecha de construcción y SHA-256 de los PDF. Aviso de actualización con la versión en uso. PDF de pacientes en el precache.                                                                                                                       |
| 4    | A14 publicación    | Prueba de 360 px adaptada. Cabeceras propias en las Functions. Dependencias en `docs/DEPENDENCIAS_2026-10-12.md`.                                                                                                                                                                         |

## Módulos

**Visibles:** lectura del capítulo (índice, apartados, tablas, figuras, infografía, bibliografía),
Sistemas (lo esencial, cómo funciona, parámetros, comparar), Explorar criterios de elección,
Situaciones, Hiperglucemia y cetonemia · Figura 3, Interrupción del sistema, Iniciar un sistema,
Revisar la descarga, búsqueda local, preguntas frecuentes aprobadas (61), autoevaluación
complementaria (8), Para el paciente (PDF publicado, versión en pantalla, hojas breves, plantillas
de plan), Sobre este complemento.

**Excluidos (datos conservados):** ampliación técnica, casos guiados, tarjetas de repaso, preguntas
frecuentes f62–f103, propuestas del 12-10 en f11 y f37, autoevaluación q02 y q03, explorador de
criterios con perfil, búsqueda por el sentido, registro de consultas sin respuesta, búsquedas
recientes, hoja compacta de 7 pt, TAR del consenso de 2019.

## Bancos de búsqueda (regresión sobre los existentes)

No es una afirmación nueva de rendimiento. Las bajadas vienen de dos decisiones: la cifra de cetonas
ya no elige rama (A01) y solo responden las frecuentes aprobadas (A04).

| Banco   | 0.48.2 primera / tres / equivocadas | 0.49.0 primera / tres / equivocadas |
| ------- | ----------------------------------- | ----------------------------------- |
| Ciego 1 | 75,8 / 89,2 / 20,4                  | 73,3 / 87,1 / 22,5                  |
| Ciego 2 | 52,0 / 58,0 / 23,3                  | 50,0 / 56,0 / 24,0                  |
| Ciego 3 | 44,2 / 55,0 / 18,3                  | 42,5 / 55,0 / 19,2                  |
| Ciego 4 | 58,8 / 73,8 / 18,8                  | 56,3 / 72,5 / 21,3                  |
| Ciego 5 | 61,3 / 70,0 / 17,5                  | 58,8 / 70,0 / 16,3                  |
| Ciego 6 | 67,0 / 77,0 / 17,0                  | 63,0 / 75,0 / 18,0                  |

| Banco     | 0.48.2 primera / tres | 0.49.0 primera / tres |
| --------- | --------------------- | --------------------- |
| Principal | 95 / 99               | 91 / 95               |
| Control   | 88 / 94               | 85 / 91               |
| Ciego     | 91 / 97               | 84 / 91               |
| Final     | 95 / 100              | 95 / 100              |
| Quinto    | 63 / 88               | 56 / 81               |

Umbrales ajustados, con su motivo en la prueba: ciego 3 (equivocadas ≤ 20 %), ciego 4 y ciego 6.

## Fidelidad

`scripts/auditoria/fidelidad.py` contra el PDF publicado (SHA-256
`3362f82fd93b75a978075b0624c5ccb99d9abcdfb953a05f90f940c1abd3d1e0`): 147 párrafos y listas, 216
celdas y notas, 115 frases de diagramas, sin divergencias. No sustituye la revisión visual de celdas,
condiciones y figuras. La capa docente necesita su propia revisión.

## Pendientes del autor (borradores en `borradores/`)

- `autoevaluacion-q02-q03_2026-10-12.md`: TAR 26,7 % en q02; «pueden considerarse» en q03.
- `hoja-pruebas-mas-de-1-hora_2026-10-12.md`: las tres formas de reposición de la p. 9.
- `frecuentes-f11-f37_2026-10-12.md`: los pasajes añadidos el 12-10.
- `frecuentes-f62-f103_2026-10-12.md`: revisión de las 42 nuevas.
- Revisión clínica y visual de las hojas y de las plantillas de plan antes del piloto.

## Pendientes de otros

- Autorización de reproducción, uso de marca y alojamiento: con la SEEN y ec-europe.
- Bindings de producción (`AI`, KV `CONSULTAS`) y sus datos: con su responsable. Esta edición no los
  usa para recibir texto, pero siguen en `wrangler.toml`.
- Publicación automática: el flujo `deploy-cloudflare.yml` falla en «Comprobar la clave de
  Cloudflare» porque no existe el secreto `CLOUDFLARE_API_TOKEN`; no publicó el commit auditado.
  Lo habilita el responsable del repositorio.
- Edición ampliada: las fichas de ampliación dicen «julio» y citan publicaciones de septiembre y
  octubre; las compatibilidades de insulina necesitan documentos del dispositivo y la versión.
- Dependencias: plan gradual en `docs/DEPENDENCIAS_2026-10-12.md`.

## 0.50.0 (13-10-2026, local)

Decisiones del autor y revisión de la 0.49.1 con la auditoría de la 0.48.2 como referencia.

| Punto                        | Estado en 0.50.0                                                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 cetonemia                | Comprobado: la cifra no elige rama; urgencia citada en búsqueda, ramas y enlaces profundos (pruebas unitarias y e2e).                                                                   |
| A02 criterios                | Comprobado: sin entradas de perfil ni orden por compatibilidad; celdas literales con variantes y ámbito.                                                                                |
| A03 privacidad               | Comprobado: cero envíos a `/api/*`, nada en la URL, visitas ni recientes; solo preferencias y la ruta de «Seguir leyendo».                                                              |
| A04 frecuentes               | f01–f61 aprobadas con registro; 42 pendientes fuera de emparejador, sugerencias, relacionadas e índice (prueba nueva). f37 decidida; f11 en propuesta; f63 y f69 revisadas, pendientes. |
| A05 autoevaluación           | q02 y q03 corregidas por decisión del autor y de vuelta en la edición.                                                                                                                  |
| A12 materiales               | Registro de materiales con tipo, fecha, versión y evidencia, en «Sobre» y al pie de las hojas.                                                                                          |
| A08-A09 portada y navegación | Un nombre para la lectura, «Seguir leyendo», PDF a un toque, identidad propia en la cabecera, 44 px, foco nocturno.                                                                     |
| Navegación                   | Arreglado el desplazamiento de los enlaces a una frase cuando cargan figuras perezosas (fallo intermitente de la 0.49).                                                                 |

Prueba con profesionales: `docs/PRUEBA_TRES_PROFESIONALES_2026-10.md`.

## 0.51.0 (13-10-2026)

Decisiones del autor y revisión delegada: las 103 preguntas frecuentes aprobadas con su registro; f11
con las filas de la Tabla 1; hoja «Pruebas y cirugía» con la sección de la insulina con el sistema
quitado; revisión clínica y visual de las plantillas de plan (quitada la frase de otro sistema en las
filas unidas de la Tabla 4). Portada sin las dos puertas, título en negrita, subtítulo corto; cabecera
con el rótulo del Manual de Endocrinología y Nutrición y «Complemento interactivo»; «Consultar» en la
barra inferior del móvil; «Sobre» en un párrafo. Pendiente del autor: el matiz de edad de Liberty.
