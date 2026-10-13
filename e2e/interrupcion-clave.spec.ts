/* Interrupción del sistema (13-10-2026): la frase que responde a cada tramo, resaltada dentro
   del párrafo entero. */
import { expect, test } from "@playwright/test";

test("cada duración resalta su frase del párrafo, que sigue entero", async ({ page }) => {
  for (const [tramo, frase] of [
    ["breve", /^Las interrupciones muy breves/],
    ["una-hora", /^Como umbral operativo/],
    ["pocas-horas", /^En interrupciones programadas y de pocas horas/],
    ["prolongada", /^En interrupciones prolongadas/],
    ["programada", /^Cuando se prevea una interrupción prolongada/],
  ] as const) {
    await page.goto(`/#/consultar/interrupcion/${tramo}`);
    await expect(page.locator("mark").first()).toHaveText(frase);
  }
  // El párrafo sigue entero: la primera frase, sin resaltar.
  await page.goto("/#/consultar/interrupcion/breve");
  await expect(page.getByText(/^Toda interrupción del sistema/)).toBeVisible();
});
