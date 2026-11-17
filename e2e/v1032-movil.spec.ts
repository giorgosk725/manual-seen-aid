import { expect, test } from "@playwright/test";

/* 1.0.32 en el móvil: desde la celda fuente de una ficha, la fila de destino de la Tabla 1 queda
   por debajo de «Volver a la consulta» (Fable, 1.0.31). */
test.describe("1.0.32 · fila de destino desde una ficha", () => {
  test("la fila se ve entera bajo «Volver a la consulta»", async ({ page }) => {
    test.setTimeout(90000);
    const malos: string[] = [];
    for (const [sis, ficha] of [
      ["mm780", "indicacion"],
      ["ciq", "indicacion"],
      ["op5", "parametros"],
    ]) {
      await page.goto(`/#/sistemas/${sis}/${ficha}`);
      const hrefs = await page
        .locator('a[href*="/consultar/tablas/T1:"]')
        .evaluateAll((as) => [
          ...new Set(
            (as as HTMLElement[]).filter((a) => a.offsetParent).map((a) => a.getAttribute("href")!),
          ),
        ]);
      for (const h of hrefs.filter((x) => /:\d+$/.test(x)).slice(0, 5)) {
        await page.goto(`/#/sistemas/${sis}/${ficha}`);
        const a = page.locator(`a[href="${h}"]:visible`).first();
        await a.scrollIntoViewIfNeeded();
        await a.click();
        const n = h.split(":").pop();
        const fila = page.locator(`[data-fila="${n}"]:visible`).first();
        await expect(fila).toBeFocused();
        await page.waitForTimeout(500);
        const r = await fila.evaluate((f) => {
          const v = document.querySelector(".volver-pegado")!.getBoundingClientRect().bottom;
          const b = f.getBoundingClientRect();
          return { top: b.top, v, alto: window.innerHeight };
        });
        if (r.top < r.v - 1 || r.top > r.alto - 80) malos.push(`${h}: ${JSON.stringify(r)}`);
      }
    }
    expect(malos).toEqual([]);
  });
});
