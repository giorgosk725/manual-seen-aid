/* Entrega 4 (revisión de la 0.34): el aspecto de Iniciar va en la ruta y sobrevive a Atrás;
   una comparación no se parte en dos; recientes nombra los sistemas comparados. */
import { expect, test } from "@playwright/test";

test.describe("Entrega 4 (0.35.0)", () => {
  test("Iniciar: el paso va en la ruta, enlaza su fuente y vuelve tras Atrás", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:transicion");
    await page.getByRole("button", { name: "Múltiples dosis (plumas)" }).click();
    await expect(page.getByText(/Reducción de la DTD al pasar de MDI/)).toBeVisible();
    await page
      .getByRole("link", { name: /Tabla 2, p\. 10/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForTimeout(300);
    await page.goBack();
    await expect(page).toHaveURL(/:transicion$/);
    await expect(page.getByText(/Reducción de la DTD al pasar de MDI/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Múltiples dosis (plumas)" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Un enlace antiguo con aspecto abre el paso que contiene esa pieza.
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:a4");
    await expect(page.getByRole("heading", { name: /^2\.\s*Programación inicial/ })).toBeVisible();
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
});
