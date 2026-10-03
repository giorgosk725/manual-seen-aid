import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { auditar } from "./axe";

/* Sesión 4 · móvil (393 px): tres consultas frecuentes, cada una a DOS toques desde la portada,
   cronometradas; y las pantallas nuevas sin desbordes ni violaciones de axe. Los tiempos se
   escriben en test-results/tareas-movil.json para el informe. */

const tiempos: Record<string, { toques: number; ms: number }> = {};

const sinScrollHorizontal = async (page: Page, pantalla: string) => {
  const ancho = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(ancho, `${pantalla} desborda ${ancho}px en horizontal`).toBeLessThanOrEqual(0);
};

test.describe("Tareas en dos toques (393 px)", () => {
  test.describe.configure({ mode: "serial" });
  test.afterAll(() => {
    mkdirSync("test-results", { recursive: true });
    writeFileSync("test-results/tareas-movil.json", JSON.stringify(tiempos, null, 2));
  });

  test("conducta de Omnipod 5 en ejercicio aeróbico", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "¿Qué necesitas?" })).toBeVisible();
    const t0 = Date.now();
    await page.getByRole("link", { name: /Ejercicio y sistema/ }).tap();
    await page
      .getByRole("group", { name: "Sistema" })
      .getByRole("button", { name: /Omnipod 5/ })
      .tap();
    await expect(
      page.getByText(/Función Actividad, objetivo 150 mg\/dl; reduce la administración automática/),
    ).toBeVisible();
    tiempos["Omnipod 5 · ejercicio aeróbico"] = { toques: 2, ms: Date.now() - t0 };
  });

  test("qué hacer con β-OHB 1,2 mmol/l", async ({ page }) => {
    await page.goto("/");
    const t0 = Date.now();
    await page.getByRole("link", { name: /Cetonemia \(β-OHB\)/ }).tap();
    await page.getByRole("button", { name: /^β-OHB 1,0-2,9 mmol\/l/ }).tap();
    await expect(page.getByText(/0,1 UI\/kg/).first()).toBeVisible();
    tiempos["β-OHB 1,2 mmol/l"] = { toques: 2, ms: Date.now() - t0 };
  });

  test("objetivos de MCG en la gestación", async ({ page }) => {
    await page.goto("/");
    const t0 = Date.now();
    await page
      .getByRole("link", { name: /Objetivos de MCG/ })
      .first()
      .tap();
    await page
      .getByRole("group", { name: "Población" })
      .getByRole("button", { name: "Gestación" })
      .tap();
    await expect(page.getByText("63–140 mg/dl").first()).toBeVisible();
    await expect(page.getByText("TIRp").first()).toBeVisible();
    tiempos["Objetivos de MCG · gestación"] = { toques: 2, ms: Date.now() - t0 };
  });
});

test.describe("Pantallas nuevas en el móvil", () => {
  for (const [ruta, nombre] of [
    ["/#/pacientes", "Para el paciente"],
    ["/#/pacientes/informacion", "Información para pacientes"],
    ["/#/pacientes/plan/camaps", "Plan de seguridad · CamAPS"],
    ["/#/test", "Autoevaluación"],
    ["/#/visual/gestacion-sistemas", "Gestación por sistema"],
    ["/#/visual/exploraciones", "Exploraciones"],
    ["/#/visual/eleccion", "Elección compartida"],
    ["/#/capitulo/10-situaciones", "Situaciones especiales"],
    ["/#/sistemas/ciq", "Ficha Control-IQ"],
  ] as const) {
    test(`${nombre}: sin desbordes y sin violaciones axe`, async ({ page }) => {
      await page.goto(ruta);
      await page.waitForLoadState("networkidle");
      await sinScrollHorizontal(page, nombre);
      await auditar(page, nombre);
    });
  }
});
