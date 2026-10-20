/* Cinco recorridos completos (revisión de la 0.34, encargo del 11-10): leer una tabla y volver;
   transición desde plumas; aspecto de Iniciar y su fuente; diferencias entre variantes; paso 7 y
   el ejemplo. */
import { expect, test } from "@playwright/test";
import { retirado } from "../src/edicion";

test.describe("Recorridos completos (0.36.0)", () => {
  test("1 · Leer Tabla 3 → consultar Omnipod → comparar → volver al punto de lectura", async ({
    page,
  }) => {
    await page.goto("/#/capitulo/08-iniciacion");
    const tabla = page.getByText("Tabla 3", { exact: true }).first();
    await tabla.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const antes = await page.evaluate(() => window.scrollY);
    expect(antes).toBeGreaterThan(200);
    await page
      .locator('a[href="#/consultar/tablas/T3"]', { hasText: "Ver por sistema" })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T3/);
    await page
      .getByRole("group", { name: "Filtrar por sistema" })
      .getByRole("button", { name: /Omnipod 5/ })
      .click();
    await expect(page).toHaveURL(/T3:omnipod-5/);
    await page
      .getByRole("group", { name: "Filtrar por sistema" })
      .getByRole("button", { name: /CamAPS/ })
      .click();
    await expect(page).toHaveURL(/T3:camaps\+omnipod-5|T3:omnipod-5\+camaps/);
    // La selección de sistemas no apila historial (replace): un Atrás, o los que hagan falta.
    for (let i = 0; i < 3 && !/#\/capitulo\//.test(page.url()); i++) await page.goBack();
    await expect(page).toHaveURL(/#\/capitulo\/08-iniciacion/);
    await page.waitForTimeout(600);
    const despues = await page.evaluate(() => window.scrollY);
    expect(Math.abs(despues - antes)).toBeLessThan(160);
  });

  test("2 · Buscar una transición desde plumas → abrir Iniciar del sistema", async ({ page }) => {
    await page.goto("/#/buscar/quiero%20pasar%20de%20plumas%20a%20Omnipod");
    await page
      .getByRole("list", { name: "Abrir" })
      .getByRole("link", { name: /Iniciación del sistema · Omnipod 5/ })
      .click();
    await expect(page).toHaveURL(/#\/consultar\/inicio\/preparacion:omnipod-5$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Iniciación del sistema");
  });

  test("3 · Elegir una tarea de Inicio → consultar su fuente → regresar a la misma tarea", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    await page.getByRole("button", { name: "Basal, ratio y factor de sensibilidad" }).click();
    await expect(page).toHaveURL(/:parametros$/);
    const url = page.url();
    await page
      .getByRole("link", { name: /Tabla 2, p\. 10/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.getByRole("button", { name: /Volver a la consulta/ }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByText(/Regla del 450/)).toBeVisible();
  });

  test("4 · Buscar diferencias entre variantes → contenido pertinente", async ({ page }) => {
    await page.goto(
      "/#/buscar/en%20qu%C3%A9%20se%20diferencian%20control%20iq%20y%20control%20iq%20plus",
    );
    await expect(
      page.getByText("¿Qué diferencia hay entre Control-IQ y Control-IQ+?").first(),
    ).toBeVisible();
    await expect(page.getByText(/Control-IQ\+:\s≥\s2\saños/).first()).toBeVisible();
    await expect(page.getByRole("region", { name: /^También sobre/ })).toHaveCount(0);
  });

  test("5 · Revisar paso 7 → abrir el ejemplo → comprender → regresar", async ({ page }) => {
    test.skip(retirado("casos"), "Los casos guiados no van en esta edición (src/edicion.ts).");
    await page.goto("/#/consultar/descarga/7");
    await expect(page.getByText(/Paso 7 de 8/)).toBeVisible();
    await page.getByRole("link", { name: /Ver este paso en el ejemplo comentado/ }).click();
    await expect(page).toHaveURL(/#\/casos\/ejemplo-descarga\/7$/);
    await page
      .getByRole("button", { name: /no identifican por sí solas la causa/ })
      .first()
      .click();
    await expect(page.getByText("Qué observamos").first()).toBeVisible();
    await expect(page.getByText("Lo que dice el capítulo").first()).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#\/consultar\/descarga\/7$/);
    await expect(page.getByText(/Paso 7 de 8/)).toBeVisible();
  });
});
