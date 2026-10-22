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
