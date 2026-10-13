/* La calculadora de inicio (13-10-2026): las reglas de la Tabla 2 sobre lo escrito. */
import { expect, test } from "@playwright/test";

test.describe("Calculadora de parámetros iniciales", () => {
  test("es lo primero de Iniciar un sistema y calcula con las reglas del capítulo", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio");
    await expect(page.getByRole("button", { name: "Calculadora" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page
      .getByRole("group", { name: "Sistema" })
      .getByRole("button", { name: "Control-IQ" })
      .click();
    await expect(page).toHaveURL(/calculadora:control-iq$/);
    await page.getByLabel("Insulina basal").fill("22");
    await page.getByLabel("Insulina rápida").fill("20");
    // 42 UI − 10 % = 37,8; basal 45 % / 24 h = 0,71; 450/37,8 = 11,9; 1700/37,8 = 45.
    await expect(page.getByText("37,8", { exact: true })).toBeVisible();
    await expect(page.getByText("0,71", { exact: true })).toBeVisible();
    await expect(page.getByText("11,9", { exact: true })).toBeVisible();
    await expect(page.getByText("45", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Qué programar en Control-IQ/ })).toBeVisible();
    // Con la regla del 1800, el factor cambia.
    await page.getByRole("button", { name: "Regla del 1800" }).click();
    await expect(page.getByText("48", { exact: true })).toBeVisible();
    // Fuera de indicación: aviso con la celda de la Tabla 1.
    await page.getByLabel("Insulina basal").fill("4");
    await page.getByLabel("Insulina rápida").fill("4");
    await expect(
      page.getByRole("note").filter({ hasText: "fuera de la indicación de Control-IQ" }),
    ).toBeVisible();
  });

  test("desde bomba: si funcionaba, se traslada; si no, 450 y 1700 sobre la DTD", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
    await page.getByRole("button", { name: /Bomba de insulina/ }).click();
    await expect(page.getByText(/puede trasladarse tal cual/)).toBeVisible();
    await page.getByRole("button", { name: "No, o no hay referencia" }).click();
    await page.getByLabel("DTD actual").fill("40");
    await expect(page.getByText("11,3", { exact: true })).toBeVisible();
    await expect(page.getByText("43", { exact: true })).toBeVisible();
  });

  test("las fases siguen a un toque", async ({ page }) => {
    await page.goto("/#/consultar/inicio");
    await page.getByRole("button", { name: "Fases" }).click();
    await expect(page).toHaveURL(/inicio\/preparacion/);
    await expect(page.getByRole("list", { name: "Fases" })).toBeVisible();
  });
});
