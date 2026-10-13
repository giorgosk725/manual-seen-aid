/* Las consultas del índice (0.65.0): la app lleva solo sus raíces (expansiones.json), sacadas de
   expansiones.consultas.json con el motor de hoy. Si cambia el texto, el léxico o las consultas,
   esta prueba falla; se regenera con `GENERAR=1 npx vitest run src/expansiones.test.ts`. */
import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { raicesDeConsultas } from "./respuestas";
import consultas from "./expansiones.consultas.json";
import guardadas from "./expansiones.json";

describe("consultas del índice", () => {
  it("expansiones.json está al día con las consultas y el motor", () => {
    const hoy = raicesDeConsultas(consultas as Record<string, string[]>);
    if (process.env.GENERAR) writeFileSync("src/expansiones.json", JSON.stringify(hoy) + "\n");
    else expect(guardadas).toEqual(hoy);
  });
  it("ninguna consulta nombra marcas o fármacos que el capítulo no trata", () => {
    const fuera =
      /fiasp|lyumjev|nightscout|teplizumab|medtrum|eversense|\bilet\b|icodec|semaglutida|ozempic|tirzepatida|novorapid|humalog|apidra|tresiba|toujeo|lantus|abasaglar|levemir|ypsomed|accu-?chek|\bdana\b|diabeloop|loop app/i;
    for (const [id, qs] of Object.entries(consultas as Record<string, string[]>))
      for (const q of qs) expect(fuera.test(q), `${id}: ${q}`).toBe(false);
  });
});
