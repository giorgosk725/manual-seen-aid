/* Presupuesto de tamaño del build (gzip), sobre lo que de verdad se publica: lo que pide
   index.html al entrar (JS y CSS), cada trozo perezoso y el total que el service worker
   guarda para leer sin conexión. Falla si algo se pasa. Uso, tras `npm run build`:
     npm run presupuesto
   Valores de la 0.6.4 (4-10-2026): entrada 148 KB de JS y 12 KB de CSS; el trozo perezoso mayor,
   Pacientes, 13 KB; precache 1,57 MB. Los límites dejan margen para crecer sin descuidarse. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const LIMITES = {
  entradaJs: 165 * 1024,
  entradaCss: 16 * 1024,
  trozoPerezoso: 25 * 1024,
  precache: 1.9 * 1024 * 1024,
};

const DIST = "dist";
const gz = (f) => gzipSync(readFileSync(join(DIST, f))).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

const html = readFileSync(join(DIST, "index.html"), "utf8");
const deEntrada = (re) => [...html.matchAll(re)].map((m) => m[1].replace(/^\.\//, ""));
const js = [
  ...deEntrada(/<script type="module"[^>]*src="([^"]+)"/g),
  // Solo las que pone Vite (las del script de arranque se añaden en el navegador).
  ...deEntrada(/<link rel="modulepreload"[^>]*href="([^"]+)"/g),
];
const css = deEntrada(/<link rel="stylesheet"[^>]*href="([^"]+)"/g);

const fallos = [];
const comprobar = (nombre, valor, limite) => {
  const ok = valor <= limite;
  console.log(
    `${ok ? "ok  " : "MAL "} ${nombre.padEnd(34)} ${kb(valor).padStart(9)} / ${kb(limite)}`,
  );
  if (!ok) fallos.push(nombre);
};

comprobar(
  `entrada JS (${js.length} archivos)`,
  js.reduce((s, f) => s + gz(f), 0),
  LIMITES.entradaJs,
);
comprobar(
  `entrada CSS (${css.length})`,
  css.reduce((s, f) => s + gz(f), 0),
  LIMITES.entradaCss,
);

const enEntrada = new Set(js.map((f) => f.replace(/^assets\//, "")));
for (const f of readdirSync(join(DIST, "assets")).filter((f) => f.endsWith(".js"))) {
  if (!enEntrada.has(f))
    comprobar(
      `perezoso ${f.replace(/-[\w-]{8}\.js$/, "")}`,
      gz(`assets/${f}`),
      LIMITES.trozoPerezoso,
    );
}

// Lo que precachea el service worker (sin comprimir: es lo que ocupa en el dispositivo).
const sw = readFileSync(join(DIST, "sw.js"), "utf8");
const urls = [...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]);
if (!urls.length) fallos.push("no encuentro la lista de precache en sw.js");
const precache = urls.reduce((s, u) => s + statSync(join(DIST, u)).size, 0);
comprobar(`precache (${urls.length} entradas)`, precache, LIMITES.precache);

if (fallos.length) {
  console.error(`\nFuera de presupuesto: ${fallos.join(", ")}`);
  process.exit(1);
}
