import { test, expect } from "@playwright/test";

/* 1.0.2 · decimonovena ronda de auditorías (sobre la 1.0.1). */

test.describe("Ronda 19", () => {
  test("tablet: al bajar por la tabla, su cabecera con los sistemas sigue a la vista", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/#/sistemas/todos/ajuste");
    const th = page.locator(".tabla-capitulo thead th").nth(1);
    await expect(th).toBeVisible();
    await page.evaluate(() => {
      const t = document.querySelector(".tabla-capitulo")!;
      window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + 400);
    });
    const visible = await th.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.left + 20, r.top + 10));
    });
    expect(visible).toBe(true);
  });

  test("pantalla Tablas a 768 y 1024 px: ninguna tabla se desplaza ni corta celdas", async ({
    page,
  }) => {
    for (const w of [768, 1024]) {
      await page.setViewportSize({ width: w, height: 900 });
      for (const t of ["T1", "T3", "T4", "T5", "T6"]) {
        await page.goto(`/#/consultar/tablas/${t}`);
        const caja = page.locator(".tabla-scroll").first();
        await expect(caja).toBeVisible();
        expect(await caja.evaluate((c) => c.scrollWidth - c.clientWidth), `${t} a ${w}`).toBe(0);
      }
    }
  });

  test("Gestación con Control-IQ: el objetivo del algoritmo, no configurable", async ({ page }) => {
    await page.goto("/#/consultar/situacion/gestacion:control-iq");
    await expect(
      page
        .getByText("Control-IQ / Control-IQ+: Objetivo fijo no configurable (Tabla 3)")
        .filter({ visible: true }),
    ).toBeVisible();
  });

  test("Interrupción: primero los casos, después el formato", async ({ page }) => {
    await page.goto("/#/consultar/interrupcion");
    const y = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
    const programada = await y("#interrupcion-programada");
    const pod = await y("text=Desconexión en la ficha:");
    expect(programada).toBeLessThan(pod);
  });

  test("Buscar: «ease-off» lleva a CamAPS FX y «programar 780g» a su programación", async ({
    page,
  }) => {
    await page.goto("/#/buscar/ease-off");
    await expect(page.locator('main a[href="#/sistemas/camaps/modos"]').first()).toBeVisible();
    await page.goto("/#/buscar/programar%20780g");
    await expect(
      page.getByText("Programación inicial en MiniMed 780G (Cálculo inicial)"),
    ).toBeVisible();
  });

  test("ficha en el ordenador: «Comparar» en la fila de los sistemas", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/#/sistemas/ciq");
    const grupo = page.getByRole("radiogroup", { name: "Sistemas" });
    const [a, b] = await Promise.all([
      grupo.getByRole("radio", { name: /Omnipod 5/ }).boundingBox(),
      grupo.getByRole("button", { name: "Comparar" }).boundingBox(),
    ]);
    expect(Math.abs(a!.y - b!.y)).toBeLessThan(4);
  });
});
