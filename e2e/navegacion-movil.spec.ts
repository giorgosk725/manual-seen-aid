/* Entrega 1 del plan del 9-10-2026 (docs/PLAN_2026-10-09.md), en el móvil (Pixel 5, 393 px):
   portada compacta, texto del apartado en la primera pantalla y un área activa por pantalla. */
import { expect, test } from "@playwright/test";

test.describe("Navegación y portada (393 px)", () => {
  test("UX01: la portada cabe en dos pantallas y media, con Leer, Paciente y Buscar a la vista", async ({
    page,
  }) => {
    await page.goto("/#/");
    await expect(
      page.getByRole("link", { name: "Para el paciente", exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Leer capítulo", exact: true }).first(),
    ).toBeInViewport();
    const { alto, vh } = await page.evaluate(() => ({
      alto: document.documentElement.scrollHeight,
      vh: window.innerHeight,
    }));
    expect(alto, `portada de ${alto}px con pantalla de ${vh}px`).toBeLessThanOrEqual(vh * 2.5);
  });

  test("UX03: en un apartado, el texto empieza en la primera pantalla", async ({ page }) => {
    await page.goto("/#/capitulo/09-descarga");
    const primero = page.locator("main #b1");
    await expect(primero).toBeVisible();
    const y = await primero.evaluate((el) => el.getBoundingClientRect().top);
    const vh = await page.evaluate(() => window.innerHeight);
    expect(y, `el primer párrafo empieza a ${y}px`).toBeLessThan(vh - 120);
  });

  test("en el apartado solo queda Imprimir / PDF (sin citar, escuchar ni favorito)", async ({
    page,
  }) => {
    await page.goto("/#/capitulo/02-componentes");
    await expect(page.getByRole("button", { name: /Imprimir \/ PDF/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cómo citar" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Escuchar/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Favorito/ })).toHaveCount(0);
  });

  test("la barra inferior marca el área de cada pantalla", async ({ page }) => {
    const barra = page.getByRole("navigation", { name: "Barra inferior" });
    for (const [ruta, area] of [
      ["/#/sistemas/op5", "Inicio"],
      ["/#/sistemas/todos/parametros", "Inicio"],
      ["/#/visual", "Leer"],
      ["/#/consultar/tablas/T3", "Inicio"],
      ["/#/capitulo/04-sistemas", "Leer"],
      ["/#/test", "Leer"],
      ["/#/repaso", "Leer"],
      ["/#/pacientes", "Paciente"],
      ["/#/buscar/insulina", "Buscar"],
    ]) {
      await page.goto(ruta);
      await expect(barra.getByRole("link", { name: area }), ruta).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(barra.locator('[aria-current="page"]'), ruta).toHaveCount(1);
    }
  });
});
