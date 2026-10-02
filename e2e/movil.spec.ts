import { test, expect, type Page } from "@playwright/test";
import { auditar } from "./axe";

/* Móvil (393×851, táctil): barra inferior, cajón del índice, tablas como fichas y sin
   desbordamiento horizontal en las pantallas principales. */

const sinScrollHorizontal = async (page: Page, pantalla: string) => {
  const ancho = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(ancho, `${pantalla} desborda ${ancho}px en horizontal`).toBeLessThanOrEqual(0);
};

test.describe("Móvil (393 px)", () => {
  test("barra inferior con cinco destinos y sin barra lateral", async ({ page }) => {
    await page.goto("/");
    const barra = page.getByRole("navigation", { name: /Barra inferior/ });
    for (const e of ["Inicio", "Capítulo", "Consultar", "Buscar", "Más"]) {
      await expect(barra.getByRole("link", { name: e })).toBeVisible();
    }
    await expect(page.getByRole("navigation", { name: /Navegación principal/ })).toBeHidden();
    await sinScrollHorizontal(page, "Portada");
  });

  test("el cajón del índice abre un apartado; la tabla se ve como fichas", async ({ page }) => {
    await page.goto("/#/capitulo");
    await page.getByRole("button", { name: "Índice del capítulo" }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /Sistemas AID comercializados/ })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sistemas AID");
    await expect(page.getByRole("table")).toBeHidden();
    await expect(
      page.getByRole("listitem").filter({ hasText: "Sensores compatibles" }).first(),
    ).toBeVisible();
    await sinScrollHorizontal(page, "Apartado 4");
  });

  test("Figura 3: los cuatro tramos caben en dos columnas y la rama elegida se ve", async ({
    page,
  }) => {
    await page.goto("/#/consultar/figura-3");
    await page.getByRole("button", { name: /β-OHB ≥3,0 mmol\/l/ }).click();
    await expect(page.getByText("URGENCIAS / VALORACIÓN HOSPITALARIA INMEDIATA.")).toBeVisible();
    await sinScrollHorizontal(page, "Figura 3");
  });

  test("tamaño de letra: A+ aumenta la columna de lectura y se recuerda", async ({ page }) => {
    await page.goto("/#/capitulo/01-introduccion");
    const p = page.locator(".prosa p").first();
    const antes = await p.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    await page.getByRole("button", { name: "Letra más grande" }).click();
    const despues = await p.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(despues).toBeGreaterThan(antes);
    await page.reload();
    const tras = await page
      .locator(".prosa p")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(tras).toBe(despues);
  });

  test("portada y un apartado sin violaciones axe en móvil", async ({ page }) => {
    await page.goto("/");
    await auditar(page, "Portada móvil");
    await page.goto("/#/capitulo/10-situaciones");
    await auditar(page, "Situaciones especiales móvil");
  });
});
