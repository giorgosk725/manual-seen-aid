/* Edición editorial, lote 1 (A01-A03): la cifra de β-OHB no elige rama, las Functions no
   reciben texto y la app no guarda búsquedas ni criterios. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { responder, preguntaFrecuente, frecuentesRelacionadas, respuestaPorId } from "./respuestas";
import { FRECUENTES, FRECUENTES_TODAS, PROPUESTAS, huellaDe, revisionDe } from "./frecuentes";
import { indice, sugerir } from "./buscador";
import { tramoDeConsulta } from "./busqueda";
import { FIGURA3 } from "./contenido";
import { CON_CASOS, CON_REPASO, EDICION, RETIRADOS, migrarPrivacidad } from "./edicion";
import { MATERIALES, material, materialListo } from "./materiales";
import { pedirParecidos } from "./semantica";
import { registrarSinRespuesta } from "./consultas";
import { guardarReciente, guardarVisita } from "./prefs";
import { onRequestPost as postPasajes } from "../functions/api/pasajes";
import { onRequestPost as postSinRespuesta } from "../functions/api/sin-respuesta";

const RAMA = /^F3\/(verde|amarillo|naranja|rojo)$/;

describe("A01 · cetonemia: la cifra no elige rama", () => {
  it("«cetonas 0,4 y vómitos persistentes y confusión» no da la rama verde ni ninguna otra", () => {
    const r = responder("cetonas 0,4 y vómitos persistentes y confusión", { max: 5 });
    expect(r.some((x) => RAMA.test(x.id))).toBe(false);
    // Responde la lista de tramos del capítulo, con el tramo rojo y los signos de gravedad.
    expect(r[0].id).toBe("l/09-descarga/b17");
    expect(r[0].items).toHaveLength(4);
    expect(r[0].items![3]).toMatch(/signos de gravedad/);
  });
  it("cifras en cada borde de tramo, signos negados, gestación e iSGLT2: ninguna rama sola", () => {
    const qs = [
      "cetonas 0,5",
      "cetonas 0,6",
      "cetonemia 0,9",
      "β-OHB 1,0",
      "cetonas 1,5",
      "cetonemia 2,9",
      "β-OHB 3,0",
      "cetonas 0,4 sin vómitos ni dolor abdominal",
      "cetonas 1,2 embarazada",
      "cetonas 0,8 con iSGLT2",
    ];
    for (const q of qs) {
      expect(tramoDeConsulta(q), q).not.toBeNull();
      const r = responder(q, { max: 5 });
      expect(r.length, q).toBeGreaterThan(0);
      expect(
        r.some((x) => RAMA.test(x.id)),
        q,
      ).toBe(false);
    }
  });
  it("sin cifra, las ramas siguen respondiendo por su texto (navegación del documento)", () => {
    expect(responder("posible cetoacidosis diabética", { max: 3 }).map((r) => r.id)).toContain(
      "F3/rojo",
    );
  });
  it("las notas de la figura siguen en los datos: dosis total de rescate y hospital tras 2.ª dosis", () => {
    const naranja = JSON.stringify(FIGURA3.tramos.find((t) => t.clave === "naranja"));
    expect(naranja).toContain("como dosis total de rescate**, no como dosis adicional");
    expect(naranja).toContain("Si tras una segunda dosis correctamente");
    expect(FIGURA3.notaAsterisco.length).toBeGreaterThan(20);
    expect(FIGURA3.pie.length).toBeGreaterThanOrEqual(3);
  });
});

describe("A03 · privacidad", () => {
  afterEach(() => vi.restoreAllMocks());
  it("la edición no transmite ni guarda búsquedas", () => {
    expect(EDICION).toEqual({ busquedaRemota: false, registroConsultas: false, recientes: false });
  });
  it("cero llamadas a /api/pasajes y /api/sin-respuesta", async () => {
    const f = vi.spyOn(globalThis, "fetch");
    expect(await pedirParecidos("cetonas 1,2 en paciente de 34 años")).toEqual([]);
    registrarSinRespuesta("zzzz qqqq wwww", false);
    expect(f).not.toHaveBeenCalled();
  });
  it("no guarda búsquedas recientes ni visitas", () => {
    localStorage.clear();
    guardarReciente("cetonas 1,2");
    guardarVisita({ ruta: "#/sistemas/elegir/edad:10+dm2", titulo: "x" } as never);
    expect(localStorage.getItem("mseen:recientes")).toBeNull();
    expect(localStorage.getItem("mseen:visitas")).toBeNull();
  });
  it("la migración borra solo las claves de búsquedas y criterios de la app", () => {
    localStorage.clear();
    localStorage.setItem("mseen:recientes", '["cetonas 1,2"]');
    localStorage.setItem("mseen:visitas", '[{"ruta":"#/buscar/x","titulo":"x"}]');
    localStorage.setItem(
      "mseen:favoritos",
      JSON.stringify([
        { ruta: "#/sistemas/elegir/edad:4", titulo: "a" },
        { ruta: "#/buscar/cetonas", titulo: "b" },
        { ruta: "#/capitulo/09-descarga", titulo: "c" },
      ]),
    );
    localStorage.setItem("mseen:night", "1");
    localStorage.setItem("mseen:letra", "1");
    localStorage.setItem("otra-app", "intacta");
    migrarPrivacidad();
    expect(localStorage.getItem("mseen:recientes")).toBeNull();
    expect(localStorage.getItem("mseen:visitas")).toBeNull();
    expect(JSON.parse(localStorage.getItem("mseen:favoritos")!)).toEqual([
      { ruta: "#/capitulo/09-descarga", titulo: "c" },
    ]);
    expect(localStorage.getItem("mseen:night")).toBe("1");
    expect(localStorage.getItem("mseen:letra")).toBe("1");
    expect(localStorage.getItem("otra-app")).toBe("intacta");
  });
  it("las Functions rechazan el POST (410, sin caché ni sniffing) sin leer el cuerpo", async () => {
    const leer = vi.fn();
    const peticion = { json: leer } as unknown as Request;
    for (const post of [postPasajes, postSinRespuesta]) {
      const r = await post({ request: peticion, env: {} } as never);
      expect(r.status).toBe(410);
      expect(r.headers.get("Cache-Control")).toBe("no-store");
      expect(r.headers.get("X-Content-Type-Options")).toBe("nosniff");
    }
    expect(leer).not.toHaveBeenCalled();
  });
});

describe("A04 · circuito de aprobación de las preguntas frecuentes", () => {
  const pendientes = FRECUENTES_TODAS.filter((f) => f.revision.estado !== "aprobada");
  it("las 103 aprobadas, cada una con fecha y registro de su revisión", () => {
    expect(FRECUENTES.map((f) => f.id)).toEqual(
      Array.from({ length: 103 }, (_, i) => `f${String(i + 1).padStart(2, "0")}`),
    );
    for (const f of FRECUENTES) {
      expect(f.revision.fecha, f.id).toMatch(/^2026-10-(08|11|13)$/);
      expect(f.revision.registro.length, f.id).toBeGreaterThan(20);
    }
    // Solo las aprobadas salen: FRECUENTES es exactamente el filtro de FRECUENTES_TODAS.
    expect(FRECUENTES).toEqual(FRECUENTES_TODAS.filter((f) => f.revision.estado === "aprobada"));
    expect(pendientes).toHaveLength(0);
  });
  it("todos los pasajes de las pendientes y de las propuestas existen", () => {
    for (const f of pendientes)
      for (const id of f.pasajes) expect(respuestaPorId(id), `${f.id} ${id}`).not.toBeNull();
    for (const [fid, p] of Object.entries(PROPUESTAS))
      for (const id of p.pasajes) expect(respuestaPorId(id), `${fid} ${id}`).not.toBeNull();
  });
  it("ninguna pendiente responde, se sugiere, sale como relacionada ni entra en el índice", () => {
    const ids = new Set(pendientes.map((f) => f.id));
    const enIndice = indice().map((e) => JSON.stringify(e));
    for (const f of pendientes) {
      expect(ids.has(preguntaFrecuente(f.pregunta)?.id ?? ""), f.id).toBe(false);
      for (const v of f.variantes)
        expect(ids.has(preguntaFrecuente(v)?.id ?? ""), `${f.id} ${v}`).toBe(false);
      expect(
        sugerir(f.pregunta, 20).some((x) => x.frecuente && ids.has(x.frecuente.id)),
        f.id,
      ).toBe(false);
      expect(
        frecuentesRelacionadas(f.pasajes, undefined, 10).some((x) => ids.has(x.id)),
        f.id,
      ).toBe(false);
      expect(
        enIndice.some((e) => e.includes(f.pregunta)),
        f.id,
      ).toBe(false);
    }
  });
  it("f63 precisa las modalidades híbridas; f69 recupera la hora sin insulina y la pauta individual", () => {
    const f63 = FRECUENTES_TODAS.find((f) => f.id === "f63")!;
    expect(f63.pregunta).toMatch(/híbridos/);
    expect(f63.pasajes).toContain("t/09-descarga/b2/3");
    const f69 = FRECUENTES_TODAS.find((f) => f.id === "f69")!;
    expect(f69.pasajes).toEqual(
      expect.arrayContaining(["t/07-educacion/b11/4", "t/07-educacion/b12/2"]),
    );
    // f37 conserva juntos condicionantes, cantidades y reevaluación, sin «menos hidratos» delante.
    expect(FRECUENTES.find((f) => f.id === "f37")!.pasajes).toEqual([
      "t/07-educacion/b7/0",
      "t/07-educacion/b7/1",
    ]);
  });
});

describe("V50-01 · la migración no impide arrancar", () => {
  const falso = (sobre: Partial<Storage>): Storage =>
    ({
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
      ...sobre,
    }) as Storage;
  it("con getItem/removeItem que lanzan, con favoritos ilegibles y sin sessionStorage", () => {
    const lanza = () => {
      throw new DOMException("bloqueado", "SecurityError");
    };
    expect(() =>
      migrarPrivacidad(falso({ getItem: lanza, removeItem: lanza }), undefined),
    ).not.toThrow();
    const borradas: string[] = [];
    const almacen = falso({
      getItem: (k) => (k === "mseen:favoritos" ? "{no es json" : null),
      removeItem: (k) => void borradas.push(k),
    });
    const sesionBorradas: string[] = [];
    migrarPrivacidad(almacen, falso({ removeItem: (k) => void sesionBorradas.push(k) }));
    expect(borradas).toEqual(
      expect.arrayContaining(["mseen:recientes", "mseen:visitas", "mseen:favoritos"]),
    );
    expect(sesionBorradas).toEqual(["mseen:sin-respuesta"]);
  });
  it("si el acceso a localStorage lanza, no lanza", () => {
    const d = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("bloqueado", "SecurityError");
      },
    });
    try {
      expect(() => migrarPrivacidad()).not.toThrow();
    } finally {
      if (d) Object.defineProperty(globalThis, "localStorage", d);
    }
  });
});

describe("V50-04 · la aprobación está ligada al contenido aprobado", () => {
  it("cambiar un pasaje, una variante o la pregunta deja la pregunta en borrador", () => {
    const f = FRECUENTES.find((x) => x.id === "f12")!;
    expect(revisionDe(f).estado).toBe("aprobada");
    for (const cambiada of [
      { ...f, pasajes: [...f.pasajes, "t/01-introduccion/b1/0"] },
      { ...f, variantes: [...f.variantes, "otra forma"] },
      { ...f, pregunta: f.pregunta + " " },
    ]) {
      expect(huellaDe(cambiada)).not.toBe(huellaDe(f));
      expect(revisionDe(cambiada).estado).toBe("borrador");
    }
    // Restaurar lo aprobado restablece el estado (sin inventar una aprobación nueva).
    expect(revisionDe({ ...f }).estado).toBe("aprobada");
  });
});

describe("V50-02 · solo se imprime un material aprobado", () => {
  it("cada material tiene estado; sin registro o pendiente, no está listo", () => {
    for (const m of MATERIALES) expect(["aprobado", "pendiente"]).toContain(m.estado);
    expect(materialListo("no-existe")).toBe(false);
    for (const m of MATERIALES) expect(materialListo(m.id)).toBe(m.estado === "aprobado");
    expect(material("planes")?.estado).toBe("aprobado");
  });
});

describe("V50-11 · casos y repaso, fuera de esta edición y del build", () => {
  it("las constantes del build y la lista de retirados coinciden", () => {
    expect(CON_CASOS).toBe(false);
    expect(CON_REPASO).toBe(false);
    expect([...RETIRADOS].sort()).toEqual(["ampliacion", "casos", "repaso"]);
  });
});
