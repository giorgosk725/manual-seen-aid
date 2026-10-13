/* Registra la huella de lo aprobado de una o varias preguntas frecuentes
   (src/frecuentes.aprobadas.json). Se ejecuta SOLO después de la revisión del autor:
     npx vite-node scripts/aprobar-frecuentes.mjs f12 f37      (esas)
     npx vite-node scripts/aprobar-frecuentes.mjs --todas      (todas las que tienen registro)
   Una pregunta cuyo contenido cambia sin pasar por aquí sale de la edición (huella distinta). */
import { readFileSync, writeFileSync } from "node:fs";
import { TODAS, huellaDe } from "../src/frecuentes";

const RUTA = "src/frecuentes.aprobadas.json";
const args = process.argv.slice(2);
if (!args.length) {
  console.error("Indica los ids aprobados o --todas.");
  process.exit(1);
}
const aprobadas = JSON.parse(readFileSync(RUTA, "utf8"));
const ids = args[0] === "--todas" ? TODAS.map((f) => f.id) : args;
for (const id of ids) {
  const f = TODAS.find((x) => x.id === id);
  if (!f) {
    console.error(`No existe ${id}`);
    process.exit(1);
  }
  aprobadas[id] = huellaDe(f);
}
const orden = Object.fromEntries(
  Object.entries(aprobadas).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1))),
);
writeFileSync(RUTA, JSON.stringify(orden, null, 2) + "\n");
console.log(`Huella registrada: ${ids.length} pregunta(s).`);
