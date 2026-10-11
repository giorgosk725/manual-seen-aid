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
import { consultaRegistrable } from "./consultas";
import {
  coberturaDe,
  conContexto,
  contextoDe,
  preguntaFrecuente,
  datoCorto,
  partesDe,
  sistemaNoCubierto,
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

describe("Dos intenciones, dato en una línea y consultas registrables (0.31.0)", () => {
  it("partesDe separa por «y», coma o «¿» y cada parte hereda el sistema", () => {
    expect(partesDe("hipoglucemia nocturna y comidas grasas con 780G")).toEqual([
      "hipoglucemia nocturna 780G",
      "comidas grasas con 780g",
    ]);
    expect(partesDe("resonancia, cirugía y viaje")).toEqual(["resonancia", "cirugia", "viaje"]);
    expect(partesDe("embarazada con 780G, ¿qué objetivo?")?.length).toBe(2);
  });
  it("no hay partes con una sola intención, con una cifra de cetonas ni con más de tres", () => {
    expect(partesDe("modo sueño")).toBeNull();
    expect(partesDe("cetonas 1,2 y glucosa alta")).toBeNull();
    expect(partesDe("a, b, c, d y e")).toBeNull();
  });
  it("datoCorto: la casilla breve por sistema cuando no es ya la primera respuesta", () => {
    const celda = {
      ...responder("objetivo de glucosa en omnipod 5")[0],
    };
    expect(celda.sistema).toBe("Omnipod 5");
    const parrafo = responder("cómo preparar el ejercicio")[0];
    expect(datoCorto("qué objetivo en omnipod 5", [parrafo, celda])?.id).toBe(celda.id);
    expect(datoCorto("qué objetivo en omnipod 5", [celda, parrafo])).toBeNull();
    expect(datoCorto("ejercicio con omnipod 5", [parrafo, celda])).toBeNull();
  });
  it("consultaRegistrable descarta correos, URL, cifras largas y lo muy corto o largo", () => {
    expect(consultaRegistrable("  Cetonas 1,2  en Control IQ ")).toBe("cetonas 1,2 en control iq");
    expect(consultaRegistrable("hola")).toBe("hola");
    expect(consultaRegistrable("abc")).toBeNull();
    expect(consultaRegistrable("juan@x.es")).toBeNull();
    expect(consultaRegistrable("historia 123456")).toBeNull();
    expect(consultaRegistrable("https://x.es")).toBeNull();
    expect(consultaRegistrable("x".repeat(130))).toHaveLength(80);
  });
});

describe("Entrega 1 de la auditoría de la 0.31 (0.32.0)", () => {
  const rec = (q: string) => recursosPedidos(q, buscarConTotales(q, 12).resultados);
  it("un sistema que el capítulo no trata se reconoce; los cubiertos, no", () => {
    expect(sistemaNoCubierto("cómo configuro un sistema iLet")).toBe("iLet");
    expect(sistemaNoCubierto("diabeloop en gestación")).toMatch(/Diabeloop/);
    expect(sistemaNoCubierto("parámetros de Omnipod 5")).toBeNull();
    expect(sistemaNoCubierto("modo sueño")).toBeNull();
  });
  it("«paso 7 de la descarga»: un solo «Abrir» y el paso como respuesta principal", () => {
    const r = rec("paso 7 de la descarga");
    expect(r[0].entrada.ruta).toBe("#/consultar/descarga/7");
    expect(new Set(r.map((x) => x.entrada.ruta)).size).toBe(r.length);
    expect(responder("paso 7 de la descarga")[0].id).toBe("T5/6");
    expect(responder("paso 2 de la tabla 5")[0].id).toBe("T5/1");
    expect(responder("paso tres de la descarga")[0].id).toBe("T5/2");
    expect(responder("séptimo paso de la descarga")[0].id).toBe("T5/6");
    expect(rec("paso tres de la descarga")[0].entrada.ruta).toBe("#/consultar/descarga/3");
  });
  it("«hoja para el paciente antes de una resonancia» abre la hoja de pruebas y cirugía", () => {
    expect(rec("hoja para el paciente antes de una resonancia")[0].entrada.ruta).toBe(
      "#/pacientes/hoja/pruebas-cirugia",
    );
    expect(rec("qué entregar al paciente con cetonas")[0].entrada.ruta).toBe(
      "#/pacientes/hoja/cetonas",
    );
    // El sistema nombrado no resta: «resonancia 780G» abre la situación con el sistema.
    expect(rec("resonancia 780G")[0].entrada.ruta).toMatch(/situacion\/rm/);
  });
  it("«iniciar Omnipod 5 desde múltiples dosis» abre Iniciar para Omnipod 5 y no responde con siglas", () => {
    expect(rec("iniciar Omnipod 5 desde múltiples dosis")[0].entrada.ruta).toBe(
      "#/consultar/inicio/preparacion:omnipod-5",
    );
    expect(rec("empezar con control iq")[0].entrada.titulo).toMatch(/Iniciar un sistema/);
    const top = responder("iniciar Omnipod 5 desde múltiples dosis")[0];
    expect(top.id).not.toMatch(/nota/);
  });
});

describe("Entrega 4 de la auditoría (0.35.0)", () => {
  const rec = (q: string) => recursosPedidos(q, buscarConTotales(q, 12).resultados);
  it("una comparación es una sola intención y responde con las variantes documentadas", () => {
    expect(partesDe("¿Qué diferencia hay entre Control-IQ y Control-IQ+?")).toBeNull();
    expect(partesDe("780G frente a Omnipod 5")).toBeNull();
    expect(preguntaFrecuente("¿Qué diferencia hay entre Control-IQ y Control-IQ+?")?.id).toBe(
      "f61",
    );
    expect(preguntaFrecuente("Control-IQ frente a Control-IQ+")?.id).toBe("f61");
    expect(rec("diferencia entre 780G y Omnipod 5")[0].entrada.ruta).toBe(
      "#/sistemas/mm780+op5/esencial",
    );
  });
  it("«pasar de plumas a Omnipod» conserva el acceso a Iniciar", () => {
    expect(rec("quiero pasar de plumas a Omnipod")[0].entrada.titulo).toMatch(/Iniciar un sistema/);
    expect(rec("dejar las plumas y empezar con control iq")[0].entrada.titulo).toMatch(
      /Iniciar un sistema/,
    );
  });
});

describe("Reformulaciones nuevas y cobertura parcial (0.36.0)", () => {
  const rec = (q: string) => recursosPedidos(q, buscarConTotales(q, 12).resultados);
  it("transición e inicio con otras palabras", () => {
    for (const q of [
      "cambiar de bolis a Omnipod",
      "quiero empezar a usar omnipod viniendo de plumas",
      "poner en marcha una 780G en un paciente con MDI",
      "arrancar control iq desde pauta bolo-basal",
    ])
      expect(rec(q)[0]?.entrada.titulo, q).toMatch(/Iniciar un sistema/);
  });
  it("comparaciones con otras palabras", () => {
    expect(preguntaFrecuente("en qué se diferencian control iq y control iq plus")?.id).toBe("f61");
    expect(partesDe("en qué se distinguen 780G y Omnipod 5")).toBeNull();
    expect(rec("comparar 780G con camaps")[0].entrada.titulo).toMatch(
      /^Comparar MiniMed 780G y myLoop CamAPS/,
    );
    expect(responder("paso siete de la tabla 5")[0].id).toBe("T5/6");
  });
  it("cobertura parcial: lo que el capítulo no trata de la consulta", () => {
    expect(coberturaDe("sauna con la bomba").ajenas).toEqual(["sauna"]);
    expect(coberturaDe("modo sueño").ajenas).toEqual([]);
    expect(coberturaDe("semaglutida en DM1 con asa cerrada").ajenas).toEqual(["semaglutida"]);
  });
});

describe("Aprobado el 11-10: Cómo funciona comparado, paso 7 e interpretaciones (0.37.0)", () => {
  it("las interpretaciones aprobadas existen para las tablas 1 a 5 y el paso 7", async () => {
    const { cargarInterpretaciones, interpretacionesDe } = await import("./interpretaciones");
    const todas = await cargarInterpretaciones();
    expect(todas.every((x) => x.estado === "aprobada")).toBe(true);
    expect(todas.map((x) => x.tabla).sort()).toEqual(["T1", "T2", "T3", "T4", "T5", "T5"]);
    expect(interpretacionesDe(todas, "T5", 6)[0].id).toBe("t5-paso7");
    expect(interpretacionesDe(todas, "T5")[0].id).toBe("t5-hallazgos");
  });
  it("el paso 7 del ejemplo lleva contexto, desglose y la opción prudente", async () => {
    const { casoPorId } = await import("./casos");
    const p7 = casoPorId("ejemplo-descarga")!.pasos[6];
    expect(p7.contexto?.verPaso).toBe(6);
    const ok = p7.opciones.find((o) => o.tipo === "si")!;
    expect(ok.texto).toMatch(/no identifican por sí solas la causa/);
    expect(ok.desglose?.conclusion).toMatch(/no identifica la causa/);
    expect(ok.citas.length).toBe(3);
  });
});

describe("Interpretaciones: prioridad del borrador y contenido aprobado (0.39.0)", () => {
  it("un borrador con el mismo id sustituye a la aprobada, sea cual sea el orden de las rutas", async () => {
    const { fusionarInterpretaciones } = await import("./interpretaciones");
    const aprobada = {
      id: "x",
      estado: "aprobada" as const,
      tabla: "T3" as const,
      texto: "vieja",
      fuente: "",
    };
    const borrador = { ...aprobada, estado: "borrador" as const, texto: "nueva" };
    const sinBorrador = fusionarInterpretaciones([
      { ruta: "./interpretaciones/a.json", items: [aprobada] },
    ]);
    expect(sinBorrador.map((x) => x.texto)).toEqual(["vieja"]);
    // «interpretaciones-borrador» va antes alfabéticamente: aun así gana.
    const con = fusionarInterpretaciones([
      { ruta: "./interpretaciones-borrador/t3.json", items: [borrador] },
      { ruta: "./interpretaciones/a.json", items: [aprobada] },
    ]);
    expect(con.map((x) => x.texto)).toEqual(["nueva"]);
    expect(con[0].estado).toBe("borrador");
  });
  it("la Tabla 3 aprobada lleva el matiz de MiniMed fuera del modo automático; sin borradores", async () => {
    const { cargarInterpretaciones } = await import("./interpretaciones");
    const todas = await cargarInterpretaciones();
    const t3 = todas.find((x) => x.id === "t3-mismo-parametro")!;
    expect(t3.estado).toBe("aprobada");
    expect(t3.texto).toMatch(
      /calculador de bolos fuera del modo automático y no modifica las autocorrecciones/,
    );
    expect(todas.every((x) => x.estado === "aprobada")).toBe(true);
  });
  it("los pasos 5 y 6 del ejemplo llevan las cuatro partes y el 8 se lee como retrospectivo", async () => {
    const { casoPorId } = await import("./casos");
    const c = casoPorId("ejemplo-descarga")!;
    const ok = (n: number) => c.pasos[n - 1].opciones.find((o) => o.tipo === "si")!;
    expect(ok(5).desglose?.conclusion).toMatch(/no permiten elegir un ajuste definitivo/);
    expect(ok(6).desglose?.falta).toMatch(
      /no permite descartar por sí solo una ratio insuficiente/,
    );
    expect(ok(8).comentario).toMatch(/retrospectivamente/);
    expect(ok(3).texto).toMatch(/remite a buscar/);
  });
});
