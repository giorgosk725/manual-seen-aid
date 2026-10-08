// ¿Compensa buscar por el sentido? Sobre los bancos YA USADOS (ciego1-5; orientativo):
//  A) preguntas frecuentes por similitud (pregunta y variantes) con barrido de umbral;
//  B) pasajes por similitud directa (los 480 átomos), solos y fundidos con el motor.
// Uso: npx vite-node scripts/semantica/analizar.mjs
import { readFileSync } from "node:fs";
import { embeber, coseno } from "./embeber.mjs";
import { atomos, responder, preguntaFrecuente, frecuentePorSentido } from "../../src/respuestas.ts";
import { etiqueta } from "../../src/respuestas.bancos.ts";
import { normalizar } from "../../src/busqueda.ts";
import { FRECUENTES } from "../../src/frecuentes.ts";

const limpio = (s) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();
const bancos = ["ciego1", "ciego2", "ciego3", "ciego4", "ciego5"].flatMap((b) =>
  JSON.parse(readFileSync(`src/bancos/${b}.json`, "utf8")).map((p) => ({ ...p, b })),
);

// Vectores
const formas = FRECUENTES.flatMap((f) =>
  [f.pregunta, ...f.variantes].map((t) => ({ id: f.id, t })),
);
const vForma = await embeber(formas.map((x) => x.t));
const ats = atomos();
const textoAtomo = (a) => etiqueta(a.r).slice(0, 1500);
const vAtomo = await embeber(ats.map(textoAtomo));
const vQ = await embeber(bancos.map((p) => p.q));

const acept = (p, r) => p.aceptables.some((a) => limpio(etiqueta(r)).includes(limpio(a)));

// A) Frecuentes por sentido
const filas = bancos.map((p, i) => {
  const sims = new Map();
  formas.forEach((f, k) => {
    const s = coseno(vQ[i], vForma[k]);
    if (!sims.has(f.id) || s > sims.get(f.id)) sims.set(f.id, s);
  });
  const orden = [...sims.entries()].sort((a, b) => b[1] - a[1]);
  const rs = responder(p.q);
  const lex = preguntaFrecuente(p.q);
  return { p, orden, rs, lex };
});
const con = filas.filter((f) => f.p.aceptables.length);
const sin = filas.filter((f) => !f.p.aceptables.length);
const base1 = (f) =>
  f.lex ? f.lex.respuestas.some((r) => acept(f.p, r)) : !!f.rs[0] && acept(f.p, f.rs[0]);
console.log(`A) ${filas.length} preguntas (${con.length} con respuesta, ${sin.length} sin)`);
console.log(`   actual (palabras + frecuentes por palabras): 1.ª ${con.filter(base1).length}`);
for (const umbral of [0.6, 0.62, 0.65, 0.68, 0.7, 0.72, 0.75, 0.78, 0.8]) {
  let p1 = 0;
  let salta = 0;
  let bien = 0;
  let enSin = 0;
  for (const f of filas) {
    const cand = f.lex ? null : f.orden.filter(([, s]) => s >= umbral).map(([id]) => id);
    const sem = cand && cand.length ? frecuentePorSentido(f.p.q, cand) : null;
    if (!f.p.aceptables.length) {
      if (sem) enSin++;
      continue;
    }
    if (sem) {
      salta++;
      const ok = sem.respuestas.some((r) => acept(f.p, r));
      if (ok) bien++;
      p1 += ok ? 1 : 0;
    } else p1 += base1(f) ? 1 : 0;
  }
  console.log(
    `   umbral ${umbral}: 1.ª ${p1} (${p1 - con.filter(base1).length >= 0 ? "+" : ""}${p1 - con.filter(base1).length}) · saltan ${salta}, bien ${bien} (${salta ? Math.round((100 * bien) / salta) : 0} %) · en preguntas sin respuesta ${enSin}/${sin.length}`,
  );
}

// B) Pasajes por sentido
let s1 = 0;
let s3 = 0;
let l1 = 0;
let l3 = 0;
let h1 = 0;
let h3 = 0;
con.forEach((f) => {
  const i = filas.indexOf(f);
  const orden = ats.map((a, k) => [a, coseno(vQ[i], vAtomo[k])]).sort((x, y) => y[1] - x[1]);
  const sem = orden.slice(0, 10).map(([a]) => a.r);
  const lex = responder(f.p.q, { max: 10 });
  if (acept(f.p, sem[0])) s1++;
  if (sem.slice(0, 3).some((r) => acept(f.p, r))) s3++;
  if (lex[0] && acept(f.p, lex[0])) l1++;
  if (lex.slice(0, 3).some((r) => acept(f.p, r))) l3++;
  // Fusión por rango recíproco (RRF)
  const punt = new Map();
  const suma = (lista) =>
    lista.forEach((r, k) => {
      const clave = r.id;
      punt.set(clave, { r, s: (punt.get(clave)?.s ?? 0) + 1 / (60 + k) });
    });
  suma(lex);
  suma(sem);
  const fus = [...punt.values()].sort((a, b) => b.s - a.s).map((x) => x.r);
  if (fus[0] && acept(f.p, fus[0])) h1++;
  if (fus.slice(0, 3).some((r) => acept(f.p, r))) h3++;
});
const pc = (x) => `${Math.round((100 * x) / con.length)} %`;
console.log(`B) pasajes, ${con.length} preguntas con respuesta (1.ª · entre tres)`);
console.log(`   palabras (motor actual): ${pc(l1)} · ${pc(l3)}`);
console.log(`   sentido (similitud):     ${pc(s1)} · ${pc(s3)}`);
console.log(`   fusión de los dos (RRF): ${pc(h1)} · ${pc(h3)}`);
