/* Búsqueda por el sentido: la fusión con el buscador por palabras y los vectores publicados.
   La calidad se mide aparte, con el servicio (scripts/semantica/fusion.mjs y un banco ciego). */
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { atomos, fusionar, responder } from "./respuestas";
import { DIM, ESCALAS, HUELLA, IDS, VECTORES } from "../functions/_datos/vectores";
import { parecidos } from "../functions/_lib/parecidos";
import { textoParaSentido } from "../scripts/semantica/texto.mjs";

describe("Búsqueda por el sentido", () => {
  it("los vectores publicados son los de los pasajes actuales (si no, scripts/semantica/vectores.mjs)", () => {
    const ats = atomos();
    expect(IDS).toEqual(ats.map((a) => a.r.id));
    const huella = createHash("sha1")
      .update(ats.map((a) => textoParaSentido(a.r)).join("\n"))
      .digest("hex")
      .slice(0, 12);
    expect(HUELLA).toBe(huella);
    expect(ESCALAS).toHaveLength(IDS.length);
    expect(atob(VECTORES).length).toBe(IDS.length * DIM);
  });
  it("el vector de un pasaje encuentra ese pasaje el primero", () => {
    const bin = atob(VECTORES);
    for (const i of [0, 57, 200, IDS.length - 1]) {
      const v = Array.from({ length: DIM }, (_, k) => (bin.charCodeAt(i * DIM + k) << 24) >> 24);
      expect(parecidos(v)[0].id).toBe(IDS[i]);
    }
  });
  it("sin parecidos (sin conexión), la fusión es el buscador de siempre", () => {
    for (const q of ["cetonas 1,2", "modo sueño Control-IQ", "resonancia con 780G"])
      expect(fusionar(q, [])).toEqual(responder(q));
  });
  it("con una cifra de β-OHB manda la rama de la Figura 3", () => {
    const r = fusionar("cetonas 1,2 qué hago", [{ id: "t/09-descarga/b21/0", s: 0.9 }]);
    expect(r[0].id).toBe("F3/naranja");
  });
  it("lo que solo aporta el sentido, con similitud baja, va como coincidencia parcial", () => {
    const r = fusionar("modo sueño Control-IQ", [
      { id: "t/12-horizonte/b4/0", s: 0.65 },
      { id: "t/12-horizonte/b4/1", s: 0.64 },
    ]);
    const solo = r.filter((x) => x.id.startsWith("t/12-horizonte"));
    for (const x of solo) expect(x.aproximada).toBe(true);
    // Lo que el capítulo no trata: el sentido no se presenta como respuesta.
    expect(
      fusionar("precio del seguro médico privado", [{ id: "t/12-horizonte/b3/0", s: 0.75 }]).every(
        (x) => x.aproximada,
      ),
    ).toBe(true);
  });
});
