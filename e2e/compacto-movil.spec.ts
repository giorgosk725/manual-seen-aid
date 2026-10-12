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
  test("portada: las dos entradas en una fila, sin la frase del mapa y con la afiliación bajo el nombre", async ({
    page,
  }) => {
    await page.goto("/#/");
    const cabecera = page.locator("section[aria-labelledby=titulo-capitulo]");
    const leer = cabecera.getByRole("link", { name: "Leer capítulo", exact: true });
    const paciente = cabecera.getByRole("link", { name: "Para el paciente", exact: true });
    await mismaFila(leer, paciente);
    await expect(page.getByText(/Si prefieres entrar por tema/)).toHaveCount(0);
    const nombre = cabecera.getByText("Georgios Kyriakos", { exact: true });
    const filiacion = cabecera.getByText(/^Servicio de Endocrinología y Nutrición/);
    await expect(filiacion).toBeVisible();
    expect(await arriba(filiacion)).toBeGreaterThan(await arriba(nombre));
    expect(await arriba(filiacion)).toBeLessThan(await arriba(leer));
    // Solo una vez: ya no se repite al pie.
    await expect(page.getByText(/^Servicio de Endocrinología y Nutrición/)).toHaveCount(1);
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
    const formato = page.getByRole("group", { name: "Formato de impresión" });
    const imprimir = page.getByRole("button", { name: "Imprimir con letra grande" });
    await mismaFila(formato, imprimir);
    await expect(page.locator(".hoja-a4")).toBeInViewport();
  });

  test("leer capítulo: el índice antes que «Comprender y practicar»", async ({ page }) => {
    await page.goto("/#/capitulo");
    const indice = page.getByRole("heading", { name: "Índice del capítulo" });
    const comprender = page.getByRole("heading", { name: "Comprender y practicar" });
    expect(await arriba(indice)).toBeLessThan(await arriba(comprender));
    await expect(page.getByRole("link", { name: /3 Algoritmos de control/i })).toBeInViewport();
    await expect(
      page
        .getByRole("region", { name: "Comprender y practicar" })
        .getByRole("link", { name: "Cómo funciona cada sistema" }),
    ).toHaveAttribute("href", "#/sistemas/todos/funciona");
  });

  test("ficha de un sistema: los cuatro enlaces de la cabecera en dos filas", async ({ page }) => {
    await page.goto("/#/sistemas/mm780");
    const cab = page.locator("main header").first();
    const iniciar = cab.getByRole("link", { name: "Iniciar paso a paso" });
    const plan = cab.getByRole("link", { name: "Plan de seguridad" });
    const ficha = cab.getByRole("link", { name: "Ficha completa" });
    const imprimir = cab.getByRole("button", { name: /Imprimir/ });
    await mismaFila(iniciar, plan);
    await mismaFila(ficha, imprimir);
    expect(await arriba(ficha)).toBeGreaterThan(await arriba(iniciar));
  });

  test("iniciar un sistema: la hoja de comprobación a mano y sin guía aparte", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    await expect(page.getByRole("button", { name: "Hoja de comprobación" })).toBeVisible();
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
      .getByRole("navigation", { name: "Ir directamente al tramo" })
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

  test("criterios de elección: edad y peso en una fila", async ({ page }) => {
    await page.goto("/#/sistemas/elegir");
    await mismaFila(page.getByLabel(/^Edad/), page.getByLabel(/^Peso/));
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
