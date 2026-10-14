/* Explorar criterios de elección (edición editorial, A02): consulta descriptiva. Sin datos de
   la persona, sin orden por compatibilidad ni etiquetas de aptitud; las celdas de la Tabla 1,
   literales y en el orden de la tabla. Una dirección antigua con criterios abre la consulta y
   no conserva los valores. */
import { expect, test } from "@playwright/test";

test.describe("Explorar criterios de elección", () => {
  // 0.70.0: «Cómo elegir un sistema», sin la repetición de las celdas de la Tabla 1.
  test("sin entradas de perfil ni veredictos; el apartado 6 y la Figura 2", async ({ page }) => {
    await page.goto("/#/sistemas/elegir");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Cómo elegir un sistema");
    const main = page.getByRole("main");
    await expect(main.locator("input, select, textarea")).toHaveCount(0);
    await expect(
      main.getByText(/dentro del criterio|fuera del criterio|Con autorización/),
    ).toHaveCount(0);
    await expect(main.getByRole("heading", { name: "Factores de la Figura 2" })).toBeVisible();
    // 0.72.0: con dos marcados, se comparan esos (sin datos de la persona: solo sistemas).
    await expect(main.getByRole("link", { name: /Comparar los cuatro/ })).toBeVisible();
    const grupo = main.getByRole("group", { name: "Sistemas que se valoran" });
    await grupo.getByRole("button").nth(0).click();
    await grupo.getByRole("button").nth(3).click();
    await main.getByRole("link", { name: /Comparar los 2/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/mm780\+op5\/esencial$/);
  });

  test("una dirección antigua con criterios abre la consulta sin sus valores", async ({ page }) => {
    await page.goto("/#/sistemas/elegir/edad:10+dm2");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Cómo elegir un sistema");
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
    const guardado = await page.evaluate(() => JSON.stringify(localStorage));
    expect(guardado).not.toContain("edad:10");
  });

  test("se llega desde Sistemas", async ({ page }) => {
    await page.goto("/#/sistemas");
    await page.getByRole("link", { name: /^Cómo elegir un sistema/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
  });
});
