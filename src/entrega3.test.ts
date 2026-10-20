/* Entrega 3 (0.28.0): sugerencias mientras se escribe, seguimiento con el tema anterior,
   contexto de una frase, preguntas cercanas y relacionadas, respuesta por id. */
import { describe, expect, it } from "vitest";
import {
  buscarConTotales,
  consultaEfectiva,
  olvidarTema,
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
    const f = FRECUENTES.find((x) => FRECUENTES.some((y) => y.tema === x.tema && y.id !== x.id))!;
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
  it("«paso 7 de la descarga» abre ese paso; sin casos en esta edición, ningún acceso a ellos", () => {
    expect(rec("paso 7 de la descarga")[0].entrada.ruta).toBe("#/consultar/descarga/7");
    // 0.48.0: los casos guiados no van en esta edición (src/edicion.ts).
    for (const q of ["descarga comentada", "practicar descarga"])
      expect(
        rec(q).some((r) => /Ejemplo comentado|#\/casos/.test(r.entrada.titulo + r.entrada.ruta)),
      ).toBe(false);
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
    expect(rec("empezar con control iq")[0].entrada.titulo).toMatch(/Iniciación del sistema/);
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
    expect(rec("quiero pasar de plumas a Omnipod")[0].entrada.titulo).toMatch(
      /Iniciación del sistema/,
    );
    expect(rec("dejar las plumas y empezar con control iq")[0].entrada.titulo).toMatch(
      /Iniciación del sistema/,
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
      expect(rec(q)[0]?.entrada.titulo, q).toMatch(/Iniciación del sistema/);
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

describe("Pasos 5 y 6: opciones y comentarios coherentes con el desglose (0.40.0)", () => {
  it("ninguna opción ni comentario da por establecida la causa ni excluye la ratio", async () => {
    const { casoPorId } = await import("./casos");
    const c = casoPorId("ejemplo-descarga")!;
    const p5 = c.pasos[4];
    const p6 = c.pasos[5];
    const ok5 = p5.opciones.find((o) => o.tipo === "si")!;
    expect(ok5.texto).toMatch(/antes de atribuirlas a una causa/);
    expect(ok5.texto).not.toMatch(/no por un/);
    const subir = p5.opciones.find((o) => o.texto.startsWith("Subir el objetivo nocturno"))!;
    expect(subir.comentario).toMatch(/no justifican por sí solas/);
    const ok6 = p6.opciones.find((o) => o.tipo === "si")!;
    expect(ok6.texto).toMatch(/compatible con el efecto de la grasa/);
    expect(ok6.texto).not.toMatch(/por la grasa y la proteína/);
    const ratio = p6.opciones.find((o) => o.texto.startsWith("Cambiar directamente la ratio"))!;
    expect(ratio.comentario).toMatch(/Tampoco permite descartarla/);
    for (const o of [...p5.opciones, ...p6.opciones]) {
      expect(o.comentario).not.toMatch(/responde a su composición, no a la ratio/);
      expect(o.citas.length).toBeGreaterThan(0);
    }
  });
});

describe("Siglas en las tareas de Iniciar (0.42.0)", () => {
  it("siglasPorTexto marca la primera aparición y no toca el conjunto de entrada", async () => {
    const { siglasPorTexto } = await import("./siglas");
    const pend = new Set(["DTD", "MDI", "HbA1c"]);
    const sets = siglasPorTexto(["Reducción de la DTD al pasar de MDI", "La DTD y la HbA1c"], pend);
    expect([...sets[0]]).toEqual(["DTD", "MDI"]);
    expect([...sets[1]]).toEqual(["HbA1c"]);
    expect(pend.size).toBe(3);
    // Dos veces lo mismo da lo mismo (React puede pintar dos veces).
    expect(siglasPorTexto(["La DTD"], pend)).toEqual(siglasPorTexto(["La DTD"], pend));
  });
});

describe("Pertinencia de relacionadas y continuación (0.42.0)", () => {
  it("una consulta sobre Omnipod no propone la pregunta de Control-IQ+ aunque compartan fila", () => {
    const q = "¿Qué basal programo en Omnipod y para qué sirve después?";
    const ids = responder(q).map((r) => r.id);
    expect(ids[0]).toBe("T3/1");
    const rel = frecuentesRelacionadas(ids, undefined, 3, 3);
    expect(rel.map((f) => f.id)).not.toContain("f61");
    // Sin sistema, una fila por sistema compartida tampoco relaciona por sí sola.
    expect(frecuentesRelacionadas(["T3/1"], undefined, 3).map((f) => f.id)).not.toContain("f61");
  });
  it("una respuesta de la Tabla 2 o 3 sigue en su tarea de Iniciar, con el sistema", async () => {
    const { continuacionDe } = await import("./buscador");
    expect(continuacionDe("T3/1", 3)?.ruta).toBe("#/consultar/inicio/inicio:omnipod-5:parametros");
    expect(continuacionDe("T2/2", -1)?.ruta).toBe("#/consultar/inicio/inicio::transicion");
    expect(continuacionDe("T2/0", 1)?.texto).toMatch(/Plan de respaldo.*Control-IQ/);
    expect(continuacionDe("T4/2", 0)).toBeNull();
  });
});

describe("Quinta ronda de auditorías (0.81.1): atajos del buscador", () => {
  const rec = (q: string) =>
    recursosPedidos(q, buscarConTotales(q, 12).resultados).map((r) => r.entrada.ruta);
  it("glucosa alta dicha con palabras y un sistema: la sospecha de fallo", () => {
    expect(rec("780 glucosa alta")).toContain("#/consultar/figura-3");
    expect(rec("no se si funciona el set")).toContain("#/consultar/figura-3");
    expect(rec("hiperglucemia puntual 780G")).not.toContain("#/consultar/figura-3");
  });
  it("«X a Y» entre dos sistemas: la calculadora con el destino", () => {
    expect(rec("780G a Control-IQ")).toContain(
      "#/consultar/inicio/calculadora:control-iq:desde-minimed-780g",
    );
    expect(rec("780 → control-iq")).toContain(
      "#/consultar/inicio/calculadora:control-iq:desde-minimed-780g",
    );
  });
  it("gestación con el sistema nombrado", () => {
    expect(rec("embarazo control-iq")).toContain("#/consultar/situacion/gestacion:control-iq");
  });
  it("«ciq+» y «control-iq+» solos: la pregunta de las diferencias", () => {
    olvidarTema();
    expect(consultaEfectiva("ciq+")).toBe("control-iq+");
    expect(rec("control-iq+")).toContain("#/preguntas/f61");
    expect(rec("control-iq+")).toContain("#/preguntas/f61");
    expect(rec("control-iq+ diferencias")).toContain("#/preguntas/f61");
  });
  it("agua con un sistema: su fila en Modos; «poner en marcha» no es «mar»", () => {
    expect(rec("omnipod agua")).toContain("#/sistemas/op5/modos:agua");
    expect(rec("poner en marcha una 780G")).not.toContain("#/sistemas/mm780/modos");
  });
  it("qué actúa en automático: los parámetros comparados", () => {
    expect(rec("qué actúa en automático en los cuatro")).toContain("#/sistemas/todos/parametros");
  });
});

describe("Sexta ronda de auditorías (0.82.1): atajos del buscador", () => {
  const rec = (q: string) =>
    recursosPedidos(q, buscarConTotales(q, 12).resultados).map((r) => r.entrada.ruta);
  it("«X frente a Y» o «comparado» no es un cambio de sistema", () => {
    expect(rec("camaps frente a control-iq en el embarazo").join(" ")).not.toMatch(/calculadora/);
    expect(rec("780g comparado a omnipod 5").join(" ")).not.toMatch(/calculadora/);
    expect(rec("780g a ciq").join(" ")).toMatch(/calculadora:control-iq:desde-minimed-780g/);
  });
  it("gestación con dos sistemas: ninguno marcado", () => {
    expect(rec("embarazo camaps o control-iq")).toContain("#/consultar/situacion/gestacion");
  });
  it("hiperglucemia tardía: la comida grasa, no la sospecha de fallo", () => {
    const r = rec("hiperglucemia tardía 780G");
    expect(r).toContain("#/consultar/situacion/comida-grasa:minimed-780g");
    expect(r).not.toContain("#/consultar/figura-3");
  });
  it("hipoglucemia nocturna con un sistema: el sueño de ese sistema", () => {
    expect(rec("hipoglucemias nocturnas control-iq")).toContain(
      "#/consultar/situacion/sueno:control-iq",
    );
  });
  it("alcohol y objetivo temporal con un sistema: su ficha", () => {
    expect(rec("alcohol control-iq")).toContain("#/sistemas/ciq/modos:alcohol");
    expect(rec("objetivo temporal 780G")).toContain("#/sistemas/mm780/modos");
  });
});

describe("Séptima ronda de auditorías (0.83.1): atajos del buscador", () => {
  const rec = (q: string) =>
    recursosPedidos(q, buscarConTotales(q, 12).resultados).map((r) => r.entrada.ruta);
  it("«viniendo de» / «desde»: el destino es el otro sistema y no la iniciación del de origen", () => {
    const r = rec("iniciar control-iq viniendo de 780g").join(" ");
    expect(r).toMatch(/calculadora:control-iq:desde-minimed-780g/);
    expect(r).not.toMatch(/inicio\/preparacion:minimed-780g/);
    expect(rec("control-iq desde 780g").join(" ")).toMatch(
      /calculadora:control-iq:desde-minimed-780g/,
    );
  });
  it("«ease off alcohol» es CamAPS FX", () => {
    expect(rec("ease off alcohol")).toContain("#/sistemas/camaps/modos:alcohol");
  });
  it("«qué parámetros usa el algoritmo»: los parámetros comparados", () => {
    expect(rec("qué parámetros usa el algoritmo")).toContain("#/sistemas/todos/parametros");
  });
  it("la hiperglucemia persistente, siempre a la Figura 3 y la primera", () => {
    expect(rec("hiperglucemia persistente")[0]).toBe("#/consultar/figura-3");
  });
  it("«X o Y» con gestación: la comparación de los dos", () => {
    expect(rec("embarazo camaps o control-iq").join(" ")).toMatch(
      /sistemas\/ciq\+camaps\/esencial/,
    );
  });
});

describe("Octava ronda de auditorías (0.84.1): atajos del buscador", () => {
  const rec = (q: string) =>
    recursosPedidos(q, buscarConTotales(q, 12).resultados).map((r) => r.entrada.ruta);
  it("la puntuación junto al nombre del sistema no lo esconde", () => {
    expect(rec("paciente con 780g, cambio a tandem").join(" ")).toMatch(
      /calculadora:control-iq:desde-minimed-780g/,
    );
    const r = rec("empezar control-iq, viene de 780g").join(" ");
    expect(r).toMatch(/calculadora:control-iq:desde-minimed-780g/);
    expect(r).not.toMatch(/preparacion:minimed-780g/);
  });
  it("«paciente con X» es el sistema de origen", () => {
    expect(rec("iniciar control-iq en paciente con 780g").join(" ")).toMatch(
      /calculadora:control-iq:desde-minimed-780g/,
    );
  });
  it("en un cambio, la calculadora va primero", () => {
    expect(rec("pasar de 780G a control-iq")[0]).toMatch(/calculadora:control-iq/);
  });
  it("«glucosa alta» sola: la Figura 3; sin la fila «sin sospecha»", () => {
    expect(rec("glucosa alta")).toContain("#/consultar/figura-3");
    expect(rec("fallo de infusión 780g").join(" ")).not.toMatch(/necesidad-transitoria/);
  });
  it("descarga ordenada y comida grasa: sus preguntas frecuentes", () => {
    expect(rec("descarga camaps orden")).toContain("#/preguntas/f21");
    expect(rec("780g cena grasa")).toContain("#/preguntas/f57");
    expect(rec("parámetros del algoritmo")).toContain("#/sistemas/todos/parametros");
  });
});

describe("Novena ronda de auditorías (0.85.1): atajos del buscador", () => {
  const rec = (q: string) =>
    recursosPedidos(q, buscarConTotales(q, 12).resultados).map((r) => r.entrada.ruta);
  it("«calendario de revisiones» y «seguimiento»: los tres primeros meses", () => {
    expect(rec("calendario de revisiones")).toContain("#/consultar/inicio/primeros-meses");
    expect(rec("seguimiento 780g")).toContain("#/consultar/inicio/primeros-meses:minimed-780g");
  });
  it("comparar dos sistemas en la gestación: la fila de la gestación", () => {
    expect(rec("embarazo camaps o control-iq").join(" ")).toMatch(/ciq\+camaps\/esencial:8/);
  });
  it("«omnipod agua»: el primer pasaje no es la ratio insulina/hidratos", () => {
    const r = buscarConTotales("omnipod agua", 12).resultados;
    expect(r[0]?.entrada.titulo ?? "").not.toMatch(/hidratos/i);
  });
});

describe("Décima ronda de auditorías (0.86.1): atajos del buscador", () => {
  const rec = (q: string) =>
    recursosPedidos(q, buscarConTotales(q, 12).resultados).map((r) => r.entrada.ruta);
  it("«plan de seguridad» y «plan 780g»: el plan imprimible, no la descarga", () => {
    expect(rec("plan de seguridad")).toContain("#/pacientes/plan");
    const r = rec("plan 780g");
    expect(r).toContain("#/pacientes/plan/mm780");
    expect(r.join(" ")).not.toMatch(/descarga/);
  });
  it("gestación con dos sistemas sin conector: la comparación en su fila", () => {
    expect(rec("gestación camaps control-iq").join(" ")).toMatch(/ciq\+camaps\/esencial:8/);
  });
  it("«10 semanas» en la gestación no es tema", () => {
    olvidarTema();
    expect(consultaEfectiva("embarazada 10 semanas camaps") ?? "").not.toMatch(/10/);
  });
});
