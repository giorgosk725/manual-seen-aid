/* Consultas sin respuesta (0.31.0): cuando una búsqueda no encuentra ningún pasaje ni pregunta
   frecuente, la app manda solo su texto a /api/sin-respuesta, una vez; con respuesta, nada. */
import { expect, test } from "@playwright/test";

test.describe("Consultas sin respuesta", () => {
  test("una búsqueda sin respuesta se registra una vez, solo con su texto", async ({ page }) => {
    const cuerpos: string[] = [];
    await page.route("**/api/sin-respuesta", async (route) => {
      cuerpos.push(route.request().postData() ?? "");
      await route.fulfill({ status: 204 });
    });
    await page.goto("/#/buscar/zzzz%20qqqq%20wwww");
    await expect(page.getByText(/no parece tratar/)).toBeVisible();
    await expect.poll(() => cuerpos.length, { timeout: 10000 }).toBe(1);
    expect(JSON.parse(cuerpos[0])).toEqual({ q: "zzzz qqqq wwww", i: false });
    // Volver a escribir lo mismo no lo manda otra vez.
    await page.getByLabel("Texto a buscar").fill("zzzz qqqq wwww ");
    await page.waitForTimeout(2600);
    expect(cuerpos.length).toBe(1);
  });

  test("una búsqueda con respuesta no se registra", async ({ page }) => {
    let llamadas = 0;
    await page.route("**/api/sin-respuesta", async (route) => {
      llamadas++;
      await route.fulfill({ status: 204 });
    });
    await page.goto("/#/buscar/cetonas%201,2");
    await expect(page.getByText(/Figura 3/).first()).toBeVisible();
    await page.waitForTimeout(2600);
    expect(llamadas).toBe(0);
  });

  test("la lista pide una clave y avisa si no vale", async ({ page }) => {
    await page.route("**/api/sin-respuesta", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: '{"error":"clave"}' }),
    );
    await page.goto("/#/sobre/consultas");
    await page.getByLabel("Clave de lectura").fill("clave-que-no-vale-0000");
    await page.getByRole("button", { name: "Ver la lista" }).click();
    await expect(page.getByRole("alert")).toContainText(/clave incorrecta/);
  });
});
