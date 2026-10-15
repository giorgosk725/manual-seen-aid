/* Entrega 2 del plan del 9-10-2026 (docs/PLAN_2026-10-09.md): tablas por la pregunta que
   responden, selección de sistemas en la ruta y ficha de sistema por secciones. */
import { expect, test } from "@playwright/test";

test.describe("Tablas y sistemas", () => {
  test("Parámetros por sistema: los cuatro en la Tabla 3; marcar uno abre su ficha", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/parametros");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sistemas");
    await expect(page.getByRole("link", { name: "Parámetros", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await page
      .getByRole("group", { name: "Sistemas" })
      .getByRole("button", { name: /Omnipod 5/ })
      .click();
    await expect(page).toHaveURL(/#\/sistemas\/op5\/parametros$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /^Parámetros · Omnipod 5/ }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /^Tabla 3, p\. \d+$/ }).first()).toHaveAttribute(
      "href",
      /#\/capitulo\/[^/]+\/b\d+$/,
    );
  });

  test("Comparar sistemas: dos marcados, la Tabla 1 con sus dos columnas; la ruta antigua redirige", async ({
    page,
  }) => {
    await page.goto("/#/consultar/comparar/minimed-780g+omnipod-5");
    await expect(page).toHaveURL(/#\/sistemas\/mm780\+op5\/esencial$/);
    const grupo = page.getByRole("group", { name: "Sistemas" });
    await expect(grupo.getByRole("button", { name: /Omnipod 5/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(grupo.getByRole("button", { name: /CamAPS/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await grupo.getByRole("button", { name: /MiniMed 780G/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/op5\/esencial$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /^Indicación y material · Omnipod 5/ }),
    ).toBeVisible();
  });

  // 0.70.0: la ficha es una sola página; la sección de la ruta es adónde se salta.
  // 0.70.0: la ficha es una sola página; la sección de la ruta es adónde se salta.
  test("la ficha es una página; el selector añade otro (comparación) o lo quita", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/op5/parametros");
    await expect(
      page.getByRole("heading", { level: 2, name: /^Parámetros · Omnipod 5/ }),
    ).toBeInViewport();
    await expect(
      page.getByRole("heading", { level: 2, name: /^Cómo funciona · Omnipod 5/ }),
    ).toHaveCount(1);
    // Arriba de la ficha, el selector está abierto.
    await page.goto("/#/sistemas/op5");
    await page.evaluate(() => window.scrollTo(0, 0));
    const grupo = page.getByRole("group", { name: "Sistemas" });
    await grupo.getByRole("button", { name: /CamAPS/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/camaps\+op5\/esencial$/);
    await expect(grupo.getByRole("button", { name: /CamAPS/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await grupo.getByRole("button", { name: /Omnipod 5/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/camaps\/esencial$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /^Indicación y material · myLoop CamAPS/ }),
    ).toBeVisible();
  });

  test("la ficha abre por «Cómo funciona», con todo en la misma página", async ({ page }) => {
    await page.goto("/#/sistemas/op5");
    await expect(
      page.getByRole("heading", { level: 2, name: /^Cómo funciona · Omnipod 5/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /^Parámetros · Omnipod 5/ }),
    ).toHaveCount(1);
  });

  test("UX07-UX08: dos sistemas, la selección se ve y queda en el enlace", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T1");
    const grupo = page.getByRole("group", { name: "Filtrar por sistema" });
    await grupo.getByRole("button", { name: /MiniMed 780G/ }).click();
    await grupo.getByRole("button", { name: /Omnipod 5/ }).click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T1:minimed-780g\+omnipod-5$/);
    await expect(page.getByText("Viendo MiniMed 780G y Omnipod 5")).toBeVisible();
    // Abierto en otra pestaña (sin preferencias locales), el enlace trae la misma selección.
    const otra = await page.context().newPage();
    await otra.goto("/#/consultar/tablas/T1:minimed-780g+omnipod-5");
    await expect(otra.getByText("Viendo MiniMed 780G y Omnipod 5")).toBeVisible();
    await grupo.getByRole("button", { name: "Los cuatro" }).click();
    await expect(page).toHaveURL(/#\/consultar\/tablas\/T1$/);
    await expect(page.getByText(/^Viendo /)).toHaveCount(0);
  });

  test("UX14: el enlace a los parámetros de un sistema abre esa sección", async ({ page }) => {
    await page.goto("/#/sistemas/ciq/parametros");
    const titulo = page.getByRole("heading", { level: 2, name: /^Parámetros · Tandem Control-IQ/ });
    await expect(titulo).toBeInViewport();
    await expect(page.getByRole("link", { name: "Parámetros", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("la ficha separa lo esencial y los parámetros, sin la ampliación (A06)", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/mm780/completa");
    for (const h of [/^Indicación y material · MiniMed 780G/, /^Parámetros · MiniMed 780G/])
      await expect(page.getByRole("heading", { level: 2, name: h })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Ampliación técnica · fuera del capítulo/ }),
    ).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2, name: /^Situaciones/ })).toHaveCount(0);
    // Situaciones vive en un solo sitio: desde la ficha se abre con el sistema ya elegido.
    await page.locator('a[href="#/consultar/situacion/:minimed-780g"]').first().click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/:minimed-780g$/);
    await page.getByRole("button", { name: /Ejercicio aeróbico planificado/ }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/ejercicio-aerobico:minimed-780g$/);
  });
});
