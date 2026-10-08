# Búsqueda por el sentido (0.14.0)

El buscador por palabras (`src/respuestas.ts`, `responder`) falla sobre todo cuando la pregunta
dice lo mismo que el capítulo con otras palabras. Desde la 0.14.0, con conexión, la búsqueda se
compara además por su sentido con los pasajes del capítulo y se funden las dos listas.

## Cómo funciona

1. **Vectores de los pasajes, una vez.** `scripts/semantica/vectores.mjs` pide a Workers AI
   (`@cf/baai/bge-m3`, multilingüe, 1024 dimensiones) el vector de cada pasaje que puede devolver
   el buscador (los 480 átomos de `atomos()`; texto en `scripts/semantica/texto.mjs`). Se guardan
   unitarios y cuantizados a 8 bits por vector, con su escala, en `functions/_datos/vectores.ts`
   (unos 650 KB, solo en la función, no en la app). La huella del texto y los ids los vigila
   `src/semantica.test.ts`: si cambia el capítulo, hay que volver a generarlos.
2. **La búsqueda, al vuelo.** `src/semantica.ts` (`useParecidos`) espera 400 ms a que se deje de
   escribir y manda `{q}` por POST a `/api/pasajes`, en el mismo origen (la CSP no cambia). La
   función (`functions/api/pasajes.ts`, Cloudflare Pages Functions, binding `AI` en
   `wrangler.toml`) pide el vector de la búsqueda al mismo modelo y devuelve los 10 pasajes más
   parecidos con su similitud (`functions/_lib/parecidos.ts`). Si tarda más de 3 s, falla o no
   hay conexión, devuelve una lista vacía.
3. **La fusión.** `fusionar` (respuestas.ts) suma el rango recíproco (RRF, k = 60) de la lista
   por palabras (10 primeros) y la del sentido (similitud ≥ 0,6), sin repetir el mismo párrafo.
   - Lo que solo propone el sentido va como «coincidencia parcial» salvo que la similitud sea
     ≥ 0,7 y las palabras hayan encontrado algo; si las palabras no encuentran nada, solo entra
     lo que tenga similitud ≥ 0,7, y siempre como parcial.
   - Con una cifra de β-OHB manda la rama de la Figura 3 (lista por palabras, sin fusión).
   - Si la búsqueda nombra un sistema, no se cuelan casillas de otro sistema.
   - Sin parecidos, `fusionar` devuelve exactamente lo de `responder`.
4. **Las preguntas frecuentes siguen siendo por palabras.** Activarlas por el sentido se midió
   (`scripts/semantica/analizar.mjs`, apartado A) y acertaba solo el 55–65 % de las veces que
   saltaba: se descartó.

## Privacidad

Solo se manda el texto de la búsqueda (como mucho 300 caracteres; menos de 3, no se manda). La
función no lo guarda ni lo registra y responde con `Cache-Control: no-store`. El servicio es el
mismo Cloudflare que aloja la app. Lo explica «Sobre esta versión» → «Alcance y datos».

## Medida

Los umbrales (0,6 y 0,7) y k = 60 se fijaron antes de medir, sin ajustarlos a ningún banco.

- Bancos ya usados (ciego1–5, orientativo, `npx vite-node scripts/semantica/fusion.mjs`):
  ciego4 58,8 → 67,5 % a la primera y 73,8 → 80 % entre tres; ciego5 57,5 → 56,3 % y
  67,5 → 72,5 %; en los demás, de 2 a 6 puntos más entre tres.
- Banco nuevo, **ciego6** (100 preguntas: 40 de residente, 40 de adjunto, 20 de enfermería; 12
  sin respuesta en el capítulo), escrito por otro agente que solo leyó el texto del capítulo y
  medido UNA vez con la 0.14.0 cerrada (9-10-2026), con los vectores publicados:

  |                                   | Solo palabras | Palabras + sentido |
  | --------------------------------- | ------------: | -----------------: |
  | Pasaje bueno el primero (100)     |        66,0 % |             70,0 % |
  | Entre los tres primeros (100)     |        77,0 % |             83,0 % |
  | Equivocadas presentadas directas  |        18,0 % |             15,0 % |
  | Con respuesta, el primero (88)    |        62,5 % |             67,0 % |
  | Con respuesta, entre tres (88)    |        75,0 % |             81,8 % |
  | Sin respuesta, sin pasaje directo |       11 / 12 |            11 / 12 |

  Por perfil, a la primera (con respuesta): residente 20 → 23 de 36, adjunto 27 → 27 de 36,
  enfermería 8 → 9 de 16. Equivocadas directas: residente 10 → 8, enfermería 3 → 2, adjunto 5 → 5.

- Las similitudes de bge-m3 entre una búsqueda corta y un pasaje rondan 0,5–0,6: con dos o tres
  palabras sueltas casi nada pasa del 0,6 y la fusión apenas cambia el resultado; ayuda con
  preguntas completas. No se ha bajado el umbral para no ajustarlo a este banco.
- Tras medir, al probar la app se vio que «aunque» contaba como palabra clave; pasa a vacía con
  «sino», «pues» y «entonces». Las cifras de ciego1–6 no cambian.

## Mantenimiento

- Cambia el texto del capítulo o los átomos → `npx vite-node scripts/semantica/vectores.mjs`
  (necesita `npx wrangler login` o `CLOUDFLARE_API_TOKEN`; la caché de
  `scripts/semantica/cache/` evita volver a pedir lo que no cambia) y `npm test`.
- Cambiar umbrales o la fusión exige un banco ciego NUEVO para afirmar una mejora.
- La función solo existe en Cloudflare Pages: en `npm run dev` y `vite preview` no hay
  `/api/pasajes` y la app busca solo por palabras (la petición devuelve 404 y se ignora).
