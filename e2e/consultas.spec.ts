/* Consultas sin respuesta: la edición editorial no las registra (e2e/privacidad.spec.ts) y, desde
   la 0.55.0 (V54-12), la pantalla administrativa que las listaba con clave no entra en el build
   público: su dirección enseña «Sobre este complemento» y no pide ninguna clave. */
import { expect, test } from "@playwright/test";

test.describe("Consultas sin respuesta", () => {
  test("la dirección antigua no ofrece la lista ni pide clave", async ({ page }) => {
    await page.goto("/#/sobre/consultas");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sobre este complemento");
    await expect(page.getByLabel("Clave de lectura")).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("mseen:clave"))).toBeNull();
  });
});
