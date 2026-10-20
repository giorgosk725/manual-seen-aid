/* Interrupción del sistema (0.70.0): los cinco casos de una vez, en texto literal del
   apartado 7 (antes, una pestaña por duración con la frase resaltada). */
import { expect, test } from "@playwright/test";

test("los cinco casos, pod y bomba, en una sola pantalla", async ({ page }) => {
  await page.goto("/#/consultar/interrupcion");
  for (const frase of [
    /^Las interrupciones muy breves/,
    /a partir de aproximadamente 1\sh sin administración de insulina debe actuarse/,
    /^En interrupciones prolongadas/,
    /^En interrupciones programadas y de pocas horas/,
    /^Cuando se prevea una interrupción prolongada/,
  ])
    await expect(page.getByText(frase).first()).toBeVisible();
  await expect(page.getByText(/^Toda interrupción del sistema/)).toBeVisible();
  await expect(page.getByText("Pod", { exact: true })).toBeVisible();
  // Una dirección antigua con duración abre la misma pantalla.
  await page.goto("/#/consultar/interrupcion/prolongada");
  await expect(page.getByText(/^Las interrupciones muy breves/).first()).toBeVisible();
});
