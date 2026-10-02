# Manual SEEN · AID

La app que acompaña al capítulo del Manual SEEN **«Tratamiento insulínico del paciente con diabetes
mellitus tipo 1: automatización de la insulinoterapia»** (Georgios Kyriakos. Servicio de Endocrinología y
Nutrición, Hospital General Universitario Santa Lucía, Cartagena).

Una web estática, instalable y que funciona sin conexión, para que un endocrino adjunto o sénior **lea** el
capítulo mejor que en papel, lo **consulte** en dos toques en la consulta y vea cuándo y en qué se ha
**actualizado**. No es la consola asistente-aid ni compite con ella: es el capítulo, hecho usable.

**Material educativo. No es producto sanitario:** sin calculadoras, sin datos de paciente, sin almacenamiento
de nada clínico.

## Qué tiene

- **Leer.** Índice por apartados; cada apartado en una pantalla con su texto íntegro y la página de origen en
  cada bloque; tipografía de lectura larga (tamaño ajustable); modo nocturno; impresión limpia de un apartado
  o del capítulo entero.
- **Consultar.** Las seis tablas; la Tabla 1 (sistemas), la 3 (parámetros) y la 4 (situaciones) filtrables por
  sistema (uno = ficha de lectura; dos o tres = columnas elegidas); la Tabla 6 (exploraciones) por
  procedimiento; la Figura 3 (cetonemia) como recorrido paso a paso en el que se elige el tramo de β-OHB y se
  ve solo esa rama; la infografía como mapa de entrada; glosario de siglas; búsqueda instantánea sobre el texto
  literal (sin IA generativa; `Ctrl K`).
- **Confiar.** Bibliografía con DOI enlazado; «Qué ha cambiado» con la fecha de cada revisión del capítulo y
  de la app; «Sobre esta versión» con alcance, correcciones aplicadas y descargo educativo; los pendientes a
  la vista.
- **Aprender.** Test de autoevaluación con respuesta razonada y la página del capítulo que la justifica
  (estructura lista; dos preguntas de ejemplo marcadas como provisionales, las definitivas las escribirá el
  autor).

- **Sistemas y recorridos (0.2.0).** Una ficha por sistema con su foto oficial: primero «Lo que dice el
  capítulo» (sus columnas de las Tablas 1, 3 y 4 y los párrafos que lo nombran, literales y con página) y,
  aparte y rotulada en ámbar, la **«Ampliación del autor · fuera del capítulo»** (ficha técnica, parámetros
  que mueven el automático, sets de infusión, insulinas compatibles) con sus fuentes (`src/ampliacion/`,
  extraída del proyecto asistente-aid del mismo autor). Recorridos construidos solo con el texto del
  capítulo: «Situación y sistema» (Tablas 4 y 6), «Revisar la descarga» (Tabla 5 en ocho pasos) e
  «Interrupción del sistema» (línea de tiempo). «Cifras del apartado» (`src/contenido/cifras.ts`): los
  umbrales de cada apartado de un vistazo. Figura 1 como diagrama animado.

## Fuente única

El PDF final maquetado del 30-9-2026 (ec-europe, 25 páginas) con sus 11 correcciones editoriales anotadas,
aplicadas en el texto: ver [docs/CORRECCIONES.md](docs/CORRECCIONES.md). Todo el contenido vive en
`src/contenido/` y está tipado; `src/contenido.test.ts` comprueba estructura, páginas, correcciones y
convenciones (DM1/DM2, mg/dl, «duración de la insulina activa»).

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # Vitest (contenido, pantallas, jest-axe)
npm run typecheck
npm run lint
npm run format:check
npm run build        # dist/ + service worker (PWA)
npm run test:e2e     # Playwright: escritorio, móvil 393 px y nocturno con axe
```

Node 20 (probado también en 24). Stack: Vite + React + TypeScript + Tailwind, PWA (vite-plugin-pwa), rutas hash
de tres niveles, Cloudflare Pages.

## Estructura

```
src/
  contenido/        texto literal del capítulo (apartados, tablas, figuras, figura3, bibliografía, glosario, cifras, cambios, test)
  ampliacion/       AMPLIACIÓN DEL AUTOR, fuera del capítulo: fichas de sistemas, sets, insulinas, criterios y sus fuentes
  componentes/      Shell (cromo), Bloques, TablaVista, FiguraVista, Figura3Vista
  pantallas/        Portada, Capitulo, Apartado, Consultar (tablas, figura 3, infografía, glosario), Sistemas, Recorridos, Otras
  ui.tsx tokens.ts index.css rutas.ts prefs.ts buscador.ts texto.tsx imprimir.js
e2e/                Playwright (smoke, movil, nocturno) + axe
docs/CORRECCIONES.md
public/figuras/     imágenes de la maquetación (provisionales, a falta de los archivos fuente)
```

## Publicación

Cloudflare Pages, proyecto `manual-seen-aid` (wrangler 4; `npx wrangler pages deploy dist --project-name=manual-seen-aid`).
El flujo `deploy-cloudflare.yml` publica con cada push a `main` si pasan las puertas de calidad (necesita el
secreto `CLOUDFLARE_API_TOKEN`). `public/robots.txt` lleva `Disallow` hasta que la SEEN dé el permiso y el
dominio.

## Pendiente (no se ha inventado nada para rellenarlo)

- Permiso escrito de la SEEN y de ec-europe para la versión web, y dónde se aloja.
- Las preguntas del test de autoevaluación.
- Los archivos fuente de la infografía y de las figuras (hoy solo imágenes de la maquetación).
- La fecha de publicación del capítulo en el Manual SEEN.

## Convenciones

Castellano de España; siglas DM1/DM2; unidades `mg/dl` y `mmol/l`; «duración de la insulina activa» (nunca
«AIT»). Reglas completas para quien toque el código: [AGENTS.md](AGENTS.md).
