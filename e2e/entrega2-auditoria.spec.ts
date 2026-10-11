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

  test("Iniciar: tareas desplegables y «Fase completa»", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    await expect(
      page.getByRole("button", { name: "Plan de respaldo antes de activar el automático" }),
    ).toBeVisible();
    await expect
      .poll(() => page.getByRole("button", { expanded: false }).count())
      .toBeGreaterThan(3);
    await page.getByRole("button", { name: "Basal, ratio y factor de sensibilidad" }).click();
    await expect(page).toHaveURL(/:parametros$/);
    await expect(page.getByText(/Regla del 450/)).toBeVisible();
    await page.getByRole("button", { name: "Fase completa" }).click();
    await expect.poll(() => page.getByRole("button", { expanded: true }).count()).toBe(5);
  });
});
