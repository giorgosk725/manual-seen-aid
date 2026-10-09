/* Entrega 2 del plan del 9-10-2026 (docs/PLAN_2026-10-09.md): tablas por la pregunta que
   responden, selección de sistemas en la ruta y ficha de sistema por secciones. */
import { expect, test } from "@playwright/test";

test.describe("Tablas y sistemas", () => {
  test("Consultar ofrece las tablas por la pregunta que responden", async ({ page }) => {
    await page.goto("/#/consultar");
    await page
      .getByRole("link", { name: /¿Cómo se ajusta cada parámetro en cada sistema\?/ })
      .click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T3$/);
    await expect(page.getByText("¿Cómo se ajusta cada parámetro en cada sistema?")).toBeVisible();
  });

  test("UX07-UX08: dos sistemas, la selección se ve y queda en el enlace", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T1");
    const grupo = page.getByRole("group", { name: "Filtrar por sistema" });
    await grupo.getByRole("button", { name: /MiniMed 780G/ }).click();
    await grupo.getByRole("button", { name: /Omnipod 5/ }).click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T1:minimed-780g\+omnipod-5$/);
    await expect(page.getByText("Tabla 1 · viendo MiniMed 780G y Omnipod 5")).toBeVisible();
    // Abierto en otra pestaña (sin preferencias locales), el enlace trae la misma selección.
    const otra = await page.context().newPage();
    await otra.goto("/#/consultar/tablas/T1:minimed-780g+omnipod-5");
    await expect(otra.getByText("Tabla 1 · viendo MiniMed 780G y Omnipod 5")).toBeVisible();
    await grupo.getByRole("button", { name: "Ver todos" }).click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T1$/);
    await expect(page.getByText("Tabla 1 · los cuatro sistemas")).toBeVisible();
  });

  test("UX14: el enlace a los parámetros de un sistema abre esa sección", async ({ page }) => {
    await page.goto("/#/sistemas/ciq/parametros");
    const titulo = page.getByRole("heading", { level: 2, name: /^Parámetros · Tandem Control-IQ/ });
    await expect(titulo).toBeInViewport();
    await expect(
      page.getByRole("link", { name: /Comparar estos parámetros entre sistemas/ }),
    ).toHaveAttribute("href", "#/consultar/tablas/T3:control-iq");
    await expect(page.getByRole("link", { name: "Parámetros", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("la ficha separa lo esencial, los parámetros, las situaciones y la ampliación", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/mm780");
    for (const h of [
      /^Lo esencial · MiniMed 780G/,
      /^Parámetros · MiniMed 780G/,
      /^Situaciones · MiniMed 780G/,
    ])
      await expect(page.getByRole("heading", { level: 2, name: h })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Ampliación técnica · fuera del capítulo/ }),
    ).toBeVisible();
    // Cada situación se abre con el sistema ya elegido.
    await page
      .getByRole("region", { name: /Situaciones/ })
      .getByRole("link", { name: /Abrir con el texto que la explica/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/ejercicio-aerobico:minimed-780g$/);
  });
});
