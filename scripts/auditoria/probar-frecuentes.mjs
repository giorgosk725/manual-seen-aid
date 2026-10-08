// Preguntas frecuentes: (1) cada pregunta y cada variante encuentran su ficha; (2) en los bancos
// ciegos, cuántas búsquedas activan una y si sus pasajes son aceptables.
// Uso: npx vite-node scripts/auditoria/probar-frecuentes.mjs
import { readFileSync, existsSync } from "node:fs";
import { preguntaFrecuente } from "../../src/respuestas.ts";
import { etiqueta } from "../../src/respuestas.bancos.ts";
import { FRECUENTES } from "../../src/frecuentes.ts";
import { normalizar } from "../../src/busqueda.ts";

let ok = 0;
let total = 0;
const fallos = [];
for (const f of FRECUENTES)
  for (const t of [f.pregunta, ...f.variantes]) {
    total++;
    const r = preguntaFrecuente(t);
    if (r?.id === f.id) ok++;
    else fallos.push(`${f.id} «${t}» → ${r ? r.id : "nada"}`);
  }
console.log(`Autoencuentro: ${ok}/${total}`);
for (const x of fallos) console.log("   ", x);

const limpio = (s) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();
for (const b of ["ciego1", "ciego2", "ciego3", "ciego4", "ciego5"]) {
  const ruta = `src/bancos/${b}.json`;
  if (!existsSync(ruta)) continue;
  const banco = JSON.parse(readFileSync(ruta, "utf8"));
  let activa = 0;
  let buena = 0;
  let sinRespuesta = 0;
  const malas = [];
  for (const p of banco) {
    const r = preguntaFrecuente(p.q);
    if (!r) continue;
    activa++;
    if (!p.aceptables.length) {
      sinRespuesta++;
      malas.push(`   (no consta) «${p.q}» → ${r.id}`);
      continue;
    }
    const acierta = r.respuestas.some((x) =>
      p.aceptables.some((a) => limpio(etiqueta(x)).includes(limpio(a))),
    );
    if (acierta) buena++;
    else malas.push(`   «${p.q}» → ${r.id} ${r.pregunta}`);
  }
  console.log(
    `${b}: ${banco.length} preguntas · activan una frecuente ${activa} · aceptable ${buena} · en preguntas sin respuesta ${sinRespuesta}`,
  );
  if (process.env.DETALLE) for (const m of malas) console.log(m);
}
