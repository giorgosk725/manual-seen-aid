/* Capturas de lo nuevo de la 0.4.0 a 393 px y en escritorio (y las hojas impresas en PDF).
   Uso: con el dev server en marcha → `BASE_URL=http://localhost:5180 node scripts/capturas-sesion4.mjs`.
   Salida en ./capturas/sesion4/ (ignorada por git). */
import { chromium, devices } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:5180";
const DIR = "capturas/sesion4";
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch();
const asentar = (page) =>
  page.evaluate(() =>
    Promise.race([
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, 1500)),
    ]),
  );

const capturar = async (ctx, ruta, nombre, { accion, completa = false, noche = false } = {}) => {
  const page = await ctx.newPage();
  await page.addInitScript((n) => {
    localStorage.setItem("mseen:night", n ? "1" : "0");
  }, noche);
  await page.goto(`${BASE}/${ruta}`, { waitUntil: "networkidle" });
  await asentar(page);
  if (accion) await accion(page);
  await asentar(page);
  await page.screenshot({ path: `${DIR}/${nombre}.png`, fullPage: completa });
  await page.close();
  console.log(`${DIR}/${nombre}.png`);
};

const abrirExtendida = async (page) => {
  await page.evaluate(() => {
    const d = document.querySelector("details.extendida");
    d.open = true;
    d.scrollIntoView({ block: "start" });
    window.scrollBy(0, -64);
  });
};

const movil = await browser.newContext({ ...devices["Pixel 5"] });
await capturar(movil, "#/", "01-portada-que-necesitas-393");
await capturar(
  movil,
  "#/consultar/situacion/ejercicio-aerobico:omnipod-5",
  "02-ejercicio-omnipod-393",
);
await capturar(movil, "#/consultar/figura-3/naranja", "03-cetonemia-1-2-393");
await capturar(movil, "#/visual/objetivos-mcg/gestacion", "04-objetivos-gestacion-393");
await capturar(movil, "#/capitulo/12-horizonte", "05-version-extendida-393", {
  accion: abrirExtendida,
});
await capturar(movil, "#/visual/gestacion-sistemas", "06-gestacion-sistemas-393", {
  completa: true,
});
await capturar(movil, "#/visual/exploraciones", "07-exploraciones-393");
await capturar(movil, "#/pacientes", "08-para-el-paciente-393");
await capturar(movil, "#/pacientes/plan/op5", "09-plan-seguridad-op5-393", { completa: true });
await capturar(movil, "#/test", "10-test-393", {
  accion: async (p) => {
    await p
      .getByRole("button", { name: /Revisar hipoglucemias y sobretratamiento, y reducir el TBR/ })
      .click();
    await p.getByText("Lo que dice el capítulo").first().scrollIntoViewIfNeeded();
  },
});
await capturar(movil, "#/buscar/Nightscout", "11-busqueda-fuera-del-capitulo-393");
await capturar(movil, "#/visual/hospital", "12-hospital-393-nocturno", { noche: true });
await movil.close();

const escritorio = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await capturar(escritorio, "#/", "20-portada-escritorio");
await capturar(
  escritorio,
  "#/capitulo/10-situaciones/d-gestacion-sistemas",
  "21-gestacion-en-apartado-escritorio",
);
await capturar(escritorio, "#/sistemas/ciq", "22-ficha-control-iq-extendida-escritorio", {
  accion: abrirExtendida,
});
await capturar(escritorio, "#/visual/eleccion", "23-figura-2-dibujada-escritorio");
await capturar(escritorio, "#/visual/interrupcion", "24-interrupcion-escritorio");
await capturar(escritorio, "#/pacientes/informacion", "25-informacion-pacientes-escritorio");
await capturar(escritorio, "#/capitulo/07-educacion", "26-apartado-con-citar-escuchar-escritorio", {
  accion: async (p) => p.getByRole("button", { name: "Cómo citar" }).click(),
});

// Las hojas tal como salen en papel (PDF A4, una cara).
const hoja = await escritorio.newPage();
for (const [ruta, nombre] of [
  ["#/pacientes/informacion", "30-papel-informacion-pacientes"],
  ["#/pacientes/resumen", "31-papel-resumen"],
  ["#/pacientes/plan/op5", "32-papel-plan-omnipod-5"],
]) {
  await hoja.goto(`${BASE}/${ruta}`, { waitUntil: "networkidle" });
  await asentar(hoja);
  await hoja.emulateMedia({ media: "print" });
  await hoja.evaluate(() => document.documentElement.classList.add("imprimiendo"));
  writeFileSync(
    `${DIR}/${nombre}.pdf`,
    await hoja.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true }),
  );
  await hoja.evaluate(() => document.documentElement.classList.remove("imprimiendo"));
  await hoja.emulateMedia({ media: "screen" });
  console.log(`${DIR}/${nombre}.pdf`);
}
await escritorio.close();
await browser.close();
