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

/* 0.86.1 (décima ronda, R5): la comparación con una fila pedida la deja marcada y a la vista. */
test("comparación con la fila de la gestación, marcada y a la vista a 390 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/");
  await page.goto("/#/sistemas/ciq+camaps/esencial:8");
  const fila = page.locator(".fila-resaltada:visible").filter({ hasText: "Gestación" }).first();
  await expect(fila).toBeInViewport();
});

/* 0.88.1 (duodécima ronda, visual): una fuente con varias referencias no desborda a 360 px. */
test("objetivos de MCG sin desbordar a 360 px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/#/visual/objetivos-mcg");
  await expect(page.locator("main h1").first()).toBeVisible();
  const [sw, cw] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
  ]);
  expect(sw).toBeLessThanOrEqual(cw);
});
