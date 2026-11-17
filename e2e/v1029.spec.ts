import { expect, test } from "@playwright/test";

/* 1.0.29: auditoría de la 1.0.28 (V01, A02, T05–T07, L08, I09, M10). Comportamiento, no capturas. */
test.describe("1.0.29 · auditoría de la 1.0.28", () => {
  test("V01: el visor atrapa el foco, Atrás lo cierra sin dejar la galería y Esc devuelve el foco", async ({
    page,
  }) => {
    await page.goto("/#/");
    await page.goto("/#/visual/figuras");
    const abrir = page.getByRole("button", { name: /^Ampliar/ }).first();
    await abrir.click();
    const visor = page.getByRole("dialog");
    await expect(visor).toBeVisible();
    await expect(page.getByRole("button", { name: "Cerrar el visor" })).toBeFocused();
    // Mayús+Tab desde el primero va al último; Tab desde el último, al primero.
    await page.getByRole("button", { name: "Alejar" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "Cerrar el visor" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Alejar" })).toBeFocused();
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Shift+Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("[role='dialog']"))).toBe(
        true,
      );
    }
    // Atrás: el visor se cierra y la galería sigue en su sitio.
    const y = await page.evaluate(() => window.scrollY);
    await page.goBack();
    await expect(visor).toHaveCount(0);
    await expect(page).toHaveURL(/#\/visual\/figuras$/);
    expect(await page.evaluate(() => window.scrollY)).toBe(y);
    // Esc: cerrado y el foco en el botón que lo abrió; el siguiente Atrás navega como siempre.
    await abrir.click();
    await expect(visor).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(visor).toHaveCount(0);
    await expect(abrir).toBeFocused();
    await page.waitForTimeout(100);
    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
  });

  test("A02: consultar la fuente de una pregunta y volver conserva el intento", async ({
    page,
  }) => {
    await page.goto("/#/test");
    const preguntas = page.locator("main ol > li.tarjeta");
    await preguntas.nth(0).getByRole("button").first().click();
    await preguntas.nth(1).getByRole("button").nth(1).click();
    const avance = page.getByText(/^Respondidas 2 de 10/);
    await expect(avance).toBeVisible();
    const texto = await avance.textContent();
    await preguntas
      .nth(0)
      .getByRole("link", { name: /^Leer en el apartado/ })
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page.getByText(texto!)).toBeVisible();
    await expect(preguntas.nth(0).locator("[aria-pressed='true']")).toHaveCount(1);
    // Por el menú (no con Atrás) también.
    await page.goto("/#/capitulo");
    await page.goto("/#/test");
    await expect(page.getByText(texto!)).toBeVisible();
    // Reinicio explícito, que se puede deshacer (1.0.30).
    await page.getByRole("button", { name: "Volver a empezar" }).first().click();
    await expect(page.getByText(/^Respondidas 0 de 10/)).toBeVisible();
    await page.getByRole("button", { name: "Deshacer" }).click();
    await expect(page.getByText(texto!)).toBeVisible();
    await page.getByRole("button", { name: "Volver a empezar" }).first().click();
    await expect(page.getByText(/^Respondidas 0 de 10/)).toBeVisible();
  });

  test("T05: «Ir a una característica» salta a la fila sin ocultar las demás", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T1");
    await expect(page.locator('[data-fila="0"]:visible')).toBeVisible();
    const filasAntes = await page.locator("[data-fila]:visible").count();
    expect(filasAntes).toBeGreaterThan(6);
    await page.getByLabel("Ir a una característica").selectOption({ index: 6 });
    const destino = page.locator('[data-fila="5"]:visible');
    await expect(destino).toBeFocused();
    await expect(destino).toHaveClass(/fila-destino/);
    await expect(destino).toBeInViewport();
    expect(await page.locator("[data-fila]:visible").count()).toBe(filasAntes);
  });

  test("T07: el filtro de fila se llama por lo que hace", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T6");
    const filtro = page.getByLabel("Mostrar un procedimiento");
    await expect(filtro).toContainText("Todos los procedimientos");
    await page.goto("/#/consultar/tablas/T5");
    await expect(page.getByLabel("Mostrar un paso")).toContainText("Todos los pasos");
  });

  test("L08: el apartado 8 lleva a sus partes del texto", async ({ page }) => {
    await page.goto("/#/capitulo/08-iniciacion");
    const partes = page.getByRole("navigation", { name: "Partes del texto" });
    await expect(partes.getByRole("link", { name: "Seguimiento mantenido" })).toBeVisible();
    await partes.getByRole("link", { name: "Seguimiento mantenido" }).click();
    await expect(page).toHaveURL(/08-iniciacion\/b\d+$/);
    // 1.0.30: el foco pasa al bloque de destino (se quedaba en el título).
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.classList.contains("bloque-destino")))
      .toBe(true);
  });

  test("I09 y M10: el alcance del cálculo antes de los datos y el tipo de hoja al abrirla", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:control-iq");
    const alcance = page.getByText(/^Ayuda de cálculo orientativa: aplica las reglas/);
    await expect(alcance).toBeVisible();
    const primerCampo = page.locator(".formulario-calc input").first();
    const [a, b] = await Promise.all([alcance.boundingBox(), primerCampo.boundingBox()]);
    expect(a!.y).toBeLessThan(b!.y);
    await page.goto("/#/pacientes/plan/mm780");
    await expect(page.getByText("Plantilla con texto literal del capítulo")).toBeVisible();
  });
});
