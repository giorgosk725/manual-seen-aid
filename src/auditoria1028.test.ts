/* Regresiones de la auditoría de la 1.0.28 (B03, B04, A02): por intención y pasaje principal, no
   por instantáneas. El banco de consultas es el del encargo; las que hoy no fallaban sirven para que
   no empiecen a fallar. */
import { describe, expect, it } from "vitest";
import { preguntaFrecuente, responder } from "./respuestas";
import { anuncioCobertura, coberturaDe } from "./cobertura";
import { intentoActual, responderPregunta, volverAEmpezar } from "./intento-test";

const primera = (q: string) => responder(q, { max: 5 })[0];
const deGestacion = (t = "") => /gestaci|gestante|embaraz|subíndice p/i.test(t);

describe("B03 · una sigla aislada no adopta una población concreta", () => {
  it("«TIR» abre su definición y el objetivo general, no la gestación", () => {
    expect(preguntaFrecuente("TIR")?.id).not.toBe("f46");
    expect(primera("TIR")?.id).toBe("sigla/TIR");
    const tres = responder("TIR", { max: 3 }).map((r) => r.id);
    expect(tres).toContain("t/05-resultados/b2/0");
  });
  it("«TIR gestación» conserva la respuesta de la gestación", () => {
    expect(preguntaFrecuente("TIR gestación")?.id).toBe("f46");
  });
  it("«objetivos de MCG en el hospital» conserva el pasaje hospitalario", () => {
    expect(primera("objetivos de MCG en el hospital")?.texto ?? "").toMatch(/hospitaliz/i);
  });
  it.each(["TBR", "TAR", "CV"])("«%s» no empieza por lo de la gestación", (q) => {
    const f = preguntaFrecuente(q);
    const r = primera(q);
    expect(deGestacion(f?.pregunta)).toBe(false);
    expect(f || r).toBeTruthy();
    if (!f) expect(deGestacion(r?.texto)).toBe(false);
  });
  it("las consultas de sistema siguen respondiendo", () => {
    expect(responder("insulina activa Control-IQ", { max: 3 }).length).toBeGreaterThan(0);
    expect(preguntaFrecuente("modo ejercicio en Control-IQ")?.pregunta ?? "").toMatch(/ejercicio/);
  });
});

describe("B04 · el anuncio dice el mismo grado de cobertura que el rótulo", () => {
  it("«insulina semanal» es coincidencia parcial y no se anuncia como respuesta", () => {
    const c = coberturaDe(!!preguntaFrecuente("insulina semanal"), primera("insulina semanal"));
    expect(c).toBe("parcial");
    const a = anuncioCobertura(c, 98, false);
    expect(a).toMatch(/coincidencias parciales/);
    expect(a).not.toMatch(/Hay respuesta del capítulo/);
  });
  it("«zzzxqv» sigue sin resultados", () => {
    const c = coberturaDe(!!preguntaFrecuente("zzzxqv"), primera("zzzxqv"));
    expect(c).toBe("ninguna");
    expect(anuncioCobertura(c, 0, false)).toBe("Sin resultados.");
  });
  it("una pregunta frecuente se anuncia como respuesta", () => {
    expect(anuncioCobertura("especifica", 3, false)).toBe(
      "Hay respuesta del capítulo y 3 resultados más.",
    );
  });
});

describe("A02 · el intento de la autoevaluación vive en memoria", () => {
  it("conserva elecciones, cuenta la primera respuesta y se reinicia a mano", () => {
    volverAEmpezar();
    const n0 = intentoActual().n;
    responderPregunta("t1", 2);
    responderPregunta("t1", 0); // la primera es la que cuenta
    responderPregunta("t2", 1);
    expect(intentoActual().elegidas).toEqual({ t1: 2, t2: 1 });
    volverAEmpezar();
    expect(intentoActual()).toEqual({ n: n0 + 1, elegidas: {} });
  });
});
