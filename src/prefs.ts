/* Preferencias del lector (solo preferencias de interfaz, nunca datos clínicos): modo
   nocturno y tamaño de letra de lectura. localStorage con tolerancia a bloqueo. */
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [night, setNight] = useState(() => {
    const guardado = leer("mseen:night");
    if (guardado !== null) return guardado === "1";
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });
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
   guardan en este navegador y se sincronizan entre componentes con un evento propio que
   lleva la clave. Lo leído se VALIDA por forma: un valor inesperado (otra versión, edición
   manual) se ignora y vale el defecto, en vez de romper la pantalla. */
const EVENTO = "mseen:lectura";

export interface Marcador {
  ruta: string;
  titulo: string;
}
type Validar<T> = (v: unknown) => T | undefined;

/* Solo rutas internas de la app («#/…»): un enlace guardado nunca sale de ella. */
const esMarcador = (x: unknown): x is Marcador =>
  !!x &&
  typeof x === "object" &&
  typeof (x as Marcador).ruta === "string" &&
  (x as Marcador).ruta.startsWith("#/") &&
  typeof (x as Marcador).titulo === "string";
const validarLeidos: Validar<string[]> = (v) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined;
const validarFavoritos: Validar<Marcador[]> = (v) =>
  Array.isArray(v) ? v.filter(esMarcador) : undefined;
const validarUltimo: Validar<(Marcador & { slug: string }) | null> = (v) =>
  esMarcador(v) && typeof (v as { slug?: unknown }).slug === "string"
    ? (v as Marcador & { slug: string })
    : undefined;

const interpretar = <T>(crudo: string | null, defecto: T, validar: Validar<T>): T => {
  if (!crudo) return defecto;
  try {
    const r = validar(JSON.parse(crudo));
    return r === undefined ? defecto : r;
  } catch {
    return defecto;
  }
};
const leerJSON = <T>(clave: string, defecto: T, validar: Validar<T>): T =>
  interpretar(leer(clave), defecto, validar);
const guardarJSON = (clave: string, valor: unknown) => {
  const nuevo = JSON.stringify(valor);
  if (leer(clave) === nuevo) return;
  guardar(clave, nuevo);
  try {
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: clave }));
  } catch {
    /* sin ventana (pruebas) */
  }
};
/* Se guarda el texto crudo en el estado: si no cambia, React no vuelve a pintar. */
function useLectura<T>(clave: string, defecto: T, validar: Validar<T>): T {
  const [crudo, setCrudo] = useState<string | null>(() => leer(clave));
  useEffect(() => {
    const on = (e: Event) => {
      if (e instanceof CustomEvent && e.detail !== clave) return;
      if (e instanceof StorageEvent && e.key !== null && e.key !== clave) return;
      setCrudo(leer(clave));
    };
    window.addEventListener(EVENTO, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENTO, on);
      window.removeEventListener("storage", on);
    };
  }, [clave]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => interpretar(crudo, defecto, validar), [crudo]);
}

/* Último punto de lectura: apartado y bloque visible. */
export const guardarUltimo = (m: Marcador & { slug: string }) => guardarJSON("mseen:ultimo", m);
export const useUltimo = () => useLectura("mseen:ultimo", null, validarUltimo);

/* Apartados leídos (se marcan al llegar al final). */
export const marcarLeido = (slug: string) => {
  const l = leerJSON("mseen:leidos", [], validarLeidos);
  if (!l.includes(slug)) guardarJSON("mseen:leidos", [...l, slug]);
};
export const useLeidos = () => useLectura("mseen:leidos", [], validarLeidos);

/* Favoritos: pantallas que el lector guarda para volver. */
export const alternarFavorito = (m: Marcador) => {
  const f = leerJSON("mseen:favoritos", [], validarFavoritos);
  guardarJSON(
    "mseen:favoritos",
    f.some((x) => x.ruta === m.ruta) ? f.filter((x) => x.ruta !== m.ruta) : [...f, m],
  );
};
export const useFavoritos = () => useLectura("mseen:favoritos", [], validarFavoritos);

/* Formato de impresión de las hojas para el paciente: una cara con letra pequeña (a dos
   columnas) o dos caras con letra grande (una columna). */
export type FormatoHoja = "una-cara" | "letra-grande";
const validarFormatoHoja: Validar<FormatoHoja> = (v) =>
  v === "una-cara" || v === "letra-grande" ? v : undefined;
export const useFormatoHoja = () =>
  useLectura<FormatoHoja>("mseen:hoja", "una-cara", validarFormatoHoja);
export const guardarFormatoHoja = (f: FormatoHoja) => guardarJSON("mseen:hoja", f);

/* Borra todas las preferencias de esta app en el navegador (botón del aviso de fallo). */
export function restablecerPreferencias() {
  try {
    const claves: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith("mseen:")) claves.push(k);
    }
    claves.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* almacenamiento bloqueado: no hay nada que borrar */
  }
}
