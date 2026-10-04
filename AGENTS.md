# AGENTS.md — Manual SEEN · AID

Onboarding for coding agents. Read this fully before changing anything. If a rule here conflicts
with a "default" instinct, this wins.

> The app is in **Spanish** (Castilian). All user-facing text, comments and content stay in
> Spanish. This file is in English for the agent's benefit.

## 0. What this project is

A **static, installable, offline-first web app** that makes ONE book chapter usable: «Tratamiento
insulínico del paciente con diabetes mellitus tipo 1: automatización de la insulinoterapia»
(author: Georgios Kyriakos; Manual SEEN, Sociedad Española de Endocrinología y Nutrición; typeset by
ec-europe). Readers are senior endocrinologists who READ it, LOOK THINGS UP in clinic (on the phone)
and SEE when it changed. The SEEN may link or host it next to the chapter.

It is **not** the `asistente-aid` console and does not compete with it. No calculators.

## 1. CRITICAL RULES

1. **Single source = the chapter.** Every word of content in `src/contenido/` is literal text of the
   final typeset PDF (30-9-2026, 25 pages) with the 11 editorial corrections applied
   (`docs/CORRECCIONES.md`). Each block carries its source page. **Never invent content, never
   import text from other sources, never "improve" the author's wording.** Figures that are images
   in the PDF are transcribed box by box.
2. **Educational, no clinical data.** No calculators, no patient inputs, no storage of anything
   clinical. The only persisted things are reader preferences (night mode, font size) in
   `localStorage` via `src/prefs.ts`. This keeps the SEEN free of regulatory filing.
3. **Layer separation.**
   - Content → `src/contenido/` only (typed by `tipos.ts`; `index.ts` re-exports). One file per
     range of sections, plus `tablas.ts`, `figuras.ts`, `figura3.ts`, `bibliografia.ts`,
     `glosario.ts`, `cambios.ts`, `test.ts`.
   - UI primitives → `src/ui.tsx`; design tokens → `src/tokens.ts`; routing → `src/rutas.ts`
     (hash routes, three levels `#/seccion/sub/detalle`); search → `src/buscador.ts`.
   - Screens → `src/pantallas/`; shared pieces → `src/componentes/`; `src/App.tsx` is only the
     router; `src/componentes/Shell.tsx` only the chrome.
4. **Writing conventions (mandatory):** Castilian Spanish; `mg/dl`, `mmol/l` lowercase; `UI` for
   insulin units; **«DM1»/«DM2»**, never «DT1»/«DT2» (the chapter's own literal text wins where it
   says «diabetes tipo 2» spelled out); **«duración de la insulina activa»**, never «AIT».
   `src/contenido.test.ts` enforces these.
5. **Unknowns stay visible.** Pending items (SEEN permission and hosting, the author's quiz
   questions, source files of the infographic and figures) live in `src/contenido/cambios.ts`
   (`PENDIENTES`) and are shown in «Qué ha cambiado» and «Sobre esta versión». Do not fill them
   with guesses.
6. **Reuse, don't fork.** The mechanics come from `asistente-aid` (index.css utilities,
   night mode via `html.night`, print-a-region via `imprimir.js`, hash routing, folded
   inventories, quality gates). Do NOT copy its clinical data or its sources registry.
   **Visual identity (0.5.0) follows the Manual SEEN, not asistente-aid:** SEEN palette in
   `src/tokens.ts` (`SEEN`, `FICHA_AREA`, `COLOR_APARTADO`), Open Sans for text and light
   uppercase titles (`.titulo-manual`), Oswald for labels (`.etiqueta-area`), both self-hosted
   under OFL (`src/assets/fonts/`). Never use the SEEN logo or anything that presents the app
   as an official SEEN product (the permission is still pending). Pale area colours are
   backgrounds for white decorative icons only — never put text on them (axe checks it even
   under `aria-hidden`). Every new inline colour needs its night rule in `index.css`.

7. **The one exception, and how it is kept apart.** `src/ampliacion/` holds the AUTHOR'S OWN
   validated data from asistente-aid (system technical sheets, infusion sets, insulin
   compatibility, choice criteria) with its typed sources (`fuentes.ts`). It is NOT chapter
   text: the UI always shows it under the amber «Ampliación del autor · fuera del capítulo»
   label, below the literal chapter layer, never mixed with it. To refresh it, re-run the
   extraction from asistente-aid (`src/data`) — do not hand-edit clinical values here.
   `src/contenido/cifras.ts` («Cifras del apartado») is NOT an exception: every figure there is a
   literal value from the chapter with its page, and the test checks pages and anchors.

8. **Diagrams are chapter text, rearranged.** `src/contenido/diagramas.ts` holds the data of the
   «Figuras y diagramas» diagrams (MCG targets, ketone scale, exercise, follow-up calendar, the four
   algorithms, hypoglycaemia, MDI transition). Every number and phrase is the chapter's own wording
   with its page; do not paraphrase (no verb changes) and do not add values the chapter does not
   give (leave a band without target as «—»). `scripts/auditoria/fidelidad.py` checks each one
   against its PDF page. Diagrams are HTML/CSS, not SVG, so the text stays real text.

9. **Layers added in 0.4.0 (session 4, 3-10-2026). Same rule: never mixed with the chapter.**
   - `src/extendida/` — «Versión extendida del autor · no publicada en el Manual»: fragments of the
     author's May 2026 drafts (V93, V85, tablas V85) that were cut for space, **only those the
     author approved one by one** (33 on 3-10-2026). Generated from the .docx files (literal, with
     the app's conventions); never hand-edit. Unapproved fragments are NOT committed (public
     repo). Shown folded, in amber, after the block they belong to (`donde`) and in the system
     fichas (`sistemas`). If a fragment ever contradicted the chapter, the chapter wins.
   - `src/pacientes/textos.ts` — «Para el paciente»: the author's corrected patient information
     (V5) and the editorial's typeset summary, literal. The safety-plan sheet
     (`pantallas/Pacientes.tsx`) is built ONLY from chapter data (p. 7 list, Figure 3, Table 4)
     plus blank lines for handwriting: no inputs, nothing stored.
   - `src/contenido/test.ts` — the author's 10 quiz questions; `explicacion` is author text,
     `citas` are literal chapter phrases (the content test checks each one in its block).
     `validada: false` shows «pendiente de validación del autor» until the author approves.
   - «Novedades desde la publicación»: nothing is published until the author approves each item
     (the draft lives in the session's review page, not in the repo).
10. **Diagrams after 0.3.0 are not blocks.** Adding a block to an apartado shifts the positional
    anchors (`b17`…) that search, cifras and shared links use. New diagrams carry `ancla` in
    `DIAGRAMAS` and are rendered after it (`posicionDeAncla`, ids `d-<id>`); the extended layer
    uses the same resolver.
11. **Reader preferences** (`src/prefs.ts`): night mode, font size, last reading position, read
    apartados and favourites — app routes and interface titles only, never clinical data.
    Everything read back is validated by shape (`#/` routes only); a bad value falls back to
    the default, never crashes a screen.

12. **One route source.** `App` reads the route and passes it to `Shell`; never call `useRuta()`
    in a second place (a stale copy re-mounted the previous screen and broke scroll and
    «Seguir leyendo»; see docs/AUDITORIA_2026-10-03.md).

13. **Lazy screens (0.5.3).** Only Portada, Capitulo and Apartado (and what they import) are
    in the entry bundle; every other screen is `React.lazy` in `App.tsx`, one chunk per screen
    module, with `<Suspense>` inside the Shell's per-screen ErrorBoundary. Entry screens must
    import system ids/photos from `ampliacion/ids` (never `ampliacion`, which pulls the author's
    data) and search helpers from `busqueda` (never `buscador`, the index; load it with
    `useBuscador`/`precargarBuscador`). `src/auditoria.test.tsx` guards this.

14. **Author's data that differs from the chapter** is marked, not silently shown:
    `src/ampliacion/difiere.ts` quotes the chapter literally with its page (tested). Remove an
    entry only when the author decides.

15. **PWA assets are generated, not hand-edited (0.6.0).** Icons: `node scripts/iconos.mjs`
    (favicon.svg, pwa-192/512 «any», pwa-maskable-512, apple-touch-icon). Install screenshots:
    `BASE_URL=http://localhost:5181 node scripts/capturas-manifiesto.mjs` → public/capturas-app
    (sizes must match `vite.config.ts`; excluded from the precache). The manifest `id` is
    `/manual-seen-aid`: never change it (it identifies the installed app). QR codes and «Cómo
    citar» use `direccion()` from `src/compartir.ts`, which maps localhost and Pages previews to
    the public URL. `public/404.html` serves unknown real paths (routes are hash-based).

16. **Search (0.6.1).** `src/busqueda.ts` holds the light part (types, `terminosDe` with the
    query synonyms, `posiciones` — short acronyms match whole words only —, `marcar`,
    `tramoDeConsulta`); `src/buscador.ts` the index, loaded lazily with `useBuscador` (which
    exposes `estado` and `reintentar`). «Ir a» entries (`tipo: "atajo"`) point to the
    consultation tools; situations come from `src/situaciones.ts`. Synonyms only widen what is
    found; they never change chapter text.

17. **Headings and dialogs.** Tables, figures, diagrams and extended fragments take their
    heading level from `NivelTitulo` (`src/nivel-contexto.ts`; Bloques sets it per block, the
    standalone screens set 2). axe `heading-order` and `landmark-unique` are enforced in e2e.
    `Modal` pushes a history entry so Back closes it. A chunk that fails to load reloads once
    (`src/recarga.ts`). Night mode is a single store (`useNocturno`, `src/tema-inicial.js`, inlined by the build with its CSP hash, before
    paint); it is saved only when the reader chooses.

18. **Startup script and CSP (0.6.4).** `index.html` has ONE inline script, built by
    `arranqueEnLinea` in `vite.config.ts`: the night mode (`src/tema-inicial.js`) and, in the
    build, the deep-link preload (`<link rel="modulepreload" data-arranque>` for the lazy
    screen of the route, from `PANTALLA_DE_SECCION`; Recorridos for situacion/descarga/
    interrupcion). The build writes its sha256 into `script-src` of `dist/_headers` and fails if
    there is any other inline script. If a route moves to another screen in `App.tsx`, update
    `PANTALLA_DE_SECCION`: `e2e/produccion.spec.ts` checks it. Touch targets are at least
    24 px (`e2e/tactiles-movil.spec.ts`; 44 px for breadcrumbs, header and loose links).

19. **Review cards (0.7.0).** `src/repaso.ts` builds the cards from `contenido/cifras.ts` (one
    per label per section; same-label figures are joined) and from the glossary (only acronyms
    the chapter expands). No card text is written by hand: change the figure or the glossary.
    Leitner boxes 1-5 (1, 3, 7, 16, 35 days); progress in `mseen:repaso` (validated in
    `prefs.ts`). Screen `src/pantallas/Repaso.tsx`, routes `#/repaso[/cifras|siglas|<slug>]`.

20. **Questions to the chapter (0.8.0).** `src/respuestas.ts` answers with LITERAL chapter
    text only (sentences, list items, table rows with the named system's cell, Figura 3
    branches, glossary) and returns nothing when the chapter does not cover the question.
    It loads with the search index (`buscador.ts` re-exports `responder`). Vocabulary goes in
    `LEXICO`/`FRASES` as general rules, never to fix one question. `respuestas.test.ts` holds
    the question banks; the blind figures in docs/PREGUNTAS_2026-10-04.md were measured once:
    to claim a new figure, write a NEW bank before looking at results and do not tune to it.

21. **Start a system (0.9.0).** `src/inicio.ts` describes the «Iniciar un sistema» recorrido
    as references (paragraph + sentence indexes, lists, Tabla 2 rows, Tabla 1 cells, the
    system's Tabla 2 initialization line); `src/pantallas/Inicio.tsx` only renders them. No
    text is written there except navigation labels and the follow-up checkboxes. If the
    chapter text changes, `inicio.test.tsx` checks that each cited sentence still starts as
    expected. Route `#/consultar/inicio/<fase>[:<sistema>]`; the checklist sheet prints on one
    A4 side (e2e).

## 2. Quality gates (all must pass before a push)

```bash
npm run typecheck
npm test            # Vitest: content integrity, screens, jest-axe
npm run lint
npm run format:check
npm run build
npm run presupuesto # size budget (gzip): entry JS/CSS, each lazy chunk, precache
npm run test:e2e    # Playwright: desktop, mobile 393 px, night mode with axe, production build with SW
```

Plus the audits in `scripts/auditoria/` (see docs/AUDITORIA_2026-10-02.md §8): `fidelidad.py`
(chapter, tables, figures, cifras, diagrams vs the final PDF) and `fidelidad_extra.py` (extended
layer vs the drafts, patient texts vs V5 and the typeset summary, quiz citations vs the PDF).
`e2e/sesion4.spec.ts` checks that each patient sheet prints on ONE A4 side.

CI (`.github/workflows/ci.yml`) runs the same. Deploy to Cloudflare Pages (`manual-seen-aid`)
on push to main (`deploy-cloudflare.yml`, needs `CLOUDFLARE_API_TOKEN`).

## 3. How to update the chapter text

1. Get the new PDF. Extract with PyMuPDF (`fitz`), read `/Annots` for editorial notes.
2. Edit the matching file in `src/contenido/`, keep pages correct, apply corrections.
3. Add an entry to `CAMBIOS` in `src/contenido/cambios.ts` (ISO date, `ambito: "capitulo"`).
4. Update `docs/CORRECCIONES.md` and the assertions in `src/contenido.test.ts` if a correction
   changes.
5. Bump `VERSION_APP` and add an `ambito: "app"` entry when the app itself changes.

## 4. Adding images, infographics or animations

- Images go in `public/figuras/` (or `public/media/`) as **lossless WebP** (pixel-identical to
  the source; the figures carry text and the viewer zooms, so no lossy compression; check with
  Pillow `ImageChops.difference`) and are referenced from the content's
  `imagen: { src, alt, nota }` (see `tipos.ts` → `Figura`). The transcription stays the primary
  content; the image is a collapsible «Ver la figura original».
- Animations: only via CSS classes under `prefers-reduced-motion: no-preference` in
  `src/index.css` (`.revelar`, `.pantalla-in`, `.paso-in`, `.aurora`, `.pulso`, `.hover-lift`).
  Never JS-driven motion that ignores the reduced-motion preference.
- Interactive pieces (like `Figura3Vista.tsx`) are built from the content's typed data; they
  must not carry text of their own.
