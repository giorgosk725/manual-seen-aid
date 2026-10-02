import { test, expect } from "@playwright/test";

/* Regresiones de la auditoría del 2-10-2026 (docs/AUDITORIA_2026-10-02.md). */

test.describe("Navegación e historial", () => {
  test("elegir un tramo de la Figura 3 no sube al principio ni apila historial", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 760 });
    await page.goto("/#/consultar/figura-3");
    const boton = page.getByRole("button", { name: /β-OHB ≥3,0 mmol\/l/ });
    await boton.scrollIntoViewIfNeeded();
    const antes = await page.evaluate(() => window.scrollY);
    expect(antes).toBeGreaterThan(100);
    const largo = await page.evaluate(() => history.length);
    await boton.click();
    await expect(page).toHaveURL(/figura-3\/rojo$/);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    expect(await page.evaluate(() => history.length)).toBe(largo);
  });

  test("Atrás desde un resultado conserva la búsqueda", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.getByLabel("Texto a buscar").fill("glargina");
    await expect(page).toHaveURL(/#\/buscar\/glargina$/);
    await page
      .getByRole("link", { name: /glargina/i })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page.getByLabel("Texto a buscar")).toHaveValue("glargina");
  });

  test("Atrás devuelve la Interrupción al tramo anterior", async ({ page }) => {
    await page.goto("/#/consultar/interrupcion/breve");
    await page.goto("/#/consultar/interrupcion/prolongada");
    await expect(page.getByRole("heading", { level: 2, name: /Prolongada/ })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { level: 2, name: "Muy breve" })).toBeVisible();
  });

  test("el enlace a una referencia la deja a la vista", async ({ page }) => {
    await page.goto("/#/bibliografia/ref-9");
    await expect(page.locator("#ref-9")).toBeInViewport();
  });

  test("una URL con «%» mal formado no rompe la app", async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(String(e)));
    await page.goto("/#/buscar/50%");
    await expect(page.getByLabel("Texto a buscar")).toBeVisible();
    expect(errores).toEqual([]);
  });
});

test.describe("Impresión", () => {
  test("el apartado impreso conserva su título y el texto nocturno sale negro", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("mseen:night", "1"));
    await page.goto("/#/capitulo/05-resultados");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const color = await page
      .locator(".prosa p")
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe("rgb(0, 0, 0)");
    // La barra lateral y la cabecera fija no se imprimen.
    await expect(page.locator(".cabecera")).toBeHidden();
  });

  test("en papel las tablas salen como tabla, no como fichas", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto("/#/capitulo/04-sistemas");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("table", { name: /Tabla 1/ })).toBeVisible();
  });
});
