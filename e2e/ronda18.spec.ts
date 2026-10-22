import { test, expect } from "@playwright/test";

/* 1.0.0 · decimoctava ronda de auditorías (sobre la 0.99.0). */

test.describe("Ronda 18", () => {
  test("las comparaciones caben entre 768 y 1279 px, sin celdas cortadas", async ({ page }) => {
    for (const w of [768, 1024]) {
      await page.setViewportSize({ width: w, height: 900 });
      for (const r of [
        "sistemas/todos/ajuste",
        "sistemas/todos/modos",
        "sistemas/todos/esencial",
      ]) {
        await page.goto(`/#/${r}`);
        const caja = page.locator(".tabla-scroll").first();
        await expect(caja).toBeVisible();
        const m = await caja.evaluate((c) => ({
          sobra: c.scrollWidth - c.clientWidth,
          fuera: [...c.querySelectorAll("td, th")].filter((x) => x.scrollWidth > x.clientWidth + 1)
            .length,
        }));
        expect(m, `${r} a ${w}`).toEqual({ sobra: 0, fuera: 0 });
      }
    }
  });

  test("Buscar: «×» borra la consulta; «ducha» lleva al bloque de agua y desconexión", async ({
    page,
  }) => {
    await page.goto("/#/");
    await page.evaluate(() => (window.location.hash = "#/buscar"));
    const caja = page.locator("#buscar-q");
    await caja.fill("ducha");
    await expect(
      page.getByText("Agua, alcohol y desconexión de los cuatro (Sistemas AID)"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Borrar la búsqueda" }).click();
    await expect(caja).toHaveValue("");
    await expect(caja).toBeFocused();
  });

  test("Interrupción: «Si está programada» a un toque, con el foco en su título", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/interrupcion");
    await page.getByRole("button", { name: "Si está programada" }).click();
    const titulo = page.locator("#interrupcion-programada").getByRole("heading").first();
    await expect(titulo).toBeFocused();
    await expect(titulo).toBeInViewport();
  });

  test("Elección enlaza la gestación", async ({ page }) => {
    await page.goto("/#/sistemas/elegir");
    await page.getByRole("link", { name: "Gestación, parto y posparto" }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/gestacion$/);
  });

  test("Fases recoge la pauta previa y la basal ultralarga de la calculadora", async ({ page }) => {
    await page.goto("/#/");
    await page.evaluate(() => (window.location.hash = "#/consultar/inicio/calculadora:camaps"));
    await page.getByLabel("Insulina basal").fill("20");
    await page
      .getByLabel(/U-300|ultralarga/i)
      .first()
      .check();
    await page.evaluate(
      () => (window.location.hash = "#/consultar/inicio/inicio:camaps-fx:transicion"),
    );
    await expect(page.getByRole("button", { name: "Múltiples dosis (plumas)" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("button", { name: "Glargina U-300 o degludec" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("al volver desde una fila de tabla, la ficha vuelve a donde estaba", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/");
    await page.evaluate(() => (window.location.hash = "#/sistemas/ciq/esencial"));
    const enlace = page.locator('main a[href*="T1:control-iq:7"]:visible').first();
    // La posición desde la que se pulsa (Playwright desplaza el enlace a la vista antes).
    await enlace.scrollIntoViewIfNeeded();
    const y = await page.evaluate(() => window.scrollY);
    await enlace.click();
    await expect(page).toHaveURL(/tablas\/T1:control-iq:7/);
    await page.goBack();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(y);
    await expect(enlace).toBeFocused();
  });

  test("ficha impresa: cada cara dice el sistema", async ({ page }) => {
    await page.goto("/#/sistemas/camaps/completa");
    await expect(page.locator("style[data-cabecera-impresa]")).toHaveCount(1);
    expect(await page.locator("style[data-cabecera-impresa]").textContent()).toContain(
      "myLoop CamAPS FX · Ficha del sistema",
    );
  });
});
