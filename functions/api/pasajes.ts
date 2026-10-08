/* POST /api/pasajes {q} → {parecidos: [{id, s}]}: los 10 pasajes del capítulo más parecidos por
   el sentido a la búsqueda (modelo multilingüe de Workers AI). La app los funde con los de su
   buscador por palabras (fusionar, src/respuestas.ts). No guarda ni registra la búsqueda: solo
   la manda al modelo y devuelve ids de pasajes y su similitud. Sin servicio, la app sigue con el
   buscador por palabras. */
import { MODELO } from "../_datos/vectores";
import { parecidos } from "../_lib/parecidos";

interface Env {
  AI?: { run: (modelo: string, entrada: { text: string[] }) => Promise<{ data: number[][] }> };
}

const json = (datos: unknown, status = 200) =>
  new Response(JSON.stringify(datos), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  let cuerpo: { q?: unknown };
  try {
    cuerpo = (await request.json()) as { q?: unknown };
  } catch {
    return json({ parecidos: [] }, 400);
  }
  const q = (typeof cuerpo.q === "string" ? cuerpo.q : "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  if (q.length < 3) return json({ parecidos: [] });
  if (!env.AI) return json({ parecidos: [] }, 503);
  try {
    const r = await env.AI.run(MODELO, { text: [q] });
    return json({ parecidos: parecidos(r.data[0]) });
  } catch {
    return json({ parecidos: [] }, 502);
  }
}
