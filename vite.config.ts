import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import type { OutputBundle, OutputChunk } from "rollup";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/* Pantalla perezosa de cada sección de la ruta (como en App.tsx). «Situación y sistema»,
   «Revisar la descarga» e «Interrupción» están en Recorridos. Una prueba e2e de producción
   comprueba que el trozo precargado es el que la pantalla usa de verdad. */
const PANTALLA_DE_SECCION: Record<string, string> = {
  consultar: "Consultar",
  visual: "Visual",
  sistemas: "Sistemas",
  pacientes: "Pacientes",
  buscar: "Otras",
  bibliografia: "Otras",
  cambios: "Otras",
  sobre: "Otras",
  test: "Otras",
  mas: "Otras",
  repaso: "Repaso",
};

/* Trozos que necesita cada pantalla perezosa y que no trae ya la entrada. */
function trozosDePantallas(bundle: OutputBundle): Record<string, string[]> {
  const trozos = Object.values(bundle).filter((t): t is OutputChunk => t.type === "chunk");
  const porNombre = new Map(trozos.map((t) => [t.fileName, t]));
  const cierre = (inicio: string[], fuera = new Set<string>()) => {
    const vistos = new Set<string>();
    const pila = [...inicio];
    while (pila.length) {
      const f = pila.pop()!;
      if (vistos.has(f) || fuera.has(f)) continue;
      vistos.add(f);
      pila.push(...(porNombre.get(f)?.imports ?? []));
    }
    return vistos;
  };
  const entrada = cierre(trozos.filter((t) => t.isEntry).map((t) => t.fileName));
  const mapa: Record<string, string[]> = {};
  for (const t of trozos) {
    const m = t.isDynamicEntry && t.facadeModuleId?.match(/[\\/]src[\\/]pantallas[\\/](\w+)\.tsx$/);
    if (m) mapa[m[1]] = [...cierre([t.fileName], entrada)].map((f) => `./${f}`);
  }
  for (const p of new Set([...Object.values(PANTALLA_DE_SECCION), "Recorridos", "Inicio"]))
    if (!mapa[p]) throw new Error(`No encuentro el trozo de la pantalla ${p}`);
  return mapa;
}

/* Primera visita a un enlace profundo (p. ej., el QR de una hoja: #/pacientes/resumen): pide
   ya el trozo de su pantalla, a la vez que la entrada, en vez de esperar a que la entrada se
   ejecute. Con el service worker instalado no cambia nada (todo sale de la caché). */
function codigoPrecarga(mapa: Record<string, string[]>) {
  return `(function(){var t=${JSON.stringify(mapa)},s=${JSON.stringify(PANTALLA_DE_SECCION)};try{var p=location.hash.replace(/^#/,"").split("/").filter(Boolean),k=p[0]==="consultar"&&/^(situacion|descarga|interrupcion)$/.test(p[1]||"")?"Recorridos":p[0]==="consultar"&&p[1]==="inicio"?"Inicio":s[p[0]],l=t[k]||[];for(var i=0;i<l.length;i++){var e=document.createElement("link");e.rel="modulepreload";e.href=l[i];e.setAttribute("data-arranque","");document.head.appendChild(e)}}catch(e){}})();`;
}

/* Scripts de arranque EN LÍNEA en index.html (archivos aparte serían peticiones que bloquean el
   pintado en el móvil): el modo nocturno antes del primer pintado (src/tema-inicial.js) y, en
   el build, la precarga del enlace profundo. La CSP no admite scripts en línea, así que el
   build añade a dist/_headers el hash del único script en línea; si hay otro, falla. */
function arranqueEnLinea(): Plugin {
  const MARCA = '<script src="./tema.js"></script>';
  let tema = "";
  let salida = "";
  return {
    name: "arranque-en-linea",
    configResolved(c) {
      tema = readFileSync(resolve(c.root, "src/tema-inicial.js"), "utf8").trim();
      salida = c.command === "build" ? resolve(c.root, c.build.outDir) : "";
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!html.includes(MARCA)) throw new Error(`index.html: falta ${MARCA}`);
        const precarga = ctx.bundle ? "\n" + codigoPrecarga(trozosDePantallas(ctx.bundle)) : "";
        return html.replace(MARCA, `<script>${tema}${precarga}</script>`);
      },
    },
    closeBundle() {
      if (!salida) return;
      const html = readFileSync(resolve(salida, "index.html"), "utf8");
      const enLinea = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
      if (enLinea.length !== 1 || !enLinea[0].startsWith(tema))
        throw new Error("dist/index.html debe llevar un único script en línea, el de arranque");
      const ruta = resolve(salida, "_headers");
      const cabeceras = readFileSync(ruta, "utf8");
      const antes = "script-src 'self';";
      if (!cabeceras.includes(antes)) throw new Error(`_headers: falta «${antes}»`);
      const hash = createHash("sha256").update(enLinea[0]).digest("base64");
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
    arranqueEnLinea(),
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
