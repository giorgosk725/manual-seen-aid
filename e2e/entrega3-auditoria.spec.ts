/* Entrega 3 de la auditoría de la 0.31 (0.34.0): recientes con contexto, «Los cuatro»
   explícito, grupos de preguntas sin solape, expresiones. */
import { expect, test } from "@playwright/test";

test.describe("Entrega 3 (0.34.0)", () => {
  test("Sistemas: «Los cuatro» marcado cuando no hay selección", async ({ page }) => {
    await page.goto("/#/sistemas/todos/parametros");
    const grupo = page.getByRole("group", { name: "Sistemas" });
    await expect(grupo.getByRole("button", { name: "Los cuatro" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await grupo.getByRole("button", { name: /Omnipod 5/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/op5\/parametros$/);
    await expect(grupo.getByRole("button", { name: "Los cuatro" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await grupo.getByRole("button", { name: "Los cuatro" }).click();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/parametros$/);
  });

  test("una fila de situación se abre con «Ver esta situación»; las preguntas no repiten grupo", async ({
    page,
  }) => {
    await page.goto("/#/buscar/modo%20sue%C3%B1o");
    await expect(page.getByRole("link", { name: /^Ver esta situación/ }).first()).toBeVisible();
    await page.goto("/#/preguntas");
    await expect(page.getByText("Descarga e incidencias")).toHaveCount(0);
  });
});
