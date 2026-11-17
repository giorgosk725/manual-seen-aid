import { expect, test } from "@playwright/test";

/* 1.0.29 en el móvil: tablas con tema en la tira (T06) y salto a un aspecto en las fichas (T05). */
test.describe("1.0.29 · tablas en el móvil", () => {
  test("T06: cada pestaña dice su número y su tema", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T1");
    const tira = page.getByRole("navigation", { name: "Otra tabla" });
    await expect(tira.getByRole("link", { name: "Tabla 4 · Situaciones" })).toBeAttached();
    await expect(tira.getByRole("link", { name: "Tabla 1 · Sistemas" })).toContainText(
      "1 · Sistemas",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      await page.evaluate(() => window.innerWidth),
    );
  });

  test("T05: el salto lleva a la ficha de la fila, con un sistema y con los cuatro", async ({
    page,
  }) => {
    for (const ruta of ["/#/consultar/tablas/T3", "/#/consultar/tablas/T3:control-iq"]) {
      await page.goto(ruta);
      await expect(page.locator('[data-fila="0"]:visible')).toBeVisible();
      await page.getByLabel("Ir a un aspecto").selectOption({ index: 4 });
      const destino = page.locator('[data-fila="3"]:visible');
      await expect(destino).toBeFocused();
      await expect(destino).toBeInViewport();
    }
  });

  test("1.0.30: a 320 px, nada se sale ni se pega en la barra inferior", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    for (const ruta of ["/#/visual/objetivos-mcg", "/#/consultar/tablas/T1", "/#/"]) {
      await page.goto(ruta);
      await page.waitForTimeout(400);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(0);
    }
    const solapes = await page.evaluate(() => {
      const ets = [...document.querySelectorAll('nav[aria-label="Barra inferior"] li')].map(
        (li) => {
          const r = document.createRange();
          const el = li.querySelector("a, button")!;
          r.selectNodeContents(el.lastChild as Node);
          const b = r.getBoundingClientRect();
          const c = li.getBoundingClientRect();
          return { izq: b.left, der: b.right, celdaIzq: c.left, celdaDer: c.right };
        },
      );
      return ets.filter((e) => e.izq < e.celdaIzq - 0.5 || e.der > e.celdaDer + 0.5).length;
    });
    expect(solapes).toBe(0);
  });

  test("1.0.31: el título del visor se lee entero en el móvil", async ({ page }) => {
    await page.goto("/#/visual/figuras");
    await page
      .getByRole("button", { name: /^Ampliar/ })
      .first()
      .click();
    const titulo = page.getByRole("dialog").locator("p").first();
    await expect(titulo).toBeVisible();
    expect(
      await titulo.evaluate(
        (e) => e.scrollWidth <= e.clientWidth && e.scrollHeight <= e.clientHeight,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
  });
});
