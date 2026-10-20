/* 0.88.1 (duodécima ronda, senior): en el ordenador, pulsar el centro de cada referencia de la
   línea de fuente abre esa referencia (antes, el área táctil ampliada de la línea de abajo se
   quedaba los clics de la de arriba). */
import { expect, test } from "@playwright/test";

for (const id of ["mm780", "ciq", "camaps", "op5"])
  test(`fuentes de Modos de ${id}: cada clic abre su referencia`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/#/sistemas/${id}/modos`);
    const enlaces = page.locator("main .fuente-pie a:visible");
    await expect(enlaces.first()).toBeVisible();
    const tapados = await enlaces.evaluateAll((as) =>
      as
        .map((a) => {
          const r = a.getClientRects()[0];
          if (!r) return null;
          const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          const destino = el?.closest("a");
          return destino && destino !== a ? (a.textContent ?? "") : null;
        })
        .filter(Boolean),
    );
    expect(tapados).toEqual([]);
  });
