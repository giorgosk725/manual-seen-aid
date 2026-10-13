/* V54-01 · Una pregunta frecuente solo responde si trata la misma cuestión que la búsqueda.
   Regresiones conocidas de la auditoría de la 0.54.0 y paráfrasis suyas; más los controles de
   siempre (negación, sistema nombrado, consulta sin respuesta, cifra de cetonas). */
import { describe, expect, it } from "vitest";
import { preguntaFrecuente, responder } from "./respuestas";

const primeras = (q: string) => responder(q).map((r) => r.id);

describe("V54-01 · la frecuente, solo si responde a la misma cuestión", () => {
  it("descarga: no la de la glucemia capilar; sí el paso 1 de la Tabla 5 (uso del sensor)", () => {
    for (const q of [
      "uso minimo del sensor para fiarse de la descarga",
      "la descarga es fiable con poco uso del sensor",
      "porcentaje de uso del sensor para que la descarga sea representativa",
      "cuántos días de datos hacen falta para interpretar la descarga",
    ]) {
      expect(preguntaFrecuente(q)?.id, q).not.toBe("f52");
      expect(primeras(q)[0], q).toBe("T5/0");
    }
  });
  it("reconsiderar el tratamiento: no la del ingreso", () => {
    for (const q of [
      "cuándo plantear retirar el asa cerrada",
      "cuándo plantearse dejar el sistema",
    ]) {
      expect(preguntaFrecuente(q)?.id, q).not.toBe("f45");
    }
    expect(primeras("cuándo plantear retirar el asa cerrada")[0]).toMatch(/^t\/08-iniciacion\/b12/);
  });
  it("objetivos en la persona mayor: no la del deterioro cognitivo; sí el pasaje de objetivos", () => {
    for (const q of [
      "objetivos en anciano frágil con AID",
      "objetivo de TBR en personas mayores",
    ]) {
      expect(preguntaFrecuente(q)?.id, q).not.toBe("f72");
      expect(primeras(q)[0], q).toBe("t/10-situaciones/b17/2");
    }
  });
  it("las frecuentes que sí responden siguen saltando", () => {
    for (const [q, id] of [
      ["cuánto tiempo puedo estar desconectado", "f38"],
      ["hipoglucemia leve cuántos hidratos", "f37"],
      ["irritación de la piel por el adhesivo del sensor", "f54"],
      ["control de aeropuerto con bomba de insulina", "f58"],
      ["Objetivos de HbA1c antes de buscar embarazo y durante la gestación", "f46"],
      ["se puede mantener el sistema durante un ingreso", "f45"],
    ] as const)
      expect(preguntaFrecuente(q)?.id, q).toBe(id);
  });
  it("sistema nombrado, negación, sin respuesta y cetonas: como siempre", () => {
    // Con un sistema nombrado, no una frecuente de otro.
    expect(preguntaFrecuente("modo ejercicio en Omnipod 5")?.sistema ?? 3).toBe(3);
    // Lo que el capítulo no trata no recibe una frecuente.
    expect(preguntaFrecuente("precio del omnipod")).toBeNull();
    // Una cifra de cetonas no elige rama ni salta una frecuente (A01).
    expect(preguntaFrecuente("cetonas 1,2")).toBeNull();
    expect(
      primeras("cetonas 1,2").some((id) => /^F3\/(verde|amarillo|naranja|rojo)$/.test(id)),
    ).toBe(false);
  });
});
