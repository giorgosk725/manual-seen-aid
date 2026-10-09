/* Siglas pulsables: solo la primera aparición de cada sigla en el apartado, la más larga manda,
   nunca dentro de una palabra; el botón abre el desarrollo literal y Esc devuelve el foco. */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { APARTADOS } from "./contenido";
import { claveSigla, partirSiglas, primerasSiglas } from "./siglas";
import { Bloques } from "./componentes/Bloques";

const ap = APARTADOS.find((a) => a.slug === "02-componentes")!;
const AXE = {
  rules: {
    region: { enabled: false },
    "page-has-heading-one": { enabled: false },
    "landmark-one-main": { enabled: false },
    "color-contrast": { enabled: false },
  },
};

describe("Siglas pulsables", () => {
  it("marca la primera aparición de cada sigla en el apartado, y solo esa", () => {
    const m = primerasSiglas(ap);
    expect(m.get(claveSigla(0, "p"))).toContain("MCG");
    const b6 = m.get(claveSigla(5, "p")) ?? [];
    expect(b6).toEqual(expect.arrayContaining(["TIR", "TBR", "TAR"]));
    expect(b6).not.toContain("MCG");
    const todas = [...m.values()].flat();
    expect(new Set(todas).size).toBe(todas.length);
  });

  it("la sigla más larga manda y no se marca dentro de una palabra", () => {
    const p = new Set(["TIR", "TIRp", "I/HC", "HC", "ADA"]);
    expect(partirSiglas("TIRp y TIR; ratio I/HC y HC; ADAPTAR", p)).toEqual([
      { t: "TIRp", sigla: "TIRp" },
      { t: " y " },
      { t: "TIR", sigla: "TIR" },
      { t: "; ratio " },
      { t: "I/HC", sigla: "I/HC" },
      { t: " y " },
      { t: "HC", sigla: "HC" },
      { t: "; ADAPTAR" },
    ]);
    expect(partirSiglas("TIR y otra vez TIR", new Set(["TIR"]))).toEqual([
      { t: "TIR", sigla: "TIR" },
      { t: " y otra vez TIR" },
    ]);
  });

  it("el botón abre el desarrollo literal con su página; Esc cierra y devuelve el foco", async () => {
    const user = userEvent.setup();
    const { container } = render(<Bloques apartado={ap} />);
    const boton = screen.getByRole("button", { name: "MCG" });
    await user.click(boton);
    const panel = screen.getByRole("dialog", { name: "Sigla MCG" });
    expect(panel).toHaveTextContent("monitorización continua de glucosa");
    expect(panel).toHaveTextContent("p. 1");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(boton).toHaveFocus();
    // Cada sigla, una sola vez en el apartado.
    expect(screen.getAllByRole("button", { name: "TIR" })).toHaveLength(1);
    expect(await axe(container, AXE)).toHaveNoViolations();
  });
});
