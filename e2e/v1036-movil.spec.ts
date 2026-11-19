import { expect, test, type Page } from "@playwright/test";

/* 1.0.36 (revisión independiente de Fable sobre la 1.0.35, P2): a 320–340 px había rótulos que se
   salían de su casilla o tocaban al vecino. Se mide el texto real (rangos) contra el control o la
   caja con borde que lo contiene. */
const fueraDeSuCaja = (page: Page) =>
  page.evaluate(() => {
    const out: string[] = [];
    const raiz = document.querySelector("main")!;
    const tw = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    const rango = document.createRange();
    let n: Node | null;
    while ((n = tw.nextNode())) {
      const txt = (n.textContent || "").trim();
      const e = n.parentElement;
      if (!txt || !e || !e.getClientRects().length) continue;
      const cs = getComputedStyle(e);
      if (cs.visibility === "hidden" || cs.textOverflow === "ellipsis") continue;
      const caja = e.getBoundingClientRect();
      if (caja.width <= 2 && caja.height <= 2) continue;
      rango.selectNodeContents(n);
      const rr = rango.getBoundingClientRect();
      if (!rr.width) continue;
      for (let c: Element | null = e; c && c !== raiz; c = c.parentElement) {
        const cc = getComputedStyle(c);
        const esControl =
          c.matches("a, button, label, [role=tab], [role=radio]") && cc.display !== "inline";
        const conBorde = parseFloat(cc.borderRightWidth) > 0 && parseFloat(cc.borderLeftWidth) > 0;
        if (esControl || conBorde) {
          const rc = c.getBoundingClientRect();
          const d = Math.max(rr.right - rc.right, rc.left - rr.left);
          if (d >= 1) out.push(`«${txt.slice(0, 28)}» +${Math.round(d)} px`);
          break;
        }
      }
    }
    const pagina = document.documentElement.scrollWidth - window.innerWidth;
    if (pagina > 0) out.push(`la página se desplaza ${pagina} px`);
    return [...new Set(out)];
  });

test.describe("1.0.36 · pantallas de 320–340 px", () => {
  for (const ancho of [320, 340]) {
    for (const ruta of [
      "consultar/inicio/preparacion",
      "consultar/inicio/inicio",
      "consultar/inicio/hoja",
      "consultar/inicio/calculadora",
      "pacientes",
      "pacientes/plan/ciq",
      "consultar/figura-3",
    ]) {
      test(`${ruta} a ${ancho} px: ningún rótulo se sale de su casilla`, async ({ page }) => {
        await page.setViewportSize({ width: ancho, height: 760 });
        await page.goto(`/#/${ruta}`);
        await expect(page.locator("main h1").first()).toBeVisible();
        await page.waitForTimeout(300);
        expect(await fueraDeSuCaja(page)).toEqual([]);
      });
    }
  }

  test("cálculo inicial a 320 px: «ISCI sin automatización» cabe y la cifra de la basal no se parte", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 760 });
    await page.goto("/#/consultar/inicio/calculadora");
    const grupo = page.getByRole("group", { name: "Pauta previa" });
    await expect(grupo).toBeVisible();
    const sobra = await grupo.evaluate((g) =>
      [...g.querySelectorAll("button")].map((b) => {
        const rb = b.getBoundingClientRect();
        return Math.min(
          ...[...b.querySelectorAll("span")].map((s) => {
            const r = document.createRange();
            r.selectNodeContents(s);
            return rb.right - r.getBoundingClientRect().right;
          }),
        );
      }),
    );
    for (const s of sobra) expect(s).toBeGreaterThanOrEqual(1);
    await page.locator("#calc-basal").fill("70");
    await page.locator("#calc-rapida").fill("45");
    await page.locator("#calc-peso").fill("50");
    const basal = page
      .locator("main .tarjeta")
      .filter({ has: page.locator(".rotulo", { hasText: "Tasa basal" }) })
      .first();
    await expect(basal).toBeVisible();
    const alto = await basal.evaluate((t) => {
      const valor = t.querySelector(".rotulo")!.nextElementSibling!.firstElementChild!;
      return {
        alto: valor.getBoundingClientRect().height,
        linea: parseFloat(getComputedStyle(valor).lineHeight),
      };
    });
    // Una sola línea: «≈» y el número juntos.
    expect(alto.alto).toBeLessThan(alto.linea * 1.5);
  });

  test("a 390 px, pulsar una pestaña de la barra pegada y volver con Atrás conserva la altura", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/sistemas/ciq/modos");
    const tira = page.getByRole("navigation", { name: "Sección" });
    await expect(tira).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(250);
    await tira.locator('a[href="#/sistemas/ciq/esencial"]').click();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\/esencial$/);
    await page.waitForTimeout(400);
    await page.goBack();
    await expect(page).toHaveURL(/#\/sistemas\/ciq\/modos$/);
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(700);
  });
});
