// Exporta los pasajes («átomos») que puede devolver el buscador, con su id, título, texto
// literal y página, a un JSON (para redactar y revisar preguntas frecuentes).
// Uso: npx vite-node scripts/auditoria/exportar-atomos.mjs salida.json
import { writeFileSync } from "node:fs";
import { atomos } from "../../src/respuestas.ts";

const out = atomos().map((a) => ({
  id: a.r.id,
  tipo: a.r.tipo,
  fuente: a.r.fuente,
  titulo: a.r.titulo,
  contexto: a.r.contexto ?? "",
  texto: a.r.texto ?? "",
  items: a.r.items ?? [],
  partes: (a.r.partes ?? []).map((p) => `${p.etiqueta}: ${p.texto}`),
  porSistema: (a.r.porSistema ?? []).map((s) => `${s.nombre}: ${s.texto}`),
  pagina: a.r.pagina,
  pagina2: a.r.pagina2 ?? null,
  ruta: a.r.ruta,
}));
writeFileSync(process.argv[2] ?? "_atomos.json", JSON.stringify(out, null, 1));
console.log(out.length, "átomos");
