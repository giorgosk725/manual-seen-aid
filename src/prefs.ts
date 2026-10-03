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

/* ---------- Lectura: seguir donde lo dejaste, apartados leídos y favoritos ----------
   Solo rutas de la app y títulos de interfaz; nunca datos clínicos ni de pacientes. Se
   guardan en este navegador y se sincronizan entre componentes con un evento propio. */
const EVENTO = "mseen:lectura";
const leerJSON = <T>(clave: string, defecto: T): T => {
  try {
    const v = leer(clave);
    return v ? (JSON.parse(v) as T) : defecto;
  } catch {
    return defecto;
  }
};
const guardarJSON = (clave: string, valor: unknown) => {
  guardar(clave, JSON.stringify(valor));
  try {
    window.dispatchEvent(new Event(EVENTO));
  } catch {
    /* sin ventana (pruebas) */
  }
};
function useLectura<T>(clave: string, defecto: T): T {
  const [v, setV] = useState<T>(() => leerJSON(clave, defecto));
  useEffect(() => {
    const on = () => setV(leerJSON(clave, defecto));
    window.addEventListener(EVENTO, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENTO, on);
      window.removeEventListener("storage", on);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);
  return v;
}

export interface Marcador {
  ruta: string;
  titulo: string;
}

/* Último punto de lectura: apartado y bloque visible. */
export const guardarUltimo = (m: Marcador & { slug: string }) => guardarJSON("mseen:ultimo", m);
export const useUltimo = () =>
  useLectura<(Marcador & { slug: string }) | null>("mseen:ultimo", null);

/* Apartados leídos (se marcan al llegar al final). */
export const marcarLeido = (slug: string) => {
  const l = leerJSON<string[]>("mseen:leidos", []);
  if (!l.includes(slug)) guardarJSON("mseen:leidos", [...l, slug]);
};
export const useLeidos = () => useLectura<string[]>("mseen:leidos", []);

/* Favoritos: pantallas que el lector guarda para volver. */
export const alternarFavorito = (m: Marcador) => {
  const f = leerJSON<Marcador[]>("mseen:favoritos", []);
  guardarJSON(
    "mseen:favoritos",
    f.some((x) => x.ruta === m.ruta) ? f.filter((x) => x.ruta !== m.ruta) : [...f, m],
  );
};
export const useFavoritos = () => useLectura<Marcador[]>("mseen:favoritos", []);
