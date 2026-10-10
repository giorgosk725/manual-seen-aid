/* Guías por referencias («Cómo funciona» cada sistema): todo lo citado existe, las frases son
   las que se querían, solo CamAPS lleva Liberty, y la ficha lo pinta con las casillas del sistema. */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { TABLAS } from "./contenido";
import { comoFunciona } from "./guias";
import { frasesDe } from "./inicio";
import { FichaSistema } from "./pantallas/Sistemas";

const IDS = ["mm780", "ciq", "camaps", "op5"] as const;
const AXE = {
  rules: {
    region: { enabled: false },
    "page-has-heading-one": { enabled: false },
    "landmark-one-main": { enabled: false },
    "color-contrast": { enabled: false },
  },
};

describe("Guías por referencias: «Cómo funciona»", () => {
  it("cada pieza citada existe y la casilla del sistema no está vacía", () => {
    IDS.forEach((id, c) => {
      for (const paso of comoFunciona(c, id).pasos) {
        expect(paso.piezas.length, paso.rotulo).toBeGreaterThan(0);
        for (const p of paso.piezas) {
          if (p.t === "frase")
            expect(
              frasesDe(p.apartado, p.bloque, p.k).frases.every((f) => f.length > 20),
              `${p.apartado}/${p.bloque}`,
            ).toBe(true);
          else if (p.t === "casilla")
            expect(
              TABLAS[p.tabla].filas[p.fila]?.celdas[c]?.length ?? 0,
              `${p.tabla}/${p.fila}`,
            ).toBeGreaterThan(0);
          else if (p.t === "enlace") expect(p.ruta).toMatch(/^#\//);
          else throw new Error(`pieza inesperada en «Cómo funciona»: ${p.t}`);
        }
      }
    });
  });

  it("las frases citadas son las que se querían (si el texto cambia, esto avisa)", () => {
    const f = (a: string, b: string, k: number) => frasesDe(a, b, [k]).frases[0];
    expect(f("02-componentes", "b4", 2)).toMatch(/^De su precisión depende la seguridad/);
    expect(f("02-componentes", "b3", 1)).toMatch(/^En modo manual, sigue tasas basales/);
    expect(f("02-componentes", "b5", 1)).toMatch(/^Para el clínico, lo esencial es conocer/);
    expect(f("03-algoritmos", "b1", 0)).toMatch(/^Los sistemas de asa cerrada emplean tres tipos/);
    expect(f("03-algoritmos", "b2", 0)).toMatch(/^En las modalidades híbridas/);
    expect(f("03-algoritmos", "b3", 1)).toMatch(/^CamAPS Liberty es una función/);
    expect(f("04-sistemas", "b4", 1)).toMatch(/^En la práctica clínica, las principales/);
  });

  it("solo CamAPS lleva la frase de Liberty", () => {
    const liberty = (c: number) =>
      comoFunciona(c, IDS[c]).pasos.some((p) =>
        p.piezas.some(
          (x) => x.t === "frase" && x.apartado === "03-algoritmos" && x.bloque === "b3",
        ),
      );
    expect([0, 1, 2, 3].map(liberty)).toEqual([false, false, true, false]);
  });

  it("la ficha enseña «Cómo funciona» con las casillas del sistema", async () => {
    const { container } = render(<FichaSistema id="camaps" seccion="funciona" />);
    expect(
      screen.getByRole("heading", { level: 2, name: /^Cómo funciona · myLoop CamAPS/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Sensor y señal de glucosa" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/^CamAPS Liberty es una función de CamAPS FX/).length).toBe(1);
    expect(await axe(container, AXE)).toHaveNoViolations();
  });
});
