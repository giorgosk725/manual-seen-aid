import { test, expect } from "@playwright/test";

/* 1.0.15 · vigesimosexta ronda de auditorías (sobre la 1.0.14). */

test.describe("Ronda 26", () => {
  test("R1: «modo sueño control iq» trae la casilla en la tarjeta Abrir", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("modo sueño control iq");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("list", { name: "Abrir" }).first()).toContainText("112,5");
  });

  test("R1: «Los cuatro» también en la resonancia", async ({ page }) => {
    await page.goto("/#/consultar/situacion/rm:control-iq");
    await page.getByRole("button", { name: "Los cuatro", exact: true }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/rm$/);
  });

  test("R5: «HbA1c» con mayúscula en las opciones aplicadas", async ({ page }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    await page.getByLabel("Insulina basal", { exact: true }).fill("20");
    await page.getByLabel("Insulina rápida", { exact: true }).fill("20");
    await page.getByLabel("Peso", { exact: true }).fill("70");
    await page
      .getByRole("button", { name: /Control deficiente/ })
      .first()
      .click();
    await expect(page.locator("p", { hasText: "Opciones aplicadas:" }).first()).toContainText(
      "HbA1c",
    );
  });

  test("R3: al pie de las preguntas de 780G, la hipoglucemia nocturna", async ({ page }) => {
    await page.goto("/#/sistemas/mm780/preguntas");
    await expect(
      page.locator('main a[href^="#/sistemas/mm780/modos:hipoglucemia-nocturna"]').first(),
    ).toBeVisible();
  });

  test("visual: la barra de resumen se oculta tras «Ir a › Programación»", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    await page.getByLabel("Insulina basal", { exact: true }).fill("20");
    await page.getByLabel("Insulina rápida", { exact: true }).fill("20");
    await page.getByLabel("Peso", { exact: true }).fill("70");
    await page.getByLabel("Peso", { exact: true }).blur();
    await page
      .getByRole("navigation", { name: "Pasos de la calculadora" })
      .getByRole("button", { name: "Programación" })
      .click();
    await expect(page.locator(".resumen-calc")).toHaveCount(0);
  });
});
