# Sistema visual (0.76.0, 15-10-2026)

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
