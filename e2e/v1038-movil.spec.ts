import { expect, test } from "@playwright/test";

/* 1.0.38 (revisión independiente de Fable sobre la 1.0.37), en el móvil (Pixel 5). */
test.describe("1.0.38 · móvil", () => {
  test("Figura 3: los cuatro planes, plegados en una línea; el algoritmo empieza antes", async ({
    page,
  }) => {
    await page.goto("/#/consultar/figura-3");
    const resumen = page.getByText("Plan de seguridad de cada sistema");
    await expect(resumen).toBeVisible();
    await expect(page.locator("main a[href='#/pacientes/plan/mm780']").first()).toBeHidden();
    await resumen.tap();
    await expect(page.locator("main a[href='#/pacientes/plan/mm780']").first()).toBeVisible();
  });

  test("Situaciones: todas las filas de la lista llevan su flecha", async ({ page }) => {
    await page.goto("/#/consultar/situacion");
    const filas = page.locator("#lista-situaciones .fila");
    await expect(page.locator("#lista-situaciones")).toBeVisible();
    const sinFlecha = await filas.evaluateAll(
      (xs) =>
        xs.filter((x) => {
          if ((x as HTMLElement).offsetParent === null) return false;
          const on =
            x.getAttribute("aria-pressed") === "true" || x.getAttribute("aria-current") === "true";
          return !on && getComputedStyle(x, "::after").content === "none";
        }).length,
    );
    expect(sinFlecha).toBe(0);
  });

  test("barra de abajo: el rótulo cabe en su celda a 320 px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/#/");
    const celdas = page.locator("nav[aria-label='Barra inferior'] li > *");
    await expect(celdas.first()).toBeVisible();
    const desbordan = await celdas.evaluateAll(
      (xs) => xs.filter((x) => x.scrollWidth > x.clientWidth + 1).length,
    );
    expect(desbordan).toBe(0);
  });
});
