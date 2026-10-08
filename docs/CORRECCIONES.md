# Correcciones editoriales aplicadas en la app

## Capítulo publicado (8-10-2026): fuente única desde entonces

Publicado en <https://manual.seen.es/article?id=6ac781b3-b8f0-43a6-959e-3bc70aca0133> como capítulo 89 (Área II,
Diabetes · subsección Tratamiento), «Última modificación: 08/10/2026 11:43». PDF de 25 páginas con el pie
«ec-europe - ISBN 978–84–606–8570–8 - 08/10/2026» (copia local `Downloads\Capitulo_AID_SEEN_PUBLICADO_08-10-2026.pdf`), más el
de información para pacientes (`…_medium.pdf`, 3 páginas) y el resumen (`…_summary.pdf`, 1 página).

- Trae las 3 correcciones finales del 5-10-2026 (tabla de abajo) y, además, «peso» en la indicación de
  **Control-IQ** de la Tabla 1: «Control-IQ: ≥ 6 años, peso 25–140 kg, DTD 10–100 UI/día» (aplicado en `tablas.ts`).
- Por lo demás, el texto es el de la maquetación del 5-10-2026 (auditoría `fidelidad.py`: 147/147 párrafos,
  216/216 celdas, 0 divergencias). La paginación es la misma salvo saltos de línea dentro de las pp. 4–7 que no
  mueven ningún bloque.
- Figuras: iguales a las del 5-10-2026 (la 2 está 12 pt más abajo en la p. 6; se han vuelto a recortar las
  cuatro del PDF publicado). Siguen los dos detalles de la Figura 3 anotados en `docs/NOTAS_EDITORIALES.md`.
- Información para pacientes y resumen publicados: idénticos palabra por palabra a los de la app.

## Maquetación del 5-10-2026

Fuente única desde la 0.11.0: `Capitulo_AID_SEEN_05-10-2026_ANOTADO_3_DETALLES_FINALES.pdf` (25 páginas,
maquetación de ec-europe del 5-10-2026; el `…_Completo.pdf` de la editorial de esa fecha tiene el mismo texto,
sin las notas). Esta maquetación **ya incorpora** las 11 correcciones del 30-9-2026 (segunda tabla) y lleva
**3 correcciones finales** anotadas por el autor (`/Annots`, «Corrección final n/3»), que la app aplica en el
texto transcrito. `src/contenido.test.ts` comprueba que siguen aplicadas y `scripts/auditoria/fidelidad.py`
coteja la app con el PDF (párrafos, celdas, referencias, glosario, cifras y diagramas en su página).

## Correcciones finales del 5-10-2026 (la editorial aún no las ha pasado)

| N.º | Página | Dónde                             | Cambio                                                                                                                                                                                                                                                                                                                                                                                                                              | Fichero                    |
| --- | ------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 1/3 | 4      | Tabla 1, Control-IQ+              | «Control-IQ+: ≥ 2 años, peso 9–200 kg, DTD 5–200 UI/día» (el PDF dice «DTD 9–200 kg, 5–200 UI/día»; era la errata que la app ya llevaba corregida)                                                                                                                                                                                                                                                                                  | `tablas.ts` (T1)           |
| 2/3 | 15     | Resolución de incidencias, iSGLT2 | «En personas tratadas con iSGLT2 —por indicación cardiorrenal o fuera de ficha técnica en la DM1— debe mantenerse una alta sospecha de cetoacidosis y medirse la cetonemia ante síntomas o situaciones de riesgo, con independencia del nivel de glucemia, ya que puede cursar con glucemia normal o solo moderadamente elevada.» Sustituye a «conviene rebajar este umbral a 200 mg/dl…»; la cifra «200 mg/dl» sale de `cifras.ts` | `apartados/07-09.ts` (A09) |
| 3/3 | 25     | Bibliografía, ref. 6              | «doi:10.2337/dci26-0122» al final de la referencia (la app ya lo llevaba)                                                                                                                                                                                                                                                                                                                                                           | `bibliografia.ts`          |

## Las 11 del 30-9-2026 (ya en la maquetación del 5-10-2026)

| N.º   | Página | Dónde                    | Cambio                                                                                                                                                                                                                                   | Fichero                                 |
| ----- | ------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1/11  | 3      | Algoritmos, 1.er párrafo | «control predictivo basado en modelo (MPC) y lógica difusa»                                                                                                                                                                              | `apartados/01-06.ts` (A03)              |
| 2/11  | 3–4    | Sistemas; título Tabla 1 | «comercializados en España» (sin «o de próxima incorporación»)                                                                                                                                                                           | `apartados/01-06.ts` (A04); `tablas.ts` |
| 3/11  | 4      | Tabla 1, Omnipod 5       | Indicación: «≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día» (sin la nota «Si puede ir»)                                                                                                                                                      | `tablas.ts` (T1)                        |
| 4/11  | 5      | Indicaciones             | «…Control-IQ+ y Omnipod 5 ya cuentan…» (sin guion)                                                                                                                                                                                       | `apartados/01-06.ts` (A06)              |
| 5/11  | 8      | Figura 3                 | Columna amarilla «β-OHB 0,6-0,9 mmol/l»; flechas a las columnas amarilla y naranja (el recorrido las implica); nota del asterisco bajo la figura; «Precisan atención urgente» en negrita; «iSGLT2»; «según/síntomas/específica»; «β-OHB» | `figura3.ts`                            |
| 6/11  | 11     | Tabla 3, Control-IQ      | «ejercicio (140–160 mg/dl)»                                                                                                                                                                                                              | `tablas.ts` (T3)                        |
| 7/11  | 11     | Tabla 4                  | Fila «Ejercicio anaeróbico o de alta intensidad» reconstruida: una celda común a los cuatro sistemas                                                                                                                                     | `tablas.ts` (T4, `unida: true`)         |
| 8/11  | 21     | Tabla 6                  | «Tomografía computarizada (TC)»                                                                                                                                                                                                          | `tablas.ts` (T6)                        |
| 9/11  | 24     | Infografía               | «En modalidades híbridas»; «Requieren anuncio de comidas y bolo prandial»; «DM1»; «Mejora consistente del control glucémico con buen perfil de seguridad»; «Bomba de insulina o pod»; «Iniciar»                                          | `figuras.ts` (INFO)                     |
| 10/11 | 24–25  | Bibliografía, ref. 6     | Cita completa de Holt RIG et al. 2026 (el DOI llega con la final 3/3)                                                                                                                                                                    | `bibliografia.ts`                       |
| 11/11 | todas  | Encabezado gráfico       | Es de maquetación; no afecta al texto                                                                                                                                                                                                    | —                                       |

**Lo que la maquetación del 5-10-2026 no deja del todo de la 5/11** (en la imagen; la transcripción está bien):
en la columna roja sigue «Si no existe pauta especifica» sin tilde, y las líneas que bajan a las columnas amarilla y
naranja no tienen punta de flecha. Anotado para el autor en `NOTAS_AUTOR` (`src/contenido/cambios.ts`).

## Cambios de página respecto al 30-9-2026

La nota del asterisco de la Figura 3, ahora texto bajo la figura, empuja el apartado 7: el párrafo de la
hipoglucemia leve pasa a pp. 8–9, «La segunda regla…» a la p. 9, «Capacitación del equipo asistencial» y su
párrafo a la p. 10, y la Tabla 3 empieza y acaba en la p. 11. Desde la p. 13 la paginación es la misma.

## Figuras

Las imágenes de `public/figuras/` son recortes de la maquetación del 5-10-2026 por el marco de cada figura
(son vectoriales en el PDF; renderizadas a 1440 px de ancho, sin anotaciones, WebP sin pérdida). Ya llevan las
correcciones 5/11 y 9/11. Siguen siendo provisionales, a falta de los archivos fuente.

## Información para pacientes

La maquetación de la editorial del 5-10-2026 (`…_Pacientes.pdf`, 3 páginas) coincide palabra por palabra con la
versión V5 del autor que muestra la app (la del 30-9-2026 era anterior a sus correcciones).

## Cómo se extrajo el texto

- Texto: PyMuPDF (`fitz`), página a página; los guiones de partición de línea se han unido.
- Anotaciones: `page.annots()` → `info.content` y `info.title`.
- Figuras e infografía: renderizadas y transcritas caja a caja, en orden de lectura.
