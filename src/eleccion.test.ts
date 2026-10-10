/* Elegir un sistema: los umbrales salen de la Tabla 1 y no pueden separarse de ella. */
import { describe, expect, it } from "vitest";
import { TABLAS } from "./contenido";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";
import {
  SENSORES,
  VARIANTES,
  celdaT1,
  escribirCriterios,
  leerCriterios,
  veredictos,
} from "./eleccion";

describe("Elegir un sistema", () => {
  it("cada umbral lleva su fragmento literal, y el fragmento está en la Tabla 1 de ese sistema", () => {
    for (const id of ORDEN_SISTEMAS) {
      const c = ORDEN_SISTEMAS.indexOf(id);
      const celdas = `${celdaT1("Indicación", c)}\n${celdaT1("Gestación: autorización y evidencia", c)}`;
      for (const v of VARIANTES[id]) {
        expect(v.literal.length, id).toBeGreaterThan(0);
        for (const frag of v.literal) expect(celdas, `${id} · ${frag}`).toContain(frag);
        // Los números de la variante aparecen tal cual en sus fragmentos.
        const texto = v.literal.join(" ");
        if (v.edadMin !== undefined) expect(texto).toMatch(new RegExp(`[≥>] ${v.edadMin} año`));
        if (v.pesoMin !== undefined) expect(texto).toMatch(new RegExp(`peso (≥ )?${v.pesoMin}`));
        if (v.pesoMax !== undefined) expect(texto).toContain(`–${v.pesoMax} kg`);
        if (v.dtdMin !== undefined) expect(texto).toMatch(new RegExp(`DTD (≥ )?${v.dtdMin}`));
        if (v.dtdMax !== undefined) expect(texto).toContain(`–${v.dtdMax} UI/día`);
      }
    }
  });

  it("los sensores del selector son los de la fila «Sensores compatibles»", () => {
    const fila = TABLAS.T1.filas.find((f) => f.etiqueta === "Sensores compatibles")!;
    const todos = fila.celdas.join("; ");
    for (const s of SENSORES) expect(todos).toContain(s);
  });

  it("un niño de 4 años en gestación no aplica; con 4 años y 18 kg: Control-IQ fuera, Control-IQ+ cumple; Omnipod 5 sin peso", () => {
    const r = veredictos({ edad: 4, peso: 18 });
    const ciq = r.find((x) => x.id === "ciq")!;
    expect(ciq.variantes.find((v) => v.nombre === "Control-IQ")!.fuera).toEqual(["edad", "peso"]);
    expect(ciq.variantes.find((v) => v.nombre === "Control-IQ+")!.estado).toBe("cumple");
    expect(ciq.estado).toBe("cumple");
    const op5 = r.find((x) => x.id === "op5")!;
    expect(op5.variantes[0].sinDato).toEqual(["peso"]);
    expect(op5.estado).toBe("no-consta");
    // Liberty: «> 13 años», 13 no entra.
    const lib = veredictos({ edad: 13 }).find((x) => x.id === "camaps")!;
    expect(lib.variantes.find((v) => v.nombre === "Liberty")!.estado).toBe("fuera");
    expect(lib.variantes.find((v) => v.nombre === "CamAPS FX")!.estado).toBe("cumple");
  });

  it("gestación: Omnipod 5 y Control-IQ fuera; pod sin tubo: solo Omnipod 5; los que cumplen van primero", () => {
    const g = veredictos({ gestacion: true });
    expect(g.find((x) => x.id === "op5")!.estado).toBe("fuera");
    expect(g.find((x) => x.id === "ciq")!.variantes.map((v) => v.estado)).toEqual([
      "fuera",
      "cumple",
    ]);
    expect(g[0].estado).toBe("cumple");
    const p = veredictos({ formato: "pod" });
    expect(p.filter((x) => x.estado === "cumple").map((x) => x.id)).toEqual(["op5"]);
    const s = veredictos({ sensor: "FreeStyle Libre 2 Plus", movil: true });
    expect(s.find((x) => x.id === "op5")!.variantes[0].sinDato).toEqual(["movil"]);
    expect(s.find((x) => x.id === "mm780")!.variantes[0].fuera).toEqual(["sensor", "movil"]);
    expect(s.find((x) => x.id === "camaps")!.variantes[0].fuera).toEqual(["sensor"]);
  });

  it("los criterios viajan en la ruta y vuelven iguales", () => {
    const c = {
      edad: 4,
      peso: 18.5,
      dtd: 12,
      gestacion: true,
      formato: "pod" as const,
      sensor: "Dexcom G7",
    };
    expect(leerCriterios(escribirCriterios(c))).toEqual(c);
    expect(escribirCriterios({})).toBeUndefined();
    expect(leerCriterios("edad:abc+sensor:Otro+dm2")).toEqual({ dm2: true });
  });
});
