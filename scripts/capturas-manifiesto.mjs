/* Capturas del manifiesto (diálogo de instalación de la PWA): tres de móvil (393 × 852 a 2×,
   786 × 1704) y dos de escritorio (1440 × 900). Uso, con el servidor en marcha:
     BASE_URL=http://localhost:5181 node scripts/capturas-manifiesto.mjs
   Escribe PNG en capturas/manifiesto/ y los pasa a WebP en public/capturas-app/ con Pillow
   (python -m pip install pillow si falta). Los tamaños deben coincidir con vite.config.ts. */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const BASE = process.env.BASE_URL || "http://localhost:5181";
const PNG = "capturas/manifiesto";
const WEBP = "public/capturas-app";
mkdirSync(PNG, { recursive: true });
mkdirSync(WEBP, { recursive: true });

const b = await chromium.launch();
const asentar = (page) =>
  page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.race([
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  });

const tomar = async (ctx, ruta, nombre) => {
  const p = await ctx.newPage();
  await p.goto(`${BASE}/${ruta}`, { waitUntil: "networkidle" });
  await p.waitForSelector("[data-cargando]", { state: "detached" }).catch(() => {});
  await asentar(p);
  await p.screenshot({ path: `${PNG}/${nombre}.png` });
  await p.close();
  console.log(nombre);
};

const movil = await b.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await tomar(movil, "#/", "portada-movil");
await tomar(movil, "#/consultar/figura-3/naranja", "cetonemia-movil");
await tomar(movil, "#/capitulo/05-resultados", "apartado-movil");
await movil.close();

const escritorio = await b.newContext({ viewport: { width: 1440, height: 900 } });
await tomar(escritorio, "#/", "portada-escritorio");
await tomar(escritorio, "#/capitulo/05-resultados", "apartado-escritorio");
await escritorio.close();
await b.close();

execFileSync(
  "python",
  [
    "-c",
    `from PIL import Image
import glob, os
for f in glob.glob("${PNG}/*.png"):
    n = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert("RGB")
    im.save("${WEBP}/" + n + ".webp", "WEBP", quality=82, method=6)
    print(n, im.size, os.path.getsize("${WEBP}/" + n + ".webp") // 1024, "KB")`,
  ],
  { stdio: "inherit" },
);
