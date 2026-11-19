import { expect, test } from "@playwright/test";

/* 1.0.35: la unidad va dentro de las casillas del cálculo inicial y todas miden lo mismo. */
test("cálculo inicial: unidad dentro de la casilla y casillas del mismo ancho", async ({
  page,
}) => {
  await page.goto("/#/consultar/inicio/calculadora:omnipod-5");
  await expect(page.locator("#calc-basal")).toBeVisible();
  const r = await page.evaluate(() =>
    ["calc-basal", "calc-rapida", "calc-peso"].map((id) => {
      const c = document.getElementById(id)!.getBoundingClientRect();
      const u = document.getElementById(`${id}-unidad`)!.getBoundingClientRect();
      return { ancho: Math.round(c.width), dentro: u.left >= c.left && u.right <= c.right };
    }),
  );
  expect(new Set(r.map((x) => x.ancho)).size).toBe(1);
  expect(r.every((x) => x.dentro)).toBe(true);
  // Una cifra larga no se monta sobre la unidad.
  await page.locator("#calc-basal").fill("123,45");
  const libre = await page.evaluate(() => {
    const c = document.getElementById("calc-basal") as HTMLInputElement;
    const u = document.getElementById("calc-basal-unidad")!.getBoundingClientRect();
    const cs = getComputedStyle(c);
    const lienzo = document.createElement("canvas").getContext("2d")!;
    lienzo.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const finTexto =
      c.getBoundingClientRect().left +
      parseFloat(cs.paddingLeft) +
      lienzo.measureText(c.value).width;
    return u.left - finTexto;
  });
  expect(libre).toBeGreaterThan(4);
});
