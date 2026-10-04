/* Recorrido «Iniciar un sistema»: que cada pieza apunte a texto del capítulo que existe, que
   cada sistema tenga su línea de inicialización y que la pantalla y la hoja se pinten. */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { FASES, frasesDe, hojaDeComprobacion, lineasInicializacion, listaDe } from "./inicio";
import { IniciarSistema } from "./pantallas/Inicio";

describe("Iniciar un sistema: el texto sale del capítulo", () => {
  it("cada frase, lista y fila citada existe", () => {
    for (const f of FASES)
      for (const p of f.piezas) {
        if (p.t === "frase" || p.t === "hito") {
          const r = frasesDe(p.apartado, p.bloque, p.k);
          expect(
            r.frases.every((x) => x.length > 20),
            `${p.apartado}/${p.bloque}`,
          ).toBe(true);
        }
        if (p.t === "lista") expect(listaDe(p.apartado, p.bloque).items.length).toBeGreaterThan(0);
      }
  });
  it("las frases citadas son las que se querían (si el texto cambia, esto avisa)", () => {
    expect(frasesDe("06-indicaciones", "b3", [0]).frases[0]).toMatch(/^Los requisitos previos/);
    expect(frasesDe("06-indicaciones", "b5", [2]).frases[0]).toMatch(/^La indicación se concreta/);
    expect(frasesDe("07-educacion", "b1", [2]).frases[0]).toMatch(/^Debe estructurarse en dos/);
    expect(frasesDe("08-iniciacion", "b6", [0]).frases[0]).toMatch(/^Antes de activar el modo/);
    expect(frasesDe("08-iniciacion", "b8", [2]).frases[0]).toMatch(/^Su peso varía por sistema/);
    expect(frasesDe("08-iniciacion", "b7", [1]).frases[0]).toMatch(/^El tipo de basal previa/);
    expect(frasesDe("08-iniciacion", "b9", [1]).frases[0]).toMatch(/^El contacto remoto inicial/);
    expect(frasesDe("08-iniciacion", "b9", [3]).frases[0]).toMatch(/^La visita a los 3 meses/);
    expect(frasesDe("09-descarga", "b2", [0]).frases[0]).toMatch(/^La tasa basal, la ratio/);
    expect(frasesDe("08-iniciacion", "b12", [3]).frases[0]).toMatch(/^Estas circunstancias no son/);
  });
  it("cada sistema tiene su línea de inicialización de la Tabla 2", () => {
    expect(lineasInicializacion()).toHaveLength(4);
    expect(lineasInicializacion(0)[0]).toMatch(/^MiniMed 780G: SmartGuard requiere 48 h/);
    expect(lineasInicializacion(3)[0]).toMatch(
      /^Omnipod 5: iniciar modo automático desde el primer pod/,
    );
  });
  it("la hoja lleva el plan de respaldo, el plan de seguridad y la línea del sistema", () => {
    const h = hojaDeComprobacion(1);
    expect(h.antes[0].texto).toMatch(/^Entregar una pauta escrita/);
    expect(h.antes.some((x) => x.texto.startsWith("Control-IQ:"))).toBe(true);
    expect(h.antes.some((x) => x.texto.startsWith("Omnipod 5:"))).toBe(false);
    expect(
      hojaDeComprobacion().antes.filter((x) => /^(MiniMed|Control|CamAPS|Omnipod)/.test(x.texto)),
    ).toHaveLength(4);
    expect(h.citas).toHaveLength(4);
  });
});

describe("Iniciar un sistema: pantalla", () => {
  it("con Omnipod 5, la fase de inicio enseña solo su línea y sus casillas", async () => {
    const { container } = render(<IniciarSistema detalle="inicio:omnipod-5" />);
    expect(
      screen.getByText(/^Omnipod 5: iniciar modo automático desde el primer pod/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^MiniMed 780G: SmartGuard/)).toBeNull();
    expect(screen.getByRole("heading", { name: /Inicio del sistema/ })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it("la hoja de comprobación se pinta con sus casillas", async () => {
    const { container } = render(<IniciarSistema detalle="hoja:control-iq" />);
    expect(
      screen.getByRole("heading", {
        name: /Inicio de un sistema de asa cerrada · Tandem Control-IQ/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(10);
    expect(await axe(container)).toHaveNoViolations();
  });
});
