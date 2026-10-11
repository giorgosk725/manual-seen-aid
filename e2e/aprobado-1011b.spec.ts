/* Cierre de la tanda del 11-10 (0.39.0): la Tabla 3 enseña el texto corregido sin rótulo de
   borrador; los pasos 5 y 6 del ejemplo van en cuatro partes. */
import { expect, test } from "@playwright/test";

test.describe("Cierre de la tanda del 11-10 (0.39.0)", () => {
  test("Tabla 3: «Cómo leer esta tabla» con el matiz de MiniMed y sin «borrador»", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/parametros");
    const leer = page.getByText("Cómo leer esta tabla").first();
    await leer.click();
    await expect(
      page.getByText(
        /En MiniMed 780G se utiliza en el calculador de bolos fuera del modo automático/,
      ),
    ).toBeVisible();
    await expect(page.getByText(/borrador pendiente de revisión/)).toHaveCount(0);
  });

  test("paso 5 del ejemplo: comentario en cuatro partes", async ({ page }) => {
    await page.goto("/#/casos/ejemplo-descarga/5");
    await page
      .getByRole("button", { name: /La subida tardía tras las cenas de fin de semana/ })
      .click();
    await expect(page.getByText("Qué falta comprobar")).toBeVisible();
    await expect(page.getByText(/no permiten elegir un ajuste definitivo/)).toBeVisible();
  });
});
