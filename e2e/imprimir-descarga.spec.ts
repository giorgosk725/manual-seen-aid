/* 0.90.1 (14.ª ronda, R3 y visual): «Imprimir este paso» imprime el paso (la región lleva
   `.imprimible`; sin ella, con `imprimiendo` todo se ocultaba y salía la hoja en blanco), en una
   hoja A4; y en papel, desde el modo nocturno, las tintas del plan en claro (R5). */
import { expect, test } from "@playwright/test";

for (const paso of [1, 4, 8])
  test(`descarga, paso ${paso}: se imprime con su contenido en una hoja`, async ({ page }) => {
    await page.goto(`/#/consultar/descarga/${paso}`);
    await page.evaluate(() => {
      window.print = () => {};
    });
    await page.getByRole("button", { name: /Imprimir este paso/ }).click();
    const dentro = await page.evaluate(
      () =>
        document.documentElement.classList.contains("imprimiendo") &&
        !!document.querySelector(".imprimible #paso-descarga") &&
        !!document.querySelector(".imprimible h1"),
    );
    expect(dentro).toBe(true);
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    expect((pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length).toBe(1);
  });

test("plan impreso desde el modo nocturno: rótulos con su tinta de día", async ({ page }) => {
  await page.goto("/#/pacientes/plan/camaps");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => document.documentElement.classList.add("night"));
  await page.emulateMedia({ media: "print" });
  const color = await page.evaluate(() => {
    const h = [...document.querySelectorAll("h2, h3")].find((x) =>
      /Hipoglucemia/.test(x.textContent ?? ""),
    );
    return h ? getComputedStyle(h).color : null;
  });
  expect(color).not.toBe("rgb(252, 165, 165)");
});
