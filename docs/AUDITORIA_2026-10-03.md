# Auditoría extensa y rediseño SEEN — 3-10-2026 (0.4.0 → 0.5.0)

Tres auditorías independientes sobre la 0.4.0 en producción (contenido y coherencia, técnica, uso con
tres perfiles), el rediseño con la identidad del Manual SEEN y las correcciones de lo encontrado.
Las notas «antes» son las de las auditorías; las notas «después» son una reestimación tras las
correcciones, comprobadas con las pruebas que se citan (no es una segunda auditoría independiente).

## 1. Puntuaciones

### Por niveles (0–10)

| Nivel                           |   0.4.0 |   0.5.0 | Qué lo mueve                                                                                                                                                               |
| ------------------------------- | ------: | ------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fidelidad al capítulo           |     9,0 |     9,5 | Diagramas devueltos a su literal; enlace a la Figura 3 en su bloque; glosario sin añadidos. `fidelidad.py` y `fidelidad_extra.py` limpios.                                 |
| Separación de capas y confianza |     7,5 |     8,5 | Marca «Difiere del capítulo» con la frase literal; textos de la interfaz que decían de más, corregidos; diez páginas de relación arregladas.                               |
| Coherencia clínica              |     8,0 |     8,5 | Tramo amarillo completo, calificadores recuperados. Quedan E04, E28, E07 y dos frases de la V5 (decide el autor).                                                          |
| Calidad del lenguaje            |     8,0 |     8,5 | Registro de la interfaz; «Fuentes y versión». Queda la mezcla tú/usted de la V5 y su tipografía (del autor).                                                               |
| Completitud útil                |     8,0 |     8,5 | Remisiones internas enlazadas, notas de tabla en la ficha, patrones de la descarga en sus pasos. Faltan enlaces a la bibliografía desde el texto.                          |
| Diseño visual y atractivo       |     7,0 |     8,5 | Identidad del Manual SEEN: mosaico de áreas, títulos finos en mayúsculas, franja de color, paginación en círculos.                                                         |
| Encontrabilidad                 |     7,0 |     8,0 | Índice en mosaico, búsqueda con alternativa, atajo por cifra de β-OHB, resultados de fuera visibles.                                                                       |
| Ergonomía móvil                 |     5,0 |     7,0 | Cabecera compacta, «Volver arriba» que no tapa, botones de 36 px, sin saltos de pantalla. Faltan 44 px en pestañas.                                                        |
| Comodidad de lectura            |     8,0 |     8,5 | Open Sans; «Seguir leyendo» vuelve al punto leído.                                                                                                                         |
| Accesibilidad                   |     8,0 |     9,0 | Lighthouse 100 en portada (móvil y escritorio) y apartado 10 (antes 96–97); foco estable en Escuchar, niveles de encabezado; axe limpio en las e2e.                        |
| Rendimiento                     |     8,5 |     8,0 | Lighthouse móvil 89–92 (antes 93–98): dos fuentes nuevas (Open Sans y Oswald) retrasan el LCP a 2,8–3,0 s. Escritorio 99. Pendiente: figuras a WebP y pantallas perezosas. |
| PWA y sin conexión              |     8,5 |     9,0 | Aviso de versión que no se pierde; colores de tema nuevos; 8 de 8 pantallas sin red.                                                                                       |
| Robustez                        |     6,5 |     8,5 | Preferencias validadas, aviso de fallo por pantalla con «Restablecer», sin «lookbehind» (Safari < 16.4), voz que no se cuelga.                                             |
| Calidad del código              |     7,5 |     8,0 | Una sola fuente de ruta, sin bus de eventos que repinta todo. El nocturno sigue por selectores de estilo en línea.                                                         |
| Pruebas                         |     6,0 |     7,0 | +11 unitarias y +3 e2e de regresión. El despliegue aún no exige las e2e.                                                                                                   |
| Seguridad y privacidad          |     9,0 |     9,5 | Solo rutas internas en favoritos; voz local preferida. Sin terceros.                                                                                                       |
| Imprimir y compartir            |     7,0 |     7,5 | Ctrl+P limpio y hojas iguales que con su botón; plan con abreviaturas. La letra de las hojas (7,2 pt) sigue igual: decisión del autor.                                     |
| **Media**                       | **7,6** | **8,4** |                                                                                                                                                                            |

### Puntuación del usuario (SUS estimado, 0–100)

| Perfil                                    | 0.4.0 | 0.5.0 | Por qué                                                                                       |
| ----------------------------------------- | ----: | ----: | --------------------------------------------------------------------------------------------- |
| A · Endocrinólogo sénior, móvil, consulta |    72 |    80 | Sin saltos de pantalla, búsqueda que no se queda en blanco, atajo de β-OHB, toques mayores.   |
| B · Residente, escritorio, estudio        |    80 |    85 | «Seguir leyendo» exacto, remisiones enlazadas, índice en mosaico, notas de tabla en la ficha. |
| C · Enfermera educadora, hojas            |    70 |    74 | Ctrl+P y hojas fiables, plan con abreviaturas. La letra de 7,2 pt y la jerga siguen pesando.  |

72–80 es «bueno»; > 80, «excelente». Lo que más subiría a C: una opción de letra grande en dos caras.

## 2. Lo que se corrigió

**Contenido.** Enlaces a la Figura 3 (`b6` → `b5`) en Consultar y en la descarga; enlace educativo de
cirugía (`cirugia-prolongada` → `cirugia-larga`); páginas de relación de la versión extendida
comprobadas en el PDF (Tabla 3 en p. 11, Tabla 4 en pp. 11-12, nota de la Tabla 5 en p. 14, E17 p. 12);
diagramas literales (regla del 1800 «Puede valorarse…», ejercicio anaeróbico «suele preferirse…»,
tramo amarillo con «Si la hiperglucemia no responde…» y «Si β-OHB aumenta a ≥1,0…», nota del asterisco
literal); «(do it yourself)» fuera del glosario; cifra 10-20 % con «o riesgo de hipoglucemia»;
calificadores en «Situación y sistema» («sin sospecha de fallo», «sin electrocirugía», «≤ 1 comida
omitida»); «Difiere del capítulo» en Control-IQ (MPC), autocorrección de 780G y ratio I/HC
(`src/ampliacion/difiere.ts`, con prueba de literalidad); textos de la interfaz («Todo es texto
literal», «la conducta exacta», «con el DOI», «nunca lo contradice», «Diez casos», «Trece
preguntas», «No es esa», «Dónde vive», «Confiar», test con «p. 24»).

**Técnica.** Preferencias validadas por forma y «Restablecer preferencias»; aviso de fallo por
pantalla; búsqueda con límite por grupo y totales; Ctrl+P sin botones ni capa extendida, y hojas con
`beforeprint`; expresión regular sin «lookbehind»; Escuchar con un solo botón conmutador, `onerror`,
voces locales y `resume()` tras cancelar; copiar con aviso de fallo; compartir que no muestra el
enlace al cancelar; niveles de encabezado en diagramas y versión extendida; aviso de versión que no se
pierde y no tapa «Volver arriba»; oyente de impresión que no se acumula; precarga de la fuente nueva.

**Uso.** Causa del salto de pantalla y del «Seguir leyendo» impreciso: App y Shell tenían cada una
su copia de la ruta; durante un render la pantalla vieja se volvía a montar con la clave nueva,
saltaba a su ancla y se guardaba ese punto. Ahora la ruta llega de App (AGENTS, regla 12) y el salto al
ancla exige que la dirección apunte a ese bloque. Además: «Volver arriba» solo al subir; nocturno
según el sistema; «Qué ha cambiado» con el capítulo primero; nota «conducta común» en la Tabla 6;
búsqueda con alternativa y atajo por cifra de β-OHB; notas de tabla en la ficha de sistema.

## 3. Rediseño (identidad del Manual SEEN)

- Paleta del Manual (azul #739DCB/#3F6E9F, burdeos #8E254E, mostaza #E0A83E/#8A5E10, rosa diabetes
  #B5668C/#94496E, grises neutros sobre #FAFAFA) y colores de las áreas de manual.seen.es para el
  mosaico (`src/tokens.ts`).
- Open Sans (texto; títulos en ligera y mayúsculas, como los capítulos del Manual) y Oswald (rótulos),
  autoalojadas (OFL).
- Portada: cabecera blanca con franja de cuatro colores, «Manual SEEN · Área Diabetes», título, autor y
  SEEN; «¿Qué necesitas?» con fichas de color; índice del capítulo en mosaico (12 fichas + infografía);
  secciones con cuadro de color numerado.
- Apartado: área, ficha de color con icono y número, título fino en mayúsculas, paginación en círculos.
- Sin el logotipo de la SEEN ni nada que la presente como producto oficial (permiso pendiente).

## 4. Verificación

- Typecheck, lint y prettier limpios; Vitest 67 de 67; Playwright 47 de 47 (escritorio, 393 px y nocturno
  con axe; las seis hojas en una cara A4).
- `fidelidad.py`: 144/144 párrafos, 216/216 celdas, 0 de 114 frases de diagrama fuera de su página
  (las dos «siglas dudosas» del glosario, FSI e iSGLT2, están en la imagen de la Figura 3).
  `fidelidad_extra.py`: 53/53 partes extendidas, 27 frases de la V5, 6 párrafos del resumen y 21 citas
  del test.
- Rutas: 78 × 6 anchos (ver la línea final de `_audit_rutas.json`). Sin conexión: 8 de 8.

## 5. Decisiones que quedan para el autor

1. E04, E28 y E07 de la versión extendida (matices frente al capítulo): dejar, precisar o retirar.
2. Dos frases de la V5 para pacientes: los 5-10 g de la hipoglucemia (sin la condición de 54-70 mg/dl y
   flecha estable) y la desconexión sin «suspender o pausar la administración».
3. Test: q03 («deben ofrecerse» frente a «pueden considerarse»), q06 («debe considerarse fallo» frente
   a «sospecha de fallo») y q04 («Aumentar la ratio», ambiguo).
4. ~~Hojas para el paciente a 7,2 pt~~ — HECHO en la 0.5.1 (decisión del autor): formato «letra
   grande» de 12 pt en una columna, a doble cara. Medido en PDF: resumen 2 caras; información y
   planes 3 (a 10 pt cabría todo en 2 caras, pero el autor prefirió 12 pt).
5. El recuadro «Pendiente» de la portada: la auditoría de uso propone llevarlo a «Sobre esta versión»
   porque transmite «sin validar»; se mantiene visible por decisión anterior.
6. Pendientes de siempre: permiso de la SEEN y de ec-europe, ISBN, Completo corregido, Liberty,
   presentaciones de 2023, novedades, 25 dudosos, `CLOUDFLARE_API_TOKEN`.

## 6. Recomendaciones técnicas no aplicadas

Figuras PNG a WebP (−0,8 MB de precache); `React.lazy` por pantalla (−30 kB gz); `id` y `screenshots`
en el manifiesto; `404.html` para rutas reales desconocidas; e2e como requisito del despliegue en CI;
pestañas y lista de situaciones a 44 px; búsqueda en textos para pacientes y test; enlaces a la
bibliografía desde las menciones del texto; dos ámbar distintos para versión extendida y ampliación.
