/* Consultas sin respuesta: la edición editorial no las registra (e2e/privacidad.spec.ts); queda
   la lista con clave de las ya registradas, para su responsable. */
import { expect, test } from "@playwright/test";

test.describe("Consultas sin respuesta", () => {
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
