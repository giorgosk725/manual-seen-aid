import { expect, test } from "@playwright/test";

/* 1.0.34 en el móvil (menores de la revisión de Fable de la 1.0.32). */
test.describe("1.0.34 · remates en el móvil", () => {
  test("a 320 px, «Cambiar» va en la línea de los accesos de la ficha", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/#/sistemas/ciq/indicacion");
    const cambiar = page.getByRole("button", { name: "Cambiar de sistema o comparar" });
    await expect(cambiar).toBeVisible();
    const tops = await cambiar.evaluate((b) =>
      [...b.parentElement!.children]
        .filter((c) => (c as HTMLElement).offsetParent)
        .map((c) => c.getBoundingClientRect().top + c.getBoundingClientRect().height / 2),
    );
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(6);
  });

  test("desde la autoevaluación, «Volver a la consulta» en una sola línea", async ({ page }) => {
    await page.goto("/#/test");
    await page.locator("main ol > li.tarjeta").nth(0).getByRole("button").first().click();
    await page.locator("main a.pagina-badge").first().click();
    const volver = page.getByRole("button", { name: /Volver a la consulta/ });
    await expect(volver).toBeVisible();
    const alto = await volver.evaluate((b) => b.getBoundingClientRect().height);
    expect(alto).toBeLessThanOrEqual(46);
  });

  test("los enlaces «Plan de respaldo» y «Qué hace cada parámetro» tienen 44 px de toque", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
    for (const nombre of [/^Plan de respaldo$/, /^Qué hace cada parámetro/]) {
      const enlace = page.getByRole("link", { name: nombre }).first();
      await expect(enlace).toBeAttached();
      const alto = await enlace.evaluate(
        (a) =>
          parseFloat(getComputedStyle(a, "::after").height) || a.getBoundingClientRect().height,
      );
      expect(alto).toBeGreaterThanOrEqual(44);
    }
  });
});
