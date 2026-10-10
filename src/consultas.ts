/* Consultas sin respuesta: cuando una búsqueda no encuentra ningún pasaje ni pregunta frecuente,
   la app manda solo su texto a /api/sin-respuesta (functions/api/sin-respuesta.ts), que cuenta
   cuántas veces se ha hecho. Sin ningún dato de quién la hizo. Una vez por consulta y sesión;
   sin conexión o si la función falla, no pasa nada. */
import { useEffect } from "react";

export const URL_SIN_RESPUESTA = new URL(/* @vite-ignore */ "../api/sin-respuesta", import.meta.url)
  .href;
const CLAVE = "mseen:sin-respuesta";

const mandadas = (): Set<string> => {
  try {
    const v = sessionStorage.getItem(CLAVE);
    return new Set(v ? (JSON.parse(v) as string[]) : []);
  } catch {
    return new Set();
  }
};

/* Lo mismo que descarta la función: correos, URL, cifras largas, muy corto o muy largo. */
export function consultaRegistrable(q: string): string | null {
  const t = q.replace(/\s+/g, " ").trim().toLowerCase();
  if (t.length < 4 || t.length > 120) return null;
  if (/@|https?:|www\.|\d{5,}/.test(t)) return null;
  return t;
}

export function registrarSinRespuesta(q: string, conIndice: boolean) {
  const t = consultaRegistrable(q);
  if (!t || typeof navigator === "undefined" || navigator.onLine === false) return;
  const ya = mandadas();
  if (ya.has(t)) return;
  ya.add(t);
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify([...ya].slice(-50)));
  } catch {
    /* sin almacenamiento: se manda igual */
  }
  fetch(URL_SIN_RESPUESTA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: t, i: conIndice }),
    keepalive: true,
  }).catch(() => undefined);
}

/* Cuando la búsqueda lleva 2 s sin respuesta (y el lector ha dejado de escribir), se registra. */
export function useRegistroSinRespuesta(q: string, sinRespuesta: boolean, conIndice: boolean) {
  useEffect(() => {
    if (!sinRespuesta) return;
    const t = setTimeout(() => registrarSinRespuesta(q, conIndice), 2000);
    return () => clearTimeout(t);
  }, [q, sinRespuesta, conIndice]);
}
