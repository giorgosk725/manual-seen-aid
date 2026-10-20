/* 0.72.0: las cifras con unidad, en negrita en las pantallas de consulta, sin cambiar el texto. */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ConCifras, Texto } from "./texto";

const cifras = (t: string) => {
  const { container } = render(
    <ConCifras>
      <p>
        <Texto>{t}</Texto>
      </p>
    </ConCifras>,
  );
  return {
    // 0.81.1: los espacios duros entre cifra y unidad no cambian el texto.
    texto: container.textContent?.replace(/\u00a0/g, " "),
    marcadas: [...container.querySelectorAll(".cifra")].map((b) =>
      b.textContent?.replace(/\u00a0/g, " "),
    ),
  };
};

describe("Cifras con unidad", () => {
  it("marca dosis, tiempos, porcentajes y glucemias; el texto queda igual", () => {
    const t = "5-10 g ante glucemia 54-70 mg/dl; reevaluar a los 15 min; ≥ 70 % y 1–2 h";
    const r = cifras(t);
    expect(r.texto).toBe(t);
    expect(r.marcadas).toEqual(["5-10 g", "54-70 mg/dl", "15 min", "≥ 70 %", "1–2 h"]);
  });
  it("no marca nombres de sistemas ni cifras sin unidad", () => {
    expect(cifras("MiniMed 780G y Omnipod 5, TAR > 180").marcadas).toEqual([]);
  });
});
