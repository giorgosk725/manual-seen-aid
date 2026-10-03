# Segunda auditoría — 4-10-2026 (0.6.0 → 0.6.1)

Tres auditorías independientes sobre la 0.6.0 en producción (contenido, técnica y uso con los
mismos tres perfiles y el mismo método que la del 3-10) y las correcciones aplicadas en la 0.6.1.
Columna «0.4.0»: primera auditoría independiente. «0.6.0»: esta auditoría independiente.
«0.6.1»: reestimación tras las correcciones, comprobada con las pruebas que se citan (no es una
tercera auditoría independiente).

## 1. Puntuaciones

### Contenido (0–10)

| Criterio                        | 0.4.0 | 0.6.0 | 0.6.1 |
| ------------------------------- | ----: | ----: | ----: |
| Fidelidad al capítulo           |   9,0 |   9,5 |   9,5 |
| Separación de capas y confianza |   7,5 |   8,5 |   9,0 |
| Coherencia clínica              |   8,0 |   8,5 |   9,0 |
| Calidad del lenguaje            |   8,0 |   8,5 |   8,5 |
| Completitud                     |   8,0 |   9,0 |   9,0 |
| Utilidad de las capas añadidas  |   7,5 |   8,5 |   9,0 |

### Técnica (0–10)

| Área                     | 0.4.0 | 0.6.0 | 0.6.1 |
| ------------------------ | ----: | ----: | ----: |
| Rendimiento              |   8,5 |   8,5 |   9,0 |
| Accesibilidad técnica    |   8,0 |   8,5 |   9,0 |
| PWA y sin conexión       |   8,5 |   9,0 |   9,5 |
| Calidad y mantenibilidad |   7,5 |   8,0 |   8,5 |
| Cobertura de pruebas     |   6,0 |   7,0 |   8,0 |
| Seguridad y privacidad   |   9,0 |   9,5 |   9,5 |
| Robustez                 |   6,5 |   7,5 |   9,0 |

### Uso (0–10)

| Criterio               | 0.4.0 | 0.6.0 | 0.6.1 |
| ---------------------- | ----: | ----: | ----: |
| Heurísticas de Nielsen |   6,7 |   7,8 |   8,4 |
| Encontrabilidad        |   7,0 |   8,0 |   9,0 |
| Ergonomía móvil        |   5,0 |   7,5 |   8,5 |
| Comodidad de lectura   |   8,0 |   8,5 |   8,5 |
| Jerarquía y atractivo  |   7,0 |   8,5 |   8,5 |
| Confianza y capas      |   7,0 |   9,0 |   9,0 |
| Imprimir y compartir   |   7,0 |   8,0 |   8,5 |

### Puntuación del usuario (SUS estimado, 0–100)

| Perfil                                    | 0.4.0 | 0.6.0 | 0.6.1 |
| ----------------------------------------- | ----: | ----: | ----: |
| A · Endocrinólogo sénior, móvil, consulta |    72 |    80 |    85 |
| B · Residente, escritorio, estudio        |    80 |    85 |    87 |
| C · Enfermera educadora, hojas            |    70 |    78 |    82 |

## 2. Lo que se corrigió en la 0.6.1

**Contenido (auditoría A1–A11).** Nota del asterisco bajo las cifras de la Figura 3; 0,15 UI/kg
con su «puede considerarse» y sus condiciones; reevaluación a los 15 min y «no anunciar los
hidratos como comida» en el plan de seguridad (literales, p. 8) y páginas pp. 7-9 y 8-9; diagrama
de ejercicio («orientativamente», prevención y no tratamiento, regla de β-OHB ≥1,0 antes del
ejercicio) y de seguimiento con sus frases literales; rótulos «Cirugía prolongada o compleja, o
inestabilidad clínica» y «… o situación previsible de mayor riesgo de hipoglucemia»; resumen de
parámetros que avisa de lo que difiere; glosario (SEEN, TIRp/TBRp/TARp distintos); filas de
tablas de dos páginas como «pp. a–b»; atajo de β-OHB sin falsos positivos; textos de «Sobre»,
Buscar y pendientes; «enlace añadido» en la referencia 2.

**Técnica (M1–M6 y bajas).** Índice de búsqueda con estado de carga y «Reintentar» (el fallo no
se queda guardado); recarga única ante un trozo que no llega (`src/recarga.ts`,
`vite:preloadError`) y `clientsClaim`; `navigateFallbackAllowlist` solo para la raíz, 404.html con
redirección a `/#/…` y `direccion()` con la raíz de la app; modo nocturno único
(`useSyncExternalStore`), sin guardar el del sistema, con `public/tema.js` antes de pintar;
barra de progreso por `requestAnimationFrame` y `Bloques` memorizado; proyecto de Playwright
«produccion» contra `vite preview` con el service worker (sin conexión: pantallas perezosas,
figuras, paleta y Buscar); orden de encabezados por contexto (`NivelTitulo`) y `heading-order` y
`landmark-unique` activados en las e2e; contraste en resultados violeta; nombre del botón de zoom;
`.gitattributes`; permisos en CI; `X-Robots-Tag: noindex` con rastreo permitido; oyentes de
impresión; la pantalla Buscar, Visual y Pacientes ya no arrastran el índice ni los datos de la
ampliación; el test del autor fuera del trozo de entrada; iconos del manifiesto sin duplicar en
el precache.

**Uso (problemas 1–10).** Búsqueda con «Ir a» (situaciones, fichas, poblaciones, herramientas;
con el sistema elegido si se nombra), sinónimos (RM/resonancia, TC/escáner, quirófano/cirugía,
beta/β-OHB, cetonas, embarazo), siglas cortas solo como palabra entera y orden por palabras
coincidentes; los tres buscadores con los mismos avisos; «Qué mueve el modo automático» arriba de
cada ficha y atajos «Parámetros por sistema» y «Exploraciones y cirugía»; Atrás cierra los
diálogos; «Mostrar el QR» y selector de hojas; migas, logotipo y enlaces con 44 px (24 px los
DOI); «Volver arriba» se esconde a los 2,5 s; precarga de pantallas en un momento libre; barra
«Situación · Cambiar» en el móvil; las filas de las Tablas 4 y 6 en la búsqueda llevan a su
recorrido.

## 3. Verificación

Vitest 74/74; Playwright 56/56 (escritorio, 393 px, nocturno con axe —ahora con
`heading-order`—, hojas en una cara y en letra grande, y producción con service worker);
fidelidad frente al PDF limpia (144/144 párrafos, 216/216 celdas, 115 frases de diagrama en su
página); barrido de rutas a 6 anchos (ver `_audit_rutas.json`).

## 4. Para el autor

1. Liberty: el capítulo la da como comercializada en España (corrección 2/11 y resumen) y la
   ampliación dice «confirmar disponibilidad con Ypsomed»: ¿marca «Difiere» o se actualiza una de
   las dos?
2. Diferencias del 2-10 sin marca ni decisión: A4, C2 y C4 (la C1 coincide con la Tabla 3).
3. V5 para pacientes: «TC» y «PET» sin desarrollar; mezcla de impersonal y usted. E09 usa «SAM».
4. Siguen: E04, E28 y E07; las dos frases de la V5 (5-10 g y pausar la bomba); q03, q04 y q06 del
   test; edad de Liberty; letra grande como formato por defecto para pacientes (opcional).
