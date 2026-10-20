/* Referencias de la línea de fuente cuyo texto, pulsado, abre otra (fuentes-clic*.spec.ts). */
import { expect, type Page } from "@playwright/test";

export async function tapados(page: Page) {
  const enlaces = page.locator("main .fuente-pie a:visible");
  await expect(enlaces.first()).toBeVisible();
  return enlaces.evaluateAll((as) =>
    as.flatMap((a) =>
      [...a.querySelectorAll(":scope > span")].flatMap((sp) =>
        [...sp.getClientRects()].flatMap((r) =>
          [0.15, 0.5, 0.85].flatMap((f) => {
            if (r.width < 2) return [];
            const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height * f);
            const destino = el?.closest("a");
            return destino && destino !== a ? [`${a.textContent} (${f})`] : [];
          }),
        ),
      ),
    ),
  );
}
