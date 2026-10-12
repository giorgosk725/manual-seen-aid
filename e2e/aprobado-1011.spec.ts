/* Lo aprobado el 11-10 (0.37.0): «Cómo funciona» comparado por aspectos, el paso 7 del ejemplo
   con contexto y comentario desglosado, y «Cómo leer esta tabla» / «Cómo interpretar este
   hallazgo» en producción. */
import { expect, test } from "@playwright/test";
import { retirado } from "../src/edicion";

test.describe("Aprobado el 11-10 (0.37.0)", () => {
  test("Cómo funciona comparado: cuatro aspectos, Liberty solo con CamAPS, parámetros con la selección", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/ciq+op5/funciona");
    for (const a of [
      "Dónde está el algoritmo",
      "Cómo decide y aprende",
      "Cómo administra la insulina",
      "Bolos automáticos de corrección",
    ])
      // Escritorio: fila de la cuadrícula; móvil: bloque por aspecto (0.43.0).
      await expect(
        page.getByRole("rowheader", { name: a }).or(page.getByRole("region", { name: a })),
      ).toBeVisible();
    await expect(page.getByText(/Modalidad híbrida · los cuatro sistemas/)).toBeVisible();
    await expect(page.getByText(/modalidad Liberty/)).toHaveCount(0);
    await page
      .getByRole("link", { name: /Comparar los parámetros \(objetivos y ajustes\)/ })
      .click();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\+op5\/parametros$/);
    await page.goto("/#/sistemas/camaps+op5/funciona");
    await expect(page.getByText(/modalidad Liberty/)).toBeVisible();
    // Abrir la fuente y volver conserva selección y posición.
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(400);
    const antes = await page.evaluate(() => window.scrollY);
    await page
      .getByRole("link", { name: /^Tabla 1, p\. 3$/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    // Como una persona: el capítulo se pinta y se lee antes de volver.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForTimeout(300);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/camaps\+op5\/funciona$/);
    await page.waitForTimeout(600);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - antes)).toBeLessThan(160);
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

  test("sin «Cómo leer esta tabla»; «Cómo interpretar este hallazgo» sigue en el paso 7", async ({
    page,
  }) => {
    await page.goto("/#/consultar/tablas/T3");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Cómo leer esta tabla")).toHaveCount(0);
    await page.goto("/#/consultar/descarga/7");
    await expect(page.getByText("Cómo interpretar este hallazgo")).toBeVisible();
    await expect(page.getByText("Cómo leer esta tabla")).toHaveCount(0);
  });
});
