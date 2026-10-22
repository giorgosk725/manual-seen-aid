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
    const caja = page.getByRole("searchbox", { name: "Buscar en el capítulo" });
    await caja.fill("modo sueño");
    await caja.press("Enter");
    await expect(page).toHaveURL(/#\/buscar$/);
    await expect(page.getByLabel("Texto a buscar")).toHaveValue("modo sueño");
  });

  test("Material para el paciente ofrece el PDF oficial", async ({ page }) => {
    await page.goto("/#/pacientes");
    const pdf = page.getByRole("link", { name: /Información para pacientes/ });
    await expect(pdf).toHaveAttribute("href", /pdf\/manual-seen-aid-pacientes\.pdf$/);
  });

  test("Ingreso hospitalario y gestación se consultan por los momentos del capítulo", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ingreso-hospitalario");
    const momentos = page.getByRole("region", { name: "Texto del capítulo" });
    await expect(momentos.getByRole("heading", { name: /Período perioperatorio/ })).toBeVisible();
    await expect(momentos.getByText(/unas 22\sh tras la última dosis/)).toBeVisible();
    await page.goto("/#/consultar/situacion/gestacion");
    await expect(
      page
        .getByRole("region", { name: "Texto del capítulo" })
        .getByRole("heading", { name: /Parto y posparto/ }),
    ).toBeVisible();
    await page.goto("/#/consultar/situacion/ejercicio-aerobico");
    await expect(
      page.getByRole("heading", { name: /Hipoglucemia: hidratos de carbono y conducta/ }),
    ).toBeVisible();
  });

  test("la dirección de la guía lleva a la fase Inicio; preguntar filtra lo que se enseña", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/guia:omnipod-5");
    await expect(page).toHaveURL(/inicio:omnipod-5:transicion$/);
    await expect(page.locator("#guia-titulo", { hasText: /^1\./ })).toBeVisible();
    // Sin elegir, se enseña todo; con bomba, solo lo de bomba.
    await expect(page.getByText(/Reducción de la DTD/).first()).toBeVisible();
    await page.getByRole("button", { name: "Bomba sin automatización" }).click();
    await expect(page.getByText(/Reducción de la DTD/)).toHaveCount(0);
    await page.getByRole("button", { name: /^Siguiente paso/ }).click();
    await expect(page).toHaveURL(/inicio:omnipod-5:parametros$/);
    await expect(page.locator("#guia-titulo", { hasText: /^2./ })).toBeVisible();
    await expect(page.getByText(/Regla del 450/).first()).toBeVisible();
  });
  test("inicio paso a paso: la basal depende de MDI, el estado sobrevive a una fuente y se reinicia", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:transicion");
    await expect(page.getByRole("group", { name: "Basal previa" })).toHaveCount(0);
    await page.getByRole("button", { name: "Múltiples dosis (plumas)" }).click();
    await page.getByRole("button", { name: "Glargina U-300 o degludec" }).click();
    await expect(page.getByText(/Solapamiento con glargina/).first()).toBeVisible();
    await page.getByRole("button", { name: "Bomba sin automatización" }).click();
    await expect(page.getByRole("group", { name: "Basal previa" })).toHaveCount(0);
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
    await expect(page).toHaveURL(/inicio:omnipod-5:transicion/);
    await expect(page.getByRole("button", { name: "Múltiples dosis (plumas)" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // «Nuevo inicio» vacía todo el trabajo (0.63.0; antes, «Reiniciar» solo la guía).
    await page.getByRole("button", { name: /Nuevo inicio/ }).click();
    await expect(page.getByRole("button", { name: "Múltiples dosis (plumas)" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("situación elegida: índice de necesidades, detalle plegable y una sola fuente", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ejercicio-aerobico");
    const guion = page.getByRole("region", { name: "Texto del capítulo" });
    await expect(guion.getByRole("list", { name: "Momentos" })).toBeVisible();
    // 0.74.2: todos los momentos abiertos de entrada, cada uno con su línea de fuente.
    const hipo = guion.locator("h3 button", { hasText: /Hipoglucemia: hidratos/ });
    await expect(hipo).toHaveAttribute("aria-expanded", "true");
    // 1.0.10 (23.ª ronda, adjunto): el párrafo b7 (sin el b6, «Dos reglas operativas…»).
    await expect(guion.getByText(/cantidades menores que la regla clásica/)).toBeVisible();
    await expect(guion.getByText(/^Fuente:/)).toHaveCount(6);
  });

  test("ampliación técnica: fuera de la edición; la ruta antigua explica el alcance (A06)", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/todos/ampliacion");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "La ampliación técnica no está en esta edición",
    );
    await page.goto("/#/sistemas/mm780/ampliacion");
    await expect(page.getByRole("link", { name: "Ir a lo esencial del sistema" })).toHaveAttribute(
      "href",
      "#/sistemas/mm780/esencial",
    );
    await page.goto("/#/sistemas/todos/funciona");
    await expect(page.getByText(/Control desde el móvil:|Sin tubo:/)).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "Ampliación técnica" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /asistente-aid/ })).toHaveCount(0);
  });

  test("objetivos: solo los del capítulo; sin el TAR > 180 del consenso de 2019 (A07)", async ({
    page,
  }) => {
    await page.goto("/#/visual/objetivos-mcg/general");
    await expect(page.getByText(/consenso internacional de MCG de 2019/)).toHaveCount(0);
    await expect(page.getByText("< 5 %").locator("visible=true").first()).toBeVisible();
  });

  test("situación: el momento consultado sigue abierto al volver de su fuente y va en la ruta", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ejercicio-aerobico:omnipod-5");
    const guion = page.getByRole("region", { name: "Texto del capítulo" });
    const despues = guion.locator("h3 button", { hasText: /Después del ejercicio/ });
    // 0.74.2: abierto de entrada; plegar y volver a abrir lo deja en la ruta.
    await despues.click();
    await despues.click();
    await expect(despues).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveURL(/ejercicio-aerobico:omnipod-5:m7$/);
    const fuente = page.locator("#momento-6").getByRole("link", { name: /Apartado 10, p\. 19/ });
    await expect(fuente).toHaveAttribute("href", /10-situaciones\/b25$/);
    await fuente.click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: /Volver a la consulta/ }).click();
    await expect(page).toHaveURL(/ejercicio-aerobico:omnipod-5:m7$/);
    await expect(
      page
        .getByRole("region", { name: "Texto del capítulo" })
        .locator("h3 button", { hasText: /Después del ejercicio/ }),
    ).toHaveAttribute("aria-expanded", "true");
    // Un enlace a un momento lo abre (ingreso, sin sistema).
    await page.goto("/#/consultar/situacion/ingreso-hospitalario::m6");
    await expect(
      page
        .getByRole("region", { name: "Texto del capítulo" })
        .locator("h3 button", { hasText: /Período perioperatorio/ }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  test("la hoja de comprobación resume lo marcado en la guía", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:respaldo");
    const casilla = page
      .getByRole("list", { name: "Para marcar en la consulta" })
      .getByRole("checkbox")
      .first();
    await casilla.check();
    await page.getByRole("button", { name: "Hoja de comprobación" }).click();
    await expect(page.locator(".hoja-inicio").getByRole("checkbox", { checked: true })).toHaveCount(
      1,
    );
    await page.getByRole("button", { name: /Hoja en blanco/ }).click();
    await expect(page.locator(".hoja-inicio").getByRole("checkbox", { checked: true })).toHaveCount(
      0,
    );
  });
});
