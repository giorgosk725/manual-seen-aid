/* Entrega 3 del plan del 9-10-2026 (docs/PLAN_2026-10-09.md), escritorio: siglas pulsables con
   teclado (UX05) y «Cómo funciona» de un sistema por enlace directo. */
import { expect, test } from "@playwright/test";

test.describe("Comprensión", () => {
  test("UX05: una sigla se abre con el teclado, se lee, Esc cierra y devuelve el foco", async ({
    page,
  }) => {
    await page.goto("/#/capitulo/02-componentes");
    const sigla = page.getByRole("button", { name: "MCG", exact: true });
    await sigla.focus();
    await page.keyboard.press("Enter");
    const panel = page.getByRole("dialog", { name: "Sigla MCG" });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("monitorización continua de glucosa");
    await expect(panel).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(sigla).toBeFocused();
    // Solo la primera aparición de cada sigla en el apartado es pulsable.
    await expect(page.getByRole("button", { name: "TIR", exact: true })).toHaveCount(1);
  });

  test("Cómo funciona: el enlace directo abre la sección con la casilla del sistema", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/op5/funciona");
    await expect(
      page.getByRole("heading", { level: 2, name: /^Cómo funciona · Omnipod 5/ }),
    ).toBeInViewport();
    await expect(
      page.getByRole("heading", { level: 3, name: "Sensor y señal de glucosa" }),
    ).toBeVisible();
    await expect(
      page.getByText(/^De su precisión depende la seguridad del algoritmo/),
    ).toBeVisible();
    await page.getByRole("link", { name: /Parámetros de este sistema/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/op5\/parametros$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /^Parámetros · Omnipod 5/ }),
    ).toBeInViewport();
  });

  test("un caso guiado: elegir enseña el veredicto, el comentario y las citas con enlace", async ({
    page,
  }) => {
    await page.goto("/#/casos/hiperglucemia-pod");
    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await page.getByRole("button", { name: /Otro bolo de corrección/ }).click();
    const respuesta = page.locator("#respuesta-caso");
    await expect(respuesta).toContainText("No es lo que indica el capítulo.");
    await expect(respuesta).toBeFocused();
    await expect(respuesta.getByRole("link", { name: /^Ver/ }).first()).toHaveAttribute(
      "href",
      "#/consultar/figura-3",
    );
    await page.getByRole("button", { name: /Siguiente paso/ }).click();
    await expect(page.getByText("Paso 2 de 5")).toBeVisible();
  });

  test("A13: sin resultados hay un camino por temas que abre una pregunta con sus pasajes", async ({
    page,
  }) => {
    await page.goto("/#/buscar/zzzz%20qqqq");
    await page.getByRole("link", { name: /Explorar las preguntas frecuentes por temas/ }).click();
    await expect(page).toHaveURL(/#\/preguntas$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Preguntas frecuentes" }),
    ).toBeVisible();
    // Los temas van plegados: se abre el suyo.
    await page.getByText("Educación y plan de seguridad", { exact: true }).click();
    await page.getByRole("link", { name: /¿Qué debe incluir el plan de seguridad\?/ }).click();
    const frecuente = page.getByRole("region", { name: "Pregunta frecuente" });
    await expect(frecuente).toContainText("Glucagón.");
    await expect(frecuente.getByRole("link", { name: /^Ver (en|la) / }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Del mismo tema|Preguntas frecuentes/ }).first(),
    ).toBeVisible();
  });

  test("A06: desde Parámetros, «Ver en el capítulo» abre la tabla y Atrás devuelve a la sección", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/op5/parametros");
    const seccion = page.getByRole("region", { name: /^Parámetros · Omnipod 5/ });
    await seccion.getByRole("link", { name: "Ver en el capítulo" }).last().click();
    await expect(page).toHaveURL(/#\/capitulo\/[^/]+\/b\d+$/);
    await expect(page.getByRole("heading", { level: 1 })).not.toContainText("Omnipod 5");
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/op5\/parametros$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /^Parámetros · Omnipod 5/ }),
    ).toBeInViewport();
  });

  test("Buscar encuentra el ejemplo de descarga y los casos", async ({ page }) => {
    await page.goto("/#/buscar/ejemplo%20de%20descarga");
    const caso = page.getByRole("link", { name: /Ejemplo comentado · Una descarga de 14 días/ });
    await expect(caso.first()).toBeVisible();
    await expect(caso.first()).toHaveAttribute("href", "#/casos/ejemplo-descarga");
  });
});
