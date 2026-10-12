/* Edición 0.50: portada y navegación. Dos entradas en la primera pantalla del móvil, un nombre
   para la lectura, «Seguir leyendo» solo con la ruta del capítulo, el PDF publicado a un toque,
   identidad propia en la cabecera, acciones principales de 44 px y foco visible en nocturno. */
import { expect, test } from "@playwright/test";

test.describe("Portada y navegación (0.50)", () => {
  test("móvil 393 × 852: las dos entradas, en la primera pantalla", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/");
    const puertas = page.getByRole("navigation", { name: "Dos formas de uso" });
    for (const p of [
      puertas.getByRole("link", { name: /Leer y comprender/ }),
      puertas.getByRole("button", { name: /Consultar/ }),
    ]) {
      await expect(p).toBeInViewport();
      const caja = (await p.boundingBox())!;
      expect(caja.y + caja.height).toBeLessThan(852 - 56); // por encima de la barra inferior
    }
  });

  test("un nombre para la lectura: «Leer y comprender» (la barra inferior, «Leer»)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/capitulo");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leer y comprender");
    await expect(
      page.getByRole("navigation", { name: "Barra inferior" }).getByRole("link", { name: "Leer" }),
    ).toBeVisible();
  });

  test("«Seguir leyendo» guarda y enseña solo la ruta del apartado", async ({ page }) => {
    await page.goto("/#/capitulo/07-educacion/b11~4");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const guardado = await page.evaluate(() => localStorage.getItem("mseen:ultimo"));
    expect(JSON.parse(guardado!).ruta).toBe("#/capitulo/07-educacion");
    await page.goto("/#/");
    const seguir = page.getByRole("link", { name: /Seguir leyendo/ });
    await expect(seguir).toHaveAttribute("href", "#/capitulo/07-educacion");
    // Una posición antigua con ancla o con otra ruta no se enseña.
    await page.evaluate(() =>
      localStorage.setItem(
        "mseen:ultimo",
        JSON.stringify({ ruta: "#/buscar/cetonas", titulo: "x", slug: "07-educacion" }),
      ),
    );
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Seguir leyendo/ })).toHaveCount(0);
  });

  test("el PDF publicado para pacientes, a un toque desde la portada", async ({ page }) => {
    await page.goto("/#/");
    const pdf = page
      .getByRole("region", { name: "Para el paciente" })
      .getByRole("link", { name: /Información para pacientes \(PDF publicado\)/ });
    await expect(pdf).toHaveAttribute("href", "pdf/manual-seen-aid-pacientes.pdf");
  });

  test("identidad propia en la cabecera, sin el logotipo del Manual", async ({ page }) => {
    await page.goto("/#/");
    const inicio = page.getByRole("link", { name: "Complemento del capítulo 89, inicio" }).first();
    await expect(inicio).toBeVisible();
    await expect(inicio).not.toContainText("MANUAL");
  });

  test("móvil: las acciones principales miden al menos 44 px", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/");
    const medir = async (l: ReturnType<typeof page.locator>) => {
      const n = await l.count();
      const pequenos: string[] = [];
      for (let i = 0; i < n; i++) {
        const c = await l.nth(i).boundingBox();
        if (c && (c.height < 43.5 || c.width < 43.5))
          pequenos.push(`${(await l.nth(i).innerText()).slice(0, 30)} ${c.width}×${c.height}`);
      }
      return pequenos;
    };
    const puertas = page
      .getByRole("navigation", { name: "Dos formas de uso" })
      .locator("a, button");
    const mapa = page.locator("section[aria-labelledby^='mapa-'] a");
    const barra = page.getByRole("navigation", { name: "Barra inferior" }).getByRole("link");
    expect(await medir(puertas)).toEqual([]);
    expect(await medir(mapa)).toEqual([]);
    expect(await medir(barra)).toEqual([]);
    await page.getByRole("button", { name: "Menú", exact: true }).click();
    const menu = page.getByRole("dialog").getByRole("link");
    expect(await medir(menu)).toEqual([]);
  });

  test("modo nocturno: el foco se ve con un contorno claro", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("mseen:night", "1"));
    await page.goto("/#/");
    await expect(page.locator("html.night")).toHaveCount(1);
    await page.keyboard.press("Tab");
    const contorno = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const st = getComputedStyle(el);
      return { estilo: st.outlineStyle, ancho: st.outlineWidth, color: st.outlineColor };
    });
    expect(contorno.estilo).toBe("solid");
    expect(contorno.ancho).toBe("2px");
    expect(contorno.color).toBe("rgb(147, 197, 253)");
  });
});
