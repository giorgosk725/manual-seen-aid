/* Preferencias del lector (solo preferencias de interfaz, nunca datos clínicos): modo
   nocturno y tamaño de letra de lectura. localStorage con tolerancia a bloqueo. */
import { useCallback, useEffect, useState } from "react";

const leer = (clave: string): string | null => {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return null;
  }
};
const guardar = (clave: string, valor: string) => {
  try {
    window.localStorage.setItem(clave, valor);
  } catch {
    /* almacenamiento bloqueado: la preferencia dura la visita */
  }
};

export function useNocturno(): [boolean, () => void] {
  const [night, setNight] = useState(() => leer("mseen:night") === "1");
  useEffect(() => {
    document.documentElement.classList.toggle("night", night);
    guardar("mseen:night", night ? "1" : "0");
  }, [night]);
  const toggle = useCallback(() => setNight((n) => !n), []);
  return [night, toggle];
}

/* Tamaño de letra de la columna de lectura: 0 = base (18 px), -1, +1, +2. */
export const TAMANOS = [-1, 0, 1, 2] as const;
export type Tamano = (typeof TAMANOS)[number];

export function useTamanoLetra(): [Tamano, (t: Tamano) => void] {
  const [t, setT] = useState<Tamano>(() => {
    const v = Number(leer("mseen:letra") ?? "0");
    return (TAMANOS as readonly number[]).includes(v) ? (v as Tamano) : 0;
  });
  useEffect(() => {
    document.documentElement.dataset.letra = String(t);
    guardar("mseen:letra", String(t));
  }, [t]);
  return [t, setT];
}
