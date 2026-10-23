import { test, expect } from "@playwright/test";

/* 1.0.12 · vigesimocuarta ronda de auditorías (sobre la 1.0.11) y decisiones del autor del
   23-10-2026. */

const casilla = (page: import("@playwright/test").Page, nombre: RegExp) =>
  page.locator(".barra-pegada").getByRole("button", { name: nombre });

test.describe("Ronda 24 · comparación y elección", () => {
  test("R3 y senior: uno marcado en «Los cuatro» filtra la sección y se lleva a otra pestaña", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/parametros:factor");
    await casilla(page, /780G/).click();
    await expect(page).toHaveURL(/todos\/parametros:factor$/);
    // Solo MiniMed 780G en «Por parámetro».
    const vista = page.locator("main");
    await expect(vista.getByRole("link", { name: /MiniMed 780G/ }).first()).toBeVisible();
    await expect(vista.locator('a[href^="#/sistemas/op5/parametros:"]')).toHaveCount(0);
    // «Ajuste práctico» sigue en la comparación (antes, a la ficha), con una sola columna.
    await page
      .getByRole("navigation", { name: "Sección" })
      .getByRole("link", { name: /Ajuste/ })
      .click();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/ajuste$/);
    await expect(page.locator("#tabla-3-comparada thead th")).toHaveCount(2);
  });

  test("R3: al marcar dos se conserva el parámetro y la vista", async ({ page }) => {
    await page.goto("/#/sistemas/todos/parametros:factor");
    await casilla(page, /780G/).click();
    await casilla(page, /CamAPS/).click();
    await expect(page).toHaveURL(/#\/sistemas\/mm780\+camaps\/parametros:factor$/);
    await page.goto("/#/sistemas/mm780+camaps/parametros:por-sistema");
    await casilla(page, /Omnipod/).click();
    await expect(page).toHaveURL(/#\/sistemas\/mm780\+camaps\+op5\/parametros:por-sistema$/);
  });

  test("adjunto: la Elección recuerda lo marcado al volver con Atrás", async ({ page }) => {
    await page.goto("/#/sistemas/elegir");
    await page.getByRole("button", { name: "Dexcom G7" }).first().click();
    await expect(page.getByRole("button", { name: "Quitar lo marcado" })).toBeVisible();
    await page.getByRole("link", { name: "Gestación, parto y posparto" }).first().click();
    await page.goBack();
    await expect(page.getByRole("button", { name: "Dexcom G7" }).first()).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("Ronda 24 · situaciones", () => {
  test("senior: «Los cuatro» en la gestación vuelve a la comparación de los cuatro", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/gestacion:control-iq");
    await page.getByRole("button", { name: "Los cuatro", exact: true }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/gestacion$/);
    await expect(page.getByText("Gestación: autorización y evidencia").first()).toBeVisible();
  });

  test("adjunto: agua, alcohol y desconexión desde Situaciones; el filtro no falla", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion");
    const filtro = page.locator("main input").first();
    for (const q of ["agua", "alcohol", "natación"]) {
      await filtro.fill(q);
      await expect(
        page
          .locator("#lista-situaciones")
          .getByRole("link", { name: /Agua, alcohol y desconexión/ })
          .first(),
      ).toBeVisible();
    }
    await expect(page.getByText("Algo ha fallado")).toHaveCount(0);
    await page.goto("/#/consultar/situacion/:control-iq");
    await expect(
      page.locator('#lista-situaciones a[href="#/sistemas/control-iq/modos:agua"]').first(),
    ).toBeAttached();
  });

  test("adjunto y autor: gestación sin repeticiones con Control-IQ; 780G sin «asimismo»", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/gestacion:control-iq");
    const sistema = page.locator('section[aria-label="Sistema a sistema"]');
    await expect(sistema.getByText("Objetivo fijo no configurable")).toHaveCount(0);
    // Visibles (DosColumnas pinta también la copia de una columna, oculta).
    await expect(sistema.getByText(/No confundir/).filter({ visible: true })).toHaveCount(1);
    await expect(sistema.getByText("Rango: 112,5–160 mg/dl")).toHaveCount(0);
    await page.goto("/#/consultar/situacion/gestacion:minimed-780g");
    await expect(page.getByText(/MiniMed 780G dispone de marcado CE/).first()).toBeVisible();
    await expect(page.getByText(/dispone asimismo/)).toHaveCount(0);
  });
});

test.describe("Ronda 24 · ficha, capítulo y portada", () => {
  test("senior: la ficha impresa de CamAPS FX lleva los objetivos de la gestación", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/camaps/preguntas");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".imprimible")).toContainText("trimestre");
  });

  test("adjunto: «Volver a la consulta» en su franja, sin tapar el destino", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#/sistemas/ciq/completa");
    await page.locator('main a[href^="#/capitulo/"]').first().click();
    const franja = page.locator(".volver-pegado");
    await expect(franja).toBeVisible();
    await expect
      .poll(() => franja.evaluate((e) => getComputedStyle(e).backgroundColor))
      .not.toBe("rgba(0, 0, 0, 0)");
    const destino = page.locator(".bloque-destino").first();
    await expect(destino).toBeVisible();
    const abajo = await franja.evaluate((e) => e.getBoundingClientRect().bottom);
    const arriba = await destino.evaluate((e) => e.getBoundingClientRect().top);
    expect(arriba).toBeGreaterThanOrEqual(abajo);
  });

  test("adjunto: los títulos de Anterior y Siguiente, enteros", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/capitulo/04-sistemas");
    const titulos = page.locator('nav[aria-label="Apartado anterior y siguiente"] a span span');
    await expect(titulos.first()).toBeVisible();
    for (const t of await titulos.all()) {
      const cortado = await t.evaluate((e) => e.scrollWidth > e.clientWidth + 1);
      expect(cortado).toBe(false);
    }
  });

  test("senior y visual: en la tableta, «Cálculo inicial» en una línea", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/#/");
    const calc = page.locator('main a[aria-label^="Cálculo de parámetros iniciales"]').first();
    await expect(calc).toBeVisible();
    expect(await calc.evaluate((e) => e.getBoundingClientRect().height)).toBeLessThan(44);
  });
});
