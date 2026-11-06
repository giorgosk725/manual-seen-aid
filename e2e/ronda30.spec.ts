import { expect, test } from "@playwright/test";

/* 30.ª ronda (1.0.24): lo necesario para 9,5 de los seis perfiles. */
test.describe("Ronda 30 · situaciones", () => {
  test("R1: ingreso con la condición entera y enlace a los criterios; tarjetas por filas", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:omnipod-5");
    const bloque = page.getByRole("region", { name: "Sistema a sistema" });
    const tarjetas = bloque.locator("dl > div");
    await expect(tarjetas.first()).toContainText(
      "Cuando no existen contraindicaciones, puede mantenerse el modo automático",
    );
    await expect(
      tarjetas.first().getByRole("link", { name: /Criterios para no continuar/ }),
    ).toHaveAttribute("href", "#/capitulo/10-situaciones/b36");
    // Por filas: la general a lo ancho; debajo, objetivo y pod en la misma fila.
    const [b, c] = [await tarjetas.nth(1).boundingBox(), await tarjetas.nth(2).boundingBox()];
    expect(Math.abs(b!.y - c!.y)).toBeLessThan(2);
    expect(c!.x).toBeGreaterThan(b!.x + 100);
    // Un solo estilo de rótulo: el de la tarjeta del objetivo, visible.
    await expect(tarjetas.nth(1).locator("dt")).toBeVisible();
  });

  test("R1: enfermedad intercurrente con la Figura 3 arriba y la Tabla 4 en su fila", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/enfermedad-intercurrente:control-iq");
    await expect(page.getByRole("link", { name: /Con sospecha de cetosis/ })).toHaveAttribute(
      "href",
      "#/consultar/figura-3",
    );
    await expect(page.getByRole("link", { name: /^Tabla 4, pp/ }).first()).toHaveAttribute(
      "href",
      "#/consultar/tablas/T4:control-iq:3",
    );
  });

  test("adjunto: Rx sin la vuelta desde intravenosa; el nombre de la pauta es el enlace", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/rx:camaps");
    const main = page.locator("main");
    await expect(main).not.toContainText("insulina intravenosa");
    // El nombre de la pauta, enlace en su sitio: la frase no lo repite detrás.
    const umbral = page.locator("p", { hasText: "aproximadamente 1 h" }).first();
    await expect(umbral.getByRole("link")).toHaveCount(1);
    expect(((await umbral.textContent()) ?? "").split("Interrupción del sistema").length).toBe(2);
    await page.goto("/#/consultar/situacion/cirugia-larga:camaps");
    await expect(page.locator("main")).toContainText("insulina intravenosa");
  });

  test("R3: Atrás desde una situación abierta con el botón devuelve el foco a ese botón", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/situacion");
    const boton = page.locator('[data-origen="situacion-rm"]:visible');
    await boton.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/situacion\/rm/);
    await page.goBack();
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.getAttribute("data-origen")))
      .toBe("situacion-rm");
  });

  test("visual: una situación en papel, sin selector ni «Véase también»", async ({ page }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:minimed-780g");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("button", { name: "Los cuatro" })).toBeHidden();
    await expect(page.getByRole("region", { name: "Véase también" }).first()).toBeHidden();
    await expect(page.locator("style[data-cabecera-impresa]")).toHaveCount(1);
  });
});

test.describe("Ronda 30 · buscador, tablas, preguntas y calculadora", () => {
  test("R1, R3, senior y adjunto: consultas nuevas", async ({ page }) => {
    await page.goto("/#/buscar");
    const main = page.locator("main");
    const buscar = async (q: string) => {
      await page.locator("#buscar-q").fill(q);
      await page.keyboard.press("Enter");
    };
    await buscar("se ha caído el sensor 780g");
    await expect(main).toContainText("rige el perfil basal programado");
    await buscar("boost fiebre");
    await expect(main).toContainText("Enfermedad intercurrente y riesgo de cetosis");
    await buscar("tbr 54");
    await expect(main).toContainText("¿Qué objetivos de TIR, TBR y TAR hay que buscar?");
    await expect(main).toContainText("< 54 mg/dl por debajo del 1 %");
    await buscar("qué cambia control-iq+");
    await expect(main).toContainText("¿Qué diferencia hay entre Control-IQ y Control-IQ+?");
    await buscar("vuelo largo camaps");
    await expect(main).toContainText("ni los viajes largos");
    await expect(main).not.toContainText("El capítulo no trata «vuelo»");
    await buscar("tir objetivo");
    await expect(main).toContainText("El TBR es el indicador prioritario de seguridad");
  });

  test("R3: de la Tabla 3 a la 4 con los sistemas marcados", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T3:control-iq+omnipod-5");
    await expect(page.getByRole("link", { name: /^Tabla 4/ })).toHaveAttribute(
      "href",
      "#/consultar/tablas/T4:control-iq+omnipod-5",
    );
  });

  test("visual: Preguntas en papel a dos columnas; en el móvil, el tema debajo", async ({
    page,
  }) => {
    await page.goto("/#/preguntas");
    await page.emulateMedia({ media: "print" });
    const temas = page.locator(".temas-preguntas").first();
    expect(await temas.evaluate((el) => getComputedStyle(el).columnCount)).toBe("2");
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("searchbox", { name: "Filtrar preguntas" }).fill("cetonas");
    const fila = page.getByRole("list", { name: "Preguntas que coinciden" }).locator("a").first();
    const anchoPregunta = await fila
      .locator("span > span")
      .first()
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(anchoPregunta).toBeGreaterThan(250);
    await expect(
      page.getByRole("button", { name: /Plegar los temas|Ver todas las preguntas/ }),
    ).toHaveCount(0);
  });

  test("R5: pulsar la regla ya marcada no deja «modificado»; la hoja del traslado con el aviso abajo", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:minimed-780g");
    await page.getByRole("button", { name: /^MDI/ }).click();
    await page.getByRole("button", { name: "Regla del 1700" }).first().click();
    await expect(page.locator("main")).not.toContainText("modificado");
    await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
    await page.getByRole("button", { name: "Otro sistema AID" }).click();
    await page
      .getByRole("radiogroup", { name: "Sistema actual" })
      .getByRole("radio", { name: /780G/ })
      .click();
    await page.getByRole("button", { name: /Sí: se traslada tal cual/ }).click();
    await page.getByLabel("DTD", { exact: false }).first().fill("40");
    await page.getByLabel("Peso", { exact: true }).fill("70");
    await page.goto("/#/consultar/inicio/hoja:omnipod-5");
    const hoja = page.locator(".hoja-inicio");
    await expect(hoja).toContainText("La del sistema actual (*)");
    await expect(hoja).toContainText("(*) Revisar antes de trasladar: en MiniMed 780G");
  });
});

test.describe("Ronda 30 · verificación de la 1.0.24", () => {
  test("navegación: de la descarga bajada a la Tabla 3, «Volver» y la fila a la vista", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/descarga/6");
    const enlace = page.getByRole("link", { name: /Ajuste de los parámetros por sistema/ });
    await enlace.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 120));
    await enlace.click();
    await expect(page).toHaveURL(/ajuste:2$/);
    const volver = page.locator(".volver-pegado");
    await expect(volver).toBeVisible();
    const fila = page.locator(".tabla-capitulo tr.fila-resaltada").first();
    await expect
      .poll(async () => {
        const v = await volver.boundingBox();
        const f = await fila.boundingBox();
        return !!v && !!f && v.y >= 0 && f.y + f.height <= 768;
      })
      .toBe(true);
  });

  test("navegación: Atrás a Buscar no deja el foco en el campo", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("husos horarios");
    await page.keyboard.press("Enter");
    await page.locator("a.abrir").first().click();
    await expect(page).not.toHaveURL(/#\/buscar/);
    await page.goBack();
    await expect(page.locator("#buscar-q")).toHaveValue("husos horarios");
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).not.toBe("buscar-q");
  });

  test("diseño: Tabla 6 con enlace en línea, rótulos en minúscula y selector fuera del papel; ingreso con la general a lo ancho", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto("/#/consultar/situacion/rx:omnipod-5");
    const enlace = page.locator("p", { hasText: "aproximadamente 1 h" }).first().getByRole("link");
    expect(await enlace.evaluate((el) => getComputedStyle(el).display)).toBe("inline");
    await expect(enlace).toContainText("«Interrupción del sistema y pauta alternativa»");
    const dt = page.locator("#conducta-situacion .tarjeta > dt").first();
    expect(await dt.evaluate((el) => getComputedStyle(el).textTransform)).toBe("none");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("button", { name: "Los cuatro" })).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:omnipod-5");
    const dl = page.getByRole("region", { name: "Sistema a sistema" }).locator("dl").first();
    const anchos = await dl.evaluate((el) => [
      el.getBoundingClientRect().width,
      (el.firstElementChild as HTMLElement).getBoundingClientRect().width,
    ]);
    expect(Math.abs(anchos[0] - anchos[1])).toBeLessThan(2);
  });
});
