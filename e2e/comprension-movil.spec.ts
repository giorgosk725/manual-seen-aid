/* Entrega 3 del plan del 9-10-2026, en el móvil (Pixel 5): la sigla abre una hoja al pie sobre
   la barra inferior y se cierra; «Cómo funciona» cabe sin desbordar. */
import { expect, test } from "@playwright/test";

test.describe("Comprensión en el móvil", () => {
  test("la sigla abre una hoja al pie, sobre la barra inferior, y se cierra", async ({ page }) => {
    await page.goto("/#/capitulo/02-componentes");
    await page.getByRole("button", { name: "MCG", exact: true }).tap();
    const panel = page.getByRole("dialog", { name: "Sigla MCG" });
    await expect(panel).toBeVisible();
    const barra = await page.getByRole("navigation", { name: "Barra inferior" }).boundingBox();
    const caja = await panel.boundingBox();
    expect(caja && barra && caja.y + caja.height <= barra.y + 1).toBe(true);
    await expect(panel).toContainText("monitorización continua de glucosa");
    await panel.getByRole("button", { name: "Cerrar" }).tap();
    await expect(panel).toBeHidden();
  });

  test("Cómo funciona de un sistema cabe en el móvil", async ({ page }) => {
    await page.goto("/#/sistemas/camaps/funciona");
    await expect(
      page.getByRole("heading", { level: 2, name: /^Cómo funciona · myLoop CamAPS/ }),
    ).toBeInViewport();
    const ancho = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(ancho).toBeLessThanOrEqual(0);
  });
});
