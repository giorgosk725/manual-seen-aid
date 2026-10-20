/* 0.91.2 (peticiones del responsable, 21-10-2026): en el Resumen de la entrada, marcar deja solo
   las tarjetas marcadas (sin cambiar de pantalla); y la celda común del ejercicio anaeróbico, sin
   la frase de CamAPS FX cuando CamAPS FX no está en la comparación. */
import { expect, test } from "@playwright/test";

test("Resumen: con uno marcado, solo su tarjeta; al desmarcarlo, las cuatro", async ({ page }) => {
  await page.goto("/#/sistemas");
  const tarjetas = page.locator("main article");
  await expect(tarjetas).toHaveCount(4);
  await page
    .locator(".barra-pegada")
    .getByRole("button", { name: /MiniMed/ })
    .first()
    .click();
  await expect(tarjetas).toHaveCount(1);
  await expect(page).toHaveURL(/#\/sistemas$/);
  await page
    .locator(".barra-pegada")
    .getByRole("button", { name: /MiniMed/ })
    .first()
    .click();
  await expect(tarjetas).toHaveCount(4);
});

test("ejercicio anaeróbico: la frase de CamAPS FX solo si CamAPS FX está", async ({ page }) => {
  await page.goto("/#/sistemas/mm780+op5/modos");
  const celda = page.locator("main td", { hasText: /Habitualmente sin modo temporal/ }).first();
  await expect(celda).toBeVisible();
  await expect(celda).not.toContainText("CamAPS");
  await page.goto("/#/sistemas/camaps+op5/modos");
  await expect(
    page.locator("main td", { hasText: /Habitualmente sin modo temporal/ }).first(),
  ).toContainText("En CamAPS FX, no usar Boost");
});
