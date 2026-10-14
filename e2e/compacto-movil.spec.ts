/* 0.44.0, el móvil más compacto (encargo del 12-10-2026), a 360 px (el ancho más común en
   Android): lo que iba apilado en dos o tres filas cabe en una. */
import { expect, test, type Locator } from "@playwright/test";
import { retirado } from "../src/edicion";

test.use({ viewport: { width: 360, height: 780 } });

const arriba = async (l: Locator) => Math.round((await l.boundingBox())!.y);
/* Misma fila: los centros a menos de 6 px (los bordes pueden diferir en un píxel). */
const centro = async (l: Locator) => {
  const b = (await l.boundingBox())!;
  return b.y + b.height / 2;
};
const mismaFila = async (a: Locator, b: Locator) =>
  expect(Math.abs((await centro(a)) - (await centro(b)))).toBeLessThanOrEqual(6);

test.describe("Móvil compacto (360 px)", () => {
  test("portada: sin botones en la cabecera; la lectura, en el mapa; la afiliación bajo el nombre", async ({
    page,
  }) => {
    await page.goto("/#/");
    const cabecera = page.locator("section[aria-labelledby=titulo-capitulo]");
    await expect(cabecera.getByRole("link")).toHaveCount(0);
    await expect(page.getByText(/Si prefieres entrar por tema/)).toHaveCount(0);
    const nombre = cabecera.getByText("Georgios Kyriakos", { exact: true });
    const filiacion = cabecera.getByText(/^Servicio de Endocrinología y Nutrición/);
    await expect(filiacion).toBeVisible();
    expect(await arriba(filiacion)).toBeGreaterThan(await arriba(nombre));
    const leer = page.getByRole("region", { name: "Leer y comprender" });
    await expect(leer.getByRole("link", { name: "Índice del capítulo" })).toBeVisible();
    await expect(leer.getByRole("link", { name: "Tablas" })).toBeVisible();
  });
  test("plan de seguridad: migas en una línea, los cuatro sistemas en una fila, formato e Imprimir juntos", async ({
    page,
  }) => {
    await page.goto("/#/pacientes/plan/mm780");
    const migas = page.getByRole("navigation", { name: "Hojas para el paciente" });
    await expect(migas.getByRole("link", { name: "Para el paciente" })).toBeVisible();
    expect((await migas.boundingBox())!.height).toBeLessThanOrEqual(48);
    const sistemas = page.getByRole("group", { name: "Sistema" }).getByRole("button");
    await expect(sistemas).toHaveCount(4);
    for (const i of [1, 2, 3]) await mismaFila(sistemas.nth(0), sistemas.nth(i));
    // Solo letra grande (A12): el botón de imprimir, sin selector de formato.
    await expect(page.getByRole("group", { name: "Formato de impresión" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Imprimir", exact: true })).toBeVisible();
    await expect(page.locator(".hoja-a4")).toBeInViewport();
  });

  test("leer capítulo: el índice a la vista, sin bloques delante", async ({ page }) => {
    await page.goto("/#/capitulo");
    await expect(page.getByRole("navigation", { name: "Para comprender" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /3 Algoritmos de control/i })).toBeInViewport();
  });

  /* Edición editorial (A09): Imprimir junto al título y tres enlaces debajo; «Ficha completa»
     sale de la cabecera y va al final de la ficha. */
  test("ficha de un sistema: Imprimir junto al título y tres enlaces debajo", async ({ page }) => {
    await page.goto("/#/sistemas/mm780");
    const cab = page.locator("main header").first();
    const titulo = cab.getByRole("heading", { level: 1 });
    const imprimir = cab.getByRole("button", { name: /Imprimir/ });
    // En la línea del título: sus cajas se solapan en vertical.
    const t = (await titulo.boundingBox())!;
    const im = (await imprimir.boundingBox())!;
    expect(im.y).toBeLessThan(t.y + t.height);
    expect(im.y + im.height).toBeGreaterThan(t.y);
    const iniciar = cab.getByRole("link", { name: "Preparar e iniciar" });
    await expect(iniciar).toHaveAttribute("href", "#/consultar/inicio/preparacion:minimed-780g");
    const plan = cab.getByRole("link", { name: "Plan de seguridad" });
    const situaciones = cab.getByRole("link", { name: "Situaciones" });
    for (const l of [iniciar, plan, situaciones]) await expect(l).toBeInViewport();
    expect(await arriba(iniciar)).toBeGreaterThan(await arriba(imprimir));
    // 0.70.0: la ficha es una sola página, sin «Ficha completa».
    await expect(page.getByRole("main").getByRole("link", { name: /Ficha completa/ })).toHaveCount(
      0,
    );
  });

  test("iniciar un sistema: la hoja de comprobación a mano y sin guía aparte", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    await expect(page.getByRole("button", { name: /Hoja de comprobación/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Guía paso a paso" })).toHaveCount(0);
    await expect(page.getByText(/Paso 1 de 5/)).toBeVisible();
  });
  test("el navegador no invita a instalar la app", async ({ page }) => {
    await page.goto("/#/");
    const cancelado = await page.evaluate(() => {
      const e = new Event("beforeinstallprompt", { cancelable: true });
      window.dispatchEvent(e);
      return e.defaultPrevented;
    });
    expect(cancelado).toBe(true);
  });
});

/* 0.45.0: segunda tanda («haz todo lo que consideres en esa dirección»). */
test.describe("Móvil compacto, segunda tanda (360 px)", () => {
  test("el selector de sistemas: las cuatro casillas en una fila (Sistemas, Iniciar, Tabla 4)", async ({
    page,
  }) => {
    for (const [ruta, grupo] of [
      ["/#/sistemas", "Sistemas"],
      ["/#/consultar/inicio/inicio:omnipod-5", "Sistema"],
      ["/#/consultar/tablas/T4", "Filtrar por sistema"],
    ] as const) {
      await page.goto(ruta);
      const b = page.getByRole("group", { name: grupo, exact: true }).getByRole("button");
      await expect(b.first(), ruta).toBeVisible();
      for (const i of [1, 2, 3]) await mismaFila(b.nth(0), b.nth(i));
      // Ningún nombre se sale de su casilla.
      const fuera = await b.evaluateAll((bs) =>
        bs.slice(0, 4).some((x) => {
          const n = [...x.querySelectorAll(":scope > span")]
            .filter((s) => getComputedStyle(s).display !== "none")
            .pop()!;
          const r = document.createRange();
          r.selectNodeContents(n);
          return [...r.getClientRects()].some((c) => c.right > x.getBoundingClientRect().right);
        }),
      );
      expect(fuera, ruta).toBe(false);
    }
  });

  test("cetonemia: los cuatro tramos en 2 × 2", async ({ page }) => {
    await page.goto("/#/consultar/figura-3");
    const t = page
      // El único selector de tramo (V50-06: sin el atajo repetido de arriba).
      .getByRole("group", { name: "Tramo de cetonemia" })
      .getByRole("button");
    await expect(t).toHaveCount(4);
    await mismaFila(t.nth(0), t.nth(1));
    await mismaFila(t.nth(2), t.nth(3));
  });

  test("revisar la descarga: «Paso n de 8» y el selector en una fila", async ({ page }) => {
    await page.goto("/#/consultar/descarga/3");
    await mismaFila(
      page.getByText("Paso 3 de 8"),
      page.getByRole("combobox", { name: "Cambiar paso" }),
    );
  });

  test("apartado: páginas e Imprimir / PDF en una fila", async ({ page }) => {
    await page.goto("/#/capitulo/07-educacion");
    await mismaFila(
      page.locator("main header .pagina-badge").first(),
      page
        .locator("main header")
        .first()
        .getByRole("button", { name: /Imprimir/ }),
    );
  });

  test("comparación de sistemas: Imprimir junto al título", async ({ page }) => {
    await page.goto("/#/sistemas/todos/funciona");
    await mismaFila(
      page.getByRole("heading", { level: 1, name: "Sistemas AID" }),
      page.getByRole("button", { name: /Imprimir/ }),
    );
  });

  test("casos guiados: «Empezar» en la línea de los datos", async ({ page }) => {
    test.skip(retirado("casos"), "Los casos guiados no van en esta edición (src/edicion.ts).");
    await page.goto("/#/casos");
    const tarjeta = page.getByRole("link", { name: /Hiperglucemia que no baja/ });
    await mismaFila(
      tarjeta.getByText(/pasos ·/),
      tarjeta.getByText("Empezar").filter({ visible: true }),
    );
  });
});
