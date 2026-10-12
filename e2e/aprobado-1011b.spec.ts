/* Cierre de la tanda del 11-10 (0.39.0): la Tabla 3 enseña el texto corregido sin rótulo de
   borrador; los pasos 5 y 6 del ejemplo van en cuatro partes. */
import { expect, test } from "@playwright/test";

test.describe("Cierre de la tanda del 11-10 (0.39.0)", () => {
  test("Comparar los parámetros: sin «Cómo leer esta tabla» ni «borrador»", async ({ page }) => {
    await page.goto("/#/sistemas/todos/parametros");
    await expect(page.getByText(/Tasa basal programada/).first()).toBeVisible();
    await expect(page.getByText("Cómo leer esta tabla")).toHaveCount(0);
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

  test("pasos 5 y 6 en «Ver todo»: opciones y comentarios alineados con el desglose", async ({
    page,
  }) => {
    await page.goto("/#/casos/ejemplo-descarga");
    await page.getByRole("button", { name: "Ver todo" }).click();
    await expect(
      page.getByText(/antes de atribuirlas a una causa o decidir un ajuste global/),
    ).toBeVisible();
    await expect(page.getByText(/no justifican por sí solas subir el objetivo/)).toBeVisible();
    await expect(page.getByText(/Tampoco permite descartarla/)).toBeVisible();
    await expect(page.getByText(/responde a su composición, no a la ratio/)).toHaveCount(0);
    await expect(page.getByText("Qué falta comprobar")).toHaveCount(3);
  });
});
