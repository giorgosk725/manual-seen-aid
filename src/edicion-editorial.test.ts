/* Edición editorial, lote 1 (A01-A03): la cifra de β-OHB no elige rama, las Functions no
   reciben texto y la app no guarda búsquedas ni criterios. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { responder, preguntaFrecuente, frecuentesRelacionadas, respuestaPorId } from "./respuestas";
import {
  EVENTOS,
  FRECUENTES,
  FRECUENTES_TODAS,
  PROPUESTAS,
  huellaDe,
  revisionDe,
} from "./frecuentes";
import { indice, sugerir } from "./buscador";
import { tramoDeConsulta } from "./busqueda";
import { APARTADOS, FIGURA3, idDeBloque } from "./contenido";
import { CON_CASOS, CON_REPASO, EDICION, RETIRADOS, migrarPrivacidad } from "./edicion";
import { MATERIALES, material, materialListo } from "./materiales";
import { hojaExtraPorId } from "./hojas";
import APROBADAS_FAQ from "./frecuentes.aprobadas.json";
import { imprimirRegion } from "./imprimir";
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
  // 0.99.0: f104 (comida grasa en MiniMed 780G), junto a f83 en su tema; f83 y f103 revisadas el
  // 22-10-2026 por decisión del autor. 1.0.1: f105 (comida grasa en CamAPS FX), junto a f94.
  it("las 105 aprobadas, cada una con fecha y registro de su revisión", () => {
    expect(
      FRECUENTES.map((f) => f.id).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))),
    ).toEqual(Array.from({ length: 105 }, (_, i) => `f${String(i + 1).padStart(2, "0")}`));
    for (const f of FRECUENTES) {
      expect(f.revision.fecha, f.id).toMatch(/^2026-10-(08|11|13|14|15|22)$/);
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
    // 1.0.7 (revisión R105-03): el recuento del registro, el de los datos; cada pregunta, con su
    // aprobación registrada; un cambio posterior, con fecha posterior y su evidencia.
    expect(material("frecuentes")?.nombre).toBe(`Preguntas frecuentes (${FRECUENTES.length})`);
    for (const f of FRECUENTES) expect(Object.keys(APROBADAS_FAQ)).toContain(f.id);
    for (const m of MATERIALES)
      if (m.modificado) {
        expect(m.modificado.fecha > m.fecha).toBe(true);
        expect(m.modificado.evidencia.length).toBeGreaterThan(0);
      }
  });
});

describe("V50-11 · casos y repaso, fuera de esta edición y del build", () => {
  it("las constantes del build y la lista de retirados coinciden", () => {
    expect(CON_CASOS).toBe(false);
    expect(CON_REPASO).toBe(false);
    expect([...RETIRADOS].sort()).toEqual(["ampliacion", "casos", "repaso"]);
  });
});

describe("V54-05 · la revisión, ligada al texto efectivo y como historia de eventos", () => {
  it("cambiar en memoria el texto de un pasaje citado deja la pregunta sin revisión vigente", () => {
    const f = FRECUENTES_TODAS.find((x) => x.id === "f63")!;
    expect(revisionDe(f).estado).toBe("aprobada");
    const a = APARTADOS.find((x) => x.slug === "09-descarga")!;
    const b = a.bloques.find((x, i) => idDeBloque(x, i) === "b2") as { texto: string };
    const antes = b.texto;
    try {
      b.texto = antes + " (cambiado)";
      expect(revisionDe(f).estado).toBe("borrador");
      expect(revisionDe(f).registro).toMatch(/Cambió después de su revisión/);
    } finally {
      b.texto = antes;
    }
    expect(revisionDe(f).estado).toBe("aprobada");
  });
  it("cada pregunta tiene su historia: eventos con fecha, versión, evidencia y huella", () => {
    for (const f of FRECUENTES_TODAS) {
      const ev = EVENTOS[f.id];
      expect(Array.isArray(ev) && ev.length > 0, f.id).toBe(true);
      for (const e of ev) {
        expect(e.fecha, f.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(e.version, f.id).toMatch(/^\d+\.\d+\.\d+$/);
        expect(e.evidencia.length, f.id).toBeGreaterThan(20);
        expect(e.huella, f.id).toMatch(/^[0-9a-z]+$/);
      }
      // La vigente es la del último evento.
      expect(f.revision.fecha).toBe(ev.at(-1)!.fecha);
    }
  });
});

describe("V54-05 · las hojas adaptadas, ligadas a su texto revisado", () => {
  it("cambiar una palabra deja la hoja sin revisión; mover un bloque entero, no", () => {
    const h = hojaExtraPorId("cetonas")!;
    expect(materialListo("hoja-cetonas")).toBe(true);
    const item = h.secciones[0].items!;
    const antes = item[0];
    try {
      item[0] = antes + " (cambiado)";
      expect(materialListo("hoja-cetonas")).toBe(false);
    } finally {
      item[0] = antes;
    }
    const orden = [...h.secciones];
    try {
      h.secciones.reverse();
      expect(materialListo("hoja-cetonas")).toBe(true);
    } finally {
      h.secciones.splice(0, h.secciones.length, ...orden);
    }
    // V54-02: la alarma va la primera, marcada como urgente.
    expect(h.secciones[0].urgente).toBe(true);
    expect(h.secciones[0].titulo).toMatch(/^3,0 mmol\/l o más, o signos de alarma/);
  });
});

describe("V54-09 · no se imprime en silencio una versión incompleta", () => {
  afterEach(() => vi.useRealTimers());
  const preparar = () => {
    vi.useFakeTimers();
    const region = document.createElement("div");
    const hueco = document.createElement("div");
    hueco.setAttribute("aria-busy", "true");
    region.append(hueco);
    document.body.append(region);
    const print = vi.fn();
    const win = Object.assign(Object.create(window), {
      print,
      document,
      setTimeout: (f: () => void, ms: number) => setTimeout(f, ms),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    }) as unknown as Window;
    return { region, hueco, print, win };
  };
  it("con contenido cargándose a los 4 s: avisa, no imprime; «Cancelar» no imprime", () => {
    const { region, print, win } = preparar();
    imprimirRegion(() => region, win);
    vi.advanceTimersByTime(4300);
    const aviso = document.querySelector('[role="alertdialog"]')!;
    expect(aviso).not.toBeNull();
    expect(aviso.textContent).toMatch(/saldría incompleto/);
    expect(print).not.toHaveBeenCalled();
    (aviso.querySelectorAll("button")[1] as HTMLButtonElement).click();
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
    vi.advanceTimersByTime(5000);
    expect(print).not.toHaveBeenCalled();
    region.remove();
  });
  it("0.96.1 (N96-01): espera a la letra antes de imprimir", () => {
    const { region, hueco, print, win } = preparar();
    hueco.removeAttribute("aria-busy");
    const fuentes = { status: "loading" };
    Object.defineProperty(document, "fonts", { value: fuentes, configurable: true });
    try {
      imprimirRegion(() => region, win);
      vi.advanceTimersByTime(1000);
      expect(print).not.toHaveBeenCalled();
      fuentes.status = "loaded";
      vi.advanceTimersByTime(200);
      expect(print).toHaveBeenCalledTimes(1);
    } finally {
      delete (document as unknown as { fonts?: unknown }).fonts;
      region.remove();
    }
  });
  it("«Reintentar», ya cargado, imprime", () => {
    const { region, hueco, print, win } = preparar();
    imprimirRegion(() => region, win);
    vi.advanceTimersByTime(4300);
    hueco.removeAttribute("aria-busy");
    (document.querySelector('[role="alertdialog"] button') as HTMLButtonElement).click();
    vi.advanceTimersByTime(300);
    expect(print).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
    region.remove();
  });
});
