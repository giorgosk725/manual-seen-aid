// Copia de REVISIÓN con los borradores (p. ej. src/casos-borrador/, fuera del repositorio):
// construye en dist-revision con REVISION=1 (sin esa variable, scripts/guardia-borradores.mjs se niega a
// construir si hay borradores, para que nunca lleguen a producción). Después:
//   npx wrangler pages deploy dist-revision --project-name=manual-seen-aid --branch=prueba --commit-dirty=true
// Uso: npm run build:revision
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const hay = existsSync("src/casos-borrador");
console.log(
  hay ? "Con borradores: src/casos-borrador/" : "Sin borradores (copia igual a producción).",
);
execSync("npx vite build --outDir dist-revision", {
  stdio: "inherit",
  env: { ...process.env, REVISION: "1" },
});
console.log(
  "\nListo en dist-revision/. Para publicar la copia de revisión:\n  npx wrangler pages deploy dist-revision --project-name=manual-seen-aid --branch=prueba --commit-dirty=true",
);
