// Fusión palabras + sentido sobre los pasajes, tal como la vería el usuario, con las mismas
// métricas que medirCiego (primera, entre tres, directas equivocadas) y la abstención en las
// preguntas sin respuesta. Bancos YA USADOS salvo que se pase otro: orientativo.
// Uso: npx vite-node scripts/semantica/fusion.mjs [src/bancos/ciegoN.json …]
import { readFileSync } from "node:fs";
import { embeber } from "./embeber.mjs";
import { parecidos as cercanos } from "../../functions/_lib/parecidos.ts";
import { preguntaFrecuente, fusionar } from "../../src/respuestas.ts";
import { etiqueta } from "../../src/respuestas.bancos.ts";
import { normalizar } from "../../src/busqueda.ts";

const rutas = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["ciego1", "ciego2", "ciego3", "ciego4", "ciego5"].map((b) => `src/bancos/${b}.json`);
const limpio = (s) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();

for (const ruta of rutas) {
  const banco = JSON.parse(readFileSync(ruta, "utf8"));
  const vQ = await embeber(banco.map((p) => p.q));
  const res = {};
  for (const modo of ["palabras", "fusión"]) {
    let primera = 0;
    let tres = 0;
    let equivocadas = 0;
    banco.forEach((p, i) => {
      const ok = (r) => p.aceptables.some((a) => limpio(etiqueta(r)).includes(limpio(a)));
      const f = preguntaFrecuente(p.q);
      const parecidos = modo === "fusión" ? cercanos(vQ[i]) : [];
      const rs = fusionar(p.q, parecidos);
      const directa = !!f || rs.some((r) => !r.aproximada);
      const ok1 = p.aceptables.length
        ? f
          ? f.respuestas.some(ok)
          : !!rs[0] && ok(rs[0])
        : !directa;
      if (ok1) primera++;
      if (p.aceptables.length ? (f?.respuestas.some(ok) ?? false) || rs.some(ok) : !directa) tres++;
      if (p.aceptables.length && !ok1 && (f || (rs[0] && !rs[0].aproximada))) equivocadas++;
    });
    const n = banco.length;
    res[modo] =
      `${((100 * primera) / n).toFixed(1)} % · ${((100 * tres) / n).toFixed(1)} % · ${((100 * equivocadas) / n).toFixed(1)} %`;
  }
  console.log(`${ruta} (${banco.length}): palabras ${res["palabras"]} | fusión ${res["fusión"]}`);
}
