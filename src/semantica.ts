/* Búsqueda por el sentido: pide a /api/pasajes (función de Cloudflare con el modelo de
   significado de Workers AI) los pasajes más parecidos a lo que se busca, para fundirlos con los
   del buscador por palabras (fusionar, respuestas.ts). Es una mejora, nunca un requisito: sin
   conexión, con la función caída o si tarda más de 3 s, la búsqueda sigue solo por palabras.
   Se manda solo el texto buscado; la función no lo guarda. */
import { useEffect, useState } from "react";

export interface Parecido {
  id: string;
  s: number;
}

const URL_PASAJES = new URL(/* @vite-ignore */ "../api/pasajes", import.meta.url).href;
const memoria = new Map<string, Promise<Parecido[]>>();

const valido = (x: unknown): x is Parecido =>
  !!x &&
  typeof (x as Parecido).id === "string" &&
  typeof (x as Parecido).s === "number" &&
  Number.isFinite((x as Parecido).s);

export function pedirParecidos(q: string): Promise<Parecido[]> {
  const clave = q.replace(/\s+/g, " ").trim().toLowerCase().slice(0, 300);
  if (clave.length < 3 || (typeof navigator !== "undefined" && navigator.onLine === false))
    return Promise.resolve([]);
  const ya = memoria.get(clave);
  if (ya) return ya;
  const control = new AbortController();
  const plazo = setTimeout(() => control.abort(), 3000);
  const pedido = fetch(URL_PASAJES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: clave }),
    signal: control.signal,
  })
    .then((r) => (r.ok ? r.json() : { parecidos: [] }))
    .then((d: { parecidos?: unknown }) =>
      Array.isArray(d.parecidos) ? d.parecidos.filter(valido).slice(0, 10) : [],
    )
    .catch(() => [] as Parecido[])
    .finally(() => clearTimeout(plazo));
  // Un fallo no se recuerda: la siguiente vez se vuelve a intentar.
  pedido.then((p) => {
    if (!p.length) memoria.delete(clave);
  });
  memoria.set(clave, pedido);
  return pedido;
}

/* Los parecidos de lo que se está escribiendo, cuando se para de escribir (400 ms). Mientras
   llegan, la búsqueda enseña lo de las palabras. */
export function useParecidos(q: string, activo = true): Parecido[] {
  const [estado, setEstado] = useState<{ q: string; p: Parecido[] }>({ q: "", p: [] });
  useEffect(() => {
    if (!activo || q.trim().length < 3) return;
    let vivo = true;
    const t = setTimeout(() => {
      pedirParecidos(q).then((p) => {
        if (vivo) setEstado({ q, p });
      });
    }, 400);
    return () => {
      vivo = false;
      clearTimeout(t);
    };
  }, [q, activo]);
  return estado.q === q ? estado.p : [];
}
