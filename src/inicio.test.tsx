/* Recorrido «Iniciación del sistema»: que cada pieza apunte a texto del capítulo que existe, que
   cada sistema tenga su línea de inicialización y que la pantalla y la hoja se pinten. */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { FASES, frasesDe, hojaDeComprobacion, lineasInicializacion, listaDe } from "./inicio";
import { IniciarSistema } from "./pantallas/Inicio";

describe("Iniciación del sistema: el texto sale del capítulo", () => {
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
    // Empieza por el plan de seguridad (p. 7), cuya pauta de respaldo ya cubre la de la Tabla 2.
    expect(h.antes[0].texto).toMatch(/^Pauta de respaldo con insulina basal y rápida en pluma/);
    expect(h.antes.some((x) => x.texto.startsWith("Entregar una pauta escrita"))).toBe(false);
    expect(h.antes.some((x) => x.texto.startsWith("Control-IQ:"))).toBe(true);
    expect(h.antes.some((x) => x.texto.startsWith("Omnipod 5:"))).toBe(false);
    expect(
      hojaDeComprobacion().antes.filter((x) => /^(MiniMed|Control|CamAPS|Omnipod)/.test(x.texto)),
    ).toHaveLength(4);
    expect(h.citas).toHaveLength(4);
  });
});

describe("Iniciación del sistema: tareas", () => {
  it("cada pieza de cada fase está en una tarea o suelta, y ninguna en dos", async () => {
    const { tareasDe, piezasSueltas } = await import("./inicio");
    for (const f of FASES) {
      const vistas = new Map<number, number>();
      for (const t of tareasDe(f.id))
        for (const i of t.piezas) vistas.set(i, (vistas.get(i) ?? 0) + 1);
      expect(
        [...vistas.values()].every((v) => v === 1),
        f.id,
      ).toBe(true);
      const cubiertas = new Set([...vistas.keys(), ...piezasSueltas(f)]);
      expect(cubiertas.size, f.id).toBe(f.piezas.length);
      expect(tareasDe(f.id).length, f.id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Iniciación del sistema: pantalla", () => {
  it("con Omnipod 5, la fase de inicio enseña solo su línea y sus casillas", async () => {
    const { container } = render(<IniciarSistema detalle="inicio:omnipod-5:arranque" />);
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
        // 1.0.14: el nombre de la app, como la calculadora y el plan.
        name: "Inicio de un sistema de asa cerrada · Control-IQ / Control-IQ+",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(10);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Guía paso a paso y momentos de las situaciones (0.43.0)", () => {
  it("todas las piezas de la guía y todos los momentos existen en el capítulo", async () => {
    const { PASOS_GUIA } = await import("./guia-inicio");
    const { textosDePieza, kDe, frasesDe } = await import("./inicio");
    const { GUION, SITUACIONES_GUIA } = await import("./situaciones");
    for (const p of PASOS_GUIA) {
      for (const pz of p.piezas) expect(textosDePieza(pz, 3).length, p.id).toBeGreaterThan(0);
      for (const q of p.preguntas ?? [])
        for (const o of q.opciones)
          for (const pz of o.piezas) expect(textosDePieza(pz, 3).length, o.id).toBeGreaterThan(0);
    }
    const momentos = [...Object.values(GUION).flat(), ...SITUACIONES_GUIA.flatMap((s) => s.guion)];
    for (const m of momentos) {
      const k = m.k ?? kDe(m.apartado, m.bloque);
      expect(frasesDe(m.apartado, m.bloque, k).frases.length, m.rotulo).toBeGreaterThan(0);
    }
    expect(PASOS_GUIA.length).toBe(5);
  });
});

describe("Guía: preguntas dependientes (0.43.1)", () => {
  it("la basal solo se pregunta con MDI y su respuesta se borra al cambiar la pauta", async () => {
    const { PASOS_GUIA, preguntasActivas, limpiarRespuestas } = await import("./guia-inicio");
    const p = PASOS_GUIA[0];
    expect(preguntasActivas(p, {}).map((q) => q.id)).toEqual(["pauta"]);
    expect(preguntasActivas(p, { pauta: "mdi" }).map((q) => q.id)).toEqual(["pauta", "basal"]);
    expect(limpiarRespuestas({ pauta: "isci", basal: "larga" })).toEqual({ pauta: "isci" });
    expect(limpiarRespuestas({ pauta: "", basal: "larga" })).toEqual({});
    expect(p.enlace?.(3, { pauta: "isci" })?.texto).toMatch(/criterios/i);
    // Sin elegir, la continuación es la de MDI (la pauta más frecuente) y se enseña todo.
    expect(p.enlace?.(3, {})?.texto).toMatch(/MDI/);
  });
});

describe("Fase Inicio paso a paso (0.47.0)", () => {
  it("los cinco pasos cubren todas las piezas de la fase, en el orden de trabajo", async () => {
    const { PASOS_GUIA, piezasDePaso, pasoDeRuta } = await import("./guia-inicio");
    const fase = FASES.find((f) => f.id === "inicio")!;
    const enPasos = new Set(
      PASOS_GUIA.flatMap((p) => piezasDePaso(p, {})).map((x) => JSON.stringify(x)),
    );
    for (const pz of fase.piezas)
      if (pz.t !== "enlace") expect(enPasos.has(JSON.stringify(pz)), JSON.stringify(pz)).toBe(true);
    expect(PASOS_GUIA.map((p) => p.id)).toEqual([
      "transicion",
      "parametros",
      "objetivos",
      "respaldo",
      "arranque",
    ]);
    expect(pasoDeRuta("arranque")).toBe(4);
    expect(pasoDeRuta("pauta")).toBe(0);
    expect(pasoDeRuta("3")).toBe(2);
  });
  it("sin elegir pauta se enseña todo; con bomba, solo lo de bomba", async () => {
    const { PASOS_GUIA, piezasDePaso } = await import("./guia-inicio");
    const p = PASOS_GUIA[0];
    expect(piezasDePaso(p, {}).length).toBe(7);
    expect(piezasDePaso(p, { pauta: "isci" }).length).toBe(1);
    expect(piezasDePaso(p, { pauta: "mdi" }).length).toBe(5);
    expect(piezasDePaso(p, { pauta: "mdi", basal: "larga" }).length).toBe(4);
  });
});
