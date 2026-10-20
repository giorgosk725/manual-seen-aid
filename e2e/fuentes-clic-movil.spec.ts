/* 0.89.1 (13.ª ronda, senior): en el móvil (pantalla táctil, área de 44 px), tocar cada referencia
   de la línea de fuente abre esa referencia, también cuando la línea se parte en varias. */
import { expect, test } from "@playwright/test";
import { tapados } from "./fuentesClic";

for (const ruta of ["mm780/modos", "ciq/modos", "camaps/modos", "op5/modos", "ciq/funciona"])
  test(`fuentes de ${ruta} en el móvil: cada toque abre su referencia`, async ({ page }) => {
    await page.goto(`/#/sistemas/${ruta}`);
    expect(await tapados(page)).toEqual([]);
  });
