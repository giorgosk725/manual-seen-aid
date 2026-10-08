/* Auditoría de uso del 4-10-2026 (0.10.0): lo que se corrigió, para que no vuelva. */
import { expect, test } from "@playwright/test";

test.describe("Uso 0.10.0", () => {
  test("paleta: Intro abre la respuesta y ↓ recorre los enlaces", async ({ page }) => {
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.keyboard.press("Control+k");
    const caja = page.getByRole("textbox", { name: "Buscar en el capítulo" });
    await caja.fill("cetonas 1,2");
    const dialogo = page.getByRole("dialog");
    await expect(dialogo.getByRole("region", { name: "Pasaje del capítulo" })).toBeVisible();
    await caja.press("ArrowDown");
    await expect(dialogo.getByRole("link", { name: /^Ver (en|la) / })).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(caja).toBeFocused();
    await caja.press("Enter");
    await expect(page).toHaveURL(/#\/consultar\/figura-3\/naranja/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("«Ver en el apartado» lleva a la frase y la resalta", async ({ page }) => {
    await page.goto("/#/buscar/cu%C3%A1nto%20tiempo%20puedo%20estar%20desconectado");
    const respuesta = page.getByRole("region", { name: "Pasaje del capítulo" });
    await expect(respuesta).toContainText("a partir de aproximadamente 1 h");
    await respuesta
      .getByRole("link", { name: /^Ver (en|la) / })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\/07-educacion\/b\d+~\d+$/);
    // La frase queda resaltada (API de resaltados) y a la vista.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const h = (CSS as unknown as { highlights?: Map<string, Iterable<Range>> }).highlights;
          const r = h?.get("frase-citada");
          if (!r) return "";
          const rango = [...r][0];
          const caja = rango.getBoundingClientRect();
          return caja.top >= 0 && caja.top < window.innerHeight ? rango.toString() : "fuera";
        }),
      )
      .toContain("a partir de aproximadamente 1 h");
  });

  test("sin respuesta directa: «Coincidencia parcial en el capítulo»", async ({ page }) => {
    await page.goto("/#/buscar/coste-efectividad%20AID");
    await expect(
      page.getByRole("region", { name: "Coincidencia parcial en el capítulo" }),
    ).toContainText("no depende únicamente del coste del dispositivo");
    await expect(page.getByRole("region", { name: "Pasaje del capítulo" })).toHaveCount(0);
  });

  test("sin resultados: propone las situaciones de «¿Qué necesitas?»", async ({ page }) => {
    await page.goto("/#/buscar/zzzz%20qqqq");
    const aviso = page.getByRole("status").filter({ hasText: "No hay resultados en el capítulo" });
    await expect(aviso).toBeVisible();
    await expect(aviso.getByRole("link", { name: "Cetonemia (Figura 3)" })).toBeVisible();
  });

  test("la nota del asterisco es la de su tabla", async ({ page }) => {
    await page.goto("/#/buscar/par%C3%A1metros%20modo%20autom%C3%A1tico%20control%20iq");
    const respuesta = page.getByRole("region", { name: "Pasaje del capítulo" });
    await expect(respuesta).toContainText("Parámetro con efecto directo sobre el algoritmo");
    await expect(respuesta).not.toContainText("Dosis orientativas para personas adultas");
  });

  test("Iniciar un sistema: «Siguiente» lleva al principio de la fase nueva", async ({ page }) => {
    await page.goto("/#/consultar/inicio/preparacion");
    await page.getByRole("button", { name: "Siguiente" }).click();
    await expect(page).toHaveURL(/inicio\/inicio$/);
    const titulo = page.getByRole("heading", { name: /Inicio del sistema/ });
    await expect(titulo).toBeInViewport();
    await expect(page.locator("#paso-inicio")).toBeFocused();
    // Índice de la fase: va a la reducción de la DTD al pasar de MDI.
    await page
      .getByRole("navigation", { name: "En esta fase" })
      .getByRole("button", { name: /Reducción de la DTD al pasar de MDI/ })
      .click();
    await expect(
      page.getByRole("heading", { name: /Reducción de la DTD al pasar de MDI/ }),
    ).toBeInViewport();
  });

  test("Revisar la descarga: «Paso 2» lleva al principio del paso", async ({ page }) => {
    await page.goto("/#/consultar/descarga/1");
    await page.getByRole("button", { name: "Paso 2" }).click();
    await expect(page.locator("#paso-descarga")).toBeFocused();
    await expect(page.locator("#paso-descarga h2")).toBeInViewport();
  });

  test("el primer Tab ofrece saltar al contenido", async ({ page }) => {
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.keyboard.press("Tab");
    const salto = page.getByRole("button", { name: "Saltar al contenido" });
    await expect(salto).toBeFocused();
    await salto.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("la portada dice qué es y lleva a repasar y al test", async ({ page }) => {
    await page.goto("/#/");
    await expect(
      page.getByText("no es producto sanitario ni publicación oficial de la SEEN"),
    ).toBeVisible();
    const aprender = page.getByRole("region", { name: "Repasar y autoevaluarse" });
    await expect(aprender.getByRole("link", { name: /Tarjetas de repaso/ })).toBeVisible();
    await expect(aprender.getByRole("link", { name: /Autoevaluación/ })).toBeVisible();
  });

  test("test: al terminar, resultado y «Volver a empezar»", async ({ page }) => {
    await page.goto("/#/test");
    await expect(page.getByText(/^Pregunta 1$/)).toBeVisible();
    const preguntas = page.locator("ol > li").filter({ has: page.getByText(/^Pregunta \d+$/) });
    const n = await preguntas.count();
    for (let i = 0; i < n; i++) await preguntas.nth(i).getByRole("button").first().click();
    await expect(
      page.getByRole("heading", { name: new RegExp(`Resultado: \\d+ de ${n}`) }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Volver a empezar" }).click();
    await expect(page.getByText(`Respondidas 0 de ${n}`)).toBeVisible();
  });

  test("las cifras del apartado llevan a su frase", async ({ page }) => {
    await page.goto("/#/capitulo/08-iniciacion");
    await page.getByRole("link", { name: /48 h/ }).first().click();
    await expect(page).toHaveURL(/08-iniciacion\/b\d+$/);
  });
});

test.describe("Uso 0.10.0 a 320 px", () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test("un apartado no desborda a lo ancho", async ({ page }) => {
    await page.goto("/#/capitulo/07-educacion");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(320);
  });
});
