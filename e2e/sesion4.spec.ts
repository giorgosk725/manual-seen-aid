import { test, expect, type Page } from "@playwright/test";
import { auditar } from "./axe";

/* Sesión 4 · escritorio: hojas para el paciente en UNA cara A4, nocturno con axe en las
   pantallas nuevas, búsqueda con el grupo «fuera del capítulo» y enlace profundo a la versión
   extendida. */

/* Imprime la región como lo hace el botón (clase `imprimiendo`) y cuenta las páginas del PDF. */
const paginasAlImprimir = async (page: Page) => {
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.documentElement.classList.add("imprimiendo"));
  const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
  await page.evaluate(() => document.documentElement.classList.remove("imprimiendo"));
  await page.emulateMedia({ media: "screen" });
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
};

test.describe("Para el paciente: una cara A4", () => {
  for (const [ruta, nombre] of [
    ["/#/pacientes/informacion", "Información para pacientes"],
    ["/#/pacientes/resumen", "Resumen"],
    ["/#/pacientes/plan/mm780", "Plan de seguridad · MiniMed 780G"],
    ["/#/pacientes/plan/ciq", "Plan de seguridad · Control-IQ"],
    ["/#/pacientes/plan/camaps", "Plan de seguridad · CamAPS"],
    ["/#/pacientes/plan/op5", "Plan de seguridad · Omnipod 5"],
  ] as const) {
    test(`${nombre} cabe en una cara`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole("img", { name: /Código QR/ })).toBeVisible();
      expect(await paginasAlImprimir(page), nombre).toBe(1);
    });
  }
});

/* Letra grande (decisión del autor, 3-10-2026): 12 pt en una columna, aunque ocupe tres caras;
   el resumen, dos. Se elige en la propia hoja y se recuerda en el navegador. */
test.describe("Para el paciente: letra grande", () => {
  test("el selector cambia el formato y el botón de imprimir", async ({ page }) => {
    await page.goto("/#/pacientes/resumen");
    await expect(page.getByRole("button", { name: "Imprimir en una cara" })).toBeVisible();
    await page.getByRole("button", { name: /Letra grande/ }).click();
    await expect(page.getByRole("button", { name: "Imprimir con letra grande" })).toBeVisible();
    await expect(page.locator(".hoja-a4.grande")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".hoja-a4.grande")).toHaveCount(1);
  });
  for (const [ruta, nombre, maximo] of [
    ["/#/pacientes/informacion", "Información para pacientes", 3],
    ["/#/pacientes/resumen", "Resumen", 2],
    ["/#/pacientes/plan/mm780", "Plan de seguridad · MiniMed 780G", 3],
    ["/#/pacientes/plan/op5", "Plan de seguridad · Omnipod 5", 3],
  ] as const) {
    test(`${nombre}: 12 pt y como mucho ${maximo} caras`, async ({ page }) => {
      await page.addInitScript(() =>
        localStorage.setItem("mseen:hoja", JSON.stringify("letra-grande")),
      );
      await page.goto(ruta);
      await expect(page.getByRole("img", { name: /Código QR/ })).toBeVisible();
      await page.emulateMedia({ media: "print" });
      await page.evaluate(() => document.documentElement.classList.add("imprimiendo"));
      const letra = await page.evaluate(
        () => getComputedStyle(document.querySelector(".hoja-a4 p, .hoja-a4 li")!).fontSize,
      );
      await page.evaluate(() => document.documentElement.classList.remove("imprimiendo"));
      await page.emulateMedia({ media: "screen" });
      expect(letra, nombre).toBe("16px");
      const paginas = await paginasAlImprimir(page);
      expect(paginas, nombre).toBeGreaterThanOrEqual(2);
      expect(paginas, nombre).toBeLessThanOrEqual(maximo);
    });
  }
});

test.describe("Nocturno en lo nuevo", () => {
  test("pacientes, plan, test, diagramas nuevos y versión extendida sin violaciones", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Modo nocturno" }).first().click();
    await expect(page.locator("html")).toHaveClass(/night/);
    await auditar(page, "Portada con «¿Qué necesitas?»");
    for (const [ruta, nombre] of [
      ["/#/pacientes", "Para el paciente"],
      ["/#/pacientes/informacion", "Información para pacientes"],
      ["/#/pacientes/plan/op5", "Plan de seguridad"],
      ["/#/test", "Autoevaluación"],
      ["/#/visual/gestacion-sistemas", "Gestación por sistema"],
      ["/#/visual/hospital", "Hospital"],
      ["/#/visual/exploraciones", "Exploraciones"],
      ["/#/visual/eleccion", "Elección compartida"],
      ["/#/visual/interrupcion", "Interrupción"],
    ] as const) {
      await page.goto(ruta);
      await auditar(page, nombre);
    }
    await page.goto("/#/capitulo/12-horizonte");
    await page
      .locator("details.extendida")
      .first()
      .evaluate((d) => ((d as HTMLDetailsElement).open = true));
    await auditar(page, "Versión extendida abierta");
  });
});

test.describe("Búsqueda y enlaces", () => {
  test("lo que no es del capítulo sale aparte y rotulado", async ({ page }) => {
    await page.goto("/#/buscar/Nightscout");
    await expect(
      page.getByRole("heading", { name: /Fuera del capítulo · versión extendida y ampliación/ }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: /Versión extendida del autor · DIY: Nightscout y AAPS/ })
      .click();
    await expect(page.locator("#ext-E49")).toBeVisible();
  });

  test("la barra lateral agrupa Consultar en cuatro grupos y añade Para el paciente", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    for (const g of [
      "Sistemas",
      "Situaciones y recorridos",
      "Figuras y tablas",
      "Glosario",
      "Para el paciente",
    ])
      await expect(nav.getByText(g, { exact: true }).first()).toBeVisible();
  });
});
