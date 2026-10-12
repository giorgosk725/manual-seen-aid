# Dependencias · análisis del 12-10-2026 (lote aparte, A14)

Medido con `npm audit` sobre el lock de la 0.48.2. No se ha ejecutado `npm audit fix --force` ni se ha
actualizado nada en este lote.

| Alcance                            | Críticas | Altas | Moderadas | Total |
| ---------------------------------- | -------- | ----- | --------- | ----- |
| Lock completo (incluye desarrollo) | 2        | 9     | 6         | 17    |
| Solo producción (`--omit=dev`)     | 0        | 0     | 0         | 0     |

## Aplicabilidad

Ningún paquete afectado llega al navegador: la web publicada es estática (`dist/`) y sus dependencias de
ejecución (React, lucide-react) no tienen avisos. Los avisos afectan a herramientas de desarrollo y
construcción, que corren en el equipo del autor o en la CI:

| Paquete directo | Severidad | Arreglo que propone npm | Comentario                                                                 |
| --------------- | --------- | ----------------------- | -------------------------------------------------------------------------- |
| vitest          | crítica   | 5.x (mayor)             | Arrastra tinypool, vite-node y @vitest/mocker. Solo pruebas.               |
| vite            | alta      | 8.x (mayor)             | Arrastra esbuild. El aviso afecta al servidor de desarrollo, no al build.  |
| tailwindcss     | alta      | 4.x (mayor)             | Arrastra braces, chokidar, micromatch y postcss-*. Migración mayor de CSS. |
| vite-plugin-pwa | moderada  | 2.x (mayor)             | Depende de la versión de vite.                                             |
| wrangler        | alta      | sí, sin salto mayor     | Arrastra miniflare y sharp. Solo despliegue local.                         |

## Plan gradual (cada paso con todas las puertas: typecheck, test, lint, format, build, presupuesto, e2e)

1. `wrangler` a la última menor: sin cambios de código previstos.
2. `vitest` 5 junto con `@vitest/*`: revisar la configuración de jsdom y los `it.fails`.
3. `vite` 8 y `vite-plugin-pwa` 2 a la vez: revisar `vite.config.ts` (plugin de arranque en línea, CSP con
   hash, `define`, precache) y la prueba e2e de producción.
4. `tailwindcss` 4, al final y por separado: es una migración de CSS (configuración, utilidades
   nocturnas de `index.css`). No mezclarla con cambios de contenido clínico.

Cada paso, en su propia rama y su propio commit, con capturas de comparación de las pantallas principales.
