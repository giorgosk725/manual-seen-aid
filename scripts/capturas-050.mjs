/* Capturas del rediseño 0.5.0 (identidad del Manual SEEN) en escritorio, a 393 px y en
   nocturno. Uso: con el dev server en marcha →
   `BASE_URL=http://localhost:5181 node scripts/capturas-050.mjs [filtro]`.
   Salida en ./capturas/v050/ (ignorada por git). */
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:5181";
const FILTRO = process.argv[2] || "";
const DIR = "capturas/v050";
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch();
const asentar = (page) =>
  page.evaluate(() =>
    Promise.race([
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, 1500)),
    ]),
  );

const capturar = async (ctx, ruta, nombre, { completa = false, noche = false } = {}) => {
  if (FILTRO && !nombre.includes(FILTRO)) return;
  const page = await ctx.newPage();
  await page.addInitScript((n) => {
    localStorage.setItem("mseen:night", n ? "1" : "0");
  }, noche);
  await page.goto(`${BASE}/${ruta}`, { waitUntil: "networkidle" });
  await asentar(page);
  await page.screenshot({ path: `${DIR}/${nombre}.png`, fullPage: completa });
  await page.close();
  console.log(`${DIR}/${nombre}.png`);
};

const escritorio = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await capturar(escritorio, "#/", "01-portada-escritorio");
await capturar(escritorio, "#/", "02-portada-escritorio-completa", { completa: true });
await capturar(escritorio, "#/capitulo/05-resultados", "03-apartado-escritorio");
await capturar(escritorio, "#/capitulo/05-resultados", "04-apartado-escritorio-completo", {
  completa: true,
});
await capturar(escritorio, "#/consultar", "05-consultar-escritorio");
await capturar(escritorio, "#/sistemas/ciq", "06-ficha-escritorio");
await capturar(escritorio, "#/", "07-portada-escritorio-nocturno", { noche: true });
await capturar(escritorio, "#/capitulo/05-resultados", "08-apartado-escritorio-nocturno", {
  noche: true,
});
await escritorio.close();

const movil = await browser.newContext({ ...devices["Pixel 5"] });
await capturar(movil, "#/", "11-portada-393");
await capturar(movil, "#/", "12-portada-393-completa", { completa: true });
await capturar(movil, "#/capitulo/10-situaciones", "13-apartado-393");
await capturar(movil, "#/", "14-portada-393-nocturno", { noche: true });
await capturar(movil, "#/consultar/figura-3/naranja", "15-cetonemia-393");
await capturar(movil, "#/pacientes", "16-pacientes-393");
await movil.close();
await browser.close();
