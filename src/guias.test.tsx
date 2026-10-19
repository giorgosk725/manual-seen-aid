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
    // 0.77.0: datos operativos (src/fichaOperativa.ts), no casillas literales.
    expect(screen.getByLabelText("Algoritmo")).toHaveTextContent(
      /CamAPS FX · MPC adaptativo.*La app del smartphone.*80–198 mg\/dl/,
    );
    expect(screen.getByLabelText("CamAPS Liberty")).toHaveTextContent(/Asa cerrada completa/);
    expect(await axe(container, AXE)).toHaveNoViolations();
  });
});

describe("Fichas operativas (0.77.0)", () => {
  it("cada cifra de una tarjeta está en el texto del capítulo del que sale", async () => {
    const F = await import("./fichaOperativa");
    const { textosDePieza } = await import("./inicio");
    const { plano } = await import("./marcado");
    const porSistema = [
      F.ALGORITMO,
      F.INDICACION.map((g) => g.flatMap((x) => x.datos)),
      F.PARAMETROS,
      F.MODOS,
    ];
    const fallos: string[] = [];
    const cifras = (x: string) => x.match(/\d+(?:,\d+)?/g) ?? [];
    for (const lista of porSistema)
      lista.forEach((datos, c) => {
        for (const d of [
          ...datos,
          ...(F.VARIANTE_OPERATIVA[c]?.datos ?? []),
          ...(F.VARIANTE_RESUMEN[c] ? [F.VARIANTE_RESUMEN[c]!] : []),
        ]) {
          expect(d.f.length, d.r).toBeGreaterThan(0);
          // Las filas comunes a los cuatro (Tabla 4, «unida») tienen una sola casilla, la primera.
          const fuente = plano(
            d.f.flatMap((p) => [...textosDePieza(p, c), ...textosDePieza(p, 0)]).join(" "),
          );
          for (const n of cifras([d.v, d.n ?? "", d.cond ?? "", d.variante?.v ?? ""].join(" ")))
            // La cifra entera: ni pegada a otros dígitos ni a una coma decimal («112,5»).
            if (!new RegExp(`(?<!\\d|\\d,)${n}(?!\\d|,\\d)`).test(fuente))
              fallos.push(`${c} ${d.r}: ${n}`);
        }
      });
    expect(fallos).toEqual([]);
    // Las filas del resumen de la entrada existen en los cuatro (0.78.1: un rótulo renombrado las
    // dejaba fuera sin aviso).
    for (const r of F.RESUMEN)
      F.ALGORITMO.forEach((datos, c) =>
        expect(
          datos.some((d) => d.r === r),
          `${c} ${r}`,
        ).toBe(true),
      );
  });
});

describe("Lo de cada sistema por situación (0.73.0)", () => {
  it("cada pieza existe en el capítulo (los recortes casan) y hay cuatro sistemas", async () => {
    const { GUIA_POR_SISTEMA, TABLA4_POR_SISTEMA, FICHA_PARAMETROS, FICHA_MODOS } =
      await import("./porSistema");
    const { textosDePieza } = await import("./inicio");
    const listas = [
      ...Object.values(GUIA_POR_SISTEMA).map((g) => g.bloques),
      ...Object.values(TABLA4_POR_SISTEMA),
      FICHA_PARAMETROS,
      FICHA_MODOS,
    ];
    for (const bloques of listas) {
      expect(bloques).toHaveLength(4);
      bloques.forEach((bs, c) => {
        for (const b of bs)
          for (const p of b.piezas)
            expect(textosDePieza(p, c).join(" ").length, b.rotulo).toBeGreaterThan(15);
      });
    }
    // Gestación con CamAPS FX: el objetivo por trimestres y que tras el parto se eleva.
    const camaps = GUIA_POR_SISTEMA.gestacion.bloques[2].flatMap((b) => b.piezas);
    const texto = camaps.map((p) => textosDePieza(p, 2).join(" ")).join(" ");
    expect(texto).toMatch(/80–90 mg\/dl/);
    expect(texto).toMatch(/Tras el parto debe elevarse nuevamente el objetivo/);
    // Lo complementario (folleto de Tandem), solo con Control-IQ, rotulado y con su fuente.
    const k = GUIA_POR_SISTEMA.gestacion.complementos ?? {};
    expect(Object.keys(k)).toEqual(["1"]);
    expect(k[1].aviso).toMatch(/no es texto del capítulo/);
    expect(k[1].fuente).toMatch(/MAT-2075_1/);
  });
});
