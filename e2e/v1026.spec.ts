import { expect, test } from "@playwright/test";

/* 1.0.26: lo traído del asistente (pestañas con teclado, cuadro combinado, flotante que se aparta,
   desvanecido de las pestañas de Tablas, teclado del móvil en Buscar). */
test.describe("1.0.26 · teclado y pestañas", () => {
  test("Tablas: ← → Inicio Fin entre pestañas", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/tablas/T3");
    const tira = page.getByRole("navigation", { name: "Otra tabla" });
    await tira.getByRole("link").first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tira.getByRole("link").nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(tira.getByRole("link").last()).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tira.getByRole("link").first()).toBeFocused();
  });

  test("Tablas a 360 px: la tira avisa de que hay más", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/#/consultar/tablas/T1");
    await expect(page.getByRole("navigation", { name: "Otra tabla" })).toHaveAttribute(
      "data-mas",
      "1",
    );
  });

  test("Buscar: cuadro combinado; ↓ entra en las sugerencias y Esc vuelve", async ({ page }) => {
    await page.goto("/#/buscar");
    const caja = page.getByRole("combobox", { name: "Texto a buscar" });
    await caja.fill("hipogl");
    await expect(caja).toHaveAttribute("aria-expanded", "true");
    await expect(caja).toHaveAttribute("aria-controls", "sugerencias-buscar");
    await caja.press("ArrowDown");
    const lista = page.locator("#sugerencias-buscar");
    await expect(lista.locator("a, button").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(caja).toBeFocused();
  });
});

test.describe("1.0.26 · móvil", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test("el «Volver a la consulta» flotante se aparta al bajar y vuelve al subir", async ({
    page,
  }) => {
    await page.goto("/#/consultar/descarga/6");
    await page.getByRole("link", { name: /Ajuste de los parámetros por sistema/ }).click();
    const volver = page.locator(".volver-pegado");
    await expect(volver).toBeInViewport();
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(volver).not.toBeInViewport();
    await page.evaluate(() => window.scrollBy(0, -200));
    await expect(volver).toBeInViewport();
  });

  test("Buscar con una consulta ya puesta no abre el teclado", async ({ page }) => {
    await page.goto("/#/preguntas");
    await page.getByRole("searchbox", { name: "Filtrar preguntas" }).fill("husos horarios");
    await page.getByRole("link", { name: "Buscar «husos horarios» en el capítulo" }).click();
    await expect(page.locator("#buscar-q")).toHaveValue("husos horarios");
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.activeElement?.id)).not.toBe("buscar-q");
  });
});
