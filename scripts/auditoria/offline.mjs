// Prueba sin conexión del build de producción como usuario que vuelve (página ya controlada por el
// service worker): primera visita, segunda visita, red cortada y documentos nuevos.
// Uso: npm run build && npx vite preview --port 4185 --strictPort  (en otra terminal)
//      node scripts/auditoria/offline.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4185/";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 393, height: 851 } });
const p = await c.newPage();
await p.goto(BASE, { waitUntil: "networkidle" });
await p.evaluate(() => navigator.serviceWorker.ready);
await p.waitForTimeout(4000);
await p.reload({ waitUntil: "networkidle" }); // segunda visita: ya controlada
const controlada = await p.evaluate(() => !!navigator.serviceWorker.controller);
await c.setOffline(true);
const out = { controlada };
for (const ruta of [
  "",
  "#/capitulo/10-situaciones",
  "#/consultar/figura-3/naranja",
  "#/sistemas/camaps",
  "#/pacientes/informacion",
  "#/pacientes/plan/op5",
  "#/visual/gestacion-sistemas",
  // La última, la infografía: el script abre después su figura original.
  "#/consultar/infografia",
]) {
  await p.goto("about:blank");
  await p.goto(BASE + ruta, { waitUntil: "load" }); // documento nuevo, sin red
  await p.waitForTimeout(700);
  out[ruta || "#/"] = await p
    .locator("h1")
    .first()
    .textContent()
    .then((t) => t.slice(0, 50))
    .catch(() => "SIN H1");
}
await p.getByRole("button", { name: "Ver la figura original" }).click();
const img = p.locator("figure img");
await img.scrollIntoViewIfNeeded();
await p.waitForFunction(
  () => {
    const i = document.querySelector("figure img");
    return i && i.complete;
  },
  null,
  { timeout: 10000 },
);
out.infografiaAncho = await img.evaluate((i) => i.naturalWidth);
await p.goto(BASE + "#/sistemas");
await p.waitForTimeout(700);
out.fotosSistemas = await p.evaluate(() => [...document.images].map((i) => i.naturalWidth));
console.log(JSON.stringify(out, null, 1));
await b.close();
