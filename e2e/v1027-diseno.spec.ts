/* 1.0.27 (revisión visual de la 1.0.26): filas del Resumen alineadas entre tarjetas vecinas desde
   xl (decisión del autor del 15-11-2026) y los tramos de β-OHB juntos en papel. */
import { expect, test, type Page } from "@playwright/test";

const altoDe = (page: Page, sistema: string, rotulo: string) =>
  page
    .getByRole("article", { name: sistema })
    .locator("dt", { hasText: rotulo })
    .evaluate((e) => Math.round(e.getBoundingClientRect().top));

test.describe("1.0.27 · diseño", () => {
  for (const ancho of [1280, 1920]) {
    test(`Resumen a ${ancho} px: los datos de 780G y Control-IQ a la misma altura`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto("/#/sistemas/todos");
      for (const r of ["Localización del algoritmo", "Objetivo", "Bolos automáticos de corrección"])
        expect(await altoDe(page, "MiniMed 780G", r), r).toBe(
          await altoDe(page, "Tandem Control-IQ / Control-IQ+", r),
        );
    });
  }

  test("hoja de cetonas en papel: los tramos de β-OHB en la misma cara", async ({ page }) => {
    await page.goto("/#/pacientes/hoja/cetonas");
    await expect(page.locator(".hoja-tramos section")).toHaveCount(3);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.documentElement.classList.add("imprimiendo"));
    // El bloque de los tramos no se parte y cabe en una cara A4 (≈ 1123 px a 96 ppp).
    const estilo = await page
      .locator(".hoja-tramos")
      .evaluate((e) => [getComputedStyle(e).breakInside, e.getBoundingClientRect().height]);
    expect(estilo[0]).toBe("avoid");
    expect(estilo[1] as number).toBeLessThan(1000);
  });
});
