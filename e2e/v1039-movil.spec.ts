import { expect, test } from "@playwright/test";

/* 1.0.39 (revisión de Fable sobre la vista previa de la 1.0.39), en el móvil (Pixel 5). */
test.describe("1.0.39 · móvil", () => {
  test("una pantalla que no existe no marca «Más» en la barra de abajo", async ({ page }) => {
    await page.goto("/#/xyz");
    await expect(page.locator("main h1")).toHaveText("Esa pantalla no existe");
    await expect(page.locator("nav[aria-label='Barra inferior'] [aria-current]")).toHaveCount(0);
    await page.goto("/#/bibliografia");
    await expect(page.locator("nav[aria-label='Barra inferior'] [aria-current]")).toHaveCount(1);
  });

  test("casillas del plan de respaldo: 44 px de alto para el dedo", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio::respaldo");
    const casillas = page.locator("main label:has(input[type=checkbox])");
    await expect(casillas.first()).toBeVisible();
    const bajas = await casillas.evaluateAll(
      (xs) => xs.filter((x) => x.getBoundingClientRect().height < 43.5).length,
    );
    expect(bajas).toBe(0);
  });
});
