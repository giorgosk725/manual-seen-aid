/* Situaciones (0.63.0): el filtro con siglas y alias, y los momentos de las guías por
   referencias, que existen en el capítulo. */
import { describe, expect, it } from "vitest";
import { ALIAS, GUION, SITUACIONES, SITUACIONES_GUIA, casaFiltro } from "./situaciones";
import { frasesDe, kDe } from "./inicio";

const nombres = (id: string) => {
  const s = [...SITUACIONES, ...SITUACIONES_GUIA].find((x) => x.id === id)!;
  return [s.etiqueta, ...(ALIAS[id] ?? [])];
};

describe("filtro de situaciones (S61-02)", () => {
  it("las siglas cortas casan con la palabra entera, no con un trozo", () => {
    expect(casaFiltro("tac", nombres("tc"))).toBe(true);
    expect(casaFiltro("tac", nombres("gestacion"))).toBe(false);
    expect(casaFiltro("rm", nombres("rm"))).toBe(true);
    expect(casaFiltro("ecg", nombres("eco"))).toBe(true);
    expect(casaFiltro("ecg", nombres("rm"))).toBe(false);
  });
  it("los alias habituales llevan a su situación", () => {
    expect(casaFiltro("corticoides", nombres("glucocorticoides"))).toBe(true);
    expect(casaFiltro("renal", nombres("dialisis"))).toBe(true);
    expect(casaFiltro("embarazo", nombres("gestacion"))).toBe(true);
    expect(casaFiltro("dormir", nombres("sueno"))).toBe(true);
    expect(casaFiltro("", nombres("rm"))).toBe(true);
  });
});

describe("guías por referencias (S61-03)", () => {
  it("cada momento apunta a frases que existen en su párrafo", () => {
    const momentos = [...Object.values(GUION).flat(), ...SITUACIONES_GUIA.flatMap((g) => g.guion)];
    for (const m of momentos)
      for (const x of [m, ...(m.mas ?? [])]) {
        const f = frasesDe(x.apartado, x.bloque, x.k ?? kDe(x.apartado, x.bloque));
        expect(f.frases.length, `${x.apartado}/${x.bloque}`).toBeGreaterThan(0);
        expect(f.frases.every(Boolean), `${x.apartado}/${x.bloque}`).toBe(true);
      }
  });
  it("los cinco temas del apartado 10 que solo enlazaban tienen guía", () => {
    for (const id of [
      "enfermedad-intercurrente",
      "glucocorticoides",
      "mayores",
      "dialisis",
      "adolescencia",
    ])
      expect(
        SITUACIONES_GUIA.some((g) => g.id === id),
        id,
      ).toBe(true);
  });
});
