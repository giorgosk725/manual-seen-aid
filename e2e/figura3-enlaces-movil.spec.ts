import { test, expect, type Page } from "@playwright/test";

/* V54-03 · Llegar a una rama de la Figura 3 (proyecto «movil», 393 px): con pestaña nueva, con
   un enlace de la app y eligiendo el tramo, la rama («Rama de la figura») queda en la zona útil
   de la pantalla, bajo la cabecera; al volver con Atrás se restaura la posición. Se comprueban
   coordenadas: `toBeVisible` no ve si algo está fuera de la primera pantalla. */
const RAMA = "Rama de la figura";

async function enZonaUtil(page: Page) {
  const cab = page.locator("li[aria-live=polite]").getByText(RAMA);
  await expect
    .poll(
      async () => {
        const b = await cab.boundingBox();
        return b ? Math.round(b.y) : -1;
      },
      { timeout: 5000 },
    )
    .toBeGreaterThanOrEqual(40);
  const b = (await cab.boundingBox())!;
  const alto = page.viewportSize()!.height;
  expect(b.y, "la rama está arriba, no más abajo").toBeLessThan(alto * 0.4);
  // Y lo primero de la rama (su aviso o su título) también se ve, sin desplazarse.
  await expect(page.locator("li[aria-live=polite]").first()).toBeInViewport({ ratio: 0.2 });
}

for (const tramo of ["verde", "amarillo", "naranja", "rojo"]) {
  test(`pestaña nueva en #/consultar/figura-3/${tramo}: la rama a la vista`, async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
    const page = await ctx.newPage();
    await page.goto(`/#/consultar/figura-3/${tramo}`);
    await enZonaUtil(page);
    await ctx.close();
  });
}

test("eligiendo el tramo con los botones, la rama a la vista", async ({ page }) => {
  await page.goto("/#/consultar/figura-3");
  await page
    .getByRole("group", { name: "Tramo de cetonemia" })
    .getByRole("button", { name: /^β-OHB 1,0-2,9/ })
    .click();
  await expect(page).toHaveURL(/figura-3\/naranja$/);
  await enZonaUtil(page);
});

test("con un enlace de la app a una rama, y Atrás restaura la posición", async ({ page }) => {
  await page.goto("/#/");
  await page.evaluate(() => {
    const a = document.createElement("a");
    a.href = "#/consultar/figura-3/amarillo";
    a.textContent = "ir a la rama";
    a.id = "enlace-prueba";
    document.querySelector("main")!.prepend(a);
  });
  await page.locator("#enlace-prueba").click();
  await enZonaUtil(page);
  const y = await page.evaluate(() => window.scrollY);
  expect(y).toBeGreaterThan(200);
  await page
    .getByRole("navigation", { name: "Barra inferior" })
    .getByRole("link", { name: "Inicio" })
    .click();
  await expect(page).toHaveURL(/#\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/figura-3\/amarillo$/);
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 3000 })
    .toBeGreaterThan(y - 40);
});
