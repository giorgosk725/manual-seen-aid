/* Auditoría de uso del 4-10-2026 (0.10.0), en el móvil (Pixel 5). */
import { expect, test } from "@playwright/test";

test.describe("Uso 0.10.0 en el móvil", () => {
  // 0.53.0: sin lupa en la cabecera del móvil; «Buscar» está en la barra de abajo.
  test("en la portada, «Buscar» de la barra de abajo abre la búsqueda con la caja arriba", async ({
    page,
  }) => {
    await page.goto("/#/");
    await expect(page.locator("header").getByRole("button", { name: "Buscar" })).toHaveCount(0);
    await page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("link", { name: "Buscar" })
      .tap();
    await expect(page).toHaveURL(/#\/buscar$/);
    const caja = page.getByLabel("Texto a buscar");
    await expect(caja).toBeVisible();
    await expect
      .poll(async () => (await caja.boundingBox())?.y ?? 9999, { timeout: 3000 })
      .toBeLessThan(300);
  });

  test("Situación y sistema: la casilla del sistema queda a la vista, sobre la barra inferior", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ejercicio-aerobico");
    await page
      .getByRole("group", { name: "Sistema" })
      .getByRole("button", { name: /Omnipod 5/ })
      .click();
    await expect(page).toHaveURL(/ejercicio-aerobico:omnipod-5/);
    const conducta = page.getByRole("region", { name: "Conducta recomendada" });
    const barra = await page.getByRole("navigation", { name: "Barra inferior" }).boundingBox();
    await expect
      .poll(async () => {
        const c = await conducta.boundingBox();
        return c && barra ? c.y + Math.min(c.height, 120) <= barra.y : false;
      })
      .toBe(true);
  });

  test("Iniciar un sistema: nombres de sistema enteros, sin cortar", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio");
    for (const nombre of ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"]) {
      const b = page.getByRole("group", { name: "Sistema" }).getByRole("button", { name: nombre });
      await expect(b).toBeVisible();
      const recortado = await b
        .locator("span")
        .last()
        .evaluate((el) => el.scrollWidth > el.clientWidth);
      expect(recortado, nombre).toBe(false);
    }
  });
});
