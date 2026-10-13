/* Registra una revisión de una o varias preguntas frecuentes como EVENTO nuevo (fecha, versión,
   evidencia y huella de lo revisado) en src/frecuentes.aprobadas.json, sin borrar los
   anteriores (V54-05). Se ejecuta SOLO después de una revisión real, con su evidencia:
     npm run aprobar:frecuentes -- --fecha 2026-10-20 --version 0.56.0 \
       --evidencia "Revisión del autor en …" f12 f37
   La huella incluye el contenido de los pasajes citados: si la pregunta, sus variantes, sus
   pasajes o el texto de estos cambian sin pasar por aquí, la pregunta sale de la edición. */
import { readFileSync, writeFileSync } from "node:fs";
import { TODAS, huellaDe } from "../src/frecuentes";

const RUTA = "src/frecuentes.aprobadas.json";
const args = process.argv.slice(2);
const opcion = (n) => {
  const i = args.indexOf(`--${n}`);
  if (i < 0 || !args[i + 1]) return null;
  return args.splice(i, 2)[1];
};
const fecha = opcion("fecha");
const version = opcion("version");
const evidencia = opcion("evidencia");
const ids = args;
if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !version || !evidencia || !ids.length) {
  console.error("Uso: --fecha AAAA-MM-DD --version X.Y.Z --evidencia «qué revisión y dónde» id…");
  process.exit(1);
}
const eventos = JSON.parse(readFileSync(RUTA, "utf8"));
for (const id of ids) {
  const f = TODAS.find((x) => x.id === id);
  if (!f) {
    console.error(`No existe ${id}`);
    process.exit(1);
  }
  (eventos[id] ??= []).push({ fecha, version, evidencia, huella: huellaDe(f) });
}
const orden = Object.fromEntries(
  Object.entries(eventos).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1))),
);
writeFileSync(RUTA, JSON.stringify(orden, null, 2) + "\n");
console.log(`Revisión registrada: ${ids.length} pregunta(s), ${fecha}, ${version}.`);
