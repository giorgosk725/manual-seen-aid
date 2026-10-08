// Primera respuesta de cada pregunta de los bancos ciegos, a un JSON (para comparar dos
// versiones del motor). Uso: npx vite-node scripts/auditoria/resultados-ciegos.mjs salida.json
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { responder } from "../../src/respuestas.ts";
import { etiqueta } from "../../src/respuestas.bancos.ts";
import { normalizar } from "../../src/busqueda.ts";

const limpio = (s) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();
const bancos = ["ciego1", "ciego2", "ciego3", "ciego4"].filter((b) =>
  existsSync(`src/bancos/${b}.json`),
);
const out = {};
for (const b of bancos) {
  const banco = JSON.parse(readFileSync(`src/bancos/${b}.json`, "utf8"));
  out[b] = banco.map((p) => {
    const rs = responder(p.q);
    const ok = (r) => p.aceptables.some((a) => limpio(etiqueta(r)).includes(limpio(a)));
    const directa = rs.some((r) => !r.aproximada);
    return {
      q: p.q,
      primera: rs[0] ? `${rs[0].aproximada ? "~" : "="}${rs[0].id}` : "(no consta)",
      ok1: p.aceptables.length ? !!rs[0] && ok(rs[0]) : !directa,
      ok3: p.aceptables.length ? rs.some(ok) : !directa,
    };
  });
}
writeFileSync(process.argv[2] ?? "_ciegos.json", JSON.stringify(out, null, 1));
