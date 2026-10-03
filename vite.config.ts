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
        name: "Manual SEEN · AID — Automatización de la insulinoterapia",
        short_name: "Manual SEEN · AID",
        description:
          "Capítulo del Manual SEEN sobre automatización de la insulinoterapia en DM1, para leer y consultar. Educativo; no es producto sanitario.",
        theme_color: "#3F6E9F",
        background_color: "#fafafa",
        display: "standalone",
        lang: "es",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precachea todo el build, imágenes de las figuras incluidas: el capítulo entero
        // tiene que leerse sin red.
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
