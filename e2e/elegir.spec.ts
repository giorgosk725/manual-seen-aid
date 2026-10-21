/* Explorar criterios de elección (edición editorial, A02): consulta descriptiva. Sin datos de
   la persona, sin orden por compatibilidad ni etiquetas de aptitud; las celdas de la Tabla 1,
   literales y en el orden de la tabla. Una dirección antigua con criterios abre la consulta y
   no conserva los valores. */
import { expect, test } from "@playwright/test";

test.describe("Explorar criterios de elección", () => {
  // 0.70.0: «Elección del sistema», sin la repetición de las celdas de la Tabla 1.
  test("sin entradas de perfil ni veredictos; el apartado 6 y la Figura 2", async ({ page }) => {
    await page.goto("/#/sistemas/elegir");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Elección del sistema");
    const main = page.getByRole("main");
    await expect(main.locator("input, select, textarea")).toHaveCount(0);
    await expect(
      main.getByText(/dentro del criterio|fuera del criterio|Con autorización/),
    ).toHaveCount(0);
    await expect(main.getByRole("heading", { name: "Factores de la Figura 2" })).toBeVisible();
    // 0.72.2 (A02 revisada por el autor): por las características del dispositivo (Tabla 1),
    // sin datos de la persona ni puntuación; los cuatro en el orden de la tabla.
    // 0.96.0 (16.ª ronda, adjunto): el botón se llama como el destino de la portada (el Resumen).
    await expect(main.getByRole("link", { name: /Resumen de los cuatro sistemas/ })).toBeVisible();
    await main
      .getByRole("group", { name: "Formato" })
      .getByRole("button", { name: "Bomba con catéter" })
      .click();
    await main
      .getByRole("group", { name: "Sensores compatibles" })
      .getByRole("button", { name: "Dexcom G7" })
      .click();
    await main.getByRole("link", { name: /Comparar los 2/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\+camaps\/esencial$/);
  });

  test("una dirección antigua con criterios abre la consulta sin sus valores", async ({ page }) => {
    await page.goto("/#/sistemas/elegir/edad:10+dm2");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Elección del sistema");
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
    const guardado = await page.evaluate(() => JSON.stringify(localStorage));
    expect(guardado).not.toContain("edad:10");
  });

  test("se llega desde Sistemas", async ({ page }) => {
    await page.goto("/#/sistemas");
    await page.getByRole("link", { name: /^Elección del sistema/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
  });
});
