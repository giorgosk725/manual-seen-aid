import { test, expect } from "@playwright/test";

/* 0.97.1 · decimoséptima ronda de auditorías (R1, R3, R4-R5, adjunto, senior y visual). */

test.describe("Ronda 17", () => {
  test("Tablas 1 y 3: ninguna celda se sale (la serie de cifras de Omnipod 5 se parte)", async ({
    page,
  }) => {
    for (const w of [1024, 1366, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      for (const r of ["sistemas/todos/ajuste", "sistemas/todos/esencial"]) {
        await page.goto(`/#/${r}`);
        await expect(page.locator(".tabla-capitulo").first()).toBeVisible();
        const fuera = await page.evaluate(() =>
          [...document.querySelectorAll(".tabla-capitulo td, .tabla-capitulo th")]
            .filter((c) => c.scrollWidth > c.clientWidth + 1)
            .map((c) => c.textContent?.slice(0, 40)),
        );
        expect(fuera, `${r} a ${w}`).toEqual([]);
      }
    }
  });

  test("hoja de comprobación con Ctrl+P: una cara, como con el botón", async ({ page }) => {
    await page.goto("/#/consultar/inicio/hoja:omnipod-5");
    await expect(page.getByRole("button", { name: /Imprimir la hoja/ })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(page.locator("html")).toHaveClass(/imprimiendo/);
    await page.emulateMedia({ media: "print" });
    // 1.0.7 (revisión R105-02): al pasar a impresión, Chromium vuelve a cargar la letra; se espera
    // a que termine (como el navegador al imprimir) antes de generar el PDF.
    await page.evaluate(async () => {
      document.body.getBoundingClientRect();
      await document.fonts.ready;
    });
    const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
    expect((pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length).toBe(1);
  });

  test("Situaciones en el móvil: Atrás desde una situación vuelve a la lista; la barra, arriba", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/");
    const barra = page.getByRole("navigation", { name: "Barra inferior" });
    await barra.getByRole("link", { name: "Situaciones" }).click();
    await page.getByRole("button", { name: /Resonancia magnética/ }).click();
    await expect(page).toHaveURL(/situacion\/rm/);
    await page.goBack();
    await expect(page).toHaveURL(/#\/consultar\/situacion$/);
    await page.goForward();
    await expect(page).toHaveURL(/situacion\/rm/);
    await page.evaluate(() => window.scrollTo(0, 600));
    await barra.getByRole("link", { name: "Situaciones" }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("Interrupción: cada formato con la desconexión de sus sistemas", async ({ page }) => {
    await page.goto("/#/consultar/interrupcion");
    for (const id of ["op5", "mm780", "ciq", "camaps"])
      await expect(page.locator(`main a[href="#/sistemas/${id}/modos:desconexion"]`)).toHaveCount(
        1,
      );
    await page.locator('main a[href="#/sistemas/camaps/modos:desconexion"]').click();
    await expect(page.locator(".fila-resaltada")).toContainText("Desconexión");
  });

  test("Gestación sin sistema: la autorización y la evidencia de los cuatro", async ({ page }) => {
    await page.goto("/#/consultar/situacion/gestacion");
    await expect(
      page.getByRole("heading", { name: "Gestación: autorización y evidencia" }),
    ).toBeVisible();
    await expect(
      page
        .locator("main")
        .getByText(/evidencia: CRISTAL/)
        .first(),
    ).toBeVisible();
  });

  test("Buscar: Atrás tras elegir una sugerencia vuelve a lo escrito", async ({ page }) => {
    await page.goto("/#/");
    await page.evaluate(() => (window.location.hash = "#/buscar"));
    const caja = page.locator("#buscar-q");
    await caja.fill("ducha");
    await page
      .getByText(/Desconexión breve/)
      .first()
      .click();
    await expect(caja).not.toHaveValue("ducha");
    await page.goBack();
    await expect(page).toHaveURL(/#\/buscar$/);
    await expect(caja).toHaveValue("ducha");
  });

  test("foco: al llegar a una fila de tabla, la fila; con Atrás, el enlace de origen", async ({
    page,
  }) => {
    await page.goto("/#/");
    await page.evaluate(() => (window.location.hash = "#/sistemas/ciq/indicacion"));
    const enlace = page.locator('main a[href*="T1:control-iq:7"]').first();
    await enlace.click();
    await expect(page.locator(".fila-resaltada").first()).toBeFocused();
    await expect(page.getByRole("button", { name: /Volver a la consulta/ })).toBeVisible();
    await page.goBack();
    await expect(enlace).toBeFocused();
  });
});
