/* La calculadora de inicio: solo reglas y textos del capítulo, y las cuentas bien hechas. */
import { describe, expect, it } from "vitest";
import { APARTADOS, TABLAS } from "./contenido";
import {
  DESDE_ISCI,
  INDICACION,
  INICIALIZACION,
  NUCLEO_COMUN,
  REGLAS,
  evaluar,
  leerCifra,
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

describe("calculadora de inicio: las cuentas (contrato de la 0.63)", () => {
  const base = {
    origen: "mdi" as const,
    referencia: false,
    basal: "22",
    rapida: "20",
    dtd: "",
    peso: "70",
    reduccion: 10,
    basalPct: 45,
    regla: 1700 as const,
  };
  const cerca = (x: number | null, y: number) => expect(x! - y).toBeCloseTo(0, 6);
  it("MDI: reducción, basal plana, 450 y 1700, sin redondear por dentro", () => {
    const e = evaluar(1, base);
    expect(e.lista).toBe(true);
    cerca(e.dtdPrevia, 42);
    cerca(e.dtdInicio, 37.8);
    cerca(e.basalDia, 17.01);
    cerca(e.basalHora, 17.01 / 24);
    cerca(e.ratio, 450 / 37.8);
    cerca(e.factor, 1700 / 37.8);
  });
  it("la regla del 1800 y sin reducción", () => {
    const e = evaluar(0, { ...base, reduccion: 0, regla: 1800 });
    cerca(e.dtdInicio, 42);
    expect(Math.round(e.factor!)).toBe(43);
  });
  it("I61-01: vacío, texto, negativo, exponente o dos separadores no dan cifras", () => {
    for (const rapida of ["", "abc", "-5", "1e2", "1,2,3", "1.2.3", " "]) {
      const e = evaluar(0, { ...base, rapida });
      expect(e.lista, rapida).toBe(false);
      expect([e.dtdInicio, e.basalHora, e.ratio, e.factor], rapida).toEqual([
        null,
        null,
        null,
        null,
      ]);
    }
    // Un vacío es «falta»; un texto, «error»: nunca un cero.
    expect(evaluar(0, { ...base, rapida: "" }).faltan).toContain("Insulina rápida");
    expect(evaluar(0, { ...base, rapida: "abc" }).errores[0]).toMatch(/^Insulina rápida/);
  });
  it("I61-01: coma y punto decimales valen; el 0 explícito vale", () => {
    expect(evaluar(0, { ...base, basal: "22,5", rapida: "0" }).lista).toBe(true);
    expect(evaluar(0, { ...base, basal: "22.5", rapida: "0" }).lista).toBe(true);
    expect(leerCifra("0", 400)).toEqual({ estado: "valido", v: 0 });
    expect(leerCifra("", 400)).toEqual({ estado: "vacio" });
    expect(leerCifra("401", 400).estado).toBe("invalido");
  });
  it("I61-09: una DTD diminuta o enorme no da derivados (ni DTD cero con ratio positiva)", () => {
    for (const [b, r] of [
      ["0", "0"],
      ["0,001", "0"],
      ["300", "200"],
    ]) {
      const e = evaluar(0, { ...base, basal: b, rapida: r });
      expect(e.lista).toBe(false);
      expect(e.ratio).toBeNull();
      expect(e.errores.join(" ")).toMatch(/fuera de lo que admite esta ayuda/);
    }
  });
  it("I61-02: bomba que funcionaba en CamAPS FX pide DTD y peso; no calcula nada", () => {
    const isci = { ...base, origen: "isci" as const, referencia: true, basal: "", rapida: "" };
    const sinDtd = evaluar(2, { ...isci, dtd: "" });
    expect(sinDtd.faltan).toEqual(["DTD actual"]);
    expect(sinDtd.lista).toBe(false);
    const con = evaluar(2, { ...isci, dtd: "40" });
    expect(con.lista).toBe(true);
    expect(con.calcula).toEqual({ basal: false, ratioFactor: false });
    expect(con.basalHora).toBeNull();
    // En MiniMed 780G la DTD no hace falta para trasladar.
    expect(evaluar(0, { ...isci, dtd: "", peso: "" }).lista).toBe(true);
  });
  it("I61-02/03: el peso se comprueba aunque no se calcule, y fuera de indicación no hay propuesta", () => {
    const isci = { ...base, origen: "isci" as const, referencia: true, dtd: "40", peso: "8" };
    const e = evaluar(2, isci);
    expect(e.indicacion.fuera[0]).toMatch(
      /peso \(8 kg\) queda fuera de la indicación de CamAPS FX/,
    );
    expect(e.lista).toBe(false);
    const m = evaluar(2, { ...base, peso: "8", rapida: "20", basal: "20" });
    expect(m.lista).toBe(false);
    expect(m.ratio).not.toBeNull(); // la cuenta existe, pero no se ofrece como propuesta
  });
  it("I61-03: Control-IQ / Control-IQ+: dentro de una sola variante queda pendiente", () => {
    const e = evaluar(1, { ...base, basal: "80", rapida: "80", reduccion: 0 }); // DTD 160
    expect(e.indicacion.fuera).toEqual([]);
    expect(e.indicacion.variante).toMatch(/Control-IQ\+, no en la de Control-IQ/);
    expect(e.lista).toBe(true);
    const fuera = evaluar(1, { ...base, basal: "2", rapida: "2", reduccion: 0 }); // DTD 4
    expect(fuera.indicacion.fuera[0]).toMatch(/Control-IQ y Control-IQ\+/);
    expect(fuera.lista).toBe(false);
  });
  it("I61-03: sin peso, Control-IQ y CamAPS FX no están listos; 780G y Omnipod 5, sí", () => {
    for (const c of [1, 2]) expect(evaluar(c, { ...base, peso: "" }).faltan).toContain("Peso");
    for (const c of [0, 3]) expect(evaluar(c, { ...base, peso: "" }).lista).toBe(true);
    expect(evaluar(0, { ...base, peso: "abc" }).lista).toBe(false);
  });
  it("I61-07: MDI con ratio y factor propios: se calcula la basal, no 450/1700", () => {
    const e = evaluar(0, { ...base, referencia: true });
    expect(e.calcula).toEqual({ basal: true, ratioFactor: false });
    expect(e.ratio).toBeNull();
    expect(e.basalDia).not.toBeNull();
  });
  it("reducción de partida: 10, 20 y 0 %; con ultralarga y buen control, 20 %", () => {
    expect(
      ["bueno", "riesgo", "deficiente"].map((c) => reduccionDePartida(c as never, false)),
    ).toEqual([10, 20, 0]);
    expect(reduccionDePartida("bueno", true)).toBe(20);
    expect(reduccionDePartida("deficiente", true)).toBe(0);
  });
});
