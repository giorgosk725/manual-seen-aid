import { test, expect } from "@playwright/test";

/* 1.0.13 · vigesimoquinta ronda de auditorías (sobre la 1.0.12) y decisión del autor del
   23-10-2026 (Diabetes tipo 2 de Control-IQ, solo Control-IQ+). */

test.describe("Ronda 25 · regresiones de la 1.0.12", () => {
  test("adjunto: un sistema marcado no se cuela en «… de los cuatro» de la Elección", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/modos");
    await page.locator(".barra-pegada").getByRole("button", { name: /780G/ }).click();
    await page
      .getByRole("navigation", { name: "Sección" })
      .getByRole("link", { name: "Resumen" })
      .click();
    await page.goto("/#/sistemas/elegir");
    await page.getByRole("link", { name: /Agua, alcohol y desconexión de los cuatro/ }).click();
    await expect(page).toHaveURL(/modos:otras$/);
    await expect(page.locator("#otras-situaciones").locator("xpath=..")).toContainText("Omnipod 5");
  });

  test("R3: la ficha impresa de Omnipod 5 no imprime frases de otros sistemas", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/op5/completa");
    await page.emulateMedia({ media: "print" });
    const ficha = page.locator(".imprimible.ficha-sistema");
    await expect(ficha).toBeVisible();
    await expect(ficha).not.toContainText("MiniMed 780G dispone");
  });
});

test.describe("Ronda 25 · situaciones e iniciación", () => {
  test("R1 y adjunto: sin sistema en la dirección, los cuatro; «Otra situación», a la lista", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:camaps");
    await page.goto("/#/consultar/situacion/gestacion");
    await expect(page.getByText("Gestación: autorización y evidencia").first()).toBeVisible();
    await expect(
      page.locator('section[aria-label="Sistema a sistema"] [aria-checked="true"]'),
    ).toHaveCount(0);
    await page.goto("/#/visual/hipoglucemia");
    await expect(page.getByRole("link", { name: /Otra situación/ })).toHaveAttribute(
      "href",
      "#/consultar/situacion",
    );
  });

  test("senior: el selector de Situaciones, sin recortes a 1024 px", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/#/consultar/situacion/gestacion:camaps");
    const botones = page.locator('section[aria-label="Sistema a sistema"] [role="radio"]');
    await expect(botones).toHaveCount(4);
    for (const b of await botones.all()) {
      expect(await b.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    }
  });

  test("R5: la hoja del cambio de sistema imprime lo trasladado y «Revisar antes»", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:control-iq");
    await page.getByRole("button", { name: "Otro sistema AID" }).click();
    await page
      .getByRole("radiogroup", { name: "Sistema actual" })
      .getByRole("radio", { name: /780G/ })
      .click();
    await page.getByRole("button", { name: /Sí: se traslada tal cual/ }).click();
    await page.getByLabel("DTD", { exact: false }).first().fill("40");
    await page.getByLabel("Peso", { exact: true }).fill("70");
    await page.goto("/#/consultar/inicio/hoja:control-iq");
    const hoja = page.locator(".hoja-inicio");
    await expect(hoja).toContainText("La del sistema actual");
    await expect(hoja).toContainText("Revisar antes de trasladar: en MiniMed 780G");
  });

  test("R5 y R3: en el móvil, los pasos con su título", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    await expect(page.getByRole("list", { name: "Ir al paso" })).toContainText("Activación");
    await page.goto("/#/consultar/descarga/2");
    await page.getByRole("combobox", { name: "Ir al paso" }).selectOption("5");
    await expect(page).toHaveURL(/descarga\/5$/);
  });
});

test.describe("Ronda 25 · buscar, ficha y nombres", () => {
  test("R1: «modo sueño control iq» abre la situación de ese sistema", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("modo sueño control iq");
    await page.keyboard.press("Enter");
    await expect(
      page.locator('a[href="#/consultar/situacion/sueno:control-iq"]').first(),
    ).toBeVisible();
  });

  test("visual: los valores de la ficha en la misma columna en todas las pestañas", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const x = async (sec: string) => {
      await page.goto(`/#/sistemas/ciq/${sec}`);
      const dd = page.locator("main dl dd").filter({ visible: true }).first();
      await expect(dd).toBeVisible();
      return dd.evaluate((e) => Math.round(e.getBoundingClientRect().left));
    };
    expect(await x("funciona")).toBe(await x("parametros"));
  });

  test("autor: Diabetes tipo 2 de Control-IQ, solo Control-IQ+; «Volver» con el nombre de la app", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/ciq/esencial");
    await expect(
      page.getByText("Control-IQ+: autorizado (FDA y marcado CE)").first(),
    ).toBeVisible();
    await expect(page.getByText("no consta en el capítulo")).toHaveCount(0);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#/sistemas/ciq/completa");
    await page.locator('main a[href^="#/capitulo/"]').first().click();
    await expect(page.locator(".volver-pegado")).toContainText("Control-IQ / Control-IQ+");
  });
});
