/* El buscador pone primero el recurso pedido («Abrir …») cuando la consulta lo nombra, encima
   de los pasajes; y no avisa de «ninguna palabra» cuando ya hay una respuesta pertinente. */
import { expect, test } from "@playwright/test";

test.describe("Buscador: primero el recurso pedido", () => {
  test("«ejemplo de descarga» abre el ejemplo comentado antes que los pasajes", async ({
    page,
  }) => {
    await page.goto("/#/buscar/ejemplo de descarga");
    const abrir = page.getByRole("list", { name: "Abrir" });
    await expect(abrir.getByRole("link").first()).toContainText("Ejemplo comentado");
    const main = page.getByRole("main");
    const yAbrir = await abrir.evaluate((el) => el.getBoundingClientRect().top);
    const yPasaje = await main
      .getByRole("heading", { name: /Pasaje del capítulo|Coincidencia parcial|Pregunta frecuente/ })
      .first()
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(yAbrir).toBeLessThan(yPasaje);
  });

  test("«parámetros de Omnipod 5» abre la sección Parámetros de su ficha", async ({ page }) => {
    await page.goto("/#/buscar/parámetros de Omnipod 5");
    const abrir = page.getByRole("list", { name: "Abrir" });
    await expect(abrir.getByRole("link", { name: /Parámetros · Omnipod 5/ })).toHaveAttribute(
      "href",
      "#/sistemas/op5/parametros",
    );
  });
});

test.describe("Buscar con más mano (0.28.0)", () => {
  test("sugerencias mientras se escribe y seguimiento «y en Omnipod 5»", async ({ page }) => {
    await page.goto("/#/buscar");
    const caja = page.getByRole("textbox", { name: "Texto a buscar" });
    await caja.fill("hipogl");
    const sugerencias = page.getByRole("list", { name: "Sugerencias" });
    await expect(sugerencias.getByRole("button").first()).toBeVisible();
    await sugerencias.getByRole("button").first().click();
    await expect(page.getByRole("region", { name: "Pregunta frecuente" })).toBeVisible();
    await caja.fill("hipoglucemia nocturna 780G");
    await expect(
      page.getByRole("heading", { name: /Pregunta frecuente|Pasaje del capítulo/ }).first(),
    ).toBeVisible();
    await caja.fill("y en Omnipod 5");
    await expect(page.getByText(/Entendido como «hipoglucemia nocturna/)).toBeVisible();
  });

  test("una fila por sistema se cambia de sistema dentro de la tarjeta", async ({ page }) => {
    await page.goto("/#/buscar/modo sueño");
    const chips = page.getByRole("group", { name: "Sistema de la casilla" }).first();
    await expect(chips).toBeVisible();
    await chips.getByRole("button", { name: "Omnipod 5" }).click();
    await expect(chips.getByRole("button", { name: "Omnipod 5" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByRole("link", { name: "Ver en la ficha del sistema" }).first(),
    ).toHaveAttribute("href", /omnipod-5|op5/);
  });

  test("la Figura 3 cambia de tramo en la tarjeta y ofrece la hoja de cetonas", async ({
    page,
  }) => {
    await page.goto("/#/buscar/cetonas 0,8");
    const tramos = page.getByRole("group", { name: "Tramo de β-OHB" });
    await expect(tramos).toBeVisible();
    await tramos.getByRole("button", { name: /≥3/ }).click();
    await expect(page.getByText(/cetoacidosis/i).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Hoja para el paciente: cetonas/ }).first(),
    ).toBeVisible();
  });
});
