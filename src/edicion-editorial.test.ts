/* Edición editorial, lote 1 (A01-A03): la cifra de β-OHB no elige rama, las Functions no
   reciben texto y la app no guarda búsquedas ni criterios. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { responder } from "./respuestas";
import { tramoDeConsulta } from "./busqueda";
import { FIGURA3 } from "./contenido";
import { EDICION, migrarPrivacidad } from "./edicion";
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
