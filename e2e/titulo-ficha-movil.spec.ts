/* 0.85.1 (novena ronda, los seis perfiles): el nombre del sistema en el título de la ficha no se
   sale de su caja ni queda bajo el botón de imprimir en el móvil, y no parte «Control-IQ». */
import { expect, test } from "@playwright/test";

for (const ancho of [360, 390, 414])
  test(`título de la ficha entero a ${ancho} px`, async ({ page }) => {
    await page.setViewportSize({ width: ancho, height: 800 });
    for (const id of ["mm780", "ciq", "camaps", "op5"]) {
      await page.goto(`/#/sistemas/${id}/funciona`);
      const h1 = page.locator("main h1").first();
      await expect(h1).toBeVisible();
      const m = await h1.evaluate((el) => {
        const boton = el.parentElement?.querySelector("button");
        return {
          desborda: el.scrollWidth > el.clientWidth + 1,
          derecha: el.getBoundingClientRect().right,
          boton: boton ? boton.getBoundingClientRect().left : Infinity,
          partido: /Control-\s*\n\s*IQ/.test((el as HTMLElement).innerText),
        };
      });
      expect(m.desborda, id).toBe(false);
      expect(m.derecha, id).toBeLessThanOrEqual(m.boton + 1);
      expect(m.partido, id).toBe(false);
    }
  });
