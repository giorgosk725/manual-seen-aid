import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/* El modo nocturno se pone antes del primer pintado con un script EN LÍNEA (src/tema-inicial.js):
   como archivo aparte era una petición más que bloqueaba el pintado en el móvil. La CSP no
   admite scripts en línea, así que el build añade a dist/_headers el hash de este script, y
   solo el de este; si el HTML publicado no lo lleva tal cual, el build falla. */
function temaEnLinea(): Plugin {
  const MARCA = '<script src="./tema.js"></script>';
  let codigo = "";
  let salida = "";
  return {
    name: "tema-en-linea",
    configResolved(c) {
      codigo = readFileSync(resolve(c.root, "src/tema-inicial.js"), "utf8").trim();
      salida = c.command === "build" ? resolve(c.root, c.build.outDir) : "";
    },
    transformIndexHtml(html) {
      if (!html.includes(MARCA)) throw new Error(`index.html: falta ${MARCA}`);
      return html.replace(MARCA, `<script>${codigo}</script>`);
    },
    closeBundle() {
      if (!salida) return;
      const html = readFileSync(resolve(salida, "index.html"), "utf8");
      if (!html.includes(`<script>${codigo}</script>`))
        throw new Error("dist/index.html no lleva el script del tema tal cual");
      const ruta = resolve(salida, "_headers");
      const cabeceras = readFileSync(ruta, "utf8");
      const antes = "script-src 'self';";
      if (!cabeceras.includes(antes)) throw new Error(`_headers: falta «${antes}»`);
      const hash = createHash("sha256").update(codigo).digest("base64");
      writeFileSync(ruta, cabeceras.replace(antes, `script-src 'self' 'sha256-${hash}';`));
    },
  };
}

/* Web estática, instalable y con uso sin conexión (PWA). Base relativa para poder servirla
   desde cualquier subruta (si la SEEN la aloja junto al capítulo). El service worker se
   registra en modo «prompt»: la versión nueva no recarga sola; se avisa y el lector decide. */
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
            if (id.includes("lucide-react")) return undefined;
            // El QR solo lo usan las hojas para el paciente: va con su pantalla perezosa.
            if (id.includes("qrcode-generator")) return undefined;
            return "vendor";
          }
          // El contenido del capítulo en su propio trozo: cambia con cada revisión del
          // texto, el código no.
          // (el test del autor no: solo lo usan Autoevaluación y el buscador, perezosos).
          if (/[\\/]src[\\/]contenido[\\/]test\.ts$/.test(id)) return undefined;
          if (/[\\/]src[\\/]contenido[\\/]/.test(id)) return "contenido";
          return undefined;
        },
      },
    },
  },
  plugins: [
    react(),
    temaEnLinea(),
    VitePWA({
      registerType: "prompt",
      includeManifestIcons: false,
      manifest: {
        // Identidad estable de la app instalada: no cambia aunque cambie start_url o el
        // alojamiento (p. ej., si la SEEN la aloja junto al capítulo).
        id: "/manual-seen-aid",
        name: "Manual SEEN · AID — Automatización de la insulinoterapia",
        short_name: "Manual SEEN · AID",
        description:
          "El capítulo del Manual SEEN sobre automatización de la insulinoterapia en la diabetes tipo 1, para leerlo y consultarlo en dos toques, con hojas para el paciente. Educativo; no es producto sanitario.",
        lang: "es",
        dir: "ltr",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "any",
        theme_color: "#3F6E9F",
        background_color: "#fafafa",
        categories: ["medical", "education", "books"],
        prefer_related_applications: false,
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        // Accesos directos (menú del icono instalado): lo que más se consulta.
        shortcuts: [
          {
            name: "Índice del capítulo",
            short_name: "Índice",
            url: "./#/capitulo",
            icons: [{ src: "pwa-192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Cetonemia paso a paso (Figura 3)",
            short_name: "Cetonemia",
            url: "./#/consultar/figura-3",
            icons: [{ src: "pwa-192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Situación y sistema",
            short_name: "Situación",
            url: "./#/consultar/situacion",
            icons: [{ src: "pwa-192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Para el paciente",
            short_name: "Pacientes",
            url: "./#/pacientes",
            icons: [{ src: "pwa-192.png", sizes: "192x192", type: "image/png" }],
          },
        ],
        // Capturas para el diálogo de instalación (scripts/capturas-manifiesto.mjs). No se
        // precachean: solo las pide el navegador al ofrecer instalar.
        screenshots: [
          {
            src: "capturas-app/portada-movil.webp",
            sizes: "786x1704",
            type: "image/webp",
            form_factor: "narrow",
            label: "Portada: el capítulo, «¿Qué necesitas?» y el índice en mosaico",
          },
          {
            src: "capturas-app/cetonemia-movil.webp",
            sizes: "786x1704",
            type: "image/webp",
            form_factor: "narrow",
            label: "Cetonemia paso a paso: la rama de la Figura 3 según el β-OHB",
          },
          {
            src: "capturas-app/apartado-movil.webp",
            sizes: "786x1704",
            type: "image/webp",
            form_factor: "narrow",
            label: "Un apartado del capítulo, con su página y sus cifras",
          },
          {
            src: "capturas-app/portada-escritorio.webp",
            sizes: "1440x900",
            type: "image/webp",
            form_factor: "wide",
            label: "Portada en escritorio",
          },
          {
            src: "capturas-app/apartado-escritorio.webp",
            sizes: "1440x900",
            type: "image/webp",
            form_factor: "wide",
            label: "Lectura de un apartado con su índice lateral",
          },
        ],
      },
      workbox: {
        // Precachea todo el build, imágenes de las figuras incluidas: el capítulo entero
        // tiene que leerse sin red.
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2}"],
        // Las capturas del manifiesto solo las usa el diálogo de instalación.
        globIgnores: ["capturas-app/**", "404.html", "redirige.js"],
        // Los iconos del manifiesto ya entran por globPatterns: sin duplicados en el precache.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "index.html",
        // Solo la raíz: una dirección real desconocida (p. ej. /pacientes/resumen, tecleada
        // sin «#») va a la red y recibe 404.html, en vez de un index.html con recursos rotos.
        navigateFallbackAllowlist: [/^\/$/, /^\/index\.html$/],
        // La página de una primera visita queda controlada en cuanto el SW se activa.
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
