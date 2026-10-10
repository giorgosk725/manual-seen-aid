/* Criterios de elección (0.24.0, renombrada en la 0.25.0): los criterios van en la ruta; cada sistema enseña la celda literal
   de la Tabla 1 y su veredicto; las variantes (Control-IQ / Control-IQ+) se distinguen. */
import { expect, test } from "@playwright/test";

test.describe("Criterios de elección", () => {
  test("edad 4 y gestación: Control-IQ fuera, Control-IQ+ cumple, Omnipod 5 fuera; la ruta guarda los criterios", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/elegir");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Criterios de elección");
    await page.getByLabel(/^Edad/).fill("4");
    await page.getByLabel("Gestación o planificación gestacional").check();
    await expect(page).toHaveURL(/#\/sistemas\/elegir\/edad:4\+gestacion$/);
    const resultado = page.getByRole("region", { name: "Resultado por sistema" });
    const ciq = resultado.getByRole("listitem").filter({ hasText: "Tandem Control-IQ" });
    await expect(ciq.getByText("Control-IQ: fuera del criterio").first()).toBeVisible();
    await expect(ciq.getByText("Control-IQ+: dentro del criterio").first()).toBeVisible();
    await expect(ciq.getByText("Clínicos y regulatorios")).toBeVisible();
    await expect(ciq.getByText(/de 2/)).toHaveCount(0);
    await expect(
      ciq.getByText("Control-IQ: ≥ 6 años, peso 25–140 kg, DTD 10–100 UI/día"),
    ).toBeVisible();
    const op5 = resultado.getByRole("listitem").filter({ hasText: "Omnipod 5" });
    await expect(op5.getByText("Sin autorización").first()).toBeVisible();
    await expect(op5.getByText(/Coincide en/)).toHaveCount(0);
    // El formulario sigue abierto mientras se edita; «Ver resultados» lo pliega.
    await expect(page.getByLabel("Gestación o planificación gestacional")).toBeVisible();
    await page.getByRole("button", { name: "Ver resultados" }).click();
    await expect(page.getByLabel("Gestación o planificación gestacional")).toBeHidden();
    // Un enlace con los mismos criterios reproduce el resultado.
    await page.goto("/#/sistemas/elegir/edad:4+gestacion+formato:pod");
    // Con criterios en la ruta el formulario llega plegado: se abre para comprobarlo.
    const formulario = page.locator("details").filter({ hasText: "Factores clínicos" });
    if (!(await formulario.getAttribute("open"))) await formulario.locator("summary").click();
    await expect(page.getByLabel(/^Edad/)).toHaveValue("4");
    await expect(page.getByRole("button", { name: "Pod sin tubo", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Borrar criterios" }).click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
  });

  test("se llega desde la portada y desde Sistemas", async ({ page }) => {
    await page.goto("/#/");
    await page
      .getByRole("main")
      .getByRole("link", { name: /^Criterios de elección/ })
      .click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
    await page.goto("/#/sistemas");
    await page.getByRole("link", { name: /^Criterios de elección/ }).click();
    await expect(page).toHaveURL(/#\/sistemas\/elegir$/);
  });
});
