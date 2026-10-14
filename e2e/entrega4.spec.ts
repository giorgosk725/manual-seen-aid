/* Entrega 4 (0.29.0): pestañas por tipo en Buscar, filtros por texto, un solo selector de
   sistema, hojas como filas, casos con progreso y «Lo último que consultaste». */
import { expect, test } from "@playwright/test";
import { retirado } from "../src/edicion";

test.describe("Listas y tarjetas (0.29.0)", () => {
  test("Buscar separa texto, tablas y figuras y fuera del capítulo en pestañas", async ({
    page,
  }) => {
    await page.goto("/#/buscar/insulina");
    const todos = page.getByTestId("todos-los-resultados");
    if (!(await todos.getAttribute("open"))) await todos.locator("summary").click();
    const tipo = page.getByRole("group", { name: "Tipo de resultado" });
    await expect(tipo.getByRole("button", { name: /^Texto del capítulo \(\d+\)/ })).toBeVisible();
    await tipo.getByRole("button", { name: /^Otros recursos/ }).click();
    await expect(page.getByText(/No es el texto del capítulo/)).toBeVisible();
  });

  test("Situaciones se filtra escribiendo", async ({ page }) => {
    await page.goto("/#/consultar/situacion");
    await page.getByRole("searchbox", { name: "Filtrar situaciones" }).fill("reson");
    const lista = page.locator("#lista-situaciones");
    await expect(lista.getByRole("button", { name: /Resonancia magnética/ })).toBeVisible();
    await expect(lista.getByRole("button", { name: /Ejercicio aeróbico/ })).toHaveCount(0);
  });

  test("Preguntas frecuentes se filtra escribiendo", async ({ page }) => {
    await page.goto("/#/preguntas");
    await page.getByRole("searchbox", { name: "Filtrar preguntas" }).fill("gestaci");
    const lista = page.getByRole("list", { name: "Preguntas que coinciden" });
    await expect(lista.getByRole("link").first()).toBeVisible();
    await expect(lista.getByRole("link").first()).toContainText(/gestaci/i);
  });

  test("el selector de sistema es el mismo en Situaciones e Iniciar", async ({ page }) => {
    await page.goto("/#/consultar/situacion/ejercicio-aerobico");
    const grupo = page.getByRole("group", { name: "Sistema" });
    await grupo.getByRole("button", { name: /Omnipod 5/ }).click();
    await expect(page).toHaveURL(/ejercicio-aerobico:omnipod-5$/);
    await expect(grupo.getByRole("button", { name: /Omnipod 5/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.goto("/#/consultar/inicio");
    await page
      .getByRole("group", { name: "Sistema" })
      .getByRole("button", { name: "CamAPS FX" })
      .click();
    await expect(page).toHaveURL(/:camaps$/);
  });

  test("un caso recuerda el paso alcanzado", async ({ page }) => {
    test.skip(retirado("casos"), "Los casos guiados no van en esta edición (src/edicion.ts).");
    await page.goto("/#/casos/hiperglucemia-pod/3");
    await expect(page.getByText(/Paso 3 de/)).toBeVisible();
    await page.goto("/#/casos");
    await expect(page.getByRole("link", { name: /Paso 3 de 5 · Continuar/ })).toBeVisible();
  });

  test("Para el paciente: las hojas son filas que abren", async ({ page }) => {
    await page.goto("/#/pacientes");
    await page.getByRole("link", { name: /Antes de una prueba o una cirugía/ }).click();
    await expect(page).toHaveURL(/#\/pacientes\/hoja\/pruebas-cirugia$/);
  });
});
