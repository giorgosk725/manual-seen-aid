import { expect, test } from "@playwright/test";

/* 1.0.27 (auditoría de navegación de la 1.0.26): en el móvil, «Más» → destino no deja una entrada
   muerta (P2) y la pregunta frecuente abierta desde una ficha sigue en «Sistemas» (P5). */
test("«Más» → Tablas: un Atrás vuelve a la ficha, con el foco en «Más»", async ({ page }) => {
  await page.goto("/#/");
  await page.goto("/#/sistemas/ciq");
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: "Más" }).click();
  await page
    .getByRole("dialog", { name: "Menú" })
    .locator("a")
    .filter({ hasText: /^Tablas$/ })
    .first()
    .click();
  await expect(page).toHaveURL(/#\/consultar\/tablas$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/sistemas\/ciq$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.textContent?.trim()))
    .toBe("Más");
  await page.goBack();
  await expect(page).toHaveURL(/#\/$/);
});

test("pregunta frecuente desde la ficha: la barra marca «Sistemas»", async ({ page }) => {
  await page.goto("/#/sistemas/mm780/preguntas");
  await page.locator('main a[href^="#/preguntas/"]').locator("visible=true").first().click();
  await expect(page).toHaveURL(/#\/preguntas\/f\d+$/);
  const barra = page.getByRole("navigation", { name: "Barra inferior" });
  await expect(barra.getByRole("link", { name: "Sistemas" })).toHaveAttribute(
    "aria-current",
    "location",
  );
});
