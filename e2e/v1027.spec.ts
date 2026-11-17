import { expect, test, type Page } from "@playwright/test";

/* 1.0.27 (auditoría de navegación de la 1.0.26): Atrás entre vistas devuelve la posición (P1), sin
   entrada muerta tras «Más» o la paleta (P2), el foco nunca en el documento (P3) y «tabla 3» lleva a
   la Tabla 3 (P4). Las pestañas se pulsan sin que Playwright desplace la página (van pegadas arriba
   y el lector las pulsa donde está). */
const pulsar = (page: Page, sel: string) =>
  page
    .locator(sel)
    .locator("visible=true")
    .first()
    .evaluate((e) => (e as HTMLElement).click());
const enfocado = (page: Page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    return !a || a === document.body ? "BODY" : (a.textContent ?? "").trim();
  });

test.describe("1.0.27 · posición al volver entre vistas", () => {
  test("ficha: Atrás a «Modos» vuelve donde se leía y con el foco en su pestaña", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/sistemas/ciq/modos");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(300);
    const antes = await page.evaluate(() => Math.round(window.scrollY));
    expect(antes).toBeGreaterThan(400);
    await pulsar(page, 'nav[aria-label="Sección"] a[href$="/preguntas"]');
    await expect(page).toHaveURL(/ciq\/preguntas$/);
    await page.goBack();
    await expect(page).toHaveURL(/ciq\/modos$/);
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 3000 })
      .toBeGreaterThan(antes - 5);
    await expect.poll(() => enfocado(page)).toMatch(/^Modos/);
  });

  test("Fases → Cálculo → Atrás: Fases en su sitio y el foco en «Fases»", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/inicio/preparacion");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);
    const antes = await page.evaluate(() => Math.round(window.scrollY));
    await pulsar(page, 'main button:text-is("Cálculo")');
    await expect(page).toHaveURL(/calculadora/);
    await page.goBack();
    await expect(page).toHaveURL(/preparacion$/);
    await expect
      .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 3000 })
      .toBeGreaterThan(antes - 5);
    await expect.poll(() => enfocado(page)).toBe("Fases");
  });

  test("descarga: Atrás de un paso a otro, el foco en el paso activo", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/consultar/descarga/1");
    for (const n of [2, 3])
      await page
        .locator(`nav[aria-label="Pasos de la descarga"] li:nth-child(${n}) button`)
        .locator("visible=true")
        .click();
    await expect(page).toHaveURL(/descarga\/3$/);
    await page.goBack();
    await expect(page).toHaveURL(/descarga\/2$/);
    await expect.poll(() => enfocado(page)).toMatch(/^2/);
  });

  test("índice de Tablas → Tabla 3: arriba y con el foco en el título", async ({ page }) => {
    await page.goto("/#/consultar/tablas");
    await page.locator('main a[href="#/consultar/tablas/T3"]').first().click();
    await expect(page).toHaveURL(/tablas\/T3$/);
    await expect.poll(() => enfocado(page)).toBe("Tablas del capítulo");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe("1.0.27 · diálogos e historial", () => {
  test("paleta → resultado: una sola pulsación de Atrás vuelve a la pantalla de antes", async ({
    page,
  }) => {
    await page.goto("/#/");
    await page.goto("/#/sistemas/ciq");
    await expect(page.locator("h1")).toBeVisible();
    const largo = await page.evaluate(() => history.length);
    await page.keyboard.press("/");
    await page.keyboard.type("cetonas");
    const primero = page.locator('[role="dialog"] a[href^="#/"]').first();
    await expect(primero).toBeVisible();
    await primero.click();
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page).not.toHaveURL(/sistemas\/ciq$/);
    expect(await page.evaluate(() => history.length)).toBe(largo + 1);
    await page.goBack();
    await expect(page).toHaveURL(/sistemas\/ciq$/);
    await expect.poll(() => enfocado(page)).not.toBe("BODY");
    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
  });

  test("Esc sigue cerrando la paleta sin dejar entrada", async ({ page }) => {
    await page.goto("/#/sistemas/ciq");
    await expect(page.locator("h1")).toBeVisible();
    const largo = await page.evaluate(() => history.length);
    await page.keyboard.press("/");
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => history.state?.mseenDialogo ?? null)).toBeNull();
    expect(await page.evaluate(() => history.length)).toBeLessThanOrEqual(largo + 1);
  });

  test("Adelante del navegador: el foco no se queda en el documento", async ({ page }) => {
    await page.goto("/#/");
    await page.locator('main a[href="#/sistemas/ciq"]').first().click();
    await expect(page).toHaveURL(/sistemas\/ciq$/);
    await page.goBack();
    await expect(page).toHaveURL(/#\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/sistemas\/ciq$/);
    await expect.poll(() => enfocado(page)).not.toBe("BODY");
  });
});

test.describe("1.0.27 · buscar referencias", () => {
  test("paleta: «tabla 3» e Intro abren la Tabla 3", async ({ page }) => {
    await page.goto("/#/sistemas/ciq");
    await expect(page.locator("h1")).toBeVisible();
    // 1.0.32: la tecla «/» puede llegar antes de que la página la atienda (1 de cada 5).
    await expect(async () => {
      if (!(await page.getByRole("dialog").isVisible())) await page.keyboard.press("/");
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
    }).toPass();
    await page.keyboard.type("tabla 3");
    await expect(
      page.locator('[role="dialog"] a[href="#/consultar/tablas/T3"]').first(),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T3$/);
  });

  test("Buscar: Intro deja el foco en la caja; «pacientes camaps» ofrece su plan", async ({
    page,
  }) => {
    await page.goto("/#/buscar");
    const caja = page.locator("#buscar-q");
    await caja.fill("pacientes camaps");
    await expect(page.locator('main a[href="#/pacientes/plan/camaps"]').first()).toBeVisible();
    await caja.press("Enter");
    await expect(caja).toBeFocused();
  });
});
