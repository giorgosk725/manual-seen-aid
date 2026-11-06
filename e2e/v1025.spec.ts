import { expect, test } from "@playwright/test";

/* 1.0.25: regla única de historial, foco, letra en escritorio y nombres. */
test.describe("1.0.25 · historial", () => {
  test("los pasos de la descarga y las vistas de Iniciación se deshacen con Atrás", async ({
    page,
  }) => {
    await page.goto("/#/consultar/descarga/2");
    await page
      .getByRole("button", { name: /^Paso 3/ })
      .first()
      .click();
    await expect(page).toHaveURL(/descarga\/3$/);
    await page.goBack();
    await expect(page).toHaveURL(/descarga\/2$/);
    await page.goto("/#/consultar/inicio/calculadora:control-iq");
    await page.getByRole("button", { name: "Fases", exact: true }).click();
    await expect(page).not.toHaveURL(/calculadora/);
    await page.goBack();
    await expect(page).toHaveURL(/calculadora:control-iq$/);
  });

  test("móvil: «Otra situación» vuelve a la lista sin apilar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/");
    await page.goto("/#/consultar/situacion");
    await page.locator('[data-origen="situacion-rm"]:visible').click();
    await expect(page).toHaveURL(/situacion\/rm/);
    await page.getByRole("link", { name: "‹ Otra situación" }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion$/);
    await page.goBack();
    await expect(page).not.toHaveURL(/situacion\/rm/);
  });
});

test.describe("1.0.25 · lectura", () => {
  test("escritorio: texto a 15 px; ficha con «Cálculo inicial»", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/sistemas/ciq/parametros");
    await expect(page.getByRole("link", { name: "Cálculo inicial" })).toBeVisible();
    const t = page.locator("main .text-sm").first();
    expect(await t.evaluate((el) => getComputedStyle(el).fontSize)).toBe("15px");
    await page.setViewportSize({ width: 1024, height: 768 });
    expect(await t.evaluate((el) => getComputedStyle(el).fontSize)).toBe("14px");
  });
});
