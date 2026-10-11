/* 0.43.0, propuestas del autor del 12-10: buscador en la barra lateral (la portada sin caja ni
   recientes), «Cómo funciona» en cuadrícula, la ficha sin repetir Situaciones, el PDF oficial para
   pacientes, situaciones con los momentos del capítulo (ingreso, gestación, ejercicio) y la guía
   paso a paso de Iniciar. */
import { expect, test } from "@playwright/test";

test.describe("Propuestas del 12-10 (0.43.0)", () => {
  test("la portada ya no tiene la caja grande ni recientes; la barra lateral busca", async ({
    page,
  }) => {
    await page.goto("/#/");
    await expect(page.getByLabel("Busca un tema, un sistema o una pregunta")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Lo último que consultaste" })).toHaveCount(
      0,
    );
    const caja = page.getByRole("searchbox", { name: "Pregunta al capítulo" });
    await caja.fill("modo sueño");
    await caja.press("Enter");
    await expect(page).toHaveURL(/#\/buscar\/modo/);
  });

  test("Cómo funciona comparado es una cuadrícula con los sistemas una sola vez", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/funciona");
    const tabla = page.getByRole("table", { name: "Cómo funciona, comparado" });
    await expect(tabla).toBeVisible();
    await expect(tabla.getByRole("columnheader", { name: /Omnipod 5/ })).toHaveCount(1);
    await expect(tabla.getByRole("rowheader", { name: /Cómo decide y aprende/ })).toBeVisible();
  });

  test("Para el paciente ofrece el PDF oficial para descargar", async ({ page }) => {
    await page.goto("/#/pacientes");
    const pdf = page.getByRole("link", { name: /Descargar el PDF oficial del Manual SEEN/ });
    await expect(pdf).toHaveAttribute("href", /pdf\/manual-seen-aid-pacientes\.pdf$/);
    await expect(pdf).toHaveAttribute("download", "");
  });

  test("Ingreso hospitalario y gestación se consultan por los momentos del capítulo", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario");
    const momentos = page.getByRole("region", { name: "Qué revisar durante el ingreso" });
    await expect(momentos.getByRole("heading", { name: /Período perioperatorio/ })).toBeVisible();
    await momentos.getByRole("button", { name: "Abrir todos" }).click();
    await expect(momentos.getByText(/unas 22 h tras la última dosis/)).toBeVisible();
    await page.goto("/#/consultar/situacion/gestacion");
    await expect(
      page
        .getByRole("region", { name: /Por necesidades/ })
        .getByRole("heading", { name: /Parto y posparto/ }),
    ).toBeVisible();
    await page.goto("/#/consultar/situacion/ejercicio-aerobico");
    await expect(
      page.getByRole("heading", { name: /Hipoglucemia: hidratos y tratamiento/ }),
    ).toBeVisible();
  });

  test("la guía paso a paso pregunta y enseña solo lo que aplica", async ({ page }) => {
    await page.goto("/#/consultar/inicio/guia:omnipod-5");
    await expect(page.getByText("Paso 1 de 6")).toBeVisible();
    await expect(page.getByText(/Reducción de la DTD/)).toHaveCount(0);
    await page.getByRole("button", { name: "Múltiples dosis (plumas)" }).click();
    await expect(page.getByText(/Reducción de la DTD/).first()).toBeVisible();
    await page.getByRole("button", { name: /^Siguiente/ }).click();
    await expect(page).toHaveURL(/guia:omnipod-5:2$/);
    await expect(page.getByText("Paso 2 de 6")).toBeVisible();
    await expect(page.getByText(/Regla del 450/).first()).toBeVisible();
  });

  test("la guía: la basal depende de MDI, el estado sobrevive a una fuente y se reinicia", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/guia:omnipod-5");
    await expect(page.getByRole("group", { name: "La basal que lleva" })).toHaveCount(0);
    await page.getByRole("button", { name: "Múltiples dosis (plumas)" }).click();
    await page.getByRole("button", { name: "Glargina U-300 o degludec" }).click();
    await expect(page.getByText(/Solapamiento con glargina/).first()).toBeVisible();
    await page.getByRole("button", { name: "Bomba sin automatización" }).click();
    await expect(page.getByRole("group", { name: "La basal que lleva" })).toHaveCount(0);
    await expect(page.getByText(/Solapamiento con glargina/)).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Transición desde MDI/ })).toHaveCount(0);
    // Abrir una fuente y volver conserva lo elegido.
    await page.getByRole("button", { name: "Múltiples dosis (plumas)" }).click();
    await page
      .getByRole("link", { name: /Tabla 2, p\. 10/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: /Volver a la consulta/ }).click();
    await expect(page).toHaveURL(/guia:omnipod-5/);
    await expect(page.getByRole("button", { name: "Múltiples dosis (plumas)" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Reiniciar la guía" }).click();
    await expect(page.getByRole("button", { name: "Múltiples dosis (plumas)" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // Con la guía abierta, las fases no compiten; «Consultar por fases» las devuelve.
    await expect(page.getByRole("list", { name: "Fases" })).toBeHidden();
    await page.getByRole("button", { name: "Consultar por fases" }).click();
    await expect(page).toHaveURL(/inicio:omnipod-5$/);
  });

  test("situación elegida: índice de necesidades, detalle plegable y una sola fuente", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ejercicio-aerobico");
    const guion = page.getByRole("region", { name: "Lo que dice el capítulo, por momentos" });
    await expect(guion.getByRole("navigation", { name: "Índice de la situación" })).toBeVisible();
    const hipo = guion.locator("h3 button", { hasText: /Hipoglucemia: hidratos/ });
    await expect(hipo).toHaveAttribute("aria-expanded", "false");
    await hipo.click();
    await expect(guion.getByText(/suele requerir menos hidratos/)).toBeVisible();
    await expect(guion.getByText(/^Fuente:/)).toBeVisible();
  });

  test("tarjetas de la ampliación: cada rasgo con su nombre", async ({ page }) => {
    await page.goto("/#/sistemas/todos/ampliacion");
    await expect(page.getByText("Control desde el móvil: no").first()).toBeVisible();
    await expect(page.getByText("Sin tubo: sí").first()).toBeVisible();
  });

  test("objetivos: el TAR > 180 mg/dl lleva su cifra", async ({ page }) => {
    await page.goto("/#/visual/objetivos-mcg");
    await expect(page.getByText("< 25 %").locator("visible=true").first()).toBeVisible();
  });
});
