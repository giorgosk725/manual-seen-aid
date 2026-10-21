# Sistema visual (rama diseno-visual, 15-10-2026)

Reglas del rediseño visual de la rama `diseno-visual`. Objetivo: un solo lenguaje en todas las
pantallas de consulta, con la identidad del Manual SEEN (`src/tokens.ts`), calmado y legible en
el móvil y en papel. Lo que no está aquí sigue las utilidades de Tailwind; lo que está aquí se
aplica con las clases de `src/index.css` (`@layer components`).

## 1. Superficies: dos, no cinco

| Clase                      | Qué es                                                                            | Dónde                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `.tarjeta`                 | Papel blanco, borde capilar (`--linea`), esquinas de 8 px. Sin sombra en reposo.  | Toda tarjeta, lista en caja, caja de pantalla.                              |
| `.tarjeta.tarjeta-sistema` | La misma, con una pleca de 3 px del color del sistema (`--sis`) a la izquierda.   | Lo que es DE un sistema (ficha, casillas de tabla, bloques por sistema).    |
| `.tarjeta.tarjeta-realce`  | La misma, con el borde del color del sistema (2 px).                              | Lo que cuenta en automático (efecto directo).                               |
| `.casilla`                 | Celda gris (`--papel-2`), sin borde, esquinas de 6 px; pleca opcional de sistema. | Casilla literal de una tabla dentro de otra caja, dato dentro de una tarea. |
| `.literal`                 | Pleca gris fina a la izquierda.                                                   | Texto literal del capítulo (convención anterior, se conserva).              |
| borde discontinuo          | Solo notas complementarias y correcciones (`NotaCorreccion`, notas por pasaje).   |                                                                             |

Fondos tintados por sistema (`SISTEMA_HEX.soft`) quedan SOLO en las celdas de la comparación
(Tabla 1/3 a cuatro columnas), en los chips de datos (sensores) y en la casilla marcada del
selector. Nunca como fondo de una tarjeta entera.

## 2. Escala tipográfica

| Papel                      | Clase                     | Medida                                                                                                                           |
| -------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Título de pantalla (h1)    | `CabeceraEditorial`       | Oswald 500, mayúsculas, 20 px, regla con tramo burdeos.                                                                          |
| Título de sección (h2)     | `.titulo-seccion`         | Open Sans 700, 17 px. Con número delante (`.num`) cuando es un paso.                                                             |
| Título de tarjeta (h3)     | `.titulo-tarjeta`         | Open Sans 700, 15 px.                                                                                                            |
| Rótulo de dato             | `.rotulo`                 | Open Sans 600, 12 px, mayúsculas, tracking 0,06 em, gris (`--tinta-3`); en color de sistema solo con `style={{ color: h.ink }}`. |
| Rótulo de área (identidad) | `.etiqueta-area`          | Oswald 500, mayúsculas, 11–12 px: solo en la barra lateral, la portada y las cabeceras de pantalla.                              |
| Cuerpo de consulta         | `text-[15px]`             | Open Sans 400, 15 px / 1,5.                                                                                                      |
| Cuerpo secundario          | `text-sm`                 | 14 px.                                                                                                                           |
| Notas y fuente             | `text-xs` / `.fuente-pie` | 13 px, gris (`--tinta-3`); los enlaces de la fuente en seminegrita `--tinta-2`.                                                  |
| Lectura del capítulo       | `.prosa`                  | 17 px / 1,7 (sin cambios).                                                                                                       |

No hay texto de interfaz por debajo de 12 px (antes había 10 y 11 px).

## 3. Color

- **Burdeos** (`SEEN.burdeos`): el único acento de interacción: pestaña activa, chip marcado,
  botón principal, paso activo, número de paso activo.
- **Color de sistema** (`SISTEMA_HEX`): solo identidad del sistema: pleca de la tarjeta, nombre,
  rótulos de sus datos, casilla del selector, celdas de la comparación.
- **Colores de área** (`CATEGORIA_HEX`): acentos pequeños (icono de cabecera en la portada y en
  el menú). Nunca fondos de texto.
- **Semántico clínico** (`TRAMO_HEX`, ámbar, rojo): solo señal clínica (Figura 3, comprobaciones
  previas, fuera de indicación). Se conserva tal cual.
- **Grises**: neutros del Manual (`slate` → `neutral`). Texto: 900 títulos, 800 cuerpo, 600
  secundario, 500 rótulos y fuente.

## 4. Controles

- `.chip`: selector de opción (una entre varias o varias): borde capilar, esquinas de 6 px,
  44 px de alto en el móvil (36 desde `sm`); marcado = fondo burdeos y texto blanco
  (`aria-pressed="true"`). Sin píldoras.
- `.num`: número de paso en círculo de 24 px; activo en burdeos.
- Botón principal: burdeos, esquinas de 6 px, 44 px. Secundario: borde capilar, blanco.
- Pestañas (secciones de la ficha, Resumen/Características/Parámetros): texto con subrayado
  burdeos de 2 px.
- Filas de lista (`.fila`): 44 px, nombre en seminegrita, sin icono ni flecha; separadas por
  líneas suaves; hover gris.

## 5. Iconos

Solo donde orientan: barra lateral y barra inferior (uno por destino), cabecera de cada bloque
de la portada (uno, en el color del área), avisos clínicos (triángulo) y acciones (imprimir,
enlace externo). Sin icono por fila, sin cuadros de icono en las tarjetas de datos, sin flecha
al final de cada fila.

## 6. Ritmo

- Entre secciones de una pantalla: 24 px (`space-y-6` / `mt-6`).
- Entre tarjetas de una rejilla: 12 px (`gap-3`).
- Dentro de una tarjeta: 16 px (`p-4`) en las tarjetas de datos de las fichas (`TarjetaDatos`) y en cajas de lectura; 12 px (`p-3`) en las tarjetas compactas (Parámetros de los cuatro, casillas);
  rótulo → valor: 4 px; valor → fuente: 8 px.
- Rejillas sin huecos: con un número impar de tarjetas, la última ocupa la fila entera
  (`.ultima-ancha`).
- Móvil: controles en una fila (enlaces de texto, no botones apilados); el contenido empieza
  en la primera pantalla.

## 7. Modo nocturno e impresión

Las superficies, bordes y rótulos leen variables (`--papel`, `--superficie`, `--linea`,
`--tinta-*`), redefinidas en `html.night`; los colores de sistema y los clínicos no cambian.
Toda clase nueva lleva su valor nocturno en la propia variable, no en una regla aparte. En papel
las tarjetas se imprimen con borde y sin sombra; la pleca de sistema se imprime (color exacto).

## 8. Segunda vuelta (auditoría 8,1 → objetivo ≥ 9)

- **Rejillas**: `items-start` siempre (ninguna tarjeta se estira hasta la más alta de su fila);
  en Interrupción, los casos de una fila comparten subrejilla (`md:grid-rows-subgrid`) para
  que las cabeceras de color queden a la misma altura.
- **Un solo h1**: `CabeceraEditorial` (Oswald, mayúsculas, 20–24 px). La ficha de un sistema lo
  lleva en el color del sistema con la foto a 64 px. La única excepción documentada es la
  portada: el título del capítulo tal cual, en negrita, como en el Manual.
- **Un solo selector de sistema**: `CasillasSistema` (casilla + punto de color) en Sistemas,
  Tablas, Iniciación (fases y cálculo), Situaciones y bloques por sistema. Las fotos quedan
  para enlaces de navegación (portada, planes del paciente, comparación), no para seleccionar.
- **Pestañas** (`.pestana`, subrayado burdeos) en la ficha, en Sistemas, en Iniciación
  («Cálculo · Fases · Hoja») y en Tablas («Tabla N · tema»). En el móvil, una fila con
  desvanecido a la derecha (`data-mas`) y la activa a la vista.
- **Iconos**: ninguno por fila ni en cabeceras de tarjeta (índice del capítulo: número gris y
  punto de 8 px del color del área; diagramas y preguntas: `.filas`; Interrupción: rótulos).
- **Letra mínima 12 px** también en el rótulo del móvil («Manual SEEN · Complemento
  interactivo» en una línea), la barra lateral, el deslizador de la calculadora, la Figura 3 y
  los ejes de los diagramas.
- **Sin cabecera fija en el ordenador**: el modo nocturno (y el tamaño de letra en la lectura)
  van al pie de la barra lateral, siempre a la vista. En el móvil, la ficha deja un cromo fijo
  de ≈ 102 px (cabecera + pestañas); «Otro sistema o comparación» es un enlace de la cabecera.
- **Fuentes**: una línea `Fuente:` al pie de cada sección, también cuando la sección tiene los
  bloques añadidos de `porSistema.ts` (una sola línea para todo).
- **Nocturno**: tintes por sistema con `color-mix` del color fuerte sobre la superficie; fotos
  de sistema con `.foto-sistema` (brillo 0,85).
- **Papel**: la ficha imprime todas sus secciones (`hidden print:block`); la Tabla 1 cabe en A4
  vertical (`table-layout: fixed`); los controles de Iniciación no se imprimen; sin chevrones.
- **Hover**: sin sombra; el borde se oscurece (`.hover-lift`).

## 9. Tercera vuelta (auditoría 8,4 → objetivo ≥ 9)

- **Rejillas sin escalera**: en «Cómo funciona» las filas cortas de la Tabla 1 se agrupan en
  tres tarjetas (sensores + localización + objetivo · lógica · estrategia + bolos); el resumen
  de Sistemas fluye en dos columnas (`columns-2`, `break-inside-avoid`); Figuras con la fuente
  al pie de cada tarjeta (`flex-col`, `mt-auto`); en Interrupción, pod y bomba en una tarjeta y
  las cabeceras de color con alto fijo (`md:min-h-[4.75rem]`) sin subrejilla.
- **Un botón principal** (`.boton-primario`, burdeos) en Imprimir la hoja, hojas del paciente,
  Actualizar y Recargar.
- **Iniciación**: «Nuevo inicio» en la fila de las pestañas (sin banda vacía; no salta nada al
  escribir el primer dato).
- **Barra lateral**: cabe en 900 px sin desplazar (filas de 40 px, márgenes cortos; medido
  857/857 px); en Buscar, la caja de búsqueda deja su sitio (invisible) para que el menú no
  salte.
- **Ficha**: el h2 de cada sección es solo para el lector de pantalla (la pestaña activa ya lo
  dice) y visible en papel; «Siglas de la tabla» tras la línea de fuente, plegado en pantalla y
  abierto en papel.
- **Nocturno**: miniaturas de figuras y fotos de sistema con `brightness(0.8) contrast(1.05)`;
  casillas con acento burdeos; un solo anillo de foco (contorno burdeos, el anillo gris apagado).
- **Figura 3 móvil**: la barra de cuatro colores solo con las cuatro tarjetas en fila (`lg`).
- **Pulido**: casillas de sistema a 2 × 2 en el móvil; rótulos de la descarga todos en gris;
  «Ampliar» como chip; h1 a 20 px; en una tarea, una fila numerada de la Tabla 5 lleva de
  título su elemento (sin «1» suelto).

## 10. Cuarta vuelta (auditoría 8,5 → objetivo ≥ 9)

- **Un solo foco en toda la app**: `*:focus-visible` = contorno burdeos de 2 px (rosa del
  burdeos de noche), con los anillos de Tailwind apagados (`--tw-ring-shadow: 0 0 #0000`);
  pestañas y filas con el contorno por dentro (`outline-offset: -2px`); la tira de pestañas
  deja 4 px (`padding-block`/`margin-block` negativos) para que el contorno no se recorte.
- **Barra lateral**: cabe en 768 px de alto sin desplazar (719 px): el grupo «Recursos»
  (bibliografía, sobre) va al pie, en letra pequeña junto al modo nocturno; por debajo de 768
  el menú se desplaza. En Buscar, la caja es un acceso discreto (borde discontinuo) a la caja
  de la pantalla, con su mismo alto.
- **Interrupción**: cabeceras de dos líneas como máximo (`md:min-h-[3.6rem]`), con tinte de su
  color también de noche (`.cabecera-tramo`, `color-mix` con `--tono`).
- **Sin escalera**: las rejillas de tarjetas de datos (Parámetros, Modos, bloques por sistema,
  Situación por sistema) fluyen en columnas (`sm:columns-2`, `break-inside-avoid`); Elección
  vuelve a alinear sus cuatro tarjetas como una tabla; el resumen de Sistemas es una tarjeta por
  fila en el orden de la Tabla 1 con los datos en tres columnas.
- **Figuras**: tarjetas de igual alto, el espacio sobrante en el área de la imagen (centrada
  sobre blanco), no entre el título y la fuente.
- **Ficha**: en el móvil, sin migas (la barra inferior ya lleva a Sistemas) y los accesos en una
  fila con nombres cortos (el contenido empieza a 244 px); en papel se imprimen todas las
  secciones, también Modos y Preguntas.

## 11. Quinta vuelta (auditoría 8,7 → objetivo ≥ 9)

- **Dos columnas equilibradas** (`componentes/DosColumnas.tsx`, `repartoEquilibrado` en
  `src/disposicion.ts`): las tarjetas de datos (Parámetros, Modos, Indicación, bloques por
  sistema) se reparten entre dos `<dl>` por el reparto que más iguala sus alturas REALES (se
  miden tras pintar; primero por estimación con `lineasDe`), conservando el orden dentro de
  cada columna (se lee la izquierda y luego la derecha). En una columna —móvil y papel— se
  enseña la lista en su orden original.
- **Ficha**: las cinco secciones se montan siempre; en pantalla se ve la de la pestaña, en papel
  todas (comprobado con emulación de impresión).
- **Pestañas**: la que recibe el foco se trae a la vista (`pestanaALaVista`,
  `scroll-padding-inline: 12px`); el contorno por dentro (`outline-offset: -2px`) vive fuera de
  `@layer` para ganar a la regla global.
- **Figuras**: «Ampliar» en su propia fila sobre la imagen, nunca encima del dibujo.
- **Interrupción**: el cuerpo de cada caso es un bloque (mismo aire arriba y abajo).
- **Pulido**: las tres tarjetas de «Cómo funciona» a la misma altura; accesos de la portada a
  12 px; en Elección, «Sensores compatibles» a lo ancho; nombres cortos en los planes del
  paciente.

## 12. Sexta vuelta (auditoría 8,8 → objetivo ≥ 9)

- **Rejillas sin vacíos**: las tarjetas de una misma fila (Interrupción, Figura 3) se estiran a
  la misma altura (sin `items-start`); el aire sobrante queda dentro de la tarjeta, no como un
  hueco entre filas.
- **Una sola rejilla por sección**: en Parámetros y Modos, las filas de la tabla y los bloques
  del sistema (`porSistema.ts`) entran en el mismo `DosColumnas` (`ColumnaTabla` con
  `anadidos`; tarjetas en `componentes/tarjetasDeBloques.tsx`): reparto contiguo, en el orden de
  la tabla y después los bloques (izquierda y luego derecha), igual en las cuatro fichas. Si
  aun así el pie de las columnas queda desigual, la última tarjeta pasa a todo lo ancho,
  cerrando la sección (solo cuando iguala las columnas en más de una línea; se decide una vez
  con las alturas medidas y no se revisa, para que no oscile; `key` por tabla y sistema).
- **Situaciones**: los grupos van en dos columnas desde `lg` con `DosColumnas`
  (`etiqueta="div"`, `desde="lg"`) y reparto `libre` (`repartoLibre`): son grupos independientes
  sin un orden de tabla que mantener, así que cada uno va a la columna más corta (el primero,
  siempre arriba a la izquierda); en el móvil, la lista en su orden.
- **Nombres de sistema** (`componentes/NombreSistema.tsx`): «Tandem Control-IQ / Control-IQ+»
  solo puede partirse en la barra; cada parte va en un tramo `whitespace-nowrap` dentro de un
  solo `span` (en un contenedor flex, las partes sueltas no se partían). El texto no cambia.
- **Portada**: los accesos de cada ficha (Parámetros · Iniciar · Preguntas) en una fila flexible
  (`xl:flex-auto`, `px-2`), con el ancho que pide cada palabra y no a tercios.
- **Ficha en papel**: bajo cada pregunta frecuente se imprimen sus pasajes literales
  (`RespuestaImpresa`: párrafos, listas y filas de tabla resueltos desde `contenido`, sin el
  motor de búsqueda; `hidden print:block`).
- **Elección**: las cuatro tarjetas comparten filas (`sm:grid-rows-subgrid`,
  `grid-row: span 15`; título + 5 criterios + 2 filas de la Tabla 1 como pares dt/dd), así cada
  rótulo queda a la misma altura en las cuatro, aunque el título de Tandem ocupe dos líneas.
  Tailwind 3.4 no genera `row-span-[15]`: se usa `row-[span_15/span_15]`.
- **Figuras en el móvil**: tarjeta apaisada (miniatura de 120 px con su proporción real y el
  chip «Ampliar» debajo; título y fuente a la derecha), una por fila; desde `sm`, la tarjeta
  vertical de antes.
- **DosColumnas** admite `etiqueta` (`dl`/`div`), `desde` (`sm`/`lg`) y `orden`
  (`contiguo`/`libre`); la medición busca `:scope > * > [data-i]`.

## 13. Séptima vuelta (auditoría 8,9 → objetivo ≥ 9)

- **Ficha en papel sin repeticiones**: `RespuestaImpresa` resuelve cada identificador de pasaje
  a su frase exacta (`t/apartado/bloque/frase`, con `frases(plano(texto))`, como el buscador),
  a su punto de lista (`l/…/punto`) o a su fila o nota de tabla; las frases seguidas de un mismo
  párrafo se juntan y nada se imprime dos veces.
- **Sistema a sistema (Situaciones y diagrama de gestación)**: el sistema elegido es el de la
  ruta (`BloquesPorSistema` es controlado: `seleccion` + `onElegir`); la casilla escribe la ruta
  con `elegirRuta` (reemplaza, como las situaciones de la Tabla 4), así Atrás/Adelante y los
  enlaces compartidos enseñan siempre el sistema de la URL. Lo común a los cuatro («Objetivos de
  inicio») va a todo lo ancho debajo de las dos columnas del sistema.
- **DosColumnas, tarjetas a lo ancho**: hasta dos tarjetas pueden ir a todo lo ancho, de una
  en una: la última o la más alta de las que quedan, solo si cada paso iguala las columnas en
  más de una línea (24 px) y quedan al menos dos en columnas. Conservan su sitio en la lectura:
  las que preceden a todo lo que queda en columnas van encima (gestación con CamAPS:
  «Autorización» y «Objetivo» a lo ancho y después dos columnas); las demás, debajo, cerrando la
  sección. Lo que la
  contigüidad no deja igualar (Características de CamAPS: 97 px; Modos de Control-IQ: 56 px) se
  queda, antes que alterar el orden de la tabla.
- **Foco dentro de las tarjetas** (`.foco-dentro`, junto a `.pestana` y `.fila`): contorno por
  dentro (`outline-offset: -2px`) en los enlaces de las casillas de sistema de la portada, que
  viven en una tarjeta con `overflow-hidden`.
- **Situación por sistema sin sistema elegido**: las dos tarjetas de cada fila a la misma altura
  (sin `items-start`).
- **Tabla 1 impresa**: la cabecera de cada sistema con `NombreSistema porPalabra` (la línea solo
  cambia en los espacios; «Control-IQ» nunca se parte). El texto literal no cambia.
- **Situaciones, un solo orden**: los grupos van en el orden que, partido en dos tramos contiguos
  (reparto por defecto de DosColumnas), llena dos columnas parejas (39 px); así la lista se lee
  igual en el móvil, en el lateral y en las dos columnas. Se eligió reordenar la fuente antes que
  el reparto libre (que daba el mismo resultado visual pero otro orden en el móvil).
- **Interrupción, regla**: en filas de tarjetas narrativas de longitud muy distinta
  (Interrupción), la banda de cabecera queda alineada (`md:min-h-[3.6rem]`) y cada tarjeta acaba
  con su texto (`items-start`): sin aire vacío dentro. En filas de tarjetas de datos de longitud
  parecida (Figura 3, Parámetros, Elección) las alturas se comparten.

## 14. Fichas operativas (0.77.0–0.77.1; auditorías de cinco perfiles y visual, 19-10-2026)

- **Sin texto literal en las tarjetas de sistemas** (decisión del responsable): datos cortos en
  `src/fichaOperativa.ts`, las mismas filas y en el mismo orden en los cuatro sistemas. Cada dato:
  `v` (en negrita), `n` (detalle, 13 px, gris), `cond` (condición de la fila de la Tabla 4, como
  primera línea de la columna del dato), `variante` (Control-IQ+, Liberty: insignia a la
  izquierda y texto al lado, en rejilla `auto 1fr`) y `f` (piezas del capítulo → línea de fuente).
  Una prueba exige que cada cifra esté en el texto citado.
- **Dos formas**: `CasillasDatos` (datos cortos: filas en el móvil, rejilla desde sm; modo
  `resumen` en la entrada, filas otra vez a dos tarjetas por fila) y `FilasDatos` (Parámetros y
  Modos: rótulo a la izquierda, pulsable, que lleva al literal —la tabla con la columna del
  sistema o el párrafo resaltado—; insignia «Actúa en automático / Bolos o modo manual / Solo al
  inicio y en manual / No configurable»).
- **Sin cortes**: `SinCortes` pone espacio duro entre cifra y unidad, tras < > ≤ ≥ y en «EE. UU.»,
  «tipo 2», «ratio I/HC», y no parte los intervalos con raya.
- **Selector de sistema**: casillas (varios) en Sistemas; botones de opción (`unico`, uno) en
  Situaciones y en el diagrama de gestación.
- **Entrada de Sistemas AID**: 2 × 2 desde xl, misma altura por fila, accesos al pie; sin flecha.
  En el móvil, accesos en rejilla 3 × 2 con borde fino en los dos temas.
- **Ficha**: título a 20 px como el resto; en el móvil, con la barra plegada, el nombre corto del
  sistema encima de las pestañas; en «completa», ninguna pestaña marcada y los títulos a la vista.
- **Papel**: `.tarjeta-datos` y las filas de `.filas-datos` no se parten; los títulos no se
  quedan solos al pie; bajo cada pregunta frecuente, solo los párrafos (las filas de las Tablas
  1–4 ya las resumen las tarjetas).

## 15. Revisión de tarjetas fuera de las fichas (0.92.0, 21-10-2026)

Revisión de diseño de las tarjetas de todo lo que no son las fichas de los sistemas (Situaciones,
Iniciación, Interrupción, Buscar, Preguntas, Figuras y diagramas, Material para el paciente,
portada). Solo diseño y estructura: ningún texto clínico cambia.

### Inventario: seis tipos de tarjeta, y nada más

| Tipo                 | Receta                                                                                                                                                                                                  | Dónde                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Tarjeta de lista     | `.tarjeta overflow-hidden` + `h2/h3.titulo-tarjeta px-3 pt-3 pb-1.5` (en `--tinta`) + `ul.filas` de `.fila` sin flecha.                                                                                 | Grupos de Situaciones y de diagramas, «Véase también», bloques de la portada.                   |
| Tarjeta de contenido | `.tarjeta p-4` (p-3 en el móvil si lleva otra caja dentro), título `.titulo-tarjeta` 15/700, cuerpo 15 px, fuente al pie.                                                                               | Cabecera y conducta de una situación, guion, fases, diagramas, Figura 3, pregunta frecuente.    |
| Tarjeta de sistema   | `.tarjeta.tarjeta-sistema` con `--sis`: solo si el enlace o el dato es de ese sistema; nombre en `SISTEMA_HEX[c].ink`.                                                                                  | Casilla de la Tabla 4 del sistema, bloques de `porSistema.ts`, temas de sistema en Preguntas.   |
| Casilla gris         | `.casilla` (gris, sin borde); `.casilla-sistema` solo si el dato es de un sistema y nunca igual que la pleca del contenedor.                                                                            | «Recomendación orientativa», lo común a los cuatro, lo añadido al sistema dentro de su tarjeta. |
| Aviso clínico        | Una receta por nivel. Ámbar: `rounded-md border` `#f3d38a` sobre `#fffbeb`, texto ámbar 900. Rojo: `rounded-md border border-red-200 bg-red-50 text-red-900` (`UrgenciaF3`; en papel, `.hoja-urgente`). | Comprobaciones previas, notas de la calculadora; urgencia de la Figura 3 y de las hojas.        |
| Nota complementaria  | Borde discontinuo (`border-dashed`), 13 px.                                                                                                                                                             | Notas por pasaje, correcciones.                                                                 |

Retirados: el borde de 2 px burdeos en tarjetas (queda solo como foco de la caja de búsqueda),
el borde gris pizarra y el azul de los pasajes, la pleca burdeos en lo que no es un sistema
(cabecera de situación, infografía, «Todos los sistemas», primera columna de una fila de la
Tabla 2) y la pleca y el título en color de área (grupos de Figuras y diagramas, grupos de
Situaciones).

### Reglas aplicadas

- **«Véase también», una forma** (`componentes/VeaseTambien.tsx`): la tarjeta de lista. Dentro de
  otra tarjeta (una tarea, un paso de Iniciación, una respuesta de Buscar), `enCaja`: la misma lista
  sin marco, tras una línea y alineada con el texto de la caja; el nivel del título, uno por debajo
  del de la caja. Sustituye al rótulo con chips con flecha y a la línea «Véase también: X →».
- **Títulos dentro de tarjetas, 15/700** (`.titulo-tarjeta`): cabecera de situación, Figura 3,
  objetivos de MCG por población, título de un diagrama, figuras de la galería, portada. 17 px
  (`.titulo-seccion`) solo fuera de las tarjetas («Preguntas por sistema», títulos de sección).
- **Situación, orden fijo**: selector → tarjeta del sistema (con lo que los apartados 9 y 10
  añaden para él, en casillas grises dentro de ella) → lo común a los cuatro en casilla gris sin
  pleca. Las comprobaciones previas del ejercicio siguen antes de todo (S61-01).
- **Guion de una situación**: números en gris (en burdeos solo el paso activo de un recorrido,
  como en la descarga) y sin chevrón (cada momento va abierto; el título lo sigue plegando).
- **Iniciación, fases**: el título del paso (h3) solo para el lector de pantalla (repetía el paso
  marcado y su «2.» se confundía con el de la fase); las casillas de las piezas sin pleca dentro de
  una tarea (la pantalla ya es del sistema).
- **Fuentes sin repetir** (`fuentesDePiezas`): la entradilla solo distingue dos sitios que se
  escriben igual si todos la tienen; sin paréntesis dentro del paréntesis («Configuración
  inicial (v. Tabla 2)» → «Configuración inicial»).
- **Interrupción**: sin alto fijo en la cabecera de color. Cada caso ocupa dos filas de una
  subrejilla (`md:row-span-2 md:grid-rows-subgrid`): las cabeceras de una fila toman la altura de
  la más alta (61 px en la fila de tres, donde una va en dos líneas; 41 px en la de dos, antes 58)
  y el cuerpo acaba con su texto (`self-start`); la tarjeta se dibuja en sus dos partes.
- **Buscar**: pregunta frecuente, «Abrir» y pasajes, la misma `.tarjeta` con su rótulo en burdeos;
  los pasajes de dentro, separados por líneas (sin marco dentro de marco). En una fila por sistema,
  los chips son el filtro (con el punto del sistema) y las casillas, `casilla casilla-sistema` con
  el nombre en su color.
- **Calculadora**: «Pauta previa» como chips de dos líneas (`.chip`, mismo marcado que el resto de
  opciones) en tres columnas iguales; los objetivos del calculador apilados al mismo ancho.
- **Plan del paciente**: el selector de toda la app (`CasillasSistema unico enFila`: en el móvil,
  las cuatro en una fila, marca arriba y nombre debajo); una sola receta de urgencia y 15 px en
  toda la hoja.
- **Preguntas frecuentes**: «Preguntas por sistema» (h2, 17 px) a todo lo ancho antes de los cuatro
  temas de sistema, que van como tarjeta de sistema con el nombre en su color. Los catorce grupos
  siguen plegados (decisión pendiente del autor).
- **Portada en el móvil**: las tres situaciones con pantalla propia como filas a todo lo ancho;
  desde sm, chips con las demás.

### Excepciones documentadas

- **Portada, tarjeta del título**: esquinas de 4 px (`rounded-[4px]`), como la cubierta del Manual;
  es la única tarjeta con otro radio.
- **Figura 3, tramos de β-OHB**: botones con el tinte y el borde de su tramo (`TRAMO_HEX`) y
  esquinas de 8 px: son señal clínica, no tarjetas de contenido.
- **Interrupción, cabeceras de caso**: banda tintada con el color de su riesgo y filete superior de
  4 px (verde, amarillo, rojo; gris en las programadas).
- **Portada, «Hiperglucemia y cetonemia»**: el chip (y la fila en el móvil) con el tinte naranja
  de la Figura 3.
- **Situaciones, fila elegida**: fondo burdeos con texto blanco (estado de selección, no tarjeta).
- **Tarjeta de pantalla** (el paso de la descarga, la fase de Iniciación): la tarjeta que es la
  pantalla misma lleva su título a 17/700 (`.titulo-seccion`), no a 15/700: es el título de la
  pantalla, no el de un bloque dentro de ella.
- **Plan del paciente, selector a 360 px**: las cuatro casillas en una fila (decisión previa,
  con prueba); «MiniMed 780G» puede ir en dos líneas dentro de su casilla.
- **Comparación de sistemas y selector**: los fondos tintados por sistema (§1) se mantienen.
- **Fichas de los sistemas** (`FichaOperativa`, `ComoFuncionaOperativo`, Resumen y Parámetros):
  fuera de esta revisión (se revisan aparte).

## 16. Rediseño 0.94 (21-10-2026)

Objetivo: que las fichas de los sistemas y la comparación se lean como una hoja técnica de manual
(un dato en dos segundos), con el mismo lenguaje en las cuatro fichas y en el resto de pantallas.
Solo diseño: ningún texto clínico cambia. Recorrido previo con capturas a 1440 y 390 px, en claro y
en nocturno (fichas, Resumen, comparación, Tablas, Situaciones, Figura 3, Interrupción, Iniciación,
descarga, Buscar, Preguntas, Material para el paciente).

### Diagnóstico

- **Tablas comparativas** (Tabla 1, 3 y 4 en Sistemas y en Tablas): la cabecera azul marino
  (#15324f) era lo más pesado de la app y no es ni el burdeos ni el color de ningún sistema; los
  nombres en versalitas («MYLOOP CAMAPS») perdían su grafía; cada celda era una caja tintada con
  2 px de blanco alrededor (un mosaico que se leía por casillas, no por filas).
- **Cabecera de la ficha**: sin la regla de color que llevan los demás títulos de pantalla; la fila
  de accesos (cinco enlaces subrayados) se leía como una segunda fila de pestañas; el selector y las
  pestañas, dentro de una caja con borde y esquinas, parecían un formulario, y la pestaña activa no
  se apoyaba en ninguna línea.
- **Tarjetas de datos** («Cómo funciona», «Indicación y material»): en la rejilla de tres columnas
  los datos de una fila no tenían línea que los alineara; el subrayado de puntos de cada rótulo
  (que lleva al literal) era la textura más visible de la tarjeta.
- **Filas de Parámetros y Modos**: el mismo subrayado, en rótulos de dos y tres líneas.
- **Pulido**: «Imprimir este paso» se partía en dos líneas a 1440 px.

### Cambios (antes → después)

| Pieza                         | Antes                                                                                  | Después                                                                                                                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cabecera de tabla comparativa | Marino, texto blanco en versalitas, foto en caja blanca.                               | Superficie del papel con filete superior de 3 px del color de cada sistema; nombre con su grafía, 14/700, en la tinta del sistema; línea capilar debajo. Pegada al bajar, como antes.                                  |
| Celdas de la comparación      | Fondo tintado por sistema con 2 px blancos (mosaico); cebra.                           | Blancas, separadas por líneas capilares (filas) y finas verticales (columnas); la columna de rótulos en `--papel-2`. La fila de la que se viene sigue marcada en burdeos suave.                                        |
| Cabecera de la ficha          | Título sin regla; accesos subrayados.                                                  | Regla de pantalla (tramo del color del sistema + línea fina), como `CabeceraEditorial`; accesos como enlaces de texto sin subrayado separados por «·» (subrayado al pasar), como en las tarjetas del Resumen.           |
| Selector y pestañas           | Caja con borde y esquinas (desde sm).                                                  | Sin caja: casillas y, debajo, la tira de pestañas apoyada en una línea capilar a todo lo ancho; la activa, subrayado burdeos sobre esa línea. En el móvil, igual que antes (ya iba a sangre con su línea).             |
| Tarjeta de datos              | Título y casillas sueltas.                                                             | Cada dato abre con una línea capilar (`border-t`) a todo su ancho: las filas de la rejilla quedan alineadas como en una hoja técnica; el título queda encima de la primera línea.                                       |
| Rótulo-enlace al literal      | Subrayado de puntos gris medio.                                                        | Subrayado de puntos en `--linea-fuerte` (se intuye, no se impone); sólido y oscuro al pasar o con el foco. Igual en las filas de Parámetros y Modos.                                                                  |
| Imprimir este paso            | Partido en dos líneas.                                                                 | En una línea (`whitespace-nowrap`).                                                                                                                                                                                        |

### Reglas que se añaden

- **Una tabla comparativa no lleva fondo de color en las celdas**: la identidad del sistema va en la
  cabecera (filete, foto y nombre). Retira la excepción de §15 («Comparación de sistemas y selector:
  los fondos tintados se mantienen») para las celdas; el selector conserva su marcado.
- **Toda cabecera de pantalla lleva su regla** (tramo de color + línea fina), también la ficha.
- **Los rótulos que llevan al literal** se subrayan en `--linea-fuerte`; nunca más oscuros que el
  propio rótulo en reposo.
- **Tira de pestañas**: siempre apoyada en una línea capilar a todo lo ancho.
