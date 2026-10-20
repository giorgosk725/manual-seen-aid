/* Lo aprobado el 11-10 (0.37.0): «Cómo funciona» comparado por aspectos, el paso 7 del ejemplo
   con contexto y comentario desglosado, y «Cómo leer esta tabla» / «Cómo interpretar este
   hallazgo» en producción. */
import { expect, test } from "@playwright/test";
import { retirado } from "../src/edicion";

test.describe("Aprobado el 11-10 (0.37.0)", () => {
  // 0.70.0: sin «Cómo funciona» comparado (repetía la Tabla 1): esa dirección lleva a la Tabla 1.
  test("la comparación son dos pestañas; «funciona» comparado lleva a Características", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/ciq+op5/funciona");
    const secciones = page.getByRole("navigation", { name: "Sección" });
    // 0.72.1: y «Resumen» delante, para volver a las tarjetas.
    // 0.78.1: y «Modos y funciones» (la Tabla 4 de los sistemas elegidos).
    // 0.79.1: con su rótulo corto del móvil («Tabla 1», «Modos») en el mismo enlace.
    await expect(secciones.getByRole("link")).toHaveText([
      "Resumen",
      /Características$/,
      "Parámetros",
      /Modos y funciones$/,
    ]);
    await expect(page.getByRole("region", { name: "Características" })).toBeVisible();
    await secciones.getByRole("link", { name: "Resumen" }).click();
    // 0.82.1 (sexta ronda, R5): el Resumen de los dos elegidos (antes, el de los cuatro).
    await expect(page).toHaveURL(/#\/sistemas\/ciq\+op5$/);
  });

  test("paso 7 del ejemplo: contexto plegable antes de las opciones y comentario en cuatro partes", async ({
    page,
  }) => {
    test.skip(retirado("casos"), "Los casos guiados no van en esta edición (src/edicion.ts).");
    await page.goto("/#/casos/ejemplo-descarga/7");
    await expect(
      page.getByText(/Este paso se interpreta junto con los datos de comidas y bolos/),
    ).toBeVisible();
    await page.getByText("Ver datos de la cena").click();
    await expect(page.getByText(/Cena del viernes: pizza/)).toBeVisible();
    await page.getByRole("button", { name: /no identifican por sí solas la causa/ }).click();
    await expect(page.getByText("Qué observamos")).toBeVisible();
    await expect(page.getByText("Qué podemos concluir")).toBeVisible();
  });

  test("sin «Cómo leer esta tabla» ni «Cómo interpretar este hallazgo» (0.72.2)", async ({
    page,
  }) => {
    await page.goto("/#/consultar/tablas/T3");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Cómo leer esta tabla")).toHaveCount(0);
    await page.goto("/#/consultar/descarga/7");
    await expect(page.getByText("Cómo interpretar este hallazgo")).toHaveCount(0);
    await expect(page.getByText("Cómo leer esta tabla")).toHaveCount(0);
  });
});
