import { test, expect } from "@playwright/test";

/* 1.0.9 · vigesimosegunda ronda de auditorías, revisión externa de la 1.0.8 y decisiones del
   autor del 22-10-2026. */

test.describe("Ronda 22 · selector, campos y buscador", () => {
  test("D108-01: el selector de un sistema se maneja con las flechas y Tab entra una vez", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    const grupo = page.getByRole("radiogroup").first();
    const camaps = grupo.getByRole("radio", { name: /CamAPS/ });
    await expect(camaps).toHaveAttribute("aria-checked", "true");
    await expect(grupo.locator('[role="radio"][tabindex="0"]')).toHaveCount(1);
    await camaps.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/calculadora:omnipod-5/);
    await expect(grupo.getByRole("radio", { name: /Omnipod 5/ })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/calculadora:minimed-780g/);
  });

  test("D108-02: unidad y ayuda unidas a cada campo de la calculadora", async ({ page }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    const basal = page.getByLabel("Insulina basal", { exact: true });
    await expect(basal).toHaveAccessibleDescription(/UI\/día/);
    const rapida = page.getByLabel("Insulina rápida", { exact: true });
    await expect(rapida).toHaveAccessibleDescription(/UI\/día.*Total diario/);
    await expect(page.getByLabel("Peso", { exact: true })).toHaveAccessibleDescription(/kg/);
  });

  test("D108-03: «agua 780g» y «alcohol omnipod», con el dato y su nota bajo el acceso", async ({
    page,
  }) => {
    for (const [q, dato] of [
      ["agua 780g", "Puede ser necesario retirar temporalmente la bomba"],
      ["alcohol omnipod", "prudencia con los bolos prandiales"],
    ]) {
      await page.goto("/#/buscar");
      await page.locator("#buscar-q").fill(q);
      await page.keyboard.press("Enter");
      await expect(page.getByRole("list", { name: "Abrir" }).first()).toContainText(dato);
    }
  });

  test("buscar: dos líneas de una casilla, separadas", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("modo sueño control iq");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/configurable · Objetivo: 112,5/).first()).toBeVisible();
  });
});

test.describe("Ronda 22 · situaciones y comparación", () => {
  test("R1: «‹ Otra situación» en las tres conductas urgentes, con el sistema", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/situacion/rm:control-iq");
    await expect(page.getByRole("link", { name: /Otra situación/ })).toBeVisible();
    for (const ruta of [
      "/#/consultar/figura-3",
      "/#/visual/hipoglucemia",
      "/#/consultar/interrupcion",
    ]) {
      await page.evaluate((r) => (window.location.hash = r.slice(1)), ruta);
      await expect(page.getByRole("link", { name: /Otra situación/ })).toHaveAttribute(
        "href",
        "#/consultar/situacion/:control-iq",
      );
    }
  });

  test("R1: Interrupción va a «Según el formato»; Figura 3 repite hoja y plan al pie", async ({
    page,
  }) => {
    await page.goto("/#/consultar/interrupcion");
    await page.getByRole("button", { name: "Según el formato" }).click();
    await expect(page.locator("#interrupcion-formato")).toBeInViewport();
    await page.goto("/#/consultar/figura-3");
    await expect(page.getByRole("link", { name: "Hoja para el paciente: cetonas" })).toHaveCount(2);
  });

  test("móvil: «Los cuatro» de Parámetros, plegado; la vista y la Tabla 3 en la ruta", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/sistemas/todos/parametros");
    await expect(page.getByRole("button", { name: /Elegir sistemas/ })).toBeVisible();
    const h = await page
      .getByRole("heading", { name: "Objetivo glucémico" })
      .first()
      .evaluate((e) => e.getBoundingClientRect().top);
    // Antes, desplegado, en y ≈ 513 (22.ª ronda, visual).
    expect(h).toBeLessThan(480);
    await page.getByRole("button", { name: "Por sistema" }).click();
    await expect(page).toHaveURL(/parametros:por-sistema$/);
    await page.locator('main a[href="#/sistemas/op5/parametros"]').first().click();
    await page.goBack();
    await expect(page.getByRole("button", { name: "Por sistema" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("autor: la Tabla 3 en su pestaña «Ajuste práctico»; Resumen con la localización", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/ajuste");
    await expect(page.locator("#tabla-3-comparada .tabla-capitulo")).toBeVisible();
    await page.goto("/#/sistemas/todos/parametros");
    await expect(page.locator(".tabla-capitulo")).toHaveCount(0);
    await page.goto("/#/sistemas");
    await expect(page.getByText("Localización del algoritmo").first()).toBeVisible();
    await expect(page.getByText("Funciona en")).toHaveCount(0);
  });

  test("adjunto: el alcohol de «Los cuatro», con lo común una vez", async ({ page }) => {
    await page.goto("/#/sistemas/todos/modos:otras");
    const bloque = page.locator("#otras-situaciones").locator("xpath=..");
    await expect(
      bloque.getByText("Anticipar hipoglucemia diferida hasta 12–24 h tras la ingesta", {
        exact: true,
      }),
    ).toHaveCount(1);
  });
});

test.describe("Ronda 22 · plan, iniciación y papel", () => {
  test("autor: el plan dice solo «set» o solo «pod» según el sistema", async ({ page }) => {
    await page.goto("/#/pacientes/plan/op5");
    const hoja = page.locator(".hoja-cuerpo").first();
    await expect(hoja).toContainText("cambiar el pod");
    await expect(hoja).not.toContainText("set/pod");
    await expect(hoja).not.toContainText("set o el pod");
    await page.goto("/#/pacientes/plan/mm780");
    await expect(page.locator(".hoja-cuerpo").first()).toContainText("cambiar el set");
  });

  test("autor: de 780G a Control-IQ «tal cual», revisar antes la basal y el factor", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:control-iq");
    await page.getByRole("button", { name: "Otro sistema AID" }).click();
    await page
      .getByRole("radiogroup", { name: "Sistema actual" })
      .getByRole("radio", { name: /780G/ })
      .click();
    await page.getByRole("button", { name: /Sí: se traslada tal cual/ }).click();
    await expect(
      page.getByText("Revisar antes de trasladar: en MiniMed 780G no actúa en automático").first(),
    ).toBeVisible();
  });

  test("R3: f104 sin «[…]»; Omnipod 5 en papel sin una cara con solo el colofón", async ({
    page,
  }) => {
    await page.goto("/#/preguntas/f104");
    await expect(page.locator("main")).not.toContainText("[…]");
    await page.goto("/#/sistemas/op5/completa");
    await expect(page.getByRole("heading", { name: /Modos y funciones/ }).first()).toBeVisible();
    await page.evaluate(() => document.documentElement.classList.add("imprimiendo"));
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => {
      document.body.getBoundingClientRect();
      await document.fonts.ready;
    });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    expect((pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length).toBe(3);
  });

  test("R3: Atrás desde un enlace del lateral devuelve el foco a ese enlace", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/");
    const enlace = page.getByRole("navigation").getByRole("link", { name: "Sistemas AID" }).first();
    await enlace.click();
    await expect(page).toHaveURL(/#\/sistemas$/);
    await page.goBack();
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Sistemas AID" }).first(),
    ).toBeFocused();
  });
});
