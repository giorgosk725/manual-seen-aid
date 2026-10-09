/* «Preguntas al capítulo»: umbrales sobre los bancos de respuestas.bancos.ts. Los bancos
   «ciego», «final» y «quinto» se midieron a ciegas una vez (docs/PREGUNTAS_2026-10-04.md);
   aquí vigilan que lo conseguido no se pierda. */
import { describe, expect, it } from "vitest";
import { preguntaFrecuente, responder, respuestaDeFrecuente } from "./respuestas";
import { FRECUENTES } from "./frecuentes";
import { EJEMPLOS_PREGUNTA } from "./busqueda";
import {
  BANCO,
  CIEGO,
  CONTROL,
  FINAL,
  NO_CONSTA,
  QUINTO,
  medir,
  medirCiego,
  type PreguntaCiega,
} from "./respuestas.bancos";
import ciego1 from "./bancos/ciego1.json";
import ciego2 from "./bancos/ciego2.json";
import ciego3 from "./bancos/ciego3.json";
import ciego4 from "./bancos/ciego4.json";
import ciego5 from "./bancos/ciego5.json";
import ciego6 from "./bancos/ciego6.json";

const informe = (nombre: string, m: ReturnType<typeof medir>) =>
  console.log(
    `${nombre}: primera ${(m.primera * 100).toFixed(0)} %, entre las tres ${(m.entreTres * 100).toFixed(0)} %\n` +
      m.fallos.join("\n"),
  );

describe("Preguntas al capítulo", () => {
  it("banco principal: la primera respuesta acierta en al menos el 90 %", () => {
    const m = medir(BANCO.map(([q, e]) => [q, e]));
    informe("Principal", m);
    expect(m.primera).toBeGreaterThanOrEqual(0.9);
  });
  it("lo que el capítulo no trata da «no consta»", () => {
    // «No consta»: ninguna respuesta directa (como mucho, «lo más cercano», marcado).
    for (const q of NO_CONSTA)
      expect(
        responder(q).filter((r) => !r.aproximada),
        q,
      ).toEqual([]);
  });
  // Bancos ciegos de otro agente (240, 150 y 120 preguntas): cada uno, medido a ciegas una vez
  // (docs/PREGUNTAS_2026-10-04.md); los dos primeros, luego usados para afinar. Los umbrales,
  // justo por debajo de lo logrado.
  it("bancos ciegos del agente: acierto y respuestas equivocadas presentadas como directas", () => {
    for (const [nombre, banco, primera, entreTres, equivocadas] of [
      // Desde la 0.13.0 cuentan también las preguntas frecuentes (lo que ve el usuario).
      ["Ciego 1", ciego1 as PreguntaCiega[], 0.72, 0.86, 0.23],
      ["Ciego 2", ciego2 as PreguntaCiega[], 0.48, 0.53, 0.25],
      // Medido a ciegas con el motor ya cerrado (la cifra honesta de la 0.10.0).
      ["Ciego 3", ciego3 as PreguntaCiega[], 0.4, 0.5, 0.19],
      // 80 preguntas de residentes, adjuntos y enfermería (auditoría externa del 6-10-2026),
      // medidas una vez con el motor de la 0.12.0 ya cerrado: 60 %, 73,8 % y 17,5 %.
      ["Ciego 4", ciego4 as PreguntaCiega[], 0.57, 0.72, 0.2],
      // 80 preguntas nuevas, medidas una vez con el motor de la 0.13.0 ya cerrado: sin preguntas
      // frecuentes 55 %, 66,3 % y 18,8 %; con ellas, 57,5 %, 67,5 % y 17,5 %.
      ["Ciego 5", ciego5 as PreguntaCiega[], 0.56, 0.66, 0.19],
      // 100 preguntas nuevas, medidas una vez con la 0.14.0 ya cerrada. Aquí, solo por palabras
      // (66 %, 77 %, 18 %); con la búsqueda por el sentido, 70 %, 83 % y 15 % (docs/SEMANTICA.md).
      ["Ciego 6", ciego6 as PreguntaCiega[], 0.65, 0.76, 0.18],
    ] as const) {
      const m = medirCiego(banco);
      console.log(
        `${nombre}: primera ${(m.primera * 100).toFixed(1)} %, entre las tres ${(m.entreTres * 100).toFixed(1)} %, directas equivocadas ${(m.equivocadas * 100).toFixed(1)} %`,
      );
      expect(m.primera, nombre).toBeGreaterThanOrEqual(primera);
      expect(m.entreTres, nombre).toBeGreaterThanOrEqual(entreTres);
      expect(m.equivocadas, nombre).toBeLessThanOrEqual(equivocadas);
    }
  });
  it("bancos de control, ciego, final y quinto", () => {
    for (const [nombre, banco, minimo] of [
      ["Control", CONTROL, 0.85],
      ["Ciego", CIEGO, 0.8],
      ["Final", FINAL, 0.8],
      ["Quinto", QUINTO, 0.5],
    ] as const) {
      const m = medir(banco);
      informe(nombre, m);
      expect(m.primera, nombre).toBeGreaterThanOrEqual(minimo);
    }
  });
  it("los ejemplos de la pantalla Buscar tienen respuesta", () => {
    for (const q of EJEMPLOS_PREGUNTA) expect(responder(q).length, q).toBeGreaterThan(0);
  });
  // Las seis preguntas de la auditoría externa del 6-10-2026 (tres fallaban en la 0.11.0).
  it("auditoría externa: sistema nombrado, salidas del automático y cetonas sin cifra", () => {
    const primera = (q: string) => responder(q)[0];
    const op5 = primera("¿Qué parámetros cambian realmente el automático de Omnipod 5?");
    expect(op5.titulo).toBe("Parámetros configurables en modo automático");
    expect(op5.sistema).toBe("Omnipod 5");
    expect(primera("¿Puede el modo sueño de Tandem dar autocorrecciones?").texto).toMatch(
      /sin bolos de autocorrección/,
    );
    expect(
      primera("¿Qué revisar antes de cambiar los parámetros si sale mucho del automático?").id,
    ).toBe("T5/0");
    expect(primera("¿La HbA1c alta es necesaria para ofrecer AID?").texto).toMatch(
      /no deben utilizarse como umbrales rígidos|HbA1c > 7 %/,
    );
    // Sin cifra de β-OHB, ninguna rama de la Figura 3 es «la respuesta».
    const cetonas = responder("¿Qué cambia cuando aparecen cetonas con glucosa normal?");
    expect(cetonas[0].texto).toMatch(/glucemia normal/);
    expect(cetonas.some((r) => /^F3\/(verde|amarillo|naranja|rojo)$/.test(r.id))).toBe(false);
    expect(primera("¿Cómo interpretar muchas autocorrecciones con TIR bueno?").titulo).toMatch(
      /Exceso de autocorrecciones/,
    );
    // Con cifra, la rama sigue respondiendo.
    expect(primera("cetonas 1,2 qué hago").id).toBe("F3/naranja");
  });
});

describe("Preguntas frecuentes", () => {
  it("cada pregunta se puede abrir por su id con todos sus pasajes (pantalla por temas)", () => {
    for (const f of FRECUENTES)
      expect(respuestaDeFrecuente(f.id)?.respuestas.length, f.id).toBe(f.pasajes.length);
    expect(respuestaDeFrecuente("no-existe")).toBeNull();
  });
  it("cada pregunta encuentra su ficha y todos sus pasajes existen", () => {
    for (const f of FRECUENTES) {
      const r = preguntaFrecuente(f.pregunta);
      expect(r?.id, f.pregunta).toBe(f.id);
      expect(r?.respuestas.length, f.id).toBe(f.pasajes.length);
    }
  });
  it("casi todas sus variantes también", () => {
    const variantes = FRECUENTES.flatMap((f) => f.variantes.map((v) => [f.id, v] as const));
    const bien = variantes.filter(([id, v]) => preguntaFrecuente(v)?.id === id).length;
    expect(bien / variantes.length).toBeGreaterThanOrEqual(0.95);
  });
  it("no salta con lo que el capítulo no trata ni con una cifra de cetonas", () => {
    for (const q of [...NO_CONSTA, "zzzz qqqq"]) expect(preguntaFrecuente(q), q).toBeNull();
    expect(preguntaFrecuente("cetonas 1,2 qué hago")).toBeNull();
  });
  it("con un sistema nombrado, da su casilla o deja responder al motor", () => {
    const r = preguntaFrecuente("qué parámetros influyen en el modo automático de la 780G");
    expect(r?.id).toBe("f07");
    expect(r?.respuestas[0].sistema).toBe("MiniMed 780G");
    // f41 (preparar el ejercicio) no dice nada propio de cada sistema: responde el motor.
    expect(preguntaFrecuente("cómo preparar el ejercicio con Omnipod 5")).toBeNull();
  });
  it("lo negado no casa («sin embarazo» no es la pregunta de la gestación)", () => {
    expect(preguntaFrecuente("objetivo de TIR en adulto sin embarazo")?.id).not.toBe("f46");
    expect(preguntaFrecuente("objetivos glucémicos en la gestación")?.id).toBe("f46");
  });
});
