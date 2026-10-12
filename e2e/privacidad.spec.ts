/* Edición editorial, A03: la búsqueda no sale del navegador ni se guarda. Consultas sintéticas;
   ninguna llamada a /api/pasajes ni a /api/sin-respuesta; el texto no queda en la URL, ni en las
   visitas ni en las recientes; Atrás desde una fuente conserva la búsqueda (en memoria). */
import { expect, test } from "@playwright/test";

const CONSULTAS = ["zzzz qqqq wwww", "cetonas 1,2 vómitos", "modo sueño en Control-IQ"];

test.describe("Privacidad de la búsqueda", () => {
  test("cero envíos, nada en la URL ni en el almacenamiento", async ({ page }) => {
    const envios: string[] = [];
    await page.route(/\/api\/(pasajes|sin-respuesta)/, async (route) => {
      envios.push(route.request().url());
      await route.fulfill({ status: 410 });
    });
    await page.goto("/#/buscar");
    const caja = page.getByLabel("Texto a buscar");
    await expect(
      page.getByText("Busca términos del capítulo; no introduzcas datos de pacientes."),
    ).toBeVisible();
    for (const q of CONSULTAS) {
      await caja.fill(q);
      await page.waitForTimeout(2600);
      await expect(page).toHaveURL(/#\/buscar$/);
    }
    // La paleta (Ctrl K) y su Intro tampoco envían ni ponen el texto en la URL.
    await page.goto("/#/capitulo");
    await page.keyboard.press("Control+k");
    await page.getByRole("dialog").getByRole("textbox").fill("resonancia con 780G");
    await page.waitForTimeout(800);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/buscar$/);
    await expect(page.getByLabel("Texto a buscar")).toHaveValue("resonancia con 780G");
    await page.waitForTimeout(2600);
    expect(envios).toEqual([]);
    const almacen = await page.evaluate(() =>
      JSON.stringify({ ...localStorage, ...sessionStorage }),
    );
    for (const q of [...CONSULTAS, "resonancia con 780G"]) expect(almacen).not.toContain(q);
    expect(almacen).not.toContain("mseen:recientes");
    expect(await page.evaluate(() => JSON.stringify(history.state ?? ""))).not.toContain("780G");
  });

  test("Atrás desde una fuente conserva la búsqueda; la dirección antigua se limpia", async ({
    page,
  }) => {
    await page.goto("/#/buscar/glargina");
    await expect(page).toHaveURL(/#\/buscar$/);
    await expect(page.getByLabel("Texto a buscar")).toHaveValue("glargina");
    const todos = page.getByTestId("todos-los-resultados");
    if (!(await todos.getAttribute("open"))) await todos.locator("summary").click();
    await page
      .locator('a[href^="#/capitulo/"]', { hasText: /glargina/i })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page.getByLabel("Texto a buscar")).toHaveValue("glargina");
  });

  test("al arrancar se borran las búsquedas y criterios guardados por versiones anteriores", async ({
    page,
  }) => {
    await page.goto("/#/");
    await page.evaluate(() => {
      localStorage.setItem("mseen:recientes", '["cetonas 1,2"]');
      localStorage.setItem("mseen:visitas", '[{"ruta":"#/sistemas/elegir/edad:10","titulo":"x"}]');
      localStorage.setItem("mseen:letra", "1");
    });
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    const claves = await page.evaluate(() => Object.keys(localStorage));
    expect(claves).not.toContain("mseen:recientes");
    expect(claves).not.toContain("mseen:visitas");
    expect(claves).toContain("mseen:letra");
  });
});
