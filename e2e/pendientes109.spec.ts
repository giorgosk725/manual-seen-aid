import { test, expect } from "@playwright/test";

/* 1.0.10 · los dos pendientes de la 1.0.9: Iniciación en «datos, resultado y opciones» y las
   cifras repetidas de la gestación. */

test.describe("Pendientes de la 1.0.9", () => {
  test("gestación: sin las franjas que repite el texto; el hospital las conserva", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/gestacion:control-iq");
    await expect(page.locator("main")).toContainText(/TIRp\s?63–140\s?mg\/dl/);
    await expect(page.getByRole("region", { name: "Objetivos de MCG" })).toHaveCount(0);
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:omnipod-5");
    await expect(page.getByRole("region", { name: "Objetivos de MCG" })).toHaveCount(1);
  });

  test("calculadora en el móvil: el resultado justo tras los datos y las opciones debajo", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    await page.getByLabel("Insulina basal", { exact: true }).fill("20");
    await page.getByLabel("Insulina rápida", { exact: true }).fill("20");
    await page.getByLabel("Peso", { exact: true }).fill("70");
    const y = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
    const resultado = await y("#calc-paso-4");
    const opciones = await y("#calc-opciones-titulo");
    expect(resultado).toBeLessThan(opciones);
    expect(resultado).toBeLessThan(1200);
    await expect(
      page.getByText(/Opciones aplicadas: buen control previo · reducción del 10 %/),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cambiar opciones" }).click();
    await expect(page.locator("#calc-opciones-titulo")).toBeFocused();
  });

  test("calculadora en el ordenador: datos y opciones a la izquierda, resultado a la derecha", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    const x = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((e) => e.getBoundingClientRect().left);
    expect(await x("#calc-opciones-titulo")).toBeLessThan(await x("#calc-paso-4"));
  });

  test("Fases en el ordenador: los pasos, como pestañas (sin caja)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#/consultar/inicio/inicio:control-iq");
    const activo = page.getByRole("list", { name: "Pasos de la fase" }).locator("[aria-current]");
    await expect(activo).toBeVisible();
    expect(await activo.evaluate((e) => getComputedStyle(e).borderTopColor)).toBe(
      "rgba(0, 0, 0, 0)",
    );
  });
});
