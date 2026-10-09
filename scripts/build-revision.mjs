// Copia de REVISIÓN con los borradores: copia borradores/*.json (fuera del repositorio) a
// src/casos-borrador/, construye en dist-revision con REVISION=1 y quita la copia. Sin esa
// variable, scripts/guardia-borradores.mjs se niega a construir si queda esa carpeta, para que
// nada de esto llegue a producción. Después:
//   npx wrangler pages deploy dist-revision --project-name=manual-seen-aid --branch=prueba --commit-dirty=true
// Uso: npm run build:revision
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, copyFileSync, rmSync } from "node:fs";

// Cada clase de borrador y dónde la lee la app (casos → casos.ts; hojas → hojas.ts).
const CLASES = [
  { origen: "borradores", destino: "src/casos-borrador" },
  { origen: "borradores/hojas", destino: "src/hojas-borrador" },
];
const lista = (d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".json")) : []);
const todos = CLASES.flatMap((c) => lista(c.origen).map((f) => `${c.origen}/${f}`));
console.log(
  todos.length
    ? `Con borradores: ${todos.join(", ")}`
    : "Sin borradores (copia igual a producción).",
);
for (const c of CLASES) {
  mkdirSync(c.destino, { recursive: true });
  for (const f of lista(c.origen)) copyFileSync(`${c.origen}/${f}`, `${c.destino}/${f}`);
}
try {
  execSync("npx vite build --outDir dist-revision", {
    stdio: "inherit",
    env: { ...process.env, REVISION: "1" },
  });
} finally {
  for (const c of CLASES) rmSync(c.destino, { recursive: true, force: true });
}
console.log(
  "\nListo en dist-revision/. Para publicar la copia de revisión:\n  npx wrangler pages deploy dist-revision --project-name=manual-seen-aid --branch=prueba --commit-dirty=true",
);
