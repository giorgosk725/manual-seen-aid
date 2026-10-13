/* V54-05 · Una pregunta pendiente de verdad recorre los filtros: sin su evento de revisión
   (aquí se quita el de f12 del registro), no sale en la búsqueda, las sugerencias, las
   relacionadas, el índice de búsqueda ni la pantalla de preguntas frecuentes. */
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("./frecuentes.aprobadas.json", async (original) => {
  const m = (await original()) as { default: Record<string, unknown> };
  const sinF12 = { ...m.default };
  delete sinF12.f12;
  return { default: sinF12 };
});

describe("V54-05 · una pregunta pendiente no se ofrece en ningún sitio", () => {
  it("f12 sin revisión: fuera de FRECUENTES, de la respuesta, sugerencias, relacionadas e índice", async () => {
    const { FRECUENTES, FRECUENTES_TODAS } = await import("./frecuentes");
    const { preguntaFrecuente, frecuentesRelacionadas } = await import("./respuestas");
    const { indice, sugerir } = await import("./buscador");
    const f12 = FRECUENTES_TODAS.find((f) => f.id === "f12")!;
    expect(f12.revision.estado).toBe("borrador");
    expect(f12.revision.registro).toMatch(/Sin revisión registrada/);
    expect(FRECUENTES.some((f) => f.id === "f12")).toBe(false);
    expect(FRECUENTES.length).toBe(FRECUENTES_TODAS.length - 1);
    for (const q of [f12.pregunta, ...f12.variantes])
      expect(preguntaFrecuente(q)?.id, q).not.toBe("f12");
    expect(sugerir(f12.pregunta, 10).some((s) => s.frecuente?.id === "f12")).toBe(false);
    expect(frecuentesRelacionadas(f12.pasajes, undefined, 20).some((f) => f.id === "f12")).toBe(
      false,
    );
    expect(JSON.stringify(indice())).not.toContain(f12.pregunta);
  });
  it("la pantalla de preguntas frecuentes no la enseña ni por su dirección", async () => {
    const { default: App } = await import("./App");
    const { FRECUENTES_TODAS } = await import("./frecuentes");
    const f12 = FRECUENTES_TODAS.find((f) => f.id === "f12")!;
    window.location.hash = "#/preguntas/f12";
    render(<App />);
    await waitFor(() => expect(document.querySelector("[data-cargando]")).toBeNull());
    await waitFor(() =>
      expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThan(0),
    );
    expect(screen.queryByText(f12.pregunta)).toBeNull();
  }, 30000);
});
