import { test, expect } from "@playwright/test";

/* 0.96.1 · revisión de Codex sobre la 0.96.0 (entrega A): regresiones de primer dato, cambio de
   anchura con la pantalla montada, rutas inválidas y filtrado de Iniciación por sistema. */

test.describe("V95-01 · «Nuevo inicio», al primer dato", () => {
  test("aparece al escribir el primer dato, sin visitar antes una fuente, y vacía", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    const nuevo = page.getByRole("button", { name: /Nuevo inicio/ });
    await expect(page.getByLabel("Insulina basal")).toBeVisible();
    await expect(nuevo).toHaveCount(0);
    await page.getByLabel("Insulina basal").fill("20");
    await expect(nuevo).toBeVisible();
    await nuevo.click();
    await expect(page.getByLabel("Insulina basal")).toHaveValue("");
    await expect(nuevo).toHaveCount(0);
  });
});

test.describe("V95-03 · selector de sistemas al cambiar de anchura", () => {
  for (const ruta of ["sistemas/ciq", "sistemas/mm780+op5/parametros"])
    test(`${ruta}: 393 → 768 → 1440 → 393 sin recargar`, async ({ page }) => {
      await page.setViewportSize({ width: 393, height: 852 });
      await page.goto(`/#/${ruta}`);
      const url = page.url();
      const visibles = () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll(".barra-pegada button")].filter(
              (b) => b.getBoundingClientRect().width > 0,
            ).length,
        );
      // En el móvil, la ficha de un sistema empieza con el selector plegado (decisión previa).
      await expect(page.locator(".barra-pegada")).toBeVisible();
      for (const w of [768, 1440, 393]) {
        await page.setViewportSize({ width: w, height: 852 });
        await expect.poll(visibles, `${w} px`).toBeGreaterThanOrEqual(4);
        expect(page.url()).toBe(url);
      }
    });
});

test.describe("V95-04 · rutas inválidas de la descarga", () => {
  test("decimal, texto, cero, negativo o fuera de rango: el paso 1, sin fallo", async ({
    page,
  }) => {
    await page.goto("/#/consultar/descarga/1");
    const titulo = page.locator("#paso-descarga h2");
    const primero = (await titulo.textContent())?.trim();
    expect(primero).toBeTruthy();
    for (const paso of ["4.5", "x", "0", "-2", "12", "1e1"]) {
      await page.goto(`/#/consultar/descarga/${paso}`);
      await expect(titulo, paso).toHaveText(primero!);
      await expect(page.getByText("Algo ha fallado en esta pantalla.")).toHaveCount(0);
    }
    await page.goto("/#/consultar/descarga/8");
    await expect(titulo).not.toHaveText(primero!);
  });
});

test.describe("N96-02 · Iniciación: lo de otro sistema, fuera", () => {
  const camaps = /Con CamAPS FX, el objetivo del algoritmo puede reducirse/;
  test("la frase de CamAPS FX, con CamAPS FX y sin sistema; con Omnipod 5, no", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/inicio:camaps-fx:objetivos");
    await expect(page.locator("main").getByText(camaps)).toBeVisible();
    await page.goto("/#/consultar/inicio/inicio::objetivos");
    await expect(page.locator("main").getByText(camaps)).toBeVisible();
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:objetivos");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main").getByText(camaps)).toHaveCount(0);
  });
});

test.describe("V95-05/06 · contexto y foco", () => {
  test("en Interrupción, el lateral marca Situaciones como contexto", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [ruta, valor] of [
      ["consultar/interrupcion", "location"],
      ["consultar/figura-3", "location"],
      ["visual/hipoglucemia", "location"],
      ["consultar/situacion", "page"],
    ]) {
      await page.goto(`/#/${ruta}`);
      await expect(
        page.locator("aside").getByRole("link", { name: "Situaciones", exact: true }),
        ruta,
      ).toHaveAttribute("aria-current", valor);
    }
  });
  test("en el móvil, ir a Sistemas desde la barra lleva el foco al título", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/consultar/interrupcion");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("link", { name: "Sistemas" })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Sistemas AID" })).toBeFocused();
  });
  test("al abrir la app, el primer Tab sigue ofreciendo saltar al contenido", async ({ page }) => {
    await page.goto("/#/sistemas");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Saltar al contenido" })).toBeFocused();
  });
});

test.describe("Entrega C · recorridos móviles", () => {
  test.beforeEach(({ page }) => page.setViewportSize({ width: 393, height: 852 }));
  test("V95-07: Parámetros por parámetro, enlazable, con la tabla y por sistema a mano", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/parametros");
    const grupo = page.getByRole("group", { name: "Parámetro que se compara" });
    await expect(grupo.getByRole("button", { name: "Objetivo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await grupo.getByRole("button", { name: "Basal" }).click();
    await expect(page).toHaveURL(/parametros:basal$/);
    await expect(page.getByRole("heading", { name: "Tasa basal programada" })).toBeVisible();
    // Los cuatro sistemas, identificados, con su enlace a la fila de la ficha.
    for (const n of ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"])
      await expect(
        page
          .locator("main")
          .getByRole("link", { name: new RegExp(n) })
          .first(),
      ).toBeVisible();
    await expect(
      page.locator("main a[href='#/sistemas/ciq/parametros:tasa-basal-programada']"),
    ).toHaveCount(1);
    // Por sistema: las tarjetas de siempre.
    await page.getByRole("button", { name: "Por sistema" }).click();
    await expect(page.getByText("Actúan en automático").first()).toBeVisible();
    await page.getByRole("button", { name: "Tabla 3 completa" }).click();
    await expect(page.locator("#tabla-3-comparada")).toBeInViewport();
  });
  test("V95-08: la calculadora lleva a Programación y vuelve a los datos", async ({ page }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    await page.getByLabel("Insulina basal").fill("20");
    await page
      .getByRole("navigation", { name: "Pasos de la calculadora" })
      .getByRole("button", { name: "Programación" })
      .click();
    await expect(
      page.getByRole("heading", { name: /Programación inicial en CamAPS FX/ }),
    ).toBeInViewport();
    await page.getByRole("button", { name: "Editar datos" }).last().click();
    await expect(page.getByLabel("Insulina basal")).toBeFocused();
    await expect(page.getByLabel("Insulina basal")).toHaveValue("20");
  });
  test("V95-12: en Buscar, el ámbito va antes del pasaje", async ({ page }) => {
    await page.goto("/#/buscar/modo%20sue%C3%B1o%20control%20iq");
    const pasaje = page.getByText(/Puede utilizarse el modo sueño de forma continuada/).first();
    await expect(pasaje).toBeVisible();
    const ambito = page.getByText("Gestación", { exact: true }).first();
    const [a, p] = await Promise.all([ambito.boundingBox(), pasaje.boundingBox()]);
    expect(a!.y).toBeLessThan(p!.y);
  });
});
