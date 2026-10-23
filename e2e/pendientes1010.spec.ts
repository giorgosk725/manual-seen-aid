import { test, expect } from "@playwright/test";

/* 1.0.11 · los pendientes de la 23.ª ronda. */

test.describe("Pendientes de la 1.0.10", () => {
  test("ficha entera de Control-IQ: «Qué cambia» remite, sin repetir las cifras", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/ciq/completa");
    const fila = page
      .locator("dt", { hasText: "Qué cambia" })
      .filter({ visible: true })
      .first()
      .locator("..");
    await expect(fila).toContainText("Indicación y material");
    await expect(fila).not.toContainText("9–200 kg");
    await page.goto("/#/sistemas/ciq/funciona");
    const sola = page
      .locator("dt", { hasText: "Qué cambia" })
      .filter({ visible: true })
      .first()
      .locator("..");
    await expect(sola).toContainText("9–200 kg");
  });

  test("hospital: la viñeta sin repetir la franja de 70–100 mg/dl", async ({ page }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario:minimed-780g");
    const objetivos = page.getByRole("region", { name: "Objetivos de MCG" });
    await expect(objetivos).toContainText(
      "Priorizando en el hospital la prevención de hipoglucemia",
    );
    await expect(objetivos).not.toContainText("Introduce además");
  });

  test("ficha: el selector dice «Control-IQ / Control-IQ+»", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 800 });
    await page.goto("/#/sistemas/ciq");
    await expect(
      page
        .getByRole("radiogroup", { name: "Sistemas" })
        .getByRole("radio", { name: /Control-IQ\+/ }),
    ).toBeVisible();
  });

  test("plan impreso: el sistema y la página en el margen de cada cara", async ({ page }) => {
    await page.goto("/#/pacientes/plan/mm780");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.querySelector("style[data-cabecera-impresa]")?.textContent ?? "",
        ),
      )
      .toContain("Plan de seguridad · MiniMed 780G");
  });

  test("Iniciación: la fase elegida, con la receta del selector de sistemas", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#/consultar/inicio/inicio:control-iq");
    const fase = page.locator(".opciones-ligeras .chip[aria-current]").first();
    await expect(fase).toBeVisible();
    expect(await fase.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(
      "rgb(247, 239, 243)",
    );
  });
});
