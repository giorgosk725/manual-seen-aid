import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

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
          if (/[\\/]src[\\/]contenido[\\/]/.test(id)) return "contenido";
          return undefined;
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
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
        globIgnores: ["capturas-app/**"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
