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

test.describe("Primera visita a un enlace profundo", () => {
  /* El QR de una hoja abre, por ejemplo, #/pacientes/resumen en un móvil que nunca ha
     visitado la app: el script de arranque pide ya el trozo de esa pantalla, a la vez que la
     entrada. Se comprueba que precarga justo el trozo que la pantalla usa (si App.tsx cambia
     una ruta de pantalla y vite.config.ts no, esto falla). */
  const CASOS = [
    ["#/pacientes/resumen", "Pacientes"],
    ["#/consultar/situacion/rm", "Recorridos"],
    ["#/consultar/figura-3", "Consultar"],
    ["#/sistemas/ciq", "Sistemas"],
    ["#/visual", "Visual"],
    ["#/bibliografia", "Otras"],
  ] as const;
  const PANTALLAS = /\/assets\/(Consultar|Recorridos|Otras|Sistemas|Visual|Pacientes)-/;
  for (const [ruta, pantalla] of CASOS) {
    test(`${ruta} → ${pantalla}`, async ({ browser }) => {
      // Contexto nuevo y sin service worker: de verdad la primera visita.
      const ctx = await browser.newContext({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      await page.goto(`/${ruta}`);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      const r = await page.evaluate((fuente) => {
        const re = new RegExp(fuente);
        return {
          precargados: [...document.querySelectorAll("link[data-arranque]")].map(
            (l) => (l as HTMLLinkElement).href,
          ),
          // Antes de la precarga en reposo (que espera 2 s tras la carga).
          cargados: performance
            .getEntriesByType("resource")
            .map((e) => e.name)
            .filter((n) => re.test(n)),
        };
      }, PANTALLAS.source);
      expect(
        r.precargados.some((h) => h.includes(`/assets/${pantalla}-`)),
        ruta,
      ).toBe(true);
      expect(
        r.cargados.map((n) => n.match(PANTALLAS)![1]),
        ruta,
      ).toEqual([pantalla]);
      await ctx.close();
    });
  }
  test("la portada y los apartados no precargan nada", async ({ browser }) => {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    for (const ruta of ["#/", "#/capitulo/07-educacion"]) {
      await page.goto(`/${ruta}`);
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      expect(await page.locator("link[data-arranque]").count(), ruta).toBe(0);
    }
    await ctx.close();
  });
});
