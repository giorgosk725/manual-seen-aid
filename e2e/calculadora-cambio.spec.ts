/* 0.91.1 (decisiones del responsable, 21-10-2026): al cambiar de AID, lo que pasa a actuar en
   automático junto a la pregunta de la programación; y desde ISCI u otro AID, por qué la DTD de
   inicio no se reduce. */
import { expect, test } from "@playwright/test";

test("de MiniMed 780G a Control-IQ: basal y factor pasan a actuar en automático", async ({
  page,
}) => {
  await page.goto("/#/consultar/inicio/calculadora:control-iq:desde-minimed-780g");
  await expect(
    page.getByText(
      /En MiniMed 780G, la tasa basal y el factor de sensibilidad no actúan en automático; en Control-IQ/,
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: /No es adecuada/ }).click();
  await page.locator("#calc-dtd").fill("40");
  await page.locator("#calc-peso").fill("70");
  await expect(
    page.getByText(/Sin reducción: el capítulo da la reducción del 10–20\s%/).first(),
  ).toBeAttached();
});
