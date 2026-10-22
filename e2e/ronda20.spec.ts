import { test, expect } from "@playwright/test";

/* 1.0.4 · vigésima ronda de auditorías (sobre la 1.0.3). */

test.describe("Ronda 20", () => {
  test("calculadora: la opción elegida, con borde burdeos (no la receta neutra de las fases)", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:control-iq");
    const elegida = page.locator('.formulario-calc .chip[aria-pressed="true"]').first();
    await expect(elegida).toBeVisible();
    const sombra = await elegida.evaluate((e) => getComputedStyle(e).boxShadow);
    expect(sombra).toContain("inset");
  });

  test("Elección → modos de los cuatro: la pantalla empieza arriba", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/#/sistemas/elegir");
    const enlace = page.getByRole("link", { name: /Ejercicio y modos temporales de los cuatro/ });
    await enlace.scrollIntoViewIfNeeded();
    await enlace.click();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/modos$/);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(100);
  });

  test("Buscar: al volver con una consulta, lo escrito la sustituye", async ({ page }) => {
    await page.goto("/#/buscar/alcohol%20omnipod");
    const q = page.locator("#buscar-q");
    await expect(q).toHaveValue("alcohol omnipod");
    await q.focus();
    await page.keyboard.type("modo sueño");
    await expect(q).toHaveValue("modo sueño");
  });

  test("Los cuatro en Parámetros: marcar dos lleva a su comparación en Parámetros", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/parametros");
    const grupo = page.locator(".barra-pegada").first();
    await grupo.getByRole("button", { name: /780G/, pressed: false }).first().click();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/parametros$/);
    await grupo
      .getByRole("button", { name: /Omnipod 5/, pressed: false })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/sistemas\/mm780\+op5\/parametros$/);
  });

  test("Iniciación, paso de parámetros: enlace a la calculadora del sistema", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:control-iq:parametros");
    await expect(
      page.locator('a[href="#/consultar/inicio/calculadora:control-iq"]', {
        hasText: "Cálculo de parámetros iniciales con los datos del paciente",
      }),
    ).toBeVisible();
  });

  test("hoja de Control-IQ: «Objetivo fijo no configurable» antes del rango", async ({ page }) => {
    await page.goto("/#/consultar/inicio/hoja:control-iq");
    const dd = page.locator(".hoja-inicio dd", { hasText: "no configurable" }).first();
    await expect(dd).toBeVisible();
    expect((await dd.innerText()).trim()).toMatch(/^Objetivo fijo no configurable/);
  });

  test("Gestación sin sistema: el aviso para elegir, encima del selector", async ({ page }) => {
    await page.goto("/#/consultar/situacion/gestacion");
    await expect(
      page.getByText("Elegir el sistema para ver lo propio de cada uno:").first(),
    ).toBeVisible();
  });

  test("ficha: la inicialización lleva a su fila de la Tabla 2, resaltada", async ({ page }) => {
    await page.goto("/#/sistemas/ciq/esencial");
    const enlace = page.locator('a[href="#/consultar/tablas/T2::1"]').first();
    await expect(enlace).toBeVisible();
    await enlace.click();
    await expect(
      page.locator(".fila-resaltada", { hasText: "Inicialización del modo automático" }).first(),
    ).toBeVisible();
  });
});
