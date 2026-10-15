import { test, expect, type Page } from "@playwright/test";
import { auditar } from "./axe";

/* Sesión 4 · escritorio: hojas para el paciente en UNA cara A4, nocturno con axe en las
   pantallas nuevas, búsqueda con el grupo «fuera del capítulo» y enlace profundo a la versión
   extendida. */

/* Imprime la región como lo hace el botón (clase `imprimiendo`) y cuenta las páginas del PDF. */
const paginasAlImprimir = async (page: Page) => {
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.documentElement.classList.add("imprimiendo"));
  const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
  await page.evaluate(() => document.documentElement.classList.remove("imprimiendo"));
  await page.emulateMedia({ media: "screen" });
  return (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
};

/* Edición editorial (A12): solo letra grande. La compacta de 7 pt no se ofrece, aunque una
   versión anterior la dejara guardada. Las hojas y plantillas se rotulan complementarias. */
test.describe("Material para el paciente: sin la versión compacta", () => {
  test("con «una-cara» guardada, la hoja sale con letra grande y sin selector", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("mseen:hoja", JSON.stringify("una-cara")));
    await page.goto("/#/pacientes/plan/mm780");
    await expect(page.locator(".hoja-a4.grande")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /Compacta|Imprimir en una cara/ })).toHaveCount(
      0,
    );
    await expect(page.locator(".hoja-a4 h1")).toHaveText("Plan de seguridad · MiniMed 780G");
    // V54-09: la urgencia de la Figura 3, en la primera cara.
    await expect(
      page.getByRole("region", {
        name: /Urgencia y signos de gravedad \(Figura 3\), al principio del plan/,
      }),
    ).toBeVisible();
    await expect(page.locator(".hoja-a4 .hoja-pie")).toContainText(
      "no es una publicación del Manual SEEN",
    );
  });
  test("la Información para pacientes (PDF) lleva su fecha", async ({ page }) => {
    await page.goto("/#/pacientes");
    await expect(page.getByRole("link", { name: /Información para pacientes/ })).toContainText(
      "9 de octubre de 2026",
    );
  });
});

/* Letra grande (decisión del autor, 3-10-2026): 12 pt en una columna, aunque ocupe varias caras;
   el resumen, dos. Desde la 0.12.0 es el formato por defecto (auditoría externa del 6-10-2026);
   la compacta se elige en la propia hoja y se recuerda en el navegador. */
test.describe("Material para el paciente: letra grande", () => {
  test("letra grande siempre; un solo botón de imprimir", async ({ page }) => {
    await page.goto("/#/capitulo/resumen");
    await expect(page.getByRole("button", { name: "Imprimir", exact: true })).toBeVisible();
    await expect(page.locator(".hoja-a4.grande")).toHaveCount(1);
  });
  for (const [ruta, nombre, maximo] of [
    ["/#/capitulo/resumen", "Resumen", 2],
    // V54-09 (0.55.0): los cuatro planes y las dos hojas adaptadas. Los planes, 4 caras: la
    // urgencia va en la primera y la Figura 3 no parte ninguna rama (docs/IMPRESION_2026-10.md).
    ["/#/pacientes/plan/mm780", "Plan de seguridad · MiniMed 780G", 4],
    ["/#/pacientes/plan/ciq", "Plan de seguridad · Tandem Control-IQ", 4],
    ["/#/pacientes/plan/camaps", "Plan de seguridad · myLoop CamAPS", 4],
    ["/#/pacientes/plan/op5", "Plan de seguridad · Omnipod 5", 4],
    ["/#/pacientes/hoja/cetonas", "Hoja de cetonas", 2],
    ["/#/pacientes/hoja/pruebas-cirugia", "Hoja de pruebas y cirugía", 2],
  ] as const) {
    test(`${nombre}: 12 pt y como mucho ${maximo} caras`, async ({ page }) => {
      await page.addInitScript(() =>
        localStorage.setItem("mseen:hoja", JSON.stringify("letra-grande")),
      );
      await page.goto(ruta);
      await expect(page.locator(".hoja-a4")).toBeVisible();
      await page.emulateMedia({ media: "print" });
      await page.evaluate(() => document.documentElement.classList.add("imprimiendo"));
      const letra = await page.evaluate(
        () => getComputedStyle(document.querySelector(".hoja-a4 p, .hoja-a4 li")!).fontSize,
      );
      await page.evaluate(() => document.documentElement.classList.remove("imprimiendo"));
      await page.emulateMedia({ media: "screen" });
      expect(letra, nombre).toBe("16px");
      const paginas = await paginasAlImprimir(page);
      expect(paginas, nombre).toBeGreaterThanOrEqual(2);
      expect(paginas, nombre).toBeLessThanOrEqual(maximo);
    });
  }
});

test.describe("Nocturno en lo nuevo", () => {
  test("pacientes, plan, test, diagramas nuevos y Sobre sin violaciones", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Modo nocturno" }).first().click();
    await expect(page.locator("html")).toHaveClass(/night/);
    await auditar(page, "Portada con «¿Qué necesitas?»");
    for (const [ruta, nombre] of [
      ["/#/pacientes", "Material para el paciente"],
      ["/#/pacientes/plan/op5", "Plan de seguridad"],
      ["/#/test", "Autoevaluación"],
      ["/#/visual/gestacion-sistemas", "Gestación por sistema"],
      ["/#/visual/hospital", "Hospital"],
      ["/#/visual/interrupcion", "Interrupción"],
    ] as const) {
      await page.goto(ruta);
      await auditar(page, nombre);
    }
    await page.goto("/#/sobre");
    await auditar(page, "Sobre esta app");
  });
});

test.describe("Búsqueda y enlaces", () => {
  test("lo que no es del capítulo sale aparte y rotulado", async ({ page }) => {
    await page.goto("/#/buscar/urgencias");
    const todos = page.getByTestId("todos-los-resultados");
    if (!(await todos.getAttribute("open"))) await todos.locator("summary").click();
    await page
      .getByRole("group", { name: "Tipo de resultado" })
      .getByRole("button", { name: /^Otros recursos \(\d+\)/ })
      .click();
    await expect(page.getByText(/No es el texto del capítulo/)).toBeVisible();
    // 0.70.0: la Información para pacientes es el PDF publicado.
    await expect(
      page.getByRole("link", {
        name: /Información para pacientes \(PDF\) · ¿Cuándo se debe acudir a urgencias\?/,
      }),
    ).toHaveAttribute("href", "pdf/manual-seen-aid-pacientes.pdf");
  });

  test("la barra lateral: Inicio y tres grupos (Consultar, Leer y comprender, Recursos)", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    for (const g of ["Consultar", "Leer y comprender", "Recursos"])
      await expect(nav.getByText(g, { exact: true }).first()).toBeVisible();
    await expect(nav.getByRole("link", { name: "Sistemas AID", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Sobre este complemento" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Material para el paciente" })).toBeVisible();
    await page.goto("/#/pacientes");
    await expect(nav.getByRole("link", { name: "Material para el paciente" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});

/* Iniciación del sistema (0.9.0): la hoja de comprobación cabe en una cara, con sistema y sin él;
   se llega desde la ficha del sistema y desde el apartado 8. */
test.describe("Iniciación del sistema", () => {
  for (const ruta of ["hoja:omnipod-5", "hoja"]) {
    test(`la hoja de comprobación (${ruta}) cabe en una cara`, async ({ page }) => {
      await page.goto(`/#/consultar/inicio/${ruta}`);
      await expect(page.getByRole("button", { name: /Imprimir la hoja/ })).toBeVisible();
      expect(await paginasAlImprimir(page), ruta).toBe(1);
    });
  }
  test("desde la ficha de Omnipod 5, la fase de inicio con su línea de la Tabla 2", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/op5");
    // 0.63.0: la ficha lleva al principio del recorrido (preparación), con el sistema.
    await page.getByRole("link", { name: /Preparar e iniciar este sistema/ }).click();
    await expect(page).toHaveURL(/preparacion:omnipod-5$/);
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:arranque");
    await expect(page.getByRole("heading", { name: /Inicio del sistema/ })).toBeVisible();
    await expect(
      page.getByText(/^Omnipod 5: iniciar modo automático desde el primer pod/),
    ).toBeVisible();
    await expect(page.getByText(/^MiniMed 780G: SmartGuard/)).toHaveCount(0);
    await auditar(page, "Iniciación del sistema · Omnipod 5");
  });
  test("el apartado 8 lleva al recorrido", async ({ page }) => {
    await page.goto("/#/capitulo/08-iniciacion");
    await page.getByRole("link", { name: "Iniciación del sistema paso a paso" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Iniciación del sistema/i);
  });
});
