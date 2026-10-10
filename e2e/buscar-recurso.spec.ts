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
