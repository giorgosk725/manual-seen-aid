import { describe, expect, it } from "vitest";
import { PASOS_GUIA, pasoPropioDe, piezasDePaso, seEnsenaEnPaso } from "./guia-inicio";
import {
  frasesDe,
  hojaDeComprobacion,
  frasePorSistema,
  incisosDelSistema,
  lineasInicializacion,
  listaDe,
  soloDeOtroSistema,
  textosDePieza,
  type Pieza,
} from "./inicio";

/* 0.96.1 (revisión de Codex, N96-02): el filtrado de Iniciación por sistema (0.96.0) y «cada pieza,
   una vez en el recorrido». Orden de los sistemas: 0 MiniMed 780G, 1 Control-IQ, 2 CamAPS FX,
   3 Omnipod 5. */
const SISTEMAS = [0, 1, 2, 3];
const I = "08-iniciacion";

describe("soloDeOtroSistema / incisosDelSistema", () => {
  it("una frase que empieza por otro sistema se omite; la del elegido, no", () => {
    const t = "Con CamAPS FX, el objetivo puede reducirse";
    expect(SISTEMAS.map((s) => soloDeOtroSistema(t, s))).toEqual([true, true, false, true]);
    const u = "en Tandem Control-IQ, el perfil basal sí interviene";
    expect(SISTEMAS.map((s) => soloDeOtroSistema(u, s))).toEqual([true, false, true, true]);
    for (const [txt, propio] of [
      ["En MiniMed 780G, x", 0],
      ["Con 780G, x", 0],
      ["En Control-IQ+, x", 1],
      ["Con myLoop CamAPS FX, x", 2],
      ["Y en Omnipod 5, x", 3],
    ] as const)
      for (const s of SISTEMAS)
        expect(soloDeOtroSistema(txt, s), `${txt} · ${s}`).toBe(s !== propio);
  });
  it("la que nombra a varios sistemas se queda en los que nombra", () => {
    const t = "En MiniMed 780G y CamAPS FX, el objetivo es fijo";
    expect(SISTEMAS.map((s) => soloDeOtroSistema(t, s))).toEqual([false, true, false, true]);
  });
  it("la que no nombra sistema o no empieza por él se enseña siempre", () => {
    for (const t of [
      "El objetivo glucémico se programa el primer día",
      "Se revisa con MiniMed 780G a la semana",
      "Con el sensor colocado, se calibra",
      "",
    ])
      for (const s of SISTEMAS) expect(soloDeOtroSistema(t, s), t).toBe(false);
  });
  it("de una casilla con incisos, solo se quitan los de otro sistema y el resto queda literal", () => {
    const t = "Común a todos; en Tandem Control-IQ, sí interviene; con CamAPS FX, se reduce";
    expect(incisosDelSistema(t, 0)).toBe("Común a todos");
    expect(incisosDelSistema(t, 1)).toBe("Común a todos; en Tandem Control-IQ, sí interviene");
    expect(incisosDelSistema(t, 2)).toBe("Común a todos; con CamAPS FX, se reduce");
    expect(incisosDelSistema("Sin incisos de sistema", 3)).toBe("Sin incisos de sistema");
  });
});

describe("frasePorSistema (0.97.1)", () => {
  const t =
    "Su peso varía por sistema: en Control-IQ interviene directamente en el modo automático; en MiniMed 780G y CamAPS FX actúa sobre todo en modo manual; y en Omnipod 5 contribuye al inicio y luego cede ante la basal adaptativa.";
  it("deja el inciso del sistema elegido, con el principio literal", () => {
    expect(frasePorSistema(t, 1)).toBe(
      "Su peso varía por sistema: en Control-IQ interviene directamente en el modo automático.",
    );
    expect(frasePorSistema(t, 0)).toBe(
      "Su peso varía por sistema: en MiniMed 780G y CamAPS FX actúa sobre todo en modo manual.",
    );
    expect(frasePorSistema(t, 2)).toBe(frasePorSistema(t, 0));
    expect(frasePorSistema(t, 3)).toBe(
      "Su peso varía por sistema: en Omnipod 5 contribuye al inicio y luego cede ante la basal adaptativa.",
    );
  });
  it("entera si tras los dos puntos hay algo común o no hay incisos por sistema", () => {
    const comun = "Conviene revisar: el set; en Omnipod 5, el pod";
    expect(frasePorSistema(comun, 0)).toBe(comun);
    const sinDosPuntos = "En Control-IQ interviene; en Omnipod 5 contribuye";
    expect(frasePorSistema(sinDosPuntos, 0)).toBe(sinDosPuntos);
    expect(frasePorSistema("Objetivo: 100 mg/dl", 2)).toBe("Objetivo: 100 mg/dl");
  });
  it("la frase del capítulo está y se filtra así en el paso de parámetros", () => {
    const paso = PASOS_GUIA.findIndex((p) => p.id === "parametros");
    const frases = piezasDePaso(PASOS_GUIA[paso], {}).flatMap((pz) =>
      pz.t === "frase" ? frasesDe(pz.apartado, pz.bloque, pz.k).frases : [],
    );
    const peso = frases.find((x) => x.startsWith("Su peso varía por sistema:"));
    expect(peso).toBeDefined();
    for (const s of SISTEMAS) expect(frasePorSistema(peso!, s)).not.toBe(peso);
  });
});

/* Los textos de cada pieza como se filtran al pintarlas (Piezas.tsx): las frases, una a una; las
   celdas, por incisos («; »). */
const trozos = (pz: Pieza, s: number) =>
  pz.t === "frase"
    ? frasesDe(pz.apartado, pz.bloque, pz.k, pz.trozo).frases
    : textosDePieza(pz, s).flatMap((t) => t.split(/;\s+/));

describe("el filtrado con el texto del capítulo", () => {
  const todas = PASOS_GUIA.flatMap((p) => piezasDePaso(p, {}));
  it("lo que se omite para un sistema se enseña en el sistema que nombra", () => {
    let omitidos = 0;
    for (const s of SISTEMAS)
      for (const pz of todas)
        for (const t of trozos(pz, s))
          if (soloDeOtroSistema(t, s)) {
            omitidos++;
            expect(
              SISTEMAS.filter((c) => !soloDeOtroSistema(t, c)),
              t,
            ).toHaveLength(1);
          }
    // Hoy: «Con CamAPS FX, el objetivo…» (en tres sistemas) y «en Tandem Control-IQ, el perfil
    // basal…» (en tres). Si cambia, que sea a sabiendas.
    expect(omitidos).toBe(6);
  });
  it("ningún paso se queda vacío con un sistema elegido", () => {
    for (const s of SISTEMAS)
      PASOS_GUIA.forEach((p, k) => {
        const quedan = piezasDePaso(p, {}).flatMap((pz) =>
          trozos(pz, s).filter((t) => t.trim() && !soloDeOtroSistema(t, s)),
        );
        expect(quedan.length, `paso ${k + 1} · sistema ${s}`).toBeGreaterThan(0);
      });
  });
  it("la frase de CamAPS FX sobre el objetivo, en el paso de objetivos y solo con CamAPS FX", () => {
    const paso = PASOS_GUIA.findIndex((p) => p.id === "objetivos");
    const frases = piezasDePaso(PASOS_GUIA[paso], {}).flatMap((pz) =>
      pz.t === "frase" ? frasesDe(pz.apartado, pz.bloque, pz.k).frases : [],
    );
    const camaps = frases.find((t) => /^Con CamAPS FX, el objetivo/.test(t));
    expect(camaps).toBeDefined();
    expect(SISTEMAS.filter((s) => !soloDeOtroSistema(camaps!, s))).toEqual([2]);
  });
});

describe("pasoPropioDe / seEnsenaEnPaso", () => {
  it("una pieza fija de su paso no se manda a otro", () => {
    PASOS_GUIA.forEach((p, k) => {
      for (const pz of p.piezas) expect(pasoPropioDe(pz, k), JSON.stringify(pz)).toBeNull();
    });
  });
  it("la de una opción que otro paso tiene como propia va a ese paso, donde está", () => {
    let enlazadas = 0;
    PASOS_GUIA.forEach((p, k) => {
      for (const q of p.preguntas ?? [])
        for (const o of q.opciones)
          for (const pz of o.piezas) {
            const n = pasoPropioDe(pz, k);
            if (n === null) continue;
            enlazadas++;
            expect(n - 1).not.toBe(k);
            expect(
              PASOS_GUIA[n - 1].piezas.map((x) => JSON.stringify(x)),
              JSON.stringify(pz),
            ).toContain(JSON.stringify(pz));
            expect(seEnsenaEnPaso(pz, n - 1, {})).toBe(true);
          }
    });
    // «Otro sistema de asa cerrada»: la casilla de parámetros de la Tabla 1, en «Parámetros».
    expect(enlazadas).toBeGreaterThan(0);
    expect(pasoPropioDe({ t: "casilla", tabla: "T1", fila: 10 }, 0)).toBe(
      PASOS_GUIA.findIndex((p) => p.id === "parametros") + 1,
    );
  });
  it("tres pautas previas: cada una enseña lo suyo en el primer paso", () => {
    const isci: Pieza = { t: "frase", apartado: I, bloque: "b8", k: [0] };
    const mdi: Pieza = { t: "fila", tabla: "T2", fila: 2 };
    const aid: Pieza = { t: "casilla", tabla: "T1", fila: 10 };
    expect(seEnsenaEnPaso(isci, 0, { pauta: "isci" })).toBe(true);
    expect(seEnsenaEnPaso(isci, 0, { pauta: "mdi" })).toBe(false);
    expect(seEnsenaEnPaso(mdi, 0, { pauta: "mdi" })).toBe(true);
    expect(seEnsenaEnPaso(mdi, 0, { pauta: "aid" })).toBe(false);
    expect(seEnsenaEnPaso(aid, 0, { pauta: "aid" })).toBe(true);
    // Sin elegir, todas.
    for (const pz of [isci, mdi, aid]) expect(seEnsenaEnPaso(pz, 0, {})).toBe(true);
    // Una frase suelta de un párrafo que otro paso enseña solo en parte (b8 [2,3]), no.
    expect(seEnsenaEnPaso(isci, 1, {})).toBe(false);
  });
  it("basal ultralarga: la fila de la Tabla 2, solo con glargina U-300 o degludec", () => {
    const larga: Pieza = { t: "fila", tabla: "T2", fila: 8 };
    expect(seEnsenaEnPaso(larga, 0, { pauta: "mdi", basal: "larga" })).toBe(true);
    expect(seEnsenaEnPaso(larga, 0, { pauta: "mdi", basal: "u100" })).toBe(false);
    expect(seEnsenaEnPaso(larga, 0, { pauta: "isci" })).toBe(false);
    expect(seEnsenaEnPaso(larga, 0, { pauta: "mdi" })).toBe(true);
  });
});

describe("la hoja de comprobación conserva todos los requisitos", () => {
  const plan = listaDe("07-educacion", "b4");
  for (const s of [undefined, ...SISTEMAS])
    it(`con ${s === undefined ? "ningún sistema" : `el sistema ${s}`}`, () => {
      const h = hojaDeComprobacion(s);
      const textos = h.antes.map((x) => x.texto);
      for (const item of plan.items) expect(textos).toContain(item);
      expect(textos).toContain(frasesDe(I, "b6", [0]).frases[0]);
      for (const l of lineasInicializacion(s)) expect(textos).toContain(l);
      expect(h.antes.some((x) => x.pieza?.t === "fila" && x.pieza.fila === 8)).toBe(true);
      expect(h.citas).toHaveLength(4);
    });
});
