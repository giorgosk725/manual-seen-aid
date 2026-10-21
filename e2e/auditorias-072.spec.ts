/* 0.72.0 (14-10-2026): lo corregido tras las auditorías de uso (guardia, consulta, educadora y
   diseño, dos rondas), para que no vuelva. */
import { expect, test } from "@playwright/test";

const buscar = async (page: import("@playwright/test").Page, q: string) => {
  await page.goto("/#/buscar");
  await page.getByLabel("Texto a buscar").fill(q);
};

test.describe("Auditorías 0.72.0", () => {
  test("Sistemas: en la entrada, las casillas se acumulan y «Comparar (2)» compara", async ({
    page,
  }) => {
    await page.goto("/#/sistemas");
    const elegir = page.getByRole("button", { name: /Comparar$/ });
    if (await elegir.isVisible()) await elegir.click();
    const grupo = page.getByRole("group", { name: "Sistemas", exact: true });
    await grupo.getByRole("button").nth(0).click();
    await expect(page).toHaveURL(/#\/sistemas$/);
    await grupo.getByRole("button").nth(3).click();
    // 0.84.1 (octava ronda, adjunto): desde el Resumen, al Resumen de los dos. 0.92.3: al marcar el
    // segundo, sin pasar por «Comparar (2)».
    await expect(page).toHaveURL(/#\/sistemas\/mm780\+op5$/);
  });

  test("búsqueda: «gestante» y «modo actividad» abren su situación; «cetonas» su herramienta", async ({
    page,
  }) => {
    const abrir = page.getByRole("list", { name: "Abrir" });
    await buscar(page, "gestante");
    await expect(abrir.getByRole("link").first()).toHaveAttribute(
      "href",
      "#/consultar/situacion/gestacion",
    );
    await buscar(page, "modo actividad");
    await expect(abrir.getByRole("link").first()).toHaveAttribute(
      "href",
      "#/consultar/situacion/ejercicio-aerobico",
    );
    await buscar(page, "cetonas");
    await expect(abrir.getByRole("link").first()).toHaveAttribute("href", "#/consultar/figura-3");
  });

  test("con una cifra de cetonas: los cuatro tramos, ninguno marcado, sin el recuadro de urgencia (A01)", async ({
    page,
  }) => {
    await buscar(page, "cetonas 2,1");
    const tramos = page.getByRole("list", { name: "Tramos de la Figura 3" }).getByRole("link");
    await expect(tramos).toHaveCount(4);
    // 0.72.1 (decisión del responsable): sin el recuadro de urgencia (está en el tramo ≥3,0).
    await expect(page.getByText("URGENCIAS / VALORACIÓN HOSPITALARIA INMEDIATA.")).toHaveCount(0);
  });

  test("descarga: los ocho pasos a la vista, el actual marcado", async ({ page }) => {
    await page.goto("/#/consultar/descarga/2");
    const pasos = page.getByRole("navigation", { name: "Pasos de la descarga" });
    await expect(pasos.locator("visible=true").getByRole("button")).toHaveCount(8);
    await expect(
      pasos.locator("visible=true").getByRole("button", { name: /Seguridad clínica/ }),
    ).toHaveAttribute("aria-current", "step");
  });

  test("ficha: la Tabla 3 dice qué tiene efecto directo en automático", async ({ page }) => {
    await page.goto("/#/sistemas/ciq/parametros");
    await expect(page.getByText("Actúa en automático", { exact: true }).first()).toBeVisible();
  });

  test("Iniciar: «Calcular · Fases · Hoja» y la hoja con los valores de partida", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio");
    const herramienta = page.getByRole("group", { name: "Herramienta" });
    await expect(herramienta.getByRole("button")).toHaveCount(3);
    await herramienta.getByRole("button", { name: /Hoja de comprobación/ }).click();
    await expect(page.getByRole("heading", { name: "Parámetros iniciales" })).toBeVisible();
  });
});
