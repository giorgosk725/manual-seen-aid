// Auditoría de todas las rutas: desbordes a 6 anchos, axe en día y nocturno, errores de consola,
// enlaces internos (pantalla y ancla) y lista de enlaces externos.
// Requiere el dev server en :5180 (npm run dev -- --port 5180). Uso: node scripts/auditoria/rutas.mjs
// Salida: _audit_rutas.json (ignorado por git).
import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:5180/";
const AXE = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const SLUGS = [
  "01-introduccion",
  "02-componentes",
  "03-algoritmos",
  "04-sistemas",
  "05-resultados",
  "06-indicaciones",
  "07-educacion",
  "08-iniciacion",
  "09-descarga",
  "10-situaciones",
  "11-diy",
  "12-horizonte",
  "13-infografia",
];
const RUTAS = [
  "#/",
  "#/capitulo",
  "#/capitulo/todo",
  ...SLUGS.map((s) => `#/capitulo/${s}`),
  "#/consultar",
  ...["T1", "T2", "T3", "T4", "T5", "T6"].map((t) => `#/consultar/tablas/${t}`),
  "#/consultar/figura-3",
  ...["verde", "amarillo", "naranja", "rojo"].map((t) => `#/consultar/figura-3/${t}`),
  "#/consultar/infografia",
  "#/sistemas/todos/parametros",
  "#/sistemas/elegir",
  "#/sistemas/elegir/edad:4+peso:18+gestacion",
  "#/sistemas/mm780+op5/esencial",
  "#/consultar/situacion",
  "#/consultar/situacion/comida-grasa:camaps",
  "#/consultar/situacion/rm",
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `#/consultar/descarga/${n}`),
  "#/consultar/interrupcion",
  "#/consultar/interrupcion/prolongada",
  "#/visual",
  ...[
    "objetivos-mcg",
    "cetonemia",
    "ejercicio",
    "seguimiento",
    "algoritmos",
    "hipoglucemia",
    "transicion",
    "gestacion-sistemas",
    "hospital",
    "exploraciones",
    "eleccion",
    "interrupcion",
  ].map((d) => `#/visual/${d}`),
  "#/visual/objetivos-mcg/gestacion",
  "#/sistemas",
  "#/sistemas/mm780",
  "#/sistemas/ciq",
  "#/sistemas/camaps",
  "#/sistemas/op5",
  "#/buscar",
  "#/buscar/cetonemia",
  "#/buscar/Nightscout",
  "#/pacientes",
  "#/pacientes/informacion",
  "#/pacientes/resumen",
  "#/pacientes/plan",
  ...["mm780", "ciq", "camaps", "op5"].map((s) => `#/pacientes/plan/${s}`),
  "#/bibliografia",
  "#/cambios",
  "#/sobre",
  "#/test",
  "#/repaso",
  "#/consultar/inicio",
  "#/consultar/inicio/inicio:omnipod-5",
  "#/consultar/inicio/primeros-meses:minimed-780g",
  "#/consultar/inicio/hoja:control-iq",
  "#/repaso/siglas",
  "#/repaso/07-educacion",
  "#/mas",
];
const ANCHOS = [360, 393, 430, 768, 1024, 1440];
const DESACTIVADAS = {
  region: { enabled: false },
  "page-has-heading-one": { enabled: false },
  "landmark-one-main": { enabled: false },
  "landmark-unique": { enabled: false },
  "heading-order": { enabled: false },
};

const out = { desbordes: [], axe: [], consola: [], enlacesRotos: [], noEncontrada: [] };
const enlaces = new Set();
const externos = new Set();
const browser = await chromium.launch();

// Espera a que terminen animaciones y transiciones (axe mide el color mezclado si no).
const asentar = (page) =>
  page.evaluate(() =>
    Promise.race([
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, 1500)),
    ]),
  );

async function visitar(ctx, ruta, { axe, night, recoger }) {
  const page = await ctx.newPage();
  page.on("pageerror", (e) => out.consola.push({ ruta, error: String(e).slice(0, 200) }));
  page.on("console", (m) => {
    if (m.type() === "error") out.consola.push({ ruta, error: m.text().slice(0, 200) });
  });
  // La preferencia nocturna persiste en el contexto: se fija en cada visita, también de día.
  await page.addInitScript((n) => localStorage.setItem("mseen:night", n ? "1" : "0"), night);
  await page.goto(BASE + ruta, { waitUntil: "networkidle" });
  await asentar(page);
  if (await page.getByText("Esa pantalla no existe.").count()) out.noEncontrada.push(ruta);
  const w = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  if (w.sw > w.cw + 1) {
    const culpables = await page.evaluate(
      (cw) =>
        [...document.querySelectorAll("body *")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return (
              r.width > 0 &&
              r.right > cw + 1 &&
              !e.closest(".tabla-scroll, .overflow-x-auto, .overflow-auto")
            );
          })
          .slice(0, 3)
          .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 50)}`),
      w.cw,
    );
    out.desbordes.push({ ruta, ancho: page.viewportSize().width, exceso: w.sw - w.cw, culpables });
  }
  if (recoger) {
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    );
    for (const h of hrefs) {
      if (h.startsWith("#/")) enlaces.add(h);
      else if (/^https?:/.test(h)) externos.add(h);
    }
  }
  if (axe) {
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(
      async (rules) =>
        await window.axe.run(
          { exclude: [['[aria-hidden="true"][class*="pointer-events-none"]']] },
          { rules },
        ),
      DESACTIVADAS,
    );
    for (const v of r.violations)
      out.axe.push({
        ruta,
        ancho: page.viewportSize().width,
        night,
        id: v.id,
        impacto: v.impact,
        n: v.nodes.length,
        ej: v.nodes[0]?.target.join(" "),
        mensaje: v.nodes[0]?.any?.[0]?.message,
      });
  }
  await page.close();
}

for (const ancho of ANCHOS) {
  const ctx = await browser.newContext({
    viewport: { width: ancho, height: 860 },
    isMobile: ancho < 768,
    hasTouch: ancho < 768,
  });
  for (const ruta of RUTAS) {
    const axe = ancho === 393 || ancho === 1440;
    await visitar(ctx, ruta, { axe, night: false, recoger: ancho === 1440 });
    if (axe) await visitar(ctx, ruta, { axe: true, night: true, recoger: false });
  }
  await ctx.close();
  console.log("ancho", ancho, "hecho");
}

// Enlaces internos: cada uno abre una pantalla que existe y, si apunta a un bloque, el ancla.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
for (const h of [...enlaces].sort()) {
  await page.goto(BASE + h, { waitUntil: "networkidle" });
  await page.waitForTimeout(150);
  if (await page.getByText("Esa pantalla no existe.").count()) {
    out.enlacesRotos.push({ href: h, motivo: "pantalla inexistente" });
    continue;
  }
  const partes = h.replace(/^#\//, "").split("/").map(decodeURIComponent);
  if (partes[0] === "capitulo" && partes[2]) {
    const existe = await page.evaluate((id) => !!document.getElementById(id), partes[2]);
    if (!existe) out.enlacesRotos.push({ href: h, motivo: `no existe el ancla #${partes[2]}` });
  }
}
await browser.close();
out.externos = [...externos].sort();
out.enlacesInternos = enlaces.size;
writeFileSync("_audit_rutas.json", JSON.stringify(out, null, 1), "utf8");
console.log(
  `rutas ${RUTAS.length} × anchos ${ANCHOS.length}; desbordes ${out.desbordes.length}; axe ${out.axe.length}; consola ${out.consola.length}; enlaces internos ${enlaces.size}, rotos ${out.enlacesRotos.length}; externos ${out.externos.length}; no encontradas ${out.noEncontrada.length}`,
);
