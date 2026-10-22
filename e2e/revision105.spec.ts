import { test, expect } from "@playwright/test";

/* 1.0.7 · revisión externa de la 1.0.5 (R105-01 a R105-06). */

test.describe("Revisión 1.0.5", () => {
  test("R105-01: la consulta no entra en el historial del navegador; Atrás y Adelante funcionan", async ({
    page,
  }) => {
    // Cada llamada a pushState y replaceState, serializada, para comprobar que no lleva texto.
    await page.addInitScript(() => {
      const w = window as unknown as { __estados: string[] };
      w.__estados = [];
      for (const f of ["pushState", "replaceState"] as const) {
        const orig = history[f].bind(history);
        history[f] = (estado: unknown, t: string, u?: string | URL | null) => {
          w.__estados.push(JSON.stringify(estado ?? null) + " " + String(u ?? ""));
          return orig(estado, t, u);
        };
      }
    });
    await page.goto("/#/");
    // Un estado de una versión anterior, con el texto: no debe propagarse.
    await page.evaluate(() => {
      history.replaceState({ ...history.state, mseenConsulta: "consulta-heredada" }, "");
      (window as unknown as { __estados: string[] }).__estados = [];
    });
    await page.evaluate(() => (window.location.hash = "#/buscar"));
    const caja = page.locator("#buscar-q");
    await caja.fill("ducha");
    await page
      .getByText(/Desconexión breve/)
      .first()
      .click();
    const elegida = await caja.inputValue();
    expect(elegida).not.toBe("ducha");
    const estados = await page.evaluate(
      () => (window as unknown as { __estados: string[] }).__estados,
    );
    expect(estados.length).toBeGreaterThan(0);
    for (const e of estados) {
      expect(e).not.toContain("ducha");
      expect(e).not.toContain(elegida.slice(0, 12));
      expect(e).not.toContain("consulta-heredada");
    }
    expect(await page.evaluate(() => JSON.stringify(history.state))).not.toMatch(/ducha|Desconexi/);
    await page.goBack();
    await expect(caja).toHaveValue("ducha");
    await page.goForward();
    await expect(caja).toHaveValue(elegida);
    // Tras recargar, la marca ya no tiene texto: Buscar se abre vacío.
    await page.reload();
    await expect(page.locator("#buscar-q")).toHaveValue("");
  });
});

test.describe("Revisión 1.0.5 · hoja de comprobación en una cara", () => {
  const caras = (pdf: Buffer) =>
    (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  // Sin la letra web (el peor caso: la de respaldo), con Ctrl+P y con el botón.
  for (const sis of ["omnipod-5", "control-iq", "minimed-780g", "camaps"])
    test(`R105-02: ${sis} sin letra web, Ctrl+P y botón`, async ({ page }) => {
      await page.route(/\.woff2$/, (r) => r.abort());
      await page.goto(`/#/consultar/inicio/hoja:${sis}`);
      const boton = page.getByRole("button", { name: /Imprimir la hoja/ });
      await expect(boton).toBeVisible();
      await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
      await page.emulateMedia({ media: "print" });
      expect(caras(await page.pdf({ format: "A4", preferCSSPageSize: true }))).toBe(1);
      await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      await page.emulateMedia({ media: "screen" });
      await page.evaluate(() => {
        window.print = () => {
          (window as unknown as { __impreso: boolean }).__impreso = true;
        };
      });
      await boton.click();
      await page.waitForFunction(() => (window as unknown as { __impreso?: boolean }).__impreso);
      await page.emulateMedia({ media: "print" });
      expect(caras(await page.pdf({ format: "A4", preferCSSPageSize: true }))).toBe(1);
    });

  test("R105-02: Omnipod 5 con datos y basal ultralarga, en una cara", async ({ page }) => {
    await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
    const campos = page.locator(".formulario-calc input[inputmode]");
    await campos.nth(0).fill("20");
    await campos.nth(1).fill("20");
    await campos.nth(2).fill("70");
    await page.getByLabel(/glargina U-300 o degludec/).check();
    await page
      .getByRole("group", { name: "Herramienta" })
      .getByRole("button", { name: /Hoja/ })
      .click();
    await expect(page.locator(".hoja-inicio")).toContainText("U-300");
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => {
      document.body.getBoundingClientRect();
      await document.fonts.ready;
    });
    expect(caras(await page.pdf({ format: "A4", preferCSSPageSize: true }))).toBe(1);
  });
});

test.describe("Revisión 1.0.5 · capas, notas y registro", () => {
  test("R105-04: Sobre distingue literal, resumen operativo y vistas adaptadas", async ({
    page,
  }) => {
    await page.goto("/#/sobre");
    await expect(
      page.getByText(/la comparación por\s+parámetro y las vistas adaptadas/),
    ).toBeVisible();
    await expect(page.getByText(/comparaciones de «Los cuatro»/)).toHaveCount(0);
  });

  test("R105-06: la nota general de la Tabla 6, rotulada y debajo de la conducta", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/rm:omnipod-5");
    const rotulo = page.getByText("Nota general de la Tabla 6");
    await expect(rotulo).toBeVisible();
    const y = (l: ReturnType<typeof page.getByText>) =>
      l.first().evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
    expect(await y(page.getByText(/colocar un pod nuevo/))).toBeLessThan(await y(rotulo));
  });

  test("R105-03: el plan dice cuándo se revisó y cuándo se modificó", async ({ page }) => {
    await page.goto("/#/pacientes/plan/op5");
    await expect(page.locator(".hoja-pie").first()).toContainText(
      /Revisada el 14-10-2026 · modificada el 22-10-2026/,
    );
  });
});
