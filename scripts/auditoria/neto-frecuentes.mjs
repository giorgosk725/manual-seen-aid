// Efecto neto de enseñar primero la pregunta frecuente frente a la primera respuesta del motor,
// por umbral, en los bancos YA USADOS (ciego1-4). Orientativo; la medida honesta es ciego5.
// Uso: npx vite-node scripts/auditoria/neto-frecuentes.mjs
import { readFileSync } from "node:fs";
import { mejorFrecuente, responder } from "../../src/respuestas.ts";
import { etiqueta } from "../../src/respuestas.bancos.ts";
import { normalizar } from "../../src/busqueda.ts";

const limpio = (s) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();
const filas = [];
for (const b of ["ciego1", "ciego2", "ciego3", "ciego4"])
  for (const p of JSON.parse(readFileSync(`src/bancos/${b}.json`, "utf8"))) {
    if (!p.aceptables.length) continue;
    const acept = (r) => p.aceptables.some((a) => limpio(etiqueta(r)).includes(limpio(a)));
    const rs = responder(p.q);
    const m = mejorFrecuente(p.q);
    filas.push({
      motor1: !!rs[0] && acept(rs[0]),
      motor3: rs.some(acept),
      faq: m ? m.respuestas.some(acept) : false,
      db: m?.deBusqueda ?? 0,
      dp: m?.dePregunta ?? 0,
    });
  }
const n = filas.length;
const base1 = filas.filter((f) => f.motor1).length;
const base3 = filas.filter((f) => f.motor3).length;
console.log(`${n} preguntas con respuesta · motor solo: 1.ª ${base1} · entre tres ${base3}`);
for (const [ub, up] of [
  [0.75, 0.6],
  [0.7, 0.6],
  [0.7, 0.5],
  [0.65, 0.6],
  [0.65, 0.5],
  [0.6, 0.6],
  [0.6, 0.5],
  [0.5, 0.5],
]) {
  let p1 = 0;
  let p3 = 0;
  for (const f of filas) {
    const activa = f.db >= ub && f.dp >= up;
    p1 += activa ? (f.faq ? 1 : 0) : f.motor1 ? 1 : 0;
    p3 += activa ? (f.faq || f.motor3 ? 1 : 0) : f.motor3 ? 1 : 0;
  }
  console.log(
    `${ub}/${up}: 1.ª ${p1} (${p1 - base1 >= 0 ? "+" : ""}${p1 - base1}) · entre tres ${p3} (+${p3 - base3})`,
  );
}
