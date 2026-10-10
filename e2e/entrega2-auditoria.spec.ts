/* Entrega 2 de la auditoría de la 0.31 (0.33.0): consulta breve. Resultados plegados cuando
   hay respuesta, un solo «También sobre» cuando añade, criterios sin recuento y con el
   formulario abierto, Iniciar por aspecto. */
import { expect, test } from "@playwright/test";

test.describe("Entrega 2 (0.33.0)", () => {
  test("con respuesta, todos los resultados van plegados; sin ella, abiertos", async ({ page }) => {
    await page.goto("/#/buscar/modo%20sue%C3%B1o");
    const todos = page.getByTestId("todos-los-resultados");
    await expect(todos).toBeVisible();
    await expect(todos).not.toHaveAttribute("open", "");
    await expect(page.getByText("Otros pasajes relacionados")).toHaveCount(0);
    await page.goto("/#/buscar/insulina%20basal%20programada%20sensor");
    await expect(page.getByTestId("todos-los-resultados")).toBeVisible();
  });

  test("dos temas: un solo «También sobre», el que añade", async ({ page }) => {
    await page.goto("/#/buscar/hipoglucemia%20nocturna%20y%20comidas%20grasas%20con%20780G");
    const tambien = page.getByRole("region", { name: /^También sobre/ });
    await expect(tambien).toHaveCount(1);
    await expect(tambien.first()).toContainText(/Hipoglucemia nocturna/);
  });

  test("Iniciar: un aspecto solo y «Ver la fase completa»", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    const indice = page.getByRole("navigation", { name: "En esta fase" });
    await expect(indice).toBeVisible();
    const chips = indice.getByRole("button");
    const n = await chips.count();
    expect(n).toBeGreaterThan(4);
    await chips.nth(2).click();
    await expect(chips.nth(2)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[id^="pieza-"]')).toHaveCount(1);
    await page.getByRole("button", { name: "Ver la fase completa" }).click();
    expect(await page.locator('[id^="pieza-"]').count()).toBeGreaterThan(3);
  });
});
