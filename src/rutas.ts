/* Rutas hash de tres niveles (patrón de asistente-aid): #/seccion/sub/detalle.
   Sin librería: el hash es el estado, así cualquier pantalla se puede enlazar y la PWA
   funciona servida desde cualquier subruta. */
import { useEffect, useState } from "react";

export interface Ruta {
  seccion: string;
  sub?: string;
  detalle?: string;
}

/* Un «%» mal formado (p. ej. un enlace reescrito por una app de mensajería) no debe romper la
   app: se devuelve el segmento tal cual. */
function decodificar(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function parseHash(hash: string): Ruta {
  const limpio = (hash || "").replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!limpio) return { seccion: "" };
  const [seccion, sub, detalle] = limpio.split("/").map(decodificar);
  return { seccion: seccion || "", sub: sub || undefined, detalle: detalle || undefined };
}

export const href = (seccion: string, sub?: string, detalle?: string) =>
  "#/" +
  [seccion, sub, detalle]
    .filter((x): x is string => !!x)
    // Los dos puntos («situacion:sistema», «T1:omnipod-5») se dejan legibles en la URL.
    .map((x) => encodeURIComponent(x).replace(/%3A/g, ":"))
    .join("/");

/* Navegación «nueva» (enlace o botón que lleva a otra pantalla): la Shell sube al principio.
   Sin esta marca (Atrás/Adelante, URL escrita) se restaura la posición guardada. */
let navegacionNueva = false;
export const marcarNavegacionNueva = () => {
  navegacionNueva = true;
};
export const consumirNavegacionNueva = () => {
  const v = navegacionNueva;
  navegacionNueva = false;
  return v;
};

export function navegar(
  seccion: string,
  sub?: string,
  detalle?: string,
  { reemplazar = false }: { reemplazar?: boolean } = {},
) {
  const destino = href(seccion, sub, detalle);
  if (reemplazar) {
    // Elegir una opción dentro de la misma pantalla (tramo, paso, sistema): no apila historial.
    window.location.replace(destino);
  } else {
    marcarNavegacionNueva();
    window.location.hash = destino;
  }
}

/* Selección dentro de una pantalla: actualiza la URL (enlazable) sin crear una entrada nueva. */
export const elegirRuta = (seccion: string, sub?: string, detalle?: string) =>
  navegar(seccion, sub, detalle, { reemplazar: true });

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
