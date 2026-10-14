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
import ciego7 from "./bancos/ciego7.json";
import ciego8 from "./bancos/ciego8.json";
import ciego9 from "./bancos/ciego9.json";
import ciego10 from "./bancos/ciego10.json";
import ciego11 from "./bancos/ciego11.json";

const informe = (nombre: string, m: ReturnType<typeof medir>) =>
  console.log(
    `${nombre}: primera ${(m.primera * 100).toFixed(0)} %, entre las tres ${(m.entreTres * 100).toFixed(0)} %\n` +
      m.fallos.join("\n"),
  );

describe("Preguntas al capítulo", () => {
  // 0.65.0: 90 → 88 % (89 %): dos preguntas del banco principal pasan a la segunda posición
  // con las consultas del índice, que suben el acierto de los bancos ciegos (docs/BUSQUEDA_2026-10.md).
  it("banco principal: la primera respuesta acierta en al menos el 88 %", () => {
    const m = medir(BANCO.map(([q, e]) => [q, e]));
    informe("Principal", m);
    expect(m.primera).toBeGreaterThanOrEqual(0.88);
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
      // 0.53.0: calibración de «directa» (docs/BUSQUEDA_2026-10.md): las directas equivocadas
      // bajan en todos los bancos; el orden apenas cambia.
      // 0.68.0: 0,79 → 0,78 (Omnipod 5 «Adapta la basal por pod»: «basal adaptativa Omnipod» pone
      // primero la fila de la Tabla 3; la casilla corregida sigue entre las tres).
      ["Ciego 1", ciego1 as PreguntaCiega[], 0.78, 0.91, 0.07],
      ["Ciego 2", ciego2 as PreguntaCiega[], 0.62, 0.8, 0.07],
      // Medido a ciegas con el motor ya cerrado (la cifra honesta de la 0.10.0).
      // Edición editorial (A01): una cifra de cetonas ya no elige rama de la Figura 3; «0,6 de
      // cetonas… sigo normal?» responde la entrada de la figura y cuenta como directa equivocada
      // (18,3 → 19,2 %). Regresión aceptada por diseño, no una mejora del motor.
      ["Ciego 3", ciego3 as PreguntaCiega[], 0.55, 0.74, 0.05],
      // 80 preguntas de residentes, adjuntos y enfermería (auditoría externa del 6-10-2026),
      // medidas una vez con el motor de la 0.12.0 ya cerrado: 60 %, 73,8 % y 17,5 %.
      // Edición editorial: 58,8/73,8/18,8 → 56,3/72,5/21,3 (cetonas con cifra sin rama, A01, y
      // solo frecuentes aprobadas, A04). Regresión aceptada; docs/EDICION_EDITORIAL.md.
      ["Ciego 4", ciego4 as PreguntaCiega[], 0.68, 0.83, 0.07],
      // 80 preguntas nuevas, medidas una vez con el motor de la 0.13.0 ya cerrado: sin preguntas
      // frecuentes 55 %, 66,3 % y 18,8 %; con ellas, 57,5 %, 67,5 % y 17,5 %.
      ["Ciego 5", ciego5 as PreguntaCiega[], 0.71, 0.8, 0.08],
      // 100 preguntas nuevas, medidas una vez con la 0.14.0 ya cerrada. Aquí, solo por palabras
      // (66 %, 77 %, 18 %); con la búsqueda por el sentido, 70 %, 83 % y 15 % (docs/SEMANTICA.md).
      // Edición editorial: 67/77/17 → 63/75/18 (A01 y A04). Regresión aceptada.
      ["Ciego 6", ciego6 as PreguntaCiega[], 0.75, 0.84, 0.06],
      // 120 preguntas nuevas de otro agente sin ver el motor (13-10-2026), congeladas antes de
      // afinar (commit 52c0a95) y medidas una vez al final: con la 0.52.0, 67,5/77,5/21,7 %;
      // con la 0.53.0, 68,3/78,3/5,8 % (directas: 75,8 % con precisión 68,1 % → 48,3 % con 84,5 %).
      ["Ciego 7", ciego7 as PreguntaCiega[], 0.8, 0.9, 0.02],
      // 120 preguntas de otro agente (13-10-2026), encargadas con el motor ya cerrado tras la
      // entrega 1 de la auditoría de la 0.54 y congeladas (ce80781): 0.54.0, 69,2/82,5/11,7 %;
      // 0.55.0, 70,0/82,5/10,8 % (precisión de las directas 76,1 → 77,9 %).
      // Desde la 0.59.0, los bancos 7 y 8 son de desarrollo (con ellos se afinó el léxico):
      // 7 → 76,7/84,2/1,7 %; 8 → 72,5/87,5/10,0 %.
      ["Ciego 8", ciego8 as PreguntaCiega[], 0.75, 0.9, 0.09],
      // 120 preguntas de otro agente sin ver el motor (13-10-2026), congeladas antes de afinar
      // (570d7a5) y medidas una vez al final: 0.58.0, 72,5/79,2/9,2 %; 0.59.0, 72,5/80,0/8,3 %
      // (precisión de las directas 82,8 → 84,6 %). Lo afinado en 7 y 8 apenas generaliza.
      ["Ciego 9", ciego9 as PreguntaCiega[], 0.76, 0.87, 0.08],
      // 120 preguntas de otro agente (13-10-2026), 84 de ellas sobre un detalle dentro de un
      // párrafo, congeladas (a5eb6e6) y medidas una vez: el motor de la 0.60.0 y el de la 0.61.0
      // (la frase que dice el detalle, junto a la principal) dan lo mismo: 74,2/85,0/5,8 %.
      ["Ciego 10", ciego10 as PreguntaCiega[], 0.76, 0.88, 0.05],
      // Ciego 11: banco de prueba de la 0.65.0, congelado (220a203) antes de las consultas del
      // índice; medido con ellas: 61,3 / 76,7 / 7,3 (con la 0.64.0: 48,7 / 62,0 / 6,7).
      ["Ciego 11", ciego11 as PreguntaCiega[], 0.61, 0.76, 0.08],
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
    // Con cifra tampoco (edición editorial, A01): la cifra no elige rama.
    expect(
      responder("cetonas 1,2 qué hago").some((r) =>
        /^F3\/(verde|amarillo|naranja|rojo)$/.test(r.id),
      ),
    ).toBe(false);
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
    // Desde la 0.51.0 (f62-f103 aprobadas), la pregunta propia del sistema gana a la general.
    const r = preguntaFrecuente("qué parámetros influyen en el modo automático de la 780G");
    expect(r?.id).toBe("f79");
    expect(r?.respuestas[0].sistema).toBe("MiniMed 780G");
    // f41 (preparar el ejercicio) no dice nada propio de cada sistema: responde el motor.
    expect(preguntaFrecuente("cómo preparar el ejercicio con Omnipod 5")).toBeNull();
  });
  it("lo negado no casa («sin embarazo» no es la pregunta de la gestación)", () => {
    expect(preguntaFrecuente("objetivo de TIR en adulto sin embarazo")?.id).not.toBe("f46");
    expect(preguntaFrecuente("objetivos glucémicos en la gestación")?.id).toBe("f46");
  });
});
