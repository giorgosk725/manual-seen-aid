import { test, expect, type Page } from "@playwright/test";
import { createRequire } from "node:module";

/* Accesibilidad en el móvil (0.53.0, proyecto «movil»): en las pantallas principales, axe sin
   ninguna infracción (contraste incluido); todo lo que se toca, con una zona táctil de al menos
   44 × 44 px (WCAG 2.5.5; cuenta el ::after de `.tap-44`), salvo los enlaces dentro de una frase
   y las siglas pulsables del texto, que la norma exime; y sin desplazamiento lateral a 320 px. */
const AXE = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const RUTAS = [
  "#/",
  "#/capitulo",
  "#/capitulo/07-educacion",
  "#/sistemas",
  "#/sistemas/ciq",
  "#/sistemas/todos/esencial",
  "#/sistemas/elegir",
  "#/consultar/figura-3",
  "#/consultar/figura-3/naranja",
  "#/consultar/situacion/rm:mm780",
  "#/consultar/descarga/3",
  "#/consultar/interrupcion",
  "#/consultar/inicio/inicio:omnipod-5",
  "#/consultar/tablas/T1",
  "#/pacientes",
  "#/pacientes/plan/op5",
  "#/visual/figuras",
  "#/visual",
  "#/bibliografia",
  "#/sobre",
  "#/test",
  "#/preguntas",
  "#/buscar",
];

async function abrir(page: Page, ruta: string) {
  await page.goto(`/${ruta}`);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await page.waitForSelector("[data-cargando]", { state: "detached" }).catch(() => {});
  await page.waitForTimeout(300);
}

const pequenos = (page: Page) =>
  page.evaluate(() => {
    const out: string[] = [];
    const sel =
      "a[href], button, [role=button], input, select, summary, [tabindex]:not([tabindex='-1'])";
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (el.closest("[aria-hidden=true], .sr-only, .sigla")) continue;
      const st = getComputedStyle(el);
      const padre = el.closest("p, li, td, dd, figcaption, blockquote");
      const texto = (el.textContent ?? "").trim();
      const enFrase =
        st.display === "inline" &&
        padre &&
        (padre.textContent ?? "").trim().length > texto.length + 20;
      if (enFrase) continue;
      let [w, h] = [r.width, r.height];
      if (el.classList.contains("tap-44")) {
        const a = getComputedStyle(el, "::after");
        w = Math.max(w, parseFloat(a.width) || 0);
        h = Math.max(h, parseFloat(a.height) || 0);
      }
      if (w >= 43.5 && h >= 43.5) continue;
      out.push(
        `${Math.round(w)}×${Math.round(h)} «${(el.getAttribute("aria-label") || texto).slice(0, 50)}»`,
      );
    }
    return out;
  });

test("móvil: axe sin infracciones y zonas táctiles de 44 px", async ({ page }) => {
  test.setTimeout(240000);
  const fallos: string[] = [];
  for (const ruta of RUTAS) {
    await abrir(page, ruta);
    for (const m of await pequenos(page)) fallos.push(`${ruta}: ${m}`);
    await page.evaluate(
      () =>
        Promise.race([
          Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
          new Promise((r) => setTimeout(r, 2000)),
        ]) as Promise<unknown>,
    );
    await page.addScriptTag({ path: AXE });
    const v = await page.evaluate(
      async () =>
        // @ts-expect-error axe se inyecta en la página
        (await window.axe.run(document, { rules: { region: { enabled: false } } })).violations.map(
          (x: { id: string; nodes: { target: string[] }[] }) =>
            `${x.id} en ${x.nodes.map((n) => n.target.join(" ")).join(", ")}`,
        ) as string[],
    );
    for (const x of v) fallos.push(`${ruta}: axe ${x}`);
  }
  expect(fallos, fallos.join("\n")).toEqual([]);
});

test("móvil a 320 px: ninguna pantalla se desplaza de lado", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 320, height: 640 });
  const anchas: string[] = [];
  for (const ruta of RUTAS) {
    await abrir(page, ruta);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    if (w > 320) anchas.push(`${ruta}: ${w} px`);
  }
  expect(anchas, anchas.join("\n")).toEqual([]);
});
