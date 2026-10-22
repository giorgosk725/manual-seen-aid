/* 0.89.1 (13.ª ronda, R5): en una comparación, «cambiar uno por otro» quitando primero: al quedar
   uno, la ficha con el selector a la vista; al marcar el otro, de vuelta a la pestaña de la
   comparación de la que se venía (Resumen ↔ Resumen, Parámetros ↔ Parámetros). */
import { expect, test } from "@playwright/test";

for (const [desde, vuelta] of [
  ["#/sistemas/ciq+camaps", /#\/sistemas\/mm780\+camaps$/],
  ["#/sistemas/ciq+camaps/parametros", /#\/sistemas\/mm780\+camaps\/parametros$/],
] as const)
  test(`quitar uno y marcar otro desde ${desde}`, async ({ page }) => {
    await page.goto(`/${desde}`);
    const barra = page.locator(".barra-pegada");
    await barra.getByRole("button", { name: /Control-IQ/, pressed: true }).click();
    await expect(page).toHaveURL(/#\/sistemas\/camaps/);
    await barra.getByRole("radio", { name: /MiniMed/ }).click();
    await expect(page).toHaveURL(vuelta);
  });
