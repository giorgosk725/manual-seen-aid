import { expect, test } from "@playwright/test";

/* 1.0.36 (revisión independiente de Fable sobre la 1.0.35, P2): al pulsar una pestaña de la barra
   pegada de la ficha, el navegador subía la página 106 px (el control enfocado quedaba dentro del
   margen de arriba de 10 rem) y esa posición movida era la que se guardaba: Atrás entre pestañas
   no devolvía al punto de lectura. */
test.describe("1.0.36 · Atrás entre pestañas de la ficha", () => {
  test("cada pestaña vuelve a su altura con Atrás", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/#/sistemas/ciq");
    const tira = page.getByRole("navigation", { name: "Sección" });
    await expect(tira).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 250));
    await page.waitForTimeout(250);
    await tira.locator('a[href="#/sistemas/ciq/modos"]').click();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\/modos$/);
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(250);
    await tira.locator('a[href="#/sistemas/ciq/esencial"]').click();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\/esencial$/);
    await page.waitForTimeout(400);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\/modos$/);
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(700);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/ciq$/);
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(250);
  });

  test("enfocar un control de la barra pegada no mueve la página", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/#/sistemas/ciq/modos");
    await expect(page.getByRole("navigation", { name: "Sección" })).toBeVisible();
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(400);
    const movidos = await page.evaluate(() => {
      const y0 = window.scrollY;
      const out: string[] = [];
      for (const e of document.querySelectorAll<HTMLElement>(
        ".barra-pegada a, .barra-pegada button",
      )) {
        const q = e.getBoundingClientRect();
        if (!q.width || q.bottom <= 0 || q.top >= window.innerHeight) continue;
        e.focus();
        if (Math.abs(window.scrollY - y0) > 1)
          out.push(
            `${(e.textContent || "").trim().slice(0, 20)}: ${Math.round(window.scrollY - y0)}`,
          );
        window.scrollTo(0, y0);
        e.blur();
      }
      return { y0, out };
    });
    expect(movidos.y0).toBeGreaterThan(300);
    expect(movidos.out).toEqual([]);
  });
});
