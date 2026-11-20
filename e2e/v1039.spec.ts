import { expect, test, type Page } from "@playwright/test";

/* 1.0.39 (lo que quedaba de la revisión independiente de Fable sobre la 1.0.38). */

/* La letra por defecto del navegador (no el zoom): Chrome, «Tamaño de fuente». */
async function letraDelNavegador(page: Page, px: number) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: px, fixed: px - 3 } });
}
const desborde = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
/* Imprimir como el botón o Ctrl+P: `imprimiendo` en <html> (beforeprint) y el PDF en A4. */
async function caras(page: Page) {
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

test.describe("1.0.39 · papel", () => {
  test("una situación que cabe en una cara no deja una segunda en blanco", async ({ page }) => {
    await page.goto("/#/consultar/situacion/rm");
    await expect(page.locator("h1").first()).toBeVisible();
    await page.waitForTimeout(500);
    expect(await caras(page)).toBe(1);
  });

  test("en papel, sin el alto de una pantalla ni el relleno de la barra del móvil", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/rm");
    await expect(page.locator("h1").first()).toBeVisible();
    await page.emulateMedia({ media: "print" });
    const m = await page.evaluate(() => ({
      lienzo: getComputedStyle(document.querySelector(".lienzo")!).minHeight,
      relleno: getComputedStyle(document.querySelector("main > .pantalla-in")!).paddingBottom,
    }));
    expect(m).toEqual({ lienzo: "0px", relleno: "0px" });
  });

  test("«Véase también» y «Del mismo tema» no salen en papel", async ({ page }) => {
    await page.goto("/#/preguntas/f32");
    await expect(page.locator("h1")).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("section[aria-label='Del mismo tema']")).toBeHidden();
    await page.goto("/#/consultar/situacion/rm");
    await expect(page.locator("h1").first()).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await expect(page.locator("section[aria-label='Véase también']")).toBeHidden();
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  });

  test("Resumen de Sistemas en papel: sin los accesos de la ficha ni la Elección", async ({
    page,
  }) => {
    await page.goto("/#/sistemas");
    await expect(page.locator("h1")).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("nav[aria-label^='Ficha de ']").first()).toBeHidden();
    await expect(
      page.getByRole("link", { name: /Elección del sistema por características/ }),
    ).toBeHidden();
    const partidas = await page.evaluate(
      () =>
        [...document.querySelectorAll("article.tarjeta-sistema")].filter(
          (x) => getComputedStyle(x).breakInside !== "avoid",
        ).length,
    );
    expect(partidas).toBe(0);
  });

  test("Interrupción en papel: cada camino entero y el tercer caso a todo el ancho", async ({
    page,
  }) => {
    await page.goto("/#/consultar/interrupcion");
    await expect(page.locator("h1")).toBeVisible();
    await page.emulateMedia({ media: "print" });
    const m = await page.evaluate(() => {
      const ol = document.querySelector("#interrupcion-no-programada > ol")!;
      // El tercero, en su propia fila y a lo ancho de las dos columnas (su texto sigue limitado a
      // la medida de lectura).
      const [a, b, c] = [...ol.children].map((x) => x.getBoundingClientRect());
      return {
        columnas: getComputedStyle(ol).gridTemplateColumns.split(" ").length,
        tercero:
          getComputedStyle(ol.children[2]).gridColumn === "1 / -1" &&
          Math.round(c.left) === Math.round(a.left) &&
          c.top >= Math.max(a.bottom, b.bottom) &&
          c.width > a.width,
        caminos: [...document.querySelectorAll(".pantalla-interrupcion section")].every(
          (x) => getComputedStyle(x).breakInside === "avoid",
        ),
      };
    });
    expect(m).toEqual({ columnas: 2, tercero: true, caminos: true });
  });
});

test.describe("1.0.39 · direcciones y pestañas", () => {
  for (const [ruta, texto] of [
    ["/#/sistemas/mm780/parametros/extra", "esa parte final de la dirección no lleva a nada"],
    ["/#/consultar/situacion/rm/extra", "esa parte final de la dirección no lleva a nada"],
    ["/#/sobre/xyz", "no hay ninguna sección con ese nombre"],
    ["/#/mas/xyz", "no hay ninguna sección con ese nombre"],
    ["/#/visual/objetivos-mcg/xyz", "no hay nada con ese nombre en este diagrama"],
    ["/#/visual/ejercicio/xyz", "no hay nada con ese nombre en este diagrama"],
  ] as const)
    test(`dirección que no existe: ${ruta}`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole("status").filter({ hasText: texto })).toBeVisible();
    });

  test("direcciones válidas, sin aviso", async ({ page }) => {
    for (const ruta of [
      "/#/visual/gestacion-sistemas/camaps",
      "/#/sistemas/mm780/parametros",
      "/#/sobre",
      "/#/buscar/UI%2Fkg",
    ]) {
      await page.goto(ruta);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(
        page.getByRole("status").filter({ hasText: /no hay|no lleva a nada/ }),
        ruta,
      ).toHaveCount(0);
    }
  });

  test("títulos de pestaña: comparación, ficha sin pestaña, hoja sin hoja y no encontrada", async ({
    page,
  }) => {
    for (const [ruta, titulo] of [
      ["/#/sistemas/todos/parametros", /^Sistemas AID · Parámetros ·/],
      ["/#/sistemas/todos/ajuste", /^Sistemas AID · Ajuste práctico ·/],
      ["/#/sistemas/mm780+camaps/modos", /^Sistemas AID · Modos y funciones ·/],
      ["/#/sistemas", /^Sistemas AID · (?!Par)/],
      ["/#/sistemas/mm780", /^MiniMed 780G · Cómo funciona ·/],
      ["/#/sistemas/ciq", /^Tandem Control-IQ.* · Cómo funciona ·/],
      ["/#/pacientes/hoja", /^Material para el paciente ·/],
      ["/#/xyz", /^Pantalla no encontrada ·/],
      ["/#/capitulo/xyz", /^Pantalla no encontrada ·/],
    ] as const) {
      await page.goto(ruta);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page, ruta).toHaveTitle(titulo);
    }
  });

  test("«Esa pantalla no existe»: la vuelta a la portada mide 44 px de alto", async ({ page }) => {
    await page.goto("/#/xyz");
    const alto = await page
      .getByRole("link", { name: "Volver a la portada" })
      .evaluate((x) => x.getBoundingClientRect().height);
    expect(alto).toBeGreaterThanOrEqual(44);
  });
});

test.describe("1.0.39 · escritorio y letra ampliada", () => {
  test("el pie de la barra lateral no se sale en las pantallas de lectura", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    for (const ruta of ["/#/capitulo/07-educacion/b5", "/#/sistemas/mm780"]) {
      await page.goto(ruta);
      await expect(page.locator("h1").first()).toBeVisible();
      const sale = await page.evaluate(() => {
        const barra = document.querySelector(".barra-lateral")!;
        const pie = barra.lastElementChild!;
        const derecha = barra.getBoundingClientRect().right;
        return Math.max(
          0,
          ...[...pie.querySelectorAll("*")].map((x) => x.getBoundingClientRect().right - derecha),
        );
      });
      expect(sale, ruta).toBeLessThanOrEqual(0.5);
    }
  });

  for (const [ancho, alto, px] of [
    [393, 851, 32],
    [320, 640, 24],
  ] as const)
    test(`${ancho} px con ${px} px de letra: la ficha, sin solapes ni desbordes`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: ancho, height: alto });
      await page.goto("/#/");
      await letraDelNavegador(page, px);
      for (const ruta of [
        "/#/sistemas/mm780",
        "/#/sistemas/ciq/esencial",
        "/#/sistemas/camaps/parametros",
        "/#/sistemas/elegir",
        "/#/consultar/inicio/inicio::respaldo",
        "/#/capitulo/07-educacion/b5",
      ]) {
        await page.goto(ruta);
        await expect(page.locator("h1").first()).toBeVisible();
        await page.waitForTimeout(400);
        expect(await desborde(page), ruta).toBeLessThanOrEqual(0);
        const solapes = await page.evaluate(() => {
          const h = document.querySelector("main h1")!.getBoundingClientRect();
          return [...document.querySelectorAll("main button, main a")].filter((e) => {
            const r = e.getBoundingClientRect();
            if (!r.width || e.closest(".sr-only")) return false;
            const x = Math.min(h.right, r.right) - Math.max(h.left, r.left);
            const y = Math.min(h.bottom, r.bottom) - Math.max(h.top, r.top);
            return x > 1 && y > 1;
          }).length;
        });
        expect(solapes, ruta).toBe(0);
      }
    });

  test("con la letra normal, las cifras con su unidad siguen sin partirse", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/#/sistemas/ciq/esencial");
    await expect(page.locator("h1").first()).toBeVisible();
    const partidas = await page.evaluate(
      () =>
        [...document.querySelectorAll(".pieza")].filter(
          (x) => getComputedStyle(x).whiteSpace !== "nowrap",
        ).length,
    );
    expect(partidas).toBe(0);
  });
});
