import { expect, test } from "@playwright/test";

/* 1.0.29 en el móvil: tablas con tema en la tira (T06) y salto a un aspecto en las fichas (T05). */
test.describe("1.0.29 · tablas en el móvil", () => {
  test("T06: cada pestaña dice su número y su tema", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T1");
    const tira = page.getByRole("navigation", { name: "Otra tabla" });
    await expect(tira.getByRole("link", { name: "Tabla 4 · Situaciones" })).toBeAttached();
    await expect(tira.getByRole("link", { name: "Tabla 1 · Sistemas" })).toContainText(
      "1 · Sistemas",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      await page.evaluate(() => window.innerWidth),
    );
  });

  test("T05: el salto lleva a la ficha de la fila, con un sistema y con los cuatro", async ({
    page,
  }) => {
    for (const ruta of ["/#/consultar/tablas/T3", "/#/consultar/tablas/T3:control-iq"]) {
      await page.goto(ruta);
      await expect(page.locator('[data-fila="0"]:visible')).toBeVisible();
      await page.getByLabel("Ir a un aspecto").selectOption({ index: 4 });
      const destino = page.locator('[data-fila="3"]:visible');
      await expect(destino).toBeFocused();
      await expect(destino).toBeInViewport();
    }
  });
});
