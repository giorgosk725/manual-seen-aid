/* Auditoría de la 0.61.0 (aplicada en la 0.63.0): calculadora, inicio, situaciones y sistemas.
   Cifras ficticias, de prueba de software; no son casos clínicos. */
import { expect, test } from "@playwright/test";

const paso = (page: import("@playwright/test").Page, n: number) =>
  page.locator(`section[aria-labelledby=calc-paso-${n}]`);

test.describe("Calculadora (I61-01/02/03)", () => {
  test("con un dato vacío o inválido no hay cifras ni propuesta", async ({ page }) => {
    await page.goto("/#/consultar/inicio/calculadora:minimed-780g");
    await page.getByLabel("Insulina basal").fill("20");
    await expect(paso(page, 4).getByText(/Falta: insulina rápida/)).toBeVisible();
    await expect(paso(page, 4).getByText("Ratio I/HC")).toHaveCount(0);
    await page.getByLabel("Insulina rápida").fill("abc");
    await expect(paso(page, 4).getByText(/Insulina rápida: Escribe solo cifras/)).toBeVisible();
    await expect(paso(page, 4).getByText("Ratio I/HC")).toHaveCount(0);
    await page.getByLabel("Insulina rápida").fill("1e2");
    await expect(paso(page, 4).getByText("Ratio I/HC")).toHaveCount(0);
    await page.getByLabel("Insulina rápida").fill("20");
    await expect(paso(page, 4).getByText("Ratio I/HC")).toBeVisible();
  });

  test("bomba que funcionaba en CamAPS FX: pide la DTD y el peso; el peso fuera de rango bloquea", async ({
    page,
  }) => {
    await page.goto("/#/consultar/inicio/calculadora:camaps");
    await page.getByRole("button", { name: /Bomba de insulina/ }).click();
    await page.getByRole("button", { name: "Sí: se traslada tal cual" }).click();
    await expect(page.getByLabel(/DTD actual/)).toBeVisible();
    await expect(paso(page, 4).getByText(/Falta: DTD actual, peso/)).toBeVisible();
    await page.getByLabel(/DTD actual/).fill("36");
    await page.getByLabel(/^Peso/).fill("8");
    await expect(page.getByRole("alert").filter({ hasText: "no hay propuesta" })).toBeVisible();
    await expect(
      paso(page, 5).getByText(/Sin propuesta: hay un dato fuera de la indicación/),
    ).toBeVisible();
    await page.getByLabel(/^Peso/).fill("40");
    await expect(paso(page, 4).getByText(/Se traslada la programación/)).toBeVisible();
    await expect(paso(page, 5).getByText("36 UI/día")).toBeVisible();
  });

  test("«Nuevo inicio» vacía; abrir una fuente y volver, no", async ({ page }) => {
    await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
    await page.getByLabel("Insulina basal").fill("18");
    await page.getByRole("link", { name: "Tabla 2, p. 10" }).click();
    await expect(page).toHaveURL(/#\/capitulo\//);
    await page.goBack();
    await expect(page.getByLabel("Insulina basal")).toHaveValue("18");
    await page.getByRole("button", { name: /Nuevo inicio/ }).click();
    await expect(page.getByLabel("Insulina basal")).toHaveValue("");
  });
});

test.describe("Inicio (I61-04/08)", () => {
  test("en el móvil, «Ir al paso» lleva al respaldo sin recorrer los pasos", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#/consultar/inicio/inicio:control-iq");
    await page.getByLabel("Ir al paso").selectOption("4");
    await expect(page).toHaveURL(/inicio:control-iq:respaldo$/);
  });
});

test.describe("Situaciones (S61-01/02/06)", () => {
  test("TAC lleva a tomografía, no a gestación; sin resultados se puede borrar", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion");
    const filtro = page.getByLabel("Filtrar situaciones");
    await filtro.fill("TAC");
    await expect(page.getByRole("button", { name: /Tomografía computarizada/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Gestación/ })).toHaveCount(0);
    await filtro.fill("zzzz");
    await expect(page.getByText(/Ninguna situación coincide/)).toBeVisible();
    await page.getByRole("button", { name: "Borrar el filtro" }).click();
    await expect(filtro).toHaveValue("");
  });

  test("ejercicio: las comprobaciones antes de la conducta, también al elegir sistema", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/ejercicio-aerobico:camaps");
    const antes = page.getByRole("region", { name: "Antes de actuar" });
    const conducta = page.getByRole("region", { name: "Conducta recomendada" });
    await expect(antes).toContainText(/126–180 mg\/dl/);
    expect((await antes.boundingBox())!.y).toBeLessThan((await conducta.boundingBox())!.y);
  });

  test("TC: un toque a la hoja para el paciente; la Figura 3 desde la interrupción", async ({
    page,
  }) => {
    await page.goto("/#/consultar/situacion/tc");
    await expect(
      page
        .getByRole("region", { name: "Para seguir" })
        .getByRole("link", { name: /antes de una prueba o una cirugía/ }),
    ).toBeVisible();
    await page.goto("/#/consultar/interrupcion");
    await expect(page.getByRole("link", { name: "Ver la Figura 3" })).toBeVisible();
  });
});

test.describe("Sistemas (M61-01/02/03)", () => {
  test("objetivo en «Cómo funciona», condición de los bolos y nota de Liberty", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/#/sistemas/ciq/funciona");
    await expect(page.getByRole("list", { name: "Recorrido de la decisión" })).toContainText(
      "Hacia el objetivo",
    );
    await page.goto("/#/sistemas");
    await expect(page.getByText(/no actúa en modo Sueño/).first()).toBeVisible();
    await page.goto("/#/sistemas/camaps/funciona");
    await expect(
      page.getByText(/Nota complementaria \(no es texto del capítulo\)/).first(),
    ).toBeVisible();
  });
});
