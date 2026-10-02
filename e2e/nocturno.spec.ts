import { test, expect, type Page } from "@playwright/test";
import { auditar } from "./axe";

/* Modo nocturno con axe en navegador de verdad (jsdom no ve el contraste). */
const encender = async (page: Page) => {
  await page.getByRole("button", { name: "Modo nocturno" }).first().click();
  await expect(page.locator("html")).toHaveClass(/night/);
};

test.describe("Modo nocturno", () => {
  test("se guarda y sobrevive a recargar", async ({ page }) => {
    await page.goto("/");
    await encender(page);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/night/);
    await page.getByRole("button", { name: "Modo día" }).first().click();
    await expect(page.locator("html")).not.toHaveClass(/night/);
  });

  test("portada, lectura, tabla por sistema y Figura 3 sin violaciones", async ({ page }) => {
    await page.goto("/");
    await encender(page);
    await auditar(page, "Portada");
    await page.goto("/#/capitulo/09-descarga");
    await auditar(page, "Interpretación de la descarga");
    await page.goto("/#/consultar/tablas/T3");
    await auditar(page, "Tabla 3");
    await page.goto("/#/consultar/figura-3/naranja");
    await auditar(page, "Figura 3, rama naranja");
  });
});
