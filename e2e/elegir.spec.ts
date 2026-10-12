/* Explorar criterios de elección (edición editorial, A02): consulta descriptiva. Sin datos de
   la persona, sin orden por compatibilidad ni etiquetas de aptitud; las celdas de la Tabla 1,
   literales y en el orden de la tabla. Una dirección antigua con criterios abre la consulta y
   no conserva los valores. */
import { expect, test } from "@playwright/test";

test.describe("Explorar criterios de elección", () => {
  test("sin entradas de perfil ni veredictos; celdas literales en orden fijo", async ({ page }) => {
    await page.goto("/#/sistemas/elegir");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Explorar criterios de elección",
    );
    const main = page.getByRole("main");
    await expect(main.locator("input, select, textarea")).toHaveCount(0);
    await expect(
      main.getByText(/dentro del criterio|fuera del criterio|Con autorización/),
    ).toHaveCount(0);
    const indicacion = main.getByRole("region", { name: "Indicación", exact: true });
    const nombres = await indicacion.locator("dt").allTextContents();
    expect(nombres).toEqual(["MiniMed 780G", "Tandem Control-IQ", "myLoop CamAPS", "Omnipod 5"]);
    await expect(
      indicacion.getByText("Autorización en diabetes tipo 2 (≥ 18 años) por la FDA"),
    ).toBeVisible();
    await expect(
      main
        .getByRole("region", { name: "Localización del algoritmo" })
        .getByText(/En el pod; control mediante el controlador \(Europa\)/),
    ).toBeVisible();
    await expect(main.getByRole("link", { name: /^Tabla 1, pp\. 3-4/ })).toBeVisible();
  });

  test("una dirección antigua con criterios abre la consulta sin sus valores", async ({ page }) => {
    await page.goto("/#/sistemas/elegir/edad:10+dm2");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Explorar criterios de elección",
    );
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
    const guardado = await page.evaluate(() => JSON.stringify(localStorage));
    expect(guardado).not.toContain("edad:10");
  });

  test("se llega desde la portada y desde Sistemas", async ({ page }) => {
    await page.goto("/#/");
    await page
      .getByRole("main")
      .getByRole("link", { name: /Explorar criterios de elección|^Criterios/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
    await page.goto("/#/sistemas");
    await page.getByRole("link", { name: /^Explorar criterios de elección/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
  });
});
