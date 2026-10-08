// Texto de un pasaje («átomo» de respuestas.ts) tal como se manda al modelo de significado: de
// dónde es, su título y lo que dice (casillas por sistema con su nombre). El mismo para construir
// los vectores (vectores.mjs) y para medir (fusion.mjs, analizar.mjs).
export const textoParaSentido = (r) =>
  [
    `${r.fuente} · ${r.titulo}.`,
    r.contexto ?? "",
    r.texto ?? "",
    ...(r.items ?? []),
    ...(r.partes ?? []).map((p) => `${p.etiqueta}: ${p.texto}`),
    ...(r.porSistema ?? []).map((s) => `${s.nombre}: ${s.texto}`),
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);
