import { expect, test } from "@playwright/test";

/* 29.ª ronda (1.0.23): lo necesario para 9,5 de los seis perfiles. */
test.describe("Ronda 29 · tablas y navegación", () => {
  test("los seis: «PASO» entero en papel; la fila de destino sin marca en papel", async ({
    page,
  }) => {
    await page.goto("/#/consultar/tablas/T5::2");
    await page.emulateMedia({ media: "print" });
    const th = page.locator('.tabla-capitulo[data-tabla="T5"] thead th').first();
    expect(await th.evaluate((el) => getComputedStyle(el).whiteSpace)).toBe("nowrap");
    const ancho = (await th.boundingBox())!.width;
    expect(ancho).toBeGreaterThan(40);
    expect(ancho).toBeLessThan(70);
    const td = page.locator(".tabla-capitulo tr.fila-resaltada > td").first();
    expect(await td.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      "rgb(255, 255, 255)",
    );
  });

  test("visual y R3: selector de la Tabla 5 corto; la fila marcada, a la vista", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/tablas/T5::2");
    await expect(page.locator("#filtro-T5 option").first()).toHaveText(
      "Todas las filas · marcada: paso 3",
    );
    const fila = page.locator(".tabla-capitulo tr.fila-resaltada").first();
    await expect(fila).toBeVisible();
    await expect
      .poll(async () => (await fila.boundingBox())!.y, { timeout: 3000 })
      .toBeLessThan(300);
  });

  // La posición solo puede conservarse si «Ver la ficha» se pulsa sin subir: en el móvil la barra
  // es fija (R3 lo vio restaurado); en escritorio hay que subir hasta la barra y la posición
  // guardada es la del momento del clic. Aquí, el marcado y la posición en Modos, en el móvil.
  test("adjunto: Atrás tras «Ver la ficha» recupera el marcado y la posición en Modos", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/sistemas/todos/modos");
    await page.getByRole("button", { name: /Elegir sistemas|Cambiar/ }).click();
    const omnipod = page
      .getByRole("group", { name: "Sistemas" })
      .getByRole("button", { name: /Omnipod/ });
    await omnipod.click();
    await expect(omnipod).toHaveAttribute("aria-pressed", "true");
    await page.evaluate(() => window.scrollTo({ top: 600 }));
    await page.waitForTimeout(400);
    const antes = await page.evaluate(() => window.scrollY);
    await page.getByRole("link", { name: "Ver la ficha" }).click();
    await expect(page).toHaveURL(/#\/sistemas\/op5\//);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/modos$/);
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 })
      .toBeGreaterThan(antes - 60);
  });

  test("adjunto: el paso 7 de la descarga abre la Tabla 3 entera y la interrupción", async ({
    page,
  }) => {
    await page.goto("/#/consultar/descarga/7");
    await expect(
      page.getByRole("link", { name: /Ajuste de los parámetros por sistema/ }),
    ).toHaveAttribute("href", "#/sistemas/todos/ajuste");
    await expect(
      page.getByRole("link", { name: /Interrupción del sistema y pauta alternativa/ }),
    ).toHaveAttribute("href", "#/consultar/interrupcion");
  });

  test("R3: el filtro de Preguntas sin coincidencias ofrece Buscar", async ({ page }) => {
    await page.goto("/#/preguntas");
    await page.getByRole("searchbox", { name: "Filtrar preguntas" }).fill("GMI");
    await expect(page.getByRole("link", { name: "Buscar «GMI» en el capítulo" })).toHaveAttribute(
      "href",
      "#/buscar",
    );
  });
});

test.describe("Ronda 29 · ingreso, calculadora y buscador", () => {
  test("visual y senior: ingreso con sistema, la general sin pleca y un solo título en la del objetivo", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:omnipod-5");
    const bloque = page.getByRole("region", { name: "Sistema a sistema" });
    const primera = bloque.locator(".tarjeta").first();
    await expect(primera).toContainText("Puede mantenerse el modo automático");
    await expect(primera).not.toHaveClass(/tarjeta-sistema/);
    const segunda = bloque.locator(".tarjeta").nth(1);
    await expect(segunda).toHaveClass(/tarjeta-sistema/);
    await expect(segunda.locator("dt")).toHaveClass(/sr-only/);
  });

  test("R5 y visual: basal a Omnipod 5 con aviso; «Para iniciar el automático» sin repetir", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
    await page.getByRole("button", { name: "Otro sistema AID" }).click();
    await page
      .getByRole("radiogroup", { name: "Sistema actual" })
      .getByRole("radio", { name: /780G/ })
      .click();
    const caja = page.getByRole("region", { name: "Parámetros que actúan en el modo automático" });
    await expect(caja).toContainText("Para iniciar el automático");
    await expect(caja).toContainText("tasa basal");
    await expect(caja).not.toContainText("Con efecto directo");
    await page.getByRole("button", { name: /Sí: se traslada tal cual/ }).click();
    await expect(page.locator("main")).toContainText(
      "Revisar antes de trasladar: en MiniMed 780G no actúa en automático y aquí se usa para iniciar el modo automático",
    );
  });

  test("R1, senior y adjunto: Buscar sin sensor, sin señal, viaje largo, ease-off y diálisis", async ({
    page,
  }) => {
    await page.goto("/#/buscar");
    const main = page.locator("main");
    const buscar = async (q: string) => {
      await page.locator("#buscar-q").fill(q);
      await page.keyboard.press("Enter");
    };
    await buscar("qué hago si se queda sin sensor");
    await expect(main).toContainText("rige el perfil basal programado");
    await expect(main).toContainText("El sensor pierde la señal");
    await buscar("cambio de sensor sin señal");
    await expect(main).toContainText("Pérdidas de señal y salidas del modo automático");
    await buscar("viaje largo omnipod");
    await expect(main).toContainText("no trata los husos horarios ni los viajes largos");
    await buscar("ease off hipoglucemia");
    await expect(main).toContainText("Ease-off en CamAPS FX");
    await buscar("fiebre camaps");
    await expect(main).toContainText("Enfermedad intercurrente");
    await expect(main).not.toContainText("Diálisis y enfermedad renal");
  });
});

test.describe("Ronda 29 · verificación visual de la 1.0.23", () => {
  test("Tablas: la fila marcada queda bajo las cabeceras pegadas, no tapada (móvil y escritorio)", async ({
    page,
  }) => {
    for (const [w, h] of [
      [390, 844],
      [1366, 768],
    ]) {
      await page.setViewportSize({ width: w, height: h });
      // Otra dirección antes: el mismo hash dos veces no navega (y la posición sería la anterior).
      await page.goto("/#/consultar/tablas");
      await page.goto("/#/consultar/tablas/T5::2");
      const fila = page
        .locator(':is(.tabla-capitulo tr.fila-resaltada, .vista-fichas [data-fila="2"]):visible')
        .first();
      await expect(fila).toBeVisible();
      await page.waitForTimeout(500);
      const tapado = await fila.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const cab = document.querySelector("header.cabecera");
        const cabBottom =
          cab && (cab as HTMLElement).offsetParent !== null
            ? cab.getBoundingClientRect().bottom
            : 0;
        const thead = el.closest("table")?.querySelector("thead");
        const theadBottom = thead ? thead.getBoundingClientRect().bottom : 0;
        return r.top < Math.max(cabBottom, theadBottom) - 1;
      });
      expect(tapado).toBe(false);
    }
  });

  test("una situación abierta no imprime la lista ni el filtro; «Abrir» lleva chevron", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:minimed-780g");
    await expect(page.getByRole("searchbox", { name: "Filtrar situaciones" })).toBeVisible();
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("searchbox", { name: "Filtrar situaciones" })).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("husos horarios");
    await page.keyboard.press("Enter");
    const abrir = page.locator("a.abrir").first();
    await expect(abrir).toBeVisible();
    expect(
      parseFloat(await abrir.evaluate((el) => getComputedStyle(el, "::after").borderRightWidth)),
    ).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Ronda 29 · verificación de navegación de la 1.0.23", () => {
  test("Preguntas sin coincidencias → Buscar con la consulta puesta", async ({ page }) => {
    await page.goto("/#/preguntas");
    await page.getByRole("searchbox", { name: "Filtrar preguntas" }).fill("husos horarios");
    await page.getByRole("link", { name: "Buscar «husos horarios» en el capítulo" }).click();
    await expect(page).toHaveURL(/#\/buscar/);
    await expect(page.locator("#buscar-q")).toHaveValue("husos horarios");
    await expect(page.locator("main")).toContainText("no trata los husos horarios");
  });

  test("desde la descarga, la Tabla 3 comparada con fila ofrece «Volver a la consulta»", async ({
    page,
  }) => {
    await page.goto("/#/consultar/descarga/6");
    await page.getByRole("link", { name: /Ajuste de los parámetros por sistema/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/ajuste:2$/);
    const volver = page.locator(".volver-pegado");
    await expect(volver).toBeVisible();
    await expect(volver).toContainText("Interpretación de la descarga");
    await volver.getByRole("button").first().click();
    await expect(page).toHaveURL(/#\/consultar\/descarga\/6$/);
  });
});
