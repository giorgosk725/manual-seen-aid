import { expect, test } from "@playwright/test";

/* 1.0.34 (menores de la revisión de Fable de la 1.0.32). */
test.describe("1.0.34 · remates", () => {
  test("a 1024 px, la última pestaña de la ficha se ve entera", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/#/sistemas/ciq/indicacion");
    const tira = page.getByRole("navigation", { name: "Sección" });
    await expect(tira.getByRole("link").last()).toBeVisible();
    const fuera = await tira.evaluate((n) => {
      const caja = n.getBoundingClientRect();
      const ultima = [...n.querySelectorAll("a")].pop()!.getBoundingClientRect();
      return ultima.right - caja.right;
    });
    expect(fuera).toBeLessThanOrEqual(1);
    await expect(page.getByRole("link", { name: "Comparar con los demás" })).toBeVisible();
  });

  test("rutas inexistentes: título y aviso", async ({ page }) => {
    await page.goto("/#/nada");
    await expect(
      page.getByRole("heading", { level: 1, name: "Esa pantalla no existe" }),
    ).toBeVisible();
    await page.goto("/#/sistemas/zzz");
    await expect(page.getByRole("status").filter({ hasText: "«zzz»" })).toBeVisible();
    await page.goto("/#/consultar/tablas/T9");
    await expect(page.getByRole("status").filter({ hasText: "«T9»" })).toBeVisible();
  });
});
