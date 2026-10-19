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
- Dentro de una tarjeta: 12 px (`p-3`) en tarjetas de datos, 16 px (`p-4`) en cajas de lectura;
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
