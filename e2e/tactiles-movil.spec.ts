import { test, expect } from "@playwright/test";

/* Objetivos táctiles (proyecto «movil», 393 px): todo lo que se toca mide al menos 24 × 24 px
   (WCAG 2.5.8), salvo los enlaces en línea dentro de una frase, que la norma exime. Las migas,
   la cabecera y los enlaces sueltos principales ya llevan 44 px. */
const RUTAS = [
  "#/",
  "#/capitulo",
  "#/capitulo/10-situaciones",
  "#/sistemas/todos/esencial",
  "#/consultar/figura-3/naranja",
  "#/consultar/situacion/rm:mm780",
  "#/consultar/tablas/T1",
  "#/sistemas",
  "#/sistemas/ciq",
  "#/pacientes",
  "#/pacientes/informacion",
  "#/pacientes/plan/op5",
  "#/visual",
  "#/bibliografia",
  "#/sobre",
  "#/test",
  "#/repaso",
  "#/consultar/inicio/inicio:omnipod-5",
  "#/consultar/inicio/hoja",
  "#/buscar/insulina",
];

test("objetivos táctiles de al menos 24 px en las pantallas principales", async ({ page }) => {
  test.setTimeout(90000);
  const pequenos: string[] = [];
  for (const ruta of RUTAS) {
    await page.goto(`/${ruta}`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.waitForSelector("[data-cargando]", { state: "detached" }).catch(() => {});
    const malos = await page.evaluate(() => {
      const out: string[] = [];
      const sel =
        "a[href], button, [role=button], input, select, summary, [tabindex]:not([tabindex='-1'])";
      for (const el of document.querySelectorAll<HTMLElement>(sel)) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || (r.width >= 24 && r.height >= 24)) continue;
        if (el.closest("[aria-hidden=true], .sr-only")) continue;
        const st = getComputedStyle(el);
        const padre = el.closest("p, li, td, dd, figcaption, blockquote");
        const texto = (el.textContent ?? "").trim();
        const enFrase =
          st.display === "inline" &&
          padre &&
          (padre.textContent ?? "").trim().length > texto.length + 20;
        if (enFrase) continue;
        out.push(
          `${Math.round(r.width)}×${Math.round(r.height)} «${(el.getAttribute("aria-label") || texto).slice(0, 50)}»`,
        );
      }
      return out;
    });
    pequenos.push(...malos.map((m) => `${ruta}: ${m}`));
  }
  expect(pequenos, pequenos.join("\n")).toEqual([]);
});
