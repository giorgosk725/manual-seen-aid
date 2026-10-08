import { test, expect } from "@playwright/test";

/* Regresiones de la auditoría del 2-10-2026 (docs/AUDITORIA_2026-10-02.md). */

test.describe("Navegación e historial", () => {
  test("elegir un tramo de la Figura 3 no sube al principio ni apila historial", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 760 });
    await page.goto("/#/consultar/figura-3");
    const boton = page.getByRole("button", { name: /^β-OHB ≥3,0 mmol\/l/ });
    await boton.scrollIntoViewIfNeeded();
    const antes = await page.evaluate(() => window.scrollY);
    expect(antes).toBeGreaterThan(100);
    const largo = await page.evaluate(() => history.length);
    await boton.click();
    await expect(page).toHaveURL(/figura-3\/rojo$/);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
    expect(await page.evaluate(() => history.length)).toBe(largo);
  });

  test("Atrás desde un resultado conserva la búsqueda", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.getByLabel("Texto a buscar").fill("glargina");
    await expect(page).toHaveURL(/#\/buscar\/glargina$/);
    await page
      .getByRole("link", { name: /glargina/i })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page.getByLabel("Texto a buscar")).toHaveValue("glargina");
  });

  test("Atrás devuelve la Interrupción al tramo anterior", async ({ page }) => {
    await page.goto("/#/consultar/interrupcion/breve");
    await page.goto("/#/consultar/interrupcion/prolongada");
    await expect(page.getByRole("heading", { level: 2, name: /Prolongada/ })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { level: 2, name: "Muy breve" })).toBeVisible();
  });

  test("el enlace a una referencia la deja a la vista", async ({ page }) => {
    await page.goto("/#/bibliografia/ref-9");
    await expect(page.locator("#ref-9")).toBeInViewport();
  });

  test("una URL con «%» mal formado no rompe la app", async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(String(e)));
    await page.goto("/#/buscar/50%");
    await expect(page.getByLabel("Texto a buscar")).toBeVisible();
    expect(errores).toEqual([]);
  });
});

test.describe("Impresión", () => {
  test("el apartado impreso conserva su título y el texto nocturno sale negro", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("mseen:night", "1"));
    await page.goto("/#/capitulo/05-resultados");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const color = await page
      .locator(".prosa p")
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe("rgb(0, 0, 0)");
    // La barra lateral y la cabecera fija no se imprimen.
    await expect(page.locator(".cabecera")).toBeHidden();
  });

  test("en papel las tablas salen como tabla, no como fichas", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await page.goto("/#/capitulo/04-sistemas");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("table", { name: /Tabla 1/ })).toBeVisible();
  });
});

test.describe("Visor de imágenes", () => {
  test("la infografía se abre a pantalla completa, se amplía y se cierra con Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/#/visual");
    await page.getByRole("button", { name: /Ampliar Infografía/ }).click();
    const visor = page.getByRole("dialog", { name: "Infografía." });
    await expect(visor).toBeVisible();
    await expect(visor.getByText("100 %")).toBeVisible();
    await visor.getByRole("button", { name: "Acercar" }).click();
    await expect(visor.getByText("140 %")).toBeVisible();
    await expect
      .poll(() => visor.locator("img").evaluate((i: HTMLImageElement) => i.naturalWidth))
      .toBeGreaterThan(1000);
    await page.keyboard.press("Escape");
    await expect(visor).toBeHidden();
  });
});

/* Regresiones de la auditoría del 3-10-2026 (docs/AUDITORIA_2026-10-03.md). */
test.describe("Auditoría 0.5.0", () => {
  test("salir de un apartado abierto en un subapartado no salta ni falsea seguir leyendo", async ({
    page,
  }) => {
    await page.goto("/#/capitulo/10-situaciones/ejercicio");
    await expect(page.locator("#ejercicio")).toBeInViewport();
    await page.evaluate(() => window.scrollBy(0, 2500));
    await page.waitForTimeout(1000);
    await page
      .getByRole("navigation", { name: "Navegación principal" })
      .getByRole("link", { name: "Sistemas", exact: true })
      .click();
    await expect(page).toHaveURL(/#\/sistemas$/);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    const ultimo = await page.evaluate(() => localStorage.getItem("mseen:ultimo"));
    expect(ultimo).not.toContain("/ejercicio");
  });

  test("Ctrl+P en un apartado no imprime botones ni la versión extendida", async ({ page }) => {
    await page.goto("/#/capitulo/12-horizonte");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("button", { name: /Escuchar/ })).toBeHidden();
    await expect(page.locator("details.extendida").first()).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("las preferencias con forma inesperada no dejan la app en blanco", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("mseen:favoritos", "{}");
      localStorage.setItem("mseen:leidos", "null");
    });
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Algo ha fallado")).toHaveCount(0);
  });
});

/* Auditoría de uso del 4-10-2026 (0.6.1). */
test.describe("Auditoría 0.6.1", () => {
  test("Atrás con la paleta abierta la cierra y deja la página de debajo", async ({ page }) => {
    await page.goto("/#/");
    await page.goto("/#/consultar/figura-3");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Cetonemia");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/#\/consultar\/figura-3$/);
  });

  test("la búsqueda lleva a la herramienta: «resonancia 780G» → Situación y sistema", async ({
    page,
  }) => {
    await page.goto("/#/buscar/resonancia%20780G");
    await page
      .getByRole("link", { name: /Situación y sistema · Resonancia magnética/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/rm/);
  });
});

test.describe("Preguntas al capítulo (0.8.0)", () => {
  test("la paleta responde con la casilla del sistema nombrado", async ({ page }) => {
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.keyboard.press("Control+k");
    await page
      .getByRole("textbox", { name: "Buscar en el capítulo" })
      .fill("modo ejercicio en control iq");
    const respuesta = page.getByRole("dialog").getByRole("region", { name: "Pasaje del capítulo" });
    await expect(respuesta).toContainText("Tandem Control-IQ");
    await expect(respuesta).toContainText("rango 140–160 mg/dl");
    await respuesta.getByRole("link", { name: /^Ver (en|la) / }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/ejercicio-aerobico:control-iq/);
  });

  test("Buscar: la cifra de cetonemia lleva a su tramo y lo de fuera no consta", async ({
    page,
  }) => {
    await page.goto("/#/buscar/cetonas%201%2C2");
    const respuesta = page.getByRole("region", { name: "Pasaje del capítulo" });
    await expect(respuesta).toContainText("Cetosis significativa / probable fallo de infusión");
    await expect(respuesta).toContainText("Dosis orientativas para personas adultas");
    await page.getByRole("textbox", { name: "Texto a buscar" }).fill("precio del omnipod");
    await expect(page.getByRole("region", { name: "Pasaje del capítulo" })).toHaveCount(0);
  });

  test("la caja de la portada responde con la fila de la Tabla 6", async ({ page }) => {
    await page.goto("/#/");
    await page.getByLabel("¿Qué necesitas? Escribe lo que buscas").fill("resonancia con 780G");
    const respuesta = page.getByRole("region", { name: "Pasaje del capítulo" });
    await expect(respuesta).toContainText("Resonancia magnética (RM)");
    await expect(respuesta).toContainText("Retirar antes de entrar en la sala");
  });
});
