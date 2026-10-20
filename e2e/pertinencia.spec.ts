/* 0.42.0: relacionadas pertinentes y continuación en Buscar; f61 más corta; siglas pulsables en
   las tareas de Iniciar; hojas con su «para qué». */
import { expect, test } from "@playwright/test";

test.describe("Pertinencia y continuación (0.42.0)", () => {
  test("basal de Omnipod: sin la pregunta de Control-IQ+, con «Seguir en» y la explicación de la Tabla 3", async ({
    page,
  }) => {
    await page.goto(
      "/#/buscar/%C2%BFQu%C3%A9%20basal%20programo%20en%20Omnipod%20y%20para%20qu%C3%A9%20sirve%20despu%C3%A9s%3F",
    );
    await expect(page.getByText(/Tasa basal programada/).first()).toBeVisible();
    await expect(
      page.getByText(/Control-IQ frente a Control-IQ\+|diferencia hay entre Control-IQ/),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", {
        name: /Véase también: Iniciación del sistema · Programación inicial/,
      }),
    ).toBeVisible();
    await expect(page.getByText("Cómo leer esta tabla")).toHaveCount(0);
  });

  test("f61: la columna de Tandem, otros sistemas plegados y los cuatro como ampliación", async ({
    page,
  }) => {
    await page.goto("/#/preguntas/f61");
    await expect(page.getByText(/Control-IQ\+: ≥\s2\saños/).first()).toBeVisible();
    // 0.77.1 (nada útil plegado): los sistemas, a la vista, sin «Ver otros sistemas».
    await expect(page.getByText("Ver otros sistemas")).toHaveCount(0);
    // 0.80.1: en una pregunta de un solo sistema, sin botones de sistema en cada tarjeta.
    await expect(page.getByRole("group", { name: "Sistema" })).toHaveCount(0);
    await expect(page.getByText("Todos los sistemas")).toBeVisible();
  });

  test("Iniciar: una sigla de la tarea es pulsable y define sin salir", async ({ page }) => {
    await page.goto("/#/consultar/inicio/inicio:omnipod-5:transicion");
    const sigla = page.getByRole("button", { name: /^(MDI|DTD)$/ }).first();
    await expect(sigla).toBeVisible();
    await sigla.click();
    await expect(page.getByText(/múltiples dosis|dosis total diaria/i).first()).toBeVisible();
  });

  test("Material para el paciente: tres entradas, sin entradillas", async ({ page }) => {
    await page.goto("/#/pacientes");
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: /Información para pacientes/ })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Plan de seguridad" })).toBeVisible();
    await expect(
      main.getByRole("link", { name: /Antes de una prueba o una cirugía/ }),
    ).toBeVisible();
    await expect(main.getByText(/No son una publicación del Manual SEEN/)).toHaveCount(0);
  });
});
