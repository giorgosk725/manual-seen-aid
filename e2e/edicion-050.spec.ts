/* Edición 0.50: portada y navegación. Dos entradas en la primera pantalla del móvil, un nombre
   para la lectura, «Seguir leyendo» solo con la ruta del capítulo, el PDF publicado a un toque,
   identidad propia en la cabecera, acciones principales de 44 px y foco visible en nocturno. */
import { expect, test } from "@playwright/test";

test.describe("Portada y navegación (0.50)", () => {
  // 0.70.0: la barra inferior es Inicio · Sistemas · Situaciones · Buscar · Más.
  test("móvil: la barra inferior lleva a Sistemas y Situaciones; «Más» abre el menú", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/capitulo/09-descarga");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const barra = page.getByRole("navigation", { name: "Barra inferior" });
    await expect(barra.getByRole("link")).toHaveText([
      "Inicio",
      "Sistemas",
      "Situaciones",
      "Buscar",
    ]);
    await barra.getByRole("link", { name: "Situaciones" }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion$/);
    await expect(barra.getByRole("link", { name: "Situaciones" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await barra.getByRole("button", { name: "Más" }).click();
    const menu = page.getByRole("dialog", { name: "Menú" });
    for (const n of ["Hiperglucemia y cetonemia", "Índice del capítulo", "Para el paciente"])
      await expect(menu.getByRole("link", { name: n, exact: true })).toBeVisible();
  });

  test("la lectura: «Índice del capítulo», en el menú «Leer y comprender»", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/#/capitulo");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Índice del capítulo");
    await page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("button", { name: "Más" })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Menú" }).getByText("Leer y comprender"),
    ).toBeVisible();
  });

  // 14-10-2026: «Seguir leyendo» sale de la portada (decisión del autor).
  test("la portada no lleva «Seguir leyendo»", async ({ page }) => {
    await page.goto("/#/capitulo/07-educacion");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Seguir leyendo/ })).toHaveCount(0);
  });

  test("el PDF publicado para pacientes, a un toque desde la portada", async ({ page }) => {
    await page.goto("/#/");
    const pdf = page
      .getByRole("region", { name: "¿Qué le doy al paciente?" })
      .getByRole("link", { name: "Información para pacientes", exact: true });
    await expect(pdf).toHaveAttribute("href", "pdf/manual-seen-aid-pacientes.pdf");
  });

  test("cabecera: el Manual de Endocrinología y Nutrición y «Complemento interactivo»", async ({
    page,
  }) => {
    await page.goto("/#/");
    const inicio = page
      .getByRole("link", {
        name: "Manual de Endocrinología y Nutrición, complemento interactivo: inicio",
      })
      .first();
    await expect(inicio).toBeVisible();
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
    const mapa = page.locator("section[aria-labelledby^='mapa-'] a");
    const barra = page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("link")
      .or(page.getByRole("navigation", { name: "Barra inferior" }).getByRole("button"));
    expect(await medir(mapa)).toEqual([]);
    expect(await medir(barra)).toEqual([]);
    await page
      .getByRole("navigation", { name: "Barra inferior" })
      .getByRole("button", { name: "Más" })
      .click();
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
