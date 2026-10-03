import { test, expect, type Page } from "@playwright/test";

/* El build tal como se publica (vite preview, puerto 4186) con su service worker: el lector
   que vuelve abre sin conexión las pantallas perezosas, busca y ve las figuras. */

/* Primera visita, espera a que el SW controle la página y deja la red cortada. */
async function instalarYCortar(page: Page) {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15000 })
    .toBe(true);
  // Que el precache termine (todas las pantallas y el índice de búsqueda).
  await page.waitForTimeout(1500);
  await page.context().setOffline(true);
}

test.describe("Producción con service worker", () => {
  test("sin conexión: pantallas perezosas y figuras", async ({ page }) => {
    await instalarYCortar(page);
    for (const [ruta, titulo] of [
      ["#/consultar/figura-3/naranja", /Cetonemia paso a paso/],
      ["#/sistemas/ciq", /Tandem Control-IQ/],
      ["#/pacientes/informacion", /Tratamiento insulínico/],
      ["#/visual/gestacion-sistemas", /Gestación, sistema a sistema/],
      ["#/bibliografia", /Bibliografía/],
    ] as const) {
      await page.goto(`/${ruta}`);
      await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(titulo);
    }
    // Las figuras originales (WebP) salen del precache sin red.
    for (const f of ["figura-1", "figura-2", "figura-3", "infografia"]) {
      const r = await page.evaluate(async (n) => {
        const res = await fetch(`./figuras/${n}.webp`);
        return {
          ok: res.ok,
          tipo: res.headers.get("content-type"),
          bytes: (await res.blob()).size,
        };
      }, f);
      expect(r.ok, f).toBe(true);
      expect(r.bytes, f).toBeGreaterThan(50000);
    }
  });

  test("sin conexión: la búsqueda (índice perezoso) responde en la paleta y en Buscar", async ({
    page,
  }) => {
    await instalarYCortar(page);
    await page.goto("/#/");
    await page.keyboard.press("Control+k");
    await page.getByRole("textbox", { name: "Buscar en el capítulo" }).fill("resonancia 780G");
    await expect(page.getByRole("link", { name: /Resonancia magnética/ }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await page.goto("/#/buscar/glargina");
    await expect(page.getByText(/en el capítulo/).first()).toBeVisible();
  });
});
