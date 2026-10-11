/* Entrega 4 (revisión de la 0.34): el aspecto de Iniciar va en la ruta y sobrevive a Atrás;
   una comparación no se parte en dos; recientes nombra los sistemas comparados. */
import { expect, test } from "@playwright/test";

test.describe("Entrega 4 (0.35.0)", () => {
  test("Iniciar: el aspecto va en la ruta, se pliega el índice y vuelve tras Atrás", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    const indice = page.getByRole("navigation", { name: "En esta fase" });
    await indice.getByRole("button").nth(2).click();
    await expect(page).toHaveURL(/#\/consultar\/inicio\/inicio:omnipod-5:a\d+$/);
    await expect(page.locator('[id^="pieza-"]')).toHaveCount(1);
    await expect(indice.getByText(/^Aspecto:/)).toBeVisible();
    await expect(indice.getByRole("button", { name: "Cambiar" })).toBeVisible();
    await page
      .getByRole("link", { name: /Ver en el (capítulo|apartado)/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page).toHaveURL(/:a\d+$/);
    await expect(page.locator('[id^="pieza-"]')).toHaveCount(1);
    await indice.getByRole("button", { name: "Fase completa" }).click();
    await expect(page).toHaveURL(/#\/consultar\/inicio\/inicio:omnipod-5$/);
  });

  test("una comparación entre variantes no añade «También sobre»", async ({ page }) => {
    await page.goto(
      "/#/buscar/%C2%BFQu%C3%A9%20diferencia%20hay%20entre%20Control-IQ%20y%20Control-IQ%2B%3F",
    );
    await expect(
      page.getByText("¿Qué diferencia hay entre Control-IQ y Control-IQ+?").first(),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: /^También sobre/ })).toHaveCount(0);
  });

  test("recientes nombra los sistemas comparados", async ({ page }) => {
    await page.goto("/#/sistemas/ciq+op5/funciona");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/#/");
    const recientes = page.getByRole("navigation", { name: "Lo último que consultaste" });
    await expect(
      recientes.getByRole("link", { name: /Control-IQ \+ Omnipod 5 · Cómo funciona/ }),
    ).toBeVisible();
  });
});
