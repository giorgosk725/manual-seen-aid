/* Entrega 1 de la auditoría de la 0.31 (0.32.0): volver desde la fuente conserva la posición,
   un sistema no cubierto se dice, «paso 7» abre un solo acceso, Figura 3 con su nota junto al
   tramo y sin «Seguir leyendo». */
import { expect, test } from "@playwright/test";

test.describe("Entrega 1 (0.32.0)", () => {
  test("Ver en el capítulo y Atrás devuelven al mismo punto de la ficha", async ({ page }) => {
    await page.goto("/#/sistemas/op5/parametros");
    await expect(page.locator("#parametros")).toBeVisible();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(400);
    const antes = await page.evaluate(() => window.scrollY);
    expect(antes).toBeGreaterThan(250);
    await page
      .locator("#parametros")
      .locator("..")
      .getByRole("link", { name: "Ver en el capítulo" })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/op5\/parametros$/);
    await page.waitForTimeout(600);
    const despues = await page.evaluate(() => window.scrollY);
    expect(Math.abs(despues - antes)).toBeLessThan(120);
  });

  test("un sistema que el capítulo no trata se dice antes de lo general", async ({ page }) => {
    await page.goto("/#/buscar/c%C3%B3mo%20configuro%20un%20sistema%20iLet");
    await expect(page.getByText("El capítulo no trata iLet.")).toBeVisible();
  });

  test("«paso 7 de la descarga»: un solo Abrir y el paso 7 como pasaje principal", async ({
    page,
  }) => {
    await page.goto("/#/buscar/paso%207%20de%20la%20descarga");
    const abrir = page
      .getByRole("list", { name: "Abrir" })
      .getByRole("link", { name: /Revisar la descarga · paso 7/ });
    await expect(abrir).toHaveCount(1);
    await expect(page.getByText(/Paso 7 · Respuesta automática/).first()).toBeVisible();
  });

  test("la Figura 3 enseña la nota de las dosis junto al tramo", async ({ page }) => {
    await page.goto("/#/consultar/figura-3/naranja");
    const rama = page.getByRole("region", { name: /1,0-2,9/ });
    await expect(rama.getByText(/Dosis orientativas para personas adultas/)).toBeVisible();
  });

  test("ya no hay «Seguir leyendo» ni «Leído»", async ({ page }) => {
    await page.goto("/#/capitulo/07-educacion");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.goto("/#/");
    await expect(page.getByText("Seguir leyendo")).toHaveCount(0);
    await page.goto("/#/capitulo");
    await expect(page.getByText(/^Leído$/)).toHaveCount(0);
  });
});
