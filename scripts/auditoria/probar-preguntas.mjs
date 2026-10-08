// Muestra las respuestas del buscador a unas preguntas (por defecto, las 6 de la auditoría
// externa del 6-10-2026). Uso: npx vite-node scripts/auditoria/probar-preguntas.mjs ["pregunta"…]
import { responder } from "../../src/respuestas.ts";
import { buscar } from "../../src/buscador.ts";

const preguntas = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "¿Qué parámetros cambian realmente el automático de Omnipod 5?",
      "¿Puede el modo sueño de Tandem dar autocorrecciones?",
      "¿Qué revisar antes de cambiar los parámetros si sale mucho del automático?",
      "¿La HbA1c alta es necesaria para ofrecer AID?",
      "¿Qué cambia cuando aparecen cetonas con glucosa normal?",
      "¿Cómo interpretar muchas autocorrecciones con TIR bueno?",
    ];

for (const q of preguntas) {
  const rs = responder(q);
  console.log(`\n«${q}»`);
  if (!rs.length) console.log("   (no consta)");
  for (const r of rs) {
    const txt =
      (r.porSistema?.length
        ? r.porSistema.map((s) => `[${s.nombre}] ${s.texto}`).join(" | ")
        : r.texto) ?? "";
    console.log(
      `   ${r.aproximada ? "~" : "="} ${r.id} · ${r.titulo.slice(0, 50)} · ${txt.replace(/\s+/g, " ").slice(0, 150)}`,
    );
  }
  const lit = buscar(q);
  console.log(`   búsqueda literal: ${lit.length} resultados`);
}
