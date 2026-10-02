/* Capturas de verificación (portada y un apartado) a 393 px y en escritorio, día y noche.
   Uso: con el dev server en marcha en http://localhost:5180 → `npm run capturas`.
   Salida en ./capturas/ (ignorada por git). */
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:5180";
mkdirSync("capturas", { recursive: true });

const browser = await chromium.launch();
const asentar = (page) =>
  page.evaluate(() =>
    Promise.race([
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, 1500)),
    ]),
  );

const capturar = async (ctx, ruta, nombre, night) => {
  const page = await ctx.newPage();
  if (night) await page.addInitScript(() => localStorage.setItem("mseen:night", "1"));
  await page.goto(BASE + "/" + ruta, { waitUntil: "networkidle" });
  await asentar(page);
  await page.screenshot({ path: `capturas/${nombre}.png`, fullPage: true });
  await page.close();
  console.log("capturas/" + nombre + ".png");
};

const movil = await browser.newContext({ ...devices["Pixel 5"] });
await capturar(movil, "#/", "portada-393", false);
await capturar(movil, "#/capitulo/07-educacion", "apartado-07-393", false);
await capturar(movil, "#/consultar/figura-3/naranja", "figura3-naranja-393", false);
await capturar(movil, "#/", "portada-393-nocturno", true);
await capturar(movil, "#/capitulo/04-sistemas", "apartado-04-393-nocturno", true);
await movil.close();

const escritorio = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  deviceScaleFactor: 1,
});
await capturar(escritorio, "#/", "portada-escritorio", false);
await capturar(escritorio, "#/capitulo/08-iniciacion", "apartado-08-escritorio", false);
await capturar(escritorio, "#/consultar/tablas/T1", "tabla1-escritorio", false);
await capturar(escritorio, "#/consultar/figura-3/naranja", "figura3-escritorio-nocturno", true);
await escritorio.close();
await browser.close();
