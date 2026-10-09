// Copia de REVISIÓN con los borradores: copia borradores/*.json (fuera del repositorio) a
// src/casos-borrador/, construye en dist-revision con REVISION=1 y quita la copia. Sin esa
// variable, scripts/guardia-borradores.mjs se niega a construir si queda esa carpeta, para que
// nada de esto llegue a producción. Después:
//   npx wrangler pages deploy dist-revision --project-name=manual-seen-aid --branch=prueba --commit-dirty=true
// Uso: npm run build:revision
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, copyFileSync, rmSync } from "node:fs";

const ORIGEN = "borradores";
const DESTINO = "src/casos-borrador";
const borradores = existsSync(ORIGEN) ? readdirSync(ORIGEN).filter((f) => f.endsWith(".json")) : [];
console.log(
  borradores.length
    ? `Con borradores: ${borradores.join(", ")}`
    : "Sin borradores (copia igual a producción).",
);
mkdirSync(DESTINO, { recursive: true });
for (const f of borradores) copyFileSync(`${ORIGEN}/${f}`, `${DESTINO}/${f}`);
try {
  execSync("npx vite build --outDir dist-revision", {
    stdio: "inherit",
    env: { ...process.env, REVISION: "1" },
  });
} finally {
  rmSync(DESTINO, { recursive: true, force: true });
}
console.log(
  "\nListo en dist-revision/. Para publicar la copia de revisión:\n  npx wrangler pages deploy dist-revision --project-name=manual-seen-aid --branch=prueba --commit-dirty=true",
);
