/* La calculadora de inicio: solo reglas y textos del capítulo, y las cuentas bien hechas. */
import { describe, expect, it } from "vitest";
import { APARTADOS, TABLAS } from "./contenido";
import {
  DESDE_ISCI,
  INDICACION,
  INICIALIZACION,
  NUCLEO_COMUN,
  REGLAS,
  calcular,
  fueraDeIndicacion,
  papelEnAutomatico,
  reduccionDePartida,
  gruposDeProgramar,
  modosDe,
  RECAMBIOS,
} from "./calculadora";

const t2 = (etiqueta: string) => TABLAS.T2.filas.find((f) => f.etiqueta === etiqueta)!.celdas;
const apartado8 = APARTADOS.find((a) => a.slug === "08-iniciacion")!
  .bloques.map((b) => ("texto" in b ? b.texto : ""))
  .join(" ");

describe("calculadora de inicio: texto del capítulo", () => {
  it("cada regla es la celda literal de la Tabla 2", () => {
    const pares: [string, { texto: string; nota: string }][] = [
      ["Reducción de la DTD al pasar de MDI", REGLAS.reduccion],
      ["Distribución basal/bolo inicial", REGLAS.basal],
      ["Cálculo inicial de ratio I/HC (g de HC por 1 UI)", REGLAS.ratio],
      ["Cálculo inicial del factor de sensibilidad", REGLAS.factor],
      ["Objetivo del calculador de bolos manual", REGLAS.objetivo],
      ["Solapamiento con glargina U–300 o degludec", REGLAS.solapamiento],
      ["Plan de respaldo antes del inicio", REGLAS.respaldo],
    ];
    for (const [e, r] of pares) expect([r.texto, r.nota], e).toEqual(t2(e));
    expect(TABLAS.T2.notas).toContain(REGLAS.partida);
  });
  it("lo de ISCI y el núcleo común son frases del apartado 8", () => {
    for (const x of [...Object.values(DESDE_ISCI), NUCLEO_COMUN.texto])
      expect(apartado8, x).toContain(x);
  });
  it("qué programar en cada sistema sale de la fila de inicialización de la Tabla 2", () => {
    const celda = t2("Inicialización del modo automático (por sistema)")[0];
    for (const s of INICIALIZACION) expect(celda).toContain(s.previo);
  });
  it("los límites de indicación están escritos en la Tabla 1", () => {
    const fila = TABLAS.T1.filas.find((f) => f.etiqueta === "Indicación")!.celdas;
    const comprobar = (c: number, trozo: string) => expect(fila[c], trozo).toContain(trozo);
    comprobar(0, "DTD ≥ 6 UI/día");
    comprobar(1, "peso 25–140 kg, DTD 10–100 UI/día");
    comprobar(1, "peso 9–200 kg, DTD 5–200 UI/día");
    comprobar(2, "peso ≥ 10 kg; DTD 5–350 UI/día");
    comprobar(3, "sin peso mínimo; DTD ≥ 5 UI/día");
    expect(INDICACION.map((v) => v.length)).toEqual([1, 2, 1, 1]);
  });
  it("el papel de cada parámetro en automático es la Tabla 3", () => {
    expect(papelEnAutomatico("basal", 0)).toBe(
      "Se utiliza en modo manual o de respaldo; no influye en el modo automático",
    );
    expect(papelEnAutomatico("ia", 3)).toMatch(/^Ajustable, 2–6 h/);
    expect(papelEnAutomatico("ratio", 3)).toMatch(/basal adaptativa en pods sucesivos$/);
    // La celda entera: en el 780G, la segunda línea de la insulina activa.
    expect(papelEnAutomatico("ia", 0)).toContain("intensifica especialmente las autocorrecciones");
  });
});

describe("calculadora de inicio: qué programar, por importancia", () => {
  it("lo que cuenta en automático es lo marcado con asterisco en la Tabla 1 (y lo de arrancar)", () => {
    expect([0, 1, 2, 3].map((c) => gruposDeProgramar(c))).toEqual([
      { automatico: ["objetivoAlg", "ia"], manual: ["basal", "ratio", "factor", "objetivo"] },
      { automatico: ["peso", "dtd", "factor", "basal"], manual: ["ratio", "objetivo"] },
      {
        automatico: ["peso", "dtd", "objetivoAlg"],
        manual: ["basal", "ratio", "factor", "objetivo"],
      },
      { automatico: ["objetivoAlg", "basal"], manual: ["factor", "ia", "ratio", "objetivo"] },
    ]);
  });
  it("los modos de Control-IQ incluyen el modo sueño y el de ejercicio, tal cual en las tablas", () => {
    const m = modosDe(1)
      .map((x) => x.texto)
      .join(" ");
    expect(m).toContain("Modo sueño: franja horaria configurable");
    expect(m).toContain("Modo ejercicio, rango 140–160 mg/dl");
    for (const x of modosDe(2))
      expect(JSON.stringify([TABLAS.T3, TABLAS.T4])).toContain(
        JSON.stringify(x.texto).slice(1, -1),
      );
  });
  it("los recambios son ítems literales del apartado 7", () => {
    const items = APARTADOS.find((a) => a.slug === "07-educacion")!.bloques.flatMap((b) =>
      "items" in b ? b.items : [],
    );
    expect(items).toContain(RECAMBIOS.educacion);
    expect(items).toContain(RECAMBIOS.plan);
  });
});

describe("calculadora de inicio: las cuentas", () => {
  const base = {
    origen: "mdi" as const,
    basal: 22,
    rapida: 20,
    dtdIsci: 0,
    peso: 70,
    reduccion: 10,
    basalPct: 45,
    regla: 1700 as const,
    objetivo: 100,
  };
  it("MDI: reducción, basal plana, 450 y 1700", () => {
    expect(calcular(base)).toEqual({
      dtdPrevia: 42,
      dtdInicial: 37.8,
      basalDia: 17,
      basalHora: 0.71,
      ratio: 11.9,
      factor: 45,
    });
  });
  it("la regla del 1800 y sin reducción", () => {
    const r = calcular({ ...base, reduccion: 0, regla: 1800 })!;
    expect(r.dtdInicial).toBe(42);
    expect(r.factor).toBe(43);
    expect(r.ratio).toBe(10.7);
  });
  it("ISCI sin referencia: sin reducción", () => {
    const r = calcular({ ...base, origen: "isci", dtdIsci: 40, reduccion: 20 })!;
    expect(r.dtdInicial).toBe(40);
    expect(r.basalHora).toBe(0.75);
  });
  it("reducción de partida: 10, 20 y 0 %; con ultralarga y buen control, 20 %", () => {
    expect(
      ["bueno", "riesgo", "deficiente"].map((c) => reduccionDePartida(c as never, false)),
    ).toEqual([10, 20, 0]);
    expect(reduccionDePartida("bueno", true)).toBe(20);
    expect(reduccionDePartida("deficiente", true)).toBe(0);
  });
  it("sin dosis no calcula", () => {
    expect(calcular({ ...base, basal: 0, rapida: 0 })).toBeNull();
  });
  it("avisa si la DTD o el peso quedan fuera de la indicación", () => {
    expect(fueraDeIndicacion(1, 8, 70)).toEqual([
      "La DTD de inicio (8 UI/día) queda fuera de la indicación de Control-IQ.",
    ]);
    expect(fueraDeIndicacion(1, 150, 20)).toHaveLength(2);
    expect(fueraDeIndicacion(3, 4, 0)).toHaveLength(1);
    expect(fueraDeIndicacion(0, 30, 0)).toEqual([]);
  });
});
