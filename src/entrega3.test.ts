/* Entrega 3 (0.28.0): sugerencias mientras se escribe, seguimiento con el tema anterior,
   contexto de una frase, preguntas cercanas y relacionadas, respuesta por id. */
import { describe, expect, it } from "vitest";
import {
  buscarConTotales,
  consultaEfectiva,
  recordarTema,
  recursosPedidos,
  sugerir,
} from "./buscador";
import {
  conContexto,
  contextoDe,
  esSeguimiento,
  faqsCercanas,
  frecuentesRelacionadas,
  respuestaPorId,
  responder,
} from "./respuestas";
import { FRECUENTES } from "./frecuentes";

describe("Sugerencias mientras se escribe", () => {
  it("«hipogl» propone preguntas frecuentes de hipoglucemia; «resonan», la situación", () => {
    const s = sugerir("hipogl");
    expect(s.length).toBeGreaterThan(0);
    expect(s.some((x) => x.tipo === "pregunta" && /hipogluc/i.test(x.texto))).toBe(true);
    const r = sugerir("resonan");
    expect(r.some((x) => x.tipo === "situacion" && /Resonancia/.test(x.texto))).toBe(true);
    expect(r[0].ruta).toMatch(/#\/consultar\/situacion\/rm$/);
  });
  it("menos de tres letras o nada que empiece así: ninguna; nunca más de cinco", () => {
    expect(sugerir("hi")).toEqual([]);
    expect(sugerir("zzzzqqq")).toEqual([]);
    expect(sugerir("sistema").length).toBeLessThanOrEqual(5);
  });
  it("una herramienta y un sistema van antes que las preguntas", () => {
    const s = sugerir("omnipod");
    expect(s[0].tipo).toBe("sistema");
    const d = sugerir("descarga");
    expect(d[0].tipo).toBe("herramienta");
  });
});

describe("Seguimiento con el tema anterior", () => {
  it("«y en Omnipod 5» hereda «hipoglucemia nocturna» y cambia el sistema", () => {
    expect(esSeguimiento("y en Omnipod 5")).toBe(true);
    expect(esSeguimiento("hipoglucemia nocturna 780G")).toBe(false);
    expect(esSeguimiento("cetonas 1,2")).toBe(false);
    const q = conContexto("y en Omnipod 5", "hipoglucemia nocturna 780G");
    expect(q).toMatch(/^hipoglucemia nocturna/);
    expect(q).toMatch(/omnipod/);
    expect(q).not.toMatch(/780g/);
    // Y la búsqueda compuesta responde con algo de Omnipod 5.
    const r = responder(q!);
    expect(r.length).toBeGreaterThan(0);
  });
  it("sin tema anterior o sin sistema nuevo, no hay seguimiento", () => {
    expect(conContexto("y en Omnipod 5", null)).toBeNull();
    expect(conContexto("modo sueño", "hipoglucemia nocturna")).toBeNull();
    recordarTema("objetivo en gestación");
    expect(consultaEfectiva("con Control-IQ")).toMatch(/^objetivo.*gestacion.*control/);
    recordarTema("");
    expect(consultaEfectiva("con Control-IQ")).toMatch(/control/); // el tema sigue (vacío no lo borra)
  });
});

describe("Contexto, preguntas cercanas y relacionadas", () => {
  it("contextoDe da la frase anterior y la siguiente del mismo párrafo", () => {
    const c = contextoDe("t/06-indicaciones/b2/1");
    expect(c.antes).toBeTruthy();
    expect(c.despues).toBeTruthy();
    expect(contextoDe("t/06-indicaciones/b2/0").antes).toBeUndefined();
    expect(contextoDe("T4/3")).toEqual({});
  });
  it("faqsCercanas: las frecuentes que citan los pasajes parecidos, en orden", () => {
    const f = FRECUENTES[4];
    const cerca = faqsCercanas([{ id: f.pasajes[0], s: 0.8 }]);
    expect(cerca[0].id).toBe(f.id);
    expect(faqsCercanas([])).toEqual([]);
  });
  it("frecuentesRelacionadas: las que citan la respuesta o son del mismo tema", () => {
    const f = FRECUENTES[10];
    const rel = frecuentesRelacionadas(f.pasajes, f.id);
    expect(rel.every((x) => x.id !== f.id)).toBe(true);
    expect(rel.length).toBeGreaterThan(0);
    expect(rel.length).toBeLessThanOrEqual(3);
  });
  it("respuestaPorId: un tramo de la Figura 3 y una fila por sistema con su sistema", () => {
    expect(respuestaPorId("F3/verde")?.id).toBe("F3/verde");
    const r = respuestaPorId("T4/0", 3);
    expect(r?.sistema).toBe("Omnipod 5");
    expect(r?.casillas?.length).toBe(4);
    expect(respuestaPorId("no-existe")).toBeNull();
  });
});

describe("Recurso pedido (prueba simulada del 10-10)", () => {
  const rec = (q: string) => recursosPedidos(q, buscarConTotales(q, 12).resultados);
  it("«paso 7 de la descarga» abre ese paso; «descarga comentada» y «practicar descarga», el ejemplo", () => {
    expect(rec("paso 7 de la descarga")[0].entrada.ruta).toBe("#/consultar/descarga/7");
    expect(rec("descarga comentada")[0].entrada.titulo).toMatch(/Ejemplo comentado/);
    expect(rec("practicar descarga")[0].entrada.titulo).toMatch(/Ejemplo comentado/);
  });
  it("«qué puedo cambiar en Omnipod 5 en automático» abre sus parámetros", () => {
    expect(rec("que puedo cambiar en omnipod 5 en automatico")[0].entrada.ruta).toBe(
      "#/sistemas/op5/parametros",
    );
  });
});

describe("Lenguaje de consulta (0.30.0)", () => {
  const top = (q: string) => responder(q)[0];
  it("sin insulina o sin batería: la interrupción del sistema; la aguja doblada: los acodamientos", () => {
    expect(top("la bomba se ha quedado sin insulina")?.texto).toMatch(/pluma|interrup|fallo/);
    expect(top("se ha quedado sin batería")?.texto).toMatch(/pluma|interrup|fallo/);
    expect(top("la aguja se dobla")?.texto).toMatch(/acodamientos/);
  });
  it("no entra en automático: las salidas; se cae el pod: el adhesivo; bajar el objetivo: sus valores", () => {
    expect(top("la bomba no me deja entrar en automático")?.texto).toMatch(/transitorias|salida/i);
    expect(top("se me cae el pod")?.texto).toMatch(/despegado|adhesivo/);
    expect(top("puedo bajar el objetivo en Control-IQ")?.id).toBe("T1/6");
    expect(top("hb glicada objetivo")?.texto).toMatch(/HbA1c/);
  });
});
