/* Auditoria de accesibilidad con axe DENTRO del navegador (lo que jsdom no puede hacer:
   sin CSS no hay color calculado y axe apaga `color-contrast`). Lo usan el recorrido de
   modo nocturno y el de movil. */
import { expect, type Page } from "@playwright/test";
import { createRequire } from "node:module";

const AXE = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

// La app es una SPA con un unico main. Desde la 0.6.1 el orden de encabezados y los puntos
// de referencia unicos SI se comprueban (tablas, figuras y diagramas toman su nivel del
// contexto; los <aside> llevan nombre).
const DESACTIVADAS = {
  region: { enabled: false },
  "page-has-heading-one": { enabled: false },
  "landmark-one-main": { enabled: false },
};

type Violacion = { id: string; impact?: string; nodes: { target: string[] }[] };

export async function auditar(page: Page, pantalla: string) {
  // Las tarjetas entran con animacion (`animate-in`): mientras dura, la opacidad es < 1 y
  // axe mide el contraste del color ya mezclado con el fondo. Se espera a que terminen.
  await page.evaluate(
    () =>
      Promise.race([
        Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
        new Promise((r) => setTimeout(r, 2000)),
      ]) as Promise<unknown>,
  );
  await page.addScriptTag({ path: AXE });
  const r = await page.evaluate(
    async (rules) =>
      // @ts-expect-error axe se inyecta en la pagina
      (await window.axe.run(
        // Fuera los numerales fantasma de las tarjetas: son `aria-hidden`, no reciben
        // puntero y van a opacidad 0,1 A PROPOSITO (marca de agua para escanear el orden).
        // WCAG 1.4.3 exime la decoracion pura del minimo de contraste, pero axe no puede
        // saber que lo son y los reporta uno por tarjeta: en Evidencia son diez de diez.
        { exclude: [['[aria-hidden="true"][class*="pointer-events-none"]']] },
        { rules },
      )) as { violations: Violacion[] },
    DESACTIVADAS,
  );
  const detalle = r.violations
    .map((v) => `${v.id} (${v.impact}) en ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
    .join("\n");
  expect(r.violations, `${pantalla} en modo nocturno:\n${detalle}`).toHaveLength(0);
}
