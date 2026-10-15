/* 0.72.0: escribir letra a letra no se toma como seguimiento de la búsqueda anterior. */
import { describe, expect, it } from "vitest";
import { consultaEfectiva, olvidarTema, recordarTema } from "./buscador";

describe("Seguimiento con el tema anterior", () => {
  it("una consulta que empieza por la anterior es la misma que se está escribiendo", () => {
    recordarTema("cam");
    expect(consultaEfectiva("camaps")).toBeNull();
    recordarTema("camaps");
    expect(consultaEfectiva("camaps tc")).toBeNull();
    expect(consultaEfectiva("cama")).toBeNull();
  });
  it("«y en Omnipod 5» sigue siendo un seguimiento", () => {
    recordarTema("resonancia con 780G");
    expect(consultaEfectiva("y en Omnipod 5")).not.toBeNull();
  });
  it("tras olvidar el tema (búsqueda sin respuesta o «Buscar solo …») no hay seguimiento", () => {
    recordarTema("resonancia con 780G");
    olvidarTema();
    expect(consultaEfectiva("y en Omnipod 5")).toBeNull();
  });
});
