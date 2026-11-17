import { expect, test } from "@playwright/test";

/* 1.0.32 (revisión de Fable de la 1.0.31): lupa con flechas por las sugerencias «Pregunta»,
   «Fase completa»/«Plegar» con su estado y «Volver a la consulta» desde la autoevaluación. */
test.describe("1.0.32 · remates", () => {
  test("la lupa: ↓ pasa por las sugerencias «Pregunta»", async ({ page }) => {
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    const caja = page.locator("#paleta-q");
    await caja.fill("TIR");
    const pregunta = page.getByRole("dialog").getByRole("button", { name: /Pregunta$/ });
    await expect(pregunta.first()).toBeVisible();
    await caja.press("ArrowDown");
    await expect(pregunta.first()).toBeFocused();
  });

  test("«Fase completa» dice si la fase está desplegada", async ({ page }) => {
    await page.goto("/#/consultar/inicio/primeros-meses:omnipod-5");
    const boton = page.getByRole("button", { name: /^(Fase completa|Plegar)$/ });
    const antes = await boton.getAttribute("aria-expanded");
    expect(["true", "false"]).toContain(antes);
    await boton.click();
    await expect(page.getByRole("button", { name: /^(Fase completa|Plegar)$/ })).toHaveAttribute(
      "aria-expanded",
      antes === "true" ? "false" : "true",
    );
  });

  test("desde la autoevaluación, el capítulo ofrece «Volver a la consulta»", async ({ page }) => {
    await page.goto("/#/test");
    await page.locator("main ol > li.tarjeta").nth(0).getByRole("button").first().click();
    const pagina = page.locator("main a.pagina-badge").first();
    await expect(pagina).toBeVisible();
    await pagina.click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    const volver = page.getByRole("button", { name: /Volver a la consulta/ });
    await expect(volver).toBeVisible();
    await volver.click();
    await expect(page).toHaveURL(/#\/test/);
  });
});
