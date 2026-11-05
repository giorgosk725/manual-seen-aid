import { test, expect } from "@playwright/test";

/* 1.0.20 · vigesimoséptima ronda de auditorías (sobre la 1.0.19). */

test.describe("Ronda 27 · tablas", () => {
  test("visual: la cabecera de las tablas, en texto burdeos (en la 1.0.19 quedaba en gris)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#/consultar/tablas/T3");
    const th = page.locator(".tabla-capitulo thead th").first();
    await expect(th).toBeVisible();
    expect(await th.evaluate((e) => getComputedStyle(e).color)).toBe("rgb(142, 37, 78)");
  });

  test("R3: la fila a la que se llega se distingue de las alternas, con pleca", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#/consultar/tablas/T2::1");
    const fila = page.locator(".tabla-capitulo tbody tr.fila-resaltada");
    await expect(fila).toBeVisible();
    const fondo = await fila
      .locator("td")
      .first()
      .evaluate((e) => getComputedStyle(e).background);
    expect(fondo).toContain("rgb(239, 217, 227)");
    const alterna = await page
      .locator(".tabla-capitulo tbody tr:nth-child(4) td")
      .first()
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(alterna).not.toBe("rgb(239, 217, 227)");
    expect(await fila.locator("th").evaluate((e) => getComputedStyle(e).boxShadow)).toContain(
      "rgb(142, 37, 78) 3px 0px 0px 0px inset",
    );
    await expect(page.getByRole("combobox", { name: /Ir a una fila/ })).toContainText("marcada:");
  });

  test("visual y senior: en papel, rótulos en gris neutro y el colofón en el margen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#/consultar/tablas/T3");
    await expect(page.locator("style[data-cabecera-impresa]")).toHaveCount(1);
    expect(await page.locator("style[data-cabecera-impresa]").textContent()).toContain("Tabla 3");
    await page.emulateMedia({ media: "print" });
    const th = page.locator(".tabla-capitulo tbody th").first();
    expect(await th.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(
      "rgb(242, 242, 242)",
    );
    await expect(page.locator(".imprimible .colofon")).toHaveCount(0);
  });
});

test.describe("Ronda 27 · situaciones, foco y contenido", () => {
  test("R1: en el móvil, elegir el sistema no esconde el título de la situación", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/situacion/rm");
    // Con la pantalla ya pintada (la conducta a la vista bajo el selector), como quien la lee.
    await expect(page.locator("#conducta-situacion")).toBeVisible();
    await page.waitForTimeout(400);
    await page.locator('main [role="radio"]').nth(1).click();
    await expect(page).toHaveURL(/rm:control-iq$/);
    await page.waitForTimeout(300);
    const titulo = page.locator("main h2", { hasText: "Resonancia magnética" }).first();
    const cabecera = await page
      .locator("header")
      .first()
      .evaluate((e) => e.getBoundingClientRect().bottom);
    expect((await titulo.boundingBox())!.y).toBeGreaterThanOrEqual(cabecera - 1);
  });

  test("R1: desde Hipoglucemia, el plan de seguridad no hereda el último sistema", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/rm:control-iq");
    await page.goto("/#/visual/hipoglucemia");
    const enlace = page.getByRole("link", { name: /Plan de seguridad/ }).first();
    await expect(enlace).toHaveAttribute("href", "#/pacientes");
    await expect(enlace).not.toContainText("Control-IQ");
  });

  test("R3: con teclado, Intro en «Sistemas AID» del lateral lleva el foco al contenido", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#/");
    await page.getByRole("link", { name: "Sistemas AID" }).first().focus();
    await page.keyboard.press("Enter");
    await expect
      .poll(() =>
        page.evaluate(() => !!document.querySelector("main")?.contains(document.activeElement)),
      )
      .toBe(true);
  });

  test("adjunto: ingreso con Omnipod 5, la pauta de respaldo sin repetir la frase entera", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:omnipod-5");
    const bloque = page.locator("main").getByText("Pauta de respaldo", { exact: true }).first();
    await expect(bloque).toBeVisible();
    await expect(page.locator("main")).toContainText("La pauta de respaldo puede estimarse");
    expect(
      (await page.locator("main").textContent())?.split("Cuando el sistema no proporciona").length,
    ).toBe(2);
  });
});
