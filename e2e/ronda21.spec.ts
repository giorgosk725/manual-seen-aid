import { test, expect } from "@playwright/test";

/* 1.0.5 · vigesimoprimera ronda de auditorías (sobre la 1.0.4) y decisiones del autor. */

test.describe("Ronda 21", () => {
  test("Los cuatro en una sección: una sola pestaña marcada", async ({ page }) => {
    for (const sec of ["esencial", "parametros", "modos"]) {
      await page.goto(`/#/sistemas/todos/${sec}`);
      await expect(page.locator('main [aria-current="location"]')).toHaveCount(1);
    }
    await page.goto("/#/sistemas");
    await expect(page.getByRole("link", { name: "Resumen", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("Fases, desde otro sistema de asa cerrada: lo que cuenta en automático en uno y otro", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/inicio:control-iq:transicion");
    const paso = page.locator("#paso-guia");
    await paso.getByRole("button", { name: "Otro sistema de asa cerrada" }).click();
    await paso.getByRole("radio", { name: /MiniMed 780G/ }).click();
    await expect(paso.locator("#calc-cambio")).toBeVisible();
    await expect(paso.locator('section[aria-labelledby="calc-cambio"]')).toContainText(
      "Factor de sensibilidad",
    );
  });

  test("situación en el móvil: «Otra situación» lleva a la lista con el sistema", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/situacion/rm:control-iq");
    await page.getByRole("link", { name: /Otra situación/ }).click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/:control-iq$/);
    await page
      .getByRole("button", { name: /Tomografía computarizada/ })
      .first()
      .click();
    await expect(page).toHaveURL(/#\/consultar\/situacion\/tc:control-iq$/);
  });

  test("RM con un sistema: la columna de la bomba o el pod, solo la de su formato", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/rm:omnipod-5");
    await expect(
      page.getByText("Retirar antes de entrar en la sala. Al finalizar, colocar un pod nuevo."),
    ).toBeVisible();
    await page.goto("/#/consultar/situacion/rm:control-iq");
    await expect(page.getByText(/reconectar o colocar un set nuevo\./)).toBeVisible();
    await page.goto("/#/consultar/situacion/rm");
    await expect(page.getByText(/colocar un set o pod nuevo\./)).toBeVisible();
  });

  test("plan de seguridad: los recambios del formato del sistema", async ({ page }) => {
    await page.goto("/#/pacientes/plan/op5");
    await expect(
      page.getByText("Recambios de pods, sensores y baterías/cargadores."),
    ).toBeVisible();
    await page.goto("/#/pacientes/plan/ciq");
    await expect(
      page.getByText("Recambios de set, cánula, reservorio, sensores y baterías/cargadores."),
    ).toBeVisible();
  });

  test("hipoglucemia: la condición encima de las cantidades, sin la frase repetida", async ({
    page,
  }) => {
    await page.goto("/#/visual/hipoglucemia");
    await expect(
      page.locator("main p", { hasText: "pueden bastar cantidades menores que la regla clásica" }),
    ).toHaveText(/15\s?g:$/);
    await expect(page.getByText(/como orientación, 5-10 g/)).toHaveCount(0);
  });

  test("ficha de Omnipod 5 en papel: sin las preguntas que ya responden sus tarjetas", async ({
    page,
  }) => {
    await page.goto("/#/sistemas/op5/completa");
    await page.emulateMedia({ media: "print" });
    const nadar = page.locator("li", { hasText: "¿Se puede nadar con el pod?" }).first();
    await expect(nadar).toBeHidden();
  });
});

test.describe("Ronda 21 · buscador (1.0.6)", () => {
  test("«alcohol omnipod»: el acceso a la fila de la ficha trae su respuesta", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("alcohol omnipod");
    await page.keyboard.press("Enter");
    const abrir = page.getByRole("list", { name: "Abrir" }).first();
    await expect(abrir).toContainText("Alcohol · Modos y funciones de Omnipod 5");
    await expect(abrir).toContainText("Anticipar hipoglucemia diferida");
  });

  test("«hipoglucemia 780g»: primero cómo se trata, sin el ejercicio", async ({ page }) => {
    await page.goto("/#/buscar");
    await page.locator("#buscar-q").fill("hipoglucemia 780g");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/como orientación, 5-10\s?g/).first()).toBeVisible();
    await expect(page.getByText(/Ejercicio aeróbico planificado/)).toHaveCount(0);
  });
});
