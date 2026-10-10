/* Consultas sin respuesta. POST /api/sin-respuesta {q, i} desde la app cuando una búsqueda no
   encuentra ningún pasaje ni pregunta frecuente: guarda en KV solo el texto de la consulta (en
   minúsculas, sin espacios de más), cuántas veces se ha hecho, cuántas de ellas tenían al menos
   resultados del índice y el mes de la última. Nada de quién la hizo: ni IP, ni navegador, ni
   fecha exacta. GET con la clave (cabecera X-Clave) devuelve la lista para mejorar el buscador. */

interface KV {
  get: (clave: string, tipo: "json") => Promise<Registro | null>;
  put: (clave: string, valor: string, opciones?: { expirationTtl: number }) => Promise<void>;
  list: (opciones: {
    prefix: string;
    limit?: number;
    cursor?: string;
  }) => Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
}
interface Env {
  CONSULTAS?: KV;
  CLAVE_CONSULTAS?: string;
}
interface Registro {
  n: number; // veces
  i: number; // de ellas, con resultados del índice (pero sin pasaje ni pregunta frecuente)
  m: string; // mes de la última («2026-10»)
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

/* Lo que no se guarda: correos, URL, cifras largas (teléfonos, historias); se recorta a 80. */
export function limpiar(q: unknown): string | null {
  if (typeof q !== "string") return null;
  const t = q.replace(/\s+/g, " ").trim().toLowerCase();
  if (t.length < 4) return null;
  if (/@|https?:|www\.|\d{5,}/.test(t)) return null;
  return t.slice(0, 80).trim();
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  if (!env.CONSULTAS) return new Response(null, { status: 204 });
  let cuerpo: { q?: unknown; i?: unknown };
  try {
    const texto = await request.text();
    if (texto.length > 1000) return new Response(null, { status: 204 });
    cuerpo = JSON.parse(texto) as { q?: unknown; i?: unknown };
  } catch {
    return new Response(null, { status: 204 });
  }
  const q = limpiar(cuerpo.q);
  if (!q) return new Response(null, { status: 204 });
  const clave = `q:${q}`;
  const previo = (await env.CONSULTAS.get(clave, "json")) ?? { n: 0, i: 0, m: "" };
  const registro: Registro = {
    n: previo.n + 1,
    i: previo.i + (cuerpo.i === true ? 1 : 0),
    m: new Date().toISOString().slice(0, 7),
  };
  // Caduca a los seis meses de la última vez que se hizo.
  await env.CONSULTAS.put(clave, JSON.stringify(registro), { expirationTtl: 180 * 24 * 3600 });
  return new Response(null, { status: 204 });
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const dada = request.headers.get("X-Clave") ?? "";
  if (!env.CLAVE_CONSULTAS || dada.length < 16 || dada !== env.CLAVE_CONSULTAS)
    return json({ error: "clave" }, 401);
  if (!env.CONSULTAS) return json({ consultas: [] });
  const nombres: string[] = [];
  let cursor: string | undefined;
  do {
    const pagina = await env.CONSULTAS.list({ prefix: "q:", limit: 1000, cursor });
    nombres.push(...pagina.keys.map((k) => k.name));
    cursor = pagina.list_complete ? undefined : pagina.cursor;
  } while (cursor && nombres.length < 5000);
  const consultas = (
    await Promise.all(
      nombres.map(async (nombre) => {
        const r = await env.CONSULTAS!.get(nombre, "json");
        return r ? { q: nombre.slice(2), ...r } : null;
      }),
    )
  )
    .filter((x): x is Registro & { q: string } => !!x)
    .sort((a, b) => b.n - a.n || a.q.localeCompare(b.q));
  return json({ consultas });
}
