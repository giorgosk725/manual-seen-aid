import { expect, test } from "@playwright/test";

/* 28.ª ronda (1.0.22): lo necesario para 9,5 de los seis perfiles. */
test.describe("Ronda 28 · tablas", () => {
  test("visual: la pleca de la fila de destino se ve en nocturno (acento claro)", async ({
    page,
  }) => {
    await page.goto("/#/consultar/tablas/T4::2");
    await page.evaluate(() => document.documentElement.classList.add("night"));
    const th = page.locator(".tabla-capitulo tbody tr.fila-resaltada > th").first();
    await expect(th).toBeVisible();
    const sombra = await th.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(sombra).toContain("rgb(240, 168, 196)");
  });

  test("senior: la Tabla 5 en papel conserva la columna «Paso» estrecha", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T5");
    await page.emulateMedia({ media: "print" });
    const th = page.locator('.tabla-capitulo[data-tabla="T5"] thead th').first();
    expect((await th.boundingBox())!.width).toBeLessThan(60);
  });

  test("senior: el selector de filas de la Tabla 5 dice el elemento de cada paso", async ({
    page,
  }) => {
    await page.goto("/#/consultar/tablas/T5::2");
    const sel = page.locator("#filtro-T5");
    await expect(sel.locator("option").first()).toHaveText(
      "Todas las filas · marcada: 3 · Control global y exposición glucémica",
    );
    await expect(sel.locator("option").nth(1)).toHaveText(
      "1 · Uso, representatividad de los datos y funcionamiento del sistema",
    );
  });

  test("R3: la descarga abre la Tabla 3 con la fila que toca; Atrás tras «Ver la ficha» conserva el marcado", async ({
    page,
  }) => {
    await page.goto("/#/consultar/descarga/6");
    const enlace = page.getByRole("link", { name: /Ajuste de los parámetros por sistema/ });
    await expect(enlace).toHaveAttribute("href", "#/sistemas/todos/ajuste:2");
    await enlace.click();
    await expect(page.locator(".tabla-capitulo tbody tr.fila-resaltada > th")).toContainText(
      "Ratio insulina/hidratos de carbono",
    );
    // «Los cuatro» › Tandem › «Ver la ficha» › Atrás: Tandem sigue marcado y la columna sola.
    await page.goto("/#/sistemas/todos/ajuste");
    const tandem = page
      .getByRole("group", { name: "Sistemas" })
      .getByRole("button", { name: /Tandem/ });
    await tandem.click();
    await expect(tandem).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("link", { name: "Ver la ficha" }).click();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\//);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/todos\/ajuste$/);
    await expect(tandem).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".tabla-capitulo thead th")).toHaveCount(2);
  });

  test("adjunto: la fuente «Tabla 4» de una situación con sistema lleva a su fila", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/sueno:control-iq");
    await expect(page.getByRole("link", { name: /^Tabla 4, pp/ }).first()).toHaveAttribute(
      "href",
      "#/consultar/tablas/T4:control-iq:2",
    );
  });
});

test.describe("Ronda 28 · filas, buscador, calculadora, ingreso", () => {
  test("senior y visual: las filas-enlace llevan chevron; en Hipoglucemia van a lo ancho y enlazan Boost/Ease-off", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/visual/hipoglucemia");
    const fila = page.locator("main a.fila").first();
    await expect(fila).toBeVisible();
    const chevron = await fila.evaluate((el) => getComputedStyle(el, "::after").borderRightWidth);
    expect(parseFloat(chevron)).toBeGreaterThanOrEqual(1);
    const anchos = await fila.evaluate((el) => {
      const li = el.closest("li")!;
      return [li.getBoundingClientRect().width, li.parentElement!.getBoundingClientRect().width];
    });
    expect(Math.abs(anchos[0] - anchos[1])).toBeLessThan(2);
    await expect(page.locator('main a[href="#/preguntas/f91"]')).toBeVisible();
    // El chevron no entra en el nombre accesible.
    await expect(page.getByRole("link", { name: "Hipoglucemia nocturna" })).toBeVisible();
  });

  test("R1 y adjunto: Buscar «ease off», «sensor caducado» y «husos horarios»", async ({
    page,
  }) => {
    await page.goto("/#/buscar");
    const main = page.locator("main");
    await page.locator("#buscar-q").fill("ease off hipoglucemia");
    await page.keyboard.press("Enter");
    await expect(main).toContainText("¿para qué sirven Boost y Ease-off?");
    await page.locator("#buscar-q").fill("sensor caducado 780g");
    await page.keyboard.press("Enter");
    await expect(main).toContainText("Pérdidas de señal y salidas del modo automático");
    await expect(main).toContainText("El sensor pierde la señal");
    await page.locator("#buscar-q").fill("husos horarios");
    await page.keyboard.press("Enter");
    await expect(main).toContainText("El capítulo no trata los husos horarios");
    await expect(main.locator("details > div.max-w-3xl")).toHaveCount(0);
  });

  test("R5: cambio de sistema con lo necesario para iniciar; riesgo de hipoglucemia explica la regla del 1800", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    await page.getByRole("button", { name: "Otro sistema AID" }).click();
    await page
      .getByRole("radiogroup", { name: "Sistema actual" })
      .getByRole("radio", { name: /Omnipod/ })
      .click();
    const caja = page.getByRole("region", { name: "Parámetros que actúan en el modo automático" });
    await expect(caja).toContainText("necesario para iniciar el modo automático: peso, DTD");
    await expect(caja).toContainText("tasa basal");
    await page.goto("/#/consultar/inicio/calculadora:minimed-780g");
    await page.getByRole("button", { name: /^MDI/ }).click();
    await page.getByRole("button", { name: "Riesgo de hipoglucemia" }).click();
    await expect(page.locator("main")).toContainText("se parte de la regla del 1800");
    await page.getByRole("button", { name: "Regla del 1700" }).click();
    await expect(page.locator("main")).not.toContainText("se parte de la regla del 1800");
  });

  test("R1: ingreso con Omnipod 5, la conducta general es la primera tarjeta", async ({ page }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:omnipod-5");
    const bloque = page.getByRole("region", { name: "Sistema a sistema" });
    await expect(bloque.locator(".tarjeta").first()).toContainText(
      "Puede mantenerse el modo automático del AID; en personas en ayunas",
    );
  });
});
