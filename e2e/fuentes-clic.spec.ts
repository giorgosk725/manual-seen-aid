/* 0.88.1 (duodécima ronda, senior): en el ordenador, pulsar cada referencia de la línea de fuente
   abre esa referencia (antes, el área táctil ampliada de la línea de abajo se quedaba los clics de
   la de arriba). 0.89.1 (13.ª ronda, senior): en cada línea que ocupa la referencia y a distintas
   alturas de su texto (15, 50 y 85 %), no solo en el centro; también en el móvil
   (fuentes-clic-movil.spec.ts). */
import { expect, test } from "@playwright/test";
import { tapados } from "./fuentesClic";

for (const id of ["mm780", "ciq", "camaps", "op5"])
  test(`fuentes de Modos de ${id}: cada clic abre su referencia`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/#/sistemas/${id}/modos`);
    expect(await tapados(page)).toEqual([]);
  });
