import { expect, test } from "@playwright/test";

/* 1.0.37 (menores de la revisión independiente de Fable sobre la 1.0.35). */
test.describe("1.0.37 · remates", () => {
  test("«Volver a la consulta» sigue tras Atrás y Adelante", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/#/consultar/tablas/T1");
    await page.getByRole("link", { name: /^Ver en el capítulo/ }).click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    const volver = page.getByRole("button", { name: /Volver a la consulta/ });
    await expect(volver).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T1$/);
    await expect(volver).toHaveCount(0);
    await page.goForward();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await expect(volver).toBeVisible();
    await volver.click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T1$/);
  });

  test("con poca altura, la cabecera de la tabla se pega arriba del todo", async ({ page }) => {
    await page.setViewportSize({ width: 851, height: 393 });
    await page.goto("/#/consultar/tablas/T1");
    const th = page.locator("main table.tabla-capitulo thead th").first();
    await expect(th).toBeVisible();
    await page.mouse.move(425, 200);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      y: window.scrollY,
      top: document.querySelector("main table.tabla-capitulo thead th")!.getBoundingClientRect()
        .top,
    }));
    expect(r.y).toBeGreaterThan(300);
    expect(Math.abs(r.top)).toBeLessThanOrEqual(1);
  });

  test("con «Volver a la consulta», la cabecera de la tabla queda debajo, no detrás", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/#/consultar/inicio/inicio");
    await page.locator('main a[href="#/consultar/tablas/T2"]').first().click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T2$/);
    await expect(page.locator(".volver-pegado")).toBeVisible();
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      th: document.querySelector("main table.tabla-capitulo thead th")!.getBoundingClientRect().top,
      franja: document.querySelector(".volver-pegado")!.getBoundingClientRect().bottom,
    }));
    expect(r.th).toBeGreaterThanOrEqual(r.franja - 2);
  });

  test("cálculo inicial: cifras a la misma altura, selector holgado y «Faltan» al ancho", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#/consultar/inicio/calculadora");
    const grupo = page.getByRole("radiogroup", { name: "Sistema" });
    await expect(grupo).toBeVisible();
    // El nombre más largo, con al menos 8 px hasta el borde de su casilla.
    const holgura = await grupo.evaluate((g) =>
      Math.min(
        ...[...g.querySelectorAll('[role="radio"]')].map((b) => {
          const spans = [...b.querySelectorAll("span")].filter(
            (s) => s.getClientRects().length && (s.textContent || "").trim(),
          );
          const r = document.createRange();
          r.selectNodeContents(spans[spans.length - 1]);
          return b.getBoundingClientRect().right - r.getBoundingClientRect().right;
        }),
      ),
    );
    expect(holgura).toBeGreaterThanOrEqual(8);
    await page.locator("#calc-basal").fill("70");
    await page.locator("#calc-rapida").fill("45");
    await page.locator("#calc-peso").fill("50");
    const tarjetas = page.locator("main .rejilla-cifras > .tarjeta");
    await expect(tarjetas).toHaveCount(4);
    const cifras = await tarjetas.evaluateAll((ts) =>
      ts.map((t) => ({
        fila: Math.round(t.getBoundingClientRect().top),
        valor: Math.round(
          t.querySelector(".rotulo")!.nextElementSibling!.firstElementChild!.getBoundingClientRect()
            .top,
        ),
      })),
    );
    for (const fila of new Set(cifras.map((c) => c.fila)))
      expect(new Set(cifras.filter((c) => c.fila === fila).map((c) => c.valor)).size).toBe(1);

    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/#/consultar/inicio/calculadora");
    await page.reload();
    const falta = page.locator("main p.border-dashed");
    await expect(falta).toBeVisible();
    const bordes = await page.evaluate(() => ({
      falta: document.querySelector("main p.border-dashed")!.getBoundingClientRect().right,
      pauta: document.querySelector('[aria-label="Pauta previa"]')!.getBoundingClientRect().right,
    }));
    expect(Math.abs(bordes.falta - bordes.pauta)).toBeLessThanOrEqual(1);
  });

  test("subrutas que no existen: aviso; las que existen, sin él", async ({ page }) => {
    for (const [ruta, pedido] of [
      ["consultar/situacion/nada", "nada"],
      ["consultar/descarga/99", "99"],
      ["visual/nada", "nada"],
      ["pacientes/hoja/nada", "nada"],
      ["capitulo/08-iniciacion/b999", "b999"],
    ]) {
      await page.goto(`/#/${ruta}`);
      await expect(page.locator("main h1").first()).toBeVisible();
      await expect(
        page
          .locator("main")
          .getByRole("status")
          .filter({ hasText: `«${pedido}»` }),
      ).toBeVisible();
    }
    for (const ruta of [
      "consultar/situacion",
      "consultar/descarga/3",
      "visual/hipoglucemia",
      "pacientes/hoja/cetonas",
      "capitulo/08-iniciacion/b4",
    ]) {
      await page.goto(`/#/${ruta}`);
      await expect(page.locator("main h1").first()).toBeVisible();
      await page.waitForTimeout(1500);
      await expect(page.locator("main").getByRole("status").filter({ hasText: "«" })).toHaveCount(
        0,
      );
    }
  });
});
