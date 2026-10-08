// Construye functions/_datos/vectores.ts: el vector de significado (bge-m3, Workers AI) de cada
// pasaje que puede devolver el buscador, cuantizado a 8 bits por vector (con su escala), para la
// función /api/pasajes. Hay que volver a lanzarlo cuando cambie el texto del capítulo (lo vigila
// src/semantica.test.ts: ids y huella deben ser los de los átomos actuales).
// Uso: npx vite-node scripts/semantica/vectores.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { embeber, MODELO } from "./embeber.mjs";
import { textoParaSentido } from "./texto.mjs";
import { atomos } from "../../src/respuestas.ts";

const ats = atomos();
const textos = ats.map((a) => textoParaSentido(a.r));
const vs = await embeber(textos);
const DIM = vs[0].length;
const bytes = new Int8Array(ats.length * DIM);
const escalas = [];
vs.forEach((v, i) => {
  const norma = Math.sqrt(v.reduce((n, x) => n + x * x, 0));
  const u = v.map((x) => x / norma);
  const max = Math.max(...u.map(Math.abs));
  escalas.push(+(max / 127).toPrecision(6));
  u.forEach((x, k) => (bytes[i * DIM + k] = Math.round((x / max) * 127)));
});
const b64 = Buffer.from(bytes.buffer).toString("base64");
const huella = createHash("sha1").update(textos.join("\n")).digest("hex").slice(0, 12);
mkdirSync("functions/_datos", { recursive: true });
writeFileSync(
  "functions/_datos/vectores.ts",
  `/* Generado por scripts/semantica/vectores.mjs: no editar a mano. Vector de significado de cada
   pasaje del buscador (${ats.length} pasajes, ${MODELO}, ${DIM} dimensiones), unitario y cuantizado a
   8 bits con su escala. Huella del texto: ${huella}. */
export const MODELO = ${JSON.stringify(MODELO)};
export const DIM = ${DIM};
export const HUELLA = ${JSON.stringify(huella)};
export const IDS: string[] = ${JSON.stringify(ats.map((a) => a.r.id))};
export const ESCALAS: number[] = ${JSON.stringify(escalas)};
export const VECTORES = ${JSON.stringify(b64)};
`,
);
console.log(
  `${ats.length} pasajes · ${DIM} dimensiones · ${Math.round(b64.length / 1024)} KiB · huella ${huella}`,
);
