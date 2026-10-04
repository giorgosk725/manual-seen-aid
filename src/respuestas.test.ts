/* «Preguntas al capítulo»: umbrales sobre los bancos de respuestas.bancos.ts. Los bancos
   «ciego», «final» y «quinto» se midieron a ciegas una vez (docs/PREGUNTAS_2026-10-04.md);
   aquí vigilan que lo conseguido no se pierda. */
import { describe, expect, it } from "vitest";
import { responder } from "./respuestas";
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
      ["Ciego 1", ciego1 as PreguntaCiega[], 0.66, 0.84, 0.28],
      ["Ciego 2", ciego2 as PreguntaCiega[], 0.48, 0.53, 0.25],
      // Medido a ciegas con el motor ya cerrado (la cifra honesta de la 0.10.0).
      ["Ciego 3", ciego3 as PreguntaCiega[], 0.4, 0.5, 0.19],
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
});
