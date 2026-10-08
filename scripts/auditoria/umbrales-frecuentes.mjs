// Barrido de umbrales del emparejador de preguntas frecuentes sobre los bancos YA USADOS
// (ciego1-4): para cada búsqueda, la mejor frecuente sin umbral, con sus dos coberturas y si sus
// pasajes son aceptables. No vale como medida honesta (eso es ciego5).
// Uso: npx vite-node scripts/auditoria/umbrales-frecuentes.mjs
import { readFileSync } from "node:fs";
import { mejorFrecuente } from "../../src/respuestas.ts";
import { etiqueta } from "../../src/respuestas.bancos.ts";
import { normalizar } from "../../src/busqueda.ts";

const limpio = (s) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();
const filas = [];
for (const b of ["ciego1", "ciego2", "ciego3", "ciego4"]) {
  for (const p of JSON.parse(readFileSync(`src/bancos/${b}.json`, "utf8"))) {
    const m = mejorFrecuente(p.q);
    if (!m) continue;
    const ok = p.aceptables.length
      ? m.respuestas.some((x) => p.aceptables.some((a) => limpio(etiqueta(x)).includes(limpio(a))))
      : false;
    filas.push({
      b,
      q: p.q,
      id: m.id,
      db: m.deBusqueda,
      dp: m.dePregunta,
      ok,
      sin: !p.aceptables.length,
    });
  }
}
console.log("umbral búsqueda/pregunta → activan · aceptables · precisión");
for (const ub of [0.5, 0.6, 0.65, 0.7, 0.75])
  for (const up of [0.3, 0.4, 0.5, 0.6]) {
    const act = filas.filter((f) => f.db >= ub && f.dp >= up);
    const ok = act.filter((f) => f.ok).length;
    console.log(
      `${ub} / ${up} → ${act.length} · ${ok} · ${act.length ? Math.round((100 * ok) / act.length) : 0} %`,
    );
  }
if (process.env.DETALLE)
  for (const f of filas
    .filter((f) => f.db >= 0.6 && f.dp >= 0.4)
    .sort((a, b) => b.db + b.dp - a.db - a.dp))
    console.log(
      `${f.ok ? "✓" : f.sin ? "∅" : "✗"} ${f.db.toFixed(2)} ${f.dp.toFixed(2)} ${f.id} «${f.q}»`,
    );
