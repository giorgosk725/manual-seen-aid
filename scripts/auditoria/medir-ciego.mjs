// Mide un banco ciego con y sin preguntas frecuentes, en total y por perfil.
// Uso: npx vite-node scripts/auditoria/medir-ciego.mjs src/bancos/ciego5.json
import { readFileSync } from "node:fs";
import { medirCiego } from "../../src/respuestas.bancos.ts";

const banco = JSON.parse(readFileSync(process.argv[2], "utf8"));
const pc = (x) => `${(100 * x).toFixed(1)} %`;
for (const frecuentes of [false, true]) {
  const m = medirCiego(banco, { frecuentes });
  console.log(
    `${frecuentes ? "con frecuentes" : "sin frecuentes"}: primera ${pc(m.primera)} · entre tres ${pc(m.entreTres)} · directas equivocadas ${pc(m.equivocadas)} (n=${m.n})`,
  );
  for (const perfil of ["residente", "adjunto", "enfermeria"]) {
    const sub = banco.filter((p) => p.perfil === perfil);
    const s = medirCiego(sub, { frecuentes });
    console.log(`   ${perfil} (${sub.length}): ${pc(s.primera)} · ${pc(s.entreTres)}`);
  }
}
