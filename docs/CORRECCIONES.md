# Correcciones editoriales aplicadas en la app

Fuente única: `Capitulo_AID_SEEN_30-09-2026_ANOTADO_FINAL_11_OBSERVACIONES.pdf` (25 páginas, maquetación
de ec-europe). Las 11 observaciones son anotaciones del PDF (`/Annots`), ya decididas por el autor. La app
aplica cada una en el texto transcrito; `src/contenido.test.ts` comprueba que siguen aplicadas.

| N.º   | Página | Dónde                    | Cambio                                                                                                                                                                                                                                   | Fichero                                 |
| ----- | ------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1/11  | 3      | Algoritmos, 1.er párrafo | «control predictivo basado en modelo (MPC) y lógica difusa»                                                                                                                                                                              | `apartados/01-06.ts` (A03)              |
| 2/11  | 3–4    | Sistemas; título Tabla 1 | «comercializados en España» (sin «o de próxima incorporación»)                                                                                                                                                                           | `apartados/01-06.ts` (A04); `tablas.ts` |
| 3/11  | 4      | Tabla 1, Omnipod 5       | Indicación: «≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día»                                                                                                                                                                                  | `tablas.ts` (T1)                        |
| 4/11  | 5      | Indicaciones             | «…Control-IQ+ y Omnipod 5 ya cuentan…» (sin guion)                                                                                                                                                                                       | `apartados/01-06.ts` (A06)              |
| 5/11  | 8      | Figura 3                 | Columna amarilla «β-OHB 0,6-0,9 mmol/l»; flechas a las columnas amarilla y naranja (el recorrido las implica); nota del asterisco bajo la figura; «Precisan atención urgente» en negrita; «iSGLT2»; «según/síntomas/específica»; «β-OHB» | `figura3.ts`                            |
| 6/11  | 11     | Tabla 3, Control-IQ      | «ejercicio (140–160 mg/dl)»                                                                                                                                                                                                              | `tablas.ts` (T3)                        |
| 7/11  | 11     | Tabla 4                  | Fila «Ejercicio anaeróbico o de alta intensidad» reconstruida: una celda común a los cuatro sistemas                                                                                                                                     | `tablas.ts` (T4, `unida: true`)         |
| 8/11  | 21     | Tabla 6                  | «Tomografía computarizada (TC)»                                                                                                                                                                                                          | `tablas.ts` (T6)                        |
| 9/11  | 24     | Infografía               | «En modalidades híbridas»; «Requieren anuncio de comidas y bolo prandial»; «DM1»; «Mejora consistente del control glucémico con buen perfil de seguridad»; «Bomba de insulina o pod»; «Iniciar»                                          | `figuras.ts` (INFO)                     |
| 10/11 | 24     | Bibliografía, ref. 6     | Cita completa de Holt RIG et al. 2026 con doi:10.2337/dci26-0122                                                                                                                                                                         | `bibliografia.ts`                       |
| 11/11 | todas  | Encabezado gráfico       | Es de maquetación; no afecta al texto                                                                                                                                                                                                    | —                                       |

Además, una **errata que el autor comunicará a la editorial** y que la app ya lleva corregida: Tabla 1, Control-IQ+,
«peso 9–200 kg, DTD 5–200 UI/día» (el PDF dice «DTD 9–200 kg, 5–200 UI/día»).

Las imágenes de `public/figuras/` son recortes de la maquetación del 30-9-2026 y **no** llevan las correcciones
5/11 y 9/11 (son provisionales, a falta de los archivos fuente); las transcripciones sí.

## Cómo se extrajo el texto

- Texto: PyMuPDF (`fitz`), página a página; los guiones de partición de línea se han unido.
- Anotaciones: `page.annots()` → `info.content` y `info.title` («Corrección editorial n/11»).
- Figuras e infografía: renderizadas a 300 ppp y transcritas caja a caja, en orden de lectura.
