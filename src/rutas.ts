/* Rutas hash de tres niveles (patrón de asistente-aid): #/seccion/sub/detalle.
   Sin librería: el hash es el estado, así cualquier pantalla se puede enlazar y la PWA
   funciona servida desde cualquier subruta. */
import { useEffect, useState } from "react";

export interface Ruta {
  seccion: string;
  sub?: string;
  detalle?: string;
}

export function parseHash(hash: string): Ruta {
  const limpio = (hash || "").replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!limpio) return { seccion: "" };
  const [seccion, sub, detalle] = limpio.split("/").map((s) => decodeURIComponent(s));
  return { seccion: seccion || "", sub: sub || undefined, detalle: detalle || undefined };
}

export const href = (seccion: string, sub?: string, detalle?: string) =>
  "#/" +
  [seccion, sub, detalle]
    .filter((x): x is string => !!x)
    // Los dos puntos («situacion:sistema», «T1:omnipod-5») se dejan legibles en la URL.
    .map((x) => encodeURIComponent(x).replace(/%3A/g, ":"))
    .join("/");

export function navegar(seccion: string, sub?: string, detalle?: string) {
  window.location.hash = href(seccion, sub, detalle);
}

export function useRuta(): Ruta {
  const [ruta, setRuta] = useState<Ruta>(() =>
    parseHash(typeof window !== "undefined" ? window.location.hash : ""),
  );
  useEffect(() => {
    const onHash = () => setRuta(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return ruta;
}

/* Secciones de primer nivel (nombres de la interfaz; cada concepto un único hogar). */
export const SECCIONES = {
  capitulo: "capitulo",
  consultar: "consultar",
  buscar: "buscar",
  bibliografia: "bibliografia",
  cambios: "cambios",
  sobre: "sobre",
  test: "test",
} as const;
