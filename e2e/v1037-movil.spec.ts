import { expect, test } from "@playwright/test";

/* 1.0.37 (menores de la revisión independiente de Fable sobre la 1.0.35), en el móvil. */
test.describe("1.0.37 · remates en el móvil", () => {
  test("a 320 px, el tamaño de letra de la lectura se cambia desde «Más»", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto("/#/capitulo/08-iniciacion");
    await expect(page.locator("main h1").first()).toBeVisible();
    await expect(
      page.locator("header").getByRole("button", { name: "Letra más grande" }),
    ).toBeHidden();
    await page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("button", { name: /Más/ })
      .click();
    const mayor = page.getByRole("dialog").getByRole("button", { name: "Letra más grande" });
    await expect(mayor).toBeVisible();
    const caja = await mayor.boundingBox();
    expect(caja!.width).toBeGreaterThanOrEqual(44);
    expect(caja!.height).toBeGreaterThanOrEqual(44);
    const antes = await page.evaluate(() => window.localStorage.getItem("mseen:letra"));
    await mayor.click();
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("mseen:letra")))
      .not.toBe(antes);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(0);
  });

  test("a 393 px, la letra sigue en la cabecera y no se repite en «Más»", async ({ page }) => {
    await page.goto("/#/capitulo/08-iniciacion");
    await expect(
      page.locator("header").getByRole("button", { name: "Letra más grande" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("button", { name: /Más/ })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("dialog").getByRole("button", { name: "Letra más grande" }),
    ).toBeHidden();
  });

  test("tocar el texto de un enlace en línea abre ese enlace, no el de la línea de al lado", async ({
    page,
  }) => {
    for (const ruta of ["sistemas/ciq", "sistemas/mm780", "sistemas/ciq/modos"]) {
      await page.goto(`/#/${ruta}`);
      await expect(page.locator("main h1").first()).toBeVisible();
      await page.waitForTimeout(400);
      const r = await page.evaluate(async () => {
        const malos: string[] = [];
        let puntos = 0;
        const enlaces = [...document.querySelectorAll<HTMLElement>("main a.tap-44")].filter(
          (a) => getComputedStyle(a).display === "inline" && a.getClientRects().length,
        );
        for (const a of enlaces) {
          a.scrollIntoView({ block: "center" });
          await new Promise((ok) => requestAnimationFrame(ok));
          for (const q of a.getClientRects()) {
            if (q.width < 4) continue;
            for (const fy of [0.3, 0.5, 0.7])
              for (const fx of [0.15, 0.5, 0.85]) {
                puntos++;
                const t = document.elementFromPoint(q.left + q.width * fx, q.top + q.height * fy);
                const otro = t?.closest("a, button");
                if (otro && otro !== a)
                  malos.push(
                    `«${(a.textContent || "").trim().slice(0, 24)}» → «${(otro.textContent || "").trim().slice(0, 24)}»`,
                  );
              }
          }
        }
        return { puntos, malos: [...new Set(malos)] };
      });
      expect(r.puntos).toBeGreaterThan(0);
      expect(r.malos).toEqual([]);
    }
  });

  test("tarjeta de sistema a 360 px: los accesos de la segunda línea, juntos a la izquierda", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/#/sistemas");
    const nav = page.getByRole("navigation", { name: /^Ficha de / }).first();
    await expect(nav).toBeVisible();
    const filas = await nav.evaluate((n) => {
      const caja = n.getBoundingClientRect();
      const porFila = new Map<number, { izq: number; der: number }[]>();
      for (const a of n.querySelectorAll("a")) {
        const q = a.getBoundingClientRect();
        const k = Math.round(q.top);
        porFila.set(k, [
          ...(porFila.get(k) ?? []),
          { izq: q.left - caja.left, der: q.right - caja.left },
        ]);
      }
      return [...porFila.values()];
    });
    expect(filas.length).toBeGreaterThanOrEqual(2);
    const segunda = filas[filas.length - 1];
    // Empieza en el margen izquierdo y, si lleva dos, no quedan en extremos opuestos.
    expect(segunda[0].izq).toBeLessThanOrEqual(20);
    for (let i = 1; i < segunda.length; i++)
      expect(segunda[i].izq - segunda[i - 1].der).toBeLessThanOrEqual(24);
  });

  test("hoja para el paciente: su título se lee entero en la miga", async ({ page }) => {
    await page.goto("/#/pacientes/hoja/cetonas");
    const actual = page
      .getByRole("navigation", { name: "Hojas para el paciente" })
      .locator('[aria-current="page"]');
    await expect(actual).toBeVisible();
    expect(await actual.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    expect(await actual.evaluate((e) => getComputedStyle(e).textOverflow)).not.toBe("ellipsis");
  });

  test("visor de figuras: botones de 44 px en una sola fila, también a 320 px", async ({
    page,
  }) => {
    for (const ancho of [320, 393]) {
      await page.setViewportSize({ width: ancho, height: 740 });
      await page.goto("/#/visual/figuras");
      await page
        .getByRole("button", { name: /^Ampliar/ })
        .first()
        .click();
      const visor = page.getByRole("dialog");
      await expect(visor.getByRole("button", { name: "Cerrar el visor" })).toBeVisible();
      const cajas = await visor.evaluate((d) =>
        [...d.querySelectorAll("button, a")].slice(0, 5).map((b) => {
          const q = b.getBoundingClientRect();
          return { w: q.width, h: q.height, top: Math.round(q.top) };
        }),
      );
      expect(cajas).toHaveLength(5);
      for (const c of cajas) {
        expect(c.w).toBeGreaterThanOrEqual(44);
        expect(c.h).toBeGreaterThanOrEqual(44);
      }
      expect(new Set(cajas.map((c) => c.top)).size).toBe(1);
      await page.keyboard.press("Escape");
    }
  });
});
