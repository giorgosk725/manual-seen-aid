/* Circuito efectivo de publicación (V54-04). Se ejecuta SOLO tras la orden «publica»:
     npm run publicar            → producción (rama main de Cloudflare Pages)
     npm run publicar -- prueba  → copia de prueba (https://prueba.manual-seen-aid.pages.dev)
   Exige: árbol limpio, HEAD igual a origin/main, y todas las puertas en verde sobre ESE commit
   (lint, formato, tipos, tests sin excepciones, build, presupuesto y e2e). Despliega desde un
   dist recién construido, comprueba que la web sirve ese build y esa versión, que las API
   antiguas siguen cerradas (410), y deja anotado lo publicado y la versión de recuperación en
   docs/PUBLICACIONES.md. Usa la sesión local de wrangler: no lee ni escribe secretos. */
import { execSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";

const canal = process.argv[2] === "prueba" ? "prueba" : "main";
const URL_CANAL =
  canal === "main"
    ? "https://manual-seen-aid.pages.dev"
    : "https://prueba.manual-seen-aid.pages.dev";
const REGISTRO = "docs/PUBLICACIONES.md";

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
const paso = (titulo, cmd) => {
  console.log(`· ${titulo}`);
  execSync(cmd, { stdio: "inherit" });
};
const fallar = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};

// 1. El commit exacto que se publica.
if (sh("git status --porcelain"))
  fallar("Hay cambios sin confirmar: no se publica un árbol sucio.");
sh("git fetch -q origin");
const sha = sh("git rev-parse HEAD");
if (sha !== sh("git rev-parse origin/main"))
  fallar("HEAD no es origin/main: sube primero el commit (git push) para que sea trazable.");
const version = readFileSync("src/version.ts", "utf8").match(/VERSION_APP = "([^"]+)"/)?.[1];
console.log(`Publicar ${version} (${sha.slice(0, 12)}) en ${canal}`);

// 2. Puertas sobre ese commit.
paso("Lint", "npm run lint");
paso("Formato", "npm run format:check");
paso("Tipos", "npm run typecheck");
paso("Tests (sin excepciones sin manejar)", "npx vitest run");
rmSync("dist", { recursive: true, force: true });
paso("Build", "npm run build");
paso("Presupuesto", "npm run presupuesto");
paso("e2e", "npx playwright test");
// La e2e de producción reconstruye dist: se vuelve a construir para publicar exactamente esto.
rmSync("dist", { recursive: true, force: true });
paso("Build para publicar", "npm run build");
const indice = readdirSync("dist/assets").find((f) => /^index-.*\.js$/.test(f));
if (!indice) fallar("No encuentro dist/assets/index-*.js");

// 3. Versión de recuperación: lo que había publicado antes (de este registro).
const anterior = existsSync(REGISTRO)
  ? [
      ...readFileSync(REGISTRO, "utf8").matchAll(
        new RegExp(`\\| ${canal} \\| ([^|]+) \\| ([0-9a-f]{12})`, "g"),
      ),
    ].pop()
  : null;

// 4. Desplegar y comprobar lo servido.
paso(
  "Desplegar",
  `npx wrangler pages deploy dist --project-name=manual-seen-aid --branch=${canal} --commit-hash=${sha} --commit-dirty=false`,
);
let servido = "";
for (let i = 0; i < 12 && servido !== indice; i++) {
  const html = await (await fetch(`${URL_CANAL}/?v=${Date.now()}`)).text();
  servido = html.match(/index-[A-Za-z0-9_-]+\.js/)?.[0] ?? "";
  if (servido !== indice) await new Promise((r) => setTimeout(r, 5000));
}
if (servido !== indice) fallar(`La web sirve ${servido}, no ${indice}.`);
const js = await (await fetch(`${URL_CANAL}/assets/${indice}`)).text();
if (!js.includes(`"${version}"`)) fallar(`El build servido no lleva la versión ${version}.`);
for (const api of ["pasajes", "sin-respuesta"]) {
  const r = await fetch(`${URL_CANAL}/api/${api}`, { method: "POST", body: "{}" });
  if (r.status !== 410) fallar(`/api/${api} responde ${r.status}, no 410.`);
}

// 5. Registro.
if (!existsSync(REGISTRO))
  writeFileSync(
    REGISTRO,
    "# Publicaciones\n\nCada línea la escribe `npm run publicar` tras comprobar lo servido. Recuperar\nuna versión: `git checkout <commit>` y `npm run publicar` desde ahí (o «Rollback» en Cloudflare\nPages).\n\n| Fecha (UTC) | Canal | Versión | Commit | Build | Recuperación |\n| --- | --- | --- | --- | --- | --- |\n",
  );
const fecha = new Date().toISOString().slice(0, 16).replace("T", " ");
appendFileSync(
  REGISTRO,
  `| ${fecha} | ${canal} | ${version} | ${sha.slice(0, 12)} | ${indice} | ${anterior ? `${anterior[1].trim()} (${anterior[2]})` : "—"} |\n`,
);
console.log(`✓ ${version} publicada en ${URL_CANAL} (${sha.slice(0, 12)}, ${indice}).`);
console.log(
  `  Anota el registro: git add ${REGISTRO} && git commit -m "Registro: ${version} en ${canal}" && git push`,
);
