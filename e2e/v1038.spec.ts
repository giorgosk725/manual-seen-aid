import { expect, test, type Page } from "@playwright/test";

/* 1.0.38 (revisión independiente de Fable sobre la 1.0.37). */

/* La letra por defecto del navegador (no el zoom): Chrome, «Tamaño de fuente». */
async function letraDelNavegador(page: Page, px: number) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: px, fixed: px - 3 } });
}
const desborde = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test.describe("1.0.38 · navegación", () => {
  test("Sistemas: el Resumen es una pestaña más (ni sube ni lleva el foco al título)", async ({
    page,
  }) => {
    // A 393 px, la tira de pestañas se queda pegada arriba al bajar (la revisión: y = 600).
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/#/sistemas");
    const tira = page.locator("nav[aria-label='Sección']");
    await expect(tira).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 600 }));
    await page.waitForTimeout(400);
    const pulsar = async (texto: string) => {
      const c = (await tira.locator("a", { hasText: texto }).boundingBox())!;
      expect(c.y, texto).toBeGreaterThanOrEqual(0);
      await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2);
    };
    await pulsar("Características");
    await expect(page).toHaveURL(/#\/sistemas\/todos\/esencial$/);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe("H1");
    await pulsar("Resumen");
    await expect(page).toHaveURL(/#\/sistemas$/);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe("H1");
  });

  test("recargar un apartado vuelve a la misma altura", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/#/capitulo/10-situaciones");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 4000 }));
    await page.waitForTimeout(300);
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 4000 })
      .toBeGreaterThan(3900);
  });

  for (const [ruta, texto] of [
    ["/#/sistemas/mm780/xyz", "no hay ninguna sección con ese nombre"],
    ["/#/sistemas/todos/xyz", "no hay ninguna sección con ese nombre"],
    ["/#/sistemas/mm780+xyz", "no hay ningún sistema con ese nombre"],
    ["/#/consultar/tablas/T1:xyz", "no hay ningún sistema con ese nombre en la tabla"],
    ["/#/consultar/tablas/T5:99", "la tabla no tiene esa fila"],
    ["/#/bibliografia/ref-999", "no hay ninguna referencia con ese número"],
    ["/#/consultar/inicio/xyz", "no hay ninguna fase con ese nombre"],
    ["/#/consultar/figura-3/xyz", "la Figura 3 no tiene ningún tramo con ese nombre"],
    ["/#/consultar/interrupcion/xyz", "no hay ningún caso con ese nombre"],
    ["/#/consultar/situacion/rm:xyz", "no hay ningún sistema con ese nombre"],
    ["/#/pacientes/plan/xyz", "no hay ningún plan de seguridad para ese sistema"],
  ] as const)
    test(`dirección que no existe: ${ruta}`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole("status").filter({ hasText: texto })).toBeVisible();
    });

  test("direcciones antiguas válidas, sin aviso", async ({ page }) => {
    await page.goto("/#/consultar/interrupcion/prolongada");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "no hay" })).toHaveCount(0);
  });

  test("títulos de la pestaña: la pregunta y la hoja; un plan inexistente no es «Plan»", async ({
    page,
  }) => {
    await page.goto("/#/preguntas/f91");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(/^CamAPS FX: ¿para qué sirven Boost y Ease-off\?/);
    await page.goto("/#/pacientes/hoja/cetonas");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).not.toHaveTitle(/^Hoja para el paciente ·/);
    await page.goto("/#/pacientes/plan/xyz");
    await expect(page).toHaveTitle(/^Material para el paciente/);
  });
});

test.describe("1.0.38 · letra del navegador ampliada", () => {
  for (const [ancho, alto, px, rutas] of [
    [393, 851, 24, ["/#/", "/#/capitulo/04-sistemas", "/#/bibliografia", "/#/consultar/tablas"]],
    [1280, 800, 24, ["/#/consultar/descarga/1", "/#/consultar/situacion/cirugia-larga"]],
    [1280, 800, 32, ["/#/sistemas/camaps/funciona", "/#/consultar/situacion/ingreso-hospitalario"]],
    // Segunda revisión (1.0.38): Figura 3, plan y Situaciones, también a 360 y con 200 %.
    [360, 740, 24, ["/#/consultar/figura-3", "/#/pacientes/plan/mm780", "/#/consultar/situacion"]],
    [393, 851, 32, ["/#/consultar/figura-3", "/#/pacientes/plan/mm780", "/#/consultar/situacion"]],
  ] as const)
    test(`${ancho} px con ${px} px de letra: sin desbordar`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: alto });
      await page.goto("/#/");
      await letraDelNavegador(page, px);
      for (const r of rutas) {
        await page.goto(r);
        await expect(page.locator("h1").first()).toBeVisible();
        await page.waitForTimeout(500);
        expect(await desborde(page), r).toBeLessThanOrEqual(0);
      }
    });
});

test.describe("1.0.38 · pulido", () => {
  test("la fila «Ficha:» de las tarjetas, sin puntos colgando", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/#/sistemas");
    const fila = page.getByRole("navigation", { name: /^Ficha de / }).first();
    await expect(fila).toBeVisible();
    await expect(fila).not.toContainText("·");
  });

  test("Situaciones sin resultados: los dos enlaces separados y sin la × nativa", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion");
    const filtro = page.getByRole("searchbox", { name: "Filtrar situaciones" });
    await filtro.fill("zzzz");
    const buscar = page.getByRole("link", { name: "Buscarlo en el capítulo" });
    const borrar = page.getByRole("button", { name: "Borrar el filtro" });
    await expect(buscar).toBeVisible();
    const [a, b] = [(await buscar.boundingBox())!, (await borrar.boundingBox())!];
    expect(b.y > a.y + 4 || b.x >= a.x + a.width + 12).toBe(true);
    await page.getByRole("button", { name: "Vaciar el filtro" }).click();
    await expect(filtro).toHaveValue("");
  });

  test("hojas sueltas: h1 → h2 (sin saltar a h3) y diagrama de hipoglucemia igual", async ({
    page,
  }) => {
    for (const r of ["/#/pacientes/hoja/cetonas", "/#/visual/hipoglucemia"]) {
      await page.goto(r);
      await expect(page.locator("h1")).toBeVisible();
      const niveles = await page.evaluate(() =>
        [...document.querySelectorAll("main h1, main h2, main h3, main h4")]
          .filter((h) => (h as HTMLElement).offsetParent !== null)
          .map((h) => Number(h.tagName[1])),
      );
      for (let i = 1; i < niveles.length; i++)
        expect(niveles[i] - niveles[i - 1], `${r}: ${niveles.join(",")}`).toBeLessThanOrEqual(1);
    }
  });

  test("Iniciación: los «Véase también» de cada tarea tienen nombres distintos", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/preparacion");
    await expect(page.locator("#tarea-requisitos")).toBeVisible();
    const nombres = await page
      .locator("section[aria-label^='Véase también']")
      .evaluateAll((xs) => xs.map((x) => x.getAttribute("aria-label")));
    expect(nombres.length).toBeGreaterThan(1);
    expect(new Set(nombres).size).toBe(nombres.length);
  });
});

test.describe("1.0.38 · segunda revisión", () => {
  test("con la letra ampliada, el dato de la ficha crece como su rótulo", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/#/");
    await letraDelNavegador(page, 24);
    await page.goto("/#/consultar/situacion/rm");
    await expect(page.locator("h1")).toBeVisible();
    const fijo = await page.evaluate(() => {
      const textos = [...document.querySelectorAll("main *")].filter(
        (e) => e.children.length === 0 && (e.textContent ?? "").trim().length > 3,
      );
      const pequenos = textos.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16);
      return pequenos.length / Math.max(1, textos.length);
    });
    // Con la raíz a 24 px, ningún texto de más de 3 letras debería quedarse por debajo de 16 px.
    expect(fijo).toBeLessThan(0.05);
  });

  test("cambiar la letra a media lectura mantiene el párrafo arriba", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/#/capitulo/10-situaciones");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 6000 }));
    await page.waitForTimeout(300);
    const antes = await page.evaluate(() => {
      const borde = document.querySelector("header.cabecera")!.getBoundingClientRect().bottom + 4;
      const p = [...document.querySelectorAll("main p")].find(
        (x) => x.getBoundingClientRect().bottom > borde,
      )!;
      p.setAttribute("data-prueba", "1");
      return p.getBoundingClientRect().top;
    });
    await page.getByRole("button", { name: "Letra más grande" }).click();
    await page.waitForTimeout(300);
    const despues = await page.evaluate(
      () => document.querySelector("[data-prueba]")!.getBoundingClientRect().top,
    );
    expect(Math.abs(despues - antes)).toBeLessThan(40);
  });

  for (const [ruta, texto] of [
    ["/#/consultar/tablas/T5::99", "la tabla no tiene esa fila"],
    ["/#/consultar/inicio/inicio::xyz", "esta fase no tiene ninguna tarea ni paso"],
    ["/#/sistemas/mm780/modos:xyz", "esta sección de la ficha no tiene ninguna fila"],
    ["/#/pacientes/xyz", "no hay nada con ese nombre en el material para el paciente"],
  ] as const)
    test(`otra dirección que no existe: ${ruta}`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole("status").filter({ hasText: texto })).toBeVisible();
    });

  test("títulos de pestaña propios: situación, paso, tramo, fase y pestaña de la ficha", async ({
    page,
  }) => {
    for (const [ruta, titulo] of [
      ["/#/consultar/situacion/rm:minimed-780g", /^Resonancia magnética.* · MiniMed 780G ·/],
      ["/#/consultar/descarga/3", /^Interpretación de la descarga · Paso 3 ·/],
      ["/#/consultar/figura-3/naranja", /^Hiperglucemia y cetonemia · β-OHB 1,0/],
      ["/#/consultar/inicio/primeros-meses", /^Iniciación del sistema · /],
      ["/#/sistemas/ciq/parametros", /^Tandem Control-IQ.* · Parámetros ·/],
    ] as const) {
      await page.goto(ruta);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page, ruta).toHaveTitle(titulo);
    }
  });

  test("Atrás tras recargar vuelve a la altura de la pantalla anterior", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/#/capitulo/07-educacion");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 2000 }));
    await page.waitForTimeout(300);
    await page.goto("/#/capitulo/08-iniciacion");
    await expect(page.locator("h1")).toContainText(/Iniciación/i);
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
    await page.goBack();
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 4000 })
      .toBeGreaterThan(1900);
  });
});
