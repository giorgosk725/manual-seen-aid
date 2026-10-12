/* 0.44.0, el móvil más compacto (encargo del 12-10-2026), a 360 px (el ancho más común en
   Android): lo que iba apilado en dos o tres filas cabe en una. */
import { expect, test, type Locator } from "@playwright/test";

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

  test("iniciar un sistema: la guía y la hoja de comprobación en una fila", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5");
    const guia = page.getByRole("button", { name: "Guía paso a paso" });
    const hoja = page.getByRole("button", { name: "Hoja de comprobación" });
    await mismaFila(guia, hoja);
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
